/**
 * This is an example of a Custom Authentication Provider that implements the OAuth 2.0 Password Grant flow
 * for Smart Communications.  It can be updated for other OAuth2.0 Servers and even modified to support
 * the OAuth 2.0 Client Credentials grant.
 * 
 * A few interesting examples I drew ideas from:
 * 
 *  https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_class_Auth_AuthProviderPluginClass.htm#apex_class_Auth_AuthProviderPluginClass
 *  https://github.com/bobbywhitesfdc/ApigeeAuthProvider/blob/master/force-app/main/default/classes/ApigeeAuthProvider.cls
 *  https://github.com/rahulmalhotra/Salesforce-Custom-Authentication-Provider-Template/blob/master/src/classes/CustomAuthProviderTemplate.cls
 *  https://www.sfdcstop.com/2018/11/create-custom-authentication-provider.html
 * 
 * @author Joe McMaster (jmcmaster@vlocity.com)
 * @version 1.0
 * 
 * History
 * =======
 * July 19, 2019 - Initial Version (v1.0)
 * 
 */
public class SmartCommunications extends Auth.AuthProviderPluginClass {

    // Provider Name
    public static final String PROVIDER_NAME = SmartCommunications.class.getName();
    
    // Create a Custom Metadata Type in Salesforce using the following name, and the subsequent custom fields
    public static final String CUSTOM_METADATA_TYPE = 'SmartCommunications__mdt';

    public String redirectUrl;
    
    // Custom Metadata Type Fields
    public static final String MD_ACCESS_TOKEN_URL = 'accessTokenUrl__c'; // Token Endpoint URL, URL
    public static final String MD_REDIRECT_URL     = 'redirectUri__c';    // Callback URI, URL
    public static final String MD_CLIENT_ID        = 'clientId__c';       // Consumer Key, Text(255)
    public static final String MD_CLIENT_SECRET    = 'clientSecret__c';   // Consumer Secret, Text(255)	
    public static final String MD_USERNAME         = 'username__c';       // Username, Text(255)
    public static final String MD_PASSWORD         = 'password__c';       // Password, Text(255)
    public static final String MD_CREDS_IN_HEADER  = 'credsInHeader__c';  // Send client credentials in header, Checkbox(true)
    public static final String MD_SCOPE            = 'scope__c';          // Default Scopes, Text(255)
    
    /**
     * Returns the Custom Metadata Type API name
     * 
     * @return The Custom Metadata Type related to this OAuth2.0 Provider
     */
    public String getCustomMetadataType() {
        
        return CUSTOM_METADATA_TYPE;
    }
    
   /**
    * In the OAuth2.0 Password Grant, there is no need direct the user to a page for authorization before redirecting them
    * back to the Provider's Callback URL .  Therefore, this method will immediately redirect the user back to the Provider's
    * Callback URL, essentially skipping this step.
    * 
    * @param config  The Provider configuration
    * @param state   An anti-forgery state token that is sent (and expected to be echo'ed within the redirect URL as a parameter)
    * 
    * @return The PageReference where the user will be redirected
    */
    public PageReference initiate(Map<String, String> config, String state) {
        
        System.debug('JOE - Authorizing');
        System.debug('JOE - Authorization Config -> ' + JSON.serialize(config));

        // Generate the Provider's Callback URL
        // https://{salesforce-hostname}/services/authcallback/{urlsuffix}
        //String callbackURL = URL.getSalesforceBaseUrl().toExternalForm() + '/services/authcallback/' + config.get('Auth_Provider_Name__c');
        String callbackURL = config.get(MD_REDIRECT_URL);
        
        PageReference pageRef = new PageReference(callbackURL);
        pageRef.getParameters().put('state', state); // anti-forgery state token must be echo'ed back
        pageRef.getParameters().put('code', 'dummy'); // In the Authorization Code Grant, this would contain the authorization code.  It is ignored for this flow so we'll fake it!
        
        System.debug('JOE - Authorization Redirect to -> ' + pageRef.getUrl());
        
        return pageRef;
    } 

	/**
	 * This handles the callback after the authorization step above.  In this flow we have implemented the OAuth 2.0 Password Grant
	 * Error handling here is a bit painful as the UI never displays the exception or error message supplied here.  The exception
	 * is thrown for Logging/Debugging purposes only. 
	 * 
	 * @param config  The Provider configuration
	 * @param state   An anti-forgery state token that was received in the callback
	 * 
	 * @return The Token Response
     */
    public Auth.AuthProviderTokenResponse handleCallback(Map<String, String> config, Auth.AuthProviderCallbackState state ) {
        
        System.debug('JOE - Token Request');
        System.debug('JOE - Token Request Config -> ' + JSON.serialize(config));
        
        Map<String, Object> tokenResponse = requestToken(config, null);
        System.debug('JOE - Token Response -> ' + JSON.serialize(tokenResponse));
        
        String oauthSecretOrRefreshToken = (String)tokenResponse.get('refresh_token');
        if (oauthSecretOrRefreshToken == null) oauthSecretOrRefreshToken = config.get(MD_CLIENT_SECRET);
        
		return new Auth.AuthProviderTokenResponse(PROVIDER_NAME, (String)tokenResponse.get('access_token'), oauthSecretOrRefreshToken, state.queryParameters.get('state'));
    }

    /**
     * Attempts to refresh the access token if it has expired.
     * 
     * @param config        The Provider configuration
     * @param refreshToken  The refresh token
     * 
     * @return The Refresh Result
     */
    public override Auth.OAuthRefreshResult refresh(Map<String, String> config, String refreshToken) {
        
        System.debug('JOE - Refresh Token Request');
        System.debug('JOE - Refresh Token Request Config -> ' + JSON.serialize(config));
        
        Map<String, Object> tokenResponse = requestToken(config, refreshToken);
        System.debug('JOE - Refresh Token Response -> ' + JSON.serialize(tokenResponse));
        
        // Update Refresh Token if we've been sent a new one
        String newRefreshToken = (String)tokenResponse.get('refresh_token');
        if (newRefreshToken == null) newRefreshToken = refreshToken;
        
        return new Auth.OAuthRefreshResult((String)tokenResponse.get('access_token'), newRefreshToken);
    }

    /**
     * Generates and makes a request for a new (or refreshed) access token, returning the response.
     * 
     * @param config        The Provider configuration
     * @param refreshToken  The refresh token (if this is for a refresh), can be null for a new token
     * 
     * @return The Token Response
	 */
    private Map<String, Object> requestToken(Map<String, String> config, String refreshToken) {
        
        // Generate the Token Request
        HttpRequest req = new HttpRequest();
        req.setEndpoint(config.get(MD_ACCESS_TOKEN_URL));        
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        req.setMethod('POST');
        
        Map<String,String> params = new Map<String,String>();
        
        if (refreshToken != null) {
            params.put('grant_type', 'refresh_token');
            params.put('refresh_token', refreshToken);
        }
        else {
        	params.put('grant_type', 'password');
            params.put('username', config.get(MD_USERNAME));
        	params.put('password', config.get(MD_PASSWORD));
        }
        
        // Add credentials in header, or body
        if (Boolean.valueOf(config.get(MD_CREDS_IN_HEADER))) {
            req.setHeader('Authorization', 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(config.get(MD_CLIENT_ID) + ':' + config.get(MD_CLIENT_SECRET))));
        }
        else {
            params.put('client_id', config.get(MD_CLIENT_ID));
            params.put('client_secret', config.get(MD_CLIENT_SECRET));
        }
        
        // Add Scopes (if any have been provided)
        String scope = config.get(MD_SCOPE);
        if (scope != null && scope.length() > 0) params.put('scope', scope);
        
        String urlParams = '';
        for (String key : params.keySet()) {
            
            if (!String.isEmpty(urlParams)) urlParams += '&';
            urlParams += key + '=' + params.get(key);
        }
        req.setBody(urlParams);
        
        // Send the Token Request
        HTTPResponse res = new Http().send(req);
        
        // Process the response
        Integer statusCode = res.getStatusCode();
        System.debug('JOE - Token Response Status: ' + statusCode);
        if (statusCode == 200) return (Map<String, Object>)System.JSON.deserializeUntyped(res.getBody());
		else throw new TokenException('Token Response Code: ' + statusCode + ' -> ' + System.JSON.deserializeUntyped(res.getBody()));        
    }
    
    /*
     * This method is required by the Parent class, but not fully supported by this provider.
     * Effectively the Password Grant flow is only useful for Server-to-Server API integrations
     * and cannot be used for other contexts such as a Registration Handler for Communities.
     * 
     * NOTE: I doubt this method actually works at all, so we need a solid use-case to exercise
     *       the code and work out the kinks.
     * 
     * @param config    The Provider configuration
     * @param response  The Token Response
     * 
     * @return The User Data
     */
    public Auth.UserData getUserInfo(Map<String, String> config, Auth.AuthProviderTokenResponse response) {
        
        System.debug('JOE - getUserInfo');
        Map<String, Object> tokenResponse = requestToken(config, null);

        final Auth.UserData userData = new Auth.UserData(
              (String)tokenResponse.get('application_name'), // identifier
              null, // firstName
              null, // lastName
              null, // fullName
              (String)tokenResponse.get('developer_email'), // email
              null, // link
              (String)tokenResponse.get('developer_email'), // userName
              null,  //locale
              PROVIDER_NAME, //provider
              null, // siteLoginUrl
              new Map<String,String>()
        );
        
        return userData;
    }

    /*
     * Custom exception type so we can wrap and rethrow
     */
    public class TokenException extends Exception {}
}
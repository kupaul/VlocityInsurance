<%@page session="false"
        import="java.util.Arrays,
                com.day.cq.wcm.webservicesupport.Configuration,
    			org.apache.sling.api.resource.ModifiableValueMap,
                com.day.cq.wcm.webservicesupport.ConfigurationManager,
                com.day.cq.wcm.foundation.Placeholder,
                com.adobe.cq.mcm.salesforce.SalesforceClient,
                com.adobe.cq.mcm.salesforce.SalesforceException,
                com.adobe.cq.mcm.salesforce.SalesforceResponse,
				com.adobe.granite.crypto.CryptoSupport,
				com.adobe.granite.crypto.CryptoException,
                com.day.cq.i18n.I18n" %>
<%--
Vlocity Omniscript Component
Handles authentication using cloudservices configureation Hosts Omniscript page in iframe.
--%>
<%@include file="/libs/foundation/global.jsp"%>
<cq:defineObjects />
<%@page contentType="text/html; charset=utf-8" %>
<% // Pass server's Salesforce-AEM CloudServices to client page
    I18n i18n = new I18n(slingRequest.getResourceBundle(currentPage.getLanguage(false)));
    boolean cloudConfigFound = false;
    Resource configResource = null;
    String salesforceConfigPath = resource.getValueMap().get("cloudserviceconfig","");
    String[] cloudConfigs = pageProperties.getInherited("cq:cloudserviceconfigs", new String[]{});
    ConfigurationManager configurationManager = resourceResolver.adaptTo(ConfigurationManager.class);
    CryptoSupport cryptoSupport = sling.getService(CryptoSupport.class);
	String errors = "";


    SalesforceResponse connectionTestResponse = null;
    SalesforceResponse refreshResponse = null;

    // Retrieve Cloud Services Connection
    Configuration salesforceConfig = null;
    try{
        salesforceConfig = configurationManager.getConfiguration(salesforceConfigPath);
        if (salesforceConfig == null){
            if (salesforceConfigPath == ""){
            	throw new Exception ("No salesforce config path configured");
        	} else {
            	if ( Arrays.binarySearch(cloudConfigs, salesforceConfigPath) > 0 ){
                	String joinedString = String.join("\n", Arrays.asList(cloudConfigs));
                	throw new Exception ("Congfigured cloud service connection " + salesforceConfigPath + " is not available as inherited cq:cloudserviceconfigs :\n" + joinedString);
            	} else {
                	throw new Exception ("Congfigured cloud service connection " + salesforceConfigPath + " is available as inherited cq:cloudserviceconfigs, please ensure user has read permissions enabled");
            	}
        	}
        }
    } catch (Exception ex){
            errors+="<p>There has been an exception in retrieving the Cloud Services Connection</p>";
            errors+=ex.getMessage();
    }

    // Set Salesforce Client
    SalesforceClient salesforceClient = new SalesforceClient();
    boolean isExpired = false;
    boolean tokenUpdated = false;
    boolean tokenStored = false;

    if (salesforceConfig != null) {

        salesforceClient.setAccessToken(salesforceConfig.get("accesstoken",""));
        salesforceClient.setClientId(salesforceConfig.get("customerkey",""));
        salesforceClient.setInstanceURL(salesforceConfig.get("instanceurl",""));

        // Test connection
        String idStr = salesforceConfig.get("id","");
        int lastInd = idStr.lastIndexOf("/");
        String usrId = idStr.substring(lastInd+1);

        salesforceClient.setStringMethod("GET");
        salesforceClient.setContentType("application/json");
        salesforceClient.setPath("/services/data/v24.0/sobjects/User/" + usrId);
        try{
            salesforceClient.getAccessToken();
            connectionTestResponse = salesforceClient.executeRequest();
            isExpired = salesforceClient.isAccessTokenExpired(connectionTestResponse);
        } catch (SalesforceException se){
               errors+="<p>There has been a SalesforceException in establishing a connection</p>";
               errors+=se.getMessage();
        }catch (Exception ex){
               errors+="<p>There has been aan Exception in establishing a connection</p>";
               errors+=ex.getMessage();
        }

        // Refresh token if necessary
        if (isExpired || connectionTestResponse == null){
            try{
                String refreshtoken = salesforceConfig.get("refreshtoken","");
                String clientsecret = salesforceConfig.get("customersecret","");
                if (cryptoSupport.isProtected(refreshtoken)){
                    refreshtoken = cryptoSupport.unprotect(refreshtoken);
                }
                if (cryptoSupport.isProtected(clientsecret)){
                    clientsecret = cryptoSupport.unprotect(clientsecret);
                }

                salesforceClient.setClientSecret(clientsecret);
                salesforceClient.setRefreshToken(refreshtoken);

                // REFRESH
            	salesforceClient.getAccessToken();
                refreshResponse = salesforceClient.refreshAccessToken();
                tokenUpdated = refreshResponse.getAccessTokenUpdated();
            } catch (CryptoException ce){
                    errors+="<p>There has been a CryptoException in retrieving the Refresh Token</p>";
                    errors+=ce.getMessage();
            }catch(SalesforceException se){
                    errors+="<p>There has been a Salesforce Exception in refreshing the Access Token</p>";
                    errors+=se.getMessage();
            }catch(Exception ex){
                    errors+="<p>There has been an Exception in refreshing the Access Token</p>";
                    errors+=ex.getMessage();
            }
        }

        // update token on backend
        if(tokenUpdated){
            try {
                ModifiableValueMap sfCfgMap = salesforceConfig.getResource().getChild("jcr:content").adaptTo(ModifiableValueMap.class);
                sfCfgMap.put("accesstoken",salesforceClient.getAccessToken());
                sfCfgMap.put("refreshtoken",cryptoSupport.protect(salesforceClient.getRefreshToken()));
                sfCfgMap.put("customersecret",cryptoSupport.protect(salesforceClient.getClientSecret()));
                salesforceConfig.getResource().getChild("jcr:content").getResourceResolver().commit();
            } catch (Exception ex){
                log.error("Insufficient permissions to update Cloud Service Connection: " + ex.getMessage());
            }
        }
    }

    if (salesforceConfig != null) {
        boolean useProxy = !resource.getValueMap().get("skipProxy",false);
        String sNSOverride = resource.getValueMap().get("sNSOverride","");
        String instanceURL = salesforceConfig.get("instanceurl","");

        %>
            <cq:includeClientLib categories="angularjs"/>
            <cq:includeClientLib categories="angularForce"/>
            <script type="text/javascript">
                console.log('SFCSAuth.jsp embedded script')
                window.sfNameSpaceOverride = '<%= sNSOverride%>'
                var miniApp = angular.module('miniApp', ["forceng","ngRoute"])
                    .controller('ContactListCtrl',
                        function ($scope, force, $location, $route, $routeParams) {
                            force.init(
                                {
                                    useProxy: <%=useProxy%>,
                                    proxyURL: '<%=useProxy?resource.getValueMap().get("proxyURL","https://ooproxy.herokuapp.com"):instanceURL%>',
                                    accessToken: '<%= salesforceClient.getAccessToken() %>',
                                    instanceURL: '<%= instanceURL %>'
                                }
                            );
                            window.console.log("exposing connection for iframe");
                            window.VlocOmniOut = VlocOmniOut || new Object();
                            window.VlocOmniOut.force = force;
                        }
                    );
            </script>
            <body ng-app="miniApp" >
                <div ng-controller="ContactListCtrl" class='vlocity via-slds via-omni' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
                    <div class='test-container'>
                    </div>
                </div>
            </body>
        <%
    } else {
        %>
			<%= errors %>
		<%
    }
    // draw placeholder for UI mode touch
    boolean isAuthoringUIModeTouch = Placeholder.isAuthoringUIModeTouch(slingRequest);
    if (isAuthoringUIModeTouch) {
        %>
                <%= Placeholder.getDefaultPlaceholder(slingRequest, component, "") %>
        <%
    }
%>

/*
 * Copyright (c) 2011, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/* JavaScript library to wrap REST API on Visualforce. Leverages Ajax Proxy
 * (see http://bit.ly/sforce_ajax_proxy for details).
 *
 * Note that you must add the REST endpoint hostname for your instance (i.e. 
 * https://na1.salesforce.com/ or similar) as a remote site - in the admin
 * console, go to Your Name | Setup | Security Controls | Remote Site Settings
 */

var forcetk = window.forcetk;

if (forcetk === undefined) {
    forcetk = {};
}

if (forcetk.Client === undefined) {

    // We use $j rather than $ for jQuery so it works in Visualforce
    if (window.$j === undefined) {
        $j = $;
    }

    /**
     * The Client provides a convenient wrapper for the Force.com REST API, 
     * allowing JavaScript in Visualforce pages to use the API via the Ajax
     * Proxy.
     * @param [clientId=null] 'Consumer Key' in the Remote Access app settings
     * @param [loginUrl='https://login.salesforce.com/'] Login endpoint
     * @param [proxyUrl=null] Proxy URL. Omit if running on Visualforce or 
     *                  PhoneGap etc
     * @constructor
     */
    forcetk.Client = function(clientId, loginUrl, proxyUrl) {
        this.clientId = clientId;
        this.loginUrl = loginUrl || 'https://login.salesforce.com/';
        
        // vlc fix for community with customized path
        var bForceCom = false;
        var str1 = 'force.com';
        var str2 = 'visual.force.com';
        if(location.hostname.substring( location.hostname.length - str1.length, location.hostname.length ) === str1 &&
           location.hostname.substring( location.hostname.length - str2.length, location.hostname.length ) !== str2)  
           bForceCom = true;  
               
        if (typeof proxyUrl === 'undefined' || proxyUrl === null) {
            if (location.protocol === 'file:') {
                // In PhoneGap
                this.proxyUrl = null;
            } else {
                // In Visualforce
                this.proxyUrl = location.protocol + "//" + location.hostname;                
                
                // vlc fix
                if(bForceCom && location.pathname !== undefined && location.pathname !== null)
                {
                   var pathList = location.pathname.split("/");            
                   if(pathList !== undefined && pathList !== null && pathList.length > 1 && pathList[1] !== 'apex'
                      && pathList[1] !== '')
                   {
                      this.proxyUrl += '/' + pathList[1];            
                   }
                }
                this.proxyUrl += "/services/proxy";                    
            }
            this.authzHeader = "Authorization";
        } else {
            // On a server outside VF
            this.proxyUrl = proxyUrl;
            this.authzHeader = "X-Authorization";
        }
        this.refreshToken = null;
        this.sessionId = null;
        this.apiVersion = null;
        this.instanceUrl = null;
        this.asyncAjax = true;
    }

    /**
     * Set a refresh token in the client.
     * @param refreshToken an OAuth refresh token
     */
    forcetk.Client.prototype.setRefreshToken = function(refreshToken) {
        this.refreshToken = refreshToken;
    }

    /**
     * Refresh the access token.
     * @param callback function to call on success
     * @param error function to call on failure
     */
    forcetk.Client.prototype.refreshAccessToken = function(callback, error) {
        var that = this;
        var url = this.loginUrl + '/services/oauth2/token';
        return $j.ajax({
            type: 'POST',
            url: (this.proxyUrl !== null) ? this.proxyUrl: url,
            cache: false,
            processData: false,
            data: 'grant_type=refresh_token&client_id=' + this.clientId + '&refresh_token=' + this.refreshToken,
            success: callback,
            error: error,
            dataType: "json",
            beforeSend: function(xhr) {
                if (that.proxyUrl !== null) {
                    xhr.setRequestHeader('SalesforceProxy-Endpoint', url);
                }
            }
        });
    }

    /**
     * Set a session token and the associated metadata in the client.
     * @param sessionId a salesforce.com session ID. In a Visualforce page,
     *                   use '{!$Api.sessionId}' to obtain a session ID.
     * @param [apiVersion="21.0"] Force.com API version
     * @param [instanceUrl] Omit this if running on Visualforce; otherwise 
     *                   use the value from the OAuth token.
     */
    forcetk.Client.prototype.setSessionToken = function(sessionId, apiVersion, instanceUrl) {
        this.sessionId = sessionId;
        this.apiVersion = (typeof apiVersion === 'undefined' || apiVersion === null)
        ? 'v27.0': apiVersion;
        if (typeof instanceUrl === 'undefined' || instanceUrl == null) {
            // location.hostname can be of the form 'abc.na1.visual.force.com',
            // 'na1.salesforce.com' or 'abc.my.salesforce.com' (custom domains). 
            // Split on '.', and take the [1] or [0] element as appropriate
            
            // fix for case like onehealth.force.com
            var bNoChange = false;
            var elements = location.hostname.split(".");
            
            var instance = null;
            if(elements.length == 4 && elements[1] === 'my') {
                instance = elements[0] + '.' + elements[1];
            } else if(elements.length == 3){
                instance = elements[0];
                var str1 = 'force.com';
                var str2 = 'visual.force.com';
                if(location.hostname.substring( location.hostname.length - str1.length, location.hostname.length ) === str1 &&
                   location.hostname.substring( location.hostname.length - str2.length, location.hostname.length ) !== str2)
                    bNoChange = true;    
            } else {
                instance = elements[1];
            }
            
            this.instanceUrl = "https://" + instance + ".salesforce.com";
            
            if(bNoChange)
            {
                this.instanceUrl = "https://" + location.hostname;
               
                // vlc fix custom path
                var customPath = '';
                if(location.pathname !== undefined && location.pathname !== null)
                {
                    var pathList = location.pathname.split("/");
                    if(pathList !== undefined && pathList !== null && pathList.length > 1 && pathList[1] !== 'apex'
                       && pathList[1] !== '')
                    {           
                        customPath = pathList[1];
                    }
                }
                if(customPath !== '')
                    this.instanceUrl += '/' + customPath; 
            }             
        } else {
            this.instanceUrl = instanceUrl;
        }
    }

    /*
     * Low level utility function to call the Salesforce endpoint.
     * @param path resource path relative to /services/data
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     * @param [method="GET"] HTTP method for call
     * @param [payload=null] payload for POST/PATCH etc
     */
    forcetk.Client.prototype.ajax = function(path, callback, error, method, payload, retry) {
        var that = this;
        var url = this.instanceUrl + '/services/data' + path;

        return $j.ajax({
            type: method || "GET",
            async: this.asyncAjax,
            url: (this.proxyUrl !== null) ? this.proxyUrl: url,
            contentType: method == "DELETE"  ? null : 'application/json',
            cache: false,
            processData: false,
            data: payload,
            success: callback,
            error: (!this.refreshToken || retry ) ? error : function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                    that.refreshAccessToken(function(oauthResponse) {
                        that.setSessionToken(oauthResponse.access_token, null,
                        oauthResponse.instance_url);
                        that.ajax(path, callback, error, method, payload, true);
                    },
                    error);
                } else {
                    error(jqXHR, textStatus, errorThrown);
                }
            },
            dataType: "json",
            beforeSend: function(xhr) {
                if (that.proxyUrl !== null) {
                    xhr.setRequestHeader('SalesforceProxy-Endpoint', url);
                }
                xhr.setRequestHeader(that.authzHeader, "OAuth " + that.sessionId);
                xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + that.apiVersion);
            }
        });
    }

    /**
     * Utility function to query the Chatter API and download a file
     * Note, raw XMLHttpRequest because JQuery mangles the arraybuffer
     * This should work on any browser that supports XMLHttpRequest 2 because arraybuffer is required. 
     * For mobile, that means iOS >= 5 and Android >= Honeycomb
     * @author Tom Gersic
     * @param path resource path relative to /services/data
     * @param mimetype of the file
     * @param callback function to which response will be passed
     * @param [error=null] function to which request will be passed in case of error
     * @param rety true if we've already tried refresh token flow once
     **/
    forcetk.Client.prototype.getChatterFile = function(path,mimeType,callback,error,retry) {
        var that = this;
        var url = this.instanceUrl + path;

        var request = new XMLHttpRequest();
                  
        request.open("GET",  (this.proxyUrl !== null) ? this.proxyUrl: url, true);
        request.responseType = "arraybuffer";
        
        request.setRequestHeader(that.authzHeader, "OAuth " + that.sessionId);
        request.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + that.apiVersion);
        if (this.proxyUrl !== null) {
            request.setRequestHeader('SalesforceProxy-Endpoint', url);
        }
        
        request.onreadystatechange = function() {
            // continue if the process is completed
            if (request.readyState == 4) {
                // continue only if HTTP status is "OK"
                if (request.status == 200) {
                    try {
                        // retrieve the response
                        callback(request.response);
                    }
                    catch(e) {
                        // display error message
                        alert("Error reading the response: " + e.toString());
                    }
                }
                //refresh token in 401
                else if(request.status == 401 && !retry) {
                    that.refreshAccessToken(function(oauthResponse) {
                        that.setSessionToken(oauthResponse.access_token, null,oauthResponse.instance_url);
                        that.getChatterFile(path, mimeType, callback, error, true);
                    },
                    error);
                } 
                else {
                    // display status message
                    error(request,request.statusText,request.response);
                }
            }            
            
        }

        request.send();
        
    }

    /*
     * Low level utility function to call the Salesforce endpoint specific for Apex REST API.
     * @param path resource path relative to /services/apexrest
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     * @param [method="GET"] HTTP method for call
     * @param [payload=null] payload for POST/PATCH etc
	 * @param [paramMap={}] parameters to send as header values for POST/PATCH etc
	 * @param [retry] specifies whether to retry on error
     */
    forcetk.Client.prototype.apexrest = function(path, callback, error, method, payload, paramMap, retry) {
        var that = this;
        var url = (sfdcVars.sfdcOrgDomainUrl ? sfdcVars.sfdcOrgDomainUrl : this.instanceUrl) + '/services/apexrest' + path;

        return $j.ajax({
            type: method || "GET",
            async: this.asyncAjax,
            url: (this.proxyUrl !== null) ? this.proxyUrl: url,
            contentType: 'application/json',
            cache: false,
            processData: false,
            data: payload,
            success: callback,
            error: (!this.refreshToken || retry ) ? error : function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                    that.refreshAccessToken(function(oauthResponse) {
                        that.setSessionToken(oauthResponse.access_token, null,
                        oauthResponse.instance_url);
                        that.apexrest(path, callback, error, method, payload, paramMap, true);
                    },
                    error);
                } else {
                    error(jqXHR, textStatus, errorThrown);
                }
            },
            dataType: "json",
            beforeSend: function(xhr) {
                if (that.proxyUrl !== null) {
                    xhr.setRequestHeader('SalesforceProxy-Endpoint', url);
                }
				//Add any custom headers
				if (paramMap === null) {
					paramMap = {};
				}
				for (paramName in paramMap) {
					xhr.setRequestHeader(paramName, paramMap[paramName]);
				}
				if(that.authzHeader !== null)
                    xhr.setRequestHeader(that.authzHeader, "OAuth " + that.sessionId);
                xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + that.apiVersion);
            }
        });
    }

    /*
     * Lists summary information about each Salesforce.com version currently 
     * available, including the version, label, and a link to each version's
     * root.
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.versions = function(callback, error) {
        return this.ajax('/', callback, error);
    }

    /*
     * Lists available resources for the client's API version, including 
     * resource name and URI.
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.resources = function(callback, error) {
        return this.ajax('/' + this.apiVersion + '/', callback, error);
    }

    /*
     * Lists the available objects and their metadata for your organization's 
     * data.
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.describeGlobal = function(callback, error) {
        return this.ajax('/' + this.apiVersion + '/sobjects/', callback, error);
    }

    /*
     * Describes the individual metadata for the specified object.
     * @param objtype object type; e.g. "Account"
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.metadata = function(objtype, callback, error) {
        return this.ajax('/' + this.apiVersion + '/sobjects/' + objtype + '/'
        , callback, error);
    }

    /*
     * Completely describes the individual metadata at all levels for the 
     * specified object.
     * @param objtype object type; e.g. "Account"
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.describe = function(objtype, callback, error) {
        return this.ajax('/' + this.apiVersion + '/sobjects/' + objtype
        + '/describe/', callback, error);
    }

    /*
     * Creates a new record of the given type.
     * @param objtype object type; e.g. "Account"
     * @param fields an object containing initial field names and values for 
     *               the record, e.g. {:Name "salesforce.com", :TickerSymbol 
     *               "CRM"}
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.create = function(objtype, fields, callback, error) {
        return this.ajax('/' + this.apiVersion + '/sobjects/' + objtype + '/'
        , callback, error, "POST", JSON.stringify(fields));
    }

    /*
     * Retrieves field values for a record of the given type.
     * @param objtype object type; e.g. "Account"
     * @param id the record's object ID
     * @param [fields=null] optional comma-separated list of fields for which 
     *               to return values; e.g. Name,Industry,TickerSymbol
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.retrieve = function(objtype, id, fieldlist, callback, error) {
        if (arguments.length == 4) {
            error = callback;
            callback = fieldlist;
            fieldlist = null;
        }
        var fields = fieldlist ? '?fields=' + fieldlist : '';
        this.ajax('/' + this.apiVersion + '/sobjects/' + objtype + '/' + id
        + fields, callback, error);
    }

    /*
     * Upsert - creates or updates record of the given type, based on the 
     * given external Id.
     * @param objtype object type; e.g. "Account"
     * @param externalIdField external ID field name; e.g. "accountMaster__c"
     * @param externalId the record's external ID value
     * @param fields an object containing field names and values for 
     *               the record, e.g. {:Name "salesforce.com", :TickerSymbol 
     *               "CRM"}
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.upsert = function(objtype, externalIdField, externalId, fields, callback, error) {
        return this.ajax('/' + this.apiVersion + '/sobjects/' + objtype + '/' + externalIdField + '/' + externalId 
        + '?_HttpMethod=PATCH', callback, error, "POST", JSON.stringify(fields));
    }

    /*
     * Updates field values on a record of the given type.
     * @param objtype object type; e.g. "Account"
     * @param id the record's object ID
     * @param fields an object containing initial field names and values for 
     *               the record, e.g. {:Name "salesforce.com", :TickerSymbol 
     *               "CRM"}
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.update = function(objtype, id, fields, callback, error) {
        return this.ajax('/' + this.apiVersion + '/sobjects/' + objtype + '/' + id 
        + '?_HttpMethod=PATCH', callback, error, "POST", JSON.stringify(fields));
    }

    /*
     * Deletes a record of the given type. Unfortunately, 'delete' is a 
     * reserved word in JavaScript.
     * @param objtype object type; e.g. "Account"
     * @param id the record's object ID
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.del = function(objtype, id, callback, error) {
        return this.ajax('/' + this.apiVersion + '/sobjects/' + objtype + '/' + id
        , callback, error, "DELETE");
    }

    /*
     * Executes the specified SOQL query.
     * @param soql a string containing the query to execute - e.g. "SELECT Id, 
     *             Name from Account ORDER BY Name LIMIT 20"
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.query = function(soql, callback, error) {
        return this.ajax('/' + this.apiVersion + '/query?q=' + escape(soql)
        , callback, error);
    }
    
    /*
     * Queries the next set of records based on pagination.
     * <p>This should be used if performing a query that retrieves more than can be returned
     * in accordance with http://www.salesforce.com/us/developer/docs/api_rest/Content/dome_query.htm</p>
     * <p>Ex: forcetkClient.queryMore( successResponse.nextRecordsUrl, successHandler, failureHandler )</p>
     * 
     * @param url - the url retrieved from nextRecordsUrl or prevRecordsUrl
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.queryMore = function( url, callback, error ){
        //-- ajax call adds on services/data to the url call, so only send the url after
        var serviceData = "services/data";
        var index = url.indexOf( serviceData );
        
        if( index > -1 ){
        	url = url.substr( index + serviceData.length );
        } else {
        	//-- leave alone
        }
        
        return this.ajax( url, callback, error );
    }

    /*
     * Executes the specified SOSL search.
     * @param sosl a string containing the search to execute - e.g. "FIND 
     *             {needle}"
     * @param callback function to which response will be passed
     * @param [error=null] function to which jqXHR will be passed in case of error
     */
    forcetk.Client.prototype.search = function(sosl, callback, error) {
        return this.ajax('/' + this.apiVersion + '/search?q=' + escape(sosl)
        , callback, error);
    }
}

/**
 * ForceNG - REST toolkit for Salesforce.com
 * Author: Christophe Coenraets @ccoenraets
 * Version: 0.6.1
 */
angular.module('forceng', [])

  .factory('force', function ($rootScope, $q, $window, $http) {

    // The login URL for the OAuth process
    // To override default, pass loginURL in init(props)
    var loginURL = 'https://login.salesforce.com',

    // The Connected App client Id. Default app id provided - Not for production use.
    // This application supports http://localhost:8200/oauthcallback.html as a valid callback URL
    // To override default, pass appId in init(props)
    appId = '3MVG9szVa2RxsqBa5tQyU6.tKh61yiGXNhItGzvNJWh1oJh4fcI4pRlqlx1i2MLagkNovsmbaZfSE5mSZ6rCo',
    //appId = '3MVG9fMtCkV6eLheIEZplMqWfnGlf3Y.BcWdOf1qytXo9zxgbsrUbS.ExHTgUPJeb3jZeT8NYhc.hMyznKU92',

    // The force.com API version to use.
    // To override default, pass apiVersion in init(props)
      apiVersion = 'v36.0',

    // Keep track of OAuth data (access_token, refresh_token, and instance_url)
      oauth,

    // By default we store fbtoken in sessionStorage. This can be overridden in init()
      tokenStore = {},

    // if page URL is http://localhost:3000/myapp/index.html, context is /myapp
      context = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")),

    // if page URL is http://localhost:3000/myapp/index.html, serverURL is http://localhost:3000
      serverURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : ''),

    // if page URL is http://localhost:3000/myapp/index.html, baseURL is http://localhost:3000/myapp
      baseURL = serverURL + context,

    // Only required when using REST APIs in an app hosted on your own server to avoid cross domain policy issues
    // To override default, pass proxyURL in init(props)
      proxyURL = baseURL,

    // if page URL is http://localhost:3000/myapp/index.html, oauthCallbackURL is http://localhost:3000/myapp/oauthcallback.html
    // To override default, pass oauthCallbackURL in init(props)
      oauthCallbackURL = baseURL + '/oauthcallback.html',

    // Because the OAuth login spans multiple processes, we need to keep the login success and error handlers as a variables
    // inside the module instead of keeping them local within the login function.
      deferredLogin,
        
      deferredLogout,

    // Reference to the Salesforce OAuth plugin
      oauthPlugin,
        
    // Reference to the Salesforce Network plugin
      networkPlugin,        

    // Whether or not to use a CORS proxy. Defaults to false if app running in Cordova or in a VF page
    // Can be overriden in init()
      useProxy = (window.cordova || window.SfdcApp) ? false : true;
      
    if(window.VOmniForcengConAppId)  
      appId = window.VOmniForcengConAppId;
      
    /*
     * Determines the request base URL.
     */
    function getRequestBaseURL() {

      var url;

      if (useProxy) {
        url = proxyURL;
      } else if (oauth && oauth.instance_url) {
        url = oauth.instance_url;
      } else {
        url = serverURL;
      }

      // dev friendly API: Remove trailing '/' if any so url + path concat always works
      if (url.slice(-1) === '/') {
        url = url.slice(0, -1);
      }

      return url;
    }

    function parseQueryString(queryString) {
      var qs = decodeURIComponent(queryString),
        obj = {},
        params = qs.split('&');
      params.forEach(function (param) {
        var splitter = param.split('=');
        obj[splitter[0]] = splitter[1];
      });
      return obj;
    }

    function toQueryString(obj) {
      var parts = [],
        i;
      for (i in obj) {
        if (obj.hasOwnProperty(i)) {
          parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
      }
      return parts.join("&");
    }

    function refreshTokenWithPlugin(deferred) {
      oauthPlugin.authenticate(
        function (response) {
          oauth.access_token = response.accessToken;
          tokenStore.forceOAuth = JSON.stringify(oauth);
          deferred.resolve();
        },
        function () {
          console.log('Error refreshing oauth access token using the oauth plugin');
          deferred.reject();
        });
    }

    function refreshTokenWithHTTPRequest(deferred) {
      var params = {
          'grant_type': 'refresh_token',
          'refresh_token': oauth.refresh_token,
          'client_id': appId
        },

        headers = {},

        url = useProxy ? proxyURL : loginURL;

      // dev friendly API: Remove trailing '/' if any so url + path concat always works
      if (url.slice(-1) === '/') {
        url = url.slice(0, -1);
      }

      url = url + '/services/oauth2/token?' + toQueryString(params);

      if (!useProxy) {
        headers["Target-URL"] = loginURL;
      }

      $http({
        headers: headers,
        method: 'POST',
        url: url,
        params: params
      })
        .success(function (data, status, headers, config) {
          console.log('Token refreshed');
          oauth.access_token = data.access_token;
          tokenStore.forceOAuth = JSON.stringify(oauth);
          deferred.resolve();
        })
        .error(function (data, status, headers, config) {
          console.log('Error while trying to refresh token');
          deferred.reject();
        });
    }

    function refreshToken() {
      var deferred = $q.defer();
      if (oauthPlugin) {
        refreshTokenWithPlugin(deferred);
      } else {
        refreshTokenWithHTTPRequest(deferred);
      }
      return deferred.promise;
    }

    /**
     * Initialize ForceNG
     * @param params
     *  appId (optional)
     *  loginURL (optional)
     *  proxyURL (optional)
     *  oauthCallbackURL (optional)
     *  apiVersion (optional)
     *  accessToken (optional)
     *  instanceURL (optional)
     *  refreshToken (optional)
     */
    function init(params) {

      if (params) {
        appId = params.appId || appId;
        apiVersion = params.apiVersion || apiVersion;
        loginURL = params.loginURL || loginURL;
        oauthCallbackURL = params.oauthCallbackURL || oauthCallbackURL;
        proxyURL = params.proxyURL || proxyURL;
        useProxy = params.useProxy === undefined ? useProxy : params.useProxy;

        if (params.accessToken) {
          if (!oauth) oauth = {};
          oauth.access_token = params.accessToken;
        }

        if (params.instanceURL) {
          if (!oauth) oauth = {};
          oauth.instance_url = params.instanceURL;
        }else if(params.instanceUrl) {
          if (!oauth) oauth = {};
          oauth.instance_url = params.instanceUrl;            
        }else if(params.instance_url) {
          if (!oauth) oauth = {};
          oauth.instance_url = params.instanceURL;            
        }
          
        if (params.refreshToken) {
          if (!oauth) oauth = {};
          oauth.refresh_token = params.refreshToken;
        }
      }

      console.log("useProxy: " + useProxy);
    }
    
    function getOAuth(){
        return oauth;
    }

    /**
     * Discard the OAuth access_token. Use this function to test the refresh token workflow.
     */
    function discardToken() {
      delete oauth.access_token;
      tokenStore.forceOAuth = JSON.stringify(oauth);
    }

    /**
     * Called internally either by oauthcallback.html (when the app is running the browser)
     * @param url - The oauthCallbackURL called by Salesforce at the end of the OAuth workflow. Includes the access_token in the querystring
     */
    function oauthCallback(url) {

      // Parse the OAuth data received from Facebook
      var queryString,
        obj;

      if (url.indexOf("access_token=") > 0) {
        queryString = url.substr(url.indexOf('#') + 1);
        obj = parseQueryString(queryString);
        oauth = obj;
        tokenStore['forceOAuth'] = JSON.stringify(oauth);
        if (deferredLogin) deferredLogin.resolve(oauth);
      } else if (url.indexOf("error=") > 0) {
        queryString = decodeURIComponent(url.substring(url.indexOf('?') + 1));
        obj = parseQueryString(queryString);
        if (deferredLogin) deferredLogin.reject(obj);
      } else {
        if (deferredLogin) deferredLogin.reject({status: 'access_denied'});
      }
    }

    /**
     * Login to Salesforce using OAuth. If running in a Browser, the OAuth workflow happens in a a popup window.
     */
    function login() {
      deferredLogin = $q.defer();
      if (window.cordova) {
        loginWithPlugin();
      } else {
        loginWithBrowser();
      }
      return deferredLogin.promise;
    }

    function loginWithPlugin() {
      document.addEventListener("deviceready", function () {
        oauthPlugin = cordova.require("com.salesforce.plugin.oauth");
        networkPlugin = cordova.require("com.salesforce.plugin.network");
        if (!oauthPlugin) {
          console.error('Salesforce Mobile SDK OAuth plugin not available');
          if (deferredLogin) deferredLogin.reject({status: 'Salesforce Mobile SDK OAuth plugin not available'});
          return;
        }
        oauthPlugin.getAuthCredentials(
          function (creds) {
            // Initialize ForceJS
            init({accessToken: creds.accessToken, instanceURL: creds.instanceUrl, refreshToken: creds.refreshToken});
            if (deferredLogin) deferredLogin.resolve(creds);
          },
          function (error) {
            console.log(error);
            if (deferredLogin) deferredLogin.reject(error);
          }
        );
      }, false);
    }
    
    function loginWithBrowser() {
      console.log('loginURL: ' + loginURL);
      console.log('oauthCallbackURL: ' + oauthCallbackURL);

      var loginWindowURL = loginURL + '/services/oauth2/authorize?client_id=' + appId + '&redirect_uri=' +
        oauthCallbackURL + '&response_type=token';
      window.open(loginWindowURL, '_blank', 'location=no');
    }
    
    function logout(){
      deferredLogout = $q.defer();
      if (window.cordova) {
        logoutWithPlugin();
      } else {
        logoutWithBrowser();
      }
      return deferredLogout.promise;        
    }
    
    function logoutWithPlugin(){
      document.addEventListener("deviceready", function () {
        oauthPlugin = cordova.require("com.salesforce.plugin.oauth");
        if (!oauthPlugin) {
          console.error('Salesforce Mobile SDK OAuth plugin not available');
          if (deferredLogin) deferredLogin.reject({status: 'Salesforce Mobile SDK OAuth plugin not available'});
          return;
        }
        //logout method doesn't support callbacks.
        oauthPlugin.logout();
        if (deferredLogout) deferredLogout.resolve();
          
      }, false);
    }
    
    function logoutWithBrowser(){
        if (deferredLogout) deferredLogout.resolve();
    }

    /**
     * Gets the user's ID (if logged in)
     * @returns {string} | undefined
     */
    function getUserId() {
        //oauth.id could be undefined. it will throw error. 
        if(typeof(oauth) !== 'undefined') {
            if(oauth.id) {
                return oauth.id.split('/').pop();
            }
        }
        return undefined;
    }

    /**
     * Check the login status
     * @returns {boolean}
     */
    function isAuthenticated() {
      return (oauth && oauth.access_token) ? true : false;
    }

    /**
     * Lets you make any Salesforce REST API request.
     * @param obj - Request configuration object. Can include:
     *  method:  HTTP method: GET, POST, etc. Optional - Default is 'GET'
     *  path:    path in to the Salesforce endpoint - Required
     *  params:  queryString parameters as a map - Optional
     *  data:  JSON object to send in the request body - Optional
     */
    function request(obj) {
        // NB: networkPlugin will be defined only if login was done through plugin and container is using Mobile SDK 5.0 or above
        if (false && networkPlugin) { 
            return requestWithPlugin(obj);
        } else {
            return requestWithBrowser(obj);
        }       
    }
    
    /**
     * @param path: full path or path relative to end point - required
     * @param endPoint: undefined or endpoint - optional
     * @return object with {endPoint:XX, path:relativePathToXX}
     *
     * For instance for undefined, '/services/data'     => {endPoint:'/services/data', path:'/'}
     *                  undefined, '/services/apex/abc' => {endPoint:'/services/apex', path:'/abc'}
     *                  '/services/data, '/versions'    => {endPoint:'/services/data', path:'/versions'}
     */
    function computeEndPointIfMissing(endPoint, path) {
        if (endPoint !== undefined) {
            return {endPoint:endPoint, path:path};
        }
        else {
            var parts = path.split('/').filter(function(s) { return s !== ""; });
            if (parts.length >= 2) {
                return {endPoint: '/' + parts.slice(0,2).join('/'), path: '/' + parts.slice(2).join('/')};
            }
            else {
                return {endPoint: '', path:path};
            }
        }
    }   
    
    function requestWithPlugin(obj) {
        var deferred = $q.defer();
        
        var obj2 = computeEndPointIfMissing(obj.endPoint, obj.path);
        networkPlugin.sendRequest(obj2.endPoint, obj2.path, function(data){
            //success
            deferred.resolve(data);
        }, function(error){
            //failure
            deferred.reject(error);
        }, obj.method, obj.data || obj.params, obj.headerParams);    
        
        return deferred.promise;    
    }   
    
    function requestWithBrowser(obj) {
      var method = obj.method || 'GET',
        headers = {},
        url = getRequestBaseURL(),
        deferred = $q.defer();

      if (!oauth || (!oauth.access_token && !oauth.refresh_token)) {
        deferred.reject('No access token. Login and try again.');
        return deferred.promise;
      }

      // dev friendly API: Add leading '/' if missing so url + path concat always works
      if (obj.path.charAt(0) !== '/') {
        obj.path = '/' + obj.path;
      }

      url = url + obj.path;

      headers["Authorization"] = "Bearer " + oauth.access_token;
      if (obj.contentType) {
        headers["Content-Type"] = obj.contentType;
      }
      if (useProxy && oauth.instance_url) {
        headers["Target-URL"] = oauth.instance_url;
      }

      $http({
        headers: headers,
        method: method,
        url: url,
        params: obj.params,
        data: obj.data,
        timeout: 30000,
        responseType: 'json'
      })
        .then(
        function (data, status, headers, config) {  
          data = data.data;        
          deferred.resolve(data);
        },
        function (data, status, headers, config) {
          data = data.data;
          if ((status === 401 || status === 403) && oauth.refresh_token) {
            refreshToken()
              .then(function () {
                // Try again with the new token
                requestWithBrowser(obj).then(function(data) {
                    deferred.resolve(data);
                }, function(error){
                    deferred.reject(error);
                });
              }, function(){
                console.error(data);
                deferred.reject(data);                
            });
          } else {
              if (!data) {
                data = [{
                      'errorCode': 'Request Error',
                      'message': 'Can\'t connect to the server. Please try again!'

                 }]
              }

            deferred.reject(data);
          }

        });

      return deferred.promise;      
    }

    /**
     * Execute SOQL query
     * @param soql
     * @returns {*}
     */
    function query(soql) {

      return request({
        path: '/services/data/' + apiVersion + '/query',
        params: {q: soql}
      });

    }

    /**
     * Retrieve a record based on its Id
     * @param objectName
     * @param id
     * @param fields
     * @returns {*}
     */
    function retrieve(objectName, id, fields) {

      return request({
        path: '/services/data/' + apiVersion + '/sobjects/' + objectName + '/' + id,
        params: fields ? {fields: fields} : undefined
      });

    }

    /**
     * Create a record
     * @param objectName
     * @param data
     * @returns {*}
     */
    function create(objectName, data) {

      return request({
        method: 'POST',
        contentType: 'application/json',
        path: '/services/data/' + apiVersion + '/sobjects/' + objectName + '/',
        data: data
      });

    }

    /**
     * Update a record
     * @param objectName
     * @param data
     * @returns {*}
     */
    function update(objectName, data) {

      var id = data.Id,
        fields = angular.copy(data);

      delete fields.attributes;
      delete fields.Id;

      return request({
        method: 'POST',
        contentType: 'application/json',
        path: '/services/data/' + apiVersion + '/sobjects/' + objectName + '/' + id,
        params: {'_HttpMethod': 'PATCH'},
        data: fields
      });

    }

    /**
     * Delete a record
     * @param objectName
     * @param id
     * @returns {*}
     */
    function del(objectName, id) {

      return request({
        method: 'DELETE',
        path: '/services/data/' + apiVersion + '/sobjects/' + objectName + '/' + id
      });

    }

    /**
     * Upsert a record
     * @param objectName
     * @param externalIdField
     * @param externalId
     * @param data
     * @returns {*}
     */
    function upsert(objectName, externalIdField, externalId, data) {

      return request({
        method: 'PATCH',
        contentType: 'application/json',
        path: '/services/data/' + apiVersion + '/sobjects/' + objectName + '/' + externalIdField + '/' + externalId,
        data: data
      });

    }

    /**
     * Convenience function to invoke APEX REST endpoints
     * @param pathOrParams
     * @param successHandler
     * @param errorHandler
     */
    function apexrest(pathOrParams) {

      var params;

      if (pathOrParams.substring) {
        params = {path: pathOrParams};
      } else {
        params = pathOrParams;

        if (params.path.charAt(0) !== "/") {
          params.path = "/" + params.path;
        }

        if (params.path.substr(0, 18) !== "/services/apexrest") {
          params.path = "/services/apexrest" + params.path;
        }
      }

      return request(params);
    }

    /**
     * Convenience function to invoke the Chatter API
     * @param params
     * @param successHandler
     * @param errorHandler
     */
    function chatter(params) {

      var base = "/services/data/" + apiVersion + "/chatter";

      if (!params || !params.path) {
        errorHandler("You must specify a path for the request");
        return;
      }

      if (params.path.charAt(0) !== "/") {
        params.path = "/" + params.path;
      }

      params.path = base + params.path;

      return request(params);

    }
    
    function getURLs() {
        return {proxyURL:proxyURL,oauthCallbackURL:oauthCallbackURL,useProxy:useProxy};
    }

    // The public API
    return {
      init: init,
      getOAuth: getOAuth,        
      login: login,
      logout: logout,
      getUserId: getUserId,
      isAuthenticated: isAuthenticated,
      request: request,
      query: query,
      create: create,
      update: update,
      del: del,
      upsert: upsert,
      retrieve: retrieve,
      apexrest: apexrest,
      chatter: chatter,
      discardToken: discardToken,
      oauthCallback: oauthCallback,
      requestBaseURL:getRequestBaseURL,
      getURLs: getURLs
    };

  });

// Global function called back by the OAuth login dialog
function oauthCallback(url) {
  var injector = angular.element(document.body).injector();
  injector.invoke(function (force) {
    force.oauthCallback(url);
  });
}

/*
 * The MIT License (MIT)
 * Copyright (c) 2014 Daniel Campos
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// customized version of angular-input-masks from https://assisrafael.github.io/angular-input-masks/
(function(){
    var StringMask = (function() {
        var tokens = {
            '0': {
                pattern: /\d/,
                _default: '0'
            },
            '9': {
                pattern: /\d/,
                optional: true
            },
            '#': {
                pattern: /\d/,
                optional: true,
                recursive: true
            },
            'S': {
                pattern: /[a-zA-Z]/
            },
            'U': {
                pattern: /[a-zA-Z]/,
                transform: function(c) {
                    return c.toLocaleUpperCase();
                }
            },
            'L': {
                pattern: /[a-zA-Z]/,
                transform: function(c) {
                    return c.toLocaleLowerCase();
                }
            },
            '$': {
                escape: true
            }
        };

        function isEscaped(pattern, pos) {
            var count = 0;
            var i = pos - 1;
            var token = {
                escape: true
            };
            while (i >= 0 && token && token.escape) {
                token = tokens[pattern.charAt(i)];
                count += token && token.escape ? 1 : 0;
                i--;
            }
            return count > 0 && count % 2 === 1;
        }

        function calcOptionalNumbersToUse(pattern, value) {
            var numbersInP = pattern.replace(/[^0]/g, '').length;
            var numbersInV = value.replace(/[^\d]/g, '').length;
            return numbersInV - numbersInP;
        }

        function concatChar(text, character, options, token) {
            if (token && typeof token.transform === 'function') character = token.transform(character);
            if (options.reverse) return character + text;
            return text + character;
        }

        function hasMoreTokens(pattern, pos, inc) {
            var pc = pattern.charAt(pos);
            var token = tokens[pc];
            if (pc === '') return false;
            return token && !token.escape ? true : hasMoreTokens(pattern, pos + inc, inc);
        }

        function insertChar(text, char, position) {
            var t = text.split('');
            t.splice(position >= 0 ? position : 0, 0, char);
            return t.join('');
        }

        function StringMask(pattern, opt) {
            this.options = opt || {};
            this.options = {
                reverse: this.options.reverse || false,
                usedefaults: this.options.usedefaults || this.options.reverse
            };
            this.pattern = pattern;
        }

        StringMask.prototype.process = function proccess(value) {
            if (!value) return '';
            value = value + '';
            var pattern2 = this.pattern;
            var valid = true;
            var formatted = '';
            var valuePos = this.options.reverse ? value.length - 1 : 0;
            var optionalNumbersToUse = calcOptionalNumbersToUse(pattern2, value);
            var escapeNext = false;
            var recursive = [];
            var inRecursiveMode = false;

            var steps = {
                start: this.options.reverse ? pattern2.length - 1 : 0,
                end: this.options.reverse ? -1 : pattern2.length,
                inc: this.options.reverse ? -1 : 1
            };

            function continueCondition(options) {
                if (!inRecursiveMode && hasMoreTokens(pattern2, i, steps.inc)) {
                    return true;
                } else if (!inRecursiveMode) {
                    inRecursiveMode = recursive.length > 0;
                }

                if (inRecursiveMode) {
                    var pc = recursive.shift();
                    recursive.push(pc);
                    if (options.reverse && valuePos >= 0) {
                        i++;
                        pattern2 = insertChar(pattern2, pc, i);
                        return true;
                    } else if (!options.reverse && valuePos < value.length) {
                        pattern2 = insertChar(pattern2, pc, i);
                        return true;
                    }
                }
                return i < pattern2.length && i >= 0;
            }

            for (var i = steps.start; continueCondition(this.options); i = i + steps.inc) {
                var pc = pattern2.charAt(i);
                var vc = value.charAt(valuePos);
                var token = tokens[pc];
                if (!inRecursiveMode || vc) {
                    if (this.options.reverse && isEscaped(pattern2, i)) {
                        formatted = concatChar(formatted, pc, this.options, token);
                        i = i + steps.inc;
                        continue;
                    } else if (!this.options.reverse && escapeNext) {
                        formatted = concatChar(formatted, pc, this.options, token);
                        escapeNext = false;
                        continue;
                    } else if (!this.options.reverse && token && token.escape) {
                        escapeNext = true;
                        continue;
                    }
                }

                if (!inRecursiveMode && token && token.recursive) {
                    recursive.push(pc);
                } else if (inRecursiveMode && !vc) {
                    if (!token || !token.recursive) formatted = concatChar(formatted, pc, this.options, token);
                    continue;
                } else if (recursive.length > 0 && token && !token.recursive) {
                    // Recursive tokens most be the last tokens of the pattern
                    valid = false;
                    continue;
                } else if (!inRecursiveMode && recursive.length > 0 && !vc) {
                    continue;
                }

                if (!token) {
                    formatted = concatChar(formatted, pc, this.options, token);
                    if (!inRecursiveMode && recursive.length) {
                        recursive.push(pc);
                    }
                } else if (token.optional) {
                    if (token.pattern.test(vc) && optionalNumbersToUse) {
                        formatted = concatChar(formatted, vc, this.options, token);
                        valuePos = valuePos + steps.inc;
                        optionalNumbersToUse--;
                    } else if (recursive.length > 0 && vc) {
                        valid = false;
                        break;
                    }
                } else if (token.pattern.test(vc)) {
                    formatted = concatChar(formatted, vc, this.options, token);
                    valuePos = valuePos + steps.inc;
                } else if (!vc && token._default && this.options.usedefaults) {
                    formatted = concatChar(formatted, token._default, this.options, token);
                } else {
                    valid = false;
                    break;
                }
            }

            return {
                result: formatted,
                valid: valid
            };
        };

        StringMask.prototype.apply = function(value) {
            return this.process(value).result;
        };

        StringMask.prototype.validate = function(value) {
            return this.process(value).valid;
        };

        StringMask.process = function(value, pattern, options) {
            return new StringMask(pattern, options).process(value);
        };

        StringMask.apply = function(value, pattern, options) {
            return new StringMask(pattern, options).apply(value);
        };

        StringMask.validate = function(value, pattern, options) {
            return new StringMask(pattern, options).validate(value);
        };

        return StringMask;
    })();

    // CUSTOM, added by Vlocity to handle our global mask patterns
    var patternMatch = /^(.*?)(?:[\d#]+([^\n\d#])(?:[\d#]+\2)*)?[\d#]+(?:([^\n\d#\2])[\d#]*)?(.*?)$/;

    angular.module('ui.utils.masks.helpers', [])
        .factory('PreFormatters', [function() {
            function clearDelimitersAndLeadingZeros(value) {
                var cleanValue = value.replace(/^-/, '').replace(/^(?:0(?!\.|$))+/, '');
                cleanValue = cleanValue.replace(/[^0-9]/g, '');
                return cleanValue;
            }

            function prepareNumberToFormatter(value, decimals) {
                return clearDelimitersAndLeadingZeros((parseFloat(value)).toFixed(decimals));
            }

            return {
                clearDelimitersAndLeadingZeros: clearDelimitersAndLeadingZeros,
                prepareNumberToFormatter: prepareNumberToFormatter
            };
        }])
        .factory('NumberValidators', [function() {
            return {
                maxNumber: function maxValidator(ctrl, value, limit) {
                    var max = parseFloat(limit);
                    var validity = ctrl.$isEmpty(value) || isNaN(max) || value <= max;
                    ctrl.$setValidity('max', validity);
                    return value;
                },
                minNumber: function minValidator(ctrl, value, limit) {
                    var min = parseFloat(limit);
                    var validity = ctrl.$isEmpty(value) || isNaN(min) || value >= min;
                    ctrl.$setValidity('min', validity);
                    return value;
                }
            };
        }])
        .factory('NumberMasks', [function() {
            return {
                viewMask: function(decimals, decimalDelimiter, thousandsDelimiter) {
                    var mask = '#' + thousandsDelimiter + '##0';

                    if (decimals > 0) {
                        mask += decimalDelimiter;
                        for (var i = 0; i < decimals; i++) {
                            mask += '0';
                        }
                    }

                    return new StringMask(mask, {
                        reverse: true
                    });
                },
                modelMask: function(decimals) {
                    var mask = '###0';

                    if (decimals > 0) {
                        mask += '.';
                        for (var i = 0; i < decimals; i++) {
                            mask += '0';
                        }
                    }

                    return new StringMask(mask, {
                        reverse: true
                    });
                }
            };
        }]);


    angular.module('ui.utils.masks.global', ['ui.utils.masks.helpers'])
        .directive('uiNumberMask', ['$locale', '$parse', 'PreFormatters', 'NumberMasks', 'NumberValidators', function NumberMaskDirective($locale, $parse, PreFormatters, NumberMasks, NumberValidators) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ctrl) {
                    var decimalDelimiter = $parse(attrs.decimalSep)(scope),
                        thousandsDelimiter = $parse(attrs.groupSep)(scope),
                        currencySetting = $parse(attrs.uiCurrencySetting)(scope),
                        decimals,tmp,viewMask,modelMask;

                    function setMasks(newMask) {
                        var newViewMask,body;

                        // try to use ui-currency-setting
                        if (newMask===null || newMask==="" && currencySetting) try {
                            decimalDelimiter = currencySetting.decimal;
                            thousandsDelimiter = currencySetting.group;

                            var trimmedFormat = currencySetting.format.replace('!','').trim();
                            viewMask = new StringMask(trimmedFormat,{reverse:true});
                            modelMask = new StringMask(trimmedFormat.replace(currencySetting.group,'').replace(currencySetting.decimal,'.'),{reverse:true});
                        } catch (err){
                            // noop
                        }


                        decimalDelimiter = $parse(attrs.decimalSep)(scope);
                        thousandsDelimiter = $parse(attrs.groupSep)(scope);

                        var match = patternMatch.exec(newMask);
                        // if decimals looks like a mask try to convert it to specified pattern
                        if(!angular.isNumber(newMask)&&match){
                            var delim1 = match[2];
                            var delim2 = match[3];
                            var prefix = match[1];
                            var suffix = match[4];
                            body = newMask.substring(prefix.length, newMask.length-suffix.length);
                            if (!decimalDelimiter){
                                // convert it to the correct formats
                                if (delim1&&delim2){
                                    thousandsDelimiter = delim1;
                                    decimalDelimiter = delim2;
                                } else if (delim1||delim2) {
                                    // if there's only two of the same symbol, then it is a groupsep; if there's only one symbol it's a decimal point
                                    if (body.indexOf(delim1||delim2,body.indexOf(delim1||delim2)+1)!==-1){
                                        thousandsDelimiter = delim1||delim2;
                                        newMask = 0;
                                    } else {
                                        decimalDelimiter = delim1||delim2;
                                    }
                                }
                            }
                            newMask = newMask===0?0: body.length-1-body.indexOf(decimalDelimiter);
                        }

                        // APPLY DEFAULT BEHAVIOR FOR VALUES NOT SET
                        decimalDelimiter = decimalDelimiter||(currencySetting && currencySetting.decimal)||$locale.NUMBER_FORMATS.DECIMAL_SEP;

                        if (thousandsDelimiter===undefined) {
                            thousandsDelimiter = (currencySetting && currencySetting.group)||$locale.NUMBER_FORMATS.GROUP_SEP;
                        }

                        decimals = !isNaN(newMask)&&newMask;

                        if (angular.isDefined(attrs.uiHideGroupSep) && attrs.uiHideGroupSep === 'true') {
                            thousandsDelimiter = '';
                        }

                        if (!angular.isNumber(decimals)) {
                            decimals = 2;
                        }

                        if (body){
                            var bodyLarge = body.substring(0,body.length-2-decimals).replace(/[\d]/g,'#').replace(/[^\d#]/g,thousandsDelimiter);
                            if (bodyLarge.match(/^#{1,2}$/)){
                                bodyLarge = "#,##";
                            }
                            var bodySmall = decimals>0?body.substring(body.length-2-decimals).replace(/[\d]/g,'0').replace(/[^\d#]/g,decimalDelimiter):'';
                            newViewMask = new StringMask(bodyLarge+bodySmall,{reverse:true});
                        }

                        viewMask = newViewMask || NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter);
                        modelMask = NumberMasks.modelMask(decimals);

                        ctrl.$modelValue && ctrl.$render();
                    }

                    setMasks($parse(attrs.uiNumberMask)(scope));

                    function parser(value) {
                        if (ctrl.$isEmpty(value)) {
                            return value;
                        }

                        var valueToFormat = PreFormatters.clearDelimitersAndLeadingZeros(value) || '0';
                        var formatedValue = viewMask.apply(valueToFormat);
                        var actualNumber = parseFloat(modelMask.apply(valueToFormat));

                        //              if(angular.isDefined(attrs.uiNegativeNumber)){
                        if (angular.isDefined(attrs.uiNegativeNumber) && attrs.uiNegativeNumber === 'true') {
                            var isNegative = (value[0] === '-'),
                                needsToInvertSign = (value.slice(-1) === '-');

                            //only apply the minus sign if it is negative or(exclusive)
                            //needs to be negative and the number is different from zero
                            if (needsToInvertSign ^ isNegative && !!actualNumber) {
                                actualNumber *= -1;
                                formatedValue = '-' + formatedValue;
                            }
                        }

                        if (ctrl.$viewValue !== formatedValue) {
                            ctrl.$setViewValue(formatedValue);
                            ctrl.$render();
                        }

                        return actualNumber;
                    }

                    function formatter(value) {
                        if (ctrl.$isEmpty(value)) {
                            return value;
                        }

                        var prefix = '';
                        //              if(angular.isDefined(attrs.uiNegativeNumber) && value < 0){
                        if (angular.isDefined(attrs.uiNegativeNumber) && attrs.uiNegativeNumber === 'true' && value < 0) {
                            prefix = '-';
                        }

                        var valueToFormat = PreFormatters.prepareNumberToFormatter(value, decimals);
                        return prefix + viewMask.apply(valueToFormat);
                    }

                    ctrl.$formatters.push(formatter);
                    ctrl.$parsers.push(parser);

                    if (attrs.uiNumberMask) {
                        scope.$watch(attrs.uiNumberMask, setMasks);
                    }

                    if (attrs.min) {
                        ctrl.$parsers.push(function(value) {
                            var min = $parse(attrs.min)(scope);
                            return NumberValidators.minNumber(ctrl, value, min);
                        });

                        scope.$watch(attrs.min, function(value) {
                            NumberValidators.minNumber(ctrl, ctrl.$modelValue, value);
                        });
                    }

                    if (attrs.max) {
                        ctrl.$parsers.push(function(value) {
                            var max = $parse(attrs.max)(scope);
                            return NumberValidators.maxNumber(ctrl, value, max);
                        });

                        scope.$watch(attrs.max, function(value) {
                            NumberValidators.maxNumber(ctrl, ctrl.$modelValue, value);
                        });
                    }
                }
            };
        }]);

    m = angular.module('ui.utils.masks',['ui.utils.masks.global']);
}());

if (typeof module !== 'undefined' && module != null){
    module.exports = m;
}

/*
 AngularJS v1.6.8
 (c) 2010-2017 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(J,d){'use strict';function A(d){k&&d.get("$route")}function B(t,u,g){return{restrict:"ECA",terminal:!0,priority:400,transclude:"element",link:function(a,f,b,c,m){function v(){l&&(g.cancel(l),l=null);n&&(n.$destroy(),n=null);p&&(l=g.leave(p),l.done(function(a){!1!==a&&(l=null)}),p=null)}function E(){var b=t.current&&t.current.locals;if(d.isDefined(b&&b.$template)){var b=a.$new(),c=t.current;p=m(b,function(b){g.enter(b,null,p||f).done(function(b){!1===b||!d.isDefined(w)||w&&!a.$eval(w)||u()});
v()});n=c.scope=b;n.$emit("$viewContentLoaded");n.$eval(k)}else v()}var n,p,l,w=b.autoscroll,k=b.onload||"";a.$on("$routeChangeSuccess",E);E()}}}function C(d,k,g){return{restrict:"ECA",priority:-400,link:function(a,f){var b=g.current,c=b.locals;f.html(c.$template);var m=d(f.contents());if(b.controller){c.$scope=a;var v=k(b.controller,c);b.controllerAs&&(a[b.controllerAs]=v);f.data("$ngControllerController",v);f.children().data("$ngControllerController",v)}a[b.resolveAs||"$resolve"]=c;m(a)}}}var x,
y,F,G,z=d.module("ngRoute",[]).info({angularVersion:"1.6.8"}).provider("$route",function(){function t(a,f){return d.extend(Object.create(a),f)}function u(a,d){var b=d.caseInsensitiveMatch,c={originalPath:a,regexp:a},g=c.keys=[];a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)(\*\?|[?*])?/g,function(a,b,d,c){a="?"===c||"*?"===c?"?":null;c="*"===c||"*?"===c?"*":null;g.push({name:d,optional:!!a});b=b||"";return""+(a?"":b)+"(?:"+(a?b:"")+(c&&"(.+?)"||"([^/]+)")+(a||"")+")"+(a||"")}).replace(/([/$*])/g,
"\\$1");c.regexp=new RegExp("^"+a+"$",b?"i":"");return c}x=d.isArray;y=d.isObject;F=d.isDefined;G=d.noop;var g={};this.when=function(a,f){var b;b=void 0;if(x(f)){b=b||[];for(var c=0,m=f.length;c<m;c++)b[c]=f[c]}else if(y(f))for(c in b=b||{},f)if("$"!==c.charAt(0)||"$"!==c.charAt(1))b[c]=f[c];b=b||f;d.isUndefined(b.reloadOnSearch)&&(b.reloadOnSearch=!0);d.isUndefined(b.caseInsensitiveMatch)&&(b.caseInsensitiveMatch=this.caseInsensitiveMatch);g[a]=d.extend(b,a&&u(a,b));a&&(c="/"===a[a.length-1]?a.substr(0,
a.length-1):a+"/",g[c]=d.extend({redirectTo:a},u(c,b)));return this};this.caseInsensitiveMatch=!1;this.otherwise=function(a){"string"===typeof a&&(a={redirectTo:a});this.when(null,a);return this};k=!0;this.eagerInstantiationEnabled=function(a){return F(a)?(k=a,this):k};this.$get=["$rootScope","$location","$routeParams","$q","$injector","$templateRequest","$sce","$browser",function(a,f,b,c,m,k,u,n){function p(e){var h=q.current;(y=(s=C())&&h&&s.$$route===h.$$route&&d.equals(s.pathParams,h.pathParams)&&
!s.reloadOnSearch&&!D)||!h&&!s||a.$broadcast("$routeChangeStart",s,h).defaultPrevented&&e&&e.preventDefault()}function l(){var e=q.current,h=s;if(y)e.params=h.params,d.copy(e.params,b),a.$broadcast("$routeUpdate",e);else if(h||e){D=!1;q.current=h;var H=c.resolve(h);n.$$incOutstandingRequestCount();H.then(w).then(z).then(function(c){return c&&H.then(A).then(function(c){h===q.current&&(h&&(h.locals=c,d.copy(h.params,b)),a.$broadcast("$routeChangeSuccess",h,e))})}).catch(function(b){h===q.current&&a.$broadcast("$routeChangeError",
h,e,b)}).finally(function(){n.$$completeOutstandingRequest(G)})}}function w(e){var a={route:e,hasRedirection:!1};if(e)if(e.redirectTo)if(d.isString(e.redirectTo))a.path=x(e.redirectTo,e.params),a.search=e.params,a.hasRedirection=!0;else{var b=f.path(),g=f.search();e=e.redirectTo(e.pathParams,b,g);d.isDefined(e)&&(a.url=e,a.hasRedirection=!0)}else if(e.resolveRedirectTo)return c.resolve(m.invoke(e.resolveRedirectTo)).then(function(e){d.isDefined(e)&&(a.url=e,a.hasRedirection=!0);return a});return a}
function z(a){var b=!0;if(a.route!==q.current)b=!1;else if(a.hasRedirection){var d=f.url(),c=a.url;c?f.url(c).replace():c=f.path(a.path).search(a.search).replace().url();c!==d&&(b=!1)}return b}function A(a){if(a){var b=d.extend({},a.resolve);d.forEach(b,function(a,e){b[e]=d.isString(a)?m.get(a):m.invoke(a,null,null,e)});a=B(a);d.isDefined(a)&&(b.$template=a);return c.all(b)}}function B(a){var b,c;d.isDefined(b=a.template)?d.isFunction(b)&&(b=b(a.params)):d.isDefined(c=a.templateUrl)&&(d.isFunction(c)&&
(c=c(a.params)),d.isDefined(c)&&(a.loadedTemplateUrl=u.valueOf(c),b=k(c)));return b}function C(){var a,b;d.forEach(g,function(c,g){var r;if(r=!b){var k=f.path();r=c.keys;var m={};if(c.regexp)if(k=c.regexp.exec(k)){for(var l=1,n=k.length;l<n;++l){var p=r[l-1],q=k[l];p&&q&&(m[p.name]=q)}r=m}else r=null;else r=null;r=a=r}r&&(b=t(c,{params:d.extend({},f.search(),a),pathParams:a}),b.$$route=c)});return b||g[null]&&t(g[null],{params:{},pathParams:{}})}function x(a,b){var c=[];d.forEach((a||"").split(":"),
function(a,d){if(0===d)c.push(a);else{var e=a.match(/(\w+)(?:[?*])?(.*)/),f=e[1];c.push(b[f]);c.push(e[2]||"");delete b[f]}});return c.join("")}var D=!1,s,y,q={routes:g,reload:function(){D=!0;var b={defaultPrevented:!1,preventDefault:function(){this.defaultPrevented=!0;D=!1}};a.$evalAsync(function(){p(b);b.defaultPrevented||l()})},updateParams:function(a){if(this.current&&this.current.$$route)a=d.extend({},this.current.params,a),f.path(x(this.current.$$route.originalPath,a)),f.search(a);else throw I("norout");
}};a.$on("$locationChangeStart",p);a.$on("$locationChangeSuccess",l);return q}]}).run(A),I=d.$$minErr("ngRoute"),k;A.$inject=["$injector"];z.provider("$routeParams",function(){this.$get=function(){return{}}});z.directive("ngView",B);z.directive("ngView",C);B.$inject=["$route","$anchorScroll","$animate"];C.$inject=["$compile","$controller","$route"]})(window,window.angular);
//# sourceMappingURL=angular-route.min.js.map

/*!
 * angular-ui-mask
 * https://github.com/angular-ui/ui-mask
 * Version: 1.8.8 - 2019-03-19T20:21:15.176Z
 * License: MIT
 */
!function(){"use strict";angular.module("ui.mask",[]).value("uiMaskConfig",{maskDefinitions:{9:/\d/,A:/[a-zA-Z]/,"*":/[a-zA-Z0-9]/},clearOnBlur:!0,clearOnBlurPlaceholder:!1,escChar:"\\",eventsToHandle:["input","keyup","click","focus"],addDefaultPlaceholder:!0,allowInvalidValue:!1}).provider("uiMask.Config",function(){var e={};this.maskDefinitions=function(n){return e.maskDefinitions=n},this.clearOnBlur=function(n){return e.clearOnBlur=n},this.clearOnBlurPlaceholder=function(n){return e.clearOnBlurPlaceholder=n},this.eventsToHandle=function(n){return e.eventsToHandle=n},this.addDefaultPlaceholder=function(n){return e.addDefaultPlaceholder=n},this.allowInvalidValue=function(n){return e.allowInvalidValue=n},this.$get=["uiMaskConfig",function(n){var t=n;for(var a in e)angular.isObject(e[a])&&!angular.isArray(e[a])?angular.extend(t[a],e[a]):t[a]=e[a];return t}]}).directive("uiMask",["uiMask.Config",function(e){function n(e){return e===document.activeElement&&(!document.hasFocus||document.hasFocus())&&!!(e.type||e.href||~e.tabIndex)}return{priority:100,require:"ngModel",restrict:"A",compile:function(){var t=angular.copy(e);return function(e,a,r,i){function l(){try{return document.createEvent("TouchEvent"),!0}catch(e){return!1}}function u(e){return angular.isDefined(e)?(y(e),Z?(d(),v(),!0):h()):h()}function o(e){e&&(B=e,!Z||0===a.val().length&&angular.isDefined(r.placeholder)||a.val(b(m(a.val()))))}function c(){return u(r.uiMask)}function s(e){return Z?(H=m(e||""),_=p(H),i.$setValidity("mask",_),H.length&&(_||U.allowInvalidValue)?b(H):void 0):e}function f(e){return Z?(H=m(e||""),_=p(H),i.$viewValue=H.length?b(H):"",i.$setValidity("mask",_),_||U.allowInvalidValue?Q?i.$viewValue:H:void 0):e}function h(){return Z=!1,g(),angular.isDefined(W)?a.attr("placeholder",W):a.removeAttr("placeholder"),angular.isDefined(G)?a.attr("maxlength",G):a.removeAttr("maxlength"),a.val(i.$modelValue),i.$viewValue=i.$modelValue,!1}function d(){H=L=m(i.$modelValue||""),R=F=b(H),_=p(H),r.maxlength&&a.attr("maxlength",2*A[A.length-1]),!W&&U.addDefaultPlaceholder&&a.attr("placeholder",B);for(var e=i.$modelValue,n=i.$formatters.length;n--;)e=i.$formatters[n](e);i.$viewValue=e||"",i.$render()}function v(){q||(a.bind("blur",$),a.bind("mousedown mouseup",V),a.bind("keydown",O),a.bind(U.eventsToHandle.join(" "),D),q=!0)}function g(){q&&(a.unbind("blur",$),a.unbind("mousedown",V),a.unbind("mouseup",V),a.unbind("keydown",O),a.unbind("input",D),a.unbind("keyup",D),a.unbind("click",D),a.unbind("focus",D),q=!1)}function p(e){return e.length?e.length>=j:!0}function m(e){var n,t,r="",i=a[0],l=T.slice(),u=N,o=u+S(i),c="";return e=e.toString(),n=0,t=e.length-B.length,angular.forEach(I,function(a){var r=a.position;r>=u&&o>r||(r>=u&&(r+=t),e.substring(r,r+a.value.length)===a.value&&(c+=e.slice(n,r),n=r+a.value.length))}),e=c+e.slice(n),angular.forEach(e.split(""),function(e){l.length&&l[0].test(e)&&(r+=e,l.shift())}),r}function b(e){var n="",t=A.slice();return angular.forEach(B.split(""),function(a,r){e.length&&r===t[0]?(n+=e.charAt(0)||"_",e=e.substr(1),t.shift()):n+=a}),n}function k(e){var n,t=angular.isDefined(r.uiMaskPlaceholder)?r.uiMaskPlaceholder:r.placeholder;return angular.isDefined(t)&&t[e]?t[e]:(n=angular.isDefined(r.uiMaskPlaceholderChar)&&r.uiMaskPlaceholderChar?r.uiMaskPlaceholderChar:"_","space"===n.toLowerCase()?" ":n[0])}function w(){var e,n,t=B.split("");A&&!isNaN(A[0])&&angular.forEach(A,function(e){t[e]="_"}),e=t.join(""),n=e.replace(/[_]+/g,"_").split("_"),n=n.filter(function(e){return""!==e});var a=0;return n.map(function(n){var t=e.indexOf(n,a);return a=t+1,{value:n,position:t}})}function y(e){var n=0;if(A=[],T=[],B="",angular.isString(e)){j=0;var t=!1,a=0,r=e.split(""),i=!1;angular.forEach(r,function(e,r){i?(i=!1,B+=e,n++):U.escChar===e?i=!0:U.maskDefinitions[e]?(A.push(n),B+=k(r-a),T.push(U.maskDefinitions[e]),n++,t||j++,t=!1):"?"===e?(t=!0,a++):(B+=e,n++)})}A.push(A.slice().pop()+1),I=w(),Z=A.length>1?!0:!1}function $(){if((U.clearOnBlur||U.clearOnBlurPlaceholder&&0===H.length&&r.placeholder)&&(N=0,z=0,_&&0!==H.length||(R="",a.val(""),e.$apply(function(){i.$pristine||i.$setViewValue("")}))),H!==X){var n=a.val(),t=""===H&&n&&angular.isDefined(r.uiMaskPlaceholderChar)&&"space"===r.uiMaskPlaceholderChar;t&&a.val(""),E(a[0]),t&&a.val(n)}X=H}function E(e){var n;if(angular.isFunction(window.Event)&&!e.fireEvent)try{n=new Event("change",{view:window,bubbles:!0,cancelable:!1})}catch(t){n=document.createEvent("HTMLEvents"),n.initEvent("change",!1,!0)}finally{e.dispatchEvent(n)}else"createEvent"in document?(n=document.createEvent("HTMLEvents"),n.initEvent("change",!1,!0),e.dispatchEvent(n)):e.fireEvent&&e.fireEvent("onchange")}function V(e){"mousedown"===e.type?a.bind("mouseout",M):a.unbind("mouseout",M)}function M(){z=S(this),a.unbind("mouseout",M)}function O(e){var n=8===e.which,t=x(this)-1||0,r=90===e.which&&e.ctrlKey;if(n){for(;t>=0;){if(P(t)){C(this,t+1);break}t--}K=-1===t}r&&(a.val(""),e.preventDefault())}function D(n){n=n||{};var t=n.which,r=n.type;if(16!==t&&91!==t){var u,o=a.val(),c=F,s=!1,f=m(o),h=L,d=x(this)||0,v=N||0,g=d-v,p=A[0],w=A[f.length]||A.slice().shift(),y=z||0,$=S(this)>0,E=y>0,V=o.length>c.length||y&&o.length>c.length-y,M=o.length<c.length||y&&o.length===c.length-y,O=t>=37&&40>=t&&n.shiftKey,D=37===t,T=8===t||"keyup"!==r&&M&&-1===g,I=46===t||"keyup"!==r&&M&&0===g&&!E,j=(D||T||"click"===r)&&d>p;if(z=S(this),!O&&(!$||"click"!==r&&"keyup"!==r&&"focus"!==r)){if(T&&K)return a.val(B),e.$apply(function(){i.$setViewValue("")}),void C(this,v);if("input"===r&&M&&!E&&f===h){for(;T&&d>p&&!P(d);)d--;for(;I&&w>d&&-1===A.indexOf(d);)d++;var H=A.indexOf(d);f=f.substring(0,H)+f.substring(H+1),f!==h&&(s=!0)}for(u=b(f),F=u,L=f,!s&&o.length>u.length&&(s=!0),a.val(u),s&&e.$apply(function(){i.$setViewValue(u)}),V&&p>=d&&(d=p+1),j&&d--,d=d>w?w:p>d?p:d;!P(d)&&d>p&&w>d;)d+=j?-1:1;if((j&&w>d||V&&!P(v))&&d++,N=d,l()&&!T&&d<f.length){for(var R=f.length;R<u.length&&(!P(R)||k[R]!==u[R]);)R++;d=R}C(this,d)}}}function P(e){return A.indexOf(e)>-1}function x(e){if(!e)return 0;if(void 0!==e.selectionStart)return e.selectionStart;if(document.selection&&n(a[0])){e.focus();var t=document.selection.createRange();return t.moveStart("character",e.value?-e.value.length:0),t.text.length}return 0}function C(e,t){if(!e)return 0;if(0!==e.offsetWidth&&0!==e.offsetHeight)if(e.setSelectionRange)n(a[0])&&(e.focus(),e.setSelectionRange(t,t));else if(e.createTextRange){var r=e.createTextRange();r.collapse(!0),r.moveEnd("character",t),r.moveStart("character",t),r.select()}}function S(e){return e?void 0!==e.selectionStart?e.selectionEnd-e.selectionStart:window.getSelection?window.getSelection().toString().length:document.selection?document.selection.createRange().text.length:0:0}var A,T,B,I,j,H,R,_,F,L,N,z,K,Z=!1,q=!1,W=r.placeholder,G=r.maxlength,J=i.$isEmpty;i.$isEmpty=function(e){return J(Z?m(e||""):e)};var Q=!1;r.$observe("modelViewValue",function(e){"true"===e&&(Q=!0)}),r.$observe("allowInvalidValue",function(e){U.allowInvalidValue=""===e?!0:!!e,s(i.$modelValue)});var U={};r.uiOptions?(U=e.$eval("["+r.uiOptions+"]"),U=angular.isObject(U[0])?function(e,n){for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(void 0===n[t]?n[t]=angular.copy(e[t]):angular.isObject(n[t])&&!angular.isArray(n[t])&&(n[t]=angular.extend({},e[t],n[t])));return n}(t,U[0]):t):U=t,r.$observe("uiMask",u),angular.isDefined(r.uiMaskPlaceholder)?r.$observe("uiMaskPlaceholder",o):r.$observe("placeholder",o),angular.isDefined(r.uiMaskPlaceholderChar)&&r.$observe("uiMaskPlaceholderChar",c),i.$formatters.unshift(s),i.$parsers.unshift(f);var X=a.val();a.bind("mousedown mouseup",V),Array.prototype.indexOf||(Array.prototype.indexOf=function(e){if(null===this)throw new TypeError;var n=Object(this),t=n.length>>>0;if(0===t)return-1;var a=0;if(arguments.length>1&&(a=Number(arguments[1]),a!==a?a=0:0!==a&&a!==1/0&&a!==-(1/0)&&(a=(a>0||-1)*Math.floor(Math.abs(a)))),a>=t)return-1;for(var r=a>=0?a:Math.max(t-Math.abs(a),0);t>r;r++)if(r in n&&n[r]===e)return r;return-1})}}}}])}();

/*!
 * jsonformatter
 * 
 * Version: 0.6.0 - 2016-08-27T12:58:03.306Z
 * License: Apache-2.0
 */
"use strict";angular.module("jsonFormatter",["RecursionHelper"]).provider("JSONFormatterConfig",function(){var n=!1,e=100,t=5;return{get hoverPreviewEnabled(){return n},set hoverPreviewEnabled(e){n=!!e},get hoverPreviewArrayCount(){return e},set hoverPreviewArrayCount(n){e=parseInt(n,10)},get hoverPreviewFieldCount(){return t},set hoverPreviewFieldCount(n){t=parseInt(n,10)},$get:function(){return{hoverPreviewEnabled:n,hoverPreviewArrayCount:e,hoverPreviewFieldCount:t}}}}).directive("jsonFormatter",["RecursionHelper","JSONFormatterConfig",function(n,e){function t(n){return n.replace('"','"')}function r(n){if(void 0===n)return"";if(null===n)return"Object";if("object"==typeof n&&!n.constructor)return"Object";if(void 0!==n.__proto__&&void 0!==n.__proto__.constructor&&void 0!==n.__proto__.constructor.name)return n.__proto__.constructor.name;var e=/function (.{1,})\(/,t=e.exec(n.constructor.toString());return t&&t.length>1?t[1]:""}function o(n){return null===n?"null":typeof n}function s(n,e){var r=o(n);return"null"===r||"undefined"===r?r:("string"===r&&(e='"'+t(e)+'"'),"function"===r?n.toString().replace(/[\r\n]/g,"").replace(/\{.*\}/,"")+"{…}":e)}function i(n){var e="";return angular.isObject(n)?(e=r(n),angular.isArray(n)&&(e+="["+n.length+"]")):e=s(n,n),e}function a(n){n.isArray=function(){return angular.isArray(n.json)},n.isObject=function(){return angular.isObject(n.json)},n.getKeys=function(){if(n.isObject())return Object.keys(n.json).map(function(n){return""===n?'""':n})},n.type=o(n.json),n.hasKey="undefined"!=typeof n.key,n.getConstructorName=function(){return r(n.json)},"string"===n.type&&("Invalid Date"!==new Date(n.json).toString()&&(n.isDate=!0),0===n.json.indexOf("http")&&(n.isUrl=!0)),n.isEmptyObject=function(){return n.getKeys()&&!n.getKeys().length&&n.isOpen&&!n.isArray()},n.isOpen=!!n.open,n.toggleOpen=function(){n.isOpen=!n.isOpen},n.childrenOpen=function(){return n.open>1?n.open-1:0},n.openLink=function(e){e&&(window.location.href=n.json)},n.parseValue=function(e){return s(n.json,e)},n.showThumbnail=function(){return!!e.hoverPreviewEnabled&&n.isObject()&&!n.isOpen},n.getThumbnail=function(){if(n.isArray())return n.json.length>e.hoverPreviewArrayCount?"Array["+n.json.length+"]":"["+n.json.map(i).join(", ")+"]";var t=n.getKeys(),r=t.slice(0,e.hoverPreviewFieldCount),o=r.map(function(e){return e+":"+i(n.json[e])}),s=t.length>=5?"…":"";return"{"+o.join(", ")+s+"}"}}return{templateUrl:"json-formatter.html",restrict:"E",replace:!0,scope:{json:"=",key:"=",open:"="},compile:function(e){return n.compile(e,a)}}}]),"object"==typeof module&&(module.exports="jsonFormatter"),angular.module("RecursionHelper",[]).factory("RecursionHelper",["$compile",function(n){return{compile:function(e,t){angular.isFunction(t)&&(t={post:t});var r,o=e.contents().remove();return{pre:t&&t.pre?t.pre:null,post:function(e,s){r||(r=n(o)),r(e,function(n){s.append(n)}),t&&t.post&&t.post.apply(null,arguments)}}}}}]),angular.module("jsonFormatter").run(["$templateCache",function(n){n.put("json-formatter.html",'<div ng-init="isOpen = open && open > 0" class="json-formatter-row"><a ng-click="toggleOpen()"><span class="toggler {{isOpen ? \'open\' : \'\'}}" ng-if="isObject()"></span> <span class="key" ng-if="hasKey"><span class="key-text">{{key}}</span><span class="colon">:</span></span> <span class="value"><span ng-if="isObject()"><span class="constructor-name">{{getConstructorName(json)}}</span> <span ng-if="isArray()"><span class="bracket">[</span><span class="number">{{json.length}}</span><span class="bracket">]</span></span></span> <span ng-if="!isObject()" ng-click="openLink(isUrl)" class="{{type}}" ng-class="{date: isDate, url: isUrl}">{{parseValue(json)}}</span></span> <span ng-if="showThumbnail()" class="thumbnail-text">{{getThumbnail()}}</span></a><div class="children" ng-if="getKeys().length && isOpen"><json-formatter ng-repeat="key in getKeys() track by $index" json="json[key]" key="key" open="childrenOpen()"></json-formatter></div><div class="children empty object" ng-if="isEmptyObject()"></div><div class="children empty array" ng-if="getKeys() && !getKeys().length && isOpen && isArray()"></div></div>')}]);

/**!
 * The MIT License
 *
 * Copyright (c) 2013 the angular-leaflet-directive Team, http://tombatossals.github.io/angular-leaflet-directive
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * angular-leaflet-directive
 * https://github.com/tombatossals/angular-leaflet-directive
 *
 * @authors https://github.com/tombatossals/angular-leaflet-directive/graphs/contributors
 */

/*!
*  angular-leaflet-directive  2015-11-06
*  angular-leaflet-directive - An AngularJS directive to easily interact with Leaflet maps
*  git: https://github.com/tombatossals/angular-leaflet-directive
*/
(function(angular){
'use strict';
!function(angular){"use strict";angular.module("leaflet-directive",[]).directive("leaflet",["$q","leafletData","leafletMapDefaults","leafletHelpers","leafletMapEvents",function(a,b,c,d,e){return{restrict:"EA",replace:!0,scope:{center:"=",lfCenter:"=",defaults:"=",maxbounds:"=",bounds:"=",markers:"=",legend:"=",geojson:"=",paths:"=",tiles:"=",layers:"=",controls:"=",decorations:"=",eventBroadcast:"=",markersWatchOptions:"=",geojsonWatchOptions:"="},transclude:!0,template:'<div class="angular-leaflet-map"><div ng-transclude></div></div>',controller:["$scope",function(b){this._leafletMap=a.defer(),this.getMap=function(){return this._leafletMap.promise},this.getLeafletScope=function(){return b}}],link:function(a,f,g,h){function i(){isNaN(g.width)?f.css("width",g.width):f.css("width",g.width+"px")}function j(){isNaN(g.height)?f.css("height",g.height):f.css("height",g.height+"px")}var k=d.isDefined,l=c.setDefaults(a.defaults,g.id),m=e.getAvailableMapEvents(),n=e.addEvents;a.mapId=g.id,b.setDirectiveControls({},g.id),k(g.width)&&(i(),a.$watch(function(){return f[0].getAttribute("width")},function(){i(),o.invalidateSize()})),k(g.height)&&(j(),a.$watch(function(){return f[0].getAttribute("height")},function(){j(),o.invalidateSize()}));var o=new L.Map(f[0],c.getMapCreationDefaults(g.id));if(h._leafletMap.resolve(o),k(g.center)||k(g.lfCenter)||o.setView([l.center.lat,l.center.lng],l.center.zoom),!k(g.tiles)&&!k(g.layers)){var p=L.tileLayer(l.tileLayer,l.tileLayerOptions);p.addTo(o),b.setTiles(p,g.id)}if(k(o.zoomControl)&&k(l.zoomControlPosition)&&o.zoomControl.setPosition(l.zoomControlPosition),k(o.zoomControl)&&l.zoomControl===!1&&o.zoomControl.removeFrom(o),k(o.zoomsliderControl)&&k(l.zoomsliderControl)&&l.zoomsliderControl===!1&&o.zoomsliderControl.removeFrom(o),!k(g.eventBroadcast)){var q="broadcast";n(o,m,"eventName",a,q)}o.whenReady(function(){b.setMap(o,g.id)}),a.$on("$destroy",function(){c.reset(),o.remove(),b.unresolveMap(g.id)}),a.$on("invalidateSize",function(){o.invalidateSize()})}}}]),angular.module("leaflet-directive").factory("leafletBoundsHelpers",["$log","leafletHelpers",function(a,b){function c(a){return angular.isDefined(a)&&angular.isDefined(a.southWest)&&angular.isDefined(a.northEast)&&angular.isNumber(a.southWest.lat)&&angular.isNumber(a.southWest.lng)&&angular.isNumber(a.northEast.lat)&&angular.isNumber(a.northEast.lng)}var d=b.isArray,e=b.isNumber,f=b.isFunction,g=b.isDefined;return{createLeafletBounds:function(a){return c(a)?L.latLngBounds([a.southWest.lat,a.southWest.lng],[a.northEast.lat,a.northEast.lng]):void 0},isValidBounds:c,createBoundsFromArray:function(b){return d(b)&&2===b.length&&d(b[0])&&d(b[1])&&2===b[0].length&&2===b[1].length&&e(b[0][0])&&e(b[0][1])&&e(b[1][0])&&e(b[1][1])?{northEast:{lat:b[0][0],lng:b[0][1]},southWest:{lat:b[1][0],lng:b[1][1]}}:void a.error("[AngularJS - Leaflet] The bounds array is not valid.")},createBoundsFromLeaflet:function(b){if(!(g(b)&&f(b.getNorthEast)&&f(b.getSouthWest)))return void a.error("[AngularJS - Leaflet] The leaflet bounds is not valid object.");var c=b.getNorthEast(),d=b.getSouthWest();return{northEast:{lat:c.lat,lng:c.lng},southWest:{lat:d.lat,lng:d.lng}}}}}]),angular.module("leaflet-directive").factory("leafletControlHelpers",["$rootScope","$log","leafletHelpers","leafletLayerHelpers","leafletMapDefaults",function(a,b,c,d,e){var f=c.isDefined,g=c.isObject,h=d.createLayer,i={},j=c.errorHeader+" [Controls] ",k=function(a,b,c){var d=e.getDefaults(c);if(!d.controls.layers.visible)return!1;var h=!1;return g(a)&&Object.keys(a).forEach(function(b){var c=a[b];f(c.layerOptions)&&c.layerOptions.showOnSelector===!1||(h=!0)}),g(b)&&Object.keys(b).forEach(function(a){var c=b[a];f(c.layerParams)&&c.layerParams.showOnSelector===!1||(h=!0)}),h},l=function(a){var b=e.getDefaults(a),c={collapsed:b.controls.layers.collapsed,position:b.controls.layers.position,autoZIndex:!1};angular.extend(c,b.controls.layers.options);var d;return d=b.controls.layers&&f(b.controls.layers.control)?b.controls.layers.control.apply(this,[[],[],c]):new L.control.layers([],[],c)},m={draw:{isPluginLoaded:function(){return angular.isDefined(L.Control.Draw)?!0:(b.error(j+" Draw plugin is not loaded."),!1)},checkValidParams:function(){return!0},createControl:function(a){return new L.Control.Draw(a)}},scale:{isPluginLoaded:function(){return!0},checkValidParams:function(){return!0},createControl:function(a){return new L.control.scale(a)}},fullscreen:{isPluginLoaded:function(){return angular.isDefined(L.Control.Fullscreen)?!0:(b.error(j+" Fullscreen plugin is not loaded."),!1)},checkValidParams:function(){return!0},createControl:function(a){return new L.Control.Fullscreen(a)}},search:{isPluginLoaded:function(){return angular.isDefined(L.Control.Search)?!0:(b.error(j+" Search plugin is not loaded."),!1)},checkValidParams:function(){return!0},createControl:function(a){return new L.Control.Search(a)}},custom:{},minimap:{isPluginLoaded:function(){return angular.isDefined(L.Control.MiniMap)?!0:(b.error(j+" Minimap plugin is not loaded."),!1)},checkValidParams:function(a){return f(a.layer)?!0:(b.warn(j+' minimap "layer" option should be defined.'),!1)},createControl:function(a){var c=h(a.layer);return f(c)?new L.Control.MiniMap(c,a):void b.warn(j+' minimap control "layer" could not be created.')}}};return{layersControlMustBeVisible:k,isValidControlType:function(a){return-1!==Object.keys(m).indexOf(a)},createControl:function(a,b){return m[a].checkValidParams(b)?m[a].createControl(b):void 0},updateLayersControl:function(a,b,c,d,e,g){var h,j=i[b],m=k(d,e,b);if(f(j)&&c){for(h in g.baselayers)j.removeLayer(g.baselayers[h]);for(h in g.overlays)j.removeLayer(g.overlays[h]);a.removeControl(j),delete i[b]}if(m){j=l(b),i[b]=j;for(h in d){var n=f(d[h].layerOptions)&&d[h].layerOptions.showOnSelector===!1;!n&&f(g.baselayers[h])&&j.addBaseLayer(g.baselayers[h],d[h].name)}for(h in e){var o=f(e[h].layerParams)&&e[h].layerParams.showOnSelector===!1;!o&&f(g.overlays[h])&&j.addOverlay(g.overlays[h],e[h].name)}a.addControl(j)}return m}}}]),angular.module("leaflet-directive").service("leafletData",["$log","$q","leafletHelpers",function(a,b,c){var d=c.getDefer,e=c.getUnresolvedDefer,f=c.setResolvedDefer,g={},h=this,i=function(a){return a.charAt(0).toUpperCase()+a.slice(1)},j=["map","tiles","layers","paths","markers","geoJSON","UTFGrid","decorations","directiveControls"];j.forEach(function(a){g[a]={}}),this.unresolveMap=function(a){var b=c.obtainEffectiveMapId(g.map,a);j.forEach(function(a){g[a][b]=void 0})},j.forEach(function(a){var b=i(a);h["set"+b]=function(b,c){var d=e(g[a],c);d.resolve(b),f(g[a],c)},h["get"+b]=function(b){var c=d(g[a],b);return c.promise}})}]),angular.module("leaflet-directive").service("leafletDirectiveControlsHelpers",["$log","leafletData","leafletHelpers",function(a,b,c){var d=c.isDefined,e=c.isString,f=c.isObject,g=c.errorHeader,h=g+"[leafletDirectiveControlsHelpers",i=function(c,g,i,j){var k=h+".extend] ",l={};if(!d(g))return void a.error(k+"thingToAddName cannot be undefined");if(e(g)&&d(i)&&d(j))l[g]={create:i,clean:j};else{if(!f(g)||d(i)||d(j))return void a.error(k+"incorrect arguments");l=g}b.getDirectiveControls().then(function(a){angular.extend(a,l),b.setDirectiveControls(a,c)})};return{extend:i}}]),angular.module("leaflet-directive").service("leafletGeoJsonHelpers",["leafletHelpers","leafletIterators",function(a,b){var c=a,d=b,e=function(a,b){return this.lat=a,this.lng=b,this},f=function(a){return Array.isArray(a)&&2===a.length?a[1]:c.isDefined(a.type)&&"Point"===a.type?+a.coordinates[1]:+a.lat},g=function(a){return Array.isArray(a)&&2===a.length?a[0]:c.isDefined(a.type)&&"Point"===a.type?+a.coordinates[0]:+a.lng},h=function(a){if(c.isUndefined(a))return!1;if(c.isArray(a)){if(2===a.length&&c.isNumber(a[0])&&c.isNumber(a[1]))return!0}else if(c.isDefined(a.type)&&"Point"===a.type&&c.isArray(a.coordinates)&&2===a.coordinates.length&&c.isNumber(a.coordinates[0])&&c.isNumber(a.coordinates[1]))return!0;var b=d.all(["lat","lng"],function(b){return c.isDefined(a[b])&&c.isNumber(a[b])});return b},i=function(a){if(a&&h(a)){var b=null;if(Array.isArray(a)&&2===a.length)b=new e(a[1],a[0]);else{if(!c.isDefined(a.type)||"Point"!==a.type)return a;b=new e(a.coordinates[1],a.coordinates[0])}return angular.extend(a,b)}};return{getLat:f,getLng:g,validateCoords:h,getCoords:i}}]),angular.module("leaflet-directive").service("leafletHelpers",["$q","$log",function(a,b){function c(a,c){var d,f;if(angular.isDefined(c))d=c;else if(0===Object.keys(a).length)d="main";else if(Object.keys(a).length>=1)for(f in a)a.hasOwnProperty(f)&&(d=f);else b.error(e+"- You have more than 1 map on the DOM, you must provide the map ID to the leafletData.getXXX call");return d}function d(b,d){var e,f=c(b,d);return angular.isDefined(b[f])&&b[f].resolvedDefer!==!0?e=b[f].defer:(e=a.defer(),b[f]={defer:e,resolvedDefer:!1}),e}var e="[AngularJS - Leaflet] ",f=angular.copy,g=f,h=function(a,b){var c;if(a&&angular.isObject(a))return null!==b&&angular.isString(b)?(c=a,b.split(".").forEach(function(a){c&&(c=c[a])}),c):b},i=function(a){return a.split(".").reduce(function(a,b){return a+'["'+b+'"]'})},j=function(a){return a.reduce(function(a,b){return a+"."+b})},k=function(a){return angular.isDefined(a)&&null!==a},l=function(a){return!k(a)},m=/([\:\-\_]+(.))/g,n=/^moz([A-Z])/,o=/^((?:x|data)[\:\-_])/i,p=function(a){return a.replace(m,function(a,b,c,d){return d?c.toUpperCase():c}).replace(n,"Moz$1")},q=function(a){return p(a.replace(o,""))};return{camelCase:p,directiveNormalize:q,copy:f,clone:g,errorHeader:e,getObjectValue:h,getObjectArrayPath:i,getObjectDotPath:j,defaultTo:function(a,b){return k(a)?a:b},isTruthy:function(a){return"true"===a||a===!0},isEmpty:function(a){return 0===Object.keys(a).length},isUndefinedOrEmpty:function(a){return angular.isUndefined(a)||null===a||0===Object.keys(a).length},isDefined:k,isUndefined:l,isNumber:angular.isNumber,isString:angular.isString,isArray:angular.isArray,isObject:angular.isObject,isFunction:angular.isFunction,equals:angular.equals,isValidCenter:function(a){return angular.isDefined(a)&&angular.isNumber(a.lat)&&angular.isNumber(a.lng)&&angular.isNumber(a.zoom)},isValidPoint:function(a){return angular.isDefined(a)?angular.isArray(a)?2===a.length&&angular.isNumber(a[0])&&angular.isNumber(a[1]):angular.isNumber(a.lat)&&angular.isNumber(a.lng):!1},isSameCenterOnMap:function(a,b){var c=b.getCenter(),d=b.getZoom();return a.lat&&a.lng&&c.lat.toFixed(4)===a.lat.toFixed(4)&&c.lng.toFixed(4)===a.lng.toFixed(4)&&d===a.zoom?!0:!1},safeApply:function(a,b){var c=a.$root.$$phase;"$apply"===c||"$digest"===c?a.$eval(b):a.$evalAsync(b)},obtainEffectiveMapId:c,getDefer:function(a,b){var e,f=c(a,b);return e=angular.isDefined(a[f])&&a[f].resolvedDefer!==!1?a[f].defer:d(a,b)},getUnresolvedDefer:d,setResolvedDefer:function(a,b){var d=c(a,b);a[d].resolvedDefer=!0},rangeIsSupported:function(){var a=document.createElement("input");return a.setAttribute("type","range"),"range"===a.type},FullScreenControlPlugin:{isLoaded:function(){return angular.isDefined(L.Control.Fullscreen)}},MiniMapControlPlugin:{isLoaded:function(){return angular.isDefined(L.Control.MiniMap)}},AwesomeMarkersPlugin:{isLoaded:function(){return angular.isDefined(L.AwesomeMarkers)&&angular.isDefined(L.AwesomeMarkers.Icon)},is:function(a){return this.isLoaded()?a instanceof L.AwesomeMarkers.Icon:!1},equal:function(a,b){return this.isLoaded()&&this.is(a)?angular.equals(a,b):!1}},VectorMarkersPlugin:{isLoaded:function(){return angular.isDefined(L.VectorMarkers)&&angular.isDefined(L.VectorMarkers.Icon)},is:function(a){return this.isLoaded()?a instanceof L.VectorMarkers.Icon:!1},equal:function(a,b){return this.isLoaded()&&this.is(a)?angular.equals(a,b):!1}},DomMarkersPlugin:{isLoaded:function(){return angular.isDefined(L.DomMarkers)&&angular.isDefined(L.DomMarkers.Icon)?!0:!1},is:function(a){return this.isLoaded()?a instanceof L.DomMarkers.Icon:!1},equal:function(a,b){return this.isLoaded()&&this.is(a)?angular.equals(a,b):!1}},PolylineDecoratorPlugin:{isLoaded:function(){return angular.isDefined(L.PolylineDecorator)?!0:!1},is:function(a){return this.isLoaded()?a instanceof L.PolylineDecorator:!1},equal:function(a,b){return this.isLoaded()&&this.is(a)?angular.equals(a,b):!1}},MakiMarkersPlugin:{isLoaded:function(){return angular.isDefined(L.MakiMarkers)&&angular.isDefined(L.MakiMarkers.Icon)?!0:!1},is:function(a){return this.isLoaded()?a instanceof L.MakiMarkers.Icon:!1},equal:function(a,b){return this.isLoaded()&&this.is(a)?angular.equals(a,b):!1}},ExtraMarkersPlugin:{isLoaded:function(){return angular.isDefined(L.ExtraMarkers)&&angular.isDefined(L.ExtraMarkers.Icon)?!0:!1},is:function(a){return this.isLoaded()?a instanceof L.ExtraMarkers.Icon:!1},equal:function(a,b){return this.isLoaded()&&this.is(a)?angular.equals(a,b):!1}},LabelPlugin:{isLoaded:function(){return angular.isDefined(L.Label)},is:function(a){return this.isLoaded()?a instanceof L.MarkerClusterGroup:!1}},MarkerClusterPlugin:{isLoaded:function(){return angular.isDefined(L.MarkerClusterGroup)},is:function(a){return this.isLoaded()?a instanceof L.MarkerClusterGroup:!1}},GoogleLayerPlugin:{isLoaded:function(){return angular.isDefined(L.Google)},is:function(a){return this.isLoaded()?a instanceof L.Google:!1}},LeafletProviderPlugin:{isLoaded:function(){return angular.isDefined(L.TileLayer.Provider)},is:function(a){return this.isLoaded()?a instanceof L.TileLayer.Provider:!1}},ChinaLayerPlugin:{isLoaded:function(){return angular.isDefined(L.tileLayer.chinaProvider)}},HeatLayerPlugin:{isLoaded:function(){return angular.isDefined(L.heatLayer)}},WebGLHeatMapLayerPlugin:{isLoaded:function(){return angular.isDefined(L.TileLayer.WebGLHeatMap)}},BingLayerPlugin:{isLoaded:function(){return angular.isDefined(L.BingLayer)},is:function(a){return this.isLoaded()?a instanceof L.BingLayer:!1}},WFSLayerPlugin:{isLoaded:function(){return void 0!==L.GeoJSON.WFS},is:function(a){return this.isLoaded()?a instanceof L.GeoJSON.WFS:!1}},AGSBaseLayerPlugin:{isLoaded:function(){return void 0!==L.esri&&void 0!==L.esri.basemapLayer},is:function(a){return this.isLoaded()?a instanceof L.esri.basemapLayer:!1}},AGSLayerPlugin:{isLoaded:function(){return void 0!==lvector&&void 0!==lvector.AGS},is:function(a){return this.isLoaded()?a instanceof lvector.AGS:!1}},AGSFeatureLayerPlugin:{isLoaded:function(){return void 0!==L.esri&&void 0!==L.esri.featureLayer},is:function(a){return this.isLoaded()?a instanceof L.esri.featureLayer:!1}},AGSTiledMapLayerPlugin:{isLoaded:function(){return void 0!==L.esri&&void 0!==L.esri.tiledMapLayer},is:function(a){return this.isLoaded()?a instanceof L.esri.tiledMapLayer:!1}},AGSDynamicMapLayerPlugin:{isLoaded:function(){return void 0!==L.esri&&void 0!==L.esri.dynamicMapLayer},is:function(a){return this.isLoaded()?a instanceof L.esri.dynamicMapLayer:!1}},AGSImageMapLayerPlugin:{isLoaded:function(){return void 0!==L.esri&&void 0!==L.esri.imageMapLayer},is:function(a){return this.isLoaded()?a instanceof L.esri.imageMapLayer:!1}},AGSClusteredLayerPlugin:{isLoaded:function(){return void 0!==L.esri&&void 0!==L.esri.clusteredFeatureLayer},is:function(a){return this.isLoaded()?a instanceof L.esri.clusteredFeatureLayer:!1}},AGSHeatmapLayerPlugin:{isLoaded:function(){return void 0!==L.esri&&void 0!==L.esri.heatmapFeatureLayer},is:function(a){return this.isLoaded()?a instanceof L.esri.heatmapFeatureLayer:!1}},YandexLayerPlugin:{isLoaded:function(){return angular.isDefined(L.Yandex)},is:function(a){return this.isLoaded()?a instanceof L.Yandex:!1}},GeoJSONPlugin:{isLoaded:function(){return angular.isDefined(L.TileLayer.GeoJSON)},is:function(a){return this.isLoaded()?a instanceof L.TileLayer.GeoJSON:!1}},UTFGridPlugin:{isLoaded:function(){return angular.isDefined(L.UtfGrid)},is:function(a){return this.isLoaded()?a instanceof L.UtfGrid:(b.error("[AngularJS - Leaflet] No UtfGrid plugin found."),!1)}},CartoDB:{isLoaded:function(){return cartodb},is:function(){return!0}},Leaflet:{DivIcon:{is:function(a){return a instanceof L.DivIcon},equal:function(a,b){return this.is(a)?angular.equals(a,b):!1}},Icon:{is:function(a){return a instanceof L.Icon},equal:function(a,b){return this.is(a)?angular.equals(a,b):!1}}},watchOptions:{doWatch:!0,isDeep:!0,individual:{doWatch:!0,isDeep:!0}}}}]),angular.module("leaflet-directive").service("leafletIterators",["$log","leafletHelpers",function(a,b){var c,d=b,e=b.errorHeader+"leafletIterators: ",f=Object.keys,g=d.isFunction,h=d.isObject,i=Math.pow(2,53)-1,j=function(a){var b=null!==a&&a.length;return d.isNumber(b)&&b>=0&&i>=b},k=function(a){return a},l=function(a){return function(b){return null===b?void 0:b[a]}},m=function(a,b,c){if(void 0===b)return a;switch(null===c?3:c){case 1:return function(c){return a.call(b,c)};case 2:return function(c,d){return a.call(b,c,d)};case 3:return function(c,d,e){return a.call(b,c,d,e)};case 4:return function(c,d,e,f){return a.call(b,c,d,e,f)}}return function(){return a.apply(b,arguments)}},n=function(a,b){return function(c){var d=arguments.length;if(2>d||null===c)return c;for(var e=1;d>e;e++)for(var f=arguments[e],g=a(f),h=g.length,i=0;h>i;i++){var j=g[i];b&&void 0!==c[j]||(c[j]=f[j])}return c}},o=null;c=o=n(f);var p,q=function(a,b){var c=f(b),d=c.length;if(null===a)return!d;for(var e=Object(a),g=0;d>g;g++){var h=c[g];if(b[h]!==e[h]||!(h in e))return!1}return!0},r=null;p=r=function(a){return a=c({},a),function(b){return q(b,a)}};var s,t=function(a,b,c){return null===a?k:g(a)?m(a,b,c):h(a)?p(a):l(a)},u=null;s=u=function(a,b,c){b=t(b,c);for(var d=!j(a)&&f(a),e=(d||a).length,g=0;e>g;g++){var h=d?d[g]:g;if(!b(a[h],h,a))return!1}return!0};var v=function(b,c,f,g){return f||d.isDefined(b)&&d.isDefined(c)?d.isFunction(c)?!1:(g=d.defaultTo(c,"cb"),a.error(e+g+" is not a function"),!0):!0},w=function(a,b,c){if(!v(void 0,c,!0,"internalCb")&&!v(a,b))for(var d in a)a.hasOwnProperty(d)&&c(a[d],d)},x=function(a,b){w(a,b,function(a,c){b(a,c)})};return{each:x,forEach:x,every:s,all:u}}]),angular.module("leaflet-directive").factory("leafletLayerHelpers",["$rootScope","$log","$q","leafletHelpers","leafletIterators",function($rootScope,$log,$q,leafletHelpers,leafletIterators){function isValidLayerType(a){return isString(a.type)?-1===Object.keys(layerTypes).indexOf(a.type)?($log.error("[AngularJS - Leaflet] A layer must have a valid type: "+Object.keys(layerTypes)),!1):layerTypes[a.type].mustHaveUrl&&!isString(a.url)?($log.error("[AngularJS - Leaflet] A base layer must have an url"),!1):layerTypes[a.type].mustHaveData&&!isDefined(a.data)?($log.error('[AngularJS - Leaflet] The base layer must have a "data" array attribute'),!1):layerTypes[a.type].mustHaveLayer&&!isDefined(a.layer)?($log.error("[AngularJS - Leaflet] The type of layer "+a.type+" must have an layer defined"),!1):layerTypes[a.type].mustHaveBounds&&!isDefined(a.bounds)?($log.error("[AngularJS - Leaflet] The type of layer "+a.type+" must have bounds defined"),!1):layerTypes[a.type].mustHaveKey&&!isDefined(a.key)?($log.error("[AngularJS - Leaflet] The type of layer "+a.type+" must have key defined"),!1):!0:($log.error("[AngularJS - Leaflet] A layer must have a valid type defined."),!1)}function createLayer(a){if(isValidLayerType(a)){if(!isString(a.name))return void $log.error("[AngularJS - Leaflet] A base layer must have a name");isObject(a.layerParams)||(a.layerParams={}),isObject(a.layerOptions)||(a.layerOptions={});for(var b in a.layerParams)a.layerOptions[b]=a.layerParams[b];var c={url:a.url,data:a.data,options:a.layerOptions,layer:a.layer,icon:a.icon,type:a.layerType,bounds:a.bounds,key:a.key,apiKey:a.apiKey,pluginOptions:a.pluginOptions,user:a.user};return layerTypes[a.type].createLayer(c)}}function safeAddLayer(a,b){b&&"function"==typeof b.addTo?b.addTo(a):a.addLayer(b)}function safeRemoveLayer(a,b,c){if(isDefined(c)&&isDefined(c.loadedDefer))if(angular.isFunction(c.loadedDefer)){var d=c.loadedDefer();$log.debug("Loaded Deferred",d);var e=d.length;if(e>0)for(var f=function(){e--,0===e&&a.removeLayer(b)},g=0;g<d.length;g++)d[g].promise.then(f);else a.removeLayer(b)}else c.loadedDefer.promise.then(function(){a.removeLayer(b)});else a.removeLayer(b)}var Helpers=leafletHelpers,isString=leafletHelpers.isString,isObject=leafletHelpers.isObject,isArray=leafletHelpers.isArray,isDefined=leafletHelpers.isDefined,errorHeader=leafletHelpers.errorHeader,$it=leafletIterators,utfGridCreateLayer=function(a){if(!Helpers.UTFGridPlugin.isLoaded())return void $log.error("[AngularJS - Leaflet] The UTFGrid plugin is not loaded.");var b=new L.UtfGrid(a.url,a.pluginOptions);return b.on("mouseover",function(a){$rootScope.$broadcast("leafletDirectiveMap.utfgridMouseover",a)}),b.on("mouseout",function(a){$rootScope.$broadcast("leafletDirectiveMap.utfgridMouseout",a)}),b.on("click",function(a){$rootScope.$broadcast("leafletDirectiveMap.utfgridClick",a)}),b.on("mousemove",function(a){$rootScope.$broadcast("leafletDirectiveMap.utfgridMousemove",a)}),b},layerTypes={xyz:{mustHaveUrl:!0,createLayer:function(a){return L.tileLayer(a.url,a.options)}},mapbox:{mustHaveKey:!0,createLayer:function(a){var b=3;isDefined(a.options.version)&&4===a.options.version&&(b=a.options.version);var c=3===b?"//{s}.tiles.mapbox.com/v3/"+a.key+"/{z}/{x}/{y}.png":"//api.tiles.mapbox.com/v4/"+a.key+"/{z}/{x}/{y}.png?access_token="+a.apiKey;return L.tileLayer(c,a.options)}},geoJSON:{mustHaveUrl:!0,createLayer:function(a){return Helpers.GeoJSONPlugin.isLoaded()?new L.TileLayer.GeoJSON(a.url,a.pluginOptions,a.options):void 0}},geoJSONShape:{mustHaveUrl:!1,createLayer:function(a){return new L.GeoJSON(a.data,a.options)}},geoJSONAwesomeMarker:{mustHaveUrl:!1,createLayer:function(a){return new L.geoJson(a.data,{pointToLayer:function(b,c){return L.marker(c,{icon:L.AwesomeMarkers.icon(a.icon)})}})}},geoJSONVectorMarker:{mustHaveUrl:!1,createLayer:function(a){return new L.geoJson(a.data,{pointToLayer:function(b,c){return L.marker(c,{icon:L.VectorMarkers.icon(a.icon)})}})}},utfGrid:{mustHaveUrl:!0,createLayer:utfGridCreateLayer},cartodbTiles:{mustHaveKey:!0,createLayer:function(a){var b="//"+a.user+".cartodb.com/api/v1/map/"+a.key+"/{z}/{x}/{y}.png";return L.tileLayer(b,a.options)}},cartodbUTFGrid:{mustHaveKey:!0,mustHaveLayer:!0,createLayer:function(a){return a.url="//"+a.user+".cartodb.com/api/v1/map/"+a.key+"/"+a.layer+"/{z}/{x}/{y}.grid.json",utfGridCreateLayer(a)}},cartodbInteractive:{mustHaveKey:!0,mustHaveLayer:!0,createLayer:function(a){var b="//"+a.user+".cartodb.com/api/v1/map/"+a.key+"/{z}/{x}/{y}.png",c=L.tileLayer(b,a.options);a.url="//"+a.user+".cartodb.com/api/v1/map/"+a.key+"/"+a.layer+"/{z}/{x}/{y}.grid.json";var d=utfGridCreateLayer(a);return L.layerGroup([c,d])}},wms:{mustHaveUrl:!0,createLayer:function(a){return L.tileLayer.wms(a.url,a.options)}},wmts:{mustHaveUrl:!0,createLayer:function(a){return L.tileLayer.wmts(a.url,a.options)}},wfs:{mustHaveUrl:!0,mustHaveLayer:!0,createLayer:function(params){if(Helpers.WFSLayerPlugin.isLoaded()){var options=angular.copy(params.options);return options.crs&&"string"==typeof options.crs&&(options.crs=eval(options.crs)),new L.GeoJSON.WFS(params.url,params.layer,options)}}},group:{mustHaveUrl:!1,createLayer:function(a){var b=[];return $it.each(a.options.layers,function(a){b.push(createLayer(a))}),a.options.loadedDefer=function(){var b=[];if(isDefined(a.options.layers))for(var c=0;c<a.options.layers.length;c++){var d=a.options.layers[c].layerOptions.loadedDefer;isDefined(d)&&b.push(d)}return b},L.layerGroup(b)}},featureGroup:{mustHaveUrl:!1,createLayer:function(){return L.featureGroup()}},google:{mustHaveUrl:!1,createLayer:function(a){var b=a.type||"SATELLITE";if(Helpers.GoogleLayerPlugin.isLoaded())return new L.Google(b,a.options)}},here:{mustHaveUrl:!1,createLayer:function(a){var b=a.provider||"HERE.terrainDay";if(Helpers.LeafletProviderPlugin.isLoaded())return new L.TileLayer.Provider(b,a.options)}},china:{mustHaveUrl:!1,createLayer:function(a){var b=a.type||"";if(Helpers.ChinaLayerPlugin.isLoaded())return L.tileLayer.chinaProvider(b,a.options)}},agsBase:{mustHaveLayer:!0,createLayer:function(a){return Helpers.AGSBaseLayerPlugin.isLoaded()?L.esri.basemapLayer(a.layer,a.options):void 0}},ags:{mustHaveUrl:!0,createLayer:function(a){if(Helpers.AGSLayerPlugin.isLoaded()){var b=angular.copy(a.options);angular.extend(b,{url:a.url});var c=new lvector.AGS(b);return c.onAdd=function(a){this.setMap(a)},c.onRemove=function(){this.setMap(null)},c}}},agsFeature:{mustHaveUrl:!0,createLayer:function(a){if(!Helpers.AGSFeatureLayerPlugin.isLoaded())return void $log.warn(errorHeader+" The esri plugin is not loaded.");a.options.url=a.url;var b=L.esri.featureLayer(a.options),c=function(){isDefined(a.options.loadedDefer)&&a.options.loadedDefer.resolve()};return b.on("loading",function(){a.options.loadedDefer=$q.defer(),b.off("load",c),b.on("load",c)}),b}},agsTiled:{mustHaveUrl:!0,createLayer:function(a){return Helpers.AGSTiledMapLayerPlugin.isLoaded()?(a.options.url=a.url,L.esri.tiledMapLayer(a.options)):void $log.warn(errorHeader+" The esri plugin is not loaded.")}},agsDynamic:{mustHaveUrl:!0,createLayer:function(a){return Helpers.AGSDynamicMapLayerPlugin.isLoaded()?(a.options.url=a.url,L.esri.dynamicMapLayer(a.options)):void $log.warn(errorHeader+" The esri plugin is not loaded.")}},agsImage:{mustHaveUrl:!0,createLayer:function(a){return Helpers.AGSImageMapLayerPlugin.isLoaded()?(a.options.url=a.url,L.esri.imageMapLayer(a.options)):void $log.warn(errorHeader+" The esri plugin is not loaded.")}},agsClustered:{mustHaveUrl:!0,createLayer:function(a){return Helpers.AGSClusteredLayerPlugin.isLoaded()?Helpers.MarkerClusterPlugin.isLoaded()?L.esri.clusteredFeatureLayer(a.url,a.options):void $log.warn(errorHeader+" The markercluster plugin is not loaded."):void $log.warn(errorHeader+" The esri clustered layer plugin is not loaded.")}},agsHeatmap:{mustHaveUrl:!0,createLayer:function(a){return Helpers.AGSHeatmapLayerPlugin.isLoaded()?Helpers.HeatLayerPlugin.isLoaded()?L.esri.heatmapFeatureLayer(a.url,a.options):void $log.warn(errorHeader+" The heatlayer plugin is not loaded."):void $log.warn(errorHeader+" The esri heatmap layer plugin is not loaded.")}},markercluster:{mustHaveUrl:!1,createLayer:function(a){return Helpers.MarkerClusterPlugin.isLoaded()?new L.MarkerClusterGroup(a.options):void $log.warn(errorHeader+" The markercluster plugin is not loaded.")}},bing:{mustHaveUrl:!1,createLayer:function(a){return Helpers.BingLayerPlugin.isLoaded()?new L.BingLayer(a.key,a.options):void 0}},webGLHeatmap:{mustHaveUrl:!1,mustHaveData:!0,createLayer:function(a){if(Helpers.WebGLHeatMapLayerPlugin.isLoaded()){var b=new L.TileLayer.WebGLHeatMap(a.options);return isDefined(a.data)&&b.setData(a.data),b}}},heat:{mustHaveUrl:!1,mustHaveData:!0,createLayer:function(a){if(Helpers.HeatLayerPlugin.isLoaded()){var b=new L.heatLayer;return isArray(a.data)&&b.setLatLngs(a.data),isObject(a.options)&&b.setOptions(a.options),b}}},yandex:{mustHaveUrl:!1,createLayer:function(a){var b=a.type||"map";if(Helpers.YandexLayerPlugin.isLoaded())return new L.Yandex(b,a.options)}},imageOverlay:{mustHaveUrl:!0,mustHaveBounds:!0,createLayer:function(a){return L.imageOverlay(a.url,a.bounds,a.options)}},iip:{mustHaveUrl:!0,createLayer:function(a){return L.tileLayer.iip(a.url,a.options)}},custom:{createLayer:function(a){return a.layer instanceof L.Class?angular.copy(a.layer):void $log.error("[AngularJS - Leaflet] A custom layer must be a leaflet Class")}},cartodb:{mustHaveUrl:!0,createLayer:function(a){return cartodb.createLayer(a.map,a.url)}}};return{createLayer:createLayer,safeAddLayer:safeAddLayer,safeRemoveLayer:safeRemoveLayer}}]),angular.module("leaflet-directive").factory("leafletLegendHelpers",function(){var a=function(a,b,c,d){if(a.innerHTML="",b.error)a.innerHTML+='<div class="info-title alert alert-danger">'+b.error.message+"</div>";else if("arcgis"===c)for(var e=0;e<b.layers.length;e++){var f=b.layers[e];a.innerHTML+='<div class="info-title" data-layerid="'+f.layerId+'">'+f.layerName+"</div>";for(var g=0;g<f.legend.length;g++){var h=f.legend[g];a.innerHTML+='<div class="inline" data-layerid="'+f.layerId+'"><img src="data:'+h.contentType+";base64,"+h.imageData+'" /></div><div class="info-label" data-layerid="'+f.layerId+'">'+h.label+"</div>"}}else"image"===c&&(a.innerHTML='<img src="'+d+'"/>')},b=function(b,c,d,e){return function(){var f=L.DomUtil.create("div",c);return L.Browser.touch?L.DomEvent.on(f,"click",L.DomEvent.stopPropagation):(L.DomEvent.disableClickPropagation(f),L.DomEvent.on(f,"mousewheel",L.DomEvent.stopPropagation)),a(f,b,d,e),f}},c=function(a,b){return function(){for(var c=L.DomUtil.create("div",b),d=0;d<a.colors.length;d++)c.innerHTML+='<div class="outline"><i style="background:'+a.colors[d]+'"></i></div><div class="info-label">'+a.labels[d]+"</div>";return L.Browser.touch?L.DomEvent.on(c,"click",L.DomEvent.stopPropagation):(L.DomEvent.disableClickPropagation(c),L.DomEvent.on(c,"mousewheel",L.DomEvent.stopPropagation)),c}};return{getOnAddLegend:b,getOnAddArrayLegend:c,updateLegend:a}}),angular.module("leaflet-directive").factory("leafletMapDefaults",["$q","leafletHelpers",function(a,b){function c(){return{keyboard:!0,dragging:!0,worldCopyJump:!1,doubleClickZoom:!0,scrollWheelZoom:!0,tap:!0,touchZoom:!0,zoomControl:!0,zoomsliderControl:!1,zoomControlPosition:"topleft",attributionControl:!0,controls:{layers:{visible:!0,position:"topright",collapsed:!0}},nominatim:{server:" http://nominatim.openstreetmap.org/search"},crs:L.CRS.EPSG3857,tileLayer:"//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",tileLayerOptions:{attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'},path:{weight:10,opacity:1,color:"#0000ff"},center:{lat:0,lng:0,zoom:1}}}var d=b.isDefined,e=b.isObject,f=b.obtainEffectiveMapId,g={};return{reset:function(){g={}},getDefaults:function(a){var b=f(g,a);return g[b]},getMapCreationDefaults:function(a){var b=f(g,a),c=g[b],e={maxZoom:c.maxZoom,keyboard:c.keyboard,dragging:c.dragging,zoomControl:c.zoomControl,doubleClickZoom:c.doubleClickZoom,scrollWheelZoom:c.scrollWheelZoom,tap:c.tap,touchZoom:c.touchZoom,attributionControl:c.attributionControl,worldCopyJump:c.worldCopyJump,crs:c.crs};if(d(c.minZoom)&&(e.minZoom=c.minZoom),d(c.zoomAnimation)&&(e.zoomAnimation=c.zoomAnimation),d(c.fadeAnimation)&&(e.fadeAnimation=c.fadeAnimation),d(c.markerZoomAnimation)&&(e.markerZoomAnimation=c.markerZoomAnimation),c.map)for(var h in c.map)e[h]=c.map[h];return e},setDefaults:function(a,b){var h=c();d(a)&&(h.doubleClickZoom=d(a.doubleClickZoom)?a.doubleClickZoom:h.doubleClickZoom,h.scrollWheelZoom=d(a.scrollWheelZoom)?a.scrollWheelZoom:h.doubleClickZoom,h.tap=d(a.tap)?a.tap:h.tap,h.touchZoom=d(a.touchZoom)?a.touchZoom:h.doubleClickZoom,h.zoomControl=d(a.zoomControl)?a.zoomControl:h.zoomControl,h.zoomsliderControl=d(a.zoomsliderControl)?a.zoomsliderControl:h.zoomsliderControl,h.attributionControl=d(a.attributionControl)?a.attributionControl:h.attributionControl,h.tileLayer=d(a.tileLayer)?a.tileLayer:h.tileLayer,h.zoomControlPosition=d(a.zoomControlPosition)?a.zoomControlPosition:h.zoomControlPosition,h.keyboard=d(a.keyboard)?a.keyboard:h.keyboard,h.dragging=d(a.dragging)?a.dragging:h.dragging,d(a.controls)&&angular.extend(h.controls,a.controls),e(a.crs)?h.crs=a.crs:d(L.CRS[a.crs])&&(h.crs=L.CRS[a.crs]),d(a.center)&&angular.copy(a.center,h.center),d(a.tileLayerOptions)&&angular.copy(a.tileLayerOptions,h.tileLayerOptions),d(a.maxZoom)&&(h.maxZoom=a.maxZoom),d(a.minZoom)&&(h.minZoom=a.minZoom),d(a.zoomAnimation)&&(h.zoomAnimation=a.zoomAnimation),d(a.fadeAnimation)&&(h.fadeAnimation=a.fadeAnimation),d(a.markerZoomAnimation)&&(h.markerZoomAnimation=a.markerZoomAnimation),d(a.worldCopyJump)&&(h.worldCopyJump=a.worldCopyJump),d(a.map)&&(h.map=a.map),d(a.path)&&(h.path=a.path));var i=f(g,b);return g[i]=h,h}}}]),angular.module("leaflet-directive").service("leafletMarkersHelpers",["$rootScope","$timeout","leafletHelpers","$log","$compile","leafletGeoJsonHelpers",function(a,b,c,d,e,f){var g=c.isDefined,h=c.defaultTo,i=c.MarkerClusterPlugin,j=c.AwesomeMarkersPlugin,k=c.VectorMarkersPlugin,l=c.MakiMarkersPlugin,m=c.ExtraMarkersPlugin,n=c.DomMarkersPlugin,o=c.safeApply,p=c,q=c.isString,r=c.isNumber,s=c.isObject,t={},u=f,v=c.errorHeader,w=function(a){
var b="";return["_icon","_latlng","_leaflet_id","_map","_shadow"].forEach(function(c){b+=c+": "+h(a[c],"undefined")+" \n"}),"[leafletMarker] : \n"+b},x=function(a,b){var c=b?console:d;c.debug(w(a))},y=function(b){if(g(b)&&g(b.type)&&"awesomeMarker"===b.type)return j.isLoaded()||d.error(v+" The AwesomeMarkers Plugin is not loaded."),new L.AwesomeMarkers.icon(b);if(g(b)&&g(b.type)&&"vectorMarker"===b.type)return k.isLoaded()||d.error(v+" The VectorMarkers Plugin is not loaded."),new L.VectorMarkers.icon(b);if(g(b)&&g(b.type)&&"makiMarker"===b.type)return l.isLoaded()||d.error(v+"The MakiMarkers Plugin is not loaded."),new L.MakiMarkers.icon(b);if(g(b)&&g(b.type)&&"extraMarker"===b.type)return m.isLoaded()||d.error(v+"The ExtraMarkers Plugin is not loaded."),new L.ExtraMarkers.icon(b);if(g(b)&&g(b.type)&&"div"===b.type)return new L.divIcon(b);if(g(b)&&g(b.type)&&"dom"===b.type){n.isLoaded()||d.error(v+"The DomMarkers Plugin is not loaded.");var c=angular.isFunction(b.getMarkerScope)?b.getMarkerScope():a,f=e(b.template)(c),h=angular.copy(b);return h.element=f[0],new L.DomMarkers.icon(h)}if(g(b)&&g(b.type)&&"icon"===b.type)return b.icon;var i="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAGmklEQVRYw7VXeUyTZxjvNnfELFuyIzOabermMZEeQC/OclkO49CpOHXOLJl/CAURuYbQi3KLgEhbrhZ1aDwmaoGqKII6odATmH/scDFbdC7LvFqOCc+e95s2VG50X/LLm/f4/Z7neY/ne18aANCmAr5E/xZf1uDOkTcGcWR6hl9247tT5U7Y6SNvWsKT63P58qbfeLJG8M5qcgTknrvvrdDbsT7Ml+tv82X6vVxJE33aRmgSyYtcWVMqX97Yv2JvW39UhRE2HuyBL+t+gK1116ly06EeWFNlAmHxlQE0OMiV6mQCScusKRlhS3QLeVJdl1+23h5dY4FNB3thrbYboqptEFlphTC1hSpJnbRvxP4NWgsE5Jyz86QNNi/5qSUTGuFk1gu54tN9wuK2wc3o+Wc13RCmsoBwEqzGcZsxsvCSy/9wJKf7UWf1mEY8JWfewc67UUoDbDjQC+FqK4QqLVMGGR9d2wurKzqBk3nqIT/9zLxRRjgZ9bqQgub+DdoeCC03Q8j+0QhFhBHR/eP3U/zCln7Uu+hihJ1+bBNffLIvmkyP0gpBZWYXhKussK6mBz5HT6M1Nqpcp+mBCPXosYQfrekGvrjewd59/GvKCE7TbK/04/ZV5QZYVWmDwH1mF3xa2Q3ra3DBC5vBT1oP7PTj4C0+CcL8c7C2CtejqhuCnuIQHaKHzvcRfZpnylFfXsYJx3pNLwhKzRAwAhEqG0SpusBHfAKkxw3w4627MPhoCH798z7s0ZnBJ/MEJbZSbXPhER2ih7p2ok/zSj2cEJDd4CAe+5WYnBCgR2uruyEw6zRoW6/DWJ/OeAP8pd/BGtzOZKpG8oke0SX6GMmRk6GFlyAc59K32OTEinILRJRchah8HQwND8N435Z9Z0FY1EqtxUg+0SO6RJ/mmXz4VuS+DpxXC3gXmZwIL7dBSH4zKE50wESf8qwVgrP1EIlTO5JP9Igu0aexdh28F1lmAEGJGfh7jE6ElyM5Rw/FDcYJjWhbeiBYoYNIpc2FT/SILivp0F1ipDWk4BIEo2VuodEJUifhbiltnNBIXPUFCMpthtAyqws/BPlEF/VbaIxErdxPphsU7rcCp8DohC+GvBIPJS/tW2jtvTmmAeuNO8BNOYQeG8G/2OzCJ3q+soYB5i6NhMaKr17FSal7GIHheuV3uSCY8qYVuEm1cOzqdWr7ku/R0BDoTT+DT+ohCM6/CCvKLKO4RI+dXPeAuaMqksaKrZ7L3FE5FIFbkIceeOZ2OcHO6wIhTkNo0ffgjRGxEqogXHYUPHfWAC/lADpwGcLRY3aeK4/oRGCKYcZXPVoeX/kelVYY8dUGf8V5EBRbgJXT5QIPhP9ePJi428JKOiEYhYXFBqou2Guh+p/mEB1/RfMw6rY7cxcjTrneI1FrDyuzUSRm9miwEJx8E/gUmqlyvHGkneiwErR21F3tNOK5Tf0yXaT+O7DgCvALTUBXdM4YhC/IawPU+2PduqMvuaR6eoxSwUk75ggqsYJ7VicsnwGIkZBSXKOUww73WGXyqP+J2/b9c+gi1YAg/xpwck3gJuucNrh5JvDPvQr0WFXf0piyt8f8/WI0hV4pRxxkQZdJDfDJNOAmM0Ag8jyT6hz0WGXWuP94Yh2jcfjmXAGvHCMslRimDHYuHuDsy2QtHuIavznhbYURq5R57KpzBBRZKPJi8eQg48h4j8SDdowifdIrEVdU+gbO6QNvRRt4ZBthUaZhUnjlYObNagV3keoeru3rU7rcuceqU1mJBxy+BWZYlNEBH+0eH4vRiB+OYybU2hnblYlTvkHinM4m54YnxSyaZYSF6R3jwgP7udKLGIX6r/lbNa9N6y5MFynjWDtrHd75ZvTYAPO/6RgF0k76mQla3FGq7dO+cH8sKn0Vo7nDllwAhqwLPkxrHwWmHJOo+AKJ4rab5OgrM7rVu8eWb2Pu0Dh4eDgXoOfvp7Y7QeqknRmvcTBEyq9m/HQQSCSz6LHq3z0yzsNySRfMS253wl2KyRDbcZPcfJKjZmSEOjcxyi+Y8dUOtsIEH6R2wNykdqrkYJ0RV92H0W58pkfQk7cKevsLK10Py8SdMGfXNXATY+pPbyJR/ET6n9nIfztNtZYRV9XniQu9IA2vOVgy4ir7GCLVmmd+zjkH0eAF9Po6K61pmCXHxU5rHMYd1ftc3owjwRSVRzLjKvqZEty6cRUD7jGqiOdu5HG6MdHjNcNYGqfDm5YRzLBBCCDl/2bk8a8gdbqcfwECu62Fg/HrggAAAABJRU5ErkJggg==",o="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAYAAACoYAD2AAAC5ElEQVRYw+2YW4/TMBCF45S0S1luXZCABy5CgLQgwf//S4BYBLTdJLax0fFqmB07nnQfEGqkIydpVH85M+NLjPe++dcPc4Q8Qh4hj5D/AaQJx6H/4TMwB0PeBNwU7EGQAmAtsNfAzoZkgIa0ZgLMa4Aj6CxIAsjhjOCoL5z7Glg1JAOkaicgvQBXuncwJAWjksLtBTWZe04CnYRktUGdilALppZBOgHGZcBzL6OClABvMSVIzyBjazOgrvACf1ydC5mguqAVg6RhdkSWQFj2uxfaq/BrIZOLEWgZdALIDvcMcZLD8ZbLC9de4yR1sYMi4G20S4Q/PWeJYxTOZn5zJXANZHIxAd4JWhPIloTJZhzMQduM89WQ3MUVAE/RnhAXpTycqys3NZALOBbB7kFrgLesQl2h45Fcj8L1tTSohUwuxhy8H/Qg6K7gIs+3kkaigQCOcyEXCHN07wyQazhrmIulvKMQAwMcmLNqyCVyMAI+BuxSMeTk3OPikLY2J1uE+VHQk6ANrhds+tNARqBeaGc72cK550FP4WhXmFmcMGhTwAR1ifOe3EvPqIegFmF+C8gVy0OfAaWQPMR7gF1OQKqGoBjq90HPMP01BUjPOqGFksC4emE48tWQAH0YmvOgF3DST6xieJgHAWxPAHMuNhrImIdvoNOKNWIOcE+UXE0pYAnkX6uhWsgVXDxHdTfCmrEEmMB2zMFimLVOtiiajxiGWrbU52EeCdyOwPEQD8LqyPH9Ti2kgYMf4OhSKB7qYILbBv3CuVTJ11Y80oaseiMWOONc/Y7kJYe0xL2f0BaiFTxknHO5HaMGMublKwxFGzYdWsBF174H/QDknhTHmHHN39iWFnkZx8lPyM8WHfYELmlLKtgWNmFNzQcC1b47gJ4hL19i7o65dhH0Negbca8vONZoP7doIeOC9zXm8RjuL0Gf4d4OYaU5ljo3GYiqzrWQHfJxA6ALhDpVKv9qYeZA8eM3EhfPSCmpuD0AAAAASUVORK5CYII=";return g(b)&&g(b.iconUrl)?new L.Icon(b):new L.Icon.Default({iconUrl:i,shadowUrl:o,iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]})},z=function(a){g(t[a])&&t.splice(a,1)},A=function(){t={}},B=function(a,b,c){if(a.closePopup(),g(c)&&g(c.overlays))for(var d in c.overlays)if((c.overlays[d]instanceof L.LayerGroup||c.overlays[d]instanceof L.FeatureGroup)&&c.overlays[d].hasLayer(a))return void c.overlays[d].removeLayer(a);if(g(t))for(var e in t)t[e].hasLayer(a)&&t[e].removeLayer(a);b.hasLayer(a)&&b.removeLayer(a)},C=function(a,b){var c=a._popup._container.offsetHeight,d=new L.Point(a._popup._containerLeft,-c-a._popup._containerBottom),e=b.layerPointToContainerPoint(d);null!==e&&a._popup._adjustPan()},D=function(a,b){e(a._popup._contentNode)(b)},E=function(a,c,d){var e=a._popup._contentNode.innerText||a._popup._contentNode.textContent;e.length<1&&b(function(){E(a,c,d)});var f=a._popup._contentNode.offsetWidth;return a._popup._updateLayout(),a._popup._updatePosition(),a._popup.options.autoPan&&C(a,d),f},F=function(b,c,e){var f=angular.isFunction(c.getMessageScope)?c.getMessageScope():a,h=g(c.compileMessage)?c.compileMessage:!0;if(h){if(!g(b._popup)||!g(b._popup._contentNode))return d.error(v+"Popup is invalid or does not have any content."),!1;D(b,f),E(b,c,e)}},G=function(b,c){var d=angular.isFunction(c.getMessageScope)?c.getMessageScope():a,f=angular.isFunction(c.getLabelScope)?c.getLabelScope():d,h=g(c.compileMessage)?c.compileMessage:!0;p.LabelPlugin.isLoaded()&&g(c.label)&&(g(c.label.options)&&c.label.options.noHide===!0&&b.showLabel(),h&&g(b.label)&&e(b.label._container)(f))},H=function(a,b,c,e,f,h,i){if(g(b)){if(!u.validateCoords(a))return d.warn("There are problems with lat-lng data, please verify your marker model"),void B(c,i,h);var j=a===b;if(g(a.iconAngle)&&b.iconAngle!==a.iconAngle&&c.setIconAngle(a.iconAngle),q(a.layer)||q(b.layer)&&(g(h.overlays[b.layer])&&h.overlays[b.layer].hasLayer(c)&&(h.overlays[b.layer].removeLayer(c),c.closePopup()),i.hasLayer(c)||i.addLayer(c)),(r(a.opacity)||r(parseFloat(a.opacity)))&&a.opacity!==b.opacity&&c.setOpacity(a.opacity),q(a.layer)&&b.layer!==a.layer){if(q(b.layer)&&g(h.overlays[b.layer])&&h.overlays[b.layer].hasLayer(c)&&h.overlays[b.layer].removeLayer(c),c.closePopup(),i.hasLayer(c)&&i.removeLayer(c),!g(h.overlays[a.layer]))return void d.error(v+"You must use a name of an existing layer");var k=h.overlays[a.layer];if(!(k instanceof L.LayerGroup||k instanceof L.FeatureGroup))return void d.error(v+'A marker can only be added to a layer of type "group" or "featureGroup"');k.addLayer(c),i.hasLayer(c)&&a.focus===!0&&c.openPopup()}if(a.draggable!==!0&&b.draggable===!0&&g(c.dragging)&&c.dragging.disable(),a.draggable===!0&&b.draggable!==!0&&(c.dragging?c.dragging.enable():L.Handler.MarkerDrag&&(c.dragging=new L.Handler.MarkerDrag(c),c.options.draggable=!0,c.dragging.enable())),s(a.icon)||s(b.icon)&&(c.setIcon(y()),c.closePopup(),c.unbindPopup(),q(a.message)&&c.bindPopup(a.message,a.popupOptions)),s(a.icon)&&s(b.icon)&&!angular.equals(a.icon,b.icon)){var l=!1;c.dragging&&(l=c.dragging.enabled()),c.setIcon(y(a.icon)),l&&c.dragging.enable(),c.closePopup(),c.unbindPopup(),q(a.message)&&(c.bindPopup(a.message,a.popupOptions),i.hasLayer(c)&&a.focus===!0&&c.openPopup())}!q(a.message)&&q(b.message)&&(c.closePopup(),c.unbindPopup()),p.LabelPlugin.isLoaded()&&(g(a.label)&&g(a.label.message)?"label"in b&&"message"in b.label&&!angular.equals(a.label.message,b.label.message)?c.updateLabelContent(a.label.message):!angular.isFunction(c.getLabel)||angular.isFunction(c.getLabel)&&!g(c.getLabel())?(c.bindLabel(a.label.message,a.label.options),G(c,a)):G(c,a):(!("label"in a)||"message"in a.label)&&angular.isFunction(c.unbindLabel)&&c.unbindLabel()),q(a.message)&&!q(b.message)&&c.bindPopup(a.message,a.popupOptions),q(a.message)&&q(b.message)&&a.message!==b.message&&c.setPopupContent(a.message);var m=!1;a.focus!==!0&&b.focus===!0&&(c.closePopup(),m=!0),(a.focus===!0&&(!g(b.focus)||b.focus===!1)||j&&a.focus===!0)&&(c.openPopup(),m=!0),b.zIndexOffset!==a.zIndexOffset&&c.setZIndexOffset(a.zIndexOffset);var n=c.getLatLng(),o=q(a.layer)&&p.MarkerClusterPlugin.is(h.overlays[a.layer]);o?m?(a.lat!==b.lat||a.lng!==b.lng)&&(h.overlays[a.layer].removeLayer(c),c.setLatLng([a.lat,a.lng]),h.overlays[a.layer].addLayer(c)):n.lat!==a.lat||n.lng!==a.lng?(h.overlays[a.layer].removeLayer(c),c.setLatLng([a.lat,a.lng]),h.overlays[a.layer].addLayer(c)):a.lat!==b.lat||a.lng!==b.lng?(h.overlays[a.layer].removeLayer(c),c.setLatLng([a.lat,a.lng]),h.overlays[a.layer].addLayer(c)):s(a.icon)&&s(b.icon)&&!angular.equals(a.icon,b.icon)&&(h.overlays[a.layer].removeLayer(c),h.overlays[a.layer].addLayer(c)):(n.lat!==a.lat||n.lng!==a.lng)&&c.setLatLng([a.lat,a.lng])}};return{resetMarkerGroup:z,resetMarkerGroups:A,deleteMarker:B,manageOpenPopup:F,manageOpenLabel:G,createMarker:function(a){if(!g(a)||!u.validateCoords(a))return void d.error(v+"The marker definition is not valid.");var b=u.getCoords(a);if(!g(b))return void d.error(v+"Unable to get coordinates from markerData.");var c={icon:y(a.icon),title:g(a.title)?a.title:"",draggable:g(a.draggable)?a.draggable:!1,clickable:g(a.clickable)?a.clickable:!0,riseOnHover:g(a.riseOnHover)?a.riseOnHover:!1,zIndexOffset:g(a.zIndexOffset)?a.zIndexOffset:0,iconAngle:g(a.iconAngle)?a.iconAngle:0};for(var e in a)a.hasOwnProperty(e)&&!c.hasOwnProperty(e)&&(c[e]=a[e]);var f=new L.marker(b,c);return q(a.message)||f.unbindPopup(),f},addMarkerToGroup:function(a,b,c,e){return q(b)?i.isLoaded()?(g(t[b])||(t[b]=new L.MarkerClusterGroup(c),e.addLayer(t[b])),void t[b].addLayer(a)):void d.error(v+"The MarkerCluster plugin is not loaded."):void d.error(v+"The marker group you have specified is invalid.")},listenMarkerEvents:function(a,b,c,d,e){a.on("popupopen",function(){o(c,function(){(g(a._popup)||g(a._popup._contentNode))&&(b.focus=!0,F(a,b,e))})}),a.on("popupclose",function(){o(c,function(){b.focus=!1})}),a.on("add",function(){o(c,function(){"label"in b&&G(a,b)})})},updateMarker:H,addMarkerWatcher:function(a,b,c,d,e,f){var i=p.getObjectArrayPath("markers."+b);f=h(f,!0);var j=c.$watch(i,function(f,h){return g(f)?void H(f,h,a,b,c,d,e):(B(a,e,d),void j())},f)},string:w,log:x}}]),angular.module("leaflet-directive").factory("leafletPathsHelpers",["$rootScope","$log","leafletHelpers",function(a,b,c){function d(a){return a.filter(function(a){return k(a)}).map(function(a){return e(a)})}function e(a){return i(a)?new L.LatLng(a[0],a[1]):new L.LatLng(a.lat,a.lng)}function f(a){return a.map(function(a){return d(a)})}function g(a,b){for(var c={},d=0;d<l.length;d++){var e=l[d];h(a[e])?c[e]=a[e]:h(b.path[e])&&(c[e]=b.path[e])}return c}var h=c.isDefined,i=c.isArray,j=c.isNumber,k=c.isValidPoint,l=["stroke","weight","color","opacity","fill","fillColor","fillOpacity","dashArray","lineCap","lineJoin","clickable","pointerEvents","className","smoothFactor","noClip"],m=function(a,b){for(var c={},d=0;d<l.length;d++){var e=l[d];h(b[e])&&(c[e]=b[e])}a.setStyle(b)},n=function(a){if(!i(a))return!1;for(var b=0;b<a.length;b++){var c=a[b];if(!k(c))return!1}return!0},o={polyline:{isValid:function(a){var b=a.latlngs;return n(b)},createPath:function(a){return new L.Polyline([],a)},setPath:function(a,b){a.setLatLngs(d(b.latlngs)),m(a,b)}},multiPolyline:{isValid:function(a){var b=a.latlngs;if(!i(b))return!1;for(var c in b){var d=b[c];if(!n(d))return!1}return!0},createPath:function(a){return new L.multiPolyline([[[0,0],[1,1]]],a)},setPath:function(a,b){a.setLatLngs(f(b.latlngs)),m(a,b)}},polygon:{isValid:function(a){var b=a.latlngs;return n(b)},createPath:function(a){return new L.Polygon([],a)},setPath:function(a,b){a.setLatLngs(d(b.latlngs)),m(a,b)}},multiPolygon:{isValid:function(a){var b=a.latlngs;if(!i(b))return!1;for(var c in b){var d=b[c];if(!n(d))return!1}return!0},createPath:function(a){return new L.MultiPolygon([[[0,0],[1,1],[0,1]]],a)},setPath:function(a,b){a.setLatLngs(f(b.latlngs)),m(a,b)}},rectangle:{isValid:function(a){var b=a.latlngs;if(!i(b)||2!==b.length)return!1;for(var c in b){var d=b[c];if(!k(d))return!1}return!0},createPath:function(a){return new L.Rectangle([[0,0],[1,1]],a)},setPath:function(a,b){a.setBounds(new L.LatLngBounds(d(b.latlngs))),m(a,b)}},circle:{isValid:function(a){var b=a.latlngs;return k(b)&&j(a.radius)},createPath:function(a){return new L.Circle([0,0],1,a)},setPath:function(a,b){a.setLatLng(e(b.latlngs)),h(b.radius)&&a.setRadius(b.radius),m(a,b)}},circleMarker:{isValid:function(a){var b=a.latlngs;return k(b)&&j(a.radius)},createPath:function(a){return new L.CircleMarker([0,0],a)},setPath:function(a,b){a.setLatLng(e(b.latlngs)),h(b.radius)&&a.setRadius(b.radius),m(a,b)}}},p=function(a){var b={};return a.latlngs&&(b.latlngs=a.latlngs),a.radius&&(b.radius=a.radius),b};return{setPathOptions:function(a,b,c){h(b)||(b="polyline"),o[b].setPath(a,c)},createPath:function(a,c,d){h(c.type)||(c.type="polyline");var e=g(c,d),f=p(c);return o[c.type].isValid(f)?o[c.type].createPath(e):void b.error("[AngularJS - Leaflet] Invalid data passed to the "+c.type+" path")}}}]),angular.module("leaflet-directive").service("leafletWatchHelpers",function(){var a=function(a,b,c,d,e){var f=a[b](c,function(a,b){e(a,b),d.doWatch||f()},d.isDeep);return f},b=function(b,c,d,e){return a(b,"$watch",c,d,e)},c=function(b,c,d,e){return a(b,"$watchCollection",c,d,e)};return{maybeWatch:b,maybeWatchCollection:c}}),angular.module("leaflet-directive").factory("nominatimService",["$q","$http","leafletHelpers","leafletMapDefaults",function(a,b,c,d){var e=c.isDefined;return{query:function(c,f){var g=d.getDefaults(f),h=g.nominatim.server,i=a.defer();return b.get(h,{params:{format:"json",limit:1,q:c}}).success(function(a){a.length>0&&e(a[0].boundingbox)?i.resolve(a[0]):i.reject("[Nominatim] Invalid address")}),i.promise}}}]),angular.module("leaflet-directive").directive("bounds",["$log","$timeout","$http","leafletHelpers","nominatimService","leafletBoundsHelpers",function(a,b,c,d,e,f){return{restrict:"A",scope:!1,replace:!1,require:["leaflet"],link:function(c,g,h,i){var j=d.isDefined,k=f.createLeafletBounds,l=i[0].getLeafletScope(),m=i[0],n=d.errorHeader+" [Bounds] ",o=function(a){return 0===a._southWest.lat&&0===a._southWest.lng&&0===a._northEast.lat&&0===a._northEast.lng};m.getMap().then(function(d){l.$on("boundsChanged",function(a){var c=a.currentScope,e=d.getBounds();if(!o(e)&&!c.settingBoundsFromScope){c.settingBoundsFromLeaflet=!0;var f={northEast:{lat:e._northEast.lat,lng:e._northEast.lng},southWest:{lat:e._southWest.lat,lng:e._southWest.lng},options:e.options};angular.equals(c.bounds,f)||(c.bounds=f),b(function(){c.settingBoundsFromLeaflet=!1})}});var f;l.$watch("bounds",function(g){if(!c.settingBoundsFromLeaflet){if(j(g.address)&&g.address!==f)return c.settingBoundsFromScope=!0,e.query(g.address,h.id).then(function(a){var b=a.boundingbox,c=[[b[0],b[2]],[b[1],b[3]]];d.fitBounds(c)},function(b){a.error(n+" "+b+".")}),f=g.address,void b(function(){c.settingBoundsFromScope=!1});var i=k(g);i&&!d.getBounds().equals(i)&&(c.settingBoundsFromScope=!0,d.fitBounds(i,g.options),b(function(){c.settingBoundsFromScope=!1}))}},!0)})}}}]);var centerDirectiveTypes=["center","lfCenter"],centerDirectives={};centerDirectiveTypes.forEach(function(a){centerDirectives[a]=["$log","$q","$location","$timeout","leafletMapDefaults","leafletHelpers","leafletBoundsHelpers","leafletMapEvents",function(b,c,d,e,f,g,h,i){var j,k=g.isDefined,l=g.isNumber,m=g.isSameCenterOnMap,n=g.safeApply,o=g.isValidCenter,p=h.isValidBounds,q=g.isUndefinedOrEmpty,r=g.errorHeader,s=function(a,b){return k(a)&&p(a)&&q(b)};return{restrict:"A",scope:!1,replace:!1,require:"leaflet",controller:function(){j=c.defer(),this.getCenter=function(){return j.promise}},link:function(c,g,p,q){var t=q.getLeafletScope(),u=t[a];q.getMap().then(function(c){var g=f.getDefaults(p.id);if(-1!==p[a].search("-"))return b.error(r+' The "center" variable can\'t use a "-" on its key name: "'+p[a]+'".'),void c.setView([g.center.lat,g.center.lng],g.center.zoom);if(s(t.bounds,u))c.fitBounds(h.createLeafletBounds(t.bounds),t.bounds.options),u=c.getCenter(),n(t,function(b){angular.extend(b[a],{lat:c.getCenter().lat,lng:c.getCenter().lng,zoom:c.getZoom(),autoDiscover:!1})}),n(t,function(a){var b=c.getBounds();a.bounds={northEast:{lat:b._northEast.lat,lng:b._northEast.lng},southWest:{lat:b._southWest.lat,lng:b._southWest.lng}}});else{if(!k(u))return b.error(r+' The "center" property is not defined in the main scope'),void c.setView([g.center.lat,g.center.lng],g.center.zoom);k(u.lat)&&k(u.lng)||k(u.autoDiscover)||angular.copy(g.center,u)}var q,v;if("yes"===p.urlHashCenter){var w=function(){var a,b=d.search();if(k(b.c)){var c=b.c.split(":");3===c.length&&(a={lat:parseFloat(c[0]),lng:parseFloat(c[1]),zoom:parseInt(c[2],10)})}return a};q=w(),t.$on("$locationChangeSuccess",function(b){var d=b.currentScope,e=w();k(e)&&!m(e,c)&&angular.extend(d[a],{lat:e.lat,lng:e.lng,zoom:e.zoom})})}t.$watch(a,function(a){return t.settingCenterFromLeaflet?void 0:(k(q)&&(angular.copy(q,a),q=void 0),o(a)||a.autoDiscover===!0?a.autoDiscover===!0?(l(a.zoom)||c.setView([g.center.lat,g.center.lng],g.center.zoom),void(l(a.zoom)&&a.zoom>g.center.zoom?c.locate({setView:!0,maxZoom:a.zoom}):k(g.maxZoom)?c.locate({setView:!0,maxZoom:g.maxZoom}):c.locate({setView:!0}))):void(v&&m(a,c)||(t.settingCenterFromScope=!0,c.setView([a.lat,a.lng],a.zoom),i.notifyCenterChangedToBounds(t,c),e(function(){t.settingCenterFromScope=!1}))):void b.warn(r+" invalid 'center'"))},!0),c.whenReady(function(){v=!0}),c.on("moveend",function(){j.resolve(),i.notifyCenterUrlHashChanged(t,c,p,d.search()),m(u,c)||t.settingCenterFromScope||(t.settingCenterFromLeaflet=!0,n(t,function(b){t.settingCenterFromScope||angular.extend(b[a],{lat:c.getCenter().lat,lng:c.getCenter().lng,zoom:c.getZoom(),autoDiscover:!1}),i.notifyCenterChangedToBounds(t,c),e(function(){t.settingCenterFromLeaflet=!1})}))}),u.autoDiscover===!0&&c.on("locationerror",function(){b.warn(r+" The Geolocation API is unauthorized on this page."),o(u)?(c.setView([u.lat,u.lng],u.zoom),i.notifyCenterChangedToBounds(t,c)):(c.setView([g.center.lat,g.center.lng],g.center.zoom),i.notifyCenterChangedToBounds(t,c))})})}}}]}),centerDirectiveTypes.forEach(function(a){angular.module("leaflet-directive").directive(a,centerDirectives[a])}),angular.module("leaflet-directive").directive("controls",["$log","leafletHelpers","leafletControlHelpers",function(a,b,c){return{restrict:"A",scope:!1,replace:!1,require:"?^leaflet",link:function(d,e,f,g){if(g){var h=c.createControl,i=c.isValidControlType,j=g.getLeafletScope(),k=b.isDefined,l=b.isArray,m={},n=b.errorHeader+" [Controls] ";g.getMap().then(function(b){j.$watchCollection("controls",function(c){for(var d in m)k(c[d])||(b.hasControl(m[d])&&b.removeControl(m[d]),delete m[d]);for(var e in c){var f,g=k(c[e].type)?c[e].type:e;if(!i(g))return void a.error(n+" Invalid control type: "+g+".");if("custom"!==g)f=h(g,c[e]),b.addControl(f),m[e]=f;else{var j=c[e];if(l(j))for(var o in j){var p=j[o];b.addControl(p),m[e]=k(m[e])?m[e].concat([p]):[p]}else b.addControl(j),m[e]=j}}})})}}}}]),angular.module("leaflet-directive").directive("decorations",["$log","leafletHelpers",function(a,b){return{restrict:"A",scope:!1,replace:!1,require:"leaflet",link:function(c,d,e,f){function g(b){return k(b)&&k(b.coordinates)&&(j.isLoaded()||a.error("[AngularJS - Leaflet] The PolylineDecorator Plugin is not loaded.")),L.polylineDecorator(b.coordinates)}function h(a,b){return k(a)&&k(b)&&k(b.coordinates)&&k(b.patterns)?(a.setPaths(b.coordinates),a.setPatterns(b.patterns),a):void 0}var i=f.getLeafletScope(),j=b.PolylineDecoratorPlugin,k=b.isDefined,l={};f.getMap().then(function(a){i.$watch("decorations",function(b){for(var c in l)k(b[c])&&angular.equals(b[c],l)||(a.removeLayer(l[c]),delete l[c]);for(var d in b){var e=b[d],f=g(e);k(f)&&(l[d]=f,a.addLayer(f),h(f,e))}},!0)})}}}]),angular.module("leaflet-directive").directive("eventBroadcast",["$log","$rootScope","leafletHelpers","leafletMapEvents","leafletIterators",function(a,b,c,d,e){return{restrict:"A",scope:!1,replace:!1,require:"leaflet",link:function(b,f,g,h){var i=c.isObject,j=c.isDefined,k=h.getLeafletScope(),l=k.eventBroadcast,m=d.getAvailableMapEvents(),n=d.addEvents;h.getMap().then(function(b){var c=[],d="broadcast";j(l.map)?i(l.map)?("emit"!==l.map.logic&&"broadcast"!==l.map.logic?a.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'."):d=l.map.logic,i(l.map.enable)&&l.map.enable.length>=0?e.each(l.map.enable,function(a){-1===c.indexOf(a)&&-1!==m.indexOf(a)&&c.push(a)}):a.warn("[AngularJS - Leaflet] event-broadcast.map.enable must be an object check your model.")):a.warn("[AngularJS - Leaflet] event-broadcast.map must be an object check your model."):c=m,n(b,c,"eventName",k,d)})}}}]),angular.module("leaflet-directive").directive("geojson",["$log","$rootScope","leafletData","leafletHelpers","leafletWatchHelpers","leafletDirectiveControlsHelpers","leafletIterators","leafletGeoJsonEvents",function(a,b,c,d,e,f,g,h){var i=e.maybeWatch,j=d.watchOptions,k=f.extend,l=d,m=g;return{restrict:"A",scope:!1,replace:!1,require:"leaflet",link:function(a,b,e,f){var g=d.isDefined,n=f.getLeafletScope(),o={},p=!1;f.getMap().then(function(a){var b=n.geojsonWatchOptions||j,f=function(a,b){var c;return c=angular.isFunction(a.onEachFeature)?a.onEachFeature:function(c,f){d.LabelPlugin.isLoaded()&&g(c.properties.description)&&f.bindLabel(c.properties.description),h.bindEvents(e.id,f,null,c,n,b,{resetStyleOnMouseout:a.resetStyleOnMouseout,mapId:e.id})}},q=l.isDefined(e.geojsonNested)&&l.isTruthy(e.geojsonNested),r=function(){if(o){var b=function(b){g(b)&&a.hasLayer(b)&&a.removeLayer(b)};return q?void m.each(o,function(a){b(a)}):void b(o)}},s=function(b,d){var h=angular.copy(b);if(g(h)&&g(h.data)){var i=f(h,d);g(h.options)||(h.options={style:h.style,filter:h.filter,onEachFeature:i,pointToLayer:h.pointToLayer});var j=L.geoJson(h.data,h.options);d&&l.isString(d)?o[d]=j:o=j,j.addTo(a),p||(p=!0,c.setGeoJSON(o,e.id))}},t=function(a){if(r(),q){if(!a||!Object.keys(a).length)return;return void m.each(a,function(a,b){s(a,b)})}s(a)};k(e.id,"geojson",t,r),i(n,"geojson",b,function(a){t(a)})})}}}]),angular.module("leaflet-directive").directive("layercontrol",["$filter","$log","leafletData","leafletHelpers",function(a,b,c,d){return{restrict:"E",scope:{icons:"=?",autoHideOpacity:"=?",showGroups:"=?",title:"@",baseTitle:"@",overlaysTitle:"@"},replace:!0,transclude:!1,require:"^leaflet",controller:["$scope","$element","$sce",function(a,e,f){b.debug("[Angular Directive - Layers] layers",a,e);var g=d.safeApply,h=d.isDefined;angular.extend(a,{baselayer:"",oldGroup:"",layerProperties:{},groupProperties:{},rangeIsSupported:d.rangeIsSupported(),changeBaseLayer:function(b,e){d.safeApply(a,function(d){d.baselayer=b,c.getMap().then(function(e){c.getLayers().then(function(c){if(!e.hasLayer(c.baselayers[b])){for(var f in d.layers.baselayers)d.layers.baselayers[f].icon=d.icons.unradio,e.hasLayer(c.baselayers[f])&&e.removeLayer(c.baselayers[f]);e.addLayer(c.baselayers[b]),d.layers.baselayers[b].icon=a.icons.radio}})})}),e.preventDefault()},moveLayer:function(b,c,d){var e=Object.keys(a.layers.baselayers).length;if(c>=1+e&&c<=a.overlaysArray.length+e){var f;for(var h in a.layers.overlays)if(a.layers.overlays[h].index===c){f=a.layers.overlays[h];break}f&&g(a,function(){f.index=b.index,b.index=c})}d.stopPropagation(),d.preventDefault()},initIndex:function(b,c){var d=Object.keys(a.layers.baselayers).length;b.index=h(b.index)?b.index:c+d+1},initGroup:function(b){a.groupProperties[b]=a.groupProperties[b]?a.groupProperties[b]:{}},toggleOpacity:function(b,c){if(c.visible){if(a.autoHideOpacity&&!a.layerProperties[c.name].opacityControl)for(var d in a.layerProperties)a.layerProperties[d].opacityControl=!1;a.layerProperties[c.name].opacityControl=!a.layerProperties[c.name].opacityControl}b.stopPropagation(),b.preventDefault()},toggleLegend:function(b){a.layerProperties[b.name].showLegend=!a.layerProperties[b.name].showLegend},showLegend:function(b){return b.legend&&a.layerProperties[b.name].showLegend},unsafeHTML:function(a){return f.trustAsHtml(a)},getOpacityIcon:function(b){return b.visible&&a.layerProperties[b.name].opacityControl?a.icons.close:a.icons.open},getGroupIcon:function(b){return b.visible?a.icons.check:a.icons.uncheck},changeOpacity:function(b){var d=a.layerProperties[b.name].opacity;c.getMap().then(function(e){c.getLayers().then(function(c){var f;for(var g in a.layers.overlays)if(a.layers.overlays[g]===b){f=c.overlays[g];break}e.hasLayer(f)&&(f.setOpacity&&f.setOpacity(d/100),f.getLayers&&f.eachLayer&&f.eachLayer(function(a){a.setOpacity&&a.setOpacity(d/100)}))})})},changeGroupVisibility:function(b){if(h(a.groupProperties[b])){var c=a.groupProperties[b].visible;for(var d in a.layers.overlays){var e=a.layers.overlays[d];e.group===b&&(e.visible=c)}}}});var i=e.get(0);L.Browser.touch?L.DomEvent.on(i,"click",L.DomEvent.stopPropagation):(L.DomEvent.disableClickPropagation(i),L.DomEvent.on(i,"mousewheel",L.DomEvent.stopPropagation))}],template:'<div class="angular-leaflet-control-layers" ng-show="overlaysArray.length"><h4 ng-if="title">{{ title }}</h4><div class="lf-baselayers"><h5 class="lf-title" ng-if="baseTitle">{{ baseTitle }}</h5><div class="lf-row" ng-repeat="(key, layer) in baselayersArray"><label class="lf-icon-bl" ng-click="changeBaseLayer(key, $event)"><input class="leaflet-control-layers-selector" type="radio" name="lf-radio" ng-show="false" ng-checked="baselayer === key" ng-value="key" /> <i class="lf-icon lf-icon-radio" ng-class="layer.icon"></i><div class="lf-text">{{layer.name}}</div></label></div></div><div class="lf-overlays"><h5 class="lf-title" ng-if="overlaysTitle">{{ overlaysTitle }}</h5><div class="lf-container"><div class="lf-row" ng-repeat="layer in (o = (overlaysArray | orderBy:\'index\':order))" ng-init="initIndex(layer, $index)"><label class="lf-icon-ol-group" ng-if="showGroups &amp;&amp; layer.group &amp;&amp; layer.group != o[$index-1].group"><input class="lf-control-layers-selector" type="checkbox" ng-show="false" ng-change="changeGroupVisibility(layer.group)" ng-model="groupProperties[layer.group].visible"/> <i class="lf-icon lf-icon-check" ng-class="getGroupIcon(groupProperties[layer.group])"></i><div class="lf-text">{{ layer.group }}</div></label><label class="lf-icon-ol"><input class="lf-control-layers-selector" type="checkbox" ng-show="false" ng-model="layer.visible"/> <i class="lf-icon lf-icon-check" ng-class="layer.icon"></i><div class="lf-text">{{layer.name}}</div></label><div class="lf-icons"><i class="lf-icon lf-up" ng-class="icons.up" ng-click="moveLayer(layer, layer.index - orderNumber, $event)"></i> <i class="lf-icon lf-down" ng-class="icons.down" ng-click="moveLayer(layer, layer.index + orderNumber, $event)"></i> <i class="lf-icon lf-toggle-legend" ng-class="icons.toggleLegend" ng-if="layer.legend" ng-click="toggleLegend(layer)"></i> <i class="lf-icon lf-open" ng-class="getOpacityIcon(layer)" ng-click="toggleOpacity($event, layer)"></i></div><div class="lf-legend" ng-if="showLegend(layer)" ng-bind-html="unsafeHTML(layer.legend)"></div><div class="lf-opacity clearfix" ng-if="layer.visible &amp;&amp; layerProperties[layer.name].opacityControl"><label ng-if="rangeIsSupported" class="pull-left" style="width: 50%">0</label><label ng-if="rangeIsSupported" class="pull-left text-right" style="width: 50%">100</label><input ng-if="rangeIsSupported" class="clearfix" type="range" min="0" max="100" class="lf-opacity-control" ng-model="layerProperties[layer.name].opacity" ng-change="changeOpacity(layer)"/><h6 ng-if="!rangeIsSupported">Range is not supported in this browser</h6></div></div></div></div></div>',link:function(a,b,e,f){var g=d.isDefined,h=f.getLeafletScope(),i=h.layers;a.$watch("icons",function(){var b={uncheck:"fa fa-square-o",check:"fa fa-check-square-o",radio:"fa fa-dot-circle-o",unradio:"fa fa-circle-o",up:"fa fa-angle-up",down:"fa fa-angle-down",open:"fa fa-angle-double-down",close:"fa fa-angle-double-up",toggleLegend:"fa fa-pencil-square-o"};g(a.icons)?(angular.extend(b,a.icons),angular.extend(a.icons,b)):a.icons=b}),e.order=!g(e.order)||"normal"!==e.order&&"reverse"!==e.order?"normal":e.order,a.order="normal"===e.order,a.orderNumber="normal"===e.order?-1:1,a.layers=i,f.getMap().then(function(b){h.$watch("layers.baselayers",function(d){var e={};c.getLayers().then(function(c){var f;for(f in d){var g=d[f];g.icon=a.icons[b.hasLayer(c.baselayers[f])?"radio":"unradio"],e[f]=g}a.baselayersArray=e})}),h.$watch("layers.overlays",function(b){var d=[],e={};c.getLayers().then(function(c){var f;for(f in b){var h=b[f];h.icon=a.icons[h.visible?"check":"uncheck"],d.push(h),g(a.layerProperties[h.name])||(a.layerProperties[h.name]={opacity:g(h.layerOptions.opacity)?100*h.layerOptions.opacity:100,opacityControl:!1,showLegend:!0}),g(h.group)&&(g(a.groupProperties[h.group])||(a.groupProperties[h.group]={visible:!1}),e[h.group]=g(e[h.group])?e[h.group]:{count:0,visibles:0},e[h.group].count++,h.visible&&e[h.group].visibles++),g(h.index)&&c.overlays[f].setZIndex&&c.overlays[f].setZIndex(b[f].index)}for(f in e)a.groupProperties[f].visible=e[f].visibles===e[f].count;a.overlaysArray=d})},!0)})}}}]),angular.module("leaflet-directive").directive("layers",["$log","$q","leafletData","leafletHelpers","leafletLayerHelpers","leafletControlHelpers",function(a,b,c,d,e,f){return{restrict:"A",scope:!1,replace:!1,require:"leaflet",controller:["$scope",function(a){a._leafletLayers=b.defer(),this.getLayers=function(){return a._leafletLayers.promise}}],link:function(a,b,g,h){var i=d.isDefined,j={},k=h.getLeafletScope(),l=k.layers,m=e.createLayer,n=e.safeAddLayer,o=e.safeRemoveLayer,p=f.updateLayersControl,q=!1;h.getMap().then(function(b){a._leafletLayers.resolve(j),c.setLayers(j,g.id),j.baselayers={},j.overlays={};var d=g.id,e=!1;for(var f in l.baselayers){var h=m(l.baselayers[f]);i(h)?(j.baselayers[f]=h,l.baselayers[f].top===!0&&(n(b,j.baselayers[f]),e=!0)):delete l.baselayers[f]}!e&&Object.keys(j.baselayers).length>0&&n(b,j.baselayers[Object.keys(l.baselayers)[0]]);for(f in l.overlays){var r=m(l.overlays[f]);i(r)?(j.overlays[f]=r,l.overlays[f].visible===!0&&n(b,j.overlays[f])):delete l.overlays[f]}k.$watch("layers.baselayers",function(a,c){if(angular.equals(a,c))return q=p(b,d,q,a,l.overlays,j),!0;for(var e in j.baselayers)(!i(a[e])||a[e].doRefresh)&&(b.hasLayer(j.baselayers[e])&&b.removeLayer(j.baselayers[e]),delete j.baselayers[e],a[e]&&a[e].doRefresh&&(a[e].doRefresh=!1));for(var f in a)if(i(j.baselayers[f]))a[f].top!==!0||b.hasLayer(j.baselayers[f])?a[f].top===!1&&b.hasLayer(j.baselayers[f])&&b.removeLayer(j.baselayers[f]):n(b,j.baselayers[f]);else{var g=m(a[f]);i(g)&&(j.baselayers[f]=g,a[f].top===!0&&n(b,j.baselayers[f]))}var h=!1;for(var k in j.baselayers)if(b.hasLayer(j.baselayers[k])){h=!0;break}!h&&Object.keys(j.baselayers).length>0&&n(b,j.baselayers[Object.keys(j.baselayers)[0]]),q=p(b,d,q,a,l.overlays,j)},!0),k.$watch("layers.overlays",function(a,c){if(angular.equals(a,c))return q=p(b,d,q,l.baselayers,a,j),!0;for(var e in j.overlays)if(!i(a[e])||a[e].doRefresh){if(b.hasLayer(j.overlays[e])){var f=i(a[e])?a[e].layerOptions:null;o(b,j.overlays[e],f)}delete j.overlays[e],a[e]&&a[e].doRefresh&&(a[e].doRefresh=!1)}for(var g in a){if(i(j.overlays[g]))a[g].visible&&!b.hasLayer(j.overlays[g])?n(b,j.overlays[g]):a[g].visible===!1&&b.hasLayer(j.overlays[g])&&o(b,j.overlays[g],a[g].layerOptions);else{
var h=m(a[g]);if(!i(h))continue;j.overlays[g]=h,a[g].visible===!0&&n(b,j.overlays[g])}a[g].visible&&b._loaded&&a[g].data&&"heatmap"===a[g].type&&(j.overlays[g].setData(a[g].data),j.overlays[g].update())}q=p(b,d,q,l.baselayers,a,j)},!0)})}}}]),angular.module("leaflet-directive").directive("legend",["$log","$http","leafletHelpers","leafletLegendHelpers",function(a,b,c,d){return{restrict:"A",scope:!1,replace:!1,require:"leaflet",link:function(e,f,g,h){var i,j,k,l,m=c.isArray,n=c.isDefined,o=c.isFunction,p=h.getLeafletScope(),q=p.legend;p.$watch("legend",function(a){n(a)&&(i=a.legendClass?a.legendClass:"legend",j=a.position||"bottomright",l=a.type||"arcgis")},!0),h.getMap().then(function(c){p.$watch("legend",function(b){return n(b)?n(b.url)||"arcgis"!==l||m(b.colors)&&m(b.labels)&&b.colors.length===b.labels.length?n(b.url)?void a.info("[AngularJS - Leaflet] loading legend service."):(n(k)&&(k.removeFrom(c),k=null),k=L.control({position:j}),"arcgis"===l&&(k.onAdd=d.getOnAddArrayLegend(b,i)),void k.addTo(c)):void a.warn("[AngularJS - Leaflet] legend.colors and legend.labels must be set."):void(n(k)&&(k.removeFrom(c),k=null))}),p.$watch("legend.url",function(e){n(e)&&b.get(e).success(function(a){n(k)?d.updateLegend(k.getContainer(),a,l,e):(k=L.control({position:j}),k.onAdd=d.getOnAddLegend(a,i,l,e),k.addTo(c)),n(q.loadedData)&&o(q.loadedData)&&q.loadedData()}).error(function(){a.warn("[AngularJS - Leaflet] legend.url not loaded.")})})})}}}]),angular.module("leaflet-directive").directive("markers",["$log","$rootScope","$q","leafletData","leafletHelpers","leafletMapDefaults","leafletMarkersHelpers","leafletMarkerEvents","leafletIterators","leafletWatchHelpers","leafletDirectiveControlsHelpers",function(a,b,c,d,e,f,g,h,i,j,k){var l=e.isDefined,m=e.errorHeader,n=e,o=e.isString,p=g.addMarkerWatcher,q=g.updateMarker,r=g.listenMarkerEvents,s=g.addMarkerToGroup,t=g.createMarker,u=g.deleteMarker,v=i,w=e.watchOptions,x=j.maybeWatch,y=k.extend,z=function(a,b,c){if(Object.keys(a).length){if(c&&o(c)){if(!a[c]||!Object.keys(a[c]).length)return;return a[c][b]}return a[b]}},A=function(a,b,c,d){return d&&o(d)?(l(b[d])||(b[d]={}),b[d][c]=a):b[c]=a,a},B=function(b,c,d,e,f,g){if(!o(b))return a.error(m+" A layername must be a string"),!1;if(!l(c))return a.error(m+" You must add layers to the directive if the markers are going to use this functionality."),!1;if(!l(c.overlays)||!l(c.overlays[b]))return a.error(m+' A marker can only be added to a layer of type "group"'),!1;var h=c.overlays[b];return h instanceof L.LayerGroup||h instanceof L.FeatureGroup?(h.addLayer(e),!f&&g.hasLayer(e)&&d.focus===!0&&e.openPopup(),!0):(a.error(m+' Adding a marker to an overlay needs a overlay of the type "group" or "featureGroup"'),!1)},C=function(b,c,d,e,f,g,i,j,k,o){for(var u in c)if(!o[u])if(-1===u.search("-")){var v=n.copy(c[u]),w=n.getObjectDotPath(k?[k,u]:[u]),x=z(g,u,k);if(l(x)){var y=l(y)?d[u]:void 0;q(v,y,x,w,i,f,e)}else{var C=t(v),D=(v?v.layer:void 0)||k;if(!l(C)){a.error(m+" Received invalid data on the marker "+u+".");continue}if(A(C,g,u,k),l(v.message)&&C.bindPopup(v.message,v.popupOptions),l(v.group)){var E=l(v.groupOption)?v.groupOption:null;s(C,v.group,E,e)}if(n.LabelPlugin.isLoaded()&&l(v.label)&&l(v.label.message)&&C.bindLabel(v.label.message,v.label.options),l(v)&&(l(v.layer)||l(k))){var F=B(D,f,v,C,j.individual.doWatch,e);if(!F)continue}else l(v.group)||(e.addLayer(C),j.individual.doWatch||v.focus!==!0||C.openPopup());j.individual.doWatch&&p(C,w,i,f,e,j.individual.isDeep),r(C,v,i,j.individual.doWatch,e),h.bindEvents(b,C,w,v,i,D)}}else a.error('The marker can\'t use a "-" on his key name: "'+u+'".')},D=function(b,c,d,e,f){var g,h,i=!1,j=!1,k=l(c);for(var o in d)i||(a.debug(m+"[markers] destroy: "),i=!0),k&&(h=b[o],g=c[o],j=angular.equals(h,g)&&e),l(b)&&Object.keys(b).length&&l(b[o])&&Object.keys(b[o]).length&&!j||f&&n.isFunction(f)&&f(h,g,o)},E=function(b,c,d,e,f){D(b,c,d,!1,function(b,c,g){a.debug(m+"[marker] is deleting marker: "+g),u(d[g],e,f),delete d[g]})},F=function(b,c,d){var e={};return D(b,c,d,!0,function(b,c,d){a.debug(m+"[marker] is already rendered, marker: "+d),e[d]=b}),e};return{restrict:"A",scope:!1,replace:!1,require:["leaflet","?layers"],link:function(a,b,e,f){var g=f[0],h=g.getLeafletScope();g.getMap().then(function(a){var b,g={};b=l(f[1])?f[1].getLayers:function(){var a=c.defer();return a.resolve(),a.promise};var i=h.markersWatchOptions||w;l(e.watchMarkers)&&(i.doWatch=i.individual.doWatch=!l(e.watchMarkers)||n.isTruthy(e.watchMarkers));var j=l(e.markersNested)&&n.isTruthy(e.markersNested);b().then(function(b){var c=function(c,d){return j?void v.each(c,function(c,e){var f=l(f)?d[e]:void 0;E(c,f,g[e],a,b)}):void E(c,d,g,a,b)},f=function(d,f){c(d,f);var k=null;return j?void v.each(d,function(c,j){var m=l(m)?f[j]:void 0;k=F(d[j],m,g[j]),C(e.id,c,f,a,b,g,h,i,j,k)}):(k=F(d,f,g),void C(e.id,d,f,a,b,g,h,i,void 0,k))};y(e.id,"markers",f,c),d.setMarkers(g,e.id),x(h,"markers",i,function(a,b){f(a,b)})})})}}}]),angular.module("leaflet-directive").directive("maxbounds",["$log","leafletMapDefaults","leafletBoundsHelpers","leafletHelpers",function(a,b,c,d){return{restrict:"A",scope:!1,replace:!1,require:"leaflet",link:function(a,b,e,f){var g=f.getLeafletScope(),h=c.isValidBounds,i=d.isNumber;f.getMap().then(function(a){g.$watch("maxbounds",function(b){if(!h(b))return void a.setMaxBounds();var d=c.createLeafletBounds(b);i(b.pad)&&(d=d.pad(b.pad)),a.setMaxBounds(d),e.center||e.lfCenter||a.fitBounds(d)})})}}}]),angular.module("leaflet-directive").directive("paths",["$log","$q","leafletData","leafletMapDefaults","leafletHelpers","leafletPathsHelpers","leafletPathEvents",function(a,b,c,d,e,f,g){return{restrict:"A",scope:!1,replace:!1,require:["leaflet","?layers"],link:function(h,i,j,k){var l=k[0],m=e.isDefined,n=e.isString,o=l.getLeafletScope(),p=o.paths,q=f.createPath,r=g.bindPathEvents,s=f.setPathOptions;l.getMap().then(function(f){var g,h=d.getDefaults(j.id);g=m(k[1])?k[1].getLayers:function(){var a=b.defer();return a.resolve(),a.promise},m(p)&&g().then(function(b){var d={};c.setPaths(d,j.id);var g=!m(j.watchPaths)||"true"===j.watchPaths,i=function(a,c){var d=o.$watch('paths["'+c+'"]',function(c,e){if(!m(c)){if(m(e.layer))for(var g in b.overlays){var h=b.overlays[g];h.removeLayer(a)}return f.removeLayer(a),void d()}s(a,c.type,c)},!0)};o.$watchCollection("paths",function(c){for(var k in d)m(c[k])||(f.removeLayer(d[k]),delete d[k]);for(var l in c)if(0!==l.search("\\$"))if(-1===l.search("-")){if(!m(d[l])){var p=c[l],t=q(l,c[l],h);if(m(t)&&m(p.message)&&t.bindPopup(p.message,p.popupOptions),e.LabelPlugin.isLoaded()&&m(p.label)&&m(p.label.message)&&t.bindLabel(p.label.message,p.label.options),m(p)&&m(p.layer)){if(!n(p.layer)){a.error("[AngularJS - Leaflet] A layername must be a string");continue}if(!m(b)){a.error("[AngularJS - Leaflet] You must add layers to the directive if the markers are going to use this functionality.");continue}if(!m(b.overlays)||!m(b.overlays[p.layer])){a.error('[AngularJS - Leaflet] A path can only be added to a layer of type "group"');continue}var u=b.overlays[p.layer];if(!(u instanceof L.LayerGroup||u instanceof L.FeatureGroup)){a.error('[AngularJS - Leaflet] Adding a path to an overlay needs a overlay of the type "group" or "featureGroup"');continue}d[l]=t,u.addLayer(t),g?i(t,l):s(t,p.type,p)}else m(t)&&(d[l]=t,f.addLayer(t),g?i(t,l):s(t,p.type,p));r(j.id,t,l,p,o)}}else a.error('[AngularJS - Leaflet] The path name "'+l+'" is not valid. It must not include "-" and a number.')})})})}}}]),angular.module("leaflet-directive").directive("tiles",["$log","leafletData","leafletMapDefaults","leafletHelpers",function(a,b,c,d){return{restrict:"A",scope:!1,replace:!1,require:"leaflet",link:function(e,f,g,h){var i=d.isDefined,j=h.getLeafletScope(),k=j.tiles;return i(k)&&i(k.url)?void h.getMap().then(function(a){var d,e=c.getDefaults(g.id);j.$watch("tiles",function(c,f){var h=e.tileLayerOptions,j=e.tileLayer;return!i(c.url)&&i(d)?void a.removeLayer(d):i(d)?!i(c.url)||!i(c.options)||c.type===f.type&&angular.equals(c.options,h)?void(i(c.url)&&d.setUrl(c.url)):(a.removeLayer(d),h=e.tileLayerOptions,angular.copy(c.options,h),j=c.url,d="wms"===c.type?L.tileLayer.wms(j,h):L.tileLayer(j,h),d.addTo(a),void b.setTiles(d,g.id)):(i(c.options)&&angular.copy(c.options,h),i(c.url)&&(j=c.url),d="wms"===c.type?L.tileLayer.wms(j,h):L.tileLayer(j,h),d.addTo(a),void b.setTiles(d,g.id))},!0)}):void a.warn("[AngularJS - Leaflet] The 'tiles' definition doesn't have the 'url' property.")}}}]),["markers","geojson"].forEach(function(a){angular.module("leaflet-directive").directive(a+"WatchOptions",["$log","$rootScope","$q","leafletData","leafletHelpers",function(b,c,d,e,f){var g=f.isDefined,h=f.errorHeader,i=f.isObject,j=f.watchOptions;return{restrict:"A",scope:!1,replace:!1,require:["leaflet"],link:function(c,d,e,f){var k=f[0],l=k.getLeafletScope();k.getMap().then(function(){g(c[a+"WatchOptions"])&&(i(c[a+"WatchOptions"])?angular.extend(j,c[a+"WatchOptions"]):b.error(h+"["+a+"WatchOptions] is not an object"),l[a+"WatchOptions"]=j)})}}}])}),angular.module("leaflet-directive").factory("LeafletEventsHelpersFactory",["$rootScope","$q","$log","leafletHelpers",function(a,b,c,d){var e=d.safeApply,f=d.isDefined,g=d.isObject,h=d.isArray,i=d.errorHeader,j=function(a,b){this.rootBroadcastName=a,c.debug("LeafletEventsHelpersFactory: lObjectType: "+b+"rootBroadcastName: "+a),this.lObjectType=b};return j.prototype.getAvailableEvents=function(){return[]},j.prototype.genDispatchEvent=function(a,b,d,e,f,g,h,i,j){var k=this;return a=a||"",a&&(a="."+a),function(l){var m=k.rootBroadcastName+a+"."+b;c.debug(m),k.fire(e,m,d,l,l.target||f,h,g,i,j)}},j.prototype.fire=function(b,c,d,g,h,i,j,k){e(b,function(){var e={leafletEvent:g,leafletObject:h,modelName:j,model:i};f(k)&&angular.extend(e,{layerName:k}),"emit"===d?b.$emit(c,e):a.$broadcast(c,e)})},j.prototype.bindEvents=function(a,b,d,e,j,k,l){var m=[],n="emit",o=this;if(f(j.eventBroadcast))if(g(j.eventBroadcast))if(f(j.eventBroadcast[o.lObjectType]))if(g(j.eventBroadcast[o.lObjectType])){f(j.eventBroadcast[this.lObjectType].logic)&&"emit"!==j.eventBroadcast[o.lObjectType].logic&&"broadcast"!==j.eventBroadcast[o.lObjectType].logic&&c.warn(i+"Available event propagation logic are: 'emit' or 'broadcast'.");var p=!1,q=!1;f(j.eventBroadcast[o.lObjectType].enable)&&h(j.eventBroadcast[o.lObjectType].enable)&&(p=!0),f(j.eventBroadcast[o.lObjectType].disable)&&h(j.eventBroadcast[o.lObjectType].disable)&&(q=!0),p&&q?c.warn(i+"can not enable and disable events at the same time"):p||q?p?j.eventBroadcast[this.lObjectType].enable.forEach(function(a){-1!==m.indexOf(a)?c.warn(i+"This event "+a+" is already enabled"):-1===o.getAvailableEvents().indexOf(a)?c.warn(i+"This event "+a+" does not exist"):m.push(a)}):(m=this.getAvailableEvents(),j.eventBroadcast[o.lObjectType].disable.forEach(function(a){var b=m.indexOf(a);-1===b?c.warn(i+"This event "+a+" does not exist or has been already disabled"):m.splice(b,1)})):c.warn(i+"must enable or disable events")}else c.warn(i+"event-broadcast."+[o.lObjectType]+" must be an object check your model.");else m=this.getAvailableEvents();else c.error(i+"event-broadcast must be an object check your model.");else m=this.getAvailableEvents();return m.forEach(function(c){b.on(c,o.genDispatchEvent(a,c,n,j,b,d,e,k,l))}),n},j}]).service("leafletEventsHelpers",["LeafletEventsHelpersFactory",function(a){return new a}]),angular.module("leaflet-directive").factory("leafletGeoJsonEvents",["$rootScope","$q","$log","leafletHelpers","LeafletEventsHelpersFactory","leafletData",function(a,b,c,d,e,f){var g=d.safeApply,h=e,i=function(){h.call(this,"leafletDirectiveGeoJson","geojson")};return i.prototype=new h,i.prototype.genDispatchEvent=function(b,c,d,e,i,j,k,l,m){var n=h.prototype.genDispatchEvent.call(this,b,c,d,e,i,j,k,l),o=this;return function(b){"mouseout"===c&&(m.resetStyleOnMouseout&&f.getGeoJSON(m.mapId).then(function(a){var c=l?a[l]:a;c.resetStyle(b.target)}),g(e,function(){a.$broadcast(o.rootBroadcastName+".mouseout",b)})),n(b)}},i.prototype.getAvailableEvents=function(){return["click","dblclick","mouseover","mouseout"]},new i}]),angular.module("leaflet-directive").factory("leafletLabelEvents",["$rootScope","$q","$log","leafletHelpers","LeafletEventsHelpersFactory",function(a,b,c,d,e){var f=d,g=e,h=function(){g.call(this,"leafletDirectiveLabel","markers")};return h.prototype=new g,h.prototype.genDispatchEvent=function(a,b,c,d,e,f,h,i){var j=f.replace("markers.","");return g.prototype.genDispatchEvent.call(this,a,b,c,d,e,j,h,i)},h.prototype.getAvailableEvents=function(){return["click","dblclick","mousedown","mouseover","mouseout","contextmenu"]},h.prototype.genEvents=function(a,b,c,d,e,g,h,i){var j=this,k=this.getAvailableEvents(),l=f.getObjectArrayPath("markers."+g);k.forEach(function(b){e.label.on(b,j.genDispatchEvent(a,b,c,d,e.label,l,h,i))})},h.prototype.bindEvents=function(){},new h}]),angular.module("leaflet-directive").factory("leafletMapEvents",["$rootScope","$q","$log","leafletHelpers","leafletEventsHelpers","leafletIterators",function(a,b,c,d,e,f){var g=d.isDefined,h=e.fire,i=function(){return["click","dblclick","mousedown","mouseup","mouseover","mouseout","mousemove","contextmenu","focus","blur","preclick","load","unload","viewreset","movestart","move","moveend","dragstart","drag","dragend","zoomstart","zoomanim","zoomend","zoomlevelschange","resize","autopanstart","layeradd","layerremove","baselayerchange","overlayadd","overlayremove","locationfound","locationerror","popupopen","popupclose","draw:created","draw:edited","draw:deleted","draw:drawstart","draw:drawstop","draw:editstart","draw:editstop","draw:deletestart","draw:deletestop"]},j=function(a,b,d,e){return e&&(e+="."),function(f){var g="leafletDirectiveMap."+e+b;c.debug(g),h(a,g,d,f,f.target,a)}},k=function(a){a.$broadcast("boundsChanged")},l=function(a,b,c,d){if(g(c.urlHashCenter)){var e=b.getCenter(),f=e.lat.toFixed(4)+":"+e.lng.toFixed(4)+":"+b.getZoom();g(d.c)&&d.c===f||a.$emit("centerUrlHash",f)}},m=function(a,b,c,d,e){f.each(b,function(b){var f={};f[c]=b,a.on(b,j(d,b,e,a._container.id||""),f)})};return{getAvailableMapEvents:i,genDispatchMapEvent:j,notifyCenterChangedToBounds:k,notifyCenterUrlHashChanged:l,addEvents:m}}]),angular.module("leaflet-directive").factory("leafletMarkerEvents",["$rootScope","$q","$log","leafletHelpers","LeafletEventsHelpersFactory","leafletLabelEvents",function(a,b,c,d,e,f){var g=d.safeApply,h=d.isDefined,i=d,j=f,k=e,l=function(){k.call(this,"leafletDirectiveMarker","markers")};return l.prototype=new k,l.prototype.genDispatchEvent=function(b,c,d,e,f,h,i,j){var l=k.prototype.genDispatchEvent.call(this,b,c,d,e,f,h,i,j);return function(b){"click"===c?g(e,function(){a.$broadcast("leafletDirectiveMarkersClick",h)}):"dragend"===c&&(g(e,function(){i.lat=f.getLatLng().lat,i.lng=f.getLatLng().lng}),i.message&&i.focus===!0&&f.openPopup()),l(b)}},l.prototype.getAvailableEvents=function(){return["click","dblclick","mousedown","mouseover","mouseout","contextmenu","dragstart","drag","dragend","move","remove","popupopen","popupclose","touchend","touchstart","touchmove","touchcancel","touchleave"]},l.prototype.bindEvents=function(a,b,c,d,e,f){var g=k.prototype.bindEvents.call(this,a,b,c,d,e,f);i.LabelPlugin.isLoaded()&&h(b.label)&&j.genEvents(a,c,g,e,b,d,f)},new l}]),angular.module("leaflet-directive").factory("leafletPathEvents",["$rootScope","$q","$log","leafletHelpers","leafletLabelEvents","leafletEventsHelpers",function(a,b,c,d,e,f){var g=d.isDefined,h=d.isObject,i=d,j=d.errorHeader,k=e,l=f.fire,m=function(a,b,d,e,f,g,h,i){return a=a||"",a&&(a="."+a),function(j){var k="leafletDirectivePath"+a+"."+b;c.debug(k),l(e,k,d,j,j.target||f,h,g,i)}},n=function(a,b,d,e,f){var l,n,p=[],q="broadcast";if(g(f.eventBroadcast))if(h(f.eventBroadcast))if(g(f.eventBroadcast.path))if(h(f.eventBroadcast.paths))c.warn(j+"event-broadcast.path must be an object check your model.");else{void 0!==f.eventBroadcast.path.logic&&null!==f.eventBroadcast.path.logic&&("emit"!==f.eventBroadcast.path.logic&&"broadcast"!==f.eventBroadcast.path.logic?c.warn(j+"Available event propagation logic are: 'emit' or 'broadcast'."):"emit"===f.eventBroadcast.path.logic&&(q="emit"));var r=!1,s=!1;if(void 0!==f.eventBroadcast.path.enable&&null!==f.eventBroadcast.path.enable&&"object"==typeof f.eventBroadcast.path.enable&&(r=!0),void 0!==f.eventBroadcast.path.disable&&null!==f.eventBroadcast.path.disable&&"object"==typeof f.eventBroadcast.path.disable&&(s=!0),r&&s)c.warn(j+"can not enable and disable events at the same time");else if(r||s)if(r)for(l=0;l<f.eventBroadcast.path.enable.length;l++)n=f.eventBroadcast.path.enable[l],-1!==p.indexOf(n)?c.warn(j+"This event "+n+" is already enabled"):-1===o().indexOf(n)?c.warn(j+"This event "+n+" does not exist"):p.push(n);else for(p=o(),l=0;l<f.eventBroadcast.path.disable.length;l++){n=f.eventBroadcast.path.disable[l];var t=p.indexOf(n);-1===t?c.warn(j+"This event "+n+" does not exist or has been already disabled"):p.splice(t,1)}else c.warn(j+"must enable or disable events")}else p=o();else c.error(j+"event-broadcast must be an object check your model.");else p=o();for(l=0;l<p.length;l++)n=p[l],b.on(n,m(a,n,q,f,p,d));i.LabelPlugin.isLoaded()&&g(b.label)&&k.genEvents(a,d,q,f,b,e)},o=function(){return["click","dblclick","mousedown","mouseover","mouseout","contextmenu","add","remove","popupopen","popupclose"]};return{getAvailablePathEvents:o,bindPathEvents:n}}])}(angular);
}(angular));

/*! nouislider - 10.0.0 - 2017-05-28 14:52:49 */

!function(a){"function"==typeof define&&define.amd?define([],a):"object"==typeof exports?module.exports=a():window.noUiSlider=a()}(function(){"use strict";function a(a){return"object"==typeof a&&"function"==typeof a.to&&"function"==typeof a.from}function b(a){a.parentElement.removeChild(a)}function c(a){a.preventDefault()}function d(a){return a.filter(function(a){return this[a]?!1:this[a]=!0},{})}function e(a,b){return Math.round(a/b)*b}function f(a,b){var c=a.getBoundingClientRect(),d=a.ownerDocument,e=d.documentElement,f=o(d);return/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(f.x=0),b?c.top+f.y-e.clientTop:c.left+f.x-e.clientLeft}function g(a){return"number"==typeof a&&!isNaN(a)&&isFinite(a)}function h(a,b,c){c>0&&(l(a,b),setTimeout(function(){m(a,b)},c))}function i(a){return Math.max(Math.min(a,100),0)}function j(a){return Array.isArray(a)?a:[a]}function k(a){a=String(a);var b=a.split(".");return b.length>1?b[1].length:0}function l(a,b){a.classList?a.classList.add(b):a.className+=" "+b}function m(a,b){a.classList?a.classList.remove(b):a.className=a.className.replace(new RegExp("(^|\\b)"+b.split(" ").join("|")+"(\\b|$)","gi")," ")}function n(a,b){return a.classList?a.classList.contains(b):new RegExp("\\b"+b+"\\b").test(a.className)}function o(a){var b=void 0!==window.pageXOffset,c="CSS1Compat"===(a.compatMode||""),d=b?window.pageXOffset:c?a.documentElement.scrollLeft:a.body.scrollLeft,e=b?window.pageYOffset:c?a.documentElement.scrollTop:a.body.scrollTop;return{x:d,y:e}}function p(){return window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"}}function q(){var a=!1;try{var b=Object.defineProperty({},"passive",{get:function(){a=!0}});window.addEventListener("test",null,b)}catch(c){}return a}function r(){return window.CSS&&CSS.supports&&CSS.supports("touch-action","none")}function s(a,b){return 100/(b-a)}function t(a,b){return 100*b/(a[1]-a[0])}function u(a,b){return t(a,a[0]<0?b+Math.abs(a[0]):b-a[0])}function v(a,b){return b*(a[1]-a[0])/100+a[0]}function w(a,b){for(var c=1;a>=b[c];)c+=1;return c}function x(a,b,c){if(c>=a.slice(-1)[0])return 100;var d,e,f,g,h=w(c,a);return d=a[h-1],e=a[h],f=b[h-1],g=b[h],f+u([d,e],c)/s(f,g)}function y(a,b,c){if(c>=100)return a.slice(-1)[0];var d,e,f,g,h=w(c,b);return d=a[h-1],e=a[h],f=b[h-1],g=b[h],v([d,e],(c-f)*s(f,g))}function z(a,b,c,d){if(100===d)return d;var f,g,h=w(d,a);return c?(f=a[h-1],g=a[h],d-f>(g-f)/2?g:f):b[h-1]?a[h-1]+e(d-a[h-1],b[h-1]):d}function A(a,b,c){var d;if("number"==typeof b&&(b=[b]),"[object Array]"!==Object.prototype.toString.call(b))throw new Error("noUiSlider ("+$+"): 'range' contains invalid value.");if(d="min"===a?0:"max"===a?100:parseFloat(a),!g(d)||!g(b[0]))throw new Error("noUiSlider ("+$+"): 'range' value isn't numeric.");c.xPct.push(d),c.xVal.push(b[0]),d?c.xSteps.push(isNaN(b[1])?!1:b[1]):isNaN(b[1])||(c.xSteps[0]=b[1]),c.xHighestCompleteStep.push(0)}function B(a,b,c){if(!b)return!0;c.xSteps[a]=t([c.xVal[a],c.xVal[a+1]],b)/s(c.xPct[a],c.xPct[a+1]);var d=(c.xVal[a+1]-c.xVal[a])/c.xNumSteps[a],e=Math.ceil(Number(d.toFixed(3))-1),f=c.xVal[a]+c.xNumSteps[a]*e;c.xHighestCompleteStep[a]=f}function C(a,b,c){this.xPct=[],this.xVal=[],this.xSteps=[c||!1],this.xNumSteps=[!1],this.xHighestCompleteStep=[],this.snap=b;var d,e=[];for(d in a)a.hasOwnProperty(d)&&e.push([a[d],d]);for(e.sort(e.length&&"object"==typeof e[0][0]?function(a,b){return a[0][0]-b[0][0]}:function(a,b){return a[0]-b[0]}),d=0;d<e.length;d++)A(e[d][1],e[d][0],this);for(this.xNumSteps=this.xSteps.slice(0),d=0;d<this.xNumSteps.length;d++)B(d,this.xNumSteps[d],this)}function D(b){if(a(b))return!0;throw new Error("noUiSlider ("+$+"): 'format' requires 'to' and 'from' methods.")}function E(a,b){if(!g(b))throw new Error("noUiSlider ("+$+"): 'step' is not numeric.");a.singleStep=b}function F(a,b){if("object"!=typeof b||Array.isArray(b))throw new Error("noUiSlider ("+$+"): 'range' is not an object.");if(void 0===b.min||void 0===b.max)throw new Error("noUiSlider ("+$+"): Missing 'min' or 'max' in 'range'.");if(b.min===b.max)throw new Error("noUiSlider ("+$+"): 'range' 'min' and 'max' cannot be equal.");a.spectrum=new C(b,a.snap,a.singleStep)}function G(a,b){if(b=j(b),!Array.isArray(b)||!b.length)throw new Error("noUiSlider ("+$+"): 'start' option is incorrect.");a.handles=b.length,a.start=b}function H(a,b){if(a.snap=b,"boolean"!=typeof b)throw new Error("noUiSlider ("+$+"): 'snap' option must be a boolean.")}function I(a,b){if(a.animate=b,"boolean"!=typeof b)throw new Error("noUiSlider ("+$+"): 'animate' option must be a boolean.")}function J(a,b){if(a.animationDuration=b,"number"!=typeof b)throw new Error("noUiSlider ("+$+"): 'animationDuration' option must be a number.")}function K(a,b){var c,d=[!1];if("lower"===b?b=[!0,!1]:"upper"===b&&(b=[!1,!0]),b===!0||b===!1){for(c=1;c<a.handles;c++)d.push(b);d.push(!1)}else{if(!Array.isArray(b)||!b.length||b.length!==a.handles+1)throw new Error("noUiSlider ("+$+"): 'connect' option doesn't match handle count.");d=b}a.connect=d}function L(a,b){switch(b){case"horizontal":a.ort=0;break;case"vertical":a.ort=1;break;default:throw new Error("noUiSlider ("+$+"): 'orientation' option is invalid.")}}function M(a,b){if(!g(b))throw new Error("noUiSlider ("+$+"): 'margin' option must be numeric.");if(0!==b&&(a.margin=a.spectrum.getMargin(b),!a.margin))throw new Error("noUiSlider ("+$+"): 'margin' option is only supported on linear sliders.")}function N(a,b){if(!g(b))throw new Error("noUiSlider ("+$+"): 'limit' option must be numeric.");if(a.limit=a.spectrum.getMargin(b),!a.limit||a.handles<2)throw new Error("noUiSlider ("+$+"): 'limit' option is only supported on linear sliders with 2 or more handles.")}function O(a,b){if(!g(b))throw new Error("noUiSlider ("+$+"): 'padding' option must be numeric.");if(0!==b){if(a.padding=a.spectrum.getMargin(b),!a.padding)throw new Error("noUiSlider ("+$+"): 'padding' option is only supported on linear sliders.");if(a.padding<0)throw new Error("noUiSlider ("+$+"): 'padding' option must be a positive number.");if(a.padding>=50)throw new Error("noUiSlider ("+$+"): 'padding' option must be less than half the range.")}}function P(a,b){switch(b){case"ltr":a.dir=0;break;case"rtl":a.dir=1;break;default:throw new Error("noUiSlider ("+$+"): 'direction' option was not recognized.")}}function Q(a,b){if("string"!=typeof b)throw new Error("noUiSlider ("+$+"): 'behaviour' must be a string containing options.");var c=b.indexOf("tap")>=0,d=b.indexOf("drag")>=0,e=b.indexOf("fixed")>=0,f=b.indexOf("snap")>=0,g=b.indexOf("hover")>=0;if(e){if(2!==a.handles)throw new Error("noUiSlider ("+$+"): 'fixed' behaviour must be used with 2 handles");M(a,a.start[1]-a.start[0])}a.events={tap:c||f,drag:d,fixed:e,snap:f,hover:g}}function R(a,b){if(b!==!1)if(b===!0){a.tooltips=[];for(var c=0;c<a.handles;c++)a.tooltips.push(!0)}else{if(a.tooltips=j(b),a.tooltips.length!==a.handles)throw new Error("noUiSlider ("+$+"): must pass a formatter for all handles.");a.tooltips.forEach(function(a){if("boolean"!=typeof a&&("object"!=typeof a||"function"!=typeof a.to))throw new Error("noUiSlider ("+$+"): 'tooltips' must be passed a formatter or 'false'.")})}}function S(a,b){a.ariaFormat=b,D(b)}function T(a,b){a.format=b,D(b)}function U(a,b){if(void 0!==b&&"string"!=typeof b&&b!==!1)throw new Error("noUiSlider ("+$+"): 'cssPrefix' must be a string or `false`.");a.cssPrefix=b}function V(a,b){if(void 0!==b&&"object"!=typeof b)throw new Error("noUiSlider ("+$+"): 'cssClasses' must be an object.");if("string"==typeof a.cssPrefix){a.cssClasses={};for(var c in b)b.hasOwnProperty(c)&&(a.cssClasses[c]=a.cssPrefix+b[c])}else a.cssClasses=b}function W(a,b){if(b!==!0&&b!==!1)throw new Error("noUiSlider ("+$+"): 'useRequestAnimationFrame' option should be true (default) or false.");a.useRequestAnimationFrame=b}function X(a){var b={margin:0,limit:0,padding:0,animate:!0,animationDuration:300,ariaFormat:_,format:_},c={step:{r:!1,t:E},start:{r:!0,t:G},connect:{r:!0,t:K},direction:{r:!0,t:P},snap:{r:!1,t:H},animate:{r:!1,t:I},animationDuration:{r:!1,t:J},range:{r:!0,t:F},orientation:{r:!1,t:L},margin:{r:!1,t:M},limit:{r:!1,t:N},padding:{r:!1,t:O},behaviour:{r:!0,t:Q},ariaFormat:{r:!1,t:S},format:{r:!1,t:T},tooltips:{r:!1,t:R},cssPrefix:{r:!1,t:U},cssClasses:{r:!1,t:V},useRequestAnimationFrame:{r:!1,t:W}},d={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal",cssPrefix:"noUi-",cssClasses:{target:"target",base:"base",origin:"origin",handle:"handle",handleLower:"handle-lower",handleUpper:"handle-upper",horizontal:"horizontal",vertical:"vertical",background:"background",connect:"connect",ltr:"ltr",rtl:"rtl",draggable:"draggable",drag:"state-drag",tap:"state-tap",active:"active",tooltip:"tooltip",pips:"pips",pipsHorizontal:"pips-horizontal",pipsVertical:"pips-vertical",marker:"marker",markerHorizontal:"marker-horizontal",markerVertical:"marker-vertical",markerNormal:"marker-normal",markerLarge:"marker-large",markerSub:"marker-sub",value:"value",valueHorizontal:"value-horizontal",valueVertical:"value-vertical",valueNormal:"value-normal",valueLarge:"value-large",valueSub:"value-sub"},useRequestAnimationFrame:!0};a.format&&!a.ariaFormat&&(a.ariaFormat=a.format),Object.keys(c).forEach(function(e){if(void 0===a[e]&&void 0===d[e]){if(c[e].r)throw new Error("noUiSlider ("+$+"): '"+e+"' is required.");return!0}c[e].t(b,void 0===a[e]?d[e]:a[e])}),b.pips=a.pips;var e=[["left","top"],["right","bottom"]];return b.style=e[b.dir][b.ort],b.styleOposite=e[b.dir?0:1][b.ort],b}function Y(a,e,g){function k(a,b){var c=xa.createElement("div");return b&&l(c,b),a.appendChild(c),c}function s(a,b){var c=k(a,e.cssClasses.origin),d=k(c,e.cssClasses.handle);return d.setAttribute("data-handle",b),d.setAttribute("tabindex","0"),d.setAttribute("role","slider"),d.setAttribute("aria-orientation",e.ort?"vertical":"horizontal"),0===b?l(d,e.cssClasses.handleLower):b===e.handles-1&&l(d,e.cssClasses.handleUpper),c}function t(a,b){return b?k(a,e.cssClasses.connect):!1}function u(a,b){ia=[],ja=[],ja.push(t(b,a[0]));for(var c=0;c<e.handles;c++)ia.push(s(b,c)),ra[c]=c,ja.push(t(b,a[c+1]))}function v(a){l(a,e.cssClasses.target),0===e.dir?l(a,e.cssClasses.ltr):l(a,e.cssClasses.rtl),0===e.ort?l(a,e.cssClasses.horizontal):l(a,e.cssClasses.vertical),ha=k(a,e.cssClasses.base)}function w(a,b){return e.tooltips[b]?k(a.firstChild,e.cssClasses.tooltip):!1}function x(){var a=ia.map(w);ea("update",function(b,c,d){if(a[c]){var f=b[c];e.tooltips[c]!==!0&&(f=e.tooltips[c].to(d[c])),a[c].innerHTML=f}})}function y(){ea("update",function(a,b,c,d,f){ra.forEach(function(a){var b=ia[a],d=S(qa,a,0,!0,!0,!0),g=S(qa,a,100,!0,!0,!0),h=f[a],i=e.ariaFormat.to(c[a]);b.children[0].setAttribute("aria-valuemin",d.toFixed(1)),b.children[0].setAttribute("aria-valuemax",g.toFixed(1)),b.children[0].setAttribute("aria-valuenow",h.toFixed(1)),b.children[0].setAttribute("aria-valuetext",i)})})}function z(a,b,c){if("range"===a||"steps"===a)return ta.xVal;if("count"===a){if(!b)throw new Error("noUiSlider ("+$+"): 'values' required for mode 'count'.");var d,e=100/(b-1),f=0;for(b=[];(d=f++*e)<=100;)b.push(d);a="positions"}return"positions"===a?b.map(function(a){return ta.fromStepping(c?ta.getStep(a):a)}):"values"===a?c?b.map(function(a){return ta.fromStepping(ta.getStep(ta.toStepping(a)))}):b:void 0}function A(a,b,c){function e(a,b){return(a+b).toFixed(7)/1}var f={},g=ta.xVal[0],h=ta.xVal[ta.xVal.length-1],i=!1,j=!1,k=0;return c=d(c.slice().sort(function(a,b){return a-b})),c[0]!==g&&(c.unshift(g),i=!0),c[c.length-1]!==h&&(c.push(h),j=!0),c.forEach(function(d,g){var h,l,m,n,o,p,q,r,s,t,u=d,v=c[g+1];if("steps"===b&&(h=ta.xNumSteps[g]),h||(h=v-u),u!==!1&&void 0!==v)for(h=Math.max(h,1e-7),l=u;v>=l;l=e(l,h)){for(n=ta.toStepping(l),o=n-k,r=o/a,s=Math.round(r),t=o/s,m=1;s>=m;m+=1)p=k+m*t,f[p.toFixed(5)]=["x",0];q=c.indexOf(l)>-1?1:"steps"===b?2:0,!g&&i&&(q=0),l===v&&j||(f[n.toFixed(5)]=[l,q]),k=n}}),f}function B(a,b,c){function d(a,b){var c=b===e.cssClasses.value,d=c?j:m,f=c?h:i;return b+" "+d[e.ort]+" "+f[a]}function f(a,f){f[1]=f[1]&&b?b(f[0],f[1]):f[1];var h=k(g,!1);h.className=d(f[1],e.cssClasses.marker),h.style[e.style]=a+"%",f[1]&&(h=k(g,!1),h.className=d(f[1],e.cssClasses.value),h.style[e.style]=a+"%",h.innerText=c.to(f[0]))}var g=xa.createElement("div"),h=[e.cssClasses.valueNormal,e.cssClasses.valueLarge,e.cssClasses.valueSub],i=[e.cssClasses.markerNormal,e.cssClasses.markerLarge,e.cssClasses.markerSub],j=[e.cssClasses.valueHorizontal,e.cssClasses.valueVertical],m=[e.cssClasses.markerHorizontal,e.cssClasses.markerVertical];return l(g,e.cssClasses.pips),l(g,0===e.ort?e.cssClasses.pipsHorizontal:e.cssClasses.pipsVertical),Object.keys(a).forEach(function(b){f(b,a[b])}),g}function C(){la&&(b(la),la=null)}function D(a){C();var b=a.mode,c=a.density||1,d=a.filter||!1,e=a.values||!1,f=a.stepped||!1,g=z(b,e,f),h=A(c,b,g),i=a.format||{to:Math.round};return la=pa.appendChild(B(h,d,i))}function E(){var a=ha.getBoundingClientRect(),b="offset"+["Width","Height"][e.ort];return 0===e.ort?a.width||ha[b]:a.height||ha[b]}function F(a,b,c,d){var f=function(b){return pa.hasAttribute("disabled")?!1:n(pa,e.cssClasses.tap)?!1:(b=G(b,d.pageOffset))?a===ma.start&&void 0!==b.buttons&&b.buttons>1?!1:d.hover&&b.buttons?!1:(oa||b.preventDefault(),b.calcPoint=b.points[e.ort],void c(b,d)):!1},g=[];return a.split(" ").forEach(function(a){b.addEventListener(a,f,oa?{passive:!0}:!1),g.push([a,f])}),g}function G(a,b){var c,d,e=0===a.type.indexOf("touch"),f=0===a.type.indexOf("mouse"),g=0===a.type.indexOf("pointer");if(0===a.type.indexOf("MSPointer")&&(g=!0),e){if(a.touches.length>1)return!1;c=a.changedTouches[0].pageX,d=a.changedTouches[0].pageY}return b=b||o(xa),(f||g)&&(c=a.clientX+b.x,d=a.clientY+b.y),a.pageOffset=b,a.points=[c,d],a.cursor=f||g,a}function H(a){var b=a-f(ha,e.ort),c=100*b/E();return e.dir?100-c:c}function I(a){var b=100,c=!1;return ia.forEach(function(d,e){if(!d.hasAttribute("disabled")){var f=Math.abs(qa[e]-a);b>f&&(c=e,b=f)}}),c}function J(a,b,c,d){var e=c.slice(),f=[!a,a],g=[a,!a];d=d.slice(),a&&d.reverse(),d.length>1?d.forEach(function(a,c){var d=S(e,a,e[a]+b,f[c],g[c],!1);d===!1?b=0:(b=d-e[a],e[a]=d)}):f=g=[!0];var h=!1;d.forEach(function(a,d){h=W(a,c[a]+b,f[d],g[d])||h}),h&&d.forEach(function(a){K("update",a),K("slide",a)})}function K(a,b,c){Object.keys(va).forEach(function(d){var f=d.split(".")[0];a===f&&va[d].forEach(function(a){a.call(ka,ua.map(e.format.to),b,ua.slice(),c||!1,qa.slice())})})}function L(a,b){"mouseout"===a.type&&"HTML"===a.target.nodeName&&null===a.relatedTarget&&N(a,b)}function M(a,b){if(-1===navigator.appVersion.indexOf("MSIE 9")&&0===a.buttons&&0!==b.buttonsProperty)return N(a,b);var c=(e.dir?-1:1)*(a.calcPoint-b.startCalcPoint),d=100*c/b.baseSize;J(c>0,d,b.locations,b.handleNumbers)}function N(a,b){sa&&(m(sa,e.cssClasses.active),sa=!1),a.cursor&&(za.style.cursor="",za.removeEventListener("selectstart",c)),wa.forEach(function(a){ya.removeEventListener(a[0],a[1])}),m(pa,e.cssClasses.drag),V(),b.handleNumbers.forEach(function(a){K("change",a),K("set",a),K("end",a)})}function O(a,b){if(1===b.handleNumbers.length){var d=ia[b.handleNumbers[0]];if(d.hasAttribute("disabled"))return!1;sa=d.children[0],l(sa,e.cssClasses.active)}a.stopPropagation();var f=F(ma.move,ya,M,{startCalcPoint:a.calcPoint,baseSize:E(),pageOffset:a.pageOffset,handleNumbers:b.handleNumbers,buttonsProperty:a.buttons,locations:qa.slice()}),g=F(ma.end,ya,N,{handleNumbers:b.handleNumbers}),h=F("mouseout",ya,L,{handleNumbers:b.handleNumbers});wa=f.concat(g,h),a.cursor&&(za.style.cursor=getComputedStyle(a.target).cursor,ia.length>1&&l(pa,e.cssClasses.drag),za.addEventListener("selectstart",c,!1)),b.handleNumbers.forEach(function(a){K("start",a)})}function P(a){a.stopPropagation();var b=H(a.calcPoint),c=I(b);return c===!1?!1:(e.events.snap||h(pa,e.cssClasses.tap,e.animationDuration),W(c,b,!0,!0),V(),K("slide",c,!0),K("update",c,!0),K("change",c,!0),K("set",c,!0),void(e.events.snap&&O(a,{handleNumbers:[c]})))}function Q(a){var b=H(a.calcPoint),c=ta.getStep(b),d=ta.fromStepping(c);Object.keys(va).forEach(function(a){"hover"===a.split(".")[0]&&va[a].forEach(function(a){a.call(ka,d)})})}function R(a){a.fixed||ia.forEach(function(a,b){F(ma.start,a.children[0],O,{handleNumbers:[b]})}),a.tap&&F(ma.start,ha,P,{}),a.hover&&F(ma.move,ha,Q,{hover:!0}),a.drag&&ja.forEach(function(b,c){if(b!==!1&&0!==c&&c!==ja.length-1){var d=ia[c-1],f=ia[c],g=[b];l(b,e.cssClasses.draggable),a.fixed&&(g.push(d.children[0]),g.push(f.children[0])),g.forEach(function(a){F(ma.start,a,O,{handles:[d,f],handleNumbers:[c-1,c]})})}})}function S(a,b,c,d,f,g){return ia.length>1&&(d&&b>0&&(c=Math.max(c,a[b-1]+e.margin)),f&&b<ia.length-1&&(c=Math.min(c,a[b+1]-e.margin))),ia.length>1&&e.limit&&(d&&b>0&&(c=Math.min(c,a[b-1]+e.limit)),f&&b<ia.length-1&&(c=Math.max(c,a[b+1]-e.limit))),e.padding&&(0===b&&(c=Math.max(c,e.padding)),b===ia.length-1&&(c=Math.min(c,100-e.padding))),c=ta.getStep(c),c=i(c),c!==a[b]||g?c:!1}function T(a){return a+"%"}function U(a,b){qa[a]=b,ua[a]=ta.fromStepping(b);var c=function(){ia[a].style[e.style]=T(b),Y(a),Y(a+1)};window.requestAnimationFrame&&e.useRequestAnimationFrame?window.requestAnimationFrame(c):c()}function V(){ra.forEach(function(a){var b=qa[a]>50?-1:1,c=3+(ia.length+b*a);ia[a].childNodes[0].style.zIndex=c})}function W(a,b,c,d){return b=S(qa,a,b,c,d,!1),b===!1?!1:(U(a,b),!0)}function Y(a){if(ja[a]){var b=0,c=100;0!==a&&(b=qa[a-1]),a!==ja.length-1&&(c=qa[a]),ja[a].style[e.style]=T(b),ja[a].style[e.styleOposite]=T(100-c)}}function Z(a,b){null!==a&&a!==!1&&("number"==typeof a&&(a=String(a)),a=e.format.from(a),a===!1||isNaN(a)||W(b,ta.toStepping(a),!1,!1))}function _(a,b){var c=j(a),d=void 0===qa[0];b=void 0===b?!0:!!b,c.forEach(Z),e.animate&&!d&&h(pa,e.cssClasses.tap,e.animationDuration),ra.forEach(function(a){W(a,qa[a],!0,!1)}),V(),ra.forEach(function(a){K("update",a),null!==c[a]&&b&&K("set",a)})}function aa(a){_(e.start,a)}function ba(){var a=ua.map(e.format.to);return 1===a.length?a[0]:a}function ca(){for(var a in e.cssClasses)e.cssClasses.hasOwnProperty(a)&&m(pa,e.cssClasses[a]);for(;pa.firstChild;)pa.removeChild(pa.firstChild);delete pa.noUiSlider}function da(){return qa.map(function(a,b){var c=ta.getNearbySteps(a),d=ua[b],e=c.thisStep.step,f=null;e!==!1&&d+e>c.stepAfter.startValue&&(e=c.stepAfter.startValue-d),f=d>c.thisStep.startValue?c.thisStep.step:c.stepBefore.step===!1?!1:d-c.stepBefore.highestStep,100===a?e=null:0===a&&(f=null);var g=ta.countStepDecimals();return null!==e&&e!==!1&&(e=Number(e.toFixed(g))),null!==f&&f!==!1&&(f=Number(f.toFixed(g))),[f,e]})}function ea(a,b){va[a]=va[a]||[],va[a].push(b),"update"===a.split(".")[0]&&ia.forEach(function(a,b){K("update",b)})}function fa(a){var b=a&&a.split(".")[0],c=b&&a.substring(b.length);Object.keys(va).forEach(function(a){var d=a.split(".")[0],e=a.substring(d.length);b&&b!==d||c&&c!==e||delete va[a]})}function ga(a,b){var c=ba(),d=["margin","limit","padding","range","animate","snap","step","format"];d.forEach(function(b){void 0!==a[b]&&(g[b]=a[b])});var f=X(g);d.forEach(function(b){void 0!==a[b]&&(e[b]=f[b])}),ta=f.spectrum,e.margin=f.margin,e.limit=f.limit,e.padding=f.padding,e.pips&&D(e.pips),qa=[],_(a.start||c,b)}var ha,ia,ja,ka,la,ma=p(),na=r(),oa=na&&q(),pa=a,qa=[],ra=[],sa=!1,ta=e.spectrum,ua=[],va={},wa=null,xa=a.ownerDocument,ya=xa.documentElement,za=xa.body;if(pa.noUiSlider)throw new Error("noUiSlider ("+$+"): Slider was already initialized.");return v(pa),u(e.connect,ha),ka={destroy:ca,steps:da,on:ea,off:fa,get:ba,set:_,reset:aa,__moveHandles:function(a,b,c){J(a,b,qa,c)},options:g,updateOptions:ga,target:pa,removePips:C,pips:D},R(e.events),_(e.start),e.pips&&D(e.pips),e.tooltips&&x(),y(),ka}function Z(a,b){if(!a||!a.nodeName)throw new Error("noUiSlider ("+$+"): create requires a single element, got: "+a);var c=X(b,a),d=Y(a,c,b);return a.noUiSlider=d,d}var $="10.0.0";C.prototype.getMargin=function(a){var b=this.xNumSteps[0];if(b&&a/b%1!==0)throw new Error("noUiSlider ("+$+"): 'limit', 'margin' and 'padding' must be divisible by step.");return 2===this.xPct.length?t(this.xVal,a):!1},C.prototype.toStepping=function(a){return a=x(this.xVal,this.xPct,a)},C.prototype.fromStepping=function(a){return y(this.xVal,this.xPct,a)},C.prototype.getStep=function(a){return a=z(this.xPct,this.xSteps,this.snap,a)},C.prototype.getNearbySteps=function(a){var b=w(a,this.xPct);return{stepBefore:{startValue:this.xVal[b-2],step:this.xNumSteps[b-2],highestStep:this.xHighestCompleteStep[b-2]},thisStep:{startValue:this.xVal[b-1],step:this.xNumSteps[b-1],highestStep:this.xHighestCompleteStep[b-1]},stepAfter:{startValue:this.xVal[b-0],step:this.xNumSteps[b-0],highestStep:this.xHighestCompleteStep[b-0]}}},C.prototype.countStepDecimals=function(){var a=this.xNumSteps.map(k);return Math.max.apply(null,a)},C.prototype.convert=function(a){return this.getStep(this.toStepping(a))};var _={to:function(a){return void 0!==a&&a.toFixed(2)},from:Number};return{version:$,create:Z}});

!function(t,e,i){!function(){var s,a,n,h="datepicker",r=".datepicker-here",o=!1,c='<div class="datepicker"><i class="datepicker--pointer"></i><nav class="datepicker--nav"></nav><div class="datepicker--content"></div></div>',d={classes:"",inline:!1,language:"ru",startDate:new Date,firstDay:"",weekends:[6,0],dateFormat:"",altField:"",altFieldDateFormat:"@",toggleSelected:!0,keyboardNav:!0,position:"bottom left",offset:12,view:"days",minView:"days",showOtherMonths:!0,selectOtherMonths:!0,moveToOtherMonthsOnSelect:!0,showOtherYears:!0,selectOtherYears:!0,moveToOtherYearsOnSelect:!0,minDate:"",maxDate:"",disableNavWhenOutOfRange:!0,multipleDates:!1,multipleDatesSeparator:",",range:!1,todayButton:!1,clearButton:!1,showEvent:"focus",autoClose:!1,monthsField:"monthsShort",prevHtml:'<svg><path d="M 17,12 l -5,5 l 5,5"></path></svg>',nextHtml:'<svg><path d="M 14,12 l 5,5 l -5,5"></path></svg>',navTitles:{days:"MM, <i>yyyy</i>",months:"yyyy",years:"yyyy1 - yyyy2"},timepicker:!1,dateTimeSeparator:" ",timeFormat:"",minHours:0,maxHours:24,minMinutes:0,maxMinutes:59,hoursStep:1,minutesStep:1,onSelect:"",onChangeMonth:"",onChangeYear:"",onChangeDecade:"",onChangeView:"",onRenderCell:""},l={ctrlRight:[17,39],ctrlUp:[17,38],ctrlLeft:[17,37],ctrlDown:[17,40],shiftRight:[16,39],shiftUp:[16,38],shiftLeft:[16,37],shiftDown:[16,40],altUp:[18,38],altRight:[18,39],altLeft:[18,37],altDown:[18,40],ctrlShiftUp:[16,17,38]},u=function(t,a){this.el=t,this.$el=e(t),this.opts=e.extend(!0,{},d,a,this.$el.data()),s==i&&(s=e("body")),this.opts.startDate||(this.opts.startDate=new Date),"INPUT"==this.el.nodeName&&(this.elIsInput=!0),this.opts.altField&&(this.$altField="string"==typeof this.opts.altField?e(this.opts.altField):this.opts.altField),this.inited=!1,this.visible=!1,this.silent=!1,this.currentDate=this.opts.startDate,this.currentView=this.opts.view,this._createShortCuts(),this.selectedDates=[],this.views={},this.keys=[],this.minRange="",this.maxRange="",this._prevOnSelectValue="",this.init()};n=u,n.prototype={viewIndexes:["days","months","years"],init:function(){o||this.opts.inline||!this.elIsInput||this._buildDatepickersContainer(),this._buildBaseHtml(),this._defineLocale(this.opts.language),this._syncWithMinMaxDates(),this.elIsInput&&(this.opts.inline||(this._setPositionClasses(this.opts.position),this._bindEvents()),this.opts.keyboardNav&&this._bindKeyboardEvents(),this.$datepicker.on("mousedown",this._onMouseDownDatepicker.bind(this)),this.$datepicker.on("mouseup",this._onMouseUpDatepicker.bind(this))),this.opts.classes&&this.$datepicker.addClass(this.opts.classes),this.opts.timepicker&&(this.timepicker=new e.fn.datepicker.Timepicker(this,this.opts),this._bindTimepickerEvents()),this.views[this.currentView]=new e.fn.datepicker.Body(this,this.currentView,this.opts),this.views[this.currentView].show(),this.nav=new e.fn.datepicker.Navigation(this,this.opts),this.view=this.currentView,this.$el.on("clickCell.adp",this._onClickCell.bind(this)),this.$datepicker.on("mouseenter",".datepicker--cell",this._onMouseEnterCell.bind(this)),this.$datepicker.on("mouseleave",".datepicker--cell",this._onMouseLeaveCell.bind(this)),this.inited=!0},_createShortCuts:function(){this.minDate=this.opts.minDate?this.opts.minDate:new Date(-86399999136e5),this.maxDate=this.opts.maxDate?this.opts.maxDate:new Date(86399999136e5)},_bindEvents:function(){this.$el.on(this.opts.showEvent+".adp",this._onShowEvent.bind(this)),this.$el.on("mouseup.adp",this._onMouseUpEl.bind(this)),this.$el.on("blur.adp",this._onBlur.bind(this)),this.$el.on("keyup.adp",this._onKeyUpGeneral.bind(this)),e(t).on("resize.adp",this._onResize.bind(this)),e("body").on("mouseup.adp",this._onMouseUpBody.bind(this))},_bindKeyboardEvents:function(){this.$el.on("keydown.adp",this._onKeyDown.bind(this)),this.$el.on("keyup.adp",this._onKeyUp.bind(this)),this.$el.on("hotKey.adp",this._onHotKey.bind(this))},_bindTimepickerEvents:function(){this.$el.on("timeChange.adp",this._onTimeChange.bind(this))},isWeekend:function(t){return-1!==this.opts.weekends.indexOf(t)},_defineLocale:function(t){"string"==typeof t?(this.loc=e.fn.datepicker.language[t],this.loc||(console.warn("Can't find language \""+t+'" in Datepicker.language, will use "ru" instead'),this.loc=e.extend(!0,{},e.fn.datepicker.language.ru)),this.loc=e.extend(!0,{},e.fn.datepicker.language.ru,e.fn.datepicker.language[t])):this.loc=e.extend(!0,{},e.fn.datepicker.language.ru,t),this.opts.dateFormat&&(this.loc.dateFormat=this.opts.dateFormat),this.opts.timeFormat&&(this.loc.timeFormat=this.opts.timeFormat),""!==this.opts.firstDay&&(this.loc.firstDay=this.opts.firstDay),this.opts.timepicker&&(this.loc.dateFormat=[this.loc.dateFormat,this.loc.timeFormat].join(this.opts.dateTimeSeparator));var i=this._getWordBoundaryRegExp;(this.loc.timeFormat.match(i("aa"))||this.loc.timeFormat.match(i("AA")))&&(this.ampm=!0)},_buildDatepickersContainer:function(){o=!0,s.append('<div class="datepickers-container" id="datepickers-container"></div>'),a=e("#datepickers-container")},_buildBaseHtml:function(){var t,i=e('<div class="datepicker-inline">');t="INPUT"==this.el.nodeName?this.opts.inline?i.insertAfter(this.$el):a:i.appendTo(this.$el),this.$datepicker=e(c).appendTo(t),this.$content=e(".datepicker--content",this.$datepicker),this.$nav=e(".datepicker--nav",this.$datepicker)},_triggerOnChange:function(){if(!this.selectedDates.length){if(""===this._prevOnSelectValue)return;return this._prevOnSelectValue="",this.opts.onSelect("","",this)}var t,e=this.selectedDates,i=n.getParsedDate(e[0]),s=this,a=new Date(i.year,i.month,i.date,i.hours,i.minutes);t=e.map(function(t){return s.formatDate(s.loc.dateFormat,t)}).join(this.opts.multipleDatesSeparator),(this.opts.multipleDates||this.opts.range)&&(a=e.map(function(t){var e=n.getParsedDate(t);return new Date(e.year,e.month,e.date,e.hours,e.minutes)})),this._prevOnSelectValue=t,this.opts.onSelect(t,a,this)},next:function(){var t=this.parsedDate,e=this.opts;switch(this.view){case"days":this.date=new Date(t.year,t.month+1,1),e.onChangeMonth&&e.onChangeMonth(this.parsedDate.month,this.parsedDate.year);break;case"months":this.date=new Date(t.year+1,t.month,1),e.onChangeYear&&e.onChangeYear(this.parsedDate.year);break;case"years":this.date=new Date(t.year+10,0,1),e.onChangeDecade&&e.onChangeDecade(this.curDecade)}},prev:function(){var t=this.parsedDate,e=this.opts;switch(this.view){case"days":this.date=new Date(t.year,t.month-1,1),e.onChangeMonth&&e.onChangeMonth(this.parsedDate.month,this.parsedDate.year);break;case"months":this.date=new Date(t.year-1,t.month,1),e.onChangeYear&&e.onChangeYear(this.parsedDate.year);break;case"years":this.date=new Date(t.year-10,0,1),e.onChangeDecade&&e.onChangeDecade(this.curDecade)}},formatDate:function(t,e){e=e||this.date;var i,s=t,a=this._getWordBoundaryRegExp,h=this.loc,r=n.getLeadingZeroNum,o=n.getDecade(e),c=n.getParsedDate(e),d=c.fullHours,l=c.hours,u="am";switch(this.opts.timepicker&&this.timepicker&&this.ampm&&(i=this.timepicker._getValidHoursFromDate(e),d=r(i.hours),l=i.hours,u=i.dayPeriod),!0){case/@/.test(s):s=s.replace(/@/,e.getTime());case/aa/.test(s):s=s.replace(a("aa"),u);case/AA/.test(s):s=s.replace(a("AA"),u.toUpperCase());case/dd/.test(s):s=s.replace(a("dd"),c.fullDate);case/d/.test(s):s=s.replace(a("d"),c.date);case/DD/.test(s):s=s.replace(a("DD"),h.days[c.day]);case/D/.test(s):s=s.replace(a("D"),h.daysShort[c.day]);case/mm/.test(s):s=s.replace(a("mm"),c.fullMonth);case/m/.test(s):s=s.replace(a("m"),c.month+1);case/MM/.test(s):s=s.replace(a("MM"),this.loc.months[c.month]);case/M/.test(s):s=s.replace(a("M"),h.monthsShort[c.month]);case/ii/.test(s):s=s.replace(a("ii"),c.fullMinutes);case/i/.test(s):s=s.replace(a("i"),c.minutes);case/hh/.test(s):s=s.replace(a("hh"),d);case/h/.test(s):s=s.replace(a("h"),l);case/yyyy/.test(s):s=s.replace(a("yyyy"),c.year);case/yyyy1/.test(s):s=s.replace(a("yyyy1"),o[0]);case/yyyy2/.test(s):s=s.replace(a("yyyy2"),o[1]);case/yy/.test(s):s=s.replace(a("yy"),c.year.toString().slice(-2))}return s},_getWordBoundaryRegExp:function(t){return new RegExp("\\b(?=[a-zA-Z0-9äöüßÄÖÜ<])"+t+"(?![>a-zA-Z0-9äöüßÄÖÜ])")},selectDate:function(t){var e=this,i=e.opts,s=e.parsedDate,a=e.selectedDates,h=a.length,r="";if(Array.isArray(t))return void t.forEach(function(t){e.selectDate(t)});if(t instanceof Date){if(this.lastSelectedDate=t,this.timepicker&&this.timepicker._setTime(t),e._trigger("selectDate",t),this.timepicker&&(t.setHours(this.timepicker.hours),t.setMinutes(this.timepicker.minutes)),"days"==e.view&&t.getMonth()!=s.month&&i.moveToOtherMonthsOnSelect&&(r=new Date(t.getFullYear(),t.getMonth(),1)),"years"==e.view&&t.getFullYear()!=s.year&&i.moveToOtherYearsOnSelect&&(r=new Date(t.getFullYear(),0,1)),r&&(e.silent=!0,e.date=r,e.silent=!1,e.nav._render()),i.multipleDates&&!i.range){if(h===i.multipleDates)return;e._isSelected(t)||e.selectedDates.push(t)}else i.range?2==h?(e.selectedDates=[t],e.minRange=t,e.maxRange=""):1==h?(e.selectedDates.push(t),e.maxRange?e.minRange=t:e.maxRange=t,n.bigger(e.maxRange,e.minRange)&&(e.maxRange=e.minRange,e.minRange=t),e.selectedDates=[e.minRange,e.maxRange]):(e.selectedDates=[t],e.minRange=t):e.selectedDates=[t];e._setInputValue(),i.onSelect&&e._triggerOnChange(),i.autoClose&&!this.timepickerIsActive&&(i.multipleDates||i.range?i.range&&2==e.selectedDates.length&&e.hide():e.hide()),e.views[this.currentView]._render()}},removeDate:function(t){var e=this.selectedDates,i=this;if(t instanceof Date)return e.some(function(s,a){return n.isSame(s,t)?(e.splice(a,1),i.selectedDates.length?i.lastSelectedDate=i.selectedDates[i.selectedDates.length-1]:(i.minRange="",i.maxRange="",i.lastSelectedDate=""),i.views[i.currentView]._render(),i._setInputValue(),i.opts.onSelect&&i._triggerOnChange(),!0):void 0})},today:function(){this.silent=!0,this.view=this.opts.minView,this.silent=!1,this.date=new Date,this.opts.todayButton instanceof Date&&this.selectDate(this.opts.todayButton)},clear:function(){this.selectedDates=[],this.minRange="",this.maxRange="",this.views[this.currentView]._render(),this._setInputValue(),this.opts.onSelect&&this._triggerOnChange()},update:function(t,i){var s=arguments.length;return 2==s?this.opts[t]=i:1==s&&"object"==typeof t&&(this.opts=e.extend(!0,this.opts,t)),this._createShortCuts(),this._syncWithMinMaxDates(),this._defineLocale(this.opts.language),this.nav._addButtonsIfNeed(),this.nav._render(),this.views[this.currentView]._render(),this.elIsInput&&!this.opts.inline&&(this._setPositionClasses(this.opts.position),this.visible&&this.setPosition(this.opts.position)),this.opts.classes&&this.$datepicker.addClass(this.opts.classes),this.opts.timepicker&&(this.timepicker._handleDate(this.lastSelectedDate),this.timepicker._updateRanges(),this.timepicker._updateCurrentTime(),this.lastSelectedDate&&(this.lastSelectedDate.setHours(this.timepicker.hours),this.lastSelectedDate.setMinutes(this.timepicker.minutes))),this._setInputValue(),this},_syncWithMinMaxDates:function(){var t=this.date.getTime();this.silent=!0,this.minTime>t&&(this.date=this.minDate),this.maxTime<t&&(this.date=this.maxDate),this.silent=!1},_isSelected:function(t,e){var i=!1;return this.selectedDates.some(function(s){return n.isSame(s,t,e)?(i=s,!0):void 0}),i},_setInputValue:function(){var t,e=this,i=e.opts,s=e.loc.dateFormat,a=i.altFieldDateFormat,n=e.selectedDates.map(function(t){return e.formatDate(s,t)});i.altField&&e.$altField.length&&(t=this.selectedDates.map(function(t){return e.formatDate(a,t)}),t=t.join(this.opts.multipleDatesSeparator),this.$altField.val(t)),n=n.join(this.opts.multipleDatesSeparator),this.$el.val(n)},_isInRange:function(t,e){var i=t.getTime(),s=n.getParsedDate(t),a=n.getParsedDate(this.minDate),h=n.getParsedDate(this.maxDate),r=new Date(s.year,s.month,a.date).getTime(),o=new Date(s.year,s.month,h.date).getTime(),c={day:i>=this.minTime&&i<=this.maxTime,month:r>=this.minTime&&o<=this.maxTime,year:s.year>=a.year&&s.year<=h.year};return e?c[e]:c.day},_getDimensions:function(t){var e=t.offset();return{width:t.outerWidth(),height:t.outerHeight(),left:e.left,top:e.top}},_getDateFromCell:function(t){var e=this.parsedDate,s=t.data("year")||e.year,a=t.data("month")==i?e.month:t.data("month"),n=t.data("date")||1;return new Date(s,a,n)},_setPositionClasses:function(t){t=t.split(" ");var e=t[0],i=t[1],s="datepicker -"+e+"-"+i+"- -from-"+e+"-";this.visible&&(s+=" active"),this.$datepicker.removeAttr("class").addClass(s)},setPosition:function(t){t=t||this.opts.position;var e,i,s=this._getDimensions(this.$el),a=this._getDimensions(this.$datepicker),n=t.split(" "),h=this.opts.offset,r=n[0],o=n[1];switch(r){case"top":e=s.top-a.height-h;break;case"right":i=s.left+s.width+h;break;case"bottom":e=s.top+s.height+h;break;case"left":i=s.left-a.width-h}switch(o){case"top":e=s.top;break;case"right":i=s.left+s.width-a.width;break;case"bottom":e=s.top+s.height-a.height;break;case"left":i=s.left;break;case"center":/left|right/.test(r)?e=s.top+s.height/2-a.height/2:i=s.left+s.width/2-a.width/2}this.$datepicker.css({left:i,top:e})},show:function(){this.setPosition(this.opts.position),this.$datepicker.addClass("active"),this.visible=!0},hide:function(){this.$datepicker.removeClass("active").css({left:"-100000px"}),this.focused="",this.keys=[],this.inFocus=!1,this.visible=!1,this.$el.blur()},down:function(t){this._changeView(t,"down")},up:function(t){this._changeView(t,"up")},_changeView:function(t,e){t=t||this.focused||this.date;var i="up"==e?this.viewIndex+1:this.viewIndex-1;i>2&&(i=2),0>i&&(i=0),this.silent=!0,this.date=new Date(t.getFullYear(),t.getMonth(),1),this.silent=!1,this.view=this.viewIndexes[i]},_handleHotKey:function(t){var e,i,s,a=n.getParsedDate(this._getFocusedDate()),h=this.opts,r=!1,o=!1,c=!1,d=a.year,l=a.month,u=a.date;switch(t){case"ctrlRight":case"ctrlUp":l+=1,r=!0;break;case"ctrlLeft":case"ctrlDown":l-=1,r=!0;break;case"shiftRight":case"shiftUp":o=!0,d+=1;break;case"shiftLeft":case"shiftDown":o=!0,d-=1;break;case"altRight":case"altUp":c=!0,d+=10;break;case"altLeft":case"altDown":c=!0,d-=10;break;case"ctrlShiftUp":this.up()}s=n.getDaysCount(new Date(d,l)),i=new Date(d,l,u),u>s&&(u=s),i.getTime()<this.minTime?i=this.minDate:i.getTime()>this.maxTime&&(i=this.maxDate),this.focused=i,e=n.getParsedDate(i),r&&h.onChangeMonth&&h.onChangeMonth(e.month,e.year),o&&h.onChangeYear&&h.onChangeYear(e.year),c&&h.onChangeDecade&&h.onChangeDecade(this.curDecade)},_registerKey:function(t){var e=this.keys.some(function(e){return e==t});e||this.keys.push(t)},_unRegisterKey:function(t){var e=this.keys.indexOf(t);this.keys.splice(e,1)},_isHotKeyPressed:function(){var t,e=!1,i=this,s=this.keys.sort();for(var a in l)t=l[a],s.length==t.length&&t.every(function(t,e){return t==s[e]})&&(i._trigger("hotKey",a),e=!0);return e},_trigger:function(t,e){this.$el.trigger(t,e)},_focusNextCell:function(t,e){e=e||this.cellType;var i=n.getParsedDate(this._getFocusedDate()),s=i.year,a=i.month,h=i.date;if(!this._isHotKeyPressed()){switch(t){case 37:"day"==e?h-=1:"","month"==e?a-=1:"","year"==e?s-=1:"";break;case 38:"day"==e?h-=7:"","month"==e?a-=3:"","year"==e?s-=4:"";break;case 39:"day"==e?h+=1:"","month"==e?a+=1:"","year"==e?s+=1:"";break;case 40:"day"==e?h+=7:"","month"==e?a+=3:"","year"==e?s+=4:""}var r=new Date(s,a,h);r.getTime()<this.minTime?r=this.minDate:r.getTime()>this.maxTime&&(r=this.maxDate),this.focused=r}},_getFocusedDate:function(){var t=this.focused||this.selectedDates[this.selectedDates.length-1],e=this.parsedDate;if(!t)switch(this.view){case"days":t=new Date(e.year,e.month,(new Date).getDate());break;case"months":t=new Date(e.year,e.month,1);break;case"years":t=new Date(e.year,0,1)}return t},_getCell:function(t,e){e=e||this.cellType;var i,s=n.getParsedDate(t),a='.datepicker--cell[data-year="'+s.year+'"]';switch(e){case"month":a='[data-month="'+s.month+'"]';break;case"day":a+='[data-month="'+s.month+'"][data-date="'+s.date+'"]'}return i=this.views[this.currentView].$el.find(a),i.length?i:""},destroy:function(){var t=this;t.$el.off(".adp").data("datepicker",""),t.selectedDates=[],t.focused="",t.views={},t.keys=[],t.minRange="",t.maxRange="",t.opts.inline||!t.elIsInput?t.$datepicker.closest(".datepicker-inline").remove():t.$datepicker.remove()},_onShowEvent:function(t){this.visible||this.show()},_onBlur:function(){!this.inFocus&&this.visible&&this.hide()},_onMouseDownDatepicker:function(t){this.inFocus=!0},_onMouseUpDatepicker:function(t){this.inFocus=!1,t.originalEvent.inFocus=!0,t.originalEvent.timepickerFocus||this.$el.focus()},_onKeyUpGeneral:function(t){var e=this.$el.val();e||this.clear()},_onResize:function(){this.visible&&this.setPosition()},_onMouseUpBody:function(t){t.originalEvent.inFocus||this.visible&&!this.inFocus&&this.hide()},_onMouseUpEl:function(t){t.originalEvent.inFocus=!0,setTimeout(this._onKeyUpGeneral.bind(this),4)},_onKeyDown:function(t){var e=t.which;if(this._registerKey(e),e>=37&&40>=e&&(t.preventDefault(),this._focusNextCell(e)),13==e&&this.focused){if(this._getCell(this.focused).hasClass("-disabled-"))return;if(this.view!=this.opts.minView)this.down();else{var i=this._isSelected(this.focused,this.cellType);i?i&&this.opts.toggleSelected&&this.removeDate(this.focused):(this.timepicker&&(this.focused.setHours(this.timepicker.hours),this.focused.setMinutes(this.timepicker.minutes)),this.selectDate(this.focused))}}27==e&&this.hide()},_onKeyUp:function(t){var e=t.which;this._unRegisterKey(e)},_onHotKey:function(t,e){this._handleHotKey(e)},_onMouseEnterCell:function(t){var i=e(t.target).closest(".datepicker--cell"),s=this._getDateFromCell(i);this.silent=!0,this.focused&&(this.focused=""),i.addClass("-focus-"),this.focused=s,this.silent=!1,this.opts.range&&1==this.selectedDates.length&&(this.minRange=this.selectedDates[0],this.maxRange="",n.less(this.minRange,this.focused)&&(this.maxRange=this.minRange,this.minRange=""),this.views[this.currentView]._update())},_onMouseLeaveCell:function(t){var i=e(t.target).closest(".datepicker--cell");i.removeClass("-focus-"),this.silent=!0,this.focused="",this.silent=!1},_onTimeChange:function(t,e,i){var s=new Date,a=this.selectedDates,n=!1;a.length&&(n=!0,s=this.lastSelectedDate),s.setHours(e),s.setMinutes(i),n||this._getCell(s).hasClass("-disabled-")?(this._setInputValue(),this.opts.onSelect&&this._triggerOnChange()):this.selectDate(s)},_onClickCell:function(t,e){this.timepicker&&(e.setHours(this.timepicker.hours),e.setMinutes(this.timepicker.minutes)),this.selectDate(e)},set focused(t){if(!t&&this.focused){var e=this._getCell(this.focused);e.length&&e.removeClass("-focus-")}this._focused=t,this.opts.range&&1==this.selectedDates.length&&(this.minRange=this.selectedDates[0],this.maxRange="",n.less(this.minRange,this._focused)&&(this.maxRange=this.minRange,this.minRange="")),this.silent||(this.date=t)},get focused(){return this._focused},get parsedDate(){return n.getParsedDate(this.date)},set date(t){return t instanceof Date?(this.currentDate=t,this.inited&&!this.silent&&(this.views[this.view]._render(),this.nav._render(),this.visible&&this.elIsInput&&this.setPosition()),t):void 0},get date(){return this.currentDate},set view(t){return this.viewIndex=this.viewIndexes.indexOf(t),this.viewIndex<0?void 0:(this.prevView=this.currentView,this.currentView=t,this.inited&&(this.views[t]?this.views[t]._render():this.views[t]=new e.fn.datepicker.Body(this,t,this.opts),this.views[this.prevView].hide(),this.views[t].show(),this.nav._render(),this.opts.onChangeView&&this.opts.onChangeView(t),this.elIsInput&&this.visible&&this.setPosition()),t)},get view(){return this.currentView},get cellType(){return this.view.substring(0,this.view.length-1)},get minTime(){var t=n.getParsedDate(this.minDate);return new Date(t.year,t.month,t.date).getTime()},get maxTime(){var t=n.getParsedDate(this.maxDate);return new Date(t.year,t.month,t.date).getTime()},get curDecade(){return n.getDecade(this.date)}},n.getDaysCount=function(t){return new Date(t.getFullYear(),t.getMonth()+1,0).getDate()},n.getParsedDate=function(t){return{year:t.getFullYear(),month:t.getMonth(),fullMonth:t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1,date:t.getDate(),fullDate:t.getDate()<10?"0"+t.getDate():t.getDate(),day:t.getDay(),hours:t.getHours(),fullHours:t.getHours()<10?"0"+t.getHours():t.getHours(),minutes:t.getMinutes(),fullMinutes:t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes()}},n.getDecade=function(t){var e=10*Math.floor(t.getFullYear()/10);return[e,e+9]},n.template=function(t,e){return t.replace(/#\{([\w]+)\}/g,function(t,i){return e[i]||0===e[i]?e[i]:void 0})},n.isSame=function(t,e,i){if(!t||!e)return!1;var s=n.getParsedDate(t),a=n.getParsedDate(e),h=i?i:"day",r={day:s.date==a.date&&s.month==a.month&&s.year==a.year,month:s.month==a.month&&s.year==a.year,year:s.year==a.year};return r[h]},n.less=function(t,e,i){return t&&e?e.getTime()<t.getTime():!1},n.bigger=function(t,e,i){return t&&e?e.getTime()>t.getTime():!1},n.getLeadingZeroNum=function(t){return parseInt(t)<10?"0"+t:t},e.fn.datepicker=function(t){return this.each(function(){if(e.data(this,h)){var i=e.data(this,h);i.opts=e.extend(!0,i.opts,t),i.update()}else e.data(this,h,new u(this,t))})},e.fn.datepicker.Constructor=u,e.fn.datepicker.language={ru:{days:["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],daysShort:["Вос","Пон","Вто","Сре","Чет","Пят","Суб"],daysMin:["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],months:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],monthsShort:["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"],today:"Сегодня",clear:"Очистить",dateFormat:"dd.mm.yyyy",timeFormat:"hh:ii",firstDay:1}},e(function(){e(r).datepicker()})}(),function(){var t={days:'<div class="datepicker--days datepicker--body"><div class="datepicker--days-names"></div><div class="datepicker--cells datepicker--cells-days"></div></div>',months:'<div class="datepicker--months datepicker--body"><div class="datepicker--cells datepicker--cells-months"></div></div>',years:'<div class="datepicker--years datepicker--body"><div class="datepicker--cells datepicker--cells-years"></div></div>'},s=e.fn.datepicker,a=s.Constructor;s.Body=function(t,e,i){this.d=t,this.type=e,this.opts=i,this.init()},s.Body.prototype={init:function(){this._buildBaseHtml(),this._render(),this._bindEvents()},_bindEvents:function(){this.$el.on("click",".datepicker--cell",e.proxy(this._onClickCell,this))},_buildBaseHtml:function(){this.$el=e(t[this.type]).appendTo(this.d.$content),this.$names=e(".datepicker--days-names",this.$el),this.$cells=e(".datepicker--cells",this.$el)},_getDayNamesHtml:function(t,e,s,a){return e=e!=i?e:t,s=s?s:"",a=a!=i?a:0,a>7?s:7==e?this._getDayNamesHtml(t,0,s,++a):(s+='<div class="datepicker--day-name'+(this.d.isWeekend(e)?" -weekend-":"")+'">'+this.d.loc.daysMin[e]+"</div>",this._getDayNamesHtml(t,++e,s,++a))},_getCellContents:function(t,e){var i="datepicker--cell datepicker--cell-"+e,s=new Date,n=this.d,h=n.opts,r=a.getParsedDate(t),o={},c=r.date;switch(h.onRenderCell&&(o=h.onRenderCell(t,e)||{},c=o.html?o.html:c,i+=o.classes?" "+o.classes:""),e){case"day":n.isWeekend(r.day)&&(i+=" -weekend-"),r.month!=this.d.parsedDate.month&&(i+=" -other-month-",h.selectOtherMonths||(i+=" -disabled-"),h.showOtherMonths||(c=""));break;case"month":c=n.loc[n.opts.monthsField][r.month];break;case"year":var d=n.curDecade;c=r.year,(r.year<d[0]||r.year>d[1])&&(i+=" -other-decade-",h.selectOtherYears||(i+=" -disabled-"),h.showOtherYears||(c=""))}return h.onRenderCell&&(o=h.onRenderCell(t,e)||{},c=o.html?o.html:c,i+=o.classes?" "+o.classes:""),h.range&&(a.isSame(n.minRange,t,e)&&(i+=" -range-from-"),a.isSame(n.maxRange,t,e)&&(i+=" -range-to-"),1==n.selectedDates.length&&n.focused?((a.bigger(n.minRange,t)&&a.less(n.focused,t)||a.less(n.maxRange,t)&&a.bigger(n.focused,t))&&(i+=" -in-range-"),a.less(n.maxRange,t)&&a.isSame(n.focused,t)&&(i+=" -range-from-"),a.bigger(n.minRange,t)&&a.isSame(n.focused,t)&&(i+=" -range-to-")):2==n.selectedDates.length&&a.bigger(n.minRange,t)&&a.less(n.maxRange,t)&&(i+=" -in-range-")),a.isSame(s,t,e)&&(i+=" -current-"),n.focused&&a.isSame(t,n.focused,e)&&(i+=" -focus-"),n._isSelected(t,e)&&(i+=" -selected-"),(!n._isInRange(t,e)||o.disabled)&&(i+=" -disabled-"),{html:c,classes:i}},_getDaysHtml:function(t){var e=a.getDaysCount(t),i=new Date(t.getFullYear(),t.getMonth(),1).getDay(),s=new Date(t.getFullYear(),t.getMonth(),e).getDay(),n=i-this.d.loc.firstDay,h=6-s+this.d.loc.firstDay;n=0>n?n+7:n,h=h>6?h-7:h;for(var r,o,c=-n+1,d="",l=c,u=e+h;u>=l;l++)o=t.getFullYear(),r=t.getMonth(),d+=this._getDayHtml(new Date(o,r,l));return d},_getDayHtml:function(t){var e=this._getCellContents(t,"day");return'<div class="'+e.classes+'" data-date="'+t.getDate()+'" data-month="'+t.getMonth()+'" data-year="'+t.getFullYear()+'">'+e.html+"</div>"},_getMonthsHtml:function(t){for(var e="",i=a.getParsedDate(t),s=0;12>s;)e+=this._getMonthHtml(new Date(i.year,s)),s++;return e},_getMonthHtml:function(t){var e=this._getCellContents(t,"month");return'<div class="'+e.classes+'" data-month="'+t.getMonth()+'">'+e.html+"</div>"},_getYearsHtml:function(t){var e=(a.getParsedDate(t),a.getDecade(t)),i=e[0]-1,s="",n=i;for(n;n<=e[1]+1;n++)s+=this._getYearHtml(new Date(n,0));return s},_getYearHtml:function(t){var e=this._getCellContents(t,"year");return'<div class="'+e.classes+'" data-year="'+t.getFullYear()+'">'+e.html+"</div>"},_renderTypes:{days:function(){var t=this._getDayNamesHtml(this.d.loc.firstDay),e=this._getDaysHtml(this.d.currentDate);this.$cells.html(e),this.$names.html(t)},months:function(){var t=this._getMonthsHtml(this.d.currentDate);this.$cells.html(t)},years:function(){var t=this._getYearsHtml(this.d.currentDate);this.$cells.html(t)}},_render:function(){this._renderTypes[this.type].bind(this)()},_update:function(){var t,i,s,a=e(".datepicker--cell",this.$cells),n=this;a.each(function(a,h){i=e(this),s=n.d._getDateFromCell(e(this)),t=n._getCellContents(s,n.d.cellType),i.attr("class",t.classes)})},show:function(){this.$el.addClass("active"),this.acitve=!0},hide:function(){this.$el.removeClass("active"),this.active=!1},_handleClick:function(t){var e=t.data("date")||1,i=t.data("month")||0,s=t.data("year")||this.d.parsedDate.year;if(this.d.view!=this.opts.minView)return void this.d.down(new Date(s,i,e));var a=new Date(s,i,e),n=this.d._isSelected(a,this.d.cellType);n?n&&this.opts.toggleSelected?this.d.removeDate(a):n&&!this.opts.toggleSelected&&(this.d.lastSelectedDate=n,this.d.opts.timepicker&&(this.d.timepicker._setTime(n),this.d.timepicker.update())):this.d._trigger("clickCell",a)},_onClickCell:function(t){var i=e(t.target).closest(".datepicker--cell");i.hasClass("-disabled-")||this._handleClick.bind(this)(i)}}}(),function(){var t='<div class="datepicker--nav-action" data-action="prev">#{prevHtml}</div><div class="datepicker--nav-title">#{title}</div><div class="datepicker--nav-action" data-action="next">#{nextHtml}</div>',i='<div class="datepicker--buttons"></div>',s='<span class="datepicker--button" data-action="#{action}">#{label}</span>',a=e.fn.datepicker,n=a.Constructor;a.Navigation=function(t,e){this.d=t,this.opts=e,this.$buttonsContainer="",this.init()},a.Navigation.prototype={init:function(){this._buildBaseHtml(),this._bindEvents()},_bindEvents:function(){this.d.$nav.on("click",".datepicker--nav-action",e.proxy(this._onClickNavButton,this)),this.d.$nav.on("click",".datepicker--nav-title",e.proxy(this._onClickNavTitle,this)),this.d.$datepicker.on("click",".datepicker--button",e.proxy(this._onClickNavButton,this))},_buildBaseHtml:function(){this._render(),this._addButtonsIfNeed()},_addButtonsIfNeed:function(){this.opts.todayButton&&this._addButton("today"),this.opts.clearButton&&this._addButton("clear")},_render:function(){var i=this._getTitle(this.d.currentDate),s=n.template(t,e.extend({title:i},this.opts));this.d.$nav.html(s),"years"==this.d.view&&e(".datepicker--nav-title",this.d.$nav).addClass("-disabled-"),this.setNavStatus()},_getTitle:function(t){return this.d.formatDate(this.opts.navTitles[this.d.view],t)},_addButton:function(t){this.$buttonsContainer.length||this._addButtonsContainer();var i={action:t,label:this.d.loc[t]},a=n.template(s,i);e("[data-action="+t+"]",this.$buttonsContainer).length||this.$buttonsContainer.append(a)},_addButtonsContainer:function(){this.d.$datepicker.append(i),this.$buttonsContainer=e(".datepicker--buttons",this.d.$datepicker)},setNavStatus:function(){if((this.opts.minDate||this.opts.maxDate)&&this.opts.disableNavWhenOutOfRange){var t=this.d.parsedDate,e=t.month,i=t.year,s=t.date;switch(this.d.view){case"days":this.d._isInRange(new Date(i,e-1,s),"month")||this._disableNav("prev"),this.d._isInRange(new Date(i,e+1,s),"month")||this._disableNav("next");break;case"months":this.d._isInRange(new Date(i-1,e,s),"year")||this._disableNav("prev"),this.d._isInRange(new Date(i+1,e,s),"year")||this._disableNav("next");break;case"years":this.d._isInRange(new Date(i-10,e,s),"year")||this._disableNav("prev"),this.d._isInRange(new Date(i+10,e,s),"year")||this._disableNav("next")}}},_disableNav:function(t){e('[data-action="'+t+'"]',this.d.$nav).addClass("-disabled-")},_activateNav:function(t){e('[data-action="'+t+'"]',this.d.$nav).removeClass("-disabled-")},_onClickNavButton:function(t){var i=e(t.target).closest("[data-action]"),s=i.data("action");this.d[s]()},_onClickNavTitle:function(t){return e(t.target).hasClass("-disabled-")?void 0:"days"==this.d.view?this.d.view="months":void(this.d.view="years")}}}(),function(){var t='<div class="datepicker--time"><div class="datepicker--time-current">   <span class="datepicker--time-current-hours">#{hourValue}</span>   <span class="datepicker--time-current-colon">:</span>   <span class="datepicker--time-current-minutes">#{minValue}</span></div><div class="datepicker--time-sliders">   <div class="datepicker--time-row">      <input type="range" name="hours" value="#{hourValue}" min="#{hourMin}" max="#{hourMax}" step="#{hourStep}"/>   </div>   <div class="datepicker--time-row">      <input type="range" name="minutes" value="#{minValue}" min="#{minMin}" max="#{minMax}" step="#{minStep}"/>   </div></div></div>',i=e.fn.datepicker,s=i.Constructor;i.Timepicker=function(t,e){this.d=t,this.opts=e,this.init()},i.Timepicker.prototype={init:function(){var t="input";this._setTime(this.d.date),this._buildHTML(),navigator.userAgent.match(/trident/gi)&&(t="change"),this.d.$el.on("selectDate",this._onSelectDate.bind(this)),this.$ranges.on(t,this._onChangeRange.bind(this)),this.$ranges.on("mouseup",this._onMouseUpRange.bind(this)),this.$ranges.on("mousemove focus ",this._onMouseEnterRange.bind(this)),this.$ranges.on("mouseout blur",this._onMouseOutRange.bind(this))},_setTime:function(t){var e=s.getParsedDate(t);this._handleDate(t),this.hours=e.hours<this.minHours?this.minHours:e.hours,this.minutes=e.minutes<this.minMinutes?this.minMinutes:e.minutes},_setMinTimeFromDate:function(t){this.minHours=t.getHours(),this.minMinutes=t.getMinutes()},_setMaxTimeFromDate:function(t){this.maxHours=t.getHours(),this.maxMinutes=t.getMinutes()},_setDefaultMinMaxTime:function(){var t=23,e=59,i=this.opts;this.minHours=i.minHours<0||i.minHours>t?0:i.minHours,this.minMinutes=i.minMinutes<0||i.minMinutes>e?0:i.minMinutes,this.maxHours=i.maxHours<0||i.maxHours>t?t:i.maxHours,this.maxMinutes=i.maxMinutes<0||i.maxMinutes>e?e:i.maxMinutes},_validateHoursMinutes:function(t){this.hours<this.minHours?this.hours=this.minHours:this.hours>this.maxHours&&(this.hours=this.maxHours),this.minutes<this.minMinutes?this.minutes=this.minMinutes:this.minutes>this.maxMinutes&&(this.minutes=this.maxMinutes)},_buildHTML:function(){var i=s.getLeadingZeroNum,a={hourMin:this.minHours,hourMax:i(this.maxHours),hourStep:this.opts.hoursStep,hourValue:i(this.displayHours),minMin:this.minMinutes,minMax:i(this.maxMinutes),minStep:this.opts.minutesStep,minValue:i(this.minutes)},n=s.template(t,a);this.$timepicker=e(n).appendTo(this.d.$datepicker),this.$ranges=e('[type="range"]',this.$timepicker),this.$hours=e('[name="hours"]',this.$timepicker),
this.$minutes=e('[name="minutes"]',this.$timepicker),this.$hoursText=e(".datepicker--time-current-hours",this.$timepicker),this.$minutesText=e(".datepicker--time-current-minutes",this.$timepicker),this.d.ampm&&(this.$ampm=e('<span class="datepicker--time-current-ampm">').appendTo(e(".datepicker--time-current",this.$timepicker)).html(this.dayPeriod),this.$timepicker.addClass("-am-pm-"))},_updateCurrentTime:function(){var t=s.getLeadingZeroNum(this.displayHours),e=s.getLeadingZeroNum(this.minutes);this.$hoursText.html(t),this.$minutesText.html(e),this.d.ampm&&this.$ampm.html(this.dayPeriod)},_updateRanges:function(){this.$hours.attr({min:this.minHours,max:this.maxHours}).val(this.hours),this.$minutes.attr({min:this.minMinutes,max:this.maxMinutes}).val(this.minutes)},_handleDate:function(t){this._setDefaultMinMaxTime(),t&&(s.isSame(t,this.d.opts.minDate)?this._setMinTimeFromDate(this.d.opts.minDate):s.isSame(t,this.d.opts.maxDate)&&this._setMaxTimeFromDate(this.d.opts.maxDate)),this._validateHoursMinutes(t)},update:function(){this._updateRanges(),this._updateCurrentTime()},_getValidHoursFromDate:function(t){var e=t,i=t;t instanceof Date&&(e=s.getParsedDate(t),i=e.hours);var a=this.d.ampm,n="am";if(a)switch(!0){case 0==i:i=12;break;case 12==i:n="pm";break;case i>11:i-=12,n="pm"}return{hours:i,dayPeriod:n}},set hours(t){this._hours=t;var e=this._getValidHoursFromDate(t);this.displayHours=e.hours,this.dayPeriod=e.dayPeriod},get hours(){return this._hours},_onChangeRange:function(t){var i=e(t.target),s=i.attr("name");this.d.timepickerIsActive=!0,this[s]=i.val(),this._updateCurrentTime(),this.d._trigger("timeChange",[this.hours,this.minutes])},_onSelectDate:function(t,e){this._handleDate(e),this.update()},_onMouseEnterRange:function(t){var i=e(t.target).attr("name");e(".datepicker--time-current-"+i,this.$timepicker).addClass("-focus-")},_onMouseOutRange:function(t){var i=e(t.target).attr("name");this.d.inFocus||e(".datepicker--time-current-"+i,this.$timepicker).removeClass("-focus-")},_onMouseUpRange:function(t){this.d.timepickerIsActive=!1}}}()}(window,jQuery);
;(function ($) { $.fn.datepicker.language['en'] = {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months: ['January','February','March','April','May','June', 'July','August','September','October','November','December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'mm/dd/yyyy',
    timeFormat: 'hh:ii aa',
    firstDay: 0
}; })(jQuery);

/*!
 * ClockPicker v0.0.7 (http://weareoutman.github.io/clockpicker/)
 * Copyright 2014 Wang Shenwei.
 * Licensed under MIT (https://github.com/weareoutman/clockpicker/blob/gh-pages/LICENSE)
 */
!function(){function t(t){return document.createElementNS(p,t)}function i(t){return(10>t?"0":"")+t}function e(t){var i=++m+"";return t?t+i:i}function s(s,r){function p(t,i){var e=u.offset(),s=/^touch/.test(t.type),o=e.left+b,n=e.top+b,p=(s?t.originalEvent.touches[0]:t).pageX-o,h=(s?t.originalEvent.touches[0]:t).pageY-n,k=Math.sqrt(p*p+h*h),v=!1;if(!i||!(g-y>k||k>g+y)){t.preventDefault();var m=setTimeout(function(){c.addClass("clockpicker-moving")},200);l&&u.append(x.canvas),x.setHand(p,h,!i,!0),a.off(d).on(d,function(t){t.preventDefault();var i=/^touch/.test(t.type),e=(i?t.originalEvent.touches[0]:t).pageX-o,s=(i?t.originalEvent.touches[0]:t).pageY-n;(v||e!==p||s!==h)&&(v=!0,x.setHand(e,s,!1,!0))}),a.off(f).on(f,function(t){a.off(f),t.preventDefault();var e=/^touch/.test(t.type),s=(e?t.originalEvent.changedTouches[0]:t).pageX-o,l=(e?t.originalEvent.changedTouches[0]:t).pageY-n;(i||v)&&s===p&&l===h&&x.setHand(s,l),"hours"===x.currentView?x.toggleView("minutes",A/2):r.autoclose&&(x.minutesView.addClass("clockpicker-dial-out"),setTimeout(function(){x.done()},A/2)),u.prepend(j),clearTimeout(m),c.removeClass("clockpicker-moving"),a.off(d)})}}var h=n(V),u=h.find(".clockpicker-plate"),v=h.find(".clockpicker-hours"),m=h.find(".clockpicker-minutes"),T=h.find(".clockpicker-am-pm-block"),C="INPUT"===s.prop("tagName"),H=C?s:s.find("input"),P=s.find(".input-group-addon"),x=this;if(this.id=e("cp"),this.element=s,this.options=r,this.isAppended=!1,this.isShown=!1,this.currentView="hours",this.isInput=C,this.input=H,this.addon=P,this.popover=h,this.plate=u,this.hoursView=v,this.minutesView=m,this.amPmBlock=T,this.spanHours=h.find(".clockpicker-span-hours"),this.spanMinutes=h.find(".clockpicker-span-minutes"),this.spanAmPm=h.find(".clockpicker-span-am-pm"),this.amOrPm="PM",r.twelvehour){{var S=['<div class="clockpicker-am-pm-block">','<button type="button" class="btn btn-sm btn-default clockpicker-button clockpicker-am-button">',"AM</button>",'<button type="button" class="btn btn-sm btn-default clockpicker-button clockpicker-pm-button">',"PM</button>","</div>"].join("");n(S)}n('<button type="button" class="btn btn-sm btn-default clockpicker-button am-button">AM</button>').on("click",function(){x.amOrPm="AM",n(".clockpicker-span-am-pm").empty().append("AM")}).appendTo(this.amPmBlock),n('<button type="button" class="btn btn-sm btn-default clockpicker-button pm-button">PM</button>').on("click",function(){x.amOrPm="PM",n(".clockpicker-span-am-pm").empty().append("PM")}).appendTo(this.amPmBlock)}r.autoclose||n('<button type="button" class="btn btn-sm btn-default btn-block clockpicker-button">'+r.donetext+"</button>").click(n.proxy(this.done,this)).appendTo(h),"top"!==r.placement&&"bottom"!==r.placement||"top"!==r.align&&"bottom"!==r.align||(r.align="left"),"left"!==r.placement&&"right"!==r.placement||"left"!==r.align&&"right"!==r.align||(r.align="top"),h.addClass(r.placement),h.addClass("clockpicker-align-"+r.align),this.spanHours.click(n.proxy(this.toggleView,this,"hours")),this.spanMinutes.click(n.proxy(this.toggleView,this,"minutes")),H.on("focus.clockpicker click.clockpicker",n.proxy(this.show,this)),P.on("click.clockpicker",n.proxy(this.toggle,this));var E,D,I,B,z=n('<div class="clockpicker-tick"></div>');if(r.twelvehour)for(E=1;13>E;E+=1)D=z.clone(),I=E/6*Math.PI,B=g,D.css("font-size","120%"),D.css({left:b+Math.sin(I)*B-y,top:b-Math.cos(I)*B-y}),D.html(0===E?"00":E),v.append(D),D.on(k,p);else for(E=0;24>E;E+=1){D=z.clone(),I=E/6*Math.PI;var O=E>0&&13>E;B=O?w:g,D.css({left:b+Math.sin(I)*B-y,top:b-Math.cos(I)*B-y}),O&&D.css("font-size","120%"),D.html(0===E?"00":E),v.append(D),D.on(k,p)}for(E=0;60>E;E+=5)D=z.clone(),I=E/30*Math.PI,D.css({left:b+Math.sin(I)*g-y,top:b-Math.cos(I)*g-y}),D.css("font-size","120%"),D.html(i(E)),m.append(D),D.on(k,p);if(u.on(k,function(t){0===n(t.target).closest(".clockpicker-tick").length&&p(t,!0)}),l){var j=h.find(".clockpicker-canvas"),L=t("svg");L.setAttribute("class","clockpicker-svg"),L.setAttribute("width",M),L.setAttribute("height",M);var U=t("g");U.setAttribute("transform","translate("+b+","+b+")");var W=t("circle");W.setAttribute("class","clockpicker-canvas-bearing"),W.setAttribute("cx",0),W.setAttribute("cy",0),W.setAttribute("r",2);var N=t("line");N.setAttribute("x1",0),N.setAttribute("y1",0);var X=t("circle");X.setAttribute("class","clockpicker-canvas-bg"),X.setAttribute("r",y);var Y=t("circle");Y.setAttribute("class","clockpicker-canvas-fg"),Y.setAttribute("r",3.5),U.appendChild(N),U.appendChild(X),U.appendChild(Y),U.appendChild(W),L.appendChild(U),j.append(L),this.hand=N,this.bg=X,this.fg=Y,this.bearing=W,this.g=U,this.canvas=j}o(this.options.init)}function o(t){t&&"function"==typeof t&&t()}var c,n=window.jQuery,r=n(window),a=n(document),p="http://www.w3.org/2000/svg",l="SVGAngle"in window&&function(){var t,i=document.createElement("div");return i.innerHTML="<svg/>",t=(i.firstChild&&i.firstChild.namespaceURI)==p,i.innerHTML="",t}(),h=function(){var t=document.createElement("div").style;return"transition"in t||"WebkitTransition"in t||"MozTransition"in t||"msTransition"in t||"OTransition"in t}(),u="ontouchstart"in window,k="mousedown"+(u?" touchstart":""),d="mousemove.clockpicker"+(u?" touchmove.clockpicker":""),f="mouseup.clockpicker"+(u?" touchend.clockpicker":""),v=navigator.vibrate?"vibrate":navigator.webkitVibrate?"webkitVibrate":null,m=0,b=100,g=80,w=54,y=13,M=2*b,A=h?350:1,V=['<div class="popover clockpicker-popover">','<div class="arrow"></div>','<div class="popover-title">','<span class="clockpicker-span-hours text-primary"></span>'," : ",'<span class="clockpicker-span-minutes"></span>','<span class="clockpicker-span-am-pm"></span>',"</div>",'<div class="popover-content">','<div class="clockpicker-plate">','<div class="clockpicker-canvas"></div>','<div class="clockpicker-dial clockpicker-hours"></div>','<div class="clockpicker-dial clockpicker-minutes clockpicker-dial-out"></div>',"</div>",'<span class="clockpicker-am-pm-block">',"</span>","</div>","</div>"].join("");s.DEFAULTS={"default":"",fromnow:0,placement:"bottom",align:"left",donetext:"完成",autoclose:!1,twelvehour:!1,vibrate:!0},s.prototype.toggle=function(){this[this.isShown?"hide":"show"]()},s.prototype.locate=function(){var t=this.element,i=this.popover,e=t.offset(),s=t.outerWidth(),o=t.outerHeight(),c=this.options.placement,n=this.options.align,r={};switch(i.show(),c){case"bottom":r.top=e.top+o;break;case"right":r.left=e.left+s;break;case"top":r.top=e.top-i.outerHeight();break;case"left":r.left=e.left-i.outerWidth()}switch(n){case"left":r.left=e.left;break;case"right":r.left=e.left+s-i.outerWidth();break;case"top":r.top=e.top;break;case"bottom":r.top=e.top+o-i.outerHeight()}i.css(r)},s.prototype.show=function(){if(!this.isShown){o(this.options.beforeShow);var t=this;this.isAppended||(c=n(document.body).append(this.popover),r.on("resize.clockpicker"+this.id,function(){t.isShown&&t.locate()}),this.isAppended=!0);var e=((this.input.prop("value")||this.options["default"]||"")+"").split(":");if("now"===e[0]){var s=new Date(+new Date+this.options.fromnow);e=[s.getHours(),s.getMinutes()]}this.hours=+e[0]||0,this.minutes=+e[1]||0,this.spanHours.html(i(this.hours)),this.spanMinutes.html(i(this.minutes)),this.toggleView("hours"),this.locate(),this.isShown=!0,a.on("click.clockpicker."+this.id+" focusin.clockpicker."+this.id,function(i){var e=n(i.target);0===e.closest(t.popover).length&&0===e.closest(t.addon).length&&0===e.closest(t.input).length&&t.hide()}),a.on("keyup.clockpicker."+this.id,function(i){27===i.keyCode&&t.hide()}),o(this.options.afterShow)}},s.prototype.hide=function(){o(this.options.beforeHide),this.isShown=!1,a.off("click.clockpicker."+this.id+" focusin.clockpicker."+this.id),a.off("keyup.clockpicker."+this.id),this.popover.hide(),o(this.options.afterHide)},s.prototype.toggleView=function(t,i){var e=!1;"minutes"===t&&"visible"===n(this.hoursView).css("visibility")&&(o(this.options.beforeHourSelect),e=!0);var s="hours"===t,c=s?this.hoursView:this.minutesView,r=s?this.minutesView:this.hoursView;this.currentView=t,this.spanHours.toggleClass("text-primary",s),this.spanMinutes.toggleClass("text-primary",!s),r.addClass("clockpicker-dial-out"),c.css("visibility","visible").removeClass("clockpicker-dial-out"),this.resetClock(i),clearTimeout(this.toggleViewTimer),this.toggleViewTimer=setTimeout(function(){r.css("visibility","hidden")},A),e&&o(this.options.afterHourSelect)},s.prototype.resetClock=function(t){var i=this.currentView,e=this[i],s="hours"===i,o=Math.PI/(s?6:30),c=e*o,n=s&&e>0&&13>e?w:g,r=Math.sin(c)*n,a=-Math.cos(c)*n,p=this;l&&t?(p.canvas.addClass("clockpicker-canvas-out"),setTimeout(function(){p.canvas.removeClass("clockpicker-canvas-out"),p.setHand(r,a)},t)):this.setHand(r,a)},s.prototype.setHand=function(t,e,s,o){var c,r=Math.atan2(t,-e),a="hours"===this.currentView,p=Math.PI/(a||s?6:30),h=Math.sqrt(t*t+e*e),u=this.options,k=a&&(g+w)/2>h,d=k?w:g;if(u.twelvehour&&(d=g),0>r&&(r=2*Math.PI+r),c=Math.round(r/p),r=c*p,u.twelvehour?a?0===c&&(c=12):(s&&(c*=5),60===c&&(c=0)):a?(12===c&&(c=0),c=k?0===c?12:c:0===c?0:c+12):(s&&(c*=5),60===c&&(c=0)),this[this.currentView]!==c&&v&&this.options.vibrate&&(this.vibrateTimer||(navigator[v](10),this.vibrateTimer=setTimeout(n.proxy(function(){this.vibrateTimer=null},this),100))),this[this.currentView]=c,this[a?"spanHours":"spanMinutes"].html(i(c)),!l)return void this[a?"hoursView":"minutesView"].find(".clockpicker-tick").each(function(){var t=n(this);t.toggleClass("active",c===+t.html())});o||!a&&c%5?(this.g.insertBefore(this.hand,this.bearing),this.g.insertBefore(this.bg,this.fg),this.bg.setAttribute("class","clockpicker-canvas-bg clockpicker-canvas-bg-trans")):(this.g.insertBefore(this.hand,this.bg),this.g.insertBefore(this.fg,this.bg),this.bg.setAttribute("class","clockpicker-canvas-bg"));var f=Math.sin(r)*d,m=-Math.cos(r)*d;this.hand.setAttribute("x2",f),this.hand.setAttribute("y2",m),this.bg.setAttribute("cx",f),this.bg.setAttribute("cy",m),this.fg.setAttribute("cx",f),this.fg.setAttribute("cy",m)},s.prototype.done=function(){o(this.options.beforeDone),this.hide();var t=this.input.prop("value"),e=i(this.hours)+":"+i(this.minutes);this.options.twelvehour&&(e+=this.amOrPm),this.input.prop("value",e),e!==t&&(this.input.triggerHandler("change"),this.isInput||this.element.trigger("change")),this.options.autoclose&&this.input.trigger("blur"),o(this.options.afterDone)},s.prototype.remove=function(){this.element.removeData("clockpicker"),this.input.off("focus.clockpicker click.clockpicker"),this.addon.off("click.clockpicker"),this.isShown&&this.hide(),this.isAppended&&(r.off("resize.clockpicker"+this.id),this.popover.remove())},n.fn.clockpicker=function(t){var i=Array.prototype.slice.call(arguments,1);return this.each(function(){var e=n(this),o=e.data("clockpicker");if(o)"function"==typeof o[t]&&o[t].apply(o,i);else{var c=n.extend({},s.DEFAULTS,e.data(),"object"==typeof t&&t);e.data("clockpicker",new s(e,c))}})}}();

/**************************************************************************
 * JSON-tree, v0.1.5; MIT License
 * http://krispo.github.io/json-tree
 **************************************************************************/
(function(){

    'use strict';

    angular.module('json-tree', [])
        .constant('jsonTreeConfig', {
            templateUrl: null
        })

        .directive('jsonTree', ['$compile', '$q', '$http', '$templateCache', 'jsonTreeConfig',  function($compile, $q, $http, $templateCache, jsonTreeConfig) {

            var template =
                '<span ng-bind="utils.wrap.start(node)"></span>' +
                '<span ng-bind="node.isCollapsed ? utils.wrap.middle(node) : \'&nbsp;&nbsp;&nbsp;\'" ng-click="utils.clickNode(node)"></span>' +
                '<ul ng-if="!node.isCollapsed">' +
                    '<li ng-repeat="key in utils.keys(json) track by key">' +
                        '<div draggable>' +
                            '<span  class="key" ng-click="utils.clickNode(childs[key])" >{{ key }}: </span>' +
                            '<span ng-hide="childs[key].isObject()">' +
                                '<input ng-if="childs[key].type() === \'boolean\'" type="checkbox" ng-model="json[key]"/>' +
                                '<input ng-if="childs[key].type() === \'number\'" type="number" ng-model="json[key]"/>' +
                                '<textarea ng-if="childs[key].type() === \'function\'" ng-model="jsonFn[key]" ng-init="utils.textarea.init(key)" ng-change="utils.textarea.onChange(key)" ng-focus="utils.textarea.onFocus($event, key)" ng-blur="utils.textarea.onBlur(key)"></textarea>' +
                                '<input ng-if="childs[key].type() !== \'number\' && childs[key].type() !== \'function\'" type="text" ng-model="json[key]" ng-change="utils.validateNode(key)" placeholder="null"/>' +
                            '</span>' +
                            '<json-tree json="json[key]" edit-level="{{editLevel}}" collapsed-level="{{+collapsedLevel - 1}}" node="childs[key]" timeout="{{timeout}}" ng-show="childs[key].isObject()"></json-tree>' +
                            '<span class="reset" ng-dblclick="utils.resetNode(key)" ng-show="node.isHighEditLevel"> ~ </span>' +
                            '<span class="remove" ng-dblclick="utils.removeNode(key)" ng-show="node.isHighEditLevel">-</span>' +
                            '<span class="comma" ng-hide="utils.wrap.isLastIndex(node, $index + 1)">,</span>' +
                        '</div>' +
                    '</li>' +
                '</ul>' +
                '<span ng-bind="utils.wrap.end(node)"></span>' +
                '<span class="add" ng-show="node.isHighEditLevel && node.isObject()" ng-click="addTpl = !addTpl; inputKey = null; inputValue = null"> + </span>' +
                '<span class="add-item-block" ng-show="(addTpl && node.isHighEditLevel) || false">' +
                    '<span class="add-item-label" ng-show="node.type() === \'object\'">'+
                        '<input class="add-item-input-key" type="text" ng-model="inputKey" placeholder="key"/>: '+
                        '<input class="add-item-input-value" type="text" ng-model="inputValue" placeholder="value"/>'+
                    '</span>' +
                    '<span class="add-item-preview" ng-show="node.type() === \'array\'">'+
                        '<input class="add-value-preview-input" type="text" ng-model="inputValue" placeholder="value"/>'+
                    '</span>' +
                    '<button class="add-item-btn-add" ng-click="utils.addNode(inputKey, inputValue); addTpl = false">+</button>'+
                    '<button class="add-item-btn-cancel" ng-click="addTpl = false">c</button>' +
                '</span>';

            function getTemplatePromise() {
                if(jsonTreeConfig.templateUrl) return $http.get(jsonTreeConfig.templateUrl, {
                    cache: $templateCache
                }).then(function (result) {
                    return result.data;
                });

                return $q.when(template);
            }

            return {
                restrict: 'EA',
                scope: {
                    json: '=',
                    node: '=?',
                    childs: '=?',
                    editLevel: '@',
                    collapsedLevel: '@',
                    timeout: '@',
                    timeoutInit: '@'
                },
                controller: ['$scope', function($scope){

                    /* initialize container for child nodes */
                    $scope.childs = {};

                    /* initialize container for nodes with functions */
                    $scope.jsonFn = {};

                    /* define auxiliary functions */
                    $scope.utils = {

                        /* prettify json view */
                        wrap: {
                            start: function(node){
                                if (node === undefined || node === null) return '';
                                switch (node.type()){
                                    case 'array': return '[';
                                    case 'object': return '{';
                                    default: return '';
                                }
                            },
                            middle: function(node){
                                if (node === undefined || node === null) return '';
                                switch (node.type()){
                                    case 'array': return '...';
                                    case 'object': return '...';
                                    default: return '';
                                }
                            },
                            end: function(node){
                                if (node === undefined || node === null) return '';
                                switch (node.type()){
                                    case 'array': return ']';
                                    case 'object': return '}';
                                    default: return '';
                                }
                            },
                            isLastIndex: function(node, index){
                                if (node === undefined || node === null) return true;
                                else return index >= node.length();
                            }
                        },

                        /* collapse/expand node by clicking */
                        clickNode: function(node){
                            node.isCollapsed = !node.isCollapsed;
                        },

                        /* add new node to the collection */
                        addNode: function(key, value){
                            var json = null;
                            try { json = JSON.parse(value); } catch (e){} //try get json
                            if (json === null) json = $scope.utils.tryGetFunction(value) || json; //try get function

                            /* add element to the object */
                            if ($scope.node.type() === 'object') {
                                if (json !== null){
                                    $scope.json[key] = json
                                } else {
                                    $scope.json[key] = value
                                }

                            }
                            /* add element(s) to the array */
                            else if ($scope.node.type() === 'array') {
                                if (json !== null) {
                                    if (json.constructor === Array){
                                        /* push new array elements to the array */
                                        $scope.json.push.apply($scope.json, json);
                                    } else {
                                        /* push single element to the array */
                                        $scope.json.push(json);
                                    }
                                } else {
                                    $scope.json.push(value);
                                }
                            }
                            $scope.refresh();
                        },

                        /* reset node value by key to default == null */
                        resetNode: function(key){
                            $scope.json[key] = null;
                            $scope.refresh();
                        },

                        /* remove node by key from json */
                        removeNode: function(key){
                            if ($scope.node.type() === 'object')
                                delete $scope.json[key];
                            else if ($scope.node.type() === 'array')
                                $scope.json.splice(key, 1);
                            $scope.refresh();
                        },

                        /* validate text if input to the form */
                        validateNode: function(key){
                            /* check if null */
                            if ($scope.json[key] === null);

                            /* check if undefined or "" */
                            else if ($scope.json[key] === undefined || $scope.json[key] === '') $scope.json[key] = null;

                            /* try to convert string to number */
                            else if (!isNaN(+$scope.json[key]) && isFinite($scope.json[key]))
                                $scope.json[key] = +$scope.json[key];

                            /* try parse to function */
                            else if ($scope.utils.tryGetFunction($scope.json[key])){
                                $scope.json[key] = $scope.utils.tryGetFunction($scope.json[key]);
                                $scope.utils.textarea.init(key);
                            }

                            /* try to parse string to json */
                            else {
                                if ($scope.node.isHighEditLevel){ /* if high editable level */
                                    try {
                                        var json = JSON.parse($scope.json[key]);
                                        $scope.json[key] = json;
                                        $scope.refresh();
                                    } catch (e){}
                                } else { /* if low editable level */
                                    /* check if boolean input -> then refresh */
                                    if ($scope.json[key] === "true" || $scope.json[key] === "false") {
                                        $scope.json[key] = JSON.parse($scope.json[key]);
                                        $scope.refresh();
                                    }
                                }
                            }
                        },

                        /* move node from position with index 'i' to position with index 'j' */
                        moveNode: function(i, j){
                            /* moving for object */
                            if ($scope.node.type() === 'object'){
                                var json = {},
                                    keys = Object.keys($scope.json),
                                    key1 = keys[i],
                                    key2 = keys[j];

                                angular.forEach($scope.json, function(value, key){
                                    if (key == key2) {
                                        if (j > i){
                                            json[key2] = $scope.json[key2];
                                            json[key1] = $scope.json[key1];
                                        } else {
                                            json[key1] = $scope.json[key1];
                                            json[key2] = $scope.json[key2];
                                        }
                                    }
                                    else if (key != key1) json[key] = value;
                                });
                                $scope.json = json;
                            }

                            /* moving for array */
                            else if ($scope.node.type() === 'array'){
                                var temp = $scope.json[i];
                                $scope.json.splice(i, 1);
                                $scope.json.splice(j, 0, temp);
                                $scope.$apply($scope.refresh());
                            }
                        },

                        /* handle textarea fith functions */
                        textarea: {
                            /* define function value for textarea */
                            init: function(key){
                                if ($scope.json[key] !== null) $scope.jsonFn[key] = $scope.json[key].toString().trim();
                            },

                            /* validate if element value is function */
                            validate: function(key){
                                var func = $scope.utils.tryGetFunction($scope.jsonFn[key]);
                                func
                                    ? angular.element($scope.utils.textarea.element).removeClass('invalid').addClass('valid')
                                    : angular.element($scope.utils.textarea.element).removeClass('valid').addClass('invalid');
                            },

                            /* onFocus event handler */
                            onFocus: function(e, key){
                                $scope.utils.textarea['valueBeforeEditing'] = angular.copy($scope.jsonFn[key]); //keep value before editing
                                $scope.utils.textarea['element'] = e.currentTarget;
                                $scope.utils.textarea.validate(key);
                            },

                            /* onChange event handler */
                            onChange: function(key){
                                $scope.utils.textarea.validate(key);
                            },

                            /* onBlur event handler */
                            onBlur: function(key){
                                //handle only if the field has been changed
                                if ($scope.utils.textarea.valueBeforeEditing !== $scope.jsonFn[key]) {
                                    $scope.$emit('onFunctionChanged'); //emit onFunctionChange event if the function definition was changed.

                                    var func = $scope.utils.tryGetFunction($scope.jsonFn[key]);
                                    if (func) $scope.json[key] = func;
                                    else { //if value is not a valid function
                                        $scope.json[key] = $scope.jsonFn[key];
                                        delete $scope.jsonFn[key];
                                        $scope.utils.validateNode(key); //full validation for node
                                    }
                                }
                            }
                        },

                        /* try to convert string to function */
                        /* it is important that function element MUST start with 'function' keyword */
                        tryGetFunction: function(str){
                            if (str.trim().substring(0, 8) === 'function'){
                                try {
                                    var func = eval( '(' + str.trim() + ')' );
                                    return func;
                                } catch(e){}
                            }
                        },

                        /* to skip ordering in ng-repeat */
                        keys: function(obj){
                            return (obj instanceof Object) ? Object.keys(obj) : [];
                        },

                        /* get type for variable val */
                        getType: function(val){
                            if (val === null) return 'null';
                            else if (val === undefined) return 'undefined';
                            else if (val.constructor === Array) return 'array';
                            else if (val.constructor === Object) return 'object';
                            else if (val.constructor === String) return 'string';
                            else if (val.constructor === Number) return 'number';
                            else if (val.constructor === Boolean) return 'boolean';
                            else if (val.constructor === Function) return 'function';
                            else return 'object'
                        }
                    };

                    /* define properties of the current node */
                    $scope.node = {

                        /* check node is collapsed */
                        isCollapsed: ($scope.collapsedLevel && +$scope.collapsedLevel) ? (+$scope.collapsedLevel <= 0) : true, /* set up isCollapsed properties, by default - true */

                        /* check editing level is high */
                        isHighEditLevel: $scope.editLevel !== "low",

                        /* if childs[key] is dragging now, dragChildKey matches to key  */
                        dragChildKey: null,

                        /* used to get info such as coordinates (top, left, height, width, meanY) of draggable elements by key */
                        dragElements: {},

                        /* check current node is object or array */
                        isObject: function(){
                            return angular.isObject($scope.json)
                        },

                        /* get type for current node */
                        type: function(){
                            return $scope.utils.getType($scope.json);
                        },

                        /* calculate collection length for object or array */
                        length: function(){
                            return ($scope.json instanceof Object) ? (Object.keys($scope.json).length) : 1
                        },

                        /* refresh template view */
                        refresh: function(){
                            $scope.refresh();
                        }
                    };
                }],
                link: function(scope, element, attrs){

                    /* define child scope and template */
                    var childScope = scope.$new(),
                        templatePromise = getTemplatePromise();

                    /* define build template function */
                    scope.build = function(_scope){
                        if (scope.node.isObject()){
                            templatePromise.then(function(tpl) {
                                element.html('').append($compile(tpl)(_scope));
                            });
                        }
                    };

                    /* define refresh function */
                    scope.refresh = function(){
                        childScope.$destroy();
                        childScope = scope.$new();
                        scope.build(childScope);
                    };

                    // build template view
                    if (scope.timeoutInit) {
                        setTimeout(function(){
                            scope.build(childScope);
                        },scope.timeoutInit);
                    } else if (scope.timeout && +scope.timeout>=0) {
                        setTimeout(function(){
                            scope.build(childScope);
                        },scope.timeout);
                    } else {
                        scope.build(childScope);
                    }
                }
            }
        }])

        .directive('draggable', ['$document', function($document) {
            return {
                link: function(scope, element, attr) {
                    var startX, startY, deltaX, deltaY, emptyElement, keys, index;

                    /* Save information of the current draggable element to the parent json-tree scope.
                     * This would be done under initialization */
                    scope.node.dragElements[scope.key] = function(){
                        return element;
                    };

                    element.on('mousedown', function(event) {
                        /* Check if pressed Ctrl or Shift */
                        if (event.ctrlKey || event.shiftKey) {

                            scope.node.dragChildKey = scope.key; // tell parent scope what child element is draggable now

                            var rect = getRectangle(scope.node.dragElements[scope.key]()[0]);

                            /* If child element is not draggable, than make the current element draggable */
                            if (scope.childs[scope.key].dragChildKey == null) {
                                // Prevent default dragging of selected content
                                event.preventDefault();

                                startX = rect.left;
                                startY = rect.top;
                                deltaX = event.pageX - startX;
                                deltaY = event.pageY - startY;

                                /* Draggable element should have 'absolute' position style parameter */
                                element.addClass('drag');
                                element.css({
                                    width: rect.width + 'px'
                                });
                                setPosition(startX, startY);

                                /* Add an empty element to fill the hole */
                                emptyElement = angular.element("<div class='empty'></div>");
                                emptyElement.css({
                                    height: (rect.height - 2) + 'px',
                                    width: (rect.width - 2) + 'px'
                                });
                                element.after(emptyElement);

                                /* Auxiliary array of json keys to retain the order of the current key's positions */
                                keys = Object.keys(scope.json);
                                index = scope.$index;

                                /* Subscribe on document mouse events */
                                $document.on('mousemove', mousemoveEventHandler);
                                $document.on('mouseup', mouseupEventHandler);
                            }
                        }
                    });

                    element.on('mouseup', function(event){
                        /* tell parent scope that the current element with his children are now not draggable */
                        scope.node.dragChildKey = null;
                    });

                    function mousemoveEventHandler(event) {
                        var rect = getRectangle(scope.node.dragElements[scope.key]()[0]),
                            meanBefore, meanAfter;

                        if (index >= keys.length - 1) meanAfter = Infinity;
                        else meanAfter = getRectangle(scope.node.dragElements[keys[index + 1]]()[0]).meanY;

                        if (index <= 0) meanBefore = -Infinity;
                        else meanBefore = getRectangle(scope.node.dragElements[keys[index - 1]]()[0]).meanY;

                        /* Check the criterion for swapping two sibling nodes */
                        if (rect.top + rect.height > meanAfter + 1) {
                            swapKeys(index, index + 1);
                            scope.node.dragElements[keys[index]]().parent().append(emptyElement);
                            index += 1;
                        }
                        else if (rect.top < meanBefore - 1){
                            swapKeys(index, index - 1);
                            scope.node.dragElements[keys[index]]().parent().prepend(emptyElement);
                            index -= 1;
                        }

                        setPosition(startX, event.pageY - deltaY)
                    }

                    function mouseupEventHandler() {
                        /* Fix position and update json and tree view */
                        scope.utils.moveNode(scope.$index, index);
                        scope.$apply();

                        element.removeClass('drag');
                        setPosition(startX, startY);

                        emptyElement.remove();

                        $document.unbind('mousemove', mousemoveEventHandler);
                        $document.unbind('mouseup', mouseupEventHandler);
                    }

                    function setPosition(x, y){
                        element.css({
                            top: y + 'px',
                            left: x + 'px'
                        });
                    }

                    function swapKeys(i, j){
                        var key = keys[i];
                        keys[i] = keys[j];
                        keys[j] = key;
                    }

                    /* Get coordinates of rectangle region for the element 'el' */
                    function getRectangle(el){
                        var box = el.getBoundingClientRect(),
                            top = Math.round(box.top + window.pageYOffset),
                            left = Math.round(box.left + window.pageXOffset),
                            height = typeof el.offsetHeight === 'undefined' ? 0 : el.offsetHeight,
                            width = typeof el.offsetWidth === 'undefined' ? 0 : el.offsetWidth;

                        return { top: top, left: left, height: height, width: width, meanY: top + height / 2}
                    }
                }
            }
        }]);
})();

/*
 Leaflet, a JavaScript library for mobile-friendly interactive maps. http://leafletjs.com
 (c) 2010-2013, Vladimir Agafonkin
 (c) 2010-2011, CloudMade
*/
!function(t,e,i){var n=t.L,o={};o.version="0.7.7","object"==typeof module&&"object"==typeof module.exports?module.exports=o:"function"==typeof define&&define.amd&&define(o),o.noConflict=function(){return t.L=n,this},t.L=o,o.Util={extend:function(t){var e,i,n,o,s=Array.prototype.slice.call(arguments,1);for(i=0,n=s.length;n>i;i++){o=s[i]||{};for(e in o)o.hasOwnProperty(e)&&(t[e]=o[e])}return t},bind:function(t,e){var i=arguments.length>2?Array.prototype.slice.call(arguments,2):null;return function(){return t.apply(e,i||arguments)}},stamp:function(){var t=0,e="_leaflet_id";return function(i){return i[e]=i[e]||++t,i[e]}}(),invokeEach:function(t,e,i){var n,o;if("object"==typeof t){o=Array.prototype.slice.call(arguments,3);for(n in t)e.apply(i,[n,t[n]].concat(o));return!0}return!1},limitExecByInterval:function(t,e,i){var n,o;return function s(){var a=arguments;return n?void(o=!0):(n=!0,setTimeout(function(){n=!1,o&&(s.apply(i,a),o=!1)},e),void t.apply(i,a))}},falseFn:function(){return!1},formatNum:function(t,e){var i=Math.pow(10,e||5);return Math.round(t*i)/i},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},splitWords:function(t){return o.Util.trim(t).split(/\s+/)},setOptions:function(t,e){return t.options=o.extend({},t.options,e),t.options},getParamString:function(t,e,i){var n=[];for(var o in t)n.push(encodeURIComponent(i?o.toUpperCase():o)+"="+encodeURIComponent(t[o]));return(e&&-1!==e.indexOf("?")?"&":"?")+n.join("&")},template:function(t,e){return t.replace(/\{ *([\w_]+) *\}/g,function(t,n){var o=e[n];if(o===i)throw new Error("No value provided for variable "+t);return"function"==typeof o&&(o=o(e)),o})},isArray:Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="},function(){function e(e){var i,n,o=["webkit","moz","o","ms"];for(i=0;i<o.length&&!n;i++)n=t[o[i]+e];return n}function i(e){var i=+new Date,o=Math.max(0,16-(i-n));return n=i+o,t.setTimeout(e,o)}var n=0,s=t.requestAnimationFrame||e("RequestAnimationFrame")||i,a=t.cancelAnimationFrame||e("CancelAnimationFrame")||e("CancelRequestAnimationFrame")||function(e){t.clearTimeout(e)};o.Util.requestAnimFrame=function(e,n,a,r){return e=o.bind(e,n),a&&s===i?void e():s.call(t,e,r)},o.Util.cancelAnimFrame=function(e){e&&a.call(t,e)}}(),o.extend=o.Util.extend,o.bind=o.Util.bind,o.stamp=o.Util.stamp,o.setOptions=o.Util.setOptions,o.Class=function(){},o.Class.extend=function(t){var e=function(){this.initialize&&this.initialize.apply(this,arguments),this._initHooks&&this.callInitHooks()},i=function(){};i.prototype=this.prototype;var n=new i;n.constructor=e,e.prototype=n;for(var s in this)this.hasOwnProperty(s)&&"prototype"!==s&&(e[s]=this[s]);t.statics&&(o.extend(e,t.statics),delete t.statics),t.includes&&(o.Util.extend.apply(null,[n].concat(t.includes)),delete t.includes),t.options&&n.options&&(t.options=o.extend({},n.options,t.options)),o.extend(n,t),n._initHooks=[];var a=this;return e.__super__=a.prototype,n.callInitHooks=function(){if(!this._initHooksCalled){a.prototype.callInitHooks&&a.prototype.callInitHooks.call(this),this._initHooksCalled=!0;for(var t=0,e=n._initHooks.length;e>t;t++)n._initHooks[t].call(this)}},e},o.Class.include=function(t){o.extend(this.prototype,t)},o.Class.mergeOptions=function(t){o.extend(this.prototype.options,t)},o.Class.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),i="function"==typeof t?t:function(){this[t].apply(this,e)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(i)};var s="_leaflet_events";o.Mixin={},o.Mixin.Events={addEventListener:function(t,e,i){if(o.Util.invokeEach(t,this.addEventListener,this,e,i))return this;var n,a,r,h,l,u,c,d=this[s]=this[s]||{},p=i&&i!==this&&o.stamp(i);for(t=o.Util.splitWords(t),n=0,a=t.length;a>n;n++)r={action:e,context:i||this},h=t[n],p?(l=h+"_idx",u=l+"_len",c=d[l]=d[l]||{},c[p]||(c[p]=[],d[u]=(d[u]||0)+1),c[p].push(r)):(d[h]=d[h]||[],d[h].push(r));return this},hasEventListeners:function(t){var e=this[s];return!!e&&(t in e&&e[t].length>0||t+"_idx"in e&&e[t+"_idx_len"]>0)},removeEventListener:function(t,e,i){if(!this[s])return this;if(!t)return this.clearAllEventListeners();if(o.Util.invokeEach(t,this.removeEventListener,this,e,i))return this;var n,a,r,h,l,u,c,d,p,_=this[s],m=i&&i!==this&&o.stamp(i);for(t=o.Util.splitWords(t),n=0,a=t.length;a>n;n++)if(r=t[n],u=r+"_idx",c=u+"_len",d=_[u],e){if(h=m&&d?d[m]:_[r]){for(l=h.length-1;l>=0;l--)h[l].action!==e||i&&h[l].context!==i||(p=h.splice(l,1),p[0].action=o.Util.falseFn);i&&d&&0===h.length&&(delete d[m],_[c]--)}}else delete _[r],delete _[u],delete _[c];return this},clearAllEventListeners:function(){return delete this[s],this},fireEvent:function(t,e){if(!this.hasEventListeners(t))return this;var i,n,a,r,h,l=o.Util.extend({},e,{type:t,target:this}),u=this[s];if(u[t])for(i=u[t].slice(),n=0,a=i.length;a>n;n++)i[n].action.call(i[n].context,l);r=u[t+"_idx"];for(h in r)if(i=r[h].slice())for(n=0,a=i.length;a>n;n++)i[n].action.call(i[n].context,l);return this},addOneTimeEventListener:function(t,e,i){if(o.Util.invokeEach(t,this.addOneTimeEventListener,this,e,i))return this;var n=o.bind(function(){this.removeEventListener(t,e,i).removeEventListener(t,n,i)},this);return this.addEventListener(t,e,i).addEventListener(t,n,i)}},o.Mixin.Events.on=o.Mixin.Events.addEventListener,o.Mixin.Events.off=o.Mixin.Events.removeEventListener,o.Mixin.Events.once=o.Mixin.Events.addOneTimeEventListener,o.Mixin.Events.fire=o.Mixin.Events.fireEvent,function(){var n="ActiveXObject"in t,s=n&&!e.addEventListener,a=navigator.userAgent.toLowerCase(),r=-1!==a.indexOf("webkit"),h=-1!==a.indexOf("chrome"),l=-1!==a.indexOf("phantom"),u=-1!==a.indexOf("android"),c=-1!==a.search("android [23]"),d=-1!==a.indexOf("gecko"),p=typeof orientation!=i+"",_=!t.PointerEvent&&t.MSPointerEvent,m=t.PointerEvent&&t.navigator.pointerEnabled||_,f="devicePixelRatio"in t&&t.devicePixelRatio>1||"matchMedia"in t&&t.matchMedia("(min-resolution:144dpi)")&&t.matchMedia("(min-resolution:144dpi)").matches,g=e.documentElement,v=n&&"transition"in g.style,y="WebKitCSSMatrix"in t&&"m11"in new t.WebKitCSSMatrix&&!c,P="MozPerspective"in g.style,L="OTransition"in g.style,x=!t.L_DISABLE_3D&&(v||y||P||L)&&!l,w=!t.L_NO_TOUCH&&!l&&(m||"ontouchstart"in t||t.DocumentTouch&&e instanceof t.DocumentTouch);o.Browser={ie:n,ielt9:s,webkit:r,gecko:d&&!r&&!t.opera&&!n,android:u,android23:c,chrome:h,ie3d:v,webkit3d:y,gecko3d:P,opera3d:L,any3d:x,mobile:p,mobileWebkit:p&&r,mobileWebkit3d:p&&y,mobileOpera:p&&t.opera,touch:w,msPointer:_,pointer:m,retina:f}}(),o.Point=function(t,e,i){this.x=i?Math.round(t):t,this.y=i?Math.round(e):e},o.Point.prototype={clone:function(){return new o.Point(this.x,this.y)},add:function(t){return this.clone()._add(o.point(t))},_add:function(t){return this.x+=t.x,this.y+=t.y,this},subtract:function(t){return this.clone()._subtract(o.point(t))},_subtract:function(t){return this.x-=t.x,this.y-=t.y,this},divideBy:function(t){return this.clone()._divideBy(t)},_divideBy:function(t){return this.x/=t,this.y/=t,this},multiplyBy:function(t){return this.clone()._multiplyBy(t)},_multiplyBy:function(t){return this.x*=t,this.y*=t,this},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},distanceTo:function(t){t=o.point(t);var e=t.x-this.x,i=t.y-this.y;return Math.sqrt(e*e+i*i)},equals:function(t){return t=o.point(t),t.x===this.x&&t.y===this.y},contains:function(t){return t=o.point(t),Math.abs(t.x)<=Math.abs(this.x)&&Math.abs(t.y)<=Math.abs(this.y)},toString:function(){return"Point("+o.Util.formatNum(this.x)+", "+o.Util.formatNum(this.y)+")"}},o.point=function(t,e,n){return t instanceof o.Point?t:o.Util.isArray(t)?new o.Point(t[0],t[1]):t===i||null===t?t:new o.Point(t,e,n)},o.Bounds=function(t,e){if(t)for(var i=e?[t,e]:t,n=0,o=i.length;o>n;n++)this.extend(i[n])},o.Bounds.prototype={extend:function(t){return t=o.point(t),this.min||this.max?(this.min.x=Math.min(t.x,this.min.x),this.max.x=Math.max(t.x,this.max.x),this.min.y=Math.min(t.y,this.min.y),this.max.y=Math.max(t.y,this.max.y)):(this.min=t.clone(),this.max=t.clone()),this},getCenter:function(t){return new o.Point((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,t)},getBottomLeft:function(){return new o.Point(this.min.x,this.max.y)},getTopRight:function(){return new o.Point(this.max.x,this.min.y)},getSize:function(){return this.max.subtract(this.min)},contains:function(t){var e,i;return t="number"==typeof t[0]||t instanceof o.Point?o.point(t):o.bounds(t),t instanceof o.Bounds?(e=t.min,i=t.max):e=i=t,e.x>=this.min.x&&i.x<=this.max.x&&e.y>=this.min.y&&i.y<=this.max.y},intersects:function(t){t=o.bounds(t);var e=this.min,i=this.max,n=t.min,s=t.max,a=s.x>=e.x&&n.x<=i.x,r=s.y>=e.y&&n.y<=i.y;return a&&r},isValid:function(){return!(!this.min||!this.max)}},o.bounds=function(t,e){return!t||t instanceof o.Bounds?t:new o.Bounds(t,e)},o.Transformation=function(t,e,i,n){this._a=t,this._b=e,this._c=i,this._d=n},o.Transformation.prototype={transform:function(t,e){return this._transform(t.clone(),e)},_transform:function(t,e){return e=e||1,t.x=e*(this._a*t.x+this._b),t.y=e*(this._c*t.y+this._d),t},untransform:function(t,e){return e=e||1,new o.Point((t.x/e-this._b)/this._a,(t.y/e-this._d)/this._c)}},o.DomUtil={get:function(t){return"string"==typeof t?e.getElementById(t):t},getStyle:function(t,i){var n=t.style[i];if(!n&&t.currentStyle&&(n=t.currentStyle[i]),(!n||"auto"===n)&&e.defaultView){var o=e.defaultView.getComputedStyle(t,null);n=o?o[i]:null}return"auto"===n?null:n},getViewportOffset:function(t){var i,n=0,s=0,a=t,r=e.body,h=e.documentElement;do{if(n+=a.offsetTop||0,s+=a.offsetLeft||0,n+=parseInt(o.DomUtil.getStyle(a,"borderTopWidth"),10)||0,s+=parseInt(o.DomUtil.getStyle(a,"borderLeftWidth"),10)||0,i=o.DomUtil.getStyle(a,"position"),a.offsetParent===r&&"absolute"===i)break;if("fixed"===i){n+=r.scrollTop||h.scrollTop||0,s+=r.scrollLeft||h.scrollLeft||0;break}if("relative"===i&&!a.offsetLeft){var l=o.DomUtil.getStyle(a,"width"),u=o.DomUtil.getStyle(a,"max-width"),c=a.getBoundingClientRect();("none"!==l||"none"!==u)&&(s+=c.left+a.clientLeft),n+=c.top+(r.scrollTop||h.scrollTop||0);break}a=a.offsetParent}while(a);a=t;do{if(a===r)break;n-=a.scrollTop||0,s-=a.scrollLeft||0,a=a.parentNode}while(a);return new o.Point(s,n)},documentIsLtr:function(){return o.DomUtil._docIsLtrCached||(o.DomUtil._docIsLtrCached=!0,o.DomUtil._docIsLtr="ltr"===o.DomUtil.getStyle(e.body,"direction")),o.DomUtil._docIsLtr},create:function(t,i,n){var o=e.createElement(t);return o.className=i,n&&n.appendChild(o),o},hasClass:function(t,e){if(t.classList!==i)return t.classList.contains(e);var n=o.DomUtil._getClass(t);return n.length>0&&new RegExp("(^|\\s)"+e+"(\\s|$)").test(n)},addClass:function(t,e){if(t.classList!==i)for(var n=o.Util.splitWords(e),s=0,a=n.length;a>s;s++)t.classList.add(n[s]);else if(!o.DomUtil.hasClass(t,e)){var r=o.DomUtil._getClass(t);o.DomUtil._setClass(t,(r?r+" ":"")+e)}},removeClass:function(t,e){t.classList!==i?t.classList.remove(e):o.DomUtil._setClass(t,o.Util.trim((" "+o.DomUtil._getClass(t)+" ").replace(" "+e+" "," ")))},_setClass:function(t,e){t.className.baseVal===i?t.className=e:t.className.baseVal=e},_getClass:function(t){return t.className.baseVal===i?t.className:t.className.baseVal},setOpacity:function(t,e){if("opacity"in t.style)t.style.opacity=e;else if("filter"in t.style){var i=!1,n="DXImageTransform.Microsoft.Alpha";try{i=t.filters.item(n)}catch(o){if(1===e)return}e=Math.round(100*e),i?(i.Enabled=100!==e,i.Opacity=e):t.style.filter+=" progid:"+n+"(opacity="+e+")"}},testProp:function(t){for(var i=e.documentElement.style,n=0;n<t.length;n++)if(t[n]in i)return t[n];return!1},getTranslateString:function(t){var e=o.Browser.webkit3d,i="translate"+(e?"3d":"")+"(",n=(e?",0":"")+")";return i+t.x+"px,"+t.y+"px"+n},getScaleString:function(t,e){var i=o.DomUtil.getTranslateString(e.add(e.multiplyBy(-1*t))),n=" scale("+t+") ";return i+n},setPosition:function(t,e,i){t._leaflet_pos=e,!i&&o.Browser.any3d?t.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(e):(t.style.left=e.x+"px",t.style.top=e.y+"px")},getPosition:function(t){return t._leaflet_pos}},o.DomUtil.TRANSFORM=o.DomUtil.testProp(["transform","WebkitTransform","OTransform","MozTransform","msTransform"]),o.DomUtil.TRANSITION=o.DomUtil.testProp(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),o.DomUtil.TRANSITION_END="webkitTransition"===o.DomUtil.TRANSITION||"OTransition"===o.DomUtil.TRANSITION?o.DomUtil.TRANSITION+"End":"transitionend",function(){if("onselectstart"in e)o.extend(o.DomUtil,{disableTextSelection:function(){o.DomEvent.on(t,"selectstart",o.DomEvent.preventDefault)},enableTextSelection:function(){o.DomEvent.off(t,"selectstart",o.DomEvent.preventDefault)}});else{var i=o.DomUtil.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);o.extend(o.DomUtil,{disableTextSelection:function(){if(i){var t=e.documentElement.style;this._userSelect=t[i],t[i]="none"}},enableTextSelection:function(){i&&(e.documentElement.style[i]=this._userSelect,delete this._userSelect)}})}o.extend(o.DomUtil,{disableImageDrag:function(){o.DomEvent.on(t,"dragstart",o.DomEvent.preventDefault)},enableImageDrag:function(){o.DomEvent.off(t,"dragstart",o.DomEvent.preventDefault)}})}(),o.LatLng=function(t,e,n){if(t=parseFloat(t),e=parseFloat(e),isNaN(t)||isNaN(e))throw new Error("Invalid LatLng object: ("+t+", "+e+")");this.lat=t,this.lng=e,n!==i&&(this.alt=parseFloat(n))},o.extend(o.LatLng,{DEG_TO_RAD:Math.PI/180,RAD_TO_DEG:180/Math.PI,MAX_MARGIN:1e-9}),o.LatLng.prototype={equals:function(t){if(!t)return!1;t=o.latLng(t);var e=Math.max(Math.abs(this.lat-t.lat),Math.abs(this.lng-t.lng));return e<=o.LatLng.MAX_MARGIN},toString:function(t){return"LatLng("+o.Util.formatNum(this.lat,t)+", "+o.Util.formatNum(this.lng,t)+")"},distanceTo:function(t){t=o.latLng(t);var e=6378137,i=o.LatLng.DEG_TO_RAD,n=(t.lat-this.lat)*i,s=(t.lng-this.lng)*i,a=this.lat*i,r=t.lat*i,h=Math.sin(n/2),l=Math.sin(s/2),u=h*h+l*l*Math.cos(a)*Math.cos(r);return 2*e*Math.atan2(Math.sqrt(u),Math.sqrt(1-u))},wrap:function(t,e){var i=this.lng;return t=t||-180,e=e||180,i=(i+e)%(e-t)+(t>i||i===e?e:t),new o.LatLng(this.lat,i)}},o.latLng=function(t,e){return t instanceof o.LatLng?t:o.Util.isArray(t)?"number"==typeof t[0]||"string"==typeof t[0]?new o.LatLng(t[0],t[1],t[2]):null:t===i||null===t?t:"object"==typeof t&&"lat"in t?new o.LatLng(t.lat,"lng"in t?t.lng:t.lon):e===i?null:new o.LatLng(t,e)},o.LatLngBounds=function(t,e){if(t)for(var i=e?[t,e]:t,n=0,o=i.length;o>n;n++)this.extend(i[n])},o.LatLngBounds.prototype={extend:function(t){if(!t)return this;var e=o.latLng(t);return t=null!==e?e:o.latLngBounds(t),t instanceof o.LatLng?this._southWest||this._northEast?(this._southWest.lat=Math.min(t.lat,this._southWest.lat),this._southWest.lng=Math.min(t.lng,this._southWest.lng),this._northEast.lat=Math.max(t.lat,this._northEast.lat),this._northEast.lng=Math.max(t.lng,this._northEast.lng)):(this._southWest=new o.LatLng(t.lat,t.lng),this._northEast=new o.LatLng(t.lat,t.lng)):t instanceof o.LatLngBounds&&(this.extend(t._southWest),this.extend(t._northEast)),this},pad:function(t){var e=this._southWest,i=this._northEast,n=Math.abs(e.lat-i.lat)*t,s=Math.abs(e.lng-i.lng)*t;return new o.LatLngBounds(new o.LatLng(e.lat-n,e.lng-s),new o.LatLng(i.lat+n,i.lng+s))},getCenter:function(){return new o.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new o.LatLng(this.getNorth(),this.getWest())},getSouthEast:function(){return new o.LatLng(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(t){t="number"==typeof t[0]||t instanceof o.LatLng?o.latLng(t):o.latLngBounds(t);var e,i,n=this._southWest,s=this._northEast;return t instanceof o.LatLngBounds?(e=t.getSouthWest(),i=t.getNorthEast()):e=i=t,e.lat>=n.lat&&i.lat<=s.lat&&e.lng>=n.lng&&i.lng<=s.lng},intersects:function(t){t=o.latLngBounds(t);var e=this._southWest,i=this._northEast,n=t.getSouthWest(),s=t.getNorthEast(),a=s.lat>=e.lat&&n.lat<=i.lat,r=s.lng>=e.lng&&n.lng<=i.lng;return a&&r},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(t){return t?(t=o.latLngBounds(t),this._southWest.equals(t.getSouthWest())&&this._northEast.equals(t.getNorthEast())):!1},isValid:function(){return!(!this._southWest||!this._northEast)}},o.latLngBounds=function(t,e){return!t||t instanceof o.LatLngBounds?t:new o.LatLngBounds(t,e)},o.Projection={},o.Projection.SphericalMercator={MAX_LATITUDE:85.0511287798,project:function(t){var e=o.LatLng.DEG_TO_RAD,i=this.MAX_LATITUDE,n=Math.max(Math.min(i,t.lat),-i),s=t.lng*e,a=n*e;return a=Math.log(Math.tan(Math.PI/4+a/2)),new o.Point(s,a)},unproject:function(t){var e=o.LatLng.RAD_TO_DEG,i=t.x*e,n=(2*Math.atan(Math.exp(t.y))-Math.PI/2)*e;return new o.LatLng(n,i)}},o.Projection.LonLat={project:function(t){return new o.Point(t.lng,t.lat)},unproject:function(t){return new o.LatLng(t.y,t.x)}},o.CRS={latLngToPoint:function(t,e){var i=this.projection.project(t),n=this.scale(e);return this.transformation._transform(i,n)},pointToLatLng:function(t,e){var i=this.scale(e),n=this.transformation.untransform(t,i);return this.projection.unproject(n)},project:function(t){return this.projection.project(t)},scale:function(t){return 256*Math.pow(2,t)},getSize:function(t){var e=this.scale(t);return o.point(e,e)}},o.CRS.Simple=o.extend({},o.CRS,{projection:o.Projection.LonLat,transformation:new o.Transformation(1,0,-1,0),scale:function(t){return Math.pow(2,t)}}),o.CRS.EPSG3857=o.extend({},o.CRS,{code:"EPSG:3857",projection:o.Projection.SphericalMercator,transformation:new o.Transformation(.5/Math.PI,.5,-.5/Math.PI,.5),project:function(t){var e=this.projection.project(t),i=6378137;return e.multiplyBy(i)}}),o.CRS.EPSG900913=o.extend({},o.CRS.EPSG3857,{code:"EPSG:900913"}),o.CRS.EPSG4326=o.extend({},o.CRS,{code:"EPSG:4326",projection:o.Projection.LonLat,transformation:new o.Transformation(1/360,.5,-1/360,.5)}),o.Map=o.Class.extend({includes:o.Mixin.Events,options:{crs:o.CRS.EPSG3857,fadeAnimation:o.DomUtil.TRANSITION&&!o.Browser.android23,trackResize:!0,markerZoomAnimation:o.DomUtil.TRANSITION&&o.Browser.any3d},initialize:function(t,e){e=o.setOptions(this,e),this._initContainer(t),this._initLayout(),this._onResize=o.bind(this._onResize,this),this._initEvents(),e.maxBounds&&this.setMaxBounds(e.maxBounds),e.center&&e.zoom!==i&&this.setView(o.latLng(e.center),e.zoom,{reset:!0}),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._tileLayersNum=0,this.callInitHooks(),this._addLayers(e.layers)},setView:function(t,e){return e=e===i?this.getZoom():e,this._resetView(o.latLng(t),this._limitZoom(e)),this},setZoom:function(t,e){return this._loaded?this.setView(this.getCenter(),t,{zoom:e}):(this._zoom=this._limitZoom(t),this)},zoomIn:function(t,e){return this.setZoom(this._zoom+(t||1),e)},zoomOut:function(t,e){return this.setZoom(this._zoom-(t||1),e)},setZoomAround:function(t,e,i){var n=this.getZoomScale(e),s=this.getSize().divideBy(2),a=t instanceof o.Point?t:this.latLngToContainerPoint(t),r=a.subtract(s).multiplyBy(1-1/n),h=this.containerPointToLatLng(s.add(r));return this.setView(h,e,{zoom:i})},fitBounds:function(t,e){e=e||{},t=t.getBounds?t.getBounds():o.latLngBounds(t);var i=o.point(e.paddingTopLeft||e.padding||[0,0]),n=o.point(e.paddingBottomRight||e.padding||[0,0]),s=this.getBoundsZoom(t,!1,i.add(n));s=e.maxZoom?Math.min(e.maxZoom,s):s;var a=n.subtract(i).divideBy(2),r=this.project(t.getSouthWest(),s),h=this.project(t.getNorthEast(),s),l=this.unproject(r.add(h).divideBy(2).add(a),s);return this.setView(l,s,e)},fitWorld:function(t){return this.fitBounds([[-90,-180],[90,180]],t)},panTo:function(t,e){return this.setView(t,this._zoom,{pan:e})},panBy:function(t){return this.fire("movestart"),this._rawPanBy(o.point(t)),this.fire("move"),this.fire("moveend")},setMaxBounds:function(t){return t=o.latLngBounds(t),this.options.maxBounds=t,t?(this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds,this)):this.off("moveend",this._panInsideMaxBounds,this)},panInsideBounds:function(t,e){var i=this.getCenter(),n=this._limitCenter(i,this._zoom,t);return i.equals(n)?this:this.panTo(n,e)},addLayer:function(t){var e=o.stamp(t);return this._layers[e]?this:(this._layers[e]=t,!t.options||isNaN(t.options.maxZoom)&&isNaN(t.options.minZoom)||(this._zoomBoundLayers[e]=t,this._updateZoomLevels()),this.options.zoomAnimation&&o.TileLayer&&t instanceof o.TileLayer&&(this._tileLayersNum++,this._tileLayersToLoad++,t.on("load",this._onTileLayerLoad,this)),this._loaded&&this._layerAdd(t),this)},removeLayer:function(t){var e=o.stamp(t);return this._layers[e]?(this._loaded&&t.onRemove(this),delete this._layers[e],this._loaded&&this.fire("layerremove",{layer:t}),this._zoomBoundLayers[e]&&(delete this._zoomBoundLayers[e],this._updateZoomLevels()),this.options.zoomAnimation&&o.TileLayer&&t instanceof o.TileLayer&&(this._tileLayersNum--,this._tileLayersToLoad--,t.off("load",this._onTileLayerLoad,this)),this):this},hasLayer:function(t){return t?o.stamp(t)in this._layers:!1},eachLayer:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},invalidateSize:function(t){if(!this._loaded)return this;t=o.extend({animate:!1,pan:!0},t===!0?{animate:!0}:t);var e=this.getSize();this._sizeChanged=!0,this._initialCenter=null;var i=this.getSize(),n=e.divideBy(2).round(),s=i.divideBy(2).round(),a=n.subtract(s);return a.x||a.y?(t.animate&&t.pan?this.panBy(a):(t.pan&&this._rawPanBy(a),this.fire("move"),t.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(o.bind(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:e,newSize:i})):this},addHandler:function(t,e){if(!e)return this;var i=this[t]=new e(this);return this._handlers.push(i),this.options[t]&&i.enable(),this},remove:function(){this._loaded&&this.fire("unload"),this._initEvents("off");try{delete this._container._leaflet}catch(t){this._container._leaflet=i}return this._clearPanes(),this._clearControlPos&&this._clearControlPos(),this._clearHandlers(),this},getCenter:function(){return this._checkIfLoaded(),this._initialCenter&&!this._moved()?this._initialCenter:this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var t=this.getPixelBounds(),e=this.unproject(t.getBottomLeft()),i=this.unproject(t.getTopRight());return new o.LatLngBounds(e,i)},getMinZoom:function(){return this.options.minZoom===i?this._layersMinZoom===i?0:this._layersMinZoom:this.options.minZoom},getMaxZoom:function(){return this.options.maxZoom===i?this._layersMaxZoom===i?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(t,e,i){t=o.latLngBounds(t);var n,s=this.getMinZoom()-(e?1:0),a=this.getMaxZoom(),r=this.getSize(),h=t.getNorthWest(),l=t.getSouthEast(),u=!0;i=o.point(i||[0,0]);do s++,n=this.project(l,s).subtract(this.project(h,s)).add(i),u=e?n.x<r.x||n.y<r.y:r.contains(n);while(u&&a>=s);return u&&e?null:e?s:s-1},getSize:function(){return(!this._size||this._sizeChanged)&&(this._size=new o.Point(this._container.clientWidth,this._container.clientHeight),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(){var t=this._getTopLeftPoint();return new o.Bounds(t,t.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._initialTopLeftPoint},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(t){var e=this.options.crs;return e.scale(t)/e.scale(this._zoom)},getScaleZoom:function(t){return this._zoom+Math.log(t)/Math.LN2},project:function(t,e){return e=e===i?this._zoom:e,this.options.crs.latLngToPoint(o.latLng(t),e)},unproject:function(t,e){return e=e===i?this._zoom:e,this.options.crs.pointToLatLng(o.point(t),e)},layerPointToLatLng:function(t){var e=o.point(t).add(this.getPixelOrigin());return this.unproject(e)},latLngToLayerPoint:function(t){var e=this.project(o.latLng(t))._round();return e._subtract(this.getPixelOrigin())},containerPointToLayerPoint:function(t){return o.point(t).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(t){return o.point(t).add(this._getMapPanePos())},containerPointToLatLng:function(t){var e=this.containerPointToLayerPoint(o.point(t));return this.layerPointToLatLng(e)},latLngToContainerPoint:function(t){return this.layerPointToContainerPoint(this.latLngToLayerPoint(o.latLng(t)))},mouseEventToContainerPoint:function(t){return o.DomEvent.getMousePosition(t,this._container)},mouseEventToLayerPoint:function(t){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t))},mouseEventToLatLng:function(t){return this.layerPointToLatLng(this.mouseEventToLayerPoint(t))},_initContainer:function(t){var e=this._container=o.DomUtil.get(t);if(!e)throw new Error("Map container not found.");if(e._leaflet)throw new Error("Map container is already initialized.");e._leaflet=!0},_initLayout:function(){var t=this._container;o.DomUtil.addClass(t,"leaflet-container"+(o.Browser.touch?" leaflet-touch":"")+(o.Browser.retina?" leaflet-retina":"")+(o.Browser.ielt9?" leaflet-oldie":"")+(this.options.fadeAnimation?" leaflet-fade-anim":""));var e=o.DomUtil.getStyle(t,"position");"absolute"!==e&&"relative"!==e&&"fixed"!==e&&(t.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var t=this._panes={};this._mapPane=t.mapPane=this._createPane("leaflet-map-pane",this._container),this._tilePane=t.tilePane=this._createPane("leaflet-tile-pane",this._mapPane),t.objectsPane=this._createPane("leaflet-objects-pane",this._mapPane),t.shadowPane=this._createPane("leaflet-shadow-pane"),t.overlayPane=this._createPane("leaflet-overlay-pane"),t.markerPane=this._createPane("leaflet-marker-pane"),t.popupPane=this._createPane("leaflet-popup-pane");var e=" leaflet-zoom-hide";this.options.markerZoomAnimation||(o.DomUtil.addClass(t.markerPane,e),o.DomUtil.addClass(t.shadowPane,e),o.DomUtil.addClass(t.popupPane,e))},_createPane:function(t,e){return o.DomUtil.create("div",t,e||this._panes.objectsPane)},_clearPanes:function(){this._container.removeChild(this._mapPane)},_addLayers:function(t){t=t?o.Util.isArray(t)?t:[t]:[];for(var e=0,i=t.length;i>e;e++)this.addLayer(t[e])},_resetView:function(t,e,i,n){var s=this._zoom!==e;n||(this.fire("movestart"),s&&this.fire("zoomstart")),this._zoom=e,this._initialCenter=t,this._initialTopLeftPoint=this._getNewTopLeftPoint(t),i?this._initialTopLeftPoint._add(this._getMapPanePos()):o.DomUtil.setPosition(this._mapPane,new o.Point(0,0)),this._tileLayersToLoad=this._tileLayersNum;var a=!this._loaded;this._loaded=!0,this.fire("viewreset",{hard:!i}),a&&(this.fire("load"),this.eachLayer(this._layerAdd,this)),this.fire("move"),(s||n)&&this.fire("zoomend"),this.fire("moveend",{hard:!i})},_rawPanBy:function(t){o.DomUtil.setPosition(this._mapPane,this._getMapPanePos().subtract(t))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_updateZoomLevels:function(){var t,e=1/0,n=-(1/0),o=this._getZoomSpan();for(t in this._zoomBoundLayers){var s=this._zoomBoundLayers[t];isNaN(s.options.minZoom)||(e=Math.min(e,s.options.minZoom)),isNaN(s.options.maxZoom)||(n=Math.max(n,s.options.maxZoom))}t===i?this._layersMaxZoom=this._layersMinZoom=i:(this._layersMaxZoom=n,this._layersMinZoom=e),o!==this._getZoomSpan()&&this.fire("zoomlevelschange")},_panInsideMaxBounds:function(){this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(e){if(o.DomEvent){e=e||"on",o.DomEvent[e](this._container,"click",this._onMouseClick,this);var i,n,s=["dblclick","mousedown","mouseup","mouseenter","mouseleave","mousemove","contextmenu"];for(i=0,n=s.length;n>i;i++)o.DomEvent[e](this._container,s[i],this._fireMouseEvent,this);this.options.trackResize&&o.DomEvent[e](t,"resize",this._onResize,this)}},_onResize:function(){o.Util.cancelAnimFrame(this._resizeRequest),this._resizeRequest=o.Util.requestAnimFrame(function(){this.invalidateSize({debounceMoveend:!0})},this,!1,this._container)},_onMouseClick:function(t){!this._loaded||!t._simulated&&(this.dragging&&this.dragging.moved()||this.boxZoom&&this.boxZoom.moved())||o.DomEvent._skipped(t)||(this.fire("preclick"),this._fireMouseEvent(t))},_fireMouseEvent:function(t){if(this._loaded&&!o.DomEvent._skipped(t)){var e=t.type;if(e="mouseenter"===e?"mouseover":"mouseleave"===e?"mouseout":e,this.hasEventListeners(e)){"contextmenu"===e&&o.DomEvent.preventDefault(t);var i=this.mouseEventToContainerPoint(t),n=this.containerPointToLayerPoint(i),s=this.layerPointToLatLng(n);this.fire(e,{latlng:s,layerPoint:n,containerPoint:i,originalEvent:t})}}},_onTileLayerLoad:function(){this._tileLayersToLoad--,this._tileLayersNum&&!this._tileLayersToLoad&&this.fire("tilelayersload")},_clearHandlers:function(){for(var t=0,e=this._handlers.length;e>t;t++)this._handlers[t].disable()},whenReady:function(t,e){return this._loaded?t.call(e||this,this):this.on("load",t,e),this},_layerAdd:function(t){t.onAdd(this),this.fire("layeradd",{layer:t})},_getMapPanePos:function(){return o.DomUtil.getPosition(this._mapPane)},_moved:function(){var t=this._getMapPanePos();return t&&!t.equals([0,0])},_getTopLeftPoint:function(){return this.getPixelOrigin().subtract(this._getMapPanePos())},_getNewTopLeftPoint:function(t,e){var i=this.getSize()._divideBy(2);return this.project(t,e)._subtract(i)._round()},_latLngToNewLayerPoint:function(t,e,i){var n=this._getNewTopLeftPoint(i,e).add(this._getMapPanePos());return this.project(t,e)._subtract(n)},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(t){return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint())},_limitCenter:function(t,e,i){if(!i)return t;var n=this.project(t,e),s=this.getSize().divideBy(2),a=new o.Bounds(n.subtract(s),n.add(s)),r=this._getBoundsOffset(a,i,e);return this.unproject(n.add(r),e)},_limitOffset:function(t,e){if(!e)return t;var i=this.getPixelBounds(),n=new o.Bounds(i.min.add(t),i.max.add(t));return t.add(this._getBoundsOffset(n,e))},_getBoundsOffset:function(t,e,i){var n=this.project(e.getNorthWest(),i).subtract(t.min),s=this.project(e.getSouthEast(),i).subtract(t.max),a=this._rebound(n.x,-s.x),r=this._rebound(n.y,-s.y);return new o.Point(a,r)},_rebound:function(t,e){return t+e>0?Math.round(t-e)/2:Math.max(0,Math.ceil(t))-Math.max(0,Math.floor(e))},_limitZoom:function(t){var e=this.getMinZoom(),i=this.getMaxZoom();return Math.max(e,Math.min(i,t))}}),o.map=function(t,e){return new o.Map(t,e)},o.Projection.Mercator={MAX_LATITUDE:85.0840591556,R_MINOR:6356752.314245179,R_MAJOR:6378137,project:function(t){var e=o.LatLng.DEG_TO_RAD,i=this.MAX_LATITUDE,n=Math.max(Math.min(i,t.lat),-i),s=this.R_MAJOR,a=this.R_MINOR,r=t.lng*e*s,h=n*e,l=a/s,u=Math.sqrt(1-l*l),c=u*Math.sin(h);c=Math.pow((1-c)/(1+c),.5*u);var d=Math.tan(.5*(.5*Math.PI-h))/c;return h=-s*Math.log(d),new o.Point(r,h)},unproject:function(t){for(var e,i=o.LatLng.RAD_TO_DEG,n=this.R_MAJOR,s=this.R_MINOR,a=t.x*i/n,r=s/n,h=Math.sqrt(1-r*r),l=Math.exp(-t.y/n),u=Math.PI/2-2*Math.atan(l),c=15,d=1e-7,p=c,_=.1;Math.abs(_)>d&&--p>0;)e=h*Math.sin(u),_=Math.PI/2-2*Math.atan(l*Math.pow((1-e)/(1+e),.5*h))-u,u+=_;return new o.LatLng(u*i,a)}},o.CRS.EPSG3395=o.extend({},o.CRS,{code:"EPSG:3395",projection:o.Projection.Mercator,
transformation:function(){var t=o.Projection.Mercator,e=t.R_MAJOR,i=.5/(Math.PI*e);return new o.Transformation(i,.5,-i,.5)}()}),o.TileLayer=o.Class.extend({includes:o.Mixin.Events,options:{minZoom:0,maxZoom:18,tileSize:256,subdomains:"abc",errorTileUrl:"",attribution:"",zoomOffset:0,opacity:1,unloadInvisibleTiles:o.Browser.mobile,updateWhenIdle:o.Browser.mobile},initialize:function(t,e){e=o.setOptions(this,e),e.detectRetina&&o.Browser.retina&&e.maxZoom>0&&(e.tileSize=Math.floor(e.tileSize/2),e.zoomOffset++,e.minZoom>0&&e.minZoom--,this.options.maxZoom--),e.bounds&&(e.bounds=o.latLngBounds(e.bounds)),this._url=t;var i=this.options.subdomains;"string"==typeof i&&(this.options.subdomains=i.split(""))},onAdd:function(t){this._map=t,this._animated=t._zoomAnimated,this._initContainer(),t.on({viewreset:this._reset,moveend:this._update},this),this._animated&&t.on({zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this),this.options.updateWhenIdle||(this._limitedUpdate=o.Util.limitExecByInterval(this._update,150,this),t.on("move",this._limitedUpdate,this)),this._reset(),this._update()},addTo:function(t){return t.addLayer(this),this},onRemove:function(t){this._container.parentNode.removeChild(this._container),t.off({viewreset:this._reset,moveend:this._update},this),this._animated&&t.off({zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this),this.options.updateWhenIdle||t.off("move",this._limitedUpdate,this),this._container=null,this._map=null},bringToFront:function(){var t=this._map._panes.tilePane;return this._container&&(t.appendChild(this._container),this._setAutoZIndex(t,Math.max)),this},bringToBack:function(){var t=this._map._panes.tilePane;return this._container&&(t.insertBefore(this._container,t.firstChild),this._setAutoZIndex(t,Math.min)),this},getAttribution:function(){return this.options.attribution},getContainer:function(){return this._container},setOpacity:function(t){return this.options.opacity=t,this._map&&this._updateOpacity(),this},setZIndex:function(t){return this.options.zIndex=t,this._updateZIndex(),this},setUrl:function(t,e){return this._url=t,e||this.redraw(),this},redraw:function(){return this._map&&(this._reset({hard:!0}),this._update()),this},_updateZIndex:function(){this._container&&this.options.zIndex!==i&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(t,e){var i,n,o,s=t.children,a=-e(1/0,-(1/0));for(n=0,o=s.length;o>n;n++)s[n]!==this._container&&(i=parseInt(s[n].style.zIndex,10),isNaN(i)||(a=e(a,i)));this.options.zIndex=this._container.style.zIndex=(isFinite(a)?a:0)+e(1,-1)},_updateOpacity:function(){var t,e=this._tiles;if(o.Browser.ielt9)for(t in e)o.DomUtil.setOpacity(e[t],this.options.opacity);else o.DomUtil.setOpacity(this._container,this.options.opacity)},_initContainer:function(){var t=this._map._panes.tilePane;if(!this._container){if(this._container=o.DomUtil.create("div","leaflet-layer"),this._updateZIndex(),this._animated){var e="leaflet-tile-container";this._bgBuffer=o.DomUtil.create("div",e,this._container),this._tileContainer=o.DomUtil.create("div",e,this._container)}else this._tileContainer=this._container;t.appendChild(this._container),this.options.opacity<1&&this._updateOpacity()}},_reset:function(t){for(var e in this._tiles)this.fire("tileunload",{tile:this._tiles[e]});this._tiles={},this._tilesToLoad=0,this.options.reuseTiles&&(this._unusedTiles=[]),this._tileContainer.innerHTML="",this._animated&&t&&t.hard&&this._clearBgBuffer(),this._initContainer()},_getTileSize:function(){var t=this._map,e=t.getZoom()+this.options.zoomOffset,i=this.options.maxNativeZoom,n=this.options.tileSize;return i&&e>i&&(n=Math.round(t.getZoomScale(e)/t.getZoomScale(i)*n)),n},_update:function(){if(this._map){var t=this._map,e=t.getPixelBounds(),i=t.getZoom(),n=this._getTileSize();if(!(i>this.options.maxZoom||i<this.options.minZoom)){var s=o.bounds(e.min.divideBy(n)._floor(),e.max.divideBy(n)._floor());this._addTilesFromCenterOut(s),(this.options.unloadInvisibleTiles||this.options.reuseTiles)&&this._removeOtherTiles(s)}}},_addTilesFromCenterOut:function(t){var i,n,s,a=[],r=t.getCenter();for(i=t.min.y;i<=t.max.y;i++)for(n=t.min.x;n<=t.max.x;n++)s=new o.Point(n,i),this._tileShouldBeLoaded(s)&&a.push(s);var h=a.length;if(0!==h){a.sort(function(t,e){return t.distanceTo(r)-e.distanceTo(r)});var l=e.createDocumentFragment();for(this._tilesToLoad||this.fire("loading"),this._tilesToLoad+=h,n=0;h>n;n++)this._addTile(a[n],l);this._tileContainer.appendChild(l)}},_tileShouldBeLoaded:function(t){if(t.x+":"+t.y in this._tiles)return!1;var e=this.options;if(!e.continuousWorld){var i=this._getWrapTileNum();if(e.noWrap&&(t.x<0||t.x>=i.x)||t.y<0||t.y>=i.y)return!1}if(e.bounds){var n=this._getTileSize(),o=t.multiplyBy(n),s=o.add([n,n]),a=this._map.unproject(o),r=this._map.unproject(s);if(e.continuousWorld||e.noWrap||(a=a.wrap(),r=r.wrap()),!e.bounds.intersects([a,r]))return!1}return!0},_removeOtherTiles:function(t){var e,i,n,o;for(o in this._tiles)e=o.split(":"),i=parseInt(e[0],10),n=parseInt(e[1],10),(i<t.min.x||i>t.max.x||n<t.min.y||n>t.max.y)&&this._removeTile(o)},_removeTile:function(t){var e=this._tiles[t];this.fire("tileunload",{tile:e,url:e.src}),this.options.reuseTiles?(o.DomUtil.removeClass(e,"leaflet-tile-loaded"),this._unusedTiles.push(e)):e.parentNode===this._tileContainer&&this._tileContainer.removeChild(e),o.Browser.android||(e.onload=null,e.src=o.Util.emptyImageUrl),delete this._tiles[t]},_addTile:function(t,e){var i=this._getTilePos(t),n=this._getTile();o.DomUtil.setPosition(n,i,o.Browser.chrome),this._tiles[t.x+":"+t.y]=n,this._loadTile(n,t),n.parentNode!==this._tileContainer&&e.appendChild(n)},_getZoomForUrl:function(){var t=this.options,e=this._map.getZoom();return t.zoomReverse&&(e=t.maxZoom-e),e+=t.zoomOffset,t.maxNativeZoom?Math.min(e,t.maxNativeZoom):e},_getTilePos:function(t){var e=this._map.getPixelOrigin(),i=this._getTileSize();return t.multiplyBy(i).subtract(e)},getTileUrl:function(t){return o.Util.template(this._url,o.extend({s:this._getSubdomain(t),z:t.z,x:t.x,y:t.y},this.options))},_getWrapTileNum:function(){var t=this._map.options.crs,e=t.getSize(this._map.getZoom());return e.divideBy(this._getTileSize())._floor()},_adjustTilePoint:function(t){var e=this._getWrapTileNum();this.options.continuousWorld||this.options.noWrap||(t.x=(t.x%e.x+e.x)%e.x),this.options.tms&&(t.y=e.y-t.y-1),t.z=this._getZoomForUrl()},_getSubdomain:function(t){var e=Math.abs(t.x+t.y)%this.options.subdomains.length;return this.options.subdomains[e]},_getTile:function(){if(this.options.reuseTiles&&this._unusedTiles.length>0){var t=this._unusedTiles.pop();return this._resetTile(t),t}return this._createTile()},_resetTile:function(){},_createTile:function(){var t=o.DomUtil.create("img","leaflet-tile");return t.style.width=t.style.height=this._getTileSize()+"px",t.galleryimg="no",t.onselectstart=t.onmousemove=o.Util.falseFn,o.Browser.ielt9&&this.options.opacity!==i&&o.DomUtil.setOpacity(t,this.options.opacity),o.Browser.mobileWebkit3d&&(t.style.WebkitBackfaceVisibility="hidden"),t},_loadTile:function(t,e){t._layer=this,t.onload=this._tileOnLoad,t.onerror=this._tileOnError,this._adjustTilePoint(e),t.src=this.getTileUrl(e),this.fire("tileloadstart",{tile:t,url:t.src})},_tileLoaded:function(){this._tilesToLoad--,this._animated&&o.DomUtil.addClass(this._tileContainer,"leaflet-zoom-animated"),this._tilesToLoad||(this.fire("load"),this._animated&&(clearTimeout(this._clearBgBufferTimer),this._clearBgBufferTimer=setTimeout(o.bind(this._clearBgBuffer,this),500)))},_tileOnLoad:function(){var t=this._layer;this.src!==o.Util.emptyImageUrl&&(o.DomUtil.addClass(this,"leaflet-tile-loaded"),t.fire("tileload",{tile:this,url:this.src})),t._tileLoaded()},_tileOnError:function(){var t=this._layer;t.fire("tileerror",{tile:this,url:this.src});var e=t.options.errorTileUrl;e&&(this.src=e),t._tileLoaded()}}),o.tileLayer=function(t,e){return new o.TileLayer(t,e)},o.TileLayer.WMS=o.TileLayer.extend({defaultWmsParams:{service:"WMS",request:"GetMap",version:"1.1.1",layers:"",styles:"",format:"image/jpeg",transparent:!1},initialize:function(t,e){this._url=t;var i=o.extend({},this.defaultWmsParams),n=e.tileSize||this.options.tileSize;e.detectRetina&&o.Browser.retina?i.width=i.height=2*n:i.width=i.height=n;for(var s in e)this.options.hasOwnProperty(s)||"crs"===s||(i[s]=e[s]);this.wmsParams=i,o.setOptions(this,e)},onAdd:function(t){this._crs=this.options.crs||t.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var e=this._wmsVersion>=1.3?"crs":"srs";this.wmsParams[e]=this._crs.code,o.TileLayer.prototype.onAdd.call(this,t)},getTileUrl:function(t){var e=this._map,i=this.options.tileSize,n=t.multiplyBy(i),s=n.add([i,i]),a=this._crs.project(e.unproject(n,t.z)),r=this._crs.project(e.unproject(s,t.z)),h=this._wmsVersion>=1.3&&this._crs===o.CRS.EPSG4326?[r.y,a.x,a.y,r.x].join(","):[a.x,r.y,r.x,a.y].join(","),l=o.Util.template(this._url,{s:this._getSubdomain(t)});return l+o.Util.getParamString(this.wmsParams,l,!0)+"&BBOX="+h},setParams:function(t,e){return o.extend(this.wmsParams,t),e||this.redraw(),this}}),o.tileLayer.wms=function(t,e){return new o.TileLayer.WMS(t,e)},o.TileLayer.Canvas=o.TileLayer.extend({options:{async:!1},initialize:function(t){o.setOptions(this,t)},redraw:function(){this._map&&(this._reset({hard:!0}),this._update());for(var t in this._tiles)this._redrawTile(this._tiles[t]);return this},_redrawTile:function(t){this.drawTile(t,t._tilePoint,this._map._zoom)},_createTile:function(){var t=o.DomUtil.create("canvas","leaflet-tile");return t.width=t.height=this.options.tileSize,t.onselectstart=t.onmousemove=o.Util.falseFn,t},_loadTile:function(t,e){t._layer=this,t._tilePoint=e,this._redrawTile(t),this.options.async||this.tileDrawn(t)},drawTile:function(){},tileDrawn:function(t){this._tileOnLoad.call(t)}}),o.tileLayer.canvas=function(t){return new o.TileLayer.Canvas(t)},o.ImageOverlay=o.Class.extend({includes:o.Mixin.Events,options:{opacity:1},initialize:function(t,e,i){this._url=t,this._bounds=o.latLngBounds(e),o.setOptions(this,i)},onAdd:function(t){this._map=t,this._image||this._initImage(),t._panes.overlayPane.appendChild(this._image),t.on("viewreset",this._reset,this),t.options.zoomAnimation&&o.Browser.any3d&&t.on("zoomanim",this._animateZoom,this),this._reset()},onRemove:function(t){t.getPanes().overlayPane.removeChild(this._image),t.off("viewreset",this._reset,this),t.options.zoomAnimation&&t.off("zoomanim",this._animateZoom,this)},addTo:function(t){return t.addLayer(this),this},setOpacity:function(t){return this.options.opacity=t,this._updateOpacity(),this},bringToFront:function(){return this._image&&this._map._panes.overlayPane.appendChild(this._image),this},bringToBack:function(){var t=this._map._panes.overlayPane;return this._image&&t.insertBefore(this._image,t.firstChild),this},setUrl:function(t){this._url=t,this._image.src=this._url},getAttribution:function(){return this.options.attribution},_initImage:function(){this._image=o.DomUtil.create("img","leaflet-image-layer"),this._map.options.zoomAnimation&&o.Browser.any3d?o.DomUtil.addClass(this._image,"leaflet-zoom-animated"):o.DomUtil.addClass(this._image,"leaflet-zoom-hide"),this._updateOpacity(),o.extend(this._image,{galleryimg:"no",onselectstart:o.Util.falseFn,onmousemove:o.Util.falseFn,onload:o.bind(this._onImageLoad,this),src:this._url})},_animateZoom:function(t){var e=this._map,i=this._image,n=e.getZoomScale(t.zoom),s=this._bounds.getNorthWest(),a=this._bounds.getSouthEast(),r=e._latLngToNewLayerPoint(s,t.zoom,t.center),h=e._latLngToNewLayerPoint(a,t.zoom,t.center)._subtract(r),l=r._add(h._multiplyBy(.5*(1-1/n)));i.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(l)+" scale("+n+") "},_reset:function(){var t=this._image,e=this._map.latLngToLayerPoint(this._bounds.getNorthWest()),i=this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(e);o.DomUtil.setPosition(t,e),t.style.width=i.x+"px",t.style.height=i.y+"px"},_onImageLoad:function(){this.fire("load")},_updateOpacity:function(){o.DomUtil.setOpacity(this._image,this.options.opacity)}}),o.imageOverlay=function(t,e,i){return new o.ImageOverlay(t,e,i)},o.Icon=o.Class.extend({options:{className:""},initialize:function(t){o.setOptions(this,t)},createIcon:function(t){return this._createIcon("icon",t)},createShadow:function(t){return this._createIcon("shadow",t)},_createIcon:function(t,e){var i=this._getIconUrl(t);if(!i){if("icon"===t)throw new Error("iconUrl not set in Icon options (see the docs).");return null}var n;return n=e&&"IMG"===e.tagName?this._createImg(i,e):this._createImg(i),this._setIconStyles(n,t),n},_setIconStyles:function(t,e){var i,n=this.options,s=o.point(n[e+"Size"]);i="shadow"===e?o.point(n.shadowAnchor||n.iconAnchor):o.point(n.iconAnchor),!i&&s&&(i=s.divideBy(2,!0)),t.className="leaflet-marker-"+e+" "+n.className,i&&(t.style.marginLeft=-i.x+"px",t.style.marginTop=-i.y+"px"),s&&(t.style.width=s.x+"px",t.style.height=s.y+"px")},_createImg:function(t,i){return i=i||e.createElement("img"),i.src=t,i},_getIconUrl:function(t){return o.Browser.retina&&this.options[t+"RetinaUrl"]?this.options[t+"RetinaUrl"]:this.options[t+"Url"]}}),o.icon=function(t){return new o.Icon(t)},o.Icon.Default=o.Icon.extend({options:{iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]},_getIconUrl:function(t){var e=t+"Url";if(this.options[e])return this.options[e];o.Browser.retina&&"icon"===t&&(t+="-2x");var i=o.Icon.Default.imagePath;if(!i)throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");return i+"/marker-"+t+".png"}}),o.Icon.Default.imagePath=function(){var t,i,n,o,s,a=e.getElementsByTagName("script"),r=/[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;for(t=0,i=a.length;i>t;t++)if(n=a[t].src,o=n.match(r))return s=n.split(r)[0],(s?s+"/":"")+"images"}(),o.Marker=o.Class.extend({includes:o.Mixin.Events,options:{icon:new o.Icon.Default,title:"",alt:"",clickable:!0,draggable:!1,keyboard:!0,zIndexOffset:0,opacity:1,riseOnHover:!1,riseOffset:250},initialize:function(t,e){o.setOptions(this,e),this._latlng=o.latLng(t)},onAdd:function(t){this._map=t,t.on("viewreset",this.update,this),this._initIcon(),this.update(),this.fire("add"),t.options.zoomAnimation&&t.options.markerZoomAnimation&&t.on("zoomanim",this._animateZoom,this)},addTo:function(t){return t.addLayer(this),this},onRemove:function(t){this.dragging&&this.dragging.disable(),this._removeIcon(),this._removeShadow(),this.fire("remove"),t.off({viewreset:this.update,zoomanim:this._animateZoom},this),this._map=null},getLatLng:function(){return this._latlng},setLatLng:function(t){return this._latlng=o.latLng(t),this.update(),this.fire("move",{latlng:this._latlng})},setZIndexOffset:function(t){return this.options.zIndexOffset=t,this.update(),this},setIcon:function(t){return this.options.icon=t,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup),this},update:function(){return this._icon&&this._setPos(this._map.latLngToLayerPoint(this._latlng).round()),this},_initIcon:function(){var t=this.options,e=this._map,i=e.options.zoomAnimation&&e.options.markerZoomAnimation,n=i?"leaflet-zoom-animated":"leaflet-zoom-hide",s=t.icon.createIcon(this._icon),a=!1;s!==this._icon&&(this._icon&&this._removeIcon(),a=!0,t.title&&(s.title=t.title),t.alt&&(s.alt=t.alt)),o.DomUtil.addClass(s,n),t.keyboard&&(s.tabIndex="0"),this._icon=s,this._initInteraction(),t.riseOnHover&&o.DomEvent.on(s,"mouseover",this._bringToFront,this).on(s,"mouseout",this._resetZIndex,this);var r=t.icon.createShadow(this._shadow),h=!1;r!==this._shadow&&(this._removeShadow(),h=!0),r&&o.DomUtil.addClass(r,n),this._shadow=r,t.opacity<1&&this._updateOpacity();var l=this._map._panes;a&&l.markerPane.appendChild(this._icon),r&&h&&l.shadowPane.appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&o.DomEvent.off(this._icon,"mouseover",this._bringToFront).off(this._icon,"mouseout",this._resetZIndex),this._map._panes.markerPane.removeChild(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&this._map._panes.shadowPane.removeChild(this._shadow),this._shadow=null},_setPos:function(t){o.DomUtil.setPosition(this._icon,t),this._shadow&&o.DomUtil.setPosition(this._shadow,t),this._zIndex=t.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(t){this._icon.style.zIndex=this._zIndex+t},_animateZoom:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPos(e)},_initInteraction:function(){if(this.options.clickable){var t=this._icon,e=["dblclick","mousedown","mouseover","mouseout","contextmenu"];o.DomUtil.addClass(t,"leaflet-clickable"),o.DomEvent.on(t,"click",this._onMouseClick,this),o.DomEvent.on(t,"keypress",this._onKeyPress,this);for(var i=0;i<e.length;i++)o.DomEvent.on(t,e[i],this._fireMouseEvent,this);o.Handler.MarkerDrag&&(this.dragging=new o.Handler.MarkerDrag(this),this.options.draggable&&this.dragging.enable())}},_onMouseClick:function(t){var e=this.dragging&&this.dragging.moved();(this.hasEventListeners(t.type)||e)&&o.DomEvent.stopPropagation(t),e||(this.dragging&&this.dragging._enabled||!this._map.dragging||!this._map.dragging.moved())&&this.fire(t.type,{originalEvent:t,latlng:this._latlng})},_onKeyPress:function(t){13===t.keyCode&&this.fire("click",{originalEvent:t,latlng:this._latlng})},_fireMouseEvent:function(t){this.fire(t.type,{originalEvent:t,latlng:this._latlng}),"contextmenu"===t.type&&this.hasEventListeners(t.type)&&o.DomEvent.preventDefault(t),"mousedown"!==t.type?o.DomEvent.stopPropagation(t):o.DomEvent.preventDefault(t)},setOpacity:function(t){return this.options.opacity=t,this._map&&this._updateOpacity(),this},_updateOpacity:function(){o.DomUtil.setOpacity(this._icon,this.options.opacity),this._shadow&&o.DomUtil.setOpacity(this._shadow,this.options.opacity)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)}}),o.marker=function(t,e){return new o.Marker(t,e)},o.DivIcon=o.Icon.extend({options:{iconSize:[12,12],className:"leaflet-div-icon",html:!1},createIcon:function(t){var i=t&&"DIV"===t.tagName?t:e.createElement("div"),n=this.options;return n.html!==!1?i.innerHTML=n.html:i.innerHTML="",n.bgPos&&(i.style.backgroundPosition=-n.bgPos.x+"px "+-n.bgPos.y+"px"),this._setIconStyles(i,"icon"),i},createShadow:function(){return null}}),o.divIcon=function(t){return new o.DivIcon(t)},o.Map.mergeOptions({closePopupOnClick:!0}),o.Popup=o.Class.extend({includes:o.Mixin.Events,options:{minWidth:50,maxWidth:300,autoPan:!0,closeButton:!0,offset:[0,7],autoPanPadding:[5,5],keepInView:!1,className:"",zoomAnimation:!0},initialize:function(t,e){o.setOptions(this,t),this._source=e,this._animated=o.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(t){this._map=t,this._container||this._initLayout();var e=t.options.fadeAnimation;e&&o.DomUtil.setOpacity(this._container,0),t._panes.popupPane.appendChild(this._container),t.on(this._getEvents(),this),this.update(),e&&o.DomUtil.setOpacity(this._container,1),this.fire("open"),t.fire("popupopen",{popup:this}),this._source&&this._source.fire("popupopen",{popup:this})},addTo:function(t){return t.addLayer(this),this},openOn:function(t){return t.openPopup(this),this},onRemove:function(t){t._panes.popupPane.removeChild(this._container),o.Util.falseFn(this._container.offsetWidth),t.off(this._getEvents(),this),t.options.fadeAnimation&&o.DomUtil.setOpacity(this._container,0),this._map=null,this.fire("close"),t.fire("popupclose",{popup:this}),this._source&&this._source.fire("popupclose",{popup:this})},getLatLng:function(){return this._latlng},setLatLng:function(t){return this._latlng=o.latLng(t),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(t){return this._content=t,this.update(),this},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},_getEvents:function(){var t={viewreset:this._updatePosition};return this._animated&&(t.zoomanim=this._zoomAnimation),("closeOnClick"in this.options?this.options.closeOnClick:this._map.options.closePopupOnClick)&&(t.preclick=this._close),this.options.keepInView&&(t.moveend=this._adjustPan),t},_close:function(){this._map&&this._map.closePopup(this)},_initLayout:function(){var t,e="leaflet-popup",i=e+" "+this.options.className+" leaflet-zoom-"+(this._animated?"animated":"hide"),n=this._container=o.DomUtil.create("div",i);this.options.closeButton&&(t=this._closeButton=o.DomUtil.create("a",e+"-close-button",n),t.href="#close",t.innerHTML="&#215;",o.DomEvent.disableClickPropagation(t),o.DomEvent.on(t,"click",this._onCloseButtonClick,this));var s=this._wrapper=o.DomUtil.create("div",e+"-content-wrapper",n);o.DomEvent.disableClickPropagation(s),this._contentNode=o.DomUtil.create("div",e+"-content",s),o.DomEvent.disableScrollPropagation(this._contentNode),o.DomEvent.on(s,"contextmenu",o.DomEvent.stopPropagation),this._tipContainer=o.DomUtil.create("div",e+"-tip-container",n),this._tip=o.DomUtil.create("div",e+"-tip",this._tipContainer)},_updateContent:function(){if(this._content){if("string"==typeof this._content)this._contentNode.innerHTML=this._content;else{for(;this._contentNode.hasChildNodes();)this._contentNode.removeChild(this._contentNode.firstChild);this._contentNode.appendChild(this._content)}this.fire("contentupdate")}},_updateLayout:function(){var t=this._contentNode,e=t.style;e.width="",e.whiteSpace="nowrap";var i=t.offsetWidth;i=Math.min(i,this.options.maxWidth),i=Math.max(i,this.options.minWidth),e.width=i+1+"px",e.whiteSpace="",e.height="";var n=t.offsetHeight,s=this.options.maxHeight,a="leaflet-popup-scrolled";s&&n>s?(e.height=s+"px",o.DomUtil.addClass(t,a)):o.DomUtil.removeClass(t,a),this._containerWidth=this._container.offsetWidth},_updatePosition:function(){if(this._map){var t=this._map.latLngToLayerPoint(this._latlng),e=this._animated,i=o.point(this.options.offset);e&&o.DomUtil.setPosition(this._container,t),this._containerBottom=-i.y-(e?0:t.y),this._containerLeft=-Math.round(this._containerWidth/2)+i.x+(e?0:t.x),this._container.style.bottom=this._containerBottom+"px",this._container.style.left=this._containerLeft+"px"}},_zoomAnimation:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center);o.DomUtil.setPosition(this._container,e)},_adjustPan:function(){if(this.options.autoPan){var t=this._map,e=this._container.offsetHeight,i=this._containerWidth,n=new o.Point(this._containerLeft,-e-this._containerBottom);this._animated&&n._add(o.DomUtil.getPosition(this._container));var s=t.layerPointToContainerPoint(n),a=o.point(this.options.autoPanPadding),r=o.point(this.options.autoPanPaddingTopLeft||a),h=o.point(this.options.autoPanPaddingBottomRight||a),l=t.getSize(),u=0,c=0;s.x+i+h.x>l.x&&(u=s.x+i-l.x+h.x),s.x-u-r.x<0&&(u=s.x-r.x),s.y+e+h.y>l.y&&(c=s.y+e-l.y+h.y),s.y-c-r.y<0&&(c=s.y-r.y),(u||c)&&t.fire("autopanstart").panBy([u,c])}},_onCloseButtonClick:function(t){this._close(),o.DomEvent.stop(t)}}),o.popup=function(t,e){return new o.Popup(t,e)},o.Map.include({openPopup:function(t,e,i){if(this.closePopup(),!(t instanceof o.Popup)){var n=t;t=new o.Popup(i).setLatLng(e).setContent(n)}return t._isOpen=!0,this._popup=t,this.addLayer(t)},closePopup:function(t){return t&&t!==this._popup||(t=this._popup,this._popup=null),t&&(this.removeLayer(t),t._isOpen=!1),this}}),o.Marker.include({openPopup:function(){return this._popup&&this._map&&!this._map.hasLayer(this._popup)&&(this._popup.setLatLng(this._latlng),this._map.openPopup(this._popup)),this},closePopup:function(){return this._popup&&this._popup._close(),this},togglePopup:function(){return this._popup&&(this._popup._isOpen?this.closePopup():this.openPopup()),this},bindPopup:function(t,e){var i=o.point(this.options.icon.options.popupAnchor||[0,0]);return i=i.add(o.Popup.prototype.options.offset),e&&e.offset&&(i=i.add(e.offset)),e=o.extend({offset:i},e),this._popupHandlersAdded||(this.on("click",this.togglePopup,this).on("remove",this.closePopup,this).on("move",this._movePopup,this),this._popupHandlersAdded=!0),t instanceof o.Popup?(o.setOptions(t,e),this._popup=t,t._source=this):this._popup=new o.Popup(e,this).setContent(t),this},setPopupContent:function(t){return this._popup&&this._popup.setContent(t),this},unbindPopup:function(){return this._popup&&(this._popup=null,this.off("click",this.togglePopup,this).off("remove",this.closePopup,this).off("move",this._movePopup,this),this._popupHandlersAdded=!1),this},getPopup:function(){return this._popup},_movePopup:function(t){this._popup.setLatLng(t.latlng)}}),o.LayerGroup=o.Class.extend({initialize:function(t){this._layers={};var e,i;if(t)for(e=0,i=t.length;i>e;e++)this.addLayer(t[e])},addLayer:function(t){var e=this.getLayerId(t);return this._layers[e]=t,this._map&&this._map.addLayer(t),this},removeLayer:function(t){var e=t in this._layers?t:this.getLayerId(t);return this._map&&this._layers[e]&&this._map.removeLayer(this._layers[e]),delete this._layers[e],this},hasLayer:function(t){return t?t in this._layers||this.getLayerId(t)in this._layers:!1},clearLayers:function(){return this.eachLayer(this.removeLayer,this),this},invoke:function(t){var e,i,n=Array.prototype.slice.call(arguments,1);for(e in this._layers)i=this._layers[e],i[t]&&i[t].apply(i,n);return this},onAdd:function(t){this._map=t,this.eachLayer(t.addLayer,t)},onRemove:function(t){this.eachLayer(t.removeLayer,t),this._map=null},addTo:function(t){return t.addLayer(this),this},eachLayer:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},getLayer:function(t){return this._layers[t]},getLayers:function(){var t=[];for(var e in this._layers)t.push(this._layers[e]);return t},setZIndex:function(t){return this.invoke("setZIndex",t)},getLayerId:function(t){return o.stamp(t)}}),o.layerGroup=function(t){return new o.LayerGroup(t)},o.FeatureGroup=o.LayerGroup.extend({includes:o.Mixin.Events,statics:{EVENTS:"click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose"},addLayer:function(t){return this.hasLayer(t)?this:("on"in t&&t.on(o.FeatureGroup.EVENTS,this._propagateEvent,this),o.LayerGroup.prototype.addLayer.call(this,t),this._popupContent&&t.bindPopup&&t.bindPopup(this._popupContent,this._popupOptions),this.fire("layeradd",{layer:t}))},removeLayer:function(t){return this.hasLayer(t)?(t in this._layers&&(t=this._layers[t]),"off"in t&&t.off(o.FeatureGroup.EVENTS,this._propagateEvent,this),o.LayerGroup.prototype.removeLayer.call(this,t),this._popupContent&&this.invoke("unbindPopup"),this.fire("layerremove",{layer:t})):this},bindPopup:function(t,e){return this._popupContent=t,this._popupOptions=e,this.invoke("bindPopup",t,e)},openPopup:function(t){for(var e in this._layers){this._layers[e].openPopup(t);break}return this},setStyle:function(t){return this.invoke("setStyle",t)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var t=new o.LatLngBounds;return this.eachLayer(function(e){t.extend(e instanceof o.Marker?e.getLatLng():e.getBounds())}),t},_propagateEvent:function(t){t=o.extend({layer:t.target,target:this},t),this.fire(t.type,t)}}),o.featureGroup=function(t){return new o.FeatureGroup(t)},o.Path=o.Class.extend({includes:[o.Mixin.Events],statics:{CLIP_PADDING:function(){var e=o.Browser.mobile?1280:2e3,i=(e/Math.max(t.outerWidth,t.outerHeight)-1)/2;return Math.max(0,Math.min(.5,i))}()},options:{stroke:!0,color:"#0033ff",dashArray:null,lineCap:null,lineJoin:null,weight:5,opacity:.5,fill:!1,fillColor:null,fillOpacity:.2,clickable:!0},initialize:function(t){o.setOptions(this,t)},onAdd:function(t){this._map=t,this._container||(this._initElements(),this._initEvents()),this.projectLatlngs(),this._updatePath(),this._container&&this._map._pathRoot.appendChild(this._container),this.fire("add"),t.on({viewreset:this.projectLatlngs,moveend:this._updatePath},this)},addTo:function(t){return t.addLayer(this),this},onRemove:function(t){t._pathRoot.removeChild(this._container),this.fire("remove"),this._map=null,o.Browser.vml&&(this._container=null,this._stroke=null,this._fill=null),t.off({viewreset:this.projectLatlngs,moveend:this._updatePath},this)},projectLatlngs:function(){},setStyle:function(t){return o.setOptions(this,t),this._container&&this._updateStyle(),this},redraw:function(){return this._map&&(this.projectLatlngs(),this._updatePath()),this}}),o.Map.include({_updatePathViewport:function(){var t=o.Path.CLIP_PADDING,e=this.getSize(),i=o.DomUtil.getPosition(this._mapPane),n=i.multiplyBy(-1)._subtract(e.multiplyBy(t)._round()),s=n.add(e.multiplyBy(1+2*t)._round());this._pathViewport=new o.Bounds(n,s)}}),o.Path.SVG_NS="http://www.w3.org/2000/svg",o.Browser.svg=!(!e.createElementNS||!e.createElementNS(o.Path.SVG_NS,"svg").createSVGRect),o.Path=o.Path.extend({statics:{SVG:o.Browser.svg},bringToFront:function(){var t=this._map._pathRoot,e=this._container;return e&&t.lastChild!==e&&t.appendChild(e),this},bringToBack:function(){var t=this._map._pathRoot,e=this._container,i=t.firstChild;return e&&i!==e&&t.insertBefore(e,i),this},getPathString:function(){},_createElement:function(t){return e.createElementNS(o.Path.SVG_NS,t)},_initElements:function(){this._map._initPathRoot(),this._initPath(),this._initStyle()},_initPath:function(){this._container=this._createElement("g"),this._path=this._createElement("path"),this.options.className&&o.DomUtil.addClass(this._path,this.options.className),this._container.appendChild(this._path)},_initStyle:function(){this.options.stroke&&(this._path.setAttribute("stroke-linejoin","round"),this._path.setAttribute("stroke-linecap","round")),this.options.fill&&this._path.setAttribute("fill-rule","evenodd"),this.options.pointerEvents&&this._path.setAttribute("pointer-events",this.options.pointerEvents),this.options.clickable||this.options.pointerEvents||this._path.setAttribute("pointer-events","none"),this._updateStyle()},_updateStyle:function(){this.options.stroke?(this._path.setAttribute("stroke",this.options.color),this._path.setAttribute("stroke-opacity",this.options.opacity),this._path.setAttribute("stroke-width",this.options.weight),this.options.dashArray?this._path.setAttribute("stroke-dasharray",this.options.dashArray):this._path.removeAttribute("stroke-dasharray"),this.options.lineCap&&this._path.setAttribute("stroke-linecap",this.options.lineCap),this.options.lineJoin&&this._path.setAttribute("stroke-linejoin",this.options.lineJoin)):this._path.setAttribute("stroke","none"),this.options.fill?(this._path.setAttribute("fill",this.options.fillColor||this.options.color),this._path.setAttribute("fill-opacity",this.options.fillOpacity)):this._path.setAttribute("fill","none")},_updatePath:function(){var t=this.getPathString();t||(t="M0 0"),this._path.setAttribute("d",t)},_initEvents:function(){if(this.options.clickable){(o.Browser.svg||!o.Browser.vml)&&o.DomUtil.addClass(this._path,"leaflet-clickable"),o.DomEvent.on(this._container,"click",this._onMouseClick,this);for(var t=["dblclick","mousedown","mouseover","mouseout","mousemove","contextmenu"],e=0;e<t.length;e++)o.DomEvent.on(this._container,t[e],this._fireMouseEvent,this)}},_onMouseClick:function(t){this._map.dragging&&this._map.dragging.moved()||this._fireMouseEvent(t)},_fireMouseEvent:function(t){if(this._map&&this.hasEventListeners(t.type)){var e=this._map,i=e.mouseEventToContainerPoint(t),n=e.containerPointToLayerPoint(i),s=e.layerPointToLatLng(n);this.fire(t.type,{latlng:s,layerPoint:n,containerPoint:i,originalEvent:t}),"contextmenu"===t.type&&o.DomEvent.preventDefault(t),"mousemove"!==t.type&&o.DomEvent.stopPropagation(t)}}}),o.Map.include({_initPathRoot:function(){this._pathRoot||(this._pathRoot=o.Path.prototype._createElement("svg"),this._panes.overlayPane.appendChild(this._pathRoot),this.options.zoomAnimation&&o.Browser.any3d?(o.DomUtil.addClass(this._pathRoot,"leaflet-zoom-animated"),
this.on({zoomanim:this._animatePathZoom,zoomend:this._endPathZoom})):o.DomUtil.addClass(this._pathRoot,"leaflet-zoom-hide"),this.on("moveend",this._updateSvgViewport),this._updateSvgViewport())},_animatePathZoom:function(t){var e=this.getZoomScale(t.zoom),i=this._getCenterOffset(t.center)._multiplyBy(-e)._add(this._pathViewport.min);this._pathRoot.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(i)+" scale("+e+") ",this._pathZooming=!0},_endPathZoom:function(){this._pathZooming=!1},_updateSvgViewport:function(){if(!this._pathZooming){this._updatePathViewport();var t=this._pathViewport,e=t.min,i=t.max,n=i.x-e.x,s=i.y-e.y,a=this._pathRoot,r=this._panes.overlayPane;o.Browser.mobileWebkit&&r.removeChild(a),o.DomUtil.setPosition(a,e),a.setAttribute("width",n),a.setAttribute("height",s),a.setAttribute("viewBox",[e.x,e.y,n,s].join(" ")),o.Browser.mobileWebkit&&r.appendChild(a)}}}),o.Path.include({bindPopup:function(t,e){return t instanceof o.Popup?this._popup=t:((!this._popup||e)&&(this._popup=new o.Popup(e,this)),this._popup.setContent(t)),this._popupHandlersAdded||(this.on("click",this._openPopup,this).on("remove",this.closePopup,this),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this._popup=null,this.off("click",this._openPopup).off("remove",this.closePopup),this._popupHandlersAdded=!1),this},openPopup:function(t){return this._popup&&(t=t||this._latlng||this._latlngs[Math.floor(this._latlngs.length/2)],this._openPopup({latlng:t})),this},closePopup:function(){return this._popup&&this._popup._close(),this},_openPopup:function(t){this._popup.setLatLng(t.latlng),this._map.openPopup(this._popup)}}),o.Browser.vml=!o.Browser.svg&&function(){try{var t=e.createElement("div");t.innerHTML='<v:shape adj="1"/>';var i=t.firstChild;return i.style.behavior="url(#default#VML)",i&&"object"==typeof i.adj}catch(n){return!1}}(),o.Path=o.Browser.svg||!o.Browser.vml?o.Path:o.Path.extend({statics:{VML:!0,CLIP_PADDING:.02},_createElement:function(){try{return e.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(t){return e.createElement("<lvml:"+t+' class="lvml">')}}catch(t){return function(t){return e.createElement("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}}}(),_initPath:function(){var t=this._container=this._createElement("shape");o.DomUtil.addClass(t,"leaflet-vml-shape"+(this.options.className?" "+this.options.className:"")),this.options.clickable&&o.DomUtil.addClass(t,"leaflet-clickable"),t.coordsize="1 1",this._path=this._createElement("path"),t.appendChild(this._path),this._map._pathRoot.appendChild(t)},_initStyle:function(){this._updateStyle()},_updateStyle:function(){var t=this._stroke,e=this._fill,i=this.options,n=this._container;n.stroked=i.stroke,n.filled=i.fill,i.stroke?(t||(t=this._stroke=this._createElement("stroke"),t.endcap="round",n.appendChild(t)),t.weight=i.weight+"px",t.color=i.color,t.opacity=i.opacity,i.dashArray?t.dashStyle=o.Util.isArray(i.dashArray)?i.dashArray.join(" "):i.dashArray.replace(/( *, *)/g," "):t.dashStyle="",i.lineCap&&(t.endcap=i.lineCap.replace("butt","flat")),i.lineJoin&&(t.joinstyle=i.lineJoin)):t&&(n.removeChild(t),this._stroke=null),i.fill?(e||(e=this._fill=this._createElement("fill"),n.appendChild(e)),e.color=i.fillColor||i.color,e.opacity=i.fillOpacity):e&&(n.removeChild(e),this._fill=null)},_updatePath:function(){var t=this._container.style;t.display="none",this._path.v=this.getPathString()+" ",t.display=""}}),o.Map.include(o.Browser.svg||!o.Browser.vml?{}:{_initPathRoot:function(){if(!this._pathRoot){var t=this._pathRoot=e.createElement("div");t.className="leaflet-vml-container",this._panes.overlayPane.appendChild(t),this.on("moveend",this._updatePathViewport),this._updatePathViewport()}}}),o.Browser.canvas=function(){return!!e.createElement("canvas").getContext}(),o.Path=o.Path.SVG&&!t.L_PREFER_CANVAS||!o.Browser.canvas?o.Path:o.Path.extend({statics:{CANVAS:!0,SVG:!1},redraw:function(){return this._map&&(this.projectLatlngs(),this._requestUpdate()),this},setStyle:function(t){return o.setOptions(this,t),this._map&&(this._updateStyle(),this._requestUpdate()),this},onRemove:function(t){t.off("viewreset",this.projectLatlngs,this).off("moveend",this._updatePath,this),this.options.clickable&&(this._map.off("click",this._onClick,this),this._map.off("mousemove",this._onMouseMove,this)),this._requestUpdate(),this.fire("remove"),this._map=null},_requestUpdate:function(){this._map&&!o.Path._updateRequest&&(o.Path._updateRequest=o.Util.requestAnimFrame(this._fireMapMoveEnd,this._map))},_fireMapMoveEnd:function(){o.Path._updateRequest=null,this.fire("moveend")},_initElements:function(){this._map._initPathRoot(),this._ctx=this._map._canvasCtx},_updateStyle:function(){var t=this.options;t.stroke&&(this._ctx.lineWidth=t.weight,this._ctx.strokeStyle=t.color),t.fill&&(this._ctx.fillStyle=t.fillColor||t.color),t.lineCap&&(this._ctx.lineCap=t.lineCap),t.lineJoin&&(this._ctx.lineJoin=t.lineJoin)},_drawPath:function(){var t,e,i,n,s,a;for(this._ctx.beginPath(),t=0,i=this._parts.length;i>t;t++){for(e=0,n=this._parts[t].length;n>e;e++)s=this._parts[t][e],a=(0===e?"move":"line")+"To",this._ctx[a](s.x,s.y);this instanceof o.Polygon&&this._ctx.closePath()}},_checkIfEmpty:function(){return!this._parts.length},_updatePath:function(){if(!this._checkIfEmpty()){var t=this._ctx,e=this.options;this._drawPath(),t.save(),this._updateStyle(),e.fill&&(t.globalAlpha=e.fillOpacity,t.fill(e.fillRule||"evenodd")),e.stroke&&(t.globalAlpha=e.opacity,t.stroke()),t.restore()}},_initEvents:function(){this.options.clickable&&(this._map.on("mousemove",this._onMouseMove,this),this._map.on("click dblclick contextmenu",this._fireMouseEvent,this))},_fireMouseEvent:function(t){this._containsPoint(t.layerPoint)&&this.fire(t.type,t)},_onMouseMove:function(t){this._map&&!this._map._animatingZoom&&(this._containsPoint(t.layerPoint)?(this._ctx.canvas.style.cursor="pointer",this._mouseInside=!0,this.fire("mouseover",t)):this._mouseInside&&(this._ctx.canvas.style.cursor="",this._mouseInside=!1,this.fire("mouseout",t)))}}),o.Map.include(o.Path.SVG&&!t.L_PREFER_CANVAS||!o.Browser.canvas?{}:{_initPathRoot:function(){var t,i=this._pathRoot;i||(i=this._pathRoot=e.createElement("canvas"),i.style.position="absolute",t=this._canvasCtx=i.getContext("2d"),t.lineCap="round",t.lineJoin="round",this._panes.overlayPane.appendChild(i),this.options.zoomAnimation&&(this._pathRoot.className="leaflet-zoom-animated",this.on("zoomanim",this._animatePathZoom),this.on("zoomend",this._endPathZoom)),this.on("moveend",this._updateCanvasViewport),this._updateCanvasViewport())},_updateCanvasViewport:function(){if(!this._pathZooming){this._updatePathViewport();var t=this._pathViewport,e=t.min,i=t.max.subtract(e),n=this._pathRoot;o.DomUtil.setPosition(n,e),n.width=i.x,n.height=i.y,n.getContext("2d").translate(-e.x,-e.y)}}}),o.LineUtil={simplify:function(t,e){if(!e||!t.length)return t.slice();var i=e*e;return t=this._reducePoints(t,i),t=this._simplifyDP(t,i)},pointToSegmentDistance:function(t,e,i){return Math.sqrt(this._sqClosestPointOnSegment(t,e,i,!0))},closestPointOnSegment:function(t,e,i){return this._sqClosestPointOnSegment(t,e,i)},_simplifyDP:function(t,e){var n=t.length,o=typeof Uint8Array!=i+""?Uint8Array:Array,s=new o(n);s[0]=s[n-1]=1,this._simplifyDPStep(t,s,e,0,n-1);var a,r=[];for(a=0;n>a;a++)s[a]&&r.push(t[a]);return r},_simplifyDPStep:function(t,e,i,n,o){var s,a,r,h=0;for(a=n+1;o-1>=a;a++)r=this._sqClosestPointOnSegment(t[a],t[n],t[o],!0),r>h&&(s=a,h=r);h>i&&(e[s]=1,this._simplifyDPStep(t,e,i,n,s),this._simplifyDPStep(t,e,i,s,o))},_reducePoints:function(t,e){for(var i=[t[0]],n=1,o=0,s=t.length;s>n;n++)this._sqDist(t[n],t[o])>e&&(i.push(t[n]),o=n);return s-1>o&&i.push(t[s-1]),i},clipSegment:function(t,e,i,n){var o,s,a,r=n?this._lastCode:this._getBitCode(t,i),h=this._getBitCode(e,i);for(this._lastCode=h;;){if(!(r|h))return[t,e];if(r&h)return!1;o=r||h,s=this._getEdgeIntersection(t,e,o,i),a=this._getBitCode(s,i),o===r?(t=s,r=a):(e=s,h=a)}},_getEdgeIntersection:function(t,e,i,n){var s=e.x-t.x,a=e.y-t.y,r=n.min,h=n.max;return 8&i?new o.Point(t.x+s*(h.y-t.y)/a,h.y):4&i?new o.Point(t.x+s*(r.y-t.y)/a,r.y):2&i?new o.Point(h.x,t.y+a*(h.x-t.x)/s):1&i?new o.Point(r.x,t.y+a*(r.x-t.x)/s):void 0},_getBitCode:function(t,e){var i=0;return t.x<e.min.x?i|=1:t.x>e.max.x&&(i|=2),t.y<e.min.y?i|=4:t.y>e.max.y&&(i|=8),i},_sqDist:function(t,e){var i=e.x-t.x,n=e.y-t.y;return i*i+n*n},_sqClosestPointOnSegment:function(t,e,i,n){var s,a=e.x,r=e.y,h=i.x-a,l=i.y-r,u=h*h+l*l;return u>0&&(s=((t.x-a)*h+(t.y-r)*l)/u,s>1?(a=i.x,r=i.y):s>0&&(a+=h*s,r+=l*s)),h=t.x-a,l=t.y-r,n?h*h+l*l:new o.Point(a,r)}},o.Polyline=o.Path.extend({initialize:function(t,e){o.Path.prototype.initialize.call(this,e),this._latlngs=this._convertLatLngs(t)},options:{smoothFactor:1,noClip:!1},projectLatlngs:function(){this._originalPoints=[];for(var t=0,e=this._latlngs.length;e>t;t++)this._originalPoints[t]=this._map.latLngToLayerPoint(this._latlngs[t])},getPathString:function(){for(var t=0,e=this._parts.length,i="";e>t;t++)i+=this._getPathPartStr(this._parts[t]);return i},getLatLngs:function(){return this._latlngs},setLatLngs:function(t){return this._latlngs=this._convertLatLngs(t),this.redraw()},addLatLng:function(t){return this._latlngs.push(o.latLng(t)),this.redraw()},spliceLatLngs:function(){var t=[].splice.apply(this._latlngs,arguments);return this._convertLatLngs(this._latlngs,!0),this.redraw(),t},closestLayerPoint:function(t){for(var e,i,n=1/0,s=this._parts,a=null,r=0,h=s.length;h>r;r++)for(var l=s[r],u=1,c=l.length;c>u;u++){e=l[u-1],i=l[u];var d=o.LineUtil._sqClosestPointOnSegment(t,e,i,!0);n>d&&(n=d,a=o.LineUtil._sqClosestPointOnSegment(t,e,i))}return a&&(a.distance=Math.sqrt(n)),a},getBounds:function(){return new o.LatLngBounds(this.getLatLngs())},_convertLatLngs:function(t,e){var i,n,s=e?t:[];for(i=0,n=t.length;n>i;i++){if(o.Util.isArray(t[i])&&"number"!=typeof t[i][0])return;s[i]=o.latLng(t[i])}return s},_initEvents:function(){o.Path.prototype._initEvents.call(this)},_getPathPartStr:function(t){for(var e,i=o.Path.VML,n=0,s=t.length,a="";s>n;n++)e=t[n],i&&e._round(),a+=(n?"L":"M")+e.x+" "+e.y;return a},_clipPoints:function(){var t,e,i,n=this._originalPoints,s=n.length;if(this.options.noClip)return void(this._parts=[n]);this._parts=[];var a=this._parts,r=this._map._pathViewport,h=o.LineUtil;for(t=0,e=0;s-1>t;t++)i=h.clipSegment(n[t],n[t+1],r,t),i&&(a[e]=a[e]||[],a[e].push(i[0]),(i[1]!==n[t+1]||t===s-2)&&(a[e].push(i[1]),e++))},_simplifyPoints:function(){for(var t=this._parts,e=o.LineUtil,i=0,n=t.length;n>i;i++)t[i]=e.simplify(t[i],this.options.smoothFactor)},_updatePath:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),o.Path.prototype._updatePath.call(this))}}),o.polyline=function(t,e){return new o.Polyline(t,e)},o.PolyUtil={},o.PolyUtil.clipPolygon=function(t,e){var i,n,s,a,r,h,l,u,c,d=[1,4,2,8],p=o.LineUtil;for(n=0,l=t.length;l>n;n++)t[n]._code=p._getBitCode(t[n],e);for(a=0;4>a;a++){for(u=d[a],i=[],n=0,l=t.length,s=l-1;l>n;s=n++)r=t[n],h=t[s],r._code&u?h._code&u||(c=p._getEdgeIntersection(h,r,u,e),c._code=p._getBitCode(c,e),i.push(c)):(h._code&u&&(c=p._getEdgeIntersection(h,r,u,e),c._code=p._getBitCode(c,e),i.push(c)),i.push(r));t=i}return t},o.Polygon=o.Polyline.extend({options:{fill:!0},initialize:function(t,e){o.Polyline.prototype.initialize.call(this,t,e),this._initWithHoles(t)},_initWithHoles:function(t){var e,i,n;if(t&&o.Util.isArray(t[0])&&"number"!=typeof t[0][0])for(this._latlngs=this._convertLatLngs(t[0]),this._holes=t.slice(1),e=0,i=this._holes.length;i>e;e++)n=this._holes[e]=this._convertLatLngs(this._holes[e]),n[0].equals(n[n.length-1])&&n.pop();t=this._latlngs,t.length>=2&&t[0].equals(t[t.length-1])&&t.pop()},projectLatlngs:function(){if(o.Polyline.prototype.projectLatlngs.call(this),this._holePoints=[],this._holes){var t,e,i,n;for(t=0,i=this._holes.length;i>t;t++)for(this._holePoints[t]=[],e=0,n=this._holes[t].length;n>e;e++)this._holePoints[t][e]=this._map.latLngToLayerPoint(this._holes[t][e])}},setLatLngs:function(t){return t&&o.Util.isArray(t[0])&&"number"!=typeof t[0][0]?(this._initWithHoles(t),this.redraw()):o.Polyline.prototype.setLatLngs.call(this,t)},_clipPoints:function(){var t=this._originalPoints,e=[];if(this._parts=[t].concat(this._holePoints),!this.options.noClip){for(var i=0,n=this._parts.length;n>i;i++){var s=o.PolyUtil.clipPolygon(this._parts[i],this._map._pathViewport);s.length&&e.push(s)}this._parts=e}},_getPathPartStr:function(t){var e=o.Polyline.prototype._getPathPartStr.call(this,t);return e+(o.Browser.svg?"z":"x")}}),o.polygon=function(t,e){return new o.Polygon(t,e)},function(){function t(t){return o.FeatureGroup.extend({initialize:function(t,e){this._layers={},this._options=e,this.setLatLngs(t)},setLatLngs:function(e){var i=0,n=e.length;for(this.eachLayer(function(t){n>i?t.setLatLngs(e[i++]):this.removeLayer(t)},this);n>i;)this.addLayer(new t(e[i++],this._options));return this},getLatLngs:function(){var t=[];return this.eachLayer(function(e){t.push(e.getLatLngs())}),t}})}o.MultiPolyline=t(o.Polyline),o.MultiPolygon=t(o.Polygon),o.multiPolyline=function(t,e){return new o.MultiPolyline(t,e)},o.multiPolygon=function(t,e){return new o.MultiPolygon(t,e)}}(),o.Rectangle=o.Polygon.extend({initialize:function(t,e){o.Polygon.prototype.initialize.call(this,this._boundsToLatLngs(t),e)},setBounds:function(t){this.setLatLngs(this._boundsToLatLngs(t))},_boundsToLatLngs:function(t){return t=o.latLngBounds(t),[t.getSouthWest(),t.getNorthWest(),t.getNorthEast(),t.getSouthEast()]}}),o.rectangle=function(t,e){return new o.Rectangle(t,e)},o.Circle=o.Path.extend({initialize:function(t,e,i){o.Path.prototype.initialize.call(this,i),this._latlng=o.latLng(t),this._mRadius=e},options:{fill:!0},setLatLng:function(t){return this._latlng=o.latLng(t),this.redraw()},setRadius:function(t){return this._mRadius=t,this.redraw()},projectLatlngs:function(){var t=this._getLngRadius(),e=this._latlng,i=this._map.latLngToLayerPoint([e.lat,e.lng-t]);this._point=this._map.latLngToLayerPoint(e),this._radius=Math.max(this._point.x-i.x,1)},getBounds:function(){var t=this._getLngRadius(),e=this._mRadius/40075017*360,i=this._latlng;return new o.LatLngBounds([i.lat-e,i.lng-t],[i.lat+e,i.lng+t])},getLatLng:function(){return this._latlng},getPathString:function(){var t=this._point,e=this._radius;return this._checkIfEmpty()?"":o.Browser.svg?"M"+t.x+","+(t.y-e)+"A"+e+","+e+",0,1,1,"+(t.x-.1)+","+(t.y-e)+" z":(t._round(),e=Math.round(e),"AL "+t.x+","+t.y+" "+e+","+e+" 0,23592600")},getRadius:function(){return this._mRadius},_getLatRadius:function(){return this._mRadius/40075017*360},_getLngRadius:function(){return this._getLatRadius()/Math.cos(o.LatLng.DEG_TO_RAD*this._latlng.lat)},_checkIfEmpty:function(){if(!this._map)return!1;var t=this._map._pathViewport,e=this._radius,i=this._point;return i.x-e>t.max.x||i.y-e>t.max.y||i.x+e<t.min.x||i.y+e<t.min.y}}),o.circle=function(t,e,i){return new o.Circle(t,e,i)},o.CircleMarker=o.Circle.extend({options:{radius:10,weight:2},initialize:function(t,e){o.Circle.prototype.initialize.call(this,t,null,e),this._radius=this.options.radius},projectLatlngs:function(){this._point=this._map.latLngToLayerPoint(this._latlng)},_updateStyle:function(){o.Circle.prototype._updateStyle.call(this),this.setRadius(this.options.radius)},setLatLng:function(t){return o.Circle.prototype.setLatLng.call(this,t),this._popup&&this._popup._isOpen&&this._popup.setLatLng(t),this},setRadius:function(t){return this.options.radius=this._radius=t,this.redraw()},getRadius:function(){return this._radius}}),o.circleMarker=function(t,e){return new o.CircleMarker(t,e)},o.Polyline.include(o.Path.CANVAS?{_containsPoint:function(t,e){var i,n,s,a,r,h,l,u=this.options.weight/2;for(o.Browser.touch&&(u+=10),i=0,a=this._parts.length;a>i;i++)for(l=this._parts[i],n=0,r=l.length,s=r-1;r>n;s=n++)if((e||0!==n)&&(h=o.LineUtil.pointToSegmentDistance(t,l[s],l[n]),u>=h))return!0;return!1}}:{}),o.Polygon.include(o.Path.CANVAS?{_containsPoint:function(t){var e,i,n,s,a,r,h,l,u=!1;if(o.Polyline.prototype._containsPoint.call(this,t,!0))return!0;for(s=0,h=this._parts.length;h>s;s++)for(e=this._parts[s],a=0,l=e.length,r=l-1;l>a;r=a++)i=e[a],n=e[r],i.y>t.y!=n.y>t.y&&t.x<(n.x-i.x)*(t.y-i.y)/(n.y-i.y)+i.x&&(u=!u);return u}}:{}),o.Circle.include(o.Path.CANVAS?{_drawPath:function(){var t=this._point;this._ctx.beginPath(),this._ctx.arc(t.x,t.y,this._radius,0,2*Math.PI,!1)},_containsPoint:function(t){var e=this._point,i=this.options.stroke?this.options.weight/2:0;return t.distanceTo(e)<=this._radius+i}}:{}),o.CircleMarker.include(o.Path.CANVAS?{_updateStyle:function(){o.Path.prototype._updateStyle.call(this)}}:{}),o.GeoJSON=o.FeatureGroup.extend({initialize:function(t,e){o.setOptions(this,e),this._layers={},t&&this.addData(t)},addData:function(t){var e,i,n,s=o.Util.isArray(t)?t:t.features;if(s){for(e=0,i=s.length;i>e;e++)n=s[e],(n.geometries||n.geometry||n.features||n.coordinates)&&this.addData(s[e]);return this}var a=this.options;if(!a.filter||a.filter(t)){var r=o.GeoJSON.geometryToLayer(t,a.pointToLayer,a.coordsToLatLng,a);return r.feature=o.GeoJSON.asFeature(t),r.defaultOptions=r.options,this.resetStyle(r),a.onEachFeature&&a.onEachFeature(t,r),this.addLayer(r)}},resetStyle:function(t){var e=this.options.style;e&&(o.Util.extend(t.options,t.defaultOptions),this._setLayerStyle(t,e))},setStyle:function(t){this.eachLayer(function(e){this._setLayerStyle(e,t)},this)},_setLayerStyle:function(t,e){"function"==typeof e&&(e=e(t.feature)),t.setStyle&&t.setStyle(e)}}),o.extend(o.GeoJSON,{geometryToLayer:function(t,e,i,n){var s,a,r,h,l="Feature"===t.type?t.geometry:t,u=l.coordinates,c=[];switch(i=i||this.coordsToLatLng,l.type){case"Point":return s=i(u),e?e(t,s):new o.Marker(s);case"MultiPoint":for(r=0,h=u.length;h>r;r++)s=i(u[r]),c.push(e?e(t,s):new o.Marker(s));return new o.FeatureGroup(c);case"LineString":return a=this.coordsToLatLngs(u,0,i),new o.Polyline(a,n);case"Polygon":if(2===u.length&&!u[1].length)throw new Error("Invalid GeoJSON object.");return a=this.coordsToLatLngs(u,1,i),new o.Polygon(a,n);case"MultiLineString":return a=this.coordsToLatLngs(u,1,i),new o.MultiPolyline(a,n);case"MultiPolygon":return a=this.coordsToLatLngs(u,2,i),new o.MultiPolygon(a,n);case"GeometryCollection":for(r=0,h=l.geometries.length;h>r;r++)c.push(this.geometryToLayer({geometry:l.geometries[r],type:"Feature",properties:t.properties},e,i,n));return new o.FeatureGroup(c);default:throw new Error("Invalid GeoJSON object.")}},coordsToLatLng:function(t){return new o.LatLng(t[1],t[0],t[2])},coordsToLatLngs:function(t,e,i){var n,o,s,a=[];for(o=0,s=t.length;s>o;o++)n=e?this.coordsToLatLngs(t[o],e-1,i):(i||this.coordsToLatLng)(t[o]),a.push(n);return a},latLngToCoords:function(t){var e=[t.lng,t.lat];return t.alt!==i&&e.push(t.alt),e},latLngsToCoords:function(t){for(var e=[],i=0,n=t.length;n>i;i++)e.push(o.GeoJSON.latLngToCoords(t[i]));return e},getFeature:function(t,e){return t.feature?o.extend({},t.feature,{geometry:e}):o.GeoJSON.asFeature(e)},asFeature:function(t){return"Feature"===t.type?t:{type:"Feature",properties:{},geometry:t}}});var a={toGeoJSON:function(){return o.GeoJSON.getFeature(this,{type:"Point",coordinates:o.GeoJSON.latLngToCoords(this.getLatLng())})}};o.Marker.include(a),o.Circle.include(a),o.CircleMarker.include(a),o.Polyline.include({toGeoJSON:function(){return o.GeoJSON.getFeature(this,{type:"LineString",coordinates:o.GeoJSON.latLngsToCoords(this.getLatLngs())})}}),o.Polygon.include({toGeoJSON:function(){var t,e,i,n=[o.GeoJSON.latLngsToCoords(this.getLatLngs())];if(n[0].push(n[0][0]),this._holes)for(t=0,e=this._holes.length;e>t;t++)i=o.GeoJSON.latLngsToCoords(this._holes[t]),i.push(i[0]),n.push(i);return o.GeoJSON.getFeature(this,{type:"Polygon",coordinates:n})}}),function(){function t(t){return function(){var e=[];return this.eachLayer(function(t){e.push(t.toGeoJSON().geometry.coordinates)}),o.GeoJSON.getFeature(this,{type:t,coordinates:e})}}o.MultiPolyline.include({toGeoJSON:t("MultiLineString")}),o.MultiPolygon.include({toGeoJSON:t("MultiPolygon")}),o.LayerGroup.include({toGeoJSON:function(){var e,i=this.feature&&this.feature.geometry,n=[];if(i&&"MultiPoint"===i.type)return t("MultiPoint").call(this);var s=i&&"GeometryCollection"===i.type;return this.eachLayer(function(t){t.toGeoJSON&&(e=t.toGeoJSON(),n.push(s?e.geometry:o.GeoJSON.asFeature(e)))}),s?o.GeoJSON.getFeature(this,{geometries:n,type:"GeometryCollection"}):{type:"FeatureCollection",features:n}}})}(),o.geoJson=function(t,e){return new o.GeoJSON(t,e)},o.DomEvent={addListener:function(t,e,i,n){var s,a,r,h=o.stamp(i),l="_leaflet_"+e+h;return t[l]?this:(s=function(e){return i.call(n||t,e||o.DomEvent._getEvent())},o.Browser.pointer&&0===e.indexOf("touch")?this.addPointerListener(t,e,s,h):(o.Browser.touch&&"dblclick"===e&&this.addDoubleTapListener&&this.addDoubleTapListener(t,s,h),"addEventListener"in t?"mousewheel"===e?(t.addEventListener("DOMMouseScroll",s,!1),t.addEventListener(e,s,!1)):"mouseenter"===e||"mouseleave"===e?(a=s,r="mouseenter"===e?"mouseover":"mouseout",s=function(e){return o.DomEvent._checkMouse(t,e)?a(e):void 0},t.addEventListener(r,s,!1)):"click"===e&&o.Browser.android?(a=s,s=function(t){return o.DomEvent._filterClick(t,a)},t.addEventListener(e,s,!1)):t.addEventListener(e,s,!1):"attachEvent"in t&&t.attachEvent("on"+e,s),t[l]=s,this))},removeListener:function(t,e,i){var n=o.stamp(i),s="_leaflet_"+e+n,a=t[s];return a?(o.Browser.pointer&&0===e.indexOf("touch")?this.removePointerListener(t,e,n):o.Browser.touch&&"dblclick"===e&&this.removeDoubleTapListener?this.removeDoubleTapListener(t,n):"removeEventListener"in t?"mousewheel"===e?(t.removeEventListener("DOMMouseScroll",a,!1),t.removeEventListener(e,a,!1)):"mouseenter"===e||"mouseleave"===e?t.removeEventListener("mouseenter"===e?"mouseover":"mouseout",a,!1):t.removeEventListener(e,a,!1):"detachEvent"in t&&t.detachEvent("on"+e,a),t[s]=null,this):this},stopPropagation:function(t){return t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,o.DomEvent._skipped(t),this},disableScrollPropagation:function(t){var e=o.DomEvent.stopPropagation;return o.DomEvent.on(t,"mousewheel",e).on(t,"MozMousePixelScroll",e)},disableClickPropagation:function(t){for(var e=o.DomEvent.stopPropagation,i=o.Draggable.START.length-1;i>=0;i--)o.DomEvent.on(t,o.Draggable.START[i],e);return o.DomEvent.on(t,"click",o.DomEvent._fakeStop).on(t,"dblclick",e)},preventDefault:function(t){return t.preventDefault?t.preventDefault():t.returnValue=!1,this},stop:function(t){return o.DomEvent.preventDefault(t).stopPropagation(t)},getMousePosition:function(t,e){if(!e)return new o.Point(t.clientX,t.clientY);var i=e.getBoundingClientRect();return new o.Point(t.clientX-i.left-e.clientLeft,t.clientY-i.top-e.clientTop)},getWheelDelta:function(t){var e=0;return t.wheelDelta&&(e=t.wheelDelta/120),t.detail&&(e=-t.detail/3),e},_skipEvents:{},_fakeStop:function(t){o.DomEvent._skipEvents[t.type]=!0},_skipped:function(t){var e=this._skipEvents[t.type];return this._skipEvents[t.type]=!1,e},_checkMouse:function(t,e){var i=e.relatedTarget;if(!i)return!0;try{for(;i&&i!==t;)i=i.parentNode}catch(n){return!1}return i!==t},_getEvent:function(){var e=t.event;if(!e)for(var i=arguments.callee.caller;i&&(e=i.arguments[0],!e||t.Event!==e.constructor);)i=i.caller;return e},_filterClick:function(t,e){var i=t.timeStamp||t.originalEvent.timeStamp,n=o.DomEvent._lastClick&&i-o.DomEvent._lastClick;return n&&n>100&&500>n||t.target._simulatedClick&&!t._simulated?void o.DomEvent.stop(t):(o.DomEvent._lastClick=i,e(t))}},o.DomEvent.on=o.DomEvent.addListener,o.DomEvent.off=o.DomEvent.removeListener,o.Draggable=o.Class.extend({includes:o.Mixin.Events,statics:{START:o.Browser.touch?["touchstart","mousedown"]:["mousedown"],END:{mousedown:"mouseup",touchstart:"touchend",pointerdown:"touchend",MSPointerDown:"touchend"},MOVE:{mousedown:"mousemove",touchstart:"touchmove",pointerdown:"touchmove",MSPointerDown:"touchmove"}},initialize:function(t,e){this._element=t,this._dragStartTarget=e||t},enable:function(){if(!this._enabled){for(var t=o.Draggable.START.length-1;t>=0;t--)o.DomEvent.on(this._dragStartTarget,o.Draggable.START[t],this._onDown,this);this._enabled=!0}},disable:function(){if(this._enabled){for(var t=o.Draggable.START.length-1;t>=0;t--)o.DomEvent.off(this._dragStartTarget,o.Draggable.START[t],this._onDown,this);this._enabled=!1,this._moved=!1}},_onDown:function(t){if(this._moved=!1,!t.shiftKey&&(1===t.which||1===t.button||t.touches)&&(o.DomEvent.stopPropagation(t),!o.Draggable._disabled&&(o.DomUtil.disableImageDrag(),o.DomUtil.disableTextSelection(),!this._moving))){var i=t.touches?t.touches[0]:t;this._startPoint=new o.Point(i.clientX,i.clientY),this._startPos=this._newPos=o.DomUtil.getPosition(this._element),o.DomEvent.on(e,o.Draggable.MOVE[t.type],this._onMove,this).on(e,o.Draggable.END[t.type],this._onUp,this)}},_onMove:function(t){if(t.touches&&t.touches.length>1)return void(this._moved=!0);var i=t.touches&&1===t.touches.length?t.touches[0]:t,n=new o.Point(i.clientX,i.clientY),s=n.subtract(this._startPoint);(s.x||s.y)&&(o.Browser.touch&&Math.abs(s.x)+Math.abs(s.y)<3||(o.DomEvent.preventDefault(t),this._moved||(this.fire("dragstart"),this._moved=!0,this._startPos=o.DomUtil.getPosition(this._element).subtract(s),o.DomUtil.addClass(e.body,"leaflet-dragging"),this._lastTarget=t.target||t.srcElement,o.DomUtil.addClass(this._lastTarget,"leaflet-drag-target")),this._newPos=this._startPos.add(s),this._moving=!0,o.Util.cancelAnimFrame(this._animRequest),this._animRequest=o.Util.requestAnimFrame(this._updatePosition,this,!0,this._dragStartTarget)))},_updatePosition:function(){this.fire("predrag"),o.DomUtil.setPosition(this._element,this._newPos),this.fire("drag")},_onUp:function(){o.DomUtil.removeClass(e.body,"leaflet-dragging"),this._lastTarget&&(o.DomUtil.removeClass(this._lastTarget,"leaflet-drag-target"),this._lastTarget=null);for(var t in o.Draggable.MOVE)o.DomEvent.off(e,o.Draggable.MOVE[t],this._onMove).off(e,o.Draggable.END[t],this._onUp);o.DomUtil.enableImageDrag(),o.DomUtil.enableTextSelection(),this._moved&&this._moving&&(o.Util.cancelAnimFrame(this._animRequest),this.fire("dragend",{distance:this._newPos.distanceTo(this._startPos)})),this._moving=!1}}),o.Handler=o.Class.extend({initialize:function(t){this._map=t},enable:function(){this._enabled||(this._enabled=!0,this.addHooks())},disable:function(){this._enabled&&(this._enabled=!1,this.removeHooks())},enabled:function(){return!!this._enabled}}),o.Map.mergeOptions({dragging:!0,inertia:!o.Browser.android23,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,inertiaThreshold:o.Browser.touch?32:18,easeLinearity:.25,worldCopyJump:!1}),o.Map.Drag=o.Handler.extend({addHooks:function(){if(!this._draggable){var t=this._map;this._draggable=new o.Draggable(t._mapPane,t._container),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),t.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDrag,this),t.on("viewreset",this._onViewReset,this),t.whenReady(this._onViewReset,this))}this._draggable.enable()},removeHooks:function(){this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){var t=this._map;t._panAnim&&t._panAnim.stop(),t.fire("movestart").fire("dragstart"),t.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(){if(this._map.options.inertia){var t=this._lastTime=+new Date,e=this._lastPos=this._draggable._newPos;this._positions.push(e),this._times.push(t),t-this._times[0]>200&&(this._positions.shift(),this._times.shift())}this._map.fire("move").fire("drag")},_onViewReset:function(){var t=this._map.getSize()._divideBy(2),e=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=e.subtract(t).x,this._worldWidth=this._map.project([0,180]).x},_onPreDrag:function(){var t=this._worldWidth,e=Math.round(t/2),i=this._initialWorldOffset,n=this._draggable._newPos.x,o=(n-e+i)%t+e-i,s=(n+e+i)%t-e-i,a=Math.abs(o+i)<Math.abs(s+i)?o:s;this._draggable._newPos.x=a},_onDragEnd:function(t){var e=this._map,i=e.options,n=+new Date-this._lastTime,s=!i.inertia||n>i.inertiaThreshold||!this._positions[0];if(e.fire("dragend",t),s)e.fire("moveend");else{var a=this._lastPos.subtract(this._positions[0]),r=(this._lastTime+n-this._times[0])/1e3,h=i.easeLinearity,l=a.multiplyBy(h/r),u=l.distanceTo([0,0]),c=Math.min(i.inertiaMaxSpeed,u),d=l.multiplyBy(c/u),p=c/(i.inertiaDeceleration*h),_=d.multiplyBy(-p/2).round();_.x&&_.y?(_=e._limitOffset(_,e.options.maxBounds),o.Util.requestAnimFrame(function(){e.panBy(_,{duration:p,easeLinearity:h,noMoveStart:!0})})):e.fire("moveend")}}}),o.Map.addInitHook("addHandler","dragging",o.Map.Drag),o.Map.mergeOptions({doubleClickZoom:!0}),o.Map.DoubleClickZoom=o.Handler.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(t){var e=this._map,i=e.getZoom()+(t.originalEvent.shiftKey?-1:1);"center"===e.options.doubleClickZoom?e.setZoom(i):e.setZoomAround(t.containerPoint,i)}}),o.Map.addInitHook("addHandler","doubleClickZoom",o.Map.DoubleClickZoom),o.Map.mergeOptions({scrollWheelZoom:!0}),o.Map.ScrollWheelZoom=o.Handler.extend({addHooks:function(){o.DomEvent.on(this._map._container,"mousewheel",this._onWheelScroll,this),o.DomEvent.on(this._map._container,"MozMousePixelScroll",o.DomEvent.preventDefault),this._delta=0},removeHooks:function(){o.DomEvent.off(this._map._container,"mousewheel",this._onWheelScroll),o.DomEvent.off(this._map._container,"MozMousePixelScroll",o.DomEvent.preventDefault)},_onWheelScroll:function(t){var e=o.DomEvent.getWheelDelta(t);this._delta+=e,this._lastMousePos=this._map.mouseEventToContainerPoint(t),this._startTime||(this._startTime=+new Date);var i=Math.max(40-(+new Date-this._startTime),0);clearTimeout(this._timer),this._timer=setTimeout(o.bind(this._performZoom,this),i),o.DomEvent.preventDefault(t),o.DomEvent.stopPropagation(t)},_performZoom:function(){var t=this._map,e=this._delta,i=t.getZoom();e=e>0?Math.ceil(e):Math.floor(e),e=Math.max(Math.min(e,4),-4),e=t._limitZoom(i+e)-i,this._delta=0,this._startTime=null,e&&("center"===t.options.scrollWheelZoom?t.setZoom(i+e):t.setZoomAround(this._lastMousePos,i+e))}}),o.Map.addInitHook("addHandler","scrollWheelZoom",o.Map.ScrollWheelZoom),o.extend(o.DomEvent,{_touchstart:o.Browser.msPointer?"MSPointerDown":o.Browser.pointer?"pointerdown":"touchstart",_touchend:o.Browser.msPointer?"MSPointerUp":o.Browser.pointer?"pointerup":"touchend",addDoubleTapListener:function(t,i,n){function s(t){var e;if(o.Browser.pointer?(_.push(t.pointerId),e=_.length):e=t.touches.length,!(e>1)){var i=Date.now(),n=i-(r||i);h=t.touches?t.touches[0]:t,l=n>0&&u>=n,r=i}}function a(t){if(o.Browser.pointer){var e=_.indexOf(t.pointerId);if(-1===e)return;_.splice(e,1)}if(l){if(o.Browser.pointer){var n,s={};for(var a in h)n=h[a],"function"==typeof n?s[a]=n.bind(h):s[a]=n;h=s}h.type="dblclick",i(h),r=null}}var r,h,l=!1,u=250,c="_leaflet_",d=this._touchstart,p=this._touchend,_=[];t[c+d+n]=s,t[c+p+n]=a;var m=o.Browser.pointer?e.documentElement:t;return t.addEventListener(d,s,!1),m.addEventListener(p,a,!1),o.Browser.pointer&&m.addEventListener(o.DomEvent.POINTER_CANCEL,a,!1),this},removeDoubleTapListener:function(t,i){var n="_leaflet_";return t.removeEventListener(this._touchstart,t[n+this._touchstart+i],!1),(o.Browser.pointer?e.documentElement:t).removeEventListener(this._touchend,t[n+this._touchend+i],!1),o.Browser.pointer&&e.documentElement.removeEventListener(o.DomEvent.POINTER_CANCEL,t[n+this._touchend+i],!1),this}}),o.extend(o.DomEvent,{POINTER_DOWN:o.Browser.msPointer?"MSPointerDown":"pointerdown",POINTER_MOVE:o.Browser.msPointer?"MSPointerMove":"pointermove",POINTER_UP:o.Browser.msPointer?"MSPointerUp":"pointerup",POINTER_CANCEL:o.Browser.msPointer?"MSPointerCancel":"pointercancel",_pointers:[],_pointerDocumentListener:!1,addPointerListener:function(t,e,i,n){switch(e){case"touchstart":return this.addPointerListenerStart(t,e,i,n);
case"touchend":return this.addPointerListenerEnd(t,e,i,n);case"touchmove":return this.addPointerListenerMove(t,e,i,n);default:throw"Unknown touch event type"}},addPointerListenerStart:function(t,i,n,s){var a="_leaflet_",r=this._pointers,h=function(t){"mouse"!==t.pointerType&&t.pointerType!==t.MSPOINTER_TYPE_MOUSE&&o.DomEvent.preventDefault(t);for(var e=!1,i=0;i<r.length;i++)if(r[i].pointerId===t.pointerId){e=!0;break}e||r.push(t),t.touches=r.slice(),t.changedTouches=[t],n(t)};if(t[a+"touchstart"+s]=h,t.addEventListener(this.POINTER_DOWN,h,!1),!this._pointerDocumentListener){var l=function(t){for(var e=0;e<r.length;e++)if(r[e].pointerId===t.pointerId){r.splice(e,1);break}};e.documentElement.addEventListener(this.POINTER_UP,l,!1),e.documentElement.addEventListener(this.POINTER_CANCEL,l,!1),this._pointerDocumentListener=!0}return this},addPointerListenerMove:function(t,e,i,n){function o(t){if(t.pointerType!==t.MSPOINTER_TYPE_MOUSE&&"mouse"!==t.pointerType||0!==t.buttons){for(var e=0;e<a.length;e++)if(a[e].pointerId===t.pointerId){a[e]=t;break}t.touches=a.slice(),t.changedTouches=[t],i(t)}}var s="_leaflet_",a=this._pointers;return t[s+"touchmove"+n]=o,t.addEventListener(this.POINTER_MOVE,o,!1),this},addPointerListenerEnd:function(t,e,i,n){var o="_leaflet_",s=this._pointers,a=function(t){for(var e=0;e<s.length;e++)if(s[e].pointerId===t.pointerId){s.splice(e,1);break}t.touches=s.slice(),t.changedTouches=[t],i(t)};return t[o+"touchend"+n]=a,t.addEventListener(this.POINTER_UP,a,!1),t.addEventListener(this.POINTER_CANCEL,a,!1),this},removePointerListener:function(t,e,i){var n="_leaflet_",o=t[n+e+i];switch(e){case"touchstart":t.removeEventListener(this.POINTER_DOWN,o,!1);break;case"touchmove":t.removeEventListener(this.POINTER_MOVE,o,!1);break;case"touchend":t.removeEventListener(this.POINTER_UP,o,!1),t.removeEventListener(this.POINTER_CANCEL,o,!1)}return this}}),o.Map.mergeOptions({touchZoom:o.Browser.touch&&!o.Browser.android23,bounceAtZoomLimits:!0}),o.Map.TouchZoom=o.Handler.extend({addHooks:function(){o.DomEvent.on(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){o.DomEvent.off(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(t){var i=this._map;if(t.touches&&2===t.touches.length&&!i._animatingZoom&&!this._zooming){var n=i.mouseEventToLayerPoint(t.touches[0]),s=i.mouseEventToLayerPoint(t.touches[1]),a=i._getCenterLayerPoint();this._startCenter=n.add(s)._divideBy(2),this._startDist=n.distanceTo(s),this._moved=!1,this._zooming=!0,this._centerOffset=a.subtract(this._startCenter),i._panAnim&&i._panAnim.stop(),o.DomEvent.on(e,"touchmove",this._onTouchMove,this).on(e,"touchend",this._onTouchEnd,this),o.DomEvent.preventDefault(t)}},_onTouchMove:function(t){var e=this._map;if(t.touches&&2===t.touches.length&&this._zooming){var i=e.mouseEventToLayerPoint(t.touches[0]),n=e.mouseEventToLayerPoint(t.touches[1]);this._scale=i.distanceTo(n)/this._startDist,this._delta=i._add(n)._divideBy(2)._subtract(this._startCenter),1!==this._scale&&(e.options.bounceAtZoomLimits||!(e.getZoom()===e.getMinZoom()&&this._scale<1||e.getZoom()===e.getMaxZoom()&&this._scale>1))&&(this._moved||(o.DomUtil.addClass(e._mapPane,"leaflet-touching"),e.fire("movestart").fire("zoomstart"),this._moved=!0),o.Util.cancelAnimFrame(this._animRequest),this._animRequest=o.Util.requestAnimFrame(this._updateOnMove,this,!0,this._map._container),o.DomEvent.preventDefault(t))}},_updateOnMove:function(){var t=this._map,e=this._getScaleOrigin(),i=t.layerPointToLatLng(e),n=t.getScaleZoom(this._scale);t._animateZoom(i,n,this._startCenter,this._scale,this._delta,!1,!0)},_onTouchEnd:function(){if(!this._moved||!this._zooming)return void(this._zooming=!1);var t=this._map;this._zooming=!1,o.DomUtil.removeClass(t._mapPane,"leaflet-touching"),o.Util.cancelAnimFrame(this._animRequest),o.DomEvent.off(e,"touchmove",this._onTouchMove).off(e,"touchend",this._onTouchEnd);var i=this._getScaleOrigin(),n=t.layerPointToLatLng(i),s=t.getZoom(),a=t.getScaleZoom(this._scale)-s,r=a>0?Math.ceil(a):Math.floor(a),h=t._limitZoom(s+r),l=t.getZoomScale(h)/this._scale;t._animateZoom(n,h,i,l)},_getScaleOrigin:function(){var t=this._centerOffset.subtract(this._delta).divideBy(this._scale);return this._startCenter.add(t)}}),o.Map.addInitHook("addHandler","touchZoom",o.Map.TouchZoom),o.Map.mergeOptions({tap:!0,tapTolerance:15}),o.Map.Tap=o.Handler.extend({addHooks:function(){o.DomEvent.on(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){o.DomEvent.off(this._map._container,"touchstart",this._onDown,this)},_onDown:function(t){if(t.touches){if(o.DomEvent.preventDefault(t),this._fireClick=!0,t.touches.length>1)return this._fireClick=!1,void clearTimeout(this._holdTimeout);var i=t.touches[0],n=i.target;this._startPos=this._newPos=new o.Point(i.clientX,i.clientY),n.tagName&&"a"===n.tagName.toLowerCase()&&o.DomUtil.addClass(n,"leaflet-active"),this._holdTimeout=setTimeout(o.bind(function(){this._isTapValid()&&(this._fireClick=!1,this._onUp(),this._simulateEvent("contextmenu",i))},this),1e3),o.DomEvent.on(e,"touchmove",this._onMove,this).on(e,"touchend",this._onUp,this)}},_onUp:function(t){if(clearTimeout(this._holdTimeout),o.DomEvent.off(e,"touchmove",this._onMove,this).off(e,"touchend",this._onUp,this),this._fireClick&&t&&t.changedTouches){var i=t.changedTouches[0],n=i.target;n&&n.tagName&&"a"===n.tagName.toLowerCase()&&o.DomUtil.removeClass(n,"leaflet-active"),this._isTapValid()&&this._simulateEvent("click",i)}},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_onMove:function(t){var e=t.touches[0];this._newPos=new o.Point(e.clientX,e.clientY)},_simulateEvent:function(i,n){var o=e.createEvent("MouseEvents");o._simulated=!0,n.target._simulatedClick=!0,o.initMouseEvent(i,!0,!0,t,1,n.screenX,n.screenY,n.clientX,n.clientY,!1,!1,!1,!1,0,null),n.target.dispatchEvent(o)}}),o.Browser.touch&&!o.Browser.pointer&&o.Map.addInitHook("addHandler","tap",o.Map.Tap),o.Map.mergeOptions({boxZoom:!0}),o.Map.BoxZoom=o.Handler.extend({initialize:function(t){this._map=t,this._container=t._container,this._pane=t._panes.overlayPane,this._moved=!1},addHooks:function(){o.DomEvent.on(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){o.DomEvent.off(this._container,"mousedown",this._onMouseDown),this._moved=!1},moved:function(){return this._moved},_onMouseDown:function(t){return this._moved=!1,!t.shiftKey||1!==t.which&&1!==t.button?!1:(o.DomUtil.disableTextSelection(),o.DomUtil.disableImageDrag(),this._startLayerPoint=this._map.mouseEventToLayerPoint(t),void o.DomEvent.on(e,"mousemove",this._onMouseMove,this).on(e,"mouseup",this._onMouseUp,this).on(e,"keydown",this._onKeyDown,this))},_onMouseMove:function(t){this._moved||(this._box=o.DomUtil.create("div","leaflet-zoom-box",this._pane),o.DomUtil.setPosition(this._box,this._startLayerPoint),this._container.style.cursor="crosshair",this._map.fire("boxzoomstart"));var e=this._startLayerPoint,i=this._box,n=this._map.mouseEventToLayerPoint(t),s=n.subtract(e),a=new o.Point(Math.min(n.x,e.x),Math.min(n.y,e.y));o.DomUtil.setPosition(i,a),this._moved=!0,i.style.width=Math.max(0,Math.abs(s.x)-4)+"px",i.style.height=Math.max(0,Math.abs(s.y)-4)+"px"},_finish:function(){this._moved&&(this._pane.removeChild(this._box),this._container.style.cursor=""),o.DomUtil.enableTextSelection(),o.DomUtil.enableImageDrag(),o.DomEvent.off(e,"mousemove",this._onMouseMove).off(e,"mouseup",this._onMouseUp).off(e,"keydown",this._onKeyDown)},_onMouseUp:function(t){this._finish();var e=this._map,i=e.mouseEventToLayerPoint(t);if(!this._startLayerPoint.equals(i)){var n=new o.LatLngBounds(e.layerPointToLatLng(this._startLayerPoint),e.layerPointToLatLng(i));e.fitBounds(n),e.fire("boxzoomend",{boxZoomBounds:n})}},_onKeyDown:function(t){27===t.keyCode&&this._finish()}}),o.Map.addInitHook("addHandler","boxZoom",o.Map.BoxZoom),o.Map.mergeOptions({keyboard:!0,keyboardPanOffset:80,keyboardZoomOffset:1}),o.Map.Keyboard=o.Handler.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,173]},initialize:function(t){this._map=t,this._setPanOffset(t.options.keyboardPanOffset),this._setZoomOffset(t.options.keyboardZoomOffset)},addHooks:function(){var t=this._map._container;-1===t.tabIndex&&(t.tabIndex="0"),o.DomEvent.on(t,"focus",this._onFocus,this).on(t,"blur",this._onBlur,this).on(t,"mousedown",this._onMouseDown,this),this._map.on("focus",this._addHooks,this).on("blur",this._removeHooks,this)},removeHooks:function(){this._removeHooks();var t=this._map._container;o.DomEvent.off(t,"focus",this._onFocus,this).off(t,"blur",this._onBlur,this).off(t,"mousedown",this._onMouseDown,this),this._map.off("focus",this._addHooks,this).off("blur",this._removeHooks,this)},_onMouseDown:function(){if(!this._focused){var i=e.body,n=e.documentElement,o=i.scrollTop||n.scrollTop,s=i.scrollLeft||n.scrollLeft;this._map._container.focus(),t.scrollTo(s,o)}},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanOffset:function(t){var e,i,n=this._panKeys={},o=this.keyCodes;for(e=0,i=o.left.length;i>e;e++)n[o.left[e]]=[-1*t,0];for(e=0,i=o.right.length;i>e;e++)n[o.right[e]]=[t,0];for(e=0,i=o.down.length;i>e;e++)n[o.down[e]]=[0,t];for(e=0,i=o.up.length;i>e;e++)n[o.up[e]]=[0,-1*t]},_setZoomOffset:function(t){var e,i,n=this._zoomKeys={},o=this.keyCodes;for(e=0,i=o.zoomIn.length;i>e;e++)n[o.zoomIn[e]]=t;for(e=0,i=o.zoomOut.length;i>e;e++)n[o.zoomOut[e]]=-t},_addHooks:function(){o.DomEvent.on(e,"keydown",this._onKeyDown,this)},_removeHooks:function(){o.DomEvent.off(e,"keydown",this._onKeyDown,this)},_onKeyDown:function(t){var e=t.keyCode,i=this._map;if(e in this._panKeys){if(i._panAnim&&i._panAnim._inProgress)return;i.panBy(this._panKeys[e]),i.options.maxBounds&&i.panInsideBounds(i.options.maxBounds)}else{if(!(e in this._zoomKeys))return;i.setZoom(i.getZoom()+this._zoomKeys[e])}o.DomEvent.stop(t)}}),o.Map.addInitHook("addHandler","keyboard",o.Map.Keyboard),o.Handler.MarkerDrag=o.Handler.extend({initialize:function(t){this._marker=t},addHooks:function(){var t=this._marker._icon;this._draggable||(this._draggable=new o.Draggable(t,t)),this._draggable.on("dragstart",this._onDragStart,this).on("drag",this._onDrag,this).on("dragend",this._onDragEnd,this),this._draggable.enable(),o.DomUtil.addClass(this._marker._icon,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off("dragstart",this._onDragStart,this).off("drag",this._onDrag,this).off("dragend",this._onDragEnd,this),this._draggable.disable(),o.DomUtil.removeClass(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){this._marker.closePopup().fire("movestart").fire("dragstart")},_onDrag:function(){var t=this._marker,e=t._shadow,i=o.DomUtil.getPosition(t._icon),n=t._map.layerPointToLatLng(i);e&&o.DomUtil.setPosition(e,i),t._latlng=n,t.fire("move",{latlng:n}).fire("drag")},_onDragEnd:function(t){this._marker.fire("moveend").fire("dragend",t)}}),o.Control=o.Class.extend({options:{position:"topright"},initialize:function(t){o.setOptions(this,t)},getPosition:function(){return this.options.position},setPosition:function(t){var e=this._map;return e&&e.removeControl(this),this.options.position=t,e&&e.addControl(this),this},getContainer:function(){return this._container},addTo:function(t){this._map=t;var e=this._container=this.onAdd(t),i=this.getPosition(),n=t._controlCorners[i];return o.DomUtil.addClass(e,"leaflet-control"),-1!==i.indexOf("bottom")?n.insertBefore(e,n.firstChild):n.appendChild(e),this},removeFrom:function(t){var e=this.getPosition(),i=t._controlCorners[e];return i.removeChild(this._container),this._map=null,this.onRemove&&this.onRemove(t),this},_refocusOnMap:function(){this._map&&this._map.getContainer().focus()}}),o.control=function(t){return new o.Control(t)},o.Map.include({addControl:function(t){return t.addTo(this),this},removeControl:function(t){return t.removeFrom(this),this},_initControlPos:function(){function t(t,s){var a=i+t+" "+i+s;e[t+s]=o.DomUtil.create("div",a,n)}var e=this._controlCorners={},i="leaflet-",n=this._controlContainer=o.DomUtil.create("div",i+"control-container",this._container);t("top","left"),t("top","right"),t("bottom","left"),t("bottom","right")},_clearControlPos:function(){this._container.removeChild(this._controlContainer)}}),o.Control.Zoom=o.Control.extend({options:{position:"topleft",zoomInText:"+",zoomInTitle:"Zoom in",zoomOutText:"-",zoomOutTitle:"Zoom out"},onAdd:function(t){var e="leaflet-control-zoom",i=o.DomUtil.create("div",e+" leaflet-bar");return this._map=t,this._zoomInButton=this._createButton(this.options.zoomInText,this.options.zoomInTitle,e+"-in",i,this._zoomIn,this),this._zoomOutButton=this._createButton(this.options.zoomOutText,this.options.zoomOutTitle,e+"-out",i,this._zoomOut,this),this._updateDisabled(),t.on("zoomend zoomlevelschange",this._updateDisabled,this),i},onRemove:function(t){t.off("zoomend zoomlevelschange",this._updateDisabled,this)},_zoomIn:function(t){this._map.zoomIn(t.shiftKey?3:1)},_zoomOut:function(t){this._map.zoomOut(t.shiftKey?3:1)},_createButton:function(t,e,i,n,s,a){var r=o.DomUtil.create("a",i,n);r.innerHTML=t,r.href="#",r.title=e;var h=o.DomEvent.stopPropagation;return o.DomEvent.on(r,"click",h).on(r,"mousedown",h).on(r,"dblclick",h).on(r,"click",o.DomEvent.preventDefault).on(r,"click",s,a).on(r,"click",this._refocusOnMap,a),r},_updateDisabled:function(){var t=this._map,e="leaflet-disabled";o.DomUtil.removeClass(this._zoomInButton,e),o.DomUtil.removeClass(this._zoomOutButton,e),t._zoom===t.getMinZoom()&&o.DomUtil.addClass(this._zoomOutButton,e),t._zoom===t.getMaxZoom()&&o.DomUtil.addClass(this._zoomInButton,e)}}),o.Map.mergeOptions({zoomControl:!0}),o.Map.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new o.Control.Zoom,this.addControl(this.zoomControl))}),o.control.zoom=function(t){return new o.Control.Zoom(t)},o.Control.Attribution=o.Control.extend({options:{position:"bottomright",prefix:'<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'},initialize:function(t){o.setOptions(this,t),this._attributions={}},onAdd:function(t){this._container=o.DomUtil.create("div","leaflet-control-attribution"),o.DomEvent.disableClickPropagation(this._container);for(var e in t._layers)t._layers[e].getAttribution&&this.addAttribution(t._layers[e].getAttribution());return t.on("layeradd",this._onLayerAdd,this).on("layerremove",this._onLayerRemove,this),this._update(),this._container},onRemove:function(t){t.off("layeradd",this._onLayerAdd).off("layerremove",this._onLayerRemove)},setPrefix:function(t){return this.options.prefix=t,this._update(),this},addAttribution:function(t){return t?(this._attributions[t]||(this._attributions[t]=0),this._attributions[t]++,this._update(),this):void 0},removeAttribution:function(t){return t?(this._attributions[t]&&(this._attributions[t]--,this._update()),this):void 0},_update:function(){if(this._map){var t=[];for(var e in this._attributions)this._attributions[e]&&t.push(e);var i=[];this.options.prefix&&i.push(this.options.prefix),t.length&&i.push(t.join(", ")),this._container.innerHTML=i.join(" | ")}},_onLayerAdd:function(t){t.layer.getAttribution&&this.addAttribution(t.layer.getAttribution())},_onLayerRemove:function(t){t.layer.getAttribution&&this.removeAttribution(t.layer.getAttribution())}}),o.Map.mergeOptions({attributionControl:!0}),o.Map.addInitHook(function(){this.options.attributionControl&&(this.attributionControl=(new o.Control.Attribution).addTo(this))}),o.control.attribution=function(t){return new o.Control.Attribution(t)},o.Control.Scale=o.Control.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0,updateWhenIdle:!1},onAdd:function(t){this._map=t;var e="leaflet-control-scale",i=o.DomUtil.create("div",e),n=this.options;return this._addScales(n,e,i),t.on(n.updateWhenIdle?"moveend":"move",this._update,this),t.whenReady(this._update,this),i},onRemove:function(t){t.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(t,e,i){t.metric&&(this._mScale=o.DomUtil.create("div",e+"-line",i)),t.imperial&&(this._iScale=o.DomUtil.create("div",e+"-line",i))},_update:function(){var t=this._map.getBounds(),e=t.getCenter().lat,i=6378137*Math.PI*Math.cos(e*Math.PI/180),n=i*(t.getNorthEast().lng-t.getSouthWest().lng)/180,o=this._map.getSize(),s=this.options,a=0;o.x>0&&(a=n*(s.maxWidth/o.x)),this._updateScales(s,a)},_updateScales:function(t,e){t.metric&&e&&this._updateMetric(e),t.imperial&&e&&this._updateImperial(e)},_updateMetric:function(t){var e=this._getRoundNum(t);this._mScale.style.width=this._getScaleWidth(e/t)+"px",this._mScale.innerHTML=1e3>e?e+" m":e/1e3+" km"},_updateImperial:function(t){var e,i,n,o=3.2808399*t,s=this._iScale;o>5280?(e=o/5280,i=this._getRoundNum(e),s.style.width=this._getScaleWidth(i/e)+"px",s.innerHTML=i+" mi"):(n=this._getRoundNum(o),s.style.width=this._getScaleWidth(n/o)+"px",s.innerHTML=n+" ft")},_getScaleWidth:function(t){return Math.round(this.options.maxWidth*t)-10},_getRoundNum:function(t){var e=Math.pow(10,(Math.floor(t)+"").length-1),i=t/e;return i=i>=10?10:i>=5?5:i>=3?3:i>=2?2:1,e*i}}),o.control.scale=function(t){return new o.Control.Scale(t)},o.Control.Layers=o.Control.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0},initialize:function(t,e,i){o.setOptions(this,i),this._layers={},this._lastZIndex=0,this._handlingClick=!1;for(var n in t)this._addLayer(t[n],n);for(n in e)this._addLayer(e[n],n,!0)},onAdd:function(t){return this._initLayout(),this._update(),t.on("layeradd",this._onLayerChange,this).on("layerremove",this._onLayerChange,this),this._container},onRemove:function(t){t.off("layeradd",this._onLayerChange,this).off("layerremove",this._onLayerChange,this)},addBaseLayer:function(t,e){return this._addLayer(t,e),this._update(),this},addOverlay:function(t,e){return this._addLayer(t,e,!0),this._update(),this},removeLayer:function(t){var e=o.stamp(t);return delete this._layers[e],this._update(),this},_initLayout:function(){var t="leaflet-control-layers",e=this._container=o.DomUtil.create("div",t);e.setAttribute("aria-haspopup",!0),o.Browser.touch?o.DomEvent.on(e,"click",o.DomEvent.stopPropagation):o.DomEvent.disableClickPropagation(e).disableScrollPropagation(e);var i=this._form=o.DomUtil.create("form",t+"-list");if(this.options.collapsed){o.Browser.android||o.DomEvent.on(e,"mouseover",this._expand,this).on(e,"mouseout",this._collapse,this);var n=this._layersLink=o.DomUtil.create("a",t+"-toggle",e);n.href="#",n.title="Layers",o.Browser.touch?o.DomEvent.on(n,"click",o.DomEvent.stop).on(n,"click",this._expand,this):o.DomEvent.on(n,"focus",this._expand,this),o.DomEvent.on(i,"click",function(){setTimeout(o.bind(this._onInputClick,this),0)},this),this._map.on("click",this._collapse,this)}else this._expand();this._baseLayersList=o.DomUtil.create("div",t+"-base",i),this._separator=o.DomUtil.create("div",t+"-separator",i),this._overlaysList=o.DomUtil.create("div",t+"-overlays",i),e.appendChild(i)},_addLayer:function(t,e,i){var n=o.stamp(t);this._layers[n]={layer:t,name:e,overlay:i},this.options.autoZIndex&&t.setZIndex&&(this._lastZIndex++,t.setZIndex(this._lastZIndex))},_update:function(){if(this._container){this._baseLayersList.innerHTML="",this._overlaysList.innerHTML="";var t,e,i=!1,n=!1;for(t in this._layers)e=this._layers[t],this._addItem(e),n=n||e.overlay,i=i||!e.overlay;this._separator.style.display=n&&i?"":"none"}},_onLayerChange:function(t){var e=this._layers[o.stamp(t.layer)];if(e){this._handlingClick||this._update();var i=e.overlay?"layeradd"===t.type?"overlayadd":"overlayremove":"layeradd"===t.type?"baselayerchange":null;i&&this._map.fire(i,e)}},_createRadioElement:function(t,i){var n='<input type="radio" class="leaflet-control-layers-selector" name="'+t+'"';i&&(n+=' checked="checked"'),n+="/>";var o=e.createElement("div");return o.innerHTML=n,o.firstChild},_addItem:function(t){var i,n=e.createElement("label"),s=this._map.hasLayer(t.layer);t.overlay?(i=e.createElement("input"),i.type="checkbox",i.className="leaflet-control-layers-selector",i.defaultChecked=s):i=this._createRadioElement("leaflet-base-layers",s),i.layerId=o.stamp(t.layer),o.DomEvent.on(i,"click",this._onInputClick,this);var a=e.createElement("span");a.innerHTML=" "+t.name,n.appendChild(i),n.appendChild(a);var r=t.overlay?this._overlaysList:this._baseLayersList;return r.appendChild(n),n},_onInputClick:function(){var t,e,i,n=this._form.getElementsByTagName("input"),o=n.length;for(this._handlingClick=!0,t=0;o>t;t++)e=n[t],i=this._layers[e.layerId],e.checked&&!this._map.hasLayer(i.layer)?this._map.addLayer(i.layer):!e.checked&&this._map.hasLayer(i.layer)&&this._map.removeLayer(i.layer);this._handlingClick=!1,this._refocusOnMap()},_expand:function(){o.DomUtil.addClass(this._container,"leaflet-control-layers-expanded")},_collapse:function(){this._container.className=this._container.className.replace(" leaflet-control-layers-expanded","")}}),o.control.layers=function(t,e,i){return new o.Control.Layers(t,e,i)},o.PosAnimation=o.Class.extend({includes:o.Mixin.Events,run:function(t,e,i,n){this.stop(),this._el=t,this._inProgress=!0,this._newPos=e,this.fire("start"),t.style[o.DomUtil.TRANSITION]="all "+(i||.25)+"s cubic-bezier(0,0,"+(n||.5)+",1)",o.DomEvent.on(t,o.DomUtil.TRANSITION_END,this._onTransitionEnd,this),o.DomUtil.setPosition(t,e),o.Util.falseFn(t.offsetWidth),this._stepTimer=setInterval(o.bind(this._onStep,this),50)},stop:function(){this._inProgress&&(o.DomUtil.setPosition(this._el,this._getPos()),this._onTransitionEnd(),o.Util.falseFn(this._el.offsetWidth))},_onStep:function(){var t=this._getPos();return t?(this._el._leaflet_pos=t,void this.fire("step")):void this._onTransitionEnd()},_transformRe:/([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,_getPos:function(){var e,i,n,s=this._el,a=t.getComputedStyle(s);if(o.Browser.any3d){if(n=a[o.DomUtil.TRANSFORM].match(this._transformRe),!n)return;e=parseFloat(n[1]),i=parseFloat(n[2])}else e=parseFloat(a.left),i=parseFloat(a.top);return new o.Point(e,i,!0)},_onTransitionEnd:function(){o.DomEvent.off(this._el,o.DomUtil.TRANSITION_END,this._onTransitionEnd,this),this._inProgress&&(this._inProgress=!1,this._el.style[o.DomUtil.TRANSITION]="",this._el._leaflet_pos=this._newPos,clearInterval(this._stepTimer),this.fire("step").fire("end"))}}),o.Map.include({setView:function(t,e,n){if(e=e===i?this._zoom:this._limitZoom(e),t=this._limitCenter(o.latLng(t),e,this.options.maxBounds),n=n||{},this._panAnim&&this._panAnim.stop(),this._loaded&&!n.reset&&n!==!0){n.animate!==i&&(n.zoom=o.extend({animate:n.animate},n.zoom),n.pan=o.extend({animate:n.animate},n.pan));var s=this._zoom!==e?this._tryAnimatedZoom&&this._tryAnimatedZoom(t,e,n.zoom):this._tryAnimatedPan(t,n.pan);if(s)return clearTimeout(this._sizeTimer),this}return this._resetView(t,e),this},panBy:function(t,e){if(t=o.point(t).round(),e=e||{},!t.x&&!t.y)return this;if(this._panAnim||(this._panAnim=new o.PosAnimation,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),e.noMoveStart||this.fire("movestart"),e.animate!==!1){o.DomUtil.addClass(this._mapPane,"leaflet-pan-anim");var i=this._getMapPanePos().subtract(t);this._panAnim.run(this._mapPane,i,e.duration||.25,e.easeLinearity)}else this._rawPanBy(t),this.fire("move").fire("moveend");return this},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){o.DomUtil.removeClass(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(t,e){var i=this._getCenterOffset(t)._floor();return(e&&e.animate)===!0||this.getSize().contains(i)?(this.panBy(i,e),!0):!1}}),o.PosAnimation=o.DomUtil.TRANSITION?o.PosAnimation:o.PosAnimation.extend({run:function(t,e,i,n){this.stop(),this._el=t,this._inProgress=!0,this._duration=i||.25,this._easeOutPower=1/Math.max(n||.5,.2),this._startPos=o.DomUtil.getPosition(t),this._offset=e.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(),this._complete())},_animate:function(){this._animId=o.Util.requestAnimFrame(this._animate,this),this._step()},_step:function(){var t=+new Date-this._startTime,e=1e3*this._duration;e>t?this._runFrame(this._easeOut(t/e)):(this._runFrame(1),this._complete())},_runFrame:function(t){var e=this._startPos.add(this._offset.multiplyBy(t));o.DomUtil.setPosition(this._el,e),this.fire("step")},_complete:function(){o.Util.cancelAnimFrame(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(t){return 1-Math.pow(1-t,this._easeOutPower)}}),o.Map.mergeOptions({zoomAnimation:!0,zoomAnimationThreshold:4}),o.DomUtil.TRANSITION&&o.Map.addInitHook(function(){this._zoomAnimated=this.options.zoomAnimation&&o.DomUtil.TRANSITION&&o.Browser.any3d&&!o.Browser.android23&&!o.Browser.mobileOpera,this._zoomAnimated&&o.DomEvent.on(this._mapPane,o.DomUtil.TRANSITION_END,this._catchTransitionEnd,this)}),o.Map.include(o.DomUtil.TRANSITION?{_catchTransitionEnd:function(t){this._animatingZoom&&t.propertyName.indexOf("transform")>=0&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(t,e,i){if(this._animatingZoom)return!0;if(i=i||{},!this._zoomAnimated||i.animate===!1||this._nothingToAnimate()||Math.abs(e-this._zoom)>this.options.zoomAnimationThreshold)return!1;var n=this.getZoomScale(e),o=this._getCenterOffset(t)._divideBy(1-1/n),s=this._getCenterLayerPoint()._add(o);return i.animate===!0||this.getSize().contains(o)?(this.fire("movestart").fire("zoomstart"),this._animateZoom(t,e,s,n,null,!0),!0):!1},_animateZoom:function(t,e,i,n,s,a,r){r||(this._animatingZoom=!0),o.DomUtil.addClass(this._mapPane,"leaflet-zoom-anim"),this._animateToCenter=t,this._animateToZoom=e,o.Draggable&&(o.Draggable._disabled=!0),o.Util.requestAnimFrame(function(){this.fire("zoomanim",{center:t,zoom:e,origin:i,scale:n,delta:s,backwards:a}),setTimeout(o.bind(this._onZoomTransitionEnd,this),250)},this)},_onZoomTransitionEnd:function(){this._animatingZoom&&(this._animatingZoom=!1,o.DomUtil.removeClass(this._mapPane,"leaflet-zoom-anim"),o.Util.requestAnimFrame(function(){this._resetView(this._animateToCenter,this._animateToZoom,!0,!0),o.Draggable&&(o.Draggable._disabled=!1)},this))}}:{}),o.TileLayer.include({_animateZoom:function(t){this._animating||(this._animating=!0,this._prepareBgBuffer());var e=this._bgBuffer,i=o.DomUtil.TRANSFORM,n=t.delta?o.DomUtil.getTranslateString(t.delta):e.style[i],s=o.DomUtil.getScaleString(t.scale,t.origin);e.style[i]=t.backwards?s+" "+n:n+" "+s},_endZoomAnim:function(){var t=this._tileContainer,e=this._bgBuffer;t.style.visibility="",t.parentNode.appendChild(t),o.Util.falseFn(e.offsetWidth);var i=this._map.getZoom();(i>this.options.maxZoom||i<this.options.minZoom)&&this._clearBgBuffer(),this._animating=!1},_clearBgBuffer:function(){var t=this._map;!t||t._animatingZoom||t.touchZoom._zooming||(this._bgBuffer.innerHTML="",this._bgBuffer.style[o.DomUtil.TRANSFORM]="")},_prepareBgBuffer:function(){var t=this._tileContainer,e=this._bgBuffer,i=this._getLoadedTilesPercentage(e),n=this._getLoadedTilesPercentage(t);return e&&i>.5&&.5>n?(t.style.visibility="hidden",void this._stopLoadingImages(t)):(e.style.visibility="hidden",e.style[o.DomUtil.TRANSFORM]="",this._tileContainer=e,e=this._bgBuffer=t,this._stopLoadingImages(e),void clearTimeout(this._clearBgBufferTimer))},_getLoadedTilesPercentage:function(t){var e,i,n=t.getElementsByTagName("img"),o=0;for(e=0,i=n.length;i>e;e++)n[e].complete&&o++;return o/i},_stopLoadingImages:function(t){var e,i,n,s=Array.prototype.slice.call(t.getElementsByTagName("img"));for(e=0,i=s.length;i>e;e++)n=s[e],n.complete||(n.onload=o.Util.falseFn,n.onerror=o.Util.falseFn,n.src=o.Util.emptyImageUrl,n.parentNode.removeChild(n))}}),o.Map.include({_defaultLocateOptions:{watch:!1,setView:!1,maxZoom:1/0,timeout:1e4,maximumAge:0,enableHighAccuracy:!1},locate:function(t){if(t=this._locateOptions=o.extend(this._defaultLocateOptions,t),!navigator.geolocation)return this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this;var e=o.bind(this._handleGeolocationResponse,this),i=o.bind(this._handleGeolocationError,this);return t.watch?this._locationWatchId=navigator.geolocation.watchPosition(e,i,t):navigator.geolocation.getCurrentPosition(e,i,t),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(t){var e=t.code,i=t.message||(1===e?"permission denied":2===e?"position unavailable":"timeout");this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:e,message:"Geolocation error: "+i+"."})},_handleGeolocationResponse:function(t){var e=t.coords.latitude,i=t.coords.longitude,n=new o.LatLng(e,i),s=180*t.coords.accuracy/40075017,a=s/Math.cos(o.LatLng.DEG_TO_RAD*e),r=o.latLngBounds([e-s,i-a],[e+s,i+a]),h=this._locateOptions;if(h.setView){var l=Math.min(this.getBoundsZoom(r),h.maxZoom);this.setView(n,l)}var u={latlng:n,bounds:r,timestamp:t.timestamp};for(var c in t.coords)"number"==typeof t.coords[c]&&(u[c]=t.coords[c]);this.fire("locationfound",u)}})}(window,document);

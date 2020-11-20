
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

/*!
 * angular-ui-mask
 * https://github.com/angular-ui/ui-mask
 * Version: 1.8.8 - 2019-03-19T20:21:15.176Z
 * License: MIT
 */
!function(){"use strict";angular.module("ui.mask",[]).value("uiMaskConfig",{maskDefinitions:{9:/\d/,A:/[a-zA-Z]/,"*":/[a-zA-Z0-9]/},clearOnBlur:!0,clearOnBlurPlaceholder:!1,escChar:"\\",eventsToHandle:["input","keyup","click","focus"],addDefaultPlaceholder:!0,allowInvalidValue:!1}).provider("uiMask.Config",function(){var e={};this.maskDefinitions=function(n){return e.maskDefinitions=n},this.clearOnBlur=function(n){return e.clearOnBlur=n},this.clearOnBlurPlaceholder=function(n){return e.clearOnBlurPlaceholder=n},this.eventsToHandle=function(n){return e.eventsToHandle=n},this.addDefaultPlaceholder=function(n){return e.addDefaultPlaceholder=n},this.allowInvalidValue=function(n){return e.allowInvalidValue=n},this.$get=["uiMaskConfig",function(n){var t=n;for(var a in e)angular.isObject(e[a])&&!angular.isArray(e[a])?angular.extend(t[a],e[a]):t[a]=e[a];return t}]}).directive("uiMask",["uiMask.Config",function(e){function n(e){return e===document.activeElement&&(!document.hasFocus||document.hasFocus())&&!!(e.type||e.href||~e.tabIndex)}return{priority:100,require:"ngModel",restrict:"A",compile:function(){var t=angular.copy(e);return function(e,a,r,i){function l(){try{return document.createEvent("TouchEvent"),!0}catch(e){return!1}}function u(e){return angular.isDefined(e)?(y(e),Z?(d(),v(),!0):h()):h()}function o(e){e&&(B=e,!Z||0===a.val().length&&angular.isDefined(r.placeholder)||a.val(b(m(a.val()))))}function c(){return u(r.uiMask)}function s(e){return Z?(H=m(e||""),_=p(H),i.$setValidity("mask",_),H.length&&(_||U.allowInvalidValue)?b(H):void 0):e}function f(e){return Z?(H=m(e||""),_=p(H),i.$viewValue=H.length?b(H):"",i.$setValidity("mask",_),_||U.allowInvalidValue?Q?i.$viewValue:H:void 0):e}function h(){return Z=!1,g(),angular.isDefined(W)?a.attr("placeholder",W):a.removeAttr("placeholder"),angular.isDefined(G)?a.attr("maxlength",G):a.removeAttr("maxlength"),a.val(i.$modelValue),i.$viewValue=i.$modelValue,!1}function d(){H=L=m(i.$modelValue||""),R=F=b(H),_=p(H),r.maxlength&&a.attr("maxlength",2*A[A.length-1]),!W&&U.addDefaultPlaceholder&&a.attr("placeholder",B);for(var e=i.$modelValue,n=i.$formatters.length;n--;)e=i.$formatters[n](e);i.$viewValue=e||"",i.$render()}function v(){q||(a.bind("blur",$),a.bind("mousedown mouseup",V),a.bind("keydown",O),a.bind(U.eventsToHandle.join(" "),D),q=!0)}function g(){q&&(a.unbind("blur",$),a.unbind("mousedown",V),a.unbind("mouseup",V),a.unbind("keydown",O),a.unbind("input",D),a.unbind("keyup",D),a.unbind("click",D),a.unbind("focus",D),q=!1)}function p(e){return e.length?e.length>=j:!0}function m(e){var n,t,r="",i=a[0],l=T.slice(),u=N,o=u+S(i),c="";return e=e.toString(),n=0,t=e.length-B.length,angular.forEach(I,function(a){var r=a.position;r>=u&&o>r||(r>=u&&(r+=t),e.substring(r,r+a.value.length)===a.value&&(c+=e.slice(n,r),n=r+a.value.length))}),e=c+e.slice(n),angular.forEach(e.split(""),function(e){l.length&&l[0].test(e)&&(r+=e,l.shift())}),r}function b(e){var n="",t=A.slice();return angular.forEach(B.split(""),function(a,r){e.length&&r===t[0]?(n+=e.charAt(0)||"_",e=e.substr(1),t.shift()):n+=a}),n}function k(e){var n,t=angular.isDefined(r.uiMaskPlaceholder)?r.uiMaskPlaceholder:r.placeholder;return angular.isDefined(t)&&t[e]?t[e]:(n=angular.isDefined(r.uiMaskPlaceholderChar)&&r.uiMaskPlaceholderChar?r.uiMaskPlaceholderChar:"_","space"===n.toLowerCase()?" ":n[0])}function w(){var e,n,t=B.split("");A&&!isNaN(A[0])&&angular.forEach(A,function(e){t[e]="_"}),e=t.join(""),n=e.replace(/[_]+/g,"_").split("_"),n=n.filter(function(e){return""!==e});var a=0;return n.map(function(n){var t=e.indexOf(n,a);return a=t+1,{value:n,position:t}})}function y(e){var n=0;if(A=[],T=[],B="",angular.isString(e)){j=0;var t=!1,a=0,r=e.split(""),i=!1;angular.forEach(r,function(e,r){i?(i=!1,B+=e,n++):U.escChar===e?i=!0:U.maskDefinitions[e]?(A.push(n),B+=k(r-a),T.push(U.maskDefinitions[e]),n++,t||j++,t=!1):"?"===e?(t=!0,a++):(B+=e,n++)})}A.push(A.slice().pop()+1),I=w(),Z=A.length>1?!0:!1}function $(){if((U.clearOnBlur||U.clearOnBlurPlaceholder&&0===H.length&&r.placeholder)&&(N=0,z=0,_&&0!==H.length||(R="",a.val(""),e.$apply(function(){i.$pristine||i.$setViewValue("")}))),H!==X){var n=a.val(),t=""===H&&n&&angular.isDefined(r.uiMaskPlaceholderChar)&&"space"===r.uiMaskPlaceholderChar;t&&a.val(""),E(a[0]),t&&a.val(n)}X=H}function E(e){var n;if(angular.isFunction(window.Event)&&!e.fireEvent)try{n=new Event("change",{view:window,bubbles:!0,cancelable:!1})}catch(t){n=document.createEvent("HTMLEvents"),n.initEvent("change",!1,!0)}finally{e.dispatchEvent(n)}else"createEvent"in document?(n=document.createEvent("HTMLEvents"),n.initEvent("change",!1,!0),e.dispatchEvent(n)):e.fireEvent&&e.fireEvent("onchange")}function V(e){"mousedown"===e.type?a.bind("mouseout",M):a.unbind("mouseout",M)}function M(){z=S(this),a.unbind("mouseout",M)}function O(e){var n=8===e.which,t=x(this)-1||0,r=90===e.which&&e.ctrlKey;if(n){for(;t>=0;){if(P(t)){C(this,t+1);break}t--}K=-1===t}r&&(a.val(""),e.preventDefault())}function D(n){n=n||{};var t=n.which,r=n.type;if(16!==t&&91!==t){var u,o=a.val(),c=F,s=!1,f=m(o),h=L,d=x(this)||0,v=N||0,g=d-v,p=A[0],w=A[f.length]||A.slice().shift(),y=z||0,$=S(this)>0,E=y>0,V=o.length>c.length||y&&o.length>c.length-y,M=o.length<c.length||y&&o.length===c.length-y,O=t>=37&&40>=t&&n.shiftKey,D=37===t,T=8===t||"keyup"!==r&&M&&-1===g,I=46===t||"keyup"!==r&&M&&0===g&&!E,j=(D||T||"click"===r)&&d>p;if(z=S(this),!O&&(!$||"click"!==r&&"keyup"!==r&&"focus"!==r)){if(T&&K)return a.val(B),e.$apply(function(){i.$setViewValue("")}),void C(this,v);if("input"===r&&M&&!E&&f===h){for(;T&&d>p&&!P(d);)d--;for(;I&&w>d&&-1===A.indexOf(d);)d++;var H=A.indexOf(d);f=f.substring(0,H)+f.substring(H+1),f!==h&&(s=!0)}for(u=b(f),F=u,L=f,!s&&o.length>u.length&&(s=!0),a.val(u),s&&e.$apply(function(){i.$setViewValue(u)}),V&&p>=d&&(d=p+1),j&&d--,d=d>w?w:p>d?p:d;!P(d)&&d>p&&w>d;)d+=j?-1:1;if((j&&w>d||V&&!P(v))&&d++,N=d,l()&&!T&&d<f.length){for(var R=f.length;R<u.length&&(!P(R)||k[R]!==u[R]);)R++;d=R}C(this,d)}}}function P(e){return A.indexOf(e)>-1}function x(e){if(!e)return 0;if(void 0!==e.selectionStart)return e.selectionStart;if(document.selection&&n(a[0])){e.focus();var t=document.selection.createRange();return t.moveStart("character",e.value?-e.value.length:0),t.text.length}return 0}function C(e,t){if(!e)return 0;if(0!==e.offsetWidth&&0!==e.offsetHeight)if(e.setSelectionRange)n(a[0])&&(e.focus(),e.setSelectionRange(t,t));else if(e.createTextRange){var r=e.createTextRange();r.collapse(!0),r.moveEnd("character",t),r.moveStart("character",t),r.select()}}function S(e){return e?void 0!==e.selectionStart?e.selectionEnd-e.selectionStart:window.getSelection?window.getSelection().toString().length:document.selection?document.selection.createRange().text.length:0:0}var A,T,B,I,j,H,R,_,F,L,N,z,K,Z=!1,q=!1,W=r.placeholder,G=r.maxlength,J=i.$isEmpty;i.$isEmpty=function(e){return J(Z?m(e||""):e)};var Q=!1;r.$observe("modelViewValue",function(e){"true"===e&&(Q=!0)}),r.$observe("allowInvalidValue",function(e){U.allowInvalidValue=""===e?!0:!!e,s(i.$modelValue)});var U={};r.uiOptions?(U=e.$eval("["+r.uiOptions+"]"),U=angular.isObject(U[0])?function(e,n){for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(void 0===n[t]?n[t]=angular.copy(e[t]):angular.isObject(n[t])&&!angular.isArray(n[t])&&(n[t]=angular.extend({},e[t],n[t])));return n}(t,U[0]):t):U=t,r.$observe("uiMask",u),angular.isDefined(r.uiMaskPlaceholder)?r.$observe("uiMaskPlaceholder",o):r.$observe("placeholder",o),angular.isDefined(r.uiMaskPlaceholderChar)&&r.$observe("uiMaskPlaceholderChar",c),i.$formatters.unshift(s),i.$parsers.unshift(f);var X=a.val();a.bind("mousedown mouseup",V),Array.prototype.indexOf||(Array.prototype.indexOf=function(e){if(null===this)throw new TypeError;var n=Object(this),t=n.length>>>0;if(0===t)return-1;var a=0;if(arguments.length>1&&(a=Number(arguments[1]),a!==a?a=0:0!==a&&a!==1/0&&a!==-(1/0)&&(a=(a>0||-1)*Math.floor(Math.abs(a)))),a>=t)return-1;for(var r=a>=0?a:Math.max(t-Math.abs(a),0);t>r;r++)if(r in n&&n[r]===e)return r;return-1})}}}}])}();

/*! nouislider - 10.0.0 - 2017-05-28 14:52:49 */

!function(a){"function"==typeof define&&define.amd?define([],a):"object"==typeof exports?module.exports=a():window.noUiSlider=a()}(function(){"use strict";function a(a){return"object"==typeof a&&"function"==typeof a.to&&"function"==typeof a.from}function b(a){a.parentElement.removeChild(a)}function c(a){a.preventDefault()}function d(a){return a.filter(function(a){return this[a]?!1:this[a]=!0},{})}function e(a,b){return Math.round(a/b)*b}function f(a,b){var c=a.getBoundingClientRect(),d=a.ownerDocument,e=d.documentElement,f=o(d);return/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(f.x=0),b?c.top+f.y-e.clientTop:c.left+f.x-e.clientLeft}function g(a){return"number"==typeof a&&!isNaN(a)&&isFinite(a)}function h(a,b,c){c>0&&(l(a,b),setTimeout(function(){m(a,b)},c))}function i(a){return Math.max(Math.min(a,100),0)}function j(a){return Array.isArray(a)?a:[a]}function k(a){a=String(a);var b=a.split(".");return b.length>1?b[1].length:0}function l(a,b){a.classList?a.classList.add(b):a.className+=" "+b}function m(a,b){a.classList?a.classList.remove(b):a.className=a.className.replace(new RegExp("(^|\\b)"+b.split(" ").join("|")+"(\\b|$)","gi")," ")}function n(a,b){return a.classList?a.classList.contains(b):new RegExp("\\b"+b+"\\b").test(a.className)}function o(a){var b=void 0!==window.pageXOffset,c="CSS1Compat"===(a.compatMode||""),d=b?window.pageXOffset:c?a.documentElement.scrollLeft:a.body.scrollLeft,e=b?window.pageYOffset:c?a.documentElement.scrollTop:a.body.scrollTop;return{x:d,y:e}}function p(){return window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"}}function q(){var a=!1;try{var b=Object.defineProperty({},"passive",{get:function(){a=!0}});window.addEventListener("test",null,b)}catch(c){}return a}function r(){return window.CSS&&CSS.supports&&CSS.supports("touch-action","none")}function s(a,b){return 100/(b-a)}function t(a,b){return 100*b/(a[1]-a[0])}function u(a,b){return t(a,a[0]<0?b+Math.abs(a[0]):b-a[0])}function v(a,b){return b*(a[1]-a[0])/100+a[0]}function w(a,b){for(var c=1;a>=b[c];)c+=1;return c}function x(a,b,c){if(c>=a.slice(-1)[0])return 100;var d,e,f,g,h=w(c,a);return d=a[h-1],e=a[h],f=b[h-1],g=b[h],f+u([d,e],c)/s(f,g)}function y(a,b,c){if(c>=100)return a.slice(-1)[0];var d,e,f,g,h=w(c,b);return d=a[h-1],e=a[h],f=b[h-1],g=b[h],v([d,e],(c-f)*s(f,g))}function z(a,b,c,d){if(100===d)return d;var f,g,h=w(d,a);return c?(f=a[h-1],g=a[h],d-f>(g-f)/2?g:f):b[h-1]?a[h-1]+e(d-a[h-1],b[h-1]):d}function A(a,b,c){var d;if("number"==typeof b&&(b=[b]),"[object Array]"!==Object.prototype.toString.call(b))throw new Error("noUiSlider ("+$+"): 'range' contains invalid value.");if(d="min"===a?0:"max"===a?100:parseFloat(a),!g(d)||!g(b[0]))throw new Error("noUiSlider ("+$+"): 'range' value isn't numeric.");c.xPct.push(d),c.xVal.push(b[0]),d?c.xSteps.push(isNaN(b[1])?!1:b[1]):isNaN(b[1])||(c.xSteps[0]=b[1]),c.xHighestCompleteStep.push(0)}function B(a,b,c){if(!b)return!0;c.xSteps[a]=t([c.xVal[a],c.xVal[a+1]],b)/s(c.xPct[a],c.xPct[a+1]);var d=(c.xVal[a+1]-c.xVal[a])/c.xNumSteps[a],e=Math.ceil(Number(d.toFixed(3))-1),f=c.xVal[a]+c.xNumSteps[a]*e;c.xHighestCompleteStep[a]=f}function C(a,b,c){this.xPct=[],this.xVal=[],this.xSteps=[c||!1],this.xNumSteps=[!1],this.xHighestCompleteStep=[],this.snap=b;var d,e=[];for(d in a)a.hasOwnProperty(d)&&e.push([a[d],d]);for(e.sort(e.length&&"object"==typeof e[0][0]?function(a,b){return a[0][0]-b[0][0]}:function(a,b){return a[0]-b[0]}),d=0;d<e.length;d++)A(e[d][1],e[d][0],this);for(this.xNumSteps=this.xSteps.slice(0),d=0;d<this.xNumSteps.length;d++)B(d,this.xNumSteps[d],this)}function D(b){if(a(b))return!0;throw new Error("noUiSlider ("+$+"): 'format' requires 'to' and 'from' methods.")}function E(a,b){if(!g(b))throw new Error("noUiSlider ("+$+"): 'step' is not numeric.");a.singleStep=b}function F(a,b){if("object"!=typeof b||Array.isArray(b))throw new Error("noUiSlider ("+$+"): 'range' is not an object.");if(void 0===b.min||void 0===b.max)throw new Error("noUiSlider ("+$+"): Missing 'min' or 'max' in 'range'.");if(b.min===b.max)throw new Error("noUiSlider ("+$+"): 'range' 'min' and 'max' cannot be equal.");a.spectrum=new C(b,a.snap,a.singleStep)}function G(a,b){if(b=j(b),!Array.isArray(b)||!b.length)throw new Error("noUiSlider ("+$+"): 'start' option is incorrect.");a.handles=b.length,a.start=b}function H(a,b){if(a.snap=b,"boolean"!=typeof b)throw new Error("noUiSlider ("+$+"): 'snap' option must be a boolean.")}function I(a,b){if(a.animate=b,"boolean"!=typeof b)throw new Error("noUiSlider ("+$+"): 'animate' option must be a boolean.")}function J(a,b){if(a.animationDuration=b,"number"!=typeof b)throw new Error("noUiSlider ("+$+"): 'animationDuration' option must be a number.")}function K(a,b){var c,d=[!1];if("lower"===b?b=[!0,!1]:"upper"===b&&(b=[!1,!0]),b===!0||b===!1){for(c=1;c<a.handles;c++)d.push(b);d.push(!1)}else{if(!Array.isArray(b)||!b.length||b.length!==a.handles+1)throw new Error("noUiSlider ("+$+"): 'connect' option doesn't match handle count.");d=b}a.connect=d}function L(a,b){switch(b){case"horizontal":a.ort=0;break;case"vertical":a.ort=1;break;default:throw new Error("noUiSlider ("+$+"): 'orientation' option is invalid.")}}function M(a,b){if(!g(b))throw new Error("noUiSlider ("+$+"): 'margin' option must be numeric.");if(0!==b&&(a.margin=a.spectrum.getMargin(b),!a.margin))throw new Error("noUiSlider ("+$+"): 'margin' option is only supported on linear sliders.")}function N(a,b){if(!g(b))throw new Error("noUiSlider ("+$+"): 'limit' option must be numeric.");if(a.limit=a.spectrum.getMargin(b),!a.limit||a.handles<2)throw new Error("noUiSlider ("+$+"): 'limit' option is only supported on linear sliders with 2 or more handles.")}function O(a,b){if(!g(b))throw new Error("noUiSlider ("+$+"): 'padding' option must be numeric.");if(0!==b){if(a.padding=a.spectrum.getMargin(b),!a.padding)throw new Error("noUiSlider ("+$+"): 'padding' option is only supported on linear sliders.");if(a.padding<0)throw new Error("noUiSlider ("+$+"): 'padding' option must be a positive number.");if(a.padding>=50)throw new Error("noUiSlider ("+$+"): 'padding' option must be less than half the range.")}}function P(a,b){switch(b){case"ltr":a.dir=0;break;case"rtl":a.dir=1;break;default:throw new Error("noUiSlider ("+$+"): 'direction' option was not recognized.")}}function Q(a,b){if("string"!=typeof b)throw new Error("noUiSlider ("+$+"): 'behaviour' must be a string containing options.");var c=b.indexOf("tap")>=0,d=b.indexOf("drag")>=0,e=b.indexOf("fixed")>=0,f=b.indexOf("snap")>=0,g=b.indexOf("hover")>=0;if(e){if(2!==a.handles)throw new Error("noUiSlider ("+$+"): 'fixed' behaviour must be used with 2 handles");M(a,a.start[1]-a.start[0])}a.events={tap:c||f,drag:d,fixed:e,snap:f,hover:g}}function R(a,b){if(b!==!1)if(b===!0){a.tooltips=[];for(var c=0;c<a.handles;c++)a.tooltips.push(!0)}else{if(a.tooltips=j(b),a.tooltips.length!==a.handles)throw new Error("noUiSlider ("+$+"): must pass a formatter for all handles.");a.tooltips.forEach(function(a){if("boolean"!=typeof a&&("object"!=typeof a||"function"!=typeof a.to))throw new Error("noUiSlider ("+$+"): 'tooltips' must be passed a formatter or 'false'.")})}}function S(a,b){a.ariaFormat=b,D(b)}function T(a,b){a.format=b,D(b)}function U(a,b){if(void 0!==b&&"string"!=typeof b&&b!==!1)throw new Error("noUiSlider ("+$+"): 'cssPrefix' must be a string or `false`.");a.cssPrefix=b}function V(a,b){if(void 0!==b&&"object"!=typeof b)throw new Error("noUiSlider ("+$+"): 'cssClasses' must be an object.");if("string"==typeof a.cssPrefix){a.cssClasses={};for(var c in b)b.hasOwnProperty(c)&&(a.cssClasses[c]=a.cssPrefix+b[c])}else a.cssClasses=b}function W(a,b){if(b!==!0&&b!==!1)throw new Error("noUiSlider ("+$+"): 'useRequestAnimationFrame' option should be true (default) or false.");a.useRequestAnimationFrame=b}function X(a){var b={margin:0,limit:0,padding:0,animate:!0,animationDuration:300,ariaFormat:_,format:_},c={step:{r:!1,t:E},start:{r:!0,t:G},connect:{r:!0,t:K},direction:{r:!0,t:P},snap:{r:!1,t:H},animate:{r:!1,t:I},animationDuration:{r:!1,t:J},range:{r:!0,t:F},orientation:{r:!1,t:L},margin:{r:!1,t:M},limit:{r:!1,t:N},padding:{r:!1,t:O},behaviour:{r:!0,t:Q},ariaFormat:{r:!1,t:S},format:{r:!1,t:T},tooltips:{r:!1,t:R},cssPrefix:{r:!1,t:U},cssClasses:{r:!1,t:V},useRequestAnimationFrame:{r:!1,t:W}},d={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal",cssPrefix:"noUi-",cssClasses:{target:"target",base:"base",origin:"origin",handle:"handle",handleLower:"handle-lower",handleUpper:"handle-upper",horizontal:"horizontal",vertical:"vertical",background:"background",connect:"connect",ltr:"ltr",rtl:"rtl",draggable:"draggable",drag:"state-drag",tap:"state-tap",active:"active",tooltip:"tooltip",pips:"pips",pipsHorizontal:"pips-horizontal",pipsVertical:"pips-vertical",marker:"marker",markerHorizontal:"marker-horizontal",markerVertical:"marker-vertical",markerNormal:"marker-normal",markerLarge:"marker-large",markerSub:"marker-sub",value:"value",valueHorizontal:"value-horizontal",valueVertical:"value-vertical",valueNormal:"value-normal",valueLarge:"value-large",valueSub:"value-sub"},useRequestAnimationFrame:!0};a.format&&!a.ariaFormat&&(a.ariaFormat=a.format),Object.keys(c).forEach(function(e){if(void 0===a[e]&&void 0===d[e]){if(c[e].r)throw new Error("noUiSlider ("+$+"): '"+e+"' is required.");return!0}c[e].t(b,void 0===a[e]?d[e]:a[e])}),b.pips=a.pips;var e=[["left","top"],["right","bottom"]];return b.style=e[b.dir][b.ort],b.styleOposite=e[b.dir?0:1][b.ort],b}function Y(a,e,g){function k(a,b){var c=xa.createElement("div");return b&&l(c,b),a.appendChild(c),c}function s(a,b){var c=k(a,e.cssClasses.origin),d=k(c,e.cssClasses.handle);return d.setAttribute("data-handle",b),d.setAttribute("tabindex","0"),d.setAttribute("role","slider"),d.setAttribute("aria-orientation",e.ort?"vertical":"horizontal"),0===b?l(d,e.cssClasses.handleLower):b===e.handles-1&&l(d,e.cssClasses.handleUpper),c}function t(a,b){return b?k(a,e.cssClasses.connect):!1}function u(a,b){ia=[],ja=[],ja.push(t(b,a[0]));for(var c=0;c<e.handles;c++)ia.push(s(b,c)),ra[c]=c,ja.push(t(b,a[c+1]))}function v(a){l(a,e.cssClasses.target),0===e.dir?l(a,e.cssClasses.ltr):l(a,e.cssClasses.rtl),0===e.ort?l(a,e.cssClasses.horizontal):l(a,e.cssClasses.vertical),ha=k(a,e.cssClasses.base)}function w(a,b){return e.tooltips[b]?k(a.firstChild,e.cssClasses.tooltip):!1}function x(){var a=ia.map(w);ea("update",function(b,c,d){if(a[c]){var f=b[c];e.tooltips[c]!==!0&&(f=e.tooltips[c].to(d[c])),a[c].innerHTML=f}})}function y(){ea("update",function(a,b,c,d,f){ra.forEach(function(a){var b=ia[a],d=S(qa,a,0,!0,!0,!0),g=S(qa,a,100,!0,!0,!0),h=f[a],i=e.ariaFormat.to(c[a]);b.children[0].setAttribute("aria-valuemin",d.toFixed(1)),b.children[0].setAttribute("aria-valuemax",g.toFixed(1)),b.children[0].setAttribute("aria-valuenow",h.toFixed(1)),b.children[0].setAttribute("aria-valuetext",i)})})}function z(a,b,c){if("range"===a||"steps"===a)return ta.xVal;if("count"===a){if(!b)throw new Error("noUiSlider ("+$+"): 'values' required for mode 'count'.");var d,e=100/(b-1),f=0;for(b=[];(d=f++*e)<=100;)b.push(d);a="positions"}return"positions"===a?b.map(function(a){return ta.fromStepping(c?ta.getStep(a):a)}):"values"===a?c?b.map(function(a){return ta.fromStepping(ta.getStep(ta.toStepping(a)))}):b:void 0}function A(a,b,c){function e(a,b){return(a+b).toFixed(7)/1}var f={},g=ta.xVal[0],h=ta.xVal[ta.xVal.length-1],i=!1,j=!1,k=0;return c=d(c.slice().sort(function(a,b){return a-b})),c[0]!==g&&(c.unshift(g),i=!0),c[c.length-1]!==h&&(c.push(h),j=!0),c.forEach(function(d,g){var h,l,m,n,o,p,q,r,s,t,u=d,v=c[g+1];if("steps"===b&&(h=ta.xNumSteps[g]),h||(h=v-u),u!==!1&&void 0!==v)for(h=Math.max(h,1e-7),l=u;v>=l;l=e(l,h)){for(n=ta.toStepping(l),o=n-k,r=o/a,s=Math.round(r),t=o/s,m=1;s>=m;m+=1)p=k+m*t,f[p.toFixed(5)]=["x",0];q=c.indexOf(l)>-1?1:"steps"===b?2:0,!g&&i&&(q=0),l===v&&j||(f[n.toFixed(5)]=[l,q]),k=n}}),f}function B(a,b,c){function d(a,b){var c=b===e.cssClasses.value,d=c?j:m,f=c?h:i;return b+" "+d[e.ort]+" "+f[a]}function f(a,f){f[1]=f[1]&&b?b(f[0],f[1]):f[1];var h=k(g,!1);h.className=d(f[1],e.cssClasses.marker),h.style[e.style]=a+"%",f[1]&&(h=k(g,!1),h.className=d(f[1],e.cssClasses.value),h.style[e.style]=a+"%",h.innerText=c.to(f[0]))}var g=xa.createElement("div"),h=[e.cssClasses.valueNormal,e.cssClasses.valueLarge,e.cssClasses.valueSub],i=[e.cssClasses.markerNormal,e.cssClasses.markerLarge,e.cssClasses.markerSub],j=[e.cssClasses.valueHorizontal,e.cssClasses.valueVertical],m=[e.cssClasses.markerHorizontal,e.cssClasses.markerVertical];return l(g,e.cssClasses.pips),l(g,0===e.ort?e.cssClasses.pipsHorizontal:e.cssClasses.pipsVertical),Object.keys(a).forEach(function(b){f(b,a[b])}),g}function C(){la&&(b(la),la=null)}function D(a){C();var b=a.mode,c=a.density||1,d=a.filter||!1,e=a.values||!1,f=a.stepped||!1,g=z(b,e,f),h=A(c,b,g),i=a.format||{to:Math.round};return la=pa.appendChild(B(h,d,i))}function E(){var a=ha.getBoundingClientRect(),b="offset"+["Width","Height"][e.ort];return 0===e.ort?a.width||ha[b]:a.height||ha[b]}function F(a,b,c,d){var f=function(b){return pa.hasAttribute("disabled")?!1:n(pa,e.cssClasses.tap)?!1:(b=G(b,d.pageOffset))?a===ma.start&&void 0!==b.buttons&&b.buttons>1?!1:d.hover&&b.buttons?!1:(oa||b.preventDefault(),b.calcPoint=b.points[e.ort],void c(b,d)):!1},g=[];return a.split(" ").forEach(function(a){b.addEventListener(a,f,oa?{passive:!0}:!1),g.push([a,f])}),g}function G(a,b){var c,d,e=0===a.type.indexOf("touch"),f=0===a.type.indexOf("mouse"),g=0===a.type.indexOf("pointer");if(0===a.type.indexOf("MSPointer")&&(g=!0),e){if(a.touches.length>1)return!1;c=a.changedTouches[0].pageX,d=a.changedTouches[0].pageY}return b=b||o(xa),(f||g)&&(c=a.clientX+b.x,d=a.clientY+b.y),a.pageOffset=b,a.points=[c,d],a.cursor=f||g,a}function H(a){var b=a-f(ha,e.ort),c=100*b/E();return e.dir?100-c:c}function I(a){var b=100,c=!1;return ia.forEach(function(d,e){if(!d.hasAttribute("disabled")){var f=Math.abs(qa[e]-a);b>f&&(c=e,b=f)}}),c}function J(a,b,c,d){var e=c.slice(),f=[!a,a],g=[a,!a];d=d.slice(),a&&d.reverse(),d.length>1?d.forEach(function(a,c){var d=S(e,a,e[a]+b,f[c],g[c],!1);d===!1?b=0:(b=d-e[a],e[a]=d)}):f=g=[!0];var h=!1;d.forEach(function(a,d){h=W(a,c[a]+b,f[d],g[d])||h}),h&&d.forEach(function(a){K("update",a),K("slide",a)})}function K(a,b,c){Object.keys(va).forEach(function(d){var f=d.split(".")[0];a===f&&va[d].forEach(function(a){a.call(ka,ua.map(e.format.to),b,ua.slice(),c||!1,qa.slice())})})}function L(a,b){"mouseout"===a.type&&"HTML"===a.target.nodeName&&null===a.relatedTarget&&N(a,b)}function M(a,b){if(-1===navigator.appVersion.indexOf("MSIE 9")&&0===a.buttons&&0!==b.buttonsProperty)return N(a,b);var c=(e.dir?-1:1)*(a.calcPoint-b.startCalcPoint),d=100*c/b.baseSize;J(c>0,d,b.locations,b.handleNumbers)}function N(a,b){sa&&(m(sa,e.cssClasses.active),sa=!1),a.cursor&&(za.style.cursor="",za.removeEventListener("selectstart",c)),wa.forEach(function(a){ya.removeEventListener(a[0],a[1])}),m(pa,e.cssClasses.drag),V(),b.handleNumbers.forEach(function(a){K("change",a),K("set",a),K("end",a)})}function O(a,b){if(1===b.handleNumbers.length){var d=ia[b.handleNumbers[0]];if(d.hasAttribute("disabled"))return!1;sa=d.children[0],l(sa,e.cssClasses.active)}a.stopPropagation();var f=F(ma.move,ya,M,{startCalcPoint:a.calcPoint,baseSize:E(),pageOffset:a.pageOffset,handleNumbers:b.handleNumbers,buttonsProperty:a.buttons,locations:qa.slice()}),g=F(ma.end,ya,N,{handleNumbers:b.handleNumbers}),h=F("mouseout",ya,L,{handleNumbers:b.handleNumbers});wa=f.concat(g,h),a.cursor&&(za.style.cursor=getComputedStyle(a.target).cursor,ia.length>1&&l(pa,e.cssClasses.drag),za.addEventListener("selectstart",c,!1)),b.handleNumbers.forEach(function(a){K("start",a)})}function P(a){a.stopPropagation();var b=H(a.calcPoint),c=I(b);return c===!1?!1:(e.events.snap||h(pa,e.cssClasses.tap,e.animationDuration),W(c,b,!0,!0),V(),K("slide",c,!0),K("update",c,!0),K("change",c,!0),K("set",c,!0),void(e.events.snap&&O(a,{handleNumbers:[c]})))}function Q(a){var b=H(a.calcPoint),c=ta.getStep(b),d=ta.fromStepping(c);Object.keys(va).forEach(function(a){"hover"===a.split(".")[0]&&va[a].forEach(function(a){a.call(ka,d)})})}function R(a){a.fixed||ia.forEach(function(a,b){F(ma.start,a.children[0],O,{handleNumbers:[b]})}),a.tap&&F(ma.start,ha,P,{}),a.hover&&F(ma.move,ha,Q,{hover:!0}),a.drag&&ja.forEach(function(b,c){if(b!==!1&&0!==c&&c!==ja.length-1){var d=ia[c-1],f=ia[c],g=[b];l(b,e.cssClasses.draggable),a.fixed&&(g.push(d.children[0]),g.push(f.children[0])),g.forEach(function(a){F(ma.start,a,O,{handles:[d,f],handleNumbers:[c-1,c]})})}})}function S(a,b,c,d,f,g){return ia.length>1&&(d&&b>0&&(c=Math.max(c,a[b-1]+e.margin)),f&&b<ia.length-1&&(c=Math.min(c,a[b+1]-e.margin))),ia.length>1&&e.limit&&(d&&b>0&&(c=Math.min(c,a[b-1]+e.limit)),f&&b<ia.length-1&&(c=Math.max(c,a[b+1]-e.limit))),e.padding&&(0===b&&(c=Math.max(c,e.padding)),b===ia.length-1&&(c=Math.min(c,100-e.padding))),c=ta.getStep(c),c=i(c),c!==a[b]||g?c:!1}function T(a){return a+"%"}function U(a,b){qa[a]=b,ua[a]=ta.fromStepping(b);var c=function(){ia[a].style[e.style]=T(b),Y(a),Y(a+1)};window.requestAnimationFrame&&e.useRequestAnimationFrame?window.requestAnimationFrame(c):c()}function V(){ra.forEach(function(a){var b=qa[a]>50?-1:1,c=3+(ia.length+b*a);ia[a].childNodes[0].style.zIndex=c})}function W(a,b,c,d){return b=S(qa,a,b,c,d,!1),b===!1?!1:(U(a,b),!0)}function Y(a){if(ja[a]){var b=0,c=100;0!==a&&(b=qa[a-1]),a!==ja.length-1&&(c=qa[a]),ja[a].style[e.style]=T(b),ja[a].style[e.styleOposite]=T(100-c)}}function Z(a,b){null!==a&&a!==!1&&("number"==typeof a&&(a=String(a)),a=e.format.from(a),a===!1||isNaN(a)||W(b,ta.toStepping(a),!1,!1))}function _(a,b){var c=j(a),d=void 0===qa[0];b=void 0===b?!0:!!b,c.forEach(Z),e.animate&&!d&&h(pa,e.cssClasses.tap,e.animationDuration),ra.forEach(function(a){W(a,qa[a],!0,!1)}),V(),ra.forEach(function(a){K("update",a),null!==c[a]&&b&&K("set",a)})}function aa(a){_(e.start,a)}function ba(){var a=ua.map(e.format.to);return 1===a.length?a[0]:a}function ca(){for(var a in e.cssClasses)e.cssClasses.hasOwnProperty(a)&&m(pa,e.cssClasses[a]);for(;pa.firstChild;)pa.removeChild(pa.firstChild);delete pa.noUiSlider}function da(){return qa.map(function(a,b){var c=ta.getNearbySteps(a),d=ua[b],e=c.thisStep.step,f=null;e!==!1&&d+e>c.stepAfter.startValue&&(e=c.stepAfter.startValue-d),f=d>c.thisStep.startValue?c.thisStep.step:c.stepBefore.step===!1?!1:d-c.stepBefore.highestStep,100===a?e=null:0===a&&(f=null);var g=ta.countStepDecimals();return null!==e&&e!==!1&&(e=Number(e.toFixed(g))),null!==f&&f!==!1&&(f=Number(f.toFixed(g))),[f,e]})}function ea(a,b){va[a]=va[a]||[],va[a].push(b),"update"===a.split(".")[0]&&ia.forEach(function(a,b){K("update",b)})}function fa(a){var b=a&&a.split(".")[0],c=b&&a.substring(b.length);Object.keys(va).forEach(function(a){var d=a.split(".")[0],e=a.substring(d.length);b&&b!==d||c&&c!==e||delete va[a]})}function ga(a,b){var c=ba(),d=["margin","limit","padding","range","animate","snap","step","format"];d.forEach(function(b){void 0!==a[b]&&(g[b]=a[b])});var f=X(g);d.forEach(function(b){void 0!==a[b]&&(e[b]=f[b])}),ta=f.spectrum,e.margin=f.margin,e.limit=f.limit,e.padding=f.padding,e.pips&&D(e.pips),qa=[],_(a.start||c,b)}var ha,ia,ja,ka,la,ma=p(),na=r(),oa=na&&q(),pa=a,qa=[],ra=[],sa=!1,ta=e.spectrum,ua=[],va={},wa=null,xa=a.ownerDocument,ya=xa.documentElement,za=xa.body;if(pa.noUiSlider)throw new Error("noUiSlider ("+$+"): Slider was already initialized.");return v(pa),u(e.connect,ha),ka={destroy:ca,steps:da,on:ea,off:fa,get:ba,set:_,reset:aa,__moveHandles:function(a,b,c){J(a,b,qa,c)},options:g,updateOptions:ga,target:pa,removePips:C,pips:D},R(e.events),_(e.start),e.pips&&D(e.pips),e.tooltips&&x(),y(),ka}function Z(a,b){if(!a||!a.nodeName)throw new Error("noUiSlider ("+$+"): create requires a single element, got: "+a);var c=X(b,a),d=Y(a,c,b);return a.noUiSlider=d,d}var $="10.0.0";C.prototype.getMargin=function(a){var b=this.xNumSteps[0];if(b&&a/b%1!==0)throw new Error("noUiSlider ("+$+"): 'limit', 'margin' and 'padding' must be divisible by step.");return 2===this.xPct.length?t(this.xVal,a):!1},C.prototype.toStepping=function(a){return a=x(this.xVal,this.xPct,a)},C.prototype.fromStepping=function(a){return y(this.xVal,this.xPct,a)},C.prototype.getStep=function(a){return a=z(this.xPct,this.xSteps,this.snap,a)},C.prototype.getNearbySteps=function(a){var b=w(a,this.xPct);return{stepBefore:{startValue:this.xVal[b-2],step:this.xNumSteps[b-2],highestStep:this.xHighestCompleteStep[b-2]},thisStep:{startValue:this.xVal[b-1],step:this.xNumSteps[b-1],highestStep:this.xHighestCompleteStep[b-1]},stepAfter:{startValue:this.xVal[b-0],step:this.xNumSteps[b-0],highestStep:this.xHighestCompleteStep[b-0]}}},C.prototype.countStepDecimals=function(){var a=this.xNumSteps.map(k);return Math.max.apply(null,a)},C.prototype.convert=function(a){return this.getStep(this.toStepping(a))};var _={to:function(a){return void 0!==a&&a.toFixed(2)},from:Number};return{version:$,create:Z}});

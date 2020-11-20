(function(){
  var fileNsPrefix = (function() {
    'use strict';
    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length - 1];
    var scriptName = lastScript.src;
    var parts = scriptName.split('/');
    var partsLength = parts.length - 1;
    var thisScript = parts[partsLength--];
    if (thisScript === "") {
      thisScript = parts[partsLength--];
    }

    // Fix to handle cases where js files are inside zip files
    // https://dev-card.na31.visual.force.com/resource/1509484368000/dev_card__cardframework_core_assets/latest/cardframework.js

    //fix for finding nsPrefix in subpaths and subdomains
    if (scriptName.indexOf('__') != -1) {
      while(thisScript.indexOf('__') == -1 && partsLength >= 0) {
        thisScript = parts[partsLength];
        partsLength--;
      }
    }

    var lowerCasePrefix = thisScript.indexOf('__') == -1 ? '' : thisScript.substring(0, thisScript.indexOf('__') + 2);
    //check for the cached namespace first
    lowerCasePrefix = lowerCasePrefix === '' && localStorage.getItem('nsPrefix') ? localStorage.getItem('nsPrefix'): lowerCasePrefix;
    
    if(lowerCasePrefix !== ''){
        lowerCasePrefix = /__$/.test(lowerCasePrefix) ? lowerCasePrefix : lowerCasePrefix + '__';
    }
    if (lowerCasePrefix.length === 0) {
      return function() {
        //then check if the app has put a namespace and take that one as it is newer
        lowerCasePrefix = window.nsPrefix ? window.nsPrefix: lowerCasePrefix;
        //add the underscore if it doesn't have them    
        if(lowerCasePrefix !== ""){
            lowerCasePrefix = /__$/.test(lowerCasePrefix) ? lowerCasePrefix : lowerCasePrefix + '__';
        }  
        return lowerCasePrefix;
      };
    } else {
      var resolvedNs = null;
      return function() {
        if (resolvedNs) {
          return resolvedNs;
        }
        // hack to make scan SF objects for the correct case
        try {
          var tofind = lowerCasePrefix.replace('__', '');
          var name;
          var scanObjectForNs = function(object, alreadySeen) {
            if (object && object !== window && alreadySeen.indexOf(object) == -1) {
                alreadySeen.push(object);
                Object.keys(object).forEach(function(key) {
                  if (key === 'ns') {
                    // do ns test
                    if (typeof object[key] === 'string' && object[key].toLowerCase() === tofind) {
                      name = object[key] + '__';
                      return false;
                    }
                  }
                  if (Object.prototype.toString.call(object[key]) === '[object Array]') {
                    object[key].forEach(function(value) {
                      var result = scanObjectForNs(value, alreadySeen);
                      if (result) {
                          name = result;
                          return false;
                      }
                    });
                  } else if (typeof object[key] == 'object') {
                    var result = scanObjectForNs(object[key], alreadySeen);
                    if (result) {
                        name = result;
                        return false;
                    }
                  }
                  if (name) {
                    return false;
                  }
                });
                if (name) {
                  return name;
                }
            };
          }
          if(typeof Visualforce !== 'undefined') { //inside VF
            scanObjectForNs(Visualforce.remoting.Manager.providers, []);  
          } else {
            return lowerCasePrefix;
          }
          if (name) {
            return resolvedNs = name;
          } else {
            return resolvedNs = lowerCasePrefix;
          }
        } catch (e) {
          return lowerCasePrefix;
        }
      };
    }
  })();

  var fileNsPrefixDot = function() {
    var prefix = fileNsPrefix();
    if (prefix.length > 1) {
      return prefix.replace('__', '.');
    } else {
      return prefix;
    }
  };(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
angular.module('templatepreview', ['vlocity', 'viaDirectives', 'CardFramework', 'forceng', 'sldsangular'])
  .config(['remoteActionsProvider', function(remoteActionsProvider) {
      'use strict';
      remoteActionsProvider.setRemoteActions(window.remoteActions || {});
  }]).config(function($locationProvider) {
      'use strict';
      $locationProvider.html5Mode({
          enabled: !!(window.history && history.pushState),
          requireBase: false
      });
  }).config(['$compileProvider', function ($compileProvider) {
      'use strict';
      $compileProvider.debugInfoEnabled(false);
  }]).run(['$rootScope', 'force', 'cardIconFactory', function($rootScope, force, cardIconFactory) {
      'use strict';
      $rootScope.nsPrefix = fileNsPrefix();
      $rootScope.sessionId = window.sessionId;
      $rootScope.cardIconFactory = cardIconFactory;
      force.init({accessToken: window.sessionId, useProxy: false});
  }]);

require('./modules/templatepreview/controller/TemplatePreviewController.js');
},{"./modules/templatepreview/controller/TemplatePreviewController.js":2}],2:[function(require,module,exports){
angular.module('templatepreview')
  .controller('templatePreview', function($scope, $rootScope, remoteActions, userProfileService, htmlUnescapeFilter, $templateCache) {
      'use strict';
      var templateId = window.location ? window.location.href.split(/[?&]/).find(function(item) {
        return /^templateId\=/.test(item);
    }) : null;

      templateId = templateId.replace('templateId=', '');

      function insertCSS(templateName, cssContent) {
        var head = document.getElementsByTagName('head')[0];
        var cssId = templateName + '.css';
        var existingStyle = document.getElementById(cssId);
        if (!existingStyle) { //style does not exist
            existingStyle = document.createElement('style');
            existingStyle.setAttribute('type', 'text/css');
            existingStyle.setAttribute('id', cssId);
            head.appendChild(existingStyle);
        } else {
            while (existingStyle.firstChild) {
                existingStyle.removeChild(existingStyle.firstChild);
            }
        }
        if (existingStyle.styleSheet) {
            existingStyle.styleSheet.cssText = cssContent;
        } else {
            existingStyle.appendChild(document.createTextNode(cssContent));
        }
    };

    function insertJs(templateName, controllerJS) {
        var tryHeader = '(function () { try { ';
        var catchBlock = '} catch(e) { console.log(\'error in '+templateName+'.js \',e); } })();\n//# sourceURL=vlocity/dynamictemplate/' + templateName + '.js\n';
        var head = document.getElementsByTagName('head')[0];
        var jsId = templateName + '.js';
        var existingScript = document.getElementById(jsId);
        if (!existingScript) { //style does not exist
            existingScript = document.createElement('script');
            existingScript.setAttribute('type', 'text/javascript');
            existingScript.setAttribute('id', jsId);
            head.appendChild(existingScript);
            existingScript.appendChild(document.createTextNode(tryHeader + controllerJS + catchBlock));
        }
    };

      remoteActions.getTemplate(templateId).then(
          function(data) {
              var template = data;
              if (data) {
                  $rootScope.template = template;
                  if (!$rootScope.template[$rootScope.nsPrefix + 'Version__c'] ||  $rootScope.template[$rootScope.nsPrefix + 'Version__c'] === '') {
                      $rootScope.template[$rootScope.nsPrefix + 'Version__c'] = 1.0;
                  }
                  $rootScope.template[$rootScope.nsPrefix + 'HTML__c'] = htmlUnescapeFilter($rootScope.template[$rootScope.nsPrefix + 'HTML__c']);
                  $templateCache.put(template.Id, template[$rootScope.nsPrefix + 'HTML__c']);
                  $rootScope.template[$rootScope.nsPrefix + 'Sass__c'] = htmlUnescapeFilter($rootScope.template[$rootScope.nsPrefix + 'Sass__c']);
                  $rootScope.template[$rootScope.nsPrefix + 'CSS__c'] = htmlUnescapeFilter($rootScope.template[$rootScope.nsPrefix + 'CSS__c']);
                  // Before inserting CSS tag check whether it is defined or not
                  if ($rootScope.template[$rootScope.nsPrefix + 'CSS__c']) {                    
                    insertCSS($rootScope.template.Id, $rootScope.template[$rootScope.nsPrefix + 'CSS__c']);
                  }                  
                  // Before inserting script tag check whether it is defined or not
                  if ($rootScope.template[$rootScope.nsPrefix + 'CustomJavascript__c']) {
                    $rootScope.template[$rootScope.nsPrefix + 'CustomJavascript__c'] = htmlUnescapeFilter($rootScope.template[$rootScope.nsPrefix + 'CustomJavascript__c']);
                    insertJs($rootScope.template.Id, $rootScope.template[$rootScope.nsPrefix + 'CustomJavascript__c']);
                  }
                  try {
                      var json = JSON.parse(htmlUnescapeFilter($rootScope.template[$rootScope.nsPrefix + 'SampleJson__c']));
                      Object.keys(json).forEach(function(key) {
                          $scope[key] = json[key];
                      });
                  } catch (e) {
                      console.log(e);
                  }
                  // also remove oui.css if this is an OMNI template
                  if (/OmniScript/.test($rootScope.template[$rootScope.nsPrefix + 'Type__c'])) {
                      var l = document.createElement('link');
                      l.rel = 'stylesheet';
                      l.href =  '/resource/' + $rootScope.nsPrefix + 'oui';
                      var h = document.getElementsByTagName('head')[0];
                      h.appendChild(l, h);
                  }
              } else {
                  console.log('template retrieval error: Not found');
              }
          },
          function(error) {
              console.log('template retrieval error: ' + error);
          });
  });
},{}]},{},[1]);
})();

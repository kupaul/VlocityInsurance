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
angular.module('insSetValueRules', ['vlocity', 'CardFramework', 'sldsangular', 'forceng', 'ngSanitize', 'cfp.hotkeys', 'monacoEditor', 'insFormulaBuilder'])
    .config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    }]).config(['$compileProvider', function($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }]).run(['$rootScope', function($rootScope) {
        'use strict';
        $rootScope.nsPrefix = fileNsPrefix();
        $rootScope.isLoaded = false;
        $rootScope.isLoaded = false;
        $rootScope.notification = {
            message: '',
            type: '',
            active: false
        };
    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        'use strict';
        return function(sldsURL) {
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]);

// Controllers
require('./modules/insSetValueRules/controller/InsSetValueRulesController.js');

// Templates
require('./modules/insSetValueRules/templates/templates.js');

//Factories
require('./modules/insSetValueRules/factory/InsSetValueRulesService.js');

},{"./modules/insSetValueRules/controller/InsSetValueRulesController.js":2,"./modules/insSetValueRules/factory/InsSetValueRulesService.js":3,"./modules/insSetValueRules/templates/templates.js":4}],2:[function(require,module,exports){
angular.module('insSetValueRules').controller('InsSetValueRulesController', ['$scope', '$rootScope', 'InsSetValueRulesService', '$timeout', 'dataService', 'userProfileService', function($scope, $rootScope, InsSetValueRulesService, $timeout, dataService, userProfileService) {
    'use strict';

    $scope.rules = [];
    $scope.customLabels = [];

    const translationKeys = ['InsSetValueRulesInstructions', 'InsSetValueRulesIncompatibleMethods', 'InsSetValueRulesUnsupportedMethods',
        'InsSetValueRulesProductName', 'InsSetValueRulesParentProduct', 'InsSetValueRulesProductCode', 'InsSetValueRulesValueExpression',
        'InsSetValueRulesExpression', 'InsProductWarning', 'InsSetValueRulesNoData'];

    userProfileService.getUserProfile()
        .then(function(user){
            let userLanguage = user.language.replace("_", "-") || user.language;
            dataService.fetchCustomLabels(translationKeys, userLanguage).then(
                function(translatedLabels) {
                    $scope.customLabels = translatedLabels;
                }
            )
        }
    );

    // Get set value rules
    $scope.getRulesNeedUpgrade = function() {
        InsSetValueRulesService.getAttributeRulesNeedUpgrade($scope)
            .then(function(data) {
                console.log('data', data);
                parseRuleData(data);
            });
    }

    function parseRuleData(data){
        console.log('data.attrRules', data.attrRules);
        if(data.attrRules && data.attrRules.length > 0) {
            for(let i = 0; i < data.attrRules.length; i++) {
                if(data.attrRules[i] && data.attrRules[i].ruleData) {
                    data.attrRules[i].ruleData = JSON.parse(data.attrRules[i].ruleData);
                }
            }
            $scope.rules = data.attrRules;
        } else {
            $scope.rules = null;
        }
    }

    // Save set value rules
    $scope.saveUpgradedRules = function() {
        let inputObj = angular.copy($scope.rules);
        for(let i = 0; i < inputObj.length; i++) {
            if(inputObj[i] && inputObj[i].ruleData) {
                inputObj[i].ruleData = JSON.stringify(inputObj[i].ruleData);
            }
        }
        console.log('inputObj', inputObj);
        const inputMap = {
            'attrRules': inputObj
        }
        InsSetValueRulesService.saveUpgradedAttributeRules($scope, inputMap);
    }
}]);

},{}],3:[function(require,module,exports){
angular.module('insSetValueRules').factory('InsSetValueRulesService', ['dataSourceService', '$q', '$rootScope', '$timeout', function(dataSourceService, $q, $rootScope, $timeout) {
    'use strict';
    const nsPrefix = fileNsPrefix().replace('__', '');

    // Helper function to set error for UI
    /**
     * @param {Object} error
     */
    const errorHandler = function(error) {
        console.error(error);
        $rootScope.notification.type = 'error';
        $rootScope.notification.active = true;
        $rootScope.notification.message = error.message;
        $rootScope.isLoaded = true;
        $timeout(function() {
            $rootScope.notification.active = false;
        }, 3000);
    };

    return {
        getAttributeRulesNeedUpgrade: function(scope) {
            console.log('entered attribute method');
            $rootScope.isLoaded = false;
            const deferred = $q.defer();
            const inputMap = {};
            const datasource = {
                type: 'Dual',
                value: {
                    remoteNSPrefix: nsPrefix,
                    remoteClass: 'AttributeSetValueRuleUpgrade',
                    remoteMethod: 'getAttributeRulesNeedUpgrade',
                    inputMap: inputMap,
                    apexRemoteResultVar: 'result.records',
                    methodType: 'GET',
                    apexRestResultVar: 'result.records',
                }
            };
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null)
                .then(function(data) {
                    deferred.resolve(data);
                    $rootScope.isLoaded = true;
                }, function(error) {
                    errorHandler(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        saveUpgradedAttributeRules: function(scope, inputMap) {
            $rootScope.isLoaded = false;
            const deferred = $q.defer();
            const datasource = {
                type: 'Dual',
                value: {
                    remoteNSPrefix: nsPrefix,
                    remoteClass: 'AttributeSetValueRuleUpgrade',
                    remoteMethod: 'saveUpgradedAttributeRules',
                    inputMap: inputMap,
                    apexRemoteResultVar: 'result.records',
                    methodType: 'GET',
                    apexRestResultVar: 'result.records',
                }
            };
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null)
                .then(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    $rootScope.isLoaded = true;
                }, function(error) {
                    errorHandler(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    };
}]);

},{}],4:[function(require,module,exports){
angular.module("insSetValueRules").run(["$templateCache",function($templateCache){"use strict"}]);

},{}]},{},[1]);
})();

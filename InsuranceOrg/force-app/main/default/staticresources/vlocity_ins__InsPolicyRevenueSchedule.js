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
angular.module('insPolicyRevenueSchedule', ['vlocity',  'cfp.hotkeys',  'CardFramework', 'sldsangular', 'forceng',
    'ngSanitize', 'insValidationHandler'
    ]).config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    }]).config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }]).run(['$rootScope', function($rootScope) {
        'use strict';
        $rootScope.nsPrefix = fileNsPrefix();
        $rootScope.isLoaded = false;
        $rootScope.setLoaded = function(boolean) {
            $rootScope.isLoaded = boolean;
        };
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
    }]).filter('localizeDate', ['$rootScope',  function($rootScope){
        return function(date, locale) {
            const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'};
            const d = new Date(date);
            let formattedDate;
            if (locale) {
                formattedDate = d.toLocaleDateString(locale, options);
            } else {
                formattedDate = (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
            }
            return formattedDate;
        };
    }]).filter('localizeCurrency', ['$rootScope',  function($rootScope){
        return function(amount, locale, currencyCode) {
            return amount.toLocaleString(locale, {style: 'currency', currency: currencyCode});
        };
    }]);

// Controller
require('./modules/insPolicyRevenueSchedule/controller/InsPolicyRevenueScheduleController.js');

// Factory
require('./modules/insPolicyRevenueSchedule/factory/InsPolicyRevenueScheduleService.js');

},{"./modules/insPolicyRevenueSchedule/controller/InsPolicyRevenueScheduleController.js":2,"./modules/insPolicyRevenueSchedule/factory/InsPolicyRevenueScheduleService.js":3}],2:[function(require,module,exports){
angular.module('insPolicyRevenueSchedule').controller('InsPolicyRevenueScheduleController',
    ['$scope', '$rootScope', '$timeout', 'InsPolicyRevenueScheduleService', 'InsValidationHandlerService', 'dataService', '$filter', 'userProfileService', function(
    $scope, $rootScope, $timeout, InsPolicyRevenueScheduleService, InsValidationHandlerService, dataService, $filter, userProfileService) {
    'use strict';

    const translationKeys = ['InsAssetRevenueSchedule'];

    userProfileService.getUserProfile().then(function(user) {
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                $scope.customLabels = translatedLabels;
            }
        );
    });

    /*
    * Check locale format
    * @param {string} locale format
    */
    $scope.checkLocaleFormat = function(locale) {
        //Check if locale is in xx-xx or xx format (some locales are returned in xx-xx-xx format)
        const localeLongFormat = /^[a-zA-Z]{2}[-][a-zA-Z]{2}$/g;
        const localeShortFormat = /^[a-zA-Z]{2}$/g;
        const isLocaleFormatted = localeLongFormat.test(locale) || localeShortFormat.test(locale);
        if (!isLocaleFormatted) {
            locale = locale.match(/[a-zA-Z]{2}[-][a-zA-Z]{2}/g) || locale.match(/^[a-zA-Z]{2}$/g);
            if (Array.isArray(locale)) {
                locale = locale[0];
            }
        }
        return locale;
    }

    $scope.exposeFields = [
        $rootScope.nsPrefix + "date__c",
        $rootScope.nsPrefix +  "periodearnedrevenue__c",
        $rootScope.nsPrefix + "totalearnedrevenue__c",
        $rootScope.nsPrefix + "totalunearnedrevenue__c"
    ];

    $scope.initData = function(id){
        $rootScope.isLoaded = false;
         const inputMap = {
             assetId : id
        };
        InsPolicyRevenueScheduleService.invokeRemoteMethod($scope, 'InsuranceAssetHandler', 'getAssetRevenueSchedule', inputMap);
    };

    $scope.formatCurrency = function(amount, currencyCode) {
        //Check if locale is in xx-xx format (some locales are returned in xx-xx-xx format)
        const requiredLocaleRegex = /^[a-z]{2}[-][a-z]{2}$/g;
        let locale = $rootScope.vlocity.userAnLocale;
        const isLocaleFormatted = requiredLocaleRegex.test(locale);
        if(!isLocaleFormatted) {
            locale = locale.match(/[a-z]{2}[-][a-z]{2}/g)[0];
        }
        return amount.toLocaleString(locale, {style: 'currency', currency: currencyCode});
    }

    $scope.setOrderTerm = function(orderTerm) {
        if ($scope.orderTerm !== orderTerm) {
            $scope.orderAsc = true;
            $scope.orderTerm = orderTerm;
        } else {
            $scope.orderAsc = !$scope.orderAsc;
        }
    };

    $scope.navigateTo = function(id){
        if ((typeof sforce !== 'undefined') && (sforce !== null)) {
            sforce.one.navigateToSObject(id, 'detail');
        } else {
            window.location.href = '/' + id;
        }
    };


}]);

},{}],3:[function(require,module,exports){
angular.module('insPolicyRevenueSchedule')
.factory('InsPolicyRevenueScheduleService', ['$http', 'dataSourceService', 'dataService', '$q', '$rootScope', 'InsValidationHandlerService', function($http, dataSourceService, dataService, $q, $rootScope, InsValidationHandlerService) {
    'use strict';
    let REMOTE_CLASS = 'InsuranceAssetHandler';
    const DUAL_DATASOURCE_NAME = 'Dual';
    const insideOrg = false;
    const errorContainer = {};

    function getDualDataSourceObj(actionObj) {
        let datasource = {};
        let temp = '';
        let nsPrefix = fileNsPrefix().replace('__', '');

        if (actionObj.remote && actionObj.remote.remoteClass) {
            temp = REMOTE_CLASS;
            REMOTE_CLASS = actionObj.remote.remoteClass;
        }
        if (actionObj) {
            datasource.type = DUAL_DATASOURCE_NAME;
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.inputMap = actionObj.remote.params || {};
            datasource.value.remoteClass = REMOTE_CLASS;
            datasource.value.remoteMethod = actionObj.remote.params.methodName;
            datasource.value.endpoint = actionObj.rest.link;
            datasource.value.methodType = actionObj.rest.method;
            datasource.value.body = actionObj.rest.params;
        } else {
            console.log('Error encountered while trying to read the actionObject');
        }
        if (temp) {
            REMOTE_CLASS = temp;
        }
        return datasource;
    }

    return {
        invokeRemoteMethod: function(scope, remoteClass, remoteMethod, inputMap) {
            let deferred = $q.defer();
            let nsPrefix = fileNsPrefix().replace('__', '');
            let datasource = {
                type : 'Dual',
                value : {
                  remoteNSPrefix : nsPrefix,
                  remoteClass : remoteClass,
                  remoteMethod: remoteMethod,
                  inputMap : inputMap,
                  methodType : 'GET',
                  apexRestResultVar : 'result.records'
                }
            };
            console.log('Calling: ', remoteMethod);
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    scope.records = data;
                    scope.assetRevenueSchedule = Object.values(scope.records.result.assetRevenueSchedule);
                    $rootScope.isLoaded = true; 
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    InsValidationHandlerService.throwError(error);
                    $rootScope.isLoaded = true;
                });
            return deferred.promise;
        },
        /**
         * invokeAction : Use this method when the actions are straight forward based on actionObj.
         *
         * @param  {[object]} actionObj [Pass the action object]
         * @return {promise} [Result data]
         */
        invokeAction: function(actionObj) {
            console.log(actionObj);
            let deferred = $q.defer();
            let datasource = getDualDataSourceObj(actionObj);
            $rootScope.isLoaded = false;
            dataSourceService.getData(datasource, null, null).then(
                function(data) {
                    deferred.resolve(data);
                    console.log(data);
                    $rootScope.isLoaded = true;
                }, function(error) {
                    deferred.reject(error);
                    console.log(error);
                    InsValidationHandlerService.throwError(error);
                    $rootScope.isLoaded = true;
                });
            return deferred.promise;
        }
    };
}]);

},{}]},{},[1]);
})();

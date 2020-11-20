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
angular.module('insCoverageModelRuntime', ['vlocity', 'CardFramework', 'insRules', 'sldsangular', 'forceng',
    'ngSanitize', 'cfp.hotkeys', 'insValidationHandler'
    ]).config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    }]).config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }]).run(['$rootScope', 'dataService', function($rootScope, dataService) {
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
    }]).filter('formatCurrency', ['$rootScope', function($rootScope) {
        'use strict';
        let locale = $rootScope.vlocity.userAnLocale;
        const localeLongFormat = /^[a-zA-Z]{2}[-][a-zA-Z]{2}$/g;
        const localeShortFormat = /^[a-zA-Z]{2}$/g;
        const isLocaleFormatted = localeLongFormat.test(locale) || localeShortFormat.test(locale);
        if (!isLocaleFormatted) {
            locale = locale.match(/[a-zA-Z]{2}[-][a-zA-Z]{2}/g) || locale.match(/^[a-zA-Z]{2}$/g);
            if(Array.isArray(locale)){
                locale = locale[0];
            }
        }
        $rootScope.formattedLocale = locale;
        return function(amount, currencyCode) {
            if (amount != null) {
                if (!currencyCode) {
                    currencyCode = $rootScope.vlocity.userCurrency;
                }
                return amount.toLocaleString($rootScope.formattedLocale, { style: 'currency', currency: currencyCode });
            }
        };
    }])

// Controllers
require('./modules/insCoverageModelRuntime/controller/InsCoverageModelRuntimeController.js');
require('./modules/insCoverageModelRuntime/controller/InsCoverageModelController.js');

// Factories
require('./modules/insCoverageModelRuntime/factory/NotificationHandler.js');
require('./modules/insCoverageModelRuntime/factory/InsCoverageModelService.js');
require('./modules/insCoverageModelRuntime/factory/InsQuoteModalService.js');

// Directives
require('./modules/insCoverageModelRuntime/directive/HideNotification.js');
require('./modules/insCoverageModelRuntime/directive/InsCoverageModelRuntimeCollapseHeight.js');


// Templates
require('./modules/insCoverageModelRuntime/templates/templates.js');

},{"./modules/insCoverageModelRuntime/controller/InsCoverageModelController.js":2,"./modules/insCoverageModelRuntime/controller/InsCoverageModelRuntimeController.js":3,"./modules/insCoverageModelRuntime/directive/HideNotification.js":4,"./modules/insCoverageModelRuntime/directive/InsCoverageModelRuntimeCollapseHeight.js":5,"./modules/insCoverageModelRuntime/factory/InsCoverageModelService.js":6,"./modules/insCoverageModelRuntime/factory/InsQuoteModalService.js":7,"./modules/insCoverageModelRuntime/factory/NotificationHandler.js":8,"./modules/insCoverageModelRuntime/templates/templates.js":9}],2:[function(require,module,exports){
angular.module('insCoverageModelRuntime').controller('InsCoverageModelController',
    ['$scope', '$rootScope', 'InsQuoteModalService', 'InsCoverageModelService', 'dataService', 'userProfileService', function(
    $scope, $rootScope, InsQuoteModalService, InsCoverageModelService, dataService, userProfileService) {
    'use strict';
    $rootScope.isLoaded = true;
    var visualForceOrigin = window.origin;
    visualForceOrigin = visualForceOrigin.split('--');
    var lexOrigin = visualForceOrigin[0] + '.lightning.force.com';

    $scope.customLabels = {};
    const translationKeys = ['Name', 'InsCoveragesPremium', 'InsButtonMore', 'InsButtonLess', 'InsButtonShowMore',
        'InsButtonShowLess', 'InsQuoteOptionalCoverages', 'InsAssetInfo', 'InsCoverageNoCoverages'];

    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace('_', '-') || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                $scope.customLabels = translatedLabels;
            }
        )
    })


    $scope.addCoverage = function(coverage, index){
        $rootScope.isLoaded = false;
        var attributeMap = {};
        if(coverage.attributeCategories){
            for(var i = 0; i < coverage.attributeCategories.records.length; i++){
                var category = coverage.attributeCategories.records[i];
                for(var j = 0; j < category.productAttributes.records.length; j++){
                    var attr = category.productAttributes.records[j];
                    if(attr.userValues && attr.userValues.value){
                         attributeMap[attr.code] = attr.userValues.value;
                    } else {
                    attributeMap[attr.code] = attr.userValues;
                    }
                }
            }
        }
        var inputMap = {
             quoteId : $scope.quoteId,
             prodRecordType : 'CoverageSpec',
             productId : coverage.productId,
             attributeValues : attributeMap, 
             reprice: true,
             runRules: true
        }; 
        var message = "ReloadAdjustments";
        parent.postMessage(message, lexOrigin);
        InsCoverageModelService.invokeRemoteMethod($scope, $scope.quoteId, 'InsurancePCRuntimeHandler', 'addChildLine', inputMap);
        $rootScope.optionalCoverages.splice(index, 1);
    };

    //Get Optional Coverages 
    $scope.getCoverages = function(records){
        $rootScope.optionalCoverages = []; 
        if(records && records.childProducts){
            if(records.childProducts.records){
                for(var i = 0; i < records.childProducts.records.length; i++){
                    if(records.childProducts.records[i].isOptional && !records.childProducts.records[i].isSelected && 
                        records.childProducts.records[i][$rootScope.nsPrefix + 'RecordTypeName__c'] === 'CoverageSpec'){
                        $rootScope.optionalCoverages.push(records.childProducts.records[i]);
                    }
                }
            }
            console.log('optionalCoverages', $rootScope.optionalCoverages);
        }
    };

}]);
},{}],3:[function(require,module,exports){
angular.module('insCoverageModelRuntime').controller('InsCoverageModelRuntimeController',
    ['$scope', '$rootScope', 'InsCoverageModelService',  '$timeout', 'dataService', 'userProfileService', function(
    $scope, $rootScope, InsCoverageModelService, $timeout, dataService, userProfileService) {
    'use strict';


    $scope.customLabels = {};

    const translationKeys = ['Name', 'InsCoveragesPremium', 'InsButtonMore', 'InsButtonLess', 'InsProductTax', 'InsProductFee', 'InsProductTotalPrice'];
    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                $scope.customLabels = translatedLabels;
            }
        )
    });

    $scope.row = {};
    $rootScope.isLoaded = true;
    var visualForceOrigin = window.origin;
    visualForceOrigin = visualForceOrigin.split('--');
    var lexOrigin = visualForceOrigin[0] + '.lightning.force.com';

    $scope.vlocValueRow = function(dataType){
        return dataType.toLowerCase();
    };

    $scope.setIndex = function(records){
        let count = 0;
        if(records){
            for(let i = 0; i < records.length; i++){
                if(records[i].lineRecordType === 'CoverageSpec' || records[i][$rootScope.nsPrefix + 'RecordTypeName__c'] === 'CoverageSpec'){
                    count += 1;
                    records[i].index = count;
                }
            }
        }
        $scope.count = count - 1;
        $rootScope.count = count;
    };


    $scope.setAttr = function(row, index){
        $rootScope.config.attr =  Object.assign({}, row);
        row.selected = true;
        $rootScope.index = index;
    };

    /**
     * Format currency based on locale.
     * @param {number} amount - The price to be localized.
     * @param {string} currencyCode - The currency code to localize the amount.
     */
    $scope.formatCurrency = function(value, currencyCode) {
        if(!currencyCode) {
            currencyCode = $rootScope.vlocity.userCurrency;
        }
        if(value != null && typeof value === 'number') {
            return value.toLocaleString($rootScope.vlocity.userAnLocale, { style: 'currency', currency: currencyCode });
        }
        return value;
    };


     $scope.updateQLI = function(action, value, code, productRecord){
        //if root doesn't have action, make it
        if(!action){
            action = {
                updateChildLine: {
                    rest: {
                        "params": {},
                        "method": "updateChildLine",
                        "link": null
                    },
                    remote: {
                        params: {
                            "quoteId": productRecord.QuoteId.fieldValue,
                            "reprice": true,
                            "quoteLineId": productRecord.Id.fieldValue,
                            "methodName": "updateChildLine" ,
                            "runRules" : true
                        }
                    }
                },
                    client: {
                        "params": {}
                    }
                }
                productRecord.actions = {
                    updateChildLine : action
                }
            }
        action.updateChildLine.remote.params.attributeValues = {};
        action.updateChildLine.remote.params.attributeValues[code] = value;
        InsCoverageModelService.invokeAction(action.updateChildLine, $scope);
        var message = "ReloadAdjustments";
        parent.postMessage(message, lexOrigin);
    };


        $scope.toggleOverflow = function(event) {
            var toggleEl = $(event.currentTarget).next();
            if (toggleEl.hasClass('overflow-unset')) {
                toggleEl.removeClass('overflow-unset');
            } else {
                $timeout(function() {
                    toggleEl.addClass('overflow-unset');
                }, 400);
            }
        };

        // Only for multiselect dropdowns
        $scope.countSelected = function(attribute) {
            if (attribute.userValues && attribute.userValues.constructor === Array) {
                attribute.multiSelectCount = attribute.userValues.length;
            } else {
                attribute.userValues = [];
                attribute.multiSelectCount = 0;
            }
        };

        // Only for multiselect dropdowns
        $scope.toggleValue = function(attribute, value, ruleSetValue, record) {
            if (ruleSetValue) {
                return;
            }
            if (attribute.userValues && attribute.userValues.constructor === Array && attribute.userValues[0] && attribute.userValues[0].constructor === Object) {
                angular.forEach(attribute.userValues, function(userValue, i) {
                    angular.forEach(userValue, function(userValueObj, key) {
                        if (key === value.value) {
                            attribute.userValues[i][value.value] = !userValueObj;
                        }
                    });
                });
            } else {
                if (attribute.userValues.indexOf(value.value) > -1) {
                    attribute.userValues.splice(attribute.userValues.indexOf(value.value), 1);
                } else {
                    attribute.userValues.push(value.value);
                }
                $scope.countSelected(attribute);
            }
        };

    $scope.removeQLI = function(record){
        $rootScope.isLoaded = false;
         var inputMap = {
             quoteLineId : record.Id.fieldValue,
             itemRecordType : 'CoverageSpec',
             minCount : 1,
        };
        InsCoverageModelService.invokeRemoteMethod($scope, $scope.quoteId, 'InsurancePCRuntimeHandler', 'deleteChildLine', inputMap);
        record.productId = record.Product2Id.fieldValue;
        var message = "ReloadAdjustments";
        parent.postMessage(message, lexOrigin);
        $timeout(function() {
            if(!record.isGrandChild){
                $rootScope.optionalCoverages.push(record);
            }
        });
    };

       $scope.addCoverage = function(coverage, index){
            $rootScope.isLoaded = false;
            let attributeMap = {};
            if(coverage.attributeCategories){
                for(let i = 0; i < coverage.attributeCategories.records.length; i++){
                    let category = coverage.attributeCategories.records[i];
                    for(let j = 0; j < category.productAttributes.records.length; j++){
                        let attr = category.productAttributes.records[j];
                        if(attr.userValues && attr.userValues.value){
                             attributeMap[attr.code] = attr.userValues.value;
                        } else {
                        attributeMap[attr.code] = attr.userValues;
                        }
                    }
                }
            }
            const inputMap = {
                 quoteId : $scope.quoteId,
                 prodRecordType : 'CoverageSpec',
                 productId : coverage.productId ,
                 attributeValues : attributeMap,
                 subParentId : coverage[$rootScope.nsPrefix + 'SubParentItemId__c'].fieldValue
            };
            const message = "ReloadAdjustments";
            parent.postMessage(message, lexOrigin);
            InsCoverageModelService.invokeRemoteMethod($scope, $scope.quoteId, 'InsurancePCRuntimeHandler', 'addChildLine', inputMap);
            $rootScope.optionalCoverages.splice(index, 1);
        };

        $scope.addRemoveQLI = function(record){
            if(record.isSelected){
                $scope.addCoverage(record);
            } else {
                $scope.removeQLI(record);
            }
        };


}]);

},{}],4:[function(require,module,exports){
angular.module('insCoverageModelRuntime').directive('hideNotification', function($rootScope, $timeout) {
    'use strict';
    return {
        restrict: 'A',
        link: function() {
            $rootScope.$watch('notification.message', function(newValue) {
                // Only fire on notification with message. Notifications without a message
                // will be when it closes
                if (newValue !== '') {
                    $timeout(function() {
                        // After 3 seconds, closes notification on mousedown of anywhere in the
                        // document except the notification itself (X closes though):
                        $('body').on('touchstart mousedown', function(e) {
                            e.preventDefault();
                            $rootScope.log('target: ', e);
                            if (e.target.parentNode.className.indexOf('slds-notify') > -1) {
                                return;
                            }
                            // Clear out notification
                            $timeout(function() {
                                $rootScope.notification.message = '';
                            }, 500);
                            $rootScope.notification.active = false;
                            // Have to apply rootScope
                            $rootScope.$apply();
                            // Unbind mousedown event from whole document
                            $(this).off('touchstart mousedown');
                        });
                    }, 2000);
                }
            });
        }
    };
});

},{}],5:[function(require,module,exports){
angular.module('insCoverageModelRuntime').directive('insCollapseCalcHeight', ['$timeout', function($timeout) {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var watchElementsClassNames = ['.slds-accordion__content', '.vloc-attr-row'];
            scope.$watch(
                // This function returns the value that is watched in the next function.
                // Collecting the length of child elements that would affect the height of this container.
                function() { 
                    var watchElementsLength = 0;
                    watchElementsLength = watchElementsLength + element[0].children.length;
                    angular.forEach(watchElementsClassNames, function(watchElementsClassName) {
                        if ($(element[0]).find(watchElementsClassName) && $(element[0]).find(watchElementsClassName).length) {
                            watchElementsLength = watchElementsLength + $(element[0]).find(watchElementsClassName).length;
                        }
                    });
                    return watchElementsLength;
                },
                function(newValue, oldValue) {
                    var containerHeight = 0;
                    if (newValue !== oldValue || !attrs.style) {
                        $timeout(function() {
                            angular.forEach(element[0].children, function(child) {
                                containerHeight += $(child).outerHeight(true);
                            });
                            containerHeight = containerHeight + 'px';
                            $(element[0]).css({height: containerHeight});
                        }, 250);
                    }
                }
            );
        }
    };
}]);
},{}],6:[function(require,module,exports){
angular.module('insCoverageModelRuntime')
.factory('InsCoverageModelService', ['$http', 'dataSourceService', 'dataService', '$q', '$timeout', '$rootScope', 'InsValidationHandlerService', 'userProfileService', function($http, dataSourceService, dataService, $q, $timeout, $rootScope, InsValidationHandlerService, userProfileService) {
    'use strict';
    var REMOTE_CLASS = 'InsurancePCRuntimeHandler';
    var DUAL_DATASOURCE_NAME = 'Dual';
    var insideOrg = false;
    var errorContainer = {};


    const translationKeys = ['InsProductUpdatedQuoteMessage'];
    let customLabels = {};

    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                customLabels = translatedLabels;
            }
        )
    })

    var refreshList = function(type) {
        var message = {
            event: 'reload'
        };
        $rootScope.$broadcast('vlocity.layout.ins-quote-coverages.events', message);
        $timeout(function() {
            $rootScope.notification.type = 'success';
            $rootScope.notification.active = true;
            $rootScope.notification.message = $rootScope.vlocity.getCustomLabel('InsProductUpdatedQuoteMessage') || 'Successfully Updated Quote';
            $timeout(function() {
                $rootScope.notification.active = false;
            }, 1500);
        }, 1500);
    };

    function getDualDataSourceObj(actionObj) {
        var datasource = {};
        var temp = '';
        var nsPrefix = fileNsPrefix().replace('__', '');

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
        invokeRemoteMethod: function(scope, quoteId, remoteClass, remoteMethod, inputMap) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('Calling: ', remoteMethod);
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = remoteClass;
            datasource.value.remoteMethod = remoteMethod;
            datasource.value.inputMap = inputMap;
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.endpoint = '/services/apexrest/' + nsPrefix + '/v2/campaigns/' + quoteId;
            datasource.value.apexRestResultVar = 'result.records';

            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    refreshList();
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
        invokeAction: function(actionObj, scope) {
            console.log(actionObj);
            var deferred = $q.defer();
            var datasource = getDualDataSourceObj(actionObj);
            $rootScope.isLoaded = false;
            dataSourceService.getData(datasource, null, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    if(data.result.calculatedPrice){
                        if(scope.records.Id){
                            let key = scope.records.Id;
                            if(scope.records.Id.fieldValue){
                                key = scope.records.Id.fieldValue;
                            }
                            scope.records.TotalPrice.fieldValue = data.result.calculatedPrice[key]; 
                        }
                        for(let i = 0; i < scope.records.childProducts.records.length; i++){
                            let key = scope.records.childProducts.records[i].Id;
                            if(typeof(key) === 'object'){
                                key = key.fieldValue;
                            }
                            if(key){
                                scope.records.childProducts.records[i].TotalPrice.fieldValue = data.result.calculatedPrice[key];
                            } 
                            if(scope.records.childProducts.records[i].childProducts){
                                for(let j = 0; j  < scope.records.childProducts.records[i].childProducts.records.length; j++){
                                    let k = scope.records.childProducts.records[i].childProducts.records[j].Id;
                                    if(typeof(k) === 'object'){
                                        k = k.fieldValue;
                                    }
                                    if(k){
                                        scope.records.childProducts.records[i].childProducts.records[j].TotalPrice.fieldValue = data.result.calculatedPrice[k];
                                    }
                                }
                            }
                        }
                    }
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

},{}],7:[function(require,module,exports){
angular.module('insCoverageModelRuntime').factory('InsQuoteModalService',
['$rootScope', '$sldsModal', '$timeout',
function($rootScope, $sldsModal, $timeout) {
    'use strict';
    
     var scrollTop = function(){
        if ('parentIFrame' in window) {
            window.parentIFrame.scrollTo(0);
        } else {
            $('body').scrollTop(0);
        }
    };

    return {
        launchModal: function(scope, layout, records, ctrl, customClass) {
            var modalScope = scope.$new();
            var insModal;
            modalScope.vlocQuote = scope.vlocQuote;
            modalScope.isLayoutLoaded = false;
            modalScope.layout = layout;
            modalScope.records = records;
            modalScope.ctrl = ctrl;
            modalScope.title = 'Map Calc Inputs';
            modalScope.customClass = customClass;
            insModal = $sldsModal({
                scope: modalScope,
                templateUrl: 'modals/ins-quote-modal.tpl.html',
                show: true,
                vlocSlide: true
            });
            // generate click on the modal to get insDropdownHandler directive to work:
            // $timeout(function() {
            //     angular.element('.slds-modal__content').click();
            // }, 500);
        },
        hideModal : function(){
            angular.element('.slds-modal__close').click();
        }
    };
}]);

},{}],8:[function(require,module,exports){
angular.module('insCoverageModelRuntime').factory('NotificationHandler', [
    '$rootScope', '$timeout', function($rootScope, $timeout) {
    'use strict';
    var NotificationHandler = function() {
        this.initialize = function() {

        };
        this.handleError = function(error) {
            $rootScope.notification.message = error.data.message || error.data.error;
            $rootScope.notification.type = 'error';
            $rootScope.notification.active = true;
        }; 

        this.handleSuccess = function(message) {
            console.log('message', message);
            $rootScope.notification.message = message;
            $rootScope.notification.type = 'success';
            $rootScope.notification.active = true;
        };

        this.hide = function(){
            $timeout(function() {
                $rootScope.notification.active = false;
            }, 3000);
        };

        this.initialize();
    };
    return (NotificationHandler);
}]);
},{}],9:[function(require,module,exports){
angular.module("insCoverageModelRuntime").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("ins-attribute-display.tpl.html",'<div ng-repeat="category in categories" class="slds-grid slds-wrap" ng-class="{\'slds-p-left_large slds-p-top_small\' : record.showMore || !showFirstAttr}" \n   ng-hide="($index !== 0 && !record.showMore && showFirstAttr)">\n   <div class="slds-text-title_caps" ng-if="record.showMore || !showFirstAttr" class="slds-label">{{category.Name}}</div>\n   <div class="slds-size_1-of-1 slds-grid slds-wrap">\n      <div ng-repeat="attr in category.productAttributes.records" ng-if="!attr.hiddenByRule && !attr.adjustmentUnits && !attr.hidden" ng-hide="($index !== 0 && !record.showMore && showFirstAttr)" ng-class="{\'slds-size_1-of-1\': !record.showMore && showFirstAttr, \'slds-size_1-of-3\' : record.showMore || !showFirstAttr}"\n      ins-rules-evaluate="attr" ins-rules-product="productRecord">\n         <div class="slds-small-show vloc-attr-cell slds-size_1-of-1 slds-m-top_x-small">\n            <div class="vloc-attr-title-cell slds-truncate vloc-attrs-header-label slds-m-top-x-small" title="{{attr.label}}">\n               <div class="slds-truncate">\n                  {{attr.label}} <span class="slds-float_right slds-p-right_large">{{attr.userValues.label}}</span>\n               </div>\n            </div>\n            \x3c!-- multiselect checkbox --\x3e\n            <div class="vloc-attr-data-cell slds-truncate slds-p-top_xx-small slds-m-right_small">\n               <div class="slds-grid via-ins-attributes-attribute-multiselect-checkbox" ng-if="attr.multiselect && attr.inputType === \'checkbox\'">\n                  <div class="via-ins-attributes-attribute-uservalues" ng-class="{\'slds-size_7-of-12\': !attribute.showOverride}">\n                     <fieldset class="slds-form-element">\n                        <div class="slds-form-element__control">\n                           <span class="slds-checkbox" ng-repeat="value in attr.values" ng-if="!value.hiddenByRule">\n                           <input type="checkbox" id="attr-ms-cb-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}" checked="" ng-model="attr.userValues[$index][value.value]" ng-disabled="true" />\n                           <label class="slds-checkbox__label" for="attr-ms-cb-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}">\n                           <span class="slds-checkbox_faux"></span>\n                           <span class="slds-form-element__label">{{value.label}}</span>\n                           </label>\n                           </span>\n                        </div>\n                     </fieldset>\n                  </div>\n               </div>\n               \x3c!-- multiselect radio --\x3e\n               <div class="slds-grid via-ins-attrs-attr-radio-picklist" ng-if="attr.dataType === \'text\' && attr.inputType === \'radio\'">\n                  <div class="via-ins-attrs-attr-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attr.showOverride, \'slds-size_7-of-12\': !attr.showOverride}">\n                     <fieldset class="slds-form-element">\n                        <div class="slds-form-element__control">\n                           <span class="slds-radio" ng-repeat="value in attr.values" ng-if="!value.hiddenByRule">\n                           <input type="radio" id="attr-radio-pl-{{product.ProductCode}}-{{category.Code__c}}-{{attr.attrId}}-{{value.value}}" ng-checked="value.value === attr.userValues" ng-click="attr.userValues = value.value; importedScope.updateQLI(record.actions, attr.userValues, attr.code)" ng-disabled="true" />\n                           <label class="slds-radio__label" for="attr-radio-pl-{{product.ProductCode}}-{{category.Code__c}}-{{attr.attrId}}-{{value.value}}">\n                           <span class="slds-radio_faux"></span>\n                           <span class="slds-form-element__label">{{value.label}}</span>\n                           </label>\n                           </span>\n                        </div>\n                     </fieldset>\n                  </div>\n               </div>\n               \x3c!-- multiselect dropdown --\x3e\n               <div class="slds-grid via-ins-attrs-attr-multiselect-dropdown" ng-if="attr.multiselect && attr.inputType === \'dropdown\'">\n                  <div class="via-ins-attrs-attr-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attr.showOverride, \'slds-size_7-of-12\': !attr.showOverride}">\n                     <div class="slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open" ng-init="attr.dropdownOpen = false">\n                        <button class="slds-button slds-button_neutral via-ins-attrs-attr-dropdown-button" aria-haspopup="true" title="Show More" ng-model="attr.userValues[$index][value.value]" id="dropdown-{{product.ProductCode}}-{{category.Code__c}}-{{attr.attrId}}" ins-dropdown-handler="attr.dropdownOpen = !attr.dropdownOpen" restrict-element="via-ins-attrs-attr-dropdown-items" ng-init="importedScope.countSelected(attr)">\n                           <span>{{attr.multiSelectCount}} Selected</span>\n                           <slds-button-svg-icon sprite="\'utility\'" icon="\'down\'" extra-classes="\'slds-button__icon_right\'"></slds-button-svg-icon>\n                           <span class="slds-assistive-text">Show More</span>\n                        </button>\n                        <div class="slds-dropdown slds-dropdown_left via-ins-attrs-attr-dropdown-items" ng-show="attr.dropdownOpen" ng-class="{\'slds-is-relative\' : attr.dropdownOpen}">\n                           <ul class="slds-dropdown__list via-ins-attrs-attr-dropdown-items-list" role="menu">\n                              <li class="slds-dropdown__item via-ins-attrs-attr-dropdown-items-item slds-p-around_small"  ng-class="{\'slds-theme_shade\': value.isSelected}" role="presentation" ng-repeat="value in attr.values" ng-click="importedScope.toggleValue(attr, value, value.ruleSetValue, record)" ng-if="!value.hiddenByRule" ng-init="value.isSelected =  (attr.userValues.indexOf(value.value) > -1)">\n                                 <slds-svg-icon sprite="\'utility\'" icon="\'check\'" size="\'x-small\'" extra-classes="\'slds-icon slds-icon_x-small slds-m-right_large slds-m-left_small\'" ng-class="{\'slds-icon_selected\': attr.userValues.indexOf(value.value) > -1}"></slds-svg-icon>\n                                 <span class="slds-truncate" title="Menu Item One">{{value.label}}</span>\n                              </li>\n                           </ul>\n                        </div>\n                     </div>\n                  </div>\n               </div>\n               \x3c!-- dropdown !multiselect --\x3e\n               <div ng-if="attr.inputType === \'dropdown\' && !attr.multiselect">\n                  <div class="slds-form-element__control slds-select_container slds-m-bottom_small">\n                     <div class="slds-select_container">\n                        <select ins-rules-evaluate="attr" ins-rules-product="record" ng-options="value.value as value.label for value in attr.values" ng-model="attr.userValues"  class="slds-select slds-m-right_xx-small" id="select-{{$index}}-{{$parent.$index}}-{{$parent.$parent.$index}}" ng-disabled="true">\n                        </select>\n                     </div>\n                  </div>\n               </div>\n               <div class="vloc-slider_container" ng-if="attr.inputType === \'range\'">\n                  <div class="slds-form-element">\n                     <label class="slds-form-element__label" for="slider-id-01">\n                     <span class="slds-slider-label">\n                     <span class="slds-slider-label__range">{{attr.min}} - {{attr.max}}</span>\n                     </span>\n                     </label>\n                     <div class="slds-form-element__control">\n                        <div class="slds-slider slds-p-right_medium">\n                           <input type="range"  min="{{attr.min}}" max="{{attr.max}}" ins-rules-evaluate="attr" ins-rules-product="record"  id="attr-slider-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}" class="slds-slider__range" ng-disabled="true" ng-model="attr.userValues"/>\n                           <span class="slds-slider__value" aria-hidden="true">{{attr.userValues}}</span>\n                        </div>\n                     </div>\n                  </div>\n               </div>\n               <div class="slds-grid slds-p-bottom_x-small" ng-if=" attr.inputType !== \'radio\' && attr.inputType !== \'dropdown\'  && attr.inputType !== \'checkbox\' && attr.inputType !== \'range\' && attr.inputType !== \'date\' && attr.inputType !== \'datetime\'">\n                  <div class="slds-size_1-of-1">\n                     <input class="slds-input" ins-rules-evaluate="attr" ins-rules-product="record"  ng-model="attr.userValues" ng-disabled="true"/>\n                  </div>\n               </div>\n               <div class="slds-form-element slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open slds-size_1-of-1" ng-if="attr.inputType === \'date\'">\n                  <input class="slds-input slds-m-bottom_small" slds-date-picker ng-model="attr.userValues" ng-disabled="true">\n               </div>\n               <div class="slds-form-element slds-dropdown-trigger slds-dropdown-trigger_click slds-grid slds-wrap slds-size_3-of-4" ng-if="attr.inputType === \'datetime\'">\n                  <input class="slds-input slds-m-bottom_small slds-size_2-of-5 slds-m-right_medium" slds-date-picker ng-model="attr.userValues" ng-disabled="true">\n                  <input class="slds-input slds-m-bottom_small slds-size_2-of-5" slds-time-picker ng-model="attr.userValues"ng-disabled="true">\n               </div>\n               <div class="slds-form-element__control slds-text-align_left" ng-if="attr.inputType === \'checkbox\' && !attr.multiselect">\n                  <span class="slds-checkbox">\n                  <input ins-rules-evaluate="attr" ins-rules-product="record" type="checkbox" name="showmore-attrs-{{$index}}" id="showmore-attrs-{{$index}}" ng-model="attr.userValues"  ng-disabled="true"/>\n                  <label class="slds-checkbox__label slds-m-around_none" for="showmore-attrs-{{$index}}">\n                  <span class="slds-checkbox_faux vloc-check"></span>\n                  </label>\n                  </span>\n               </div>\n            </div>\n         </div>\n      </div>\n   </div>\n</div>'),$templateCache.put("ins-attribute-display-edit.tpl.html",'<div ng-repeat="category in categories" class="slds-grid slds-wrap slds-m-top_x-small"\n   ng-class="{\'slds-m-top_small\' : productRecord.showMore}" ng-hide="($index !== 0 && (!productRecord.showMore && !record.showMore))">\n   <div class="slds-text-title_caps slds-m-bottom_x-small" ng-if="productRecord.showMore || record.showMore">{{category.Name}}</div>\n   <div class="slds-size_1-of-1 slds-grid slds-wrap">\n      <div ng-repeat="attr in category.productAttributes.records | orderBy: \'displaySequence\'" ins-rules-evaluate="attr"\n         ins-rules-product="attrProduct" ng-if="!attr.hiddenByRule && !attr.adjustmentUnits && !attr.hidden"\n         ng-hide="($index !== 0 && !productRecord.showMore && !record.showMore)"\n         ng-class="{\'slds-size_1-of-1\': !productRecord.showMore, \'slds-size_1-of-3\' : (productRecord.showMore || record.showMore && !record.grandchild)}">\n         <div class="vloc-attr-cell slds-size_1-of-1 slds-grid slds-wrap slds-m-right_large slds-is-relative">\n            <div class="vloc-attrs-header-label slds-truncate">\n                {{attr.label}}\n            </div>\n            <div class="vloc-ins-rule-message-container" ng-include="\'ruleMessageTooltip.html\'"></div>\n         </div>\n         <div class="slds-p-top_xx-small"\n            ng-class="{\'slds-truncate\' : attr.inputType !== \'date\' && attr.inputType !== \'datetime\'}">\n            \x3c!-- multiselect checkbox --\x3e\n            <div class="slds-grid vloc-ins-attributes-attribute-multiselect-checkbox"\n               ng-if="attr.multiselect && attr.inputType === \'checkbox\'">\n               <div\n                  ng-class="{\'slds-size_7-of-12\': !attr.showOverride}">\n                  <fieldset class="slds-form-element">\n                     <div class="slds-form-element__control">\n                        <span class="slds-checkbox" ng-repeat="value in attr.values" ng-if="!value.hiddenByRule">\n                           <input type="checkbox"\n                              id="attr-ms-cb-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attr.attributeId}}-{{value.value}}"\n                              checked="" ng-model="attr.userValues[$index][value.value]"\n                              ng-disabled="$index === attr.ruleSetValueIndex && attr.ruleSetValue"\n                              ng-click="importedScope.toggleValue(attr, value, value.ruleSetValue, record)" />\n                           <label class="slds-checkbox__label"\n                              for="attr-ms-cb-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attr.attributeId}}-{{value.value}}">\n                              <span class="slds-checkbox_faux"></span>\n                              <span class="slds-form-element__label">{{value.label}}</span>\n                           </label>\n                        </span>\n                     </div>\n                  </fieldset>\n               </div>\n            </div>\n            \x3c!-- multiselect radio --\x3e\n            <div class="slds-grid"\n               ng-if="attr.dataType === \'text\' && attr.inputType === \'radio\'">\n               <div \n                  ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attr.showOverride, \'slds-size_7-of-12\': !attr.showOverride}">\n                  <fieldset class="slds-form-element">\n                     <div class="slds-form-element__control">\n                        <span class="slds-radio slds-m-bottom_xx-small" ng-repeat="value in attr.values"\n                           ng-if="!value.hiddenByRule">\n                           <input type="radio"\n                              id="attr-radio-pl-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attr.attributeId}}-{{value.value}}"\n                              ng-checked="value.value === attr.userValues" ng-click="attr.userValues = value.value;" />\n                           <label class="slds-radio__label"\n                              for="attr-radio-pl-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attr.attributeId}}-{{value.value}}">\n                              <span class="slds-radio_faux"></span>\n                              <span class="slds-form-element__label">{{value.label}}</span>\n                           </label>\n                        </span>\n                     </div>\n                  </fieldset>\n               </div>\n            </div>\n            \x3c!-- multiselect dropdown --\x3e\n            <div class="slds-grid"\n               ng-if="attr.multiselect && attr.inputType === \'dropdown\'">\n               <div\n                  ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attr.showOverride, \'slds-size_7-of-12\': !attr.showOverride}">\n                  <div class="slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open slds-m-bottom_small"\n                     ng-init="attr.dropdownOpen = false">\n                     <button class="slds-button slds-button_neutral"\n                        aria-haspopup="true" title="Show More" ng-model="attr.userValues[$index][value.value]"\n                        id="dropdown-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attr.attributeId}}"\n                        ins-dropdown-handler="attr.dropdownOpen = !attr.dropdownOpen"\n                        restrict-element="vloc-ins-attrs-attr-dropdown-items"\n                        ng-init="importedScope.countSelected(attr)">\n                        <span>{{attr.multiSelectCount}} {{ ::importedScope.customLabels.Selected }}</span>\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'down\'"\n                           extra-classes="\'slds-button__icon_right\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">\n                           {{ ::importedScope.customLabels.InsButtonShowMore }}</span>\n                     </button>\n                     <div class="slds-dropdown slds-dropdown_left vloc-ins-attrs-attr-dropdown-items"\n                        ng-show="attr.dropdownOpen" ng-class="{\'slds-is-relative\' : attr.dropdownOpen}">\n                        <ul class="slds-dropdown__list" role="menu">\n                           <li class="slds-dropdown__item slds-p-around_small"\n                              ng-class="{\'slds-theme_shade\': attr.userValues.indexOf(value.value) > -1}"\n                              role="presentation" ng-repeat="value in attr.values"\n                              ng-click="importedScope.toggleValue(attr, value, value.ruleSetValue, record)"\n                              ng-if="!value.hiddenByRule">\n                              <slds-svg-icon sprite="\'utility\'" icon="\'check\'" size="\'x-small\'"\n                                 extra-classes="\'slds-icon slds-icon_x-small slds-m-right_large slds-m-left_small\'">\n                              </slds-svg-icon>\n                              <span class="slds-truncate" title="Menu Item One">{{value.label}}</span>\n                           </li>\n                        </ul>\n                     </div>\n                  </div>\n               </div>\n            </div>\n            \x3c!-- dropdown !multiselect --\x3e\n            <div ng-if="attr.inputType === \'dropdown\' && !attr.multiselect">\n               <div class="slds-form-element__control slds-select_container slds-m-right_large slds-m-bottom_xx-small">\n                  <div class="slds-select_container">\n                     <select\n                        ng-options="value.value as value.label for value in attr.values | filter: {hiddenByRule: \'!true\'}"\n                        ng-model="attr.userValues" class="slds-select slds-m-right_xx-small"\n                        id="select-{{$index}}-{{$parent.$index}}-{{$parent.$parent.$index}}"\n                        ng-disabled="attr.disabled || attr.readonly">\n                     </select>\n                  </div>\n               </div>\n            </div>\n            <div class="vloc-slider_container" ng-if="attr.inputType === \'range\'">\n               <div class="slds-form-element">\n                  <label class="slds-form-element__label" for="slider-id-01">\n                     <span class="slds-slider-label">\n                        <span class="slds-slider-label__range">{{attr.min}} - {{attr.max}}</span>\n                     </span>\n                  </label>\n                  <div class="slds-form-element__control">\n                     <div class="slds-slider slds-p-right_medium">\n                        <input type="range" min="{{attr.min}}" max="{{attr.max}}"\n                           id="attr-slider-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}"\n                           class="slds-slider__range" ng-disabled="attr.disabled || attr.readonly"\n                           ng-model="attr.userValues" ng-model-options="{debounce: 1000}" />\n                        <span class="slds-slider__value" aria-hidden="true">{{attr.userValues}}</span>\n                     </div>\n                  </div>\n               </div>\n            </div>\n            <div class="slds-grid slds-p-bottom_x-small"\n               ng-if="attr.inputType !== \'radio\' && attr.inputType !== \'dropdown\'  && attr.inputType !== \'checkbox\' && attr.inputType !== \'range\' && attr.inputType !== \'date\' && attr.inputType !== \'datetime\'">\n               <div class="slds-size_1-of-1 slds-p-right_small">\n                  <input class="slds-input" ng-model="attr.userValues" ng-model-options="{debounce: 1000}"\n                     ng-disabled="attr.disabled || attr.readonly" />\n               </div>\n            </div>\n            <div\n               class="slds-form-element slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open slds-size_3-of-4"\n               ng-if="attr.inputType === \'date\'">\n               <input class="slds-input slds-m-bottom_small" slds-date-picker ng-model="attr.userValues">\n            </div>\n            <input ng-if="attr.inputType === \'datetime\'"\n               class="slds-input slds-m-bottom_small slds-size_2-of-5 slds-m-right_medium" slds-date-picker\n               ng-model="attr.userValues">\n            <input ng-if="attr.inputType === \'datetime\'" class="slds-input slds-m-bottom_small slds-size_2-of-5"\n               slds-time-picker ng-model="attr.userValues">\n            <div class="slds-form-element__control slds-text-align_left"\n               ng-if="attr.inputType === \'checkbox\' && !attr.multiselect">\n               <span class="slds-checkbox">\n                  <input type="checkbox" name="showmore-attrs-{{$index}}" id="showmore-attrs-{{$index}}"\n                     ng-model="attr.userValues" ng-disabled="attr.disabled || attr.readonly" />\n                  <label class="slds-checkbox__label slds-m-around_none" for="showmore-attrs-{{$index}}">\n                     <span class="slds-checkbox_faux vloc-check"></span>\n                  </label>\n               </span>\n            </div>\n         </div>\n      </div>\n   </div>\n</div>\n</div>\n<script type="text/ng-template" id="ruleMessageTooltip.html">\n   <div class="vloc-ins-message-icon slds-text-align_center slds-grid" ng-if="attr.rules.length || attr.values.length">\n       <div ng-repeat="rule in attr.rules" ng-if="rule.ruleType === \'Message\' && rule.ruleEvaluation" class="vloc-rules-message-container slds-m-top_xx-small slds-m-bottom_x-small slds-m-horizontal_xx-small slds-is-relative">\n           <div ng-class="{\'slds-theme_warning\': rule.messages[0].severity === \'WARN\', \'slds-theme_error\': rule.messages[0].severity === \'ERROR\'}"  class="vloc-ins-rule-message-tooltip slds-popover slds-popover_tooltip slds-nubbin_top-left slds-is-absolute"  role="tooltip" id="help" style="top: 2rem; left: -1rem;">\n               <div class="slds-popover__body" >\n                   {{rule.messages[0].message}}\n               </div>\n           </div>\n           <span class="vloc-ins-rule-message-icon" ng-if="rule.messages[0].severity === \'WARN\'">\n               <slds-svg-icon extra-classes="\'vloc-ins-rules-warning\'" sprite="\'utility\'" icon="\'warning\'" size="\'x-small\'">\n               </slds-svg-icon>\n           </span>\n           <span class="vloc-ins-rule-message-icon" ng-if="rule.messages[0].severity === \'ERROR\'">\n               <slds-svg-icon sprite="\'utility\'"  extra-classes="\'vloc-ins-rules-error\'" icon="\'error\'" size="\'x-small\'">\n               </slds-svg-icon>\n           </span>\n           <span class="vloc-ins-rule-message-icon" ng-if="rule.messages[0].severity !== \'WARN\' && rule.messages[0].severity !== \'ERROR\'">\n               <slds-svg-icon sprite="\'utility\'" icon="\'info\'" size="\'x-small\'">\n               </slds-svg-icon>\n           </span>\n       </div>\n       <div ng-repeat="value in attr.values">\n           <div ng-repeat="rule in value.rules"  ng-if="rule.ruleType === \'Message\' && rule.ruleEvaluation" class="vloc-rules-message-container slds-m-horizontal_xx-small slds-is-relative">\n               <div ng-class="{\'slds-theme--warning\': rule.messages[0].severity === \'WARN\', \'slds-theme--error\': rule.messages[0].severity === \'ERROR\'}"\n                   class="vloc-ins-rule-message-tooltip slds-popover slds-popover_tooltip slds-nubbin_top-left slds-is-absolute"\n                   role="tooltip" id="help" style="top: 2rem; left: -1rem;">\n                   <div class="slds-popover__body">\n                       {{rule.messages[0].message}}\n                   </div>\n               </div>\n               <span class="vloc-ins-rule-message-icon" ng-if="rule.messages[0].severity === \'WARN\'">\n                   <slds-svg-icon sprite="\'utility\'" extra-classes="\'vloc-ins-rules-warning\'" icon="\'warning\'" size="\'x-small\'">\n                   </slds-svg-icon>\n               </span>\n               <span class="vloc-ins-rule-message-icon" ng-if="rule.messages[0].severity === \'ERROR\'">\n                   <slds-svg-icon sprite="\'utility\'" extra-classes="\'vloc-ins-rules-error\'" icon="\'error\'" size="\'x-small\'">\n                   </slds-svg-icon>\n               </span>\n               <span class="vloc-ins-rule-message-icon" ng-if="rule.messages[0].severity !== \'WARN\' && rule.messages[0].severity !== \'ERROR\'">\n                   <slds-svg-icon sprite="\'utility\'" icon="\'info\'" size="\'x-small\'">\n                   </slds-svg-icon>\n               </span>\n           </div>\n       </div>\n   </div>\n<\/script>\n<style type="text/css">\n   .via-slds .vloc-ins-attributes-attribute .slds-dropdown {\n      width: auto;\n      min-width: 100%;\n      font-size: 0.8125rem;\n   }\n\n   .via-slds .slds-dropdown .vloc-ins-attributes-attribute-dropdown-items-item {\n      user-select: none;\n   }\n\n   .via-slds .vloc-ins-attributes-attribute .slds-dropdown .vloc-ins-attributes-attribute-dropdown-items-item.ins-rule-set-value {\n      background-color: #ecebea;\n   }\n\n   .via-slds .slds-dropdown .vloc-ins-attributes-attribute-dropdown-items-item.ins-rule-set-value>a {\n      background-color: #ecebea;\n      cursor: not-allowed;\n   }\n\n   .via-slds .slds-dropdown .vloc-ins-attributes-attribute-dropdown-items-item.ins-rule-set-value>a:hover {\n      background-color: #ecebea;\n   }\n\n   .via-slds .vloc-ins-rules-warning {\n      fill: #ffb75d !important;\n   }\n\n   .via-slds .vloc-ins-rules-error {\n      fill: #C23948 !important;\n   }\n\n   .via-slds .vloc-ins-rule-message-icon:hover {\n      cursor: pointer;\n   }\n\n   .via-slds .vloc-ins-rule-message-tooltip {\n      visibility: hidden;\n   }\n\n   .via-slds .vloc-rules-message-container:hover .vloc-ins-rule-message-tooltip {\n      visibility: visible;\n   }\n\n   .via-slds .vloc-ins-rule-message-container .slds-icon {\n      fill: #16325c;\n      position: relative;\n      top: -1px;\n      transition: transform 250ms ease-in;\n   }\n\n   .via-slds .vloc-ins-rule-message-icon {\n      top: -.25rem;\n   }\n\n   .via-slds .vloc-ins-message-icon {\n      top: -.35rem;\n      position: absolute;\n   }\n</style>'),$templateCache.put("modals/ins-quote-modal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{vlocSlideCustomClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{vlocSlideCustomClass}}-container">\n        <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()" ng-if="!vlocSlideHeader">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Close</span>\n        </button>\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n        </header>\n        <div class="slds-modal__content slds-p-around_medium vloc-modal-content slds-is-relative">\n            <vloc-layout layout-name="{{layout}}" class="{{layout}}" is-loaded="isLayoutLoaded" records="records" ctrl="{{ctrl}}"></vloc-layout>\n        </div>\n        <footer class="slds-modal__footer slds-float_right slds-p-right_large" ng-if="records.modalType === \'Edit\'">\n        <button class="slds-button slds-button_brand" ng-if="!records.Id" ng-click="importedScope.vlocQuote.addNewClass(records, vlocQuote)">Save</button>\n        <button class="slds-button slds-button_brand" ng-if="records.Id" ng-click="importedScope.vlocQuote.updateClass(records, vlocQuote)">Update</button>\n        <button class="slds-button slds-button_neutral" ng-click="$slideHide()">Cancel</button>\n        </footer>\n    </div>\n</div>\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -200%;\n        margin-bottom: 45px;\n        height: auto;\n        transition: top 250ms ease-in;\n        max-height: 700px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__header {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__footer {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: auto;\n        width: 90%;\n        min-width: 90%;\n        max-width: 90%;\n        padding: 0;\n        margin: 0;\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translateY(-50%) translateX(-50%);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 30rem;\n        max-height: 0;\n        border-radius: 0;\n        width: 100%;\n        margin-bottom: 2.5rem;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); /* leaving room for iPhone notification bar */\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; /* Android doesn\'t need the 20px of room like iPhone */\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>')}]);

},{}]},{},[1]);
})();

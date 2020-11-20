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
angular.module('insProductModel', ['vlocity', 'CardFramework', 'sldsangular', 'forceng',
    'ngSanitize', 'cfp.hotkeys', 'VlocityDynamicForm', 'insValidationHandler'
    ]).config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    }]).config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }]).run(['$rootScope', function($rootScope) {
        'use strict';
        $rootScope.nsPrefix = fileNsPrefix();
        $rootScope.isLoaded = false;
    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        'use strict';
        return function(sldsURL) {
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]).filter('formatCurrency', ['$rootScope', function($rootScope) {
        'use strict';
        return function(amount) {
            let locale = $rootScope.vlocity.userAnLocale;
            let currencyCode = $rootScope.vlocity.currency;
            if(amount != null && !isNaN(amount)) {
                if (typeof amount === 'string'){
                    amount = parseInt(amount);
                }
                return amount.toLocaleString(locale, { style: 'currency', currency: $rootScope.vlocity.userCurrency });
            }
        };
    }]).filter('displayValue', ['$rootScope', function($rootScope) {
        'use strict';
        return function(userValue, attributeValues) {
            if(attributeValues) {
                for(let i = 0; i < attributeValues.length; i++) {
                    if(typeof userValue === 'boolean') {
                        userValue = userValue.toString();
                    }
                    if(attributeValues[i].value && attributeValues[i].label && attributeValues[i].value === userValue) {
                        return attributeValues[i].label;
                    }
                }
            }
            return userValue;
        };
    }]).filter('formatDate', ['$rootScope', function($rootScope) {
        'use strict';
        return function(date) {
            const userLocale = $rootScope.vlocity.userAnLocale;
            const d = new Date(date);
            let formattedDate;
            if (userLocale) {
                formattedDate = d.toLocaleDateString(userLocale, {timeZone: 'UTC'});
            } else {
                formattedDate = (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
            }
            return formattedDate;
        };
    }]).filter('formatLastModifiedDate', ['$rootScope', function($rootScope) {
        'use strict';
        return function(date) {
            let d = new Date(date);
            // Conditionally format date for Safari as it can't read timeZone in RFC 822 format
            var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            if (isSafari) {
                let splitDate = date.split(/[.]/).shift();
                d = new Date(splitDate)
            }

            const userLocale = $rootScope.vlocity.userAnLocale;
            let formattedDate;
            if (userLocale) {
                formattedDate = d.toLocaleDateString(userLocale, {timeZone: $rootScope.vlocity.userTimeZone});
            } else {
                formattedDate = (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
            }
            return formattedDate;
        };
    }]);

// Directives

// Controllers
require('./modules/insProductModel/controller/InsProductModelController.js');

// Templates
require('./modules/insProductModel/templates/templates.js');

// Factories
require('./modules/insProductModel/factory/InsProductModelModalService.js');
require('./modules/insProductModel/factory/InsProductModelService.js');
require('./modules/insProductModel/factory/InsProductModelNotificationService.js');

},{"./modules/insProductModel/controller/InsProductModelController.js":2,"./modules/insProductModel/factory/InsProductModelModalService.js":3,"./modules/insProductModel/factory/InsProductModelNotificationService.js":4,"./modules/insProductModel/factory/InsProductModelService.js":5,"./modules/insProductModel/templates/templates.js":6}],2:[function(require,module,exports){
angular.module('insProductModel').controller('InsProductModelController',
['$scope', '$rootScope','$timeout', 'InsProductModelModalService', 'InsProductModelNotificationService', 'dataService', '$filter', 'userProfileService',
function($scope, $rootScope, $timeout, InsProductModelModalService, InsProductModelNotificationService, dataService, $filter, userProfileService) {
    'use strict';
    $scope.InsProductModelNotificationService = InsProductModelNotificationService;
    $scope.$watch('InsProductModelNotificationService.show', function(newValue, oldValue) {
        if (newValue !== oldValue && newValue === true) {
            $timeout(function() {
                $scope.InsProductModelNotificationService.show = false;
            }, 3000);
        }
    });

    $scope.customLabels = {};
    const translationKeys = ['Edit', 'InsAssetLastModified', 'InsAssetEditInsuredItem', 'InsAssetNoInsuredItems', 'InsAssetSuccess', 'Close', 'InsButtonCancel', 'Save'];
    userProfileService.getUserProfile().then(function(user) {
        dataService.fetchCustomLabels(translationKeys, user.language).then(
            function(translatedLabels) {
                $scope.customLabels = translatedLabels;
            }
        );
    });

    // Need to find FirstName and LastName in the attributes and combine them into one
    $scope.organizeData = function(records) {
        var i, j, k, attributeCategories, productAttributes, firstName, lastName;
        if (records && records.length) {
            for (i = 0; i < records.length; i++) {
                if (records[i].attributeCategories && records[i].attributeCategories.records) {
                    attributeCategories = records[i].attributeCategories.records;
                    for (j = 0; j < attributeCategories.length; j++) {
                        if (records[i].attributeCategories.records[j].productAttributes && records[i].attributeCategories.records[j].productAttributes.records) {
                            productAttributes = records[i].attributeCategories.records[j].productAttributes.records;
                            for (k = 0; k < productAttributes.length; k++) {
                                if(productAttributes[k].inputType === 'number'){
                                    productAttributes[k].userValues = parseInt(productAttributes[k].userValues);
                                }
                                if (productAttributes[k].code === 'FirstName') {
                                    firstName = productAttributes[k].userValues;
                                }
                                if (productAttributes[k].code === 'LastName') {
                                    lastName = productAttributes[k].userValues;
                                }
                                if (firstName && lastName) {
                                    records[i].formattedName = firstName + ' ' + lastName;
                                } else if (productAttributes[k].code.toLowerCase() === 'name') {
                                    records[i].formattedName = productAttributes[k].userValues;
                                }
                            }
                        }
                    }
                } 
            }
            angular.element('.vloc-ins-product-model-initial-spinner').hide();
        } else {
            angular.element('.vloc-ins-product-model-initial-spinner').hide();
        }
        return records;
    };

    $scope.editInsuredItem = function(record) {
        // If userValues is boolean, stringify to match the value in values
        if (record.attributeCategories && record.attributeCategories.records[0].productAttributes && record.attributeCategories.records[0].productAttributes.records) {
            const productAttributes = record.attributeCategories.records[0].productAttributes.records;
            for(let i = 0; i < productAttributes.length; i++){
                if(typeof productAttributes[i].userValues === 'boolean'){
                    productAttributes[i].userValues = JSON.stringify(productAttributes[i].userValues);
                }
            }
        }

        InsProductModelModalService.launchModal(
            $scope,
            $scope.customLabels.InsAssetEditInsuredItem || 'Edit Insured Item',
            record,
            'vloc-edit-insured-item-modal'
        );
    };

    // Vlocity Dynamic form mapping object
    $scope.mapObject = function() {
        return {
            'fieldMapping': {
                'type': 'inputType',
                'value': 'userValues',
                'label': 'label',
                'readonly': 'readonly',
                'required': 'required',
                'disabled': 'disabled',
                'hidden': 'ishidden',
                'multiple': 'multiselect',
                'customTemplate': 'customTemplate',
                'valuesArray': { //multiple values map. Eg: select, fieldset, radiobutton group
                    'field': 'values',
                    'value': 'value',
                    'label': 'label',
                    'disabled': 'disabled'
                }
            },
            'pathMapping': {
                'levels': 2,
                'path': 'productAttributes.records'
            }
        };
    };
}]);

},{}],3:[function(require,module,exports){
angular.module('insProductModel').factory('InsProductModelModalService', 
['$rootScope', '$sldsModal', '$timeout', 'InsProductModelService',
function($rootScope, $sldsModal, $timeout, InsProductModelService) {
    'use strict';
    return {
        launchModal: function(scope, title, record, customClass) {
            var modalScope = scope.$new();
            var insModal;
            modalScope.isLayoutLoaded = false;
            modalScope.title = title;
            modalScope.record = angular.copy(record);
            modalScope.customClass = customClass;
            modalScope.InsProductModelService = InsProductModelService;
            insModal = $sldsModal({
                scope: modalScope,
                templateUrl: 'modals/SldsModalVlocSlideCustom.tpl.html',
                show: true,
                vlocSlide: true
            });
        }
    };
}]);
},{}],4:[function(require,module,exports){
angular.module('insProductModel').factory('InsProductModelNotificationService', ['$rootScope', function($rootScope) {
    'use strict';
    return {
        message: '',
        show: false,
        type: 'success'
    };
}]);
},{}],5:[function(require,module,exports){
angular.module('insProductModel').factory('InsProductModelService',
['$rootScope', '$q', 'dataSourceService', 'InsProductModelNotificationService', 'InsValidationHandlerService', 'dataService', 'userProfileService',
function($rootScope, $q, dataSourceService, InsProductModelNotificationService, InsValidationHandlerService, dataService, userProfileService) {
    'use strict';

    var  refreshList = function() {
        var message = {
            event: 'reload'
        };
        $rootScope.$broadcast('vlocity.layout.ins-product-model-quote-container.events', message);
        $rootScope.isLoaded = true;
    };

    const translationKeys = ['InsProductSuccessfullyUpdatedQuoteLineItems'];
    let customLabels = {};
    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                customLabels = translatedLabels;
            }
        )
    })


    var REMOTE_CLASS = 'InsurancePCRuntimeHandler';
    var DUAL_DATASOURCE_NAME = 'Dual';
    var insideOrg = false;
    var errorContainer = {};
    var getDualDataSourceObj = function(actionObj) {
        var datasource = {};
        var temp = '';
        var nsPrefix = fileNsPrefix().replace('__', '');

        if (actionObj.remote.remoteClass) {
            temp = REMOTE_CLASS;
            REMOTE_CLASS = actionObj.remote.remoteClass || temp;
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
    };

    return {
        updateChildLine: function(actionObj, records, hideFn) {
            var deferred = $q.defer();
            var datasource = getDualDataSourceObj(actionObj);
            var attributeValues = {};
            var i, j;
            console.log('datasource', datasource);

            // Grab all the userValues to send to the service:
            for (i = 0; i < records.length; i++) {
                for (j = 0; j < records[i].productAttributes.records.length; j++) {
                    attributeValues[records[i].productAttributes.records[j].code] = records[i].productAttributes.records[j].userValues;
                }
            }
            datasource.value.inputMap.attributeValues = attributeValues;
            dataSourceService.getData(datasource, null, null).then(
                function(data) {
                    console.log('success', data);
                    InsProductModelNotificationService.message = $rootScope.vlocity.getCustomLabel('InsProductSuccessfullyUpdatedQuoteLineItems') || 'Successfully updated Quote Line Item';
                    InsProductModelNotificationService.show = true;
                    InsProductModelNotificationService.type = 'success';
                    refreshList();
                    hideFn();
                    deferred.resolve(data);
                }, function(error) {
                    InsValidationHandlerService.throwError(error);
                    console.log('error', error);
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    };
}]);

},{}],6:[function(require,module,exports){
angular.module("insProductModel").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("modals/SldsModalVlocSlideCustom.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{vlocSlideCustomClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{vlocSlideCustomClass}}-container">\n        <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()" ng-if="!vlocSlideHeader">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">{{ importedScope.customLabels.Close }}</span>\n        </button>\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">{{ importedScope.customLabels.Close }}</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n        </header>\n        <div class="slds-modal__content slds-p-horizontal_large slds-p-bottom_large vloc-modal-content slds-is-relative">\n            <div class="slds-spinner_container" ng-class="{\'vloc-show-loader\': !isModalLoaded}">\n                <div class="slds-spinner_brand slds-spinner slds-spinner_large slds-m-top_x-large slds-m-bottom_x-large" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n            <vlocity-dynamic-form ng-model="record.attributeCategories.records" name="editInsuredItemAttributes" map-object="{{importedScope.mapObject()}}"></vlocity-dynamic-form>\n        </div>\n        <footer class="slds-modal__footer" ng-show="vlocSlideFooter">\n            <button class="slds-button slds-button_neutral" ng-click="$slideHide()"> {{ importedScope.customLabels.InsButtonCancel }}</button>\n            <button class="slds-button slds-button_brand" ng-click="InsProductModelService.updateChildLine(record.actions.updateChildLine, record.attributeCategories.records, $slideHide)">{{ importedScope.customLabels.Save }}</button>\n        </footer>\n    </div>\n</div>\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -100%;\n        margin-bottom: 45px;\n        height: auto;\n        transition: top 250ms ease-in;\n        position: absolute;\n        z-index: 6000;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-form-element {\n        margin-bottom: 0.5rem;\n    }\n\n    .vlocity.via-slds .slds-backdrop {\n        z-index: 5999;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: auto;\n        max-height: 35rem;\n        width: 35rem;\n        min-width: 35rem;\n        max-width: 35rem;\n        padding: 0;\n        margin: 1rem 0 0;\n        position: absolute;\n        left: 50%;\n        transform: translateX(-50%);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 20rem;\n        border-radius: 0;\n        padding: 0 5rem 1rem 5rem;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); /* leaving room for iPhone notification bar */\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; /* Android doesn\'t need the 20px of room like iPhone */\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>\n')}]);

},{}]},{},[1]);
})();

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
angular.module('insQuoteLineItems', ['vlocity', 'CardFramework', 'sldsangular', 'forceng',
    'ngSanitize', 'cfp.hotkeys', 'insValidationHandler', 'insRules'
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
    }]);

// Controllers
require('./modules/insQuoteLineItems/controller/InsQuoteLineItemsController.js');

// Templates
require('./modules/insQuoteLineItems/templates/templates.js');


//Factories
require('./modules/insQuoteLineItems/factory/InsQuoteLineItemsModalService.js');
require('./modules/insQuoteLineItems/factory/InsQuoteLineItemsService.js');
},{"./modules/insQuoteLineItems/controller/InsQuoteLineItemsController.js":2,"./modules/insQuoteLineItems/factory/InsQuoteLineItemsModalService.js":3,"./modules/insQuoteLineItems/factory/InsQuoteLineItemsService.js":4,"./modules/insQuoteLineItems/templates/templates.js":5}],2:[function(require,module,exports){
angular.module('insQuoteLineItems').controller('InsQuoteLineItemsController', 
    ['$scope', '$rootScope', '$timeout', 'InsQuoteLineItemsModalService', 'InsQuoteLineItemsService', function(
    $scope, $rootScope, $timeout, InsQuoteLineItemsModalService, InsQuoteLineItemsService) {
    'use strict';
    $scope.activeList = [];
    $scope.getActiveClasses = function(accountId){
        if(!$rootScope.accountClasses){
            var inputMap = {
                accountId : accountId
            };
            InsQuoteLineItemsService.getActiveClasses($scope, 'InsuranceQuoteProcessingService', 'getActiveAccountClasses', inputMap); 
        }
    };

    $scope.setActiveList = function(obj){
        $scope.activeRow = obj;
        if(!$scope.activeRow) {
            if($rootScope.addedRow){
                $scope.activeRow = $rootScope.addedRow;
            } else {
            $scope.activeRow = obj;
            }
        }
        $scope.activeList = []; 
        $scope.activeList.push($scope.activeRow);
    };

    $scope.updateActiveList = function(){
        console.log('Update QLI:', $scope.activeList[0]);
        InsQuoteLineItemsService.updateQLI($scope, $scope.activeList[0].attributeCategories.records, $scope.activeList[0].quoteLineId);
    };

    $scope.hideRightCol = function(addProductOpen) {
        if(addProductOpen){
            $scope.activeRow = null;
        }
    };

    $scope.getEligibleProducts = function(record){
        if(!$rootScope.productTypeMap){
            $rootScope.productTypeMap = {};
        }
        if(!$rootScope.productTypeMap[record.id]) {
            var classDetail = ''; 
            var inputMap = {
                'quoteId' : $rootScope.quoteData.Id, 
                'classDetail' : classDetail,
                'filters' :  record.extraParams.Filter,
                'effectiveDtStr' : null,
                'pricebook2Id' : $rootScope.quoteData.Pricebook2Id
            };
            InsQuoteLineItemsService.getEligibleProducts($scope, inputMap, record);
        } 
    };

    $scope.parseActions = function (actions){
        $rootScope.typeIcons = {};
        for(var i = 0; i < actions.length; i++){
            var obj = {};
            obj.sprite = actions[i].extraParams['slds-sprite'];
            obj.icon = actions[i].extraParams['slds-icon'];
            $rootScope.typeIcons[actions[i].displayName] = obj;
        }
        console.log($rootScope.typeIcons);
    };

    $scope.removeItem = function (qliId) {
        var inputMap = {
            'quoteItemId' : qliId
        };
        InsQuoteLineItemsService.deleteItem($scope, inputMap);
    };


     $scope.editModal = function(record) {
        var classCodes = record[$rootScope.nsPrefix + 'ClassCodes__c'];
        console.log('record', record);
        if(classCodes && classCodes.value){
            classCodes = classCodes.value;
            classCodes =  classCodes.split(",");
        } else {
            classCodes = [];
        }
        if($rootScope.accountClasses){
            for(var i = 0; i < $rootScope.accountClasses.length; i++){
               var j = classCodes.indexOf($rootScope.accountClasses[i][$rootScope.nsPrefix + 'ClassCode__c']);
               $rootScope.accountClasses[i].isSelected = j > -1;
            }
        }

        var obj = {
            records:  $rootScope.accountClasses, 
            modalName: 'Class Codes', 
            qli: record.quoteLineId
        };
        InsQuoteLineItemsModalService.launchModal(
            $scope,
            'ins-quote-line-card-modal',
            obj,
            'InsQuoteLineItemsController',
            'vloc-quote-modal'
        );
     };

     $scope.saveQLI = function(id, classCodes){
        var list = [];
        for(var i = 0; i < classCodes.length; i++){
            if(classCodes[i].isSelected && list.indexOf(classCodes[i][$rootScope.nsPrefix + 'ClassCode__c']) < 0){
                list.push(classCodes[i][$rootScope.nsPrefix + 'ClassCode__c']);
            }
        }
        var obj= {};
        list = list.join();
        obj[$rootScope.nsPrefix + 'ClassCodes__c'] = list;
        var inputMap = { 
            quoteItemId : id,
            fieldValueMap : obj
        };
        InsQuoteLineItemsService.saveQLI($scope, 'InsuranceQuoteProcessingService', 'updateItem', inputMap); 
     };

     $scope.addItem = function(record){
         var inputMap = {
            'quoteId' : $rootScope.quoteData.Id,
            'productId' : record.Id,
            'price' : record.Price,
            'largeGroup' : true
        };
        record.isQLI = true;
        InsQuoteLineItemsService.addItem($scope, inputMap);
     };

}]);
},{}],3:[function(require,module,exports){
angular.module('insQuoteLineItems').factory('InsQuoteLineItemsModalService',
['$rootScope', '$sldsModal', '$timeout', 'InsQuoteLineItemsService',
function($rootScope, $sldsModal, $timeout, InsQuoteLineItemsService) {
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
            console.log(layout);
            var modalScope = scope.$new();
            var insModal;
            scrollTop();
            modalScope.vlocQuote = scope.vlocQuote;
            modalScope.isLayoutLoaded = false;
            modalScope.layout = layout;
            modalScope.records = records;
            modalScope.ctrl = ctrl;
            modalScope.title = records.modalName;
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
        launchVDFModal:  function(scope, title, record, customClass) {
            scrollTop();
            var modalScope = scope.$new();
            var insModal;
            modalScope.isLayoutLoaded = false;
            modalScope.title = title;
            modalScope.record = record;
            modalScope.customClass = customClass;
            modalScope.InsQuoteService = InsQuoteService;
            insModal = $sldsModal({
                scope: modalScope,
                templateUrl: 'modals/ins-quote-vdf-modal.tpl.html',
                show: true,
                vlocSlide: true
            });
        },
        hideModal : function(){
            angular.element('.slds-modal__close').click();
        }
    };
}]);

},{}],4:[function(require,module,exports){
angular.module('insQuoteLineItems').factory('InsQuoteLineItemsService', ['dataSourceService', 'dataService', '$q', '$rootScope', 'InsValidationHandlerService', '$timeout', function(dataSourceService, dataService, $q, $rootScope, InsValidationHandlerService, $timeout) {
    'use strict';
    
     var scrollTop = function(){
        if ('parentIFrame' in window) {
            window.parentIFrame.scrollTo(0);
        } else {
            $('body').scrollTop(0);
        }
    };


    var refreshList = function() {
        var message = {
            event: 'reload'
        };
        console.log('refresh');
        $rootScope.$broadcast('vlocity.layout.ins-quote-line-items-container.events', message);
        $rootScope.isLoaded = true;
    };

    return {
        getActiveClasses: function(scope, remoteClass, remoteMethod, inputMap) {
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
            datasource.value.apexRestResultVar = 'result.records';

            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    $rootScope.accountClasses = data.result;
                    $rootScope.isLoaded = true;
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    $rootScope.notification.type = 'error';
                    $rootScope.notification.active = true;
                    $rootScope.notification.message = error.message;
                    $rootScope.isLoaded = true;
                    $timeout(function() {
                        $rootScope.notification.active = false;
                    }, 3000);
                });
            return deferred.promise;
        }, saveQLI: function(scope, remoteClass, remoteMethod, inputMap) {
            $rootScope.isLoaded = false;
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
            datasource.value.apexRestResultVar = 'result.records';

            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    $rootScope.notification.type = 'success';
                    $rootScope.notification.active = true;
                    $rootScope.notification.message ="Saved Quote Line Item";
                    refreshList();
                    $timeout(function() {
                            $rootScope.notification.active = false;
                    }, 3000);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    $rootScope.notification.type = 'error';
                    $rootScope.notification.active = true;
                    $rootScope.notification.message = error.message;
                    $rootScope.isLoaded = true;
                    $timeout(function() {
                        $rootScope.notification.active = false;
                    }, 3000);
                });
            return deferred.promise;
        }, getEligibleProducts: function(scope, inputMap, action){
            $rootScope.isLoaded = false;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('Calling: ', 'getRatedProducts');
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'AttributeRatingHandler';
            datasource.value.remoteMethod = 'getRatedProducts';
            datasource.value.inputMap = inputMap;
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.apexRestResultVar = 'result.records';

            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    $rootScope.productTypeMap[action.id] = data.records;
                    $rootScope.isLoaded = true;
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    $rootScope.notification.type = 'error';
                    $rootScope.notification.active = true;
                    $rootScope.notification.message = error.message;
                    $rootScope.isLoaded = true;
                    $timeout(function() {
                        $rootScope.notification.active = false;
                    }, 3000);
                });
            return deferred.promise;
        }, addItem: function(scope, inputMap) {
            $rootScope.isLoaded = false;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'InsuranceQuoteProcessingService';
            datasource.value.remoteMethod = 'addItem';
            datasource.value.inputMap = inputMap;
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.apexRestResultVar = 'result.records';

            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    if(data.records && data.records[0]) {
                        $rootScope.addedRow = data.records[0];
                    }
                    $rootScope.notification.type = 'success';
                    $rootScope.notification.active = true;
                    $rootScope.notification.message ="Added Quote Line Item";
                    refreshList();
                    scope.setActiveList();
                    $timeout(function() {
                            $rootScope.notification.active = false;
                    }, 3000);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    $rootScope.notification.type = 'error';
                    $rootScope.notification.active = true;
                    $rootScope.notification.message = error.message;
                    $rootScope.isLoaded = true;
                    $timeout(function() {
                        $rootScope.notification.active = false;
                    }, 3000);
                });
            return deferred.promise;
        }, deleteItem: function(scope, inputMap) {
            $rootScope.isLoaded = false;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'InsuranceQuoteProcessingService';
            datasource.value.remoteMethod = 'deleteItem';
            datasource.value.inputMap = inputMap;
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.apexRestResultVar = 'result.records';
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    refreshList();
                    $rootScope.notification.type = 'success';
                    $rootScope.notification.active = true;
                    $rootScope.notification.message ="Deleted Quote Line Item";
                   $timeout(function() {
                        $rootScope.notification.active = false;
                    }, 3000);
                    scope.activeRow = null;
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    $rootScope.notification.type = 'error';
                    $rootScope.notification.active = true;
                    $rootScope.notification.message = error.message;
                    $rootScope.isLoaded = true;
                    $timeout(function() {
                        $rootScope.notification.active = false;
                    }, 3000);
                });
            return deferred.promise;
        },  updateQLI: function(scope, records, qliId) {
            console.log('updateQLI', records, qliId);
                $rootScope.isLoaded = false;
                var attributeValues = {};
                var i, j;
                 for (i = 0; i < records.length; i++) {
                    for (j = 0; j < records[i].productAttributes.records.length; j++) {
                        attributeValues[records[i].productAttributes.records[j].code] = records[i].productAttributes.records[j].userValues;
                    }
                }
                var inputMap = {
                    quoteLineId : qliId, 
                    attributeValues : attributeValues, 
                    reprice : false
                };
                var effectiveDate = null;
                var deferred = $q.defer();
                var nsPrefix = fileNsPrefix().replace('__', '');
                var datasource = {};
                datasource.type = 'Dual';
                datasource.value = {};
                datasource.value.remoteNSPrefix = nsPrefix;
                datasource.value.remoteClass = 'InsurancePCRuntimeHandler';
                datasource.value.remoteMethod = 'updateChildLine';
                datasource.value.inputMap = inputMap;
                datasource.value.apexRemoteResultVar = 'result.records';
                datasource.value.methodType = 'GET';
                datasource.value.apexRestResultVar = 'result.records';
                console.log('datasource', datasource);
                // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                dataSourceService.getData(datasource, scope, null).then(
                    function(data) {
                        console.log(data);
                        deferred.resolve(data);
                        $rootScope.notification.type = 'success';
                        $rootScope.notification.active = true;
                        $rootScope.notification.message = 'Successfully Updated';
                        let updatedAttributes = data.result.updatedAttrs; //set values updates
                        for(let rulesCode in $rootScope.backendSetValueMap){
                            $rootScope.backendSetValueMap[rulesCode] = false;
                        }
                        if (updatedAttributes) {
                            for (let rulesCode in updatedAttributes) {
                                if ($rootScope.attrsMap[rulesCode]) {
                                    $rootScope.attrsMap[rulesCode].userValues = updatedAttributes[rulesCode]; //changing here doesn't invoke watch
                                    $rootScope.attrsMap[rulesCode].ruleSetValue = true;
                                    $rootScope.backendSetValueMap[rulesCode] = true;
                                }
                            }
                        }
                        for(let rulesCode in $rootScope.backendSetValueMap){
                            if(!$rootScope.backendSetValueMap[rulesCode]){
                                $rootScope.attrsMap[rulesCode].ruleSetValue = false;
                                $rootScope.attrsMap[rulesCode].readOnly = false;
                                delete $rootScope.backendSetValueMap[rulesCode];
                            }
                        }
                        $rootScope.updating = false;
                        $rootScope.isLoaded = true;
                        $timeout(function() {
                            $rootScope.notification.active = false;
                        }, 3000);
                    },
                    function(error) {
                        console.error(error);
                        deferred.reject(error);
                        InsValidationHandlerService.throwError(error);
                        $rootScope.isLoaded = true;
                        $timeout(function() {
                            $rootScope.notification.active = false;
                        }, 3000);
                    });
                return deferred.promise;
            }
    };
}]);

},{}],5:[function(require,module,exports){
angular.module("insQuoteLineItems").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("modals/ins-quote-modal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{vlocSlideCustomClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{vlocSlideCustomClass}}-container">\n        <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide();  importedScope.saveQLI(records.qli, records.records)" ng-if="!vlocSlideHeader">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Close</span>\n        </button>\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide(); importedScope.saveQLI(records.qli, records.records)">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n        </header>\n        <div class="slds-modal__content slds-p-around_medium vloc-modal-content slds-is-relative">\n            <vloc-layout layout-name="{{layout}}" class="{{layout}}" is-loaded="isLayoutLoaded" records="records" ctrl="{{ctrl}}"></vloc-layout>\n        </div>\n        <footer class="slds-modal__footer slds-float_right slds-p-right_large" ng-if="records.modalType === \'Edit\'">\n        <button class="slds-button slds-button_brand" ng-if="!records.Id" ng-click="importedScope.vlocQuote.addNewClass(records, vlocQuote)">Save</button>\n        <button class="slds-button slds-button_brand" ng-if="records.Id" ng-click="importedScope.vlocQuote.updateClass(records, vlocQuote)">Update</button>\n        <button class="slds-button slds-button_neutral" ng-click="$slideHide()">Cancel</button>\n        </footer>\n    </div>\n</div>\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -100%;\n        margin-bottom: 45px;\n        height: auto;\n        transition: top 250ms ease-in;\n        max-height: 700px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__header {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__footer {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: auto;\n        width: 90%;\n        min-width: 90%;\n        max-width: 90%;\n        padding: 0;\n        margin: 0;\n        position: absolute;\n        top: 17rem;\n        left: 50%;\n        transform: translateY(-50%) translateX(-50%);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 22rem;\n        max-height: 0;\n        border-radius: 0;\n        width: 100%;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); /* leaving room for iPhone notification bar */\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; /* Android doesn\'t need the 20px of room like iPhone */\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>')}]);

},{}]},{},[1]);
})();

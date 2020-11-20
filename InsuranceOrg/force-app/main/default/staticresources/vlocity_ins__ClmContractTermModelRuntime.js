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
angular.module('clmContractTermModelRuntime', ['vlocity', 'CardFramework', 'sldsangular', 'forceng',
    'ngSanitize', 'cfp.hotkeys','clmValidationHandler'
    ]).config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    }]).config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }]).run(['$rootScope','userProfileService','dataService', function($rootScope,userProfileService, dataService) {
        'use strict';
          var labelNames = ['CLMDeleteTermError'];
                userProfileService.userInfoPromise().then(function() {
                    dataService.fetchCustomLabels(labelNames, $rootScope.vlocity.userLanguage);
                }, function(error) {
                    $log.error('User info promise error', error);
                });
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


//// Controllers

require('./modules/clmContractTermModelRuntime/controller/ClmContractTermModelRuntimeController.js');
require('./modules/clmContractTermModelRuntime/controller/ClmContractTermModelController.js');
require('./modules/clmContractTermModelRuntime/controller/ClmNewTermConfigController.js');

// Factories
require('./modules/clmContractTermModelRuntime/factory/NotificationHandler.js');
require('./modules/clmContractTermModelRuntime/factory/ClmContractTermModelService.js');
require('./modules/clmContractTermModelRuntime/factory/ClmTermModalService.js');

require('./modules/clmContractTermModelRuntime/services/ClmCustomViewService.js');

// Directives
require('./modules/clmContractTermModelRuntime/directive/HideNotification.js');
require('./modules/clmContractTermModelRuntime/directive/ClmContractTermModelRuntimeCollapseHeight.js');

// Templates
require('./modules/clmContractTermModelRuntime/templates/templates.js');
},{"./modules/clmContractTermModelRuntime/controller/ClmContractTermModelController.js":2,"./modules/clmContractTermModelRuntime/controller/ClmContractTermModelRuntimeController.js":3,"./modules/clmContractTermModelRuntime/controller/ClmNewTermConfigController.js":4,"./modules/clmContractTermModelRuntime/directive/ClmContractTermModelRuntimeCollapseHeight.js":5,"./modules/clmContractTermModelRuntime/directive/HideNotification.js":6,"./modules/clmContractTermModelRuntime/factory/ClmContractTermModelService.js":7,"./modules/clmContractTermModelRuntime/factory/ClmTermModalService.js":8,"./modules/clmContractTermModelRuntime/factory/NotificationHandler.js":9,"./modules/clmContractTermModelRuntime/services/ClmCustomViewService.js":10,"./modules/clmContractTermModelRuntime/templates/templates.js":11}],2:[function(require,module,exports){
angular.module('clmContractTermModelRuntime').controller('ClmContractTermModelController',
    ['$scope', '$rootScope', 'ClmTermModalService', 'ClmContractTermModelService', 'NotificationHandler', 'ClmValidationHandlerService', 'ClmCustomViewsService', function(
    $scope, $rootScope, ClmTermModalService, ClmContractTermModelService, NotificationHandler, ClmValidationHandlerService, ClmCustomViewsService) {
    'use strict';
    $rootScope.isLoaded = true;
    $scope.notificationHandler = new NotificationHandler();
    var visualForceOrigin = window.origin;
    visualForceOrigin = visualForceOrigin.split('--');
    var lexOrigin = visualForceOrigin[0] + '.lightning.force.com';
    $scope.isConsole = sforce.console.isInConsole();
    $scope.isSforce = (typeof sforce !== 'undefined' && typeof sforce.one !== 'undefined') ? (true) : (false);
    $scope.baseRequestUrl = '';
    if (window.baseRequestUrl !== undefined) {
        $scope.baseRequestUrl = window.baseRequestUrl;
    }
    if (window.modalLabels !== undefined) {
        $scope.modalLabels = window.modalLabels;
    }

    $scope.initData = function(versionId){
       $scope.getVersionData(versionId);
    };
    $scope.getContractPricingTerms = function(versionId) {
        var inputMap = {
            'versionId':versionId
        };
        ClmContractTermModelService.getContractPricingTerms($scope,inputMap);
    }
    $scope.getCustomViewStateData = function(cards) {
        if (cards && cards[0].states) {
            $rootScope.customViews = new ClmCustomViewsService($scope, cards);
        } else {
            $log.debug('There is no data for CustomView');
        }
    };
    $scope.prodDiscountCharge = function(prodDiscount) {
        var discountCharges = {
            'adjustmentValue':'',
            'amountValue':'',
            'label':''
        };
        var discountType = '$';
        if(prodDiscount[$rootScope.nsPrefix  +'PricingVariableId__r'][$rootScope.nsPrefix  +'AdjustmentMethod__c']) {
            var discountType = prodDiscount[$rootScope.nsPrefix  +'PricingVariableId__r'][$rootScope.nsPrefix  +'AdjustmentMethod__c'] === 'Percent' ? ' %' : ' $' ;
        }

        if(prodDiscount[$rootScope.nsPrefix  +'AdjustmentValue__c']) {
            discountCharges.adjustmentValue = prodDiscount[$rootScope.nsPrefix  +'AdjustmentValue__c'] + discountType;
        }

        var discountChargeCode = prodDiscount[$rootScope.nsPrefix  +'PricingVariableId__r'][$rootScope.nsPrefix  +'Code__c'];
    
        if(discountChargeCode.startsWith('OT_')) {
            discountCharges.label ='one time charges';
        }
        else if(discountChargeCode.startsWith('REC_')) {
            var totalDuration = prodDiscount[$rootScope.nsPrefix  +'TimePlanId__r']? prodDiscount[$rootScope.nsPrefix  +'TimePlanId__r'][$rootScope.nsPrefix  +'TotalDuration__c'] : '';
            var totalDurationUoM = prodDiscount[$rootScope.nsPrefix  +'TimePlanId__r']? prodDiscount[$rootScope.nsPrefix  +'TimePlanId__r'][$rootScope.nsPrefix  +'TotalDurationUoM__c'] : '';
            var timePlanDuration = totalDuration + ' ' + totalDurationUoM;
            var msg = totalDuration ? 'monthly charges for ' : 'monthly charges ';
            discountCharges.label=  msg + (totalDuration > 1 ? timePlanDuration +'s' : timePlanDuration);
   
        }
        return discountCharges;
    }


    $scope.getVersionData = function(versionId) {
        $scope.vlcLoading = true;
        var inputMap = {
            'versionId':versionId
        };
        ClmContractTermModelService.getVersionData($scope,inputMap).then(function(result) {
            $scope.vlcLoading = false;
            var versionData = result.result[0];
            var status = versionData[$rootScope.nsPrefix +'Status__c'];

            $scope.versionName = versionData.Name;
            $scope.isActiveVersion = (status === 'Active') ? true : false;
            $scope.contractId = versionData[$rootScope.nsPrefix +'ContractId__c'];
        });
    }
    $scope.navigateBack = function() {
        //navigate back to page that issue send
        if ($scope.isConsole) {
            //close the preview tab
            sforce.console.getEnclosingTabId(function(result) {
                var tabId = result.id;
                sforce.console.closeTab(tabId);
            });
            refreshCurrentPrimaryTab();
        } else {
            if (!$scope.isSforce) {
                window.top.location.href = $scope.baseRequestUrl + '/' + $scope.contractId;
                return false;
            } else if ($scope.isSforce) {
                sforce.one.navigateToURL($scope.baseRequestUrl + '/' + $scope.contractId);
            }
        }
    };
        
    function refreshCurrentPrimaryTab() {
        sforce.console.getFocusedPrimaryTabId(showTabId);
    }

    function showTabId(result) {
        var tabId = result.id;
        sforce.console.refreshPrimaryTabById(tabId , true, refreshSuccess);
    }
    $scope.refreshList = function(type){
         ClmContractTermModelService.refreshList(type);
    }

    $scope.launchContractTermModal = function() {
            console.log('launching from service');

            ClmContractTermModelService.launchNewAttrModal($scope, 'getTermsForAddition');
        };

    $scope.launchNewTermModal = function() {
            console.log('launching from service');

            ClmContractTermModelService.launchNewTermModal($scope, 'getNewTermInstance');
       };

    $scope.setOrderTerm = function(orderTerm) {
        if ($scope.orderTerm !== orderTerm) {
            $scope.orderAsc = true;
            $scope.orderTerm = orderTerm;
        } else {
            $scope.orderAsc = !$scope.orderAsc;
        }
    };
    $scope.addContractTerms = function(records, type) {
        var recordMap = records.records;
        var lst = [];
        var productIds = [];
        var attributeMap = {};
                if(recordMap.attributeCategories){
                    for(var i = 0; i < recordMap.attributeCategories.records.length; i++){
                        var category = recordMap.attributeCategories.records[i];
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
        for (var key in recordMap) {
            console.log(recordMap[key]);
            if (recordMap[key].isSelected) {
                lst.push(key);
                productIds.push(recordMap[key].productId);
            }
        }
         var inputMap = {
                    productIds: productIds,
                    'versionId': $rootScope.versionId,
                    'termType' : 'TermSpec',
                     attributeValues : attributeMap
                };
        if (type === 'TermSpec' && lst.length > 0) {
            console.log('add Terms');
            inputMap.coverageIds = lst;
            ClmContractTermModelService.addContractTerms($scope, inputMap, 'TermSpec').then(function(data){
                var addedprodIds = data.result.productIdList;
                $scope.sortedList = $scope.sortedList.filter(notAddedProducts => !addedprodIds.includes(notAddedProducts.productId));
            });
        }
    };


    $scope.deleteContractTerms = function(records, type) {
         var lst = [];
         var termIds = [];

         for (var key in records) {
             console.log(records[key]);
             if (records[key].isSelected) {
                 lst.push(key);
                 termIds.push(records[key].Id.fieldValue);
             }
         }
         if(termIds == null || termIds.length == 0){
            var deleteTermErrorMsg = $scope.modalLabels.CLMDeleteTermError;
            var data = { message :  deleteTermErrorMsg} ;
            var error = {data: data}; //TODO: Use Labels instead of string
            $scope.notificationHandler.handleError(error); //TODO: THROW ERROR NOTIFICATION
            $scope.notificationHandler.hide();
            $rootScope.isLoaded = true;
         }else{
            var inputMap = {
                             termIds: termIds,
                             'versionId': $scope.versionId,
                             'termType' : 'TermSpec'
                            };
            if ( lst.length > 0) {
                 console.log('add Terms');
                 inputMap.coverageIds = lst;
                 ClmContractTermModelService.deleteContractTerms($scope, inputMap, 'TermSpec');
            }
         }
     };


    $scope.searchFilter = function(name, term) {
                if (term !== '' && term !== undefined) {
                    var temp = name.toLowerCase();
                    term = term.toLowerCase();
                    if (temp.indexOf(term) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            };

    $scope.orderMap = function(map) {
        console.log(map);
        var mapRecords = map.records;
        let associationMap = {};
        for (var key = 0; key < map.totalSize; key++) {
          if(!associationMap[mapRecords[key].productName]){
            associationMap[mapRecords[key].productName] = mapRecords[key];
          } else {
            associationMap[mapRecords[key].productName + mapRecords[key].productCode] = mapRecords[key];
          }
        }
        console.log('>>>>', associationMap);
        $scope.sortedList = Object.values(associationMap);
        console.log( $scope.sortedList);
    };

    
    $scope.formatDate = function(date) {
        if (moment) {
            var formattedDate = moment(date).utc().format('M/D/YYYY')
            return formattedDate;
        } else {
           var d = new Date(date);
           var formattedDate = (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
       }
       return formattedDate;
   };
}]);
},{}],3:[function(require,module,exports){
angular.module('clmContractTermModelRuntime').controller('ClmContractTermModelRuntimeController',
    ['$scope', '$rootScope', 'ClmContractTermModelService',  '$timeout', '$sldsModal', 'NotificationHandler', function(
    $scope, $rootScope, ClmContractTermModelService, $timeout, $sldsModal, NotificationHandler) {
    'use strict';

    $scope.row = {};
    $rootScope.isLoaded = true;
    var visualForceOrigin = window.origin;
    visualForceOrigin = visualForceOrigin.split('--');
    var lexOrigin = visualForceOrigin[0] + '.lightning.force.com';
    $scope.notificationHandler = new NotificationHandler();
    if (window.modalLabels !== undefined) {
        $scope.modalLabels = window.modalLabels;
    }
    $scope.vlocValueRow = function(dataType){
        return dataType.toLowerCase();
    };
    $scope.initData = function(versionId){
        var inputMap = {
            'versionId':versionId
        }
        ClmContractTermModelService.getVersionData($scope, inputMap).then(function(result) {
            var status = result.result[0][$rootScope.nsPrefix +'Status__c'];
            $scope.versionStatus = (status === 'Active') ? true : false;
        });
    }

    $scope.searchFilter = function(name, term) {
                if (term !== '' && term !== undefined) {
                    var temp = name.toLowerCase();
                    term = term.toLowerCase();
                    if (temp.indexOf(term) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            };

    $scope.setIndex = function(records){
        let count = 0;
        if(records){
            for(let i = 0; i < records.length; i++){
                if(records[i].lineRecordType === 'Product' || records[i][$rootScope.nsPrefix + 'RecordTypeName__c'] === 'Product'){
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
               // $scope.updateContractTerms('', attribute.userValues, attribute.code,record);
            }
        };
        $scope.validateDate = function(action, oldValues, newTermRecord) {
                var startDate = newTermRecord[$rootScope.nsPrefix+'EffectiveStartDate__c'].fieldValue;
                var endDate = newTermRecord[$rootScope.nsPrefix+'EffectiveEndDate__c'].fieldValue;
            
                if ((startDate !== null && endDate !== null) && (Date.parse(startDate) > Date.parse(endDate))) {
                    var data = { message :  "End date should be greater than Start date"} ;
                    var error = {data: data}; //TODO: Use Labels instead of string
                    $scope.notificationHandler.handleError(error);
                    $scope.notificationHandler.hide();
                    newTermRecord[$rootScope.nsPrefix+'EffectiveStartDate__c'].fieldValue = oldValues.startDate;
                    newTermRecord[$rootScope.nsPrefix+'EffectiveEndDate__c'].fieldValue = oldValues.endDate;
                    $scope.$apply()
                } else {
                    $scope.updateContractTerms(action,'','', newTermRecord); 
                }
        }


        $scope.updateContractTerms = function(action, value, code, termRecord){
           //if root doesn't have action, make it
           if(!action){
               action = {
                   updateContractTerms: {
                       rest: {
                           "params": {},
                           "method": "updateContractTerms",
                           "link": null
                       },
                       remote: {
                           params: {
                               "versionId": termRecord[$rootScope.nsPrefix+'ContractVersionId__c'].fieldValue,
                               "termId": termRecord.Id.fieldValue,
                               "startDate": termRecord[$rootScope.nsPrefix+'EffectiveStartDate__c'].fieldValue,
                               "endDate": termRecord[$rootScope.nsPrefix+'EffectiveEndDate__c'].fieldValue,
                               "methodName": "updateContractTerms" }
                           }
                       },
                       client: {
                           "params": {}
                       }
                   }
                   termRecord.actions = {
                       updateContractTerms : action
                   }
               }
           action.updateContractTerms.remote.params.attributeValues = {};
           action.updateContractTerms.remote.params.attributeValues[code] = value;
           ClmContractTermModelService.invokeAction(action.updateContractTerms, $scope);

           //parent.postMessage(message, lexOrigin);
       };

}]);
},{}],4:[function(require,module,exports){
angular.module('clmContractTermModelRuntime').controller('ClmNewTermConfigController',
    ['$scope', '$rootScope', '$timeout','ClmCoverageModelService', 'NotificationHandler', 'ClmValidationHandlerService', function(
    $scope, $rootScope, $timeout, ClmCoverageModelService, NotificationHandler, ClmValidationHandlerService) {
    'use strict';

        $scope.notificationHandler = new NotificationHandler();
        $scope.adjustmentUnits = [
            'Percentage',
            'Currency'
        ];

        $rootScope.config = {
            show : true,
            attr : null
        };

        $scope.adjustmentComments = [
            'Required',
            'Optional',
            'Not Used'
        ];

        $scope.setAttr = function(row, index){
            $rootScope.config.attr =  Object.assign({}, row);
            row.selected = true;
            $rootScope.index = index;
        };

        $scope.configurableTypeListStandard = [
            'Currency',
            'Percent',
            'Text',
            'Number',
            'Datetime',
            'Date',
        ];

        $scope.rulesOptions = {
            ruleTypes: [
                'Hide',
                'Message',
                'Set Value'
            ],
            messageTypes: [{
                code: 'INFO',
                label: 'Information'
            }, {
                code: 'WARN',
                label: 'Warning'
            }, {
                code: 'ERROR',
                label: 'Error'
            }, {
                code: 'RECOMMENDATION',
                label: 'Recommendation'
            }]
        };

         $scope.runtime = {
            isAvailable : true,
            id : null,
            displayText : null,
            value : null,
            isDefault : false
        };
        $scope.configurableTypeListCustomizable = $scope.configurableTypeListStandard;

        $scope.configurableTypeDict = {
                Currency: {
                    type : 'number',
                    valueType: 'currency',
                    subType : true ,
                    displayType :[
                        'Dropdown',
                        'Single Value'
                    ]
                },
                Percent : {
                    type: 'number',
                    valueType: 'percent',
                    subType :true,
                    displayType:[
                        'Single Value',
                        'Slider'
                    ]
                },
                Adjustment : {
                    type: 'number',
                    valueType: 'percent',
                    subType :true,
                    displayType:[
                        'Single Value',
                        'Slider',
                        'Equalizer'
                    ]
                },
                Text: {
                    type: 'text',
                    valueType: 'text',
                    subType: true,
                    displayType:[
                        'Text',
                        'Text Area'
                    ]
                },
                Number : {
                    type:'number',
                    valueType: 'number',
                    subType: true,
                    displayType:[
                        'Single Value',
                        'Slider'
                    ]
                },
                Checkbox: {
                    type: 'checkbox',
                    valueType: 'checkbox',
                    subType : false,
                },
                Datetime : {
                    type:'datetime-local',
                    valueType: 'datetime',
                    subType : false
                },
                Date: {
                    type:'date',
                    valueType: 'date',
                },
                Picklist : {
                    label:'Picklist',
                    type: null,
                    valueType: 'picklist',
                    subType: true,
                    displayType:[
                        'Radiobutton',
                        'Dropdown'
                    ]
                },
                'Multi Picklist' :{
                    type: null,
                    valueType: 'picklist',
                    subType :true,
                    displayType:[
                        'Checkbox',
                        'Dropdown'
                    ]
                },
                Dropdown :{
                    type: null,
                    valueType : 'picklist'
                },
                Radiobutton : {
                    type: 'radio',
                    valueType: 'picklist'
                }
            };
            $scope.minMaxDataTypeList = ['Currency', 'Percent','Number', 'Text'];

           $scope.newAttr = function(){
                console.debug('attr');
                $rootScope.config.product = {};
                $rootScope.config.product.Name = '';
                $rootScope.config.product.Code = '';
                $rootScope.config.category = {};
                $rootScope.config.attr = {};
                $rootScope.config.attr.Name = '';
                $rootScope.config.attr[$rootScope.nsPrefix + 'IsRequired__c'] = false;
                $rootScope.config.attr[$rootScope.nsPrefix + 'IsReadOnly__c'] = false;
                $rootScope.config.attr[$rootScope.nsPrefix + 'IsRatingAttribute__c'] = false;
                $rootScope.config.attr[$rootScope.nsPrefix + 'IsActiveAssignment__c'] = true;
                $rootScope.config.attr[$rootScope.nsPrefix + 'IsConfigurable__c'] = false;
                $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeDisplayNameOverride__c'] =  '';
                $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = [];
                $rootScope.config.attr[$rootScope.nsPrefix + 'IsHidden__c'] = false;

                $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeDisplaySequence__c'] = '1';
                $rootScope.config.attr[$scope.nsPrefix + 'RatingType__c'] = '';

                $rootScope.config.attr[$rootScope.nsPrefix + 'IsConfigurable__c'] = true;
            };

            $scope.setDataType = function(field){
                $rootScope.config.attr.valueType = $scope.configurableTypeDict[$rootScope.config.attr[field.name]].valueType;
                //Set the Category Name and the Attribute Names
                if($rootScope.config.product && $rootScope.config.product.Name){
                      $rootScope.config.category.Name = $rootScope.config.product.Name;
                      $rootScope.config.attr.Name = $rootScope.config.product.Name;
                      $rootScope.config.attr[$rootScope.nsPrefix + 'CategoryName__c'] =  $rootScope.config.product.Name;

                }
                //Set the Category Code and the Attribute Code
                if($rootScope.config.product && $rootScope.config.product.Code){
                      $rootScope.config.category[$rootScope.nsPrefix + 'CategoryCode__c']  = $rootScope.config.product.Code;
                      $rootScope.config.attr[$rootScope.nsPrefix + 'CategoryCode__c']  = $rootScope.config.product.Code;
                }

                if($rootScope.config.attr.valueType === 'date' || $rootScope.config.attr.valueType === 'datetime-local'){
                    if(typeof($rootScope.config.attr[$scope.nsPrefix + 'Value__c'] !== 'date') || typeof($rootScope.config.attr[$scope.nsPrefix + 'Value__c'] !== 'datetime-local') ) {
                        $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = null;
                    }
                }
                if($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Date' ||
                    $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Datetime'){
                     $rootScope.config.attr[$rootScope.nsPrefix + 'Value__c'] = null;
                        $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = {};
                }
                if($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Adjustment'){
                    $rootScope.config.attr[$rootScope.nsPrefix + 'IsConfigurable__c'] = true;
                }
                $rootScope.config.attr.inputDisplayType = $scope.configurableTypeDict[$rootScope.config.attr[field.name]].type;
                var dataType =  $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'];
                if(!$scope.configurableTypeDict[dataType].subType) {
                    $rootScope.config.attr[$rootScope.nsPrefix + 'UIDisplayType__c'] = null;
                }
                if($rootScope.config.attr[$rootScope.nsPrefix + 'IsConfigurable__c'] &&  $scope.configurableTypeDict[dataType].displayType){
                    $rootScope.config.attr[$rootScope.nsPrefix + 'UIDisplayType__c'] =  $scope.configurableTypeDict[dataType].displayType[0];
                    var displayType =  $rootScope.config.attr[$rootScope.nsPrefix + 'UIDisplayType__c'];
                    if(displayType === 'Slider' || displayType === 'Equalizer') {
                        if(displayType === 'Equalizer'){
                              $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = 0;
                        }
                        $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = {};
                    } else {
                        if(!Array.isArray($rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'])){
                            $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = [];
                        }
                    }

                }
            };

            $scope.updateOptionsReadOnly = function(){
                if($rootScope.config.attr[$rootScope.nsPrefix + 'IsReadOnly__c']){
                    for(var i = 0; i < $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length; i++){
                        if(!$rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isDefault){
                            $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isAvailable = false;
                        } else {
                             $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isAvailable = true;
                        }
                    }
                }
            };

            $scope.setDisplayType = function(){
                var displayType = $rootScope.config.attr[$rootScope.nsPrefix + 'UIDisplayType__c'];
                var dataType =  $rootScope.config.attr[$rootScope.nsPrefix + 'k17__ValueDataType__c'];
                if(displayType === 'Slider' || displayType === 'Equalizer') {
                    if(displayType === 'Equalizer'){
                        $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = 0;
                    }
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = {};
                } else {
                    if(!Array.isArray($rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'])){
                        $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = [];
                    }
                }
            };

            $scope.showRules = function(index){
                for(var i = 0; i < $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'].length; i++){
                    $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'][i].showRules = index === i;
                }
            };

            $scope.addRunTimeValue = function() {
                if($scope.runtime.value || $scope.runtime.displayText){
                    if(!$rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] || $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length === 0) {
                        $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = [];
                        if($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Picklist' || $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Currency'){
                            $scope.runtime.isDefault = true;
                        }
                    }
                     $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].push($scope.runtime);
                     $scope.runtime = {
                        isAvailable : true,
                        value : '',
                        isDefault : false
                     };
                     if( $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length === 1){
                        if($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Picklist' || $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Currency'){
                            $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] =  $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][0].value;
                        } else {
                             // no defaut value for multipicklist
                             $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = [];
                        }
                    }
                }
            };

            $scope.initOptionRules = function(option){
                if(!option.rules){
                    option.rules = [];
                } else if(typeof(option.rules) === 'string'){
                    option.rules = JSON.parse(option.rules);
                }
                console.log(option.rules);
            };

            $scope.deleteRunTimeValue = function(option){
                var i = $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].indexOf(option);
                if( $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isDefault && ($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Picklist' || $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Currency')){
                    if(i > 0){
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i - 1].isDefault = true;
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] =    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i - 1].value;
                    } else {
                        if($rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i + 1]){
                            $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i + 1].isDefault = true;
                            $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] =    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i + 1].value;
                        }
                 }
                }  else if($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Multi PickList'){
                    var k = $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].indexOf(option.value);
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].splice(k, 1);
                }
                if (i > -1) {
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].splice(i, 1);
                }
            };

            $scope.setMultiPicklist = function(option){
                if(option.isDefault){
                    if(!$rootScope.config.attr[$scope.nsPrefix + 'Value__c']){
                        $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = [];
                    } else if(typeof($rootScope.config.attr[$scope.nsPrefix + 'Value__c']) !== 'object'){
                      $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = [];
                    }
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].push(option.value);
                } else {
                    var k = $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].indexOf(option.value);
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].splice(k, 1);
                    if($rootScope.config.attr[$rootScope.nsPrefix + 'IsReadOnly__c']){
                       option.isAvailable = false;
                    }
                }
            };


            $scope.setMultiPicklistCoverage = function(option){
                if(option.isDefault){
                    if(!$rootScope.config.attr[$scope.nsPrefix + 'Value__c']){
                        $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = [];
                    } else if(typeof($rootScope.config.attr[$scope.nsPrefix + 'Value__c']) !== 'object'){
                      $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = [];
                    }
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].push(option.value);
                } else {
                    var k = $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].indexOf(option.value);
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].splice(k, 1);
                }
            };

            $scope.setDefaultOptionCoverage = function(index){
                for(var i = 0; i < $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length; i++){
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isDefault = false;
                    if($rootScope.config.attr[$rootScope.nsPrefix + 'IsReadOnly__c']){
                        $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isAvailable = false;
                    }
                    if(i === index && ($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Picklist' || $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Currency')) {
                        $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isDefault = true;
                        $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isAvailable = true;
                        $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] =  $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].value;
                    }
                }
            };

            $scope.setDefaultOption = function(index){
                for(var i = 0; i < $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length; i++){
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isDefault = false;
                    if(i === index && ($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Picklist' || $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Currency')) {
                        $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isDefault = true;
                        $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isAvailable = true;
                        $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] =  $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].value;
                    }
                }
            };

            $scope.toNumber = function(n){
                $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = parseInt(n);
            };

            $scope.creteNewContractTerms = function(records, type) {
            var recordMap = records;
            if(recordMap.category.name == undefined ||  recordMap.category.name == '' || recordMap.category.name == null){
                  recordMap.category.Name = recordMap.product.Name;
                  recordMap.attr.Name = recordMap.product.Name;
                  recordMap.attr[$rootScope.nsPrefix + 'CategoryName__c'] =  recordMap.product.Name;
                  //Set the Category Code and the Attribute Code
                  if(recordMap.product && recordMap.product.Code){
                        recordMap.category[$rootScope.nsPrefix + 'CategoryCode__c']  = recordMap.product.Code;
                        recordMap.attr[$rootScope.nsPrefix + 'CategoryCode__c']  = recordMap.product.Code;
                  }
            }
            var lst = [];
            var productInfo = recordMap.product;
            var categoryInfo = recordMap.category;
            var attributeMap = {};
            attributeMap[recordMap.attr[$rootScope.nsPrefix + 'CategoryCode__c']] = recordMap.attr;
            var inputMap = {
                    productInfo: productInfo,
                    categoryInfo: categoryInfo,
                    'versionId': $rootScope.versionId,
                    'termType' : 'TermSpec',
                     attributeValues : attributeMap
            };
            if (type === 'Non-Pricing' ) {
                console.log('add Terms');
                inputMap.coverageIds = lst;
                ClmCoverageModelService.createNewContractTerms($scope, inputMap, 'TermSpec').then(function(data){
                    var addedprodIds = data.result.productIdList;
                    //$scope.sortedList = $scope.sortedList.filter(notAddedProducts => !addedprodIds.includes(notAddedProducts.productId));
                });
            }
        };

}]);
},{}],5:[function(require,module,exports){
angular.module('clmContractTermModelRuntime').directive('clmCollapseCalcHeight', ['$timeout', function($timeout) {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var watchElementsClassNames = ['.slds-accordion__content', '.vloc-attr-row'];//TODO:Anything needs tobe modified here?
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
angular.module('clmContractTermModelRuntime').directive('hideNotification', function($rootScope, $timeout) {
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

},{}],7:[function(require,module,exports){
angular.module('clmContractTermModelRuntime')
.factory('ClmContractTermModelService', ['$http', 'dataSourceService','$timeout', 'dataService', 'ClmTermModalService','ClmValidationHandlerService','NotificationHandler', '$q', '$rootScope',
        function($http, dataSourceService, $timeout, dataService, ClmTermModalService,ClmValidationHandlerService, NotificationHandler, $q, $rootScope) {
    'use strict';

    var REMOTE_CLASS = 'ContractTermRuntimeHandler';
    var DUAL_DATASOURCE_NAME = 'Dual';
    var insideOrg = false;
    var errorContainer = {};

    var refreshList = function(type) {
        var message = {
            event: 'reload'
        };
        $rootScope.$broadcast('vlocity.layout.clm-runtime-contract-term.events', message);
        $rootScope.isLoaded = true;
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

     var scrollTop = function(){
            if ('parentIFrame' in window) {
                window.parentIFrame.scrollTo(0);
            } else {
                $('body').scrollTop(0);
            }
        };

    return {
        refreshList: function(scope,type){
            refreshList(type);
        },
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
                    $rootScope.isLoaded = true; 
                }, function(error) {
                    deferred.reject(error);
                    console.log(error);
                    $rootScope.isLoaded = true;
                });
            return deferred.promise;
        },
        launchNewAttrModal: function(scope, fn) {
                        console.log('call modal with service', $rootScope.productId);
                        $rootScope.isLoaded = false;
                        scrollTop();
                        var modalData = {};
                        var effectiveDate = null;
                        var deferred = $q.defer();
                        var nsPrefix = fileNsPrefix().replace('__', '');
                        var datasource = {};
                        var inputMap = {'versionId' : scope.versionId, 'termType' : 'TermSpec'};
                        $rootScope.versionId =  scope.versionId;
                        datasource.type = 'Dual';
                        datasource.value = {};
                        datasource.value.remoteNSPrefix = nsPrefix;
                        datasource.value.inputMap = inputMap;
                        datasource.value.remoteClass = 'ContractTermRuntimeHandler';
                        datasource.value.remoteMethod = fn;
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
                                if(fn === 'getTermsForAddition'){
                                    modalData.records = data;
                                    modalData.type = 'TermSpec';
                                    }
                                if(modalData){
                                //console.log('_____',ClmTermModalService);
                                ClmTermModalService.launchModal(
                                      scope,
                                      'clm-runtime-add-existing-term-modal',
                                      modalData,
                                      'ClmContractTermModelController',
                                      'clm-runtime-add-existing-term-modal'
                                  );
                                }
                                $rootScope.isLoaded = true;
                            }, function(error) {
                                console.error(error);
                                deferred.reject(error);
                            });
                       return  deferred.promise;
                    },
        addContractTerms: function(scope, inputMap, type) {
                    $rootScope.isLoaded = false;
                    var fn = '';
                    console.log('call add terms with', scope);
                    if (type === 'TermSpec'){
                        fn = 'addContractTerms';
                    }
                    $rootScope.isLoaded = false;
                    var modalData = {};
                    var effectiveDate = null;
                    var deferred = $q.defer();
                    var nsPrefix = fileNsPrefix().replace('__', '');
                    var datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.inputMap = inputMap;
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'ContractTermRuntimeHandler';
                    datasource.value.remoteMethod = fn;
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function(data) {
                        //Access Scope
                            console.log(data);
                            ///Refresh the current List of Products..
                            deferred.resolve(data);
                            refreshList(type);
                            var message = 'Added Terms Successfully';
                            scope.notificationHandler.handleSuccess(message);
                            scope.notificationHandler.hide();
                            $timeout(function() {
                                ClmTermModalService.hideModal();
                            }, 250);
                            $rootScope.isLoaded = true;
                        }, function(error) {
                            console.error(error);
                            deferred.reject(error);
                            ClmValidationHandlerService.throwError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                   return  deferred.promise;
                },
        createNewContractTerms: function(scope, inputMap, type) {
                            $rootScope.isLoaded = false;
                            var fn = '';
                            console.log('call add terms with', scope);
                            if (type === 'TermSpec'){
                                fn = 'createNewContractTerms';
                            }
                            $rootScope.isLoaded = false;
                            var modalData = {};
                            var effectiveDate = null;
                            var deferred = $q.defer();
                            var nsPrefix = fileNsPrefix().replace('__', '');
                            var datasource = {};
                            datasource.type = 'Dual';
                            datasource.value = {};
                            datasource.value.inputMap = inputMap;
                            datasource.value.remoteNSPrefix = nsPrefix;
                            datasource.value.remoteClass = 'ContractTermRuntimeHandler';
                            datasource.value.remoteMethod = fn;
                            datasource.value.apexRemoteResultVar = 'result.records';
                            datasource.value.methodType = 'GET';
                            datasource.value.apexRestResultVar = 'result.records';
                            console.log('datasource', datasource);
                            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                            dataSourceService.getData(datasource, scope, null).then(
                                function(data) {
                                //Access Scope
                                    console.log(data);
                                    ///Refresh the current List of Products..
                                    deferred.resolve(data);
                                    refreshList(type);
                                    var message = 'Added Terms Successfully';
                                    scope.notificationHandler.handleSuccess(message);
                                    scope.notificationHandler.hide();
                                    $timeout(function() {
                                        ClmTermModalService.hideModal();
                                    }, 250);
                                    $rootScope.isLoaded = true;
                                }, function(error) {
                                    console.error(error);
                                    deferred.reject(error);
                                    ClmValidationHandlerService.throwError(error);
                                    scope.notificationHandler.hide();
                                    $rootScope.isLoaded = true;
                                });
                           return  deferred.promise;
                        },
        deleteContractTerms: function(scope, inputMap, type) {
                $rootScope.isLoaded = false;
                var fn = '';
                console.log('call add terms with', scope);
                if (type === 'TermSpec'){
                    fn = 'deleteContractTerms';
                }
                $rootScope.isLoaded = false;
                var modalData = {};
                var effectiveDate = null;
                var deferred = $q.defer();
                var nsPrefix = fileNsPrefix().replace('__', '');
                var datasource = {};
                datasource.type = 'Dual';
                datasource.value = {};
                datasource.value.inputMap = inputMap;
                datasource.value.remoteNSPrefix = nsPrefix;
                datasource.value.remoteClass = 'ContractTermRuntimeHandler';
                datasource.value.remoteMethod = fn;
                datasource.value.apexRemoteResultVar = 'result.records';
                datasource.value.methodType = 'GET';
                datasource.value.apexRestResultVar = 'result.records';
                console.log('datasource', datasource);
                // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                dataSourceService.getData(datasource, scope, null).then(
                    function(data) {
                    //Access Scope
                        console.log(data);
                        ///Refresh the current List of Products..
                        deferred.resolve(data);
                        refreshList(type);
                        var message = 'Deleted Terms Successfully';
                        scope.notificationHandler.handleSuccess(message);
                        scope.notificationHandler.hide();
                        $timeout(function() {
                            ClmTermModalService.hideModal();
                        }, 250);
                        $rootScope.isLoaded = true;
                    }, function(error) {
                        console.error(error);
                        deferred.reject(error);
                        scope.notificationHandler.hide();
                        $rootScope.isLoaded = true;
                    });
               return  deferred.promise;
            },
        launchNewTermModal: function(scope, fn) {
                console.log('call modal with service', $rootScope.productId);
                $rootScope.isLoaded = false;
                scrollTop();
                var modalData = {};
                var effectiveDate = null;
                var deferred = $q.defer();
                var nsPrefix = fileNsPrefix().replace('__', '');
                var datasource = {};
                var inputMap = {'versionId' : scope.versionId, 'termType' : 'TermSpec'};
                $rootScope.versionId =  scope.versionId;
                datasource.type = 'Dual';
                datasource.value = {};
                datasource.value.remoteNSPrefix = nsPrefix;
                datasource.value.inputMap = inputMap;
                datasource.value.remoteClass = 'ContractTermRuntimeHandler';
                datasource.value.remoteMethod = fn;
                datasource.value.apexRemoteResultVar = 'result.records';
                datasource.value.methodType = 'GET';
                datasource.value.apexRestResultVar = 'result.records';
                console.log('datasource', datasource);
                 if(modalData){
                //console.log('_____',ClmTermModalService);
                    ClmTermModalService.launchModal(
                          scope,
                          'clm-runtime-create-new-term-container',
                          modalData,
                          'ClmNewTermConfigController',
                          'clm-runtime-create-new-term-container'
                     );
                }
                $rootScope.isLoaded = true;
                // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
               return  deferred.promise;
            },
            getVersionData: function(scope,inputMap) {
                $rootScope.isLoaded = false;
                            var fn = 'getVersionData';
                            var modalData = {};
                            var effectiveDate = null;
                            var deferred = $q.defer();
                            var nsPrefix = fileNsPrefix().replace('__', '');
                            var datasource = {};
                            datasource.type = 'Dual';
                            datasource.value = {};
                            datasource.value.inputMap = inputMap;
                            datasource.value.remoteNSPrefix = nsPrefix;
                            datasource.value.remoteClass = 'ContractTermRuntimeHandler';
                            datasource.value.remoteMethod = fn;
                            datasource.value.apexRemoteResultVar = 'result.records';
                            datasource.value.methodType = 'GET';
                            datasource.value.apexRestResultVar = 'result.records';
                            console.log('datasource', datasource);
                            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                            dataSourceService.getData(datasource, scope, null).then(
                                function(data) {
                                //Access Scope
                                ///Refresh the current List of Products..
                                deferred.resolve(data);
                                $rootScope.isLoaded = true;
                                }, function(error) {
                                    console.error(error);
                                    deferred.reject(error);
                                    $rootScope.isLoaded = true;
                                });
                           return  deferred.promise;
            },
            getContractPricingTerms: function(scope,inputMap) {
                $rootScope.isLoaded = false;
                            var fn = 'getContractPricingTerms';
                            var effectiveDate = null;
                            var deferred = $q.defer();
                            var nsPrefix = fileNsPrefix().replace('__', '');
                            var datasource = {};
                            datasource.type = 'Dual';
                            datasource.value = {};
                            datasource.value.inputMap = inputMap;
                            datasource.value.remoteNSPrefix = nsPrefix;
                            datasource.value.remoteClass = 'ContractTermRuntimeHandler';
                            datasource.value.remoteMethod = fn;
                            datasource.value.apexRemoteResultVar = 'result.records';
                            datasource.value.methodType = 'GET';
                            datasource.value.apexRestResultVar = 'result.records';
                            console.log('datasource', datasource);
                            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                            dataSourceService.getData(datasource, scope, null).then(
                                function(data) {
                                //Access Scope
                                ///Refresh the current List of Products..
                                deferred.resolve(data);
                                $rootScope.isLoaded = true;
                                }, function(error) {
                                    console.error(error);
                                    deferred.reject(error);
                                    $rootScope.isLoaded = true;
                                });
                           return  deferred.promise;
            }
    };
}]);

},{}],8:[function(require,module,exports){
angular.module('clmContractTermModelRuntime').factory('ClmTermModalService',
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
            modalScope.title = 'Add Contract Terms';
            modalScope.customClass = customClass;
            insModal = $sldsModal({
                scope: modalScope,
                templateUrl: 'modals/clm-term-modal.tpl.html',
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

},{}],9:[function(require,module,exports){
angular.module('clmContractTermModelRuntime').factory('NotificationHandler', [
    '$rootScope', '$timeout', function($rootScope, $timeout) {
    'use strict';
    var NotificationHandler = function() {
        this.initialize = function() {

        };

        this.handleError = function(error) {
            console.log('Errormessage', error);
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
},{}],10:[function(require,module,exports){
angular.module('clmContractTermModelRuntime').service('ClmCustomViewsService', ['$timeout', '$log', '$rootScope', 'dataService',
    function($timeout, $log, $rootScope, dataService) {
    'use strict';
    var ClmCustomViewsService = function(scp, cards, currentViewIndex, assetsView) {
        var self = this;

        this.initialize = function() {
            try {
                this.getActiveStates();
                this.checkCustomViews();


            } catch (e) { $log.debug(e); }
        };

        this.statesData = [];
        this.getStates = function(activeStates) {
            angular.forEach(activeStates, function(state) {
                var stateName = state.name.split('_');
                // To support BasicView in v15.3
                var customViewName = (assetsView) ? 'CustomView' : 'BasicView';

                if (stateName[0] === customViewName) {
                    if (!self.isStatePresent(self.statesData, state.name)) {
                        state.viewName = stateName[1];
                        self.statesData.push(state);
                    }
                }
            });
        };

        this.isStatePresent = function(statesData,stateName) {
            var i;
            for (i = 0;i < statesData.length;i++) {
                if (stateName === statesData[i].name) {
                    return true;
                }
            }
            return false;
        };

        this.getActiveStates = function() {
            var activeStates;
            var self = this;
            angular.forEach(cards, function(card) {
                if (typeof card.invokeCardFunctions == 'function') {
                    activeStates = card.invokeCardFunctions('getActiveStates');
                }
                activeStates = activeStates ? activeStates.data : cards[0].states;
                self.getStates(activeStates);
            });
        };

        // Assign global custom views variable to scope
        this.clmCustomViews = undefined;
        this.checkCustomViews = function() {
            var key, i, j, viewName;
            if (this.statesData && self.clmCustomViews === undefined) {
                self.clmCustomViews = this.statesData;
                for (i = 0; i < self.clmCustomViews.length; i++) {
                    for (j = 0; j < self.clmCustomViews[i].fields.length; j++) {

                        // If there is no classSuffix key, add it based on the input key
                        if (!self.clmCustomViews[i].fields[j].data || !self.clmCustomViews[i].fields[j].data.classSuffix) {
                            self.clmCustomViews[i].fields[j].data = self.clmCustomViews[i].fields[j].data || {};
                            self.clmCustomViews[i].fields[j].data.classSuffix = self.clmCustomViews[i].fields[j].type.toLowerCase();
                        }

                        // Add fieldName
                        viewName = self.clmCustomViews[i].fields[j].name.match(/\[([^\]]+)]/);
                        if (viewName && viewName.length > 0) {
                            self.clmCustomViews[i].fields[j].fieldName = viewName[1].replace(/(^'|'$)/g, '');
                        } else {
                            self.clmCustomViews[i].fields[j].fieldName = self.clmCustomViews[i].fields[j].name;
                        }
                    }
                }
            } else {
                $timeout(self.checkCustomViews, 500);
            }
        };

        this.initialize();
    };
    return (ClmCustomViewsService);
}]);

},{}],11:[function(require,module,exports){
angular.module("clmContractTermModelRuntime").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("clm-attribute-display-edit.tpl.html",'<div ng-repeat="category in categories" class="slds-grid slds-wrap" ng-class="{\'slds-p-left_large\' : record.showMore || !showFirstAttr, \'slds-m-top_small\' : record.showMore}" ng-hide="($index !== 0 && !record.showMore && showFirstAttr)">\n      <div class="slds-text-title_caps slds-p-bottom_x-small" ng-if="record.showMore || !showFirstAttr">{{category.Name}}</div>\n      <div class="slds-size_1-of-1 slds-grid slds-wrap">\n            <div ng-repeat="attr in category.productAttributes.records" ng-if="!attr.hiddenByRule && !attr.adjustmentUnits" ng-hide="($index !== 0 && !record.showMore && showFirstAttr)" ng-class="{\'slds-size_1-of-1\': !record.showMore && showFirstAttr, \'slds-size_1-of-3\' : record.showMore || !showFirstAttr}">\n\n                  <div class="slds-small-show vloc-attr-cell slds-size_1-of-1 slds-m-top_x-small">\n                        <div class="vloc-attrs-header-label slds-truncate">\n                              {{attr.label}} <span class="slds-float_right slds-p-right_large">{{attr.userValues.label}}</span>\n                        </div>\n                  </div>\n\n                  <div class="vloc-attr-data-cell slds-p-top_xx-small" ng-class="{\'slds-truncate\' : attr.inputType !== \'date\' && attr.inputType !== \'datetime\'}">\n                        \x3c!-- multiselect checkbox --\x3e\n                        <div class="slds-size_5-of-12 via-ins-attributes-attribute-multiselect-checkbox" ng-if="attr.multiselect && attr.inputType === \'checkbox\'">\n                              <div class="via-ins-attributes-attribute-uservalues" ng-class="{\'slds-size_7-of-12\': !attribute.showOverride}">\n                                    <fieldset class="slds-form-element">\n                                          <div class="slds-form-element__control">\n                                          <span class="slds-checkbox" ng-repeat="value in attr.values" ng-if="!value.hiddenByRule">\n                                          <input type="checkbox" id="attr-ms-cb-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}" \n                                                checked=""  ng-model="attr.userValues[$index][value.value]"\n                                                ng-disabled="($index === attr.ruleSetValueIndex && attribute.ruleSetValue) || !importedScope.versionStatus" \n                                                ng-click="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" />\n                                          <label class="slds-checkbox__label" for="attr-ms-cb-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}">\n                                          <span class="slds-checkbox_faux"></span>\n                                          <span class="slds-form-element__label">{{value.label}}</span>\n                                          </label>\n                                          </span>\n                                          </div>\n                                    </fieldset>\n                              </div>\n                        </div>\n                        \x3c!-- multiselect radio --\x3e\n                        <div class="slds-size_5-of-12 via-ins-attrs-attr-radio-picklist" ng-if="attr.dataType === \'text\' && attr.inputType === \'radio\'">\n                              <div class="via-ins-attrs-attr-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attr.showOverride, \'slds-size_7-of-12\': !attr.showOverride}">\n                                    <fieldset class="slds-form-element">\n                                          <div class="slds-form-element__control">\n                                          <span class="slds-radio" ng-repeat="value in attr.values" ng-if="!value.hiddenByRule">\n                                          <input type="radio" id="attr-radio-pl-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attr.attributeId}}-{{value.value}}" ng-disabled="attr.disabled || attr.readonly || !importedScope.versionStatus" ng-checked="value.value === attr.userValues" ng-click="attr.userValues = value.value; importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" />\n                                          <label class="slds-radio__label" for="attr-radio-pl-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attr.attributeId}}-{{value.value}}">\n                                          <span class="slds-radio_faux"></span>\n                                          <span class="slds-form-element__label">{{value.label}}</span>\n                                          </label>\n                                          </span>\n                                          </div>\n                                    </fieldset>\n                              </div>\n                        </div>\n                        \x3c!-- multiselect dropdown --\x3e\n                        <div class="slds-size_8-of-12 via-ins-attrs-attr-multiselect-dropdown" ng-if="attr.multiselect && attr.inputType === \'dropdown\'">\n                              <div class="via-ins-attrs-attr-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attr.showOverride, \'slds-size_7-of-12\': !attr.showOverride}">\n                                    <div class="slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open">\n                                          <button class="slds-button slds-button_neutral via-ins-attrs-attr-dropdown-button" aria-haspopup="true" \n                                          ng-disabled="attr.disabled || attr.readonly || !importedScope.versionStatus" ng-click="attr.dropdownOpen = !attr.dropdownOpen"\n                                          title="Show More" ng-model="attr.userValues[$index][value.value]" id="dropdown-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attr.attributeId}}" \n                                          restrict-element="via-ins-attrs-attr-dropdown-items" ng-init="importedScope.countSelected(attr)">\n                                                <span>{{attr.multiSelectCount}} Selected</span>\n                                                <slds-button-svg-icon sprite="\'utility\'" icon="\'down\'" extra-classes="\'slds-button__icon_right\'"></slds-button-svg-icon>\n                                                <span class="slds-assistive-text">Show More</span>\n                                          </button>\n                                          <div class="slds-dropdown slds-dropdown_left via-ins-attrs-attr-dropdown-items" ng-show="attr.dropdownOpen" ng-class="{\'slds-is-relative\' : attr.dropdownOpen}">\n                                                <ul class="slds-dropdown__list via-ins-attrs-attr-dropdown-items-list" role="menu">\n                                                      <li class="slds-align_absolute-center slds-dropdown__item via-ins-attrs-attr-dropdown-items-item slds-p-around_small"  ng-class="{\'slds-theme_shade\': value.isSelected}" role="presentation" ng-repeat="value in attr.values" \n                                                      ng-click="value.isSelected = !value.isSelected; importedScope.toggleValue(attr, value, value.ruleSetValue, productRecord)" ng-if="!value.hiddenByRule" ng-init="value.isSelected =  (attr.userValues.indexOf(value.value) > -1)">\n                                                            <span class="slds-truncate" title="Menu Item One">{{value.label}}</span>\n                                                      </li>\n                                                </ul>\n                                                <button class="slds-button slds-button_link slds-align_absolute-center" ng-click="attr.dropdownOpen = !attr.dropdownOpen; importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)">Save</button>\n                                          </div>\n                                    </div>\n                              </div>\n                        </div>\n\n                        \x3c!-- dropdown !multiselect --\x3e\n                        <div ng-if="attr.inputType === \'dropdown\' && !attr.multiselect" class="slds-size_5-of-12">\n                              <div class="slds-form-element__control slds-select_container slds-m-bottom_small">\n                                    <div class="slds-select_container">\n                                          <select ins-rules-evaluate="attr" ins-rules-product="record" ng-options="value.value as value.label for value in attr.values" ng-model="attr.userValues"  class="slds-select slds-m-right_xx-small" id="select-{{$index}}-{{$parent.$index}}-{{$parent.$parent.$index}}" ng-change="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" ng-disabled="attr.disabled || attr.readonly || !importedScope.versionStatus">\n                                          </select>\n                                    </div>\n                              </div>\n                        </div>\n                        \x3c!-- range --\x3e\n                        <div class="slds-size_5-of-12 vloc-slider_container" ng-if="attr.inputType === \'range\'">\n                              <div class="slds-form-element">\n                                    <label class="slds-form-element__label" for="slider-id-01">\n                                    <span class="slds-slider-label">\n                                    <span class="slds-slider-label__range">{{attr.min}} - {{attr.max}}</span>\n                                    </span>\n                                    </label>\n                                    <div class="slds-form-element__control">\n                                          <div class="slds-slider">\n                                                <input type="range"  min="{{attr.min}}" max="{{attr.max}}" ins-rules-evaluate="attr" ins-rules-product="record"  id="attr-slider-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}" class="slds-slider__range" ng-disabled="attr.disabled || attr.readonly || !importedScope.versionStatus" ng-model="attr.userValues" ng-change="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)"/>\n                                                <span class="slds-slider__value" aria-hidden="true">{{attr.userValues}}</span>\n                                          </div>\n                                    </div>\n                              </div>\n                        </div>\n                        \x3c!-- TextBox --\x3e\n                        <div class="slds-p-bottom_x-small" ng-if=" attr.inputType !== \'radio\' && attr.inputType !== \'dropdown\'  && attr.inputType !== \'checkbox\' && attr.inputType !== \'range\' && attr.inputType !== \'date\' && attr.inputType !== \'datetime\'">\n                              <input class="slds-size_5-of-12 slds-input" ins-rules-evaluate="attr" ins-rules-product="record"  ng-model="attr.userValues" ng-disabled="attr.disabled || attr.readonly || !importedScope.versionStatus" />\n                              <button ng-if="!attr.disabled && !attr.readonly && importedScope.versionStatus" class="slds-button slds-button_link slds-m-left_small vloc-attr-showmore-btn" ng-click="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)">Save</button>\n                        </div>\n                        \x3c!-- date --\x3e\n                        <div class="slds-form-element slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open slds-size_5-of-12" ng-if="attr.inputType === \'date\'">\n                              <input class="slds-input slds-m-bottom_small" slds-date-picker ng-disabled="attr.disabled || attr.readonly || !importedScope.versionStatus" ng-change="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" ng-model="attr.userValues">\n                        </div>\n                        \x3c!-- dateTime --\x3e\n                        <input ng-if="attr.inputType === \'datetime\'" ng-change="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" class="slds-input slds-m-bottom_small slds-size_2-of-6 slds-m-right_medium" slds-date-picker ng-model="attr.userValues"  ng-disabled="attr.disabled || attr.readonly || !importedScope.versionStatus">\n                        <input ng-if="attr.inputType === \'datetime\'" ng-change="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" class="slds-input slds-m-bottom_small slds-size_2-of-8" slds-time-picker ng-model="attr.userValues"  ng-disabled="attr.disabled || attr.readonly || !importedScope.versionStatus">\n\n                        \x3c!-- checkbox && !multiselect --\x3e\n                        <div class="slds-form-element__control slds-text-align_left" ng-if="attr.inputType === \'checkbox\' && !attr.multiselect">\n                              <span class="slds-checkbox">\n                                    <input ins-rules-evaluate="attr" ins-rules-product="record" type="checkbox" name="showmore-attrs-{{$index}}" id="showmore-attrs-{{$index}}" ng-model="attr.userValues" ng-change="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" ng-disabled="attr.disabled || attr.readonly || !importedScope.versionStatus"/>\n                                    <label class="slds-checkbox__label slds-m-around_none" for="showmore-attrs-{{$index}}">\n                                          <span class="slds-checkbox_faux vloc-check"></span>\n                                    </label>\n                              </span>\n                        </div>\n                  </div>\n            </div>\n      </div>\n</div>'),$templateCache.put("clm-attribute-display.tpl.html",'<div ng-repeat="category in categories" class="slds-grid slds-wrap" ng-class="{\'slds-p-left_large slds-p-top_small\' : record.showMore || !showFirstAttr}" \n   ng-hide="($index !== 0 && !record.showMore && showFirstAttr)">\n   <div class="slds-text-title_caps" ng-if="record.showMore || !showFirstAttr" class="slds-label">{{category.Name}}</div>\n   <div class="slds-size_1-of-1 slds-grid slds-wrap">\n      <div ng-repeat="attr in category.productAttributes.records" ng-if="!attr.hiddenByRule && !attr.adjustmentUnits" ng-hide="($index !== 0 && !record.showMore && showFirstAttr)" ng-class="{\'slds-size_1-of-1\': !record.showMore && showFirstAttr, \'slds-size_1-of-3\' : record.showMore || !showFirstAttr}">\n         <div class="slds-small-show vloc-attr-cell slds-size_1-of-1 slds-m-top_x-small">\n            <div class="vloc-attr-title-cell slds-truncate vloc-attrs-header-label slds-m-top-x-small" title="{{attr.label}}">\n               <div class="slds-truncate">\n                  {{attr.label}} <span class="slds-float_right slds-p-right_large">{{attr.userValues.label}}</span>\n               </div>\n            </div>\n\n            \x3c!-- multiselect checkbox --\x3e\n            <div class="vloc-attr-data-cell slds-truncate slds-p-top_xx-small slds-m-right_small">\n               <div class="slds-grid via-ins-attributes-attribute-multiselect-checkbox" ng-if="attr.multiselect && attr.inputType === \'checkbox\'">\n                  <div class="via-ins-attributes-attribute-uservalues" ng-class="{\'slds-size_7-of-12\': !attribute.showOverride}">\n                     <fieldset class="slds-form-element">\n                        <div class="slds-form-element__control">\n                           <span class="slds-checkbox" ng-repeat="value in attr.values" ng-if="!value.hiddenByRule">\n                           <input type="checkbox" id="attr-ms-cb-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}" checked="" ng-model="attr.userValues[$index][value.value]" ng-disabled="true" />\n                           <label class="slds-checkbox__label" for="attr-ms-cb-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}">\n                           <span class="slds-checkbox_faux"></span>\n                           <span class="slds-form-element__label">{{value.label}}</span>\n                           </label>\n                           </span>\n                        </div>\n                     </fieldset>\n                  </div>\n               </div>\n               \x3c!-- multiselect radio --\x3e\n               <div class="slds-grid via-ins-attrs-attr-radio-picklist" ng-if="attr.dataType === \'text\' && attr.inputType === \'radio\'">\n                  <div class="via-ins-attrs-attr-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attr.showOverride, \'slds-size_7-of-12\': !attr.showOverride}">\n                     <fieldset class="slds-form-element">\n                        <div class="slds-form-element__control">\n                           <span class="slds-radio" ng-repeat="value in attr.values" ng-if="!value.hiddenByRule">\n                           <input type="radio" id="attr-radio-pl-{{product.ProductCode}}-{{category.Code__c}}-{{attr.attrId}}-{{value.value}}" ng-checked="value.value === attr.userValues" ng-click="attr.userValues = value.value; importedScope.updateQLI(record.actions, attr.userValues, attr.code)" ng-disabled="true" />\n                           <label class="slds-radio__label" for="attr-radio-pl-{{product.ProductCode}}-{{category.Code__c}}-{{attr.attrId}}-{{value.value}}">\n                           <span class="slds-radio_faux"></span>\n                           <span class="slds-form-element__label">{{value.label}}</span>\n                           </label>\n                           </span>\n                        </div>\n                     </fieldset>\n                  </div>\n               </div>\n               \x3c!-- multiselect dropdown --\x3e\n               <div class="slds-grid via-ins-attrs-attr-multiselect-dropdown" ng-if="attr.multiselect && attr.inputType === \'dropdown\'">\n                  <div class="via-ins-attrs-attr-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attr.showOverride, \'slds-size_7-of-12\': !attr.showOverride}">\n                     <div class="slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open" ng-init="attr.dropdownOpen = false">\n                        <button class="slds-button slds-button_neutral via-ins-attrs-attr-dropdown-button" aria-haspopup="true" title="Show More" ng-model="attr.userValues[$index][value.value]" id="dropdown-{{product.ProductCode}}-{{category.Code__c}}-{{attr.attrId}}" ins-dropdown-handler="attr.dropdownOpen = !attr.dropdownOpen" restrict-element="via-ins-attrs-attr-dropdown-items" ng-init="importedScope.countSelected(attr)">\n                           <span>{{attr.multiSelectCount}} Selected</span>\n                           <slds-button-svg-icon sprite="\'utility\'" icon="\'down\'" extra-classes="\'slds-button__icon_right\'"></slds-button-svg-icon>\n                           <span class="slds-assistive-text">Show More</span>\n                        </button>\n                        <div class="slds-dropdown slds-dropdown_left via-ins-attrs-attr-dropdown-items" ng-show="attr.dropdownOpen" ng-class="{\'slds-is-relative\' : attr.dropdownOpen}">\n                           <ul class="slds-dropdown__list via-ins-attrs-attr-dropdown-items-list" role="menu">\n                              <li class="slds-dropdown__item via-ins-attrs-attr-dropdown-items-item slds-p-around_small"  ng-class="{\'slds-theme_shade\': value.isSelected}" role="presentation" ng-repeat="value in attr.values" ng-click="importedScope.toggleValue(attr, value, value.ruleSetValue, record)" ng-if="!value.hiddenByRule" ng-init="value.isSelected =  (attr.userValues.indexOf(value.value) > -1)">\n                                 <slds-svg-icon sprite="\'utility\'" icon="\'check\'" size="\'x-small\'" extra-classes="\'slds-icon slds-icon_x-small slds-m-right_large slds-m-left_small\'" ng-class="{\'slds-icon_selected\': attr.userValues.indexOf(value.value) > -1}"></slds-svg-icon>\n                                 <span class="slds-truncate" title="Menu Item One">{{value.label}}</span>\n                              </li>\n                           </ul>\n                        </div>\n                     </div>\n                  </div>\n               </div>\n               \x3c!-- dropdown !multiselect --\x3e\n               <div ng-if="attr.inputType === \'dropdown\' && !attr.multiselect">\n                  <div class="slds-form-element__control slds-select_container slds-m-bottom_small">\n                     <div class="slds-select_container">\n                        <select ins-rules-evaluate="attr" ins-rules-product="record" ng-options="value.value as value.label for value in attr.values" ng-model="attr.userValues"  class="slds-select slds-m-right_xx-small" id="select-{{$index}}-{{$parent.$index}}-{{$parent.$parent.$index}}" ng-disabled="true">\n                        </select>\n                     </div>\n                  </div>\n               </div>\n               <div class="vloc-slider_container" ng-if="attr.inputType === \'range\'">\n                  <div class="slds-form-element">\n                     <label class="slds-form-element__label" for="slider-id-01">\n                     <span class="slds-slider-label">\n                     <span class="slds-slider-label__range">{{attr.min}} - {{attr.max}}</span>\n                     </span>\n                     </label>\n                     <div class="slds-form-element__control">\n                        <div class="slds-slider slds-p-right_medium">\n                           <input type="range"  min="{{attr.min}}" max="{{attr.max}}" ins-rules-evaluate="attr" ins-rules-product="record"  id="attr-slider-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}" class="slds-slider__range" ng-disabled="true" ng-model="attr.userValues"/>\n                           <span class="slds-slider__value" aria-hidden="true">{{attr.userValues}}</span>\n                        </div>\n                     </div>\n                  </div>\n               </div>\n               <div class="slds-grid slds-p-bottom_x-small" ng-if=" attr.inputType !== \'radio\' && attr.inputType !== \'dropdown\'  && attr.inputType !== \'checkbox\' && attr.inputType !== \'range\' && attr.inputType !== \'date\' && attr.inputType !== \'datetime\'">\n                  <div class="slds-size_1-of-1">\n                     <input class="slds-input" ins-rules-evaluate="attr" ins-rules-product="record"  ng-model="attr.userValues" ng-disabled="true"/>\n                  </div>\n               </div>\n               <div class="slds-form-element slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open slds-size_1-of-1" ng-if="attr.inputType === \'date\'">\n                  <input class="slds-input slds-m-bottom_small" slds-date-picker ng-model="attr.userValues" ng-disabled="true">\n               </div>\n               <div class="slds-form-element slds-dropdown-trigger slds-dropdown-trigger_click slds-grid slds-wrap slds-size_3-of-4" ng-if="attr.inputType === \'datetime\'">\n                  <input class="slds-input slds-m-bottom_small slds-size_2-of-5 slds-m-right_medium" slds-date-picker ng-model="attr.userValues" ng-disabled="true">\n                  <input class="slds-input slds-m-bottom_small slds-size_2-of-5" slds-time-picker ng-model="attr.userValues"ng-disabled="true">\n               </div>\n               <div class="slds-form-element__control slds-text-align_left" ng-if="attr.inputType === \'checkbox\' && !attr.multiselect">\n                  <span class="slds-checkbox">\n                  <input ins-rules-evaluate="attr" ins-rules-product="record" type="checkbox" name="showmore-attrs-{{$index}}" id="showmore-attrs-{{$index}}" ng-model="attr.userValues"  ng-disabled="true"/>\n                  <label class="slds-checkbox__label slds-m-around_none" for="showmore-attrs-{{$index}}">\n                  <span class="slds-checkbox_faux vloc-check"></span>\n                  </label>\n                  </span>\n               </div>\n            </div>\n         </div>\n      </div>\n   </div>\n</div>'),$templateCache.put("modals/clm-term-modal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{vlocSlideCustomClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{vlocSlideCustomClass}}-container">\n        <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()" ng-if="!vlocSlideHeader">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Close</span>\n        </button>\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n        </header>\n        <div class="slds-modal__content slds-p-around_medium vloc-modal-content slds-is-relative">\n            <vloc-layout layout-name="{{layout}}" class="{{layout}}" is-loaded="isLayoutLoaded" records="records" ctrl="{{ctrl}}"></vloc-layout>\n        </div>\n        <footer class="slds-modal__footer slds-float_right slds-p-right_large" ng-if="records.modalType === \'Edit\'">\n        <button class="slds-button slds-button_brand" ng-if="!records.Id" ng-click="importedScope.vlocQuote.addNewClass(records, vlocQuote)">Save</button>\n        <button class="slds-button slds-button_brand" ng-if="records.Id" ng-click="importedScope.vlocQuote.updateClass(records, vlocQuote)">Update</button>\n        <button class="slds-button slds-button_neutral" ng-click="$slideHide()">Cancel</button>\n        </footer>\n    </div>\n</div>\n\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -200%;\n        margin-bottom: 45px;\n        height: auto;\n        transition: top 250ms ease-in;\n        max-height: 700px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__header {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__footer {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: auto;\n        width: 90%;\n        min-width: 90%;\n        max-width: 90%;\n        padding: 0;\n        margin: 0;\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translateY(-50%) translateX(-50%);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 30rem;\n        max-height: 0;\n        border-radius: 0;\n        width: 100%;\n        margin-bottom: 2.5rem;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); /* leaving room for iPhone notification bar */\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; /* Android doesn\'t need the 20px of room like iPhone */\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>')}]);

},{}]},{},[1]);
})();

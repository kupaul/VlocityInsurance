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
angular.module('clmContractTypeTermModel', ['vlocity', 'CardFramework', 'sldsangular', 'forceng',
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

require('./modules/clmContractTypeTermModel/controller/ClmContractTypeTermModelController.js');
require('./modules/clmContractTypeTermModel/controller/ClmContractTypeTermController.js');

// Factories
require('./modules/clmContractTypeTermModel/factory/NotificationHandler.js');
require('./modules/clmContractTypeTermModel/factory/ClmContractTypeTermModelService.js');
require('./modules/clmContractTypeTermModel/factory/ClmTypeTermModalService.js');

// Directives
require('./modules/clmContractTypeTermModel/directive/HideNotification.js');
require('./modules/clmContractTypeTermModel/directive/ClmContractTypeTermModelCollapseHeight.js');

// Templates
require('./modules/clmContractTypeTermModel/templates/templates.js'); 
},{"./modules/clmContractTypeTermModel/controller/ClmContractTypeTermController.js":2,"./modules/clmContractTypeTermModel/controller/ClmContractTypeTermModelController.js":3,"./modules/clmContractTypeTermModel/directive/ClmContractTypeTermModelCollapseHeight.js":4,"./modules/clmContractTypeTermModel/directive/HideNotification.js":5,"./modules/clmContractTypeTermModel/factory/ClmContractTypeTermModelService.js":6,"./modules/clmContractTypeTermModel/factory/ClmTypeTermModalService.js":7,"./modules/clmContractTypeTermModel/factory/NotificationHandler.js":8,"./modules/clmContractTypeTermModel/templates/templates.js":9}],2:[function(require,module,exports){
angular.module('clmContractTypeTermModel').controller('ClmContractTypeTermController',
    ['$scope', '$rootScope', 'ClmContractTypeTermModelService',  '$timeout', function(
    $scope, $rootScope, ClmContractTypeTermModelService, $timeout) {
    'use strict';

    $scope.row = {};
    $rootScope.isLoaded = true;
    var visualForceOrigin = window.origin;
    visualForceOrigin = visualForceOrigin.split('--');
    var lexOrigin = visualForceOrigin[0] + '.lightning.force.com';
    if (window.modalLabels !== undefined) {
        $scope.modalLabels = window.modalLabels;
    }
    $scope.vlocValueRow = function(dataType){
        return dataType.toLowerCase();
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

    $scope.setAttr = function(row, index){
        $rootScope.config.attr =  Object.assign({}, row);
        row.selected = true;
        $rootScope.index = index;
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
            //$scope.updateContractTerms(record.actions, attribute.userValues, attribute.code);
        }
    };
    
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
                            "contractTypeId": termRecord[$rootScope.nsPrefix+'ContractTypeId__c'].fieldValue,
                            "termId": termRecord.Id.fieldValue,
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
        ClmContractTypeTermModelService.invokeAction(action.updateContractTerms, $scope);
        //parent.postMessage(message, lexOrigin);
    };

}]);
},{}],3:[function(require,module,exports){
angular.module('clmContractTypeTermModel').controller('ClmContractTypeTermModelController',
    ['$scope', '$rootScope', 'ClmTypeTermModalService', 'ClmContractTypeTermModelService', 'NotificationHandler', 'ClmValidationHandlerService', function(
    $scope, $rootScope, ClmTypeTermModalService, ClmContractTypeTermModelService, NotificationHandler, ClmValidationHandlerService) {
    'use strict';
    $rootScope.isLoaded = true;
    $scope.notificationHandler = new NotificationHandler();
    $scope.baseRequestUrl = '';
    if (window.baseRequestUrl !== undefined) {
        $scope.baseRequestUrl = window.baseRequestUrl;
    }
    if (window.modalLabels !== undefined) {
        $scope.modalLabels = window.modalLabels;
    }

    $scope.refreshList = function(type){
        ClmContractTypeTermModelService.refreshList(type);
    }

    $scope.launchContractTypeTermModal = function() {
        ClmContractTypeTermModelService.launchContractTypeTermModal($scope, 'getTermsForAddition');
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
            'contractTypeId': $rootScope.contractTypeId,
            'termType' : 'TermSpec',
            attributeValues : attributeMap
        };
        if (type === 'TermSpec' && lst.length > 0) {
            console.log('add Terms');
            inputMap.coverageIds = lst;
            ClmContractTypeTermModelService.addContractTypeTerms($scope, inputMap, 'TermSpec').then(function(data){
                var addedprodIds = data.result.productIdList;
                $scope.sortedList = $scope.sortedList.filter(notAddedProducts => !addedprodIds.includes(notAddedProducts.productId));
            });
        }
    };


    $scope.deleteContractTypeTerms = function(records, type) {
        var lst = [];
        var termIds = [];

        for (var key in records) {
            if (records[key].isSelected) {
                lst.push(key);
                termIds.push(records[key].Id.fieldValue);
            }
        }
        if(termIds == null || termIds.length == 0) {
            var deleteTermErrorMsg = $scope.modalLabels.CLMDeleteTermError;
            var data = { message :  deleteTermErrorMsg} ;
            var error = {data: data}; //TODO: Use Labels instead of string
            $scope.notificationHandler.handleError(error); //TODO: THROW ERROR NOTIFICATION
            $scope.notificationHandler.hide();
            $rootScope.isLoaded = true;
        }else{
            var inputMap = {
                termIds: termIds,
                'contractTypeId': $scope.contractTypeId,
                'termType' : 'TermSpec'
            };
            if ( lst.length > 0) {
                console.log('add Terms');
                inputMap.coverageIds = lst;
                ClmContractTypeTermModelService.deleteContractTypeTerms($scope, inputMap, 'TermSpec');
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
        var mapRecords = map.records;
        let associationMap = {};
        for (var key = 0; key < map.totalSize; key++) {
          if(!associationMap[mapRecords[key].productName]){
            associationMap[mapRecords[key].productName] = mapRecords[key];
          } else {
            associationMap[mapRecords[key].productName + mapRecords[key].productCode] = mapRecords[key];
          }
        }
        $scope.sortedList = Object.values(associationMap);
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
},{}],4:[function(require,module,exports){
angular.module('clmContractTypeTermModel').directive('clmCollapseCalcHeight', ['$timeout', function($timeout) {
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
},{}],5:[function(require,module,exports){
angular.module('clmContractTypeTermModel').directive('hideNotification', function($rootScope, $timeout) {
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

},{}],6:[function(require,module,exports){
angular.module('clmContractTypeTermModel')
.factory('ClmContractTypeTermModelService', ['$http', 'dataSourceService','$timeout', 'dataService', 'ClmTypeTermModalService','ClmValidationHandlerService','NotificationHandler', '$q', '$rootScope',
        function($http, dataSourceService, $timeout, dataService, ClmTypeTermModalService,ClmValidationHandlerService, NotificationHandler, $q, $rootScope) {
    'use strict';

    var REMOTE_CLASS = 'ContractTypeTermHandler';
    var DUAL_DATASOURCE_NAME = 'Dual';
    var insideOrg = false;
    var errorContainer = {};

    var refreshList = function(type) {
        var message = {
            event: 'reload'
        };
        $rootScope.$broadcast('vlocity.layout.clm-contract-type-term.events', message);
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
 
        /**
         * invokeAction : Use this method when the actions are straight forward based on actionObj.
         *
         * @param  {[object]} actionObj [Pass the action object]
         * @return {promise} [Result data]
         */
        invokeAction: function(actionObj, scope) {
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
        launchContractTypeTermModal: function(scope, fn) {
            console.log('call modal with service', $rootScope.productId);
            $rootScope.isLoaded = false;
            scrollTop();
            var modalData = {};
            var effectiveDate = null;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            var inputMap = {'contractTypeId' : scope.contractTypeId, 'termType' : 'TermSpec'};
            $rootScope.contractTypeId =  scope.contractTypeId;
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.inputMap = inputMap;
            datasource.value.remoteClass = 'ContractTypeTermHandler';
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
                    //console.log('_____',ClmTypeTermModalService);
                    ClmTypeTermModalService.launchModal(
                            scope,
                            'clm-runtime-add-existing-term-modal',
                            modalData,
                            'ClmContractTypeTermModelController',
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
        addContractTypeTerms: function(scope, inputMap, type) {
            $rootScope.isLoaded = false;
            var fn = '';
            console.log('call add terms with', scope);
            if (type === 'TermSpec'){
                fn = 'addContractTypeTerms';
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
            datasource.value.remoteClass = 'ContractTypeTermHandler';
            datasource.value.remoteMethod = fn;
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.apexRestResultVar = 'result.records';
            console.log('datasource', datasource);
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    ///Refresh the current List of Products..
                    deferred.resolve(data);
                    refreshList(type);
                    var message = 'Added Terms Successfully';
                    scope.notificationHandler.handleSuccess(message);
                    scope.notificationHandler.hide();
                    $timeout(function() {
                        ClmTypeTermModalService.hideModal();
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
        deleteContractTypeTerms: function(scope, inputMap, type) {
            $rootScope.isLoaded = false;
            var fn = '';
            console.log('call add terms with', scope);
            if (type === 'TermSpec'){
                fn = 'deleteContractTypeTerms';
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
            datasource.value.remoteClass = 'ContractTypeTermHandler';
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
                        ClmTypeTermModalService.hideModal();
                    }, 250);
                    $rootScope.isLoaded = true;
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    scope.notificationHandler.hide();
                    $rootScope.isLoaded = true;
            });
            return  deferred.promise;
        }
    };
}]);

},{}],7:[function(require,module,exports){
angular.module('clmContractTypeTermModel').factory('ClmTypeTermModalService',
['$rootScope', '$sldsModal', '$timeout',
function($rootScope, $sldsModal, $timeout) {
    'use strict';
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

},{}],8:[function(require,module,exports){
angular.module('clmContractTypeTermModel').factory('NotificationHandler', [
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
},{}],9:[function(require,module,exports){
angular.module("clmContractTypeTermModel").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("clm-attribute-display-edit.tpl.html",'<div ng-repeat="category in categories" class="slds-grid slds-wrap" ng-class="{\'slds-p-left_large\' : record.showMore || !showFirstAttr, \'slds-m-top_small\' : record.showMore}" ng-hide="($index !== 0 && !record.showMore && showFirstAttr)">\n            <div class="slds-text-title_caps slds-p-bottom_x-small" ng-if="record.showMore || !showFirstAttr">{{category.Name}}</div>\n            <div class="slds-size_1-of-1 slds-grid slds-wrap">\n                  <div ng-repeat="attr in category.productAttributes.records" ng-if="!attr.hiddenByRule && !attr.adjustmentUnits" ng-hide="($index !== 0 && !record.showMore && showFirstAttr)" ng-class="{\'slds-size_1-of-1\': !record.showMore && showFirstAttr, \'slds-size_1-of-3\' : record.showMore || !showFirstAttr}">\n      \n                        <div class="slds-small-show vloc-attr-cell slds-size_1-of-1 slds-m-top_x-small">\n                              <div class="vloc-attrs-header-label slds-truncate">\n                                    {{attr.label}} <span class="slds-float_right slds-p-right_large">{{attr.userValues.label}}</span>\n                              </div>\n                        </div>\n      \n                        <div class="vloc-attr-data-cell slds-p-top_xx-small" ng-class="{\'slds-truncate\' : attr.inputType !== \'date\' && attr.inputType !== \'datetime\'}">\n                              \x3c!-- multiselect checkbox --\x3e\n                              <div class="slds-size_5-of-12 via-ins-attributes-attribute-multiselect-checkbox" ng-if="attr.multiselect && attr.inputType === \'checkbox\'">\n                                    <div class="via-ins-attributes-attribute-uservalues" ng-class="{\'slds-size_7-of-12\': !attribute.showOverride}">\n                                          <fieldset class="slds-form-element">\n                                                <div class="slds-form-element__control">\n                                                <span class="slds-checkbox" ng-repeat="value in attr.values" ng-if="!value.hiddenByRule">\n                                                <input type="checkbox" id="attr-ms-cb-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}" \n                                                      checked=""  ng-model="attr.userValues[$index][value.value]"\n                                                      ng-disabled="$index === attr.ruleSetValueIndex && attribute.ruleSetValue" \n                                                      ng-click="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" />\n                                                <label class="slds-checkbox__label" for="attr-ms-cb-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}">\n                                                <span class="slds-checkbox_faux"></span>\n                                                <span class="slds-form-element__label">{{value.label}}</span>\n                                                </label>\n                                                </span>\n                                                </div>\n                                          </fieldset>\n                                    </div>\n                              </div>\n                              \x3c!-- multiselect radio --\x3e\n                              <div class="slds-size_5-of-12 via-ins-attrs-attr-radio-picklist" ng-if="attr.dataType === \'text\' && attr.inputType === \'radio\'">\n                                    <div class="via-ins-attrs-attr-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attr.showOverride, \'slds-size_7-of-12\': !attr.showOverride}">\n                                          <fieldset class="slds-form-element">\n                                                <div class="slds-form-element__control">\n                                                <span class="slds-radio" ng-repeat="value in attr.values" ng-if="!value.hiddenByRule">\n                                                <input type="radio" id="attr-radio-pl-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attr.attributeId}}-{{value.value}}" ng-disabled="attr.disabled || attr.readonly" ng-checked="value.value === attr.userValues" ng-click="attr.userValues = value.value; importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" />\n                                                <label class="slds-radio__label" for="attr-radio-pl-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attr.attributeId}}-{{value.value}}">\n                                                <span class="slds-radio_faux"></span>\n                                                <span class="slds-form-element__label">{{value.label}}</span>\n                                                </label>\n                                                </span>\n                                                </div>\n                                          </fieldset>\n                                    </div>\n                              </div>\n                              \x3c!-- multiselect dropdown --\x3e\n                              <div class="slds-size_8-of-12 via-ins-attrs-attr-multiselect-dropdown" ng-if="attr.multiselect && attr.inputType === \'dropdown\'">\n                                    <div class="via-ins-attrs-attr-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attr.showOverride, \'slds-size_5-of-12\': !attr.showOverride}">\n                                          <div class="slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open">\n                                                <button class="slds-button slds-button_neutral via-ins-attrs-attr-dropdown-button" aria-haspopup="true" \n                                                ng-disabled="attr.disabled || attr.readonly" ng-click="attr.dropdownOpen = !attr.dropdownOpen"\n                                                title="Show More" ng-model="attr.userValues[$index][value.value]" id="dropdown-{{productRecord.Id.fieldValue}}-{{category.Code__c}}-{{attr.attributeId}}" \n                                                restrict-element="via-ins-attrs-attr-dropdown-items" ng-init="importedScope.countSelected(attr)">\n                                                      <span>{{attr.multiSelectCount}} Selected</span>\n                                                      <slds-button-svg-icon sprite="\'utility\'" icon="\'down\'" extra-classes="\'slds-button__icon_right\'"></slds-button-svg-icon>\n                                                      <span class="slds-assistive-text">Show More</span>\n                                                </button>\n                                                <div class="slds-dropdown slds-dropdown_left via-ins-attrs-attr-dropdown-items" ng-show="attr.dropdownOpen" ng-class="{\'slds-is-relative\' : attr.dropdownOpen}">\n                                                      <ul class="slds-dropdown__list via-ins-attrs-attr-dropdown-items-list" role="menu">\n                                                            <li class="slds-align_absolute-center slds-dropdown__item via-ins-attrs-attr-dropdown-items-item slds-p-around_small"  ng-class="{\'slds-theme_shade\': value.isSelected}" role="presentation" ng-repeat="value in attr.values" \n                                                            ng-click="value.isSelected = !value.isSelected; importedScope.toggleValue(attr, value, value.ruleSetValue, productRecord)" ng-if="!value.hiddenByRule" ng-init="value.isSelected =  (attr.userValues.indexOf(value.value) > -1)">\n                                                                  <span class="slds-truncate" title="Menu Item One">{{value.label}}</span>\n                                                            </li>\n                                                      </ul>\n                                                      <button class="slds-button slds-button_link slds-align_absolute-center" ng-click="attr.dropdownOpen = !attr.dropdownOpen; importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)">Save</button>\n                                                </div>\n                                          </div>\n                                    </div>\n                              </div>\n      \n                              \x3c!-- dropdown !multiselect --\x3e\n                              <div ng-if="attr.inputType === \'dropdown\' && !attr.multiselect" class="slds-size_5-of-12">\n                                    <div class="slds-form-element__control slds-select_container slds-m-bottom_small">\n                                          <div class="slds-select_container">\n                                                <select ins-rules-evaluate="attr" ins-rules-product="record" ng-options="value.value as value.label for value in attr.values" ng-model="attr.userValues"  class="slds-select slds-m-right_xx-small" id="select-{{$index}}-{{$parent.$index}}-{{$parent.$parent.$index}}" ng-change="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" ng-disabled="attr.disabled || attr.readonly">\n                                                </select>\n                                          </div>\n                                    </div>\n                              </div>\n                              \x3c!-- range --\x3e\n                              <div class="slds-size_5-of-12 vloc-slider_container" ng-if="attr.inputType === \'range\'">\n                                    <div class="slds-form-element">\n                                          <label class="slds-form-element__label" for="slider-id-01">\n                                          <span class="slds-slider-label">\n                                          <span class="slds-slider-label__range">{{attr.min}} - {{attr.max}}</span>\n                                          </span>\n                                          </label>\n                                          <div class="slds-form-element__control">\n                                                <div class="slds-slider">\n                                                      <input type="range"  min="{{attr.min}}" max="{{attr.max}}" ins-rules-evaluate="attr" ins-rules-product="record"  id="attr-slider-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}" class="slds-slider__range" ng-disabled="attr.disabled || attr.readonly" ng-model="attr.userValues" ng-change="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)"/>\n                                                      <span class="slds-slider__value" aria-hidden="true">{{attr.userValues}}</span>\n                                                </div>\n                                          </div>\n                                    </div>\n                              </div>\n                              \x3c!-- TextBox --\x3e\n                              <div class="slds-p-bottom_x-small" ng-if=" attr.inputType !== \'radio\' && attr.inputType !== \'dropdown\'  && attr.inputType !== \'checkbox\' && attr.inputType !== \'range\' && attr.inputType !== \'date\' && attr.inputType !== \'datetime\'">\n                                    <input class="slds-size_5-of-12 slds-input" ins-rules-evaluate="attr" ins-rules-product="record"  ng-model="attr.userValues" ng-disabled="attr.disabled || attr.readonly" />\n                                    <button ng-if="!attr.disabled && !attr.readonly" class="slds-button slds-button_link slds-m-left_small vloc-attr-showmore-btn" ng-click="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)">Save</button>\n                              </div>\n                              \x3c!-- date --\x3e\n                              <div class="slds-form-element slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open slds-size_5-of-12" ng-if="attr.inputType === \'date\'">\n                                    <input class="slds-input slds-m-bottom_small" slds-date-picker ng-disabled="attr.disabled || attr.readonly" ng-change="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" ng-model="attr.userValues">\n                              </div>\n                              \x3c!-- dateTime --\x3e\n                              <input ng-if="attr.inputType === \'datetime\'" ng-change="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" class="slds-input slds-m-bottom_small slds-size_2-of-6 slds-m-right_medium" slds-date-picker ng-model="attr.userValues"  ng-disabled="attr.disabled || attr.readonly">\n                              <input ng-if="attr.inputType === \'datetime\'" ng-change="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" class="slds-input slds-m-bottom_small slds-size_2-of-8" slds-time-picker ng-model="attr.userValues"  ng-disabled="attr.disabled || attr.readonly">\n      \n                              \x3c!-- checkbox && !multiselect --\x3e\n                              <div class="slds-form-element__control slds-text-align_left" ng-if="attr.inputType === \'checkbox\' && !attr.multiselect">\n                                    <span class="slds-checkbox">\n                                          <input ins-rules-evaluate="attr" ins-rules-product="record" type="checkbox" name="showmore-attrs-{{$index}}" id="showmore-attrs-{{$index}}" ng-model="attr.userValues" ng-change="importedScope.updateContractTerms(record.actions, attr.userValues, attr.code, productRecord)" ng-disabled="attr.disabled || attr.readonly"/>\n                                          <label class="slds-checkbox__label slds-m-around_none" for="showmore-attrs-{{$index}}">\n                                                <span class="slds-checkbox_faux vloc-check"></span>\n                                          </label>\n                                    </span>\n                              </div>\n                        </div>\n                  </div>\n            </div>\n      </div>'),$templateCache.put("modals/clm-term-modal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{vlocSlideCustomClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{vlocSlideCustomClass}}-container">\n        <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()" ng-if="!vlocSlideHeader">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Close</span>\n        </button>\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n        </header>\n        <div class="slds-modal__content slds-p-around_medium vloc-modal-content slds-is-relative">\n            <vloc-layout layout-name="{{layout}}" class="{{layout}}" is-loaded="isLayoutLoaded" records="records" ctrl="{{ctrl}}"></vloc-layout>\n        </div>\n        <footer class="slds-modal__footer slds-float_right slds-p-right_large" ng-if="records.modalType === \'Edit\'">\n        <button class="slds-button slds-button_brand" ng-if="!records.Id" ng-click="importedScope.vlocQuote.addNewClass(records, vlocQuote)">Save</button>\n        <button class="slds-button slds-button_brand" ng-if="records.Id" ng-click="importedScope.vlocQuote.updateClass(records, vlocQuote)">Update</button>\n        <button class="slds-button slds-button_neutral" ng-click="$slideHide()">Cancel</button>\n        </footer>\n    </div>\n</div>\n\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -200%;\n        margin-bottom: 45px;\n        height: auto;\n        transition: top 250ms ease-in;\n        max-height: 700px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__header {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__footer {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: auto;\n        width: 90%;\n        min-width: 90%;\n        max-width: 90%;\n        padding: 0;\n        margin: 0;\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translateY(-50%) translateX(-50%);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 30rem;\n        max-height: 0;\n        border-radius: 0;\n        width: 100%;\n        margin-bottom: 2.5rem;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); /* leaving room for iPhone notification bar */\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; /* Android doesn\'t need the 20px of room like iPhone */\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>')}]);

},{}]},{},[1]);
})();

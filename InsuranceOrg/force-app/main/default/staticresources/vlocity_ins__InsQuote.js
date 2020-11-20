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
angular.module('insQuote', ['vlocity', 'CardFramework', 'sldsangular', 'forceng',
    'ngSanitize', 'cfp.hotkeys', 'insProductSelection', 'insValidationHandler', 'insRules'
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
        $rootScope.vlocInsProdSelectItem.getProductsCalled = false;
    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        'use strict';
        return function(sldsURL) {
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]);

// Controllers
require('./modules/insQuote/controller/InsQuoteController.js');
require('./modules/insQuote/controller/InsQuoteClassAndPlansController.js');

// Templates
require('./modules/insQuote/templates/templates.js');

// Directives
require('./modules/insQuote/directive/InsDropdownHandler.js');
require('./modules/insQuote/directive/HideNotification.js');

//Factories
require('./modules/insQuote/factory/InsQuoteModalService.js');
require('./modules/insQuote/factory/InsQuoteService.js');
require('./modules/insQuote/factory/NotificationHandler.js');

},{"./modules/insQuote/controller/InsQuoteClassAndPlansController.js":2,"./modules/insQuote/controller/InsQuoteController.js":3,"./modules/insQuote/directive/HideNotification.js":4,"./modules/insQuote/directive/InsDropdownHandler.js":5,"./modules/insQuote/factory/InsQuoteModalService.js":6,"./modules/insQuote/factory/InsQuoteService.js":7,"./modules/insQuote/factory/NotificationHandler.js":8,"./modules/insQuote/templates/templates.js":9}],2:[function(require,module,exports){
angular.module('insQuote').controller('InsQuoteClassAndPlansController',
    ['$scope', '$rootScope', 'InsQuoteModalService', 'InsQuoteService', '$timeout', 'NotificationHandler', 'InsValidationHandlerService', 'dataService', 'userProfileService', function(
    $scope, $rootScope, InsQuoteModalService, InsQuoteService, $timeout, NotificationHandler, InsValidationHandlerService, dataService, userProfileService) {
    'use strict';
    $scope.vlocQuote = {};
    $scope.vlocQuote.underlinePosition = {
        'margin-left': 'calc(' + 0 + '%' + ')',
    };

    let customLabels = {};
    const translationKeys = ['InsProductWasSuccessfullyAdded'];
    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                customLabels = translatedLabels;
            }
        );
    });

    $scope.vlocQuote.widths = [];
    $scope.vlocQuote.offSet = [];
    $scope.notification = {};
    $scope.vlocQuote.showUnderline = false;
    $scope.updateAttr = {};
    $scope.vlocQuote.quoteId = '';
    if($scope.$parent.params.id){
        $scope.vlocQuote.quoteId = $scope.$parent.params.id;
        $rootScope.quoteId = $scope.$parent.params.id;
    }
    $scope.vlocQuote.attrMap = {};
    $scope.vlocQuote.productMap = {};

    $scope.vlocQuote.getClassFields = function() {
      InsQuoteService.invokeRemoteMethod($scope, null, 'InsuranceQuoteProcessingService', 'getGroupClassFields', {}).then(function(data) {
            $scope.vlocQuote.classFields = data;
        }, function(error) {
            console.log('error: ', error);
            InsValidationHandlerService.throwError(error);
        });
    };

    $scope.vlocQuote.edit = function(classObj, index){
        console.log('$scope.vlocQuote.classFields', $scope.vlocQuote.classFields.result);
        var obj = JSON.parse(JSON.stringify($scope.vlocQuote.classFields.result));
        for(var key in obj){
            if (classObj[key]){
                obj[key].fieldValue = classObj[key];
            }
        }
        if(classObj.Id){
            obj.Id = classObj.Id;
        } else if(classObj.classId) {
            obj.Id = classObj.classId;
        }
        obj.modalName = 'Edit ' +  classObj.Name;
        obj.modalType = 'Edit';
        obj.index = index;
        console.log('obj', obj);
        InsQuoteModalService.launchModal(
            $scope,
            'ins-quote-add-class-modal',
            obj,
            'InsQuoteClassAndPlansController',
            'vloc-quote-modal'
        );
    };

    $scope.vlocQuote.setClasses = function(records) {
        console.log('Set classes records:', records);
        if(!$scope.vlocQuote.classes) {
             $scope.vlocQuote.classes = records;
            }
    };

    $scope.vlocQuote.calcWidth = function(){
         $timeout(function() {
            var tabs = document.getElementsByClassName('slds-tabs_scoped__item');
            $scope.vlocQuote.offSet = [0];
            console.log('tabs', tabs);
            for(var i = 0; i < tabs.length; i++){
                $scope.vlocQuote.widths[i] = tabs[i].clientWidth + 'px';
                if(i > 0) {
                    $scope.vlocQuote.offSet[i] = tabs[i - 1].clientWidth;
                    $scope.vlocQuote.offSet[i] += $scope.vlocQuote.offSet[(i - 1)];
                }
            }
            $scope.vlocQuote.underlinePosition.width = 'calc(' + $scope.vlocQuote.widths[0] + ')';
            if($scope.vlocQuote.widths[0]) {
                $scope.vlocQuote.showUnderline = true;
            }
            console.log('$rootScope.sldsActivePane', $rootScope.sldsActivePane);
            if($rootScope.sldsActivePane){
                $scope.sldsActivePane = $rootScope.sldsActivePane.Name;
                $scope.vlocQuote.changeTab($rootScope.sldsActivePane.index);
                $rootScope.sldsActivePane = null;
            }
            $rootScope.isLoaded = true;
        }, 750);
    };

    //Open Modal
    $scope.vlocQuote.launchDetailsModal = function(record) {
        record.modalName = 'Details';
        InsQuoteModalService.launchModal(
            $scope,
            'ins-quote-details-modal',
            record,
            '',
            'vloc-quote-modal'
        );
    };

    $scope.vlocQuote.changeTab = function(index) {
      $scope.vlocQuote.activeTab = index;
      $scope.vlocQuote.underlinePosition = {
        'margin-left': 'calc('+ $scope.vlocQuote.offSet[index] + 'px)',
        'width' : 'calc(' + $scope.vlocQuote.widths[index] + ')'
        };
    };

    $scope.vlocQuote.newClass = function() {
        var obj =  JSON.parse(JSON.stringify($scope.vlocQuote.classFields.result));
        obj.modalName = 'Create New Class';
        obj.modalType = 'Edit';
         InsQuoteModalService.launchModal(
            $scope,
            'ins-quote-add-class-modal',
            obj,
            'InsQuoteClassAndPlansController',
            'vloc-quote-modal'
        );

    };

    $scope.vlocQuote.addNewClass = function(record, vlocQuote){
        var inputMap = {};
        for(var key in record){
            if(record[key]){
                inputMap[key] = record[key].fieldValue;
            }
        }
        $rootScope.isLoaded = false;
        InsQuoteService.invokeRemoteMethod($scope, $scope.vlocQuote.quoteId, 'InsuranceQuoteProcessingService', 'createClass', inputMap).then(function(data) {
            if(data.records){
                $rootScope.notification.type = 'success';
                $rootScope.notification.active = true;
                var dataClass = data.records[0];
                if(dataClass){
                    if(!$scope.vlocQuote.classes){
                        $scope.vlocQuote.classes = [];
                    }
                    $scope.vlocQuote.classes.push(dataClass);
                    $rootScope.sldsActivePane = {
                        Name : dataClass.Name,
                        index : $scope.vlocQuote.classes.length - 1
                     };
                        $scope.vlocQuote.calcWidth();
                    }
                    $rootScope.notification.message = ($rootScope.vlocity.getCustomLabel('InsProductWasSuccessfullyAdded') || '').replace(/\{0\}/g, dataClass.Name) || dataClass.Name + ' was successfully added.';
                }
                $rootScope.isLoaded = true;
                $timeout(function() {
                    InsQuoteModalService.hideModal();
                }, 250);
                $timeout(function() {
                    $rootScope.notification.active = false;
                }, 3000);
        }, function(error) {
            $scope.notification.message = error.data.message || error.data.error;
            $scope.notification.type = 'error';
            $scope.notification.active = true;
            console.log('$scope.notification', $scope.notification);
            $rootScope.isLoaded = true;
            $timeout(function() {
                $rootScope.notification.active = false;
            }, 3000);
        });
    };

    $scope.vlocQuote.updateClass = function(record){
        var inputMap = {};
        for(var key in record){
            if(record[key] && record[key].fieldValue !== undefined) {
                inputMap[key] = record[key].fieldValue;
            }
        }
        inputMap.Id = record.Id;
        $rootScope.isLoaded = false;
        InsQuoteService.invokeRemoteMethod($scope, $scope.vlocQuote.quoteId, 'InsuranceQuoteProcessingService', 'updateClass', inputMap).then(function(data) {
            if(data){
                var updateClass = inputMap;
                updateClass.index = record.index;
                if(updateClass) {
                    if(!updateClass[$rootScope.nsPrefix + 'IsActive__c']){
                        $scope.vlocQuote.classes.splice(updateClass.index, 1);
                        $rootScope.sldsActivePane = {
                              Name : $scope.vlocQuote.classes[0].Name,
                              index : 0
                        };
                    }
                    else {
                        for(var field in updateClass){
                            if(updateClass[field]){
                                 $scope.vlocQuote.classes[updateClass.index][field] = updateClass[field];
                            }
                        }
                    }
                    $scope.vlocQuote.calcWidth();
                }
                $rootScope.notification.type = 'success';
                $rootScope.notification.active = true;
                $rootScope.notification.message = inputMap.Name + ' was successfully updated.';
                $rootScope.isLoaded = true;
                $timeout(function() {
                    InsQuoteModalService.hideModal();
                }, 250);
                $timeout(function() {
                    $rootScope.notification.active = false;
                }, 3000);
            }
        }, function(error) {
            $scope.notification.message = error.data.message || error.data.error;
            $scope.notification.type = 'error';
            $scope.notification.active = true;
            console.log('$scope.notification', $scope.notification);
            $rootScope.isLoaded = true;
            $timeout(function() {
                $rootScope.notification.active = false;
            }, 3000);
        });

    };

      $scope.vlocQuote.replaceQLI = function(quoteLineItem, classObj, index, filter){
        $rootScope.replaceQLI = {
            'quoteId' : $scope.vlocQuote.quoteId,
            'quoteLineItem': quoteLineItem
        };
        $scope.vlocQuote.addQLI(filter, classObj, index);
      };

    $scope.vlocQuote.addQLI = function(filter, classObj, index){
        $rootScope.sldsActivePane = {
              Name : classObj.Name,
              index :index
        };
        console.log('$rootScope.sldsActivePane', $rootScope.sldsActivePane);
        $rootScope.isLoaded = false;
        var classDetail = {};
        for(var key in classObj){
            if(key !== 'quoteLines'){
                classDetail[key] = classObj[key];
            }
        }
        $rootScope.inputMap = {
            'quoteId' : $scope.vlocQuote.quoteId,
            'classDetail' : classDetail,
            'filters' :  filter,
            'effectiveDtStr' : null
        };
        // Need to set up datasource so we don't get undefined errors
        $rootScope.vlocInsProdSelectItem.dataSource = {
            value: {
                inputMap: {}
            }
        };
        $rootScope.showProductSelection = true;
    };

   $scope.categoryFieldMap = {};
   var processAttrs = function(products, fields){
        for(var z = 0; z < products.length; z++){
            var record = products[z].attributeCategories.records;
             var categoryFieldMap = {};
             for (var i = 0; i < fields.length; i++){
                var name = fields[i].name;
                if(name.includes(' / ')){
                    var parts = fields[i].name.split(' / ');
                    name = parts[1];
                    if(!categoryFieldMap[name]){
                        categoryFieldMap[name] = {};
                    }
                    categoryFieldMap[name][parts[0]] = fields[i].label;

                } else {
                    categoryFieldMap[name] = fields[i].label;
                }
            }
            var id = products[z].quoteLineId;
            $scope.categoryFieldMap[id] = categoryFieldMap;
            $scope.vlocQuote.attrMap[id] = setAttrMap(record, id);
        }
    };


    var setAttrMap  = function(record, id) {
        var attributeCategories = {};
        var attrArray = [];
        if(record){
            for(var j = 0; j < record.length; j++){
                var catt = record[j].Name;
                attributeCategories[catt] = record[j].productAttributes.records;
                for(var k = 0; k < attributeCategories[catt].length; k ++){
                    var attr = attributeCategories[catt][k];
                    if($scope.updateAttr[attr.code]){
                        attr.userValues = $scope.updateAttr[attr.code];
                    }
                    if($scope.categoryFieldMap[id] && $scope.categoryFieldMap[id][attr.label]){
                        if($scope.categoryFieldMap[id][attr.label][catt]){
                            attr.cardLabel = $scope.categoryFieldMap[id][attr.label][catt];
                            attrArray = attrArray.concat(attr);
                        } else {
                            if($scope.categoryFieldMap[id][attr.label].length > 0){
                                attr.cardLabel = $scope.categoryFieldMap[id][attr.label];
                                attrArray = attrArray.concat(attr);
                            }
                        }
                    }
                }
            }
        }
        return attrArray;
    };

    $scope.vlocQuote.removeQLI = function (classId, qliId, index, name) {
        var inputMap = {
            'quoteItemId' : qliId
        };
        $rootScope.isLoaded = false;
        InsQuoteService.invokeRemoteMethod($scope, $scope.vlocQuote.quoteId, 'InsuranceQuoteProcessingService', 'deleteItem', inputMap);
        delete $scope.vlocQuote.attrMap[qliId];
        $scope.vlocQuote.productMap[classId].splice(index, 1);
        $rootScope.notification.type = 'success';
        $rootScope.notification.active = true;
        $rootScope.notification.message = name + ' successfully deleted.';
        $timeout(function() {
            $rootScope.notification.active = false;
        }, 3000);
    };

    $scope.vlocQuote.setProducts = function(id, products, fields) {
        $scope.vlocQuote.productMap[id] = products;
        if(products){
            processAttrs(products, fields);
        }
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

    $scope.vlocQuote.editQLI = function(product, record){
        console.log(product, record);
        InsQuoteModalService.launchVDFModal(
            $scope,
            'Edit Record',
            product,
            'vloc-quote-vdf-modal'
        );
    };

    $scope.vlocQuote.setActions = function(actions) {
        $scope.vlocQuote.actions = actions.actions;
        $timeout(function() {
        for(var i = 0; i < $scope.vlocQuote.actions.length; i++){
            $scope.vlocQuote.actions[i].show = true;
            if($scope.vlocQuote.actions[i].extraParams.Condition){
                var j = $scope.vlocQuote.actions[i].extraParams.Condition.indexOf('.');
                //use Account Conditions
                if(j > -1){
                    var temp = $scope.vlocQuote.actions[i].extraParams.Condition.substring(j+1,  $scope.vlocQuote.actions[i].extraParams.Condition.length);
                    var m = temp.indexOf(' ');
                    var key = temp.substring(0,  m);
                    var value =  temp.substring(m,  temp.length);
                    if(value.indexOf('===') > -1){
                        if(value.indexOf($rootScope.accountConditions[key]) < 0){
                             $scope.vlocQuote.actions[i] = false;
                        }
                    } if(value.indexOf('!==') > -1){
                        if(value.indexOf($rootScope.accountConditions[key]) > -1){
                             $scope.vlocQuote.actions[i] = false;
                        }
                    }
                }
            }
        }
    }, 750);
    };

    $scope.$on('ins-quote-update-line-after-edit', function(event, data) {
        $scope.updateAttr = data.attributeValues;
         var product =  $scope.vlocQuote.productMap[$scope.vlocQuote.currentRecord][$scope.vlocQuote.currentIndex];
         $scope.vlocQuote.attrMap[$scope.vlocQuote.currentRecord] = setAttrMap(product.attributeCategories.records, $scope.vlocQuote.currentRecord);
    });

}]);

},{}],3:[function(require,module,exports){
angular.module('insQuote').controller('InsQuoteController',
    ['$scope', '$rootScope', '$timeout', 'InsQuoteService', function(
    $scope, $rootScope, $timeout, InsQuoteService) {
    'use strict';

    $scope.vlocQuoteHeader = {};

    $scope.performAction = function(action){
        console.log('preform Actions', action);
        InsQuoteService.invokeAction(action);
    };

    $scope.vlocQuoteHeader.setData = function(obj){
         $rootScope.accountConditions = {}; 
            for(var key in obj.Account){
                $rootScope.accountConditions[key] = obj.Account[key];
            }
         $timeout(function() {
            $rootScope.accountId = obj.AccountId;
        }, 750);
    };

    $scope.navBack = function(){
        window.history.back();
    };
}]);
},{}],4:[function(require,module,exports){
angular.module('insQuote').directive('hideNotification', function($rootScope, $timeout) {
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
angular.module('insQuote').directive('insDropdownHandler', function($document) {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var onClick = function (event) {
                var isChild = element.has(event.target).length > 0;
                var isSelf = element[0] == event.target;
                var isInside = isChild || isSelf;
                if (!isInside) {
                    scope.$apply(attrs.insDropdownHandler);
                    $document.off('click', onClick);
                }
            };
            element.on('click', function() {
                $document.on('click', onClick);
            });
        }
    };
});

},{}],6:[function(require,module,exports){
angular.module('insQuote').factory('InsQuoteModalService',
['$rootScope', '$sldsModal', '$timeout', 'InsQuoteService',
function($rootScope, $sldsModal, $timeout, InsQuoteService) {
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
            $rootScope.record = InsQuoteService.parseRecord(record);
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

},{}],7:[function(require,module,exports){
angular.module('insQuote')
.factory('InsQuoteService', ['dataSourceService', 'dataService', '$q', '$rootScope', 'InsValidationHandlerService', '$timeout', 'userProfileService', function(dataSourceService, dataService, $q, $rootScope, InsValidationHandlerService, $timeout, userProfileService) {
    'use strict';
    var REMOTE_CLASS = 'InsuranceQuoteProcessingService';
    var DUAL_DATASOURCE_NAME = 'Dual';
    var insideOrg = false;
    var errorContainer = {};

    const translationKeys = ['InsProductSuccessfullyUpdated'];
    let customLabels = {};

    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                customLabels = translatedLabels;
            }
        )
    })


    function getDualDataSourceObj(actionObj) {
        var datasource = {};
        var temp = '';
        var nsPrefix = fileNsPrefix().replace('__', '');

        if (actionObj.remote && vactionObj.remote.remoteClass) {
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
        parseRecord: function(record) {
            var i, j, categoryRecord, productAttribute;
            if (record.attributeCategories && record.attributeCategories.records) {
                for (i = 0; i < record.attributeCategories.records.length; i++) {
                    categoryRecord = record.attributeCategories.records[i];
                    if (categoryRecord.productAttributes && categoryRecord.productAttributes.records) {
                        for (j = 0; j < categoryRecord.productAttributes.records.length; j++) {
                            productAttribute = categoryRecord.productAttributes.records[j];
                            if(productAttribute.readonly){
                                categoryRecord.productAttributes.records.splice(j, 1);
                            } 
                            if (productAttribute.inputType && productAttribute.inputType === 'number' && parseFloat(productAttribute.userValues)) {
                                productAttribute.userValues = parseFloat(productAttribute.userValues);
                            }
                        }
                    }
                }
            }
            return record;
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
        },
        /**
         * invokeAction : Use this method when the actions are straight forward based on actionObj.
         *
         * @param  {[object]} actionObj [Pass the action object]
         * @return {promise} [Result data]
         */
        invokeAction: function(actionObj) {
            console.log(actionObj);
            var deferred = $q.defer();
            var datasource = getDualDataSourceObj(actionObj);

            dataSourceService.getData(datasource, null, null).then(
                function(data) {
                    deferred.resolve(data);
                }, function(error) {
                    deferred.reject(error);
                    InsValidationHandlerService.throwError(error);
                });
            return deferred.promise;
        },
          updateQLI: function(scope, records, qliId) {
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
                        $rootScope.notification.message =  $rootScope.vlocity.getCustomLabel('InsProductSuccessfullyUpdated') || 'Successfully Updated';
                        $rootScope.$broadcast('ins-quote-update-line-after-edit',  inputMap);
                        //refreshList();
                        $rootScope.isLoaded = true;
                        $timeout(function() {
                             angular.element('.slds-modal__close').click();
                        }, 250);
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

},{}],8:[function(require,module,exports){
angular.module('insQuote')
.factory('NotificationHandler', ['$rootScope', function($rootScope){
    'use strict';
    var NotificationHandler = function() {
        this.initialize = function() {

        };

        this.handleError = function(error) {
            $rootScope.log('error: ', error);
            $rootScope.notification.message = error.data.message || error.data.error;
            $rootScope.notification.type = 'error';
            $rootScope.notification.active = true;
        };

        this.initialize();
    };
    return (NotificationHandler);
}]);
},{}],9:[function(require,module,exports){
angular.module("insQuote").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("SldsTabsScoped.tpl.html",'<div class="slds-tabs_scoped">\n    <ul class="slds-tabs_scoped__nav" role="tablist">\n        <li class="slds-tabs_scoped__item slds-text-heading_medium vloc-quote-tabs" title="{{$pane.title}}" role="presentation" ng-repeat="$pane in $panes track by $index" ng-class="{\'slds-active\': $isActive($pane, $index)}" ng-click="!$pane.disabled && $setActive($pane.name || $index); importedScope.showTabPanes(); importedScope.vlocQuote.changeTab($index)"> \n            <a class="vloc-census-tabs slds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="$index" aria-selected="true" aria-controls="tab-scoped-{{$index}}" ng-bind-html="$pane.title" data-index="{{$index}}"></a>\n        </li>\n        <hr class="underline" style="margin-bottom: 1rem; margin-left : {{importedScope.vlocQuote.underlinePosition[\'margin-left\']}}; \n        width: {{importedScope.vlocQuote.underlinePosition[\'width\']}}" ng-show="importedScope.vlocQuote.showUnderline">\n    </ul>\n    <div class="slds-tabs_scoped__content slds-show" role="tabpanel" aria-labelledby="tab-scoped-1__item" ng-transclude>\n</div>\n'),$templateCache.put("modals/ins-quote-vdf-modal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{vlocSlideCustomClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{vlocSlideCustomClass}}-container">\n        <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()" ng-if="!vlocSlideHeader">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Close</span>\n        </button>\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n        </header>\n        <div class="slds-modal__content slds-p-horizontal_large vloc-modal-content slds-is-relative">\n            <div class="slds-spinner_container" ng-class="{\'vloc-show-loader\': !isModalLoaded}">\n                <div class="slds-spinner_brand slds-spinner slds-spinner_large slds-m-top_x-large slds-m-bottom_x-large" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n            <ins-rules-attributes hide-header="true" product-data="[$root.record]" update-method="InsQuoteService.updateQLI(importedScope, $root.record.attributeCategories.records, $root.record.quoteLineId)" class="vloc-ins-small-group-product-attributes"></ins-rules-attributes>\n        </div>\n        <footer class="slds-modal__footer" ng-show="vlocSlideFooter">\n            <button class="slds-button slds-button_neutral" ng-click="$slideHide()">Cancel</button>\n            <button class="slds-button slds-button_brand" ng-click="InsQuoteService.updateQLI(importedScope, $root.record.attributeCategories.records, $root.record.quoteLineId)">Save</button>\n        </footer>\n    </div>\n</div>\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -200%;\n        margin-bottom: 45px;\n        height: auto;\n        transition: top 250ms ease-in;\n        max-height: 700px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__header {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__footer {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: auto;\n        width: 90%;\n        min-width: 90%;\n        max-width: 90%;\n        padding: 0;\n        margin: 0;\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translateY(-50%) translateX(-50%);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 25rem;\n        max-height: 0;\n        border-radius: 0;\n        width: 100%;\n    }\n\n    .vlocity.via-slds .vloc-ins-small-group-product-attributes {\n        width: 60%;\n        padding: 1rem;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); // leaving room for iPhone notification bar\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; // Android doesn\'t need the 20px of room like iPhone\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>'),$templateCache.put("modals/ins-quote-modal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{vlocSlideCustomClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{vlocSlideCustomClass}}-container">\n        <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()" ng-if="!vlocSlideHeader">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Close</span>\n        </button>\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n        </header>\n        <div class="slds-modal__content slds-p-around_medium vloc-modal-content slds-is-relative">\n            <vloc-layout layout-name="{{layout}}" class="{{layout}}" is-loaded="isLayoutLoaded" records="records" ctrl="{{ctrl}}"></vloc-layout>\n        </div>\n        <footer class="slds-modal__footer slds-float_right slds-p-right_large" ng-if="records.modalType === \'Edit\'">\n        <button class="slds-button slds-button_brand" ng-if="!records.Id" ng-click="importedScope.vlocQuote.addNewClass(records, vlocQuote)">Save</button>\n        <button class="slds-button slds-button_brand" ng-if="records.Id" ng-click="importedScope.vlocQuote.updateClass(records, vlocQuote)">Update</button>\n        <button class="slds-button slds-button_neutral" ng-click="$slideHide()">Cancel</button>\n        </footer>\n    </div>\n</div>\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -200%;\n        margin-bottom: 45px;\n        height: auto;\n        transition: top 250ms ease-in;\n        max-height: 700px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__header {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__footer {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: auto;\n        width: 90%;\n        min-width: 90%;\n        max-width: 90%;\n        padding: 0;\n        margin: 0;\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translateY(-50%) translateX(-50%);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 22rem;\n        max-height: 0;\n        border-radius: 0;\n        width: 100%;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); // leaving room for iPhone notification bar\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; // Android doesn\'t need the 20px of room like iPhone\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>')}]);

},{}]},{},[1]);
})();

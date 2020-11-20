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
'use strict';
var app = angular.module('prodconfigprocedure', ['vlocity', 'sldsangular', 'attributeLookupUI', 'ngSanitize', 'ngAnimate']);
app.config(['remoteActionsProvider', function(remoteActionsProvider) {
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}]);

app.filter('excludeSelectedAttributes', function(){
	return function(attributeList, actionParameters, nsPrefix){
		var out = [];
		for(var i=0;i<attributeList.length;i++ ){
			var attribute = attributeList[i];
			var isFound = false;
			for(var j=0;j<actionParameters.length;j++){
				if(actionParameters[j].selectedAttribute && actionParameters[j].selectedAttribute[nsPrefix + 'AttributeUniqueCode__c'] === attribute[nsPrefix + 'AttributeUniqueCode__c']){
					isFound = true;
					break;
				}
			}
			if(!isFound){
				out.push(attribute);
			}
		}
		return out;
	};
});

require('./modules/prodconfigprocedure/controller/ProcedureController.js');
require('./modules/prodconfigprocedure/factory/ProcedureFactory.js');
require('./modules/prodconfigprocedure/factory/ProcedureService.js');
require('./modules/prodconfigprocedure/templates/templates.js');
},{"./modules/prodconfigprocedure/controller/ProcedureController.js":2,"./modules/prodconfigprocedure/factory/ProcedureFactory.js":3,"./modules/prodconfigprocedure/factory/ProcedureService.js":4,"./modules/prodconfigprocedure/templates/templates.js":5}],2:[function(require,module,exports){
var app = angular.module('prodconfigprocedure');
app.controller('ProcedureController', ['ProcedureService', 'PageSpinner', '$scope', '$q', '$sldsModal', 'remoteActions', '$window', 'attributeLookupService',
    function(service, spinner, scope, q, modal, remoteActions, window, attributeLookupService) {
    scope.SLDSICON = window.SLDSICON;
    scope.labels = window.labels;
    scope.nsPrefix = window.configData.nsPrefix;
    scope.spinner = spinner;
    scope.isProductSelected = false;
    scope.isSaveDisable = false;
    scope.productList = [];
    scope.attributeList = [];
    scope.actionParameters = [];
    scope.pickActionList = [];
    scope.prodConfig = {};
    scope.prodConfig[scope.nsPrefix + 'ProductId__c'] = '';
    scope.prodConfigId = window.configData.prodConfigId;
    scope.attrCodeToName = {};
    scope.booleanSelectionOptions = [{'value':true,'label':'Yes'},{'value':false,'label':'No'}];
    scope.backURL = window.configData.cancelBackURL;
    scope.selectedProduct = {};
    scope.selectedProduct.product = '';
    scope.selectAttr = {};
    /*
     * This method get called, when we select product from typeahead.
     * It consider all the typeaheads in the page.
     */
    scope.$on('$sldsTypeahead.select', function(value, product) {
        scope.prodConfig[scope.nsPrefix + 'ProductId__c'] = product.productId;
        scope.isProductSelected = true;
        scope.changeProduct(product);
    });
    scope.initApp = function() {
        scope.spinner.showSpinner();
        var q1;
        if (scope.prodConfigId !== '') {
            q1 = remoteActions.getProductConfigProcedure(scope.prodConfigId).then(function(results) {
                if (results.hasError) {
                    service.openAlertWindow('Product Configuration Procedure Error', results.errorMessage);
                } else {
                    scope.prodConfig = results.result[0];
                    var productId = scope.prodConfig[scope.nsPrefix + 'ProductId__c'];
                    if (productId && productId !== '') {
                        scope.attributeList = results.result.slice(1, results.result.length);
                        scope.isProductSelected = true;
                        scope.selectedProduct.product = scope.prodConfig[scope.nsPrefix + 'ProductId__r'].Name;
                    } else {
                        scope.attrCodeToName = results.result[1];
                    }
                }
            });
        }
        var q2 = remoteActions.getPickAction().then(function(results) {
            if (results.hasError) {
                service.openAlertWindow('Product Configuration Procedure Error', results.errorMessage);
            } else {
                scope.pickActionList = results.result;
            }
        });

        q.all([q1, q2]).then(function(values) {
            if (scope.prodConfigId === '') {
                scope.spinner.hideSpinner();
                return;
            }
            //initialize data
            scope.initialize();
            scope.spinner.hideSpinner();
        }, function(errResult) {
            scope.spinner.hideSpinner();
            service.openAlertWindow('Product Configuration Procedure Error', errResult);
        });
    };
    scope.initialize = function() {
        var actionParameters = JSON.parse(scope.prodConfig[scope.nsPrefix + 'ActionParameters__c']);
        for (var attrCode in actionParameters) {
            var actionPara = {};
            //select attribute
            if (scope.isProductSelected) {
                for (var i = 0;i < scope.attributeList.length;i++) {
                    var attribute = scope.attributeList[i];
                    if (attribute[scope.nsPrefix + 'AttributeUniqueCode__c'] === attrCode) {
                        actionPara.selectedAttribute = attribute;
                        break;
                    }
                }
                //parse data
                var string = actionPara.selectedAttribute[scope.nsPrefix + 'ValidValuesData__c'];
                if (string) {
                    actionPara.selectedAttribute[scope.nsPrefix + 'ValidValuesData__c'] = JSON.parse(string);
                }
            } else {
                actionPara.selectedAttribute = {};
                actionPara.selectedAttribute[scope.nsPrefix + 'AttributeDisplayName__c'] = scope.attrCodeToName[attrCode];
                actionPara.selectedAttribute[scope.nsPrefix + 'AttributeUniqueCode__c'] = attrCode;
            }
            actionPara.actionList = [];
            //select action list
            for (var i = 0; i < actionParameters[attrCode].actionsList.length; i++) {
                var action = {};
                var a = actionParameters[attrCode].actionsList[i];
                action.value = a.value;
                if (!scope.isProductSelected) {
                    //if action.value is array, then show it as semi coloun separated value in input box.
                    if (action.value instanceof Array) {
                        action.value = action.value.join(';');
                    }
                }
                action.actionType = a.actionType;
                for (var j = 0;j < scope.pickActionList.length;j++) {
                    if (a.action === scope.pickActionList[j].name) {
                        action.action = scope.pickActionList[j];
                        break;
                    }
                }
                actionPara.actionList.push(action);
            }
            scope.actionParameters.push(actionPara);
        }
        scope.findAnyAction();
    };
    scope.getProduct = function(search) {
        if (search && typeof search === 'object') {
            return ;
        }
        if (!search ||  search === '') {
            scope.clearSelection();
            return '';
        }
        if (search.trim().length < 3) {
            return ;
        }
        return remoteActions.getProductList(search).then(function(results) {
            if (results.hasError) {
                service.openAlertWindow(scope, 'Product Configuration Procedure Error', results.errorMessage);
                return undefined;
            }else {
                return results.result;
            }
        },function(errResult) {
            service.openAlertWindow('Product Configuration Procedure Error',errResult);
        });
    };
    scope.manualProductSearch = function(search) {
        if (search && typeof search === 'object') {
            return ;
        }
        if (!search ||  search === '') {
            scope.clearSelection();
            return '';
        }
        scope.spinner.showSpinner();
        var modalScope = scope.$new();
        modalScope.confirmationTitle = 'Product Selection';
        modalScope.cancelActionLbl = 'Cancel';
        modalScope.confirmActionLbl = 'Save';
        modalScope.productWrapper = {};
        modalScope.productWrapper.product = undefined;
        modalScope.nsPrefix = scope.nsPrefix;
        modalScope.SLDSICON = scope.SLDSICON;
        modalScope.isAnyProductFound = false;
        modalScope.search = search;
        var prodSearchModal = modal({
            templateUrl: 'ManualProductSearch.tpl.html',
            backdrop: 'static',
            scope: modalScope,
            show: true
        });
        modalScope.getManualSerachProductList = function(search) {
            remoteActions.getManualSerachProductList(search).then(function(results) {
                if (results.hasError) {
                    service.openAlertWindow(scope, 'Product Configuration Procedure Error', results.errorMessage);
                }else {
                    modalScope.productList = results.result;
                    if (results.result && results.result.length !== 0) {
                        modalScope.isAnyProductFound = true;
                    }
                }
                scope.spinner.hideSpinner();
            },function(errResult) {
                scope.message = 'Product Configuration Procedure Error ' + errResult;
                service.openAlertWindow(scope, 'Product Configuration Procedure Error', errResult);
                scope.spinner.hideSpinner();
            });
        };
        modalScope.confirmAction = function() {
            debugger;
            scope.selectedProduct.product = modalScope.productWrapper.product.label;
            scope.prodConfig[scope.nsPrefix + 'ProductId__c'] = modalScope.productWrapper.product.productId;
            scope.isProductSelected = true;
            scope.changeProduct(modalScope.productWrapper.product);
            prodSearchModal.hide();
        };
        modalScope.getManualSerachProductList(search);
    };
    scope.clearSelection = function() {
        scope.selectedProduct.product = '';
        var productId = scope.prodConfig[scope.nsPrefix + 'ProductId__c'];
        if (!productId || productId === '') {
            return;
        }
        scope.prodConfig[scope.nsPrefix + 'ProductId__c'] = '';
        scope.isProductSelected = false;
        for (var i = 0;i < scope.actionParameters.length;i++) {
            var actionPara = scope.actionParameters[i];
            if (actionPara.selectedAttribute) {
                actionPara.attrName = actionPara.selectedAttribute[scope.nsPrefix + 'CategoryName__c'] + ':' + actionPara.selectedAttribute[scope.nsPrefix + 'AttributeId__r'][scope.nsPrefix + 'UniqueNameField__c'] + ':' + actionPara.selectedAttribute[scope.nsPrefix + 'AttributeUniqueCode__c'];
                actionPara.selectedAttribute[scope.nsPrefix + 'ValueDataType__c'] = '';
                actionPara.selectedAttribute[scope.nsPrefix + 'IsReadOnly__c'] = false;
            }
            //check for value which is array of string.
            for (var j = 0;j < actionPara.actionList.length;j++) {
                var action = actionPara.actionList[j];
                if (action.action.name === 'CONSTRAIN' || action.action.name === 'ASSIGN') {
                    if (action.value && Array === action.value.constructor) {
                        action.value = action.value.join(';');
                    } else if (typeof action.value.getMonth === 'function' || typeof(action.value) === 'boolean') {
                        //found date or date time object, convert to string.
                        action.value = action.value.toString();
                    }
                }
            }
        }
    };
    scope.changeActionPara = function(actionPara) {
        actionPara.dataType = actionPara.selectedAttribute[scope.nsPrefix + 'ValueDataType__c'];
        actionPara.validvalues = actionPara.selectedAttribute[scope.nsPrefix + 'ValidValuesData__c'];
    };
    scope.addAction = function(actionList) {
        var action = {};
        action.index = actionList.length;
        action.value = '';
        actionList.push(action);
        if (!scope.isProductSelected) {
            scope.isToDisableProdSelection = true;
        }
    };
    scope.removeAction = function(actionList, index) {
        if (index > -1) {
            actionList.splice(index, 1);
        }
        scope.findAnyAction();
    };
    scope.checkEmptyAction = function() {
        for (var i = 0;i < scope.actionParameters.length;i++) {
            if (scope.actionParameters[i].actionList.length === 0) {
                return true;
            }
        }
        return false;
    };
    scope.findAnyAction = function() {
        //find for any action is present in page if product is not selected.
        if (!scope.isProductSelected) {
            for (var i = 0;i < scope.actionParameters.length;i++) {
                if (scope.actionParameters[i].actionList.length !== 0) {
                    scope.isToDisableProdSelection = true;
                    return ;
                }
            }
            scope.isToDisableProdSelection = false;
        }
    };
    scope.addActionParameter = function() {
        var actionParameter = {};
        actionParameter.actionList = [];
        if (scope.selectAttr.selectedAttribute) {
            actionParameter.selectedAttribute = scope.selectAttr.selectedAttribute;
            scope.selectAttr.showAttrSelectionError = false;
            if (scope.isProductSelected) {
                scope.actionParameters.push(actionParameter);
            } else {
                if (scope.validateAttribute(actionParameter)) {
                    scope.actionParameters.push(actionParameter);
                    scope.selectAttr.duplicateAttrError = false;
                    scope.selectAttr = {};
                } else {
                    scope.selectAttr.duplicateAttrError = true;
                }
            }
        } else {
            scope.selectAttr.showAttrSelectionError = true;
        }
    };
    scope.validateAttribute = function(actionParameter) {
        for (var i = 0;i < scope.actionParameters.length;i++) {
            var attr = scope.actionParameters[i].selectedAttribute;
            if (attr[scope.nsPrefix + 'AttributeUniqueCode__c'] === actionParameter.selectedAttribute[scope.nsPrefix + 'AttributeUniqueCode__c']) {
                return false;
            }
        }
        return true;
    };
    scope.removeActionParameter = function(index) {
        if (index > -1) {
            scope.actionParameters.splice(index, 1);
            scope.findAnyAction();
        }
    };
    scope.openAttributeSelection = function (actionPara) {
        var modalScope = scope.$new();
        modalScope.confirmationTitle = 'Attribute Selection';
        modalScope.cancelActionLbl = 'Cancel';
        modalScope.confirmActionLbl = 'Save';
        modalScope.fieldName = actionPara.attrName;
        modalScope.selected = {};
        modalScope.nsPrefix = scope.nsPrefix;
        modalScope.SLDSICON = scope.SLDSICON;
        var attrSelectionModal = modal({
            templateUrl: 'AttributeSelectionModal.tpl.html',
            backdrop: 'static',
            scope: modalScope,
            show: true
        });
        modalScope.confirmAction = function() {
            actionPara.selectedAttribute = {};
            actionPara.selectedAttribute.attrName = attributeLookupService.parseFields(modalScope.selected).fullFieldName;
            actionPara.selectedAttribute[scope.nsPrefix + 'AttributeUniqueCode__c'] = modalScope.selected.attribute[scope.nsPrefix + 'Code__c'];
            actionPara.selectedAttribute[scope.nsPrefix + 'ValueDataType__c'] = '';
            actionPara.selectedAttribute[scope.nsPrefix + 'AttributeDisplayName__c'] = modalScope.selected.attribute.Name;
            scope.selectAttr.showAttrSelectionError = false;
            scope.selectAttr.duplicateAttrError = false;
            attrSelectionModal.hide();
        };
    };
    scope.changeProduct = function(product) {
        if (!product) {
            scope.isProductSelected = false;
            return;
        }
        scope.spinner.showSpinner();
        var productId = product.productId;
        scope.isProductSelected = true;
        //clear all actionPara
        scope.actionParameters = [];
        remoteActions.getAttributeByProduct(productId).then(function(results) {
            if (results.hasError) {
                scope.attributeList = [];
                service.openAlertWindow(scope, 'Product Configuration Procedure Error', results.errorMessage);
            } else {
                scope.attributeList = results.result;
                //parse validValuesData__c
                for (var i = 0;i < scope.attributeList.length;i++) {
                    var dataType = scope.attributeList[i][scope.nsPrefix + 'ValueDataType__c'];
                    if (dataType === 'Multi Picklist' || dataType === 'Picklist') {
                        var string = scope.attributeList[i][scope.nsPrefix + 'ValidValuesData__c'];
                        if (string) {
                            scope.attributeList[i][scope.nsPrefix + 'ValidValuesData__c'] = JSON.parse(string);
                        }

                    }
                }
            }
            scope.spinner.hideSpinner();
        }, function(errResult) {
            scope.attributeList = [];
            service.openAlertWindow(scope, 'Product Configuration Procedure Error', errResult);
            scope.spinner.hideSpinner();
        });

    };
    scope.saveConfig = function() {
        scope.spinner.showSpinner();
        if (!scope.isProductSelected) {
            scope.prodConfig[scope.nsPrefix + 'ProductId__c'] = '';
        }
        scope.prodConfig[scope.nsPrefix + 'ActionParameters__c'] = {};
        var actionParameters = {};
        for (var i = 0;i < scope.actionParameters.length;i++) {
            var actionPara = scope.actionParameters[i];
            var attrCode = actionPara.selectedAttribute[scope.nsPrefix + 'AttributeUniqueCode__c'];
            var actionList = [];
            for (var j = 0;j < actionPara.actionList.length;j++) {
                var act = actionPara.actionList[j];
                var action = {};
                action.action = act.action.name;
                action.value = act.value !== undefined ? act.value : '';
                if (act.actionType) {
                    action.actionType = act.actionType;
                }
                if (!scope.isProductSelected && (action.action === 'CONSTRAIN' || action.action === 'ASSIGN')) {
                    //check for semi-coloumn, if found store as array of string.
                    var values = action.value.split(';');
                    if (values.length > 1) {
                        action.value = values;
                    }
                }
                actionList.push(action);
            }
            var actions = {};
            actions.actionsList = actionList;
            actions.index = i;
            actionParameters[attrCode] = actions;
        }
        scope.prodConfig[scope.nsPrefix + 'ActionParameters__c'] = JSON.stringify(actionParameters);
        var isClone = false;
        if(window.cloneValue && window.cloneValue !== ''){
        	isClone = true;
        }
        remoteActions.saveConfig(scope.prodConfig,isClone).then(function(results) {
            if (results.hasError) {
                service.openAlertWindow('Product Configuration Procedure Error: ', results.errorMessage);
            } else {
                window.location.href = results.result[0];
            }
            scope.spinner.hideSpinner();
        }, function(errMessage) {
            scope.spinner.hideSpinner();
            service.openAlertWindow('Product Configuration Procedure Error: ', errMessage);
        });
    };
    scope.goBack = function() {
        window.location.href = scope.backURL;
    };
    scope.navigateToProduct = function(productId) {
        if (productId && productId !== '') {
            window.open('/' + productId);
        }
    };
}]);

},{}],3:[function(require,module,exports){
angular.module('prodconfigprocedure')
.factory('PageSpinner', [
	function(){
		var spinner = false;
		return {
			getSpinner: function() {
				return spinner;
			},
			showSpinner: function() {
				spinner = true;
			},
			hideSpinner: function() {
				spinner = false;
			}
		};
	}
]);
// This module is necessary to pass salesforce merged valued to directives in static resources.
//used for the field Lookup Directive
angular.module('parameters',[])
	.factory('ParametersFactory', ['$window', function(window){
		var factory = {};
		factory.getRemoteInvokeMethod = function(){
			return window.configData.adminInvokeMethod;
		
		};
		
		factory.getClassType = function(){
			return window.configData.adminClassType;
		
		};
		
		factory.getLoadingImg = function(){
			return window.configData.waitingImage;
		};
		
		factory.getNsPrefix = function(){
			return window.configData.nsPrefix;
		};
		
		return factory;
	
}]);
},{}],4:[function(require,module,exports){
var app = angular.module('prodconfigprocedure');
app.service('ProcedureService',['$sldsModal', '$sldsPrompt', '$window', function ProcedureService(modal, prompt, window) {

    ProcedureService.prototype.openAlertWindow = function (scope, title, message) {

		deletePrompt = prompt({
            title: title,
            content: message,
            theme: 'error',
            show: true,
            buttons: [{
                label: window.labels.OKLabel,
                type: 'neutral',
                action: function() {
                    deletePrompt.hide();
                }
            }]
        });
	};
}]);

},{}],5:[function(require,module,exports){
angular.module("prodconfigprocedure").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("ManualProductSearch.tpl.html",'<div class="slds-modal slds-fade-in-open" aria-hidden="false" role="dialog">\n   <div class="slds-modal__container">\n      <div class="slds-modal__header">\n         <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide()">\n            <svg aria-hidden="true" class="slds-button__icon slds-button__icon_large">\n               <use xlink:href="{{SLDSICON.CLOSE}}"></use>\n            </svg>\n            <span class="slds-assistive-text">Close</span>\n         </button>\n         <h2 class="slds-text-heading_medium">{{confirmationTitle}}</h2>\n      </div>\n      <div class="slds-modal__content slds-p-around_medium">\n      \t<div ng-if="isAnyProductFound">\n\t\t\t<table class="slds-table slds-table_bordered slds-m-top_medium">\n\t\t\t\t<thead>\n\t\t\t\t<tr class="slds-text-heading_label">\n\t\t\t\t\t<th scope="col">\n\t\t\t\t\t\tSelect\n\t\t\t\t\t</th>\n\t\t\t\t\t<th scope="col">\n\t\t\t\t\t\tName\n\t\t\t\t\t</th>\n\t\t\t\t\t<th scope="col">\n\t\t\t\t\t\tCode\n\t\t\t\t\t</th>\n\t\t\t\t\t<th scope="col">\n\t\t\t\t\t\tDescription\n\t\t\t\t\t</th>\n\t\t\t\t\t<th scope="col">\n\t\t\t\t\t\tFamily\n\t\t\t\t\t</th>\n\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr ng-repeat="product in productList track by $index">\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<input type="radio" ng-model="productWrapper.product" ng-value="product" ng-required="true" name="product">\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<span class="slds-truncate">{{product.label}}</span>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<span class="slds-truncate">{{product.code}}</span>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<span class="slds-truncate">{{product.description}}</div>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<span class="slds-truncate">{{product.family}}</span>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n         </div>\n\t\t<div class="slds-box slds-theme_error" ng-if="!isAnyProductFound">\n\t\t\t<p>There are no product found for <strong>{{search}}</strong></p>\n\t\t</div>\n      </div>\n\t\t<div class="slds-modal__footer">\n\t\t\t<button type="button" class="slds-button slds-button_neutral" ng-click="$hide()">{{cancelActionLbl}}</button>\n\t\t\t<button type="button" class="slds-button slds-button_neutral slds-button_brand" ng-click="confirmAction()" ng-disabled="!productWrapper.product">{{confirmActionLbl}}</button>\n\t\t</div>\n   </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n'),$templateCache.put("Config.tpl.html",'<div class="slds-theme_shade slds-m-top_medium">\n\t<ng-form name="configForm">\n\t\t<div class="slds-grid slds-p-around_x-small">\n\t\t\t<div class="slds-size_1-of-4">\n\t\t\t\t<label>{{labels.prodConfName}}</label>\n\t\t\t</div>\n\t\t\t<div class="slds-size_1-of-4">\n\t\t\t\t<input type="text" ng-model="prodConfig.Name" class="slds-input" placeholder="Name"/>\n\t\t\t</div>\n\t\t\t<div class="slds-size_2-of-4 slds-clearfix">\n\t\t\t\t<div class="slds-float_right">\n\t\t\t\t\t<button type="button" class="slds-button slds-button_neutral" ng-click="saveConfig()" ng-disabled="configForm.$invalid || actionParameters.length===0 || checkEmptyAction()">{{labels.save}}</button>\n\t\t\t\t\t<button type="button" class="slds-button slds-button_neutral" ng-click="goBack()">{{labels.cancel}}</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="slds-grid slds-p-around_x-small">\n\t\t\t<div class="slds-size_1-of-4">\n\t\t\t\t<label>{{labels.selectProduct}}</label>\n\t\t\t</div>\n\t\t\t<div class="slds-size_2-of-4 slds-grid">\n\t\t\t\t<div class="slds-size_1-of-2">\n\t\t\t\t\t<div class="slds-is-relative">\n\t\t\t\t\t\t<input ng-model="selectedProduct.product" type="text" data-min-length="3" data-limit="10" slds-options="product as product.label for product in getProduct($viewValue)"  class="slds-input slds-input-padding" ng-disabled="isToDisableProdSelection" slds-typeahead placeholder="Product Name">\n\t\t\t\t\t\t<button class="slds-button slds-button-icon-position_left" ng-click="manualProductSearch(selectedProduct.product)">\n\t\t\t\t\t\t\t<slds-button-svg-icon sprite="\'utility\'" icon="\'search\'" extra-classes="\'slds-input__icon slds-icon-text-default\'"></slds-button-svg-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button class="slds-button slds-button-icon-position_right" ng-click="clearSelection()" ng-disabled="isToDisableProdSelection || !selectedProduct.product">\n\t\t\t\t\t\t\t<slds-button-svg-icon sprite="\'utility\'" icon="\'clear\'" extra-classes="\'slds-input__icon slds-icon-text-default\'"></slds-button-svg-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\n            \t</div>\n            \t<button class="slds-button slds-button_icon slds-button_icon-border slds-m-left_x-small">\n\t\t\t\t\t<svg aria-hidden="true" class="slds-icon  slds-icon_x-small slds-icon-text-default cursor-icon" ng-click="navigateToProduct(prodConfig[nsPrefix + \'ProductId__c\'])" ng-disabled="!selectedProduct.product">\n\t\t\t\t\t\t<use xlink:href="{{SLDSICON.PREVIEW}}"></use>\n\t\t\t\t\t</svg>\n\t\t\t\t\t<span class="slds-assistive-text">Preview</span>\n\t\t\t\t</button>\n\t\t\t\t<div class="error" ng-if="isProductSelected && attributeList.length===0 ">\n\t\t\t\t\t{{labels.NoAttributeMessage}}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="slds-grid slds-p-around_x-small">\n\t\t\t<div class="slds-size_1-of-4">\n\t\t\t\t<label>{{labels.addAttribute}}</label>\n\t\t\t</div>\n\t\t\t<div class="slds-size_2-of-4 slds-grid">\n\t\t\t\t<div ng-if="isProductSelected" class="slds-size_1-of-2">\n\t\t\t\t\t<select class="slds-select" ng-model="selectAttr.selectedAttribute" ng-options="attribute as attribute[nsPrefix + \'AttributeDisplayName__c\'] for attribute in attributeList|excludeSelectedAttributes:actionParameters:nsPrefix">\n\t\t\t\t\t\t<option ng-disabled="true" value="">{{labels.selectAttr}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t</div>\n\t\t\t\t<div class="slds-size_1-of-2" ng-if="!isProductSelected">\n\t\t\t\t\t<div class="slds-is-relative">\n\t\t\t\t\t\t<input ng-model="selectAttr.selectedAttribute.attrName" type="text" class="slds-input slds-input-padding" ng-disabled="true">\n\t\t\t\t\t\t<button class="slds-button slds-button-icon-position_right" ng-click="openAttributeSelection(selectAttr)" ng-class="{\'disabled\': !selectAttr.selectedAttribute.attrName}">\n\t\t\t\t\t\t\t<slds-button-svg-icon sprite="\'utility\'" icon="\'edit\'" extra-classes="\'slds-input__icon slds-icon-text-default\'"></slds-button-svg-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<button class="slds-button slds-button_icon slds-button_icon-border slds-m-left_x-small" ng-click="addActionParameter()" ng-disabled="isProductSelected && attributeList.length===0">\n\t\t\t\t\t<svg aria-hidden="true" class="slds-icon  slds-icon_x-small slds-icon-text-default">\n\t\t\t\t\t\t<use xlink:href="{{SLDSICON.ADD}}"></use>\n\t\t\t\t\t</svg>\n\t\t\t\t\t<span class="slds-assistive-text">{{labels.addAttribute}}</span>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="slds-clearfix">\n\t\t\t<div class="slds-size_3-of-4 slds-float_right">\n\t\t\t\t<span class="slds-box slds-box_x-small slds-theme_error" ng-show="selectAttr.showAttrSelectionError">{{labels.selectAttrError}}</span>\n\t\t\t\t<span class="slds-box slds-box_x-small slds-theme_error" ng-show="selectAttr.duplicateAttrError">{{labels.attrSelectedError}}</span>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="slds-p-around_x-small">\n\t\t\t<div class="slds-grid slds-p-around_small slds-m-top_x-small slds-theme_default" ng-repeat="actionPara in actionParameters">\n\t\t\t\t<div class="slds-p-horizontal_x-small">\n\t\t\t\t\t{{$index + 1}}\n\t\t\t\t</div>\n\t\t\t\t<div class="slds-size_3-of-4">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<span class="attribute-name">{{actionPara.selectedAttribute[nsPrefix+\'AttributeDisplayName__c\']}}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div ng-if="actionPara.selectedAttribute[nsPrefix + \'IsReadOnly__c\']" class="slds-box slds-box_x-small slds-theme_warning">\n\t\t\t\t\t\t<strong>{{labels.readOnlyAttr}}&nbsp;</strong>{{labels.readOnlyAttrMessage}}\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="slds-p-top_x-small">\n\t\t\t\t\t\t<button class="slds-button slds-button_brand" ng-click="addAction(actionPara.actionList)" ng-disabled="!actionPara.selectedAttribute">{{labels.addAction}}</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="slds-grid slds-p-vertical_x-small" ng-repeat="attributeAction in actionPara.actionList">\n\t\t\t\t\t\t<div class="slds-size_1-of-4">\n\t\t\t\t\t\t\t<select class="slds-select" ng-model="attributeAction.action" ng-options="pickAction as pickAction.name for pickAction in pickActionList | filter:{ name : \'!CONSTRAIN\' }" ng-required="true" ng-if="isProductSelected && actionPara.selectedAttribute[nsPrefix + \'ValueDataType__c\'] !== \'Multi Picklist\' && actionPara.selectedAttribute[nsPrefix + \'ValueDataType__c\'] !== \'Picklist\'">\n\t\t\t\t\t\t\t\t<option ng-disabled="true" value="">Select Action</option>\n\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t<select class="slds-select" ng-model="attributeAction.action" ng-options="pickAction as pickAction.name for pickAction in pickActionList" ng-required="true" ng-if="!isProductSelected || (actionPara.selectedAttribute[nsPrefix + \'ValueDataType__c\'] === \'Multi Picklist\' || actionPara.selectedAttribute[nsPrefix + \'ValueDataType__c\'] === \'Picklist\')">\n\t\t\t\t\t\t\t\t<option ng-disabled="true" value="">Select Action</option>\n\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class="slds-size_2-of-4 slds-p-horizontal_x-small">\n\t\t\t\t\t\t\t<div ng-if="attributeAction.action.name === \'DISABLE\' || attributeAction.action.name === \'REQUIRE\' || attributeAction.action.name === \'HIDE\'" class="slds-size_3-of-4">\n\t\t\t\t\t\t\t\t<select class="slds-select" ng-model="attributeAction.value" ng-options="booleanSelection.value as booleanSelection.label for booleanSelection in attributeAction.action.values " ng-required="true">\n\t\t\t\t\t\t\t\t\t<option value="" ng-disabled="true">Select</option>\n                                </select>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div ng-if="attributeAction.action.name === \'CONSTRAIN\' " class="slds-grid">\n\t\t\t\t\t\t\t\t<div class="slds-size_2-of-4 slds-m-right_x-small">\n\t\t\t\t\t\t\t\t\t<select class="slds-select" ng-model="attributeAction.actionType" ng-options="possibleSelection.value as possibleSelection.label for possibleSelection in attributeAction.action.values " ng-required="true">\n\t\t\t\t\t\t\t\t\t\t<option value="" ng-disabled="true">Select</option>\n\t                                </select>\n                                </div>\n                                <div ng-if="actionPara.selectedAttribute[nsPrefix + \'ValueDataType__c\'] === \'Picklist\'" class="slds-size_2-of-4">\n\t\t\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\t\t\tclass="slds-button slds-button_neutral"\n\t\t\t\t\t\t\t\t\t\t\tng-model="attributeAction.value"\n\t\t\t\t\t\t\t\t\t\t\tslds-options="attribtueAssignSO.displayText as attribtueAssignSO.displayText for attribtueAssignSO in actionPara.selectedAttribute[nsPrefix + \'ValidValuesData__c\'] " slds-select>\n\t\t\t\t\t\t\t\t\t  {{labels.value}}\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div ng-if="actionPara.selectedAttribute[nsPrefix + \'ValueDataType__c\'] === \'Multi Picklist\'" class="slds-size_2-of-4">\n\t\t\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\t\t\tclass="slds-button slds-button_neutral"\n\t\t\t\t\t\t\t\t\t\t\tng-model="attributeAction.value"\n\t\t\t\t\t\t\t\t\t\t\tdata-multiple="1"\n\t\t\t\t\t\t\t\t\t\t\tdata-animation="am-flip-x"\n\t\t\t\t\t\t\t\t\t\t\tslds-options="attribtueAssignSO.displayText as attribtueAssignSO.displayText for attribtueAssignSO in actionPara.selectedAttribute[nsPrefix + \'ValidValuesData__c\'] " slds-select>\n\t\t\t\t\t\t\t\t\t{{labels.values}}\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div ng-if="!actionPara.selectedAttribute[nsPrefix + \'ValueDataType__c\']  || actionPara.selectedAttribute[nsPrefix + \'ValueDataType__c\'] === \'\'" class="slds-size_2-of-4">\n\t\t\t\t\t\t\t\t\t<input class="slds-input" type="text" ng-model="attributeAction.value">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div ng-if="attributeAction.action.name === \'ASSIGN\'">\n\t\t\t\t\t\t\t\t<div ng-switch="actionPara.selectedAttribute[nsPrefix + \'ValueDataType__c\']" class="slds-grid">\n\t\t\t\t\t\t\t\t\t<div ng-switch-when="Picklist" class="slds-size_3-of-4">\n\t\t\t\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\t\t\t\tclass="slds-button slds-button_neutral"\n\t\t\t\t\t\t\t\t\t\t\t\tng-model="attributeAction.value"\n\t\t\t\t\t\t\t\t\t\t\t\tslds-options="attribtueAssignSO.displayText as attribtueAssignSO.displayText for attribtueAssignSO in actionPara.selectedAttribute[nsPrefix + \'ValidValuesData__c\'] " slds-select>\n\t\t\t\t\t\t\t\t\t\t  {{labels.value}}\n\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div ng-switch-when="Multi Picklist" class="slds-size_3-of-4">\n\t\t\t\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\t\t\t\tclass="slds-button slds-button_neutral"\n\t\t\t\t\t\t\t\t\t\t\t\tng-model="attributeAction.value"\n\t\t\t\t\t\t\t\t\t\t\t\tdata-multiple="1"\n\t\t\t\t\t\t\t\t\t\t\t\tdata-animation="am-flip-x"\n\t\t\t\t\t\t\t\t\t\t\t\tslds-options="attribtueAssignSO.displayText as attribtueAssignSO.displayText for attribtueAssignSO in actionPara.selectedAttribute[nsPrefix + \'ValidValuesData__c\'] " slds-select>\n\t\t\t\t\t\t\t\t\t\t{{labels.values}}\n\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div ng-switch-when="Checkbox" class="slds-size_3-of-4">\n\t\t\t\t\t\t\t\t\t\t<select  class="slds-select" ng-model="attributeAction.value" ng-options="booleanSelection.value as booleanSelection.label for booleanSelection in booleanSelectionOptions">\n\t\t\t\t\t\t\t\t\t\t\t<option value="" ng-disabled="true">Select</option>\n\t                                   \t</select>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div ng-switch-when="Date" class="slds-size_3-of-4">\n\t                                    <input type="text" class="slds-input" ng-model="attributeAction.value" slds-date-picker>\n\t                                </div>\n\t                                <div ng-switch-when="Datetime" class="slds-clearfix slds-grid">\n\t                                    <input type="text" class="slds-input slds-m-right_x-small slds-size_2-of-4" ng-model="attributeAction.value" name="date" slds-date-picker>\n\t                                    <input type="text" class="slds-input slds-float_left slds-size_1-of-4" ng-model="attributeAction.value" name="time" slds-time-picker>\n\t                                </div>\n\t\t\t\t\t\t\t\t\t<div ng-switch-when="Currency" class="slds-size_3-of-4">\n\t\t\t\t\t\t\t\t\t\t<input class="slds-input" type="text" ng-model="attributeAction.value" ng-pattern="/^[+-]?((\\d+(\\.\\d*)?)|(\\.\\d+))$/">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div ng-switch-when="Percent" class="slds-size_3-of-4">\n\t\t\t\t\t\t\t\t\t\t<input class="slds-input" type="text" ng-model="attributeAction.value" ng-pattern="/^[+-]?((\\d+(\\.\\d*)?)|(\\.\\d+))$/">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div ng-switch-when="Number" class="slds-size_3-of-4">\n\t\t\t\t\t\t\t\t\t\t<input class="slds-input" type="text" ng-model="attributeAction.value" ng-pattern="/^[+-]?((\\d+(\\.\\d*)?)|(\\.\\d+))$/">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div ng-switch-default class="slds-size_3-of-4">\n\t\t\t\t\t\t\t\t\t\t<input class="slds-input" type="text" ng-model="attributeAction.value">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="slds-size_1-of-4 slds-clearfix">\n\t\t\t\t\t\t\t<a href="javascript:void(0);">\n\t\t\t\t\t\t\t\t<svg aria-hidden="true" class="slds-icon  slds-icon_x-small slds-icon-text-default slds-float_right" ng-click="removeAction(actionPara.actionList, $index)">\n\t\t\t\t\t\t\t\t\t<use xlink:href="{{SLDSICON.DELETE}}"></use>\n\t\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="slds-size_1-of-4 slds-p-right_medium slds-clearfix">\n\t\t\t\t\t<a href="javascript:void(0);">\n\t\t\t\t\t\t<svg aria-hidden="true" class="slds-icon  slds-icon_x-small slds-icon-text-default slds-float_right" ng-click="removeActionParameter($index)">\n\t\t\t\t\t\t\t<use xlink:href="{{SLDSICON.DELETE}}"></use>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</ng-form>\n</div>\n'),$templateCache.put("AttributeSelectionModal.tpl.html",'<div class="slds-modal slds-fade-in-open" aria-hidden="false" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide()">\n                <svg aria-hidden="true" class="slds-button__icon slds-button__icon_large">\n                    <use xlink:href="{{SLDSICON.CLOSE}}"></use>\n                </svg>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 class="slds-text-heading_medium">{{confirmationTitle}}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium slds-scrollable_y">\n            <attribute-Lookup field-name="fieldName" selected="selected"></attribute-Lookup>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="$hide()">{{cancelActionLbl}}</button>\n            <button type="button" class="slds-button slds-button_neutral slds-button_brand" ng-click="confirmAction()" ng-disabled="!selected.attribute">{{confirmActionLbl}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n'),$templateCache.put("attributeLookup.html",'<div class="slds-grid slds-grid_pull-padded slds-scrollable_x ">\n    <div class="slds-col_padded slds-size_1-of-2">\n        <select class="slds-select" size="5" ng-change="populateAttributes()" data-ng-options="category as category.Name for category in attributeCategoriesList | orderBy:\'Name\'" data-ng-model="selected.category">\n            <option value="" ng-if="false"></option>\n        </select>\n    </div>\n    <div class="slds-col_padded slds-size_1-of-2">\n        <select class="slds-select" size="5" data-ng-options="attribute as attribute.Name for attribute in attributesList | orderBy:\'label\'" data-ng-model="selected.attribute">\n            <option value="" ng-if="false"></option>\n        </select>\n    </div>\n</div>\n'),$templateCache.put("ConfirmationModal.tpl.html",'<div class="slds-modal slds-fade-in-open" aria-hidden="false" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide()">\n                <svg aria-hidden="true" class="slds-button__icon slds-button__icon_large">\n                    <use xlink:href="{{SLDSICON.CLOSE}}"></use>\n                </svg>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 class="slds-text-heading_medium">{{confirmationTitle}}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p ng-bind-html="confirmationMsg"></p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="$hide()">{{cancelActionLbl}}</button>\n            <button type="button" class="slds-button slds-button_neutral slds-button_brand" ng-click="confirmAction()">{{confirmActionLbl}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n')}]);

},{}]},{},[1]);
})();

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
var documentTokenMappingApp = angular.module('documentTokenMappingApp', []).config(['remoteActionsProvider', function(remoteActionsProvider) {
    remoteActionsProvider.setRemoteActions(window.remoteActionsTokenMapping || {}); 
}]);

// Controllers
require('./modules/documentTokenMappingApp/controller/DocumentTokenMappingController.js');

// Directives
require('./modules/documentTokenMappingApp/directive/TokenMappingDirective.js');

// Templates
require('./modules/documentTokenMappingApp/templates/templates.js');

},{"./modules/documentTokenMappingApp/controller/DocumentTokenMappingController.js":2,"./modules/documentTokenMappingApp/directive/TokenMappingDirective.js":3,"./modules/documentTokenMappingApp/templates/templates.js":4}],2:[function(require,module,exports){
angular.module('documentTokenMappingApp').controller('tokenMappingModelController',function($scope, $rootScope,
    availableTypes, token, appType, tokenMappingComponentFactory, mapping) {
    'use strict';
    $scope.nameSpacePrefix = '';
    if (window.nameSpacePrefix !== undefined) {
        $scope.nameSpacePrefix = window.nameSpacePrefix;
    }
    if (window.modalLabels !== undefined) {
        $scope.modalLabels = window.modalLabels;
        console.log($scope.modalLabels);
    }
    $scope.availableTypes = availableTypes;
    $scope.showFieldError = false;
    $scope.mapping = {
        data: '',
        display: '',
        reference: ''
    };
    $scope.token = token;
    $scope.appType = appType;
    $scope.selectedItemChanged = function(selectedApplicableType, index) {
        var i;
        //Remove all the cascaded fields
        if (index < $scope.availableTypes.length - 1) {
            for (i = $scope.availableTypes.length; i > index; i--) {
                $scope.availableTypes.splice(i,1);
            }
        }
        $scope.mapping = {
            data: '',
            display: '',
            reference: ''
        };
        //Update the expression
        $scope.evaluateExpression();
        if (selectedApplicableType.IsReference) {
            tokenMappingComponentFactory.getFields(selectedApplicableType.ReferenceName).then(function(result) {
                $scope.availableTypes.push(result);
            });
        }
    };

    $scope.evaluateExpression = function() {
        var i, availableType, reference, oldRef, useOldRef, fieldName, fieldNameNoId;
        for (i = 0; i < $scope.availableTypes.length; i++) {
            availableType = $scope.availableTypes[i];
            //If the selected field is a reference
            if (availableType.selected.IsReference) {
                reference = availableType.selected.ReferenceName;
                oldRef = angular.copy(reference);
                useOldRef = false;
                fieldName = availableType.selected.Name;
                //Verify if its a standard field or
                //custom field referencing the object
                //If its a standard field, then verify the reference
                if (fieldName.indexOf('__c') === -1) {
                    if (reference.indexOf('__c') > -1) {
                        reference = reference.replace('__c','__r');
                    }
                }
                //If its a custom field,then replace __c with __r
                //for any object
                else {
                    reference = fieldName.replace('__c','__r');
                    useOldRef = true;
                }
                
                $scope.mapping.data = $scope.mapping.data + fieldName + '.';
                if (useOldRef) {
                    $scope.mapping.reference = $scope.mapping.reference + oldRef + '.';
                } else {
                    $scope.mapping.reference = $scope.mapping.reference + reference + '.';
                }
                
                if (fieldName.indexOf('Id') > -1 && !useOldRef) {
                    fieldNameNoId = fieldName.substring(0,fieldName.length - 2);
                    $scope.mapping.display = $scope.mapping.display + fieldNameNoId + '.';
                } else {
                    $scope.mapping.display = $scope.mapping.display + reference + '.';
                }
            } else {
                $scope.mapping.display = $scope.mapping.display + availableType.selected.Name;
                $scope.mapping.reference = $scope.mapping.reference + availableType.selected.Name;
                $scope.mapping.data = $scope.mapping.data + availableType.selected.Name;
            }
        }
    };

    if ($scope.availableTypes[0].selected != null) {
        $scope.evaluateExpression();
    }

    $scope.validateMapping = function() {
        var i, availableType;
        for (i = 0; i < $scope.availableTypes.length; i++) {
            availableType = $scope.availableTypes[i];
            if (availableType.selected === undefined) {
                return false;
            }
        }
        return true;
    };

    $scope.insertMapping = function(scopeMapping) {
        if ($scope.validateMapping()) {
            if (appType.indexOf('__c') > -1) {
                mapping[token][$scope.nameSpacePrefix + appType] = scopeMapping;
            }
            mapping[token][appType] = scopeMapping;
            console.log(mapping);
            this.$hide();
        } else {
            $scope.showFieldError = true;
        }
    };

    $scope.closeModal = function() {
        this.$hide();
    };
});

},{}],3:[function(require,module,exports){
angular.module('documentTokenMappingApp').directive('tokenMapping', function($rootScope, $compile, $templateCache, $modal,
    tokenMappingComponentFactory) {
    'use strict';
    var nameSpacePrefix = '';
    var modalLabels = '';
    if (window.nameSpacePrefix !== undefined) {
        nameSpacePrefix = window.nameSpacePrefix;
    }
    if (window.modalLabels !== undefined) {
        modalLabels = window.modalLabels;
    }

    return {
        restrict: 'E',
        transclude: true,
        template: $templateCache.get('token-mapping.tpl.html'),
        scope: {
            applicableTypes: '=',
            section: '=',
            token: '=',
            templateActive: '=',
            templateTokens: '=',
            templateData: '='
        },
        link: function(scope) {
            var appTypes = [];
            if (scope.applicableTypes) {
                appTypes = scope.applicableTypes.split(';');
            }
            scope.appTypes = appTypes;
            scope.tokenMap = scope.token;
            scope.tokens = [];
            scope.modalLabels = modalLabels;
            scope.templateAtive = scope.templateActive;

            scope.$watch('[section.sectionContent,section.sectionJsonRepeatable]', function(newValue, oldValue) {
                var sectionContent, sectionJsonRepeatable, regEx, tokens, tokenMap, i, j, token, key, key2;
                if (newValue && newValue !== oldValue) {
                    sectionContent = newValue[0];
                    sectionJsonRepeatable = newValue[1];
                    regEx = /%%(.*?)%%/g;
                    tokens = [];
                    if (sectionContent && sectionContent.match(regEx)) {
                        tokens = sectionContent.match(regEx);
                    }
                    if (sectionJsonRepeatable && sectionJsonRepeatable.match(regEx)) {
                        tokens = tokens.concat(sectionJsonRepeatable.match(regEx));
                    }
                    tokenMap = {};
                    if (tokens && tokens.length) {
                        for (i = 0; i < tokens.length; i++) {
                            token = tokens[i];
                            tokenMap[token] = true;
                            if (!scope.section.sectionTokens[token]) {
                                scope.section.sectionTokens[token] = {};
                                scope.section.sectionTokensFormatted.push({label: token});
                            }
                            if (!scope.section.templateTokens[token]) {
                                scope.section.templateTokens[token] = {};
                            }
                            if (!scope.templateTokens.tokens[token]) {
                                scope.templateTokens.tokens[token] = {};
                            }
                            if (scope.templateTokens.sectionTokens[scope.section.sectionSequence] && !scope.templateTokens.sectionTokens[scope.section.sectionSequence][token]) {
                                scope.templateTokens.sectionTokens[scope.section.sectionSequence][token] = {};
                            }
                        }
                    }
                    // Delete token from sectionTokens if it is no longer found in the content (someone deletes it)
                    for (key in scope.section.sectionTokens) {
                        if (angular.equals(tokenMap, {})) {
                            scope.section.sectionTokens = {};
                            scope.section.sectionTokensFormatted = [];
                            scope.templateTokens.sectionTokens[scope.section.sectionSequence] = {};
                        } else if (tokenMap[key] == null) {
                            delete scope.section.sectionTokens[key];
                            delete scope.templateTokens.sectionTokens[scope.section.sectionSequence][key];
                            delete scope.templateTokens.tokens[key];
                            if (scope.section.sectionTokensFormatted.indexOf(key) > -1) {
                                scope.section.sectionTokensFormatted.splice(scope.section.sectionTokensFormatted.indexOf(key), 1);
                            }
                        }
                    }
                    scope.templateTokens.formatted = [];
                    for (j = 0; j < scope.templateTokens.sectionTokens.length; j++) {
                        for (key2 in scope.templateTokens.sectionTokens[j]) {
                            scope.templateTokens.formatted.push({label: key2});
                            scope.section.templateTokens[key2] = {};
                        }
                    }
                    scope.templateTokens.formatted = _.uniq(scope.templateTokens.formatted, 'label');
                }
                scope.tokens = [];
                scope.loadPage();
            }, true);

            scope.$watch('section.sectionLineItems', function(newValue, oldValue) {
                var tokenMap, i, colToken, totalToken, tokens, j, token, k, key;
                if (newValue && oldValue) {
                    tokenMap = {};
                    for (i = 0; i < newValue.length; i++) {
                        colToken = newValue[i].columnToken;
                        totalToken = newValue[i].totalToken;
                        if (colToken) {
                            tokens = [];
                            tokens = colToken.match(/%%(.*?)%%/g);
                            if (tokens != null) {
                                for (j = 0; j < tokens.length; j++) {
                                    token = tokens[j];
                                    tokenMap[token] = true;
                                    if (scope.section.sectionTokens[token] == null) {
                                        scope.section.sectionTokens[token] = {};
                                    }
                                }
                            }
                        }
                        if (totalToken && scope.templateData.tokenMappingType === 'Object Based') {
                            tokens = [];
                            tokens = totalToken.match(/%%(.*?)%%/g);
                            if (tokens != null) {
                                for (k = 0; k < tokens.length; k++) {
                                    token = tokens[k];
                                    tokenMap[token] = true;
                                    if (scope.section.sectionTokens[token] == null) {
                                        scope.section.sectionTokens[token] = {};
                                    }
                                }
                            }
                        } else if (!totalToken && scope.templateData.tokenMappingType === 'JSON Based') {
                            newValue[i].totalToken = false;
                        }
                    }
                    //Delete tokens not currently present
                    for (key in scope.section.sectionTokens) {
                        if (tokenMap[key] == null) {
                            delete scope.section.sectionTokens[key];
                        }
                    }
                }
                scope.tokens = [];
                scope.loadPage();
            }, true);

            scope.$watch('section.sectionTokens', function() {
                // console.log(newValue);
                // console.log(oldValue);
                scope.tokens = [];
                scope.loadPage();
            }, true);

            scope.$watch('applicableTypes', function(newValue) {
                var i, token, tokenMap, j, appType, appTypeWithNamespace;
                if (newValue !== undefined) {
                    appTypes = newValue.split(';');
                    scope.tokens = [];
                    scope.appTypes = appTypes;
                    scope.loadPage();
                    //Remove the mappings for applicable types that are not used any more
                    for (i = 0; i < scope.tokens.length; i++) {
                        token = scope.tokens[i];
                        tokenMap = {};
                        for (j = 0; j < appTypes.length; j++) {
                            appType = appTypes[j];
                            appTypeWithNamespace = '';
                            if (appType.indexOf('__c') > -1) {
                                appTypeWithNamespace = nameSpacePrefix + appType;
                                tokenMap[appTypeWithNamespace] = scope.tokenMap[token][appTypeWithNamespace];
                            }
                            tokenMap[appType] = scope.tokenMap[token][appType];
                        }
                        scope.tokenMap[token] = tokenMap;
                    }
                }
            }, true);

            scope.loadPage = function() {
                var key;
                for (key in scope.tokenMap) {
                    scope.tokens.push(key);
                }
            };

            scope.defineMappingClicked = function(token, appType) {
                var availableTypes, modalInstance;
                //Get the fields for the selected applicable type
                availableTypes = [];
                tokenMappingComponentFactory.getFields(appType).then(function(result) {
                    availableTypes.push(result);
                    //Open a Modal with just the selected token type
                    modalInstance = $modal({
                        templateUrl: 'token-mapping-modal.tpl.html',
                        controller: 'tokenMappingModelController',
                        container: 'div.vlocity',
                        placement: 'center',
                        backdrop: false,
                        scope: scope,
                        resolve: {
                            availableTypes: function() {
                                return availableTypes;
                            },
                            token: function() {
                                return token;
                            },
                            appType: function() {
                                return appType;
                            },
                            tokenMappingComponentFactory: function() {
                                return tokenMappingComponentFactory;
                            },
                            mapping: function() {
                                return scope.tokenMap;
                            }
                        }
                    });
                });
            };

            scope.editMappingClicked = function(token, appType, dataMapping) {
                var availableObjTypes, fieldMappingTokens, dataMappingTokens, i, dataMappingToken, customObjName, j,
                    availableTypes, availableObjType, k, objFieldsMap, objType, availableType, l, field, modalInstance;
                availableObjTypes = [];
                availableObjTypes.push(appType);
                fieldMappingTokens = dataMapping.data.split('.');
                dataMappingTokens = dataMapping.reference.split('.');
                //Always skip the last one as it will be a field Name
                for (i = 0; i < dataMappingTokens.length - 1; i++) {
                    dataMappingToken = dataMappingTokens[i];
                    //Verify if its a standard object reference
                    if (dataMappingToken.indexOf('__r') === -1) {
                        availableObjTypes.push(dataMappingToken);
                    } else {
                        customObjName = dataMappingToken.replace('__r','__c');
                        availableObjTypes.push(customObjName);
                    }
                }
                //Select the field value in the dropdown
                //It is always the next value ex: for an Order Obj, if the
                //mapping is AccountId.Name, then for Order dropdown AccountId
                //should be selected and for Account dropdown Name
                //should be selected
                //Use the index as part of the key to
                //handle multiple occurances for the same object
                scope.selectedObjMap = {};
                for (j = 0; j < availableObjTypes.length; j++) {
                    availableObjType = availableObjTypes[j];
                    scope.selectedObjMap[availableObjType + j] = fieldMappingTokens[j];
                }
                scope.availableObjTypes = availableObjTypes;
                tokenMappingComponentFactory.getAllFieldsForMultipleObj(JSON.stringify(availableObjTypes)).then(function(result) {
                    availableTypes = [];
                    for (k = 0; k < scope.availableObjTypes.length; k++) {
                        objFieldsMap = angular.copy(result);
                        objType = scope.availableObjTypes[k];
                        availableType = {};
                        availableType = angular.copy(result[objType]);
                        for (l = 0; l < availableType.length; l++) {
                            field = availableType[l];
                            if (field.Name === scope.selectedObjMap[objType + k]) {
                                availableType.selected = field;
                                break;
                            }
                        }
                        availableTypes.push(availableType);
                    }

                    //Open a Modal with just the selected token type
                    modalInstance = $modal({
                        templateUrl: 'token-mapping-modal.tpl.html',
                        controller: 'tokenMappingModelController',
                        container: 'div.vlocity',
                        placement: 'center',
                        scope: scope,
                        backdrop: false,
                        resolve: {
                            availableTypes: function() {
                                return availableTypes;
                            },
                            token: function() {
                                return token;
                            },
                            appType: function() {
                                return appType;
                            },
                            tokenMappingComponentFactory: function() {
                                return tokenMappingComponentFactory;
                            },
                            mapping: function() {
                                return scope.tokenMap;
                            }
                        }
                    });
                });
            };
            scope.loadPage();
        }
    };
});

},{}],4:[function(require,module,exports){
angular.module("documentTokenMappingApp").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("token-mapping.tpl.html",'<div class="token" ng-repeat="token in tokens track by $index"> \n    <div class="slds-panel"> \n        <div class="slds-box">\n            <div class="slds-size_1-of-1">\n                <div class="col-md-2 token-label">\n                    {{token}} \n                </div> \n                <div class="col-md-10"> \n                    <div class="row"> \n                        <div class="col-md-3 app-type" ng-class="{\'mapping-undefined\': tokenMap[token][appType]==null}" ng-repeat="appType in appTypes track by $index"> \n                            <div class="row"> \n                                <div class="col-md-12 app-type"><strong>{{appType}}</strong></div> \n                            </div>  \n                            <div class="row"> \n                                <div class="col-md-12 token-mapping-string">{{tokenMap[token][appType][\'display\']}}</div> \n                            </div>  \n                            <div class="row" ng-if="tokenMap[token][appType]!=null && !templateActive"> \n                                <div class="col-md-12"><button class="slds-button slds-button_neutral" ng-click="editMappingClicked(token,appType,tokenMap[token][appType])">{{modalLabels.CLMTemplateEdit}}</button></div> \n                                \n                            </div> \n                            <div class="row" ng-if="tokenMap[token][appType]==null"> \n                                <div class="col-md-12" ><button class="slds-button slds-button_brand" ng-click="defineMappingClicked(token,appType)">{{modalLabels.CLMTemplateDefineMapping}}</button></div> \n                            </div>\n                        </div> \n                    </div> \n                </div> \n            </div>\n        </div> \n    </div> \n</div> \n'),$templateCache.put("token-mapping-modal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_large" tabindex="-1" role="dialog"> \n    <div class="slds-modal__container"> \n        <div class="slds-modal__header"> \n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" style="fill:#54698d" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4>{{modalLabels.CLMTemplateTokenMapping}}</h4> \n        </div> \n        <div class="slds-modal__content slds-p-around_medium"> \n            <label class="form_element__label slds-size_1-of-1 slds-p-around_small">{{modalLabels.CLMTemplateDefineDataMappingForToken}} {{token}} {{modalLabels.CLMTemplateForApplicableType}} {{appType}}</label>\n            <div class="slds-size_1-of-1 slds-grid slds-grid_pull-padded-medium slds-m-left_small">  \n                <div ng-repeat="availableType in availableTypes track by $index" class="slds-size_1-of-3 slds-m-bottom_medium slds-p-around_small"> \n                    <select ng-model="availableType.selected" class="slds-select"\n                            ng-options="applicableType.Name for applicableType in  availableType | orderBy:\'Name\'" \n                            ng-change="selectedItemChanged(availableType.selected,$index)"> \n                    </select>\n                 </div> \n            </div> \n                <div class="slds-form-element__label">{{modalLabels.CLMTemplateTokenMapping}}:</div>\n                <div class="slds-size_1-of-12">{{mapping.display}}</div>\n        </div> \n        <div class="slds-modal__footer"> \n            <div ng-show="showFieldError"><h5 class="text-left">{{modalLabels.CLMTemplateTokenMappingObjNoField}}</h5> </div>\n            <button type="button" class="slds-button slds-button_brand" ng-click="insertMapping(mapping)">{{modalLabels.CLMTemplateApply}}</button>  \n            <button type="button" class="slds-button slds-button_neutral" ng-click="closeModal()">{{modalLabels.CLMClauseClose}}</button> \n        </div> \n    </div> \n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>')}]);

},{}]},{},[1]);
})();

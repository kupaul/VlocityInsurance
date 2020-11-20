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

angular.module('omniscriptDesigner', ['vlocity', 'oui', 'omnidesigner.core', 'mgcrea.ngStrap',
    'ui-rangeSlider', 'dndLists', 'ngSanitize', 'sldsangular', 'ngOrderObjectBy', 'omniscriptLwcCompiler',
    'viaExpressionEngine', 'ui.tinymce', 'dataraptor', 'drvcomp', 'ouihome', 'sharedObjectService'
])
    .value('isIntegrationProcedure', false);
require('./modules/oui/Oui.js');

require('./modules/designer/config/run.js');
require('./modules/designer/config/config.js');

require('./modules/designer/component/alertBanner.js');
require('./modules/designer/component/OmniScriptPropertySet.js');
require('./modules/designer/component/DataSourceProperty.js');
require('./modules/designer/component/DataraptorSelect.js');
require('./modules/designer/component/PersistentComponent.js');
require('./modules/designer/component/ReusableScriptPropertySet.js');

require('./modules/designer/component/action/index.js');
require('./modules/designer/component/display/index.js');
require('./modules/designer/component/function/index.js');
require('./modules/designer/component/group/index.js');
require('./modules/designer/component/input/index.js');
require('./modules/designer/component/common/index.js');

require('./modules/designer/controller/OmniScriptDesigner.js');
require('./modules/designer/controller/ElementPalette.js');
require('./modules/designer/controller/StructureCanvas.js');
require('./modules/designer/controller/TabbedController.js');
require('./modules/designer/controller/PropertiesController.js');
require('./modules/designer/controller/ScriptFormController.js');

require('./modules/designer/directive/NumberInputNullValueFix.js');
require('./modules/designer/directive/PreventDeleteBack.js');
require('./modules/designer/directive/PaletteGroup.js');
require('./modules/designer/directive/ViaAffix.js');
require('./modules/designer/directive/vlc-draggable.js');
require('./modules/designer/directive/vlc-bubble-canceller.js');
require('./modules/designer/directive/vlc-expand-collapse.js');
require('./modules/designer/directive/ngOrderObjectBy.js');
require('./modules/designer/directive/showHideRule.js');

require('./modules/designer/filter/ActiveElementTitle.js');
require('./modules/designer/filter/ClassName.js');
require('./modules/designer/filter/ElementLabel.js');
require('./modules/designer/filter/GetTypeForElement.js');
require('./modules/designer/filter/FixMissingProperties.js');
require('./modules/designer/filter/ReadablePropertyName.js');
require('./modules/designer/filter/ControlType.js');

require('./modules/designer/factory/propCompUtil.js');
require('./modules/designer/factory/InterTabMsgBus.js');
require('./modules/designer/factory/Delete.js');
require('./modules/designer/services/tinyMCEImageInsert.js');
require('./modules/designer/services/dataraptorBundleService.js');
require('./modules/designer/services/sObjectService.js');
require('./modules/designer/services/propertyEditorModalService.js');
require('./modules/designer/services/customViewModalService.js');
require('./modules/designer/services/customLabelService.js');
require('./modules/designer/services/lwcService.js');
require('./modules/designer/services/vlocityUiTemplatesService.js');
require('./modules/designer/oui_tinymce_plugins/smart_link.js');
require('./modules/designer/oui_tinymce_plugins/doc_insert.js');

require('./modules/designer/templates/templates.js');
require('./modules/designer/directive/logging.js');
require('./modules/designer/directive/treeView.js');
require('./modules/designer/directive/lwcTreeView.js');
require('./modules/designer/directive/vlcCollapsible.js');
require('./modules/designer/directive/vlcClipboard.js');
require('./modules/designer/directive/translationEditModal.js');
require('./modules/designer/directive/convertOmniToMultiLangModal.js');
require('./modules/designer/factory/tObjectFactory.js');

angular.module('ouihome', ['vlocity']);
require('./modules/ouihome/factory/BackcompatExport.js');

},{"./modules/designer/component/DataSourceProperty.js":3,"./modules/designer/component/DataraptorSelect.js":4,"./modules/designer/component/OmniScriptPropertySet.js":5,"./modules/designer/component/PersistentComponent.js":6,"./modules/designer/component/ReusableScriptPropertySet.js":7,"./modules/designer/component/action/index.js":28,"./modules/designer/component/alertBanner.js":29,"./modules/designer/component/common/index.js":43,"./modules/designer/component/display/index.js":47,"./modules/designer/component/function/index.js":52,"./modules/designer/component/group/index.js":62,"./modules/designer/component/input/index.js":86,"./modules/designer/config/config.js":87,"./modules/designer/config/run.js":88,"./modules/designer/controller/ElementPalette.js":89,"./modules/designer/controller/OmniScriptDesigner.js":90,"./modules/designer/controller/PropertiesController.js":91,"./modules/designer/controller/ScriptFormController.js":92,"./modules/designer/controller/StructureCanvas.js":93,"./modules/designer/controller/TabbedController.js":94,"./modules/designer/directive/NumberInputNullValueFix.js":95,"./modules/designer/directive/PaletteGroup.js":96,"./modules/designer/directive/PreventDeleteBack.js":97,"./modules/designer/directive/ViaAffix.js":98,"./modules/designer/directive/convertOmniToMultiLangModal.js":99,"./modules/designer/directive/logging.js":100,"./modules/designer/directive/lwcTreeView.js":101,"./modules/designer/directive/ngOrderObjectBy.js":102,"./modules/designer/directive/showHideRule.js":103,"./modules/designer/directive/translationEditModal.js":104,"./modules/designer/directive/treeView.js":105,"./modules/designer/directive/vlc-bubble-canceller.js":106,"./modules/designer/directive/vlc-draggable.js":107,"./modules/designer/directive/vlc-expand-collapse.js":108,"./modules/designer/directive/vlcClipboard.js":109,"./modules/designer/directive/vlcCollapsible.js":110,"./modules/designer/factory/Delete.js":111,"./modules/designer/factory/InterTabMsgBus.js":112,"./modules/designer/factory/propCompUtil.js":113,"./modules/designer/factory/tObjectFactory.js":114,"./modules/designer/filter/ActiveElementTitle.js":115,"./modules/designer/filter/ClassName.js":116,"./modules/designer/filter/ControlType.js":117,"./modules/designer/filter/ElementLabel.js":118,"./modules/designer/filter/FixMissingProperties.js":119,"./modules/designer/filter/GetTypeForElement.js":120,"./modules/designer/filter/ReadablePropertyName.js":121,"./modules/designer/oui_tinymce_plugins/doc_insert.js":122,"./modules/designer/oui_tinymce_plugins/smart_link.js":123,"./modules/designer/services/customLabelService.js":124,"./modules/designer/services/customViewModalService.js":125,"./modules/designer/services/dataraptorBundleService.js":126,"./modules/designer/services/lwcService.js":127,"./modules/designer/services/propertyEditorModalService.js":128,"./modules/designer/services/sObjectService.js":129,"./modules/designer/services/tinyMCEImageInsert.js":130,"./modules/designer/services/vlocityUiTemplatesService.js":131,"./modules/designer/templates/templates.js":132,"./modules/oui/Oui.js":133,"./modules/ouihome/factory/BackcompatExport.js":142}],2:[function(require,module,exports){
/* globals VOUINS */
window.VOUINS = window.VOUINS || {};

// v102 multi-lang support
VOUINS.ootbLabelMap = {
    'Step': ['previousLabel', 'nextLabel', 'cancelLabel', 'saveLabel', 'completeLabel',
        'cancelMessage', 'saveMessage', 'completeMessage', 'instructionKey', 'chartLabel', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Text Block': ['textKey'],
    'Headline': ['labelKey'],
    'Submit': ['summaryLabel', 'submitLabel', 'reviseLabel','errorMessage:custom|n:message', 'errorMessage:default'],
    'DataRaptor Extract Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'redirectNextLabel', 'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 
        'postMessage', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Remote Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel',
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Rest Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel',
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'DataRaptor Post Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'redirectNextLabel', 'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 
        'postMessage', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Post to Object Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel',
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Done Action': ['consoleTabLabel', 'errorMessage:custom|n:message', 'errorMessage:default'],
    'Review Action': ['nextLabel', 'previousLabel', 'errorMessage:custom|n:message', 'errorMessage:default'],
    'Filter Block': ['buttonLabel'],
    'Calculation Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel',
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'PDF Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel','redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'DocuSign Envelope Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'DocuSign Signature Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'inProgressMessage', 'failureAbortMessage', 'postMessage', 'errorMessage:custom|n:message', 
        'errorMessage:default'
    ],
    'Type Ahead': ['newItemLabel'],
    'Email Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel','redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'DataRaptor Transform Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'redirectNextLabel', 'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 
        'postMessage', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Matrix Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Integration Procedure Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'redirectNextLabel', 'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 
        'postMessage', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Edit Block': ['newLabel', 'editLabel', 'deleteLabel'],
    'Delete Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'remoteConfirmMsg', 'cancelLabel', 'subLabel'
    ],
    'Validation': ['messages|n:text'],
    'Checkbox': ['checkLabel'],
    'Email': ['ptrnErrText'],
    'Number': ['ptrnErrText'],
    'Password': ['ptrnErrText'],
    'Telephone':['ptrnErrText'],
    'Text': ['ptrnErrText'],
    'Text Area': ['ptrnErrText'],
    'URL':['ptrnErrText'],
    'Disclosure': ['checkLabel','textKey'],
    'Script': ['persistentComponent|n:label', 'consoleTabLabel','errorMessage:custom|n:message'],
    'Radio': ['options|n:value'],
    'Select': ['options|n:value'],
    'Multi-select': ['options|n:value'],
    'Radio Group' : ['options|n:value', 'radioLabels|n:value'],
    'File' : ['errorMessage:custom|n:message', 'errorMessage:default'],
    'Image' : ['errorMessage:custom|n:message', 'errorMessage:default'],
    'Lookup' : ['errorMessage:custom|n:message', 'errorMessage:default']
};

VOUINS.ootbLabelMap2 = ['subLabel','remoteConfirmMsg','cancelLabel'];
VOUINS.actionEleTypesBase = ['Remote Action', 'Rest Action', 'DataRaptor Extract Action', 'DataRaptor Post Action', 'Post to Object Action', 'Review Action', 'Done Action', 'Calculation Action', 'PDF Action', 'Set Values', 'Set Errors', 'DocuSign Envelope Action', 'DocuSign Signature Action', 'Email Action', 'DataRaptor Transform Action', 'Matrix Action', 'Integration Procedure Action'];
VOUINS.actionEleTypes = VOUINS.actionEleTypesBase.concat(['Delete Action']);

VOUINS.picklistEleList = ['Select', 'Multi-select', 'Radio'];

VOUINS.getPropToUpdate = function (prop, tokenList) {
    'use strict';
    for (var ind = 0; ind < tokenList.length - 1; ind++) {
        if (tokenList[ind].indexOf('|n') >= 0) {
            tokenList[ind] = tokenList[ind].slice(0, tokenList[ind].length - 2);
        }
        var buildupArray = [];
        if(!prop) return null; //property does not exist in object
        if (Array.isArray(prop)) {
            for (var j = 0; j < prop.length; j++) {
                prop[j] = prop[j][tokenList[ind]];
                if (Array.isArray(prop[j])) {
                    for (var k = 0; k < prop[j].length; k++) {
                        buildupArray.push(prop[j][k]);
                    }
                }
            }
        } else {
            if(prop) {
                prop = prop[tokenList[ind]];
            }
            if (Array.isArray(prop)) {
                for (var l = 0; l < prop.length; l++) {
                    buildupArray.push(prop[l]);
                }
            }
        }
        if (buildupArray.length > 0) {
            prop = buildupArray;
        }
    }
    return prop;
};

/*

Input
    prop : any object
    tokenstr : path syntax used such as :   abc|n:efg
               where abc is a key of the prop object, 
               abc's key is associated with a value of type array (hence the |n)
               n is a digit >= 0
               efg is a property of the object contained inside the array

Output
    pathList : an array of object paths that match the pathStr
*/
VOUINS.createPropPaths = function (prop, pathStr) {
    'use strict';
    var path = "";
    var pathList = [];

    if(typeof pathStr !== "string") return pathList;

    // swap n with regex \d to match digits
    pathStr = pathStr.replace(/[|]n/g,'|\\d');
    // escape the pipe to prevent false positive matches
    pathStr = pathStr.replace(/[|]/g,'\[\|\]');
    var pathStrRegex = new RegExp('^' + pathStr + '$');

    var flatten = function(prop, path) {
        if(!prop)
            return path;

        var keys = Object.keys(prop);
        for(var i = 0; i < keys.length; i++) {
            if(typeof prop[keys[i]] === "object") {
                var symbol = Array.isArray(prop[keys[i]]) ? "|" : ":";
                flatten(prop[keys[i]], path + keys[i] + symbol);
            }
            else {
                var pathFlat = path + keys[i];
                if(pathStrRegex.test(pathFlat)) {
                    pathList.push(pathFlat);
                }
            }
        }

    }

    flatten(prop, path);

    return pathList;
}

},{}],3:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('datasourceProperty', {
            templateUrl: 'propertysets/datasource.tpl.html',
            controller: DataSourcePropertyController,
            controllerAs: 'vm',
            bindings: {
                datasource: '<',
                scriptElement: '<'
            }
        });

    DataSourcePropertyController.$inject = ['remoteActions','sObjectService','propCompUtil'];
    function DataSourcePropertyController(remoteActions, sObjectService, propCompUtil) {
        var vm = this;
        propCompUtil.baseConstructor.apply(vm);

        vm.$onInit = function() {
            loadFieldsForExistingData();
        };

        function loadFieldsForExistingData() {
            if (vm.datasource && vm.datasource.mapItems && vm.datasource.mapItems.phase1MapItems) {
                if (vm.sobjectTypes) {
                    vm.datasource.mapItems.phase1MapItems.forEach(function(object) {
                        vm.loadFieldsFor(object.InterfaceObjectName__c);
                    });
                }
            }
        }

        vm.filterOptions = [
            '=', '<', '>', '<=', '>=',
            'LIKE', 'NOT LIKE', '<>', 'INCLUDES', 'EXCLUDES'
        ];
        vm.allFieldsForObjects = {};

        sObjectService.getSObjects().then(function (allObjects) {
            vm.sobjectTypes = allObjects;
            loadFieldsForExistingData();
            if (vm.sobjectTypes.length > 0) {
                vm.loadFieldsFor(vm.sobjectTypes[0].name);
            }
        });

        vm.loadFieldsFor = function (object) {
            remoteActions.getFieldsForObject(object).then(function (fields) {
                vm.allFieldsForObjects[object] = fields;
            });
        };

        vm.addNewInputParameter = function(inputParamArray) {
            inputParamArray.push({
                'inputParam': '',
                'element': ''
            });
        };

        vm.getAllFieldsForObjects = function (obj) {
            if (vm.allFieldsForObjects[obj]) {
                return Object.keys(vm.allFieldsForObjects[obj]);
            }
            return [];
        };

        vm.deleteInputParameter = function (inputParam, inputParamArray) {
            inputParamArray.splice(inputParamArray.indexOf(inputParam), 1);
        };

        vm.addNewMapping = function (mappingArray) {
            mappingArray.push({
                'InterfaceObjectLookupOrder__c': 1,
                'InterfaceObjectName__c': '',
                'DomainObjectFieldAPIName__c': '',
                'FilterValue__c': '',
                'InterfaceFieldAPIName__c': '',
                'FilterOperator__c': '='
            });
        };

        vm.deleteMapping = function (mapping, mappingArray) {
            mappingArray.splice(mappingArray.indexOf(mapping), 1);
            if (mappingArray.length === 0) {
                vm.addNewMapping(mappingArray);
            }
        };
    }
})();

},{}],4:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('dataraptorSelect', {
            templateUrl: 'propertysets/dataraptorselect.tpl.html',
            controller: DataraptorSelectPropertyController,
            require: {
                ngModel: "ngModel"
            },
            controllerAs: 'vm',
            bindings: {
                scriptElement: '<',
                ngDisabled: '<',
                type: '@',
                inputType: '@',
                outputType: '@',
                includeInputJson: '@',
                idPrefix: '@',
                mode: '@'
            }
        });

    DataraptorSelectPropertyController.$inject = ['dataraptorBundleService', '$q', 'remoteActions', '$dataraptor'];

    function DataraptorSelectPropertyController(dataraptorBundleService, $q, remoteActions, $dataraptor) {
        var vm = this;

        vm.$onInit = function () {
            var ngModel = vm.ngModel;
            ngModel.$viewChangeListeners.push(onChange);
            ngModel.$render = onChange;
        };

        vm.$onChanges = function (changes) {
            vm.modelValue = vm.ngModel.$modelValue;
        }

        function onChange() {
            vm.modelValue = vm.ngModel.$modelValue;
        }

        vm.updateParentModel = function () {
            if (vm.modelValue !== '+ Create New DataRaptor') {
                vm.ngModel.$setViewValue(vm.modelValue);
                return;
            }

            createNewDataRaptor(vm.ngModel.$modelValue);
        };

        vm.openDR = function ($event) {
            vm.loading = true;
            getMatchingDRBundles(vm.modelValue, vm.type)
                .then(function (bundles) {
                    var bundle = bundles.find(function (bundle) {
                        return bundle.Name === vm.modelValue;
                    });
                    if (!bundle) {
                        alert('Dataraptor named "' + vm.modelValue + '" does not exist in this org.');
                        vm.loading = false;
                        return;
                    }
                    var id = bundle;
                    doWindowOpen('/apex/' + window.ns + 'DRMapper?id=' + bundle.Id, $event);
                    vm.loading = false;
                })
                .catch(function (error) {
                    vm.loading = false;
                });
        }

        function doWindowOpen(url, $event) {
            window.vlocityOpenUrl(url, $event, true);
        }

        vm.handleBlur = function (value) {
            if (vm.drBundles) {
                var match;
                vm.drBundles.forEach(function (item) {
                    if (item.Name === value) {
                        match = item;
                    }
                });
                if (match) {
                    vm.ngModel.$setViewValue(value);
                } else {
                    vm.ngModel.$setViewValue(null);
                }
            }
        }

        vm.getBundles = function (value) {
            vm.loading = true;
            return getMatchingDRBundles(value, vm.type)
                .then(function (results) {
                    vm.loading = false;
                    vm.drBundles = results;
                    if (vm.drBundles)
                    return results.concat({
                        Name: '+ Create New DataRaptor',
                        Id: '+ Create New DataRaptor'
                    });
                })
                .catch(function (error) {
                    vm.loading = false;
                    throw error;
                });
        };

        function getMatchingDRBundles(value, type) {
            var requiredTypes = type ? [type] : [];
            if (type === 'Extract') {
                requiredTypes.push('Extract (JSON)');
            } else if (type === 'Turbo Extract') {
                requiredTypes.push('Turbo Extract');
            } else if (type === 'Load') {
                requiredTypes.push('Load (JSON)');
            }

            return dataraptorBundleService.getMatchingDRBundles(value, requiredTypes);
        }

        function createNewDataRaptor(originalValue) {
            var newName = prompt('Please enter a new name for the DataRaptor interface', '');
            if (newName === '' && !isSafari()) {
                alert('Please enter a Name');
                createNewDataRaptor(originalValue);
            } else if (!/^[a-zA-Z0-9\s-_]+$/.test(newName) && newName && newName.length > 0) {
                alert('This interface name can only contain letters, numbers and spaces. Please choose a different name.');
                createNewDataRaptor(originalValue);
                return;
            } else if (newName !== null && !(newName === '' && isSafari())) {
                vm.loading = true;
                // ensure drbundle doesn't exist
                getMatchingDRBundles(newName, null)
                    .then(function (bundles) {
                        var found = false;
                        bundles.forEach(function (bundle) {
                            found = (found || bundle.Name == newName);
                            if (found) {
                                return false;
                            }
                        });
                        if (found) {
                            alert('This name is already in use. Please enter a different name');
                            createNewDataRaptor(originalValue);
                            vm.loading = false;
                            return;
                        }
                        var prePromise = $q.when(null);
                        if (vm.includeInputJson) {
                            prePromise = remoteActions.viewFullDataJson(vm.scriptElement.Id)
                                .then(function (omniScriptResult) {
                                    return omniScriptResult.replace(/&quot;/g, '"');
                                });
                        }

                        prePromise.then(function (json) {
                            return $dataraptor.createNewBundle({
                                'Name': newName,
                                'DRMapName__c': newName,
                                'Type__c': vm.type,
                                'InterfaceObject__c': 'json',
                                'InputJson__c': json,
                                'InputType__c': vm.inputType || 'JSON',
                                'OutputType__c': vm.outputType || 'JSON'
                            });
                        }).then(function (bundle) {
                            vm.ngModel.$setViewValue(newName);
                            vm.modelValue = newName;
                            vm.openDR(null);
                            vm.loading = false;
                            return bundle;
                        })
                        .catch(function (error) {
                            vm.loading = false;
                        })
                    });
            } else {
                vm.ngModel.$setViewValue(originalValue);
                vm.modelValue = originalValue;
            }
        }

    }
})();

},{}],5:[function(require,module,exports){
var htmlEncodeDecode = require('../../oui/util/HtmlEncodeDecode.js');
var idFunction = require('../../oui/util/generateId.js');

(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('omniscriptPropertySet', {
            templateUrl: 'propertysets/omniscript.tpl.html',
            controller: OmniScriptPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "persistentComponent": [{
            "render": false,
            "label": "",
            "remoteClass": "",
            "remoteMethod": "",
            "remoteTimeout": 30000,
            "remoteOptions": {
                "preTransformBundle": "",
                "postTransformBundle": ""
            },
            "preTransformBundle": "",
            "postTransformBundle": "",
            "sendJSONPath": "",
            "sendJSONNode": "",
            "responseJSONPath": "",
            "responseJSONNode": "",
            "id": "vlcCart",
            "itemsKey": "cartItems",
            "modalConfigurationSetting": {
                "modalHTMLTemplateId": "vlcProductConfig.html",
                "modalController": "ModalProductCtrl",
                "modalSize": "lg"
            }
        }, {
            "render": false,
            "label": "",
            "remoteClass": "",
            "remoteMethod": "",
            "remoteTimeout": 30000,
            "remoteOptions": {
                "preTransformBundle": "",
                "postTransformBundle": ""
            },
            "preTransformBundle": "",
            "postTransformBundle": "",
            "id": "vlcKnowledge",
            "itemsKey": "knowledgeItems",
            "modalConfigurationSetting": {
                "modalHTMLTemplateId": "",
                "modalController": "",
                "modalSize": "lg"
            }
        }],
        "allowSaveForLater": true,
        "saveNameTemplate": null,
        "saveExpireInDays": null,
        "saveForLaterRedirectPageName": "sflRedirect",
        "saveForLaterRedirectTemplateUrl": "vlcSaveForLaterAcknowledge.html",
        "saveContentEncoded": false,
        "saveObjectId": "%ContextId%",
        "saveURLPatterns": {},
        "autoSaveOnStepNext": false,
        "elementTypeToHTMLTemplateMapping": {},
        "seedDataJSON": {},
        "trackingCustomData": {},
        "enableKnowledge": false,
        "bLK": false,
        "lkObjName": null,
        "knowledgeArticleTypeQueryFieldsMap": {},
        "timeTracking": false,
        "hideStepChart": false,
        "visualforcePagesAvailableInPreview": {},
        "cancelType": "SObject",
        "allowCancel": true,
        "cancelSource": "%ContextId%",
        "cancelRedirectPageName": "OmniScriptCancelled",
        "cancelRedirectTemplateUrl": "vlcCancelled.html",
        "consoleTabLabel": "New",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "autoFocus": false,
        "currencyCode": "",
        "showInputWidth": false,
        "rtpSeed": false,
        "consoleTabTitle": null,
        "consoleTabIcon": "custom:custom18",
        "errorMessage": {
            "custom": []
        },
        "disableUnloadWarn": true,
        "stylesheet": {
            "newport": "",
            "lightning": ""
        }
    };

    OmniScriptPropertySetController.$inject = [
        'propCompUtil', '$rootScope', '$scope', '$sldsModal', '$localizable', 'save',
        'LanguagesJson', 'ScriptElementTypes', 'AvailableScriptTypesInit', '$injector'
    ];

    function OmniScriptPropertySetController(propCompUtil, $rootScope, $scope, $sldsModal, $localizable, save, LanguagesJson, ScriptElementTypes, AvailableScriptTypesInit, $injector) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.types = [];
        vm.subtypes = [];
        vm.languages = [];
        vm.persistentComponentActiveTab = 0;
        vm.customJSLabel = "<div>Enter custom JavaScript that is run, or available, when an OmniScript initializes. <br /><br />In the JavaScript, the current \"scope\" of the OmniScript is available at <br /><strong>baseCtrl.prototype.$scope</strong>. <br/>New functions can be added to the AngularJS controller by adding them to the scope, for example: <br/><br /><strong>baseCtrl.prototype.$scope<br />.newfunction = <br />function() { //code goes here};</strong><br/><br /> The current data of the OmniScript can be referenced at <br /><strong>baseCtrl.prototype.$scope.bpTree.response</strong>.</div>";

        addTypes(ScriptElementTypes, vm.types);
        // Load from Existing Scripts
        addTypes(AvailableScriptTypesInit, vm.types);

        $scope.componentTag = '';
        $scope.componentTagClass = '';
        $rootScope.$watchGroup(['scriptElement.IsLwcEnabled__c', 'scriptElement.Type__c', 'scriptElement.SubType__c'], function () {
            setComponentTag();
        });

        function setComponentTag() {
            if ($rootScope.scriptElement.IsLwcEnabled__c) {
                let tag = '',
                    tagClass = '';

                const compilerService = $injector.get('compilerService'),
                    type = $rootScope.scriptElement.Type__c,
                    subType = $rootScope.scriptElement.SubType__c,
                    language = $rootScope.scriptElement.Language__c;

                compilerService.hasLwcErrors(type, subType, language)
                    .then(validLwc => {
                        if (validLwc.length === 0) {
                            const lwcName = compilerService.getLwcName(type, subType, language);

                            const cTag = compilerService.getComponentTag(lwcName);
                            tag = `The component tag is <${cTag}></${cTag}>`;
                        } else {
                            tag = validLwc.join(' ');
                            tagClass = 'tag-error';
                        }

                        $scope.componentTagClass = tagClass;
                        $scope.componentTag = tag;
                    });
            }
        }

        function addTypes(types, target) {
            delete types['null'];
            delete types[''];
            var i = -1;
            Object.keys(types).forEach(function (property) {
                i = target.findIndex(equalsLabel, property);
                if (i == -1) {
                    i = target.length;
                    target[i] = {
                        label: htmlEncodeDecode.unescapeHTML(property),
                        value: htmlEncodeDecode.unescapeHTML(property),
                        $$subTypes: []
                    };
                }
                for (var y = 0; y < types[property].length; y++) {
                    types[property][y] = htmlEncodeDecode.unescapeHTML(types[property][y]);
                    if (target[i].$$subTypes.findIndex(equalsLabel, types[property][y]) === -1, types[property][y]) {
                        target[i].$$subTypes.push({
                            label: types[property][y],
                            value: types[property][y]
                        });
                    }
                }
                target[i].$$subTypes.sort(compareLabels);
            });
            target.sort(compareLabels);
        }

        function equalsLabel(a) {
            var label = typeof a == "string" ? a : a.label;
            return this && label == this || (typeof label == 'string' && typeof this == 'string' && label.trim() == this.trim());
        }

        function compareLabels(a, b) {
            return String(a.label).localeCompare(b.value);
        }

        function fillSubTypes() {
            var matchingType = vm.types.find(function (type) {
                return type.value === vm.element.Type__c;
            });
            vm.subtypes = matchingType ? matchingType.$$subTypes : [];
        };

        vm.$onInit = function () {
            vm.languagesMap = LanguagesJson;
            vm.currentLanguage = vm.element.Language__c;

            $scope.$watch('vm.element.Language__c', function (newLanguage) {
                vm.currentLanguage = vm.element.Language__c;
            });

            vm.element.PropertySet__c = Object.assign({}, _.cloneDeep(DEFAULT_PROP_SET), vm.element.PropertySet__c);

            $scope.$emit('customViewUpdated', vm.element.PropertySet__c.visualforcePagesAvailableInPreview);

            $scope.$watch('vm.element.PropertySet__c.visualforcePagesAvailableInPreview', function () {
                $scope.$emit('customViewUpdated', vm.element.PropertySet__c.visualforcePagesAvailableInPreview);
            }, true);

            fillSubTypes();
        };

        vm.handleTypeChange = function () {
            fillSubTypes();
            vm.element.SubType__c = null;
        }

        vm.handleLanguageChange = function () {
            if (vm.currentLanguage !== 'Multi-Language' || !vm.scriptElement.Id) {
                vm.element.Language__c = vm.currentLanguage;
                return;
            }

            // handle if Multi-Language and show translation dialog
            if (!vm.currentModal && vm.scriptElement.Id) {
                // reset because we won't accept the change until the user saves in the modal
                vm.currentLanguage = vm.element.Language__c;
                // show the new modal
                var modalScope = $scope.$new();
                modalScope.cancel = function () {
                    modalScope.hide();
                };
                modalScope.doSave = function () {
                    modalScope.$hide();
                };
                modalScope.convertToNewMultiLang = true;
                vm.currentModal = $sldsModal({
                    title: $localizable('OmniCustomTranslation', 'Translate Your OmniScript'),
                    backdrop: 'static',
                    templateUrl: 'omniTranslateModal.tpl.html',
                    scope: modalScope,
                    onHide: function () {
                        vm.currentModal = null;
                    },
                    show: true
                });
            }
        };

        vm.editCustomLabels = function () {
            if (!vm.currentModal) {
                var modalScope = $scope.$new();

                modalScope.cancel = function () {
                    vm.currentModal.hide();
                };
                modalScope.doSave = function () {
                    vm.currentModal.hide();
                };
                vm.currentModal = $sldsModal({
                    title: $localizable('OmniCustomTranslation', 'Translate Your OmniScript'),
                    backdrop: 'static',
                    templateUrl: 'omniTranslateModal.tpl.html',
                    scope: modalScope,
                    onHide: function () {
                        vm.currentModal = null;
                    },
                    show: true
                });
            }
        };

        vm.addPersistentComponent = function (index) {
            if (!vm.scriptElement.IsActive__c) {
                var persistentProperty = newPersistentProperty();
                vm.element.PropertySet__c.persistentComponent.push(persistentProperty);
                vm.element.each(function (element) {
                    if (element.PropertySet__c.showPersistentComponent) {
                        element.PropertySet__c.showPersistentComponent[persistentProperty.id] = false;
                        save(element);
                    }
                });
                vm.persistentComponentActiveTab = vm.element.PropertySet__c.persistentComponent.length - 1;
            }
        };

        vm.removePersistentComponent = function (index) {
            vm.persistentComponentActiveTab = index - 1 < 0 ? 0 : index - 1;
            var oldProp = vm.element.PropertySet__c.persistentComponent.splice(index, 1);
            // we also need to delay the matching property on every child element
            vm.element.each(function (element) {
                if (element.PropertySet__c.showPersistentComponent) {
                    delete element.PropertySet__c.showPersistentComponent[oldProp.id];
                    save(element);
                }
            });
        };

        function newPersistentProperty() {
            return {
                "render": false,
                "label": null,
                "remoteClass": "",
                "remoteMethod": "",
                "remoteTimeout": 30000,
                "remoteOptions": {
                    "preTransformBundle": "",
                    "postTransformBundle": ""
                },
                "preTransformBundle": "",
                "postTransformBundle": "",
                "sendJSONPath": "",
                "sendJSONNode": "",
                "responseJSONPath": "",
                "responseJSONNode": "",
                "id": idFunction('New'),
                "itemsKey": "",
                "modalConfigurationSetting": {
                    "modalHTMLTemplateId": "",
                    "modalController": "",
                    "modalSize": ""
                }
            };
        }

        // taken from https://help.salesforce.com/articleView?id=admin_supported_currencies.htm&type=5
        vm.currencies = [{
            "label": "",
            "code": ""
        }, {
            "label": "UAE Dirham (AED)",
            "code": "AED"
        }, {
            "label": "Afghanistan Afghani (New) (AFN)",
            "code": "AFN"
        }, {
            "label": "Albanian Lek (ALL)",
            "code": "ALL"
        }, {
            "label": "Armenian Dram (AMD)",
            "code": "AMD"
        }, {
            "label": "Neth Antilles Guilder (ANG)",
            "code": "ANG"
        }, {
            "label": "Angola Kwanza (AOA)",
            "code": "AOA"
        }, {
            "label": "Argentine Peso (ARS)",
            "code": "ARS"
        }, {
            "label": "Australian Dollar (AUD)",
            "code": "AUD"
        }, {
            "label": "Aruba Florin (AWG)",
            "code": "AWG"
        }, {
            "label": "Azerbaijanian New Manat (AZN)",
            "code": "AZN"
        }, {
            "label": "Convertible Marks (BAM)",
            "code": "BAM"
        }, {
            "label": "Barbados Dollar (BBD)",
            "code": "BBD"
        }, {
            "label": "Bangladesh Taka (BDT)",
            "code": "BDT"
        }, {
            "label": "Bulgaria Lev (BGN)",
            "code": "BGN"
        }, {
            "label": "Bahraini Dinar (BHD)",
            "code": "BHD"
        }, {
            "label": "Burundi Franc (BIF)",
            "code": "BIF"
        }, {
            "label": "Bermuda Dollar (BMD)",
            "code": "BMD"
        }, {
            "label": "Brunei Dollar (BND)",
            "code": "BND"
        }, {
            "label": "Bolivian Boliviano (BOB)",
            "code": "BOB"
        }, {
            "label": "Bolivia Mvdol (BOV)",
            "code": "BOV"
        }, {
            "label": "Brazilian Cruzeiro (old) (BRB)",
            "code": "BRB"
        }, {
            "label": "Brazilian Real (BRL)",
            "code": "BRL"
        }, {
            "label": "Bahamian Dollar (BSD)",
            "code": "BSD"
        }, {
            "label": "Bhutan Ngultrum (BTN)",
            "code": "BTN"
        }, {
            "label": "Botswana Pula (BWP)",
            "code": "BWP"
        }, {
            "label": "Belarussian Ruble (BYN)",
            "code": "BYN"
        }, {
            "label": "Belize Dollar (BZD)",
            "code": "BZD"
        }, {
            "label": "Canadian Dollar (CAD)",
            "code": "CAD"
        }, {
            "label": "Franc Congolais (CDF)",
            "code": "CDF"
        }, {
            "label": "Swiss Franc (CHF)",
            "code": "CHF"
        }, {
            "label": "Unidades de fomento (CLF)",
            "code": "CLF"
        }, {
            "label": "Chilean Peso (CLP)",
            "code": "CLP"
        }, {
            "label": "Chinese Yuan (CNY)",
            "code": "CNY"
        }, {
            "label": "Colombian Peso (COP)",
            "code": "COP"
        }, {
            "label": "Costa Rica Colon (CRC)",
            "code": "CRC"
        }, {
            "label": "Cuban Peso (CUP)",
            "code": "CUP"
        }, {
            "label": "Cape Verde Escudo (CVE)",
            "code": "CVE"
        }, {
            "label": "Czech Koruna (CZK)",
            "code": "CZK"
        }, {
            "label": "Dijibouti Franc (DJF)",
            "code": "DJF"
        }, {
            "label": "Danish Krone (DKK)",
            "code": "DKK"
        }, {
            "label": "Dominican Peso (DOP)",
            "code": "DOP"
        }, {
            "label": "Algerian Dinar (DZD)",
            "code": "DZD"
        }, {
            "label": "Estonian Kroon (EEK)",
            "code": "EEK"
        }, {
            "label": "Egyptian Pound (EGP)",
            "code": "EGP"
        }, {
            "label": "Eritrea Nakfa (ERN)",
            "code": "ERN"
        }, {
            "label": "Ethiopian Birr (ETB)",
            "code": "ETB"
        }, {
            "label": "Euro (EUR)",
            "code": "EUR"
        }, {
            "label": "Fiji Dollar (FJD)",
            "code": "FJD"
        }, {
            "label": "Falkland Islands Pound (FKP)",
            "code": "FKP"
        }, {
            "label": "British Pound (GBP)",
            "code": "GBP"
        }, {
            "label": "Georgia Lari (GEL)",
            "code": "GEL"
        }, {
            "label": "Ghanian Cedi (GHS)",
            "code": "GHS"
        }, {
            "label": "Gibraltar Pound (GIP)",
            "code": "GIP"
        }, {
            "label": "Gambian Dalasi (GMD)",
            "code": "GMD"
        }, {
            "label": "Guinea Franc (GNF)",
            "code": "GNF"
        }, {
            "label": "Guatemala Quetzal (GTQ)",
            "code": "GTQ"
        }, {
            "label": "Guyana Dollar (GYD)",
            "code": "GYD"
        }, {
            "label": "Hong Kong Dollar (HKD)",
            "code": "HKD"
        }, {
            "label": "Honduras Lempira (HNL)",
            "code": "HNL"
        }, {
            "label": "Croatian Kuna (HRK)",
            "code": "HRK"
        }, {
            "label": "Haiti Gourde (HTG)",
            "code": "HTG"
        }, {
            "label": "Hungarian Forint (HUF)",
            "code": "HUF"
        }, {
            "label": "Indonesian Rupiah (IDR)",
            "code": "IDR"
        }, {
            "label": "Israeli Shekel (ILS)",
            "code": "ILS"
        }, {
            "label": "Indian Rupee (INR)",
            "code": "INR"
        }, {
            "label": "Iraqi Dinar (IQD)",
            "code": "IQD"
        }, {
            "label": "Iranian Rial (IRR)",
            "code": "IRR"
        }, {
            "label": "Iceland Krona (ISK)",
            "code": "ISK"
        }, {
            "label": "Jamaican Dollar (JMD)",
            "code": "JMD"
        }, {
            "label": "Jordanian Dinar (JOD)",
            "code": "JOD"
        }, {
            "label": "Japanese Yen (JPY)",
            "code": "JPY"
        }, {
            "label": "Kenyan Shilling (KES)",
            "code": "KES"
        }, {
            "label": "Kyrgyzstan Som (KGS)",
            "code": "KGS"
        }, {
            "label": "Cambodia Riel (KHR)",
            "code": "KHR"
        }, {
            "label": "Comoros Franc (KMF)",
            "code": "KMF"
        }, {
            "label": "North Korean Won (KPW)",
            "code": "KPW"
        }, {
            "label": "Korean Won (KRW)",
            "code": "KRW"
        }, {
            "label": "Kuwaiti Dinar (KWD)",
            "code": "KWD"
        }, {
            "label": "Cayman Islands Dollar (KYD)",
            "code": "KYD"
        }, {
            "label": "Kazakhstan Tenge (KZT)",
            "code": "KZT"
        }, {
            "label": "Lao Kip (LAK)",
            "code": "LAK"
        }, {
            "label": "Lebanese Pound (LBP)",
            "code": "LBP"
        }, {
            "label": "Sri Lanka Rupee (LKR)",
            "code": "LKR"
        }, {
            "label": "Liberian Dollar (LRD)",
            "code": "LRD"
        }, {
            "label": "Lesotho Loti (LSL)",
            "code": "LSL"
        }, {
            "label": "Libyan Dinar (LYD)",
            "code": "LYD"
        }, {
            "label": "Moroccan Dirham (MAD)",
            "code": "MAD"
        }, {
            "label": "Moldovan Leu (MDL)",
            "code": "MDL"
        }, {
            "label": "Malagasy Ariary (MGA)",
            "code": "MGA"
        }, {
            "label": "Macedonian Denar (MKD)",
            "code": "MKD"
        }, {
            "label": "Myanmar Kyat (MMK)",
            "code": "MMK"
        }, {
            "label": "Mongolian Tugrik (MNT)",
            "code": "MNT"
        }, {
            "label": "Macau Pataca (MOP)",
            "code": "MOP"
        }, {
            "label": "Mauritania Ouguiya (MRU)",
            "code": "MRU"
        }, {
            "label": "Mauritius Rupee (MUR)",
            "code": "MUR"
        }, {
            "label": "Maldives Rufiyaa (MVR)",
            "code": "MVR"
        }, {
            "label": "Malawi Kwacha (MWK)",
            "code": "MWK"
        }, {
            "label": "Mexican Peso (MXN)",
            "code": "MXN"
        }, {
            "label": "Mexican Unidad de Inversion (UDI) (MXV)",
            "code": "MXV"
        }, {
            "label": "Malaysian Ringgit (MYR)",
            "code": "MYR"
        }, {
            "label": "Mozambique New Metical (MZN)",
            "code": "MZN"
        }, {
            "label": "Namibian Dollar (NAD)",
            "code": "NAD"
        }, {
            "label": "Nigerian Naira (NGN)",
            "code": "NGN"
        }, {
            "label": "Nicaragua Cordoba (NIO)",
            "code": "NIO"
        }, {
            "label": "Norwegian Krone (NOK)",
            "code": "NOK"
        }, {
            "label": "Nepalese Rupee (NPR)",
            "code": "NPR"
        }, {
            "label": "New Zealand Dollar (NZD)",
            "code": "NZD"
        }, {
            "label": "Omani Rial (OMR)",
            "code": "OMR"
        }, {
            "label": "Panama Balboa (PAB)",
            "code": "PAB"
        }, {
            "label": "Peruvian Sol (PEN)",
            "code": "PEN"
        }, {
            "label": "Papua New Guinea Kina (PGK)",
            "code": "PGK"
        }, {
            "label": "Philippine Peso (PHP)",
            "code": "PHP"
        }, {
            "label": "Pakistani Rupee (PKR)",
            "code": "PKR"
        }, {
            "label": "Polish Zloty (PLN)",
            "code": "PLN"
        }, {
            "label": "Paraguayan Guarani (PYG)",
            "code": "PYG"
        }, {
            "label": "Qatar Rial (QAR)",
            "code": "QAR"
        }, {
            "label": "Romanian Leu (New) (RON)",
            "code": "RON"
        }, {
            "label": "Serbian Dinar (RSD)",
            "code": "RSD"
        }, {
            "label": "Russian Rouble (RUB)",
            "code": "RUB"
        }, {
            "label": "Rwanda Franc (RWF)",
            "code": "RWF"
        }, {
            "label": "Saudi Arabian Riyal (SAR)",
            "code": "SAR"
        }, {
            "label": "Solomon Islands Dollar (SBD)",
            "code": "SBD"
        }, {
            "label": "Seychelles Rupee (SCR)",
            "code": "SCR"
        }, {
            "label": "Sudanese Pound (SDG)",
            "code": "SDG"
        }, {
            "label": "Swedish Krona (SEK)",
            "code": "SEK"
        }, {
            "label": "Singapore Dollar (SGD)",
            "code": "SGD"
        }, {
            "label": "St Helena Pound (SHP)",
            "code": "SHP"
        }, {
            "label": "Sierra Leone Leone (SLL)",
            "code": "SLL"
        }, {
            "label": "Somali Shilling (SOS)",
            "code": "SOS"
        }, {
            "label": "Surinam Dollar (SRD)",
            "code": "SRD"
        }, {
            "label": "South Sudan Pound (SSP)",
            "code": "SSP"
        }, {
            "label": "Sao Tome Dobra (STD)",
            "code": "STD"
        }, {
            "label": "Syrian Pound (SYP)",
            "code": "SYP"
        }, {
            "label": "Swaziland Lilageni (SZL)",
            "code": "SZL"
        }, {
            "label": "Thai Baht (THB)",
            "code": "THB"
        }, {
            "label": "Tajik Somoni (TJS)",
            "code": "TJS"
        }, {
            "label": "Turkmenistan New Manat (TMT)",
            "code": "TMT"
        }, {
            "label": "Tunisian Dinar (TND)",
            "code": "TND"
        }, {
            "label": "Tonga Pa'anga (TOP)",
            "code": "TOP"
        }, {
            "label": "Turkish Lira (New) (TRY)",
            "code": "TRY"
        }, {
            "label": "Trinidad&Tobago Dollar (TTD)",
            "code": "TTD"
        }, {
            "label": "Taiwan Dollar (TWD)",
            "code": "TWD"
        }, {
            "label": "Tanzanian Shilling (TZS)",
            "code": "TZS"
        }, {
            "label": "Ukraine Hryvnia (UAH)",
            "code": "UAH"
        }, {
            "label": "Ugandan Shilling (UGX)",
            "code": "UGX"
        }, {
            "label": "U.S. Dollar (USD)",
            "code": "USD"
        }, {
            "label": "Uruguayan New Peso (UYU)",
            "code": "UYU"
        }, {
            "label": "Uzbekistan Sum (UZS)",
            "code": "UZS"
        }, {
            "label": "Venezuelan Bolivar Fuerte (VEF)",
            "code": "VEF"
        }, {
            "label": "Venezuelan Bolivar Soberano (VES)",
            "code": "VES"
        }, {
            "label": "Vietnam Dong (VND)",
            "code": "VND"
        }, {
            "label": "Vanuatu Vatu (VUV)",
            "code": "VUV"
        }, {
            "label": "Samoa Tala (WST)",
            "code": "WST"
        }, {
            "label": "CFA Franc (BEAC) (XAF)",
            "code": "XAF"
        }, {
            "label": "East Caribbean Dollar (XCD)",
            "code": "XCD"
        }, {
            "label": "CFA Franc (BCEAO) (XOF)",
            "code": "XOF"
        }, {
            "label": "Pacific Franc (XPF)",
            "code": "XPF"
        }, {
            "label": "Yemen Riyal (YER)",
            "code": "YER"
        }, {
            "label": "South African Rand (ZAR)",
            "code": "ZAR"
        }, {
            "label": "Zambian Kwacha (New) (ZMK)",
            "code": "ZMK"
        }, {
            "label": "Zimbabwe Dollar (ZWL)",
            "code": "ZWL"
        }].sort(function (a, b) {
            var keyA = a.label,
                keyB = b.label;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
    }
})();

},{"../../oui/util/HtmlEncodeDecode.js":136,"../../oui/util/generateId.js":139}],6:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('persistentComponent', {
            templateUrl: 'propertysets/persistentcomponent.tpl.html',
            controller: PersistentComponentPropertyController,
            controllerAs: 'vm',
            bindings: {
                datasource: '<',
                scriptElement: '<',
                persistentComponent: '<',
                idPrefix: '@'
            }
        });

    PersistentComponentPropertyController.$inject = ['save'];
    function PersistentComponentPropertyController(save) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!changes.persistentComponent) {
                return;
            }
            vm.persistentComponentId = vm.persistentComponent.id;
        };

        vm.updatePersistentComponentId = function() {
            var oldId = vm.persistentComponent.id;
            vm.scriptElement.each(function(element) {
                if (element.PropertySet__c && element.PropertySet__c.showPersistentComponent) {
                    var oldValue = element.PropertySet__c.showPersistentComponent[oldId];
                    element.PropertySet__c.showPersistentComponent[oldId] = undefined;
                    element.PropertySet__c.showPersistentComponent[vm.persistentComponentId] = !!oldValue;
                    save(element);
                }
            });
            vm.persistentComponent.id = vm.persistentComponentId;
        };

    }
})();

},{}],7:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('reusableScriptPropertySet', {
            templateUrl: 'propertysets/reusable-script.tpl.html',
            controller: ReusableScriptPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "Type": "",
        "Sub Type": "",
        "Language": "",
        "show": null
    };

    ReusableScriptPropertySetController.$inject = ['propCompUtil', 'remoteActions'];

    function ReusableScriptPropertySetController(propCompUtil, remoteActions) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element || !vm.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        };

        vm.openReusableScript = function ($event) {
            remoteActions.getReusableOmniScripts().then(function(reusableScripts){

                // Getting specification for reusable omniscript
                var spec = {
                    Type__c: vm.element.PropertySet__c.Type,
                    SubType__c: vm.element.PropertySet__c['Sub Type'],
                    Language__c: vm.element.PropertySet__c.Language
                };

                // Adding namespace
                Object.keys(spec).forEach(function(key){
                    spec[window.ns+key]=spec[key];
                    delete spec[key];
                });

                try{
                    var scrpt = reusableScripts.find(function(reusableScript){
                        var keys = Object.keys(spec);
                        for(var i = 0; i < keys.length; i++){
                            var key = keys[i];
                            if(reusableScript[key]!=spec[key]){
                                return false;
                            }
                        }
                        return true;
                    });
                    var id = scrpt.Id;
                    if (!id){
                        throw ('not found'); 
                    }
                    doWindowOpen('/apex/' + window.ns + 'omniscriptdesigner' + (id ? '?id=' + id : ''), $event);
                } catch(e){
                    window.alert('Reusable OmniScript '+vm.element.PropertySet__c.Type+'/'+vm.element.PropertySet__c['Sub Type']+': '+vm.element.PropertySet__c.Language+' not Found.\n');
                }
            });
        };

        function doWindowOpen(url, $event) {
            window.vlocityOpenUrl(url, $event, true);
        }

    }
})();

},{}],8:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('calculationActionPropertySet', {
            templateUrl: 'propertysets/action/calculation-action.tpl.html',
            controller: CalculationActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "remoteClass": fileNsPrefixDot() + "PricingMatrixCalculationService",
        "remoteMethod": "calculate",
        "remoteOptions": {
            "configurationName": "",
            "includeInputs": false,
            "preTransformBundle": "",
            "postTransformBundle": "",
            "matchInputVariables": false
        },
        "remoteTimeout": 30000,
        "preTransformBundle": "",
        "postTransformBundle": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "responseJSONPath": "",
        "responseJSONNode": "",
        "extraPayload": {},
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Step",
        "redirectPageName": "",
        "redirectTemplateUrl": "vlcAcknowledge.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        },
        "enableDefaultAbort": false,
        "enableActionMessage": false,
    }

    CalculationActionPropertySetController.$inject = ['propCompUtil'];
    function CalculationActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],9:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('dataraptorExtractActionPropertySet', {
            templateUrl: 'propertysets/action/dataraptor-extract-action.tpl.html',
            controller: DataraptorExtractActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "bundle": "",
        "dataRaptor Input Parameters": [],
        "remoteTimeout": 30000,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Step",
        "redirectPageName": "",
        "redirectTemplateUrl": "vlcAcknowledge.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        },
        "enableDefaultAbort": false,
        "enableActionMessage": false,
        "ignoreCache": false
    }

    DataraptorExtractActionPropertySetController.$inject = ['propCompUtil'];
    function DataraptorExtractActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        vm.deleteInputParameter = function (inputParam, inputParamArray) {
            inputParamArray.splice(inputParamArray.indexOf(inputParam), 1);
        };

        vm.addNewInputParameter = function (inputParamArray) {
            inputParamArray.push({
                'inputParam': '',
                'element': ''
            });
        };
    }
})();

},{}],10:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('dataraptorPostActionPropertySet', {
            templateUrl: 'propertysets/action/dataraptor-post-action.tpl.html',
            controller: DataraptorPostActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "bundle": "",
        "remoteTimeout": 30000,
        "postTransformBundle": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Submit",
        "redirectPageName": "",
        "redirectTemplateUrl": "vlcAcknowledge.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        },
        "enableDefaultAbort": false,
        "enableActionMessage": false,
    };

    DataraptorPostActionPropertySetController.$inject = ['propCompUtil'];
    function DataraptorPostActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],11:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('dataraptorTransformActionPropertySet', {
            templateUrl: 'propertysets/action/dataraptor-transform-action.tpl.html',
            controller: DataraptorTransformActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "bundle": "",
        "remoteTimeout": 30000,
        "sendJSONPath": "",
        "sendJSONNode": "",
        "responseJSONPath": "",
        "responseJSONNode": "",
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Submit",
        "redirectPageName": "",
        "redirectTemplateUrl": "vlcAcknowledge.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        },
        "enableDefaultAbort": false,
        "enableActionMessage": false,
        "ignoreCache": false
    };

    DataraptorTransformActionPropertySetController.$inject = ['propCompUtil'];
    function DataraptorTransformActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],12:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('deleteActionPropertySet', {
            templateUrl: 'propertysets/action/delete-action.tpl.html',
            controller: DeleteActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "deleteSObject": [],
        "allOrNone": false,
        "deleteFailedMessage": "",
        "entityIsDeletedMessage": "",
        "invalidIdMessage": "",
        "configurationErrorMessage": "",
        "remoteOptions": {},
        "remoteTimeout": 30000,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Step",
        "redirectPageName": "",
        "redirectTemplateUrl": "vlcAcknowledge.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "svgSprite": "",
        "svgIcon": "",
        "confirm": true,
        "subLabel": "Delete",
        "remoteConfirmMsg": "Are you sure? This action cannot be undone.",
        "cancelLabel": "Cancel",
        "label": null,
        "enableDefaultAbort": false,
        "enableActionMessage": false,
    };

    DeleteActionPropertySetController.$inject = ['propCompUtil', 'remoteActions'];
    function DeleteActionPropertySetController(propCompUtil, remoteActions) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        remoteActions.getAllObjects().then(function (allObjects) {
            vm.sobjectTypes = allObjects.sort(function (a, b) {
                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            });
        });

        vm.addDeleteSObjectMap = function () {
            var obj = {
                Type: '',
                Id: '',
                AllOrNone: false
            };
            if (vm.element.PropertySet__c.deleteSObject) {
                vm.element.PropertySet__c.deleteSObject.push(obj);
            }
        };

        vm.deleteDeleteSObjectMap = function (ind) {
            if (vm.element.PropertySet__c.deleteSObject) {
                vm.element.PropertySet__c.deleteSObject.splice(ind, 1);
            }
        };
    }
})();

},{}],13:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('docusignEnvelopeActionPropertySet', {
            templateUrl: 'propertysets/action/docusign-envelope-action.tpl.html',
            controller: DocusignEnvelopeActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "docuSignTemplatesGroup": [],
        "emailSubject": "",
        "emailBody": "",
        "dateFormat": "",
        "dateTimeFormat": "",
        "timeFormat": "",
        "remoteTimeout": 30000,
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Step",
        "redirectPageName": "",
        "redirectTemplateUrl": "vlcAcknowledge.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "label": null,
        "errorMessage": {
            "custom":[],
            "default":null
        },
        "enableDefaultAbort": false,
        "enableActionMessage": false,
    };

    DocusignEnvelopeActionPropertySetController.$inject = ['propCompUtil', 'remoteActions', '$q', 'dataraptorBundleService'];

    function DocusignEnvelopeActionPropertySetController(propCompUtil, remoteActions, $q, dataraptorBundleService) {
        var vm = this;
        vm.nsPrefix = fileNsPrefix();
        vm.templateRolesByTemplate = {};

        getDocusignTemplates();

        vm.getBundles = function (value) {
            return dataraptorBundleService.getMatchingDRBundles(value, ["Transform"]);
        }

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));

            if (vm.element.PropertySet__c.docuSignTemplate) {
                const obj = {
                    docuSignTemplate: vm.element.PropertySet__c.docuSignTemplate,
                    transformBundle: vm.element.PropertySet__c.transformBundle,
                    sendJSONPath: vm.element.PropertySet__c.sendJSONPath,
                    sendJSONNode: vm.element.PropertySet__c.sendJSONNode,
                    signerList: vm.element.PropertySet__c.signerList || [],
                    includeToSend: true
                };
                vm.element.PropertySet__c.docuSignTemplatesGroup.push(obj);
                delete vm.element.PropertySet__c.signerList;
                delete vm.element.PropertySet__c.docuSignTemplate;
                delete vm.element.PropertySet__c.transformBundle;
                delete vm.element.PropertySet__c.sendJSONPath;
                delete vm.element.PropertySet__c.sendJSONNode;
            }
        }

        function getDocusignTemplates() {
            if (vm.docuSignTemplates) {
                return $q.when(vm.docuSignTemplates);
            }
            return remoteActions.loadDocuSignTemplates().then(function (docuSignTemplates) {
                vm.docuSignTemplates = docuSignTemplates;
                vm.docuSignTemplates.forEach(function (template) {
                    var roleArray = angular.fromJson(template[vm.nsPrefix + 'RolesData__c']
                        .replace(/&quot;/g, '"'));
                    vm.templateRolesByTemplate[template[vm.nsPrefix + 'TemplateIdentifier__c']] = roleArray;
                })
                return vm.docuSignTemplates;
            });
        }

        vm.addDocuSignTemplate = function () {
            const obj = {
                docuSignTemplate: "",
                transformBundle: "",
                sendJSONPath: "",
                sendJSONNode: "",
                includeToSend: true,
                signerList: []
            };
            vm.element.PropertySet__c.docuSignTemplatesGroup.push(obj);
        }

        vm.onChangeDocusignTemplate = function (index) {
            if (vm.element.PropertySet__c.docuSignTemplatesGroup[index].signerList) {
                vm.element.PropertySet__c.docuSignTemplatesGroup[index].signerList = [];
                delete vm.element.PropertySet__c.docuSignTemplatesGroup[index].templateRoleName;
            }
        };

        vm.deleteDocuSignTemplate = function (index) {
            vm.element.PropertySet__c.docuSignTemplatesGroup.splice(index, 1);
        };

        vm.addDocuSignSigner = function (index) {
            if (!vm.element.PropertySet__c.docuSignTemplatesGroup[index].signerList) {
                vm.element.PropertySet__c.docuSignTemplatesGroup[index].signerList = [];
            }
            vm.element.PropertySet__c.docuSignTemplatesGroup[index].signerList.push({
                signerName: "",
                signerEmail: "",
                templateRole: "",
                routingOrder: ""
            });
        };

        vm.deleteDocuSignSigner = function (index, parentIndex) {
            vm.element.PropertySet__c
                .docuSignTemplatesGroup[parentIndex].signerList.splice(index, 1);
        };

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],14:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('docusignSignatureActionPropertySet', {
            templateUrl: 'propertysets/action/docusign-signature-action.tpl.html',
            controller: DocusignSignatureActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "docuSignTemplatesGroupSig": [],
        "docuSignReturnUrl": "",
        "signerInformation": {
            "signerName": "",
            "signerEmail": ""
        },
        "emailSubject": "",
        "dateFormat": "",
        "dateTimeFormat": "",
        "timeFormat": "",
        "remoteTimeout": 30000,
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Step",
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        },
    };

    DocusignSignatureActionPropertySetController.$inject = ['propCompUtil', 'remoteActions', '$q', 'dataraptorBundleService'];

    function DocusignSignatureActionPropertySetController(propCompUtil, remoteActions, $q, dataraptorBundleService) {
        var vm = this;
        vm.nsPrefix = fileNsPrefix();
        vm.templateRolesByTemplate = {};

        getDocusignTemplates();

        vm.getBundles = function (value) {
            return dataraptorBundleService.getMatchingDRBundles(value, ["Transform"]);
        }

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));

            if (vm.element.PropertySet__c.docuSignTemplate) {
                const obj = {
                    docuSignTemplate: vm.element.PropertySet__c.docuSignTemplate,
                    transformBundle: vm.element.PropertySet__c.transformBundle,
                    sendJSONPath: vm.element.PropertySet__c.sendJSONPath,
                    sendJSONNode: vm.element.PropertySet__c.sendJSONNode,
                    templateRole: vm.element.PropertySet__c.templateRole,
                    includeToSend: true
                };
                vm.element.PropertySet__c.docuSignTemplatesGroupSig.push(obj);
                delete vm.element.PropertySet__c.templateRole;
                delete vm.element.PropertySet__c.docuSignTemplate;
                delete vm.element.PropertySet__c.transformBundle;
                delete vm.element.PropertySet__c.sendJSONPath;
                delete vm.element.PropertySet__c.sendJSONNode;
            }
        }

        function getDocusignTemplates() {
            if (vm.docuSignTemplates) {
                return $q.when(vm.docuSignTemplates);
            }
            return remoteActions.loadDocuSignTemplates().then(function (docuSignTemplates) {
                vm.docuSignTemplates = docuSignTemplates;
                vm.docuSignTemplates.forEach(function (template) {
                    var roleArray = angular.fromJson(template[vm.nsPrefix + 'RolesData__c']
                        .replace(/&quot;/g, '"'));
                    vm.templateRolesByTemplate[template[vm.nsPrefix + 'TemplateIdentifier__c']] = roleArray;
                });
                return vm.docuSignTemplates
            });
        }

        vm.addDocuSignTemplate = function () {
            const obj = {
                docuSignTemplate: "",
                transformBundle: "",
                sendJSONPath: "",
                sendJSONNode: "",
                includeToSend: true,
                templateRole: ""
            };
            vm.element.PropertySet__c.docuSignTemplatesGroupSig.push(obj);
        }

        vm.onChangeDocusignTemplate = function (index) {
            vm.element.PropertySet__c.docuSignTemplatesGroupSig[index].templateRole = null;
            delete vm.element.PropertySet__c.docuSignTemplatesGroupSig[index].templateRoleName;
        };

        vm.deleteDocuSignTemplate = function (index) {
            vm.element.PropertySet__c.docuSignTemplatesGroupSig.splice(index, 1);
        };

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],15:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('doneActionPropertySet', {
            templateUrl: 'propertysets/action/done-action.tpl.html',
            controller: DoneActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "type": "SObject",
        "source": "%ContextId%",
        "consoleTabLabel": "New",
        "validationRequired": "Submit",
        "redirectPageName": "mobileDone",
        "redirectTemplateUrl": "vlcMobileConfirmation.html",
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "Outcome": "",
        "label": null
    };

    DoneActionPropertySetController.$inject = ['propCompUtil'];
    function DoneActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],16:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('emailActionPropertySet', {
            templateUrl: 'propertysets/action/email-action.tpl.html',
            controller: EmailActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "useTemplate": true,
        "emailTemplateInformation": {
            "emailTemplateName": "",
            "emailTargetObjectId": "",
            "saveAsActivity": false,
            "whatId": ""
        },
        "emailInformation": {
            "toAddressList": [],
            "ccAddressList": [],
            "bccAddressList": [],
            "emailSubject": "",
            "emailBody": "",
            "setHtmlBody": false
        },
        "OrgWideEmailAddress": "",
        "fileAttachments": "",
        "attachmentList": "",
        "contentVersionList": "",
        "staticDocList": [],
        "docList": "",
        "remoteTimeout": 30000,
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Step",
        "redirectPageName": "",
        "redirectTemplateUrl": "vlcAcknowledge.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        },
        "enableDefaultAbort": false,
        "enableActionMessage": false,
    };

    EmailActionPropertySetController.$inject = ['propCompUtil', 'remoteActions'];

    function EmailActionPropertySetController(propCompUtil, remoteActions) {
        var vm = this;
        vm.emailTemplates = [];
        vm.emailDocuments = [];

        remoteActions.GetEmailTemplates().then(function (emailTemplates) {
            vm.emailTemplates = emailTemplates;
        });

        remoteActions.GetEmailDocuments().then(function (emailDocuments) {
            vm.emailDocuments = emailDocuments;
        });

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],17:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('integrationProcedureActionPropertySet', {
            templateUrl: 'propertysets/action/integration-procedure-action.tpl.html',
            controller: IntegrationProcedureActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "integrationProcedureKey": "",
        "useContinuation": false,
        "remoteOptions": {
            "preTransformBundle": "",
            "postTransformBundle": "",
            "useFuture": false,
            "chainable": false
        },
        "remoteTimeout": 30000,
        "preTransformBundle": "",
        "postTransformBundle": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "responseJSONPath": "",
        "responseJSONNode": "",
        "extraPayload": {},
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Step",
        "redirectPageName": "",
        "redirectTemplateUrl": "vlcAcknowledge.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "svgSprite": "",
        "svgIcon": "",
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        },
        "enableDefaultAbort": false,
        "enableActionMessage": false,
    };

    const FORCE_DEFAULT_INVOKE = [
        "preTransformBundle",
        "postTransformBundle",
    ];

    IntegrationProcedureActionPropertySetController.$inject = ['propCompUtil', 'remoteActions'];

    function IntegrationProcedureActionPropertySetController(propCompUtil, remoteActions) {
        const vm = this;

        vm.$onChanges = function (changes) {
            vm.unsetInvokeModeIfNeeded();
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        };

        (function loadIPs() {
            remoteActions.loadIntegrationProcedureKeys2().then(function (intProcedureKeys) {
                vm.integrationProcedures = intProcedureKeys;
                vm.integrationProceduresArray = Object.keys(intProcedureKeys);
            });
        })();

        vm.openIntegrationProcedure = function ($event) {
            const ipName = vm.element.PropertySet__c.integrationProcedureKey;
            if (!ipName) {
                return;
            }
            const ip = vm.integrationProcedures[ipName];
            if (!ip) {
                alert('There is currently no Integration Procedure named "' + ipName + '" in this org. If "' + ipName + '" was created recently, please try again in a few moments.');
                loadIPs();
                return;
            }
            doWindowOpen('/apex/' + window.ns + 'integrationproceduredesigner?id=' + ip, $event);
        }

        function doWindowOpen(url, $event) {
            window.vlocityOpenUrl(url, $event, true);
        }

        vm.unsetInvokeModeIfNeeded = function () {
            var propkeys, propval, tempval;
            if (vm && vm.element && vm.element.PropertySet__c) {
                for (var i = 0; i < FORCE_DEFAULT_INVOKE.length; i++) {
                    propval = vm.element.PropertySet__c;
                    propkeys = FORCE_DEFAULT_INVOKE[i].split('.');
                    for (var j = 0; j < propkeys.length; j++) {
                        tempval = propval[propkeys[j]];
                        if (tempval) {
                            propval = tempval;
                        } else {
                            propval = null;
                            break;
                        }
                    }
                    if (propval) {
                        vm.element.PropertySet__c.invokeMode = undefined;
                        return null;
                    }
                }
            }
        };

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],18:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('matrixActionPropertySet', {
            templateUrl: 'propertysets/action/matrix-action.tpl.html',
            controller: MatrixActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "matrix Input Parameters": [],
        "remoteOptions": {
            "matrixName": "",
            "postTransformBundle": ""
        },
        "executionDateTime": null,
        "remoteTimeout": 30000,
        "postTransformBundle": "",
        "responseJSONPath": "",
        "responseJSONNode": "",
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Step",
        "redirectPageName": "",
        "redirectTemplateUrl": "vlcAcknowledge.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "defaultMatrixResult": {},
        "svgSprite": "",
        "svgIcon": "",
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        },
        "enableDefaultAbort": false,
        "enableActionMessage": false,
    };

    MatrixActionPropertySetController.$inject = ['propCompUtil', 'remoteActions'];

    function MatrixActionPropertySetController(propCompUtil, remoteActions) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        remoteActions.getMatrixNames().then(function (matrixNames) {
            vm.matrixNames = matrixNames;
        });

        vm.deleteInputParameter = function (inputParam, inputParamArray) {
            inputParamArray.splice(inputParamArray.indexOf(inputParam), 1);
        };

        vm.addNewInputParameter = function (inputParamArray) {
            inputParamArray.push({
                'name': '',
                'value': ''
            });
        };
    }
})();

},{}],19:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('navigateActionPropertySet', {
            templateUrl: 'propertysets/action/navigate-action.tpl.html',
            controller: NavigateActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "targetType": "Component",
        "validationRequired": "none",
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "pubsub" : false,
        "message": {},
        "label": null,
        "objectAction": 'home',
        "objectActionOptions": ['home', 'list', 'new'],
        "recordAction": 'view',
        "recordActionOptions": ['clone', 'edit', 'view'],
        "loginAction": "login",
        "loginActionOptions": ['login', 'logout'],
        "targetFilter": 'Recent',
        "targetId": "%ContextId%",
        "targetTypeOptions": ["App", "Component", "Current Page", "Knowledge Article", "Login", "Named Page", "Community Named Page", "Navigation Item", "Object", "Record", "Record Relationship", "Web Page", "Vlocity OmniScript"],
        "variant": "brand",
        "variantOptions": ["brand", "outline-brand", "neutral", "success", "destructive", "text-destructive", "inverse", "link"],
        "iconName": "",
        "iconVariant": "",
        "iconPosition": "left",
        "iconPositionOptions": ["left", "right"],
        "replace": false,
        "replaceOptions": [
            { "label": "No", "value": false },
            { "label": "Yes", "value":  true }
        ],
        "targetLWCLayout": "lightning",
        "targetLWCLayoutOptions": ["lightning", "newport"]
    };

    NavigateActionPropertySetController.$inject = ['propCompUtil', 'customLabelService'];
    function NavigateActionPropertySetController(propCompUtil, customLabelService) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        customLabelService.getLabelValue('OmnicancelMessage', customLabelService.currentEditLanguage)
            .then(result => vm.defaultCancelMessage = result)
            .catch(reason => console.error);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

    }
})();

},{}],20:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('pdfActionPropertySet', {
            templateUrl: 'propertysets/action/pdf-action.tpl.html',
            controller: PdfActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "templateName": "",
        "preTransformBundle": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "displayHeight": 700,
        "displayWidth": 600,
        "dateFormat": "",
        "dateTimeFormat": "",
        "timeFormat": "",
        "readOnly": false,
        "remoteTimeout": 30000,
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Submit",
        "redirectPageName": "",
        "redirectTemplateUrl": "vlcPDF.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "attachmentName": "",
        "attachmentParentId": "",
        "showPopup": true,
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        },
        "enableDefaultAbort": false,
        "enableActionMessage": false,
    };

    PdfActionPropertySetController.$inject = ['propCompUtil', 'remoteActions'];

    function PdfActionPropertySetController(propCompUtil, remoteActions) {
        var vm = this;

        remoteActions.getDocuments().then(function (documents) {
            vm.pdfs = documents;
        });

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],21:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('postToObjectActionPropertySet', {
            templateUrl: 'propertysets/action/post-to-object-action.tpl.html',
            controller: PostToObjectActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });
    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "useRest": false,
        "restPath": "/NS/v1/application/",
        "restMethod": "POST",
        "remoteClass": "DefaultOmniScriptApplicationService",
        "remoteMethod": "SubmitApp",
        "postNameTemplate": "",
        "postTransformBundle": "",
        "responseJSONPath": "",
        "responseJSONNode": "",
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Submit",
        "redirectPageName": "postToObjRedirect",
        "redirectTemplateUrl": "vlcApplicationAcknowledgeV2.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        },
        "enableDefaultAbort": false,
        "enableActionMessage": false,
    };

    PostToObjectActionPropertySetController.$inject = ['propCompUtil'];

    function PostToObjectActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],22:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('remoteActionPropertySet', {
            templateUrl: 'propertysets/action/remote-action.tpl.html',
            controller: RemoteActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });
    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "remoteClass": "",
        "remoteMethod": "",
        "remoteOptions": {
            "preTransformBundle": "",
            "postTransformBundle": ""
        },
        "remoteTimeout": 30000,
        "preTransformBundle": "",
        "postTransformBundle": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "responseJSONPath": "",
        "responseJSONNode": "",
        "extraPayload": {},
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Step",
        "redirectPageName": "",
        "redirectTemplateUrl": "vlcAcknowledge.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "svgSprite": "",
        "svgIcon": "",
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        },
        "enableDefaultAbort": false,
        "enableActionMessage": false,
    };

    const FORCE_DEFAULT_INVOKE = [
        "preTransformBundle",
        "postTransformBundle",
        "remoteOptions.chainable"
    ];

    RemoteActionPropertySetController.$inject = ['propCompUtil'];

    function RemoteActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            vm.unsetInvokeModeIfNeeded();
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        };

        vm.unsetInvokeModeIfNeeded = function () {
            var propkeys, propval, tempval;
            if (vm && vm.element && vm.element.PropertySet__c) {
                for (var i = 0; i < FORCE_DEFAULT_INVOKE.length; i++) {
                    propval = vm.element.PropertySet__c;
                    propkeys = FORCE_DEFAULT_INVOKE[i].split('.');
                    for (var j = 0; j < propkeys.length; j++) {
                        tempval = propval[propkeys[j]];
                        if (tempval) {
                            propval = tempval;
                        } else {
                            propval = null;
                            break;
                        }
                    }
                    if (propval) {
                        vm.element.PropertySet__c.invokeMode = undefined;
                        return null;
                    }
                }
            }
        };

    }
})();

},{}],23:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('restActionPropertySet', {
            templateUrl: 'propertysets/action/rest-action.tpl.html',
            controller: RestActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "restPath": "",
        "restMethod": "",
        "preTransformBundle": "",
        "postTransformBundle": "",
        "xmlPreTransformBundle": "",
        "xmlPostTransformBundle": "",
        "extraPayload": {},
        "inProgressMessage": "In Progress",
        "postMessage": "Done",
        "failureNextLabel": "Continue",
        "failureAbortLabel": "Abort",
        "failureGoBackLabel": "Go Back",
        "failureAbortMessage": "Are you sure?",
        "validationRequired": "Step",
        "redirectPageName": "",
        "redirectTemplateUrl": "vlcAcknowledge.html",
        "redirectNextLabel": "Next",
        "redirectNextWidth": 3,
        "redirectPreviousLabel": "Previous",
        "redirectPreviousWidth": 3,
        "showPersistentComponent": [true, false],
        "show": null,
        "type": "Apex",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "responseJSONPath": "",
        "responseJSONNode": "",
        "restOptions": {
            "headers": {},
            "params": {},
            "cache": false,
            "timeout": 0,
            "withCredentials": false,
            "sendBody": true,
            "URIEncode": false
        },
        "namedCredential": "",
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "svgSprite": "",
        "svgIcon": "",
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        },
        "enableDefaultAbort": false,
        "enableActionMessage": false,
    };

    RestActionPropertySetController.$inject = ['propCompUtil'];

    function RestActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],24:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('reviewActionPropertySet', {
            templateUrl: 'propertysets/action/review-action.tpl.html',
            controller: ReviewActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "redirectPageName": "reviewRedirect",
        "redirectTemplateUrl": "vlcApplicationConfirmationV2.html",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "nextLabel": "Next",
        "nextWidth": 3,
        "previousLabel": "Previous",
        "previousWidth": 3,
        "skipElements": [],
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "label": null,
        "errorMessage": {
            "custom": [],
            "default": null
        }
    };

    ReviewActionPropertySetController.$inject = ['propCompUtil'];

    function ReviewActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],25:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('setErrorsActionPropertySet', {
            templateUrl: 'propertysets/action/set-errors-action.tpl.html',
            controller: SetErrorsActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "validationRequired": "Step",
        "elementErrorMap": {},
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "label": null
    };

    SetErrorsActionPropertySetController.$inject = ['propCompUtil', '$modal'];

    function SetErrorsActionPropertySetController(propCompUtil, $modal) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));

            if (!vm.element.PropertySet__c.elementErrorMap) {
                vm.element.PropertySet__c.elementErrorMap = {};
            }
            vm.elementErrorMap = vm.objectToKeyValueArray(vm.element.PropertySet__c.elementErrorMap);
        };

        vm.objectToKeyValueArray = function objectToKeyValueArray(map) {
            return Object.keys(map).map(function (key) {
                return {
                    key: key,
                    value: map[key],
                    type: vm.getType(map[key])
                };
            });
        }

        vm.getType = function (value) {
            switch (typeof value) {
                case 'object':
                    if (Array.isArray(value)) {
                        return 'array';
                    }
                    return 'object';
                default:
                    if (value && value[0] === '=') {
                        return 'expression';
                    }
                    return 'text';
            }
        };

        vm.addNewKeyValue = function () {
            vm.elementErrorMap.push({
                key: '',
                type: 'text',
                value: ''
            });
            vm.updateKeyValueProperty();
        };

        vm.deleteKeyValue = function (option) {
            vm.elementErrorMap.splice(vm.elementErrorMap.indexOf(option), 1);
            vm.updateKeyValueProperty();
        };

        vm.updateKeyValueProperty = function () {
            const newValue = vm.elementErrorMap.reduce(function (obj, prop) {
                var value = prop.value;
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    // try convert to a more appropriate type if possible.
                }
                obj[prop.key] = value;

                return obj;
            }, {});
            vm.element.PropertySet__c.elementErrorMap = newValue;

        };

        vm.editAsExpression = function (property, expressionOnly) {
            var input = {};
            input.currentVal = property.value;
            if (typeof input.currentVal == "undefined") {
                input.currentVal = "";
            }
            input.elementNames = function () {
                return vm.elementNamesAsObject();
            };

            // delete leading '=' token
            if (!expressionOnly) {
                input.currentVal = String(property.value).replace(/(?:^\s*=)|(?:\s*$)/g, '');
            }
            $modal({
                title: 'Expression Editor',
                templateUrl: 'modal-edit-expression.tpl.html',
                backdrop: 'static',
                controller: function ($scope) {
                    $scope.obj = input;

                    $scope.obj.newVal = $scope.obj.currentVal;

                    $scope.cancel = function () {
                        $scope.$hide();
                    };

                    $scope.submit = function () {
                        if ($scope.obj.newVal || $scope.obj.newVal == 'false') {
                            property.value = '=' + $scope.obj.newVal;
                            vm.updateKeyValueProperty();
                        }
                        $scope.cancel();
                    };
                }
            });
        };

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],26:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('setValuesActionPropertySet', {
            templateUrl: 'propertysets/action/set-values-action.tpl.html',
            controller: SetValuesActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "elementValueMap": {},
        "showPersistentComponent": [true, false],
        "show": null,
        "HTMLTemplateId": "",
        "wpm": false,
        "ssm": false,
        "message": {},
        "pubsub": false,
        "label": null
    };

    SetValuesActionPropertySetController.$inject = ['propCompUtil', '$modal'];

    function SetValuesActionPropertySetController(propCompUtil, $modal) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
            if (!vm.element.PropertySet__c.elementValueMap) {
                vm.element.PropertySet__c.elementValueMap = {};
            }
            vm.elementValueMap = vm.objectToKeyValueArray(vm.element.PropertySet__c.elementValueMap);
        }

        vm.objectToKeyValueArray = function objectToKeyValueArray(map) {
            return Object.keys(map).map(function (key) {
                return {
                    key: key,
                    value: map[key],
                    type: vm.getType(map[key])
                };
            });
        }

        vm.getType = function (value) {
            switch (typeof value) {
                case 'object':
                    if (Array.isArray(value)) {
                        return 'array';
                    }
                    return 'object';
                default:
                    if (value && value[0] === '=') {
                        return 'expression';
                    }
                    return 'text';
            }
        };

        vm.addNewKeyValue = function () {
            vm.elementValueMap.push({
                key: '',
                type: 'text',
                value: ''
            });
            vm.updateKeyValueProperty();
        };

        vm.deleteKeyValue = function (option) {
            vm.elementValueMap.splice(vm.elementValueMap.indexOf(option), 1);
            vm.updateKeyValueProperty();
        };

        vm.updateKeyValueProperty = function () {
            const newValue = vm.elementValueMap.reduce(function (obj, prop) {
                var value = prop.value;
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    // try convert to a more appropriate type if possible.
                }
                obj[prop.key] = value;

                return obj;
            }, {});
            vm.element.PropertySet__c.elementValueMap = newValue;

        };

        vm.editAsExpression = function (property, expressionOnly) {
            var input = {};
            input.currentVal = property.value;
            if (typeof input.currentVal == "undefined") {
                input.currentVal = "";
            }
            input.elementNames = function () {
                return vm.elementNamesAsObject();
            };

            // delete leading '=' token
            if (!expressionOnly) {
                input.currentVal = String(property.value).replace(/(?:^\s*=)|(?:\s*$)/g, '');
            }
            $modal({
                title: 'Expression Editor',
                templateUrl: 'modal-edit-expression.tpl.html',
                backdrop: 'static',
                controller: function ($scope) {
                    $scope.obj = input;

                    $scope.obj.newVal = $scope.obj.currentVal;

                    $scope.cancel = function () {
                        $scope.$hide();
                    };

                    $scope.submit = function () {
                        if ($scope.obj.newVal || $scope.obj.newVal == 'false') {
                            property.value = '=' + $scope.obj.newVal;
                            vm.updateKeyValueProperty();
                        }
                        $scope.cancel();
                    };
                }
            });
        };

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],27:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('submitActionPropertySet', {
            templateUrl: 'propertysets/action/submit-action.tpl.html',
            controller: SubmitActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": "3",
        "summaryLabel": "Summary",
        "summaryControlWidth": 12,
        "restPath": "/NS/v1/application/",
        "restMethod": "POST",
        "postNameTemplate": "",
        "redirectPageName": "acknowledge",
        "redirectTemplateUrl": "vlcApplicationAcknowledge.html",
        "submitLabel": "Submit",
        "submitWidth": 3,
        "reviseLabel": "Go back",
        "reviseWidth": 3,
        "confirmRedirectPageName": "confirmation",
        "confirmRedirectTemplateUrl": "vlcApplicationConfirmation.html",
        "show": null,
        "HTMLTemplateId": "",
        "label": null,
        "errorMessage": {
            "custom":[],
            "default":null
        }
    };

    SubmitActionPropertySetController.$inject = ['propCompUtil'];

    function SubmitActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],28:[function(require,module,exports){
require('./CalculationAction.js');
require('./DataraptorExtractAction.js');
require('./DataraptorPostAction.js');
require('./DataraptorTransformAction.js');
require('./DeleteAction.js');
require('./DocusignEnvelopeAction.js');
require('./DocusignSignatureAction.js');
require('./DoneAction.js');
require('./EmailAction.js');
require('./IntegrationProcedureAction.js');
require('./MatrixAction.js');
require('./NavigateAction.js');
require('./PdfAction.js');
require('./PostToObjectAction.js');
require('./RemoteAction.js');
require('./RestAction.js');
require('./ReviewAction.js');
require('./SetErrorsAction.js');
require('./SetValuesAction.js');
require('./SubmitAction.js');

},{"./CalculationAction.js":8,"./DataraptorExtractAction.js":9,"./DataraptorPostAction.js":10,"./DataraptorTransformAction.js":11,"./DeleteAction.js":12,"./DocusignEnvelopeAction.js":13,"./DocusignSignatureAction.js":14,"./DoneAction.js":15,"./EmailAction.js":16,"./IntegrationProcedureAction.js":17,"./MatrixAction.js":18,"./NavigateAction.js":19,"./PdfAction.js":20,"./PostToObjectAction.js":21,"./RemoteAction.js":22,"./RestAction.js":23,"./ReviewAction.js":24,"./SetErrorsAction.js":25,"./SetValuesAction.js":26,"./SubmitAction.js":27}],29:[function(require,module,exports){
(function() {
    'use strict';

    // Usage: {"controlWidth":12, "label:"", ,"show":null, "HTMLTemplateId":"", "labelKey":""}

    angular
        .module('omniscriptDesigner')
        .component('alertBanner', {
            templateUrl: 'alertBanner.tpl.html',
            controller: alertBannerController,
            controllerAs: 'vm',
            bindings: {
                alertContainer: '='
            }
        });

    function alertBannerController() {
        var vm = this;

        Object.assign(vm,
            {
                getMessage: getMessage,
                close: close
            }
        );

        function getMessage (){
            if (typeof vm.alertContainer !== "undefined"){
                if (typeof vm.alertContainer === "string")
                    return vm.alertContainer;
                else if (vm.alertContainer.hasOwnProperty('message'))
                    return vm.alertContainer.message;
            }
        }

        function close(){
            vm.alertContainer=undefined;
        }
    }
})();

},{}],30:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('arrayListProp', {
            templateUrl: 'propertysets/common/array-list.tpl.html',
            controller: ArrayListController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                label: '@',
                addBtnLabel: '@',
                ngDisabled: '=',
                ngModel: '<'
            }
        });

    ArrayListController.$inject = [];

    function ArrayListController() {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!vm.addBtnLabel) {
                vm.addBtnLabel = 'Add New Value';
            }
        }

        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        };

        vm.add = function () {
            vm.ngModel.push(null);
        }

        vm.remove = function (index) {
            vm.ngModel.splice(index, 1);
        }
    }
})();

},{}],31:[function(require,module,exports){
(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('checkboxProp', {
            templateUrl: 'propertysets/common/checkbox.tpl.html',
            controller: CheckboxController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                label: '@',
                helpText: '@',
                ngDisabled: '=',
                ngModel: '<'
            }
        });

    CheckboxController.$inject = [];
    function CheckboxController() {
        var vm = this;
        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        };
    }
})();

},{}],32:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('elementNameProp', {
            templateUrl: 'propertysets/common/element-name.tpl.html',
            controller: ElementNameController,
            controllerAs: 'vm',
            require: {
                form: '^form',
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                ngDisabled: '=',
                ngModel: '<'
            }
        });

    ElementNameController.$inject = [];
    function ElementNameController() {
        var vm = this;
        vm.isValidHTMLId = true;

        var validHtmlIdRegex = /^[A-Za-z]+[\/\w\ \-\:\.]*$/;

        vm.$onInit = function () {
            isValid();
        }

        vm.$onChanges = function (changes) {
            isValid();
        }
        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
            isValid();
        };

        function isValid() {
            vm.isValidHTMLId = validHtmlIdRegex.test(vm.ngModel)
        }
    }
})();

},{}],33:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('errormessageHandler', {
            templateUrl: 'propertysets/common/errormessage-handler.tpl.html',
            controller: ErrorMessageHandlerController,
            controllerAs: 'vm',
            bindings: {
                ngModel: '<',
                ngDisabled: '='
            }
        });

    ErrorMessageHandlerController.$inject = [];

    function ErrorMessageHandlerController() {
        var vm = this;

        vm.$onInit = function () {
            vm.errorMessages = vm.ngModel;
        }

        vm.$onChanges = function (changes) {
            if (changes.ngModel) {
                vm.errorMessages = vm.ngModel;
            }
        }

        vm.addNewErrorMessage = function () {
            vm.errorMessages.custom.push({
                path: '',
                value: '',
                message: ''
            });
        };

        vm.deleteErrorMessage = function (option) {
            vm.errorMessages.custom.splice(vm.errorMessages.custom.indexOf(option), 1);
        };
    }
})();

},{}],34:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('groupProp', {
            templateUrl: 'propertysets/common/group.tpl.html',
            controller: GroupController,
            controllerAs: 'vm',
            transclude: true,
            bindings: {
                label: '@',
                helpText: '@',
                isOpen: '@'
            }
        });

    GroupController.$inject = [];

    function GroupController() {
        var vm = this;
        vm.isOpen = false;
    }
})();

},{}],35:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('htmlTemplateIdProp', {
            templateUrl: 'propertysets/common/html-template-id.tpl.html',
            controller: HtmlTemplateIdController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                ngDisabled: '=',
                ngModel: '<',
                scriptElement: '<',
                hideLabel: '<'
            }
        });

    HtmlTemplateIdController.$inject = ['$window', 'vlocityUiTemplateService'];
    function HtmlTemplateIdController($window, vlocityUiTemplateService) {
        var vm = this;
        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        };

        vm.templateList = [];
        vm.templateMap = {};

        vm.getTemplates =  vlocityUiTemplateService.getGeneralTemplates;

        vm.openTemplate = function openTemplate($event, templateId) {
            $window.vlocityOpenUrl('/apex/' + $window.ns + 'UITemplateDesigner?name=' + templateId, $event, true);
        };

        vm.refreshTemplates = function(){
            vm.getTemplates().then(function(result){
                vm.templateMap = result;
                vm.templateList = vm.objectToKeyValueArray(result);
            });
        };

        vm.objectToKeyValueArray = function objectToKeyValueArray(map) {
            return Object.keys(map).filter(function (key) {
                if (!vm.ignoreKeys) {
                    return true;
                }
                return vm.ignoreKeys.indexOf(key) === -1;
            }).map(function (key) {
                return {
                    key: key,
                    value: map[key],
                    type: (typeof getType==="function"&&vm.getType(map[key]))||undefined
                };
            });
        };
        
        vm.refreshTemplates();
    }
})();

},{}],36:[function(require,module,exports){
(function () {
    'use strict';

    const properties = {
        templateUrl: 'propertysets/common/key-value.tpl.html',
        controller: KeyValueController,
        controllerAs: 'vm',
        require: {
            ngModelCtrl: 'ngModel'
        },
        transclude: true,
        bindings: {
            ngDisabled: '=',
            ngModel: '<',
            label: '@',
            helpText: '@',
            keyLabel: '@',
            valueLabel: '@',
            addBtnLabel: '@',
            idPrefix: '@',
            ignoreKeys: '<',
            scriptElement: '<',
            renderTemplateCell: '<',
            renderExpressionCell: '<'
        }
    };

    angular
        .module('omniscriptDesigner')
        .component('keyValueProp', properties);

    // This keyValuePropSmall is used on the LWC preview and has a different sizing of columns
    angular
        .module('omniscriptDesigner')
        .component('keyValueSmallProp', {
            ...properties,
            templateUrl: 'propertysets/common/key-value-small.tpl.html',
        });

    KeyValueController.$inject = ['$modal'];

    function KeyValueController($modal) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!vm.ngModel) {
                vm.ngModel = {};
            }
            const newMap = vm.objectToKeyValueArray(vm.ngModel);
            if (!_.isEqual(newMap, vm.map)) {
                vm.map = newMap;
            }
            if (!vm.addBtnLabel) {
                vm.addBtnLabel = 'Add Key/Value Pair';
            }
        };

        vm.objectToKeyValueArray = function objectToKeyValueArray(map) {
            return Object.keys(map).filter(function (key) {
                if (!vm.ignoreKeys) {
                    return true;
                }

                return vm.ignoreKeys.indexOf(key) === -1;
            }).map(function (key) {
                return {
                    key: key,
                    value: map[key],
                    type: (typeof vm.getType === "function" && vm.getType(map[key])) || undefined
                };
            });
        }

        vm.getType = function (value) {
            if (vm.ngModel == null) {
                vm.type = 'text';
                return;
            }
            switch (typeof value) {
                case 'object':
                    if (Array.isArray(value)) {
                        return 'array';
                    }
                    return 'object';
                default:
                    return 'text';
            }
        };

        vm.addNewKeyValue = function () {
            vm.map.push({
                key: '',
                value: ''
            });
            vm.updateKeyValueProperty();
        };

        vm.deleteKeyValue = function (option) {
            vm.map.splice(vm.map.indexOf(option), 1);
            vm.updateKeyValueProperty();
        };

        vm.updateKeyValueProperty = function () {
            const baseObj = {};
            if (vm.ignoreKeys) {
                vm.ignoreKeys.forEach(function (key) {
                    baseObj[key] = vm.ngModel[key];
                });
            }
            const newValue = vm.map.reduce(function (obj, prop) {
                var value = prop.value;
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    // try convert to a more appropriate type if possible.
                }
                obj[prop.key] = value;

                return obj;
            }, baseObj);
            vm.ngModel = newValue;
            vm.ngModelCtrl.$setViewValue(newValue);
        };

        vm.editAsExpression = function (property, expressionOnly) {
            var input = {};
            input.currentVal = property.value;
            if (typeof input.currentVal == "undefined") {
                input.currentVal = "";
            }
            input.elementNames = function () {
                return vm.elementNamesAsObject();
            };

            // delete leading '=' token
            if (!expressionOnly) {
                input.currentVal = String(property.value).replace(/(?:^\s*=)|(?:\s*$)/g, '');
            }
            $modal({
                title: 'Expression Editor',
                templateUrl: 'modal-edit-expression.tpl.html',
                backdrop: 'static',
                controller: function ($scope) {
                    $scope.obj = input;

                    $scope.obj.newVal = $scope.obj.currentVal;

                    $scope.cancel = function () {
                        $scope.$hide();
                    };

                    $scope.submit = function () {
                        if ($scope.obj.newVal || $scope.obj.newVal == 'false') {
                            property.value = '=' + $scope.obj.newVal;
                            vm.updateKeyValueProperty();
                        }
                        $scope.cancel();
                    };
                }
            });
        };
    }
})();

},{}],37:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('lwcOverrideProp', {
            templateUrl: 'propertysets/common/lwc-override.tpl.html',
            controller: LwcOverrideController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            transclude: true,
            bindings: {
                ngDisabled: '=',
                ngModel: '<',
                label: '@',
                helpText: '@',
                keyLabel: '@',
                valueLabel: '@',
                addBtnLabel: '@',
                idPrefix: '@',
                scriptElement: '<',
                options: '<'
            }
        });

    LwcOverrideController.$inject = ['lwcService', '$scope'];

    function LwcOverrideController(lwcService, $scope) {
        var vm = this;
        let timeout = undefined;

        lwcService.getLwcList().then(lwcs => {
            // Clone so we don't mess the list
            const values = [''].concat(lwcs);
            $scope.$apply(() => {
                vm.lwcList = values;
            });
        });

        vm.$onChanges = function () {
            if (!vm.ngModel) {
                vm.ngModel = {};
            }
            const newMap = vm.objectToKeyValueArray(vm.ngModel);
            if (!_.isEqual(newMap, vm.map)) {
                vm.map = newMap;
            }
            if (!vm.addBtnLabel) {
                vm.addBtnLabel = 'Add Key/Value Pair';
            }
        };

        vm.objectToKeyValueArray = function objectToKeyValueArray(map) {
            return Object.keys(map).map(function (key) {
                return {
                    key: key,
                    value: map[key]
                };
            });
        }

        vm.addNewKeyValue = function () {
            vm.map.push({
                key: '',
                value: ''
            });
            vm.updateKeyValueProperty();
        };

        vm.deleteKeyValue = function (option) {
            vm.map.splice(vm.map.indexOf(option), 1);
            vm.updateKeyValueProperty();
        };

        vm.updateKeyValueProperty = function () {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                const baseObj = {};
                const newValue = vm.map.reduce(function (obj, prop) {
                    var value = prop.value;
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        // try convert to a more appropriate type if possible.
                    }
                    obj[prop.key] = value;

                    return obj;
                }, baseObj);
                vm.ngModel = newValue;
                vm.ngModelCtrl.$setViewValue(newValue);
            }, 500);
        };
    }
})();

},{}],38:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('lwcSelectionProp', {
            templateUrl: 'propertysets/common/lwc-selection.tpl.html',
            controller: LwcSelectionController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                ngDisabled: '=',
                ngModel: '<',
                scriptElement: '<'
            }
        });

    LwcSelectionController.$inject = ['lwcService', '$scope'];
    function LwcSelectionController(lwcService, $scope) {
        var vm = this;

        lwcService.getLwcList().then(lwcs => {
            // Clone so we don't mess the list
            const values = [''].concat(lwcs);
            $scope.$apply(() => {
                vm.lwcList = values;
            })
        });

        vm.updateModel = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        }
    }
})();

},{}],39:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('monacoEditorProp', {
            templateUrl: 'propertysets/common/monaco-editor-prop.tpl.html',
            controller: MonacoEditorController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                label: '@',
                ngDisabled: '=',
                ngModel: '<'
            }
        });

    MonacoEditorController.$inject = [];

    function MonacoEditorController() {
        var vm = this;

        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        };
    }
})();

},{}],40:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('patternProp', {
            templateUrl: 'propertysets/common/pattern.tpl.html',
            controller: PatternPropController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                label: '@',
                helpText: '@',
                ngDisabled: '=',
                ngModel: '=',
                lwcEnabled: '<',
                documentation: '@'
            }
        });

    PatternPropController.$inject = [];
    function PatternPropController() {
        this.$onInit = onInit;

        function onInit() {
            this.ngModelCtrl.$validators['Invalid Pattern'] = validatePattern.bind(this);
        }

        function validatePattern(modelValue) {
            let isValid = true;

            try {
                new RegExp(modelValue, 'u');
            } catch(err) {
                if (this.lwcEnabled)
                    isValid = false;
            }

            return isValid;
        }
    }
})();

},{}],41:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('showPersistentComponentProp', {
            templateUrl: 'propertysets/common/show-persistent-component.tpl.html',
            controller: ShowPersistentComponentController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                persistentComponent: '<',
                ngDisabled: '=',
                ngModel: '<'
            }
        });

    ShowPersistentComponentController.$inject = [];
    function ShowPersistentComponentController() {
        var vm = this;

        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        }

    }
})();

},{}],42:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('textProp', {
            templateUrl: 'propertysets/common/text.tpl.html',
            controller: TextController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                label: '@',
                helpText: '@',
                placeholder: '@',
                ngDisabled: '=',
                ngModel: '<',
                documentation: '@'
            }
        });

    TextController.$inject = [];

    function TextController() {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (vm.ngModel == null) {
                vm.type = 'text';
                return;
            }
            switch (typeof vm.ngModel) {
                case 'object':
                    if (Array.isArray(vm.ngModel)) {
                        vm.type = 'array';
                        break;
                    }
                    vm.type = 'object';
                    break;
                default:
                    vm.type = 'text';
            }
        };

        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        };
    }
})();

},{}],43:[function(require,module,exports){
require('./ArrayListProp.js');
require('./CheckboxProp.js');
require('./TextProp.js');
require('./PatternProp.js');
require('./ElementNameProp.js');
require('./GroupProp.js');
require('./HtmlTemplateIdProp.js');
require('./KeyValueProp.js');
require('./LwcOverrideProp.js');
require('./LwcSelectionProp.js');
require('./ShowPersistentComponentProp.js');
require('./MonacoEditorProp.js');
require('./ErrorMessageHandlerProp.js');
},{"./ArrayListProp.js":30,"./CheckboxProp.js":31,"./ElementNameProp.js":32,"./ErrorMessageHandlerProp.js":33,"./GroupProp.js":34,"./HtmlTemplateIdProp.js":35,"./KeyValueProp.js":36,"./LwcOverrideProp.js":37,"./LwcSelectionProp.js":38,"./MonacoEditorProp.js":39,"./PatternProp.js":40,"./ShowPersistentComponentProp.js":41,"./TextProp.js":42}],44:[function(require,module,exports){
(function () {
    'use strict';

    // Usage: {"controlWidth":12, "label:"", ,"show":null, "HTMLTemplateId":"", "labelKey":""}

    angular
        .module('omniscriptDesigner')
        .component('headlinePropertySet', {
            templateUrl: 'propertysets/display/headline.tpl.html',
            controller: HeadlinePropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "show": null,
        "HTMLTemplateId": "",
        "labelKey": "",
        "label": null,
        "sanitize": false,
    };

    HeadlinePropertySetController.$inject = ['tinyMCEService', 'propCompUtil'];

    function HeadlinePropertySetController(tinyMCEService, propCompUtil) {
        var vm = this;

        vm.tinymceOptions = tinyMCEService.tinymceOptions;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],45:[function(require,module,exports){
(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('lineBreakPropertySet', {
            templateUrl: 'propertysets/display/line-break.tpl.html',
            controller: LineBreakPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "padding": 0,
        "show": null,
        "HTMLTemplateId": ""
    };

    LineBreakPropertySetController.$inject = ['save', 'tinyMCEService', 'propCompUtil'];
    function LineBreakPropertySetController(save, tinyMCEService, propCompUtil) {
        var vm = this;

        vm.tinymceOptions = tinyMCEService.tinymceOptions;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],46:[function(require,module,exports){
(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('textBlockPropertySet', {
            templateUrl: 'propertysets/display/text-block.tpl.html',
            controller: TextBlockPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "text": "",
        "show": null,
        "dataJSON": false,
        "HTMLTemplateId": "",
        "textKey": "",
        "label": null,
        "sanitize": false,
    };

    TextBlockPropertySetController.$inject = ['save', 'tinyMCEService', 'propCompUtil'];
    function TextBlockPropertySetController(save, tinyMCEService, propCompUtil) {
        var vm = this;

        vm.tinymceOptions = tinyMCEService.tinymceOptions;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

    }
})();

},{}],47:[function(require,module,exports){
require('./HeadlinePropertySet.js');
require('./LineBreakPropertySet.js');
require('./TextBlockPropertySet.js');

},{"./HeadlinePropertySet.js":44,"./LineBreakPropertySet.js":45,"./TextBlockPropertySet.js":46}],48:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('aggregatePropertySet', {
            templateUrl: 'propertysets/function/aggregate.tpl.html',
            controller: AggregatePropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "expression": "",
        "hide": false,
        "show": null,
        "mask": null,
        "dataType": null,
        "hideGroupSep": false,
        "dateFormat": "MM-dd-yyyy",
        "HTMLTemplateId": "",
        "disOnTplt": false,
        "label": null
    };

    AggregatePropertySetController.$inject = ['propCompUtil'];

    function AggregatePropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],49:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('formulaPropertySet', {
            templateUrl: 'propertysets/function/formula.tpl.html',
            controller: FormulaPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "expression": "",
        "hide": false,
        "show": null,
        "mask": null,
        "dataType": null,
        "hideGroupSep": false,
        "dateFormat": "MM-dd-yyyy",
        "HTMLTemplateId": "",
        "disOnTplt": false,
        "label": null
    };

    FormulaPropertySetController.$inject = ['propCompUtil'];

    function FormulaPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],50:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('geolocationPropertySet', {
            templateUrl: 'propertysets/function/geolocation.tpl.html',
            controller: GeolocationPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "show": null,
        "HTMLTemplateId": "",
        "label": null
    };

    GeolocationPropertySetController.$inject = ['propCompUtil'];

    function GeolocationPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],51:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('validationPropertySet', {
            templateUrl: 'propertysets/function/validation.tpl.html',
            controller: ValidationPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "validateExpression": {
            "group": {
                "operator": "AND",
                "rules": []
            }
        },
        "messages": [{
            "value": true,
            "type": "Success",
            "text": "",
            "active": true
        }, {
            "value": false,
            "type": "Requirement",
            "text": "",
            "active": true
        }],
        "hideLabel": true,
        "show": null,
        "HTMLTemplateId": "",
        "label": null
    }

    ValidationPropertySetController.$inject = ['propCompUtil'];

    function ValidationPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));

            if (!vm.element.PropertySet__c.validateExpression) {
                vm.element.PropertySet__c.validateExpression = Object.assign({}, DEFAULT_PROP_SET.validateExpression);
            }
        }
    }
})();

},{}],52:[function(require,module,exports){
require('./Aggregate.js');
require('./Formula.js');
require('./Geolocation.js');
require('./Validation.js');

},{"./Aggregate.js":48,"./Formula.js":49,"./Geolocation.js":50,"./Validation.js":51}],53:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('actionBlockPropertySet', {
            templateUrl: 'propertysets/group/action-block.tpl.html',
            controller: ActionBlockPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "show": null,
        "conditionType": "Hide if False",
        "hide": false,
        "label": null,
        "failureGoBackLabel": "Go Back",
        "failureNextLabel": "Continue",
        "enableActionMessage": false,
        "applyIfError": false,
        "validationRequired": "Step",
    }

    ActionBlockPropertySetController.$inject = ['propCompUtil'];

    function ActionBlockPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (changes.element) {
                vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
            }
        }
    }
})();

},{}],54:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('blockPropertySet', {
            templateUrl: 'propertysets/group/block.tpl.html',
            controller: BlockPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "collapse": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "label": ""
    }

    BlockPropertySetController.$inject = ['propCompUtil'];

    function BlockPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],55:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('editBlockPropertySet', {
            templateUrl: 'propertysets/group/edit-block.tpl.html',
            controller: EditBlockPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "allowEdit": true,
        "allowNew": true,
        "allowDelete": true,
        "newLabel": "New",
        "editLabel": "Edit",
        "deleteLabel": "Delete",
        "selectMode": "Multi",
        "selectCheckBox": "",
        "svgSprite": "utility",
        "svgIcon": "user",
        "elementName": "",
        "valueSvgMap": [],
        "selectSobject": "",
        "sobjectMapping": [],
        "sumElement": "",
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "label": null,
        "mode":"Inline"
    };

    EditBlockPropertySetController.$inject = ['propCompUtil', 'remoteActions', 'sObjectService', 'lwcService','$scope'];

    function EditBlockPropertySetController(propCompUtil, remoteActions, sObjectService, lwcService, $scope) {
        var vm = this;

        vm.allFieldsForObjects = {};

        lwcService.getLwcList().then(lwcs => {
            // Clone so we don't mess the list
            const values = [''].concat(lwcs);
            $scope.$apply(() => {
                vm.lwcList = values;
            })
        });

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        vm.addValueSvgMap = function () {
            vm.element.PropertySet__c.valueSvgMap.push({
                value: "",
                svgSprite: ""
            });
        };

        vm.deleteValueSvgMap = function (index) {
            vm.element.PropertySet__c.valueSvgMap.splice(index, 1);
        };

        sObjectService.getSObjects().then(function (allObjects) {
            vm.sobjectTypes = allObjects;
            if (vm.sobjectTypes.length > 0) {
                vm.loadFieldsFor(vm.sobjectTypes[0].name);
            }
        });

        vm.loadFieldsFor = function (object) {
            remoteActions.getFieldsForObject(object).then(function (fields) {
                vm.allFieldsForObjects[object] = Object.keys(fields);
            });
        };

        vm.getTypeAheadEleOptions = function () {
            const options = [];
            vm.element.children.forEach(function (child) {
                if (/Block$/i.test(child.Type__c.label)) {
                    child.children.forEach(function (subChild) {
                        options.push(child.Name + ':' + subChild.Name);
                    });
                } else if (child.Active__c === true &&
                    !(/(Action$|^Set|^Submit)/i.test(child.Type__c.label))) {
                    options.push(child.Name);
                }
            });
            return options.sort();
        }

        vm.addsObjectMap = function () {
            vm.element.PropertySet__c.sobjectMapping.push({
                osElement: '',
                sObjectField: '',
                duplicateKey: false
            });
        };

        vm.deletesObjectMap = function (index) {
            vm.element.PropertySet__c.sobjectMapping.splice(index, 1);
        };

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],56:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('filterBlockPropertySet', {
            templateUrl: 'propertysets/group/filter-block.tpl.html',
            controller: FilterBlockPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "remoteClass": "",
        "remoteMethod": "",
        "remoteOptions": {
            "preTransformBundle": "",
            "postTransformBundle": ""
        },
        "remoteTimeout": 30000,
        "preTransformBundle": "",
        "postTransformBundle": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "responseJSONPath": "",
        "responseJSONNode": "",
        "buttonLabel": "Fetch",
        "show": null,
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "label": null
    };

    FilterBlockPropertySetController.$inject = ['propCompUtil'];

    function FilterBlockPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],57:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('inputBlockPropertySet', {
            templateUrl: 'propertysets/group/input-block.tpl.html',
            controller: InputBlockPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "remoteClass": "",
        "remoteMethod": "",
        "remoteOptions": {
            "preTransformBundle": "",
            "postTransformBundle": ""
        },
        "remoteTimeout": 30000,
        "preTransformBundle": "",
        "postTransformBundle": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "responseJSONPath": "",
        "responseJSONNode": "",
        "HTMLTemplateId": "vlcTableSample.html",
        "show": null,
        "accessibleInFutureSteps": false,
        "label": null
    };

    InputBlockPropertySetController.$inject = ['propCompUtil'];

    function InputBlockPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],58:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('radioGroupPropertySet', {
            templateUrl: 'propertysets/group/radio-group.tpl.html',
            controller: RadioGroupPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "required": false,
        "readOnly": false,
        "help": false,
        "helpText": "",
        "radioLabelsWidth": 6,
        "radioLabels": [],
        "options": [{}],
        "optionSource": {
            "type": "",
            "source": ""
        },
        "controllingField": {
            "element": "",
            "type": "",
            "source": ""
        },
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    };

    RadioGroupPropertySetController.$inject = ['propCompUtil', 'propertyEditorModalService'];

    function RadioGroupPropertySetController(propCompUtil, propertyEditorModalService) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        vm.addNewOption = function () {
            vm.element.PropertySet__c.options.push({});
        };

        vm.addNewRadioLabel = function () {
            vm.element.PropertySet__c.radioLabels.push({});
        };

        vm.selectImage = function (option) {
            propertyEditorModalService.prepDocInsert(option, "imgId", true);
        };

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],59:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('selectableItemsPropertySet', {
            templateUrl: 'propertysets/group/selectable-items.tpl.html',
            controller: SelectableItemsPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "remoteClass": "",
        "remoteMethod": "",
        "remoteOptions": {
            "preTransformBundle": "",
            "postTransformBundle": ""
        },
        "remoteTimeout": 30000,
        "preTransformBundle": "",
        "postTransformBundle": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "responseJSONPath": "",
        "responseJSONNode": "",
        "HTMLTemplateId": "",
        "itemsKey": "recSet",
        "selectMode": "Single",
        "dataJSON": false,
        "modalHTMLTemplateId": "vlcModalContent.html",
        "modalController": "ModalInstanceCtrl",
        "modalSize": "",
        "maxCompareSize": 4,
        "modalConfigurationSetting": {
            "modalHTMLTemplateId": "vlcProductConfig.html",
            "modalController": "ModalProductCtrl",
            "modalSize": "lg"
        },
        "show": null,
        "accessibleInFutureSteps": false,
        "label": null
    };

    SelectableItemsPropertySetController.$inject = ['propCompUtil'];

    function SelectableItemsPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],60:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('stepPropertySet', {
            templateUrl: 'propertysets/group/step.tpl.html',
            controller: StepPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "validationRequired": true,
        "previousLabel": "Previous",
        "previousWidth": 3,
        "nextLabel": "Next",
        "nextWidth": 3,
        "cancelLabel": "Cancel",
        "cancelMessage": "Are you sure?",
        "saveLabel": "Save for later",
        "saveMessage": "Are you sure you want to save it for later?",
        "completeLabel": "Complete",
        "completeMessage": "Are you sure you want to complete the script?",
        "instruction": "",
        "showPersistentComponent": [true, false],
        "remoteClass": "",
        "remoteMethod": "",
        "remoteTimeout": 30000,
        "remoteOptions": {},
        "knowledgeOptions": {
            "language": "English",
            "publishStatus": "Online",
            "keyword": "",
            "dataCategoryCriteria": "",
            "remoteTimeout": 30000,
            "typeFilter": ""
        },
        "show": null,
        "conditionType": "Hide if False",
        "HTMLTemplateId": "",
        "instructionKey": "",
        "chartLabel": null,
        "label": null,
        "allowSaveForLater": true,
        "errorMessage": {
            "custom":[],
            "default": null
        },
        "wpm": false,
        "ssm": false,
        "pubsub": false,
        "message": {},
    };

    StepPropertySetController.$inject = ['tinyMCEService', 'propCompUtil', 'LanguagesJson'];

    function StepPropertySetController(tinyMCEService, propCompUtil, LanguagesJson) {
        var vm = this;

        vm.tinymceOptions = tinyMCEService.tinymceOptions;

        vm.languagesMap = LanguagesJson;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],61:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('typeAheadBlockPropertySet', {
            templateUrl: 'propertysets/group/type-ahead-block.tpl.html',
            controller: TypeAheadBlockPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "googleTransformation": {
            "street": "",
            "locality": "",
            "administrative_area_level_1": "",
            "administrative_area_level_2": "",
            "country": "",
            "postal_code": ""
        },
        "required": false,
        "readOnly": false,
        "help": false,
        "helpText": "",
        "minLength": 0,
        "maxLength": 255,
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "debounceValue": 0,
        "typeAheadKey": "",
        "dataProcessorFunction": "",
        "callFrequency": 300,
        "editMode": false,
        "newItemLabel": "New",
        "hideEditButton": false,
        "enableGoogleMapsAutocomplete": false,
        "enableLookup": false,
        "disableDataFilter": false,
        "googleMapsAPIKey": "",
        "hideMap": true,
        "googleAddressCountry": "All",
        "useDataJson": false,
        "dataJsonPath": "",
        "HTMLTemplateId": "",
        "label": null
    };

    TypeAheadBlockPropertySetController.$inject = ['propCompUtil'];

    function TypeAheadBlockPropertySetController(propCompUtil) {
        var vm = this;

        vm.googleCountryOptions = [{
            'name': 'All',
            'value': 'all'
        }, {
            'name': 'Afghanistan',
            'value': 'af'
        }, {
            'name': 'Åland Islands',
            'value': 'ax'
        }, {
            'name': 'Albania',
            'value': 'al'
        }, {
            'name': 'Algeria',
            'value': 'dz'
        }, {
            'name': 'American Samoa',
            'value': 'as'
        }, {
            'name': 'Andorra',
            'value': 'ad'
        }, {
            'name': 'Angola',
            'value': 'ao'
        }, {
            'name': 'Anguilla',
            'value': 'ai'
        }, {
            'name': 'Antarctica',
            'value': 'aq'
        }, {
            'name': 'Antigua and Barbuda',
            'value': 'ag'
        }, {
            'name': 'Argentina',
            'value': 'ar'
        }, {
            'name': 'Armenia',
            'value': 'am'
        }, {
            'name': 'Aruba',
            'value': 'aw'
        }, {
            'name': 'Ascension Island',
            'value': 'ac'
        }, {
            'name': 'Australia',
            'value': 'au'
        }, {
            'name': 'Austria',
            'value': 'at'
        }, {
            'name': 'Azerbaijan',
            'value': 'az'
        }, {
            'name': 'Bahamas',
            'value': 'bs'
        }, {
            'name': 'Bahrain',
            'value': 'bh'
        }, {
            'name': 'Bangladesh',
            'value': 'bd'
        }, {
            'name': 'Barbados',
            'value': 'bb'
        }, {
            'name': 'Belarus',
            'value': 'by'
        }, {
            'name': 'Belgium',
            'value': 'be'
        }, {
            'name': 'Belize',
            'value': 'bz'
        }, {
            'name': 'Benin',
            'value': 'bj'
        }, {
            'name': 'Bermuda',
            'value': 'bm'
        }, {
            'name': 'Bhutan',
            'value': 'bt'
        }, {
            'name': 'Bolivia',
            'value': 'bo'
        }, {
            'name': 'Bosnia and Herzegovina',
            'value': 'ba'
        }, {
            'name': 'Botswana',
            'value': 'bw'
        }, {
            'name': 'Bouvet Island',
            'value': 'bv'
        }, {
            'name': 'Brazil',
            'value': 'br'
        }, {
            'name': 'British Indian Ocean Territory',
            'value': 'io'
        }, {
            'name': 'British Virgin Islands',
            'value': 'vg'
        }, {
            'name': 'Brunei Darussalam',
            'value': 'bn'
        }, {
            'name': 'Bulgaria',
            'value': 'bg'
        }, {
            'name': 'Burkina Faso',
            'value': 'bf'
        }, {
            'name': 'Burundi',
            'value': 'bi'
        }, {
            'name': 'Cambodia',
            'value': 'kh'
        }, {
            'name': 'Cameroon',
            'value': 'cm'
        }, {
            'name': 'Canada',
            'value': 'ca'
        }, {
            'name': 'Canary Islands',
            'value': 'ic'
        }, {
            'name': 'Cape Verde',
            'value': 'cv'
        }, {
            'name': 'Caribbean Netherlands',
            'value': 'bq'
        }, {
            'name': 'Cayman Islands',
            'value': 'ky'
        }, {
            'name': 'Central African Republic',
            'value': 'cf'
        }, {
            'name': 'Ceuta & Melilla',
            'value': 'ea'
        }, {
            'name': 'Chad',
            'value': 'td'
        }, {
            'name': 'Chile',
            'value': 'cl'
        }, {
            'name': 'China',
            'value': 'cn'
        }, {
            'name': 'Christmas Island',
            'value': 'cx'
        }, {
            'name': 'Clipperton Island',
            'value': 'cp'
        }, {
            'name': 'Cocos (Keeling) Islands',
            'value': 'cc'
        }, {
            'name': 'Colombia',
            'value': 'co'
        }, {
            'name': 'Comoros',
            'value': 'km'
        }, {
            'name': 'Congo - Brazzaville',
            'value': 'cg'
        }, {
            'name': 'Congo - Kinshasa',
            'value': 'cd'
        }, {
            'name': 'Cook Islands',
            'value': 'ck'
        }, {
            'name': 'Costa Rica',
            'value': 'cr'
        }, {
            'name': 'Cote D\'Ivoire',
            'value': 'ci'
        }, {
            'name': 'Croatia',
            'value': 'hr'
        }, {
            'name': 'Cuba',
            'value': 'cu'
        }, {
            'name': 'Curaçao',
            'value': 'cw'
        }, {
            'name': 'Cyprus',
            'value': 'cy'
        }, {
            'name': 'Czech Republic',
            'value': 'cz'
        }, {
            'name': 'Côte d\’Ivoire',
            'value': 'ci'
        }, {
            'name': 'Denmark',
            'value': 'dk'
        }, {
            'name': 'Diego Garcia',
            'value': 'dg'
        }, {
            'name': 'Djibouti',
            'value': 'dj'
        }, {
            'name': 'Dominica',
            'value': 'dm'
        }, {
            'name': 'Dominican Republic',
            'value': 'do'
        }, {
            'name': 'Ecuador',
            'value': 'ec'
        }, {
            'name': 'Egypt',
            'value': 'eg'
        }, {
            'name': 'El Salvador',
            'value': 'sv'
        }, {
            'name': 'Equatorial Guinea',
            'value': 'gq'
        }, {
            'name': 'Eritrea',
            'value': 'er'
        }, {
            'name': 'Estonia',
            'value': 'ee'
        }, {
            'name': 'Ethiopia',
            'value': 'et'
        }, {
            'name': 'Falkland Islands (Malvinas)',
            'value': 'fk'
        }, {
            'name': 'Faroe Islands',
            'value': 'fo'
        }, {
            'name': 'Fiji',
            'value': 'fj'
        }, {
            'name': 'Finland',
            'value': 'fi'
        }, {
            'name': 'France',
            'value': 'fr'
        }, {
            'name': 'French Guiana',
            'value': 'gf'
        }, {
            'name': 'French Polynesia',
            'value': 'pf'
        }, {
            'name': 'French Southern Territories',
            'value': 'tf'
        }, {
            'name': 'Gabon',
            'value': 'ga'
        }, {
            'name': 'Gambia',
            'value': 'gm'
        }, {
            'name': 'Georgia',
            'value': 'ge'
        }, {
            'name': 'Germany',
            'value': 'de'
        }, {
            'name': 'Ghana',
            'value': 'gh'
        }, {
            'name': 'Gibraltar',
            'value': 'gi'
        }, {
            'name': 'Greece',
            'value': 'gr'
        }, {
            'name': 'Greenland',
            'value': 'gl'
        }, {
            'name': 'Grenada',
            'value': 'gd'
        }, {
            'name': 'Guadeloupe',
            'value': 'gp'
        }, {
            'name': 'Guam',
            'value': 'gu'
        }, {
            'name': 'Guatemala',
            'value': 'gt'
        }, {
            'name': 'Guernsey',
            'value': 'gg'
        }, {
            'name': 'Guinea',
            'value': 'gn'
        }, {
            'name': 'Guinea-Bissau',
            'value': 'gw'
        }, {
            'name': 'Guyana',
            'value': 'gy'
        }, {
            'name': 'Haiti',
            'value': 'ht'
        }, {
            'name': 'Heard Island and Mcdonald Islands',
            'value': 'hm'
        }, {
            'name': 'Holy See (Vatican City State)',
            'value': 'va'
        }, {
            'name': 'Honduras',
            'value': 'hn'
        }, {
            'name': 'Hong Kong',
            'value': 'hk'
        }, {
            'name': 'Hungary',
            'value': 'hu'
        }, {
            'name': 'Iceland',
            'value': 'is'
        }, {
            'name': 'India',
            'value': 'in'
        }, {
            'name': 'Indonesia',
            'value': 'id'
        }, {
            'name': 'Iran, Islamic Republic Of',
            'value': 'ir'
        }, {
            'name': 'Iraq',
            'value': 'iq'
        }, {
            'name': 'Ireland',
            'value': 'ie'
        }, {
            'name': 'Isle of Man',
            'value': 'im'
        }, {
            'name': 'Israel',
            'value': 'il'
        }, {
            'name': 'Italy',
            'value': 'it'
        }, {
            'name': 'Jamaica',
            'value': 'jm'
        }, {
            'name': 'Japan',
            'value': 'jp'
        }, {
            'name': 'Jersey',
            'value': 'je'
        }, {
            'name': 'Jordan',
            'value': 'jo'
        }, {
            'name': 'Kazakhstan',
            'value': 'kz'
        }, {
            'name': 'Kenya',
            'value': 'ke'
        }, {
            'name': 'Kiribati',
            'value': 'ki'
        }, {
            'name': 'Korea, Democratic People\'S Republic of',
            'value': 'kp'
        }, {
            'name': 'Korea, Republic of',
            'value': 'kr'
        }, {
            'name': 'Kuwait',
            'value': 'kw'
        }, {
            'name': 'Kyrgyzstan',
            'value': 'kg'
        }, {
            'name': 'Lao People\'S Democratic Republic',
            'value': 'la'
        }, {
            'name': 'Latvia',
            'value': 'lv'
        }, {
            'name': 'Lebanon',
            'value': 'lb'
        }, {
            'name': 'Lesotho',
            'value': 'ls'
        }, {
            'name': 'Liberia',
            'value': 'lr'
        }, {
            'name': 'Libya',
            'value': 'ly'
        }, {
            'name': 'Liechtenstein',
            'value': 'li'
        }, {
            'name': 'Lithuania',
            'value': 'lt'
        }, {
            'name': 'Luxembourg',
            'value': 'lu'
        }, {
            'name': 'Macao',
            'value': 'mo'
        }, {
            'name': 'Macedonia, The Former Yugoslav Republic of',
            'value': 'mk'
        }, {
            'name': 'Madagascar',
            'value': 'mg'
        }, {
            'name': 'Malawi',
            'value': 'mw'
        }, {
            'name': 'Malaysia',
            'value': 'my'
        }, {
            'name': 'Maldives',
            'value': 'mv'
        }, {
            'name': 'Mali',
            'value': 'ml'
        }, {
            'name': 'Malta',
            'value': 'mt'
        }, {
            'name': 'Marshall Islands',
            'value': 'mh'
        }, {
            'name': 'Martinique',
            'value': 'mq'
        }, {
            'name': 'Mauritania',
            'value': 'mr'
        }, {
            'name': 'Mauritius',
            'value': 'mu'
        }, {
            'name': 'Mayotte',
            'value': 'yt'
        }, {
            'name': 'Mexico',
            'value': 'mx'
        }, {
            'name': 'Micronesia, Federated States of',
            'value': 'fm'
        }, {
            'name': 'Moldova, Republic of',
            'value': 'md'
        }, {
            'name': 'Monaco',
            'value': 'mc'
        }, {
            'name': 'Mongolia',
            'value': 'mn'
        }, {
            'name': 'Montserrat',
            'value': 'ms'
        }, {
            'name': 'Morocco',
            'value': 'ma'
        }, {
            'name': 'Mozambique',
            'value': 'mz'
        }, {
            'name': 'Myanmar',
            'value': 'mm'
        }, {
            'name': 'Namibia',
            'value': 'na'
        }, {
            'name': 'Nauru',
            'value': 'nr'
        }, {
            'name': 'Nepal',
            'value': 'np'
        }, {
            'name': 'Netherlands',
            'value': 'nl'
        }, {
            'name': 'Netherlands Antilles',
            'value': 'an'
        }, {
            'name': 'New Caledonia',
            'value': 'nc'
        }, {
            'name': 'New Zealand',
            'value': 'nz'
        }, {
            'name': 'Nicaragua',
            'value': 'ni'
        }, {
            'name': 'Niger',
            'value': 'ne'
        }, {
            'name': 'Nigeria',
            'value': 'ng'
        }, {
            'name': 'Niue',
            'value': 'nu'
        }, {
            'name': 'Norfolk Island',
            'value': 'nf'
        }, {
            'name': 'Northern Mariana Islands',
            'value': 'mp'
        }, {
            'name': 'Norway',
            'value': 'no'
        }, {
            'name': 'Oman',
            'value': 'om'
        }, {
            'name': 'Pakistan',
            'value': 'pk'
        }, {
            'name': 'Palau',
            'value': 'pw'
        }, {
            'name': 'Palestinian Territory, Occupied',
            'value': 'ps'
        }, {
            'name': 'Panama',
            'value': 'pa'
        }, {
            'name': 'Papua New Guinea',
            'value': 'pg'
        }, {
            'name': 'Paraguay',
            'value': 'py'
        }, {
            'name': 'Peru',
            'value': 'pe'
        }, {
            'name': 'Philippines',
            'value': 'ph'
        }, {
            'name': 'Pitcairn Islands',
            'value': 'pn'
        }, {
            'name': 'Poland',
            'value': 'pl'
        }, {
            'name': 'Portugal',
            'value': 'pt'
        }, {
            'name': 'Puerto Rico',
            'value': 'pr'
        }, {
            'name': 'Qatar',
            'value': 'qa'
        }, {
            'name': 'Reunion',
            'value': 're'
        }, {
            'name': 'Romania',
            'value': 'ro'
        }, {
            'name': 'Russian Federation',
            'value': 'ru'
        }, {
            'name': 'RWANDA',
            'value': 'rw'
        }, {
            'name': 'Saint Helena',
            'value': 'sh'
        }, {
            'name': 'Saint Kitts and Nevis',
            'value': 'kn'
        }, {
            'name': 'Saint Lucia',
            'value': 'lc'
        }, {
            'name': 'Saint Pierre and Miquelon',
            'value': 'pm'
        }, {
            'name': 'Saint Vincent and the Grenadines',
            'value': 'vc'
        }, {
            'name': 'Samoa',
            'value': 'ws'
        }, {
            'name': 'San Marino',
            'value': 'sm'
        }, {
            'name': 'Sao Tome and Principe',
            'value': 'st'
        }, {
            'name': 'Saudi Arabia',
            'value': 'sa'
        }, {
            'name': 'Senegal',
            'value': 'sn'
        }, {
            'name': 'Serbia and Montenegro',
            'value': 'cs'
        }, {
            'name': 'Seychelles',
            'value': 'sc'
        }, {
            'name': 'Sierra Leone',
            'value': 'sl'
        }, {
            'name': 'Singapore',
            'value': 'sg'
        }, {
            'name': 'Sint Maarten',
            'value': 'sx'
        }, {
            'name': 'Slovakia',
            'value': 'sk'
        }, {
            'name': 'Slovenia',
            'value': 'si'
        }, {
            'name': 'Solomon Islands',
            'value': 'sb'
        }, {
            'name': 'Somalia',
            'value': 'so'
        }, {
            'name': 'South Africa',
            'value': 'za'
        }, {
            'name': 'South Georgia and the South Sandwich Islands',
            'value': 'gs'
        }, {
            'name': 'Spain',
            'value': 'es'
        }, {
            'name': 'Sri Lanka',
            'value': 'lk'
        }, {
            'name': 'Sudan',
            'value': 'sd'
        }, {
            'name': 'Suriname',
            'value': 'sr'
        }, {
            'name': 'Svalbard and Jan Mayen',
            'value': 'sj'
        }, {
            'name': 'Swaziland',
            'value': 'sz'
        }, {
            'name': 'Sweden',
            'value': 'se'
        }, {
            'name': 'Switzerland',
            'value': 'ch'
        }, {
            'name': 'Syrian Arab Republic',
            'value': 'sy'
        }, {
            'name': 'Taiwan, Province of China',
            'value': 'tw'
        }, {
            'name': 'Tajikistan',
            'value': 'tj'
        }, {
            'name': 'Tanzania, United Republic of',
            'value': 'tz'
        }, {
            'name': 'Thailand',
            'value': 'th'
        }, {
            'name': 'Timor-Leste',
            'value': 'tl'
        }, {
            'name': 'Togo',
            'value': 'tg'
        }, {
            'name': 'Tokelau',
            'value': 'tk'
        }, {
            'name': 'Tonga',
            'value': 'to'
        }, {
            'name': 'Trinidad and Tobago',
            'value': 'tt'
        }, {
            'name': 'Tunisia',
            'value': 'tn'
        }, {
            'name': 'Turkey',
            'value': 'tr'
        }, {
            'name': 'Turkmenistan',
            'value': 'tm'
        }, {
            'name': 'Turks and Caicos Islands',
            'value': 'tc'
        }, {
            'name': 'Tuvalu',
            'value': 'tv'
        }, {
            'name': 'Uganda',
            'value': 'ug'
        }, {
            'name': 'Ukraine',
            'value': 'ua'
        }, {
            'name': 'United Arab Emirates',
            'value': 'ae'
        }, {
            'name': 'United Kingdom',
            'value': 'gb'
        }, {
            'name': 'United States',
            'value': 'us'
        }, {
            'name': 'United States Minor Outlying Islands',
            'value': 'um'
        }, {
            'name': 'Uruguay',
            'value': 'uy'
        }, {
            'name': 'Uzbekistan',
            'value': 'uz'
        }, {
            'name': 'Vanuatu',
            'value': 'vu'
        }, {
            'name': 'Venezuela',
            'value': 've'
        }, {
            'name': 'Viet Nam',
            'value': 'vn'
        }, {
            'name': 'Virgin Islands, British',
            'value': 'vg'
        }, {
            'name': 'Virgin Islands, U.S.',
            'value': 'vi'
        }, {
            'name': 'Wallis and Futuna',
            'value': 'wf'
        }, {
            'name': 'Western Sahara',
            'value': 'eh'
        }, {
            'name': 'Yemen',
            'value': 'ye'
        }, {
            'name': 'Zambia',
            'value': 'zm'
        }, {
            'name': 'Zimbabwe',
            'value': 'zw'
        }];

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));

            if (!vm.element.PropertySet__c.googleAddressCountry) {
                vm.element.PropertySet__c.googleAddressCountry = 'All';
            }
            if (vm.element.PropertySet__c.googleAddressCountry.toLowerCase() === 'all') {
                vm.element.PropertySet__c.googleAddressCountry = vm.googleCountryOptions[0].value;
            }
        };

        vm.getGoogleTransOptions = function () {
            const options = [''];
            vm.element.children.forEach(function (child) {
                if (child.Active__c) {
                    options.push(child.Name);
                }
            })
            return options;
        };

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],62:[function(require,module,exports){
require('./Block.js');
require('./EditBlock.js');
require('./FilterBlock.js');
require('./InputBlock.js');
require('./RadioGroup.js');
require('./SelectableItems.js');
require('./Step.js');
require('./TypeAheadBlock.js');
require('./ActionBlock.js');
},{"./ActionBlock.js":53,"./Block.js":54,"./EditBlock.js":55,"./FilterBlock.js":56,"./InputBlock.js":57,"./RadioGroup.js":58,"./SelectableItems.js":59,"./Step.js":60,"./TypeAheadBlock.js":61}],63:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('checkboxPropertySet', {
            templateUrl: 'propertysets/input/checkbox.tpl.html',
            controller: CheckboxPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": false,
        "help": false,
        "helpText": "",
        "checkLabel": "",
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    }

    CheckboxPropertySetController.$inject = ['propCompUtil'];

    function CheckboxPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));

            vm.element.PropertySet__c.checkLabel = vm.element.PropertySet__c.checkLabel || vm.element.PropertySet__c.label;
        }
    }
})();

},{}],64:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('currencyPropertySet', {
            templateUrl: 'propertysets/input/currency.tpl.html',
            controller: CurrencyPropertySetControler,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "mask": null,
        "min": null,
        "max": null,
        "allowNegative": false,
        "hideGroupSep": false,
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "debounceValue": 0,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    }

    CurrencyPropertySetControler.$inject = ['propCompUtil'];

    function CurrencyPropertySetControler(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        Object.defineProperty(vm, 'maskStyle', {
            get: function () {
                return vm.element.PropertySet__c.mask != null && (vm.element.PropertySet__c.mask.constructor.name.toLowerCase() === 'string');
            },
            set: function (val) {
                if (val) {
                    vm.element.PropertySet__c.mask = "";
                } else {
                    vm.element.PropertySet__c.mask = 2;
                }
            }
        });

        vm.getSetMask = function (newVal) {
            if (newVal !== undefined) {
                vm.element.PropertySet__c.mask = vm.maskStyle ? newVal : (newVal === null ? null : Number(newVal));
            }

            return vm.element.PropertySet__c.mask;
        };
    }
})();

},{}],65:[function(require,module,exports){
(function () {
    'use strict';

    angular.module('omniscriptDesigner').component('customLwcPropertySet', {
        templateUrl: 'propertysets/input/customlwc.tpl.html',
        controller: CustomLWCPropertySetController,
        controllerAs: 'vm',
        bindings: {
            element: '<',
            scriptElement: '<'
        }
    }).filter('decoratePath', function () {
        return function (names) {
            return names.map(function (name) {
                return '%' + name.replace(/\./g, ':') + '%';
            });
        }
    })

    const DEFAULT_PROP_SET = {
        controlWidth: 12,
        show: null,
        conditionType: 'Hide if False',
        hide: false,
        lwcName: null,
        bStandalone: false,
        customAttributes: []
    };

    CustomLWCPropertySetController.$inject = ['propCompUtil', 'remoteActions', 'lwcService'];

    function CustomLWCPropertySetController(propCompUtil, remoteActions, lwcService) {
        var vm = this;
        vm.lwcList = [];
        propCompUtil.baseConstructor.apply(vm);

        (function loadLWCs() {
            lwcService
                .getLwcList()
                .then(function (lwcList) {
                    vm.lwcList = lwcList
                })
                .catch(function (err) {
                    console.log(err);
                });
        })();

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }
            vm.element.PropertySet__c = vm.updateDefaultProperties(
                DEFAULT_PROP_SET,
                vm.element.PropertySet__c,
                vm.getElementType(vm.element)
            );
        };

        vm.addNewProperty = function () {
            vm.element.PropertySet__c.customAttributes.push({});
        };
    }
})();

},{}],66:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('datePropertySet', {
            templateUrl: 'propertysets/input/date.tpl.html',
            controller: DatePropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "dateType": "string",
        "modelDateFormat": "yyyy-MM-dd",
        "dateFormat": "MM-dd-yyyy",
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "minDate": "",
        "maxDate": "",
        "label": null
    }

    DatePropertySetController.$inject = ['propCompUtil'];

    function DatePropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],67:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('dateTimePropertySet', {
            templateUrl: 'propertysets/input/datetime.tpl.html',
            controller: DateTimePropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "dateFormat": "MM-dd-yyyy",
        "timeFormat": "hh:mm a",
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "timezone": "Local",
        "minDate": "",
        "maxDate": "",
        "label": null
    }

    DateTimePropertySetController.$inject = ['propCompUtil'];

    function DateTimePropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],68:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('disclosurePropertySet', {
            templateUrl: 'propertysets/input/disclosure.tpl.html',
            controller: DisclosurePropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "text": "",
        "required": false,
        "readOnly": false,
        "checkLabel": "",
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "textKey": "",
        "label": null
    };

    DisclosurePropertySetController.$inject = ['tinyMCEService', 'propCompUtil'];
    function DisclosurePropertySetController(tinyMCEService, propCompUtil) {
        var vm = this;

        vm.tinymceOptions = tinyMCEService.tinymceOptions;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],69:[function(require,module,exports){
(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('emailPropertySet', {
            templateUrl: 'propertysets/input/email.tpl.html',
            controller: EmailPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "pattern": "",
        "ptrnErrText": "",
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "debounceValue": 0,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    };

    EmailPropertySetController.$inject = ['propCompUtil'];
    function EmailPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],70:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('filePropertySet', {
            templateUrl: 'propertysets/input/file.tpl.html',
            controller: FilePropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "help": false,
        "helpText": "",
        "show": null,
        "conditionType":"Hide if False",
        "HTMLTemplateId": "",
        "uploadContDoc": true,
        "contentParentId": [],
        "extraPayload": {},
        "remoteClass": "",
        "remoteMethod": "",
        "remoteOptions": {},
        "label": null,
        "errorMessage": {
            "custom":[],
            "default":null
        },
    };

    FilePropertySetController.$inject = ['propCompUtil'];
    function FilePropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        vm.updateParentContentIdAt = function(index, value) {
            vm.element.PropertySet__c.contentParentId[index] = value;
        };

        vm.deleteContentParentId = function(index) {
            vm.element.PropertySet__c.contentParentId.splice(index, 1);
        };

        vm.addNewContentParentIdRow = function() {
            vm.element.PropertySet__c.contentParentId.push(null);
        };

    }
})();

},{}],71:[function(require,module,exports){
(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('filterPropertySet', {
            templateUrl: 'propertysets/input/filter.tpl.html',
            controller: FilterPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "showInputWidth": false,
        "inputWidth": 12,
        "attributeCategoryCode": "",
        "type": "Select",
        "show": null,
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "label": null
    };

    FilterPropertySetController.$inject = ['propCompUtil'];
    function FilterPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],72:[function(require,module,exports){
(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('imagePropertySet', {
            templateUrl: 'propertysets/input/image.tpl.html',
            controller: ImagePropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "contentParentId": [],
        "uploadContDoc": true,
        "multiple": false,
        "help": false,
        "helpText": "",
        "show": null,
        "conditionType":"Hide if False",
        "HTMLTemplateId": "",
        "extraPayload": {},
        "remoteClass": "",
        "remoteMethod": "",
        "remoteOptions": {},
        "label": null,
        "errorMessage": {
            "custom":[],
            "default":null
        }
    };

    ImagePropertySetController.$inject = ['propCompUtil'];
    function ImagePropertySetController(propCompUtil) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        vm.updateParentContentIdAt = function(index, value) {
            vm.element.PropertySet__c.contentParentId[index] = value;
        };

        vm.deleteContentParentId = function(index) {
            vm.element.PropertySet__c.contentParentId.splice(index, 1);
        };

        vm.addNewContentParentIdRow = function() {
            vm.element.PropertySet__c.contentParentId.push(null);
        };

        propCompUtil.baseConstructor.apply(vm);

    }
})();

},{}],73:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('lookupPropertySet', {
            templateUrl: 'propertysets/input/lookup.tpl.html',
            controller: LookupPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "dataSource": {},
        "placeholder": "",
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "clearValue": true,
        "label": null,
        "errorMessage": {
            "custom":[],
            "default":null
        }
    };

    LookupPropertySetController.$inject = ['propCompUtil'];

    function LookupPropertySetController(propCompUtil) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        vm.handleDatasourceTypeChange = function () {
            if (vm.element.PropertySet__c.dataSource.type === 'SObject') {
                if (!vm.element.PropertySet__c.dataSource.mapItems) {
                    vm.element.PropertySet__c.dataSource.mapItems = {};
                }
                if (!vm.element.PropertySet__c.dataSource.mapItems.inputParameters) {
                    vm.element.PropertySet__c.dataSource.mapItems.inputParameters = [];
                }
                if (!vm.element.PropertySet__c.dataSource.mapItems.phase1MapItems) {
                    vm.element.PropertySet__c.dataSource.mapItems.phase1MapItems = [];
                }
                if (!vm.element.PropertySet__c.dataSource.mapItems.phase2MapItems) {
                    vm.element.PropertySet__c.dataSource.mapItems.phase2MapItems = [
                        {
                            "DomainObjectFieldAPIName__c": "name",
                            "InterfaceFieldAPIName__c": "",
                            "DomainObjectAPIName__c": "JSON",
                            "DomainObjectCreationOrder__c": 1
                        }, {
                            "DomainObjectFieldAPIName__c": "value",
                            "InterfaceFieldAPIName__c": "",
                            "DomainObjectAPIName__c": "JSON",
                            "DomainObjectCreationOrder__c": 1
                        }
                    ];
                }
            }
        }

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],74:[function(require,module,exports){
/* jshint -W041 */
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('multiselectPropertySet', {
            templateUrl: 'propertysets/input/multiselect.tpl.html',
            controller: MultiselectPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "horizontalMode": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "options": [{}],
        "optionSource": {
            "type": "",
            "source": ""
        },
        "controllingField": {
            "element": "",
            "type": "",
            "source": ""
        },
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "optionWidth": 100,
        "optionHeight": 100,
        "imageCountInRow": 3,
        "enableCaption": true,
        "disOnTplt": false,
        "label": null
    };

    MultiselectPropertySetController.$inject = ['propCompUtil', 'propertyEditorModalService'];

    function MultiselectPropertySetController(propCompUtil, propertyEditorModalService) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        vm.selectImage = function (option) {
            propertyEditorModalService.prepDocInsert(option, "imgId", true);
        };

        vm.addNewOption = function () {
            vm.element.PropertySet__c.options.push({});
        };

        propCompUtil.baseConstructor.apply(vm);

        vm.getSetDefaultValue = function (name) {
            if (name === undefined) {
                name = "";
            }
            return function (input) {
                if (input !== undefined) {
                    // Setter
                    var defaults = vm.element.PropertySet__c.defaultValue == null ? [] : vm.element.PropertySet__c.defaultValue.split(";");

                    let i = defaults.indexOf(name);
                    if (input) {
                        if (i == -1) {
                            defaults.push(name);
                        }
                    } else {
                        if (i != -1) {
                            defaults.splice(i, 1);
                        }
                    }
                    vm.element.PropertySet__c.defaultValue = defaults.length > 0 ? defaults.join(";") : null;
                }
                // Getter
                return (vm.element.PropertySet__c.defaultValue == null ? false : vm.element.PropertySet__c.defaultValue.split(";").includes(name));
            };
        };

        vm.updateNameIfDefault = function (newName, oldName) {
            var defaults = vm.element.PropertySet__c.defaultValue == null ? [] : vm.element.PropertySet__c.defaultValue.split(";");
            let i = defaults.indexOf(oldName);
            if (i != -1) {
                defaults.splice(i, 1, newName);
                vm.element.PropertySet__c.defaultValue = defaults.join(";");
            }
        };
    }
})();

},{}],75:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('numberPropertySet', {
            templateUrl: 'propertysets/input/number.tpl.html',
            controller: NumberPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "pattern": "",
        "ptrnErrText": "",
        "mask": null,
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "debounceValue": 0,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    };

    NumberPropertySetController.$inject = ['propCompUtil'];
    function NumberPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],76:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('passwordPropertySet', {
            templateUrl: 'propertysets/input/password.tpl.html',
            controller: PasswordPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "help": false,
        "helpText": "",
        "pattern": "",
        "ptrnErrText": "",
        "minLength": 0,
        "maxLength": 255,
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "debounceValue": 0,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    };

    PasswordPropertySetController.$inject = ['propCompUtil'];
    function PasswordPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],77:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('radioPropertySet', {
            templateUrl: 'propertysets/input/radio.tpl.html',
            controller: RadioPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "horizontalMode": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "options": [{}],
        "optionSource": {
            "type": "",
            "source": ""
        },
        "controllingField": {
            "element": "",
            "type": "",
            "source": ""
        },
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "optionWidth": 100,
        "optionHeight": 100,
        "imageCountInRow": 3,
        "enableCaption": true,
        "disOnTplt": false,
        "label": null
    };

    RadioPropertySetController.$inject = ['propCompUtil', 'propertyEditorModalService'];
    function RadioPropertySetController(propCompUtil, propertyEditorModalService) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        vm.addNewOption = function() {
            vm.element.PropertySet__c.options.push({});
        };

        vm.selectImage = function(option) {
            propertyEditorModalService.prepDocInsert(option, "imgId", true);
        };

        propCompUtil.baseConstructor.apply(vm);

        vm.getSetDefaultValue = function (name) {
            if (name === undefined) {
                name = "";
            }
            return function(input){
                if (input!==undefined){
                    // Setter
                    if (input){
                        vm.element.PropertySet__c.defaultValue = name;
                    } else {
                        if (vm.element.PropertySet__c.defaultValue === name){
                            vm.element.PropertySet__c.defaultValue = null;
                        }
                    }
                }
                // Getter
                return vm.element.PropertySet__c.defaultValue === name;
            };
        };

        vm.updateNameIfDefault = function (newName, oldName) {
            if (vm.element.PropertySet__c.defaultValue === oldName) {
                vm.element.PropertySet__c.defaultValue = newName;
            }
        };
    }
})();

},{}],78:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('rangePropertySet', {
            templateUrl: 'propertysets/input/range.tpl.html',
            controller: RangePropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "rangeLow": 5,
        "rangeHigh": 10,
        "step": 1,
        "mask": null,
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    };

    RangePropertySetController.$inject = ['propCompUtil'];
    function RangePropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],79:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('selectPropertySet', {
            templateUrl: 'propertysets/input/select.tpl.html',
            controller: SelectPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "options": [{}],
        "optionSource": {
            "type": "",
            "source": ""
        },
        "controllingField": {
            "element": "",
            "type": "",
            "source": ""
        },
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    };

    SelectPropertySetController.$inject = ['propCompUtil', 'propertyEditorModalService'];
    function SelectPropertySetController(propCompUtil, propertyEditorModalService) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        vm.addNewOption = function() {
            vm.element.PropertySet__c.options.push({});
        };

        propCompUtil.baseConstructor.apply(vm);

        vm.getSetDefaultValue = function (name) {
            if (name === undefined) {
                name = "";
            }
            return function(input){
                if (input!==undefined){
                    // Setter
                    if (input){
                        vm.element.PropertySet__c.defaultValue = name;
                    } else {
                        if (vm.element.PropertySet__c.defaultValue === name){
                            vm.element.PropertySet__c.defaultValue = null;
                        }
                    }
                }
                // Getter
                return vm.element.PropertySet__c.defaultValue === name;
            };
        };

        vm.updateNameIfDefault = function (newName, oldName) {
            if (vm.element.PropertySet__c.defaultValue === oldName) {
                vm.element.PropertySet__c.defaultValue = newName;
            }
        };
    }
})();

},{}],80:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('signaturePropertySet', {
            templateUrl: 'propertysets/input/signature.tpl.html',
            controller: SignaturePropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "help": false,
        "helpText": "",
        "minLength": 0,
        "maxLength": 255,
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "debounceValue": 0,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    };

    SignaturePropertySetController.$inject = ['propCompUtil'];
    function SignaturePropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],81:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('telephonePropertySet', {
            templateUrl: 'propertysets/input/telephone.tpl.html',
            controller: TelephonePropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "mask": "(999) 999-9999",
        "pattern": "",
        "ptrnErrText": "",
        "minLength": 0,
        "maxLength": 255,
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "debounceValue": 0,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    };

    TelephonePropertySetController.$inject = ['propCompUtil'];
    function TelephonePropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],82:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('textAreaPropertySet', {
            templateUrl: 'propertysets/input/textarea.tpl.html',
            controller: TextAreaPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "pattern": "",
        "ptrnErrText": "",
        "minLength": 0,
        "maxLength": 255,
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "debounceValue": 0,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    };

    TextAreaPropertySetController.$inject = ['propCompUtil'];
    function TextAreaPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],83:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('textPropertySet', {
            templateUrl: 'propertysets/input/text.tpl.html',
            controller: TextPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "mask": "",
        "pattern": "",
        "ptrnErrText": "",
        "minLength": 0,
        "maxLength": 255,
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "debounceValue": 0,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    };

    TextPropertySetController.$inject = ['propCompUtil'];
    function TextPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],84:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('timePropertySet', {
            templateUrl: 'propertysets/input/time.tpl.html',
            controller: TimePropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "timeType": "string",
        "modelTimeFormat": "HH:mm:ss.sss'Z'",
        "timeFormat": "hh:mm a",
        "minTime": "",
        "maxTime": "",
        "label": null
    };

    TimePropertySetController.$inject = ['propCompUtil'];
    function TimePropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],85:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('urlPropertySet', {
            templateUrl: 'propertysets/input/url.tpl.html',
            controller: URLPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "controlWidth": 12,
        "showInputWidth": false,
        "inputWidth": 12,
        "required": false,
        "repeat": false,
        "repeatClone": false,
        "repeatLimit": null,
        "readOnly": false,
        "defaultValue": null,
        "help": false,
        "helpText": "",
        "ptrnErrText": "",
        "show": null,
        "conditionType": "Hide if False",
        "accessibleInFutureSteps": false,
        "debounceValue": 0,
        "HTMLTemplateId": "",
        "hide": false,
        "disOnTplt": false,
        "label": null
    };

    URLPropertySetController.$inject = ['propCompUtil'];
    function URLPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],86:[function(require,module,exports){
require('./CheckboxPropertySet.js');
require('./CurrencyPropertySet.js');
require('./DatePropertySet.js');
require('./DateTimePropertySet.js');
require('./DisclosurePropertySet.js');
require('./EmailPropertySet.js');
require('./FilePropertySet.js');
require('./FilterPropertySet.js');
require('./ImagePropertySet.js');
require('./LookupPropertySet.js');
require('./MultiselectPropertySet.js');
require('./NumberPropertySet.js');
require('./PasswordPropertySet.js');
require('./RadioPropertySet.js');
require('./RangePropertySet.js');
require('./SelectPropertySet.js');
require('./SignaturePropertySet.js');
require('./TelephonePropertySet.js');
require('./TextPropertySet.js');
require('./TextAreaPropertySet.js');
require('./TimePropertySet.js');
require('./URLPropertySet.js');
require('./CustomLWCPropertySet.js');

},{"./CheckboxPropertySet.js":63,"./CurrencyPropertySet.js":64,"./CustomLWCPropertySet.js":65,"./DatePropertySet.js":66,"./DateTimePropertySet.js":67,"./DisclosurePropertySet.js":68,"./EmailPropertySet.js":69,"./FilePropertySet.js":70,"./FilterPropertySet.js":71,"./ImagePropertySet.js":72,"./LookupPropertySet.js":73,"./MultiselectPropertySet.js":74,"./NumberPropertySet.js":75,"./PasswordPropertySet.js":76,"./RadioPropertySet.js":77,"./RangePropertySet.js":78,"./SelectPropertySet.js":79,"./SignaturePropertySet.js":80,"./TelephonePropertySet.js":81,"./TextAreaPropertySet.js":82,"./TextPropertySet.js":83,"./TimePropertySet.js":84,"./URLPropertySet.js":85}],87:[function(require,module,exports){
/*global fileNsPrefixDot*/
(function () {
    'use strict';
    angular.module('omniscriptDesigner')
        .config(['remoteActionsProvider', function (remoteActionsProvider) {
            'use strict';
            remoteActionsProvider.setRemoteActions({
                getOmniScript: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetOmniScript",
                    config: {
                        buffer: false
                    }
                },
                getDocuments: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetDocuments",
                    config: {
                        buffer: false
                    }
                },
                getReusableOmniScripts: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetReusableOmniScripts",
                    config: {
                        buffer: false
                    }
                },
                getOmniScriptTypes: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetOmniScriptTypes",
                    config: {
                        buffer: false
                    }
                },
                getElements: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetElements",
                    config: {
                        buffer: false
                    }
                },
                loadElementTypes: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadElementTypes",
                    config: {
                        buffer: false
                    }
                },
                loadScriptElementTypes: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadScriptElementTypes",
                    config: {
                        buffer: false
                    }
                },
                getMatchingDRBundles: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.getMatchingDRBundles",
                    config: {
                        buffer: false
                    }
                },
                loadIntegrationProcedureKeys2: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadIntegrationProcedureKeys2",
                    config: {
                        buffer: false
                    }
                },
                loadVlocityUITemplates: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadVlocityUITemplates",
                    config: {
                        buffer: false
                    }
                },
                uploadDocument: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.uploadDocument",
                    config: {
                        buffer: false
                    }
                },
                getAllDocuments: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetAllDocuments",
                    config: {
                        buffer: false
                    }
                },
                getLanguageCodeMap: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.getLanguageCodeMap",
                    config: {
                        buffer: false
                    }
                },
                loadLanguages: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadLanguages",
                    config: {
                        buffer: false
                    }
                },
                loadPropertySetForElement: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadPropertySetForElement",
                    config: {
                        buffer: false
                    }
                },
                getKnowledgeArticles: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.getKnowledgeArticles",
                    config: {
                        buffer: false
                    }
                },
                saveOmniScript: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.SaveOmniScript",
                    config: {
                        buffer: false
                    }
                },
                saveElement: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.SaveElement",
                    config: {
                        buffer: false
                    }
                },
                deleteOmniScript: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.DeleteOmniScript",
                    config: {
                        buffer: false
                    }
                },
                deleteElement: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.DeleteElement",
                    config: {
                        buffer: false
                    }
                },
                getAllObjects: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetAllObjects",
                    config: {
                        buffer: false
                    }
                },
                getExternalObjects: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetExternalObjects",
                    config: {
                        buffer: false
                    }
                },
                getFieldsForObject: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetFieldsForObject",
                    config: {
                        buffer: false
                    }
                },
                getExternalObjects: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetExternalObjects",
                    config: {
                        buffer: false
                    }
                },
                createVersion: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.CreateVersion",
                    config: {
                        buffer: false
                    }
                },
                activateVersion: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.ActivateVersion",
                    config: {
                        buffer: false
                    }
                },
                deactivateVersion: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.DeactivateVersion",
                    config: {
                        buffer: false
                    }
                },
                loadDocuSignTemplates: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadDocuSignTemplates",
                    config: {
                        buffer: false
                    }
                },
                viewFullDataJson: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.ViewFullDataJson",
                    config: {
                        buffer: false
                    }
                },
                GetEmailTemplates: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetEmailTemplates",
                    config: {
                        buffer: false
                    }
                },
                GetEmailDocuments: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetEmailDocuments",
                    config: {
                        buffer: false
                    }
                },
                ensureDocumentUploads: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.EnsureDocumentUploads",
                    config: {
                        buffer: false
                    }
                },
                getMatrixNames: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetMatrixNames",
                    config: {
                        buffer: false
                    }
                },
                getMatrixHeaders: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetMatrixHeaders",
                    config: {
                        buffer: false
                    }
                },
                exportOmniScript: {
                    action: fileNsPrefixDot() + "OmniScriptHomeController.exportScripts",
                    config: {
                        buffer: true,
                        escape: false
                    }
                },
                BuildJSONV2: {
                    action: fileNsPrefixDot() + "OmniScriptHomeController.BuildJSONV2",
                    config: {
                        escape: false,
                        buffer: false
                    }
                },
                toggleElementTrigger: {
                    action: fileNsPrefixDot() + "OmniScriptHomeController.toggleElementTrigger",
                    config: {
                        buffer: false
                    }
                },
                createElement: {
                    action: fileNsPrefixDot() + "OmniScriptHomeController.createElement",
                    config: {
                        escape: false,
                        buffer: true
                    }
                },
                getCustomLabels: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.getCustomLabels",
                    config: {
                        escape: false,
                        buffer: true
                    }
                },
                updateScriptLastPreviewPage: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.updateScriptLastPreviewPage",
                    config: {
                        escape: false,
                        buffer: true
                    }
                },
                createScript: fileNsPrefixDot() + "OmniScriptHomeController.createScript",
                queryOmniScriptKeys: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.QueryOmniScriptKeys",
                    config: {
                        buffer: false
                    }
                },
                loadIntegrationProcedureElementTypes: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadIntegrationProcedureElementTypes",
                    config: {
                        buffer: false
                    }
                },
                testIntegrationProcedure: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.testIntegrationProcedure",
                    config: {
                        escape: false
                    }
                },
                getAllLWCNames: {
                    action: fileNsPrefixDot() + "LWCDesignerController.getAllLWCNames",
                    config: {
                        escape: false,
                        buffer: true
                    }
                },
                getLWCBundles: {
                    action: fileNsPrefixDot() + "LWCDesignerController.getLWCBundles",
                    config: {
                        escape: false,
                        buffer: false
                    }
                },
                vlocityFormulaParserFunctions: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.vlocityFormulaParserFunctions",
                    config: {
                        escape: false
                    }
                },
                GetScheduledJobs: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetScheduledJobs",
                    config: {
                        escape: false
                    }
                }
            });
        }]).config(function ($locationProvider) {
            $locationProvider.html5Mode({
                enabled: !!(window.history && history.pushState),
                requireBase: false
            });
        }).config(['$compileProvider', function ($compileProvider) {
            $compileProvider.debugInfoEnabled(false);
        }]).config(['$localizableProvider', function ($localizableProvider) {
            $localizableProvider.setLocalizedMap(window.i18n);
            $localizableProvider.setDebugMode(window.ns === '');
            $localizableProvider.setSyncModeOnly();
        }]).config(function ($typeaheadProvider) {
            angular.extend($typeaheadProvider.defaults, {
                watchOptions: true,
                minLength: 0,
                limit: 1000
            });
        }).config(function ($tooltipProvider) {
            angular.extend($tooltipProvider.defaults, {
                delay: {
                    show: 0,
                    hide: 100
                }
            });
        });
})();

},{}],88:[function(require,module,exports){
var PaletteElement = require('../../oui/util/PaletteElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module('omniscriptDesigner')
    .run(function($rootScope, isIntegrationProcedure, OmniScriptJson,
                    ElementTypesJson,  $localizable) {
        'use strict';
        var defaultConfigForScriptElement = {
            'Name': $localizable(isIntegrationProcedure ? 'IntProcNewIntProc' : 'OmniDesNewOmniScript')
        };
        defaultConfigForScriptElement[fileNsPrefix() + 'IsProcedure__c'] = !!isIntegrationProcedure;

        if (OmniScriptJson.Id) {
            $rootScope.scriptElement = new ScriptElement(OmniScriptJson);
            if ($rootScope.scriptElement.IsActive__c) {
                var pageDescription = $('.pageDescription');
                pageDescription.append('&nbsp;<span class="active text-success">' +
                        $localizable('OmniDesActive') + '</span>');
                pageDescription.addClass('vlocity');
            }
        } else {
            $rootScope.scriptElement = new ScriptElement(defaultConfigForScriptElement);
        }
        if (typeof sforce !== 'undefined') {
            if (sforce.console && sforce.console.isInConsole()) {
                sforce.console.setTabTitle($rootScope.scriptElement.Name);
                if (isIntegrationProcedure) {
                    sforce.console.setTabIcon('custom:custom63');
                } else {
                    sforce.console.setTabIcon('standard:template');
                }
                document.getElementById('omnidesigner_goback').style.display = 'none';
            }
        }
        var titleEl = document.querySelector('title');
        if (!titleEl) {
            var headEl = document.querySelector('head');
            titleEl = document.createElement('title');
            headEl.appendChild(titleEl);
        }
        titleEl.innerText = (isIntegrationProcedure ? 'IP: ' : 'OmniScript: ') + $rootScope.scriptElement.Name;

        ElementTypesJson.filter(function (element) {
            return !/(Button)/gi.test(element);
        }).map(function (element) {
            return PaletteElement.factory(element);
        });

        $rootScope.vlocityOpenUrl = window.vlocityOpenUrl;
    });

},{"../../oui/util/PaletteElement.js":137,"../../oui/util/ScriptElement.js":138}],89:[function(require,module,exports){
var PaletteElement = require('../../oui/util/PaletteElement.js');
var CanvasElement = require('../../oui/util/CanvasElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module('omniscriptDesigner')
    .controller('elementPalette', function ($scope, isIntegrationProcedure, ElementTypesJson, ReusableScriptsInit) {
        'use strict';
        $scope.groupedControlsGroupCollapse = $scope.navigationGroupCollapse = $scope.inputControlsGroupCollapse = false;

        if (!isIntegrationProcedure) {
            $scope.reusableScripts = ReusableScriptsInit.map(function (script) {
                return PaletteElement.factory(script);
            }).sort();
        }
        $scope.allElements = ElementTypesJson.filter(function (element) {
            return !/(Button)/gi.test(element);
        }).sort().map(function (element) {
            return PaletteElement.factory(element);
        });
    });

},{"../../oui/util/CanvasElement.js":135,"../../oui/util/PaletteElement.js":137,"../../oui/util/ScriptElement.js":138}],90:[function(require,module,exports){
var CanvasElement = require('../../oui/util/CanvasElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module('omniscriptDesigner')
    .controller('omniscriptDesignerController', function ($rootScope, $scope, $q, remoteActions, fixMissingPropertiesFilter,
        $location, $timeout, save, $localizable, $modal, ElementsJson, $injector, isIntegrationProcedure) {
        'use strict';
        var urlPrefix = window.location.protocol + '//' + window.location.hostname;

        function sortByOrder(a, b) {
            if (a.Order__c === undefined) {
                return (b.Order__c === undefined) ? 0 : 1;
            } else if (b.Order__c === undefined) {
                return -1;
            }
            return a.Order__c - b.Order__c;
        }

        $timeout(function () {
            $rootScope.$broadcast('activeElementInCanvas', $rootScope.scriptElement);
        });
        var transformedElements = [],
            inProgressMap = {};
        ElementsJson.forEach(function (elementPreConvert) {
            var element = CanvasElement.fromJson(elementPreConvert);
            if (element) {
                fixMissingPropertiesFilter(element);
                transformedElements.push(element);
                inProgressMap[element.Id] = element;
            }
        });
        for (var i = 0; i < transformedElements.length; i++) {
            var transformedElement = transformedElements[i];
            if (transformedElement.ParentElementId__c) {
                if (inProgressMap[transformedElement.ParentElementId__c]) {
                    inProgressMap[transformedElement.ParentElementId__c].children.push(transformedElement);
                }
                transformedElements.splice(i, 1);
                i--;
            }
        }
        transformedElements.forEach(function (transformedElement) {
            $rootScope.scriptElement.children.push(transformedElement);
        });
        $rootScope.scriptElement.each(function (element) {
            if (element.children) {
                element.children.sort(sortByOrder);
            }
        });

        $scope.saveOmniScript = function () {
            return save($rootScope.scriptElement);
        };

        $scope.toggleCollapsePalette = function () {
            $rootScope.collapsePalette = !$rootScope.collapsePalette;
        };

        $scope.toggleFullScreen = function () {
            $rootScope.fullScreen = !$rootScope.fullScreen;
        };

        $scope.showHowToUse = function () {
            var modal = $modal({
                title: 'How to launch',
                templateUrl: 'modal-how-to-use-this.tpl.html',
                show: false,
                html: true,
                backdrop: 'static',
                controller: function ($scope, $timeout) {
                    var pageToMode = {
                        'Universal Page': 'OmniScriptUniversalPage',
                        'Universal Page with Header': 'OmniScriptUniversalPageWHeader',
                        'Universal Page with Header/Sidebar': 'OmniScriptUniversalPageWHeaderSidebar',
                        'Mobile': 'OmniScriptUniversalMobilePage',
                        'Communities': 'OmniScriptUniversalCommunitiesPage',
                        'Console': 'OmniScriptUniversalPageConsole'
                    };

                    $scope.modes = Object.keys(pageToMode);
                    $scope.currentMode = $scope.modes[0];
                    $scope.vertOrHoriz = 'lightning';
                    $scope.$watch('currentMode', buildUrl);
                    $scope.$watch('vertOrHoriz', buildUrl);
                    $scope.embedLayout = 'lightning';
                    $scope.lwcLayout = 'lightning';
                    $scope.lwcEnabled = $rootScope.scriptElement.IsLwcEnabled__c;
                    $scope.tabs = [{
                        title: 'Angular',
                        content: '',
                    }];
                    $scope.tabs.activeTab = 0;
                    var nsPrefix = window.ns.replace(/__$/, '');

                    if ($rootScope.scriptElement.IsLwcEnabled__c) {
                        $scope.tabs.push({
                            title: 'LWC',
                            content: ''
                        })
                    }

                    function buildUrl() {
                        var mode, layout, layoutParams, verHor;

                        //default mode is vertical, vertical is true
                        mode = $scope.vertOrHoriz === 'horizontal' ? 'horizontal' : 'vertical';
                        verHor = $scope.vertOrHoriz !== 'horizontal';

                        if ($scope.currentMode !== 'Mobile' && $scope.currentMode !== 'Communities') {
                            if ($scope.vertOrHoriz === 'lightning') {
                                layout = 'lightning'
                            }
                            else if ($scope.vertOrHoriz === 'newport') {
                                layout = 'newport';
                            }
                        }
                        else { //defaults to vertical if currentMode changes
                            $scope.vertOrHoriz = 'vertical';
                        }

                        //default layout parameters
                        layoutParams = layout ? '&layout=' + layout : '';

                        $scope.url = urlPrefix + '/apex/' + window.ns +

                            pageToMode[$scope.currentMode] + '?id={0}' + layoutParams + '#/OmniScriptType/' + $rootScope.scriptElement.Type__c +
                            '/OmniScriptSubType/' + $rootScope.scriptElement.SubType__c +
                            '/OmniScriptLang/' + $rootScope.scriptElement.Language__c +
                            '/ContextId/{0}/PrefillDataRaptorBundle//' + verHor;

                        layoutParams = '&scriptMode=' + mode;

                        if (($scope.currentMode !== 'Mobile' && $scope.currentMode !== 'Communities')) {
                            if (layout) {
                                layoutParams = layoutParams + '&layout=' + layout;
                            }
                        }


                        $scope.urlWithParam = urlPrefix + '/apex/' + window.ns +
                            pageToMode[$scope.currentMode] + '?id={0}&OmniScriptType=' + encodeURIComponent($rootScope.scriptElement.Type__c) +
                            '&OmniScriptSubType=' + encodeURIComponent($rootScope.scriptElement.SubType__c) +
                            '&OmniScriptLang=' + encodeURIComponent($rootScope.scriptElement.Language__c) +
                            '&PrefillDataRaptorBundle=' + layoutParams + '&ContextId={0}';


                        if (!isIntegrationProcedure && $rootScope.scriptElement.IsLwcEnabled__c) {
                            const compilerService = $injector.get('compilerService'),
                                type = $rootScope.scriptElement.Type__c,
                                subType = $rootScope.scriptElement.SubType__c,
                                language = $rootScope.scriptElement.Language__c,
                                lwcName = compilerService.getLwcName(type, subType, language),
                                cTag = compilerService.getComponentTag(lwcName),
                                consoleTabTitle = $rootScope.scriptElement.PropertySet__c.consoleTabTitle,
                                consoleTabIcon = $rootScope.scriptElement.PropertySet__c.consoleTabIcon,
                                componentNs = window.isInsidePckg === "true" || window.isInsidePckg === true ? 'c' : (nsPrefix || 'c');

                            let consoleTabTitleUrlParam = '',
                                consoleTabIconUrlParam = '';

                            if (consoleTabTitle) {
                                consoleTabTitleUrlParam = `&c__tabLabel=${consoleTabTitle}`;
                            }

                            if (consoleTabIcon) {
                                consoleTabIconUrlParam = `&c__tabIcon=${consoleTabIcon}`;
                            }

                            $scope.lwcWrapperUrl = urlPrefix + '/lightning/cmp/' + (window.ns || 'c__') + 'vlocityLWCOmniWrapper?c__target=' + componentNs + ':' + lwcName + '&c__layout=' + $scope.lwcLayout +
                                consoleTabTitleUrlParam + consoleTabIconUrlParam;
                            $scope.lwcTag = `<${cTag} layout="${$scope.lwcLayout}" prefill={prefill}></${cTag}>`;
                            $scope.lwcTag2 = `<${cTag} layout="${$scope.lwcLayout}" prefill='\\{"contextId":"abc","OmniScriptType":"FAQ"}'></${cTag}>`;
                            $scope.lwcName = lwcName;
                        }
                    }

                    var appName = $rootScope.scriptElement.Name.replace(/( |_|-)/gi, '');
                    var elementPrefix = (nsPrefix || nsPrefix === '' ? nsPrefix : 'c') + ':';

                    $scope.onChangeLayout = function (scp) {
                        if ($scope.embedLayout === "lightning") {
                            $scope.textarea = $scope.makeVFTemplateForLayout("lightning");
                        }
                        else if ($scope.embedLayout === "newport") {
                            $scope.textarea = $scope.makeVFTemplateForLayout("newport");
                        }
                        else {
                            $scope.textarea = $scope.makeVFTemplateForLayout();
                        }
                    };

                    $scope.onChangeLwcLayout = function () {
                        if (isIntegrationProcedure) return;

                        const compilerService = $injector.get('compilerService'),
                            type = $rootScope.scriptElement.Type__c,
                            subType = $rootScope.scriptElement.SubType__c,
                            language = $rootScope.scriptElement.Language__c,
                            lwcName = compilerService.getLwcName(type, subType, language),
                            cTag = compilerService.getComponentTag(lwcName),
                            consoleTabTitle = $rootScope.scriptElement.PropertySet__c.consoleTabTitle,
                            consoleTabIcon = $rootScope.scriptElement.PropertySet__c.consoleTabIcon,
                            componentNs = window.isInsidePckg === "true" || window.isInsidePckg === true ? 'c' : (nsPrefix || 'c');

                        let consoleTabTitleUrlParam = '',
                            consoleTabIconUrlParam = '';

                        if (consoleTabTitle) {
                            consoleTabTitleUrlParam = `&c__tabLabel=${consoleTabTitle}`;
                        }

                        if (consoleTabIcon) {
                            consoleTabIconUrlParam = `&c__tabIcon=${consoleTabIcon}`;
                        }

                        $scope.lwcWrapperUrl = urlPrefix + '/lightning/cmp/' + (window.ns || 'c__') + 'vlocityLWCOmniWrapper?c__target=' + componentNs + ':' + lwcName + '&c__layout=' + $scope.lwcLayout +
                            consoleTabTitleUrlParam + consoleTabIconUrlParam;
                        $scope.lwcTag = `<${cTag} layout="${$scope.lwcLayout}" prefill={prefill}></${cTag}>`;
                        $scope.lwcTag2 = `<${cTag} layout="${$scope.lwcLayout}" prefill='\\{"contextId":"abc","OmniScriptType":"FAQ"}'></${cTag}>`;
                    }

                    var xmls = 'http://www.w3.org/2000/svg',
                        xlink = 'http://www.w3.org/1999/xlink';


                    $scope.makeVFTemplateForLayout = function (layout) {
                        var header, sidebar, scriptLayout;
                        // default to classic
                        if (!layout) {
                            header = true;
                            sidebar = true;
                            scriptLayout = '';
                        }
                        // lightning, newport layout
                        else {
                            header = false;
                            sidebar = false;
                            scriptLayout = '\t\t\tscriptLayout=\"' + layout + '\"\n';
                        }

                        return '<apex:page standardStylesheets=\"false\" ' +
                            'showHeader=\"' + header + '\" sidebar=\"' + sidebar + '\" docType=\"html-5.0\">\n' +
                            '\t<div class=\"vlocity via-slds\" xmlns=\"' + xmls + '\" xmlns:xlink=\"' + xlink + '\" ng-app=\"' + appName + '\">\n' +
                            '\t\t<' + elementPrefix + 'BusinessProcessComponent\n' +
                            '\t\t\tstrOmniScriptType=\"' + $rootScope.scriptElement.Type__c + '\"\n' +
                            '\t\t\tstrOmniScriptSubType=\"' + $rootScope.scriptElement.SubType__c + '\"\n' +
                            '\t\t\tstrOmniScriptLang=\"' + $rootScope.scriptElement.Language__c + '\"\n' +
                            '\t\t\tpreviewMode=\"{!$CurrentPage.parameters.previewEmbedded}\"\n' +
                            '\t\t\tverticalMode=\"{!$CurrentPage.parameters.verticalMode}\"\n' +
                            '\t\t\tstrOmniScriptId=\"{!$CurrentPage.parameters.designerPreviewId}\"\n' +
                            scriptLayout + '\t\t\t/>\n' +
                            '\t\t<script type=\"text/javascript\">\n' +
                            '\t\t\tvar modules = [\'vlocity-business-process\'];\n' +
                            '\t\t\tvar myModule = angular.module(\'' + appName + '\', modules);\n' +
                            '\t\t</script>\n' +
                            ($rootScope.scriptElement.CustomJavaScript__c && $rootScope.scriptElement.CustomJavaScript__c !== '' ?
                                ('\t\t<script type=\"text/javascript\">\n' +
                                    $rootScope.scriptElement.CustomJavaScript__c +
                                    '\n\t\t</script>\n') : '') +
                            $rootScope.scriptElement.TestHTMLTemplates__c +
                            '\n\t</div>\n' +
                            '\t<' + elementPrefix + 'VFActionFunction/> \n' +
                            '</apex:page>';
                    }

                    $scope.textarea = $scope.makeVFTemplateForLayout($scope.embedLayout);
                }
            });
            modal.$promise.then(modal.show)
                .then(function (done) {
                    $timeout(function () {
                        var clipboard = new Clipboard('.copy-btn');
                        clipboard.on('success', function (e) {
                            showTooltip(e.trigger, 'Copied!');
                        });

                        function showTooltip(elem, msg) {
                            $(elem).addClass('tooltipped tooltipped-s');
                            elem.setAttribute('aria-label', msg);
                            $(elem).on('mouseleave', function (e) {
                                $(elem).removeClass('tooltipped tooltipped-s');
                                elem.removeAttribute('aria-label');
                            });
                        }
                    });
                });
        };

        $scope.viewFullDataJson = function () {
            var modal = $modal({
                title: $localizable('OmniDesFullDataJsonModalTitle'),
                templateUrl: 'modal-view-full-data-json.tpl.html',
                show: false,
                html: true,
                controller: function ($scope, $timeout) {
                    $scope.initFullDataJson = function () {
                        $scope.loading = true;
                        var scriptId = window.location ? window.location.href.split(/[?&]/).find(function (item) {
                            return /^id\=/.test(item);
                        }) : null;
                        if (scriptId) {
                            scriptId = scriptId.replace(/^id=/, '');
                            remoteActions.viewFullDataJson(scriptId)
                                .then(function (omniScriptResult) {
                                    $scope.loading = false;
                                    $scope.dataJson = omniScriptResult.replace(/&quot;/g, '"');
                                    $scope.dataJson = JSON.stringify(JSON.parse($scope.dataJson), null, 4);
                                });
                        }
                    }
                }
            });

            modal.$promise.then(modal.show)
                .then(function (done) {
                    $timeout(function () {
                        var clipboard = new Clipboard('.copy-btn');
                        clipboard.on('success', function (e) {
                            showTooltip(e.trigger, 'Copied!');
                        });

                        function showTooltip(elem, msg) {
                            $(elem).addClass('tooltipped tooltipped-s');
                            elem.setAttribute('aria-label', msg);
                            $(elem).on('mouseleave', function (e) {
                                $(elem).removeClass('tooltipped tooltipped-s');
                                elem.removeAttribute('aria-label');
                            });
                        }
                    });
                });
        };
    });

},{"../../oui/util/CanvasElement.js":135,"../../oui/util/ScriptElement.js":138}],91:[function(require,module,exports){
/* globals _, VOUINS */
var CanvasElement = require('../../oui/util/CanvasElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

(function () {
    'use strict';
    var angular = window.angular;

    angular.module('omniscriptDesigner')
        .controller('propertiesController', function ($rootScope, $scope, save, $timeout) {
            $scope.showJsonEditor = false;
            $scope.propertySetAsText = '';

            $scope.toggleJsonEditor = function () {
                $scope.showJsonEditor = !$scope.showJsonEditor;
            };

            $scope.onJsonChange = function (propSetAsText) {
                $scope.propertySetAsText = propSetAsText;
            };

            $scope.$watch('propertySetAsText', function (newValue, oldValue) {
                try {
                    if ($scope.showJsonEditor) {
                        $scope.activeElement.PropertySet__c = JSON.parse($scope.propertySetAsText);
                        $scope.propertySetInvalid = false;
                    }
                } catch (exp) {
                    $scope.propertySetInvalid = true;
                }
            });

            $rootScope.$on('activeElementInCanvas', function (event, args) {
                if (angular.isString(args)) {
                    $scope.activeElement = CanvasElement.getById(args);
                } else {
                    $scope.activeElement = args;
                }
                if (!$scope.activeElement) {
                    $scope.activeElement = $rootScope.scriptElement;
                }

                $scope.showJsonEditor = false;
            });

            function without(obj, keys) {
                return Object.keys(obj).filter(function (key) {
                    return keys.indexOf(key) === -1;
                }).reduce(function (result, key) {
                    result[key] = obj[key];
                    return result;
                }, {});
            }

            // save changes on every call
            var timeouts = {};
            $scope.$watch(function () {
                if ($scope.activeElement) {
                    return without($scope.activeElement, ['parent', 'children', 'saving', 'collapse',
                        'errors', 'allowDrop', 'originalJson', 'filter', 'deleted', 'deleting'
                    ]);
                } else {
                    return [];
                }
            }, _.debounce(function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    var elementToSave = $scope.activeElement;
                    if (elementToSave &&
                        // only autosave script element if it has an ID,
                        //i.e. it has been explicitly saved already
                        !(elementToSave instanceof ScriptElement && !elementToSave.Id)) {
                        if (elementToSave.Id && timeouts[elementToSave.Id]) {
                            $timeout.cancel(timeouts[elementToSave.Id]);
                        }
                        timeouts[elementToSave.Id] = $timeout(function () {
                            save(elementToSave);
                            $rootScope.$broadcast('elementPropertyChanged');
                        }, 750);
                        $scope.propertySetAsText = JSON.stringify($scope.activeElement.PropertySet__c, null, 4);
                    }
                }
            }, 250), true);

        });
}());

},{"../../oui/util/CanvasElement.js":135,"../../oui/util/ScriptElement.js":138}],92:[function(require,module,exports){
/* globals vlocityVFActionFunctionControllerHandlers */
angular.module('omniscriptDesigner')
    .controller('scriptFormController', function ($scope, $rootScope, $window, $modal, remoteActions, $localizable, $drvExport, backcompatExport, isIntegrationProcedure, $injector) {
        'use strict';

        let compilerService = null,
            toolingService = null,
            bpService = null;

        if (!isIntegrationProcedure) {
            compilerService = $injector.get('compilerService');
            toolingService = $injector.get('toolingService');
            bpService = $injector.get('bpService');
        }

        $scope.createVersion = function () {
            $rootScope.scriptElement.saving = true;
            $rootScope.scriptElement.activating = true;
            var input = angular.toJson({
                Id: $rootScope.scriptElement.Id
            });
            var options = angular.toJson({
                url: isIntegrationProcedure ? 'integrationproceduredesigner' : 'omniscriptdesigner'
            });
            var className = fileNsPrefixDot() + 'BusinessProcessController.BusinessProcessControllerOpen';

            vlocityVFActionFunctionControllerHandlers.runServerMethod(className, 'CreateVersion',
                input, options, false)
                .then(function (response) {
                    var responseObj = JSON.parse(response);
                    if ($window.top !== $window && $window.sforce.console.isInConsole()) {
                        sforce.console.getEnclosingPrimaryTabId(function (parentTabResponse) {
                            sforce.console.getEnclosingTabId(function (response) {
                                if (response.id === parentTabResponse.id) {
                                    sforce.console.openPrimaryTab(null, fixUpUrlWithParams(responseObj.url), true);
                                } else {
                                    sforce.console.openSubtab(parentTabResponse.id, fixUpUrlWithParams(responseObj.url), true, '');
                                }
                                sforce.console.closeTab(response.id);
                            });
                        });
                    } else {
                        window.location = fixUpUrlWithParams(responseObj.url);
                    }
                });
        };

        $scope.activateVersion = function () {

            // Validate we have ALL 3 elements in order to allow activate when LWC is enabled
            if (!isIntegrationProcedure && $rootScope.scriptElement.IsLwcEnabled__c) {
                const type = $rootScope.scriptElement.Type__c,
                    subType = $rootScope.scriptElement.SubType__c,
                    language = $rootScope.scriptElement.Language__c;

                compilerService.validate(type, subType, language)
                    .then(() => {
                        var modalScope = $scope.$new();
                        modalScope.ok = () => preActivateVersion(true);
                        $modal({
                            title: 'Activation',
                            templateUrl: 'confirmationModal.tpl.html',
                            content: $localizable('OmniDesConfirmActivationWithLwc'),
                            scope: modalScope,
                            show: true
                        });
                    })
                    .catch(() => {
                        $rootScope.scriptElement.saving = false;
                        $rootScope.scriptElement.activating = false;
                    });

            } else {
                preActivateVersion(true);
            }
        };

        function fixUpUrlWithParams(url) {
            var searchParams = window.location.search.substr(1).split('&');
            var hrefEl = document.createElement('a');
            hrefEl.href = url;
            var newSearchParams = hrefEl.search.substr(1).split('&');
            var combinedSearchParams = searchParams.reduce(function (obj, param) {
                var keyValue = param.split('=');
                obj[keyValue[0]] = keyValue[1];
                return obj;
            }, {});
            newSearchParams.forEach(function (param) {
                var keyValue = param.split('=');
                combinedSearchParams[keyValue[0]] = keyValue[1];
            });
            combinedSearchParams.cb = Date.now();
            return hrefEl.pathname + '?' + Object.keys(combinedSearchParams).reduce(function (str, paramKey) {
                if (paramKey && paramKey.length > 0 && combinedSearchParams[paramKey] !== undefined) {
                    str += '&' + paramKey + '=' + combinedSearchParams[paramKey];
                }
                return str;
            }, '');
        }

        $scope.deactivateVersion = () => preActivateVersion(false);

        $scope.delete = function () {
            var modalScope = $scope.$new();
            modalScope.ok = function () {
                remoteActions.deleteOmniScript($rootScope.scriptElement.Id)
                    .then(function (response) {
                        if ($window.top !== $window && $window.sforce.console.isInConsole()) {
                            sforce.console.getEnclosingTabId(function (response) {
                                sforce.console.closeTab(response.id);
                            });
                        } else {
                            window.vlocityOpenUrl(response);
                        }
                    });
            };
            $modal({
                title: $localizable('OmniDesConfirmDeleteTitle'),
                template: 'confirmationModal.tpl.html',
                content: $localizable(isIntegrationProcedure ?
                    'IntDesConfirmDeleteContent' : 'OmniDesConfirmDeleteContent'),
                scope: modalScope,
                show: true
            });
        };

        $scope.export = function ($event) {
            if ($event.altKey) {
                backcompatExport($rootScope.scriptElement);
                return;
            }
            $drvExport({
                scope: $scope,
                drvExport: $rootScope.scriptElement.Id,
                drvSuggestedName: $rootScope.scriptElement.Name,
                drvDataPackType: isIntegrationProcedure ? 'IntegrationProcedure' : 'OmniScript'
            });
        };

        $scope.disableOpenInLwcDesigner = function() {
            return $rootScope.scriptElement.IsLwcEnabled__c && compilerService.getLwcErrors($rootScope.scriptElement.Type__c, $rootScope.scriptElement.SubType__c, $rootScope.scriptElement.Language__c).length > 0;
        }

        function preActivateVersion(isActivate) {

            // Enable spinners
            $rootScope.scriptElement.saving = true;
            $rootScope.scriptElement.activating = true;

            executeActivation(isActivate)
                .then(responseObj => {

                    if (isIntegrationProcedure || !$rootScope.scriptElement.IsLwcEnabled__c || /redirectTo/.test(responseObj.url)) {
                        postActivation(responseObj);
                    } else {
                        let promise = Promise.resolve();
                        if (isActivate) {
                            // Process the LWC
                            promise = processLwc(isActivate);
                        }
                        promise.then(() => postActivation(responseObj));
                    }
                });
        }

        function executeActivation(isActivate) {
            return new Promise((resolve, reject) => {
                // Create the request
                var input = angular.toJson({
                    Id: $rootScope.scriptElement.Id
                });
                var options = angular.toJson({
                    url: isIntegrationProcedure ? 'integrationproceduredesigner' : 'omniscriptdesigner'
                });
                var className = fileNsPrefixDot() + 'BusinessProcessController.BusinessProcessControllerOpen';
                const method = isActivate ? 'ActivateVersion' : 'DeactivateVersion';

                // Execute the request
                vlocityVFActionFunctionControllerHandlers.runServerMethod(className, method,
                    input, options, false)
                    .then(response => resolve(JSON.parse(response)))
                    .catch(reject);
            });
        }

        function postActivation(responseObj) {
            // Disable spinners
            $rootScope.scriptElement.saving = false;
            $rootScope.scriptElement.activating = false;

            // Complete the activation
            var url = responseObj.url;
            if ($window.top !== $window && $window.sforce.console.isInConsole()) {
                sforce.console.getEnclosingPrimaryTabId(function (parentTabResponse) {
                    sforce.console.getEnclosingTabId(function (response) {
                        if (response.id === parentTabResponse.id) {
                            sforce.console.openPrimaryTab(null, fixUpUrlWithParams(url), true);
                        } else {
                            sforce.console.openSubtab(parentTabResponse.id, fixUpUrlWithParams(url), true);
                        }
                        sforce.console.closeTab(response.id);
                    });
                });
            } else {
                window.location = fixUpUrlWithParams(url);
            }
        }

        /**
         * If a component exists, re-deploys the LWC in order to overwrite the "Not found" component
         */
        function processLwc(isActivate) {
            return new Promise((resolve, reject) => {

                const type = $rootScope.scriptElement.Type__c,
                    subType = $rootScope.scriptElement.SubType__c,
                    language = $rootScope.scriptElement.Language__c,
                    sId = $rootScope.scriptElement.Id,
                    addRuntimeNamespace = window.omniLwcCompilerConfig.isInsidePckg,
                    namespace = window.omniLwcCompilerConfig.namespacePrefix;

                if (isActivate) {

                    const lwcName = compilerService.getLwcName(type, subType, language);
                    bpService.loadActiveLwc(type, subType, language)
                        .then(jsonObj => compilerService.compileActivated(lwcName, jsonObj, addRuntimeNamespace, namespace))
                        .then(resources => toolingService.deployResources(lwcName, resources, sId))
                        .then(resolve)
                        .catch(error => compilerService.showDeploymentError(error, $localizable('OmniDesLwcDeployError')).then((resolve)));
                } else {

                    compilerService.deactivateLwc(type, subType, language, sId, addRuntimeNamespace, namespace)
                        .then(resolve)
                        .catch(error => {

                            // Re-activate the OS, we were not able to deploy. Notify the user that needs to verify the LWC manually.
                            executeActivation(true)
                                .finally(() => {
                                    compilerService.showDeploymentError(error, $localizable('OmniDesLwcDeactivateDeployError'))
                                        .then(resolve);
                                });
                        });
                }
            });
        }
    });

},{}],93:[function(require,module,exports){
var PaletteElement = require('../../oui/util/PaletteElement.js');
var CanvasElement = require('../../oui/util/CanvasElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module('omniscriptDesigner')
  .controller('structureCanvas', function ($rootScope, $scope, $q, remoteActions, save,
    deleteElement, $timeout, $interval, $modal, $localizable, NotSupportedElmService) {
    'use strict';

    $scope.notDispOnTmltObj = NotSupportedElmService.getList();

    $scope.onDNDDrop = function (event, index, item, external, type, allowedType, eleParent) {
      var elementBeingDragged, parent;
      var eleParentIsActionBlock = eleParent && eleParent.Type__c && eleParent.Type__c.type === 'action-block';
      // we're moving an existing element
      if (angular.isString(item)) {
        elementBeingDragged = CanvasElement.getById(item);
        if (elementBeingDragged.saving) {
          return false;
        }

        parent = elementBeingDragged.parent();
        var oldIndex = parent.children.indexOf(elementBeingDragged);
        var newParentId = $(event.currentTarget).data('elementId');
        // check we're not dropping something on to itself
        if (newParentId === item) {
          return false;
        }

        // Prevent existing actions from being dropped inside an action-block when max number of children
        // in action block >= 4 and prevent existing Set Values and Set Errors from being dragged in
        if (newParentId !== parent.Id && eleParentIsActionBlock &&
            (eleParent.children.length >= 4 || elementBeingDragged.Type__c.label === 'Set Values' ||
                elementBeingDragged.Type__c.label === 'Set Errors')) {
          return false;
        }

        if (newParentId === parent.Id) {
          // if the oldIndex is the same as the newIndex then this element was moved upwards
          // therefore we need to find a copy of it at the end of the list.
          if (oldIndex === index) {
            oldIndex = parent.children.lastIndexOf(elementBeingDragged);
            var removed = parent.children.splice(oldIndex, 1);
            if (removed.length === 0) {
              console.log('Could not delete element');
            }
            return elementBeingDragged;
          }
        }

        // if we've moved the element lower in the same parent
        // then we need to defer the removal to prevent the new element
        // being inserted in the wrong place - this is because
        // when this function returns the angular-drap-and-drop-lists
        // library will do the actual move of the element into `index`
        // but if we've removed something earlier in the list `index` will be
        // off by one.
        if (oldIndex < index && parent.Id === newParentId) {
          $timeout(function () {
            var removed = parent.children.splice(oldIndex, 1);
            if (removed.length === 0) {
              console.log('Could not delete element');
            }
          });
        } else {
          // we can't do the others in a timeout (e.g. if moving up
          // or to a different parent) because the logic causes duplicate
          // elements to appear and/or disappear completely. It's only
          // safe to do the timeout option in the same parent.
          var removed = parent.children.splice(oldIndex, 1);
          if (removed.length === 0) {
            console.log('Could not delete element');
          }
        }
        elementBeingDragged.ParentElementId__c = null;
      } else {
        // Prevent new action elements from being dropped from the palette when the number of childrens
        // in an existing action-block is >= 4. Also prevents Set Values and Set Errors from being dropped into an Action Block
        if (eleParentIsActionBlock && (eleParent.children.length >= 4 || item.label === 'Set Values' || item.label === 'Set Errors')) {
          return false;
        }
        var paletteElementBeingDragged = PaletteElement.getPaletteElement(item.label, item.scriptElement ? {
          Type: item.scriptElement.Type__c,
          'Sub Type': item.scriptElement.SubType__c,
          'Language': item.scriptElement.Language__c
        } : {}, item.scriptElement);
        elementBeingDragged = new CanvasElement(paletteElementBeingDragged);
      }
      $timeout(function () {
        // in addition any elements we've dropped it in front of
        // need their Order__c updated so we need to save them too
        var parentOfDraggedEl = elementBeingDragged.parent();
        // we'll go through all the children because if some came with an existing
        // Order__c which was using base 10 or 100 they will be completely out of place now
        // - there's logic in Save to avoid resending unchanged data which will avoid
        //   the performance hit of unnecessary requests
        for (var i = 0; i < parentOfDraggedEl.children.length; i++) {
          save(parentOfDraggedEl.children[i]);
        }

        $rootScope.$broadcast('activeElementInCanvas', elementBeingDragged);
        $scope.setDisOnTpltPrp(elementBeingDragged);
      }, 200);

      return elementBeingDragged;
    };

    var debounce = null;
    $scope.onDNDMove = function (event, index, type, external, allowedType, eleParent) {
      // prevent DnD actions from being moved inside an action-block when max number of children in action block > 4
      if (eleParent && eleParent.Type__c && eleParent.Type__c.type === 'action-block' && eleParent.children.length > 4) {
        return;
      }

      // scroll the structure panel if we need to on mouse over while dragging
      var lastMouseEvent = null;
      var config = {
        activationDistance: 30,
        scrollDistance: 50,
        scrollInterval: 250
      };

      if (debounce) {
        $timeout.cancel(debounce);
      }
      debounce = $timeout(function () {
        if (!lastMouseEvent) return;
        var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var scrollY = 0;
        if (lastMouseEvent.clientY < config.activationDistance) {
          // If the mouse is on the top of the viewport within the activation distance.
          scrollY = -config.scrollDistance;
        } else if (lastMouseEvent.clientY > viewportHeight - config.activationDistance) {
          // If the mouse is on the bottom of the viewport within the activation distance.
          scrollY = config.scrollDistance;
        }

        if (scrollY !== 0) {
          var structureCanvas = angular.element('.structureCanvas')[0];
          structureCanvas.scrollTop += scrollY;
        }
      }, 250);

      lastMouseEvent = event;
      return true; // always return true because we can always drop here
    };

    $scope.onCanvasElementClick = function (element, $event) {
      $rootScope.$broadcast('activeElementInCanvas', element);
      if ($event) {
        $event.stopPropagation();
      }
    };

    /**
     * [onCanvasCheckboxElementClick save the updated element based on updated value of disOnTplt]
     * @param  {[type]} element [checked element which is dragged element from omniscript component to Script Configuration ]
     * @param  {[type]} evnt  [event after clicking on element]
     * @return {[type]}         [None]
     */
    $scope.onCanvasCheckboxElementClick = function (element, evnt) {
      save(element);
      $rootScope.$broadcast('elementPropertyChanged');
      if (evnt) {
        evnt.stopPropagation();
      }
    };


    /**
     * [setDisOnTpltPrp Initialize checkbox model value based disOnTplt and non-supported element list]
     * @param {[type]} element [element of editBlock]
     */
    $scope.setDisOnTpltPrp = function (element) {
      if (element.PropertySet__c.disOnTplt === undefined) {
        element.PropertySet__c.disOnTplt = false;
        save(element);
        return;
      }
    };


    $scope.delete = function (element) {
      return $q(function (resolve, reject) {
        var modalScope = $scope.$new();
          modalScope.ok = function () {
            var parent = element.parent();
            deleteElement(element)
                .then(function () {
                    parent.each(function (child) {
                        save(child);
                    });
                })
                .then(function () {
                    $rootScope.$broadcast('activeElementInCanvas', element.ParentElementId__c || element.OmniScriptId__c);
                    resolve(true);
                });
        };
        return $modal({
          title: $localizable('OmniDesConfirmDeleteTitle'),
          templateUrl: 'confirmationModal.tpl.html',
          content: $localizable('OmniDesConfirmDeleteElContent'),
          scope: modalScope,
          show: true
        });
      });
    };

    $scope.clone = function (element) {
      var clone = element.clone();
      var parent = clone.parent();

      // prevent cloning of actions inside an action-block when max number of children in action block >= 4
      if (parent && parent.Type__c && parent.Type__c.type === 'action-block' && parent.children.length >= 4) {
          return;
      }

      parent.children.splice(parent.children.indexOf(element) + 1, 0, clone);
      // we'll go through all the children because if some came with an existing
      // Order__c which was using base 10 or 100 they will be completely out of place now
      // - there's logic in Save to avoid resending unchanged data which will avoid
      //   the performance hit of unnecessary requests
      var promises = [];
      for (var i = 0; i < parent.children.length; i++) {
        promises.push(save(parent.children[i]));
      }
      $q.all(promises).then(function () {
        $rootScope.$broadcast('activeElementInCanvas', clone);
      });
    };

    $rootScope.$on('activeElementInCanvas', function (event, args) {
      if (angular.isString(args)) {
        $scope.activeElement = CanvasElement.getById(args);
      } else {
        $scope.activeElement = args;
      }
      if (!$scope.activeElement) {
        $scope.activeElement = $rootScope.scriptElement;
      }
    });

    var getNextColor = (function () {
      var colors = ['pink', 'orange', '#008ab3', '#f65327', '#05a6df', '#eac438', '#58a300'];
      var index = 0,
        mapOfKeysToColor = {};
      return function (key) {
        if (!mapOfKeysToColor[key]) {
          if (index === colors.length) {
            index = 0;
          }
          mapOfKeysToColor[key] = colors[index++];
        }
        return mapOfKeysToColor[key];
      };
    })();

    function compileShowGroup(group, element) {
      var evalString = ['('],
        evalStringIfUndefined = ['('];
      var colorMap = $scope.popover.controllingElementsColors;
      for (var i = 0; i < group.rules.length; i++) {
        if (i > 0) {
          if (group.rules[i].group || group.rules[i].field) {
            evalString.push(group.operator === 'AND' ? '&&\n' : '||\n');
          }
          if (group.rules[i].field) {
            evalStringIfUndefined.push(group.operator === 'AND' ? '&&\n' : '||\n');
          }
        }
        if (group.rules[i].group) {
          evalString.push(compileShowGroup(group.rules[i].group, element));
        } else if (group.rules[i].field) {
          var fieldName = group.rules[i].field.split('|')[0];
          var key = '$scope[\'' + fieldName + '\']',
            nextColor = getNextColor(fieldName);
          if (colorMap[fieldName]) {
            if (colorMap[fieldName].indexOf(nextColor) < 0) {
              colorMap[fieldName].push(nextColor);
            }
            if (!colorMap[element.Name]) {
              colorMap[element.Name] = [nextColor];
            } else if (colorMap[element.Name].indexOf(nextColor) < 0) {
              colorMap[element.Name].push(nextColor);
            }
            evalString.push(key);
            var condition = group.rules[i].condition;
            evalStringIfUndefined.push(key + ' != undefined');
            evalString.push(condition === '=' ? '==' : (condition === '<>' ? '!=' : condition));
            evalString.push('\'' + group.rules[i].data + '\'');
          }
        }
      }
      evalString.push(')');
      evalStringIfUndefined.push(')');
      if (evalStringIfUndefined.length < 3) {
        return evalString.join(' ');
      }
      return '(' + evalString.join(' ') + '&&' + evalStringIfUndefined.join(' ') + ')';
    }

    function compileShow(element) {
      if (element.PropertySet__c && element.PropertySet__c.show) {
        var evalString = compileShowGroup(element.PropertySet__c.show.group, element);
        evalString = evalString.replace(/(\|\||\&\&)*\s*\(\s*\)/g, '');
        if (!/^(\(\s*\)|\(\(\s*\)(\|\|\(\s*\))*\)|)$/.test(evalString)) {
          /*jshint evil:true */
          try {
            return new Function('$scope', 'return ' + evalString + ';');
          } catch (e) {
            console.log('Could not compile show rules into function', e,
              'function($scope) {\n\treturn ' + evalString + ';\n}');
          }
        }
      }
      return function () {
        return true;
      };
    }

    function evaluateShowRules(rules) {
      var scope = {},
        noRules = true;
      for (var i = 0; i < rules.length; i++) {
        if (rules[i].element) {
          noRules = false;
          scope[rules[i].element] = rules[i].value;
        }
      }
      if ($rootScope.scriptElement) {
        Object.keys($scope.popover.controllingElementsColors).forEach(function (key) {
          $scope.popover.controllingElementsColors[key] = [];
        });
        // filter the Structure Element and it's children to hide filtered out rules
        $rootScope.scriptElement.each(function (element) {
          if (element instanceof CanvasElement) {
            if (noRules) {
              element.filter = false;
              compileShow(element)(scope);
              if (angular.isObject(element.collapse) && element.collapse.automated) {
                element.collapse = false;
              }
            } else {
              var dontCollapseAgain = false;
              if (element.filter === true) {
                dontCollapseAgain = true;
              }
              element.filter = !compileShow(element)(scope);
              if (element.filter === true && !dontCollapseAgain) {
                element.collapse = {
                  automated: true
                };
              } else if (angular.isObject(element.collapse) && element.collapse.automated) {
                element.collapse = false;
              }
            }
          }
        });
      }
    }

    $scope.$watch('popover.rules', evaluateShowRules, true);

    $rootScope.$on('elementPropertyChanged', function (event, args) {
      $scope.popover.controllingEntities();
      evaluateShowRules($scope.popover.rules);
    });

    $scope.popover = {
      rules: [{
        element: null,
        value: ''
      }],
      controllingElementsColors: {},
      addRule: function () {
        $scope.popover.rules.push({
          element: null,
          value: ''
        });
      },
      clear: function () {
        $scope.popover.rules = [{
          element: null,
          value: ''
        }];
      },
      deleteRule: function (rule) {
        var indexToRemove = $scope.popover.rules.indexOf(rule);
        $scope.popover.rules.splice(indexToRemove, 1);
        if ($scope.popover.rules.length === 0) {
          $scope.popover.clear();
        }
      },
      controllingEntities: function () {
        function getAllEntitiesForGroup(group) {
          var names = [];
          if (group.rules) {
            for (var i = 0; i < group.rules.length; i++) {
              if (group.rules[i].group) {
                names = names.concat(getAllEntitiesForGroup(group.rules[i].group));
              }
              if (group.rules[i].field) {
                names.push(group.rules[i].field.split('|')[0]);
              }
            }
          }
          return names;
        }

        function getAllNamesForElement(element) {
          var controllingEntityNames = element.PropertySet__c &&
            element.PropertySet__c.show ? getAllEntitiesForGroup(element.PropertySet__c.show.group) : [];
          var children = element.children;
          for (var i = 0; i < children.length; i++) {
            controllingEntityNames = controllingEntityNames.concat(getAllNamesForElement(children[i]));
          }
          return controllingEntityNames;
        }
        var allNames = getAllNamesForElement($rootScope.scriptElement);

        for (var i = 0; i < allNames.length; i++) {
          var nextColor = getNextColor(allNames[i]);
          if (!$scope.popover.controllingElementsColors[allNames[i]]) {
            $scope.popover.controllingElementsColors[allNames[i]] = [nextColor];
          } else if ($scope.popover.controllingElementsColors[allNames[i]].indexOf(nextColor) < 0) {
            $scope.popover.controllingElementsColors[allNames[i]].push(nextColor);
          }
          var existingIndex = allNames.indexOf(allNames[i]);
          if (existingIndex !== i && existingIndex > -1) {
            allNames.splice(i--, 1);
          }
        }
        return allNames;
      }
    };

    $scope.collapseAll = function () {
      $rootScope.scriptElement.each(function (element) {
        element.collapse = true;
      });
    };

    $scope.expandAll = function () {
      $rootScope.scriptElement.each(function (element) {
        element.collapse = false;
      });
    };

    $scope.allExpanded = function () {
      var allExpanded = true;
      if ($rootScope.scriptElement) {
        $rootScope.scriptElement.each(function (element) {
          if (element.collapse) {
            allExpanded = false;
          }
        });
      }
      return allExpanded;
    };

  });

},{"../../oui/util/CanvasElement.js":135,"../../oui/util/PaletteElement.js":137,"../../oui/util/ScriptElement.js":138}],94:[function(require,module,exports){
angular.module('omniscriptDesigner')
    .controller('tabbedController', function ($rootScope, $scope, $timeout, $modal,
        interTabMsgBus, $localizable, remoteActions, customLabelService, $injector, isIntegrationProcedure) {
        'use strict';

        let compilerService = null,
            toolingService = null,
            bpService = null;

        if (!isIntegrationProcedure) {
            compilerService = $injector.get('compilerService');
            toolingService = $injector.get('toolingService');
            bpService = $injector.get('bpService');
        }

        $scope.tabs = [{
            title: $localizable('OmniDesTabProperties'),
            content: ''
        }];
        $scope.tabs.activeTab = 0;
        $scope.lwc = {
            valid: false,
            name: ''
        }
        $scope.currentScriptElementInPreview = null;
        $scope.viewModel = {
            testJSON: '',
            lwcTestJSON: '',
            resetData: true,
            contextId: '',
            lwcPrefillKeyPair: null,
            lwcContextId: ''
        };

        var pageToMode = {
            'Lightning Universal Page': 'OmniScriptUniversalPage',
            'Lightning': 'OmniScriptPreviewPage',
            'Newport': 'OmniScriptPreviewPage',
            'Lightning Mobile (iPad)': 'OmniScriptUniversalPage',
            'Lightning Mobile (iPhone)': 'OmniScriptUniversalPage',
            'Newport Mobile (iPad)': 'OmniScriptUniversalPage',
            'Newport Mobile (iPhone)': 'OmniScriptUniversalPage',
            'Communities': 'OmniScriptUniversalCommunitiesPage',
            'Classic Universal Page': 'OmniScriptUniversalPage'
        };
        var customViews = {};
        var newOptions = {};

        pageToMode[$localizable('OmniDesTabPreviewVertMode')] = 'OmniScriptPreviewPage';
        pageToMode[$localizable('OmniDesTabPreviewHorizMode')] = 'OmniScriptHoriPreviewPage';
        $scope.previewModes = Object.keys(pageToMode);
        $scope.lwcPreviewModes = ['Lightning', 'Newport'];
        $scope.languages = customLabelService.translations;
        $scope.previewLanguage = 'en_US';
        $scope.lwcPreviewLanguage = 'en_US';
        $scope.previewMode = $rootScope.scriptElement.LastPreviewPage__c || 'Lightning Universal Page';
        $scope.lwcPreviewMode = $rootScope.scriptElement.PropertySet__c.lastLwcPreviewMode || 'Lightning';
        $scope.previewWarning = {
            key: null,
            value: null
        };

        var needsReload = true,
            needsLwcReload = true;

        //this was added by me
        $scope.$on('customViewUpdated', function (event, property) {
            if (property) {
                customViews = property;
            }
        });

        //when the selected tab is preview then and only then populate the preview select
        $scope.$watch(function () {
            return $scope.tabs.activeTab;
        }, function (newValue, oldValue) {
            if (newValue === 1 && $rootScope.scriptElement.Id) {
                //this will reset the select control so that the model does not goff up new comment
                $scope.previewModes = Object.keys(angular.extend({}, pageToMode, customViews));

                if (($rootScope.scriptElement !== $scope.currentScriptElementInPreview) || needsReload) {
                    $scope.currentScriptElementInPreview = $rootScope.scriptElement;
                    loadPreviewPage();
                }
                $rootScope.collapsePalette = true;
            } else if (newValue === 2 && $rootScope.scriptElement.Id) {
                if (($rootScope.scriptElement !== $scope.currentScriptElementInPreview) || needsLwcReload) {
                    $scope.currentScriptElementInPreview = $rootScope.scriptElement;
                    loadLwcPreview();
                }
                $rootScope.collapsePalette = true;
            } else {
                $rootScope.collapsePalette = $rootScope.fullScreen = false;
            }
        });

        $rootScope.$on('activeElementInCanvas', function (event, element, skipTabChange) {
            if ($scope.tabs.activeTab !== 0 && !skipTabChange) {
                $scope.tabs.activeTab = 0;
            }
        });

        $scope.$watch('scriptElement.Id', function (id) {
            if (id && $scope.tabs.length < 3) {
                $scope.tabs.push({
                    title: $localizable('OmniDesTabPreview'),
                    content: ''
                });
                applyLwcTab();
            }
        });
        $scope.$watch('scriptElement.IsLwcEnabled__c', function () {
            applyLwcTab();
        });

        $rootScope.$on('save', function (event, element) {
            needsReload = true;
            needsLwcReload = true;
        });

        $rootScope.$on('delete', function (event, element) {
            needsReload = true;
            needsLwcReload = true;

            // need to wipe out existing element in JSON
            var pathToElement = [element.Name];
            while (element.parent().Id !== $rootScope.scriptElement.Id) {
                element = element.parent();
                pathToElement.splice(0, 0, element.Name);
            }
            if ($scope.viewModel && $scope.viewModel.testJSON) {
                var testJSON = JSON.parse($scope.viewModel.testJSON);
                // traverse json to find the element we need to delete
                var currentObj = testJSON;
                while (pathToElement.length > 1) {
                    if (!currentObj[pathToElement[0]]) {
                        return;
                    }
                    currentObj = currentObj[pathToElement.splice(0, 1)[0]];
                }
                delete currentObj[pathToElement[0]];
                interTabMsgBus.set('ouiTestJson', JSON.stringify(testJSON, null, 2));
                $scope.viewModel.testJSON = JSON.stringify(testJSON, null, 2);
            }
        });

        $rootScope.$on('saved', function (event, element) {
            if ($scope.tabs.activeTab === 1 &&
                element && element.scriptElement() !== element) {
                loadPreviewPage();
            }

            applyLwcTab();
        });

        $rootScope.$on('deleted', function (event, element) {
            if ($scope.tabs.activeTab === 1) {
                loadPreviewPage();
            }
        });

        $rootScope.$on('label-changes-saved', function (event, element) {
            loadPreviewPage();
        });

        var pendingLoad = null;

        function loadLwcPreview() {
            const isActive = $rootScope.scriptElement.IsActive__c;

            if (!isActive) {
                loadLwcFrame();
            } else {
                const type = $rootScope.scriptElement.Type__c,
                    subType = $rootScope.scriptElement.SubType__c,
                    language = $rootScope.scriptElement.Language__c,
                    sId = $rootScope.scriptElement.Id,
                    lwcName = compilerService.getLwcName(type, subType, language);

                toolingService.getLwcComponentBundle(lwcName)
                    .then(bundle => {
                        // Check that we are under the same sId
                        if (bundle && (bundle.Description || '').indexOf('- ' + sId) > -1) {
                            console.info('Loading component preview');
                            loadLwcFrame();
                        } else {
                            console.info('No component or sId mismatch - deploying');
                            $scope.lwcDeployingWarning = $localizable('OmniDesWaitForLwcDeployment');
                            performDeploy(true);
                        }
                    });
            }
        }


        function loadLwcFrame() {
            if (pendingLoad) {
                $timeout.cancel(pendingLoad);
            }
            pendingLoad = $timeout(function () {

                // Create the params for the iframe
                const iframe = $('#lwcFrame')[0],
                    type = $rootScope.scriptElement.Type__c,
                    subType = $rootScope.scriptElement.SubType__c,
                    language = $rootScope.scriptElement.Language__c,
                    isActive = $rootScope.scriptElement.IsActive__c,
                    ns = isActive ? 'c' : window.omniLwcCompilerConfig.namespacePrefix,
                    lwcName = isActive ? compilerService.getLwcName(type, subType, language) : 'omniscriptPreview',
                    urlParams = [
                        'ns=' + ns,
                        'lwc=' + lwcName,
                        'layout=' + $scope.lwcPreviewMode.toLowerCase(),
                        'isdtp=p1',
                        'sfdcIFrameOrigin=' + encodeURIComponent(window.location.protocol + '//' + window.location.hostname),
                        'sfdcIFrameHost=web'
                    ];

                if (!isActive) {
                    urlParams.push('id=' + $rootScope.scriptElement.Id);
                }

                // The prefill is typically small, so cloning will have no impact.
                // Also, this allow us to remove empty properties
                const rawPrefill = $scope.viewModel.lwcPrefillKeyPair || {};
                if ($rootScope.scriptElement.Language__c === 'Multi-Language') {
                    urlParams.push('LanguageCode=' + $scope.lwcPreviewLanguage);
                    // Language code needs to be added to prefill when OmniScript is activated and
                    // previewed inside of OmniScript Designer
                    if ($rootScope.scriptElement.IsActive__c) {
                        rawPrefill.LanguageCode = $scope.lwcPreviewLanguage;
                    }
                }
                if ($scope.viewModel.lwcContextId) {
                    rawPrefill.ContextId = $scope.viewModel.lwcContextId;
                }
                if (Object.keys(rawPrefill).length > 0) {
                    let prefill = JSON.stringify(rawPrefill, (k, v) => !v ? undefined : v);
                    urlParams.push('prefill=' + encodeURIComponent(prefill));
                }

                needsLwcReload = false;
                needsReload = true;

                // Set the new URL
                iframe.src = '/apex/OmniscriptLwcPreviewPage?' + urlParams.join('&');
            }, 500);
        }

        $scope.downloadLwc = function () {
            const type = $rootScope.scriptElement.Type__c,
                subType = $rootScope.scriptElement.SubType__c,
                language = $rootScope.scriptElement.Language__c,
                lwcName = compilerService.getLwcName(type, subType, language),
                addRuntimeNamespace = window.omniLwcCompilerConfig.isInsidePckg,
                namespace = window.omniLwcCompilerConfig.namespacePrefix;

            // Enable spinners
            $rootScope.scriptElement.saving = true;
            $rootScope.scriptElement.activating = true;

            let promise = $rootScope.scriptElement.IsActive__c ?
                bpService.loadActiveLwc(type, subType, language) :
                bpService.loadInactiveLwc($rootScope.scriptElement.Id);

            promise
                .then(jsonObj => compilerService.getComponentZip(lwcName, jsonObj, addRuntimeNamespace, namespace))
                .then(stream => saveAs(b64toFile(stream), lwcName + '.zip'))
                .catch(error => compilerService.showDeploymentError(error, $localizable('OmniDesLwcDeployError')))
                .finally(() => {
                    $scope.$apply(() => {
                        $rootScope.scriptElement.saving = false;
                        $rootScope.scriptElement.activating = false;
                    });
                });
        }

        $scope.deployLwc = function () {
            var modalScope = $scope.$new();
            modalScope.ok = () => performDeploy();
            $modal({
                title: $localizable('OmniDesDeploy'),
                templateUrl: 'confirmationModal.tpl.html',
                content: $localizable('OmniDesConfirmLwcDeployment'),
                scope: modalScope,
                show: true
            });
        }

        function performDeploy(hideConfirmation = false) {
            const type = $rootScope.scriptElement.Type__c,
                subType = $rootScope.scriptElement.SubType__c,
                language = $rootScope.scriptElement.Language__c,
                sId = $rootScope.scriptElement.Id,
                lwcName = compilerService.getLwcName(type, subType, language),
                addRuntimeNamespace = window.omniLwcCompilerConfig.isInsidePckg,
                namespace = window.omniLwcCompilerConfig.namespacePrefix;

            // Enable spinners
            $rootScope.scriptElement.saving = true;
            $rootScope.scriptElement.activating = true;

            bpService.loadActiveLwc(type, subType, language)
                .then(jsonObj => compilerService.compileActivated(lwcName, jsonObj, addRuntimeNamespace, namespace))
                .then(resources => toolingService.deployResources(lwcName, resources, sId))
                .then(() => {
                    if (!hideConfirmation) {
                        $modal({
                            title: $localizable('OmniDesDeploy'),
                            templateUrl: 'alertModal.tpl.html',
                            content: $localizable('OmniDesLwcDeployComplete'),
                            scope: $scope.$new(),
                            show: true
                        });
                    }
                    $scope.lwcDeployingWarning = undefined;
                    loadLwcFrame();
                })
                .catch(error => compilerService.showDeploymentError(error, $localizable('OmniDesLwcDeployError')).then((resolve)))
                .finally(() => {
                    $scope.$apply(() => {
                        $rootScope.scriptElement.saving = false;
                        $rootScope.scriptElement.activating = false;
                    });
                });
        }

        function onOmniAggregateEvent(event) {
            $scope.$apply(_ => {
                $scope.viewModel.lwcTestJSON = JSON.stringify(event.detail, null, 2);
            });
        }

        function loadPreviewPage() {
            if (pendingLoad) {
                $timeout.cancel(pendingLoad);
            }
            pendingLoad = $timeout(function () {
                var element = $('.iframe-holder');
                var urlParams = ['id=' + $rootScope.scriptElement.Id,
                'designerPreviewId=' + $rootScope.scriptElement.Id,
                    'previewEmbedded=true',
                'tabKey=' + interTabMsgBus.tabKey()
                ];

                /* If we're not in classic add these headers */
                if (!document.documentElement.classList.contains('Theme3')) {
                    urlParams = urlParams.concat(['isdtp=p1',
                        'sfdcIFrameOrigin=' + encodeURIComponent(window.location.protocol + '//' + window.location.hostname),
                        'sfdcIFrameHost=web'
                    ]);
                }

                if ($scope.viewModel.contextId) {
                    urlParams.push('testContextId=' + $scope.viewModel.contextId);
                }

                if (/^Newport/.test($scope.previewMode)) {
                    urlParams.push('layout=newport');
                } else if (/^Lightning/.test($scope.previewMode)) {
                    urlParams.push('layout=lightning');
                }
                if ($rootScope.scriptElement.Language__c === 'Multi-Language') {
                    urlParams.push('LanguageCode=' + $scope.previewLanguage);
                }
                var apexPageUrl = pageToMode[$scope.previewMode];
                if (customViews.hasOwnProperty($scope.previewMode)) {
                    apexPageUrl = customViews[$scope.previewMode];
                }
                var previewContainsquestion = apexPageUrl && apexPageUrl.indexOf('?') >= 0;
                if (!previewContainsquestion) {
                    apexPageUrl += '?';
                } else {
                    apexPageUrl += '&';
                }

                element[0].innerHTML = '<iframe  src="/apex/' + apexPageUrl + urlParams.join('&') + '"></iframe>';

                needsReload = false;
                needsLwcReload = true;

                var iFrames = $('.iframe-holder iframe');
                var timer = null;
                iFrames.on('load', function () {
                    var iframe = this;
                    interTabMsgBus.setTarget(this.contentWindow);
                    iframe.style.height = '100%'; /* OMNI 1251 */

                    if (timer) {
                        clearInterval(timer);
                    }
                    // handle reload of page with prep'd data to use
                    timer = setInterval(function () {
                        if (/Mobile/.test($scope.previewMode)) {
                            // make mobile match iPad dimensions
                            element.addClass('mobile');
                            if (/iPad/i.test($scope.previewMode)) {
                                element.addClass('ipad');
                                element.removeClass('iphone');
                                element.addClass('landscape');
                                element.removeClass('portrait');
                            } else if (/iPhone/i.test($scope.previewMode)) {
                                element.addClass('iphone');
                                element.removeClass('ipad');
                                element.addClass('portrait');
                                element.removeClass('landscape');
                            }
                        } else {
                            element.removeClass('mobile', 'ipad', 'iphone', 'portrait', 'landscape');
                            iframe.style.width = '100%';
                        }
                    }, 500);
                });
            }, 500);
        }

        $scope.$watch('previewMode', function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                $rootScope.scriptElement.LastPreviewPage__c = newValue;
                remoteActions.updateScriptLastPreviewPage($rootScope.scriptElement.Id, newValue);
                loadPreviewPage();
            }
            if (newValue.match(/^(Communities$|Classic)/)) {
                $scope.previewWarning = "This player is no longer supported by Vlocity, please use Lightning or Newport OmniScript players for all new OmniScript development";
            } else
                $scope.previewWarning = undefined;
        });

        $scope.$watch('lwcPreviewMode', function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                loadLwcPreview();
            }
        });

        $scope.clearPreviewWarn = function () {
            $scope.previewWarning = undefined;
        };

        $scope.changePreviewLanguage = function (newLanguage) {
            $scope.previewLanguage = newLanguage;
            loadPreviewPage();
        };

        $scope.changelwcPreviewLanguage = function (newLanguage) {
            $scope.lwcPreviewLanguage = newLanguage;
            loadLwcPreview();
        };

        $scope.fetchDataForContextId = function (contextId, resetDataJson) {
            if (contextId) {
                needsReload = true;
                needsLwcReload = true;
                loadPreviewPage();

                if (resetDataJson) {
                    $scope.viewModel.testJSON = '';
                    interTabMsgBus.delete('ouiTestJson');
                }

                try {
                    var testJSON = JSON.parse($scope.viewModel.testJSON);
                    if (testJSON.ContextId !== contextId) {
                        testJSON.ContextId = contextId;
                        $scope.viewModel.testJSON = JSON.stringify(testJSON, null, 2);
                    }
                } catch (e) {
                    // swallow JSON parse exception
                }
                $scope.viewModel.contextId = contextId;
            }
        };

        $scope.fetchDataForLwcContextId = function () {
            loadLwcPreview();
        };

        $scope.updateLwcPrefillData = function () {
            loadLwcPreview();
        }

        $scope.onPreviewJSONChange = function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                try {
                    var asJson = JSON.parse(newValue);
                    interTabMsgBus.set('ouiTestJson', newValue);
                } catch (e) {
                    // swallow invalid JSON
                }
            }
        };

        $scope.clearData = function () {
            $scope.viewModel.testJSON = '';
            $scope.viewModel.contextId = '';
            interTabMsgBus.delete('ouiTestJson');
            loadPreviewPage();
        };

        var pending = null;
        interTabMsgBus.on('ouiTestJson', function (newJson, oldJson, wasDelete) {
            if (pending) {
                $timeout.cancel(pending);
            }
            if (newJson === $scope.viewModel.testJSON) {
                return;
            }
            pending = $timeout(function () {
                if (angular.isString(newJson)) {
                    newJson = JSON.stringify(JSON.parse(newJson), null, 2);
                }
                $scope.$apply(function () {
                    $scope.viewModel.testJSON = newJson;
                });
            });
        });

        interTabMsgBus.on('initialLoad', function () {
            if ($scope.viewModel.testJSON) {
                interTabMsgBus.set('ouiTestJson', $scope.viewModel.testJSON);
            } else {
                interTabMsgBus.set('ouiTestJson', null);
            }
        });

        // clear old localStorage values
        interTabMsgBus.delete('ouiTestJson');

        function applyLwcTab() {
            if ($rootScope.scriptElement.IsLwcEnabled__c) {
                if ($scope.tabs.length === 2) {
                    $scope.tabs.push({
                        title: 'LWC Preview',
                        content: '',
                    });
                }
                window.addEventListener('omniaggregate', onOmniAggregateEvent, true);
            } else if ($scope.tabs.length === 3) {
                $scope.tabs.pop();
                window.removeEventListener('omniaggregate', onOmniAggregateEvent, true);
            }
        }

        /**
         * Converts a base64 string to a Blob file
         * @param {string} b64Data
         * @param {string} filename
         * @param {string} contentType
         */
        function b64toFile(b64Data, filename, contentType) {
            var sliceSize = 512;
            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);
                var byteNumbers = new Array(slice.length);

                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            var file = new File(byteArrays, filename, { type: contentType });
            return file;
        }
    });

},{}],95:[function(require,module,exports){
angular.module("omniscriptDesigner")
.directive('input', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (attrs.type.toLowerCase() !== 'number') {
                return;
            } //only augment number input!
            ctrl.$formatters.push(function (value) {
                return !isNaN(value) ? parseFloat(value) : null;
            });
        }
    };
});
},{}],96:[function(require,module,exports){
angular.module("omniscriptDesigner")
.directive("paletteGroup", function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      group: "=elements",
      grouptitle: "=",
      expanded: '=?'
    },
    templateUrl: 'paleteElementGroup.tpl.html',
    link: function($scope) {
      $scope.model = {
        expand: $scope.expanded == true
      };
    }
  };
});
},{}],97:[function(require,module,exports){
angular.module("omniscriptDesigner")
.directive("preventDeleteBack", function($window){
    return function (scope, element, attrs) {
      /*
       * this swallows backspace keys on any non-input element.
       * stops backspace -> back
       */
      var rx = /INPUT|SELECT|TEXTAREA/i;

      angular.element(document).bind("keydown keypress", function(e){
        if( e.which == 8 ){ // 8 == backspace
          if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
            e.preventDefault();
          }
        }
      });
    };
  });
},{}],98:[function(require,module,exports){
angular.module("omniscriptDesigner")
.directive("viaAffix", function($window){
    if ($window.parent && $window.parent !== $window) {
      return {};
    }
    return function (scope, element, attrs) {
      var stickyTop = $(element).offset().top; 
      $(window).scroll(function() {
        var windowTop = $(window).scrollTop();
        if (stickyTop < windowTop) {
          $(element).parent().height($(window).height());
          $(element).css({ position: 'fixed', top: 0, width: "calc(100% - 20px)" });
          $(element).addClass("viaAffix");
        } else {
          $(element).removeClass("viaAffix");
          $(element).css({'position':'static', width: '100%'});
        }
      });
    };
  });
},{}],99:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('convertOmniToMultiLangModal', {
            templateUrl: 'convertOmniToMultiLangModal.tpl.html',
            controller: ConvertOmniToMultiLangModalController,
            controllerAs: 'vm',
            bindings: {
                scriptElement: '=',
                onCancel: '&?',
                onSave: '&?'
            }
        });

    ConvertOmniToMultiLangModalController.$inject = ['$sldsToast', '$q', 'customLabelService', 'save', '$element', '$scope'];
    function ConvertOmniToMultiLangModalController($sldsToast, $q, customLabelService, save, $element, $scope) {
        var vm = this,
            loadingStates = {
                loadedElements: false,
                initValidationPromiseCount: 0
            };

        vm.showRow = showRow;
        vm.isFullyLoaded = isFullyLoaded;
        vm.isValidLabel = isValidLabel;
        vm.toggleAll = toggleAll;
        vm.toggleSettings = toggleSettings;
        vm.changeCurrentFilter = changeCurrentFilter;
        vm.rowChanged = rowChanged;
        vm.isDefaultValue = isDefaultValue;
        vm.getTableCellLabelTitle = getTableCellLabelTitle;
        vm.preventEscapeClosingModal = preventEscapeClosingModal;
        vm.currentFilter = 'all';
        vm.translations = customLabelService.translations;
        vm.save = doSave;
        vm.cancel = cancel;
        vm.changeLanguage = changeLanguage;

        ////////////////

        vm.$onInit = function() {
            vm.allRows = [];
            vm.rows = [];
            customLabelService.getLanguageCodeFor(vm.scriptElement.Language__c)
                .then(function(code) {
                    vm.currentLanguage = customLabelService.currentEditLanguage = code || 'en_US';
                })
                .catch(function(err) {
                    vm.currentLanguage = customLabelService.currentEditLanguage = 'en_US';
                })
                .finally(function() {
                    processOmni();
                    changeCurrentFilter('all');
                    loadingStates.loadedElements = true;
                    vm.currentLanguageText = null;
                    vm.translations.forEach(function(translation) {
                        if (translation.value === vm.currentLanguage) {
                            vm.currentLanguageText = translation.label;
                        }
                    });
                });
        };

        vm.$onChanges = function(changesObj) { };
        vm.$onDestroy = function() {
            $('body').off('click', handleBodyClick);
        };

        function toggleSettings() {
            if (!vm.showSettings) {
                vm.showSettings = true;
                $('body').on('click', handleBodyClick);
                return;
            }

            hideSettings();
        }

        function hideSettings() {
            vm.showSettings = false;
            $('body').off('click', handleBodyClick);
            safeDigest($scope);
        }

        function handleBodyClick($event) {
            var dropdownElement = $('.slds-dropdown-trigger', $element[0])[0];
            try {
                if (dropdownElement === $event.target ||
                    $.contains(dropdownElement, $event.target)) {
                    return;
                }
            } catch (e) { /* swallow error when accessing parent iframe */ }
            hideSettings();
        }

        function processOmni() {
            var mapOfRows = {};
            vm.scriptElement.each(function(element) {
                var elementRoot = {
                    depth: Math.max(getElementDepth(element) - 1, 1),
                    isLeaf: false,
                    isOpen: true,
                    element: element,
                    elementName: element === vm.scriptElement ? 'Script Configuration' : element.Name,
                    label: null,
                    customLabelName: null,
                    currentValue: null,
                    id: element.Id
                };
                if (element.parent) {
                    elementRoot.parent = mapOfRows[element.parent().Name];
                }
                mapOfRows[elementRoot.elementName] = elementRoot;
                var labels = getLabelsForElement(element);
                if (labels.length > 0) {
                    vm.allRows.push(elementRoot);
                }
                labels.forEach(function(label) {
                    var currentValue = getCurrentValue(element, label);
                    var readonly = isReadonly(element, label);
                    if (readonly) {
                        return;
                    }
                    var row = {
                        parent: elementRoot,
                        depth: getElementDepth(element),
                        isLeaf: true,
                        element: element,
                        elementName: element === vm.scriptElement ? 'Script Configuration' : element.Name,
                        label: label,
                        customLabelName: null,
                        currentValue: currentValue,
                        currentLabelValue: null,
                        isValid: null,
                        id: element.Id + '-' + label
                    };
                    var defaultLabel = customLabelService.defaultValuesToLabelNames[label];
                    loadingStates.initValidationPromiseCount++;
                    getLabelValue(defaultLabel)
                        .then(function(value) {
                            if (row.currentValue === value) {
                                row.customLabelName = defaultLabel;
                                row.fallbackLabelName = defaultLabel;
                                row.currentLabelValue = value;
                            }
                        })
                        .catch(function(err) {
                            // ignore
                        })
                        .finally(function() {
                            isValidLabel(row);
                            loadingStates.initValidationPromiseCount--;
                        });
                    vm.allRows.push(row);
                });
            });
        }

        function isReadonly(element, label) {
            switch (element.type()) {
                case 'Step': return label === 'instruction';
                case 'Headline': return label === 'label';
                case 'Text Block': // text block and disclosure to be treated the same
                case 'Disclosure': return label === 'text';
                default: return false;
            }
        }

        function isFullyLoaded() {
            return (loadingStates.loadedElements &&
                    vm.currentLanguage &&
                    loadingStates.initValidationPromiseCount === 0);
        }

        function showRow(element) {
            while (element.parent) {
                if (element.parent.isOpen === false) {
                    return false;
                }
                element = element.parent;
            }
            return true;
        }

        function getElementDepth(element) {
            var depth = 1;
            while (element.parent) {
                depth++;
                element = element.parent();
            }
            return depth;
        }

        function getLabelsForElement(element) {
            return customLabelService.getLabelsForElement(element);
        }

        function getCurrentValue(element, propertyName) {
            switch (element.type()) {
                case 'Step': if (propertyName === 'instructionKey') {
                        return element.PropertySet__c.instruction;
                    }
                    break;
                case 'Headline': if (propertyName === 'labelKey') {
                        return element.PropertySet__c.label;
                    }
                    break;
                case 'Text Block': // text block and disclosure to be treated the same
                case 'Disclosure': if (propertyName === 'textKey') {
                        return element.PropertySet__c.text;
                    }
                default: break;
            }
            return element.PropertySet__c[propertyName];
        }

        function isValidLabel(row) {
            if (row.customLabelName || row.currentValue) {
                row.isValid = customLabelService.isValidLabelName(row.customLabelName);
                return row.isValid;
            }

            row.isValid = true;
            return true;
        }

        function isDefaultValue(row) {
            return row.customLabelName === row.fallbackLabelName ? true : undefined;
        }

        function getLabelValue(name) {
            if (!vm.currentLanguage) {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        getLabelValue(name)
                            .then(function(response) {
                                resolve(response);
                            })
                            .catch(function(err) {
                                reject(err);
                            });
                    });
                });
            }
            return customLabelService.getLabelValue(name, vm.currentLanguage);
        }

        function rowChanged(row) {
            row.hasChanges = true;
            row.isValid = customLabelService.isValidLabelName(row.customLabelName);
            row.currentValueLoading = true;
            getLabelValue(row.customLabelName)
                    .then(function(value) {
                        row.currentLabelValue = value;
                        row.currentValueErrorMsg = null;
                    })
                    .catch(function(err) {
                        var wasFound = false;
                        // before we reject, see if this is a new label with a value elsewhere
                        vm.allRows.forEach(function(otherRow) {
                            if (otherRow !== row &&
                                otherRow.customLabelName === row.customLabelName &&
                                otherRow.currentLabelValue) {
                                row.currentLabelValue = otherRow.currentLabelValue;
                                wasFound = true;
                            }
                        });
                        if (!wasFound) {
                            row.currentLabelValue = null;
                        }
                    })
                    .finally(function() {
                        row.currentValueLoading = false;
                        isValidLabel(row);
                    });
        }

        function changeCurrentFilter(newFilter) {
            vm.currentFilter = newFilter;
            hideSettings();
            switch (newFilter) {
                case 'all': vm.rows = vm.allRows;
                    break;
                case 'invalid-rows': vm.rows = vm.allRows.filter(function(row) {
                        return !row.customLabelName ||
                                !row.isLeaf ||
                                !isValidLabel(row) ||
                                isDefaultValue(row);
                    });
            }
        }

        function preventEscapeClosingModal($event) {
            if ($event.keyCode === 27) {
                $event.stopImmediatePropagation();
            }
        }

        function doSave() {
            vm.saving = true;
            vm.scriptElement.Language__c = 'Multi-Language';
            return saveCustomLabelChanges()
                .then(function(allSaved) {
                    return syncAllChangesBackToOmni();
                })
                .then(function(syncPromises) {
                    $sldsToast({
                        title: 'Successfully converted Omniscript to Multi-Language',
                        severity: 'success',
                        autohide: true
                    });
                    vm.onSave();
                })
                .catch(function(errors) {
                    $sldsToast({
                        title: 'Failed to save changes ',
                        content: errorToMessage(errors),
                        severity: 'error',
                        autohide: false
                    });
                    throw errors;
                })
                .finally(function() {
                    vm.saving = false;
                });
        }

        function saveCustomLabelChanges() {
            // only save Custom labels for rows without an existing value and a new current value.
            var arrayOfConfigs = vm.rows.filter(function(row) {
                return row.hasChanges && row.currentValue && !row.currentLabelValue;
            }).map(function(row) {
                return {
                    name: row.customLabelName,
                    language: vm.currentLanguage,
                    value: row.currentValue,
                    shortDescription: 'Autogenerated OmniScript Label for ' + vm.scriptElement.Type__c +
                    '/' + vm.scriptElement.SubType__c
                };
            });

            return customLabelService.saveAll(arrayOfConfigs);
        }

        function errorToMessage(errors) {
            var message = Array.isArray(errors) ? errors.map(function(error) {
                return errorToMessage(error);
            }).join('\n') : errors;
            if (message && message.message) {
                return message.message;
            }
            return angular.isString(message) ? message : JSON.stringify(message);
        }

        function cancel() {
            vm.onCancel();
        }

        function syncAllChangesBackToOmni() {
            // first create a map of element.Id to rows
            var mapOfIdToRows = vm.allRows.reduce(function (map, row) {
                if (!row.id) {
                    return map;
                }
                var rowId = row.id.split('-')[0];
                if (!map[rowId]) {
                    map[rowId] = [];
                }
                map[rowId].push(row);
                return map;
            }, {});

            // now iterate over all the script elements and update them, with all the rows
            // and save them
            var promises = [];
            vm.scriptElement.each(function(element) {
                var rows = mapOfIdToRows[element.Id];
                if (rows) {
                    rows.forEach(function(row) {
                        syncRowChangesBackToOmniElement(row, element);
                    });
                }
                promises.push(save(element));
            });
            return $q.all(promises);
        }

        function syncRowChangesBackToOmniElement(row, element) {
            var rowId = row.id.split('-')[0];
            if (row.readonly) {
                return;
            }
            if (rowId === element.Id && row.label && row.isValid) {
                if (row.label.indexOf('|') > -1 || row.label.indexOf(':') > -1) {
                    var elem = element.PropertySet__c;
                    var path = row.label.split(':');
                    for(var i = 0; i < path.length; i++) {
                        if(!elem) break;
                        var key = "";
                        if(path[i].match(/\|\d/)) {
                            var keys = path[i].split('|');
                            // go to attribute
                            elem = elem[keys[0]];
                            // index from pipe n
                            key = keys[1];
                        }
                        else {
                            key = path[i];
                        }
                        // get value of key
                        if(elem && key) {
                            if(i === path.length - 1) {
                                elem[key] = row.customLabelName;
                            }
                            elem = elem[key];
                        }
                    }
                    return;
                }

                if (row.customLabelName === row.fallbackLabelName) {
                    element.PropertySet__c[row.label] = null;
                    return;
                }

                element.PropertySet__c[row.label] = row.customLabelName;
            }
        }

        function toggleAll() {
            var areAnyOpen = false;
            vm.rows.forEach(function($row) {
                if (!$row.isLeaf && $row.isOpen) {
                    $row.isOpen = false;
                    areAnyOpen = true;
                }
            });
            if (areAnyOpen === false) {
                vm.rows.forEach(function($row) {
                    if (!$row.isLeaf) {
                        $row.isOpen = true;
                    }
                });
            }
        }

        function changeLanguage(newLanguage) {
            vm.currentLanguage = customLabelService.currentEditLanguage = newLanguage;
            vm.translations.forEach(function(translation) {
                if (translation.value === vm.currentLanguage) {
                    vm.currentLanguageText = translation.label;
                }
            });
            hideSettings();
            vm.allRows.forEach(function(row) {
                if (row.isLeaf) {
                    row.currentLabelValue = null;
                    row.currentValueLoading = true;
                    getLabelValue(row.customLabelName)
                        .then(function(value) {
                            row.currentLabelValue = value;
                            row.currentValueErrorMsg = null;
                        })
                        .catch(function(err) {
                            // ignore
                            row.currentLabelValue = null;
                            row.currentValueErrorMsg = err;
                        })
                        .finally(function() {
                            row.currentValueLoading = false;
                            isValidLabel(row);
                        });
                }
            });
        }

        function getTableCellLabelTitle(row) {
            if (vm.isDefaultValue(row)) {
                return 'Using default OmniScript Custom Label';
            }

            if (row.isValid === false) {
                return 'This is an invalid custom label name';
            }

            return undefined;
        }

        function safeDigest(scope) {
            return scope.$$phase || scope.$root && scope.$root.$$phase || scope.$digest();
        }
    }
})();

},{}],100:[function(require,module,exports){
(function(){
    'use strict';
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('enableLogging', ['tObjectFactory', function(tObjectFactory){
        return{
            restrict: 'A',
            link: function(scope, element, attrs){
                element.on('click', function() {
                    scope.$apply(function() {
                        tObjectFactory.visible = !tObjectFactory.visible;
                    });
                });
            }
        };
    }]);
    
}());

},{}],101:[function(require,module,exports){
(function () {
    /*jshint -W030 */
    'use strict';
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcLwcDebugJsonTreeView', ['$compile', 'tObjectFactory', 'vlcDebugJsonTreeViewDirective', function ($compile, tObjectFactory, vlcDebugJsonTreeViewDirective) {
        const compile = function (element, attrs, transclude) {
            var contents = element.contents().remove();
            var compiledContents;

            return function (scope, iElement, iAttrs) {
                scope.visible = tObjectFactory.visible;

                //this watch toggles  the modal window
                scope.$watch(function () {
                    return tObjectFactory.visible;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        scope.visible = tObjectFactory.visible;
                    }
                });

                //puts the objects into the queue - would only work in ie 9 and above 
                window.addEventListener && (function () {
                    window.addEventListener('omniactiondebug', function (event) {
                        try {
                            tObjectFactory.createNetTransObject(angular.fromJson(event.detail));
                            //view only needs to be updated if the console is up
                            if (scope.visible) {
                                scope.$apply(); //will fire the watchers on the updated flag
                            }
                        } catch (e) {
                            // swallow unparsable data
                        }
                    }, false);
                }());

                //watches the queue to repaint the tree
                scope.$watch(function () {
                    return tObjectFactory.factoryUpdated();
                }, function (newValue, oldValue) {
                    scope.jsonData = tObjectFactory.tObjects();
                });

                if (!compiledContents) {
                    compiledContents = $compile(contents, transclude);
                }
                compiledContents(scope, function (clone, scope) {
                    iElement.append(clone);
                });
            };

        }

        var configExtension = {
            scope: false,
            compile
        }

        // With this, we'll override the treeView in order to avoid using the default message
        return angular.merge({}, vlcDebugJsonTreeViewDirective[0], configExtension)
    }]);
}());

},{}],102:[function(require,module,exports){
// https://github.com/fmquaglia/ngOrderObjectBy
'use strict';
(
  function(angular) {
    return angular
      .module('ngOrderObjectBy', [])
      .filter('orderObjectBy', function() {
        return function (items, field, reverse) {

          function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
          }
          
          var filtered = [];

          angular.forEach(items, function(item, key) {
            if (angular.isString(item)) {
                item = {
                    key: key,
                    value: item
                };
            } else {
                item.key = key;
            }      
            filtered.push(item);
          });

          function index(obj, i) {
            return obj[i];
          }

          filtered.sort(function (a, b) {
            var comparator;
            var reducedA = field.split('.').reduce(index, a);
            var reducedB = field.split('.').reduce(index, b);

            if (isNumeric(reducedA) && isNumeric(reducedB)) {
              reducedA = Number(reducedA);
              reducedB = Number(reducedB);
            } else if (angular.isString(reducedA) && angular.isString(reducedB)) {
                reducedA = reducedA.toLowerCase();
                reducedB = reducedB.toLowerCase();
            }

            if (reducedA === reducedB) {
              comparator = 0;
            } else {
              comparator = reducedA > reducedB ? 1 : -1;
            }

            return comparator;
          });

          if (reverse) {
            filtered.reverse();
          }

          return filtered;
        };
      });
  }
)(angular);
},{}],103:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .directive('showHideRule', ShowHideRuleDirective);

    ShowHideRuleDirective.$inject = [];
    function ShowHideRuleDirective() {
        var directive = {
            bindToController: true,
            controller: ShowHideRuleController,
            controllerAs: 'vm',
            restrict: 'A',
            replace: true,
            templateUrl: 'show-rule-property-template.tpl.html',
            scope: {
                rule: '=',
                isDisabled: '=',
                rootRule: '=?',
                parent: '=?',
                elementNames: '='
            }
        };
        return directive;
    }
    
    ShowHideRuleController.$inject = ['$localizable'];
    function ShowHideRuleController ($localizable) {
        var vm = this;

        vm.operators = [{
            value: 'AND',
            label: $localizable('OmniDesAnd')
        }, {
            value: 'OR',
            label: $localizable('OmniDesOr')
        }];

        vm.conditions = [{
            value: '=',
            label: $localizable('OmniDesIsEqualTo')
        }, {
            value: '<>',
            label: $localizable('OmniDesDoesNotEqual')
        }, {
            value: '<',
            label: $localizable('OmniDesIsLessThan')
        }, {
            value: '>',
            label: $localizable('OmniDesIsGreaterThan')
        }, {
            value: '<=',
            label: $localizable('OmniDesIsLessThanEqual')
        }, {
            value: '>=',
            label: $localizable('OmniDesIsGreaterThanEqual')
        }];

        
        vm.addCondition = function (group) {
            group.rules.push({
                'condition': '=',
                'field': null,
                'data': null
            });
        };

        vm.addGroup = function (group) {
            group.rules.push({
                'group': {
                    operator: 'AND',
                    'rules': [{
                        'condition': '=',
                        'field': null,
                        'data': null
                    }]
                }
            });
        };

        vm.deleteRule = function (rule) {
            var resolvedRuleSet = (vm.parent.rule ? vm.parent.rule.group.rules :  vm.parent.group.rules);
            for (var i = 0; i < resolvedRuleSet.length; i++) {
                if (resolvedRuleSet[i] === rule) {
                    resolvedRuleSet.splice(i, 1);
                    return;
                } else if (resolvedRuleSet[i].group) {
                    vm.deleteRule(rule, resolvedRuleSet[i].group.rules);
                }
            }
        };

        vm.deleteGroup = function (group) {
            vm.deleteRule(group);
        };

    }
})();
},{}],104:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('translationEditModal', {
            templateUrl: 'translationEditModal.tpl.html',
            controller: TranslationEditModalController,
            controllerAs: 'vm',
            bindings: {
                scriptElement: '=',
                onCancel: '&?',
                onSave: '&?'
            },
        });

    TranslationEditModalController.$inject = ['$sldsToast', '$q', 'customLabelService', 'save', '$rootScope', '$element', '$scope'];
    function TranslationEditModalController($sldsToast, $q, customLabelService, save, $rootScope, $element, $scope) {
        var vm = this,
            loadingStates = {
                loadedElements: false,
                initValidationPromiseCount: 0
            };

        vm.showRow = showRow;
        vm.isDefaultValue = isDefaultValue;
        vm.isFullyLoaded = isFullyLoaded;
        vm.isValidLabel = isValidLabel;
        vm.changeCurrentFilter = changeCurrentFilter;
        vm.rowChanged = rowChanged;
        vm.preventEscapeClosingModal = preventEscapeClosingModal;

        vm.currentFilter = 'all';
        vm.toggleAll = toggleAll;
        vm.toggleSettings = toggleSettings;
        vm.translations = customLabelService.translations;
        vm.save = doSave;
        vm.cancel = cancel;
        vm.changeLanguage = changeLanguage;
        vm.getTableCellLabelTitle = getTableCellLabelTitle;

        ////////////////

        vm.$onInit = function() {
            vm.allRows = [];
            vm.rows = [];
            var mapOfRows = {};
            customLabelService.loadAllCustomLabelsInOrg();
            vm.currentLanguage = customLabelService.currentEditLanguage;
            vm.currentLanguageText = null;
            vm.translations.forEach(function(translation) {
                if (translation.value === vm.currentLanguage) {
                    vm.currentLanguageText = translation.label;
                }
            });
            vm.scriptElement.each(function(element) {
                var elementRoot = {
                    depth: Math.max(getElementDepth(element) - 1, 1),
                    isLeaf: false,
                    isOpen: true,
                    element: element,
                    elementName: element === vm.scriptElement ? 'Script Configuration' : element.Name,
                    label: null,
                    customLabelName: null,
                    currentValue: null,
                    id: element.Id
                };
                if (element.parent) {
                    elementRoot.parent = mapOfRows[element.parent().Name];
                }
                mapOfRows[elementRoot.elementName] = elementRoot;
                var labels = getLabelsForElement(element);
                if (labels.length > 0) {
                    vm.allRows.push(elementRoot);
                }
                labels.forEach(function(label) {
                    var customLabelName = getCurrentLabelName(element, label);
                    var readonly = isReadonly(element, label);
                    var row = {
                        parent: elementRoot,
                        depth: getElementDepth(element),
                        isLeaf: true,
                        readonly: readonly,
                        element: element,
                        elementName: element === vm.scriptElement ? 'Script Configuration' : element.Name,
                        label: label,
                        customLabelName: readonly ? '' : (customLabelName || customLabelService.defaultValuesToLabelNames[label]),
                        currentValue: readonly ? (customLabelName || customLabelService.defaultValuesToLabelNames[label]) : null,
                        isValid: readonly ? true : null,
                        id: element.Id + '-' + label,
                        fallbackLabelName: customLabelService.defaultValuesToLabelNames[label]
                    };
                    if (!readonly) {
                        loadingStates.initValidationPromiseCount++;
                        getLabelValue(row.customLabelName)
                            .then(function(value) {
                                row.currentValue = value;
                            })
                            .catch(function(err) {
                                row.currentValue = null;
                                row.currentValueErrorMsg = err;
                            })
                            .finally(function() {
                                isValidLabel(row);
                                loadingStates.initValidationPromiseCount--;
                            });
                        }
                    vm.allRows.push(row);
                });
            });
            changeCurrentFilter('all');
            loadingStates.loadedElements = true;
        };
        vm.$onChanges = function(changesObj) { };
        vm.$onDestroy = function() {
            $('body').off('click', handleBodyClick);
        };

        function isReadonly(element, label) {
            switch (element.type()) {
                case 'Step': return label === 'instruction';
                case 'Headline': return label === 'label';
                case 'Text Block': // text block and disclosure to be treated the same
                case 'Disclosure': return label === 'text';
                default: return false;
            }
        }

        function isFullyLoaded() {
            return (/*vm.availableLabels != null &&*/
                    loadingStates.loadedElements &&
                    vm.currentLanguage &&
                    loadingStates.initValidationPromiseCount === 0);
        }

        function showRow(element) {
            while (element.parent) {
                if (element.parent.isOpen === false) {
                    return false;
                }
                element = element.parent;
            }
            return true;
        }

        function getElementDepth(element) {
            var depth = 1;
            while (element.parent) {
                depth++;
                element = element.parent();
            }
            return depth;
        }

        function getLabelsForElement(element) {
            return customLabelService.getLabelsForElement(element);
        }

        function changeLanguage(newLanguage) {
            vm.currentLanguage = customLabelService.currentEditLanguage = newLanguage;
            vm.translations.forEach(function(translation) {
                if (translation.value === vm.currentLanguage) {
                    vm.currentLanguageText = translation.label;
                }
            });
            hideSettings();
            vm.allRows.forEach(function(row) {
                if (row.isLeaf) {
                    row.currentValue = null;
                    row.currentValueLoading = true;
                    getLabelValue(row.customLabelName)
                        .then(function(value) {
                            row.currentValue = value;
                            row.currentValueErrorMsg = null;
                        })
                        .catch(function(err) {
                            // ignore
                            row.currentValue = null;
                            row.currentValueErrorMsg = err;
                        })
                        .finally(function() {
                            row.currentValueLoading = false;
                            isValidLabel(row);
                        });
                }
            });
        }

        function toggleSettings() {
            if (!vm.showSettings) {
                vm.showSettings = true;
                $('body').on('click', handleBodyClick);
                return;
            }

            hideSettings();
        }

        function hideSettings() {
            vm.showSettings = false;
            $('body').off('click', handleBodyClick);
            safeDigest($scope);
        }

        function handleBodyClick($event) {
            var dropdownElement = $('.slds-dropdown-trigger', $element[0])[0];
            try {
                if (dropdownElement === $event.target ||
                    $.contains(dropdownElement, $event.target)) {
                    return;
                }
            } catch (e) { /* swallow error when accessing parent iframe */ }
            hideSettings();
        }

        function getCurrentLabelName(element, propertyName) {
            if (propertyName.indexOf('|') > -1 || propertyName.indexOf(':') > -1) {
                var tokenList = propertyName.split(':');
                var elem = element.PropertySet__c;
                var label = getValueByPath(elem, tokenList);

                return label;
            }
            return element.PropertySet__c[propertyName];
        }
        /*
            supported :
                attr
                obj:attr
                obj1:obj2:attr
                obj:array|n:attr

            not supported :
                array|n
                array|n|n:attr

            n is a digit >= 0
        */
        function getValueByPath(elem, tokenList) {
            var path = tokenList;
            for(var i = 0; i < path.length; i++) {
                if(!elem) break;
                var key = "";
                if(path[i].match(/\|\d/)) {
                    var keys = path[i].split('|');
                    // go to attribute
                    elem = elem[keys[0]];
                    // index from pipe n
                    key = keys[1];
                }
                else {
                    key = path[i];
                }
                if(elem && key) {
                    elem = elem[key];
                }
            }

            return elem ? elem : "";
        }

        function isValidLabel(row) {
            if (row.customLabelName || row.currentValue) {
                row.isValid = customLabelService.isValidLabelName(row.customLabelName);
                return row.isValid;
            }

            row.isValid = true;
            return true;
        }

        function isDefaultValue(row) {
            return row.customLabelName === row.fallbackLabelName ? true : undefined;
        }

        function getLabelValue(name) {
            if (!vm.currentLanguage) {
                return $q(function(resolve, reject) {
                    getLabelValue(name)
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(err) {
                            reject(err);
                        });
                });
            }
            return customLabelService.getLabelValue(name, vm.currentLanguage);
        }

        function toggleAll() {
            var areAnyOpen = false;
            vm.rows.forEach(function($row) {
                if (!$row.isLeaf && $row.isOpen) {
                    $row.isOpen = false;
                    areAnyOpen = true;
                }
            });
            if (areAnyOpen === false) {
                vm.rows.forEach(function($row) {
                    if (!$row.isLeaf) {
                        $row.isOpen = true;
                    }
                });
            }
        }

        function rowChanged(row, updateValue) {
            row.hasChanges = true;
            row.isValid = customLabelService.isValidLabelName(row.customLabelName);
            if (updateValue) {
                // need to find all other rows with the same label name
                vm.allRows.forEach(function(otherRow) {
                    if (row.id !== otherRow.id &&
                        otherRow.customLabelName === row.customLabelName) {
                        otherRow.currentValue = row.currentValue;
                    }
                });
            } else {
                row.currentValueLoading = true;
                getLabelValue(row.customLabelName)
                    .then(function(value) {
                        row.currentValue = value;
                        row.currentValueErrorMsg = null;
                    })
                    .catch(function(err) {
                        var wasFound = false;
                        // before we reject, see if this is a new label with a value elsewhere
                        vm.allRows.forEach(function(otherRow) {
                            if (otherRow !== row &&
                                otherRow.customLabelName === row.customLabelName &&
                                otherRow.currentValue) {
                                row.currentValue = otherRow.currentValue;
                                wasFound = true;
                            }
                        });
                        if (!wasFound) {
                            row.currentValue = null;
                        }
                    })
                    .finally(function() {
                        row.currentValueLoading = false;
                        isValidLabel(row);
                    });
            }
        }

        function changeCurrentFilter(newFilter) {
            vm.currentFilter = newFilter;
            hideSettings();
            switch (newFilter) {
                case 'all': vm.rows = vm.allRows;
                    break;
                case 'invalid-rows': vm.rows = vm.allRows.filter(function(row) {
                        return !row.customLabelName ||
                               !row.isLeaf ||
                               !isValidLabel(row) ||
                               isDefaultValue(row);
                    });
            }
        }

        function preventEscapeClosingModal($event) {
            if ($event.keyCode === 27) {
                $event.stopImmediatePropagation();
            }
        }

        function doSave() {
            vm.saving = true;
            saveCustomLabelChanges()
                .then(function(allSaved) {
                    return syncAllChangesBackToOmni();
                })
                .then(function(syncPromises) {
                    $sldsToast({
                        title: 'Successfully saved new translations',
                        content: 'IMPORTANT: Salesforce cache\'s custom labels so your changes to label values ' +
                        'may not be immediately visible. Please wait at least 2-3 minutes to see you changes.',
                        severity: 'success',
                        autohide: true,
                        timeout: 10000 // (10 seconds)
                    });
                    vm.onSave();
                })
                .catch(function(errors) {
                    $sldsToast({
                        title: 'Failed to save changes ',
                        content: errorToMessage(errors),
                        severity: 'error',
                        autohide: false
                    });
                    throw errors;
                })
                .finally(function() {
                    $rootScope.$broadcast('label-changes-saved', {});
                    vm.saving = false;
                });
        }

        function errorToMessage(errors) {
            var message = Array.isArray(errors) ? errors.map(function(error) {
                return errorToMessage(error);
            }).join('\n') : errors;
            if (message && message.message) {
                return message.message;
            }
            return angular.isString(message) ? message : JSON.stringify(message);
        }

        function cancel() {
            vm.onCancel();
        }

        function saveCustomLabelChanges() {
            var arrayOfConfigs = vm.rows.filter(function(row) {
                return row.hasChanges;
            }).map(function(row) {
                return {
                    name: row.customLabelName,
                    language: vm.currentLanguage,
                    value: row.currentValue,
                    shortDescription: 'Autogenerated OmniScript Label for ' + vm.scriptElement.Type__c +
                    '/' + vm.scriptElement.SubType__c
                };
            });

            return customLabelService.saveAll(arrayOfConfigs);
        }

        function syncAllChangesBackToOmni() {
            // first create a map of element.Id to rows
            var mapOfIdToRows = vm.allRows.reduce(function (map, row) {
                if (!row.id) {
                    return map;
                }
                var rowId = row.id.split('-')[0];
                if (!map[rowId]) {
                    map[rowId] = [];
                }
                map[rowId].push(row);
                return map;
            }, {});

            // now iterate over all the script elements and update them, with all the rows
            // and save them
            var promises = [];
            vm.scriptElement.each(function(element) {
                var rows = mapOfIdToRows[element.Id];
                if (rows) {
                    rows.forEach(function(row) {
                        syncRowChangesBackToOmniElement(row, element);
                    });
                }
                promises.push(save(element));
            });
            return $q.all(promises);
        }

        function syncRowChangesBackToOmniElement(row, element) {
            var rowId = row.id.split('-')[0];
            if (row.readonly) {
                return;
            }
            if (rowId === element.Id && row.label && row.isValid) {
                if (row.label.indexOf('|') > -1 || row.label.indexOf(':') > -1) {
                    var elem = element.PropertySet__c;
                    var path = row.label.split(':');
                    // traverse into object to location to update
                    for(var i = 0; i < path.length; i++) {
                        var key = "";
                        if(path[i].match(/\|\d/)) {
                            var keys = path[i].split('|');
                            // go to attribute
                            elem = elem[keys[0]];
                            // index from pipe n
                            key = keys[1];
                        }
                        else {
                            key = path[i];
                        }
                        // get value of key
                        if(elem && key) {
                            if(i === path.length - 1) {
                                elem[key] = row.customLabelName;
                            }
                            elem = elem[key];
                        }
                    }
                }

                if (row.customLabelName === row.fallbackLabelName) {
                    element.PropertySet__c[row.label] = null;
                    return;
                }

                if (element.PropertySet__c[row.label] !== row.customLabelName) {
                    element.PropertySet__c[row.label] = row.customLabelName;
                }
            }
        }

        function getTableCellLabelTitle(row) {
            if (vm.isDefaultValue(row)) {
                return 'Using default OmniScript Custom Label';
            }

            if (row.isValid === false) {
                return 'This is an invalid custom label name';
            }

            return undefined;
        }

        function safeDigest(scope) {
            return scope.$$phase || scope.$root && scope.$root.$$phase || scope.$digest();
        }
    }
})();

},{}],105:[function(require,module,exports){
(function(){
    /*jshint -W030 */
    'use strict';
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcDebugJsonTreeView', ['$compile', 'tObjectFactory', function($compile, tObjectFactory){
        return {
            restrict: 'E',
            scope:{
                jsonData: '=',
            },
            transclude: true,
            controller: function($scope, $element) {
                $scope.clear = function() {
                    tObjectFactory.clearTObjects();
                    $scope.jsonData = tObjectFactory.tObjects();
                };
                
                $scope.tPanel = function(tObject, flag) {
                    if (flag) {
                        tObject.visible = !tObject.visible;
                    }
                };

                //close the debug panel based on this switch
                $scope.toggleVisibility = function() {
                    tObjectFactory.visible = false;
                    $scope.$broadcast('eScroll'); //OMNI-2176
                };

                $scope.getClass = function(tObject) {
                    if (tObject.visible) {
                        return 'spreadOut';
                    }else {
                        return '';
                    }
                };

                //property on scope displays the prop based on the json object
                $scope.display = function(key) {
                    if(key === 'stage' || key === 'visible' || key === 'created' || key === 'name') {
                        return false;
                    }
                    return true;
                };

                //pre formatting the json 
                $scope.beautify = function(value,innerObject){
                    if (!innerObject.oneLineItem){
                        return '<pre>' + angular.toJson(value, true) + '</pre>';
                    }else{
                        return angular.toJson(value); 
                    }
                };
            },
            template: //comment
            '<div class="vlc-debug-panel modal-content" ng-if=visible vlc-modal-draggable vlc-bubble-canceller>'+
                '<div class="hexpand" vlc-expand-collapse prop="width"></div>'+
                '<div class="modal-header">'+
                '  <button type="button" class="close" aria-label="Close" ng-click="toggleVisibility()">'+
                '    X'+
                '  </button>'+
                '  <h4 class="modal-title vlc-debug-console-header"><strong>Omniscript Debug Console</strong></h4>'+
                '  <div class="vlc-debug-controls">'+
                '    <input type="text" class="form-control" ng-model="input.search" placeholder="Search"/>'+
                '  </div>'+
                '</div>'+
                '<div class="modal-body">'+
                '    <ul class="debug-object-list">' +
                '      <li ng-repeat="tObject in jsonData | filter:{name:input.search}" ng-click="tPanel(tObject,true)" ng-class="getClass(tObject)">'+
                '        <strong>{{tObject.name}}</strong>( {{tObject.stage}}{{tObject.created | date:"yyyy-MM-dd HH:mm:ss Z"}} )'+
                '        <button style="background:none;padding:0;margin:0" class="btn" vlc-clipboard="{}" vlc-clipboard-value="tObject">'+
                '        <span style="position:relative;top: -1px" class="glyphicon icon-v-copy" aria-hidden="true"></span>'+
                '        </button>'+
                '        <ul ng-show="tObject.visible" class="sublist">'+
                '          <li ng-repeat="(key,value) in tObject" ng-if="display(key)" vlc-collapsible>'+
                '            <strong>{{key}}</strong>'+
                '            <button ng-hide="innerObject.oneLineItem" obj=innerObject style="background:none;padding:0;margin:0" class="btn"'+
                '              vlc-clipboard="{}" vlc-clipboard-value="value">'+
                '              <span style="position:relative;top: -1px" class="glyphicon icon-v-copy" aria-hidden="true"></span>'+
                '            </button>'+
                '            <div ng-class=innerObject.oneLineItem?"li-flat":"" ng-show="innerObject.visible" class="sublist">'+
                '              <span vlc-bubble-canceller click="true" ng-bind-html="beautify(value, innerObject)"></span>'+ 
                '            </div>'+
                '          </li>'+
                '        </ul>'+
                '      </li>'+
                '    </ul>'+
                '</div>'+
                '<div class="modal-footer">'+
                '  <button ng-click="clear()" class="btn btn-default">Clear</button>' +
                '  <div class="expand" vlc-expand-collapse="" classes="vlc-debug-panel, modal-body" prop="min-height">'+
                '  </div>'+
                '</div>'+
                '</div>', //div ends for modal content
                compile: function(element, attrs, transclude){
                    var contents = element.contents().remove();
                    var compiledContents;
                    
                    return function(scope, iElement, iAttrs){
                        scope.visible = tObjectFactory.visible;
                        
                        //this watch toggles  the modal window
                        scope.$watch(function(){
                            return tObjectFactory.visible;
                        },function(newValue, oldValue){
                            if (newValue !== oldValue){
                                scope.visible = tObjectFactory.visible;
                            }
                        });

                        //puts the objects into the queue - would only work in ie 9 and above 
                        window.addEventListener && (function(){
                            window.addEventListener('message', function(event){
                                try {
                                    tObjectFactory.createNetTransObject(angular.fromJson(event.data));
                                    //view only needs to be updated if the console is up
                                    if (scope.visible){
                                        scope.$apply(); //will fire the watchers on the updated flag
                                    }
                                } catch (e) {
                                    // swallow unparsable data
                                }
                            }, false);
                        }());

                        //preveent scroll bubbling
                        /*angular.element(iElement).bind('mouseenter', function(e){
                            angular.element('body').addClass('noScroll');
                        });

                        angular.element(iElement).bind('mouseleave', function(e){
                            angular.element('body').removeClass('noScroll');
                        });*/

                        //watches the queue to repaint the tree
                        scope.$watch(function(){
                            return tObjectFactory.factoryUpdated();
                        },function(newValue, oldValue){
                            scope.jsonData = tObjectFactory.tObjects();
                        });
                        
                        if(!compiledContents) {
                            compiledContents = $compile(contents, transclude);
                        }
                        compiledContents(scope, function(clone, scope) {
                            iElement.append(clone); 
                        });
                    };

                }
        };

    }]);
}());

},{}],106:[function(require,module,exports){
(function(){
    'use strict';
    /*the purpose of this directive is to cancel the bubbling of scrolling events
      this could be extended for other events in the future by passing attributes*/
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcBubbleCanceller', function(){
        return {
            restrict: 'A',
            scope:false,
            link: function(scope, elem, attrs){

                if (attrs.click){
                    elem.bind('click', function(e){
                        return false;
                    });
                    elem.bind('mouseenter', function(e){
                        return false;
                    });
                    return;
                }
                //preveent scroll bubbling
                angular.element(elem).bind('mouseenter', function(e){
                    angular.element('body').addClass('noScroll');
                });

                angular.element(elem).bind('mouseleave', function(e){
                    angular.element('body').removeClass('noScroll');
                });

                //OMNI-2176
                scope.$on('eScroll', function(){
                     angular.element('body').removeClass('noScroll');
                });

            }
        };
    });
}());

},{}],107:[function(require,module,exports){
(function(){
    /*the purpose of this directive is to drag elements with position fixed across the screen
      dnd draggable requires the position to be relative */
    'use strict';
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcModalDraggable', ['$compile', '$document', function($compile, $document){
        return {
            restrict: 'A',
            scope:false,
            link: function(scope, elem){
                var startX, startY, x, y;
                var width = elem[0].offsetWidth;
                var height = elem[0].offsetHeight;
                var header = elem.find('.modal-header');
                header.on('mousedown', function(e){
                    startX = e.clientX - elem[0].offsetLeft;
                    startY = e.clientY - elem[0].offsetTop;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);

                });

                // Handle drag event
                function mousemove(e) {
                    y = e.clientY - startY;
                    x = e.clientX - startX;
                    setPosition();
                }

                // Unbind drag events
                function mouseup(e) {
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }

                function setPosition(){
                    elem.css({
                        top: y + 'px',
                        left:  x + 'px'
                    });
                }
                
            }
        };
    }]);
}());

},{}],108:[function(require,module,exports){
(function(){
    /*jshint -W030 */
    'use strict';
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcExpandCollapse', ['$document', 'tObjectFactory', function($document, tObjectFactory){
        var startX, startY, x, deltaX;
        return {
            restrict:'A',
            scope:'false',
            link: function(scope, element, attrs){
                element.bind('mousedown', function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });

                function mousemove($event) {

                    //whenever there is a mouse down event deactivate the iframe
                    $('.iframe-holder').css({
                        'opacity': 0.3,//
                        'z-index':-1
                    });
                    
                    if (attrs.prop === 'width'){
                        //calculates  the start X and Y and calculates
                        //the dist travelled by the mouse and adds to the width
                        x = $event.pageX;
                        startX = element.offset().left;
                        startX = parseInt(startX);
                        deltaX = x  - startX;
                        var top = element.parent();
                    
                        top.css({
                            'width': parseInt(top.css('width')) + deltaX + 'px'
                        });
                        
                    }else{
                        //calculates the height of parent div - vlc-debug-modal
                        //cals mouse position , then dist moved by the mouse and adds it to the initial height
                        //diagonal drag

                        x = $event.pageX;
                        startX = element.offset().left;
                        startX = parseInt(startX);
                        deltaX = x  - startX;
                        
                        var y = $event.pageY;
                        startY = element.offset().top;
                        startY = parseInt(startY); //
                        var delta = y - startY;
                        var topP = element.parent().parent();
                        topP.css({
                            'width': parseInt(topP.css('width')) + deltaX + 'px',
                            'height': parseInt(topP.css('height')) + delta + 'px'
                        });

                        //120 is the min height of the parent div
                        var mBody = element.parent().parent().find('.modal-body');
                        mBody.css({
                            'height': parseInt(topP.css('height')) - 120 + 'px'
                        });
                    } 
                }

                function mouseup($event){
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);

                    //whenever there is a mouse down event deactivate the iframe
                    $('.iframe-holder').css({
                        'opacity': 'initial',
                        'z-index':'auto'
                    });
                    
                }

            }
        };
    }]);
}());

},{}],109:[function(require,module,exports){
(function(){
    'use strict';
    var Clipboard = window.Clipboard;

    
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcClipboard', function() {
        console.log('inside the clipboard directive');
        return {
            restrict: 'A',
            scope:{
                vlcClipboardValue: '='
            },
            controller: function($scope){
                $scope.select  = function(element){
                    if (Clipboard.selectedElement){ //this stores the previous selection
                        Clipboard.selectedElement.nextElementSibling.firstElementChild.style = '';
                    }
                    element.nextElementSibling.firstElementChild.style = 'background:#dedede';
                    Clipboard.selectedElement = element;
                };
            },
            link: function(scope, element, attr, ctrl) {
                var clipboard = new Clipboard(element[0], {
                    text: function(trigger) {
                        return '' + JSON.stringify(scope.vlcClipboardValue);
                    }
                });
                var btn = angular.element;

                //this will make click event not bubbble thereby not toggling the sublist
                element.bind('click', function(){
                    return false;
                });

                clipboard.on('success', function(e) {
                    var elem = e.trigger;
                    scope.select(elem);
                    

                    /* this is for the tooltip to show up on the right */
                    $(elem).addClass('tooltipped tooltipped-e');
                    elem.setAttribute('aria-label', 'copied to clipboard');
                    
                    $(elem).on('mouseleave', function(e) {
                        $(elem).removeClass('tooltipped tooltipped-e');
                        elem.removeAttribute('aria-label');
                    });

                    console.log('copy success');
                });

                clipboard.on('error', function(e) {
                    var payloadCharLimit = 200000;

                    // This will notify user that the clipboard errored due too large of a data load
                    if (JSON.stringify(scope.vlcClipboardValue).length > payloadCharLimit) {
                        var elem = e.trigger;
                        scope.select(elem);
                        
                        /* this is for the tooltip to show up on the right */
                        $(elem).addClass('tooltipped tooltipped-e');
                        elem.setAttribute('aria-label', 'copy error - payload too large\nplease manually copy');
                        
                        $(elem).on('mouseleave', function(e) {
                            $(elem).removeClass('tooltipped tooltipped-e');
                            elem.removeAttribute('aria-label');
                        });
                    }

                    console.log('copy error');
                });

            }
        };
    });
    
}());

},{}],110:[function(require,module,exports){
(function() {
    'use strict';
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcCollapsible', ['$compile', function($compile) {
        var keys = ['remoteClass', 'remoteMethod', 'apexRestPath' ,
                    'apexRestMethod','extRestUrl', 'httpVerb']; 
        // these keys will not toggle should refactor them to be attributes
        return {
            restrict: 'A',
            scope:false,
            link: function($scope, element, attr) {
                //new comment which is added
                element.addClass('collapsible');
                $scope.innerObject = {};

                if (keys.indexOf($scope.key || '') !== -1) {
                    //disable the toggle behaviour
                    $scope.innerObject.visible = true;
                    $scope.innerObject.oneLineItem = true;
                    element.bind('click', function(event) {
                        if (!event.spanClicked) {
                            event.stopPropagation();
                        }
                    });
                    return;
                }

                element.bind('click', function(event) {
                    if (!event.spanClicked) {
                        element.toggleClass('spreadOut');
                        event.stopPropagation();
                        $scope.$apply();
                    }
                });

                $scope.$watch(function() {
                    return /spreadOut/.test(element.attr('class'));
                }, function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $scope.innerObject.toggle(); // new o
                    }
                });

                $scope.innerObject.visible =  false;
                $scope.innerObject.toggle =  function() {
                    $scope.innerObject.visible = !$scope.innerObject.visible;
                };
            }
        };
    }]);
}());

},{}],111:[function(require,module,exports){
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module("omniscriptDesigner")
.factory('deleteElement', function($q, remoteActions, $rootScope) {
  return function deleteVisitor(element) {
    if ($rootScope.scriptElement.IsActive__c) {
      return $q(function(resolve, reject){
        reject();
      });
    }
    element.deleting = true;
    element.setSaving();
    $rootScope.$broadcast("delete", element);

    var allPromises = [];
    if (element.children.length > 0) {
      for (var i = 0; i < element.children.length; i++) {
        allPromises.push(deleteVisitor(element.children[i]));
      }
    }

    if (allPromises.length === 0) {
      allPromises.push($q.when(true));
    }
    return $q.all(allPromises).then(function() {
      return remoteActions.deleteElement(element.Id);
    }).then(function(result) {
      element.saving = false;
      if (angular.isArray(result) && (result.length === 0 || result[0].success))  {
        $rootScope.$broadcast("deleted", element);
        element.deleting = true;
        element.delete();
      } else {
        element.setErrors(result.errors);
      }
      return element;
    });
  };
});
},{"../../oui/util/ScriptElement.js":138}],112:[function(require,module,exports){
(function() {
    'use strict';
    angular.module('omniscriptDesigner')
        .factory('interTabMsgBus', function($q, $rootScope) {
            var listeners = {};
            var tabKey = Date.now().toString();
            var keysAdded = [];
            var objKeys = []; //adding the custom view layout

            //$(window).on('storage', handleStorageEvent);
            $(window).on('beforeunload', emptySessionStorage);
            $(window).on('message', handlePostMessageEvent);

            function handleStorageEvent(e) {
                e = e.originalEvent;
                var keyParts = e.key.split('.');
                if (keyParts[0] === tabKey) {
                    if (listeners[keyParts[1]]) {
                        listeners[keyParts[1]].forEach(function(callbackConfig) {
                            callbackConfig.fn.apply(callbackConfig.scope, [e.newValue, e.oldValue, wasDelete]);
                        });
                    }
                }
                wasDelete = false;
            }

            function handlePostMessageEvent(e) {
                e = e.originalEvent;
                var data = e.data;
                if (angular.isString(data)) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        // swallow exception if can't be parsed
                        return;
                    }
                }
                if (!data.key) {
                    return;
                }
                var keyParts = data.key.split('.');
                if (keyParts[0] === tabKey) {
                    if (listeners[keyParts[1]]) {
                        listeners[keyParts[1]].forEach(function(callbackConfig) {
                            callbackConfig.fn.apply(callbackConfig.scope, [data.newValue, data.oldValue, wasDelete]);
                        });
                    }
                }
            }

            function emptySessionStorage() {
                keysAdded.forEach(function(key) {
                    localStorage.removeItem(tabKey + '.' + key);
                });

                //deleting the obj containing window layout details
                objKeys.forEach(function(key) {
                    localStorage.removeItem(key);
                });
            }

            var wasDelete = false,
                targetWindow = null;

            return {
                setTarget: function(_targetWindow) {
                    targetWindow = _targetWindow;
                },
                tabKey: function() {
                    return tabKey;
                },
                on: function(key, listener, scope) {
                    if (!listeners[key]) {
                        listeners[key] = [];
                    }
                    listeners[key].push({
                        fn: listener,
                        scope: scope
                    });
                },
                set: function(key, value, isObject) {
                    keysAdded.push(key);
                    if (isObject === true) {
                        //localStorage.setItem(tabKey + '.' + key, JSON.stringify(value));
                        targetWindow.postMessage({
                            key: tabKey + '.' + key,
                            newValue: JSON.stringify(value)
                        }, '*');
                    }else {
                        //localStorage.setItem(tabKey + '.' + key, value);
                        targetWindow.postMessage({
                            key: tabKey + '.' + key,
                            newValue: value
                        }, '*');
                    }
                },
                get: function(key, isObject) {
                    if (isObject === true) {
                        return JSON.parse(localStorage.getItem(tabKey + '.' + key));
                    }else {
                        return localStorage.getItem(tabKey + '.' + key);
                    }
                },
                delete: function(key) {
                    // if (localStorage.getItem(tabKey + '.' + key)) {
                    //     wasDelete = true;
                    // }
                    // localStorage.removeItem(tabKey + '.' + key);
                }
            };
        });
}());

},{}],113:[function(require,module,exports){
/* globals VOUINS */
var osLabelSet = require('../../common/shared/osLabelSet.js');

(function () {
    // Usage:
    // To provide a base constructor and utils for Property Components
    angular.module("omniscriptDesigner")
        .factory('propCompUtil', propCompUtil);

    propCompUtil.$inject = [];

    function propCompUtil() {
        var names = [],
            namesAsObjects = [];


        var service = {
            baseConstructor: basePropCompConstructor
        };

        return service;

        ////

        function basePropCompConstructor() {
            angular.extend(this, {
                elementNames: elementNames,
                elementNamesAsObject: elementNamesAsObject,
                elementPath: elementPath,
                updateDefaultProperties: updateDefaultProperties,
                getElementType: getElementType
            });
        }

        function updateDefaultProperties(defaultProperties, propertySet, type) {
            if (this.element && this.element.scriptElement().Language__c === 'Multi-Language') {
                defaultProperties = fixDefaultPropertiesForMultiLanguage(type, defaultProperties)
            }
            return Object.assign({}, _.cloneDeep(defaultProperties), propertySet);
        }

        function elementNamesAsObject() {
            namesAsObjects.splice(0, namesAsObjects.length);
            const scriptEl = this.scriptElement;
            this.scriptElement.each(function (element) {
                if (element !== scriptEl) {
                    namesAsObjects.push({
                        label: element.Name
                    });
                }
            });
            return namesAsObjects;

        }

        function elementNames(asObject) {
            if (asObject) {
                return this.elementNamesAsObject();
            }

            names.splice(0, names.length);
            const scriptEl = this.scriptElement;
            scriptEl.each(function (element) {
                if (element !== scriptEl) {
                    names.push(element.Name);
                }
            });
            return names;
        }

        function elementPath() {
            names = [];
            const scriptEl = this.scriptElement;
            // root
            if (scriptEl.children) {
                for (var i = 0; i < scriptEl.children.length; i++) {
                    var elem = scriptEl.children[i];
                    getElementPath(elem, elem.Name, names);
                }
            }
            return names;
        }

        function getElementPath(element, path, names) {
            names.push(path);
            if (element.children) {
                for (var i = 0; i < element.children.length; i++) {
                    var elem = element.children[i];
                    getElementPath(elem, path + '.' + elem.Name, names);
                }
            }
        }

        function getElementType(element) {
            return element.Type__c.type === 'OmniScript' ? element.Type__c.type : element.type();
        }

        function resolveType(type) {
            switch (type) {
                case 'Script Configuration':
                    return 'Script';
                default:
                    return type;
            }
        }

        function fixDefaultPropertiesForMultiLanguage(type, defaultProperties) {
            var knownLabels = VOUINS.ootbLabelMap[resolveType(type)];
            if (!knownLabels) {
                return defaultProperties;
            }
            knownLabels.forEach(function (key) {
                if (key.indexOf('|n') > -1) {
                    // handle array property
                    var keyPart = key.substring(0, key.indexOf('|n'));
                    var subKeyPart = key.substring(key.indexOf('|n:') + 3);
                    var prop = defaultProperties[keyPart];
                    if (Array.isArray(prop)) {
                        prop.forEach(function (childProp) {
                            childProp[subKeyPart] = '';
                        });
                    } else if (prop && prop[subKeyPart]) {
                        prop[subKeyPart] = '';
                    }
                } else {
                    // clear out value for multi-lang
                    defaultProperties[key] = '';
                }
            });
            return defaultProperties;
        }

    }

})();

},{"../../common/shared/osLabelSet.js":2}],114:[function(require,module,exports){
(function() {
    /*jshint -W030 */
    'use strict';
    angular.module('omniscriptDesigner')
        .factory('tObjectFactory', function() {
            /*
              input: arguement object passed from the bpService decorator
            */

            var classNamesToBeHidden = ['invokeInboundDR',
                                        'invokeTransformDR',
                                        'invokeOutboundDR',
                                       ];

            var containsString = function(sString){
                for(var i = 0 ; i < this.length; i++){
                    if (this[i].indexOf(sString) !== -1){
                        return true;
                    }
                }
                return false;
            };

            var tObjectsMap = [];
            var _factoryUpdated = false;

            function isValidObject(input) {
                if (input.response && input.response.name && input.response.type) {
                    return false;
                }

                if (input.args && input.args.name && input.args.type) {
                    return false;
                }

                return true;
            }

            function beautify(input){
                var request;
                try{
                    var test  = input && input[2] && input[2].replace(/\\\"/g,'\"');

                    if(test === input[2]){
                        request = (input && input[2] && angular.fromJson(input[2])) || {} ;
                        return request;
                    }
                    
                    test = test.replace(/\"{/g,'{');
                    test = test.replace(/}\"/g,'}'); 
                    request = angular.fromJson(test);

                } catch(err){
                    console.log('error in json parser ' + err);
                    request = (input && input[2] && angular.fromJson(input[2])) || {} ;
                }

                return request;
            }

            function CreateTObject(input, element) {
                var path = (input && input[0]) || 'anonymous';
                var restMethod = (input && input[1]) || 'anonymous';
                var self = this;

                //these names should be visible in the window
                !containsString.call(classNamesToBeHidden, restMethod) && (function(){
                    (element.type === 'web') && (function() {
                        self.extRestUrl = path;
                        self.httpVerb = restMethod;
                    }());
                    (element.type === 'apex') && (function() {
                        self.apexRestPath = path;
                        self.apexRestMethod = restMethod;
                    }());
                    (!element.type) && (function() {
                        self.remoteClass = (input && input[0]) || 'anonymous';
                        self.remoteMethod = (input && input[1]) || 'anonymous';
                    }());
                }());
                
                this.remoteOptions = (input && input[3] && angular.fromJson(input[3])) || {} ;

                //replaces the escaped json with beautified one 
                this.request = beautify(input);

                this.response = {};
                this.stage = (element.stage && element.stage + '-') || '';
                this.name = element.label || 'anonymous';
                this.created = Date.now();
            }

            //takes out the non display properties before copying the clipboard
            CreateTObject.prototype.toJSON = function() {
                var copy = {};
                angular.copy(this,copy);
                delete copy.visible;
                delete copy.stage;
                delete copy.name;
                delete copy.created;
                return copy;
            };

            function createRequestObject(input, element) {
                var tObject = new CreateTObject(input, element);
                //tObjectsMap.unshift(tObject);
                tObjectsMap.push(tObject);
                
            }

            function createResponseObject(input, element) {

                var tObject ;
                //check the element name of the last object matches
                /* jshint -W030 */
                var output = (tObject = tObjectsMap[tObjectsMap.length-1]) && (function() {
                    //stage has been lower cased in the above if clause
                    tObject.response  = input;
                    return true;
                }());

                if (!output) {
                    console.log('orphan response : something is wrong');
                }

            }

            function remoteCallObject(input) {

                //the step and type calls are also getting logged thats why - this check
                if (!(isValidObject(input))) {
                    return {
                        invalidObject: true
                    };
                }

                //this is a request object
                if (input.args) {
                    createRequestObject(input.args, input.element);
                }

                if (input.response) {
                    createResponseObject(input.response, input.element);
                }

                _factoryUpdated = !_factoryUpdated;

            }

            return {
                createNetTransObject: function(input) {
                    remoteCallObject(input);
                    _factoryUpdated = _factoryUpdated;
                },

                clearTObjects: function() {
                    tObjectsMap = [];
                    _factoryUpdated = _factoryUpdated;
                },

                factoryUpdated: function() {
                    return _factoryUpdated;
                },

                tObjects: function() {
                    return tObjectsMap;
                }

            };

        });

}());

},{}],115:[function(require,module,exports){
var CanvasElement = require('../../oui/util/CanvasElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module("omniscriptDesigner")
.filter("activeElementTitle", function($localizable, isIntegrationProcedure) {
    return function(canvasElement) {
      if (!canvasElement) {
        return "";
      }
      if (canvasElement instanceof ScriptElement) {
        if (isIntegrationProcedure) {
          return $localizable('IntProcHeaderProps');
        }
        return $localizable("OmniDesScriptHeaderProps", "Script Header Properties");
      }
      return canvasElement.CanvasType ? canvasElement.CanvasType : canvasElement.Name;
    };
  });
},{"../../oui/util/CanvasElement.js":135,"../../oui/util/ScriptElement.js":138}],116:[function(require,module,exports){
var CanvasElement = require('../../oui/util/CanvasElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module("omniscriptDesigner")
.filter("className", function() {
  return function(canvasElement) {
    if (!canvasElement) {
      return "";
    }
    if (!(canvasElement instanceof CanvasElement) && !(canvasElement instanceof ScriptElement)) {
      if (angular.isString(canvasElement)) {
        canvasElement = CanvasElement.getById(canvasElement);
      } else {
        canvasElement = CanvasElement.getById(canvasElement.Id);
      }
    }
    var className = '';
    if (canvasElement instanceof CanvasElement) {
      className = canvasElement.type().replace(/ /gi, "").toLowerCase() + "Element" + (canvasElement.isInput() ? " inputElement" : "");
    } else {
      className = canvasElement.CanvasType;
    }
    if (canvasElement.hasErrors()) {
      className += " bg-danger";
    }
    if (!canvasElement.Active__c && (canvasElement instanceof CanvasElement)) {
      className += " inactive";
    }
    return className;
  };
});
},{"../../oui/util/CanvasElement.js":135,"../../oui/util/ScriptElement.js":138}],117:[function(require,module,exports){
var PaletteElement = require('../../oui/util/PaletteElement.js');

angular.module("omniscriptDesigner")
.filter("controlType", function() {
  function isInGroup(element) {
    return /Cache Block|Try Catch Block|Loop Block|Conditional Block/.test(element.label) || /Step/.test(element.label) || /filterblock|inputblock|selectable-items|typeahead-block|edit-block|action-block|radiogroup/.test(element.type) || element.isGroupedControl();
  }

  function isInInput(element) {
    return !/Submit/.test(element.label) && (/Filter/.test(element.label) || element.isInput()) &&
           !isInFunction(element) && !isInDisplay(element) && !isInGroup(element);
  }

  function isInDisplay(element) {
    return /Headline|Text Block|Line Break/.test(element.label);
  }

  function isInFunction(element) {
    return /Aggregate|Formula|Geolocation|Validation/.test(element.label);
  }

  function isInAction(element) {
    return /Submit/.test(element.label) || (!/OmniScript/.test(element.label) && !isInInput(element) &&
           !isInGroup(element) && !isInDisplay(element) && !isInFunction(element));
  }

  var funcs = {
    group: isInGroup,
    input: isInInput,
    action: isInAction,
    display: isInDisplay,
    func: isInFunction
  };

  var arrayCache = {
    empty: []
  };

  return function(elements, type) {
    if (!arrayCache[type]) {
      arrayCache[type] = [];
    } else {
      arrayCache[type].splice(0, arrayCache[type].length);
    }
    if (elements) {
      elements.forEach(function(element) {
        if (funcs[type](element)) {
          arrayCache[type].push(element);
        }
      });
      return arrayCache[type];
    } else {
      return arrayCache.empty;
    }
  };
});

},{"../../oui/util/PaletteElement.js":137}],118:[function(require,module,exports){
angular.module("omniscriptDesigner")
.filter("elementLabel", function() {
    return function(paletteElement, showOmniIfReUsable) {
      if (!paletteElement) {
        return "";
      }
      if (showOmniIfReUsable && paletteElement.type === 'OmniScript') {
        return 'OmniScript';
      }
      if (paletteElement.prettyName) {
        return paletteElement.prettyName();
      }
      if (/Rest/i.test(this.label)) {
        if (/^rest action$/i.test(this.label))
            return this.label.replace(/\brest\b/i, 'HTTP');
        else
            return this.label.replace(/\brest\b/i, 'REST');
      } else if (/^Validation$/.test(paletteElement.label)) {
        return "Messaging";
      // OMNI-2769
      } else if (/^Custom Lightning Web Component$/.test(paletteElement.label)) {
        return "Custom LWC";
      } else if (/^Date\/Time \(Local\)$/.test(paletteElement.label)) {
        return "Date\/Time";
      } else {
        return paletteElement.label;
      }
    };
  });

},{}],119:[function(require,module,exports){
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var CanvasElement = require('../../oui/util/CanvasElement.js');
var requiredProperties = require('../../oui/util/requiredProperties.js');

angular.module('omniscriptDesigner')
    .filter('fixMissingProperties', function ($rootScope, remoteActions, save) {
        'use strict';
        var pendingPropertySetPromises = {};
        return function (canvasElement) {
            if (!canvasElement) {
                return '';
            }
            if (requiredProperties[canvasElement.type()]) {
                if (!pendingPropertySetPromises[canvasElement.type()]) {
                    pendingPropertySetPromises[canvasElement.type()] = remoteActions.loadPropertySetForElement(canvasElement.type(), $rootScope.scriptElement.IsProcedure__c);
                }
                pendingPropertySetPromises[canvasElement.type()].then(function (textJson) {
                    if (!textJson || textJson.result === '') {
                        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                        textJson = JSON.stringify(canvasElement.PropertySet__c);
                    }
                    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                    var defaultProperties = JSON.parse(textJson.replace(/\&quot;/gi, '\"'));
                    var needsSaving = false;
                    requiredProperties[canvasElement.type()].forEach(function (requiredPropName) {
                        /* jshint eqnull:true */
                        if (canvasElement.PropertySet__c[requiredPropName] == null) {
                            canvasElement.PropertySet__c[requiredPropName] = defaultProperties[requiredPropName];
                            needsSaving = true;
                        }
                    });
                    if (needsSaving) {
                        // this is to help with batching
                        setTimeout(function () {
                            save(canvasElement);
                        }, 1000 * (Math.floor((Math.random() * 10) + 1)));
                    }
                });
            }
            return canvasElement;
        };
    });
},{"../../oui/util/CanvasElement.js":135,"../../oui/util/requiredProperties.js":140}],120:[function(require,module,exports){
angular.module("omniscriptDesigner")
.filter("getTypeForElement", function($localizable, $rootScope, elementLabelFilter) {
    return function(elementName) {
      var matchingElement = null;
      $rootScope.scriptElement.each(function(element){
        if (element.Name === elementName) {
          matchingElement = element;
        }
      });
      if (matchingElement) {
        return elementLabelFilter(matchingElement.Type__c);
      } else if (elementName !== '') {
        return 'JSON Node';
      } else {
        return '';
      }
    };
  });
},{}],121:[function(require,module,exports){
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module('omniscriptDesigner')
.filter('readablePropertyName', function() {
    var transforms = {
        'label': 'Label',
        'Name' : 'Element Name',
        'controlWidth': 'Control Width',
        'required': 'Required?',
        'help': 'Help text active?',
        'showInputWidth': 'Label outside of field',
        'inputWidth': 'Field Width',
        'helpText': 'Help Text',
        'show': 'Hide Element If False',
        'mask': 'Mask',
        'maskCurrency': 'Decimal Places',
        'pattern': 'Pattern',
        'ptrnErrText': 'Error Text',
        'Active__c': 'Active?',
        'IsReusable__c': 'Reusable?',
        'Type__c': 'Type',
        'SubType__c': 'SubType',
        'DataRaptorBundleId__c': 'DataRaptor Submit Interface',
        'Language__c': 'Language',
        'bundle': 'DataRaptor Interface',
        'preTransformBundle': 'Pre-Transform DataRaptor Interface',
        'postTransformBundle': 'Post-Transform DataRaptor Interface',
        'xmlPreTransformBundle': 'XML Pre-Transform DataRaptor Interface',
        'xmlPostTransformBundle': 'XML Post-Transform DataRaptor Interface',
        'transformBundle' : 'Transform DataRaptor Interface',
        'remoteTimeout': 'Remote Timeout (ms)',
        'instruction': 'Instruction (Horizontal and Lightning Mode Only)',
        'URIEncode': 'Encode URI',
        'docuSignReturnUrl': 'DocuSign Return Url',
        'AdditionalInformation__c' : 'Description',
        'InternalNotes__c' : 'Internal Notes',
        'callFrequency' : 'Call Frequency (ms)',
        'fileAttachments' : 'File Attachments from OmniScript',
        'staticDocList' : 'Document Attachments',
        'contentVersionList' : 'Content Versions',
        'docList' : 'Document Attachments from OmniScript',
        'wpm': 'Window Post Message?',
        'ssm': 'Session Storage Message?',
        'allowCancel': 'Allow Cancel',
        'docuSignTemplatesGroup': 'DocuSign Templates Group',
        'docuSignTemplatesGroupSig': 'DocuSign Templates Group',
        'horizontalMode':'Display Mode',
        'type':'Option Source',
        'padding': 'Additonal Padding (px)',
        'svgSprite':'Default Svg Sprite',
        'svgIcon':'Default Svg Icon',
        'elementName':'Svg Controlling Element',
        'selectCheckBox':'Checkbox Element Name',
        'valueSvgMap':'Svg Controlling Element Map',
        'advancedMergeMap':'Advanced Merge Map',
        'deleteSObject':'Delete SObject',
        'columnsPropertyMap':'Columns Property Map',
        'linkToExternalObject' : 'External Objects Page',
        'labelSingular':'Singular Label',
        'labelPlural':'Plural Label',
        'nameColumn':'Column Name',
        'disOnTplt': 'Display On Template',
        'allowMergeNulls': 'NULL is a Valid Matching Value when Merging',
        'remoteConfirmMsg':'Confirmation Dialog Message',
        'subLabel':'Confirm Label',
        'timeTracking':'Enable Tracking',
        'rtpSeed':'Fetch Picklist Values at Script Load',
        'hideStepChart':'Hide Step Chart',
        'uploadContDoc':'Upload To Content Document',
        'vlcResponseHeaders':'Response Headers',
        'updateFieldValue':'Update Field Value',
        'dynamicOutputFields':'Dynamic Output Fields',
        'enableKnowledge' : 'Enable Knowledge',
        'bLK': 'Lightning Knowledge',
        'lkObjName' : 'Lightning Knowledge Object API Name',
        'knowledgeArticleTypeQueryFieldsMap' : 'Article/Record Type Query Fields Map',
        'typeFilter' : 'Record Type Filter (Lightning Knowledge Only)',
        'chartLabel' : 'Step Chart Label',
        'accessibleInFutureSteps':'Available for prefill when hidden',
        'chainableCpuLimit':'Chainable CPU Limit (ms)',
        'chainableSoslQueriesLimit':'Chainable SOSL Query Limit',
        'chainableHeapSizeLimit':'Chainable Heap Size Limit (MB)'
    };

    // creates String acronyms = '(JSON|XML|URL|...)' for use in regex patterns
    acronyms = (function (acArr){
            var pattern = "";
            acArr.forEach(function(item){
                pattern = pattern +'|'+ item;
            });
            return pattern.replace(/^\|/,"(?:")+')';
        })([
        // Array of acronyms to be handled by regex. Replace will capitalize these so don't include lower case
        'JSON','REST','HTTP','HTML','XML','URL','URI'
    ]);

    var elementSpecificTransforms = {
        'PDF Action': {
            'templateName': 'Document'
        },
        'Script Configuration': {
            'Name': 'OmniScript name'
        },
        'Procedure Configuration': {
            'Name': 'Integration Procedure Name'
        },
        'Headline': {
            'label': 'Headline',
            'labelKey': 'Headline Key'
        }
    };

    return function readablePropertyName(propertyName, element) {
        if (propertyName) {
            var parts = propertyName.split('.');
            if (propertyName.indexOf('|') > -1 || propertyName.indexOf(':') > -1) {
                return propertyName.replace(/[|:]/g,'.');
            }
            if (/^showPersistentComponent$/.test(parts[0]) && parts.length > 1) {
                return parts[1];
            }

            //changing label name from mask to decimal places for currency
            // var typeC = element['Type__c'];
            // if (typeC && /Mask/i.test(propertyName) && /Currency/i.test(typeC.label)) {
            //     return transforms['maskCurrency'];
            // }

            var lastPropName = parts[parts.length - 1];
            if (element && elementSpecificTransforms[element.type()]) {
                if (elementSpecificTransforms[element.type()][lastPropName]) {
                    return elementSpecificTransforms[element.type()][lastPropName];
                }
            } else if (/^\d+$/.test(lastPropName)) {
                return +lastPropName + 1;
            }
            if (transforms[propertyName]) {
                return transforms[propertyName];
            } else if (transforms[lastPropName]) {
                return transforms[lastPropName];
            }
            if (/Rest Action/i.test((element.Type__c||{label:""}).label||""))
                lastPropName = lastPropName.replace(/[Rr]est([A-Z])/, 'http$1');
            return lastPropName
                  // puts space before words, capitalized acronyms and numbers
                  .replace(/[A-Z][a-z]+|[A-Z]+(?=[A-Z][a-z]|$)|[0-9]+/g,' $&')
                  // Capitalizes recognized acronyms and first character
                  .replace(new RegExp('\\b'+acronyms+'\\b\|^.','ig'), v => v = v.toUpperCase())
                  .trim();
        }
        return '';
    };
});

},{"../../oui/util/ScriptElement.js":138}],122:[function(require,module,exports){
(function() {
    'use strict';
    /* jshint -W030 */

    //var MAX_SIZE = 5048576;
    var MAX_SIZE = 750000; /* 1 000 000 * 3/4 to account for base64 */
    //var FILE_SIZE_WARNING = 'file size exceeds the limit';
    var FILE_SIZE_WARNING = 'File exceeds the 1mb Remote Action upload limit. Please go' +
        ' to the Documents tab to upload the file (up to 5mb).';
    var FAILED_UPLOAD = 'The file could not be uploaded';

    function isSmallEnough(file) {
        return file.size < MAX_SIZE ;
    }

    window.tinymce.PluginManager.add('docInsert', function(editor, url) {
        editor.addCommand('openDocInsertWindow', function(callback) {
            var obj = callback();
            obj.getDocs = obj.getDocs || []; /* obj = {getDocs: [], callback: function(){}} */
            var selValue = ''; //value selected from listbox

            editor.windowManager.open(
                {
                    title: obj.imageInsert ? 'Image Insert' : 'Document Insert',
                    width: 400,
                    height: 300,
                    body: [
                        {
                            id: 'insertFromSF',
                            type:'checkbox',
                            text:'pick from existing ' + (obj.imageInsert ? 'images' : 'documents'),
                            onclick: function() {
                                var toggleValue = $('#insertFromSF').attr('aria-checked');
                                $('#filePicker').toggle();
                                (toggleValue === 'true') ? $('#selDocuments').show() : $('#selDocuments').hide();

                                //clears the error message if any
                                $('#errorLabel').text('');
                            }
                        },
                        {
                            type: 'textbox',
                            id: 'filePicker',
                            onPostRender: function() {
                                $('#filePicker').attr('placeholder', 'click to browse for files');
                            },
                            onclick: function() {
                                //clears the error message if any
                                $('#errorLabel').text('');

                                $('#fileSelector').click();
                            },
                            onChange: function(e) {
                                var files = ($('input:file'))[0].file;

                            }
                        },
                        {
                            type:'selectbox',
                            id:'selDocuments',
                            style: 'height:25px; padding: 2px 0;background-color: #F0F0F0; border-radius: 3px',
                            width: 200,
                            options: obj.getDocs () || []
                        },
                        {
                            type: 'textbox',
                            subtype: 'file',
                            id: 'fileSelector',
                            style: 'display:none',
                            width: 200,
                            onPostRender: function() {
                                obj.imageInsert && (function() {
                                    setTimeout(function() {
                                        $('#fileSelector').attr('accept', 'image/*');
                                    });
                                }());
                            },
                            onChange: function(e) {
                                //updates the text field
                                var files = ($('input:file'))[0].files;
                                document.getElementById('filePicker').value = files[0].name;
                            }
                        },
                        {
                            type: 'container',
                            html:'<div><p style="color:red; word-break: break-all; white-space: normal;' +
                                'font-size: 12px; font-style: italic; position:relative; top:-20px" id="errorLabel"></p></div>'
                        }
                    ],
                    onPostRender: function() {
                        setTimeout(function() {
                            $('#selDocuments').hide();
                        });
                    },
                    onsubmit: function() {
                        var win = this;

                        //gets executed when select from salesforce is checked
                        ($('#insertFromSF').attr('aria-checked') === 'true') && (function() {

                            //getting the value from the selectbox
                            var value = $('#selDocuments').val(),
                                docId = '';
                            value && (function() {
                                docId = $.parseHTML (value)[0].id;
                            }());

                            //this step is very important otherwise
                            //the selValue contains non ascii
                            //characters
                            selValue = '' + selValue.trim();

                            if (/oid=/.test(docId)){
                                document.getElementById(obj.fieldName).value = 'https://' + window.location.hostname +
                                    '/servlet/servlet.ImageServer?id=' + docId;
                            } else {
                                document.getElementById(obj.fieldName).value = 'https://' + window.location.hostname +
                                    '/servlet/servlet.FileDownload?file=' + docId;
                            }

                            obj.callback = false;
                            win.close();
                            return true;
                        }());

                        //gets executes when the select from salesforce checkbox is not checked
                        obj.callback && (function() {
                            var files = ($('input:file'))[0].files;
                            var reader = new FileReader();
                            //console.log(files[0]);
                            reader.readAsBinaryString(files[0]);

                            reader.onerror = function(e) {
                                document.getElementById('filePicker').value =  files[0].name;
                                console.log(e);
                            };

                            reader.onload = function(e) {
                                if (!isSmallEnough(files[0])) {
                                    //document.getElementById('filePicker').value =  FILE_SIZE_WARNING + ': ' +
                                    //files[0].name;

                                    $('#errorLabel').text(FILE_SIZE_WARNING);
                                    return false;
                                }

                                document.getElementById('filePicker').value =  'uploading ' + files[0].name + '...';

                                var bstring = e.target.result;
                                var result = obj.callback(bstring,files[0].name, files[0].type);

                                //dont see error from SF incase of failed uploads
                                result.then && result.then(function(result) {
                                    //this returns an array of valid
                                    //docs or erraneous doc - check
                                    //the remote action upload
                                    //document
                                    var urlLocation = '';
                                    if (obj.imageInsert) {
                                        urlLocation =   'https://' + window.location.hostname +
                                                            '/servlet/servlet.ImageServer?' + 
                                                            'id=' + result[0].Id +
                                                            '\&\&docName=' + result[0].DeveloperName + 
                                                            '\&\&oid=' + window.oid;

                                    } else {
                                        var fileId = result[0].Id + '\&\&docName=' + result[0].DeveloperName;
                                        urlLocation =  'https://' + window.location.hostname +
                                            '/servlet/servlet.FileDownload?file=' + fileId ;
                                    }

                                    window.document.getElementById (obj.fieldName).value = urlLocation;
                                    win.close();
                                }, function(fail) {
                                    $('#errorLabel').text(FAILED_UPLOAD + (fail.message ? 'Error message: ' + fail.message : '.'));
                                });
                            };
                        }());

                        //this makese the window stay up till the reader on load gets done
                        return false;
                    }
                });
        });

    });
}());

},{}],123:[function(require,module,exports){
(function() {
    /*jshint -W030 */
    'use strict';
    var htmlString = '<div id="articleList" style="overflow-y:auto; padding: 5px; border-radius: 5px; border: 1px solid #C5C5C5;' +
        ' width: 550px !important; height: 250px !important;" readonly="readonly"></div>';

    window.tinymce.PluginManager.add('smartLink', function(editor, url) {

        editor.addButton('example', {
            icon: 'anchor',
            tooltip:'Smart link',
            onclick: function() {
                editor.editorCommands.execCommand('openSmartLinkWindow');
            }
        });

        editor.addCommand('openSmartLinkWindow', function(callback, callback2) {
            var selValue = 'online';
            var langCode = '';

            editor.windowManager.open({
                title: 'Smart Link Article',
                buttons: [],
                body: [
                    {
                        type: 'listbox',
                        id: 'publishStatus',
                        values: [
                            {text: 'Publish', value: 'online'},
                            {text: 'Draft', value: 'draft'},
                            {text: 'Draft Translation', value: 'archived'},
                        ],
                        onselect: function(v) {
                            selValue = v.target.settings.value;
                        }
                    },{
                        type: 'listbox',
                        id: 'langCode',
                        values: window.tinymce.getLanguageCodeMap(),
                        onselect: function(v) {
                            langCode = v.target.settings.value;
                        },
                        onPostRender: function(v){
                            this.value('en_US');
                            langCode = 'en_US';
                        }
                    },{
                        type: 'textbox',
                        id: 'sText',
                        subtype: 'text',
                    },{
                        type: 'container',
                        style: 'padding-bottom: 10px; height: 250px ! important',
                        html:htmlString
                    }
                ],
                onsubmit: function(e) {
                    // Insert content when the window form is submitted
                    //editor.insertContent('Title: ' + e.data.title);
                    $('#articleList').empty();
                    var resultString = '';
                    var sKey = $('#sText').val() || '';
                    console.log(sKey, selValue, langCode);

                    window.tinymce.remoteCall(sKey, selValue, langCode).then(function(results) {
                        var articles = JSON.parse(results.replace(/&quot;/g,'"'));

                        (!articles.error) && (function(){
                            window.angular.forEach(articles,function(article) {
                            var display = article.urlName;
                            
                            //popup true disables the salesforce headerforarticles
                            resultString = resultString  + '<p class="mce-anchor" style="padding: 5px" ><a title="' +
                                article.title + '" href="/articles/' + article.articleType + '/' +
                                article.urlName + '?popup=true" target="_blank">' + display +  '</a></p>';
                            });
                        }());
                        
                        resultString &&
                            (function(){
                                $('#articleList').append(resultString);
                            }());
                    });

                    //query the remote actions object and see what it gives you
                    return false;
                },
                onPostRender: function() {
                    var win = this;

                    //bubbles the click on the links inside the div area
                    $('#articleList').click(function(event) {

                        //incase the user clicks on the empty div
                        if (event.target.id === 'articleList'){
                            return ;
                        }
                        
                        var aTag = '\<a class=mce-anchor' + ' href="' + event.target.getAttribute('href') +
                            '" target="_blank"\>' + (event.target.text ||  event.target.getAttribute('href'))  + '\<\/a\>&nbsp;';
                        editor.insertContent(aTag);
                        event.preventDefault();
                        win.close();
                    });

                    setTimeout(function() {
                        $('#sText').attr('placeholder', 'enter the name of the article and press enter');
                    });
                }

            });
        });
    });

}());

},{}],124:[function(require,module,exports){
/* globals VOUINS */
var osLabelSet = require('../../common/shared/osLabelSet.js');

(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .service('customLabelService', CustomLabelService);

    CustomLabelService.$inject = ['remoteActions', '$q', '$timeout'];

    // increase the polling timeout to 5 minutes
    window.conn.metadata.pollTimeout = 5 * 60 * 1000;

    function CustomLabelService(remoteActions, $q, $timeout) {
        var self = this,
            allUnmanagedLabels = {},
            ns = fileNsPrefix();

        this.currentEditLanguage = 'en_US';
        this.getLabelValue = getLabelValue;
        this.isValidLabelName = isValidLabelName;
        this.getLanguageCodeFor = getLanguageCodeFor;
        this.getLabelsForElement = getLabelsForElement;
        this.loadAllCustomLabelsInOrg = loadAllCustomLabelsInOrg;
        this.saveAll = saveAll;

        this.translations = [
            {
                value: 'zh_CN',
                label: 'Chinese (Simplified)'
            }, {
                value: 'zh_TW',
                label: 'Chinese (Traditional)'
            }, {
                value: 'da',
                label: 'Danish'
            }, {
                value: 'nl_NL',
                label: 'Dutch'
            }, {
                value: 'en_US',
                label: 'English (US)'
            }, {
                value: 'fi',
                label: 'Finnish'
            }, {
                value: 'fr',
                label: 'French'
            }, {
                value: 'de',
                label: 'German'
            }, {
                value: 'it',
                label: 'Italian'
            }, {
                value: 'ja',
                label: 'Japanese'
            }, {
                value: 'ko',
                label: 'Korean',
            }, {
                value: 'no',
                label: 'Norwegian'
            }, {
                value: 'pt_BR',
                label: 'Portuguese (Brazil)'
            }, {
                value: 'ru',
                label: 'Russian'
            }, {
                value: 'es',
                label: 'Spanish'
            }, {
                value: 'es_MX',
                label: 'Spanish (Mexico)'
            }, {
                value: 'sv',
                label: 'Swedish'
            }, {
                value: 'th',
                label: 'Thai'
            }, {
                value: 'ar',
                label: 'Arabic'
            }, {
                value: 'bg',
                label: 'Bulgarian'
            }, {
                value: 'hr',
                label: 'Croatian'
            }, {
                value: 'cs',
                label: 'Czech'
            }, {
                value: 'en_GB',
                label: 'English (UK)'
            }, {
                value: 'el',
                label: 'Greek'
            }, {
                value: 'iw',
                label: 'Hebrew'
            }, {
                value: 'hu',
                label: 'Hungarian'
            }, {
                value: 'in',
                label: 'Indonesian'
            }, {
                value: 'pl',
                label: 'Polish'
            }, {
                value: 'pt_PT',
                label: 'Portuguese (European)'
            }, {
                value: 'ro',
                label: 'Romanian'
            }, {
                value: 'sk',
                label: 'Slovak'
            }, {
                value: 'sl',
                label: 'Slovenian'
            }, {
                value: 'tr',
                label: 'Turkish'
            }, {
                value: 'uk',
                label: 'Ukrainian'
            }, {
                value: 'vi',
                label: 'Vietnamese'
            }
        ].sort(function(a, b) {
            var nameA = a.label.toUpperCase(); // ignore upper and lowercase
            var nameB = b.label.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });

        this.defaultValuesToLabelNames = {
            'previousLabel': ns + 'OmnipreviousLabel',
            'nextLabel': ns + 'OmninextLabel',
            'cancelLabel': ns + 'OmnicancelLabel',
            'saveLabel': ns + 'OmnisaveLabel',
            'completeLabel': ns + 'OmnicompleteLabel',
            'submitLabel': ns + 'OmnisubmitLabel',
            'summaryLabel': ns + 'OmnisummaryLabel',
            'reviseLabel': ns + 'OmnireviseLabel',
            'failureNextLabel': ns + 'OmnifailureNextLabel',
            'failureAbortLabel': ns + 'OmnifailureAbortLabel',
            'failureGoBackLabel': ns + 'OmnifailureGoBackLabel',
            'redirectNextLabel': ns + 'OmniredirectNextLabel',
            'redirectPreviousLabel': ns + 'OmniredirectPreviousLabel',
            'consoleTabLabel': ns + 'OmniconsoleTabLabel',
            'newItemLabel': ns + 'OmninewItemLabel',
            'newLabel': ns + 'OmninewLabel',
            'editLabel': ns + 'OmnieditLabel',
            'cancelMessage': ns + 'OmnicancelMessage',
            'saveMessage': ns + 'OmnisaveMessage',
            'completeMessage': ns + 'OmnicompleteMessage',
            'inProgressMessage': ns + 'OmniinProgressMessage',
            'postMessage': ns + 'OmnipostMessage',
            'failureAbortMessage': ns + 'OmnifailureAbortMessage',
            'subLabel': ns + 'OmniDelete',
            'remoteConfirmMsg': ns + 'OmniremoteActionConfirm'
        };

        this.omniInbuiltLangsToSFDCCode = null;
        ////////////////

        function getLabelValue(labelName, language) {
            return makeRequestForLabelIfNotInflight(labelName, language);
        }

        var mapOfInflightRequests = {};

        function makeRequestForLabelIfNotInflight(labelName, language) {
            if (!mapOfInflightRequests[labelName + '-' + language]) {
                mapOfInflightRequests[labelName + '-' + language] =
                getLabelFromApexHack(labelName, language)
                        .finally(function () {
                            mapOfInflightRequests[labelName + '-' + language] = null;
                        });
            }
            return mapOfInflightRequests[labelName + '-' + language];
        }

        function getLabelFromApexHack(labelName, languageCode) {
            return $q(function(resolve, reject) {
                    remoteActions.getCustomLabels([labelName], languageCode)
                        .then(function (allLabels) {
                            var labelResult = JSON.parse(allLabels) || {};
                            if (labelResult.messages && labelResult.messages.length > 0) {
                                labelResult.messages.forEach(function (message) {
                                    if (message.severity === 'ERROR') {
                                        throw new Error(message.message);
                                    }
                                });
                            }
                            if (labelResult.data && labelResult.data.dataMap) {
                                labelResult = labelResult.data.dataMap;
                            }
                            var map = {};
                            Object.keys(labelResult).forEach(function (returnedLabelName) {
                                if (returnedLabelName !== 'language' &&
                                    returnedLabelName === labelName) {
                                    resolve(labelResult[returnedLabelName]);
                                    return;
                                }
                            });
                            reject('No translation of "' + labelName + '" in ' + languageCode);
                        })
                        .catch(function(err) {
                            reject(err);
                        });
                });
        }

        function isValidLabelName(labelName) {
            if (labelName && /__/.test(labelName)) {
                return isValidLabelName(labelName.split('__')[1]);
            }

            // The name must begin with a letter
            // and use only alphanumeric characters and underscores.
            // The name cannot end with an underscore
            // or have two consecutive underscores.
            // from https://unix.stackexchange.com/a/78524
            return labelName && /^[A-Za-z][0-9A-Za-z]*(_[0-9A-Za-z]+)*$/.test(labelName);
        }

        function saveAll(arrayOfLabels) {
            if (!allUnmanagedLabels) {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(saveAll(arrayOfLabels));
                    }, 1000);
                });
            }

            var arrayToUpsert = [],
                arrayToDeploy = [];
            arrayOfLabels.forEach(function(label) {
                if (label.value === null ||
                    label.value === undefined) {
                    return;
                }

                // Do a metadata deploy instead of upsert if this label is from a managed
                // package.
                if (/__/.test(label.name)) {
                    arrayToDeploy.push(label);
                    return;
                }

                var existingLabel = allUnmanagedLabels[label.name.toLowerCase()];

                // change the name to match the case sensitive version of the existing one
                // otherwise we'll get a duplicate error
                if (existingLabel) {
                    label.name = existingLabel.originalName;
                }

                // Do a metadata deploy instead of upsert if the label exists
                // but this is a different language.
                if (existingLabel &&
                    existingLabel.originalLanguage !== label.language) {
                    arrayToDeploy.push(label);
                    return;
                }

                // Don't do anything if the language and label value are the same
                if (existingLabel &&
                    existingLabel.originalLanguage === label.language &&
                    existingLabel.value === label.value) {
                    return;
                }

                arrayToUpsert.push(label);
            });

            var promiseToUpsert = upsertAll(_.uniqBy(arrayToUpsert, 'name'));
            var promiseToDeploy = deployAll(_.uniqBy(arrayToDeploy, 'name'));

            return $q.all([promiseToUpsert, promiseToDeploy]);
        }

        function upsertAll(arrayOfLabels) {
            if (!arrayOfLabels ||
                arrayOfLabels.length === 0) {
                return $q.when(true);
            }

            // Metadata api only accepts 10 inserts at a time, so split
            // up larger arrays into multiple smaller ones and submit individually
            if (arrayOfLabels.length > 10) {
                var maxSizeTenArrays = [];
                while (arrayOfLabels.length > 0) {
                    maxSizeTenArrays.push(arrayOfLabels.splice(0, 10));
                }

                return $q.all(maxSizeTenArrays.map(function(arrayOfLabels) {
                    return upsertAll(arrayOfLabels);
                }));
            }

            var metadata = arrayOfLabels.map(function(label) {
                return {
                    fullName: label.name,
                    language: label.language,
                    protected: false,
                    shortDescription: label.shortDescription,
                    value: label.value
                };
            });
            return $q(function (resolve, reject) {
                window.conn.metadata.upsert('CustomLabel', metadata, function (err, results) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!Array.isArray(results)) {
                        results = [results];
                    }
                    var errors = results.filter(function(result) {
                        return result.errors;
                    }).map(function(result) {
                        return result.errors;
                    });
                    if (errors.length > 0) {
                        reject(errors);
                        return;
                    }
                    resolve(results[0]);
                });
            });
        }

        function deployAll(arrayOfLabels) {
            if (!arrayOfLabels ||
                arrayOfLabels.length === 0) {
                return $q.when(true);
            }

            return createZipOfAll(arrayOfLabels)
                .then(function(zipStream) {
                    return $q(function(resolve, reject) {
                        window.conn.metadata.deploy(zipStream, {
                                singlePackage: true
                            })
                            .complete(function(err, deployResult) {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                if (deployResult.success === false) {
                                    window.conn.metadata.checkDeployStatus(deployResult.id, true,
                                            function(err, result) {
                                                console.log(err);
                                                console.log(result);
                                            });
                                    reject(deployResult);
                                    return;
                                }

                                resolve(deployResult);
                            });
                    });
                });
        }

        function createZipOfAll(arrayOfLabels) {
            return $q(function(resolve, reject) {
                var zip = new window.JSZip();

                var langToLabelsMap = arrayOfLabels.reduce(function(map, label) {
                    if (!map[label.language]) {
                        map[label.language] = [];
                    }

                    map[label.language].push(label);

                    return map;
                }, {});

                zip.file(
                    'package.xml',
                    '<?xml version=\"1.0\" encoding=\"UTF-8\"?>' +
                    '<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\">' +
                        '<types>' +
                            '<members>*</members>' +
                            '<name>CustomLabels</name>' +
                        '</types>' +
                        '<types>' +
                            Object.keys(langToLabelsMap)
                                    .map(function(language) {
                                        return '<members>' + language + '</members>';
                                    })
                                    .join('') +
                            '<name>Translations</name>' +
                        '</types>' +
                        '<version>42.0</version>' +
                    '</Package>'
                );

                Object.keys(langToLabelsMap)
                    .forEach(function(language) {
                        var languageLabels = langToLabelsMap[language];

                        var languageLabelsXml = arrayOfLabels.map(function(label) {
                            return '<customLabels>' +
                                        '<label>' + label.value + '</label>' +
                                        '<name>' + label.name + '</name>' +
                                    '</customLabels>';
                        });

                        // translation file
                        zip.file(
                            'translations/' + language + '.translation',
                            '<?xml version=\"1.0\" encoding=\"UTF-8\"?>' +
                            '<Translations xmlns=\"http://soap.sforce.com/2006/04/metadata\">' +
                                languageLabelsXml +
                            '</Translations>'
                        );
                    });

                var content = zip.generateAsync({type: 'base64'})
                    .then(function(content) {
                        resolve(content);
                    });
            });
        }

        function loadOmniLanguages() {
            return remoteActions.getLanguageCodeMap()
                .then(function (langCodeMap) {
                    self.omniInbuiltLangsToSFDCCode = langCodeMap;
                    return self.omniInbuiltLangsToSFDCCode;
                });
        }

        function getLanguageCodeFor(language) {
            if (!self.omniInbuiltLangsToSFDCCode) {
                return loadOmniLanguages()
                    .then(function (languages) {
                        return self.omniInbuiltLangsToSFDCCode[language];
                    });
            } else {
                return $q.when(self.omniInbuiltLangsToSFDCCode[language]);
            }
        }

        function xmlToJson(xmlString) {
            var xml = xmlString;
            if (xml == null) {
                return {};
            }
            if (angular.isString(xmlString)) {
                var oParser = new DOMParser();
                xml = oParser.parseFromString(xmlString, 'text/xml');
                if (isParseError(xml)) {
                    return {};
                }
            }

            // Create the return object
            var obj = {};
            if (xml.nodeType === 1) { // element
                processXmlAttributes(xml, obj);
            } else if (xml.nodeType === 3) { // text
                obj = xml.nodeValue;
            }

            // do children
            if (xml.hasChildNodes()) {
                processChildNodes(xml, obj);
            }
            return obj;
        }

        function processXmlAttributes(xml, obj) {
            // do attributes
            if (xml.attributes.length > 0) {
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj['@' + attribute.nodeName] = attribute.nodeValue;
                }
            }
        }

        function processChildNodes(xml, obj) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) === 'undefined') {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) === 'undefined') {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }

        function isParseError(parsedDocument) {
            // parser and parsererrorNS could be cached on startup for efficiency
            var parser = new DOMParser(),
                errorneousParse = parser.parseFromString('<', 'text/xml'),
                parsererrorNS = errorneousParse.getElementsByTagName('parsererror')[0].namespaceURI;

            if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
                // In PhantomJS the parseerror element doesn't seem to have a special
                // namespace, so we are just guessing here :(
                return parsedDocument.getElementsByTagName('parsererror').length > 0;
            }

            return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
        }

        function resolveType(type) {
            switch (type) {
                case 'Script Configuration': return 'Script';
                default: return type;
            }
        }

        function getLabelsForElement(element) {
            var labels = VOUINS.ootbLabelMap[resolveType(element.type())];
            if (!labels) {
                labels = [];
            }

            switch(element.type()) {
                case 'Step': labels.push('instruction');
                    break;
                case 'Text Block': // text block and disclosure to be treated the same
                case 'Disclosure': labels.push('text');
                    break;
                default: break;
            }

            if (element.PropertySet__c &&
                element.PropertySet__c.label !== undefined &&
                element.type() !== 'Line Break') {
                labels.push('label');
            }
            return labels.reduce(function(array, key) {
                if (key.indexOf('|n') > -1 || key.indexOf(':') > -1) {

                    var prop = element.PropertySet__c;
                    var paths = VOUINS.createPropPaths(prop, key);
                    array = array.concat(paths);

                } else {
                    array.push(key);
                }
                return array;
            }, []).filter(function(label) {
                return !!label;
            }).filter(function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            });
        }

        function loadAllCustomLabelsInOrg() {
            allUnmanagedLabels = null;
            window.conn.metadata.retrieve({
                unpackaged: {
                    'types': {
                        'members': '*',
                        'name': 'CustomLabel'
                    },
                    'version': '42.0'
                }
            }).complete(function (err, result) {
                window.JSZip.loadAsync(result.zipFile, {base64: true})
                    .then(function (zip) {
                        var customLabelsFile = $q.when('<?xml version=\"1.0\" ' +
                        'encoding=\"UTF-8\"?><CustomLabels xmlns=\"http://soap.sforce.com/2006/04/metadata\">' +
                        '</CustomLabels>');
                        if (zip.files['unpackaged/labels/CustomLabels.labels']) {
                            var outputFile = zip.file('unpackaged/labels/CustomLabels.labels');
                            if (outputFile) {
                                customLabelsFile = outputFile.async('string');
                            }
                        }
                        return customLabelsFile;
                    }).then(function (text) {
                        var jsonResponse = xmlToJson(text);

                        var labels = jsonResponse.CustomLabels.labels;
                        if (!Array.isArray(labels) && labels) {
                            labels = [labels];
                        }
                        if (!labels) {
                            allUnmanagedLabels = {};
                            return;
                        }
                        allUnmanagedLabels = labels.reduce(function (obj, label) {
                            if (!obj[label.fullName['#text'].toLowerCase()]) {
                                obj[label.fullName['#text'].toLowerCase()] = {};
                            }
                            obj[label.fullName['#text'].toLowerCase()] = {
                                originalName: label.fullName['#text'],
                                originalLanguage: label.language['#text'],
                                isDefault: true,
                                value: label.value['#text']
                            };
                            return obj;
                        }, {});
                    });
            });
        }
    }
})();

},{"../../common/shared/osLabelSet.js":2}],125:[function(require,module,exports){
(function() {
    /* jshint -W030 */
    'use strict';
    window.angular.module('omniscriptDesigner').
        service('customViewModalService', ['$modal', 'interTabMsgBus', function($modal, interTabMsgBus){

            this.getCustomViewModalWindow = function(pScope, newValue, oldValue, pageToMode, callback){
                
                var self = this;

                //gets the layout and the view name from the localStorage
                this.config = (function(){
                    return interTabMsgBus.get('config', true) ; //this can be a valid object or an empty object
                }());

                
                //if nothing was written to the localStorage
                (!this.config) && (function(){
                    self.config = {};
                    self.config.layout = self.config.layout || 'false';
                }());

                return $modal ({
                    title: 'Custom Visual Force Page Setup',
                    templateUrl: 'custom-VF-modal.tpl.html',
                    backdrop: 'static',
                    keyboard: false,
                    controller: function($scope, $http){
                        $scope.customViewModal = self.config;

                        $scope.submit = function(){

                            //newValue is custom
                            pageToMode[newValue] = $scope.customViewModal.pageName;
                            
                            var sucessCallback = function(result){
                                //this is a hack - since salesforce always the header as 200 no matter what happens
                                if (/Visualforce Error/.test(result.data)){
                                    $scope.errorMessage = $scope.customViewModal.pageName + ' is not a valid page';
                                } else {
                                    $scope.$hide();

                                    window.setTimeout(function(){
                                        //writing to the session no matter what
                                        interTabMsgBus.set('config', self.config, true);
                                    },0);
                                    
                                    callback && (function(){
                                        callback(function(){
                                            //replace this with an object
                                            return {
                                                verticalMode: '&verticalMode='+ $scope.customViewModal.layout,
                                            };
                                        });
                                    }());
                                    
                                    $scope.errorMessage = '';
                                }
                            };

                            var failureCallback = function(error){
                                //notify the user that the page is invalid
                                $scope.errorMessage = $scope.customViewModal.pageName + ' is not a valid page';
                            };

                            //check the page for 404s 
                            $http.get('/apex/' + $scope.customViewModal.pageName).then(sucessCallback,
                                                                                       failureCallback);

                        };

                        $scope.cancel = function() {
                            //flips the select to the oldervalue when we cancel the modal
                            pScope.previewMode = oldValue;
                            $scope.$hide();
                        };
                    }
                });
            };
        }]);
}());

},{}],126:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .service('dataraptorBundleService', dataraptorBundleService);

    dataraptorBundleService.$inject = ['remoteActions'];

    function dataraptorBundleService(remoteActions) {
        this.getMatchingDRBundles = getMatchingDRBundles;

        ////////////////

        function getMatchingDRBundles(name, types) {
            return remoteActions.getMatchingDRBundles(name, types);
        }

    }
})();

},{}],127:[function(require,module,exports){
(function () {
    'use strict';
    angular
        .module('omniscriptDesigner')
        .service('lwcService', lwcService);

    lwcService.$inject = ['toolingService'];

    function lwcService(toolingService) {

        let fetchPromise = undefined;
        let lwcList = [];
        let loadComplete = false;
        this.getLwcList = getLwcList;

        function getLwcList() {

            return new Promise(resolve => {
                if (loadComplete) {
                    resolve(lwcList);
                    return;
                }

                if (!fetchPromise) {
                    fetchPromise = loadList('')
                        .then(() => {
                            lwcList = lwcList.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
                        })
                        .catch(error => {
                            console.error(error);
                        })
                        .finally(() => {
                            resolve(lwcList);
                        });
                }

                return fetchPromise;
            });
        }

        function loadList(nextUrl) {
            return toolingService.getNonOmniScriptLwcs(nextUrl)
                .then(response => {

                    // Get the package namespace
                    const nsPrefix = isInsidePckg === 'true' ? fileNsPrefix().replace('__', '') : '';

                    const bundles = response.records.map(record => {
                        // Append the namespace ONLY to components that belong to the package
                        const ns = record.NamespacePrefix && nsPrefix === record.NamespacePrefix
                            ? record.NamespacePrefix + '__'
                            : '';
                        return ns + record.DeveloperName;
                    });
                    lwcList = lwcList.concat(bundles);
                    loadComplete = response.nextRecordsUrl === undefined;

                    return loadComplete ? Promise.resolve() : loadList(response.nextRecordsUrl);
                });
        }
    }
})();

},{}],128:[function(require,module,exports){
(function(){
    window.angular.module('omniscriptDesigner')
        .service('propertyEditorModalService', ['$timeout', '$modal', 'remoteActions',function($timeout, $modal, remoteActions){

            this.imgDocs = [];

            this.supportedFormats = ['png', 'gif', 'jpeg', 'jpg'];

            var self = this;

            this.init = function(documents) {
                this.documents = documents.map(function(document) {
                        ((document.IsPublic && document.Type && document.Type.indexOf('image') !== -1) ||  self.supportedFormats.includes(document.Type)) &&
                            (function() {
                                self.imgDocs.push(document);
                            }());

                        return document ;
                });
            };

            this.loadDocs = function(){
                remoteActions.getAllDocuments().then(function(documents) {
                    self.init(documents);
                });
            };

            this.loadDocs();

            this.prepDocInsert = function(parentObject, tgtProp, imageInsert) {
                var input = {};
                input.filePicker = false;
                input.fileUpload = null;
                input.selDocuments = null;
                input.imageInsert = imageInsert;
                input.currentValue = parentObject[tgtProp];

                input.callback = function(bstring, name) {
                    return remoteActions.uploadDocument(btoa(bstring),name, 'image'); //this returns a promise
                };

                input.getTest = function(){
                    return self.names;
                };

                input.getDocs = function(imageInsert) {
                    if (imageInsert)
                        return self.imgDocs;
                    else return self.documents;
                };

                input.loadDocs = function(){return self.loadDocs();};

                        if (input.currentValue){
                            input.filePicker = true;
                            input.selDocuments = input.getDocs(imageInsert).find(function(doc){
                                if (doc.Id == input.currentValue.match(/[^=&;]+(?=(?:&(?:amp;?)?){1,2}(?:docName|oid=))/)[0])
                                    return doc;
                            });
                        }

                        this.openDocInsert(function(){
                            return input;
                        }, parentObject, tgtProp);
            };

            this.openDocInsert = function(callback, parentObject, tgtProp) {

                return $modal({
                        title: (callback().imageInsert ? 'Image' : 'Document') + ' Insert',
                        templateUrl: 'modal-doc-insert.tpl.html',
                        controller: function($scope){
                            $scope.obj = callback();

                            var MAX_SIZE = 750000;

                            var FILE_SIZE_WARNING = 'File exceeds the 1mb Remote Action upload limit. Please go' +
                                                    ' to the Documents tab to upload the file (up to 5mb).';
                            var FAILED_UPLOAD = 'The file could not be uploaded';

                            function isSmallEnough(file) {
                                return file.size < MAX_SIZE ;
                            }



                            $scope.cancel = function(){
                                $scope.$hide();
                            };

                            $scope.delete = function(){
                                parentObject[tgtProp] = null;
                                $scope.$hide();
                            };

                            $scope.submit = function(){

                                var basePath = ($scope.obj.imageInsert ? '../servlet/servlet.ImageServer?' : '../servlet/servlet.FileDownload?file=');

                                if($scope.obj.filePicker && $scope.obj.selDocuments !== null){
                                    if ($scope.obj.imageInsert) {
                                        parentObject[tgtProp] = basePath + 
                                                                'id=' + $scope.obj.selDocuments.Id +
                                                                '&&docName=' + $scope.obj.selDocuments.DeveloperName +
                                                                '&&oid=' + window.oid;
                                    } else {
                                        parentObject[tgtProp] = basePath + $scope.obj.selDocuments.Id +
                                                                '&&docName=' + $scope.obj.selDocuments.DeveloperName;
                                    }

                                    $scope.obj.callback = false;
                                    $scope.cancel();


                                }else if(!($scope.obj.filePicker || document.getElementById('filePicker').files === null)){
                                    //Submit UPLOADED docId
                                    var file = document.getElementById('filePicker').files[0];
                                    var reader = new FileReader();

                                    reader.readAsBinaryString(file);

                                    reader.onerror = function(e) {
                                        document.getElementById('docSelModalFile').value =  file.name;
                                    };

                                    reader.onload = function(e) {
                                        if (!isSmallEnough(file)) {
                                            $('#errorLabel').text(FILE_SIZE_WARNING);
                                            return false;
                                        }

                                        document.getElementById('docSelModalFile').value =  'uploading ' + file.name + '...';

                                        var bstring = e.target.result;
                                        var result = $scope.obj.callback(bstring,file.name, file.type);

                                        result.then && result.then(function(result) {
                                            if ($scope.obj.imageInsert){
                                                parentObject[tgtProp] = basePath + 
                                                                        'id=' + result[0].Id +
                                                                        '&&docName=' + result[0].DeveloperName+
                                                                        '&&oid=' + window.oid;
                                            } else{
                                                parentObject[tgtProp] = basePath + result[0].Id +
                                                                        '&&docName=' + result[0].DeveloperName;
                                            }

                                            $scope.obj.loadDocs();
                                            $scope.cancel();
                                        }, function(fail) {
                                            $('#errorLabel').text(FAILED_UPLOAD + (fail.message ? 'Error message: ' + fail.message : '.'));
                                        });
                                    };


                                }
                            };

                            $scope.clearError = function(){
                                $('#errorLabel').text('');
                            };

                        }                    
                });
            };

            this.prepExpressionEditor = function(elementNames,parentObject, tgtProp, expressionOnly){
                var input = {};
                input.currentVal = parentObject[tgtProp];
                if (typeof input.currentVal == 'undefined'){
                    input.currentVal='';
                }
                input.elementNames = elementNames;

                // delete leading '=' token
                if (!expressionOnly) {
                    input.currentVal = String(input.currentVal).replace(/(?:^\s*=)|(?:\s*$)/g,'');
                }

                this.openExpressionEditor(function(){
                    return input;
                },parentObject, tgtProp);
            };

            this.openExpressionEditor = function(callback, parentObject, tgtProp) {

                return $modal({
                    title: 'Expression Editor',
                    templateUrl: 'modal-edit-expression.tpl.html',
                    backdrop:'static',
                    controller: function($scope) {
                        $scope.obj = callback();

                        $scope.obj.newVal = $scope.obj.currentVal;

                        $scope.cancel = function(){
                            $scope.$hide();
                        };

                        $scope.submit = function(){
                            if($scope.obj.newVal || $scope.obj.newVal == 'false'){
                                parentObject[tgtProp] = '='+$scope.obj.newVal;
                                if(parentObject.hasOwnProperty('$parentProperty') && parentObject.$parentProperty){
                                    parentObject.$parentProperty.update();
                                } else {
                                    parentObject.update();
                                }
                            }
                            $scope.cancel();
                        };
                    }
                });
            };
        }
    ]);
}());
},{}],129:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .service('sObjectService', sObjectService);

        sObjectService.$inject = ['remoteActions'];

    function sObjectService(remoteActions) {
        this.getSObjects = getSObjects;

        var cachedSObjects = undefined;


        // call to get them straight away since this is slow
        getSObjects();

        ////////////////

        function getSObjects() {
            var fetchPromise = fetchSObjects()
                                .then(function (sObjects) {
                                    cachedSObjects = sObjects;
                                    return cachedSObjects;
                                });

            // to ensure we get fresh sObjects we'll always return the latest set but then update the
            // result. So on first call to this function we return undefined which let's Angular know
            // there's no results yet.
            if (!cachedSObjects) {
                return fetchPromise;
            }
            return Promise.resolve(cachedSObjects);
        }

        function fetchSObjects() {
            return remoteActions.getAllObjects().then(function (allObjects) {
                return allObjects.sort(function (a, b) {
                    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
                });
            });
        }

    }
})();

},{}],130:[function(require,module,exports){
(function () {
    /* jshint -W030 */
    'use strict';
    window.angular.module('omniscriptDesigner')
        .service('tinyMCEService', ['$timeout', 'remoteActions',function($timeout, remoteActions) {
            var tinyMCE = window.tinyMCE;
            var self = this;

            var stylesheetref = $('link[rel=stylesheet]').filter(function () {
                return /vlocity\.css/.test(this.getAttribute('href'));
            });

            this.plugins = (function() {
                return 'docInsert smartLink';
            }());
            this.imageDocs = [];

            this.supportedFormats = ['png', 'gif', 'jpeg', 'jpg'];

            this.tinymceOptions = {
                body_class: 'vlocity',
                menubar: true,
                //relative_urls: false,
                elementpath: false,
                plugins: [
                    'code advlist autolink lists link image charmap preview hr anchor pagebreak',
                    'searchreplace wordcount visualblocks visualchars code fullscreen',
                    'insertdatetime table media nonbreaking contextmenu directionality',
                    'template paste textcolor colorpicker textpattern imagetools ' + this.plugins
                ],
                imagetools_toolbar: 'imageoptions',
                menu: {
                    edit: {
                        title: 'Edit',
                        items: 'undo redo | cut copy paste pastetext | selectall'
                    },
                    insert: {
                        title: 'Insert',
                        items: 'link image | anchor hr charmap insertdatetime'
                    },
                    view: {
                        title: 'View',
                        items: 'visualaid preview '
                    },
                    format: {
                        title: 'Format',
                        items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'
                    },
                    table: {
                        title: 'Table',
                        items: 'inserttable tableprops deletetable | cell row column'
                    },
                    tools: {
                        title: 'Tools',
                        items: 'spellchecker code'
                    }
                },
                default_link_target: '_blank',
                file_browser_callback: function (fieldName, url, type, win) {
                    self.openDocInsertWindow(tinyMCE, fieldName, type);
                },
                toolbar1: 'undo redo | styleselect | bold italic |' +
                ' alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                toolbar2: 'preview | forecolor backcolor | code | example | ltr rtl',
                content_css: stylesheetref[0].getAttribute('href'),
                extended_valid_elements: 'button[*],a[*],p[*],ul[*],input[*],li[*],' +
                'nav[*],script[language|type|src|defer],select[*]',
                forced_root_block: 'p'
            };

            this.init = function(documents) {
                self.documents = documents.map(function(document) {
                    ((document.Type && document.Type.indexOf('image') !== -1) ||  self.supportedFormats.includes(document.Type)) &&
                        (function() {
                            if (document.IsPublic){
                                self.imageDocs.push('\<span id=' + document.Id +
                                                    '\&\&docName=' + document.DeveloperName +
                                                    '\&\&oid=' + window.oid +
                                                    '> ' +document.Name +'\</span>');
                            }
                        }());

                    return '\<span id=' + document.Id + '\&\&docName=' +
                        document.DeveloperName + '> ' +  document.Name +'\</span>' ;
                });
            };

            remoteActions.getAllDocuments().then(function(documents) {
                self.init(documents);
            });

            remoteActions.getLanguageCodeMap().then(function(langCodeMap){
                var langMap = [];

                angular.forEach(langCodeMap, function(key, value){
                    langMap.push({text: value, value: key });
                });

                window.tinymce.getLanguageCodeMap = function(){
                    return langMap;
                };
            });

            window.tinyMCE.remoteCall = function(searchKey, status, langCode) {
                searchKey = searchKey || '';
                status = status || '' ;
                langCode = langCode || '';
                return remoteActions.getKnowledgeArticles(searchKey, status, langCode);
            };

            this.openDocInsertWindow = function(tinyMCE,field_name, type) {
                var input = {};
                input.fieldName = field_name || '';
                input.imageInsert = (type === 'image') ? true : false;

                input.callback = function(bstring, name, type) {
                    return remoteActions.uploadDocument(btoa(bstring),name, type); //this returns a promise
                };

                input.getTest = function(){
                    return self.names;
                };

                input.getDocs = function() {
                    if (type === 'image') {
                        return self.imageDocs;
                    }else {
                        return self.documents;
                    }
                };

                tinyMCE.activeEditor.editorCommands.execCommand('openDocInsertWindow', function() {
                    return input;
                });
            };

        }]);

}());

},{}],131:[function(require,module,exports){
var templateMgr = require('../../oui/util/vlcUiTempMgr.js');

(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .service('vlocityUiTemplateService', VlocityUiTemplateService);

    VlocityUiTemplateService.$inject = ['remoteActions', '$q'];
    function VlocityUiTemplateService(remoteActions, $q) {
        var templates;
        function loadTemplates() {
            return remoteActions.loadVlocityUITemplates().then(function(uiTemplates) {
                templates = uiTemplates.map(function(uiTemplate) {
                    return {
                        Id: uiTemplate.Id,
                        Name: uiTemplate.Name,
                        Type__c: uiTemplate[ns + 'Type__c']
                    };
                });
                return templates = _.sortBy(templates, [function(o) { return o.Name.toLowerCase() }]);
            });
        }
        this.getGeneralTemplates = function getGeneralTemplates() {
            if (!templates) {
                return loadTemplates()
                    .then(function() {
                        return getGeneralTemplates();
                    });
            }
            return $q.resolve(templateMgr.getGenTemplates(templates));
        };
    }
})();

},{"../../oui/util/vlcUiTempMgr.js":141}],132:[function(require,module,exports){

},{}],133:[function(require,module,exports){
angular.module("oui", ["vlocity"]);

require('./factory/Save.js');

},{"./factory/Save.js":134}],134:[function(require,module,exports){
/* global History, ns */
var ScriptElement = require('../util/ScriptElement.js');
var unescapeHTML = require('../util/HtmlEncodeDecode.js').unescapeHTML;

angular.module('oui')
    .factory('save', function ($q, remoteActions, $rootScope, $timeout, $localizable, isIntegrationProcedure, $sldsToast) {
        'use strict';
        var promisesInProgress = {};

        function saveVisitor(element) {
            var isScriptElement = (element === $rootScope.scriptElement);
            var isNewElement = !element.Id;
            var elementId = element.Id ? element.Id : (isNewElement && isScriptElement ? 'scriptElement' : element.Name);

            var promise = doSave(element);
            if (promise && elementId) {
                var chain = promisesInProgress[elementId];
                if (!chain) {
                    promisesInProgress[elementId] = [];
                }
                promisesInProgress[elementId].push(promise);
            }
            return promise;
        }

        function getNameOrNull(property) {
            return property ? unescapeHTML(property.Name) : null;
        }

        function compare(str1, str2) {
            return str1 && str2 &&
                String(str1).toUpperCase() === String(str2).toUpperCase();
        }

        function doSave(element) {
            var isScriptElement = (element === $rootScope.scriptElement);
            var isNewElement = !element.Id;
            var elementId = element.Id;
            var flag = false;

            if ($rootScope.scriptElement.IsActive__c || element.deleted || element.deleting) {
                return $q.when(element);
            }

            if ($rootScope.scriptElement.activating) {
                return;
            }

            if (element.saving) {
                if (isNewElement) {
                    if (isScriptElement) {
                        elementId = 'scriptElement';
                    } else {
                        elementId = element.Name;
                    }
                }
                // queue this save
                var currentChain = promisesInProgress[elementId];
                if (currentChain) {
                    return currentChain[currentChain.length - 1].then(function () {
                        var previousJson = element.originalJson,
                            json = element.asJson();
                        var isEqualToOldJson = angular.equals(json, previousJson);
                        if (!isEqualToOldJson) {
                            saveVisitor(element);
                        }
                    });
                } else {
                    promisesInProgress[elementId] = [];
                }
            } else if (elementId) {
                promisesInProgress[elementId] = [];
            }
            var previousJson = element.originalJson,
                json = element.asJson();
            var isEqualToOldJson = angular.equals(json, previousJson);

            //check name and type/subtype before checking if there is a difference
            //reason : enforcing character validation
            if (!element.Name || element.Name === '') {
                element.setErrors([{
                    message: $localizable('OmniDesMustSetName', 'You must set a name')
                }]);
                return $q.when(element);
            } else if (isEqualToOldJson && !isNewElement && !element.errors) {
                return $q.when(element);
            } else if (element.type() === 'DocuSign Envelope Action') {
                var list = element.PropertySet__c.docuSignTemplatesGroup;
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        var signerList = list[i].signerList;
                        for (var j = 0; j < signerList.length; j++) {
                            flag = ((signerList[j].signerName === undefined || signerList[j].signerName === '') ||
                                (signerList[j].signerEmail === undefined || signerList[j].signerEmail === '') ||
                                (signerList[j].templateRole === undefined || signerList[j].templateRole === ''));
                            if (flag) {
                                break;
                            }
                        }
                        if (flag) {
                            break;
                        }
                    }
                    if (flag) {
                        element.setErrors([{
                            message: $localizable('OmniDesDocuRecipientErr', 'Please complete recipient information')
                        }]);
                        return $q.when(element);
                    }
                }
            } else if (element.type() === 'DocuSign Signature Action') {
                var listSig = element.PropertySet__c.docuSignTemplatesGroupSig;
                if (listSig) {
                    for (var k = 0; k < listSig.length; k++) {
                        flag = ((listSig[k].docuSignTemplate === undefined || listSig[k].docuSignTemplate === '') ||
                            (listSig[k].templateRole === undefined || listSig[k].templateRole === ''));
                        if (flag) {
                            break;
                        }
                    }
                    if (flag) {
                        element.setErrors([{
                            message: $localizable('OmniDesDocuTemplateErr', 'Please complete template information')
                        }]);
                        return $q.when(element);
                    }
                }
            } else if (element.type() === 'Edit Block') {
                var listsObMap = element.PropertySet__c.sobjectMapping;
                if (listsObMap) {
                    for (var l = 0; l < listsObMap.length; l++) {
                        flag = ((listsObMap[l].osElement === undefined || listsObMap[l].osElement === '') ||
                            (listsObMap[l].sObjectField === undefined || listsObMap[l].sObjectField === ''));
                        if (flag) {
                            break;
                        }
                    }
                    if (flag) {
                        element.setErrors([{
                            message: $localizable('OmniEditBlockMappingErr', 'Please complete sObject Maping')
                        }]);
                        return $q.when(element);
                    }
                }
            }
            // we haven't full initialized the propertyset from the server if we only have 3 keys (show, label and disOnTplt)
            if (Object.keys(element.PropertySet__c).length < 4 && !isScriptElement) {
                return $q.when(element);
            }
            if (element.originalJson && (element.originalJson[ns + 'Version__c'] === json[ns + 'Version__c'])) {
                delete json[ns + 'Version__c'];
            }
            element.originalJson = json;
            element.setSaving();
            var saveFn = (element instanceof ScriptElement) ? remoteActions.saveOmniScript : remoteActions.saveElement;
            $rootScope.$broadcast('save', element);
            return saveFn.call(remoteActions, json)
                .then(function (result) {
                    var promises = [];
                    element.saving = false;
                    if (result.success) {
                        $rootScope.$broadcast('saved', element);
                        if (isNewElement) {
                            element.setId(result.id);
                            // if update the Id and have children then we need to save them all too
                            if (element.children.length > 0) {
                                for (var i = 0; i < element.children.length; i++) {
                                    promises.push(saveVisitor(element.children[i]));
                                }
                            }
                            if (isScriptElement && isNewElement) {
                                $timeout(function () {
                                    var location = window.location;
                                    var pageName = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
                                    var newUrl = '/apex/' + ns + pageName +
                                        (location.search.length === 0 ? '?' : location.search + '&') +
                                        'id=' + result.id;
                                    if (window.top !== window) {
                                        if (window.sforce && window.sforce.console && window.sforce.console.isInConsole()) {
                                            sforce.console.getEnclosingPrimaryTabId(function (parentTabResponse) {
                                                sforce.console.getEnclosingTabId(function (response) {
                                                    if (response.id === parentTabResponse.id) {
                                                        sforce.console.openPrimaryTab(null, newUrl, true);
                                                    } else {
                                                        sforce.console.openSubtab(parentTabResponse.id, newUrl, true);
                                                    }
                                                    sforce.console.closeTab(response.id);
                                                });
                                            });
                                        } else if (window.sforce && window.sforce.one && window.sforce.one.navigateToURL) {
                                            window.sforce.one.navigateToURL(newUrl);
                                        } else {
                                            History.pushState('', '', newUrl);
                                        }
                                    } else {
                                        History.pushState('', '', newUrl);
                                    }
                                });
                            }
                        }
                        if (isScriptElement) {
                            var titleEl = document.querySelector('title');
                            if (titleEl) {
                                titleEl.innerText = (isIntegrationProcedure ? 'IP: ' : 'OmniScript: ') +
                                    $rootScope.scriptElement.Name;
                            }
                            // also need to update the language in case it was default to the users language
                            promises.push(remoteActions.getOmniScript($rootScope.scriptElement.Id)
                                .then(function (omniScriptResult) {
                                    var scriptElement = $rootScope.scriptElement;
                                    if (omniScriptResult[ns + 'Language__c'] &&
                                        !/&/.test(omniScriptResult[ns + 'Language__c'])) {
                                        scriptElement.Language__c = omniScriptResult[ns + 'Language__c'];
                                    }
                                    if (omniScriptResult[ns + 'Type__c'] &&
                                        compare(omniScriptResult[ns + 'Type__c'], scriptElement.Type__c)) {
                                        scriptElement.Type__c = omniScriptResult[ns + 'Type__c'];           // Replace due OWC-337
                                    }
                                    if (omniScriptResult[ns + 'SubType__c'] &&
                                        compare(omniScriptResult[ns + 'SubType__c'], scriptElement.SubType__c)) {
                                        scriptElement.SubType__c = omniScriptResult[ns + 'SubType__c'];           // Replace due OWC-337
                                    }
                                    scriptElement.Version__c = omniScriptResult[ns + 'Version__c'];
                                    scriptElement.LastModifiedDate = omniScriptResult.LastModifiedDate;
                                    scriptElement.LastModifiedById = omniScriptResult.LastModifiedById;
                                    scriptElement.LastModifiedBy = getNameOrNull(omniScriptResult.LastModifiedBy);
                                    if (isNewElement) {
                                        // also update the Version, Owner & Created fields
                                        scriptElement.CreatedById = omniScriptResult.CreatedById;
                                        scriptElement.CreatedDate = omniScriptResult.CreatedDate;
                                        scriptElement.CreatedBy = getNameOrNull(omniScriptResult.CreatedBy);
                                        scriptElement.Owner = getNameOrNull(omniScriptResult.Owner);
                                    }
                                }));
                        }
                    } else {
                        element.setErrors(result.errors);
                    }
                    if (promises) {
                        return $q.all(promises).then(function () {
                            return element;
                        });
                    }
                    return element;
                }).catch(function (err) {
                    $sldsToast({
                        title: 'Failed to save',
                        content: err && err.message ? err.message : JSON.stringify(err),
                        severity: 'error',
                        autohide: false
                    });
                });
        }

        return saveVisitor;
    });

},{"../util/HtmlEncodeDecode.js":136,"../util/ScriptElement.js":138}],135:[function(require,module,exports){
/* globals ns */
'use strict';
var idFunction = require('../util/generateId.js');
var unescapeHTML = require('../util/HtmlEncodeDecode.js').unescapeHTML;
var PaletteElement = require('../util/PaletteElement.js');
var ScriptElement = require('../util/ScriptElement.js');
var requiredProperties = require('../util/requiredProperties.js');
var nameSpacePropsRegex = /^(Active__c|Level__c|OmniScriptId__c|OmniScriptVersion__c|Order__c|ParentElementId__c|ReusableOmniScript__c|SearchKey__c|Type__c|InternalNotes__c)$/i;

/*
 * Represents an element in the middle canvas
 * which may have one or more children
 */
function CanvasElement(paletteElement) {
    if (!paletteElement) {
        throw 'You must set a PaletteElement';
    }
    this.Type__c = paletteElement;
    this.ParentElementId__c = null;
    if (paletteElement.scriptElement) {
        this.PropertySet__c = {
            'Type': paletteElement.scriptElement.Type__c,
            'Sub Type': paletteElement.scriptElement.SubType__c,
            'Language': paletteElement.scriptElement.Language__c
        };
    } else {
        this.PropertySet__c = {};
    }
    this.PropertySet__c.show = {
        group: {
            operator: 'AND',
            rules: []
        }
    };
    this.OmniScriptId__c = null;
    this.SearchKey__c = null;
    this.Order__c = null;
    this.Active__c = true;
    this.Name = idFunction(this.Type__c.prettyName(true));
    this.Id = null;
    this.InternalNotes__c = null;
    this.children = [];
    var me = this;
    this.children.splice = function () {
        if (arguments.length === 3) {
            arguments[2].ParentElementId__c = me.Id;
            arguments[2].OmniScriptId__c = me.OmniScriptId__c;
        }
        var result = Array.prototype.splice.apply(this, arguments);
        // update Order__c
        for (var i = 0; i < this.length; i++) {
            this[i].Order__c = i + 1;
        }
        return result;
    };
}

CanvasElement.prototype.type = function () {
    return this.Type__c.label;
};

CanvasElement.fromJson = function (json) {
    var propSet = JSON.parse(json[ns + 'PropertySet__c']);
    if (propSet == null) {
        propSet = {};
    }
    var paletteElement = PaletteElement.getPaletteElement(json[ns + 'Type__c'], propSet);
    if (!paletteElement) {
        console.log('Warning: Couldn\'t find existing palatte element for ' + json[ns + 'Type__c']);
        paletteElement = PaletteElement.factory(angular.extend({
            Name: json[ns + 'Type__c']
        }, propSet));
    }
    var canvasElement = new CanvasElement(paletteElement);
    canvasElement.Id = json.Id;
    canvasElement.Name = unescapeHTML(json.Name);
    idFunction.registerExistingPrefix(json.Name);
    canvasElement.ParentElementId__c = json[ns + 'ParentElementId__c'];
    canvasElement.PropertySet__c = propSet;
    canvasElement.OmniScriptId__c = json[ns + 'OmniScriptId__c'];
    canvasElement.SearchKey__c = json[ns + 'SearchKey__c'];
    canvasElement.Order__c = json[ns + 'Order__c'];
    canvasElement.Level__c = json[ns + 'Level__c'];
    canvasElement.Active__c = json[ns + 'Active__c'];
    canvasElement.InternalNotes__c = json[ns + 'InternalNotes__c'] ? unescapeHTML(json[ns + 'InternalNotes__c']) : null;
    if (!canvasElement.PropertySet__c.show) {
        canvasElement.PropertySet__c.show = {
            group: {
                operator: 'AND',
                rules: []
            }
        };
    }
    if (propSet.hasOwnProperty('showPersistentComponent')) {
        propSet.showPersistentComponent = CanvasElement.convertShowPersistentComponentToMap(canvasElement, propSet);
    }
    allElementsById[json.Id] = canvasElement;
    canvasElement.originalJson = json;
    return canvasElement;
};

CanvasElement.convertShowPersistentComponentToMap = function (canvasElement, propSet) {
    // convert from array of true/false into map of persistentComponentId to bool
    var scriptElement = canvasElement.scriptElement();
    if (!scriptElement) {
        return [];
    }
    var newShowPersistentComponent = {};
    if (angular.isArray(scriptElement.PropertySet__c.persistentComponent)) {
        if (!angular.isArray(propSet.showPersistentComponent)) {
            propSet.showPersistentComponent = [propSet.showPersistentComponent];
        }
        scriptElement.PropertySet__c.persistentComponent.forEach(function (persistentComponent, index) {
            newShowPersistentComponent[persistentComponent.id] = propSet.showPersistentComponent.length > index ? propSet.showPersistentComponent[index] || false : false;
        });
    }
    return newShowPersistentComponent;
};

CanvasElement.prototype.allowsChild = function (childPaletteElement) {
    var childLabel = childPaletteElement.label,
        isAllowedAsChild = false;
    switch (this.type()) {
        case 'OmniScript':
            isAllowedAsChild = /^(OmniScript|Step)$/.test(childLabel);
            break;
        case 'Step':
            isAllowedAsChild = !childPaletteElement.isNavigation();
            break;
        case 'Block':
            isAllowedAsChild = !childPaletteElement.isNavigation() && !childPaletteElement.isGroupedControl();
            break;
        default:
            break;
    }
    return isAllowedAsChild;
};

CanvasElement.prototype.allowedTypes = function () {
    return this.Type__c.allowedTypes();
};

CanvasElement.prototype.allowsChildren = function () {
    return this.allowedTypes().length > 0;
};

CanvasElement.prototype.isBlock = function () {
    return /^Block$/.test(this.type());
};

CanvasElement.prototype.isStep = function () {
    return /Cache Block|Try Catch Block|Loop Block|Conditional Block/.test(this.type()) || /^Step/.test(this.type());
};

CanvasElement.prototype.isAction = function () {
    return /Action$/.test(this.type());
};

CanvasElement.prototype.isInput = function () {
    return this.Type__c.isInput();
};

CanvasElement.prototype.parent = function () {
    if (this.ParentElementId__c) {
        return CanvasElement.getById(this.ParentElementId__c);
    } else if (this.OmniScriptId__c) {
        return ScriptElement.getById(this.OmniScriptId__c);
    }
};

CanvasElement.prototype.scriptElement = function () {
    if (this.OmniScriptId__c) {
        return ScriptElement.getById(this.OmniScriptId__c);
    }
};

CanvasElement.prototype.delete = function () {
    this.deleted = true;
    var parent = this.parent();
    if (parent) {
        var existingIndex = parent.children.indexOf(this);
        parent.children.splice(existingIndex, 1);
        if (this.ParentElementId__c) {
            this.ParentElementId__c = null;
        } else if (this.OmniScriptId__c) {
            this.OmniScriptId__c = null;
        }
    }
};

CanvasElement.prototype.clone = function () {
    var newElement = new CanvasElement(this.Type__c);
    for (var i = 0; i < this.children.length; i++) {
        var childClone = this.children[i].clone();
        newElement.children.push(childClone);
    }
    for (var property in this) {
        if (this.hasOwnProperty(property) &&
            !angular.isObject(this[property]) &&
            !angular.isFunction(this[property]) &&
            !/^(\$\$hashKey|Id|Name)$/gi.test(property)) {
            newElement[property] = this[property];
        } else if (/^PropertySet__c$/.test(property)) {
            newElement[property] = angular.copy(this[property]);
        }
    }
    return newElement;
};

CanvasElement.prototype.setId = function (id) {
    this.Id = id;
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].ParentElementId__c = id;
    }
    allElementsById[id] = this;
};

CanvasElement.prototype.asJson = function () {
    var json = {
        Name: this.Name,
        Id: this.Id
    };
    for (var property in this) {
        if (this.hasOwnProperty(property)) {
            if (nameSpacePropsRegex.test(property) && (this[property] != null ||
                    // if null and the property didn't exist in originalJson
                    (this.originalJson && this[property] == null && this.originalJson[ns + property] != null))) {
                json[ns + property] = this[property];
            }
        }
    }
    var propSet = angular.copy(this.PropertySet__c);
    if (propSet.show) {
        propSet.show = resetExpressionIfEmpty(propSet.show);
    }
    if (propSet.validateExpression) {
        propSet.validateExpression = resetExpressionIfEmpty(propSet.validateExpression);
    }
    // OMNI-271 - only set label to name if this is the first time the Element
    //            is being saved
    if (this.Type__c.type !== 'OmniScript' && this.scriptElement().Language__c !== 'Multi-Language') {
        if (!propSet.label && !this.Id) {
            propSet.label = this.PropertySet__c.label = this.Name;
        } else if (propSet.label === '') {
            propSet.label = null;
        }
    }
    if (propSet.hasOwnProperty('showPersistentComponent')) {
        // turn this into an array based on order of persistentComponents in ScriptElement
        var scriptElement = this.scriptElement();
        if (scriptElement) {
            var arrayOfShowPersistentComponent = [];
            if (scriptElement.PropertySet__c.persistentComponent) {
                scriptElement.PropertySet__c.persistentComponent.forEach(function (persistentComponent, index) {
                    arrayOfShowPersistentComponent[index] = propSet.showPersistentComponent[persistentComponent.id];
                });
            }
            propSet.showPersistentComponent = arrayOfShowPersistentComponent;
        }
    }

    if (this.originalJson && this.originalJson[ns + 'PropertySet__c']) {
        propSet = cleanUnnecessaryEmptyPropsOnPropertySet(propSet,
            JSON.parse(this.originalJson[ns + 'PropertySet__c']),
            requiredProperties[this.type()]);
    }
    json[ns + 'PropertySet__c'] = JSON.stringify(propSet);
    if (this.Type__c.type === 'OmniScript') {
        json[ns + 'Type__c'] = 'OmniScript';
    } else {
        json[ns + 'Type__c'] = json[ns + 'Type__c'].label;
    }
    return json;
};

function cleanUnnecessaryEmptyPropsOnPropertySet(propSet, originalPropSet, skipProperties) {
    Object.keys(propSet).forEach(function (key) {
        if (skipProperties && skipProperties.indexOf(key) !== -1) {
            return;
        }
        if (propSet[key] === '' || propSet[key] == null) {
            if (originalPropSet[key] === undefined) {
                delete propSet[key];
            }
        }
    });
    return propSet;
}

function resetExpressionIfEmpty(object) {
    if (object && object.group && object.group.rules && object.group.rules.length === 0) {
        return null;
    }
    return object;
}

CanvasElement.prototype.setSaving = function () {
    if (this.OmniScriptId__c) {
        this.errors = null;
        this.saving = true;
    }
};

CanvasElement.prototype.setOmniScriptId = function (omniScriptId) {
    this.OmniScriptId__c = omniScriptId;
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].setOmniScriptId(omniScriptId);
    }
};

CanvasElement.prototype.toString = function () {
    return 'Element: ' + this.Name;
};

CanvasElement.prototype.setErrors = function (errors) {
    this.errors = errors;
};

CanvasElement.prototype.hasErrors = function (errors) {
    return this.errors && this.errors.length > 0;
};

CanvasElement.prototype.each = function (expFunction) {
    expFunction(this);
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].each(expFunction);
    }
};

var allElementsById = {};

CanvasElement.getById = function (id) {
    return allElementsById[id];
};

module.exports = CanvasElement;

},{"../util/HtmlEncodeDecode.js":136,"../util/PaletteElement.js":137,"../util/ScriptElement.js":138,"../util/generateId.js":139,"../util/requiredProperties.js":140}],136:[function(require,module,exports){
var escape = document.createElement('textarea');
function escapeHTML(html) {
    escape.innerHTML = html;
    return escape.innerHTML;
}

function unescapeHTML(html) {
    escape.innerHTML = html;
    return escape.value;
}

exports.escapeHTML = escapeHTML;
exports.unescapeHTML = unescapeHTML;

},{}],137:[function(require,module,exports){
var ScriptElement = require('../util/ScriptElement.js');

/*
 * Represents an Element in the palatte
 * of drag/droppable canvas elements
 */
function PaletteElement(label, type, scriptElement) {
    'use strict';
    this.label = label;
    this.type = type;
    this.scriptElement = scriptElement;

    if (elementsSupportedInLwc.includes(label) === true || type === 'OmniScript') {
        this.lwcEnabled = true;
    }
}

const elementsSupportedInLwc = ["DataRaptor Extract Action", "DataRaptor Turbo Action", "DataRaptor Transform Action", "DataRaptor Post Action",
    "Integration Procedure Action", "Navigate Action", "Remote Action", "Rest Action", "Set Values", "Set Errors", "Text Block", "Formula",
    "Radio Group", "Step", "Checkbox", "Currency", "Custom Lightning Web Component", "Date", "Date/Time (Local)", "Email", "Lookup", "Multi-select",
    "Number", "OmniScript", "Radio", "Range", "Select", "Telephone", "Text", "Text Area", "Time", "URL", "DocuSign Envelope Action",
    "DocuSign Signature Action", "Email Action", "Validation", "Block", "Edit Block", "Type Ahead Block", "File", "Image", "Password",
    "Action Block", "Disclosure", "Calculation Action", "Aggregate", "Matrix Action", "Delete Action", "Line Break"
];

PaletteElement.prototype.prettyName = function (isDropped) {
    'use strict';
    if (/Rest/i.test(this.label)) {
        if (/^rest action$/i.test(this.label))
            return this.label.replace(/\brest\b/i, 'HTTP');
        else
            return this.label.replace(/\brest\b/i, 'REST');
    } else if (/^Validation$/.test(this.label)) {
        return 'Messaging';
    } else if (/^Custom Lightning Web Component$/.test(this.label)) {
        return 'Custom LWC';
    } else if (isDropped && /^Type Ahead Block$/.test(this.label)) {
        return this.label.substring(0, this.label.lastIndexOf('Block')-1);
    //OMNI-2769
    } else if (/^Date\/Time \(Local\)$/.test(this.label)) {
        return "Date\/Time";
    } else if (/List Merge Action/.test(this.label)) {
        return "List Action";
    } else {
        return this.label;
    }
};

PaletteElement.prototype.isNavigation = function() {
    'use strict';
    return this.type == 'navigation';
};

PaletteElement.prototype.isScript = function() {
    'use strict';
    return this.type == 'OmniScript';
};

PaletteElement.prototype.isGroupedControl = function() {
    'use strict';
    return this.type == 'groupedControl';
};

PaletteElement.prototype.isInput = function() {
    'use strict';
    return (this.type == 'input' || this.type == 'typeahead-excluded-input' || this.type == 'editblock-excluded-input');
};

PaletteElement.prototype.isAction = function() {
    'use strict';
    return (this.type == 'action' || this.type == 'typeahead-action' || this.type == 'common-action' || this.type == 'editblock-action');
};

PaletteElement.prototype.toString = function() {
    'use strict';
    return 'Palette: ' + this.label;
};

PaletteElement.prototype.allowedTypes = function() {
    'use strict';
    if (this.label === 'OmniScript' || /^Input Block$/i.test(this.label) || /^Radio Group$/i.test(this.label)) {
        return [];
    }

    if (this.label === 'Conditional Block' || this.label === 'Loop Block' || this.label === 'Cache Block' || this.label === 'Try Catch Block') {
        return ['navigation','action', 'typeahead-action', 'common-action', 'editblock-action', 'input', 'typeahead-excluded-input', 'editblock-excluded-input', 'groupedControl', 'selectable-items', 'inputblock', 'filterblock', 'docuSign-signature-action', 'typeahead-block','edit-block', 'radiogroup'];
    } else if (this.label === 'Step') {
        return ['action', 'typeahead-action', 'common-action', 'editblock-action', 'input', 'typeahead-excluded-input', 'editblock-excluded-input', 'groupedControl', 'selectable-items', 'inputblock', 'filterblock', 'docuSign-signature-action', 'typeahead-block','edit-block', 'radiogroup', 'action-block'];
    } else if (this.isNavigation()) {
        return ['action', 'typeahead-action', 'common-action', 'editblock-action', 'input', 'typeahead-excluded-input', 'editblock-excluded-input', 'groupedControl', 'filterblock','edit-block', 'radiogroup'];
    } else if (this.isGroupedControl()) {
        return ['action', 'typeahead-action', 'common-action', 'editblock-action', 'input', 'typeahead-excluded-input', 'editblock-excluded-input', 'selectable-items', 'groupedControl', 'docuSign-signature-action', 'typeahead-block', 'radiogroup'];
    } else if (this.type == 'filterblock') {
        return ['filter'];
    } else if (this.type == 'typeahead-block') {
        return ['typeahead-action', 'common-action', 'input'];
    } else if(this.type == 'edit-block') {
        return ['editblock-action', 'common-action', 'input', 'typeahead-excluded-input', 'groupedControl', 'typeahead-block', 'radiogroup'];
    } else if (this.type === 'action-block') {
        return ['action', 'common-action', 'typeahead-action', 'editblock-action'];
    } else {
        return [];
    }
};

PaletteElement.factory = function(label) {
    'use strict';
    var paletteElement = null;
    if (angular.isString(label)) {
        if (/^(Step|OmniScript|Conditional Block|Loop Block|Cache Block|Try Catch Block)$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'navigation');
        } else if (/^OmniForm$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'action');
        } else if (/^Block$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'groupedControl');
        } else if (/^DocuSign Signature Action/i.test(label)) {
            paletteElement = new PaletteElement(label, 'docuSign-signature-action');
        } else if (/(Action$|^Set)/i.test(label)) {
            if (/^DataRaptor Extract Action$/i.test(label) || /^Calculation Action$/i.test(label) || /^DataRaptor Turbo Action$/i.test(label)) {
                paletteElement = new PaletteElement(label, 'typeahead-action');
            } else if(/^Matrix Action$/i.test(label) || /^Delete Action$/i.test(label)) {
                paletteElement = new PaletteElement(label, 'editblock-action');
            } else if(/^Remote Action$/i.test(label) || /^Rest Action$/i.test(label) || /^Integration Procedure Action$/i.test(label)) {
                paletteElement = new PaletteElement(label, 'common-action');
            } else {
                paletteElement = new PaletteElement(label, 'action');
            }
        } else if (/^Filter Block$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'filterblock');
        } else if (/^Filter$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'filter');
        } else if (/^Input Block$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'inputblock');
        } else if (/^Radio Group$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'radiogroup');
        } else if (/^Selectable Items/i.test(label)) {
            paletteElement = new PaletteElement(label, 'selectable-items');
        } else if (/^Type Ahead Block$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'typeahead-block');
        } else if (/^Edit Block$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'edit-block');
        } else if (/^Action Block$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'action-block')
        } else {
            if(editBlockExcludedElements[label]) {
                paletteElement = new PaletteElement(label, 'editblock-excluded-input');
            } else if (!typeaheadExcludedElements[label]) {
                paletteElement = new PaletteElement(label, 'input');
            } else {
                paletteElement = new PaletteElement(label, 'typeahead-excluded-input');
            }
        }
        allElements[label] = paletteElement;
    } else if (label instanceof ScriptElement) {
        var scriptElement = label;
        paletteElement = new PaletteElement(scriptElement.Name, 'OmniScript', scriptElement);
    } else if (angular.isObject(label)) {
        var json = label;
        paletteElement = new PaletteElement(unescapeHTML(json.Name), 'OmniScript',{
            Type__c:     json[ns + 'Type__c'] ? unescapeHTML(json[ns + 'Type__c']) : null,
            SubType__c:  json[ns + 'SubType__c'] ? unescapeHTML(json[ns + 'SubType__c']) : null,
            Language__c: json[ns + 'Language__c'] ? unescapeHTML(json[ns + 'Language__c']) : null
        });
    }
    return paletteElement;
};

PaletteElement.getPaletteElement = function(label, configuration, scriptEle) {
    'use strict';
    if (label === 'OmniForm' || (
        !configuration.hasOwnProperty('Type') &&
        !configuration.hasOwnProperty('Sub Type') &&
        !configuration.hasOwnProperty('Language'))) {
        if (allElements[label]) {
            return allElements[label];
        } else {
            return new PaletteElement(label, configuration);
        }
    } else {
        // need to look up for a re-usable script with the matching
        // Type__c, SubType__c and Language__c
        try {
            return allElements.scripts[configuration.Type][configuration['Sub Type']][configuration.Language];
        } catch (e) {
            return new PaletteElement(label, "OmniScript", scriptEle);
        }
    }
};

var allElements = {
    'scripts': {}
};

var typeaheadExcludedElements = {
    'Disclosure':'Disclosure',
    'File':'File',
    'Filter':'Filter',
    'Image':'Image',
    'Lookup':'Lookup',
    'Password':'Password',
    'Signature':'Signature',
    'Headline':'Headline',
    'Text Block':'Text Block',
    'Geolocation':'Geolocation',
    'Validation':'Validation'
};

var editBlockExcludedElements = {
    'Submit':'Submit',
    'Geolocation':'Geolocation'
}

module.exports = PaletteElement;

},{"../util/ScriptElement.js":138}],138:[function(require,module,exports){
/* globals ns */
'use strict';
var unescapeHTML = require('../util/HtmlEncodeDecode.js').unescapeHTML;
var nameSpacePropsRegex = /(IsActive__c|AdditionalInformation__c|DataRaptorBundleId__c|DataRaptorBundleName__c|IsReusable__c|IsProcedure__c|JSON_Output__c|Language__c|SubType__c|Type__c|Version__c|TestHTMLTemplates__c|CustomJavaScript__c|LastPreviewPage__c|IsLwcEnabled__c|ProcedureResponseCacheType__c|DisableMetadataCache__c|RequiredPermission__c)$/i;
var allScriptsById = {};

/*
 * ScriptElement represents the OmniScript root object all
 * forms are designed for
 */
function ScriptElement(json) {
    this.Id = json.Id;
    if (this.Id) {
        // OMNI-559 - do not clobber the existing instance
        //            instead return it
        if (allScriptsById[this.Id]) {
            return allScriptsById[this.Id];
        }
        allScriptsById[this.Id] = this;
    }
    this.Type__c = json[ns + 'Type__c'] ? unescapeHTML(json[ns + 'Type__c']) : null;
    this.SubType__c = json[ns + 'SubType__c'] ? unescapeHTML(json[ns + 'SubType__c']) : null;
    if (json[ns + 'PropertySet__c']) {
        this.PropertySet__c = JSON.parse(unescapeHTML(json[ns + 'PropertySet__c']));
    } else {
        this.PropertySet__c = {};
    }
    this.TestHTMLTemplates__c = json[ns + 'TestHTMLTemplates__c'] ?
        unescapeHTML(json[ns + 'TestHTMLTemplates__c']) : '';
    this.CustomJavaScript__c = json[ns + 'CustomJavaScript__c'] ?
        unescapeHTML(json[ns + 'CustomJavaScript__c']) : '';
    this.IsActive__c = json[ns + 'IsActive__c'];
    this.IsReusable__c = !!json[ns + 'IsReusable__c'];
    this.Version__c = json[ns + 'Version__c'];
    this.Language__c = json[ns + 'Language__c'] ? unescapeHTML(json[ns + 'Language__c']) : null;
    this.DataRaptorBundleId__c = json[ns + 'DataRaptorBundleId__c'] ? json[ns + 'DataRaptorBundleId__c'] : null;
    this.Version__c = json[ns + 'Version__c'];
    this.LastPreviewPage__c = json[ns + 'LastPreviewPage__c'] ? unescapeHTML(json[ns + 'LastPreviewPage__c']) : null;
    this.IsProcedure__c = !!json[ns + 'IsProcedure__c'];
    this.IsLwcEnabled__c = !!json[ns + 'IsLwcEnabled__c'];
    this.CanvasType = this.IsProcedure__c ? 'Procedure Configuration' : 'Script Configuration';
    this.Name = unescapeHTML(json.Name);
    this.OwnerId = json.OwnerId;
    this.Owner = json.Owner ? unescapeHTML(json.Owner.Name) : null;
    this.CreatedById = json.CreatedById;
    this.CreatedBy = json.CreatedBy ? unescapeHTML(json.CreatedBy.Name) : null;
    this.CreatedDate = json.CreatedDate;
    this.LastModifiedDate = json.LastModifiedDate;
    this.LastModifiedById = json.LastModifiedById;
    this.LastModifiedBy = json.LastModifiedBy ? unescapeHTML(json.LastModifiedBy.Name) : null;
    this.children = [];
    this.AdditionalInformation__c = json[ns + 'AdditionalInformation__c'] ?
        unescapeHTML(json[ns + 'AdditionalInformation__c']) : null;
    this.ProcedureResponseCacheType__c = json[ns + 'ProcedureResponseCacheType__c'] ? json[ns + 'ProcedureResponseCacheType__c'] : '';
    this.DisableMetadataCache__c = !!json[ns + 'DisableMetadataCache__c'];
    this.RequiredPermission__c = json[ns + 'RequiredPermission__c'] ? json[ns + 'RequiredPermission__c'] : '';
    // fix up persistentComponent to be an array
    if (this.PropertySet__c.persistentComponent && !angular.isArray(this.PropertySet__c.persistentComponent)) {
        this.PropertySet__c.persistentComponent = [this.PropertySet__c.persistentComponent];
    }
    var me = this;
    this.children.splice = function () {
        if (arguments.length === 3) {
            arguments[2].OmniScriptId__c = me.Id;
        }
        var result = Array.prototype.splice.apply(this, arguments);
        // update Order__c
        for (var i = 0; i < this.length; i++) {
            this[i].Order__c = i + 1;
        }
        return result;
    };
    this.originalJson = this.asJson();
}

ScriptElement.prototype.isAction = function () {
    return false;
};

ScriptElement.prototype.allowedTypes = function () {
    return ['navigation', 'action', 'typeahead-action', 'editblock-action', 'common-action', 'OmniScript', 'action-block'];
};

ScriptElement.prototype.type = function () {
    return this.CanvasType;
};

ScriptElement.prototype.setId = function (id) {
    this.Id = id;
    if (this.children) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].setOmniScriptId(id);
        }
    }
    allScriptsById[this.Id] = this;
};

ScriptElement.prototype.asJson = function () {
    var json = {
        Name: this.Name,
        Id: this.Id
    };
    for (var property in this) {
        if (nameSpacePropsRegex.test(property)) {
            json[ns + property] = this[property];
        }
    }
    var propSet = angular.copy(this.PropertySet__c);
    json[ns + 'PropertySet__c'] = JSON.stringify(propSet);
    return json;
};

ScriptElement.prototype.setSaving = function () {
    this.errors = null;
    this.saving = true;
};

ScriptElement.prototype.setErrors = function (errors) {
    this.errors = errors;
};

ScriptElement.prototype.hasErrors = function (errors) {
    return this.errors && this.errors.length > 0;
};

ScriptElement.getById = function (id) {
    return allScriptsById[id];
};

ScriptElement.prototype.each = function (expFunction) {
    expFunction(this);
    if (this.children) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].each(expFunction);
        }
    }
};

ScriptElement.prototype.scriptElement = function () {
    return this;
};

ScriptElement.reset = function () {
    allScriptsById = {};
};

module.exports = ScriptElement;

},{"../util/HtmlEncodeDecode.js":136}],139:[function(require,module,exports){
var idFunction = (function idFunction() {
  var prefixCounts = {"OmniScript Component": 1};
  var fn = function(prefix) {
    prefix = prefix ? prefix : "OmniScript Component";
    prefix = prefix.replace(/\brest\b/i, "REST");
    if (!prefixCounts[prefix]) {
      prefixCounts[prefix] = 1;
    }
    // string is never null
    return (prefix + " " + (prefixCounts[prefix]++)).replace(/\s/g,'');
  };
  fn.registerExistingPrefix = function(name) {
    var nameParts = name.split(/(?=[A-Z0-9 ])/);
    if (!isNaN(nameParts[nameParts.length - 1])) {
      var count = parseInt(nameParts[nameParts.length - 1], 10),
          key = nameParts.splice(0, nameParts.length - 1).join(' ');
      if (!prefixCounts[key] || prefixCounts[key] <= count) {
        prefixCounts[key] = count + 1;
      }
    }
  };
  return fn;
})();
module.exports = idFunction;
},{}],140:[function(require,module,exports){
var requiredProperties = {
    'Selectable Items': [
        'modalHTMLTemplateId','modalController','modalSize',
        'maxCompareSize','modalConfigurationSetting', 'accessibleInFutureSteps'
    ],
    'Block':['conditionType', 'accessibleInFutureSteps', 'repeatClone'],
    'Checkbox':['conditionType', 'accessibleInFutureSteps', 'repeatClone','readOnly', 
      'optionSource', 'controllingField'],
    'Currency':['conditionType','debounceValue', 'repeatClone','readOnly'],
    'Date':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Date/Time (Local)':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Disclosure':['conditionType', 'accessibleInFutureSteps','readOnly'],
    'Email':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Lookup':['conditionType', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Multi-select':['conditionType', 'accessibleInFutureSteps', 'repeatClone','readOnly', 'horizontalMode',
       'optionSource', 'controllingField'],
    'Number':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Password':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Radio':['conditionType', 'accessibleInFutureSteps', 'repeatClone','readOnly', 
      'horizontalMode', 'optionSource', 'controllingField'],
    'Range':['conditionType', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Select':['conditionType', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Signature':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Step':['conditionType', 'knowledgeOptions', 'remoteOptions', 'remoteClass', 'remoteMethod', 'remoteTimeout'],
    'Telephone':['conditionType', 'accessibleInFutureSteps', 'debounceValue', 'repeatClone','readOnly'],
    'Text':['conditionType', 'accessibleInFutureSteps', 'debounceValue', 'repeatClone','readOnly'],
    'Text Area':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Time':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'URL':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Filter Block':['accessibleInFutureSteps'],
    'Filter':['accessibleInFutureSteps'],
    'Input Block':['accessibleInFutureSteps']
};

module.exports = requiredProperties;
},{}],141:[function(require,module,exports){
(function () {
    'use strict';
    /*jshint -W030*/

    var tempMgr  = {
        ootb : {
            ' ': null,
            'vlcSelectableItem.html': 'vlcSelectableItem.html',
            'vlcSmallItems.html': 'vlcSmallItems.html',
            'vlcCardList.html': 'vlcCardList.html',
            'vlcPaymentList.html': 'vlcPaymentList.html',
            'vlcAssetList.html': 'vlcAssetList.html',
            'vlcSelectableItemV2.html':'vlcSelectableItemV2.html',
            'vlcSmallItemsV2.html':'vlcSmallItemsV2.html',
            'vlcSelectableItemHyb.html':'vlcSelectableItemHyb.html',
            'vlcSmallItemsHyb.html':'vlcSmallItemsHyb.html'
        },

        getModalTemplates: function(uiTemplates) {
            var obj = {};
            uiTemplates.map(function(template) {
                if (/^OmniScript Modal$/.test(template['Type__c'])) {
                    obj[template.Name] = template.Name;
                }
            });

            return obj;

        },

        getRedirectTemplates: function(uiTemplates) {
            var obj = {};
            uiTemplates.map(function(template) {
                if (/^OmniScript Redirect$/.test(template['Type__c'])) {
                    obj[template.Name] = template.Name;
                }
            });
            return obj;
        },

        getSelectableTemplates: function(uiTemplates) {
            var obj = {};
            uiTemplates.map(function(template) {
                if (/^OmniScript Selectable Items$/.test(template['Type__c'])) {
                    obj[template.Name] = template.Name;
                }
            });

            for (var prop in this.ootb) {
                if (this.ootb.hasOwnProperty(prop)) {
                    obj[prop] = this.ootb[prop];
                }
            }
            return obj;
        },

        getGenTemplates: function(uiTemplates) {
            var obj = {};
            uiTemplates.map(function(template) {
                if (/^OmniScript$/.test(template['Type__c'])) {
                    obj[template.Name] = template.Name;
                }
            });

            return obj;
        },

        getInputBlockTemplates: function(uiTemplates) {
            var obj = {};
            uiTemplates.map(function(template) {
                obj[template.Name] = template.Name;
            });

            return obj;

        },

        getDefaultValues: function(label, obj) {
            var map = {
                'modalHTMLTemplateId': 'vlcModalContent.html',
                'modalConfigurationSetting.modalHTMLTemplateId': 'vlcProductConfig.html',
                'inputBlock': 'vlcTableSample.html',
                'Submit.redirectTemplateUrl': 'vlcApplicationAcknowledge.html',
                'Submit.confirmRedirectTemplateUrl': 'vlcApplicationConfirmation.html',
                'DataRaptor Extract Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'Remote Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'Rest Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'Done Action.redirectTemplateUrl': 'vlcMobileConfirmation.html',
                'Calculation Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'DocuSign Envelope Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'PDF Action.redirectTemplateUrl': 'vlcPDF.html',
                'DataRaptor Post Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'DataRaptor Transform Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'Matrix Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'Delete Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'Post to Object Action.redirectTemplateUrl': 'vlcApplicationAcknowledgeV2.html',
                'Review Action.redirectTemplateUrl': 'vlcApplicationConfirmationV2.html',
                'vlcProductConfig.html': 'vlcProductConfig.html'
            };

            if (map[label]) {
                obj[map[label]] = map[label];
            }
            return obj;
        },

        getTemplates: function(uiTemplates, property) {
            if (!(angular.isArray(uiTemplates))) {
                return {};
            }

            if (/modal/i.test(property.label)) {
                if (/persistentComponent\.\d+\.modalConfigurationSetting\.modalHTMLTemplateId/.test(property.label)) {
                    if (property.$canvasElement && property.$canvasElement.PropertySet__c &&
                            property.$canvasElement.PropertySet__c.persistentComponent) {
                        var persistentComponentConf = property.$canvasElement.PropertySet__c.persistentComponent;
                        var index = +property.label.split('.')[1];
                        if (persistentComponentConf.length > index) {
                            if (persistentComponentConf[index].id === 'vlcCart') {
                                return this.getDefaultValues('vlcProductConfig.html',this.getModalTemplates(uiTemplates));
                            }
                            else {
                                return this.getModalTemplates(uiTemplates);
                            }
                        }
                    }
                    return {};
                } else {
                    return this.getDefaultValues(property.label,this.getModalTemplates(uiTemplates));
                }
            }

            if (/redirect/i.test(property.label) && property.$canvasElement.CanvasType === 'Script Configuration') {
                return {
                    'vlcSaveForLaterAcknowledge.html':'vlcSaveForLaterAcknowledge.html'
                };
            } else if (/redirect/i.test(property.label) && property.$canvasElement['Type__c']) {
                return this.getDefaultValues(property.$canvasElement['Type__c'].label + '.' + property.label,
                                                this.getRedirectTemplates(uiTemplates));
            }

            if (property.$canvasElement['Type__c'] && /input block/i.test(property.$canvasElement['Type__c'].label)) {
                return this.getDefaultValues('inputBlock',this.getGenTemplates(uiTemplates));
            }

            if (property.$canvasElement['Type__c'] && /selectable/i.test(property.$canvasElement['Type__c'].label)) {
                return this.getDefaultValues(property.label,this.getSelectableTemplates(uiTemplates));
            }

            //this is the default case
            return this.getGenTemplates(uiTemplates);
        }
    };

    module.exports = tempMgr ;
}());

},{}],142:[function(require,module,exports){
angular.module('ouihome')
       .factory('backcompatExport', function(remoteActions, $localizable) {
           var $scope = {};

           return function backcompatExport(script, dontRetryCompile, useJSONV2)  {
                var exportResult,
                    initialPromise;
                if (useJSONV2) {
                    initialPromise = remoteActions.BuildJSONV2(script.Id)
                } else {
                    initialPromise = remoteActions.exportOmniScript(script.Id);
                }
                initialPromise
                    .then(function(result) {
                        var pom = document.createElement('a');
                        if (!angular.isString(result)) {
                            // OMNI-421 - always make into array for backcompat
                            if (!angular.isArray(result) && useJSONV2 !== true) {
                                result = [result];
                            }
                            result = JSON.stringify(result);
                            result = result.replace('&quot;', '&amp;quot;');
                        }
                        try {
                            pom.setAttribute('href', 'data:application/zip;charset=utf-8,' + encodeURIComponent(result));
                            var name = (script[fileNsPrefix() + 'Type__c'] || '') + '_' + (script[fileNsPrefix() + 'SubType__c'] || '') + '_' + (script[fileNsPrefix() + 'Language__c'] || '');
                            name = name.replace(/ /g, '');
                            pom.setAttribute('download', name + '.json');
                            pom.style.display = 'none';
                            document.body.appendChild(pom);
                            pom.click();
                        } catch (e) {
                            window.alert($localizable('OmniHomeFailExport', 'Unable to export {1}', script.Name));
                        }
                        document.body.removeChild(pom);
                    }, function(error) {
                        if (dontRetryCompile) {
                            window.alert($localizable('OmniHomeFailExport', 'Unable to export {1}', script.Name));
                        } else {
                            // if false then try compile it
                            var iframe = document.createElement('iframe');
                            iframe.src = window.previewUrl + '?id=' + script.Id;
                            iframe.style.display = 'none';
                            $(iframe).load(function() {
                                setTimeout(function() {
                                    document.body.removeChild(iframe);
                                    backcompatExport(script, true, useJSONV2);
                                }, 5000);
                            });
                            document.body.appendChild(iframe);
                        }
                    });
           };
       });

},{}]},{},[1]);
})();
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
window.stickybits = require('./dependencies/stickybits.js');

angular.module('drmapper.core', [
    'vlocity',
    'drvcomp',
    'sldsangular',
    'ngSanitize',
    'ngMessages',
    'ngAria',
    'ngAnimate',
    'dndLists',
    'monacoEditor'])
.constant('_', window._)
.constant('vkbeautify', window.vkbeautify)
.constant('stickybits', window.stickybits);

angular.module('drmapper.load', ['drmapper.core']);

angular.module('drmapper', ['drmapper.load']);

require('./modules/drmapper/config/config.js');
require('./modules/drmapper/config/run.js');

require('./modules/drmapper/controller/drmapper.js');

// extract bundle mappings tabs
require('./modules/drmapper/directives/extract/extractTabs.js');
require('./modules/drmapper/directives/extract/extractFieldRow.js');
require('./modules/drmapper/directives/extract/extractFieldsTab.js');
require('./modules/drmapper/directives/extract/extractObjectTab.js');
require('./modules/drmapper/directives/extract/extractObjectRow.js');
require('./modules/drmapper/directives/extract/extractObjectFilter.js');
require('./modules/drmapper/directives/extract/extractOptionsTab.js');

// turbo extract bundle mappings tabs
require('./modules/drmapper/directives/turboExtract/turboExtractFieldsRow.js');

// load bundle mappings tabs
require('./modules/drmapper/directives/load/loadTabs.js');
require('./modules/drmapper/directives/load/loadObjectTab.js');
require('./modules/drmapper/directives/load/loadObjectRow.js');
require('./modules/drmapper/directives/load/loadFieldsTab.js');
require('./modules/drmapper/directives/load/loadFieldRow.js');
require('./modules/drmapper/directives/load/loadOptionsTab.js');

// transform bundle mapping tabs
require('./modules/drmapper/directives/transform/transformTabs.js');
require('./modules/drmapper/directives/transform/transformMappingTab.js');
require('./modules/drmapper/directives/transform/transformMapValues.js');

// formula mappings
require('./modules/drmapper/directives/formula/formulaMapping.js');
require('./modules/drmapper/directives/formula/formulaTab.js');

// preview mappings
require('./modules/drmapper/directives/preview/previewExtract.js');
require('./modules/drmapper/directives/preview/previewLoadTransform.js');

// common
require('./modules/drmapper/directives/fieldBundleTable.js');
require('./modules/drmapper/directives/autoMatchField.js');
require('./modules/drmapper/directives/drEditor.js');

require('./modules/drmapper/factory/SObjects.js');
require('./modules/drmapper/factory/SObjectFields.js');
require('./modules/drmapper/factory/generateUniqueMapId.js');
require('./modules/drmapper/factory/mappingService.js');
require('./modules/drmapper/factory/mappingSort.js');
require('./modules/drmapper/factory/documentService.js');
require('./modules/drmapper/factory/pathComparisonService.js');

require('./modules/drmapper/filter/UrlEncode.js');
require('./modules/drmapper/filter/MappingFilter.js');

require('./modules/drmapper/templates/templates.js');

},{"./dependencies/stickybits.js":2,"./modules/drmapper/config/config.js":3,"./modules/drmapper/config/run.js":4,"./modules/drmapper/controller/drmapper.js":5,"./modules/drmapper/directives/autoMatchField.js":6,"./modules/drmapper/directives/drEditor.js":7,"./modules/drmapper/directives/extract/extractFieldRow.js":8,"./modules/drmapper/directives/extract/extractFieldsTab.js":9,"./modules/drmapper/directives/extract/extractObjectFilter.js":10,"./modules/drmapper/directives/extract/extractObjectRow.js":11,"./modules/drmapper/directives/extract/extractObjectTab.js":12,"./modules/drmapper/directives/extract/extractOptionsTab.js":13,"./modules/drmapper/directives/extract/extractTabs.js":14,"./modules/drmapper/directives/fieldBundleTable.js":15,"./modules/drmapper/directives/formula/formulaMapping.js":16,"./modules/drmapper/directives/formula/formulaTab.js":17,"./modules/drmapper/directives/load/loadFieldRow.js":18,"./modules/drmapper/directives/load/loadFieldsTab.js":19,"./modules/drmapper/directives/load/loadObjectRow.js":20,"./modules/drmapper/directives/load/loadObjectTab.js":21,"./modules/drmapper/directives/load/loadOptionsTab.js":22,"./modules/drmapper/directives/load/loadTabs.js":23,"./modules/drmapper/directives/preview/previewExtract.js":24,"./modules/drmapper/directives/preview/previewLoadTransform.js":25,"./modules/drmapper/directives/transform/transformMapValues.js":26,"./modules/drmapper/directives/transform/transformMappingTab.js":27,"./modules/drmapper/directives/transform/transformTabs.js":28,"./modules/drmapper/directives/turboExtract/turboExtractFieldsRow.js":29,"./modules/drmapper/factory/SObjectFields.js":30,"./modules/drmapper/factory/SObjects.js":31,"./modules/drmapper/factory/documentService.js":32,"./modules/drmapper/factory/generateUniqueMapId.js":33,"./modules/drmapper/factory/mappingService.js":34,"./modules/drmapper/factory/mappingSort.js":35,"./modules/drmapper/factory/pathComparisonService.js":36,"./modules/drmapper/filter/MappingFilter.js":37,"./modules/drmapper/filter/UrlEncode.js":38,"./modules/drmapper/templates/templates.js":39}],2:[function(require,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.stickybits = factory());
}(this, (function () { 'use strict';
//! https://github.com/dollarshaveclub/stickybits/blob/master/LICENSE
/*
  STICKYBITS 💉
  --------
  a lightweight alternative to `position: sticky` polyfills 🍬
*/
function Stickybit(target, o) {
  /*
    defaults 🔌
    --------
    - target = el (DOM element)
    - se = scroll element (DOM element used for scroll event)
    - offset = 0 || dealer's choice
    - verticalPosition = top || bottom
    - useStickyClasses = boolean
    - noStyles = boolean
  */
  this.el = target;
  this.se = o && o.scrollEl || window;
  this.offset = o && o.stickyBitStickyOffset || 0;
  this.vp = o && o.verticalPosition || 'top';
  this.useClasses = o && o.useStickyClasses || false;
  this.ns = o && o.noStyles || false;
  this.styles = this.el.style;
  this.setStickyPosition();
  if (this.positionVal === 'fixed' || this.useClasses === true) {
    this.manageStickiness();
  }
  return this;
}

/*
  setStickyPosition ✔️
  --------
  — most basic thing stickybits does
  => checks to see if position sticky is supported
  => stickybits works accordingly
*/
Stickybit.prototype.setStickyPosition = function setStickyPosition() {
  var prefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];
  var styles = this.styles;
  var vp = this.vp;
  for (var i = 0; i < prefix.length; i += 1) {
    styles.position = prefix[i] + 'sticky';
  }
  if (styles.position !== '') {
    this.positionVal = styles.position;
    if (vp === 'top' && !this.ns) {
      styles[vp] = this.offset + 'px';
    }
  } else this.positionVal = 'fixed';
  return this;
};

/*
  manageStickiness ✔️
  --------
  — manages stickybit state
  => checks to see if the element is sticky || stuck
  => based on window scroll
*/
Stickybit.prototype.manageStickiness = function manageStickiness() {
  // cache variables
  var el = this.el;
  var parent = el.parentNode;
  var pv = this.positionVal;
  var vp = this.vp;
  var styles = this.styles;
  var ns = this.ns;
  var se = this.se;
  var isWin = se === window;
  var seOffset = !isWin && pv === 'fixed' ? se.getBoundingClientRect().top : 0;
  var offset = seOffset + this.offset;
  var rAF = typeof se.requestAnimationFrame !== 'undefined' ? se.requestAnimationFrame : function rAFDummy(f) {
    f();
  };

  // setup css classes
  parent.className += ' js-stickybit-parent';
  var stickyClass = 'js-is-sticky';
  var stuckClass = 'js-is-stuck';
  // r arg = removeClass
  // a arg = addClass
  function toggleClasses(r, a) {
    var cArray = el.className.split(' ');
    if (a && cArray.indexOf(a) === -1) cArray.push(a);
    var rItem = cArray.indexOf(r);
    if (rItem !== -1) cArray.splice(rItem, 1);
    el.className = cArray.join(' ');
  }

  // manageState
  /* stickyStart =>
    -  checks if stickyBits is using window
        -  if it is using window, it gets the top offset of the parent
        -  if it is not using window,
           -  it gets the top offset of the scrollEl - the top offset of the parent
  */
  var stickyStart = isWin ? parent.getBoundingClientRect().top : parent.getBoundingClientRect().top - seOffset;
  var stickyStop = stickyStart + parent.offsetHeight - (el.offsetHeight - offset);
  var state = 'default';

  this.manageState = function () {
    var scroll = isWin ? se.scrollY || se.pageYOffset : se.scrollTop;
    var notSticky = scroll > stickyStart && scroll < stickyStop && (state === 'default' || state === 'stuck');
    var isSticky = scroll < stickyStart && state === 'sticky';
    var isStuck = scroll > stickyStop && state === 'sticky';
    if (notSticky) {
      state = 'sticky';
      rAF(function () {
        toggleClasses(stuckClass, stickyClass);
        styles.position = pv;
        if (ns) return;
        styles.bottom = '';
        styles[vp] = offset + 'px';
      });
    } else if (isSticky) {
      state = 'default';
      rAF(function () {
        toggleClasses(stickyClass);
        if (pv === 'fixed') styles.position = '';
      });
    } else if (isStuck) {
      state = 'stuck';
      rAF(function () {
        toggleClasses(stickyClass, stuckClass);
        if (pv !== 'fixed' || ns) return;
        styles.top = '';
        styles.bottom = '0';
        styles.position = 'absolute';
      });
    }
  };

  se.addEventListener('scroll', this.manageState);
  return this;
};

/*
  cleanup 🛁
  --------
  - target = el (DOM element)
  - scrolltarget = window || 'dealer's chose'
  - scroll = removes scroll event listener
*/
Stickybit.prototype.cleanup = function cleanup() {
  var el = this.el;
  var styles = this.styles;
  // cleanup styles
  styles.position = '';
  styles[this.vp] = '';
  // cleanup CSS classes
  function removeClass(selector, c) {
    var s = selector;
    var cArray = s.className.split(' ');
    var cItem = cArray.indexOf(c);
    if (cItem !== -1) cArray.splice(cItem, 1);
    s.className = cArray.join(' ');
  }
  removeClass(el, 'js-is-sticky');
  removeClass(el, 'js-is-stuck');
  removeClass(el.parentNode, 'js-stickybit-parent');
  // remove scroll event listener
  this.se.removeEventListener('scroll', this.manageState);
  // turn of sticky invocation
  this.manageState = false;
};

function MultiBits(userInstances) {
  this.privateInstances = userInstances || [];
  var instances = this.privateInstances;
  this.cleanup = function () {
    for (var i = 0; i < instances.length; i += 1) {
      var instance = instances[i];
      instance.cleanup();
    }
  };
}

function stickybits(target, o) {
  var els = typeof target === 'string' ? document.querySelectorAll(target) : target;
  if (!('length' in els)) els = [els];
  var instances = [];
  for (var i = 0; i < els.length; i += 1) {
    var el = els[i];
    instances.push(new Stickybit(el, o));
  }
  return new MultiBits(instances);
}

return stickybits;

})));
},{}],3:[function(require,module,exports){
(function() {
    'use strict';
    angular.module('drmapper')
        .config(config);
    
    config.$inject = ['remoteActionsProvider', '$logProvider', '$compileProvider', '$locationProvider'];
    
    function config(remoteActionsProvider, $logProvider, $compileProvider, $locationProvider) {
        var actions = ['drPreviewExecute', 'GetFieldsForObject', 'DeleteMappings', 'SaveMapping',
                        'JsonToXml', 'XmlToJson', 'SaveBundle', 'vlocityFormulaParserFunctions',
                        'GetDocuments', 'getDocuSignTemplates', 'getAllJSONBasedDocumentTemplates',
                        'getAllTokensForJSONBasedDocumentTemplate', 'GetDocumentData', 'getDocuSignTemplateData',
                        'validateUniqueField', 'GetInterfaceObjects',
                        'cloneDRBundle', 'getDefaultBundleForInterface', 'GenerateMappings',
                        'GetFullMapItems', 'getAttributes', 'QueryAllFields', 'CallCustomSerializeMethod', 'CallCustomDeserializeMethod', 'GetAllObjects', 'GetAllObjectsPaged',
                        'getAllSObjectFieldsByReferenceToPath', 'getRelationsByPath'];
        var config = actions.reduce(function(config, action) {
            config[action] = {
                action: fileNsPrefixDot() + 'DRMapperController3.' + action,
                config: {escape: false, buffer: false}
            };
            return config;
        }, {});
        remoteActionsProvider.setRemoteActions(config);
        $logProvider.debugEnabled(true);
        $compileProvider.debugInfoEnabled(true);
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
    })();

},{}],4:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .run(run);

run.$inject = ['DRBundle', '$$mappings', '$rootScope', 'fieldMetadata', 'DocumentService', 'mappingService'];

function run(DRBundle, $$mappings, $rootScope, fieldMetadata, documentService, mappingService) {
    delete DRBundle.attributes;
    var ns = fileNsPrefix(),
        typeFieldKey = ns + 'Type__c',
        inputTypeKey = ns + 'InputType__c',
        outputTypeKey = ns + 'OutputType__c';
    if (DRBundle.Owner) {
        delete DRBundle.Owner.attributes;
    }

    if (!DRBundle[typeFieldKey]) {
        DRBundle[typeFieldKey] = 'Extract';
    }

    // Fix up Input/Output types for older DR's
    if (!DRBundle[inputTypeKey] || !DRBundle[outputTypeKey]) {
        switch (DRBundle[typeFieldKey]) {
            case 'Transform': DRBundle[typeFieldKey] = 'Transform';
                DRBundle[inputTypeKey] = 'JSON';
                if (DRBundle[ns + 'TargetOutDocuSignTemplateId__c']) {
                    DRBundle[outputTypeKey] = 'DocuSign';
                } else if (DRBundle[ns + 'TargetOutPdfDocName__c'] &&
                            (DRBundle[outputTypeKey] !== 'PDF' || DRBundle[outputTypeKey] !== 'Document Template')) {
                    documentService.backcompatFigureOutIfPDForDocumentTemplate(DRBundle[ns + 'TargetOutPdfDocName__c'])
                        .then(function(result) {
                            DRBundle[outputTypeKey] = result;
                        })
                        .catch(function() {
                            DRBundle[outputTypeKey] = 'PDF';
                        });
                } else {
                    DRBundle[outputTypeKey] = 'JSON';
                }
                break;
            case 'Extract (JSON)': DRBundle[typeFieldKey] = 'Extract';
                DRBundle[inputTypeKey] = 'JSON';
                DRBundle[outputTypeKey] = 'JSON';
                break;
            case 'Load (JSON)': DRBundle[typeFieldKey] = 'Load';
                DRBundle[inputTypeKey] = 'JSON';
                DRBundle[outputTypeKey] = 'SObject';
                break;
            case 'Load (Object)': DRBundle[typeFieldKey] = 'Load';
                DRBundle[inputTypeKey] = 'SObject';
                DRBundle[outputTypeKey] = 'SObject';
                break;
            default: // no-op;
        }
    }

    DRBundle.$$originalJSON = angular.toJson(DRBundle);
    DRBundle.$$mappings = $$mappings;
    DRBundle.$$mappings.forEach(function(mapping) {
        delete mapping.attributes;
        mapping.$$editing = false;
        if (mapping[ns + 'IsDisabled__c'] === true && mapping[ns + 'ConfigurationValue__c'] === 'FAKEMAPPING') {
            mapping.$$fakeMapping = true;
        }
        mappingService.preprocessDownloadedMapping(mapping);
        mapping.$$originalJSON = angular.toJson(mapping);
    });
    $rootScope.nsPrefix = fileNsPrefix();

    $('.noSidebarCell:has(.Theme3)').css({
        padding: 0
    });

    // for all emptyText in fieldMetadata for DRMapItem set it to be empty string
    Object.keys(fieldMetadata.DRMapItem).forEach(function(name) {
        fieldMetadata.DRMapItem[name].emptyText = ' ';
    });
}

})();

},{}],5:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .controller('drmapper', DRMapperController2);

DRMapperController2.$inject = ['DRBundle', 'fieldMetadata', 'fieldSetMetadata', '$scope',
                                 '_', 'remoteActions', '$q', 'DocumentService', '$sldsPrompt', '$sldsToast', 'mappingService', '$localizable', '$sldsModal'];

function DRMapperController2(DRBundle, fieldMetadata, fieldSetMetadata, $scope,
                                _, remoteActions, $q, DocumentService, $sldsPrompt, $sldsToast, mappingService, $localizable, $sldsModal) {
    var nameField, typeField, inputTypeField, outputTypeField, interfaceObjectField,
        targetOutPdfDocNameField, targetOutDocuSignTemplateField, targetOutOutputClassField, targetOutInputClassField, targetOutBatchSizeField, self = this;
    this.bundle = DRBundle;
    this.ns = fileNsPrefix();
    this.fields = fieldMetadata.DRBundle;
    this.fields['Owner'] = {'Name': {'label' :'Owner'}};
    this.visibleFields = ['Name'].concat(fieldSetMetadata.DRBundle);

    var titleEl = document.querySelector('title');
    if (!titleEl) {
        var headEl = document.querySelector('head');
        titleEl = document.createElement('title');
        headEl.appendChild(titleEl);
    }
    titleEl.innerText = 'Dataraptor: ' + DRBundle.Name;

    $scope.$createClone = function(newName) {
        return remoteActions.cloneDRBundle(self.bundle.Id, newName)
            .then(function(newId) {
                window.location = fixUpUrlWithParams('/apex/' + fileNsPrefix() + 'drmapper?id=' + newId);
                self.modal.hide();
            }).catch(function(error) {
                $sldsToast({
                    title: 'Failed to clone Interface',
                    content: error.message,
                    severity: 'error',
                    autohide: false
                });
                self.modal.hide();
            });
    };

    function fixUpUrlWithParams(url) {
        var searchParams = window.location.search.substr(1).split('&');
        var hrefEl = document.createElement('a');
        hrefEl.href = url;
        var newSearchParams = hrefEl.search.substr(1).split('&');
        var combinedSearchParams = searchParams.reduce(function(obj, param) {
            var keyValue = param.split('=');
            obj[keyValue[0]] = keyValue[1];
            return obj;
        }, {});
        newSearchParams.forEach(function(param) {
            var keyValue = param.split('=');
            combinedSearchParams[keyValue[0]] = keyValue[1];
        });
        return hrefEl.pathname + '?' + Object.keys(combinedSearchParams).reduce(function(str, paramKey) {
            if (combinedSearchParams[paramKey] !== undefined) {
                str += '&' + paramKey + '=' + combinedSearchParams[paramKey];
            }
            return str;
        }, '');
    }

    function adaptToPicklistValue(value) {
        return {
            isDefaultValue: false,
            isActive: true,
            value: value,
            label: value
        };
    }

    nameField = this.fields.Name;
    nameField.isUnique = true;
    nameField.customValidator = function(modelValue) {
        return $q(function(resolve, reject) {
            if (/^[a-zA-Z0-9_\- ]+$/.test(modelValue)) {
                resolve(true);
            } else {
                reject(false);
            }
        });
    };
    nameField.isNillable = false;
    $localizable('DRInvalidName', 'The name can only contain alphanumeric characters and spaces')
        .then(function(label) {
            nameField.customValidatorMessage = label;
        });

    // make type__c a picklist of predefined values
    typeField = this.fields[this.ns + 'Type__c'];
    typeField.type = 'PICKLIST';
    typeField.restricted = true;
    typeField.isNillable = false;
    typeField.picklistValues = ['Extract', 'Turbo Extract', 'Load', 'Transform'].map(adaptToPicklistValue);

    // change input/output types based on Type__c
    inputTypeField = this.fields[this.ns + 'InputType__c'];
    inputTypeField.isNillable = false;
    outputTypeField = this.fields[this.ns + 'OutputType__c'];
    outputTypeField.isNillable = false;
    outputTypeField.type = inputTypeField.type = 'PICKLIST';
    outputTypeField.restricted = inputTypeField.restricted = true;
    inputTypeField.dependsOn = outputTypeField.dependsOn = this.ns + 'Type__c';
    typeField.customValidator = function(modelValue, viewValue, parentObject) {
        switch (modelValue) {
            case 'Extract':   setupForExtract(parentObject);
                break;
            case 'Turbo Extract':    setupForTurboExtract(parentObject);
                break;
            case 'Transform': setupForTransform(parentObject);
                break;
            case 'Load':    setupForLoad(parentObject);
                break;
            case 'Migration': // don't change it
                break;
            default:        // If not set or unknown force it to be Extract
                if (parentObject) {
                    parentObject[self.ns + 'Type__c'] = 'Extract';
                }
        }
        return $q.when(true);
    };

    // change the output doc picklist depending on outputType
    targetOutPdfDocNameField = this.fields[this.ns + 'TargetOutPdfDocName__c'];
    targetOutDocuSignTemplateField = this.fields[this.ns + 'TargetOutDocuSignTemplateId__c'];
    targetOutPdfDocNameField.hidden = targetOutDocuSignTemplateField.hidden = true;
    targetOutPdfDocNameField.type = targetOutDocuSignTemplateField.type = 'PICKLIST';
    targetOutPdfDocNameField.restricted = targetOutDocuSignTemplateField.restricted = false;
    targetOutPdfDocNameField.dependsOn = targetOutDocuSignTemplateField.dependsOn = this.ns + 'OutputType__c';
    targetOutInputClassField = this.fields[this.ns + 'CustomInputClass__c'];
    targetOutInputClassField.hidden = true;
    targetOutInputClassField.restricted = false;
    targetOutInputClassField.dependsOn = this.ns + 'InputType__c';
    targetOutOutputClassField = this.fields[this.ns + 'CustomOutputClass__c'];
    targetOutOutputClassField.hidden = true;
    targetOutOutputClassField.restricted = false;
    targetOutOutputClassField.dependsOn = this.ns + 'OutputType__c';
    targetOutBatchSizeField = this.fields[this.ns + 'BatchSize__c'];
    targetOutBatchSizeField.hidden = true;
    targetOutBatchSizeField.restricted = false;

    outputTypeField.customValidator = function(modelValue, viewValue, parentObject) {
        if (parentObject) {
            setupOutputType(modelValue, parentObject);
        }
        return $q.when(true);
    };

    // handle InputType change for Load
    interfaceObjectField = this.fields[this.ns + 'InterfaceObject__c'];
    interfaceObjectField.hidden = true;
    interfaceObjectField.type = 'PICKLIST';
    interfaceObjectField.restricted  = false;
    remoteActions.GetInterfaceObjects()
        .then(function (objects) {
            interfaceObjectField.picklistValues = _.orderBy(objects, [function(object) {
                return object.value.toLowerCase();
            }], ['asc']);
        });
    inputTypeField.customValidator = function(modelValue, viewValue, parentObject) {
        if (parentObject) {
            setupInputType(modelValue, parentObject);
        }
        return $q.when(true);
    };

    function setupOutputType(modelValue, parentObject) {
        if (!parentObject) {
            return;
        }
        switch (modelValue) {
            case 'PDF': setupForPDF(parentObject);
                break;
            case 'DocuSign': setupForDocusign(parentObject);
                break;
            case 'Document Template': setupForWordDoc(parentObject);
                break;
            case 'Custom' : targetOutOutputClassField.hidden = false;
                break;
            default:
                targetOutPdfDocNameField.hidden = true;
                targetOutDocuSignTemplateField.hidden = true;
                targetOutOutputClassField.hidden = true;
        }
    }

    function setupForTransform(parentObject) {
        if (!parentObject[self.ns + 'InputType__c'] ||
                                    parentObject[self.ns + 'InputType__c'] === 'SObject') {
            parentObject[self.ns + 'InputType__c'] = 'JSON';
        }
        if (!parentObject[self.ns + 'OutputType__c'] ||
                parentObject[self.ns + 'OutputType__c'] === 'SObject') {
            parentObject[self.ns + 'OutputType__c'] = 'JSON';
            setupOutputType('JSON', parentObject);
        }
        if (!inputTypeField.picklistValues || inputTypeField.picklistValues.length !== 2) {
            inputTypeField.picklistValues = ['JSON', 'XML', 'Custom'].map(adaptToPicklistValue);
        }
        outputTypeField.picklistValues = ['JSON', 'XML', 'PDF', 'DocuSign', 'Document Template', 'Custom'].map(adaptToPicklistValue);
    }

    function setupForExtract(parentObject) {
        if (!parentObject[self.ns + 'InputType__c'] ||
                                    parentObject[self.ns + 'InputType__c'] === 'SObject') {
            parentObject[self.ns + 'InputType__c'] = 'JSON';
        }
        var outputType = parentObject[self.ns + 'OutputType__c'];
        if (outputType !== 'Custom' && outputType !== 'JSON' && outputType !== 'XML') {
            parentObject[self.ns + 'OutputType__c'] = 'JSON';
            setupOutputType('JSON', parentObject);
        }
        if (!inputTypeField.picklistValues || inputTypeField.picklistValues.length !== 2) {
            inputTypeField.picklistValues = ['JSON', 'XML', 'Custom'].map(adaptToPicklistValue);
        }
        outputTypeField.picklistValues = ['JSON', 'XML', 'Custom'].map(adaptToPicklistValue);
    }

    function setupForTurboExtract(parentObject) {
        if (!parentObject[self.ns + 'InputType__c'] ||
                                    parentObject[self.ns + 'InputType__c'] === 'SObject') {
            parentObject[self.ns + 'InputType__c'] = 'JSON';
        }
        var outputType = parentObject[self.ns + 'OutputType__c'];
        if (outputType !== 'Custom' && outputType !== 'JSON' && outputType !== 'XML') {
            parentObject[self.ns + 'OutputType__c'] = 'JSON';
            setupOutputType('JSON', parentObject);
        }
        if (!inputTypeField.picklistValues || inputTypeField.picklistValues.length !== 2) {
            inputTypeField.picklistValues = ['JSON', 'XML', 'Custom'].map(adaptToPicklistValue);
        }
        outputTypeField.picklistValues = ['JSON', 'Custom'].map(adaptToPicklistValue);
    }

    function setupForLoad(parentObject) {
        inputTypeField.picklistValues = ['JSON', 'XML', 'SObject', 'Custom'].map(adaptToPicklistValue);
        outputTypeField.picklistValues = ['SObject'].map(adaptToPicklistValue);
        if (!parentObject[self.ns + 'InputType__c']) {
            parentObject[self.ns + 'InputType__c'] = 'JSON';
        }
        parentObject[self.ns + 'OutputType__c'] = 'SObject';
        setupOutputType('SObject', parentObject);
        targetOutBatchSizeField.hidden = false;
    }

    function setupForDocusign(parentObject) {
        targetOutPdfDocNameField.hidden = true;
        targetOutOutputClassField.hidden = true;
        targetOutDocuSignTemplateField.hidden = false;
        targetOutDocuSignTemplateField.picklistValues = [];
        if (parentObject && parentObject[self.ns + 'TargetOutDocuSignTemplateId__c']) {
            targetOutDocuSignTemplateField.picklistValues.push({
                label: parentObject[self.ns + 'TargetOutDocuSignTemplateId__c'],
                value: parentObject[self.ns + 'TargetOutDocuSignTemplateId__c']
            });
        }
        DocumentService.getDocusignTemplates()
            .then(function(docusignTemplates) {
                targetOutDocuSignTemplateField.picklistValues = docusignTemplates;
                if (parentObject && parentObject[self.ns + 'TargetOutDocuSignTemplateId__c']) {
                    if (targetOutDocuSignTemplateField.picklistValues.findIndex(function findObj(obj) {
                        return obj.value == parentObject[self.ns + 'TargetOutDocuSignTemplateId__c'];
                    }) == -1) {
                        targetOutDocuSignTemplateField.picklistValues.push({
                            label: parentObject[self.ns + 'TargetOutDocuSignTemplateId__c'],
                            value: parentObject[self.ns + 'TargetOutDocuSignTemplateId__c']
                        });
                    }
                }
            });
    }

    function setupForPDF(parentObject) {
        targetOutPdfDocNameField.hidden = false;
        targetOutOutputClassField.hidden = true;
        targetOutDocuSignTemplateField.hidden = true;
        targetOutPdfDocNameField.picklistValues = [];
        if (parentObject && parentObject[self.ns + 'TargetOutPdfDocName__c']) {
            targetOutPdfDocNameField.picklistValues.push({
                label: parentObject[self.ns + 'TargetOutPdfDocName__c'],
                value: parentObject[self.ns + 'TargetOutPdfDocName__c']
            });
        }
        DocumentService.getPDFs()
            .then(function(pdfs) {
                targetOutPdfDocNameField.picklistValues = pdfs;
                if (parentObject && parentObject[self.ns + 'TargetOutPdfDocName__c']) {
                    if (targetOutPdfDocNameField.picklistValues.findIndex(function findObj(obj) {
                        var val = parentObject[self.ns + 'TargetOutPdfDocName__c'];
                        return obj.label ==  val && obj.value == val;
                    }) == -1) {
                        targetOutPdfDocNameField.picklistValues.push({
                            label: parentObject[self.ns + 'TargetOutPdfDocName__c'],
                            value: parentObject[self.ns + 'TargetOutPdfDocName__c']
                        });
                    }
                }
            });
    }

    function setupForWordDoc(parentObject) {
        targetOutPdfDocNameField.hidden = false;
        targetOutOutputClassField.hidden = true;
        targetOutDocuSignTemplateField.hidden = true;
        targetOutPdfDocNameField.picklistValues = [];
        if (parentObject && parentObject[self.ns + 'TargetOutPdfDocName__c']) {
            targetOutPdfDocNameField.picklistValues.push({
                label: parentObject[self.ns + 'TargetOutPdfDocName__c'],
                value: parentObject[self.ns + 'TargetOutPdfDocName__c']
            });
        }
        DocumentService.getDocumentTemplates()
            .then(function(worddocs) {
                targetOutPdfDocNameField.picklistValues = worddocs;
                if (parentObject && parentObject[self.ns + 'TargetOutPdfDocName__c']) {
                    if (targetOutPdfDocNameField.picklistValues.findIndex(function findObj(obj) {
                        return obj.value == parentObject[self.ns + 'TargetOutPdfDocName__c'];
                    }) == -1) {
                        targetOutPdfDocNameField.picklistValues.push({
                            label: parentObject[self.ns + 'TargetOutPdfDocName__c'],
                            value: parentObject[self.ns + 'TargetOutPdfDocName__c']
                        });
                    }
                }
            });
    }

    function setupInputType(modelValue, parentObject) {
        targetOutInputClassField.hidden = true;

        if (parentObject && parentObject[self.ns + 'Type__c'] === 'Load') {
            if (modelValue === 'SObject') {
                if (parentObject[self.ns + 'InterfaceObject__c'] === 'json') {
                    parentObject[self.ns + 'InterfaceObject__c'] = null;
                }
                interfaceObjectField.hidden = false;
                return;
            } else if (modelValue === 'Custom') {
                targetOutInputClassField.hidden = false;
            }

            parentObject[self.ns + 'InterfaceObject__c'] = 'json';
        } else if (modelValue === 'Custom') {
            targetOutInputClassField.hidden = false;
        }

        interfaceObjectField.hidden = true;
    }

    const buttons = [
        {
            type: 'edit',
            handleCancel: function() {
                typeField.customValidator(self.bundle[self.ns + 'Type__c'], self.bundle[self.ns + 'Type__c'], self.bundle);
                setupInputType(self.bundle[self.ns + 'InputType__c'], self.bundle);
                setupOutputType(self.bundle[self.ns + 'OutputType__c'], self.bundle);
            },
            handleSave: function(bundle) {
                handleTypeChange();
                return mappingService.saveBundle(bundle);
            }
        },{
            label: 'Quick Match',
            action: function() {
                self.modal = $sldsModal({
                    title: 'Quick Edit',
                    template: 'quickEditModal.tpl.html',
                    backdrop: 'static',
                    scope: $scope,
                    show: true
                });
            }
        }, {
            label: 'Clone',
            action: function() {
                var $promptScope = $scope.$new();
                self.modal = $sldsPrompt({
                    title: 'Clone ' + self.bundle.Name,
                    template: 'clonePrompt.tpl.html',
                    backdrop: 'static',
                    scope: $promptScope,
                    show: true,
                    buttons: []
                });
            }
        },{
            type: 'export',
            drvDataPackType: 'DataRaptor'
        }
    ];

    const excludeButtons = {
        Transform: [],
        Extract: [],
        "Turbo Extract" : ["Quick Match"],
        Load: []
    }

    function handleTypeChange(){
        // fix up the bundle type
        var currentType = self.bundle[self.ns + 'Type__c'];
        if (/^Transform/.test(currentType)) {
            self.bundle[self.ns + 'Type__c'] = 'Transform';
        } else if (/^Extract/.test(currentType)) {
            self.bundle[self.ns + 'Type__c'] = 'Extract';
        } else if (/^Turbo Extract/.test(currentType)) {
            self.bundle[self.ns + 'Type__c'] = 'Turbo Extract';
        } else if (/^Load/.test(currentType)) {
            self.bundle[self.ns + 'Type__c'] = 'Load';
        }

        // call it once to initialize the field visibility
        setupInputType(self.bundle[self.ns + 'InputType__c'], self.bundle);
        setupOutputType(self.bundle[self.ns + 'OutputType__c'], self.bundle);

        var dereg = $scope.$watch(function() {
            return self.bundle[self.ns + 'OutputType__c'];
        }, function(type) {
            if (type) {
                setupOutputType(self.bundle[self.ns + 'OutputType__c'], self.bundle);
                dereg();
            }
        });

        self.buttons = buttons.filter(function(button){
            return !excludeButtons[currentType].includes(button.label)
        })

    }

    handleTypeChange();

    if (typeof sforce !== 'undefined') {
        if (sforce.console && sforce.console.isInConsole()) {
            sforce.console.setTabTitle(self.bundle.Name || 'New Dataraptor');
            if (!self.bundle.Id) {
                sforce.console.setTabUnsavedChanges(true);
            }
            sforce.console.setTabIcon('standard:environment_hub');
        }
    }
}
})();

},{}],6:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('drmapper')
        .directive('autoMatchField', AutoMatchField);

    function AutoMatchField() {
        return {
            restrict: 'EA',
            bindToController: {
                bundle: '=',
                title: '=',
                onSave: '&',
                onCancel: '&'
            },
            scope: {},
            replace: true,
            templateUrl: 'autoMatchField.tpl.html',
            controllerAs: 'vm',
            controller: AutoMatchFieldController
        };
    }

    AutoMatchFieldController.$inject = ['$rootScope', 'generateUniqueMapId', 'mappingService', '_', '$q',
        '$sldsToast', 'mappingSort', '$sldsPrompt'
    ];

    function AutoMatchFieldController($rootScope, generateUniqueMapId, mappingService, _, $q, $sldsToast, mappingSort, $sldsPrompt) {
        var vm = this;
        vm.ns = fileNsPrefix();
        vm.inputMappings = null;
        vm.outputMappings = null;
        vm.matchedMappings = [];
        vm.removedMappings = [];
        vm.selectedInput = null;
        vm.selectedOutput = null;
        vm.saving = false;
        vm.jsonOutputPathKey = vm.ns + 'DomainObjectFieldAPIName__c';
        vm.extractJsonPathKey = vm.ns + 'InterfaceFieldAPIName__c';
        vm.filter = {
            inputMapping: null,
            outputMapping: null
        };

        vm.autoMatch = autoMatch;
        vm.dropOnInput = dropOnInput;
        vm.dropOnOutput = dropOnOutput;
        vm.onDrop = onDropToMatch;
        vm.onMatchedDrop = onMatchedDrop;
        vm.removeMapping = removeMapping;
        vm.save = save;
        vm.cancel = cancel;
        vm.pairMappings = pairMappings;
        vm.dismissMessage = dismissMessage;
        vm.synchronizeTokens = synchronizeTokens;
        vm.onInputSearchChange = onInputSearchChange;
        vm.onOutputSearchChange = onOutputSearchChange;
        vm.$onInit = doInit;

        ///////////////////

        var creationOrderKey = vm.ns + 'DomainObjectCreationOrder__c',
            apiNameKey = vm.ns + 'DomainObjectAPIName__c';

        function doInit() {
            vm.hideMessage = localStorage.getItem('drmapper_autoMatchField.hidemessage') === 'true';
            if (vm.bundle.$$mappings) {
                vm.isDocumentTemplateOuput = (vm.bundle[vm.ns + 'OutputType__c'] === 'Document Template');
                var inputs = [],
                    outputs = [];
                vm.matchedMappings = vm.bundle.$$mappings.reduce(function (array, mapping) {
                    if (mapping[creationOrderKey] !== 0 &&
                        mapping[apiNameKey] !== 'Formula' &&
                        !mapping.$$fakeMapping &&
                        // must have an input or output mapping
                        (mapping[vm.extractJsonPathKey] || mapping[vm.jsonOutputPathKey])) {
                        var outputMappingName = outputMappingString(mapping, vm.bundle);
                        array.push({
                            input: mapping[vm.extractJsonPathKey],
                            output: outputMappingName,
                            Id: mapping.Id,
                            $originalMapping: mapping
                        });
                        inputs.push(mapping[vm.extractJsonPathKey]);
                        outputs.push(outputMappingName);
                    }
                    return array;
                }, []);
                mappingService.getInputMappings(vm.bundle)
                    .then(function (fieldNames) {
                        return fieldNames.map(function (field) {
                            return field.value;
                        });
                    })
                    .then(function (fieldNames) {
                        vm.inputMappings = vm.originalInputMappings = _.difference(fieldNames, inputs).sort(mappingSort.sortFields);
                    });
                mappingService.getOutputMappings(vm.bundle, true)
                    .then(function (fieldNames) {
                        return fieldNames.map(function (field) {
                            return field.value;
                        });
                    })
                    .then(function (fieldNames) {
                        vm.outputMappings = vm.originalOutputMappings = _.difference(fieldNames, outputs).sort(mappingSort.sortFields);
                    });
            }
        }

        function outputMappingString(mapping, bundle) {
            if (bundle[vm.ns + 'Type__c'] === 'Load') {
                return mapping[creationOrderKey] + ' - ' + mapping[apiNameKey] + ':' + mapping[vm.jsonOutputPathKey];
            }
            return mapping[vm.jsonOutputPathKey];
        }

        function dropOnInput(event, index, item) {
            addMapping(vm.inputMappings[index], item);
            removeInputMapping(vm.inputMappings[index]);
            removeOutputMapping(item);
        }

        function dropOnOutput(event, index, item) {
            addMapping(item, vm.outputMappings[index]);
            removeOutputMapping(vm.outputMappings[index]);
            removeInputMapping(item);
        }

        function onDropToMatch(event, index, item, type) {
            switch (type) {
                case 'INPUT':
                    break;
                case 'OUTPUT':
                    addMapping(null, item);
                    removeOutputMapping(item);
                    break;
                default:
                    /* no-op */
            }
        }

        function onMatchedDrop(event, index, item) {
            var matchedMapping = vm.matchedMappings[index];
            if (matchedMapping.input) {
                // if we have existing input then for now return and ignore
                return;
            }
            matchedMapping.input = item;
            if (matchedMapping.Id) {
                matchedMapping.$modified = true;
            }
            removeInputMapping(item);
        }

        function removeMapping(mapping, index) {
            var removed = vm.matchedMappings.splice(index, 1)[0];
            if (removed.input) {
                addInputMapping(removed.input);
            }
            if (removed.output) {
                addOutputMapping(removed.output);
            }
            vm.removedMappings.push(removed);
        }

        function addMapping(input, output, isAutoMatch) {
            vm.selectedInput = null;
            vm.selectedOutput = null;
            vm.matchedMappings = vm.matchedMappings.concat([{
                input: input,
                output: output,
                isAutoMatch: !!isAutoMatch
            }]);
        }

        function pairMappings() {
            if (vm.selectedOutput) {
                removeOutputMapping(vm.selectedOutput);
                removeInputMapping(vm.selectedInput);
                addMapping(vm.selectedInput, vm.selectedOutput);
            } else if (vm.selectedMatched && !vm.selectedMatched.input) {
                vm.selectedMatched.input = vm.selectedInput;
                if (vm.selectedMatched.Id) {
                    vm.selectedMatched.$modified = true;
                }
                vm.selectedMatched = null;
                removeInputMapping(vm.selectedInput);
            }
        }

        function save() {
            var newMappings = vm.matchedMappings.filter(function(mapping) {
                return !mapping.Id;
            });
            var removedMappings = vm.removedMappings.filter(function(mapping) {
                return mapping.Id;
            });
            var message = [''];
            if (removedMappings.length == 1) {
                message.push('Removed 1 mapping');
            } else if (removedMappings.length > 1) {
                message.push('Removed ' + removedMappings.length + ' mappings');
            }
            if (newMappings.length === 1) {
                message.push(newMappings.length > 1 ? ' and a' : 'A');
                message.push('dded 1 new mapping');
            } else if (newMappings.length > 1) {
                message.push(newMappings.length > 1 ? ' and a' : 'A');
                message.push('dded ' + newMappings.length + ' new mappings');
            }

            doSave(message.join(''));
        }

        function doSave(message) {
            vm.saving = true;
            var removedPromises = [];
            // 1. go through removed mappings and save all
            if (vm.removedMappings.length > 0) {
                vm.removedMappings.forEach(function (mapping) {
                    removedPromises.push(mappingService.deleteMapping(mapping, true));
                });
                return addNewMappings(removedPromises, message);
            } else {
                // 2. go through all new mappings and save
                return addNewMappings(removedPromises, message);
            }
        }

        function addNewMappings(removedPromises, message) {
            var addedPromises = [],
                updatedPromises = [];
            vm.matchedMappings.forEach(function (mapping) {
                // skip ones with an Id because they already exist
                if (!mapping.Id) {
                    addedPromises.push(saveMapping(mapping));
                } else if (mapping.$modified) {
                    // unless they have been modified
                    mapping.$originalMapping[vm.extractJsonPathKey] = mapping.input;
                    updatedPromises.push(mappingService.saveMapping(mapping.$originalMapping));
                }
            });
            vm.saving = true;
            return $q.all([$q.all(addedPromises), $q.all(updatedPromises), $q.all(removedPromises)])
                .then(function (allResults) {
                    _.pullAllBy(vm.bundle.$$mappings, vm.removedMappings, 'Id');
                    vm.bundle.$$mappings = _.unionBy(vm.bundle.$$mappings, allResults[0], 'Id');
                    vm.onSave();
                    if (message !== '') {
                        $sldsToast({
                            title: message,
                            severity: 'success'
                        });
                    }
                    $rootScope.$broadcast('drbundle-mappings-updated');
                    vm.saving = false;
                })
                .catch(function (error) {
                    $sldsToast({
                        title: 'Failed to save some mappings',
                        content: error.message,
                        severity: 'error',
                        autohide: false
                    });
                    vm.saving = false;
                });
        }

        function saveMapping(mapping) {
            switch (vm.bundle[vm.ns + 'Type__c']) {
                case 'Turbo Extract':
                case 'Extract':
                    /* Extract and Transform behave same */
                case 'Transform':
                    return saveExtractMapping(mapping);
                case 'Load':
                    return saveLoadMapping(mapping);
                default:
            }
        }

        function saveExtractMapping(matchedMapping) {
            var inputKey = vm.ns + 'InterfaceFieldAPIName__c';
            var outputKey = vm.ns + 'DomainObjectFieldAPIName__c';
            var mapping = {
                Name: vm.bundle.Name
            };
            mapping[vm.ns + 'MapId__c'] = generateUniqueMapId();
            mapping[apiNameKey] = 'json';
            mapping[creationOrderKey] = 1;
            mapping[vm.ns + 'IsDisabled__c'] = false;
            mapping[vm.ns + 'IsRequiredForUpsert__c'] = false;
            mapping[vm.ns + 'UpsertKey__c'] = false;
            mapping[inputKey] = matchedMapping.input;
            mapping[outputKey] = matchedMapping.output;
            return mappingService.saveMapping(mapping);
        }

        function saveLoadMapping(matchedMapping) {
            var inputKey = vm.ns + 'InterfaceFieldAPIName__c';
            var outputKey = vm.ns + 'DomainObjectFieldAPIName__c';
            var mapping = {
                Name: vm.bundle.Name
            };
            if (matchedMapping.output) {
                var parts = matchedMapping.output.split(':');
                var creationOrderKeyObjectApiNameParts = parts[0].split(' - ');
                mapping[apiNameKey] = creationOrderKeyObjectApiNameParts[1];
                mapping[creationOrderKey] = Number(creationOrderKeyObjectApiNameParts[0]);
                mapping[outputKey] = parts[1];
            } else {
                mapping[creationOrderKey] = 1;
            }
            mapping[vm.ns + 'MapId__c'] = generateUniqueMapId();
            mapping[vm.ns + 'IsDisabled__c'] = false;
            mapping[vm.ns + 'IsRequiredForUpsert__c'] = false;
            mapping[vm.ns + 'UpsertKey__c'] = false;
            mapping[inputKey] = matchedMapping.input;
            return mappingService.saveMapping(mapping);
        }

        function cancel() {
            vm.onCancel();
        }

        function dismissMessage() {
            vm.showMessage = false;
            localStorage.setItem('drmapper_autoMatchField.hidemessage', 'true');
        }

        function autoMatch() {
            vm.saving = true;
            // Now go through each Output Mapping, split it by the parts (":") and find it's match in this table.
            var matchedOutputMappingsToRemove = [],
                newPathsToAdd = {},
                outputsWithMultipleOptions = {};
            vm.outputMappings.forEach(function (outputMapping) {
                var parts = outputMapping.split(':');
                if (vm.bundle[vm.ns + 'Type__c'] === 'Load') {
                    // need to trim the "{{number}} - " prefix
                    parts[0] = parts[0].split(' - ')[1];
                }
                var resolvedMappingName = parts.join(':');
                vm.inputMappings.forEach(function(inputMapping) {
                    if (isInputAndOutputPossibleMatch(inputMapping, resolvedMappingName)) {
                        if (!newPathsToAdd[inputMapping]) {
                            newPathsToAdd[inputMapping] = [];
                        }
                        newPathsToAdd[inputMapping].push({
                            input: inputMapping,
                            output: outputMapping
                        });
                        if (!outputsWithMultipleOptions[outputMapping]) {
                            outputsWithMultipleOptions[outputMapping] = [inputMapping];
                        } else {
                            outputsWithMultipleOptions[outputMapping].push(inputMapping);
                        }
                    }
                });
            });

            var bestPairingOptions = [];
            // now go through all collected Mappings and where we have multiple values that could be the best match then
            // figure out which is best.
            Object.keys(newPathsToAdd).forEach(function (key) {
                var toAdd = null,
                    resolvedMappingName;
                if (newPathsToAdd[key].length > 1) {
                    newPathsToAdd[key].forEach(function (potentialMapping) {
                        var parts = potentialMapping.output.split(':');
                        if (vm.bundle[vm.ns + 'Type__c'] === 'Load') {
                            // need to trim the "{{number}} - " prefix
                            parts[0] = parts[0].split(' - ')[1];
                        }
                        resolvedMappingName = parts.join(':');
                        // use fuzziness of 0.5 - this may need to be tweaked.
                        var newStringRating = scoreMappings(potentialMapping.input, resolvedMappingName);
                        potentialMapping.score = newStringRating;
                        bestPairingOptions.push(potentialMapping);
                    });
                } else {
                    toAdd = newPathsToAdd[key][0];
                    var parts = toAdd.output.split(':');
                    if (vm.bundle[vm.ns + 'Type__c'] === 'Load') {
                        // need to trim the "{{number}} - " prefix
                        parts[0] = parts[0].split(' - ')[1];
                    }
                    resolvedMappingName = parts.join(':');
                    toAdd.score = scoreMappings(toAdd.input, resolvedMappingName);
                    bestPairingOptions.push(toAdd);
                }
            });

            // now go through all the pairing options, sorted by score and add them.
            // as we do this we need to remove duplicate pairings for outputs
            var matchedInputs = [];
            _.orderBy(bestPairingOptions, ['score'], ['desc']).forEach(function(toAdd) {
                if (_.includes(matchedOutputMappingsToRemove, toAdd.output) === false &&
                    _.includes(matchedInputs, toAdd.input) === false) {
                    removeInputMapping(toAdd.input);
                    addMapping(toAdd.input, toAdd.output, true);
                    matchedOutputMappingsToRemove.push(toAdd.output);
                    matchedInputs.push(toAdd.input);
                }
            });

            matchedOutputMappingsToRemove.forEach(function (mapping) {
                removeOutputMapping(mapping);
            });

            var countOfNewMappings = Object.keys(matchedOutputMappingsToRemove).length;
            if (countOfNewMappings === 0) {
                $sldsToast({
                    title: 'No matches were found.',
                    severity: 'warning'
                });
            } else if (countOfNewMappings === 1) {
                $sldsToast({
                    title: '1 mapping was matched.',
                    severity: 'success'
                });
            } else {
                $sldsToast({
                    title: countOfNewMappings + ' mappings were matched.',
                    severity: 'success'
                });
            }
            vm.saving = false;
        }

        function synchronizeTokens() {
            vm.saving = true;
            return mappingService.getOutputMappings(vm.bundle, true)
                .then(function (fieldNames) {
                    return fieldNames.map(function (field) {
                        return field.value;
                    });
                }).then(function(availableTokens) {
                    var toRemove = {};
                    vm.matchedMappings.filter(function(mappingPair) {
                        var outputPart = mappingPair.output;
                        var indexInOutput = availableTokens.indexOf(outputPart);
                        if (indexInOutput === -1) {
                            toRemove[outputPart] = true;
                        }
                    });
                    vm.matchedMappings = vm.matchedMappings.filter(function(pair) {
                        if (toRemove[pair.output] === true) {
                            vm.removedMappings.push(pair);
                            return false;
                        }
                        return true;
                    });
                }).finally(function() {
                    vm.saving = false;
                });
        }

        function isInputAndOutputPossibleMatch(input, output) {
            if (input === output) {
                return true;
            } else {
                var inParts = makeParts(input),
                    outParts = makeParts(output);
                return inParts[0] === outParts[0] || inParts[0].toLowerCase() === outParts[0].toLowerCase();
            }
            return false;
        }

        function makeParts(mapping) {
            return mapping.split(':').reverse().filter(function(part) {
                return /#text/.test(part) == false;
            }).map(function(part) {
                // cleanse namespaced fields
                var parts = part.split('__');
                if (parts.length > 2) {
                    return parts[1];
                }
                return part;
            });
        }

        function scoreMappings(input, output) {
            var inputParts = makeParts(input),
                outputParts = makeParts(output);

            var runningScore = 0;
            inputParts.forEach(function(part, index) {
                if (outputParts[index]) {
                    runningScore += stringScore(part, outputParts[index], 0.01);
                }
            });
            return runningScore / (Math.abs(outputParts.length - inputParts.length) || 1);
        }

        /**
         * https://github.com/joshaven/string_score
         */
        function stringScore(string, word, fuzziness) {
            // If the string is equal to the word, perfect match.
            if (string === word) {
                return 1;
            }

            //if it's not a perfect match and is empty return 0
            if (word === '') {
                return 0;
            }

            var runningScore = 0,
                charScore,
                finalScore,
                lString = string.toLowerCase(),
                strLength = string.length,
                lWord = word.toLowerCase(),
                wordLength = word.length,
                idxOf,
                startAt = 0,
                fuzzies = 1,
                fuzzyFactor,
                i;

            // Cache fuzzyFactor for speed increase
            if (fuzziness) {
                fuzzyFactor = 1 - fuzziness;
            }

            // mgoldspink addition - big bonus if same number of parts
            if (string.split(':').length === word.split(':').length) {
                runningScore += string.split(':').length;
            }

            // Walk through word and add up scores.
            // Code duplication occurs to prevent checking fuzziness inside for loop
            if (fuzziness) {
                for (i = 0; i < wordLength; i += 1) {

                    // Find next first case-insensitive match of a character.
                    idxOf = lString.indexOf(lWord[i], startAt);

                    if (idxOf === -1) {
                        fuzzies += fuzzyFactor;
                    } else {
                        if (startAt === idxOf) {
                            // Consecutive letter & start-of-string Bonus
                            charScore = 0.7;
                        } else {
                            charScore = 0.1;

                            // Acronym Bonus
                            // Weighing Logic: Typing the first character of an acronym is as if you
                            // preceded it with two perfect character matches.
                            if (string[idxOf - 1] === ' ') {
                                charScore += 0.8;
                            }
                        }

                        // Same case bonus.
                        if (string[idxOf] === word[i]) {
                            charScore += 0.1;
                        }

                        // Update scores and startAt position for next round of indexOf
                        runningScore += charScore;
                        startAt = idxOf + 1;
                    }
                }
            } else {
                for (i = 0; i < wordLength; i += 1) {
                    idxOf = lString.indexOf(lWord[i], startAt);
                    if (-1 === idxOf) {
                        return 0;
                    }

                    if (startAt === idxOf) {
                        charScore = 0.7;
                    } else {
                        charScore = 0.1;
                        if (string[idxOf - 1] === ' ') {
                            charScore += 0.8;
                        }
                    }
                    if (string[idxOf] === word[i]) {
                        charScore += 0.1;
                    }
                    runningScore += charScore;
                    startAt = idxOf + 1;
                }
            }

            // Reduce penalty for longer strings.
            finalScore = 0.5 * (runningScore / strLength + runningScore / wordLength) / fuzzies;

            if ((lWord[0] === lString[0]) && (finalScore < 0.85)) {
                finalScore += 0.15;
            }

            return finalScore;
        }

        function onInputSearchChange() {
            if (!vm.filter.inputMapping || vm.filter.inputMapping.trim().length === 0) {
                vm.inputMappings = vm.originalInputMappings;
                return;
            }
            var compiled = new RegExp('^' + vm.filter.inputMapping + '|:' + vm.filter.inputMapping, 'i');
            vm.inputMappings = vm.originalInputMappings.filter(function (mapping) {
                return compiled.test(mapping);
            });
        }

        function onOutputSearchChange() {
            if (!vm.filter.outputMapping || vm.filter.outputMapping.trim().length === 0) {
                vm.outputMappings = vm.originalOutputMappings;
                return;
            }
            var compiled = new RegExp('^' + vm.filter.outputMapping + '|:' + vm.filter.outputMapping, 'i');
            vm.outputMappings = vm.originalOutputMappings.filter(function (mapping) {
                return compiled.test(mapping);
            });
        }

        function removeInputMapping(mapping) {
            vm.inputMappings = _.without(vm.inputMappings, mapping);
            vm.originalInputMappings = _.without(vm.originalInputMappings, mapping);
        }

        function removeOutputMapping(mapping) {
            vm.outputMappings = _.without(vm.outputMappings, mapping);
            vm.originalOutputMappings = _.without(vm.originalOutputMappings, mapping);
        }

        function addInputMapping(mapping) {
            vm.inputMappings = vm.inputMappings.concat([mapping]);
            vm.inputMappings.sort(mappingSort.sortFields);
            vm.originalInputMappings = vm.originalInputMappings.concat([mapping]);
            vm.originalInputMappings.sort(mappingSort.sortFields);
            // need to refilter
            onInputSearchChange();
        }

        function addOutputMapping(mapping) {
            vm.outputMappings = vm.outputMappings.concat([mapping]);
            vm.outputMappings.sort(mappingSort.sortFields);
            vm.originalOutputMappings = vm.originalOutputMappings.concat([mapping]);
            vm.originalOutputMappings.sort(mappingSort.sortFields);
            // need to refilter
            onOutputSearchChange();
        }

    }
})();
},{}],7:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper.core')
    .component('drEditor', {
        require: {
            ngModelCtrl: 'ngModel'
        },
        bindings: {
            model: '=ngModel',
            readonly: '@?',
            disabled: '@?',
            language: '@?',
            placeholder: '@?'
        },
        templateUrl: 'drEditor.tpl.html',
        controllerAs: 'vm',
        controller: MonacoDREditorController
    });

MonacoDREditorController.$inject = ['$scope', '$element', '$q', '$window'];

function MonacoDREditorController($scope, $element, $q, $window) {
    var vm = this,
        isEditorFocussed = false,
        editor, ro, containerElement;



    vm.$onInit = doInit;
    vm.$onDestroy = onDestroy;

    ////////////////////
    function doInit() {
        containerElement = $('.slds-textarea', $element).get(0);
        containerElement.style.overflow = 'hidden';
        configureValidators();
        buildMonaco()
            .then(function() {
                ro = new $window.ResizeObserver(function() {
                    getMonacoEditor()
                        .then(function(editor) {
                            editor.layout();
                        });
                });
                ro.observe(containerElement);
            });
        $scope.$watch('vm.ngModelCtrl.$viewValue', function() {
            vm.ngModelCtrl.$render();
        }, true);
        vm.ngModelCtrl.$render = function() {
            if (vm.ngModelCtrl.$viewValue !== null) {
                if (!isEditorFocussed) {
                    getMonacoEditor()
                        .then(function(editor) {
                            editor.setValue(getSafeViewValue());
                            editor.trigger(vm.language || 'json', 'editor.action.formatDocument');
                        });
                }
            }
        };
    }

    function configureValidators() {
        if (vm.language === 'json' || !vm.language) {
            vm.ngModelCtrl.$validators.validJson = function(modelValue, viewValue) {
                var value = modelValue || viewValue;
                if (angular.isString(value) && value.trim().length > 0) {
                    try {
                        JSON.parse(value);
                    } catch (e) {
                        return false;
                    }
                }
                return true;
            };
        } else if (vm.language === 'xml') {
            vm.ngModelCtrl.$validators.validXml = function(modelValue, viewValue) {
                var value = modelValue || viewValue;
                if (angular.isString(value) && value.trim().length > 0) {
                    try {
                        var oParser = new DOMParser();
                        var oDOM = oParser.parseFromString(value, 'text/xml');
                        if (isParseError(oDOM)) {
                            return false;
                        }
                    } catch (e) {
                        return false;
                    }
                }
                return true;
            };
        }
    }

    function isParseError(parsedDocument) {
        // parser and parsererrorNS could be cached on startup for efficiency
        var parser = new DOMParser(),
            errorneousParse = parser.parseFromString('<', 'text/xml'),
            parsererrorNS = errorneousParse.getElementsByTagName('parsererror')[0].namespaceURI;

        if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
            // In PhantomJS the parseerror element doesn't seem to have a special namespace, so we are just guessing here :(
            return parsedDocument.getElementsByTagName('parsererror').length > 0;
        }

        return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
    }

    function getSafeViewValue() {
        var initValue = vm.ngModelCtrl.$viewValue;
        if (Number.isNaN(initValue) || initValue === 'null') {
            return '';
        }
        if (!angular.isString(initValue) && initValue !== undefined && initValue !== null) {
            initValue = JSON.stringify(initValue, null, 2);
        } else if (angular.isString(initValue) && (vm.language || 'json') === 'json') {
            try {
                initValue = JSON.stringify(JSON.parse(initValue), null, 2);
            } catch (e) {
                /* incase it's bad json just ignore the error */
            }
        }
        return initValue || '';
    }

    function getMonacoEditor() {
        return $q.when(editor);
    }

    function buildMonaco() {
        editor = $q(function(resolve) {
            $window.require(['vs/editor/editor.main'], function() {
                var initValue = getSafeViewValue();
                editor = $window.monaco.editor.create(containerElement, {
                    value: initValue,
                    lineNumbers: false,
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    minimap: {enabled: false},
                    renderLineHighlight: 'none',
                    contextmenu: false,
                    automaticLayout: false,
                    links: false,
                    wordWrap: 'on',
                    formatOnType: true,
                    formatOnPaste: true,
                    folding: true,
                    readOnly: (vm.readonly === 'readonly') || (vm.disabled === 'disabled'),
                    language: vm.language || 'json',
                    suggestOnTriggerCharacters: false
                });

                editor.trigger('json', 'editor.action.formatDocument');
                editor.onDidBlurEditorText(function () {
                    isEditorFocussed = false;
                    getMonacoEditor()
                        .then(function(editor) {
                            vm.ngModelCtrl.$setViewValue(editor.getValue(), 'blur');
                        });
                });

                $window.monaco.languages.registerCompletionItemProvider(vm.language || 'json', {
                    provideCompletionItems: function (model, position) {
                        return [];
                    }
                });

                editor.onDidFocusEditorText(function () {
                    isEditorFocussed = true;
                });

                editor.onDidChangeModelContent(function() {
                    if (isEditorFocussed) {
                        getMonacoEditor()
                            .then(function(editor) {
                                vm.ngModelCtrl.$setViewValue(editor.getValue(), 'keyup');
                                vm.ngModelCtrl.$validate();
                            });
                    }
                });

                configureValidators();

                resolve(editor);
            });
        });
        return editor;
    }

    function onDestroy() {
        if (ro) {
            ro.disconnect();
        }
        getMonacoEditor()
            .then(function(editor) {
                editor.dispose();
            });
    }

}

})();

},{}],8:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .directive('extractFieldRow', ExtractFieldRow);

ExtractFieldRow.$inject = [];

function ExtractFieldRow() {
    var directive = {
        restrict: 'EA',
        require: ['extractFieldRow', '^fieldBundleTable'],
        bindToController: {
            mapping: '=',
            onDeletedMapping: '&',
            onFieldMappingChange: '&',
            bundle: '='
        },
        replace: true,
        scope: {},
        templateUrl: 'extract/extractFieldRow.tpl.html',
        controllerAs: 'vm',
        controller: ExtractFieldRowController,
        link: function(scope, element, attrs, controllers) {
            var extractFieldRowController = controllers[0];
            var fieldBundleTableController = controllers[1];
            extractFieldRowController.setParentController(fieldBundleTableController);
        }
    };
    return directive;
}

ExtractFieldRowController.$inject = ['mappingService', '$timeout', '$element', '$scope'];

function ExtractFieldRowController(mappingService, $timeout, $element, $scope) {
    this.ns = fileNsPrefix();
    this.editing = false;
    this.parentController = null;
    this.showDefaultValue = false;
    this.extractJsonPathKey = this.ns + 'InterfaceFieldAPIName__c';
    this.jsonOutputPathKey = this.ns + 'DomainObjectFieldAPIName__c';
    this.isDisabledKey = this.ns + 'IsDisabled__c';
    this.defaultValueKey = this.ns + 'DefaultValue__c';
    this.fieldValueType = this.ns + 'DomainObjectFieldType__c';
    this.transformValuesMapKey = this.ns + 'TransformValuesMap__c';
    this.mapIdKey = this.ns + 'MapId__c';
    this.objectType = this.ns + 'DRMapItem__c';

    this.$onInit = onInit;
    this.deleteMapping = deleteMapping;
    this.editRow = editRow;
    this.stopEdit = stopEdit;
    this.onFieldChange = onFieldChange;
    this.setParentController = setParentController;

    //////////
    var vm = this,
        defaultValueKey = vm.ns + 'DefaultValue__c';

    function onInit() {
        vm.editing = !vm.mapping.Id;
        vm.showDefaultValue = !!vm.mapping[defaultValueKey];
        vm.isDisabled = vm.mapping[vm.isDisabledKey];
        $scope.$on('add-new-mapping', function(event, mapping) {
            vm.editing = mapping === vm.mapping;
        });
    }

    function setParentController(parentController) {
        vm.parentController = parentController;
    }

    function deleteMapping($event) {
        if ($event) {
            $event.stopPropagation();
        }

        mappingService.deleteMapping(vm.mapping)
            .then(function(doDelete) {
                if (doDelete) {
                    vm.onDeletedMapping({
                        mapping: vm.mapping
                    });
                }
            });
    }

    function stopEdit() {
        $timeout(function() {
            vm.editing = false;
        });
    }

    function editRow(skipEvent) {
        vm.editing = true;
        if (!vm.mapping[vm.extractJsonPathKey]) {
            $timeout(function() {
                $('input', $element).get(0).focus();
            });
        }
        if (!skipEvent) {
            vm.parentController.broadcastExpandMappingEvent(vm.mapping);
        }
    }

    function onFieldChange(fieldName) {
        switch (fieldName) {
            case vm.isDisabledKey: vm.isDisabled = vm.mapping[vm.isDisabledKey];
                /* fall through */
            case vm.fieldValueType: //fall through
            case vm.defaultValueKey: //fall through
            case vm.jsonOutputPathKey: vm.onFieldMappingChange();
                break;
            default: // do nothing
        }
        mappingService.saveMapping(vm.mapping);
    }
}

})();

},{}],9:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .directive('extractFieldsTab', ExtractFieldsTab);

function ExtractFieldsTab() {
    return {
        restrict: 'EA',
        bindToController: {
            bundle: '='
        },
        scope: {},
        templateUrl: 'extract/extractFieldsTab.tpl.html',
        controllerAs: 'vm',
        controller: ExtractFieldsTabController
    };
}

ExtractFieldsTabController.$inject = ['mappingService', 'remoteActions', '_', 'vkbeautify', '$scope'];

function ExtractFieldsTabController(mappingService, remoteActions, _, vkbeautify, $scope) {
    this.ns = fileNsPrefix();
    this.fieldMappings = [];
    this.extractionStepOutput = null;
    this.showAllExtractFields = false;
    this.bundleInputTypeKey = this.ns + 'InputType__c';
    this.bundleOutputTypeKey = this.ns + 'OutputType__c';
    this.bundleTargetOutJsonKey = this.ns + 'TargetOutJson__c';
    this.bundleTargetOutXmlKey = this.ns + 'TargetOutXml__c';
    this.bundleTargetOutCustomKey = this.ns + 'TargetOutCustom__c';
    this.currentSection = 'current';
    this.sidebarOpen = true;

    this.makeCurrentOutputData = makeCurrentOutputData;
    this.makeExtractStepOutput = makeExtractStepOutput;
    this.isJsonOutput = isJsonOutput;
    this.isXmlOutput = isXmlOutput;
    this.isCustomOutput = isCustomOutput;
    this.isPdfOutput = isPdfOutput;
    this.isDocusignOutput = isDocusignOutput;
    this.isDocumentOutput = isDocumentOutput;
    this.handleFieldMappingChange = handleFieldMappingChange;
    this.saveBundle = saveBundle;
    this.expectedOutputChanged = expectedOutputChanged;
    this.toggleAccordian = toggleAccordian;
    this.$onInit = onInit;

    //////////

    $scope.$watch('vm.showAllExtractFields', makeExtractStepOutput);
    $scope.$on('drbundle-mappings-updated', makeCurrentOutputData);

    var vm = this,
        jsonOutputPath = vm.ns + 'DomainObjectFieldAPIName__c',
        creationOrderKey = vm.ns + 'DomainObjectCreationOrder__c',
        fieldValueTypeKey = vm.ns + 'DomainObjectFieldType__c',
        defaultValueKey = vm.ns + 'DefaultValue__c',
        apiNameKey = vm.ns + 'DomainObjectAPIName__c';

    function onInit() {
        if (vm.bundle.$$mappings) {
            makeExtractStepOutput();
            makeCurrentOutputData();
        }
    }

    function makeExtractStepOutput() {
        mappingService.getExtractionJson(vm.bundle.$$mappings, vm.showAllExtractFields)
            .then(function(obj) {
                vm.extractionStepOutput = obj;
            });
    }

    function isJsonOutput() {
        return mappingService.isJsonOutput(vm.bundle);
    }

    function isXmlOutput() {
        return mappingService.isXmlOutput(vm.bundle);
    }

    function isCustomOutput() {
        return mappingService.isCustomOutput(vm.bundle);
    }

    function isPdfOutput() {
        return mappingService.isPdfOutput(vm.bundle);
    }

    function isDocusignOutput() {
        return mappingService.isDocusignOutput(vm.bundle);
    }

    function isDocumentOutput() {
        return mappingService.isDocumentOutput(vm.bundle);
    }

    function handleFieldMappingChange() {
        vm.makeCurrentOutputData();
    }

    function makeCurrentOutputData() {
        var jsonObject = {};
        vm.bundle.$$mappings.forEach(function (mapping) {
            if (mapping[creationOrderKey] !== 0 && mapping[apiNameKey] !== 'Formula' && mapping[jsonOutputPath]) { 
                var displayValue = getDisplayValue(mapping[defaultValueKey], mapping[fieldValueTypeKey]);

                var jsonOutputPathStr = mapping[jsonOutputPath];

                if (jsonOutputPathStr.includes('.')) {
                    var str = jsonOutputPathStr.split(':').map(function(value) {
                        if (value.includes('.')) {
                            value = '[\'' + value + '\']';
                        }

                        return value; 
                    });
                    jsonOutputPathStr = str.join(':');
                }

                _.set(jsonObject, jsonOutputPathStr.replace(/:/g, '.'), displayValue);
            }
        });
        if (isXmlOutput()) {
            remoteActions.JsonToXml(JSON.stringify(jsonObject))
                .then(function(xml) {
                    vm.currentOutputData = vkbeautify.xml(xml);
                });
        } else if (isCustomOutput()) {
            remoteActions.CallCustomSerializeMethod(vm.bundle[vm.ns + 'CustomOutputClass__c'], JSON.stringify(jsonObject))
                    .then(function(response) {
                        if (response && typeof(response) === 'string') {
                            vm.currentOutputData = response;
                        }
                    });
        } else {
            vm.currentOutputData = jsonObject;
        }
    }

    function getDisplayValue(defaultValue, fieldValueType) {
        switch (fieldValueType) {
            case 'Boolean': return true;

            case 'Double':  // fall through
            case 'Integer': return !isNaN(defaultValue) ? parseFloat(defaultValue) : 1;

            case 'JSON': return '{}';

            case 'List<Decimal>': //fall through
            case 'List<Double>': //fall through
            case 'List<Integer>': return [(!isNaN(defaultValue) ? parseFloat(defaultValue) : 1)];

            case 'List<String>': return ['Text'];

            case 'List<Map>': return [{}];

            case 'Object': return {};

            case 'Multi-Select': return 'A;B;C';

            default: return 'Text';
        }
    }

    function expectedOutputChanged() {
        saveBundle();
    }

    function saveBundle() {
        mappingService.saveBundle(vm.bundle);
    }

    function toggleAccordian(openIfClosed, openIfOpen) {
        if (vm.currentSection === openIfClosed) {
            vm.currentSection = openIfOpen;
        } else {
            vm.currentSection = openIfClosed;
        }
    }
}

})();

},{}],10:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .directive('extractObjectFilter', ExtractObjectFilter);

ExtractObjectFilter.$inject = [];

function ExtractObjectFilter() {
    var directive = {
        restrict: 'EA',
        require: ['extractObjectFilter', '^extractObjectRow'],
        bindToController: {
            mapping: '=',
            onMappingDeleted: '&',
            isFirst: '=',
            bundle: '='
        },
        replace: true,
        scope: {},
        templateUrl: 'extract/extractObjectFilter.tpl.html',
        controllerAs: 'vm',
        controller: ExtractObjectFilterController,
        link: function(scope, element, attrs, controllers) {
            var extractObjectFilterController = controllers[0];
            var extractObjectController = controllers[1];
            extractObjectFilterController.setParentController(extractObjectController);
        }
    };
    return directive;
}

ExtractObjectFilterController.$inject = ['mappingService'];

function ExtractObjectFilterController(mappingService) {
    this.ns = fileNsPrefix();
    this.deleting = false;
    this.parentController = null;
    this.menuItems = [];
    this.filterFieldKey = this.ns + 'InterfaceFieldAPIName__c';
    this.filterOperatorKey = this.ns + 'FilterOperator__c';
    this.filterValueKey = this.ns + 'FilterValue__c';
    this.objectType = this.ns + 'DRMapItem__c';

    this.setParentController = setParentController;
    this.$onInit = onInit;
    this.onFieldChange = onFieldChange;
    this.isLimit = isLimit;
    this.isOrderBy = isOrderBy;
    this.isOffset = isOffset;
    this.getFilterLabel = getFilterLabel;

    /////////////////////
    var vm = this;

    function onInit() {
        vm.menuItems = getMenuItems();
    }

    function setParentController(parentController) {
        vm.parentController = parentController;
    }

    function onFieldChange() {
        mappingService.saveMapping(vm.mapping);
    }

    function isLimit() {
        return vm.mapping[vm.filterOperatorKey] === 'LIMIT';
    }

    function isOffset() {
        return vm.mapping[vm.filterOperatorKey] === 'OFFSET';
    }

    function isOrderBy() {
        return vm.mapping[vm.filterOperatorKey] === 'ORDER BY';
    }

    function getFilterLabel() {
        if (vm.isFirst) {
            return vm.parentController.fieldMetadata[vm.filterFieldKey].label;
        }
        return '&nbsp;';
    }

    function deleteMapping() {
        vm.deleting = true;
        mappingService.deleteMapping(vm.mapping, true)
            .then(function(doDelete) {
                vm.deleting = false;
                if (doDelete) {
                    if (vm.onMappingDeleted) {
                        vm.onMappingDeleted({
                            mapping: vm.mapping
                        });
                    }
                }
            })
            .catch(function() {
                vm.deleting = false;
            });
    }

    function getMenuItems() {
        return [{
            text: 'AND',
            click: function() {
                vm.parentController.addAndMapping(vm.mapping);
            },
            hide: function() {
                return (isLimit() || isOrderBy() || isOffset());
            }
        },{
            text: 'OR',
            click: function() {
                vm.parentController.addOrMapping(vm.mapping);
            },
            hide: function() {
                return (isLimit() || isOrderBy() || isOffset());
            }
        }, {
            text: 'LIMIT',
            click: function() {
                vm.parentController.addLimit();
            },
            hide: function() {
                return vm.parentController.hasLimit();
            }
        }, {
            text: 'OFFSET',
            click: function() {
                vm.parentController.addOffset();
            },
            hide: function() {
                return vm.parentController.hasOffset();
            }
        }, {
            text: 'ORDER BY',
            click: function() {
                vm.parentController.addOrderBy();
            },
            hide: function() {
                return vm.parentController.hasOrderBy();
            }
        }, {
            divider: true,
            text: '',
            hide: function() {
                return (isLimit() || isOrderBy() || isOffset()) &&
                        vm.parentController.hasLimit() && vm.parentController.hasOrderBy() &&
                        vm.parentController.hasOffset();
            }
        }, {
            text: 'Delete Filter',
            click: deleteMapping
        }];
    }

}

})();

},{}],11:[function(require,module,exports){
(function() {
'use strict';

function selectTemplate ($element, $attrs) {
    return $attrs.turbo?'turboExtract/turboExtractObjectRow.tpl.html':'extract/extractObjectRow.tpl.html';
}

angular.module('drmapper')
    .directive('extractObjectRow', ExtractObjectRow);

ExtractObjectRow.$inject = [];

function ExtractObjectRow() {
    var directive = {
        restrict: 'EA',
        bindToController: {
            mappings: '=',
            onMappingDeleted: '&',
            onMappingAdded: '&',
            sobjects: '<',
            bundle: '=',
            order: '=',
            turbo: '=?'
        },
        replace: true,
        scope: {},
        templateUrl: selectTemplate,
        controllerAs: 'vm',
        controller: ExtractObjectRowController
    };
    return directive;
}

ExtractObjectRowController.$inject = ['$rootScope', 'fieldMetadata', 'sObjectFields', '$filter',
                                    'generateUniqueMapId', '$scope',
                                    'mappingService', '$sldsToast', '_', '$sldsPrompt'];

function ExtractObjectRowController($rootScope, fieldMetadata, sObjectFields, $filter,
                                 generateUniqueMapId, $scope, mappingService, $sldsToast, _, $sldsPrompt) {
    var vm = this;
    this.ns = fileNsPrefix();
    this.filterOperators = [
        '=', '<>', '<', '>', '<=', '>=',
        'LIKE', 'NOT LIKE', 'INCLUDES', 'EXCLUDES'
    ];
    this.fieldMetadata = angular.copy(fieldMetadata.DRMapItem);

    this.editMappingInterfaceObjectName = editMappingInterfaceObjectName;
    this.addAndMapping = addAndMapping;
    this.addOrMapping = addOrMapping;
    this.addLimit = addLimit;
    this.addOffset = addOffset;
    this.addOrderBy = addOrderBy;
    this.hasLimit = hasLimit;
    this.hasOffset = hasOffset;
    this.hasOrderBy = hasOrderBy;
    this.deleteMapping = deleteMapping;
    this.onFilterDeleted = onFilterDeleted;
    this.showAndLabel = showAndLabel;
    this.showOrLabel = showOrLabel;
    this.$onInit = onInit;
    this.$onChanges = onChanges;
    this.onObjectNameChange = onObjectNameChange;
    this.clearTurboFields = null;
    this.onExtractObjectPathChange = onExtractObjectPathChange;
    this.objectNameSet = false;

    //////////

    var ns              = fileNsPrefix(),
        orderByKey      = ns + 'InterfaceObjectLookupOrder__c',
        objectNameKey   = ns + 'InterfaceObjectName__c',
        filterFieldKey  = ns + 'InterfaceFieldAPIName__c',
        outputPathKey   = ns + 'DomainObjectFieldAPIName__c',
        extractObjectPathKey = ns + 'DomainObjectFieldAPIName__c',
        filterOperatorKey = ns + 'FilterOperator__c',
        filterGroupKey = ns + 'FilterGroup__c',
        filterValueKey  = ns + 'FilterValue__c',
        orderBy = $filter('orderBy');

    function onInit() {
        vm.sObjects = orderBy(vm.sobjects, '+label');
        // setup fieldMetaData customizations
        $rootScope.vlocity.getCustomLabels('DRMapperExtractJSONOutputPath', 'DRMapperFilter')
            .then(function(labels) {
                vm.fieldMetadata[outputPathKey].label = labels[0];
                vm.fieldMetadata[filterFieldKey].label = labels[1];
            });
        vm.fieldMetadata[filterFieldKey].type = 'PICKLIST';
        vm.fieldMetadata[filterFieldKey].restricted = false;
        vm.fieldMetadata[filterFieldKey].picklistValues = null;
        vm.fieldMetadata[filterOperatorKey].label = '&nbsp;';
        vm.fieldMetadata[filterOperatorKey].type = 'PICKLIST';
        vm.fieldMetadata[filterOperatorKey].restricted = false;
        vm.fieldMetadata[filterValueKey].label = '&nbsp;';

        vm.objectName = vm.mappings[0][objectNameKey];
        setReadableObjectName();
        vm.extractObjectPath = vm.mappings[0][extractObjectPathKey];
        if (!vm.objectName) {
            editMappingInterfaceObjectName(true);
        }

        vm.mappings.sort(sortMappings);

        loadFieldNamesForObject();

        if(vm.turbo){
            this.filterOperators.push('IN');
        }

        vm.fieldMetadata[filterOperatorKey].picklistValues = vm.filterOperators.map(function(value) {
            return {
                value: value,
                label: value
            };
        });
    
    }

    function onChanges(){
        setReadableObjectName();
    }

    function editMappingInterfaceObjectName(lock) {
        if (vm.turbo && vm.objectName){
            var warnPrompt = $sldsPrompt({
                title: 'Warning',
                content: 'Changing the object type will delete all selected fields, do you want to continue?',
                show:true,
                buttons: [
                    {
                        label: 'cancel',
                        type: 'neutral',
                        action: function(){
                            warnPrompt.hide();
                        }
                    },
                    {
                        label: 'ok',
                        type: 'destructive',
                        action: function(){
                            vm.editing = lock;
                            warnPrompt.hide();
                        }
                    }
                ]
            })
        }else {
            vm.editing = lock;
        }
    }

    function addChildMapping(cloneMapping) {
        var newMapping = JSON.parse(angular.toJson(cloneMapping));
        newMapping.Id = undefined;
        newMapping[vm.ns + 'MapId__c'] = generateUniqueMapId(vm.bundle);
        newMapping[filterOperatorKey] = '=';
        newMapping[filterValueKey] = undefined;
        newMapping[filterFieldKey] = undefined;
        return newMapping;
    }

    function deleteMapping() {
        return mappingService.deleteMappings(vm.mappings, vm.objectName)
            .then(function(doDelete) {
                if (doDelete) {
                    vm.mappings.forEach(function(mapping) {
                        vm.onMappingDeleted({
                            mapping: mapping
                        });
                    });
                }
            });
    }

    function onFilterDeleted(mapping, index) {
        if (vm.mappings.length === 1) {
            // if we deleted the last mapping then replace it with a new empty one.
            addAndMapping(mapping);
        }
        vm.mappings.splice(index, 1);
        vm.mappings.sort(sortMappings);
        vm.onMappingDeleted({
            mapping: mapping
        });
    }

    function onObjectNameChange() {
        var objectName = vm.objectName;
        setReadableObjectName();
        vm.mappings.forEach(function(mapping) {
            mapping[objectNameKey] = objectName;
            mappingService.saveMapping(mapping);
        });
        loadFieldNamesForObject();
        if (this.turbo && this.objectNameSet && typeof this.clearTurboFields === 'function'){
            console.log('ExtractObjectRowController.onObjectNameChange: objectName has previously been set('+this.objectNameSet+'), and clearTurboFields is defined as a function. Executing clearTurboFields');
            this.clearTurboFields();
        }

        this.objectNameSet = true;
    }

    function setReadableObjectName() {
        var sObject = _.find(vm.sobjects, { name: vm.objectName });
        vm.readableObjectName = sObject ? sObject.label : '';
    }

    function onExtractObjectPathChange() {
        var extractObjectPath = vm.extractObjectPath;
        vm.mappings.forEach(function(mapping) {
            mapping[extractObjectPathKey] = extractObjectPath;
            mappingService.saveMapping(mapping);
        });
    }

    function loadFieldNamesForObject() {
        var objectName = vm.objectName;
        if (!objectName) {
            vm.editing = true;
            return;
        }
        vm.loadingFields = true;
        sObjectFields.getFieldNamesForObject(objectName)
            .then(function(fields) {
                vm.loadingFields = false;
                vm.fieldMetadata[filterFieldKey].picklistValues = fields;
            }).catch(function(error) {
                vm.loadingFields = false;
                $sldsToast({
                    title: 'Failed to load fields for ' + objectName,
                    content: error.message,
                    severity: 'error',
                    autohide: false
                });
            });
    }

    function addAndMapping(afterThisMapping) {
        var newMapping = addChildMapping(afterThisMapping);
        var indexOfExisting = vm.mappings.indexOf(afterThisMapping);
        vm.mappings.splice(indexOfExisting + 1, 0, newMapping);
        saveMapping(newMapping);
    }

    function addOrMapping(afterThisMapping) {
        var newMapping = addChildMapping(afterThisMapping);
        newMapping[filterGroupKey] = afterThisMapping[filterGroupKey] + 1;
        var indexOfExisting = vm.mappings.indexOf(afterThisMapping);
        vm.mappings.splice(indexOfExisting + 1, 0, newMapping);
        saveMapping(newMapping);
    }

    function addLimit() {
        if (hasLimit()) {
            return;
        }
        var newMapping = addChildMapping(vm.mappings[0]);
        newMapping[filterFieldKey] = null;
        newMapping[filterOperatorKey] = 'LIMIT';
        // LIMIT is always last
        vm.mappings.push(newMapping);
        vm.mappings.sort(sortMappings);
        saveMapping(newMapping);
    }

    function addOffset() {
        if (hasOffset()) {
            return;
        }
        var newMapping = addChildMapping(vm.mappings[0]);
        newMapping[filterFieldKey] = null;
        newMapping[filterOperatorKey] = 'OFFSET';
        // OFFSET is always last
        vm.mappings.push(newMapping);
        vm.mappings.sort(sortMappings);
        saveMapping(newMapping);
    }

    function addOrderBy() {
        if (hasOrderBy()) {
            return;
        }
        var newMapping = addChildMapping(vm.mappings[0]);
        newMapping[filterFieldKey] = null;
        newMapping[filterOperatorKey] = 'ORDER BY';
        vm.mappings.push(newMapping);
        vm.mappings.sort(sortMappings);
        saveMapping(newMapping);
    }

    function saveMapping(mapping) {
        mappingService.saveMapping(mapping)
            .then(function() {
                vm.onMappingAdded({
                    mapping: mapping
                });
            });
    }

    function hasLimit() {
        if (hasOffset()) {
            return vm.mappings.length > 1 &&
                    isLimit(vm.mappings[vm.mappings.length - 2]);
        }
        return isLimit(vm.mappings[vm.mappings.length - 1]);
    }

    function hasOffset() {
        return isOffset(vm.mappings[vm.mappings.length - 1]);
    }

    function hasOrderBy() {
        if (hasLimit() && hasOffset()) {
            return vm.mappings.length > 2 &&
                    isOrderBy(vm.mappings[vm.mappings.length - 3]);
        }
        if (hasLimit() || hasOffset()) {
            return vm.mappings.length > 1 &&
                    isOrderBy(vm.mappings[vm.mappings.length - 2]);
        }
        return isOrderBy(vm.mappings[vm.mappings.length - 1]);
    }

    function isLimit(mapping) {
        return mapping[filterOperatorKey] === 'LIMIT';
    }

    function isOffset(mapping) {
        return mapping[filterOperatorKey] === 'OFFSET';
    }

    function isOrderBy(mapping) {
        return mapping[filterOperatorKey] === 'ORDER BY';
    }

    function showAndLabel(mapping, previousMapping) {
        return !isLimit(mapping) && !isOrderBy(mapping) && !isOffset(mapping) && previousMapping &&
                mapping[filterGroupKey] === previousMapping[filterGroupKey];
    }

    function showOrLabel(mapping, previousMapping) {
        return !isLimit(mapping) && !isOrderBy(mapping) && !isOffset(mapping) && previousMapping &&
                mapping[filterGroupKey] > previousMapping[filterGroupKey];
    }

    function sortMappings(mappingA, mappingB) {
        if (mappingA[filterGroupKey] == null) {
            mappingA[filterGroupKey] = 0;
        }
        if (mappingB[filterGroupKey] == null) {
            mappingB[filterGroupKey] = 0;
        }
        if (isOffset(mappingA)) {
            return 1;
        }
        if (isOffset(mappingB)) {
            return -1;
        }
        if (isLimit(mappingA)) {
            return 1;
        }
        if (isLimit(mappingB)) {
            return -1;
        }
        if (isOrderBy(mappingA)) {
            return 1;
        }
        if (isOrderBy(mappingB)) {
            return -1;
        }
        return mappingA[filterGroupKey] - mappingB[filterGroupKey];
    }

    $scope.$watch('vm.order', function(newValue) {
        vm.mappings.forEach(function(mapping) {
            mapping[orderByKey] = newValue;
            mappingService.saveMapping(mapping);
        });
    });
}

})();

},{}],12:[function(require,module,exports){
(function() {
'use strict';

function selectTemplate ($element, $attrs) {
    return $attrs.turbo?'turboExtract/turboExtractObjectTab.tpl.html':'extract/extractObjectTab.tpl.html';
}

angular.module('drmapper')
    .directive('extractObjectTab', ExtractObjectTab);

function ExtractObjectTab() {
    return {
        restrict: 'EA',
        bindToController: {
            bundle: '=',
            turbo: '=?'
        },
        scope: {},
        templateUrl: selectTemplate,
        controllerAs: 'vm',
        controller: ExtractObjectTabController
    };
}

ExtractObjectTabController.$inject = ['$timeout',  'sObjectFields', '$scope', 'mappingService',
                                        '$element', 'generateUniqueMapId', 'sObjects', '_'];

function ExtractObjectTabController($timeout, sObjectFields, $scope, mappingService,
                                        $element, generateUniqueMapId, sObjects, _) {
    this.ns = fileNsPrefix();
    this.showAllExtractJsonFields = false;
    this.extractionStepJson = {};
    this.extractObjectMappings = [];
    this.sidebarOpen = true;

    this.$onInit = onInit;
    this.onDrop = onDrop;
    this.onMappingDeleted = onMappingDeleted;
    this.onMappingAdded = onMappingAdded;
    this.addMapping = addMapping;
    this.onInputJsonChange = onInputJsonChange;

    //////////

    var vm = this,
        mapIdKey = vm.ns + 'MapId__c',
        orderByKey = vm.ns + 'InterfaceObjectLookupOrder__c',
        objectNameKey = vm.ns + 'InterfaceObjectName__c',
        outputPathKey = vm.ns + 'DomainObjectFieldAPIName__c',
        creationOrderKey = vm.ns + 'DomainObjectCreationOrder__c',
        apiNameKey = vm.ns + 'DomainObjectAPIName__c',
        filterOperatorKey = vm.ns + 'FilterOperator__c',
        filterGroupKey = vm.ns + 'FilterGroup__c';

    function onInit() {
        if (vm.bundle.$$mappings) {
            sObjects.getAllObjects().then(function (sObjects) {
                vm.sObjects = sObjects;
            });
            var mappings = vm.bundle.$$mappings.filter(function(mapping) {
                return mapping[apiNameKey] !== 'Formula' &&
                        mapping[creationOrderKey] === 0;
            });
            vm.extractObjectMappings = mappings.reduce(function(array, mapping) {
                var index = mapping[orderByKey] - 1;
                if (!array[index]) {
                    array[index] = [];
                }
                array[index].push(mapping);
                return array;
            }, []);
            updateOrderByKeys();
        } 
        if (vm.turbo && !vm.extractObjectMappings.length) {
            this.addMapping();
        }
    }

    function onDrop(event, index, mappings) {
        var startIndex = mappings[0][orderByKey] - 1;
        mappings = vm.extractObjectMappings.splice(startIndex, 1)[0];
        vm.extractObjectMappings.splice(index, 0, mappings);
        updateOrderByKeys();
    }

    function onMappingDeleted(mapping, index) {
        var mappings = vm.extractObjectMappings[index];
        vm.extractObjectMappings[index] = mappings.filter(function(existingMapping) {
            return (existingMapping[mapIdKey] !== mapping[mapIdKey]);
        });
        var removedMappingKey = mapping[mapIdKey];
        vm.bundle.$$mappings = vm.bundle.$$mappings.filter(function(mapping) {
            return mapping[mapIdKey] !== removedMappingKey;
        });
        updateOrderByKeys();
    }

    function onMappingAdded(mapping) {
        vm.bundle.$$mappings.push(mapping);
    }

    function updateOrderByKeys() {
        vm.extractObjectMappings = vm.extractObjectMappings.filter(function(mappings) {
            return (!_.isNil(mappings) && !_.isEmpty(mappings));
        });
        vm.extractObjectMappings.forEach(function(mappings, i) {
            mappings.forEach(function(mapping) {
                mapping[orderByKey] = i + 1;
            });
        });
    }

    function addMapping() {
        var mapping = {
            Name: vm.bundle.Name
        };
        mapping[mapIdKey] = generateUniqueMapId();
        mapping[filterOperatorKey] = '=';
        mapping[apiNameKey] = vm.bundle[vm.ns + 'Type__c'] == 'Turbo Extract' ? 'Turbo Extract' : 'json';
        mapping[creationOrderKey] = 0;
        mapping[filterGroupKey] = 0;
        mapping[orderByKey] = vm.extractObjectMappings.length + 1;
        vm.extractObjectMappings.push([mapping]);
        vm.bundle.$$mappings.push(mapping);
        $timeout(function() {
        $('.drmapper_extractObjectRow:last-child .drmapper_extractObjectRow_objectNameWrapper input', $element).focus();
            if (vm.extractObjectMappings.length === 1) {
                // try force FF to redraw properly in LEX.
                window.scrollTo(0, 10);
                setTimeout(function() {
                    window.scrollTo(0,document.body.scrollHeight);
                });
            }
        });
    }

    // when a InterfaceObjectName__c changes we need to get all the fields
    $scope.$watchCollection(function() {
        var hashMap = vm.extractObjectMappings.reduce(function(obj, mappings) {
            var objectName = mappings[0][objectNameKey];
            if (objectName && !obj[objectName]) {
                obj[objectName] = true;
            }
            return obj;
        }, {});
        return Object.keys(hashMap);
    }, function getFieldNames(newObjectNames) {
        newObjectNames.forEach(function(objectName) {
            getFieldsNamesForObject(objectName);
            if (vm.showAllExtractJsonFields) {
                makeExtractJsonObject();
            }
        });
    });

    $scope.$watchCollection(function() {
        var hashMap = vm.extractObjectMappings.reduce(function(obj, mappings) {
            var outputKeyName = mappings[0][outputPathKey];
            if (!obj[outputKeyName]) {
                obj[outputKeyName] = true;
            }
            return obj;
        }, {});
        return Object.keys(hashMap);
    }, makeExtractJsonObject);
    $scope.$watch('vm.showAllExtractJsonFields', makeExtractJsonObject);

    function getFieldsNamesForObject(objectName) {
        return sObjectFields.getFieldNamesForObject(objectName);
    }

    function makeExtractJsonObject() {
        return mappingService.getExtractionJson(vm.bundle.$$mappings, vm.showAllExtractJsonFields)
            .then(function(obj) {
                vm.extractionStepJson = obj;
            });
    }

    function onInputJsonChange() {
        return mappingService.saveBundle(vm.bundle);
    }
}

})();

},{}],13:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .directive('extractOptionsTab', ExtractOptionsTab);

function ExtractOptionsTab() {
    var directive = {
        restrict: 'EA',
        bindToController: {
            bundle: '='
        },
        scope: {},
        templateUrl: 'extract/extractOptionsTab.tpl.html',
        controllerAs: 'vm',
        controller: ExtractOptionsTabController
    };
    return directive;
}

ExtractOptionsTabController.$inject = ['fieldMetadata', 'remoteActions', '_', 'mappingService'];

function ExtractOptionsTabController(fieldMetadata, remoteActions, _, mappingService) {
    this.ns = fileNsPrefix();
    this.fieldMetadata = fieldMetadata.DRBundle;
    this.checkFieldLevelSecurityKey = this.ns + 'CheckFieldLevelSecurity__c';
    this.useTranslationsKey = this.ns + 'UseTranslations__c';
    this.overwriteNullValuesKey = this.ns + 'OverwriteAllNullValues__c';
    this.xmlRemoveDeclarationKey = this.ns + 'XmlRemoveDeclaration__c';
    this.bundleTypeKey = this.ns + 'Type__c';
    this.timeToLiveMinutes = this.ns + 'TimeToLiveMinutes__c';
    this.platformCacheType = this.ns + 'SalesforcePlatformCacheType__c';
    this.objectType = 'DRBundle__c';

    this.onFieldChange = onFieldChange;

    ////////////////////////////

    var vm = this;

    function onFieldChange() {
        mappingService.saveBundle(vm.bundle);
    }
}

})();

},{}],14:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .directive('extractTabs', ExtractTabs);

ExtractTabs.$inject = [];

function ExtractTabs() {
    return {
        restrict: 'ACE',
        bindToController: {
            bundle: '='
        },
        scope: {},
        templateUrl: 'extract/extractTabs.tpl.html',
        controllerAs: 'vm',
        controller: ExtractTabsController
    };
}

ExtractTabsController.$inject = [];

function ExtractTabsController() {
    this.ns = fileNsPrefix();
    this.nsForUrl = this.ns.length === 0 ? '' : this.ns.replace('__', '/');
    this.activeTab = 0;
}

})();

},{}],15:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper.core')
    .directive('fieldBundleTable', FieldBundleTable);

function FieldBundleTable() {
    return {
        restrict: 'EA',
        require: [''],
        bindToController: {
            bundle: '=',
            loadObjectMappings: '=?',
            onFieldMappingChange: '&',
            mappingFilter: '&?',
            scopedToObject: '@?',
            creationOrder: '@?'
        },
        scope: {},
        templateUrl: 'fieldBundleTable.tpl.html',
        controllerAs: 'vm',
        controller: FieldBundleTableController
    };
}

FieldBundleTableController.$inject = ['generateUniqueMapId', '$timeout', 'mappingService', 'stickybits',
                                                    '$element', 'fieldMetadata', '$rootScope', '$scope'];

function FieldBundleTableController(generateUniqueMapId, $timeout, mappingService, stickybits,
                                                    $element, fieldMetadata, $rootScope, $scope) {
    this.ns = fileNsPrefix();
    this.fieldMappings = [];
    this.fieldMetadata = angular.copy(fieldMetadata.DRMapItem);
    this.inputLabel = '';
    this.outputLabel = '';
    this.extractJsonPathKey = this.ns + 'InterfaceFieldAPIName__c';
    this.jsonOutputPathKey = this.ns + 'DomainObjectFieldAPIName__c';

    this.onDeletedMapping = onDeletedMapping;
    this.addMapping = addMapping;
    this.refireHandleFieldMappingChange = refireHandleFieldMappingChange;
    this.broadcastExpandMappingEvent = broadcastExpandMappingEvent;
    this.$onInit = onInit;
    this.$onDestroy = onDestroy;
    this.isLoad = isLoad;
    this.disableAddMappingBtn = disableAddMappingBtn;

    //////////

    var vm = this,
        stickyHeader = null,
        extractJsonPathKey = vm.ns + 'InterfaceFieldAPIName__c',
        jsonOutputPath = vm.ns + 'DomainObjectFieldAPIName__c',
        creationOrderKey = vm.ns + 'DomainObjectCreationOrder__c',
        fieldValueTypeKey = vm.ns + 'DomainObjectFieldType__c',
        defaultValueKey = vm.ns + 'DefaultValue__c',
        apiNameKey = vm.ns + 'DomainObjectAPIName__c',
        bundleTargetOutJsonKey = vm.ns + 'TargetOutJson__c',
        bundleTargetOutCustomKey = vm.ns + 'TargetOutCustom__c',
        bundleTargetOutXmlKey = vm.ns + 'TargetOutXml__c',
        inputXmlKey = vm.ns + 'InputXml__c',
        inputJsonKey = vm.ns + 'InputJson__c',
        inputTypeKey = vm.ns + 'InputType__c',
        outputTypeKey = vm.ns + 'OutputType__c',
        mapIdKey = vm.ns + 'MapId__c',
        currentInputWatcher;

    function onInit() {
        setupFieldMappings();
        setupInputWatch();
        $scope.$watch('vm.bundle.' + bundleTargetOutJsonKey, function() {
            updateOutputPathPicklist();
        });
        $scope.$watch('vm.bundle.' + bundleTargetOutCustomKey, function() {
            updateOutputPathPicklist();
        });
        $scope.$watch('vm.bundle.' + bundleTargetOutXmlKey, function() {
            updateOutputPathPicklist();
        });
        $scope.$watch('vm.bundle.' + outputTypeKey, function() {
            updateOutputPathPicklist();
            updateOutputLabel();
        });
        $scope.$watchGroup(
            ['vm.bundle.' + vm.ns + 'TargetOutPdfDocName__c',
            'vm.bundle.' + vm.ns + 'TargetOutDocuSignTemplateId__c'],
            function() {
                updateOutputPathPicklist();
            });
        $scope.$watch('vm.bundle.' + inputTypeKey, function() {
            setupInputWatch();
            updateInputLabel();
        });
        $scope.$on('drbundle-mappings-updated', setupFieldMappings);
        setupFieldMetadataCustomizations();

        stickyHeader = stickybits(
            $('.drmapper--header-row', $element).get(0),
            {
                se: $element.get(0),
                useStickyClasses: true
            });
    }

    function setupFieldMappings() {
        if (vm.bundle.$$mappings) {
            var mappings = vm.bundle.$$mappings;
            vm.fieldMappings = mappings.filter(function(mapping) {
                var matchesBaseFilter = mapping[creationOrderKey] !== 0 &&
                        mapping[apiNameKey] !== 'Formula';
                if (matchesBaseFilter && vm.mappingFilter) {
                    return vm.mappingFilter({
                        mapping: mapping
                    });
                }
                return matchesBaseFilter;
            });
        }
    }

    function setupInputWatch() {
        if (currentInputWatcher) {
            currentInputWatcher();
        }
        switch (vm.bundle[inputTypeKey]) {
            case 'JSON':  currentInputWatcher = $scope.$watch('vm.bundle.' + inputJsonKey, function() {
                    updateExtractionPathPicklist();
                });
                break;
            case 'XML':   currentInputWatcher = $scope.$watch('vm.bundle.' + inputXmlKey, function() {
                    updateExtractionPathPicklist();
                });
                break;
        }
    }

    function onDestroy() {
        stickyHeader.cleanup();
    }

    function setupFieldMetadataCustomizations() {
        $rootScope.vlocity.getCustomLabels('DRMapperOutputDataType', 'DRMapperExtractJsonFieldPath',
                                             'DRMapperExtractXmlFieldPath', 'DRMapperInterfaceField',
                                             'DRMapperInputJsonPath','DRMapperInputXmlPath',
                                            'DRMapperTransformJsonOutputPath',
                                            'DRMapperTransformXmlOutputPath', 'DRMapperTransformPdfOutputPath',
                                            'DRMapperTransformCustomOutputPath',
                                            'DRMapperTransformDocusignOutputPath',
                                            'DRMapperTransformDocumentOutputPath')
            .then(function(labels) {
                vm.fieldMetadata[fieldValueTypeKey].label = labels[0];
                updateInputLabel();
                updateOutputLabel();
            });
        vm.fieldMetadata[extractJsonPathKey].type = 'PICKLIST';
        vm.fieldMetadata[jsonOutputPath].type = 'PICKLIST';
        updateExtractionPathPicklist();
        vm.fieldMetadata[fieldValueTypeKey].type = 'PICKLIST';
        vm.fieldMetadata[fieldValueTypeKey].picklistValues = [
            '','Boolean','Currency','CurrencyRounded','Date(MM/dd/yyyy)','Double','Integer','JSON',
            'List<Decimal>','List<Double>','List<Integer>','List<Map>',
            'List<String>','Multi-Select','Object','Number','Number(3)','String'
        ].map(function(name) {
            return {
                label: name,
                value: name
            };
        });
        vm.fieldMetadata[extractJsonPathKey].restricted = false;
        vm.fieldMetadata[jsonOutputPath].restricted = false;
        vm.fieldMetadata[fieldValueTypeKey].restricted = false;
        vm.fieldMetadata[defaultValueKey].type = 'STRING';
    }

    function updateExtractionPathPicklist() {
        mappingService.getInputMappings(vm.bundle)
            .then(function(fieldNames) {
                vm.fieldMetadata[extractJsonPathKey].picklistValues = fieldNames;
            });
    }

    function updateOutputPathPicklist() {
        mappingService.getOutputMappings(vm.bundle)
            .then(function(fieldNames) {
                vm.fieldMetadata[jsonOutputPath].picklistValues = fieldNames;
            });
    }

    function updateInputLabel() {
        var vlocity = $rootScope.vlocity, labelName,
            field = vm.fieldMetadata[extractJsonPathKey];
        if (isJsonInput()) {
            labelName = isTransform() || isLoad() ? 'DRMapperInputJsonPath' : 'DRMapperExtractJsonFieldPath';
        } else if (isXmlInput()) {
            labelName = isTransform() || isLoad() ? 'DRMapperInputXmlPath' : 'DRMapperExtractXmlFieldPath';
        } else if (isSObjectInput()) {
            labelName = 'DRMapperInterfaceField';
        } else if (isCustomInput()) {
            labelName = isTransform() || isLoad() ? 'DRMapperInputJsonPath' : 'DRMapperExtractJsonFieldPath';
        }

        if (labelName) {
            field.label = vm.inputLabel = vlocity.getCustomLabel(labelName);
        }
    }

    function updateOutputLabel() {
        var vlocity = $rootScope.vlocity,
            field = vm.fieldMetadata[jsonOutputPath];
        if (isJsonOutput() || isCustomOutput()) {
            field.label = vlocity.getCustomLabel('DRMapperTransformJsonOutputPath');
        } else if (isXmlOutput()) {
            field.label = vlocity.getCustomLabel('DRMapperTransformXmlOutputPath');
        } else if (isPdfOutput()) {
            field.label = vlocity.getCustomLabel('DRMapperTransformPdfOutputPath');
        } else if (isDocusignOutput()) {
            field.label = vlocity.getCustomLabel('DRMapperTransformDocusignOutputPath');
        } else if (isDocumentOutput()) {
            field.label = vlocity.getCustomLabel('DRMapperTransformDocumentOutputPath');
        }

        vm.outputLabel = field.label;
    }

    function onDeletedMapping(mapping) {
        vm.fieldMappings = vm.fieldMappings.filter(function(existingMapping) {
            return mapping[mapIdKey] !== existingMapping[mapIdKey];
        });
        vm.bundle.$$mappings = vm.bundle.$$mappings.filter(function(existingMapping) {
            return mapping[mapIdKey] !== existingMapping[mapIdKey];
        });
        vm.onFieldMappingChange({
            mapping: mapping
        });
    }

    function addMapping() {
        var mapping = {
            Name: vm.bundle.Name
        };
        mapping[mapIdKey] = generateUniqueMapId();
        mapping[apiNameKey] = vm.scopedToObject  || 'json';
        mapping[creationOrderKey] = Number(vm.creationOrder || 1);
        mapping[vm.ns + 'IsDisabled__c'] = false;
        mapping[vm.ns + 'IsRequiredForUpsert__c'] = false;
        mapping[vm.ns + 'UpsertKey__c'] = false;
        vm.fieldMappings.splice(0, 0, mapping);
        vm.bundle.$$mappings.splice(0, 0, mapping);
        broadcastExpandMappingEvent();
        $timeout(function() {
            var el = $('[data-dr-mapping-map-id="' + mapping[mapIdKey] + '"]', $element).get(0);
            if (el && (!el.scrollIntoViewIfNeeded || el.scrollIntoViewIfNeeded())) {
                el.scrollIntoView();
            }
            if (el) {
                $('input', el).get(0).focus();
            }
            if (vm.fieldMappings.length === 1) {
                // try force FF to redraw properly in LEX.
                window.scrollTo(0, 10);
                setTimeout(function() {
                    window.scrollTo(0,document.body.scrollHeight);
                });
            }
        });
    }

    function broadcastExpandMappingEvent(mapping) {
        $scope.$broadcast('add-new-mapping', mapping);
    }

    function refireHandleFieldMappingChange(mapping) {
        updateExtractionPathPicklist();
        vm.onFieldMappingChange({
            mapping: mapping
        });
    }

    function disableAddMappingBtn() {
        // disable if it's a Load mapping with Object's configured
        return isLoad() && !vm.scopedToObject && (!vm.loadObjectMappings || vm.loadObjectMappings.length === 0);
    }

    function isLoad() {
        return mappingService.isLoad(vm.bundle);
    }

    function isTransform() {
        return mappingService.isTransform(vm.bundle);
    }

    function isJsonInput() {
        return mappingService.isJsonInput(vm.bundle);
    }

    function isXmlInput() {
        return mappingService.isXmlInput(vm.bundle);
    }

    function isCustomInput() {
        return mappingService.isCustomInput(vm.bundle);
    }

    function isSObjectInput() {
        return mappingService.isSObjectInput(vm.bundle);
    }

    function isJsonOutput() {
        return mappingService.isJsonOutput(vm.bundle);
    }

    function isXmlOutput() {
        return mappingService.isXmlOutput(vm.bundle);
    }

    function isCustomOutput() {
        return mappingService.isCustomOutput(vm.bundle);
    }

    function isPdfOutput() {
        return mappingService.isPdfOutput(vm.bundle);
    }

    function isDocusignOutput() {
        return mappingService.isDocusignOutput(vm.bundle);
    }

    function isDocumentOutput() {
        return mappingService.isDocumentOutput(vm.bundle);
    }
}

})();

},{}],16:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .directive('formulaMapping', FormulaMapping);

FormulaMapping.$inject = [];

function FormulaMapping() {
    var directive = {
        restrict: 'EA',
        bindToController: {
            mapping: '=',
            bundle: '=',
            order: '=',
            onMappingDeleted: '&'
        },
        replace: true,
        scope: {},
        templateUrl: 'formula/formulaMapping.tpl.html',
        controllerAs: 'vm',
        controller: FormulaMappingController
    };
    return directive;
}

FormulaMappingController.$inject = ['fieldMetadata', 'mappingService'];

function FormulaMappingController(fieldMetadata, mappingService) {
    this.ns = fileNsPrefix();
    this.fieldMetadata = angular.copy(fieldMetadata.DRMapItem);
    this.formulaKey = this.ns + 'Formula__c';
    this.resultPathKey = this.ns + 'FormulaResultPath__c';
    this.formulaOrderKey = this.ns + 'FormulaOrder__c';

    this.deleteMapping = deleteMapping;
    this.onFieldChange = onFieldChange;

    //////////

    var vm = this;

    function deleteMapping() {
        vm.deleting = true;
        return mappingService.deleteMapping(vm.mapping)
            .then(function(doDelete) {
                if (doDelete) {
                    vm.onMappingDeleted({
                        mapping: vm.mapping
                    });
                }
            })
            .finally(function() {
                vm.deleting = false;
            });
    }

    function onFieldChange() {
        mappingService.saveMapping(vm.mapping);
    }

}

})();

},{}],17:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .directive('formulaTab', FormulaTab);

function FormulaTab() {
    return {
        restrict: 'EA',
        bindToController: {
            bundle: '='
        },
        scope: {},
        templateUrl: 'formula/formulaTab.tpl.html',
        controllerAs: 'vm',
        controller: FormulaTabController
    };
}

FormulaTabController.$inject = ['generateUniqueMapId', 'mappingService', '$scope'];

function FormulaTabController(generateUniqueMapId, mappingService, $scope) {
    this.ns = fileNsPrefix();
    this.formulaMappings = [];
    this.showAllExtractFields = false;
    this.sidebarOpen = true;
    this.extractionStepJson = {};
    this.isExtractMappingBundle = false;

    this.addFormula = addFormula;
    this.onFormulaDeleted = onFormulaDeleted;
    this.makeExtractStepOutput = makeExtractStepOutput;
    this.onDrop = onDrop;
    this.$onInit = onInit;

    //////////

    $scope.$watch('vm.showAllExtractJsonFields', makeExtractStepOutput);

    var vm = this,
        apiNameKey = vm.ns + 'DomainObjectAPIName__c',
        fieldApiNameKey = vm.ns + 'DomainObjectFieldAPIName__c',
        creationOrderKey = vm.ns + 'DomainObjectCreationOrder__c',
        formulaOrderKey = vm.ns + 'FormulaOrder__c',
        mapIdKey = vm.ns + 'MapId__c';

    function onInit() {
        if (vm.bundle.$$mappings) {
            var mappings = vm.bundle.$$mappings;
            vm.formulaMappings = mappings.filter(function(mapping) {
                return mapping[apiNameKey] === 'Formula';
            }).sort(function(a, b) {
                return a[formulaOrderKey] - b[formulaOrderKey];
            });
            updateAllFormulaOrders();
            makeExtractStepOutput();
            vm.isExtractMappingBundle = vm.bundle[vm.ns + 'Type__c'] === 'Extract';
            $scope.$watch('vm.showAllExtractJsonFields', makeExtractStepOutput);
        }
    }

    function addFormula() {
        var mapping = {
            Name: vm.bundle.Name
        };
        mapping[mapIdKey] = generateUniqueMapId();
        mapping[apiNameKey] = 'Formula';
        mapping[fieldApiNameKey] = 'Formula';
        mapping[creationOrderKey] = 0;
        mapping[vm.ns + 'IsDisabled__c'] = false;
        mapping[vm.ns + 'IsRequiredForUpsert__c'] = false;
        mapping[vm.ns + 'UpsertKey__c'] = false;
        vm.formulaMappings.push(mapping);
        vm.bundle.$$mappings.push(mapping);
        updateAllFormulaOrders();
    }

    function onDrop(event, index, mapping) {
        var startIndex = mapping[formulaOrderKey] - 1;
        mapping = vm.formulaMappings.splice(startIndex, 1)[0];
        vm.formulaMappings.splice(index, 0, mapping);
        updateAllFormulaOrders();
    }

    function onFormulaDeleted(mapping, index) {
        vm.formulaMappings.splice(index, 1);
        vm.bundle.$$mappings = vm.bundle.$$mappings.filter(function(existingMapping) {
            return mapping[mapIdKey] !== existingMapping[mapIdKey];
        });
        updateAllFormulaOrders();
    }

    function updateAllFormulaOrders() {
        vm.formulaMappings.forEach(function(mapping, index) {
            mapping[formulaOrderKey] = index + 1;
            mappingService.saveMapping(mapping);
        });
    }

    function makeExtractStepOutput() {
        return mappingService.getExtractionJson(vm.bundle.$$mappings, vm.showAllExtractJsonFields)
            .then(function(obj) {
                vm.extractionStepJson = obj;
            });
    }

}

})();

},{}],18:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('drmapper.load')
        .directive('loadFieldRow', LoadFieldRow);

    LoadFieldRow.$inject = [];

    function LoadFieldRow() {
        var directive = {
            restrict: 'EA',
            require: ['loadFieldRow', '^fieldBundleTable'],
            bindToController: {
                mapping: '=',
                loadObjectMappings: '=?',
                onDeletedMapping: '&',
                onFieldMappingChange: '&',
                bundle: '=',
                scopedToObject: '@?'
            },
            replace: true,
            scope: {},
            templateUrl: 'load/loadFieldRow.tpl.html',
            controllerAs: 'vm',
            controller: LoadFieldRowController,
            link: function (scope, element, attrs, controllers) {
                var loadBundleFieldController = controllers[0];
                var fieldBundleTableController = controllers[1];
                loadBundleFieldController.setParentController(fieldBundleTableController);
            }
        };
        return directive;
    }

    LoadFieldRowController.$inject = ['fieldMetadata', 'mappingService', '$timeout', '$element',
                                        'sObjects', 'sObjectFields', '$scope', '_', '$q'];

    function LoadFieldRowController(fieldMetadata, mappingService, $timeout, $element,
                                        sObjects, sObjectFields, $scope, _, $q) {
        this.ns = fileNsPrefix();
        this.editing = false;
        this.parentController = null;
        this.showDefaultValue = false;
        this.fieldMetadata = angular.copy(fieldMetadata.DRMapItem);
        this.extractJsonPathKey = this.ns + 'InterfaceFieldAPIName__c';
        this.lookupDomainObjectNameKey = this.ns + 'LookupDomainObjectName__c';
        this.lookupDomainObjectFieldNameKey = this.ns + 'LookupDomainObjectFieldName__c';
        this.lookupDomainObjectRequestedFieldNameKey = this.ns + 'LookupDomainObjectRequestedFieldName__c';
        this.domainObjectNameKey = this.ns + 'DomainObjectAPIName__c';
        this.jsonOutputPathKey = this.ns + 'DomainObjectFieldAPIName__c';
        this.isDisabledKey = this.ns + 'IsDisabled__c';
        this.defaultValueKey = this.ns + 'DefaultValue__c';
        this.fieldValueType = this.ns + 'DomainObjectFieldType__c';
        this.transformValuesMapKey = this.ns + 'TransformValuesMap__c';
        this.upsertKey = this.ns + 'UpsertKey__c';
        this.requiredForUpsertKey = this.ns + 'IsRequiredForUpsert__c';
        this.objectType = this.ns + 'DRMapItem__c';
        this.mapIdKey = this.ns + 'MapId__c';
        this.linkedCreatedIndexKey = this.ns + 'LinkCreatedIndex__c';
        this.linkedCreatedFieldKey = this.ns + 'LinkCreatedField__c';

        this.$onInit = onInit;
        this.deleteMapping = deleteMapping;
        this.editRow = editRow;
        this.onFieldChange = onFieldChange;
        this.setParentController = setParentController;
        this.isLinked = isLinked;
        this.handleCreationOrderKeyChange = handleCreationOrderKeyChange;
        this.isLookup = false;
        this.isUpsert = isUpsert;
        this.handleLookupChange = handleLookupChange;

        //////////
        var vm = this,
            defaultValueKey = vm.ns + 'DefaultValue__c',
            creationOrderKey = vm.ns + 'DomainObjectCreationOrder__c',
            apiNameKey = vm.ns + 'DomainObjectAPIName__c';

        vm.apiNameKey = apiNameKey;
        vm.creationOrderKey = creationOrderKey;

        function onInit() {
            vm.editing = !vm.mapping.Id;
            vm.showDefaultValue = !!vm.mapping[defaultValueKey];
            vm.isDisabled = vm.mapping[vm.isDisabledKey];
            vm.isLookup = !!vm.mapping[vm.ns + 'LookupDomainObjectName__c'];
            configureFieldMetadata();
            $scope.$on('add-new-mapping', function(event, mapping) {
                vm.editing = mapping === vm.mapping;
            });
            if (vm.mapping[vm.jsonOutputPathKey]) {
                vm.allJsonOutputPathKey = {
                    field: vm.mapping[vm.jsonOutputPathKey],
                    object: vm.mapping[apiNameKey],
                    creationOrder: vm.mapping[creationOrderKey],
                    $id: vm.mapping[creationOrderKey] + '-' + vm.mapping[vm.jsonOutputPathKey]
                };
            }
        }

        function configureFieldMetadata() {
            vm.fieldMetadata[vm.jsonOutputPathKey].type = 'PICKLIST';
            vm.fieldMetadata[vm.jsonOutputPathKey].restricted = false;
            vm.fieldMetadata[vm.lookupDomainObjectNameKey].restricted = false;
            vm.fieldMetadata[vm.lookupDomainObjectNameKey].type = 'PICKLIST';
            vm.fieldMetadata[vm.lookupDomainObjectNameKey].restricted = false;
            sObjects.getAllObjects().then(function (sObjects) {
                vm.fieldMetadata[vm.lookupDomainObjectNameKey].picklistValues = _.sortBy(sObjects, 'name').map(function(object) {
                    return {
                        value: object.name,
                        label: object.name
                    };
                });
            });
            vm.fieldMetadata[vm.lookupDomainObjectFieldNameKey].type = 'PICKLIST';
            vm.fieldMetadata[vm.lookupDomainObjectFieldNameKey].restricted = false;
            vm.fieldMetadata[vm.lookupDomainObjectRequestedFieldNameKey].type = 'PICKLIST';
            vm.fieldMetadata[vm.lookupDomainObjectRequestedFieldNameKey].restricted = false;

            if (vm.loadObjectMappings) {
                vm.fieldMetadata[vm.creationOrderKey].label = 'Domain Object';
                vm.fieldMetadata[vm.creationOrderKey].autocomplete = true;
                vm.fieldMetadata[vm.creationOrderKey].type = 'PICKLIST';
                vm.fieldMetadata[vm.creationOrderKey].restricted = true;
                vm.fieldMetadata[vm.creationOrderKey].picklistValues = vm.loadObjectMappings.reduce(function(array, object, index) {
                    var sObject = _.find(sObjects, {value: object.name});
                    if (sObject) {
                        array.push({
                            value: index + 1,
                            name: object.name,
                            label: (index + 1) + ' - ' + sObject.label
                        });
                    }
                    return array;
                }, []);
            }
            if (vm.isLinked()) {
                vm.fieldMetadata[vm.linkedCreatedFieldKey].type = 'PICKLIST';
                vm.fieldMetadata[vm.lookupDomainObjectFieldNameKey].restricted = false;
            }
            updatePicklists();
        }

        function setParentController(parentController) {
            vm.parentController = parentController;
        }

        function isLinked() {
            return vm.mapping[vm.linkedCreatedIndexKey];
        }

        function isUpsert() {
            return !!vm.mapping[vm.upsertKey];
        }

        function deleteMapping($event) {
            if ($event) {
                $event.stopPropagation();
            }

            mappingService.deleteMapping(vm.mapping)
                .then(function (doDelete) {
                    if (doDelete) {
                        vm.onDeletedMapping({
                            mapping: vm.mapping
                        });
                    }
                });
        }

        function editRow(skipEvent) {
            vm.editing = true;
            if (!vm.mapping.Id) {
                $timeout(function () {
                    $('input', $element).get(0).focus();
                });
            }
            if (!skipEvent) {
                vm.parentController.broadcastExpandMappingEvent(vm.mapping);
            }
        }

        function handleLookupChange() {
           if (!vm.isLookup) {
                vm.mapping[vm.lookupDomainObjectNameKey] = null;
                vm.mapping[vm.lookupDomainObjectFieldNameKey] = null;
                vm.mapping[vm.lookupDomainObjectRequestedFieldNameKey] = null;
            }

            mappingService.saveMapping(vm.mapping);
        }

        function handleCreationOrderKeyChange() {
            var match = _.find(vm.fieldMetadata[vm.creationOrderKey].picklistValues,
                                    {value: vm.mapping[creationOrderKey]});
            mappingService.saveMapping(vm.mapping)
                .then(function() {
                    // sometimes this doesn't stick due to race conditions, so push it seperately
                    vm.mapping[apiNameKey] = match.name;
                    updatePicklists();
                    return onFieldChange(vm.jsonOutputPathKey);
                });
        }

        function onFieldChange(fieldName) {
            switch (fieldName) {
                case vm.linkedCreatedIndexKey: // fall through
                case vm.lookupDomainObjectNameKey: updatePicklists();
                    break;
                case vm.isDisabledKey:
                    vm.isDisabled = vm.mapping[vm.isDisabledKey];
                    //fall through
                case vm.fieldValueType: //fall through
                case vm.defaultValueKey: //fall through
                case vm.jsonOutputPathKey:
                    vm.onFieldMappingChange({
                        mapping: vm.mapping
                    });
                    break;
                default: // do nothing
            }
            mappingService.saveMapping(vm.mapping);
        }

        function updatePicklists() {
            var outputPathField = vm.fieldMetadata[vm.jsonOutputPathKey];
            sObjectFields.getFieldNamesForObject(vm.mapping[vm.lookupDomainObjectNameKey])
                .then(function(fields){
                    vm.fieldMetadata[vm.lookupDomainObjectFieldNameKey].picklistValues = fields;
                    vm.fieldMetadata[vm.lookupDomainObjectRequestedFieldNameKey].picklistValues = fields;
                });
            $q.all([
                sObjectFields.getFieldNamesForObject(vm.scopedToObject || vm.mapping[apiNameKey]),
                mappingService.getAttributes(vm.scopedToObject || vm.mapping[apiNameKey])
            ]).then(function(results) {
                outputPathField.picklistValues = results[0].concat(results[1]);
            });
            if (vm.isLinked()) {
                var match = _.find(vm.fieldMetadata[vm.linkedCreatedIndexKey].picklistValues,
                    {value: vm.mapping[vm.linkedCreatedIndexKey]});
                sObjectFields.getFieldNamesForObject(match.name)
                    .then(function(fields) {
                        vm.fieldMetadata[vm.linkedCreatedFieldKey].picklistValues = fields;
                    });
            }
        }
    }

})();

},{}],19:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('drmapper.load')
        .directive('loadFieldsTab', LoadFieldsTab);

    function LoadFieldsTab() {
        var directive = {
            restrict: 'EA',
            bindToController: {
                bundle: '='
            },
            scope: {},
            templateUrl: 'load/loadFieldsTab.tpl.html',
            controllerAs: 'vm',
            controller: LoadFieldsTabController
        };
        return directive;
    }

    LoadFieldsTabController.$inject = ['remoteActions', '_', 'mappingService', 'sObjects', '$rootScope'];

    function LoadFieldsTabController(remoteActions, _, mappingService, sObjects, $rootScope) {
        this.ns = fileNsPrefix();
        this.loadObjectMappings = [];
        this.bundleInputTypeKey = this.ns + 'InputType__c';
        this.sidebarOpen = true;
        this.activeTab = 0;

        this.isJsonInput = isJsonInput;
        this.isXmlInput = isXmlInput;
        this.isCustomInput = isCustomInput;
        this.isSObjectInput = isSObjectInput;
        this.inputChanged = inputChanged;
        this.mappingFilter = mappingFilter;
        this.handleFieldMappingChange = handleFieldMappingChange;
        this.$onInit = onInit;

        ////////////////////////////

        var vm = this,
            creationOrderKey = vm.ns + 'DomainObjectCreationOrder__c',
            apiNameKey = vm.ns + 'DomainObjectAPIName__c';

        function onInit() {
            if (vm.bundle.$$mappings) {
                sObjects.getAllObjects().then(function (sObjects) {
                    vm.loadObjectMappings = vm.bundle.$$mappings.reduce(function (array, mapping) {
                        if (mapping[apiNameKey] === 'Formula') {
                            return array;
                        }
                        var index = mapping[creationOrderKey] - 1;
                        if (!array[index]) {
                            var sObject = _.find(sObjects, { name: mapping[apiNameKey] });
                            var name = (sObject ? sObject.label : mapping[apiNameKey]);
                            array[index] = {
                                name: mapping[apiNameKey],
                                creationOrder: mapping[creationOrderKey],
                                label: mapping[creationOrderKey] + ' - ' + (name || $rootScope.vlocity.getCustomLabelSync('DRMissingSObject', '[Missing SObject]')),
                                isInvalid: !name,
                                mappings: []
                            };
                        }
                        if (!mapping.$$fakeMapping) {
                            array[index].mappings.push(mapping);
                        }
                        return array;
                    }, []);
                });
            }
        }

        function isJsonInput() {
            return mappingService.isJsonInput(vm.bundle);
        }

        function isXmlInput() {
            return mappingService.isXmlInput(vm.bundle);
        }

        function isCustomInput() {
            return mappingService.isCustomInput(vm.bundle);
        }

        function isSObjectInput() {
            return mappingService.isSObjectInput(vm.bundle);
        }

        function inputChanged() {
            saveBundle();
        }

        function saveBundle() {
            mappingService.saveBundle(vm.bundle);
        }

        function mappingFilter(mapping, object) {
            if (mapping.$$fakeMapping) {
                return false;
            }
            if (!object) {
                return true;
            }
            if (object) {
                return mapping[creationOrderKey] === object.creationOrder;
            }
            return false;
        }

        function handleFieldMappingChange(mapping, currentObject) {
            if (currentObject) {
                mapping[creationOrderKey] = currentObject.creationOrder;
                mapping[apiNameKey] = currentObject.name;
            }
        }
    }

})();

},{}],20:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('drmapper.load')
        .directive('loadObjectRow', LoadObjectRow);

    LoadObjectRow.$inject = [];

    function LoadObjectRow() {
        var directive = {
            restrict: 'EA',
            require: ['loadObjectRow', '^loadObjectTab'],
            bindToController: {
                object: '=',
                onMappingDeleted: '&',
                onMappingAdded: '&',
                onObjectNameChangeHandler: '&onObjectNameChange',
                bundle: '=',
                order: '='
            },
            replace: true,
            scope: {},
            templateUrl: 'load/loadObjectRow.tpl.html',
            controllerAs: 'vm',
            controller: LoadObjectRowController,
            link: function (scope, element, attrs, controllers) {
                var loadObjectRowController = controllers[0];
                var loadObjectTabController = controllers[1];
                loadObjectRowController.setParentController(loadObjectTabController);
            }
        };
        return directive;
    }

    LoadObjectRowController.$inject = ['fieldMetadata', 'sObjectFields', '$filter',
        'sObjects', 'generateUniqueMapId', '$scope',
        'mappingService', '$sldsToast', '_', '$rootScope'
    ];

    function LoadObjectRowController(fieldMetadata, sObjectFields, $filter,
        sObjects, generateUniqueMapId, $scope, mappingService, $sldsToast, _, $rootScope) {
        var vm = this;
        this.ns = fileNsPrefix();
        this.parentController = null;
        this.fieldMetadata = angular.copy(fieldMetadata.DRMapItem);

        this.editMappingInterfaceObjectName = editMappingInterfaceObjectName;
        this.deleteMapping = deleteMapping;
        this.addLinkMapping = addLinkMapping;
        this.onLinkDeleted = onLinkDeleted;
        this.deleteLink = deleteLink;
        this.$onInit = onInit;
        this.onObjectNameChange = onObjectNameChange;
        this.onFieldChange = onFieldChange;
        this.setParentController = setParentController;

        //////////

        var ns = fileNsPrefix(),
            orderByKey = ns + 'DomainObjectCreationOrder__c',
            linkCreatedIndexKey = ns + 'LinkCreatedIndex__c',
            linkedCreatedFieldKey = ns + 'LinkCreatedField__c',
            objectNameKey = ns + 'DomainObjectAPIName__c',
            domainobjectFieldNameKey = ns + 'DomainObjectFieldAPIName__c',
            orderBy = $filter('orderBy');

        function onInit() {
            sObjects.getAllObjects().then(function (sObjects) {
                vm.sObjects = orderBy(sObjects, '+label');
            });
            // setup fieldMetaData customizations
            vm.fieldMetadata[linkedCreatedFieldKey].label = '';
            vm.rootMapping = vm.object.mappings[0];
            vm.mappings = vm.object.mappings.filter(function (mapping) {
                return mapping[linkCreatedIndexKey] > 0 && !mapping.$$fakeMapping;
            });
            vm.fieldMetadata[domainobjectFieldNameKey].type = 'PICKLIST';
            vm.fieldMetadata[linkedCreatedFieldKey].type = 'PICKLIST';
            vm.fieldMetadata[domainobjectFieldNameKey].restricted = false;
            vm.fieldMetadata[linkedCreatedFieldKey].restricted = true;
            vm.fieldMetadata[linkedCreatedFieldKey].autocomplete = true;
            vm.objectName = vm.object.name;
            if (!vm.objectName || vm.rootMapping.$$fakeMapping) {
                vm.editing = true;
            }
            setReadableObjectName();
            loadFieldNamesForObject();
            $scope.$on('linkedObjectNameChange', function() {
                vm.mappings.forEach(function(mapping) {
                    loadFieldNamesForLinkField(mapping);
                });
                updatePicklistForLinkCreatedIndex();
            });
        }

        function setReadableObjectName() {
            sObjects.getAllObjects().then(function (sObjects) {
                var sObject = _.find(sObjects, { name: vm.objectName });
                vm.readableObjectName = sObject ? sObject.label : '';
            });
        }

        function editMappingInterfaceObjectName(lock) {
            vm.editing = lock;
        }

        function addLinkMapping() {
            var newMapping = angular.copy(vm.rootMapping, {});
            newMapping.Id = undefined;
            newMapping[vm.ns + 'MapId__c'] = generateUniqueMapId(vm.bundle);
            newMapping[domainobjectFieldNameKey] = null;
            newMapping[linkCreatedIndexKey] = null;
            newMapping[linkedCreatedFieldKey] = null;
            newMapping[vm.ns + 'InterfaceFieldAPIName__c'] = null;
            newMapping[vm.ns + 'IsDisabled__c'] = false;
            newMapping[vm.ns + 'IsRequiredForUpsert__c'] = false;
            newMapping[vm.ns + 'UpsertKey__c'] = false;
            vm.object.mappings.push(newMapping);
            vm.mappings.push(newMapping);
            saveMapping(newMapping);
        }

        function deleteMapping() {
            return mappingService.deleteMappings(vm.object.mappings,
                    $rootScope.vlocity.getCustomLabelSync('DRDeleteLinkMappingWarning', '{1} and all its associated mappings', vm.objectName),
                    !vm.objectName)
                .then(function (doDelete) {
                    if (doDelete) {
                        vm.object.mappings.forEach(function (mapping) {
                            vm.onMappingDeleted({
                                mapping: mapping
                            });
                        });
                    }
                });
        }

        function deleteLink(mapping) {
            mapping.$$deleting = true;
            mappingService.deleteMapping(mapping, true)
                .then(function(doDelete) {
                    mapping.$$deleting = false;
                    if (doDelete) {
                        if (vm.onMappingDeleted) {
                            vm.onLinkDeleted(mapping);
                        }
                    }
                })
                .catch(function() {
                    mapping.$$deleting = false;
                });
        }

        function onLinkDeleted(mapping) {
            _.remove(vm.object.mappings, function(existingMapping) {
                return existingMapping === mapping;
            });
            _.remove(vm.mappings, function(existingMapping) {
                return existingMapping === mapping;
            });
            vm.onMappingDeleted({
                mapping: mapping
            });
        }

        function onObjectNameChange() {
            var objectName = vm.objectName;
            setReadableObjectName();
            vm.object.mappings.forEach(function (mapping) {
                mapping[objectNameKey] = objectName;
                mappingService.saveMapping(mapping);
            });
            loadFieldNamesForObject();
            vm.onObjectNameChangeHandler({
                objectName: objectName
            });
        }

        function loadFieldNamesForObject() {
            var objectName = vm.objectName;
            if (!objectName) {
                vm.editing = true;
                return;
            }
            vm.loadingFields = true;
            sObjectFields.getFieldNamesForObject(objectName)
                .then(function (fields) {
                    vm.loadingFields = false;
                    vm.fieldMetadata[domainobjectFieldNameKey].picklistValues = fields;
                }).catch(function (error) {
                    vm.loadingFields = false;
                    $sldsToast({
                        title: 'Failed to load fields for ' + objectName,
                        content: error.message,
                        severity: 'error',
                        autohide: false
                    });
                });
        }

        function onFieldChange(fieldName, mapping) {
            switch (fieldName) {
                case linkCreatedIndexKey: loadFieldNamesForLinkField(mapping);
                    break;
                default: // do nothing
            }
            mappingService.saveMapping(mapping);
        }

        function loadFieldNamesForLinkField(mapping) {
            vm.loadingFields = true;
            var values = vm.parentController.fieldMetadata[linkCreatedIndexKey].picklistValues;
            var object = _.find(values, {value: mapping[linkCreatedIndexKey]});
            if (object) {
                sObjectFields.getFieldNamesForObject(object.name)
                    .then(function (fields) {
                        vm.loadingFields = false;
                        vm.fieldMetadata[linkedCreatedFieldKey].picklistValues = fields;
                    });
            }
        }

        function saveMapping(mapping) {
            mappingService.saveMapping(mapping)
                .then(function () {
                    vm.onMappingAdded({
                        mapping: mapping
                    });
                });
        }

        function setParentController(loadObjectTabController) {
            vm.parentController = loadObjectTabController;
        }

        function updatePicklistForLinkCreatedIndex() {
            // update the linkCreatedIndexKey PicklistValues to include only values from earlier objects
            vm.fieldMetadata[linkCreatedIndexKey].picklistValues = vm.parentController.fieldMetadata[linkCreatedIndexKey].picklistValues.slice(0, vm.order - 1);
        }

        $scope.$watch('vm.order', function (newValue) {
            if (newValue === 1) {
                // now it's the first mapping must delete all Link mappings
                vm.mappings.forEach(function (mapping) {
                    vm.deleteLink(mapping);
                });
            } else {
                vm.object.mappings.forEach(function (mapping) {
                    mapping[orderByKey] = newValue;
                    mappingService.saveMapping(mapping);
                });
            }
            vm.parentController.onObjectNameChange();
            updatePicklistForLinkCreatedIndex();
        });
    }

})();

},{}],21:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('drmapper.load')
        .directive('loadObjectTab', LoadObjectTab);

    LoadObjectTab.$inject = [];
    function LoadObjectTab() {
        return {
            restrict: 'EA',
            bindToController: {
                bundle: '=',
                shown: '='
            },
            scope: {},
            templateUrl: 'load/loadObjectTab.tpl.html',
            controllerAs: 'vm',
            controller: LoadObjectTabController
        };
    }

    LoadObjectTabController.$inject = ['$timeout', '$scope', 'mappingService',
    '$element', 'generateUniqueMapId', '_', 'fieldMetadata', '$rootScope', 'sObjects'];

    function LoadObjectTabController ($timeout, $scope, mappingService,
        $element, generateUniqueMapId, _, fieldMetadata, $rootScope, sObjects) {
        this.ns = fileNsPrefix();
        this.loadObjectMappings = [];
        this.fieldMetadata = fieldMetadata.DRMapItem;

        this.$onInit = onInit;
        this.onDrop = onDrop;
        this.onMappingDeleted = onMappingDeleted;
        this.onMappingAdded = onMappingAdded;
        this.addNewObject = addNewObject;
        this.onObjectNameChange = onObjectNameChange;

        //////////

        var vm = this,
            mapIdKey = vm.ns + 'MapId__c',
            orderByKey = vm.ns + 'DomainObjectCreationOrder__c',
            apiNameKey = vm.ns + 'DomainObjectAPIName__c',
            fieldApiNameKey = vm.ns + 'DomainObjectFieldAPIName__c',
            linkCreatedIndexKey = vm.ns + 'LinkCreatedIndex__c',
            filterOperatorKey = vm.ns + 'FilterOperator__c';

        function onInit() {
            sObjects.getAllObjects().then(function (sObjects) {
                vm.sObjects = sObjects;
            });
            updateMappings();
            vm.fieldMetadata[linkCreatedIndexKey].type = 'PICKLIST';
            vm.fieldMetadata[linkCreatedIndexKey].restricted = true;
            vm.fieldMetadata[linkCreatedIndexKey].autocomplete = true;
            $rootScope.vlocity.getCustomLabels('DRMapperLinkedObject')
                .then(function (labels) {
                    vm.fieldMetadata[linkCreatedIndexKey].label = labels[0];
                });
            $scope.$watch('vm.shown', function(isShown) {
                if (isShown) {
                    updateMappings();
                }
            });
        }

        function updateMappings() {
            if (vm.bundle.$$mappings) {
                vm.loadObjectMappings = mappingService.getLoadObjects(vm.bundle);
                updateOrderByKeys();
                updateOrderByPicklist();
            }
        }

        function updateOrderByPicklist() {
            if (!vm.sObjects) {
                return;
            }
            vm.fieldMetadata[linkCreatedIndexKey].picklistValues = vm.loadObjectMappings.reduce(function (array, object, index) {
                var sObject = _.find(vm.sObjects, { value: object.name });
                if (sObject) {
                    array.push({
                        value: index + 1,
                        name: object.name,
                        label: (index + 1) + ' - ' + sObject.label
                    });
                }
                return array;
            }, []);
        }

        function onDrop(event, index, object) {
            var startIndex = Math.max(object.mappings[0][orderByKey] - 1, 0);
            object = vm.loadObjectMappings.splice(startIndex, 1)[0];
            vm.loadObjectMappings.splice(index, 0, object);
            updateOrderByKeys();
        }

        function onMappingDeleted(mapping, index) {
            var mappings = vm.loadObjectMappings[index].mappings;
            vm.loadObjectMappings[index].mappings = mappings.filter(function(existingMapping) {
                return existingMapping[mapIdKey] !== mapping[mapIdKey];
            });
            vm.bundle.$$mappings = vm.bundle.$$mappings.filter(function(existingMapping) {
                return existingMapping[mapIdKey] !== mapping[mapIdKey];
            });
            updateOrderByKeys();
            $scope.$broadcast('linkedObjectNameChange');
        }

        function onMappingAdded(mapping) {
            vm.bundle.$$mappings.push(mapping);
        }

        function updateOrderByKeys() {
            vm.loadObjectMappings = vm.loadObjectMappings.filter(function(object) {
                return (!_.isNil(object.mappings) && !_.isEmpty(object.mappings));
            });
            vm.loadObjectMappings.forEach(function(object, i) {
                object.mappings.forEach(function(mapping) {
                    if (mapping[orderByKey] !== i + 1) {
                        mapping[orderByKey] = i + 1;
                        mappingService.saveMapping(mapping);
                    }
                });
            });
            updateOrderByPicklist();
        }

        function addNewObject() {
            var mapping = {
                Name: vm.bundle.Name,
                $$fakeMapping: true,
            };
            mapping[mapIdKey] = generateUniqueMapId();
            mapping[filterOperatorKey] = '=';
            mapping[apiNameKey] = '';
            mapping[orderByKey] = vm.loadObjectMappings.length + 1;
            mapping[fieldApiNameKey] = 'Id';
            mapping[vm.ns + 'IsDisabled__c'] = true;
            mapping[vm.ns + 'ConfigurationValue__c'] = 'FAKEMAPPING';
            mapping[vm.ns + 'IsRequiredForUpsert__c'] = false;
            mapping[vm.ns + 'UpsertKey__c'] = false;
            vm.loadObjectMappings.push({
                name: mapping[apiNameKey],
                mappings: [mapping]
            });
            vm.bundle.$$mappings.push(mapping);
            $timeout(function() {
                $('.drmapper_loadObjectTab_grid .drmapper_loadObjectRow:last-child input', $element).focus();
                if (vm.loadObjectMappings.length === 1) {
                    // try force FF to redraw properly in LEX.
                    window.scrollTo(0, 10);
                    setTimeout(function() {
                        window.scrollTo(0,document.body.scrollHeight);
                    });
                }
            });
        }

        function onObjectNameChange() {
            vm.loadObjectMappings.forEach(function(object) {
                object.name = object.mappings[0][apiNameKey];
            });
            updateOrderByPicklist();
            $scope.$broadcast('linkedObjectNameChange');
        }

    }
})();

},{}],22:[function(require,module,exports){
(function() {
    'use strict';
    angular.module('drmapper.load')
        .directive('loadOptionsTab', LoadOptionsTab);
    
    function LoadOptionsTab() {
        var directive = {
            restrict: 'EA',
            bindToController: {
                bundle: '='
            },
            scope: {},
            templateUrl: 'load/loadOptionsTab.tpl.html',
            controllerAs: 'vm',
            controller: LoadOptionsTabController
        };
        return directive;
    }
    
    LoadOptionsTabController.$inject = ['fieldMetadata', 'remoteActions', '_', 'mappingService', '$scope'];
    
    function LoadOptionsTabController(fieldMetadata, remoteActions, _, mappingService, $scope) {
        this.ns = fileNsPrefix();
        this.fieldMetadata = fieldMetadata.DRBundle;
        this.ignoreErrorsKey = this.ns + 'IgnoreErrors__c';
        this.rollbackOnErrorKey = this.ns + 'RollbackOnError__c';
        this.useAssignmentRulesKey = this.ns + 'UseAssignmentRules__c';
        this.overwriteNullValuesKey = this.ns + 'OverwriteAllNullValues__c';
        this.isDefaultForInterfaceKey = this.ns + 'IsDefaultForInterface__c';

        this.batchSizeKey = this.ns + 'BatchSize__c';
        this.processNowThresholdKey = this.ns + 'ProcessNowThreshold__c';
        this.preprocessorClassNameKey = this.ns + 'PreprocessorClassName__c';
        this.deleteOnSuccessKey = this.ns + 'DeleteOnSuccess__c';
        this.isProcessSuperBulkKey = this.ns + 'IsProcessSuperBulk__c';
        this.hasDefaultForInterface = false;

        this.objectType = 'DRBundle__c';

        this.onFieldChange = onFieldChange;
        this.isJsonInput = isJsonInput;
        this.isXmlInput = isXmlInput;
        this.isSObjectInput = isSObjectInput;
        this.$onInit = onInit;

        ////////////////////////////

        var vm = this;

        function onInit() {
            $scope.$watch('vm.bundle.' + vm.ns + 'InterfaceObject__c', function () {
                isDefaultForInterface();
            });
        }

        function onFieldChange(fieldName) {
            mappingService.saveBundle(vm.bundle);
            if (fieldName === vm.isDefaultForInterfaceKey) {
                isDefaultForInterface();
            }
        }

        function isJsonInput() {
            return mappingService.isJsonInput(vm.bundle);
        }

        function isXmlInput() {
            return mappingService.isXmlInput(vm.bundle);
        }

        function isSObjectInput() {
            return mappingService.isSObjectInput(vm.bundle);
        }

        function isDefaultForInterface() {
            return remoteActions.getDefaultBundleForInterface(vm.bundle[vm.ns + 'InterfaceObject__c'])
                .then(function(result) {
                    vm.hasDefaultForInterface = result !== null && result !== vm.bundle.Name;
                    if (vm.hasDefaultForInterface && vm.bundle[vm.isDefaultForInterfaceKey] === true) {
                        vm.bundle[vm.isDefaultForInterfaceKey] = false;
                        onFieldChange(vm.isDefaultForInterfaceKey);
                    }
                });
        }
    }

})();
},{}],23:[function(require,module,exports){

(function() {
'use strict';
angular.module('drmapper.load')
    .directive('loadTabs', LoadTabs);

LoadTabs.$inject = [];

function LoadTabs() {
    return {
        restrict: 'ACE',
        bindToController: {
            bundle: '='
        },
        scope: {},
        templateUrl: 'load/loadTabs.tpl.html',
        controllerAs: 'vm',
        controller: LoadTabsController
    };
}

LoadTabsController.$inject = [];

function LoadTabsController() {
    this.ns = fileNsPrefix();
    this.nsForUrl = this.ns.length === 0 ? '' : this.ns.replace('__', '/');
    this.activeTab = 0;
}

})();

},{}],24:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .directive('previewExtract', PreviewExtract);

PreviewExtract.$inject = ['$sldsPopover'];

function PreviewExtract($sldsPopover) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            url: '@drurl',
            bundleName: '@bundleName',
            bundle: '=',
            jsonParams: '=initialJson',
            xmlInput: '=initialXml',
            customInput: '=initialCustom',
            resetJson: '=',
            inputType: '=',
            outputType: '=',
            interfaceType: '=',
            ignoreCache: '='
        },
        bindToController: true,
        templateUrl: 'preview/previewExtract.tpl.html',
        controllerAs: 'vm',
        controller: PreviewExtractController,
        link: function ($scope, element, attr) {
            $scope.showPerformanceHint = function (action) {
                function showPopover() {
                    $scope.performancePopover && $scope.performancePopover.hide();
                    $scope.performancePopover = $sldsPopover(element, {
                        scope: $scope,
                        sldsEnabled: true,
                        autoClose: true,
                        show: true,
                        trigger: 'manual',
                        nubbinDirection: 'bottom',
                        target: $('.performace-metrics-info', element),
                        container: '.via-slds',
                        templateUrl: 'SldsPerformanceScopePopover.tpl.html'
                    });
                }
                if(!$scope.performancePopover) {
                    showPopover();
                }
                else {
                    if(action === 'hide') {
                        $scope.performancePopover && $scope.performancePopover.hide();
                    }
                    else {
                        $scope.performancePopover && $scope.performancePopover.show();
                    }
                }
            };
        }
    };
}

PreviewExtractController.$inject = ['$scope', 'remoteActions', '$location', '$q', 'vkbeautify', '_', 'mappingService'];

function PreviewExtractController($scope, remoteActions, $location, $q, vkbeautify, _, mappingService) {
    this.requesting = false;
    this.hostPrefix = $location.protocol() + '://' + $location.host();
    this.serviceUrl = this.hostPrefix + this.url;
    this.params = [];
    this.currentSection = 'errors';
    this.sidebarOpen = true;
    this.ns = fileNsPrefix();

    this.toggleJsonMode = toggleJsonMode;
    this.submitRequest = submitRequest;
    this.addParam = addParam;
    this.deleteParam = deleteParam;
    this.toggleAccordian = toggleAccordian;
    this.reset = reset;
    this.$onInit = doInit;
    this.onInputJsonChange = onInputJsonChange;
    this.onInputCustomChange = onInputCustomChange;
    this.onInputXmlChange = onInputXmlChange;
    this.ignoreCachePreview = true;

    /////////////////////

    var vm = this;
    var params = {};

    function doInit() {
        var localParams;
        try {
            vm.jsonMode = false;

            if (vm.jsonParams) {
                localParams = JSON.parse(vm.jsonParams);
            }
            vm.params = Object.keys(localParams).reduce(function(arr, key) {
                arr.push({key: key, value: localParams[key]});
                if (!angular.isString(localParams[key])) {
                    vm.jsonMode = true;
                }
                return arr;
            }, []);

            if (vm.inputType === 'XML') {
                vm.jsonMode = true;
            }
        } catch (e) {
            vm.jsonMode = true;
            vm.invalidJSON = true;
        }
    }

    // public functions
    function toggleJsonMode() {
        vm.jsonMode = !vm.jsonMode;
        if (vm.jsonMode) {
            vm.jsonParams = JSON.stringify(vm.params.reduce(function(obj, param) {
                obj[param.key] = param.value;
                return obj;
            }, {}), 4);
        } else if (vm.inputType === 'JSON') {
            var params = JSON.parse(vm.jsonParams);
            vm.params = Object.keys(params).reduce(function(arr, key) {
                arr.push({key: key, value: params[key]});
                return arr;
            }, []);
            vm.invalidJSON = false;
        }
    }

    $scope.$watch('vm.jsonParams', function(json) {
        try {
            JSON.parse(vm.jsonParams);
            vm.invalidJSON = false;
        } catch (e) {
            vm.invalidJSON = true;
        }
    });

    $scope.$watch('vm.params', function(params) {
        vm.jsonParams = JSON.stringify(vm.params.reduce(function(obj, param) {
            obj[param.key] = param.value;
            return obj;
        }, {}), 4);
    }, true);

    function reset() {
        if (vm.inputType === 'JSON') {
            vm.params = [];
            vm.jsonParams = vm.resetJson || '{}';
            onInputJsonChange();
        } else if (vm.inputType === 'Custom') {
            vm.customInput = '';
            onInputCustomChange();
        } else if (vm.inputType === 'XML') {
            vm.xmlInput = '';
            onInputXmlChange();
        }
    }

    function addParam() {
        vm.params.push({key:'',value:''});
    }

    function deleteParam(param) {
        vm.params.forEach(function(param_, i) {
            if (param_ === param) {
                vm.params.splice(i, 1);
            }
        });
    }

    function submitRequest() {
        vm.requesting = true;
        var startTime = Date.now();
        var params = {
            bundleName: vm.bundleName,
            inputType: vm.inputType,
            interfaceType: vm.interfaceType,
            objectList: getInput(vm.inputType),
            ignoreCache: vm.ignoreCachePreview,
            bulkUpload: false,
            debug: true
        };
        vm.response = null;

        function getInput(input) {
            if (input === 'XML') {
                return vm.xmlInput;
            } else if (input === 'Custom') {
                return vm.customInput;
            } else {
                return vm.jsonParams;
            }
        }

        remoteActions.drPreviewExecute(params)
            .then(function(response) {
                if (typeof(response) === 'string') {
                    response = JSON.parse(response);
                }

                if (response.interfaceInfo) {
                    vm.response = response;

                    if (vm.outputType === 'XML') {
                        vm.response.returnResultsData = vkbeautify.xml(vm.response.returnResultsData);
                    }
                    else if (vm.outputType === 'Custom') {
                        vm.response.returnResultsData = vm.response.returnResultsData;
                    }
                } else if (response && response.responseText) {
                    vm.response.errors = JSON.parse(response.responseText);
                } else {
                    vm.response.errors = [response || 'Request Failed'];
                }
            })
            .catch(function(response) {
                vm.response = {};

                if (response.responseText) {
                    vm.response.errors = JSON.parse(response.responseText);
                } else if (response.message) {
                    vm.response.errors = [response.message, response];
                } else {
                    vm.response.errors = [response || 'Request Failed'];
                }
            })
            .finally(function() {
                vm.requesting = false;
                var doneTime = Date.now();
                vm.requestTime = doneTime - startTime;
                vm.CpuTime = vm.response.CpuTime;
                vm.ActualTime = vm.response.ActualTime;
                vm.response.debugLog = vm.response.debugLog ? vm.response.debugLog.join('\n') : '';
                if (!_.isEmpty(vm.response.errors)) {
                    if (!angular.isArray(vm.response.errors)) {
                        vm.response.errors = [vm.response.errors];
                    }
                    vm.response.errors = vm.response.errors.map(function(error) {
                        return error.errorCode ? error.errorCode + ' - ' + error.message : error;
                    });
                    vm.sidebarOpen = true;
                    vm.currentSection = 'errors';
                }
            });
    }

    function toggleAccordian(openIfClosed, openIfOpen) {
        if (vm.currentSection === openIfClosed) {
            vm.currentSection = openIfOpen;
        } else {
            vm.currentSection = openIfClosed;
        }
    }

    function onInputJsonChange() {
        if (!vm.jsonMode) {
            vm.jsonParams = JSON.stringify(vm.params.reduce(function(obj, param) {
                obj[param.key] = param.value;
                return obj;
            }, {}), 4);
        }

        vm.bundle[vm.ns + 'SampleInputJSON__c'] = vm.jsonParams;
        mappingService.saveBundle(vm.bundle);
    }

    function onInputCustomChange() {
        vm.bundle[vm.ns + 'SampleInputCustom__c'] = vm.customInput;
        mappingService.saveBundle(vm.bundle);
    }

    function onInputXmlChange() {
        vm.bundle[vm.ns + 'SampleInputXml__c'] = vm.xmlInput;
        mappingService.saveBundle(vm.bundle);
    }
}

})();

},{}],25:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .directive('previewLoadTransform', PreviewLoadTransform);

PreviewLoadTransform.$inject = ['$sldsPopover'];

function PreviewLoadTransform($sldsPopover) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            url: '@drurl',
            bundleName: '@bundleName',
            bundle: '=',
            inputJson: '=initialJson',
            inputRows: '=initialRows',
            inputXml: '=initialXml',
            inputCustom: '=initialCustom',
            isTransform: '=',
            isVisible: '=',
            loadJson: '=',
            resetJson: '=',
            resetXml: '=',
            resetCustom: '=',
            inputType: '=',
            outputType: '='
        },
        bindToController: true,
        templateUrl: 'preview/previewLoadTransform.tpl.html',
        controllerAs: 'vm',
        controller: PreviewLoadTransformController,
        link: function ($scope, element, attr) {
            $scope.showPerformanceHint = function (action) {
                function showPopover() {
                    $scope.performancePopover && $scope.performancePopover.hide();
                    $scope.performancePopover = $sldsPopover(element, {
                        scope: $scope,
                        sldsEnabled: true,
                        autoClose: true,
                        show: true,
                        trigger: 'manual',
                        nubbinDirection: 'bottom',
                        target: $('.performace-metrics-info', element),
                        container: '.via-slds',
                        templateUrl: 'SldsPerformanceScopePopover.tpl.html',
                    });
                }
                if(!$scope.performancePopover) {
                    showPopover();
                }
                else {
                    if(action === 'hide') {
                        $scope.performancePopover && $scope.performancePopover.hide();    
                    }
                    else {
                        $scope.performancePopover && $scope.performancePopover.show(); 
                    }
                }
            };
        }
    };
}

PreviewLoadTransformController.$inject = ['$scope', '$q', '$location', 'remoteActions', 'vkbeautify', '_', 'mappingService'];

function PreviewLoadTransformController($scope, $q, $location, remoteActions, vkbeautify, _, mappingService) {
    this.bulkUpload = false;
    this.simulate = false;
    this.requesting = false;
    this.hostPrefix = $location.protocol() + '://' + $location.host();
    this.serviceUrl = this.hostPrefix + this.url;
    this.currentSection = 'errors';
    this.sidebarOpen = true;
    this.ns = fileNsPrefix();

    this.$onInit = onInit;
    this.toggleAccordian = toggleAccordian;
    this.submitRequest = submitRequest;
    this.onInputJsonChange = onInputJsonChange;
    this.onInputCustomChange = onInputCustomChange;
    this.onInputXmlChange = onInputXmlChange;
    this.reset = reset;
    this.ignoreCachePreview = true;

    //////////////
    var vm = this;

    $scope.$watch('vm.inputJson', function(json) {
        if (vm.inputJson && vm.inputType === 'JSON') {
            try {
                JSON.parse(vm.inputJson);
                vm.invalidJSON = false;
            } catch (e) {
                vm.invalidJSON = true;
            }
        } else {
            vm.invalidJSON = false;
        }
    });

    $scope.$watch('vm.isVisible', function(isVisible) {
        if (isVisible) {
            onInit();
        }
    });

    function onInit() {
        vm.inputJson = vm.inputJson || vm.resetJson;
        vm.inputRows = vm.inputRows || '';
        vm.inputXml = vm.inputXml || vm.resetXml;
        vm.inputCustom = vm.inputCustom || vm.resetCustom;
    }

    function submitRequest() {
        vm.requesting = true;
        var startTime = Date.now();

        getObjectListJson()
        .then(function(inputJson) {
            var params = {
                bundleName: vm.bundleName,
                objectList: inputJson,
                bulkUpload: vm.bulkUpload,
                inputType: vm.inputType,
                ignoreCache: vm.ignoreCachePreview,
                debug: true
            };
            vm.response = null;

            remoteActions.drPreviewExecute(params)
            .then(function(response) {
                if (typeof(response) === 'string') {
                    response = JSON.parse(response);
                }

                vm.response = response;
                if (!vm.isTransform) {
                    vm.response.createdObjects = Object.keys(response.createdObjectsByType)
                        .reduce(function(array, bundleName) {
                            var bundleData = response.createdObjectsByType[bundleName];
                            var index = 1;
                            Object.keys(bundleData).forEach(function(objectType) {
                                var newIds = bundleData[objectType];
                                array = array.concat(newIds.map(function(id) {
                                    return {
                                        id: id,
                                        type: objectType,
                                        index: index++
                                    };
                                }));
                            })
                            return array;
                        }, []);
                }

                if (vm.outputType === 'XML') {
                    vm.response.returnResultsData = vkbeautify.xml(vm.response.returnResultsData);
                }

                if (response.errors) {
                    vm.response.errors = Object.keys(response.errors)
                        .reduce(function(array, bundleName) {
                            var bundleData = response.errors[bundleName];
                            Object.keys(bundleData).forEach(function(key) {
                                Object.keys(bundleData[key]).forEach(function(childKey) {
                                    array.push(bundleData[key][childKey]);
                                });
                            });
                            return array;
                        }, []);
                }

                if (response.responseText) {
                    vm.response.errors = JSON.parse(response.responseText);
                }
            })
            .catch(function(response) {
                vm.response = {};

                if (response.responseText) {
                    vm.response.errors = JSON.parse(response.responseText);
                } else if (response.message) {
                    vm.response.errors = [response.message, response];
                } else {
                    vm.response.errors = [response || 'Request Failed'];
                }
            })
            .finally(function() {
                vm.requesting = false;
                var doneTime = Date.now();
                vm.requestTime = doneTime - startTime;
                vm.CpuTime = vm.response.CpuTime;
                vm.ActualTime = vm.response.ActualTime;
                vm.response.debugLog = vm.response.debugLog ? vm.response.debugLog.join('\n') : '';
                if (!_.isEmpty(vm.response.errors)) {
                    if (!angular.isArray(vm.response.errors)) {
                        vm.response.errors = [vm.response.errors];
                    }
                    vm.response.errors = vm.response.errors.map(function(error) {
                        if (error.errorCode) {
                            return error.errorCode + ' - ' + error.message;
                        }
                        return error;
                    });
                    vm.sidebarOpen = true;
                    vm.currentSection = 'errors';
                }
            });
        })
        .catch(function(response) {

            vm.response = {};

            if (response.responseText) {
                vm.response.errors = JSON.parse(response.responseText);
            } else if (response.message) {
                vm.response.errors = [response.message, response];
            } else {
                vm.response.errors = [response || 'Request Failed'];
            }
        });
    }

    function reset() {
        if (vm.inputType === 'JSON') {
            vm.inputJson = vm.resetJson || '';
            onInputJsonChange();
        } else if (vm.inputType === 'Custom') {
            vm.inputCustom = vm.resetCustom || '';
            onInputCustomChange();
        } else if (vm.inputType === 'XML') {
            vm.inputXml = vm.resetXml || '';
            onInputXmlChange();
        } else {
            vm.inputRows = '';
        }
    }

    function isJsonString(str) {
        try {
            JSON.parse(str);
        } catch(e) {
            return false;
        }
        return true;
    }

    function getObjectListJson() {
        var deferred = $q.defer();

        if (vm.inputType === 'Custom') {
            deferred.resolve(vm.inputCustom);
        }
        else if (vm.inputType === 'XML') {
            deferred.resolve(vm.inputXml);
        }
        else if (vm.inputRows) {
            var ids = vm.inputRows.split(/[,\n]/g);
            if (isJsonString(vm.inputRows)) {
                deferred.resolve(vm.inputRows);
            } else {
            remoteActions.QueryAllFields(ids)
                .then(function(response) {
                  deferred.resolve(response);
                });
            }
        } else {
            deferred.resolve(vm.inputJson);
        }

        return deferred.promise;
    }

    function toggleAccordian(openIfClosed, openIfOpen) {
        if (vm.currentSection === openIfClosed) {
            vm.currentSection = openIfOpen;
        } else {
            vm.currentSection = openIfClosed;
        }
    }

    function onInputJsonChange() {
        vm.bundle[vm.ns + 'SampleInputJSON__c'] = vm.inputJson;
        mappingService.saveBundle(vm.bundle);
    }

    function onInputCustomChange() {
        vm.bundle[vm.ns + 'SampleInputCustom__c'] = vm.inputCustom;
        mappingService.saveBundle(vm.bundle);
    }

    function onInputXmlChange() {
        vm.bundle[vm.ns + 'SampleInputXml__c'] = vm.inputXml;
        mappingService.saveBundle(vm.bundle);
    }
}

})();

},{}],26:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .directive('transformMapValues', TransformMapValues);

TransformMapValues.$inject = [];

function TransformMapValues() {
    var directive = {
        restrict: 'EA',
        bindToController: {
            mapping: '=',
            onChange: '='
        },
        replace: true,
        scope: {},
        templateUrl: 'transform/transformMapValues.tpl.html',
        controllerAs: 'vm',
        controller: TransformMapValuesController
    };
    return directive;
}

TransformMapValuesController.$inject = [];

function TransformMapValuesController() {
    this.ns = fileNsPrefix();
    this.transformMapValues = [];

    this.$onInit = onInit;
    this.addNewTransformMapValue = addNewTransformMapValue;
    this.deleteTransformMapValue = deleteTransformMapValue;
    this.resetTransformMapValue = resetTransformMapValue;
    this.onFieldChange = onFieldChange;

    //////////
    var vm = this,
        transformMapValuesKey = vm.ns + 'TransformValuesMap__c';

    function onInit() {
        var originalTransformMapValues = vm.mapping[transformMapValuesKey];
        if (angular.isString (originalTransformMapValues)) {
            adaptMapValuesStringToArray(originalTransformMapValues);
        }
    }

    function adaptMapValuesStringToArray(transformMapValues) {
        try {
            var asJSON = JSON.parse(transformMapValues);
            vm.transformMapValues = Object.keys(asJSON).map(function(key) {
                return {
                    key: key,
                    value: asJSON[key]
                };
            });
        } catch (e) {
            vm.mapping[transformMapValuesKey] = null;
        }
    }

    function addNewTransformMapValue() {
        vm.transformMapValues.push({
            key: '',
            value: ''
        });
        onFieldChange();
    }

    function deleteTransformMapValue(transformMapValue) {
        vm.transformMapValues = vm.transformMapValues.filter(function(mapValue) {
            return mapValue !== transformMapValue;
        });
        onFieldChange();
    }

    function resetTransformMapValue() {
        vm.transformMapValues = [];
        onFieldChange();
    }

    function onFieldChange() {
        var asJSON = vm.transformMapValues.reduce(function(object, currentValue) {
            object[currentValue.key] = currentValue.value;
            return object;
        }, {});
        var newValue = JSON.stringify(asJSON);
        if (vm.mapping[transformMapValuesKey] !== newValue) {
            vm.mapping[transformMapValuesKey] = JSON.stringify(asJSON);
            if (vm.onChange) {
                vm.onChange({
                    mapping: vm.mapping
                });
            }
        }
    }
}

})();

},{}],27:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .directive('transformMappingTab', TransformMappingTab);

function TransformMappingTab() {
    var directive = {
        restrict: 'EA',
        bindToController: {
            bundle: '='
        },
        scope: {},
        templateUrl: 'transform/transformMappingTab.tpl.html',
        controllerAs: 'vm',
        controller: TransformMappingTabController
    };
    return directive;
}

TransformMappingTabController.$inject = ['remoteActions', '_', 'mappingService', 
                                        '$scope', 'vkbeautify'];

function TransformMappingTabController(remoteActions, _, mappingService, $scope, vkbeautify) {
    this.ns = fileNsPrefix();
    this.fieldMappings = [];
    this.extractionStepOutput = null;
    this.showAllExtractFields = false;
    this.bundleInputTypeKey = this.ns + 'InputType__c';
    this.bundleOutputTypeKey = this.ns + 'OutputType__c';
    this.bundleTargetOutJsonKey = this.ns + 'TargetOutJson__c';
    this.bundleTargetOutXmlKey = this.ns + 'TargetOutXml__c';
    this.bundleTargetOutCustomKey = this.ns + 'TargetOutCustom__c';
    this.currentSection = 'current';
    this.sidebarOpen = true;

    this.makeCurrentOutputData = makeCurrentOutputData;
    this.makeExtractStepOutput = makeExtractStepOutput;
    this.isJsonInput = isJsonInput;
    this.isXmlInput = isXmlInput;
    this.isCustomInput = isCustomInput;
    this.isJsonOutput = isJsonOutput;
    this.isXmlOutput = isXmlOutput;
    this.isCustomOutput = isCustomOutput;
    this.isPdfOutput = isPdfOutput;
    this.isDocusignOutput = isDocusignOutput;
    this.isDocumentOutput = isDocumentOutput;
    this.handleFieldMappingChange = handleFieldMappingChange;
    this.inputChanged = inputChanged;
    this.expectedOutputChanged = expectedOutputChanged;
    this.toggleAccordian = toggleAccordian;
    this.$onInit = onInit;

    ////////////////////////////

    $scope.$watch('vm.showAllExtractFields', makeExtractStepOutput);
    $scope.$on('drbundle-mappings-updated', makeCurrentOutputData);

    var vm = this,
        jsonOutputPath = vm.ns + 'DomainObjectFieldAPIName__c',
        creationOrderKey = vm.ns + 'DomainObjectCreationOrder__c',
        fieldValueTypeKey = vm.ns + 'DomainObjectFieldType__c',
        defaultValueKey = vm.ns + 'DefaultValue__c',
        apiNameKey = vm.ns + 'DomainObjectAPIName__c';

    function onInit() {
        if (vm.bundle.$$mappings) {
            makeExtractStepOutput();
            makeCurrentOutputData();
        }
        $scope.$watch('vm.bundle.' + vm.bundleOutputTypeKey, function() {
            makeCurrentOutputData();
        });
    }

    function makeExtractStepOutput() {
        mappingService.getExtractionJson(vm.bundle.$$mappings, vm.showAllExtractFields)
            .then(function(obj) {
                vm.extractionStepOutput = obj;
            });
    }

    function isJsonInput() {
        return mappingService.isJsonInput(vm.bundle);
    }

    function isXmlInput() {
        return mappingService.isXmlInput(vm.bundle);
    }

    function isCustomInput() {
        return mappingService.isCustomInput(vm.bundle);
    }

    function isJsonOutput() {
        return mappingService.isJsonOutput(vm.bundle);
    }

    function isXmlOutput() {
        return mappingService.isXmlOutput(vm.bundle);
    }

    function isCustomOutput() {
        return mappingService.isCustomOutput(vm.bundle);
    }

    function isPdfOutput() {
        return mappingService.isPdfOutput(vm.bundle);
    }

    function isDocusignOutput() {
        return mappingService.isDocusignOutput(vm.bundle);
    }

    function isDocumentOutput() {
        return mappingService.isDocumentOutput(vm.bundle);
    }

    function handleFieldMappingChange() {
        vm.makeCurrentOutputData();
    }

    function makeCurrentOutputData() {   
        if (isJsonOutput() || isXmlOutput() || isCustomOutput()) {
            var jsonObject = {};
            vm.bundle.$$mappings.forEach(function (mapping) {
                if (mapping[creationOrderKey] !== 0 && mapping[apiNameKey] !== 'Formula' && mapping[jsonOutputPath]) {
                    var displayValue = getDisplayValue(mapping[defaultValueKey], mapping[fieldValueTypeKey]);
                    var jsonOutputPathStr = mapping[jsonOutputPath];

                    if (jsonOutputPathStr.includes('.')) {
                        var str = jsonOutputPathStr.split(':').map(function(value) {
                            if (value.includes('.')) {
                                value = '[\'' + value + '\']';
                            }

                            return value; 
                        });
                        jsonOutputPathStr = str.join(':');
                    }
                    
                    _.set(jsonObject, jsonOutputPathStr.replace(/:/g, '.'), displayValue);
                }
            });

            if (isXmlOutput()) {
                remoteActions.JsonToXml(JSON.stringify(jsonObject))
                    .then(function(xml) {
                        vm.currentOutputData = vkbeautify.xml(xml);
                    });
            } else if (isCustomOutput()) {
                remoteActions.CallCustomSerializeMethod(vm.bundle[vm.ns + 'CustomOutputClass__c'], JSON.stringify(jsonObject))
                    .then(function(response) {
                        if (response && typeof(response) === 'string') {
                            vm.currentOutputData = response;
                        }
                    });
            } else {
                vm.currentOutputData = jsonObject;
            }
        } else {
            var asProperties = '';
            vm.bundle.$$mappings.forEach(function (mapping) {
                if (mapping[creationOrderKey] !== 0 && mapping[apiNameKey] !== 'Formula' && mapping[jsonOutputPath]) {
                    var displayValue = getDisplayValue(mapping[defaultValueKey], mapping[fieldValueTypeKey]);
                    asProperties += mapping[jsonOutputPath].replace(/:/g, '.') + ' = ' + displayValue + '\n';
                }
            });
            vm.currentOutputData = asProperties;
        }
    }

    function getDisplayValue(defaultValue, fieldValueType) {
        switch (fieldValueType) {
            case 'Boolean': return true;

            case 'Double':  // fall through
            case 'Integer': return !isNaN(defaultValue) ? parseFloat(defaultValue) : 1;

            case 'JSON': return '{}';

            case 'List<Decimal>': //fall through
            case 'List<Double>': //fall through
            case 'List<Integer>': return [(!isNaN(defaultValue) ? parseFloat(defaultValue) : 1)];

            case 'List<String>': return ['Text'];

            case 'List<Map>': return [{}];

            case 'Object': return {};

            case 'Multi-Select': return 'A;B;C';

            default: return 'Text';
        }
    }

    function expectedOutputChanged() {
        saveBundle();
    }

    function inputChanged() {
        saveBundle();
    }

    function saveBundle() {
        mappingService.saveBundle(vm.bundle);
    }

    function toggleAccordian(openIfClosed, openIfOpen) {
        if (vm.currentSection === openIfClosed) {
            vm.currentSection = openIfOpen;
        } else {
            vm.currentSection = openIfClosed;
        }
    }
}

})();

},{}],28:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .directive('transformTabs', TransformTabs);

TransformTabs.$inject = [];

function TransformTabs() {
    return {
        restrict: 'ACE',
        bindToController: {
            bundle: '='
        },
        scope: {},
        templateUrl: 'transform/transformTabs.tpl.html',
        controllerAs: 'vm',
        controller: TransformTabsController
    };
}

TransformTabsController.$inject = [];

function TransformTabsController() {
    this.ns = fileNsPrefix();
    this.nsForUrl = this.ns.length === 0 ? '' : this.ns.replace('__', '/');
    this.activeTab = 1;
}

})();

},{}],29:[function(require,module,exports){
(function() {
'use strict';

angular.module('drmapper')
    .directive('turboExtractFieldsRow', TurboExtractFieldsRow);

TurboExtractFieldsRow.$inject = [];

function TurboExtractFieldsRow() {
    var directive = {
        restrict: 'EA',
        require: ['turboExtractFieldsRow', '^extractObjectRow'],
        bindToController: {
            objectName: '=',
            outputPath: '<',
            bundle: '=',
            loadingFields: '<?',
            onMappingAdded: '&'
        },
        scope: {},
        templateUrl: 'turboExtract/turboExtractFieldsRow.tpl.html',
        controllerAs: 'vm',
        controller: TurboExtractFieldsRowController,
        link: function(scope, element, attrs, controllers) {
            var TurboExtractFieldsRowController = controllers[0];
            var ExtractObjectRowController = controllers[1];
            TurboExtractFieldsRowController.setParentController(ExtractObjectRowController);
        }
    };
    return directive;
}

TurboExtractFieldsRowController.$inject = ['generateUniqueMapId', 'mappingService', '_', "sObjectFields", '$sldsToast', '$timeout'];

function TurboExtractFieldsRowController(generateUniqueMapId, mappingService, _, sObjectFields, $sldsToast, $timeout) {
    var vm = this;
    var defaultFields = ['Id'];
    this.ns = fileNsPrefix();
    this.fieldMappings = [];
    this.$onInit = onInit;
    this.$onChanges = onChanges;
    this.setFields = setFields;
    this.setParentController = setParentController;
    this.decorateParentController = decorateParentController;
    this.clearTurboFields = clearTurboFields;
    this.loadFieldsForPath = loadFieldsForPath;

    this.debug=true;

    //////////

    var vm = this,
        extractPath = vm.ns + 'DomainObjectFieldAPIName__c',
        creationOrderKey = vm.ns + 'DomainObjectCreationOrder__c',
        fieldAPIName = vm.ns + 'InterfaceFieldAPIName__c',
        objectName = vm.ns + 'InterfaceObjectName__c',
        mapIdKey = vm.ns + 'MapId__c',
        apiNameKey = vm.ns + 'DomainObjectAPIName__c';

    vm.fields = defaultFields;
    vm.fieldOpts = [];
    vm.requiredFields = defaultFields;
    vm.loadingPromises = new Set();
    vm.debouncePromises = {};
    vm.validPaths = {};

    vm.relObjPathChanged = relObjPathChanged;
    vm.pathOptDisplay = pathOptDisplay;

    Object.defineProperty(vm,'loading',{
        get: function(){
            return vm.loadingFlag || vm.loadingPromises.size;
        },
        set: function(val){
            return vm.loadingFlag = val;
        }
    });

    if(vm.debug){
        vm.log = console.log;
        Object.defineProperty(vm,'relObjPath',{
            get: function(){
                return vm._relObjPath;
            },
            set: function(val){
                vm.log('setting vm.relObjPath: '+vm._relObjPath+" -> "+val);
                vm._relObjPath = val;
            }
        });
    } else {
        vm.log = function(){}
    }
    vm.relObjPath = undefined;

    Object.defineProperty(vm,'relObjPathParent',{
        get: function(){
            return vm.relObjPath.substring(0,vm.relObjPath.lastIndexOf('.'));
        }
    });

    function debounce(fn, delay, invokeApply, pass) {
        if (vm.debouncePromises[fn]){
            $timeout.cancel(vm.debouncePromises[fn]);
            delete vm.debouncePromises[fn];
        }
        vm.debouncePromises[fn] = $timeout(fn, delay, invokeApply, pass).finally(function(){
            delete vm.debouncePromises[fn];
        });
        return vm.debouncePromises[fn];
    }

    function onInit() {
        setupFieldMappings();
        generateRelObjPathOpts();
        generateFieldOpts();
    }

    function onChanges(changesObj){
        generateRelObjPathOpts();
        generateFieldOpts();
    }


    function pathOptDisplay(opt){
        opt = opt == null ? "": opt;
        return vm.objectName.concat(".",opt).replace(/\.$/,'');
    }

    function relObjPathChanged () {
        // update options
        generateRelObjPathOpts();
        generateFieldOpts();
    }

    function setParentController(parentController) {
        vm.parentController = parentController;
        vm.decorateParentController();
    }

    function decorateParentController(){
        if (typeof vm.parentController.clearTurboFields !== 'function'){
            vm.parentController.clearTurboFields = vm.clearTurboFields;
        }
    }

    function clearTurboFields (){
        setFields(defaultFields);
    }

    // generate options for relObjPath
    function generateRelObjPathOpts(){
        vm.log("generateRelObjPathOpts");
        var tgt = [];
        var callPromise = {};
        if(vm.objectName){
            callPromise = loadRelationsForPath(vm.objectName,vm.relObjPath==null?'':vm.relObjPath.trim(),tgt);
            if (typeof callPromise.then === 'function'){
                callPromise.then(function(){
                    vm.relObjPathOpts = [];
                    vm.relObjPathOpts.push(undefined);
                    if(typeof vm.relObjPath === 'string'){
                        vm.relObjPath.split('.').forEach(function(segment,index,array){
                            var tmp = [];
                            for (var i = 0; i <= index; i++){
                                tmp.push(array[i]);
                            }
                            vm.relObjPathOpts.push(tmp.join('.'));
                        })
                    }
                    vm.relObjPathOpts = vm.relObjPathOpts.concat(
                        tgt.map(function(opt){
                            return opt.replace(/^\./,'').replace(/Id$/,'');
                        }).sort()
                    )
                })
            }
        }
    }

    // generate options for 
    function generateFieldOpts(){
        vm.log("generateRelObjFields");
        var resultTgt = []
        var callPromise = {};
        if(vm.objectName){
            if(vm.relObjPath == null || vm.relObjPath.trim() === '' ){
                callPromise = loadFieldNamesForObject(vm.objectName,resultTgt);
            } else {
                callPromise = loadFieldsForPath(vm.objectName,vm.relObjPath,resultTgt);
            }
            if (typeof callPromise.then === 'function'){
                callPromise.then(function(){
                    if(resultTgt.length){
                        vm.fieldOpts = resultTgt.map(function(field){
                            return{
                                value: field,
                                label: field
                            }
                        });
                    }
                });
            }
        }
    }

    // call sObjectFields.getFieldsForObject and adapt for local use
    function loadFieldNamesForObject(objectName, tgt){
        vm.log("loadFieldNamesForObject(\""+objectName+"\", tgt)");
        vm.loadingFields = true;
        return sObjectFields.getFieldsForObject(objectName)
            .then(function(fields) {
                fields = Object.keys(fields).sort()
                    .filter(function(fieldName){
                        return fields[fieldName].type !== "ADDRESS"
                    })
                vm.log(fields)
                if(fields.length){
                    while(tgt.length){
                        tgt.pop();
                    }
                    for(var i = 0; i < fields.length; i++){
                        tgt.push(fields[i]);
                    }
                }
                vm.loadingFields = false;
            }).catch(function(error) {
                vm.loadingFields = false;
                $sldsToast({
                    title: 'Failed to load fields for ' + objectName,
                    content: error.message,
                    severity: 'error',
                    autohide: false
                });
            });
    }

    // call sObjectFields.getFieldsForObject and adapt for local use
    function loadFieldsForPath (objectName, path, tgt){
        vm.log("loadFieldsForPath(\""+objectName+"\", \""+path+"\", tgt)");
        vm.loadingFields = true;
        return sObjectFields.getAllSObjectFieldsByReferenceToPath(objectName,path)
        .then(function(fields) {
            if(fields.length<=0){
                return;
            }
            fields = Object.keys(fields).sort()
                .map(function(i) {
                    return fields[i];
                });
            vm.log(fields)
            if(fields.length){
                while(tgt.length){
                    tgt.pop();
                }
                for(var i = 0; i < fields.length; i++){
                    tgt.push(fields[i]);
                }
            }
            vm.loadingFields = false;
        }).catch(function(error) {
            vm.loadingFields = false;
            $sldsToast({
                title: 'Failed to load fields for ' + objectName + ', ' + path,
                content: error.message,
                severity: 'error',
                autohide: false
            });
        });
    }

    // call sObjectFields.getRelationsForPath and adapt for local use
    function loadRelationsForPath (objectName, path, tgt){
        vm.log("loadRelationsForPath(\""+objectName+"\", \""+path+"\", tgt)");
        vm.loadingFields = true;
        return sObjectFields.getRelationsByPath(objectName,path)
        .then(function(fields) {
            if(fields.length<=0){
                return;
            }
            fields = Object.keys(fields).sort()
                .map(function(i) {
                    return fields[i];
                });
            vm.log(fields)
            if(fields.length){
                while(tgt.length){
                    tgt.pop();
                }
                for(var i = 0; i < fields.length; i++){
                    tgt.push(fields[i]);
                }
            }
            vm.loadingFields = false;
        }).catch(function(error) {
            vm.loadingFields = false;
            $sldsToast({
                title: 'Failed to load relations for ' + objectName + ', ' + path,
                content: error.message,
                severity: 'error',
                autohide: false
            });
        });
    }

    function setupFieldMappings() {
        if (vm.bundle.$$mappings) {
            var mappings = vm.bundle.$$mappings;
            vm.fieldMappings = mappings.filter(function(mapping) {
                var matchesBaseFilter = mapping[creationOrderKey] !== 0 && mapping[apiNameKey] !== 'Formula';
                if (matchesBaseFilter && vm.mappingFilter) {
                    return vm.mappingFilter({
                        mapping: mapping
                    });
                }
                return matchesBaseFilter;
            });
            updateFieldsList();
        }
    }

    function updateFieldsList(){
        var tmp = [];
        vm.fieldMappings.forEach(function(mapping){
            tmp.push(mapping[fieldAPIName]);
        })
        vm.fields = _.union(vm.fields, tmp);
    }

    function setFields(picklistFields){
        const removals = _.differenceWith(vm.fields, picklistFields);
        const additions = _.differenceWith(picklistFields,vm.fields);
        deleteFieldMappings(removals);
        addFieldMappings(additions);
        vm.fields = picklistFields;
    }

    function addFieldMappings(fieldNames){
        if (!fieldNames.length){
            return;
        }
        vm.loading = true;
        fieldNames.forEach(addFieldMapping);
        vm.loading = false;
    }

    function addFieldMapping(fieldName) {
        vm.loadingPromises.add(fieldName)
        var mapping = {
            Name: vm.bundle.Name
        };
        mapping[fieldAPIName] = fieldName;
        mapping[objectName] = vm.objectName;
        mapping[extractPath] = vm.outputPath;
        mapping[mapIdKey] = generateUniqueMapId();
        mapping[apiNameKey] = 'Turbo Extract';
        mapping[creationOrderKey] = 1;
        mapping[vm.ns + 'IsDisabled__c'] = false;
        mapping[vm.ns + 'IsRequiredForUpsert__c'] = false;
        mapping[vm.ns + 'UpsertKey__c'] = false;
        mappingService.saveMapping(mapping).then(function(){
            vm.fieldMappings.splice(0, 0, mapping);
            vm.bundle.$$mappings.splice(0, 0, mapping);
            vm.loadingPromises.delete(fieldName)
        },function(){
            vm.loadingPromises.delete(fieldName)
        });
    }

    function deleteFieldMappings(fieldNames){
        if (!fieldNames.length){
            return;
        }
        vm.loading = true;
        var mappings = fieldNames.map(function(fieldName){
            return vm.fieldMappings.find(function(existingMapping){
                return existingMapping[fieldAPIName] === fieldName;
            })
        });
        mappingService.deleteMappings(mappings,null,true)
            .then(function(doDelete) {
                vm.loading = false;
                if (doDelete) {
                    doDelete.forEach(
                        function(mapping){
                            vm.fieldMappings = vm.fieldMappings.filter(function(existingMapping) {
                                return mapping[mapIdKey] !== existingMapping[mapIdKey];
                            });
                            vm.bundle.$$mappings = vm.bundle.$$mappings.filter(function(existingMapping) {
                                return mapping[mapIdKey] !== existingMapping[mapIdKey];
                            });
                        }
                    );
                } else {
                    setupFieldMappings();
                    $sldsToast({
                        title: 'Failed to remove mappings: ' + fieldNames,
                        content: 'Contact Support if this problem persists',
                        severity: 'error',
                        autohide: false
                    });
                }
            },
            function(err){
                setupFieldMappings();
                console.log(err);
                $sldsToast({
                    title: 'Failed to remove mappings: ' + fieldNames,
                    content: err + '. Contact Support if this problem persists',
                    severity: 'error',
                    autohide: false
                });
                vm.loading = false;
            });
        }
}

})();

},{}],30:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .factory('sObjectFields', SObjectFieldsFactory);

SObjectFieldsFactory.$inject = ['$q', 'remoteActions', '_'];

function SObjectFieldsFactory(q, remoteActions, _) {
    var allFieldsForObjects = {};
    var allFieldsForPath = {};
    var relationsForPath = {};
    var jsonSeperator = ':';
    var sObjectFields =  {
        getFieldsForObject: getFieldsForObject,
        getAllSObjectFieldsByReferenceToPath: getAllSObjectFieldsByReferenceToPath,
        getRelationsByPath: getRelationsByPath,
        syncGetFieldsForObject: syncGetFieldsForObject,
        getFieldNamesForObject: getFieldNamesForObject,
        /* Util for getting all fields in JSON object without saving */
        getFieldsForJson: getFieldsForJson,
        addFieldsForJson: addFieldsForJson
    };
    return sObjectFields;

    //////////////////

    function allFieldsInJSON(jsonObject, prefix) {
        var fields = [], keys
        if (angular.isArray(jsonObject)) {
            fields = jsonObject.reduce(function(array, object) {
                return array.concat(allFieldsInJSON(object, prefix));
            }, []);
        } else if (angular.isObject(jsonObject)) {
            keys = Object.keys(jsonObject);
            if (keys.length === 0 && prefix !== undefined) {
                fields.push(prefix);
            }
            keys.forEach(function(prop) {
                var fullProp = prefix ? prefix + jsonSeperator + prop : prop;
                if (jsonObject[prop] === null || typeof jsonObject[prop] !== 'object') {
                    fields.push(fullProp);
                } else {
                    fields = fields.concat(allFieldsInJSON(jsonObject[prop], fullProp));
                }
            });
        }
        return fields;
    }

    function getFieldsForObject(objectName) {
        if (!objectName) {
            return q(function(resolve) {
                resolve([]);
            });
        }
        var existingValue = allFieldsForObjects[objectName];
        if (existingValue) {
            return q.when(existingValue);
        } else if (objectName !== 'json') {
            allFieldsForObjects[objectName] = remoteActions.GetFieldsForObject(objectName)
                .then(function(fields) {
                    var fieldsMap = {};
                    if (fields) {
                        Object.keys(fields).forEach(function(fieldName) {
                            if (!/^(DRBundleName__c|DRError__c|DRProgressData__c|DRStatus__c)$/.test(fieldName)) {
                                fieldsMap[fieldName] = fields[fieldName];
                            }
                        });
                    }
                    allFieldsForObjects[objectName] = fieldsMap;
                    return allFieldsForObjects[objectName];
                });
            return allFieldsForObjects[objectName];
        } else {
            return q.when([]);
        }
    }

    // call remoteActions.getAllSObjectFieldsByReferenceToPath() and apply some basic filtering to output
    function getAllSObjectFieldsByReferenceToPath(objectName,path) {
        if (!objectName || !path) {
            return q(function(resolve) {
                resolve([]);
            });
        }

        if (!allFieldsForPath[objectName]){
            allFieldsForPath[objectName] = {};
        }
        var existingValue = allFieldsForPath[objectName][path];

        if (existingValue) {
            return q.when(existingValue);
        } else if (objectName !== 'json') {
            allFieldsForPath[objectName][path] = remoteActions.getAllSObjectFieldsByReferenceToPath(objectName,path)
                .then(
                    function(fields) {
                        var fieldsMap = {};
                        if (fields) {
                            Object.keys(fields).forEach(function(fieldName) {
                                if (!/^(DRBundleName__c|DRError__c|DRProgressData__c|DRStatus__c)$/.test(fieldName)) {
                                    fieldsMap[fieldName] = fields[fieldName];
                                }
                            });
                        }
                        allFieldsForPath[objectName][path] = fieldsMap;
                        return allFieldsForPath[objectName][path];
                    }
                );
            return allFieldsForPath[objectName][path];
        } else {
            return q.when([]);
        }
    }

    // call remoteActions.getRelationsByPath() and apply some basic filtering to output
    function getRelationsByPath(objectName,path) {
        if (!objectName) {
            return q(function(resolve) {
                resolve([]);
            });
        }
        if (!path) {
            path = "";
        }

        if (!relationsForPath[objectName]){
            relationsForPath[objectName] = {};
        }
        var existingValue = relationsForPath[objectName][path];

        if (existingValue) {
            return q.when(existingValue);
        } else if (objectName !== 'json') {
            relationsForPath[objectName][path] = remoteActions.getRelationsByPath(objectName,path)
                .then(
                    function(fields) {
                        var fieldsMap = {};
                        if (fields) {
                            Object.keys(fields).forEach(function(fieldName) {
                                if (!/^(DRBundleName__c|DRError__c|DRProgressData__c|DRStatus__c)$/.test(fieldName)) {
                                    fieldsMap[fieldName] = fields[fieldName];
                                }
                            });
                        }
                        relationsForPath[objectName][path] = fieldsMap;
                        return relationsForPath[objectName][path];
                    }
                );
            return relationsForPath[objectName][path];
        } else {
            return q.when([]);
        }
    }

    function syncGetFieldsForObject(objectName, asArray) {
        if (!objectName) {
            return asArray ? [] : {};
        }
        if (asArray) {
            var startArray = [];
            return startArray.concat(Object.keys(allFieldsForObjects[objectName]).map(function(key) {
                return allFieldsForObjects[objectName][key];
            }).sort(function(a, b) {
                var aName = a.name || '',
                    bName = b.name || '';
                return +(aName.toLowerCase() > bName.toLowerCase()) || +(aName.toLowerCase() === bName.toLowerCase()) - 1;
            }));
        }
        return allFieldsForObjects[objectName];
    }

    function getFieldNamesForObject(sObject) {
        return getFieldsForObject(sObject)
            .then(function(fields) {
                return Object.keys(fields)
                    .map(function(fieldName) {
                        return {
                            value: fieldName,
                            readableName: fieldName,
                            label: fieldName
                        };
                    });
            })
            .then(function(fields) {
                fields.sort(sortFieldsByLabel);
                return fields;
            });
    }

    function getFieldsForJson(json) {
        if (angular.isString(json)) {
            try {
                json = JSON.parse(json);
            } catch (e) {
                // ignore errors from parsing JSON
                return [];
            }
        }
        if (angular.isObject(json)) {
            var allFields = json;
            if (angular.isObject(json) && !angular.isArray(json)) {
                allFields = allFieldsInJSON(json);
            }
            return _.uniq(allFields);
        } else {
            return [];
        }
    }

    function addFieldsForJson(json) {
        if (json) {
            var allFields = getFieldsForJson(json);
            allFieldsForObjects.json = {};
            allFields.forEach(function(fieldName) {
                allFieldsForObjects.json[fieldName] = {
                    isInputable: true,
                    isRequired: false,
                    name: fieldName
                };
            });
        }
    }

    function sortFieldsByLabel(v1, v2) {
        var partsV1 = v1.label.toLowerCase().split(':'),
        partsV2 = v2.label.toLowerCase().split(':');
        var index = 0;
        while (index < partsV1.length) {
            if (!partsV2[index]) {
                return 1;
            }
            if (partsV1[index] < partsV2[index]) {
                return -1;
            } else if (partsV1[index] > partsV2[index]) {
                return 1;
            }
            index++;
        }
        return 0;
    }

}
})();

},{}],31:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('drmapper')
        .factory('sObjects', sObjectsService);

    sObjectsService.$inject = ['remoteActions', '$q'];

    function sObjectsService(remoteActions, $q) {
        var service = {
            getAllObjects: getAllObjects
        };

        var sObjects = null;
        var inProgressPromise = null;
        var currentIndex = 0;
        var inProgressSObjects = [];

        return service;

        ////////////////
        function getAllObjects() {
            if (sObjects) {
                return $q.resolve(sObjects);
            }

            return getObjectsFromRemote()
                .then(function (resolvedSObjects) {
                    return sObjects = resolvedSObjects;
                });
        }

        function getObjectsFromRemote() {
            if (inProgressPromise) {
                return inProgressPromise;
            }
            // We're loading these async to avoid timeouts in the page.
            inProgressPromise = groupPagedRequests()
                .then(function (allSObjects) {
                    inProgressPromise = null;
                    return allSObjects;
                })
                .catch(function () {
                    inProgressPromise = null;
                })

            return inProgressPromise;
        }

        /**
         * a bit of hack to put a number of requests at the same time
         */
        function groupPagedRequests() {
            var pageSize = 5,
                requests = [];
            for (var i = 0; i < pageSize; i++) {
                requests.push(getObjectsPaged());
            }
            return $q.all(requests)
                .then(function() {
                    return inProgressSObjects;
                });
        }

        function getObjectsPaged() {
            return remoteActions.GetAllObjectsPaged(currentIndex++)
                .then(function (sObjects) {
                    inProgressSObjects = inProgressSObjects.concat(sObjects.map(function (sObject) {
                        return Object.assign({}, sObject, {
                            "value": sObject.name,
                            "readableName": sObject.name,
                            "label": sObject.name
                        });
                    }));
                    if (sObjects.length > 0) {
                        return getObjectsPaged();
                    } else {
                        return inProgressSObjects;
                    }
                })
        }
    }
})();

},{}],32:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('drmapper')
        .factory('DocumentService', DocumentService);

    DocumentService.$inject = ['remoteActions', '$q', '$window', 'sObjectFields', '_'];
    function DocumentService(remoteActions, $q, $window, sObjectFields, _) {
        var ns = fileNsPrefix(),
            cachedDocusignTemplates = {},
            service = {
            getPDFs: getPDFs,
            getDocusignTemplates: getDocusignTemplates,
            getDocumentTemplates: getDocumentTemplates,
            getFields: getFields,
            backcompatFigureOutIfPDForDocumentTemplate: backcompatFigureOutIfPDForDocumentTemplate
        };

        return service;

        ////////////////

        function backcompatFigureOutIfPDForDocumentTemplate(nameOfDocument) {
            return $q.all([remoteActions.GetDocuments(), remoteActions.getAllJSONBasedDocumentTemplates()])
                    .then(function(results) {
                        // find in PDFS
                        var isAPDF = false;
                        _.forEach(results[0], function(pdf) {
                            isAPDF = pdf.DeveloperName === nameOfDocument;
                            return !isAPDF;
                        });

                        if (!isAPDF) {
                            var isDocTemplate = false;
                            _.forEach(results[1], function(docName) {
                                isDocTemplate = docName === nameOfDocument;
                                return !isDocTemplate;
                            });
                            if (isDocTemplate) {
                                return 'Document Template';
                            }
                        }
                        // default to PDF
                        return 'PDF';
                    });
        }

        function getPDFs() {
            return remoteActions.GetDocuments()
                .then(function(pdfs) {
                    return pdfs.map(function(pdf) {
                        return {
                            value: pdf.DeveloperName,
                            label: pdf.DeveloperName
                        };
                    });
                });
        }

        function getDocusignTemplates() {
            return remoteActions.getDocuSignTemplates()
                .then(function(docusign) {
                    cachedDocusignTemplates = docusign.reduce(function(map, doc) {
                        map[doc[ns + 'TemplateIdentifier__c']] = doc;
                        return map;
                    }, {});
                    return docusign.map(function(pdf) {
                        return {
                            value: pdf[ns + 'TemplateIdentifier__c'],
                            label: pdf.Name
                        };
                    });
                });
        }

        function getDocumentTemplates() {
            return remoteActions.getAllJSONBasedDocumentTemplates()
                .then(function(worddocs) {
                    return worddocs.map(function(doc) {
                        return {
                            value: doc,
                            label: doc
                        };
                    });
                });
        }

        function getFields(bundle) { 
            switch (bundle[ns + 'OutputType__c']) {
                case 'PDF': return getPDFFields(bundle);
                case 'DocuSign': return getDocusignFields(bundle);
                case 'Document Template': return getDocumentTemplateFields(bundle);
                default: return null;
            }
        }

        function getPDFFields(bundle) {
            if (!bundle[ns + 'TargetOutPdfDocName__c']) {
                return $q.when([]);
            }
            return remoteActions.GetDocumentData(bundle[ns + 'TargetOutPdfDocName__c'])
                .then(function(dataAsString) {
                    var outputMap = {};
                    var buffer = new $window.buffer.Buffer(dataAsString, 'base64');
                    var fields = $window.vlocityPdfWriter.getFormFields(buffer);
                    if (!fields) {
                        return [];
                    }

                    fields.forEach(function(field) {
                        outputMap[field] = '';
                    });

                    outputMap = JSON.stringify(outputMap);

                    if (bundle[ns + 'TargetOutJson__c'] != outputMap) {
                        bundle[ns + 'TargetOutJson__c'] = outputMap;
                    }

                    return fields.map(function(field) {
                        return {
                            value: field,
                            label: field
                        };
                    });
                })
                .catch(function(err) {
                    console.warn('Failed to parse PDF', err);
                    return [];
                });
        }

        function getDocusignFields(bundle) {
            if (!bundle[ns + 'TargetOutDocuSignTemplateId__c']) {
                return $q.when([]);
            }
            return remoteActions.getDocuSignTemplateData(bundle[ns + 'TargetOutDocuSignTemplateId__c'])
                .then(function(tabData) {
                    var json = angular.fromJson(tabData.replace(/&quot;/g,'"'));
                    return sObjectFields.getFieldsForJson(json)
                        .map(function(field) {
                            return {
                                value: field,
                                label: field
                            };
                        });
                });
        }

        function getDocumentTemplateFields(bundle) {
            if (!bundle[ns + 'TargetOutPdfDocName__c']) {
                return $q.when([]);
            }
            return remoteActions.getAllTokensForJSONBasedDocumentTemplate(bundle[ns + 'TargetOutPdfDocName__c'])
                .then(function(result) {
                    return result.map(function(field) {
                        return {
                            value: field,
                            label: field
                        };
                    });
                });
        }
    }
})();

},{}],33:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .service('generateUniqueMapId', GenerateUniqueMapIdService);

GenerateUniqueMapIdService.$inject = ['DRBundle'];

function GenerateUniqueMapIdService(bundle) {
    return generateUniqueMapId;

    function generateUniqueMapId() {
        var allIds = bundle.$$mappings.reduce(function(obj, mapping) {
            obj[mapping[fileNsPrefix() + 'MapId__c']] = true;
            return obj;
        }, {});
        var uniqueId = bundle.Name + 'Custom' + getRandomInt(0,10000);
        while (allIds[uniqueId]) {
            uniqueId = bundle.Name + 'Custom' + getRandomInt(0,10000);
        }
        return uniqueId;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

})();

},{}],34:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('drmapper')
        .factory('mappingService', MappingService);

    MappingService.$inject = ['$sldsToast', 'remoteActions', '$q', '_', '$sldsDeletePrompt', 'sObjectFields',
                                'DocumentService', '$window', 'attributesJson', 'mappingSort'];

    function MappingService($sldsToast, remoteActions, $q, _, $sldsDeletePrompt,
                            sObjectFields, DocumentService, $window, attributesJson, mappingSort) {
        var pendingSave = {},
            ns = fileNsPrefix(),
            bundleTypeKey = ns + 'Type__c',
            objectNameKey = ns + 'InterfaceObjectName__c',
            outputPathKey = ns + 'DomainObjectFieldAPIName__c',
            creationOrderKey = ns + 'DomainObjectCreationOrder__c',
            apiNameKey = ns + 'DomainObjectAPIName__c',
            inputTypeKey = ns + 'InputType__c',
            outputTypeKey = ns + 'OutputType__c';
        return {
            isTransform: isTransform,
            isExtract: isExtract,
            isTurboExtract: isTurboExtract,
            isLoad: isLoad,
            isJsonInput: isJsonInput,
            isXmlInput: isXmlInput,
            isCustomInput: isCustomInput,
            isSObjectInput: isSObjectInput,
            isJsonOutput: isJsonOutput,
            isXmlOutput: isXmlOutput,
            isCustomOutput: isCustomOutput,
            isPdfOutput: isPdfOutput,
            isDocusignOutput: isDocusignOutput,
            isDocumentOutput: isDocumentOutput,
            saveBundle: saveBundle,
            saveMapping: saveMapping,
            deleteMapping: deleteMapping,
            deleteMappings: deleteMappings,
            getLoadObjects: getLoadObjects,
            getExtractionJson: getExtractionJson,
            getInputMappings: getInputMappings,
            getOutputMappings: getOutputMappings,
            getFormulaOutputFields: getFormulaOutputFields,
            getAttributes: getAttributes,
            preprocessDownloadedMapping: preprocessDownloadedMapping
        };

        function isTransform(bundle) {
            return bundle[bundleTypeKey] === 'Transform';
        }

        function isExtract(bundle) {
            return bundle[bundleTypeKey] === 'Extract';
        }

        function isTurboExtract(bundle) {
            return bundle[bundleTypeKey] === 'Turbo Extract';
        }

        function isLoad(bundle) {
            return bundle[bundleTypeKey] === 'Load';
        }

        function isJsonInput(bundle) {
            return bundle[inputTypeKey] === 'JSON';
        }

        function isXmlInput(bundle) {
            return bundle[inputTypeKey] === 'XML';
        }

        function isCustomInput(bundle) {
            return bundle[inputTypeKey] === 'Custom';
        }

        function isSObjectInput(bundle) {
            return bundle[inputTypeKey] === 'SObject';
        }

        function isJsonOutput(bundle) {
            return bundle[outputTypeKey] === 'JSON';
        }

        function isXmlOutput(bundle) {
            return bundle[outputTypeKey] === 'XML';
        }

        function isCustomOutput(bundle) {
            return bundle[outputTypeKey] === 'Custom';
        }

        function isPdfOutput(bundle) {
            return bundle[outputTypeKey] === 'PDF';
        }

        function isDocusignOutput(bundle) {
            return bundle[outputTypeKey] === 'DocuSign';
        }

        function isDocumentOutput(bundle) {
            return bundle[outputTypeKey] === 'Document Template';
        }

        function getDeleteMappingTitle(mapping) {
            if (mapping[ns + 'DomainObjectAPIName__c'] === 'Formula') {
                return 'Formula';
            }
            return mapping[ns + 'DomainObjectFieldAPIName__c'] || 'Mapping';
        }

        function deleteMappings(mappings, name, force) {
            if (force) {
                return doDelete(mappings)();
            }
            return $sldsDeletePrompt({
                Name: name || getDeleteMappingTitle(mappings[0])
            }, doDelete(mappings));
        }

        function deleteMapping(mapping, force) {
            if (force) {
                return doDelete([mapping])();
            }
            return deleteMappings([mapping]);
        }

        function doDelete(mappings) {
            return function () {
                return remoteActions.DeleteMappings(adaptMappingsForDelete(mappings))
                    .then(function () {
                        return mappings;
                    });
            };
        }

        function adaptMappingsForDelete(mappings) {
            return mappings.filter(function (mapping) {
                return !!mapping.Id;
            }).map(function (mapping) {
                return {
                    Id: mapping.Id
                };
            });
        }

        var pendingBundleSave = null;
        function saveBundle(bundle) {
            bundle[ns + 'DRMapName__c'] = bundle.Name;
            if (!bundle[ns + 'InterfaceObject__c'] &&
                bundle[ns + 'Type__c'] !== 'Load' &&
                bundle[ns + 'InputType__c'] !== 'SObject') {
                bundle[ns + 'InterfaceObject__c'] = 'json';
            }
            var newJson = angular.toJson(bundle);
            if (newJson === bundle.$$originalJSON) {
                return $q.when(bundle);
            }
            if (pendingBundleSave) {
                return pendingBundleSave.then(function () {
                    return saveBundle(bundle);
                })
                .then(function() {
                    return bundle;
                });
            }
            bundle.$$saving = true;
            var newUrl = null,
                isConsole = $window.top !== $window && typeof sforce !== 'undefined' && sforce.console && sforce.console.isInConsole();
            pendingBundleSave = remoteActions.SaveBundle(angular.fromJson(newJson))
                    .then(function(updatedBundle) {
                        var location = $window.location;
                        var pageName = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
                        if (!bundle.Id) {
                            newUrl = '/apex/' + ns + pageName +
                                        (location.search.length === 0 ? '?' :
                                        location.search + '&') + 'id=' + updatedBundle.Id;
                            if (!isConsole) {
                                if (!$window.history.state) {
                                    $window.history.pushState({},'', newUrl);
                                } else {
                                    $window.history.replaceState({},'', newUrl);
                                }
                            }
                        }
                        var titleEl = document.querySelector('title');
                        if (titleEl) {
                            titleEl.innerText = 'Dataraptor: ' + bundle.Name;
                        }
                        sforce.console.setTabTitle(bundle.Name);
                        _.assign(bundle, updatedBundle);
                        // have we changed the Type__c to Load?
                        var oldJson = angular.fromJson(bundle.$$originalJSON);
                        var didTypeChange = (oldJson[ns + 'Type__c'] !== bundle[ns + 'Type__c']);
                        bundle.$$originalJSON = angular.toJson(bundle);
                        var promises = [];
                        // now update all Mappings to have right bundle Name
                        bundle.$$mappings.forEach(function(mapping) {
                            
                            if (mapping.Name != bundle.Name) {
                                mapping[ns + 'MapId__c'] = bundle.Name + (''+Math.random()).substr(2);
                            }

                            mapping.Name = bundle.Name;                            
                            
                            if (didTypeChange && bundle[ns + 'Type__c'] === 'Load') {
                                // we can't save because it's now invalid mapping
                                mapping[ns + 'DomainObjectAPIName__c'] = '';
                            } else {
                                promises.push(saveMapping(mapping));
                            }
                        });

                        if (didTypeChange && bundle[ns + 'Type__c'] !== 'Load') {
                            // we need to remove all fakeMappings
                            bundle.$$mappings = bundle.$$mappings.filter(function(mapping) {
                                if (mapping.$$fakeMapping) {
                                    promises.push(deleteMapping(mapping, true));
                                    return false;
                                }
                                return true;
                            });
                        }
                        return $q.all(promises);
                    })
                    .then(function() {
                        if ($window.top !== $window && newUrl) {
                            if (isConsole) {
                                sforce.console.getEnclosingPrimaryTabId(function(parentTabResponse) {
                                    sforce.console.getEnclosingTabId(function(response) {
                                        if (response.id === parentTabResponse.id) {
                                            sforce.console.openPrimaryTab(null, newUrl, true);
                                        } else {
                                            sforce.console.openSubtab(parentTabResponse.id, newUrl, true, '');
                                        }
                                        sforce.console.closeTab(response.id);
                                    });
                                });
                            } else if ($window.sforce && $window.sforce.one && $window.sforce.one.navigateToURL) {
                                $window.sforce.one.navigateToURL(newUrl);
                            }
                        }
                    })
                    .finally(function() {
                        bundle.$$saving = false;
                        pendingBundleSave = null;
                    });
            return pendingBundleSave;
        }

        function saveMapping(mapping) {

            if (mapping.$$fakeMapping &&
                mapping[ns + 'LinkCreatedIndex__c'] &&
                mapping[ns + 'LinkCreatedField__c']) {
                mapping.$$fakeMapping = false;
            }

            if (!mapping[ns + 'DomainObjectFieldAPIName__c'] ||
                (!mapping[ns + 'DomainObjectAPIName__c'] && mapping.$$fakeMapping) ||
                mapping[ns + 'DomainObjectCreationOrder__c'] == null) {
                return $q.when(mapping);
            }
            var newJson = angular.toJson(mapping);
            if (mapping.$$originalJSON && _.isEqual(JSON.parse(newJson), JSON.parse(mapping.$$originalJSON))) {
                return $q.when(mapping);
            }
            if (pendingSave[mapping[ns + 'MapId__c']]) {
                return pendingSave[mapping[ns + 'MapId__c']]
                    .then(function () {
                        return saveMapping(mapping);
                    })
                    .then(function () {
                        return mapping;
                    });
            }
            mapping.$$saving = true;
            mapping.$$error = false;
            var presaveJson = preprocessMappingBeforeSave(angular.fromJson(newJson));
            pendingSave[mapping[ns + 'MapId__c']] = remoteActions.SaveMapping(presaveJson)
                .then(function (updatedMapping) {
                    preprocessDownloadedMapping(updatedMapping);
                    _.assign(mapping, updatedMapping);
                    mapping.$$originalJSON = angular.toJson(updatedMapping);
                    mapping.$$saving = false;
                    return mapping;
                }).catch(function (error) {
                    $sldsToast({
                        title: 'Failed to save mapping ',
                        content: error.message,
                        severity: 'error',
                        autohide: false
                    });
                    mapping.$$saving = false;
                    mapping.$$error = true;
                    throw error;
                }).finally(function() {
                    pendingSave[mapping[ns + 'MapId__c']] = undefined;
                });
            return pendingSave[mapping[ns + 'MapId__c']];
        }

        function getExtractionJson(mappings, allFields) {
            var obj = {},
                promises = [];
            if (!mappings) {
                return;
            }
            mappings.filter(function (mapping) {
                return mapping[apiNameKey] !== 'Formula' &&
                    mapping[creationOrderKey] === 0;
            }).forEach(function (mappings) {
                var property = mappings[outputPathKey];
                var val;
                if (property) {
                    val = _.get(obj, property.replace(/:/g, '[0].') + '[0]', {});
                    _.set(obj, property.replace(/:/g, '[0].') + '[0]', Object.assign({}, val || {}));
                    if (allFields) {
                        var promise = sObjectFields.getFieldNamesForObject(mappings[objectNameKey])
                            .then(function (fields) {
                                if (allFields && fields) {
                                    fields.forEach(function (field) {
                                        _.set(obj, property.replace(/:/g, '[0].') + '[0].' + field.value, '');
                                    });
                                }
                            });
                        promises.push(promise);
                        // also support attributes
                        var attrPromise = getAttributes(mappings[objectNameKey])
                            .then(function(attributes) {
                                if (allFields && attributes) {
                                    attributes.forEach(function (field) {
                                        _.set(obj, property.replace(/:/g, '[0].') + '[0].' + field.value, '');
                                    });
                                }
                            });
                        promises.push(attrPromise);
                    }
                }
            });
            // always add at least one promise to resolve with the object
            promises.push($q.when(obj));
            return $q.all(promises).then(function () {
                return obj;
            });
        }

        function getInputMappings(bundle) {
            var promise = $q.when([]);
            if (isLoad(bundle)) {
                promise = getTransformInputMappings(bundle);
            }
            if (isTransform(bundle)) {
                promise = getTransformInputMappings(bundle);
            }
            if (isExtract(bundle)) {
                promise = getExtractInputMappings(bundle);
            }
            if (isTurboExtract(bundle)) {
                promise = getTurboExtractInputMappings(bundle);
            }
            return promise.then(function(fields) {
                var allFields = _.uniqBy(getFormulaOutputFields(bundle).concat(fields), 'value');
                allFields.sort(sortFieldsByLabel);
                return allFields;
            });
        }

        function getOutputMappings(bundle, returnAllSuggested) {
            var promise;

            if (isTransform(bundle)) {
                promise = getTransformOutputMappings(bundle);
            } else if (isExtract(bundle)) {
                promise = getExtractOutputMappings(bundle);
            } else if (isTurboExtract(bundle)) {
                promise = getTurboExtractOutputMappings(bundle);
            } else if (returnAllSuggested && isLoad(bundle)) {
                promise = getSuggestedLoadOutputMappings(bundle);
            } else {
                promise = $q.when([]);
            }
            return promise.then(function(fields) {
                var allFields = _.uniqBy(fields, 'value');
                allFields.sort(sortFieldsByLabel);
                return allFields;
            });
        }

        function mapStringToPicklistObject(string) {
            if (angular.isString(string)) {
                return {
                    label: string,
                    value: string
                };
            }
            // if not string just return as is
            return string;
        }

        function mapFieldsToPicklistArray(fields) {
            return fields.map(mapStringToPicklistObject);
        }

        function getTransformInputMappings(bundle) {
            if (isJsonInput(bundle)) {
                return getFieldsFromJSON(bundle[ns + 'InputJson__c']);
            } else if (isXmlInput(bundle)) {
                return getFieldsFromJSON(xmlToJson(bundle[ns + 'InputXml__c']));
            } else if (isSObjectInput(bundle)) {
                return sObjectFields.getFieldNamesForObject(bundle[ns + 'InterfaceObject__c']);
            } else if (isCustomInput(bundle)) {
                return callCustomClass(bundle[ns + 'CustomInputClass__c'], bundle[ns + 'InputCustom__c']);
            }
        }

        function getExtractInputMappings(bundle) {
            return $q.all([
                    getExtractionJson(bundle.$$mappings, true)
                        .then(function (obj) {
                            return sObjectFields.getFieldsForJson(obj);
                        }).then(mapFieldsToPicklistArray),
                    getFieldsFromJSON(bundle[ns + 'InputJson__c'])
                ])
                .then(function(results) {
                    if (results[1].length > 0) {
                        return results[0].concat(results[1]);
                    }
                    return results[0];
                });
        }

        function getTurboExtractInputMappings(bundle) {
            return $q.all([
                    getExtractionJson(bundle.$$mappings, true)
                        .then(function (obj) {
                            return sObjectFields.getFieldsForJson(obj);
                        }).then(mapFieldsToPicklistArray),
                    getFieldsFromJSON(bundle[ns + 'InputJson__c'])
                ])
                .then(function(results) {
                    if (results[1].length > 0) {
                        return results[0].concat(results[1]);
                    }
                    return results[0];
                });
        }

        function callCustomClass(className, data) {
            return remoteActions.CallCustomDeserializeMethod(className, data)
            .then(function(response) {
                if (response && typeof(response) === 'string') {
                    var obj = JSON.parse(response);
                    if (obj && angular.isArray(obj) && obj.length > 0) {
                        obj = obj[0];
                    }
                    return getFieldsFromJSON(obj);
                }
            });
        }

        function getTransformOutputMappings(bundle) {
            if (isJsonOutput(bundle)) {
                return getFieldsFromJSON(bundle[ns + 'TargetOutJson__c']);
            } else if (isXmlOutput(bundle)) {
                return getXMLOutputFields(bundle);
            } else if (isCustomOutput(bundle)) {
                return callCustomClass(bundle[ns + 'CustomInputClass__c'], bundle[ns + 'TargetOutCustom__c']);
            }

            return DocumentService.getFields(bundle);
        }

        function getFieldsFromJSON(jsonString) {
            try {
                var obj = jsonString;
                if (angular.isString(jsonString)) {
                    obj = JSON.parse(jsonString);
                }
                var fieldNames = sObjectFields.getFieldsForJson(obj);
                return $q.when(mapFieldsToPicklistArray(fieldNames));
            } catch (e) {
                return $q.when([]);
            }
        }

        function getFormulaOutputFields(bundle) {
            var formulas = _.filter(bundle.$$mappings, function(mapping) {
                return mapping[ns + 'DomainObjectAPIName__c'] === 'Formula' &&
                       mapping[ns + 'FormulaResultPath__c'];
            });
            return formulas.map(function(mapping) {
                return mapStringToPicklistObject(mapping[ns + 'FormulaResultPath__c']);
            });
        }

        function getXMLOutputFields(bundle) {
            return getFieldsFromJSON(xmlToJson(bundle[ns + 'TargetOutXml__c']));
        }

        function getExtractOutputMappings(bundle) {
            if (isJsonOutput(bundle)) {
                return getFieldsFromJSON(bundle[ns + 'TargetOutJson__c']);
            } else if (isXmlOutput(bundle)) {
                return getXMLOutputFields(bundle);
            } else if (isCustomOutput(bundle)) {
                return callCustomClass(bundle[ns + 'CustomInputClass__c'], bundle[ns + 'TargetOutCustom__c']);
            }
            return $q.when([]);
        }

        function getTurboExtractOutputMappings(bundle) {
            if (isJsonOutput(bundle)) {
                return getFieldsFromJSON(bundle[ns + 'TargetOutJson__c']);
            } else if (isXmlOutput(bundle)) {
                return getXMLOutputFields(bundle);
            } else if (isCustomOutput(bundle)) {
                return callCustomClass(bundle[ns + 'CustomInputClass__c'], bundle[ns + 'TargetOutCustom__c']);
            }
            return $q.when([]);
        }

        function getLoadObjects(bundle) {
            return bundle.$$mappings.filter(function(mapping) {
                return mapping[apiNameKey] !== 'Formula';
            }).reduce(function(array, mapping) {
                if (mapping[apiNameKey] === 'json') {
                    return array;
                }
                var index = mapping[creationOrderKey] - 1;
                if (!array[index]) {
                    array[index] = {
                        label: (index + 1) + ' - ' + mapping[apiNameKey],
                        creationOrderKey: mapping[creationOrderKey],
                        name: mapping[apiNameKey],
                        mappings: []
                    };
                }
                array[index].mappings.push(mapping);
                return array;
            }, []);
        }

        function getSuggestedLoadOutputMappings(bundle) {
            var promises = getLoadObjects(bundle).map(function(obj) {
                return $q.all([sObjectFields.getFieldNamesForObject(obj.name), getAttributes(obj.name), $q.when(obj)]);
            });
            return $q.all(promises).then(function(results) {
                return results.map(function(objResults) {
                    var fields = objResults[0];
                    var attributes = objResults[1];
                    var objDetails = objResults[2];

                    return fields.concat(attributes).map(function(fieldOrAttribute) {
                        var result = objDetails.creationOrderKey + ' - ' + objDetails.name +
                                        ':' + fieldOrAttribute.value;
                        return {
                            label: result,
                            result: result,
                            value: result
                        };
                    });
                }).reduce(function(array, results) {
                    return array.concat(results);
                }, []);
            });
        }

        function sortFieldsByLabel(v1, v2) {
            return mappingSort.sortFieldsByLabel(v1, v2);
        }

        function getAttributes(objectName) {
            if (!objectName) {
                return $q.when([]);
            }
            return remoteActions.getAttributes(objectName)
                .then(function(attributes) {
                    return attributes.map(function(attribute) {
                        var code = '@' + attribute[ns + 'Code__c'];
                        return {
                            label: code,
                            value: code
                        };
                    });
                });
        }

        function preprocessDownloadedMapping(mapping) {
            /*
            var fields = ['Formula__c', 'DomainObjectFieldAPIName__c', 'InterfaceFieldAPIName__c'];
            fields.forEach(function(field) {
                if (/@/.test(mapping[ns + field])) {
                    mapping[ns + field] = mapping[ns + field].replace(/(@[A-Za-z0-9-]*)/g, function(match, attribute) {
                        return convertRawAttributeToVisualAttribute(attribute);
                    });
                }
            });
            */
            return mapping;
        }

        function preprocessMappingBeforeSave(mapping) {
            /*
            var fields = ['Formula__c', 'DomainObjectFieldAPIName__c', 'InterfaceFieldAPIName__c'];
            fields.forEach(function(field) {
                if (/@/.test(mapping[ns + field])) {
                    mapping[ns + field] = mapping[ns + field].replace(/(@[A-Za-z0-9- ]*\/[A-Za-z0-9- ]*)/g,
                        function(match, attribute) {
                            return convertVisualAttributeToRawAttribute(attribute);
                        });
                }
            });
            */
            return mapping;
        }

        /**
         * Turn a raw attribute string in the form @CODE to the visual form of
         * \@Category Name/Attribute Name
         */
        function convertRawAttributeToVisualAttribute(rawAttribute) {
            var config = {};
            config[ns + 'Code__c'] = rawAttribute.replace('@', '');
            var matchingAttribute = _.find(attributesJson, config);
            if (matchingAttribute) {
                return '@' + matchingAttribute[ns + 'AttributeCategoryName__c'] + '/' + matchingAttribute.Name;
            }
            return rawAttribute;
        }

        /**
         * Turn a visual attribute string in the form @Category Name/Attribute Name
         * to the raw form of @CODE
         */
        function convertVisualAttributeToRawAttribute(visualAttribute) {
            var parts = visualAttribute.split('/');
            var config = {};
            config[ns + 'AttributeCategoryName__c'] = parts[0].replace('@', '');
            config.Name = parts[1];
            var matchingAttribute = _.find(attributesJson, config);
            if (matchingAttribute) {
                return '@' + matchingAttribute[ns + 'Code__c'];
            }
            return visualAttribute;
        }

        function isParseError(parsedDocument) {
            // parser and parsererrorNS could be cached on startup for efficiency
            var parser = new DOMParser(),
                errorneousParse = parser.parseFromString('<', 'text/xml'),
                parsererrorNS = errorneousParse.getElementsByTagName('parsererror')[0].namespaceURI;

            if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
                // In PhantomJS the parseerror element doesn't seem to have a special namespace,
                // so we are just guessing here :(
                return parsedDocument.getElementsByTagName('parsererror').length > 0;
            }

            return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
        }

        function xmlToJson(xmlString) {
            var xml = xmlString;
            if (xml == null) {
                return {};
            }
            if (angular.isString(xmlString)) {
                var oParser = new DOMParser();
                var oDOM = oParser.parseFromString(xmlString, 'text/xml');

                if (isParseError(oDOM)) {
                    return {};
                }

                xml = oDOM;
            }

            // Create the return object
            var obj = {};

            if (xml.nodeType === 1) { // element
                // do attributes
                if (xml.attributes.length > 0) {
                    for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        obj['@' + attribute.nodeName] = attribute.nodeValue;
                    }
                }
            } else if (xml.nodeType === 3) { // text
                obj = xml.nodeValue;
            }

            // do children
            if (xml.hasChildNodes()) {
                for (var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;

                    if (typeof nodeName === 'string') {
                        nodeName = nodeName.replace(/:/g, '#');
                    }

                    if (typeof(obj[nodeName]) === 'undefined') {
                        obj[nodeName] = xmlToJson(item);
                    } else {
                        if (typeof(obj[nodeName].push) === 'undefined') {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(xmlToJson(item));
                    }
                }
            }
            return obj;
        }
    }
})();

},{}],35:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('drmapper')
        .factory('mappingSort', MappingSortFactory);

    MappingSortFactory.$inject = [];
    function MappingSortFactory() {
        var service = {
            sortFieldsByLabel:sortFieldsByLabel,
            sortFields: sortFields
        };
        
        return service;

        ////////////////
        function sortFields(v1, v2) {
            var partsV1 = v1.toLowerCase().split(':'),
            partsV2 = v2.toLowerCase().split(':');
            var index = 0;
            while (index < partsV1.length) {
                if (!partsV2[index]) {
                    return 1;
                }
                if ((partsV1[index][0] !== '@' && partsV2[index][0] === '@')) {
                    return -1;
                } else if (partsV1[index][0] === '@' && partsV2[index][0] !== '@') {
                    return 1;
                } else if (partsV1[index] < partsV2[index]) {
                    return -1;
                } else if (partsV1[index] > partsV2[index]) {
                    return 1;
                }
                index++;
            }
            return 0;
        }

        function sortFieldsByLabel(v1, v2) {
            return sortFields(v1.label, v2.label);
        }
    }
})();
},{}],36:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('drmapper')
        .factory('PathComparisonService', PathComparisonService);

    var isDisabledKey = fileNsPrefix() + 'IsDisabled__c';
    PathComparisonService.$inject = ['mappingSort'];
    function PathComparisonService(mappingSort) {
        return comparePaths;
        
        ////////////////

        function comparePaths(inputField) {
            return function (v1, v2) {
                if (v1 == null) {
                    if (v2 == null) {
                        return 0;
                    }
                    return 1;
                } else if (v2 == null) {
                    return -1;
                }

                if (v1[inputField] == null) {
                    if (v2[inputField] == null) {
                        return 0;
                    }
                    return 1;
                } else if (v2[inputField] == null) {
                    return -1;
                }

                return mappingSort.sortFields(v1[inputField], v2[inputField]);
            };
        }
    }
})();
},{}],37:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('drmapper')
        .filter('MappingFilter', MappingFilter);

    MappingFilter.$inject = ['_', 'PathComparisonService'];

    function MappingFilter(_, pathComparisonService) {
        var isDisabledKey = fileNsPrefix() + 'IsDisabled__c';
        var domainObjectCreationOrder = fileNsPrefix() + 'DomainObjectCreationOrder__c';
        return MappingFilterFilter;

        ////////////////

        function MappingFilterFilter(mappings, filter, inputField, outputField, isScopedToObject) {
            if (isScopedToObject === false) {
                // if we're in here it's the one special case... we're in the load 'ALL' tab, so order by Domain Object
                return Array.prototype.slice.call(mappings).sort(orderByAll(pathComparisonService(inputField, outputField)));
            }
            if (!filter) {
                return Array.prototype.slice.call(mappings).sort(pathComparisonService(inputField, outputField));
            }
            var fields = [],
                compiled = {};
            Object.keys(filter).forEach(function(key) {
                if (filter[key] != null && filter[key].length > 0) {
                    fields.push(key);
                    compiled[key] = new RegExp('^' + filter[key] + '|:' + filter[key], 'i');
                }
            });
            if (fields.length === 0) {
                return Array.prototype.slice.call(mappings).sort(pathComparisonService(inputField, outputField));
            }
            var subset = mappings.filter(function(mapping) {
                var field, fieldValue;
                if (!mapping.Id && (_.isEmpty(mapping[inputField]) || _.isEmpty(mapping[outputField]))) {
                    // for when someone click's add without having clear their filter
                    return true;
                }
                for (var i = 0; i < fields.length; i++) {
                    field = fields[i];
                    fieldValue = mapping[field];
                    if (angular.isFunction(fieldValue)) {
                        fieldValue = mapping[field]();
                    }
                    if (!compiled[field].test(fieldValue)) {
                        return false;
                    }
                }
                return true;
            });
            return Array.prototype.slice.call(subset).sort(pathComparisonService(inputField, outputField));
        }

        function orderByAll(pathComparisonFn) {
            return function(v1, v2) {
                if (v1 && v1[isDisabledKey] === true) {
                    if (v2 && v2[isDisabledKey] === true) {
                        return 0;
                    }
                    return -1;
                } else if (v2 && v2[isDisabledKey] === true) {
                    return 1;
                }

                if (v1 == null) {
                    if (v2 == null) {
                        return 0;
                    }
                    return 1;
                } else if (v2 == null) {
                    return -1;
                }

                if (v1[domainObjectCreationOrder] !== v2[domainObjectCreationOrder]) {
                    return v1[domainObjectCreationOrder] - v2[domainObjectCreationOrder];
                }
                return pathComparisonFn(v1, v2);
            }
        }

        
    }
})();

},{}],38:[function(require,module,exports){
(function() {
'use strict';
angular.module('drmapper')
    .filter('urlEncode', URLEncodeFilter);

function URLEncodeFilter() {
    return window.encodeURIComponent;
}
})();

},{}],39:[function(require,module,exports){
angular.module("drmapper").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("extract/extractOptionsTab.tpl.html",'<slds-form-element class="slds-size_1-of-3 slds-m-right_xx-large slds-m-bottom_small drmapper_extractOptionsTab_timeToLiveMinutes" \n                    field="vm.fieldMetadata[vm.timeToLiveMinutes]" \n                    model="vm.bundle[vm.timeToLiveMinutes]"\n                    object-type="::vm.objectType" \n                    object-id="vm.bundle.Id"\n                    on-change="vm.onFieldChange(vm.timeToLiveMinutes)"></slds-form-element>\n<slds-form-element class="slds-size_1-of-3 slds-m-right_xx-large slds-m-bottom_small drmapper_extractOptionsTab_platformCacheType" \n                    field="vm.fieldMetadata[vm.platformCacheType]" \n                    model="vm.bundle[vm.platformCacheType]" \n                    object-type="::vm.objectType" \n                    object-id="vm.bundle.Id"\n                    on-change="vm.onFieldChange(vm.platformCacheType)"></slds-form-element>\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_extractOptionsTab_checkFieldLevelSecurityKey" \n                    ng-if="vm.bundle[vm.bundleTypeKey] === \'Extract\' || vm.bundle[vm.bundleTypeKey] === \'Turbo Extract\'"\n                    field="vm.fieldMetadata[vm.checkFieldLevelSecurityKey]" \n                    model="vm.bundle[vm.checkFieldLevelSecurityKey]" \n                    object-type="::vm.objectType" \n                    object-id="vm.bundle.Id" \n                    on-change="vm.onFieldChange(vm.checkFieldLevelSecurityKey)"></slds-form-element>\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_extractOptionsTab_useTranslations" \n                    field="vm.fieldMetadata[vm.useTranslationsKey]" \n                    ng-if="vm.bundle[vm.bundleTypeKey] === \'Extract\'"\n                    model="vm.bundle[vm.useTranslationsKey]" \n                    object-type="::vm.objectType" \n                    object-id="vm.bundle.Id" \n                    on-change="vm.onFieldChange(vm.useTranslationsKey)"></slds-form-element>\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_extractOptionsTab_overwriteNullValuesKey" \n                    ng-if="vm.bundle[vm.bundleTypeKey] === \'Extract\'"\n                    field="vm.fieldMetadata[vm.overwriteNullValuesKey]" \n                    model="vm.bundle[vm.overwriteNullValuesKey]"\n                    object-type="::vm.objectType" \n                    object-id="vm.bundle.Id" \n                    on-change="vm.onFieldChange(vm.overwriteNullValuesKey)"></slds-form-element>\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_extractOptionsTab_xmlRemoveDeclaration" \n                    field="vm.fieldMetadata[vm.xmlRemoveDeclarationKey]" \n                    ng-if="vm.isXmlOutput()"\n                    model="vm.bundle[vm.xmlRemoveDeclarationKey]" \n                    object-type="::vm.objectType" \n                    object-id="vm.bundle.Id" \n                    on-change="vm.onFieldChange(vm.xmlRemoveDeclarationKey)"></slds-form-element>\n'),$templateCache.put("extract/extractObjectRow.tpl.html",'<li class="slds-box slds-grid slds-grid_vertical slds-m-bottom_small drmapper_extractObjectRow"\n    dnd-draggable="vm.mappings"\n    dnd-effect-allowed="move"\n    ng-form>\n    <div class="slds-grid"\n         dnd-nodrag>\n        <div class="slds-section__title"\n             ng-if="!vm.editing">\n            {{vm.order}} - {{vm.readableObjectName}}\n            <button class="slds-button slds-float--right slds-button_icon slds-button_icon-small drmapper_extractObjectRow_editField"\n                    title="Edit this Field"\n                    ng-click="vm.editMappingInterfaceObjectName(true)">\n                <slds-button-svg-icon sprite="\'utility\'"\n                                      icon="\'unlock\'"\n                                      extra-classes="\'slds-button__icon--hint\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Edit this Field</span>\n            </button>\n        </div>\n        <div class="slds-section__title slds-size_1-of-2 slds-grid"\n             ng-if="vm.editing">\n            {{vm.order}} - <div class="slds-form-element slds-p-left_xx-small slds-text-body--regular slds-grow drmapper_extractObjectRow_objectNameWrapper"\n                                 ng-class="{\'slds-has-error\': !vm.objectName}">\n                                <slds-picklist class="drmapper_extractObjectRow_objectName"\n                                               multiple="false"\n                                               ng-model="vm.objectName"\n                                               slds-options="object.name as object.label for object in vm.sObjects"\n                                               autocomplete="true"\n                                               ng-required="true"\n                                               ng-change="vm.onObjectNameChange()"></slds-picklist>\n                            </div>\n            <button class="slds-button slds-float--right slds-button_icon slds-button_icon-small drmapper_extractObjectRow_lockField"\n                    title="Lock this Field"\n                    ng-click="vm.editMappingInterfaceObjectName(false)">\n                <slds-button-svg-icon sprite="\'utility\'"\n                                      icon="\'lock\'"\n                                      extra-classes="\'slds-button__icon--hint\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Lock this Field</span>\n            </button>\n        </div>\n        <button class="slds-button slds-button_icon slds-col_bump-left drmapper_extractObjectRow_delete"\n                title="Delete"\n                ng-click="vm.deleteMapping(mappings)"\n                ng-if="!vm.deleting">\n            <slds-button-svg-icon sprite="\'action\'"\n                                  icon="\'delete\'" ></slds-button-svg-icon>\n            <span class="slds-assistive-text">Delete</span>\n        </button>\n        <button class="slds-button slds-button_icon slds-col_bump-left drmapper_extractObjectRow_deleting"\n                title="Deleting"\n                disabled="disabled"\n                ng-if="vm.deleting || vm.saving">\n            <slds-button-svg-icon sprite="\'utility\'"\n                                  icon="\'spinner\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Deleting</span>\n        </button>\n    </div>\n    <div class="slds-grid slds-m-top_small slds-grid_vertical">\n        <div class="slds-col slds-grid slds-grid_pull-padded-x-small">\n            <span class="slds-icon_container slds-p-top_large"\n                    title="move"\n                    style="margin-left: -1em;"\n                    dnd-handle="true">\n                <svg class="slds-icon slds-icon_small"\n                     xmlns="http://www.w3.org/2000/svg"\n                     preserveAspectRatio="xMidYMid meet"\n                     viewBox="0 0 154 275"\n                     aria-hidden="true">\n                    <path stroke="#000"\n                          stroke-width="30"\n                          stroke-dasharray="0,61"\n                          stroke-linecap="round"\n                          d="m46,46v189m61-6V40"/>\n                </svg>\n            </span>\n            <slds-form-element class="slds-size_3-of-12 slds-p-horizontal_x-small drmapper_extractObjectRow_domainObjectFieldApiName"\n                               field="::vm.fieldMetadata[vm.ns + \'DomainObjectFieldAPIName__c\']"\n                               model="vm.extractObjectPath"\n                               object-type="::vm.ns + \'DRMapItem__c\'"\n                               object-id="vm.mappings[0].Id"\n                               dnd-nodrag\n                               on-change="vm.onExtractObjectPathChange()"></slds-form-element>\n\n            <extract-object-filter class="slds-size_9-of-12 drmapper_extractObjectRow_extractObjectFilter"\n                                   mapping="vm.mappings[0]"\n                                   bundle="::bundle"\n                                   is-first="true"\n                                   dnd-nodrag\n                                   on-mapping-deleted="vm.onFilterDeleted(vm.mappings[0], 0)"></extract-object-filter>\n        </div>\n        <div class="slds-col slds-grid slds-grid_pull-padded-x-small"\n             dnd-nodrag\n             ng-repeat="mapping in vm.mappings"\n             ng-if="!$first">\n            <span class="slds-icon_container slds-p-top_large"\n                    title="move"\n                    style="margin-left: -1em; visibility:hidden;"\n                    disabled="disabled">\n                <svg aria-hidden="true"\n                     class="slds-icon slds-icon_small"\n                     xmlns="http://www.w3.org/2000/svg"\n                     preserveAspectRatio="xMidYMid meet"\n                     viewBox="0 0 154 275">\n                    <path stroke="#000"\n                          stroke-width="30"\n                          stroke-dasharray="0,61"\n                          stroke-linecap="round"\n                          d="m46,46v189m61-6V40"/>\n                </svg>\n            </span>\n            <div class="slds-size_3-of-12 slds-p-horizontal_x-small slds-p-top_x-large slds-text-align_right">\n                <a ng-click=""\n                   ng-if="vm.showAndLabel(mapping, vm.mappings[$index - 1])">AND</a>\n                <a ng-click=""\n                   ng-if="vm.showOrLabel(mapping, vm.mappings[$index - 1])">OR</a>\n            </div>\n            <extract-object-filter class="slds-size_9-of-12 drmapper_extractObjectRow_extractObjectFilter_{{$index}}"\n                                   mapping="::mapping"\n                                   is-first="false"\n                                   on-mapping-deleted="vm.onFilterDeleted(mapping, $index)"></extract-object-filter>\n        </div>\n    </div>\n</li>\n'),$templateCache.put("extract/extractObjectTab.tpl.html",'<div\n     class="slds-col slds-grid slds-grid_vertical-stretch drmapper--extract-object drmapper_extractObjectTab slds-is-relative">\n    <div class="slds-spinner_container slds-align_absolute-center"\n         ng-if="!vm.sObjects"\n         id="drmapper-loading-spinner">\n        <div class="slds-spinner--brand slds-spinner slds-spinner--medium"\n             role="alert">\n            <span class="slds-assistive-text">Saving</span>\n            <div class="slds-spinner__dot-a"></div>\n            <div class="slds-spinner__dot-b"></div>\n        </div>\n        <p class="slds-m-top_xx-large slds-p-top_large slds-text-heading_small">Loading all SObjects in org - this may\n            take a few seconds on large orgs...</p>\n    </div>\n    <div class="slds-scrollable_y slds-p-around_small"\n         ng-class="{\'slds-size_3-of-4\': vm.sidebarOpen, \'slds-col\': !vm.sidebarOpen}"\n         ng-if="vm.sObjects">\n        <ul class="slds-grid slds-grid_vertical drop-zone drmapper_extractObjectTab_grid"\n            dnd-list\n            dnd-relative-to-parent="true"\n            dnd-drop="vm.onDrop(event, index, item)">\n            <extract-object-row ng-repeat="mappings in vm.extractObjectMappings"\n                                mappings="mappings"\n                                bundle="::bundle"\n                                sobjects="vm.sObjects"\n                                order="$index + 1"\n                                on-mapping-added="vm.onMappingAdded(mapping)"\n                                on-mapping-deleted="vm.onMappingDeleted(mapping, $index)"\n                                class="drmapper_extractObjectTab_extractObjectRow-{{$index}}"></extract-object-row>\n        </ul>\n        <div class="slds-text-align_center slds-m-around_small">\n            <button class="slds-button slds-button--neutral"\n                    ng-click="vm.addMapping()"\n                    id="drmapper_extractObjectTab_addExtractStep">+ Add Extract Step</button>\n        </div>\n    </div>\n    <slds-accordian-side-bar title="Input/Output"\n                             sidebar-open="vm.sidebarOpen"\n                             ng-if="vm.sObjects">\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'InputJSON\', \'Input JSON\')}}"\n                                      ng-if="vm.bundle[vm.ns + \'InputType__c\'] === \'JSON\'">\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                       ng-change="vm.onInputJsonChange()"\n                       id="drmapper_extractObjectTab_inputJson"\n                       ng-model="vm.bundle[vm.ns + \'InputJson__c\']"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane\n                                      title="{{::$root.vlocity.getCustomLabel(\'DRMapperExtractionStepJSON\', \'Extraction Step JSON\')}}">\n            <div class="slds-form-element">\n                <div class="slds-form-element__control">\n                    <span class="slds-checkbox">\n                        <input type="checkbox"\n                               name="options"\n                               id="drmapper_extractObjectTab_showAllExtractJsonFields"\n                               ng-model="vm.showAllExtractJsonFields" />\n                        <label class="slds-checkbox__label"\n                               for="drmapper_extractObjectTab_showAllExtractJsonFields">\n                            <span class="slds-checkbox--faux"></span>\n                            <span\n                                  class="slds-form-element__label">{{::$root.vlocity.getCustomLabel(\'DRMapperShowSObjectFields\', \'Show all sObject Fields\')}}</span>\n                        </label>\n                    </span>\n                </div>\n            </div>\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                       readonly="readonly"\n                       ng-model="vm.extractionStepJson"\n                       id="drmapper_extractObjectTab_extractionStepJson"></dr-editor>\n        </slds-accordian-side-bar-pane>\n    </slds-accordian-side-bar>\n</div>\n'),$templateCache.put("extract/extractFieldRow.tpl.html",'<li class="via-slds-extract-bundle-field drmapper_extractFieldRow"\n    ng-attr-data-dr-mapping-map-id="{{vm.mapping[vm.mapIdKey]}}"\n    ng-class="{\'via-slds-mapping \': !vm.editing, \n               \'slds-theme_shade drmapper-is-disabled\': vm.isDisabled, \n               \'slds-has-error\':  !vm.editing && !vm.mapping[vm.jsonOutputPathKey]}">\n    <div class="slds-grid slds-p-top_small slds-p-bottom_small slds-p-horizontal_medium" \n         ng-if="!vm.editing" \n         ng-click="vm.editRow(false)">\n        <div class="slds-size_5-of-12 slds-truncate slds-p-right_small" \n             ng-bind="vm.mapping[vm.parentController.extractJsonPathKey]"></div>\n        <div class="slds-size_6-of-12 slds-truncate slds-p-right_small" \n             ng-bind="vm.mapping[vm.parentController.jsonOutputPathKey]"></div>\n        <div class="slds-size_1-of-12 slds-text-align_right">\n            <button class="slds-button slds-button_icon drmapper_extractFieldRow_edit"\n                    title="Edit"\n                    ng-click="vm.editRow(true)">\n                <slds-button-svg-icon sprite="\'utility\'" \n                                      icon="\'edit\'" ></slds-button-svg-icon>\n                <span class="slds-assistive-text">Edit</span>\n            </button>\n            <button class="slds-button slds-button_icon slds-col_bump-left drmapper_extractFieldRow_delete" \n                    title="Delete" \n                    ng-click="vm.deleteMapping($event)" \n                    ng-if="!vm.deleting && !vm.mapping.$$saving">\n                <slds-button-svg-icon sprite="\'action\'" \n                                      icon="\'delete\'" ></slds-button-svg-icon>\n                <span class="slds-assistive-text">Delete</span>\n            </button>\n            <button class="slds-button slds-button_icon slds-col_bump-left  drmapper_extractFieldRow_deleting" \n                    title="Deleting" \n                    disabled="disabled" \n                    ng-if="vm.deleting || vm.mapping.$$saving">\n                <slds-button-svg-icon sprite="\'utility\'" \n                                      icon="\'spinner\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Deleting</span>\n            </button>\n        </div>\n    </div>\n    <div class="slds-grid slds-p-top_small slds-p-bottom_small slds-p-horizontal_medium slds-grid_vertical-align-start" \n         ng-if="vm.editing">\n        <div class="slds-size_11-of-12 slds-p-right_small slds-p-left_x-small slds-grid slds-grid_vertical" >\n            <slds-form-element class="slds-size_1-of-1 slds-m-bottom_small drmapper_extractFieldRow_{{::vm.extractJsonPathKey}}" \n                               field="vm.parentController.fieldMetadata[vm.extractJsonPathKey]" \n                               model="vm.mapping[vm.extractJsonPathKey]" \n                               object-type="::vm.objectType" \n                               object-id="vm.mapping.Id" \n                               on-change="vm.onFieldChange(vm.extractJsonPathKey)"></slds-form-element>\n\n            <slds-form-element class="slds-size_1-of-1 slds-m-bottom_small drmapper_extractFieldRow_{{::vm.jsonOutputPathKey}}" \n                               field="vm.parentController.fieldMetadata[vm.jsonOutputPathKey]" \n                               model="vm.mapping[vm.jsonOutputPathKey]" \n                               object-type="::vm.objectType" \n                               object-id="vm.mapping.Id" \n                               on-change="vm.onFieldChange(vm.jsonOutputPathKey)"></slds-form-element>\n\n            <div class="slds-size_1-of-1 slds-grid slds-wrap slds-grid_pull-padded slds-m-bottom_small">\n                <slds-form-element class="slds-size_1-of-2 slds-p-horizontal_small slds-m-bottom_small  drmapper_extractFieldRow_{{::vm.fieldValueType}}" \n                                   field="vm.parentController.fieldMetadata[vm.fieldValueType]" \n                                   model="vm.mapping[vm.fieldValueType]" \n                                   object-type="::vm.objectType" \n                                   object-id="vm.mapping.Id" \n                                   on-change="vm.onFieldChange(vm.fieldValueType)"></slds-form-element>\n                <slds-form-element class="slds-size_1-of-2 slds-p-horizontal_small slds-m-bottom_small  drmapper_extractFieldRow_{{::vm.defaultValueKey}}" \n                                   field="vm.parentController.fieldMetadata[vm.defaultValueKey]" \n                                   model="vm.mapping[vm.defaultValueKey]" \n                                   object-type="::vm.objectType" \n                                   object-id="vm.mapping.Id" \n                                   on-change="vm.onFieldChange(vm.defaultValueKey)"></slds-form-element>\n                <slds-form-element class="slds-size_1-of-2 slds-p-horizontal_small slds-m-bottom_small drmapper_extractFieldRow_{{::vm.isDisabledKey}}" \n                                   field="vm.parentController.fieldMetadata[vm.isDisabledKey]" \n                                   model="vm.mapping[vm.isDisabledKey]" \n                                   object-type="::vm.objectType" \n                                   object-id="vm.mapping.Id" \n                                   on-change="vm.onFieldChange(vm.isDisabledKey)"></slds-form-element>\n            </div>\n            <transform-map-values class="slds-size_1-of-1 slds-m-bottom_small drmapper_extractFieldRow_transformMapValues" \n                                  mapping="vm.mapping"\n                                  on-change="vm.onFieldChange(vm.transformValuesMapKey)"></transform-map-values>\n        </div>\n        <div class="slds-size_1-of-12 slds-text-align_right">\n            <button class="slds-button slds-button_icon  drmapper_extractFieldRow_collapse"\n                    title="Collapse"\n                    ng-click="vm.stopEdit()">\n                <slds-button-svg-icon sprite="\'utility\'" \n                                      icon="\'contract_alt\'" ></slds-button-svg-icon>\n                <span class="slds-assistive-text">Collapse</span>\n            </button>\n            <button class="slds-button slds-button_icon slds-col_bump-left drmapper_extractFieldRow_delete" \n                    title="Delete" \n                    ng-click="vm.deleteMapping($event)" \n                    ng-if="!vm.mapping.$$deleting && !vm.mapping.$$saving">\n                <slds-button-svg-icon sprite="\'action\'" \n                                      icon="\'delete\'" ></slds-button-svg-icon>\n                <span class="slds-assistive-text">Delete</span>\n            </button>\n            <button class="slds-button slds-button_icon slds-col_bump-left drmapper_extractFieldRow_deleting" \n                    title="Deleting" disabled="disabled" \n                    ng-if="vm.mapping.$$deleting || vm.mapping.$$saving">\n                <slds-button-svg-icon sprite="\'utility\'" \n                                      icon="\'spinner\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Deleting</span>\n            </button>\n        </div>\n    </div>\n</li>'),$templateCache.put("extract/extractTabs.tpl.html",'<div class="slds-tabs--default slds-col slds-grid slds-grid_vertical slds-grid_vertical-stretch drmapper_extractTabs"\n      style="overflow: hidden">\n    <ul class="slds-tabs--default__nav"\n        role="tablist"\n        style="flex-shrink: 0;">\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'DRMapperExtract\', \'Extract\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 0}">\n            <a class="slds-tabs--default__link"\n               role="tab"\n               ng-click="vm.activeTab = 0"\n               tabindex="0"\n               aria-selected="true"\n               aria-controls="tab-default-1"\n               id="tab-default-1__item">{{::$root.vlocity.getCustomLabel(\'DRMapperExtract\', \'Extract\')}}</a>\n        </li>\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-if="::vm.bundle[vm.ns + \'Type__c\'] !== \'Turbo Extract\'"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'Formulas\', \'Formulas\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 1}">\n            <a class="slds-tabs--default__link"\n               role="tab"\n               ng-click="vm.activeTab = 1"\n               tabindex="-1"\n               aria-selected="true"\n               aria-controls="tab-default-2"\n               id="tab-default-2__item">{{::$root.vlocity.getCustomLabel(\'Formulas\', \'Formulas\')}}</a>\n        </li>\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-if="::vm.bundle[vm.ns + \'Type__c\'] !== \'Turbo Extract\'"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'Output\', \'Output\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 2}">\n            <a class="slds-tabs--default__link"\n                ng-click="vm.activeTab = 2"\n               role="tab"\n               tabindex="-1"\n               aria-selected="false"\n               aria-controls="tab-default-3"\n               id="tab-default-3__item">{{::$root.vlocity.getCustomLabel(\'Output\', \'Output\')}}</a>\n        </li>\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'DRMapperOptions\', \'Options\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 3}">\n            <a class="slds-tabs--default__link"\n                ng-click="vm.activeTab = 3"\n                role="tab"\n                tabindex="-1"\n                aria-selected="false"\n                aria-controls="tab-default-4"\n                id="tab-default-4__item">{{::$root.vlocity.getCustomLabel(\'DRMapperOptions\', \'Options\')}}</a>\n        </li>\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'Preview\', \'Preview\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 4}">\n            <a class="slds-tabs--default__link"\n               ng-click="vm.activeTab = 4"\n               role="tab"\n               tabindex="-1"\n               aria-selected="false"\n               aria-controls="tab-default-5"\n               id="tab-default-5__item">{{::$root.vlocity.getCustomLabel(\'Preview\', \'Preview\')}}</a>\n        </li>\n    </ul>\n    <div id="tab-default-1"\n         class="slds-col slds-grid slds-grid_vertical-stretch"\n         role="tabpanel"\n         aria-labelledby="tab-default-1__item"\n         ng-if="vm.activeTab == 0"\n         style="overflow: hidden">\n        <extract-object-tab bundle="vm.bundle"\n                            ng-if="vm.activeTab == 0 && vm.bundle[vm.ns + \'Type__c\'] !== \'Turbo Extract\'"\n                            class="slds-col slds-grid slds-grid_vertical-stretch"></extract-object-tab>\n        <extract-object-tab bundle="vm.bundle"\n                            ng-if="vm.activeTab == 0 && vm.bundle[vm.ns + \'Type__c\'] === \'Turbo Extract\'"\n                            class="slds-col slds-grid slds-grid_vertical-stretch"\n                            turbo="true"></extract-object-tab>\n    </div>\n    <div id="tab-default-2"\n         class="slds-col slds-grid slds-grid_vertical-stretch"\n         role="tabpanel"\n         aria-labelledby="tab-default-2__item"\n         ng-if="vm.activeTab == 1"\n         style="overflow: hidden" >\n        <formula-tab bundle="vm.bundle"\n                                   class="slds-col slds-grid slds-grid_vertical-stretch"></formula-tab>\n    </div>\n    <div id="tab-default-3"\n         class="slds-col slds-grid slds-grid_vertical-stretch"\n         role="tabpanel"\n         aria-labelledby="tab-default-3__item"\n         ng-if="vm.activeTab == 2"\n         style="overflow: hidden" >\n        <extract-fields-tab bundle="vm.bundle"\n                                   class="slds-col slds-grid slds-grid_vertical-stretch"></extract-fields-tab>\n    </div>\n    <div id="tab-default-4"\n         class="slds-col slds-grid slds-grid_vertical-stretch"\n         role="tabpanel"\n         aria-labelledby="tab-default-4__item"\n         ng-show="vm.activeTab == 3"\n         style="overflow: hidden" >\n         <extract-options-tab bundle="vm.bundle"\n                              class="slds-col slds-grid slds-grid_vertical-align-start slds-wrap slds-p-around_small"></extract-options-tab>\n    </div>\n    <div id="tab-default-5"\n         class="slds-col slds-grid slds-grid_vertical-stretch"\n         role="tabpanel"\n         aria-labelledby="tab-default-5__item"\n         ng-show="vm.activeTab == 4"\n         style="overflow: hidden" >\n        <preview-extract bundle-name="{{vm.bundle.Name}}"\n                             drurl="/services/apexrest/{{::vm.nsForUrl}}v2/DataRaptor/{{vm.bundle.Name | urlEncode}}/"\n                             bundle-name="{{vm.bundle.Name}}"\n                             bundle="vm.bundle"\n                             initial-json="vm.bundle[vm.ns + \'SampleInputJSON__c\']"\n                             initial-xml="vm.bundle[vm.ns + \'SampleInputXML__c\']"\n                             initial-custom="vm.bundle[vm.ns + \'SampleInputCustom__c\']"\n                             reset-json="vm.bundle[vm.ns + \'InputJson__c\']"\n                             reset-xml="vm.bundle[vm.ns + \'InputXml__c\']"\n                             input-type="vm.bundle[vm.ns + \'InputType__c\']"\n                             interface-type="vm.bundle[vm.ns + \'Type__c\']"\n                             output-type="vm.bundle[vm.ns + \'OutputType__c\']">\n        </preview-extract>\n    </div>\n</div>\n'),$templateCache.put("extract/extractObjectFilter.tpl.html",'<div class="slds-grid drmapper_extractObjectFilter">\n    <slds-form-element class="slds-size_4-of-12 slds-p-horizontal_x-small drmapper_extractObjectFilter_filterFieldKey"\n                       ng-if="!vm.parentController.loadingFields && (!vm.isLimit() && !vm.isOrderBy() && !vm.isOffset())"\n                       field="::vm.parentController.fieldMetadata[vm.filterFieldKey]"\n                       model="vm.mapping[vm.filterFieldKey]"\n                       object-type="::vm.objectType"\n                       object-id="::vm.mapping.Id"\n                       on-change="vm.onFieldChange()"\n                       label-override="::vm.getFilterLabel()"></slds-form-element>\n    <div class="slds-form-element slds-size_4-of-12 slds-p-horizontal_x-small"\n         ng-if="vm.parentController.loadingFields && !(vm.isLimit() || vm.isOrderBy() || vm.isOffset())">\n        <label class="slds-form-element__label">&nbsp{{::vm.getFilterLabel()}}</label>\n        <div class="slds-picklist slds-size_1-of-1">\n            <div class="slds-form-element__control">\n                <div class="slds-combobox_container">\n                    <div class="slds-combobox">\n                        <div class="slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right via-slds-picklist__input">\n                            <input type="search"\n                                class="slds-lookup__search-input slds-input"\n                                placeholder="Select an Option"\n                                value="{{::vm.mapping[vm.filterFieldKey]}}"\n                                aria-owns="option-list-01"\n                                role="combobox"\n                                aria-activedescendant=""\n                                aria-expanded="false"\n                                disabled="disabled" />\n                            <button class="slds-button slds-input__icon slds-text-color--default"\n                                    aria-expanded="false"\n                                    tabindex="-1"\n                                    title="settings">\n                                <slds-button-svg-icon sprite="\'utility\'"\n                                                    icon="\'spinner\'"></slds-button-svg-icon>\n                                <span class="slds-assistive-text">Expand category options</span>\n                            </button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <slds-form-element class="slds-size_3-of-12 slds-p-horizontal_x-small drmapper_extractObjectFilter_filterOperatorKey"\n                       ng-if="::(!vm.isLimit() && !vm.isOrderBy() && !vm.isOffset())"\n                       field="::vm.parentController.fieldMetadata[vm.filterOperatorKey]"\n                       model="vm.mapping[vm.filterOperatorKey]"\n                       object-type="::vm.objectType"\n                       object-id="::vm.mapping.Id"\n                       on-change="vm.onFieldChange()" ></slds-form-element>\n\n    <slds-form-element class="slds-size_4-of-12 slds-p-horizontal_x-small drmapper_extractObjectFilter_filterValueKey"\n                       ng-if="::(!vm.isLimit() && !vm.isOrderBy() && !vm.isOffset())"\n                       field="::vm.parentController.fieldMetadata[vm.filterValueKey]"\n                       model="vm.mapping[vm.filterValueKey]"\n                       object-type="::vm.objectType"\n                       object-id="::vm.mapping.Id"\n                       on-change="vm.onFieldChange()"></slds-form-element>\n\n    \x3c!-- LIMIT or ORDER BY --\x3e\n    <div class="slds-size_4-of-12 slds-text-align_right slds-p-top_x-large"\n         ng-if="::(vm.isLimit() || vm.isOrderBy() || vm.isOffset())">\n        <a ng-click=""\n           ng-bind="vm.mapping[vm.filterOperatorKey]"></a>\n    </div>\n    <slds-form-element class="slds-size_7-of-12 slds-p-horizontal_x-small drmapper_extractObjectFilter_filterValueKey"\n                       ng-if="::(vm.isLimit() || vm.isOrderBy() || vm.isOffset())"\n                       field="::vm.parentController.fieldMetadata[vm.filterValueKey]"\n                       model="vm.mapping[vm.filterValueKey]"\n                       object-type="::vm.objectType"\n                       object-id="::vm.mapping.Id"\n                       on-change="vm.onFieldChange()"></slds-form-element>\n\n    <div class="slds-form-element slds-size_1-of-12 slds-text-align_left slds-p-horizontal_x-small" >\n        <slds-dropdown  class="slds-p-top_large drmapper_extractObjectFilter_actionMenu"\n                        ng-if="!vm.deleting && !vm.mapping.$$saving"\n                        content="::vm.menuItems"\n                        button-size="small"\n                        button-classes="slds-button_icon-container"></slds-dropdown>\n        <button class="slds-p-top_large slds-button slds-button_icon drmapper_extractObjectFilter_saving"\n                ng-if="vm.deleting || vm.mapping.$$saving"\n                title="Saving"\n                disabled="disabled">\n            <slds-button-svg-icon sprite="\'utility\'" icon="\'spinner\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Saving</span>\n        </button>\n    </div>\n</div>\n'),$templateCache.put("extract/extractFieldsTab.tpl.html",'<div class="slds-col slds-grid slds-grid_vertical-stretch slds-nowrap drmapper_extractFieldsTab">\n    <field-bundle-table \n            class="slds-scrollable_y"\n            ng-class="{\'slds-size_3-of-4\': vm.sidebarOpen, \'slds-col\': !vm.sidebarOpen}"\n            bundle="vm.bundle"\n            on-field-mapping-change="vm.handleFieldMappingChange()"></field-bundle-table>\n    <slds-accordian-side-bar title="Input/Output"\n                             sidebar-open="vm.sidebarOpen">\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperExtractionStepJSON\', \'Extraction Step JSON\')}}">\n            <div class="slds-form-element">\n                    <div class="slds-form-element__control">\n                        <span class="slds-checkbox">\n                            <input type="checkbox" \n                                name="options" \n                                id="drmapper_extractFieldsTab_showAllExtractFields" \n                                ng-model="vm.showAllExtractFields" />\n                            <label class="slds-checkbox__label" \n                                for="drmapper_extractFieldsTab_showAllExtractFields">\n                                <span class="slds-checkbox--faux"></span>\n                                <span class="slds-form-element__label">{{::$root.vlocity.getCustomLabel(\'DRMapperShowSObjectFields\', \'Show all sObject Fields\')}}</span>\n                            </label>\n                        </span>\n                    </div>\n                </div>\n                <dr-editor  class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                            readonly="readonly"\n                            id="drmapper_extractFieldsTab_extractionStepOutput"\n                            ng-model="vm.extractionStepOutput"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperExpectedJSONOutput\', \'Expected JSON Output\')}}"\n            ng-if="vm.isJsonOutput()">\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                ng-change="vm.expectedOutputChanged()"\n                ng-model-options="{updateOn: \'default blur\', debounce: {\'default\': 2000, \'blur\': 0}}"\n                required="required"\n                placeholder="{{::$root.vlocity.getCustomLabel(\'DRMapperExpectedJSONOutput\', \'Expected JSON Output\')}}"\n                id="drmapper_extractFieldsTab_bundleTargetOutJsonKey"\n                ng-model="vm.bundle[vm.bundleTargetOutJsonKey]"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperCurrentJSONOutput\', \'Current JSON Output\')}}"\n            ng-if="vm.isJsonOutput()"\n            selected="true">\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                readonly="readonly"    \n                id="drmapper_extractFieldsTab_currentOutputData"\n                ng-model="vm.currentOutputData"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperExpectedXMLOutput\', \'Expected XML Output\')}}"\n            ng-if="vm.isXmlOutput()">\n                <dr-editor  class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                    language="xml"\n                    ng-change="vm.expectedOutputChanged()"\n                    ng-model-options="{updateOn: \'default blur\', debounce: {\'default\': 2000, \'blur\': 0}}"\n                    required="required"\n                    placeholder="{{::$root.vlocity.getCustomLabel(\'DRMapperExpectedXMLOutput\', \'Expected XML Output\')}}"\n                    id="drmapper_extractFieldsTab_bundleTargetOutXmlKey"\n                    ng-model="vm.bundle[vm.bundleTargetOutXmlKey]"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperCurrentXMLOutput\', \'Current XML Output\')}}"\n            ng-if="vm.isXmlOutput()" \n            selected="true">\n            <dr-editor  class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                    readonly="readonly"\n                    language="xml"  \n                    id="drmapper_extractFieldsTab_currentOutputData"\n                    ng-model="vm.currentOutputData"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperExpectedCustomOutput\', \'Expected Custom Output\')}}"\n            ng-if="vm.isCustomOutput()">\n                <dr-editor  class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                    language="text"\n                    ng-change="vm.expectedOutputChanged()"\n                    ng-model-options="{updateOn: \'default blur\', debounce: {\'default\': 2000, \'blur\': 0}}"\n                    required="required"\n                    placeholder="{{::$root.vlocity.getCustomLabel(\'DRMapperExpectedCustomOutput\', \'Expected Custom Output\')}}"\n                    id="drmapper_extractFieldsTab_bundleTargetOutCustomKey"\n                    ng-model="vm.bundle[vm.bundleTargetOutCustomKey]"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperCurrentCustomOutput\', \'Current Custom Output\')}}"\n            ng-if="vm.isCustomOutput()" \n            selected="true">\n            <dr-editor  class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                    readonly="readonly"\n                    language="text"  \n                    id="drmapper_extractFieldsTab_currentOutputData"\n                    ng-model="vm.currentOutputData"></dr-editor>\n        </slds-accordian-side-bar-pane>\n    </slds-accordian-side-bar>\n</div>'),$templateCache.put("turboExtract/turboExtractFieldsRow.tpl.html",'<div class="slds-m-top_medium">\n    <div class="slds-form-element__control slds-m-bottom_medium">\n        <label class="slds-form-element__label">Related Objects</label>\n        <div class="slds-select_container">\n            <select type="text" \n               class="slds-select" \n               ng-model="vm.relObjPath"\n               ng-change="vm.relObjPathChanged()">\n               <option ng-repeat="opt in vm.relObjPathOpts" ng-value="opt">\n                    {{vm.pathOptDisplay(opt)}}\n               </option>\n            </select>\n        </div>\n    </div>\n    <slds-dueling-picklist value="vm.fields"\n                           class="slds-m-top_medium"\n                           label="Search Fields"\n                           options="vm.fieldOpts"\n                           vm-change="vm.setFields(value)"\n                           required="true"\n                           required-options="vm.requiredFields"\n                           filter-options="true"\n                           loading="vm.loading"\n                           loading-options="vm.loadingFields"\n                           disable-reordering="true" />\n</div>'),$templateCache.put("turboExtract/turboExtractObjectTab.tpl.html",'<div\n     class="slds-col slds-grid slds-grid_vertical-stretch drmapper--extract-object drmapper_extractObjectTab slds-is-relative">\n\n    <div class="slds-spinner_container slds-align_absolute-center"\n            ng-if="!vm.sObjects"\n            id="drmapper-loading-spinner">\n        <div class="slds-spinner--brand slds-spinner slds-spinner--medium"\n                role="alert">\n            <span class="slds-assistive-text">Saving</span>\n            <div class="slds-spinner__dot-a"></div>\n            <div class="slds-spinner__dot-b"></div>\n        </div>\n        <p class="slds-m-top_xx-large slds-p-top_large slds-text-heading_small">Loading all SObjects in org - this may\n            take a few seconds on large orgs...</p>\n    </div>\n    <div class="slds-scrollable_y slds-p-around_small slds-col"\n    ng-if="vm.sObjects">\n            <extract-object-row ng-repeat="mappings in vm.extractObjectMappings"\n                                mappings="mappings"\n                                bundle="::vm.bundle"\n                                sobjects="vm.sObjects"\n                                order="$index + 1"\n                                on-mapping-added="vm.onMappingAdded(mapping)"\n                                on-mapping-deleted="vm.onMappingDeleted(mapping, $index)"\n                                class="drmapper_extractObjectTab_extractObjectRow-{{$index}}"\n                                turbo="vm.turbo"></extract-object-row>\n    </div>\n</div>\n'),$templateCache.put("turboExtract/turboExtractObjectRow.tpl.html",'<div>\n    <div class="slds-grid">\n        <div class="slds-section__title"\n             ng-if="!vm.editing">\n            {{vm.readableObjectName||vm.objectName}}\n            <slds-button-svg-icon ng-if="!vm.readableObjectName" sprite="\'utility\'" icon="\'spinner\'"></slds-button-svg-icon>\n            <button class="slds-button slds-float--right slds-button_icon slds-button_icon-small drmapper_extractObjectRow_editField"\n                    title="Edit this Field"\n                    ng-if="vm.readableObjectName"\n                    ng-click="vm.editMappingInterfaceObjectName(true)">\n                <slds-button-svg-icon sprite="\'utility\'"\n                                        icon="\'unlock\'"\n                                        extra-classes="\'slds-button__icon--hint\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Edit this Field</span>\n            </button>\n        </div>\n        <div class="slds-section__title slds-size_1-of-2 slds-grid"\n                ng-if="vm.editing">\n                <div class="slds-form-element slds-p-left_xx-small slds-text-body--regular slds-grow drmapper_extractObjectRow_objectNameWrapper"\n                                    ng-class="{\'slds-has-error\': !vm.objectName}">\n                                <slds-picklist class="drmapper_extractObjectRow_objectName"\n                                                multiple="false"\n                                                ng-model="vm.objectName"\n                                                slds-options="object.name as object.label for object in vm.sObjects"\n                                                autocomplete="true"\n                                                ng-required="true"\n                                                ng-change="vm.onObjectNameChange()"></slds-picklist>\n                            </div>\n            <button class="slds-button slds-float--right slds-button_icon slds-button_icon-small drmapper_extractObjectRow_lockField"\n                    title="Lock this Field"\n                    ng-click="vm.editMappingInterfaceObjectName(false)">\n                <slds-button-svg-icon sprite="\'utility\'"\n                                        icon="\'lock\'"\n                                        extra-classes="\'slds-button__icon--hint\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Lock this Field</span>\n            </button>\n        </div>\n    </div>\n    <div class="slds-grid slds-m-top_small slds-grid_vertical">\n        <div class="slds-col slds-grid slds-grid_pull-padded-x-small">\n            <slds-form-element class="slds-size_3-of-12 slds-p-horizontal_x-small drmapper_extractObjectRow_domainObjectFieldApiName"\n                                field="::vm.fieldMetadata[vm.ns + \'DomainObjectFieldAPIName__c\']"\n                                model="vm.extractObjectPath"\n                                object-type="::vm.ns + \'DRMapItem__c\'"\n                                object-id="vm.mappings[0].Id"\n                                on-change="vm.onExtractObjectPathChange()"></slds-form-element>\n\n            <extract-object-filter class="slds-size_9-of-12 drmapper_extractObjectRow_extractObjectFilter"\n                                    mapping="vm.mappings[0]"\n                                    bundle="::bundle"\n                                    is-first="true"\n                                    on-mapping-deleted="vm.onFilterDeleted(vm.mappings[0], 0)"></extract-object-filter>\n        </div>\n        <div class="slds-col slds-grid slds-grid_pull-padded-x-small"\n                ng-repeat="mapping in vm.mappings"\n                ng-if="!$first">\n            <div class="slds-size_3-of-12 slds-p-horizontal_x-small slds-p-top_x-large slds-text-align_right">\n                <a ng-click=""\n                    ng-if="vm.showAndLabel(mapping, vm.mappings[$index - 1])">AND</a>\n                <a ng-click=""\n                    ng-if="vm.showOrLabel(mapping, vm.mappings[$index - 1])">OR</a>\n            </div>\n            <extract-object-filter class="slds-size_9-of-12 drmapper_extractObjectRow_extractObjectFilter_{{$index}}"\n                                    mapping="::mapping"\n                                    is-first="false"\n                                    on-mapping-deleted="vm.onFilterDeleted(mapping, $index)"></extract-object-filter>\n        </div>\n    </div>\n    <turbo-extract-fields-row object-name="vm.objectName"\n                              loading-fields="vm.loadingFields"\n                              output-path="vm.extractObjectPath"\n                              fields="vm.fields"\n                              bundle="vm.bundle"/>\n</div>\n'),$templateCache.put("autoMatchField.tpl.html",'<div class="slds-modal__container drmapper_autoMatchField">\n    <div class="slds-modal__header">\n        <h2 class="slds-text-heading_medium drmapper_unselectable">{{::$root.vlocity.getCustomLabel(\'QuickMatch\', \'Quick Match\')}}</h2>\n        <p class="slds-m-top_x-small" ng-hide="vm.hideMessage">Drag and drop mappings to pair them or select an input and output mapping and click "Pair". <a ng-click="vm.dismissMessage()">Click here to hide this message</a></p>\n    </div>\n    <div class="slds-modal__content slds-grid slds-is-relative"\n         style="min-height: 70vh; overflow:hidden">\n        <div class="slds-grid slds-col slds-grid_vertical-stretch drmapper--auto-match"\n             style="width: 100%">\n            <div class="slds-size_1-of-3 slds-grid slds-grid_vertical slds-grid_vertical-stretch slds-border_right">\n                <h3 class="slds-text-title_caps slds-p-left_small slds-p-bottom_small slds-m-bottom_small slds-m-top_small drmapper_unselectable slds-border_bottom" style="flex-shrink: 0">Input Mappings\n                    <input type="text"\n                            class="no-autofocus"\n                            ng-model="vm.filter.inputMapping"\n                            placeholder=""\n                            tabindex="-1"\n                            id="drmapper_autoMatchField_inputMappingSearch"\n                            required="required"\n                            ng-change="vm.onInputSearchChange()" />\n                </h3>\n                <div class="slds-col slds-p-horizontal_small slds-p-bottom_small slds-scrollable_y">\n                    <ul class="slds-has-dividers--around-space" id="drmapper_automatch_inputMappings">\n                        <li class="slds-item"\n                            ng-class="{\'drmapper_selected\': vm.selectedInput === mapping}"\n                            ng-repeat="mapping in vm.inputMappings"\n                            id="drmapper_autoMatchField_inputMapping-{{$index}}"\n                            tabindex="0"\n                            dnd-list\n                            dnd-draggable="mapping"\n                            dnd-effect-allowed="move"\n                            dnd-type="\'INPUT\'"\n                            dnd-allowed-types="[\'OUTPUT\']"\n                            dnd-drop="vm.dropOnInput(event, $index, item)"\n                            ng-click="vm.selectedInput = mapping">\n                            <div class="slds-tile slds-media">\n                                <div class="slds-media__figure">\n                                    <svg class="slds-button__icon slds-button__icon--large" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 154 275" aria-hidden="true">\n                                            <path stroke="#000" stroke-width="30" stroke-dasharray="0,61" stroke-linecap="round" d="m46,46v189m61-6V40"></path>\n                                    </svg>\n                                </div>\n                                <div class="slds-media__body slds-truncate">\n                                    <h3 ng-attr-title="{{::mapping}}"\n                                        tabindex="-1"\n                                        ng-bind="::mapping"></h3>\n                                </div>\n                            </div>\n                            <span class="dndPlaceholder slds-hide"></span>\n                        </li>\n                    </ul>\n                </div>\n            </div>\n            <div class="slds-size_1-of-3 slds-grid slds-grid_vertical slds-grid_vertical-stretch slds-border_right">\n                <h3 class="slds-text-title_caps slds-p-left_small slds-p-bottom_small slds-m-bottom_small slds-m-top_small drmapper_unselectable slds-border_bottom"  style="flex-shrink: 0">Output Mappings\n                    <input type="text"\n                            class="no-autofocus"\n                            ng-model="vm.filter.outputMapping"\n                            placeholder=""\n                            tabindex="-1"\n                            id="drmapper_autoMatchField_outputMappingSearch"\n                            required="required"\n                            ng-change="vm.onOutputSearchChange()" />\n                </h3>\n                <div class="slds-col slds-p-horizontal_small slds-p-bottom_small slds-scrollable_y">\n                    <ul class="slds-has-dividers--around-space" id="drmapper_automatch_outputMappings">\n                        <li class="slds-item"\n                            id="drmapper_autoMatchField_outputMapping-{{$index}}"\n                            ng-class="{\'drmapper_selected\': vm.selectedOutput === mapping}"\n                            ng-repeat="mapping in vm.outputMappings"\n                            tabindex="0"\n                            dnd-list\n                            dnd-draggable="mapping"\n                            dnd-type="\'OUTPUT\'"\n                            dnd-allowed-types="[\'INPUT\']"\n                            dnd-effect-allowed="move"\n                            dnd-drop="vm.dropOnOutput(event, $index, item)"\n                            ng-click="vm.selectedOutput = mapping">\n                            <div class="slds-tile slds-media">\n                                <div class="slds-media__figure">\n                                    <svg class="slds-button__icon slds-button__icon--large" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 154 275" aria-hidden="true">\n                                            <path stroke="#000" stroke-width="30" stroke-dasharray="0,61" stroke-linecap="round" d="m46,46v189m61-6V40"></path>\n                                    </svg>\n                                </div>\n                                <div class="slds-media__body slds-truncate">\n                                    <h3 ng-attr-title="{{::mapping}}"\n                                        tabindex="-1"\n                                        ng-bind="::mapping"></h3>\n                                </div>\n                            </div>\n                            <span class="dndPlaceholder slds-hide"></span>\n                        </li>\n                    </ul>\n                </div>\n            </div>\n            <div class="slds-size_1-of-3 slds-grid slds-grid_vertical slds-grid_vertical-stretch">\n                <h3 class="slds-text-title_caps slds-p-left_small slds-p-bottom_small slds-m-bottom_small slds-m-top_small drmapper_unselectable slds-border_bottom"  style="flex-shrink: 0">Matched Mappings</h3>\n                <div class="slds-col slds-p-horizontal_small slds-p-bottom_small slds-scrollable_y slds-grid">\n                    <ul class="slds-has-dividers--around-space drmapper_auto-match_matched-mappings"\n                        dnd-list\n                        dnd-allowed-types="[\'OUTPUT\']"\n                        dnd-drop="vm.onDrop(event, index, item, type)"\n                        style="width: 100%"\n                        id="drmapper_automatch_matchedMappings">\n                        <li class="slds-item slds-is-relative"\n                            ng-repeat="mapping in vm.matchedMappings"\n                            tabindex="0"\n                            dnd-list\n                            dnd-allowed-types="mapping.input ? [] : [\'INPUT\']"\n                            id="drmapper_autoMatchField_matchedMapping-{{$index}}"\n                            dnd-drop="vm.onMatchedDrop(event, $index, item, type)"\n                            ng-click="vm.selectedMatched = mapping">\n                            <div class="slds-tile slds-media slds-media--center">\n                                <div class="slds-media__body slds-grid slds-grid--align-spread">\n                                    <span ng-if="mapping.isAutoMatch" class="drmapper_is-auto-match"\n                                          title="Generated using automatch">*</span>\n                                    <div class="slds-size_1-of-2 slds-truncate">\n                                        <h3 ng-attr-title="{{::mapping.input}}"\n                                            class="drmapper_autoMatchField_matchedMapping_input"\n                                            tabindex="-1"\n                                            ng-bind="::mapping.input">\n                                        </h3>\n                                    </div>\n                                    <span class="slds-icon_container slds-icon-utility-macros">\n                                        <slds-svg-icon sprite="\'utility\'" icon="\'forward\'" extra-classes="\'slds-icon-text-light\'" size="\'x-small\'"></slds-svg-icon>\n                                    </span>\n                                    <div class="slds-text-align_right slds-size_1-of-2 slds-p-right_large slds-truncate">\n                                        <h3 ng-attr-title="{{::mapping.output}}"\n                                            class="drmapper_autoMatchField_matchedMapping_output"\n                                            tabindex="-1"\n                                            ng-bind="::mapping.output">\n                                        </h3>\n                                    </div>\n                                </div>\n                                <div clas="slds-media__figure slds-media__figure--reverse">\n                                    <button class="slds-m-left_small slds-button slds-button_icon drmapper_autoMatchField_matchedMapping_delete"\n                                            ng-click="vm.removeMapping(mapping, $index)">\n                                        <slds-button-svg-icon sprite="\'utility\'" icon="\'close\'" size="\'\'"></slds-button-svg-icon>\n                                    </button>\n                                </div>\n                            </div>\n                        </li>\n                    </ul>\n                </div>\n            </div>\n        </div>\n\n        <div id="drmapper_autoMatchField_spinner" class="slds-spinner_container" ng-if="vm.inputMappings == null || vm.outputMappings == null || vm.saving">\n            <div class="slds-spinner--brand slds-spinner slds-spinner--medium" role="alert">\n                <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'LoadingUC\', \'Loading\')}}</span>\n                <div class="slds-spinner__dot-a"></div>\n                <div class="slds-spinner__dot-b"></div>\n            </div>\n        </div>\n    </div>\n    <div class="slds-modal__footer slds-grid slds-grid_align-center">\n        <button class="slds-button slds-button_brand" ng-click="vm.pairMappings()"\n                ng-disabled="!(vm.selectedInput && (vm.selectedOutput || vm.selectedMatched)) || vm.inputMappings == null || vm.outputMappings == null || vm.saving"\n                id="drmapper_autoMatchField_pair"\n                tabindex="0">\n            Pair\n        </button>\n        <button class="slds-button slds-button_brand" ng-click="vm.autoMatch()"\n            ng-disabled="vm.inputMappings == null || vm.outputMappings == null || vm.saving"\n            id="drmapper_autoMatchField_autoMatch"\n            tabindex="0">\n            Auto Match\n        </button>\n        <button class="slds-button slds-button_neutral" ng-click="vm.synchronizeTokens()"\n                ng-disabled="vm.inputMappings == null || vm.outputMappings == null || vm.saving"\n                ng-if="vm.isDocumentTemplateOuput"\n                id="drmapper_autoMatchField_synchonrizeTokens"\n                tabindex="0">\n                Synchronize Tokens\n        </button>\n        <div class="slds-is-absolute slds-p-right_small" style="right: 0">\n            <button class="slds-button slds-button_neutral"\n                    ng-disabled="vm.saving"\n                    ng-click="vm.cancel()"\n                    id="drmapper_autoMatchField_cancel"\n                    tabindex="0">{{::$root.vlocity.getCustomLabel(\'Cancel\', \'Cancel\')}}</button>\n            <button class="slds-button slds-button_brand"\n                    ng-click="vm.save()"\n                    ng-disabled="vm.inputMappings == null || vm.outputMappings == null || vm.saving"\n                    id="drmapper_autoMatchField_save"\n                    tabindex="0">{{::$root.vlocity.getCustomLabel(\'Save\', \'Save\')}}</button>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("preview/previewLoadTransform.tpl.html",'<div class="slds-col slds-grid slds-grid_vertical-stretch slds-nowrap slds-is-relative drmapper_previewLoadTransform">\n\n  \x3c!-- INPUT Sidebar --\x3e\n  <div class="slds-panel dr-preview--input slds-border_right slds-size_1-of-4 slds-grid slds-grid_vertical slds-nowrap" style="max-width: 25%">\n    <div class="slds-filters__header slds-p-top_small slds-grid slds-has-divider_bottom">\n      <h4 class="slds-align-middle slds-text-heading_small">{{::$root.vlocity.getCustomLabel(\'Input\', \'Input\')}}</h4>\n    </div>\n    <div class="slds-grow slds-col slds-grid_vertical slds-grid_vertical-stretch slds-grid slds-scrollable_y">\n      <div class="slds-panel__section slds-col slds-grid_vertical slds-grid_vertical-stretch slds-grid">\n        <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" ng-if="vm.inputType == \'JSON\'" ng-model="vm.inputJson"\n        id="drmapper_previewLoadTransform_inputJson"\n          ng-model-options="{\'allowInvalid\': true, updateOn:\'default blur\', debounce: {\'default\': 1000, \'blur\':0}}" ng-change="vm.onInputJsonChange()"></dr-editor>\n        <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" ng-if="vm.inputType == \'XML\'" language="xml"\n          id="drmapper_previewLoadTransform_inputXml"\n          ng-model="vm.inputXml" ng-model-options="{\'allowInvalid\': true, updateOn:\'default blur\', debounce: {\'default\': 1000, \'blur\':0}}" ng-change="vm.onInputXmlChange()"></dr-editor>\n        <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" ng-if="vm.inputType == \'Custom\'" language=\'text\' ng-model="vm.inputCustom"\n        id="drmapper_previewLoadTransform_inputCustom"\n          ng-model-options="{\'allowInvalid\': true, updateOn:\'default blur\', debounce: {\'default\': 1000, \'blur\':0}}" ng-change="vm.onInputCustomChange()"></dr-editor>\n\n        <div class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small slds-form-element" ng-if="vm.inputType == \'SObject\' && !vm.isTransform">\n          <div class="slds-col slds-form-element__control slds-grid slds-grid_vertical-stretch" style="width:100%">\n            <textarea class="slds-textarea slds-col" style="width:100%;" ng-model="vm.inputRows"\n            id="drmapper_previewLoadTransform_inputRows"></textarea>\n          </div>\n        </div>\n        <fieldset class="slds-form--compound slds-hide">\n          <div class="slds-form-element__group">\n            <div class="slds-form-element__row">\n              <div class="slds-form-element slds-size_1-of-2">\n                <div class="slds-form-element__control">\n                  <span class="slds-checkbox">\n                    <input type="checkbox" ng-model="vm.simulate" id="simulate" />\n                    <label class="slds-checkbox__label" for="simulate">\n                      <span class="slds-checkbox--faux"></span>\n                      <span class="slds-form-element__label">{{::$root.vlocity.getCustomLabel(\'Execute\', \'Execute\')}}</span>\n                    </label>\n                  </span>\n                </div>\n              </div>\n              <div class="slds-form-element slds-size_1-of-2">\n                <div class="slds-form-element__control">\n                  <span class="slds-checkbox">\n                    <input type="checkbox" ng-model="vm.bulkUpload" id="bulkUpload" />\n                    <label class="slds-checkbox__label" for="bulkUpload">\n                      <span class="slds-checkbox--faux"></span>\n                      <span class="slds-form-element__label">{{::$root.vlocity.getCustomLabel(\'BulkUpload\', \'Bulk Upload?\')}}</span>\n                    </label>\n                  </span>\n                </div>\n              </div>\n            </div>\n          </div>\n        </fieldset>\n      </div>\n    </div>\n    <div class="slds-panel__actions slds-has-divider--top">\n      <div class="slds-grid">\n        <div>\n          <a ng-click="vm.reset()" class="slds-button" id="drmapper_previewLoadTransform_clearData">{{::$root.vlocity.getCustomLabel(\'ClearData\', \'Clear Data\')}}</a>\n          <input class="slds-m-left_x-small" ng-if="vm.isTransform" name="checkbox" type="checkbox" ng-model="vm.ignoreCachePreview" id="drmapper_previewLoadTransform_ignoreCachePreview"/><span class="slds-m-left_xx-small" ng-if="vm.isTransform">{{::$root.vlocity.getCustomLabel(\'IgnoreCache\', \'Ignore Cache\')}}</span>\n        </div>\n        <button class="slds-button slds-button--brand slds-col_bump-left" ng-click="vm.submitRequest()" ng-disabled="vm.invalidJSON  && vm.jsonMode" id="drmapper_previewLoadTransform_execute">{{::$root.vlocity.getCustomLabel(\'Execute\', \'Execute\')}}</button>\n      </div>\n    </div>\n  </div>\n\n  \x3c!-- Response center column --\x3e\n  <div class="slds-grid slds-grid_vertical slds-grid_vertical-stretch" ng-class="{\'slds-col\': !vm.sidebarOpen, \'slds-size_2-of-4\': vm.sidebarOpen}">\n    <div class="slds-col slds-grid slds-grid_vertical slds-grid_vertical-stretch" ng-if="!vm.isTransform">\n      <div class="slds-grid slds-p-top_small slds-p-bottom_x-small slds-p-left_small slds-p-right_xx-large slds-has-divider_bottom">\n        <div class="slds-text-heading_small">{{::$root.vlocity.getCustomLabel(\'ObjectsCreated\', \'Objects Created\')}}\n          <span class="slds-text-body--regular slds-m-left_small" ng-if="vm.requestTime"> <b>Performance Metrics - Browser:</b> {{vm.requestTime}}ms</span>\n          <span class="slds-text-body--regular slds-m-left_small" ng-if="vm.requestTime"><b> Server:</b> {{vm.ActualTime}}ms</span>\n          <span class="slds-text-body--regular slds-m-left_small" ng-if="vm.requestTime"><b> Apex CPU:</b> {{vm.CpuTime}}ms</span>\n          <button class="slds-button slds-button_icon performace-metrics-info"\n                  id="drmapper_fieldBundleTable_performancePopover"\n                  ng-show="vm.requestTime"\n                  ng-mouseover="showPerformanceHint(\'show\')" \n                  ng-mouseleave="showPerformanceHint(\'hide\')">\n                  <slds-button-svg-icon sprite="\'utility\'" icon="\'info\'"></slds-button-svg-icon>\n          </button>\n        </div>\n      </div>\n      <div class="slds-col slds-box slds-theme--default slds-m-around_small">\n        <ul class="slds-list--dotted"  id="drmapper_previewLoadTransform_responseRows">\n          <li ng-repeat="object in vm.response.createdObjects track by $index">\n            <a ng-href="/{{object.id}}" target="_blank" id="drmapper_previewLoadTransform_responseRow-{{$index}}">{{object.index}}- {{object.type}}: {{object.id}}</a>\n          </li>\n        </ul>\n      </div>\n    </div>\n    <div class="slds-col slds-grid slds-grid_vertical slds-grid_vertical-stretch" ng-if="vm.isTransform">\n      <div class="slds-grid slds-p-top_small slds-p-bottom_x-small slds-p-left_small slds-p-right_xx-large slds-has-divider_bottom">\n        <div class="slds-text-heading_small">{{::$root.vlocity.getCustomLabel(\'Response\', \'Response\')}}\n          <span class="slds-text-body--regular slds-m-left_small" ng-if="vm.requestTime"> <b>Performance Metrics - Browser:</b> {{vm.requestTime}}ms</span>\n          <span class="slds-text-body--regular slds-m-left_small" ng-if="vm.requestTime"><b> Server:</b> {{vm.ActualTime}}ms</span>\n          <span class="slds-text-body--regular slds-m-left_small" ng-if="vm.requestTime"><b> Apex CPU:</b> {{vm.CpuTime}}ms</span>\n          <button class="slds-button slds-button_icon performace-metrics-info"\n                  id="drmapper_fieldBundleTable_performancePopover"\n                  ng-show="vm.requestTime"\n                  ng-mouseover="showPerformanceHint(\'show\')" \n                  ng-mouseleave="showPerformanceHint(\'hide\')">\n                  <slds-button-svg-icon sprite="\'utility\'" icon="\'info\'"></slds-button-svg-icon>\n          </button>\n        </div>\n      </div>\n      <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-m-around_small" ng-if="vm.outputType !== \'XML\' && vm.outputType !== \'Custom\'" readonly="readonly"\n        id="drmapper_previewLoadTransform_responseJson"\n        disabled="disabled" ng-model="vm.response.returnResultsData"></dr-editor>\n      <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-m-around_small" ng-if="vm.outputType == \'XML\'" language="xml"\n        id="drmapper_previewLoadTransform_responseXml"\n        readonly="readonly" disabled="disabled" ng-model="vm.response.returnResultsData"></dr-editor>\n      <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-m-around_small" ng-if="vm.outputType == \'Custom\'" language="text"\n        id="drmapper_previewLoadTransform_responseCustom"\n        readonly="readonly" disabled="disabled" ng-model="vm.response.returnResultsData"></dr-editor>\n    </div>\n  </div>\n\n  <slds-accordian-side-bar title="{{::$root.vlocity.getCustomLabel(\'ErrorsDebugOutput\', \'Errors/Debug Output\')}}" sidebar-open="vm.sidebarOpen">\n    <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DebugLog\', \'Debug Log\')}}">\n      <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-m-bottom_small" language="yaml" readonly="readonly"\n        id="drmapper_previewLoadTransform_debugLog"\n        disabled="disabled" ng-model="vm.response.debugLog"></dr-editor>\n    </slds-accordian-side-bar-pane>\n    <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'Errors\', \'Errors\')}}">\n      <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-m-bottom_small" language="javascript" readonly="readonly"\n        id="drmapper_previewLoadTransform_errors"\n        disabled="disabled" ng-model="vm.response.errors"></dr-editor>\n    </slds-accordian-side-bar-pane>\n  </slds-accordian-side-bar>\n\n  <div class="slds-spinner_container" ng-if="vm.requesting">\n    <div class="slds-spinner--brand slds-spinner slds-spinner--medium" role="alert">\n      <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'LoadingUC\', \'Loading\')}}</span>\n      <div class="slds-spinner__dot-a"></div>\n      <div class="slds-spinner__dot-b"></div>\n    </div>\n  </div>\n</div>'),$templateCache.put("preview/previewExtract.tpl.html",'<div class="slds-col slds-grid slds-grid_vertical-stretch slds-nowrap slds-is-relative drmapper_previewExtract">\n\n  \x3c!-- Input column --\x3e\n  <div class="slds-panel dr-preview--input slds-border_right slds-size_1-of-4 slds-grid slds-grid_vertical slds-nowrap" style="max-width: 25%">\n    <div class="slds-filters__header slds-p-top_small slds-grid slds-has-divider_bottom">\n      <h4 class="slds-align-middle slds-text-heading_small">{{::$root.vlocity.getCustomLabel(\'InputParameters\', \'Input Parameters\')}}</h4>\n      <button class="slds-button slds-col_bump-left"\n              style="line-height: 1rem;" \n              ng-click="vm.toggleJsonMode()" \n              id="drmapper_previewExtract_editAsJson"\n              ng-if="!vm.jsonMode && vm.inputType != \'XML\' && vm.inputType != \'Custom\'">{{::$root.vlocity.getCustomLabel(\'EditAsJSON\' , \'Edit as JSON\')}}</button>\n      <button class="slds-button slds-col_bump-left" style="line-height: 1rem;" ng-click="vm.toggleJsonMode()" ng-if=" vm.jsonMode && vm.inputType != \'XML\' && vm.inputType != \'Custom\'"\n              id="drmapper_previewExtract_editAsParams">{{::$root.vlocity.getCustomLabel(\'EditAsParams\' , \'Edit as params\')}}</button>\n    </div>\n    <div class="slds-grow slds-col slds-grid_vertical slds-grid_vertical-stretch slds-grid slds-scrollable_y">\n      <div class="slds-panel__section slds-col slds-grid_vertical slds-grid_vertical-stretch slds-grid">\n        <div class="slds-form--compound" ng-if="!vm.jsonMode && vm.inputType != \'XML\' && vm.inputType != \'Custom\'">\n          <div class="slds-form-element__group">\n            <div class="slds-form-element__row">\n              <div class="slds-form-element slds-size_1-of-2">\n                <label class="slds-form-element__label">{{::$root.vlocity.getCustomLabel(\'Key\', \'Key\')}}</label>\n              </div>\n              <div class="slds-form-element slds-size_1-of-2">\n                <label class="slds-form-element__label">{{::$root.vlocity.getCustomLabel(\'Value\', \'Value\')}}</label>\n              </div>\n            </div>\n          </div>\n        </div>\n        <fieldset class="slds-form--compound" ng-repeat="param in vm.params" ng-if="!vm.jsonMode && vm.inputType != \'XML\'">\n          <div class="slds-form-element__group">\n            <div class="slds-form-element__row">\n              <div class="slds-form-element slds-size_3-of-7">\n                <input class="slds-input" type="text" ng-model="param.key" id="drmapper_previewExtract_paramKey-{{$index}}"/>\n              </div>\n              <div class="slds-form-element slds-size_3-of-7">\n                <input class="slds-input" type="text" ng-model="param.value" \n                id="drmapper_previewExtract_paramValue-{{$index}}" ng-model-options="{\'allowInvalid\': true, updateOn:\'default blur\', debounce: {\'default\': 1000, \'blur\':0}}" ng-change="vm.onInputJsonChange()"/>\n              </div>\n              <div class="slds-size_1-of-7">\n                <button class="slds-button slds-button_icon slds-m-left_x-small" ng-click="vm.deleteParam(param)"\n                id="drmapper_previewExtract_deleteParam-{{$index}}">\n                  <slds-button-svg-icon sprite="\'utility\'" icon="\'delete\'"></slds-button-svg-icon>\n                </button>\n              </div>\n            </div>\n          </div>\n        </fieldset>\n        <div class="slds-text-align_center slds-m-bottom_small" ng-if="!vm.jsonMode && vm.inputType != \'XML\' && vm.inputType != \'Custom\'">\n          <button class="slds-button" ng-click="vm.addParam()"\n                  id="drmapper_previewExtract_addNewParam">\n            <slds-button-svg-icon sprite="\'utility\'" icon="\'add\'"></slds-button-svg-icon>\n            {{::$root.vlocity.getCustomLabel(\'AddNewKeyValuePair\', \'Add New Key/Value Pair\')}}\n          </button>\n        </div>\n        <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" ng-if="vm.jsonMode && vm.inputType != \'XML\' && vm.inputType != \'Custom\'"\n                   id="drmapper_previewExtract_jsoninput"\n          ng-model="vm.jsonParams" ng-model-options="{\'allowInvalid\': true, updateOn:\'default blur\', debounce: {\'default\': 1000, \'blur\':0}}" ng-change="vm.onInputJsonChange()"></dr-editor>\n        <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" ng-if="vm.inputType == \'XML\'" language="xml"\n                   id="drmapper_previewExtract_xmlInput"\n          ng-model="vm.xmlInput" ng-model-options="{\'allowInvalid\': true, updateOn:\'default blur\', debounce: {\'default\': 1000, \'blur\':0}}" ng-change="vm.onInputXmlChange()"></dr-editor>\n        <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" ng-if="vm.inputType == \'Custom\'" language="text"\n                   id="drmapper_previewExtract_CustomInput"\n          ng-model="vm.customInput" ng-model-options="{\'allowInvalid\': true, updateOn:\'default blur\', debounce: {\'default\': 1000, \'blur\':0}}" ng-change="vm.onInputCustomChange()"></dr-editor>\n      </div>\n    </div>\n    <div class="slds-panel__actions slds-has-divider--top">\n      <div class="slds-grid">\n        <div>\n          <button ng-click="vm.reset()" class="slds-button" id="drmapper_previewExtract_clearData">{{::$root.vlocity.getCustomLabel(\'ClearData\', \'Clear Data\')}}</button>\n          <input class="slds-m-left_x-small" name="checkbox" type="checkbox" ng-model="vm.ignoreCachePreview" id="drmapper_previewExtract_ignoreCachePreview"><span class="slds-m-left_xx-small">{{::$root.vlocity.getCustomLabel(\'IgnoreCache\', \'Ignore Cache\')}}</span>\n        </div>\n        <button class="slds-button slds-button--brand slds-col_bump-left" ng-click="vm.submitRequest()" ng-disabled="vm.invalidJSON  && vm.jsonMode" id="drmapper_previewExtract_execute">{{::$root.vlocity.getCustomLabel(\'Execute\', \'Execute\')}}</button>\n      </div>\n    </div>\n  </div>\n\n  <div class="slds-grid slds-grid_vertical slds-grid_vertical-stretch" ng-class="{\'slds-col\': !vm.sidebarOpen, \'slds-size_2-of-4\': vm.sidebarOpen}">\n    <div class="slds-col slds-grid slds-grid_vertical slds-grid_vertical-stretch">\n      <div class="slds-grid slds-p-top_small slds-p-bottom_x-small slds-p-left_small slds-p-right_xx-large slds-has-divider_bottom">\n        <div class="slds-text-heading_small">{{::$root.vlocity.getCustomLabel(\'Response\', \'Response\')}}\n          <span class="slds-text-body--regular slds-m-left_small" ng-if="vm.requestTime"> <b>Performance Metrics - Browser:</b> {{vm.requestTime}}ms</span>\n          <span class="slds-text-body--regular slds-m-left_small" ng-if="vm.requestTime"><b> Server:</b> {{vm.ActualTime}}ms</span>\n          <span class="slds-text-body--regular slds-m-left_small" ng-if="vm.requestTime"><b> Apex CPU:</b> {{vm.CpuTime}}ms</span>\n          <button class="slds-button slds-button_icon performace-metrics-info"\n                  id="drmapper_fieldBundleTable_performancePopover"\n                  ng-show="vm.requestTime"\n                  ng-mouseover="showPerformanceHint(\'show\')"\n                  ng-mouseleave="showPerformanceHint(\'hide\')">\n                  <slds-button-svg-icon sprite="\'utility\'" icon="\'info\'"></slds-button-svg-icon>\n          </button>\n        </div>\n      </div>\n      <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-m-around_small" ng-if="vm.outputType == \'JSON\'" readonly="readonly"\n        id="drmapper_previewExtract_responseJson"\n        disabled="disabled" ng-model="vm.response.returnResultsData"></dr-editor>\n      <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-m-around_small" ng-if="vm.outputType == \'XML\'" language="xml"\n        id="drmapper_previewExtract_responseXml"\n        readonly="readonly" disabled="disabled" ng-model="vm.response.returnResultsData"></dr-editor>\n      <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-m-around_small" ng-if="vm.outputType == \'Custom\'" language="text"\n        id="drmapper_previewExtract_responseCustom"\n        readonly="readonly" disabled="disabled" ng-model="vm.response.returnResultsData"></dr-editor>\n    </div>\n  </div>\n\n  <slds-accordian-side-bar title="{{::$root.vlocity.getCustomLabel(\'ErrorsDebugOutput\', \'Errors/Debug Output\')}}" \n                           sidebar-open="vm.sidebarOpen">\n    <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DebugLog\', \'Debug Log\')}}">\n        <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-m-bottom_small" \n                   id="drmapper_previewExtract_debugLog"\n                   language="yaml" \n                   readonly="readonly"\n                   disabled="disabled" \n                   ng-model="vm.response.debugLog"></dr-editor>\n    </slds-accordian-side-bar-pane>\n    <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'Errors\', \'Errors\')}}">\n        <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-m-bottom_small" \n                   id="drmapper_previewExtract_errors"\n                   language="javascript" \n                   readonly="readonly"\n                   disabled="disabled" \n                   ng-model="vm.response.errors"></dr-editor>\n    </slds-accordian-side-bar-pane>\n  </slds-accordian-side-bar>\n\n  <div class="slds-spinner_container" ng-if="vm.requesting" id="drmapper_previewExtract_spinner">\n    <div class="slds-spinner--brand slds-spinner slds-spinner--medium" role="alert">\n      <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'LoadingUC\', \'Loading\')}}</span>\n      <div class="slds-spinner__dot-a"></div>\n      <div class="slds-spinner__dot-b"></div>\n    </div>\n  </div>\n</div>\n'),$templateCache.put("load/loadOptionsTab.tpl.html",'<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small slds-p-right_small drmapper_loadOptionsTab_batchSizeKey" \n    ng-if="vm.isSObjectInput()"\n    field="vm.fieldMetadata[vm.batchSizeKey]" \n    model="vm.bundle[vm.batchSizeKey]" \n    object-type="::vm.objectType" \n    object-id="vm.bundle.Id" \n    container=".via-slds"\n    on-change="vm.onFieldChange(vm.batchSizeKey)"></slds-form-element>\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_loadOptionsTab_processNowThresholdKey" \n    ng-if="vm.isSObjectInput()"\n    field="vm.fieldMetadata[vm.processNowThresholdKey]" \n    model="vm.bundle[vm.processNowThresholdKey]" \n    object-type="::vm.objectType" \n    object-id="vm.bundle.Id" \n    container=".via-slds"\n    on-change="vm.onFieldChange(vm.processNowThresholdKey)"></slds-form-element>\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small slds-p-right_small drmapper_loadOptionsTab_preprocessorClassNameKey" \n    ng-if="vm.isSObjectInput()"\n    field="vm.fieldMetadata[vm.preprocessorClassNameKey]" \n    model="vm.bundle[vm.preprocessorClassNameKey]" \n    object-type="::vm.objectType" \n    object-id="vm.bundle.Id" \n    container=".via-slds"\n    on-change="vm.onFieldChange(vm.preprocessorClassNameKey)"></slds-form-element>\n<div class="slds-size_1-of-2"\n    ng-if="vm.isSObjectInput()"></div>\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_loadOptionsTab_deleteOnSuccessKey" \n    ng-if="vm.isSObjectInput()"\n    field="vm.fieldMetadata[vm.deleteOnSuccessKey]" \n    model="vm.bundle[vm.deleteOnSuccessKey]" \n    object-type="::vm.objectType" \n    object-id="vm.bundle.Id" \n    on-change="vm.onFieldChange(vm.deleteOnSuccessKey)"></slds-form-element>\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_loadOptionsTab_isProcessSuperBulkKey" \n    ng-if="vm.isSObjectInput()"\n    field="vm.fieldMetadata[vm.isProcessSuperBulkKey]" \n    model="vm.bundle[vm.isProcessSuperBulkKey]" \n    object-type="::vm.objectType" \n    object-id="vm.bundle.Id" \n    on-change="vm.onFieldChange(vm.isProcessSuperBulkKey)"></slds-form-element>\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_loadOptionsTab_isDefaultForInterfaceKey" \n    ng-if="vm.isSObjectInput()"\n    field="vm.fieldMetadata[vm.isDefaultForInterfaceKey]" \n    model="vm.bundle[vm.isDefaultForInterfaceKey]" \n    object-type="::vm.objectType" \n    object-id="vm.bundle.Id" \n    container=".via-slds"\n    ng-disabled="vm.hasDefaultForInterface"\n    on-change="vm.onFieldChange(vm.isDefaultForInterfaceKey)"></slds-form-element>\n\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_loadOptionsTab_ignoreErrorsKey" \n    field="vm.fieldMetadata[vm.ignoreErrorsKey]" \n    model="vm.bundle[vm.ignoreErrorsKey]" \n    object-type="::vm.objectType" \n    object-id="vm.bundle.Id" \n    on-change="vm.onFieldChange(vm.ignoreErrorsKey)"></slds-form-element>\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_loadOptionsTab_rollbackOnErrorKey" \n    field="vm.fieldMetadata[vm.rollbackOnErrorKey]" \n    model="vm.bundle[vm.rollbackOnErrorKey]" \n    object-type="::vm.objectType" \n    object-id="vm.bundle.Id" \n    on-change="vm.onFieldChange(vm.rollbackOnErrorKey)"></slds-form-element>\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_loadOptionsTab_useAssignmentRulesKey" \n    field="vm.fieldMetadata[vm.useAssignmentRulesKey]" \n    model="vm.bundle[vm.useAssignmentRulesKey]" \n    object-type="::vm.objectType" \n    object-id="vm.bundle.Id" \n    on-change="vm.onFieldChange(vm.useAssignmentRulesKey)"></slds-form-element>\n<slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_loadOptionsTab_overwriteNullValuesKey" \n    field="vm.fieldMetadata[vm.overwriteNullValuesKey]" \n    model="vm.bundle[vm.overwriteNullValuesKey]" \n    object-type="::vm.objectType" \n    object-id="vm.bundle.Id" \n    on-change="vm.onFieldChange(vm.overwriteNullValuesKey)"></slds-form-element>'),$templateCache.put("load/loadTabs.tpl.html",'<div class="slds-tabs--default slds-col slds-grid slds-grid_vertical slds-grid_vertical-stretch drmapper_loadTabs" style="overflow: hidden">\n    <ul class="slds-tabs--default__nav" role="tablist" style="flex-shrink: 0;">\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'Objects\', \'Objects\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 0}">\n            <a  class="slds-tabs--default__link"\n                role="tab"\n                ng-click="vm.activeTab = 0"\n                tabindex="0"\n                aria-selected="true"\n                aria-controls="tab-default-1"\n                id="tab-default-1__item">{{::$root.vlocity.getCustomLabel(\'Objects\', \'Objects\')}}</a>\n        </li>\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            title="{{::$root.vlocity.getCustomLabel(\'Formulas\', \'Formulas\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 1}">\n            <a class="slds-tabs--default__link"\n               role="tab"\n               ng-click="vm.activeTab = 1"\n               tabindex="-1"\n               aria-selected="false"\n               aria-controls="tab-default-2"\n               id="tab-default-2__item">{{::$root.vlocity.getCustomLabel(\'Formulas\', \'Formulas\')}}</a>\n        </li>\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'Fields\', \'Fields\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 2}">\n            <a  class="slds-tabs--default__link"\n                role="tab"\n                ng-click="vm.activeTab = 2"\n                tabindex="-1"\n                aria-selected="false"\n                aria-controls="tab-default-3"\n                id="tab-default-3__item">{{::$root.vlocity.getCustomLabel(\'Fields\', \'Fields\')}}</a>\n        </li>\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'DRMapperOptions\', \'Options\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 3}">\n            <a class="slds-tabs--default__link"\n                ng-click="vm.activeTab = 3"\n                role="tab"\n                tabindex="-1"\n                aria-selected="false"\n                aria-controls="tab-default-4"\n                id="tab-default-4__item">{{::$root.vlocity.getCustomLabel(\'DRMapperOptions\', \'Options\')}}</a>\n        </li>\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'Preview\', \'Preview\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 4}">\n            <a  class="slds-tabs--default__link"\n                role="tab"\n                ng-click="vm.activeTab = 4"\n                tabindex="-1"\n                aria-selected="false"\n                aria-controls="tab-default-5"\n                id="tab-default-5__item">{{::$root.vlocity.getCustomLabel(\'Preview\', \'Preview\')}}</a>\n        </li>\n    </ul>\n    <div id="tab-default-1"\n        class="slds-col slds-grid slds-grid_vertical-stretch"\n        role="tabpanel"\n        aria-labelledby="tab-default-1__item"\n        ng-show="vm.activeTab == 0"\n        style="overflow: hidden">\n        <load-object-tab bundle="vm.bundle"\n                         shown="vm.activeTab == 0"\n                          class="slds-col slds-grid slds-grid_vertical-stretch"></load-object-tab>\n    </div>\n    <div id="tab-default-2"\n    class="slds-col slds-grid slds-grid_vertical-stretch"\n    role="tabpanel"\n    aria-labelledby="tab-default-2__item"\n    ng-if="vm.activeTab == 1"\n    style="overflow: hidden" >\n        <formula-tab bundle="vm.bundle"\n                     class="slds-col slds-grid slds-grid_vertical-stretch"></formula-tab>\n    </div>\n    <div id="tab-default-3"\n         class="slds-col slds-grid slds-grid_vertical-stretch"\n         role="tabpanel"\n         aria-labelledby="tab-default-3__item"\n         ng-if="vm.activeTab == 2"\n         style="overflow: hidden" >\n        <load-fields-tab bundle="vm.bundle"\n                         class="slds-col slds-grid slds-grid_vertical-stretch"\n                         style="overflow:hidden;"></load-fields-tab>\n    </div>\n    <div id="tab-default-4"\n         class="slds-col slds-grid slds-grid_vertical-stretch"\n         role="tabpanel"\n         aria-labelledby="tab-default-4__item"\n         ng-show="vm.activeTab == 3"\n         style="overflow: hidden" >\n         <load-options-tab bundle="vm.bundle"\n                           class="slds-col slds-grid slds-grid_vertical-align-start slds-wrap slds-p-around_small"></load-options-tab>\n    </div>\n    <div id="tab-default-5"\n        class="slds-col slds-grid slds-grid_vertical-stretch"\n        role="tabpanel"\n        aria-labelledby="tab-default-5__item"\n        ng-show="vm.activeTab == 4"\n        style="overflow: hidden" >\n        <preview-load-transform drurl="/services/apexrest/{{nsForUrl}}v2/DataRaptor/"\n                                bundle-name="{{vm.bundle.Name}}"\n                                bundle="vm.bundle"\n                                is-visible="vm.activeTab == 3"\n                                initial-json="vm.bundle[vm.ns + \'SampleInputJSON__c\']"\n                                initial-rows="vm.bundle[vm.ns + \'SampleInputRows__c\']"\n                                initial-xml="vm.bundle[vm.ns + \'SampleInputXML__c\']"\n                                initial-custom="vm.bundle[vm.ns + \'SampleInputCustom__c\']"\n                                reset-json="vm.bundle[vm.ns + \'InputJson__c\']"\n                                reset-xml="vm.bundle[vm.ns + \'InputXml__c\']"\n                                load-json="::vm.bundle[vm.ns + \'Type__c\'] == \'Load\'"\n                                is-transform="::vm.bundle[vm.ns + \'Type__c\'] == \'Transform\'"\n                                input-type="vm.bundle[vm.ns + \'InputType__c\']"\n                                output-type="vm.bundle[vm.ns + \'OutputType__c\']"></preview-load-transform>\n    </div>\n</div>\n'),$templateCache.put("load/loadFieldsTab.tpl.html",'<div class=" slds-col slds-grid slds-grid_vertical-stretch drmapper_loadFieldsTab" style="overflow:hidden">\n    <div class="slds-grid slds-grid_vertical-stretch via-drmapper-load-bundle" ng-class="{\'slds-size_3-of-4\': vm.sidebarOpen && !vm.isSObjectInput(), \'slds-col\': !vm.sidebarOpen || vm.isSObjectInput()}"\n        style="padding-right: 0; overflow:hidden">\n        <div class="slds-tabs--scoped slds-col slds-grid slds-grid_vertical slds-grid_vertical-stretch" style="overflow:hidden">\n            <ul class="slds-tabs--scoped__nav drmapper_loadFieldsTab_grid"\n                role="tablist"\n                style="flex-shrink: 0; border-radius: 0; overflow-x:auto;overflow-y: hidden;">\n                <li class="slds-tabs--scoped__item"\n                    ng-class="{\'slds-active\': vm.activeTab === $index, \'via-slds-invalid\': object.isInvalid}"\n                    ng-repeat="object in vm.loadObjectMappings"\n                    ng-attr-title="{{object.label}}"\n                    role="presentation">\n                    <a class="slds-tabs--scoped__link"\n                        role="tab" tabindex="0"\n                        aria-selected="true"\n                        ng-attr-aria-controls="tab-scoped-{{$index + 1}}"\n                        ng-attr-id="tab-scoped-{{$index + 1}}__item"\n                        ng-click="vm.activeTab = $index"\n                        ng-bind="object.label">\n                    </a>\n                </li>\n                <li class="slds-tabs--scoped__item"\n                    ng-class="{\'slds-active\': vm.activeTab === vm.loadObjectMappings.length}"\n                    ng-attr-title="{{::$root.vlocity.getCustomLabel(\'All\', \'All\')}}"\n                    role="presentation">\n                    <a class="slds-tabs--scoped__link"\n                        role="tab" tabindex="0"\n                        aria-selected="true"\n                        ng-attr-aria-controls="tab-scoped-{{vm.loadObjectMappings.length}}"\n                        ng-attr-id="tab-scoped-{{vm.loadObjectMappings.length}}__item"\n                        ng-click="vm.activeTab = vm.loadObjectMappings.length">\n                        {{::$root.vlocity.getCustomLabel(\'All\', \'All\')}}\n                    </a>\n                </li>\n            </ul>\n            <div class="slds-tabs--scoped__content slds-col slds-scrollable_y"\n                ng-repeat="obj in vm.loadObjectMappings"\n                ng-class="{\'slds-show\': vm.activeTab === $index, \'slds-hide\': vm.activeTab !== $index}"\n                role="tabpanel"\n                ng-attr-id="tab-scoped-{{$index + 1}}"\n                ng-attr-aria-labelledby="tab-scoped-{{$index + 1}}__item"\n                style="padding: 0; border-radius: 0;">\n                <field-bundle-table\n                        id="drmapper_loadFieldsTab_table-{{$index + 1}}"\n                        ng-if="vm.activeTab === $index"\n                        bundle="vm.bundle"\n                        scoped-to-object="{{obj.name}}"\n                        creation-order="{{obj.creationOrder}}"\n                        mapping-filter="vm.mappingFilter(mapping, obj)"\n                        on-field-mapping-change="vm.handleFieldMappingChange(mapping, obj)"></field-bundle-table>\n            </div>\n            <div class="slds-tabs--scoped__content slds-col slds-scrollable_y"\n                ng-class="{\'slds-show\': vm.activeTab === vm.loadObjectMappings.length, \'slds-hide\': vm.activeTab !== vm.loadObjectMappings.length}"\n                role="tabpanel"\n                ng-attr-id="tab-scoped-{{vm.loadObjectMappings.length}}"\n                ng-attr-aria-labelledby="tab-scoped-{{vm.loadObjectMappings.length}}__item"\n                style="padding: 0; border-radius: 0;">\n                <field-bundle-table\n                        id="drmapper_loadFieldsTab_table-{{vm.loadObjectMappings.length}}"\n                        ng-if="vm.activeTab === vm.loadObjectMappings.length"\n                        bundle="vm.bundle"\n                        load-object-mappings="vm.loadObjectMappings"\n                        mapping-filter="vm.mappingFilter(mapping, null)"></field-bundle-table>\n            </div>\n        </div>\n    </div>\n    <div class="slds-panel slds-grid slds-grid_vertical slds-nowrap slds-panel_filters via-slds-sidebar slds-border_left"\n         ng-class="{\'via-slds-sidebar--closed\': !vm.sidebarOpen}"\n         ng-if="!vm.isSObjectInput()">\n        <div class="slds-form_stacked slds-grow slds-col slds-grid slds-grid_vertical">\n            <div class="slds-filters slds-col slds-grid slds-grid_vertical slds-grid_vertical-stretch">\n                <div class="slds-filters__header slds-grid slds-has-divider_bottom-space">\n                    <h4 class="slds-align-middle slds-text-heading_small" ng-show="vm.sidebarOpen"\n                        ng-if="vm.isJsonInput()">{{::$root.vlocity.getCustomLabel(\'InputJSON\', \'Input JSON\')}}</h4>\n                    <h4 class="slds-align-middle slds-text-heading_small" ng-show="vm.sidebarOpen"\n                        ng-if="vm.isXmlInput()">{{::$root.vlocity.getCustomLabel(\'InputXML\', \'Input XML\')}}</h4>\n                    <h4 class="slds-align-middle slds-text-heading_small" ng-show="vm.sidebarOpen"\n                        ng-if="vm.isCustomInput()">{{::$root.vlocity.getCustomLabel(\'InputCustom\', \'Input Custom\')}}</h4>\n                    <button class="slds-button slds-col_bump-left slds-button_icon slds-button_icon-small drmapper_loadFieldsTab_toggleSidePanel"\n                            title="Close Filter Panel"\n                            ng-click="vm.sidebarOpen = !vm.sidebarOpen">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'forward\'" ng-if="vm.sidebarOpen"></slds-button-svg-icon>\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'back\'" ng-if="!vm.sidebarOpen"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Close Filter Panel</span>\n                    </button>\n                </div>\n                <div class="slds-filters__body slds-col slds-grid slds-grid_vertical slds-grid_vertical-stretch" ng-show="vm.sidebarOpen">\n                    <dr-editor  class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                        id="drmapper_loadFieldsTab_inputJson"\n                        ng-if="vm.isJsonInput()"\n                        ng-change="vm.inputChanged()"\n                        placeholder="{{::$root.vlocity.getCustomLabel(\'InputJSON\', \'Input JSON\')}}"\n                        ng-model-options="{\'allowInvalid\': true}"\n                        ng-model="vm.bundle[vm.ns + \'InputJson__c\']"></dr-editor>\n                    <dr-editor  class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                        id="drmapper_loadFieldsTab_inputXml"\n                        ng-change="vm.inputChanged()"\n                        language="xml"\n                        ng-if="vm.isXmlInput()"\n                        ng-model-options="{\'allowInvalid\': true}"\n                        placeholder="{{::$root.vlocity.getCustomLabel(\'InputXML\', \'Input XML\')}}"\n                        ng-model="vm.bundle[vm.ns + \'InputXml__c\']"></dr-editor>\n                    <dr-editor  class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                        id="drmapper_loadFieldsTab_inputCustom"\n                        ng-change="vm.inputChanged()"\n                        language="text"\n                        ng-if="vm.isCustomInput()"\n                        ng-model-options="{\'allowInvalid\': true}"\n                        placeholder="{{::$root.vlocity.getCustomLabel(\'InputCustom\', \'Input Custom\')}}"\n                        ng-model="vm.bundle[vm.ns + \'InputCustom__c\']"></dr-editor>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("load/loadObjectRow.tpl.html",'<li class="slds-box slds-grid slds-grid_vertical slds-m-bottom_small drmapper_loadObjectRow"\n    dnd-draggable="vm.object"\n    dnd-effect-allowed="move"\n    ng-form>\n    <div class="slds-grid"\n         dnd-nodrag>\n        <div class="slds-section__title"\n             ng-if="!vm.editing">\n            {{vm.rootMapping[vm.ns + \'DomainObjectCreationOrder__c\']}} - {{vm.readableObjectName}}\n            <button class="slds-button slds-float--right slds-button_icon slds-button_icon-small drmapper_loadObjectRow_editField"\n                    title="Edit this Field"\n                    ng-click="vm.editMappingInterfaceObjectName(true)">\n                <slds-button-svg-icon sprite="\'utility\'"\n                                      icon="\'unlock\'"\n                                      extra-classes="\'slds-button__icon--hint\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Edit this Field</span>\n            </button>\n        </div>\n        <div class="slds-section__title slds-size_1-of-2 slds-grid"\n             ng-if="vm.editing">\n            {{vm.order}} - <div class="slds-form-element slds-p-left_xx-small slds-text-body--regular slds-grow drmapper_loadObjectRow_objectNameWrapper"\n                                 ng-class="{\'slds-has-error\': !vm.objectName}">\n                                <slds-picklist class="drmapper_loadObjectRow_objectName"\n                                               multiple="false"\n                                               ng-model="vm.objectName"\n                                               slds-options="object.name as object.label for object in vm.sObjects"\n                                               autocomplete="true"\n                                               ng-required="true"\n                                               restrict="true"\n                                               ng-change="vm.onObjectNameChange()"></slds-picklist>\n                            </div>\n            <button class="slds-button slds-float--right slds-button_icon slds-button_icon-small drmapper_loadObjectRow_lockField"\n                    title="Lock this Field"\n                    ng-click="vm.editMappingInterfaceObjectName(false)">\n                <slds-button-svg-icon sprite="\'utility\'"\n                                      icon="\'lock\'"\n                                      extra-classes="\'slds-button__icon--hint\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Lock this Field</span>\n            </button>\n        </div>\n        <button class="slds-button slds-button_icon slds-col_bump-left drmapper_loadObjectRow_delete"\n                title="Delete"\n                ng-click="vm.deleteMapping(mappings)"\n                ng-if="!vm.deleting">\n            <slds-button-svg-icon sprite="\'action\'"\n                                  icon="\'delete\'" ></slds-button-svg-icon>\n            <span class="slds-assistive-text">Delete</span>\n        </button>\n        <button class="slds-button slds-button_icon slds-col_bump-left drmapper_loadObjectRow_deleting"\n                title="Deleting"\n                disabled="disabled"\n                ng-if="vm.deleting || vm.saving">\n            <slds-button-svg-icon sprite="\'utility\'"\n                                  icon="\'spinner\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Deleting</span>\n        </button>\n    </div>\n    <div class="slds-grid slds-m-top_small slds-grid_vertical ">\n        <div class="slds-col slds-grid slds-grid_pull-padded-x-small slds-p-bottom_small drmapper_loadObjectRow_linkMapping-{{$index}}"\n             ng-repeat="mapping in vm.mappings"\n             ng-if="vm.mappings.length > 0">\n            <span class="slds-icon_container slds-p-top_large"\n                    title="move"\n                    style="margin-left: -1em;"\n                    ng-class="{\'slds-hidden\': !$first}"\n                    dnd-handle\n                    ng-disabled="!$first">\n                <svg aria-hidden="true"\n                     class="slds-icon slds-icon_small"\n                     xmlns="http://www.w3.org/2000/svg"\n                     preserveAspectRatio="xMidYMid meet"\n                     viewBox="0 0 154 275">\n                    <path stroke="#000"\n                          stroke-width="30"\n                          stroke-dasharray="0,61"\n                          stroke-linecap="round"\n                          d="m46,46v189m61-6V40"/>\n                </svg>\n            </span>\n            <div class="slds-grid slds-col">\n                <slds-form-element  class="slds-col slds-p-horizontal_x-small drmapper_loadObjectRow_domainObjectApiName"\n                                    field="::vm.fieldMetadata[vm.ns + \'DomainObjectAPIName__c\']"\n                                    model="mapping[vm.ns + \'DomainObjectAPIName__c\']"\n                                    object-type="::vm.ns + \'DRMapItem__c\'"\n                                    ng-disabled="true"\n                                    object-id="vm.mappings[0].Id"\n                                    dnd-nodrag></slds-form-element>\n                <p style="padding-top: 1.8rem">.</p>\n                <slds-form-element  class="slds-col slds-p-horizontal_x-small drmapper_loadObjectRow_domainObjectFieldApiName"\n                                    field="::vm.fieldMetadata[vm.ns + \'DomainObjectFieldAPIName__c\']"\n                                    model="mapping[vm.ns + \'DomainObjectFieldAPIName__c\']"\n                                    object-type="::vm.ns + \'DRMapItem__c\'"\n                                    object-id="vm.mappings[0].Id"\n                                    dnd-nodrag\n                                    on-change="vm.onFieldChange(vm.ns + \'DomainObjectFieldAPIName__c\', mapping)"></slds-form-element>\n                <p style="padding-top: 1.8rem">=</p>\n                <slds-form-element  class="slds-col slds-p-horizontal_x-small drmapper_loadObjectRow_linkCreatedIndex"\n                                    field="::vm.fieldMetadata[vm.ns + \'LinkCreatedIndex__c\']"\n                                    model="mapping[vm.ns + \'LinkCreatedIndex__c\']"\n                                    object-type="::vm.ns + \'DRMapItem__c\'"\n                                    object-id="vm.mappings[0].Id"\n                                    dnd-nodrag\n                                    on-change="vm.onFieldChange(vm.ns + \'LinkCreatedIndex__c\', mapping)"></slds-form-element>\n                <p style="padding-top: 1.8rem">.</p>\n                <slds-form-element  class="slds-col slds-p-horizontal_x-small drmapper_loadObjectRow_linkCreatedField"\n                                    field="::vm.fieldMetadata[vm.ns + \'LinkCreatedField__c\']"\n                                    model="mapping[vm.ns + \'LinkCreatedField__c\']"\n                                    object-type="::vm.ns + \'DRMapItem__c\'"\n                                    object-id="vm.mappings[0].Id"\n                                    dnd-nodrag\n                                    on-change="vm.onFieldChange(vm.ns + \'LinkCreatedField__c\', mapping)"></slds-form-element>\n                <button class="slds-p-top_medium slds-button slds-button_icon drmapper_loadObjectRow_deleteLink"\n                    ng-if="!mapping.$$deleting"\n                    title="Delete"\n                    ng-click="vm.deleteLink(mapping, vm.order)">\n                    <slds-button-svg-icon sprite="\'utility\'" icon="\'delete\'"></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Delete</span>\n                </button>\n                <button class="slds-p-top_medium slds-button slds-button_icon drmapper_loadObjectRow_savingLink"\n                        ng-if="mapping.$$deleting"\n                        title="Saving"\n                        disabled="disabled" >\n                    <slds-button-svg-icon sprite="\'utility\'" icon="\'spinner\'"></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Saving</span>\n                </button>\n            </div>\n        </div>\n        <div class="slds-col slds-grid slds-grid_pull-padded-x-small">\n            <span class="slds-icon_container slds-p-top_large"\n                    title="move"\n                    style="margin-left: -1em;"\n                    ng-class="{\'slds-hidden\': vm.mappings.length > 0}"\n                    dnd-handle>\n                <svg class="slds-icon slds-icon_small"\n                        xmlns="http://www.w3.org/2000/svg"\n                        preserveAspectRatio="xMidYMid meet"\n                        viewBox="0 0 154 275"\n                        aria-hidden="true">\n                    <path stroke="#000"\n                            stroke-width="30"\n                            stroke-dasharray="0,61"\n                            stroke-linecap="round"\n                            d="m46,46v189m61-6V40"/>\n                </svg>\n            </span>\n            <div class="slds-col slds-text-align_center" dnd-nodrag>\n                <button class="slds-button slds-button--neutral drmapper_loadObjectRow_addLink"\n                        ng-click="vm.addLinkMapping()"\n                        ng-hide="vm.order === 1">\n                    + Add Link\n                </button>\n            </div>\n        </div>\n    </div>\n</li>\n'),$templateCache.put("load/loadObjectTab.tpl.html",'<div\n     class="slds-col slds-grid slds-grid_vertical-stretch slds-wrap drmapper--extract-object drmapper_loadObjectTab slds-is-relative">\n    <div class="slds-align_absolute-center"\n         ng-if="!vm.sObjects"\n         id="drmapper-loading-spinner">\n        <div class="slds-spinner--brand slds-spinner slds-spinner--medium"\n             role="alert">\n            <span class="slds-assistive-text">Saving</span>\n            <div class="slds-spinner__dot-a"></div>\n            <div class="slds-spinner__dot-b"></div>\n        </div>\n        <p class="slds-m-top_xx-large slds-p-top_large slds-text-heading_small">Loading all SObjects in org - this may\n            take a few seconds on large orgs...</p>\n    </div>\n    <div class="slds-scrollable_y slds-p-around_small slds-col"\n         ng-if="vm.sObjects">\n        <ul class="slds-grid slds-grid_vertical drop-zone drmapper_loadObjectTab_grid"\n            dnd-list\n            dnd-relative-to-parent="true"\n            dnd-drop="vm.onDrop(event, index, item)">\n            <load-object-row ng-repeat="object in vm.loadObjectMappings"\n                             object="object"\n                             bundle="::bundle"\n                             order="$index + 1"\n                             id="drmapper_loadObjectTab_grid-row{{$index + 1}}"\n                             on-mapping-added="vm.onMappingAdded(mapping)"\n                             on-mapping-deleted="vm.onMappingDeleted(mapping, $index)"\n                             on-object-name-change="vm.onObjectNameChange()"></load-object-row>\n        </ul>\n        <div class="slds-text-align_center slds-m-around_small">\n            <button class="slds-button slds-button--neutral"\n                    ng-click="vm.addNewObject()"\n                    id="drmapper_loadObjectTab_addObject">+ Add Object</button>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("load/loadFieldRow.tpl.html",'<li class="via-slds-extract-bundle-field drmapper_loadFieldRow" \n    ng-attr-data-dr-mapping-map-id="{{vm.mapping[vm.mapIdKey]}}"\n    ng-class="{\'via-slds-mapping \': !vm.editing, \n                \'slds-theme_shade drmapper-is-disabled\': vm.isDisabled, \n                \'slds-has-error\':  !vm.editing && !vm.mapping[vm.jsonOutputPathKey]}">\n    <div class="slds-grid slds-p-top_small slds-p-bottom_small slds-p-horizontal_medium" ng-if="!vm.editing" ng-click="vm.editRow(false)">\n        <div class="slds-size_5-of-12 slds-truncate slds-p-right_small" ng-bind="vm.mapping[vm.parentController.extractJsonPathKey]"></div>\n        <div class="slds-size_5-of-12 slds-truncate slds-p-right_small" \n            ng-if="vm.scopedToObject" \n            ng-bind="vm.mapping[vm.parentController.jsonOutputPathKey]"></div> \n        <div class="slds-size_5-of-12 slds-truncate slds-p-right_small" \n            ng-if="!vm.scopedToObject">\n            {{vm.mapping[vm.creationOrderKey]}} - \n            {{vm.mapping[vm.apiNameKey]}}.{{vm.mapping[vm.parentController.jsonOutputPathKey]}}</div> \n        <div class="slds-size_1-of-12 slds-text-align_right">\n            <span class="slds-icon_container" ng-if="vm.isLinked()">\n                <slds-svg-icon sprite="\'utility\'" icon="\'link\'" size="\'x-small\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n            </span>\n            <span class="slds-icon_container" ng-if="vm.isLookup">\n                <slds-svg-icon sprite="\'utility\'" icon="\'search\'" size="\'x-small\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n            </span>\n            <span class="slds-icon_container" ng-if="vm.isUpsert()">\n                <slds-svg-icon sprite="\'utility\'" icon="\'merge\'" size="\'x-small\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n            </span>\n        </div>\n        <div class="slds-size_1-of-12 slds-text-align_right">\n            <button class="slds-button slds-button_icon drmapper_loadFieldRow_edit" ng-click="vm.editRow(true)"\n                    title="Edit">\n            <slds-button-svg-icon sprite="\'utility\'" \n                                  icon="\'edit\'" ></slds-button-svg-icon>\n            <span class="slds-assistive-text">Edit</span>\n        </button>\n            <button class="slds-button slds-button_icon slds-col_bump-left drmapper_loadFieldRow_delete" title="Delete" ng-click="vm.deleteMapping($event)" ng-if="!vm.deleting && !vm.mapping.$$saving">\n            <slds-button-svg-icon sprite="\'action\'" \n                                  icon="\'delete\'" ></slds-button-svg-icon>\n            <span class="slds-assistive-text">Delete</span>\n        </button>\n            <button class="slds-button slds-button_icon slds-col_bump-left drmapper_loadFieldRow_deleting" title="Deleting" disabled="disabled" ng-if="vm.deleting || vm.mapping.$$saving">\n            <slds-button-svg-icon sprite="\'utility\'" \n                                  icon="\'spinner\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Deleting</span>\n        </button>\n        </div>\n    </div>\n    <div class="slds-grid slds-grid_vertical-align-start slds-p-top_small slds-p-bottom_small slds-p-horizontal_medium" ng-if="vm.editing">\n        <div class="slds-size_11-of-12 slds-p-right_small slds-p-left_x-small slds-grid slds-wrap">\n            <slds-form-element class="slds-size_1-of-1 slds-m-bottom_small drmapper_loadFieldRow_extractJsonPathKey"\n                               field="vm.parentController.fieldMetadata[vm.parentController.extractJsonPathKey]"\n                               model="vm.mapping[vm.parentController.extractJsonPathKey]" object-type="::vm.objectType" \n                               object-id="vm.mapping.Id" \n                               ng-if="!vm.isLinked()"\n                               on-change="vm.onFieldChange(vm.parentController.extractJsonPathKey)"></slds-form-element>\n\n            <slds-form-element class="slds-size_1-of-2 slds-m-bottom_small slds-p-right_small drmapper_loadFieldRow_creationOrderKey" \n                               field="::vm.fieldMetadata[vm.creationOrderKey]"\n                               model="vm.mapping[vm.creationOrderKey]" \n                               object-type="::vm.objectType" \n                               object-id="vm.mapping.Id" \n                               ng-if="!vm.scopedToObject"\n                               on-change="vm.handleCreationOrderKeyChange()"></slds-form-element>\n\n            <slds-form-element class="slds-size_1-of-2 slds-m-bottom_small drmapper_loadFieldRow_jsonOutputPathKey" \n                                field="vm.fieldMetadata[vm.jsonOutputPathKey]"\n                                model="vm.mapping[vm.jsonOutputPathKey]" \n                                object-type="::vm.objectType" \n                                object-id="vm.mapping.Id" \n                                ng-if="!vm.scopedToObject"\n                                on-change="vm.onFieldChange(vm.jsonOutputPathKey)"></slds-form-element>\n            \n            <slds-form-element class="slds-size_1-of-1 slds-m-bottom_small drmapper_loadFieldRow_jsonOutputPathKey" \n                                field="vm.fieldMetadata[vm.jsonOutputPathKey]"\n                                model="vm.mapping[vm.jsonOutputPathKey]" \n                                object-type="::vm.objectType" \n                                object-id="vm.mapping.Id" \n                                ng-if="vm.scopedToObject"\n                                on-change="vm.onFieldChange(vm.jsonOutputPathKey)"></slds-form-element>\n\n            <slds-form-element  class="slds-size_1-of-2 slds-m-bottom_small slds-p-right_small drmapper_loadFieldRow_linkedCreatedIndexKey" \n                                field="::vm.parentController.fieldMetadata[vm.linkedCreatedIndexKey]" \n                                model="vm.mapping[vm.linkedCreatedIndexKey]" \n                                object-type="::vm.objectType" \n                                object-id="vm.mapping.Id" \n                                ng-if="vm.isLinked()"\n                                on-change="vm.onFieldChange(vm.linkedCreatedIndexKey)"></slds-form-element>\n            \n            <slds-form-element  class="slds-size_1-of-2 slds-m-bottom_small drmapper_loadFieldRow_linkedCreatedFieldKey" \n                                field="::vm.fieldMetadata[vm.linkedCreatedFieldKey]" \n                                model="vm.mapping[vm.linkedCreatedFieldKey]" \n                                object-type="::vm.objectType" \n                                object-id="vm.mapping.Id" \n                                ng-if="vm.isLinked()"\n                                on-change="vm.onFieldChange(vm.linkedCreatedFieldKey)"></slds-form-element>\n\n            <div class="slds-size_1-of-1 slds-grid slds-wrap slds-grid_pull-padded slds-m-bottom_small">\n                <slds-form-element class="slds-size_1-of-2 slds-p-horizontal_small slds-m-bottom_small drmapper_loadFieldRow_fieldValueType" \n                                    field="vm.parentController.fieldMetadata[vm.fieldValueType]"\n                                    model="vm.mapping[vm.fieldValueType]" \n                                    object-type="::vm.objectType" \n                                    object-id="vm.mapping.Id" \n                                    on-change="vm.onFieldChange(vm.fieldValueType)"></slds-form-element>\n                <slds-form-element class="slds-size_1-of-2 slds-p-horizontal_small slds-m-bottom_small drmapper_loadFieldRow_defaultValueKey" \n                                    field="vm.parentController.fieldMetadata[vm.defaultValueKey]"\n                                    model="vm.mapping[vm.defaultValueKey]" \n                                    object-type="::vm.objectType" \n                                    object-id="vm.mapping.Id" \n                                    on-change="vm.onFieldChange(vm.defaultValueKey)"></slds-form-element>\n                <slds-form-element class="slds-size_1-of-4 slds-p-horizontal_small slds-m-bottom_small drmapper_loadFieldRow_isDisabledKey" \n                                    field="vm.parentController.fieldMetadata[vm.isDisabledKey]"\n                                    model="vm.mapping[vm.isDisabledKey]" \n                                    object-type="::vm.objectType" \n                                    object-id="vm.mapping.Id" \n                                    on-change="vm.onFieldChange(vm.isDisabledKey)"></slds-form-element>\n                <slds-form-element class="slds-size_1-of-4 slds-p-horizontal_small slds-m-bottom_small drmapper_loadFieldRow_upsertKey" \n                                    field="vm.parentController.fieldMetadata[vm.upsertKey]"\n                                    model="vm.mapping[vm.upsertKey]" \n                                    object-type="::vm.objectType" \n                                    object-id="vm.mapping.Id" \n                                    on-change="vm.onFieldChange(vm.upsertKey)"></slds-form-element>\n                <slds-form-element class="slds-size_1-of-4 slds-p-horizontal_small slds-m-bottom_small drmapper_loadFieldRow_requiredForUpsertKey" \n                                    field="vm.parentController.fieldMetadata[vm.requiredForUpsertKey]"\n                                    model="vm.mapping[vm.requiredForUpsertKey]" \n                                    object-type="::vm.objectType" \n                                    object-id="vm.mapping.Id" \n                                    on-change="vm.onFieldChange(vm.requiredForUpsertKey)"></slds-form-element>\n                <div class="slds-size_1-of-4 slds-p-horizontal_small slds-m-bottom_small slds-form-element"\n                     ng-if="!vm.isLinked()">\n                    <div class="slds-form-element__control">\n                        <span class="slds-checkbox">\n                        <input type="checkbox" \n                                ng-model="vm.isLookup" \n                                id="drmapper_loadFieldRow_isLookup"\n                                ng-change="vm.handleLookupChange()"/>\n                        <label class="slds-checkbox__label" for="drmapper_loadFieldRow_isLookup">\n                            <span class="slds-checkbox_faux"></span>\n                            <span class="slds-form-element__label">{{::$root.vlocity.getCustomLabel(\'IsLookup\', \'Is Lookup\')}}</span>\n                        </label>\n                        </span>\n                    </div>\n                </div>\n                <div class="slds-size_1-of-4 slds-p-horizontal_small slds-m-bottom_small slds-form-element"\n                     ng-if="vm.isLinked()">\n                    <div class="slds-form-element__control">\n                        <span class="slds-checkbox">\n                        <input type="checkbox" \n                                checked="true" \n                                id="drmapper_loadFieldRow_isLinked"\n                                disabled="disabled"/>\n                        <label class="slds-checkbox__label" for="drmapper_loadFieldRow_isLinked">\n                            <span class="slds-checkbox_faux"></span>\n                            <span class="slds-form-element__label">{{::$root.vlocity.getCustomLabel(\'IsLinked\', \'Is Linked\')}}</span>\n                        </label>\n                        </span>\n                    </div>\n                </div>\n            </div>\n            <div class="slds-size_1-of-1 slds-grid slds-wrap slds-grid_pull-padded slds-m-bottom_small" ng-if="vm.isLookup === true">   \n                <slds-form-element class="slds-size_1-of-2 slds-p-horizontal_small slds-m-bottom_small drmapper_loadFieldRow_lookupDomainObjectNameKey" \n                        field="vm.fieldMetadata[vm.lookupDomainObjectNameKey]"\n                        model="vm.mapping[vm.lookupDomainObjectNameKey]" \n                        object-type="::vm.objectType" \n                        object-id="vm.mapping.Id" \n                        on-change="vm.onFieldChange(vm.lookupDomainObjectNameKey)"></slds-form-element>\n                <slds-form-element class="slds-size_1-of-2 slds-p-horizontal_small slds-m-bottom_small drmapper_loadFieldRow_lookupDomainObjectFieldNameKey" \n                        field="vm.fieldMetadata[vm.lookupDomainObjectFieldNameKey]"\n                        model="vm.mapping[vm.lookupDomainObjectFieldNameKey]" \n                        object-type="::vm.objectType" \n                        object-id="vm.mapping.Id" \n                        on-change="vm.onFieldChange(vm.lookupDomainObjectFieldNameKey)"></slds-form-element>\n                <slds-form-element class="slds-size_1-of-1 slds-p-horizontal_small slds-m-bottom_small drmapper_loadFieldRow_lookupDomainObjectRequestedFieldNameKey" \n                        field="vm.fieldMetadata[vm.lookupDomainObjectRequestedFieldNameKey]"\n                        model="vm.mapping[vm.lookupDomainObjectRequestedFieldNameKey]" \n                        object-type="::vm.objectType" \n                        object-id="vm.mapping.Id" \n                        on-change="vm.onFieldChange(vm.lookupDomainObjectRequestedFieldNameKey)"></slds-form-element>\n            </div>\n            <transform-map-values class="slds-size_1-of-1 slds-m-bottom_small drmapper_loadFieldRow_transformMapValues" \n                                  mapping="vm.mapping" \n                                  on-change="vm.onFieldChange(vm.transformValuesMapKey)"></transform-map-values>\n        </div>\n        <div class="slds-size_1-of-12 slds-text-align_right">\n            <button class="slds-button slds-button_icon drmapper_loadFieldRow_collapse" ng-click="vm.editing = false"\n                    title="Collapse">\n                <slds-button-svg-icon sprite="\'utility\'" \n                                  icon="\'contract_alt\'" ></slds-button-svg-icon>\n                <span class="slds-assistive-text">Collapse</span>\n            </button>\n            <button class="slds-button slds-button_icon slds-col_bump-left drmapper_loadFieldRow_delete" title="Delete" ng-click="vm.deleteMapping($event)" ng-if="!vm.mapping.$$deleting && !vm.mapping.$$saving">\n                <slds-button-svg-icon sprite="\'action\'" \n                                    icon="\'delete\'" ></slds-button-svg-icon>\n                <span class="slds-assistive-text">Delete</span>\n            </button>\n            <button class="slds-button slds-button_icon slds-col_bump-left drmapper_loadFieldRow_deleting" title="Deleting" disabled="disabled" ng-if="vm.mapping.$$deleting || vm.mapping.$$saving">\n                <slds-button-svg-icon sprite="\'utility\'" \n                                    icon="\'spinner\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Deleting</span>\n            </button>\n        </div>\n    </div>\n</li>'),$templateCache.put("fieldBundleTable.tpl.html",'<div style="position:relative; z-index: 0" class="drmapper_fieldBundleTable">\n    <ul class="slds-grid slds-grid_vertical drmapper-field-bundle-table" \n        style="padding: 0; padding-top: 1px;">\n        <li class="drmapper--header-row slds-p-top_small slds-p-bottom_x-small slds-p-horizontal_medium slds-border_bottom drmapper_fieldBundleTable_headerRow">\n            <div class="slds-grid"> \n                <div class="slds-size_5-of-12 slds-text-title--caps">\n                    {{vm.inputLabel}}\n                    <input type="text" ng-model="vm.filter[vm.extractJsonPathKey]" placeholder="" required="required" id="drmapper_fieldBundleTable_extractJsonPathKeySearch" />\n                </div>\n                <div class="slds-text-title--caps" ng-class="{\'slds-size_6-of-12\': !vm.isLoad(), \'slds-size_5-of-12\': vm.isLoad()}">\n                    {{vm.outputLabel}}\n                    <input type="text" ng-model="vm.filter[vm.jsonOutputPathKey]" placeholder="" required="required" id="drmapper_fieldBundleTable_jsonOutputPathKeySearch"/>\n                </div>\n                <div class="slds-size_1-of-12 slds-text-align_right" ng-if="vm.isLoad()"></div>\n                <div class="slds-size_1-of-12 slds-text-align_right">\n                    <button class="slds-button slds-button_icon" style="vertical-align: top"\n                            id="drmapper_fieldBundleTable_addNewMapping"\n                            ng-click="vm.addMapping()"\n                            ng-disabled="vm.disableAddMappingBtn()"\n                            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'DRMapperNewMapping\', \'Add New Mapping\')}}">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'new\'"></slds-button-svg-icon>\n                    </button>\n                </div>\n            </div>\n        </li>\n        <load-field-row  bundle="vm.bundle" \n                            ng-if="::vm.isLoad()"\n                            mapping="mapping"\n                            scoped-to-object="{{vm.scopedToObject}}"                            \n                            on-deleted-mapping="vm.onDeletedMapping(mapping, $index)"\n                            on-field-mapping-change="vm.refireHandleFieldMappingChange(mapping, $index)"\n                            ng-repeat="mapping in vm.fieldMappings | MappingFilter:vm.filter:vm.extractJsonPathKey:vm.jsonOutputPathKey:!!vm.scopedToObject" \n                            id="drmapper_fieldBundleTable_mapping-{{$index}}"\n                            load-object-mappings="vm.loadObjectMappings"\n                            class="slds-border_top"></load-field-row>\n        <extract-field-row bundle="vm.bundle"\n                           ng-repeat="mapping in vm.fieldMappings | MappingFilter:vm.filter:vm.extractJsonPathKey:vm.jsonOutputPathKey"   \n                                ng-if="::(!vm.isLoad())" \n                                mapping="mapping"\n                                on-deleted-mapping="vm.onDeletedMapping(mapping, $index)"\n                                on-field-mapping-change="vm.refireHandleFieldMappingChange(mapping, $index)"\n                                id="drmapper_fieldBundleTable_mapping-{{$index}}"\n                                class="slds-border_bottom" ></extract-field-row>\n    </ul>\n</div>'),$templateCache.put("drEditor.tpl.html",'<div class="slds-form-element slds-shrink slds-col slds-grid slds-grid_vertical-stretch slds-grid_vertical drmapper_drEditor" ng-class="{\'slds-has-error\': vm.ngModelCtrl.$invalid}">\n    <div class="slds-form-element__control slds-shrink slds-col slds-grid slds-grid_vertical-stretch" style="position:relative">\n        <div class="slds-col slds-shrink slds-textarea"\n             style="position:absolute;top:0;right:0;left:0;bottom:0;padding:0"></div>\n    </div>\n    <div ng-messages="vm.ngModelCtrl.$error" role="alert">\n        <div ng-message="required" class="slds-form-element__help">Please enter a value for this field.</div>\n        <div ng-message="validJson" class="slds-form-element__help">\n            {{::$root.vlocity.getCustomLabel(\'DesInvalidJson\', \'Invalid JSON\')}}\n        </div>\n        <div ng-message="validXml" class="slds-form-element__help">\n'+"            {{::$root.vlocity.getCustomLabel('DesInvalidXml', 'Invalid XML')}}\n        </div>\n    </div>\n</div>\n"),$templateCache.put("quickEditModal.tpl.html",'<div role="dialog" \n     tabindex="-1" \n     class="slds-modal slds-fade-in-open slds-modal--large">\n    <auto-match-field bundle="vm.bundle" \n                        on-save="vm.modal.hide()"\n                        on-cancel="vm.modal.hide()"></auto-match-field>\n</div>'),$templateCache.put("formula/formulaMapping.tpl.html",'<li class="slds-box slds-grid slds-grid_vertical slds-m-bottom_small drmapper_formulaMapping"\n    dnd-draggable="vm.mapping" \n    dnd-effect-allowed="move" \n    ng-form>\n    <div class="slds-grid slds-grid_vertical">\n        <div class="slds-col slds-grid slds-grid_pull-padded-x-small">\n            <div class="slds-grid slds-grid_vertical">\n                <div class="slds-section__title" >\n                    {{vm.mapping[vm.formulaOrderKey]}}\n                </div>\n                <span class="slds-icon_container slds-p-top_large" \n                    title="move" \n                    style="margin-left: -1em;" \n                    dnd-handle>\n                    <svg class="slds-icon slds-icon_small" \n                        xmlns="http://www.w3.org/2000/svg"\n                        preserveAspectRatio="xMidYMid meet"\n                        viewBox="0 0 154 275"\n                        aria-hidden="true">\n                        <path stroke="#000" \n                            stroke-width="30" \n                            stroke-dasharray="0,61"\n                            stroke-linecap="round" \n                            d="m46,46v189m61-6V40"/>\n                    </svg>\n                </span>\n            </div>\n            <div class="slds-size_1-of-2 slds-p-horizontal_x-small slds-grid slds-grid_vertical slds-grid_vertical-stretch">\n                <label class="slds-form-element__label">Formula</label>\n                <div class="slds-form-element__control slds-col slds-grid slds-grid_vertical slds-grid_vertical-stretch">\n                    <monaco-editor class="slds-col slds-textarea drmapper_formulaMapping_formula"\n                                     style="max-width: 100%; min-height:7rem; max-height:7rem; padding: 0;"\n                                     dnd-nodrag \n                                     language="vlocity-formula" \n                                     ng-change="vm.onFieldChange()"\n                                     ng-model="vm.mapping[vm.formulaKey]"></monaco-editor>\n                </div>\n            </div>\n            <div class="slds-size_1-of-2 slds-p-horizontal_x-small slds-grid slds-grid_vertical" dnd-nodrag \n                  style="flex-shrink: 1">\n                <slds-form-element class="drmapper_formulaMapping_resultPathKey"\n                               field="::vm.fieldMetadata[vm.resultPathKey]" \n                               model="vm.mapping[vm.resultPathKey]" \n                               object-type="::vm.ns + \'DRMapItem__c\'" \n                               object-id="vm.mapping.Id" \n                               on-change="vm.onFieldChange()"></slds-form-element>\n                <slds-form-element class="drmapper_formulaMapping_isDisabled"\n                               field="::vm.fieldMetadata[vm.ns + \'IsDisabled__c\']" \n                               model="vm.mapping[vm.ns + \'IsDisabled__c\']" \n                               object-type="::vm.ns + \'DRMapItem__c\'" \n                               object-id="vm.mapping.Id" \n                               on-change="vm.onFieldChange()"></slds-form-element>\n            </div>\n            <div class="slds-grid slds-grid_vertical slds-col_bump-left slds-p-top_xx-small">\n                <button class="slds-button slds-button_icon drmapper_formulaMapping_delete" \n                    title="Delete" \n                    ng-click="vm.deleteMapping()" \n                    ng-if="!vm.deleting">\n                    <slds-button-svg-icon sprite="\'action\'" \n                                        icon="\'delete\'" ></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Delete</span>\n                </button>\n                <button class="slds-button slds-button_icon drmapper_formulaMapping_deleting" \n                        title="Deleting" \n                        disabled="disabled"\n                        ng-if="vm.deleting || vm.saving">\n                    <slds-button-svg-icon sprite="\'utility\'" \n                                        icon="\'spinner\'"></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Deleting</span>\n                </button>\n            </div>\n        </div>\n    </div>\n</li>'),$templateCache.put("formula/formulaTab.tpl.html",'<div class="slds-col slds-grid slds-grid_vertical-stretch drmapper--formulas drmapper_formulaTab">\n    <div class="slds-scrollable_y slds-p-around_small"\n        ng-class="{\'slds-size_1-of-1 slds-large-size_3-of-4\': vm.sidebarOpen && vm.isExtractMappingBundle, \'slds-col\': !vm.sidebarOpen || !vm.isExtractMappingBundle}">\n        <ul class="slds-grid slds-grid_vertical drop-zone drmapper_formulaTab_grid" \n            dnd-list\n            dnd-relative-to-parent="true"\n            dnd-drop="vm.onDrop(event, index, item)">\n            <formula-mapping ng-repeat="mapping in vm.formulaMappings" \n                            mapping="mapping" \n                            on-mapping-deleted="vm.onFormulaDeleted(mapping, $index)"\n                            bundle="::bundle"\n                            id="drmapper_formulaTab_row-{{$index}}"></formula-mapping>\n        </ul>\n        <div class="slds-text-align_center slds-m-around_small">\n            <button class="slds-button slds-button--neutral" ng-click="vm.addFormula()"\n                    id="drmapper_formulaTab_addFormula">+ Add Formula</button>\n        </div>\n    </div>\n    <div class="slds-panel slds-grid slds-grid_vertical slds-nowrap slds-panel_filters via-slds-sidebar"\n    ng-class="{\'via-slds-sidebar--closed\': !vm.sidebarOpen}" ng-if="vm.isExtractMappingBundle" >\n        <div class="slds-form_stacked slds-grow slds-col slds-grid slds-grid_vertical">\n            <div class="slds-filters slds-col slds-grid slds-grid_vertical slds-grid_vertical-stretch">\n                <div class="slds-filters__header slds-grid slds-has-divider_bottom-space">\n                    <h4 class="slds-align-middle slds-text-heading_small" ng-show="vm.sidebarOpen">{{::$root.vlocity.getCustomLabel(\'DRMapperExtractionStepJSON\', \'Extraction Step JSON\')}}</h4>\n                    <button class="slds-button slds-col_bump-left slds-button_icon slds-button_icon-small drmapper_formulaTab_toggleFilterPanel" \n                            title="Close Filter Panel"\n                            ng-click="vm.sidebarOpen = !vm.sidebarOpen">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'forward\'" ng-if="vm.sidebarOpen"></slds-button-svg-icon>\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'back\'" ng-if="!vm.sidebarOpen"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Close Filter Panel</span>\n                    </button>\n                </div>\n                <div class="slds-filters__body slds-col slds-grid slds-grid_vertical slds-grid_vertical-stretch" ng-show="vm.sidebarOpen">\n                    <div class="slds-form-element">\n                        <div class="slds-form-element__control">\n                            <span class="slds-checkbox">\n                                <input type="checkbox" \n                                        name="options" \n                                        id="drmapper_formulaTab_showAllExtractJsonFields" \n                                        ng-model="vm.showAllExtractJsonFields" />\n                                <label class="slds-checkbox__label" for="drmapper_formulaTab_showAllExtractJsonFields">\n                                    <span class="slds-checkbox--faux"></span>\n                                    <span class="slds-form-element__label">{{::$root.vlocity.getCustomLabel(\'DRMapperShowSObjectFields\', \'Show all sObject Fields\')}}</span>\n                                </label>\n                            </span>\n                        </div>\n                    </div>\n                    <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" \n                        readonly="readonly"\n                        id="drmapper_formulaTab_extractionStepJson"\n                        ng-model="vm.extractionStepJson"></dr-editor>\n                    <dr-editor  class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                        id="drmapper_formulaTab_inputJson"\n                        ng-if="vm.isBundleInputTypeJson()"\n                        ng-change="vm.inputChanged()"\n                        ng-model-options="{\'allowInvalid\': true}"\n                        placeholder="{{::$root.vlocity.getCustomLabel(\'InputXML\', \'Input XML\')}}"  \n                        ng-model="vm.bundle[vm.ns + \'InputJson__c\']"></dr-editor>\n                    <dr-editor  class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small"\n                        id="drmapper_formulaTab_inputXml"\n                        ng-change="vm.inputChanged()"\n                        language="xml"\n                        ng-model-options="{\'allowInvalid\': true}"\n                        ng-if="vm.isBundleInputTypeXml()"\n                        placeholder="{{::$root.vlocity.getCustomLabel(\'InputJSON\', \'Input JSON\')}}"\n                        ng-model="vm.bundle[vm.ns + \'InputXml__c\']"></dr-editor>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>'),$templateCache.put("clonePrompt.tpl.html",'<div aria-hidden="false" role="dialog" class="slds-modal slds-modal--prompt slds-fade-in-open drmapper_clonePrompt">\n    <div class="slds-modal__container slds-modal--prompt">\n      <div class="slds-modal__header">\n        <h2 class="slds-text-heading_medium" ng-bind="title"></h2>\n      </div>\n      <div class="slds-modal__content slds-p-around_medium">\n        <div class="slds-form_stacked" ng-form="clonePrompt" name="clonePrompt">\n            <div class="slds-form-element" ng-class="{\'slds-has-error\': clonePrompt.$invalid}">\n              <label class="slds-form-element__label">Please enter a new name for the cloned interface</label>\n              <div class="slds-form-element__control">\n                <input type="text" ng-model="newName" class="slds-input" pattern="^[a-zA-Z0-9_\\-\\s]*$" required="required" id="drmapper_clonePrompt_newName"/>\n              </div>\n              <div id="drmapper_clonePrompt_error" ng-if="clonePrompt.$invalid" class="slds-form-element__help">This interface name can only contain letters, numbers and spaces.</div>              \n            </div>\n        </div>\n      </div>\n      <div class="slds-modal__footer">\n        <button class="slds-button slds-button--neutral"\n            id="drmapper_clonePrompt_cancel"\n            ng-click="$hide()">{{::$root.vlocity.getCustomLabel(\'Cancel\', \'Cancel\')}}</button>\n        <button class="slds-button slds-button--brand"\n                ng-disabled="clonePrompt.$invalid"\n                id="drmapper_clonePrompt_save"\n                ng-click="$createClone(newName)">{{::$root.vlocity.getCustomLabel(\'Save\', \'Save\')}}</button>\n      </div>\n    </div>\n</div>'),$templateCache.put("transform/transformTabs.tpl.html",'<div class="slds-tabs--default slds-col slds-grid slds-grid_vertical slds-grid_vertical-stretch drmapper_transformTabs"\n     style="overflow: hidden">\n    <ul class="slds-tabs--default__nav"\n        role="tablist"\n        style="flex-shrink: 0;">\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'Formulas\', \'Formulas\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 0}">\n            <a class="slds-tabs--default__link"\n               role="tab"\n               tabindex="0"\n               aria-selected="true"\n               aria-controls="tab-default-1"\n               ng-click="vm.activeTab = 0"\n               id="tab-default-1__item">{{::$root.vlocity.getCustomLabel(\'Formulas\', \'Formulas\')}}</a>\n        </li>\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'DRMapperTransforms\', \'Transforms\')}}"\n            role="presentation"\n            ng-click="vm.activeTab = 1">\n            <a class="slds-tabs--default__link"\n               role="tab"\n               tabindex="-1"\n               aria-selected="false"\n               aria-controls="tab-default-2"\n               ng-class="{\'slds-active\': vm.activeTab == 1}"\n               id="tab-default-2__item">{{::$root.vlocity.getCustomLabel(\'DRMapperTransforms\', \'Transforms\')}}</a>\n        </li>\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'Options\', \'Options\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 2}">\n            <a class="slds-tabs--default__link"\n               role="tab"\n               tabindex="-1"\n               aria-selected="false"\n               aria-controls="tab-default-3"\n               ng-click="vm.activeTab = 2"\n               id="tab-default-3__item">{{::$root.vlocity.getCustomLabel(\'Options\', \'Options\')}}</a>\n        </li>\n        <li class="slds-tabs--default__item slds-text-title--caps"\n            ng-attr-title="{{::$root.vlocity.getCustomLabel(\'Preview\', \'Preview\')}}"\n            role="presentation"\n            ng-class="{\'slds-active\': vm.activeTab == 3}">\n            <a class="slds-tabs--default__link"\n               role="tab"\n               tabindex="-1"\n               aria-selected="false"\n               aria-controls="tab-default-4"\n               ng-click="vm.activeTab = 3"\n               id="tab-default-4__item">{{::$root.vlocity.getCustomLabel(\'Preview\', \'Preview\')}}</a>\n        </li>\n    </ul>\n    <div id="tab-default-1"\n         class="slds-col slds-grid slds-grid_vertical-stretch"\n         role="tabpanel"\n         aria-labelledby="tab-default-1__item"\n         ng-show="vm.activeTab == 0"\n         style="overflow: hidden">\n         <formula-tab bundle="vm.bundle"\n                        class="slds-col slds-grid slds-grid_vertical-stretch"></formula-tab>\n        </div>\n    <div id="tab-default-2"\n         class="slds-col slds-grid slds-grid_vertical-stretch"\n         role="tabpanel"\n         aria-labelledby="tab-default-2__item"\n         ng-if="vm.activeTab == 1"\n         style="overflow: hidden" >\n         <transform-mapping-tab bundle="vm.bundle"\n                                class="slds-col slds-grid slds-grid_vertical-stretch"></transform-mapping-tab>\n    </div>\n    <div id="tab-default-3"\n         class="slds-col slsd-grid slds-grid_vertical-stretch"\n         role="tabpanel"\n         ng-show="vm.activeTab == 2"\n         style="overflow: hidden">\n         <extract-options-tab bundle="vm.bundle"\n                              class="slds-col slds-grid slds-grid_vertical-align-start slds-wrap slds-p-around_small"></extract-options-tab>\n    </div>\n    <div id="tab-default-4"\n         class="slds-col slds-grid slds-grid_vertical-stretch"\n         role="tabpanel"\n         aria-labelledby="tab-default-4__item"\n         ng-show="vm.activeTab == 3"\n         style="overflow: hidden" >\n        <preview-load-transform drurl="/services/apexrest/{{nsForUrl}}v2/DataRaptor/"\n            bundle-name="{{vm.bundle.Name}}"\n            bundle="vm.bundle"\n            is-visible="vm.activeTab == 3"\n            initial-json="vm.bundle[vm.ns + \'SampleInputJSON__c\']"\n            initial-rows="vm.bundle[vm.ns + \'SampleInputRows__c\']"\n            initial-xml="vm.bundle[vm.ns + \'SampleInputXML__c\']"\n            initial-custom="vm.bundle[vm.ns + \'SampleInputCustom__c\']"\n            reset-json="vm.bundle[vm.ns + \'InputJson__c\']"\n            reset-xml="vm.bundle[vm.ns + \'InputXml__c\']"\n            load-json="::vm.bundle[vm.ns + \'Type__c\'] == \'Load\'"\n            is-transform="::vm.bundle[vm.ns + \'Type__c\'] == \'Transform\'"\n            input-type="vm.bundle[vm.ns + \'InputType__c\']"\n            output-type="vm.bundle[vm.ns + \'OutputType__c\']"></preview-load-transform>\n    </div>\n</div>\n'),$templateCache.put("transform/transformMappingTab.tpl.html",'<div class="slds-col slds-grid slds-grid_vertical-stretch slds-nowrap drmapper_transformMappingTab">\n    <field-bundle-table id="drmapper_transformMappingTab_grid"\n                        class="slds-scrollable_y" \n                        ng-class="{\'slds-size_3-of-4\': vm.sidebarOpen, \'slds-col\': !vm.sidebarOpen}"\n                        bundle="vm.bundle" \n                        on-field-mapping-change="vm.handleFieldMappingChange()"></field-bundle-table>\n\n    <slds-accordian-side-bar title="Input &amp; Output" sidebar-open="vm.sidebarOpen">\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'InputJSON\', \'Input JSON\')}}"\n            ng-if="vm.isJsonInput()">\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" \n                ng-change="vm.inputChanged()"\n                required="required" \n                id="drmapper_transformMappingTab_inputJson"\n                placeholder="{{::$root.vlocity.getCustomLabel(\'InputJSON\', \'Input JSON\')}}"\n                ng-model-options="{\'allowInvalid\': true, updateOn:\'default change blur\',debounce:{default:2000,blur:0,change:0}}" \n                ng-model="vm.bundle[vm.ns + \'InputJson__c\']"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'InputXML\', \'Input XML\')}}"\n            ng-if="vm.isXmlInput()">\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" \n                ng-change="vm.inputChanged()" \n                language="xml"\n                required="required" \n                id="drmapper_transformMappingTab_inputXml"\n                ng-model-options="{\'allowInvalid\': true, updateOn:\'default change blur\',debounce:{default:2000,blur:0,change:0}}"\n                placeholder="{{::$root.vlocity.getCustomLabel(\'InputXML\', \'Input XML\')}}"\n                ng-model="vm.bundle[vm.ns + \'InputXml__c\']"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'InputCustom\', \'Input Custom\')}}"\n            ng-if="vm.isCustomInput()">\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" \n                ng-change="vm.inputChanged()" \n                language="text"\n                required="required" \n                id="drmapper_transformMappingTab_inputCustom"\n                ng-model-options="{\'allowInvalid\': true, updateOn:\'default change blur\',debounce:{default:2000,blur:0,change:0}}"\n                placeholder="{{::$root.vlocity.getCustomLabel(\'InputCustom\', \'Input Custom\')}}"\n                ng-model="vm.bundle[vm.ns + \'InputCustom__c\']"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperExpectedJSONOutput\', \'Expected JSON Output\')}}"\n            ng-if="vm.isJsonOutput()">\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" \n                    ng-change="vm.expectedOutputChanged()"\n                    id="drmapper_transformMappingTab_expectedJson"\n                    ng-model-options="{\'allowInvalid\': true, updateOn:\'default change blur\',debounce:{default:2000,blur:0,change:0}}"\n                    required="required"\n                    placeholder="{{::$root.vlocity.getCustomLabel(\'DRMapperExpectedJSONOutput\', \'Expected JSON Output\')}}"\n                    ng-model="vm.bundle[vm.bundleTargetOutJsonKey]"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperExpectedXMLOutput\', \'Expected XML Output\')}}"\n            ng-if="vm.isXmlOutput()">\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" \n                    language="xml"\n                    ng-change="vm.expectedOutputChanged()" \n                    id="drmapper_transformMappingTab_expectedXml"\n                    ng-model-options="{\'allowInvalid\': true, updateOn:\'default change blur\',debounce:{default:2000,blur:0,change:0}}"\n                    required="required" \n                    placeholder="{{::$root.vlocity.getCustomLabel(\'DRMapperExpectedXMLOutput\', \'Expected XML Output\')}}"\n                    ng-model="vm.bundle[vm.ns + \'TargetOutXml__c\']"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperExpectedCustomOutput\', \'Expected Custom Output\')}}"\n            ng-if="vm.isCustomOutput()">\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" \n                    language="text"\n                    ng-change="vm.expectedOutputChanged()" \n                    id="drmapper_transformMappingTab_expectedCustom"\n                    required="required" \n                    placeholder="{{::$root.vlocity.getCustomLabel(\'DRMapperExpectedCustomOutput\', \'Expected Custom Output\')}}"\n                    ng-model-options="{\'allowInvalid\': true, updateOn:\'default change blur\',debounce:{default:2000,blur:0,change:0}}"\n                    ng-model="vm.bundle[vm.ns + \'TargetOutCustom__c\']"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperCurrentJSONOutput\', \'Current JSON Output\')}}"\n            selected="true"\n            ng-if="vm.isJsonOutput()">\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" \n                        readonly="readonly"\n                        id="drmapper_transformMappingTab_jsonOutput"\n                        ng-model="vm.currentOutputData"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperCurrentXMLOutput\', \'Current XML Output\')}}"\n            selected="true"\n            ng-if="vm.isXmlOutput()">\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" \n                        readonly="readonly"\n                        language="xml" \n                        id="drmapper_transformMappingTab_xmlOutput"\n                        ng-model="vm.currentOutputData"></dr-editor>\n        </slds-accordian-side-bar-pane>\n        <slds-accordian-side-bar-pane title="{{::$root.vlocity.getCustomLabel(\'DRMapperCurrentOutput\', \'Current Output\')}}"\n            selected="true"\n            ng-if="!vm.isXmlOutput() && !vm.isJsonOutput()">\n            <dr-editor class="slds-col slds-grid slds-grid_vertical-stretch slds-p-bottom_small" \n                        readonly="readonly" \n                        language="properties" \n                        id="drmapper_transformMappingTab_output"\n                        ng-model="vm.currentOutputData"></dr-editor>\n        </slds-accordian-side-bar-pane>\n    </slds-accordian-side-bar>\n</div>'),$templateCache.put("transform/transformMapValues.tpl.html",'<div class="slds-grid slds-wrap drmapper_transformMapValues">\n    <fieldset class="slds-form--compound slds-size_1-of-2">\n        <legend class="slds-form-element__label slds-text-title--caps">{{::$root.vlocity.getCustomLabel(\'DRMapperShowTransformValuesMapFields\', \'Transform Map Values\')}}</legend>\n        <div class="slds-form-element__group">\n            <div class="slds-form-element__row"\n                 ng-repeat="pair in vm.transformMapValues">\n                <div class="slds-form-element slds-size_1-of-2">\n                    <label class="slds-form-element__label"\n                        ng-if="$first">{{::$root.vlocity.getCustomLabel(\'Key\', \'Key\')}}</label>\n                    <input type="text" \n                           ng-model="pair.key" \n                           ng-change="vm.onFieldChange()" \n                           class="slds-input drmapper_transformMapValues_key" />\n                </div>\n                <div class="slds-form-element slds-size_1-of-2">\n                    <label class="slds-form-element__label"\n                           ng-if="$first">{{::$root.vlocity.getCustomLabel(\'Value\', \'Value\')}}</label>\n                    <input type="text" \n                           ng-model="pair.value"\n                           ng-change="vm.onFieldChange()" \n                           class="slds-input drmapper_transformMapValues_value" />\n                </div>\n                <button class="slds-button slds-button_icon slds-m-left_small drmapper_transformMapValues_delete" \n                    ng-class="{\'slds-m-top_large\': $first}"\n                    title="Delete" \n                    ng-click="vm.deleteTransformMapValue(pair)">\n                    <slds-button-svg-icon sprite="\'action\'" \n                                          icon="\'delete\'" ></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Delete</span>\n                </button>\n            </div>\n            <div class="slds-form-element__row">\n                <div class="slds-form-element">\n                    <button class="slds-button drmapper_transformMapValues_addNewPair"\n                            ng-click="vm.addNewTransformMapValue()">{{::$root.vlocity.getCustomLabel(\'AddNewKeyValuePair\', \'Add new key/value pair\')}}</button>\n                </div>\n                <button class="slds-button slds-button_icon slds-m-left_small drmapper_transformMapValues_delete" \n                    title="Delete" style="visibility: hidden">\n                    <slds-button-svg-icon sprite="\'action\'" \n                                          icon="\'delete\'" ></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Delete</span>\n                </button>\n            </div>\n        </div>\n    </fieldset>\n</div>')}]);

},{}]},{},[1]);
})();

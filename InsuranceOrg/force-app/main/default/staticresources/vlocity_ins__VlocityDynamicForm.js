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
/**
 * Vlocity Dynamic form
 */

angular.module('VlocityDynamicForm',['vlocity', 'ngMessages', 'ui.mask', 'sldsangular']);

// Add this to vlocity.js
require('../node_modules/angular-ui-mask/dist/mask.min.js');

require('./modules/vlocitydynamicform/directives/VlocityDynamicForm.js');
require('./modules/vlocitydynamicform/templates/templates.js');

},{"../node_modules/angular-ui-mask/dist/mask.min.js":4,"./modules/vlocitydynamicform/directives/VlocityDynamicForm.js":2,"./modules/vlocitydynamicform/templates/templates.js":3}],2:[function(require,module,exports){
/**
* Vlocity Dynamic Form
* Dynamically build an HTML form using a JSON array/object and templates.
* @version v1.0.0
* Authors: jraju@vlocity.com;
*
* Credits: http://github.com/danhunsaker/angular-dynamic-forms
*/

/**
 * USAGE
 * @param {Object} ngModel - An object in the current scope where the form data should be read/stored.
 * @example <vlocity-dynamic-form template-url="form-template.js" ng-model="formData"></vlocity-dynamic-form>
 * @example <vlocity-dynamic-form template-url="form-template.js" ng-model="formData"><input type="submit" click="submitform()" /></vlocity-dynamic-form>
 *
*/

/* JSHINT globals */
/* globals _ */

angular.module('VlocityDynamicForm')
    .directive('vlocityDynamicForm', ['$templateCache', '$parse', '$http', '$compile', '$interpolate', '$document', '$timeout', '$locale', '$sldsPopover','$rootScope','ISO_CURRENCY_INFO',
                                      function ($templateCache, $parse, $http, $compile, $interpolate, $document, $timeout, $locale, $sldsPopover,$rootScope,ISO_CURRENCY_INFO) {
    'use strict';
    var supported = {
        //  Text-based elements
        'text': {element: 'input', type: 'text', editable: true, textBased: true},
        'email': {element: 'input', type: 'email', editable: true, textBased: true},
        'number': {element: 'input', type: 'number', editable: true, textBased: true},
        'password': {element: 'input', type: 'password', editable: true, textBased: true},
        'tel': {element: 'input', type: 'tel', editable: true, textBased: true},
        'textarea': {element: 'textarea', editable: true, textBased: true},
        'date': {element: 'date', editable: true, textBased: true},
        'datetime': {element: 'datetime', editable: true, textBased: true},

        //ranges
        'number-range': {element: 'range', type: 'number', editable: true, textBased: true},
        'date-range': {element: 'date-range', type: 'text', editable: true, textBased: true},
        'datetime-range': {element: 'date-range', type: 'text', editable: true, textBased: true},

        //  Specialized editables
        'range': {element: 'input', type: 'range', editable: true, textBased: false},
        //Element is set as checkbox although it's an input so that it uses the checkbox template
        'checkbox': {element: 'checkbox', type: 'checkbox', editable: true, textBased: false},
        'select': {element: 'select', editable: true, textBased: false},

        //  Pseudo-non-editables (containers)
        'checklist': {element: 'checklist', editable: false, textBased: false},
        'radiolist': {element: 'radiolist', editable: false, textBased: false},
        'fieldset': {element: 'fieldset', editable: false, textBased: false},

        //  Non-editables (mostly buttons)
        'button': {element: 'button', type: 'button', editable: false, textBased: false},
        'hidden': {element: 'input', type: 'hidden', editable: false, textBased: false},
        'image': {element: 'input', type: 'image', editable: false, textBased: false},
        'submit': {element: 'button', type: 'submit', editable: false, textBased: false}
    };

    var defaultFieldMapping = {
        'type' : 'type',
        'value' : 'value',
        'valuesArray' : { //multiple values. Eg: select, fieldset, radio
            'field': 'values',  //Points to an array
            'value': 'value',   //Points to an value field in an object of an array
            'selected': 'selected',
            'required': 'required',
            'disabled': 'disabled',
            'readonly': 'readonly',
            'defaultSelected': 'defaultSelected',
            'label': 'label'
            },
        'label' : 'label',
        'description': 'description',
        'readonly':'readonly',
        'required': 'required',
        'hidden': 'ishidden',
        'min': 'min',
        'max': 'max',
        'step': 'step',
        'minLength': 'minlength',
        'maxLength': 'maxlength',
        'placeholder': 'placeholder',
        'multiple': 'multiple',
        'disabled': 'disabled',
        'dataType': 'dataType',
        'formatMask': 'formatMask',
        'customTemplate' : 'customTemplate',
        'model': 'model' //temporary
    };

    var defaultTemplateMapping = {
        'input': 'InputTemplate.tpl.html',
        'range': 'RangeInputTemplate.tpl.html',
        'textarea': 'TextareaTemplate.tpl.html',
        'date': 'DateTemplate.tpl.html',
        'date-range':'DateRangeTemplate.tpl.html',
        'datetime': 'DateTimeTemplate.tpl.html',
        'checkbox': 'CheckboxTemplate.tpl.html',
        'checklist': 'CheckboxFieldsetTemplate.tpl.html',
        'radiolist': 'RadioFieldsetTemplate.tpl.html',
        'sectionlegend': 'SectionLegendTemplate.tpl.html',
        'sectionlegendToggle': 'SectionLegendToggleTemplate.tpl.html',
        'select': 'SelectTemplate.tpl.html'
    };

    var isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);

    return {
        restrict: 'E', // supports using directive as element only
        transclude: true,
        link: function ($scope, element, attrs, ctrl, transcludeFn) {
            var newElement = null,
                HTMLFragment = null,
                newChild = null,
                optGroups = {},
                cbAtt = '',
                foundOne = false,
                iterElem = element,
                model = null,
                mapObject = null,
                fieldMapping = null,
                fieldSetMapping = null,
                pathMapping = null,
                templateMapping = null,
                newCheckboxFragment = null,
                newRadioFragment = null,
                transcludeElement,
                changeCallback;

            /* with multi currency enabled userCurrency will be USD and not $
             * https://success.salesforce.com/answers?id=90630000000h1ovAAA
            */
            var isoCurrencyCode = $rootScope.vlocity.userCurrency || 'USD';
            // some org returns userLanguage as en-us and some returns en_US causes issue we have to discuss on that and resolve
            //var userLocale = 'en_US';
            var isoCurrencySymbol = ISO_CURRENCY_INFO[isoCurrencyCode].text;
            $scope.localeCurencySym = isoCurrencySymbol || '$';

            /*
             * For form elements that the user does not interact with directly,
             * but whose underlying model has changed, we need to manually trigger
             * the form-on-change event
            */
            $scope.watchModel = function(modelObj, debounce) {
                var debounceTime = debounce ? 800 : 0;
                var saveDebounce = null;
                $scope.$watch(modelObj, function(newValue, oldValue) {
                    if (saveDebounce) {
                        $timeout.cancel(saveDebounce);
                    }
                    if (newValue !== oldValue && isFormAutoSave() && newValue) {
                        saveDebounce = $timeout(function () {
                            var wrappedResult = angular.element(document.getElementsByName(getFormName()));
                            var formChangeFn = $parse(wrappedResult.attr('form-on-change'));
                            formChangeFn($scope, {e:false, formValidation: $scope[getFormName()]});
                        }, debounceTime);
                    }
                }, true);
            };

            var extendContent = function(field) {
                var obj = {}; obj[field.label]= false;
                $scope.expand = $scope.expand || {};
                $scope.showMore = $scope.showMore || obj;
                var extendElement = newElement.find('[vdf-fieldset-wrapper] .extend-content');

                if (fieldSetMapping && fieldSetMapping.showMoreFlag && field.valuesArray.length > fieldSetMapping.showCount) {
                    $scope.showMore[field.label] = true;
                    $scope.expand[field.label] = true;
                }
                return extendElement;
            };

            //   @TODO
            //   Work in progress code. optimizations pending

            //  Check that the required attributes are in place
            if (angular.isDefined(attrs.ngModel)) {
                //TODO: check why $scope.$parent, it fails in some cases
                model = $parse(attrs.ngModel)($scope) || $parse(attrs.ngModel)($scope.$parent);
                //@TODO handle both $scope.parent and $scope
                $scope.translate = attrs.isTranslateLabels && attrs.isTranslateLabels === "true" ? true : false;
                mapObject = attrs.mapObject ? $parse(attrs.mapObject)($scope.$parent): {};
                fieldMapping = _.merge({}, defaultFieldMapping, mapObject.fieldMapping);
                fieldSetMapping = mapObject.fieldSetMapping || null;
                pathMapping = mapObject.pathMapping || null;
                templateMapping = mapObject.templateMapping || null;

                var setProperty = function (obj, props, value, lastProp, buildParent) {
                    props = props.split('.');
                    lastProp = lastProp || props.pop();

                    for (var i = 0; i < props.length; i++) {
                        obj = obj[props[i]] = obj[props[i]] || {};
                    }
                    if (!buildParent) {
                        obj[lastProp] = value;
                    }
                },
                bracket = function (model, base) {
                    var props = model.split('.');
                    return (base || props.shift()) + (props.length ? '["' + props.join('"]["') + '"]' : '');
                },

                /**
                 * getFieldType: get field type in lowercase
                 * @param  {object} field Object to query
                 * @return {string} input fieldType eg: email, number in lowercase
                 */
                getFieldType = function(field) {
                    var type = field.type;
                    var multiple = field.multiple ? field.multiple: '';

                    type = type ? type.toLowerCase() : '';

                    //Temporary fix
                    // @TODO needs proper fix
                    type = (type === 'dropdown') ? 'select' : type;
                    type = (type === 'checkbox' && multiple === true) ? 'checklist' : type;
                    type = (type === 'radio') ? 'radiolist' : type;

                    return type;   
                },

                /**
                 * getObjField returns the value based on the object path
                 * @param  {object} field    Object to query
                 * @param  {string} typePath query path
                 * @return {Object or String}
                 */
                getObjField = function(field, typePath) {
                    var type = _.get(field, typePath);
                    return type;
                },

                /**
                 * getTemplateMap Provides the template map based on the merge of default map and provided custom map.
                 * @param  {object} customTemplateMapping  Provide the object to override the default templates for inputs
                 * @return {object} New template map
                 */
                getTemplateMap = function (customTemplateMapping) {
                   return _.merge({}, defaultTemplateMapping, customTemplateMapping);
                },

                /**
                 * getTemplate returns the value based on the object path
                 * @param  {string} inputType  input type
                 * @return {html fragment}  returns the template based on input type
                 */
                getTemplate = function (inputType) {
                    var template = '',
                        templateMap = getTemplateMap(templateMapping);

                    template = templateMap[inputType];
                    return $templateCache.get(template);
                },

                /**
                 * getModel : function to get the model xpath
                 * @param  {Number} pid   parentIndex
                 * @param  {Number} id    index
                 * @param  {Object} field object
                 * @return {string} model xpath eg: importedScope.attributesObj[0].productAttributes.records[0].values
                 */
                getModel = function (pid, field, id) {
                    var path,
                        modelPath = '';

                    //Append the path when the json depth for model is 2 levels or more
                    //refer mapObject.pathMapping
                    path = pathMapping && pathMapping.path ? pathMapping.path : '';

                    if (path) {
                        //pid is the parent loop index
                        modelPath = attrs.ngModel + '['+ pid + '].'+ path + '['+ id +'].' + bracket(field);
                    }else {
                        modelPath = attrs.ngModel + '['+ pid +'].' + bracket(field);
                    }

                    return modelPath;
                },

                /**
                 * getFormInputName
                 * @param  {Number} pid [optional] parent index number. Exists when field category is avilable, two levels
                 * @param  {Number} id  mandatory param. 'id' is an index number
                 * @return {[String]}  unique input field name string Eg: myform_field_1_0
                 */
                getFormInputName = function (pid, id) {
                    var uniqueFormName = getFormName();

                    uniqueFormName = uniqueFormName + '_field';
                    // check if pid/id is a number. should allow zero
                    uniqueFormName = !isNaN(pid) ? uniqueFormName + '_' + pid : uniqueFormName;
                    uniqueFormName = !isNaN(id) ? uniqueFormName + '_' + id : uniqueFormName;

                    return uniqueFormName;
                },

                /**
                 * getFormName
                 * @return {string} returns the form name. Defaults when no name attribute is passed.
                 */
                getFormName = function () {
                    //If form name is not passed in directive it defaults to vdf. Always pass the unique form name in vdf directive.
                    //When multiple instances of vdf is used, it's a must to pass the unique form name
                    var DEFAULT_FORM_NAME = 'vdf'; //default name
                    return attrs.name? attrs.name : DEFAULT_FORM_NAME;
                },

                /**
                 * isFormAutoSave
                 * @return {boolean} returns whether the form elements should be auto-saved or not
                 */
                isFormAutoSave = function () {
                    return (angular.isDefined(attrs.formAutoSave) && (attrs.formAutoSave === 'true'));
                },

                buildSectionLegend = function (field, id, label) {
                    var isReplaceable = false;
                    HTMLFragment = getTemplate('sectionlegend');  //@TODO map it
                    newElement = angular.element(HTMLFragment);
                    var sectionLegend = newElement.find('[vdf-section-legend]');

                    isReplaceable  = !!sectionLegend.attr('vdf-replace');

                    if(isReplaceable) {
                        sectionLegend.replaceWith(label);
                    }else {
                        sectionLegend.text(label);
                    }

                    // Add the element to the page
                    this.append(newElement);
                    newElement = null;
                },

                /**
                 * getFieldMapTransform: Deep object merge for mapping fields
                 * @param  {object} defaultFieldMapping [Contains all the default set of key/value pairs]
                 * @param  {object} customFieldMapping  [Custom key/value pairs which overrides default]
                 * @return {object}                     [Transformed standard field mapping]
                 *
                 * Eg: defaultFieldMapping: {a:1, b:2, c:{c1:1, c2:2}}
                 *     customFieldMapping: {a:11, c:{c1:11}}
                 *     output: {a:11, b:2, c:{c1:11, c2:2}}
                 */
                getFieldMapTransform = function (defaultFieldMapping, customFieldMapping) {
                   return _.merge({}, defaultFieldMapping, customFieldMapping);
                },

                /**
                 * getFieldTransform: Tranforms the custom field to standard field with default attributes.
                 * Usually contains the HTML5 standard input attributes eg: min, max, required, placeholder
                 * @param  {object} rawField [description]
                 * @return {object} Transformed standard field object
                 */
                getFieldTransform = function (rawField) {
                    var transformedField = {};
                    var fieldMap = getFieldMapTransform(defaultFieldMapping, mapObject.fieldMapping);
                    _.forEach(fieldMap, function(mapValue, key) {
                        var fieldValue = [];

                        //If the value is object, loop through the nested keys
                        if(key === 'valuesArray' && rawField[mapValue.field] && rawField[mapValue.field].length > 0) {
                            _.forEach(rawField[mapValue.field], function(valuesArrayObj, valuesArrayIndex) {
                                var resultObj;
                                _.forEach(mapValue, function(childMapValue, childKey) {
                                    var childFieldValue = _.get(rawField[mapValue.field][valuesArrayIndex], childMapValue);
                                    if (typeof childFieldValue !== 'undefined') {
                                        resultObj = resultObj || {};
                                        resultObj[childKey] = childFieldValue;
                                    }
                                });
                                fieldValue[valuesArrayIndex] = resultObj;
                            });
                        } else {
                            fieldValue = _.get(rawField, mapValue);
                        }

                        if (typeof fieldValue !== 'undefined') {
                            transformedField[key] = fieldValue;
                        }
                    });

                    return transformedField;
                },

                buildFields = function (rawField, pid, id) {
                    var templateScope = $scope.$new();
                    var checkListArray = [];
                    var field = {};
                    var customTemplateFieldPath;
                    var vdfInput;
                    var vdfSelect;
                    var extendElement;
                    var vdfOnly, vdfMin, vdfMax, vdfTimeMin, vdfTimeMax, vdfDateMin, vdfDateMax, valueIndex;
                    // get the raw field object as a standard field object
                    // Templates read the values based on standard field object
                    field = getFieldTransform(rawField);

                    if (String(id).charAt(0) === '$') {
                        // Don't process keys added by Angular
                        return;
                    }

                    if (field.hidden === true) {
                        return;
                    }

                    //Handle the custom vlocity templates for inputs
                    //If customTemplate exists, it wil override the default templates.
                    if(field.customTemplate) {
                        //Handle non category fields - fields at root level
                        customTemplateFieldPath = attrs.ngModel + '[' +pid+ ']';

                        // Handle nested level of fields inside categories
                        // customTemplateFieldPath eg: importedScope.attributesObj[0].productAttributes.records[0]
                        if (pathMapping && pathMapping.path) {
                            customTemplateFieldPath = customTemplateFieldPath + '.' + pathMapping.path + '['+ id + ']';
                        }

                        newElement = '<vloc-cmp customtemplate="' + field.customTemplate + '" loaded="true" records="' + customTemplateFieldPath + '" form-name="' + getFormName() + '" form-auto-save="' + isFormAutoSave() + '"></vloc-cmp>';
                        this.append(newElement);
                        newElement = null;
                        return;
                    }

                    if (!angular.isDefined(supported[getFieldType(field)]) || supported[getFieldType(field)] === false) {
                        //  Unsupported.  Create SPAN with field.label as contents
                        newElement = angular.element('<span></span>');
                        if (angular.isDefined(field.label)) {
                            angular.element(newElement).html(field.label);
                        }
                        angular.forEach(field, function (val, attr) {
                            if (['label', 'type'].indexOf(attr) > -1) {
                                return;
                            }
                            newElement.attr(attr, val);
                        });
                        this.append(newElement);
                        newElement = null;
                    } else {
                        // newElement = angular.element($document[0].createElement(supported[getFieldType(field)].element));
                        HTMLFragment = getTemplate(supported[getFieldType(field)].element);

                        //Add the form field name for input fields, labels and error handlers by
                        // replacing [[vdf-form-field-name]] with "myFormName.myFieldName"
                        HTMLFragment = HTMLFragment.replace(/\[\[vdf-form-field-name\]\]/gi, getFormName() + '.' + getFormInputName(pid, id));

                        //Replace the template scope values. eg: label name, required field
                        templateScope.field = field;
                        templateScope.attrs = attrs;
                        HTMLFragment = $compile(HTMLFragment)(templateScope);
                        // HTMLFragment = $interpolate(HTMLFragment)(templateScope);
                        newElement = angular.element(HTMLFragment);
                        vdfInput = newElement.find('[vdf-input]');

                        if (angular.isDefined(supported[getFieldType(field)].type)) {
                            vdfInput.attr('type', supported[getFieldType(field)].type);
                        }

                        //  Editable fields (those that can feed models)
                        if (angular.isDefined(supported[getFieldType(field)].editable) && supported[getFieldType(field)].editable) {
                            vdfInput.attr('name', getFormInputName(pid, id));
                            //vdfInput.attr('ng-model', bracket(fieldMapping.model, attrs.ngModel));
                            vdfInput.attr('ng-model', getModel(pid, fieldMapping.value, id));

                            // Build parent in case of a nested model
                            //setProperty(model, fieldMapping.model, {}, null, true);

                            if (angular.isDefined(field.readonly)) {vdfInput.attr('ng-readonly', field.readonly);}
                            if (angular.isDefined(field.required)) {vdfInput.attr('ng-required', field.required);}
                            if (angular.isDefined(field.disabled)) {vdfInput.attr('ng-disabled', field.disabled);}
                            if (angular.isDefined(field.value)) {
                                //setProperty(model, fieldMapping.model, angular.copy(fieldMapping.value));

                                vdfInput.attr('value', field.value);
                            }
                        }

                        //  Fields based on input type=text
                        if (angular.isDefined(supported[getFieldType(field)].textBased) && supported[getFieldType(field)].textBased) {
                            if (angular.isDefined(field.minLength)) {vdfInput.attr('ng-minlength', field.minLength);}
                            if (angular.isDefined(field.maxLength)) {vdfInput.attr('ng-maxlength', field.maxLength);}
                            if (angular.isDefined(field.validate)) {vdfInput.attr('ng-pattern', field.validate);}
                            if (angular.isDefined(field.placeholder)) {vdfInput.attr('placeholder', field.placeholder);}

                            //slds readonly input style override
                            if (angular.isDefined(field.readonly) && field.readonly) {vdfInput.css('background-color', '#e0e5ee');}
                        }

                        //Add format mask support for input type text
                        if (getFieldType(field) === 'text' && field.formatMask) {
                            vdfInput.attr('ui-mask', field.formatMask);
                            vdfInput.attr('ui-mask-placeholder', '');
                            if (isIE) {
                                $scope.watchModel('' + getModel(pid, fieldMapping.value, id),true);
                            }
                        }

                        if (getFieldType(field) === 'date') {
                            vdfInput.attr('slds-date-picker', 'true');
                            vdfInput.attr('data-date-format', 'shortDate');
                            vdfInput.keypress(function(event) {event.preventDefault();});
                            // watch the underlying model and manually trigger the form-on-change event
                            $scope.watchModel('' + getModel(pid, fieldMapping.value, id));
                        }

                        if (getFieldType(field) === 'datetime') {
                            vdfInput = newElement.find('[vdf-data]');
                            vdfInput.attr('slds-date-picker', 'true');
                            vdfInput.attr('data-date-format', 'shortDate');
                            vdfInput.keypress(function(event) {event.preventDefault();});

                            vdfInput  = newElement.find('[vdf-time]');
                            vdfInput.attr('slds-time-picker', 'true');
                            vdfInput.attr('data-time-format', 'mediumTime');
                            vdfInput.attr('name', getFormInputName(pid));

                            vdfInput.keypress(function(event) {event.preventDefault();});

                            // watch the underlying model and manually trigger the form-on-change event
                            $scope.watchModel('' + getModel(pid, fieldMapping.value, id));
                        }

                        if (getFieldType(field) === 'date-range' || getFieldType(field) === 'datetime-range') {
                            vdfOnly =   newElement.find('[data-vdf-only]');
                            vdfMin  =   newElement.find('[data-vdf-min]');
                            vdfMax  =   newElement.find('[data-vdf-max]');
                            vdfTimeMin  =   newElement.find('[time-vdf-min]');
                            vdfTimeMax  =   newElement.find('[time-vdf-max]');

                            if (field.min === field.max) {
                                vdfOnly.attr('ng-true-value', field.min);
                                vdfOnly.attr('ng-false-value', 'null');
                                vdfOnly.attr('type', 'checkbox');
                                vdfOnly.attr('ng-model', getModel(pid, fieldMapping.value, id));
                                
                                moment.locale(window.navigator.language);

                                if (getFieldType(field) === 'datetime-range') {
                                    field.value = moment(field.min).format('LLL');
                                } else {
                                    field.value = moment(field.min).format('LL');
                                }
                            } else {
                                //Display correct range on datapicker
                                vdfDateMin = new Date(field.min).setHours(0,0,0);
                                vdfDateMax = new Date(field.max).setHours(0,0,0);

                                vdfMin.attr('slds-date-picker', 'true');
                                vdfMin.attr('data-date-format', 'shortDate');
                                vdfMin.attr('data-min-date', vdfDateMin);
                                vdfMin.attr('ng-model', getModel(pid, fieldMapping.value, id)+'.min');

                                vdfMax.attr('slds-date-picker', 'true');
                                vdfMax.attr('data-date-format', 'shortDate');
                                vdfMax.attr('data-max-date', vdfDateMax);
                                vdfMax.attr('ng-model', getModel(pid, fieldMapping.value, id)+'.max');

                                if (getFieldType(field) === 'datetime-range') {
                                    vdfInput  = newElement.find('[vdf-time]');
                                    vdfInput.attr('slds-time-picker', 'true');
                                    vdfInput.attr('data-time-format', 'mediumTime');
                                    vdfTimeMin.attr('ng-model', getModel(pid, fieldMapping.value, id)+'.min');
                                    vdfTimeMax.attr('ng-model', getModel(pid, fieldMapping.value, id)+'.max');
                                }
                            }
                        }
                        
                        //  Special cases
                        if (getFieldType(field) === 'number' || getFieldType(field) === 'range') {
                            if (angular.isDefined(field.min)) {vdfInput.attr('min', field.min);}
                            if (angular.isDefined(field.max)) {vdfInput.attr('max', field.max);}
                            if (angular.isDefined(field.step)) {
                                vdfInput.attr('step', field.step);
                            } else {
                                vdfInput.attr('step', 'any');
                            }
                        } else if (['text', 'textarea'].indexOf(getFieldType(field)) > -1) {
                            if (angular.isDefined(field.splitBy)) {newElement.attr('ng-list', field.splitBy);}
                        } else if (getFieldType(field) === 'checkbox') {
                            if (angular.isDefined(field.isOn)) {newElement.attr('ng-true-value', field.isOn);}
                            if (angular.isDefined(field.isOff)) {newElement.attr('ng-false-value', field.isOff);}
                            if (angular.isDefined(field.slaveTo)) {newElement.attr('ng-checked', field.slaveTo);}
                        } else if (getFieldType(field) === 'checklist') {
                            field[fieldMapping.value] = field.value;

                            if (angular.isDefined(field.valuesArray)) {
                                if (! (angular.isDefined(model[field.model]) && angular.isObject(model[field.model]))) {
                                    //setProperty(model, getObjField(field, fieldMapping.model), {});
                                }

                                // Show More link
                                extendElement = extendContent(field);

                                newCheckboxFragment = newElement.find('[vdf-fieldset-element]').replaceWith('');
                                angular.forEach(field.valuesArray, function (option, childId) {
                                    newChild = newCheckboxFragment.clone();
                                    vdfInput = newChild.find('[vdf-input]');

                                    if(field.userValues) {
                                        valueIndex  = _.findIndex(field.userValues, function(attr) { 
                                            return Object.keys(attr)[0] === option.value;
                                        }); 
                                    } else {
                                        valueIndex = childId;   
                                    }

                                    vdfInput.attr('name', getFormInputName(pid, id) + '_' + childId);
                                    vdfInput.attr('ng-model', getModel(pid, fieldMapping.value, id) + '[' + valueIndex + ']' + '["' + option.value + '"]');
                                    if (angular.isDefined(option['class'])) {vdfInput.attr('ng-class', option['class']);}
                                    if (angular.isDefined(option.disabled)) {vdfInput.attr('ng-disabled', option.disabled);}
                                    if (angular.isDefined(option.readonly)) {vdfInput.attr('ng-readonly', option.readonly);}
                                    if (angular.isDefined(option.required)) {vdfInput.attr('ng-required', option.required);}
                                    if (angular.isDefined(option.callback)) {vdfInput.attr('ng-change', option.callback);}
                                    if (angular.isDefined(option.isOn)) {vdfInput.attr('ng-true-value', option.isOn);}
                                    if (angular.isDefined(option.isOff)) {vdfInput.attr('ng-false-value', option.isOff);}
                                    //default checkbox selection happens in angular based on userValues
                                    if (angular.isDefined(option.value)) {
                                        //setProperty(model, fieldMapping.model, angular.copy(option.value), childId);
                                        newChild.attr('value', option.value);
                                    }

                                    if (angular.isDefined(option.label)) {
                                        newChild.find('[vdf-checkbox-label]').html(option.label);
                                    }
                                    if (!$scope.showMore[field.label] || fieldSetMapping.showCount > childId) {
                                        newElement.find('[vdf-fieldset-wrapper] .visible-content').append(newChild);
                                    } else {
                                        extendElement.append(newChild);
                                    }
                                });
                                newCheckboxFragment = null;
                            }
                        } else if (getFieldType(field) === 'radio' || getFieldType(field) === 'radiolist') {
                            if (angular.isDefined(field.valuesArray)) {
                               // setProperty(model, getObjField(field, fieldMapping.model), angular.copy(field.value));

                                // Show More link
                                extendElement = extendContent(field);

                                newRadioFragment = newElement.find('[vdf-fieldset-element]').replaceWith('');
                                angular.forEach(field.valuesArray, function(option, childId) {
                                    // newChild = angular.element('<input type="radio" />');
                                    newChild = newRadioFragment.clone();
                                    vdfInput = newChild.find('[vdf-input]');

                                    vdfInput.attr('name', getFormInputName(pid, id));
                                    vdfInput.attr('ng-model', getModel(pid, fieldMapping.value, id));
                                    if (angular.isDefined(option['class'])) {vdfInput.attr('ng-class', option['class']);}
                                    if (angular.isDefined(option.disabled)) {vdfInput.attr('ng-disabled', option.disabled);}
                                    if (angular.isDefined(option.callback)) {vdfInput.attr('ng-change', option.callback);}
                                    if (angular.isDefined(option.readonly)) {vdfInput.attr('ng-readonly', option.readonly);}
                                    if (angular.isDefined(option.required)) {vdfInput.attr('ng-required', option.required);}
                                    vdfInput.attr('value', option.value);

                                    //TBD: handle the check to enable the default
                                    if (angular.isDefined(field.value) && field.value === option.value) {
                                        vdfInput.attr('checked', 'checked');
                                    }

                                    if (angular.isDefined(option.label)) {
                                        newChild.find('[vdf-radio-label]').html(option.label);
                                    }

                                    if (!$scope.showMore[field.label] || fieldSetMapping.showCount > childId) {
                                        newElement.find('[vdf-fieldset-wrapper] .visible-content').append(newChild);
                                    } else {
                                        extendElement.append(newChild);
                                    }
                                });

                                newRadioFragment = null;
                            }
                        }
                        else if (getFieldType(field) === 'select') {
                            if (angular.isDefined(field.multiple) && field.multiple !== false) {newElement.find('[vdf-select]').attr('multiple', 'multiple');}
                            if (angular.isDefined(field.empty) && field.empty !== false) {newElement.append(angular.element($document[0].createElement('option')).attr('value', '').html(field.empty));}
                            vdfSelect = newElement.find('[vdf-select]');

                            //Add a name attribute for select. Used for error handling in angular
                            vdfSelect.attr('name', getFormInputName(pid, id));

                            vdfSelect.attr('ng-model', getModel(pid, fieldMapping.value, id));
                            if (angular.isDefined(field.required)) {
                                vdfSelect.attr('ng-required', field.required);
                            }

                            if (angular.isDefined(field.disabled)) {
                                vdfSelect.attr('ng-disabled', field.disabled);
                            }

                            if (angular.isDefined(field.autoOptions)) {
                                newElement.attr('ng-options', field.autoOptions);
                            }
                            else if (angular.isDefined(field.valuesArray)) {
                                angular.forEach(field.valuesArray, function (option, childId) {
                                    newChild = angular.element($document[0].createElement('option'));
                                    newChild.attr('value', childId);
                                    if (angular.isDefined(option.disabled)) {newChild.attr('ng-disabled', option.disabled);}
                                    if (angular.isDefined(option.label)) {newChild.html(option.label);}
                                    if (angular.isDefined(option.value)) {newChild.attr('value', option.value);}

                                    // End of temporary fix
                                    if (angular.isDefined(option.group)) {
                                        if (!angular.isDefined(optGroups[option.group])) {
                                            optGroups[option.group] = angular.element($document[0].createElement('optgroup'));
                                            optGroups[option.group].attr('label', option.group);
                                        }
                                        optGroups[option.group].append(newChild);
                                    }
                                    else {
                                        vdfSelect.append(newChild);
                                    }
                                });

                                if (!angular.equals(optGroups, {})) {
                                    angular.forEach(optGroups, function (optGroup) {
                                        vdfSelect.append(optGroup);
                                    });
                                    optGroups = {};
                                }
                            }
                        }
                        else if (getFieldType(field) === 'image') {
                            if (angular.isDefined(field.label)) {newElement.attr('alt', field.label);}
                            if (angular.isDefined(field.source)) {newElement.attr('src', field.source);}
                        }
                        else if (getFieldType(field) === 'hidden') {
                            newElement.attr('name', getFormInputName(pid, id));
                            newElement.attr('ng-model', bracket(getObjField(field, fieldMapping.model), attrs.ngModel));
                            if (angular.isDefined(field.value)) {
                                setProperty(model, getObjField(field, fieldMapping.model), angular.copy(field.value));
                                newElement.attr('value', field.value);
                            }
                        }
                        else if (getFieldType(field) === 'number-range') {
                            vdfOnly =   newElement.find('[data-vdf-only]');
                            vdfMin  =   newElement.find('[data-vdf-min]');
                            vdfMax  =   newElement.find('[data-vdf-max]');

                            if(field.min === field.max) {
                                vdfOnly.attr('ng-true-value', field.min);
                                vdfOnly.attr('ng-false-value', 'null');
                                vdfOnly.attr('type', 'checkbox');
                                vdfOnly.attr('ng-model', getModel(pid, fieldMapping.value, id));

                            } else {
                                vdfMin.attr('ng-model', getModel(pid, fieldMapping.value, id)+'.min');
                                vdfMax.attr('ng-model', getModel(pid, fieldMapping.value, id)+'.max');

                                if (angular.isDefined(field.min)) {
                                    vdfMin.attr('min', field.min);
                                    vdfMax.attr('min', field.min);
                                }
                                if (angular.isDefined(field.max)) {
                                    vdfMin.attr('max', field.max);
                                    vdfMax.attr('max', field.max);
                                }
                                if (angular.isDefined(field.step)) {
                                    vdfMin.attr('step', field.step);
                                    vdfMax.attr('step', field.step);
                                }
                            }
                        }

                        //  Common attributes; radio already applied these...
                        if (getFieldType(field) !== 'radio') {
                            if (angular.isDefined(field['class'])) { newElement.attr('ng-class', field['class']); }
                            //  ...and checklist has already applied these.
                            if (getFieldType(field) !== 'checklist') {
                                if (angular.isDefined(field.disabled)) { newElement.attr('ng-disabled', field.disabled); }
                                if (angular.isDefined(field.callback)) {
                                    //  Some input types need listeners on click...
                                    if (['button', 'fieldset', 'image', 'submit'].indexOf(getFieldType(field)) > -1) {
                                        cbAtt = 'ng-click';
                                    }
                                    //  ...the rest on change.
                                    else {
                                        cbAtt = 'ng-change';
                                    }
                                    newElement.attr(cbAtt, field.callback);
                                }
                            }
                        }

                        // Arbitrary attributes
                        if (angular.isDefined(field.attributes)) {
                            angular.forEach(field.attributes, function (val, attr) {
                                newElement.attr(attr, val);
                            });
                        }

                        // Add the element to the page
                        this.append(newElement);
                        newElement = null;
                    }
                };

                // angular.forEach(template, buildFields, element);
                // two level loop

                if (pathMapping) {
                    //Loop through Category or Grouping
                    angular.forEach(model, function(value, key){
                        var fieldList = _.get(value, pathMapping.path);
                        if (angular.isDefined(fieldList) && fieldList.length > 0) {
                            buildSectionLegend.call(this, value, key, value.Name);
                        }
                        //Loop through field set
                        angular.forEach(fieldList, function(field, index){
                            buildFields.call(this, field, key, index);
                        }, element);
                    }, element);
                } else {
                    angular.forEach(model, function(field, index) {
                        buildFields.call(this, field, index);
                    }, element);
                }

                // Determine what tag name to use (ng-form if nested; form if outermost)
                // Recurively loops through the parent untill HTMl tag

                while (!(iterElem.parent().length <= 0 || iterElem.parent().prop('tagName') === 'HTML')) {
                    // Provide a rootEl(form or ng-form) attribute support on VDF, so users can customize. Improves performance
                    try {
                        if (['form','ngForm'].indexOf(attrs.$normalize(angular.lowercase(iterElem.parent()[0].nodeName))) > -1) {
                            foundOne = true;
                            break;
                        }
                        iterElem = iterElem.parent();
                    }catch(e){
                        break;
                    }
                }
                if (foundOne) {
                    newElement = angular.element($document[0].createElement('ng-form'));
                }
                else {
                    newElement = angular.element('<form></form>');
                }

                // Psuedo-transclusion
                angular.forEach(attrs.$attr, function(attName, attIndex) {
                    newElement.attr(attName, attrs[attIndex]);
                });
                newElement.attr('name', getFormName());
                newElement.attr('model', attrs.ngModel);
                newElement.removeAttr('ng-model');

                angular.forEach(element[0].classList, function(clsName) {
                    newElement[0].classList.add(clsName);
                });
                newElement.addClass('vlocity-dynamic-form');
                //Disable the HTML5 form input validation
                newElement.attr('novalidate', true);

                // Update attribute on change event
                if(newElement.attr('form-on-change')){
                    changeCallback = $parse(newElement.attr('form-on-change'));
                    newElement.on('change', function(e) {
                        $timeout(function(){
                            changeCallback($scope, {e:e, formValidation: $scope[getFormName()]});
                        },0);
                    });
                }

                // Transclude header and footer
                transcludeFn($scope, function(clone, scope) {
                    transcludeElement = angular.element('<div></div>').append(clone);
                });
                newElement.append(transcludeElement.find('header').html());
                newElement.append(element.contents());
                newElement.append(transcludeElement.find('footer').html());

                // Compile and update DOM
                $compile(newElement)($scope);
                element.replaceWith(newElement);
            }
        }
    };
}]);

},{}],3:[function(require,module,exports){
angular.module("VlocityDynamicForm").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("DateTemplate.tpl.html",'<div class="slds-form-element" ng-class="{\'slds-has-error\': [[vdf-form-field-name]].$invalid && [[vdf-form-field-name]].$touched, \'is-required\': required}" vdf-element-container="true">\n    <label class="slds-form-element__label">\n        <abbr class="slds-required" title="required" ng-if="::field.required">*</abbr>&#160;\n        {{:: translate && field.label ? $root.vlocity.getCustomLabel(field.label, field.label) : field.label}}\n    </label>\n    <div class="slds-form-element__icon" ng-if="::field.description">\n        <a href="javascript:void(0);"\n                slds-popover\n                data-container="{{attrs.tooltipContainer ? attrs.tooltipContainer : \'.via-slds\'}}"\n                nubbin-direction="bottom-left"\n                tooltip="true"\n                data-title="{{::field.description}}">\n            <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'info\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n            <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'VDFHelp\', \'Help\')}}</span>\n        </a>\n    </div>\n    \n    <div class="slds-form-element__control">\n    \x3c!-- data-container attribute enables the datepicker modal to get the priority. Without data-container, datepicker modal will be hidden(partially) in a container when overflow-y:scroll --\x3e\n        <input type="text" class="slds-input" vdf-input="true" autocomplete="off" data-container="{{attrs.dateContainer}}"/> \n    </div>\n\n    \x3c!-- Standard Error Messages --\x3e\n    <div ng-messages="[[vdf-form-field-name]].$error" ng-if="[[vdf-form-field-name]].$touched" role="alert">\n        <div class="slds-form-element__help" ng-message="required">{{::$root.vlocity.getCustomLabel(\'VDFEmptyDate\', \'Please enter a value for this field\')}}</div>\n        <div class="slds-form-element__help" ng-message="date">{{::$root.vlocity.getCustomLabel(\'VDFValidDate\', \'Please enter a valid date.\')}}</div>\n    </div>\n</div>'),$templateCache.put("RadioFieldsetTemplate.tpl.html",'<fieldset class="slds-form-element" ng-class="{\'slds-has-error\': [[vdf-form-field-name]].$invalid && [[vdf-form-field-name]].$touched, \'is-required\': required}" vdf-element-container="true" vdf-element-container="true">\n    <legend class="slds-form-element__legend slds-form-element__label">\n        <abbr class="slds-required" title="required" ng-if="::field.required">*</abbr>\n        <label class="slds-form-element__label">\n            {{:: translate && field.label ? $root.vlocity.getCustomLabel(field.label, field.label) : field.label}}\n        </label>\n        <div class="slds-form-element__icon" ng-if="::field.description">\n            <a href="javascript:void(0);" \n                    slds-popover \n                    data-container="{{attrs.tooltipContainer ? attrs.tooltipContainer : \'.via-slds\'}}"  \n                    nubbin-direction="bottom-left" \n                    tooltip="true" \n                    data-title="{{::field.description}}">\n                <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'info\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'VDFHelp\', \'Help\')}}</span>\n            </a>\n        </div>\n    </legend>\n    <div class="slds-form-element__control" vdf-fieldset-wrapper="true">\n        <label class="slds-radio" vdf-fieldset-element="true">\n            <input type="radio" name="options" vdf-input="true"/>\n            <span class="slds-radio--faux"></span>\n            <span class="slds-form-element__label" vdf-radio-label="true">Radio Label One</span>\n        </label>\n        <div class="visible-content"></div>\n        <div class="extend-content" ng-show="!expand[field.label]"></div>\n\n        <a ng-if="showMore[field.label]" ng-click="expand[field.label] = !expand[field.label]">\n            <small ng-show="expand[field.label]">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'jump_to_bottom\'"></slds-button-svg-icon> {{::$root.vlocity.getCustomLabel(\'VDFShowMore\', \'Show More\')}}\n            </small>\n            <small ng-show="!expand[field.label]">\n                <slds-button-svg-icon sprite="\'utility\'" size="\'small\'" icon="\'jump_to_top\'"></slds-button-svg-icon> {{::$root.vlocity.getCustomLabel(\'VDFShowLess\', \'Show Less\')}}\n            </small>\n        </a>\n    </div>\n\n    \x3c!-- Standard Error Messages --\x3e\n    <div ng-messages="[[vdf-form-field-name]].$error" ng-if="[[vdf-form-field-name]].$touched" role="alert">\n        <div class="slds-form-element__help" ng-message="required">{{::$root.vlocity.getCustomLabel(\'VDFFieldIsRequired\',\'This field is required.\')}}</div>\n    </div>\n</fieldset>\n'),$templateCache.put("DateTimeTemplate.tpl.html",'<div class="slds-form-element" ng-class="{\'slds-has-error\': [[vdf-form-field-name]].$invalid && [[vdf-form-field-name]].$touched, \'is-required\': required}" vdf-element-container="true">\n    <label class="slds-form-element__label">\n        <abbr class="slds-required" title="required" ng-if="::field.required">*</abbr>&#160;\n        {{:: translate && field.label ? $root.vlocity.getCustomLabel(field.label, field.label) : field.label}}\n    </label>\n    <div class="slds-form-element__icon" ng-if="::field.description">\n        <a href="javascript:void(0);"\n                slds-popover\n                data-container="{{attrs.tooltipContainer ? attrs.tooltipContainer : \'.via-slds\'}}"\n                nubbin-direction="bottom-left"\n                tooltip="true"\n                data-title="{{::field.description}}">\n            <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'info\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n            <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'VDFHelp\', \'Help\')}}</span>\n        </a>\n    </div>\n\n    <div class="slds-form-element__control slds-grid slds-wrap slds-grid--pull-padded-x-small">\n        <div class="slds-size--1-of-1 slds-medium-size--1-of-2 slds-p-around--x-small">\n            <input type="text" vdf-input="true" vdf-data="true" class="slds-input" autocomplete="off" data-container="{{attrs.dateContainer}}"/>\n        </div>\n        <div class="slds-size--1-of-1 slds-medium-size--1-of-2 slds-p-around--x-small">\n            <input type="text" vdf-input="true" vdf-time="true"  class="slds-input" autocomplete="off" data-container="{{attrs.dateContainer}}"/>\n        </div>\n    </div>\n\n    \x3c!-- Standard Error Messages --\x3e\n    <div ng-messages="[[vdf-form-field-name]].$error" ng-if="[[vdf-form-field-name]].$touched" role="alert">\n        <div class="slds-form-element__help" ng-message="required">{{::$root.vlocity.getCustomLabel(\'VDFEmptyDate\', \'Please enter a value for this field\')}}</div>\n        <div class="slds-form-element__help" ng-message="date">{{::$root.vlocity.getCustomLabel(\'VDFValidDate\', \'Please enter a valid date.\')}}</div>\n    </div>\n</div>'),$templateCache.put("CheckboxTemplate.tpl.html",'<div class="slds-form-element" ng-class="{\'slds-has-error\': [[vdf-form-field-name]].$invalid && [[vdf-form-field-name]].$touched, \'is-required\': required}" vdf-element-container="true" vdf-element-container="true">\n    <div class="slds-form-element__control">\n        <label class="slds-checkbox">\n            <abbr class="slds-required" title="required" ng-if="::field.required">*</abbr>\n            <input type="checkbox" name="options" vdf-input="true"/>\n            <span class="slds-checkbox--faux"></span>\n            <span class="slds-form-element__label"> {{:: translate && field.label ? $root.vlocity.getCustomLabel(field.label, field.label) : field.label}}</span>\n        </label>\n        <div class="slds-form-element__icon" ng-if="::field.description">\n            <a href="javascript:void(0);" \n                    slds-popover \n                    data-container="{{attrs.tooltipContainer ? attrs.tooltipContainer : \'.via-slds\'}}"  \n                    nubbin-direction="bottom-left" \n                    tooltip="true" \n                    data-title="{{::field.description}}">\n                <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'info\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'VDFHelp\', \'Help\')}}</span>\n            </a>\n        </div>\n    </div>\n    \x3c!-- Standard Error Messages --\x3e\n    <div ng-messages="[[vdf-form-field-name]].$error" ng-if="[[vdf-form-field-name]].$touched" role="alert">\n        <div class="slds-form-element__help" ng-message="required">{{::$root.vlocity.getCustomLabel(\'VDFFieldIsRequired\',\'This field is required.\')}}</div>\n    </div>\n</div>'),$templateCache.put("RangeInputTemplate.tpl.html",'<div class="slds-form-element" ng-class="{\'slds-has-error\': [[vdf-form-field-name]].$invalid && [[vdf-form-field-name]].$touched, \'is-required\': required}" vdf-element-container="true">\n    <label class="slds-text-heading--label">\n        <abbr class="slds-required" title="required" ng-if="::field.required">*</abbr>\n        {{:: translate && field.label ? $root.vlocity.getCustomLabel(field.label, field.label) : field.label}}\n    </label>\n\n    <div class="slds-form-element__icon" ng-if="::field.description">\n        <a href="javascript:void(0);" \n                slds-popover \n                data-container="{{attrs.tooltipContainer ? attrs.tooltipContainer : \'.via-slds\'}}"  \n                nubbin-direction="bottom-left" \n                tooltip="true" \n                data-title="{{::field.description}}">\n            <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'info\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n            <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'VDFHelp\', \'Help\')}}</span>\n        </a>\n    </div>\n\n    \x3c!-- Work in progress code --\x3e\n    <div class="slds-form-element__icon" ng-if="::field.description">\n        <a href="javascript:void(0);">\n          <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'info\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n          <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'VDFHelp\', \'Help\')}}</span>\n        </a>\n    </div>\n\n    <div class="slds-form-element__control" ng-show="field.min === field.max">\n        <label class="slds-checkbox">\n            <abbr class="slds-required" title="required" ng-if="::field.required">*</abbr>\n            <input vdf-input="true" data-vdf-only type="checkbox" name="options"/>\n            <span class="slds-checkbox--faux"></span>\n            <span ng-if="::field.dataType == \'currency\'">{{::localeCurencySym}}</span>\n            <span class="slds-form-element__label">{{field.min}}</span>\n            <span ng-if="::field.dataType == \'percentage\'">%</span>\n        </label>\n    </div>\n    <div class="slds-form-element__control slds-grid slds-wrap slds-grid--pull-padded" ng-show="field.min !== field.max">\n        <div class="slds-form-element__control slds-col--padded slds-size--1-of-1 slds-medium-size--3-of-6 slds-large-size--6-of-12" >\n            <label>From</label>\n            <div class="slds-input-has-fixed-addon">\n                <span class="slds-form-element__addon" ng-if="::field.dataType == \'currency\'">{{::localeCurencySym}}</span>\n                <input data-vdf-min vdf-input="true" vdf-input-name="true" class="slds-input" type="number" placeholder="{{::field.min}}" />\n                <span class="slds-form-element__addon" ng-if="::field.dataType == \'percentage\'">%</span>\n            </div>\n            \x3c!-- <input data-vdf-min vdf-input="true" vdf-input-name="true" class="slds-input" type="number" placeholder="{{field.min}}" /> --\x3e\n        </div>\n        <div class="slds-form-element__control slds-col--padded slds-size--1-of-1 slds-medium-size--3-of-6 slds-large-size--6-of-12">\n            <label>To</label>\n            <div class="slds-input-has-fixed-addon">\n                <span class="slds-form-element__addon" ng-if="::field.dataType == \'currency\'">{{::localeCurencySym}}</span>\n                <input data-vdf-max vdf-input="true" vdf-input-name="true" class="slds-input" type="number" placeholder="{{::field.max}}" />\n                <span class="slds-form-element__addon" ng-if="::field.dataType == \'percentage\'">%</span>\n            </div>\n        </div>\n    </div>\n    \x3c!-- test --\x3e\n\n    \x3c!-- Error status: {{[[vdf-form-field-name]] | json}} --\x3e\n    \x3c!-- Standard Error Messages --\x3e\n    <div ng-messages="[[vdf-form-field-name]].$error" ng-if="[[vdf-form-field-name]].$touched" role="alert">\n        <div class="slds-form-element__help" ng-message="required">{{::$root.vlocity.getCustomLabel(\'VDFEmptyDate\', \'Please enter a value for this field\')}}</div>\n        <div class="slds-form-element__help" ng-message="invalid">{{::$root.vlocity.getCustomLabel(\'VDFInvalidField\', \'Please enter a value for this invalid field\')}}</div>\n        <div class="slds-form-element__help" ng-message="email">{{::$root.vlocity.getCustomLabel(\'VDFValidEmail\', \'Please enter a valid email address\')}}</div>\n        <div class="slds-form-element__help" ng-message="number">{{::$root.vlocity.getCustomLabel(\'VDFValidNumber\', \'Please enter a valid number\')}}</div>\n        <div class="slds-form-element__help" ng-message="min">\n            {{::$root.vlocity.getCustomLabel(\'VDFFieldTooSmall\', \'This field value is too small\')}} <span ng-if="::field.min">({{::$root.vlocity.getCustomLabel(\'VDFFieldMin\', \'minimum is {1}\', field.min)}})</span>\n        </div>\n        <div class="slds-form-element__help" ng-message="max">\n            {{::$root.vlocity.getCustomLabel(\'VDFFieldTooHigh\', \'This field value is too high\')}} <span ng-if="::field.max">({{::$root.vlocity.getCustomLabel(\'VDFFieldMax\', \'maximum is {1}\', field.max)}})</span>\n        </div>\n        <div class="slds-form-element__help" ng-message="minlength">\n            {{::$root.vlocity.getCustomLabel(\'VDFFieldTooShort\', \'This field is too short\')}} <span ng-if="field.minLength">({{::$root.vlocity.getCustomLabel(\'VDFFieldMimChar\', \'minimum is {1} characters\', field.minLength)}})</span>\n        </div>\n        <div class="slds-form-element__help" ng-message="maxlength">\n'+"            {{::$root.vlocity.getCustomLabel('VDFFieldTooLong', 'This field is too long')}} <span ng-if=\"field.maxLength\">({{::$root.vlocity.getCustomLabel('VDFFieldMaxChar', 'maximum is {1} characters', field.maxLength)}})</span>\n        </div>\n    </div>\n</div>\n"),$templateCache.put("InputTemplate.tpl.html",'<div class="slds-form-element" ng-class="{\'slds-has-error\': [[vdf-form-field-name]].$invalid && [[vdf-form-field-name]].$touched, \'is-required\': required}" vdf-element-container="true">\n    <label class="slds-form-element__label">\n        <abbr class="slds-required" title="required" ng-if="::field.required">*</abbr>\n        {{:: translate && field.label ? $root.vlocity.getCustomLabel(field.label, field.label) : field.label}}\n    </label>\n    <div class="slds-form-element__icon" ng-if="::field.description">\n        <a href="javascript:void(0);" \n                slds-popover \n                data-container="{{attrs.tooltipContainer ? attrs.tooltipContainer : \'.via-slds\'}}" \n                nubbin-direction="bottom-left" \n                tooltip="true" \n                data-title="{{::field.description}}">\n            <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'info\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n            <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'VDFHelp\', \'Help\')}}</span>\n        </a>\n    </div>\n    <div class="slds-form-element__control slds-input-has-fixed-addon">\n        <span class="slds-form-element__addon" ng-if="::field.dataType == \'currency\'" ng-bind-html="::localeCurencySym"></span>\n        <input vdf-input="true" vdf-input-name="true" class="slds-input" type="text"/>\n        <span class="slds-form-element__addon" ng-if="::field.dataType == \'percentage\'">%</span>\n    </div>\n\n    \x3c!-- Error status: {{[[vdf-form-field-name]] | json}} --\x3e\n    \x3c!-- Standard Error Messages --\x3e\n    <div ng-messages="[[vdf-form-field-name]].$error" ng-if="[[vdf-form-field-name]].$touched" role="alert">\n        <div class="slds-form-element__help" ng-message="required">{{::$root.vlocity.getCustomLabel(\'VDFEmptyDate\', \'Please enter a value for this field\')}}</div>\n        <div class="slds-form-element__help" ng-message="invalid">{{::$root.vlocity.getCustomLabel(\'VDFInvalidField\', \'Please enter a value for this invalid field\')}}</div>\n        <div class="slds-form-element__help" ng-message="email">{{::$root.vlocity.getCustomLabel(\'VDFValidEmail\', \'Please enter a valid email address\')}}</div>\n        <div class="slds-form-element__help" ng-message="number">{{::$root.vlocity.getCustomLabel(\'VDFValidNumber\', \'Please enter a valid number\')}}</div>\n        <div class="slds-form-element__help" ng-message="min">\n            {{::$root.vlocity.getCustomLabel(\'VDFFieldTooSmall\', \'This field value is too small\')}} <span ng-if="::field.min">({{::$root.vlocity.getCustomLabel(\'VDFFieldMin\', \'minimum is {1}\', field.min)}})</span>\n        </div>\n        <div class="slds-form-element__help" ng-message="max">\n            {{::$root.vlocity.getCustomLabel(\'VDFFieldTooHigh\', \'This field value is too high\')}} <span ng-if="::field.max">({{::$root.vlocity.getCustomLabel(\'VDFFieldMax\', \'maximum is {1}\', field.max)}})</span>\n        </div>\n        <div class="slds-form-element__help" ng-message="minlength">\n            {{::$root.vlocity.getCustomLabel(\'VDFFieldTooShort\', \'This field is too short\')}} <span ng-if="field.minLength">({{::$root.vlocity.getCustomLabel(\'VDFFieldMimChar\', \'minimum is {1} characters\', field.minLength)}})</span>\n        </div>\n        <div class="slds-form-element__help" ng-message="maxlength">\n'+"            {{::$root.vlocity.getCustomLabel('VDFFieldTooLong', 'This field is too long')}} <span ng-if=\"field.maxLength\">({{::$root.vlocity.getCustomLabel('VDFFieldMaxChar', 'maximum is {1} characters', field.maxLength)}})</span>\n        </div>\n    </div>\n</div>\n"),$templateCache.put("SectionLegendToggleTemplate.tpl.html",'<div class="slds-section slds-m-top--small slds-is-open" vdf-element-container>\n    <div class="slds-section__title">\n        <h3 href="#void" class="slds-section__title-action">\n            <button class="slds-button slds-button--icon-container">\n                <svg aria-hidden="true" class="slds-button__icon">\n                    <use xmlns:xlink="{{\'/assets/icons/utility-sprite/svg/symbols.svg#switch\' | sldsStaticResourceURL}}"></use>\n                </svg>\n            </button>\n'+"            <span vdf-section-legend vdf-replace>{{::$root.vlocity.getCustomLabel('VDFSectionTitle', 'Section Title')}}<span>\n        </h3>\n    </div>\n</div>"),$templateCache.put("TextareaTemplate.tpl.html",'<div class="slds-form-element" ng-class="{\'slds-has-error\': [[vdf-form-field-name]].$invalid && [[vdf-form-field-name]].$touched, \'is-required\': required}" vdf-element-container="true">\n    <label class="slds-form-element__label">\n        <abbr class="slds-required" title="required" ng-if="::field.required">*</abbr>&#160;\n        {{:: translate && field.label ? $root.vlocity.getCustomLabel(field.label, field.label) : field.label}}\n    </label>\n    <div class="slds-form-element__icon" ng-if="::field.description">\n        <a href="javascript:void(0);" \n                slds-popover \n                data-container="{{attrs.tooltipContainer ? attrs.tooltipContainer : \'.via-slds\'}}" \n                nubbin-direction="bottom-left" \n                tooltip="true" \n                data-title="{{::field.description}}">\n            <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'info\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n            <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'VDFHelp\', \'Help\')}}</span>\n        </a>\n    </div>\n    <div class="slds-form-element__control">\n        <textarea class="slds-textarea" placeholder="" vdf-input="true"></textarea>\n    </div>\n    \x3c!-- Standard Error Messages --\x3e\n    <div ng-messages="[[vdf-form-field-name]].$error" ng-if="[[vdf-form-field-name]].$touched" role="alert">\n        <div class="slds-form-element__help" ng-message="required">\n            {{::$root.vlocity.getCustomLabel(\'VDFEmptyDate\', \'Please enter a value for this field\')}}\n        </div>\n        <div class="slds-form-element__help" ng-message="minlength">\n            {{::$root.vlocity.getCustomLabel(\'VDFFieldTooShort\', \'This field is too short\')}} <span ng-if="field.minLength">({{::$root.vlocity.getCustomLabel(\'VDFFieldMimChar\', \'minimum is {1} characters\', field.minLength)}})</span>\n        </div>\n        <div class="slds-form-element__help" ng-message="maxlength">\n'+"            {{::$root.vlocity.getCustomLabel('VDFFieldTooLong', 'This field is too long')}} <span ng-if=\"field.maxLength\">({{::$root.vlocity.getCustomLabel('VDFFieldMaxChar', 'maximum is {1} characters', field.maxLength)}})</span>\n        </div>\n    </div>\n</div>"),$templateCache.put("SelectTemplate.tpl.html",'<div class="slds-form-element" ng-class="{\'slds-has-error\': [[vdf-form-field-name]].$invalid && [[vdf-form-field-name]].$touched, \'is-required\': required}" vdf-element-container="true" vdf-element-container="true">\n    <label class="slds-form-element__label">\n        <abbr class="slds-required" title="required" ng-if="::field.required">*</abbr>\n        {{:: translate && field.label ? $root.vlocity.getCustomLabel(field.label, field.label) : field.label}}\n    </label>\n    <div class="slds-form-element__icon" ng-if="::field.description">\n        <a href="javascript:void(0);" \n                slds-popover \n                data-container="{{attrs.tooltipContainer ? attrs.tooltipContainer : \'.via-slds\'}}"  \n                nubbin-direction="bottom-left" \n                tooltip="true" \n                data-title="{{::field.description}}">\n            <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'info\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n            <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'VDFHelp\', \'Help\')}}</span>\n        </a>\n    </div>\n    <div class="slds-form-element__control">\n        <div class="slds-select--container">\n            <select class="slds-select" vdf-select="true">\n                \x3c!-- <option vdf-select-option="true">Sample option</option> --\x3e\n            </select>\n        </div>\n    </div>\n    \x3c!-- Standard Error Messages --\x3e\n    <div ng-messages="[[vdf-form-field-name]].$error" ng-if="[[vdf-form-field-name]].$touched" role="alert">\n        <div class="slds-form-element__help" ng-message="required">{{::$root.vlocity.getCustomLabel(\'VDFFieldIsRequired\',\'This field is required.\')}}</div>\n    </div>\n</div>\n'),$templateCache.put("CheckboxFieldsetTemplate.tpl.html",'<fieldset class="slds-form-element" ng-class="{\'slds-has-error\': [[vdf-form-field-name]].$invalid && [[vdf-form-field-name]].$touched, \'is-required\': required}" vdf-element-container="true" vdf-element-container="true">\n    <legend class="slds-form-element__legend slds-form-element__label">\n        <abbr class="slds-required" title="required" ng-if="::field.required">*</abbr>\n        <label class="slds-form-element__label">\n            {{:: translate && field.label ? $root.vlocity.getCustomLabel(field.label, field.label) : field.label}}\n        </label>\n        <div class="slds-form-element__icon" ng-if="::field.description">\n            <a href="javascript:void(0);" \n                    slds-popover \n                    data-container="{{attrs.tooltipContainer ? attrs.tooltipContainer : \'.via-slds\'}}"  \n                    nubbin-direction="bottom-left" \n                    tooltip="true" \n                    data-title="{{::field.description}}">\n                <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'info\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                <span class="slds-assistive-text">{{::$root.vlocity.getCustomLabel(\'VDFHelp\', \'Help\')}}</span>\n            </a>\n        </div>\n    </legend>\n    <div class="slds-form-element__control" vdf-fieldset-wrapper="true">\n        <label class="slds-checkbox" vdf-fieldset-element="true">\n            <input type="checkbox" name="options" vdf-input="true">\n            <span class="slds-checkbox--faux"></span>\n            <span class="slds-form-element__label" vdf-checkbox-label="true">Checkbox Label</span>\n        </label>\n        \n        <div class="visible-content"></div>\n        <div class="extend-content" ng-show="!expand[field.label]"></div>\n\n        <a ng-if="showMore[field.label]" ng-click="expand[field.label] = !expand[field.label]">\n            <small ng-show="expand[field.label]">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'jump_to_bottom\'"></slds-button-svg-icon> {{::$root.vlocity.getCustomLabel(\'VDFShowMore\', \'Show More\')}}\n            </small>\n            <small ng-show="!expand[field.label]">\n                <slds-button-svg-icon sprite="\'utility\'" size="\'small\'" icon="\'jump_to_top\'"></slds-button-svg-icon> {{::$root.vlocity.getCustomLabel(\'VDFShowLess\', \'Show Less\')}}\n            </small>\n        </a>\n    </div>\n\n    \x3c!-- Standard Error Messages --\x3e\n    <div ng-messages="[[vdf-form-field-name]].$error" ng-if="[[vdf-form-field-name]].$touched" role="alert">\n        <div class="slds-form-element__help" ng-message="required">{{::$root.vlocity.getCustomLabel(\'VDFFieldIsRequired\',\'This field is required.\')}}</div>\n    </div>\n</fieldset>\n'),$templateCache.put("SectionLegendTemplate.tpl.html",'<div class="slds-section" vdf-element-container>\n    <div class="slds-section__title slds-m-top--medium">\n        <h3 vdf-section-legend></h3>\n    </div>\n</div>\n'),$templateCache.put("DateRangeTemplate.tpl.html",'<div class="slds-form-element"  vdf-element-container="true">\n    <label class="slds-text-heading--label">\n        <abbr class="slds-required" title="required" ng-if="::field.required">*</abbr>\n        {{:: translate && field.label ? $root.vlocity.getCustomLabel(field.label, field.label) : field.label}}\n    </label>\n\n    <div class="slds-form-element__control" ng-show="field.min === field.max">\n        <label class="slds-checkbox">\n            <abbr class="slds-required" title="required" ng-if="::field.required">*</abbr>\n            <input vdf-input="true" data-vdf-only type="checkbox" name="options"/>\n            <span class="slds-checkbox--faux"></span>\n            <span class="slds-form-element__label">{{field.value}}</span>\n        </label>\n    </div>\n\n    <div class="slds-form-element__control slds-grid slds-wrap slds-grid--pull-padded" ng-show="field.min !== field.max">\n        <div class="slds-form-element__control slds-col--padded slds-size--1-of-1 slds-medium-size--3-of-6 slds-large-size--6-of-12" >\n            <label>{{::$root.vlocity.getCustomLabel(\'VDFFrom\', \'From\')}}</label>\n            <div class="slds-grid">\n                <input data-vdf-min vdf-input="true" vdf-input-name="true" placeholder="Date"\n                    class="slds-input" ng-class="{\'slds-size--1-of-2 slds-m-around--x-small\': field.type==\'datetime-range\'}" />\n                <input ng-show="field.type==\'datetime-range\'" time-vdf-min vdf-time="true" vdf-input="true" placeholder="Time"\n                    class="slds-input slds-size--1-of-2 slds-m-around--x-small"/>\n            </div>\n        </div>\n        <div class="slds-form-element__control slds-col--padded slds-size--1-of-1 slds-medium-size--3-of-6 slds-large-size--6-of-12">\n            <label>{{::$root.vlocity.getCustomLabel(\'VDFTo\', \'To\')}}</label>\n            <div class="slds-grid">\n                <input data-vdf-max vdf-input="true" vdf-input-name="true" placeholder="Date"\n                    class="slds-input" ng-class="{\'slds-size--1-of-2 slds-m-around--x-small\': field.type==\'datetime-range\'}" />\n                <input ng-show="field.type==\'datetime-range\'" time-vdf-max vdf-time="true" vdf-input="true" placeholder="Time"\n                    class="slds-input slds-size--1-of-2 slds-m-around--x-small"/>\n            </div>\n        </div>\n    </div>\n</div>')}]);

},{}],4:[function(require,module,exports){
/*!
 * angular-ui-mask
 * https://github.com/angular-ui/ui-mask
 * Version: 1.8.8 - 2019-03-19T20:21:15.176Z
 * License: MIT
 */
!function(){"use strict";angular.module("ui.mask",[]).value("uiMaskConfig",{maskDefinitions:{9:/\d/,A:/[a-zA-Z]/,"*":/[a-zA-Z0-9]/},clearOnBlur:!0,clearOnBlurPlaceholder:!1,escChar:"\\",eventsToHandle:["input","keyup","click","focus"],addDefaultPlaceholder:!0,allowInvalidValue:!1}).provider("uiMask.Config",function(){var e={};this.maskDefinitions=function(n){return e.maskDefinitions=n},this.clearOnBlur=function(n){return e.clearOnBlur=n},this.clearOnBlurPlaceholder=function(n){return e.clearOnBlurPlaceholder=n},this.eventsToHandle=function(n){return e.eventsToHandle=n},this.addDefaultPlaceholder=function(n){return e.addDefaultPlaceholder=n},this.allowInvalidValue=function(n){return e.allowInvalidValue=n},this.$get=["uiMaskConfig",function(n){var t=n;for(var a in e)angular.isObject(e[a])&&!angular.isArray(e[a])?angular.extend(t[a],e[a]):t[a]=e[a];return t}]}).directive("uiMask",["uiMask.Config",function(e){function n(e){return e===document.activeElement&&(!document.hasFocus||document.hasFocus())&&!!(e.type||e.href||~e.tabIndex)}return{priority:100,require:"ngModel",restrict:"A",compile:function(){var t=angular.copy(e);return function(e,a,r,i){function l(){try{return document.createEvent("TouchEvent"),!0}catch(e){return!1}}function u(e){return angular.isDefined(e)?(y(e),Z?(d(),v(),!0):h()):h()}function o(e){e&&(B=e,!Z||0===a.val().length&&angular.isDefined(r.placeholder)||a.val(b(m(a.val()))))}function c(){return u(r.uiMask)}function s(e){return Z?(H=m(e||""),_=p(H),i.$setValidity("mask",_),H.length&&(_||U.allowInvalidValue)?b(H):void 0):e}function f(e){return Z?(H=m(e||""),_=p(H),i.$viewValue=H.length?b(H):"",i.$setValidity("mask",_),_||U.allowInvalidValue?Q?i.$viewValue:H:void 0):e}function h(){return Z=!1,g(),angular.isDefined(W)?a.attr("placeholder",W):a.removeAttr("placeholder"),angular.isDefined(G)?a.attr("maxlength",G):a.removeAttr("maxlength"),a.val(i.$modelValue),i.$viewValue=i.$modelValue,!1}function d(){H=L=m(i.$modelValue||""),R=F=b(H),_=p(H),r.maxlength&&a.attr("maxlength",2*A[A.length-1]),!W&&U.addDefaultPlaceholder&&a.attr("placeholder",B);for(var e=i.$modelValue,n=i.$formatters.length;n--;)e=i.$formatters[n](e);i.$viewValue=e||"",i.$render()}function v(){q||(a.bind("blur",$),a.bind("mousedown mouseup",V),a.bind("keydown",O),a.bind(U.eventsToHandle.join(" "),D),q=!0)}function g(){q&&(a.unbind("blur",$),a.unbind("mousedown",V),a.unbind("mouseup",V),a.unbind("keydown",O),a.unbind("input",D),a.unbind("keyup",D),a.unbind("click",D),a.unbind("focus",D),q=!1)}function p(e){return e.length?e.length>=j:!0}function m(e){var n,t,r="",i=a[0],l=T.slice(),u=N,o=u+S(i),c="";return e=e.toString(),n=0,t=e.length-B.length,angular.forEach(I,function(a){var r=a.position;r>=u&&o>r||(r>=u&&(r+=t),e.substring(r,r+a.value.length)===a.value&&(c+=e.slice(n,r),n=r+a.value.length))}),e=c+e.slice(n),angular.forEach(e.split(""),function(e){l.length&&l[0].test(e)&&(r+=e,l.shift())}),r}function b(e){var n="",t=A.slice();return angular.forEach(B.split(""),function(a,r){e.length&&r===t[0]?(n+=e.charAt(0)||"_",e=e.substr(1),t.shift()):n+=a}),n}function k(e){var n,t=angular.isDefined(r.uiMaskPlaceholder)?r.uiMaskPlaceholder:r.placeholder;return angular.isDefined(t)&&t[e]?t[e]:(n=angular.isDefined(r.uiMaskPlaceholderChar)&&r.uiMaskPlaceholderChar?r.uiMaskPlaceholderChar:"_","space"===n.toLowerCase()?" ":n[0])}function w(){var e,n,t=B.split("");A&&!isNaN(A[0])&&angular.forEach(A,function(e){t[e]="_"}),e=t.join(""),n=e.replace(/[_]+/g,"_").split("_"),n=n.filter(function(e){return""!==e});var a=0;return n.map(function(n){var t=e.indexOf(n,a);return a=t+1,{value:n,position:t}})}function y(e){var n=0;if(A=[],T=[],B="",angular.isString(e)){j=0;var t=!1,a=0,r=e.split(""),i=!1;angular.forEach(r,function(e,r){i?(i=!1,B+=e,n++):U.escChar===e?i=!0:U.maskDefinitions[e]?(A.push(n),B+=k(r-a),T.push(U.maskDefinitions[e]),n++,t||j++,t=!1):"?"===e?(t=!0,a++):(B+=e,n++)})}A.push(A.slice().pop()+1),I=w(),Z=A.length>1?!0:!1}function $(){if((U.clearOnBlur||U.clearOnBlurPlaceholder&&0===H.length&&r.placeholder)&&(N=0,z=0,_&&0!==H.length||(R="",a.val(""),e.$apply(function(){i.$pristine||i.$setViewValue("")}))),H!==X){var n=a.val(),t=""===H&&n&&angular.isDefined(r.uiMaskPlaceholderChar)&&"space"===r.uiMaskPlaceholderChar;t&&a.val(""),E(a[0]),t&&a.val(n)}X=H}function E(e){var n;if(angular.isFunction(window.Event)&&!e.fireEvent)try{n=new Event("change",{view:window,bubbles:!0,cancelable:!1})}catch(t){n=document.createEvent("HTMLEvents"),n.initEvent("change",!1,!0)}finally{e.dispatchEvent(n)}else"createEvent"in document?(n=document.createEvent("HTMLEvents"),n.initEvent("change",!1,!0),e.dispatchEvent(n)):e.fireEvent&&e.fireEvent("onchange")}function V(e){"mousedown"===e.type?a.bind("mouseout",M):a.unbind("mouseout",M)}function M(){z=S(this),a.unbind("mouseout",M)}function O(e){var n=8===e.which,t=x(this)-1||0,r=90===e.which&&e.ctrlKey;if(n){for(;t>=0;){if(P(t)){C(this,t+1);break}t--}K=-1===t}r&&(a.val(""),e.preventDefault())}function D(n){n=n||{};var t=n.which,r=n.type;if(16!==t&&91!==t){var u,o=a.val(),c=F,s=!1,f=m(o),h=L,d=x(this)||0,v=N||0,g=d-v,p=A[0],w=A[f.length]||A.slice().shift(),y=z||0,$=S(this)>0,E=y>0,V=o.length>c.length||y&&o.length>c.length-y,M=o.length<c.length||y&&o.length===c.length-y,O=t>=37&&40>=t&&n.shiftKey,D=37===t,T=8===t||"keyup"!==r&&M&&-1===g,I=46===t||"keyup"!==r&&M&&0===g&&!E,j=(D||T||"click"===r)&&d>p;if(z=S(this),!O&&(!$||"click"!==r&&"keyup"!==r&&"focus"!==r)){if(T&&K)return a.val(B),e.$apply(function(){i.$setViewValue("")}),void C(this,v);if("input"===r&&M&&!E&&f===h){for(;T&&d>p&&!P(d);)d--;for(;I&&w>d&&-1===A.indexOf(d);)d++;var H=A.indexOf(d);f=f.substring(0,H)+f.substring(H+1),f!==h&&(s=!0)}for(u=b(f),F=u,L=f,!s&&o.length>u.length&&(s=!0),a.val(u),s&&e.$apply(function(){i.$setViewValue(u)}),V&&p>=d&&(d=p+1),j&&d--,d=d>w?w:p>d?p:d;!P(d)&&d>p&&w>d;)d+=j?-1:1;if((j&&w>d||V&&!P(v))&&d++,N=d,l()&&!T&&d<f.length){for(var R=f.length;R<u.length&&(!P(R)||k[R]!==u[R]);)R++;d=R}C(this,d)}}}function P(e){return A.indexOf(e)>-1}function x(e){if(!e)return 0;if(void 0!==e.selectionStart)return e.selectionStart;if(document.selection&&n(a[0])){e.focus();var t=document.selection.createRange();return t.moveStart("character",e.value?-e.value.length:0),t.text.length}return 0}function C(e,t){if(!e)return 0;if(0!==e.offsetWidth&&0!==e.offsetHeight)if(e.setSelectionRange)n(a[0])&&(e.focus(),e.setSelectionRange(t,t));else if(e.createTextRange){var r=e.createTextRange();r.collapse(!0),r.moveEnd("character",t),r.moveStart("character",t),r.select()}}function S(e){return e?void 0!==e.selectionStart?e.selectionEnd-e.selectionStart:window.getSelection?window.getSelection().toString().length:document.selection?document.selection.createRange().text.length:0:0}var A,T,B,I,j,H,R,_,F,L,N,z,K,Z=!1,q=!1,W=r.placeholder,G=r.maxlength,J=i.$isEmpty;i.$isEmpty=function(e){return J(Z?m(e||""):e)};var Q=!1;r.$observe("modelViewValue",function(e){"true"===e&&(Q=!0)}),r.$observe("allowInvalidValue",function(e){U.allowInvalidValue=""===e?!0:!!e,s(i.$modelValue)});var U={};r.uiOptions?(U=e.$eval("["+r.uiOptions+"]"),U=angular.isObject(U[0])?function(e,n){for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(void 0===n[t]?n[t]=angular.copy(e[t]):angular.isObject(n[t])&&!angular.isArray(n[t])&&(n[t]=angular.extend({},e[t],n[t])));return n}(t,U[0]):t):U=t,r.$observe("uiMask",u),angular.isDefined(r.uiMaskPlaceholder)?r.$observe("uiMaskPlaceholder",o):r.$observe("placeholder",o),angular.isDefined(r.uiMaskPlaceholderChar)&&r.$observe("uiMaskPlaceholderChar",c),i.$formatters.unshift(s),i.$parsers.unshift(f);var X=a.val();a.bind("mousedown mouseup",V),Array.prototype.indexOf||(Array.prototype.indexOf=function(e){if(null===this)throw new TypeError;var n=Object(this),t=n.length>>>0;if(0===t)return-1;var a=0;if(arguments.length>1&&(a=Number(arguments[1]),a!==a?a=0:0!==a&&a!==1/0&&a!==-(1/0)&&(a=(a>0||-1)*Math.floor(Math.abs(a)))),a>=t)return-1;for(var r=a>=0?a:Math.max(t-Math.abs(a),0);t>r;r++)if(r in n&&n[r]===e)return r;return-1})}}}}])}();
},{}]},{},[1]);
})();

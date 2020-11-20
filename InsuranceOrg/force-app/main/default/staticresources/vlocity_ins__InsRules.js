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
angular.module('insDirectives', ['sldsangular']);

// Directives
require('./modules/insDirectives/directive/InsDropdownHandler.js');
require('./modules/insDirectives/directive/InsInclude.js');
},{"./modules/insDirectives/directive/InsDropdownHandler.js":3,"./modules/insDirectives/directive/InsInclude.js":4}],2:[function(require,module,exports){
var insRulesModule = angular.module('insRules', ['insDirectives', 'sldsangular', 'ngSanitize']);
// Not all the directives in this module need 'viaExpressionEngine', and so don't want to force
// those using this module to also add the VlocityExpressionEngine.resource to their page.
// Checking to see if it exists on the page first before adding it as a module dependency:
if (angular.element('script[src*="VlocityExpressionEngine"]').length) {
    insRulesModule.requires.push('viaExpressionEngine');
}
if (angular.element('script[src*="MonacoEditor"]').length) {
    insRulesModule.requires.push('monacoEditor');
}
if (angular.element('script[src*="CardFramework"]').length || angular.element('script[src*="cardframework"]').length) {
    insRulesModule.requires.push('CardFramework');
    insRulesModule.run(['$rootScope', 'userProfileService', 'dataService', function($rootScope, userProfileService, dataService) {
        'use strict';
        userProfileService.getUserProfile().then(function(user){
            $rootScope.customLabels = {};
            const translationKeys = ['InsQuotesCovered', 'InsQuotesNotCovered', 'InsQuotesExpandAll', 'InsQuotesCollapseAll', 'InsButtonShowMore', 'Update', 'Selected','InsProductAddRule', 'InsProductNoRulesDefined', 'InsProductAddRuleLink', 'InsButtonCancel', 'InsProductConfirmDelete',
                'InsProductDeleteRuleMessage', 'InsProductDeleteRule', 'InsProductMessageTextRequired', 'InsProductMessage', 'InsProductDeleteRule', 'InsProductMessageTypeRequired',
                'InsProductMessageType', 'InsProductValueRequired', 'InsProductValueToSet', 'InsProductTypeRequired', 'InsAssetTransactionsType', 'InsProductHideJSON', 'InsProductMessage',
                'InsProductSetValue', 'InsProductInformation', 'InsProductExpression', 'InsProductExpression', 'InsProductSetDefaultValue', 'InsProductWarning', 'InsProductError', 'InsProductRecommendation', 'Delete'];
            let userLanguage = user.language.replace("_", "-") || user.language;
            dataService.fetchCustomLabels(translationKeys, userLanguage).then(
                function(translatedLabels) {
                    $rootScope.customLabels = translatedLabels;
                }
            );
        })
    }])
}

insRulesModule.config(['remoteActionsProvider', function(remoteActionsProvider) {
    'use strict';
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}]).config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(true);
}]).config(['$sldsDatePickerProvider', function($sldsDatePickerProvider) {
    'use strict';
    angular.extend($sldsDatePickerProvider.defaults, {
        placement: 'bottom-right',
        dateType: 'iso',
        modelDateFormat: 'yyyy-MM-ddTHH:mm:ss.sssZ'
    });
}]).config(['$sldsTimePickerProvider', function($sldsTimePickerProvider) {
    'use strict';
    angular.extend($sldsTimePickerProvider.defaults, {
        placement: 'bottom-right',
        timeType: 'iso',
        modelTimeFormat: 'yyyy-MM-ddTHH:mm:ss.sssZ'
    });
}]).run(['$rootScope', function($rootScope) {
    'use strict';
    $rootScope.nsPrefix = fileNsPrefix();
    $rootScope.isLoaded = false;
}]).run(['$templateCache', function($templateCache) {
    $templateCache.put("expression-engine-element-name.tpl.html",
        "<div class=\"via-slds vlocity\">"+
        "<ul class=\"typeahead dropdown-menu\" style=\"position: static; top: auto; left: auto; display: block;   float: none;\">"+
            "<li mentio-menu-item=\"item\" ng-repeat=\"item in items\">"+
                "<a class=\"text-primary\" ng-bind-html=\"item.label | mentioHighlight:typedTerm:'menu-highlighted' | unsafe\"></a>" +
            "</li>" +
        "</ul></div>");
}]);

// Dependencies
require('./InsDirectives.js');

// Directives
require('./modules/insRules/directive/InsRulesDefinitionDirective.js');
require('./modules/insRules/directive/InsRulesEvaluationDirective.js');
require('./modules/insRules/directive/InsRulesAttributesDisplayDirective.js');
require('./modules/insRules/directive/InsRulesCheckElement.js');
require('./modules/insRules/directive/InsRulesCalcHeight.js');

// Factory
require('./modules/insRules/factory/InsRulesValidationService.js');
require('./modules/insRules/factory/InsRulesDefinitionService.js');
require('./modules/insRules/factory/InsRulesEvaluationService.js');

// Templates
require('./modules/insRules/templates/templates.js');

},{"./InsDirectives.js":1,"./modules/insRules/directive/InsRulesAttributesDisplayDirective.js":5,"./modules/insRules/directive/InsRulesCalcHeight.js":6,"./modules/insRules/directive/InsRulesCheckElement.js":7,"./modules/insRules/directive/InsRulesDefinitionDirective.js":8,"./modules/insRules/directive/InsRulesEvaluationDirective.js":9,"./modules/insRules/factory/InsRulesDefinitionService.js":10,"./modules/insRules/factory/InsRulesEvaluationService.js":11,"./modules/insRules/factory/InsRulesValidationService.js":12,"./modules/insRules/templates/templates.js":13}],3:[function(require,module,exports){
angular.module('insDirectives').directive('insDropdownHandler', function($document) {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var focused = false;
            var initial = false;
            var elementEvents = attrs.useFocus === 'true' || attrs.useFocus === undefined ? 'click focus' : 'click';
            var onClick = function (event) {
                var isChild = element.has(event.target).length > 0;
                var isSelf = element[0] == event.target;
                var isInside = isChild || isSelf;
                var className = event.target.className;
                if (event.target.parentElement) {
                    className = className + ' ' + event.target.parentElement.className;
                }
                if (initial) {
                    initial = false;
                    return;
                }
                if (event.target.nodeName === 'path') {
                    className = event.target.parentElement.parentElement.className;
                } else if (event.target.nodeName === 'svg') {
                    className = event.target.parentElement.className;
                }
                if ((!isInside && className.indexOf(attrs.restrictElement) < 0) || (isInside && className.indexOf(attrs.restrictElement) < 0 && !attrs.hasOwnProperty('ngClick'))) {
                    scope.$apply(attrs.insDropdownHandler);
                    $document.off('click', onClick);
                    focused = false;
                }
            };
            element.on(elementEvents, function(event) {
                if (!focused) {
                    scope.$apply(attrs.insDropdownHandler);
                    $document.on('click', onClick);
                    focused = true;
                    initial = true;
                }
            });
        }
    };
});

},{}],4:[function(require,module,exports){
angular.module('insDirectives').directive('insInclude', function() {
    'use strict';
    // This directive will act like ng-include,
    // but not create a new scope for the template
    // Use: <div ins-include="my-template-name-here"></div>
    return {
        restrict: 'A',
        templateUrl: function(element, attrs) {
            return attrs.insInclude;
        }
    };
});

},{}],5:[function(require,module,exports){
angular.module('insRules').directive('insRulesAttributes', ['$timeout', 'InsRulesEvaluationService', '$rootScope', 'dataService', 'userProfileService', function($timeout, InsRulesEvaluationService, $rootScope, dataService, userProfileService) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            productData: '=',
            updateMethod: '&?',
            hideHeader: '&?',
            oneProduct: '=?',
            hideControls: '&?',
            subgroups: '=?',
            tempUrl: '=?',
            readonly: '=?'
        },
        link: function($scope, $element, $attrs) {
            console.log('temp', $scope.tempUrl);

            //Fire Event for Large Group
            /*
            * @param {Object} product
            * @param {Object} attribute
            */
            $scope.updateQLI = function(product, attribute) {
                const data = {
                    product: product,
                    attribute: attribute
                };
                console.log('fire-onsave-event', data);
                $rootScope.$broadcast('fire-onsave-event', data);
            };

            //if subgroup list passed to directive - parse all attribute categories and make a map
            $scope.setSubGroups = function() {
                const product = $scope.productData[0];
                if (!$scope.subgroupMap) {
                    $scope.subgroupMap = {};
                    for (let i = 0; i < $scope.subgroups.length; i++) {
                        $scope.subgroupMap[$scope.subgroups[i]] = {};
                    }
                    $scope.switchMap = {};
                }
                console.log($scope.subgroups);
                for (let i = 0; i < product.attributeCategories.records.length; i++) {
                    const category = product.attributeCategories.records[i];
                    $scope.switchMap[category.id] = {};
                    for (let j = 0; j < category.productAttributes.records.length; j++) {
                        const attr = category.productAttributes.records[j];
                        let key = attr.attributeGroupType || 'Other';
                        if (attr.code.indexOf('_covered') > -1) {
                            $scope.switchMap[category.id][key] = attr;
                        } else {
                            if (!$scope.subgroupMap[key]) {
                                key = 'Other'; // key not in subgroup list, put in other column
                            }
                            if (!$scope.subgroupMap[key][category.id]) {
                                $scope.subgroupMap[key][category.id] = [];
                            }
                            $scope.subgroupMap[key][category.id].push(attr);
                        }
                    }
                }
                //Make sure labels have pairs ['In-Network' - 'Out-Of-Network'] or tripletes ['In-Network-2' - 'In-Network' - 'Out-Of-Network']
                for (let i = 0; i < product.attributeCategories.records.length; i++) {
                    const categoryId = product.attributeCategories.records[i].id;
                    let inNetworkArray, outNetworkArray, inNetworkArray2;
                    if ($scope.subgroupMap['In-Network']) {
                        inNetworkArray = $scope.subgroupMap['In-Network'][categoryId];
                    }
                    if ($scope.subgroupMap['Out-Of-Network']) {
                        outNetworkArray = $scope.subgroupMap['Out-Of-Network'][categoryId];
                    }
                    if ($scope.subgroupMap['In-Network-2']) {
                        inNetworkArray2 = $scope.subgroupMap['In-Network-2'][categoryId];
                    }
                    $scope.syncAttributeArrays(inNetworkArray, outNetworkArray, true); //make sure there is a corresponding attr in out of network array with same label
                    $scope.syncAttributeArrays(outNetworkArray, inNetworkArray, false); //do the same for in network array
                    //if Preferred Network do the same:
                    if (inNetworkArray2) {
                        $scope.syncAttributeArrays(inNetworkArray2, inNetworkArray, true);
                        $scope.syncAttributeArrays(inNetworkArray2, outNetworkArray, true);
                        $scope.syncAttributeArrays(inNetworkArray, inNetworkArray2, false); //don't need ot do for outofnetwork since they are already the same
                    }
                }
                console.log($scope.switchMap); //Map for switches
                console.log($scope.subgroupMap); //Map for subgroup columns
            };

            //Function to ensure all network columns have the same amount of rows
            /*
            * @param {Array} list1
            * @param {Array} list2
            * @param {Boolean} hideLabel flag -  to hide label for attr  - require outNetwork to be last col
            */
            $scope.syncAttributeArrays = function(list1, list2, hideLabel) { //pass in hidelabel as parameter - if putting attribute into out of network makesure label is hidden
                if (list1) {
                    for (let j = 0; j < list1.length; j++) { //check to make sure for attr for list 1 has a label in list 2
                        let label = list1[j].label;
                        let labelPairing = false;
                        if (list2) {
                            for (let k = 0; k < list2.length; k++) {
                                if (list2[k].label === label) {
                                    labelPairing = true; //set to true if a match
                                }
                                list2[k].hideLabel = hideLabel;
                            }
                        }
                        if (!labelPairing && list2) {
                            list2.push(
                                {label: label,
                                    hideLabel: hideLabel,
                                    visibility: 'hidden',
                                    description: 'this is a dummy attribute to provide a pairing for an attribute - UI only, do not save'
                                }
                            );
                        }
                    }
                }
            };

            //On load: if subgorups, init subgroup maps
            if ($scope.subgroups) {
                $scope.setSubGroups();
            }

            $rootScope.$on('vloc-ins-expand-all', function(e, data) {
                for(let i = 0; i < data.length; i++){
                    if(data[i].attributeCategories && (data[i].productId === $scope.categoryAccordion.productId)) {
                        $scope.categoryAccordion.expandAll(data[i].attributeCategories.records);
                    }
                }
            });

            $rootScope.$on('vloc-ins-collapse-all', function(e, data) {
                for(let i = 0; i < data.length; i++){
                    if(data[i].attributeCategories && (data[i].productId === $scope.categoryAccordion.productId)) {
                        $scope.categoryAccordion.collapseAll(data[i].attributeCategories.records);
                    }
                }
            });


            $scope.categoryAccordion = {
                activePanels: [],
                expandAll: function(categories) {
                    var self = this;
                    angular.forEach(categories, function(category, i) {
                        if (i === 0) {
                            self.activePanels = [];
                        }
                        self.activePanels.push(i);
                        $scope.decideOverflowClass(category, i);
                    });
                },
                collapseAll: function(categories) {
                    this.activePanels = [];
                    angular.forEach(categories, function(category, i) {
                        $scope.decideOverflowClass(category, i);
                    });
                }
            };

            //expandAllOnLoad called in ng-init in 'ins-rule-attributes-template-subgroups'
            //sets all accordions to expand on load
            $scope.expandAllOnLoad = function(records){
                $timeout(function() {
                    $scope.categoryAccordion.expandAll(records);
                }, 400);
            }

            $scope.decideOverflowClass = function(category, index) {
                if ($scope.categoryAccordion.activePanels.indexOf(index) > -1) {
                    $timeout(function() {
                        category.overflowUnset = true;
                    }, 400);
                } else {
                    category.overflowUnset = false;
                }
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

            /* Only for multiselect dropdowns - toggle value, invoke rules bc change is nested in userValues, won't trigger watch
            * @params {Object} attribute
            * @params {Object} value dropdown value
            * @params {Boolean} ruleSetValue flag if value was set by a rule
            * @params {Object} product need product for save
            */
            $scope.toggleValue = function(attribute, value, ruleSetValue, product) {
                if (ruleSetValue) {
                    return;
                }
                if (attribute.multiselect && attribute.inputType === 'checkbox') {
                    //multipicklist checkbox -- value toggled on ng-model
                } else {
                    if (attribute.userValues.indexOf(value.value) > -1) {
                        attribute.userValues.splice(attribute.userValues.indexOf(value.value), 1);
                    } else {
                        attribute.userValues.push(value.value);
                    }
                    $scope.countSelected(attribute);
                }
                InsRulesEvaluationService.invokeAttributeRules(attribute, product); //manually invokes rules
            };

            $scope.processedProductData = $scope.productData;
        },
        templateUrl: function(elem, attrs) {
           return attrs.tempUrl || 'ins-rules-attributes-template.tpl.html';
       }
    };
}]);

},{}],6:[function(require,module,exports){
angular.module('insRules').directive('insRulesCalcHeight', ['$timeout', function($timeout) {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var watchElementsClassNames = [
                '.slds-checkbox',
                '.slds-radio',
                '.via-ins-attributes-attribute-messages-message'
            ];
            scope.$watch(
                // This function is returns the value that is watched in the next function.
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
                    var containerHeight = 4;
                    if (newValue !== oldValue || !attrs.style) {
                        $timeout(function() {
                            angular.forEach(element[0].children, function(child) {
                                containerHeight += $(child).outerHeight(true);
                            });
                            containerHeight = containerHeight + 'px';
                            $(element[0]).css({height: containerHeight});
                        });
                    }
                }
            );
        }
    };
}]);
},{}],7:[function(require,module,exports){
angular.module('insRules').directive('insRulesCheckElement', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    'use strict';
    return {
        restrict: 'A',
        scope: {
            insRulesCheckElement: '=',
            checkProduct: '=',
            ngInit: '&?'
        },
        link: function(scope, element, attrs) {
            scope.productId = scope.checkProduct.Id || scope.checkProduct.productId || scope.checkProduct['Product2.Id'].value;
            if (!$rootScope.checkElementLastProductId || ($rootScope.checkElementLastProductId && $rootScope.checkElementLastProductId !== scope.productId)) {
                $rootScope.checkElementLastProductId = angular.copy(scope.productId);
                scope.insRulesCheckElement = [];
            }
            $rootScope.checkElementLastProductId = angular.copy(scope.productId);
            $timeout(function() {
                if (element[0].className.indexOf('ng-hide') < 0 && !scope.insRulesCheckElement.length) {
                    if(!scope.insRulesCheckElement.length) {
                        scope.insRulesCheckElement = [];
                    }
                    scope.insRulesCheckElement.push(parseInt(attrs.categoryIndex));
                    $(element).addClass('in');
                    if (scope.ngInit) {
                        scope.ngInit();
                    }
                }
            });
        }
    };
}]);
},{}],8:[function(require,module,exports){
angular.module('insRules').directive('insRules', ['$rootScope', '$timeout', 'InsRulesDefinitionService', 'InsRulesValidationService', 'dataService', '$window', 'userProfileService', function($rootScope, $timeout, InsRulesDefinitionService, InsRulesValidationService, dataService, $window, userProfileService) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            rules: '=',
            productId: '=',
            rulesOptions: '=',
            attributeNames: '=?',
            valueRules: '@?'
        },
        templateUrl: 'ins-rules-template.tpl.html',
        link: function($scope, $element, $attrs) {

            // While using viaExpressionEngine from OUI, we need to convert the UI to look like SLDS instead of bootstrap until they upgrade their templates
            $scope.resetUIToSlds = function(scrollToBottom) {
                $timeout(function() {
                    var modalEl = $('.vloc-modal-container .vloc-modal-content');
                    $('.simpleExpressionBuilder:not(.already-upgraded-to-slds)').addClass('slds-box slds-theme_shade slds-m-vertical_small');
                    $('.simpleExpressionBuilder:not(.already-upgraded-to-slds) > .col-xs-6 + .col-xs-3').addClass('slds-form-element slds-medium-size_2-of-8 slds-p-right_small slds-m-bottom_xx-small vloc-ins-rule-insert-operator');
                    $('.simpleExpressionBuilder:not(.already-upgraded-to-slds) > .col-xs-3.slds-form-element').prepend('<label class="slds-form-element__label">'+$rootScope.vlocity.getCustomLabel('InsProductInsertOperator', 'Insert Operator')+'</label>');
                    $('.simpleExpressionBuilder:not(.already-upgraded-to-slds) select[ng-model="selectedOperator"]').addClass('slds-select vloc-operater-picker-select');
                    $('.simpleExpressionBuilder:not(.already-upgraded-to-slds) select[ng-model="selectedOperator"]').wrap(
                        '<div class="slds-form-element__control">' +
                            '<div class="slds-select_container vloc-operater-picker_container"></div>' +
                        '</div>'
                    );
                    $('.simpleExpressionBuilder:not(.already-upgraded-to-slds) > .col-xs-9').addClass('slds-form-element slds-m-bottom_xx-small');
                    $('.simpleExpressionBuilder:not(.already-upgraded-to-slds) > .col-xs-9 > textarea').addClass('slds-textarea').attr('mentio-id', '\'tempExpression\' + $index').wrap(
                        '<div class="slds-form-element__control"></div>'
                    );
                    $('<label class="slds-form-element__label">'+$rootScope.vlocity.getCustomLabel('InsProductCondition', 'Condition')+'</label>').insertBefore('.simpleExpressionBuilder:not(.already-upgraded-to-slds) .slds-textarea');
                    $('.simpleExpressionBuilder:not(.already-upgraded-to-slds) > .col-xs-9 + .col-xs-3').addClass('slds-form-element');

                    $('.simpleExpressionBuilder:not(.already-upgraded-to-slds) > .col-xs-3.slds-form-element:not(.vloc-ins-rule-insert-operator) > .form-control').addClass('slds-select slds-p-around_x-small slds-size_1-of-3 vloc-ins-rule-insert-functions').wrap(
                        '<div class="slds-form-element__control"></div>'
                    );
                    $('<label class="slds-form-element__label vloc-ins-rule-insert-functions">'+$rootScope.vlocity.getCustomLabel('InsProductFunctions', 'Functions')+'</label>').insertBefore('.simpleExpressionBuilder:not(.already-upgraded-to-slds) > .col-xs-3.slds-form-element:not(.vloc-ins-rule-insert-operator)');

                    if (scrollToBottom && modalEl.length) {
                        modalEl[0].scrollTop = modalEl[0].scrollHeight;
                    }
                    $('.simpleExpressionBuilder').addClass('already-upgraded-to-slds');
                });
            }

          $scope.getRuleOptionsTranslations = function() {
              for (var i = 0; i < $scope.rulesOptions.ruleTypes.length; i++) {
                  var ruleType = $scope.rulesOptions.ruleTypes[i];
                  var translationKey = ruleType.translationKey;
                  if(typeof ruleType === 'object') {
                    ruleType.label = $rootScope.customLabels[translationKey] || ruleType.label;
                  }
              }

              for (var i = 0; i < $scope.rulesOptions.messageTypes.length; i++) {
                  var messageType = $scope.rulesOptions.messageTypes[i];
                  var translationKey = messageType.translationKey;
                  messageType.label = $rootScope.customLabels[translationKey] || ruleType.label;
              }
          }


           // If ruleSourceType does NOT equal root productRecordType, rule is disabled
          $scope.isRuleDisabled = function(ruleSourceType) {
            return !(ruleSourceType === $rootScope.productRecordType);
          }

          $scope.rulesOptions = {
              ruleTypes: [
                  {
                    name: 'Hide',
                    label: 'Hide',
                    translationKey: 'InsProductHideJSON'
                  },
                  {
                    name: 'Message',
                    label: 'Message',
                    translationKey: 'InsProductMessage'
                  },
                  {
                    name: 'Set Value',
                    label: 'Set value',
                    translationKey: 'InsProductSetValue'
                  },
                  {
                    name: 'Set Default Value',
                    label: 'Set Default Value',
                    translationKey: 'InsProductSetDefaultValue'
                  }
              ],
              messageTypes: [{
                  code: 'INFO',
                  label: 'Information',
                  translationKey: 'InsProductInformation'
              }, {
                  code: 'WARN',
                  label: 'Warning',
                  translationKey: 'InsProductWarning'
              }, {
                  code: 'ERROR',
                  label: 'Error',
                  translationKey: 'InsProductError'
              }, {
                  code: 'RECOMMENDATION',
                  label: 'Recommendation',
                  translationKey: 'InsProductRecommendation'
              }]
          };


            $scope.insRulesValidationService = InsRulesValidationService;
            $scope.insRulesDefinitionService = InsRulesDefinitionService;
            if (!$scope.rules || $scope.rules.constructor !== Array) {
                $scope.rules = [];
            } else {
                angular.forEach($scope.rules, function(rule) {
                    if (rule.messageType.constructor !== Object) {
                        rule.messageType = {};
                    }
                });
            }
            if (!$scope.rulesOptions || angular.equals($scope.rulesOptions, {})) {
              $scope.rulesOptions = {
                  ruleTypes: [
                      {
                        name: 'Hide',
                        label: 'Hide',
                        translationKey: 'InsProductHideJSON'
                      },
                      {
                        name: 'Message',
                        label: 'Message',
                        translationKey: 'InsProductMessage'
                      },
                      {
                        name: 'Set Value',
                        label: 'Set value',
                        translationKey: 'InsProductSetValue'
                      },
                      {
                        name: 'Set Default Value',
                        label: 'Set Default Value',
                        translationKey: 'InsProductSetDefaultValue'
                      }
                  ],
                  messageTypes: [{
                      code: 'INFO',
                      label: 'Information',
                      translationKey: 'InsProductInformation'
                  }, {
                      code: 'WARN',
                      label: 'Warning',
                      translationKey: 'InsProductWarning'
                  }, {
                      code: 'ERROR',
                      label: 'Error',
                      translationKey: 'InsProductError'
                  }, {
                      code: 'RECOMMENDATION',
                      label: 'Recommendation',
                      translationKey: 'InsProductRecommendation'
                  }]
              };
            }
            if ($scope.valueRules === 'true') {
                $scope.rulesOptions.ruleTypes = [
                    {
                      name: 'Hide',
                      label: 'Hide',
                      translationKey: 'InsProductHideJSON'
                    }
                ];
            }
            // Need to check width of the container to style responsively rather than using CSS
            // media queries because this directive may be placed in a smaller width container
            // which will not trigger width-based media queries
            $scope.containerWidth = $element.outerWidth();
            $scope.smallWidthBP = 650;
            if ($scope.containerWidth < $scope.smallWidthBP) {
                $element.addClass('small-width-container');
            }
            // OUI stores the available expressions in the vlocity window object. %Element Name% only makes
            // sense in the scope of OmniScript, so we're getting rid of that and replacing it with
            // %ProductCode.AttributeCode%
            if (vlocity && vlocity.expressionEngine && vlocity.expressionEngine.availableExpressions && vlocity.expressionEngine.availableExpressions.indexOf('%Element Name%') > -1) {
                vlocity.expressionEngine.availableExpressions.splice(vlocity.expressionEngine.availableExpressions.indexOf('%Element Name%'), 1);
                vlocity.expressionEngine.availableExpressions.unshift('%ProductCode.AttributeCode.SplitCode%');
            }

            $timeout(function() {
                $rootScope.showMonacoEditor = true;
                $scope.resetUIToSlds();
            }, 1000);


            if (!$scope.attributeNames && !$rootScope.typeaheadAttributeNames) {
                $scope.insRulesDefinitionService.getTypeAheadAttributes($scope, $scope.productId).then(function(result) {
                    console.log('result', result);
                    if (result.typeAheadMaps) {
                        $scope.insRulesDefinitionService.formatTypeAheadArray(result.typeAheadMaps).then(function(result2) {
                            $rootScope.typeaheadAttributeNames = result2;
                            $scope.attributeNames = $rootScope.typeaheadAttributeNames;
                            $scope.resetUIToSlds();
                        }, function(error) {
                            console.log('There has been an error in InsRulesDefinitionService.formatTypeAheadArray', error);
                            $scope.resetUIToSlds();
                        });
                    } else {
                        $scope.resetUIToSlds();
                    }
                }, function(error) {
                    console.log('There has been an error in InsRulesDefinitionService.getTypeAheadAttributes', error);
                    $scope.resetUIToSlds();
                });
            } else if (!$scope.attributeNames && $rootScope.typeaheadAttributeNames) {
                $scope.attributeNames = $rootScope.typeaheadAttributeNames;
                $scope.resetUIToSlds();
            }

            $scope.addRule = function() {
                let isError;
                for(let i = 0; i < $scope.rules.length; i++){
                    isError = !$scope.rules[i].validation.ruleType || !$scope.rules[i].validation.messageText ||!$scope.rules[i].validation.messageType
                        || !$scope.rules[i].validation.valueExpression;

                }
                if(!isError){
                    const ruleObj = {
                        ruleType: '',
                        messageType: {},
                        expression: '',
                        messageText: '',
                        newRule: true,
                        sourceType: $rootScope.productRecordType
                    };
                    $scope.rules.push(ruleObj);
                    $timeout(function() {
                        delete $scope.rules[$scope.rules.length - 1].newRule;
                        $scope.resetUIToSlds(true);
                    }, 100);
                }
                console.log($scope.rules);
            };

            $scope.deletePrompt = function(rule) {
                if (!rule.inDelete) {
                    angular.forEach($scope.rules, function(rule) {
                        rule.inDelete = false;
                    });
                }
                rule.inDelete = !rule.inDelete;
            };

            $scope.switchTypeAheadData = function(newData, index) {
                if (!$window.additionalCompletionItems || typeof $window.additionalCompletionItems !== 'object') {
                    $window.additionalCompletionItems = {
                        Keyword: [],
                        Function: []
                    };
                }
                $window.additionalCompletionItems.Keyword = angular.copy($scope.attributeNames);
            };

            $scope.deleteRule = function(rule, index) {
                rule.inDelete = !rule.inDelete;
                $timeout(function() {
                    rule.isDeleted = true;
                }, 250);
                $timeout(function() {
                    rule.isDeleted = false;
                    $scope.rules.splice(index, 1);
                    console.log($scope.rules);
                }, 900);
            };
        }
    };
}]);

},{}],9:[function(require,module,exports){
angular.module('insRules').directive('insRulesEvaluate', ['$rootScope', 'InsRulesEvaluationService', '$timeout', function($rootScope, InsRulesEvaluationService, $timeout) {
    'use strict';
    return {
        restrict: 'A',
        scope: {
            evalAttribute: '=insRulesEvaluate',
            evalProduct: '=insRulesProduct',
            evalCoverage: '=insRulesCoverage'
        },
        require: '?ngModel',
        link: function(scope, $element, $attrs, $ngModel) {
            if ($ngModel && scope.evalAttribute.inputType !== 'range') {
                $ngModel.$options.$$options.debounce = {
                    default: 500,
                    blur: 0
                };
            }

            /* STEP BY STEP:

            Rules can belong on attribute level:  //keep track of these "attribute rules" in $rootScope.rulesMap
            attrA: {
                productCode: UNINSURED_PD,
                attributeCode: 3000,
                userValues: 10,
                rules: [
                {   actions: {Set Value: {…}}
                    expression: "%UNINSURED_PD_COVERAGE.2123% > 50"
                    ruleEvaluation: true
                    ruleType: "Set Value"
                    valueExpression: "%UNINSURED_PD_COVERAGE.2123% + %UNINSURED_PD_COVERAGE.12343%"}, //Keep track of these "value expressions" in $rootScope.valueExpressionMap
                ]
            }

            OR a rule can belong to a dropdown attribute's value //keep track of these "value rules" in  $rootScope.dropdownValueRulesMap

            attrA: {
                productCode: UNINSURED_PD,
                attributeCode: 3000,
                userValues: 100,
                values: [
                    disabled: false
                    hiddenByRule: true
                    id: "1"
                    label: "2"
                    readonly: false
                    value: "2"
                    rules: [{
                        expression: "%UNINSURED_PD_COVERAGE.2123% > 0"
                        ruleEvaluation: true
                        ruleType: "Hide"}, ...
                    ]
            }
                from the attributes above we will watch:
                UNINSURED_PD_COVERAGE.2123 and UNINSURED_PD_COVERAGE.12343 because they effect either the rules expression or it's value expression
                The rule "owner" is attribute A who we will reference by UNINSURED_PD.3000 (productCode.attributeCode)

                the following maps will be made:

                rulesMap: {
                    UNINSURED_PD_COVERAGE.2123: [//This is the only attribute that effects a attribute level rule's expression
                        {   expression: "%UNINSURED_PD_COVERAGE.2123% > 50"
                            ruleEvaluation: true
                            ruleType: "Set Value"
                            ownsRule:  UNINSURED_PD.3000,
                            valueExpression: "%UNINSURED_PD_COVERAGE.2123% + %UNINSURED_PD_COVERAGE.12343%"}, //Keep track of these "value expressions" in $rootScope.valueExpressionMap
                            instanceExpression: (3) ["", "UNINSURED_PD_COVERAGE.2123", " > 50"]
                            instanceValueExpression: (5) ["", "UNINSURED_PD_COVERAGE.2123", " + ", "UNINSURED_PD_COVERAGE.12343", ""]
                        }
                    ]
                }

                 valueExpressionMap: {
                    UNINSURED_PD_COVERAGE.12343: [ //this is the only attribute that effects a rule's vale expression
                        {expression: "%UNINSURED_PD_COVERAGE.2123% > 50"
                         ruleEvaluation: true
                         ruleType: "Set Value",
                         ownsRule:  UNINSURED_PD.3000,
                         valueExpression: "%UNINSURED_PD_COVERAGE.2123% + %UNINSURED_PD_COVERAGE.12343%"}, //Keep track of these "value expressions" in $rootScope.valueExpressionMap
                         instanceExpression: ["", "UNINSURED_PD_COVERAGE.2123", " > 50"]
                         instanceValueExpression: ["", "UNINSURED_PD_COVERAGE.2123", " + ", "UNINSURED_PD_COVERAGE.12343", ""]
                        }
                    ]
                 }

                dropdownValueRulesMap: {
                    UNINSURED_PD_COVERAGE.2123: [
                        {expression: "%UNINSURED_PD_COVERAGE.2123% > 0"
                        ruleEvaluation: true
                        ruleType: "Hide",
                        ownsRule:  UNINSURED_PD.3000,
                        instanceExpression: (3) ["", "UNINSURED_PD_COVERAGE.2123", " > 0"]
                        }
                    ]
                }

                attrsMap: { //map of all the attributes
                     UNINSURED_PD_COVERAGE.2123: {userValues: 70, ...},
                     UNINSURED_PD.3000: {userValues: 100, ...},
                     UNINSURED_PD.12343: {userValues: 30, ...}
                }

                Set value expression example:

                    rule:
                      {expression: "%UNINSURED_PD_COVERAGE.2123% > 50"
                         ruleEvaluation: true
                         ruleType: "Set Value",
                         ownsRule:  UNINSURED_PD.3000,
                         valueExpression: "%UNINSURED_PD_COVERAGE.2123% + %UNINSURED_PD_COVERAGE.12343%"}, //Keep track of these "value expressions" in $rootScope.valueExpressionMap
                         instanceExpression: ["", "UNINSURED_PD_COVERAGE.2123", " > 50"]
                         instanceValueExpression: ["", "UNINSURED_PD_COVERAGE.2123", " + ", "UNINSURED_PD_COVERAGE.12343", ""]
                        }

                    when we evaluate a rule expression - we take the instranceExpression:
                        ex:  instanceExpression: ["", "UNINSURED_PD_COVERAGE.2123", " > 50"]
                    we iterate through and replace with attrs[key]
                          so:
                          ["", attrsMap["UNINSURED_PD_COVERAGE.2123"].userValues, " > 50"]
                    which is:
                         70 > 50
                    this evaluates to true, we will set the owner of this rule which we get form attrMap:
                        attrsMap[UNINSURED_PD.3000].userValues = to the rule value expression
                    we call the same function to plug and evaluate value expression

                    //watch is called bc userValues has changed now we look for if
                    UNINSURED_PD.3000 has any rules in it's queue for rulesMap, valueExpressionMap, or dropdownValueRulesMap
                    it doesn't so we're done.
            */

            //rulesMap and valueExpressionMap are the same structure
            if (!$rootScope.rulesMap) { //instantiate all RootScope variables
                $rootScope.attrsMap = {}; //Master map of all attributes {'rulescode' : attr}
                $rootScope.rulesMap = {}; //map to keep track of rulecodes that invoke a rule {'Copay.1': [rule1, rule2]} if attribute Copay.1 changes we need ot re-eval rule1 and rule2
                // $rootScope.valueExpressionMap = {}; //map to keep track of rulecodes which rules depend on to set value - "valueExpression"
                $rootScope.dropdownValueRulesMap = {}; //map to keep track of rules for dropdown values
                $rootScope.backendSetValueMap = {}; //keep track of rules set by backend
            }
            scope.$watch('evalProduct', function(newValue, oldValue) {
                if (scope.evalProduct && scope.evalProduct.attributeCategories && scope.evalProduct.attributeCategories.records) { //flag if we've processed
                    for (let i = 0; i < scope.evalProduct.attributeCategories.records.length; i++) { //iterate throught attribute categories
                        let category = scope.evalProduct.attributeCategories.records[i];
                        if (category.productAttributes && category.productAttributes.records) { //iterate through product attributes
                            angular.forEach(category.productAttributes.records, function(attribute, k) { //for each attribute -
                                InsRulesEvaluationService.initAttribute(attribute, scope.evalProduct);
                                $rootScope.attrsMap[attribute.rulesCode] = attribute;
                                if(attribute.inputType === 'dropdown' && attribute.dataType === 'currency' && !attribute.multiselect){
                                    let isUserValueNumber = _.isNumber(attribute.userValues);
                                    let isDropdownValueNumber = _.isNumber(attribute.values[0].value);
                                    if(isUserValueNumber && !isDropdownValueNumber){ //if userValue is a number but dropdown values are text
                                        attribute.userValues = attribute.userValues.toString();
                                    }
                                }
                                if (attribute.values) {
                                    for (let i = 0; i < attribute.values.length; i++) {
                                        if (attribute.values[i].rules) {
                                            InsRulesEvaluationService.parseRules(attribute.values[i].rules, attribute, $rootScope.dropdownValueRulesMap, true);
                                        }
                                    }
                                }
                                if (attribute.hasRules && attribute.rules) {
                                    InsRulesEvaluationService.parseRules(attribute.rules, attribute, $rootScope.rulesMap, false);
                                }
                            });
                        }
                    }
                }
            });

            /* Watch all uservalues - if theres a change check if attribute effects rules -> evaluate those effected rules
             * Then broadcast save event
             * @param {Object} newValue userValues's new value
             * @param {Object} oldValue userValues's old value
             */

            scope.$watch('evalAttribute.userValues', function(newValue, oldValue) {
                if (newValue !== undefined) {
                    let onLoad = angular.equals(newValue, oldValue);
                    InsRulesEvaluationService.invokeAttributeRules(scope.evalAttribute, scope.evalProduct, scope.evalCoverage, onLoad);
                }
            });
        }
    };
}]);

},{}],10:[function(require,module,exports){
angular.module('insRules').factory('InsRulesDefinitionService', ['$rootScope', '$q', 'dataSourceService', '$window', function($rootScope, $q, dataSourceService, $window) {
    'use strict';
    return {
        getTypeAheadAttributes: function(scope, productId) {
            var deferred = $q.defer();
            var datasource = {};
            datasource.type = 'ApexRemote';
            datasource.value = {
                remoteNSPrefix: $rootScope.nsPrefix,
                remoteClass: 'InsuranceProductAdminHandler',
                remoteMethod: 'getTypeAheadAttributes',
                inputMap: {
                    productId: productId
                }
            };
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    deferred.resolve(data);
                },
                function(error) {
                    console.error(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        formatTypeAheadArray: function(typeAheadArray) {
            var deferred = $q.defer();
            var formattedArray = [];
            var keywordKind = 13;
            if ($window.monaco && $window.monaco.languages && $window.monaco.languages.CompletionItemKind.Keyword) {
                keywordKind = $window.monaco.languages.CompletionItemKind.Keyword;
            }
            if (!typeAheadArray) {
                deferred.reject('No data passed into function.');
            } else {
                angular.forEach(typeAheadArray, function(product) {
                    if (product.attributeList) {
                        angular.forEach(product.attributeList, function(attribute) {
                            let code = product.productCode + '.' + attribute.attributeCode;
                            if (attribute.splitCode) {
                                code = code + '.' + attribute.splitCode; 
                            }
                            formattedArray.push(
                                {   label: code,
                                    kind: keywordKind,
                                    insertText: {
                                        value: code
                                    }
                                }
                            );
                        });
                    }
                });
            }
            deferred.resolve(formattedArray);
            return deferred.promise;
        },
        // when a token is selected we need to append a '%' if there isn't one.
        onSelectMentioItem: function(item, elementSelector) {
            var valueExpressionElement = $(elementSelector)[0];
            var currentSelection = valueExpressionElement.value.substring(valueExpressionElement.selectionStart, valueExpressionElement.selectionEnd);
            var needsTrailingPercentage = (currentSelection.charAt(currentSelection.length - 1) === '%' ||
                (valueExpressionElement.value.length === valueExpressionElement.selectionEnd) ||
                valueExpressionElement.value.charAt(valueExpressionElement.selectionEnd) !== '%');
            return '%' + item.label + (needsTrailingPercentage ? '%' : '');
        }
    };
}]);
},{}],11:[function(require,module,exports){
/* jshint esversion: 6 */
angular.module('insRules').factory('InsRulesEvaluationService', ['$rootScope', '$q', function($rootScope, $q) {
    'use strict';
    //-----BELOW ARE ONLOAD RULE EVALUATION FUNCTIONS: SETS UP WATCHER MAP AND RULESCODES------
    /* 
    * Init Attribute : set Product Code, Rules Code 
    * format matches epxression format: 'productCode.AttrCode' or 'productCode.AttrCode.InstaceKey' (we will update expressions to include instance key)
    * @param {Object} attribute 
    * @param {Object} product 
    */
    function initAttribute(attribute, product){
        attribute.productCode = product.productCode || product.ProductCode || product['Product2.ProductCode'] && product['Product2.ProductCode'].value; //set parent product code for attribute
        attribute.rulesCode = attribute.productCode + '.' + attribute.code;
        //multiInstance: *append instancekey, we will also append in rule expression so they match
        let instanceKey = product.instanceKey || product.parentInstanceKey;
        if(instanceKey){
            instanceKey = instanceKey.replace(/\s/g,'');
            attribute.rulesCode = attribute.productCode + '.' + attribute.code + '.' + instanceKey;
        }
        attribute.instanceKey = instanceKey;
    }

    /* 
    * Function called by ParseRules add values to watch maps: accepts a map (either watch map for expression or watch map for result values)
    * if there is a ruleCode in expression add to our watch map as a key, rule is pushed to its response queue 
    * ex: $rootScope.rulesMap = {ruleCode1: [rule1, rule2]} -  if ruleCode1 attribute is changed we know to re-evaluate rule1 and rule2
    * @param {Object} rule 
    * @param {Object} map watchMap
    * @param {String} instanceKey
    * @param {Boolean} valueExpression if flag is true make sure we aren't already watching this rule for this attr in rulesMap
    * @param {Boolean} ruleValueForDropdown flag if rule is on value
    */
    function addMapValue(rule, ruleexpression, map, instanceKey, valueExpression, ruleValueForDropdown){
        for (let i = 0; i < ruleexpression.length; i++) {
            let rulesCode = ruleexpression[i];
            if (rulesCode.indexOf('.') > -1) {
                if($rootScope.attrsMap[rulesCode] && !$rootScope.attrsMap[rulesCode].instanceKey){
                    //attribute is on root, don't add instancekey
                } else if(instanceKey && rulesCode.indexOf(instanceKey < 0)){
                    rulesCode +='.' + instanceKey;
                    ruleexpression[i] += '.' + instanceKey;
                }
                let containsRule = false;
                if(!$rootScope.tabKey){ //only not in omniscript, omni has rules throughout pages - need to add new rules
                    if(map[rulesCode]){
                        for(let i = 0; i < map[rulesCode].length; i++){
                            if(map[rulesCode][i] === rule){
                                containsRule = true;
                            }
                        }
                    }
                }
                if(valueExpression && $rootScope.rulesMap[rulesCode]){ //if we're looking at value expression
                    for(let j = 0; j < $rootScope.rulesMap[rulesCode].length; j++){//check if we already are watching for this rule in rulesMap
                        if($rootScope.rulesMap[rulesCode][j] === rule){//applies for cases where rule expression and valueExpression have the same attr
                             containsRule = true;//but if only attr in valuExpression for rule add to map
                        }
                    }
                }
                if(!containsRule){
                     if(!map[rulesCode]){
                        map[rulesCode] = []; 
                    } 
                     map[rulesCode].push(rule);
                }
            }
            if(!valueExpression){
                rule.instanceExpression = ruleexpression;
            } else {
                rule.instanceValueExpression = ruleexpression;
            } 
        }
        evaluateRules([rule], ruleValueForDropdown); //go ahead and run rule
    }

    /* Called in watcher for products on load - add rules to watcher
    * @param {Array} rules listOfRules to be parsed on load for an attribute
    * @param {Object} attribute attribute that owns the rules
    * @param {Object} map where to add the watch (we separate value rules from attr rules)
    * @param {Boolean} ruleValueForDropdown flag if rule is on value
    */
    function parseRules(rules, attribute, map, ruleValueForDropdown){
        for(let j = 0; j < rules.length; j++){
            let rule = rules[j];
            rule.ownsRule = attribute.rulesCode; //rule owner < which attribute changes as a result of the true/false rule
            if(rule.expression && (rule.ruleType === 'Message' || rule.ruleType === 'Hide')){ //only track message and hide rules 
                let ruleexpression = rule.expression.split(/(%)/g);
                ruleexpression = ruleexpression.map((item, index) => {
                    if (item === '%' && ruleexpression[index + 1].includes('.') && ruleexpression[index + 2] === '%') {
                        ruleexpression[index + 2] = '';
                        return '';
                    } else {
                        return item;
                    }
                });
                //add attributes in rule expression to watch map!
                addMapValue(rule, ruleexpression, map, attribute.instanceKey, false, ruleValueForDropdown);
            }
            // if(rule.ruleType === 'Set Value' || rule.ruleType === 'Set Default Value'){
            //     //add attributes in value expression to watch map!
            //     let ruleexpression = rule.valueExpression.split('%'); 
            //     addMapValue(rule, ruleexpression, $rootScope.valueExpressionMap, attribute.instanceKey, true, ruleValueForDropdown);
            // }
        }
    }
  
    $rootScope.$on('vloc-run-rules-for-attrs', function(e, data){
        console.log('vloc-run-rules-for-attrs', data);
        for(let i = 0; i < data.length; i++){
            invokeAttributeRules(data[i], null, null, true);
        }
    });
    //-----BELOW ARE RUNTIME RULE EVALUATION FUNCTIONS:------
    /* Call fn when attribute changes, called in watch - can also be invoked directly 
    * @param {Object} evalAttribute attribute that has been changed 
    * @param {Object} evalProduct product who's attribute has been changed (used in OS)
    * @param {Object} evalCoverage coverage who's attribute has been changed (used in OS)
    * @param {Boolean} onload if true, broadcast save
    */ 
   function invokeAttributeRules (evalAttribute, evalProduct, evalCoverage, onload){
        let rulesCode = evalAttribute.rulesCode;
        let rulesToEval = $rootScope.rulesMap[rulesCode];
        // let setValuesToChange = $rootScope.valueExpressionMap[rulesCode];
        let rulesToEvalForDropdown = $rootScope.dropdownValueRulesMap[rulesCode];
        let obj = { //collect objs to print in console
            attrsMap: $rootScope.attrsMap,
            rulesMap: $rootScope.rulesMap,
            dropdownValueRulesMap: $rootScope.dropdownValueRulesMap,
            backendSetValueMap: $rootScope.backendSetValueMap
        };
        if (rulesToEval) {
            console.log('--debug:---', obj);
            console.log(evalAttribute.label + ' has been changed these rules must be evaluated:', rulesToEval);
            evaluateRules(rulesToEval);
        }
        if (rulesToEvalForDropdown) {
            console.log('change these dropdown rules must be evaluated:', rulesToEvalForDropdown);
            evaluateRules(rulesToEvalForDropdown, true);
        }
        if(!onload){
            // if (!rulesToEval && !setValuesToChange && !rulesToEvalForDropdown) { 
            if (!rulesToEval && !rulesToEvalForDropdown) {
                console.log(evalAttribute.label + ' has been changed theres nothing to eval.');
            }
            // if (setValuesToChange) { //Only after change - if this attribute effects setValues of other attributes 
            //     console.log('update valueExpression for these rules:', setValuesToChange);
            //     for (var i = 0; i < setValuesToChange.length; i++) {
            //         let rule = setValuesToChange[i];
            //         //we've already evaluated - no need so just setRuleVal fn
            //         setRuleValue(rule);
            //     }
            // }
            $rootScope.rulesInProgress = true; // Flag to stop changeCoverage() from saving while rules are running
            broadcastSaveEvent(evalAttribute, evalProduct, evalCoverage);
        }
    }

    /* Evaluation type needs to match userValues type - important for dropdowns and checkboxes
    * @param {unknown type} valueExpression whatever engine evaluated 
    * @param {Object} attribute 
    */
    function convertEvaluationType(valueExpression, value){
        if (typeof value !== typeof valueExpression) {
            if (typeof value === 'number') {
                valueExpression = parseFloat(valueExpression);
            } else if (typeof value === 'string') {
                if(valueExpression !== null && valueExpression !== undefined){
                    valueExpression = valueExpression.toString();
                }
            } else if (valueExpression !== null && valueExpression !== undefined && typeof value === 'boolean') {
                if (valueExpression.toString().toLowerCase() === 'true' || valueExpression.toString().toLowerCase() === 'false') {
                    valueExpression = (valueExpression.toString().toLowerCase() === 'true');
                } else {
                    console.error('Attribute Rules: Cannot set non-boolean value on boolean dataType. Your ' +
                        '"Set Value" value needs to be true or false on a checkbox boolean attribute.', value);
                }
            }
        }
        return valueExpression;
    }

    /*
    * Function to set value of an attribute that is a dropdown
    */
    function dropdownHelper(evaluation, rule){
        if(typeof evaluation !== typeof $rootScope.attrsMap[rule.ownsRule].values[0].value){
             evaluation = convertEvaluationType(evaluation, $rootScope.attrsMap[rule.ownsRule].values[0].value);
        } 
        let dropdownValueMatch = false;
        for(let i = 0; i < $rootScope.attrsMap[rule.ownsRule].values.length; i++){
            let value = $rootScope.attrsMap[rule.ownsRule].values[i];
            if(value.value === evaluation){
                $rootScope.attrsMap[rule.ownsRule].userValues = value.value;
                dropdownValueMatch = true;
            } 
        } 
        if(!dropdownValueMatch){
            console.log('!--Rule Error--!: cannot set vlaue of ' + $rootScope.attrsMap[rule.ownsRule].label + '. It is a dropdown, that does not contain: ' + evaluation);
            $rootScope.attrsMap[rule.ownsRule].ruleSetValue = false;
        }
        return dropdownValueMatch;
    }

    /* 
    * Function that takes a rule and evaluates the valueExpression of the setrule
    * then sets userValue of rule owner to this value
    * @param {Object} rule
    */
    // function setRuleValue(rule){
    //     let setFlag = false;
    //     if(rule.ruleEvaluation){
    //         let evaluation = rule.valueExpression;
    //         if(rule.instanceValueExpression) { 
    //             evaluation = evaluateString(rule.instanceValueExpression);
    //         }
    //         //These are set to true because we're dealing with no expression to evaluate which is automatically true
    //         if($rootScope.attrsMap[rule.ownsRule].values && $rootScope.attrsMap[rule.ownsRule].values[0].value){ //We need to make sure if its a dropdown, the expression we set to has a value in the dropdown, if not - leave alone
    //            setFlag = dropdownHelper(evaluation, rule);
    //         } else {
    //             if (typeof($rootScope.attrsMap[rule.ownsRule].userValues) !== typeof(evaluation)){
    //                 evaluation = convertEvaluationType(evaluation, $rootScope.attrsMap[rule.ownsRule].userValues);
    //             }
    //             $rootScope.attrsMap[rule.ownsRule].userValues = evaluation;
    //             setFlag = true;
    //         }
    //     }
    //     return setFlag;
    // };

    /* 
    * Function that takes an expression (array split by '%')
    * replaces codes with values from attrsMap, evaluates, returns results
    * @param {Array} ruleExpression either rule.expression or rule.valueExpression
    */
    function evaluateString(ruleExpression){
        ruleExpression = angular.copy(ruleExpression); //copy expression before replacing codes with values
        let ruleError = false;
        for(let j = 0; j < ruleExpression.length; j++){ //replace codes with values
            let rulesCode = ruleExpression[j];
            if(rulesCode.indexOf('.') > -1){ //if its a rulecode
                if($rootScope.attrsMap[rulesCode]){
                    let uservalues = $rootScope.attrsMap[rulesCode].userValues;
                    ruleExpression[j] = uservalues; // replace expression with value;
                    if((uservalues === null) || ($rootScope.attrsMap[rulesCode].dataType === 'text' && uservalues)) { //if datatype is text wrap value with quotes
                        ruleExpression[j] = JSON.stringify(uservalues);
                    }
                } else {
                    console.log('!-Rule Error-! no value for uservalues', rulesCode);
                    ruleError = true;
                }
            }
        }
        ruleExpression = ruleExpression.join('');
        let evaluation;
        if(!ruleError){
            evaluation = vlocity.expressionEngine.evaluateExpression(ruleExpression);
        }
        console.log('exp:' + ruleExpression + ' = ' + evaluation);
        return evaluation;
    }


    /* 
    * Function that returns who owns the rule
    * if it's a value rule (on the dropdown) - we know the attribute, but have to traverse for value it belongs to
    * @param {Object} rule
    * @param {Boolean} ruleValueForDropdown flag if rule is on value
    */
    function getAttributeRuleOwner(rule, ruleValueForDropdown){
        let attributeRuleOwner = $rootScope.attrsMap[rule.ownsRule]; //we know what attribute owns the rule
        if(ruleValueForDropdown){ //if it rule belongs to dropdown value - reassign owner to that value
            let attrValueDropDown;
            for(let i = 0; i  < attributeRuleOwner.values.length; i++){
                if(attributeRuleOwner.values[i].rules){
                    for(let j = 0; j < attributeRuleOwner.values[i].rules.length; j++){
                        if(attributeRuleOwner.values[i].rules[j].expression === rule.expression && 
                            rule.ownsRule === attributeRuleOwner.values[i].rules[j].ownsRule){
                            attrValueDropDown = attributeRuleOwner.values[i];
                        }
                    }
                }
            }
            attributeRuleOwner = attrValueDropDown;
        }
        return attributeRuleOwner;
    }

    /* 
    * Function called by userValues watcher 
    * @param {Array} rules list of rules to be evaluated 
    * @param {Boolean} ruleValueForDropdown flag to indiciated list of rules are on value rules
    */
    function evaluateRules(rules, ruleValueForDropdown){
        // let ruleSetValueFlag = {}; //for set rules -- when there are multiple that can be true or false 
        for(let i = 0; i < rules.length; i++){ //loop through all the rules to evaluate!
            let rule = rules[i]; 
            let evaluation;
            if(rule.instanceExpression){
                evaluation = evaluateString(rule.instanceExpression);
            }
            if (typeof evaluation === 'string' && (evaluation === 'true' || evaluation === 'false')) {
                if (evaluation === 'true') {
                    evaluation = true;
                } else {
                    evaluation = false;
                }
            }
            rule.ruleEvaluation = evaluation; //rule.ruleType message only relies on this flag, no need to do anything else
            let attributeRuleOwner = getAttributeRuleOwner(rule, ruleValueForDropdown);
            if(rule.ruleType === 'Hide'){
                attributeRuleOwner.hiddenByRule = evaluation; //update rule owner hidden flag (attr or value)
            }
            if(rule.ruleType === 'Set Value'){ //use valueExpression to set to userValue
                // if(!ruleSetValueFlag[rule.ownsRule]){
                //     ruleSetValueFlag[rule.ownsRule] = setRuleValue(rule); //compile list of evalutions for a list of rules -- at the end we set flag
                // }
                // if(ruleSetValueFlag[rule.ownsRule] !== true){ //only override if the flag isn't already set to false - only a 'true' eval can override
                //     ruleSetValueFlag[rule.ownsRule] =  setRuleValue(rule);
                // }
            }
        }

        //setRuleValue flag (disabled input) for owner attribute if [false, true, false] for evaluations in a list of rules - set flag to true
        // for(let rulesCode in ruleSetValueFlag){
        //     $rootScope.attrsMap[rulesCode].ruleSetValue = ruleSetValueFlag[rulesCode]; //set flag to true if any set value rules were evaled to T
        // }
    };

    /* 
    * Function called by userValues watcher to braodcast event
    * @param {Object} attr attribute
    * @param {Object} product 
    * @param {Object} coverage 
    */
    function broadcastSaveEvent(attr, product, coverage){
        let data = {
            attribute : attr
        }; 
        data.product = product || coverage;
        if(!product || !product.popoverOpen){//only send event if not in popover
            $rootScope.$broadcast('fire-onsave-event', data);
        }
    };

    return {
        evaluateRules: evaluateRules,
        // setRuleValue: setRuleValue,
        parseRules: parseRules, 
        broadcastSaveEvent: broadcastSaveEvent,
        initAttribute: initAttribute,
        invokeAttributeRules: invokeAttributeRules
    };

}]);
},{}],12:[function(require,module,exports){
angular.module('insRules').factory('InsRulesValidationService', ['$rootScope', function($rootScope) {
    'use strict';
    return {
        validateRule: function(rule) {
            rule.validation = {
                ruleType: true,
                messageType: true,
                expression: true,
                messageText: true,
                valueExpression: true
            };
            if (!rule.ruleType) {
                rule.validation.ruleType = false;
            }
            if (rule.ruleType === 'Message') {
                if (!rule.messageType) {
                    rule.validation.messageType = false;
                }
                if (!rule.messageText) {
                    rule.validation.messageText = false;
                }
            }
            if (rule.ruleType === 'Set Value') {
                if (!rule.valueExpression) {
                    rule.validation.valueExpression = false;
                }
            }
            if (rule.ruleType === 'Approval') {
                if (!rule.messageText) {
                    rule.validation.messageText = false;
                }
            }
            if (!rule.expression) {
                rule.validation.expression = false;
            }
            return rule;
        }
    };
}]);
},{}],13:[function(require,module,exports){
angular.module("insRules").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("ins-rules-template.tpl.html",'<div class="slds-p-top_small slds-p-bottom_x-small vloc-ins-rules-container" ng-if="rules.length" ng-init="getRuleOptionsTranslations()">\n    <div class="slds-border_bottom vloc-ins-rule" ng-repeat="rule in rules"\n        ng-init="isDisabled = isRuleDisabled(rule.sourceType)">\n        <div class="slds-p-vertical_x-small slds-p-left_x-small slds-p-right_medium vloc-ins-rule-inner-wrapper"\n            ng-class="{\'delete-warning-active\': rule.inDelete, \'delete-processing\': rule.isDeleted, \'adding-new-rule\': rule.newRule}"\n            style="z-index: {{rules.length + 10 - $index}}">\n            <div class="slds-grid slds-m-bottom_xx-small vloc-ins-rule-type-wrapper">\n                <div class="slds-size_1-of-12 vloc-ins-rule-number"\n                    ng-class="{\'slds-p-right_xx-small\': containerWidth < smallWidthBP}"><span>{{$index + 1}}</span>\n                </div>\n                <div class="slds-size_11-of-12">\n                    <div class="slds-grid">\n                        <div class="slds-p-right_small vloc-ins-rule-type-container"\n                            ng-class="{\'slds-size_2-of-5\': containerWidth < smallWidthBP, \'slds-size_2-of-8\': containerWidth >= smallWidthBP}">\n                            <div class="slds-form-element vloc-ins-rule-form-element"\n                                ng-class="{\'slds-has-error\': insRulesValidationService.validateRule(rule) && !rule.validation.ruleType}">\n                                <label class="slds-form-element__label vloc-ins-rule-form-element__label"\n                                    for="rule-type-select-{{$index + 1}}">{{::$root.customLabels.InsAssetTransactionsType}}</label>\n                                <div class="slds-form-element__control">\n                                    <div class="slds-select_container">\n                                        <select ng-if="rulesOptions.ruleTypes[0].name != null"\n                                            id="rule-type-select-{{$index + 1}}" class="slds-select"\n                                            ng-model="rule.ruleType"\n                                            ng-options="ruleType.name as ruleType.label for ruleType in rulesOptions.ruleTypes"\n                                            ng-disabled="isDisabled"\n                                            ng-change="resetUIToSlds()"></select>\n                                        <select ng-if="rulesOptions.ruleTypes[0].name == null"\n                                            id="rule-type-select-{{$index + 1}}" class="slds-select"\n                                            ng-model="rule.ruleType"\n                                            ng-options="ruleType for ruleType in rulesOptions.ruleTypes"\n                                            ng-disabled="isDisabled"></select>\n                                    </div>\n                                </div>\n                                <div class="slds-form-element__help vloc-ins-rule-validation-msg"\n                                    id="vloc-ins-rule-error-{{$index + 1}}"> {{::$root.customLabels.InsProductTypeRequired }}\n                                </div>\n                            </div>\n                        </div>\n                        <div class="slds-p-right_small vloc-ins-rule-extra-definition-container"\n                            ng-class="{\'slds-size_2-of-5\': containerWidth < smallWidthBP, \'slds-size_2-of-8\': containerWidth >= smallWidthBP && rule.ruleType === \'Hide\' || containerWidth >= smallWidthBP && rule.ruleType === \'Message\', \'slds-size_4-of-8\': containerWidth >= smallWidthBP && (rule.ruleType === \'Set Value\' || rule.ruleType === \'Set Default Value\')}">\n                            <div class="slds-form-element vloc-ins-rule-form-element"\n                                ng-class="{\'slds-has-error\': insRulesValidationService.validateRule(rule) && !rule.validation.valueExpression}"\n                                ng-if="rule.ruleType === \'Set Value\' || rule.ruleType === \'Set Default Value\'">\n                                <div class="slds-form-element">\n                                    <label class="slds-form-element__label vloc-ins-rule-form-element__label"\n                                        for="set-value-value-{{$index + 1}}">{{::$root.customLabels.InsProductValueToSet}}</label>\n                                    <div class="slds-form-element__control" ng-if="!isDisabled">\n                                        <monaco-editor ng-if="$root.showMonacoEditor"\n                                            class="vloc-formula-builder vloc-value-expression slds-textarea"\n                                            language="vlocity-formula" id="set-value-value-{{$index + 1}}"\n                                            ng-model="rule.valueExpression" ng-keydown="switchTypeAheadData(rule)">\n                                        </monaco-editor>\n                                    </div>\n                                    <div class="slds-form-element__control" ng-if="isDisabled">\n                                        <input class="slds-text slds-input" disabled="true" ng-model="rule.valueExpression"/>\n                                    </div>\n                                </div>\n                                <div class="slds-form-element__help vloc-ins-rule-validation-msg"\n                                    id="vloc-ins-rule-error-{{$index + 1}}">\n                                    {{::$root.customLabels.InsProductValueRequired}}</div>\n                            </div>\n                            <div class="slds-form-element vloc-ins-rule-form-element"\n                                ng-class="{\'slds-has-error\': insRulesValidationService.validateRule(rule) && !rule.validation.messageType}"\n                                ng-if="rule.ruleType === \'Message\'">\n                                <label class="slds-form-element__label vloc-ins-rule-form-element__label"\n                                    for="rule-type-select-{{$index + 1}}">{{::$root.customLabels.InsProductMessageType}}</label>\n                                <div class="slds-form-element__control">\n                                    <div class="slds-select_container">\n                                        <select id="rule-type-select-{{$index + 1}}" class="slds-select"\n                                            ng-model="rule.messageType.code"\n                                            ng-options="messageType.code as messageType.label for messageType in rulesOptions.messageTypes"\n                                            ng-disabled="isDisabled"></select>\n                                    </div>\n                                </div>\n                                <div class="slds-form-element__help vloc-ins-rule-validation-msg"\n                                    id="vloc-ins-rule-error-{{$index + 1}}">\n                                    {{::$root.customLabels.InsProductMessageTypeRequired}}</div>\n                            </div>\n                        </div>\n                        <div\n                            ng-class="{\'slds-size_0-of-5\': containerWidth < smallWidthBP, \'slds-size_3-of-8\': containerWidth >= smallWidthBP && rule.ruleType === \'Hide\' || containerWidth >= smallWidthBP && rule.ruleType === \'Message\', \'slds-size_1-of-8\': containerWidth >= smallWidthBP && (rule.ruleType === \'Set Value\' || rule.ruleType === \'Set Default Value\')}">\n                        </div>\n                        <div class="slds-text-align_right slds-is-relative vloc-ins-rule-delete-rule-container"\n                            ng-class="{\'slds-size_1-of-5\': containerWidth < smallWidthBP, \'slds-size_1-of-8\': containerWidth >= smallWidthBP}">\n                            <button class="slds-button slds-button_icon" title="{{::$root.customLabels.Delete}}"\n                                ng-disabled="isDisabled" ng-click="deletePrompt(rule)">\n                                <slds-button-svg-icon sprite="\'utility\'" icon="\'delete\'" size="\'medium\'"\n                                    ng-if="!rule.inDelete"></slds-button-svg-icon>\n                                <slds-button-svg-icon sprite="\'utility\'" icon="\'close\'" size="\'medium\'"\n                                    ng-if="rule.inDelete"></slds-button-svg-icon>\n                                <span class="slds-assistive-text">{{::$root.customLabels.InsProductDeleteRule}}</span>\n                            </button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class="slds-grid vloc-ins-rule-expression-wrapper">\n                <div class="slds-size_1-of-12" ng-class="{\'slds-p-right_xx-small\': containerWidth < smallWidthBP}">\n                </div>\n                <div class="slds-size_11-of-12 vloc-ins-rule-expression-container">\n                    <div class="slds-size_1-of-1 slds-form-element__label vloc-ins-rule-form-element__label slds-p-top_small"\n                        id="rule-expression-label-{{$index + 1}}"> {{::$root.customLabels.InsProductExpression}}</div>\n                    <div ng-if="!isDisabled">\n                        <div\n                            ng-if="rule.ruleType !== \'Set Value\' && rule.ruleType !== \'Set Default Value\' && $root.showMonacoEditor">\n                            <simple-expression-builder expression="rule.expression" element-names="attributeNames"\n                                disabled="isDisabled"></simple-expression-builder>\n                        </div>\n                        <div ng-if="(rule.ruleType === \'Set Value\' || rule.ruleType === \'Set Default Value\')"\n                            class="vloc-formula-builder-container" ng-init="rule.typeAheadKeywords = attributeNames">\n                            <monaco-editor ng-if="$root.showMonacoEditor" class="vloc-formula-builder slds-textarea"\n                                language="vlocity-formula" ng-model="rule.expression"\n                                ng-keydown="switchTypeAheadData(rule)"></monaco-editor>\n                        </div>\n                    </div>\n                    <div ng-if="isDisabled">\n                        <div\n                            ng-if="rule.ruleType !== \'Set Value\' && rule.ruleType !== \'Set Default Value\'" class="vloc-ins-disabled">\n                            <simple-expression-builder expression="rule.expression" disabled="isDisabled"></simple-expression-builder>\n                        </div>\n                        <div ng-if="(rule.ruleType === \'Set Value\' || rule.ruleType === \'Set Default Value\')">\n                            <input class="slds-text slds-input" disabled="true" ng-model="rule.expression"/>\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n            <div class="slds-grid vloc-ins-rule-message-wrapper"\n                ng-if="rule.ruleType === \'Message\' || rule.ruleType === \'Approval\'">\n                <div class="slds-size_1-of-12" ng-class="{\'slds-p-right_xx-small\': containerWidth < smallWidthBP}">\n                </div>\n                <div class="slds-size_11-of-12 vloc-ins-rule-message-container">\n                    <div class="slds-form-element vloc-ins-rule-form-element"\n                        ng-class="{\'slds-has-error\': insRulesValidationService.validateRule(rule) && !rule.validation.messageText}">\n                        <label class="slds-form-element__label vloc-ins-rule-form-element__label"\n                            for="rule-expression-{{$index + 1}}">{{::$root.customLabels.InsProductMessage}}</label>\n                        <div class="slds-form-element__control vloc-ins-rule-textarea__control">\n                            <textarea id="rule-expression-{{$index + 1}}" class="slds-textarea"\n                                placeholder="{{::$root.customLabels.InsProductEnterMessageText}}"\n                                ng-model="rule.messageText" ng-disabled="isDisabled"></textarea>\n                        </div>\n                        <div class="slds-form-element__help vloc-ins-rule-validation-msg"\n                            id="vloc-ins-rule-error-{{$index + 1}}">{{::$root.customLabels.InsProductMessageTextRequired}}\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="vloc-ins-rule-delete-warning-wrapper"\n            ng-class="{\'delete-warning-active\': rule.inDelete, \'delete-processing\': rule.isDeleted, \'adding-new-rule\': rule.newRule}">\n            <div\n                class="slds-p-vertical_x-small slds-p-horizontal_medium slds-text-align_right slds-notify slds-theme_alert-texture vloc-ins-rule-delete-warning-header">\n                <h2 class="slds-text-heading_medium" id="ins-rules-delete-warning-{{$index + 1}}">\n                    {{::$root.customLabels.InsProductDeleteRule}}</h2>\n            </div>\n            <div class="slds-p-around_medium slds-text-align_right vloc-ins-rule-delete-warning-content">\n                <p>{{::$root.customLabels.InsProductDeleteRuleMessage}}</p>\n            </div>\n            <div class="slds-p-around_medium slds-text-align_right vloc-ins-rule-delete-warning-footer">\n                <button class="slds-button slds-button_neutral"\n                    ng-click="rule.inDelete = !rule.inDelete">{{::$root.customLabels.InsButtonCancel}} </button>\n                <button class="slds-button slds-button_destructive"\n                    ng-click="deleteRule(rule, $index)">{{::$root.customLabels.InsProductConfirmDelete}}</button>\n            </div>\n        </div>\n    </div>\n    <div class="slds-grid">\n        <div class="slds-size_1-of-12" ng-class="{\'slds-p-right_xx-small\': containerWidth < smallWidthBP}"></div>\n        <div class="slds-size_11-of-12">\n            <button class="slds-button vloc-ins-rule-add" ng-if="($root.productRecordType !== \'Class\' || ($root.productRecordType === \'Class\' && $root.config.attr[$root.nsPrefix + \'ObjectId__c\'] === productId))"\n                ng-click="addRule()">{{::$root.customLabels.InsProductAddRuleLink}} </button>\n        </div>\n    </div>\n</div>\n<div class="slds-p-around_small vloc-ins-no-rules-container" ng-if="!rules.length">\n    <p>{{::$root.customLabels.InsProductNoRulesDefined}}\n        <a ng-if="($root.productRecordType !== \'Class\' || ($root.productRecordType === \'Class\' && $root.config.attr[$root.nsPrefix + \'ObjectId__c\'] === productId))"\n            href="javascript:void(0)"\n            ng-click="addRule()">{{::$root.customLabels.InsProductAddRule}}\n        </a>\n    </p>\n</div>\n<style type="text/css">\n    .via-slds ins-rules {\n        display: block;\n        overflow: hidden;\n    }\n\n    .via-slds ins-rules .vloc-formula-builder-container {\n        position: relative;\n        min-height: 6rem;\n    }\n\n    .via-slds ins-rules monaco-editor.vloc-formula-builder {\n        border-radius: 0.25rem;\n        width: 100%;\n        height: 3.5rem;\n        max-height: 3.5rem;\n        position: absolute;\n    }\n\n    .via-slds monaco-editor.vloc-formula-builder.vloc-value-expression {\n        max-height: 2rem;\n    }\n\n    .via-slds ins-rules monaco-editor.vloc-formula-builder .monaco-list-rows {\n        min-width: 50rem;\n    }\n\n    .via-slds ins-rules monaco-editor.vloc-formula-builder>.monaco-editor {\n        border-radius: 0.25rem;\n        top: -0.5rem;\n        right: 0.75rem;\n    }\n\n    .via-slds ins-rules monaco-editor.vloc-formula-builder>.monaco-editor>.overflow-guard {\n        border-radius: 0.25rem;\n        padding: 0.25rem 0;\n    }\n\n    .via-slds ins-rules monaco-editor.vloc-formula-builder>.monaco-editor>.overflow-guard>.monaco-scrollable-element>.monaco-editor-background {\n        height: 500% !important;\n        width: 100% !important;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule {\n        position: relative;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper {\n        background-color: white;\n        position: relative;\n        z-index: 2;\n        left: 0;\n        max-height: 32rem;\n        transition: left 250ms ease-in, max-height 250ms ease-in 400ms, padding 0ms linear 600ms;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper:before {\n        position: absolute;\n        top: 0;\n        left: 0;\n        z-index: 10;\n        content: "";\n        display: block;\n        width: 100%;\n        height: 100%;\n        visibility: hidden;\n        background-color: transparent;\n        transition: background-color 150ms ease-in, visibility 0ms linear 150ms;\n        min-height: 10rem;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper.delete-warning-active {\n        left: -80%;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper.delete-processing {\n        max-height: 0;\n        padding-top: 0;\n        padding-bottom: 0;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper.delete-processing:before {\n        visibility: visible;\n        background-color: rgba(84, 105, 141, 0.8);\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper.adding-new-rule:before {\n        visibility: visible;\n        background-color: rgba(84, 105, 141, 0.8);\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper .vloc-ins-rule-number span {\n        display: block;\n        font-size: 1rem;\n        width: 1.5rem;\n        height: 1.5rem;\n        line-height: 1.5rem;\n        border-radius: 50%;\n        background-color: #acb9ce;\n        text-align: center;\n        color: white;\n        margin: 1.6rem auto 0 auto;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper .vloc-ins-rule-form-element .vloc-ins-rule-validation-msg {\n        display: none;\n        margin-top: 0.125rem;\n        margin-bottom: 0.25rem;\n        font-style: italic;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper .vloc-ins-rule-form-element .vloc-ins-rule-textarea__control {\n        height: 3.5rem;\n        position: relative;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper .vloc-ins-rule-form-element .vloc-ins-rule-textarea__control+.vloc-ins-rule-validation-msg {\n        margin-top: -0.125rem;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper .vloc-ins-rule-form-element .vloc-ins-rule-textarea__control monaco-editor {\n        border-radius: 0.25rem;\n        width: 100%;\n        height: 3rem;\n        max-height: 3rem;\n        padding: 0;\n        position: absolute;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper .vloc-ins-rule-form-element .vloc-ins-rule-textarea__control monaco-editor>.monaco-editor {\n        border-radius: 0.25rem;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper .vloc-ins-rule-form-element .vloc-ins-rule-textarea__control monaco-editor>.monaco-editor>.overflow-guard {\n        border-radius: 0.25rem;\n        padding: 0.25rem 0;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper .vloc-ins-rule-form-element.slds-has-error .vloc-ins-rule-form-element__label {\n        color: #c23934;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper .vloc-ins-rule-form-element.slds-has-error .vloc-ins-rule-validation-msg {\n        display: block;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper .vloc-ins-rule-delete-rule-container .slds-button {\n        position: absolute;\n        top: 1.5rem;\n        right: 0;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-delete-warning-wrapper {\n        position: absolute;\n        top: 0;\n        right: 0;\n        height: 100%;\n        width: 80%;\n        z-index: -1;\n        background-color: #f4f6f9;\n        transition: z-index 0ms linear 300ms;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-delete-warning-wrapper .vloc-ins-rule-delete-warning-footer {\n        position: absolute;\n        bottom: 0;\n        right: 0;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-delete-warning-wrapper.delete-warning-active {\n        z-index: 1;\n        transition: z-index 0ms linear 0ms;\n    }\n\n    .via-slds ins-rules .vloc-ins-rules-container .vloc-ins-rule-add {\n        color: #00a1df;\n        font-style: italic;\n        margin-top: 0.5rem;\n        padding: 0 0.25rem;\n    }\n\n    .via-slds ins-rules .vloc-ins-disabled .vloc-ins-rule-insert-functions {\n        display: none;\n    }\n\n    .via-slds ins-rules .simpleExpressionBuilder:after {\n        content: "";\n        display: table;\n        clear: both;\n    }\n\n    .via-slds ins-rules .simpleExpressionBuilder>.col-xs-6 {\n        display: none;\n    }\n\n    .via-slds ins-rules .simpleExpressionBuilder>.col-xs-3+.col-xs-3 {\n        display: none;\n    }\n\n    .via-slds ins-rules .simpleExpressionBuilder>.col-xs-9 {\n        width: 60%;\n        margin-right: 2%;\n        float: left;\n        z-index: 100;\n    }\n\n    .via-slds ins-rules .simpleExpressionBuilder>.col-xs-9 textarea {\n        width: 100%;\n        height: 6rem;\n    }\n\n    .via-slds ins-rules .simpleExpressionBuilder>.col-xs-9+.col-xs-3 {\n        width: 37%;\n        float: right;\n    }\n\n    .via-slds ins-rules .simpleExpressionBuilder>.col-xs-9+.col-xs-3 .slds-select[multiple] option {\n        padding: 0.25rem 0.5rem;\n        font-size: 0.75rem;\n    }\n\n    .via-slds ins-rules .has-error .slds-textarea {\n        background-color: #fff;\n        border-color: #c23934;\n        box-shadow: #c23934 0 0 0 1px inset;\n        background-clip: padding-box;\n    }\n\n    .via-slds ins-rules .has-error .help-block {\n        color: #c23934;\n    }\n\n    .via-slds ins-rules.small-width-container .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper {\n        padding: 0.75rem 0.75rem 0.75rem 0;\n    }\n\n    .via-slds ins-rules.small-width-container .vloc-ins-rules-container .vloc-ins-rule .vloc-ins-rule-inner-wrapper .vloc-ins-rule-number span {\n        font-size: 0.75rem;\n        width: 1.25rem;\n        height: 1.25rem;\n        line-height: 1.25rem;\n    }\n\n    .via-slds ins-rules.small-width-container .vloc-ins-rules-container .vloc-ins-rule:first-of-type .vloc-ins-rule-inner-wrapper {\n        padding-top: 0;\n    }\n\n    .via-slds ins-rules.small-width-container .simpleExpressionBuilder .vloc-ins-rule-insert-operator {\n        width: 40%;\n        flex: 0 0 40%;\n        max-width: 40%;\n    }\n\n    mentio-menu {\n        z-index: 9999 !important;\n    }\n\n    mentio-menu .vlocity.via-slds {\n        border: 1px solid #d8dde6;\n        border-radius: 0.25rem;\n        padding: 0.125rem 0;\n        background-color: white;\n        box-shadow: 1px 1px 10px 0 rgba(0, 0, 0, 0.35);\n        max-height: 15rem;\n        overflow-y: auto;\n        padding-bottom: 2.25rem;\n    }\n\n    mentio-menu .vlocity.via-slds:after {\n        content: "";\n        display: block;\n        position: absolute;\n        bottom: 0;\n        left: 0;\n        width: 100%;\n        height: 2.25rem;\n        z-index: 10;\n        background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 0.9) 70%, white 100%);\n    }\n\n    mentio-menu .vlocity.via-slds li {\n        padding: 0.5rem 0.75rem;\n        border-bottom: 1px solid #d8dde6;\n    }\n\n    mentio-menu .vlocity.via-slds li:last-child {\n        border-bottom: none;\n    }\n\n    mentio-menu .vlocity.via-slds li.active {\n        background-color: #f4f6f9;\n    }\n\n    mentio-menu .vlocity.via-slds li a:hover {\n        text-decoration: none;\n    }\n</style>\n'),$templateCache.put("ins-rules-attributes-template-subgroups.tpl.html",'<ul class="via-ins-attributes-products-container">\n    <li class="via-ins-attributes-product" ng-repeat="product in processedProductData" ins-rules-coverage="product"\n        ins-rules-evaluate ins-rules-product="product" one-product="oneProduct">\n        <div class="slds-border_bottom via-right-col-header slds-p-vertical_small slds-m-bottom_small"\n            ng-hide="hideHeader">\n            <div class="via-product-heading-container slds-grid slds-m-bottom_x-small">\n                <div class="slds-text-heading_medium via-product-name slds-truncate slds-size_7-of-8">\n                    <strong>{{product.productName}}</strong>\n                </div>\n                <div class="via-product-type slds-truncate slds-text-align_right slds-size_1-of-8"\n                    ng-if="product[\'Product2.\' + $root.nsPrefix + \'Tier__c\'] && product[\'Product2.\' + $root.nsPrefix + \'Tier__c\'].value && product[\'Product2.\' + $root.nsPrefix + \'Tier__c\'].value !== null">\n                    <span>{{product[\'Product2.\' + $root.nsPrefix + \'Tier__c\'].value}}</span>\n                </div>\n            </div>\n            <div class="via-product-btn-group">\n                <button class="slds-button slds-button_brand"\n                    ng-click="updateMethod()">{{ ::$root.customLabels.Update }}</button>\n            </div>\n        </div>\n        <div class="slds-m-bottom_small via-ins-attributes-expand-collapse-categories" ng-hide="hideControls"\n            ng-class="{\'slds-p-top_small\' : hideHeader}">\n            <a href="javascript:void(0)"\n                ng-click="categoryAccordion.expandAll(product.attributeCategories.records)">{{ ::$root.customLabels.InsQuotesExpandAll }}</a>\n            <span class="slds-m-horizontal_x-small">|</span>\n            <a href="javascript:void(0)"\n                ng-click="categoryAccordion.collapseAll(product.attributeCategories.records)">{{ ::$root.customLabels.InsQuotesCollapseAll }}</a>\n        </div>\n        <ul class="via-ins-attributes-categories-container" ng-model="categoryAccordion.activePanels"\n            data-allow-multiple="true" bs-collapse ng-init="categoryAccordion.productId = product.productId;">\n            <li class="slds-m-bottom_xxx-small via-ins-attributes-category slds-border_top in slds-is-relative"\n                id="via-ins-attributes-category-{{category.Code__c}}"\n                ng-repeat="category in product.attributeCategories.records | orderBy:\'displaySequence\'"\n                bs-collapse-target style="z-index: {{1000 - $index}}" ng-click="decideOverflowClass(category, $index);"\n                category-index="{{$index}}"\n                ng-show="(category.productAttributes.records | filter: {hidden: \'!true\', hiddenByRule: \'!true\', inputType: \'!equalizer\'}).length">\n                <div class="slds-grid slds-grid_wrap slds-size_1-of-1">\n                    <div class="slds-size_1-of-{{subgroups.length}} slds-p-top_small">\n                        <h2 class="slds-m-left_x-large slds-p-left_x-small slds-text-heading_small" bs-collapse-toggle\n                            ng-click="toggleOverflow($event)">\n                            <slds-svg-icon sprite="\'utility\'" icon="\'chevronright\'" size="\'xx-small\'"\n                                extra-classes="\'slds-m-right_xx-small\'"></slds-svg-icon>\n                            <span>{{category.Name}}</span>\n                        </h2>\n                    </div>\n                    <div class="slds-size_1-of-{{subgroups.length}} slds-p-top_xx-small slds-text-align_center"\n                        ng-repeat="subgroup in subgroups" ng-if="$index !== 0">\n                        <div class="slds-form-element vloc-switch" ng-if="switchMap[category.id][subgroup].code">\n                            <label class="slds-checkbox_toggle slds-grid">\n                                <input name="checkbox-toggle-{{$index}}" type="checkbox"\n                                    aria-describedby="checkbox-toggle-{{$index}}" value="checkbox-toggle-{{$index}}"\n                                    ng-model="switchMap[category.id][subgroup].userValues"\n                                    ng-change="updateQLI(product, switchMap[category.id][subgroup])"\n                                    ng-disabled="readonly" />\n                                <span id="checkbox-toggle-{{$index}}" class="slds-checkbox_faux_container"\n                                    aria-live="assertive">\n                                    <span class="slds-checkbox_faux"></span>\n                                    <span class="slds-checkbox_on"> {{ ::$root.customLabels.InsQuotesCovered }}</span>\n                                    <span class="slds-checkbox_off">{{ ::$root.customLabels.InsQuotesNotCovered }}</span>\n                                </span>\n                            </label>\n                        </div>\n                    </div>\n                </div>\n                <ul class="via-ins-attributes-attributes-container slds-grid slds-grid_wrap"\n                    ng-class="{\'overflow-unset\': category.overflowUnset}" ng-if="isRendered || category.overflowUnset"\n                    ng-init="$parent.isRendered = true;">\n                    <div ng-repeat="subgroup in subgroups" class="slds-m-vertical_small slds-p-horizontal_xx-large"\n                        ng-class="{\'slds-size_1-of-{{subgroups.length}}\': subgroups.length,\n                        \'slds-border_right\': ($index < subgroups.length - 1) && (subgroup != \'In-Network\' && subgroup != \'In-Network-2\')}">\n                        <li class="via-ins-attributes-cell slds-m-bottom_small via-ins-attributes-attribute slds-size_1-of-1"\n                            ng-repeat="attribute in subgroupMap[subgroup][category.id] | orderBy: \'displaySequence\' | filter: {hidden: \'!true\', inputType: \'!equalizer\'}"\n                            ng-class="{\'has-rules\': attribute.hasRules, \'slds-p-left_large\' : attribute.hideLabel, \'ins-out-of-network-col\' : attribute.hideLabel}"\n                            ins-rules-evaluate="attribute" ins-rules-coverage="product">\n                            <div\n                                ng-if="!(switchMap[category.id][subgroup].code && !switchMap[category.id][subgroup].userValues)">\n                                <div class="slds-grid via-ins-attributes-attribute-input"\n                                    ng-if="attribute.inputType !== \'dropdown\' && !attribute.readonly && !attribute.multiselect && attribute.inputType !== \'radio\' && attribute.inputType !== \'range\'">\n                                    <label ng-hide="attribute.hideLabel"\n                                        class="slds-size_5-of-12 via-ins-attributes-attributes-label"\n                                        for="text-input-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}">{{attribute.label}}</label>\n                                    <div class="slds-p-left_small via-ins-attributes-attribute-uservalues"\n                                        ng-class="{\'slds-checkbox\': attribute.inputType === \'checkbox\', \'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}"\n                                        ng-if="attribute.dataType !== \'date\' && attribute.dataType !== \'datetime\'">\n                                        <div class="via-ins-attributes-attribute-currency-symbol"\n                                            ng-if="attribute.dataType === \'currency\'">$</div>\n                                        <input type="{{attribute.inputType}}"\n                                            id="text-input-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}"\n                                            class="slds-input datatype-{{attribute.dataType}}"\n                                            ng-model="attribute.userValues"\n                                            ng-disabled="attribute.ruleSetValue || !product.isSelected || readonly"\n                                            ng-class="{\'vloc-hidden\' : attribute.visibility === \'hidden\' || attribute.hiddenByRule}" />\n                                        <div class="via-ins-attributes-attribute-percent-symbol"\n                                            ng-if="attribute.dataType === \'percentage\'">%</div>\n                                        <label class="slds-checkbox__label"\n                                            for="text-input-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}"\n                                            ng-if="attribute.inputType === \'checkbox\'">\n                                            <span class="slds-checkbox_faux"></span>\n                                        </label>\n                                    </div>\n                                    <div ng-hide="attribute.hiddenByRule"\n                                        class="slds-p-left_small via-ins-attributes-attribute-uservalues"\n                                        ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}"\n                                        ng-if="attribute.dataType === \'date\' || attribute.dataType === \'datetime\'">\n                                        <div class="slds-is-relative via-ins-attributes-attribute-date-container"\n                                            ng-if="attribute.dataType === \'date\'">\n                                            <input type="text"\n                                                id="text-input-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}"\n                                                class="slds-input datatype-{{attribute.dataType}}"\n                                                ng-model="attribute.userValues" ng-model-options="{debounce: 0}"\n                                                ng-disabled="attribute.ruleSetValue || !product.isSelected || readonly"\n                                                slds-date-picker />\n                                        </div>\n                                        <div class="slds-grid via-ins-attributes-attribute-datetime-container"\n                                            ng-if="attribute.dataType === \'datetime\'">\n                                            <div class="slds-is-relative slds-size_1-of-2 slds-p-right_xx-small">\n                                                <input type="text"\n                                                    id="text-input-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}"\n                                                    class="slds-input slds-p-horizontal_small datatype-{{attribute.dataType}}"\n                                                    ng-model="attribute.userValues" ng-model-options="{debounce: 0}"\n                                                    ng-disabled="attribute.ruleSetValue || !product.isSelected || readonly"\n                                                    slds-date-picker />\n                                            </div>\n                                            <div class="slds-is-relative slds-size_1-of-2 slds-p-left_xx-small">\n                                                <input type="text"\n                                                    id="datetime-text-input-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}"\n                                                    class="slds-input slds-p-horizontal_small datatype-{{attribute.dataType}}"\n                                                    ng-model="attribute.userValues"\n                                                    ng-disabled="attribute.ruleSetValue || !product.isSelected || readonly"\n                                                    slds-time-picker />\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div ng-hide="value.hiddenByRule"\n                                        class="slds-size_2-of-12 slds-text-align_right via-ins-attributes-attributes-override"\n                                        ng-if="attribute.showOverride">\n                                        <div class="slds-form-element">\n                                            <div class="slds-form-element__control">\n                                                <span class="slds-checkbox">\n                                                    <input type="checkbox" name="options"\n                                                        id="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}"\n                                                        ng-model="attribute.override" />\n                                                    <label class="slds-checkbox__label"\n                                                        for="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                        <span class="slds-checkbox_faux"></span>\n                                                        <span class="slds-form-element__label slds-m-right_none">\n                                                            <slds-svg-icon sprite="\'utility\'" icon="\'approval\'"\n                                                                size="\'xx-small\'"></slds-svg-icon>\n                                                        </span>\n                                                    </label>\n                                                </span>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div ng-include="\'ruleMessageTooltip.html\'"></div>\n                                </div>\n                                <div class="slds-grid via-ins-attributes-attribute-dropdown"\n                                    ng-if="attribute.inputType === \'dropdown\' && !attribute.multiselect && !attribute.readonly">\n                                    <label ng-hide="attribute.hideLabel"\n                                        class="slds-size_5-of-12 via-ins-attributes-attributes-label"\n                                        for="select-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}">{{attribute.label}}</label>\n                                    <div ng-hide="attribute.hiddenByRule"\n                                        class="slds-p-left_small via-ins-attributes-attribute-uservalues"\n                                        ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}">\n                                        <div class="via-ins-attributes-attribute-currency-symbol"\n                                            ng-if="attribute.dataType === \'currency\'">$</div>\n                                        <div class="slds-select_container">\n                                            <select\n                                                id="select-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}"\n                                                class="slds-select datatype-{{attribute.dataType}}"\n                                                ng-options="value.value as value.label for value in attribute.values | filter: {hiddenByRule: \'!true\'}"\n                                                ng-model="attribute.userValues"\n                                                ng-disabled="attribute.ruleSetValue || !product.isSelected || readonly">{{attribute.label}}</select>\n                                        </div>\n                                    </div>\n                                    <div ng-hide="value.hiddenByRule"\n                                        class="slds-size_2-of-12 slds-text-align_right via-ins-attributes-attributes-override"\n                                        ng-if="attribute.showOverride">\n                                        <div class="slds-form-element">\n                                            <div class="slds-form-element__control">\n                                                <span class="slds-checkbox">\n                                                    <input type="checkbox" name="options"\n                                                        id="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}"\n                                                        ng-model="attribute.override" />\n                                                    <label class="slds-checkbox__label"\n                                                        for="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                        <span class="slds-checkbox_faux"></span>\n                                                        <span class="slds-form-element__label slds-m-right_none">\n                                                            <slds-svg-icon sprite="\'utility\'" icon="\'approval\'"\n                                                                size="\'xx-small\'"></slds-svg-icon>\n                                                        </span>\n                                                    </label>\n                                                </span>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div ng-include="\'ruleMessageTooltip.html\'"></div>\n                                </div>\n                                <div class="slds-grid via-ins-attributes-attribute-multiselect-checkbox"\n                                    ng-if="attribute.multiselect && attribute.inputType === \'checkbox\'">\n                                    <legend ng-hide="attribute.hideLabel"\n                                        class="slds-size_5-of-12 via-ins-attributes-attributes-label">\n                                        {{attribute.label}}</legend>\n                                    <div ng-hide="attribute.hiddenByRule"\n                                        class="slds-p-left_small via-ins-attributes-attribute-uservalues"\n                                        ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}">\n                                        <fieldset class="slds-form-element">\n                                            <div class="slds-form-element__control">\n                                                <span class="slds-checkbox" ng-repeat="value in attribute.values"\n                                                    ng-if="!value.hiddenByRule">\n                                                    <input type="checkbox"\n                                                        id="attr-ms-cb-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}"\n                                                        checked="" ng-model="attribute.userValues[$index][value.value]"\n                                                        ng-disabled="!product.isSelected  || readonly || ($index === attribute.ruleSetValueIndex && attribute.ruleSetValue)"\n                                                        ng-click="toggleValue(attribute, value, value.ruleSetValue, product)" />\n                                                    <label class="slds-checkbox__label"\n                                                        for="attr-ms-cb-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}">\n                                                        <span class="slds-checkbox_faux"></span>\n                                                        <span class="slds-form-element__label">{{value.label}}</span>\n                                                    </label>\n                                                </span>\n                                            </div>\n                                        </fieldset>\n                                    </div>\n                                    <div ng-hide="attribute.hiddenByRule"\n                                        class="slds-size_2-of-12 slds-text-align_right via-ins-attributes-attributes-override"\n                                        ng-if="attribute.showOverride">\n                                        <div class="slds-form-element">\n                                            <div class="slds-form-element__control">\n                                                <span class="slds-checkbox">\n                                                    <input type="checkbox" name="options"\n                                                        id="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}"\n                                                        ng-model="attribute.override" />\n                                                    <label class="slds-checkbox__label"\n                                                        for="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                        <span class="slds-checkbox_faux"></span>\n                                                        <span class="slds-form-element__label slds-m-right_none">\n                                                            <slds-svg-icon sprite="\'utility\'" icon="\'approval\'"\n                                                                size="\'xx-small\'"></slds-svg-icon>\n                                                        </span>\n                                                    </label>\n                                                </span>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div ng-include="\'ruleMessageTooltip.html\'"></div>\n                                </div>\n                                <div class="slds-grid via-ins-attributes-attribute-multiselect-dropdown"\n                                    ng-if="attribute.multiselect && attribute.inputType === \'dropdown\'">\n                                    <label ng-hide="attribute.hideLabel"\n                                        class="slds-size_5-of-12 via-ins-attributes-attributes-label"\n                                        for="dropdown-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}">{{attribute.label}}</label>\n                                    <div ng-hide="attribute.hiddenByRule"\n                                        class="slds-p-left_small via-ins-attributes-attribute-uservalues"\n                                        ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}">\n                                        <div class="slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open"\n                                            ng-init="attribute.dropdownOpen = false">\n                                            <button\n                                                class="slds-button slds-button_neutral via-ins-attributes-attribute-dropdown-button"\n                                                aria-haspopup="true" title="Show More"\n                                                ng-model="attribute.userValues[$index][value.value]"\n                                                id="dropdown-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}"\n                                                ng-model="attribute.userValues"\n                                                ins-dropdown-handler="attribute.dropdownOpen = !attribute.dropdownOpen"\n                                                restrict-element="via-ins-attributes-attribute-dropdown-items"\n                                                ng-init="countSelected(attribute)">\n                                                <span>{{attribute.multiSelectCount}} {{ ::$root.customLabels.Selected }}</span>\n                                                <slds-button-svg-icon sprite="\'utility\'" icon="\'down\'"\n                                                    extra-classes="\'slds-button__icon_right\'"></slds-button-svg-icon>\n                                                <span\n                                                    class="slds-assistive-text">{{ ::$root.customLabels.InsButtonShowMore }}</span>\n                                            </button>\n                                            <div class="slds-dropdown slds-dropdown_left via-ins-attributes-attribute-dropdown-items"\n                                                ng-show="attribute.dropdownOpen">\n                                                <ul class="slds-dropdown__list via-ins-attributes-attribute-dropdown-items-list"\n                                                    role="menu">\n                                                    <li class="slds-dropdown__item via-ins-attributes-attribute-dropdown-items-item"\n                                                        role="presentation" ng-repeat="value in attribute.values"\n                                                        ng-click="toggleValue(attribute, value, value.ruleSetValue, product)"\n                                                        ng-if="!value.hiddenByRule"\n                                                        ng-class="{\'ins-rule-set-value\': value.ruleSetValue}">\n                                                        <a href="javascript:void(0);"\n                                                            class="via-ins-attributes-attribute-dropdown-items-link"\n                                                            role="menuitem" tabindex="0">\n                                                            <slds-svg-icon sprite="\'utility\'" icon="\'check\'"\n                                                                size="\'x-small\'"\n                                                                extra-classes="\'slds-m-top_xxx-small slds-m-right_x-small\'"\n                                                                ng-class="{\'slds-icon_selected\': attribute.userValues.indexOf(value.value) < 0}">\n                                                            </slds-svg-icon>\n                                                            <span class="slds-truncate"\n                                                                title="Menu Item One">{{value.label}}</span>\n                                                        </a>\n                                                    </li>\n                                                </ul>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div ng-hide="attribute.hiddenByRule"\n                                        class="slds-size_2-of-12 slds-text-align_right via-ins-attributes-attributes-override"\n                                        ng-if="attribute.showOverride">\n                                        <div class="slds-form-element">\n                                            <div class="slds-form-element__control">\n                                                <span class="slds-checkbox">\n                                                    <input type="checkbox" name="options"\n                                                        id="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}"\n                                                        ng-model="attribute.override" />\n                                                    <label class="slds-checkbox__label"\n                                                        for="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                        <span class="slds-checkbox_faux"></span>\n                                                        <span class="slds-form-element__label slds-m-right_none">\n                                                            <slds-svg-icon sprite="\'utility\'" icon="\'approval\'"\n                                                                size="\'xx-small\'"></slds-svg-icon>\n                                                        </span>\n                                                    </label>\n                                                </span>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div ng-include="\'ruleMessageTooltip.html\'"></div>\n                                </div>\n                                <div class="slds-grid via-ins-attributes-attribute-radio-picklist"\n                                    ng-if="attribute.dataType === \'text\' && attribute.inputType === \'radio\'">\n                                    <legend ng-hide="attribute.hideLabel"\n                                        class="slds-size_5-of-12 via-ins-attributes-attributes-label">\n                                        {{attribute.label}}</legend>\n                                    <div ng-hide="attribute.hiddenByRule"\n                                        class="slds-p-left_small via-ins-attributes-attribute-uservalues"\n                                        ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}">\n                                        <fieldset class="slds-form-element">\n                                            <div class="slds-form-element__control">\n                                                <span class="slds-radio" ng-repeat="value in attribute.values"\n                                                    ng-if="!value.hiddenByRule">\n                                                    <input type="radio"\n                                                        id="attr-radio-pl-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}"\n                                                        ng-checked="value.value === attribute.userValues"\n                                                        ng-click="attribute.userValues = value.value" />\n                                                    <label class="slds-radio__label"\n                                                        for="attr-radio-pl-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}">\n                                                        <span class="slds-radio_faux"></span>\n                                                        <span class="slds-form-element__label">{{value.label}}</span>\n                                                    </label>\n                                                </span>\n                                            </div>\n                                        </fieldset>\n                                    </div>\n                                    <div ng-hide="attribute.hiddenByRule"\n                                        class="slds-size_2-of-12 slds-text-align_right via-ins-attributes-attributes-override"\n                                        ng-if="attribute.showOverride">\n                                        <div class="slds-form-element">\n                                            <div class="slds-form-element__control">\n                                                <span class="slds-checkbox">\n                                                    <input type="checkbox" name="options"\n                                                        id="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}"\n                                                        ng-model="attribute.override" />\n                                                    <label class="slds-checkbox__label"\n                                                        for="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                        <span class="slds-checkbox_faux"></span>\n                                                        <span class="slds-form-element__label slds-m-right_none">\n                                                            <slds-svg-icon sprite="\'utility\'" icon="\'approval\'"\n                                                                size="\'xx-small\'"></slds-svg-icon>\n                                                        </span>\n                                                    </label>\n                                                </span>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div ng-include="\'ruleMessageTooltip.html\'"></div>\n                                </div>\n                                <div class="slds-grid via-ins-attributes-attribute-range-slider"\n                                    ng-if="attribute.inputType === \'range\'">\n                                    <label ng-hide="attribute.hideLabel"\n                                        class="slds-size_5-of-12 via-ins-attributes-attributes-label"\n                                        for="range-slider-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}">{{attribute.label}}<span\n                                            ng-if="attribute.max"> ({{attribute.min}} -\n                                            {{attribute.max}})</span></label>\n                                    <div ng-hide="attribute.hiddenByRule"\n                                        class="slds-is-relative slds-form-element slds-p-left_small via-ins-attributes-attribute-uservalues"\n                                        ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}">\n                                        <div\n                                            class="slds-form-element__control via-ins-attributes-attribute-range-slider-element-control">\n                                            <div class="slds-slider">\n                                                <input type="range"\n                                                    id="range-slider-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}"\n                                                    min="{{attribute.min}}" max="{{attribute.max}}"\n                                                    class="slds-slider__range" value="{{attribute.userValues}}"\n                                                    ng-model="attribute.userValues"\n                                                    ng-disabled="attribute.ruleSetValue || !product.isSelected || readonly"\n                                                    ng-model-options="{debounce: 0}" />\n                                                <span class="slds-slider__value slds-p-right_none"\n                                                    aria-hidden="true">{{attribute.userValues}}<span\n                                                        ng-if="attribute.dataType === \'percentage\'">%</span></span>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div ng-hide="attribute.hiddenByRule"\n                                        class="slds-size_2-of-12 slds-text-align_right via-ins-attributes-attributes-override"\n                                        ng-if="attribute.showOverride">\n                                        <div class="slds-form-element">\n                                            <div class="slds-form-element__control">\n                                                <span class="slds-checkbox">\n                                                    <input type="checkbox" name="options"\n                                                        id="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}"\n                                                        ng-model="attribute.override" />\n                                                    <label class="slds-checkbox__label"\n                                                        for="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                        <span class="slds-checkbox_faux"></span>\n                                                        <span class="slds-form-element__label slds-m-right_none">\n                                                            <slds-svg-icon sprite="\'utility\'" icon="\'approval\'"\n                                                                size="\'xx-small\'"></slds-svg-icon>\n                                                        </span>\n                                                    </label>\n                                                </span>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div ng-include="\'ruleMessageTooltip.html\'"></div>\n                                </div>\n                                <div class="slds-grid via-ins-attributes-attribute-readonly" ng-if="attribute.readonly">\n                                    <label ng-hide="attribute.hideLabel"\n                                        class="slds-size_5-of-12 via-ins-attributes-attributes-label"\n                                        for="text-input-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">{{attribute.label}}</label>\n                                    <div ng-hide="attribute.hiddenByRule"\n                                        class="slds-p-left_small slds-p-right_medium slds-size_7-of-12 via-ins-attributes-attribute-uservalues">\n                                        <span class="readonly-value"\n                                            ng-if="attribute.dataType === \'currency\'">{{attribute.userValues | currency}}</span>\n                                        <span class="readonly-value"\n                                            ng-if="attribute.dataType !== \'currency\'">{{attribute.userValues}}</span>\n                                    </div>\n                                    <div ng-include="\'ruleMessageTooltip.html\'"></div>\n                                </div>\n                            </div>\n                        </li>\n                    </div>\n                </ul>\n            </li>\n        </ul>\n    </li>\n</ul>\n<script type="text/ng-template" id="ruleMessageTooltip.html">\n    <div class="via-ins-message-icon slds-text-align_center slds-grid" ng-if="attribute.rules.length || attribute.values.length">\n        <div ng-repeat="rule in attribute.rules" ng-if="rule.ruleType === \'Message\' && rule.ruleEvaluation" class="via-rules-message-container slds-m-top_xx-small slds-m-bottom_x-small slds-m-horizontal_xx-small slds-is-relative">\n            <div ng-class="{\'slds-theme--warning\': rule.messages[0].severity === \'WARN\', \'slds-theme--error\': rule.messages[0].severity === \'ERROR\'}"  class="via-ins-rule-message-tooltip slds-popover slds-popover_tooltip slds-nubbin_top-left slds-is-absolute"  role="tooltip" id="help" style="top: 2rem; left: -1rem;">\n                <div class="slds-popover__body" >\n                    {{rule.messages[0].message}}\n                </div>\n            </div>\n            <span class="via-ins-rule-message-icon" ng-if="rule.messages[0].severity === \'WARN\'">\n                <slds-svg-icon extra-classes="\'via-ins-rules-warning\'" sprite="\'utility\'" icon="\'warning\'" size="\'x-small\'">\n                </slds-svg-icon>\n            </span>\n            <span class="via-ins-rule-message-icon" ng-if="rule.messages[0].severity === \'ERROR\'">\n                <slds-svg-icon sprite="\'utility\'"  extra-classes="\'via-ins-rules-error\'" icon="\'error\'" size="\'x-small\'">\n                </slds-svg-icon>\n            </span>\n            <span class="via-ins-rule-message-icon" ng-if="rule.messages[0].severity !== \'WARN\' && rule.messages[0].severity !== \'ERROR\'">\n                <slds-svg-icon sprite="\'utility\'" icon="\'info\'" size="\'x-small\'">\n                </slds-svg-icon>\n            </span>\n        </div>\n        <div ng-repeat="value in attribute.values">\n            <div ng-repeat="rule in value.rules"  ng-if="rule.ruleType === \'Message\' && rule.ruleEvaluation" class="via-rules-message-container slds-m-top_xx-small slds-m-bottom_x-small slds-m-horizontal_xx-small slds-is-relative">\n                <div ng-class="{\'slds-theme--warning\': rule.messages[0].severity === \'WARN\', \'slds-theme--error\': rule.messages[0].severity === \'ERROR\'}"\n                    class="via-ins-rule-message-tooltip slds-popover slds-popover_tooltip slds-nubbin_top-left slds-is-absolute"\n                    role="tooltip" id="help" style="top: 2rem; left: -1rem;">\n                    <div class="slds-popover__body">\n                        {{rule.messages[0].message}}\n                    </div>\n                </div>\n                <span class="via-ins-rule-message-icon" ng-if="rule.messages[0].severity === \'WARN\'">\n                    <slds-svg-icon sprite="\'utility\'" extra-classes="\'via-ins-rules-warning\'" icon="\'warning\'" size="\'x-small\'">\n                    </slds-svg-icon>\n                </span>\n                <span class="via-ins-rule-message-icon" ng-if="rule.messages[0].severity === \'ERROR\'">\n                    <slds-svg-icon sprite="\'utility\'" extra-classes="\'via-ins-rules-error\'" icon="\'error\'" size="\'x-small\'">\n                    </slds-svg-icon>\n                </span>\n                <span class="via-ins-rule-message-icon" ng-if="rule.messages[0].severity !== \'WARN\' && rule.messages[0].severity !== \'ERROR\'">\n                    <slds-svg-icon sprite="\'utility\'" icon="\'info\'" size="\'x-small\'">\n                    </slds-svg-icon>\n                </span>\n            </div>\n        </div>\n    </div>\n<\/script>\n<style type="text/css">\n    .via-slds ins-rules-attributes {\n        width: 100%;\n        display: block;\n    }\n\n    .via-slds .via-ins-rules-warning {\n        fill: #ffb75d !important;\n    }\n\n    .via-slds .via-ins-rules-error {\n        fill: #C23948 !important;\n    }\n\n    .via-slds .via-ins-rule-message-icon:hover {\n        cursor: pointer;\n    }\n\n    .via-slds .via-ins-rule-message-tooltip {\n        visibility: hidden;\n    }\n\n    .via-slds .via-rules-message-container:hover .via-ins-rule-message-tooltip {\n        visibility: visible;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-product .via-right-col-header .via-product-heading-container .via-product-type {\n        line-height: 1.625rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .slds-icon {\n        fill: #16325c;\n        position: relative;\n        top: -1px;\n        transition: transform 250ms ease-in;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category h2 {\n        width: auto;\n        display: inline-block;\n        cursor: pointer;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category {\n        min-height: 2.6rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container {\n        overflow: hidden;\n        transition: height 350ms cubic-bezier(0.65, 0.05, 0.36, 1);\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category:not(.in) .via-ins-attributes-attributes-container {\n        height: 0 !important;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute {\n        min-height: 2rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container.overflow-unset {\n        overflow: unset;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .slds-dropdown {\n        width: auto;\n        min-width: 100%;\n        font-size: 0.8125rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .slds-dropdown .via-ins-attributes-attribute-dropdown-items-item {\n        user-select: none;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .slds-dropdown .via-ins-attributes-attribute-dropdown-items-item.ins-rule-set-value {\n        background-color: #ecebea;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .slds-dropdown .via-ins-attributes-attribute-dropdown-items-item.ins-rule-set-value>a {\n        background-color: #ecebea;\n        cursor: not-allowed;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .slds-dropdown .via-ins-attributes-attribute-dropdown-items-item.ins-rule-set-value>a:hover {\n        background-color: #ecebea;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .slds-dropdown .via-ins-attributes-attribute-dropdown-items-item.ins-rule-set-value>a .slds-icon {\n        fill: #ffffff;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attributes-label {\n        word-wrap: break-word;\n        line-height: 1.3;\n        margin-top: 0.5rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .readonly-value {\n        line-height: 2rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .via-ins-attributes-attribute-range-slider-element-control {\n        position: absolute;\n        top: 50%;\n        transform: translateY(-50%);\n        width: calc(100% - 0.5rem);\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .via-ins-attributes-attribute-currency-symbol {\n        display: inline-block;\n        height: 2rem;\n        line-height: 1.875rem;\n        font-size: 0.9375rem;\n        text-align: center;\n        background-color: #f4f6f9;\n        width: 15%;\n        float: left;\n        border: 1px solid #d8dde6;\n        border-right: none;\n        border-top-left-radius: 0.25rem;\n        border-bottom-left-radius: 0.25rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .via-ins-attributes-attribute-percent-symbol {\n        display: inline-block;\n        height: 2rem;\n        line-height: 1.875rem;\n        font-size: 0.9375rem;\n        text-align: center;\n        background-color: #f4f6f9;\n        width: 15%;\n        float: right;\n        border: 1px solid #d8dde6;\n        border-left: none;\n        border-top-right-radius: 0.25rem;\n        border-bottom-right-radius: 0.25rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .slds-input.datatype-currency,\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .slds-select.datatype-currency {\n        width: 85%;\n        border-top-left-radius: 0;\n        border-bottom-left-radius: 0;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .slds-input.datatype-percentage {\n        width: 85%;\n        border-top-right-radius: 0;\n        border-bottom-right-radius: 0;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues.slds-checkbox label {\n        display: inline-block;\n        margin-top: 0.35rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attributes-override label {\n        line-height: 2rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-messages-message {\n        font-weight: 400;\n        font-size: 0.75rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-messages-message:last-child {\n        margin-bottom: 1rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-messages-message.via-ins-attributes-attribute-messages-message-warn {\n        color: #ffb75d;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-messages-message.via-ins-attributes-attribute-messages-message-error {\n        color: #c23934;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-messages-message.via-ins-attributes-attribute-messages-message-recommendation {\n        color: #1589ee;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category.in h2 .slds-icon {\n        transform: rotate(90deg);\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category.in .via-ins-attributes-attributes-container {\n        transition: height 350ms cubic-bezier(0.65, 0.05, 0.36, 1);\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .ins-out-of-network-col {\n        position: relative;\n        left: 12%;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .vloc-hidden {\n        visibility: hidden\n    }\n</style>\n'),$templateCache.put("ins-rules-attributes-template.tpl.html",'<ul class="via-ins-attributes-products-container">\n    <li class="via-ins-attributes-product" ng-repeat="product in processedProductData" ins-rules-evaluate ins-rules-product="product" one-product="oneProduct">\n        <div class="slds-border_bottom via-right-col-header slds-p-vertical_small slds-m-bottom_small" ng-hide="hideHeader">\n            <div class="via-product-heading-container slds-grid slds-m-bottom_x-small">\n                <div class="slds-text-heading_medium via-product-name slds-truncate slds-size_7-of-8">\n                    <strong>{{product.productName}}</strong>\n                </div>\n                <div class="via-product-type slds-truncate slds-text-align_right slds-size_1-of-8" ng-if="product[\'Product2.\' + $root.nsPrefix + \'Tier__c\'] && product[\'Product2.\' + $root.nsPrefix + \'Tier__c\'].value && product[\'Product2.\' + $root.nsPrefix + \'Tier__c\'].value !== null">\n                    <span>{{product[\'Product2.\' + $root.nsPrefix + \'Tier__c\'].value}}</span>\n                </div>\n            </div>\n            <div class="via-product-btn-group">\n                <button class="slds-button slds-button_brand" ng-click="updateMethod()">{{::$root.customLabels.Update}}</button>\n                \x3c!-- <button class="slds-button slds-button_neutral">Request Approval</button> --\x3e\n            </div>\n        </div>\n        <div class="slds-m-bottom_small via-ins-attributes-expand-collapse-categories" ng-class="{\'slds-p-top_small\' : hideHeader}">\n            <a href="javascript:void(0)" ng-click="categoryAccordion.expandAll(product.attributeCategories.records)">{{::$root.customLabels.InsQuotesExpandAll}}</a>\n            <span class="slds-m-horizontal_x-small">|</span>\n            <a href="javascript:void(0)" ng-click="categoryAccordion.collapseAll(product.attributeCategories.records)">{{::$root.customLabels.InsQuotesCollapseAll}}</a>\n        </div>\n         <ul class="via-ins-attributes-categories-container" ng-model="categoryAccordion.activePanels" data-allow-multiple="true" bs-collapse>\n            <li class="slds-m-bottom_xxx-small via-ins-attributes-category" id="via-ins-attributes-category-{{category.Code__c}}" ng-repeat="category in product.attributeCategories.records" bs-collapse-target style="z-index: {{1000 - $index}}" ng-click="decideOverflowClass(category, $index)" ng-init="decideOverflowClass(category, $index)" ins-rules-check-element="categoryAccordion.activePanels" check-product="product" category-index="{{$index}}" ng-show="(category.productAttributes.records | filter: {hidden: \'!true\', hiddenByRule: \'!true\', inputType: \'!equalizer\'}).length">\n                <h2 class="slds-text-heading_small" bs-collapse-toggle ng-click="toggleOverflow($event); showItems = !showItems">\n                    <slds-svg-icon sprite="\'utility\'" icon="\'chevronright\'" size="\'xx-small\'" extra-classes="\'slds-m-right_xx-small\'"></slds-svg-icon>\n                    <span>{{category.Name}}</span>\n                </h2>\n                <ul ng-if="showItems" class="slds-p-top_x-small slds-p-left_large via-ins-attributes-attributes-container" ng-class="{\'overflow-unset\': category.overflowUnset}" ins-rules-calc-height>\n                    <li class="slds-m-bottom_small via-ins-attributes-attribute" ng-repeat="attribute in category.productAttributes.records | filter: {hidden: \'!true\', hiddenByRule: \'!true\', inputType: \'!equalizer\'}" ng-class="{\'has-rules\': attribute.hasRules}" ins-rules-evaluate="attribute">\n                        <div class="slds-grid via-ins-attributes-attribute-input" ng-if="attribute.inputType !== \'dropdown\' && !attribute.readonly && !attribute.multiselect && attribute.inputType !== \'radio\' && attribute.inputType !== \'range\'">\n                            <label class="slds-size_5-of-12 via-ins-attributes-attributes-label" for="text-input-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}">{{attribute.label}}</label>\n                            <div class="slds-p-left_small via-ins-attributes-attribute-uservalues" ng-class="{\'slds-checkbox\': attribute.inputType === \'checkbox\', \'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}" ng-if="attribute.dataType !== \'date\' && attribute.dataType !== \'datetime\'">\n                                <div class="via-ins-attributes-attribute-currency-symbol" ng-if="attribute.dataType === \'currency\'">$</div>\n                                <input type="{{attribute.inputType}}" id="text-input-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}" class="slds-input datatype-{{attribute.dataType}}" ng-model="attribute.userValues" ng-disabled="attribute.ruleSetValue" />\n                                <div class="via-ins-attributes-attribute-percent-symbol" ng-if="attribute.dataType === \'percentage\'">%</div>\n                                <label class="slds-checkbox__label" for="text-input-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}" ng-if="attribute.inputType === \'checkbox\'">\n                                    <span class="slds-checkbox_faux"></span>\n                                </label>\n                            </div>\n                            <div class="slds-p-left_small via-ins-attributes-attribute-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}" ng-if="attribute.dataType === \'date\' || attribute.dataType === \'datetime\'">\n                                <div class="slds-is-relative via-ins-attributes-attribute-date-container" ng-if="attribute.dataType === \'date\'">\n                                    <input type="text" id="text-input-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}" class="slds-input datatype-{{attribute.dataType}}" ng-model="attribute.userValues" ng-model-options="{debounce: 0}" ng-disabled="attribute.ruleSetValue" slds-date-picker />\n                                </div>\n                                <div class="slds-grid via-ins-attributes-attribute-datetime-container" ng-if="attribute.dataType === \'datetime\'">\n                                    <div class="slds-is-relative slds-size_1-of-2 slds-p-right_xx-small">\n                                        <input type="text" id="text-input-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}" class="slds-input slds-p-horizontal_small datatype-{{attribute.dataType}}" ng-model="attribute.userValues" ng-model-options="{debounce: 0}" ng-disabled="attribute.ruleSetValue" slds-date-picker />\n                                    </div>\n                                    <div class="slds-is-relative slds-size_1-of-2 slds-p-left_xx-small">\n                                        <input type="text" id="datetime-text-input-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}" class="slds-input slds-p-horizontal_small datatype-{{attribute.dataType}}" ng-model="attribute.userValues" ng-disabled="attribute.ruleSetValue" slds-time-picker />\n                                    </div>\n                                </div>\n                            </div>\n                            <div class="slds-size_2-of-12 slds-text-align_right via-ins-attributes-attributes-override" ng-if="attribute.showOverride">\n                                <div class="slds-form-element">\n                                    <div class="slds-form-element__control">\n                                        <span class="slds-checkbox">\n                                            <input type="checkbox" name="options" id="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}" ng-model="attribute.override" />\n                                            <label class="slds-checkbox__label" for="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                <span class="slds-checkbox_faux"></span>\n                                                <span class="slds-form-element__label slds-m-right_none">\n                                                    <slds-svg-icon sprite="\'utility\'" icon="\'approval\'" size="\'xx-small\'"></slds-svg-icon>\n                                                </span>\n                                            </label>\n                                        </span>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="slds-grid via-ins-attributes-attribute-dropdown" ng-if="attribute.inputType === \'dropdown\' && !attribute.multiselect && !attribute.readonly">\n                            <label class="slds-size_5-of-12 via-ins-attributes-attributes-label" for="select-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}">{{attribute.label}}</label>\n                            <div class="slds-p-left_small via-ins-attributes-attribute-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}">\n                                <div class="via-ins-attributes-attribute-currency-symbol" ng-if="attribute.dataType === \'currency\'">$</div>\n                                <div class="slds-select_container">\n                                    <select id="select-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}" class="slds-select datatype-{{attribute.dataType}}" ng-options="value.value as value.label for value in attribute.values | filter: {hiddenByRule: \'!true\'}" ng-model="attribute.userValues" ng-disabled="attribute.ruleSetValue"></select>\n                                </div>\n                            </div>\n                            <div class="slds-size_2-of-12 slds-text-align_right via-ins-attributes-attributes-override" ng-if="attribute.showOverride">\n                                <div class="slds-form-element">\n                                    <div class="slds-form-element__control">\n                                        <span class="slds-checkbox">\n                                            <input type="checkbox" name="options" id="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}" ng-model="attribute.override" />\n                                            <label class="slds-checkbox__label" for="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                <span class="slds-checkbox_faux"></span>\n                                                <span class="slds-form-element__label slds-m-right_none">\n                                                    <slds-svg-icon sprite="\'utility\'" icon="\'approval\'" size="\'xx-small\'"></slds-svg-icon>\n                                                </span>\n                                            </label>\n                                        </span>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="slds-grid via-ins-attributes-attribute-multiselect-checkbox" ng-if="attribute.multiselect && attribute.inputType === \'checkbox\'">\n                            <legend class="slds-size_5-of-12 via-ins-attributes-attributes-label">{{attribute.label}}</legend>\n                            <div class="slds-p-left_small via-ins-attributes-attribute-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}">\n                                <fieldset class="slds-form-element">\n                                    <div class="slds-form-element__control">\n                                        <span class="slds-checkbox" ng-repeat="value in attribute.values" ng-if="!value.hiddenByRule">\n                                            <input type="checkbox" id="attr-ms-cb-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}" checked="" ng-model="attribute.userValues[$index][value.value]" ng-disabled="$index === attribute.ruleSetValueIndex && attribute.ruleSetValue" ng-click="toggleValue(attribute, value)" />\n                                            <label class="slds-checkbox__label" for="attr-ms-cb-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}">\n                                                <span class="slds-checkbox_faux"></span>\n                                                <span class="slds-form-element__label">{{value.label}}</span>\n                                            </label>\n                                        </span>\n                                    </div>\n                                </fieldset>\n                            </div>\n                            <div class="slds-size_2-of-12 slds-text-align_right via-ins-attributes-attributes-override" ng-if="attribute.showOverride">\n                                <div class="slds-form-element">\n                                    <div class="slds-form-element__control">\n                                        <span class="slds-checkbox">\n                                            <input type="checkbox" name="options" id="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}" ng-model="attribute.override" />\n                                            <label class="slds-checkbox__label" for="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                <span class="slds-checkbox_faux"></span>\n                                                <span class="slds-form-element__label slds-m-right_none">\n                                                    <slds-svg-icon sprite="\'utility\'" icon="\'approval\'" size="\'xx-small\'"></slds-svg-icon>\n                                                </span>\n                                            </label>\n                                        </span>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="slds-grid via-ins-attributes-attribute-multiselect-dropdown" ng-if="attribute.multiselect && attribute.inputType === \'dropdown\'">\n                            <label class="slds-size_5-of-12 via-ins-attributes-attributes-label" for="dropdown-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}">{{attribute.label}}</label>\n                            <div class="slds-p-left_small via-ins-attributes-attribute-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}">\n                                <div class="slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open" ng-init="attribute.dropdownOpen = false">\n                                    <button class="slds-button slds-button_neutral via-ins-attributes-attribute-dropdown-button" aria-haspopup="true" title="{{::$root.customLabels.InsButtonShowMore}}" ng-model="attribute.userValues[$index][value.value]" id="dropdown-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}" ng-model="attribute.userValues" ins-dropdown-handler="attribute.dropdownOpen = !attribute.dropdownOpen" restrict-element="via-ins-attributes-attribute-dropdown-items" ng-init="countSelected(attribute)">\n                                        <span>{{attribute.multiSelectCount}} {{::$root.customLabels.Selected}}</span>\n                                        <slds-button-svg-icon sprite="\'utility\'" icon="\'down\'" extra-classes="\'slds-button__icon_right\'"></slds-button-svg-icon>\n                                        <span class="slds-assistive-text">{{::$root.customLabels.InsButtonShowMore}}</span>\n                                    </button>\n                                    <div class="slds-dropdown slds-dropdown_left via-ins-attributes-attribute-dropdown-items" ng-show="attribute.dropdownOpen">\n                                        <ul class="slds-dropdown__list via-ins-attributes-attribute-dropdown-items-list" role="menu">\n                                            <li class="slds-dropdown__item via-ins-attributes-attribute-dropdown-items-item" role="presentation" ng-repeat="value in attribute.values" ng-click="toggleValue(attribute, value, value.ruleSetValue)" ng-if="!value.hiddenByRule" ng-class="{\'ins-rule-set-value\': value.ruleSetValue}">\n                                                <a href="javascript:void(0);" class="via-ins-attributes-attribute-dropdown-items-link" role="menuitem" tabindex="0">\n                                                    <slds-svg-icon sprite="\'utility\'" icon="\'check\'" size="\'x-small\'" extra-classes="\'slds-m-top_xxx-small slds-m-right_x-small\'" ng-class="{\'slds-icon_selected\': attribute.userValues.indexOf(value.value) < 0}"></slds-svg-icon>\n                                                    <span class="slds-truncate" title="Menu Item One">{{value.label}}</span>\n                                                </a>\n                                            </li>\n                                        </ul>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class="slds-size_2-of-12 slds-text-align_right via-ins-attributes-attributes-override" ng-if="attribute.showOverride">\n                                <div class="slds-form-element">\n                                    <div class="slds-form-element__control">\n                                        <span class="slds-checkbox">\n                                            <input type="checkbox" name="options" id="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}" ng-model="attribute.override" />\n                                            <label class="slds-checkbox__label" for="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                <span class="slds-checkbox_faux"></span>\n                                                <span class="slds-form-element__label slds-m-right_none">\n                                                    <slds-svg-icon sprite="\'utility\'" icon="\'approval\'" size="\'xx-small\'"></slds-svg-icon>\n                                                </span>\n                                            </label>\n                                        </span>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="slds-grid via-ins-attributes-attribute-radio-picklist" ng-if="attribute.dataType === \'text\' && attribute.inputType === \'radio\'">\n                            <legend class="slds-size_5-of-12 via-ins-attributes-attributes-label">{{attribute.label}}</legend>\n                            <div class="slds-p-left_small via-ins-attributes-attribute-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}">\n                                <fieldset class="slds-form-element">\n                                    <div class="slds-form-element__control">\n                                        <span class="slds-radio" ng-repeat="value in attribute.values" ng-if="!value.hiddenByRule">\n                                            <input type="radio" id="attr-radio-pl-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}" ng-checked="value.value === attribute.userValues" ng-click="attribute.userValues = value.value" />\n                                            <label class="slds-radio__label" for="attr-radio-pl-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}-{{value.value}}">\n                                                <span class="slds-radio_faux"></span>\n                                                <span class="slds-form-element__label">{{value.label}}</span>\n                                            </label>\n                                        </span>\n                                    </div>\n                                </fieldset>\n                            </div>\n                            <div class="slds-size_2-of-12 slds-text-align_right via-ins-attributes-attributes-override" ng-if="attribute.showOverride">\n                                <div class="slds-form-element">\n                                    <div class="slds-form-element__control">\n                                        <span class="slds-checkbox">\n                                            <input type="checkbox" name="options" id="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}" ng-model="attribute.override" />\n                                            <label class="slds-checkbox__label" for="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                <span class="slds-checkbox_faux"></span>\n                                                <span class="slds-form-element__label slds-m-right_none">\n                                                    <slds-svg-icon sprite="\'utility\'" icon="\'approval\'" size="\'xx-small\'"></slds-svg-icon>\n                                                </span>\n                                            </label>\n                                        </span>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="slds-grid via-ins-attributes-attribute-range-slider" ng-if="attribute.inputType === \'range\'">\n                            <label class="slds-size_5-of-12 via-ins-attributes-attributes-label" for="range-slider-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}">{{attribute.label}}<span ng-if="attribute.max"> ({{attribute.min}} - {{attribute.max}})</span></label>\n                            <div class="slds-is-relative slds-form-element slds-p-left_small via-ins-attributes-attribute-uservalues" ng-class="{\'slds-size_5-of-12 slds-p-right_medium\': attribute.showOverride, \'slds-size_7-of-12\': !attribute.showOverride}">\n                                <div class="slds-form-element__control via-ins-attributes-attribute-range-slider-element-control">\n                                    <div class="slds-slider">\n                                        <input type="range" id="range-slider-{{product.ProductCode}}-{{category.Code__c}}-{{attribute.attributeId}}" min="{{attribute.min}}" max="{{attribute.max}}" class="slds-slider__range" value="{{attribute.userValues}}" ng-model="attribute.userValues" ng-disabled="attribute.ruleSetValue" ng-model-options="{debounce: 0}" />\n                                        <span class="slds-slider__value slds-p-right_none" aria-hidden="true">{{attribute.userValues}}<span ng-if="attribute.dataType === \'percentage\'">%</span></span>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class="slds-size_2-of-12 slds-text-align_right via-ins-attributes-attributes-override" ng-if="attribute.showOverride">\n                                <div class="slds-form-element">\n                                    <div class="slds-form-element__control">\n                                        <span class="slds-checkbox">\n                                            <input type="checkbox" name="options" id="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}" ng-model="attribute.override" />\n                                            <label class="slds-checkbox__label" for="attribute-override-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                <span class="slds-checkbox_faux"></span>\n                                                <span class="slds-form-element__label slds-m-right_none">\n                                                    <slds-svg-icon sprite="\'utility\'" icon="\'approval\'" size="\'xx-small\'"></slds-svg-icon>\n                                                </span>\n                                            </label>\n                                        </span>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="slds-grid via-ins-attributes-attribute-readonly" ng-if="attribute.readonly">\n                            <label class="slds-size_5-of-12 via-ins-attributes-attributes-label" for="text-input-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">{{attribute.label}}</label>\n                            <div class="slds-p-left_small slds-p-right_medium slds-size_7-of-12 via-ins-attributes-attribute-uservalues">\n                                <div class="slds-form-element" ng-if="attribute.inputType === \'checkbox\' && !attribute.multiselect">\n                                    <div class="slds-form-element__control">\n                                        <span class="slds-checkbox">\n                                            <input type="checkbox" name="options" id="attribute-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}" ng-model="attribute.userValues" ng-disabled="true"/>\n                                            <label class="slds-checkbox__label" for="attribute-checkbox-{{$parent.$parent.$index}}-{{$parent.$index}}-{{$index}}">\n                                                <span class="slds-checkbox_faux"></span>\n                                            </label>\n                                        </span>\n                                    </div>\n                                </div>\n                                <span class="readonly-value" ng-if="attribute.dataType === \'currency\'">{{attribute.userValues | currency}}</span>\n                                <span class="readonly-value" ng-if="attribute.dataType !== \'currency\' &&  (attribute.inputType !== \'checkbox\' || attribute.multiselect)">{{attribute.userValues}}</span>\n                            </div>\n                        </div>\n                        <ul class="via-ins-attributes-attribute-messages-container" ng-if="attribute.rules.length">\n                            <li class="slds-m-top_x-small via-ins-attributes-attribute-messages-message via-ins-attributes-attribute-messages-message-{{rule.messages[0].severity.toLowerCase()}}" ng-repeat="rule in attribute.rules" ng-if="rule.ruleType === \'Message\' && rule.ruleEvaluation" ng-class="{\'\': rule.messages[0].severity}">{{rule.messages[0].message}}</li>\n                        </ul>\n                        <div class="via-ins-attributes-attribute-messages-container" ng-if="attribute.values.length && value.rules" ng-repeat="value in attribute.values">\n                            <ul>\n                                <li class="slds-m-top_x-small via-ins-attributes-attribute-messages-message via-ins-attributes-attribute-messages-message-{{rule.messages[0].severity.toLowerCase()}}" ng-repeat="rule in value.rules" ng-if="rule.ruleType === \'Message\' && rule.ruleEvaluation" ng-class="{\'\': rule.messages[0].severity}">{{rule.messages[0].message}}</li>\n                            </ul>\n                        </div>\n                    </li>\n                </ul>\n            </li>\n        </ul>\n    </li>\n</ul>\n<style type="text/css">\n    .via-slds ins-rules-attributes {\n        width: 100%;\n        display: block;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-product .via-right-col-header .via-product-heading-container .via-product-type {\n        line-height: 1.625rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .slds-icon {\n        fill: #16325c;\n        position: relative;\n        top: -1px;\n        transition: transform 250ms ease-in;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category h2 {\n        width: auto;\n        display: inline-block;\n        cursor: pointer;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container {\n        overflow: hidden;\n        transition: height 350ms cubic-bezier(0.65, 0.05, 0.36, 1);\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category:not(.in) .via-ins-attributes-attributes-container {\n        height: 0 !important;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container.overflow-unset {\n        overflow: unset;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .slds-dropdown {\n        width: auto;\n        min-width: 100%;\n        font-size: 0.8125rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .slds-dropdown .via-ins-attributes-attribute-dropdown-items-item {\n        user-select: none;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .slds-dropdown .via-ins-attributes-attribute-dropdown-items-item.ins-rule-set-value {\n        background-color: #ecebea;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .slds-dropdown .via-ins-attributes-attribute-dropdown-items-item.ins-rule-set-value > a {\n        background-color: #ecebea;\n        cursor: not-allowed;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .slds-dropdown .via-ins-attributes-attribute-dropdown-items-item.ins-rule-set-value > a:hover {\n        background-color: #ecebea;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .slds-dropdown .via-ins-attributes-attribute-dropdown-items-item.ins-rule-set-value > a .slds-icon {\n        fill: #ffffff;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attributes-label {\n        word-wrap: break-word;\n        line-height: 1.3;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .readonly-value {\n        line-height: 2rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .via-ins-attributes-attribute-range-slider-element-control {\n        position: absolute;\n        top: 50%;\n        transform: translateY(-50%);\n        width: calc(100% - 0.5rem);\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .via-ins-attributes-attribute-currency-symbol {\n        display: inline-block;\n        height: 2rem;\n        line-height: 1.875rem;\n        font-size: 0.9375rem;\n        text-align: center;\n        background-color: #f4f6f9;\n        width: 15%;\n        float: left;\n        border: 1px solid #d8dde6;\n        border-right: none;\n        border-top-left-radius: 0.25rem;\n        border-bottom-left-radius: 0.25rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .via-ins-attributes-attribute-percent-symbol {\n        display: inline-block;\n        height: 2rem;\n        line-height: 1.875rem;\n        font-size: 0.9375rem;\n        text-align: center;\n        background-color: #f4f6f9;\n        width: 15%;\n        float: right;\n        border: 1px solid #d8dde6;\n        border-left: none;\n        border-top-right-radius: 0.25rem;\n        border-bottom-right-radius: 0.25rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .slds-input.datatype-currency,\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .slds-select.datatype-currency {\n        width: 85%;\n        border-top-left-radius: 0;\n        border-bottom-left-radius: 0;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues .slds-input.datatype-percentage {\n        width: 85%;\n        border-top-right-radius: 0;\n        border-bottom-right-radius: 0;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-uservalues.slds-checkbox label {\n        display: inline-block;\n        margin-top: 0.35rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attributes-override label {\n        line-height: 2rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-messages-message {\n        font-weight: 400;\n        font-size: 0.75rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-messages-message:last-child {\n        margin-bottom: 1rem;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-messages-message.via-ins-attributes-attribute-messages-message-warn {\n        color: #ffb75d;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-messages-message.via-ins-attributes-attribute-messages-message-error {\n        color: #c23934;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category .via-ins-attributes-attributes-container .via-ins-attributes-attribute .via-ins-attributes-attribute-messages-message.via-ins-attributes-attribute-messages-message-recommendation {\n        color: #1589ee;\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category.in h2 .slds-icon {\n        transform: rotate(90deg);\n    }\n\n    .via-slds .via-ins-attributes-products-container .via-ins-attributes-categories-container .via-ins-attributes-category.in .via-ins-attributes-attributes-container {\n        transition: height 350ms cubic-bezier(0.65, 0.05, 0.36, 1);\n    }\n</style>\n')}]);

},{}]},{},[2]);
})();

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
angular.module('insFormulaBuilder', ['vlocity', 'CardFramework' ,'ngSanitize', 'forceng','tmh.dynamicLocale', 'cfp.hotkeys', 'sldsangular', 'monacoEditor'])
.config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    }]).config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }]).run(['$rootScope', function($rootScope) {
        'use strict';
        $rootScope.nsPrefix = fileNsPrefix();
        $rootScope.isLoaded = false;
    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        'use strict';
        return function(sldsURL) {
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]);

// Controllers
require('./modules/insFormulaBuilder/controller/vlocInsRulesContainerCtrl.js');
require('./modules/insFormulaBuilder/controller/vlocInsRulesEligibilityCtrl.js');
require('./modules/insFormulaBuilder/controller/vlocInsRulesRequirementsCtrl.js');

// Factory
require('./modules/insFormulaBuilder/factory/vlocInsProductRulesService.js');


},{"./modules/insFormulaBuilder/controller/vlocInsRulesContainerCtrl.js":2,"./modules/insFormulaBuilder/controller/vlocInsRulesEligibilityCtrl.js":3,"./modules/insFormulaBuilder/controller/vlocInsRulesRequirementsCtrl.js":4,"./modules/insFormulaBuilder/factory/vlocInsProductRulesService.js":5}],2:[function(require,module,exports){
angular.module('insFormulaBuilder').controller('vlocInsRulesContainerCtrl', ['$scope', '$rootScope', '$window', 'vlocInsProductRulesService', function($scope, $rootScope, $window, vlocInsProductRulesService) {
    'use strict';
    function getTypeAheadObjectsFields() {
        var inputMap = {};
        inputMap.productId = $scope.params.id;
        vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler', 'getTypeAheadObjectsFields', inputMap).then(function(result) {
            $rootScope.typeAheadObjectsFields = result.typeAheadMaps;
            console.log('$rootScope.typeAheadObjectsFields', $rootScope.typeAheadObjectsFields);
        }, function(error) {
            console.error('There has been an error in getTypeAheadObjectsFields', error);
        });
    }

    function setCustomMethods() {
        var functionKind = 2;
        if (!$window.additionalCompletionItems || typeof $window.additionalCompletionItems !== 'object') {
            $window.additionalCompletionItems = {
                Keyword: [],
                Function: []
            };
        }
        if ($window.monaco && $window.monaco.languages && $window.monaco.languages.CompletionItemKind.Function) {
            functionKind = $window.monaco.languages.CompletionItemKind.Function;
        }
        $window.additionalCompletionItems.Function = [{
            label: 'EXIST',
            kind: functionKind,
            insertText: {
                value: 'EXIST(${1:attribute}, ${2:value})'
            }
        }, {
            label: 'NOTEXIST',
            kind: functionKind,
            insertText: {
                value: 'NOTEXIST(${1:attribute}, ${2:value})'
            }
        }, {
            label: 'LookupMatrix',
            kind: functionKind,
            insertText: {
                value: 'LookupMatrix(\'${1:matrixName}\', INPUT(\'${2:inputVariable1}\', ${3:attribute}), INPUT(\'${4:inputVariable2}\', ${5:attribute}), \'${6:outputVariable}\')'
            }
        },{
            label: 'InvokeIP',
            kind: functionKind,
            insertText: {
                value: 'InvokeIP(${1:condition})'
            }
        },{
            label: 'INPUT',
            kind: functionKind,
            insertText: {
                value: 'INPUT(${1:condition})'
            }
        }];
    }

    function getTypeAheadAttributes() {
        var inputMap = {};
        $rootScope.insTypeAheads = {};
        inputMap.productId = $scope.params.id;
        vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler', 'getTypeAheadAttributes', inputMap).then(function(result) {
            console.log('success in getTypeAheadAttributes:', result);
            if (result.typeAheadMaps) {

                vlocInsProductRulesService.formatTypeAheadArray(result.typeAheadMaps).then(function(insTypeAheadsFormattedInitialResult) {
                    $rootScope.insTypeAheads.initial = insTypeAheadsFormattedInitialResult;
                    console.log('$rootScope.insTypeAheads', 'initial', $rootScope.insTypeAheads);
                }, function(error) {
                    console.error('There has been an error in formatTypeAheadArray', error);
                });

                if (location.href.indexOf('InsuranceProductRules') > -1) {
                    vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler', 'getTypeAheadObjectsFields', inputMap).then(function(result2) {
                        if (result2.typeAheadMaps) {
                            angular.forEach(result2.typeAheadMaps, function(typeAheadMap, key) {
                                var combinedTypeAheads = result.typeAheadMaps;
                                if (!(key in $rootScope.insTypeAheads)) {
                                    combinedTypeAheads = combinedTypeAheads.concat(typeAheadMap);
                                    console.log('combinedTypeAheads', combinedTypeAheads);
                                    vlocInsProductRulesService.formatTypeAheadArray(combinedTypeAheads).then(function(result3) {
                                        $rootScope.insTypeAheads[key] = result3;
                                        console.log('$rootScope.insTypeAheads', key, $rootScope.insTypeAheads);
                                    }, function(error) {
                                        console.error('There has been an error in formatTypeAheadArray', error);
                                    });
                                }
                            });
                        }
                    }, function(error) {
                        console.error('There has been an error in getTypeAheadObjectsFields', error);
                    });
                }
            }
        }, function(error) {
            console.error('There has been an error in formatTypeAheadArray', error);
        });

        setCustomMethods();
    }
    if(!$rootScope.insTypeAheads) {
        getTypeAheadAttributes();
    }

    function getApplicableTypeOptions() {
        var inputMap = {};
        vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler', 'getListOfApplicableProdRequirementTypes', inputMap).then(function(result) {
            $rootScope.applicableTypeOptions = result.applicableTypes;
        }, function(error) {
            console.error('There has been an error in getListOfApplicableProdRequirementTypes', error);
        });
    }
    if(!$rootScope.applicableTypeOptions){
        getApplicableTypeOptions();
    }

    /* 
    * Set scope for generic formula builder 
    * @param {Object} object  
    */
    $scope.initFormulaBuilder = function(object) {
        if(!$scope.object){
            $scope.object = object; // expect value is just a value
        }
        if ($rootScope.insTypeAheads && $rootScope.insTypeAheads.initial) {
            $scope.object.typeAheadKeywords = angular.copy($rootScope.insTypeAheads.initial);
        }
    };

    /* 
    * Fn to apply type aheads for monaco editor
    */
    $scope.switchTypeAheadDataHelper = function(){
        $window.additionalCompletionItems.Keyword = angular.copy($rootScope.insTypeAheads.initial);
    }

}]);
},{}],3:[function(require,module,exports){
angular.module('insFormulaBuilder').controller('vlocInsRulesEligibilityCtrl', ['$scope', '$rootScope', '$window', '$timeout', 'vlocInsProductRulesService', 'dataService', 'userProfileService', function($scope, $rootScope, $window, $timeout, vlocInsProductRulesService, dataService, userProfileService) {
    'use strict';
    $scope.vlocInsProductRulesService = vlocInsProductRulesService;
    $scope.eligibility = {
        rule: '',
        saveStatus: 'unsaved',
        typeAheadKeywords: []
    };
    $scope.rule = {
        rule: '',
        saveStatus: 'unsaved',
        typeAheadKeywords: []
    };
    $scope.popoverOpen = false;

    $scope.customLabels = {};
    const translationKeys = ['InsProductEligibility', 'InsProductExpression', 'InsRuleCommentsPlaceholder', 'InsEligibilityRuleComment', 'InsRuleClassOverride'];

    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                $scope.customLabels = translatedLabels;
            }
        )
    })

    /* 
    * Init eligibility object
    * @param  {Object}  obj returned json obj || {string} rule returned can be obj or string
    */
    $scope.initEligibility = function(rule, id) {
        const assignString = typeof rule === 'string' || !rule; //if rule obj is a string or null
        $scope.eligibility.rule = assignString ? rule : rule.eligibilityRule;
        $scope.eligibility.eligibilityRuleComment = assignString ? '' : rule.eligibilityRuleComment;
        $scope.eligibility.saveStatus = 'saved';
        let productTypeAheads;
        if (id) {
            const inputMap = {
                productId : id, 
                objectType: 'Product2'
            };
            vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler', 'getTypeAheadObjectFields', inputMap).then(function (result) {
                if (result && result.typeAheadMaps && result.typeAheadMaps[0]) {
                    productTypeAheads = result.typeAheadMaps[0].fieldList;
                    if (productTypeAheads.length > 0) {
                        productTypeAheads.forEach(typeAhead => {
                            typeAhead.insertText = {value : typeAhead.fieldName}; 
                            typeAhead.label = typeAhead.fieldLabel;
                            typeAhead.kind = 13;
                        });
                    }
                }
            }, function (error) {
                console.error('error in getTypeAheadObjectFields', error);
            });
        }
        $timeout(function() {
            if ($rootScope.insTypeAheads && $rootScope.insTypeAheads.initial) {
                $scope.eligibility.typeAheadKeywords = angular.copy($rootScope.insTypeAheads.initial);
                if (productTypeAheads) {
                    $scope.eligibility.typeAheadKeywords = $scope.eligibility.typeAheadKeywords.concat(productTypeAheads);
                }
            }
        }, 1000);
    };

    $scope.initEligibilityTypeAheads = function(typeAheads) {
        $timeout(function() {
            $scope.eligibility.typeAheadKeywords = typeAheads;
        }, 1000);
    };

    $scope.initRule = function (rule, multiRule) {
        if (multiRule) { //if multi rule init differently
            initMultiRule(rule, $scope.obj.selectValidationMessage);
        } else {
            if (!$scope.rule.rule) {
                $scope.rule.rule = rule; // expect rule is just a rule
            }
            $scope.rule.saveStatus = 'saved';
            $timeout(function () {
                if ($rootScope.insTypeAheads && $rootScope.insTypeAheads.initial) {
                    $scope.rule.typeAheadKeywords = angular.copy($rootScope.insTypeAheads.initial);
                }
            }, 1000);
        }
    };

    //Delete a rule, save
    $scope.deleteMultiRule = function (index) {
        $scope.rules.splice(index, 1);
        updateMultiRuleStatusHelper('unsaved');
        $scope.saveRuleCoverage($scope.obj.Id, 'selectValidationCriteria');
    }

    /* 
    * Helper function to init multi rule by creating a standard rule obj and adding to rules queue
    *  @param  {string} rules is either a stringified array of objs or a string, we handle both cases
    *  @param  {string} message is a stringied array of objs  
    */
    let initMultiRule = function (rules, messages) {
        $scope.rules = []; //create a rules array with all components of rules / messages, we compile codes on save

        if (rules || $scope.obj.ClassSelectValidationCriteria) { // if Class multi-rule, combine w/ product multi-rule to display on UI
            // Newly added class rules will have code `class_code_`. Check `code_` for Class to prevent breaking old rules
            if ((rules && rules.indexOf('code_') > -1) || ($scope.obj.ClassSelectValidationCriteria && ($scope.obj.ClassSelectValidationCriteria.indexOf('class_code_') > -1 || $scope.obj.ClassSelectValidationCriteria.indexOf('code_') > -1))) {
                rules = JSON.parse(rules);

                if(messages && typeof messages === 'string') {
                    messages = JSON.parse(messages); //messages was always stringified
                }

                let classValidationRules = [];
                if($scope.obj.ClassSelectValidationCriteria) {
                    classValidationRules = typeof $scope.obj.ClassSelectValidationCriteria === 'string' ?
                        JSON.parse($scope.obj.ClassSelectValidationCriteria) : $scope.obj.ClassSelectValidationCriteria;

                    classValidationRules.forEach(function(rule){
                        rule.isClassRule = true; // set isClassRule on each class validation rule to make readonly on UI
                    });
                }

                let classValidationMessages = [];
                if($scope.obj.ClassSelectValidationMessage) {
                    classValidationMessages = typeof $scope.obj.ClassSelectValidationMessage === 'string' ?
                        JSON.parse($scope.obj.ClassSelectValidationMessage) : $scope.obj.ClassSelectValidationMessage;

                    classValidationMessages.forEach(function(message){
                        message.isClassRule = true; // set isClassRule on each class validation message to make readonly on UI
                    });
                }

                rules = rules ? classValidationRules.concat(rules) : classValidationRules;
                messages = messages ? classValidationMessages.concat(messages) : classValidationMessages;
            } else { // TODO: Check if this condition will apply to Class rules
                let temp = {};
                temp.expression = rules;
                rules = [temp]; //turn legacy implementation into arrays
                messages = [messages];
            }
            for (let i = 0; i < rules.length; i++) {
                let ruleObj = {
                    rule: rules[i].expression,
                    message: messages[i].message,
                    severity: messages[i].severity,
                    saveStatus: 'saved'
                }
                if(rules[i] && rules[i].isClassRule) {
                    ruleObj.isClassRule = true;
                }
                $scope.rules.push(ruleObj);
            }
        } else {
            $scope.addMultiRule();
        }

        $timeout(function () {
            if ($rootScope.insTypeAheads && $rootScope.insTypeAheads.initial) {
                for (let i = 0; i < $scope.rules.length; i++) {
                    $scope.rules[i].typeAheadKeywords = angular.copy($rootScope.insTypeAheads.initial);
                }
            }
        }, 1000);
    };

    //Add empty rule node to rules queue
    $scope.addMultiRule = function () {
        if(!$scope.rules){
            $scope.rules = [];
        }
        let emptyObj = {
            rule: '',
            message: '',
            severity: '',
            saveStatus: 'saved',
            typeAheadKeywords: angular.copy($rootScope.insTypeAheads.initial)
        };
        $scope.rules.push(emptyObj);
    }

    //handle save for multi rules, always generate code so two arrays in sync
    let saveMultiRuleHelper = function (inputMap) {
        const productRules =  $scope.rules.filter(function(rule) {
            return !rule.isClassRule; // filter product rules from Class rules
        });
        
        if(productRules.length){
            $scope.obj.selectValidationMessage = [];
            $scope.obj.selectValidationCriteria = [];
            for (let i = 0; i < productRules.length; i++) {
                let rulesObj = {
                    expression: productRules[i].rule,
                    code: $rootScope.productRecordType === 'Class' ? 'class_code_' + i : 'code_' + i
                };
                let messageObj = {
                    message: productRules[i].message,
                    severity: productRules[i].severity,
                    code: $rootScope.productRecordType === 'Class' ? 'class_code_' + i : 'code_' + i
                };
                $scope.obj.selectValidationMessage.push(messageObj);
                $scope.obj.selectValidationCriteria.push(rulesObj);
            }
            inputMap['selectValidationMessage'] = JSON.stringify($scope.obj.selectValidationMessage); //obj and input map sync
            inputMap['selectValidationCriteria'] = JSON.stringify($scope.obj.selectValidationCriteria); //obj and input map sync
        } else {
            inputMap['selectValidationMessage'] = null;
            inputMap['selectValidationCriteria'] = null;
        }
        return inputMap;
    }

    //Set status for every item of rules queue
    let updateMultiRuleStatusHelper = function (status) {
        for (let i = 0; i < $scope.rules.length; i++) {
            $scope.rules[i].saveStatus = status;
        }
    }

    $scope.initRuleTypeAheads = function (typeAheads) {
        $timeout(function () {
            $scope.rule.typeAheadKeywords = typeAheads;
        }, 1000);
    };

    /* 
    * Save eligibility rule, assign proper inputMap keys and invoke saveEligibilityRule
    */
    $scope.saveEligibilityRule = function () {
        var inputMap = {
            productId: $scope.params.id,
            eligibilityRule: $scope.eligibility.rule,
            eligibilityRuleComment:  $scope.eligibility.eligibilityRuleComment
        };
        $scope.eligibility.saveStatus = 'unsaved';
        $scope.popupOpen = false;
        vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler', 'saveEligibilityRule', inputMap).then(function (result) {
            console.log('success in saveEligibilityRule', result, $scope.eligibility);
            $scope.eligibility.saveStatus = 'saved';
        }, function (error) {
            $scope.eligibility.saveStatus = 'error';
            console.error('error in saveEligibilityRule', error, $scope.eligibility);
        });
    };

    /* Use this function in product admin coverages to call save
    *  @param  {id}     string id of coverage
    *  @param {key}     string of field in coverage that contains rule i.e. 'selectValidationCriteria', use key to send to db
    *  for: 'selectValidationMessage' stringify '{message: '', severity: ''}' for all else just send expression
    *  rootScope.count[id][key] keeps track of how many rules per coverage t
    */
    $scope.saveRuleCoverage = function (id, key) {
        let isMultiRuleSave = false;
        let inputMap = {
            pciId: $scope.obj.Id,
            isOptional: $scope.obj.IsOptional,
            overriddenAttributeAssignmentList: []
        };
        $rootScope.count[id][key] = $scope.rule.rule.length > 0;
        if (key === 'selectValidationMessage' || key === 'selectValidationCriteria') {
            isMultiRuleSave = true;
            saveMultiRuleHelper(inputMap);
        } else {
            inputMap[key] = $scope.rule.rule;
        }
        $scope.rule.saveStatus = 'unsaved';
        console.log(inputMap);
        vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler', 'saveCoverage', inputMap).then(function (result) {
            console.log('success in saveRuleCoverage', result, $scope.rule, $scope.rules);
            $scope.rule.saveStatus = 'saved';
            if (isMultiRuleSave) {
                $rootScope.count[$scope.obj.Id]['selectValidationCriteria'] = $scope.rules.length;
                updateMultiRuleStatusHelper('saved');
            }
        }, function (error) {
            $scope.rule.saveStatus = 'error';
            console.error('error in saveRuleCoverage', error, $scope.rule, $scope.rules);
            if (isMultiRuleSave) {
                updateMultiRuleStatusHelper('error');
            }
        });
    };

    $scope.saveEligibilityRuleCoverage = function (id) {
        var inputMap = {
            pciId: $scope.obj.Id,
            isOptional: $scope.obj.IsOptional,
            eligibilityRule: $scope.eligibility.rule,
            overriddenAttributeAssignmentList: []
        };
        $rootScope.count[id].EligibilityCriteria = $scope.eligibility.rule.length > 0;
        $scope.eligibility.saveStatus = 'unsaved';
        console.log(inputMap);
        vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler', 'saveCoverage', inputMap).then(function (result) {
            console.log('success in saveEligibilityRule', result, $scope.eligibility);
            $scope.eligibility.saveStatus = 'saved';
        }, function (error) {
            $scope.eligibility.saveStatus = 'error';
            console.error('error in saveEligibilityRule', error, $scope.eligibility);
        });
    };

    $scope.saveIO = function () {
        var inputMap = {
            productRatingInfo: $scope.records.ratingMappings.productRatingInfo,
            effectiveDate: $scope.effectiveDate
        };
        vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler',
            'saveRatingInputOutputs', inputMap).then(function (result) {
                console.log('success in saveEligibilityRule', result, $scope.eligibility);
                $scope.eligibility.saveStatus = 'saved';
            }, function (error) {
                $scope.eligibility.saveStatus = 'error';
                console.error('error in saveEligibilityRule', error, $scope.eligibility);
            });
    };


    $scope.markExpressionUnsaved = function (event, index) {
        if (event.originalEvent.keyCode === 8 || (event.originalEvent.keyCode >= 46 && event.originalEvent.keyCode <= 90) || event.originalEvent.keyCode >= 186) {
            if (index >= 0) {
                $scope.rules[index].saveStatus = 'unsaved';
            } else {
                $scope.eligibility.saveStatus = 'unsaved';
            }
        }
    };

}]);

},{}],4:[function(require,module,exports){
angular.module('insFormulaBuilder').controller('vlocInsRulesRequirementsCtrl', ['$scope', '$rootScope', '$window', '$timeout', 'vlocInsProductRulesService', 'dataService', 'userProfileService', function($scope, $rootScope, $window, $timeout, vlocInsProductRulesService, dataService, userProfileService) {
    'use strict';
    var defaultActionOption = {
        actionDisplayLabel: '',
        actionId: null,
        actionName: null
    };
    $scope.productRequirements = [];
    $scope.applicableTypeOptions = $rootScope.applicableTypeOptions;
    $scope.vlocInsProductRulesService = vlocInsProductRulesService;
    $scope.customLabels = {};
    $scope.popoverOpen = [];

    const translationKeys = ['InsProductUnderwriting', 'InsProductUniqueNameMessage', 'InsProductUnderwritingRule', 'InsProductUnderwritingRule', 'InsProductTransitionName', 'Action', 'Active',
        'InsProductDeleteRequirement', 'InsProductConfirmDelete', 'InsProductDeleteRequirementConfirmation', 'InsButtonCancel', 'InsProductMessage', 'InsProductExpression', 'InsProductSeverity', 'InsProductTransitionNameRequired',
        'InsProductNoStatesReturnedFor', 'InsProductApplicableType', 'Name', 'InsUnderwritingRuleComment', 'InsRuleCommentsPlaceholder', 'InsRuleClassOverride'
    ];

    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                $scope.customLabels = translatedLabels;
            }
        )
    })


    $scope.initRequirements = function(obj) {
        $scope.productRequirements = obj.productRequirements;
        angular.forEach($scope.productRequirements, function(req, i) {
            req.nameUnique = true;
            if (req.state && req.stateOptions) {
                angular.forEach(req.stateOptions, function(stateOption) {
                    if (stateOption.stateName === req.state) {
                        req.state = stateOption;
                    }
                });
            }
            if (req.actionOptions) {
                req.actionOptions = [defaultActionOption].concat(req.actionOptions);
            }
            $timeout(function() {
                req.saveStatus = 'saved';
                if (!req.typeAheadKeywords) {
                    req.typeAheadKeywords = angular.copy($rootScope.insTypeAheads[req.objectType]);
                }
            }, 1000);
        });
        if (!$scope.productRequirements.length) {
            $scope.addRequirement();
        }
        // Hide VF page spinner:
        angular.element('.vloc-ins-product-model-initial-spinner').hide();
    };

    $scope.getObjectStates = function(requirement) {
        var inputMap = {};
        var formattedFieldList;
        if (requirement.objectType && requirement.name) {
            requirement.saveStatus = 'unsaved';
            inputMap.objectType = requirement.objectType;
            vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler', 'getObjectStates', inputMap).then(function(result) {
                requirement.stateOptions = result.states;
                requirement.checkedStates = false;
                console.log('requirement.stateOptions', requirement.stateOptions);
                if ($rootScope.insTypeAheads[requirement.objectType]) {
                    requirement.typeAheadKeywords = angular.copy($rootScope.insTypeAheads[requirement.objectType]);
                }
                $scope.saveProductRequirement(requirement);
            }, function(error) {
                requirement.saveStatus = 'error';
                console.error('error in vlocInsProductRulesService.getObjectStates', error);
            });
        } else {
            console.log('$scope.getObjectStates: no requirement.objectType', requirement);
        }
    };

    $scope.getStateActions = function(requirement) {
        var inputMap = {};
        if (requirement.state && requirement.name) {
            requirement.saveStatus = 'unsaved';
            inputMap.stateId = requirement.state.stateId;
            vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler', 'getStateActions', inputMap).then(function(result) {
                requirement.actionOptions = result.stateActions.length ? 
                    [defaultActionOption].concat(result.stateActions) : 
                    result.stateActions;
                console.log('requirement.actionOptions', requirement.actionOptions);
                $scope.saveProductRequirement(requirement);
            }, function(error) {
                requirement.saveStatus = 'error';
                console.error('error in getStateActions', error);
            });
        } else {
            console.log('$scope.getStateActions: no requirement.state', requirement);
        }
    };

    /* 
    * Save requirement 
    * @param  {Object}  requirement 
    * @param  {Integer} index, if index close popover
    */
    $scope.saveProductRequirement = function(requirement, index) {
        var inputMap = {};
        if (requirement.name && requirement.objectType && requirement.state.stateId && !$rootScope.saveProcessing) {
            requirement.saveStatus = 'unsaved';
            inputMap.productRequirement = requirement;
            console.log('productRequirement sent to service:', inputMap);
            $rootScope.saveProcessing = true;
            vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler', 'saveProductRequirement', inputMap).then(function(result) {
                console.log('success in saveProductRequirement', result);
                requirement.Id = result.Id;
                requirement.saveStatus = 'saved';
                $rootScope.saveProcessing = false;
            }, function(error) {
                console.error('error in saveProductRequirement', error);
                requirement.saveStatus = 'error';
            });
        } else if ($rootScope.saveProcessing) {
            $timeout(function() {
                $scope.saveProductRequirement(requirement);
            }, 500);
        } else {
            console.log('cannot save because a required input is missing', requirement);
        }
    };

    $scope.isNameUnique = function(requirement, index) {
        var nameNotUnique = false;
        if (requirement.name) {
            angular.forEach($scope.productRequirements, function(req, i) {
                if (!nameNotUnique && req.name === requirement.name && i !== index) {
                    nameNotUnique = true;
                }
            });
        }
        if (requirement.Id) {
            $scope.saveProductRequirement(requirement);
        }
        requirement.nameUnique = !nameNotUnique;
    };

    $scope.checkStates = function(requirement) {
        if (!requirement.checkedStates && requirement.objectType && requirement.name) {
            $timeout(function() {
                if (!requirement.stateOptions.length) {
                    return false;
                }
                return true;
            }, 250);
            requirement.checkedStates = true;
        }
        return true;
    };

    $scope.addRequirement = function() {
        var newRequirement = {
            name: '',
            objectType: '',
            state: {},
            condition: '',
            message: '',
            isActive: false,
            nameUnique: true,
            productId: $scope.params.id,
            stateOptions: [],
            saveStatus: 'unsaved',
            typeAheadKeywords: $rootScope.insTypeAheads.initial,
            actionId: null
        };
        if ($rootScope.insTypeAheads.initial) {
            newRequirement.typeAheadKeywords = angular.copy($rootScope.insTypeAheads.initial);
        }
        if ($scope.productRequirements.length) {
            newRequirement.newRequirement = true;
        }
        $scope.productRequirements.push(newRequirement);
        if ($scope.productRequirements.length > 1) {
            $timeout(function() {
                delete $scope.productRequirements[$scope.productRequirements.length - 1].newRequirement;
            }, 200);
        }
    };

    $scope.deleteRequirement = function(requirement, index) {
        var inputMap = {};
        requirement.inDelete = !requirement.inDelete;
        if (requirement.Id && requirement.Id !== null) {
            inputMap.Id = requirement.Id;
            vlocInsProductRulesService.performApexRemoteAction($scope, 'InsuranceProductAdminHandler', 'deleteProductRequirement', inputMap).then(function(result) {
                console.log('success in deleteProductRequirement', result);
            }, function(error) {
                console.error('error in deleteProductRequirement', error);
            });
        }
        $timeout(function() {
            requirement.isDeleted = true;
        }, 250);
        $timeout(function() {
            requirement.isDeleted = false;
            $scope.productRequirements.splice(index, 1);
            console.log($scope.productRequirements);
        }, 900);
    };

    $scope.deletePrompt = function(requirement) {
        if (!requirement.inDelete) {
            angular.forEach($scope.productRequirements, function(req) {
                req.inDelete = false;
            });
        }
        requirement.inDelete = !requirement.inDelete;
    };

    $scope.markExpressionUnsaved = function(event, requirement) {
        if (event.originalEvent.keyCode === 8 || (event.originalEvent.keyCode >= 46 && event.originalEvent.keyCode <= 90) || event.originalEvent.keyCode >= 186) {
            requirement.saveStatus = 'unsaved';
        }
    };
}]);
},{}],5:[function(require,module,exports){
angular.module('insFormulaBuilder').factory('vlocInsProductRulesService', ['$rootScope', '$window', '$q', 'dataSourceService', function($rootScope, $window, $q, dataSourceService) {
    'use strict';
    function formatArray(typeAheadArray) {
        var formattedArray = [];
        var keywordKind = 13;
        if ($window.monaco && $window.monaco.languages && $window.monaco.languages.CompletionItemKind.Keyword) {
            keywordKind = $window.monaco.languages.CompletionItemKind.Keyword;
        }
        angular.forEach(typeAheadArray, function(typeAhead) {
            if (typeAhead) {
                angular.forEach(typeAhead, function(typeAheadVal, key) {
                    if (typeof typeAheadVal === 'object') {
                        angular.forEach(typeAhead[key], function(listObj) {
                            var tempObj = {};
                            if (key === 'attributeList') {
                                let code = typeAhead.productCode + '.' + listObj.attributeCode;
                                if (listObj.splitCode) {
                                    code = code + '.' + listObj.splitCode;
                                }
                                tempObj = {
                                    label: code,
                                    kind: keywordKind,
                                    insertText: {
                                        value: code
                                    }
                                };
                            } else if (key === 'fieldList') {
                                tempObj = {
                                    label: typeAhead.objectAPIName + '.' + listObj.fieldName,
                                    kind: keywordKind,
                                    insertText: {
                                        value: typeAhead.objectAPIName + '.' + listObj.fieldName
                                    }
                                };
                            }
                            formattedArray.push(tempObj);
                        });
                    }
                });
            }
        });
        return formattedArray;
    }

    return {
        performApexRemoteAction: function(scope, remoteClass, remoteMethod, inputParams, optionParams) {
            console.log('perform apex remove action');
            var deferred = $q.defer();
            var datasource = {};
            datasource.type = 'ApexRemote';
            datasource.value = {
                remoteNSPrefix: $rootScope.nsPrefix,
                remoteClass: remoteClass,
                remoteMethod: remoteMethod
            };
            if (inputParams && inputParams.constructor === Object) {
                datasource.value.inputMap = inputParams;
            }
            if (optionParams && optionParams.constructor === Object) {
                datasource.value.optionsMap = optionParams;
            }
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
        formatTypeAheadArray: function(typeAheadMaps) {
            var deferred = $q.defer();
            var formattedArray = [];
            if (!typeAheadMaps) {
                deferred.reject('No data passed into function.');
            } else {
                if (typeAheadMaps[0]) {
                    formattedArray = formattedArray.concat(formatArray(typeAheadMaps));
                }
            }
            deferred.resolve(formattedArray);
            return deferred.promise;
        },
        switchTypeAheadData: function(newData, index) {
            if ('name' in newData && (!$rootScope.currentExpression || index !== $rootScope.currentExpression)) {
                $rootScope.currentExpression = index;
                $window.additionalCompletionItems.Keyword = angular.copy(newData.typeAheadKeywords);
            } else if ('rule' in newData && (!$rootScope.currentExpression || $rootScope.currentExpression !== 'eligibility')) {
                $rootScope.currentExpression = 'eligibility';
                $window.additionalCompletionItems.Keyword = angular.copy(newData.typeAheadKeywords);
            }
        }
    };
}]);
},{}]},{},[1]);
})();

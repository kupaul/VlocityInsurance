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
angular.module('insInsuredItems', ['vlocity', 'dndLists', 'CardFramework', 'sldsangular', 'forceng',
    'ngSanitize', 'cfp.hotkeys', 'insProductAttributes', 'insValidationHandler', 'insRules', 'insFormulaBuilder'
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
    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        'use strict';
        return function(sldsURL) {
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]).filter('formatDate', ['$rootScope', function($rootScope) {
        'use strict';
        return function(date) {
            const userLocale = $rootScope.vlocity.userAnLocale;
            const d = new Date(date);
            let formattedDate;
            if (userLocale) {
                formattedDate = d.toLocaleDateString(userLocale, {timeZone: 'UTC'});
            } else {
                formattedDate = (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
            }
            return formattedDate;
        };
    }]);

// Controllers
require('./modules/insInsuredItems/controller/InsInsuredItemsController.js');

// Templates
require('./modules/insInsuredItems/templates/templates.js');

// Factories
require('./modules/insInsuredItems/factory/InsProductSelectionModalService.js');
require('./modules/insInsuredItems/factory/InsCoveragesModelService.js');
require('./modules/insInsuredItems/factory/NotificationHandler.js');
require('./modules/insInsuredItems/factory/InsModalService.js');

// Directives
require('./modules/insInsuredItems/directive/HideNotification.js');
require('./modules/insInsuredItems/directive/angular-drag-and-drop-lists.js');
require('./modules/insInsuredItems/directive/insTooltipOffset.js');

},{"./modules/insInsuredItems/controller/InsInsuredItemsController.js":2,"./modules/insInsuredItems/directive/HideNotification.js":3,"./modules/insInsuredItems/directive/angular-drag-and-drop-lists.js":4,"./modules/insInsuredItems/directive/insTooltipOffset.js":5,"./modules/insInsuredItems/factory/InsCoveragesModelService.js":6,"./modules/insInsuredItems/factory/InsModalService.js":7,"./modules/insInsuredItems/factory/InsProductSelectionModalService.js":8,"./modules/insInsuredItems/factory/NotificationHandler.js":9,"./modules/insInsuredItems/templates/templates.js":10}],2:[function(require,module,exports){
angular.module('insInsuredItems').controller('InsInsuredItemsController', ['$scope', '$rootScope', 'InsValidationHandlerService', 'InsProductSelectionModalService', 'InsCoveragesModelService', 'InsModalService', 'NotificationHandler', '$document', '$timeout', '$interval', 'dataService', 'userProfileService', function (
    $scope, $rootScope, InsValidationHandlerService, InsProductSelectionModalService, InsCoveragesModelService, InsModalService, NotificationHandler, $document, $timeout, $interval, dataService, userProfileService) {
    'use strict';
    $scope.insFn = {};
    $scope.insVar = {
        popoverOpen: {}
    };
    $scope.notificationHandler = new NotificationHandler();
    $rootScope.config = {
        attr: null,
        show: false
    };
    $rootScope.fieldsMap = {};
    $scope.customLabels = {};
    $rootScope.productRecordType = '';

    let valueDataTypeConstants = [
        {
            key: 'Currency',
            label: 'Currency',
            translationKey: 'InsProductCurrency',
        },
        {
            key: 'Percent',
            label: 'Percent',
            translationKey: 'InsProductPercentage',
        },
        {
            key: 'Percentage',
            label: 'Percentage',
            translationKey: 'InsProductPercentage',
        },
        {
            key: 'Text',
            label: 'Text',
            translationKey: 'InsProductText'
        },
        {
            key: 'Number',
            label: 'Number',
            translationKey: 'InsProductNumber'
        },
        {
            key: 'Checkbox',
            label: 'Checkbox',
            translationKey: 'InsProductCheckbox'
        },
        {
            key: 'Datetime',
            label: 'Datetime',
            translationKey: 'InsProductDatetime'
        },
        {
            key: 'Date',
            label: 'Date',
            translationKey: 'InsProductDate'
        },
        {
            key: 'Adjustment',
            label: 'Adjustment',
            translationKey: 'InsProductAdjustment'
        },
        {
            key: 'Picklist',
            label: 'Picklist',
            translationKey: 'InsProductPicklist'
        },
        {
            key: 'Multi Picklist',
            label: 'Multi Picklist',
            translationKey: 'InsProductMultipicklist',
        }
    ];

    const translationKeys = ['InsQuotesExpandAll', 'InsInsuredItemsClassOverride', 'InsQuotesCollapseAll', 'Relationships', 'InsProductSearch', 'InsAssetInfo', 'InsProductOptional', 'InsProductParentInsuredItem',
        'InsProductEligibilityRules', 'InsProductRequiredCoverage', 'InsProductExpression', 'InsProductDefaultSelected', 'InsProductValidationRules', 'InsProductMessage', 'Save', 'Remove', 'InsProductNoCoveragesAssociated',
        'InsProductNewAttribute', 'AddNew', 'InsProductOptionalCoverageRelationships', 'InsProductDeleteRelationshipMessage', 'InsProductDeleteRelationship', 'InsAttributeJSON', 'InsOriginalSpec', 'InsProductSpec',
        'InsButtonCancel', 'InsProductConfirmDelete', 'InsProductAddRelationship', 'InsProductAddCoverages', 'InsProductAddInsuredItems', 'InsProductAddInvolvedInjuries', 'InsProductAddInvolvedProperties',
        'InsProductAddRatingFacts', 'InsProductNoItemsAssociated', 'Select', 'InsButtonShowMore', 'InsButtonShowLess', 'InsProductNoRelationshipMessage', 'InsRatingMapping',
        'InsProductAddRelationshipLink', 'InsProductNoInsuredItems', 'InsProductInsertOperator', 'InsProductCondition', 'InsProductHideJSON', 'InsProductMessage', 'InsProductSetValue',
        'InsProductInformation', 'InsProductWarning', 'InsProductError', 'InsProductRecommendation', 'InsProductEnterMessageText', 'Name', 'InsProductCode', 'InsProductCreatedDate', 'InsProductCreatedBy',
        'InsProductCategory', 'InsProductDataType', 'InsProductValueType', 'InsProductNoRatingFact', 'InsProductNoRatingFact', 'InsProductFunctions', 'InsProductCardinality', 'InsProductSeverity', 'Input', 'Output',
        'InsProductRules', 'InsProductCollapseAllTooltip', 'InsProductRevert', 'InsProductMultipicklist', 'InsProductPicklist', 'InsProductAdjustment', 'InsProductDate', 'InsProductDatetime', 'InsProductCheckbox',
        'InsProductNumber', 'InsProductText', 'InsProductPercentage', 'InsProductCurrency', 'View', 'Actions', 'InsProductOverridenMessage', 'Delete', 'InsInvolvedPropertiesNoProperties', 'InsInvolvedInjuriesNoInjuries', 'Add',
        'InsEligibilityCriteriaComments', 'InsRequiredCriteriaComments', 'InsDefaultSelectedCriteriaComments', 'InsProductNewAttribute', 'InsRuleCommentsPlaceholder', 'InsRatingFactClassOverride', 'InsCoverageClassOverride', 'InsRevertAttributeChange'
    ];

    userProfileService.getUserProfile().then(function (user) {
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function (translatedLabels) {
                $scope.customLabels = translatedLabels;
                for (let i = 0; i < $scope.rulesOptions.ruleTypes.length; i++) {
                    let ruleType = $scope.rulesOptions.ruleTypes[i];
                    let translationKey = ruleType.translationKey;
                    if (typeof ruleType === 'object') {
                        ruleType.label = translatedLabels[translationKey] || ruleType.label;
                    }
                }

                for (let i = 0; i < $scope.rulesOptions.messageTypes.length; i++) {
                    let messageType = $scope.rulesOptions.messageTypes[i];
                    let translationKey = messageType.translationKey;
                    messageType.label = translatedLabels[translationKey] || ruleType.label;
                }

                for (let i = 0; i < $scope.picklistOptions.length; i++) {
                    let picklistOpt = $scope.picklistOptions[i];
                    let translationKey = picklistOpt.translationKey;
                    picklistOpt.label = translatedLabels[translationKey];
                }

                for (let i = 0; i < valueDataTypeConstants.length; i++) {
                    let valueDataType = valueDataTypeConstants[i];
                    let translationKey = valueDataType.translationKey;
                    valueDataType.label = translatedLabels[translationKey];
                }

            }
        );
    })

    $rootScope.expandedCategories = $rootScope.expandedCategories || {};
    $scope.$on('set_expand_collapse', function (event, data) {
        $rootScope.expandedCategories = data.event;
    });

    /*
    * Navigate to object
    * @param {Id} id
    */
    $scope.navigateTo = function (id) {
        if ((typeof sforce !== 'undefined') && (sforce !== null)) {
            sforce.one.navigateToSObject(id, 'detail');
        } else {
            window.location.href = '/' + id;
        }
    };

    /**
     * Sort items by category name
     * @param {Object} items
     */
    $scope.getSortedCategories = function (items) {
        const a = Object.keys(items).sort(function (a, b) {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        });
        return a;
    }

    $scope.getTranslatedDataType = function (dataType) {
        for (let i = 0; i < valueDataTypeConstants.length; i++) {
            if (valueDataTypeConstants[i].key === dataType) {
                return valueDataTypeConstants[i].label;
            }
        }
        return dataType;
    }

    $scope.picklistOptions = [
        {
            key: 'Input',
            label: 'Input',
            translationKey: 'Input'
        },
        {
            key: 'Output',
            label: 'Output',
            translationKey: 'Output'
        },
    ]


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

    $scope.models = {
        selected: null,
        dropzones: {
            "list": $scope.insVar.items
        }
    };

    // Flag to hide all attributes for performance improvement, can be enabled in ins-coverage-container ng-init
    $rootScope.disableDragging = $rootScope.disableDragging || false;
    // Flags to hide attributes per coverage
    $rootScope.collapseFlags = $rootScope.collapseFlags || {};

    $rootScope.refreshCoverages = function () {
        let message = {
            event: 'reload'
        };
        $rootScope.$broadcast('vlocity.layout.ins-coverage-container.events', message);
    };


    $scope.processFieldMap = function (fieldsMap) {
        if (fieldsMap) {
            $rootScope.fieldsMap = fieldsMap;
        }
    };

    $scope.insFn.setProductRecordType = function (obj, params) {
        if(!$rootScope.productRecordType) {
            if(obj.productRecordType) {
                $rootScope.productRecordType = obj.productRecordType;
            } else {
                InsCoveragesModelService.getAssociatedInsuredItems($scope).then(function(result) {
                    $rootScope.productRecordType = result.productRecordType;
                });
            }
        }
    }

    $scope.insFn.setAttr = function (attr, objId, childProductId) {
        if (attr[$rootScope.nsPrefix + 'IsConfigurable__c']) {
            if (!$rootScope.config.attr || (attr.Id !== $rootScope.config.attr.Id)) {
                $rootScope.isLoaded = false;
                if (childProductId) {
                    attr.childProductId = childProductId;
                }
                if (objId) {
                    attr.coverageId = objId;
                }
                if (attr[$rootScope.nsPrefix + 'RuleData__c']) {
                    attr.rules = JSON.parse(attr[$rootScope.nsPrefix + 'RuleData__c']);
                }
                if ((typeof attr[$rootScope.nsPrefix + 'ValidValuesData__c']) === 'string') {
                    var parsed = JSON.parse(attr[$rootScope.nsPrefix + 'ValidValuesData__c']);
                    attr[$rootScope.nsPrefix + 'ValidValuesData__c'] = parsed;
                    if (attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Multi Picklist') {
                        attr[$rootScope.nsPrefix + 'Value__c'] = JSON.parse(attr[$rootScope.nsPrefix + 'Value__c']);
                    }
                }
                $rootScope.config.attr = attr;
                $rootScope.config.show = true;
                $rootScope.isLoaded = true;
            }
        }
    };

    var deleteRulesCoverage = function (obj) {
        let inputMap = {
            pciId: obj.Id,
            isOptional: obj.IsOptional,
            eligibilityRule: null,
            requiredRule: null,
            defaultSelectedRule: null,
            overriddenAttributeAssignmentList: []
        };
        InsCoveragesModelService.saveCoverages($scope, inputMap).then(function (result) {
        }, function (error) {
        });
    };


    $scope.shouldDisplayOverridenInfo = function (objectId, pciId) {
        return objectId === pciId;
    }

    $scope.insFn.changeOptional = function (obj) {
        if (!obj.IsOptional) {
            obj.HasRules = false;
            deleteRulesCoverage(obj);
        }
    };



    var vlocInsert = function (array, index, item) {
        array.splice(index, 0, item);
    };

    var assignLineNumbers = function (a) {
        $scope.insVar.obj = [];
        for (var i = 0; i < a.length; i++) {
            if (a[i]) {
                $scope.insVar.obj.push(a[i]);
            }
        }
        // Add to rootScope so they can be modified by ins-coverage-card and ins-coverage-container
        $rootScope.coveragesRef = $scope.insVar.obj;
        if ($rootScope.disableDragging) {
            $scope.insFn.setCollapseAll(true);
        }
        InsCoveragesModelService.reorderChildItems($scope, $scope.insVar.obj, 'coverage');
    };

    $scope.insFn.filter = function (name) {
        if (name) {
            name = name.toLowerCase();
        }
        if ($rootScope.searchTerm && $rootScope.searchTerm !== '') {
            var searchTerm = $rootScope.searchTerm.toLowerCase();
            if (name.includes(searchTerm)) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    };

    $scope.filterMap = {};

    $scope.insFn.filterCoverages = function (item) {
        let name = item.Name;
        if (name) {
            name = name.toLowerCase();
        }
        if ($rootScope.searchTerm && $rootScope.searchTerm !== '') {
            let searchTerm = $rootScope.searchTerm.toLowerCase();
            if (name.includes(searchTerm)) {
                $scope.filterMap[item.ChildProductId] = true;
                return true;
            } else {
                $scope.filterMap[item.ChildProductId] = false;
                return false;
            }
        }
        $scope.filterMap[item.ChildProductId] = true;
        return true;
    };

    $scope.insFn.setItems = function (obj) {
        var data, item, key, j, k, i, a, hierarchy;
        hierarchy = {};
        a = [];
        for (var key in obj) {
            item = obj[key];
            item.Id = key;
            item.id = obj[key].LineNumber;
            data = item.AttributeAssignmentList;
            if (data) {
                item.categories = {};
                organizeAttrData(data, item);
            }
            if (item.parentSpecId) {
                if (!hierarchy[item.parentSpecId]) {
                    hierarchy[item.parentSpecId] = [];
                }
                hierarchy[item.parentSpecId].push([item]);
            } else {
                a.push(item);
            }
        }
        $scope.insVar.items = setHierarchy(a, hierarchy);
        if ($scope.insVar.items.length) {
            setLineNumber();
        }
        $scope.models.dropzones.list = $scope.insVar.items;
        $rootScope.isLoaded = true;
    };

    //Organize Attribute Data For Card
    var organizeAttrData = function (data, item) {
        for (var i = 0; i < data.length; i++) {
            var category = data[i][$rootScope.nsPrefix + 'CategoryName__c'];
            if (data[i][$rootScope.nsPrefix + 'RuleData__c']) {
                data[i].rules = JSON.parse(data[i][$rootScope.nsPrefix + 'RuleData__c']);
            }
            if (!item.categories[category]) {
                var lst = [data[i]];
                item.categories[category] = lst;
            } else {
                item.categories[category].push(data[i]);
            }
        }
        item.sortedCategories = $scope.getSortedCategories(item.categories);
    };

    //Set hierarchy by ChildProdcutId
    var setHierarchy = function (a, hierarchy) {
        for (var i = 0; i < a.length; i++) {
            if (hierarchy[a[i].ChildProductId]) {
                a[i].columns = hierarchy[a[i].ChildProductId];
            } else {
                a[i].columns = [
                    []
                ];
            }
        }
        return a;
    }

    //Order Parents by linenumber
    var setLineNumber = function () {
        var i, a, item;
        a = new Array(Object.keys($scope.insVar.items).length - 1);
        for (i = 0; i < $scope.insVar.items.length; i++) {
            item = $scope.insVar.items[i];
            if (!a[item.LineNumber]) {
                a[item.LineNumber] = item;
            } else {
                vlocInsert(a, item.LineNumber, item);
            }
        }
        $scope.insVar.items = [];
        for (i = 0; i < a.length; i++) {
            if (a[i] && a[i].Id) {
                $scope.insVar.items.push(a[i]);
            }
        }
        for (i = 0; i < $scope.insVar.items.length; i++) {
            if ($scope.insVar.items[i]) {
                $scope.insVar.items[i].LineNumber = i + 1;
            }
        }
    };

    $scope.insFn.setData = function (data) {
        if (data) {
            var a = new Array(Object.keys(data).length - 1);
            for (var key in data) {
                var item = data[key];
                if (!item.parentSpecId) {
                    item.parentSpecId = $rootScope.productId;
                }
                if (item.EligibilityCriteria || item.DefaultSelectedCriteria || item.RequiredCriteria || item.selectValidationCriteria) {
                    item.HasRules = true;
                }
                item.Id = key;
                if (!a[item.LineNumber]) {
                    a[item.LineNumber] = item;
                } else {
                    vlocInsert(a, item.LineNumber, item);
                }
            }
            assignLineNumbers(a);
        }
    };

    $scope.insFn.updateJSON = function () {
        console.log('update json for product');
        InsCoveragesModelService.saveCoverageJSON($scope);
    };

    $scope.insFn.launchModal = function () {
        console.log('launching from service');
        InsCoveragesModelService.launchNewAttrModal($scope, 'getInsuredItemsForAddition');
    };

    $scope.insFn.launchRelationshipModal = function () {
        console.log('launching from service');
        const modalData = {};
        InsProductSelectionModalService.launchModal(
            $scope,
            'ins-coverage-dependent-opt-modal',
            modalData,
            'InsInsuredItemsController',
            'ins-coverage-dependent-opt-modal',
            $rootScope.vlocity.getCustomLabel('InsProductOptionalCoverageRelationships') || 'Optional Coverage Relationship'
        );
    };

    $scope.insFn.getInsuredItems = function () {
        console.log('get associated insured items');
        InsCoveragesModelService.getAssociatedInsuredItems($scope);
    }

    $scope.insFn.launchCoverageModal = function () {
        console.log('launching from service');
        InsCoveragesModelService.launchNewAttrModal($scope, 'getCoveragesForAddition');
    };

    $scope.insFn.launchPorpertiesModal = function () {
        InsCoveragesModelService.launchNewAttrModal($scope, 'getClaimPropertiesForAddition');
    };

    $scope.insFn.launchInjuriesModal = function () {
        InsCoveragesModelService.launchNewAttrModal($scope, 'getClaimInjuriesForAddition');
    };

    $scope.insFn.launchRatingFactModal = function () {
        InsCoveragesModelService.launchNewAttrModal($scope, 'getRatingFactsForAddition');
    };

    $scope.$on('refresh_insured_items', function (event, data) {
        if ($scope.insVar.items) {
            InsCoveragesModelService.getAssociatedInsuredItems($scope, 'insuredItems').then(function (data) {
                $scope.insFn.setItems(data.insuredItems);
            });
        }
    });

    $scope.insFn.addItems = function (records, type) {
        var inputMap = {
            productId: $rootScope.productId
        };
        var lst = [];
        for (var key in records) {
            console.log(records[key]);
            if (records[key].isSelected) {
                lst.push(key);
            }
        }

        if (type === 'claimProperties' && lst.length > 0) {
            console.log('add claimProperties');
            inputMap.claimProperties = lst;
            InsCoveragesModelService.addItems($scope, inputMap, 'claimProperties');
        }

        if (type === 'claimInjuries' && lst.length > 0) {
            console.log('add claimInjuries');
            inputMap.claimInjuries = lst;
            InsCoveragesModelService.addItems($scope, inputMap, 'claimInjuries');
        }

        if (type === 'insuredItems' && lst.length > 0) {
            console.log('add insured items');
            inputMap.insuredItemIds = lst;
            InsCoveragesModelService.addItems($scope, inputMap, 'insuredItems');
        }
        if (type === 'coverages' && lst.length > 0) {
            console.log('add coverages');
            inputMap.coverageIds = lst;
            InsCoveragesModelService.addItems($scope, inputMap, 'coverage');
        }
        if (type === 'ratingFacts' && lst.length > 0) {
            console.log('add rating facts');
            inputMap.ratingFacts = lst;
            InsCoveragesModelService.addItems($scope, inputMap, 'ratingFacts');
        }
    };

    $scope.insFn.deleteInsuredItem = function (id) {
        console.log('deleteInsuredItem');
        InsCoveragesModelService.deleteItem($scope, id, 'deleteInsuredItem', 'insuredItems');
    };

    $scope.insFn.deleteClaimInjury = function (id) {
        console.log('deleteClaimInjury');
        InsCoveragesModelService.deleteItem($scope, id, 'deleteInvolvedInjury', 'claimInjuries');
    };

    $scope.insFn.deleteClaimProperty = function (id) {
        console.log('deleteClaimProperty');
        InsCoveragesModelService.deleteItem($scope, id, 'deleteInvolvedProperty', 'claimProperties');
    };

    $scope.insFn.deleteRatingFact = function (id) {
        console.log('deleteRatingFact');
        InsCoveragesModelService.deleteItem($scope, id, 'deleteRatingFact', 'ratingFacts');
    }

    var formatPCIAttributeInput = function (attr) {
        let type, temp;
        temp = angular.copy(attr);
        if (!temp[$rootScope.nsPrefix + 'IsRatingAttribute__c']) {
            temp[$rootScope.nsPrefix + 'RatingInput__c'] = null;
            temp[$rootScope.nsPrefix + 'RatingOutput__c'] = null;
            temp[$rootScope.nsPrefix + 'RatingType__c'] = null;
        }
        if (temp[$scope.nsPrefix + 'RatingType__c'] === 'Output') {
            temp[$scope.nsPrefix + 'RatingInput__c'] = null;
        }

        if (temp[$scope.nsPrefix + 'RatingType__c'] === 'Input') {
            temp[$scope.nsPrefix + 'RatingOutput__c'] = null;
        }

        let saveRules = temp.rules;
        if (saveRules) {
            for (let i = 0; i < saveRules.length; i++) {
                if (saveRules[i] && saveRules[i].validation) {
                    delete saveRules[i].validation;
                }
                if (saveRules[i] && saveRules[i].typeAheadKeywords !== null) {
                    delete saveRules[i].typeAheadKeywords;
                }
            }
            let saveRulesStr = JSON.stringify(saveRules);
            temp[$scope.nsPrefix + 'RuleData__c'] = saveRulesStr;
            temp[$scope.nsPrefix + 'HasRule__c'] = true;
        }

        for (let key in temp) {
            type = typeof (temp[key]);
            if (type === 'object' || type === 'number') {
                if (temp[key] !== null) {
                    temp[key] = JSON.stringify(temp[key]);
                }
            }

            if ((key === $rootScope.nsPrefix + 'Value__c') && type === 'boolean') {
                temp[key] = JSON.stringify(temp[key]);
            }
        }

        return temp;
    }

    $scope.revertAttribute = function (pciId, childProductId, pciAttribute, typeObj) {
        var input = [];
        var type, temp;

        var inputMap = {
            pciId: pciId,
            rootProductId: $rootScope.productId,
            childProductId: childProductId,
            pciAttribute: formatPCIAttributeInput(pciAttribute)
        };
        InsCoveragesModelService.revertAttribute($scope, inputMap, typeObj);
    };

    $scope.saveAttribute = function (pciId, childProductId, pciAttribute, typeObj) {
        var inputMap = {
            pciAttribute: formatPCIAttributeInput(pciAttribute),
            pciId: pciId,
            rootProductId: $rootScope.productId,
            childProductId: childProductId || '',
        };
        InsCoveragesModelService.saveAttribute($scope, inputMap, typeObj);
    };

    $scope.insFn.saveItem = function (id, isOptional, attrs, minQuantity, maxQuantity, typeObj) {
        console.log('save: ' + typeObj);
        let input = [];
        let type, temp;
        if (attrs) {
            for (let i = 0; i < attrs.length; i++) {
                temp = Object.assign({}, attrs[i]);
                if (!temp[$rootScope.nsPrefix + 'IsRatingAttribute__c']) {
                    temp[$rootScope.nsPrefix + 'RatingInput__c'] = null;
                    temp[$rootScope.nsPrefix + 'RatingOutput__c'] = null;
                }
                if (temp[$scope.nsPrefix + 'RatingType__c'] === 'Output') {
                    temp[$scope.nsPrefix + 'RatingInput__c'] = null;
                }
                if (temp[$scope.nsPrefix + 'RatingType__c'] === 'Input') {
                    temp[$scope.nsPrefix + 'RatingOutput__c'] = null;
                }
                let saveRules = temp.rules;
                if (saveRules) {
                    if (saveRules.validation) {
                        delete saveRules.validation;
                    }
                    let saveRulesStr = JSON.stringify(saveRules);
                    temp[$scope.nsPrefix + 'RuleData__c'] = saveRulesStr;
                    temp[$scope.nsPrefix + 'HasRule__c'] = true;
                }
                for (let key in temp) {
                    type = typeof (temp[key]);
                    if (type === 'object' || type === 'number') {
                        if (temp[key] !== null) {
                            temp[key] = JSON.stringify(temp[key]);
                        }
                    }
                    if ((key === $rootScope.nsPrefix + 'Value__c') && type === 'boolean') {
                        temp[key] = JSON.stringify(temp[key]);
                    }
                }
                input.push(temp);
            }
        }
        var inputMap = {
            pciId: id,
            isOptional: isOptional,
            overriddenAttributeAssignmentList: input
        };
        if (typeObj === 'coverage') {
            InsCoveragesModelService.saveCoverages($scope, inputMap);
        } else {
            inputMap.minQuantity = minQuantity;
            inputMap.maxQuantity = maxQuantity;
            if (typeObj === 'insuredItem') {
                InsCoveragesModelService.saveInsuredItem($scope, inputMap);
            }
            if (typeObj === 'ratingFacts') {
                InsCoveragesModelService.saveRatingFact($scope, inputMap);
            }
            if (typeObj === 'claimInjuries') {
                InsCoveragesModelService.saveClaimInjuries($scope, inputMap);
            }
            if (typeObj === 'claimProperties') {
                InsCoveragesModelService.saveClaimProperties($scope, inputMap);
            }
        }
    };

    $scope.insFn.saveItemUpdated = function (id, isOptional, minQuantity, maxQuantity, typeObj) {
        var input = [];
        var type, temp;
        var inputMap = {
            pciId: id,
            isOptional: isOptional,
        };
        if (typeObj === 'coverage') {
            InsCoveragesModelService.saveCoverages($scope, inputMap);
        } else {
            inputMap.minQuantity = minQuantity;
            inputMap.maxQuantity = maxQuantity;
            if (typeObj === 'insuredItem') {
                InsCoveragesModelService.saveInsuredItem($scope, inputMap);
            }
            if (typeObj === 'ratingFacts') {
                InsCoveragesModelService.saveRatingFact($scope, inputMap);
            }
            if (typeObj === 'claimInjuries') {
                InsCoveragesModelService.saveClaimInjuries($scope, inputMap);
            }
            if (typeObj === 'claimProperties') {
                InsCoveragesModelService.saveClaimProperties($scope, inputMap);
            }
        }
    };

    $scope.insFn.deleteCoverage = function (id, index) {
        console.log('deleteCoverage');
        InsCoveragesModelService.deleteItem($scope, id, 'deleteCoverage', 'coverage');
    };

    $scope.insFn.updateMin = function (min) {
        return min + 1;
    };

    $scope.reorderSequences = function (targetIndex, item) {
        $rootScope.dragging = false;
        let srcIndex;
        for (let i = 0; i < $scope.insVar.obj.length; i++) {
            if ($scope.insVar.obj[i].Id === item.Id) {
                srcIndex = i;
                break;
            }
        }
        if (targetIndex > srcIndex) {
            targetIndex -= 1;
        }
        $scope.insVar.obj.splice(srcIndex, 1);
        $scope.insVar.obj.splice(targetIndex, 0, item);
        for (let i = 0; i < $scope.insVar.obj.length; i++) {
            $scope.insVar.obj[i].LineNumber = i;
        }
        InsCoveragesModelService.reorderChildItems($scope, $scope.insVar.obj, 'coverage');
    };

    /**
     * Reorder Item Sequences
     * @param {Number} index
     * @param {Array} list 
     * @param {String} type
     */
    $scope.reorderSequencesItem = function (index, list, type) {
        $rootScope.dragging = false;
        $rootScope.isLoading = true;
        var i, target, error;
        var item = list[index];
        var inputMap = {
            childPciIds: [item.Id]
        };
        if (!item.columns) {
            inputMap.childPciIds = [item.Id];
            inputMap.parentSpecId = null;
            item.parentSpecId = null;
        }
        list.splice(index, 1);
        for (i = 0; i < $scope.insVar.items.length; i++) {
            if (item.Id && $scope.insVar.items[i] && $scope.insVar.items[i].Id === item.Id) {
                target = i;
            }
            if ($scope.insVar.items[i].columns) {
                for (var j = 0; j < $scope.insVar.items[i].columns[0].length; j++) {
                    if ($scope.insVar.items[i].columns[0][j].Id === item.Id) {
                        if ($scope.insVar.items[i].columns[0][j].columns && $scope.insVar.items[i].columns[0][j].columns.length > 1) {
                            error = 'Cannot Associate a Parent with Children to a Parent';
                            InsValidationHandlerService.throwError(error);
                            $scope.notificationHandler.hide();
                        } else {
                            inputMap.parentSpecId = $scope.insVar.items[i].ChildProductId;
                        }
                    }
                }
            }
        }
        if (target > index) {
            $scope.insVar.items[target] = $scope.insVar.items[target + 1];
            $scope.insVar.items[target + 1] = item;
        }
        for (i = 0; i < $scope.insVar.items.length; i++) {
            if (!$scope.insVar.items[i]) {
                $scope.insVar.items.splice(i, 1);
            }
        }
        for (i = 0; i < $scope.insVar.items.length; i++) {
            $scope.insVar.items[i].LineNumber = i + 1;
            if (!$scope.insVar.items[i].columns) {
                $scope.insVar.items[i].columns = [
                    []
                ];
            }
        }
        console.log('items', $scope.insVar.items);
        if (type === 'insuredItems') {
            if (error) {
                InsCoveragesModelService.linkChildSpecs($scope, inputMap, error);
            } else {
                InsCoveragesModelService.linkChildSpecs($scope, inputMap);
            }
        }
        InsCoveragesModelService.reorderChildItems($scope, $scope.insVar.items, type);

    };

    $scope.linkChildSpecs = function (obj) {
        let inputMap = {
            childPciIds: [obj.Id],
            parentSpecId: obj.parentSpecId
        };
        InsCoveragesModelService.linkChildSpecs($scope, inputMap);
    };

    $scope.startDragging = function (event) {
        $rootScope.dragging = true;
        var lastMouseEvent, config, viewportHeight, scrollY, structureCanvas;
        lastMouseEvent = null;
        config = {
            activationDistance: 30,
            scrollDistance: 5,
            scrollInterval: 15,
            newPageYOffset: window.pageYOffset
        };

        $timeout(function () {
            if (!lastMouseEvent) {
                return;
            }
            viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            scrollY = 0;
            if (lastMouseEvent.clientY < config.activationDistance) {
                // If the mouse is on the top of the viewport within the activation distance.
                scrollY = -config.scrollDistance;
            } else if (lastMouseEvent.clientY > viewportHeight - config.activationDistance) {
                // If the mouse is on the bottom of the viewport within the activation distance.
                scrollY = config.scrollDistance;
            }
            structureCanvas = angular.element('.cards-container')[0];
            if (scrollY !== 0) {
                // console.log('structureCanvas.scrollHeight - viewportHeight', structureCanvas.scrollHeight - viewportHeight);
                // console.log('structureCanvas.scrollTop', structureCanvas.scrollTop);
                // console.log('config.newPageYOffset', config.newPageYOffset);
                if ((structureCanvas.scrollHeight - viewportHeight) <= structureCanvas.scrollTop) {
                    // console.log('Inside first');
                    config.newPageYOffset += scrollY;
                    // console.log('config.newPageYOffset', config.newPageYOffset);
                    window.scrollTo(0, config.newPageYOffset);
                } else {
                    // console.log('Inside second');
                    structureCanvas.scrollTop += scrollY;
                }
            }
        }, config.scrollInterval);
        lastMouseEvent = event;
        return true; // always return true because we can always drop here
    };

    // Iframe workaround to scroll up when coverage is dragged to top of page
    /**
     * @param {Object} event Drag event
     */
    function handleAutoScrollUp(event) {
        const minBoundary = 3 / 10; /* boundary top */
        const scrollDistance = 120;
        const minY = window.outerHeight * minBoundary;
        if (event.screenY > 0 && event.screenY < minY) {
            const pos = event.clientY + scrollDistance;
            window.parentIFrame.scrollTo(0, pos);
        }
    }

    // Throttled version of handleAutoScrollUp
    $scope.throttledAutoScrollUp = _.throttle(handleAutoScrollUp, 300);

    // Sets event listener when dragging starts
    $scope.startCoveragesDragging = function () {
        $rootScope.dragging = true;
        $document.on('drag', $scope.throttledAutoScrollUp);
        return true;
    };

    // Removes event listener when dragging ends
    $scope.endCoveragesDragging = function () {
        $rootScope.dragging = false;
        $scope.throttledAutoScrollUp.cancel();
    };

    /**
     * Show/hide attributes for individual coverages
     * @param {Number} id - coverage Id
     */
    $scope.insFn.toggleCollapse = function (id) {
        $rootScope.disableDragging = false;
        $rootScope.collapseFlags[id] = !$rootScope.collapseFlags[id];
    };

    /**
     * Show/hide attributes for all coverages, enable/disable reordering
     * @param {Boolean} bool
     */
    $scope.insFn.setCollapseAll = function (bool) {
        $rootScope.disableDragging = bool;
        if (bool) {
            $rootScope.config.show = false;
            $rootScope.config.attr = null;
        }
        angular.forEach($rootScope.coveragesRef, function (obj) {
            $rootScope.collapseFlags[obj.Id] = bool;
        });
    };



    $scope.showJSONdiff = function (attrs, obj, isAttributeOverriden) {
        let originalJSON = angular.copy(attrs);
        let productRecordType = $rootScope.productRecordType;
        let inputMap = {
            attributeId: attrs[$rootScope.nsPrefix + 'AttributeId__c'],
            childProductId: attrs.childProductId || obj.ChildProductId
        };
        $scope.typeOf = function (value) {
            return typeof value;
        };
        InsCoveragesModelService.getSpecAttribute($scope, inputMap, originalJSON, isAttributeOverriden, productRecordType);
    };

    $scope.insFn.showRules = function (id, isOptional, attrs, minQuantity, maxQuantity, typeObj) {
        if (!$rootScope.config.attr.rules) {
            $rootScope.config.attr.rules = [];
        }
        var records = {
            record: $rootScope.config.attr,
            fieldsMap: $rootScope.fieldsMap,
            rules: $rootScope.config.attr.rules,
            rulesOptions: $scope.rulesOptions
        };
        var originalRulesCopy = angular.copy($rootScope.config.attr.rules);
        InsModalService.launchModal(
            $scope,
            'ins-product-attributes-rules-modal',
            records,
            'InsProductAttributesController',
            'vloc-quote-modal',
            function () {
                if (($rootScope.config.attr.rules && originalRulesCopy && $rootScope.config.attr.rules.length > originalRulesCopy.length) || !angular.equals($rootScope.config.attr.rules, originalRulesCopy)) {
                    $scope.saveAttribute($rootScope.config.attr.coverageId, $rootScope.config.attr.childProductId, $rootScope.config.attr, typeObj);
                }
            }
        );
    };

    $scope.insFn.showRulesOption = function (row, obj) {
        if (!row.rules) {
            row.rules = [];
        }

        var records = {
            record: row.attr,
            rules: row.rules,
            rulesOptions: $scope.rulesOptions,
            categoryName: row[$rootScope.nsPrefix + 'CategoryName__c'] || row[$rootScope.nsPrefix + 'CategoryCode__c'],
            displayName: row[$rootScope.nsPrefix + 'AttributeDisplayName__c'] || row[$rootScope.nsPrefix + 'AttributeName__c'] || row[$rootScope.nsPrefix + 'AttributeUniqueCode__c']

        };
        var originalRulesCopy = angular.copy(row.rules);
        InsModalService.launchModal(
            $scope,
            'ins-product-attributes-rules-modal',
            records,
            'InsProductAttributesController',
            'vloc-quote-modal',
            function () {
                if ((row.rules && originalRulesCopy && row.rules.length > originalRulesCopy.length) || !angular.equals(row.rules, originalRulesCopy)) {
                    $scope.saveAttribute(obj.Id, obj.ChildProductId, row, 'insuredItem');
                }
            }
        );
    };

    $scope.searchFilter = function (name, term) {
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

    $scope.orderMap = function (map) {
        console.log(map);
        let associationMap = {};
        for (var key in map) {
            if (!associationMap[map[key].Name]) {
                associationMap[map[key].Name] = map[key];
            } else {
                associationMap[map[key].Name + map[key].ProductCode] = map[key];
            }
        }
        $scope.sortedList = Object.values(associationMap);
    };

    /*
    * Check locale format
    * @param {string} locale format
    */
    $scope.checkLocaleFormat = function (locale) {
        const localeLongFormat = /^[a-z]{2}[-][a-z]{2}$/g;
        const localeShortFormat = /^[a-z]{2}$/g;
        const isLocaleFormatted = localeLongFormat.test(locale) || localeShortFormat.test(locale);
        if (!isLocaleFormatted) {
            locale = locale.match(/[a-z]{2}[-][a-z]{2}/g) || locale.match(/^[a-z]{2}$/g);
            if (Array.isArray(locale)) {
                locale = locale[0];
            }
        }
        return locale;
    }

    // Convert date returned in UTC to timezone specific date and format
    $scope.formatDate = function (date) {
        const userTimeZone = $rootScope.vlocity.userTimeZone;
        const userLocale = $scope.locale;
        const d = new Date(date);
        let formattedDate;
        if (userLocale) {
            formattedDate = d.toLocaleDateString(userLocale, { timeZone: 'UTC' });
        } else {
            formattedDate = (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
        }
        return formattedDate;
    };

    $scope.formatDatetime = function (date) {
        if (moment) {
            var formattedDate = moment(date).utc().format('M/D/YYYY hh:mm')
            return formattedDate;
        } else {
            var d = new Date(date);
            var formattedDate = (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
        }
        return formattedDate;
    };

    $scope.setOrderTerm = function (orderTerm) {
        if ($scope.orderTerm !== orderTerm) {
            $scope.orderAsc = true;
            $scope.orderTerm = orderTerm;
        } else {
            $scope.orderAsc = !$scope.orderAsc;
        }
    }

    $scope.initRelations = function () {
        $scope.relationships = [];
        let inputMap = {
            productId: $rootScope.productId
        };
        InsCoveragesModelService.getOptionalCoverages($scope, inputMap);
        InsCoveragesModelService.getProductRelationshipTypes($scope, inputMap);
        InsCoveragesModelService.getChildCoverageProductRelationships($scope, inputMap);
    };


    $scope.addRelationship = function () {
        console.log('addRelationship');
        const relationshipObj = {
            prodRelType: '',
            srcProdId: '',
            tgtProdId: '',
            newRule: true
        };
        $scope.relationships.push(relationshipObj);
        $timeout(function () {
            delete $scope.relationships[$scope.relationships.length - 1].newRule;
            resetUIToSlds(true);
        }, 100);
        console.log($scope.relationships);
    };

    const resetUIToSlds = function (scrollToBottom) {
        $timeout(function () {
            let modalEl = $('.vloc-modal-container .vloc-modal-content');
            $('.simpleExpressionBuilder:not(.already-upgraded-to-slds)').addClass('slds-box slds-theme_shade slds-m-vertical_small');
            $('.simpleExpressionBuilder:not(.already-upgraded-to-slds) > .col-xs-6 + .col-xs-3').addClass('slds-form-element slds-medium-size_2-of-8 slds-p-right_small slds-m-bottom_xx-small vloc-ins-rule-insert-operator');
            $('.simpleExpressionBuilder:not(.already-upgraded-to-slds) > .col-xs-3.slds-form-element').prepend('<label class="slds-form-element__label">Insert Operator</label>');
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
            $('<label class="slds-form-element__label">Condition</label>').insertBefore('.simpleExpressionBuilder:not(.already-upgraded-to-slds) .slds-textarea');
            $('.simpleExpressionBuilder:not(.already-upgraded-to-slds) > .col-xs-9 + .col-xs-3').addClass('slds-form-element');
            $('.simpleExpressionBuilder:not(.already-upgraded-to-slds) select[ng-model="selectedComponent"]').addClass('slds-select').wrap(
                '<div class="slds-form-element__control"></div>'
            );
            $('<label class="slds-form-element__label">' + $rootScope.vlocity.getCustomLabel('InsProductFunctions') + '</label>').insertBefore('.simpleExpressionBuilder:not(.already-upgraded-to-slds) select[ng-model="selectedComponent"]');
            if (scrollToBottom && modalEl.length) {
                modalEl[0].scrollTop = modalEl[0].scrollHeight;
            }
            $('.simpleExpressionBuilder').addClass('already-upgraded-to-slds');
        });
    };

    $scope.deletePrompt = function (relationship) {
        if (!relationship.inDelete) {
            angular.forEach($scope.relationships, function (relationship) {
                relationship.inDelete = false;
            });
        }
        relationship.inDelete = !relationship.inDelete;
    };

    $scope.saveRelationship = function (relationship) {
        console.log(relationship);
        relationship.tgtProdName = $scope.optcoveragesMap[relationship.tgtProdId];
        relationship.srcProdName = $scope.optcoveragesMap[relationship.srcProdId];
        relationship.prodRelLbl = $scope.relationshipTypesMap[relationship.prodRelType];
        if (relationship.srcProdId && relationship.tgtProdId && relationship.prodRelType) {
            const inputMap = {
                productRelationships: $scope.relationships
            };
            InsCoveragesModelService.saveProductRelationships($scope, inputMap, relationship);
        }
    };

    $scope.deleteProductRelationships = function (relationship, index) {
        $timeout(function () {
            relationship.inDelete = !relationship.inDelete;
            relationship.isDeleted = true;
            if (relationship.prodRelId) {
                const inputMap = {
                    productRelationshipId: relationship.prodRelId
                };
                InsCoveragesModelService.deleteProductRelationships($scope, inputMap);
            }
        }, 250);
        $timeout(function () {
            relationship.isDeleted = false;
            $scope.relationships.splice(index, 1);
            console.log($scope.relationships);
        }, 900);
    };

    $scope.deleteRelationship = function (relationship, index) {
        relationship.inDelete = !relationship.inDelete;
        $timeout(function () {
            relationship.isDeleted = true;
        }, 250);
        $timeout(function () {
            relationship.isDeleted = false;
            $scope.relationships.splice(index, 1);
            console.log($scope.relationship);
        }, 900);
    };

    /* 
    * Select Criteria can be a stringified obj with a list of items, or a string with one item
    *  @param  {obj}  obj with field
    *  @return {integer} count of items
    */
    $scope.insFn.initSelectCriteriaCount = function (obj) {
        if (obj.selectValidationCriteria == null && obj.ClassSelectValidationCriteria == null) { // check null and undefined
            return 0; //empty
        }
        // Combine Class validation and Product validation rules in Select criteria count
        let classValidationRuleCount = 0;
        // New class rules should have `class_code_`, add check `code_` to prevent breaking old rules
        if(obj.ClassSelectValidationCriteria && (obj.ClassSelectValidationCriteria.indexOf('class_code_') > -1 || obj.ClassSelectValidationCriteria.indexOf('code_') > -1)) {
            classValidationRuleCount = typeof obj.ClassSelectValidationCriteria === 'string' ?
                JSON.parse(obj.ClassSelectValidationCriteria).length : obj.ClassSelectValidationCriteria.length;
        }
        let selectValidationRuleCount = 0;
        if(obj.selectValidationCriteria && obj.selectValidationCriteria.indexOf('code_') > -1) {
            selectValidationRuleCount = typeof obj.selectValidationCriteria === 'string' ?
                JSON.parse(obj.selectValidationCriteria).length : obj.selectValidationCriteria.length;
        }

        return selectValidationRuleCount + classValidationRuleCount;
    }

    /* 
    * Function to save a comment for rule 
    *  @param  {obj}  coverage
    *  @param  {String}  key for ng-model
    *  @param  {String}  saveKey for inputMap
    *  @param  {Boolean}  open - flag to close popup
    */
    $scope.insFn.saveRuleComment = function (obj, key, saveKey) {
        let inputMap = {
            pciId: obj.Id,
            isOptional: obj.IsOptional
        };
        inputMap[saveKey] = obj[key];
        InsCoveragesModelService.saveCoverages($scope, inputMap, true).then(
            function (result) {
                console.log('saveCoverage result', result);
            }, function (error) {
                console.log('saveCoverage error', error);
            }
        );
    }

}]);

},{}],3:[function(require,module,exports){
angular.module('insInsuredItems').directive('hideNotification', function($rootScope, $timeout) {
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

},{}],4:[function(require,module,exports){
/**
 * angular-drag-and-drop-lists v2.1.0
 *
 * Copyright (c) 2014 Marcel Juenemann marcel@juenemann.cc
 * Copyright (c) 2014-2017 Google Inc.
 * https://github.com/marceljuenemann/angular-drag-and-drop-lists
 *
 * License: MIT
 */
(function(dndLists) {

    // In standard-compliant browsers we use a custom mime type and also encode the dnd-type in it.
    // However, IE and Edge only support a limited number of mime types. The workarounds are described
    // in https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
    var MIME_TYPE = 'application/x-dnd';
    var EDGE_MIME_TYPE = 'application/json';
    var MSIE_MIME_TYPE = 'Text';

    // All valid HTML5 drop effects, in the order in which we prefer to use them.
    var ALL_EFFECTS = ['move', 'copy', 'link'];

    /**
     * Use the dnd-draggable attribute to make your element draggable
     *
     * Attributes:
     * - dnd-draggable      Required attribute. The value has to be an object that represents the data
     *                      of the element. In case of a drag and drop operation the object will be
     *                      serialized and unserialized on the receiving end.
     * - dnd-effect-allowed Use this attribute to limit the operations that can be performed. Valid
     *                      options are "move", "copy" and "link", as well as "all", "copyMove",
     *                      "copyLink" and "linkMove". The semantics of these operations are up to you
     *                      and have to be implemented using the callbacks described below. If you
     *                      allow multiple options, the user can choose between them by using the
     *                      modifier keys (OS specific). The cursor will be changed accordingly,
     *                      expect for IE and Edge, where this is not supported.
     * - dnd-type           Use this attribute if you have different kinds of items in your
     *                      application and you want to limit which items can be dropped into which
     *                      lists. Combine with dnd-allowed-types on the dnd-list(s). This attribute
     *                      must be a lower case string. Upper case characters can be used, but will
     *                      be converted to lower case automatically.
     * - dnd-disable-if     You can use this attribute to dynamically disable the draggability of the
     *                      element. This is useful if you have certain list items that you don't want
     *                      to be draggable, or if you want to disable drag & drop completely without
     *                      having two different code branches (e.g. only allow for admins).
     *
     * Callbacks:
     * - dnd-dragstart      Callback that is invoked when the element was dragged. The original
     *                      dragstart event will be provided in the local event variable.
     * - dnd-moved          Callback that is invoked when the element was moved. Usually you will
     *                      remove your element from the original list in this callback, since the
     *                      directive is not doing that for you automatically. The original dragend
     *                      event will be provided in the local event variable.
     * - dnd-copied         Same as dnd-moved, just that it is called when the element was copied
     *                      instead of moved, so you probably want to implement a different logic.
     * - dnd-linked         Same as dnd-moved, just that it is called when the element was linked
     *                      instead of moved, so you probably want to implement a different logic.
     * - dnd-canceled       Callback that is invoked if the element was dragged, but the operation was
     *                      canceled and the element was not dropped. The original dragend event will
     *                      be provided in the local event variable.
     * - dnd-dragend        Callback that is invoked when the drag operation ended. Available local
     *                      variables are event and dropEffect.
     * - dnd-selected       Callback that is invoked when the element was clicked but not dragged.
     *                      The original click event will be provided in the local event variable.
     * - dnd-callback       Custom callback that is passed to dropzone callbacks and can be used to
     *                      communicate between source and target scopes. The dropzone can pass user
     *                      defined variables to this callback.
     *
     * CSS classes:
     * - dndDragging        This class will be added to the element while the element is being
     *                      dragged. It will affect both the element you see while dragging and the
     *                      source element that stays at it's position. Do not try to hide the source
     *                      element with this class, because that will abort the drag operation.
     * - dndDraggingSource  This class will be added to the element after the drag operation was
     *                      started, meaning it only affects the original element that is still at
     *                      it's source position, and not the "element" that the user is dragging with
     *                      his mouse pointer.
     */
    dndLists.directive('dndDraggable', ['$parse', '$timeout', function($parse, $timeout) {
      return function(scope, element, attr) {
        // Set the HTML5 draggable attribute on the element.
        element.attr("draggable", "true");

        // If the dnd-disable-if attribute is set, we have to watch that.
        if (attr.dndDisableIf) {
          scope.$watch(attr.dndDisableIf, function(disabled) {
            element.attr("draggable", !disabled);
          });
        }

        /**
         * When the drag operation is started we have to prepare the dataTransfer object,
         * which is the primary way we communicate with the target element
         */
        element.on('dragstart', function(event) {
          event = event.originalEvent || event;

          // Check whether the element is draggable, since dragstart might be triggered on a child.
          if (element.attr('draggable') == 'false') return true;

          // Initialize global state.
          dndState.isDragging = true;
          dndState.itemType = attr.dndType && scope.$eval(attr.dndType).toLowerCase();

          // Set the allowed drop effects. See below for special IE handling.
          dndState.dropEffect = "none";
          dndState.effectAllowed = attr.dndEffectAllowed || ALL_EFFECTS[0];
          event.dataTransfer.effectAllowed = dndState.effectAllowed;

          // Internet Explorer and Microsoft Edge don't support custom mime types, see design doc:
          // https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
          var item = scope.$eval(attr.dndDraggable);
          var mimeType = MIME_TYPE + (dndState.itemType ? ('-' + dndState.itemType) : '');
          try {
            event.dataTransfer.setData(mimeType, angular.toJson(item));
          } catch (e) {
            // Setting a custom MIME type did not work, we are probably in IE or Edge.
            var data = angular.toJson({item: item, type: dndState.itemType});
            try {
              event.dataTransfer.setData(EDGE_MIME_TYPE, data);
            } catch (e) {
              // We are in Internet Explorer and can only use the Text MIME type. Also note that IE
              // does not allow changing the cursor in the dragover event, therefore we have to choose
              // the one we want to display now by setting effectAllowed.
              var effectsAllowed = filterEffects(ALL_EFFECTS, dndState.effectAllowed);
              event.dataTransfer.effectAllowed = effectsAllowed[0];
              event.dataTransfer.setData(MSIE_MIME_TYPE, data);
            }
          }

          // Add CSS classes. See documentation above.
          element.addClass("dndDragging");
          $timeout(function() { element.addClass("dndDraggingSource"); }, 0);

          // Try setting a proper drag image if triggered on a dnd-handle (won't work in IE).
          if (event._dndHandle && event.dataTransfer.setDragImage) {
            event.dataTransfer.setDragImage(element[0], 0, 0);
          }

          // Invoke dragstart callback and prepare extra callback for dropzone.
          $parse(attr.dndDragstart)(scope, {event: event});
          if (attr.dndCallback) {
            var callback = $parse(attr.dndCallback);
            dndState.callback = function(params) { return callback(scope, params || {}); };
          }

          event.stopPropagation();
        });

        /**
         * The dragend event is triggered when the element was dropped or when the drag
         * operation was aborted (e.g. hit escape button). Depending on the executed action
         * we will invoke the callbacks specified with the dnd-moved or dnd-copied attribute.
         */
        element.on('dragend', function(event) {
          event = event.originalEvent || event;

          // Invoke callbacks. Usually we would use event.dataTransfer.dropEffect to determine
          // the used effect, but Chrome has not implemented that field correctly. On Windows
          // it always sets it to 'none', while Chrome on Linux sometimes sets it to something
          // else when it's supposed to send 'none' (drag operation aborted).
          scope.$apply(function() {
            var dropEffect = dndState.dropEffect;
            var cb = {copy: 'dndCopied', link: 'dndLinked', move: 'dndMoved', none: 'dndCanceled'};
            $parse(attr[cb[dropEffect]])(scope, {event: event});
            $parse(attr.dndDragend)(scope, {event: event, dropEffect: dropEffect});
          });

          // Clean up
          dndState.isDragging = false;
          dndState.callback = undefined;
          element.removeClass("dndDragging");
          element.removeClass("dndDraggingSource");
          event.stopPropagation();

          // In IE9 it is possible that the timeout from dragstart triggers after the dragend handler.
          $timeout(function() { element.removeClass("dndDraggingSource"); }, 0);
        });

        /**
         * When the element is clicked we invoke the callback function
         * specified with the dnd-selected attribute.
         */
        element.on('click', function(event) {
          if (!attr.dndSelected) return;

          event = event.originalEvent || event;
          scope.$apply(function() {
            $parse(attr.dndSelected)(scope, {event: event});
          });

          // Prevent triggering dndSelected in parent elements.
          event.stopPropagation();
        });

        /**
         * Workaround to make element draggable in IE9
         */
        element.on('selectstart', function() {
          if (this.dragDrop) this.dragDrop();
        });
      };
    }]);

    /**
     * Use the dnd-list attribute to make your list element a dropzone. Usually you will add a single
     * li element as child with the ng-repeat directive. If you don't do that, we will not be able to
     * position the dropped element correctly. If you want your list to be sortable, also add the
     * dnd-draggable directive to your li element(s).
     *
     * Attributes:
     * - dnd-list             Required attribute. The value has to be the array in which the data of
     *                        the dropped element should be inserted. The value can be blank if used
     *                        with a custom dnd-drop handler that always returns true.
     * - dnd-allowed-types    Optional array of allowed item types. When used, only items that had a
     *                        matching dnd-type attribute will be dropable. Upper case characters will
     *                        automatically be converted to lower case.
     * - dnd-effect-allowed   Optional string expression that limits the drop effects that can be
     *                        performed in the list. See dnd-effect-allowed on dnd-draggable for more
     *                        details on allowed options. The default value is all.
     * - dnd-disable-if       Optional boolean expresssion. When it evaluates to true, no dropping
     *                        into the list is possible. Note that this also disables rearranging
     *                        items inside the list.
     * - dnd-horizontal-list  Optional boolean expresssion. When it evaluates to true, the positioning
     *                        algorithm will use the left and right halfs of the list items instead of
     *                        the upper and lower halfs.
     * - dnd-external-sources Optional boolean expression. When it evaluates to true, the list accepts
     *                        drops from sources outside of the current browser tab. This allows to
     *                        drag and drop accross different browser tabs. The only major browser
     *                        that does not support this is currently Microsoft Edge.
     *
     * Callbacks:
     * - dnd-dragover         Optional expression that is invoked when an element is dragged over the
     *                        list. If the expression is set, but does not return true, the element is
     *                        not allowed to be dropped. The following variables will be available:
     *                        - event: The original dragover event sent by the browser.
     *                        - index: The position in the list at which the element would be dropped.
     *                        - type: The dnd-type set on the dnd-draggable, or undefined if non was
     *                          set. Will be null for drops from external sources in IE and Edge,
     *                          since we don't know the type in those cases.
     *                        - dropEffect: One of move, copy or link, see dnd-effect-allowed.
     *                        - external: Whether the element was dragged from an external source.
     *                        - callback: If dnd-callback was set on the source element, this is a
     *                          function reference to the callback. The callback can be invoked with
     *                          custom variables like this: callback({var1: value1, var2: value2}).
     *                          The callback will be executed on the scope of the source element. If
     *                          dnd-external-sources was set and external is true, this callback will
     *                          not be available.
     * - dnd-drop             Optional expression that is invoked when an element is dropped on the
     *                        list. The same variables as for dnd-dragover will be available, with the
     *                        exception that type is always known and therefore never null. There
     *                        will also be an item variable, which is the transferred object. The
     *                        return value determines the further handling of the drop:
     *                        - falsy: The drop will be canceled and the element won't be inserted.
     *                        - true: Signalises that the drop is allowed, but the dnd-drop
     *                          callback already took care of inserting the element.
     *                        - otherwise: All other return values will be treated as the object to
     *                          insert into the array. In most cases you want to simply return the
     *                          item parameter, but there are no restrictions on what you can return.
     * - dnd-inserted         Optional expression that is invoked after a drop if the element was
     *                        actually inserted into the list. The same local variables as for
     *                        dnd-drop will be available. Note that for reorderings inside the same
     *                        list the old element will still be in the list due to the fact that
     *                        dnd-moved was not called yet.
     *
     * CSS classes:
     * - dndPlaceholder       When an element is dragged over the list, a new placeholder child
     *                        element will be added. This element is of type li and has the class
     *                        dndPlaceholder set. Alternatively, you can define your own placeholder
     *                        by creating a child element with dndPlaceholder class.
     * - dndDragover          Will be added to the list while an element is dragged over the list.
     */
    dndLists.directive('dndList', ['$parse', function($parse) {
      return function(scope, element, attr) {
        // While an element is dragged over the list, this placeholder element is inserted
        // at the location where the element would be inserted after dropping.
        var placeholder = getPlaceholderElement();
        placeholder.remove();

        var placeholderNode = placeholder[0];
        var listNode = element[0];
        var listSettings = {};

        /**
         * The dragenter event is fired when a dragged element or text selection enters a valid drop
         * target. According to the spec, we either need to have a dropzone attribute or listen on
         * dragenter events and call preventDefault(). It should be noted though that no browser seems
         * to enforce this behaviour.
         */
        element.on('dragenter', function (event) {
          event = event.originalEvent || event;

          // Calculate list properties, so that we don't have to repeat this on every dragover event.
          var types = attr.dndAllowedTypes && scope.$eval(attr.dndAllowedTypes);
          listSettings = {
            allowedTypes: angular.isArray(types) && types.join('|').toLowerCase().split('|'),
            disabled: attr.dndDisableIf && scope.$eval(attr.dndDisableIf),
            externalSources: attr.dndExternalSources && scope.$eval(attr.dndExternalSources),
            horizontal: attr.dndHorizontalList && scope.$eval(attr.dndHorizontalList)
          };

          var mimeType = getMimeType(event.dataTransfer.types);
          if (!mimeType || !isDropAllowed(getItemType(mimeType))) return true;
          event.preventDefault();
        });

        /**
         * The dragover event is triggered "every few hundred milliseconds" while an element
         * is being dragged over our list, or over an child element.
         */
        element.on('dragover', function(event) {
          event = event.originalEvent || event;

          // Check whether the drop is allowed and determine mime type.
          var mimeType = getMimeType(event.dataTransfer.types);
          var itemType = getItemType(mimeType);
          if (!mimeType || !isDropAllowed(itemType)) return true;

          // Make sure the placeholder is shown, which is especially important if the list is empty.
          if (placeholderNode.parentNode != listNode) {
            element.append(placeholder);
          }

          if (event.target != listNode) {
            // Try to find the node direct directly below the list node.
            var listItemNode = event.target;
            while (listItemNode.parentNode != listNode && listItemNode.parentNode) {
              listItemNode = listItemNode.parentNode;
            }

            if (listItemNode.parentNode == listNode && listItemNode != placeholderNode) {
              // If the mouse pointer is in the upper half of the list item element,
              // we position the placeholder before the list item, otherwise after it.
              var rect = listItemNode.getBoundingClientRect();
              if (listSettings.horizontal) {
                var isFirstHalf = event.clientX < rect.left + rect.width / 2;
              } else {
                var isFirstHalf = event.clientY < rect.top + rect.height / 2;
              }
              listNode.insertBefore(placeholderNode,
                  isFirstHalf ? listItemNode : listItemNode.nextSibling);
            }
          }

          // In IE we set a fake effectAllowed in dragstart to get the correct cursor, we therefore
          // ignore the effectAllowed passed in dataTransfer. We must also not access dataTransfer for
          // drops from external sources, as that throws an exception.
          var ignoreDataTransfer = mimeType == MSIE_MIME_TYPE;
          var dropEffect = getDropEffect(event, ignoreDataTransfer);
          if (dropEffect == 'none') return stopDragover();

          // At this point we invoke the callback, which still can disallow the drop.
          // We can't do this earlier because we want to pass the index of the placeholder.
          if (attr.dndDragover && !invokeCallback(attr.dndDragover, event, dropEffect, itemType)) {
            return stopDragover();
          }

          // Set dropEffect to modify the cursor shown by the browser, unless we're in IE, where this
          // is not supported. This must be done after preventDefault in Firefox.
          event.preventDefault();
          if (!ignoreDataTransfer) {
            event.dataTransfer.dropEffect = dropEffect;
          }

          element.addClass("dndDragover");
          event.stopPropagation();
          return false;
        });

        /**
         * When the element is dropped, we use the position of the placeholder element as the
         * position where we insert the transferred data. This assumes that the list has exactly
         * one child element per array element.
         */
        element.on('drop', function(event) {
          event = event.originalEvent || event;

          // Check whether the drop is allowed and determine mime type.
          var mimeType = getMimeType(event.dataTransfer.types);
          var itemType = getItemType(mimeType);
          if (!mimeType || !isDropAllowed(itemType)) return true;

          // The default behavior in Firefox is to interpret the dropped element as URL and
          // forward to it. We want to prevent that even if our drop is aborted.
          event.preventDefault();

          // Unserialize the data that was serialized in dragstart.
          try {
            var data = JSON.parse(event.dataTransfer.getData(mimeType));
          } catch(e) {
            return stopDragover();
          }

          // Drops with invalid types from external sources might not have been filtered out yet.
          if (mimeType == MSIE_MIME_TYPE || mimeType == EDGE_MIME_TYPE) {
            itemType = data.type || undefined;
            data = data.item;
            if (!isDropAllowed(itemType)) return stopDragover();
          }

          // Special handling for internal IE drops, see dragover handler.
          var ignoreDataTransfer = mimeType == MSIE_MIME_TYPE;
          var dropEffect = getDropEffect(event, ignoreDataTransfer);
          if (dropEffect == 'none') return stopDragover();

          // Invoke the callback, which can transform the transferredObject and even abort the drop.
          var index = getPlaceholderIndex();
          if (attr.dndDrop) {
            data = invokeCallback(attr.dndDrop, event, dropEffect, itemType, index, data);
            if (!data) return stopDragover();
          }

          // The drop is definitely going to happen now, store the dropEffect.
          dndState.dropEffect = dropEffect;
          if (!ignoreDataTransfer) {
            event.dataTransfer.dropEffect = dropEffect;
          }

          // Insert the object into the array, unless dnd-drop took care of that (returned true).
          if (data !== true) {
            scope.$apply(function() {
              scope.$eval(attr.dndList).splice(index, 0, data);
            });
          }
          invokeCallback(attr.dndInserted, event, dropEffect, itemType, index, data);

          // Clean up
          stopDragover();
          event.stopPropagation();
          return false;
        });

        /**
         * We have to remove the placeholder when the element is no longer dragged over our list. The
         * problem is that the dragleave event is not only fired when the element leaves our list,
         * but also when it leaves a child element. Therefore, we determine whether the mouse cursor
         * is still pointing to an element inside the list or not.
         */
        element.on('dragleave', function(event) {
          event = event.originalEvent || event;

          var newTarget = document.elementFromPoint(event.clientX, event.clientY);
          if (listNode.contains(newTarget) && !event._dndPhShown) {
            // Signalize to potential parent lists that a placeholder is already shown.
            event._dndPhShown = true;
          } else {
            stopDragover();
          }
        });

        /**
         * Given the types array from the DataTransfer object, returns the first valid mime type.
         * A type is valid if it starts with MIME_TYPE, or it equals MSIE_MIME_TYPE or EDGE_MIME_TYPE.
         */
        function getMimeType(types) {
          if (!types) return MSIE_MIME_TYPE; // IE 9 workaround.
          for (var i = 0; i < types.length; i++) {
            if (types[i] == MSIE_MIME_TYPE || types[i] == EDGE_MIME_TYPE ||
                types[i].substr(0, MIME_TYPE.length) == MIME_TYPE) {
              return types[i];
            }
          }
          return null;
        }

        /**
         * Determines the type of the item from the dndState, or from the mime type for items from
         * external sources. Returns undefined if no item type was set and null if the item type could
         * not be determined.
         */
        function getItemType(mimeType) {
          if (dndState.isDragging) return dndState.itemType || undefined;
          if (mimeType == MSIE_MIME_TYPE || mimeType == EDGE_MIME_TYPE) return null;
          return (mimeType && mimeType.substr(MIME_TYPE.length + 1)) || undefined;
        }

        /**
         * Checks various conditions that must be fulfilled for a drop to be allowed, including the
         * dnd-allowed-types attribute. If the item Type is unknown (null), the drop will be allowed.
         */
        function isDropAllowed(itemType) {
          if (listSettings.disabled) return false;
          if (!listSettings.externalSources && !dndState.isDragging) return false;
          if (!listSettings.allowedTypes || itemType === null) return true;
          return itemType && listSettings.allowedTypes.indexOf(itemType) != -1;
        }

        /**
         * Determines which drop effect to use for the given event. In Internet Explorer we have to
         * ignore the effectAllowed field on dataTransfer, since we set a fake value in dragstart.
         * In those cases we rely on dndState to filter effects. Read the design doc for more details:
         * https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
         */
        function getDropEffect(event, ignoreDataTransfer) {
          var effects = ALL_EFFECTS;
          if (!ignoreDataTransfer) {
            effects = filterEffects(effects, event.dataTransfer.effectAllowed);
          }
          if (dndState.isDragging) {
            effects = filterEffects(effects, dndState.effectAllowed);
          }
          if (attr.dndEffectAllowed) {
            effects = filterEffects(effects, attr.dndEffectAllowed);
          }
          // MacOS automatically filters dataTransfer.effectAllowed depending on the modifier keys,
          // therefore the following modifier keys will only affect other operating systems.
          if (!effects.length) {
            return 'none';
          } else if (event.ctrlKey && effects.indexOf('copy') != -1) {
            return 'copy';
          } else if (event.altKey && effects.indexOf('link') != -1) {
            return 'link';
          } else {
            return effects[0];
          }
        }

        /**
         * Small helper function that cleans up if we aborted a drop.
         */
        function stopDragover() {
          placeholder.remove();
          element.removeClass("dndDragover");
          return true;
        }

        /**
         * Invokes a callback with some interesting parameters and returns the callbacks return value.
         */
        function invokeCallback(expression, event, dropEffect, itemType, index, item) {
          return $parse(expression)(scope, {
            callback: dndState.callback,
            dropEffect: dropEffect,
            event: event,
            external: !dndState.isDragging,
            index: index !== undefined ? index : getPlaceholderIndex(),
            item: item || undefined,
            type: itemType
          });
        }

        /**
         * We use the position of the placeholder node to determine at which position of the array the
         * object needs to be inserted
         */
        function getPlaceholderIndex() {
          return Array.prototype.indexOf.call(listNode.children, placeholderNode);
        }

        /**
         * Tries to find a child element that has the dndPlaceholder class set. If none was found, a
         * new li element is created.
         */
        function getPlaceholderElement() {
          var placeholder;
          angular.forEach(element.children(), function(childNode) {
            var child = angular.element(childNode);
            if (child.hasClass('dndPlaceholder')) {
              placeholder = child;
            }
          });
          return placeholder || angular.element("<li class='dndPlaceholder'></li>");
        }
      };
    }]);

    /**
     * Use the dnd-nodrag attribute inside of dnd-draggable elements to prevent them from starting
     * drag operations. This is especially useful if you want to use input elements inside of
     * dnd-draggable elements or create specific handle elements. Note: This directive does not work
     * in Internet Explorer 9.
     */
    dndLists.directive('dndNodrag', function() {
      return function(scope, element, attr) {
        // Set as draggable so that we can cancel the events explicitly
        element.attr("draggable", "true");

        /**
         * Since the element is draggable, the browser's default operation is to drag it on dragstart.
         * We will prevent that and also stop the event from bubbling up.
         */
        element.on('dragstart', function(event) {
          event = event.originalEvent || event;

          if (!event._dndHandle) {
            // If a child element already reacted to dragstart and set a dataTransfer object, we will
            // allow that. For example, this is the case for user selections inside of input elements.
            if (!(event.dataTransfer.types && event.dataTransfer.types.length)) {
              event.preventDefault();
            }
            event.stopPropagation();
          }
        });

        /**
         * Stop propagation of dragend events, otherwise dnd-moved might be triggered and the element
         * would be removed.
         */
        element.on('dragend', function(event) {
          event = event.originalEvent || event;
          if (!event._dndHandle) {
            event.stopPropagation();
          }
        });
      };
    });

    /**
     * Use the dnd-handle directive within a dnd-nodrag element in order to allow dragging with that
     * element after all. Therefore, by combining dnd-nodrag and dnd-handle you can allow
     * dnd-draggable elements to only be dragged via specific "handle" elements. Note that Internet
     * Explorer will show the handle element as drag image instead of the dnd-draggable element. You
     * can work around this by styling the handle element differently when it is being dragged. Use
     * the CSS selector .dndDragging:not(.dndDraggingSource) [dnd-handle] for that.
     */
    dndLists.directive('dndHandle', function() {
      return function(scope, element, attr) {
        element.attr("draggable", "true");

        element.on('dragstart dragend', function(event) {
          event = event.originalEvent || event;
          event._dndHandle = true;
        });
      };
    });

    /**
     * Filters an array of drop effects using a HTML5 effectAllowed string.
     */
    function filterEffects(effects, effectAllowed) {
      if (effectAllowed == 'all') return effects;
      return effects.filter(function(effect) {
        return effectAllowed.toLowerCase().indexOf(effect) != -1;
      });
    }

    /**
     * For some features we need to maintain global state. This is done here, with these fields:
     * - callback: A callback function set at dragstart that is passed to internal dropzone handlers.
     * - dropEffect: Set in dragstart to "none" and to the actual value in the drop handler. We don't
     *   rely on the dropEffect passed by the browser, since there are various bugs in Chrome and
     *   Safari, and Internet Explorer defaults to copy if effectAllowed is copyMove.
     * - effectAllowed: Set in dragstart based on dnd-effect-allowed. This is needed for IE because
     *   setting effectAllowed on dataTransfer might result in an undesired cursor.
     * - isDragging: True between dragstart and dragend. Falsy for drops from external sources.
     * - itemType: The item type of the dragged element set via dnd-type. This is needed because IE
     *   and Edge don't support custom mime types that we can use to transfer this information.
     */
    var dndState = {};

  })(angular.module('dndLists', []));
},{}],5:[function(require,module,exports){
angular.module('insInsuredItems').directive('insTooltipOffset', ['$timeout', function($timeout) {
    'use strict';
    return {
        restrict: 'AE',
        link: function(scope, el, attrs, ctrl) {
            let timeout = attrs.insTooltipOffset === 'coverage' ? 1000 : 0;
            $timeout(function() {
                const elHeight = $(el)[0].offsetHeight;
                const calculatedTopOffset = ($(el)[0].offsetHeight + 10) * -1 + 'px';
                $(el).css({'top': calculatedTopOffset});
            }, timeout);
        }
    };
}]);

},{}],6:[function(require,module,exports){
angular.module('insInsuredItems').factory('InsCoveragesModelService',
    ['$rootScope', '$sldsModal', '$timeout', '$http', '$q', 'dataSourceService', 'dataService', 'InsProductSelectionModalService', 'InsModalService', 'InsValidationHandlerService', 'userProfileService',
        function ($rootScope, $sldsModal, $timeout, $http, $q, dataSourceService, dataService, InsProductSelectionModalService, InsModalService, InsValidationHandlerService, userProfileService) {
            'use strict';
            const tabs = {
                insuredItems: 'vlocity.layout.ins-insured-items-container.events',
                claimInjuries: 'vlocity.layout.ins-claims-injuries-admin-container.events',
                claimProperties: 'vlocity.layout.ins-claims-properties-admin-container.events',
                coverage: 'vlocity.layout.ins-coverage-container.events',
                ratingFacts: 'vlocity.layout.ins-rating-fact-container.events'
            };

            let customLabels = {};
            const translationKeys = ['InsProductUpdateCoverageSuccess', 'InsProductAddItemsSuccess', 'InsProductUpdatedItemSuccessfully',
                'InsProductDeletedSuccessfully', 'InsProductUpdatedJSONProduct', 'InsProductUpdatedInsuredItems', 'None'
            ];

            userProfileService.getUserProfile().then(function (user) {
                let userLanguage = user.language.replace("_", "-") || user.language;
                dataService.fetchCustomLabels(translationKeys, userLanguage).then(
                    function (translatedLabels) {
                        customLabels = translatedLabels;
                    }
                )
            })


            var refreshList = function (type) {
                if (type === 'insuredItems') {
                    let message = {
                        event: 'refreshInsuredItems',
                    };
                    $rootScope.$broadcast('refresh_insured_items', message);
                    refreshTab('coverage');
                } else {
                    let message = {
                        event: 'reload'
                    };
                    $rootScope.$broadcast(tabs[type], message);
                }
            };

            var setExpandCollapse = function (expandAccordion) {
                if (!expandAccordion) {
                    $rootScope.expandedCategories = {};
                }
                let message = {
                    event: $rootScope.expandedCategories
                };
                $rootScope.$broadcast('set_expand_collapse', message);
            };

            /**
             * @param {Object} attr Attribute JSON
             */

            function parseAttributeData(originalJSON) {
                let rulesData = originalJSON[$rootScope.nsPrefix + 'RuleData__c'] ?
                    originalJSON[$rootScope.nsPrefix + 'RuleData__c'] : null;

                let validValuesData = originalJSON[$rootScope.nsPrefix + 'ValidValuesData__c'] ?
                    originalJSON[$rootScope.nsPrefix + 'ValidValuesData__c'] : null;

                if (typeof rulesData === 'string') {
                    rulesData = JSON.parse(originalJSON[$rootScope.nsPrefix + 'RuleData__c']);
                };

                if (typeof validValuesData === 'string') {
                    validValuesData = JSON.parse(originalJSON[$rootScope.nsPrefix + 'ValidValuesData__c']);
                };

                const newObj = Object.assign(
                    {},
                    originalJSON,
                    {
                        [$rootScope.nsPrefix + 'RuleData__c']: rulesData,
                        [$rootScope.nsPrefix + 'ValidValuesData__c']: validValuesData
                    }
                );
                return newObj;
            };

            function refreshTab(type) {
                console.log('refreshTab');
                let obj = {
                    message: 'ltng:event',
                    event: 'e.' + $rootScope.nsPrefix.replace('__', '') + ':vlocityCardEvent',
                    params: {
                        "layoutName": 'ins-coverage-container',
                        "message": {
                            event: 'reload'
                        }
                    }
                };
                if ('parentIFrame' in window) {
                    window.parentIFrame.sendMessage(obj);
                }
            };
            var scrollTop = function () {
                if ('parentIFrame' in window) {
                    window.parentIFrame.scrollTo(0);
                } else {
                    $('body').scrollTop(0);
                }
            };

            return {
                launchNewAttrModal: function (scope, fn) {
                    console.log('call modal with service', $rootScope.productId);
                    $rootScope.isLoaded = false;
                    scrollTop();
                    var modalData = {};
                    var effectiveDate = null;
                    var deferred = $q.defer();
                    var nsPrefix = fileNsPrefix().replace('__', '');
                    var datasource = {};
                    var inputMap = { 'productId': $rootScope.productId };
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.inputMap = inputMap;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = fn;
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            if (fn === 'getCoveragesForAddition') {
                                modalData.records = data.coverages;
                                modalData.type = 'coverages';
                            } if (fn === 'getClaimInjuriesForAddition') {
                                console.log('claimData', data);
                                modalData.records = data.claimInjuries;
                                modalData.type = 'claimInjuries';
                            }
                            if (fn === 'getClaimPropertiesForAddition') {
                                console.log('claim properites', data);
                                modalData.records = data.claimProperties;
                                modalData.type = 'claimProperties';
                            }
                            if (fn === 'getInsuredItemsForAddition') {
                                modalData.records = data.insuredItems;
                                modalData.type = 'insuredItems';
                            }
                            if (fn === 'getRatingFactsForAddition') {
                                modalData.records = data.ratingFacts;
                                modalData.type = 'ratingFacts';
                            }
                            if (modalData) {
                                InsProductSelectionModalService.launchModal(
                                    scope,
                                    'ins-coverage-attr-modal',
                                    modalData,
                                    'InsInsuredItemsController',
                                    'ins-coverage-attr-modal'
                                );
                            }
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            InsValidationHandlerService.throwError(error);
                        });
                    return deferred.promise;
                },
                revertAttribute: function (scope, inputMap, typeObj) {
                    console.log('call modal with service', $rootScope.productId);
                    $rootScope.isLoaded = false;
                    var modalData = {};
                    var effectiveDate = null;
                    var deferred = $q.defer();
                    var nsPrefix = fileNsPrefix().replace('__', '');
                    var datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'revertPCIAttribute';
                    datasource.value.inputMap = inputMap;
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);

                            if (typeObj === 'insuredItem') {
                                refreshList('insuredItems');
                            }

                            if (typeObj === 'coverage') {
                                refreshList('coverage');
                            }

                            if (typeObj === 'ratingFacts') {
                                refreshList('ratingFacts');
                                setExpandCollapse(true);
                            }

                            $rootScope.isLoaded = true;
                            var message = $rootScope.vlocity.getCustomLabel('InsProductRevertSuccessMessage') || 'Reverted Attribute Successfully';
                            scope.notificationHandler.handleSuccess(message);
                            scope.notificationHandler.hide();
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleSuccess(error);
                            scope.notificationHandler.hide();
                        });
                    return deferred.promise;
                },
                getSpecAttribute: function (scope, inputMap, parentAttrs, isAttributeOverriden, prodRecordType) {
                    $rootScope.isLoaded = false;
                    var modalData = {};
                    var effectiveDate = null;
                    var deferred = $q.defer();
                    var nsPrefix = fileNsPrefix().replace('__', '');
                    var datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'getSpecAttribute';
                    datasource.value.inputMap = inputMap;
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            var productJSON = parentAttrs;
                            let formattedPCIAttributes = parseAttributeData(productJSON);
                            let formattedSpecLevelAttributes = {};

                            if (data.specAttributeAssignment) {
                                scope.specLevelAttrs = data.specAttributeAssignment;
                                formattedSpecLevelAttributes = parseAttributeData(scope.specLevelAttrs);
                            } else {
                                isAttributeOverriden = false;
                            }

                            InsModalService.launchAttributeJSONModal(
                                scope,
                                'ins-product-attributes-json-modal',
                                formattedPCIAttributes,
                                formattedSpecLevelAttributes,
                                isAttributeOverriden,
                                'InsInsuredItemsController',
                                function () {
                                    $rootScope.productRecordType = prodRecordType;
                                }
                            );
                            deferred.resolve(data);
                        }, function (error) {
                            console.error(error);
                        });
                    return deferred.promise;
                },
                saveAttribute: function (scope, inputMap, typeObj) {
                    console.log('call modal with service', $rootScope.productId);
                    $rootScope.isLoaded = false;
                    var modalData = {};
                    var effectiveDate = null;
                    var deferred = $q.defer();
                    var nsPrefix = fileNsPrefix().replace('__', '');
                    var datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'savePCIAttribute';
                    datasource.value.inputMap = inputMap;
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log('attributeAssignment', data.attributeAssignment);
                            deferred.resolve(data);

                            if (typeObj === 'insuredItem') {
                                refreshList('insuredItems')
                            }

                            if (typeObj === 'coverage') {
                                refreshList('coverage');
                            }

                            if (typeObj == 'ratingFacts') {
                                refreshList('ratingFacts');
                                setExpandCollapse(true);
                            }

                            $rootScope.isLoaded = true;
                            var message = $rootScope.vlocity.getCustomLabel('InsProductAttributeSavedMessage') || 'Attribute saved successfully';
                            scope.notificationHandler.handleSuccess(message);
                            scope.notificationHandler.hide();
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleSuccess(error);
                            scope.notificationHandler.hide();
                        });
                    return deferred.promise;
                },
                saveCoverages: function (scope, inputMap, preventRefresh) {
                    console.log('call modal with service', $rootScope.productId);
                    if(!preventRefresh){
                        $rootScope.isLoaded = false;
                    }
                    var deferred = $q.defer();
                    var nsPrefix = fileNsPrefix().replace('__', '');
                    var datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'saveCoverage';
                    datasource.value.inputMap = inputMap;
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            if (!preventRefresh) {
                                refreshList('coverage');
                            }
                            $rootScope.isLoaded = true;
                            var message = $rootScope.vlocity.getCustomLabel('InsProductUpdateCoverageSuccess') || 'Updated Coverage Successfully';
                            scope.notificationHandler.handleSuccess(message);
                            scope.notificationHandler.hide();
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleSuccess(error);
                            scope.notificationHandler.hide();
                        });
                    return deferred.promise;
                }, addItems: function (scope, inputMap, type) {
                    $rootScope.isLoaded = false;
                    var fn = '';
                    console.log('call add Items with', scope);
                    if (type === 'insuredItems') {
                        fn = 'addInsuredItems';
                    }
                    if (type === 'claimProperties') {
                        fn = 'addClaimProperties';
                    } if (type === 'claimInjuries') {
                        fn = 'addClaimInjuries';
                    }
                    if (type === 'coverage') {
                        fn = 'addCoverages';
                    }
                    if (type === 'ratingFacts') {
                        fn = 'addRatingFact';
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
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = fn;
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            refreshList(type);
                            if (type === 'ratingFacts') {
                                setExpandCollapse(false);
                            }
                            var message = $rootScope.vlocity.getCustomLabel('InsProductAddItemsSuccess') || 'Added Items Successfully';
                            scope.notificationHandler.handleSuccess(message);
                            scope.notificationHandler.hide();
                            $timeout(function () {
                                InsProductSelectionModalService.hideModal();
                            }, 250);
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            InsValidationHandlerService.throwError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }, saveInsuredItem: function (scope, inputMap) {
                    $rootScope.isLoaded = false;
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
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'saveInsuredItem';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            var message = $rootScope.vlocity.getCustomLabel('InsProductUpdatedItemSuccessfully') || 'Updated Item Successfully';
                            scope.notificationHandler.handleSuccess(message);
                            scope.notificationHandler.hide();
                            refreshList('insuredItems');
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }, saveClaimInjuries: function (scope, inputMap) {
                    $rootScope.isLoaded = false;
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
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'saveClaimInjury';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            var message = $rootScope.vlocity.getCustomLabel('InsProductUpdatedItemSuccessfully') || 'Updated Item Successfully';
                            scope.notificationHandler.handleSuccess(message);
                            scope.notificationHandler.hide();
                            refreshList('claimInjuries');
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }, saveClaimProperties: function (scope, inputMap) {
                    $rootScope.isLoaded = false;
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
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'saveClaimProperty';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            var message = $rootScope.vlocity.getCustomLabel('InsProductUpdatedItemSuccessfully') || 'Updated Item Successfully';
                            scope.notificationHandler.handleSuccess(message);
                            scope.notificationHandler.hide();
                            refreshList('claimProperties');
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }, saveRatingFact: function (scope, inputMap) {
                    $rootScope.isLoaded = false;
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
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'saveRatingFact';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            var message = $rootScope.vlocity.getCustomLabel('InsProductUpdatedItemSuccessfully') || 'Updated Item Successfully';
                            scope.notificationHandler.handleSuccess(message);
                            scope.notificationHandler.hide();
                            refreshList('ratingFacts');
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                },
                deleteItem: function (scope, id, fn, type) {
                    $rootScope.isLoaded = false;
                    console.log('record', id);
                    var inputMap = {
                        pciId: id
                    };
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
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = fn;
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            refreshList(type);
                            if (type === 'ratingFacts') {
                                setExpandCollapse(false);
                            }
                            $timeout(function () {
                                var message = $rootScope.vlocity.getCustomLabel('InsProductDeletedSuccessfully') || 'Deleted Item Successfully';
                                scope.notificationHandler.handleSuccess(message);
                                scope.notificationHandler.hide();
                                $rootScope.isLoaded = true;
                            }, 2000);
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                },
                reorderChildItems: function (scope, obj) {
                    $rootScope.isLoaded = false;
                    var inputMap = {};
                    inputMap.childItems = {};
                    for (var i = 0; i < obj.length; i++) {
                        if (obj[i]) {
                            inputMap.childItems[obj[i].Id] = obj[i].LineNumber;
                        }
                    }
                    var deferred = $q.defer();
                    var nsPrefix = fileNsPrefix().replace('__', '');
                    var datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.inputMap = inputMap;
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'reorderChildItems';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }, saveCoverageJSON: function (scope) {
                    $rootScope.isLoaded = false;
                    var inputMap = {
                        productId: $rootScope.productId
                    };
                    var modalData = {};
                    var effectiveDate = null;
                    var deferred = $q.defer();
                    var nsPrefix = fileNsPrefix().replace('__', '');
                    var datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.inputMap = inputMap;
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'saveCoverageJSON';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            refreshList('coverage');
                            var message = $rootScope.vlocity.getCustomLabel('InsProductUpdatedJSONProduct') || 'Successfully Updated JSON for Product';
                            scope.notificationHandler.handleSuccess(message);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }, linkChildSpecs: function (scope, inputMap, error) {
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
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'linkChildSpecs';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            refreshList('insuredItems');
                            if (!error) {
                                var message = $rootScope.vlocity.getCustomLabel('InsProductUpdatedInsuredItems') || 'Successfully Updated Insured Items';
                                scope.notificationHandler.handleSuccess(message);
                                scope.notificationHandler.hide();
                            }
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }, getAssociatedInsuredItems: function (scope, type) {
                    $rootScope.isLoaded = false;
                    var inputMap = {
                        productId: $rootScope.productId
                    };
                    var modalData = {};
                    var effectiveDate = null;
                    var deferred = $q.defer();
                    var nsPrefix = fileNsPrefix().replace('__', '');
                    var datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.inputMap = inputMap;
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'getAssociatedInsuredItems';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            if (type === 'insuredItems') {
                                $rootScope.isLoaded = false;
                                console.log('refresh');
                                scope.insVar.items = data.insuredItems;
                            }
                            else {
                                let a = Object.values(data.insuredItems);
                                let nullItem = {
                                    ChildProductId: null,
                                    Name: $rootScope.vlocity.getCustomLabel('None') || 'None'
                                };
                                scope.insuredItems = [nullItem];
                                for (let i = 0; i < a.length; i++) {
                                    if (!a[i].parentSpecId) {
                                        scope.insuredItems.push(a[i]);
                                    }
                                }
                            }
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }, getChildCoverageProductRelationships: function (scope, inputMap, error) {
                    $rootScope.isLoaded = false;
                    const deferred = $q.defer();
                    const nsPrefix = fileNsPrefix().replace('__', '');
                    const datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.inputMap = inputMap;
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'getChildCoverageProductRelationships';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            scope.relationships = data.result;
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }, getProductRelationshipTypes: function (scope, inputMap, error) {
                    $rootScope.isLoaded = false;
                    const deferred = $q.defer();
                    const nsPrefix = fileNsPrefix().replace('__', '');
                    const datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.inputMap = inputMap;
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'getProductRelationshipTypes';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            scope.relationshipTypes = data.result;
                            scope.relationshipTypesMap = {};
                            for (let i = 0; i < scope.relationshipTypes.length; i++) {
                                if (scope.relationshipTypes[i]) {
                                    scope.relationshipTypesMap[scope.relationshipTypes[i].prodRelType] = scope.relationshipTypes[i].prodRelLbl;
                                }
                            }
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }, getOptionalCoverages: function (scope, inputMap, error) {
                    $rootScope.isLoaded = false;
                    const deferred = $q.defer();
                    const nsPrefix = fileNsPrefix().replace('__', '');
                    const datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.inputMap = inputMap;
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'getOptionalCoverages';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            scope.optcoverags = data.result;
                            scope.optcoveragesMap = {};
                            for (let i = 0; i < scope.optcoverags.length; i++) {
                                if (scope.optcoverags[i]) {
                                    scope.optcoveragesMap[scope.optcoverags[i].covProdId] = scope.optcoverags[i].covProdName;
                                }
                            }
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }, saveProductRelationships: function (scope, inputMap, relationship) {
                    $rootScope.isLoaded = false;
                    const deferred = $q.defer();
                    const nsPrefix = fileNsPrefix().replace('__', '');
                    const datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.inputMap = inputMap;
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'saveProductRelationships';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            if (data.result && data.result.productRelationships) {
                                for (let i = 0; i < data.result.productRelationships.length; i++) {
                                    if (data.result.productRelationships[i].srcProdId === relationship.srcProdId &&
                                        data.result.productRelationships[i].tgtProdId === relationship.tgtProdId) {
                                        relationship.prodRelId = data.result.productRelationships[i].prodRelId;
                                    }
                                }
                            }
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }, deleteProductRelationships: function (scope, inputMap, error) {
                    $rootScope.isLoaded = false;
                    const deferred = $q.defer();
                    const nsPrefix = fileNsPrefix().replace('__', '');
                    const datasource = {};
                    datasource.type = 'Dual';
                    datasource.value = {};
                    datasource.value.inputMap = inputMap;
                    datasource.value.remoteNSPrefix = nsPrefix;
                    datasource.value.remoteClass = 'InsuranceProductAdminHandler';
                    datasource.value.remoteMethod = 'deleteProductRelationships';
                    datasource.value.apexRemoteResultVar = 'result.records';
                    datasource.value.methodType = 'GET';
                    datasource.value.apexRestResultVar = 'result.records';
                    console.log('datasource', datasource);
                    // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                    // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                    dataSourceService.getData(datasource, scope, null).then(
                        function (data) {
                            console.log(data);
                            deferred.resolve(data);
                            $rootScope.isLoaded = true;
                        }, function (error) {
                            console.error(error);
                            deferred.reject(error);
                            scope.notificationHandler.handleError(error);
                            scope.notificationHandler.hide();
                            $rootScope.isLoaded = true;
                        });
                    return deferred.promise;
                }
            };
        }]);

},{}],7:[function(require,module,exports){
angular.module('insInsuredItems').factory('InsModalService',
['$rootScope', '$sldsModal', '$timeout', 'dataService',
function($rootScope, $sldsModal, $timeout, dataService) {
    'use strict';

     var scrollTop = function(){
        if ('parentIFrame' in window) {
            window.parentIFrame.scrollTo(0);
        } else {
            $('body').scrollTop(0);
        }
    };

    return {
        launchModal: function(scope, layout, records, ctrl, customClass, onHide) {
            var modalScope = scope.$new();
            var insModal;
            scrollTop();
            modalScope.vlocQuote = scope.vlocQuote;
            modalScope.isLayoutLoaded = false;
            modalScope.layout = layout;
            modalScope.records = records; 
            modalScope.ctrl = ctrl;
            modalScope.title = $rootScope.vlocity.getCustomLabel('InsProductAttributeRules') || 'Attribute Rules';
            modalScope.customClass = customClass;
            insModal = $sldsModal({
                scope: modalScope,
                templateUrl: 'modals/ins-quote-modal.tpl.html',
                show: true,
                vlocSlide: true,
                onHide: onHide
            });
            // generate click on the modal to get insDropdownHandler directive to work:
            // $timeout(function() {
            //     angular.element('.slds-modal__content').click();
            // }, 500);
        },
        launchAttributeJSONModal: function(scope, layout, productLevelAttrs, specLevelAttrs, isAttributeOverriden, ctrl, onHide) {
            var modalScope = scope.$new();
            var modalData = {};
            var insModal;
            var isValueOverriden = false;
            scrollTop();
            // modalScope.vlocQuote = scope.vlocQuote;
            modalScope.isLayoutLoaded = false;
            modalScope.layout = layout;
            modalData.productLevelAttrs = productLevelAttrs;
            modalData.specLevelAttrs = specLevelAttrs;
            modalData.isAttributeOverriden = isAttributeOverriden;
            modalData.productSpec = $rootScope.vlocity.getCustomLabel('InsProductSpec') ||  'Product Spec'
            modalData.originalSpec = $rootScope.vlocity.getCustomLabel('InsOriginalSpec') ||  'Original Spec'
            modalData.typeOf = function(value) {
                return typeof value;
            };
            modalData.equals = function(value1, value2) {
                return angular.equals(value1, value2);
            };

            modalScope.records = modalData;
            modalScope.ctrl = ctrl;
            modalScope.title = $rootScope.vlocity.getCustomLabel('InsAttributeJSON') ||  'Attribute JSON';

            insModal = $sldsModal({
                scope: modalScope,
                templateUrl: 'modals/ins-attribute-json-diff.tpl.html',
                show: true,
                vlocSlideCustomClass: (isAttributeOverriden ? 'vloc-comparison-overriden-json' : 'vloc-comparison-original-json'),
                vlocSlide: true,
                onHide: onHide
            });
        },
        hideModal : function(){
            angular.element('.slds-modal__close').click();
        }
    };
}]);

},{}],8:[function(require,module,exports){
angular.module('insInsuredItems').factory('InsProductSelectionModalService', 
['$rootScope', '$sldsModal', '$timeout',
function($rootScope, $sldsModal, $timeout) {
    'use strict';
    return {
        launchModal: function(scope, layout, records, ctrl, customClass, title) {
            let modalScope = scope.$new();
            let insModal;
            modalScope.title = title;
            modalScope.isLayoutLoaded = false;
            modalScope.layout = layout;
            modalScope.records = records;
            console.log('modalScope.records', modalScope.records );
            modalScope.ctrl = ctrl;
            modalScope.customClass = customClass;
            insModal = $sldsModal({
                scope: modalScope,
                templateUrl: 'modals/ins-product-selection-modal.tpl.html',
                show: true,
                vlocSlide: true, // Added by Robert Henderson CORE-1077
                vlocSlideCustomClass: customClass, // Added by Robert Henderson CORE-1077
                vlocSlideHeader: true, // Added by Robert Henderson CORE-1077
                vlocSlideFooter: false // Added by Robert Henderson CORE-1077
            });
            // generate click on the modal to get insDropdownHandler directive to work:
            $timeout(function() {
                angular.element('.slds-modal__content').click();
            }, 500);
            modalScope.hideModal = function() {
                $timeout(function() {
                    insModal.hide();
                }, 500);
            };
        },
        hideModal : function(){
            angular.element('.slds-modal__close').click();
        }
    };
}]);
},{}],9:[function(require,module,exports){
angular.module('insInsuredItems').factory('NotificationHandler', 
    ['$rootScope','$timeout', function($rootScope, $timeout) {
    'use strict';
    var NotificationHandler = function() {
        this.initialize = function() {

        };
        this.handleError = function(error) {
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
angular.module("insInsuredItems").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("ins-insured-item-body.tpl.html",'<div ng-init="importedScope.insFn.setProductRecordType(records, params); importedScope.overridenAttribute = {}" ng-click="importedScope.categorySelected = item.Name" class="slds-m-bottom_small slds-p-top_small vloc-box slds-small-show via-slds-card__body slds-grid slds-grid_vertical" ng-class="{\'selected\': importedScope.categorySelected === item.Name, \'isChild\' : !item.columns, \'slds-box\' : importedScope.insFn.filterCoverages(item) || importedScope.filterMap[item.parentSpecId], \'isParent\' : item.columns.length}">\n   <div class="slds-grid vloc-card-header slds-p-left_small slds-p-right_small slds-p-top_small slds-p-bottom_small" ng-class="{\'dragging\' : $root.dragging}" ng-show="importedScope.insFn.filterCoverages(item) || importedScope.filterMap[item.parentSpecId];">\n      <div class="slds-media slds-media_center slds-has-flexi-truncate">\n         <div class="slds-media__figure">\n            <vloc-card-icon data="data" item="item" size="\'medium\'"></vloc-card-icon>\n         </div>\n         <div class="slds-media__body">\n            <a href="javascript:void(0);" class="slds-button vloc-btn" tooltip-placement="bottom" tooltip="{{data.title}}">\n            <span class="slds-text-heading_small" ng-click="importedScope.navigateTo(item.ChildProductId)">\n                \x3c!-- If parentProductChildItemId is NOT null, item is inherited from Product Class --\x3e\n                <span ng-if="item.parentProductChildItemId && $root.productRecordType !== \'Class\'" class="vloc-ins-overriden-info">\n                    <div class="vloc-ins-overriden-tooltip slds-popover slds-popover_tooltip slds-nubbin_bottom-left" role="tooltip" id="help">\n                        <div class="slds-popover__body">{{::importedScope.customLabels.InsInsuredItemsClassOverride}}</div>\n                    </div>\n                    <slds-button-svg-icon class="vloc-ins-class-icon"\n                        sprite="\'utility\'" icon="\'layers\'" no-hint="true"\n                        extra-classes="\'slds-button__icon_medium\'">\n                    </slds-button-svg-icon>\n                </span>\n                {{item.Name}}\n            </span>\n            </a><span class="vloc-italic" ng-if="item.ProductCode">({{item.ProductCode}})</span>\n         </div>\n      </div>\n      <div class="slds-no-flex slds-text-align_right">\n         <div>\n            <label class="slds-text-heading_label slds-p-right_medium">{{::importedScope.customLabels.InsProductCardinality}}</label>\n         </div>\n         <div class="slds-text-align_right">\n            <input class="slds-input slds-size_1-of-6" type="number" min="0" ng-model="item.MinQuantity" ng-disabled="item.parentProductChildItemId && $root.productRecordType !== \'Class\'" ng-change="importedScope.insFn.saveItemUpdated(item.Id, item.IsOptional, item.MinQuantity,  item.MaxQuantity, \'insuredItem\')" ng-model-options="{ updateOn: \'blur\' }"/><span> - </span>\n            <input class="slds-input slds-size_1-of-6" type="number" min="item.MinQuantity - 1" ng-disabled="item.parentProductChildItemId && $root.productRecordType !== \'Class\'" ng-model="item.MaxQuantity" ng-change="importedScope.insFn.saveItemUpdated(item.Id, item.IsOptional, item.MinQuantity,  item.MaxQuantity, \'insuredItem\')" ng-model-options="{ updateOn: \'blur\' }"/>\n         </div>\n      </div>\n   </div>\n   <div class="vloc-card-body slds-theme_default"  ng-class="{\'dragging\' : $root.dragging}" ng-show="importedScope.insFn.filterCoverages(item) || importedScope.filterMap[item.parentSpecId];">\n      \x3c!--Atributes: --\x3e\n      <div class="vloc-attr-grid slds-p-top_x-small slds-theme_default slds-p-left_small slds-p-right_small">\n        <div class="vloc-attr-row slds-row slds-p-bottom_medium" data-card="card-{{cardIndex}}" data-popover-flyout="true" ng-repeat="category in item.sortedCategories">\n            <div class="vloc-attr-category-heading slds-text-heading_small slds-m-left_xx-small slds-p-bottom_small" ng-click="importedScope.expanded[item.Id][category] = !importedScope.expanded[item.Id][category]" ng-init="importedScope.expanded[item.Id][category] = false || importedScope.expanded[item.Id][category]">\n               <slds-button-svg-icon sprite="\'utility\'" icon="\'chevronright\'" ng-if="!importedScope.expanded[item.Id][category]" extra-classes="vloc-attrs-category-btn"></slds-button-svg-icon>\n               <slds-button-svg-icon sprite="\'utility\'" icon="\'chevrondown\'" ng-if="importedScope.expanded[item.Id][category]" extra-classes="vloc-attrs-category-btn"></slds-button-svg-icon>\n               {{category}}\n            </div>\n            <div class="slds-col slds-grid slds-wrap slds-grid_align-spread" ng-repeat="row in item.categories[category] | orderBy : $root.nsPrefix + \'AttributeUniqueCode__c\'" ng-if="importedScope.expanded[item.Id][category]" ng-init="rowIndex = $index">\n                <div class="slds-small-show vloc-attr-cell slds-size_1-of-{{data.fields.length}}" ng-repeat="field in data.fields" ng-show="key != \'attributes\'" ng-class="{\'vloc-center-element\': field.name === $root.nsPrefix + \'HasRules__c\', \'vloc-hide-duplicate-column\': (!row[$root.nsPrefix + \'IsRatingAttribute__c\']) ? (field.name === $root.nsPrefix + \'RatingOutput__c\') : !(row[$root.nsPrefix + \'IsRatingAttribute__c\'] && (row[$root.nsPrefix + \'RatingType__c\'] === \'Input\' && field.name === $root.nsPrefix + \'RatingInput__c\') || (row[$root.nsPrefix + \'RatingType__c\'] === \'Output\' && field.name === $root.nsPrefix + \'RatingOutput__c\')) && (field.name === $root.nsPrefix + \'RatingInput__c\' || field.name === $root.nsPrefix + \'RatingOutput__c\')}">\n                  <div class="slds-text-title_caps slds-small-show vloc-attr-cell slds-truncate slds-size_1-of-1 slds-p-around_xx-small slds-m-horizontal_xx-small" ng-if="$parent.$index === 0">\n                    <span ng-if="records.fieldsMap[field.name] && records.fieldsMap[field.name].fieldLabel && field.name !== $root.nsPrefix + \'RatingInput__c\' && field.name !== $root.nsPrefix + \'RatingOutput__c\'">{{records.fieldsMap[field.name].fieldLabel}}</span>\n                    <span ng-if="records.fieldsMap[field.name] && records.fieldsMap[field.name].fieldLabel && field.name === $root.nsPrefix + \'RatingInput__c\'">{{::importedScope.customLabels.InsRatingMapping}}</span>\n                    <span ng-if="records.fieldsMap[field.name] && records.fieldsMap[field.name].fieldLabel && field.name === $root.nsPrefix + \'RatingOutput__c\'">{{::importedScope.customLabels.InsRatingMapping}}</span>\n\n                    <span ng-if="(!records.fieldsMap[field.name] || !records.fieldsMap[field.name].fieldLabel)">\n                        <span ng-if="field.name === $root.nsPrefix + \'HasRules__c\'">{{::importedScope.customLabels.InsProductRules}}</span>\n                        <span ng-if="field.name !== $root.nsPrefix + \'HasRules__c\'">{{field.label}}</span>\n                    </span>\n                  </div>\n                  <div class="vloc-attr-data-cell slds-truncate slds-p-around_xx-small slds-m-horizontal_xx-small vloc-tooltip-container" ng-class="{\'vloc-attribute-overriden\': $index === 0 && row[$root.nsPrefix + \'ObjectId__c\'] === item.Id}">\n                     <div class="slds-select_container slds-m-right_small slds-size_1-of-1"  ng-if="row[$root.nsPrefix + \'IsRatingAttribute__c\'] &&  field.name === $root.nsPrefix + \'RatingType__c\'">\n                        <select ng-if="row[field.name]" ng-disabled="$root.productRecordType === \'RatingFactSpec\' || $root.productRecordType === \'Class\'" ng-change="importedScope.saveAttribute(item.Id, item.ChildProductId, row, \'insuredItem\')" ng-options="options.key as options.label for options in importedScope.picklistOptions" class="slds-select slds-m-right_xx-small slds-truncate" ng-model="row[field.name]">\n                        </select>\n                        <select ng-if="!row[field.name]" ng-init="row[field.name] = \'Input\'" ng-disabled="$root.productRecordType === \'RatingFactSpec\' || $root.productRecordType === \'Class\'" ng-change="importedScope.saveAttribute(item.Id, item.ChildProductId, row, \'insuredItem\')" ng-options="options.key as options.label for options in importedScope.picklistOptions" class="slds-select slds-m-right_xx-small slds-truncate" ng-model="row[field.name]">\n                        </select>\n                     </div>\n                     <span ng-if="field.name !== $root.nsPrefix + \'RatingType__c\' && field.name !== $root.nsPrefix + \'IsRatingAttribute__c\' && field.name !==  $root.nsPrefix + \'RatingInput__c\' && field.name !==  $root.nsPrefix + \'RatingOutput__c\' && field.name !== $root.nsPrefix + \'HasRules__c\'">\n                        <span ng-if="$index === 0 && !row.ruleError && row[$root.nsPrefix + \'ObjectId__c\'] === item.Id" class="vloc-tooltip-insured-items">\n                            <div class="vloc-overriden-tooltip slds-popover slds-popover_tooltip slds-nubbin_bottom-left" ins-tooltip-offset role="tooltip" id="help">\n                                <div class="slds-popover__body">{{::importedScope.customLabels.InsProductOverridenMessage}}</div>\n                            </div>\n                            <span>*</span>\n                        </span>\n                        <span class="vloc-field-label" ng-if="field.label !== \'Value\' && field.type !== \'BOOLEAN\'">\n                            {{row | getter: field | picker: field.type}}\n                        </span>\n                        <span ng-if="field.label === \'Value\'">\n                        <span ng-if="row.valueType !== \'percent\'"> {{row | getter: field | picker: row.valueType}}</span>\n                        <span ng-if="row.valueType === \'percent\'"> {{row[$root.nsPrefix + \'Value__c\']}}%</span>\n                        </span>\n                        <div class="slds-form-element__control slds-text-align_left" ng-if="field.type === \'BOOLEAN\'">\n                           <span class="slds-checkbox">\n                           <input type="checkbox" name="attrs-{{$parent.$index}}" id="attrs-{{$parent.$index}}" ng-model="row[field.name]" ng-disabled="$root.productRecordType === \'Class\'"/>\n                           <label class="slds-checkbox__label slds-m-around_none" for="attrs-{{$parent.$index}}">\n                           <span class="slds-checkbox_faux vloc-check"></span>\n                           </label>\n                           </span>\n                        </div>\n                     </span>\n                     <div class="slds-form-element__control slds-text-align_left vloc-attrs-checkbox" ng-if="field.type === \'BOOLEAN\' || field.type === \'boolean\'">\n                        <span class="slds-checkbox">\n                        <input type="checkbox" name="config-attrs-{{row.Id}}" id="config-attrs-{{row.Id}}" ng-change="importedScope.saveAttribute(item.Id, item.ChildProductId, row, \'insuredItem\'); importedScope.overridenAttribute[rowIndex] = row[$rootScope.nsPrefix + \'AttributeUniqueCode__c\']" ng-model="row[field.name]" ng-disabled="$root.productRecordType === \'Class\'"/>\n                        <label class="slds-checkbox__label slds-m-around_none" for="config-attrs-{{row.Id}}">\n                            <span class="slds-checkbox_faux vloc-check"></span>\n                        </label>\n                        </span>\n                     </div>\n                     <span ng-if="row[$root.nsPrefix + \'IsRatingAttribute__c\'] && (row[$root.nsPrefix + \'RatingType__c\'] === \'Input\' && field.name ===  $root.nsPrefix + \'RatingInput__c\' ) || (row[$root.nsPrefix + \'RatingType__c\'] === \'Output\' && field.name ===  $root.nsPrefix + \'RatingOutput__c\')">\n                        <input class="slds-input vloc-attrs-input" type="{row.dataType}}" ng-change="importedScope.saveAttribute(item.Id, item.ChildProductId, row, \'insuredItem\')" ng-model="row[field.name]" ng-model-options="{ updateOn: \'blur\' }" ng-if="field.type !== \'BOOLEAN\' && field.type !== \'boolean\'" ng-disabled="$root.productRecordType === \'Class\'"/>\n                        <div class="slds-form-element__control slds-text-align_left vloc-attrs-checkbox" ng-if="field.type === \'BOOLEAN\' || field.type === \'boolean\'">\n                           <span class="slds-checkbox">\n                           <input type="checkbox" name="config-attrs-{{row.Id}}" id="config-attrs-{{row.Id}}" ng-model="row[field.name]" ng-disabled="$root.productRecordType === \'Class\'"/>\n                           <label class="slds-checkbox__label slds-m-around_none" for="config-attrs-{{row.Id}}">\n                           <span class="slds-checkbox_faux vloc-check"></span>\n                           </label>\n                           </span>\n                        </div>\n                     </span>\n                     <span class="vloc-rules-icon slds-text-align_center" ng-if="field.name === $root.nsPrefix + \'HasRules__c\'" ng-click="importedScope.insFn.showRulesOption(row, item)" ng-class="{\'has-rules\': row.rules.length > 0}">\n                        <slds-button-svg-icon sprite="\'custom\'" icon="\'custom90\'" no-hint="true" extra-classes="\'slds-button__icon_large\'"></slds-button-svg-icon>\n                     </span>\n                  </div>\n                </div>\n                <div class="slds-small-show vloc-attr-cell slds-size_1-of-{{data.fields.length}}" ng-show="key != \'attributes\'">\n                    <div class="slds-text-title_caps slds-small-show vloc-attr-cell slds-truncate slds-size_1-of-1 slds-p-around_xx-small slds-m-horizontal_xx-small" ng-if="$index == 0">\n                        {{::importedScope.customLabels.Actions}}\n                    </div>\n                    <div class="vloc-attr-data-cell slds-truncate slds-p-around_xx-small slds-m-horizontal_xx-small">\n                        <div class="vloc-attribute-actions"\n                            ng-click="importedScope.showJSONdiff(\n                                row,\n                                item,\n                                row[$root.nsPrefix + \'ObjectId__c\'] === item.Id,\n                                \'insuredItem\'\n                            )">\n                            <span>{{::importedScope.customLabels.View | lowercase}} JSON</span>\n                        </div>\n                        <span class="vloc-actions-divider" ng-if="row[$root.nsPrefix + \'ObjectId__c\'] === item.Id"> | </span>\n                        <div class="vloc-attribute-actions" ng-if="row[$root.nsPrefix + \'ObjectId__c\'] === item.Id" ng-click="importedScope.revertAttribute(item.Id, item.ChildProductId, row, \'insuredItem\')"">{{::importedScope.customLabels.InsProductRevert | lowercase}}</div>\n                    </div>\n                </div>\n            </div>\n         </div>\n      </div>\n   </div>\n   <div ng-class="{\'dragging\' : $root.dragging}" class="row " ng-repeat="list in item.columns" ng-include="\'list.html\'"></div>\n   \x3c!-- Do not allow Parent Class items to be removed --\x3e\n   <div ng-show="(importedScope.insFn.filterCoverages(item) || importedScope.filterMap[item.parentSpecId]) && item.parentProductChildItemId == null" class="slds-theme_default vloc-border-radius vloc-card-body" ng-class="{\'dragging\' : $root.dragging}">\n      <button class="slds-button slds-button_link  slds-m-horizontal_medium slds-p-horizontal_medium" ng-click="importedScope.insFn.deleteInsuredItem(item.Id)">{{::importedScope.customLabels.Remove}}</button>\n   </div>\n   <div class="embed-flyout slds-p-left_medium slds-p-right_medium"></div>\n   <div ng-show="importedScope.insFn.filterCoverages(item) || importedScope.filterMap[item.parentSpecId]"class="slds-x-small-show-only via-slds-x-small-card__body slds-card__body slds-grid slds-grid_vertical slds-theme_default" ng-if="!$root.dragging">\n      <div class="slds-size_1-of-1 slds-x-small-show-only" ng-repeat="field in data.fields.slice(1, 6)" ng-show="key != \'attributes\'">\n         <div class="slds-grid via-slds-grid slds-p-around_small">\n            <div class="slds-col slds-size_1-of-2">\n               <p class="slds-text-align_left slds-truncate slds-text-heading_label" title="{{field.label}}">\n                 <span ng-if="records.fieldsMap[field.name] && records.fieldsMap[field.name].fieldLabel">{{records.fieldsMap[field.name].fieldLabel}}&nbsp;</span>\n                 <span ng-if="!records.fieldsMap[field.name] || !records.fieldsMap[field.name].fieldLabel">{{field.label}}&nbsp;</span>\n               </p>\n            </div>\n            <div class="slds-col slds-size_1-of-2" ng-if="!item[field.relationshipName]">\n               <p class="slds-text-align_right slds-truncate" >{{item | getter: field | picker: field.type}}&nbsp;</p>\n            </div>\n            <div class="slds-col slds-size_1-of-2" ng-if="item[field.relationshipName]">\n               <p class="slds-text-align_right slds-truncate" >{{item[field.relationshipName][\'Name\']}}&nbsp;</p>\n            </div>\n         </div>\n      </div>\n   </div>\n   <div ng-show="importedScope.insFn.filterCoverages(item) || importedScope.filterMap[item.parentSpecId]" class="slds-card__footer slds-x-small-show-only slds-theme_default" ng-if="!$root.dragging">\n      <button class="slds-button" ng-click="performFlyout(uniqueLayoutId + \'-card-\'+ cardIndex);">\n      <span ng-if="!isSelected(cardIndex)">{{::$root.vlocity.getCustomLabel(\'ViewMore\', \'View More\')}}</span>\n      <span ng-if="isSelected(cardIndex)">{{::$root.vlocity.getCustomLabel(\'ViewLess\', \'View Less\')}}</span>\n      </button>\n   </div>\n</div>\n'),$templateCache.put("modals/ins-attribute-json-diff.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{vlocSlideCustomClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{vlocSlideCustomClass}}-container">\n        <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()" ng-if="!vlocSlideHeader">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Close</span>\n        </button>\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n        </header>\n        <div class="slds-modal__content vloc-modal-content slds-is-relative">\n            <div class="slds-spinner_container" ng-class="{\'vloc-show-loader\': !isModalLoaded}">\n                <div class="slds-spinner_brand slds-spinner slds-spinner_large slds-m-top_x-large slds-m-bottom_x-large" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n              <vloc-layout layout-name="{{layout}}" class="{{layout}}" is-loaded="isLayoutLoaded" records="records" ctrl="{{ctrl}}"></vloc-layout>\n        </div>\n        \x3c!-- <footer class="slds-modal__footer" ng-show="vlocSlideFooter">\n            <button class="slds-button slds-button_neutral" ng-click="$slideHide()">Cancel</button>\n        </footer> --\x3e\n    </div>\n</div>\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -100%;\n        margin-bottom: 45px;\n        height: auto;\n        transition: top 250ms ease-in;\n        position: absolute;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds .slds-modal\n    .slds-modal__container.vloc-modal-container.vloc-comparison-overriden-json-container {\n        width: 90%;\n        min-width: 90%;\n        max-width: 90%;\n    }\n\n    .vlocity.via-slds .slds-modal\n    .slds-modal__container.vloc-modal-container.vloc-comparison-original-json-container {\n        width: 50%;\n        min-width: 50%;\n        max-width: 50%;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: auto;\n        max-height: 62rem;\n        padding: 0;\n        margin: 1rem 0 0;\n        position: absolute;\n        left: 50%;\n        transform: translateX(-50%);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 20rem;\n        border-radius: 0;\n        margin-bottom: 2.5rem;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); /* leaving room for iPhone notification bar */\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; /* Android doesn\'t need the 20px of room like iPhone */\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>\n'),$templateCache.put("modals/ins-product-selection-modal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{vlocSlideCustomClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{vlocSlideCustomClass}}-container">\n        <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()" ng-if="!vlocSlideHeader">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Close</span>\n        </button>\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n        </header>\n        <div class="slds-modal__content vloc-modal-content slds-is-relative">\n            <div class="slds-spinner_container" ng-class="{\'vloc-show-loader\': !isModalLoaded}">\n                <div class="slds-spinner_brand slds-spinner slds-spinner_large slds-m-top_x-large slds-m-bottom_x-large" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n              <vloc-layout layout-name="{{layout}}" class="{{layout}}" is-loaded="isLayoutLoaded" records="records" ctrl="{{ctrl}}"></vloc-layout>\n        </div>\n        <footer class="slds-modal__footer" ng-show="vlocSlideFooter">\n            <button class="slds-button slds-button_neutral" ng-click="$slideHide()">Cancel</button>\n        </footer>\n    </div>\n</div>\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -100%;\n        margin-bottom: 45px;\n        height: auto;\n        transition: top 250ms ease-in;\n        position: absolute;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: auto;\n        max-height: 35rem;\n        width: 90%;\n        min-width: 90%;\n        max-width: 90%;\n        padding: 0;\n        margin: 1rem 0 0;\n        position: absolute;\n        left: 50%;\n        transform: translateX(-50%);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 20rem;\n        border-radius: 0;\n        margin-bottom: 2.5rem;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); /* leaving room for iPhone notification bar */\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; /* Android doesn\'t need the 20px of room like iPhone */\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>')}]);

},{}]},{},[1]);
})();

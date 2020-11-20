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
angular.module('insLargeGroupQuotePlans', ['vlocity', 'CardFramework', 'sldsangular', 'forceng', 'ngSanitize', 'cfp.hotkeys'])
    .config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    }]).config(['$compileProvider', function($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }]).run(['$rootScope', 'dataService', 'userProfileService', function($rootScope, dataService, userProfileService) {
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

        const translationKeys = ['InsQuotesExpandAll', 'InsQuoteDeletedQuoteLineItem', 'InsQuoteCreatedQuoteLineItem', 'InsQuotesCollapseAll', 'InsQuotesAddProduct', 'InsQuotesConfigurePlan', 'Save', 'Close', 'InsAssetInfo',
            'InsQuotesNoAttributes', 'InsQuotesNoProductsReturned', 'Select', 'Selected', 'Details', 'InsQuotesHideDetails',
            'InsQuotesGroups', 'InsQuotesAddGroups', 'InsQuotesGroup', 'InsQuotesClass','InsQuotesGroupCode', 'InsQuotesClassCode', 'RemoveGroup',
            'Delete', 'InsQuotesSearchProducts', 'InsQuotesSelectGroupId', 'InsQuotesSelectAll', 'InsQuotesChooseRow', 'Edit', 'View', 'InsQuotesInNetwork',
            'InsQuotesRecommended', 'InsQuotesTier', 'InsProductLife', 'InsProductMedicalIndividual', 'InsProductMedicalMedicare', 'InsProductMedicalLargeGroup',
            'InsProductDental', 'InsProductVision', 'InsProductSpecialty', 'InsProductLife', 'InsProductMedicalSmallGroup', 'InsQuoteRemovePlan', 'InsQuoteClonePlan', 'InsQuotesCovered'
          ];

        $rootScope.customLabels = {};
        userProfileService.getUserProfile().then(function(user) {
            let userLanguage = user.language.replace("_", "-") || user.language;
            dataService.fetchCustomLabels(translationKeys, userLanguage).then(
                function(translatedLabels) {
                    $rootScope.customLabels = translatedLabels;
                }
            );
        });

    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        'use strict';
        return function(sldsURL) {
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]);

// Controllers
require('./modules/insLargeGroupQuotePlans/controller/InsLargeGroupQuotePlansController.js');

// Templates
require('./modules/insLargeGroupQuotePlans/templates/templates.js');

//Factories
require('./modules/insLargeGroupQuotePlans/factory/InsLargeGroupQuotePlansModalService.js');
require('./modules/insLargeGroupQuotePlans/factory/InsLargeGroupQuotePlansService.js');

},{"./modules/insLargeGroupQuotePlans/controller/InsLargeGroupQuotePlansController.js":2,"./modules/insLargeGroupQuotePlans/factory/InsLargeGroupQuotePlansModalService.js":3,"./modules/insLargeGroupQuotePlans/factory/InsLargeGroupQuotePlansService.js":4,"./modules/insLargeGroupQuotePlans/templates/templates.js":5}],2:[function(require,module,exports){
angular.module('insLargeGroupQuotePlans').controller('InsLargeGroupQuotePlansController', ['$scope', '$rootScope', 'InsLargeGroupQuotePlansService', 'InsLargeGroupQuotePlansModalService', 'dataService', 'userProfileService', function($scope, $rootScope, InsLargeGroupQuotePlansService, InsLargeGroupQuotePlansModalService, dataService, userProfileService) {
    'use strict';
    $rootScope.selectedGroups = {};
    $rootScope.checkAllGroups = false;
    // Used for preventing $broadcast from refreshing until data is ready
    $rootScope.layoutIsLoading = $rootScope.layoutIsLoading || false;

    $scope.dropdownActionsConstants = {
        'Individual Medical': {
            id: 'Individual Medical',
            key: 'InsProductMedicalIndividual',
            name: 'Medical - Individual'
        },
        'Medicare Medical': {
            id: 'Medicare Medical', 
            key: 'InsProductMedicalMedicare',
            name: 'Medical - Medicare'
        },
        'Small Group Medical':{
            id: 'Small Group Medical',
            key: 'InsProductMedicalSmallGroup',
            name: 'Medical - Small Group'
        },
        'Large Group Medical':{
            id: 'Large Group Medical',
            key: 'InsProductMedicalLargeGroup',
            name: 'Medical - Large Group'
        },
        'Dental':{
            id: 'Dental',
            key: 'InsProductDental',
            name: 'Dental'
        },
        'Vision':{
            id: 'Vision',
            key: 'InsProductVision',
            name: 'Vision'
        },
        'Speciality':{
            id: 'Speciality',
            key: 'InsProductSpecialty',
            name: 'Speciality'
        },
        'Life':{
            id: 'Life',
            key: 'InsProductLife',
            name: 'Life',
        }
    };

    /* 
    * Get translations for MP actions, for dynamic actions use displayname from card layout admin config
    * @params {Array} actions list of actions for the card (which appears in the dropdown)
    */
    $scope.translateDropdownActions = function(actions) {
        if (actions && actions.length > 0) {
            actions.forEach(action => {
                if ($scope.dropdownActionsConstants.hasOwnProperty(action.id)) {
                    let translationKey = $scope.dropdownActionsConstants[action.id].key;
                    $scope.dropdownActionsConstants[action.id].label = $rootScope.customLabels[translationKey] || $scope.dropdownActionsConstants[action.id].name;
                } else {
                    $scope.dropdownActionsConstants[action.id] = {label : action.displayName};
                }
            });
        }
        console.log('***definedActions', $scope.dropdownActionsConstants);
    }

    $scope.largeGroupQuoteLabels = true;

    // Helper function to organize values for each group
    /**
     * @param {Array} groupClasses
     */
    function formatGroupKeys(groupClasses) {
        angular.forEach(groupClasses, function(group) {
            group.formattedValues = {
                groupName: group.groupName || _.get(group, 'GroupId__r.Name') || _.get(group, $rootScope.nsPrefix + 'GroupId__r.Name'),
                className: group.Name,
                groupCode: group[$rootScope.nsPrefix + 'GroupId__c'],
                classCode: group[$rootScope.nsPrefix + 'ClassCode__c']
            };
        });
    }

    // Helper function to convert date object to formatted string for backend
    /**
     * @param {Object} date
     */
    function formatDate(date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }

    // Assign data to $rootScope
    /**
     * @param {Object} params
     * @param {Object} payload Unfiltered response from remote method in layout
     */
    $scope.initData = function(params, payload) {
        $rootScope.params = params;
        $rootScope.availableFormularies = payload.availableFormularies;
        $rootScope.availableNetworks = payload.availableNetworks;
        $rootScope.fieldList = {};
        angular.forEach(payload.fieldList, function(field) {
            $rootScope.fieldList[field.fieldName] = field;
        });
    };

    // Link to Quote Line Item page
    /**
     * @param {Object} record Quote Line Item
     * @param {Object} $event Used to prevent click event on row element
     */
    $scope.navigateTo = function(record, $event) {
        $event.stopPropagation();
        if (record.Id) {
            if (typeof sforce !== 'undefined' && sforce !== null) {
                const url = '/lightning/r/QuoteLineItem/' + record.Id + '/view?' + $rootScope.nsPrefix + 'rootLineId=' + record.Id + '&' + $rootScope.nsPrefix + 'rootProdId=' + record.Product2Id;
                sforce.one.navigateToURL(url);
            } else {
                window.location.href = '/' + record.Id + '?rootProdId=' + record.Product2Id;
            }
        }
    };

    // Assigns selected Quote Line Item to $rootScope.activeRow
    /**
     * @param {Object} [obj] Selected quote line item
     * @param {Object} records All quote line items
     */
    $scope.setActivePlan = function(obj, records) {
        if (obj && $rootScope.showPanel && $rootScope.activeRow.LineNumber === obj.LineNumber) {
            // Clicking on active row closes right panel
            $rootScope.showPanel = false;
            return;
        } else if (!obj) {
            if (!records) {
                // Hide panel when there is no data
                $rootScope.showPanel = false;
                $rootScope.activeRow = null;
                return;
            } else if ($rootScope.activeRow) {
                // Updates data for current active row after remote action
                for (let i = 0; i < records.length; i++) {
                    if (records[i].LineNumber === $rootScope.activeRow.LineNumber) {
                        obj = records[i];
                        break;
                    }
                }
            } else {
                // Sets first row as active on page load
                obj = records[0];
            }
        }
        $rootScope.showPanel = true;
        $rootScope.activeRow = obj;
        if ($rootScope.activeRow.groupClasses) {
            formatGroupKeys($rootScope.activeRow.groupClasses.records);
        }
        const inputMap = {
            quoteId: $rootScope.params.id,
            lineId: $rootScope.activeRow.Id
        };
        // Get eligible groups for quote line item
        InsLargeGroupQuotePlansService.getGroupClasses($scope, inputMap)
            .then(function(data) {
                $rootScope.activeRow.eligibleGroupClasses = data.groupClasses;
                formatGroupKeys($rootScope.activeRow.eligibleGroupClasses);
            });
        console.log('$rootScope.activeRow', $rootScope.activeRow);
    };

    // Get products that can be added at a quote line item
    /**
     * @param {Object} productType Filter for getEligibleProducts
     */
    $scope.getEligibleProducts = function(productType) {
        if (!$rootScope.productTypeMap) {
            $rootScope.productTypeMap = {};
        }
        if (productType && !$rootScope.productTypeMap[productType.id]) {
            const inputMap = {
                'quoteId': $rootScope.params.id,
                'classDetail': '',
                'filters': productType.extraParams.Filter,
                'effectiveDtStr': null
            };
            InsLargeGroupQuotePlansService.getProducts($scope, inputMap, 'getRatedProducts', 'AttributeRatingHandler')
                .then(function(data) {
                    console.log('productType', productType);
                    $rootScope.productTypeMap[productType.id] = data.records;
                    console.log('getEligibleProducts done:', $rootScope.productTypeMap);
                });
        }
    };

    // getGroupRatedProducts that can be added at a quote line item, if censusId send censusId else send accountId
    /**
     * @param {Object} productType Filter for getGroupRatedProducts
     */
    $scope.getGroupRatedProducts = function(productType) {
        if (!$rootScope.productTypeMap) {
            $rootScope.productTypeMap = {};
        }
        if (productType && !$rootScope.productTypeMap[productType.id]) {
            const inputMap = {
                'quoteId': $rootScope.params.id,
                'filters': productType.extraParams.Filter,
                'effectiveDtStr': null
            };
            if($rootScope.quoteData){
                if($rootScope.quoteData[$rootScope.nsPrefix + 'GroupCensusId__c']){
                    inputMap.censusId = $rootScope.quoteData[$rootScope.nsPrefix + 'GroupCensusId__c'];
                }
                else{
                    inputMap.accountId = $rootScope.quoteData.AccountId; 
                }
            }
            InsLargeGroupQuotePlansService.getProducts($scope, inputMap, 'getRatedGroupProducts', 'InsProductService')
                .then(function(data) {
                    console.log('productType', productType);
                    $rootScope.productTypeMap[productType.id] = data.records;
                    if(!data.records && data.result && data.result.listProducts){
                        $rootScope.productTypeMap[productType.id] = data.result.listProducts.records;
                    }
                    console.log('getGroupRatedProducts done:', $rootScope.productTypeMap);
                });
        }
    };

    // Format admin-configured fields
    /**
     * @param {Array} fields Product fields specified in Cards UI
     */
    $scope.setProductFields = function(fields) {
        if (!$scope.fields) {
            const reg = /\['(.*)'\]/;
            angular.forEach(fields, function(field) {
                field.formattedName = field.name.replace(reg, '$1');
            });
            $scope.fields = fields;
        }
        for (let i = 0; i < $scope.fields.length; i++) {
            const field = $scope.fields[i];
            if (field.type === 'date' || field.type === 'datetime') {
                $rootScope.activeRow[field.formattedName] = formatDate($rootScope.activeRow[field.formattedName]);
            }
        }
    };

    // Clone quote line item
    /**
     * @param {String} id Quote line id
     * @param {Object} $event Used to prevent click event on row element
     */
    $scope.cloneRootQuoteLine = function(id, $event) {
        $event.stopPropagation();
        const inputMap = {
            healthQuoteLineId: id
        };
        InsLargeGroupQuotePlansService.cloneRootQuoteLine($scope, inputMap);
    };

    // Create quote line item
    /**
     * @param {Object} record Product
     */
    $scope.addItemLargeGroup = function(record) {
        const inputMap = {
            quoteId: $rootScope.params.id,
            productId: record.Id
        };
        InsLargeGroupQuotePlansService.addItemLargeGroup($scope, inputMap);
    }

    // Delete quote line item
    /**
     * @param {String} id Quote line id
     * @param {Object} $event Used to prevent click event on row element
     */
    $scope.deleteItem = function(id, $event) {
        $event.stopPropagation();
        const inputMap = {
            quoteItemId: id
        };
        InsLargeGroupQuotePlansService.deleteItem($scope, inputMap);
        $scope.activeRow = null;
    };

    // Update quote line item
    $scope.updateItem = function() {
        const fieldValueMap = {};
        angular.forEach($scope.fields, function(field) {
            // Collect values for updateable fields
            if ($rootScope.fieldList[field.formattedName] && $rootScope.fieldList[field.formattedName].isUpdateable) {
                let value = $rootScope.activeRow[field.formattedName];
                if (field.type === 'date' || field.type === 'datetime') {
                    value = formatDate(value);
                }
                fieldValueMap[field.formattedName] = value;
            }
        });
        const inputMap = {
            quoteItemId: $rootScope.activeRow.Id,
            fieldValueMap: fieldValueMap
        };
        InsLargeGroupQuotePlansService.updateItem($scope, inputMap);
    };

    // Trigger sldsModal
    $scope.openGroupModal = function() {
        InsLargeGroupQuotePlansModalService.launchModal($scope, 'ins-large-group-quote-groups-modal', 'InsLargeGroupQuotePlansController', 'vloc-quote-modal');
    };

    // Select/deselect all groups in modal
    $scope.toggleSelectAllGroups = function(groups) {
        if (!$rootScope.checkAllGroups) {
            $rootScope.selectedGroups = [];
        } else {
            angular.forEach(groups, function(group) {
                $rootScope.selectedGroups[group.Id] = true;
            });
        }
    };

    // Add selected groups to quote line item
    $scope.associateGroupClassesToLine = function() {
        const groupClassIds = [];
        for (let groupId in $rootScope.selectedGroups) {
            // Filter out groups that were selected then unselected
            if ($rootScope.selectedGroups[groupId] && typeof($rootScope.selectedGroups[groupId]) === 'boolean') {
                groupClassIds.push(groupId);
            }
        }
        if (groupClassIds.length > 0) {
            const inputMap = {
                quoteId: $rootScope.params.id,
                lineId: $rootScope.activeRow.Id,
                groupClassIds: groupClassIds
            };
            InsLargeGroupQuotePlansService.associateGroupClassesToLine($scope, inputMap);
        }
    };

    // Delete group from quote line item
    /**
     * @param {String} id Quote line id
     */
    $scope.removeQliGroupClass = function(id) {
        const inputMap = {
            qliGroupClassId: id
        };
        InsLargeGroupQuotePlansService.removeQliGroupClass($scope, inputMap);
    };
}]);

},{}],3:[function(require,module,exports){
angular.module('insLargeGroupQuotePlans').factory('InsLargeGroupQuotePlansModalService', ['$rootScope', '$sldsModal', function($rootScope, $sldsModal) {
    'use strict';
    const scrollTop = function() {
        if ('parentIFrame' in window) {
            window.parentIFrame.scrollTo(0);
        } else {
            $('body').scrollTop(0);
        }
    };

    return {
        launchModal: function(scope, layout, ctrl, customClass) {
            console.log('layout', layout);
            const modalScope = scope.$new();
            scrollTop();
            modalScope.vlocQuote = scope.vlocQuote;
            modalScope.isLayoutLoaded = false;
            modalScope.layout = layout;
            modalScope.records = $rootScope.activeRow.eligibleGroupClasses;
            modalScope.ctrl = ctrl;
            modalScope.title = $rootScope.vlocity.getCustomLabel('InsQuotesAddGroups', 'Add Groups');
            modalScope.customClass = customClass;
            $sldsModal({
                scope: modalScope,
                templateUrl: 'modals/ins-plan-modal.tpl.html',
                show: true,
                vlocSlide: true
            });
        },
        closeModal: function() {
            angular.element('.slds-modal__close').click();
        }
    };
}]);

},{}],4:[function(require,module,exports){
angular.module('insLargeGroupQuotePlans').factory('InsLargeGroupQuotePlansService', ['dataSourceService', '$q', '$rootScope', '$timeout', function(dataSourceService, $q, $rootScope, $timeout) {
    'use strict';
    const nsPrefix = fileNsPrefix().replace('__', '');

    // Helper function to wait before refreshing layout
    const refreshList = function() {
        const message = {
            event: 'reload'
        };
        if($rootScope.isSmallGroup){
            $rootScope.$broadcast('vlocity.layout.ins-small-group-quote-plans-container.events', message);
        } else {
            $rootScope.$broadcast('vlocity.layout.ins-large-group-quote-plans-container.events', message);
        }
        $rootScope.isLoaded = true;
        $rootScope.layoutIsLoading = true;
        $timeout(function() {
            $rootScope.layoutIsLoading = false;
        }, 1500);
    };

    // Helper function to set error for UI
    /**
     * @param {Object} error
     */
    const errorHandler = function(error) {
        console.error(error);
        $rootScope.notification.type = 'error';
        $rootScope.notification.active = true;
        $rootScope.notification.message = error.message;
        $rootScope.isLoaded = true;
        $timeout(function() {
            $rootScope.notification.active = false;
        }, 3000);
    };

    return {
        getProducts: function(scope, inputMap, remoteMethod, remoteClass) {
            $rootScope.isLoaded = false;
            const deferred = $q.defer();
            console.log('Calling: ', remoteMethod);
            let omitRatingAndChildren = !$rootScope.isSmallGroup;
            const datasource = {
                type: 'Dual',
                value: {
                    remoteNSPrefix: nsPrefix,
                    remoteClass: remoteClass,
                    remoteMethod: remoteMethod,
                    inputMap: inputMap,
                    apexRemoteResultVar: 'result.records',
                    methodType: 'GET',
                    apexRestResultVar: 'result.records',
                    optionsMap: {
                        omitRating: omitRatingAndChildren,
                        omitChildren: omitRatingAndChildren
                    }
                }
            };
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null)
                .then(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    $rootScope.isLoaded = true;
                }, function(error) {
                    errorHandler(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        cloneRootQuoteLine: function(scope, inputMap) {
            $rootScope.isLoaded = false;
            const deferred = $q.defer();
            console.log('Calling: ', 'cloneRootQuoteLine');
            const datasource = {
                type: 'Dual',
                value: {
                    remoteNSPrefix: nsPrefix,
                    remoteClass: 'InsuranceClonerHandler',
                    remoteMethod: 'cloneRootQuoteLine',
                    inputMap: inputMap,
                    apexRemoteResultVar: 'result.records',
                    methodType: 'GET',
                    apexRestResultVar: 'result.records'
                }
            };
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('cloneRootQuoteLine datasource', datasource);
            dataSourceService.getData(datasource, scope, null)
                .then(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    refreshList();
                    console.log('cloneRootQuoteLine done');
                }, function(error) {
                    errorHandler(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        addItemLargeGroup: function(scope, inputMap) {
            $rootScope.isLoaded = false;
            const deferred = $q.defer();
            console.log('Calling: ', 'addItemLargeGroup');
            const datasource = {
                type: 'Dual',
                value: {
                    remoteNSPrefix: nsPrefix,
                    remoteClass: 'InsuranceClonerHandler',
                    remoteMethod: 'addItemLargeGroup',
                    inputMap: inputMap,
                    apexRemoteResultVar: 'result.records',
                    methodType: 'GET',
                    apexRestResultVar: 'result.records'
                }
            };
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('addItemLargeGroup datasource', datasource);
            dataSourceService.getData(datasource, scope, null)
                .then(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    refreshList();
                    console.log('addItemLargeGroup done');
                }, function(error) {
                    errorHandler(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        deleteItem: function(scope, inputMap) {
            $rootScope.isLoaded = false;
            const deferred = $q.defer();
            console.log('Calling: ', 'deleteItem');
            const datasource = {
                type: 'Dual',
                value: {
                    remoteNSPrefix: nsPrefix,
                    remoteClass: 'InsuranceQuoteProcessingService',
                    remoteMethod: 'deleteItem',
                    inputMap: inputMap,
                    apexRemoteResultVar: 'result.records',
                    methodType: 'GET',
                    apexRestResultVar: 'result.records'
                }
            };
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('deleteItem datasource', datasource);
            dataSourceService.getData(datasource, scope, null)
                .then(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    refreshList();
                    console.log('deleteItem done');
                }, function(error) {
                    errorHandler(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        updateItem: function(scope, inputMap) {
            $rootScope.isLoaded = false;
            const deferred = $q.defer();
            console.log('Calling: ', 'updateItem');
            const datasource = {
                type: 'Dual',
                value: {
                    remoteNSPrefix: nsPrefix,
                    remoteClass: 'InsuranceQuoteProcessingService',
                    remoteMethod: 'updateItem',
                    inputMap: inputMap,
                    apexRemoteResultVar: 'result.records',
                    methodType: 'GET',
                    apexRestResultVar: 'result.records'
                }
            };
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('updateItem datasource', datasource);
            dataSourceService.getData(datasource, scope, null)
                .then(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    refreshList();
                    console.log('updateItem done');
                }, function(error) {
                    errorHandler(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        addItemLargeGroup: function(scope, inputMap) {
            $rootScope.isLoaded = false;
            const deferred = $q.defer();
            console.log('Calling: ', 'addItemLargeGroup');
            const datasource = {
                type: 'Dual',
                value: {
                    remoteNSPrefix: nsPrefix,
                    remoteClass: 'InsuranceQuoteProcessingService',
                    remoteMethod: 'addItemLargeGroup',
                    inputMap: inputMap,
                    apexRemoteResultVar: 'result.records',
                    methodType: 'GET',
                    apexRestResultVar: 'result.records'
                }
            };
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('addItemLargeGroup datasource', datasource);
            dataSourceService.getData(datasource, scope, null)
                .then(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    refreshList();
                    console.log('addItemLargeGroup done');
                }, function(error) {
                    errorHandler(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        getGroupClasses: function(scope, inputMap) {
            $rootScope.isLoaded = false;
            const deferred = $q.defer();
            console.log('Calling: ', 'getGroupClasses');
            const datasource = {
                type: 'Dual',
                value: {
                    remoteNSPrefix: nsPrefix,
                    remoteClass: 'InsuranceQuoteProcessingService',
                    remoteMethod: 'getGroupClasses',
                    inputMap: inputMap,
                    apexRemoteResultVar: 'result.records',
                    methodType: 'GET',
                    apexRestResultVar: 'result.records'
                }
            };
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('getGroupClasses datasource', datasource);
            dataSourceService.getData(datasource, scope, null)
                .then(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    $rootScope.isLoaded = true;
                    console.log('getGroupClasses done');
                }, function(error) {
                    errorHandler(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        associateGroupClassesToLine: function(scope, inputMap) {
            $rootScope.isLoaded = false;
            const deferred = $q.defer();
            console.log('Calling: ', 'associateGroupClassesToLine');
            const datasource = {
                type: 'Dual',
                value: {
                    remoteNSPrefix: nsPrefix,
                    remoteClass: 'InsuranceQuoteProcessingService',
                    remoteMethod: 'associateGroupClassesToLine',
                    inputMap: inputMap,
                    apexRemoteResultVar: 'result.records',
                    methodType: 'GET',
                    apexRestResultVar: 'result.records'
                }
            };
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('associateGroupClassesToLine datasource', datasource);
            dataSourceService.getData(datasource, scope, null)
                .then(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    refreshList();
                    console.log('associateGroupClassesToLine done');
                }, function(error) {
                    errorHandler(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        removeQliGroupClass: function(scope, inputMap) {
            $rootScope.isLoaded = false;
            const deferred = $q.defer();
            console.log('Calling: ', 'removeQliGroupClass');
            const datasource = {
                type: 'Dual',
                value: {
                    remoteNSPrefix: nsPrefix,
                    remoteClass: 'InsuranceQuoteProcessingService',
                    remoteMethod: 'removeQliGroupClass',
                    inputMap: inputMap,
                    apexRemoteResultVar: 'result.records',
                    methodType: 'GET',
                    apexRestResultVar: 'result.records'
                }
            };
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('removeQliGroupClass datasource', datasource);
            dataSourceService.getData(datasource, scope, null)
                .then(function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    refreshList();
                    console.log('removeQliGroupClass done');
                }, function(error) {
                    errorHandler(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    };
}]);

},{}],5:[function(require,module,exports){
angular.module("insLargeGroupQuotePlans").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("modals/ins-plan-modal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{vlocSlideCustomClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{vlocSlideCustomClass}}-container">\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">{{ ::$root.customLabels.Close }}</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n            <div class="slds-grid slds-grid_vertical-align-center slds-grid_align-end slds-border_top slds-p-top_medium slds-m-top_small">\n                <button class="slds-button slds-button_neutral" ng-click="$slideHide(); importedScope.associateGroupClassesToLine()">{{ ::$root.customLabels.Select }}</button>\n            </div>\n        </header>\n        <div class="slds-modal__content slds-p-around_medium vloc-modal-content slds-is-relative">\n            <vloc-layout layout-name="{{layout}}" class="{{layout}}" is-loaded="isLayoutLoaded" records="records" ctrl="{{ctrl}}"></vloc-layout>\n        </div> \n    </div>\n</div>\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -100%;\n        margin-bottom: 45px;\n        height: auto;\n        transition: top 250ms ease-in;\n        max-height: 700px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__header {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__footer {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: auto;\n        width: 90%;\n        min-width: 90%;\n        max-width: 90%;\n        padding: 0;\n        margin: 0;\n        position: absolute;\n        top: 17rem;\n        left: 50%;\n        transform: translateY(-50%) translateX(-50%);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 22rem;\n        max-height: 0;\n        border-radius: 0;\n        width: 100%;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); /* leaving room for iPhone notification bar */\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; /* Android doesn\'t need the 20px of room like iPhone */\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>\n')}]);

},{}]},{},[1]);
})();

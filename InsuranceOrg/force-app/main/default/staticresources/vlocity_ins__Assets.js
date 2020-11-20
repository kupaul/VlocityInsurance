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
/*
 * Assets app using Card Framework and CPQ Hybrid
 */
angular.module('assets', ['vlocity', 'CardFramework' , 'sldsangular', 'ngSanitize', 'forceng', 'tmh.dynamicLocale', 'cfp.hotkeys', 'hybridCPQ','LZString'])

.run(['$rootScope', 'dataService', 'configService', '$window','userProfileService','tmhDynamicLocale',
         function($rootScope, dataService, configService, $window, userProfileService, tmhDynamicLocale) {
        'use strict';

        $rootScope.nsPrefix = fileNsPrefix();
}]);

require('./modules/hybridCPQ/controller/assets/AssetsController.js');
require('./modules/hybridCPQ/controller/assets/AssetsInfoPanelController.js');
require('./modules/hybridCPQ/controller/assets/AssetsMainController.js');
require('./modules/hybridCPQ/controller/assets/AssetsProductItemController.js');
require('./modules/hybridCPQ/factory/assets/AssetsService.js');

},{"./modules/hybridCPQ/controller/assets/AssetsController.js":2,"./modules/hybridCPQ/controller/assets/AssetsInfoPanelController.js":3,"./modules/hybridCPQ/controller/assets/AssetsMainController.js":4,"./modules/hybridCPQ/controller/assets/AssetsProductItemController.js":5,"./modules/hybridCPQ/factory/assets/AssetsService.js":6}],2:[function(require,module,exports){
angular.module('assets')
.controller('AssetsController', ['$scope', '$rootScope', '$log', 'pageService', 'dataService', 'CPQResponsiveHelper', 'CPQSettingsService', 'AssetsService',
    function($scope, $rootScope, $log, pageService, dataService, CPQResponsiveHelper, CPQSettingsService, AssetsService) {

    var customSettingFields = ['CpqConfigurationSetup__c', 'VlocityFeature__c'];
    $scope.params = pageService.params;
    $scope.isMobileTablet = CPQResponsiveHelper.mobileTabletDevice;

    $rootScope.cartId = $scope.params.id;

    //Config panel is hidden on page load
    $scope.isConfigAttrsPanelEnabled = false;

    $scope.init = function() {
        $log.debug('Initializing the AssetsController');
        if (typeof Visualforce !== 'undefined') {
            $rootScope.forcetkClient = new forcetk.Client();
            $rootScope.forcetkClient.setSessionToken(sessionId);
        }
        AssetsService.modifyCartAndMoveButtons(false, false);
    };

    // Event listener to enable the info panel
    $scope.$on('vlocity.assets.infopanel.enabled', function(event, isInfoPanelEnabled, itemObject, refreshMode) {
        // If the info panel is open and refreshMode is true, don't close the info panel. It avoids the FOUC.
        if (!(refreshMode && $scope.isConfigAttrsPanelEnabled)) {
            $scope.isConfigAttrsPanelEnabled = isInfoPanelEnabled;
        }
    });

    angular.forEach(customSettingFields, function(field) {
       dataService.getCustomSettings($rootScope.nsPrefix + field).then(
           function(data) {
               var settings = {};

               angular.forEach(data, function(customSetting) {
                   settings[customSetting.Name] = customSetting[$rootScope.nsPrefix + 'SetupValue__c'];
               });

               CPQSettingsService.setCustomSettings(settings);
               $log.debug('Retrieved custom setting ', settings);
           },
           function(error) {
               $log.error('Retrieving custom setting failed: ', error);
           }
       );
   });

}]);

},{}],3:[function(require,module,exports){
angular.module('assets')
.controller('AssetsInfoPanelController', ['$scope', '$rootScope', 'pageService', 'AssetsService', 'CPQService',
    function($scope, $rootScope, pageService, AssetsService, CPQService) {

    $scope.attributesObj = null;
    $scope.configItemObject = null; // Under $scope because Telus PS team needs to access it from template
    var itemObject;

    /*********** CPQ CART ITEM CONFIG EVENTS ************/
    $scope.$on('vlocity.assets.infopanel.enabled', function(event, isInfoPanelEnabled, data) {
        var  itemKeys, lookupItem, infoItem, lookupDisplayValueItemKey, cartId, lineItemId;

        if (isInfoPanelEnabled && data) {
            itemObject = data;
            $scope.configItemObject = angular.copy(itemObject);
            $scope.attributesObj = itemObject.attributeCategories && itemObject.attributeCategories.records || [];

            itemKeys = AssetsService.getItemFieldsList(itemObject);
            $scope.lookupItemList = [];
            $scope.infoItemList = [];
            cartId = pageService.params.id;
            lineItemId = itemObject.Id.value;
            angular.forEach(itemKeys, function(key) {
                if (!itemObject[key].hidden && itemObject[key].label) {
                    if (itemObject[key].dataType === 'REFERENCE') {
                        lookupItem = angular.copy(itemObject[key]);
                        lookupDisplayValueItemKey = key.slice(0, -1) + 'r';
                        // if lookup field has null value in the __c object, then it would not have the __r object
                        if (itemObject[lookupDisplayValueItemKey]) {
                            lookupItem.displayValue = itemObject[lookupDisplayValueItemKey].Name;
                        } else {
                            lookupItem.displayValue = '';
                            $scope.configItemObject[lookupDisplayValueItemKey] = {'Id': null, 'Name': null};
                        }
                        lookupItem.cartId = cartId;
                        lookupItem.lineItemId = lineItemId;
                        $scope.lookupItemList.push(lookupItem);
                    } else {
                        infoItem = angular.copy(itemObject[key]);
                        $scope.infoItemList.push(infoItem);
                    }
                }
            });
        }
    });
    /*********** END CPQ CART ITEM CONFIG EVENTS ************/

    /* Custom Labels */
    $scope.customLabels = {};
    var toastCustomLabels = {};
    var labelsArray = ['CPQClose', 'CPQCartConfigNoAttrsText','CPQCartConfigAdditionalSetting'];
    CPQService.setLabels(labelsArray, $scope.customLabels);
    /* End Custom Labels */

    /**
     * close: Closes attributes infopanel panel for line item
     * @param  {object} itemObject
     */
    $scope.close = function() {
        // Publishes event to enable the info panel
        $rootScope.$broadcast('vlocity.assets.infopanel.enabled', false);
    };

}]);

},{}],4:[function(require,module,exports){
angular.module('assets')
.controller('AssetsMainController', ['$scope', '$rootScope', '$log', '$sldsToast', 'AssetsService', 'CPQService', 'CPQSettingsService', 'CPQCustomViewsService',
 function($scope, $rootScope, $log, $sldsToast, AssetsService, CPQService, CPQSettingsService, CPQCustomViewsService) {

    $scope.viewOpen = false;
    $scope.tabSelected = 'Assets';
    $scope.appliedPromotionsTypeSelected = 'All';
    $scope.appliedPromotionsCommitmentDateSelected = {};
    $scope.effectiveAssetsDateSelected = {'value': new Date()};
    $scope.enableAssetButtons = AssetsService.getCartAndMoveButtons();
    $scope.currentCustomView = 0;

    /*********** EVENTS ************/

    var unbindEvents = [];
    var customSettings;
    customSettings = CPQSettingsService.getCustomSettings();
    $rootScope.enableLoyaltyPoints = customSettings.EnableLoyaltyPoints ? customSettings.EnableLoyaltyPoints : false;

    unbindEvents[unbindEvents.length] =
        $scope.$on('vlocity.assets.reload', function(event, data) {
            var params = {};
            var localTimeDate = new Date(data.getTime() - (data.getTimezoneOffset() * 60000));
            params.effectiveAssetsDateFilter = localTimeDate;
            params.lastRecordId = '';
            // This would handle all layouts with datasource, which is perfect in the case of the Assets component,
            // because it has 3 layouts with datasources embedded.
            if ($scope.uniqueName && $scope.data.dataSource && $scope.data.dataSource.type) {
                $scope.updateDatasource(params);
            }
        });
    /********* END EVENTS **********/

    $scope.$on('$destroy', function() {
        $log.debug('Assets Main Controller - Removes all listeners');
        //Removes all listeners
        unbindEvents.forEach(function (fn) {
            fn();
        });
    });

    /* Custom Labels */
    $scope.customLabels = {};
    var labelsArray = ['CPQPromotions', 'CPQAssets', 'CPQCartIsEmpty', 'CPQNoResultsFound', 'CPQLoadMore', 'ASSETChangeToQuote', 'ASSETChangeToOrder', 'ASSETMove', 'AllPromotions','ActivePromotions','ExpiredPromotions','CanceledPromotions','ASSETNoAssets','CPQAdvancedPricing','CPQBasic','CPQAdvancedPricingLoyalty'];
    CPQService.setLabels(labelsArray, $scope.customLabels);
    var toastCustomLabels = {};
    var toastLabelsArray =  ['ASSETChangeError','ASSETNoItemSelected','ASSETMoreThanOneItemSelected'];
    // Custom labels for toast messages
    CPQService.setLabels(toastLabelsArray, toastCustomLabels);
    /* End Custom Labels */

    $scope.dropDownLabel = {'value': $scope.customLabels['AllPromotions']};

    $scope.getCustomViewStateData = function(cards, currentViewIndex) {
        if (cards && cards[0].states) {
            // Assign CPQCustomViewsService into $rootScope variable
            $rootScope.customViews = new CPQCustomViewsService($scope, cards, currentViewIndex, true);
        } else {
            $log.debug('There is no data for CustomView');
        }
    };

    $scope.getCardsCallback = function(initialView) {
        $scope.getCustomViewStateData($scope.cards, initialView);
    };

    $scope.changeCustomView = function(index, tabChanged) {
        var clearSelectedAssets = function() {
            AssetsService.clearAssetsSelected();
            AssetsService.modifyCartAndMoveButtons(false, false);
        };
        // Contains the picklist switcher for the custom views
        $rootScope.customViews.currentCustomView = index;
        $rootScope.customViews.showExpandedActions();

        if (tabChanged) { 
            clearSelectedAssets();
        }
    };

    $scope.nextPageAssets = function() {
        if ($scope.$parent.session.nextAssets) {
            nextPage($scope.$parent.session.nextAssets);
        }
    };

    $scope.nextPageProducts = function() {
        if ($scope.$parent.session.nextProducts) {
            nextPage($scope.$parent.session.nextProducts);
        }
    };

    var nextPage = function(nextItems) {
        if (nextItems) {
            $log.debug('nextItems', nextItems);

            var params = {};
            var nextItemsObj = JSON.parse(nextItems);
            params.lastRecordId = nextItemsObj.remote.params.lastRecordId;

            if (params.lastRecordId) {
                $scope.$parent.updateDatasource(params, true).then(
                    function(data) {
                        //this means there was an error with the last operation
                        if (!data[data.length - 1]) {
                            $scope.nextPage(params.lastRecordId); //try again with last record id
                        }
                    }, function(error) {
                        $log.debug('pagination next page error ',error);
                    }
                );
            }
        } else {
            $log.debug('no nextItems action - last page? ');
        }
    };

    $scope.changeAppliedPromotionsType = function(type) {
        var params = {};
        var labelName = type + 'Promotions';
        $scope.dropDownLabel = {'value': $scope.customLabels[labelName]};
        $log.debug('changeAppliedPromotionsType: type selected is: ' + type);
        params.appliedPromoStatusFilter = type;
        $scope.appliedPromotionsTypeSelected = type;
        delete $scope.appliedPromotionsCommitmentDateSelected.value;

        if ($scope.$parent.data.dataSource) {
            delete $scope.$parent.data.dataSource.value.inputMap.commitmentDateFilter;
            $scope.$parent.updateDatasource(params);
        }
    };

    $scope.changeAppliedPromotionsCommitmentDate = function() {
        var params = {};
        $log.debug('changeAppliedPromotionsCommitmentDate: date selected is: ' + $scope.appliedPromotionsCommitmentDateSelected.value);
        params.appliedPromoStatusFilter = 'Active';
        params.commitmentDateFilter = $scope.appliedPromotionsCommitmentDateSelected.value;

        if ($scope.$parent.data.dataSource) {
            $scope.$parent.updateDatasource(params);
        }
    };

    $scope.changeEffectiveAssetsDate = function() {
        $log.debug('changeEffectiveAssetsDate: date selected is: ' + $scope.effectiveAssetsDateSelected.value);
        $rootScope.$broadcast('vlocity.assets.reload', $scope.effectiveAssetsDateSelected.value);
        AssetsService.clearAssetsSelected();
        AssetsService.modifyCartAndMoveButtons(false, false);
    };

    $scope.getEffectiveDate = function() {
        var dateTimeFiltter = $scope.effectiveAssetsDateSelected.value;
        return new Date(dateTimeFiltter.getTime() - (dateTimeFiltter.getTimezoneOffset() * 60000)).toISOString().slice(0,-1);
    };

    $scope.sortBySequenceValue = $rootScope.nsPrefix + 'Sequence__c.value';

    $scope.assetChangeToQuote = function(accountId, assetIncludeType) {
        AssetsService.assetChangeToQuote(accountId, assetIncludeType, $scope.customLabels['ASSETChangeToQuote'],
            toastCustomLabels['ASSETChangeError'], toastCustomLabels['ASSETNoItemSelected']);
    };

    $scope.assetChangeToOrder = function() {
        AssetsService.assetChangeToOrder($scope.customLabels['ASSETChangeToOrder'],
            toastCustomLabels['ASSETChangeError'], toastCustomLabels['ASSETNoItemSelected']);
    };

    $scope.assetMove = function() {
        AssetsService.assetMove($scope.customLabels['ASSETMove'],
            toastCustomLabels['ASSETChangeError'], toastCustomLabels['ASSETNoItemSelected'], toastCustomLabels['ASSETMoreThanOneItemSelected']);
    };

}]);

},{}],5:[function(require,module,exports){
angular.module('assets')
.controller('AssetsProductItemController', ['$scope', '$rootScope', '$log', '$timeout', 'AssetsService', 'CPQService', 'CPQAdjustmentService', 'CPQLevelBasedApproachService', 'CPQResponsiveHelper', 'CPQSettingsService', 'CPQUtilityService',
    function($scope, $rootScope, $log, $timeout, AssetsService, CPQService, CPQAdjustmentService, CPQLevelBasedApproachService, CPQResponsiveHelper, CPQSettingsService, CPQUtilityService) {
        var sellingPeriodMsg, dateField, givenDate;

        var customSettings = CPQSettingsService.getCustomSettings();
        $scope.isMobileTablet = CPQResponsiveHelper.mobileTabletDevice;
        /* Custom Labels */
        $scope.customLabels = {};
        var toastCustomLabels = {};
        var toastLabelsArray =  ['CPQSellingPeriodPastMsg','CPQSellingPeriodFutureMsg','CPQSellingPeriodEndOfLifeMsg'];
        // Custom labels for toast messages
        CPQService.setLabels(toastLabelsArray, toastCustomLabels);
        /* End Custom Labels */
        // isSelected set to true when user opens a config attributes for edit:
        $scope.isSelected = false;

        $scope.clickOnAssetCheckbox = function(object) {
            AssetsService.recordAssetSelectedForModification(object);
            if (AssetsService.getNumberOfAssetsSelected() === 0) {
                AssetsService.modifyCartAndMoveButtons(false, false);
            } else if (AssetsService.getNumberOfAssetsSelected() === 1) {
                AssetsService.modifyCartAndMoveButtons(true, true);
            } else if (AssetsService.getNumberOfAssetsSelected() > 1) {
                AssetsService.modifyCartAndMoveButtons(true, false);
            }
        };

        $scope.openAdjustmentModal = function(field, type) {
            var modalScope = $scope.$new();
            var parentObj =  $scope.$parent.obj;

            CPQAdjustmentService.openDetailsModal(modalScope, parentObj, field, type, true);
        };

        // Enter full screen if child level reaches 5
        $scope.fullScreen = function(level, show) {
            if (show && level > 4 && $scope.attrs.showProductList) {
                $rootScope.$broadcast('cpq-hide-product-list');
            }
        };

        $scope.generateSellingPeriodMsg  = function(obj,sellingPeriod) {

            return CPQUtilityService.generateSellingPeriodMsg(obj,sellingPeriod);
        }
        /* Siblings of non root item use the same intance of cartItemController
         * Exposing selected item id to the scope for comparision in templates
         * isSelectedItemObjId is used in border highlighting logic of the selected item */
        $scope.isSelectedItemObjId = '';

        //is expand mode enabled?
        $scope.expandMode = (customSettings['Product Configuration Mode'] ? (customSettings['Product Configuration Mode'].toLowerCase() === 'expand') : false);

        /*********** CPQ CART ITEM EVENTS ************/
        var unbindEvents = [];

        //Modal events for cross rules update.
        //Accepts dynamic function arguments
        unbindEvents[unbindEvents.length] = $scope.$on('vlocity.cpq.cartitem.actions', function(event, actionType, obj) {
            crossAction (event, actionType, obj);
        });

        // When the info panel is closed, set the isSelected variable to false
        // Removes selected border for line item
        unbindEvents[unbindEvents.length] = $scope.$on('vlocity.assets.infopanel.enabled', function(event, isInfoPanelEnabled) {
            if (!isInfoPanelEnabled) {
                $scope.isSelected = false;
                $scope.isSelectedItemObjId = '';
            }
        });

        $scope.$on('$destroy', function() {
            if ($scope.isSelected) {
                //Publish an event to close the info panel
                $rootScope.$broadcast('vlocity.assets.infopanel.enabled', false);
            }

            //Removes all listeners
            unbindEvents.forEach(function (fn) {
                fn();
            });
        });

        /*********** END CPQ CART ITEM EVENTS ************/

        function setupViewModel(records) {
            $log.debug('PROCESS RECORDS BEFORE: ', records);
            if (!records) {
                return;
            }
            $scope.viewModelRecords = [];

            if (records.lineItems && records.lineItems.records) {
                angular.forEach(records.lineItems.records, function(value) {
                    $scope.viewModelRecords.push(value);
                });
            }

            if (records.childAssets && records.childAssets.records) {
                angular.forEach(records.childAssets.records, function(childProd) {
                    $scope.viewModelRecords.push(childProd);
                });
            }

            if (records.productGroups && records.productGroups.records) {
                angular.forEach(records.productGroups.records, function(value) {
                    $scope.viewModelRecords.push(value);
                });
            }
            $log.debug('PROCESS RECORDS AFTER: ', $scope.viewModelRecords);
        }

        if (!angular.isArray($scope.records)) {
            setupViewModel($scope.records);
        }

        /**
         * config: Launches attributes configuration for line item in cart
         * @param  {object} itemObject
        */
        $scope.config = function(parent, itemObject) {
            var refreshMode = true;
            // Refresh opened vdf in info panel if any, to avoid FOUC. Dont refresh the entire info panel
            $rootScope.$broadcast('vlocity.assets.infopanel.enabled', false, null, refreshMode);

            // Run after the current call stack is executed
            $timeout(function() {
                $scope.isSelected = true;
                $scope.isSelectedItemObjId = itemObject.Id;
                // Publishes Event to enable the info panel
                $rootScope.$broadcast('vlocity.assets.infopanel.enabled', true, itemObject);
            }, 0);
        };

        function crossAction (event, type, data) {
            // var toBeAddedLineItem, parentInCardData, grandParentInCardData, productGroupParentInCardData, productGroupParentFromAPI, sessionStorageLayoutLoaded;

            //WIP cross actions feature
            switch (type) {
                case 'viewmodel':
                    // Update view model after preview modal is closed
                    if ($scope.$parent.obj && (data.item.Id.value === $scope.$parent.obj.Id.value) && (data.item.Id.scopeId === $scope.$parent.obj.Id.scopeId)) {
                        setupViewModel(data.item);
                    }
                    // Publish an event to update data if configpanel enabled for this item
                    if ($scope.isSelected) {
                        $rootScope.$broadcast('vlocity.assets.infopanel.enabled', true, data.item);
                    }
                    break;
            }
        }

        // Level Based Approach
        $scope.determineChildProdOpenOrCloseInitially = function(childProd) {
            // if custom setting dictates node to open initially (if possible)
            if ($scope.expandMode) {
                return CPQLevelBasedApproachService.determineChildProdOpenOrCloseInitially(childProd);
            // if custom setting dictates node to close initially
            } else {
                // Display close icon
                return false;
            }
        };

        $scope.determineChildProdOpenOrCloseAfterClick = function(childProd, childProdState) {
            return CPQLevelBasedApproachService.determineChildProdOpenOrCloseAfterClick(childProd, childProdState, null, $scope.$id);
        };

        $scope.determineIfChildProdOpenOrCloseIconShouldBeHidden = function(childProd) {
            return CPQLevelBasedApproachService.determineIfChildProdOpenOrCloseIconShouldBeHidden(childProd);
        };

        $scope.checkIfChildProdHasChildren = function(childProd) {
            return CPQLevelBasedApproachService.checkIfChildProdHasChildren(childProd);
        };
        // End Level Based Approach

        $scope.isLineItemInProductGroups = function(item) {
            // handle a case when LevelBasedApproach = true
            if (item.itemType === 'productGroup' && item.actions && item.actions.expanditems) {
                return true;
            }
            return (item.itemType === 'productGroup') ? AssetsService.findLineItemInProductGroups(item) : true;
        }

        $scope.getProductInformation  = function(obj) {
            return CPQService.getProductInformation(obj);
        };

    }
]);

},{}],6:[function(require,module,exports){
angular.module('hybridCPQ')
.factory('AssetsService', ['$log', '$rootScope', '$sldsToast', 'CPQService', function($log, $rootScope, $sldsToast, CPQService) {

    var launchUrl = function(launchUrl, title) {
        if (typeof sforce !== 'undefined') {
            if (sforce.console && sforce.console.isInConsole()) {
                sforce.console.openPrimaryTab(null, launchUrl, true, title,null, title);
            } else {
                if(typeof sforce.one === 'object') {
                    sforce.one.navigateToURL(launchUrl, false);
                } else {
                    window.parent.location.href = launchUrl;
                }
            }
        } else {
            // I found out that sforce is always defined in all my testing, but to be defensive, we will also handle it for some reason not being there
            window.parent.location.href = launchUrl;
        }
    };

    return {

        selectedAssetIdsForModification : [],
        enableAssetButtons : {
            changeToCartButton : false,
            moveButton : false
        },

        recordAssetSelectedForModification : function(item) {
            if (!_.includes(this.selectedAssetIdsForModification, item.Id.value)) {
                this.selectedAssetIdsForModification.push(item.Id.value);
            } else {
                _.pull(this.selectedAssetIdsForModification, item.Id.value);
            }
        },

        getNumberOfAssetsSelected : function() {
            return this.selectedAssetIdsForModification.length;
        },

        getAssetIdsSelected : function() {
            var i;
            var selectedAssetIds = '';
            for (i = 0; i < this.selectedAssetIdsForModification.length; i++) {
                selectedAssetIds += this.selectedAssetIdsForModification[i];
                if (i < this.selectedAssetIdsForModification.length - 1) {
                    selectedAssetIds += '+';
                }
            }
            return selectedAssetIds;
        },

        getItemFieldsList : function(itemObject) {
            var itemKeys, fieldsList;

            fieldsList = $rootScope.customViews.cpqCustomViews[$rootScope.customViews.currentCustomView].fields;
            fieldsList = fieldsList.map(function(field) { return field.fieldName; });
            itemKeys = _.keys(itemObject);
            // Exclude all CustomView fields
            _.pullAll(itemKeys, fieldsList);

            return itemKeys;
        },
        //HYB-1961 Clearing the preselected values once tab changes
        clearAssetsSelected : function(){
            this.selectedAssetIdsForModification.length = 0; 
        },

        assetChangeToQuote : function(accountId, assetIncludeType, title, errorTitle, errorMsg) {
            var assetIdsSelected = this.getAssetIdsSelected();
            var assetTypeSelected, changeToQuoteOSTargetUrl;
            if (assetIncludeType === 'noContractAssets') {
                assetTypeSelected = ':all:';
            } else if (assetIncludeType === 'allAssets') {
                assetTypeSelected = ':all:';
            } else if (assetIncludeType === 'billedAssets') {
                assetTypeSelected = ':billing:';
            } else if (assetIncludeType === 'serviceAssets') {
                assetTypeSelected = ':service:';
            }
            changeToQuoteOSTargetUrl = '/apex/' + $rootScope.nsPrefix + 'OmniScriptUniversalPage?id=' + accountId + assetTypeSelected + assetIdsSelected +
                    '#/OmniScriptType/MACD/OmniScriptSubType/ChangeToQuote/OmniScriptLang/English/ContextId/' + accountId + assetTypeSelected + assetIdsSelected +
                    '/PrefillDataRaptorBundle//true';
            if (this.selectedAssetIdsForModification.length === 0) {
                $sldsToast({
                    title: errorTitle,
                    content: errorMsg,
                    severity: 'error',
                    icon: 'warning',
                    autohide: true,
                    show: CPQService.toastEnabled('error')
                });
            } else {
                launchUrl(changeToQuoteOSTargetUrl,title);
            }
        },

        assetChangeToOrder : function(title, errorTitle, errorMsg) {
            var assetIdsSelected = this.getAssetIdsSelected();
            var changeToOrderOSTargetUrl = '/apex/' + $rootScope.nsPrefix + 'MACDFdo?id=' + assetIdsSelected +
                    '#/OmniScriptType/MACD/OmniScriptSubType/FDO/OmniScriptLang/English/ContextId/' + assetIdsSelected +
                    '/PrefillDataRaptorBundle//true';
            if (this.selectedAssetIdsForModification.length === 0) {
                $sldsToast({
                    title: errorTitle,
                    content: errorMsg,
                    severity: 'error',
                    icon: 'warning',
                    autohide: true,
                    show: CPQService.toastEnabled('error')
                });
            } else {
                launchUrl(changeToOrderOSTargetUrl,title);
             }
        },

        assetMove : function(title, errorTitle, errorMsgNoItemSelected, errorMsgMoreThanOneItemSelected) {
            var assetIdsSelected = this.getAssetIdsSelected();
            var moveOSTargetUrl = '/apex/' + $rootScope.nsPrefix + 'MoveInAccount?id=' + assetIdsSelected;
            if (this.selectedAssetIdsForModification.length === 0) {
                $sldsToast({
                    title: errorTitle,
                    content: errorMsgNoItemSelected,
                    severity: 'error',
                    icon: 'warning',
                    autohide: true,
                    show: CPQService.toastEnabled('error')
                });
            } else if (this.selectedAssetIdsForModification.length > 1) {
                $sldsToast({
                    title: errorTitle,
                    content: errorMsgMoreThanOneItemSelected,
                    severity: 'error',
                    icon: 'warning',
                    autohide: true,
                    show: CPQService.toastEnabled('error')
                });
            } else {
                launchUrl(moveOSTargetUrl,title);
            }
        },

        modifyCartAndMoveButtons : function(cartButton, moveButton) {
            this.enableAssetButtons.changeToCartButton = cartButton;
            this.enableAssetButtons.moveButton = moveButton;
        },

        getCartAndMoveButtons : function() {
            return this.enableAssetButtons;
        },

        findLineItemInProductGroups: function(record) {
            return CPQService.findLineItemInProductGroups(record);
        }
    };
}]);

},{}]},{},[1]);
})();

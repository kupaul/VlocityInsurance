/*************************************************************************
 *
 * VLOCITY, INC. CONFIDENTIAL
 * __________________
 *
 *  [2014] - [2017] Vlocity, Inc.
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Vlocity, Inc. and its suppliers,
 * if any. The intellectual and technical concepts contained
 * herein are proprietary to Vlocity, Inc. and its suppliers and may be
 * covered by U.S. and Foreign Patents, patents in process, and are
 * protected by trade secret or copyright law. Dissemination of this
 * information and reproduction, modification or reverse-engineering
 * of this material, is prohibited unless prior written permission
 * is obtained from Vlocity, Inc.
 *
 * Build: v101.0.0
 */
(function(){  var fileNsPrefix = (function() {
    'use strict';
    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length - 1];
    var scriptName = lastScript.src;
    var parts = scriptName.split('/');
    var thisScript = parts[parts.length - 1];
    if (thisScript === "") {
      thisScript = parts[parts.length - 2];
    }

    // Fix to handle cases where js files are inside zip files
    // https://dev-card.na31.visual.force.com/resource/1509484368000/dev_card__cardframework_core_assets/latest/cardframework.js
    if(scriptName.indexOf('__') != -1 && thisScript.indexOf('__') == -1) {
        thisScript = parts[5] && parts[5].indexOf('__') != -1 ? parts[5] : thisScript;
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
  };
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * CPQ Hybrid app using Card Framework
 */
angular.module('hybridCPQ', ['vlocity', 'CardFramework' , 'sldsangular', 'ngSanitize', 'forceng', 'tmh.dynamicLocale', 'cfp.hotkeys', 'VlocityDynamicForm'])
    //Check if inside org here
    .config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});

    }]).config(function($locationProvider) {
        'use strict';
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });
    }).config(['$rootScopeProvider', function ($rootScopeProvider) {
        'use strict';
        //TODO: remove this once we've figured out the cause for the
        //repeated digest cycles.
        $rootScopeProvider.digestTtl(50);
    }]).config(['$logProvider', function($logProvider) {
        'use strict';
        var isDebugMode = false;

        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        if (getUrlParameter('debugMode') === 'true') {
            isDebugMode = true;
        }

        $logProvider.debugEnabled(isDebugMode);
    }]).config(['$localizableProvider', function($localizableProvider) {
        'use strict';
        $localizableProvider.setLocalizedMap(window.i18n);
        $localizableProvider.setDebugMode(window.ns === '');

    }]).config(function($provide) {
        $provide.decorator('$controller', function($delegate) {
            return function(constructor, locals, later, indent) {
                if (typeof constructor === 'string' && !locals.$scope.controllerName) {
                    locals.$scope.controllerName =  constructor;
                }
                return $delegate(constructor, locals, later, indent);
            };
        });
    }).run(['$rootScope', 'dataService', 'configService', '$window', '$log','userProfileService','tmhDynamicLocale',
         function($rootScope, dataService, configService, $window, $log, userProfileService, tmhDynamicLocale) {
        'use strict';
        configService.options.enableWindowListener = false;
        $rootScope.nsPrefix = fileNsPrefix();
        // Used in templates for slds assets
        $rootScope.staticResourceURL = vlocCPQ.staticResourceURL;
        $rootScope.enableCometD = true;

        // Fetch Custom Labels
        var labelNames = ['CPQReset','CPQApply','CPQClose','CPQSave','CPQAddToCart','CPQDeleteItem','CPQCancel','CPQCart','CPQDetails',
        'CPQLoadMore','CPQTotalIncomplete','CPQPromoCode','CPQApplyPromotion','CPQDeleteItemConfirmationMsg','CPQDeleteButtonLabel','CPQAddedItem', 'CPQClone',
        'CPQSettings', 'CPQDelete','CPQConfigure','CPQMore','CPQCellDetails','CPQInspect','CPQAmount','CPQPrecent', 'CPQCurrency','CPQLoyalty','CPQSelectView',
        'CPQAddingItem','CPQAddItem','CPQAddItemFailed','CPQClonedItem','CPQCloningItem','CPQCloneItemFailed','CPQDeletedItem','CPQDeletingItem',
        'CPQDeleteItemFailed','CPQUpdatedItem','CPQUpdatingItem','CPQUpdateItemFailed','CPQLineitemDetailsMsgNavigation','CPQLineitemDetailsTitle',
        'CPQCartItemLookupFieldTitle','CPQProductComparisionTitle','CPQCompareContentText','CPQProductItemTitle','CPQCartItemLookupText',
        'CPQLineitemDetailsTitle','CPQCartItemLookupProvideInfo','CPQCartItemLookupCreateNew','CPQCartMessages','CPQCartIsEmpty',
        'CPQCartTabTwoContent','CPQCartTabThreeContent','CPQCartConfigNoAttrsText','CPQCartConfigAdditionalSetting','CPQCartConfigLookupValues',
        'CPQProductConfig','CPQFiltersNotAvailable','CPQProductsNotAvailable','CPQPromotionsNotAvailable','CPQFilter','CPQSearch',
        'CPQCartPricing','CPQPromotions','CPQAssets','CPQNoResultsFound','AllPromotions','ActivePromotions','ExpiredPromotions','CanceledPromotions','CPQProducts','CPQCartCustomViews',
        'CPQChangePrice','CPQSelectPriceList','CPQPriceDetails', 'CPQShowActions','CPQCartItemLookupCreateNewInstance','CPQAutoRemovedItem','CPQAutoReplaceItem','CPQExpandItemFailed',
        'CPQQualified','CPQDisqualified','CPQCancelPromotion','CPQPromoCancelDate','CPQPromoCancelReason','CPQConfirmCancelPromotion','CPQKeepPromotion','CPQPenaltyButton',
        'CPQPenaltyApplicableMsg','CPQNoPenaltiesMsg','CPQCanceledItem','CPQAdjustmentTitleText','CPQAdjustmentValue','CPQAdjustmentCode','CPQAdjustmentPolicyText','CPQAdjustmentDuration','CPQAdjustmentPolicy',
        'CPQFetchingRules','CPQFetchRuleFailed','CPQFetchRuleCompleted','CPQPaymentChoice','CPQSwitchPaymentNotice',
        'ASSETChangeToQuote','ASSETChangeToOrder','ASSETMove','ASSETChangeError','ASSETNoItemSelected','ASSETMoreThanOneItemSelected',
        'CPQMustBeGreaterThanZero','CPQCanNotHaveLess','CPQCanNotHaveMoreThan','CPQMustBeGreaterThanOrEqualToZero','CPQQuantity','CPQAdjustmentPercentage','CPQAdjustmentAmount','CPQAdjustmentOverride',
        'CPQReasons','CPQViewReasons','CPQDiscountsToBeDeleted','CPQItemsToBeDeleted','CPQLineItemsToBeDeleted','CPQPromosToBeDeleted','CPQOr','CPQPriceList','CPQAdvancedPricing','CPQBasic','CPQAdvancedPricingLoyalty',
        'CPQCreateAssets','CPQCreateQuote','CPQCreateOrder'];

        // Listen to custom action event callback
        $window.addEventListener('message', function(event) {
            if (event.data.messageType === 'ATTR_CONFIG_CUSTOM_ACTION') {
                $rootScope.$broadcast('vlocity.cpq.config.custom.action', event.data);
            }
        }, false);

        userProfileService.userInfoPromise().then(function() {
            dataService.fetchCustomLabels(labelNames, $rootScope.vlocity.userLanguage);
        }, function(error) {
            $log.error('User info promise error', error);
        });

    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        return function(sldsURL) {
            // staticResourceURL.slds = /resource/1459186855000/<namespace>__slds
            // sldsURL = /assets/icons/standard-sprite/svg/symbols.svg#opportunity
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]);

require('./modules/hybridCPQ/directive/CPQHelper.js');
require('./modules/hybridCPQ/templates/templates.js');
require('./modules/hybridCPQ/constant/baseConstants.js');
require('./modules/hybridCPQ/factory/CPQService.js');
require('./modules/hybridCPQ/factory/CPQCardinalityService.js');
require('./modules/hybridCPQ/factory/CPQItemDetailsService.js');
require('./modules/hybridCPQ/factory/CPQCartItemConfigService.js');
require('./modules/hybridCPQ/factory/CPQCartItemCrossActionService.js');
require('./modules/hybridCPQ/factory/CPQProductPromoListService.js');
require('./modules/hybridCPQ/factory/CPQResponsiveHelper.js');
require('./modules/hybridCPQ/factory/CPQAdjustmentService.js');
require('./modules/hybridCPQ/factory/CPQLevelBasedApproachService.js');
require('./modules/hybridCPQ/factory/CPQDynamicMessagesService.js');
require('./modules/hybridCPQ/factory/CPQSettingsService.js');
require('./modules/hybridCPQ/factory/CPQStreamingChannelService.js');
require('./modules/hybridCPQ/factory/CPQOverrideService.js');
require('./modules/hybridCPQ/services/CPQCustomViewsService.js');
require('./modules/hybridCPQ/services/CPQUtilityService.js');
require('./modules/hybridCPQ/controller/CPQController.js');
require('./modules/hybridCPQ/controller/CPQTotalController.js');
require('./modules/hybridCPQ/controller/CPQCartController.js');
require('./modules/hybridCPQ/controller/CPQCartItemController.js');
require('./modules/hybridCPQ/controller/CPQCartItemConfigController.js');
require('./modules/hybridCPQ/controller/CPQCartItemCellController.js');
require('./modules/hybridCPQ/controller/CPQItemsController.js');
require('./modules/hybridCPQ/controller/CPQProductItemController.js');
require('./modules/hybridCPQ/controller/CPQPromotionsController.js');
require('./modules/hybridCPQ/controller/CPQPromotionItemController.js');
require('./modules/hybridCPQ/controller/CPQPricelistsController.js');
require('./modules/hybridCPQ/controller/CPQProductItemDetailsController.js');
require('./modules/hybridCPQ/controller/CPQCartItemDetailsController.js');


},{"./modules/hybridCPQ/constant/baseConstants.js":2,"./modules/hybridCPQ/controller/CPQCartController.js":3,"./modules/hybridCPQ/controller/CPQCartItemCellController.js":4,"./modules/hybridCPQ/controller/CPQCartItemConfigController.js":5,"./modules/hybridCPQ/controller/CPQCartItemController.js":6,"./modules/hybridCPQ/controller/CPQCartItemDetailsController.js":7,"./modules/hybridCPQ/controller/CPQController.js":8,"./modules/hybridCPQ/controller/CPQItemsController.js":9,"./modules/hybridCPQ/controller/CPQPricelistsController.js":10,"./modules/hybridCPQ/controller/CPQProductItemController.js":11,"./modules/hybridCPQ/controller/CPQProductItemDetailsController.js":12,"./modules/hybridCPQ/controller/CPQPromotionItemController.js":13,"./modules/hybridCPQ/controller/CPQPromotionsController.js":14,"./modules/hybridCPQ/controller/CPQTotalController.js":15,"./modules/hybridCPQ/directive/CPQHelper.js":16,"./modules/hybridCPQ/factory/CPQAdjustmentService.js":17,"./modules/hybridCPQ/factory/CPQCardinalityService.js":18,"./modules/hybridCPQ/factory/CPQCartItemConfigService.js":19,"./modules/hybridCPQ/factory/CPQCartItemCrossActionService.js":20,"./modules/hybridCPQ/factory/CPQDynamicMessagesService.js":21,"./modules/hybridCPQ/factory/CPQItemDetailsService.js":22,"./modules/hybridCPQ/factory/CPQLevelBasedApproachService.js":23,"./modules/hybridCPQ/factory/CPQOverrideService.js":24,"./modules/hybridCPQ/factory/CPQProductPromoListService.js":25,"./modules/hybridCPQ/factory/CPQResponsiveHelper.js":26,"./modules/hybridCPQ/factory/CPQService.js":27,"./modules/hybridCPQ/factory/CPQSettingsService.js":28,"./modules/hybridCPQ/services/CPQCustomViewsService.js":29,"./modules/hybridCPQ/services/CPQUtilityService.js":30,"./modules/hybridCPQ/templates/templates.js":31}],2:[function(require,module,exports){
angular.module('hybridCPQ')
	.constant('CPQ_CONST', {
		'INFO': 'INFO',
		'ERROR':'ERROR', 
		'NO_RESULTS_FOUND': '101',
		'REQUIRED_ATTR_MISSING': '204',
		'BUNDLE_HAS_ERRORS': '220',
		'INVALID_QUANTITY': '142',
		'ADD_SUCCESSFUL': '150',
		'UPDATE_SUCCESSFUL': '151',
		'DELETE_SUCCESSFUL': '152',
		'CLONE_SUCCESSFUL': '153',
		'ATTRIBUTE_MODIFICATION_SUCCESSFUL':'161',
		'REMOTE':'remote',
		'REST':'rest'
	});
},{}],3:[function(require,module,exports){
angular.module('hybridCPQ')
.controller('CPQCartController', ['$scope', '$rootScope', '$log', '$timeout', '$interval','CPQService', 'CPQCustomViewsService', 'CPQSettingsService',
 function($scope, $rootScope, $log, $timeout, $interval, CPQService, CPQCustomViewsService, CPQSettingsService) {

    $scope.cartDataStore = CPQService.dataStore;
    $scope.featureSettings = CPQSettingsService.getFeatureSettings();
    $scope.viewOpen = false;
    $scope.tabSelected = 'Cart';

    /* Custom Labels */
    $scope.customLabels = {};
    var toastCustomLabels = {};
    var labelsArray = ['CPQCart','CPQDetails','CPQLoadMore','CPQPromotions','CPQCartPricing','CPQCartIsEmpty','CPQCancel','CPQCancelPromotion',
                        'CPQCartMessages','CPQCartCustomViews','CPQCartTabTwoContent','CPQCartTabThreeContent','CPQDelete',
                        'CPQNoResultsFound','AllPromotions','ActivePromotions','ExpiredPromotions','CanceledPromotions','CPQAdvancedPricing','CPQBasic','CPQAdvancedPricingLoyalty'];
    var toastLabelsArray =  ['CPQDeletingItem','CPQDeleteItem','CPQDeleteItemConfirmationMsg','CPQDeleteButtonLabel','CPQDeleteItemFailed',
            'CPQDeletedItem','CPQCanceledItem'];
    CPQService.setLabels(labelsArray, $scope.customLabels);
    // Custom labels for toast messages
    CPQService.setLabels(toastLabelsArray, toastCustomLabels);
    /* End Custom Labels */

    var getCustomViewStateData = function(cards, currentViewIndex) {
        if (cards && cards[0].states) {
            // Assign CPQCustomViewsService into $rootScope variable:
            $rootScope.customViews = new CPQCustomViewsService($scope, cards, currentViewIndex);
        } else {
            $log.debug('There is no data for CustomView');
        }
    };

    $scope.getCardsCallback = function(initialView) {
        getCustomViewStateData($scope.cards, initialView);
    };

    $scope.changeCustomView = function(index,cards) {
        if (cards) { getCustomViewStateData(cards); }

        // Contains the picklist switcher for the custom views
        $rootScope.customViews.currentCustomView = index;
        $rootScope.customViews.showExpandedActions();

        if (index !== 0) {
            $rootScope.$broadcast('cpq-non-cart-tab-selected', $scope.attrs.showProductList);
        } else {
            $rootScope.$broadcast('cpq-cart-tab-selected');
        }
    };

    $scope.reloadCart = function(previousTab) {
        // Only reload Cart if user clicks away to Cart or Pricing Tabs which require calling getCartsItems again
        // because user can delete applied promotions under Promotions tab, which would require a recalculate of prices
        // and update of items in Cart
        if (previousTab === 'Promotions') {
            $rootScope.$broadcast('vlocity.cpq.cart.reload');
        }
    };

    /*********** CPQ CART EVENTS ************/
    var scrollToItemTimeout;

    /**
     * cart 'reload' event. Resets the pagination
    */
    $scope.$on('vlocity.cpq.cart.reload', function() {
        var params = {};
        var messageObj = {'event': 'reload', 'message': null};
        params.lastRecordId = '';

        if (!$scope.$parent.uniqueName) {
            $log.debug('ERROR: vlocity.cpq.cart.reload layout broadcast failed as it can not find the layout uniqueName');
            return;
        }

        //Reset pagination
        $scope.$parent.updateDatasource(params, false, true);

        // Avoid using $rootscope. $scope.$parent will isolate the broadcast to only a layout
        // which has this controller attached.
        $scope.$parent.$broadcast($scope.$parent.uniqueName + '.events', messageObj);
    });

    /**
     * cart 'setloading' event. Sets the layouts isLoading flag to true, used for displaying spinner.
    */
    $scope.$on('vlocity.cpq.cart.setloading', function() {
        var loadMessage = {'event': 'setLoading', 'message': true};

        if (!$scope.$parent.uniqueName) {
            $log.debug('ERROR: vlocity.cpq.cart.setloading layout broadcast failed as it can not find the layout uniqueName');
            return;
        }

        $scope.$parent.$broadcast($scope.$parent.uniqueName + '.events', loadMessage);
    });

    /**
     * cart layout events. Wrapper for cart layout events. Passes the event argument to card framework layout events
    */
    $scope.$on('vlocity.cpq.cart.layout.events', function(messageObj) {
        if (!$scope.$parent.uniqueName) {
            $log.debug('ERROR: vlocity.cpq.cart.layout.events broadcast failed as it can not find the layout uniqueName');
            return;
        }

        // Avoid using $rootscope. $scope.$parent will isolate the broadcast to only a layout
        // which has this controller attached.
        $scope.$parent.$broadcast($scope.$parent.uniqueName + '.events', messageObj);
    });

    $scope.$parent.$on('vlocity.cpq.cart.resetpagination', function(event, messageObj) {
        var newIndex = messageObj.index - 1;
        if (newIndex > -1) {
            var newLastRecordId = $scope.$parent.records[messageObj.index - 1].Id.value;
            if ($scope.$parent.session.nextProducts) {
                //setting last record id for pagination
                $scope.$parent.session.nextProducts.remote.params.lastRecordId = newLastRecordId;
            }
        } else {
            //get next page if its the last visible record
            $scope.nextPage();
        }
        return;
    });

    $scope.$parent.$on('vlocity.cpq.cart.addrecords', function(event, records) {
        var pageSize = $scope.$parent.data.dataSource.value.inputMap.pagesize || 9999; //no page size defined
        var loadMessage, deleteItems;
        if (records && records.length > 0) {
            //add item to the top of the cartt
            loadMessage = {'event': 'prepend', 'message': records};
            $scope.$parent.$broadcast($scope.$parent.uniqueName + '.events', loadMessage);

            //Scroll to the added item
            if (angular.isObject(scrollToItemTimeout)) {
                $timeout.cancel(scrollToItemTimeout);
            }
            scrollToItemTimeout = $timeout(function() {
                scrollToItem(records[0].Id.value);
            }, 100);

            //TBD: remove the below code after cross action implementation
            //Auto delete feature
            if (records.actions && records.actions.itemdeleted) {
                deleteItems = records.actions.itemdeleted.client.params.items;
                angular.forEach(deleteItems, function(deleteItem) {
                    //Publish delete event
                    $timeout(function() {
                        //$scope.destroy has issues with broadcast in timeout.
                        //'$$nextSibling' of null error occurs
                        //@TODO: Fix the rootcause. (Probably in cardframework or angularjs)
                        try {
                            $scope.$parent.$broadcast('vlocity.cpq.cartitem.actions', 'delete', {'itemId': deleteItem.Id});
                        }catch (e) {
                            //fail silently
                        }
                    }, 0);
                });
            }
        }
    });

    //@TODO: Combine multiple listeners in cart controller
    $scope.$parent.$on('vlocity.cpq.cart.removerecords', function(event, obj) {
        var removeMessage;
        event.stopPropagation();
        event.preventDefault();
        if (obj) {
            removeMessage = {'event': 'removeCard', 'message': obj};

            //toggleMessage(obj.obj); //the actual object

            //Publish for cart vloc-layout
            $scope.$parent.$broadcast($scope.$parent.uniqueName + '.events', removeMessage);
        }
    });

    $scope.$watchCollection('cartDataStore.messages', function(newMessages, oldMessages) {
        var stopIntervalPromise;

        if (!angular.isDefined($scope.$parent.records)) {
            stopIntervalPromise = $interval(function() {
                applyMessages(newMessages, oldMessages, stopIntervalPromise);
            }, 300, 3);
        } else {
            applyMessages(newMessages, oldMessages, stopIntervalPromise);
        }
    });

    /*********** END CPQ CART EVENTS ************/

    var applyMessages = function(newMessages, oldMessages, stopIntervalPromise) {
        if (angular.isDefined($scope.$parent.records)) {
            // Cancel the periodic check if apply messages is done
            if (stopIntervalPromise) {
                $interval.cancel(stopIntervalPromise);
            }
            // Needs scope to access $parent.records
            CPQService.applyMessages($scope, newMessages, oldMessages);
        }
    };

    $scope.getCartSeverity = function() {
        $scope.hasSeverity = null;
        var severityLevel = {
            'INFO' : 1,
            'WARN' : 2,
            'ERROR' : 3
        };

        angular.forEach($scope.cartDataStore.messages, function(msg) {
            if ($scope.hasSeverity) {
                if (severityLevel[msg.severity] > severityLevel[$scope.hasSeverity]) {
                    $scope.hasSeverity =  msg.severity;
                }
            } else {
                $scope.hasSeverity = msg.severity;
            }
        });

        $log.debug('set cart severity ',$scope.hasSeverity);
    };

    function scrollToItem(itemId) {
        var scrollPosition;
        var $cartContainer = angular.element('.js-cpq-cart-scroll-container');
        var cartOffset = $cartContainer.offset();
        var itemOffset = angular.element('[data-cart-item-id="' + itemId + '"]').offset();
        if (itemOffset && cartOffset) {
            scrollPosition = itemOffset.top - cartOffset.top + $cartContainer.scrollTop();
            $cartContainer.animate({scrollTop: scrollPosition}, 'slow');
        }else {
            $log.debug('Failed to scroll to an added item');
        }
    }

    $scope.nextPage = function() {
        if ($scope.$parent.session.nextProducts) {
            var nextProducts = $scope.$parent.session.nextProducts;

            var params = {};
            var nextItemsObj = JSON.parse(nextProducts);
            params.lastRecordId = nextItemsObj.remote.params.lastRecordId;

            if (params.lastRecordId) {
                $scope.$parent.updateDatasource(params, true).then(
                    function(data) {
                        //this means there was an error with the last operation
                        if (!data[data.length - 1]) {
                            $scope.nextPage(params.lastRecordId); //try again with last record id
                        }
                    }, function(error) {
                        $log.debug('pagination next page error ', error);
                    }
                );
            }
        } else {
            $log.debug('no nextProducts action - last page? ');
        }
    };

    $scope.openDetailView = function(message) {
        if (message.actions.DETAILS) {
            var itemId = message.actions.DETAILS.remote.params.id;
            $scope.$parent.$broadcast('vlocity.cpq.cart.item.' + itemId + '.opendetail', message);
        } else {
            $log.debug('no details action present');
        }
    };

}]);

},{}],4:[function(require,module,exports){
angular.module('hybridCPQ')
.controller('CPQCartItemCellController', ['$scope', '$rootScope', '$log', 'CPQService', 'CPQAdjustmentService',
  function($scope, $rootScope, $log, CPQService, CPQAdjustmentService) {

    /* Custom Labels */
    $scope.customLabels = {};
    var labelsArray = ['CPQDelete','CPQAdjustmentTitleText','CPQAdjustmentValue','CPQAdjustmentCode','CPQAdjustmentPolicyText',
        'CPQAdjustmentDuration','CPQAdjustmentPolicy','CPQCurrency','CPQLoyalty','CPQSwitchPaymentNotice'];
    CPQService.setLabels(labelsArray, $scope.customLabels);
    /* End Custom Labels */

    var updateData = function(record, index, value) {
        // Delete adjustment record
        $scope.records.splice(index, 1);
        // Update price
        $scope.$parent.loaded.value = value;
    };

    $scope.deleteAppliedAdjustment = function(record, index, field) {
        record.deleting = true;

        if (record.actions && (record.actions.deleteAdjustment && field.actions.pricedetail)) {
            CPQAdjustmentService.delete($scope.parent, record.actions.deleteAdjustment).then(function() {
                CPQService.invokeAction(field.actions.pricedetail).then(function(data) {
                    record.deleting = false;
                    updateData(record, index, data.records[0][field.fieldName].value);
                });
            }, function(error) {
                $log.error('CPQCartItemCellController.deleteAppliedAdjustment response failed: ', error);
            });
        }

    };

    $scope.selectTab =  function(tab) {
        $scope.records.adjustment.value = '';
        $scope.records.adjustmentCodes.selected = {};
        return tab;
    };

    $scope.switchPaymentMode =  function(itemObject, paymentMode) {
        var itemObjectPaymentMode = itemObject[$rootScope.nsPrefix + 'CurrencyPaymentMode__c'];
        itemObjectPaymentMode.value = paymentMode;
    };

}]);

},{}],5:[function(require,module,exports){
angular.module('hybridCPQ')
  .controller('CPQCartItemConfigController', ['$scope', '$rootScope', '$log', '$timeout', '$sldsModal', '$sldsToast', 'CPQ_CONST', 'pageService', 'CPQService', 'CPQSettingsService', 'CPQCartItemCrossActionService', 'CPQUtilityService', 'CPQCartItemConfigService',
    function($scope, $rootScope, $log, $timeout, $sldsModal, $sldsToast, CPQ_CONST, pageService, CPQService, CPQSettingsService, CPQCartItemCrossActionService, CPQUtilityService, CPQCartItemConfigService) {

    var itemObject, isAttrValid, apiSettings, actionMode;
    var queue = [];
    var saveTimeout = null;
    actionMode = CPQService.actionMode;
    $scope.attributesObj = null;
    $scope.isConfigSubmit = false;
    $scope.reRenderAttributesForm = false;
    $scope.configItemObject = null; // Under $scope because Telus PS team needs to access it from template

    apiSettings = CPQSettingsService.getApiSettings();

    /*********** CPQ CART ITEM CONFIG EVENTS ************/
    $scope.$on('vlocity.cpq.config.configpanelenabled', function(event, isConfigEnabled, data) {
        var dataObject, itemKeys, lookupItem, editableItem, lookupDisplayValueItemKey, cartId, lineItemId;
        $scope.detailEditableServerErrorMsg = null;

        if (isConfigEnabled && data.itemObject) {

            itemObject = CPQCartItemConfigService.getItemFields(data.itemObject);

            $scope.configItemObject = angular.copy(itemObject);
            $scope.attributesObj = itemObject.attributeCategories && itemObject.attributeCategories.records || [];
            dataObject = {
                parent: data.parent,
                сonfigItem: $scope.configItemObject,
                updatedAttributes: $scope.attributesObj
            };

            /*  To process use case when user opened a new config panel before API response with previous update is back, 
                FIFO pattern is used. So we are using queue to keep a reference to the object we are waiting for as API response. 
                When API response is back and attribute is succesfully updated, we are removing first element from the queue.
            */
            updateQueue(dataObject);

            //Set reRenderAttributesForm to false on new load. If user closes
            //config panel before modify attributes response is received.
            $scope.reRenderAttributesForm = false;

            itemKeys = _.keys(itemObject);
            $scope.lookupItemList = [];
            $scope.editableItemList = [];
            cartId = pageService.params.id;
            lineItemId = itemObject.Id.value;
            angular.forEach(itemKeys, function(key) {
                if (itemObject[key] && itemObject[key].editable && !itemObject[key].hidden) {
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
                        editableItem = angular.copy(itemObject[key]);
                        $scope.editableItemList.push(editableItem);
                    }
                }
            });
        } else {
            if ($scope.attributesObj) {
                // If attributes validation fails
                setUserAttrValues($scope.attributesObj);
                // Save updated attribute value before closing config panel (HYB-764)
                saveUpdatedAttributes($scope.attributesObj);
            }
            // Remove the vdf form by resetting the attributes and itemObject
            $scope.attributesObj = null;
            setProcessingLine(itemObject, false, true);
            removeQueueElement();
        }
    });
    /*********** END CPQ CART ITEM CONFIG EVENTS ************/

    /* Custom Labels */
    $scope.customLabels = {};
    var toastCustomLabels = {};
    var labelsArray = ['CPQClose','CPQSave','CPQCartConfigNoAttrsText','CPQCartConfigAdditionalSetting','CPQCartConfigLookupValues',
                        'CPQCartItemLookupText','CPQCartItemLookupCreateNew','CPQCartItemLookupFieldTitle',
                        'CPQCartItemLookupProvideInfo','CPQCartItemLookupCreateNewInstance'];
    var toastLabelsArray = ['CPQUpdatingItem','CPQUpdatedItem','CPQUpdateItemFailed','CPQMustBeGreaterThanZero','CPQCanNotHaveLess','CPQCanNotHaveMoreThan','CPQMustBeGreaterThanOrEqualToZero','CPQQuantity'];
    CPQService.setLabels(labelsArray, $scope.customLabels);
    // Custom labels for toast messages
    CPQService.setLabels(toastLabelsArray, toastCustomLabels);
    /* End Custom Labels */

    function setProcessingLine(obj, flag, resetData) {
        if (obj) {
            obj.processingLine = flag;
        }

        if (angular.isUndefined(resetData)) {
            $scope.isConfigSubmit = flag;
        }
    }

    function removeQueueElement() {
        if (queue.length > 1) {
            queue.shift();
        }
    }

    function updateQueue(data) {
        if ($scope.isConfigSubmit) {
            queue.push(data);
        } else {
            queue[0] = data;
        }
    }

    function updateItemObject(lineItems, updatedlineItems) {
        angular.forEach(updatedlineItems, function(line) {
            if (lineItems.Id.value == line.Id.value) {
                _.assign(lineItems, line);
                return;
            }
            if (line.lineItems) {
                updateItemObject(lineItems, line.lineItems.records);
            }
        });

        removeQueueElement();
    }

    function updateParentQuantityMapField(parent, updatedlineItems) {
        if (parent && parent.Id.value == updatedlineItems[0].Id.value) {
            // Update InCartQuantityMap__c field. Need for updating parentCardinalityMap
            parent[$rootScope.nsPrefix + 'InCartQuantityMap__c'] = updatedlineItems[0][$rootScope.nsPrefix + 'InCartQuantityMap__c'];
        }
    }

    function saveUpdatedAttributes(attributesObj) {
        queue[0].updatedAttributes = attributesObj;
    }

    /**
     * setUserAttrValues: Set saved value if attribute value is undefined (validation fails)
     * @param  {object} attributesObj
     */
    function setUserAttrValues(attributesObj) {
        if (isAttrValid) {
            return;
        }

        angular.forEach(attributesObj, function(obj, key) {
            angular.forEach(obj.productAttributes.records, function(attribute, key) {
                if (angular.isUndefined(attribute.userValues)) {
                    attribute.userValues = attribute.values[0].value;
                }
            });
        });
    }

    function updateFieldValue(field) {
        if (field && angular.isDefined(field.userValues)) {
            if (field.inputType !== 'dropdown') {
                field.values[0].value = field.userValues;
            }
        }
    }

    /**
     * close: Closes attributes configuration panel for line item in cart
     * @param  {object} itemObject
     */
    $scope.close = function() {
        // Publishes event to enable the config panel
        $rootScope.$broadcast('vlocity.cpq.config.configpanelenabled', false);

        removeQueueElement();
    };

    $scope.configSubmit = function() {
        var updateItemsActionObj = {};
        var configUpdateObject = {'records': [{}]}; // Update attributes API structure
        var deleteArrayList = ['Attachments', 'messages', 'attributes', 'childProducts', 'lineItems', 'productGroups', 'actions'];
        var modifiedChildItemObject;
        var product2Name = $scope.configItemObject.PricebookEntry.Product2.Name;

        var processingToastMessage = $sldsToast({
            message: toastCustomLabels['CPQUpdatingItem'] + ' ' + product2Name + ' ...',
            severity: 'info',
            icon: 'info',
            show: CPQService.toastEnabled('info')
        });

        //start spinner
        setProcessingLine(itemObject, true);

        // If attr validation fails
        setUserAttrValues($scope.attributesObj);

        //Update itemObject.attributeCategories but first make sure itemObject has attributes
        if (queue[0].сonfigItem.attributeCategories && queue[0].сonfigItem.attributeCategories.records) {
            /* the configItem is the object send to the server when the corresponding objects are updated
             * when the attribute objects are picked and the close button is pressed before the request to the server
             * is processed completely on the client side there will arise a situation where the client
             * scope is destroyed . In that case the updated attribute object in the queue will contain the latest
             * information.
            */
            queue[0].сonfigItem.attributeCategories.records = queue[0].updatedAttributes;
        }

        if (queue[0].parent) {
            // update on a lineItem that has a parent
            configUpdateObject.records[0] = angular.copy(queue[0].parent);
            angular.forEach(deleteArrayList, function(key) {
                delete configUpdateObject.records[0][key];
            });

            modifiedChildItemObject = angular.copy(queue[0].сonfigItem);
            angular.forEach(deleteArrayList, function(key) {
                delete modifiedChildItemObject[key];
            });

            configUpdateObject.records[0].lineItems = {'records': [modifiedChildItemObject]};
        } else {
            // update on the root which has no parent
            configUpdateObject.records[0] = angular.copy(queue[0].сonfigItem);
            angular.forEach(deleteArrayList, function(key) {
                delete configUpdateObject.records[0][key];
            });
        }

        updateItemsActionObj = queue[0].сonfigItem.actions.updateitems;

        // use api settings from CPQSettingsService.getApiSettings() to determine if pricing and validation are required
        updateItemsActionObj[actionMode].params.price = apiSettings.updateAPIRequiresPricing;
        updateItemsActionObj[actionMode].params.validate = apiSettings.updateAPIRequiresValidation;

        //Updated items for both remote and rest
        updateItemsActionObj[actionMode].params.items = configUpdateObject;

        CPQService.invokeAction(updateItemsActionObj).then(
            function(data) {
                var i,j,modifiedRecords;
                var updatedItemObj = data.records[0];
                var hasError = false;
                var updateSuccessful = false;
                var errorMsg;

                processingToastMessage.hide();

                angular.forEach(data.messages, function(message) {
                    if (message.severity === CPQ_CONST.ERROR) {
                        hasError = true;
                        // HYB-663: The missing attribute messages are already shown in the red message bar at the top,
                        // so showing those messages in toast every time an update is made is not necessary.
                        // Hence, don't display 'This bundle has Errors' error or 'Required attribute missing' error
                        if (message.code !== CPQ_CONST.BUNDLE_HAS_ERRORS && message.code !== CPQ_CONST.REQUIRED_ATTR_MISSING) {
                            // accumulate any error messages
                            errorMsg = errorMsg ? errorMsg + '\n' + message.message : '\n' + message.message;
                        }
                    }
                    if (message.severity === CPQ_CONST.INFO && message.code === CPQ_CONST.UPDATE_SUCCESSFUL) {
                        updateSuccessful = true;
                    }
                });

                if (!hasError) {
                    // if there is NO overall error
                    toastMessage = $sldsToast({
                        backdrop: 'false',
                        message: toastCustomLabels['CPQUpdatedItem'] + ' ' + product2Name,
                        severity: 'success',
                        icon: 'success',
                        templateUrl: 'SldsToast.tpl.html',
                        autohide: true,
                        show: CPQService.toastEnabled('success')
                    });

                // this is the case when update is successful BUT there is other error such as required product attribute missing
                } else if (updateSuccessful) {

                    if (errorMsg) {
                        // display mixed messages (update successful but encountered error(s) OTHER THAN 'This bundle has Errors' error or 'Required attribute missing' error)
                        toastMessage = $sldsToast({
                            backdrop: 'false',
                            message: toastCustomLabels['CPQUpdatedItem'] + ' ' + product2Name + '\nbut encountered error(s):' + errorMsg,
                            severity: 'warning',
                            icon: 'warning',
                            templateUrl: 'SldsToast.tpl.html',
                            autohide: true,
                            show: CPQService.toastEnabled('warning')
                        });
                    } else {
                        // there is error but they are 'This bundle has Errors' error or 'Required attribute missing' error
                        // that does not need to be displayed
                        toastMessage = $sldsToast({
                            backdrop: 'false',
                            message: toastCustomLabels['CPQUpdatedItem'] + ' ' + product2Name,
                            severity: 'success',
                            icon: 'success',
                            templateUrl: 'SldsToast.tpl.html',
                            autohide: true,
                            show: CPQService.toastEnabled('success')
                        });
                    }

                } else {
                    // display only error msg(s)
                    toastMessage = $sldsToast({
                        backdrop: 'false',
                        title: product2Name,
                        message: toastCustomLabels['CPQUpdateItemFailed'] + ' ' + product2Name,
                        severity: 'error',
                        icon: 'warning',
                        templateUrl: 'SldsToast.tpl.html',
                        autohide: true,
                        show: CPQService.toastEnabled('error')
                    });

                }

                // display server side error msg on config panel
                if (updatedItemObj.lineItems && updatedItemObj.lineItems.records && updatedItemObj.lineItems.records.length > 0 &&
                    updatedItemObj.lineItems.records[0].messages && updatedItemObj.lineItems.records[0].messages.length > 0 &&
                    updatedItemObj.lineItems.records[0].messages[0].severity === CPQ_CONST.ERROR) {
                    $scope.detailEditableServerErrorMsg = updatedItemObj.lineItems.records[0].messages[0].message;
                } else {
                    $scope.detailEditableServerErrorMsg = null;
                }

                if (updateSuccessful) {

                    //Handle check for itemObject existence. If user closes config panel before the update response is received
                    if (queue[0].сonfigItem) {
                        // Update API is returning the empty actions object. Deleting actions before merge as a temporary fix.
                        delete updatedItemObj.actions;
                        updateItemObject(itemObject, data.records);

                        // Update InCartQuantityMap__c field.
                        updateParentQuantityMapField(queue[0].parent, data.records);
                    }

                    //Cross actions
                    if (data.actions) {
                        CPQCartItemCrossActionService.processActions(data.actions);
                    }

                    //Reload total bar
                    CPQService.reloadTotalBar();
                }
                // Stop spinner
                setProcessingLine(itemObject, false);
            }, function(error) {
                $log.error('UpdateItem response failed: ', error);
                processingToastMessage.hide();
                // Stop spinner
                setProcessingLine(itemObject, false);
                $sldsToast({
                    backdrop: 'false',
                    title: toastCustomLabels['CPQUpdateItemFailed'] + ' ' + queue[0].сonfigItem.PricebookEntry.Product2.Name,
                    message: error.message,
                    severity: 'error',
                    icon: 'warning',
                    autohide: true,
                    show: CPQService.toastEnabled('error')
                });
            });
    };

    // Vlocity Dynamic form mapping object
    $scope.mapObject = function() {
        return {
            'fieldMapping' : {
                'type' : 'inputType',
                'value' : 'userValues',
                'label' : 'label',
                'readonly':'readonly',
                'required': 'required',
                'disabled': 'disabled',
                'hidden': 'ishidden',
                'multiple': 'multiselect',
                'customTemplate': 'customTemplate',
                'valuesArray' : { //multiple values map. Eg: select, fieldset, radiobutton group
                    'field': 'values',
                    'value': 'value',
                    'label': 'label',
                    'disabled': 'disabled'
                }
            },
            'pathMapping': {
                'levels': 2,
                'path': 'productAttributes.records'
            }
        };
    };

    /**
     * getFieldObjectFromPath returns field based on the ng-model path
     * @param  {string} path
     * @return {Object}
     */
    function getFieldObjectFromPath(path) {
        var firstDotIndex;
        var lastDotIndex;
        if (!path) {
            return;
        }

        firstDotIndex = path.indexOf('.');
        if (firstDotIndex != -1) {
            path = path.substring(firstDotIndex);
        }

        lastDotIndex = path.lastIndexOf('.');
        if (lastDotIndex != -1) {
            path = path.substring(0, lastDotIndex);
        }
        path = CPQUtilityService.removeIfStartsWith(path, '.');

        return _.get($scope, path);
    }

    $scope.getModifiedAttributes = function(e, formValidation, alwaysRunRules, alwaysSave) {
        //cancel timeout if a new one is starting
        if (saveTimeout) {
            $timeout.cancel(saveTimeout);
        }

        var field, modelPath, executeRules, activeInputElement, $configContent, scrollPosition;
        var modifyAttributesActionObj = angular.copy($scope.configItemObject.actions.modifyattributes);
        var attributesObj = {'records':[]};
        var copyItemObject = angular.copy($scope.configItemObject);
        var cherryPickItemObjectFields = ['attributeCategories', 'Id', 'Product2', 'PricebookEntry', 'PricebookEntryId'];

        isAttrValid = true;
        saveTimeout = null;

        if (formValidation && formValidation.$invalid) {
            isAttrValid = !formValidation.$invalid;
            return;
        }

        //start spinner
        setProcessingLine(itemObject, true);

        //Avoid angular events from $on. Only need to handle DOM events
        modelPath = e && e.target && e.target.getAttribute('ng-model');
        field = getFieldObjectFromPath(modelPath);
        executeRules = (angular.isDefined(alwaysRunRules) && alwaysRunRules) ? true : field && field.hasRules;

        // saved valid value should be displayed after entering an invalid value and reopen the configPanel 
        updateFieldValue(field);

        if (!executeRules) {
            if (alwaysSave) {
                saveTimeout = $timeout(function () {
                    $scope.configSubmit();
                }, 800);
            }
            return;
        }

        // use api settings from CPQSettingsService.getApiSettings() to determine if pricing and validation are required
        modifyAttributesActionObj[actionMode].params.price = apiSettings.modifyAttributesAPIRequiresPricing;
        modifyAttributesActionObj[actionMode].params.validate = apiSettings.modifyAttributesAPIRequiresValidation;

        //Update copyItemObject.attributeCategories but first make sure copyItemObject has attributes
        if (copyItemObject.attributeCategories && copyItemObject.attributeCategories.records) {
            copyItemObject.attributeCategories.records = $scope.attributesObj;
        }
        //Pass only the attribtues and mandatory fields for API to be performant.
        attributesObj.records[0] = _.pick(copyItemObject, cherryPickItemObjectFields);

        modifyAttributesActionObj[actionMode].params.items = attributesObj;

        CPQService.invokeAction(modifyAttributesActionObj).then(
            function(data) {
                var attributesModified = false;
                $log.debug('Modified attributes', data);

                if (data.records && data.records.length > 0) {
                    attributesModified = data.messages.some(function(msg) {
                        return (msg.code === CPQ_CONST.ATTRIBUTE_MODIFICATION_SUCCESSFUL);
                    });

                    if (attributesModified) {
                        activeInputElement = document.activeElement;
                        $configContent = angular.element('#js-cpq-product-cart-config-form');
                        scrollPosition = $configContent.scrollTop();
                        $scope.reRenderAttributesForm = true;

                        // Update attribute categories
                        $scope.configItemObject.attributeCategories = data.records[0].attributeCategories;
                        $scope.attributesObj = data.records[0].attributeCategories.records || [];
                        queue[0].updatedAttributes = $scope.attributesObj;

                        // Run after the current call stack is executed.
                        // Rerenders VDF to reflect new attribute changes
                        $timeout(function() {
                            $scope.reRenderAttributesForm = false;
                            saveTimeout = $timeout(function () {
                                $scope.configSubmit();
                                $configContent.scrollTop(scrollPosition);
                                // fix: Cursor is getting lost when rerender attributes
                                $('input[name=' + activeInputElement.name + ']').focus();
                            }, 0);
                        }, 0);
                    } else {
                        //Fix for CMT-1115
                        //Handle the usecase when hasRules flag is true and attributes are not modified
                        $scope.configSubmit();
                    }
                } else {
                    //Stop spinner if no data is returned, to prevent infinite spinner.
                    setProcessingLine(itemObject, false);
                }
            }, function(error) {
                $log.error('Config panel modified attributes response failed', error);
                //Stop spinner in case of error, to prevent infinite spinner.
                setProcessingLine(itemObject, false);
            });
    };

    $scope.launchLineItemLookup = function(lookupItem) {
        var lookupFieldName = lookupItem.fieldName;
        var lookupDisplayValueItemFieldName = lookupFieldName.slice(0, -1) + 'r';
        $scope.selectedLookupItemFieldName = lookupFieldName;
        $scope.originalLookupItem = $scope.configItemObject[lookupFieldName];
        $scope.originalDisplayValueLookupItem = $scope.configItemObject[lookupDisplayValueItemFieldName];
        $rootScope.selectedLookupItem = {
            'Id': lookupItem.value,
            'Name': lookupItem.displayValue
        };
        $scope.createNewResultMsg = null;

        $scope.params.lineItemId = lookupItem.lineItemId;
        $scope.params.fieldName = lookupItem.fieldName;
        // Account type pulling dynamicaly
        $scope.params.fieldLabel = lookupItem.label;
        $sldsModal({
            backdrop: 'static',
            templateUrl: 'CPQCartItemLookupFieldModal.tpl.html',
            show: true,
            scope: $scope
        });
    };

    var refreshLookupItem = function() {
        $log.debug('refreshLookupItem: $rootScope.selectedLookupItem: ', $rootScope.selectedLookupItem);
        var changedFieldName = $scope.selectedLookupItemFieldName;
        var changedToId = $rootScope.selectedLookupItem.Id;
        var changedToValue = $rootScope.selectedLookupItem.Name;
        for (var i = 0; i < $scope.lookupItemList.length; i++) {
            if ($scope.lookupItemList[i].fieldName === changedFieldName) {
                $scope.lookupItemList[i].value = changedToId;
                $scope.lookupItemList[i].displayValue = changedToValue;
                break;
            }
        }
        $log.debug('$scope.originalLookupItem: ', $scope.originalLookupItem);
        $scope.originalLookupItem.value = changedToId;
        $log.debug('$scope.originalDisplayValueLookupItem: ', $scope.originalDisplayValueLookupItem);
        $scope.originalDisplayValueLookupItem.Id = changedToId;
        $scope.originalDisplayValueLookupItem.Name = changedToValue;
        $scope.configSubmit();
    };

    $scope.saveAccountInfo = function() {
        refreshLookupItem();
    };

    $scope.refreshEditableField = function(editableItem, alwaysSave) {
        var errorMsg, changedValue, originalEditableItem, isValidFieldValue;
        var recurringValue = $rootScope.nsPrefix + 'RecurringManualDiscount__c';
        var oneTimeValue = $rootScope.nsPrefix + 'OneTimeManualDiscount__c';
        var recurringPrice = $rootScope.nsPrefix + 'RecurringCalculatedPrice__c';
        editableItem.qtyValidationMessage = '';

        if (editableItem.fieldName == recurringValue || editableItem.fieldName == oneTimeValue || editableItem.fieldName == recurringPrice) {
            if (editableItem.value >= 0 && editableItem.value <= 100) {
                isValidFieldValue = true;
            } else {
                isValidFieldValue = false;
            }
        }

        if (editableItem.fieldName.toLowerCase() == 'quantity') {
            if (angular.isUndefined(editableItem.value) || editableItem.value < 1) {
                errorMsg = editableItem.fieldName + ' ' + toastCustomLabels['CPQMustBeGreaterThanZero'];
            } else if (editableItem.value < $scope.configItemObject.minQuantity) {
                errorMsg = editableItem.fieldName + ' ' + toastCustomLabels['CPQCanNotHaveLess'] + ' ' + $scope.configItemObject.minQuantity + ' ' + toastCustomLabels['CPQQuantity'];
            } else if (editableItem.value > $scope.configItemObject.maxQuantity) {
                errorMsg = editableItem.fieldName + ' ' + toastCustomLabels['CPQCanNotHaveMoreThan'] + ' ' + $scope.configItemObject.maxQuantity + ' ' + toastCustomLabels['CPQQuantity'];
            }
        } else if (angular.isDefined(isValidFieldValue) && !isValidFieldValue) {
            errorMsg = editableItem.label + ' ' + toastCustomLabels['CPQMustBeGreaterThanOrEqualToZero'];
        }

        if (errorMsg) {
            editableItem.qtyValidationMessage = errorMsg;
        } else {
            $log.debug('refreshEditableField: editableItem: ', editableItem);
            changedValue = editableItem.value;
            originalEditableItem = $scope.configItemObject[editableItem.fieldName];
            originalEditableItem.value = changedValue;
        }

        if (!errorMsg && alwaysSave) {
            $scope.configSubmit();
        }
    };

    /**
    *checkQuantityField : Used for checking calling service for prevent decimal character in quantity fields
    * @param {field} current field 
    * @param {key} key pressed by user
    */

    $scope.checkQuantityField = function(field, key) {
        if (field === 'Quantity') {
            CPQService.setIntegerOnlyFields(key);
        }
    };

    $scope.processCreateNewLookupAction = function(newLookupAction) {
        $log.debug('processCreateNewLookupAction: newLookupAction: ', newLookupAction);
        $log.debug('processCreateNewLookupAction: jsonStr', newLookupAction.remote.params.inputFields);
        $scope.createNewLookupAction = newLookupAction;
        $scope.createNewLookupInputFields = JSON.parse(newLookupAction.remote.params.inputFields);//
    };

    $scope.refreshCreateNewLookupInputField = function(inputField) {
        $log.debug('refreshCreateNewLookupInputField: inputField: ', inputField);
        $log.debug('createNewLookupInputFieldValue: ', $scope.createNewLookupInputFieldValue);
        $log.debug('scope.createNewLookupInputFields: ', $scope.createNewLookupInputFields);
        for (var i = 0; i < $scope.createNewLookupInputFields.length; i++) {
            if ($scope.createNewLookupInputFields[i].fieldName === inputField.fieldName) {
                $scope.createNewLookupInputFields[i].value = $scope.createNewLookupInputFieldValue;
                break;
            }
        }
    };

    $scope.createNewInstanceOfLookupField = function() {
        $log.debug('createNewInstanceOfLookupField: $scope.createNewLookupAction: ', $scope.createNewLookupAction);
        $scope.createNewLookupAction[actionMode].params.inputFields = $scope.createNewLookupInputFields;

        CPQService.invokeAction($scope.createNewLookupAction).then(
            function(data) {
                $log.debug(data);
                $log.debug('createNewLookupInputFieldValue: ', $scope.createNewLookupInputFieldValue);
                $log.debug('scope.createNewLookupInputFields: ', $scope.createNewLookupInputFields);
                for (var i = 0; i < $scope.createNewLookupInputFields.length; i++) {
                    if ($scope.createNewLookupInputFields[i].editable) {
                        $scope.createNewLookupInputFields[i].value = null;
                    }
                }
                $scope.createNewLookupInputFieldValue = null;
                $scope.createNewResultMsg = 'Create new instance successful';
                var message = {'event': 'reload', 'message': null};
                $rootScope.$broadcast('vlocity.layout.cpq-cart-item-lookup.events', message);
            }, function(error) {
                $log.error(error);
                $scope.createNewResultMsg = 'Create new instance failed: ' + error;
            });
    };

    $scope.isAsset = function(item, fieldName) {
        return CPQService.isAsset(item,fieldName);
    };

    $scope.getStateData = function(cards) {
        if (cards.length && cards[0].states) {
            CPQCartItemConfigService.configureFields(cards[0].states[0].fields);
        }
    };
}]);

},{}],6:[function(require,module,exports){
angular.module('hybridCPQ')
  .controller('CPQCartItemController', ['$scope', '$rootScope', '$log', '$timeout', '$sldsModal', '$sldsPrompt', '$sldsToast', '$q', '$filter', 'CPQ_CONST', 'CPQService', 'CPQSettingsService', 'CPQOverrideService', 'CPQCardinalityService', 'CPQItemDetailsService', 'CPQCartItemCrossActionService', 'CPQLevelBasedApproachService', 'CPQAdjustmentService', 'CPQResponsiveHelper', 'PromiseQueueFactory', 'CPQUtilityService', 
    function($scope, $rootScope, $log, $timeout, $sldsModal, $sldsPrompt, $sldsToast, $q, $filter, CPQ_CONST, CPQService, CPQSettingsService, CPQOverrideService, CPQCardinalityService, CPQItemDetailsService, CPQCartItemCrossActionService, CPQLevelBasedApproachService, CPQAdjustmentService, CPQResponsiveHelper, PromiseQueueFactory ,CPQUtilityService) {
        var adjustmentActionType, apiSettings, featureSettings, customSettings, detailViewUseAPI, levelBasedApproach, actionMode;

        actionMode = CPQService.actionMode;

        $scope.reRenderAttributesForm = false;
        $scope.isMobileTablet = CPQResponsiveHelper.mobileTabletDevice;
        // isSelected set to true when user opens a config attributes for edit:
        $scope.isSelected = false;
        /* Siblings of non root item use the same intance of cartItemController
         * Exposing selected item id to the scope for comparision in templates
         * isSelectedItemObjId is used in border highlighting logic of the selected item */
        $scope.isSelectedItemObjId = '';

        $scope.lineItemIdsWithInvalidQuantity = [];
        $scope.lineItemIdsWithInvalidRecurringDiscount = [];
        $scope.lineItemIdsWithInvalidOneTimeDiscount = [];

        apiSettings = CPQSettingsService.getApiSettings();
        featureSettings = CPQSettingsService.getFeatureSettings();
        customSettings = CPQSettingsService.getCustomSettings();
        
        //is expand mode enabled?
        $scope.expandMode = (customSettings['Product Configuration Mode'] ? (customSettings['Product Configuration Mode'].toLowerCase() === 'expand') : false);
        detailViewUseAPI = (customSettings['CPQ Cart Preview Modal Use API'] ? (customSettings['CPQ Cart Preview Modal Use API'].toLowerCase() === 'on') : false);
        levelBasedApproach = (customSettings['LevelBasedApproach'] ? (customSettings['LevelBasedApproach'].toLowerCase() === 'true') : false);

        /** ADJUSTMENT **/
        function setDefaultAdjustmentData() {
            var data = $scope.adjustmentData;
            data.adjustment.selected = data.adjustment.types[0];
            data.adjustment.value = '';
            data.adjustmentCodes.selected = {};
            // TimePlans, TimePolicies
            data.timePolicy.selected = {};
            data.timePlan.selected = {};
        }

        //Modals Associated with Actions
        $scope.openAdjustmentModal = function(field, type, itemObject, parent) {
            $scope.isSaving = false;
            var modalScope = $scope.$new();

            adjustmentActionType = type;
            $scope.adjustmentData = CPQAdjustmentService.getData();

            setDefaultAdjustmentData();

            if (type === 'switchpayment') {
                CPQAdjustmentService.openPaymentMethodModal(modalScope, itemObject, field, type, parent,
                    $scope.getAlternativePaymentFieldMapHook());
            } else if (type === 'pricedetail') {
                CPQAdjustmentService.openDetailsModal(modalScope, itemObject, field, type);
            } else {
                CPQAdjustmentService.openApplyModal(modalScope, itemObject, field, type);
            }
        };

        $scope.applyAdjustment = function(field, closeCallback) {
            var adjustmentData = $scope.adjustmentData;
            var action = field.actions[adjustmentActionType];
            var parentObj = $scope.$parent.obj;

            $scope.isSaving = true;

            CPQAdjustmentService.apply(adjustmentData, parentObj, action).then(
                function(data) {
                    $scope.isSaving = false;
                    // Reset adjustment value and code input
                    setDefaultAdjustmentData();
                    closeCallback();
                }, function(error) {
                    $scope.isSaving = false;
                    $log.error('Apply adjustment response failed: ', error);
                });
        };

        $scope.switchPayment = function(itemObject, parent, closeCallback) {
            var updateItemsActionObj = itemObject.actions.updateitems;
            var configUpdateObject = {'records': [{}]};
            var deleteArrayList = ['Attachments', 'actions', 'messages', 'childProducts', 'lineItems', 'productGroups'];
            var modifiedChildItemObject;
            var parentFromAPI, parentInCardData = parent;
            var updatedLineItemFromAPI, updatedLineItemInCarddata;

            $scope.isSaving = true;
            
            if (parent) {
                // update on a lineItem that has a parent
                configUpdateObject.records[0] = angular.copy(parent);
                angular.forEach(deleteArrayList, function(key) {
                    delete configUpdateObject.records[0][key];
                });

                modifiedChildItemObject = angular.copy(itemObject);
                angular.forEach(deleteArrayList, function(key) {
                    delete modifiedChildItemObject[key];
                });

                configUpdateObject.records[0].lineItems = {'records': [modifiedChildItemObject]};
            } else {
                // update on the root which has no parent
                configUpdateObject.records[0] = angular.copy(itemObject);
                angular.forEach(deleteArrayList, function(key) {
                    delete configUpdateObject.records[0][key];
                });
            }

            // no need for pricing and validation
            updateItemsActionObj[actionMode].params.price = true;
            updateItemsActionObj[actionMode].params.validate = false;

            //Updated items for both remote and rest
            updateItemsActionObj[actionMode].params.items = configUpdateObject;

            CPQService.invokeAction(updateItemsActionObj).then(
              function(data) {

                $scope.isSaving = false;

                // root is updated when the response has no lineItems and (no parentItemId (in modal) or parentItemId is null (in cart)
                if (!data.records[0].lineItems && (!data.records[0][$rootScope.nsPrefix +
                    'ParentItemId__c'] || !data.records[0][$rootScope.nsPrefix + 'ParentItemId__c'].value)) {

                    // copy non-recurring price element fields
                    updatedLineItemFromAPI = data.records[0];
                    updatedLineItemInCardData = itemObject;
                    updatedLineItemInCardData[$rootScope.nsPrefix + 'OneTimeCharge__c']['actions'] = {};
                    _.merge(updatedLineItemInCardData,updatedLineItemFromAPI);

                // non-root is updated
                } else {

                    // copy non-recurring price element fields
                    parentFromAPI = data.records[0];
                    updatedLineItemFromAPI = data.records[0].lineItems.records[0];
                    updatedLineItemInCardData = CPQCardinalityService.findLineItem(updatedLineItemFromAPI.Id.value, parentInCardData.lineItems.records);
                    updatedLineItemInCardData[$rootScope.nsPrefix + 'OneTimeCharge__c']['actions'] = {};
                    _.merge(updatedLineItemInCardData,updatedLineItemFromAPI);

                }

                // Cross actions to update items prices for situation like rollup to total charge in parent
                if (data.actions) {
                    CPQCartItemCrossActionService.processActions(data.actions);
                }

                closeCallback();

                CPQService.reloadTotalBar();

            }, function(error) {
                $scope.isSaving = false;
                $log.error('Switch Payment response failed: ', error);
            });

        };

        /** END ADJUSTMENT **/

        /* Enter full screen if child level reaches 5 */
        $scope.fullScreen = function(level, show) {
            if (show && level > 4 && $scope.attrs.showProductList) {
                $rootScope.$broadcast('cpq-hide-product-list');
            }
        };

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
            // Passing callback function (setProcessingLine)
            return CPQLevelBasedApproachService.determineChildProdOpenOrCloseAfterClick(childProd, childProdState, setProcessingLine);
        };

        $scope.determineIfChildProdOpenOrCloseIconShouldBeHidden = function(childProd) {
            return CPQLevelBasedApproachService.determineIfChildProdOpenOrCloseIconShouldBeHidden(childProd);
        };

        $scope.checkIfChildProdHasChildren = function(childProd) {
            return CPQLevelBasedApproachService.checkIfChildProdHasChildren(childProd);
        };

        /*********** CPQ CART ITEM EVENTS ************/
        var unbindEvents = [];

        //Modal events for cross rules update.
        //Accepts dynamic function arguments
        unbindEvents[unbindEvents.length] = $scope.$on('vlocity.cpq.cartitem.actions', function(event, actionType, obj) {
            crossAction (event, actionType, obj);
        });

        // When the config panel is closed, set the isSelected variable to false
        // Removes selected border for line item
        unbindEvents[unbindEvents.length] = $scope.$on('vlocity.cpq.config.configpanelenabled', function(event, isConfigEnabled) {
            if (!isConfigEnabled) {
                $scope.isSelected = false;
                $scope.isSelectedItemObjId = '';
            }
        });

        if (!$scope.attrs.lineItemModal) {
            //Cart item events for cross rules update. Not applicable for modal.
            // @TODO Event intensive, needs optimization.
            unbindEvents[unbindEvents.length] = $scope.$on('vlocity.cpq.cartitem.crossupdate', function(event, updatedItem) {
                    crossItemUpdate(updatedItem);
                });
        }

        if ($scope.attrs.lineItemModal) {
            //Modal events for cross rules update.
            unbindEvents[unbindEvents.length] = $scope.$on('vlocity.cpq.cartitem.modal.crossupdate', function(event, updatedItem) {
                    crossItemUpdate(updatedItem);
                });
        }

        $scope.$on('$destroy', function() {
            if ($scope.isSelected) {
                //Publish an event to close the config panel
                $rootScope.$broadcast('vlocity.cpq.config.configpanelenabled', false);
            }

            //Removes all listeners
            unbindEvents.forEach(function (fn) {
                fn();
            });
        });

        /*********** END CPQ CART ITEM EVENTS ************/

        /* Custom Labels */
        $scope.customLabels = {};
        var toastCustomLabels = {};
        var labelsArray = ['CPQProducts','CPQPromotions','CPQFilter','CPQProductConfig','CPQChangePrice',
                'CPQPriceDetails','CPQClone','CPQSettings','CPQDelete','CPQClose','CPQApply','CPQAddToCart','CPQDeleteItem',
                'CPQCellDetails','CPQInspect', 'CPQAddItem', 'CPQShowActions','CPQDetails','CPQConfigure','CPQItemsToBeDeleted',
                'CPQCancel','CPQPromosToBeDeleted','CPQLineItemsToBeDeleted','CPQDiscountsToBeDeleted'];
        var toastLabelsArray =  ['CPQAutoRemovedItem','CPQCloneItemFailed','CPQCloningItem','CPQClonedItem','CPQUpdatingItem',
                'CPQUpdatedItem','CPQUpdateItemFailed','CPQAddingItem','CPQAddItemFailed','CPQAutoReplaceItem','CPQAddedItem',
                'CPQDeletingItem','CPQDeleteItem','CPQDeleteItemConfirmationMsg','CPQDeleteButtonLabel','CPQDeleteItemFailed',
                'CPQDeletedItem','CPQCancel','CPQMustBeGreaterThanZero','CPQCanNotHaveLess','CPQCanNotHaveMoreThan','CPQMustBeGreaterThanOrEqualToZero','CPQQuantity'];
        CPQService.setLabels(labelsArray, $scope.customLabels);
        // Custom labels for toast messages
        CPQService.setLabels(toastLabelsArray, toastCustomLabels);
        /* End Custom Labels */

        // If user collapses the left column, we need to update our expanded actions logic:
        $scope.$watch('attrs.showProductList', function(newValue, oldValue) {
            if (newValue !== oldValue) {
                $rootScope.customViews.showExpandedActions();
            }
        });

        function canAddLineItemsToParent (parent) {
            // Only add lineItems to parent if
            // Case 1: (levelBaasedApproach is off): we should add lineItems to parent
            // OR
            // Case 2: (levelBaasedApproach is on BUT the parent has been opened already):
            // BECAUSE if levelBaasedApproach is on, we should LET the user open the parent folder, which would retrieve all chidren,
            // via the getExpandItem API, including those that would have been added because of rules.
            // BUT if parent has already been opened, that means we need to add those lineItems,
            // because the getExpandItem API will not be called again to get all children under the parent
            if (!levelBasedApproach || (levelBasedApproach && CPQLevelBasedApproachService.hasNodeBeenOpened(parent))) {
                return true;
            } else {
                return false;
            }
        }

        function crossAction (event, type, data) {
            var toBeAddedLineItem, parentInCardData, grandParentInCardData, productGroupParentInCardData, productGroupParentFromAPI, productGroupParentFromAPIList, sessionStorageLayoutLoaded;

            //WIP cross actions feature
            switch (type) {
                case 'add':

                    if ($scope.$parent.obj && data.records.Id.value === $scope.$parent.obj.Id.value) {

                        sessionStorageLayoutLoaded = (sessionStorage.getItem('layout::cpq-cart-item-product-children') !== null) ? true : false;

                        // handle both cases of sessionStorage loaded or NOT loaded
                        if ($scope.viewModelRecords || (!$scope.viewModelRecords && !sessionStorageLayoutLoaded)) {

                            if (data.records.lineItems && data.records.lineItems.records && data.records.lineItems.records.length > 0) {

                                parentInCardData = $scope.$parent.obj; // parent in card

                                if (canAddLineItemsToParent(parentInCardData)) {

                                    parentInCardData[$rootScope.nsPrefix + 'InCartQuantityMap__c'] = data.records[$rootScope.nsPrefix + 'InCartQuantityMap__c'];

                                    //Handle multiple auto add records under a lineitems parent
                                    data.records.lineItems.records.forEach(function(record) {
                                        toBeAddedLineItem = record; // child
                                        // Only add lineItem to parent if it has NOT been added under the parent
                                        if (!CPQCardinalityService.hasLineItemAlreadyBeenAddedToParent(parentInCardData, toBeAddedLineItem)) {
                                            CPQCardinalityService.insertLineItemToParent(parentInCardData, toBeAddedLineItem); // insert child to parent in card
                                        }
                                    });

                                    setupViewModel(parentInCardData);

                                }

                            }

                            if (data.records.productGroups && data.records.productGroups.records && data.records.productGroups.records.length > 0) {

                                // grandParent in card
                                grandParentInCardData = $scope.$parent.obj;

                                // find the productGroup parents from API.  auto-add rule (data,actions) will only return the parent productGroups with lineItems
                                productGroupParentFromAPIList = CPQCardinalityService.findProductGroupsWithLineItemsAmongNodeList(data.records.productGroups.records);

                                // there could be lineItems to be added that belong to more than one productGroup, that's why we need to process each
                                productGroupParentFromAPIList.forEach(function(productGroupParentFromAPI) {

                                    // find the corresponding productGroup parent in card, starting from the grandParent in card
                                    productGroupParentInCardData = CPQCardinalityService.findProductGroupAmongNodeList(
                                                                        productGroupParentFromAPI.Id.value,
                                                                        productGroupParentFromAPI.productHierarchyPath,
                                                                        grandParentInCardData.productGroups.records);

                                    if (canAddLineItemsToParent(productGroupParentInCardData)) {

                                        productGroupParentInCardData[$rootScope.nsPrefix + 'InCartQuantityMap__c'] = productGroupParentFromAPI[$rootScope.nsPrefix + 'InCartQuantityMap__c'];

                                        //Handle multiple auto add records under a productGroup parent
                                        productGroupParentFromAPI.lineItems.records.forEach(function(record) {
                                            toBeAddedLineItem = record; // child
                                            // Only add lineItem to parent if it has NOT been added under the parent
                                            if (!CPQCardinalityService.hasLineItemAlreadyBeenAddedToParent(productGroupParentInCardData, toBeAddedLineItem)) {
                                                CPQCardinalityService.insertLineItemToParent(productGroupParentInCardData, toBeAddedLineItem); // insert child to parent in card
                                            }
                                        });

                                        $scope.$parent.$broadcast('vlocity.cpq.cartitem.actions', 'viewmodel', {'item': productGroupParentInCardData});

                                    }

                                });
                            }
                        }
                    }
                    break;
                case 'update':
                    if ($scope.$parent.obj && (data.records.Id.value === $scope.$parent.obj.Id.value)) {
                        crossItemUpdate(data.records);
                    }
                    //@TODO: Handle non root
                    break;
                case 'updaterootitem':
                    // Handle the root node only
                    if ($scope.$parent.obj && (data.records.Id.value === $scope.$parent.obj.Id.value)) {
                        _.assign($scope.$parent.obj, data.records);
                    }
                    break;
                case 'updateprices':
                    if ($scope.$parent.obj) {
                        updateItemsPrices(data.records);
                    }
                    break;
                case 'delete':
                    //Cross item delete functionality
                    if (data.itemId && $scope.$parent.obj && data.itemId === $scope.$parent.obj.Id.value &&
                        $scope.$parent.obj.Id.value === $scope.$parent.obj[$rootScope.nsPrefix + 'RootItemId__c'].value) {
                        // Handles root item
                        $scope.$parent.$emit('vlocity.cpq.cart.removerecords', $scope.$parent);
                    } else if ($scope.viewModelRecords && $scope.$parent.obj) {
                        // Handles non-root item
                        if ($scope.$parent.obj.lineItems) {
                            $scope.$parent.obj.lineItems.records.forEach(function(lineItem) {
                                if (data.itemId === lineItem.Id.value) {
                                    CPQCardinalityService.deleteLineItem($scope.$parent.obj, lineItem, data.addonProduct, false);
                                    setupViewModel($scope.$parent.obj);
                                    $sldsToast({
                                        backdrop: 'false',
                                        message: lineItem.Product2.Name + ' ' + toastCustomLabels['CPQAutoRemovedItem'],
                                        severity: 'success',
                                        icon: 'success',
                                        templateUrl: 'SldsToast.tpl.html',
                                        autohide: true,
                                        show: CPQService.toastEnabled('success')
                                    });
                                }
                            });
                        }
                    }
                    break;
                case 'replace':
                    break;
                case 'viewmodel':
                    // Update view model after preview modal is closed
                    if ($scope.$parent.obj && (data.item.Id.value === $scope.$parent.obj.Id.value)) {
                        if ($scope.viewModelRecords) {
                            // Update line items
                            setupViewModel(data.item);
                        } else {
                            // Update root item
                            _.assign($scope.$parent.obj, data.item);
                        }
                    }
                    // Publish an event to update data if configpanel enabled for this item
                    // Virtual group - Children share the same scope. Avoid publishing config
                    // event for virtual items as it will not have attributes.
                    if ($scope.isSelected && !data.item.isVirtualItem) {
                        $rootScope.$broadcast('vlocity.cpq.config.configpanelenabled', true, {'parent': $scope.$parent.obj, 'itemObject': data.item});
                    }
                    break;
                case 'processing':
                    // Disable Details button  while processing
                    $scope.processing = data.status;
                    break;
            }
        }

        $scope.checkIfAddonIsNotInCart = function(parent, addonChildProduct) {
            return CPQCardinalityService.checkIfAddonIsNotInCart(parent, addonChildProduct);
        };

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

            if (records.childProducts && records.childProducts.records) {
                angular.forEach(records.childProducts.records, function(childProd) {
                    // This checkIfAddonIsNotInCart(...) check is ONLY for optional products (minQuantity=0) with defaultQuantity=0,
                    // because these optionals ALWAYS have ONE Addon product in childProducts json structure, even when they have
                    // been added to cart, so we do not want to display the childProducts Addon when it has been added to cart as lineItem
                    if ($scope.checkIfAddonIsNotInCart(records, childProd)) {
                        $scope.viewModelRecords.push(childProd);
                    }
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
         * crossItemUpdate Used for updating cross items in cart
         * @param  {object} updatedItem
         * Enhance this function for other operations
        */
        function crossItemUpdate(updatedItem) {
            var updatedRootItem;

            // updatedItem contains the actual item's parent item to handle cardinality
            if (!updatedItem) {
                return;
            }
            delete updatedItem.$$hashKey;

            $scope.reRenderAttributesForm = true;
            if (angular.isDefined($scope.viewModelRecords) && !(_.isEmpty($scope.viewModelRecords))) {
                // Update Non Root Item
                angular.forEach($scope.viewModelRecords, function(record) {
                    if (updatedItem.lineItems) {
                        angular.forEach(updatedItem.lineItems.records, function(updatedRecord) {
                            if (record.Id.value === updatedRecord.Id.value) {
                                _.assignWith(record, updatedRecord, customizer);
                            }
                        });
                    }

                    if (updatedItem.productGroups) {
                        angular.forEach(updatedItem.productGroups.records, function(updatedRecord) {
                            if (record.Id.value === updatedRecord.Id.value) {
                                // Using merge rather than assign to support nested levels of virtual groups and line items under it.
                                _.mergeWith(record, updatedRecord, customizer);
                            }
                        });
                    }
                });

            } else {
                // Update Only Root Item
                if ($scope.$parent.obj && $scope.$parent.obj.Id.value === updatedItem.Id.value) {
                    updatedRootItem = angular.copy(updatedItem);
                    delete updatedRootItem.lineItems;
                    delete updatedRootItem.productGroups;

                    _.mergeWith($scope.$parent.obj, updatedRootItem, customizer);
                }
            }

            //Re render the attributes VDF
            $timeout(function() {
                $scope.reRenderAttributesForm = false;
            }, 0);

            function customizer(objValue, srcValue) {
                // Resolving a problem with merge arrays in different order
                var key, objHashmap, srcHashmap, hashmapToObjArray, mergedObj;

                if (_.isArray(objValue)) {
                    objHashmap = _.reduce(objValue, function(hash, value) {
                        if (value && value.Id) {
                            key = value.Id.value;
                            hash[key] = value;
                            return hash;
                        }
                    }, {});
                    srcHashmap = _.reduce(srcValue, function(hash, value) {
                        if (value && value.Id) {
                            key = value.Id.value;
                            hash[key] = value;
                            return hash;
                        }
                    }, {});

                    if (!(_.isEmpty(objHashmap) && _.isEmpty(srcHashmap))) {
                        mergedObj = _.mergeWith(objHashmap,srcHashmap,customizer);
                        hashmapToObjArray = Object.keys(mergedObj).map(function(key) {
                            return mergedObj[key];
                        });
                        return hashmapToObjArray;
                    } else {
                        return;
                    }
                }
            }
        }

        function updateFieldValue(field) {
            if (field && angular.isDefined(field.userValues)) {
                if (field.inputType !== 'dropdown') {
                    field.values[0].value = field.userValues;
                }
            }
        }

        /**
         * updateItemsPrices Used for updating items prices in cart
         * @param  {object} updatedItems
        */
        function updateItemsPrices(updatedItems) {
            if (!updatedItems) {
                return;
            }

            var updateRecord = function(record) {
                angular.forEach(updatedItems, function(updatedRecord) {
                    if (record.Id.value === updatedRecord.Id.value) {
                        _.merge(record, updatedRecord);
                    }
                });
            };

            if (angular.isDefined($scope.viewModelRecords) && !(_.isEmpty($scope.viewModelRecords))) {
                //Non root Item
                angular.forEach($scope.viewModelRecords, function(record) {
                    updateRecord(record);
                });

            } else {
                // Root item
                if ($scope.$parent.obj) {
                    updateRecord($scope.$parent.obj);
                }
            }

        }

        // TODO: investigate if there is a valid way to do deep copy.  The following is a temp workaround, but the risk is missing some fields required.
        var copyUpdatableFields = function(targetLineItem, sourceLineItem, updateAttributeData) {
            targetLineItem.Quantity.value = sourceLineItem.Quantity.value;
            targetLineItem[$rootScope.nsPrefix + 'RecurringTotal__c'].value = sourceLineItem[$rootScope.nsPrefix + 'RecurringTotal__c'].value;
            targetLineItem[$rootScope.nsPrefix + 'OneTimeTotal__c'].value = sourceLineItem[$rootScope.nsPrefix + 'OneTimeTotal__c'].value;
            targetLineItem[$rootScope.nsPrefix + 'RecurringManualDiscount__c'].value = sourceLineItem[$rootScope.nsPrefix + 'RecurringManualDiscount__c'].value;
            targetLineItem[$rootScope.nsPrefix + 'OneTimeManualDiscount__c'].value = sourceLineItem[$rootScope.nsPrefix + 'OneTimeManualDiscount__c'].value;
            targetLineItem.messages = sourceLineItem.messages;
            if (updateAttributeData) {
                targetLineItem.attributeCategories = sourceLineItem.attributeCategories;
            }
        };
        /**
         * getFieldObjectFromPath returns field based on the ng-model path
         * @param  {object} itemObject
         * @param  {string} path
         * @return {Object}
         */
        function getFieldObjectFromPath(itemObject, path) {
            var firstDotIndex;
            var lastDotIndex;
            if (!path) {
                return;
            }

            firstDotIndex = path.indexOf('.');
            if (firstDotIndex != -1) {
                path = path.substring(firstDotIndex);
            }

            lastDotIndex = path.lastIndexOf('.');
            if (lastDotIndex != -1) {
                path = path.substring(0, lastDotIndex);
            }

            path = CPQUtilityService.removeIfStartsWith(path, '.');

            return _.get(itemObject, path);
        }

        var debounced;
        $scope.saveUpdates = function(e, formValidation, itemObject, alwaysRunRules) {
            var $modalContent = angular.element('#js-cpq-lineitem-details-modal-content');
            var scrollPosition = $modalContent.scrollTop();
            var modifyAttributesActionObj = angular.copy(itemObject.actions.modifyattributes);
            var attributesObj = {'records':[]};
            var itemObjectCopy = angular.copy(itemObject);
            var cherryPickItemObjectFields = ['attributeCategories', 'Id', 'Product2', 'PricebookEntry', 'PricebookEntryId'];
            var field, modelPath, executeRules, activeInputElement;

            //Pass only the attribtues and mandatory fields for API to be performant.
            attributesObj.records[0] = _.pick(itemObjectCopy, cherryPickItemObjectFields);

            // use api settings from CPQSettingsService.getApiSettings() to determine if pricing and validation are required
            modifyAttributesActionObj[actionMode].params.price = apiSettings.modifyAttributesAPIRequiresPricing;
            modifyAttributesActionObj[actionMode].params.validate = apiSettings.modifyAttributesAPIRequiresValidation;

            modifyAttributesActionObj[actionMode].params.items = attributesObj;
            // Publish an event to disable Close button in preview modal
            publishDetailModalProcessingEvent(true);

            //Avoid angular events from $on. Only need to handle DOM events
            modelPath = e && e.target && e.target.getAttribute('ng-model');

            field = getFieldObjectFromPath(itemObject, modelPath);

            // When attributes validation fails we should STOP proceeding.
            if (formValidation) {
                if (formValidation.$invalid) {
                    publishDetailModalProcessingEvent(false, true);
                    CPQItemDetailsService.bundleErrors[formValidation.$name] = true;
                    return;
                } else {
                    delete CPQItemDetailsService.bundleErrors[formValidation.$name];
                }
            }

            executeRules = (angular.isDefined(alwaysRunRules) && alwaysRunRules) ? true : field && field.hasRules;

            // saved valid value should be displayed after entering an invalid value and reopen the configPanel 
            updateFieldValue(field);

            if (executeRules) {
                CPQService.invokeAction(modifyAttributesActionObj).then(
                    function(data) {
                        var attributesModified = false;
                        $log.debug('Modified attributes', data);

                        if (data.records.length > 0) {
                            if (data.messages) {
                                attributesModified = _.some(data.messages,function(msg) {
                                    return (msg.code === CPQ_CONST.ATTRIBUTE_MODIFICATION_SUCCESSFUL);
                                });
                            }

                            if (attributesModified) {
                                activeInputElement = document.activeElement;
                                $scope.reRenderAttributesForm = true;

                                // Update attribute categories
                                itemObject.attributeCategories = data.records[0].attributeCategories;

                                // @TODO Expose an api from VDF to support rerender
                                // Run after the current call stack is executed.
                                // Rerenders VDF to reflect new attributes changes
                                $timeout(function() {
                                    $scope.reRenderAttributesForm = false;
                                    $timeout(function() {
                                        $modalContent.scrollTop(scrollPosition);
                                        // fix: Cursor is getting lost when rerender attributes
                                        $('input[name=' + activeInputElement.name + ']').focus();
                                    }, 0);
                                }, 0);
                            }
                        }
                        updateLineItemWithdebounce();

                    }, function(error) {
                        $log.error('Modified attributes response failed', error);
                    });
            } else {
                updateLineItemWithdebounce();
            }

            function updateLineItemWithdebounce() {
                // case of root attributes being saved should have no parent and should be set to null
                var parent = ($scope.$parent.obj.Id.value === itemObject.Id.value) ? null : $scope.$parent.obj;
                if ($scope.$parent.attrs.lineItemModal) {
                    var callFunc = function() {
                        $scope.updateLineField(parent, itemObject, false, false);
                    };
                    if (angular.isObject(debounced)) {
                        $timeout.cancel(debounced);
                    }
                    debounced = $timeout(callFunc, 2000);
                }
            }
        };

        /**
         * config: Launches attributes configuration for line item in cart
         * @param  {object} itemObject
        */
        $scope.config = function(parent, itemObject) {
            var refreshMode = true;
            // Refresh opened vdf in config panel if any, to avoid FOUC. Dont refresh the entire config panel
            $rootScope.$broadcast('vlocity.cpq.config.configpanelenabled', false, null, refreshMode);

            // Run after the current call stack is executed
            $timeout(function() {
                $scope.isSelected = true;
                $scope.isSelectedItemObjId = itemObject.Id;
                // Publishes Event to enable the config panel
                $rootScope.$broadcast('vlocity.cpq.config.configpanelenabled', true, {'parent': parent, 'itemObject': itemObject});
            }, 0);
        };

        $timeout(function() {
            if ($scope.$parent.obj && angular.isUndefined($scope.attrs.lineItemModal)) {
                var itemId = $scope.$parent.obj.Id.value;
                $scope.$parent.$on('vlocity.cpq.cart.item.' + itemId + '.opendetail', function(e, message) {
                    $scope.openDetailView($scope.$parent.obj, message);
                });
            }
        }, 0);

        $scope.openDetailView = function(item, message) {
            CPQItemDetailsService.openDetailModal(angular.copy(item), $scope, detailViewUseAPI, message);
        };

        // Vlocity Dynamic form mapping object2
        $scope.mapObject = function() {
            return {
                'fieldMapping': {
                    'type': 'inputType',
                    'value': 'userValues',
                    'label': 'label',
                    'readonly': 'readonly',
                    'required': 'required',
                    'disabled': 'disabled',
                    'hidden': 'ishidden',
                    'multiple': 'multiselect',
                    'customTemplate': 'customTemplate',
                    'valuesArray': { //multiple values map. Eg: select, fieldset, radiobutton group
                        'field': 'values',
                        'value': 'value',
                        'label': 'label',
                        'disabled': 'disabled'
                    }
                },
                'pathMapping': {
                    'levels': 2,
                    'path': 'productAttributes.records'
                }
            };
        };

        $scope.checkCardinalityForAdd = function(parent, lineItemChildProduct) {
            return CPQCardinalityService.checkCardinalityForAdd(parent, lineItemChildProduct);
        };

        $scope.checkCardinalityForClone = function(parent, lineItemChildProduct) {
            return CPQCardinalityService.checkCardinalityForClone(parent, lineItemChildProduct);
        };

        $scope.checkCardinalityForDelete = function(parent, lineItemChildProduct) {
            return CPQCardinalityService.checkCardinalityForDelete(parent, lineItemChildProduct);
        };

        $scope.checkCardinalityForAddon = function(parent, addonChildProduct) {
            return CPQCardinalityService.checkCardinalityForAddon(parent, addonChildProduct);
        };

        $scope.clone = function(parent, itemObject) {
            setProcessingLine(parent, itemObject, true);
            wrapFunctionCall(clonePromise, [parent, itemObject]);
        };

        /**
         * Same old clone but returns a promise
         * @param {Promise} parent parent of line item object
         * @param {Promise} itemObject line item object
         * @return promise
         */
        var clonePromise = function(parent, itemObject) {
            var deferred = $q.defer();
            var configCloneObject = {'records': [{}]}; // clone API structure
            var deleteArrayList = ['Attachments', 'actions', 'messages', 'childProducts', 'lineItems', 'attributeCategories'];
            var cloneActionObj = itemObject.actions.cloneitem;
            var parentInCardData = parent;
            var parentFromAPI, processingToastMessage, toBeAddedLineItem, actionPromise;
            // Only lineItems could be cloned and they would have the 'PricebookEntry' field.
            var product2Name = itemObject.PricebookEntry.Product2.Name;

            // Only check cardinality if the item being cloned is a non-root lineItem and would therefore have a ParentItemId__c field with value
            if (itemObject[$rootScope.nsPrefix + 'ParentItemId__c'] && itemObject[$rootScope.nsPrefix + 'ParentItemId__c'].value) {

                /*
                    Only lineItems can be cloned and they would be:
                    Required products lineItems and Optional products lineItems (that have been added to cart) will have an clone icon (if cardinality check succeeds)
                        For these products to be cloned, need to use checkCardinalityForAdd()
                */
                var passedCardinality = $scope.checkCardinalityForClone(parentInCardData, itemObject);
                if (!passedCardinality) {
                    $sldsToast({
                        title: toastCustomLabels['CPQCloneItemFailed'] + ' ' + product2Name,
                        content: 'Cardinality error',
                        severity: 'info',
                        icon: 'warning',
                        autohide: true,
                        show: CPQService.toastEnabled('info')
                    });
                    deferred.reject(toastCustomLabels['CPQCloneItemFailed'] + ' ' + product2Name);
                    return deferred.promise;
                }

            }

            // use api settings from CPQSettingsService.getApiSettings() to determine if pricing and validation are required
            cloneActionObj[actionMode].params.price = apiSettings.cloneAPIRequiresPricing;
            cloneActionObj[actionMode].params.validate = apiSettings.cloneAPIRequiresValidation;

            cloneActionObj[actionMode].params.items = [
                {'itemId': itemObject.Id.value}
            ];

            if (parent) {

                configCloneObject.records[0] = angular.copy(parent);
                angular.forEach(deleteArrayList, function(key) {
                    delete configCloneObject.records[0][key];
                });

                cloneActionObj[actionMode].params.items[0].parentRecord = configCloneObject;

            }

            processingToastMessage = $sldsToast({
                message: toastCustomLabels['CPQCloningItem'] + ' ' + product2Name + ' ...',
                severity: 'info',
                icon: 'info',
                show: CPQService.toastEnabled('info')
            });

            $log.debug('cloning obj ', itemObject);
            CPQService.invokeAction(cloneActionObj).then(
                function(data) {
                    processingToastMessage.hide();
                    setProcessingLine(parent, itemObject, false);

                    if (angular.isUndefined(data.records) && data.messages && data.messages.length && data.messages[0].severity === CPQ_CONST.ERROR) {
                        // Display message if Validation Rule fails
                        $sldsToast({
                            content: data.messages[0].message,
                            severity: 'error',
                            icon: 'warning',
                            autohide: true,
                            show: CPQService.toastEnabled('error')
                        });
                    } else {
                        $sldsToast({
                            backdrop: 'false',
                            message: toastCustomLabels['CPQClonedItem'] + ' ' + product2Name,
                            severity: 'success',
                            icon: 'success',
                            templateUrl: 'SldsToast.tpl.html',
                            autohide: true,
                            show: CPQService.toastEnabled('success')
                        });
                    }

                    // the root bundle is cloned and the response from API would have a root bundle that has its root being itself (RootItemId__c.value === Id.value)
                    if (data.records && data.records[0][$rootScope.nsPrefix + 'RootItemId__c'] && data.records[0][$rootScope.nsPrefix + 'RootItemId__c'].value &&
                        (data.records[0][$rootScope.nsPrefix + 'RootItemId__c'].value === data.records[0].Id.value)) {

                        // add the whole root bundle to the cart
                        $scope.$parent.$emit('vlocity.cpq.cart.addrecords', data.records);

                    // a lineItem is cloned and a skinny response object is returned with Id, cardinality map, lineItems
                    } else if (data.records) {

                        parentFromAPI = data.records[0];
                        parentInCardData[$rootScope.nsPrefix + 'InCartQuantityMap__c'] = parentFromAPI[$rootScope.nsPrefix + 'InCartQuantityMap__c'];
                        toBeAddedLineItem = parentFromAPI.lineItems.records[0];
                        CPQCardinalityService.insertLineItemToParent(parentInCardData, toBeAddedLineItem);

                        setupViewModel(parentInCardData);

                    }

                    //Cross actions (rollup update prices)
                    if (data.actions) {
                        actionPromise = CPQCartItemCrossActionService.processActions(data.actions);
                        $q.when(actionPromise).then(function(response) {
                            //Reload the total bar after promises are resolved
                            CPQService.reloadTotalBar();
                        });
                    }

                    deferred.resolve(toastCustomLabels['CPQClonedItem'] + ' ' + product2Name);
                },
                function(error) {
                    $log.error(error);
                    processingToastMessage.hide();
                    setProcessingLine(parent, itemObject, false, true);

                    $sldsToast({
                        title: toastCustomLabels['CPQCloneItemFailed'] + ' ' + product2Name,
                        content: error.message,
                        severity: 'error',
                        icon: 'warning',
                        autohide: true,
                        show: CPQService.toastEnabled('error')
                    });
                    deferred.reject(toastCustomLabels['CPQCloneItemFailed'] + ' ' + product2Name);
                });

            return deferred.promise;
        };

        var recordLineItemFieldInvalid = function(invalidList, item) {
            if (!_.includes(invalidList, item.Id.value)) {
                invalidList.push(item.Id.value);
            }
        };

        var recordLineItemQuantityInvalid = function(item) {
            recordLineItemFieldInvalid($scope.lineItemIdsWithInvalidQuantity, item);
        };

        var recordLineItemRecurringDiscountInvalid = function(item) {
            recordLineItemFieldInvalid($scope.lineItemIdsWithInvalidRecurringDiscount, item);
        };

        var recordLineItemOneTimeDiscountInvalid = function(item) {
            recordLineItemFieldInvalid($scope.lineItemIdsWithInvalidOneTimeDiscount, item);
        };

        var recordLineItemFieldValid = function(invalidList, item) {
            if (_.includes(invalidList, item.Id.value)) {
                _.pull(invalidList, item.Id.value);
            }
        };

        var recordLineItemQuantityValid = function(item) {
            recordLineItemFieldValid($scope.lineItemIdsWithInvalidQuantity, item);
        };

        var recordLineItemRecurringDiscountValid = function(item) {
            recordLineItemFieldValid($scope.lineItemIdsWithInvalidRecurringDiscount, item);
        };

        var recordLineItemOneTimeDiscountValid = function(item) {
            recordLineItemFieldValid($scope.lineItemIdsWithInvalidOneTimeDiscount, item);
        };

        var lineFieldValidation = function(item) {
            var msgList = [];
            var label;

            var recurringValue = item[$rootScope.nsPrefix + 'RecurringManualDiscount__c'].value;
            var oneTimeValue = item[$rootScope.nsPrefix + 'OneTimeManualDiscount__c'].value;

            var isRecurringDiscountValid = (angular.isDefined(recurringValue) && recurringValue !== null && recurringValue >= 0 && recurringValue <= 100) ? true : false;
            var isOneTimeDiscountValid = (angular.isDefined(oneTimeValue) && oneTimeValue !== null && oneTimeValue >= 0 && oneTimeValue <= 100) ? true : false;
            var isQuantityValid = (item.Quantity.value && item.Quantity.value >= 1) ? true : false;

            if (!isQuantityValid) {
                label = item.Quantity.label;
                msgList.push(label + ' ' + toastCustomLabels['CPQMustBeGreaterThanZero']);
                // Record the lineItemId has an invalid quantity if it has not been done
                recordLineItemQuantityInvalid(item);
            } else if (item.Quantity.value < item.minQuantity) {
                msgList.push(item.Name + ' ' + toastCustomLabels['CPQCanNotHaveLess'] + ' ' + item.minQuantity + ' ' + toastCustomLabels['CPQQuantity']);
                // Record the lineItemId has an invalid quantity if it has not been done
                recordLineItemQuantityInvalid(item);
            } else if (item.Quantity.value > item.maxQuantity) {
                msgList.push(item.Name + ' ' + toastCustomLabels['CPQCanNotHaveMoreThan'] + ' ' + item.maxQuantity + ' ' + toastCustomLabels['CPQQuantity']);
                // Record the lineItemId has an invalid quantity if it has not been done
                recordLineItemQuantityInvalid(item);
            } else {
                // Record the lineItem valid because previously it may have been marked invalid
                recordLineItemQuantityValid(item);
            }

            if (!isRecurringDiscountValid) {
                label = item[$rootScope.nsPrefix + 'RecurringManualDiscount__c'].label;
                msgList.push(label + ' ' + toastCustomLabels['CPQMustBeGreaterThanOrEqualToZero']);
                recordLineItemRecurringDiscountInvalid(item);
            } else {
                recordLineItemRecurringDiscountValid(item);
            }

            if (!isOneTimeDiscountValid) {
                label = item[$rootScope.nsPrefix + 'OneTimeManualDiscount__c'].label;
                msgList.push(label + ' ' + toastCustomLabels['CPQMustBeGreaterThanOrEqualToZero']);
                recordLineItemOneTimeDiscountInvalid(item);
            } else {
                recordLineItemOneTimeDiscountValid(item);
            }

            return msgList;
        };

        /**
         * updateField: Used for updating fields like quantity and discount
         * @param  {parent} parent of itemObject modified
         * @param  {object} itemObject modified
         */
        $scope.updateLineField = function(parent, itemObject, updateDiscount, updateAttributeData) {
            var errorMessageList = lineFieldValidation(itemObject);
            var itemProcessing;
            itemObject.fieldValidationMessageList = [];
            itemProcessing = updateDiscount ? null : parent;

            if (!errorMessageList || errorMessageList.length === 0) {
                setProcessingLine(itemProcessing, itemObject, true);

                var processingToastMessage = $sldsToast({
                    message: toastCustomLabels['CPQUpdatingItem'] + ' ' + itemObject.PricebookEntry.Product2.Name + ' ...',
                    severity: 'info',
                    icon: 'info',
                    show: CPQService.toastEnabled('info')
                });
                if (angular.isUndefined(updateAttributeData)) {
                    updateAttributeData = true;
                }
                wrapFunctionCall(updateLineFieldPromise, [parent, itemObject, processingToastMessage, updateAttributeData]);
            } else {
                itemObject.fieldValidationMessageList = errorMessageList;
                CPQService.reloadTotalBar(false);
            }
        };

        /**
        *isQuantityEditable : Used for checking disabled condition for Quantity field if max and min quantity are equal
        * @param {item} current object
        * @param {field} current field
        */
        $scope.isQuantityEditable = function(item,fieldName) {
            if ((fieldName === 'Quantity') && (item.minQuantity === item.maxQuantity)) {
                return false;
            } else {
                return true;
            }
        };

        var updateLineFieldPromise = function(parent, itemObject, processingToastMessage, updateAttributeData) {
            var deferred = $q.defer();
            var updateItemsActionObj = {};
            var configUpdateObject = {'records': [{}]}; // Update attributes API structure
            var deleteArrayList = ['Attachments', 'actions', 'messages', 'childProducts', 'lineItems', 'productGroups'];
            var modifiedChildItemObject;
            var parentFromAPI, parentInCardData = parent;
            var updatedLineItemFromAPI, updatedLineItemInCarddata;
            var addonProduct;
            var cardinalityMapAlreadyUpdated;
            var toastMessage;

            if (parent) {
                // update on a lineItem that has a parent
                configUpdateObject.records[0] = angular.copy(parent);
                angular.forEach(deleteArrayList, function(key) {
                    delete configUpdateObject.records[0][key];
                });

                modifiedChildItemObject = angular.copy(itemObject);
                angular.forEach(deleteArrayList, function(key) {
                    delete modifiedChildItemObject[key];
                });

                configUpdateObject.records[0].lineItems = {'records': [modifiedChildItemObject]};
            } else {
                // update on the root which has no parent
                configUpdateObject.records[0] = angular.copy(itemObject);
                angular.forEach(deleteArrayList, function(key) {
                    delete configUpdateObject.records[0][key];
                });
            }

            updateItemsActionObj = itemObject.actions.updateitems;

            // use api settings from CPQSettingsService.getApiSettings() to determine if pricing and validation are required
            updateItemsActionObj[actionMode].params.price = apiSettings.updateAPIRequiresPricing;
            updateItemsActionObj[actionMode].params.validate = apiSettings.updateAPIRequiresValidation;

            //Updated items for both remote and rest
            updateItemsActionObj[actionMode].params.items = configUpdateObject;

            CPQService.invokeAction(updateItemsActionObj).then(
                function(data) {
                    var i,j,modifiedRecords;
                    var hasError = false;
                    var updateSuccessful = false;
                    var errorMsg;
                    var validQuantity = true;

                    $log.debug('Updated line item field', data);

                    processingToastMessage.hide();
                    setProcessingLine(parent, itemObject, false);

                    angular.forEach(data.messages, function(message) {
                        if (message.severity === CPQ_CONST.ERROR) {
                            hasError = true;
                            // HYB-663: The missing attribute messages are already shown in the red message bar at the top,
                            // so showing those messages in toast every time an update is made is not necessary.
                            // Hence, don't display 'This bundle has Errors' error or 'Required attribute missing' error
                            if (message.code !== CPQ_CONST.BUNDLE_HAS_ERRORS && message.code !== CPQ_CONST.EQUIRED_ATTR_MISSING) {
                                // accumulate any error messages
                                errorMsg = errorMsg ? errorMsg + '\n' + message.message : '\n' + message.message;
                            }
                        }
                        if (message.severity === CPQ_CONST.INFO && message.code === CPQ_CONST.UPDATE_SUCCESSFUL) {
                            updateSuccessful = true;
                        }
                    });

                    if (!hasError) {
                        // if there is NO overall error
                        toastMessage = $sldsToast({
                            backdrop: 'false',
                            message: toastCustomLabels['CPQUpdatedItem'] + ' ' + itemObject.PricebookEntry.Product2.Name,
                            severity: 'success',
                            icon: 'success',
                            templateUrl: 'SldsToast.tpl.html',
                            autohide: true,
                            show: CPQService.toastEnabled('success')
                        });

                    // this is the case when update is successful BUT there is other error such as required product attribute missing
                    } else if (updateSuccessful) {

                        if (errorMsg) {
                            // display mixed messages (update successful but encountered error(s) OTHER THAN 'This bundle has Errors' error or 'Required attribute missing' error)
                            toastMessage = $sldsToast({
                                backdrop: 'false',
                                message: toastCustomLabels['CPQUpdatedItem'] + ' ' + itemObject.PricebookEntry.Product2.Name + '\nbut encountered error(s):' + errorMsg,
                                severity: 'warning',
                                icon: 'warning',
                                templateUrl: 'SldsToast.tpl.html',
                                autohide: true,
                                show: CPQService.toastEnabled('warning')
                            });
                        } else {
                            // there is error but they are 'This bundle has Errors' error or 'Required attribute missing' error
                            // that does not need to be displayed
                            toastMessage = $sldsToast({
                                backdrop: 'false',
                                message: toastCustomLabels['CPQUpdatedItem'] + ' ' + itemObject.PricebookEntry.Product2.Name,
                                severity: 'success',
                                icon: 'success',
                                templateUrl: 'SldsToast.tpl.html',
                                autohide: true,
                                show: CPQService.toastEnabled('success')
                            });
                        }

                    } else {

                        // display only error msg(s)
                        toastMessage = $sldsToast({
                            backdrop: 'false',
                            title: itemObject.PricebookEntry.Product2.Name,
                            message: toastCustomLabels['CPQUpdateItemFailed'] + ' ' + itemObject.PricebookEntry.Product2.Name,
                            severity: 'error',
                            icon: 'warning',
                            templateUrl: 'SldsToast.tpl.html',
                            autohide: true,
                            show: CPQService.toastEnabled('error')
                        });

                    }

                    // root is updated when the response has no lineItems and (no parentItemId (in modal) or parentItemId is null (in cart)
                    if (!data.records[0].lineItems && (!data.records[0][$rootScope.nsPrefix +
                        'ParentItemId__c'] || !data.records[0][$rootScope.nsPrefix + 'ParentItemId__c'].value)) {

                        // copy fields including messages
                        updatedLineItemFromAPI = data.records[0];
                        updatedLineItemInCardData = itemObject;
                        if (updatedLineItemFromAPI.messages) {
                            updatedLineItemInCardData.messages = updatedLineItemFromAPI.messages;
                        }
                        copyUpdatableFields(updatedLineItemInCardData, updatedLineItemFromAPI, updateAttributeData);

                    // non-root is updated
                    } else {

                        // copy fields including messages
                        parentFromAPI = data.records[0];
                        updatedLineItemFromAPI = data.records[0].lineItems.records[0];
                        updatedLineItemInCardData = CPQCardinalityService.findLineItem(updatedLineItemFromAPI.Id.value, parentInCardData.lineItems.records);
                        if (updatedLineItemFromAPI.message) {
                            updatedLineItemInCardData.messages = updatedLineItemFromAPI.messages;
                        }
                        //API knows best
                        if (parentFromAPI.messages) {
                            parentInCardData.messages = parentFromAPI.messages;
                        }

                        // Attempted quantity change of lineItem must have violated Group cardinality check since the UI
                        // has checked for PCI cardinality violation via lineFieldValidation() in this controller
                        if (parentFromAPI.messages && parentFromAPI.messages.length && parentFromAPI.messages[0].code === CPQ_CONST.INVALID_QUANTITY) {
                            // then record the quantity invalid if it has not been done before
                            validQuantity = false;
                            recordLineItemQuantityInvalid(updatedLineItemFromAPI);

                        // this is the case when update is successful BUT there is other error such as required product attribuyte missing
                        } else if (updateSuccessful) {

                            parentInCardData[$rootScope.nsPrefix + 'InCartQuantityMap__c'] = parentFromAPI[$rootScope.nsPrefix + 'InCartQuantityMap__c'];
                            copyUpdatableFields(updatedLineItemInCardData, updatedLineItemFromAPI, updateAttributeData);

                            // Now that update is successful, lineItem Quantity field must have passed Group cardinality check by API,
                            // so mark it valid in case it was invalid before
                            recordLineItemQuantityValid(updatedLineItemFromAPI);

                        }

                    }

                    deferred.resolve(toastCustomLabels['CPQUpdatedItem'] + ' ' + itemObject.PricebookEntry.Product2.Name);

                    // Cross actions
                    if (data.actions) {
                        CPQCartItemCrossActionService.processActions(data.actions);
                    }

                    // Cross line item configuration rules
                    // @TODO: 1. Avoid using rootscope but we have multiple layouts and modal.
                    // @TODO: 2. Event intensive function for cross update. Find the better and optmized solution
                    if (data.records.length > 1) {
                        if (data.actions.itemupdated) {
                            modifiedRecords = data.actions.itemupdated.client.params.items;

                            angular.forEach(modifiedRecords, function(modifiedItem) {
                                for (i = 0, j = data.records.length;i < j; i++) {
                                    if (modifiedItem.Id === data.records[i].Id.value) {
                                        if (itemObject.productHierarchyPath.split('<')[0] === data.records[i].productHierarchyPath.split('<')[0]) {
                                            //If the update is for item inside the modal root item or just the modal root item
                                            //Publish an event for modal only
                                            $rootScope.$broadcast('vlocity.cpq.cartitem.modal.crossupdate', data.records[i]);
                                        } else {
                                            //Publish a cross update event for cart item object not available in modal
                                            $rootScope.$broadcast('vlocity.cpq.cartitem.crossupdate', data.records[i]);
                                        }
                                        break;
                                    }
                                }
                            });
                        }
                    }

                    if ($scope.isSelected) {
                        // Publish an event to update data if enabled for this item
                        $rootScope.$broadcast('vlocity.cpq.config.configpanelenabled', true, {'parent': parent, 'itemObject': itemObject});
                    }
                    lineFieldValidation(itemObject);
                    //Reload the total bar
                    if (validQuantity) {
                        CPQService.reloadTotalBar();
                    }
                },
                function(error) {
                    $log.error(error);
                    processingToastMessage.hide();
                    setProcessingLine(parent, itemObject, false, true);

                    $sldsToast({
                        backdrop: 'false',
                        title: toastCustomLabels['CPQUpdateItemFailed'] + ' ' + itemObject.PricebookEntry.Product2.Name,
                        message: error.message,
                        severity: 'error',
                        icon: 'warning',
                        autohide: true,
                        show: CPQService.toastEnabled('error')
                    });
                    deferred.reject(toastCustomLabels['CPQUpdateItemFailed'] + ' ' + itemObject.PricebookEntry.Product2.Name);
                });
            return deferred.promise;
        };

        function wrapFunctionCall(call, args) {
            args = Array.isArray(args) ? args : [args];
            PromiseQueueFactory.addTask(call, args);
            PromiseQueueFactory.executeTasks();
        }

        function publishDetailModalProcessingEvent(submit, error) {
            if (CPQItemDetailsService.isDetailModalOpen) {
                CPQItemDetailsService.setProcessingFlag(submit, error);
            }
        }

        function setProcessingLine(parent, obj, value, error) {
            // Publish an event to disable Close button in preview modal
            publishDetailModalProcessingEvent(value, error);

            // Publish an event to disable Details button  while processing
            $scope.$emit('vlocity.cpq.cartitem.actions', 'processing', {'status': value});

            obj.processingLine = value;
            if (parent && parent.lineItems && parent.lineItems.records) {
                angular.forEach(parent.lineItems.records, function(lineItem) {
                    lineItem.processingLine = value;
                });
            }

            if (parent && parent.childProducts && parent.childProducts.records) {
                angular.forEach(parent.childProducts.records, function(child) {
                    child.processingLine = value;
                });
            }
        }

        // * MACD support * //
        /*
            If Order was created from Asset - provisioning status for this Order should be 'Active'.
            If status is 'Active' MACD functionality should be applied.
            If line item was deleted from Order - provisioning status will be changed to 'Deleted'.
            If provisioning status is 'Deleted' then disable all inputs and all actions on line item.

            For more information please read https://vlocity.atlassian.net/wiki/display/ED/ABO+Design
        */
        $scope.isProvisioningStatusDeleted = function(item, parentPsDeleted) {
            return (item.provisioningStatus && item.provisioningStatus.toLowerCase() === 'deleted' || parentPsDeleted === 'true') ? true : false;
        };

        var isProvisioningStatusActive = function(item) {
            return (item.provisioningStatus && item.provisioningStatus.toLowerCase() === 'active') ? true : false;
        };

        $scope.isPromoActionDisconnect = function(item) {
            return (item.Action && item.Action.toLowerCase() === 'disconnect') ? true : false;
        };

        $scope.isAsset = function(item, fieldName, parentPsDeleted) {
            return ($scope.isProvisioningStatusDeleted(item,parentPsDeleted) || CPQService.isAsset(item,fieldName)) ? true : false;
        };

        // * End MACD support * //

        /**
        *checkQuantityField : Used for checking calling service for prevent decimal character in quantity fields
        * @param {field} current field
        * @param {key} key pressed by user
        */

        $scope.checkQuantityField = function(field, key) {
            if (field === 'Quantity') {
                CPQService.setIntegerOnlyFields(key);
            }
        };

        $scope.addToCart = function(parent, obj) {
            $log.debug('add to cart obj ',obj);
            setProcessingLine(parent, obj, true);

            var product2Name = (obj.itemType === 'lineItem') ? obj.PricebookEntry.Product2.Name : obj.Product2.Name;
            var processingToastMessage = $sldsToast({
                message: toastCustomLabels['CPQAddingItem'] + ' ' + product2Name + ' ...',
                severity: 'info',
                icon: 'info',
                show: CPQService.toastEnabled('info')
            });
            wrapFunctionCall(addToCartPromise, [parent, obj, processingToastMessage]);
        };

        /**
         * Same old add to cart but returns a promise
         * @param {Promise} parent parent of line item object
         * @param {Promise} obj line item object
         * @return promise
         */
        var addToCartPromise = function(parent, obj, processingToastMessage) {
            var actionPromise;
            var deferred = $q.defer();
            var configAddObject = {'records': [{}]}; // addToCart attributes API structure
            var deleteArrayList = ['Attachments', 'actions', 'messages', 'childProducts', 'lineItems', 'attributeCategories'];
            var addItemActionObj = obj.actions.addtocart;
            var parentInCardData = parent;
            var toBeAddedLineItem;
            var parentFromAPI;
            var itemMessages = [];
            var autoReplaceMsg = {};
            var beforeAddToCartHookPayload = {
                'parent': parent,
                'obj' : obj
            };
            var afterAddToCartHookPayload = {
                'parent': parent,
                'obj' : obj
            };

            // If obj to be added has itemType as 'lineItem', then it is a lineItem inside lineItems array.  Otherwise it is an Addon inside childProducts array.
            var product2Name = (obj.itemType === 'lineItem') ? obj.PricebookEntry.Product2.Name : obj.Product2.Name;

            /*
                In this addToCart, indeed there are two kind of objects that can be added:
                1) Required products lineItems and Optional products lineItems (that have been added to cart) will have an + icon (if cardinality check succeeds)
                    For these products to be added again, need to use checkCardinalityForAdd()
                2) Optional products (minQuantity=0) that are not added to cart. In this case, they should be using checkCardinalityForAddon()
                To detect case 1: check if (obj.itemType === 'lineItem'): they are in lineItems
                To detect case 2: check if (obj.itemType === 'childProducts'): they are in childProducts
            */
            var passedCardinality = (obj.itemType === 'lineItem') ? $scope.checkCardinalityForAdd(parentInCardData, obj) : $scope.checkCardinalityForAddon(parentInCardData, obj);
            if (!passedCardinality) {
                processingToastMessage.hide();
                setProcessingLine(parent, obj, false);
                $sldsToast({
                    title: toastCustomLabels['CPQAddItemFailed'] + ' ' + product2Name,
                    content: 'Cardinality error',
                    severity: 'info',
                    icon: 'warning',
                    autohide: true,
                    show: CPQService.toastEnabled('info')
                });
                deferred.reject(toastCustomLabels['CPQAddItemFailed'] + ' ' + product2Name);
                return deferred.promise;
            }

            $scope.beforeAddToCartHook(beforeAddToCartHookPayload);

            configAddObject.records[0] = angular.copy(parent);
            angular.forEach(deleteArrayList, function(key) {
                delete configAddObject.records[0][key];
            });

            // use api settings from CPQSettingsService.getApiSettings() to determine if pricing and validation are required
            addItemActionObj[actionMode].params.price = apiSettings.addToCartAPIRequiresPricing;
            addItemActionObj[actionMode].params.validate = apiSettings.addToCartAPIRequiresValidation;

            addItemActionObj[actionMode].params.items[0].parentRecord = configAddObject;

            $log.debug('adding obj ', obj);
            CPQService.invokeAction(addItemActionObj).then(
                function(data) {
                    $log.debug(data);
                    processingToastMessage.hide();
                    setProcessingLine(parent, obj, false);

                    if (angular.isUndefined(data.records) && data.messages && data.messages.length && data.messages[0].severity === CPQ_CONST.ERROR) {
                        // Display message if Validation Rule fails
                        $sldsToast({
                            content: data.messages[0].message,
                            severity: 'error',
                            icon: 'warning',
                            autohide: true,
                            show: CPQService.toastEnabled('error')
                        });
                    }

                    if (data.actions) {
                        //gathering the messages

                        // if both itemadded and itemdeleted actions exist, this is a case of auto-replace
                        if (data.actions.itemadded && data.actions.itemdeleted) {
                            autoReplaceMsg.message = toastCustomLabels['CPQAutoReplaceItem'];
                            itemMessages = itemMessages.concat(autoReplaceMsg);
                        // if only itemadded action exist, this is a case of straight forward add
                        } else {
                            $sldsToast({
                                backdrop: 'false',
                                message: toastCustomLabels['CPQAddedItem'] + ' ' + product2Name,
                                severity: 'success',
                                icon: 'success',
                                templateUrl: 'SldsToast.tpl.html',
                                autohide: true,
                                show: CPQService.toastEnabled('success')
                            });
                        }

                        if (data.actions.itemadded) {
                            itemMessages = itemMessages.concat(data.actions.itemadded.client.params.items);
                        }
                        if (data.actions.itemdeleted) {
                            itemMessages = itemMessages.concat(data.actions.itemdeleted.client.params.items);
                        }

                        angular.forEach(itemMessages, function(item) {
                            $sldsToast({
                                backdrop: 'false',
                                message: item.message,
                                severity: 'success',
                                icon: 'success',
                                templateUrl: 'SldsToast.tpl.html',
                                autohide: true,
                                show: CPQService.toastEnabled('success')
                            });
                        });
                    } else {
                        $sldsToast({
                            backdrop: 'false',
                            message: toastCustomLabels['CPQAddedItem'] + ' ' + (obj.name || obj.Name.value),
                            severity: 'success',
                            icon: 'success',
                            templateUrl: 'SldsToast.tpl.html',
                            autohide: true,
                            show: CPQService.toastEnabled('success')
                        });
                    }

                    if (data.records) { parentFromAPI = data.records[0]; }

                    // if auto-delete rule is fired, then there would not be lineItems
                    if (parentFromAPI && parentFromAPI.lineItems) {

                        // We must copy the entire map object (not just value property) in addToCart because for a parent
                        // with ONLY optional products with defaultQuantity=0 (in main cart), there is NO map to start with.  The entire map
                        // is needed for subsequent update of any of its children.  The updateItemsAPI expects all properties
                        // of the map to be passed to it
                        parentInCardData[$rootScope.nsPrefix + 'InCartQuantityMap__c'] = parentFromAPI[$rootScope.nsPrefix + 'InCartQuantityMap__c'];
                        toBeAddedLineItem = parentFromAPI.lineItems.records[0];
                        CPQCardinalityService.insertLineItemToParent(parentInCardData, toBeAddedLineItem);

                        // if parent is Collapsable field, use broadcast to update view model because of scope issue
                        if (parentInCardData.actions && parentInCardData.actions.getproducts) {
                            $rootScope.$broadcast('vlocity.cpq.cartitem.actions', 'viewmodel', {'item': parentInCardData});
                        } else {
                            setupViewModel(parentInCardData);
                        }
                    }

                    afterAddToCartHookPayload.data = data;

                    //Cross actions
                    if (data.actions) {
                        actionPromise = CPQCartItemCrossActionService.processActions(data.actions);
                        $q.when(actionPromise).then(function(response) {
                                if (response && response.messages && response.messages.length > 0) {
                                    $sldsToast({
                                        backdrop: 'false',
                                        message: response.messages[0].message,
                                        severity: 'error',
                                        icon: 'info',
                                        templateUrl: 'SldsToast.tpl.html',
                                        autohide: true,
                                        show: CPQService.toastEnabled('error')
                                    });
                                }
                                //Reload the total bar after promises are resolved
                                CPQService.reloadTotalBar();
                                afterAddToCartHookPayload.response = response;
                                $scope.afterAddToCartHook(afterAddToCartHookPayload);
                            }, function(error) {
                                //Passing undefined as second argument to be consistent 
                                //with the order of args: data, response, error
                                afterAddToCartHookPayload.error = error;
                                afterAddToCartHookPayload.response = undefined;
                                $scope.afterAddToCartHook(afterAddToCartHookPayload);
                            }
                        );
                    } else {
                        //Reload the total bar
                        CPQService.reloadTotalBar();
                        $scope.afterAddToCartHook(afterAddToCartHookPayload);
                    }

                    deferred.resolve(toastCustomLabels['CPQAddedItem'] + ' ' + product2Name);
                },
                function(error) {
                    $log.error(error);
                    processingToastMessage.hide();
                    setProcessingLine(parent, obj, false, true);

                    $sldsToast({
                        title: toastCustomLabels['CPQAddItemFailed'] + ' ' + product2Name,
                        content: error.message,
                        severity: 'error',
                        icon: 'warning',
                        autohide: true,
                        show: CPQService.toastEnabled('error')
                    });
                    deferred.reject(toastCustomLabels['CPQAddItemFailed'] + ' ' + product2Name);
                });

            return deferred.promise;
        };

        /**
         * applyDelete : Used for selecting the line item to be deleted
         * @param  {records} All the records present in deleteModal
         * @param  {actions} Actions for the records
         */
        $scope.applyDelete = function(records,actions) {
            var selectedItemIds;
            var lineItems;
            var configDeleteObject;
            if (actions.configdelete) {
                selectedItemIds = '';
                lineItems = records[0].toBeDisconnectedServices.records;
                angular.forEach(lineItems,function(lineItem) {
                    if (lineItem.isSelected) {
                        if (selectedItemIds !== '') {
                            selectedItemIds += ',' + lineItem.itemId;
                        } else {
                            selectedItemIds += '' + lineItem.itemId;
                        }
                    }
                });
                if (selectedItemIds === '') {
                    completeDelete();
                } else {
                    _.assign(actions.configdelete.remote.params,{id:selectedItemIds});
                    configDeleteObject = actions.configdelete;
                    CPQService.invokeAction(configDeleteObject).then(function(data) {
                        openModal(data);
                    });
                }
            } else {
                completeDelete();
            }

            function completeDelete() {
                CPQService.invokeAction(actions.completedelete).then(function(data) {
                    $rootScope.$broadcast('vlocity.cpq.cart.reload');
                });
            }
        };

        function openModal(data) {
            var modalScope = $scope.$new();
            modalScope.records = data.records;
            modalScope.actions = data.actions;
            $sldsModal({
                backdrop: 'static',
                scope: modalScope,
                templateUrl: 'CPQCartItemDelete.tpl.html',
                show: true,
            });
        }

        /**
         * delete : Used for deleting the line item in the cart
         * @param  {object} parent of line item object
         * @param  {object} itemObject line item object
         * @param  {boolean} isConfirmationModal True by default.
         */
        $scope.delete = function(parent, itemObject, isConfirmationModal) {
            var deletePrompt, configDeleteObject;
            var enableAdvancedDelete = featureSettings.enableAdvancedDelete;

            function deleteItem() {
                var deleteItemActionObjName = 'deleteitem';
                setProcessingLine(parent, itemObject, true);

                var processingToastMessage = $sldsToast({
                    backdrop: 'false',
                    message: toastCustomLabels['CPQDeletingItem'] + ' ' + itemObject.PricebookEntry.Product2.Name + ' ...',
                    severity: 'info',
                    icon: 'info',
                    autohide: true,
                    show: CPQService.toastEnabled('info')
                });
                $scope.isDeleting = !isProvisioningStatusActive(itemObject);
                wrapFunctionCall(deletePromise, [parent, itemObject, processingToastMessage, deleteItemActionObjName]);
            }

            function deletePrompt() {
                deletePrompt = $sldsPrompt({
                    title: toastCustomLabels['CPQDeleteItem'],
                    content: toastCustomLabels['CPQDeleteItemConfirmationMsg'] + '<br/><br/>' + itemObject.PricebookEntry.Product2.Name,
                    theme: 'error',
                    show: true,
                    buttons: [{
                        label: toastCustomLabels['CPQCancel'],
                        type: 'neutral',
                        action: function() {
                            deletePrompt.hide();
                        }
                    }, {
                        label: toastCustomLabels['CPQDeleteButtonLabel'],
                        type: 'destructive',
                        action: function() {
                            deletePrompt.hide();
                            deleteItem();
                        }
                    }]
                });
            }

            function checkConfirmationModal() {
                if (isConfirmationModal) {
                    deletePrompt();
                } else {
                    deleteItem();
                }
            }

            //Disable confirmation prompt when isConfirmationModal is set to false
            if (angular.isUndefined(isConfirmationModal)) {
                isConfirmationModal = true;
            }

            if (enableAdvancedDelete) {
                configDeleteObject = itemObject.actions.configdelete;
                CPQService.invokeAction(configDeleteObject).then(function(data) {
                    if (data.records) {
                        angular.forEach(data.records[0].toBeDisconnectedServices.records, function(record) {
                            _.assign(record,{isSelected : false});
                        });
                        openModal(data);
                    } else {
                        checkConfirmationModal();
                    }
                });
            } else {
                checkConfirmationModal();
            }

        };

        var deletePromise = function(parent, itemObject, processingToastMessage, deleteItemActionObjName) {
            var addonProduct, childProductsRecord;
            var deferred = $q.defer();
            var configDeleteObject = {'records': [{}]}; // delete API structure
            var deleteArrayList = ['Attachments', 'actions', 'messages', 'childProducts', 'lineItems', 'attributeCategories'];
            var deleteActionObj = {};
            var provisioningStatusActive = false;
            var parentInCardData = parent;
            var cardinalityMapAlreadyUpdated = false;
            var beforeDeleteItemFromCartHookPayload = {
                'parent': parent,
                'itemObject': itemObject
            };
            var afterDeleteItemFromCartHookPayload = {
                'parent': parent,
                'itemObject': itemObject
            };
            $scope.beforeDeleteItemFromCartHook(beforeDeleteItemFromCartHookPayload);

            //Pass the deleteitem actionObject
            deleteActionObj = itemObject.actions[deleteItemActionObjName];

            deleteActionObj[actionMode].params.price = apiSettings.deleteAPIRequiresPricing;
            deleteActionObj[actionMode].params.validate = apiSettings.deleteAPIRequiresValidation;

            if (parent) {

                configDeleteObject.records[0] = angular.copy(parent);
                angular.forEach(deleteArrayList, function(key) {
                    delete configDeleteObject.records[0][key];
                });

                deleteActionObj[actionMode].params.items = [{'parentRecord':{}}];
                deleteActionObj[actionMode].params.items[0].parentRecord = configDeleteObject;
            }

            // Publish an event to close the config panel if enabled for this item
            if ($scope.isSelected) {
                $rootScope.$broadcast('vlocity.cpq.config.configpanelenabled', false);
            }

            CPQService.invokeAction(deleteActionObj).then(function(data) {
                var sldsToastSettings = {};
                var hasError = false;
                var updateSuccessful = false;
                processingToastMessage.hide();
                setProcessingLine(parent, itemObject, false);
                if (data.messages) {
                    updateSuccessful = _.some(data.messages, function(message) {
                        return (message.severity === CPQ_CONST.INFO && message.code === CPQ_CONST.DELETE_SUCCESSFUL);
                    });
                }

                //Show the deleted item back in UI in case of an error
                $scope.isDeleting = updateSuccessful ? !isProvisioningStatusActive(itemObject) : false;

                angular.forEach(data.messages, function(message, index) {
                    if (message.severity === CPQ_CONST.ERROR) {
                        hasError = true;

                        sldsToastSettings = {
                            backdrop: 'false',
                            content: data.messages[index].message,
                            severity: 'error',
                            icon: 'warning',
                            templateUrl: 'SldsToast.tpl.html',
                            autohide: true,
                            show: CPQService.toastEnabled('error')
                        };

                        if (!updateSuccessful) {
                            sldsToastSettings.message = toastCustomLabels['CPQDeleteItemFailed'] + ' ' + itemObject.PricebookEntry.Product2.Name;
                        }

                        $sldsToast(sldsToastSettings);
                        deferred.reject(toastCustomLabels['CPQDeleteItemFailed'] + ' ' + itemObject.PricebookEntry.Product2.Name);
                    }
                });

                if (data.actions) {
                    //gathering the messages
                    var itemMessages = [];
                    if (data.actions.itemadded) {
                        itemMessages = itemMessages.concat(data.actions.itemadded.client.params.items);
                    }
                    if (data.actions.itemdeleted) {
                        itemMessages = itemMessages.concat(data.actions.itemdeleted.client.params.items);
                    }

                    angular.forEach(itemMessages, function(item) {
                        $sldsToast({
                            backdrop: 'false',
                            message: item.message,
                            severity: 'success',
                            icon: 'success',
                            templateUrl: 'SldsToast.tpl.html',
                            autohide: true,
                            show: CPQService.toastEnabled('success')
                        });
                    });
                }

                if (!hasError || updateSuccessful) {
                    //reset pagination
                    if ($scope.$parent.attrs.isLast) {
                        $log.debug('deleting last item - reset pagination');
                        $scope.$parent.$emit('vlocity.cpq.cart.resetpagination',{index: $scope.$parent.cardIndex});
                    }

                    $sldsToast({
                        backdrop: 'false',
                        message: toastCustomLabels['CPQDeletedItem'] + ' ' + itemObject.PricebookEntry.Product2.Name,
                        severity: 'success',
                        icon: 'success',
                        autohide: true,
                        show: CPQService.toastEnabled('success')
                    });

                    // root product bundle that HAS NOT BEEN assetized is deleted
                    if (!data.records || data.records.length === 0) {
                        $scope.$parent.$emit('vlocity.cpq.cart.removerecords', $scope.$parent);
                        // Publish an event to close the child config panel
                        $rootScope.$broadcast('vlocity.cpq.config.configpanelenabled', false);
                    } // root product bundle that HAS BEEN assetized is deleted
                    else if ($scope.isProvisioningStatusDeleted(data.records[0])) {
                        _.assign(itemObject, data.records[0]);
                        $scope.$parent.$broadcast('vlocity.cpq.cartitem.actions', 'viewmodel', {'item': itemObject});
                    } else {
                        // non-root lineItem is deleted (can be either assetized or not assetized)

                        // provisioning status can be Active only if lineItem is assetized
                        if (isProvisioningStatusActive(itemObject)) {
                            // non-root lineItem that HAS BEEN assetized is deleted
                            _.assign(itemObject, data.records[0].lineItems.records[0]);
                            $scope.$parent.$broadcast('vlocity.cpq.cartitem.actions', 'viewmodel', {'item': itemObject});
                            provisioningStatusActive = true;
                        }

                        // if there is another instance of the same product type to be deleted in lineItems, API would not return addonProduct
                        childProductsRecord = data.records[0].childProducts;
                        addonProduct = childProductsRecord ? childProductsRecord.records[0] : null;

                        CPQCardinalityService.deleteLineItem(parentInCardData, itemObject, addonProduct, cardinalityMapAlreadyUpdated, provisioningStatusActive);
                        setupViewModel(parentInCardData);

                        // This is the use case when something gets auto-added in the cart and you try to delete it
                        // without deleting the triggering product before. Example: 10kw auto-includes 750kw and
                        // every time user would try to delete 750kw it would say deleted successfully but on
                        // the refresh it would show the product is back, this is because validation re-auto-adds the product.
                        // In my opinion the API should give us a flag to distinguish these usecases but in the meantime
                        // this is the logic that works.
                        if (parentInCardData) {
                            if (data.records.length > 0 && parentInCardData.Id.value === itemObject.Id.value && !$scope.isProvisioningStatusDeleted(parentInCardData)) {
                                $scope.$parent.$emit('vlocity.cpq.cart.addrecords', data.records);
                            }
                        }
                    }

                    //Cross actions
                    if (data.actions) {
                        CPQCartItemCrossActionService.processActions(data.actions);
                    }

                    afterDeleteItemFromCartHookPayload.data = data;
                    $scope.afterDeleteItemFromCartHook(afterDeleteItemFromCartHookPayload);

                    deferred.resolve(toastCustomLabels['CPQDeletedItem'] + ' ' + itemObject.PricebookEntry.Product2.Name);
                }
            },
            function(error) {
                $scope.isDeleting = false;
                setProcessingLine(parent, itemObject, false, true);

                $sldsToast({
                    backdrop: 'false',
                    title: toastCustomLabels['CPQDeleteItemFailed'] + ' ' + itemObject.PricebookEntry.Product2.Name,
                    content: error.message,
                    severity: 'error',
                    icon: 'warning',
                    autohide: true,
                    show: CPQService.toastEnabled('error')
                });
                $log.error(error);
                deferred.reject(toastCustomLabels['CPQDeleteItemFailed'] + ' ' + itemObject.PricebookEntry.Product2.Name);
            });
            return deferred.promise;
        };

        /* Before/After Hooks */
        $scope.beforeAddToCartHook = function(beforeAddToCartHookPayload) {};

        $scope.afterAddToCartHook = function(afterAddToCartHookPayload) {};

        $scope.beforeDeleteItemFromCartHook = function(beforeDeleteItemFromCartHookPayload) {};

        $scope.afterDeleteItemFromCartHook = function(afterDeleteItemFromCartHookPayload) {
            //Reload the total bar
            CPQService.reloadTotalBar();
        };

        $scope.getAlternativePaymentFieldMapHook = function(data) {
            return CPQAdjustmentService.getAlternativePaymentFieldMap();
        };
        /* End */

        /* DO NOT REMOVE !!! */

        // Add this function in order to override controller
        // Using controllerName, generated by $controller decorator (HybridCPQ.js)
        var overrideFunctionList = ['beforeAddToCartHook', 'afterAddToCartHook', 'beforeDeleteItemFromCartHook', 'afterDeleteItemFromCartHook',
                                    'getAlternativePaymentFieldMapHook'];
        CPQOverrideService.addControllerCallback($scope.controllerName, overrideFunctionList, function(a){eval(a);});

        /* END */
    }
]);

},{}],7:[function(require,module,exports){
angular.module('hybridCPQ')
.controller('CPQCartItemDetailsController', ['$scope', '$log', 'CPQService', function($scope, $log, CPQService) {

        $scope.cartDataStore = CPQService.dataStore;

        /*********** CPQ CART ITEM DETAILS EVENTS ************/
        var unbindEvents = [];

        unbindEvents[unbindEvents.length] = $scope.$watchCollection('cartDataStore.messages', function(newMessages, oldMessages) {
            CPQService.applyMessages($scope, newMessages, oldMessages); //needs scope to access $parent.records
        });

        $scope.$on('$destroy', function() {
            //Removes all listeners
            unbindEvents.forEach(function (fn) {
                fn();
            });
        });

        /********* END CPQ CART ITEM DETAILS EVENTS **********/
    }
]);

},{}],8:[function(require,module,exports){
angular.module('hybridCPQ')
.controller('CPQController', ['$scope', '$rootScope', '$log', '$timeout', '$q', 'pageService', 'dataService', 'CPQResponsiveHelper', 'CPQSettingsService', 'CPQStreamingChannelService',
    function($scope, $rootScope, $log, $timeout, $q, pageService, dataService, CPQResponsiveHelper, CPQSettingsService, CPQStreamingChannelService) {

    var customSettingFields = ['CpqConfigurationSetup__c', 'VlocityFeature__c'];

    var cancelOrderRetrySuccessfulCallback = function(message) {
        $log.info('******* /u/notifications/vlocity/cpq/CancelOrderRetrySuccessful message: '); 
        $log.info(message);
    };

    CPQStreamingChannelService.subscribeToChannel('/u/notifications/vlocity/cpq/CancelOrderRetrySuccessful', cancelOrderRetrySuccessfulCallback);

    $scope.params = pageService.params;
    $scope.isMobileTablet = CPQResponsiveHelper.mobileTabletDevice;

    $rootScope.cartId = $scope.params.id;

    //Config panel is hidden on page load
    $scope.isConfigAttrsPanelEnabled = false;
    // showProductList is different on tablet and desktop:
    $scope.showProductList = false;
    if ($scope.isMobileTablet) {
        $scope.showProductList = true;
    }

    /*********** CPQ CONTROLLER EVENTS ************/

    $scope.$on('cpq-non-cart-tab-selected', function(e, data) {
        if (data === 'false') {
            data = false;
        } else {
            data = true;
        }
        $scope.showProductList = true;
        $rootScope.cartPreviousLeftColState = data;
    });

    $scope.$on('cpq-cart-tab-selected', function() {
        if ($rootScope.cartPreviousLeftColState !== undefined) {
            $scope.showProductList = $rootScope.cartPreviousLeftColState;
        }
    });

    $scope.$on('cpq-hide-product-list', function() {
        $scope.showProductList = true;
    });

    // Event listener to enable the config panel
    $scope.$on('vlocity.cpq.config.configpanelenabled', function(event, isConfigEnabled, itemObject, refreshMode) {
        // If the config panel is open and refreshMode is true, don't close the config panel. It avoids the FOUC.
        if (!(refreshMode && $scope.isConfigAttrsPanelEnabled)) {
            $scope.isConfigAttrsPanelEnabled = isConfigEnabled;
        }
    });

    /*********** END CPQ CONTROLLER EVENTS ************/

    $scope.featureSettings = CPQSettingsService.getFeatureSettings();
    CPQSettingsService.registerListener(updateFeatureSettings);

    function updateFeatureSettings(settings) {
        $scope.featureSettings = settings;
    }

    $scope.init = function() {
        $log.debug('Initializing the CPQController');
        if (typeof Visualforce !== 'undefined') {
            $rootScope.forcetkClient = new forcetk.Client();
            $rootScope.forcetkClient.setSessionToken(sessionId);
        }
    };

    $scope.toggleOutsideCols = function() {
        if ($scope.isConfigAttrsPanelEnabled) {
            $scope.isConfigAttrsPanelEnabled = false;
            // Set isSelected to false, and refreshMode to true:
            $timeout(function() {
                $rootScope.$broadcast('vlocity.cpq.config.configpanelenabled', false, null, true);
            }, 250); // half second css transition we need to wait on
            if ($scope.showProductList && !$scope.isMobileTablet) {
                $scope.showProductList = !$scope.showProductList;
            }
        } else {
            $scope.showProductList = !$scope.showProductList;
        }
    };

    $q.all(customSettingFields.map(function (field) {
        // Return promise that $q.all() can resolve.
        return dataService.getCustomSettings($rootScope.nsPrefix + field).then(
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
    }))
    .then(function () {
        $scope.customSettings = CPQSettingsService.getCustomSettings();
        //Setting the value $rootScope.enableLoyaltyPoints so that it can be accessed in cards designer for filtering of states
        $rootScope.enableLoyaltyPoints = $scope.customSettings.EnableLoyaltyPoints ? ($scope.customSettings.EnableLoyaltyPoints.toLowerCase() === 'true') : false;
    });

}]);

},{}],9:[function(require,module,exports){
angular.module('hybridCPQ')
.controller('CPQItemsController', ['$scope', '$rootScope', '$log', '$sldsModal', 'CPQService', 'CPQSettingsService', 'CPQProductPromoListService',
    function($scope, $rootScope, $log, $sldsModal, CPQService, CPQSettingsService, CPQProductPromoListService) {

    var apiSettings, actionMode;
    var selectedTab;
    var savedSearchTerm = [];
    actionMode = CPQService.actionMode;

    $scope.featureSettings = CPQSettingsService.getFeatureSettings();
    apiSettings = CPQSettingsService.getApiSettings();

    $scope.promotionsTab = 'promotions';
    $scope.productsTab = 'products';
    $scope.productsToAdd = [];
    $scope.productsToCompare = [];
    $scope.showList = {};
    $scope.showList[$scope.productsTab] = true; //By default shows product list
    selectedTab = $scope.productsTab;
    /*********** CPQ LEFTSIDEBAR EVENTS ************/
    var unbindEvents = [];

    unbindEvents[unbindEvents.length] = $scope.$on('vlocity.cpq.leftsidebar.search.items', function(event, searchTerm, selectedTab) {
        var params = {};
        params.query = searchTerm;
        savedSearchTerm[selectedTab] = searchTerm;

        if ($scope.$parent.data.dataSource) {
            if (selectedTab === event.currentScope.$parent.attrs.tabview) {
                // search does not require pagination parameters
                delete $scope.$parent.data.dataSource.value.inputMap.lastRecordId; // from product pagination
                delete $scope.$parent.data.dataSource.value.inputMap.offsetSize; // from promotion pagination
                $scope.$parent.updateDatasource(params);
            }
        }
    });

    unbindEvents[unbindEvents.length] = $scope.$on('vlocity.cpq.itemslist.reload', function() {
        var dataObj = {'event': 'reload', 'message': null};

        if (!$scope.$parent.uniqueName) {
            $log.debug('ERROR: vlocity.cpq.itemslist.reload layout broadcast failed as it can not find the layout uniqueName');
            return;
        }

        // Avoid using $rootscope. $scope.$parent will isolate the broadcast to only a layout
        // which has this controller attached.
        if ($scope.$parent.uniqueName && $scope.$parent.data.dataSource) {
            $scope.$parent.$broadcast($scope.$parent.uniqueName + '.events', dataObj);
        }
    });

    unbindEvents[unbindEvents.length] = $rootScope.$on('vlocity.cpq.productlist.selecteditem', function(event, item) {
        var pos;
        if (item.selected) {
            $scope.productsToCompare.push(item);
            $scope.productsToAdd.push(item);
        } else {
            pos = $scope.productsToAdd.map(function(prod) {
                    return prod.priceBookEntryId;
                }).indexOf(item.priceBookEntryId);

            $scope.productsToAdd.splice(pos,1);
            $scope.productsToCompare.splice(pos,1);
        }
    });

    $scope.$on('$destroy', function() {
        $log.debug('scope destroying');
        //Removes all listeners
        unbindEvents.forEach(function (fn) {
            fn();
        });
    });

    /********* END CPQ LEFTSIDEBAR EVENTS **********/

    /* Custom Labels */
    $scope.customLabels = {};
    var labelsArray = ['CPQReset','CPQApply','CPQFilter','CPQSearch','CPQCancel','CPQLoadMore','CPQProducts',
                        'CPQPromotions','CPQCompareContentText','CPQFiltersNotAvailable','CPQProductsNotAvailable',
                        'CPQPromotionsNotAvailable','CPQProductComparisionTitle','CPQQualified','CPQDisqualified'];
    CPQService.setLabels(labelsArray, $scope.customLabels);
    /* End Custom Labels */

    $scope.selectTab = function(tab,filters) {
        for (var propt in $scope.showList) {
            $scope.showList[propt] = false;
        }

        $scope.searchTerm = savedSearchTerm[tab];
        $scope.showList[tab] = true;
        selectedTab = tab;

        if (filters) {filters.show = false;}

        // reset subtab to 'Qualified' tab as default
        CPQProductPromoListService.setCategorySelected('Qualified');
    };

    $scope.getCategorySelected = function() {
        return CPQProductPromoListService.getCategorySelected();
    };

    $scope.setCategorySelected = function(type) {
        CPQProductPromoListService.setCategorySelected(type);
    };

    $scope.compare = function() {
        var modalScope = $scope.$new();

        $sldsModal({
            backdrop: 'static',
            scope: modalScope,
            templateUrl: 'CPQProductCompareModal.tpl.html',
            show: true
        });
    };

    $scope.searchItems = function() {
        $scope.$parent.$broadcast('vlocity.cpq.leftsidebar.search.items', $scope.searchTerm, selectedTab);
    };

    $scope.nextPageProducts = function() {
        if ($scope.$parent.session.nextProducts) {
            nextPage($scope.$parent.session.nextProducts);
        }
    };

    $scope.nextPagePromotions = function() {
        if ($scope.$parent.session.nextPromotions) {
            nextPage($scope.$parent.session.nextPromotions);
        }
    };

    var nextPage = function(nextItems) {
        if (nextItems) {
            $log.debug('nextItems', nextItems);

            var params = {};
            var nextItemsObj = JSON.parse(nextItems);
            params.lastRecordId = nextItemsObj.remote.params.lastRecordId;
            params.offsetSize = nextItemsObj.remote.params.offsetSize;

            if (params.lastRecordId) {
                $scope.$parent.updateDatasource(params, true);
            } else if (params.offsetSize) {
                params.offsetSize = params.offsetSize.toString(); // offsetSize is a number but only convert it to string if it is not null
                $scope.$parent.updateDatasource(params, true);
            }
        } else {
            $log.debug('no nextItems action - last page? ');
        }
    };

    $scope.checkFormValidation = function(e, formValidation) {
        if (formValidation) {
            $scope.isFormInvalid = formValidation.$invalid;
        }
    };

    $scope.resetFilter = function(filters) {
        var params = {};

        angular.forEach(filters, function(filter) {
            angular.forEach(filter.productAttributes.records, function(prodAttribute) {
                if (prodAttribute.userValues) {
                    prodAttribute.userValues = null;
                }
            });
        });

        params.attributes = '';
        $scope.parent.updateDatasource(params, false);
        $scope.parent.$parent.filters.show = false;

    };

    $scope.submitFilter = function(filters) {
        $log.debug(filters);
        var params = {};
        var selectedFilters = {};
        var compactAttributes, min, max;
        var compiledAttributes = '';
        var updatingValues;
        var newFilterArray = [];
        var updatedFilterArray;
        var updatedFilterValue;

        //find a better way to cycle through nested arrays
        angular.forEach(filters, function(filter) {
            angular.forEach(filter.productAttributes.records, function(prodAttribute) {
                if (prodAttribute.userValues || angular.isNumber(prodAttribute.userValues)) {
                    if (angular.isObject(prodAttribute.userValues)) {
                        if (prodAttribute.userValues instanceof Array) {
                            angular.forEach(prodAttribute.userValues, function(userVal, index) {
                                if (angular.isObject(userVal)) {
                                    if (userVal[index + 1]) { //check that the value is true
                                        selectedFilters[prodAttribute.code] = selectedFilters[prodAttribute.code] || [];
                                        selectedFilters[prodAttribute.code].push(index + 1);

                                    }
                                } else { //multi-select picklist
                                    selectedFilters[prodAttribute.code] = selectedFilters[prodAttribute.code] || [];
                                    selectedFilters[prodAttribute.code].push(userVal);
                                }
                            });
                            //join values in array to a string
                            if (selectedFilters[prodAttribute.code]) {
                                selectedFilters[prodAttribute.code] = selectedFilters[prodAttribute.code].join('_');
                            }
                        } else if (prodAttribute.userValues instanceof Date) {
                            selectedFilters[prodAttribute.code] = prodAttribute.userValues.getTime();
                        } else { //Object
                            //range scenario
                            if (angular.isDefined(prodAttribute.userValues.min) || angular.isDefined(prodAttribute.userValues.max)) {
                                min = prodAttribute.userValues.min;
                                max = prodAttribute.userValues.max;

                                if (isDateRange(prodAttribute)) {
                                    min = min ? new Date(min).getTime().toFixed(1) : null;
                                    max = max ? new Date(max).getTime().toFixed(1) : null;
                                }

                                compactAttributes = _.compact([min, max]).join('|');

                                selectedFilters[prodAttribute.code] = selectedFilters[prodAttribute.code] || [];
                                selectedFilters[prodAttribute.code].push(compactAttributes);
                            } else {
                                //multi-checkbox scenario
                                angular.forEach(prodAttribute.userValues, function(userVal, index) {
                                    if (angular.isObject(userVal)) {
                                        selectedFilters[prodAttribute.code] = selectedFilters[prodAttribute.code] || [];
                                        selectedFilters[prodAttribute.code].push(prodAttribute.values[Number(index)].label);
                                    }
                                });
                            }

                        }
                    } else { //normal scenario
                        if (isDateRange(prodAttribute)) {
                            prodAttribute.userValues = prodAttribute.userValues.toFixed(1);
                        }
                        selectedFilters[prodAttribute.code] = prodAttribute.userValues;
                    }
                }
            });
        });

        $log.debug('selected attributes ',selectedFilters);
        angular.forEach(selectedFilters, function(filterValue, filterLabel) {
            updatingValues = function(elem) {
                return elem.replace(/_/g, '%255F');
            };
            if (filterValue.constructor === Array) {
                filterValue = filterValue.map(updatingValues);
                updatedFilterValue = filterValue.join('_');
                compiledAttributes += filterLabel + ':' + updatedFilterValue + ',';
            } else {
                newFilterArray.push(filterValue);
                updatedFilterArray = newFilterArray.map(String);
                updatedFilterArray = updatedFilterArray.map(updatingValues);
                updatedFilterValue = updatedFilterArray.join('_');
                newFilterArray = [];
                compiledAttributes += filterLabel + ':' + updatedFilterValue + ',';
            }
        });
        compiledAttributes = compiledAttributes.slice(0, -1);

        $log.debug('compiledAttributes ',compiledAttributes);

        params.attributes = compiledAttributes;
        $scope.parent.updateDatasource(params, false);
        $scope.parent.$parent.filters.show = false;
    };

    var isDateRange = function(prodAttribute) {
        return (prodAttribute.inputType === 'date-range' || prodAttribute.inputType === 'datetime-range') ? true : false;
    };

    $scope.filterMapObject = function () {
        return {
            'fieldMapping' : {
                'type' : 'inputType',
                'value' : 'userValues',
                'label' : 'label',
                'readonly':'readonly',
                'required': 'required',
                'hidden': 'ishidden',
                'multiple': 'multiselect',
                'valuesArray' : {
                    'field': 'values',
                    'value': 'value',
                    'selected': 'selected',
                    'label': 'label'
                }
            },
            'pathMapping': {
                'levels': 2,
                'path': 'productAttributes.records'
            },
            'fieldSetMapping': {
                'showMoreFlag': true,
                'showCount': '3'
            }
        };
    };

    $scope.addProducts = function() {
        $log.debug('adding ',$scope.productsToAdd);
        var itemsToAdd = [];
        var addItemActionObj = {};
        angular.forEach($scope.productsToAdd, function(prod) {
            itemsToAdd.push({
                itemId: prod.priceBookEntryId,
                quantity:1
            });
        });
        $log.debug('finished adding ',itemsToAdd);

        //Get the first actionObj
        addItemActionObj = ($scope.productsToAdd[0].actions && $scope.productsToAdd[0].actions.addtocart) ? $scope.productsToAdd[0].actions.addtocart : null;

        if (addItemActionObj) {
            // use api settings from CPQSettingsService.getApiSettings() to determine if pricing and validation are required
            addItemActionObj[actionMode].params.price = apiSettings.addToCartAPIInProductListRequiresPricing;
            addItemActionObj[actionMode].params.validate = apiSettings.addToCartAPIInProductListRequiresValidation;

            //Constuct the actionObj's itemsToBeAdded - Adding selected items
            addItemActionObj[actionMode].params.itemsToBeAdded = itemsToAdd;

            CPQService.invokeAction(addItemActionObj).then(
                function(data) {
                    $log.debug(data);
                    angular.forEach($scope.productsToAdd, function(prod) {
                        prod.selected = false;
                    });

                    $scope.productsToAdd = []; //reset
                    $scope.productsToCompare = [];

                    $rootScope.$broadcast('vlocity.cpq.cart.reload');

                    //Reload the total bar
                    CPQService.reloadTotalBar();

                }, function(error) {
                    $log.error('AddProducts response failed: ', error);
                });
        }
    };

}]);

},{}],10:[function(require,module,exports){
angular.module('hybridCPQ')
.controller('CPQPricelistsController', ['$scope', '$rootScope', '$log', '$filter', '$sldsToast', 'CPQ_CONST', 'CPQService',
 function($scope, $rootScope, $log, $filter, $sldsToast, CPQ_CONST, CPQService) {

    var actionType;

    $scope.customLabels = {};
    var labelsArray = ['CPQPriceList','CPQPaymentChoice'];
    CPQService.setLabels(labelsArray, $scope.customLabels);

    $scope.currentPricelist = {
        'Name': $scope.parent['PriceListId__r.Name'] || $filter('customLabel')('CPQSelectPriceList'),
        'Id': $scope.parent.PriceListId__c
    };

    if ($scope.parent.DefaultCurrencyPaymentMode__c) {
        $scope.currentPaymentChoice = {
            'paymentChoice': $scope.parent.DefaultCurrencyPaymentMode__c,
        };
    }

    $scope.changePricelist = function(record) {
        actionType = record.actions.setpricelist;
        setPriceListPayment(record,actionType);
        updateCurrentPriceList(record);
    };

    $scope.changePaymentChoice = function(record) {
        actionType = record.actions.setdefaultpaymentmode;
        setPriceListPayment(record,actionType);
        updateCurrentPaymentChoice(record);   
    };

    function updateCurrentPriceList(record) {
        $scope.currentPricelist = {
            'Name': record.Name,
            'Id': record.Id
        };
    }

    function updateCurrentPaymentChoice(record) {
        $scope.currentPaymentChoice = {
            'paymentChoice':record.label
        };
    }

    function setPriceListPayment(record, actionType) {
        if (record.actions && actionType) {
            CPQService.invokeAction(actionType).then(function(data) {
                var hasError = false;
                angular.forEach(data.messages, function(message) {
                    if (message.severity === CPQ_CONST.ERROR) {
                        hasError = true;

                        $sldsToast({
                            backdrop: 'false',
                            content: data.messages[0].message,
                            severity: 'error',
                            icon: 'warning',
                            templateUrl: 'SldsToast.tpl.html',
                            autohide: true,
                            show: CPQService.toastEnabled('error')
                        });
                    }
                });

                if (!hasError && !(actionType === record.actions.setdefaultpaymentmode)) {
                    reloadCart();
                }
            }, function(error) {
                $log.error('SetPriceList response failed: ', error);
            });
        }
    }

    function reloadCart() {
        $rootScope.$broadcast('vlocity.cpq.cart.reload');
        $rootScope.$broadcast('vlocity.cpq.itemslist.reload');
        CPQService.reloadTotalBar();
    }

}]);

},{}],11:[function(require,module,exports){
angular.module('hybridCPQ')
    .controller('CPQProductItemController', ['$scope', '$rootScope', '$log', '$sldsModal', 'CPQ_CONST', 'CPQService', 'CPQSettingsService', 'CPQCartItemCrossActionService', 'CPQProductPromoListService', 'CPQResponsiveHelper', '$sldsToast','$q', 'PromiseQueueFactory', '$filter', '$timeout', 'CPQDynamicMessagesService', 'CPQOverrideService',
 function($scope, $rootScope, $log, $sldsModal, CPQ_CONST, CPQService, CPQSettingsService, CPQCartItemCrossActionService, CPQProductPromoListService, CPQResponsiveHelper, $sldsToast, $q, PromiseQueueFactory, $filter, $timeout, CPQDynamicMessagesService, CPQOverrideService) {
    var apiSettings, actionMode;

    apiSettings = CPQSettingsService.getApiSettings();

    /* Custom Labels */
    $scope.customLabels = {};
    var toastCustomLabels = {};
    var labelsArray = ['CPQProductItemTitle','CPQAddToCart','CPQClose','CPQMore','CPQReasons','CPQViewReasons','CPQOr'];
    var toastLabelsArray =  ['CPQAddItemFailed','CPQAddedItem','CPQAutoReplaceItem','CPQAddingItem','CPQFetchingRules','CPQFetchRuleFailed','CPQFetchRuleCompleted'];
    actionMode = CPQService.actionMode;

    CPQService.setLabels(labelsArray, $scope.customLabels);
    // Custom labels for toast messages
    CPQService.setLabels(toastLabelsArray, toastCustomLabels);
    /* End Custom Labels */

    $scope.getCategorySelected = function() {
        return CPQProductPromoListService.getCategorySelected();
    };

    $scope.getPriceValue = function(obj, field) {
        return CPQService.getPriceValue(obj, field);
    };

    /**
     * viewMore: Function used to launch and dispaly the product details
     * @return {type} [None]
     */
    $scope.viewMore = function() {
        var modalScope = $scope.$new();
        var productDetailsModal;

        modalScope.isDetailLayoutLoaded = false;
        modalScope.saving = false;
        // @Todo Implement a way for controllers to access the cardlayout scope without parent
        modalScope.obj = $scope.$parent.obj;

        productDetailsModal = $sldsModal({
            backdrop: 'static',
            scope: modalScope,
            templateUrl: 'CPQProductItemDetailsModal.tpl.html',
            show: true
        });
    };

    $scope.viewReasons = function() {
        var procesingMessageToast = CPQDynamicMessagesService.viewReasons();
        wrapFunctionCall(getRuleMessagesPromise, [$scope.$parent.obj, procesingMessageToast]);
    };

    /**
     * selectItem: Emits an event when ever user selects the products from
     * the product list.
     * @return {type} Emits an event 'vlocity.cpq.productlist.selecteditem'
     */
    $scope.selectItem = function(obj) {
        $scope.$emit('vlocity.cpq.productlist.selecteditem', obj);
    };

    $scope.addToCart = function(obj) {
        if (obj.actions === undefined) {
            return;
        }
        var procesingMessageToast = $sldsToast({
            message: toastCustomLabels['CPQAddingItem'] + ' ' + obj.Name.value + ' ...',
            severity: 'info',
            icon: 'info',
            templateUrl: 'SldsToast.tpl.html',
            show: CPQService.toastEnabled('info')
        });
        wrapFunctionCall(addToCartPromise, [obj, procesingMessageToast]);
    };

    function wrapFunctionCall(call, args) {
        args = Array.isArray(args) ? args : [args];
        PromiseQueueFactory.addTask(call, args);
        PromiseQueueFactory.executeTasks();
    }

    var getRuleMessagesPromise = function(obj, procesingMessageToast) {
        var modalScope = $scope.$new();
        var modalScopeObj = $scope.$parent.obj;

        if ($scope.obj.actions && $scope.obj.actions.getrulemessages) {
            CPQDynamicMessagesService.getRuleMessagesPromise(obj, procesingMessageToast, $scope.obj.actions.getrulemessages, modalScope, modalScopeObj);
        }
    };

    /**
     * addToCart: Emits an event when ever user selects the product
    */
    var addToCartPromise = function(obj, procesingMessageToast) {
        var deferred = $q.defer();
        var addItemActionObj;
        var itemMessages = [];
        var autoReplaceMsg = {};
        var actionPromise;
        var beforeAddToCartHookPayload = {
            'obj': obj
        };
        var afterAddToCartHookPayload = {
            'obj': obj
        };

        if ($scope.obj.actions && $scope.obj.actions.addtocart) {
            addItemActionObj = $scope.obj.actions.addtocart;

            // use api settings from CPQSettingsService.getApiSettings() to determine if pricing and validation are required
            addItemActionObj[actionMode].params.price = apiSettings.addToCartAPIInProductListRequiresPricing;
            addItemActionObj[actionMode].params.validate = apiSettings.addToCartAPIInProductListRequiresValidation;

            $scope.beforeAddToCartHook(beforeAddToCartHookPayload);

            CPQService.invokeAction(addItemActionObj).then(
                function(data) {
                    $log.debug(data);
                    procesingMessageToast.hide();

                    if (angular.isUndefined(data.records) && data.messages && data.messages.length && data.messages[0].severity === CPQ_CONST.ERROR) {
                        // Display message if Validation Rule fails
                        $sldsToast({
                            content: data.messages[0].message,
                            severity: 'error',
                            icon: 'warning',
                            autohide: true,
                            show: CPQService.toastEnabled('error')
                        });
                    }

                    if (data.actions) {
                        //gathering the messages

                        // if both itemadded and itemdeleted actions exist, this is a case of auto-replace
                        if (data.actions.itemadded && data.actions.itemdeleted) {
                            autoReplaceMsg.message = toastCustomLabels['CPQAutoReplaceItem'];
                            itemMessages = itemMessages.concat(autoReplaceMsg);
                        // if only itemadded action exist, this is a case of straight forward add
                        } else {
                            $sldsToast({
                                message: toastCustomLabels['CPQAddedItem'] + ' ' + obj.Name.value,
                                severity: 'success',
                                icon: 'success',
                                templateUrl: 'SldsToast.tpl.html',
                                autohide: true,
                                show: CPQService.toastEnabled('success')
                            });
                        }

                        if (data.actions.rootitemadded) {
                            itemMessages = itemMessages.concat(data.actions.rootitemadded.client.params.items);
                        }
                        if (data.actions.itemadded) {
                            itemMessages = itemMessages.concat(data.actions.itemadded.client.params.items);
                        }
                        if (data.actions.itemdeleted) {
                            itemMessages = itemMessages.concat(data.actions.itemdeleted.client.params.items);
                        }

                        angular.forEach(itemMessages, function(item) {
                            if (item) {
                                $sldsToast({
                                    backdrop: 'false',
                                    message: item.message,
                                    severity: 'success',
                                    icon: 'success',
                                    templateUrl: 'SldsToast.tpl.html',
                                    autohide: true,
                                    show: CPQService.toastEnabled('success')
                                });
                            }
                        });
                    } else {
                        //HYB-1309 - the messages check was reduntant
                        //since the product list won't be availble if
                        //the order is not attached to a pricebook
                        $sldsToast({
                            backdrop: 'false',
                            message: toastCustomLabels['CPQAddedItem'] + ' ' + obj.Name.value,
                            severity: 'success',
                            icon: 'success',
                            templateUrl: 'SldsToast.tpl.html',
                            autohide: true,
                            show: CPQService.toastEnabled('success')
                        });
                    }

                    // need to delay these actions below because in the case that the user has cleared session cache,
                    // the controller of CPQCartItemController may not have the message consumer to proocess this data
                    $timeout(function() {
                        if (data.records) {
                            $rootScope.$broadcast('vlocity.cpq.cart.addrecords', data.records);
                        }
                        //Cross actions
                        if (data.actions) {
                            actionPromise =  CPQCartItemCrossActionService.processActions(data.actions);
                            $q.when(actionPromise).then(function(data) {
                                afterAddToCartHookPayload.data = data;
                                $scope.afterAddToCartHook(afterAddToCartHookPayload);
                            }, function(error) {
                                afterAddToCartHookPayload.error = error;
                                $scope.afterAddToCartHook(afterAddToCartHookPayload);
                            });
                        }
                        //Reload the total bar
                        CPQService.reloadTotalBar();
                    }, 100); // wait for 0.1 sec

                    deferred.resolve(toastCustomLabels['CPQAddedItem'] + ' ' + obj.Name.value);

                }, function(error) {
                    $log.error(error);
                    procesingMessageToast.hide();

                    $sldsToast({
                        title: toastCustomLabels['CPQAddItemFailed'] + ' ' + obj.Name.value,
                        content: error.message,
                        severity: 'error',
                        icon: 'warning',
                        autohide: true,
                        show: CPQService.toastEnabled('error')
                    });
                    deferred.reject(toastCustomLabels['CPQAddItemFailed'] + ' ' + obj.Name.value);
                });
        } else {
            $log.debug('Addtocart action not found');
            deferred.reject(toastCustomLabels['CPQAddItemFailed'] + ' ' + obj.Name.value);
        }

        return deferred.promise;
    };

    /* Before/After Hooks */
    $scope.beforeAddToCartHook = function(beforeAddToCartHookPayload) {};

    $scope.afterAddToCartHook = function(afterAddToCartHookPayload) {};
    /* End */


    /* DO NOT REMOVE !!! */

    // Add this function in order to override controller
    // Using controllerName, generated by $controller decorator (HybridCPQ.js)
    var overrideFunctionList = ['beforeAddToCartHook', 'afterAddToCartHook'];
    CPQOverrideService.addControllerCallback($scope.controllerName, overrideFunctionList, function(a){eval(a);});

    /* END */

}]);

},{}],12:[function(require,module,exports){
angular.module('hybridCPQ')
.controller('CPQProductItemDetailsController', ['$scope', 'CPQService', '$filter', 'CPQSettingsService', function($scope, CPQService, $filter, CPQSettingsService) {
    var customSettings;

    customSettings = CPQSettingsService.getCustomSettings();
    
    /* Custom Labels */
    $scope.customLabels = {};
    var labelsArray = ['CPQDetails','CPQOr'];
    CPQService.setLabels(labelsArray, $scope.customLabels);
    /* End Custom Labels */

    //TODO: toggle tree nodes based on IDs. So that each has its own individual state.
    $scope.toggle = function(targetScope) {
        $scope.collapsed = !$scope.collapsed;
    };

    $scope.getPriceValue = function(obj, field) {
        return CPQService.getPriceValue(obj, field);
    };
    //is expand mode enabled?
    $scope.expandMode = (customSettings['Product Configuration Mode'] ? (customSettings['Product Configuration Mode'].toLowerCase() === 'expand') : false);

    // Vlocity Dynamic form mapping object
    $scope.mapObject = function() {
        return {
            'fieldMapping' : {
                'type' : 'inputType',
                'value' : 'userValues',
                'label' : 'label',
                'readonly':'readonly',
                'required': 'required',
                'disabled': 'disabled',
                'hidden': 'ishidden',
                'multiple': 'multiselect',
                'customTemplate': 'customTemplate',
                'valuesArray' : { //multiple values map. Eg: select, fieldset, radiobutton group
                    'field': 'values',
                    'value': 'value',
                    'label': 'label',
                    'disabled': 'disabled'
                }
            },
            'pathMapping': {
                'levels': 2,
                'path': 'productAttributes.records'
            }
        };
    };

}]);

},{}],13:[function(require,module,exports){
angular.module('hybridCPQ')
.controller('CPQPromotionItemController', ['$scope', '$rootScope', '$log', '$sldsToast', '$sldsPrompt', 'CPQService', '$q', 'PromiseQueueFactory', 'CPQCartItemCrossActionService', 'CPQProductPromoListService', 'CPQDynamicMessagesService', 'CPQOverrideService',
    function($scope, $rootScope, $log, $sldsToast, $sldsPrompt, CPQService, $q, PromiseQueueFactory, CPQCartItemCrossActionService, CPQProductPromoListService, CPQDynamicMessagesService, CPQOverrideService) {

    /* Custom Labels */
    $scope.customLabels = {};
    var toastCustomLabels = {};
    var labelsArray = ['CPQAddToCart', 'CPQPromoCode','CPQClose','CPQReasons','CPQViewReasons'];
    var toastLabelsArray =  ['CPQAddingItem', 'CPQAutoReplaceItem', 'CPQAddedItem', 'CPQAddItemFailed', 'CPQApplyPromotion', 'CPQApply', 'CPQCancel','CPQReasons','CPQFetchingRules','CPQFetchRuleFailed','CPQFetchRuleCompleted'];
    CPQService.setLabels(labelsArray, $scope.customLabels);
    // Custom labels for toast messages
    CPQService.setLabels(toastLabelsArray, toastCustomLabels);
    /* End Custom Labels */

    $scope.getCategorySelected = function() {
        return CPQProductPromoListService.getCategorySelected();
    };

    $scope.viewReasons = function() {
        var procesingMessageToast = CPQDynamicMessagesService.viewReasons();
        wrapFunctionCall(getRuleMessagesPromise, [$scope.$parent.obj, procesingMessageToast]);
    };

    $scope.addToCart = function(obj, isConfirmationModal) {
        var addPrompt;
        var addItemActionObj;
        var validateCartActionObj;

        if (obj.actions === undefined) {
            $log.debug('No action can be found, failed to add promotion');
            return;
        }

        addItemActionObj = ($scope.obj.actions && $scope.obj.actions.addtocart) ? $scope.obj.actions.addtocart : null;

        if (!addItemActionObj) {
            $log.debug('Add to Cart action cannot be found, failed to add promotion');
            return;
        }

        function addPromotion() {

            var procesingMessageToast = $sldsToast({
                message: toastCustomLabels['CPQAddingItem'] + ' ' + obj.Name,
                severity: 'info',
                icon: 'info',
                templateUrl: 'SldsToast.tpl.html',
                show: CPQService.toastEnabled('info')
            });

            wrapFunctionCall(addToCartPromise, [obj, addItemActionObj, procesingMessageToast, false]);
        }

        //Disables confirmation prompt when isConfirmationModal is set to false and defaults to true
        if (typeof isConfirmationModal === 'undefined') {
            isConfirmationModal = true;
        }

        // Show confirmation modal only when promotion description exists and confirmationModal argument is not false
        if (isConfirmationModal) {
            var promptScope = $scope.$new();
            promptScope.data = {
                title: toastCustomLabels['CPQApplyPromotion'],
                content: '<b>' + obj.Name + '</b><br/>' + (obj.Description__c ? obj.Description__c : ''),
                show: true,
                theme: 'error',
                scope: promptScope,
                templateUrl: 'CPQSldsPrompt.tpl.html',
                buttons: [{
                    label: toastCustomLabels['CPQCancel'],
                    type: 'neutral',
                    action: function() {
                        addPrompt.hide();
                    }
                }, {
                    label: toastCustomLabels['CPQApply'],
                    type: 'destructive',
                    action: function() {
                        addPrompt.hide();
                        addPromotion();
                    }
                }]
            };

            addPrompt = $sldsPrompt(promptScope.data);
        } else {
            addPromotion();
        }
    };

    function wrapFunctionCall(call, args) {
        args = Array.isArray(args) ? args : [args];
        PromiseQueueFactory.addTask(call, args);
        PromiseQueueFactory.executeTasks();
    }

    var getRuleMessagesPromise = function(obj, procesingMessageToast) {
        var getRuleMessagesActionObj = $scope.obj.actions.getrulemessages ? $scope.obj.actions.getrulemessages : null;
        var modalScope = $scope.$new();
        var modalScopeObj = $scope.$parent.obj;
        CPQDynamicMessagesService.getRuleMessagesPromise(obj, procesingMessageToast, getRuleMessagesActionObj, modalScope, modalScopeObj);
    };

    /**
     * addToCart: Emits an event when ever user selects the promotion
    */
    var addToCartPromise = function(obj, actionObj, procesingMessageToast, lastStepFlag) {
        var deferred = $q.defer();
        var toastMessage, actionPromise;
        var itemMessages = [];
        var autoReplaceMsg = {};
        var beforeAddToCartHookPayload = {
            'obj': obj
        };
        var afterAddToCartHookPayload = {
            'obj': obj
        };

        $scope.beforeAddToCartHook(beforeAddToCartHookPayload);

        CPQService.invokeAction(actionObj).then(
            function(data) {
                procesingMessageToast && procesingMessageToast.hide && procesingMessageToast.hide();

                if (data.messages && data.messages.length && data.messages[0].severity === 'ERROR') {
                    // Display error message
                    $sldsToast({
                        content: data.messages[0].message,
                        severity: 'error',
                        icon: 'warning',
                        autohide: true,
                        show: CPQService.toastEnabled('error')
                    });

                    toastMessage = data.messages[0].message;
                // only display add promotion successful message if it is not the last step
                } else if (!lastStepFlag) {
                    toastMessage = toastCustomLabels['CPQAddedItem'] + ' ' + obj.Name;
                }

                if (data.actions) {
                    //gathering the messages

                    // if both itemadded and itemdeleted actions exist, this is a case of auto-replace
                    if (data.actions.itemadded && data.actions.itemdeleted) {
                        autoReplaceMsg.message = toastCustomLabels['CPQAutoReplaceItem'];
                        itemMessages = itemMessages.concat(autoReplaceMsg);
                    // if only itemadded action exist, this is a case of straight forward add
                    // only display add promotion successful message if it is not the last step
                    } else if (!lastStepFlag) {
                        $sldsToast({
                            message: toastCustomLabels['CPQAddedItem'] + ' ' + obj.Name,
                            severity: 'success',
                            icon: 'success',
                            templateUrl: 'SldsToast.tpl.html',
                            autohide: true,
                            show: CPQService.toastEnabled('success')
                        });
                    }

                    if (data.actions.rootitemadded) {
                        itemMessages = itemMessages.concat(data.actions.rootitemadded.client.params.items);
                    }
                    if (data.actions.itemadded) {
                        itemMessages = itemMessages.concat(data.actions.itemadded.client.params.items);
                    }
                    if (data.actions.itemdeleted) {
                        itemMessages = itemMessages.concat(data.actions.itemdeleted.client.params.items);
                    }

                    angular.forEach(itemMessages, function(item) {
                        if (item) {
                            $sldsToast({
                                backdrop: 'false',
                                message: item.message,
                                severity: 'success',
                                icon: 'success',
                                templateUrl: 'SldsToast.tpl.html',
                                autohide: true,
                                show: CPQService.toastEnabled('success')
                            });
                        }
                    });
                } else {
                    $sldsToast({
                        message: toastCustomLabels['CPQAddedItem'] + ' ' + obj.Name,
                        severity: 'success',
                        icon: 'success',
                        templateUrl: 'SldsToast.tpl.html',
                        autohide: true,
                        show: CPQService.toastEnabled('success')
                    });
                }

                //Cross actions

                actionPromise = CPQCartItemCrossActionService.processActions(data.actions);
                afterAddToCartHookPayload.lastStepFlag = lastStepFlag;

                $q.when(actionPromise).then(function(data) {
                        afterAddToCartHookPayload.data = data;
                        $scope.afterAddToCartHook(afterAddToCartHookPayload);
                    }, function(error) {
                        afterAddToCartHookPayload.error = error;
                        $scope.afterAddToCartHook(afterAddToCartHookPayload);
                    }
                );

                deferred.resolve(toastMessage);

            }, function(error) {
                $log.error('AddItem response failed: ', error);
                procesingMessageToast && procesingMessageToast.hide && procesingMessageToast.hide();

                $sldsToast({
                    title: toastCustomLabels['CPQAddItemFailed'] + ' ' + obj.Name,
                    content: error.message,
                    severity: 'error',
                    icon: 'warning',
                    autohide: true,
                    show: CPQService.toastEnabled('error')
                });
                deferred.reject(toastCustomLabels['CPQAddItemFailed'] + ' ' + obj.Name);
            });

        return deferred.promise;
    };

    /* Before/After Hooks */
    $scope.beforeAddToCartHook = function(beforeAddToCartHookPayload) {};

    $scope.afterAddToCartHook = function(afterAddToCartHookPayload) {
        var validateCartActionObj, procesingMessageToast = {};
        var actions = afterAddToCartHookPayload.obj.actions;
        validateCartActionObj = (actions && actions.validatecart) ? actions.validatecart : null;
        
        if (!afterAddToCartHookPayload.lastStepFlag && validateCartActionObj) {
            wrapFunctionCall(addToCartPromise, [afterAddToCartHookPayload.obj, validateCartActionObj, procesingMessageToast, true]);
        } else {
            //Reload the total bar
            CPQService.reloadTotalBar();

            //Reload promotions tab
            $rootScope.$broadcast('vlocity.cpq.promotions.reload');
        }
    };
    /* End */

    /* DO NOT REMOVE !!! */

    // Add this function in order to override controller
    // Using controllerName, generated by $controller decorator (HybridCPQ.js)
    var overrideFunctionList = ['beforeAddToCartHook', 'afterAddToCartHook'];
    CPQOverrideService.addControllerCallback($scope.controllerName, overrideFunctionList, function(a){eval(a);});

    /* END */

}]);

},{}],14:[function(require,module,exports){
angular.module('hybridCPQ')
.controller('CPQPromotionsController', ['$scope', '$rootScope', '$log', '$sldsModal', '$sldsToast', '$sldsPrompt', 'CPQ_CONST', 'CPQService', 'CPQSettingsService', 'CPQCustomViewsService', 'CPQOverrideService',
function($scope, $rootScope, $log, $sldsModal, $sldsToast, $sldsPrompt, CPQ_CONST, CPQService, CPQSettingsService, CPQCustomViewsService, CPQOverrideService) {
    var apiSettings, actionMode;
    var unbindEvents = [];

    $scope.appliedPromotionsTypeSelected = 'All';
    $scope.appliedPromotionsCommitmentDateSelected = {};

    actionMode = CPQService.actionMode;

    /* Custom Labels */
    $scope.customLabels = {};
    var toastCustomLabels = {};
    var labelsArray = ['CPQPromotions','CPQCartIsEmpty','CPQCancel','CPQCancelPromotion',
                        'CPQCartMessages','CPQCartCustomViews','CPQCartTabTwoContent','CPQCartTabThreeContent','CPQDelete',
                        'CPQNoResultsFound','AllPromotions','ActivePromotions','ExpiredPromotions','CanceledPromotions'];
    var toastLabelsArray =  ['CPQDeletingItem','CPQDeleteItem','CPQDeleteItemConfirmationMsg','CPQDeleteButtonLabel','CPQDeleteItemFailed',
            'CPQDeletedItem','CPQCanceledItem'];

    CPQService.setLabels(labelsArray, $scope.customLabels);
    // Custom labels for toast messages
    CPQService.setLabels(toastLabelsArray, toastCustomLabels);
    /* End Custom Labels */

    apiSettings = CPQSettingsService.getApiSettings();

    $scope.dropDownLabel = {'value': $scope.customLabels['AllPromotions']};

    $scope.sortBySequenceValue = $rootScope.nsPrefix + 'Sequence__c.value';

    //Promotions event listeners
    unbindEvents[unbindEvents.length] = $scope.$on('vlocity.cpq.promotions.reload', function(event) {
        var totalMessage = {'event': 'reload', 'message': null};
        //@TODO: Avoid reading parent levels, fragile code. Need's a change in design of promotions.
        $scope.$parent.$parent.$parent.$broadcast($scope.$parent.uniqueName + '.events', totalMessage);
    });

    $scope.$on('$destroy', function() {
        $log.debug('promotions tab - destroying');
        //Removes all listeners
        unbindEvents.forEach(function (fn) {
            fn();
        });
    });

    $scope.getCustomViewStateData = function(cards) {
        if (cards && cards[0].states) {
            // Assign CPQCustomViewsService into $rootScope variable:
            $rootScope.customViews = new CPQCustomViewsService($scope, cards);
        } else {
            $log.debug('There is no data for CustomView');
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

    $scope.cancelAppliedPromotion = function(record) {
        var modalScope = $scope.$new();
        var getPromoPenaltiesActionObj;

        /* Custom Labels */
        modalScope.customLabels = {};
        var labelsArray = ['CPQCancelPromotion','CPQPromoCancelDate','CPQPromoCancelReason',
                            'CPQConfirmCancelPromotion','CPQKeepPromotion','CPQPenaltyButton','CPQPenaltyApplicableMsg','CPQNoPenaltiesMsg'];
        CPQService.setLabels(labelsArray, modalScope.customLabels);
        /* End Custom Labels */

        modalScope.cancellationDate = {};
        modalScope.cancellationReason = {};
        //Min date is on or after the order request date.
        //Defaults to today's date as promotion cancellation date can't be in past.
        modalScope.minCancellationDate = record.OrderRequestDate ? new Date(record.OrderRequestDate) : new Date();
        modalScope.isPenaltiesLoading = false;
        modalScope.isPenaltyEvaluated = false;

        modalScope.parent = $scope.$parent.$parent.$parent;

        modalScope.disableEvaluate = function() {
            // Force the user to re evaluate penalties on date change
            modalScope.isPenaltyEvaluated = false;
        };

        modalScope.getPenalties = function() {
            var cancellationDate, cancellationReason;
            modalScope.isPenaltiesLoading = true;
            modalScope.isPenaltyEvaluated = false;

            cancellationDate = modalScope.cancellationDate.value ? modalScope.cancellationDate.value : '';
            cancellationReason = modalScope.cancellationReason.value ? encodeURIComponent(modalScope.cancellationReason.value) : '';

            if (record.actions && record.actions.getpromodetails) {
                getPromoPenaltiesActionObj = record.actions.getpromodetails;

                getPromoPenaltiesActionObj[actionMode].params.cancellationDate = cancellationDate;
                getPromoPenaltiesActionObj[actionMode].params.cancellationReason = cancellationReason;

                CPQService.invokeAction(getPromoPenaltiesActionObj).then(function(data) {
                    var penalties;

                    //records first element is the current promotion item which contains penalties
                    if (data.records && data.records[0].penalties) {
                        penalties = data.records[0].penalties;
                    }

                    modalScope.isPenaltiesLoading = false;
                    modalScope.isPenaltyEvaluated = true;
                    modalScope.penalties = penalties;
                },
                function(error) {
                    modalScope.isPenaltiesLoading = false;
                    modalScope.isPenaltyEvaluated = true;
                    $sldsToast({
                        backdrop: 'false',
                        title: toastCustomLabels['CPQDeleteItemFailed'] + ' ' + record.Name.value,
                        content: error.message,
                        severity: 'error',
                        icon: 'warning',
                        autohide: true,
                        show: CPQService.toastEnabled('error')
                    });
                    $log.error(error);
                });
            }

        };

        modalScope.cancelPromotionItem = function() {
            deletePromotionItem(modalScope.parent, record, modalScope.cancellationDate.value, modalScope.cancellationReason.value);
        };

        $sldsModal({
            backdrop: 'static',
            scope: modalScope,
            templateUrl: 'CPQAppliedPromotionEvaluatePenaltiesModal.tpl.html',
            show: true,
        });
    };

    $scope.deleteAppliedPromotion = function(record) {
        var deletePrompt = $sldsPrompt({
            title: toastCustomLabels['CPQDeleteItem'],
            content: toastCustomLabels['CPQDeleteItemConfirmationMsg'] + '<br/><br/>' + record.Name.value,
            theme: 'error',
            show: true,
            buttons: [{
                label: $scope.customLabels['CPQCancel'],
                type: 'neutral',
                action: function() {
                    deletePrompt.hide();
                    return;
                }
            }, {
                label: toastCustomLabels['CPQDeleteButtonLabel'],
                type: 'destructive',
                action: function() {
                    deletePrompt.hide();
                    //TBD: Revisit this code. Fragile if we depend on parent elements
                    deletePromotionItem($scope.$parent.$parent.$parent, record);
                }
            }]
        });
    };

    var deletePromotionItem = function(parent, record, cancelDate, cancelReason) {
        var i, promotionItemIdToBeRemoved, promotionItemToBeDisconnected, deleteAppliedPromotionActionObj;
        var originalRecordListToBeModified = [];
        var beforeDeletePromotionItemHookPayload = {
            'parent': parent,
            'record': record
        };
        var afterDeletePromotionItemHookPayload = {
            'parent': parent,
            'record': record
        };

        var processingToastMessage = $sldsToast({
            backdrop: 'false',
            message: toastCustomLabels['CPQDeletingItem'] + ' ' + record.Name.value + ' ...',
            severity: 'info',
            icon: 'info',
            autohide: true,
            show: CPQService.toastEnabled('info')
        });

        $scope.beforeDeletePromotionItemHook(beforeDeletePromotionItemHookPayload);

        if (record.actions && record.actions.deleteappliedpromoitems) {
            deleteAppliedPromotionActionObj = angular.copy(record.actions.deleteappliedpromoitems);
            deleteAppliedPromotionActionObj[actionMode].params.price = apiSettings.deleteAppliedPromotionAPIRequiresPricing;
            deleteAppliedPromotionActionObj[actionMode].params.validate = apiSettings.deleteAppliedPromotionAPIRequiresValidation;

            if (cancelDate) {
                //Passes ISO date based on type which is set in template for date picker
                deleteAppliedPromotionActionObj[actionMode].params.cancellationDate = cancelDate;
            }

            if (cancelReason) {
                deleteAppliedPromotionActionObj[actionMode].params.cancellationReason = encodeURIComponent(cancelReason);
            }

            CPQService.invokeAction(deleteAppliedPromotionActionObj).then(function(data) {
                var hasError = false;
                processingToastMessage.hide();
                angular.forEach(data.messages, function(message) {
                    if (message.severity === CPQ_CONST.ERROR) {
                        hasError = true;

                        $sldsToast({
                            backdrop: 'false',
                            message: toastCustomLabels['CPQDeleteItemFailed'] + ' ' + record.Name.value,
                            content: data.messages[0].message,
                            severity: 'error',
                            icon: 'warning',
                            templateUrl: 'SldsToast.tpl.html',
                            autohide: true,
                            show: CPQService.toastEnabled('error')
                        });
                    }
                });

                if (data.actions && data.actions.itemdeleted) {

                    $sldsToast({
                        backdrop: 'false',
                        message: toastCustomLabels['CPQDeletedItem'] + ' ' + record.Name.value,
                        severity: 'success',
                        icon: 'success',
                        autohide: true,
                        show: CPQService.toastEnabled('success')
                    });

                    promotionItemIdToBeRemoved = data.actions.itemdeleted.client.params.items[0].Id;
                    for (i = 0; i < parent.records.length; i++) {
                        if (parent.records[i]['Id']['value'] !== promotionItemIdToBeRemoved) {
                            originalRecordListToBeModified.push(parent.records[i]);
                        }
                    }

                    parent.records = originalRecordListToBeModified;

                } else if (data.actions && data.actions.itemupdated) {

                    $sldsToast({
                        backdrop: 'false',
                        message: toastCustomLabels['CPQCanceledItem'] + ' ' + record.Name.value,
                        severity: 'success',
                        icon: 'success',
                        autohide: true,
                        show: CPQService.toastEnabled('success')
                    });

                    promotionItemToBeDisconnected = data.actions.itemupdated.client.params.items[0];
                    for (i = 0; i < parent.records.length; i++) {
                        if (parent.records[i]['Id']['value'] === promotionItemToBeDisconnected.Id) {
                            //TBD: Needs an object merge rather than manual field merge but
                            //API needs to return promotion item object rather than fields to achieve it.
                            parent.records[i][$rootScope.nsPrefix + 'ReasonForCancellation__c']['value'] = promotionItemToBeDisconnected.ReasonForCancellation;
                            parent.records[i][$rootScope.nsPrefix + 'RequestDate__c']['value'] = promotionItemToBeDisconnected.RequestDate;
                            parent.records[i][$rootScope.nsPrefix + 'Action__c']['value'] = 'Disconnect';
                        }
                    }

                }

                afterDeletePromotionItemHookPayload.data = data;

                $scope.afterDeletePromotionItemHook(afterDeletePromotionItemHookPayload);
            },
            function(error) {
                $sldsToast({
                    backdrop: 'false',
                    title: toastCustomLabels['CPQDeleteItemFailed'] + ' ' + record.Name.value,
                    content: error.message,
                    severity: 'error',
                    icon: 'warning',
                    autohide: true,
                    show: CPQService.toastEnabled('error')
                });
                $log.error(error);
            });
        }
    };

    /* Before/After Hooks */
    $scope.beforeDeletePromotionItemHook = function(beforeDeletePromotionItemHookPayload) {};

    $scope.afterDeletePromotionItemHook = function(afterDeletePromotionItemHookPayload) {
        var actions = afterDeletePromotionItemHookPayload.data.actions;
        if (actions && (actions.itemdeleted || actions.itemupdated)) {
            //Reload the total bar
            CPQService.reloadTotalBar();
        }
    };
    /* End */

    /* DO NOT REMOVE !!! */

    // Add this function in order to override controller
    // Using controllerName, generated by $controller decorator (HybridCPQ.js)
    var overrideFunctionList = ['beforeDeletePromotionItemHook', 'afterDeletePromotionItemHook'];
    CPQOverrideService.addControllerCallback($scope.controllerName, overrideFunctionList, function(a){eval(a);});

    /* END */

}]);

},{}],15:[function(require,module,exports){
angular.module('hybridCPQ')
    .controller('CPQTotalController', ['$scope', '$rootScope', '$log', '$q', 'CPQService', 'PromiseQueueFactory',
        function($scope, $rootScope, $log, $q, CPQService, PromiseQueueFactory) {

        /*********** CPQ TOTAL EVENTS ************/
        var unbindEvents = [];
        var reloadPromise, payloadMessages;

        //layout has finished loading the getCarts API
        unbindEvents[unbindEvents.length] =
            $scope.$watch('$parent.isLoaded', function(newCart) {
                if (newCart) {
                    payloadMessages = $scope.$parent.payload.messages;
                    payloadMessages = angular.isDefined(payloadMessages) ? payloadMessages : [];

                    if (payloadMessages) {
                        CPQService.setCartMessages(payloadMessages);
                    }
                    if (angular.isDefined(reloadPromise)) {
                        reloadPromise.resolve('total bar reloaded successfully');
                    }
                }
            }, true);

        unbindEvents[unbindEvents.length] =
            $scope.$on('vlocity.cpq.totalbar.reload', function(event, validation) {
                var layoutUniqueName = $scope.$parent.uniqueName;

                if (layoutUniqueName) {
                    wrapFunctionCall(reloadTotalBarPromise,[validation, layoutUniqueName],{'unique' : true, 'key' : 'total-bar-refresh', 'priority' : 99});
                } else {
                    $log.debug('ERROR: vlocity.cpq.totalbar.reload layout broadcast failed as it can not find the layout uniqueName');
                }
            });

        $scope.$on('$destroy', function() {
            $log.debug('total bar - destroying');
            //Removes all listeners
            unbindEvents.forEach(function (fn) {
                fn();
            });
        });

        /********* END TOTAL EVENTS **********/

        /* Custom Labels */
        $scope.customLabels = {};
        var toastCustomLabels = {};
        var labelsArray = ['CPQTotalIncomplete','CPQCreateAssets','CPQCreateQuote','CPQCreateOrder'];
        CPQService.setLabels(labelsArray, $scope.customLabels);
        /* End Custom Labels */

        function wrapFunctionCall(call, args, options) {
            args = Array.isArray(args) ? args : [args];
            PromiseQueueFactory.addTask(call, args, options);
            PromiseQueueFactory.executeTasks();
        }

        function reloadTotalBarPromise(validation, layoutUniqueName) {
            var totalMessage = {'event': 'reload', 'message': null};
            reloadPromise = $q.defer();
            $scope.hasError = angular.isDefined(validation) ? !validation : false;

            if ($scope.hasError) {
                reloadPromise.reject('total bar reload validation failed');
            } else {
                $scope.$parent.$broadcast(layoutUniqueName + '.events', totalMessage);
            }

            return reloadPromise.promise;
        }

        var togglePageSpinner = function() {
            $scope.showSpinner = !$scope.showSpinner;
            var loadMessage = {'event': 'setLoading', 'message': $scope.showSpinner};
            $rootScope.$broadcast('vlocity.layout.cpq-base-grid.events', loadMessage);
        };

        //this object gets passed to the ActionLauncher
        //giving us further control on the vlocity actions
        //we launch from this module
        $scope.checkoutActionConfig = {
            contextRedirectFlag : true,
            showLoadingSpinner: togglePageSpinner
        };

        /**
         * delete : Used for deleting the line item in the cart
         * Also, provides the confirmation prompt
         * @param {object} actionsObject
         */
        $scope.checkout = function(actionsObject) {
            var checkoutActionObj = actionsObject.checkout;

            CPQService.invokeAction(checkoutActionObj).then(
                function(data) {
                    // TBD: data filtering needs to be removed and layoutname hardcoding needs to be removed
                    $log.debug('checkout', data);
                },
                function(error) {
                    $log.error('Checkout failed: ', error);
                    // TBD: handle error
                });
        };

    }]);

},{}],16:[function(require,module,exports){
angular.module('hybridCPQ')

.directive('cpqDropdownHandler', function($document) {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var onClick = function (event) {
                var isChild = element.has(event.target).length > 0;
                var isSelf = element[0] == event.target;
                var isInside = isChild || isSelf;
                if (!isInside) {
                    scope.$apply(attrs.cpqDropdownHandler);
                    $document.off('click', onClick);
                }
            };
            element.on('click', function() {
                $document.on('click', onClick);
            });
        }
    };
})

.filter('positive', function() {
    return function(input) {
        if (!input) {
            return 0;
        }

        return Math.abs(input);
    };
});

},{}],17:[function(require,module,exports){
angular.module('hybridCPQ')
.factory('CPQAdjustmentService', ['$rootScope', '$q', '$log', 'CPQ_CONST', 'CPQService', '$sldsModal', '$sldsToast',
    function($rootScope, $q, $log, CPQ_CONST, CPQService, $sldsModal, $sldsToast) {

    var dataRecords;

    var cellActions = {
        switchpayment : {
            layout : 'cpq-product-cart-item-cell-payment-choice',
        },
        pricedetail : {
            layout : 'cpq-product-cart-item-cell-detail',
        },
        applyadjustment : {
            layout : 'cpq-product-cart-item-cell-pricing',
        },
        getpromodetails : {
            layout : 'cpq-product-cart-item-cell-detail',
        }
    };
    var toastCustomLabels = {};
    var toastLabelsArray =  ['CPQAdjustmentPercentage','CPQAdjustmentAmount','CPQAdjustmentOverride'];
    // Custom labels for toast messages
    CPQService.setLabels(toastLabelsArray, toastCustomLabels);
        /* End Custom Labels */
    var adjustmentData = {
        'adjustment': {
            'types': [
                {'name': toastCustomLabels['CPQAdjustmentPercentage'] , 'detailType':'Adjustment', 'method':'Percent'},
                {'name': toastCustomLabels['CPQAdjustmentAmount'] , 'detailType':'Adjustment', 'method':'Absolute'},
                {'name': toastCustomLabels['CPQAdjustmentOverride'] , 'detailType':'Override', 'method':'Absolute'}
            ],
            'selected': {},
            'value': '',
        },
        'adjustmentCodes': {
            'selected': {},
            'list': []
        },
        'timePolicy': {
            'selected': {}
        },
        'timePlan': {
            'selected': {}
        }
    };

    // this is a map between actual field names and their corresponding alternative payment choice field names
    var alternativePaymentFields = {
        'OneTimeCharge__c': 'OneTimeLoyaltyPrice__c',
        'OneTimeTotal__c': 'OneTimeLoyaltyTotal__c',
        'OneTimeLoyaltyPrice__c': 'OneTimeCharge__c',
        'OneTimeLoyaltyTotal__c': 'OneTimeTotal__c'
    };

    function setModalScope(newScope, itemObject, field, type, parent) {
        var labelsArray;

        /* Custom Labels */
        newScope.customLabels = {};
        labelsArray = ['CPQClose','CPQApply','CPQDetails','CPQAdjustment','CPQPaymentChoice'];
        CPQService.setLabels(labelsArray, newScope.customLabels);
        /* End Custom Labels */

        newScope.layout = cellActions[type].layout;
        newScope.isDetailLayoutLoaded = false;
        newScope.editable = field.editable;
        newScope.parent = parent;
        newScope.obj = itemObject;
        newScope.field = field;

        return newScope;
    }

    function setTimelists (data) {
        var timeValues;
        data.map(function(item) {
            if (item.listkey === 'TimePlans') {
                timeValues = adjustmentData.timePlan;
            } else if (item.listkey === 'TimePolicies') {
                timeValues = adjustmentData.timePolicy;
            }

            timeValues.types = item.listvalues.map(function(element) {
                return element.fields;
            });
        });
    }

    function setAdjustmentCodes (data) {
        adjustmentData.adjustmentCodes.list = data.records[0].listvalues;
    }

    function resetDataRecords() {
        dataRecords = {};
    }

    function openModal (modalScope) {
        $sldsModal({
            backdrop: 'static',
            scope: modalScope,
            templateUrl: 'CPQCartItemCellModal.tpl.html',
            show: true,
            onHide: function() {
                if (dataRecords && dataRecords.length > 0) {
                    updateItemPrice(dataRecords, this.scope.obj);
                    resetDataRecords(dataRecords);
                    CPQService.reloadTotalBar();
                }
            }
        });
    }

    function updateItemPrice(records, obj) {
        var updatedRootItemId;
        if (obj[$rootScope.nsPrefix + 'RootItemId__c']) {
            updatedRootItemId = obj[$rootScope.nsPrefix + 'RootItemId__c'].value;
        } else {
            updatedRootItemId = records[0][$rootScope.nsPrefix + 'RootItemId__c'].value;
        }
        angular.forEach(records, function(item) {
            if (item.Id.value === updatedRootItemId) {
                //@TODO: Need to avoid rootScope event broadcast
                $rootScope.$broadcast('vlocity.cpq.cartitem.actions', 'viewmodel', {'item': item});
            }
        });
    }

    function checkAdjustmentValue(records) {
        var isValueValid, adjustmentType, adjustmentCode;
        isValueValid = (records.adjustment.value || records.adjustment.value === 0) ? true : false ;
        adjustmentType = records.adjustment.selected.name;
        adjustmentCode = records.adjustmentCodes.selected.fields;

        return ((isValueValid && adjustmentType) || adjustmentCode) ? true : false;
    }

    return {
        getData: function() {
            return adjustmentData;
        },

        getDisplayToActualFieldMap: function() {
            return displayToActualFields;
        },

        getAlternativePaymentFieldMap: function() {
            return alternativePaymentFields;
        },

        openApplyModal: function(modalScope, itemObject, field, type) {
            var timelistsPromice, adjustmentcodesPromise;
            var timelistsAction = field.actions.timelists;
            var adjustmentcodesAction = field.actions.adjustmentcodes;

            // Assigning adjustmentData to records
            modalScope.records = adjustmentData;

            // Show Apply modal
            modalScope.applyModal = true;
            modalScope.detailsModal = false;
            modalScope.paymentModal = false;

            // If data is loaded there is no need to call API again
            if (timelistsAction) {
                modalScope.isRecurring = true;
                if (!(adjustmentData.timePolicy.types && adjustmentData.timePlan.types)) {
                    timelistsPromice = CPQService.invokeAction(timelistsAction);
                }
            }

            adjustmentcodesPromise = CPQService.invokeAction(adjustmentcodesAction);

            $q.all({'timelists': timelistsPromice, 'adjustmentcodes': adjustmentcodesPromise}).then(function(data) {
                if (data.adjustmentcodes) {
                    setAdjustmentCodes(data.adjustmentcodes);
                }
                if (data.timelists) {
                    setTimelists(data.timelists.records);
                }

                modalScope = setModalScope(modalScope, itemObject, field, type);

                openModal(modalScope);
            });

            modalScope.isAdjustmentValueValid = function(records) {
                return checkAdjustmentValue(records);
            };
        },

        openDetailsModal: function(modalScope, itemObject, field, type) {
            var action = field.actions[type];

            // Show Details modal
            modalScope.applyModal = false;
            modalScope.detailsModal = true;
            modalScope.paymentModal = false;

            modalScope = setModalScope(modalScope, itemObject, field, type);

            CPQService.invokeAction(action).then(
                function(data) {
                    if (data.records) {
                        modalScope.records = data.records[0][field.fieldName][type];

                        openModal(modalScope);
                    }
                }, function(error) {
                    $log.error('CPQAdjustmentService get ' + type + ' response failed', error);
                });
        },

        openPaymentMethodModal: function(modalScope, itemObject, field, type, parent, alternativePaymentFieldMap) {
            var fieldName = field.fieldName.replace($rootScope.nsPrefix, '');
            var alternativePaymentFieldName = alternativePaymentFieldMap[fieldName];
            var alternativePaymentInfo = field.alternateValues;
            var alternativePaymentValue = alternativePaymentInfo[$rootScope.nsPrefix + alternativePaymentFieldName];

            // Show Payment modal
            modalScope.applyModal = false;
            modalScope.detailsModal = false;
            modalScope.paymentModal = true;

            field.currencyCode = itemObject.CurrencyCode;
            field.loyaltyCode = itemObject.LoyaltyCode;

            if (fieldName === 'OneTimeCharge__c') {
                
                field.currencyValue = alternativePaymentInfo[field.fieldName];
                field.loyaltyValue = alternativePaymentValue;

            } else if (fieldName === 'OneTimeLoyaltyPrice__c') {

                field.currencyValue = alternativePaymentValue;
                field.loyaltyValue = alternativePaymentInfo[field.fieldName];

            }

            modalScope = setModalScope(modalScope, itemObject, field, type, parent);

            openModal(modalScope);
        },

        apply: function(data, parent, action) {
            var deferred = $q.defer();
            var params = action.remote.params.adjustments[0];
            var adjustmentCode = data.adjustmentCodes.selected.fields;
            var adjustment = data.adjustment;
            var timePolicy = data.timePolicy;
            var timePlane = data.timePlane;

            params.AdjustmentValue = adjustment.value ? Number(adjustment.value) : params.AdjustmentValue;
            params.AdjustmentCode = adjustmentCode ? adjustmentCode.label : params.AdjustmentCode;
            params.AdjustmentMethod = adjustment.selected.method;
            params.AdjustmentType = adjustment.selected.detailType;

            // TimePlans, TimePolicies
            params.DetailType = adjustment.selected.detailType ? adjustment.selected.detailType.toUpperCase() : '' ;
            if (data.timePlan.selected.valuekey && data.timePolicy.selected.valuekey) {
                params.TimePlan = data.timePlan.selected.valuekey;
                params.TimePolicy = data.timePolicy.selected.valuekey;
            }

            CPQService.invokeAction(action).then(
                function(data) {

                    if (data.records) {
                        dataRecords = data.records;
                    }

                    if (angular.isUndefined(data.records) && data.messages && data.messages.length && data.messages[0].severity === CPQ_CONST.ERROR) {
                        deferred.reject(data.messages);
                        $sldsToast({
                            content: data.messages[0].message,
                            severity: 'error',
                            icon: 'warning',
                            autohide: true,
                            show: CPQService.toastEnabled('error')
                        });
                    }

                    deferred.resolve(data);
                }, function(error) {
                    $log.error('CPQAdjustmentService.apply response failed', error);
                    deferred.reject(error);
                });

            return deferred.promise;
        },

        delete: function(parent, action) {
            var deferred = $q.defer();

            CPQService.invokeAction(action).then(
              function(data) {

                if (data.records) {
                    dataRecords = data.records;
                }

                deferred.resolve(data);
            }, function(error) {
                $log.error('CPQAdjustmentService.delete response failed', error);
                deferred.reject(error);
            });

            return deferred.promise;
        }
    };

}]);

},{}],18:[function(require,module,exports){
angular.module('hybridCPQ')
.factory('CPQCardinalityService', ['$rootScope', function($rootScope) {

    function checkCardinalityForAddOrClone(parent, lineItemChildProduct, product2Id, additionalQuantity) {
        var parentInCartQuantityMap, numOfInstancesOfChildProductTypeUnderParent, pciCardinalityCheckPassed;
        var totalNumOfChildrenUnderParent, productId, groupCardinalityCheckPassed;

        parentInCartQuantityMap = parent[$rootScope.nsPrefix + 'InCartQuantityMap__c'];

        // if the parent has lineItem(s), it would have a cardinality map with value that records the number of instances
        // of each product type for us to check PCI Cardinality
        if (angular.isDefined(parentInCartQuantityMap) && parentInCartQuantityMap.value) {

            numOfInstancesOfChildProductTypeUnderParent = parentInCartQuantityMap.value[product2Id];

            // if lineItemChildProduct exists in cardinality map, then check PCI cardinality.
            // otherwise, set PCI check to be true so it could move on to check Group cardinality
            pciCardinalityCheckPassed = (numOfInstancesOfChildProductTypeUnderParent) ?
                numOfInstancesOfChildProductTypeUnderParent + additionalQuantity <= lineItemChildProduct.maxQuantity : true;

        // if the parent has no other lineItem, it would have undefined cardinality map value,
        // and we would set PCI check to be true so it could move on to check Group cardinality
        } else {

            pciCardinalityCheckPassed = true;

        }

        // if PCI cardinality check fails when parent has cardinality map value, we cannot let user add or clone
        if (!pciCardinalityCheckPassed) {
            return false;
        }

        if (angular.isDefined(parent.groupMaxQuantity)) {
            totalNumOfChildrenUnderParent = 0;

            // It is possible that the parent does not have cardinality map when it has no lineItem (especially in the case of productGroup parent).
            // So only count totalNumOfChildrenUnderParent when the parent does have cardinality map with value
            if (angular.isDefined(parentInCartQuantityMap) && angular.isDefined(parentInCartQuantityMap.value)) {
                for (productId in parentInCartQuantityMap.value) {
                    if (parentInCartQuantityMap.value.hasOwnProperty(productId)) {
                        totalNumOfChildrenUnderParent += parentInCartQuantityMap.value[productId];
                    }
                }
            }

            groupCardinalityCheckPassed = totalNumOfChildrenUnderParent + additionalQuantity <= parent.groupMaxQuantity;
            return groupCardinalityCheckPassed;
        } else {
            // this deals with products created before we implemented group cardinality on products
            return true; // pciCardinalityCheckPassed is true
        }
    }

    function removeAddonFromParent(parentInCardData, toBeRemovedAddonId) {
        var addonList;
        var addonListWithoutTheRemovedAddon = [];
        var i;

        if (parentInCardData.childProducts) {
            addonList = angular.copy(parentInCardData.childProducts.records);
            for (i = 0; i < addonList.length; i++) {
                if (addonList[i].Id.value !== toBeRemovedAddonId) {
                    addonListWithoutTheRemovedAddon.push(addonList[i]);
                }
            }
            parentInCardData.childProducts.records = addonListWithoutTheRemovedAddon;
        }
    }

    function changeLineItemCountInCardinalityMap(cardinalityMap, product2Id, changeQty) {
        var productCountInMap = cardinalityMap[product2Id];
        var productCountAfterChange;
        if (productCountInMap) {
            productCountAfterChange = productCountInMap + changeQty;
            if (productCountAfterChange > 0) {
                cardinalityMap[product2Id] = productCountAfterChange;
            } else {
                delete cardinalityMap[product2Id];
            }
        }
    }

    function removeLineItemFromParent(parentInCardData, toBeRemovedLineItemId, addonProductFromAPI) {
        var lineItemList;
        var lineItemListWithoutTheRemovedItem = [];
        var i;
        var currentLineItem;

        if (parentInCardData.lineItems) {

            lineItemList = angular.copy(parentInCardData.lineItems.records);
            for (i = 0; i < lineItemList.length; i++) {
                currentLineItem = lineItemList[i];
                if (currentLineItem.Id.value !== toBeRemovedLineItemId) {
                    lineItemListWithoutTheRemovedItem.push(currentLineItem);
                }
            }

            // Delete the lineItem from parent by replacing the existing lineItems under the parent
            // by an array without the to-be-deleted lineItem
            parentInCardData.lineItems.records = lineItemListWithoutTheRemovedItem;
        }
    }

    return {

        checkIfAddonIsNotInCart : function(parent, addonChildProduct) {
            var parentCardinalityMap;
            var isParentCardinalityMapEmpty;
            var addonCountInParentCardinalityMap;
            parentCardinalityMap = parent[$rootScope.nsPrefix + 'InCartQuantityMap__c'];
            // if parent cardinality map does EXIST and NOT EMPTY and addon child product has a count in the map
            if (parentCardinalityMap && parentCardinalityMap.value && !_.isEmpty(parentCardinalityMap.value) &&
                addonChildProduct.Product2 && addonChildProduct.Product2.Id && parentCardinalityMap.value[addonChildProduct.Product2.Id]) {
                return false; // the child product must have been added to cart
            } else {
                return true; // the child product has not been added to the cart
            }
        },

        checkCardinalityForAdd : function(parent, lineItemChildProduct) {
            var product2Id = lineItemChildProduct.PricebookEntry.Product2.Id;
            // addToCart lineItem will be added with default quantity, except when it is 0.  In the latter case, we will add quantity of 1.
            var additionalQuantity = (lineItemChildProduct.defaultQuantity > 0) ? lineItemChildProduct.defaultQuantity : 1;
            return checkCardinalityForAddOrClone(parent, lineItemChildProduct, product2Id, additionalQuantity);
        },

        checkCardinalityForClone : function(parent, lineItemChildProduct) {
            var product2Id = lineItemChildProduct.PricebookEntry.Product2.Id;
            // clone lineItem will be added with the quantity of the lineItem, except when user typed a 0 which we forbid.
            // In the latter case, we will forbid user from cloning the lineItem.
            var additionalQuantity = lineItemChildProduct.Quantity.value;
            return (additionalQuantity > 0) ? checkCardinalityForAddOrClone(parent, lineItemChildProduct, product2Id, additionalQuantity) : false;
        },

        checkCardinalityForDelete : function(parent, lineItemChildProduct) {
            var parentInCartQuantityMap, numOfInstancesOfChildProductTypeUnderParent, pciCardinalityCheckPassed;
            //var totalNumOfChildrenUnderParent, productId, groupCardinalityCheckPassed;

            parentInCartQuantityMap = parent[$rootScope.nsPrefix + 'InCartQuantityMap__c'];

            // If the parent has lineItem(s), it would have a cardinality map with value that records the number of instances
            // of each product type for us to check PCI Cardinality
            if (angular.isDefined(parentInCartQuantityMap) && parentInCartQuantityMap.value) {
                numOfInstancesOfChildProductTypeUnderParent = parentInCartQuantityMap.value[lineItemChildProduct.PricebookEntry.Product2.Id];

                // if user typed 0 in quantity input, we will get an undefined value here
                if (angular.isUndefined(lineItemChildProduct.Quantity.value)) {

                    return true; // we need to let them delete using the delete icon because we forbid them setting quantity to 0

                // if user typed non-zero value in quantity input
                } else {
                    pciCardinalityCheckPassed = numOfInstancesOfChildProductTypeUnderParent - lineItemChildProduct.Quantity.value >= lineItemChildProduct.minQuantity;
                }

            // If the parent has no other lineItem, it would have undefined cardinality map value,
            // and we would set PCI check to be true so it could move on to check Group cardinality
            } else {
                pciCardinalityCheckPassed = true;
            }

            // If PCI cardinality check fails when parent has cardinality map value, we cannot let user delete
            return pciCardinalityCheckPassed;

            // Commenting out below groupMaxQuantity cardinality check based on HYB-1383

            // if (angular.isDefined(parent.groupMaxQuantity)) {
            //     totalNumOfChildrenUnderParent = 0;
            //     for (productId in parentInCartQuantityMap.value) {
            //         if (parentInCartQuantityMap.value.hasOwnProperty(productId)) {
            //             totalNumOfChildrenUnderParent += parentInCartQuantityMap.value[productId];
            //         }
            //     }

            //     groupCardinalityCheckPassed = totalNumOfChildrenUnderParent - lineItemChildProduct.Quantity.value >= parent.groupMinQuantity;
            //     return groupCardinalityCheckPassed;
            // } else {
            //     // this deals with products created before we implemented group cardinality on products
            //     return true; // pciCardinalityCheckPassed is true
            // }
        },

        checkCardinalityForAddon : function(parent, addonChildProduct) {
            var product2Id = addonChildProduct.Product2.Id;
            var maxQuantity = addonChildProduct.maxQuantity;
            var additionalQuantity, groupCardinalityCheckPassed;

            // If the Addon has maxQuantity, then it cannot be added to cart
            if (maxQuantity === 0) {
                return false;
            }

            // addToCart Addon will be added with default quantity, except when it is 0.  In the latter case, we will add quantity of 1.
            additionalQuantity = (addonChildProduct.defaultQuantity > 0) ? addonChildProduct.defaultQuantity : 1;

            if (parent[$rootScope.nsPrefix + 'InCartQuantityMap__c'] && parent[$rootScope.nsPrefix + 'InCartQuantityMap__c'].value) {

                // Even though this is Addon with an "Add to Cart" button, but we still need to check for both PCI besides Group
                // cardinality because the first time when user clicks on the "Add to Cart" button, there is no instance of it,
                // but if the user do fast succsessive clicks, there would be other instances of it so PCI cardinality needs to be considered
                return checkCardinalityForAddOrClone(parent, addonChildProduct, product2Id, additionalQuantity);
            } else {
                // If there is no cardinality map in the parent, then it means this Addon will be the only one under the parent.
                // Simply check if the additional quantity would exceed groupMaxQuantity to decide if addToCart on this Addon is allowed.
                groupCardinalityCheckPassed = additionalQuantity <= parent.groupMaxQuantity;
                return groupCardinalityCheckPassed;
            }
        },

        hasLineItemAlreadyBeenAddedToParent : function(parentInCardData, toBeAddedLineItem) {
            var toBeAddedLineItemHasBeenAdded = false;
            var numOfLineItemsUnderParent, i;
            if (!parentInCardData.lineItems) {
                return toBeAddedLineItemHasBeenAdded;
            }
            numOfLineItemsUnderParent = parentInCardData.lineItems.records.length;
            for (i = 0; i < numOfLineItemsUnderParent; i++) {
                if (parentInCardData.lineItems.records[i].Id.value === toBeAddedLineItem.Id.value) {
                    toBeAddedLineItemHasBeenAdded = true;
                    break;
                }
            }
            return toBeAddedLineItemHasBeenAdded;
        },

        insertLineItemToParent : function(parentInCardData, toBeAddedLineItem) {
            var addonList;
            var lineItemListWithTheAddedItem = [];
            if (!parentInCardData.lineItems) {
                parentInCardData.lineItems = {'records': [{}]};
            } else {
                lineItemListWithTheAddedItem = angular.copy(parentInCardData.lineItems.records);
            }
            lineItemListWithTheAddedItem.push(toBeAddedLineItem);
            parentInCardData.lineItems.records = lineItemListWithTheAddedItem;

            // 1) If the to-be-added lineItem is an Optional product (Definition: minQuantity=0) and has defaultQuantity > 0,
            // that means it was a lineItem initially because defaultQuantity > 0,
            // but subsequently it was deleted and was removed from lineItems json array, but was added to as an Addon
            // in childProducts array.  Now that we are adding it back to lineItems, we also need to remove
            // the corresponding Addon in childProducts.
            // 2) We don't need to do this for Optional products (Definition: minQuantity=0) and have defaultQuantity = 0, because
            // they always have an Addon in the childProducts array.
            // 3) We also do not need to do this for Required products (Definition: minQuantity>0) as they cannot be
            // completely deleted and would never have a representation in the childProducts array.
            if (toBeAddedLineItem.minQuantity === 0 && toBeAddedLineItem.defaultQuantity > 0) {
                removeAddonFromParent(parentInCardData, toBeAddedLineItem.PricebookEntryId.value);
            }
        },

        deleteLineItem : function(parentInCardData, toBeRemovedLineItem, addonProductFromAPI, cardinalityMapAlreadyUpdated, provisioningStatusActive) {
            var toBeRemovedLineItemId = toBeRemovedLineItem.Id.value;
            var parentInCardDataCardinalityMap, toBeRemovedLineItemProduct2Id, toBeRemovedLineItemQuantity;
            var addonProductIsLastInstanceUnderParent;
            var numOfLineItemsUnderParent, numOfChildProductsUnderParent;
            var i, j;
            var lineItemUnderParent;
            var provisioningStatusDeleted;

            if (!cardinalityMapAlreadyUpdated) {
                parentInCardDataCardinalityMap = parentInCardData ? parentInCardData[$rootScope.nsPrefix + 'InCartQuantityMap__c'].value : null;
                toBeRemovedLineItemProduct2Id = toBeRemovedLineItem.PricebookEntry.Product2.Id;
                toBeRemovedLineItemQuantity = toBeRemovedLineItem.Quantity.value;
                if (parentInCardDataCardinalityMap) {
                    changeLineItemCountInCardinalityMap(parentInCardDataCardinalityMap, toBeRemovedLineItemProduct2Id, toBeRemovedLineItemQuantity * -1);
                }
            }

            if (!provisioningStatusActive) {
                removeLineItemFromParent(parentInCardData, toBeRemovedLineItemId, addonProductFromAPI);
            }

            // 1) Only Optional products (Definition: minQuantity=0) with defaultQuantity > 0 would need to be put into childProducts
            // if there is NONE OTHER instance of it under the parent, such that it would show up with "Add to Cart" button.
            // 2) For Optional products (Definition: minQuantity=0) with defaultQuantity = 0,
            // they are always in childProducts and addonProduct returned from the deleteAPI would be null.
            // 3) Required products (Definition: minQuantity>0) would never have a representation in the childProducts array
            // and addonProduct returned from the deleteAPI would be null.

            // For Case 1: Optional products (Definition: minQuantity=0) with defaultQuantity > 0
            if (addonProductFromAPI && addonProductFromAPI.minQuantity === 0 && addonProductFromAPI.defaultQuantity > 0) {

                // Only do the following to remove the childProduct representation of the lineItem if parent is NOT collapsable
                if (!parentInCardData.actions || (parentInCardData.actions && !parentInCardData.actions.getproducts)) {

                    // Check to see if addonProduct is the last instance under the parent
                    addonProductIsLastInstanceUnderParent = true;
                    numOfLineItemsUnderParent = parentInCardData.lineItems.records.length;

                    for (i = 0; i < numOfLineItemsUnderParent; i++) {

                        lineItemUnderParent = parentInCardData.lineItems.records[i];
                        provisioningStatusDeleted = lineItemUnderParent[$rootScope.nsPrefix + 'ProvisioningStatus__c'] && lineItemUnderParent[$rootScope.nsPrefix + 'ProvisioningStatus__c'].value.toLowerCase() === 'deleted' ? true : false;

                        // Only lineItems of parent that are not "Deleted" in its provisioning status would be counted as actual instance of the optional addOn
                        if (!provisioningStatusDeleted && (lineItemUnderParent.PricebookEntry.Product2.Id === addonProductFromAPI.Product2.Id)) {
                            addonProductIsLastInstanceUnderParent = false;
                        }

                    }

                    // Only insert addonProduct into childProducts if it is the last instance of its product2 type under the parent,
                    // because this is Case 1: Optional products (Definition: minQuantity=0) with defaultQuantity > 0,
                    // as such, ONLY 1 addon needs to be in childProducts
                    if (addonProductIsLastInstanceUnderParent) {

                        if (!parentInCardData.childProducts) {
                            parentInCardData.childProducts = {};
                            parentInCardData.childProducts.records = [];
                        }

                        parentInCardData.childProducts.records.push(addonProductFromAPI);
                    }

                }

            // For Case 2: Optional products (Definition: minQuantity=0) with defaultQuantity = 0
            } else if (addonProductFromAPI && addonProductFromAPI.minQuantity === 0 && addonProductFromAPI.defaultQuantity === 0) {

                if (parentInCardData.actions && parentInCardData.actions.getproducts) {
                    // remove childProduct from parent if the parent is Collapsable
                    removeAddonFromParent(parentInCardData, toBeRemovedLineItem.PricebookEntryId.value);
                } else {

                    // Replace it by the (updated) one from API
                    numOfChildProductsUnderParent = parentInCardData.childProducts.records.length;
                    for (j = 0; j < numOfChildProductsUnderParent; j++) {
                        if (parentInCardData.childProducts.records[j].Product2.Id === addonProductFromAPI.Product2.Id) {
                            parentInCardData.childProducts.records[j] = addonProductFromAPI;
                            break;
                        }
                    }

                }

            }

        },

        findLineItem : function(searchLineItemId, lineItemList) {
            var foundLineItem = null;
            var i, j;
            for (i = 0; i < lineItemList.length; i++) {
                if (lineItemList[i].Id.value === searchLineItemId) {
                    foundLineItem = lineItemList[i];
                    break;
                }
            }
            if (foundLineItem !== null) {
                return foundLineItem;
            } else {
                for (j = 0; j < lineItemList.length; j++) {
                    if (lineItemList[j].lineItems && lineItemList[j].lineItems.records.length > 0) {
                        return findLineItem(searchLineItemId, lineItemList[j].lineItems.records);
                    }
                }
            }
        },

        findProductGroupWithLineItemsInsideNode : function(searchNode) {
            var i, foundProductGroup;

            if (searchNode.lineItems && searchNode.lineItems.records && searchNode.lineItems.records.length > 0) {

                return searchNode;

            } else if (searchNode.productGroups && searchNode.productGroups.records && searchNode.productGroups.records.length > 0) {

                for (i = 0; i < searchNode.productGroups.records.length; i++) {
                    foundProductGroup = this.findProductGroupWithLineItemsInsideNode(searchNode.productGroups.records[i]);
                    if (foundProductGroup) {
                        return foundProductGroup;
                    }
                }

            } else {

                return null;

            }

        },

        findProductGroupsWithLineItemsAmongNodeList : function(searchNodeList) {
            var i, searchNode, foundProductGroup, foundProductGroups;

            foundProductGroups = [];

            for (i = 0; i < searchNodeList.length; i++) {
                searchNode = searchNodeList[i];
                foundProductGroup = this.findProductGroupWithLineItemsInsideNode(searchNode);
                if (foundProductGroup) {
                    foundProductGroups.push(foundProductGroup);
                }
            }

            return foundProductGroups;
        },

        findProductGroupInsideNode : function(searchId, searchProductHierarchyPath, searchNode) {
            var i, j, foundProductGroup;

            // A product group has Id.value as product2Id, instead of lineItemId. Since that is not unique,
            // we also need to compare productHierarchyPath
            if (searchNode.Id.value === searchId && searchNode.productHierarchyPath === searchProductHierarchyPath) {

                return searchNode;

            } else {

                if (searchNode.productGroups && searchNode.productGroups.records && searchNode.productGroups.records.length > 0) {

                    for (i = 0; i < searchNode.productGroups.records.length; i++) {
                        foundProductGroup = this.findProductGroupInsideNode(searchId, searchProductHierarchyPath, searchNode.productGroups.records[i]);
                        if (foundProductGroup) {
                            return foundProductGroup;
                        }
                    }

                } else if (searchNode.lineItems && searchNode.lineItems.records && searchNode.lineItems.records.length > 0) {

                    for (j = 0; j < searchNode.lineItems.records.length; j++) {
                        foundProductGroup = this.findProductGroupInsideNode(searchId, searchProductHierarchyPath, searchNode.lineItems.records[j]);
                        if (foundProductGroup) {
                            return foundProductGroup;
                        }
                    }

                } else {

                    return null;

                }

            }
        },

        findProductGroupAmongNodeList : function(searchId, searchProductHierarchyPath, searchNodeList) {
            var i, searchNode, foundProductGroup;

            for (i = 0; i < searchNodeList.length; i++) {
                searchNode = searchNodeList[i];
                foundProductGroup = this.findProductGroupInsideNode(searchId, searchProductHierarchyPath, searchNode);
                if (foundProductGroup) {
                    return foundProductGroup;
                }
            }

            return null;
        }

    };
}]);

},{}],19:[function(require,module,exports){
angular.module('hybridCPQ')
.factory('CPQCartItemConfigService', [function() {
    var itemFields = {};

    function setFieldName(fields) {
        var fildName;

        angular.forEach(fields, function(field) {
            fildName = field.name.match(/\[([^\]]+)]/);

            if (fildName && fildName.length > 0) {
                field.fieldName = fildName[1].replace(/(^'|'$)/g, '');
            } else {
                field.fieldName = field.name;
            }
        });
        return fields;
    }

    return {
        getItemFields : function(itemObject) {
            angular.forEach(itemFields, function(field) {
                if (itemObject[field.fieldName]) {
                    _.merge(itemObject[field.fieldName], field.data);
                }
            });
            return itemObject;
        },
        configureFields : function(fields) {
            if (fields && fields.length > 0) {
                itemFields = setFieldName(fields);
            }
        }
    };

}]);

},{}],20:[function(require,module,exports){
angular.module('hybridCPQ')
.factory('CPQCartItemCrossActionService', ['$log', '$rootScope', '$q', '$timeout', 'CPQService',
    function($log, $rootScope, $q, $timeout, CPQService) {
        //Constants
        var ADD_ACTION = 'add';
        var DELETE_ACTION = 'delete';
        var UPDATE_ACTION = 'update';
        var UPDATE_PRICES_ACTION = 'updateprices';
        //CART item cross action service. Includes add, delete, update and replace actions

        /**
         * [crossAction description]
         * @param  {string}  mode          [description]
         * @param  {object}  obj           [description]
         * @param  {Boolean} isNewRootItem [description]
         */
        function crossAction (mode, obj, isNewRootItem) {
            //@TODO: Need to avoid rootScope and use cart controller event broadcast
            mode = mode && mode.toLowerCase();
            //Check if it's a new root item. For adding a root level record,
            //we need to publish a cart event rather than cart item event.
            if (mode === 'add' && isNewRootItem) {
                $rootScope.$broadcast('vlocity.cpq.cart.addrecords', [obj.records]);
                return;
            }

            $rootScope.$broadcast('vlocity.cpq.cartitem.actions', mode, obj);
        }

        return {
            'processActions': function (clientActionsObject) {
                var self, i, j, deferred, actionPromise, actionType, clientAction, records, deletedItemIds, isRootItemUpdated;

                if (!clientActionsObject) {
                    return;
                };

                self = this;

                /**
                 * actionProcessor - private function
                 * @param  {string}  type          action type
                 * @param  {object}  record        record
                 * @param  {Boolean} isNewRootItem If record is root element, isNewRootItem is true
                 * @param  {object}  addonProduct  addonProduct object used on auto delete of line item to replace it.
                 */
                function actionProcessor(type, record, isNewRootItem, addonProduct) {
                    if (!type || !record) {
                        return;
                    }
                    $timeout(function() {
                        try {
                            if (type === 'delete') {
                                crossAction(type, {'itemId': record.Id, 'addonProduct': addonProduct});
                            }else {
                                crossAction(type, {records: record}, isNewRootItem);
                            }
                        }catch (e) {}
                    }, 0);
                }

                /**
                 * deleteItemProcessor - private function
                 * @param  {object} child
                 */
                function deleteItemProcessor (deletedItemIds, record, child) {
                    if (!(child && child.deletedItemIds)) {
                        return;
                    }

                    deletedItemIds.forEach(function(idObject) {
                        if (angular.isDefined(child.deletedItemIds) && child.deletedItemIds.indexOf(idObject.Id) > -1) {
                            //Same addon can be used for adding multiple deleted lineitems eg: when cloned line items are deleted
                            delete child.deletedItemIds;

                            actionProcessor(DELETE_ACTION, idObject, false, child, record);
                        }
                    });
                }

                for (actionType in clientActionsObject) {
                    clientAction = clientActionsObject[actionType].client;
                    records = clientAction && clientAction.records;

                    if (actionType === 'itemdeleted') {
                        //@TODO: use records. Temporary fix.
                        deletedItemIds = clientAction.params.items;
                    }

                    if (actionType === 'itempricesupdated') {
                        CPQService.invokeAction(clientActionsObject[actionType]).then(function(data) {
                            actionProcessor(UPDATE_PRICES_ACTION, data.records);
                        }, function(error) {
                            $log.error('getCartLineItemPrices response failed', error);
                        });
                    }

                    if (actionType === 'addtocart') {
                        deferred = $q.defer();

                        CPQService.invokeAction(clientActionsObject[actionType]).then(function(data) {
                            // Temporary fix for cmt-1895.
                            // Uses recursive promise resolution to reload the totalbar
                            // @TODO: Revisit once API issues for cmt-1895 is addressed
                            if (data.actions) {
                                actionPromise = self.processActions(data.actions);
                                $q.when(actionPromise).then(function(data){
                                    deferred.resolve(data);
                                },function(error){
                                    deferred.reject(error);
                                });
                            }else {
                                deferred.resolve(data);
                            }
                        }, function(error) {
                            deferred.reject(error);
                        });
                    }

                    if (records) {
                        //Handle the multiple records for actions.
                        //Eg: addtocart action can have 2 records belonging to 2 different root items
                        records.forEach(function(record) {
                            var itemChildRecords;
                            switch (actionType) {
                                case 'itemadded':
                                    actionProcessor(ADD_ACTION, record);
                                    break;
                                case 'rootitemadded':
                                    actionProcessor(ADD_ACTION, record, true);
                                    break;
                                case 'itemdeleted':
                                    // Find the deleted item PCR from childProducts or from productGroups.
                                    // Basically if the returned PCR(which replaces deleted item) is under Product group, it contains
                                    // parent line item, product group and then PCR. Nearest real parent is returned.
                                    itemChildRecords = record.childProducts && record.childProducts.records || record.productGroups && record.productGroups.records;

                                    if (!record.isRootRecord && itemChildRecords) {
                                        itemChildRecords.forEach(function(child) {
                                            if (child.isVirtualItem) {
                                                child.childProducts.records.forEach(function(productGroupChild) {
                                                    deleteItemProcessor (deletedItemIds, record, productGroupChild);
                                                });
                                            }else {
                                                deleteItemProcessor (deletedItemIds, record, child);
                                            }
                                        });

                                    } else {
                                        //Root item deleted
                                        actionProcessor(DELETE_ACTION, record);
                                    }
                                    break;
                                case 'itemupdated':
                                    actionProcessor(UPDATE_ACTION, record);
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                }
                return deferred && deferred.promise;
            }
        };
    }]);

},{}],21:[function(require,module,exports){
angular.module('hybridCPQ')
.factory('CPQDynamicMessagesService', ['$sldsToast', 'CPQService', '$log', '$sldsModal', '$q',
 function($sldsToast, CPQService, $log, $sldsModal, $q){
    var toastCustomLabels = {};
    var toastLabelsArray = ['CPQFetchingRules','CPQFetchRuleFailed','CPQFetchRuleCompleted'];
    CPQService.setLabels(toastLabelsArray, toastCustomLabels);
    return{
        viewReasons: function(){
            var procesingMessageToast = $sldsToast({
                message: toastCustomLabels['CPQFetchingRules'] + ' ' + ' ...',
                severity: 'info',
                icon: 'info',
                templateUrl: 'SldsToast.tpl.html',
                show: CPQService.toastEnabled('info')
            });
            return procesingMessageToast;
        },

        getRuleMessagesPromise: function(obj, procesingMessageToast, getRuleMessagesAction, modalScopeParam, modalScopeObj){
            var deferred = $q.defer();
            var getRuleMessagesActionObj = getRuleMessagesAction;

            if (getRuleMessagesActionObj) {

                CPQService.invokeAction(getRuleMessagesActionObj).then(
                    function(data) {
                        $log.debug(data);
                        procesingMessageToast.hide();
                        var modalScope = modalScopeParam;
                        var productDetailsModal;
                        modalScope.isDetailLayoutLoaded = false;
                        modalScope.saving = false;
                        modalScope.obj = modalScopeObj;
                        modalScope.reasons = [data];
                        productDetailsModal = $sldsModal({
                            backdrop: 'static',
                            scope: modalScope, 
                            templateUrl: 'CPQProductPromoItemReasonDetail.tpl.html',
                            show: true
                        });

                        deferred.resolve(toastCustomLabels['CPQFetchRuleCompleted']);

                    }, function(error) {
                        $log.error(error);
                        procesingMessageToast.hide();
                        $sldsToast({
                            title: toastCustomLabels['CPQFetchRuleFailed'],
                            content: error.message,
                            severity: 'error',
                            icon: 'warning',
                            autohide: true,
                            show: CPQService.toastEnabled('error')
                        });
                        deferred.reject(toastCustomLabels['CPQFetchRuleFailed']);
                    });
            } else {
                $log.debug(toastCustomLabels['CPQFetchRuleFailed']);
                deferred.reject(toastCustomLabels['CPQFetchRuleFailed']);
            }
            return deferred.promise;
        }
    };
}]);

},{}],22:[function(require,module,exports){
angular.module('hybridCPQ')
.factory('CPQItemDetailsService', ['CPQService', '$sldsModal', '$rootScope', 'CPQSettingsService',
    function(CPQService, $sldsModal, $rootScope, CPQSettingsService) {

    var bundleMessages, rootBundle, cartDataStore, customSettings;
    var processing = {};

    cartDataStore = CPQService.dataStore;
    customSettings = CPQSettingsService.getCustomSettings();

    function updateLineItemOnClose(item, scope) {
        scope.$parent.$broadcast('vlocity.cpq.cartitem.actions', 'viewmodel', {'item': item});
    }

    function getBundleMessages(record) {
        messages = [];
        angular.forEach(cartDataStore.messages, function(message) {
            if (record.Id.value === message.bundleId) {
                messages.push(message);
            }
        });

        return messages;
    }

    function escapeCharacters(messageId) {
        //Escaping characters in message id e.g.: 80241000004zQD1AAM|01t410000031GH1AAM<01t410000031GHaAAM
        messageId = messageId.replace('|', '\\|');
        messageId = messageId.replace(/</g, '\\<');
        return messageId;
    }

    function findBundleMessageByProductHierarchyPath(productHierarchyPath) {
        var messages, messageOffset, lastSearchFlag, lastSeparatorPos, remainingProductHierarchyPath;
        lastSearchFlag = false;
        remainingProductHierarchyPath = escapeCharacters(productHierarchyPath);

        // Delete parentLineItemId
        lastSeparatorPos = remainingProductHierarchyPath.lastIndexOf('\|');
        remainingProductHierarchyPath = remainingProductHierarchyPath.substring(lastSeparatorPos + 1);

        while (!lastSearchFlag) {
            lastSeparatorPos = remainingProductHierarchyPath.lastIndexOf('\<');
            if (lastSeparatorPos === -1) {
                lastSearchFlag = true;
                break;
            }
            // strip off the part of the product hierarchy that has been used for searching
            remainingProductHierarchyPath = remainingProductHierarchyPath.substring(0, lastSeparatorPos - 1);
            // search for the next high up parent
            messages = angular.element('.js-cart-error-container .js-cpq-cart-product-hierarchy-path-' + remainingProductHierarchyPath);
            messageOffset = messages.offset() && messages.offset().top;
            // if next high up parent is found
            if (angular.isDefined(messageOffset)) {
                messages.css('color', 'red');
                break;
            }
        }

        return messages;
    }

    function scrollBundleMessageToTop(messages, messageIndex) {
        var container, containerOffset, messageOffset, elementOffset;
        container = angular.element('.js-cart-error-container');
        containerOffset = container.offset() && container.offset().top;

        if (messageIndex && messages[messageIndex]) {
            messageOffset = messages.eq(messageIndex).offset() && messages.eq(messageIndex).offset().top;
        } else {
            messageOffset = messages.offset() && messages.offset().top;
        }

        if (angular.isDefined(containerOffset) && angular.isDefined(messageOffset)) {
            elementOffset = messageOffset - containerOffset;
            // Scroll error message to top of page
            angular.element('.slds-modal__content').scrollTop(elementOffset + 25);
        }
    }

    function navigateToMessage(messageId) {
        var messages;

        //  Navigate directly to the message
        if (messageId) {
            messages = angular.element('.js-cart-error-container .js-error-msg-' + escapeCharacters(messageId));

            if (!messages.length) {
                // If LevelBasedApproach is enabled
                messages = findBundleMessageByProductHierarchyPath(messageId);
            }
        }

        if (messages) {
            scrollBundleMessageToTop(messages);
        }
    }

    function navigateToNextMessage(messageIndex) {
        var messages, messageId;

        //  Navigate to the next message
        if (angular.isDefined(messageIndex)) {
            // Get list error messages
            messages = angular.element('.js-cart-error-container [class*=js-error-msg]:not(:empty)');

            if (!messages.length || !messages[messageIndex]) {
                // If LevelBasedApproach is enabled
                messageId = bundleMessages[messageIndex].messageId;
                messages = findBundleMessageByProductHierarchyPath(messageId);
            }
        }

        if (messages) {
            scrollBundleMessageToTop(messages, messageIndex);
        }
    }

    return {
        isDetailModalOpen : false,
        bundleErrors : {},
        setProcessingFlag : function(submit, error) {
            processing.submit = submit;
            processing.error = error;
        },
        openDetailModal : function(record, scope, detailViewUseAPI, message) {
            var self = this;
            var labelsArray;
            var messageIndex = 0;
            var unbindEvents = [];
            this.isDetailModalOpen = true;

            var modalScope = scope.$new();

            rootBundle = record;

            bundleMessages = getBundleMessages(record);

            /* Custom Labels */
            modalScope.customLabels = {};
            labelsArray = ['CPQClose','CPQLineitemDetailsTitle','CPQLineitemDetailsMsgNavigation'];
            CPQService.setLabels(labelsArray, modalScope.customLabels);
            /* End Custom Labels */

            modalScope.nextMsgFlagOn = (customSettings['Toggle Next Message Flag'] ?
                (customSettings['Toggle Next Message Flag'].toLowerCase() === 'on') : false);
            modalScope.numberMessages = bundleMessages.length;
            modalScope.currentIndex = 0;
            modalScope.isSubmit = false;
            modalScope.lineItem = record.Id.value;
            modalScope.processing = processing;
            modalScope.processing.bundleErrors = this.bundleErrors;
            modalScope.cartDataStore = cartDataStore;

            // if no API call is desired, the don't display the spinner and load the root bundle into lineItems variable.
            // The CPQLineItemDetails.tpl.html template for preview modal will load the root bundle into layout $scope.records.
            // In Card Framework, once $scope.records has value, it will NOT use datasource of the layout to retrieve data.
            if (!detailViewUseAPI) {
                modalScope.lineItems = [record];
            }

            if (message) {
                unbindEvents[unbindEvents.length] =
                    modalScope.$on('vlocity.cpq.cart.lineitem.modal.post.render.messages', function(e) {
                        navigateToMessage(message.messageId);
                    });
            }

            unbindEvents[unbindEvents.length] = modalScope.$watchCollection('processing', function(newVal) {
                modalScope.isSubmit = modalScope.processing.submit;
                modalScope.hasError = modalScope.processing.error || (Object.keys(processing.bundleErrors).length ? true : false);
            });

            unbindEvents[unbindEvents.length] = modalScope.$watch('cartDataStore.messages', function() {
                bundleMessages = getBundleMessages(rootBundle);
                // Update number of messages
                modalScope.numberMessages = bundleMessages.length;
                if (modalScope.currentIndex > modalScope.numberMessages) {
                    modalScope.currentIndex = 0;
                }
            });

            modalScope.scrollToNextBundleMessage = function() {
                navigateToNextMessage(messageIndex);
                modalScope.currentIndex = ++messageIndex;
                if (messageIndex >= modalScope.numberMessages) {
                    messageIndex = 0;
                }
            };

            modalScope.closeModal = function(item) {
                self.isDetailModalOpen = false;
                updateLineItemOnClose(item[0], scope);
            };

            $sldsModal({
                backdrop: 'static',
                scope: modalScope,
                templateUrl: 'CPQLineItemDetails.tpl.html',
                show: true,
                onHide: function() {
                    //Removes all listeners
                    unbindEvents.forEach(function (fn) {
                        fn();
                    });
                }
            });
        }
    };
}])
.directive('postRender', ['$timeout', '$rootScope', function($timeout, $rootScope) {
    return {
        restrict : 'A',
        link : function(scope, element, attrs) {
            var callFunc = function() {
                if (attrs.isItemDetails) {
                    $rootScope.$broadcast('vlocity.cpq.cart.lineitem.modal.post.render.messages');
                }
            };
            $timeout(callFunc, 0);  //Calling a scoped method
        }
    };
}]);

},{}],23:[function(require,module,exports){
angular.module('hybridCPQ').factory('CPQLevelBasedApproachService', ['$rootScope', 'CPQService', 'CPQItemDetailsService', 'CPQCardinalityService', '$sldsToast',
    function($rootScope, CPQService, CPQItemDetailsService, CPQCardinalityService, $sldsToast) {
    return {
        hasNodeBeenOpened : function(node) {
            // if there are NO children
            if (!angular.isDefined(node.lineItems) &&
                !angular.isDefined(node.childProducts) &&
                !angular.isDefined(node.productGroups) &&
                !angular.isDefined(node.childAssets)) {
                // node has NOT been opened
                return false;
            } else {
                // node as been opened
                return true;
            }

        },
        determineChildProdOpenOrCloseInitially : function(childProd) {
            // If level-based approach is off BUT node is configured as Collapse Hierarchy (with a search bar to find addons),
            // then we should open the node to show the search bar
            if (angular.isDefined(childProd.actions) &&
                (!angular.isDefined(childProd.actions.expanditems) && angular.isDefined(childProd.actions.getproducts))) {
                return true;
            }

            // if node is expandable (due to level-based API on)
            if (angular.isDefined(childProd.actions) &&
                angular.isDefined(childProd.actions.expanditems)) {

                // if there are NO children
                if (!this.hasNodeBeenOpened(childProd)) {
                    // display close icon because user would have to manually click on node to open it and retrieve children
                    return false;
                // if there are children (may have been opened and retrieved before)
                } else {
                    // Display open icon
                    return true;
                }

            // if node is NOT expandable (due to level-based API turned on BUT node has NO children OR level-based API turned off)
            } else {
                // if there are NO children
                if (!this.hasNodeBeenOpened(childProd)) {

                    // if this is the main cart
                    if (!CPQItemDetailsService.isDetailModalOpen) {
                        // Display close icon
                        return false;

                    // if this is inside the view modal
                    } else {

                        // if there are attributes
                        if (angular.isDefined(childProd.attributeCategories) &&
                            angular.isDefined(childProd.attributeCategories.records) &&
                            childProd.attributeCategories.records.length > 0) {

                            // Display open icon
                            return true;

                        // if there are NO attributes
                        } else {

                            // Display close icon
                            return false;
                        }
                    }

                // if there are children
                } else {
                    // Display open icon
                    return true;
                }

            }
        },
        determineChildProdOpenOrCloseAfterClick : function(childProd, childProdState, setProcessingLineCallback, scopeId) {
            var expanditemsActionObj, parentInCardData, parentFromAPI, toBeAddedLineItem, toBeAddedChildProduct, toBeAddedProductGroup;

            // user clicked on "close" state means he/she wants to open
            if (!childProdState) {

                // If level-based approach is off BUT node is configured as Collapse Hierarchy (with a search bar to find addons),
                // then we should open the node to show the search bar
                if (angular.isDefined(childProd.actions) &&
                    (!angular.isDefined(childProd.actions.expanditems) && angular.isDefined(childProd.actions.getproducts))) {
                    return true;
                }

                // if node is expandable (due to level-based API turned on)
                if (angular.isDefined(childProd.actions) &&
                    angular.isDefined(childProd.actions.expanditems)) {

                    // but there no children as they have not been retrieved from backend
                    if (!this.hasNodeBeenOpened(childProd)) {

                        // call getCartsItemsByItemId API here to retrieve children
                        if (typeof setProcessingLineCallback === 'function') {
                            setProcessingLineCallback(null, childProd, true);
                        }

                        expanditemsActionObj = childProd.actions.expanditems;

                        CPQService.invokeAction(expanditemsActionObj).then(
                            function(data) {

                                if (typeof setProcessingLineCallback === 'function') {
                                    setProcessingLineCallback(null, childProd, false);
                                }

                                parentInCardData = childProd;
                                parentFromAPI = data.records[0];

                                parentInCardData[$rootScope.nsPrefix + 'InCartQuantityMap__c'] = parentFromAPI[$rootScope.nsPrefix + 'InCartQuantityMap__c'];

                                if (angular.isDefined(parentFromAPI.lineItems)) {
                                    //Handle multiple lineitems under the parent
                                    parentFromAPI.lineItems.records.forEach(function(record) {
                                        toBeAddedLineItem = record; // child
                                        CPQCardinalityService.insertLineItemToParent(parentInCardData, toBeAddedLineItem); // insert child to parent in card
                                    });
                                }

                                if (angular.isDefined(parentFromAPI.childProducts)) {
                                    if (!angular.isDefined(parentInCardData.childProducts)) {
                                        parentInCardData.childProducts = {};
                                        parentInCardData.childProducts.records = [];
                                    }
                                    //Handle multiple childProducts under the parent
                                    parentFromAPI.childProducts.records.forEach(function(record) {
                                        toBeAddedChildProduct = record;
                                        parentInCardData.childProducts.records.push(toBeAddedChildProduct);
                                    });
                                }

                                if (angular.isDefined(parentFromAPI.productGroups)) {
                                    if (!angular.isDefined(parentInCardData.productGroups)) {
                                        parentInCardData.productGroups = {};
                                        parentInCardData.productGroups.records = [];
                                    }
                                    //Handle multiple productGroups under the parent
                                    parentFromAPI.productGroups.records.forEach(function(record) {
                                        toBeAddedProductGroup = record;
                                        parentInCardData.productGroups.records.push(toBeAddedProductGroup);
                                    });
                                }

                                if (scopeId) {
                                    /*  HYB-1478: Need to pass scopeId to add extra condition
                                        because 2 line items from the same product bundle have identical product Id (since they are coming from same bundle). 
                                    */
                                    parentInCardData.Id.scopeId = scopeId;
                                }

                                // update UI
                                $rootScope.$broadcast('vlocity.cpq.cartitem.actions', 'viewmodel', {'item': parentInCardData});

                            },
                            function(error) {
                                $log.error(error);

                                $sldsToast({
                                    title: $filter('customLabel')('CPQExpandItemFailed') + ' ' + childProd.Product2.Name,
                                    content: error.message,
                                    severity: 'error',
                                    icon: 'warning',
                                    autohide: true,
                                    show: CPQService.toastEnabled('error')
                                });

                            });

                        // display open icon
                        return true;

                    // there are children under the expandable node
                    } else {
                        // display open icon
                        return true;
                    }

                // if node is NOT expandable (due to level-based API turned on BUT node has NO children OR level-based API turned off)
                } else {

                    // if there are NO children
                    if (!this.hasNodeBeenOpened(childProd)) {

                        // if this is the main cart
                        if (!CPQItemDetailsService.isDetailModalOpen) {

                            // display close icon
                            return false;

                        // if this is inside the view modal
                        } else {

                            // if there are attributes
                            if (angular.isDefined(childProd.attributeCategories) &&
                                angular.isDefined(childProd.attributeCategories.records) &&
                                childProd.attributeCategories.records.length > 0) {

                                // display open icon
                                return true;

                            // if there are NO attributes
                            } else {
                                // display close icon
                                return false;
                            }
                        }
                    // if there are children
                    } else {

                        // display open icon
                        return true;
                    }
                }

            // user clicked on "open" state means he/she wants to close
            } else {

                // display close icon
                return false;
            }
        },
        determineIfChildProdOpenOrCloseIconShouldBeHidden : function(childProd) {
            // if node is expandable (due to level-based API turned on) or node is configured as Collapse Hierarchy (with a search bar to find addons)
            if (angular.isDefined(childProd.actions) &&
                (angular.isDefined(childProd.actions.expanditems) || angular.isDefined(childProd.actions.getproducts))) {
                // do not hide childProd switch icon
                return false;

            // if node is NOT expandable (due to level-based API turned on BUT node has NO children OR level-based API turned off)
            } else {

                // if there are NO children
                if (!this.hasNodeBeenOpened(childProd)) {

                    // if this is the main cart
                    if (!CPQItemDetailsService.isDetailModalOpen) {
                        // hide the node switch icon
                        return true;

                    // if this is inside the view modal
                    } else {

                        // if there are attributes
                        if (angular.isDefined(childProd.attributeCategories) &&
                            angular.isDefined(childProd.attributeCategories.records) &&
                            childProd.attributeCategories.records.length > 0) {
                            // do not hide the node switch icon
                            return false;

                        // if there are NO attributes
                        } else {
                            // hide the node switch icon
                            return true;
                        }
                    }

                // if there are children
                } else {
                    // do not hide the childProd switch icon
                    return false;
                }
            }
        },
        checkIfChildProdHasChildren : function(childProd) {
            // if node is expandable (due to level-based API turned on) or node is configured as Collapse Hierarchy (with a search bar to find addons)
            if (angular.isDefined(childProd.actions) &&
                (angular.isDefined(childProd.actions.expanditems) || angular.isDefined(childProd.actions.getproducts))) {

                // there are children when user clicks on node
                return true;

            // if node is NOT expandable (due to level-based API turned on BUT node has NO children OR level-based API turned off)
            } else {

                // if there are NO children
                if (!this.hasNodeBeenOpened(childProd)) {

                    // if this is the main cart
                    if (!CPQItemDetailsService.isDetailModalOpen) {
                        // there are NO children
                        return false;

                    // if this is inside the view modal
                    } else {

                        // if there are attributes
                        if (angular.isDefined(childProd.attributeCategories) &&
                            angular.isDefined(childProd.attributeCategories.records) &&
                            childProd.attributeCategories.records.length > 0) {
                            // there are children
                            return true;

                        // if there are NO attributes
                        } else {
                            //there are NO children
                            return false;
                        }
                    }
                // if there are children
                } else {
                    // there are children
                    return true;
                }
            }
        },
    };
}]);

},{}],24:[function(require,module,exports){
angular.module('hybridCPQ')
    .factory('CPQOverrideService', ['$log', function($log) {
        var callbackList = {};
        var overrideList = {};
        var overrideFunctionList = {};

        var invokeCallback = function(ctr) {
            var i;
            for (i = callbackList[ctr].length - 1; i >= 0; i--) {
                callbackList[ctr][i]('(' + overrideList[ctr] + ')()');
                callbackList[ctr].pop();
            }
        };

        var buildOverrideBlock = function(ctr, funcHash) {
            var result = 'function() {\n';

            for (var key in funcHash) {
                if (overrideFunctionList[ctr].includes(key)) {
                    result += '$scope.' + key + '=' + funcHash[key] + ';\n';
                } else {
                    throw new Error(key + ' function is not allowed to be redefined!');
                }
            }
            result += '\n}';

            return result.toString();
        };

        return {
            addControllerCallback: function(ctr, functionlist, callback) {
                if (callbackList[ctr]) {
                    callbackList[ctr].push(callback);
                    if (overrideList[ctr]) {
                        invokeCallback(ctr);
                    }
                } else {
                    callbackList[ctr] = [callback];
                }
                overrideFunctionList[ctr] = functionlist;
            },
            addToOverrideList : function(ctr, funcHash) {
                overrideList[ctr] = buildOverrideBlock(ctr, funcHash);
                invokeCallback(ctr);
            },
        };
    }
]);

/* Example */
/*
vlocity.cardframework.registerModule.controller('customOverrideController', ['$scope','CPQOverrideService', function($scope, CPQOverrideService) {
    var overrideFunctions = {
        'beforeAddToCartHook' : function(payload) {
            alert('Hurray!');
        }
    };
    CPQOverrideService.addToOverrideList('CPQCartItemController', overrideFunctions);
}]);
*/
},{}],25:[function(require,module,exports){
angular.module('hybridCPQ')
.factory('CPQProductPromoListService', ['$log',
    function($log) {

    return {
        promotionsList: [],

        categorySelected : 'Qualified',

        getCategorySelected : function() {
            return this.categorySelected;
        },

        setCategorySelected : function(type) {
            this.categorySelected = type;
        }
    };
}]);

},{}],26:[function(require,module,exports){
angular.module('hybridCPQ').factory('CPQResponsiveHelper', ['$window', function($window) {
    'use strict';
    // Checks if we are on a mobile device (tablet or phone). Used to hide DOM elements or add specific
    // CSS classes to elements on mobile:
    var isMobileTablet = function() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
                check = true;
            }

            // Check if the hybrid mobile application is running in a browser.
            if (typeof ionic !== 'undefined' && ionic.Platform.platform()) {
                check = true;
            }
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };
    return {
        mobileTabletDevice: isMobileTablet()
    };
}]);

},{}],27:[function(require,module,exports){
angular.module('hybridCPQ')
    .factory('CPQService', ['$log', '$q', '$timeout', '$rootScope', '$filter', '$locale', 'CPQ_CONST', 'dataSourceService', 'dataService', 'CPQSettingsService',
        function($log, $q, $timeout, $rootScope ,$filter, $locale, CPQ_CONST, dataSourceService, dataService, CPQSettingsService) {

    var customSettings;
    var REMOTE_CLASS = 'CpqAppHandler';
    var DUAL_DATASOURCE_NAME = 'Dual';
    var insideOrg = false;
    var errorContainer = {};
    var actionMode = typeof Visualforce !== 'undefined' ? CPQ_CONST.REMOTE : CPQ_CONST.REST;

    customSettings = CPQSettingsService.getCustomSettings();

    function addParamToBaseUrl(baseEndpoint, numOfParams, paramName, paramValue) {
        if (paramValue) {
            baseEndpoint += (numOfParams == 1) ? '?' : '&';
            baseEndpoint += paramName + '=' + paramValue;
        }
        return baseEndpoint;
    }

    function getDualDataSourceObj(actionObj) {
        var datasource = {};
        var nsPrefix = fileNsPrefix().replace('__', '');

        if (actionObj) {
            datasource.type = DUAL_DATASOURCE_NAME;
            datasource.value = {};
            if (actionObj.remote) {
                datasource.value.remoteNSPrefix = nsPrefix;
                datasource.value.inputMap = actionObj.remote.params || {};
                datasource.value.remoteClass = REMOTE_CLASS;
                datasource.value.remoteMethod = actionObj.remote.params.methodName;
            }
            if (actionObj.rest) {
                datasource.value.endpoint = actionObj.rest.link;
                datasource.value.methodType = actionObj.rest.method;
                datasource.value.body = actionObj.rest.params;
            }
        } else {
            $log.error('Error encountered while trying to read the actionObject');
        }

        return datasource;
    }

    function setMessagesForLineItems(messagesMap, lineItems) {
        if (!messagesMap || messagesMap === {}) {
            return false;
        }
        angular.forEach(lineItems, function(line) {
            line.messages = [];
            var prependItemId = '';
            if (line.itemType === 'productGroup') {
                prependItemId = line.parentLineItemId + '|' ;
            } else {
                prependItemId = line.Id.value + '|' ;
            }
            if (messagesMap[prependItemId + line.productHierarchyPath]) {
                if (messagesMap[prependItemId + line.productHierarchyPath].newMessages) {
                    line.messages = messagesMap[prependItemId + line.productHierarchyPath].newMessages;
                }
                delete messagesMap[prependItemId + line.productHierarchyPath];
            }
            if (line.lineItems) {
                setMessagesForLineItems(messagesMap, line.lineItems.records);
            }

            if (line.productGroups) {
                setMessagesForLineItems(messagesMap, line.productGroups.records);
            }
        });
        return true;
    }

    return {
        actionMode : actionMode,
        dataStore : {messages:[]}, //datastore for sharing data across the application

        getCartAvailableProducts : function(cartId, query, start, next, scope) {
            $log.debug('getting getCartAvailableProducts');
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'CpqAppHandler';
            datasource.value.remoteMethod = 'getCartsProducts';
            datasource.value.inputMap = {'cartId': cartId,
                                        'query': query,
                                        'start': start,
                                        'next': next};
            datasource.value.apexRemoteResultVar = 'result.records';
            var baseEndpoint = '/v2/cpq/carts/' + cartId + '/products';
            var numOfParams = 0;
            baseEndpoint = !query ? baseEndpoint : addParamToBaseUrl(baseEndpoint, ++numOfParams, 'query', query);
            baseEndpoint = !start ? baseEndpoint : addParamToBaseUrl(baseEndpoint, ++numOfParams, 'start', start);
            baseEndpoint = !next ?  baseEndpoint : addParamToBaseUrl(baseEndpoint, ++numOfParams, 'next', next);
            datasource.value.endpoint = nsPrefix ? '/' + nsPrefix + baseEndpoint : baseEndpoint;
            datasource.value.methodType = 'GET';
            datasource.value.apexRestResultVar = 'result.records';
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    $log.debug(data);
                    deferred.resolve(data);
                }, function(error) {
                    $log.error(error);
                    deferred.reject(error);

                });

            return deferred.promise;
        },

        getAvailableProducts : function(orderId, forcetkClient) {
            $log.debug('getting getAvailableProducts');
            var deferred = $q.defer();
            orderId = orderId ? orderId : '';
            $log.debug(orderId);
            if (insideOrg) {

            } else { //outside
                // var requestBody = {command: 'getAvailProducts'};
                // var requestData = {endpoint : 'v1/CPQServices/'+orderId , requestBody: requestBody, method: 'POST'};
                var endpoint = '/v1/CPQServices/' + orderId;
                var payload = '[{"command":"getAvailProducts", "channel":"Mobile"}]';
                var method = 'POST';

                dataService.getApexRest(endpoint,method,payload, forcetkClient).then(
                    function(data) {
                        $log.debug(data);
                        deferred.resolve(data);
                        // return records;

                    }, function(error) {
                        $log.error(error);
                        var errorMsg = '';
                        try {
                            errorMsg = JSON.parse(error.responseText);
                            $log.debug(errorMsg[0]);
                            errorMsg = errorMsg[0].message;
                        } catch (e) {
                            errorMsg = error.status + ' - ' + error.statusText;
                        }

                        errorContainer.data = error;
                        errorContainer.message = errorMsg;
                        deferred.reject(errorContainer);
                    }
                );

                return deferred.promise;
            }
        },

        /**
         * invokeAction : Use this method when the actions are straight forward based on actionObj.
         * @param  {object} actionObj [Pass the action object]
         * @return {promise} [Result data]
         */
        invokeAction : function(actionObj) {
            var deferred = $q.defer();
            var datasource = getDualDataSourceObj(actionObj);

            dataSourceService.getData(datasource, null, null).then(
                function(data) {
                    deferred.resolve(data);
                }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        },

        toastEnabled : function(severityLevel) {
            var toastsOff = customSettings['CPQ Toast Message Log Level'] ? customSettings['CPQ Toast Message Log Level'].toLowerCase() === 'off' : false;
            var toastLogLevel = customSettings['CPQ Toast Message Log Level'] ?  customSettings['CPQ Toast Message Log Level'].toLowerCase() : 'all';
            var defaultMode = true;
            if (toastsOff) {
                return false;
            }
            //is this log level enabled
            else if (toastLogLevel.toLowerCase().indexOf(severityLevel) != -1) {
                return true;
            } else if (toastLogLevel.toLowerCase() == 'all' || !customSettings['CPQ Toast Message Log Level']) {
                return defaultMode;
            }
        },
        /**
         * setCartMessages : Use this method to set the cart messages
         * @param  array of messages from the getCarts API
         */
        setCartMessages: function(messages) {
            this.dataStore.messages = messages;
            //ignore certain messages for the UI
            this.dataStore.filteredMessages = messages.filter(function(msg) { return msg.code != CPQ_CONST.BUNDLE_HAS_ERRORS && msg.code != CPQ_CONST.NO_RESULTS_FOUND;});
        },

        reloadTotalBar: function(validation) {
            $rootScope.$broadcast('vlocity.cpq.totalbar.reload', validation);
        },

        applyMessages: function(recordScope, newMessages) {
            var messagesMap = {};
            angular.forEach(newMessages, function(msg) {
                if (!messagesMap[msg.messageId]) {
                    messagesMap[msg.messageId] = {'newMessages': []};
                }
                messagesMap[msg.messageId].newMessages.push(msg);
            });

            $log.debug('cart messages messagesMap',messagesMap, recordScope.$parent.records);
            if (recordScope.$parent.records) {
                setMessagesForLineItems(messagesMap, recordScope.$parent.records);
            }
        },

        /**
         * Fetch from API and set labels on provided object.
         * This function resolves race condition when label is not available immediately (HYB-1122),
         * And setting it on receiver asynchronously would invoke re-render of Angular template.

         * 
         * @param {Object} receiver - object to set labels on
         * @param {Array} labels - array of labels to fetch
         */
        setLabels: function(labels, receiver) {
            var labelNames = [];
            labels.forEach(function(labelName) {
                if ($rootScope.vlocity.customLabels[labelName] && $rootScope.vlocity.customLabels[labelName][$rootScope.vlocity.userLanguage]) {
                    receiver[labelName] = $rootScope.vlocity.customLabels[labelName][$rootScope.vlocity.userLanguage];
                } else {
                    labelNames.push(labelName);
                }
            });
            if (labelNames.length) {
                dataService.fetchCustomLabels(labelNames, $rootScope.vlocity.userLanguage, $rootScope.forcetkClient).then(
                function(allLabels) {
                    for (var key in allLabels) {
                        if (receiver) {
                            receiver[key] = allLabels[key];
                        }
                    }
                },
                function(error) {
                    $log.debug('customLabel getAllLabelsPromise retrieval error: ', error);
                });
            }
        },

        isAsset: function(item,fieldName) {
            return ((fieldName === 'Quantity') && item.provisioningStatus && (item.provisioningStatus.toLowerCase() === 'active' || item.provisioningStatus.toLowerCase() === 'changed')) ? true : false;
        },

        /*
        * Prevent user from entering decimal, plus and minus characters . HYB-1971
        */

        setIntegerOnlyFields: function(key) {
            if (key === '.' || key === '+' || key === '-') {
                event.preventDefault();
            }
        },

        getPriceValue: function(obj, field) {
            var objectField = obj[field];
            var priceValue = objectField['value'];

            //HYB-1573 - filter in card framework cannot handle just symbols straight up test
            var currency = this.getCurrency();

            if (obj.CurrencyIsoCode) {
                currency.expression = obj.CurrencyIsoCode;
                currency.isSymbol = false;
            }

            if (!isNaN(parseFloat(priceValue)) && isFinite(priceValue)) {
                priceValue = $filter('currency')(priceValue, currency);
            }
            return priceValue;
        },

        getCurrency: (function() {
            /* Memoization the currency in the service  HYB-1573*/
            var currencyCode;

            function getCurrCode() {

                if (!currencyCode) {

                    currencyCode = {
                        isSymbol: false,
                        expression: null
                    };

                    if ($rootScope.vlocity && $rootScope.vlocity.userCurrency) {
                        currencyCode.expression = $rootScope.vlocity.userCurrency;
                        currencyCode.isSymbol = false;
                    }else if ($locale.NUMBER_FORMATS.CURRENCY_SYM) {
                        currencyCode.expression = $locale.NUMBER_FORMATS.CURRENCY_SYM;
                        currencyCode.isSymbol = true;
                    }else {
                        currencyCode.expression = 'USD';
                        currencyCode.isSymbol = true;
                    }

                    return currencyCode;

                }
                return currencyCode;
            }
            return getCurrCode;
        }())
    };
}]);

},{}],28:[function(require,module,exports){
angular.module('hybridCPQ')
.factory('CPQSettingsService', ['$rootScope', '$log', function($rootScope, $log) {
    var apiSettings, featureSettings;
    var updateListeners = [];
    var customSettings =  {};

    apiSettings = {
        // the following settings fpr API used in Cart and the Config Panel
        'addToCartAPIRequiresPricing': true,
        'addToCartAPIRequiresValidation': true,
        'cloneAPIRequiresPricing': true,
        'cloneAPIRequiresValidation': true,
        'updateAPIRequiresPricing': true,
        'updateAPIRequiresValidation': true,
        'modifyAttributesAPIRequiresPricing': true,
        'modifyAttributesAPIRequiresValidation': true,
        'deleteAPIRequiresPricing': true,
        'deleteAPIRequiresValidation': true,

        // the following settings for API used in Product List
        'addToCartAPIInProductListRequiresPricing': true,
        'addToCartAPIInProductListRequiresValidation': true,

        // the following settings for API used in Applied Promotions tab in Cart
        'deleteAppliedPromotionAPIRequiresPricing': true,
        'deleteAppliedPromotionAPIRequiresValidation': true
    };

    featureSettings = {
        enablePromotions : true,
        enablePricing: true,
        // this determines if context rule engine is used to return list of products / promotions eligible for the cart
        // setting this to be true will return both "Qualified" and "Unqualified" types of products / promotions
        // this switch is independent of pricing / promotions switches
        enableRuleBasedQualifications: true,
        enableAdvancedDelete: false
    };

    function invokeCallback (settings) {
        angular.forEach(updateListeners, function(listener) {
            listener(settings);
        });
    }

    return {
        setCustomSettings: function(settings) {
            _.mergeWith(customSettings, settings);
        },
        getCustomSettings: function() {
            return customSettings;
        },
        setApiSettings: function(settings) {
            for (var property in settings) {
                if (typeof(settings[property]) === 'boolean') {
                    apiSettings[property] = settings[property];
                } else {
                    $log.error('setApiSettings: ', property, ' api setting has incorrect value.  It contains something other than boolean:', settings);
                }
            }
        },
        getApiSettings: function() {
            return apiSettings;
        },
        setFeatureSettings: function(settings) {
            for (var property in settings) {
                featureSettings[property] = settings[property];
            }
            invokeCallback(featureSettings);
        },
        getFeatureSettings: function() {
            return featureSettings;
        },
        // resolving a problem when override happens after CPQController is already initialized
        registerListener: function(callBack) {
            updateListeners.push(callBack);
        }
    };
}]);

},{}],29:[function(require,module,exports){
angular.module('hybridCPQ')
.factory('CPQStreamingChannelService', ['$log', 'configService', 'dataService',
    function($log, configService, dataService) {

    return {
        cometDInitialized: false,

        subscribeToChannel : function(channelName, callback) {

            if (!this.cometDInitialized) {

                configService.initCometD().then(function (enabled) {
                        $log.debug('enabled cometd');
                        this.cometDInitialized = true;
                        dataService.getSubscription(channelName, -2, callback); // -2 means to get all messages in the last 24 hours
                    }, function (err) {
                        //error handling
                        $log.debug('bad cometd ',err);
                 });


            } else {

                dataService.getSubscription(channelName, -2, callback);

            }

        }
    };
}]);

},{}],30:[function(require,module,exports){
angular.module('hybridCPQ').service('CPQCustomViewsService', ['$timeout', '$log', '$rootScope', 'dataService', 'CPQSettingsService',
    function($timeout, $log, $rootScope, dataService, CPQSettingsService) {
    'use strict';
    var CPQCustomViewsService = function(scp, cards, currentViewIndex, assetsView) {
        var featureSettings, enablePricing;
        var self = this;

        featureSettings = CPQSettingsService.getFeatureSettings();
        enablePricing = featureSettings.enablePricing;

        this.initialize = function() {
            try {
                this.getActiveStates();
                this.checkCustomViews();
                this.showExpandedActions();

                if ((enablePricing || assetsView) && this.statesData.length > 1) {
                    this.currentCustomView = currentViewIndex ? currentViewIndex : 1;
                } else {
                    this.currentCustomView = 0;
                }

            } catch (e) { $log.debug(e); }
        };

        this.statesData = [];
        this.getStates = function(activeStates) {
            angular.forEach(activeStates, function(state) {
                var stateName = state.name.split('_');
                // To support BasicView in v15.3
                var customViewName = (enablePricing || assetsView) ? 'CustomView' : 'BasicView';

                if (stateName[0] === customViewName) {
                    if (!self.isStatePresent(self.statesData, state.name)) {
                        state.viewName = stateName[1];
                        self.statesData.push(state);
                    }
                }
            });
        };

        this.isStatePresent = function(statesData,stateName) {
            var i;
            for (i = 0;i < statesData.length;i++) {
                if (stateName === statesData[i].name) {
                    return true;
                }
            }
            return false;
        };

        this.getActiveStates = function() {
            var activeStates;
            var self = this;
            angular.forEach(cards, function(card) {
                if (typeof card.invokeCardFunctions == 'function') {
                    activeStates = card.invokeCardFunctions('getActiveStates');
                }
                activeStates = activeStates ? activeStates.data : cards[0].states;
                self.getStates(activeStates);
            });
        };

        // Assign global custom views variable to scope
        this.cpqCustomViews = undefined;
        this.checkCustomViews = function() {
            var key, i, j, viewName;
            if (this.statesData && self.cpqCustomViews === undefined) {
                self.cpqCustomViews = this.statesData;
                for (i = 0; i < self.cpqCustomViews.length; i++) {
                    for (j = 0; j < self.cpqCustomViews[i].fields.length; j++) {

                        // If there is no classSuffix key, add it based on the input key
                        if (!self.cpqCustomViews[i].fields[j].data || !self.cpqCustomViews[i].fields[j].data.classSuffix) {
                            self.cpqCustomViews[i].fields[j].data = self.cpqCustomViews[i].fields[j].data || {};
                            self.cpqCustomViews[i].fields[j].data.classSuffix = self.cpqCustomViews[i].fields[j].type.toLowerCase();
                        }

                        // Add fieldName
                        viewName = self.cpqCustomViews[i].fields[j].name.match(/\[([^\]]+)]/);
                        if (viewName && viewName.length > 0) {
                            self.cpqCustomViews[i].fields[j].fieldName = viewName[1].replace(/(^'|'$)/g, '');
                        } else {
                            self.cpqCustomViews[i].fields[j].fieldName = self.cpqCustomViews[i].fields[j].name;
                        }
                    }
                }
            } else {
                $timeout(self.checkCustomViews, 500);
            }
        };

        this.productListHidden = false;

        // Logic that decided whether to dropdown menu or the action buttons:
        this.showExpandedActions = function() {
            if (self.cpqCustomViews === undefined || self.currentCustomView === undefined) {
                $timeout(self.showExpandedActions, 500);
                return;
            } else if (self.cpqCustomViews[self.currentCustomView] && self.cpqCustomViews[self.currentCustomView].fields.length > 6 &&
                scp.attrs.showProductList !== 'true' || scp.attrs.showProductList === undefined) {
                self.productListHidden = false;
                return;
            } else {
                if (self.cpqCustomViews[self.currentCustomView] && self.cpqCustomViews[self.currentCustomView].fields.length > 6 &&
                scp.attrs.showConfigPanel) {
                    self.productListHidden = false;
                } else {
                    self.productListHidden = true;
                }
                return;
            }
        };

        this.initialize();
    };
    return (CPQCustomViewsService);
}]);

},{}],30:[function(require,module,exports){
//points the global lodash object
var lodash = window._;
angular.module('hybridCPQ')
	.service('CPQUtilityService', function() {
		this.removeIfStartsWith = function(input, character){
		 	return lodash.startsWith(input, character) ? input.substr(1) : input;
		};
	});

},{}],31:[function(require,module,exports){
angular.module("hybridCPQ").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("CPQAppliedPromotionEvaluatePenaltiesModal.tpl.html",'<div class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <h2 class="slds-text-heading--medium">{{::customLabels.CPQCancelPromotion}}</h2>\n        </div>\n\n        <div class="slds-modal__content slds-p-around--medium slds-p-horizontal--xx-large cpq-modal-content">\n\n            <div class="slds-clearfix">\n                <div class="slds-grid">\n                    <div>\n                        <label class="slds-form-element__label">\n                            <abbr class="slds-required" title="required">*</abbr>\n                            {{::customLabels.CPQPromoCancelDate}}\n                        </label>\n                        <div class="slds-form-element__control slds-input-has-icon slds-input-has-icon--right">\n                            <slds-input-svg-icon sprite="\'utility\'" icon="\'dayview\'" extra-classes="\'slds-float--right\'"></slds-input-svg-icon>\n                            <input type="text" class="slds-input" ng-model="cancellationDate.value" ng-change="disableEvaluate()" data-date-format="yyyy-MM-dd" data-date-type="iso" data-min-date="{{minCancellationDate}}" data-start-date="{{minCancellationDate}}" slds-date-picker data-container=".slds-modal__content"/>\n                        </div>\n                    </div>\n\n                    <div class="slds-m-left--medium">\n                        <label class="slds-form-element__Reason slds-form-element__label">{{::customLabels.CPQPromoCancelReason}}</label>\n                         <div class="slds-form-element__control slds-input-has-fixed-addon">\n                            <input class="slds-input" type="text" ng-model="cancellationReason.value" ng-change="disableEvaluate()"/>\n                        </div>\n                    </div>\n\n                    <div class="slds-m-left--medium slds-no-flex">\n                        <button class="slds-button slds-button--neutral slds-m-top--large" ng-click="getPenalties()" ng-disabled="isPenaltiesLoading || !cancellationDate.value">\n                            <span>{{::customLabels.CPQPenaltyButton}}</span>\n                        </button>\n                    </div>\n                </div>\n\n                <!-- Penalties -->\n                <div class="slds-p-top--small">\n                    <div ng-if="isPenaltiesLoading">\n                        <div class="slds-spinner--brand slds-m-vertical--xx-large slds-spinner slds-spinner--small" aria-hidden="false" role="alert" >\n                            <div class="slds-spinner__dot-a"></div>\n                            <div class="slds-spinner__dot-b"></div>\n                        </div>\n                    </div>\n\n                    <div class="slds-box slds-theme--error slds-m-vertical--medium" ng-if="penalties && penalties.records.length >0 && !isPenaltiesLoading && isPenaltyEvaluated">\n                        {{::customLabels.CPQPenaltyApplicableMsg}}\n                        <ul class="slds-p-left--medium">\n                            <li ng-repeat="penalty in penalties.records">\n                                {{penalty.Name}} &nbsp;&nbsp; {{penalty.AdjustmentValue | currency}}\n                            </li>\n                        </ul>\n                    </div>\n\n                    <div class="slds-box slds-theme--error slds-m-vertical--medium" ng-if="penalties && !penalties.records && !isPenaltiesLoading && isPenaltyEvaluated">\n                        {{::customLabels.CPQNoPenaltiesMsg}}\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class="slds-modal__footer slds-is-relative">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()">{{::customLabels.CPQKeepPromotion}}</button>\n\n            <button type="button" class="slds-button slds-button--brand" ng-click="$hide(); cancelPromotionItem()" ng-disabled="!isPenaltyEvaluated">{{::customLabels.CPQConfirmCancelPromotion}}</button>\n\n            <div class="slds-spinner--brand slds-spinner slds-spinner--small" aria-hidden="false" role="alert" ng-if="saving">\n                <div class="slds-spinner__dot-a"></div>\n                <div class="slds-spinner__dot-b"></div>\n            </div>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("CPQCartItemCellModal.tpl.html",'<div class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <h2 ng-show="applyModal" class="slds-text-heading--medium">{{::customLabels.CPQAdjustment}}</h2>\n            <h2 ng-show="detailsModal" class="slds-text-heading--medium">{{::customLabels.CPQDetails}}</h2>\n            <h2 ng-show="paymentModal" class="slds-text-heading--medium">{{::customLabels.CPQPaymentChoice}}</h2>\n        </div>\n\n        <div class="slds-modal__content slds-modal__content slds-p-around--medium slds-p-horizontal--xx-large cpq-modal-content">\n            <div class="slds-is-relative" ng-if="!isDetailLayoutLoaded">\n                <div class="slds-spinner--brand slds-spinner slds-spinner--large slds-is-fixed" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n            <div class="vlc-framed slds-scrollable--y">\n                <vloc-layout layout-name="{{layout}}" records="records" loaded="field" parent="obj" is-loaded="isDetailLayoutLoaded" ctrl="CPQCartItemCellController" read-only="{{readOnly}}" is-recurring="{{isRecurring}}">\n                </vloc-layout>\n            </div>\n        </div>\n        <div class="slds-modal__footer slds-is-relative cpq-custom-modal__footer" ng-class="{\'slds-text-align--center\': applyModal}">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()">\n                {{::customLabels.CPQClose}}\n            </button>\n\n            <button type="button" class="slds-button slds-button--brand" \n                ng-if="applyModal"\n                ng-click="applyAdjustment(field, $hide)" \n                ng-disabled="(isSaving || !isAdjustmentValueValid(records))">\n                {{::customLabels.CPQApply}}\n            </button>\n            <button type="button" class="slds-button slds-button--brand" \n                ng-if="paymentModal"\n                ng-click="switchPayment(obj, parent, $hide)"\n                ng-disabled="isSaving">\n                {{::customLabels.CPQApply}}\n            </button>\n            <div ng-show="isSaving" class="slds-align_absolute-center slds-show--inline-block">\n                <div class="slds-spinner--brand slds-spinner slds-spinner--small" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("CPQCartItemConfigCustomActionModal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal--large">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <h2 class="slds-text-heading--medium">{{title}}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around--x-large cpq-modal-content-height">\n            <div class="vlc-framed slds-scrollable--y">\n                <vloc-layout layout-name="cpq-product-config-custom-action" custom-action-iframe-src="{{customActionIframeSrc}}"></vloc-layout>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()">{{ ::\'ConfirmCancel\' | localize: \'Close\' }}</button>\n        </div>\n    </div>\n</div>'),$templateCache.put("CPQCartItemDelete.tpl.html",'<div class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <h2 ng-hide="applyModal" class="slds-text-heading--medium">{{::customLabels.CPQItemsToBeDeleted}}</h2>\n        </div>\n        <div class="slds-modal__content slds-modal__content slds-p-around--medium slds-p-horizontal--xx-large cpq-modal-content">\n            <div class="slds-is-relative" ng-if="!isDeleteLayoutLoaded">\n                <div class="slds-spinner--brand slds-spinner slds-spinner--large slds-m-top--x-large slds-m-bottom--x-large" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n            <div class="vlc-framed slds-scrollable--y">\n                <vloc-layout layout-name="cpq-product-cart-item-delete" records="records" is-loaded="isDeleteLayoutLoaded" ctrl="CPQCartItemController">\n                </vloc-layout>\n            </div>\n        </div>\n        <div class="slds-modal__footer slds-is-relative cpq-custom-modal__footer" ng-class="{\'slds-text-align--center\': applyModal}">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()">\n                {{::customLabels.CPQCancel}}\n            </button>\n            <button type="button" class="slds-button slds-button--brand" \n                ng-click="applyDelete(records,actions);$hide()" >\n                {{::customLabels.CPQApply}}\n            </button>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("CPQCartItemLookupFieldModal.tpl.html",'<div class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <h2 class="slds-text-heading--medium">{{::customLabels.CPQCartItemLookupFieldTitle}}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around--x-large cpq-modal-content">\n            <div class="slds-is-relative" ng-if="!isDetailLayoutLoaded">\n                <div class="slds-spinner--brand slds-spinner slds-spinner--large slds-m-top--medium slds-m-bottom--medium" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div> \n\n            <div class="vlc-framed slds-scrollable--y">\n                <vloc-layout layout-name="cpq-cart-item-lookup" ctrl="CPQCartItemConfigController" records="obj" is-loaded="isDetailLayoutLoaded"></vloc-layout>\n            </div>\n        </div>\n        \n        <div class="slds-modal__footer slds-is-relative">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()">{{::customLabels.CPQClose}}</button>\n\n            <button type="button" class="slds-button slds-button--brand" ng-click="saveAccountInfo(); $hide()" ng-disabled="saving">{{::customLabels.CPQSave}}</button>\n\n            <div class="slds-spinner--brand slds-spinner slds-spinner--small" aria-hidden="false" role="alert" ng-if="saving">\n                <div class="slds-spinner__dot-a"></div>\n                <div class="slds-spinner__dot-b"></div>\n            </div>\n        </div>\n\n    </div>\n</div>\n'),$templateCache.put("CPQCartItemModal.tpl.html",'<div class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <h2 class="slds-text-heading--medium">{{ ::\'CartItemDeleteTitle\'| localize:\'Delete\' }}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around--x-large">\n            <div class="vlc-framed slds-scrollable--y">\n                Are you sure you want to delete?\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()">{{ ::\'ConfirmCancel\' | localize: \'Cancel\' }}</button>\n            <button type="button" class="slds-button slds-button--brand" ng-click="delete()">{{ ::\'ConfirmDelete\' | localize: \'Delete\' }}</button>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("CPQLineItemDetails.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal--large">\n    <div ng-form name="lineitemDetailsForm" class="cpq-lineitem-details-form">\n        <div class="slds-modal__container">\n            <div class="slds-modal__header">\n                <h2 class="slds-text-heading--medium">{{::customLabels.CPQLineitemDetailsTitle}}</h2>\n                <div ng-if="nextMsgFlagOn && numberMessages && isDetailLoaded">\n                    <a href="#" ng-click="scrollToNextBundleMessage()">{{::customLabels.CPQLineitemDetailsMsgNavigation}}</a>\n                    <small ng-if="currentIndex"> ({{currentIndex}} of {{numberMessages}}) </small>\n                    <small ng-if="!currentIndex"> ({{numberMessages}}) </small>\n                </div>\n            </div>\n            <div id="js-cpq-lineitem-details-modal-content" class="slds-modal__content slds-p-around--x-large cpq-modal-content">\n                <div ng-show="!isDetailLoaded" class="modal-content-position">\n                    <div class="slds-spinner--brand slds-spinner slds-spinner--large slds-m-top--medium slds-m-bottom--medium" aria-hidden="false" role="alert">\n                        <div class="slds-spinner__dot-a"></div>\n                        <div class="slds-spinner__dot-b"></div>\n                    </div>\n                </div>\n                <vloc-layout\n                    layout-name="cpq-cart-item-detail"\n                    records="lineItems" ctrl="CPQCartItemDetailsController"\n                    is-loaded="isDetailLoaded"\n                    line-item-ids="{{lineItem}}">\n                </vloc-layout>\n            </div>\n            <div class="slds-modal__footer">\n                <div ng-if="isSubmit" class="cpq-modal-content-position cpq-modal-spinner-position">\n                    <div class="slds-spinner--brand slds-spinner slds-spinner--small slds-m-top--medium slds-m-bottom--medium" aria-hidden="false" role="alert">\n                        <div class="slds-spinner__dot-a"></div>\n                        <div class="slds-spinner__dot-b"></div>\n                    </div>\n                </div>\n\n                <button type="button" class="slds-button cpq-modal-button slds-button--neutral"\n                        ng-click="$hide();closeModal(lineItems);" ng-disabled="isSubmit || hasError || lineitemDetailsForm.$invalid">\n                        {{::customLabels.CPQClose}}\n                </button>\n            </div>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("CPQProductCompareModal.tpl.html",'<div class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <h2 class="slds-text-heading--medium">{{::customLabels.productComparisionTitle}}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around--x-large">\n            <div class="cpq-modal-content slds-is-relative" ng-if="loading">\n                <div class="slds-spinner--brand slds-spinner slds-spinner--large slds-m-top--medium slds-m-bottom--medium" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n            <div class="vlc-framed slds-scrollable--y">\n                {{::customLabels.compareContent}}\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()">{{::customLabels.cancel}}</button>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("CPQProductFilterModal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal--large">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <h2 class="slds-text-heading--medium">{{ ::\'ProductItemTitle\'| localize:\'Filter Products\' }}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around--x-large cpq-modal-content">\n            <div class="slds-is-relative" ng-if="!isFiltersLoaded">\n                <div class="slds-spinner--brand slds-spinner slds-spinner--large slds-m-top--medium slds-m-bottom--medium" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div> \n\n            <div class="vlc-framed slds-scrollable--y">\n                <vloc-layout layout-name="cpq-product-filters" records="filters" is-loaded="isFiltersLoaded" ctrl="CPQItemsController"></vloc-layout>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()">{{ ::\'ConfirmCancel\' | localize: \'Close\' }}</button>\n            <button type="button" class="slds-button slds-button--destructive" ng-click="$hide()">{{ ::\'ResetFilters\' | localize: \'Reset\' }}\n            </button>\n            <button type="button" class="slds-button slds-button--brand" ng-click="submitFilter(filters)">{{ ::\'ResetFilters\' | localize: \'Apply\' }}</button>\n        </div>\n    </div>\n</div>'),$templateCache.put("CPQProductItemDetailsModal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal--large">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <h2 class="slds-text-heading--medium">{{::customLabels.CPQProductItemTitle}}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around--x-large cpq-modal-content">\n            <div class="slds-is-relative" ng-if="!isDetailLayoutLoaded">\n                <div class="slds-spinner--brand slds-spinner slds-spinner--large slds-m-top--x-large slds-m-bottom--x-large" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n    \n            <div class="vlc-framed slds-scrollable--y">\n                <vloc-layout layout-name="{{data.flyout.layout}}" parent="obj" is-loaded="isDetailLayoutLoaded" ctrl="CPQProductItemDetailsController" records="productObj">\n                </vloc-layout>\n            </div>\n        </div>\n        <div class="slds-modal__footer slds-is-relative">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()">{{::customLabels.CPQClose}}</button>\n\n            <button type="button" class="slds-button slds-button--brand" ng-click="addToCart(productObj[0])" ng-disabled="saving || !productObj[0].actions || productObj[0].category.toLowerCase() !== \'qualified\'">{{::customLabels.CPQAddToCart}}</button>\n\n            <div class="slds-spinner--brand slds-spinner slds-spinner--small" aria-hidden="false" role="alert" ng-if="saving">\n                <div class="slds-spinner__dot-a"></div>\n                <div class="slds-spinner__dot-b"></div>\n            </div>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("CPQProductPromoItemReasonDetail.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal--large">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <h2 class="slds-text-heading--medium">{{::customLabels.CPQReasons}}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around--x-large cpq-modal-content">\n            <div class="vlc-framed slds-scrollable--y">\n                <div class="cpq-item-product-reasons">\n                    <div ng-if="reasons.length > 0">\n                        <vloc-layout layout-name="cpq-cart-item-disqualified-reasons" records="reasons" ctrl="CPQProductItemController">\n                        </vloc-layout>\n                    </div> \n                </div>\n            </div>\n        </div>\n        <div class="slds-modal__footer slds-is-relative">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()">{{::customLabels.CPQClose}}</button>\n        </div>\n    </div>\n</div>'),$templateCache.put("CPQSldsPrompt.tpl.html",'<div aria-hidden="false" role="dialog" slds-prompt class="slds-modal slds-modal--prompt slds-fade-in-open">\n  <div class="slds-modal__container slds-modal--prompt">\n\n    <vloc-layout layout-name="{{data.layout || \'cpq-slds-prompt\'}}" loaded="data"></vloc-layout>\n\n  </div>\n</div>')}]);
},{}]},{},[1]);

})();
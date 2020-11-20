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
},{"./modules/insDirectives/directive/InsDropdownHandler.js":4,"./modules/insDirectives/directive/InsInclude.js":5}],2:[function(require,module,exports){
angular.module('insProductSelection', ['vlocity', 'CardFramework', 'sldsangular', 'forceng',
    'ngSanitize', 'cfp.hotkeys', 'angular-carousel', 'infinite-scroll', 'insValidationHandler', 'insDirectives', 'insRules'
    ]).config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    }]).config(['$tooltipProvider', function($tooltipProvider) {
        'use strict';
        angular.extend($tooltipProvider.defaults, {
            templateUrl: 'SldsTooltip.tpl.html',
            placement: 'auto top'
        });
    }]).config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }]).run(['$rootScope', 'userProfileService', 'dataService', function($rootScope, userProfileService, dataService) {
        'use strict';
        // Custom Label Management
        var labelNames = ['INSProdSelectNoRecords', 'INSProdSelectErrorTitle'];
        userProfileService.userInfoPromise().then(function() {
            dataService.fetchCustomLabels(labelNames, $rootScope.vlocity.userLanguage);
        }, function(error) {
            $log.error('User info promise error', error);
        });
        $rootScope.nsPrefix = fileNsPrefix();
        $rootScope.isLoaded = false;
        $rootScope.setLoaded = function(boolean) {
            $rootScope.isLoaded = boolean;
        };
        // Namespace object:
        $rootScope.vlocInsProdSelectItem = {};
        // If in OmniScript, grab the userInputs from the frameElement which were collected from the script
        if (window.parent.bpModule) {
            $('.via-slds').addClass('in-omniscript');
            $rootScope.inputMap = window.frameElement.getAttribute('user-inputs');
            $rootScope.omniScriptAttributeFilters = angular.fromJson(window.frameElement.getAttribute('attribute-filters'));
            $rootScope.omniScriptSelectMode = window.frameElement.getAttribute('select-mode');
            // Need to set up datasource so we don't get undefined errors
            $rootScope.vlocInsProdSelectItem.dataSource = {
                value: {
                    inputMap: {
                        productClasses: window.frameElement.getAttribute('product-classes')
                    }
                }
            };
            $rootScope.showProductSelection = true;
        }
        $rootScope.vlocInsProdSelectItem.records = [];
        $rootScope.vlocInsProdSelectItem.filterAttrValues = {};
        $rootScope.vlocInsProdSelectItem.validation = {};
        $rootScope.vlocInsProdSelectItem.validation.plansReturned = false;
        $rootScope.vlocInsProdSelectItem.getProductsCalled = false;
        $rootScope.initalLoadDone = false;
        $rootScope.vlocInsProdSelectItem.resetUI = function() {
            $rootScope.showProductSelection = false;
            $rootScope.initalLoadDone = false;
            $rootScope.vlocInsProdSelectItem.getProductsCalled = false;
            $rootScope.vlocInsProdSelectItem.filterAttrValues = {};
            $rootScope.vlocInsProdSelectItem.records = [];
            $rootScope.vlocInsProdSelectItem.totalRecords = undefined;
            $rootScope.vlocInsProdSelectItem.lastRecordId = undefined;
            $rootScope.vlocInsProdSelectItem.comparisonData = {};
            $rootScope.isLoaded = true;
        };

        // Global Helpers:
        $rootScope.isObjectEmpty = function(obj) {
            if (!obj || angular.equals(obj, {})) {
                return true;
            }
            return false;
        };
    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        'use strict';
        return function(sldsURL) {
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]).filter('unique', [function() {
        'use strict';
        return function (arr, field) {
            return _.uniq(arr, function(a) { return a[field]; });
        };
    }]);

// Dependencies
require('./dependencies/infinite-scroll.js');
angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);
require('./InsDirectives.js');

// Directives
require('./modules/insProductSelection/directive/InsIncludeReplace.js');
require('./modules/insProductSelection/directive/InsFocus.js');
require('./modules/insProductSelection/directive/InsMobileLazyLoad.js');

// Controllers
require('./modules/insProductSelection/controller/InsProductSelectionController.js');
require('./modules/insProductSelection/controller/InsProductSelectionItemController.js');

// Templates
require('./modules/insProductSelection/templates/templates.js');

// Factories
require('./modules/insProductSelection/factory/InsProductSelectionItemService.js');
require('./modules/insProductSelection/factory/InsProductSelectionCompareService.js');
require('./modules/insProductSelection/factory/InsProductSelectionModalService.js');
require('./modules/insProductSelection/factory/InsProductSelectionResponsiveService.js');
require('./modules/insProductSelection/factory/InsProductSelectionGridService.js');

},{"./InsDirectives.js":1,"./dependencies/infinite-scroll.js":3,"./modules/insProductSelection/controller/InsProductSelectionController.js":6,"./modules/insProductSelection/controller/InsProductSelectionItemController.js":7,"./modules/insProductSelection/directive/InsFocus.js":8,"./modules/insProductSelection/directive/InsIncludeReplace.js":9,"./modules/insProductSelection/directive/InsMobileLazyLoad.js":10,"./modules/insProductSelection/factory/InsProductSelectionCompareService.js":11,"./modules/insProductSelection/factory/InsProductSelectionGridService.js":12,"./modules/insProductSelection/factory/InsProductSelectionItemService.js":13,"./modules/insProductSelection/factory/InsProductSelectionModalService.js":14,"./modules/insProductSelection/factory/InsProductSelectionResponsiveService.js":15,"./modules/insProductSelection/templates/templates.js":16}],3:[function(require,module,exports){
angular.module('infinite-scroll', []).value('THROTTLE_MILLISECONDS', null).directive('infiniteScroll', ['$rootScope', '$window', '$interval', 'THROTTLE_MILLISECONDS', function($rootScope, $window, $interval, THROTTLE_MILLISECONDS) {
    return {
        scope: {
            infiniteScroll: '&',
            infiniteScrollContainer: '=',
            infiniteScrollDistance: '=',
            infiniteScrollDisabled: '=',
            infiniteScrollUseDocumentBottom: '=',
            infiniteScrollListenForEvent: '@'
        },

        link: function link(scope, elem, attrs) {
            var windowElement = angular.element($window);

            var scrollDistance = null;
            var scrollEnabled = null;
            var checkWhenEnabled = null;
            var container = null;
            var immediateCheck = true;
            var useDocumentBottom = false;
            var unregisterEventListener = null;
            var checkInterval = false;

            function height(element) {
                var el = element[0] || element;

                if (isNaN(el.offsetHeight)) {
                    return el.document.documentElement.clientHeight;
                }
                return el.offsetHeight;
            }

            function pageYOffset(element) {
                var el = element[0] || element;

                if (isNaN(window.pageYOffset)) {
                    return el.document.documentElement.scrollTop;
                }
                return el.ownerDocument.defaultView.pageYOffset;
            }

            function offsetTop(element) {
                if (!(!element[0].getBoundingClientRect || element.css('none'))) {
                    return element[0].getBoundingClientRect().top + pageYOffset(element);
                }
                return undefined;
            }

            // infinite-scroll specifies a function to call when the window,
            // or some other container specified by infinite-scroll-container,
            // is scrolled within a certain range from the bottom of the
            // document. It is recommended to use infinite-scroll-disabled
            // with a boolean that is set to true when the function is
            // called in order to throttle the function call.
            function defaultHandler() {
                var containerBottom = void 0;
                var elementBottom = void 0;
                if (container === windowElement) {
                    containerBottom = height(container) + pageYOffset(container[0].document.documentElement);
                    elementBottom = offsetTop(elem) + height(elem);
                } else {
                    containerBottom = height(container);
                    var containerTopOffset = 0;
                    if (offsetTop(container) !== undefined) {
                        containerTopOffset = offsetTop(container);
                    }
                    elementBottom = offsetTop(elem) - containerTopOffset + height(elem);
                }

                if (useDocumentBottom) {
                    elementBottom = height((elem[0].ownerDocument || elem[0].document).documentElement);
                }

                var remaining = elementBottom - containerBottom;
                var shouldScroll = remaining <= height(container) * scrollDistance + 1;

                if (shouldScroll) {
                    checkWhenEnabled = true;

                    if (scrollEnabled) {
                        if (scope.$$phase || $rootScope.$$phase) {
                            scope.infiniteScroll();
                        } else {
                            scope.$apply(scope.infiniteScroll);
                        }
                    }
                } else {
                    if (checkInterval) {
                        $interval.cancel(checkInterval);
                    }
                    checkWhenEnabled = false;
                }
            }

            // The optional THROTTLE_MILLISECONDS configuration value specifies
            // a minimum time that should elapse between each call to the
            // handler. N.b. the first call the handler will be run
            // immediately, and the final call will always result in the
            // handler being called after the `wait` period elapses.
            // A slimmed down version of underscore's implementation.
            function throttle(func, wait) {
                var timeout = null;
                var previous = 0;

                function later() {
                    previous = new Date().getTime();
                    $interval.cancel(timeout);
                    timeout = null;
                    return func.call();
                }

                function throttled() {
                    var now = new Date().getTime();
                    var remaining = wait - (now - previous);
                    if (remaining <= 0) {
                        $interval.cancel(timeout);
                        timeout = null;
                        previous = now;
                        func.call();
                    } else if (!timeout) {
                        timeout = $interval(later, remaining, 1);
                    }
                }

                return throttled;
            }

            var handler = THROTTLE_MILLISECONDS != null ? throttle(defaultHandler, THROTTLE_MILLISECONDS) : defaultHandler;

            function handleDestroy() {
                container.unbind('scroll', handler);
                if (unregisterEventListener != null) {
                    unregisterEventListener();
                    unregisterEventListener = null;
                }
                if (checkInterval) {
                    $interval.cancel(checkInterval);
                }
            }

            scope.$on('$destroy', handleDestroy);

            // infinite-scroll-distance specifies how close to the bottom of the page
            // the window is allowed to be before we trigger a new scroll. The value
            // provided is multiplied by the container height; for example, to load
            // more when the bottom of the page is less than 3 container heights away,
            // specify a value of 3. Defaults to 0.
            function handleInfiniteScrollDistance(v) {
                scrollDistance = parseFloat(v) || 0;
            }

            scope.$watch('infiniteScrollDistance', handleInfiniteScrollDistance);
            // If I don't explicitly call the handler here, tests fail. Don't know why yet.
            handleInfiniteScrollDistance(scope.infiniteScrollDistance);

            // infinite-scroll-disabled specifies a boolean that will keep the
            // infnite scroll function from being called; this is useful for
            // debouncing or throttling the function call. If an infinite
            // scroll is triggered but this value evaluates to true, then
            // once it switches back to false the infinite scroll function
            // will be triggered again.
            function handleInfiniteScrollDisabled(v) {
                scrollEnabled = !v;
                if (scrollEnabled && checkWhenEnabled) {
                    checkWhenEnabled = false;
                    handler();
                }
            }

            scope.$watch('infiniteScrollDisabled', handleInfiniteScrollDisabled);
            // If I don't explicitly call the handler here, tests fail. Don't know why yet.
            handleInfiniteScrollDisabled(scope.infiniteScrollDisabled);

            // use the bottom of the document instead of the element's bottom.
            // This useful when the element does not have a height due to its
            // children being absolute positioned.
            function handleInfiniteScrollUseDocumentBottom(v) {
                useDocumentBottom = v;
            }

            scope.$watch('infiniteScrollUseDocumentBottom', handleInfiniteScrollUseDocumentBottom);
            handleInfiniteScrollUseDocumentBottom(scope.infiniteScrollUseDocumentBottom);

            // infinite-scroll-container sets the container which we want to be
            // infinte scrolled, instead of the whole window. Must be an
            // Angular or jQuery element, or, if jQuery is loaded,
            // a jQuery selector as a string.
            function changeContainer(newContainer) {
                if (container != null) {
                    container.unbind('scroll', handler);
                }

                container = newContainer;
                if (newContainer != null) {
                    container.bind('scroll', handler);
                }
            }

            changeContainer(windowElement);

            if (scope.infiniteScrollListenForEvent) {
                unregisterEventListener = $rootScope.$on(scope.infiniteScrollListenForEvent, handler);
            }

            function handleInfiniteScrollContainer(newContainer) {
                // TODO: For some reason newContainer is sometimes null instead
                // of the empty array, which Angular is supposed to pass when the
                // element is not defined
                // (https://github.com/sroze/ngInfiniteScroll/pull/7#commitcomment-5748431).
                // So I leave both checks.
                if (!(newContainer != null) || newContainer.length === 0) {
                    return;
                }

                var newerContainer = void 0;

                if (newContainer.nodeType && newContainer.nodeType === 1) {
                    newerContainer = angular.element(newContainer);
                } else if (typeof newContainer.append === 'function') {
                    newerContainer = angular.element(newContainer[newContainer.length - 1]);
                } else if (typeof newContainer === 'string') {
                    newerContainer = angular.element(document.querySelector(newContainer));
                } else {
                    newerContainer = newContainer;
                }

                if (newerContainer == null) {
                    throw new Error('invalid infinite-scroll-container attribute.');
                }
                changeContainer(newerContainer);
            }

            scope.$watch('infiniteScrollContainer', handleInfiniteScrollContainer);
            handleInfiniteScrollContainer(scope.infiniteScrollContainer || []);

            // infinite-scroll-parent establishes this element's parent as the
            // container infinitely scrolled instead of the whole window.
            if (attrs.infiniteScrollParent != null) {
                changeContainer(angular.element(elem.parent()));
            }

            // infinte-scoll-immediate-check sets whether or not run the
            // expression passed on infinite-scroll for the first time when the
            // directive first loads, before any actual scroll.
            if (attrs.infiniteScrollImmediateCheck != null) {
                immediateCheck = scope.$eval(attrs.infiniteScrollImmediateCheck);
            }

            function intervalCheck() {
                if (immediateCheck) {
                    handler();
                }
                return $interval.cancel(checkInterval);
            }

            checkInterval = $interval(intervalCheck);
            return checkInterval;
        }
    };
}]);

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
angular.module('insProductSelection').controller('InsProductSelectionController', ['$scope', '$rootScope', 'InsProductSelectionCompareService', 'InsProductSelectionResponsiveService', 'InsProductSelectionGridService', function(
    $scope, $rootScope, InsProductSelectionCompareService, InsProductSelectionResponsiveService, InsProductSelectionGridService) {
    'use strict';
    $scope.vlocProdSelect = {};
    $scope.vlocProdSelect.isLoaded = true;
    $scope.vlocProdSelect.types = ['Medical', 'Auto', 'Vision', 'Dental'];
    $scope.vlocProdSelect.selectedType = 'Medical';
    $scope.vlocProdSelect.InsProductSelectionCompareService = InsProductSelectionCompareService;
    $scope.vlocProdSelect.responsiveService = InsProductSelectionResponsiveService;
    $scope.vlocProdSelect.InsProductSelectionGridService = InsProductSelectionGridService;
    $scope.vlocProdSelect.inputMap = {};
    $scope.vlocProdSelect.productClasses = '';

    $scope.filterType = function(type) {
        $scope.vlocProdSelect.selectedType = type;
    };

    $scope.vlocProdSelect.sortCards = function(data) {
        $scope.vlocProdSelect.productClasses = data.dataSource.value.inputMap.productClasses;
        $rootScope.vlocInsProdSelectItem.dataSource = data.dataSource;
    };

    $scope.$on('sldsModal.show', function() {
        angular.element('.vloc-plan-selection-modal').addClass('vloc-plan-selection-modal-shown');
    });

    $scope.vlocProdSelect.submitInput = function() {
        // If useTestInputs is in the URL, it will use the value as the inputs
        // i.e.: ?useTestInputs=Smoker:true,zipcode:94303,Birthdate:04/04/2017,Age:32
        if ($scope.params.useTestInputs) {
            $rootScope.vlocInsProdSelectItem.userInputs = $scope.params.useTestInputs;
        }
        $rootScope.isLoaded = false;
        $scope.vlocProdSelect.InsProductSelectionGridService.getRatedProducts($scope);
    };

    $scope.vlocProdSelect.getEligibleProducts = function() {
        if ($rootScope.inputMap && !$rootScope.initalLoadDone && (($rootScope.replaceQLI && $rootScope.replaceQLI.quoteLineItem && !$rootScope.replaceQLI.quoteLineItem.isReplace) || (!$rootScope.replaceQLI))) {
            if (typeof $rootScope.inputMap === 'string') {
                $rootScope.inputMap = angular.fromJson($rootScope.inputMap);
            }
            if ($rootScope.inputMap.classDetail) {
                $scope.vlocProdSelect.InsProductSelectionGridService.getEligibleProducts($scope);
            } else {
                $scope.vlocProdSelect.inputMap = $rootScope.inputMap;
                $scope.vlocProdSelect.InsProductSelectionGridService.getRatedProducts($scope);
            }
        }
    };
    $scope.vlocProdSelect.getEligibleProducts();
}]);
},{}],7:[function(require,module,exports){
angular.module('insProductSelection').controller('InsProductSelectionItemController', 
    ['$scope', '$q', '$timeout', 'InsProductSelectionItemService', 'InsProductSelectionCompareService', 'InsProductSelectionResponsiveService', 'InsProductSelectionGridService', '$filter', '$rootScope', function(
    $scope, $q, $timeout, InsProductSelectionItemService, InsProductSelectionCompareService, InsProductSelectionResponsiveService, InsProductSelectionGridService, $filter, $rootScope) {
    'use strict';
    $scope.vlocProdSelectItem = {};
    $scope.vlocProdSelectItem.details = {};
    $scope.vlocProdSelectItem.attributeCategories = [];
    $scope.vlocProdSelectItem.searchInput = '';
    $scope.vlocProdSelectItem.priceRange = {};
    $scope.vlocProdSelectItem.InsProductSelectionCompareService = InsProductSelectionCompareService;
    $scope.vlocProdSelectItem.responsiveService = InsProductSelectionResponsiveService;
    $scope.vlocProdSelectItem.InsProductSelectionGridService = InsProductSelectionGridService;
    $scope.vlocProdSelectItem.attributeFilters = {
        values: {},
        filtered: {},
        lastAdded: {}
    };
    $scope.vlocProdSelectItem.filterSelected = {};
    $scope.vlocProdSelectItem.removingFilter = false;
    $scope.vlocProdSelectItem.filterCount = 0;
    $scope.vlocProdSelectItem.searchedProducts = false;
    $scope.vlocProdSelectItem.searchActive = false;

    // HELPER FUNCTIONS:
    function clearCompareData() {
        if ($rootScope.replaceQLI && $rootScope.vlocInsProdSelectItem.comparisonData) {
            if ($rootScope.vlocInsProdSelectItem.comparisonData.plans && $rootScope.vlocInsProdSelectItem.comparisonData.plans.length) {
                $rootScope.vlocInsProdSelectItem.comparisonData = {};
                $scope.vlocProdSelectItem.InsProductSelectionCompareService.comparePlan($rootScope.replaceQLI.quoteLineItem, true, $scope.decideCompareFilterVisibility, true);
            }
        } else {
            $rootScope.vlocInsProdSelectItem.comparisonData = {};
            $scope.decideCompareFilterVisibility();
        }
    }

    function removeFilterData(filterKey, index) {
        $scope.vlocProdSelectItem.attributeFilters.values[filterKey].splice(index, 1);
        $scope.vlocProdSelectItem.attributeFilters.filtered[filterKey].splice(index, 1);
        if ($scope.vlocProdSelectItem.attributeFilters.values[filterKey].length < 1) {
            delete $scope.vlocProdSelectItem.attributeFilters.values[filterKey];
            delete $scope.vlocProdSelectItem.attributeFilters.filtered[filterKey];
        }
    }

    // SCOPE FUNCTIONS:
    // Logic to display filters bar and compare button properly
    $scope.decideCompareFilterVisibility = function() {
        if (!$scope.vlocProdSelectItem.compareFilterVisibility) {
            $scope.vlocProdSelectItem.compareFilterVisibility = {
                showCompare: false,
                showFilter: false,
                showBoth: false
            };
        }
        console.log('COMPARE DATA', $rootScope.vlocInsProdSelectItem.comparisonData);
        if ($rootScope.vlocInsProdSelectItem.comparisonData && $rootScope.vlocInsProdSelectItem.comparisonData.plans && $rootScope.vlocInsProdSelectItem.comparisonData.count > 1) {
            if ($scope.vlocProdSelectItem.attributeFilters && $rootScope.isObjectEmpty($scope.vlocProdSelectItem.attributeFilters.values) && !$scope.vlocProdSelectItem.searchedProducts) {
                console.log('Found MORE than 1 comparison plan and NO filter selected');
                $scope.vlocProdSelectItem.compareFilterVisibility.showCompare = true;
                $scope.vlocProdSelectItem.compareFilterVisibility.showFilter = false;
                $scope.vlocProdSelectItem.compareFilterVisibility.showBoth = false;
            } else {
                console.log('Found MORE than 1 comparison plan and at least ONE filter selected');
                $scope.vlocProdSelectItem.compareFilterVisibility.showCompare = true;
                $scope.vlocProdSelectItem.compareFilterVisibility.showFilter = true;
                $scope.vlocProdSelectItem.compareFilterVisibility.showBoth = true;
            }
        } else {
            if (($scope.vlocProdSelectItem.attributeFilters && $rootScope.isObjectEmpty($scope.vlocProdSelectItem.attributeFilters.values)) && !$scope.vlocProdSelectItem.searchedProducts) {
                console.log('Found LESS than 1 comparison plan and NO filter selected');
                $scope.vlocProdSelectItem.compareFilterVisibility.showCompare = false;
                $scope.vlocProdSelectItem.compareFilterVisibility.showFilter = false;
                $scope.vlocProdSelectItem.compareFilterVisibility.showBoth = false;
            } else {
                console.log('Found LESS than 1 comparison plan and at least ONE filter selected');
                $scope.vlocProdSelectItem.compareFilterVisibility.showCompare = false;
                $scope.vlocProdSelectItem.compareFilterVisibility.showFilter = true;
                $scope.vlocProdSelectItem.compareFilterVisibility.showBoth = false;
            }
        }
    };
    $scope.setRecords = function() {
        if ($rootScope.replaceQLI && !$rootScope.replaceQLI.quoteLineItem.isReplace) {
            $rootScope.replaceQLI.quoteLineItem.Id = $rootScope.replaceQLI.quoteLineItem['Product2.Id'].value;
            $rootScope.replaceQLI.quoteLineItem.Name = $rootScope.replaceQLI.quoteLineItem['Product2.Name'].value;
            $rootScope.replaceQLI.quoteLineItem.ProductCode = $rootScope.replaceQLI.quoteLineItem['Product2.ProductCode'].value;
            $rootScope.replaceQLI.quoteLineItem.IsRecommended__c = $rootScope.replaceQLI.quoteLineItem['Product2.' + $rootScope.nsPrefix  + 'IsRecommended__c'].value;
            $rootScope.replaceQLI.quoteLineItem.isReplace = true;
            $scope.vlocProdSelectItem.InsProductSelectionCompareService.comparePlan($rootScope.replaceQLI.quoteLineItem, true, $scope.decideCompareFilterVisibility, true);
        }
        $scope.vlocProdSelectItem.processFields($scope.data.fields).then(function(result) {
            if (!$rootScope.initalLoadDone && !angular.equals($scope.vlocProdSelectItem.attributeFilters, {}) && $scope.vlocProdSelectItem.responsiveService.isOmniScript) {
                $scope.vlocProdSelectItem.filterCount = $scope.vlocProdSelectItem.InsProductSelectionGridService.countActiveFilters($scope.vlocProdSelectItem.attributeFilters);
            }
            $scope.vlocProdSelectItem.resetIframeHeight();
            $rootScope.vlocInsProdSelectItem.getProductsCalled = false;
            $rootScope.initalLoadDone = true;
            $rootScope.isLoaded = true;
        });
    };
    // Assign method from InsProductSelectionItemService:
    $scope.vlocProdSelectItem.resetIframeHeight = InsProductSelectionItemService.resetIframeHeight;
    var plansReceived = $scope.$on('ins-product-selection-plans-received', function(e, records) {
        console.log('records received', records);
        $rootScope.vlocInsProdSelectItem.records = $rootScope.vlocInsProdSelectItem.records.concat(records);
        console.log('$rootScope.vlocInsProdSelectItem.records', $rootScope.vlocInsProdSelectItem.records);
        $scope.setRecords();
    });
    $scope.$on('$destroy', plansReceived);

    document.addEventListener('ins-product-selection-recalc-iframe-height', function(e) {
        if (e.detail.noResults) {
            $scope.vlocProdSelectItem.resetIframeHeight();
        }
    });

    document.addEventListener('vloc-ins-attribute-rule-hide', function(e) {
        var evtProductCode = e.detail.ProductCode;
        var evtAttribute = e.detail.attribute;
        var userValuesIndex;
        if (!$rootScope.attributesHidden) {
            $rootScope.attributesHidden = {};
        }
        if (evtAttribute.inputType === 'checkbox' && parseFloat(evtAttribute.userValues) === NaN) {
            evtAttribute.userValues.toString();
        }
        if ((evtAttribute.dataType === 'number' || evtAttribute.inputType === 'radio' || evtAttribute.inputType === 'dropdown' || evtAttribute.inputType === 'range') && parseFloat(evtAttribute.userValues) !== NaN) {
            evtAttribute.userValues = parseFloat(evtAttribute.userValues);
        }
        if (evtAttribute.hiddenByRule && $rootScope.vlocInsProdSelectItem.filterAttrValues[evtAttribute.code] && (!$rootScope.attributesHidden[evtProductCode] || ($rootScope.attributesHidden[evtProductCode] && $rootScope.attributesHidden[evtProductCode].indexOf(evtAttribute.code) < 0))) {
            userValuesIndex = $rootScope.vlocInsProdSelectItem.filterAttrValues[evtAttribute.code].listOfValues.indexOf(evtAttribute.userValues);
            $rootScope.vlocInsProdSelectItem.filterAttrValues[evtAttribute.code].listOfValues.splice(userValuesIndex, 1);
            if (!$rootScope.attributesHidden[evtProductCode]) {
                $rootScope.attributesHidden[evtProductCode] = [];
            }
            $rootScope.attributesHidden[evtProductCode].push(evtAttribute.code);
            console.log('vloc-ins-attribute-rule-hide event received', e.detail, $rootScope.vlocInsProdSelectItem.filterAttrValues[evtAttribute.code]);
        }
    });

    $scope.vlocProdSelectItem.openDetailModal = function(i) {
        $scope.vlocProdSelectItem.index = i;
        InsProductSelectionItemService.openDetailModal($scope);
    };

    $scope.$on('sldsModal.show', function() {
        angular.element('.vloc-plan-selection-modal').addClass('vloc-plan-selection-modal-shown');
    });

    $scope.vlocProdSelectItem.processFields = function(fields, includeFilterAttrValues){
        var newFields;
        var deferred = $q.defer();
        if (!$scope.vlocProdSelectItem.fields || includeFilterAttrValues) {
            newFields = InsProductSelectionItemService.processFields(fields);
            $scope.vlocProdSelectItem.fields = newFields.obj;
            $rootScope.vlocInsProdSelectItem.fieldsArray = newFields.array;
        }
        InsProductSelectionItemService.processAttrs($scope).then(function(result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    // Filtering methods
    $scope.vlocProdSelectItem.searchProducts = function(clear) {
        if ($scope.vlocProdSelectItem.searchInput) {
            $rootScope.isLoaded = false;
            $scope.vlocProdSelectItem.searchActive = false;
            $rootScope.vlocInsProdSelectItem.lastRecordId = null;
            if (clear) {
                $scope.vlocProdSelectItem.searchedProducts = false;
                $scope.vlocProdSelectItem.searchInput = '';
                if ($scope.vlocProdSelectItem.responsiveService.checkBreakpoint(46.25)) {
                    $scope.vlocProdSelectItem.mobileFilters = false;
                }
            } else {
                $scope.vlocProdSelectItem.searchedProducts = true;
                $scope.vlocProdSelectItem.enableFilterBtn = false;
            }
            InsProductSelectionGridService[$rootScope.getProductsMethod]($scope, $scope.vlocProdSelectItem.searchInput, undefined);
            $scope.decideCompareFilterVisibility();
        }
    };

    $scope.vlocProdSelectItem.addToFilter = function(filterKey, filterValue, initFromOS) {
        var filtered = initFromOS ? true : false;
        console.log('addToFilter', filterKey, filterValue);
        if ($scope.vlocProdSelectItem.attributeFilters.values[filterKey] && $scope.vlocProdSelectItem.attributeFilters.values[filterKey].indexOf(String(filterValue)) > -1) {
            return;
        }
        if (!$scope.vlocProdSelectItem.attributeFilters.values[filterKey]) {
            $scope.vlocProdSelectItem.attributeFilters.values[filterKey] = [];
            $scope.vlocProdSelectItem.attributeFilters.filtered[filterKey] = [];
        }
        if (!$scope.vlocProdSelectItem.attributeFilters.lastAdded[filterKey]) {
            $scope.vlocProdSelectItem.attributeFilters.lastAdded[filterKey] = [];
        }
        $scope.vlocProdSelectItem.attributeFilters.values[filterKey] = $scope.vlocProdSelectItem.attributeFilters.values[filterKey].concat([String(filterValue)]);
        $scope.vlocProdSelectItem.attributeFilters.filtered[filterKey] = $scope.vlocProdSelectItem.attributeFilters.filtered[filterKey].concat([filtered]);
        $scope.vlocProdSelectItem.attributeFilters.lastAdded[filterKey] = $scope.vlocProdSelectItem.attributeFilters.lastAdded[filterKey].concat([filtered]);
        if (!initFromOS) {
            $scope.vlocProdSelectItem.enableFilterBtn = true;
        }
        $scope.decideCompareFilterVisibility();
        console.log('$scope.vlocProdSelectItem.attributeFilters', $scope.vlocProdSelectItem.attributeFilters);
    };

    $scope.vlocProdSelectItem.checkFilterSelected = function(filterKey, filterValue) {
        var index = 0;
        if ($scope.vlocProdSelectItem.attributeFilters.values[filterKey]) {
            index = $scope.vlocProdSelectItem.attributeFilters.values[filterKey].indexOf(String(filterValue));
            if ($scope.vlocProdSelectItem.attributeFilters.values && $scope.vlocProdSelectItem.attributeFilters.values[filterKey] && index > -1) {
                if ($scope.vlocProdSelectItem.attributeFilters.filtered[filterKey][index]) {
                    return true;
                }
                return false;
            }
        }
        return false;
    };

    $scope.vlocProdSelectItem.filterPlans = function(hideMobileFilters) {
        var key, i;
        $rootScope.isLoaded = false;
        $scope.vlocProdSelectItem.showFilter = true;
        $scope.vlocProdSelectItem.enableFilterBtn = false;
        $rootScope.vlocInsProdSelectItem.lastRecordId = null;
        InsProductSelectionGridService[$rootScope.getProductsMethod]($scope, $scope.vlocProdSelectItem.searchInput, undefined);
        // Mark all current filters as true
        for (key in $scope.vlocProdSelectItem.attributeFilters.filtered) {
            for (i = 0; i < $scope.vlocProdSelectItem.attributeFilters.filtered[key].length; i++) {
                $scope.vlocProdSelectItem.attributeFilters.filtered[key][i] = true;
            }
        }
        if (hideMobileFilters) {
            $scope.vlocProdSelectItem.mobileFilters = false;
        }
        clearCompareData();
    };

    $scope.vlocProdSelectItem.removeFilter = function(filterKey, index) {
        var includeFilterAttrValues = false;
        if (Object.keys($scope.vlocProdSelectItem.attributeFilters.values).length === 0) {
            $scope.vlocProdSelectItem.showFilter = false;
        }
        // If filter has been executed, then call server to refilter, if not, just remove the filter
        if ($scope.vlocProdSelectItem.attributeFilters.filtered[filterKey][index]) {
            if (Object.keys($scope.vlocProdSelectItem.attributeFilters.values).length === 1 && InsProductSelectionResponsiveService.isOmniScript && $rootScope.omniScriptAttributeFilters) {
                includeFilterAttrValues = true;
                $rootScope.omniScriptAttributeFilters = undefined;
            }
            removeFilterData(filterKey, index);
            $rootScope.vlocInsProdSelectItem.lastRecordId = null;
            $rootScope.isLoaded = false;
            $scope.vlocProdSelectItem.removingFilter = true;
            InsProductSelectionGridService[$rootScope.getProductsMethod]($scope, $scope.vlocProdSelectItem.searchInput, undefined, includeFilterAttrValues);
            clearCompareData();
        } else {
            removeFilterData(filterKey, index);
            $scope.decideCompareFilterVisibility();
        }
        if ($scope.vlocProdSelectItem.responsiveService.checkBreakpoint(46.25)) {
            $scope.vlocProdSelectItem.mobileFilters = false;
        }
    };

    $scope.vlocProdSelectItem.clearAllFilters = function() {
        var includeFilterAttrValues = false;
        $rootScope.isLoaded = false;
        $scope.vlocProdSelectItem.searchedProducts = false;
        $scope.vlocProdSelectItem.searchInput = '';
        $scope.vlocProdSelectItem.attributeFilters.values = {};
        $scope.vlocProdSelectItem.attributeFilters.filtered = {};
        $rootScope.vlocInsProdSelectItem.lastRecordId = null;
        $scope.vlocProdSelectItem.removingFilter = true;
        if (InsProductSelectionResponsiveService.isOmniScript && $rootScope.omniScriptAttributeFilters) {
            includeFilterAttrValues = true;
            $rootScope.omniScriptAttributeFilters = undefined;
        }
        InsProductSelectionGridService[$rootScope.getProductsMethod]($scope, $scope.vlocProdSelectItem.searchInput, undefined, includeFilterAttrValues);
        $scope.vlocProdSelectItem.showFilter = false;
        if ($scope.vlocProdSelectItem.responsiveService.checkBreakpoint(46.25)) {
            $scope.vlocProdSelectItem.mobileFilters = false;
        }
        clearCompareData();
    };

    $scope.vlocProdSelectItem.comparePlan = function(record, checked) {
        var clearPlansArray = false;
        if ($rootScope.isObjectEmpty($rootScope.vlocInsProdSelectItem.comparisonData) ||
            ($rootScope.vlocInsProdSelectItem.comparisonData && $rootScope.vlocInsProdSelectItem.comparisonData.plans && !$rootScope.vlocInsProdSelectItem.comparisonData.plans.length)) {
            clearPlansArray = true;
        }
        InsProductSelectionCompareService.comparePlan(
            record,
            checked,
            $scope.decideCompareFilterVisibility,
            clearPlansArray
        );
    };

    $rootScope.vlocInsProdSelectItem.addItem = function(product) {
        var inputMap;
        if (!$scope.vlocProdSelectItem.responsiveService.isOmniScript) {
            if (!$rootScope.replaceQLI) {
                inputMap = {
                    'quoteId' : $rootScope.inputMap.quoteId,
                    'productId' : product.Id,
                    'classDetail' : $rootScope.inputMap.classDetail,
                    'price' : product.Price
                };
                if ($rootScope.inputMap.effectiveDtStr) {
                    inputMap.effectiveDtStr = $rootScope.inputMap.effectiveDtStr;
                }
                InsProductSelectionItemService.addItem($scope, inputMap);
            } else {
                inputMap = {
                    'quoteId' : $rootScope.inputMap.quoteId,
                    'alternateProdId' : product.Id,
                    'quoteItemId' : $rootScope.replaceQLI.quoteLineItem.quoteLineId,
                    'price' : product.Price
                };
                InsProductSelectionItemService.replaceItem($scope, inputMap);
            }
            console.log('$rootScope.insModal', $rootScope.insModal);
            if ($rootScope.insModal) {
                $rootScope.insModal.hide();
            }
        } else {
            product.isSelected = !product.isSelected;
            product.vlcSelected = !product.vlcSelected;
            if (!$scope.vlocProdSelectItem.productsSelected) {
                $scope.vlocProdSelectItem.productsSelected = {
                    products: [product],
                    ids: [product.Id]
                };
            } else if ($scope.vlocProdSelectItem.productsSelected.ids.indexOf(product.Id) < 0) {
                if ($rootScope.omniScriptSelectMode === 'Multi') {
                    $scope.vlocProdSelectItem.productsSelected.products.push(product);
                    $scope.vlocProdSelectItem.productsSelected.ids.push(product.Id);
                } else if ($rootScope.omniScriptSelectMode === 'Single') {
                    angular.forEach($rootScope.vlocInsProdSelectItem.records, function(record, i) {
                        if (record.isSelected) {
                            record.isSelected = false;
                            record.vlcSelected = false;
                        }
                    });
                    product.isSelected = !product.isSelected;
                    product.vlcSelected = !product.vlcSelected;
                    $scope.vlocProdSelectItem.productsSelected = {
                        products: [product],
                        ids: [product.Id]
                    };
                }
            } else {
                angular.forEach($scope.vlocProdSelectItem.productsSelected.products, function(prod, i) {
                    if (prod.Id === product.Id) {
                        $scope.vlocProdSelectItem.productsSelected.products.splice(i, 1);
                        $scope.vlocProdSelectItem.productsSelected.ids.splice(i, 1);
                    }
                });
            }
            console.log('$scope.vlocInsProdSelectItem.productsSelected', $scope.vlocProdSelectItem.productsSelected);
            console.log('$root.vlocInsProdSelectItem.records', $rootScope.vlocInsProdSelectItem.records);
            window.parent.postMessage({productsSelected: $scope.vlocProdSelectItem.productsSelected.products}, '*');
        }
    };

    // If we're an omniscript and filters have been set through that script, we need to run the UI through
    // the process of adding a filter (to the UI)
    if (InsProductSelectionResponsiveService.isOmniScript && $rootScope.omniScriptAttributeFilters) {
        angular.forEach($rootScope.omniScriptAttributeFilters, function(value, key) {
            angular.forEach(value, function(filterValue) {
                $scope.vlocProdSelectItem.addToFilter(key, filterValue, true);
            });
        });
    }
}]);
},{}],8:[function(require,module,exports){
angular.module('insProductSelection').directive('insFocus', ['$timeout', function($timeout) {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            element.click(function() {
                $timeout(function() {
                    $('#' + attrs.insFocus).focus();
                }, 0);
            });
        }
    };
}]);

},{}],9:[function(require,module,exports){
angular.module('insProductSelection').directive('insIncludeReplace', function($document) {
    'use strict';
    return {
        require: 'ngInclude',
        restrict: 'A',
        compile: function (tElement, tAttrs) {
            tElement.replaceWith(tElement.children());
            return {
                post : angular.noop
            };
        }
    };
});
},{}],10:[function(require,module,exports){
angular.module('insProductSelection').directive('insMobileLazyLoad', ['$rootScope', 'InsProductSelectionGridService', function($rootScope, InsProductSelectionGridService) {
    'use strict';
    return {
        restrict: 'A',
        scope: {
            importedScope: '=insMobileLazyLoad'
        },
        link: function(scope, element, attrs) {
            // Watching carouselIndex, when the user is 3 plans before the end, call the server to retrieve the next "page"
            scope.importedScope.$watch('vlocProdSelectItem.carouselIndex', function(newValue, oldValue) {
                if (scope.importedScope.vlocProdSelectItem.responsiveService.mobileTabletDevice() && $rootScope.vlocInsProdSelectItem.records.length < $rootScope.vlocInsProdSelectItem.totalRecords && $rootScope.vlocInsProdSelectItem.records.length - newValue <= 3) {
                    InsProductSelectionGridService[$rootScope.getProductsMethod](scope.importedScope, scope.importedScope.vlocProdSelectItem.searchInput, $rootScope.vlocInsProdSelectItem.records.length, false, true);
                }
            });
        }
    };
}]);

},{}],11:[function(require,module,exports){
angular.module('insProductSelection').factory('InsProductSelectionCompareService', 
['$rootScope', 'InsProductSelectionModalService',
function($rootScope, InsProductSelectionModalService) {
    'use strict';
    $rootScope.vlocInsProdSelectItem.comparisonData = {
        plans: {},
        attrList: []
    };
    var replaceableProd = '';

    var updatePlanArray = function(record, checked){
        if(!$rootScope.vlocInsProdSelectItem.comparisonData.plans){
            $rootScope.vlocInsProdSelectItem.comparisonData.plans = {};
        }
        if(!record.allAttrs){
            record.allAttrs = {};
           for(var i = 0; i < record.attributeCategories.records.length; i++){
                var category = record.attributeCategories.records[i]; 
                for(var j = 0; j < category.productAttributes.records.length; j++){
                    var str = category.Name + ': ' + category.productAttributes.records[j].label;
                    record.allAttrs[str] = {
                        userValues: category.productAttributes.records[j].userValues, 
                        dataType: category.productAttributes.records[j].dataType,
                        inputType: category.productAttributes.records[j].inputType,
                        hidden: category.productAttributes.records[j].hidden,
                        ishidden: category.productAttributes.records[j].ishidden,
                        hiddenByRule: category.productAttributes.records[j].hiddenByRule
                    };
                }
            }
        }
        if (checked) {
            $rootScope.vlocInsProdSelectItem.comparisonData.plans[record.Id] = record;
            $rootScope.vlocInsProdSelectItem.comparisonData.plans[record.Id].checked = true;

        } else {
            $rootScope.vlocInsProdSelectItem.comparisonData.plans[record.Id].checked = false;
        }
    };

    var setAttrList = function() {
        var key, i, j;
        var categories = [];
        var newCategories = [];
        var existingCategories = [];
        var foundExistingCategory = false;
        $rootScope.vlocInsProdSelectItem.comparisonData.count = 0;
        for (key in $rootScope.vlocInsProdSelectItem.comparisonData.plans) {
            existingCategories = $rootScope.vlocInsProdSelectItem.comparisonData.attrList;
            if ($rootScope.vlocInsProdSelectItem.comparisonData.plans[key].checked) {
                $rootScope.vlocInsProdSelectItem.comparisonData.count += 1;
                newCategories = $rootScope.vlocInsProdSelectItem.comparisonData.plans[key].attributeCategories.records;
                for (i = 0; i < newCategories.length; i++) {
                    foundExistingCategory = false;
                    if (!existingCategories.length) {
                        newCategories[i].attrs = [];
                        newCategories[i].parentProductId = key;
                        newCategories[i].attrs = newCategories[i].attrs.concat(newCategories[i].productAttributes.records);
                        newCategories[i].attrs = _.uniqBy(newCategories[i].attrs, 'attributeId');
                        categories.push(newCategories[i]);
                    } else {
                        for (j = 0; j < existingCategories.length; j++) {
                            if (newCategories[i].Code__c === existingCategories[j].Code__c && !foundExistingCategory) {
                                if (!existingCategories[j].attrs) {
                                    existingCategories[j].attrs = [];
                                }
                                existingCategories[j].attrs = existingCategories[j].attrs.concat(newCategories[i].productAttributes.records);
                                existingCategories[j].attrs = _.uniqBy(existingCategories[j].attrs, 'attributeId');
                                foundExistingCategory = true;
                            }
                        }
                    }
                }
                existingCategories = existingCategories.concat(categories);
                $rootScope.vlocInsProdSelectItem.comparisonData.attrList = existingCategories;
            }
        }
    };

    return {
        // Creating the array that will be used to print out plan comparison data in the
        // comparison modal.
        comparePlan: function(record, checked, fn, clearPlansArray) {
            var i, plansLength;
            if (clearPlansArray) {
                $rootScope.vlocInsProdSelectItem.comparisonData.count = 0;
            }
            // If checked, add plan, if not, remove plan
            if(record.isReplace){
                replaceableProd = record.Id;
            } else {
                if(replaceableProd === record.Id){
                    record.isReplace = true;
                }
            }
            updatePlanArray(record, checked);
            setAttrList();
            fn();
        },
        launchCompareModal: function(scope) {
            InsProductSelectionModalService.launchModal(
                scope,
                'ins-product-selection-compare-modal',
                $rootScope.vlocInsProdSelectItem.comparisonData,
                'InsProductSelectionController',
                'vloc-compare-plans-modal'
            );
        },
        prevSlide: function() {
            return angular.element('ul.vloc-carousel-container.vloc-compare-plans').scope().prevSlide();
        },
        nextSlide: function() {
            return angular.element('ul.vloc-carousel-container.vloc-compare-plans').scope().nextSlide();
        }
    };
}]);

},{}],12:[function(require,module,exports){
angular.module('insProductSelection').factory('InsProductSelectionGridService', ['$rootScope', '$filter', '$q', '$window', '$timeout', 'dataSourceService', 'dataService', 'InsProductSelectionModalService', 'InsValidationHandlerService', 'InsProductSelectionResponsiveService', 'InsProductSelectionItemService',
    function($rootScope, $filter, $q, $window, $timeout, dataSourceService, dataService, InsProductSelectionModalService, InsValidationHandlerService, InsProductSelectionResponsiveService, InsProductSelectionItemService) {
        'use strict';
        var REMOTE_CLASS = 'AttributeRatingHandler';
        var DUAL_DATASOURCE_NAME = 'Dual';
        var insideOrg = false;
        var errorContainer = {};

        var processInput = function(input) {
            if (input && input.length !== 0) {
                var result = "";
                for (var key in input) {
                    if (input[key] !== undefined && input[key] !== null && input[key] !== '') {
                        if (input[key].input) {
                            result += key + ':' + input[key].input + ',';
                        } else {
                            result += key + ':' + input[key] + ',';
                        }
                    }
                }
                if (result.length > 0) {
                    result = result.substring(0, result.length - 1);
                    $rootScope.vlocInsProdSelectItem.userInputs = result;
                    return result;
                }
            } else {
                return $rootScope.vlocInsProdSelectItem.userInputs;
            }
        };

        var formatDatetime = function(d) {
            var d = new Date(d);
            return ('0' + (d.getDate())).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' +
                d.getFullYear();
        };

        //+ ' ' + ('0' + (d.getHours())).slice(-2) + ':' +
        //   ('0' + (d.getMinutes())).slice(-2) + ':' + ('0' + (d.getSeconds())).slice(-2); 
        var formatInputDate = function(scope, keyName) {
            if (scope.$parent.records && scope.$parent.records.result) {
                for (var i in scope.$parent.records.result) {
                    var record = scope.$parent.records.result[i];
                    if (scope[keyName].inputMap && scope[keyName].inputMap[record.name]) {
                        if (record.dataType == 'Boolean' && !scope[keyName].inputMap[record.name]) {
                            scope[keyName].inputMap[record.name] = false;
                        }
                        if (record.dataType == 'Date' || (!record.dataType && Date.parse(scope[keyName].inputMap[record.name]))) {
                            scope[keyName].inputMap[record.name].input = formatDatetime(scope[keyName].inputMap[record.name]);
                        }
                    }
                }
            }
            return true;
        };

        var parseFilters = function(filterAttrValues) {
            var key, i, key2;
            var attributes = [];
            var attributeObjKeys = [];
            for (key in filterAttrValues) {
                filterAttrValues[key].displayAttributeName = filterAttrValues[key].attributeName;
                if (attributes.indexOf(filterAttrValues[key].attributeName) > -1) {
                    // Prepend categoryName to previous attribute with same attributeName as this one:
                    filterAttrValues[attributeObjKeys[attributes.indexOf(filterAttrValues[key].attributeName)]].displayAttributeName =
                        filterAttrValues[attributeObjKeys[attributes.indexOf(filterAttrValues[key].attributeName)]].categoryName +
                        ': ' +
                        filterAttrValues[attributeObjKeys[attributes.indexOf(filterAttrValues[key].attributeName)]].attributeName;
                    // Prepend categoryName to current attribute:
                    filterAttrValues[key].displayAttributeName = filterAttrValues[key].categoryName + ': ' + filterAttrValues[key].attributeName;
                } else {
                    attributes.push(filterAttrValues[key].attributeName);
                    attributeObjKeys.push(key);
                }
                // Convert currency and percent values to integers so they can be sorted properly
                if (filterAttrValues[key].valueDataType.toLowerCase() === 'currency' || filterAttrValues[key].valueDataType.toLowerCase() === 'percent') {
                    for (i = 0; i < filterAttrValues[key].listOfValues.length; i++) {
                        filterAttrValues[key].listOfValues[i] = parseFloat(filterAttrValues[key].listOfValues[i]);
                    }
                }
            }
            return filterAttrValues;
        };

        var addAttrValues = function(records) {
            var deferred = $q.defer();
            var key, i, j, k, record, currentFilter, currentCategory, currentAttribute;
            for (key in $rootScope.vlocInsProdSelectItem.filterAttrValues) {
                currentFilter = $rootScope.vlocInsProdSelectItem.filterAttrValues[key];
                for (i = 0; i < records.length; i++) {
                    record = records[i];
                    if (record.attributeCategories && record.attributeCategories.records) {
                        for (j = 0; j < record.attributeCategories.records.length; j++) {
                            currentCategory = record.attributeCategories.records[j];
                            if ((currentCategory.Name === currentFilter.categoryName) && currentCategory.productAttributes && currentCategory.productAttributes.records) {
                                for (k = 0; k < currentCategory.productAttributes.records.length; k++) {
                                    currentAttribute = currentCategory.productAttributes.records[k];
                                    if (currentAttribute.code === key && (currentAttribute.userValues || currentAttribute.userValues === 0)) {
                                        if (!currentFilter.attributeByProductCode) {
                                            currentFilter.attributeByProductCode = {};
                                        }
                                        currentFilter.attributeByProductCode[record.ProductCode] = currentAttribute;
                                        if (currentAttribute.dataType === 'currency') {
                                            records[i][currentFilter.displayAttributeName] = $filter('currency')(currentAttribute.userValues, '$');
                                        } else if (currentAttribute.dataType === 'percentage') {
                                            records[i][currentFilter.displayAttributeName] = currentAttribute.userValues + '%';
                                        } else {
                                            records[i][currentFilter.displayAttributeName] = currentAttribute.userValues;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            deferred.resolve(records);
            return deferred.promise;
        };

        var removeDeadFilters = function(filters) {
            var key, i;
            for (key in filters.lastAdded) {
                for (i = 0; i < filters.lastAdded[key].length; i++) {
                    if (!filters.lastAdded[key][i]) {
                        filters.filtered[key].splice(i, 1);
                        filters.values[key].splice(i, 1);
                        filters.lastAdded[key].splice(i, 1);
                    }
                }
                if (!filters.filtered[key].length) {
                    delete filters.filtered[key];
                    delete filters.values[key];
                    delete filters.lastAdded[key];
                }
            }
            return filters;
        };

        var countActiveFilters = function(filters) {
            var key;
            var filterCount = 0;
            for (key in filters.filtered) {
                filterCount += filters.filtered[key].length;
            }
            return filterCount;
        };

        var getLoadMoreSpinnerPosition = function() {
            return window.innerHeight - 50 + 'px';
        };

        // Repeated interior functionality for getRatedProducts and getEligibleProducts:
        var processProducts = function(scope, keyName, data, recordsReceived, productsKey, includeFilterAttrValues, mobileLazyLoad) {
            var records;
            var noRecordsMsg = 'There were 0 records returned.';
            if ($rootScope.vlocity.customLabels && $rootScope.vlocity.customLabels.INSProdSelectNoRecords && $rootScope.vlocity.customLabels.INSProdSelectNoRecords[$rootScope.vlocity.userLanguage]) {
                noRecordsMsg = $rootScope.vlocity.customLabels.INSProdSelectNoRecords[$rootScope.vlocity.userLanguage];
            }
            console.log('data returned', data);
            scope[keyName].removingFilter = false;
            // Check for 0 records
            if ((!data.result || data.result && (!data.result[productsKey] || !data.result[productsKey].records)) && !data.records) {
                InsValidationHandlerService.throwError({
                    message: noRecordsMsg
                });
                InsProductSelectionItemService.resetIframeHeight();
                if (!scope[keyName].attributeFilters) {
                    scope[keyName].attributeFilters = {
                        values: {},
                        filtered: {},
                        lastAdded: {}
                    };
                } else {
                    // Remove last filter that returned 0 results:
                    scope[keyName].attributeFilters = removeDeadFilters(scope[keyName].attributeFilters);
                }
                scope[keyName].searchedProducts = false;
                scope[keyName].searchInput = '';
                if ($rootScope.vlocInsProdSelectItem.records.length) {
                    $rootScope.vlocInsProdSelectItem.lastRecordId = $rootScope.vlocInsProdSelectItem.records[$rootScope.vlocInsProdSelectItem.records.length - 1].Id;
                }
                $timeout(function() {
                    $rootScope.vlocInsProdSelectItem.getProductsCalled = false;
                }, 500);
                if (scope.decideCompareFilterVisibility) {
                    scope.decideCompareFilterVisibility();
                }
                if ($rootScope.vlocInsProdSelectItem.records && !$rootScope.vlocInsProdSelectItem.records.length && !InsProductSelectionResponsiveService.isOmniScript) {
                    $rootScope.showProductSelection = false;
                }
                return;
            } else {
                if (scope[keyName].attributeFilters) {
                    scope[keyName].attributeFilters.lastAdded = {};
                    scope[keyName].filterCount = countActiveFilters(scope[keyName].attributeFilters);
                    if (scope[keyName].searchedProducts) {
                        // Filter count shows on mobile:
                        scope[keyName].filterCount++;
                    }
                }
                if (includeFilterAttrValues || data.result && data.result.filterAttrValues && !$rootScope.vlocInsProdSelectItem.filterAttrValues || (data.result && data.result.filterAttrValues && angular.equals($rootScope.vlocInsProdSelectItem.filterAttrValues, {}))) {
                    $rootScope.vlocInsProdSelectItem.filterAttrValues = parseFilters(data.result.filterAttrValues) || {};
                    console.log('filterAttrValues', $rootScope.vlocInsProdSelectItem.filterAttrValues);
                }
                $rootScope.vlocInsProdSelectItem.totalRecords = data.totalSize || data.result[productsKey].totalSize;
                addAttrValues(data.records || data.result[productsKey].records).then(function(result) {
                    records = result;
                    console.log('records addAttrValues', records);
                    if (!recordsReceived) {
                        $rootScope.vlocInsProdSelectItem.records = records;
                        console.log('$rootScope.vlocInsProdSelectItem.records', $rootScope.vlocInsProdSelectItem.records);
                        $timeout(function() {
                            $rootScope.vlocInsProdSelectItem.getProductsCalled = false;
                        }, 500);
                        // Fields get processed on inital load from a call from ng-init on the card
                        // When filtering, we need to call it manually here. recordsReceived won't be
                        // undefined for pagination requests, just for initial load, and filtering
                        if (keyName === 'vlocProdSelectItem' && InsProductSelectionResponsiveService.isIframe) {
                            scope[keyName].processFields(scope.data.fields, includeFilterAttrValues).then(function(result) {
                                scope[keyName].resetIframeHeight();
                            });
                        } else if (!InsProductSelectionResponsiveService.isIframe) {
                            $rootScope.isLoaded = true;
                        }
                    } else {
                        // Listened for in InsProductSelectionItemController
                        $rootScope.$broadcast('ins-product-selection-plans-received', records);
                    }
                    $rootScope.vlocInsProdSelectItem.lastRecordId = records[records.length - 1].Id;
                    if (scope[keyName].carouselIndex && !mobileLazyLoad) {
                        scope[keyName].carouselIndex = 0;
                    }
                    if (records.length > 0 && !records[0].missingInputs) {
                        $rootScope.showProductSelection = true;
                        $rootScope.vlocInsProdSelectItem.validation.showError = false;
                        $rootScope.vlocInsProdSelectItem.validation.missingInputs = {};
                    } else {
                        $rootScope.vlocInsProdSelectItem.validation.missingInputs = {};
                        for (var key in records[0].missingInputs.records[0]) {
                            if (key !== 'messages' && key !== 'displaySequence') {
                                $rootScope.vlocInsProdSelectItem.validation.missingInputs[key] = records[0].missingInputs.records[0][key];
                            }
                        }
                        $rootScope.vlocInsProdSelectItem.validation.showError = true;
                        var keys = Object.keys($rootScope.vlocInsProdSelectItem.validation.missingInputs);
                        keys = keys.join(', ');
                        $rootScope.vlocInsProdSelectItem.validation.errorMsg = 'Please enter ' + keys + '.';
                    }
                }, function(error) {
                    InsValidationHandlerService.throwError(error);
                });
            }
        };
        return {
            getRatedProducts: function(scope, searchText, recordsReceived, includeFilterAttrValues, mobileLazyLoad) {
                if (recordsReceived !== undefined && (recordsReceived >= $rootScope.vlocInsProdSelectItem.totalRecords) || $rootScope.vlocInsProdSelectItem.getProductsCalled) {
                    console.log('terminated function call because either we\'ve reached max records or the previous call isn\'t finished yet.');
                    return;
                }
                if (!$rootScope.initalLoadDone && !InsProductSelectionResponsiveService.checkBreakpoint(46.25)) {
                    $rootScope.isLoaded = false;
                }
                var keyName = 'vlocProdSelectItem';
                if (scope.vlocProdSelect) {
                    keyName = 'vlocProdSelect';
                }
                if (InsProductSelectionResponsiveService.isOmniScript) {
                    if (keyName === 'vlocProdSelect') {
                        $rootScope.isLoaded = false;
                    }
                    if (keyName === 'vlocProdSelectItem' && !InsProductSelectionResponsiveService.checkBreakpoint(46.25)) {
                        window.parent.postMessage({addHeight: true}, '*');
                    }
                }
                scope[keyName].loadMoreSpinnerPosition = getLoadMoreSpinnerPosition();
                formatInputDate(scope, keyName);
                console.log('called getRatedProducts');
                $rootScope.getProductsMethod = 'getRatedProducts';
                var userInputs = $rootScope.vlocInsProdSelectItem.userInputs || scope[keyName].inputMap || $rootScope.inputMap;
                var effectiveDate = null;
                var deferred = $q.defer();
                var nsPrefix = fileNsPrefix().replace('__', '');
                var datasource = {};
                datasource.type = 'Dual';
                datasource.value = {};
                datasource.value.remoteNSPrefix = nsPrefix;
                datasource.value.remoteClass = 'AttributeRatingHandler';
                datasource.value.remoteMethod = 'getRatedProducts';
                datasource.value.inputMap = {
                    'userInputs': userInputs,
                    'productClasses': $rootScope.vlocInsProdSelectItem.dataSource.value.inputMap.productClasses || null,
                    'effectiveDate': effectiveDate,
                    'pageSize': parseInt($rootScope.vlocInsProdSelectItem.dataSource.value.inputMap.pageSize) || 9,
                    'searchText': searchText || ''
                };
                if (!recordsReceived && (scope[keyName].attributeFilters && scope[keyName].attributeFilters.values && (!$rootScope.isObjectEmpty(scope[keyName].attributeFilters.values) || scope[keyName].removingFilter))) {
                    datasource.value.inputMap.attributeFilters = scope[keyName].attributeFilters.values;
                } else {
                    if (scope[keyName].attributeFilters && scope[keyName].attributeFilters.values) {
                        datasource.value.inputMap.attributeFilters = scope[keyName].attributeFilters.values;
                    } else if (InsProductSelectionResponsiveService.isOmniScript && $rootScope.omniScriptAttributeFilters) {
                        datasource.value.inputMap.attributeFilters = $rootScope.omniScriptAttributeFilters;
                    }
                    datasource.value.inputMap.lastRecordId = $rootScope.vlocInsProdSelectItem.lastRecordId || null;
                }
                if (!scope[keyName].attributeFilters || angular.equals(scope[keyName].attributeFilters, {}) || includeFilterAttrValues) {
                    datasource.value.optionsMap = {
                        'includeFilterAttrValues': true
                    };
                }
                datasource.value.apexRemoteResultVar = 'result.records';
                datasource.value.methodType = 'GET';
                datasource.value.apexRestResultVar = 'result.records';
                // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                console.log('datasource', datasource);
                if (recordsReceived) {
                    $rootScope.vlocInsProdSelectItem.getProductsCalled = true;
                }
                dataSourceService.getData(datasource, scope, null).then(
                    function(data) {
                        deferred.resolve(data);
                        processProducts(scope, keyName, data, recordsReceived, 'ratedProducts', includeFilterAttrValues, mobileLazyLoad);
                    },
                    function(error) {
                        console.error(error);
                        deferred.reject(error);
                        InsValidationHandlerService.throwError(error);
                        $rootScope.isLoaded = true;
                    });
                return deferred.promise;
            },
            getEligibleProducts: function(scope, searchText, recordsReceived, includeFilterAttrValues, mobileLazyLoad) {
                if (recordsReceived !== undefined && (recordsReceived >= $rootScope.vlocInsProdSelectItem.totalRecords) || $rootScope.vlocInsProdSelectItem.getProductsCalled) {
                    console.log('terminated function call because either we\'ve reached max records or the previous call isn\'t finished yet.');
                    return;
                }
                if (!$rootScope.initalLoadDone && !InsProductSelectionResponsiveService.checkBreakpoint(46.25)) {
                    $rootScope.isLoaded = false;
                }
                var keyName = 'vlocProdSelectItem';
                if (scope.vlocProdSelect) {
                    keyName = 'vlocProdSelect';
                }
                if (InsProductSelectionResponsiveService.isOmniScript && keyName === 'vlocProdSelectItem' && !InsProductSelectionResponsiveService.checkBreakpoint(46.25)) {
                    window.parent.postMessage({addHeight: true}, '*');
                }
                scope[keyName].loadMoreSpinnerPosition = getLoadMoreSpinnerPosition();
                console.log('called getEligibleProducts');
                $rootScope.getProductsMethod = 'getEligibleProducts';
                var effectiveDate = null;
                var deferred = $q.defer();
                var nsPrefix = fileNsPrefix().replace('__', '');
                var datasource = {};
                datasource.type = 'Dual';
                datasource.value = {};
                datasource.value.remoteNSPrefix = nsPrefix;
                datasource.value.remoteClass = 'InsuranceQuoteProcessingService';
                datasource.value.remoteMethod = 'getEligibleProducts';
                datasource.value.inputMap = angular.copy($rootScope.inputMap);
                datasource.value.inputMap.effectiveDate = effectiveDate;
                datasource.value.inputMap.pageSize = parseInt($rootScope.vlocInsProdSelectItem.dataSource.value.inputMap.pageSize) || 9;
                datasource.value.inputMap.searchText = searchText || '';
                if (!recordsReceived && (scope[keyName].attributeFilters && scope[keyName].attributeFilters.values && (!$rootScope.isObjectEmpty(scope[keyName].attributeFilters.values) || scope[keyName].removingFilter))) {
                    datasource.value.inputMap.attributeFilters = scope[keyName].attributeFilters.values;
                } else {
                    if (scope[keyName].attributeFilters && scope[keyName].attributeFilters.values) {
                        datasource.value.inputMap.attributeFilters = scope[keyName].attributeFilters.values;
                    } else if (InsProductSelectionResponsiveService.isOmniScript && $rootScope.omniScriptAttributeFilters) {
                        datasource.value.inputMap.attributeFilters = $rootScope.omniScriptAttributeFilters;
                    }
                    datasource.value.inputMap.lastRecordId = $rootScope.vlocInsProdSelectItem.lastRecordId || null;
                }
                if (!scope[keyName].attributeFilters || angular.equals(scope[keyName].attributeFilters, {}) || includeFilterAttrValues) {
                    datasource.value.optionsMap = {
                        'includeFilterAttrValues': true
                    };
                }
                datasource.value.apexRemoteResultVar = 'result.records';
                datasource.value.methodType = 'GET';
                datasource.value.apexRestResultVar = 'result.records';
                console.log('datasource', datasource);
                // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                if (recordsReceived) {
                    $rootScope.vlocInsProdSelectItem.getProductsCalled = true;
                }
                dataSourceService.getData(datasource, scope, null).then(
                    function(data) {
                        deferred.resolve(data);
                        processProducts(scope, keyName, data, recordsReceived, 'listProducts', includeFilterAttrValues, mobileLazyLoad);
                    },
                    function(error) {
                        console.error(error);
                        deferred.reject(error);
                        InsValidationHandlerService.throwError(error);
                        $rootScope.isLoaded = true;
                    });
                return deferred.promise;
            },
            countActiveFilters: countActiveFilters,
            addAttrValues: addAttrValues
        };

    }
]);

},{}],13:[function(require,module,exports){
angular.module('insProductSelection').factory('InsProductSelectionItemService', ['$sldsModal', '$timeout', 'InsProductSelectionModalService', 'InsProductSelectionResponsiveService', '$q', 'dataSourceService', 'dataService', '$rootScope', 'InsValidationHandlerService',
    function($sldsModal, $timeout, InsProductSelectionModalService, InsProductSelectionResponsiveService, $q, dataSourceService, dataService, $rootScope, InsValidationHandlerService) {
        'use strict';
        var processAttributeCategories = function(record, categoryFieldMap) {
            console.log('process attribute categories');
            var attributeCategories = {};
            var attrArray = [];
            for (var j = 0; j < record.length; j++) {
                var catt = record[j].Name;
                if (record[j].productAttributes && record[j].productAttributes.records) {
                    attributeCategories[catt] = record[j].productAttributes.records;
                    for (var k = 0; k < attributeCategories[catt].length; k++) {
                        var attr = attributeCategories[catt][k];
                        if (categoryFieldMap[attr.label]) {
                            if (categoryFieldMap[attr.label][catt]) {
                                attr.cardLabel = categoryFieldMap[attr.label][catt];
                                attrArray = attrArray.concat(attr);
                            } else {
                                if (categoryFieldMap[attr.label].length > 0) {
                                    attr.cardLabel = categoryFieldMap[attr.label];
                                    attrArray = attrArray.concat(attr);
                                }
                            }
                        }
                    }
                }
            }
            var output = {
                'attrArray': attrArray,
                'details': attributeCategories
            };
            return output;
        };
        return {
            openDetailModal: function(scope) {
                var input = {
                    'record': $rootScope.vlocInsProdSelectItem.records[scope.vlocProdSelectItem.index],
                    'details': scope.vlocProdSelectItem.details[scope.vlocProdSelectItem.index]
                };
                InsProductSelectionModalService.launchModal(
                    scope,
                    'ins-product-selection-details-modal',
                    input,
                    '',
                    'vloc-details-modal'
                );
            },
            processFields: function(data) {
                var categoryFieldMap = {};
                var fieldsArray = [];
                var i, name;
                console.log('process card fields');
                for (i = 0; i < data.length; i++) {
                    name = data[i].name;
                    categoryFieldMap[name] = data[i].label;
                    fieldsArray.push(data[i].label);
                }
                $rootScope.vlocInsProdSelectItem.filterAttrValues = this.filterFilters($rootScope.vlocInsProdSelectItem.filterAttrValues, fieldsArray);
                return {
                    obj: categoryFieldMap,
                    array: fieldsArray
                };
            },
            filterFilters: function(filters, fields) {
                var key, i;
                var obj = {};
                for(i = 0; i < fields.length; i++){
                    var p = fields[i].indexOf(': ');
                    if(p > -1){
                    var category = fields[i].slice(0, p); 
                    var attr = fields[i].slice(p + 2, fields[i].length);
                        if(!obj[category]){
                            obj[category] = [attr];
                        } else {
                            obj[category].push(attr);
                        }
                    }
                }
                for (key in filters) {
                    if (fields.indexOf(filters[key].attributeName) > -1) {
                        filters[key].onCard = true;
                    } else {
                        filters[key].onCard = false;
                        if(obj[filters[key].categoryName]){
                            if(obj[filters[key].categoryName].indexOf(filters[key].attributeName) > -1){
                                 filters[key].onCard = true;
                            }
                        }
                      
                    }
                }
                return filters;
            },
            processAttrs: function(scope) {
                var attributeCategories = {};
                var displayAttrs = {};
                var teirCatalog = [];
                var deferred = $q.defer();
                scope.vlocProdSelectItem.attrMap = {};

                // Process Attributes for Detail Modal
                for (var i = 0; i < $rootScope.vlocInsProdSelectItem.records.length; i++) {
                    var record = $rootScope.vlocInsProdSelectItem.records[i];
                    if (record.attributeCategories) {
                        var output = processAttributeCategories(record.attributeCategories.records, scope.vlocProdSelectItem.fields);
                        scope.vlocProdSelectItem.attrMap[i] = output.attrArray;
                        scope.vlocProdSelectItem.details[i] = output.details;
                        record.attributeIndex = i;
                    }
                }
                scope.vlocProdSelectItem.isLoaded = true;
                deferred.resolve({attrMap: scope.vlocProdSelectItem.attrMap, details: scope.vlocProdSelectItem.details});
                return deferred.promise;
            },
            selectItem: function(scope, productId) {
                if (!$rootScope.replaceQLI) {
                    inputMap = {
                        'quoteId' : $rootScope.inputMap.quoteId,
                        'productId' : productId,
                        'classDetail' : $rootScope.inputMap.classDetail,
                    };
                    if ($rootScope.inputMap.effectiveDtStr) {
                        inputMap.effectiveDtStr = $rootScope.inputMap.effectiveDtStr;
                    }
                    this.addItem(scope, inputMap);
                } else {
                    inputMap = {
                        'quoteId' : $rootScope.inputMap.quoteId,
                        'alternateProdId' : productId,
                        'quoteItemId' : $rootScope.replaceQLI.quoteLineItem.quoteLineId
                    };
                    this.replaceItem(scope, inputMap);
                }
            },
            addItem: function(scope, inputMap) {
                $rootScope.isLoaded = false;
                var effectiveDate = null;
                var deferred = $q.defer();
                var nsPrefix = fileNsPrefix().replace('__', '');
                var datasource = {};
                datasource.type = 'Dual';
                datasource.value = {};
                datasource.value.remoteNSPrefix = nsPrefix;
                datasource.value.remoteClass = 'InsuranceQuoteProcessingService';
                datasource.value.remoteMethod = 'addItem';
                datasource.value.inputMap = inputMap;
                datasource.value.apexRemoteResultVar = 'result.records';
                datasource.value.methodType = 'GET';
                datasource.value.apexRestResultVar = 'result.records';
                console.log('datasource', datasource);
                // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                dataSourceService.getData(datasource, scope, null).then(
                    function(data) {
                        console.log(data);
                        $rootScope.vlocInsProdSelectItem.resetUI();
                        deferred.resolve(data);
                    },
                    function(error) {
                        console.error(error);
                        deferred.reject(error);
                        InsValidationHandlerService.throwError(error);
                        $rootScope.isLoaded = true;
                    });
                return deferred.promise;
            },
            replaceItem: function(scope, inputMap) {
                $rootScope.isLoaded = false;
                var effectiveDate = null;
                var deferred = $q.defer();
                var nsPrefix = fileNsPrefix().replace('__', '');
                var datasource = {};
                datasource.type = 'Dual';
                datasource.value = {};
                datasource.value.remoteNSPrefix = nsPrefix;
                datasource.value.remoteClass = 'InsuranceQuoteProcessingService';
                datasource.value.remoteMethod = 'replaceWithAlternatePlan';
                datasource.value.inputMap = inputMap;
                datasource.value.apexRemoteResultVar = 'result.records';
                datasource.value.methodType = 'GET';
                datasource.value.apexRestResultVar = 'result.records';
                console.log('datasource', datasource);
                // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
                // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
                dataSourceService.getData(datasource, scope, null).then(
                    function(data) {
                        console.log(data);
                        $rootScope.replaceQLI = null;
                        $rootScope.vlocInsProdSelectItem.resetUI();
                        deferred.resolve(data);
                    },
                    function(error) {
                        console.error(error);
                        deferred.reject(error);
                        InsValidationHandlerService.throwError(error);
                        $rootScope.isLoaded = true;
                    });
                return deferred.promise;
            },
            resetIframeHeight: function() {
                if (InsProductSelectionResponsiveService.isIframe) {
                    $timeout(function() {
                        var bodyHeight = $('body')[0].scrollHeight;
                        if (InsProductSelectionResponsiveService.mobileTabletDevice() && InsProductSelectionResponsiveService.checkBreakpoint(30)) {
                            bodyHeight = $('.vloc-product-selection-filters-wrapper').outerHeight() + $('.vloc-product-selection-plan-0').outerHeight() + 20;
                        }
                        console.log('body el from within iframe:', $('body'), bodyHeight);
                        console.log(window.parent);
                        window.parent.postMessage({iframeHeight: bodyHeight}, '*');
                        $rootScope.isLoaded = true;
                    }, 750);
                }
            }
        };
    }
]);

},{}],14:[function(require,module,exports){
angular.module('insProductSelection').factory('InsProductSelectionModalService',
['$rootScope', '$sldsModal', '$timeout', 'InsProductSelectionResponsiveService',
function($rootScope, $sldsModal, $timeout, InsProductSelectionResponsiveService) {
    'use strict';
    return {
        launchModal: function(scope, layout, records, ctrl, customClass) {
            var modalScope = scope.$new();
            var templatePath = 'modals/SldsModalVlocSlideCustom.tpl.html';
            if (InsProductSelectionResponsiveService.checkBreakpoint(46.5)) {
                templatePath = 'modals/ins-product-selection-modal.tpl.html';
            }
            modalScope.isLayoutLoaded = false;
            modalScope.layout = layout;
            modalScope.records = records;
            modalScope.ctrl = ctrl;
            modalScope.customClass = customClass;
            modalScope.addItem = scope.vlocProdSelectItem.addItem;
            $rootScope.insModal = $sldsModal({
                scope: modalScope,
                templateUrl: templatePath,
                show: true,
                vlocSlide: true,
                vlocSlideHeader: false,
                vlocSlideFooter: false
            });
            console.log('modalScope', modalScope);
            // generate click on the modal to get insDropdownHandler directive to work:
            $timeout(function() {
                angular.element('.slds-modal__content').click();
            }, 500);
            modalScope.hideModal = function() {
                angular.element('.slds-modal').removeClass('vloc-plan-selection-modal-shown');
                angular.element('.slds-backdrop').removeClass('slds-backdrop_open');
                $timeout(function() {
                    $rootScope.insModal.hide();
                }, 500);
            };
        }
    };
}]);
},{}],15:[function(require,module,exports){
angular.module('insProductSelection').factory('InsProductSelectionResponsiveService', ['$window', function($window) {
    'use strict';
    var baseSize = 16; // px
    var getWindowWidth = function() {
        return $window.innerWidth;
    };
    var getPixelFromEm = function(rem) {
        return rem * baseSize;
    };
    return {
        // Checks if we are on a mobile device (tablet or phone). Used to hide DOM elements or add specific
        // CSS classes to elements on mobile:
        mobileTabletDevice: function() {
            var check = false;
            (function(a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
                    check = true;
                }
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        },
        getWindowWidth: getWindowWidth,
        getPixelFromEm: getPixelFromEm,
        checkBreakpoint: function(rem) {
            return getWindowWidth() <= getPixelFromEm(rem);
        },
        isIframe: window.frameElement !== null,
        isOmniScript: window.parent.bpModule ? true : false
    };
}]);
},{}],16:[function(require,module,exports){
angular.module("insProductSelection").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("SldsTooltip.tpl.html",'<div class="slds-popover slds-popover_tooltip slds-nubbin_bottom-left" role="tooltip" ng-show="title">\n    <div class="slds-popover__body" ng-bind="title"></div>\n</div>'),$templateCache.put("modals/SldsModalVlocSlideCustom.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{customClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{customClass}}-container">\n        <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()" ng-if="!vlocSlideHeader">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Close</span>\n        </button>\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n        </header>\n        <div class="slds-modal__content vloc-modal-content slds-is-relative">\n            <div class="slds-spinner_container" ng-class="{\'vloc-show-loader\': !isModalLoaded}">\n                <div class="slds-spinner_brand slds-spinner slds-spinner_large slds-m-top_x-large slds-m-bottom_x-large" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n            <vloc-layout layout-name="{{layout}}" class="{{layout}}" is-loaded="isLayoutLoaded" records="records" ctrl="{{ctrl}}"></vloc-layout>\n        </div>\n        <footer class="slds-modal__footer" ng-show="vlocSlideFooter">\n            <button class="slds-button slds-button_neutral" ng-click="$slideHide()">Cancel</button>\n        </footer>\n    </div>\n</div>\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -100%;\n        margin-bottom: 45px;\n        height: auto;\n        min-height: 44rem;\n        transition: top 250ms ease-in;\n        position: absolute;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-modal__close {\n        color: #16325c;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: 41rem;\n        max-height: 41rem;\n        width: 90%;\n        min-width: 90%;\n        max-width: 90%;\n        padding: 0;\n        margin: 1rem 0 0;\n        position: absolute;\n        left: 50%;\n        transform: translateX(-50%);\n        top: 2rem;\n        box-shadow: 0 0 35px 2px rgba(0, 0, 0, 0.25);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 41rem;\n        border-radius: 0.25rem;\n        border: 1px solid #d8dde6;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); /* leaving room for iPhone notification bar */\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; /* Android doesn\'t need the 20px of room like iPhone */\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>'),$templateCache.put("modals/ins-product-selection-modal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-plan-selection-modal {{customClass}}">\n    <div class="slds-modal__container vloc-plan-selection-modal-container {{customClass}}-container" ins-dropdown-handler="hideModal()">\n        <div class="slds-is-relative">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="hideModal()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n        </div>\n        <div class="slds-modal__content vloc-plan-selection-modal-content slds-is-relative">\n            <div class="slds-spinner_container" ng-class="{\'vloc-show-loader\': !isLayoutLoaded}">\n                <div class="slds-spinner_brand slds-spinner slds-spinner_large slds-m-top_x-large slds-m-bottom_x-large" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n            <vloc-layout layout-name="{{layout}}" class="{{layout}}" is-loaded="isLayoutLoaded" records="records" ctrl="{{ctrl}}"></vloc-layout>\n        </div>\n    </div>\n</div>\n')}]);

},{}]},{},[2]);
})();

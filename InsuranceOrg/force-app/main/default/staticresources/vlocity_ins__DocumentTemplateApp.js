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
angular.module('documentTemplateApp', ['vlocity', 'viaDirectives', 'mgcrea.ngStrap', 'ngSanitize',
    'ngAnimate', 'dndLists', 'documentTokenMappingApp', 'ngTagsInput', 'ui.tinymce', 'sldsangular', 'mentio'
]).config(['remoteActionsProvider', '$locationProvider', function(remoteActionsProvider, $locationProvider) {
    'use strict';
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    $locationProvider.html5Mode(true);
}])
.config(function($tooltipProvider) {
    'use strict';
    angular.extend($tooltipProvider.defaults, {
        trigger: 'hover'
    });
});
// Dependencies
require('./dependencies/mentio.js');

// Services
require('./modules/documentTemplateApp/services/documentStylesLibrary.js');
require('./modules/documentTemplateApp/services/BrowserDetection.js');

// Factories
require('./modules/documentTemplateApp/factory/ValidationErrorHandler.js');
require('./modules/documentTemplateApp/factory/EntityFilter.js');
require('./modules/documentTemplateApp/factory/TemplateTypeService.js');

// Controllers
require('./modules/documentTemplateApp/controller/DocumentTemplateController.js');
require('./modules/documentTemplateApp/controller/DocumentTemplateImgModalController.js');
require('./modules/documentTemplateApp/controller/DocumentTemplateSignatureModalController.js');
require('./modules/documentTemplateApp/controller/DocumentTemplateDropzoneController.js');

// Directives
require('./modules/documentTemplateApp/directive/CheckSectionSaved.js');
require('./modules/documentTemplateApp/directive/CheckTemplateSaved.js');
require('./modules/documentTemplateApp/directive/AddHoverClass.js');
require('./modules/documentTemplateApp/directive/VlcLoader.js');
require('./modules/documentTemplateApp/directive/FilePreviewEmbedSwf.js');
// require('./modules/documentTemplateApp/directive/MatchEntityFilters.js');

// Components
require('./modules/documentTemplateApp/component/webTemplateType.js');
require('./modules/documentTemplateApp/component/docxTemplateType.js');
require('./modules/documentTemplateApp/component/dropzone.js');

// Templates
require('./modules/documentTemplateApp/templates/templates.js');

// Constants
require('./modules/documentTemplateApp/constant/baseConstants.js');

},{"./dependencies/mentio.js":2,"./modules/documentTemplateApp/component/docxTemplateType.js":3,"./modules/documentTemplateApp/component/dropzone.js":4,"./modules/documentTemplateApp/component/webTemplateType.js":5,"./modules/documentTemplateApp/constant/baseConstants.js":6,"./modules/documentTemplateApp/controller/DocumentTemplateController.js":7,"./modules/documentTemplateApp/controller/DocumentTemplateDropzoneController.js":8,"./modules/documentTemplateApp/controller/DocumentTemplateImgModalController.js":9,"./modules/documentTemplateApp/controller/DocumentTemplateSignatureModalController.js":10,"./modules/documentTemplateApp/directive/AddHoverClass.js":11,"./modules/documentTemplateApp/directive/CheckSectionSaved.js":12,"./modules/documentTemplateApp/directive/CheckTemplateSaved.js":13,"./modules/documentTemplateApp/directive/FilePreviewEmbedSwf.js":14,"./modules/documentTemplateApp/directive/VlcLoader.js":15,"./modules/documentTemplateApp/factory/EntityFilter.js":16,"./modules/documentTemplateApp/factory/TemplateTypeService.js":17,"./modules/documentTemplateApp/factory/ValidationErrorHandler.js":18,"./modules/documentTemplateApp/services/BrowserDetection.js":19,"./modules/documentTemplateApp/services/documentStylesLibrary.js":20,"./modules/documentTemplateApp/templates/templates.js":21}],2:[function(require,module,exports){
'use strict';

angular.module('mentio', [])
    .directive('mentio', ['mentioUtil', '$document', '$compile', '$log', '$timeout',
        function (mentioUtil, $document, $compile, $log, $timeout) {
        return {
            restrict: 'A',
            scope: {
                macros: '=mentioMacros',
                search: '&mentioSearch',
                select: '&mentioSelect',
                items: '=mentioItems',
                typedTerm: '=mentioTypedTerm',
                altId: '=mentioId',
                iframeElement: '=mentioIframeElement',
                requireLeadingSpace: '=mentioRequireLeadingSpace',
                selectNotFound: '=mentioSelectNotFound',
                trimTerm: '=mentioTrimTerm',
                ngModel: '='
            },
            controller: ["$scope", "$timeout", "$attrs", function($scope, $timeout, $attrs) {

                $scope.query = function (triggerChar, triggerText) {
                    var remoteScope = $scope.triggerCharMap[triggerChar];

                    if ($scope.trimTerm === undefined || $scope.trimTerm) {
                        triggerText = triggerText.trim();
                    }

                    remoteScope.showMenu();

                    remoteScope.search({
                        term: triggerText
                    });

                    remoteScope.typedTerm = triggerText;
                };

                $scope.defaultSearch = function(locals) {
                    var results = [];
                    angular.forEach($scope.items, function(item) {
                        if (item.label.toUpperCase().indexOf(locals.term.toUpperCase()) >= 0) {
                            results.push(item);
                        }
                    });
                    $scope.localItems = results;
                };

                $scope.bridgeSearch = function(termString) {
                    var searchFn = $attrs.mentioSearch ? $scope.search : $scope.defaultSearch;
                    searchFn({
                        term: termString
                    });
                };

                $scope.defaultSelect = function(locals) {
                    return $scope.defaultTriggerChar + locals.item.label;
                };

                $scope.bridgeSelect = function(itemVar) {
                    var selectFn = $attrs.mentioSelect ? $scope.select : $scope.defaultSelect;
                    return selectFn({
                        item: itemVar
                    });
                };

                $scope.setTriggerText = function(text) {
                    if ($scope.syncTriggerText) {
                        $scope.typedTerm = ($scope.trimTerm === undefined || $scope.trimTerm) ? text.trim() : text;
                    }
                };

                $scope.context = function() {
                    if ($scope.iframeElement) {
                        return {iframe: $scope.iframeElement};
                    }
                };

                $scope.replaceText = function (text, hasTrailingSpace) {
                    $scope.hideAll();

                    mentioUtil.replaceTriggerText($scope.context(), $scope.targetElement, $scope.targetElementPath,
                        $scope.targetElementSelectedOffset, $scope.triggerCharSet, text, $scope.requireLeadingSpace,
                        hasTrailingSpace);

                    if (!hasTrailingSpace) {
                        $scope.setTriggerText('');
                        angular.element($scope.targetElement).triggerHandler('change');
                        if ($scope.isContentEditable()) {
                            $scope.contentEditableMenuPasted = true;
                            var timer = $timeout(function() {
                                $scope.contentEditableMenuPasted = false;
                            }, 200);
                            $scope.$on('$destroy', function() {
                                $timeout.cancel(timer);
                            });
                        }
                    }
                };

                $scope.hideAll = function () {
                    for (var key in $scope.triggerCharMap) {
                        if ($scope.triggerCharMap.hasOwnProperty(key)) {
                            $scope.triggerCharMap[key].hideMenu();
                        }
                    }
                };

                $scope.getActiveMenuScope = function () {
                    for (var key in $scope.triggerCharMap) {
                        if ($scope.triggerCharMap.hasOwnProperty(key)) {
                            if ($scope.triggerCharMap[key].visible) {
                                return $scope.triggerCharMap[key];
                            }
                        }
                    }
                    return null;
                };

                $scope.selectActive = function () {
                    for (var key in $scope.triggerCharMap) {
                        if ($scope.triggerCharMap.hasOwnProperty(key)) {
                            if ($scope.triggerCharMap[key].visible) {
                                $scope.triggerCharMap[key].selectActive();
                            }
                        }
                    }
                };

                $scope.isActive = function () {
                    for (var key in $scope.triggerCharMap) {
                        if ($scope.triggerCharMap.hasOwnProperty(key)) {
                            if ($scope.triggerCharMap[key].visible) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

                $scope.isContentEditable = function() {
                    return ($scope.targetElement.nodeName !== 'INPUT' && $scope.targetElement.nodeName !== 'TEXTAREA');
                };

                $scope.replaceMacro = function(macro, hasTrailingSpace) {
                    if (!hasTrailingSpace) {
                        $scope.replacingMacro = true;
                        $scope.timer = $timeout(function() {
                            mentioUtil.replaceMacroText($scope.context(), $scope.targetElement,
                                $scope.targetElementPath, $scope.targetElementSelectedOffset,
                                $scope.macros, $scope.macros[macro]);
                            angular.element($scope.targetElement).triggerHandler('change');
                            $scope.replacingMacro = false;
                        }, 300);
                        $scope.$on('$destroy', function() {
                            $timeout.cancel($scope.timer);
                        });
                    } else {
                        mentioUtil.replaceMacroText($scope.context(), $scope.targetElement, $scope.targetElementPath,
                            $scope.targetElementSelectedOffset, $scope.macros, $scope.macros[macro]);
                    }
                };

                $scope.addMenu = function(menuScope) {
                    if (menuScope.parentScope && $scope.triggerCharMap.hasOwnProperty(menuScope.triggerChar)) {
                        return;
                    }
                    $scope.triggerCharMap[menuScope.triggerChar] = menuScope;
                    if ($scope.triggerCharSet === undefined) {
                        $scope.triggerCharSet = [];
                    }
                    $scope.triggerCharSet.push(menuScope.triggerChar);
                    menuScope.setParent($scope);
                };

                $scope.$on(
                    'menuCreated', function (event, data) {
                        if (
                            $attrs.id !== undefined ||
                            $attrs.mentioId !== undefined
                        )
                        {
                            if (
                                $attrs.id === data.targetElement ||
                                (
                                    $attrs.mentioId !== undefined &&
                                    $scope.altId === data.targetElement
                                )
                            )
                            {
                                $scope.addMenu(data.scope);
                            }
                        }
                    }
                );

                $document.on(
                    'click', function () {
                        if ($scope.isActive()) {
                            $scope.$apply(function () {
                                $scope.hideAll();
                            });
                        }
                    }
                );

                $document.on(
                    'keydown keypress paste', function (event) {
                        var activeMenuScope = $scope.getActiveMenuScope();
                        var regex;
                        if (activeMenuScope) {
                            if (event.which === 9 || event.which === 13) {
                                event.preventDefault();
                                activeMenuScope.selectActive();
                            }

                            if (event.which === 27) {
                                event.preventDefault();
                                activeMenuScope.$apply(function () {
                                    regex = new RegExp(activeMenuScope.triggerChar, 'g');
                                    activeMenuScope.hideMenu();
                                    // Added by Robert Henderson to remove trigger char on keypress of esc
                                    activeMenuScope.parentMentio.ngModel = activeMenuScope.parentMentio.ngModel.replace(regex, '');
                                });
                            }

                            if (event.which === 40) {
                                event.preventDefault();
                                activeMenuScope.$apply(function () {
                                    activeMenuScope.activateNextItem();
                                });
                                activeMenuScope.adjustScroll(1);
                            }

                            if (event.which === 38) {
                                event.preventDefault();
                                activeMenuScope.$apply(function () {
                                    activeMenuScope.activatePreviousItem();
                                });
                                activeMenuScope.adjustScroll(-1);
                            }

                            if (event.which === 37 || event.which === 39) {
                                event.preventDefault();
                             }
                        }
                    }
                );
            }],
            link: function (scope, element, attrs) {
                scope.triggerCharMap = {};

                scope.targetElement = element;
                attrs.$set('autocomplete','off');

                if (attrs.mentioItems) {
                    scope.localItems = [];
                    scope.parentScope = scope;
                    var itemsRef = attrs.mentioSearch ? ' mentio-items="items"' : ' mentio-items="localItems"';

                    scope.defaultTriggerChar = attrs.mentioTriggerChar ? scope.$eval(attrs.mentioTriggerChar) : '@';

                    var html = '<mentio-menu' +
                        ' mentio-search="bridgeSearch(term)"' +
                        ' mentio-select="bridgeSelect(item)"' +
                        itemsRef;

                    if (attrs.mentioTemplateUrl) {
                        html = html + ' mentio-template-url="' + attrs.mentioTemplateUrl + '"';
                    }
                    html = html + ' mentio-trigger-char="\'' + scope.defaultTriggerChar + '\'"' +
                        ' mentio-parent-scope="parentScope"' +
                        '/>';
                    var linkFn = $compile(html);
                    var el = linkFn(scope);

                    element.parent().append(el);

                    scope.$on('$destroy', function() {
                      el.remove();
                    });
                }

                if (attrs.mentioTypedTerm) {
                    scope.syncTriggerText = true;
                }

                function keyHandler(event) {
                    function stopEvent(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                    }
                    var activeMenuScope = scope.getActiveMenuScope();
                    if (activeMenuScope) {
                        if (event.which === 9 || event.which === 13) {
                            stopEvent(event);
                            activeMenuScope.selectActive();
                            return false;
                        }

                        if (event.which === 27) {
                            stopEvent(event);
                            activeMenuScope.$apply(function () {
                                activeMenuScope.hideMenu();
                            });
                            return false;
                        }

                        if (event.which === 40) {
                            stopEvent(event);
                            activeMenuScope.$apply(function () {
                                activeMenuScope.activateNextItem();
                            });
                            activeMenuScope.adjustScroll(1);
                            return false;
                        }

                        if (event.which === 38) {
                            stopEvent(event);
                            activeMenuScope.$apply(function () {
                                activeMenuScope.activatePreviousItem();
                            });
                            activeMenuScope.adjustScroll(-1);
                            return false;
                        }

                        if (event.which === 37 || event.which === 39) {
                            stopEvent(event);
                            return false;
                        }
                    }
                }

                scope.$watch(
                    'iframeElement', function(newValue) {
                        if (newValue) {
                            var iframeDocument = newValue.contentWindow.document;
                            iframeDocument.addEventListener('click',
                                function () {
                                    if (scope.isActive()) {
                                        scope.$apply(function () {
                                            scope.hideAll();
                                        });
                                    }
                                }
                            );


                            iframeDocument.addEventListener('keydown', keyHandler, true /*capture*/);

                            scope.$on ( '$destroy', function() {
                                iframeDocument.removeEventListener ( 'keydown', keyHandler );
                            });
                        }
                    }
                );

                scope.$watch(
                    'ngModel',
                    function (newValue) {
                        /*jshint maxcomplexity:14 */
                        /*jshint maxstatements:39 */
                        // yes this function needs refactoring
                        if ((!newValue || newValue === '') && !scope.isActive()) {
                            // ignore while setting up
                            return;
                        }
                        if (scope.triggerCharSet === undefined) {
                            $log.error('Error, no mentio-items attribute was provided, ' +
                                'and no separate mentio-menus were specified.  Nothing to do.');
                            return;
                        }

                        if (scope.contentEditableMenuPasted) {
                            // don't respond to changes from insertion of the menu content
                            scope.contentEditableMenuPasted = false;
                            return;
                        }

                        if (scope.replacingMacro) {
                            $timeout.cancel(scope.timer);
                            scope.replacingMacro = false;
                        }

                        var isActive = scope.isActive();
                        var isContentEditable = scope.isContentEditable();

                        var mentionInfo = mentioUtil.getTriggerInfo(scope.context(), scope.triggerCharSet,
                            scope.requireLeadingSpace, isActive);

                        if (mentionInfo !== undefined &&
                                (
                                    !isActive ||
                                    (isActive &&
                                        (
                                            /* content editable selection changes to local nodes which
                                            modifies the start position of the selection over time,
                                            just consider triggerchar changes which
                                            will have the odd effect that deleting a trigger char pops
                                            the menu for a previous
                                            trigger char sequence if one exists in a content editable */
                                            (isContentEditable && mentionInfo.mentionTriggerChar ===
                                                scope.currentMentionTriggerChar) ||
                                            (!isContentEditable && mentionInfo.mentionPosition ===
                                                scope.currentMentionPosition)
                                        )
                                    )
                                )
                            )
                        {
                            /** save selection info about the target control for later re-selection */
                            if (mentionInfo.mentionSelectedElement) {
                                scope.targetElement = mentionInfo.mentionSelectedElement;
                                scope.targetElementPath = mentionInfo.mentionSelectedPath;
                                scope.targetElementSelectedOffset = mentionInfo.mentionSelectedOffset;
                            }

                            /* publish to external ngModel */
                            scope.setTriggerText(mentionInfo.mentionText);
                            /* remember current position */
                            scope.currentMentionPosition = mentionInfo.mentionPosition;
                            scope.currentMentionTriggerChar = mentionInfo.mentionTriggerChar;
                            /* perform query */
                            scope.query(mentionInfo.mentionTriggerChar, mentionInfo.mentionText);
                        } else {
                            var currentTypedTerm = scope.typedTerm;
                            scope.setTriggerText('');
                            scope.hideAll();

                            var macroMatchInfo = mentioUtil.getMacroMatch(scope.context(), scope.macros);

                            if (macroMatchInfo !== undefined) {
                                scope.targetElement = macroMatchInfo.macroSelectedElement;
                                scope.targetElementPath = macroMatchInfo.macroSelectedPath;
                                scope.targetElementSelectedOffset = macroMatchInfo.macroSelectedOffset;
                                scope.replaceMacro(macroMatchInfo.macroText, macroMatchInfo.macroHasTrailingSpace);
                            } else if (scope.selectNotFound && currentTypedTerm && currentTypedTerm !== '') {
                                var lastScope = scope.triggerCharMap[scope.currentMentionTriggerChar];
                                if (lastScope) {
                                    // just came out of typeahead state
                                    var text = lastScope.select({
                                        item: {label: currentTypedTerm}
                                    });
                                    if (typeof text.then === 'function') {
                                        /* text is a promise, at least our best guess */
                                        text.then(scope.replaceText);
                                    } else {
                                        scope.replaceText(text, true);
                                    }
                                }
                            }
                        }
                    }
                );
            }
        };
    }])

    .directive('mentioMenu', ['mentioUtil', '$rootScope', '$log', '$window', '$document',
        function (mentioUtil, $rootScope, $log, $window, $document) {
        return {
            restrict: 'E',
            scope: {
                search: '&mentioSearch',
                select: '&mentioSelect',
                items: '=mentioItems',
                triggerChar: '=mentioTriggerChar',
                forElem: '=mentioFor',
                parentScope: '=mentioParentScope'
            },
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.mentioTemplateUrl !== undefined ? tAttrs.mentioTemplateUrl : 'mentio-menu.tpl.html';
            },
            controller: ["$scope", function ($scope) {
                $scope.visible = false;

                // callable both with controller (menuItem) and without controller (local)
                this.activate = $scope.activate = function (item) {
                    $scope.activeItem = item;
                };

                // callable both with controller (menuItem) and without controller (local)
                this.isActive = $scope.isActive = function (item) {
                    return $scope.activeItem === item;
                };

                // callable both with controller (menuItem) and without controller (local)
                this.selectItem = $scope.selectItem = function (item) {
                    var text = $scope.select({
                        item: item
                    });
                    if (typeof text.then === 'function') {
                        /* text is a promise, at least our best guess */
                        text.then($scope.parentMentio.replaceText);
                    } else {
                        $scope.parentMentio.replaceText(text);
                    }
                };

                $scope.activateNextItem = function () {
                    var index = $scope.items.indexOf($scope.activeItem);
                    this.activate($scope.items[(index + 1) % $scope.items.length]);
                };

                $scope.activatePreviousItem = function () {
                    var index = $scope.items.indexOf($scope.activeItem);
                    this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
                };

                $scope.isFirstItemActive = function () {
                    var index = $scope.items.indexOf($scope.activeItem);

                    return index === 0;
                };

                $scope.isLastItemActive = function () {
                    var index = $scope.items.indexOf($scope.activeItem);

                    return index === ($scope.items.length - 1);
                };

                $scope.selectActive = function () {
                    $scope.selectItem($scope.activeItem);
                };

                $scope.isVisible = function () {
                    return $scope.visible;
                };

                $scope.showMenu = function () {
                    if (!$scope.visible) {
                        $scope.requestVisiblePendingSearch = true;
                    }
                };

                $scope.setParent = function (scope) {
                    $scope.parentMentio = scope;
                    $scope.targetElement = scope.targetElement;
                };
            }],

            link: function (scope, element) {
                element[0].parentNode.removeChild(element[0]);
                angular.element('.vlocity')[0].appendChild(element[0]);
                scope.menuElement = element; // for testing

                if (scope.parentScope) {
                    scope.parentScope.addMenu(scope);
                } else {
                    if (!scope.forElem) {
                        $log.error('mentio-menu requires a target element in tbe mentio-for attribute');
                        return;
                    }
                    if (!scope.triggerChar) {
                        $log.error('mentio-menu requires a trigger char');
                        return;
                    }
                    // send own scope to mentio directive so that the menu
                    // becomes attached
                    $rootScope.$broadcast('menuCreated',
                        {
                            targetElement : scope.forElem,
                            scope : scope
                        });
                }

                angular.element($window).bind(
                    'resize', function () {
                        if (scope.isVisible()) {
                            var triggerCharSet = [];
                            triggerCharSet.push(scope.triggerChar);
                            mentioUtil.popUnderMention(scope.parentMentio.context(),
                                triggerCharSet, element, scope.requireLeadingSpace);
                        }
                    }
                );

                scope.$watch('items', function (items) {
                    if (items && items.length > 0) {
                        scope.activate(items[0]);
                        if (!scope.visible && scope.requestVisiblePendingSearch) {
                            scope.visible = true;
                            scope.requestVisiblePendingSearch = false;
                        }
                    } else {
                        scope.hideMenu();
                    }
                });

                scope.$watch('isVisible()', function (visible) {
                    // wait for the watch notification to show the menu
                    if (visible) {
                        var triggerCharSet = [];
                        triggerCharSet.push(scope.triggerChar);
                        mentioUtil.popUnderMention(scope.parentMentio.context(),
                            triggerCharSet, element, scope.requireLeadingSpace);
                    }
                });

                scope.parentMentio.$on('$destroy', function () {
                    element.remove();
                });

                scope.hideMenu = function () {
                    scope.visible = false;
                    element.css('display', 'none');
                };

                scope.adjustScroll = function (direction) {
                    var menuEl = element[0];
                    var menuItemsList = menuEl.querySelector('ul');
                    var menuItem = (menuEl.querySelector('[mentio-menu-item].active') || 
                        menuEl.querySelector('[data-mentio-menu-item].active'));

                    if (scope.isFirstItemActive()) {
                        return menuItemsList.scrollTop = 0;
                    } else if(scope.isLastItemActive()) {
                        return menuItemsList.scrollTop = menuItemsList.scrollHeight;
                    }

                    if (direction === 1) {
                        menuItemsList.scrollTop += menuItem.offsetHeight;
                    } else {
                        menuItemsList.scrollTop -= menuItem.offsetHeight;
                    }
                };

            }
        };
    }])

    .directive('mentioMenuItem', function () {
        return {
            restrict: 'A',
            scope: {
                item: '=mentioMenuItem'
            },
            require: '^mentioMenu',
            link: function (scope, element, attrs, controller) {

                scope.$watch(function () {
                    return controller.isActive(scope.item);
                }, function (active) {
                    if (active) {
                        element.addClass('active');
                    } else {
                        element.removeClass('active');
                    }
                });

                element.bind('mouseenter', function () {
                    scope.$apply(function () {
                        controller.activate(scope.item);
                    });
                });

                element.bind('click', function () {
                    controller.selectItem(scope.item);
                    return false;
                });
            }
        };
    })
    .filter('unsafe', ["$sce", function($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    }])
    .filter('mentioHighlight', function() {
        function escapeRegexp (queryToEscape) {
            return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
        }

        return function (matchItem, query, hightlightClass) {
            if (query) {
                var replaceText = hightlightClass ?
                                 '<span class="' + hightlightClass + '">$&</span>' :
                                 '<strong>$&</strong>';
                return ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), replaceText);
            } else {
                return matchItem;
            }
        };
    });

'use strict';

angular.module('mentio')
    .factory('mentioUtil', ["$window", "$location", "$anchorScroll", "$timeout", function ($window, $location, $anchorScroll, $timeout) {

        // public
        function popUnderMention (ctx, triggerCharSet, selectionEl, requireLeadingSpace) {
            var coordinates;
            var mentionInfo = getTriggerInfo(ctx, triggerCharSet, requireLeadingSpace, false);

            if (mentionInfo !== undefined) {

                if (selectedElementIsTextAreaOrInput(ctx)) {
                    coordinates = getTextAreaOrInputUnderlinePosition(ctx, getDocument(ctx).activeElement,
                        mentionInfo.mentionPosition);
                } else {
                    coordinates = getContentEditableCaretPosition(ctx, mentionInfo.mentionPosition);
                }

                // Move the button into place.
                selectionEl.css({
                    top: coordinates.top + 'px',
                    left: coordinates.left + 'px',
                    position: 'absolute',
                    zIndex: 10000,
                    display: 'block'
                });

                $timeout(function(){
                    scrollIntoView(ctx, selectionEl);
                },0);
            } else {
                selectionEl.css({
                    display: 'none'
                });
            }
        }

        function scrollIntoView(ctx, elem)
        {
            // cheap hack in px - need to check styles relative to the element
            var reasonableBuffer = 20;
            var maxScrollDisplacement = 100;
            var clientRect;
            var e = elem[0];
            while (clientRect === undefined || clientRect.height === 0) {
                clientRect = e.getBoundingClientRect();
                if (clientRect.height === 0) {
                    e = e.childNodes[0];
                    if (e === undefined || !e.getBoundingClientRect) {
                        return;
                    }
                }
            }
            var elemTop = clientRect.top;
            var elemBottom = elemTop + clientRect.height;
            if(elemTop < 0) {
                $window.scrollTo(0, $window.pageYOffset + clientRect.top - reasonableBuffer);
            } else if (elemBottom > $window.innerHeight) {
                var maxY = $window.pageYOffset + clientRect.top - reasonableBuffer;
                if (maxY - $window.pageYOffset > maxScrollDisplacement) {
                    maxY = $window.pageYOffset + maxScrollDisplacement;
                }
                var targetY = $window.pageYOffset - ($window.innerHeight - elemBottom);
                if (targetY > maxY) {
                    targetY = maxY;
                }
                $window.scrollTo(0, targetY);
            }
        }

        function selectedElementIsTextAreaOrInput (ctx) {
            var element = getDocument(ctx).activeElement;
            if (element !== null) {
                var nodeName = element.nodeName;
                var type = element.getAttribute('type');
                return (nodeName === 'INPUT' && type === 'text') || nodeName === 'TEXTAREA';
            }
            return false;
        }

        function selectElement (ctx, targetElement, path, offset) {
            var range;
            var elem = targetElement;
            if (path) {
                for (var i = 0; i < path.length; i++) {
                    elem = elem.childNodes[path[i]];
                    if (elem === undefined) {
                        return;
                    }
                    while (elem.length < offset) {
                        offset -= elem.length;
                        elem = elem.nextSibling;
                    }
                    if (elem.childNodes.length === 0 && !elem.length) {
                        elem = elem.previousSibling;
                    }
                }
            }
            var sel = getWindowSelection(ctx);

            range = getDocument(ctx).createRange();
            range.setStart(elem, offset);
            range.setEnd(elem, offset);
            range.collapse(true);
            try{sel.removeAllRanges();}catch(error){}
            sel.addRange(range);
            targetElement.focus();
        }

        function pasteHtml (ctx, html, startPos, endPos) {
            var range, sel;
            sel = getWindowSelection(ctx);
            range = getDocument(ctx).createRange();
            range.setStart(sel.anchorNode, startPos);
            range.setEnd(sel.anchorNode, endPos);
            range.deleteContents();

            var el = getDocument(ctx).createElement('div');
            el.innerHTML = html;
            var frag = getDocument(ctx).createDocumentFragment(),
                node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }

        function resetSelection (ctx, targetElement, path, offset) {
            var nodeName = targetElement.nodeName;
            if (nodeName === 'INPUT' || nodeName === 'TEXTAREA') {
                if (targetElement !== getDocument(ctx).activeElement) {
                    targetElement.focus();
                }
            } else {
                selectElement(ctx, targetElement, path, offset);
            }
        }

        // public
        function replaceMacroText (ctx, targetElement, path, offset, macros, text) {
            resetSelection(ctx, targetElement, path, offset);

            var macroMatchInfo = getMacroMatch(ctx, macros);

            if (macroMatchInfo.macroHasTrailingSpace) {
                macroMatchInfo.macroText = macroMatchInfo.macroText + '\xA0';
                text = text + '\xA0';
            }

            if (macroMatchInfo !== undefined) {
                var element = getDocument(ctx).activeElement;
                if (selectedElementIsTextAreaOrInput(ctx)) {
                    var startPos = macroMatchInfo.macroPosition;
                    var endPos = macroMatchInfo.macroPosition + macroMatchInfo.macroText.length;
                    element.value = element.value.substring(0, startPos) + text +
                        element.value.substring(endPos, element.value.length);
                    element.selectionStart = startPos + text.length;
                    element.selectionEnd = startPos + text.length;
                } else {
                    pasteHtml(ctx, text, macroMatchInfo.macroPosition,
                            macroMatchInfo.macroPosition + macroMatchInfo.macroText.length);
                }
            }
        }

        // public
        function replaceTriggerText (ctx, targetElement, path, offset, triggerCharSet, 
                text, requireLeadingSpace, hasTrailingSpace) {
            resetSelection(ctx, targetElement, path, offset);

            var mentionInfo = getTriggerInfo(ctx, triggerCharSet, requireLeadingSpace, true, hasTrailingSpace);

            if (mentionInfo !== undefined) {
                if (selectedElementIsTextAreaOrInput()) {
                    var myField = getDocument(ctx).activeElement;
                    text = text + ' ';
                    var startPos = mentionInfo.mentionPosition;
                    var endPos = mentionInfo.mentionPosition + mentionInfo.mentionText.length + 1;
                    myField.value = myField.value.substring(0, startPos) + text +
                        myField.value.substring(endPos, myField.value.length);
                    myField.selectionStart = startPos + text.length;
                    myField.selectionEnd = startPos + text.length;
                } else {
                    // add a space to the end of the pasted text
                    text = text + '\xA0';
                    pasteHtml(ctx, text, mentionInfo.mentionPosition,
                            mentionInfo.mentionPosition + mentionInfo.mentionText.length + 1);
                }
            }
        }

        function getNodePositionInParent (ctx, elem) {
            if (elem.parentNode === null) {
                return 0;
            }
            for (var i = 0; i < elem.parentNode.childNodes.length; i++) {
                var node = elem.parentNode.childNodes[i];
                if (node === elem) {
                    return i;
                }
            }
        }

        // public
        function getMacroMatch (ctx, macros) {
            var selected, path = [], offset;

            if (selectedElementIsTextAreaOrInput(ctx)) {
                selected = getDocument(ctx).activeElement;
            } else {
                // content editable
                var selectionInfo = getContentEditableSelectedPath(ctx);
                if (selectionInfo) {
                    selected = selectionInfo.selected;
                    path = selectionInfo.path;
                    offset = selectionInfo.offset;
                }
            }
            var effectiveRange = getTextPrecedingCurrentSelection(ctx);
            if (effectiveRange !== undefined && effectiveRange !== null) {

                var matchInfo;

                var hasTrailingSpace = false;

                if (effectiveRange.length > 0 &&
                    (effectiveRange.charAt(effectiveRange.length - 1) === '\xA0' ||
                        effectiveRange.charAt(effectiveRange.length - 1) === ' ')) {
                    hasTrailingSpace = true;
                    // strip space
                    effectiveRange = effectiveRange.substring(0, effectiveRange.length-1);
                }

                angular.forEach(macros, function (macro, c) {
                    var idx = effectiveRange.toUpperCase().lastIndexOf(c.toUpperCase());

                    if (idx >= 0 && c.length + idx === effectiveRange.length) {
                        var prevCharPos = idx - 1;
                        if (idx === 0 || effectiveRange.charAt(prevCharPos) === '\xA0' ||
                            effectiveRange.charAt(prevCharPos) === ' ' ) {

                            matchInfo = {
                                macroPosition: idx,
                                macroText: c,
                                macroSelectedElement: selected,
                                macroSelectedPath: path,
                                macroSelectedOffset: offset,
                                macroHasTrailingSpace: hasTrailingSpace
                            };
                        }
                    }
                });
                if (matchInfo) {
                    return matchInfo;
                }
            }
        }

        function getContentEditableSelectedPath(ctx) {
            // content editable
            var sel = getWindowSelection(ctx);
            var selected = sel.anchorNode;
            var path = [];
            var offset;
            if (selected != null) {
                var i;
                var ce = selected.contentEditable;
                while (selected !== null && ce !== 'true') {
                    i = getNodePositionInParent(ctx, selected);
                    path.push(i);
                    selected = selected.parentNode;
                    if (selected !== null) {
                        ce = selected.contentEditable;
                    }
                }
                path.reverse();
                // getRangeAt may not exist, need alternative
                offset = sel.getRangeAt(0).startOffset;
                return {
                    selected: selected,
                    path: path,
                    offset: offset
                };
            }
        }

        // public
        function getTriggerInfo (ctx, triggerCharSet, requireLeadingSpace, menuAlreadyActive, hasTrailingSpace) {
            /*jshint maxcomplexity:11 */
            // yes this function needs refactoring 
            var selected, path, offset;
            if (selectedElementIsTextAreaOrInput(ctx)) {
                selected = getDocument(ctx).activeElement;
            } else {
                // content editable
                var selectionInfo = getContentEditableSelectedPath(ctx);
                if (selectionInfo) {
                    selected = selectionInfo.selected;
                    path = selectionInfo.path;
                    offset = selectionInfo.offset;
                }
            }
            var effectiveRange = getTextPrecedingCurrentSelection(ctx);

            if (effectiveRange !== undefined && effectiveRange !== null) {
                var mostRecentTriggerCharPos = -1;
                var triggerChar;
                triggerCharSet.forEach(function(c) {
                    var idx = effectiveRange.lastIndexOf(c);
                    if (idx > mostRecentTriggerCharPos) {
                        mostRecentTriggerCharPos = idx;
                        triggerChar = c;
                    }
                });
                if (mostRecentTriggerCharPos >= 0 &&
                        (
                            mostRecentTriggerCharPos === 0 ||
                            !requireLeadingSpace ||
                            /[\xA0\s]/g.test
                            (
                                effectiveRange.substring(
                                    mostRecentTriggerCharPos - 1,
                                    mostRecentTriggerCharPos)
                            )
                        )
                    )
                {
                    // VLOC EDIT: Robert Henderson
                    var currentTriggerSnippet = effectiveRange.substring(mostRecentTriggerCharPos + 1,
                        effectiveRange.length);
                    // var currentTriggerSnippet = effectiveRange.substring(mostRecentTriggerCharPos,
                    //     effectiveRange.length);

                    triggerChar = effectiveRange.substring(mostRecentTriggerCharPos, mostRecentTriggerCharPos+1);
                    // triggerChar = effectiveRange.substring(mostRecentTriggerCharPos, mostRecentTriggerCharPos + currentTriggerSnippet.length);
                    var firstSnippetChar = currentTriggerSnippet.substring(0,1);
                    var leadingSpace = currentTriggerSnippet.length > 0 &&
                        (
                            firstSnippetChar === ' ' ||
                            firstSnippetChar === '\xA0'
                        );
                    if (hasTrailingSpace) {
                        currentTriggerSnippet = currentTriggerSnippet.trim();
                    }
                    if (!leadingSpace && (menuAlreadyActive || !(/[\xA0\s]/g.test(currentTriggerSnippet)))) {
                        return {
                            mentionPosition: mostRecentTriggerCharPos,
                            mentionText: currentTriggerSnippet,
                            mentionSelectedElement: selected,
                            mentionSelectedPath: path,
                            mentionSelectedOffset: offset,
                            mentionTriggerChar: triggerChar
                        };
                    }
                }
            }
        }

        function getWindowSelection(ctx) {
            if (!ctx) {
                return window.getSelection();
            } else {
                return ctx.iframe.contentWindow.getSelection();
            }
        }

        function getDocument(ctx) {
            if (!ctx) {
                return document;
            } else {
                return ctx.iframe.contentWindow.document;
            }
        }

        function getTextPrecedingCurrentSelection (ctx) {
            var text;
            if (selectedElementIsTextAreaOrInput(ctx)) {
                var textComponent = getDocument(ctx).activeElement;
                var startPos = textComponent.selectionStart;
                text = textComponent.value.substring(0, startPos);

            } else {
                var selectedElem = getWindowSelection(ctx).anchorNode;
                if (selectedElem != null) {
                    var workingNodeContent = selectedElem.textContent;
                    var selectStartOffset = getWindowSelection(ctx).getRangeAt(0).startOffset;
                    if (selectStartOffset >= 0) {
                        text = workingNodeContent.substring(0, selectStartOffset);
                    }
                }
            }
            return text;
        }

        function getContentEditableCaretPosition (ctx, selectedNodePosition) {
            var markerTextChar = '\ufeff';
            var markerEl, markerId = 'sel_' + new Date().getTime() + '_' + Math.random().toString().substr(2);

            var range;
            var sel = getWindowSelection(ctx);
            var prevRange = sel.getRangeAt(0);
            range = getDocument(ctx).createRange();

            range.setStart(sel.anchorNode, selectedNodePosition);
            range.setEnd(sel.anchorNode, selectedNodePosition);

            range.collapse(false);

            // Create the marker element containing a single invisible character using DOM methods and insert it
            markerEl = getDocument(ctx).createElement('span');
            markerEl.id = markerId;
            markerEl.appendChild(getDocument(ctx).createTextNode(markerTextChar));
            range.insertNode(markerEl);
            sel.removeAllRanges();
            sel.addRange(prevRange);

            var coordinates = {
                left: 0,
                top: markerEl.offsetHeight
            };

            localToGlobalCoordinates(ctx, markerEl, coordinates);

            markerEl.parentNode.removeChild(markerEl);
            return coordinates;
        }

        function localToGlobalCoordinates(ctx, element, coordinates) {
            var obj = element;
            var iframe = ctx ? ctx.iframe : null;
            while(obj) {
                coordinates.left += obj.offsetLeft + obj.clientLeft;
                coordinates.top += obj.offsetTop + obj.clientTop;
                obj = obj.offsetParent;
                if (!obj && iframe) {
                    obj = iframe;
                    iframe = null;
                }
            }            
            obj = element;
            iframe = ctx ? ctx.iframe : null;
            while(obj !== getDocument().body) {
                if (obj.scrollTop && obj.scrollTop > 0) {
                    coordinates.top -= obj.scrollTop;
                }
                if (obj.scrollLeft && obj.scrollLeft > 0) {
                    coordinates.left -= obj.scrollLeft;
                }
                obj = obj.parentNode;
                if (!obj && iframe) {
                    obj = iframe;
                    iframe = null;
                }
            }            
         }

        function getTextAreaOrInputUnderlinePosition (ctx, element, position) {
            var properties = [
                'direction',
                'boxSizing',
                'width',
                'height',
                'overflowX',
                'overflowY',
                'borderTopWidth',
                'borderRightWidth',
                'borderBottomWidth',
                'borderLeftWidth',
                'paddingTop',
                'paddingRight',
                'paddingBottom',
                'paddingLeft',
                'fontStyle',
                'fontVariant',
                'fontWeight',
                'fontStretch',
                'fontSize',
                'fontSizeAdjust',
                'lineHeight',
                'fontFamily',
                'textAlign',
                'textTransform',
                'textIndent',
                'textDecoration',
                'letterSpacing',
                'wordSpacing'
            ];

            var isFirefox = (window.mozInnerScreenX !== null);

            var div = getDocument(ctx).createElement('div');
            div.id = 'input-textarea-caret-position-mirror-div';
            getDocument(ctx).body.appendChild(div);

            var style = div.style;
            var computed = window.getComputedStyle ? getComputedStyle(element) : element.currentStyle;

            style.whiteSpace = 'pre-wrap';
            if (element.nodeName !== 'INPUT') {
                style.wordWrap = 'break-word';
            }

            // position off-screen
            style.position = 'absolute';
            style.visibility = 'hidden';

            // transfer the element's properties to the div
            properties.forEach(function (prop) {
                style[prop] = computed[prop];
            });

            if (isFirefox) {
                style.width = (parseInt(computed.width) - 2) + 'px';
                if (element.scrollHeight > parseInt(computed.height))
                    style.overflowY = 'scroll';
            } else {
                style.overflow = 'hidden';
            }

            div.textContent = element.value.substring(0, position);

            if (element.nodeName === 'INPUT') {
                div.textContent = div.textContent.replace(/\s/g, '\u00a0');
            }

            var span = getDocument(ctx).createElement('span');
            span.textContent = element.value.substring(position) || '.';
            div.appendChild(span);

            // VLOC EDIT: Robert Henderson. Making token menu show to the top-left
            var coordinates = {
                top: (span.offsetTop - 215) + parseInt(computed.borderTopWidth) + parseInt(computed.fontSize),
                left: (span.offsetLeft - 205) + parseInt(computed.borderLeftWidth)
            };

            localToGlobalCoordinates(ctx, element, coordinates);

            getDocument(ctx).body.removeChild(div);

            return coordinates;
        }

        return {
            // public
            popUnderMention: popUnderMention,
            replaceMacroText: replaceMacroText,
            replaceTriggerText: replaceTriggerText,
            getMacroMatch: getMacroMatch,
            getTriggerInfo: getTriggerInfo,
            selectElement: selectElement,




            // private: for unit testing only
            getTextAreaOrInputUnderlinePosition: getTextAreaOrInputUnderlinePosition,
            getTextPrecedingCurrentSelection: getTextPrecedingCurrentSelection,
            getContentEditableSelectedPath: getContentEditableSelectedPath,
            getNodePositionInParent: getNodePositionInParent,
            getContentEditableCaretPosition: getContentEditableCaretPosition,
            pasteHtml: pasteHtml,
            resetSelection: resetSelection,
            scrollIntoView: scrollIntoView
        };
    }]);

angular.module("mentio").run(["$templateCache", function($templateCache) {$templateCache.put("mentio-menu.tpl.html","<style>\n.scrollable-menu {\n    height: auto;\n    max-height: 300px;\n    overflow: auto;\n}\n\n.menu-highlighted {\n    font-weight: bold;\n}\n</style>\n<ul class=\"dropdown-menu scrollable-menu\" style=\"display:block\">\n    <li mentio-menu-item=\"item\" ng-repeat=\"item in items track by $index\">\n        <a class=\"text-primary\" ng-bind-html=\"item.label | mentioHighlight:typedTerm:\'menu-highlighted\' | unsafe\"></a>\n    </li>\n</ul>");}]);
},{}],3:[function(require,module,exports){
angular.module('documentTemplateApp').component('docxTemplateType', {
    controller: 'documentTemplateCtrl',
    bindings: {
    	pageParams: '='
    },
    templateUrl: 'component/docxTemplateType.tpl.html'
});

},{}],4:[function(require,module,exports){
angular.module('documentTemplateApp').component('dropzone', {
    controller: 'DocumentTemplateDropzoneController',
    bindings: {
    	templateType: '<',
        templateActive: '<',
        templateData: '=',
        workspace: '<'
    },
    templateUrl: 'component/dropzone.tpl.html'
});

},{}],5:[function(require,module,exports){
angular.module('documentTemplateApp').component('webTemplateType', {
    controller: 'documentTemplateCtrl',
    bindings: {
    	pageParams: '='
    },
    templateUrl: 'component/webTemplateType.tpl.html'
});

},{}],6:[function(require,module,exports){
angular.module('documentTemplateApp')
  .constant('CONST', {
    'WEB': 'web',
    'DOCX': 'docx',
    'PPTX': 'pptx',
    'OBJECT_BASED': 'Object Based',
    'JSON_BASED': 'JSON Based',
    'UNDEFINED': undefined
});
},{}],7:[function(require,module,exports){
angular.module('documentTemplateApp').controller('documentTemplateCtrl', function(
    $scope, CONST, remoteActions, documentStylesLibrary, browserDetection, ValidationErrorHandler, EntityFilter,
    templateTypeService, $window, $filter, $q, $timeout, $modal, $rootScope, $location, $sldsModal, $interval) {
    'use strict';
    $scope.nameSpacePrefix = '';
    $scope.PdfGenerationSource;
    $scope.VlocityClientSide = 'vlocityclientside';

    if (window.nameSpacePrefix !== CONST.UNDEFINED) {
        $scope.nameSpacePrefix = window.nameSpacePrefix;
    }
    if (window.modalLabels !== CONST.UNDEFINED) {
        $scope.modalLabels = window.modalLabels;
    }
    if (window.labels !== CONST.UNDEFINED) {
        $scope.labels = window.labels;
    }
    if (window.pdfGenerationSource !== undefined) {
        $scope.pdfGenerationSource = window.pdfGenerationSource;
    }

    $scope.templateTypeService = templateTypeService;
    $scope.mentioTokens = [];

    // Sorts an array by an object key:
    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    function getTemplateTypeValues() {
        remoteActions.getTemplateTypeValues().then(function(typeOptions) {
            $scope.templateMetadata.templateDocumentTypeOptions = typeOptions;
            $scope.templateData.templateDocumentType = typeOptions[0].Label;

            if ($scope.$ctrl.pageParams.templateType && ($scope.$ctrl.pageParams.templateType !== typeOptions[0].code)) {
                angular.forEach(typeOptions, function(type) {
                    if (type.code === $scope.$ctrl.pageParams.templateType) {
                        $scope.templateData.templateDocumentType = type.Label;
                        $scope.templateData.templateCode = type.code;
                    }
                });
            }
        });
    }

    this.$onInit = function() {
        var jsonBasedMapping;

        if ($scope.$ctrl.pageParams.templateMetadata === null) {
            $scope.templateMetadata = {
                'templateCode': {
                    'Vlocity Web Template': 'web',
                    'Microsoft Word .DOCX Template': 'docx',
                    'Microsoft Powerpoint .PPTX Template': 'pptx'
                },
                'iconMap': {
                    'Microsoft Word .DOCX Template': 'word',
                    'Microsoft Powerpoint .PPTX Template': 'ppt'
                }
            };
        } else {
            $scope.templateMetadata = $scope.$ctrl.pageParams.templateMetadata;
        }

        if ($scope.$ctrl.pageParams.templateData !== null) {
            $scope.templateData = $scope.$ctrl.pageParams.templateData;
        }
        if (($scope.pdfGenerationSource && $scope.pdfGenerationSource.toLowerCase() == $scope.VlocityClientSide)) {
            pdfTronSetResourcePath(remoteActions, $scope.clientSidePdfGenerationConfig).then(function(result){
                  if( $scope.labels.VlocityPDFTronNoSystemUserMsg === result){
                      $scope.validationErrorHandler.throwError($scope.labels.VlocityPDFTronNoSystemUserMsg);
                  }
                  else{
                    $scope.clientSidePdfGenerationConfig = result.clientSidePdfGenerationConfig;
                    $scope.pdfIntegrationConfig= JSON.parse(result.license);
                    $scope.workerTransport = result.workerTransport;
                  }
              });
         }

        getTemplateFromUrl();
        if (!$scope.templateMetadata.templateDocumentTypeOptions) {
            getTemplateTypeValues();
        } else {
            $scope.templateData.templateCode = $scope.templateMetadata.templateCode[$scope.templateData.templateDocumentType];
        }

        // Only load clauses if editing an existing template:
        if ($scope.$ctrl.pageParams.templateId !== CONST.UNDEFINED) {
            $scope.getGenericClauses();
        }
        if ($scope.$ctrl.pageParams.templateType === CONST.DOCX || $scope.$ctrl.pageParams.templateType === CONST.PPTX) {
            // docx/pptx type support only JSONBased mapping
            jsonBasedMapping = $scope.templateTypeService.tokenMappingOptions[1];
            $scope.tokenJsonBasedMapping = [jsonBasedMapping];
            $scope.templateData.tokenMappingType = jsonBasedMapping.label;
            $scope.templateData.mappingMethodType = 'DataRaptor';
            
            if (!$scope.templateData.Id) {
                $scope.templateMetadata.showFileDetails = false;
            }

            $scope.getDocumentTemplateWorkspace();
        }

        $scope.initDocumentTemplateSearch();
    };

    $scope.initDocumentTemplateSearch = function() {
        delete $scope.documentTemplates;
        $scope.searchOptions = {
            'searchTerm': ''
        };
        $scope.showPagination = false;
        $scope.paginationOptions = {
            'pageSize': 10,
            'pageNumber': 1,
            'totalCount': 0,
            'totalPages': 0,
            'fromCount': 0,
            'toCount': 0
        };
    };

     $scope.getTemplateLanguages =function() {
        var i;
        remoteActions.getTemplateLanguages().then(function(result) {
            $scope.templateMetadata.templateDocumentLanguageOptions = result;
            //Adding 'None' option to the Language dropdown list.
            $scope.templateMetadata.templateDocumentLanguageOptions.push({Label: "--None--",Value:"", isActive: true});
            //set userLocale as default Template language.
            if ($scope.$ctrl.pageParams.templateId === CONST.UNDEFINED) {
                for (var j = 0; j < $scope.templateMetadata.templateDocumentLanguageOptions.length; j++) {
                    if(window.userLocale === $scope.templateMetadata.templateDocumentLanguageOptions[j].Value) {
                        $scope.templateData.selectedLanguageObject = $scope.templateMetadata.templateDocumentLanguageOptions[j];
                    }
                }
            }
        });
    };
    $scope.getTemplateLanguages();

    //on change, update the templateLanguage.
    $scope.onSelectedLanguageChange = function(langObject) {
        $scope.templateData.templateDocumentLanguage = langObject.Value;
    }

    $scope.searchTokenList = function(query, tokenList) {
        var tokenListArray = [];
        angular.forEach(tokenList, function(token) {
            if (token && token.label.toUpperCase().indexOf(query.toUpperCase()) >= 0) {
                tokenListArray.push(token);
            }
        });
        tokenListArray = sortByKey(tokenListArray, 'label');
        $scope.mentioTokens = tokenListArray;
        return $q.when(tokenListArray);
    };

    $scope.getTokenTextRaw = function(item) {
        var deferred = $q.defer();
        /* the select() function can also return a Promise which ment.io will handle
        propertly during replacement */
        // simulated async promise
        $timeout(function() {
            deferred.resolve(item.label);
        }, 100);
        return deferred.promise;
    };
    $scope.templateTokens = {
        sectionTokens: [],
        formatted: [],
        tokens: {}
    };
    $scope.templateFilterText = {};
    $scope.vlcLoading = false;
    $scope.browser = browserDetection.detectBrowser();
    $scope.isSafari = ($scope.browser === 'safari') ? true : false;
    $scope.isInternetExplorer = ($scope.browser === 'msielte10' || $scope.browser === 'msiegt10') ? true : false;
    $scope.browserVersion = browserDetection.getBrowserVersion();
    
    // transitionDuration must match transition duration in css:
    $scope.transitionDuration = 500;
    $scope.templates = [];
    $scope.templateSaved = {
        'isSaved': true
    };
    $scope.trackRedlinesSetting = true;
    $scope.trackingSetting = function() {
        remoteActions.getTrackChangeSetting().then(function(result) {
            $scope.trackRedlinesSetting = result;
        });
    };
    $scope.trackingSetting();

    $scope.documentTemplateWorkspace = null;
    $scope.getDocumentTemplateWorkspace = function() {
        remoteActions.getDocumentTemplateWorkspace().then(function(result) {
            if (result.documentTemplateWorkspace) {
                $scope.documentTemplateWorkspace = result.documentTemplateWorkspace;
            }
        }, function(error) {
            $scope.validationErrorHandler.throwError({'type': '', 'message': 'The "VlocityDocumentTemplateLibrary" workspace could not be found.'});
        });
    };

    $scope.templateData = {
        'templateVersion': 1,
        'templateDocumentFontStyle': '\'Times New Roman\', times, serif',
        'sections': [],
        'templateTrackRedlines': $scope.trackRedlinesSetting,
        'tokenMappingType': CONST.OBJECT_BASED,
        'templateSectionHeaderDisplayStyleObj': {},
        'lastSectionKey': 'E000',
        'isDefaultContractType': true,
        'documentGenerationMechanism': 'Default',
        'pdfGenerationMechanism': 'Default'

    };
    $scope.sectionsPerPage = 10;
    $scope.templateActive = false;
    $scope.templateArchived = false;
    $scope.documentStyles = {
        'activePanel': -1,
        'activePanelSection': -1
    };
    $scope.validationErrors = {
        'sections': []
    };
    $scope.productList = [];
    $scope.entityFilters = {};
    $scope.saveSectionBtn = '';
    $scope.deleteSectionBtn = '';
    $scope.embeddedSections = [];
    $scope.subCenterType = '';
    $scope.validationMessage = '';
    $scope.validationWarningMessage = '';
    $scope.validationErrorDetails = '';
    $scope.templateDeactivateErrorMsg = '';
    $scope.checkUniqueName = false;
    $scope.templateProperties = false;
    $scope.showTemplates = false;
    $scope.newSection = false;
    $scope.currentSectionSequence = null;
    $scope.conditionalClauses = false;
    $scope.genericClauses = [];
    $scope.showClauses = false;
    $scope.collapseCenter = true;
    $scope.collapseSubCenter = true;
    $scope.cloningTemplate = false;
    $scope.saveTemplateBtnText = 'Save Template Details';
    $scope.leftColHeader = $scope.labels.CLMTemplateStartNewTemplate;
    $scope.centerHeader = '';
    $scope.bodyHeader = $scope.labels.CLMTemplateEditTemplateDetails;
    $scope.sectionTypes = [];
    $scope.sectionNotSaved = $scope.labels.CLMTemplateSectionNotSaved;
    $scope.sectionErrorsExist = $scope.labels.CLMTemplateSectionErrorsExist;
    $scope.saveAllSectionsBtn = {
        'text': 'Save All Sections'
    };
    $scope.entityFilterOverlay = {
        'show': false
    };
    $scope.settingsFilterOverlay = {
        'show': false
    };
    $scope.sectionLineItemValid = true;
    $scope.imgModalInstance = {};
    //Signature section scope variables
    $scope.anchorSelectList = [];
    $scope.signerRoles = [];
    $scope.anchorTypeMap = {};
    $scope.signContent = '';
    $scope.nsAnchorField = $scope.nameSpacePrefix + 'AnchorString__c';
    $scope.nsSignerRoleField = $scope.nameSpacePrefix + 'SignerRoles__c';
    $scope.anchorSelectList = [];
    $scope.signerRoles = [];
    $scope.anchorTypeMap = {};
    // Heading Level Form Data:
    $scope.stylesLibrary = {};
    $scope.sectionConditionTypes = ['Basic', 'Advanced'];
    $scope.isCreatingNewVersion = false;
    $scope.defaultContractType = '';
    $scope.contractList = [];
    $scope.selectedContractTypes = [];
    $scope.validateEntityFilters = '';
    $scope.selectedFontFormat = 'left';
    $scope.fieldlabels = {};
    $scope.showMore = false;

    // Get section types and cache immediately on page load:
    $scope.getSectionTypes = function() {
        var i;
        var deferred = $q.defer();
        var typesDict = {};
        remoteActions.getSectionTypes($scope.templateData.tokenMappingType).then(function(result) {
            $scope.sectionTypes = result;
            for (i = 0; i <= $scope.sectionTypes.length - 1; i++) {
                typesDict[$scope.sectionTypes[i].Value] = $scope.sectionTypes[i].Label;
            }
            deferred.resolve(typesDict);
        }, function(error) {
            deferred.reject('Problem with remote action: getSectionTypes().', error);
            $scope.validationErrorHandler.throwError(error);
        });
        return deferred.promise;
    };

    $scope.showDropDown = function() {
        if ($scope.showMore) {
            $scope.showMore = false;
        } else {
            $scope.showMore = true;
        }
    };

    if (documentStylesLibrary.stylesLibrary !== CONST.UNDEFINED) {
        $scope.stylesLibrary = documentStylesLibrary.stylesLibrary;
    }
    if (documentStylesLibrary.headingLevels !== CONST.UNDEFINED) {
        $scope.templateData.templateSectionHeaderDisplayStyleObj.headingLevels =  documentStylesLibrary.headingLevels;
    }
    // End Heading Level Form Data.

    var documentStylesheetRef = $('link[rel=stylesheet]').filter(function() {
        return /DocumentBaseCss/.test(this.getAttribute('href'));
    });

    $scope.closeSuccessBanner = function() {
        $scope.validationMessage = '';
        $scope.validationWarningMessage = '';
        $scope.validationErrorMessage = '';
        $scope.docxErrorMessage = '';
        $scope.docxErrorDetails = '';
    };

    $scope.checkParent = function() {
        var event = new CustomEvent('documentTemplateFilterModalClosed', {'detail': 'Example of an event'});

        // Dispatch/Trigger/Fire the event
        document.dispatchEvent(event);
    };

    $scope.tinymceOptions = {
        entity_encoding: "raw",
        body_class: 'vlocity',
        selector: 'textarea.tinymce-editor',  // change this value according to your HTML
        advlist_number_styles: 'default,lower-alpha,upper-alpha,lower-roman,upper-roman',
        advlist_bullet_styles: 'default,circle,square',
        style_formats: [
            {title: 'Inline', items: [
              {title: 'Bold', icon: 'bold', format: 'bold'},
              {title: 'Italic', icon: 'italic', format: 'italic'},
              {title: 'Underline', icon: 'underline', format: 'underline'},
              {title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough'},
              {title: 'Superscript', icon: 'superscript', format: 'superscript'},
              {title: 'Subscript', icon: 'subscript', format: 'subscript'}
            ]},
            {title: 'Blocks', items: [
              {title: 'Paragraph', format: 'p'}
            ]},
            {title: 'Alignment', items: [
              {title: 'Left', icon: 'alignleft', format: 'alignleft'},
              {title: 'Center', icon: 'aligncenter', format: 'aligncenter'},
              {title: 'Right', icon: 'alignright', format: 'alignright'},
              {title: 'Justify', icon: 'alignjustify', format: 'alignjustify'}
            ]}
        ],
        height: 250,
        menubar: false,
        elementpath: false,
        plugins: [
          'code advlist autolink lists link image charmap preview hr anchor pagebreak',
          'searchreplace wordcount visualblocks visualchars code fullscreen',
          'insertdatetime media nonbreaking table contextmenu directionality',
          'template paste textcolor colorpicker textpattern'
        ],
        table_default_styles: {
            fontSize: '10pt',
            fontFamily: $scope.templateData.templateDocumentFontStyle,
            width: '100%'
        },
        paste_auto_cleanup_on_paste: true,
        init_instance_callback: function(editor) {
            if ($scope.templateActive) {
                editor.getBody().setAttribute('contenteditable',false);
            }
            $(editor.getBody()).css({
                'font-family': $scope.templateData.templateDocumentFontStyle,
                'font-size': '10pt'
            });
        },
        browser_spellcheck: true,
        setup: function(editor) {
            $scope.tinymceSetup(editor);
        },
        toolbar1: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link searchreplace',
        toolbar2: 'preview | forecolor backcolor | code | table | fontselect fontsizeselect',
        content_css: documentStylesheetRef[0].getAttribute('href'),
        fontsize_formats: '6pt 7pt 8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 30pt 36pt'
    };

    // Moved this outside tinymce setup so I can call it in more than one setup function (in addSectionType)
    $scope.tinymceSetup = function(editor) {
        editor.addButton('insertImage', {
            text: 'Insert Image',
            icon: 'image',
            onclick: function() {
                if (!$scope.templateActive) {
                    $scope.imgModalInstance = $sldsModal({
                        templateUrl: 'select-image-modal.tpl.html',
                        controller: 'selectImageModalController',
                        container: 'div.vlocity',
                        placement: 'center',
                        backdrop: false,
                        scope: $scope,
                        resolve: {
                            editor: function() {
                                return editor;
                            }
                        }
                    });
                }
            }
        });
        editor.addButton('insertSignature', {
            text: 'Insert Signature',
            icon: true,
            onclick: function() {
                if (!$scope.templateActive) {
                    $sldsModal({
                        templateUrl: 'signature-modal.tpl.html',
                        controller: 'signatureModalController',
                        container: 'div.vlocity',
                        placement: 'center',
                        backdrop: false,
                        scope: $scope,
                        resolve: {
                            editor: function() {
                                return editor;
                            },
                            anchorList: function() {
                                return $scope.anchorSelectList;
                            },
                            signerRoleList: function() {
                                return $scope.signerRoles;
                            }
                        }
                    });
                }
            }
        });
        editor.on('ExecCommand',function(e) {
            var val, node, nodeParent, children, i, child;
            var cmd = e.command;
            if (cmd === 'FontSize' || cmd === 'FontName') {
                val = e.value;
                node = e.target.selection.getNode();
                nodeParent = node.parentNode;
                if (node.nodeName === 'SPAN' && nodeParent.nodeName === 'LI') {
                    children = $(node).children('li');
                    if (children) {
                        children.removeAttr('data-mce-style');
                        if (cmd === 'FontSize') {
                            children.css('font-size',val);
                            $(node.parentNode).css('font-size',val);
                        }
                        if (cmd === 'FontName') {
                            children.css('font-family',val);
                            $(node.parentNode).css('font-family',val);
                        }
                    }
                } else if (node.nodeName === 'OL' || node.nodeName === 'UL') {
                    children = node.children;
                    for (i = 0; i < children.length; i++) {
                        child = $(children[i]);
                        child.removeAttr('data-mce-style');
                        if (cmd === 'FontSize') {
                            child.css('font-size',val);
                        }
                        if (cmd === 'FontName') {
                            child.css('font-family',val);
                        }
                    }
                }
            }
        });
    };

    $scope.warningText = '';
    //Image Section
    $rootScope.$on('imgModalClosed', function(event, imgSrc, imgSrcTag, editor) {
        var images, i, image, height, width, insertImgSrc, editorContent;
        $scope.imgModalInstance.$promise.then($scope.imgModalInstance.hide);
        images = document.images;
        var imgSrcActualUrl;
        if(imgSrc.indexOf('&amp;oid') > -1){
                                var tempstr = imgSrc.split('amp;');
                                var newurl = tempstr[0] +tempstr[1];
                                imgSrcActualUrl = newurl;
                                }
        for (i = 0; i < images.length; i++) {
            image = images[i];
            if (image.currentSrc.indexOf(imgSrcActualUrl) > -1) {
                height = image.naturalHeight;
                width = image.naturalWidth;
                insertImgSrc = 'src="' + imgSrc + '" width="' + width + '" height="' + height + '"';
                editorContent = editor.getContent().replace(imgSrcTag,insertImgSrc);
                editor.setContent(editorContent);
                break;
            }
        }
    });
    //End Image Section

    //Item Section
    $scope.addItemHeader = function(section) {
        $scope.validateSectionLineItem(section);
        var newRow = {
            columnHeader: '',
            columnToken: '',
            totalToken: '',
            isEditable: true
        };

        //If not validatione errors, add line item
        if ($scope.validationErrors.sections[section.sectionSequence].sectionErrors === false) {
            section.sectionLineItems.push(newRow);
        }
    };

    $scope.makeItemHeaderEditable = function(index, section) {
        for (var i = 0; i < section.sectionLineItems.length; i++) {
            var itemHeader = section.sectionLineItems[i];
            itemHeader.isEditable = false;
        }
        if (!$scope.templateActive) {
            section.sectionLineItems[index].isEditable = true;
        }
    };

    $scope.makeItemHeaderReadonly = function(section) {
        for (var i = 0; i < section.sectionLineItems.length; i++) {
            var itemHeader = section.sectionLineItems[i];
            itemHeader.isEditable = false;
        }
    };

    $scope.deleteFromItemHeader = function(index, section) {
        section.sectionLineItems.splice(index,1);
    };

    $scope.convertItemColumnsToSectionData = function(section) {
        var dataMap = {};
        var totalMap = {};
        //section.sectionTokens = {};

        for (var i = 0; i < section.sectionLineItems.length; i++) {
            var itemHeader = section.sectionLineItems[i];
            //section.sectionTokens[itemHeader['columnToken']] = {};
            dataMap[itemHeader.columnHeader] = itemHeader.columnToken;

            if ($scope.templateData.tokenMappingType === CONST.OBJECT_BASED && itemHeader.totalToken.trim() !== '') {
                //section.sectionTokens[itemHeader['totalToken']] = {};
                totalMap[itemHeader.columnHeader] = itemHeader.totalToken;
            } else if ($scope.templateData.tokenMappingType === CONST.JSON_BASED && itemHeader.totalToken) {
                totalMap[itemHeader.columnHeader] = '';
            }

        }
        $scope.lineItemMap = {};
        $scope.lineItemMap.total = totalMap;
        $scope.lineItemMap.data = dataMap;
        $scope.lineItemMap.display = section.sectionLineItems;
        section.sectionContent = angular.toJson($scope.lineItemMap,true);

    };
    //End Item Section
    //Signature Section
    remoteActions.getSignatureTabs().then(function(result) {
        var anchorStringTabs = result;
        if (anchorStringTabs) {
            var anchorTabMaps = anchorStringTabs[$scope.nsAnchorField].split(',');

            if (typeof anchorTabMaps !== 'undefined' && anchorTabMaps.length > 0) {
                for (var i = 0; i < anchorTabMaps.length; i++) {
                    if (anchorTabMaps[i].indexOf(':') >= 0) {
                        var anchorTag = {};
                        anchorTag.type = anchorTabMaps[i].split(':')[0].trim();
                        anchorTag.anchorString = anchorTabMaps[i].split(':')[1].trim();
                        $scope.anchorSelectList.push(anchorTag);
                        $scope.anchorTypeMap[anchorTag.anchorString] =  anchorTag.type;
                    }
                }
            }
            var signerRoleList = [];
            if (anchorStringTabs[$scope.nsSignerRoleField]) {
                if (anchorStringTabs[$scope.nsSignerRoleField].indexOf(',') >= 0) {
                    signerRoleList = anchorStringTabs[$scope.nsSignerRoleField].split(',');
                    if (typeof signerRoleList !== 'undefined' && signerRoleList.length > 0) {
                        for (var j = 0; j < signerRoleList.length; j++) {
                            var signerRole = {};
                            signerRole.value = j + 1;
                            signerRole.label = signerRoleList[j].trim();
                            $scope.signerRoles.push(signerRole);
                        }
                    }
                } else {
                    var singleRole = {};
                    singleRole.value = 1;
                    singleRole.label = anchorStringTabs[$scope.nsSignerRoleField].trim();
                    $scope.signerRoles.push(singleRole);
                }
            }
        }
    }, function(error) {
        $scope.validationErrorHandler.throwError(error);
    });

    $scope.processSignatureTokens = function(section) {
        var tabTokensRegex = /\\([^[\\]+)\\/g;
        var numRegex = /\d/;
        var match = [];
        $scope.anchorTabObj = {};
        $scope.anchorTabs = [];
        while ((match = tabTokensRegex.exec(section.sectionContent)) !== null) {
            var anchor = match[0].substr(1, match[0].length - 2);
            var numMatch = numRegex.exec(anchor);
            var anchorOrder;
            if (numMatch) {
                anchorOrder = numMatch[0];
            }
            var indexOfNum = anchor.indexOf(anchorOrder);
            var signToken = {};
            signToken.anchorString = match[0];
            signToken.tabType = $scope.anchorTypeMap[anchor.substr(0, indexOfNum)];
            signToken.signerRole = anchorOrder;

            $scope.anchorTabs.push(signToken);
        }
        $scope.anchorTabObj.anchors = $scope.anchorTabs;
        section.signatureToken = $scope.anchorTabObj;
    };
    //End Signature Section
    $scope.search = false;
    $scope.query = {
        Type: 'Select Template Type'
    };
    $scope.templateCount = {};

    $scope.getDefaultContractType = function() {
        remoteActions.getDefaultContractType().then(function(result) {
            $scope.defaultContractType = result;
        });
    };
    $scope.getDefaultContractType();

    //Contract Types:
    $scope.getContractTypeList = function() {
        $scope.contractTypeList = [];
        remoteActions.getContractTypeList().then(function(result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].Name !== $scope.defaultContractType) {
                    var type = {'text': result[i].Name, 'id': result[i].Id};
                    $scope.contractList.push(type);
                    $scope.contractTypeList.push(result[i].Name);
                }
            }
        });
    };
    $scope.getContractTypeList();

    $scope.switchToDefault = function() {
        $scope.templateData.isDefaultContractType = true;
        $scope.templateData.templateContractTypes = $scope.defaultContractType;
        $scope.selectedContractTypes = [];
    };

    $scope.switchToCustom = function() {
        $scope.templateData.isDefaultContractType = false;
        $scope.templateData.templateContractTypes = '';
        $scope.selectedContractTypes = [];
    };

    $scope.searchContractTypeList = function(query) {
        var contractTypeList = $scope.contractTypeListWrapper(query);
        return contractTypeList;
    };

    $scope.contractTypeListWrapper = function(query) {
        var deferred = $q.defer();
        var callbackfunction = function(result) {
            $scope.$apply(function() {
                var sresult = [];
                if (result) {
                    sresult = angular.fromJson(result);
                }
                deferred.resolve(sresult);
            });
        };
        $scope.searchContractListCallback(query,callbackfunction);
        return deferred.promise;
    };

    $scope.searchContractListCallback = function(query, callback) {
        var data;
        var filter = {};
        var contractList = $scope.contractList;
        query = query.trim();
        if (query !== '') {
            filter.text = query;
            data = $filter('filter')(contractList, filter);
            callback(data);
        }else {
            callback(contractList);
        }
    };

    $scope.addContractType = function($tag) {
        var i;
        var inArray = false;
        for (i = 0; i < $scope.selectedContractTypes.length; i++) {
            if ($scope.selectedContractTypes[i].id === $tag.id) {
                inArray = true;
            }
        }
        if (!inArray) {
            $scope.selectedContractTypes.push($tag);
        }
    };

    $scope.removeContractType = function($tag) {
        var i;
        for (i = 0; i < $scope.selectedContractTypes.length; i++) {
            if ($scope.selectedContractTypes[i].id === $tag.id) {
                $scope.selectedContractTypes.splice(i,1);
            }
        }
    };

    $scope.getSelectedContractTypes = function() {
        var str = '';
        for (var i = 0; i < $scope.selectedContractTypes.length; i++) {
            str += $scope.selectedContractTypes[i].text + ';';
        }
        str = str.substring(0, str.length - 1);
        $scope.templateData.templateContractTypes = str;
    };

    $scope.loadExistingTemplateData = function(templateDetails, sections, useTemplateId, conditions) {
        var applicableTypes, i, applicableItemTypes, j, sectionIds, reorderSectionSequences, k, tinymceOptions, tempSectionObj,
            productList, m, lineItemSectionData, contractTypes, n, key, templateTokens, o;
        // Load in template details:
        $scope.templateData.templateSignature = templateDetails[$scope.nameSpacePrefix + 'IsSignatureRequired__c'];
        $scope.templateData.templateTrackRedlines = templateDetails[$scope.nameSpacePrefix + 'TrackContractRedlines__c'];
        if (useTemplateId) {
            if (templateDetails[$scope.nameSpacePrefix + 'TokenData__c']) {
                templateTokens = angular.fromJson(templateDetails[$scope.nameSpacePrefix + 'TokenData__c']);
            }
            $scope.templateData.templateName = templateDetails.Name;
            $scope.templateData.lastSectionKey = templateDetails[$scope.nameSpacePrefix + 'LastSectionKey__c'] ||                 
                                                                    $scope.templateData.lastSectionKey;
            $scope.templateData.templateDocumentType = templateDetails[$scope.nameSpacePrefix + 'TemplateContentFormat__c'];
            $scope.templateData.tokenMappingType = templateDetails[$scope.nameSpacePrefix + 'MappingType__c'];
            $scope.templateData.contentDocId = templateDetails[$scope.nameSpacePrefix + 'TemplateContentDocumentId__c'];
            $scope.templateData.dataRaptorBundleName = templateDetails[$scope.nameSpacePrefix + 'TokenDRBundleName__c'];
            $scope.templateData.wordDocumentTemplateName = templateDetails[$scope.nameSpacePrefix + 'WordDocumentTemplate__c'];
            $scope.templateData.dataExtractDataBundleName = templateDetails[$scope.nameSpacePrefix + 'DataExtractDRBundleName__c'];
            $scope.templateData.usageType = templateDetails[$scope.nameSpacePrefix + 'UsageType__c'];
            $scope.templateData.templateDocumentLanguage = templateDetails[$scope.nameSpacePrefix + 'LocaleCode__c'] || '';
            $scope.templateData.applicableItemTypes = templateDetails[$scope.nameSpacePrefix + 'ApplicableItemTypes__c'];
            $scope.templateData.applicableTypes = templateDetails[$scope.nameSpacePrefix + 'ApplicableTypes__c'];
            $scope.templateData.displayUnmappedTokens = templateDetails[$scope.nameSpacePrefix + 'DisplayUnmappedTokens__c'];
            $scope.templateData.templateId = templateDetails.Id;
            $scope.templateData.extractEmbeddedTemplateTokens = templateDetails[$scope.nameSpacePrefix + 'ExtractEmbeddedTemplateTokens__c'];
            $scope.templateData.customClassName = templateDetails[$scope.nameSpacePrefix + 'CustomClassName__c'];
            $scope.templateData.mappingMethodType = templateDetails[$scope.nameSpacePrefix + 'MappingMethodType__c'] || $scope.templateData.mappingMethodType; 
            $scope.templateData.hasBatchableSections = templateDetails[$scope.nameSpacePrefix + 'HasBatchableSections__c'];
            $scope.templateData.templateContentVersionId = templateDetails[$scope.nameSpacePrefix +'TemplateContentVersionId__c'];
            $scope.templateData.documentGenerationMechanism = templateDetails[$scope.nameSpacePrefix +'DocumentGenerationMechanism__c'];
            $scope.templateData.pdfGenerationMechanism = templateDetails[$scope.nameSpacePrefix +'PdfGenerationMechanism__c'];

            remoteActions.getDRBundleId($scope.templateData.templateId).then(function(result) {
                $scope.templateData.drbundleId = result.drbundleId;
                $scope.templateData.dedrbundleId = result.dedrbundleId;
            }, function(error) {
                $scope.validationErrorHandler.throwError(error);
            });
            if(templateDetails.orginalFileId && templateDetails.orginalFileId !== templateDetails[$scope.nameSpacePrefix +'TemplateContentVersionId__c']) {
                $scope.templateData.orginalFileData = {
                    Id:templateDetails.orginalFileId
                };
            }
            $scope.templateData.templateActive = templateDetails[$scope.nameSpacePrefix + 'IsActive__c'];
            if (templateDetails[$scope.nameSpacePrefix + 'IsActive__c']) {
                $scope.templateActive = true;
            }
            if (templateDetails[$scope.nameSpacePrefix + 'Status__c'] === 'Archived') {
                $scope.templateArchived = true;
                $scope.templateActive = true;
            }
            //setting the language on the template
            for (var j = 0; j < $scope.templateMetadata.templateDocumentLanguageOptions.length; j++) {
                if($scope.templateData.templateDocumentLanguage === $scope.templateMetadata.templateDocumentLanguageOptions[j].Value) {
                    $scope.templateData.selectedLanguageObject = $scope.templateMetadata.templateDocumentLanguageOptions[j];                       
                }
            }

            $scope.templateData.fileData = templateDetails.fileData;
            if (templateDetails.fileData) {
                $scope.templateMetadata.showFileDetails = true;
                $scope.templateData.fileName = $scope.templateData.fileData.Title;
            } else {
                $scope.templateMetadata.showFileDetails = false;
            }
        } else {
            $scope.templateData.templateName = templateDetails.Name + ' Copy';
            $scope.templateData.templateActive = false;
            $scope.templateData.templateDocumentType = templateDetails[$scope.nameSpacePrefix + 'TemplateContentFormat__c'];
            $scope.templateData.tokenMappingType = templateDetails[$scope.nameSpacePrefix + 'MappingType__c'];
            $scope.templateData.displayUnmappedTokens = templateDetails[$scope.nameSpacePrefix + 'DisplayUnmappedTokens__c'];
            $scope.templateData.extractEmbeddedTemplateTokens = templateDetails[$scope.nameSpacePrefix + 'ExtractEmbeddedTemplateTokens__c'];
            $scope.templateData.wordDocumentTemplateName = templateDetails[$scope.nameSpacePrefix + 'WordDocumentTemplate__c'];
            $scope.templateData.usageType = templateDetails[$scope.nameSpacePrefix + 'UsageType__c'];
            $scope.templateData.applicableItemTypes = templateDetails[$scope.nameSpacePrefix + 'ApplicableItemTypes__c'];
            $scope.templateData.applicableTypes = templateDetails[$scope.nameSpacePrefix + 'ApplicableTypes__c'];
            $scope.templateData.oldDataRaptorBundleName = templateDetails[$scope.nameSpacePrefix + 'TokenDRBundleName__c'];
            $scope.templateData.dataRaptorBundleName = $scope.templateData.oldDataRaptorBundleName ? $scope.templateData.oldDataRaptorBundleName + ' Copy' : '';
            $scope.templateData.oldDataExtractDataBundleName = templateDetails[$scope.nameSpacePrefix + 'DataExtractDRBundleName__c'];
            $scope.templateData.dataExtractDataBundleName = $scope.templateData.oldDataExtractDataBundleName ? $scope.templateData.oldDataExtractDataBundleName + ' Copy' : '';
        }
        $scope.getTemplateStatus();

        if (templateDetails[$scope.nameSpacePrefix + 'ApplicableTypes__c']) {
            applicableTypes = templateDetails[$scope.nameSpacePrefix + 'ApplicableTypes__c'].split(';');
            $scope.templateData.templateApplicableTypesObj = {};
            for (i = 0; i < applicableTypes.length; i++) {
                $scope.templateData.templateApplicableTypesObj[applicableTypes[i]] = true;
            }
        }

        if (templateDetails[$scope.nameSpacePrefix + 'ApplicableItemTypes__c']) {
            applicableItemTypes = templateDetails[$scope.nameSpacePrefix + 'ApplicableItemTypes__c'].split(';');
            $scope.templateData.templateApplicableItemTypesObj = {};
            for (j = 0; j < applicableItemTypes.length; j++) {
                $scope.templateData.templateApplicableItemTypesObj[applicableItemTypes[j]] = true;
            }
        }

        $scope.templateData.templateType = templateDetails[$scope.nameSpacePrefix + 'Type__c'];
        $scope.templateData.templateVersion = templateDetails[$scope.nameSpacePrefix + 'VersionNumber__c'];
        $scope.templateData.templateContractTypes = templateDetails[$scope.nameSpacePrefix + 'ContractTypes__c'];
        if ($scope.templateData.templateContractTypes  === $scope.defaultContractType || $scope.templateData.templateContractTypes === CONST.UNDEFINED) {
            $scope.templateData.isDefaultContractType = true;
        } else {
            $scope.templateData.isDefaultContractType = false;
            contractTypes = $scope.templateData.templateContractTypes.split(';');
            for (n = 0; n < $scope.contractList.length; n++) {
                if (contractTypes.indexOf($scope.contractList[n].text) > -1) {
                    $scope.addContractType($scope.contractList[n]);
                }
            }
        }

        $scope.templateData.templateSectionHeaderDisplayStyle = templateDetails[$scope.nameSpacePrefix + 'SectionHeadersDisplayStyle__c'];
        if ($scope.templateData.templateSectionHeaderDisplayStyle !== CONST.UNDEFINED) {
            // If custom section header styles are stored in the DB, load them:
            $scope.templateData.templateSectionHeaderDisplayStyleObj = JSON.parse($scope.templateData.templateSectionHeaderDisplayStyle);
        } else if (documentStylesLibrary.headingLevels !== CONST.UNDEFINED) {
            // If no custom styles are stored, load defaults:
            $scope.templateData.templateSectionHeaderDisplayStyleObj = {
                'headingLevels': documentStylesLibrary.headingLevels
            };
        }
        if (templateDetails[$scope.nameSpacePrefix + 'DocumentFontStyle__c'] !== CONST.UNDEFINED) {
            // If custom document font family are stored in the DB, load:
            $scope.templateData.templateDocumentFontStyle = templateDetails[$scope.nameSpacePrefix + 'DocumentFontStyle__c'];
        } else {
            // If no custom document font family, load default:
            $scope.templateData.templateDocumentFontStyle = '\'Times New Roman\', times, serif';
        }

        sectionIds = [];
        reorderSectionSequences = false;
        // Load in sections data:
        if (sections !== CONST.UNDEFINED) {
            // Need to getSectionTypes() before populated section data:
            $scope.getSectionTypes().then(function(result) {
                $scope.typesDict = result;
                for (k = 0; k < sections.length; k++) {
                    tinymceOptions = angular.copy($scope.tinymceOptions);
                    tempSectionObj = {};
                    tempSectionObj.sectionShown = false;
                    tempSectionObj.sectionName = sections[k].Name;
                    tempSectionObj.sectionContent = sections[k][$scope.nameSpacePrefix + 'SectionContent__c'];
                    tempSectionObj.sectionSequence = sections[k][$scope.nameSpacePrefix + 'Sequence__c'];
                    if (tempSectionObj.sectionSequence !== k) {
                        tempSectionObj.sectionSequence = k;
                        reorderSectionSequences = true;
                    }
                    tempSectionObj.sectionType = sections[k][$scope.nameSpacePrefix + 'Type__c'];
                    tempSectionObj.sectionTypeLabel = $scope.typesDict[tempSectionObj.sectionType];
                    tempSectionObj.sectionId = sections[k].Id;
                    sectionIds.push(tempSectionObj.sectionId);
                    tempSectionObj.templateId = $scope.templateData.templateId;
                    tempSectionObj.sectionIsRestricted = sections[k][$scope.nameSpacePrefix + 'IsRestricted__c'];
                    tempSectionObj.sectionIsNewPage = sections[k][$scope.nameSpacePrefix + 'IsInNewPage__c'];
                    tempSectionObj.sectionAutoNumber = sections[k][$scope.nameSpacePrefix + 'NeedAutoSectionNumber__c'];
                    tempSectionObj.sectionDisplayName = sections[k][$scope.nameSpacePrefix + 'DisplaySectionName__c'];
                    tempSectionObj.sectionDisplayHeaderInline = sections[k][$scope.nameSpacePrefix + 'DisplayHeaderInline__c'];
                    tempSectionObj.sectionResetAutoNumber = sections[k][$scope.nameSpacePrefix + 'ResetAutoNumber__c'];
                    tempSectionObj.sectionLevel = sections[k][$scope.nameSpacePrefix + 'Level__c'];
                    tempSectionObj.sectionTableHeaderRepeated = sections[k][$scope.nameSpacePrefix + 'IsWordTableHeaderRepeated__c'];
                    tempSectionObj.sectionIsBatchable = sections[k][$scope.nameSpacePrefix + 'IsBatchProcessed__c'];
                    tempSectionObj.autoAddSectionKey = sections[k][$scope.nameSpacePrefix + 'AutoAddSectionKey__c'];
                    tempSectionObj.sectionKey = sections[k][$scope.nameSpacePrefix + 'SectionKey__c'];
                    if (sections[k][$scope.nameSpacePrefix + 'Tokens__c']) {
                        tempSectionObj.sectionTokens = JSON.parse(sections[k][$scope.nameSpacePrefix + 'Tokens__c']);
                        $scope.templateTokens.sectionTokens[k] = tempSectionObj.sectionTokens;
                    } else {
                        tempSectionObj.sectionTokens = {};
                    }
                    if (templateTokens) {
                        tempSectionObj.templateTokens = templateTokens;
                        $scope.templateTokens.tokens = templateTokens;
                    }
                    tempSectionObj.sectionTokensFormatted = [];
                    for (key in tempSectionObj.sectionTokens) {
                        $scope.templateTokens.formatted.push({label: key});
                        tempSectionObj.sectionTokensFormatted.push({label: key});
                        if (!$scope.templateTokens.tokens[key]) {
                            $scope.templateTokens.tokens[key] = {};
                        }
                    }
                    tempSectionObj.customClass = sections[k][$scope.nameSpacePrefix + 'CustomClassName__c'];
                    tempSectionObj.sectionClauseId = sections[k][$scope.nameSpacePrefix + 'DocumentClauseId__c'];
                    tempSectionObj.sectionEmbeddedTemplateId = sections[k][$scope.nameSpacePrefix + 'EmbeddedTemplateId__c'];
                    // Products and Conditions
                    tempSectionObj.sectionJsonRepeatable = sections[k][$scope.nameSpacePrefix + 'ConditionalExpression__c'];
                    tempSectionObj.sectionProducts = [];
                    tempSectionObj.sectionJsonExpression = '';
                    if ($scope.templateData.tokenMappingType === CONST.JSON_BASED) {
                        if (conditions[sections[k].Id]) {
                            tempSectionObj.sectionJsonExpression = conditions[sections[k].Id];
                        }
                    } else {
                        if (Array.isArray(conditions[sections[k].Id])) {
                            productList = conditions[sections[k].Id];
                            if (productList !== CONST.UNDEFINED) {
                                for (m = 0; m < productList.length; m++) {
                                    tempSectionObj.sectionProducts.push({'text': productList[m].Name, 'id': productList[m].Id});
                                }
                            }
                        } else {
                            tempSectionObj.sectionEntityFilters = conditions[sections[k].Id];
                        }
                    }

                    if (tempSectionObj.sectionEntityFilters === undefined || tempSectionObj.sectionEntityFilters === null) {
                        tempSectionObj.sectionConditionType = 'Basic';
                    } else {
                        tempSectionObj.sectionConditionType = 'Advanced';
                    }
                    //For line item, parse the data
                    if (tempSectionObj.sectionType === 'Item' && tempSectionObj.sectionContent !== CONST.UNDEFINED) {
                        lineItemSectionData = JSON.parse(tempSectionObj.sectionContent);
                        //$scope.lineItemMap['display'] = section.sectionLineItems;
                        tempSectionObj.sectionLineItems = lineItemSectionData.display;
                        $scope.makeItemHeaderReadonly(tempSectionObj);
                        tempSectionObj.sectionItemDisplayStyle = sections[k][$scope.nameSpacePrefix + 'ItemSectionDisplayStyle__c'];
                        tempSectionObj.sectionItemFontStyle = sections[k][$scope.nameSpacePrefix + 'ItemSectionFontStyle__c'];
                        if (tempSectionObj.sectionItemDisplayStyle !== CONST.UNDEFINED) {
                            tempSectionObj.sectionItemDisplayStyle = JSON.parse(tempSectionObj.sectionItemDisplayStyle);
                        } else if (documentStylesLibrary.itemSectionStyles !== CONST.UNDEFINED) {
                            // If no custom styles are stored, load defaults:
                            tempSectionObj.sectionItemDisplayStyle  = documentStylesLibrary.itemSectionStyles;
                        }
                    }
                    //For Signature, add insertSignature to plugin and
                    //for Image, add insertImage to plugin
                    if (tempSectionObj.sectionType === 'Signature') {
                        tinymceOptions.toolbar2 = 'preview | forecolor backcolor | code | table | fontselect fontsizeselect | insertSignature';
                    } else if (tempSectionObj.sectionType === 'Image') {
                        tinymceOptions.toolbar2 = 'preview | forecolor backcolor | code | table | fontselect fontsizeselect | insertImage';
                    }
                    tempSectionObj.tinymceOptions = tinymceOptions;
                    $scope.templateData.sections.push(tempSectionObj);
                    if ($scope.templateData.sections[0]) {
                        $scope.currentSectionSequence = 0;
                        $scope.showSectionData($scope.templateData.sections[0].sectionType, 0);
                    }
                    // Remove the spans from each sectionContent:
                    $scope.removeWrappers(k);
                    if (reorderSectionSequences) {
                        // Save all sections to correct sequencing errors caused by not saving every section in last edit:
                        $scope.saveAllSections(false);
                    }
                    $scope.validationErrors.sections.push({
                        'sectionName': '',
                        'sectionContent': '',
                        'sectionSaved': true,
                        'sectionErrors': false,
                        'sectionType': ''
                    });
                }
                $scope.templateTokens.formatted = _.uniq($scope.templateTokens.formatted, 'label');
                if (!templateTokens) {
                    for (o = 0; o < $scope.templateData.sections.length; o++) {
                        $scope.templateData.sections[o].templateTokens = $scope.templateTokens.tokens;
                    }
                }
                $timeout(function() {
                    $scope.vlcLoading = false;
                }, 1000);
            }, function(error) {
                $scope.validationErrorHandler.throwError(error);
            });
        }
        $scope.checkUniqueName = true;
    };

    // Retrieve templates and cache immediately when page loads:
    $scope.getAllTemplates = function() {
        var inputData;
        if ($scope.templates.length === 0) {
            $scope.vlcLoading = true;
            inputData = {
                'mappingType': $scope.templateData.tokenMappingType,
                'templateType': ($scope.templateData.templateDocumentType || '')
            };

            remoteActions.getAllCloneableTemplates(inputData).then(function(result) {
                $scope.templates = result;
                if ($scope.subCenterType !== 'Embedded Template') {
                    $scope.templateProperties = true;
                }else {
                    $scope.templateFilterHelper();
                }
                $scope.vlcLoading = false;
            }, function(error) {
                $scope.validationErrorHandler.throwError(error);
            });
        }
    };

    $scope.autoAddsectionKeyWarning = function() {
        $sldsModal({
            title: $scope.modalLabels.CLMTemplateAutoAddSectionWarningTitle,
            templateUrl: 'change-autoAddSectionKey-section-modal.tpl.html',
            html: true,
            scope: $scope,
            container: 'div.vlocity',
            placement: 'center',
            backdrop: 'static'
        }); 
    }

    $scope.extractEmbeddedTemplateTokenWarning = function() {
        if (!$scope.templateData.templateId) {
            return;
        } else {
            $sldsModal({
                title: $scope.modalLabels.CLMTemplateExtractEmbeddedWarningTitle,
                templateUrl: 'change-extractEmbeddedTemplate-modal.tpl.html',
                html: true,
                scope: $scope,
                container: 'div.vlocity',
                placement: 'center',
                backdrop: 'static'
            });
        }
    }

    $scope.autoGenerateSectionKey = function(sequence) {
        var sectionKey = $scope.templateData.lastSectionKey;
        var num = sectionKey.slice(1);
        num++;
        num = ("000" + num).slice(-3);
        sectionKey = "E"+num;
        $scope.templateData.sections[sequence].sectionKey = sectionKey;
        $scope.templateData.lastSectionKey = sectionKey;
        return sectionKey;
    }

    $scope.autoAddSectionKeyChange = function(sequence) {
        $scope.templateData.sections[sequence].autoAddSectionKey = !$scope.templateData.sections[sequence].autoAddSectionKey;
    }

    $scope.setSectionKey = function(sequence) {
        if($scope.templateData.sections[sequence].autoAddSectionKey && 
            $scope.templateData.sections[sequence].sectionKey === CONST.UNDEFINED) {
            $scope.autoGenerateSectionKey(sequence)
        }
        return;
    }
    $scope.extactEmbeddedTokenChange = function() {
        $scope.templateData.extractEmbeddedTemplateTokens = !$scope.templateData.extractEmbeddedTemplateTokens;
        return;
    }

    $scope.setAutoNumber = function(sequence) {
        if ($scope.templateData.sections[sequence].sectionAutoNumber === false) {
            $scope.templateData.sections[sequence].sectionResetAutoNumber = false;
        }
    };

    $scope.getProducts = function() {
        var i;
        remoteActions.getProducts().then(function(result) {
            for (i = 0; i < result.length; i++) {
                $scope.productList[i] = {'text': result[i].Name, 'id': result[i].Id};
            }
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };
    $scope.getProducts();

    // From http://stackoverflow.com/a/16941754
    $scope.removeParam = function(key, sourceURL) {
        var rtn = sourceURL.split('?')[0];
        var param, i;
        var paramsArr = [];
        var queryString = (sourceURL.indexOf('?') !== -1) ? sourceURL.split('?')[1] : '';
        if (queryString !== '') {
            paramsArr = queryString.split('&');
            for (i = paramsArr.length - 1; i >= 0; i -= 1) {
                param = paramsArr[i].split('=')[0];
                if (param === key) {
                    paramsArr.splice(i, 1);
                }
            }
            rtn = rtn + '?' + paramsArr.join('&');
        }
        return rtn;
    };

    $scope.editTemplateProperties = function() {
        $scope.validationMessage = '';
        $scope.collapseCenter = true;
        $scope.collapseSubCenter = true;
        $scope.bodyHeader = '';
        $scope.subCenterType = '';
        $scope.settingsFilterOverlay.show = true;
        $timeout(function() {
            $scope.showClauses = false;
            if ($scope.saveTemplateBtnText !== 'Clone Template') {
                $scope.cloningTemplate = false;
            }
            $scope.templateProperties = true;
            $scope.newSection = false;
            $scope.bodyHeader = $scope.labels.CLMTemplateEditTemplateDetails;
        }, $scope.transitionDuration);
        $scope.templateFilterText.input = '';
    };

    var getTemplateFromUrl = function() {
        var templateId =  $scope.$ctrl.pageParams.templateId;
        if (templateId === CONST.UNDEFINED) {
            $scope.editTemplateProperties();
        }
        if (templateId !== CONST.UNDEFINED) {
            $scope.vlcLoading = true;
            remoteActions.getTemplateData(templateId).then(function(result) {
                console.log('INIT Data:', result);
                // Call Helper method to load in all the existing data:
                var tempData = result.templateData;
                tempData.orginalFileId = result.orginalFileId;
                var conditions = result.templateSectionConditions;
                var sectionData = result.templateSections;
                tempData.fileData = result.templateFile;


                $scope.loadExistingTemplateData(tempData, sectionData, true, conditions);
                // Reorganize applicable types into a semicolon separated string:
                $scope.reorganizeCheckboxData('templateApplicableTypes');
                // Reorganize applicable item types into a semicolon separated string:
                $scope.reorganizeCheckboxData('templateApplicableItemTypes');
                $scope.saveAllSectionsBtn.text = 'All Sections Saved';
                if ($scope.templateData.templateActive) {
                    $scope.leftColHeader = $scope.labels.CLMTemplateViewing + ' "' + $scope.templateData.templateName + '"';
                } else {
                    $scope.leftColHeader = $scope.labels.CLMTemplateEditing + ' "' + $scope.templateData.templateName + '"';
                }
                //$scope.templateProperties = true;
                if (location.search.split('&')[0].split('=')[0] === '?createNewVersion' && location.search.split('&')[0].split('=')[1] === 'true') {
                    $scope.validationMessage = $scope.modalLabels.CLMTemplateCreateNewVersion + ' ' +
                        $scope.templateData.templateVersion + ' ' +
                        $scope.labels.CLMTemplateOfTemplate + ' ' + $scope.templateData.templateName + ' ' +
                        $scope.labels.CLMTemplateNowEditingVersion +
                        ' ' + $scope.templateData.templateVersion + '.';
                    // Remove the "createNewVersion" parameter from the URL so the above validation message does not show on subsequent refreshes.
                    //history.pushState("", document.getElementsByTagName("title")[0].innerHTML, $scope.removeParam("createNewVersion", location.href));
                }
            }, function(error) {
                $scope.validationErrorHandler.throwError(error);
            });
        }
    };

    $scope.getTemplateStatus = function() {
        $scope.statusTooltip = $scope.labels.CLMTemplateTemplateIs + ' ' + $scope.labels.CLMTemplateInactive;
        $scope.statusClass = 'inactive';
        if ($scope.templateData.templateActive && $scope.templateData.templateId && $scope.templateData.templateActive === true) {
            $scope.statusTooltip = $scope.labels.CLMTemplateTemplateIs + ' ' + $scope.labels.CLMTemplateActive;
            $scope.statusClass = 'active';
        }else if ($scope.templateData.templateActive && $scope.templateData.templateActive === false) {
            $scope.statusTooltip =  $scope.labels.CLMTemplateTemplateIs +  ' ' +$scope.labels.CLMTemplateInactive;
            $scope.statusClass = 'inactive';
        }
    };

    $scope.copyTemplateTooltip = function(name) {
        return 'Clone Template "' + name + '"';
    };

    $scope.showSavedTemplates = function() {
        if (!$scope.templates.length) {
            $scope.getAllTemplates();
        }
        $scope.validationMessage = '';
        $scope.centerHeader = $scope.labels.CLMTemplateSelectExistingTempalte;
        $scope.bodyHeader = '';
        $scope.templateProperties = false;
        $scope.showTemplates = true;
        $scope.newSection = false;
        $scope.currentSectionSequence = null;
        $scope.showClauses = false;
        $scope.collapseCenter = false;
        $scope.collapseSubCenter = true;
        $scope.cloningTemplate = true;
    };

    // Get sections for template (also applying template details here) in order to clone:
    $scope.getSectionsForTemplate = function(template, sections) {
        // Check to make sure there are sections:
        if (sections === CONST.UNDEFINED) {
            sections = [];
        }
        // Reset template details errors:
        $scope.validationErrors.templateName = '';
        $scope.validationErrors.templateType = '';
        $scope.validationErrors.templateApplicableTypes = '';
        $scope.validationErrors.templateApplicableItemTypes = '';
        $scope.validationErrors.templateSignature = '';
        $scope.validationErrors.templateTrackRedlines = '';

        $scope.showTemplates = false;
        $scope.saveTemplateBtnText = 'Clone Template';
        $scope.bodyHeader = $scope.labels.CLMTemplateCloneTemplate + ' '+ template.Name + '"';
        $scope.vlcLoading = true;
        // Call Helper method to load in all the existing data:
        $scope.templateData = {
            'templateVersion': 1,
            'sections': []
        };
        $scope.getUsageValues();
        var sectionIds = [];
        for (var i = 0; i < sections.length; i++) {
            sectionIds.push(sections[i].Id);
        }
        remoteActions.getTemplateConditions(sectionIds).then(function(result) {
            $scope.loadExistingTemplateData(template, sections, false, result);
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
        $scope.collapseCenter = true;
        //$scope.templateProperties = true;
        $scope.saveAllSectionsBtn.text = '';
        $scope.leftColHeader = $scope.labels.CLMTemplateDataFrom + ' "'+ template.Name + '"';
        $scope.cloningTemplate = true;
        $scope.checkUniqueName = true;
        $scope.templateSaved.isSaved = true;
        $scope.vlcLoading = false;
        $scope.templateFilterText.input = '';
    };

    $scope.advanceSearch = function() {
        //$scope.templateProperties = false;
        $scope.search = true;
        $scope.validationMessage = '';
        //$scope.centerHeader = "";
        $scope.showTemplates = true;
        $scope.newSection = false;
        $scope.currentSectionSequence = null;
        $scope.showClauses = false;
        $scope.collapseCenter = false;
        $scope.collapseSubCenter = true;
        $scope.templateFilterText.input = '';
    };

    $scope.clearSearch = function() {
        $scope.query = {
            Type: 'Select Template Type'
        };
    };

    $scope.cancelSearch = function() {
        $scope.query = {
            Type: 'Select Template Type'
        };
        $scope.search = false;
    };
    $scope.advanceSearchFilter = function() {
        $scope.templateFilterText = '';
        $scope.templateFilter();
    };

    $scope.refresh = function() {
        $scope.saveTemplateBtnText = 'Save Template Details';
        $scope.bodyHeader = $scope.labels.CLMTemplateEditTemplateDetails;
        $scope.templateData = {
            'templateVersion': 1,
            'templateDocumentFontStyle': '\'Times New Roman\', times, serif',
            'sections': [],
            'templateTrackRedlines': $scope.trackRedlinesSetting,
            'templateSectionHeaderDisplayStyleObj': {}
        };
        $scope.validationErrors = {
            'sections': []
        };
        if (documentStylesLibrary.headingLevels !== CONST.UNDEFINED) {
            $scope.templateData.templateSectionHeaderDisplayStyleObj.headingLevels = documentStylesLibrary.headingLevels;
        }
        $scope.statusClass = 'inactive';
        $scope.templateActive = false;
        $scope.cloningTemplate = false;
        $scope.leftColHeader = $scope.labels.CLMTemplateStartNewTemplate;
        $scope.templateData.templateType = $scope.templateTypes[0];
    };

    $scope.compare = function(query, existing) {
        if (existing === CONST.UNDEFINED) {
            return;
        }
        if (query !== CONST.UNDEFINED) {
            query = angular.lowercase(query);
            existing = angular.lowercase(existing);
            return existing.includes(query);
        }
    };

    $scope.compareObjs = function(query, existing) {
        if (query !== CONST.UNDEFINED) {
            for (var obj in query) {
                if (query[obj]) {
                    if (!existing.includes(obj)) {
                        return false;
                    }
                }
            }
            return true;
        }
    };

    $scope.compareSections = function(query, sections, key) {
        if (sections === undefined && (query === '' || query === CONST.UNDEFINED)) {
            return true;
        }
        if (query !== CONST.UNDEFINED) {
            if (sections === CONST.UNDEFINED) {
                return false;
            }
            for (var i = 0; i < sections.length; i++) {
                var existing = sections[i][key];
                var match = $scope.compare(query, existing);
                if (match) {
                    return true;
                }
            }
            return false;
        }
    };

    $scope.compareBools = function(query, existing) {
        if (query !== undefined && query) {
            return existing;
        }
    };
    //Conduct an advanced search or simple search on templates
    $scope.templateFilter = function(row) {
        //Advanced Search:
        if ($scope.search) {
            var matches = {};
            matches.Name = $scope.compare($scope.query.Name, row.template.Name);
            matches.Type = $scope.compare($scope.query.Type, row.template[$scope.nameSpacePrefix + 'Type__c']);
            if ($scope.query.Type === 'Select Template Type') {
                matches.Type = true;
            }
            matches.ApplicableTypes = $scope.compareObjs($scope.query.ApplicableTypes, row.template[$scope.nameSpacePrefix + 'ApplicableTypes__c']);
            matches.ApplicableItemTypes = $scope.compareObjs($scope.query.ApplicableItemTypes, row.template[$scope.nameSpacePrefix + 'ApplicableItemTypes__c']);
            matches.IsActive = $scope.compareBools($scope.query.IsActive, row.template[$scope.nameSpacePrefix + 'IsActive__c']);
            matches.IsSignature = $scope.compareBools($scope.query.IsSignature, row.template[$scope.nameSpacePrefix + 'IsSignatureRequired__c']);
            matches.SectionName = $scope.compareSections($scope.query.SectionName, row.sections,'Name');
            matches.SectionContent = $scope.compareSections($scope.query.SectionContent, row.sections, ($scope.nameSpacePrefix + 'SectionContent__c'));
            //if matches[key] is false, no match
            for (var key in matches) {
                if (matches[key] === false) {
                    $scope.templateCount.count = 0;
                    return matches[key];
                }
            }
            return true;
        }

        //Simple Search:
        if ($scope.templateFilterText.input !== CONST.UNDEFINED) {
            var simpleQuery = $scope.templateFilterText.input;
            var keyList = ['Name', $scope.nameSpacePrefix + 'Type__c', $scope.nameSpacePrefix + 'ApplicableTypes__c', $scope.nameSpacePrefix + 'ApplicableItemTypes__c'];
            var filter;
            var match;
            //loop through template fields
            for (var i = 0; i < keyList.length; i++) {
                match = $scope.compare(simpleQuery, row.template[keyList[i]]);
                filter = match || filter;
            }
            //loop through section fields
            if (row.sections !== CONST.UNDEFINED) {
                for (var j = 0; j < row.sections.length; j++) {
                    var section = row.sections[j];
                    match = ($scope.compare(simpleQuery, section.Name) || $scope.compare(simpleQuery, section[$scope.nameSpacePrefix + 'SectionContent__c']));
                    filter = match || filter;
                }
            }
            if (!filter) {
                $scope.templateCount.count = 0;
            }
            return filter;
        }
        //No Search:
        return true;
    };

    $scope.downloadFile = function(downloadOrginal) {
        var fileId = downloadOrginal ? $scope.templateData.orginalFileData.Id : $scope.templateData.fileData.Id;
        location.href = '/sfc/servlet.shepherd/version/download/' + fileId + '?asPdf=false';
    };

    $scope.replaceFile = function() {
        $scope.templateMetadata.showFileDetails = false;
        $scope.templateMetadata.showFileReplaceCancel = true;
        $scope.templateData.existingFileName = angular.copy($scope.templateData.fileName);
        $scope.templateData.existingFileData = $scope.templateData.fileData;
        $scope.templateData.existingOrginalFileData = $scope.templateData.orginalFileData;
        delete $scope.templateData.fileName;
        delete $scope.templateData.fileData;
        delete $scope.templateData.orginalFileData;
    };

    $scope.cancelFileReplace = function() {
        delete $scope.templateData.docxTokens;
        delete $scope.templateData.hasFileUpload;
        $scope.templateData.fileName = $scope.templateData.existingFileName;
        $scope.templateData.fileData = $scope.templateData.existingFileData;
        $scope.templateData.orginalFileData = $scope.templateData.existingOrginalFileData;
        $scope.templateMetadata.showFileDetails = true;
        $scope.templateMetadata.showFileReplaceCancel = false;
    };

    /*** Start Template Details Methods ***/
    $scope.initialTypeOption = 'Select Template Type';
    $scope.templateTypes = [$scope.initialTypeOption];
    $scope.templateData.templateType = $scope.templateTypes[0];
    $scope.applicableTypes = [];
    $scope.applicableItemTypes = [];

    $scope.getTypeValues = function() {
        var i;
        $scope.vlcLoading = true;
        remoteActions.getTypeValues().then(function(result) {
            for (i = 0; i < result.length; i++) {
                $scope.templateTypes.push(result[i].Label);
            }
            $scope.getApplicableTypeValues();
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };
    $scope.getTypeValues();

    $scope.getApplicableTypeValues = function() {
        remoteActions.getApplicableTypeValues().then(function(result) {
            $scope.applicableTypes = result;
            $scope.getApplicableItemTypeValues();
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.getApplicableItemTypeValues = function() {
        remoteActions.getApplicableItemTypeValues().then(function(result) {
            $scope.applicableItemTypes = result;
            // Instantiating EntityFilter Factory (need $scope.applicableItemTypes):
            $scope.entityFilter = new EntityFilter($scope);
            $scope.getUsageValues();
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.getUsageValues = function() {
        remoteActions.getUsageValues().then(function(result) {
            $scope.templateMetadata.usageValues = result;
            $scope.vlcLoading = false;
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };
    /*** End Template Details Methods ***/

    $scope.addNewSection = function() {
        $scope.validationMessage = '';
        $scope.centerHeader = $scope.labels.CLMTemplateChooseSectionType;
        $scope.bodyHeader = '';
        //$scope.templateProperties = false;
        $scope.showTemplates = false;
        $scope.newSection = true;
        $scope.currentSectionSequence = null;
        $scope.showClauses = false;
        $scope.collapseCenter = false;
        $scope.collapseSubCenter = true;
        $scope.cloningTemplate = false;
        $scope.search = false;
    };

    /**
     * on add new Section, push the sectionType object to validationErrors.
     * @param {type}  -- section type, ex: Clause, Signature, Image etc
     */
    $scope.addValidationErrorSection = function(type) {
        $scope.validationErrors.sections.push({
            'sectionName': '',
            'sectionContent': '',
            'sectionType': type,
            'sectionSaved': false,
            'sectionErrors': false,
            'sectionTokens': '',
            'sectionTypeLabel': $scope.typesDict[type]
        });
    };

    $scope.addSectionType = function(type, sequence, templateId) {
        var tinymceOptions, tinymceBody;
        if (type === 'Clause' || type === 'Embedded Template') {
            $scope.collapseSubCenter = false;
            $scope.subCenterType = type;

            if (type === 'Clause') {
                $scope.clauseFilterHelper();
            }

            if (type === 'Embedded Template') {
                $scope.initDocumentTemplateSearch();
            }
        } else {
            $scope.addValidationErrorSection(type);
            tinymceOptions = angular.copy($scope.tinymceOptions);
            tinymceOptions.table_default_styles = {
                fontSize: '10pt',
                fontFamily: $scope.templateData.templateDocumentFontStyle,
                width: '100%'
            };
            tinymceOptions.setup = function(editor) {
                editor.on('init', function() {
                    this.execCommand('fontName', true, $scope.templateData.templateDocumentFontStyle);
                    this.execCommand('fontSize', true, '10pt');
                    tinymceBody = this.getBody();
                    $(tinymceBody).find('span.tinymce-default-style').css({
                        'font-size': '10pt',
                        'font-family': $scope.templateData.templateDocumentFontStyle
                    });
                });
                // Need to re-setup signature and image buttons so they can be added in below:
                $scope.tinymceSetup(editor);
            };
            if (type === 'Signature') {
                tinymceOptions.toolbar2 = 'preview | forecolor backcolor | code | table | fontselect fontsizeselect | insertSignature';
            } else if (type === 'Image') {
                tinymceOptions.toolbar2 = 'preview | forecolor backcolor | code | table | fontselect fontsizeselect | insertImage';
            }
            // Wait to do this until after the column transitions back or browser will freeze animation:
            $timeout(function() {
                $scope.templateData.sections.push({
                    'templateId': templateId,
                    'sectionType': type,
                    'sectionSequence': sequence,
                    'sectionName': '',
                    // &#8203; is a zero width space and will not render anything, but tinymce requires 'content' to exist in order to wrap with HTML (yes, this is a hack):
                    'sectionContent': '<p><span class="tinymce-default-style">&#8203;</span></p>',
                    'sectionLevel': 0,
                    'sectionIsRestricted': false,
                    'sectionTokens': {},
                    'sectionTokensFormatted': [],
                    'templateTokens': {},
                    'sectionLineItems': [],
                    'sectionIsNewPage': false,
                    'sectionDisplayName': false,
                    'sectionDisplayHeaderInline': false,
                    'sectionAutoNumber': false,
                    'sectionResetAutoNumber': false,
                    'autoAddSectionKey': true,
                    'sectionConditionType': 'Basic',
                    'sectionShown': true,
                    'sectionKey':$scope.templateData.lastSectionKey,
                    'tinymceOptions': tinymceOptions,
                    'sectionTableHeaderRepeated': false,
                    'sectionTypeLabel': $scope.typesDict[type]
                });
                $scope.templateTokens.sectionTokens.push({});
                if ($scope.templateData.sections.length === 1 && !$scope.templateData.sections[0].templateTokensFormatted) {
                    $scope.templateData.sections[0].templateTokensFormatted = [];
                }
                if (type === 'Item' && $scope.templateData.sections[sequence].sectionItemDisplayStyle === CONST.UNDEFINED) {
                    $scope.templateData.sections[sequence].sectionItemDisplayStyle = angular.copy(documentStylesLibrary.itemSectionStyles);
                }
            }, $scope.transitionDuration);
            $scope.saveAllSectionsBtn.text = 'Save All Sections';
            $scope.collapseCenter = true;
            $scope.collapseSubCenter = true;
            $scope.subCenterType = '';
            $scope.showSectionData(type, sequence);
        }
    };

    $scope.addClauseSection = function(clause, sequence, templateId) {
        $scope.addValidationErrorSection('Clause');
        var tinymceOptions, templateDocumentFontStyle, tinymceBody, tokenArray, clauseData, i;
        tinymceOptions = angular.copy($scope.tinymceOptions);
        templateDocumentFontStyle = $scope.templateData.templateDocumentFontStyle;
        tinymceOptions.table_default_styles = {
            fontSize: '10pt',
            fontFamily: $scope.templateData.templateDocumentFontStyle,
            width: '100%'
        };
        var clauseContent = clause[$scope.nameSpacePrefix + 'ClauseContent__c'];
        //If clauseContent contains "{{}}" tokens, replace with "%%".
        if(clauseContent.match(/{{(.*?)}}/g)) {
            var tokens = clauseContent.split(/{{(.*?)}}/g);
            if (tokens !== null) {
                for (i = 0; i < tokens.length; i++) {
                    tokens[i] = tokens[i].replace(/(^{{)|(}}$)/g,'%%');             
                }
                clauseContent = tokens.join("%%");
            }
        }
        tinymceOptions.setup = function(editor) {
            editor.on('init', function() {
                this.execCommand('fontName', true, templateDocumentFontStyle);
                this.execCommand('fontSize', true, '10pt');
                tinymceBody = this.getBody();
                $(tinymceBody).find('span.tinymce-default-style').css({
                    'font-size': '10pt',
                    'font-family': templateDocumentFontStyle
                });
            });
        };
        tokenArray = [];
        clauseData = {
            'templateId': templateId,
            'sectionType': 'Clause',
            'sectionSequence': sequence,
            'sectionName': clause.Name,
            'sectionContent': '<p><span class="tinymce-default-style">' + clauseContent + '</span></p>',
            'sectionIsRestricted': clause[$scope.nameSpacePrefix + 'IsRestricted__c'],
            'sectionClauseId': clause.Id,
            'sectionClauseType': clause[$scope.nameSpacePrefix + 'Type__c'],
            'sectionClauseCategory': clause[$scope.nameSpacePrefix + 'Category__c'],
            'sectionLevel': 0,
            'subSections': [],
            'sectionSaved': false,
            'sectionTokens': {},
            'sectionTokensFormatted': [],
            'templateTokens': {},
            'sectionIsNewPage': false,
            'sectionDisplayName': false,
            'sectionDisplayHeaderInline': false,
            'sectionAutoNumber': false,
            'sectionResetAutoNumber': false,
            'sectionConditionType': 'Basic',
            'sectionShown': true,
            'tinymceOptions': tinymceOptions,
            'sectionTableHeaderRepeated': false, 
            'sectionTypeLabel': $scope.typesDict.Clause
        };
        if (clause[$scope.nameSpacePrefix + 'Tokens__c']) {
            tokenArray = clause[$scope.nameSpacePrefix + 'Tokens__c'].split(', ');
        }
        if (tokenArray.length) {
            for (i = 0; i < tokenArray.length; i++) {
                if(tokenArray[i].match(/{{(.*?)}}/g)) {
                    tokenArray[i].replace(/(^{{)|(}}$)/g,'%%');
                }
                clauseData.sectionTokens[tokenArray[i]] = {};
                $scope.templateTokens.formatted.push({label: tokenArray[i]});
            }
        }
        $timeout(function() {
            $scope.templateData.sections.push(clauseData);
            if ($scope.templateData.sections.length === 1 && !$scope.templateData.sections[0].templateTokensFormatted) {
                $scope.templateData.sections[0].templateTokensFormatted = [];
            }
            $scope.templateTokens.sectionTokens.push({});
        }, $scope.transitionDuration);
        $scope.showSectionData('Clause', sequence);
        $scope.saveAllSectionsBtn.text = 'Save All Sections';
        $scope.subCenterType = '';
    };

    $scope.validateEmbeddedTemplate = function(template) {
        var isValid = true;
        //Check if active
        if (!template[$scope.nameSpacePrefix + 'IsActive__c']) {
            isValid = false;
        }
        if ($scope.templateData.tokenMappingType === CONST.OBJECT_BASED) {
            //Check if embedded template applies to all template applicable item types
            if (isValid) {
                var applicableTypes = template[$scope.nameSpacePrefix + 'ApplicableTypes__c'].split(';');
                isValid = $scope.validateEmbeddedTemplateHelper(applicableTypes, $scope.templateData.templateApplicableTypesObj);
            }
            //Check if embedded template applies to all template applicable item line types
            if (isValid) {
                var applicableItemTypes = template[$scope.nameSpacePrefix + 'ApplicableItemTypes__c'].split(';');
                isValid = $scope.validateEmbeddedTemplateHelper(applicableItemTypes, $scope.templateData.templateApplicableItemTypesObj);
            }
        }
        return isValid;
    };

    $scope.validateEmbeddedTemplateHelper = function(applicableTypes, templateApplicableTypesObj) {
        var isValid = true;
        for (var i = 0; i < applicableTypes.length; i++) {
            applicableTypes[applicableTypes[i]] = true;
        }
        for (var key in templateApplicableTypesObj) {
            if (templateApplicableTypesObj[key]) {
                if (!applicableTypes[key]) {
                    isValid = false;
                }
            }
        }
        return isValid;
    };
    $scope.embedTemplateSection = function(template, sections, templateId, sequence) {
        $scope.addValidationErrorSection('Embedded Template')
        var applicableItemTypes = [];
        var applicableLineItemTypes = [];
        if (template[$scope.nameSpacePrefix + 'MappingType__c'] === CONST.OBJECT_BASED) {
            applicableItemTypes = template[$scope.nameSpacePrefix + 'ApplicableTypes__c'].split(';').join(' | ');
            applicableLineItemTypes = template[$scope.nameSpacePrefix + 'ApplicableItemTypes__c'].split(';').join(' | ');
        }

        var embeddedTemplateData = {
            'templateId': templateId,
            'sectionType': 'Embedded Template',
            'sectionIsRestricted': false,
            'sectionIsNewPage': false,
            'sectionDisplayName': false,
            'sectionDisplayHeaderInline': false,
            'sectionAutoName': false,
            'sectionResetAutoName': false,
            'autoAddSectionKey':true,
            'sectionId': null,
            'sectionClauseId': undefined,
            'sectionSequence': sequence,
            'sectionName': template.Name,
            'sectionContent': ' ',
            'sectionLevel': 0,
            'subSections': [],
            'sectionSaved': false,
            'sectionTokens': {},
            'sectionTokensFormatted': [],
            'templateTokens': {},
            'sectionEmbeddedTemplateId': template.Id,
            'sectionConditionType': 'Basic',
            'sectionShown': true,
            'applicableItemTypes': applicableItemTypes,
            'applicableLineItemTypes': applicableLineItemTypes,
            'embeddedSections': sections.length === 0 ? undefined : sections,
            'sectionTypeLabel': $scope.typesDict['Embedded Template']
        };
        $scope.templateData.sections.push(embeddedTemplateData);
        $scope.templateTokens.sectionTokens.push({});
        if ($scope.templateData.sections.length === 1 && !$scope.templateData.sections[0].templateTokensFormatted) {
            $scope.templateData.sections[0].templateTokensFormatted = [];
        }
        $scope.showSectionData('Embedded Template', sequence);
        $scope.saveAllSectionsBtn.text = 'Save All Sections';
        $scope.subCenterType = '';
    };

    // Get all clauses and check to see if any conditionals exist:
    $scope.getClauses = function() {
        remoteActions.getClauses().then(function(result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i][$scope.nameSpacePrefix + 'Type__c'] === 'Conditional') {
                    $scope.conditionalClauses = true;
                }
            }
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };
    $scope.getClauses();

    // Get generic clauses and cache immediately on page load:
    $scope.getGenericClauses = function() {
        remoteActions.getGenericClauses().then(function(result) {
            $scope.genericClauses = result;
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.clauseFilterHelper = function() {
        $scope.filteredClauses = $scope.genericClauses.slice();
        
        $scope.filteredClauses = $scope.clauseLanguageFilterSearch($scope.filteredClauses, $scope.genericClauses)

        if ($scope.templateData.templateContractTypes && $scope.templateData.templateContractTypes !== $scope.defaultContractType) {
            var templateContractTypes = $scope.templateData.templateContractTypes.split(';');
            for (var i = 0; i < $scope.genericClauses.length; i++) {
                var clauseContractTypes = $scope.genericClauses[i][$scope.nameSpacePrefix + 'ContractTypes__c'];
                if (clauseContractTypes !== undefined && clauseContractTypes !== $scope.defaultContractType) {
                    var intersect = _.intersection(templateContractTypes, clauseContractTypes.split(';'));
                    if (intersect.length < 1) {
                        $scope.filteredClauses.remove($scope.genericClauses[i]);
                    }
                }
            }
        }
    };

    /*
    * Filter the  document clause list based on the language field.
    */

    $scope.clauseLanguageFilterSearch = function(filteredList, orginalList ) {
        var templateDocumentLanguage = $scope.templateData.templateDocumentLanguage;
        for (var i = 0; i < orginalList.length; i++) {
            var clauseLanguage = orginalList[i][$scope.nameSpacePrefix + 'LocaleCode__c']
             if (clauseLanguage !== templateDocumentLanguage && clauseLanguage !== undefined) {
                filteredList.remove(orginalList[i]);
             }  
        }
        return filteredList;
    };

    $scope.templateFilterHelper = function(templateList) {
        var templateContractTypes, embeddedTypes, intersect, i;
        $scope.documentTemplates = templateList.slice();
        if ($scope.templateData.templateContractTypes && $scope.templateData.templateContractTypes !== $scope.defaultContractType) {
            templateContractTypes = $scope.templateData.templateContractTypes.split(';');
            for (i = 0; i < templateList.length; i++) {
                if (!templateList[i].template[$scope.nameSpacePrefix + 'IsActive__c']) {
                    $scope.documentTemplates.remove(templateList[i]);
                } else {
                    embeddedTypes = templateList[i].template[$scope.nameSpacePrefix + 'ContractTypes__c'];
                    if (embeddedTypes !== undefined && embeddedTypes !== $scope.defaultContractType) {
                        intersect = _.intersection(templateContractTypes, embeddedTypes.split(';'));
                        if (intersect.length < 1) {
                            $scope.documentTemplates.remove(templateList[i]);
                        }
                    }
                }
            }
        }
    };

    $scope.showSectionData = function(type, sequence) {
        $scope.validationMessage = '';
        $scope.templateDeactivateErrorMsg = '';
        $scope.subCenterType = '';
        var sectionNo = sequence + 1;
        if (type === 'Embedded Template') {
            if ($scope.templateData.sections[sequence].sectionEmbeddedTemplateId !== undefined && $scope.templateData.sections[sequence].embeddedSections === CONST.UNDEFINED) {
                $scope.vlcLoading = true;
                remoteActions.getSectionsForTemplate(angular.toJson($scope.templateData.sections[sequence].sectionEmbeddedTemplateId)).then(function(result) {
                    $scope.templateData.sections[sequence].embeddedSections = result;
                    $scope.vlcLoading = false;
                    for (var i = 0; i < $scope.templateData.sections[sequence].embeddedSections.length; i++) {
                        if ($scope.templateData.sections[sequence].embeddedSections[i][$scope.nameSpacePrefix + 'Type__c'] === 'Item' &&
                            $scope.templateData.sections[sequence].embeddedSections[i].sectionLineItems === CONST.UNDEFINED) {
                            var section = $scope.templateData.sections[sequence].embeddedSections[i];
                            var lineItemSectionData = JSON.parse(section[$scope.nameSpacePrefix + 'SectionContent__c']);
                            $scope.templateData.sections[sequence].embeddedSections[i].sectionLineItems = lineItemSectionData.display;
                        }
                    }
                }, function(error) {
                    $scope.validationErrorHandler.throwError(error);
                });
            }
            if ($scope.templateData.sections[sequence].sectionIsNewPage === CONST.UNDEFINED) {
                $scope.templateData.sections[sequence].sectionIsNewPage = false;
            }
            if ($scope.templateData.sections[sequence].sectionDisplayName === CONST.UNDEFINED) {
                $scope.templateData.sections[sequence].sectionDisplayName = false;
            }
            if ($scope.templateData.sections[sequence].sectionAutoNumber === CONST.UNDEFINED) {
                $scope.templateData.sections[sequence].sectionAutoNumber = false;
            }
            if ($scope.templateData.sections[sequence].sectionResetAutoNumber === CONST.UNDEFINED) {
                $scope.templateData.sections[sequence].sectionResetAutoNumber = false;
            }
            if ($scope.templateData.sections[sequence].sectionDisplayHeaderInline === CONST.UNDEFINED) {
                $scope.templateData.sections[sequence].sectionDisplayHeaderInline = false;
            }
            if ($scope.templateData.sections[sequence].autoAddSectionKey === CONST.UNDEFINED) {
                $scope.templateData.sections[sequence].autoAddSectionKey = true;
            }
            $scope.setSectionKey(sequence);
            if ($scope.templateData.sections[sequence].embeddedSections !== CONST.UNDEFINED) {
                for (var i = 0; i < $scope.templateData.sections[sequence].embeddedSections.length; i++) {
                    if ($scope.templateData.sections[sequence].embeddedSections[i][$scope.nameSpacePrefix + 'Type__c'] === 'Item' &&
                        $scope.templateData.sections[sequence].embeddedSections[i].sectionLineItems === CONST.UNDEFINED) {
                        var section = $scope.templateData.sections[sequence].embeddedSections[i];
                        var lineItemSectionData = JSON.parse(section[$scope.nameSpacePrefix + 'SectionContent__c']);
                        $scope.templateData.sections[sequence].embeddedSections[i].sectionLineItems = lineItemSectionData.display;
                    }
                }
            }
        }
        $scope.saveSectionBtn = $scope.labels.CLMTemplateSaveSection;
        $scope.deleteSectionBtn = $scope.labels.CLMTemplateDeleteSection;
        $scope.bodyHeader = $scope.labels.CLMTemplateEditingSection + ' ' + sectionNo;
        //$scope.templateProperties = false;
        $scope.showTemplates = false;
        if ($scope.newSection) {
            $timeout(function() {
                $scope.newSection = false;
            }, $scope.transitionDuration);
        }
        $scope.currentSectionSequence = sequence;
        $scope.showClauses = false;
        $scope.collapseCenter = true;
        $scope.collapseSubCenter = true;
        if ($scope.saveTemplateBtnText !== 'Clone Template') {
            $scope.cloningTemplate = false;
        }
        if ($scope.templateData.sections[sequence]) {
            $scope.templateData.sections[sequence].sectionShown = true;
        }
        $scope.search = false;
    };

    $scope.searchProductListCallback = function(query, callback) {
        query = query.trim();
        var filter = {};
        var productList = $scope.productList;
        if (query !== '') {
            filter.text = query;
            var data = $filter('filter')(productList, filter);
            callback(data);
        }else {
            callback(productList);
        }
    };
    $scope.productListWrapper = function(query) {
        var deferred = $q.defer();
        var callbackfunction = function(result) {
            $scope.$apply(function() {
                var sresult = [];
                if (result) {
                    sresult = angular.fromJson(result);
                }
                deferred.resolve(sresult);
            });
        };
        $scope.searchProductListCallback(query,callbackfunction);
        return deferred.promise;
    };

    $scope.searchProductList = function(query) {
        var productList = $scope.productListWrapper(query);
        return productList;
    };

    $scope.addProduct = function($tag, selectedProducts) {
        var inArray = false;
        for (var i = 0; i < selectedProducts.length; i++) {
            if (selectedProducts[i].id === $tag.id) {
                inArray = true;
            }
        }
        if (!inArray) {
            selectedProducts.push($tag);
        }
    };

    $scope.removeProduct = function($tag, selectedProducts) {
        for (var i = 0; i < selectedProducts.length; i++) {
            if (selectedProducts[i].id === $tag.id) {
                selectedProducts.splice(i,1);
            }
        }
    };
    /*** End New Section Methods ***/

    $scope.saveTemplate = function(update) {
        $scope.validationWarningMessage = '';
        $scope.validateTemplate(update);
        if ($scope.validationErrors.templateValid) {
            if ($scope.cloningTemplate) {
                // Reorganize applicable types into a semicolon separated string:
                $scope.reorganizeCheckboxData('templateApplicableTypes');
                // Reorganize applicable item types into a semicolon separated string:
                $scope.reorganizeCheckboxData('templateApplicableItemTypes');
                // Stringify templateSectionHeaderDisplayStyleObj to save:
                $scope.templateData.templateSectionHeaderDisplayStyle = angular.toJson($scope.templateData.templateSectionHeaderDisplayStyleObj);
                // Convert Header Display Style into CSS for PDF and docx:
                $scope.templateData.templateSectionHeaderFontStyle = $scope.convertHeaderStylesToCss();
                $scope.templateData.isCloning = true;
                // Save and Check if Active:
                $scope.saveTemplateCheckStatus();
                //$scope.templateProperties = true;
                $scope.templateSaved.isSaved = true;
                //$scope.currentSectionSequence = null;
                $scope.settingsFilterOverlay.show = false;

            } else {
                if ($scope.templateData.tokenMappingType === CONST.OBJECT_BASED) {
                    // Reorganize applicable types into a semicolon separated string:
                    $scope.reorganizeCheckboxData('templateApplicableTypes');
                    // Reorganize applicable item types into a semicolon separated string:
                    $scope.reorganizeCheckboxData('templateApplicableItemTypes');
                    $scope.templateData.dataRaptorBundleName = '';
                    $scope.templateData.wordDocumentTemplateName = '';
                }
                // Stringify templateSectionHeaderDisplayStyleObj to save:
                $scope.templateData.templateSectionHeaderDisplayStyle = angular.toJson($scope.templateData.templateSectionHeaderDisplayStyleObj);
                // Convert Header Display Style into CSS for PDF and docx:
                $scope.templateData.templateSectionHeaderFontStyle = $scope.convertHeaderStylesToCss();
                // Save templateSignature even if false:
                if (!('templateSignature' in $scope.templateData)) {
                    $scope.templateData.templateSignature = false;
                }
                // Save templateTrackRedLines even if false:
                if (!('templateTrackRedlines' in $scope.templateData)) {
                    $scope.templateData.templateTrackRedlines = $scope.trackRedlinesSetting;
                }
                // Save templateActive even if false:
                if (!('templateActive' in $scope.templateData)) {
                    $scope.templateData.templateActive = false;
                }
                // Save displayUnmappedTokens even if false:
                if (!('displayUnmappedTokens' in $scope.templateData)) {
                    $scope.templateData.displayUnmappedTokens = false;
                }
                // Save extractEmbeddedTemplateTokens even if false:
                if (!('extractEmbeddedTemplateTokens' in $scope.templateData)) {
                    $scope.templateData.extractEmbeddedTemplateTokens = false;
                }
                // Save version number as 1:
                if (!('templateVersion' in $scope.templateData)) {
                    $scope.templateData.templateVersion = 1;
                }
                if ($scope.selectedContractTypes.length > 0) {
                    $scope.getSelectedContractTypes();
                }

                $scope.checkUniqueName = true;
                $scope.currentlyEditingName = $scope.templateData.templateName; // Need to store this for validation purposes
                // Check if Active:
                $scope.saveTemplateCheckStatus();
            }
        }
    };

    $scope.saveTemplateCheckStatus = function() {
        var i, sectionErrorsExist, unsavedSections, templateUrl;
        if ($scope.templateData.templateActive === true) {
            sectionErrorsExist = false;
            unsavedSections = false;
            for (i = 0; i < $scope.validationErrors.sections.lvalidationMessageength; i++) {
                if ($scope.validationErrors.sections[i].sectionErrors) {
                    sectionErrorsExist = true;
                    templateUrl = 'check-status-modal-section-errors.tpl.html';
                }
                if ($scope.validationErrors.sections[i].sectionSaved === false) {
                    unsavedSections = true;
                    templateUrl = 'check-status-modal-section-unsaved.tpl.html';
                }
            }

            if (sectionErrorsExist && unsavedSections) {
                templateUrl = 'check-status-modal-section-errors.tpl.html';
            }
            if (sectionErrorsExist || unsavedSections) {
                $sldsModal({
                    title: $scope.labels.CLMTemplateSaveTemplateDetails,
                    templateUrl: templateUrl,
                    html: true,
                    scope: $scope,
                    container: 'div.vlocity',
                    placement: 'center',
                    prefixEvent: 'checkStatusModal',
                    backdrop: false
                });
                $scope.templateData.templateActive = false;
            } else {
                $sldsModal({
                    title: $scope.labels.CLMTemplateSaveTemplateDetails,
                    templateUrl: 'check-status-modal.tpl.html',
                    html: true,
                    scope: $scope,
                    container: 'div.vlocity',
                    placement: 'center',
                    prefixEvent: 'checkStatusModal',
                    backdrop: false
                });
            }
        } else {
            $scope.saveTemplateRemoteAction();
        }
    };

    $scope.saveTemplateRemoteAction = function() {
        var inputData;
        var templateNew = true;

        if ($scope.templateData.hasOwnProperty('templateId')) {
            templateNew = false;
        }

        $scope.vlcLoading = true;
        if($scope.templateData.selectedLanguageObject) {
            $scope.templateData.templateDocumentLanguage = $scope.templateData.selectedLanguageObject.Value;
        }

        if($scope.templateData.mappingMethodType === 'DataRaptor') {
            delete $scope.templateData.customClassName;
        }
        inputData = angular.copy($scope.templateData);
        delete inputData.selectedLanguageObject;

        // remoteAction for templateData save:
        remoteActions.saveTemplate(angular.toJson(inputData)).then(function(result) {
            var activatedMessage, i;
            activatedMessage = '';
            if ($scope.templateData.templateActive) {
                activatedMessage = $scope.labels.CLMTemplateActiveReadOnly;
                $scope.leftColHeader = $scope.labels.CLMTemplateViewing + ' "' + $scope.templateData.templateName + '"';
            }
            if ($scope.cloningTemplate === false) {
                $scope.validationMessage = $scope.modalLabels.CLMTemplateSaveTemplateDetails + ' "' + $scope.templateData.templateName + '" ' + $scope.labels.CLMTemplateSuccessfully + ' ' + activatedMessage;
            }
            $scope.leftColHeader = $scope.labels.CLMTemplateEditing + ' "' + $scope.templateData.templateName + '"';

            // $scope.templateData.templateId = result;
            $scope.templateData.templateId = result.templateId;
            $scope.templateData.drbundleId = result.drbundleId;
            $scope.templateData.dedrbundleId = result.dedrbundleId;
            $scope.templateData.hasBatchableSections = result.hasBatchableSections;

            if (result.templateFile) {
                $scope.templateData.fileData = result.templateFile;
                $scope.templateData.fileName = result.templateFile.Title;
                $scope.templateMetadata.showFileDetails = true;
            }

            var docxTemplateName = result.docxTemplateName;
            var docxStaticResource = result.docxStaticResource;
            var zip = $scope.getTemplateZip(docxStaticResource);
            var headerString = $scope.getRelsFile(zip);
            var docxStaticResourceMap = {};
            docxStaticResourceMap[docxTemplateName] = headerString;

            if($scope.$ctrl.pageParams.templateType === CONST.DOCX){
                if($scope.templateData.orginalFileData) {
                    $scope.linkContentVersionToTemplateElement($scope.templateData.orginalFileData.Id, 'Original');
                }
                var templateType = $scope.templateData.orginalFileData ? 'Formatted' : 'Original';
                $scope.linkContentVersionToTemplateElement($scope.templateData.fileData.Id,templateType);
            }
            remoteActions.saveDocxRelMetadata(docxStaticResourceMap, result.templateId).then(function(result){
                console.log('Save Relationship Metadata successful');
            });
            $scope.getTemplateStatus();
            $scope.templateActive = $scope.templateData.templateActive;
            $scope.templateSaved.isSaved = true;
            if ($scope.cloningTemplate) {
                // Need to add our new templateId and clear out sectionId to each section when cloning:
                for (i = 0; i < $scope.templateData.sections.length; i++) {
                    $scope.templateData.sections[i].templateId = $scope.templateData.templateId;
                    $scope.templateData.sections[i].sectionOldId = $scope.templateData.sections[i].sectionId;
                    $scope.templateData.sections[i].sectionId = null;
                    $scope.validationErrors.sections[i].sectionSaved = true;
                }
                if (templateNew) {
                    $scope.getGenericClauses();
                    $location.search('templateId', $scope.templateData.templateId).replace();
                    templateNew = false;
                }
                $scope.saveAllSectionsBtn.text = 'All Sections Saved';
                $scope.cloneAllSections();
            } else {
                $scope.vlcLoading = false;
                if (templateNew) {
                    $scope.getSectionTypes().then(function(result) {
                        $scope.typesDict = result;
                    }, function(error) {
                        $scope.validationErrorHandler.throwError(error);
                    });
                    $scope.getGenericClauses();
                    $location.search('templateId', $scope.templateData.templateId).replace();
                    templateNew = false;
                    $scope.settingsFilterOverlay.show = false;
                }
            }
        }, function(error) {
            if (error.message.indexOf('VlocityOpenInterface') > -1) {
                $scope.validationErrors.customClassError = $scope.labels.CLMTemplateCustomClassNoImplementation;
                $scope.validationErrors.templateValid = false;
                $scope.vlcLoading = false;
            }else if (error.message.indexOf('exist') > -1) {
                $scope.validationErrors.customClassError = $scope.labels.CLMTemplateCustomClassNotExist;
                $scope.validationErrors.templateValid = false;
                $scope.vlcLoading = false;
            }else if (error.message.indexOf('DocTemplateMappingAbstractClass') > -1) {
                 $scope.validationErrors.customClassError = $scope.labels.CLMTemplateCustomClassNoExtension;
                 $scope.validationErrors.templateValid = false;
                 $scope.vlcLoading = false;
            }else {
                $scope.validationErrorHandler.throwError(error);
                $scope.vlcLoading = false;
            }
        });
    };
    $scope.linkContentVersionToTemplateElement = function(contentVersionId,templateType) {
        var inputData = {
            'templateType': templateType,
            'contentVersionId': contentVersionId,
            'templateId': $scope.templateData.templateId
        };
        remoteActions.linkContentVersionToTemplateElement(inputData).then(function(result) {
            if( templateType == 'Final Template'){
                $scope.vlcLoading = false;
            }
            console.log('contractDocumentCollectionId:', result);

        });

    };

    $scope.getTemplateZip = function(result) {
        var zip = new JSZip(result, {base64: true});
        return zip;
    };

    $scope.getRelsFile = function(zip) {
        var file = zip.file('word/_rels/document.xml.rels');
        if (file != null) {
            return file.asText();
        }
        return '';
    };

    $scope.changeTemplateType = function() {
        var templateType = $scope.templateData.templateDocumentType;
        var templateTypeCode = $scope.templateMetadata.templateCode[templateType];
        $scope.templateData.templateCode = templateTypeCode;

        if (templateTypeCode === CONST.DOCX || templateTypeCode === CONST.PPTX) {
            $scope.templateMetadata.showFileDetails = false;
        }
        $scope.$ctrl.pageParams.templateData = $scope.templateData;
        $scope.$ctrl.pageParams.templateMetadata = $scope.templateMetadata;
        $scope.$ctrl.pageParams.templateType = templateTypeCode;
        $location.search('templateType', $scope.$ctrl.pageParams.templateType);
    };

    $scope.warnTokenMappingChange = function(cancel) {
        if (cancel) {
            if ($scope.templateData.tokenMappingType === CONST.JSON_BASED) {
                $scope.templateData.tokenMappingType = CONST.OBJECT_BASED;
            } else {
                $scope.templateData.tokenMappingType = CONST.JSON_BASED;
            }
            return;
        }
        if (!$scope.templateData.templateId) {
            return;
        } else {
            $sldsModal({
                templateUrl: 'change-token-mapping-modal.tpl.html',
                container: 'div.vlocity',
                placement: 'center',
                html: true,
                scope: $scope,
                backdrop: 'static'
            });
        }
    };

    // Helper method to strip span tags out of sectionContent when loading the UI:
    $scope.removeWrappers = function(sequence) {
        if ($scope.templateData.sections[sequence].sectionContent) {
            var htmlTagRegex = /(<[^>]*>)/,
                sectionContentArray = $scope.templateData.sections[sequence].sectionContent.split(htmlTagRegex),
                tempSectionContent = '';
            for (var i = 0; i < sectionContentArray.length; i++) {
                if (sectionContentArray[i] !== '<viawrapper>' && sectionContentArray[i] !== '</viawrapper>') {
                    tempSectionContent = tempSectionContent + sectionContentArray[i];
                }
            }
            $scope.templateData.sections[sequence].sectionContent = tempSectionContent;
        }
    };

    // Helper method to add spans into sectionContent before it is saved to the db:
    $scope.insertWrappers = function(sequence) {
        var sectionContent, htmlTagRegex, i, sectionContentArray, charCode;
        if ($scope.templateData.sections[sequence].sectionContent) {
            //Replace all occurrences of &nbsp; with ' ' except when immediately preceded by <p> and immediately followed by </p>
            // sectionContent = $scope.templateData.sections[sequence].sectionContent.replace(/(?!<p>)&nbsp;(?!<\/p>)/g, ' ');
            sectionContent = $scope.templateData.sections[sequence].sectionContent.replace(/&nbsp;/g, ' ').replace(/<p>\s<\/p>/g, '<p>&nbsp;</p>');
            $scope.templateData.sections[sequence].sectionContent = sectionContent;
            htmlTagRegex = /(<[^>]*>)/;
            sectionContentArray = $scope.templateData.sections[sequence].sectionContent.split(htmlTagRegex);
            // Wrap spans around all text in sectionContent for parsing data and creating document:
            $scope.templateData.sections[sequence].sectionContent = '';

            for (i = 0; i < sectionContentArray.length; i++) {
                charCode = sectionContentArray[i].charCodeAt(0);
                if (sectionContentArray[i] !== '' && sectionContentArray[i].charAt(0) !== '<' &&
                    sectionContentArray[i].slice(-1) !== '>' && charCode !== 10) {
                    sectionContentArray[i] = '<viawrapper>' + sectionContentArray[i] + '</viawrapper>';
                }
                if (i > 0) {
                    $scope.templateData.sections[sequence].sectionContent = $scope.templateData.sections[sequence].sectionContent + sectionContentArray[i];
                }
            }
            // Check sectionContent to see if the wrapper div exists with document styling:
            if ($scope.templateData.sections[sequence].sectionContent.indexOf('section-content-wrapper') < 0) {
                $scope.templateData.sections[sequence].sectionContent = '<div class="section-content-wrapper" style="font-size: 10pt; font-family: ' +
                    $scope.templateData.templateDocumentFontStyle + '">' + $scope.templateData.sections[sequence].sectionContent + '</div>';
            }
        }
    };

    function parseJsonExpressionTokens(idx, condition) {
        var expWords = [];
        var newTokens = {};
        var i;
        if ($scope.templateData.tokenMappingType === CONST.JSON_BASED &&
            $scope.templateData.sections[idx][condition] &&
            $scope.templateData.sections[idx][condition].length) {
            expWords = $scope.templateData.sections[idx][condition].split(' ');
            for (i = 0; i < expWords.length; i++) {
                if (expWords[i].indexOf('%%') > -1) {
                    newTokens[expWords[i]] = {};
                }
            }
            return newTokens;
        }
    }

    $scope.saveTemplateSection = function(update, sequence) {
        if ($scope.templateData.sections[sequence]) {
            if ($scope.templateData.sections[sequence].sectionType === 'Item') {
                $scope.convertItemColumnsToSectionData($scope.templateData.sections[sequence]);
                $scope.templateData.sections[sequence].sectionItemFontStyle = $scope.convertItemSectionStylesToCss(sequence);
            } else if ($scope.templateData.sections[sequence].sectionType === 'Signature') {
                $scope.processSignatureTokens($scope.templateData.sections[sequence]);
            }
        }
        // Validate first
        $scope.validateSection(sequence);

        if (!$scope.validationErrors.templateValid) {
            $scope.validationErrorMessage = $scope.labels.CLMTemplateValidationErrorsOneOrMoreSections;
        }

        if ($scope.validationErrors.templateValid) {
            if (!('sectionIsRestricted' in $scope.templateData.sections[sequence])) {
                $scope.templateData.sections[sequence].sectionIsRestricted = false;
            }
            if (!('sectionTokens' in $scope.templateData.sections[sequence])) {
                $scope.templateData.sections[sequence].sectionTokens = null;
            }
            if (!('sectionClauseId' in $scope.templateData.sections[sequence])) {
                $scope.templateData.sections[sequence].sectionClauseId = null;
            }
            if (!('sectionLevel' in $scope.templateData.sections[sequence])) {
                $scope.templateData.sections[sequence].sectionLevel = 0;
            }
            if (!('subSections' in $scope.templateData.sections[sequence])) {
                $scope.templateData.sections[sequence].subSections = [];
            }
            if (!('sectionId' in $scope.templateData.sections[sequence])) {
                $scope.templateData.sections[sequence].sectionId = null;
            }
            if ($scope.templateData.sections[sequence].sectionType !== 'Item') {
                $scope.insertWrappers(sequence);
            }

            if (!('sectionTableHeaderRepeated' in $scope.templateData.sections[sequence])) {
                $scope.templateData.sections[sequence].sectionTableHeaderRepeated = false;
            }
            if(!$scope.templateData.sections[sequence].autoAddSectionKey) {
                delete $scope.templateData.sections[sequence].sectionKey;
            }
            if ($scope.templateData.sections[sequence].autoAddSectionKey && 
                $scope.templateData.sections[sequence].sectionType !== "Embedded Template") {
                delete $scope.templateData.sections[sequence].sectionKey;
                delete $scope.templateData.sections[sequence].autoAddSectionKey;
            }

            console.log('sectionTokens before: ', angular.toJson($scope.templateData.sections[sequence].sectionTokens));
            // Evaluate tokens in JSON expression string and add new ones to sectionTokens
            Object.assign($scope.templateData.sections[sequence].sectionTokens, parseJsonExpressionTokens(sequence, 'sectionJsonExpression'));
            if ($scope.templateData.sections[sequence].sectionType === 'Repeating Content') {
                Object.assign($scope.templateData.sections[sequence].sectionTokens, parseJsonExpressionTokens(sequence, 'sectionJsonRepeatable'));
            }
            console.log('sectionTokens after: ', angular.toJson($scope.templateData.sections[sequence].sectionTokens));

            $scope.vlcLoading = true;
            //Set MappingType and send it to the server
            $scope.templateData.sections[sequence].mappingType = $scope.templateData.tokenMappingType;
            $scope.templateData.sections[sequence].lastSectionKey = $scope.templateData.lastSectionKey;
            remoteActions.saveTemplateSection(angular.toJson($scope.templateData.sections[sequence])).then(function(result) {
                // Move the right-col scroll to top so we can actually see the validation msg:
                document.getElementsByClassName('right-col')[0].scrollTop = 0;
                $scope.validationErrorMessage = '';
                $scope.validationMessage = $scope.labels.CLMTemplateSavedTemplateSection + ' "' + $scope.templateData.sections[sequence].sectionName + '" ' + $scope.labels.CLMTemplateSuccessfully;
                $scope.templateData.sections[sequence].sectionId = result;
                $scope.validationErrors.sections[sequence].sectionSaved = true;
                $scope.validationErrors.sections[sequence].sectionErrors = false;
                $scope.saveAllSectionsBtn.text = 'All Sections Saved';
                $scope.templateProperties = false;
                var isBatchable = $scope.templateData.sections[sequence].sectionIsBatchable;
                $scope.templateData.hasBatchableSections = isBatchable ? isBatchable : $scope.templateData.hasBatchableSections;
                for (var j = 0; j < $scope.validationErrors.sections.length; j++) {
                    if ($scope.validationErrors.sections[j].sectionSaved === false) {
                        $scope.saveAllSectionsBtn.text = 'Save All Sections';
                    }
                }
                $scope.removeWrappers(sequence);
                if ($scope.templateData.sections[sequence].sectionConditionType === 'Basic' && document.getElementsByClassName('tagInput')[0]) {
                    document.getElementsByClassName('tagInput')[0].value = '';
                }
                $scope.vlcLoading = false;
            }, function(error) {
                if (error.message.indexOf('VlocityOpenInterface') > -1) {
                    $scope.validationErrors.sections[sequence].customClassError = $scope.labels.CLMTemplateCustomClassNoImplementation;
                    $scope.validationErrors.sections[sequence].sectionErrors = true;
                    $scope.validationErrors.templateValid = false;
                    $scope.vlcLoading = false;
                }else if (error.message.indexOf('exist') > -1) {
                    $scope.validationErrors.sections[sequence].customClassError = $scope.labels.CLMTemplateCustomClassNotExist;
                    $scope.validationErrors.sections[sequence].sectionErrors = true;
                    $scope.validationErrors.templateValid = false;
                    $scope.vlcLoading = false;
                }else if (error.message.indexOf('DocTemplateMappingAbstractClass') > -1) {
                     $scope.validationErrors.sections[sequence].customClassError = $scope.labels.CLMTemplateCustomClassNoExtension;
                     $scope.validationErrors.sections[sequence].sectionErrors = true;
                     $scope.validationErrors.templateValid = false;
                     $scope.vlcLoading = false;
                }else {
                    $scope.validationErrorHandler.throwError(error);
                }
            });
        }
    };

    // Use with matchEntityFilters directive:
    // $scope.$on('applicable-type-tab-switched', function(event, section) {
    //     $scope.saveTemplateSection($scope.checkUniqueName, section.sectionSequence);
    // });

    $scope.saveAllSections = function(showModal) {
        // Need to check that no client-side validation errors are present in any unsaved sections before proceeding with bulk save:
        var sectionErrorsExist = false;
        var i, key, j, k;
        $scope.templateProperties = false;
        $scope.validationErrorMessage = '';
        $scope.validationMessage = '';
        for (i = 0; i < $scope.validationErrors.sections.length; i++) {
            if ($scope.templateData.sections[i] !== CONST.UNDEFINED) {
                if ($scope.templateData.sections[i].sectionType === 'Item') {
                    $scope.convertItemColumnsToSectionData($scope.templateData.sections[i]);
                } else if ($scope.templateData.sections[i].sectionType === 'Signature') {
                    $scope.processSignatureTokens($scope.templateData.sections[i]);
                }
            }
            $scope.validateSection(i);
            for (key in $scope.validationErrors.sections[i]) {
                if ($scope.validationErrors.sections[i][key] && $scope.validationErrors.sections[i][key] !== true && $scope.validationErrors.sections[i][key] !== false) {
                    if (key !== 'sectionWarning'  && key !== 'sectionTypeLabel') {
                        $scope.validationErrors.sections[i].sectionErrors = true;
                        sectionErrorsExist = true;
                    }
                }
            }
        }
        // If we're all clean then save everything:
        if (!sectionErrorsExist) {
            // Add wrappers for saving:
            for (j = 0; j < $scope.templateData.sections.length; j++) {
                if ($scope.templateData.sections[j].sectionType !== 'Item') {
                    $scope.insertWrappers(j);
                }
                if (!('sectionTableHeaderRepeated' in $scope.templateData.sections[j])) {
                    $scope.templateData.sections[j].sectionTableHeaderRepeated = false;
                }
                console.log('sectionTokens before: ', angular.toJson($scope.templateData.sections[j].sectionTokens));
                // Evaluate tokens in JSON expression string and add new ones to sectionTokens
                Object.assign($scope.templateData.sections[j].sectionTokens, parseJsonExpressionTokens(j, 'sectionJsonExpression'));
                if ($scope.templateData.sections[j].sectionType === 'Repeating Content') {
                Object.assign($scope.templateData.sections[j].sectionTokens, parseJsonExpressionTokens(j, 'sectionJsonRepeatable'));
            }
                console.log('sectionTokens after: ', angular.toJson($scope.templateData.sections[j].sectionTokens));
            }
            $scope.vlcLoading = true;
            remoteActions.saveAllSections(angular.toJson($scope.templateData.sections)).then(function(result) {
                for (k = 0; k < $scope.templateData.sections.length; k++) {
                    $scope.templateData.sections[k].sectionId = result[$scope.templateData.sections[k].sectionSequence];
                    $scope.removeWrappers(k);
                    $scope.validationErrors.sections[k].sectionSaved = true;
                    $scope.validationErrors.sections[k].sectionErrors = false;
                }
                if ($scope.cloningTemplate === false) {
                    if (showModal) {
                        $scope.validationMessage = $scope.labels.CLMTemplateAllSectionsForTemplate + ' "' + $scope.templateData.templateName + '"" ' + $scope.labels.CLMTemplateHaveSavedSuccessfully; 
                    }
                }else {
                    $scope.validationMessage = $scope.labels.CLMTemplateClonedSuccessfully;
                }
                $scope.saveAllSectionsBtn.text = 'All Sections Saved';
                $scope.saveTemplateBtnText = 'Save Template Details';
                $scope.bodyHeader = $scope.labels.CLMTemplateEditTemplateDetails;
                $scope.cloningTemplate = false;
                $scope.vlcLoading = false;
            }, function(error) {
                if (error.message.indexOf('VlocityOpenInterface') > -1) {
                    $scope.validationErrorMessage = $scope.labels.CLMTemplateCustomClassNoImplementation;
                    $scope.vlcLoading = false;
                } else if (error.message.indexOf('exist') > -1) {
                    $scope.validationErrorMessage = $scope.labels.CLMTemplateCustomClassNotExist;
                    $scope.vlcLoading = false;
                } else if (error.message.indexOf('DocTemplateMappingAbstractClass') > -1) {
                   $scope.validationErrorMessage = $scope.labels.CLMTemplateCustomClassNoExtension;
                   $scope.vlcLoading = false;
                } else {
                    $scope.validationErrorHandler.throwError(error);
                }
            });
        }else {
            $scope.vlcLoading = false;
            $scope.validationErrorMessage = $scope.labels.CLMTemplateValidationErrorsOneOrMoreSections;
        }
    };

    $scope.startDragging = function(event) {
        var lastMouseEvent, config, viewportHeight, scrollY, structureCanvas;
        lastMouseEvent = null;
        config = {
            activationDistance: 30,
            scrollDistance: 5,
            scrollInterval: 15,
            newPageYOffset: window.pageYOffset
        };

        $timeout(function() {
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
            structureCanvas = angular.element('.left-col')[0];
            if (scrollY !== 0) {
                if ((structureCanvas.scrollHeight - viewportHeight) <= structureCanvas.scrollTop) {
                    config.newPageYOffset += scrollY;
                    window.scrollTo(0,config.newPageYOffset);
                } else {
                    structureCanvas.scrollTop += scrollY;
                }
            }
        }, config.scrollInterval);
        lastMouseEvent = event;
        return true; // always return true because we can always drop here
    };

    // Reorder sequences after drag and drop section to make sure they reflect new array indexes before
    // being saved to db:
    $scope.reorderSequences = function(index) {
        var i;
        $scope.templateData.sections.splice(index, 1);
        //$scope.sectionsPerPage = 10;

        for (i = 0; i < $scope.templateData.sections.length; i++) {
            $scope.templateData.sections[i].sectionSequence = i;
        }
        $scope.saveAllSections(false);
    };

    $scope.checkDeleteSection = function() {
        $sldsModal({
            title: 'Delete Section',
            templateUrl: 'check-delete-section-modal.tpl.html',
            container: 'div.vlocity',
            placement: 'center',
            html: true,
            scope: $scope
        });
    };

    $scope.deleteTemplateSection = function(section) {
        var sectionName, sectionsLength, j;
        sectionName = section.sectionName;
        sectionsLength = $scope.templateData.sections.length;
        $scope.vlcLoading = true;
        j = section.sectionSequence;
        if (section.sectionId) {
            remoteActions.deleteTemplateSection(angular.toJson(section)).then(function() {
                $scope.deleteTemplateSectionHelper(sectionName, j);
                //$scope.templateProperties = true;
            }, function(error) {
                $scope.validationErrorHandler.throwError(error);
            });
        } else {
            $scope.deleteTemplateSectionHelper(sectionName, j);
            //$scope.templateProperties = true;
        }
    };

    $scope.deleteTemplateSectionHelper = function(sectionName, j) {
        var i, k;
        $scope.templateData.sections.splice(j,1);
        $scope.validationErrors.sections.splice(j,1);
        $scope.saveAllSectionsBtn.text = 'All Sections Saved';
        for (i = 0; i < $scope.templateData.sections.length; i++) {
            $scope.templateData.sections[i].sectionSequence = i;
        }
        for (k = 0; k < $scope.validationErrors.sections.length; k++) {
            if ($scope.validationErrors.sections[k].sectionSaved === false) {
                $scope.saveAllSectionsBtn.text = 'Save All Sections';
            }
        }
        $scope.vlcLoading = false;
        if (sectionName) {
            $scope.validationMessage = sectionName + ' ' + $scope.labels.CLMTemplateHasBeenDeleted;
        } else {
            $scope.validationMessage = 'Section' + ' ' + $scope.labels.CLMTemplateHasBeenDeleted;
        }
        if ($scope.templateData.sections[0]) {
            $scope.currentSectionSequence = 0;
            $scope.showSectionData($scope.templateData.sections[0].sectionType, 0);
        } else {
            $scope.currentSectionSequence = null;
        }
    };

    $scope.cloneAllSections = function() {
        var i, key, j;
        // Add wrappers for saving:
        for (i = 0; i < $scope.templateData.sections.length; i++) {
            if ($scope.templateData.sections[i].sectionType  !== CONST.UNDEFINED) {
                if ($scope.templateData.sections[i].sectionType === 'Item') {
                    $scope.convertItemColumnsToSectionData($scope.templateData.sections[i]);
                } else if ($scope.templateData.sections[i].sectionType === 'Signature') {
                    $scope.processSignatureTokens($scope.templateData.sections[i]);
                }
                if ($scope.templateData.sections[i].sectionType !== 'Item') {
                    $scope.insertWrappers(i);
                }
            }
        }

        remoteActions.cloneAllSections(angular.toJson($scope.templateData.sections)).then(function(result) {
            // Need to add our new sectionId to all the sections so the UI will work:
            for (key in result) {
                for (j = 0; j < $scope.templateData.sections.length; j++) {
                    if (key === $scope.templateData.sections[j].sectionOldId) {
                        $scope.templateData.sections[j].sectionId = result[key];
                    }
                    $scope.removeWrappers(j);
                    $scope.validationErrors.sections[j].sectionSaved = true;
                }
            }
            $scope.saveAllSectionsBtn.text = 'All Sections Saved';
            $scope.cloningTemplate = false;
            $scope.templateSaved.isSaved = true;
            $scope.saveTemplateBtnText = 'Save Template Details';
            $scope.validationMessage = $scope.labels.CLMTemplateClonedNewTemplate + ' "' + $scope.templateData.templateName + '"" ' + $scope.labels.CLMTemplateSuccessfully;
            $scope.bodyHeader = $scope.labels.CLMTemplateEditTemplateDetails;
            $scope.vlcLoading = false;
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.cloneTemplate = function(documentTemplateId) {
        $scope.vlcLoading = true;
        remoteActions.cloneDocumentTemplate(documentTemplateId).then(function(result) {
            $scope.clonedTemplateId = result.templateData.Id;
            var templateType = result.templateData[$scope.nameSpacePrefix + 'TemplateContentFormat__c'];
            $scope.templateTypeParam = (templateType ? '&templateType=' + $scope.templateMetadata.templateCode[templateType] : '');
            if (templateType === 'Microsoft Word .DOCX Template' || templateType === 'Microsoft Powerpoint .PPTX Template') {
                $scope.globalKey = result.cvGlobalKey;
                $scope.getContentVersionData($scope.templateData.fileData.Id);
            } else {
                location.href = '/apex/' + $scope.nameSpacePrefix + 'DocumentTemplate?templateId=' + $scope.clonedTemplateId + $scope.templateTypeParam;
            }
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.createNewVersion = function(documentTemplateId) {
        $scope.vlcLoading = true;
        remoteActions.createNewVersion(documentTemplateId).then(function(result) {
            $scope.clonedTemplateId = result.templateData.Id;
            var templateType = result.templateData[$scope.nameSpacePrefix + 'TemplateContentFormat__c'];
            $scope.templateTypeParam = (templateType ? '&templateType=' + $scope.templateMetadata.templateCode[templateType] : '');
            if (templateType === 'Microsoft Word .DOCX Template' || templateType === 'Microsoft Powerpoint .PPTX Template') {
                $scope.globalKey = result.cvGlobalKey;
                $scope.getContentVersionData($scope.templateData.fileData.Id);
            } else {
                location.href = '/apex/' + $scope.nameSpacePrefix + 'DocumentTemplate?templateId=' + $scope.clonedTemplateId + $scope.templateTypeParam;
            }
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };
    
    $scope.getContentVersionData = function(contentVersionId) {
        sforce.connection.sessionId = window.sessionId;
        var queryString = 'Select Id, Title, VersionData FROM ContentVersion where Id = \'' + contentVersionId + '\'';
        sforce.connection.query(queryString, {
            onSuccess: function(result) {
                var contentVersion = {
                    'Id': result.records.Id,
                    'Title': result.records.Title,
                    'VersionData': result.records.VersionData
                }
                $scope.createContentVersion(contentVersion);
            },  
            onFailure: function(result) {
                console.log('SOAP error 1:', result);
                var errorMsg = result.faultstring;
                console.error('errorMsg: ', errorMsg);
                $scope.vlcLoading = false;
            }
        });
    };

    $scope.createContentVersion = function(contentVersion) {
        var contentVersionSObj = new sforce.SObject('ContentVersion');
        contentVersionSObj.Title = contentVersion.Title;
        contentVersionSObj.PathOnClient = contentVersion.Title;
        contentVersionSObj.VersionData = contentVersion.VersionData;
        contentVersionSObj[$scope.nameSpacePrefix + 'GlobalKey__c'] = $scope.globalKey;

        sforce.connection.create([contentVersionSObj], {
            onSuccess: function(result) {
                var status = result[0].getBoolean('success');
                var generatedContentVersionId = result[0].id;
                console.log('generatedContentVersionId: ', generatedContentVersionId);
                $scope.setTemplateContentVersion($scope.clonedTemplateId, generatedContentVersionId);
            },
            onFailure: function(result) {
                console.log('SOAP error 2:', result);
                var errorMsg = result.faultstring;
                console.error('errorMsg: ', errorMsg);
                $scope.vlcLoading = false;
            }
        });
    };

    $scope.setTemplateContentVersion = function(templateId, contentVersionId) {
        remoteActions.setTemplateContentVersion(templateId, contentVersionId).then(function(result) {
            location.href = '/apex/' + $scope.nameSpacePrefix + 'DocumentTemplate?templateId=' + templateId + $scope.templateTypeParam;
        }, function(error) {
            $scope.vlcLoading = false;
        });
    };

    $scope.deactivateTemplate = function(template) {
        $scope.vlcLoading = true;
        $scope.templateDeactivateErrorMsg = '';
        $scope.leftColHeader = $scope.labels.CLMTemplateEditing + ' "' + $scope.templateData.templateName + '"';
        remoteActions.deactivateTemplate(angular.toJson(template)).then(function(result) {
            $scope.checkTemplateAttached(result, $scope.labels.CLMTemplateTheTemplate + ' "' + $scope.templateData.templateName + '"" ' + $scope.labels.CLMTemplateInactiveAndEditable, false);
            // vlcLoading gets set to false in checkTemplateAttached, do not put here.
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.confirmDeleteTemplate = function() {
        $sldsModal({
            templateUrl: 'confirm-delete-template-modal.tpl.html',
            container: 'div.vlocity',
            placement: 'center',
            html: true,
            scope: $scope
        });
    };

    $scope.deleteTemplate = function(template) {
        $scope.vlcLoading = true;
        $scope.templateDeactivateErrorMsg = '';
        remoteActions.deleteTemplate(angular.toJson(template)).then(function(result) {
            $scope.checkTemplateAttached(result, $scope.labels.CLMTemplateTheTemplate + ' ' + $scope.templateData.templateName + ' ' + $scope.labels.CLMTemplateHasBeenDeleted, true);
            // vlcLoading gets set to false in checkTemplateAttached, do not put here.
            $scope.goToTemplateOverview();
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.canTestTemplate = function(template) {
        return (template.templateId && 
                template.tokenMappingType === 'JSON Based' &&
                ((template.dedrbundleId && template.drbundleId && !$scope.templateData.hasBatchableSections) || template.customClassName));
    };

    $scope.testTemplate = function(template) {
        $scope.vlcLoading = true;
        var inputData = {
            'templateId': template.templateId,
            'templateType': template.templateDocumentType
        };
        remoteActions.getGenericDocGenOSURL(inputData).then(function(result) {
            $scope.vlcLoading = false;
            $window.open(result);
        }, function(error) {
            $scope.vlcLoading = false;
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.checkTemplateAttached = function(result, message, isDelete) {
        var i, j, contracts, versions, versionNumbers, event, random;
        // Sorting number function:
        function sortNumber(a, b) {
            return a - b;
        }
        function onClickContract() {
            if (document.getElementsByClassName('more-contracts')[0].className.indexOf('expanded') > -1) {
                document.getElementsByClassName('more-contracts')[0].className = document.getElementsByClassName('more-contracts')[0].className.replace(' expanded', ' collapsed');
                document.getElementsByClassName('see-more-contracts')[0].className = document.getElementsByClassName('see-more-contracts')[0].className.replace(' active', '');
            } else {
                document.getElementsByClassName('more-contracts')[0].className = document.getElementsByClassName('more-contracts')[0].className.replace(' collapsed', ' expanded');
                document.getElementsByClassName('see-more-contracts')[0].className += ' active';
            }
        }
        if (result.length === 0) {
            $scope.validationMessage = message;
            if (isDelete) {
                $scope.getAllTemplates();
                $scope.refresh();
                $location.search('templateId', null).replace();
                $scope.vlcLoading = false;
            } else {
                $scope.templateData.templateActive = false;
                $scope.templateActive = false;
                $scope.getTemplateStatus();
                $scope.vlcLoading = false;
            }
        } else {
            contracts = '';
            for (i = 0; i < result.length; i++) {
                versions = '';
                versionNumbers = result[i].contractversion.sort(sortNumber);
                for (j = 0; j < versionNumbers.length; j++) {
                    if (j === result[i].contractversion.length - 1) {
                        versions += versionNumbers[j] + '.';
                    } else {
                        versions += versionNumbers[j] + ', ';
                    }
                }
                if (!result[i].contractname) {
                    result[i].contractname  = '';
                }
                if (i === 2) {
                    contracts +=
                        '</ul>' +
                        '<span class="see-more-contracts">' + $scope.labels.CLMTemplateSeeMoreContracts + '<i class="icon icon-v-right-caret"></i></span>' +
                        '<ul class="more-contracts collapsed">';
                }
                contracts += '<li>' + result[i].contractname + ' (<a href="/' + result[i].contractid + '" target="_blank">' + result[i].contractnumber + '</a>) - Versions: ' + versions;
            }
            if (isDelete) {
                $scope.templateDeactivateErrorMsg =
                    '<i class="contract-icon icon icon-v-close-circle"></i>' + $scope.labels.CLMTemplateTheTemplate + ' ' + $scope.templateData.templateName + ' ' + $scope.labels.CLMTemplateCannotBeDeletedUsed + '<ul>' + contracts + '</ul>';
            } else {
                $scope.templateDeactivateErrorMsg =
                     '<i class="contract-icon icon icon-v-close-circle"></i>' + $scope.labels.CLMTemplateTheTemplate  + ' ' + $scope.templateData.templateName + ' ' + $scope.labels.CLMTemplateCannotBeDeactivatedUsed + '<ul>' + contracts + '</ul>';
                $scope.templateData.templateActive = true;
                $scope.templateActive = true;
            }
            if (document.getElementsByClassName('see-more-contracts').length) {
                $timeout(function() {
                    random = Math.floor(100000 + Math.random() * 900000);
                    event = new CustomEvent('clickedMoreContracts-' + random, {
                        detail: random
                    });
                    document.getElementsByClassName('see-more-contracts')[0].addEventListener('click', function() {
                        window.dispatchEvent(event);
                    }, false);
                    window.addEventListener('clickedMoreContracts-' + random, onClickContract, false);
                    $scope.vlcLoading = false;
                }, 100);
            } else {
                $scope.vlcLoading = false;
            }
        }
    };

    // Helper so as not repeat code in $scope.saveTemplate():
    $scope.reorganizeCheckboxData = function(model) {
        var obj, key2;
        if (model + 'Obj' in $scope.templateData) {
            obj = $scope.templateData[model + 'Obj'];
            $scope.templateData[model] = '';
            for (key2 in obj) {
                if (obj.hasOwnProperty(key2) && obj[key2]) {
                    $scope.templateData[model] = $scope.templateData[model] + ';' + key2;
                }
            }
            if ($scope.templateData[model]) {
                $scope.templateData[model] = $scope.templateData[model].substr(1);
            }
        }
    };

    // Helper to convert section header styles JSON into CSS string for PDF and docx:
    $scope.convertHeaderStylesToCss = function() {
        var headingLevels, returnCss, i, key;
        returnCss = {};
        headingLevels = $scope.templateData.templateSectionHeaderDisplayStyleObj.headingLevels;
        for (i = 0; i < headingLevels.length; i++) {
            returnCss['level' + (i + 1)] = 'style="';
            for (key in headingLevels[i].styles) {
                if (key === 'padding-left') {
                    returnCss['level' + (i + 1) + 'padding'] = key + ': ' + headingLevels[i].styles[key] + ';';
                }
                returnCss['level' + (i + 1)] = returnCss['level' + (i + 1)] + key + ': ' + headingLevels[i].styles[key] + '; ';
            }
            returnCss['level' + (i + 1)] = returnCss['level' + (i + 1)] + 'width: 100%; display: inline-block;"';
        }
        return angular.toJson(returnCss);
    };

    // Update header font-family when the global document font-family is changed:
    $scope.updateHeaderStyles = function() {
        var i, headingLevels;
        headingLevels = $scope.templateData.templateSectionHeaderDisplayStyleObj.headingLevels;
        for (i = 0; i < headingLevels.length; i++) {
            headingLevels[i].styles['font-family'] = $scope.templateData.templateDocumentFontStyle;
        }
    };

    // Helper to convert item section styles JSON into CSS string for PDF and docx:
    $scope.convertItemSectionStylesToCss = function(sequence) {
        var itemSectionStyles, returnCss, i, key, keys, columns;
        returnCss = {};
        keys = ['header', 'body', 'total'];
        itemSectionStyles = $scope.templateData.sections[sequence].sectionItemDisplayStyle;
        columns = $scope.templateData.sections[sequence].sectionLineItems.length;
        for (i = 0; i < itemSectionStyles.length; i++) {
            returnCss[keys[i]] = 'style="';
            for (key in itemSectionStyles[i].styles) {
                returnCss[keys[i]] = returnCss[keys[i]] + key + ': ' + itemSectionStyles[i].styles[key] + '; ';
            }
        }
        return angular.toJson(returnCss);
    };

    // Used to validate sectionContent to make sure there is real text available, not just HTML code
    $scope.stripHtml = function(html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    $scope.validateSection = function(sequence) {
        var strError, str, endIndex, sectionTokens, applicableTypes, key, tokenMap, i, applicableType;
        // Reset template sections errors:
        $scope.validationErrors.sections[sequence].sectionName = '';
        $scope.validationErrors.sections[sequence].sectionContent = '';
        $scope.validationErrors.sections[sequence].sectionLineItems = '';
        $scope.validationErrors.sections[sequence].sectionType = '';
        $scope.validationErrors.sections[sequence].sectionTokens = '';
        $scope.validationErrors.sections[sequence].customClassError = '';
        $scope.validationErrors.sections[sequence].sectionWarning = {
            'limitWarning': ''
        };

        // Innocent until proven guilty:
        $scope.validationErrors.templateValid = true;
        $scope.validationErrors.sections[sequence].sectionErrors = false;

        // Check Current Section Name is not empty:
        if ($scope.templateData.sections[sequence] && (!$scope.templateData.sections[sequence].sectionName || $scope.templateData.sections[sequence].sectionName  === '')) {
            $scope.validationErrors.sections[sequence].sectionName = $scope.labels.CLMTemplateEnterSectionName;
            $scope.validationErrors.sections[sequence].sectionErrors = true;
            $scope.validationErrors.templateValid = false;
        }
        // Check Current Section Content is not empty:
        if ($scope.templateData.sections[sequence] && $scope.templateData.sections[sequence].sectionType !== 'Conditional' &&
            $scope.templateData.sections[sequence].sectionType !== 'Embedded Template') {
            if ($scope.templateData.sections[sequence].sectionContent.indexOf('<img') < 0 && /\S/.test($scope.stripHtml($scope.templateData.sections[sequence].sectionContent)) === false) {
                $scope.validationErrors.sections[sequence].sectionContent = $scope.labels.CLMTemplateEnterSectionContent;
                $scope.validationErrors.sections[sequence].sectionErrors = true;
                $scope.validationErrors.templateValid = false;
            }
            if ($scope.templateData.sections[sequence].sectionContent.length >=  131072) {
                strError =  $scope.labels.CLMTemplateContentIs + ' ' + $scope.templateData.sections[sequence].sectionContent.length + ' ' + $scope.labels.CLMTemplateCharactersExceedsLimit;
                $scope.validationErrors.sections[sequence].sectionContent = strError;
                $scope.validationErrors.sections[sequence].sectionErrors = true;
                $scope.validationErrors.templateValid = false;
            } else {
                if ($scope.templateData.sections[sequence].sectionContent.length > 104857) {
                    str = $scope.labels.CLMTemplateContentIs + ' ' + $scope.templateData.sections[sequence].sectionContent.length +
                        ' ' + $scope.labels.CLMTemplateCharactersExceedsLimit;
                    $scope.validationErrors.sections[sequence].sectionWarning = {
                        'limitWarning': str
                    };
                } else if ($scope.templateData.sections[sequence].sectionContent.length <= 104857) {
                    $scope.validationErrors.sections[sequence].sectionWarning = {
                        'limitWarning': ''
                    };
                }
            }
        }
        //Check Current Item Section is not empty & rows are valid:
        if (!$scope.validationErrors.sections[sequence].sectionErrors && $scope.templateData.sections[sequence] && $scope.templateData.sections[sequence].sectionType === 'Item') {
            if ($scope.templateData.sections[sequence].sectionLineItems.length <= 0) {
                $scope.validationErrors.sections[sequence].sectionLineItems = $scope.labels.CLMTemplateEnterSectionLineItem;
                $scope.validationErrors.sections[sequence].sectionErrors = true;
                $scope.validationErrors.templateValid = false;
            } else {
                $scope.validateSectionLineItem($scope.templateData.sections[sequence]);
                endIndex =  $scope.templateData.sections[sequence].sectionLineItems.length - 1;
                if (!$scope.sectionLineItemValid) {
                    $scope.validationErrors.sections[sequence].sectionLineItems = $scope.warningText;
                    $scope.validationErrors.sections[sequence].sectionErrors = true;
                    $scope.validationErrors.templateValid = false;
                    $scope.templateData.sections[sequence].sectionLineItems[endIndex].isEditable = true;
                } else if ($scope.templateData.sections[sequence].sectionLineItems.length >= 0) {
                    $scope.templateData.sections[sequence].sectionLineItems[endIndex].isEditable = false;
                }
            }
        }

        if ($scope.templateData.sections[sequence]) {
            sectionTokens = $scope.templateData.sections[sequence].sectionTokens;
        }
        if ($scope.templateData.templateApplicableTypes) {
            applicableTypes = $scope.templateData.templateApplicableTypes.split(';');
        }
        if ($scope.templateData.templateApplicableItemTypes && $scope.templateData.sections[sequence].sectionType === 'Item') {
            applicableTypes = $scope.templateData.templateApplicableItemTypes.split(';');
        }
        if ($scope.templateData.sections[sequence].sectionType === 'Custom') {
            if ($scope.templateData.sections[sequence].customClass === undefined ||
                ($scope.templateData.sections[sequence].customClass !== null &&
                $scope.templateData.sections[sequence].customClass.trim() === '')) {
                $scope.validationErrors.sections[sequence].customClassError = $scope.labels.CLMTemplateEnterCustomClassName;
                $scope.validationErrors.sections[sequence].sectionErrors = true;
                $scope.validationErrors.templateValid = false;
            }
        }

        if ($scope.templateData.tokenMappingType === CONST.OBJECT_BASED) {
            for (key in sectionTokens) {
                tokenMap = sectionTokens[key];
                if (_.isEmpty(tokenMap)) {
                    $scope.validationErrors.sections[sequence].sectionTokens = $scope.labels.CLMTemplateEnterTokenMapping;
                    $scope.validationErrors.sections[sequence].sectionErrors = true;
                    $scope.validationErrors.templateValid = false;
                } else {
                    for (i = 0; i < applicableTypes.length; i++) {
                        applicableType = applicableTypes[i];
                        if (tokenMap[applicableType] === null || tokenMap[applicableType] === CONST.UNDEFINED) {
                            $scope.validationErrors.sections[sequence].sectionTokens = $scope.labels.CLMTemplateEnterTokenMapping;
                            $scope.validationErrors.sections[sequence].sectionErrors = true;
                            $scope.validationErrors.templateValid = false;
                        }
                    }
                }
            }
        }
        if ($scope.validationErrors.sections[sequence].sectionErrors) {
            $scope.validationMessage = '';
        }
    };

    $scope.validateSectionLineItem = function(section) {
        var i, isHeaderEmpty, isTokenEmpty, endIndex, itemHeader;
        var sequence = section.sectionSequence;
        $scope.validationErrors.sections[sequence].sectionLineItems = '';
        $scope.validationErrors.sections[sequence].sectionErrors = false;
        //validate current section line item row
        for (i = 0; i < section.sectionLineItems.length; i++) {
            isHeaderEmpty = (section.sectionLineItems[i].columnHeader === '');
            isTokenEmpty = (section.sectionLineItems[i].columnToken === '') ;
            $scope.warningText = '';
            if (isHeaderEmpty || isTokenEmpty) {
                if (isHeaderEmpty) {
                    $scope.warningText = $scope.labels.CLMTemplateEnterColumnHeader;
                }
                if (isTokenEmpty) {
                    $scope.warningText = $scope.labels.CLMTemplateEnterColumnToken;
                }
                if (isTokenEmpty && isHeaderEmpty) {
                    $scope.warningText = $scope.labels.CLMTemplateEnterColumnHeaderAndToken;
                }
            }
            if (!isTokenEmpty && section.sectionLineItems[i].columnToken !== CONST.UNDEFINED) {
                endIndex = section.sectionLineItems[i].columnToken.length - 1;
                if (section.sectionLineItems[i].columnToken.charAt(0) !== '%' || section.sectionLineItems[i].columnToken.charAt(endIndex) !== '%') {
                    $scope.warningText = $scope.labels.CLMTemplateEnterColumnTokenFormat;
                }
            }
            if ($scope.warningText !== '') {
                $scope.sectionLineItemValid = false;
                $scope.validationErrors.sections[sequence].sectionLineItems = $scope.warningText;
                $scope.validationErrors.sections[sequence].sectionErrors = true;
                $scope.validationErrors.templateValid = false;
            }
            if ($scope.warningText === '') {
                itemHeader = section.sectionLineItems[i];
                itemHeader.isEditable = false;
                $scope.sectionLineItemValid = true;
                $scope.validationErrors.sections[sequence].sectionLineItems = $scope.warningText;
                $scope.validationErrors.templateValid = true;
                $scope.validationErrors.sections[sequence].sectionErrors = false;
            }
        }
    };

    $scope.validateTemplate = function(update) {
        // Reset template details errors:
        $scope.validationErrors.templateName = '';
        $scope.validationErrors.templateType = '';
        $scope.validationErrors.templateApplicableTypes = '';
        $scope.validationErrors.templateApplicableItemTypes = '';
        $scope.validationErrors.templateSignature = '';
        $scope.validationErrors.templateTrackRedlines = '';
        $scope.validationErrors.dataRaptorBundleName = '';
        $scope.validationErrors.wordDocumentTemplateName = '';
        $scope.validationErrors.dataExtractDataBundleName = '';
        $scope.validationErrors.usageType = '';
        $scope.validationErrors.templateFile = '';
        $scope.validationErrors.customClassError = '';
        // Innocent until proven guilty:
        $scope.validationErrors.templateValid = true;

        // Make sure name is unique
        if (update) {
            // Check Template Name is unique except for currently saved name of this template:
            if ($scope.templateData.templateName === '') {
                $scope.validationErrors.templateName = $scope.labels.CLMTemplateEnterTemplateName;
                $scope.validationErrors.templateValid = false;
            }
            if ($scope.currentlyEditingName) {
                for (var i = 0; i < $scope.templates.length; i++) {
                    if ($scope.templates[i].template.Name === $scope.templateData.templateName && $scope.templates[i].template.Name !== $scope.currentlyEditingName) {
                        $scope.validationErrors.templateName = 'Please ' + $scope.labels.CLMTemplateTemplateNameExists;
                        $scope.validationErrors.templateValid = false;
                    }
                }
            } else if ($scope.cloningTemplate) {
                for (var j = 0; j < $scope.templates.length; j++) {
                    if ($scope.templates[j].template.Name === $scope.templateData.templateName) {
                        $scope.validationErrors.templateName = $scope.labels.CLMTemplateTemplateNameExists;
                        $scope.validationErrors.templateValid = false;
                    }
                }
            }
        } else {
            // Check Template Name is not empty, 80 chars or less, and unique:
            if ($scope.templateData.templateName) {
                for (var k = 0; k < $scope.templates.length; k++) {
                    if ($scope.templates[k].template.Name === $scope.templateData.templateName && !$scope.templateData.templateId) {
                        $scope.validationErrors.templateName = $scope.labels.CLMTemplateTemplateNameExists;
                        $scope.validationErrors.templateValid = false;
                    }
                }
                if ($scope.templateData.templateName.length > 80) {
                    $scope.validationErrors.templateName = $scope.labels.CLMTemplateNameCharacterLimit + ' ' +
                        $scope.templateData.templateName.length + '. ' + $scope.labels.CLMTemplatePlsShorten;
                }
            } else {
                $scope.validationErrors.templateName = $scope.labels.CLMTemplateEnterTemplateName;
                $scope.validationErrors.templateValid = false;
            }
        }
        if ($scope.templateData.tokenMappingType === CONST.OBJECT_BASED) {
            // Check that at least one Applicable Type is selected:
            $scope.validateCheckboxes('templateApplicableTypes', $scope.fieldlabels.template[nameSpacePrefix + 'ApplicableTypes__c']);
            // Check that at least one Applicable Item Type is selected:
            $scope.validateCheckboxes('templateApplicableItemTypes', $scope.fieldlabels.template[nameSpacePrefix + 'ApplicableItemTypes__c']);
        }
        if ($scope.$ctrl.pageParams.templateType === CONST.DOCX || $scope.$ctrl.pageParams.templateType === CONST.PPTX) {
            if (!($scope.templateData.fileName && $scope.templateData.fileName.length > 0)) {
                $scope.validationErrors.templateFile = $scope.labels.CLMTemplateSelectAFile;
                $scope.validationErrors.templateValid = false;
            }
            if ($scope.templateData.mappingMethodType === 'CustomClass') {
                if ($scope.templateData.customClassName === undefined ||
                    ($scope.templateData.customClassName !== null &&
                    $scope.templateData.customClassName.trim() === '')) {
                    $scope.validationErrors.customClassError = $scope.labels.CLMTemplateEnterCustomClassName;
                    $scope.validationErrors.templateValid = false;
                }
            }
        }
    };

    // So as not to repeat code in $scope.validateTemplate():
    $scope.validateCheckboxes = function(model, name) {
        if (model + 'Obj' in $scope.templateData) {
            var checkSelectedFlag = false;
            for (var key in $scope.templateData[model + 'Obj']) {
                if ($scope.templateData[model + 'Obj'][key] === true) {
                    checkSelectedFlag = true;
                }
            }
            if (!checkSelectedFlag) {
                $scope.validationErrors[model] = name + ': '+ $scope.labels.CLMTemplateSelectAtleastOne;
                $scope.validationErrors.templateValid = false;
            }
        }else {
            $scope.validationErrors[model] = name + ': ' + $scope.labels.CLMTemplateSelectAtleastOne;
            $scope.validationErrors.templateValid = false;
        }
    };

    $scope.goToTemplateOverview = function() {
        location.href = location.origin + '/apex/DocTemplateList';
    };

    $scope.goToDataRaptor = function(id) {
        $window.open(location.origin + '/apex/DRMapper?bundleId=' + id);
    };
    
    $scope.getTemplateTokens = function() {
        var tempId = $scope.templateData.templateId;
        remoteActions.getTemplateTokens(tempId).then(function(result) {
            var tokenListObj = [];
            for(var i=0; i<result.length; i++) {
                var token = {};
                token[result[i]] = '';
                var unflattenToken = $scope.unFlattenToken(token);
                tokenListObj.push(unflattenToken);
            }
            if(tokenListObj.length > 1) {
                tokenListObj = $.extend(true, ...tokenListObj);
                tokenListObj = $.extend(true, tokenListObj, tokenListObj);
            }
            $scope.tokenList = JSON.stringify(tokenListObj, null, 4);
            $scope.displayTokenJsonModal();
        },function(error) {
            console.log(error);
            $scope.tokenList = 'No Tokens to display'
            $scope.displayTokenJsontModal();
        });
    };

    /**
     * unflatten the object.
     * Ex: obj = "{'product:list:name' : ''}" , converts to "{ product: { list: { name :''}"
     */
    $scope.unFlattenToken = function(obj) {
        var result = {}, tempObj, length;
        for (var property in obj) {
            var splitString = property.split(':');
            length = splitString.length;
            tempObj = result;
            for (var i = 0; i < length - 1; i++) {
                if (!(splitString[i] in tempObj)) {
                    tempObj[splitString[i]] = {};
                }
                tempObj = tempObj[splitString[i]];
            }
            tempObj[splitString[length - 1]] = obj[property];
        }
        return result;
    };
    
    $scope.copyTextToClipboard = function(element) {
        var tempInputElement = $('<input>');
        $('body').append(tempInputElement);
        tempInputElement.val($(element).text()).select();
        document.execCommand('copy');
        tempInputElement.remove();
      };

    $scope.displayTokenJsonModal = function() {
        $sldsModal({
            title: $scope.modalLabels.CLMTemplateTokenJSONFormatTitle,
            templateUrl: 'view-token-json-modal.tpl.html',
            html: true,
            scope: $scope,
            container: 'div.vlocity',
            placement: 'center',
            prefixEvent: 'checkStatusModal',
            backdrop: false
        });
    };

    // Instantiating ValidationErrorHandler Factory:
    $scope.validationErrorHandler = new ValidationErrorHandler();

    $scope.setFontFormat = function(format) {
        $scope.selectedFontFormat = format;
    };

    $scope.getFieldLabels = function() {
        remoteActions.getFieldLabels().then(function(result) {
            $scope.fieldlabels.template = result.template;
            $scope.fieldlabels.section = result.section;
        });
    };
    $scope.getFieldLabels();

    $scope.clearvalidateEntityFilters = function() {
        $scope.validateEntityFilters = '';
    };

    $scope.clearTemplateDeactivateErrorMsg = function() {
        $scope.templateDeactivateErrorMsg = '';
    };

    $scope.getApplicableTypes = function() {
        var applicableTypes = [];
        for (var key in $scope.templateData.templateApplicableTypesObj) {
            if ($scope.templateData.templateApplicableTypesObj[key]) {
                applicableTypes.push(key);
            }
        }
        return applicableTypes.join(';');
    };

    $scope.getApplicableItemTypes = function() {
        var applicableItemTypes = [];
        for (var key in $scope.templateData.templateApplicableItemTypesObj) {
            if ($scope.templateData.templateApplicableItemTypesObj[key]) {
                applicableItemTypes.push(key);
            }
        }
        return applicableItemTypes.join(';');
    };

    $scope.searchDocumentTemplates = function(pageNumber) {
        $scope.vlcLoading = true;
        $scope.paginationOptions.pageNumber = (pageNumber || 1);
        var inputData = {
            'pageNumber': $scope.paginationOptions.pageNumber,
            'searchTerm': $scope.searchOptions.searchTerm.trim(),
            'mappingType': $scope.templateData.tokenMappingType,
            'templateType': ($scope.templateData.templateDocumentType || ''),
            'usageType': $scope.templateData.usageType,
            'applicableTypes': $scope.getApplicableTypes(),
            'applicableItemTypes': $scope.getApplicableItemTypes(),
            'contractTypes': $scope.templateData.templateContractTypes,
            'templateLanguage': $scope.templateData.templateDocumentLanguage || ''
        };
        remoteActions.searchDocumentTemplates(inputData).then(function(result) {
            console.log('search embedded templates result:', result);
            $scope.documentTemplates = result.documentTemplates;
            $scope.templateIds = result.templateIds;
            $scope.paginationOptions.totalCount = $scope.templateIds.length;
            $scope.paginationOptions.totalPages = Math.ceil($scope.templateIds.length / $scope.paginationOptions.pageSize);
            $scope.paginationOptions.fromCount = 1
            $scope.paginationOptions.toCount = $scope.paginationOptions.pageSize;
            $scope.showPagination = ($scope.paginationOptions.totalCount > 0);
            $scope.vlcLoading = false;
        }, function(error) {
            $scope.vlcLoading = false;
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.getDocumentTemplates = function(pageNumber) {
        $scope.vlcLoading = true;
        var fromIdx = (pageNumber - 1) * $scope.paginationOptions.pageSize;
        var documentTemplateIds = $scope.templateIds.slice(fromIdx, (fromIdx + $scope.paginationOptions.pageSize));

        var inputData = {
            'documentTemplateIds': documentTemplateIds.join(',')
        };
        remoteActions.getDocumentTemplatesById(inputData).then(function(result) {
            console.log('get embedded template list result:', result);
            $scope.documentTemplates = result.documentTemplates;
            $scope.paginationOptions.pageNumber = pageNumber;
            $scope.paginationOptions.fromCount = fromIdx + 1;
            $scope.paginationOptions.toCount = $scope.paginationOptions.fromCount + documentTemplateIds.length;
            $scope.vlcLoading = false;
        }, function(error) {
            $scope.vlcLoading = false;
            $scope.validationErrorHandler.throwError(error);
        });
    };

     /**
      *  Document Generation Method Types:
      */
     $scope.getDocumentGenerationMethods = function() {        
        remoteActions.getDocumentGenerationMethods()
            .then(function(result) {
                $scope.documentGenerationMethodTypes = result;
            })
            .catch(function(error) {
                $scope.validationErrorHandler.throwError(error);
            });
    };
    $scope.getDocumentGenerationMethods();

    /**
     *  PDF Generation Method Types:
     */
    $scope.getPdfGenerationMethods = function() {
        remoteActions.getPdfGenerationMethods()
            .then(function(result) {
                $scope.pdfGenerationMethodTypes = result;            
            })
            .catch(function(error) {
                $scope.validationErrorHandler.throwError(error);
            });
    };
    $scope.getPdfGenerationMethods();
});

},{}],8:[function(require,module,exports){
angular.module('documentTemplateApp').controller('DocumentTemplateDropzoneController', 
    function($scope, CONST, remoteActions, $sldsModal) {
    'use strict';
    
    var uploader;
    $scope.clauseSet = [];
    $scope.modifiedFileContent;
    $scope.modifiedFileblob;
    $scope.hasClauseTokens = false;
    $scope.hasFormattedClauseTokens = false;
    $scope.$parent.$parent.hasParsedDocument = false;
    $scope.$parent.$parent.errorInParsing = false;
    $scope.xmllexed;
    $scope.checkFontEmbeddingInDOCXTemplate = false;
    if (window.checkFontEmbeddingInDOCXTemplate !== CONST.UNDEFINED) {
        $scope.checkFontEmbeddingInDOCXTemplate = window.checkFontEmbeddingInDOCXTemplate;
    }
    $scope.state = {
         uploadedFileContents: null,
         waitingForFileUpload: false
       };
    $scope.labels = $scope.$parent.$parent.labels;
    $scope.modalLabels =  $scope.$parent.$parent.modalLabels;
    var allowedTemplateTypes = [CONST.DOCX, CONST.PPTX];
    var config = {
        options: {
            url: '/apex/DocumentTemplate',
            autoProcessQueue: false,
            clickable: '.version-browse-files',
            maxFilesize: 38,
            maxFiles: 1
        },
        eventHandlers: {
            addedfile: function(file) {
                var _this = this;
                var removeIcon;

                removeIcon = Dropzone.createElement('<i class="icon icon-v-trash"></i>');
                removeIcon.addEventListener('click', function(e) {
                    // Make sure the button click doesn't submit the form:
                    e.preventDefault();
                    e.stopPropagation();
                    // Remove the file preview.
                    if (!$scope.$ctrl.templateActive) {
                        _this.removeFile(file);
                    }

                    delete $scope.$ctrl.templateData.hasFileUpload;
                    delete $scope.$ctrl.templateData.docxTokens;
                    delete $scope.$ctrl.templateData.fileName;
                    /*if ($scope.$ctrl.templateData.templateId) {
                        $scope.$ctrl.templateData.fileName = $scope.$ctrl.templateData.existingFileName;
                    } else {
                        delete $scope.$ctrl.templateData.fileName;
                    }*/
                });

                file.previewElement.appendChild(removeIcon);

                // If autoProcessQueue set to false, .processQueue() need to be called manually to upload all files currently queued
                this.options.autoProcessQueue = true; // Workaround! .processQueue() function doesn't process all queued files (bug)
                this.processQueue();
            },
            processing: function(file) {
                $scope.$parent.$parent.vlcLoading = true;
                $scope.$apply();
            },
            sending: function(file) {},
            success: function(file) {
                this.options.autoProcessQueue = false; // Do not process the queue automatically
            },
            complete: function(file) {
                try {
                    var fileContents =  $scope.readUploadedFileAsDataURL(file, 'Original',file.name).then(function(result){
                        if($scope.checkFontEmbeddingInDOCXTemplate == true){
                            $scope.validateEmbeddedFonts(result);
                        }
                        $scope.readUploadedFileAsArrayBuffer(file).then(function(result){
                            $scope.parseDocxTokens(result ,file);
                        });
                    });
                    } catch (error) {
                        $scope.$parent.$parent.docxErrorMessage = 'Template Word Document Error';
                        if (error.properties && error.properties.errors && error.properties.errors.length > 0) {
                            var errorDetails = '<ul class="slds-list_dotted">';
                            var templateErrors = error.properties.errors;
                            for (var i = 0; i < templateErrors.length; i++) {
                                errorDetails += '<li>' + templateErrors[i].message + ': ' + templateErrors[i].properties.explanation + '</li>';
                            }
                            errorDetails += '</ul>';
                            $scope.$parent.$parent.docxErrorDetails = errorDetails;
                        }
                      console.log(error);
                    }
            },
            error: function(file) {
                this.options.autoProcessQueue = false; // Do not process the queue automatically
            },
            removedfile: function(file) {
                if (file.accepted) {}
            }
        }
    };

    $scope.$watch('$ctrl.templateType', function() {
        var templateType = $scope.$ctrl.templateType;
        config.options.acceptedFiles = allowedTemplateTypes.indexOf(templateType) !== -1 ? '.' + templateType : '';
        
        if (uploader !== undefined) {
            uploader.destroy();
        }
        uploader = new Dropzone('#dropzone', config.options);
        // bind the given event handlers
        angular.forEach(config.eventHandlers, function(handler, event) {
            uploader.on(event, handler);
        });
    });
    $scope.cancelFileLoad = function(file) {
        $scope.hasClauseTokens = false;
        // Remove the file preview.
        Dropzone.forElement("div#dropzone").removeFile(file);
        $("div.dropzone-container #dropzone").removeClass('dz-started dz-max-files-reached');
        delete $scope.$ctrl.templateData.hasFileUpload;
        delete $scope.$ctrl.templateData.docxTokens;
        delete $scope.$ctrl.templateData.fileName;
        delete $scope.$ctrl.templateData.fileData;
    };
$scope.readUploadedFileAsDataURL = function(file, templateType ,fileName){
    var temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
          temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
          };
         // Read file contents as an ArrayBuffer to parse the data for tokens
            temporaryFileReader.addEventListener('load', function() {
            console.log('FileReader.readyState ', temporaryFileReader.readyState );
            $scope.originalFileDataReaderResult = temporaryFileReader.result;
            var fileContent = temporaryFileReader.result;
            var base64Mark = 'base64,';
            var dataStart = fileContent.indexOf(base64Mark) + base64Mark.length;
            fileContent = fileContent.substring(dataStart);

            // Save the uploaded file as a new content version record
            if(templateType == 'Original'){
                $scope.createContentVersionRecord(fileName, fileContent, templateType);
                }
            else {
                $scope.saveParsedContentVersionRecord(fileName, fileContent, templateType);
            }
             resolve(temporaryFileReader.result);
                });
          temporaryFileReader.readAsDataURL(file);

        });
  }

    $scope.validateEmbeddedFonts = function(file){
        // Instantiate a Document object.
        const doc = new CoreControls.Document('YOUR_FILE_ID', 'office');
        var fontExcludelist = [
                  'Arial',
                  'Times'
                ];

        CoreControls.getDefaultBackendType().then(backendType => {
          // Determine the PartRetriever that should be used. Office files and PDF files share the same partRetriever
          // If you are loading the Office file as a Blob, you need to use PartRetrievers.LocalPdfPartRetriever
          const partRetriever = new CoreControls.PartRetrievers.ExternalPdfPartRetriever(file);
          const options = {
            workerTransportPromise: CoreControls.initOfficeWorkerTransports(backendType, {}, $scope.pdfIntegrationConfig)
          };

        doc.loadAsync(partRetriever, error => {
            doc.getOfficeFontReport().then(function(fontReport) {
                var missingFonts = [];
                var thisfont = null;

                if (!fontReport.requiresFontSubstitution) {
                        console.log('This document has all its fonts embedded properly!');
                } else {
                        //Alert users with the list of Fonts that are Not Embedded properly
                        var nonEmbedCounter = 0;
                        for (var fontName in fontReport.substituteFonts) {
                            var result = fontExcludelist.findIndex((font) => { return fontName.startsWith(font);}, fontName);

                             if (result >= 0){
                                console.log('Font in Exclude list...');
                                continue;
                             }
                             thisfont = fontReport.documentFonts[fontName];
                             missingFonts.push(thisfont);
                              nonEmbedCounter += 1;
                        }

                        //alert('');

                       if(missingFonts != null && missingFonts !== undefined && missingFonts.length > 0 ) {
                           var errormsg = {
                                           warning: $scope.modalLabels.PdfFontValidationWarningMsg + '\n',
                                           missingFonts: missingFonts
                                       };
                           $scope.actionWarningModal(errormsg);
                       }
                       else{
                            console.log('This document has all its fonts embedded properly. No Default Font Check!');
                       }
                }
            });
          }, options)
        });
    }

    $scope.actionWarningModal = function(error){
        $scope.missingfonts = [];
        for (var i = 0; i < error.missingFonts.length; i++) {
                $scope.missingfonts.push(error.missingFonts[i].font);
          }
        $scope.fontWarningMessage = error.warning;

           //invoke modal
        $sldsModal({
                   title: $scope.modalLabels.PdfFontWarningTitle, //Change this to Label Later.
                   templateUrl: 'font-validation-modal.tpl.html',
                   html: true,
                   content: $scope.fontWarningMessage,
                   container: 'div.vlocity',
                   placement: 'top',
                   prefixEvent: 'actionWarningModal',
                   scope: $scope
                });
    }

$scope.readUploadedFileAsArrayBuffer = function(file){
    var temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
          temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
          };
          // Read file contents as an ArrayBuffer to parse the data for tokens
          temporaryFileReader.addEventListener('load', function() {
                resolve(temporaryFileReader.result);
                });
          temporaryFileReader.readAsArrayBuffer(file);

        });
  }

$scope.parseDocxTokens= function(fileContent, file){
     //1. Extract Clause Tokens only
            var zip = new JSZip(fileContent);
            var startTag = '{{';
            var endTag = '}}';
            $scope.hasFormattedClauseTokens = false;
            $scope.hasNonFormattedClauseTokens = false;
            $scope.$parent.$parent.hasParsedDocument = false;
            $scope.modifiedFileContent='';
            $scope.modifiedFileblob='';
            $scope.getDocTags(zip, startTag, endTag, true);
            var allTokens = $scope.$ctrl.templateData.docxTokens;
                $scope.clauseTokens = allTokens.filter(function(token){
                        var clauseToken = token.indexOf($scope.modalLabels.CLMClausePrefix) > -1;
                        return clauseToken;
                    }).map(function(token){
                        return token.substring(token.indexOf($scope.modalLabels.CLMClausePrefix));
                    });

            //Split this in to different Function...
            if($scope.clauseTokens != undefined && $scope.clauseTokens != null && $scope.clauseTokens.length > 0 ){
                $scope.fileContent = fileContent;
                $scope.file = file;
                $scope.zip = zip;
                $(".dz-preview.dz-file-preview").css("visibility", "hidden");
                $scope.hasClauseTokens = true; 
                $scope.$parent.$parent.vlcLoading = false;
                $scope.$apply();
            }
            //Follow the current flow when NO Clause tokens
            else{
                // Parse the file contents to extract the tokens (tags)
                //$scope.$ctrl.templateData.orginalFileData = {};
                $scope.hasClauseTokens = false;
                var startTag = '{{';
                var endTag = '}}';
                $scope.getDocTags(zip,startTag, endTag, true);
                $scope.$parent.$parent.vlcLoading = false;
                $scope.$apply();
            }
}

$scope.processClauseTokens = function(fileContent, file,zip) {
     //2. Get the Clause Content based on the tokens extracted.
            remoteActions.getClauseContentForDocx(JSON.stringify($scope.clauseTokens)).then(function(result){
                    var numOfReturnedTokens = [];
                    if(result.FormattedClause != undefined && result.FormattedClause != null)
                        numOfReturnedTokens = Object.keys(result.FormattedClause);
                    if(result.NonFormattedClause != undefined && result.NonFormattedClause != null)
                        numOfReturnedTokens = numOfReturnedTokens.concat(Object.keys(result.NonFormattedClause));
                    var isValidClauseTokens = $scope.clauseTokens.every(element => numOfReturnedTokens.includes(element))
                    if(isValidClauseTokens) {
                            $scope.setTokenContent(zip,result);
                            //3. Replace the Clause Token Content
                            if(result.NonFormattedClause != undefined && result.NonFormattedClause != null){
                                $scope.hasNonFormattedClauseTokens = true;
                                $scope.nonformattedClauseKeys = Object.keys(result.NonFormattedClause).map((key) => ($scope.clauseTags.startTag + key + $scope.clauseTags.endTag));
                            }
                            if(result.FormattedClause != null && result.FormattedClause != undefined){
                                $scope.hasFormattedClauseTokens = true;
                                $scope.formattedClauseKeys = Object.keys(result.FormattedClause).map((key) => ($scope.clauseTags.startTag + key + $scope.clauseTags.endTag));
                            }

                            var parsedZip = parseDocumentxml(zip,$scope.clauseTags);

                            if(result.NonFormattedClause != undefined && result.NonFormattedClause != null) {
                                console.log('Contains Not Formatted Clause Tokens...');
                                //Iterate through all the xmls and replace the text tokens with  temporary tokens
                                var templatedFiles = $scope.templatedFiles(parsedZip);
                                templatedFiles.forEach(function (fileName) {
                                    if (parsedZip.files[fileName] != null) {
                                        var textXML = parsedZip.files[fileName].asText();
                                        textXML = textXML.replace(/\{\{/g, '\[\#');
                                        textXML = textXML.replace(/\}\}/g, '\#\]');
                                        parsedZip.file(fileName, textXML);
                                    }
                                });
                                var zipconfig = {
                                    tokenData: result.NonFormattedClause,
                                    startTag: $scope.clauseTags.nonFormatClStartTag,
                                    endTag: $scope.clauseTags.nonFormatClEndTag
                                }
                                $scope.renderZipFile(parsedZip,zipconfig ,true);
                            }
                            // var nonformattedClauseData = result.NonFormattedClause;
                            //3.1 - Replace non Formatted Content Token First
                            $scope.$parent.$parent.hasParsedDocument = true;
                            $scope.cancelFileLoad(file);
                            if($scope.hasFormattedClauseTokens == true){
                                var templatedFiles = $scope.templatedFiles(parsedZip);
                                templatedFiles.forEach(function (fileName) {
                                   if (parsedZip.files[fileName] != null) {
                                       var textXML = parsedZip.files[fileName].asText();
                                       textXML = textXML.replace(/\{\{/g, '\[\#');
                                       textXML = textXML.replace(/\}\}/g, '\#\]');
                                       parsedZip.file(fileName, textXML);
                                   }
                                });
                                console.log('Contains Formatted Clause Tokens...');
                                //3.2 - Replace Formatted Token Content
                                var modifiedFileContent = $scope.modifiedFileContent ? $scope.modifiedFileContent : parsedZip;
                                $scope.setFormattedTokenContent(result.FormattedClause, modifiedFileContent,file);
                            }
                            else if($scope.hasFormattedClauseTokens == false){
                                console.log('No Formatted Clause Tokens found...');
                                var clausetemplateType = 'Formatted';
                                var templatedFiles = $scope.templatedFiles($scope.modifiedFileContent);
                                //Iterate through all the xmls and replace the temporary tokens back to {{ }}
                                templatedFiles.forEach(function (fileName) {
                                    if ($scope.modifiedFileContent.files[fileName] != null) {
                                        var textXML = $scope.modifiedFileContent.files[fileName].asText();
                                        textXML = textXML.replace(/\[\#/g, '{{');
                                        textXML = textXML.replace(/\#\]/g, '}}');
                                        $scope.modifiedFileContent.file(fileName, textXML);
                                    }
                                });
                                var doc = new Docxtemplater();
                                doc.loadZip($scope.modifiedFileContent);
                                $scope.modifiedFileblob= doc.getZip().generate({type: 'blob'});
                                var fileContents =  $scope.readUploadedFileAsDataURL($scope.modifiedFileblob, clausetemplateType, file.name).then(function(result){
                                                                                $scope.hasClauseTokens = false;
                                                                                var startTag = '{{';
                                                                                var endTag = '}}';
                                                                                $scope.getDocTags($scope.modifiedFileContent,startTag, endTag, true);
                                                                                $scope.$parent.$parent.vlcLoading = false;
                                                                                $scope.$apply();
                                                                             });
                            }
                     }
                    else{
                            $scope.missingClauses = [];
                            for (var i = 0; i < $scope.clauseTokens.length; i++) {
                                if (numOfReturnedTokens.indexOf($scope.clauseTokens[i]) === -1) {
                                    $scope.missingClauses.push($scope.clauseTokens[i]);
                                }
                              }
                            $sldsModal({
                                templateUrl: 'clause-not-found-modal.tpl.html',
                                title: 'Clause Not Found',
                                container: 'div.vlocity',
                                placement: 'center',
                                html: true,
                                backdrop: 'static',
                                scope: $scope
                            });
                    }
         });
}


$scope.templatedFiles = function getTemplatedFiles(zip) {
      var templatedFiles = $scope.docXFileTypeConfig.getTemplatedFiles(zip);
      return templatedFiles;
  }

$scope.docXFileTypeConfig = {
      getTemplatedFiles: function getTemplatedFiles(zip) {
        var baseTags = ["docProps/core.xml", "docProps/app.xml", "word/document.xml", "word/document2.xml"];
        var slideTemplates = zip.file(/word\/(header|footer)\d+\.xml/).map(function (file) {
          return file.name;
        });
        return slideTemplates.concat(baseTags);
      }
}

$scope.setTokenContent = function(zip) {
    //var nonformattedClauseData = tokenData.NonFormattedClause;
    var tags= {
       startTag: '{{',
       endTag: '}}',
       nonFormatClStartTag: '[[',
       nonFormatClEndTag: ']]',
       formatClStartTag: '[#!',
       formatClEndTag: '#!]'
    }
    $scope.clauseTags = tags;
    //var nonformattedClauseKeys =  Object.keys(tokenData);
    //Parse Non Formatted Token's Delimiters
    //return Object.keys(nonformattedClauseData).map((key) => (tags.startTag + key + tags.endTag));
}

$scope.setFormattedTokenContent = function(formattedClauseData, zip,file){
     var documentXML = zip.files["word/document.xml"].asText();
                 var strtregex = '\\' + $scope.clauseTags.formatClStartTag;
                 var endregex = '\\' + $scope.clauseTags.formatClEndTag;
                 var FCLStartTag = new RegExp(strtregex, 'g');
                  var FCLEndTag = new RegExp(endregex, 'g');
                 documentXML = documentXML.replace(FCLStartTag, '{@');
                 documentXML = documentXML.replace(FCLEndTag, '}');
                 zip.file("word/document.xml", documentXML);
     var zipconfig = {
        tokenData: formattedClauseData,
     }
    $scope.renderZipFile(zip,zipconfig, false);
    console.log('Formatted Token parsing complete.')
    var clausetemplateType =  $scope.hasFormattedClauseTokens ? 'Replaced Clause Content' : 'Formatted';
    //Iterate through all the xmls and replace the temporary tokens back to {{ }}
    var templatedFiles = $scope.templatedFiles($scope.modifiedFileContent);
    templatedFiles.forEach(function (fileName) {
        if ($scope.modifiedFileContent.files[fileName] != null) {
            var textXML = $scope.modifiedFileContent.files[fileName].asText();
            textXML = textXML.replace(/\[\#/g, '{{');
            textXML = textXML.replace(/\#\]/g, '}}');
            $scope.modifiedFileContent.file(fileName, textXML);
        }
     });

     var doc = new Docxtemplater();
     doc.loadZip($scope.modifiedFileContent);
     $scope.modifiedFileblob= doc.getZip().generate({type: 'blob'});
    var fileContents =  $scope.readUploadedFileAsDataURL($scope.modifiedFileblob, clausetemplateType, file.name).then(function(result){
                                                       $scope.hasClauseTokens = false;
                                                       var startTag = '{{';
                                                       var endTag = '}}';
                                                       $scope.getDocTags($scope.modifiedFileContent,startTag, endTag, true);
                                                       $scope.$parent.$parent.vlcLoading = false;
                                                       $scope.$apply();
//                                                       $scope.$parent.$parent.vlcLoading = false;
//                                                       $scope.$apply();
                                                       //@naga: Handle UI Error Here.
                                                    });
}

$scope.renderZipFile = function(zip, zipconfig, setOptionsRequired){
    $scope.$parent.$parent.errorInParsing = false;
    var doc = new Docxtemplater();
    if(setOptionsRequired){
        doc.setOptions({delimiters: {start: zipconfig.startTag, end: zipconfig.endTag}});
     }
        doc.loadZip(zip);
        doc.setData(zipconfig.tokenData);
        console.log(doc);
        try {
                    // render the document
                    doc.render();
                    $scope.modifiedFileblob= doc.getZip().generate({type: 'blob'});
                    $scope.modifiedFileContent = doc.getZip();
                    var documentXML22 =  $scope.modifiedFileContent.files["word/document.xml"].asText();

               } catch (error) {
                    $scope.$parent.$parent.errorInParsing = true;
                    // Error encountered while parsing the document.
                    $scope.$parent.$parent.docxErrorMessage = 'Template Word Document Error';
                    if (error.properties && error.properties.errors && error.properties.errors.length > 0) {
                        var errorDetails = '<ul class="slds-list_dotted">';
                        var templateErrors = error.properties.errors;
                        for (var i = 0; i < templateErrors.length; i++) {
                            errorDetails += '<li>' + templateErrors[i].message + ': ' + templateErrors[i].properties.explanation + '</li>';
                        }
                        errorDetails += '</ul>';
                        $scope.$parent.$parent.docxErrorDetails = errorDetails;
                    }
                    var e = {
                        message: error.message,
                        name: error.name,
                        stack: error.stack,
                        properties: error.properties,
                    };
                    console.log(JSON.stringify({ error: e }));
                    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                    throw error;
               }
}


var parseDocumentxml = function (zip, tags){
    var docXmlContent = zip.files["word/document.xml"].asText();
    var Docxml = $.parseXML(docXmlContent);
    var wordParagraph = $(Docxml).find('w\\:p');
    wordParagraph.each(function(wPrgs){
        var runEle = $(this).find('w\\:r');
        //Fix for CLM-1865
        if(runEle != undefined && runEle.length > 0 ){
            var runEle = $(this).find('w\\:r');
            if(runEle != undefined && runEle.length > 0){
                replaceTokenDelimiters(runEle, tags);
            }
        }
        //Commenting out for fixing CLM-1865
    //            var parentEle = $(this).find('w\\:proofErr');
    //            if(parentEle != undefined && parentEle.length > 0){
    //                   replaceProofErrTokenDelimiters(parentEle,tags);
    //                 }
    //            else{
    //                var runEle = $(this).find('w\\:r');
    //                if(runEle != undefined && runEle.length > 0){
    //                    replaceTokenDelimiters(runEle, tags);
    //                }
    //            }
    });
    var docxmlRaw = (new XMLSerializer()).serializeToString(Docxml);
    zip.file("word/document.xml", docxmlRaw);
    return zip;
}

//ProofErr tokens appear for word corrections. Though there is performance benefit for using this as delimiter, its sequence is not always guaranteed.
//So removing this piece of logic for now to fix CLM-1865
/*
var replaceProofErrTokenDelimiters = function(parentEle, tags){
    $(parentEle).each(function(childEle){
    var attr =  this.getAttributeNode("w:type");
    if(attr.value !== undefined && attr.value === 'spellStart'){
         var nextNode = this;
         var end =  parentEle[childEle+1];
         var tagText = this.previousSibling.textContent;
         if(tagText == '{{'){
             while(nextNode.nextSibling != undefined){
                nextNode = nextNode.nextSibling;
                 if(nextNode.isSameNode(end)){
                      tagText +=  nextNode.nextSibling.textContent;
                      var clauseData = compareClauseKey(tagText,tags);
                      if(clauseData){
                            var startTextNode = this.previousSibling.textContent;
                            var nextNodeTxtContent = nextNode.nextSibling.textContent;
                            var previousTextNode = $(this.previousSibling).contents().filter(function() {
                              return this.nodeName == 'w:t';
                            });
                            if(previousTextNode.length > 0)
                                previousTextNode[0].firstChild.nodeValue = startTextNode.replace(tags.startTag, clauseData.replaceStartTag);
                            var nextTextNode = $(nextNode.nextSibling).contents().filter(function() {
                                                          return this.nodeName == 'w:t';
                                                        });
                            if(nextTextNode.length > 0)
                                 nextTextNode[0].firstChild.nodeValue = nextNodeTxtContent.replace(tags.endTag, clauseData.replaceEndTag);
                      }
                      break;
                 }
                 else{
                      tagText += nextNode.textContent;
                 }
             }
         }
    }
    });
}
*/

var replaceTokenDelimiters = function(runEle, tags){
     $(runEle).each(function(childEle){
           var runElementtext = this.textContent;
           if(runElementtext.includes(tags.startTag)){
                var nextNode = this;
                var tagText = runElementtext;
                var nodecounter = childEle;
                var clauseData = compareClauseKey(tagText,tags);
                if(clauseData){
                    var currentNodeTxt = this.textContent;
                    var textNode = $(this).contents().filter(function() {
                        return this.nodeName == 'w:t';
                    });
                    if(textNode.length > 0){
                        textNode[0].firstChild.nodeValue = currentNodeTxt.replace(tags.startTag,clauseData.replaceStartTag);
                        currentNodeTxt = this.textContent;
                        textNode[0].firstChild.nodeValue = currentNodeTxt.replace(tags.endTag,clauseData.replaceEndTag);
                    }
                }
                else {
                    while(nextNode.nextSibling != undefined){
                         nextNode = nextNode.nextSibling;
                         if(nextNode.nodeName == 'w:proofErr')
                            continue;
                         if(nextNode.textContent.includes(tags.endTag)){
                              tagText += nextNode.textContent;
                              var clauseData = compareClauseKey(tagText,tags);
                              if(clauseData){
                                    var currentNodeTxt = this.textContent;
                                    var textNode = $(this).contents().filter(function() {
                                              return this.nodeName == 'w:t';
                                            });
                                    if(textNode.length > 0)
                                        textNode[0].firstChild.nodeValue =currentNodeTxt.replace(tags.startTag,clauseData.replaceStartTag);
                                    var nextNodeTxtContent = nextNode.textContent;
                                    var nextTextNode = $(nextNode).contents().filter(function() {
                                               return this.nodeName == 'w:t';
                                            });
                                    if(nextTextNode.length > 0)
                                        nextTextNode[0].firstChild.nodeValue = nextNodeTxtContent.replace(tags.endTag,clauseData.replaceEndTag);
                              }
                              break;
                         }
                         else{
                              tagText += nextNode.textContent;
                         }
                    }
                }
           }
     });

}


var compareClauseKey = function(tagText, tags){
        if($scope.nonformattedClauseKeys && $scope.nonformattedClauseKeys.indexOf(tagText) > -1){
             var tagDelimiter = { replaceStartTag: tags.nonFormatClStartTag, replaceEndTag: tags.nonFormatClEndTag };
             return tagDelimiter;
        }else if($scope.formattedClauseKeys && $scope.formattedClauseKeys.indexOf(tagText) > -1){
             var tagDelimiter = { replaceStartTag: tags.formatClStartTag, replaceEndTag: tags.formatClEndTag };
             return tagDelimiter;
        }
        else{
            return false;
        }
    }



function modifyMediaImageTypes(zip, filesChild, fileObj) {
    var name = filesChild.name;
    if (name.toLowerCase().endsWith('.jpeg')) {
        filesChild.name = name.toLowerCase().replace('.jpeg', '.png');
        fileObj[filesChild.name] = filesChild;
        zip.remove(name);
    } else if(name.toLowerCase().endsWith('.jpg')) {
        filesChild.name = name.toLowerCase().replace('.jpg', '.png');
        fileObj[filesChild.name] = filesChild;
        zip.remove(name);
    }
}
    $scope.getDocTags = function(content, startTag, endTag, isZippedContent) {
        class InspectModule {
            constructor() {
                this.inspect = {};
                this.fullInspected = {};
                this.filePath = null;
            }
            optionsTransformer(options, docxtemplater) {
                this.fileTypeConfig = docxtemplater.fileTypeConfig;
                this.zip = docxtemplater.zip;
                return options;
            }
            set(obj) {
                if (obj.inspect) {
                    if (obj.inspect.filePath) {
                        this.filePath = obj.inspect.filePath;
                    }
                    this.inspect = _.merge({}, this.inspect, obj.inspect);
                    this.fullInspected[this.filePath] = this.inspect;
                }
            }
            getTags(file) {
                file = file || this.fileTypeConfig.textPath(this.zip);
                return getTags(this.fullInspected[file].postparsed);
            }
            getAllTags() {
                return Object.keys(this.fullInspected).reduce((result, file) => {
                    return _.merge(result, this.getTags(file));
                }, {});
            }
        }

        var getTags = function getTags(postParsed) {
            return postParsed.filter(function(part) {
                return (part.type === 'placeholder');
            }).reduce(function(tags, part) {
                tags[part.value] = tags[part.value] || {};
                if (part.subparsed) {
                    tags[part.value] = _.merge(tags[part.value], getTags(part.subparsed));
                }
                return tags;
            }, {});
        };

        function flattenTags(target) {
            var delimiter = ':';
            var output = {};
        
            function step(object, prev) {
                Object.keys(object).forEach(function(key) {
                    var value = object[key];
                    var isarray = Array.isArray(value);
                    var type = Object.prototype.toString.call(value);
                    var isobject = (type === '[object Object]' || type === '[object Array]');
                    
                    var newKey = prev ? (prev + delimiter + key) : key;
        
                    if (!isarray && isobject && Object.keys(value).length) {
                        return step(value, newKey);
                    }
        
                    output[newKey] = value;
                });
            }
        
            step(target);
        
            return output;
        }

        if(isZippedContent === false){
            var zip = new JSZip(content);
            var doc = new Docxtemplater();
            doc.setOptions({delimiters: {start: startTag, end: endTag}});
            doc.loadZip(zip);
            var inspectModule = new InspectModule();
            doc.attachModule(inspectModule);
        }
        else{

            var doc = new Docxtemplater();
            doc.setOptions({delimiters: {start: startTag, end: endTag}});
            doc.loadZip(content);
            var inspectModule = new InspectModule();
            doc.attachModule(inspectModule);
        }

        try {
            $scope.$parent.$parent.closeSuccessBanner();
            doc.compile();
        } catch (error) {
            // Error encountered while parsing the document for tokens
            $scope.$parent.$parent.docxErrorMessage = 'Template Word Document Error';
            if (error.properties && error.properties.errors && error.properties.errors.length > 0) {
                var errorDetails = '<ul class="slds-list_dotted">';
                var templateErrors = error.properties.errors;
                for (var i = 0; i < templateErrors.length; i++) {
                    errorDetails += '<li>' + templateErrors[i].message + ': ' + templateErrors[i].properties.explanation + '</li>';
                }
                errorDetails += '</ul>';
                $scope.$parent.$parent.docxErrorDetails = errorDetails;
            }
            $scope.$parent.$parent.vlcLoading = false;
            if(isZippedContent === false)
                $scope.$apply();

            throw error;
        }

        // Get the list of tokens
        var allTags = inspectModule.getAllTags();
        var tokenList = Object.keys(flattenTags(allTags));
        console.log('tokenList:', tokenList);
        $scope.$ctrl.templateData.docxTokens = tokenList;

        if (tokenList.length === 0) {
            $scope.$parent.$parent.validationWarningMessage = 'The attached document does not have any tokens.';
        } else {
            $scope.$parent.$parent.closeSuccessBanner();
        }
        if(isZippedContent === false){
            $scope.$apply();
        }
    };


$scope.DocParsed = function xmlparse(content, xmltags) {
                    var matches = tagMatcher(content, xmltags.text, xmltags.other);
                    var cursor = 0;
                    var parsed = matches.reduce(function(parsed, match) {
                        var value = content.substr(cursor, match.offset - cursor);
                        if (value.length > 0) {
                            parsed.push({
                                type: "content",
                                value: value
                            })
                        }
                        cursor = match.offset + match.value.length;
                        delete match.offset;
                        if (match.value.length > 0) {
                            parsed.push(match)
                        }
                        return parsed
                    }, []);

                    var value = content.substr(cursor);
                    if (value.length > 0) {
                        parsed.push({
                            type: "content",
                            value: value
                        })
                    }
                    return parsed
                }

    function tagMatcher(content, textMatchArray, othersMatchArray) {
                 var cursor = 0;
                 var contentLength = content.length;
                 var allMatches = concatArrays([textMatchArray.map(function(tag) {
                     return {
                         tag: tag,
                         text: true
                     }
                 }), othersMatchArray.map(function(tag) {
                     return {
                         tag: tag,
                         text: false
                     }
                 })]).reduce(function(allMatches, t) {
                     allMatches[t.tag] = t.text;
                     return allMatches
                 }, {});
                 var totalMatches = [];
                 while (cursor < contentLength) {
                     cursor = content.indexOf("<", cursor);
                     if (cursor === -1) {
                         break
                     }
                     var offset = cursor;
                     cursor = content.indexOf(">", cursor);
                     var tagText = content.slice(offset, cursor + 1);
                     var _getTag = getTag(tagText)
                       , tag = _getTag.tag
                       , position = _getTag.position;
                     var text = allMatches[tag];
                     if (text == null) {
                         continue
                     }
                     totalMatches.push({
                         type: "tag",
                         position: position,
                         text: text,
                         offset: offset,
                         value: tagText,
                         tag: tag
                     })
                 }
                 return totalMatches
             }

    function getTag(tag) {
                 var position = "start";
                 var start = 1;
                 if (tag[tag.length - 2] === "/") {
                     position = "selfclosing"
                 }
                 if (tag[1] === "/") {
                     start = 2;
                     position = "end"
                 }
                 var index = tag.indexOf(" ");
                 var end = index === -1 ? tag.length - 1 : index;
                 return {
                     tag: tag.slice(start, end),
                     position: position
                 }
             }
       function concatArrays(arrays) {
                    var result = [];
                    for (var i = 0; i < arrays.length; i++) {
                        var array = arrays[i];
                        for (var j = 0, len = array.length; j < len; j++) {
                            result.push(array[j])
                        }
                    }
                    return result
                }

// Save Original Template.
    $scope.createContentVersionRecord = function(fileName, fileContent, templateType) {
        $scope.$parent.$parent.vlcLoading = true;
        //$scope.$apply();

        remoteActions.generateGUID().then(function(result) {
            var contentVersionGUID = result;

            var contentDocumentId;
            if ($scope.$ctrl.templateData.fileData) {
                contentDocumentId = $scope.$ctrl.templateData.fileData.ContentDocumentId;
            }

            $scope.orginalcontentVersionSObj = new sforce.SObject('ContentVersion');
            $scope.orginalcontentVersionSObj.Title = fileName;
            $scope.orginalcontentVersionSObj.PathOnClient = fileName;
            $scope.orginalcontentVersionSObj.VersionData = fileContent;
            if (contentDocumentId) {
                $scope.orginalcontentVersionSObj.ContentDocumentId = contentDocumentId;
            }
            if ($scope.$ctrl.workspace !== null && contentDocumentId === undefined) {
                $scope.orginalcontentVersionSObj.FirstPublishLocationId = $scope.$ctrl.workspace.Id;
            }
            $scope.orginalcontentVersionSObj[nameSpacePrefix + 'GlobalKey__c'] = contentVersionGUID;
            $scope.$parent.$parent.orginalcontentVersionSObj = $scope.orginalcontentVersionSObj;
            $scope.createContentVersionObj($scope.orginalcontentVersionSObj, templateType,contentDocumentId);
        });
    };
 // Save Parsed Document template
 $scope.saveParsedContentVersionRecord = function(fileName, fileContent, templateType) {
        $scope.$parent.$parent.vlcLoading = true;
        $scope.$apply();

        remoteActions.generateGUID().then(function(result) {
            var contentVersionGUID = result;
            var contentDocumentId;
            if ($scope.$ctrl.templateData.fileData) {
                contentDocumentId = $scope.$ctrl.templateData.fileData.ContentDocumentId;
            }
            $scope.parsedcontentVersionSObj = new sforce.SObject('ContentVersion');
            $scope.parsedcontentVersionSObj.Title = fileName;
            $scope.parsedcontentVersionSObj.PathOnClient = fileName;
            $scope.parsedcontentVersionSObj.VersionData = fileContent;
            if (contentDocumentId) {
                $scope.parsedcontentVersionSObj.ContentDocumentId = contentDocumentId;
            }
            if ($scope.$ctrl.workspace !== null && contentDocumentId === undefined) {
                $scope.parsedcontentVersionSObj.FirstPublishLocationId = $scope.$ctrl.workspace.Id;
            }
            $scope.parsedcontentVersionSObj[nameSpacePrefix + 'GlobalKey__c'] = contentVersionGUID;
            $scope.$parent.$parent.parsedcontentVersionSObj = $scope.parsedcontentVersionSObj;
            $scope.createContentVersionObj($scope.parsedcontentVersionSObj,templateType,contentDocumentId);

        });
    };

    $scope.createContentVersionObj = function(contentVersionSObj,templateType,contentDocumentId) {
        sforce.connection.sessionId = window.sessionId;
        sforce.connection.create([contentVersionSObj], {
            onSuccess: function(result) {
                var status = result[0].getBoolean('success');
                var generatedContentVersionId = result[0].id;
                console.log('generatedContentVersionId: ', generatedContentVersionId);

                $scope.$ctrl.templateData.hasFileUpload = true;

                $scope.$ctrl.templateData.fileName = contentVersionSObj.Title;
                $scope.$ctrl.templateData.contentVersionId = generatedContentVersionId;
                //If the document is orginal and doesnot contain clauseTokens, save as orginal/final version.
                if(templateType === 'Original' && $scope.hasClauseTokens === false) {
                    $scope.$ctrl.templateData.fileData = {
                        'Id': generatedContentVersionId,
                        'Title': contentVersionSObj.Title
                    };
                    if (contentDocumentId) {
                        $scope.$ctrl.templateData.fileData.ContentDocumentId = contentDocumentId;
                        $scope.$ctrl.templateData.contentDocId = contentDocumentId;
                    }
                } else if(templateType !== 'Original') {
                    //If the document contains clauseTokens and got replaced with the clauses, save as final/formatted template.
                    $scope.$ctrl.templateData.fileData = {
                        'Id': generatedContentVersionId,
                        'Title': contentVersionSObj.Title
                    };
                    if (contentDocumentId) {
                        $scope.$ctrl.templateData.fileData.ContentDocumentId = contentDocumentId;
                        $scope.$ctrl.templateData.contentDocId = contentDocumentId;
                    }
                }else { //If the document is orginal and contains clauseTokens, save the document as orginal template.
                    $scope.$ctrl.templateData.orginalFileData = {
                        'Id': generatedContentVersionId,
                        'Title': contentVersionSObj.Title
                    };
                    if (contentDocumentId) {
                        $scope.$ctrl.templateData.orginalFileData.ContentDocumentId = contentDocumentId;
                        $scope.$ctrl.templateData.contentDocId = contentDocumentId;
                    }
                }
                $scope.$parent.$parent.vlcLoading = false;
                $scope.$apply();
                /*if(templateType !== 'Original Template' ) {
                    $scope.$ctrl.templateData.fileData = {
                        'Id': generatedContentVersionId,
                        'Title': contentVersionSObj.Title
                    };
                    if (contentDocumentId) {
                        $scope.$ctrl.templateData.fileData.ContentDocumentId = contentDocumentId;
                        $scope.$ctrl.templateData.contentDocId = contentDocumentId;
                    }
                }*/
                //console.log('sdsd',$scope.$ctrl.templateData.templateId);
            },
            onFailure: function(result) {
                var errorMsg = result.faultstring;
               // console.error('errorMsg:', errorMsg);
                $scope.$parent.$parent.vlcLoading = false;
                $scope.$apply();
            }
        });
    }

});
},{}],9:[function(require,module,exports){
angular.module('documentTemplateApp').controller('selectImageModalController',function($scope, $rootScope,remoteActions,editor)
{
    
    $scope.folders = [];
    $scope.selectedImage = {};
    $scope.getAllFolders = function()
    {
        remoteActions.getAllFolders().then(function(result,event)
        {
            $scope.folders = result;
            console.log($scope.folders);
        });
    };

    $scope.getAllImages = function(folder)
    {
        remoteActions.getAllImages(folder.Id).then(function(result,event)
        {
            $scope.images = result;
            for (var i=0;i<$scope.images.length;i++)
            {
                var image = $scope.images[i];
                //image['src'] = '/servlet/servlet.FileDownload?file=' + image['Id'];
                image['src'] = '/servlet/servlet.ImageServer?id=' + image['Id'] + '&oid=' + window.orgId;
            }                   
        });
    };

    $scope.imageClicked = function(image)
    {
        $scope.selectedImage = image;
    };

    $scope.insertImage = function()
    {
        console.log($scope.selectedImage);
        var imgSrc = $scope.selectedImage.src;
        var completeImgSrc = location.origin + imgSrc;
        console.log('Complete Img src: '+completeImgSrc);
        var imgSrcTag = 'src="..'+imgSrc+'"';
         if(imgSrcTag.indexOf('&oid') > -1){
            	var tempstr = imgSrcTag.split('&oid');
                var newurl = tempstr[0] + '&amp;oid'+tempstr[1];
                imgSrcTag = newurl;
                }
        if(imgSrc.indexOf('&oid') > -1){
                        var tempstr = imgSrc.split('&oid');
                        var newurl = tempstr[0] + '&amp;oid'+tempstr[1];
                        imgSrc = newurl;
                        }
        var insertImgSrc = '<p><img src="'+imgSrc+'"/></p>';
        //editor.$editor().wrapSelection('insertImage', imgSrc , true);
        editor.insertContent(insertImgSrc);
        $rootScope.$broadcast('imgModalClosed',imgSrc,imgSrcTag,editor);
    };
    $scope.closeModal = function()
    {
        this.$hide();
    };
    $scope.getAllFolders();
});
},{}],10:[function(require,module,exports){
angular.module('documentTemplateApp').controller('signatureModalController',function($scope, $rootScope,remoteActions,editor,anchorList,signerRoleList)
{
    $scope.anchorSelectList = anchorList;
    $scope.signerRoles = signerRoleList;
    $scope.signContent = '';
    
    $scope.closeModal = function()
    {
        this.$hide();        
    };

    $scope.insert = function()
    {
        //var contents = editor.$editor().displayElements.text[0].innerHTML;
        $scope.signContent = '';
        $scope.signContent = $scope.signContent + '\\' + $scope.selectedAnchorString.anchorString + $scope.selectedSignerRole.value + '\\';
        //contents = contents + $scope.signContent;
        //editor.$editor().displayElements.text[0].innerHTML = contents;
        //editor.$editor().wrapSelection("formatBlock", "<P>");
        editor.insertContent($scope.signContent);
        this.$hide();
    };
});
},{}],11:[function(require,module,exports){
angular.module('documentTemplateApp').directive('addHoverClass', function() {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element) {
            $(element).hover(function(e) {
                e.stopPropagation();
                $(this).siblings().removeClass('hovering');
                $(this).addClass('hovering');
            }, function(e) {
                e.stopPropagation();
                $(this).removeClass('hovering');
            });
        }
    };
});

},{}],12:[function(require,module,exports){
angular.module('documentTemplateApp').directive('checkSectionSaved', function() {
    'use strict';
    function compareObjects(s, t) {
        var prop;
        if (typeof s !== typeof t) {
            console.log('two objects not the same type');
            return;
        }
        if (typeof s !== 'object') {
            console.log('arguments are not typeof === "object"');
            return;
        }
        for (prop in s) {
            if (s.hasOwnProperty(prop)) {
                if (t.hasOwnProperty(prop)) {
                    if (!angular.equals(s[prop], t[prop])) {
                        console.log('property ' + prop + ' does not match');
                    }
                } else {
                    console.log('second object does not have property ' + prop);
                }
            }
        }
        // now verify that t doesn't have any properties
        // that are missing from s
        for (prop in t) {
            if (t.hasOwnProperty(prop)) {
                if (!s.hasOwnProperty(prop)) {
                    console.log('first object does not have property ' + prop);
                }
            }
        }
    }
    return {
        restrict: 'E',
        scope: {
            validationErrors: '=',
            btnText: '=',
            docSection: '=',
            docTemplateIsActive: '='
        },
        link: function(scope) {
            scope.$watch('docSection', function(newValue, oldValue) {
                // console.log('docSection.sectionSequence', scope.docSection.sectionSequence);
                // compareObjects(newValue, oldValue);
                if (!scope.docTemplateIsActive) {
                    scope.$parent.removeWrappers(scope.docSection.sectionSequence);
                    if (newValue.sectionType === 'Embedded Template') {
                        if (oldValue.embeddedSections === undefined) {
                            return;
                        }
                    }
                    if (angular.equals(newValue.tinymceOptions, oldValue.tinymceOptions) === false ||
                        angular.equals(newValue.sectionEntityFilters, oldValue.sectionEntityFilters) === false ||
                        angular.equals(newValue.templateTokens, oldValue.templateTokens) === false ||
                        angular.equals(newValue.sectionTokensFormatted, oldValue.sectionTokensFormatted) === false) {
                        return;
                    }
                    // tinymce inserts \n linebreaks in the code for their code view which disrupts the data. Ignore.
                    if ((oldValue.sectionContent.match(/\n/g) || []).length !== (newValue.sectionContent.match(/\n/g) || []).length) {
                        return;
                    }
                    // console.log(angular.toJson(oldValue.sectionContent));
                    // console.log(angular.toJson(newValue.sectionContent));
                    // Need to only do this on subsequent saves to a section
                    if (angular.equals(newValue, oldValue) === false && oldValue.sectionId !== null && oldValue.sectionId !== undefined) {
                        scope.validationErrors.sections[scope.docSection.sectionSequence].sectionSaved = false;
                        scope.btnText.text = 'Save All Sections';
                    }
                }
            }, true);
        }
    };
});

},{}],13:[function(require,module,exports){
angular.module('documentTemplateApp').directive('checkTemplateSaved', function() {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            docTemplate: '=',
            docTemplateIsActive: '=',
            templateClone: '=',
            templateSaved: '='
        },
        link: function(scope) {
            scope.$watch('docTemplate', function(newValue, oldValue) {
                if (!scope.docTemplateIsActive && newValue && oldValue) {
                    if (newValue.templateActive !== oldValue.templateActive) {
                        return;
                    }
                    if (scope.templateClone) {
                        scope.templateSaved.isSaved = true;
                        return;
                    }
                    if (newValue.sections !== undefined && oldValue.sections !== undefined) {
                        if (!angular.equals(newValue.sections, oldValue.sections)) {
                            return;
                        }
                        if (!angular.equals(newValue.templateId, oldValue.templateId)) {
                            return;
                        }
                    }
                    if (!angular.equals(newValue, oldValue)) {
                        //Debugging for warning symbol:
                        // for (var key in newValue) {
                        //     if (!angular.equals(newValue[key], oldValue[key])) {
                        //         console.log(key, ' not equal;');
                        //         console.log(newValue[key], oldValue[key]);
                        //     }
                        // }
                        scope.templateSaved.isSaved = false;
                    }
                }
            },true);
        }
    };
});

},{}],14:[function(require,module,exports){
angular.module('documentTemplateApp').directive('filePreviewEmbedSwf', ['$timeout', function($timeout) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            contentVersionId: '=',
            width: '=',
            height: '='
        },
        link: function(scope, elem, attrs) {
            scope.$watch('contentVersionId', function(newValue) {
                var wrapperHtml = document.createElement("div");
                wrapperHtml.setAttribute('class', 'document-previewer-wrapper');
                wrapperHtml.setAttribute('style', 'padding: 70px 65px; box-shadow: 0 0 4px 1px #d8dde6; border: 1px solid #d8dde6;');

                var contentHtml = document.createElement("div");
                contentHtml.setAttribute('class', 'document-previewer-container');
                
                var mainHtml = document.createElement('div');
                mainHtml.setAttribute('class', 'document-previewer scroller');
                mainHtml.setAttribute('style', 'width: ' + scope.width + '; height: 512px; overflow-y:auto');
                mainHtml.append(contentHtml);

                wrapperHtml.append(mainHtml);

                elem.html(wrapperHtml);
            
                var pages = [];
                var imgSource = '/sfc/servlet.shepherd/version/renditionDownload?rendition=SVGZ&versionId=' + newValue + '&operationContext=CHATTER&page=';
                var retries = 0;

                createThumbnail(0);

                function createThumbnail(page) {
                    scope.$parent.$parent.$parent.vlcLoading = true;
                    var pageContainer = document.createElement("div");
                    pageContainer.setAttribute('class', 'loaded page tall');
                    pageContainer.setAttribute('style', 'border: 1px solid rgb(169,169,169); margin: 10px');
                    var img = document.createElement("img");
                    img.setAttribute('src', imgSource + page);
                    img.setAttribute('class', 'thumbnail');
                
                    img.addEventListener("load", function() {
                        console.log('success on ' + page);
                        scope.$parent.$parent.$parent.vlcLoading = false;
                        scope.$parent.$parent.$parent.$apply();

                        pageContainer.appendChild(img)

                        contentHtml.appendChild(pageContainer);
                        createThumbnail(page + 1);
                    }, false); 
                    
                    img.addEventListener("error", function() {
                        console.log('error loading page ' + page);
                        if (page == 0) {
                            if (retries<3) {
                                retries++;
                                $timeout(function () {
                                    console.log('reloading page ' + page + ', retry ' + retries);
                                    createThumbnail(0);
                                }, 10000 * retries);
                            } else {
                                scope.$parent.$parent.$parent.vlcLoading = false;
                                scope.$parent.$parent.$parent.$apply();

                                var msg = document.createElement("p");
                                var text = document.createTextNode("Preview not yet available. Please refresh the page");
                                msg.appendChild(text);
                                contentHtml.appendChild(msg);
                            }
                        }  else {
                            scope.$parent.$parent.$parent.vlcLoading = false;
                            scope.$parent.$parent.$parent.$apply();
                        }                          
                    }, false); 
                }
            });
        }
    };
}]);

},{}],15:[function(require,module,exports){
angular.module('documentTemplateApp').directive('vlcLoader', function() {
    return {
        restrict: 'E',
        templateNamespace: 'svg',
        replace: true,
        template:
        '<svg x="0px" y="0px" width="28" height="28" viewBox="0 0 48 48">'+
            '<g width="48" height="48">'+
                '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="0.75s" repeatCount="indefinite"/>'+
                '<path fill="#dedede" d="M24,45C12.4,45,3,35.6,3,24S12.4,3,24,3V0l0,0C10.7,0,0,10.7,0,24c0,13.3,10.7,24,24,24V45z"/>'+
                '<path fill="#05a6df" d="M24,3c11.6,0,21,9.4,21,21s-9.4,21-21,21v3l0,0c13.3,0,24-10.7,24-24C48,10.7,37.3,0,24,0V3z"/>'+
            '</g>'+
        '</svg>',
        scope: {
            stroke: '@'
        }                       
    };
});
},{}],16:[function(require,module,exports){
angular.module('documentTemplateApp').factory('EntityFilter', function($rootScope, $timeout, remoteActions, ValidationErrorHandler) {
    'use strict';
    var EntityFilter = function(ctrlScp) {
        $rootScope.entityFilters = {};
        this.stylesheetsNotAdded = true;
        this.nameSpacePrefix = '';
        if (window.nameSpacePrefix !== undefined) {
            this.nameSpacePrefix = window.nameSpacePrefix;
        }
        this.btnDisabled = false;
        this.selectModel = {};

        this.initialize = function() {
            ///this.getEntityFilters();
        };

        // CLM-1083, need to loop over only the document selected applicableItemTypes
        this.formatApplicableItemTypes = function(applicableItemTypes, templateApplicableItemTypesObj) {
            var i, key;
            var self = this;
            this.documentApplicableItemTypes = [];
            for (i = 0; i < applicableItemTypes.length; i++) {
                for (key in templateApplicableItemTypesObj) {
                    if (applicableItemTypes[i].Value === key && templateApplicableItemTypesObj[key]) {
                        self.documentApplicableItemTypes.push({
                            Label: applicableItemTypes[i].Label,
                            Value: applicableItemTypes[i].Value,
                            isActive: applicableItemTypes[i].isActive
                        });
                    }
                }
            }
            console.log('this.documentApplicableItemTypes', this.documentApplicableItemTypes);
        };

        // Show advanced entity filters overlay:
        this.showOverlay = function(section, applicableItemTypes) {
            //Get Entity Filters
            this.getEntityFilters();
            var i, j, k, self;
            self = this;
            ctrlScp.validateSection(section.sectionSequence);
            if (ctrlScp.validationErrors.sections[section.sectionSequence].sectionErrors === false) {
                self.formatApplicableItemTypes(ctrlScp.applicableItemTypes, ctrlScp.templateData.templateApplicableItemTypesObj);
                ctrlScp.entityFilterOverlay.show = true;
                if (section.sectionEntityFilters === undefined) {
                    section.sectionEntityFilters = {};
                }
                $timeout(function() {
                    for (i = 0; i < applicableItemTypes.length; i++) {
                        if (section.sectionEntityFilters !== undefined && section.sectionEntityFilters[applicableItemTypes[i].Label] &&
                            section.sectionEntityFilters[applicableItemTypes[i].Label].Id !== undefined) {
                            // iframe URL does not get saved to DB, so need to create when clicking on the advanced filters link:
                            section.sectionEntityFilters[applicableItemTypes[i].Label].url = location.origin + '/apex/FilterConditionsManager?id=' +
                                section.sectionEntityFilters[applicableItemTypes[i].Label].Id;
                            for (j = 0; j < $rootScope.entityFilters.length; j++) {
                                if (section.sectionEntityFilters[applicableItemTypes[i].Label].Id === $rootScope.entityFilters[j].Id) {
                                    section.sectionEntityFilters[applicableItemTypes[i].Label].Formula = $rootScope.entityFilters[j][self.nameSpacePrefix + 'FormulaForConditions__c'];
                                }
                            }
                        }
                        // Add a default name for each new Entity Filter creation:
                        if (section.sectionEntityFilters[applicableItemTypes[i].Label] === undefined) {
                            section.sectionEntityFilters[applicableItemTypes[i].Label] = {};
                            section.sectionEntityFilters[applicableItemTypes[i].Label].Name = ctrlScp.templateData.templateName + ' - ' + section.sectionName;
                        }
                    }
                }, 2000);

                for (k = 0; k < applicableItemTypes.length; k++) {
                    self.addStylesheetToFrame(applicableItemTypes[k], false);
                }
            }
        };

        this.addStylesheetToFrame = function(applicableItemType, addingNewFilter) {
            var self, i, stylesheets, stylesheet;
            self = this;
            if (addingNewFilter) {
                // console.log('Adding new filter');
                this.stylesheetsNotAdded = true;
            }
            stylesheets = document.getElementsByTagName('link');
            stylesheet = '';
            if (this.stylesheetsNotAdded) {
                // console.log('inside if statement');
                $timeout(function() {
                    // console.log('inside timeout');
                    for (i = 0; i < stylesheets.length; i++) {
                        if (stylesheets[i].href.indexOf('ContractEntityFilterOverrideCss') > -1) {
                            stylesheet = stylesheets[i];
                        }
                    }
                    // console.log('entity-filter-' + applicableItemType.Label);
                    // console.log(document.getElementById('entity-filter-' + applicableItemType.Label));
                    if (document.getElementById('entity-filter-' + applicableItemType.Label) !== null &&
                        ctrlScp.templateData.templateApplicableItemTypesObj[applicableItemType.Value]) {
                        // console.log('applicableItemTypes[j]: ', applicableItemType.Label);
                        // console.log(document.getElementById('entity-filter-' + applicableItemType.Label).contentDocument.head);
                        document.getElementById('entity-filter-' + applicableItemType.Label).contentDocument.head.appendChild(stylesheet.cloneNode(true));
                    }
                    self.stylesheetsNotAdded = false;
                }, 2000);
            }
        };

        this.closeWithOutSaving = function(applicableItemTypes, entityFilterOverlay, section) {
            var filter;
            for (filter in section.sectionEntityFilters) {
                if (ctrlScp.validateEntityFilters.indexOf(filter + ': ' + section.sectionEntityFilters[filter].Name) > -1) {
                    delete section.sectionEntityFilters[filter];
                }
            }
            console.log('sectione entityFitlers: ', section.sectionEntityFilters);
            if (_.isEmpty(section.sectionEntityFilters)) {
                section.sectionConditionType = 'Basic';
            } else {
                section.sectionConditionType = 'Advanced';
            }
            ctrlScp.saveTemplateSection(ctrlScp.checkUniqueName, section.sectionSequence);
            applicableItemTypes.activeType = 'Closed';
            ctrlScp.validateEntityFilters = '';
            entityFilterOverlay.show = !entityFilterOverlay.show;
        };

        // Back to section button:
        this.backToSection = function(applicableItemTypes, entityFilterOverlay, section) {
            var i, j, filter;
            var map = {};
            ctrlScp.validateEntityFilters = '';
            ctrlScp.validationMessage = '';
            if (!this.checkEntityFilters(ctrlScp.templateData.sections[ctrlScp.currentSectionSequence])) {
                ctrlScp.entityFilterOverlay.show = !ctrlScp.entityFilterOverlay.show;
                return;
            }
            for (i = 0; i < applicableItemTypes.length; i++) {
                if (section.sectionEntityFilters[applicableItemTypes[i].Label] && !section.sectionEntityFilters[applicableItemTypes[i].Label].hasOwnProperty('Id')) {
                    delete section.sectionEntityFilters[applicableItemTypes[i].Label];
                } else {
                    for (j = 0; j < $rootScope.entityFilters.length; j++) {
                        if (section.sectionEntityFilters[applicableItemTypes[i].Label] && $rootScope.entityFilters[j].Id === section.sectionEntityFilters[applicableItemTypes[i].Label].Id) {
                            // console.log('1: ', section.sectionEntityFilters[applicableItemTypes[i].Label]);
                            // console.log('2: ', $rootScope.entityFilters[j]);
                            $rootScope.entityFilters[j][this.nameSpacePrefix + 'FormulaForConditions__c'] = section.sectionEntityFilters[applicableItemTypes[i].Label].Formula;
                        }
                    }
                }
            }
            for (filter in section.sectionEntityFilters) {
                map[section.sectionEntityFilters[filter].Id] = ' ' + filter + ': ' + section.sectionEntityFilters[filter].Name;
            }
            remoteActions.isEntityFilterEmpty(Object.keys(map)).then(function(result) {
                var str = [];
                var id;
                for (id in result) {
                    if (result[id] === 0) {
                        str.push(map[id]);
                    }
                }
                if (str.length > 0) {
                    if (str.length === 1) {
                        ctrlScp.validateEntityFilters = str + ' does not contain conditions';
                    } else {
                        ctrlScp.validateEntityFilters = str + ' do not contain conditions';
                    }
                } else {
                    applicableItemTypes.activeType = 'Closed';
                    ctrlScp.validateEntityFilters = '';
                    ctrlScp.saveTemplateSection(ctrlScp.checkUniqueName, section.sectionSequence);
                    entityFilterOverlay.show = !entityFilterOverlay.show;
                    section.sectionConditionType = 'Advanced';
                }
            });
        };

        // Get existing Entity Filters:
        this.getEntityFilters = function() {
            var self, applicableItemTypeList, i;
            self = this;
            applicableItemTypeList = [self.nameSpacePrefix + 'ContractLineItem__c', 'OrderItem', 'QuoteLineItem', 'OpportunityLineItem'];
            remoteActions.getEntityFilters(applicableItemTypeList).then(function(result) {
                $rootScope.entityFilters = result;
                for (i = 0; i < $rootScope.entityFilters.length; i++) {
                    $rootScope.entityFilters[i].FilterOnObjectName = $rootScope.entityFilters[i][self.nameSpacePrefix + 'FilterOnObjectName__c'];
                }
                // console.log('Entity Filters: ', $rootScope.entityFilters);
            }, function(error) {
                self.validationErrorHandler.throwError(error);
            });
        };

        // Only show select dropdown if there are entity's available to select from:
        this.countFiltersForType = function(applicableItemType) {
            var i, counter;
            counter = 0;
            for (i = 0; i < $rootScope.entityFilters.length; i++) {
                if ($rootScope.entityFilters[i][this.nameSpacePrefix + 'FilterOnObjectName__c'].indexOf(applicableItemType.Label) > -1) {
                    counter++;
                }
            }
            return counter;
        };

        // Attach existing filter to item type:
        this.attachExistingFilter = function(section, applicableItemType, entityFilter) {
            if (section.sectionEntityFilters === undefined) {
                section.sectionEntityFilters = {};
            }
            section.sectionEntityFilters[applicableItemType.Label] = {
                'Id': entityFilter.Id,
                'Name': entityFilter.Name,
                'url': location.origin + '/apex/FilterConditionsManager?id=' + entityFilter.Id,
                'Formula': entityFilter[this.nameSpacePrefix + 'FormulaForConditions__c']
            };
            this.addStylesheetToFrame(applicableItemType, true);
            // console.log(entityFilter);
            // console.log('sectionEntityFilters', section.sectionEntityFilters);
        };

        // Create new entity filter:
        this.createEntityFilter = function(sectionEntityFilterItemType, name, applicableItemType) {
            var self, applicableItemTypeLabel;
            self = this;
            // console.log('sectionEntityFilterItemType: ', sectionEntityFilterItemType);
            applicableItemTypeLabel = applicableItemType.Label;
            // console.log('applicableItemTypeLabel: ', applicableItemTypeLabel);
            this.btnDisabled = true;
            if (applicableItemTypeLabel.indexOf('__c' > -1)) {
                applicableItemTypeLabel = this.nameSpacePrefix + applicableItemType.Label;
            }
            remoteActions.createEntityFilter(name, applicableItemType.Label, this.nameSpacePrefix).then(function(result) {
                result.Formula = '';
                sectionEntityFilterItemType.Id = result.Id;
                sectionEntityFilterItemType.url = location.origin + '/apex/FilterConditionsManager?id=' + result.Id;
                sectionEntityFilterItemType.Formula = result.Formula;
                // sectionEntityFilterItemType.FilterOnObjectName = result[self.nameSpacePrefix + 'FilterOnObjectName__c'];
                self.addStylesheetToFrame(applicableItemType, true);
                result.FilterOnObjectName = result[self.nameSpacePrefix + 'FilterOnObjectName__c'];
                // console.log('Entity Filter: ', result);
                $rootScope.entityFilters.push(result);
                self.btnDisabled = false;
                // console.log('Sections: ', ctrlScp.templateData.sections);
            }, function(error) {
                self.validationErrorHandler.throwError(error);
                self.btnDisabled = false;
            });
        };

        // Check if entity filters exist on section:
        this.checkEntityFilters = function(section) {
            var key, filterCount;
            filterCount = 0;
            for (key in section.sectionEntityFilters) {
                if (section.sectionEntityFilters[key].Id) {
                    filterCount++;
                }
            }
            return filterCount;
        };

        // Remove entity filter from applicable item type on current section:
        this.removeEntityFilter = function(section, applicableItemTypeLabel) {
            var key;
            ctrlScp.validateEntityFilters = '';
            ctrlScp.validationMessage = '';
            delete section.sectionEntityFilters[applicableItemTypeLabel];
            for (key in section.sectionEntityFilters) {
                if (!section.sectionEntityFilters[key].Id) {
                    delete section.sectionEntityFilters[key];
                }
            }
            this.selectModel = {};
            ctrlScp.saveTemplateSection(ctrlScp.checkUniqueName, section.sectionSequence);
            if (_.isEmpty(section.sectionEntityFilters)) {
                section.sectionConditionType = 'Basic';
            } else {
                section.sectionConditionType = 'Advanced';
            }
        };

        // Switch back to basic product filters:
        this.switchBackToBasic = function(section) {
            section.sectionConditionType = 'Basic';
            delete section.sectionEntityFilters;
        };

        // Validation Error Handler:
        this.validationErrorHandler = new ValidationErrorHandler();

        // Initialize
        this.initialize();
    };
    return (EntityFilter);
});

},{}],17:[function(require,module,exports){
angular.module('documentTemplateApp').factory('templateTypeService', ['CONST', function(CONST) {
    'use strict';
    return {
        tokenMappingOptions: [{
            label: CONST.OBJECT_BASED
        }, {
            label: CONST.JSON_BASED
        }]
    };
}]);

},{}],18:[function(require,module,exports){
angular.module('documentTemplateApp').factory('ValidationErrorHandler', function(remoteActions, $sldsModal, $rootScope) {
    'use strict';
    var ValidationErrorHandler = function() {
        this.initialize = function() {
            // anything that immediately should fire upon instantiation
        };

        // Error handling helper
        this.throwError = function(error) {
            var statusCode = '';
            if (!error.message) {
                error.message = 'No error message.';
            }
            if (error.statusCode) {
                statusCode = '(' + error.statusCode + '): ';
            }
            if (typeof error.type === 'string') {
                error.type = error.type.capitalizeFirstLetter() + ' ';
            }
            if (error.message.indexOf('Logged in?') > -1) {
                error.message = 'You have been logged out of Salesforce. Please back up any changes to your document and refresh your browser window to login again.';
                error.type = '';
                statusCode = '';
            }
            $sldsModal({
                title: 'There Has Been An Error',
                templateUrl: 'error-handler-modal.tpl.html',
                content: error.type + statusCode + error.message,
                html: true,
                container: 'div.vlocity',
                placement: 'center'
            });
            $rootScope.vlcLoading = false;
        };

        // Adding to String prototype:
        String.prototype.capitalizeFirstLetter = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        // Initialize
        this.initialize();
    };
    return (ValidationErrorHandler);
});

},{}],19:[function(require,module,exports){
(function() {
    'use strict';
    window.angular.module('documentTemplateApp').service('browserDetection', ['$window', function($window) {
        this.userAgent = $window.navigator.userAgent;
        this.browsers = {
            chrome: /chrome/i,
            safari: /safari/i,
            firefox: /firefox/i,
            msielte10: /msie/i,
            msiegt10: /rv:/i,
            edge: /edge/i
        };

        this.detectBrowser = function() {
            var key;
            var userAgent = this.userAgent;
            var browsers = this.browsers;
            for (key in browsers) {
                if (browsers[key].test(userAgent)) {
                    return key;
                }
            }
            return 'unknown';
        };

        this.getBrowserVersion = function() {
            var version, i;
            var browser = this.detectBrowser();
            var userAgent = this.userAgent;
            var versionSearch = [{
                browser: 'chrome',
                before: ' ',
                after: 'Chrome/'
            }, {
                browser: 'safari',
                before: ' ',
                after: 'Version/'
            }, {
                browser: 'firefox',
                before: '',
                after: 'Firefox/'
            }, {
                browser: 'msielte10',
                before: ';',
                after: 'MSIE '
            }, {
                browser: 'msiegt10',
                before: ')',
                after: 'rv:'
            }, {
                browser: 'edge',
                before: '',
                after: 'Edge/'
            }];

            for (i = 0; i < versionSearch.length; i++) {
                if (browser === versionSearch[i].browser) {
                    version = userAgent.split(versionSearch[i].after)[1];
                    if (version && versionSearch[i].before) {
                        version = parseFloat(version.substr(0, version.indexOf(versionSearch[i].before)));
                    }
                }
            }

            return version;
        };
    }]);
}());

},{}],20:[function(require,module,exports){
(function() {
    'use strict';
    window.angular.module('documentTemplateApp').service('documentStylesLibrary', function() {
        this.labels = window.labels;
        this.stylesLibrary = {
            'fontFamily': [{
                    'label': 'Andale Mono',
                    'cssProperty': 'font-family',
                    'style': '\'Andale Mono\', monospace'
                }, {
                    'label': 'Arial',
                    'cssProperty': 'font-family',
                    'style': 'Arial, Helvetica, sans-serif'
                }, {
                    'label': 'Arial Black',
                    'cssProperty': 'font-family',
                    'style': '\'Arial Black\', sans-serif'
                }, {
                    'label': 'Book Antiqua',
                    'cssProperty': 'font-family',
                    'style': '\'Book Antiqua\', palatino, serif'
                }, {
                    'label': 'Comic Sans MS',
                    'cssProperty': 'font-family',
                    'style': '\'Comic Sans MS\', sans-serif'
                }, {
                    'label': 'Courier New',
                    'cssProperty': 'font-family',
                    'style': '\'Courier New\', courier, monospace'
                }, {
                    'label': 'Georgia',
                    'cssProperty': 'font-family',
                    'style': '\'Georgia\', palatino, serif'
                }, {
                    'label': 'Helvetica',
                    'cssProperty': 'font-family',
                    'style': 'Helvetica, Arial, sans-serif'
                }, {
                    'label': 'Impact',
                    'cssProperty': 'font-family',
                    'style': 'Impact, sans-serif'
                }, {
                    'label': 'Symbol',
                    'cssProperty': 'font-family',
                    'style': 'Symbol'
                }, {
                    'label': 'Tahoma',
                    'cssProperty': 'font-family',
                    'style': 'Tahoma, Arial, Helvetica, sans-serif'
                }, {
                    'label': 'Terminal',
                    'cssProperty': 'font-family',
                    'style': 'Terminal, monaco, monospace'
                }, {
                    'label': 'Times New Roman',
                    'cssProperty': 'font-family',
                    'style': '\'Times New Roman\', times, serif'
                }, {
                    'label': 'Trebuchet MS',
                    'cssProperty': 'font-family',
                    'style': '\'Trebuchet MS\', geneva, sans-serif'
                }, {
                    'label': 'Verdana',
                    'cssProperty': 'font-family',
                    'style': 'Verdana, geneva, sans-serif'
                }],
            'fontSize': [{
                    'label': '6pt',
                    'cssProperty': 'font-size',
                    'style': '6pt'
                }, {
                    'label': '7pt',
                    'cssProperty': 'font-size',
                    'style': '7pt'
                }, {
                    'label': '8pt',
                    'cssProperty': 'font-size',
                    'style': '8pt'
                }, {
                    'label': '9pt',
                    'cssProperty': 'font-size',
                    'style': '9pt'
                }, {
                    'label': '10pt',
                    'cssProperty': 'font-size',
                    'style': '10pt'
                }, {
                    'label': '11pt',
                    'cssProperty': 'font-size',
                    'style': '11pt'
                }, {
                    'label': '12pt',
                    'cssProperty': 'font-size',
                    'style': '12pt'
                }, {
                    'label': '14pt',
                    'cssProperty': 'font-size',
                    'style': '14pt'
                }, {
                    'label': '16pt',
                    'cssProperty': 'font-size',
                    'style': '16pt'
                }, {
                    'label': '18pt',
                    'cssProperty': 'font-size',
                    'style': '18pt'
                }, {
                    'label': '20pt',
                    'cssProperty': 'font-size',
                    'style': '20pt'
                }, {
                    'label': '22pt',
                    'cssProperty': 'font-size',
                    'style': '22pt'
                }, {
                    'label': '24pt',
                    'cssProperty': 'font-size',
                    'style': '24pt'
                }, {
                    'label': '30pt',
                    'cssProperty': 'font-size',
                    'style': '30pt'
                }, {
                    'label': '36pt',
                    'cssProperty': 'font-size',
                    'style': '36pt'
                }],
            'fontFormat': [{
                    'label': 'Bold',
                    'cssProperty': 'font-weight',
                    'style': 'bold'
                }, {
                    'label': 'Underline',
                    'cssProperty': 'text-decoration',
                    'style': 'underline'
                }, {
                    'label': 'Italic',
                    'cssProperty': 'font-style',
                    'style': 'italic'
                }],
            'textAlignment': [{
                    'label': 'Left',
                    'cssProperty': 'text-align',
                    'style': 'left'
                }, {
                    'label': 'Center',
                    'cssProperty': 'text-align',
                    'style': 'center'
                }, {
                    'label': 'Right',
                    'cssProperty': 'text-align',
                    'style': 'right'
                }],
            'fontColor': {
                'cssProperty': 'color'
            },
            'backgroundColor': {
                'cssProperty': 'background-color'
            },
            'border': {
                'cssProperty': 'border'
            },
            'textPadding': [{
                    'label': 'None',
                    'cssProperty': 'padding-left',
                    'style': '0px'
                },{
                    'label': '25px',
                    'cssProperty': 'padding-left',
                    'style': '25px'
                },{
                    'label': '50px',
                    'cssProperty': 'padding-left',
                    'style': '50px'
                },{
                    'label': '100px',
                    'cssProperty': 'padding-left',
                    'style': '100px'
                },{
                    'label': '125px',
                    'cssProperty': 'padding-left',
                    'style': '125px'
                },{
                    'label': '150px',
                    'cssProperty': 'padding-left',
                    'style': '150px'
                },{
                    'label': '175px',
                    'cssProperty': 'padding-left',
                    'style': '175px'
                },{
                    'label': '200px',
                    'cssProperty': 'padding-left',
                    'style': '175px'
                }
            ]
        };

        this.headingLevels = [{
            'title': this.labels.CLMTemplateSectionHeading+ ' 1',
            'styles': {
                'font-weight': 'bold',
                'font-family': '\'Times New Roman\', times, serif',
                'font-size': '18pt',
                'text-align': 'left',
                'color': '#000000',
                'padding-left': '0px'
            }
        }, {
            'title': this.labels.CLMTemplateSectionHeading + ' 2',
            'styles': {
                'font-weight': 'bold',
                'font-family': '\'Times New Roman\', times, serif',
                'font-size': '14pt',
                'text-align': 'left',
                'color': '#000000',
                'padding-left': '0px'
            }
        }, {
            'title': this.labels.CLMTemplateSectionHeading + ' 3',
            'styles': {
                'font-weight': 'bold',
                'font-family': '\'Times New Roman\', times, serif',
                'font-size': '12pt',
                'text-align': 'left',
                'color': '#000000',
                'padding-left': '0px'
            }
        }];

        this.itemSectionStyles = [{
            'title': this.labels.CLMTemplateColumnHeader,
            'styles': {
                'font-weight': 'bold',
                'font-family': 'Arial, Helvetica, sans-serif',
                'font-size': '10pt',
                'text-align': 'left',
                'color': '#000000',
                'border': '1px solid #000000'
            }
        }, {
            'title': this.labels.CLMTemplateColumnTokens,
            'styles': {
                'font-weight': 'normal',
                'font-family': 'Arial, Helvetica, sans-serif',
                'font-size': '10pt',
                'text-align': 'left',
                'color': '#000000',
                'border': '1px solid #000000'
            }
        }, {
            'title': this.labels.CLMTemplateTotalTokens,
            'styles': {
                'font-weight': 'normal',
                'font-family': 'Arial, Helvetica, sans-serif',
                'font-size': '10pt',
                'text-align': 'left',
                'color': '#000000',
                'border': '1px solid #000000'
            }
        }];
    });
}());
},{}],21:[function(require,module,exports){
angular.module("documentTemplateApp").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("signature-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n            <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium">{{modalLabels.CLMTemplatePickSignerRole}}</h4>\n        </div>\n        <div class="slds-modal__content">\n            <div class="slds-form-element slds-p-top_small slds-p-horizontal_small">\n                <label class="slds-form-element__label" for="image-select-01">{{modalLabels.CLMTemplateAnchorString}}</label>\n                <div class="slds-form-element__control">\n                    <div class="slds-select_container">   \n                        <select ng-model="selectedAnchorString" id="image-select-01" class="slds-select"\n                                ng-options="anchorString.type for anchorString in  anchorSelectList">\n                        </select> \n                    </div>\n                </div>\n            </div>\n            <div class="slds-form-element slds-p-around_small">\n                <label class="slds-form-element__label" for="image-select-02">{{modalLabels.CLMTemplateSignerRoles}}</label>\n                <div class="slds-form-element__control">\n                    <div class="slds-select_container">               \n                        <select ng-model="selectedSignerRole" id="image-select-02" class="slds-select"\n                                ng-options="signerRole.label for signerRole in  signerRoles">\n                        </select>\n                    </div>\n                </div>\n            </div>\n        </div>            \n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="insert()">{{modalLabels.CLMTemplateInsert}}</button> \n            <button type="button" class="slds-button slds-button_neutral" ng-click="closeModal()">{{modalLabels.CLMClauseClose}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>'),$templateCache.put("template-detail-modal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_large">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide(); hideProperties()">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n                <span class="slds-assistive-text">{{modalLabels.CLMClauseClose}}</span>\n            </button>\n            <h2 class="slds-text-heading_medium">\n                {{modalLabels.CLMTemplateTemplateDetails}}\n            </h2>   \n        </div>\n        <div ng-if="validationMessage" class="slds-notify_container" style="position: relative">\n            <div class="slds-notify slds-notify_alert slds-theme_success slds-theme_alert-texture" role="alert">\n                <i class="contract-icon icon icon-v-close-circle slds-float_right" ng-click="closeSuccessBanner()"></i>\n                  <h2>{{validationMessage}}</h2>\n            </div>\n        </div>    \n         <div ng-if="validationErrorMessage" class="slds-notify_container" style="position: relative">\n            <div class="slds-notify slds-notify_alert slds-theme_error slds-theme_alert-texture" role="alert">\n               <i class="contract-icon icon icon-v-close-circle slds-float_right" ng-click="closeSuccessBanner()"></i>\n              <h2>{{validationErrorMessage}}</h2>\n            </div>\n        </div>   \n        <div class="slds-modal__content slds-p-around_medium">\n            <check-template-saved class="slds-grid slds-wrap slds-grid_pull-padded template-properties slds-margin-top_medium" doc-template="templateData" template-saved="templateSaved" template-clone="cloningTemplate">\n\n            \x3c!--ROW 1: Template Name / Active--\x3e\n            <div class="slds-form-element slds-p-around_small slds-size_3-of-4" ng-class="{\'has-error\': validationErrors.templateName}">\n                <div ng-if="validationErrors.templateName" class="slds-popover slds-nubbin_bottom-left slds-theme_error" role="alert" aria-live="polite" style="width: auto;margin-top: 5px;top: -10px">\n                    <div class="slds-popover__body slds-text-longform">\n                      <p>{{validationErrors.templateName}}</p>\n                    </div>\n                </div>\n                <div>\n                    <label class="slds-form-element__label" for="template-name">{{fieldlabels.template.Name}}</label>\n                </div>\n                <div class="slds-form-element__control">\n                    <input id="template-name" class="slds-input" type="text" ng-model="templateData.templateName" placeholder="Enter the Template Name" ng-disabled="templateActive" />\n                </div>\n            </div>\n            <div class="slds-form-element slds-p-around_small slds-size_1-of-4 slds-text-align_center">\n                <label class="slds-form-element__label" for="template-name">{{modalLabels.CLMTemplateActive}}</label>\n                <div class="slds-form-element__control">\n                  <label class="slds-checkbox">\n                      <input type="checkbox" id="templateIsActive" ng-model="templateData.templateActive" ng-disabled="templateActive" />\n                      <span class="slds-checkbox_faux"></span>\n                      <span class="slds-form-element__label">{{fieldlabels.template[nameSpacePrefix + \'VersionNumber__c\']}} {{templateData.templateVersion}}</span>\n                  </label>\n                </div>\n            </div>\n\n            \x3c!--ROW 2: Template Options--\x3e\n                 <div class="slds-form-element slds-p-around_small slds-size_1-of-3" ng-class="{\'has-error\': validationErrors.templateApplicableTypes}">\n                    <div ng-if="validationErrors.templateApplicableTypes" class="slds-popover slds-nubbin_bottom-left slds-theme_error" role="alert" aria-live="polite" style="top: 10px;width: auto;top: -10px">\n                        <div class="slds-popover__body slds-text-longform">\n                          <p>{{validationErrors.templateApplicableTypes}}</p>\n                        </div>\n                    </div>\n                    <div>\n                        <label class="slds-form-element__label">{{fieldlabels.template[nameSpacePrefix + \'ApplicableTypes__c\']}}</label>\n                    </div>\n                     <div class="slds-form-element__control">\n                      <label class="slds-checkbox" ng-repeat="applicableType in applicableTypes">\n                          <input type="checkbox" ng-value="applicableType.Value" ng-model="templateData.templateApplicableTypesObj[applicableType.Value]" ng-disabled="templateActive"/>\n                          <span class="slds-checkbox_faux"></span>\n                          <span class="slds-form-element__label">{{applicableType.Label}}</span>\n                      </label>    \n                    </div>\n                </div>\n                <div class="slds-form-element slds-p-around_small slds-size_1-of-3" ng-class="{\'has-error\': validationErrors.templateApplicableTypes}">\n                    <div ng-if="validationErrors.templateApplicableItemTypes && !validationErrors.templateApplicableTypes" class="slds-popover slds-nubbin_bottom-left slds-theme_error" role="alert" aria-live="polite" style="top: 10px;width: auto;left: 31%; margin-left: -6px;">\n                        <div class="slds-popover__body slds-text-longform">\n                          <p>{{validationErrors.templateApplicableItemTypes}}</p>\n                        </div>\n                    </div>\n                    <div ng-class="{\'slds-m-top_x-large\' : validationErrors.templateApplicableTypes}">\n                    <label class="slds-form-element__label">{{fieldlabels.template[nameSpacePrefix + \'ApplicableItemTypes__c\']}}</label>\n                    </div>\n                     <div class="slds-form-element__control">\n                        <label class="slds-checkbox" ng-repeat="applicableItemType in applicableItemTypes">\n                            <input type="checkbox" ng-value="applicableLineItemType.Value" ng-model="templateData.templateApplicableItemTypesObj[applicableItemType.Value]" ng-disabled="templateActive"/>\n                             <span class="slds-checkbox_faux"></span>\n                             <span class="slds-form-element__label">{{applicableItemType.Label}}</span>\n                        </label>\n                    </div>\n                </div>\n                <div class="slds-form-element slds-p-around_small slds-size_1-of-3">\n                      <div ng-if="validationErrors.templateTrackRedlines" class="slds-popover slds-nubbin_bottom-left slds-theme_error" role="alert" aria-live="polite" style="top: 10px;width: auto;">\n                          <div class="slds-popover__body slds-text-longform">\n                            <p>{{validationErrors.templateTrackRedlines}}</p>\n                          </div>\n                      </div>\n                      <div ng-class="{\'slds-m-top_x-large\' : validationErrors.templateApplicableTypes}" class="slds-form-element inline-checkboxes track-redlines" ng-show="trackRedlinesSetting"> \n                          <label class="slds-form-element__label">{{fieldlabels.template[nameSpacePrefix + \'TrackContractRedlines__c\']}}</label>\n                           <div class="slds-form-element__control">\n                              <label class="slds-checkbox">\n                              <input type="checkbox" ng-model="templateData.templateTrackRedlines" ng-disabled="templateActive" />\n                              <span class="slds-checkbox_faux"></span>\n                              <span class="slds-form-element__label">{{fieldlabels.CLMTemplateTrackRedlines}}</span>\n                              </label>\n                         </div>\n                      </div>\n                      <div class="slds-form-element__control slds-p-top_medium">\n                        <label class="slds-form-element__label">{{fieldlabels.template[nameSpacePrefix + \'IsSignatureRequired__c\']}}</label>\n                        <label class="slds-checkbox">\n                            <input type="checkbox" ng-value="templateData.templateSignature" ng-model="templateData.templateSignature"  ng-disabled="templateActive"/>\n                             <span class="slds-checkbox_faux"></span>\n                             <span class="slds-form-element__label">{{modalLabels.CLMTemplateSignatureRequired}}</span>\n                        </label>\n                      </div>\n                  </div>\n\n                \x3c!--Row 3: Contract Type Tags--\x3e \n\n                  <div ng-hide="!templateData.templateApplicableTypesObj.Contract" class="slds-p-horizontal_small slds-size_1-of-1">\n                    <div class="form-group inline-checkboxes contract-types check-box" ng-if="templateData.isDefaultContractType" ng-class="{\'hide-element\': !templateData.templateApplicableTypesObj.Contract}">\n                       <label class="slds-form-element__label">{{modalLabels.CLMTemplateRestrictTemplateToContractTypes}}\n                       <a class="switch" ng-click="switchToCustom()" ng-hide="templateActive || templateArchived"><i class="icon icon-v-filter"></i>{{modalLabels.CLMTemplateSpecifyContractTypes}}</a>\n                      <div class="slds-form-element__control" ng-if="templateData.isDefaultContractType">\n                          <label class="slds-checkbox">\n                            <input ng-disabled="templateActive || templateArchived" id="clause-contract-type" type="checkbox" ng-model="templateData.isDefaultContractType" />\n                             <span class="slds-checkbox_faux"></span>\n                            <span class="slds-form-element__label">{{modalLabels.CLMTemplateAllContractTypes}}</span>\n                        </label>\n                      </div>\n                      </label>\n                  </div>\n                  <div ng-hide="!templateData.templateApplicableTypesObj.Contract" class="form-group inline-checkboxes contract-types" ng-if="!templateData.isDefaultContractType" ng-class="{\'hide-element\': !templateData.templateApplicableTypesObj.Contract}">\n                      <label class="slds-form-element__label" for="clause-contract-type">\n                           {{modalLabels.CLMTemplateRestrictTemplateToContractTypes}}\n                           <a class="switch" ng-click="switchToDefault()" ng-hide="templateActive || templateArchived"><i class="icon icon-v-forward"></i>{{modalLabels.CLMTemplateSwitchToDefault}}</a>\n                      </label>\n                       <tags-input ng-model="selectedContractTypes" ng-class="templateActive || templateArchived ? \'toolbar-readonly\' : \'\'" min-length="1" placeholder="Search to see available contract types" on-tag-added="addContractType($tag)" on-tag-removed="removeContractType($tag)" add-From-Autocomplete-Only="true" replace-spaces-with-dashes="false" allow-Duplicates="false" show-tag="true">\n                          <auto-complete source="searchContractTypeList($query)" max-results-to-show="10" min-length="1"></auto-complete>\n                      </tags-input>\n                  </div>\n                </div>\n\n                \x3c!-- Row 4: Document Styles --\x3e \n\n                <div class="panel-group level-styling vlc-accordion slds-m-horizontal_medium" ng-model="documentStyles.activePanel" bs-collapse="true" start-collapsed="true">\n                    <div class="panel" ng-class="{\'is-open\': !documentStyles.activePanel}">\n                        <div class="panel-heading" role="tab">\n                            <h4 class="slds-text-heading_small"><a bs-collapse-toggle="0">{{modalLabels.CLMTemplateEditDocumentDefaultStyling}} <i class="icon icon-v-right-caret"></i></a></h4>\n                        </div>\n                    </div>\n                        <div class="panel-collapse" role="tabpanel" bs-collapse-target="true">\n                            <div class="slds-grid slds-wrap slds-grid slds-wrap slds-m-around_small">\n                                <div class="slds-p-horizontal_small slds-size_1-of-2">\n                                    <div class="slds-form-element section-font-family">\n                                        <label class="slds-form-element__label" for="section-{{$index+1}}-font-family">{{modalLabels.CLMTemplateDefaultFontFamilyDocument}}</label>\n                                        <div class="slds-form-element__control">\n                                            <select class="slds-input" id="section-{{$index+1}}-font-family" ng-model="templateData.templateDocumentFontStyle" ng-options="fontFamily.style as fontFamily.label for fontFamily in stylesLibrary.fontFamily" ng-change="updateHeaderStyles()" ng-disabled="templateActive"></select>\n                                        </div>\n                                    </div>\n                                    \x3c!-- <pre>{{templateData.templateDocumentFontStyle}}</pre> --\x3e\n                                </div>\n                                <div class="slds-p-horizontal_small slds-m-top_small slds-size_1-of-1">\n                                    <label class="slds-form-element__label">{{modalLabels.CLMTemplateDefineStyleEachSectionHeading}}</label>\n                                </div>\n                            <div class="slds-p-horizontal_small slds-size_1-of-1">\n                                <div slds-tabs="sldsTabs" slds-active-pane="tabs.activeLevel" template="SldsTabsScoped.tpl.html">\n                                    <div ng-repeat="level in templateData.templateSectionHeaderDisplayStyleObj.headingLevels" data-title="{{level.title}}" name="{{level.title}}" slds-pane="sldsPane" class="slds-clearfix slds-grid slds-wrap slds-grid_pull-padded">\n                                    <div class="slds-theme_shade slds-p-around_small slds-m-horizontal_small">\n                                        <div class="slds-form-element__label" ng-style="level.styles">{{modalLabels.CLMTemplateSample}} {{level.title}} {{modalLabels.CLMTemplateText}}</div>\n                                        </div>\n                                        <div class="slds-p-around_small slds-size_1-of-1">\n                                            <div class="slds-grid">\n                                                <div class="slds-p-horizontal_small slds-size_1-of-3">\n                                                    <div class="slds-form-element level-font-family">\n                                                        <label class="slds-form-element__label" for="level-{{$index+1}}-font-family">{{modalLabels.CLMTemplateFontFamily}}</label>\n                                                        <select class="slds-input" id="level-{{$index+1}}-font-family" ng-model="level.styles[stylesLibrary.fontFamily[0].cssProperty]" ng-options="fontFamily.style as fontFamily.label for fontFamily in stylesLibrary.fontFamily" ng-disabled="templateActive"></select>\n                                                    </div>\n                                                </div>\n                                                <div class="slds-p-horizontal_small slds-size_1-of-3">\n                                                    <div class="slds-form-element level-font-size">\n                                                        <label class="slds-form-element__label" for="level-{{$index+1}}-font-size">{{modalLabels.CLMTemplateFontSize}}</label>\n                                                        <select class="slds-input" id="level-{{$index+1}}-font-size" ng-model="level.styles[stylesLibrary.fontSize[0].cssProperty]" ng-options="fontSize.style as fontSize.label for fontSize in stylesLibrary.fontSize" ng-disabled="templateActive"></select>\n                                                    </div>\n                                                </div>\n                                                <div class="slds-p-horizontal_small slds-size_1-of-3">\n                                                    <div class="slds-form-element level-font-color">\n                                                        <label class="slds-form-element__label" for="level-{{$index+1}}-font-color">{{modalLabels.CLMTemplateFontColor}}</label>\n                                                        <input type="text" class="slds-input" id="level-{{$index+1}}-font-color" placeholder="i.e. #FF0000 or red" ng-model="level.styles[stylesLibrary.fontColor.cssProperty]" ng-disabled="templateActive"/>\n                                                    </div>\n                                                </div>\n                                            <div class="slds-p-horizontal_small slds-size_1-of-3">\n                                                <label class="slds-form-element__label">{{modalLabels.CLMTemplateSelectAllFontFormatsToApply}}</label>\n                                                <div class="slds-form-element__control">\n                                                  <label class="slds-checkbox" ng-repeat="fontFormat in stylesLibrary.fontFormat">\n                                                      <input type="checkbox" ng-model="level.styles[fontFormat.cssProperty]" ng-true-value="\'{{fontFormat.style}}\'" ng-disabled="templateActive"/>\n                                                      <span class="slds-checkbox_faux"></span>\n                                                      <span class="slds-form-element__label">{{fontFormat.label}}</span>\n                                                  </label>    \n                                                </div>\n                                            </div>\n                                            <div class="slsds-p-horizontal_small slds-size_1-of-3">\n                                                <fieldset class="slds-form-element">\n                                                <label class="slds-form-element__label">{{modalLabels.CLMTemplateSelectTextAlignment}}</label>\n                                                <div class="slds-form-element__control" ng-repeat="textAlignment in stylesLibrary.textAlignment">\n                                                    <span class="slds-radio">\n                                                        <label class="slds-radio__label" for="owner-{{$parent.$index}}-{{$index}}">\n                                                            <input type="radio"  name="textAlignmentOptions-{{$parent.$index}}" id="owner-{{$parent.$index}}-{{$index}}" value="{{textAlignment.style}}" ng-model="level.styles[textAlignment.cssProperty]"/>\n                                                            <span class="slds-radio_faux"></span>\n                                                        <span class="slds-form-element__label">{{textAlignment.label}}</span>\n                                                    </label>\n                                                    </span>\n                                                </div>\n                                            </fieldset>\n                                            </div>\n\n                                            <div class="slds-p-horizontal_small slds-size_1-of-3"> \n                                               <div class="slds-form-element level-padding">\n                                                    <label class="slds-form-element__label" for="level-{{$index+1}}-font-size">{{modalLabels.CLMTemplateSelectIndentation}}</label>\n                                                    <select class="slds-input" id="level-{{$index+1}}-padding" ng-model="level.styles[stylesLibrary.textPadding[0].cssProperty]" ng-options="textPadding.style as textPadding.label for textPadding in stylesLibrary.textPadding" ng-disabled="templateActive"></select>\n                                                </div>\n                                            </div>\n                                            \n                                        \x3c!-- <pre>{{level.styles}}</pre> --\x3e\n                                    </div>\n                                </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </check-template-saved>\n            </div>\n        </div>\n    </div>\n     <div class="slds-modal__footer">\n            <button class="slds-button slds-button_neutral"  ng-class="{\'active\': showTemplates}" ng-if="templates.length && !templateData.templateId">\n                <a class="existing-templates" ng-click="$hide(); showSavedTemplates()">{{modalLabels.CLMTemplateCloneExistingTemplate}}</a>\n            </button>\n            <button ng-if="cloningTemplate" type="button" class="slds-button slds-float_right" ng-click="refresh()">{{modalLabels.CLMTemplateClearClone}}</button>\n            <button class="slds-button slds-button_neutral" ng-click="$hide(); hideProperties()">{{modalLabels.CLMTemplateCancel}}\n                <span ng-show="!templateSaved.isSaved" data-placement="left"> <slds-button-svg-icon id="warning-btn" sprite="\'utility\'" icon="\'warning\'" size="\'small\'" extra-classes="\'slds-button__icon_left\'"></slds-button-svg-icon></span>\n            </button>\n            <button  ng-if="templateActive" type="button" class="slds-button slds-button_neutral" ng-hide="templateArchived" ng-click="deactivateTemplate(templateData)">{{modalLabels.CLMTemplateDeactivateTemplate}}</button>\n            <button  ng-if="templateActive" type="button" class="slds-button slds-button_neutral" ng-click="createNewVersion()" ng-disabled="isCreatingNewVersion">{{modalLabels.CLMTemplateCreateNewVersion}}</button>\n            <button ng-if="(!cloningTemplate && !templateActive)" type="button" class="slds-button slds-button_brand" ng-click="saveTemplate(checkUniqueName)" ng-disabled="validationErrorMessage">{{modalLabels.CLMTemplateSaveTemplateDetails}}</button> \n            <button ng-if="(cloningTemplate && !templateActive)" type="button" class="slds-button slds-button_brand" ng-click="saveTemplate(checkUniqueName)">{{modalLabels.CLMTemplateCloneTemplate}}</button> \n\n    </div>\n</div>\n'),$templateCache.put("confirm-delete-template-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide()">\n                <slds-svg-icon sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium">{{modalLabels.CLMTemplateDeleteTemplate}}</h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{modalLabels.CLMClauseAreYouSureDeleteTemplate}} \'{{templateData.templateName}}\'?</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="$hide()">{{modalLabels.CLMTemplateCancel}}</button>\n            <button type="button" class="slds-button slds-button_destructive" ng-click="deleteTemplate(templateData); $hide();">{{modalLabels.CLMTemplateDeleteTemplate}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n'),$templateCache.put("error-handler-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium" ng-bind-html="title">{{modalLabels.CLMTemplateDeleteSection}}</h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <div class="slds-notify_container">\n                    <div class="slds-notify slds-notify_alert slds-theme_error slds-theme_alert-texture" role="alert">\n                        <span class="slds-assistive-text">Error</span>\n                        <h2>\n                            <slds-svg-icon sprite="\'utility\'" icon="\'ban\'" size="\'small\'" extra-classes="\'slds-m-right_x-small\'"></slds-svg-icon>\n                            {{content}}\n                        </h2>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="$hide()">Close</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n'),$templateCache.put("component/dropzone.tpl.html",'<div class="dropzone-container">\n    <div id="dropzone" class="dropzone">\n        <div class="dz-message">\n            <p>\n                <span class="slds-icon_container" title="Upload">\n                    <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" extra-classes="\'slds-icon-text-default\'" icon="\'upload\'"></slds-svg-icon>\n                    <span class="slds-assistive-text">Upload</span>\n                </span>&nbsp;\n                {{$parent.labels.CLMContractDocDragDropFiles}}<br/>\n                <input type=\'button\' class="version-browse-files" ng-value="$parent.labels.CLMContractDocBrowse"/>\n                {{$parent.labels.CLMTemplateDocMaxFileSize}}\n            </p>\n        </div>\n        <div ng-if="hasClauseTokens" class="file-details height-parent-container">\n            <div class="slds-clearfix slds-text-heading_small slds-m-bottom_small">\n                {{modalLabels.CLMTemplateClauseTokenFoundMessage}}\n            </div>\n            <div class="slds-clearfix slds-text-heading_small slds-m-bottom_small"> {{modalLabels.CLMTemplateClickNext}} </div>\n            <div>\n                <button  type="button" id="cancelLoad" class="slds-button slds-button_neutral"\n                    ng-click="cancelFileLoad(file)">\n                    {{modalLabels.CLMTemplateCancel}}\n                </button>\n                \n                <button type="button" class="slds-button slds-button_neutral"\n                    ng-click="processClauseTokens(fileContent,file,zip)">\n                    {{modalLabels.CLMTemplateNext}}\n                </button>\n            </div>\n        </div>\n    </div>\n</div>'),$templateCache.put("component/webTemplateType.tpl.html",'<div class="vloc-web-template-type"> \n    <div class="vlocity via-slds document-template" via-affix="top" via-screen-height="viaScreenHeight">\n        <div class="slds-spinner_container" ng-show="vlcLoading">\n            <div class="slds-spinner slds-spinner_brand slds-spinner_large" aria-hidden="false" role="status">\n                <div class="slds-spinner__dot-a"></div>\n                <div class="slds-spinner__dot-b"></div>\n            </div>\n        </div>\n        <div class="container">\n            \x3c!-- PAGE HEADER --\x3e\n            <div class="slds-page-header custom-header" role="banner">\n                <div class="slds-grid slds-grid_vertical-align-center">\n                    <div class="slds-size_1-of-3" role="banner">\n                        <div id="template-page-header_media" class="slds-media slds-no-space slds-grow">\n                            <div id="clause-page-header_media_fiure" class="slds-media__figure">\n                              <svg aria-hidden="true" class="slds-icon slds-icon-standard-post" ng-class="{\'slds-icon-standard-task\' : templateActive}">\n                                <slds-svg-icon ng-if="!templateActive && (!cloningTemplate || leftColHeader == \'Start New Template\')" id="clause-page-header_icon" sprite="\'custom\'" icon="\'custom18\'" size="\'medium\'" ></slds-svg-icon>\n                                <slds-svg-icon ng-if="templateActive" id="clause-page-header_icon" sprite="\'custom\'" icon="\'custom77\'" size="\'medium\'"></slds-svg-icon>\n                                <slds-svg-icon ng-if="cloningTemplate && leftColHeader !== \'Start New Template\' && !templateActive" id="clause-page-header_icon" sprite="\'custom\'" icon="\'custom18\'" size="\'medium\'"></slds-svg-icon>\n                                </svg>\n                            </div>\n                            <div class="slds-media__body" id="clause-page-header_media_body">\n                                <h1 ng-if="!templateData.templateActive" id="clause-page-header_media_body2" class="slds-page-header__title custom slds-m-right_small slds-align-middle slds-truncate">{{leftColHeader}}</h1>\n                                <h1 ng-if="templateData.templateActive" id="clause-page-header_media_body2" class="slds-page-header__title custom slds-m-right_small slds-align-middle slds-truncate" >{{labels.CLMTemplateViewing}} "{{templateData.templateName}}"</h1>\n                                <p id="clause-page-header_media_body1" class="slds-text-heading_label slds-line-height_reset">\n                                    {{modalLabels.CLMTemplateVersion}} {{templateData.templateVersion}}\n                                    <span ng-if="!templateData.templateId && templateData.templateType !== \'Select Template Type\'"> • {{templateData.templateType}}</span>\n                                </p>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="slds-size_2-of-3">\n                        <div class="slds-float_right slds-m-left_small">\n                            <button ng-if="(settingsFilterOverlay.show && !cloningTemplate && !templateActive)" type="button" class="slds-button slds-button_brand" ng-click="saveTemplate(checkUniqueName)" ng-disabled="validationErrorMessage">{{modalLabels.CLMTemplateSaveTemplateDetails}} \n                                <span ng-show="!templateSaved.isSaved && settingsFilterOverlay.show" data-placement="left"> <slds-button-svg-icon id="warning-btn" sprite="\'utility\'" icon="\'warning\'" size="\'medium\'" extra-classes="\'slds-m-bottom_xx-small\'"></slds-button-svg-icon></span>\n                            </button> \n                            <button ng-if="(settingsFilterOverlay.show && cloningTemplate && !templateActive)" type="button" class="slds-button slds-button_brand" ng-click="saveTemplate(checkUniqueName)">\n                                {{modalLabels.CLMTemplateCloneTemplate}}\n                            </button> \n                            <button ng-if="templateActive" type="button" class="slds-button slds-button_brand" ng-click="createNewVersion(templateData.templateId)" ng-disabled="isCreatingNewVersion">\n                                {{modalLabels.CLMTemplateCreateNewVersion}}\n                            </button>\n                        </div>\n                        <div class="slds-button-group slds-float_right" role="group" ng-show="entityFilterOverlay.show">\n                            <button class="slds-button slds-button_neutral" ng-show="entityFilterOverlay.show" ng-click="entityFilter.backToSection(applicableItemTypes, entityFilterOverlay, templateData.sections[currentSectionSequence])">\n                                <slds-button-svg-icon id="edit-details-btn" sprite="\'utility\'" icon="\'back\'" size="\'small\'" extra-classes="\'slds-button__icon_left\'"></slds-button-svg-icon>\n                                {{labels.CLMTemplateBackToSection}}\n                            </button>\n                        </div>\n                        <div class="slds-button-group slds-float_right" role="group" ng-hide="entityFilterOverlay.show">\n                            <button class="slds-button slds-button_neutral" ng-click="goToTemplateOverview()">\n                                <slds-button-svg-icon id="back-to-contract" sprite="\'utility\'" icon="\'back\'" size="\'small\'" extra-classes="\'slds-button__icon_left\'"></slds-button-svg-icon>\n                                {{labels.CLMTemplateBackToList}}\n                            </button>\n                            <button ng-if="settingsFilterOverlay.show && templateData.templateId" class="slds-button slds-button_neutral" ng-click="$hide(); hideProperties(); settingsFilterOverlay.show = false">\n                            {{labels.CLMTemplateBackToSection}}\n                            </button>\n                            <button class="slds-button slds-button_neutral" ng-init="getTemplateStatus()" ng-click="editTemplateProperties()" ng-if="!settingsFilterOverlay.show">\n                                <span ng-if="!templateActive">{{modalLabels.CLMTemplateEdit}}</span><span ng-if="templateActive">{{labels.CLMTemplateViewSettings}}</span>\n                            </button>\n                            <button ng-if="templateActive" type="button" class="slds-button slds-button_neutral" ng-click="cloneTemplate(templateData.templateId)">\n                                {{modalLabels.CLMTemplateCloneTemplate}}\n                            </button>\n                            <button ng-if="!templateActive && templateData.templateId" type="button" class="slds-button slds-button_neutral" ng-hide="templateArchived" ng-click="templateData.templateActive = true; saveTemplate(checkUniqueName);" ng-disabled="saveAllSectionsBtn.text === \'Save All Sections\'">\n                                {{labels.CLMTemplateActivate}}\n                            </button>\n                            <button ng-if="templateActive && !templateArchived" type="button" class="slds-button slds-button_neutral" ng-click="deactivateTemplate(templateData)">\n                                {{modalLabels.CLMTemplateDeactivateTemplate}}\n                            </button>\n                            <button ng-if="!templateActive && !cloningTemplate && templateData.templateId && !settingsFilterOverlay.show" class="slds-button slds-button_neutral" ng-click="saveAllSections(true)" ng-disabled="saveAllSectionsBtn.text === \'All Sections Saved\'" type="button">\n                                <span ng-if="saveAllSectionsBtn.text === \'All Sections Saved\'">{{labels.CLMTemplateAllSectionsSaved}}</span><span ng-if="saveAllSectionsBtn.text !== \'All Sections Saved\'">{{labels.CLMTemplateSaveAllSections}}</span>\n                            </button>\n                            \x3c!-- <button class="slds-button slds-button_neutral" ng-class="{\'active\': showTemplates}" ng-if="!templateData.templateId && !cloningTemplate" ng-click="showSavedTemplates()">{{modalLabels.CLMTemplateCloneExistingTemplate}}</button> --\x3e\n                            <button ng-if="cloningTemplate" type="button" class="slds-button slds-button_neutral" ng-click="refresh()">{{modalLabels.CLMTemplateClearClone}}</button>\n                            <button ng-if="!settingsFilterOverlay.show && !templateActive" class="slds-button slds-button_icon-border-filled" aria-haspopup="true" title="Show More" ng-click="showDropDown()">\n                                <slds-svg-icon id="drop-down-icon" sprite="\'utility\'" icon="\'down\'" size="\'x-small\'" style="fill: rgb(84, 105, 141)"></slds-svg-icon>\n                            </button>\n                            <button ng-if="(templateActive && templateData.templateId) || (settingsFilterOverlay.show && templateData.templateId)" class="slds-button slds-button_neutral" ng-click="confirmDeleteTemplate()">\n                                <span class="slds-truncate">{{modalLabels.CLMTemplateDeleteTemplate}}</span>\n                            </button>\n                            <button ng-if="settingsFilterOverlay.show && canTestTemplate(templateData)" class="slds-button slds-button_neutral" ng-click="testTemplate(templateData)">\n                                <span class="slds-truncate">{{modalLabels.CLMTemplateTestTemplate}}</span>\n                            </button>\n                            <div class="slds-dropdown slds-dropdown_right ng-scope slds-m-top_x-large slds-m-right_large" ng-if="showMore && !settingsFilterOverlay.show">\n                                <ul class="slds-dropdown__list" role="menu">\n                                    <li class="slds-dropdown__item" role="presentation" ng-if="templateData.templateId">\n                                        <a role="menuitem" ng-hide="templateArchived" ng-click="confirmDeleteTemplate()"><span class="slds-truncate">{{modalLabels.CLMTemplateDeleteTemplate}}</span></a>\n                                        <a role="menuitem" ng-hide="templateArchived" ng-click="testTemplate(templateData)" ng-if="canTestTemplate(templateData)"><span class="slds-truncate">{{modalLabels.CLMTemplateTestTemplate}}</span></a>\n                                    </li>\n                                </ul>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            \x3c!-- VALIDATION MESSAGES --\x3e\n            <div ng-if="validationMessage" class="slds-notify_container custom">\n                <div class="slds-notify slds-notify_alert slds-theme_success slds-theme_alert-texture" role="alert">\n                    <i class="contract-icon icon icon-v-close-circle" ng-click="closeSuccessBanner()"></i>\n                    <h2>{{validationMessage}}</h2>\n                </div>\n            </div>\n            <div ng-if="validationErrorMessage" class="slds-notify_container custom">\n                <div class="slds-notify slds-notify_alert slds-theme_error slds-theme_alert-texture" role="alert">\n                    <i class="contract-icon icon icon-v-close-circle" ng-click="closeSuccessBanner()"></i>\n                    <h2>{{validationErrorMessage}}</h2>\n                </div>\n            </div>\n            <div ng-if="templateDeactivateErrorMsg" class="slds-notify slds-notify_alert slds-theme_error slds-theme_alert-texture" role="alert" ng-bind-html="templateDeactivateErrorMsg" ng-click="clearTemplateDeactivateErrorMsg()">\n            </div>\n            \x3c!-- PAGE CONTENT --\x3e\n            <div class="three-col-body center-collapsed" ng-init="collapseCenter = true" ng-class="{\'center-collapsed\': collapseCenter}">\n                <div class="left-col template" ng-if="!cloningTemplate">\n                    <div class="col-body template">\n                        <div class="body-header slds-has-divider_bottom">\n                            <p class="slds-text-heading_label col-header-text">{{labels.CLMTemplateDocumentSections}}</p>\n                        </div>\n                        <ul class="new-buttons-container">\n                            <li ng-class="{\'active\': newSection}" ng-if="templateData.templateId && !templateActive">\n                                <a class="new-section-btn" ng-click="addNewSection()">{{labels.CLMTemplateAddNewSection}}<i class="contract-icon icon icon-v-right-caret"></i></a>\n                            </li>\n                        </ul>\n                        <ul ng-if="templateData.sections.length" class="existing-data draggable-items" dnd-list="templateData.sections" dnd-dragover="startDragging(event)">\n                            <li ng-repeat="section in templateData.sections" ng-click="showSectionData(section.sectionType, section.sectionSequence)" class="template-{{statusClass}}" ng-class="{\'active\': section.sectionSequence === currentSectionSequence, \'dnd-disabled\': templateActive || !validationErrors.sections[section.sectionSequence].sectionSaved}" dnd-draggable="section" dnd-effect-allowed="move" dnd-moved="reorderSequences($index, event)" dnd-disable-if="templateActive || !validationErrors.sections[section.sectionSequence].sectionSaved" add-hover-class="true">\n                                <i class="icon icon-v-grip" add-hover-class="true"></i>\n                                <span class="data-name slds-truncate">{{section.sectionName}}</span>\n                                <span class="data-type">{{section.sectionTypeLabel}}</span>\n                                <span class="slds-icon_container section-errors-icon" title="{{labels.CLMTemplateSectionErrorsExist}}" ng-if="validationErrors.sections[section.sectionSequence].sectionErrors" bs-tooltip="sectionErrorsExist" data-placement="left">\n                                    <slds-svg-icon id="section-errors-icon" sprite="\'utility\'" icon="\'error\'" size="\'small\'"></slds-svg-icon>\n                                    <span class="slds-assistive-text">{{labels.CLMTemplateSectionErrorsExist}}</span>\n                                </span>\n                                <span class="slds-icon_container section-not-saved-icon" title="{{labels.CLMTemplateSectionNotSaved}}" ng-if="!validationErrors.sections[section.sectionSequence].sectionSaved" bs-tooltip="\'Section Not Saved\'" data-placement="left">\n                                    <slds-svg-icon id="section-not-saved-icon" sprite="\'utility\'" icon="\'warning\'" size="\'small\'"></slds-svg-icon>\n                                    <span class="slds-assistive-text">{{labels.CLMTemplateSectionNotSaved}}</span>\n                                </span>\n                                \x3c!-- TO DO !!!! Tool Tip!--\x3e\n                                <div style="display: none;" class="slds-popover slds-popover_tooltip slds-nubbin_bottom" role="tooltip">\n                                  <slds-button-svg-icon id="warning-btn" sprite="\'utility\'" icon="\'warning\'" size="\'small\'" extra-classes="\'slds-button__icon_left\'"></slds-button-svg-icon>\n                                    <div class="slds-popover__body">{labels.CLMTemplateSectionNotSaved}}</div>\n                                </div>\n                                <span class="contract-icon sequence">{{section.sectionSequence+1}}</span>\n                                <i class="contract-icon icon icon-v-right-caret"></i>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n                <div class="center-col collapsed" ng-class="{\'collapsed\': collapseCenter}">\n                    <div class="col-body">\n                        <div class="body-header slds-has-divider_bottom">\n                            <p class="slds-text-heading_label col-header-text">{{centerHeader}}</p>\n                        </div>\n                        <ul class="new-buttons-container section-types" ng-if="newSection">\n                            <li ng-repeat="sectionType in sectionTypes" ng-if="sectionType.Value !== \'Conditional\'" ng-class="(sectionType.Value === \'Clause\' && subCenterType === \'Clause\') || (sectionType.Value === \'Embedded Template\' && subCenterType === \'Embedded Template\') ? \'active\' : \'\'">\n                                <a ng-click="addSectionType(sectionType.Value, templateData.sections.length, templateData.templateId)">{{sectionType.Label}}<i class="contract-icon icon" ng-class="sectionType.Value === \'Clause\' || sectionType.Value === \'Embedded Template\' ? \'icon-v-right-caret\' : \'icon-v-plus\'"></i></a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n                <div class="sub-center-col collapsed" ng-class="{\'collapsed\': collapseSubCenter}">\n                    <div class="col-body">\n                        <div class="clauses-wrapper" ng-if="subCenterType === \'Clause\'">\n                            <div class="body-header slds-has-divider_bottom">\n                                <p class="slds-text-heading_label col-header-text">{{labels.CLMTemplateChooseClause}}</p>\n                            </div>\n                            <div ng-if="genericClauses.length === 0" class="alert alert-warning" role="alert">{{labels.CLMTemplateNoGenericClause}}</div>\n                            <ul class="existing-data generic-clauses">\n                                <li class="search">\n                                    <div class="slds-form-element">\n                                        <div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">\n                                            <slds-input-svg-icon sprite="\'utility\'" icon="\'search\'" size="\'small\'" extra-classes="\'slds-icon-text-default\'"></slds-input-svg-icon>\n                                            <input id="search-clauses" type="search" class="slds-input" ng-model="clauseFilter" placeholder="{{labels.CLMTemplateSearchClauses}}"/>\n                                        </div>\n                                    </div>\n                                </li>\n                                <li ng-repeat="clause in filteredClauses | filter:clauseFilter" ng-click="addClauseSection(clause, templateData.sections.length, templateData.templateId)">\n                                    <span class="data-name slds-truncate">{{clause.Name}}</span>\n                                    <span class="data-type">{{clause[nameSpacePrefix + \'Category__c\']}}</span>\n                                    <i class="contract-icon icon icon-v-plus"></i>\n                                </li>\n                            </ul>\n                        </div>\n                    </div>\n                    <div ng-if="subCenterType === \'Embedded Template\'">\n                        <div class="body-header slds-has-divider_bottom">\n                            <p class="slds-text-heading_label col-header-text">{{labels.CLMTemplateEmbedTemplate}}</p>\n                        </div>\n                        <div class="slds-form slds-form_compound search-templates">\n                            <div class="slds-form-element__group">\n                                <div class="slds-form-element__row">\n                                    <div class="slds-form-element slds-size_7-of-8">\n                                        <input type="search" id="search-template" class="slds-input" ng-model="searchOptions.searchTerm" placeholder="{{labels.CLMTemplateSearchTempaltes}}"/>\n                                    </div>\n                                    <div class="slds-form-element slds-size_1-of-8">\n                                        <button class="slds-button slds-button--icon-border" ng-click="searchDocumentTemplates()">\n                                            <slds-button-svg-icon sprite="\'utility\'" size="\'small\'" icon="\'search\'"></slds-button-svg-icon>\n                                        </button>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="section-pagination slds-text-align_center slds-has-divider_bottom" ng-show="showPagination">\n                            <button class="slds-button slds-button_icon" ng-disabled="(paginationOptions.pageNumber <= 1)" ng-click="getDocumentTemplates(paginationOptions.pageNumber - 1)">\n                                <slds-button-svg-icon sprite="\'utility\'" size="\'medium\'" icon="\'left\'"></slds-button-svg-icon>\n                                <span class="slds-assistive-text">Previous Page</span>\n                            </button>&nbsp;&nbsp;&nbsp;&nbsp;\n                            <span>Page {{paginationOptions.pageNumber}} of {{paginationOptions.totalPages}}</span>&nbsp;&nbsp;&nbsp;&nbsp;\n                            <button class="slds-button slds-button_icon" ng-disabled="(paginationOptions.pageNumber >= paginationOptions.totalPages)" ng-click="getDocumentTemplates(paginationOptions.pageNumber + 1)">\n                                <slds-button-svg-icon sprite="\'utility\'" size="\'medium\'" icon="\'right\'"></slds-button-svg-icon>\n                                <span class="slds-assistive-text">Next Page</span>\n                            </button>\n                        </div>\n                        <ul class="existing-data existing-templates">\n                            \x3c!-- <li ng-repeat="obj in documentTemplates" ng-if="validateEmbeddedTemplate(obj.template)" ng-click="embedTemplateSection(obj.template, obj.sections, templateData.templateId, templateData.sections.length)"> --\x3e\n                            <li ng-repeat="obj in documentTemplates" ng-click="embedTemplateSection(obj.template, obj.sections, templateData.templateId, templateData.sections.length)">\n                                <span class="data-name slds-truncate">{{obj.template.Name}}</span>\n                                <span class="data-type">{{modalLabels.CLMTemplateVersion}} {{obj.template[nameSpacePrefix + \'VersionNumber__c\']}}</span>\n                                <i class="contract-icon icon icon-v-plus" data-placement="left"></i>\n                            </li>\n                            <li ng-if="(documentTemplates && documentTemplates.length === 0)">There are no results.</li>\n                        </ul>\n                    </div>\n                </div>\n                <div class="right-col">\n                    <div class="col-body template-details">\n                        <div ng-if="currentSectionSequence === null && templateData.sections.length === 0 && !search" class="slds-page-header__title slds-p-around_small slds-m-top_x-large slds-text-align_center">\n                             {{labels.CLMTemplateNoSectionsTemplate}}\n                              <div ng-if="templateData.templateId" class="slds-form-element__label slds-size_1-of-1">\n                                  {{labels.CLMTemplateClickAddNewSection}}\n                              </div>\n                              <div ng-if="!templateData.templateId" class="slds-form-element__label slds-size_1-of-1">{{labels.CLMTemplateCreateNewTemplateSetting}}</div>\n                        </div>\n                        \x3c!-- Section Form --\x3e\n                        <check-section-saved class="section-form" ng-repeat="section in templateData.sections" ng-if="section.sectionShown" ng-class="{\'active-section\': section.sectionSequence === currentSectionSequence}" ng-show="section.sectionSequence === currentSectionSequence" doc-section="section" doc-template-is-active="templateData.templateActive" validation-errors="validationErrors" btn-text="saveAllSectionsBtn">\n                            \x3c!-- Sections --\x3e\n                            \x3c!-- <p ng-if="!validationErrors.sections[section.sectionSequence].sectionSaved">Section not yet Saved.</p> --\x3e\n                            <div ng-if="section.sectionType === \'Conditional\' && !conditionalClauses" class="alert alert-warning" role="alert">\n                                {{labels.CLMTemplateNoConditionalClauseFound}}\n                            </div>\n                            <div class="slds-form-element" ng-class="{\'has-error\': validationErrors.sections[section.sectionSequence].sectionName}">\n                                <div ng-if="!cloningTemplate" class="top-save-button">\n                                    <button type="button" class="slds-button slds-button_brand" ng-click="saveTemplateSection(checkUniqueName, section.sectionSequence)" ng-disabled="validationErrors.sections[section.sectionSequence].sectionSaved" ng-if="!templateActive"><i class="icon icon-v-check-circle" ng-if="validationErrors.sections[section.sectionSequence].sectionSaved"></i>{{saveSectionBtn}}</button>\n                                </div>\n                                <div class="slds-form-element" ng-class="{\'has-error\': validationErrors.templateName}">\n                                    <legend class="slds-form-element__legend slds-form-element__label template-name" for="section-name">{{fieldlabels.section.Name}}</legend>\n                                        <div class="slds-form-element__control">\n                                        <input id="section-name" class="slds-input slds-page-header__title name" type="text" ng-model="section.sectionName" ng-model-options="{ updateOn: \'keyup\' }" placeholder="{{labels.CLMTemplateEnterTheSectionName}}" ng-disabled="templateActive || cloningTemplate ? true : false" />\n                                    </div>\n                                    <span ng-if="validationErrors.sections[section.sectionSequence].sectionName" class="help-block" role="alert" aria-live="polite">{{validationErrors.sections[section.sectionSequence].sectionName}}</span>\n                                </div>\n                            </div>\n                            <div class="slds-form-element slds-m-bottom_small slds-grid slds-p-top_medium">\n                                <div class="slds-form-element" ng-class="{\'slds-size_4-of-12\': section.sectionType === \'Embedded Template\', \'slds-size_3-of-12\': section.sectionType !== \'Embedded Template\'}">\n                                    <legend for="template-type" class="slds-form-element__legend slds-form-element__label">{{labels.CLMTemplateSectionType}}</legend>\n                                    <div class="slds-form-element__control">\n                                        <div class="slds-form-element__label">{{section.sectionTypeLabel}}</div>\n                                    </div>\n                                    <div class="slds-form-element__legend slds-form-element__label"\n                                         ng-if="section.sectionType==\'Embedded Template\' && templateData.tokenMappingType == \'Object Based\'">\n                                        <legend class="slds-form-element__legend slds-form-element__label">{{labels.CLMTemplateSectionApplicableItemTypes}} </legend>\n                                        <div class="slds-form-element__control">\n                                            <div class="slds-form-element__label">{{section.applicableItemTypes}}</div>\n                                        </div>\n                                    </div>\n                                    <div ng-if="section.sectionType==\'Embedded Template\' && templateData.tokenMappingType == \'Object Based\'">\n                                        <legend class="slds-form-element__legend slds-form-element__label"> {{labels.CLMTemplateSectionApplicableLineItemTypes}} </legend> \n                                        <div class="slds-form-element__control">\n                                            <div class="slds-form-element__label">{{section.applicableLineItemTypes}}</div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="slds-form-element" ng-class="{\'slds-size_5-of-12\': section.sectionType === \'Embedded Template\', \'slds-size_6-of-12\': section.sectionType !== \'Embedded Template\'}">\n                                    <legend class="slds-form-element__label">{{labels.CLMTemplateSectionProperties}}</legend>\n                                    <div class="slds-form-element__control">\n                                        <label ng-if="section.sectionType!=\'Item\'" class="slds-checkbox inline-checkboxes applicable-types">\n                                            <input  type="checkbox" ng-model="section.sectionIsRestricted" ng-model-options="{ updateOn: \'click\' }" ng-disabled="templateActive || cloningTemplate ? true : false"/>\n                                            <span class="slds-checkbox_faux"></span>\n                                            <span class="slds-form-element__label">{{fieldlabels.section[nameSpacePrefix + \'IsRestricted__c\']}}</span>\n                                        </label>\n                                        <label class="slds-checkbox inline-checkboxes applicable-types">\n                                            <input id="section-is-new-page" type="checkbox" ng-model="section.sectionIsNewPage" ng-model-options="{ updateOn: \'click\' }" ng-disabled="templateActive || cloningTemplate ? true : false" /> \n                                            <span class="slds-checkbox_faux"></span>\n                                            <span class="slds-form-element__label">{{fieldlabels.section[nameSpacePrefix + \'IsInNewPage__c\']}}</span>\n                                        </label>\n                                        <label class="slds-checkbox inline-checkboxes applicable-types">\n                                            <input id="section-auto-name" type="checkbox" ng-model="section.sectionDisplayName" ng-model-options="{ updateOn: \'click\' }" ng-disabled="templateActive || cloningTemplate ? true : false" /> \n                                            <span class="slds-checkbox_faux"></span>\n                                            <span class="slds-form-element__label">{{fieldlabels.section[nameSpacePrefix + \'DisplaySectionName__c\']}}</span>\n                                        </label>\n                                        <label class="slds-checkbox inline-checkboxes applicable-item-types" ng-show="section.sectionDisplayName || section.sectionAutoNumber">\n                                            <input id="section-auto-name" type="checkbox" ng-model="section.sectionDisplayHeaderInline" ng-model-options="{ updateOn: \'click\' }" ng-disabled="templateActive || cloningTemplate ? true : false" />\n                                            <span class="slds-checkbox_faux"></span>\n                                            <span class="slds-form-element__label">{{fieldlabels.section[nameSpacePrefix + \'DisplayHeaderInline__c\']}}</span>\n                                        </label>\n                                        <label class="slds-checkbox inline-checkboxes applicable-item-types" ng-if="section.sectionType !=\'Embedded Template\'">\n                                            <input id="section-header-repeat" type="checkbox" ng-model="section.sectionTableHeaderRepeated" ng-model-options="{ updateOn: \'click\' }" ng-disabled="templateActive || cloningTemplate ? true : false" />\n                                            <span class="slds-checkbox_faux"></span>\n                                            <span class="slds-form-element__label">{{fieldlabels.section[nameSpacePrefix + \'IsWordTableHeaderRepeated__c\']}}</span>\n                                        </label>\n                                        <label class="slds-checkbox inline-checkboxes applicable-item-types" ng-if="section.sectionType ==\'Custom\'">\n                                            <input id="section-is-Batchable" type="checkbox"\n                                                   ng-model="section.sectionIsBatchable"\n                                                   ng-model-options="{ updateOn: \'click\' }"\n                                                   ng-disabled="templateActive || cloningTemplate ? true : false"/>\n                                            <span class="slds-checkbox_faux"></span>\n                                            <span class="slds-form-element__label">{{fieldlabels.section[nameSpacePrefix + \'IsBatchProcessed__c\']}}</span>\n                                        </label>\n                                    </div>\n                                </div>\n                                <div class="slds-form-element slds-size_3-of-12">\n                                    <legend class="slds-form-element__label">{{labels.CLMTemplateSectionNumbering}}</legend>\n                                    <div class="slds-form-element__control">\n                                        <label class="slds-checkbox inline-checkboxes applicable-item-types">\n                                            <input id="section-auto-number" type="checkbox" ng-model="section.sectionAutoNumber" ng-model-options="{ updateOn: \'click\' }" ng-disabled="templateActive || cloningTemplate ? true : false" />\n                                            <span class="slds-checkbox_faux"></span>\n                                            <span class="slds-form-element__label">{{labels.CLMTemplateAutoNumber}}</span>\n                                        </label>\n                                        <label class="slds-checkbox inline-checkboxes applicable-item-types">\n                                            <input id="section-reset-auto-number" type="checkbox" ng-model="section.sectionResetAutoNumber" ng-model-options="{ updateOn: \'click\' }" ng-disabled="templateActive || cloningTemplate ? true : false"/> \n                                            <span class="slds-checkbox_faux"></span>\n                                            <span class="slds-form-element__label">{{labels.CLMTemplateResetAutoNumber}}</span>\n                                        </label>\n                                        <label class="slds-checkbox inline-checkboxes applicable-item-types" ng-if="section.sectionType ===\'Embedded Template\'">\n                                            <input id="section-auto-add-sectionkey" type="checkbox" ng-model="section.autoAddSectionKey" \n                                                    ng-change="autoAddsectionKeyWarning()"\n                                                    ng-model-options="{ updateOn: \'click\' }" ng-disabled="templateActive || cloningTemplate ? true : false" />\n                                            <span class="slds-checkbox_faux"></span>\n                                            <span class="slds-form-element__label">{{labels.CLMTemplateAutoAddSectionKey}}</span>\n                                            <div ng-show="section.autoAddSectionKey" ng-if="section.sectionType ===\'Embedded Template\'">  \n                                                <div class="slds-p-left_large slds-form-element__label">({{labels.CLMTemplateSectionKey}} : {{section.sectionKey}})</div>\n                                            </div>\n                                        </label>\n                                    </div>\n                                </div>\n                            </div>\n                            \x3c!-- Embedded Template --\x3e \n                            <div class="embedded-template-form" ng-if="section.sectionType==\'Embedded Template\'" ng-repeat="subSection in section.embeddedSections"> \n                                \x3c!-- ngModel is optional --\x3e\n                                <div class="panel-group" ng-model="panels.activePanel" role="tablist" aria-multiselectable="true" bs-collapse="true">\n                                    <article class="slds-card slds-m-bottom_medium collapsed" ng-repeat="panel in panels" ng-init="cards[$index].cardCollapsed = true" ng-click="cards[$index].cardCollapsed = !cards[$index].cardCollapsed" ng-class="{\'expanded\': !cards[$index].cardCollapsed, \'collapsed\': cards[$index].cardCollapsed}">\n                                        <div class="slds-card__header slds-grid">\n                                            <header class="slds-media slds-media_center slds-has-flexi-truncate">\n                                                <div class="slds-media__figure">\n                                                    <slds-svg-icon id="section-card-{{$index}}" sprite="\'standard\'" icon="\'contract\'" size="\'small\'" extra-classes="\'slds-icon-standard-contract\'"></slds-svg-icon>\n                                                </div>\n                                                <div class="slds-media__body slds-truncate">\n                                                    <h2>\n                                                        <a href="javascript:void(0);" class="slds-text-link_reset">\n                                                            <span class="slds-text-heading_small">{{section.sectionSequence + 1}}.{{subSection[nameSpacePrefix + \'Sequence__c\'] + 1}}) {{subSection.Name}}</span>\n                                                        </a>\n                                                    </h2>\n                                                </div>\n                                            </header>\n                                        </div>\n                                        <div class="slds-card__body">\n                                            <div ng-if="subSection[nameSpacePrefix +\'Type__c\'] != \'Item\' && subSection[nameSpacePrefix +\'Type__c\'] != \'Embedded Template\'" class="card-body" ng-bind-html="subSection[nameSpacePrefix + \'SectionContent__c\']"></div>\n                                            <div ng-if="subSection[nameSpacePrefix +\'Type__c\'] == \'Item\'" class="card-body">\n                                                <div class="item-container embedded-template item-column" ng-repeat="itemHeader in subSection.sectionLineItems">\n                                                    <div class="item-cell header">{{itemHeader.columnHeader}}</div>\n                                                    <div class="item-cell">{{itemHeader.columnToken}}</div>\n                                                    <div class="item-cell totals-row">{{itemHeader.totalToken}}</div>\n                                                </div>\n                                            </div>\n                                            <div ng-if="subSection[nameSpacePrefix +\'Type__c\'] == \'Embedded Template\'" class="card-body">\n                                                <label>{{subSection[nameSpacePrefix +\'Type__c\']}}</label>\n                                            </div>\n                                        </div>\n                                        <div class="slds-card__footer"></div>\n                                    </article>\n                                </div>\n                            </div>\n                            \x3c!--Line Item Section Styling --\x3e \n                            <div ng-if="section.sectionType==\'Item\'" class="level-styling slds-m-top_large">\n                                <label class="slds-form-element__label">{{labels.CLMTemplateConstructTable}}</label> \n                                <div class="level-styling item-styling slds-size_1-of-1">\n                                    <div slds-tabs="sldsTabs" slds-active-pane="tabs.activeLevel" template="SldsTabsScoped.tpl.html">\n                                        <div ng-repeat="displayStyle in section.sectionItemDisplayStyle" data-title="{{displayStyle.title}}" name="{{displayStyle.title}}" slds-pane="sldsPane" class="slds-clearfix slds-grid slds-wrap slds-grid_pull-padded">                  \n                                            <div class="slds-grid slds-p-small slds-size_1-of-1">\n                                                <div class="slds-p-horizontal_small slds-size_1-of-4">\n                                                    <div class="slds-form-element level-font-family">\n                                                        <label class="slds-form-element__label" for="level-{{$index+1}}-font-family">{{modalLabels.CLMTemplateFontFamily}}</label>\n                                                        <div class="slds-form-element__control">\n                                                            <div class="slds-select_container">\n                                                                <select class="slds-select" id="level-{{section.sectionSequence+1}}-{{$index+1}}-font-family" ng-model="displayStyle.styles[stylesLibrary.fontFamily[0].cssProperty]" ng-options="fontFamily.style as fontFamily.label for fontFamily in stylesLibrary.fontFamily" ng-disabled="templateActive || cloningTemplate"></select>\n                                                            </div>\n                                                        </div>\n                                                    </div>\n                                                </div>\n                                                <div class="slds-p-horizontal_small slds-size_1-of-4">\n                                                    <div class="slds-form-element level-font-size">\n                                                        <label class="slds-form-element__label" for="level-{{$index+1}}-font-size">{{modalLabels.CLMTemplateFontSize}}</label>\n                                                        <div class="slds-form-element__control">\n                                                            <div class="slds-select_container">\n                                                                <select class="slds-select" id="level-{{section.sectionSequence+1}}-{{$index+1}}-font-size" ng-model="displayStyle.styles[stylesLibrary.fontSize[0].cssProperty]" ng-options="fontSize.style as fontSize.label for fontSize in stylesLibrary.fontSize" ng-disabled="templateActive || cloningTemplate"></select>\n                                                            </div>\n                                                        </div>\n                                                    </div>\n                                                </div>\n                                                <div class="slds-p-horizontal_small slds-size_1-of-4">\n                                                    <div class="slds-form-element level-font-color">\n                                                        <label class="slds-form-element__label" for="level-{{$index+1}}-font-color">{{modalLabels.CLMTemplateFontColor}}</label>\n                                                        <input type="text" class="slds-input" id="level-{{section.sectionSequence+1}}-{{$index+1}}-font-color" placeholder="{{labels.CLMTemplateRedHexColorCode}}" ng-model="displayStyle.styles.color" ng-disabled="templateActive || cloningTemplate"/>\n                                                    </div>\n                                                </div>\n                                                <div class="slds-p-horizontal_small slds-size_1-of-4">\n                                                    <div class="slds-form-element level-font-color">\n                                                        <label class="slds-form-element__label" for="level-{{$index+1}}-font-color">{{labels.CLMTemplateFillColor}}</label>\n                                                        <input type="text" class="slds-input" id="level-{{section.sectionSequence+1}}-{{$index+1}}-background-color" placeholder="{{labels.CLMTemplateRedHexColorCode}}" ng-model="displayStyle.styles[stylesLibrary.backgroundColor.cssProperty]" ng-disabled="templateActive || cloningTemplate"/>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            <div class="slds-grid slds-p-around_small slds-size_1-of-1">\n                                                <div class="slds-p-horizontal_small slds-size_1-of-4">\n                                                    <label class="slds-form-element__label">{{modalLabels.CLMTemplateSelectAllFontFormatsToApply}}</label>\n                                                    <div class="slds-form-element__control">\n                                                        <label class="slds-checkbox" ng-repeat="fontFormat in stylesLibrary.fontFormat">\n                                                            <input type="checkbox" ng-model="displayStyle.styles[fontFormat.cssProperty]" ng-true-value="\'{{fontFormat.style}}\'" ng-disabled="templateActive || cloningTemplate"/>\n                                                            <span class="slds-checkbox_faux"></span>\n                                                            <span class="slds-form-element__label">{{fontFormat.label}}</span>\n                                                        </label>\n                                                    </div>\n                                                </div>\n                                                <div class="slsds-p-horizontal_small slds-size_1-of-4 slds-m-top_small">\n                                                    <fieldset class="slds-form-element">\n                                                        <label class="slds-form-element__label">{{modalLabels.CLMTemplateSelectTextAlignment}}</label>\n                                                        <div class="slds-form-element__control" ng-repeat="textAlignment in stylesLibrary.textAlignment">\n                                                            <span class="slds-radio">\n                                                                <label class="slds-radio__label" for="owner-{{$parent.$index}}-{{$index}}">\n                                                                    <input type="radio" name="textAlignmentOptions-{{$parent.$index}}" id="owner-{{$parent.$index}}-{{$index}}" ng-model="displayStyle.styles[textAlignment.cssProperty]" ng-value="textAlignment.style" ng-disabled="templateActive || cloningTemplate"/>\n                                                                    <span class="slds-radio_faux"></span>\n                                                                    <span class="slds-form-element__label">{{textAlignment.label}}</span>\n                                                                </label>\n                                                            </span>\n                                                        </div>\n                                                    </fieldset>\n                                                </div>\n                                                <div class="slds-p-horizontal_small slds-size_1-of-4"> \n                                                    <div class="slds-form-element level-padding">\n                                                        <label class="slds-form-element__label" for="level-{{$index+1}}-font-size">{{labels.CLMTemplateBorder}}:</label>\n                                                        <input type="text" class="slds-input" id="level-{{section.sectionSequence+1}}-{{$index+1}}-border" placeholder="i.e. 1px solid #FF0000" ng-model="displayStyle.styles[stylesLibrary.border.cssProperty]" ng-disabled="templateActive || cloningTemplate"/>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <label class="slds-form-element__label slds-m-top_medium">{{labels.CLMTemplateAllColumnsHeaderToken}}</label>\n                                \x3c!-- new line item section: --\x3e \n                                <div class="slds-form-element slds-m-bottom_medium" ng-if="section.sectionType==\'Item\'">\n                                    <div class="item-binding slds-p-bottom_x-small slds-p-top_xx-small">\n                                        <div class="item-container item-column" ng-click="makeItemHeaderEditable($index,section)" ng-repeat="itemHeader in section.sectionLineItems track by $index">\n                                            <div class="item-cell with-data" ng-show="itemHeader.isEditable">\n                                                <input type="text" class="slds-input slds-p-vertical_none" ng-model="itemHeader.columnHeader" placeholder="{{labels.CLMTemplateEnterColumnHeader}}"/>\n                                            </div>\n                                            <div class="item-cell with-data" ng-show="itemHeader.isEditable">\n                                                <input type="text" class="slds-input slds-p-vertical_none" ng-model="itemHeader.columnToken" placeholder="{{labels.CLMTemplateEnterColumnToken}}"/>\n                                            </div>\n                                            <div class="item-cell with-data totals-row json-based-totals-row" ng-show="itemHeader.isEditable && templateData.tokenMappingType === \'JSON Based\'">\n                                                <div class="slds-form-element">\n                                                    <div class="slds-form-element__control">\n                                                        <span class="slds-checkbox">\n                                                            <input type="checkbox" name="options" id="item-total-checkbox-{{$index}}_{{$parent.$index}}" ng-model="itemHeader.totalToken" />\n                                                            <label class="slds-checkbox__label" for="item-total-checkbox-{{$index}}_{{$parent.$index}}">\n                                                                <span class="slds-checkbox_faux"></span>\n                                                                <span class="slds-form-element__label">{{labels.CLMTemplateDisplayTotal}}</span>\n                                                            </label>\n                                                        </span>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            <div class="item-cell with-data totals-row object-based-totals-row" ng-show="itemHeader.isEditable && templateData.tokenMappingType === \'Object Based\'">\n                                                <input type="text" class="slds-input slds-p-vertical_none" ng-model="itemHeader.totalToken" placeholder="{{labels.CLMTemplateEnterTotalToken}}"/>\n                                            </div>\n                                            <div class="item-cell header" ng-show="!itemHeader.isEditable" ng-style="section.sectionItemDisplayStyle[0].styles"> {{itemHeader.columnHeader}}</div>\n                                            <div class="item-cell" ng-show="!itemHeader.isEditable" ng-style="section.sectionItemDisplayStyle[1].styles">{{itemHeader.columnToken}}</div>\n                                            <div class="item-cell totals-row" ng-show="!itemHeader.isEditable" ng-style="section.sectionItemDisplayStyle[2].styles">\n                                                {{labels.CLMTemplateDisplayTotal}}: {{itemHeader.totalToken}}\n                                            </div>\n                                            <div class="slds-text-align_center slds-m-vertical_x-small">\n                                                <button ng-if="!templateActive && !cloningTemplate" type="button" class="slds-button slds-button_icon" ng-click="deleteFromItemHeader($index,section)">\n                                                    <slds-svg-icon id="item-delete" sprite="\'action\'" icon="\'delete\'" size="\'small\'" style="fill: #54698d"></slds-svg-icon>\n                                                </button>\n                                            </div>\n                                        </div>\n                                        <div ng-if="!templateActive && !cloningTemplate" class="item-container item-new">\n                                            <a class="add-link" ng-click="addItemHeader(section)">\n                                                <i style="width: 50px; height: 50px" class="icon icon-v-plus"></i>\n                                                <label>{{labels.CLMTemplateAddColumn}}</label>\n                                            </a>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class="slds-notify slds-notify_alert slds-theme_error slds-theme_alert-texture" ng-if="validationErrors.sections[section.sectionSequence].sectionLineItems">{{validationErrors.sections[section.sectionSequence].sectionLineItems}}</div>\n                            <div class="slds-form-element section-tokens" ng-if="section.sectionType === \'Item\'" ng-show="templateData.tokenMappingType === \'Object Based\'" ng-class="{\'token-mapping-readonly\':templateActive,\'has-error\':validationErrors.sections[section.sectionSequence].sectionTokens}">\n                                <token-mapping applicable-types="templateData.templateApplicableItemTypes" section="section" token="section.sectionTokens" template-active="templateActive" template-tokens="templateTokens" template-data="templateData"></token-mapping>\n                                <span ng-if="validationErrors.sections[section.sectionSequence].sectionTokens" class="help-block">{{validationErrors.sections[section.sectionSequence].sectionTokens}}</span>\n                            </div>\n                            \x3c!--End Line Item Section --\x3e\n                            \x3c!--Custom Type --\x3e\n                            <div class="slds-form-element" ng-class="{\'has-error\': validationErrors.sections[section.sectionSequence].customClassError}" ng-if="section.sectionType==\'Custom\'">\n                                <div class="slds-form-element__control">\n                                    <label class="slds-form-element__label slds-m-top_large slds-text-body_medium">{{fieldlabels.section[nameSpacePrefix + \'CustomClassName__c\']}}</label>\n                                    <div ng-hide="section.sectionIsBatchable"><p class="slds-text-body_small">{{labels.CLMTemplateApexClassImplementVlocityOpenInterface}}</p></div>\n                                    <div ng-show="section.sectionIsBatchable"><p class="slds-text-body_small">{{labels.CLMTemplateApexClassExtendDocTemplateMappingAbstractClass}}</p></div>\n                                    <input type="text" class="slds-input" ng-model="section.customClass" placeholder="{{labels.CLMTemplateEnterCustomClassName}}" ng-disabled="templateActive || cloningTemplate ? true : false"/>\n                                    <span ng-if="validationErrors.sections[section.sectionSequence].customClassError" class="help-block">{{validationErrors.sections[section.sectionSequence].customClassError}}</span>\n                                </div>\n                            </div>\n                            \x3c!--End Custom Type --\x3e\n                            <div class="rich-text-editor" ng-class="{\'has-warning\': validationErrors.sections[section.sectionSequence].sectionWarning.limitWarning, \'has-error\': validationErrors.sections[section.sectionSequence].sectionContent}" ng-if="section.sectionType !== \'Conditional\' && section.sectionType !== \'Item\' && section.sectionType !== \'Embedded Template\' && section.sectionType!==\'Custom\'">\n                                <legend class="slds-form-element__label" for="section-content"> {{fieldlabels.section[nameSpacePrefix + \'SectionContent__c\']}} {{labels.CLMTemplateToken}}</legend>\n                                <textarea ui-tinymce="section.tinymceOptions" ng-model="section.sectionContent" ng-disabled="templateActive || cloningTemplate ? true : false" class="tinymce-editor"></textarea>\n                                <span ng-if="validationErrors.sections[section.sectionSequence].sectionContent" class="help-block">{{validationErrors.sections[section.sectionSequence].sectionContent}}</span>\n                                <span ng-if="validationErrors.sections[section.sectionSequence].sectionWarning.limitWarning" class="help-block">{{validationErrors.sections[section.sectionSequence].sectionWarning.limitWarning}}</span>\n                                \x3c!-- <div><pre style="width: 780px">{{section.sectionTokens}}</pre></div> --\x3e\n                            </div>\n                            <div class="slds-form-element section-tokens slds-m-top_small" ng-class="{\'token-mapping-readonly\':templateActive,\'has-error\':validationErrors.sections[section.sectionSequence].sectionTokens}" ng-if="section.sectionType !== \'Conditional\' && section.sectionType !== \'Item\' && section.sectionType !== \'Embedded Template\' && section.sectionType !== \'Custom\'" ng-show="templateData.tokenMappingType === \'Object Based\'">\n                                <token-mapping applicable-types="templateData.templateApplicableTypes" section="section" token="section.sectionTokens" template-active="templateActive" template-tokens="templateTokens" template-data="templateData"></token-mapping>\n                                <span ng-if="validationErrors.sections[section.sectionSequence].sectionTokens" class="help-block">{{validationErrors.sections[section.sectionSequence].sectionTokens}}</span>\n                            </div>\n                            \x3c!--JSON Based Expression Condition: --\x3e\n                            <div class="slds-tabs_default json-based-conditions-tabs-container" ng-if="templateData.tokenMappingType === \'JSON Based\'">\n                                <ul class="slds-tabs_default__nav json-based-conditions-tabs-nav" role="tablist" ng-init="condition.section = true; condition.repeatable = false;">\n                                    <li class="slds-tabs_default__item json-based-conditions-tabs-item slds-active" title="Item One" role="presentation" ng-click="condition.repeatable = false; condition.section = true;" ng-class="{\'slds-active\': condition.section && !condition.repeatable}">\n                                        <a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="json-based-conditions-tabs-item-1" id="tab-default-1__item">{{labels.CLMTemplateConditionalJsonSectionTabLabel}}</a>\n                                    </li>\n                                    <li class="slds-tabs_default__item json-based-conditions-tabs-item" title="Item One" role="presentation" ng-click="condition.repeatable = true; condition.section = false;" ng-class="{\'slds-active\': condition.repeatable}" ng-if="section.sectionType === \'Repeating Content\' || section.sectionType === \'Item\'">\n                                        <a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="json-based-conditions-tabs-item-2" id="tab-default-1__item">{{labels.CLMTemplateConditionalJsonRepeatableTabLabel}}</a>\n                                    </li>\n                                </ul>\n                                <div id="json-based-conditions-tabs-item-1" class="slds-tabs_default__content json-based-conditions-tab-content slds-show" role="tabpanel" aria-labelledby="tab-default-1__item" ng-class="{\'slds-show\': condition.section && !condition.repeatable, \'slds-hide\': condition.repeatable}">\n                                    <div class="control-label json-based-conditions" data-title="Product Filter" name="Select Products">\n                                        <div class="section-conditions">\n                                            <div class="slds-form-element">\n                                                <label class="slds-form-element__label" for="json-expression-builder-{{$index}}" ng-bind-html="labels.CLMTemplateConditionalJson"></label>\n                                                <div class="slds-form-element__control">\n                                                    <input mentio="true" mentio-id="\'json-expression-builder-\' + $index" type="text" id="json-expression-builder-{{$index}}" class="slds-input" ng-trim="false" placeholder="{{labels.CLMTemplateConditionalJsonPlaceholder}}" ng-model="section.sectionJsonExpression" ng-disabled="templateActive || cloningTemplate" />\n                                                    <mentio-menu\n                                                        mentio-for="\'json-expression-builder-\' + $index"\n                                                        mentio-trigger-char="\'@\'"\n                                                        mentio-template-url="mentio-slds-template.tpl.html"\n                                                        mentio-items="mentioTokens"\n                                                        mentio-search="searchTokenList(term, templateTokens.formatted)"\n                                                        mentio-select="getTokenTextRaw(item)">\n                                                    </mentio-menu>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div id="json-based-conditions-tabs-item-2" class="slds-tabs_default__content json-based-conditions-tab-content slds-hide" role="tabpanel" aria-labelledby="tab-default-1__item" ng-class="{\'slds-show\': condition.repeatable && !condition.section, \'slds-hide\': condition.section}" ng-if="section.sectionType === \'Repeating Content\' || section.sectionType === \'Item\'">\n                                    <div class="control-label json-based-conditions" data-title="Product Filter" name="Select Products">\n                                        <div class="section-conditions">\n                                            <div class="slds-form-element">\n                                                <label class="slds-form-element__label" for="json-expression-builder-repeatable-{{$index}}" ng-bind-html="labels.CLMTemplateConditionalJsonRepeatable"></label>\n                                                <div class="slds-form-element__control">\n                                                    <input mentio="true" mentio-id="\'json-expression-builder-repeatable-\' + $index" type="text" id="json-expression-builder-repeatable-{{$index}}" class="slds-input" ng-trim="false" placeholder="{{labels.CLMTemplateConditionalJsonPlaceholder}}" ng-model="section.sectionJsonRepeatable" ng-disabled="templateActive || cloningTemplate" />\n                                                    <mentio-menu\n                                                        mentio-for="\'json-expression-builder-repeatable-\' + $index"\n                                                        mentio-trigger-char="\'@\'"\n                                                        mentio-template-url="mentio-slds-template.tpl.html"\n                                                        mentio-items="mentioTokens"\n                                                        mentio-search="searchTokenList(term, section.sectionTokensFormatted)"\n                                                        mentio-select="getTokenTextRaw(item)">\n                                                    </mentio-menu>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            \x3c!--Basic Conditions: --\x3e\n                            <div ng-if="section.sectionConditionType === \'Basic\'" class="control-label basic-conditions" data-title="Product Filter" name="Select Products" ng-hide="(templateActive || cloningTemplate) && section.sectionProducts.length === 0 || templateData.tokenMappingType === \'JSON Based\'">\n                                <div class="section-conditions">\n                                    <label class="slds-form-element__label">{{labels.CLMTemplateConditionalProducts}}</label>\n                                    <a class="advanced-entity-filters" ng-if="!templateActive && !cloningTemplate" ng-click="entityFilter.showOverlay(section, applicableItemTypes); applicableItemTypes.activeType = applicableItemTypes[0].Label" ng-hide="templateActive || cloningTemplate ? true : false"><i class="icon icon-v-filter"></i>{{labels.CLMTemplateAdvEntityFilters}}</a>\n                                    <tags-input ng-model="section.sectionProducts" \n                                            min-length="1" \n                                            placeholder="{{labels.CLMTemplateSearchAvailProducts}}"\n                                            on-tag-added="addProduct($tag, section.sectionProducts)" \n                                            on-tag-removed="removeProduct($tag, section.sectionProducts)" \n                                            add-From-Autocomplete-Only="true" \n                                            replace-spaces-with-dashes="false" \n                                            allow-Duplicates="false" \n                                            show-tag="true"\n                                            ng-class="templateActive || cloningTemplate ? \'toolbar-readonly\' : \'\'">\n                                        <auto-complete source="searchProductList($query)" max-results-to-show="10" min-length="1"></auto-complete>\n                                    </tags-input>\n                                </div>\n                            </div>\n                            \x3c!--Advanced Conditions: --\x3e\n                            <div ng-if="section.sectionConditionType === \'Advanced\'" ng-show="templateData.tokenMappingType === \'Object Based\'" class="control-label advanced-conditions" data-title="Entity Filter" name="Entity Filter">\n                                <div class="section-conditions" ng-class="{\'has-error\': validationErrors.sections[section.sectionSequence].entityFilterError}">\n                                    <label class="slds-form-element__label">{{labels.CLMTemplateEntityConditionalFilters}} </label>\n                                    <a class="advanced-entity-filters" ng-if="!templateActive && !cloningTemplate" ng-click="applicableItemTypes.activeType = applicableItemTypes[0].Label; entityFilter.showOverlay(section, applicableItemTypes)" ng-hide="templateActive || cloningTemplate ? true : false"><i class="icon icon-v-filter"></i>{{labels.CLMTemplateEditAdvEntityFilters}}</a>\n                                    <div class="tags">\n                                        <ul class="tag-list">\n                                            <li class="tag-item" ng-repeat="applicableItemType in applicableItemTypes" ng-if="section.sectionEntityFilters[applicableItemType.Label].Name">\n                                                <span class="display-text">{{applicableItemType.Label}}: {{section.sectionEntityFilters[applicableItemType.Label].Name}}</span>\n                                            </li>\n                                        </ul>\n                                    </div>\n                                    <a class="back-to-basic" ng-click="entityFilter.switchBackToBasic(section); saveTemplateSection(checkUniqueName, section.sectionSequence)" ng-hide="templateActive || cloningTemplate ? true : false"><i class="icon icon-v-forward"></i>{{labels.CLMTemplateBasicProductFilters}}</a>\n                                    <span ng-if="validationErrors.sections[section.sectionSequence].entityFilterError" class="help-block">{{validationErrors.sections[section.sectionSequence].entityFilterError}}</span>\n                                </div>\n                            </div>\n                            <div ng-if="!cloningTemplate" class="section-buttons-container slds-m-top_large slds-p-bottom_xx-large slds-clearfix">\n                                <button type="button" class="slds-button slds-button_brand slds-float_right" ng-click="saveTemplateSection(checkUniqueName, section.sectionSequence)" ng-disabled="validationErrors.sections[section.sectionSequence].sectionSaved" ng-if="!templateActive"><i class="icon icon-v-check-circle" ng-if="validationErrors.sections[section.sectionSequence].sectionSaved"></i>{{saveSectionBtn}}</button>\n                                <button type="button" class="slds-button slds-float_right slds-m-right_medium delete-template-section" ng-click="checkDeleteSection()" ng-if="!templateActive">{{deleteSectionBtn}}</button>\n                            </div>\n                            <div class="entity-filter-overlay" ng-class="{\'show-overlay\': entityFilterOverlay.show, \'hide-overlay\': !entityFilterOverlay.show}">\n                                <div class="container">\n                                    <div ng-if="!validateEntityFilters">\n                                        <button class="slds-button slds-button_icon close-entity-filter-overlay" ng-if="entityFilter.checkEntityFilters(section) < 1" type="button" ng-click="entityFilterOverlay.show = !entityFilterOverlay.show">\n                                            <slds-button-svg-icon id="close-entity-filter-overlay" sprite="\'utility\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                                            <span class="slds-assistive-text">{{labels.CLMTemplateBackToSection}}</span>\n                                        </button>\n                                    </div>\n                                    <div ng-if="validateEntityFilters">\n                                         <button type="button" class="slds-button slds-button_icon close-entity-filter-overlay" ng-click="entityFilter.closeWithOutSaving(applicableItemTypes, entityFilterOverlay, section)"></button>\n                                    </div>\n                                    <div class="slds-notify slds-notify_alert slds-theme_error slds-theme_alert-texture" ng-if="validateEntityFilters" style="top: -8px;">\n                                        <i class="contract-icon icon icon-v-close-circle slds-float_right slds-m-right_medium" ng-click="clearvalidateEntityFilters()" style="float:right;font-size: 22px;"></i>\n                                       <slds-button-svg-icon id="warning-btn" sprite="\'utility\'" icon="\'warning\'" size="\'small\'" extra-classes="\'slds-button__icon_left\'"></slds-button-svg-icon>\n                                       {{labels.CLMTemplateErrorEmptyFilters}} {{validateEntityFilters}}\n                                    </div>\n                                    <div slds-active-pane="entityFilter.documentApplicableItemTypes[0].Value" slds-tabs="true" via-screen-height="viaScreenHeight">\n                                        <div ng-repeat="applicableItemType in entityFilter.documentApplicableItemTypes" data-title="{{applicableItemType.Label}}" name="{{applicableItemType.Value}}" slds-pane="true" class="applicable-type-tab">\n                                            <div class="slds-form_compound entity-filter-form">\n                                                <h3 class="slds-section__title slds-m-bottom_medium" ng-hide="section.sectionEntityFilters[applicableItemType.Label].Id">{{labels.CLMTemplateEnterSelectCreateEntityFilterName}}</h3>\n                                                <div class="slds-form-element__group">\n                                                    <div class="slds-form-element__row">\n                                                        <div class="slds-size_4-of-12 slds-m-right_small">\n                                                            <div class="slds-form-element">\n                                                                <label class="slds-form-element__label" for="section-entity-filter-name-{{$parent.$index}}-{{$index}}">{{labels.CLMTemplateEntityFilterName}}</label>\n                                                                <input type="text" class="slds-input" ng-model="section.sectionEntityFilters[applicableItemType.Label].Name" id="section-entity-filter-name-{{$parent.$index}}-{{$index}}"/>\n                                                            </div>\n                                                        </div>\n                                                        <div class="slds-size_4-of-12 slds-m-horizontal_small" ng-show="section.sectionEntityFilters[applicableItemType.Label].Id">\n                                                            <div class="slds-form-element">\n                                                                <label class="slds-form-element__label" for="section-entity-filter-formula-{{$parent.$index}}-{{$index}}">{{labels.CLMTemplateEntityFilterFormula}}</label>\n                                                                <input type="text" class="slds-input" ng-model="section.sectionEntityFilters[applicableItemType.Label].Formula" ng-model-options="{ updateOn: \'keyup\' }" id="section-entity-filter-formula-{{$parent.$index}}-{{$index}}"/>\n                                                            </div>\n                                                        </div>\n                                                        <div class="slds-size_2-of-12 slds-m-horizontal_small" ng-hide="section.sectionEntityFilters[applicableItemType.Label].Id">\n                                                            <div class="slds-form-element">\n                                                                <button type="button" class="slds-button slds-button_brand create-filter" ng-click="entityFilter.createEntityFilter(section.sectionEntityFilters[applicableItemType.Label], section.sectionEntityFilters[applicableItemType.Label].Name, applicableItemType)" ng-disabled="entityFilter.btnDisabled">{{labels.CLMTemplateCreateFilter}}</button>\n                                                            </div>\n                                                        </div>\n                                                        <div class="slds-size_6-of-12 slds-m-left_small" ng-hide="section.sectionEntityFilters[applicableItemType.Label].Id" ng-if="entityFilter.countFiltersForType(applicableItemType)">\n                                                            <div class="slds-form-element select-filter">\n                                                                <label class="slds-form-element__label" for="section-entity-filter-select-{{$parent.$index}}-{{$index}}">{{labels.CLMTemplateSelectExistingEntityFilter}}</label>\n                                                                <div class="slds-form-element__control">\n                                                                    <div class="slds-select_container">\n                                                                        <select class="slds-select" id="section-entity-filter-select-{{$parent.$index}}-{{$index}}" ng-model="entityFilter.selectModel[applicableItemType.Label]" ng-options="(value.FilterOnObjectName + \': \' + value.Name) for value in $root.entityFilters | filter: {FilterOnObjectName : applicableItemType.Label}" ng-change="entityFilter.attachExistingFilter(section, applicableItemType, entityFilter.selectModel[applicableItemType.Label])"></select>\n                                                                    </div>\n                                                                </div>\n                                                            </div>\n                                                        </div>\n                                                        <div class="slds-size_3-of-12 slds-m-left_small" ng-show="section.sectionEntityFilters[applicableItemType.Label].Id">\n                                                            <div class="slds-form-element">\n                                                                <button type="button" class="slds-button slds-button_destructive" ng-click="entityFilter.removeEntityFilter(section, applicableItemType.Label)">{{labels.CLMTemplateRemoveEntityFilter}}</button>\n                                                            </div>\n                                                        </div>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            <iframe ng-if="section.sectionEntityFilters[applicableItemType.Label].url !== undefined" scrolling="yes" name="EntityFilterReference" ng-src="{{section.sectionEntityFilters[applicableItemType.Label].url}}" width="100%" class="entity-filter-iframe" id="entity-filter-{{applicableItemType.Label}}"></iframe>\n                                        </div>\n                                    </div>\n                                    <div class="bottom-controls">\n                                        <button ng-if="entityFilter.checkEntityFilters(section) < 1" type="button" class="btn btn-primary pull-right" ng-click="entityFilterOverlay.show = !entityFilterOverlay.show">{{labels.CLMTemplateBackToSection}}</button>\n                                        <button ng-if="entityFilter.checkEntityFilters(section) > 0" type="button" class="btn btn-primary pull-right" ng-click="entityFilter.backToSection(applicableItemTypes, entityFilterOverlay, section)">{{labels.CLMTemplateBackToSection}}</button>\n                                    </div>\n                                </div>\n                            </div>\n                        </check-section-saved>\n                        \x3c!-- Template Properties --\x3e \n                        <div class="entity-filter-overlay" ng-class="{\'show-overlay\': settingsFilterOverlay.show, \'hide-overlay\': !settingsFilterOverlay.show}">\n                            <div class="slds-m-horizontal_medium">\n                                <div class="slds-grid">\n                                    <div class="slds-size_1-of-4 cloning slds-has-dividers_right" ng-class="{\'collpased\': !cloningTemplate}" ng-if="cloningTemplate" via-screen-height="viaScreenHeight">\n                                        <div class="body-header slds-has-divider_bottom">\n                                            <p class="slds-text-heading_label col-header-text">{{centerHeader}}</p>\n                                        </div>\n                                        <div class="cloning-template-container" ng-class="{\'advanced-searching\': search}">\n                                            <ul class="slds-p-horizontal_medium slds-p-top_medium slds-has-dividers_bottom">\n                                                <li class="search">\n                                                    <div class="slds-form-element">\n                                                        <div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">\n                                                            <slds-input-svg-icon sprite="\'utility\'" icon="\'search\'" size="\'small\'" extra-classes="\'slds-icon-text-default\'"></slds-input-svg-icon>\n                                                            <input id="search-template" type="search" class="slds-input" ng-model="templateFilterText.input" placeholder="{{labels.CLMTemplateSearchTempaltes}}"/>\n                                                        </div>\n                                                    </div>\n                                                    \x3c!-- <a class="advanced-search-link" ng-click="advanceSearch()">Advanced Search</a> --\x3e\n                                                </li>\n                                            </ul>\n                                            <ul class="slds-form-element">\n                                                <li class="cloning-cell slds-has-divder_botom" ng-repeat="obj in templates | filter:templateFilter | orderBy:\'template.Name\'" ng-click="getSectionsForTemplate(obj.template, obj.sections)">\n                                                    <div class=" slds-truncate">{{obj.template.Name}}</div>\n                                                    <div class="slds-text-body_small">{{modalLabels.CLMTemplateVersion}} {{obj.template[nameSpacePrefix + \'VersionNumber__c\']}}</div>\n                                                    <i class="contract-icon icon icon-v-copy slds-float_right" bs-tooltip="copyTemplateTooltip(obj.template.Name)" data-placement="left"></i>\n                                                </li>\n                                            </ul>\n                                        </div>\n                                    </div>\n                                    <div class="slds-p-horizontal_small slds-size_1-of-3 slds-m-right_small" ng-class="{\'slds-size_1-of-4\': cloningTemplate}">\n                                        <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide(); hideProperties()">\n                                            <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n                                            <span class="slds-assistive-text">{{modalLabels.CLMClauseClose}}</span>\n                                        </button>\n                                        <h2 class="slds-text-heading_medium slds-p-vertical_small">\n                                            {{labels.CLMTemplateTemplateSettings}}\n                                        </h2>\n                                        <check-template-saved class="slds-grid slds-wrap slds-grid_pull-padded template-properties slds-margin-top_medium" doc-template="templateData" template-saved="templateSaved" template-clone="cloningTemplate">\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small" ng-class="{\'has-error\': validationErrors.templateName}">\n                                                <div ng-if="validationErrors.templateName" class="slds-popover slds-theme_error vloc-template-details-error vloc-template-name-error" role="alert" aria-live="polite">\n                                                    <div class="slds-popover__body slds-text-longform">\n                                                        <p>{{validationErrors.templateName}}</p>\n                                                    </div>\n                                                </div>\n                                                <label class="slds-form-element__label" for="template-name">\n                                                    <abbr class="slds-required" title="required">*</abbr>\n                                                    {{fieldlabels.template.Name}}\n                                                </label>\n                                                <div class="slds-form-element__control">\n                                                    <input id="template-name" class="slds-input" type="text" ng-model="templateData.templateName" placeholder="{{labels.CLMTemplateEnterTemplateName}}" ng-disabled="templateActive" />\n                                                </div>\n                                            </div>\n                                             <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-template-type-select">\n                                                <label class="slds-form-element__label" for="template-type-select">\n                                                    <abbr class="slds-required" title="required">*</abbr>\n                                                    {{modalLabels.CLMTemplateType}}\n                                                </label>\n                                                <div class="slds-form-element__control">\n                                                    <div class="slds-select_container">\n                                                        <select id="template-type-select" class="slds-select" \n                                                            ng-options="item.Label as item.Label for item in templateMetadata.templateDocumentTypeOptions" \n                                                            ng-model="templateData.templateDocumentType" \n                                                            ng-disabled="templateActive || templateData.templateVersion > 1 || $ctrl.pageParams.templateId" \n                                                            ng-change="changeTemplateType()">\n                                                        </select>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            \x3c!-- Select Template Language --\x3e\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-language-select">\n                                                <label class="slds-form-element__label" for="template-language-select">\n                                                        {{modalLabels.CLMTemplateLanguage}}\n                                                </label>\n                                                <div class="slds-form-element__control">\n                                                    <div class="slds-select_container">\n                                                        <select id="template-language-select" class="slds-select" \n                                                            ng-options="item.Label for item in templateMetadata.templateDocumentLanguageOptions | orderBy:\'Label\'" \n                                                            ng-model="templateData.selectedLanguageObject"\n                                                            ng-change="onSelectedLanguageChange(templateData.selectedLanguageObject)"\n                                                            ng-disabled="templateActive">\n                                                        </select>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            \n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-token-mapping-select">\n                                                <label class="slds-form-element__label" for="token-mapping-select">\n                                                    <abbr class="slds-required" title="required">*</abbr>\n                                                    {{modalLabels.CLMTemplateTokenMapping}}\n                                                </label>\n                                                <div class="slds-form-element__control">\n                                                    <div class="slds-select_container">\n                                                        <select id="token-mapping-select" class="slds-select" \n                                                            ng-options="item.label as item.label for item in templateTypeService.tokenMappingOptions" ng-model="templateData.tokenMappingType" \n                                                            ng-disabled="templateActive || templateData.templateVersion > 1 || templateData.sections.length > 0" ng-change="warnTokenMappingChange()"></select>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-usage-type-select">\n                                                <label class="slds-form-element__label" for="usage-type-select">{{labels.CLMTemplateUsageType}}</label>\n                                                <div class="slds-form-element__control">\n                                                    <div class="slds-select_container">\n                                                        <select id="usage-type-select" class="slds-select" \n                                                            ng-options="usageValue.Label as usageValue.Label for usageValue in templateMetadata.usageValues" \n                                                            ng-model="templateData.usageType" \n                                                            ng-disabled="templateActive" ng-if="templateMetadata.usageValues">\n                                                        </select>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            <div class="slds-size_1-of-1 slds-is-relative slds-p-horizontal_small vloc-object-based-container" ng-if="templateData.tokenMappingType === \'Object Based\'">\n                                                <div ng-if="validationErrors.templateApplicableTypes" class="slds-popover slds-theme_error vloc-template-details-error vloc-applicable-types-error" role="alert" aria-live="polite">\n                                                    <div class="slds-popover__body slds-text-longform">\n                                                        <p>{{validationErrors.templateApplicableTypes}}</p>\n                                                    </div>\n                                                </div>\n                                                <div ng-if="validationErrors.templateApplicableItemTypes" class="slds-popover slds-theme_error vloc-template-details-error vloc-applicable-item-types-error" role="alert" aria-live="polite">\n                                                    <div class="slds-popover__body slds-text-longform">\n                                                        <p>{{validationErrors.templateApplicableItemTypes}}</p>\n                                                    </div>\n                                                </div>\n                                                <div class="slds-clearfix slds-size_1-of-1">\n                                                    <div class="slds-form-element slds-p-vertical_small slds-p-right_small slds-float_left" ng-class="{\'has-error\': validationErrors.templateApplicableTypes, \'slds-size_1-of-1\': cloningTemplate, \'slds-size_1-of-2\' : !cloningTemplate}">\n                                                        <label class="slds-form-element__label">\n                                                            <abbr class="slds-required" title="required">*</abbr>\n                                                            {{fieldlabels.template[nameSpacePrefix + \'ApplicableTypes__c\']}}\n                                                        </label>\n                                                        <div class="slds-form-element__control">\n                                                            <label class="slds-checkbox" ng-repeat="applicableType in applicableTypes">\n                                                              <input type="checkbox" ng-value="applicableType.Value" ng-model="templateData.templateApplicableTypesObj[applicableType.Value]" ng-disabled="templateActive"/>\n                                                              <span class="slds-checkbox_faux"></span>\n                                                              <span class="slds-form-element__label">{{applicableType.Label}}</span>\n                                                            </label>\n                                                        </div>\n                                                    </div>\n                                                    <div class="slds-form-element slds-p-vertical_small slds-p-left_small slds-float_left" ng-class="{\'has-error\': validationErrors.templateApplicableItemTypes, \'slds-size_1-of-1\': cloningTemplate,\'slds-size_1-of-2\': !cloningTemplate }">\n                                                        <div>\n                                                            <label class="slds-form-element__label">\n                                                                <abbr class="slds-required" title="required">*</abbr>\n                                                                {{fieldlabels.template[nameSpacePrefix + \'ApplicableItemTypes__c\']}}\n                                                            </label>\n                                                        </div>\n                                                        <div class="slds-form-element__control">\n                                                            <label class="slds-checkbox" ng-repeat="applicableItemType in applicableItemTypes">\n                                                                <input type="checkbox" ng-value="applicableLineItemType.Value" ng-model="templateData.templateApplicableItemTypesObj[applicableItemType.Value]" ng-disabled="templateActive"/>\n                                                                 <span class="slds-checkbox_faux"></span>\n                                                                 <span class="slds-form-element__label">{{applicableItemType.Label}}</span>\n                                                            </label>\n                                                        </div>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small" ng-show="trackRedlinesSetting && templateData.usageType === \'Contract\'">\n                                                <div ng-if="validationErrors.templateTrackRedlines" class="slds-popover slds-nubbin_bottom-left slds-theme_error" role="alert" aria-live="polite" style="top: 10px;width: auto;">\n                                                    <div class="slds-popover__body slds-text-longform">\n                                                        <p>{{validationErrors.templateTrackRedlines}}</p>\n                                                    </div>\n                                                </div>\n                                                <div class="slds-form-element inline-checkboxes track-redlines"> \n                                                    <label class="slds-form-element__label">{{fieldlabels.template[nameSpacePrefix + \'TrackContractRedlines__c\']}}</label>\n                                                    <div class="slds-form-element__control">\n                                                        <label class="slds-checkbox">\n                                                            <input type="checkbox" ng-model="templateData.templateTrackRedlines" ng-disabled="templateActive" />\n                                                            <span class="slds-checkbox_faux"></span>\n                                                            <span class="slds-form-element__label">{{modalLabels.CLMTemplateTrackRedlines}}</span>\n                                                        </label>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small" ng-if="templateData.tokenMappingType === \'Object Based\'">\n                                                <div class="slds-form-element__control">\n                                                    <label class="slds-form-element__label">{{fieldlabels.template[nameSpacePrefix + \'IsSignatureRequired__c\']}}</label>\n                                                    <label class="slds-checkbox">\n                                                        <input type="checkbox" ng-value="templateData.templateSignature" ng-model="templateData.templateSignature"  ng-disabled="templateActive"/>\n                                                        <span class="slds-checkbox_faux"></span>\n                                                        <span class="slds-form-element__label">{{modalLabels.CLMTemplateSignatureRequired}}</span>\n                                                    </label>\n                                                </div>\n                                            </div>\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-dataraptor-bundle-name-container" ng-if="templateData.tokenMappingType === \'JSON Based\'" ng-class="{\'has-error\': validationErrors.dataRaptorBundleName}">\n                                                <div ng-if="validationErrors.dataRaptorBundleName" class="slds-popover slds-theme_error vloc-dataraptor-bundle-name-error vloc-template-details-error" role="alert" aria-live="polite">\n                                                    <div class="slds-popover__body slds-text-longform">\n                                                        <p>{{validationErrors.dataRaptorBundleName}}</p>\n                                                    </div>\n                                                </div>\n                                                <label class="slds-form-element__label" for="dataraptor-bundle-name">\n                                                    {{labels.CLMTemplateDRBundleName}}\n                                                </label>\n                                                <div class="slds-form-element__control">\n                                                    <input type="text" id="dataraptor-bundle-name" class="slds-input slds-float_left" ng-model="templateData.dataRaptorBundleName" placeholder="{{labels.CLMTemplateDRBundleNamePlaceholder}}" ng-disabled="templateActive" ng-class="{\'slds-size_11-of-12\': templateData.drbundleId}" />\n                                                    <span class="slds-icon_container slds-icon-utility-link slds-float_right slds-size_1-of-12 vloc-dr-link" title="{{labels.CLMTemplateDRBundleIconText}}" ng-hide="templateActive" ng-if="templateData.drbundleId" ng-click="goToDataRaptor(templateData.drbundleId)">\n                                                        <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'link\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                                                        <span class="slds-assistive-text">{{labels.CLMTemplateDRBundleIconText}}</span>\n                                                    </span>\n                                                </div>\n                                            </div>\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-data-extract-data-bundle-name-container" ng-if="templateData.tokenMappingType === \'JSON Based\'">\n                                                <label class="slds-form-element__label" for="data-extract-data-bundle-name">{{labels.CLMTemplateDataExtractDataBundleName}}</label>\n                                                <div class="slds-form-element__control">\n                                                    <input type="text" id="data-extract-data-bundle-name" class="slds-input" ng-model="templateData.dataExtractDataBundleName" placeholder="{{labels.CLMTemplateDataExtractDataBundleNamePlaceholder}}" ng-disabled="templateActive" ng-class="{\'slds-size_11-of-12\': templateData.dedrbundleId}" />\n                                                    <span class="slds-icon_container slds-icon-utility-link slds-float_right slds-size_1-of-12 vloc-dr-link" title="{{labels.CLMTemplateDEDRBundleIconText}}" ng-hide="templateActive" ng-if="templateData.dedrbundleId" ng-click="goToDataRaptor(templateData.dedrbundleId)">\n                                                        <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'link\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                                                        <span class="slds-assistive-text">{{labels.CLMTemplateDEDRBundleIconText}}</span>\n                                                    </span>\n                                                </div>\n                                            </div>\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-word-document-template-name-container" ng-if="templateData.tokenMappingType === \'JSON Based\'">\n                                                <label class="slds-form-element__label slds-float_left" for="word-document-template-name">{{labels.CLMTemplateWordDocTemplateName}}</label>\n                                                <div class="slds-is-relative slds-float_left vloc-word-document-info-container">\n                                                    <div class="slds-form-element__icon slds-m-top_xxx-small">\n                                                        <a href="javascript:void(0);"\n                                                                slds-popover="true"\n                                                                data-container=".vloc-word-document-info-container"\n                                                                nubbin-direction="bottom-left"\n                                                                tooltip="true"\n                                                                data-title="Required if you need to generate a Word document from this Document Template.">\n                                                            <slds-svg-icon sprite="\'utility\'" size="\'xx-small\'" icon="\'info\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                                                            <span class="slds-assistive-text">Help</span>\n                                                        </a>\n                                                    </div>\n                                                </div>\n                                                <div class="slds-form-element__control">\n                                                    <input type="text" id="word-document-template-name" class="slds-input" ng-model="templateData.wordDocumentTemplateName" placeholder="{{labels.CLMTemplateWordDocTemplateNamePlaceholder}}" ng-disabled="templateActive" />\n                                                </div>\n                                            </div>\n                                            <div ng-if="templateData.tokenMappingType === \'JSON Based\'" class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small checkbox-display-unmappedtokens">\n                                                <div class="slds-form-element__control">\n                                                    <span class="slds-checkbox">\n                                                      <input type="checkbox" name="options" id="checkbox-display-unmappedtokens"\n                                                             ng-model="templateData.displayUnmappedTokens"\n                                                             ng-disabled="templateActive || cloningTemplate ? true : false"/>\n                                                      <label class="slds-checkbox__label" for="checkbox-display-unmappedtokens">\n                                                        <span class="slds-checkbox_faux"></span>\n                                                        <span class="slds-form-element__label">{{labels.CLMTemplateDisplayUnmappedTokens}}</span>\n                                                      </label>\n                                                    </span>\n                                                </div>\n                                            </div>\n                                            <div ng-if="templateData.tokenMappingType === \'JSON Based\'" class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small checkbox-display-unmappedtokens">\n                                                    <div class="slds-form-element__control">\n                                                        <span class="slds-checkbox">\n                                                          <input type="checkbox" name="options" id="checkbox-display-ExtractEmbeddedTemplate"\n                                                                 ng-model="templateData.extractEmbeddedTemplateTokens" ng-change="extractEmbeddedTemplateTokenWarning()"\n                                                                 ng-disabled="templateActive || cloningTemplate ? true : false"/>\n                                                          <label class="slds-checkbox__label" for="checkbox-display-ExtractEmbeddedTemplate">\n                                                            <span class="slds-checkbox_faux"></span>\n                                                            <span class="slds-form-element__label">{{labels.CLMTemplateExtractEmbeddedTemplate}}</label></span>\n                                                          </label>\n                                                        </span>\n                                                    </div>\n                                                </div>\n                                            \x3c!-- Row 3: Contract Type Tags --\x3e \n                                            <div ng-show="(templateData.tokenMappingType === \'Object Based\' && templateData.templateApplicableTypesObj.Contract) || (templateData.tokenMappingType === \'JSON Based\' && templateData.usageType === \'Contract\')" class="slds-size_1-of-1 slds-p-horizontal_small">\n                                                <div class="slds-m-top_small" ng-if="templateData.isDefaultContractType" ng-class="{\'hide-element\': (templateData.tokenMappingType === \'Object Based\' && !templateData.templateApplicableTypesObj.Contract) || (templateData.tokenMappingType === \'JSON Based\' && templateData.usageType !== \'Contract\')}">\n                                                    <label class="slds-form-element__label">Restrict Template to Contract Types\n                                                        <a class="switch" ng-click="switchToCustom()" ng-hide="templateActive || templateArchived"><i class="icon icon-v-filter"></i>{{modalLabels.CLMTemplateSpecifyContractTypes}}</a>\n                                                        <div class="slds-form-element__control" ng-if="templateData.isDefaultContractType">\n                                                            <label class="slds-checkbox">\n                                                                <input ng-disabled="templateActive || templateArchived" id="clause-contract-type" type="checkbox" ng-model="templateData.isDefaultContractType" style="display:none"/>\n                                                                <span class="slds-checkbox_faux"></span>\n                                                                <span class="slds-form-element__label">{{modalLabels.CLMTemplateAllContractTypes}}</span>\n                                                            </label>\n                                                        </div>\n                                                    </label>\n                                                </div>\n                                                <div ng-hide="(templateData.tokenMappingType === \'Object Based\' && !templateData.templateApplicableTypesObj.Contract) || (templateData.tokenMappingType === \'JSON Based\' && templateData.usageType !== \'Contract\')" class="form-group contract-types slds-m-top_small" ng-if="!templateData.isDefaultContractType" ng-class="{\'hide-element\': (templateData.tokenMappingType === \'Object Based\' && !templateData.templateApplicableTypesObj.Contract) || (templateData.tokenMappingType === \'JSON Based\' && templateData.usageType !== \'Contract\')}">\n                                                    <label class="slds-form-element__label" for="clause-contract-type">\n                                                        {{modalLabels.CLMTemplateRestrictTemplateToContractTypes}}\n                                                        <a class="switch" ng-click="switchToDefault()" ng-hide="templateActive || templateArchived"><i class="icon icon-v-forward"></i>{{modalLabels.CLMTemplateSwitchToDefault}}</a>\n                                                    </label>\n                                                    <tags-input ng-model="selectedContractTypes" ng-class="templateActive || templateArchived ? \'toolbar-readonly\' : \'\'" min-length="1" placeholder="{{labels.CLMTemplateSearchAvailProd}}" on-tag-added="addContractType($tag)" on-tag-removed="removeContractType($tag)" add-From-Autocomplete-Only="true" replace-spaces-with-dashes="false" allow-Duplicates="false" show-tag="true">\n                                                        <auto-complete source="searchContractTypeList($query)" max-results-to-show="10" min-length="1"></auto-complete>\n                                                    </tags-input>\n                                                </div>\n                                            </div>\n                                        </check-template-saved>\n                                    </div>\n                                    <div class="slds-size_2-of-3" ng-class="{\'slds-size_2-of-4\': cloningTemplate}">\n                                        \x3c!-- Row 4: Document Styles --\x3e \n                                        <div class="slds-text-heading_medium slds-p-vertical_small slds-m-left_small">\n                                            {{modalLabels.CLMTemplateEditDocumentDefaultStyling}}\n                                        </div>\n                                        <div class="slds-grid slds-wrap slds-grid slds-size_1-of-1 slds-p-right_small">\n                                            <div class="slds-p-horizontal_small slds-size_1-of-1">\n                                                <div class="slds-form-element section-font-family">\n                                                    <label class="slds-form-element__label" for="section-{{$index+1}}-font-family">{{modalLabels.CLMTemplateDefaultFontFamilyDocument}}</label>\n                                                        <div class="slds-form-element__control">\n                                                            <div class="slds-select_container">\n                                                                <select class="slds-select" id="section-{{$index+1}}-font-family" ng-model="templateData.templateDocumentFontStyle" ng-options="fontFamily.style as fontFamily.label for fontFamily in stylesLibrary.fontFamily" ng-change="updateHeaderStyles()" ng-disabled="templateActive"></select>\n                                                        </div>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            <div class="slds-p-horizontal_small slds-m-top_small slds-size_1-of-1">\n                                                <label class="slds-form-element__label">{{modalLabels.CLMTemplateDefineStyleEachSectionHeading}}</label>\n                                            </div>\n                                            <div class="slds-p-horizontal_small slds-size_1-of-1">\n                                                <div slds-tabs="sldsTabs" slds-active-pane="tabs.activeLevel" template="SldsTabsScoped.tpl.html">\n                                                    <div ng-repeat="level in templateData.templateSectionHeaderDisplayStyleObj.headingLevels" data-title="{{level.title}}" name="{{level.title}}" slds-pane="sldsPane" class="slds-clearfix slds-grid slds-wrap slds-grid_pull-padded">\n                                                        <div class="slds-theme_shade slds-p-around_small slds-m-horizontal_small" ng-style="level.styles">\n                                                            <span class="slds-p-left_small">{{modalLabels.CLMTemplateSample}} {{level.title}} {{modalLabels.CLMTemplateText}}</span>\n                                                        </div>\n                                                        <div class="slds-size_1-of-1 slds-grid slds-m-top_small">\n                                                            <div class="slds-p-horizontal_small slds-size_1-of-3">\n                                                                <div class="slds-form-element level-font-family">\n                                                                    <label class="slds-form-element__label" for="level-{{$index+1}}-font-family">{{modalLabels.CLMTemplateFontFamily}}</label>\n                                                                    <div class="slds-form-element__control">\n                                                                        <div class="slds-select_container">\n                                                                            <select class="slds-select" id="level-{{$index+1}}-font-family" ng-model="level.styles[stylesLibrary.fontFamily[0].cssProperty]" ng-options="fontFamily.style as fontFamily.label for fontFamily in stylesLibrary.fontFamily" ng-disabled="templateActive"></select>\n                                                                        </div>\n                                                                    </div>\n                                                                </div>\n                                                            </div>\n                                                            <div class="slds-p-horizontal_small slds-size_1-of-3">\n                                                                <div class="slds-form-element level-font-size">\n                                                                    <label class="slds-form-element__label" for="level-{{$index+1}}-font-size">{{modalLabels.CLMTemplateFontSize}}</label>\n                                                                    <div class="slds-form-element__control">\n                                                                        <div class="slds-select_container">\n                                                                            <select class="slds-select" id="level-{{$index+1}}-font-size" ng-model="level.styles[stylesLibrary.fontSize[0].cssProperty]" ng-options="fontSize.style as fontSize.label for fontSize in stylesLibrary.fontSize" ng-disabled="templateActive"></select>\n                                                                        </div>\n                                                                    </div>\n                                                                </div>\n                                                            </div>\n                                                            <div class="slds-p-horizontal_small slds-size_1-of-3">\n                                                                <div class="slds-form-element level-font-color">\n                                                                    <label class="slds-form-element__label" for="level-{{$index+1}}-font-color">{{modalLabels.CLMTemplateFontColor}}</label>\n                                                                    <input type="text" class="slds-input" id="level-{{$index+1}}-font-color" placeholder="{{labels.CLMTemplateRedHexColorCode}}" ng-model="level.styles[stylesLibrary.fontColor.cssProperty]" ng-disabled="templateActive"/>\n                                                                </div>\n                                                            </div>\n                                                        </div>\n                                                        <div class="slds-size_1-of-1 slds-grid slds-m-top_small">\n                                                            <div class="slds-p-horizontal_small slds-size_1-of-3">\n                                                                <label class="slds-form-element__label">{{modalLabels.CLMTemplateSelectAllFontFormatsToApply}}</label>\n                                                                <div class="slds-form-element__control">\n                                                                    <label class="slds-checkbox" ng-repeat="fontFormat in stylesLibrary.fontFormat">\n                                                                        <input type="checkbox" ng-model="level.styles[fontFormat.cssProperty]" ng-true-value="\'{{fontFormat.style}}\'" ng-disabled="templateActive"/>\n                                                                        <span class="slds-checkbox_faux"></span>\n                                                                        <span class="slds-form-element__label">{{fontFormat.label}}</span>\n                                                                    </label>    \n                                                                </div>\n                                                            </div>\n                                                            <div class="slds-p-horizontal_small slds-size_1-of-3">\n                                                                <fieldset class="slds-form-element">\n                                                                    <label class="slds-form-element__label">{{modalLabels.CLMTemplateSelectTextAlignment}}</label>\n                                                                    <div class="slds-form-element__control" ng-repeat="textAlignment in stylesLibrary.textAlignment">\n                                                                        <span class="slds-radio">\n                                                                            <label class="slds-radio__label" for="owner-{{$parent.$index}}-{{$index}}">\n                                                                                <input type="radio"  name="textAlignmentOptions-{{$parent.$index}}" id="owner-{{$parent.$index}}-{{$index}}" value="{{textAlignment.style}}" ng-model="level.styles[textAlignment.cssProperty]"/>\n                                                                                <span class="slds-radio_faux"></span>\n                                                                                <span class="slds-form-element__label">{{textAlignment.label}}</span>\n                                                                            </label>\n                                                                        </span>\n                                                                    </div>\n                                                                </fieldset>\n                                                            </div>\n                                                            <div class="slds-p-horizontal_small slds-size_1-of-3"> \n                                                                <div class="slds-form-element level-padding">\n                                                                    <label class="slds-form-element__label" for="level-{{$index+1}}-font-size">{{modalLabels.CLMTemplateSelectIndentation}}</label>\n                                                                    <div class="slds-form-element__control">\n                                                                        <div class="slds-select_container">\n                                                                            <select class="slds-select" id="level-{{$index+1}}-padding" ng-model="level.styles[stylesLibrary.textPadding[0].cssProperty]" ng-options="textPadding.style as textPadding.label for textPadding in stylesLibrary.textPadding" ng-disabled="templateActive"></select>\n                                                                        </div>\n                                                                    </div>\n                                                                </div>\n                                                            </div>\n                                                        </div>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        \x3c!-- --\x3e\n\n                        \x3c!-- Advance Search --\x3e\n                        <div class="advanced-search-body" ng-if="search && !templateProperties">\n                            <div class="slds-grid slds-m-top_medium slds-p-horizontal_small">\n                                <div class="slds-col slds-has-flexi-truncate">\n                                    <div class="slds-media slds-no-space slds-grow">\n                                        <div class="slds-media__body">\n                                            <h1 class="slds-page-header__title slds-m-right_small slds-align-middle slds-truncate">{{labels.CLMTemplateAdvSearch}}</h1>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="slds-col slds-no-flex slds-grid slds-align-top">\n                                    <button type="button" class="slds-button slds-button_neutral slds-float_right" ng-click="clearSearch()">{{labels.CLMTemplateClearSearch}}</button>\n                                    <button type="button" class="slds-button slds-button_neutral slds-float_right" ng-click="cancelSearch()">{{modalLabels.CLMTemplateCancel}</button>\n                                </div>\n                            </div>\n                            <div class="slds-grid slds-size_1-of-1">\n                                <div class="slds-form-element slds-size_1-of-1 slds-p-around_small">\n                                    <label class="slds-form-element__label" for="template-name">{{labels.CLMTemplateSearchTemplateName}}</label>\n                                    <input class="slds-input" id="template-name" type="text" ng-model="query.Name" placeholder="{{labels.CLMTemplateEnterTemplateName}}" ng-disabled="templateActive" />\n                                </div>\n                            </div>\n                            <div class="slds-grid slds-size_1-of-1">\n                                <div class="slds-form-element slds-size_1-of-2 slds-p-around_small">\n                                    <label class="slds-form-element__label">{{modalLabels.CLMTemplateSelectAllApplicableObjHeaders}}</label>\n                                    <div class="slds-form-element__control">\n                                        <label class="slds-checkbox" ng-repeat="applicableType in applicableTypes">\n                                            <input type="checkbox" ng-value="applicableType.Value" ng-model="query.ApplicableTypes[applicableType.Value]" ng-disabled="templateActive"/>\n                                            <span class="slds-checkbox_faux"></span>\n                                            <span class="slds-form-element__label">{{applicableType.Label}}</span> \n                                        </label>\n                                    </div>\n                                </div>\n                                <div class="slds-form-element slds-size_1-of-2 slds-p-around_small" ng-class="{\'has-error\': validationErrors.templateApplicableItemTypes}">\n                                    <label class="slds-form-element__label"> {{modalLabels.CLMTemplateSelectAllApplicableObjLines}}</label>\n                                    <div class="slds-form-element__control">\n                                        <label class="slds-checkbox" ng-repeat="applicableItemType in applicableItemTypes">\n                                            <input type="checkbox" ng-value="applicableItemType.Value" ng-model="query.ApplicableItemTypes[applicableItemType.Value]" ng-disabled="templateActive"/>\n                                            <span class="slds-checkbox_faux"></span>\n                                            <span class="slds-form-element__label">{{applicableItemType.Label}}</span>  \n                                        </label>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class="slds-form-element signature-required slds-size_1-of-1 slds-p-around_small">\n                                <div class="slds-form-element__control">\n                                    <label class="slds-checkbox">\n                                        <input class="slds-input" type="checkbox" ng-model="query.IsSignature" ng-disabled="templateActive" /> \n                                        <span class="slds-checkbox_faux"></span>\n                                        <span class="slds-form-element__label">{{modalLabels.CLMTemplateSignatureRequired}}</span>\n                                    </label>\n                                </div>\n                                <div class="slds-form-element"> \n                                    <label class="slds-checkbox">\n                                        <input type="checkbox" id="templateIsActive" ng-model="query.IsActive"/> \n                                        <span class="slds-checkbox_faux"></span>\n                                       <span class="slds-form-element__label">{{modalLabels.CLMTemplateActive}}</span>  \n                                    </label>\n                                </div>\n                            </div>\n                            <div class="slds-form-element slds-size_1-of-1 slds-p-left_small">\n                                <label class="slds-form-element__label" for="template-name">{{labels.CLMTemplateSearchSectionName}}</label>\n                                <input id="template-name" class="slds-input" type="text" ng-model="query.SectionName" placeholder="{{labels.CLMTemplateEnterSectionName}}" ng-disabled="templateActive" />\n                            </div>\n                            <div class="slds-form-element slds-size_1-of-1 slds-p-left_small slds-p-top_small">\n                                <label class="slds-form-element__label" for="template-type">{{labels.CLMTemplateSearchSectionContent}}</label>\n                                <input id="template-name" class="slds-input" type="text" ng-model="query.SectionContent" placeholder="{{labels.CLMTemplateEnterSectionContent}}" ng-disabled="templateActive" />\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>'),$templateCache.put("component/docxTemplateType.tpl.html",'<div class="vloc-web-template-type"> \n    <div class="vlocity via-slds document-template" via-affix="top" via-screen-height="viaScreenHeight">\n        <div class="slds-spinner_container" ng-show="vlcLoading">\n            <div class="slds-spinner slds-spinner_brand slds-spinner_large" aria-hidden="false" role="status">\n                <div class="slds-spinner__dot-a"></div>\n                <div class="slds-spinner__dot-b"></div>\n            </div>\n        </div>\n        <div class="container">\n            \x3c!-- Page Header --\x3e\n            <div class="slds-page-header custom-header" role="banner">\n                <div class="slds-grid slds-grid_vertical-align-center">\n                    <div class="slds-size_1-of-3" role="banner">\n                        <div id="template-page-header_media" class="slds-media slds-no-space slds-grow">\n                            <div id="clause-page-header_media_fiure" class="slds-media__figure">\n                                <svg aria-hidden="true" class="slds-icon slds-icon-standard-post" ng-class="{\'slds-icon-standard-task\' : templateActive}">\n                                    <slds-svg-icon ng-if="!templateActive && (!cloningTemplate || leftColHeader == \'Start New Template\')" id="clause-page-header_icon" sprite="\'custom\'" icon="\'custom18\'" size="\'medium\'" ></slds-svg-icon>\n                                    <slds-svg-icon ng-if="templateActive" id="clause-page-header_icon" sprite="\'custom\'" icon="\'custom77\'" size="\'medium\'"></slds-svg-icon>\n                                    <slds-svg-icon ng-if="cloningTemplate && leftColHeader !== \'Start New Template\' && !templateActive" id="clause-page-header_icon" sprite="\'custom\'" icon="\'custom18\'" size="\'medium\'"></slds-svg-icon>\n                                </svg>\n                            </div>\n                            <div class="slds-media__body" id="clause-page-header_media_body">\n                                <h1 ng-if="!templateData.templateActive" id="clause-page-header_media_body2" class="slds-page-header__title custom slds-m-right_small slds-align-middle slds-truncate">\n                                    {{leftColHeader}}\n                                </h1>\n                                <h1 ng-if="templateData.templateActive" id="clause-page-header_media_body2" class="slds-page-header__title custom slds-m-right_small slds-align-middle slds-truncate" >\n                                    {{labels.CLMTemplateViewing}} "{{templateData.templateName}}"\n                                </h1>\n                                <p id="clause-page-header_media_body1" class="slds-text-heading_label slds-line-height_reset">\n                                    {{modalLabels.CLMTemplateVersion}} {{templateData.templateVersion}}\n                                    <span ng-if="!templateData.templateId && templateData.templateType !== \'Select Template Type\'">\n                                        • {{templateData.templateType}}\n                                    </span>\n                                </p>\n                            </div>\n                          </div>\n                    </div>\n                    <div class="slds-size_2-of-3">\n                        <div class="slds-float_right slds-m-left_small">\n                            <button ng-if="(!cloningTemplate && !templateActive)" type="button" class="slds-button slds-button_brand"\n                                ng-click="saveTemplate(checkUniqueName)" \n                                ng-disabled="validationErrorMessage">\n                                {{modalLabels.CLMTemplateSaveTemplateDetails}}\n                            </button>\n                            <button ng-if="(cloningTemplate && !templateActive)" type="button" class="slds-button slds-button_brand" \n                                ng-click="saveTemplate(checkUniqueName)">\n                                {{modalLabels.CLMTemplateCloneTemplate}}\n                            </button>\n                            <button ng-if="templateActive" type="button" class="slds-button slds-button_brand" \n                                ng-click="createNewVersion(templateData.templateId)" \n                                ng-disabled="isCreatingNewVersion">\n                                {{modalLabels.CLMTemplateCreateNewVersion}}\n                            </button>\n                        </div>\n                        <div class="slds-button-group slds-float_right" role="group" >\n                            <button class="slds-button slds-button_neutral" ng-click="goToTemplateOverview()">\n                                <slds-button-svg-icon id="back-to-contract" sprite="\'utility\'" icon="\'back\'" size="\'small\'" extra-classes="\'slds-button__icon_left\'"></slds-button-svg-icon>\n                                {{labels.CLMTemplateBackToList}}\n                            </button>\n                            <button ng-if="templateActive" type="button" class="slds-button slds-button_neutral"\n                                ng-click="cloneTemplate(templateData.templateId)">\n                                {{modalLabels.CLMTemplateCloneTemplate}}\n                            </button>\n                            <button ng-if="!templateActive && templateData.templateId" type="button" class="slds-button slds-button_neutral"\n                                ng-hide="templateArchived" \n                                ng-click="templateData.templateActive = true; saveTemplate(checkUniqueName);">\n                                {{labels.CLMTemplateActivate}}\n                            </button>\n                            <button ng-if="templateActive && !templateArchived" type="button" class="slds-button slds-button_neutral"\n                                ng-click="deactivateTemplate(templateData)">\n                                {{modalLabels.CLMTemplateDeactivateTemplate}}\n                            </button>\n                            <button ng-if="cloningTemplate" type="button" class="slds-button slds-button_neutral" ng-click="refresh()">\n                                {{modalLabels.CLMTemplateClearClone}}\n                            </button>\n                            <button ng-if="templateData.templateId" class="slds-button slds-button_neutral" ng-click="confirmDeleteTemplate()">\n                                <span class="slds-truncate">{{modalLabels.CLMTemplateDeleteTemplate}}</span>\n                            </button>\n                            <button ng-if="canTestTemplate(templateData)" class="slds-button slds-button_neutral" ng-click="testTemplate(templateData)">\n                                <span class="slds-truncate">{{modalLabels.CLMTemplateTestTemplate}}</span>\n                            </button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            \x3c!-- Error Message --\x3e\n            <div>\n                <div ng-if="validationMessage" class="slds-notify_container custom">\n                    <div class="slds-notify slds-notify_alert slds-theme_success slds-theme_alert-texture" role="alert">\n                        <i class="contract-icon icon icon-v-close-circle" ng-click="closeSuccessBanner()"></i>\n                        <h2>{{validationMessage}}</h2>\n                    </div>\n                </div>\n                <div ng-if="validationWarningMessage" class="slds-notify_container custom">\n                    <div class="slds-notify slds-notify_alert slds-theme_warning slds-theme_alert-texture" role="alert">\n                        <i class="contract-icon icon icon-v-close-circle" ng-click="closeSuccessBanner()"></i>\n                        <h2>{{validationWarningMessage}}</h2>\n                    </div>\n                </div>\n                <div ng-if="validationErrorMessage" class="slds-notify_container custom">\n                    <div class="slds-notify slds-notify_alert slds-theme_error slds-theme_alert-texture" role="alert">\n                        <i class="contract-icon icon icon-v-close-circle" ng-click="closeSuccessBanner()"></i>\n                        <h2>{{validationErrorMessage}}</h2>\n                    </div>\n                </div>\n                <div ng-if="docxErrorMessage" class="slds-notify_container custom error-docx">\n                    <div class="slds-theme_error slds-theme_alert-texture" role="alert">\n                        <div class="error-docx-msg">\n                            <div>\n                                <i class="contract-icon icon icon-v-close-circle" ng-click="closeSuccessBanner()"></i>\n                                <h2>{{docxErrorMessage}}</h2>\n                            </div>\n                            <div ng-if="docxErrorDetails" ng-bind-html="docxErrorDetails"></div>\n                        </div>\n                    </div>\n                </div>\n                <div ng-if="templateDeactivateErrorMsg" class="slds-notify slds-notify_alert slds-theme_error slds-theme_alert-texture" role="alert" ng-bind-html="templateDeactivateErrorMsg" ng-click="clearTemplateDeactivateErrorMsg()">\n                </div>\n            </div>\n\n            \x3c!-- Page Content --\x3e\n            <div class="three-col-body">\n               <div class="right-col">\n                    <div class="col-body template-details">\n                        \x3c!-- Template Properties --\x3e \n                        <div class="entity-filter-overlay show-overlay">\n                            <div class="slds-m-horizontal_medium">\n                                <div class="slds-grid">\n                                    \x3c!-- File List available to be cloned --\x3e\n                                    <div ng-if="cloningTemplate" class="slds-size_1-of-4 cloning slds-has-dividers_right" ng-class="{\'collpased\': !cloningTemplate}" via-screen-height="viaScreenHeight">\n                                        <div class="body-header slds-has-divider_bottom">\n                                            <p class="slds-text-heading_label col-header-text">{{centerHeader}}</p>\n                                        </div>\n                                        <div class="cloning-template-container" ng-class="{\'advanced-searching\': search}">\n                                            <ul class="slds-p-horizontal_medium slds-p-top_medium slds-has-dividers_bottom">\n                                                <li class="search">\n                                                    <div class="slds-form-element">\n                                                        <div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">\n                                                            <slds-input-svg-icon sprite="\'utility\'" icon="\'search\'" size="\'small\'" extra-classes="\'slds-icon-text-default\'"></slds-input-svg-icon>\n                                                            <input id="search-template" type="search" class="slds-input" ng-model="templateFilterText.input" placeholder="{{labels.CLMTemplateSearchTempaltes}}"/>\n                                                        </div>\n                                                    </div>\n                                                </li>\n                                            </ul>\n                                            <ul class="slds-form-element">\n                                                <li class="cloning-cell slds-has-divder_botom" ng-repeat="obj in templates | filter:templateFilter | orderBy:\'template.Name\'" ng-click="getSectionsForTemplate(obj.template, obj.sections)">\n                                                    <div class=" slds-truncate">{{obj.template.Name}}</div>\n                                                    <div class="slds-text-body_small">{{modalLabels.CLMTemplateVersion}} {{obj.template[nameSpacePrefix + \'VersionNumber__c\']}}</div>\n                                                    <i class="contract-icon icon icon-v-copy slds-float_right" bs-tooltip="copyTemplateTooltip(obj.template.Name)" data-placement="left"></i>\n                                                </li>\n                                            </ul>\n                                        </div>\n                                    </div>\n\n                                    \x3c!-- Template Settings --\x3e\n                                    <div class="slds-p-horizontal_small slds-size_1-of-3 slds-m-right_small" ng-class="{\'slds-size_1-of-4\': cloningTemplate}">\n                                        <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide(); hideProperties()">\n                                            <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n                                            <span class="slds-assistive-text">{{modalLabels.CLMClauseClose}}</span>\n                                        </button>\n                                        <h2 class="slds-text-heading_medium slds-p-vertical_small">\n                                            {{labels.CLMTemplateTemplateSettings}}\n                                        </h2>\n                                        <check-template-saved class="slds-grid slds-wrap slds-grid_pull-padded template-properties slds-margin-top_medium" doc-template="templateData" template-saved="templateSaved" template-clone="cloningTemplate">\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small" ng-class="{\'has-error\': validationErrors.templateName}">\n                                                <div ng-if="validationErrors.templateName" class="slds-popover slds-theme_error vloc-template-details-error vloc-template-name-error" role="alert" aria-live="polite">\n                                                    <div class="slds-popover__body slds-text-longform">\n                                                        <p>{{validationErrors.templateName}}</p>\n                                                    </div>\n                                                </div>\n                                                <label class="slds-form-element__label" for="template-name">\n                                                    <abbr class="slds-required" title="required">*</abbr>\n                                                    {{fieldlabels.template.Name}}\n                                                </label>\n                                                <div class="slds-form-element__control">\n                                                    <input id="template-name" class="slds-input" type="text" ng-model="templateData.templateName" placeholder="{{labels.CLMTemplateEnterTemplateName}}" ng-disabled="templateActive" />\n                                                </div>\n                                            </div>\n                                             <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-template-type-select">\n                                                <label class="slds-form-element__label" for="template-type-select">\n                                                    <abbr class="slds-required" title="required">*</abbr>\n                                                    {{modalLabels.CLMTemplateType}}\n                                                </label>\n                                                <div class="slds-form-element__control">\n                                                    <div class="slds-select_container">\n                                                        <select id="template-type-select" class="slds-select" \n                                                            ng-options="item.Label as item.Label for item in templateMetadata.templateDocumentTypeOptions" \n                                                            ng-model="templateData.templateDocumentType" \n                                                            ng-disabled="templateActive || templateData.templateVersion > 1 || $ctrl.pageParams.templateId" \n                                                            ng-change="changeTemplateType()">\n                                                        </select>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            \x3c!-- Select Template Language --\x3e\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-language-select">\n                                                <label class="slds-form-element__label" for="template-language-select">\n                                                    {{modalLabels.CLMTemplateLanguage}}\n                                                </label>\n                                                <div class="slds-form-element__control">\n                                                    <div class="slds-select_container">\n                                                        <select id="template-language-select" class="slds-select" \n                                                            ng-options="item.Label for item in templateMetadata.templateDocumentLanguageOptions | orderBy:\'Label\'" \n                                                            ng-model="templateData.selectedLanguageObject" \n                                                            ng-change="onSelectedLanguageChange(templateData.selectedLanguageObject)"\n                                                            ng-disabled="templateActive">\n                                                        </select>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-token-mapping-select">\n                                                <label class="slds-form-element__label" for="token-mapping-select">\n                                                    <abbr class="slds-required" title="required">*</abbr>\n                                                    {{modalLabels.CLMTemplateTokenMapping}}\n                                                </label>\n                                                <div class="slds-form-element__control">\n                                                    <div class="slds-select_container">\n                                                        <select id="token-mapping-select" class="slds-select" ng-options="item.label as item.label for item in tokenJsonBasedMapping" ng-model="templateData.tokenMappingType" ng-disabled="templateActive || templateData.templateVersion > 1 || templateMetadata.showFileDetails">\n                                                        </select>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            <div class="slds-form-element slds-p-vertical_small slds-p-left_small slds-float_left">\n                                                <div>\n                                                    <label class="slds-form-element__label">\n                                                        <abbr class="slds-required" title="required">*</abbr>\n                                                        {{modalLabels.CLMTemplateTokenMappingMethod}}\n                                                    </label>\n                                                </div>\n                                                <div>\n                                                    <span class="slds-radio">\n                                                        <label class="slds-radio__label" for="input1">\n                                                            <input type="radio" ng-model="templateData.mappingMethodType" value="DataRaptor"\n                                                            name="mappingMethod" id="input1" ng-disabled="templateActive || cloningTemplate"/>\n                                                            <span class="slds-radio_faux"></span>\n                                                            <span class="slds-form-element__label">DataRaptor</span>\n                                                        </label>\n                                                    </span>\n                                                    <span class="slds-radio">\n                                                        <label class="slds-radio__label" for="input2">\n                                                            <input type="radio" ng-model="templateData.mappingMethodType" value="CustomClass"\n                                                            name="mappingMethod" id="input2" ng-disabled="templateActive || cloningTemplate"/>\n                                                            <span class="slds-radio_faux"></span>\n                                                            <span class="slds-form-element__label">Custom Class</span>\n                                                        </label>\n                                                    </span>\n                                                </div>\n                                            </div>\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-dataraptor-bundle-name-container" ng-if="templateData.tokenMappingType === \'JSON Based\' && templateData.mappingMethodType === \'DataRaptor\'" ng-class="{\'has-error\': validationErrors.dataRaptorBundleName}">\n                                                <div ng-if="validationErrors.dataRaptorBundleName" class="slds-popover slds-theme_error vloc-dataraptor-bundle-name-error vloc-template-details-error" role="alert" aria-live="polite">\n                                                    <div class="slds-popover__body slds-text-longform">\n                                                        <p>{{validationErrors.dataRaptorBundleName}}</p>\n                                                    </div>\n                                                </div>\n                                                <label class="slds-form-element__label" for="dataraptor-bundle-name">\n                                                    {{labels.CLMTemplateDRBundleName}}\n                                                </label>\n                                                <div class="slds-form-element__control">\n                                                    <input type="text" id="dataraptor-bundle-name" class="slds-input slds-float_left" ng-model="templateData.dataRaptorBundleName" placeholder="{{labels.CLMTemplateDRBundleNamePlaceholder}}" ng-disabled="templateActive" ng-class="{\'slds-size_11-of-12\': templateData.drbundleId}" />\n                                                    <span class="slds-icon_container slds-icon-utility-link slds-float_right slds-size_1-of-12 vloc-dr-link" title="{{labels.CLMTemplateDRBundleIconText}}" ng-hide="templateActive" ng-if="templateData.drbundleId" ng-click="goToDataRaptor(templateData.drbundleId)">\n                                                        <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'link\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                                                        <span class="slds-assistive-text">{{labels.CLMTemplateDRBundleIconText}}</span>\n                                                    </span>\n                                                </div>\n                                            </div>\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-data-extract-data-bundle-name-container" ng-if="templateData.tokenMappingType === \'JSON Based\' && templateData.mappingMethodType === \'DataRaptor\'">\n                                                <label class="slds-form-element__label" for="data-extract-data-bundle-name">\n                                                    {{labels.CLMTemplateDataExtractDataBundleName}}\n                                                </label>\n                                                <div class="slds-form-element__control">\n                                                    <input type="text" id="data-extract-data-bundle-name" class="slds-input" ng-model="templateData.dataExtractDataBundleName" placeholder="{{labels.CLMTemplateDataExtractDataBundleNamePlaceholder}}" ng-disabled="templateActive" ng-class="{\'slds-size_11-of-12\': templateData.dedrbundleId}" />\n                                                    <span class="slds-icon_container slds-icon-utility-link slds-float_right slds-size_1-of-12 vloc-dr-link" title="{{labels.CLMTemplateDEDRBundleIconText}}" ng-hide="templateActive" ng-if="templateData.dedrbundleId" ng-click="goToDataRaptor(templateData.dedrbundleId)">\n                                                        <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'link\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                                                        <span class="slds-assistive-text">{{labels.CLMTemplateDEDRBundleIconText}}</span>\n                                                    </span>\n                                                </div>\n                                            </div>\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small" ng-class="{\'has-error\': validationErrors.customClassError}" ng-if="templateData.tokenMappingType === \'JSON Based\' && templateData.mappingMethodType === \'CustomClass\'">\n                                                <div ng-if="validationErrors.customClassError" class="slds-popover slds-theme_error vloc-template-details-error" role="alert" aria-live="polite">\n                                                    <div class="slds-popover__body slds-text-longform">\n                                                        <p>{{validationErrors.customClassError}}</p>\n                                                    </div>\n                                                </div>\n                                                <label class="slds-form-element__label" for="custom-class-name">\n                                                    <abbr class="slds-required" title="required">*</abbr>\n                                                    Custom Class\n                                                </label>\n                                                <div class="slds-form-element__control">\n                                                    <input id="custom-class-name" class="slds-input" type="text" ng-model="templateData.customClassName" placeholder="Enter a Custom Class Name" ng-disabled="templateActive" />\n                                                </div>\n                                            </div>\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-usage-type-select">\n                                                    <label class="slds-form-element__label" for="usage-type-select">{{labels.CLMTemplateUsageType}}</label>\n                                                    <div class="slds-form-element__control">\n                                                        <div class="slds-select_container">\n                                                            <select id="usage-type-select" class="slds-select" ng-options="usageValue.Label as usageValue.Label for usageValue in templateMetadata.usageValues" ng-model="templateData.usageType" ng-disabled="templateActive" ng-if="templateMetadata.usageValues"></select>\n                                                        </div>\n                                                    </div>\n                                            </div>\n\n                                            \x3c!-- CLM-1832: hiding checkbox for now --\x3e\n                                            \x3c!--\n                                            <div ng-if="templateData.tokenMappingType === \'JSON Based\'" class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small checkbox-display-unmappedtokens">\n                                                <div class="slds-form-element__control">\n                                                    <span class="slds-checkbox">\n                                                        <input type="checkbox" name="options" id="checkbox-display-unmappedtokens"\n                                                             ng-model="templateData.displayUnmappedTokens"\n                                                             ng-disabled="templateActive || cloningTemplate ? true : false"/>\n                                                        <label class="slds-checkbox__label" for="checkbox-display-unmappedtokens">\n                                                            <span class="slds-checkbox_faux"></span>\n                                                            <span class="slds-form-element__label">{{labels.CLMTemplateDisplayUnmappedTokens}}</span>\n                                                        </label>\n                                                    </span>\n                                                </div>\n                                            </div>\n                                            --\x3e\n\n                                            \x3c!-- Document Generation Source--\x3e\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-usage-type-select" >\n                                                <label class="slds-form-element__label" for="usage-type-select">{{labels.VCloudTemplateDocumentGenerationMechanism}}</label>\n                                                <div class="slds-form-element__control">\n                                                    <div class="slds-select_container">\n                                                            <select id="usage-type-select" \n                                                                    class="slds-select" \n                                                                    ng-options="generationMethod.Label as generationMethod.Label for generationMethod in documentGenerationMethodTypes" \n                                                                    ng-model="templateData.documentGenerationMechanism" \n                                                                    ng-disabled="templateActive" \n                                                                    ng-if="documentGenerationMethodTypes">\n                                                            </select>\n                                                    </div>\n                                                </div>\n                                            </div>\n\n                                            \x3c!-- PDF Generation Source--\x3e\n                                            <div class="slds-form-element slds-size_1-of-1 slds-p-horizontal_small slds-p-vertical_xx-small vloc-usage-type-select" >\n                                                <label class="slds-form-element__label" for="usage-type-select">{{labels.VCloudTemplatePdfGenerationMechanism}}</label>\n                                                <div class="slds-form-element__control">\n                                                    <div class="slds-select_container">\n                                                         <select id="usage-type-select" \n                                                                class="slds-select" \n                                                                ng-options="generationMethod.Label as generationMethod.Label for generationMethod in pdfGenerationMethodTypes" \n                                                                ng-model="templateData.pdfGenerationMechanism" \n                                                                ng-disabled="templateActive" \n                                                                ng-if="pdfGenerationMethodTypes">\n                                                        </select>\n                                                    </div>\n                                                </div>\n                                            </div>\n    \n                                            \n                                            \x3c!-- Contract Type Tags --\x3e \n                                            <div ng-show="(templateData.tokenMappingType === \'JSON Based\' && templateData.usageType === \'Contract\')" class="slds-size_1-of-1 slds-p-horizontal_small">\n                                                <div class="slds-m-top_small" ng-if="templateData.isDefaultContractType" ng-class="{\'hide-element\': (templateData.tokenMappingType === \'JSON Based\' && templateData.usageType !== \'Contract\')}">\n                                                    <label class="slds-form-element__label">Restrict Template to Contract Types\n                                                        <a class="switch" ng-click="switchToCustom()" ng-hide="templateActive || templateArchived"><i class="icon icon-v-filter"></i>{{modalLabels.CLMTemplateSpecifyContractTypes}}</a>\n                                                        <div class="slds-form-element__control" ng-if="templateData.isDefaultContractType">\n                                                            <label class="slds-checkbox">\n                                                                <input ng-disabled="templateActive || templateArchived" id="clause-contract-type" type="checkbox" ng-model="templateData.isDefaultContractType" style="display:none"/>\n                                                                <span class="slds-checkbox_faux"></span>\n                                                                <span class="slds-form-element__label">{{modalLabels.CLMTemplateAllContractTypes}}</span>\n                                                            </label>\n                                                        </div>\n                                                    </label>\n                                                </div>\n                                                <div ng-hide="(templateData.tokenMappingType === \'JSON Based\' && templateData.usageType !== \'Contract\')" class="form-group contract-types slds-m-top_small" ng-if="!templateData.isDefaultContractType" ng-class="{\'hide-element\': (templateData.tokenMappingType === \'JSON Based\' && templateData.usageType !== \'Contract\')}">\n                                                    <label class="slds-form-element__label" for="clause-contract-type">\n                                                        {{modalLabels.CLMTemplateRestrictTemplateToContractTypes}}\n                                                        <a class="switch" ng-click="switchToDefault()" ng-hide="templateActive || templateArchived"><i class="icon icon-v-forward"></i>\n                                                            {{modalLabels.CLMTemplateSwitchToDefault}}\n                                                        </a>\n                                                    </label>\n                                                    <tags-input ng-model="selectedContractTypes" ng-class="templateActive || templateArchived ? \'toolbar-readonly\' : \'\'" min-length="1" placeholder="{{labels.CLMTemplateSearchAvailProd}}" on-tag-added="addContractType($tag)" on-tag-removed="removeContractType($tag)" add-From-Autocomplete-Only="true" replace-spaces-with-dashes="false" allow-Duplicates="false" show-tag="true">\n                                                        <auto-complete source="searchContractTypeList($query)" max-results-to-show="10" min-length="1"></auto-complete>\n                                                    </tags-input>\n                                                </div>\n                                            </div>\n                                            \x3c!-- End Contract Type Tags --\x3e \n                                        </check-template-saved>\n                                    </div>\n\n                                    \x3c!-- Template File Attachment/Preview --\x3e\n                                    <div class="slds-size_2-of-3" ng-class="{\'slds-size_2-of-4\': cloningTemplate}">\n                                        <div class="slds-grid slds-wrap slds-size_1-of-1 slds-p-right_small slds-m-top_small height-parent-container">\n                                            <div class="slds-p-horizontal_small slds-size_1-of-1 height-parent-container">\n                                                \x3c!-- File Details --\x3e\n                                                <div ng-show="templateMetadata.showFileDetails" class="file-details height-parent-container" ng-if="templateData.fileData.Id">\n                                                    <div class="slds-clearfix slds-m-bottom_small">\n                                                        <div class="slds-float_left">\n                                                            <div class="slds-text-heading_medium slds-m-top_xx-small">{{templateData.fileData.Title}}</div> \n                                                        </div>\n                                                        <div class="slds-float_right">\n                                                            <div class="slds-button-group" role="group">\n                                                                <button class="slds-button slds-button_neutral" title="{{labels.CLMDocGenDownloadWord}}" ng-click="downloadFile(true)" ng-if="templateData.orginalFileData.Id && (templateData.templateDocumentType === \'Microsoft Word .DOCX Template\')">\n                                                                    <slds-button-svg-icon sprite="\'utility\'" icon="\'download\'" extra-classes="\'slds-button__icon_left\'"></slds-button-svg-icon>{{labels.CLMTemplateDownloadOriginalFile}}\n                                                                    <span class="slds-assistive-text">{{labels.CLMTemplateDownloadOriginalFile}}</span>\n                                                                </button>\n                                                                <button class="slds-button slds-button_neutral" title="{{labels.CLMDocGenDownloadWord}}" ng-click="downloadFile(false)" ng-if="(templateData.templateDocumentType === \'Microsoft Word .DOCX Template\')">\n                                                                    <slds-button-svg-icon sprite="\'utility\'" icon="\'download\'" extra-classes="\'slds-button__icon_left\'"></slds-button-svg-icon>{{labels.CLMDocGenDownloadWord}}\n                                                                    <span class="slds-assistive-text">{{labels.CLMDocGenDownloadWord}}</span>\n                                                                </button>\n                                                                <button class="slds-button slds-button_neutral" title="{{labels.CLMDocGenDownloadPowerPoint}}" ng-click="downloadFile(false)" ng-if="(templateData.templateDocumentType === \'Microsoft Powerpoint .PPTX Template\')">\n                                                                    <slds-button-svg-icon sprite="\'utility\'" icon="\'download\'" extra-classes="\'slds-button__icon_left\'"></slds-button-svg-icon>{{labels.CLMDocGenDownloadPowerPoint}}\n                                                                    <span class="slds-assistive-text">{{labels.CLMDocGenDownloadPowerPoint}}</span>\n                                                                </button>\n                                                                <button class="slds-button slds-button_neutral" title="{{labels.CLMTemplateReplaceFile}}" ng-click="replaceFile()" ng-disabled="templateActive">\n                                                                    <slds-button-svg-icon sprite="\'utility\'" icon="\'replace\'" extra-classes="\'slds-button__icon_left\'"></slds-button-svg-icon>{{labels.CLMTemplateReplaceFile}}\n                                                                    <span class="slds-assistive-text">{{labels.CLMTemplateReplaceFile}}</span>\n                                                                </button>\n                                                                <button class="slds-button slds-button_neutral" title="{{labels.CLMTemplateViewTokenList}}" ng-click="getTemplateTokens()" ng-if="templateData.tokenMappingType === \'JSON Based\' && templateData.mappingMethodType === \'CustomClass\'">\n                                                                                {{labels.CLMTemplateViewTokenList}} \n                                                                    <span class="slds-assistive-text">{{labels.CLMTemplateViewTokenList}}</span>\n                                                                </button>\n                                                            </div>\n                                                        </div>\n                                                    </div>\n                                                   <div class="document-previewer-wrapper" style="padding: 70px 65px; box-shadow: 0 0 4px 1px #d8dde6; border: 1px solid #d8dde6;height: 512px"> \n                                                        <div class="document-previewer-container">    \n                                                            <div class="dz-preview dz-file-preview dz-processing dz-complete" ng-class="{\'icon-v-file-word\' : $ctrl.pageParams.templateType === \'docx\', \'icon-v-file-powerpoint\': $ctrl.pageParams.templateType === \'pptx\'}"> \n                                                                    <div class="slds-text-heading_medium slds-m-top_xx-small" style="font-weight: 400">{{labels.CLMTemplateFileUploaded}}</div>\n                                                            </div>\n                                                        </div>\n                                                    </div>\n                                                    \x3c!-- <file-preview-embed-swf content-version-id="templateData.fileData.Id" width="\'100%\'" height="\'100%\'"></file-preview-embed-swf> --\x3e\n                                                </div>\n                                                <div ng-if="hasParsedDocument && !errorInParsing && templateMetadata.showFileDetails !== undefined && !templateMetadata.showFileDetails">\n                                                    <div class="slds-clearfix slds-text-heading_small slds-m-top_large slds-m-bottom_large">\n                                                       {{labels.CLMTemplateClauseReplacedMessage}}\n                                                    </div>\n                                                    <div class="slds-text-align_center">\n                                                        <button  type="button" id="downLoadFinalVersion" class="slds-button slds-button_brand slds-m-bottom_large ng-binding ng-scope"\n                                                            title="download clauseTokens replaced file" ng-click="downloadFile(false)">\n                                                            {{labels.CLMTemplateDownloadFinalVersion}}\n                                                        </button>\n                                                        <button  type="button" id="downLoadFinalVersion" class="slds-button slds-button_brand slds-m-bottom_large ng-binding ng-scope"\n                                                            title="download clauseTokens replaced file" ng-click="templateMetadata.showFileDetails = true;">\n                                                            {{labels.CLMTemplateUseFinalVersion}}\n                                                    </button>\n                                                    </div>\n                                                </div>\n\n                                                \x3c!-- File Upload --\x3e\n                                                <div ng-if="(templateMetadata.showFileDetails !== undefined && !templateMetadata.showFileDetails)" class="file-upload">\n                                                    <div class="slds-text-heading_medium slds-m-bottom_small">{{labels.CLMTemplateAttachFile}}</div>\n                                                    <div ng-if="validationErrors.templateFile" class="slds-popover slds-theme_error vloc-template-details-error vloc-template-name-error" role="alert" aria-live="polite">\n                                                        <div class="slds-popover__body slds-text-longform">\n                                                            <p>{{validationErrors.templateFile}}</p>\n                                                        </div>\n                                                    </div>\n                                                    <dropzone template-meta-data = \'templateMetaData\' template-type="$ctrl.pageParams.templateType" template-active="templateActive" template-data="templateData" workspace="documentTemplateWorkspace"></dropzone>\n                                                    <div ng-if="templateMetadata.showFileReplaceCancel" class="slds-m-top_large">\n                                                        <button class="slds-button slds-button_neutral" title="{{labels.CLMTemplateUseExistingFile}}" ng-click="cancelFileReplace()">\n                                                            <slds-button-svg-icon sprite="\'utility\'" icon="\'close\'" extra-classes="\'slds-button__icon_left\'"></slds-button-svg-icon>{{labels.CLMTemplateUseExistingFile}}\n                                                            <span class="slds-assistive-text">{{labels.CLMTemplateUseExistingFile}}</span>\n                                                        </button>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n\n                        \x3c!-- Advance Search --\x3e\n                        <div class="advanced-search-body" ng-if="search && !templateProperties">\n                            <div class="slds-grid slds-m-top_medium slds-p-horizontal_small">\n                                <div class="slds-col slds-has-flexi-truncate">\n                                    <div class="slds-media slds-no-space slds-grow">\n                                        <div class="slds-media__body">\n                                            <h1 class="slds-page-header__title slds-m-right_small slds-align-middle slds-truncate">\n                                                {{labels.CLMTemplateAdvSearch}}\n                                            </h1>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="slds-col slds-no-flex slds-grid slds-align-top">\n                                    <button type="button" class="slds-button slds-button_neutral slds-float_right" ng-click="clearSearch()">{{labels.CLMTemplateClearSearch}}</button>\n                                    <button type="button" class="slds-button slds-button_neutral slds-float_right" ng-click="cancelSearch()">{{modalLabels.CLMTemplateCancel}</button>\n                                </div>\n                            </div>\n                            <div class="slds-grid slds-size_1-of-1">\n                                <div class="slds-form-element slds-size_1-of-1 slds-p-around_small">\n                                    <label class="slds-form-element__label" for="template-name">{{labels.CLMTemplateSearchTemplateName}}</label>\n                                    <input class="slds-input" id="template-name" type="text" ng-model="query.Name" placeholder="{{labels.CLMTemplateEnterTemplateName}}" ng-disabled="templateActive" />\n                                </div>\n                            </div>\n                            <div class="slds-grid slds-size_1-of-1">\n                              <div class="slds-form-element slds-size_1-of-2 slds-p-around_small">\n                                    <label class="slds-form-element__label">{{modalLabels.CLMTemplateSelectAllApplicableObjHeaders}}</label>\n                                    <div class="slds-form-element__control">\n                                        <label class="slds-checkbox" ng-repeat="applicableType in applicableTypes">\n                                            <input type="checkbox" ng-value="applicableType.Value" ng-model="query.ApplicableTypes[applicableType.Value]" ng-disabled="templateActive"/>\n                                            <span class="slds-checkbox_faux"></span>\n                                            <span class="slds-form-element__label">{{applicableType.Label}}</span> \n                                        </label>\n                                    </div>\n                              </div>\n                              <div class="slds-form-element slds-size_1-of-2 slds-p-around_small" ng-class="{\'has-error\': validationErrors.templateApplicableItemTypes}">\n                                  <label class="slds-form-element__label"> {{modalLabels.CLMTemplateSelectAllApplicableObjLines}}</label>\n                                  <div class="slds-form-element__control">\n                                    <label class="slds-checkbox" ng-repeat="applicableItemType in applicableItemTypes">\n                                        <input type="checkbox" ng-value="applicableItemType.Value" ng-model="query.ApplicableItemTypes[applicableItemType.Value]" ng-disabled="templateActive"/>\n                                        <span class="slds-checkbox_faux"></span>\n                                        <span class="slds-form-element__label">{{applicableItemType.Label}}</span>\n                                    </label>\n                                  </div>\n                              </div>\n                            </div>\n                            <div class="slds-form-element signature-required slds-size_1-of-1 slds-p-around_small">\n                                <div class="slds-form-element__control">\n                                    <label class="slds-checkbox">\n                                        <input class="slds-input" type="checkbox" ng-model="query.IsSignature" ng-disabled="templateActive" />\n                                        <span class="slds-checkbox_faux"></span>\n                                        <span class="slds-form-element__label">{{modalLabels.CLMTemplateSignatureRequired}}</span>\n                                    </label>\n                                </div>\n                                <div class="slds-form-element"> \n                                    <label class="slds-checkbox">\n                                        <input type="checkbox" id="templateIsActive" ng-model="query.IsActive"/> \n                                        <span class="slds-checkbox_faux"></span>\n                                       <span class="slds-form-element__label">{{modalLabels.CLMTemplateActive}}</span>\n                                    </label>\n                                </div>\n                            </div>\n                            <div class="slds-form-element slds-size_1-of-1 slds-p-left_small">\n                                <label class="slds-form-element__label" for="template-name">{{labels.CLMTemplateSearchSectionName}}</label>\n                                <input id="template-name" class="slds-input" type="text" ng-model="query.SectionName" placeholder="{{labels.CLMTemplateEnterSectionName}}" ng-disabled="templateActive" />\n                            </div>\n                            <div class="slds-form-element slds-size_1-of-1 slds-p-left_small slds-p-top_small">\n                                <label class="slds-form-element__label" for="template-type">{{labels.CLMTemplateSearchSectionContent}}</label>\n                                <input id="template-name" class="slds-input" type="text" ng-model="query.SectionContent" placeholder="{{labels.CLMTemplateEnterSectionContent}}" ng-disabled="templateActive" />\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>'),$templateCache.put("select-image-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" role="dialog"> \n    <div class="slds-modal__container"> \n        <div class="slds-modal__header"> \n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium">{{modalLabels.CLMTemplatePickImg}}</h4> \n        </div> \n        <div class="slds-modal__content slds-p-around_small"> \n            <div class="slds-grid slds-grid_pull-padded" style="overflow-x: scroll;"> \n                <div class="slds-size_1-of-3 slds-text-align_center slds-m-bottom_small" ng-repeat="folder in folders track by $index"> \n                    <a style="cursor: pointer;" ng-click="getAllImages(folder)">\n                        <slds-svg-icon sprite="\'standard\'" icon="\'folder\'" size="\'small\'" style="fill: #0070d2"></slds-svg-icon>\n                        <label class="slds-text-algin_left slds-form-element__label">{{folder.Name}}</label>\n                    </a> \n                </div> \n            </div>\n            <div class="slds-box slds-m-top_small slds-theme_shade" ng-if="images"> \n                <div ng-if="images.length == 0" class="slds-text-align_center">\n                       {{modalLabels.CLMTemplateEmptyFolder}}\n                </div>\n                <div class="slds-grid slds-grid_pull-padded" style="overflow-x: scroll"> \n                    <div class="slds-size_1-of-3 slds-text-align_center slds-p-horizontal_x-small slds-m-bottom_small" ng-repeat="image in images"> \n                        <div class="slds-m-bottom_small">\n                            <img style="cursor: pointer; height:40px; width:40px;" ng-click="imageClicked(image)" src = "{{image.src}}"/>\n                        </div> \n                        <div style="word-wrap: break-word; min-height:50px;">{{image.Name}}</div> \n                    </div> \n                </div> \n            </div>\n            <div class="slds-size_1-of-1 slds-p-vertical_small">\n                <h4 class="slds-form-element__label">\n                {{modalLabels.CLMTemplateSelectedImg}} {{selectedImage.Name}}</h4>\n            </div>\n        </div>\n        <div class="slds-modal__footer"> \n            <button type="button" class="slds-button slds-button_brand" ng-click="insertImage()">{{modalLabels.CLMTemplateInsert}}</button> \n            <button type="button" class="slds-button slds-button_neutral" ng-click="closeModal()">{{modalLabels.CLMClauseClose}}</button> \n        </div> \n    </div> \n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>'),$templateCache.put("mentio-slds-template.tpl.html",'<div class="slds-lookup__menu slds-scrollable_y vloc-token-lookup__menu" style="display: block;">\n    <ul class="slds-lookup__list vloc-token-lookup__list" role="listbox">\n        <li role="presentation" mentio-menu-item="item" ng-repeat="item in items track by $index">\n            <span class="slds-lookup__item-action slds-lookup__item-action_label" id="lookup-option-506" role="option">\n                <span class="slds-truncate" ng-bind-html="item.label | mentioHighlight:typedTerm:\'menu-highlighted\' | unsafe"></span>\n            </span>\n        </li>\n    </ul>\n</div>'),$templateCache.put("view-token-json-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n        <div class="slds-modal__container">\n            <div class="slds-modal__header">\n               <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                    <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n                </button>\n                <h4 class="slds-text-heading_medium" ng-bind-html="title"></h4>\n            </div>\n            <div class="slds-modal__content slds-p-around_medium">\n                <p> <pre id="tokenListData">  {{tokenList}}  </pre> </p>\n            </div>\n            <div class="slds-modal__footer">\n                <button type="button" class="slds-button slds-button_neutral" ng-click="copyTextToClipboard(\'#tokenListData\'); $hide()">{{modalLabels.CLMCopyToClipboard}}</button>\n            </div>\n        </div>\n    </div>\n    <div class="slds-backdrop slds-backdrop_open"></div>'),$templateCache.put("check-status-modal-section-unsaved.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium" ng-bind-html="title"></h4></div>\n        <div class="slds-modal__content slds-p-around_medium slds-notify slds-notify_alert slds-theme_warning  slds-theme_alert-texture">\n            <p>{{modalLabels.CLMTemplateUnsavedSectionsMsg}}</p>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="$hide()">{{modalLabels.CLMTemplateOkay}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>'),$templateCache.put("clause-not-found-modal.tpl.html",'<div role="dialog" tabindex="-1" aria-labelledby="header43" class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container" >\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="cancelFileLoad(file);$hide()">\n                <slds-svg-icon id="clause-notfound" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium slds-theme_warning  slds-theme_alert-texture">\n            <label class="slds-form-element__label">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'utility\'" icon="\'warning\'" size="\'small\'" extra-classes="\'slds-button__icon_left\'"></slds-svg-icon>\n                {{modalLabels.CLMTemplateNoClauseFoundWarningMessage}}\n            </label>\n            <div class="slds-text-body_medium slds-m-around_x-small slds-text-align_center" ng-if="missingClauses.length > 0"> \n                <h2> {{modalLabels.CLMTemplateMissingClausesLabel}} </h2>\n                <ul class="slds-list_vertical-space-medium">\n                    <li  ng-repeat="clause in missingClauses"> {{clause}} </li>\n                </ul>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="cancelFileLoad(file);$hide()">Ok</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>'),$templateCache.put("font-validation-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container" >\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide()">\n                <slds-svg-icon id="fonts-missing" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium slds-theme_warning  slds-theme_alert-texture">\n            <label class="slds-form-element__label">\n                <slds-svg-icon id="font-page-header_icon" sprite="\'utility\'" icon="\'warning\'" size="\'small\'" extra-classes="\'slds-button__icon_left\'"></slds-svg-icon>\n                {{content}}\n            </label>\n            <div class="slds-text-body_medium slds-m-around_x-small slds-text-align_left" ng-if="missingfonts.length > 0">\n                    <ul class="slds-list_vertical-space-medium">\n                        <li  ng-repeat="fonts in missingfonts"> {{fonts}} </li>\n                    </ul>\n            </div>\n        </div>\n\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="$hide()">Ok</button>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("change-token-mapping-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="warnTokenMappingChange(true); $hide()">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium">Change {{modalLabels.CLMTemplateTokenMapping}}</h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{modalLabels.CLMTemplateTokenMappingChangeWarning}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="warnTokenMappingChange(true); $hide()">{{modalLabels.CLMTemplateCancel}}</button>\n            <button type="button" class="slds-button slds-button_brand" ng-click="$hide()">{{modalLabels.CLMTemplateOkay}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>'),$templateCache.put("check-status-modal.tpl.html",'<div class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container" >\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <p>{{modalLabels.CLMTemplateSaveTemplateVersionMsg}}</p>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="$hide()">{{modalLabels.CLMTemplateCancel}}</button>\n            <button type="button" class="slds-button slds-button_brand" ng-click="saveTemplateRemoteAction(); $hide()">{{modalLabels.CLMTemplateSaveTemplate}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>'),$templateCache.put("change-autoAddSectionKey-section-modal.tpl.html",'<div class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container" >\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="autoAddSectionKeyChange(currentSectionSequence); $hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <p>{{modalLabels.CLMTemplateAutoAddSectionKeyChangeWarning}}</p>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="autoAddSectionKeyChange(currentSectionSequence); $hide()">Cancel</button>\n            <button type="button" class="slds-button slds-button_brand" ng-click="setSectionKey(currentSectionSequence); $hide()">OK</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n\n'),$templateCache.put("check-status-modal-section-errors.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium slds-notify slds-notify_alert slds-theme_error  slds-theme_alert-texture">\n            <p>{{modalLabels.CLMTemplateSectionErrorsMsg}}</p>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="$hide()">{{modalLabels.CLMTemplateOkay}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>'),$templateCache.put("SldsTabsScoped.tpl.html",'<div class="slds-tabs_scoped">\n    <ul class="slds-tabs_scoped__nav" role="tablist">\n        <li class="slds-tabs_scoped__item slds-text-heading_label" title="{{$pane.title}}" role="presentation" ng-repeat="$pane in $panes track by $index" ng-class="{\'slds-active\': $isActive($pane, $index)}" ng-click="!$pane.disabled && $setActive($pane.name || $index); importedScope.showTabPanes()">\n            <a class="slds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="$index" aria-selected="true" aria-controls="tab-scoped-{{$index}}" ng-bind-html="$pane.title" data-index="{{$index}}"></a>\n        </li>\n    </ul>\n    <div class="slds-tabs_scoped__content slds-show" role="tabpanel" aria-labelledby="tab-scoped-1__item" ng-transclude></div>\n</div>\n'),$templateCache.put("check-delete-section-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium">{{modalLabels.CLMTemplateDeleteSection}}</h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{modalLabels.CLMClauseAreYouSureDeleteSection}} (\'{{templateData.sections[currentSectionSequence].sectionName}}\')?</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="$hide()">{{modalLabels.CLMTemplateCancel}}</button>\n            <button type="button" class="slds-button slds-button_destructive" ng-click="deleteTemplateSection(templateData.sections[currentSectionSequence]); $hide()">{{modalLabels.CLMTemplateDeleteSection}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n'),$templateCache.put("change-extractEmbeddedTemplate-modal.tpl.html",'<div class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container" >\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="extactEmbeddedTokenChange(); $hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <p>{{modalLabels.CLMTemplateExtractEmbeddedChangeWarning}}\n                <span class="slds-icon_container slds-icon-utility-link slds-float_right slds-size_1-of-12 vloc-dr-link" title="{{labels.CLMTemplateDRBundleIconText}}" ng-hide="templateActive" ng-if="templateData.drbundleId" ng-click="goToDataRaptor(templateData.drbundleId)">\n                        <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'link\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                        <span class="slds-assistive-text">{{labels.CLMTemplateDRBundleIconText}}</span>\n                    </span>\n            </p>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="extactEmbeddedTokenChange(); $hide()">Cancel</button>\n            <button type="button" class="slds-button slds-button_brand" ng-click=" $hide()">OK</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n\n'),$templateCache.put("dir-pagination-controls.tpl.html",'<ul class="pagination" ng-if="1 < pages.length">\n    <li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(1)">&laquo;</a>\n    </li>\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a>\n    </li>\n    <li ng-repeat="pageNumber in pages track by $index" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' }">\n        <a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a>\n    </li>\n\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a>\n    </li>\n    <li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.last)">&raquo;</a>\n    </li>\n</ul>')}]);

},{}]},{},[1]);
})();

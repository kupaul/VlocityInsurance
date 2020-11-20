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
angular.module('insProductAttributes', ['vlocity', 'CardFramework', 'sldsangular', 'forceng',
    'ngSanitize', 'cfp.hotkeys', 'insValidationHandler', 'insRules', 'dndLists'
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
    }]).filter('formatCurrency', ['$rootScope', function($rootScope) {
        'use strict';
        return function(amount) {
            if(amount != null) {
                if (typeof amount === 'string') {
                    amount = parseInt(amount);
                }
                return amount.toLocaleString($rootScope.vlocity.userAnLocale, { style: 'currency', currency: $rootScope.vlocity.userCurrency });
            }

        };
    }]).filter('formatDate', ['$rootScope', function($rootScope) {
        'use strict';
        return function(date) {
            const userLocale = $rootScope.vlocity.userAnLocale;
            const d = new Date(date);
            let formattedDate;
            if (userLocale) {
                formattedDate = d.toLocaleDateString(userLocale);
            } else {
                formattedDate = (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
            }
            return formattedDate;
        };
    }]).filter('formatDateTime', ['$rootScope', function($rootScope) {
        'use strict';
        return function(date) {
            const userLocale = $rootScope.vlocity.userAnLocale;
            const d = new Date(date);
            let formattedDate;
            if (userLocale) {
                formattedDate = d.toLocaleDateString(userLocale, {year: 'numeric', month: 'numeric', day: 'numeric', hour:"2-digit", minute: '2-digit'});
            } else {
                formattedDate = (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
            }
            return formattedDate;
        };
    }]).filter('getTranslatedDataType', ['$rootScope', function($rootScope) {
        'use strict';
        return function(dataType) {
            const valueDataTypeConstants = [
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
                    label: 'Percent',
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
                    translationKey:'InsProductDatetime'
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
            for (let i = 0; i < valueDataTypeConstants.length; i++) {
                if(valueDataTypeConstants[i].key === dataType) {
                    return $rootScope.vlocity.getCustomLabel(valueDataTypeConstants[i].translationKey);
                }
            }
            return dataType;
        };
    }
]);

// Controllers
require('./modules/insProductAttributes/controller/InsProductAttributesController.js');
require('./modules/insProductAttributes/controller/InsProductAttributesConfigController.js');
require('./modules/insProductAttributes/controller/InsProductAttributesRowController.js');

// Factories
require('./modules/insProductAttributes/factory/InsProductAttributesService.js');
require('./modules/insProductAttributes/factory/NotificationHandler.js');
require('./modules/insProductAttributes/factory/InsQuoteModalService.js');

// Directives
require('./modules/insProductAttributes/directive/HideNotification.js');
require('./modules/insProductAttributes/directive/InsFocus.js');
require('./modules/insInsuredItems/directive/angular-drag-and-drop-lists.js');

// Templates
require('./modules/insProductAttributes/templates/templates.js');

},{"./modules/insInsuredItems/directive/angular-drag-and-drop-lists.js":2,"./modules/insProductAttributes/controller/InsProductAttributesConfigController.js":3,"./modules/insProductAttributes/controller/InsProductAttributesController.js":4,"./modules/insProductAttributes/controller/InsProductAttributesRowController.js":5,"./modules/insProductAttributes/directive/HideNotification.js":6,"./modules/insProductAttributes/directive/InsFocus.js":7,"./modules/insProductAttributes/factory/InsProductAttributesService.js":8,"./modules/insProductAttributes/factory/InsQuoteModalService.js":9,"./modules/insProductAttributes/factory/NotificationHandler.js":10,"./modules/insProductAttributes/templates/templates.js":11}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
angular.module('insProductAttributes').controller('InsProductAttributesConfigController',
    ['$scope', '$rootScope', '$timeout', 'InsQuoteModalService', 'dataService', 'userProfileService', function (
        $scope, $rootScope, $timeout, InsQuoteModalService, dataService, userProfileService) {
        'use strict';

        $scope.customLabels = {};

        const translationKeys = ['InsProductPercentage', 'InsProductCurrency', 'InsProductText', 'InsProductNumber', 'InsProductCheckbox', 'Add', 'InsProductDefault', 'InsProductEnterStartValue',
            'InsProductDatetime', 'InsProductDate', 'InsProductAdjustment', 'InsProductPicklist', 'InsProductMultipicklist', 'InsProductValue', 'InsProductDisplayValue', 'InsProductStartValue',
            'InsProductEnterDisplayValue', 'InsProductAvailable', 'InsProductRule', 'InsProductRequired', 'InsProductOptional', 'InsProductNotUsed', 'InsProductSingleValue', 'InsProductSlider', 'InsProductEqualizer',
            'InsProductDropdown', 'InsProductTextArea', 'InsProductRadiobutton', 'InsProductVariant', 'InsProductIncrement', 'Input', 'Output', 'InsProductEnterVariant', 'InsProductEnterStep', 'InsProductEnterMax', 'InsProductEnterMin',
            'InsProductEnterInput', 'InsProductEnterValue', 'InsProductMax', 'InsProductMin', 'InsProductInsertValue', 'InsProductMultiValuePicklistField', 'InsProductSplitAttributeHelpText', 'InsProductValueDecoderPlaceholder', 'InsProductMultiValuePicklistValuePlaceholder'
        ];

        $scope.picklistOptions = [{
            key: 'Input',
            label: 'Input',
            translationKey: 'Input',
        },
        {
            key: 'Output',
            label: 'Output',
            translationKey: 'Output',
        },
        ]

        $scope.adjustmentUnits = [{
            key: 'Percent',
            label: 'Percentage',
            translationKey: 'InsProductPercentage',
        },
        {
            key: 'Currency',
            label: 'Currency',
            translationKey: 'InsProductCurrency',
        }
        ];

        $scope.adjustmentComments = [{
            key: 'Required',
            label: 'Required',
            translationKey: 'InsProductRequired'
        },
        {
            key: 'Optional',
            label: 'Optional',
            translationKey: 'InsProductOptional'
        },
        {
            key: 'Not Used',
            label: 'Not Used',
            translationKey: 'InsProductNotUsed'
        },
        ];

        $scope.configurableTypeListCustomizable = [{
            key: 'Currency',
            label: 'Currency',
            translationKey: 'InsProductCurrency',
        },
        {
            key: 'Percent',
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
            key: 'Multivalue Picklist',
            label: 'Multivalue Picklist',
            translationKey: 'InsProductMultiValuePicklistField'
        },
        {
            key: 'Multi Picklist',
            label: 'Multi Picklist',
            translationKey: 'InsProductMultipicklist'
        }
        ];

        userProfileService.getUserProfile().then(function (user) {
            let userLanguage = user.language.replace("_", "-") || user.language;
            dataService.fetchCustomLabels(translationKeys, userLanguage).then(
                function (translatedLabels) {
                    $scope.customLabels = translatedLabels;
                    for (let i = 0; i < $scope.configurableTypeListCustomizable.length; i++) {
                        let item = $scope.configurableTypeListCustomizable[i];
                        let translationKey = item.translationKey;
                        item.label = translatedLabels[translationKey];
                    }

                    for (let i = 0; i < $scope.adjustmentComments.length; i++) {
                        let comment = $scope.adjustmentComments[i];
                        let translationKey = comment.translationKey;
                        comment.label = translatedLabels[translationKey];
                    }

                    for (let i = 0; i < $scope.adjustmentUnits.length; i++) {
                        let unit = $scope.adjustmentUnits[i];
                        let translationKey = unit.translationKey;
                        unit.label = translatedLabels[translationKey];
                    }

                    for (let i = 0; i < $scope.picklistOptions.length; i++) {
                        let picklistOpt = $scope.picklistOptions[i];
                        let translationKey = picklistOpt.translationKey;
                        picklistOpt.label = translatedLabels[translationKey];
                    }

                    for (let type in $scope.configurableTypeDict) {
                        if ($scope.configurableTypeDict[type].displayType) {
                            let displayType = $scope.configurableTypeDict[type].displayType;
                            for (let i = 0; i < displayType.length; i++) {
                                if (displayType[i].translationKey) {
                                    let translationKey = displayType[i].translationKey;
                                    displayType[i].label = translatedLabels[translationKey];
                                }
                            }
                        }
                    }
                }
            );
        })

        $scope.rulesOptions = {
            ruleTypes: [
                'Hide',
                'Message',
                'Set Value'
            ],
            messageTypes: [{
                code: 'INFO',
                label: 'Information'
            }, {
                code: 'WARN',
                label: 'Warning'
            }, {
                code: 'ERROR',
                label: 'Error'
            }, {
                code: 'RECOMMENDATION',
                label: 'Recommendation'
            }]
        };

        $scope.runtime = {
            isAvailable: true,
            id: 0,
            displayText: null,
            value: null,
            isDefault: false
        };

        if ($rootScope.config.attr && $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] && $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length) {
            $scope.runtime.id = $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length;
        }

        $scope.configurableTypeDict = {
            Currency: {
                type: 'number',
                valueType: 'currency',
                subType: true,
                displayType: [{
                    key: 'Dropdown',
                    label: 'Dropdown',
                    translationKey: 'InsProductDropdown'
                },
                {
                    key: 'Single Value',
                    label: 'Single Value',
                    translationKey: 'InsProductSingleValue'
                }
                ]
            },
            Percent: {
                type: 'number',
                valueType: 'percent',
                subType: true,
                displayType: [{
                    key: 'Slider',
                    label: 'Slider',
                    translationKey: 'InsProductSlider'
                },
                {
                    key: 'Single Value',
                    label: 'Single Value',
                    translationKey: 'InsProductSingleValue'
                }
                ]
            },
            Adjustment: {
                type: 'number',
                valueType: 'percent',
                subType: true,
                displayType: [{
                    key: 'Single Value',
                    label: 'Single Value',
                    translationKey: 'InsProductSingleValue'
                },
                {
                    key: 'Slider',
                    label: 'Slider',
                    translationKey: 'InsProductSlider'
                },
                {
                    key: 'Equalizer',
                    label: 'Equalizer',
                    translationKey: 'InsProductEqualizer'
                }
                ]
            },
            Text: {
                type: 'text',
                valueType: 'text',
                subType: true,
                displayType: [{
                    key: 'Text',
                    label: 'Text',
                    translationKey: 'InsProductText'
                },
                {
                    key: 'Text Area',
                    label: 'Text Area',
                    translationKey: 'InsProductTextArea'
                }
                ]
            },
            Number: {
                type: 'number',
                valueType: 'number',
                subType: true,
                displayType: [{
                    key: 'Slider',
                    label: 'Slider',
                    translationKey: 'InsProductSlider'
                },
                {
                    key: 'Single Value',
                    label: 'Single Value',
                    translationKey: 'InsProductSingleValue'
                }
                ]
            },
            Checkbox: {
                type: 'checkbox',
                valueType: 'checkbox',
                subType: false,
            },
            Datetime: {
                type: 'datetime-local',
                valueType: 'datetime',
                subType: false
            },
            Date: {
                type: 'date',
                valueType: 'date',
            },
            Picklist: {
                label: 'Picklist',
                type: null,
                valueType: 'picklist',
                subType: true,
                displayType: [{
                    key: 'Radiobutton',
                    label: 'Radiobutton',
                    translationKey: 'InsProductRadiobutton'
                },
                {
                    key: 'Dropdown',
                    label: 'Dropdown',
                    translationKey: 'InsProductDropdown'
                }
                ]
            },
            'Multi Picklist': {
                type: null,
                valueType: 'picklist',
                subType: true,
                displayType: [{
                    key: 'Checkbox',
                    label: 'Checkbox',
                    translationKey: 'InsProductCheckbox'
                },
                {
                    key: 'Dropdown',
                    label: 'Dropdown',
                    translationKey: 'InsProductDropdown'
                }
                ]
            },
            Dropdown: {
                type: null,
                valueType: 'picklist'
            },
            Radiobutton: {
                type: 'radio',
                valueType: 'picklist'
            },
            'Multivalue Picklist': {
                label: 'Multivalue Picklist',
                type: null,
                valueType: 'picklist',
                subType: true
            }
        };
        $scope.minMaxDataTypeList = ['Currency', 'Percent', 'Number', 'Text'];

        $scope.setDataType = function (field) {
            $rootScope.config.attr.valueType = $scope.configurableTypeDict[$rootScope.config.attr[field.name]].valueType;
            if ($rootScope.config.attr.valueType === 'date' || $rootScope.config.attr.valueType === 'datetime-local') {
                if (typeof ($rootScope.config.attr[$scope.nsPrefix + 'Value__c'] !== 'date') || typeof ($rootScope.config.attr[$scope.nsPrefix + 'Value__c'] !== 'datetime-local')) {
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = null;
                }
            }
            if ($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Date' ||
                $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Datetime') {
                $rootScope.config.attr[$rootScope.nsPrefix + 'Value__c'] = null;
                $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = {};
            }
            if ($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Adjustment') {
                $rootScope.config.attr[$rootScope.nsPrefix + 'IsConfigurable__c'] = true;
            }
            $rootScope.config.attr.inputDisplayType = $scope.configurableTypeDict[$rootScope.config.attr[field.name]].type;
            var dataType = $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'];
            if (!$scope.configurableTypeDict[dataType].subType) {
                $rootScope.config.attr[$rootScope.nsPrefix + 'UIDisplayType__c'] = null;
            }

            if ($rootScope.config.attr[$rootScope.nsPrefix + 'IsConfigurable__c'] && $scope.configurableTypeDict[dataType].displayType) {
                $rootScope.config.attr[$rootScope.nsPrefix + 'UIDisplayType__c'] = $scope.configurableTypeDict[dataType].displayType[0].key || $scope.configurableTypeDict[dataType].displayType[0];
                $scope.setDisplayType();
            }
        };

        $scope.updateOptionsReadOnly = function () {
            if ($rootScope.config.attr[$rootScope.nsPrefix + 'IsReadOnly__c']) {
                for (var i = 0; i < $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length; i++) {
                    if (!$rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isDefault) {
                        $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isAvailable = false;
                    } else {
                        $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isAvailable = true;
                    }
                }
            }
        };

        $scope.setDisplayType = function () {
            let displayType = $rootScope.config.attr[$rootScope.nsPrefix + 'UIDisplayType__c'];
            if(displayType){
                let isDisplayTypeSlider = displayType.key === 'Slider' || displayType === 'Slider';
                let isDisplayTypeEqualizer = displayType.key === 'Equalizer' || displayType === 'Equalizer';
                if ((!isDisplayTypeSlider && !isDisplayTypeEqualizer) && !Array.isArray($rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'])){
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = [];
                } else if (isDisplayTypeEqualizer) {
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = 0;
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = {};
                } else if (isDisplayTypeSlider) {
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = {};
                }
            }

        };

        $scope.showRules = function (index) {
            for (var i = 0; i < $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'].length; i++) {
                $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'][i].showRules = index === i;
            }
        };

        $scope.addRunTimeValue = function () {
            if ($scope.runtime.value || $scope.runtime.displayText) {
                if (!$rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] || $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length === 0) {
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = [];
                    if ($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Picklist' || $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Multivalue Picklist' || $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Currency') {
                        $scope.runtime.isDefault = true;
                    }
                }
                $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].push($scope.runtime);
                $scope.runtime = {
                    isAvailable: true,
                    value: '',
                    isDefault: false,
                    id: 0
                };
                if ($rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] && $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length) {
                    $scope.runtime.id = $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length;
                }
                if ($rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length === 1) {
                    if ($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Picklist' || $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Currency' ||
                        $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Multivalue Picklist') {
                        $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][0].value;
                    } else {
                        // no defaut value for multipicklist
                        $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = [];
                    }
                }
            }
        };

        $scope.initOptionRules = function (option) {
            if (!option.rules) {
                option.rules = [];
            } else if (typeof (option.rules) === 'string') {
                option.rules = JSON.parse(option.rules);
            }
            console.log(option.rules);
        };

        $scope.deleteRunTimeValue = function (option) {
            var i = $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].indexOf(option);
            if ($rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isDefault && ($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Picklist' || $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Currency' ||
                $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Multivalue Picklist')) {
                if (i > 0) {
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i - 1].isDefault = true;
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i - 1].value;
                } else {
                    if ($rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i + 1]) {
                        $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i + 1].isDefault = true;
                        $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i + 1].value;
                    }
                }
            } else if ($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Multi PickList') {
                var k = $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].indexOf(option.value);
                $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].splice(k, 1);
            }
            if (i > -1) {
                $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].splice(i, 1);
            }
            for (let i = 0; i < $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'].length; i++) {
                $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'][i].id = i;
            }
        };

        $scope.setMultiPicklist = function (option) {
            if (option.isDefault) {
                if (!$rootScope.config.attr[$scope.nsPrefix + 'Value__c']) {
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = [];
                } else if (typeof ($rootScope.config.attr[$scope.nsPrefix + 'Value__c']) !== 'object') {
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = [];
                }
                $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].push(option.value);
            } else {
                var k = $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].indexOf(option.value);
                $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].splice(k, 1);
                if ($rootScope.config.attr[$rootScope.nsPrefix + 'IsReadOnly__c']) {
                    option.isAvailable = false;
                }
            }
        };


        $scope.setMultiPicklistCoverage = function (option) {
            if (option.isDefault) {
                if (!$rootScope.config.attr[$scope.nsPrefix + 'Value__c']) {
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = [];
                } else if (typeof ($rootScope.config.attr[$scope.nsPrefix + 'Value__c']) !== 'object') {
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = [];
                }
                $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].push(option.value);
            } else {
                var k = $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].indexOf(option.value);
                $rootScope.config.attr[$scope.nsPrefix + 'Value__c'].splice(k, 1);
            }
        };

        $scope.setDefaultOptionCoverage = function (index) {
            for (var i = 0; i < $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length; i++) {
                $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isDefault = false;
                if ($rootScope.config.attr[$rootScope.nsPrefix + 'IsReadOnly__c']) {
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isAvailable = false;
                }
                if (i === index && ($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Picklist' || $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Currency' ||
                    $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Multivalue Picklist')) {
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isDefault = true;
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isAvailable = true;
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].value;
                }
            }
        };

        $scope.setDefaultOption = function (index) {
            for (var i = 0; i < $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'].length; i++) {
                $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isDefault = false;
                if (i === index && ($rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Picklist' || $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Currency' ||
                    $rootScope.config.attr[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Multivalue Picklist')) {
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isDefault = true;
                    $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].isAvailable = true;
                    $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'][i].value;
                }
            }
        };

        $scope.toNumber = function (n) {
            $rootScope.config.attr[$scope.nsPrefix + 'Value__c'] = parseInt(n);
        };

        /*
         * Fn used for drag and drop to reorder sequence of list
         * @param {Integer} targetIndex
         * @param {Object} item dropdown value
         */
        $scope.reorderSequences = function (targetIndex, item) {
            $rootScope.dragging = false;
            let srcIndex;
            for (let i = 0; i < $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'].length; i++) {
                if ($rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'][i].id === item.id) {
                    srcIndex = i;
                    break;
                }
            }
            $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'].splice(srcIndex, 1);
            $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'].splice(targetIndex, 0, item);
            for (let i = 0; i < $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'].length; i++) {
                $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'][i].id = i;
            }
        };

    }]);

},{}],4:[function(require,module,exports){
angular.module('insProductAttributes').controller('InsProductAttributesController',
    ['$scope', '$rootScope', '$timeout', 'InsProductAttributesService', 'NotificationHandler', 'InsQuoteModalService', 'dataService', 'userProfileService', function (
        $scope, $rootScope, $timeout, InsProductAttributesService, NotificationHandler, InsQuoteModalService, dataService, userProfileService) {
        'use strict';
        $scope.vlocAttrs = {};
        $rootScope.config = {
            show: true,
            attr: null
        };
        $scope.customLabels = {};

        const translationKeys = ['InsProductHideJSON', 'New', 'Save', 'Update', 'InsAssetSelectCategory', 'InsProductCategory', 'Name', 'InsProductPercentage', 'InsProductText',
            'InsProductSelectAttribute', 'InsProductMessage', 'InsProductSetValue', 'InsProductInformation', 'InsProductWarning', 'InsProductError', 'InsProductCurrency',
            'InsProductRecommendation', 'InsProductEnterMessageText', 'InsProductAttributeRules', 'InsProductAttributeMustHaveDataType', 'InsProductAttributeMustHaveUnits', 'InsProductNumber',
            'InsProductCheckbox', 'InsProductDatetime', 'InsProductDate', 'InsProductAdjustment', 'InsProductPicklist', 'InsProductMultipicklist', 'InsProductRevert', 'InsRevertAttributeChange'
        ];


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

        userProfileService.getUserProfile().then(function (user) {
            let userLanguage = user.language.replace('_', '-') || user.language;
            dataService.fetchCustomLabels(translationKeys, userLanguage).then(
                function (translatedLabels) {
                    $scope.customLabels = translatedLabels;
                    for (var i = 0; i < $scope.rulesOptions.ruleTypes.length; i++) {
                        var ruleType = $scope.rulesOptions.ruleTypes[i];
                        var translationKey = ruleType.translationKey;
                        if (typeof ruleType === 'object') {
                            ruleType.label = translatedLabels[translationKey] || ruleType.label;
                        }
                    }

                    for (var i = 0; i < $scope.rulesOptions.messageTypes.length; i++) {
                        var messageType = $scope.rulesOptions.messageTypes[i];
                        var translationKey = messageType.translationKey;
                        messageType.label = translatedLabels[translationKey] || ruleType.label;
                    }
                }
            );
        })


        $rootScope.rowFields = [
            {
                displayLabel: '[' + $rootScope.nsPrefix + 'CategoryName__c]',
                label: 'Category',
                name: $rootScope.nsPrefix + 'CategoryName__c',
                type: 'string',
                key: $rootScope.nsPrefix + 'CategoryName__c',
            },
            {
                displayLabel: '[' + $rootScope.nsPrefix + 'AttributeUniqueCode__c]',
                label: 'Code',
                name: $rootScope.nsPrefix + 'AttributeUniqueCode__c',
                type: 'string',
                key: $rootScope.nsPrefix + 'AttributeUniqueCode__c',
            },
            {
                displayLabel: '[Name]',
                editing: false,
                label: 'Label',
                name: 'Name',
                type: 'string',
                key: 'Name',
            },
            {
                displayLabel: '[' + $rootScope.nsPrefix + 'ValueDataType__c]',
                label: 'Control',
                name: $rootScope.nsPrefix + 'ValueDataType__c',
                type: 'string',
                key: $rootScope.nsPrefix + 'ValueDataType__c',
            },
            {
                displayLabel: '[' + $rootScope.nsPrefix + 'Value__c]',
                editing: false,
                label: 'Value',
                name: $rootScope.nsPrefix + 'Value__c',
                type: $rootScope.nsPrefix + 'ValueDataType__c',
                key: $rootScope.nsPrefix + 'Value__c',
            },
            {
                displayLabel: '[' + $rootScope.nsPrefix + 'IsRatingAttribute__c]',
                label: 'Rating',
                name: $rootScope.nsPrefix + 'IsRatingAttribute__c',
                type: 'boolean',
                key: $rootScope.nsPrefix + 'IsRatingAttribute__c',
            }
        ];

        $scope.setOrderTerm = function (orderTerm) {
            $scope.dragDropEnabled = false;
            if ($scope.orderTerm !== orderTerm) {
                $scope.orderAsc = true;
                $scope.orderTerm = orderTerm;
            } else {
                $scope.orderAsc = !$scope.orderAsc;
            }
            if ($scope.recordProductAttributes) {
                $scope.sortAttributesByOrderTerm(orderTerm, $scope.orderAsc);
            }
        };

        $scope.dragDropEnabled = false;

        $scope.$on('refresh_product_attributes', function (event, data) {
            const inputMap = {
                productId: $scope.params.id
            };

            const isAttributeUpdateOrRevert = (data.event === 'updateProductAttributes' || data.event === 'revertProductAttributes');

            InsProductAttributesService.getProductAttributes($scope, inputMap).then(function (data) {
                if (data.productAttributes[$scope.params.id]) {
                    $scope.recordProductAttributes = data.productAttributes[$scope.params.id].prodAttributes;
                    $rootScope.classOverride = data.productAttributes[$scope.params.id].classOveride;

                    const selectedAttr = $scope.recordProductAttributes.filter(function(prodAttr) {
                        return prodAttr[$rootScope.nsPrefix + 'AttributeId__c'] === $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeId__c'];
                    })[0];

                    if(selectedAttr && isAttributeUpdateOrRevert) {
                        setSelectedAttribute(selectedAttr);
                    }

                    $timeout(function () {
                        if ($scope.dragDropEnabled) {
                            $scope.sortAttributesByOrderTerm($rootScope.nsPrefix + 'AttributeDisplaySequence__c', true);
                        } else {
                            $scope.sortAttributesByOrderTerm($scope.orderTerm, $scope.orderAsc);
                        }
                    }, 0);
                } else {
                    $scope.recordProductAttributes = [];
                }
            });
        });

        const setSelectedAttribute = function(selectedAttr) {
            if(selectedAttr[$rootScope.nsPrefix + 'ValidValuesData__c'] && typeof selectedAttr[$rootScope.nsPrefix + 'ValidValuesData__c'] === 'string') {
                selectedAttr[$rootScope.nsPrefix + 'ValidValuesData__c'] = JSON.parse(selectedAttr[$rootScope.nsPrefix + 'ValidValuesData__c']);
            }

            if(selectedAttr[$rootScope.nsPrefix + 'RuleData__c'] && typeof selectedAttr[$rootScope.nsPrefix + 'RuleData__c'] === 'string') {
                selectedAttr[$rootScope.nsPrefix + 'RuleData__c'] = JSON.parse(selectedAttr[$rootScope.nsPrefix + 'RuleData__c']);
            }
            $rootScope.config.attr =  Object.assign({}, selectedAttr);
            $rootScope.config.attr.rules = selectedAttr[$rootScope.nsPrefix + 'RuleData__c'] ?
                selectedAttr[$rootScope.nsPrefix + 'RuleData__c'] : [];
        };

        $scope.showJSONdiff = function() {
            const inputMap = {
                classId: $rootScope.classId,
                attributeId: $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeId__c']
            }
            InsProductAttributesService.getClassAttribute($scope, inputMap, $rootScope.config);
        };

        /**
         * Sort attributes based on selected category.
         * @param {string} orderTerm - Category to sort by.
         * @param {boolean} orderAsc - Sort order (ascending or descending).
         */
        $scope.sortAttributesByOrderTerm = function (orderTerm, orderAsc) {
            if ($scope.recordProductAttributes) {
                $scope.recordProductAttributes = $scope.recordProductAttributes.sort(function (a, b) {
                    let compareA = a[orderTerm];
                    let compareB = b[orderTerm];

                    const ascMultiplier = orderAsc ? 1 : -1;
                    const greater = 1 * ascMultiplier;
                    const lesser = -1 * ascMultiplier;

                    if (typeof compareA === 'string') {
                        compareA = compareA.toLowerCase();
                    }

                    if (typeof compareB === 'string') {
                        compareB = compareB.toLowerCase();
                    }

                    if (orderTerm === $rootScope.nsPrefix + 'AttributeDisplaySequence__c' && (typeof compareA === 'string' || typeof compareB === 'string')) {
                        compareA = parseInt(compareA);
                        compareB = parseInt(compareB);
                    }

                    // For Values__c, group values by data type, then sort within each group.
                    if (orderTerm === $rootScope.nsPrefix + 'Value__c') {
                        const valueDataTypeA = a[$rootScope.nsPrefix + 'ValueDataType__c'];
                        const valueDataTypeB = b[$rootScope.nsPrefix + 'ValueDataType__c'];

                        if (typeof compareA === 'string' && (valueDataTypeA !== 'Text' && valueDataTypeA !== 'Date' && valueDataTypeA !== 'Datetime')) {
                            compareA = JSON.parse(compareA);
                        }

                        if (typeof compareB === 'string' && (valueDataTypeB !== 'Text' && valueDataTypeB !== 'Date' && valueDataTypeB !== 'Datetime')) {
                            compareB = JSON.parse(compareB);
                        }

                        if (typeof compareA > typeof compareB) {
                            return greater;
                        }

                        if (typeof compareA < typeof compareB) {
                            return lesser;
                        }

                        if (typeof compareA === 'number') {
                            if (compareA > compareB) {
                                return greater;
                            }
                            if (compareA < compareB) {
                                return lesser;
                            }
                        }

                        if (typeof compareA === 'string') {
                            if (compareA > compareB) {
                                return greater;
                            }
                            if (compareA < compareB) {
                                return lesser;
                            }
                        }

                        if (typeof compareA === 'boolean') {
                            if (compareA === true) {
                                return greater;
                            }
                            if (compareB === true) {
                                return lesser;
                            }
                        }
                    }

                    if (orderTerm !== $rootScope.nsPrefix + 'Value__c') {
                        if (compareA === undefined || compareA > compareB) {
                            return greater;
                        }

                        if (compareB === undefined || compareA < compareB) {
                            return lesser;
                        }
                    }

                    return 0;
                });

                if (orderTerm === $rootScope.nsPrefix + 'AttributeDisplaySequence__c') {
                    $scope.resequenceItems($scope.recordProductAttributes);
                }
            }


        }


        /**
         * Resequence product attributes after drag and drop.
         * @param {Number} targetIndex - Index where dragged item was dropped.
         * @param {Object} item - Attribute selected for drag and drop.
         * @param {Array} list - List of product attributes.
         */
        $scope.reorderSequencesOnDrop = function (targetIndex, item, list) {
            $scope.dragDropEnabled = true;
            $rootScope.dragging = false;

            let srcIndex;
            for (let i = 0; i < $scope.recordProductAttributes.length; i++) {
                if ($scope.recordProductAttributes[i].Id === item.Id) {
                    srcIndex = i;
                    break;
                }
            }
            list.splice(srcIndex, 1);
            list.splice(targetIndex, 0, item);
            $scope.resequenceItems(list);
        };

        /**
         * Resequence product attributes after sorting list.
         * @param {Array} list - List of product attributes.
         */
        $scope.resequenceItems = function (list) {
            const attributeDisplaySequence = {};

            for (let i = 0; i < list.length; i++) {
                list[i][$rootScope.nsPrefix + 'AttributeDisplaySequence__c'] = i;
                attributeDisplaySequence[list[i].Id] = list[i][$rootScope.nsPrefix + 'AttributeDisplaySequence__c'].toString();
            }
            const inputMap = {
                attributeSequence: attributeDisplaySequence,
                productId: $scope.params.id,
                productRecordType: $rootScope.productRecordType
            };

            InsProductAttributesService.reorderAttributes($scope, inputMap);
        }

        $scope.vlocAttrs.card = [];
        $rootScope.notification.active = false;
        $scope.notificationHandler = new NotificationHandler();

        $scope.vlocAttrs.initData = function (productId, length, classOverride) {
            $scope.productId = productId;
            $scope.vlocAttrs.length = length;
            $rootScope.classOverride = classOverride; //Maps ids of Class attributes that are overridden at product level
        };

        $scope.vlocAttrs.setOrder = function (field) {
            $scope.vlocAttrs.order = field;
            field = field.slice(2, field.length - 2);
            $scope.vlocAttrs.orderBy = field;
        };
        InsProductAttributesService.getCategories($scope);

        $scope.vlocAttrs.getCategoryAttributes = function (category) {
            if (!category.attrs || category.attrs.length < 1) {
                var inputMap = {
                    categoryCode: category.categoryCode,
                    productId: $scope.productId
                };
                InsProductAttributesService.getCategoryAttributes($scope, inputMap, category);
            }
            $rootScope.isLoaded = true;
        };

        $scope.startAttributeDragging = function () {
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

        // Removes event listener when dragging ends
        $scope.endAttributeDragging = function () {
            $rootScope.dragging = false;
            $scope.throttledAutoScrollUp.cancel();
        };

        $scope.vlocAttrs.newAttr = function (attr, category) {
            $rootScope.config.attr = {};
            $rootScope.config.attr.Name = attr.attributeName;
            $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeName__c'] = attr.attributeName;
            $rootScope.config.attr[$rootScope.nsPrefix + 'CategoryCode__c'] = attr.categoryCode;
            $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeId__c'] = attr.attributeId;
            $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeUniqueCode__c'] = attr.attributeCode;
            $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeGroupType__c'] = attr.attributeGroupType;
            $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeCategoryId__c'] = category.categoryId;
            $rootScope.config.attr[$rootScope.nsPrefix + 'CategoryName__c'] = category.categoryName;
            $rootScope.config.attr[$rootScope.nsPrefix + 'ObjectId__c'] = $scope.productId;
            $rootScope.config.attr[$rootScope.nsPrefix + 'IsRequired__c'] = false;
            $rootScope.config.attr[$rootScope.nsPrefix + 'IsReadOnly__c'] = false;
            $rootScope.config.attr[$rootScope.nsPrefix + 'IsRatingAttribute__c'] = false;
            $rootScope.config.attr[$rootScope.nsPrefix + 'IsActiveAssignment__c'] = true;
            $rootScope.config.attr[$rootScope.nsPrefix + 'IsConfigurable__c'] = false;
            $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeDisplayNameOverride__c'] = attr.attributeName;
            $rootScope.config.attr[$scope.nsPrefix + 'ValidValuesData__c'] = [];
            $rootScope.config.attr[$rootScope.nsPrefix + 'IsHidden__c'] = attr.isDefaultHidden;
            if (attr.displaySequence && $scope.recordProductAttributes) {
                $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeDisplaySequence__c'] = $scope.recordProductAttributes.length.toString();
            }
            $rootScope.config.attr[$scope.nsPrefix + 'RatingType__c'] = '';
            if ($scope.vlocAttrs.productRecordType === 'InsuredItemSpec' ||
                $scope.vlocAttrs.productRecordType === 'ClaimInjurySpec' ||
                $scope.vlocAttrs.productRecordType === 'ClaimProduct' ||
                $scope.vlocAttrs.productRecordType === 'ClaimPropertySpec') {
                $rootScope.config.attr[$rootScope.nsPrefix + 'IsConfigurable__c'] = true;
            }
            if ($rootScope.productRecordType === 'RatingFactSpec') {
                $rootScope.config.attr[$rootScope.nsPrefix + 'RatingType__c'] = 'Input';
            }
        };

        $scope.vlocAttrs.revertAttrs = function () {
            var inputMap = {
                productAttribute: { Id: $rootScope.config.attr.Id },
                classId: $rootScope.classId,
                rootProductId: $scope.params.id
            };
            console.log('inputMap revert attribute', inputMap);
            InsProductAttributesService.revertToClassAttribute($scope, inputMap);
        };

        $scope.vlocAttrs.saveAttrs = function () {
            let attrName = $rootScope.config.attr.Name;
            $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeDisplayNameOverride__c'] = attrName;
            let input = Object.assign({}, $rootScope.config.attr);
            $rootScope.config.attr.ruleError = false;
            delete input.valueType;
            delete input.inputDisplayType;
            let type = typeof (input[$scope.nsPrefix + 'ValidValuesData__c']);
            let saveRules = angular.copy($rootScope.config.attr.rules);
            if (saveRules) {
                console.log('ruleValidation', saveRules);
                for (let i = 0; i < saveRules.length; i++) {
                    if (saveRules[i] && saveRules[i].validation) {
                        if (!saveRules[i].validation.messageText || !saveRules[i].validation.messageType ||
                            !saveRules[i].validation.ruleType || !saveRules[i].validation.valueExpression) {
                            $rootScope.config.attr.ruleError = true;
                        }
                    }

                    if (saveRules[i].typeAheadKeywords !== null) {
                        delete saveRules[i].typeAheadKeywords;
                    }
                }
                let saveRulesStr = JSON.stringify(saveRules);
                input[$scope.nsPrefix + 'RuleData__c'] = saveRulesStr;
                input[$scope.nsPrefix + 'HasRule__c'] = true;
            }
            if (!input[$scope.nsPrefix + 'IsRatingAttribute__c']) {
                input[$scope.nsPrefix + 'RatingType__c'] = null;
                input[$scope.nsPrefix + 'RatingInput__c'] = null;
                input[$scope.nsPrefix + 'RatingOutput__c'] = null;
            }
            if (input[$scope.nsPrefix + 'RatingType__c'] === 'Output') {
                input[$scope.nsPrefix + 'RatingInput__c'] = null;
            }

            if (input[$scope.nsPrefix + 'RatingType__c'] === 'Input') {
                input[$scope.nsPrefix + 'RatingOutput__c'] = null;
            }
            if (!input[$scope.nsPrefix + 'IsTaxAndFeeRatingAttribute__c']) {
                input[$scope.nsPrefix + 'TaxAndFeeRatingType__c'] = null;
                input[$scope.nsPrefix + 'TaxAndFeeRatingInput__c'] = null;
                input[$scope.nsPrefix + 'TaxAndFeeRatingOutput__c'] = null;
            }
            if (input[$scope.nsPrefix + 'TaxAndFeeRatingType__c'] === 'Output') {
                input[$scope.nsPrefix + 'TaxAndFeeRatingInput__c'] = null;
            }
            if (input[$scope.nsPrefix + 'TaxAndFeeRatingType__c'] === 'Input') {
                input[$scope.nsPrefix + 'TaxAndFeeRatingOutput__c'] = null;
            }
            if (input[$rootScope.nsPrefix + 'AttributeDisplaySequence__c'] !== null && typeof input[$rootScope.nsPrefix + 'AttributeDisplaySequence__c'] === 'number') {
                console.log('display sequence', input[$rootScope.nsPrefix + 'AttributeDisplaySequence__c']);
                input[$rootScope.nsPrefix + 'AttributeDisplaySequence__c'] = input[$rootScope.nsPrefix + 'AttributeDisplaySequence__c'].toString();
            }

            if (input[$scope.nsPrefix + 'ValueDataType__c'] === 'Adjustment' && !input[$scope.nsPrefix + 'AttributeAdjustmentUnits__c']) {
                $rootScope.notification.type = 'error';
                $rootScope.notification.message = $rootScope.vlocity.getCustomLabel('InsProductAttributeMustHaveUnits') || 'Adjustment attribute must have adjustment units';
                $rootScope.notification.active = true;
            }
            if (input[$scope.nsPrefix + 'ValueDataType__c'] === 'Multivalue Picklist') {
                let isValid = validateMultivaluePicklist(input);
                if (!isValid) {
                    $rootScope.notification.type = 'error';
                    //TO - DO: custom label
                    $rootScope.notification.message = $rootScope.vlocity.getCustomLabel('InsProductMulitValuePicklistRequirmentsErrorMsg') || 'The multivalue picklist attribute must have a correctly formatted decoder specified for every value in the list.';
                    $rootScope.notification.active = true;
                }
            } else {
                delete input[$scope.nsPrefix + 'ValueDecoder__c'];
            }
            if (input[$scope.nsPrefix + 'ValueDataType__c'] === 'Adjustment') {
                input[$scope.nsPrefix + 'IsConfigurable__c'] = true;
            }
            if (input[$scope.nsPrefix + 'ValueDataType__c'] !== 'Percent' && input[$scope.nsPrefix + 'ValueDataType__c'] !== 'Adjustment' && input[$scope.nsPrefix + 'ValueDataType__c'] !== 'Number' && input[$scope.nsPrefix + 'ValueDataType__c'] !== 'Currency' && input[$scope.nsPrefix + 'ValueDataType__c'] !== 'Multi Picklist' && input[$scope.nsPrefix + 'ValueDataType__c'] !== 'Picklist' && input[$scope.nsPrefix + 'ValueDataType__c'] !== 'Multivalue Picklist') {
                input[$scope.nsPrefix + 'ValidValuesData__c'] = [];
            }
            if (input[$scope.nsPrefix + 'UIDisplayType__c'] === 'Single Value' && input[$scope.nsPrefix + 'ValueDataType__c'] === 'Currency') {
                input[$scope.nsPrefix + 'ValidValuesData__c'] = [];
            }

            if (input[$scope.nsPrefix + 'ValueDataType__c'] === 'Checkbox') {
                input[$scope.nsPrefix + 'Value__c'] = input[$scope.nsPrefix + 'Value__c'] || false;
            }

            if (!input[$scope.nsPrefix + 'ValueDataType__c']) {
                $rootScope.notification.type = 'error';
                $rootScope.notification.message = $rootScope.vlocity.getCustomLabel('InsProductAttributeMustHaveDataType') || 'Attribute must have data type assignment';
                $rootScope.notification.active = true;
            } else if (input[$scope.nsPrefix + 'ValueDataType__c'] && !$rootScope.notification.active) {
                if (input[$scope.nsPrefix + 'ValidValuesData__c'] && type !== 'string') {
                    if (input[$scope.nsPrefix + 'ValueDataType__c'] === 'Multi Picklist') {
                        input[$scope.nsPrefix + 'Value__c'] = [];
                        for (var option in input[$scope.nsPrefix + 'ValidValuesData__c']) {
                            if (input[$scope.nsPrefix + 'ValidValuesData__c'][option].isDefault) {
                                input[$scope.nsPrefix + 'Value__c'].push(input[$scope.nsPrefix + 'ValidValuesData__c'][option].value);
                            }
                        }
                    }
                    if (input[$scope.nsPrefix + 'ValueDataType__c'] !== 'Multi Picklist') {
                        for (var option in input[$scope.nsPrefix + 'ValidValuesData__c']) {
                            if (input[$scope.nsPrefix + 'ValidValuesData__c'][option].isDefault) {
                                input[$scope.nsPrefix + 'Value__c'] = input[$scope.nsPrefix + 'ValidValuesData__c'][option].value;
                            }
                        }
                    }
                    if (input[$scope.nsPrefix + 'ValidValuesData__c'] && input[$scope.nsPrefix + 'ValidValuesData__c'].length === 0) {
                        delete input[$scope.nsPrefix + 'ValidValuesData__c'];
                    } else {
                        if (input[$scope.nsPrefix + 'ValidValuesData__c'] && input[$scope.nsPrefix + 'ValidValuesData__c'].step) {
                            if (input[$scope.nsPrefix + 'ValidValuesData__c'].step <= input[$scope.nsPrefix + 'ValidValuesData__c'].max && input[$scope.nsPrefix + 'ValidValuesData__c'].step > 0) {
                                var r = input[$scope.nsPrefix + 'ValidValuesData__c'].max % input[$scope.nsPrefix + 'ValidValuesData__c'].step;
                                if (r !== 0 && input[$scope.nsPrefix + 'ValidValuesData__c'].step <= input[$scope.nsPrefix + 'ValidValuesData__c'].max) {
                                    while (r !== 0) {
                                        input[$scope.nsPrefix + 'ValidValuesData__c'].step += 1;
                                        console.log(input[$scope.nsPrefix + 'ValidValuesData__c'].step);
                                        r = input[$scope.nsPrefix + 'ValidValuesData__c'].max % input[$scope.nsPrefix + 'ValidValuesData__c'].step;
                                        console.log(r);
                                    }
                                }
                            } else {
                                input[$scope.nsPrefix + 'ValidValuesData__c'].step = input[$scope.nsPrefix + 'ValidValuesData__c'].max;
                            }

                            input[$scope.nsPrefix + 'ValidValuesData__c'].min = input[$scope.nsPrefix + 'ValidValuesData__c'].max * (-1);
                            input[$scope.nsPrefix + 'Value__c'] = 0;
                        }
                        input[$scope.nsPrefix + 'ValidValuesData__c'] = JSON.stringify(input[$scope.nsPrefix + 'ValidValuesData__c']);
                    }
                }
                type = typeof (input[$scope.nsPrefix + 'Value__c']);
                if (type && type !== 'string') {
                    if (input[$rootScope.nsPrefix + 'ValueDataType__c'] !== 'Date' &&
                        input[$rootScope.nsPrefix + 'ValueDataType__c'] !== 'Datetime') {
                        input[$scope.nsPrefix + 'Value__c'] = JSON.stringify(input[$scope.nsPrefix + 'Value__c']);
                    }
                }

                var inputMap = {
                    productAttribute: JSON.stringify(input),
                    productId: $scope.params.id
                };
                if (!$rootScope.config.attr.ruleError) {
                    if (!$rootScope.config.attr.Id) {
                        inputMap.productRecordType = $rootScope.productRecordType;
                        $rootScope.typeaheadAttributeNames = null; // set to null to refetch typeahead for newly added attribute
                        InsProductAttributesService.createProductAttribute($scope, inputMap, attrName);
                    } else {
                        inputMap.productRecordType = $rootScope.productRecordType;
                        InsProductAttributesService.updateProductAttributes($scope, inputMap, attrName, $rootScope.config.attr);
                    }
                } else {
                    var error = {
                        data: {
                            message: $rootScope.vlocity.getCustomLabel('InsProductUnableToUpdateMessage') || 'Unable to Update. Fix Error in Rules For Product Attribute.'
                        }
                    };
                    $scope.notificationHandler.handleError(error);
                }
            }
        };

        $scope.vlocAttrs.deleteAttr = function () {
            var input = $rootScope.config.attr;
            delete input.valueType;
            delete input.inputDisplayType;
            var inputMap = {
                productAttribute: JSON.stringify($rootScope.config.attr),
                productRecordType: $rootScope.productRecordType
            };
            InsProductAttributesService.deleteProductAttributes($scope, inputMap);
        };

        $scope.vlocAttrs.processFieldSet = function (fieldSet) {
            $rootScope.config.fieldSet = {};
            if (fieldSet) {
                for (var i = 0; i < fieldSet.length; i++) {
                    $rootScope.config.fieldSet[fieldSet[i].fieldName] = fieldSet[i];
                }
            }
            $rootScope.isLoaded = true;
        };

        //If there isn't a card specified for record type, use 'Default';
        $scope.vlocAttrs.showCard = function (cards, recordType) {
            var values = {};
            for (var i = 0; i < cards.length; i++) {
                if (!values[cards[i].sessionVars[0].val]) {
                    values[cards[i].sessionVars[0].val] = [cards[i]];
                } else {
                    values[cards[i].sessionVars[0].val].push(cards[i]);
                }

            }
            if (values[recordType]) {
                $scope.vlocAttrs.cards = values[recordType];
            } else {
                $scope.vlocAttrs.cards = values.Default;
                recordType = 'Default';
            }
            $scope.vlocAttrs.productRecordType = recordType;
        };

        $scope.vlocAttrs.showRules = function () {
            if (!$rootScope.config.attr.rules) {
                $rootScope.config.attr.rules = [];
            }

            var records = {
                record: $rootScope.config.attr,
                rules: $rootScope.config.attr.rules,
                rulesOptions: $scope.rulesOptions,
                customLabels: $scope.customLabels
            };

            var originalRulesCopy = angular.copy($rootScope.config.attr.rules);
            InsQuoteModalService.launchModal(
                $scope,
                'ins-product-attributes-rules-modal',
                records,
                '',
                'vloc-quote-modal',
                function () {
                    if (($rootScope.config.attr.rules && originalRulesCopy && $rootScope.config.attr.rules.length > originalRulesCopy.length) || !angular.equals($rootScope.config.attr.rules, originalRulesCopy)) {
                        $scope.vlocAttrs.saveAttrs();
                    }
                }
            );
        };

        /*
        * Function to validate value decoder and multivalue picklist options
        * Value Decoder must contain the same amount of split values as options
        */
        function validateMultivaluePicklist(input) {
            input[$scope.nsPrefix + 'UIDisplayType__c'] = 'Dropdown';

            //Require value decoder text
            if (!input[$scope.nsPrefix + 'ValueDecoder__c'] || input[$scope.nsPrefix + 'ValueDecoder__c'].length === 0) {
                return false;
            }

            //find decoder character
            let match = input[$scope.nsPrefix + 'ValueDecoder__c'].search(/[/!@#%&*()\*?+^${}[\]().|\\]/);
            let decoder = {
                char: input[$scope.nsPrefix + 'ValueDecoder__c'][match],
                arr: [],
                maxDropdownOption: []
            };

            if (!decoder.char) {
                return false; //if there's not split character return false
            }

            decoder.arr = input[$scope.nsPrefix + 'ValueDecoder__c'].split(decoder.char);

            //Validate Decoder:
            let isValid = validateDecoderText(decoder);
            if (!isValid) {
                return false;
            }

            //Validate Dropdown Options;
            isValid = validateDropdownOptions(decoder, input);
            return isValid;
        }

        //Helper function to validate value decoder text
        function validateDecoderText(decoder) {
            if (decoder.arr.length <= 1) {
                return false;
            }
            for (let i = 0; i < decoder.arr.length; i++) {
                let match = decoder.arr[i].search(/[/!@#%&*()\*?+^${}[\]().|\\]/);
                if (match >= 0) {
                    return false; //only one special character should be used in value decoder
                }
            }
            return true;
        }

        //Helper functiont to validate dropdown options are consistent with decoder
        function validateDropdownOptions(decoder, input) {
            for (let i = 0; i < input[$scope.nsPrefix + 'ValidValuesData__c'].length; i++) {
                let option = input[$scope.nsPrefix + 'ValidValuesData__c'][i];
                let parsed = option.value.split(decoder.char);
                let match = parsed[0].search(/[/!@#%&*()\*?+^${}[\]().|\\]/);
                if (match >= 0) {
                    return false; //using other special characters
                }
                if (parsed.length > decoder.maxDropdownOption.length) {
                    decoder.maxDropdownOption = parsed;
                }
            }
            if (decoder.maxDropdownOption.length !== decoder.arr.length) {
                return false; //the option with the most splits needs to be entirely covered by the value decoder splits
            }
            return true;
        }

    }]);

},{}],5:[function(require,module,exports){
angular.module('insProductAttributes').controller('InsProductAttributesRowController',
    ['$scope', '$rootScope', '$timeout', 'dataService', 'userProfileService', function(
    $scope, $rootScope, $timeout, dataService, userProfileService) {
    'use strict';
    $scope.row = {};
    $scope.customLabels = {};

    $scope.vlocValueRow = function(dataType){
        return dataType.toLowerCase();
    };

    $scope.getIndex = function(i){
        return parseInt(i) + 1;
    };

    const translationKeys = ['InsProductCurrency', 'InsProductPercentage', 'InsProductText', 'InsProductNumber', 'InsProductCheckbox', 'InsInheritedAttribute',
        'InsProductDatetime', 'InsProductDate', 'InsProductAdjustment', 'InsProductPicklist', 'InsProductMultipicklist', 'InsParentClassAttributeOverride'];

    const valueDataTypeConstants = [
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
            translationKey:'InsProductDatetime'
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


    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                $scope.customLabels = translatedLabels;
                for (let i = 0; i < valueDataTypeConstants.length; i++) {
                    const valueDataType = valueDataTypeConstants[i];
                    const translationKey = valueDataType.translationKey;
                    valueDataType.label = translatedLabels[translationKey];
                }
            }
        );
    })




    $scope.getTranslatedDataType = function(dataType){
        for (let i = 0; i < valueDataTypeConstants.length; i++) {
            if(valueDataTypeConstants[i].key === dataType) {
                return valueDataTypeConstants[i].label;
            }
        }
        return dataType;
    };

    $scope.setRowData = function(obj, index){
        $scope.row = obj;
        if($scope.row[$rootScope.nsPrefix + 'ValidValuesData__c']){
            $scope.row[$rootScope.nsPrefix + 'ValidValuesData__c'] = typeof $scope.row[$rootScope.nsPrefix + 'ValidValuesData__c'] === 'string' ?
                JSON.parse($scope.row[$rootScope.nsPrefix + 'ValidValuesData__c']) : $scope.row[$rootScope.nsPrefix + 'ValidValuesData__c'];
        }

        if($scope.row[$rootScope.nsPrefix + 'ValueDataType__c']){
            $scope.row.valueType = $scope.row[$rootScope.nsPrefix + 'ValueDataType__c'].toLowerCase();
        }

        if($scope.row[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Multi Picklist'){
            $scope.row[$rootScope.nsPrefix + 'Value__c'] = typeof $scope.row[$rootScope.nsPrefix + 'ValueDataType__c'] === 'string' ?
                JSON.parse($scope.row[$rootScope.nsPrefix + 'Value__c']) : $scope.row[$rootScope.nsPrefix + 'Value__c'];
        }

        if($scope.row[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Checkbox'){
            $scope.row[$rootScope.nsPrefix + 'Value__c'] = $scope.row[$rootScope.nsPrefix + 'Value__c'] === 'true';
        }

        if($scope.row[$rootScope.nsPrefix + 'RuleData__c']){
            $scope.row.rules = typeof $scope.row[$rootScope.nsPrefix + 'RuleData__c'] === 'string' ?
                JSON.parse($scope.row[$rootScope.nsPrefix + 'RuleData__c']) : $scope.row[$rootScope.nsPrefix + 'RuleData__c'];
        }

        if(!$rootScope.config.attr && index === '0'){
            $rootScope.config.attr =  Object.assign({},  $scope.row);
        }

        $rootScope.isLoaded = true;
    };

    $scope.setAttr = function(row, index){
        if (row[$rootScope.nsPrefix + 'Value__c'] && row[$rootScope.nsPrefix + 'Value__c'] !== 'null' && row[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Number') {
            row[$rootScope.nsPrefix + 'Value__c'] = parseFloat(row[$rootScope.nsPrefix + 'Value__c']);
        }
        if (row[$rootScope.nsPrefix + 'Value__c'] && row[$rootScope.nsPrefix + 'Value__c'] !== 'null' && row[$rootScope.nsPrefix + 'ValueDataType__c'] === 'Date') {
            row[$rootScope.nsPrefix + 'Value__c'] = formatDateToString(row[$rootScope.nsPrefix + 'Value__c']);
        }

        $rootScope.config.attr =  Object.assign({}, row);
        row.selected = true;
        $rootScope.index = index;
        if(typeof $rootScope.config.attr[$rootScope.nsPrefix + 'RuleData__c'] === 'string'){
          $rootScope.config.attr.rules = JSON.parse($rootScope.config.attr[$rootScope.nsPrefix + 'RuleData__c']);
        } else {
          $rootScope.config.attr.rules = $rootScope.config.attr[$rootScope.nsPrefix + 'RuleData__c'];

        }
    };

    const formatDateToString = function(str) {
        const date = new Date(str);
        const month = date.getUTCMonth() + 1;
        const fullMonth = month < 10 ? '0' + month : month;
        const dateUTC = date.getUTCDate();
        const fullDate = dateUTC < 10 ? '0' + dateUTC : dateUTC;
        return fullMonth + '/' + fullDate + '/' + (date.getUTCFullYear());
    }

    $scope.convertType = function(row, key){
        var t = key.substring(2, key.length - 2);
        row[key] = row[t];
    };
}]);

},{}],6:[function(require,module,exports){
angular.module('insProductAttributes').directive('hideNotification', function($rootScope, $timeout) {
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

},{}],7:[function(require,module,exports){
angular.module('insProductAttributes').directive('insFocus', ['$timeout', function($timeout) {
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

},{}],8:[function(require,module,exports){
angular.module('insProductAttributes').factory('InsProductAttributesService',
['$rootScope', '$http',  '$q', 'dataSourceService', 'dataService', 'InsValidationHandlerService', 'userProfileService', '$sldsModal',
    function($rootScope, $http, $q, dataSourceService, dataService, InsValidationHandlerService, userProfileService, $sldsModal) {
    'use strict';
    var REMOTE_CLASS = 'InsuranceProductAdminHandler';
    var DUAL_DATASOURCE_NAME = 'Dual';
    var insideOrg = false;
    var errorContainer = {};

    var  refreshList = function() {
        var message = {
            event: 'reload'
        };
        $rootScope.$broadcast('vlocity.layout.ins-product-attributes-container.events', message);
    };

    var refreshAttributes = function(eventType) {
        let message = {
            event: eventType,
        };

        $rootScope.$broadcast('refresh_product_attributes', message);
    }

    const translationKeys = ['InsProductAddedAttrNameMessage', 'InsProductUpdatedAttrNameMessage', 'InsProductDeleteProductAttribute',
        'InsAdminProductAttribute', 'InsParentClassAttribute'];
    let customLabels = {};

    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                customLabels = translatedLabels;
            }
        )
    });

    var scrollTop = function(){
       if ('parentIFrame' in window) {
           window.parentIFrame.scrollTo(0);
       } else {
           $('body').scrollTop(0);
       }
   };

    var launchAttributeJSONModal = function(scope, layout, classAttribute, productAttribute, ctrl, onHide) {
        var modalScope = scope.$new();
        var modalData = {};
        var insModal;
        scrollTop();
        modalScope.isLayoutLoaded = false;
        modalScope.layout = layout;


        if( typeof productAttribute[$rootScope.nsPrefix + 'ValidValuesData__c'] === 'string') {
            productAttribute[$rootScope.nsPrefix + 'ValidValuesData__c'] = JSON.parse(productAttribute[$rootScope.nsPrefix + 'ValidValuesData__c']);
        }

        if(typeof productAttribute[$rootScope.nsPrefix + 'RuleData__c'] === 'string'){
            productAttribute[$rootScope.nsPrefix + 'RuleData__c'] = JSON.parse(productAttribute[$rootScope.nsPrefix + 'RuleData__c'])
        }

        if( typeof classAttribute.classAttributeAssignment[$rootScope.nsPrefix + 'ValidValuesData__c'] === 'string') {
            classAttribute.classAttributeAssignment[$rootScope.nsPrefix + 'ValidValuesData__c'] = JSON.parse(classAttribute.classAttributeAssignment[$rootScope.nsPrefix + 'ValidValuesData__c']);
        }

        if(typeof classAttribute.classAttributeAssignment[$rootScope.nsPrefix + 'RuleData__c'] === 'string'){
            classAttribute.classAttributeAssignment[$rootScope.nsPrefix + 'RuleData__c'] = JSON.parse(classAttribute.classAttributeAssignment[$rootScope.nsPrefix + 'RuleData__c']);
        }


        // Product level attrs
        modalData.productLevelAttrs =  productAttribute;
        // Class level attributes
        modalData.specLevelAttrs = classAttribute.classAttributeAssignment;
        modalData.isAttributeOverriden = true;
        modalData.productSpec = customLabels.InsAdminProductAttribute || 'Product Attribute';
        modalData.originalSpec = customLabels.InsParentClassAttribute || 'Parent Class Attribute';
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
            vlocSlideCustomClass: 'vloc-comparison-overriden-json',
            vlocSlide: true,
            onHide: onHide
        });
    }

    var hideModal = function(){
        angular.element('.slds-modal__close').click();
    }

    return {
        getCategories: function(scope){
            $rootScope.isLoaded = false;
            var effectiveDate = null;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'InsuranceProductAdminHandler';
            datasource.value.remoteMethod = 'getCategories';
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.apexRestResultVar = 'result.records';
            console.log('datasource', datasource);
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    scope.vlocAttrs.categories = data.categories;
                    deferred.resolve(data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    InsValidationHandlerService.throwError(error);
                    $rootScope.isLoaded = true;
                });
            return  deferred.promise;
        },
        getCategoryAttributes: function(scope, inputMap, category){
            $rootScope.isLoaded = false;
            var effectiveDate = null;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'InsuranceProductAdminHandler';
            datasource.value.remoteMethod = 'getCategoryAttributes';
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.inputMap = inputMap;
            datasource.value.apexRestResultVar = 'result.records';
            console.log('datasource', datasource);
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    for(var i = 0; i < data.attributes.length; i++){
                        data.attributes[i].show = true;
                    }
                    category.attrs = data.attributes;
                    deferred.resolve(data);
                    $rootScope.isLoaded = true;
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    InsValidationHandlerService.throwError(error);
                    $rootScope.isLoaded = true;
                });
            return  deferred.promise;
        }, createProductAttribute : function(scope, inputMap, attrName){
            $rootScope.isLoaded = false;
            var effectiveDate = null;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'InsuranceProductAdminHandler';
            datasource.value.remoteMethod = 'saveProductAttribute';
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.inputMap = inputMap;
            datasource.value.apexRestResultVar = 'result.records';
            console.log('datasource', datasource);
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    $rootScope.config.attr.Id = data.Id;
                    $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeDisplayName__c'] = data.displayName;

                    var message = ($rootScope.vlocity.getCustomLabel('InsProductAddedAttrNameMessage') || '').replace(/\{0\}/g, attrName) || 'Added ' + attrName + ' Successfully';
                    //Hide from attr list:
                    for(var i = 0; i < scope.vlocAttrs.categories.length; i++){
                        var cat = scope.vlocAttrs.categories[i];
                        var catid = $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeCategoryId__c'];
                        if(cat.categoryId === catid){
                            for(var j = 0; j < cat.attrs.length; j++){
                                var attr = cat.attrs[j];
                                var attrid = $rootScope.config.attr[$rootScope.nsPrefix +  'AttributeId__c'];
                                if(attr.attributeId ===  attrid){
                                     attr.show = false;
                                }
                            }
                        }
                    }
                    refreshAttributes('createProductAttribute');
                    scope.notificationHandler.handleSuccess(message);
                    scope.notificationHandler.hide();
                    refreshList();
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    scope.notificationHandler.handleError(error);
                    scope.notificationHandler.hide();
                    $rootScope.isLoaded = true;
                });
            return  deferred.promise;
        },
        reorderAttributes : function(scope, inputMap){
            var effectiveDate = null;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'InsuranceProductAdminHandler';
            datasource.value.remoteMethod = 'reorderAttributes';
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.inputMap = inputMap;
            datasource.value.apexRestResultVar = 'result.records';
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    deferred.resolve(data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    scope.notificationHandler.handleError(error);
                    scope.notificationHandler.hide();
                });
            return deferred.promise;
        },
        getProductAttributes: function(scope, inputMap){
            $rootScope.isLoaded = false;
            var effectiveDate = null;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'InsuranceProductAdminHandler';
            datasource.value.remoteMethod = 'getProductAttributes';
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.inputMap = inputMap;
            datasource.value.apexRestResultVar = 'result.records';
            console.log('datasource', datasource);
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log('data returned from getproduct attrs', data);
                    deferred.resolve(data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    $rootScope.isLoaded = true;
                });
            return  deferred.promise;
        },
        updateProductAttributes : function(scope, inputMap, attrName){
            $rootScope.isLoaded = false;
            var effectiveDate = null;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'InsuranceProductAdminHandler';
            datasource.value.remoteMethod = 'updateProductAttribute';
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.inputMap = inputMap;
            datasource.value.apexRestResultVar = 'result.records';
            console.log('datasource', datasource);
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    deferred.resolve(data);
                    var message = ($rootScope.vlocity.getCustomLabel('InsProductUpdatedAttrNameMessage') || '').replace(/\{0\}/g, attrName) || 'Updated ' + attrName + ' Successfully';
                    scope.notificationHandler.handleSuccess(message);
                    scope.notificationHandler.hide();
                    refreshList();
                    refreshAttributes('updateProductAttributes');
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    scope.notificationHandler.handleError(error);
                    scope.notificationHandler.hide();
                    $rootScope.isLoaded = true;
                });
            return  deferred.promise;
        },
        revertToClassAttribute: function(scope, inputMap){
            console.log('revertToClassAttribute', inputMap);
            $rootScope.isLoaded = false;
            var effectiveDate = null;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'InsuranceProductAdminHandler';
            datasource.value.remoteMethod = 'revertToClassAttribute';
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.inputMap = inputMap;
            datasource.value.apexRestResultVar = 'result.records';
            console.log('datasource', datasource);
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    deferred.resolve(data);
                    refreshAttributes('revertProductAttributes');
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    $rootScope.isLoaded = true;
                });
            return  deferred.promise;
        },
        getClassAttribute: function(scope, inputMap, config){
            console.log('getClassAttribute inputMap', inputMap);
            $rootScope.isLoaded = false;
            var effectiveDate = null;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'InsuranceProductAdminHandler';
            datasource.value.remoteMethod = 'getClassAttribute';
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.inputMap = inputMap;
            datasource.value.apexRestResultVar = 'result.records';
            console.log('datasource', datasource);
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    deferred.resolve(data);
                    launchAttributeJSONModal(
                        scope,
                        'ins-product-attributes-json-modal',
                        data,
                        config.attr,
                        'InsProductAttributesController',
                        function () {
                            // Reset: Onclose of modal, $rootScope.config becomes undefined
                            $rootScope.config = config;
                        }
                    );
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    $rootScope.isLoaded = true;
                });
            return  deferred.promise;
        }, deleteProductAttributes : function(scope, inputMap){
            $rootScope.isLoaded = false;
            var effectiveDate = null;
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'InsuranceProductAdminHandler';
            datasource.value.remoteMethod = 'deleteProductAttribute';
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.inputMap = inputMap;
            datasource.value.apexRestResultVar = 'result.records';
            console.log('datasource', datasource);
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    $rootScope.index = 0;
                    $rootScope.config.show = false;
                    refreshList();
                    var message = $rootScope.vlocity.getCustomLabel('InsProductDeleteProductAttribute') || 'Deleted Product Attribute Successfully';
                    scope.notificationHandler.handleSuccess(message);
                    scope.notificationHandler.hide();
                    //Show Attribute In List
                    for(var i = 0; i < scope.vlocAttrs.categories.length; i++){
                        var cat = scope.vlocAttrs.categories[i];
                        var catid = $rootScope.config.attr[$rootScope.nsPrefix + 'AttributeCategoryId__c'];
                        if(cat.categoryId === catid && cat.attrs){
                            for(var j = 0; j < cat.attrs.length; j++){
                                var attr = cat.attrs[j];
                                var attrid = $rootScope.config.attr[$rootScope.nsPrefix +  'AttributeId__c'];
                                if(attr.attributeId ===  attrid){
                                     attr.show = true;
                                }
                            }
                        }
                    }
                    refreshAttributes('deleteProductAttributes');
                    $rootScope.isLoaded = true;
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    scope.notificationHandler.handleError(error);
                    scope.notificationHandler.hide();
                    $rootScope.isLoaded = true;
                });
            return  deferred.promise;
        }
    };
}]);

},{}],9:[function(require,module,exports){
angular.module('insProductAttributes').factory('InsQuoteModalService',
['$rootScope', '$sldsModal', '$timeout', 'InsProductAttributesService', 'dataService',
function($rootScope, $sldsModal, $timeout, InsProductAttributesService, dataService) {
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
            modalScope.title = records.title || $rootScope.vlocity.getCustomLabel('InsProductAttributeRules') || 'Attribute Rules'; 
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
        hideModal : function(){
            angular.element('.slds-modal__close').click();
        }
    };
}]);

},{}],10:[function(require,module,exports){
angular.module('insProductAttributes').factory('NotificationHandler', 
    ['$rootScope', '$timeout', function($rootScope, $timeout){
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
},{}],11:[function(require,module,exports){
angular.module("insProductAttributes").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("modals/ins-quote-modal.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{vlocSlideCustomClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{vlocSlideCustomClass}}-container">\n        <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()" ng-if="!vlocSlideHeader">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Close</span>\n        </button>\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n        </header>\n        <div class="slds-modal__content slds-p-around_medium vloc-modal-content slds-is-relative">\n            <vloc-layout layout-name="{{layout}}" class="{{layout}}" is-loaded="isLayoutLoaded" records="records" ctrl="{{ctrl}}"></vloc-layout>\n        </div>\n        <footer class="slds-modal__footer slds-float_right slds-p-right_large" ng-if="records.modalType === \'Edit\'">\n        <button class="slds-button slds-button_brand" ng-if="!records.Id" ng-click="importedScope.vlocQuote.addNewClass(records, vlocQuote)">Save</button>\n        <button class="slds-button slds-button_brand" ng-if="records.Id" ng-click="importedScope.vlocQuote.updateClass(records, vlocQuote)">Update</button>\n        <button class="slds-button slds-button_neutral" ng-click="$slideHide()">Cancel</button>\n        </footer>\n    </div>\n</div>\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -100%;\n        margin-bottom: 45px;\n        height: auto;\n        transition: top 500ms ease-in;\n        max-height: 700px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__header {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .slds-modal__footer {\n        border-radius: 0;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: auto;\n        width: 70%;\n        min-width: 70%;\n        max-width: 70%;\n        padding: 0;\n        margin: 0;\n        position: absolute;\n        top: 17rem;\n        left: 50%;\n        transform: translateY(-50%) translateX(-50%);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 30rem;\n        max-height: 0;\n        border-radius: 0;\n        width: 100%;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); /* leaving room for iPhone notification bar */\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; /* Android doesn\'t need the 20px of room like iPhone */\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>'),$templateCache.put("modals/ins-attribute-json-diff.tpl.html",'<div class="slds-modal slds-fade-in-open slds-modal_medium vloc-modal vloc-modal-slds-slide-up {{vlocSlideCustomClass}}" ng-init="isModalLoaded = !isModalLoaded">\n    <div class="slds-modal__container vloc-modal-container {{vlocSlideCustomClass}}-container">\n        <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()" ng-if="!vlocSlideHeader">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Close</span>\n        </button>\n        <header class="slds-modal__header slds-is-relative" ng-show="vlocSlideHeader">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close vloc-align-{{vlocSlideMobileClose}}" ng-click="$slideHide()">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 ng-show="title" class="slds-text-heading_medium slds-hyphenate" ng-bind="title"></h2>\n        </header>\n        <div class="slds-modal__content vloc-modal-content slds-is-relative">\n            <div class="slds-spinner_container" ng-class="{\'vloc-show-loader\': !isModalLoaded}">\n                <div class="slds-spinner_brand slds-spinner slds-spinner_large slds-m-top_x-large slds-m-bottom_x-large" aria-hidden="false" role="alert">\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n              <vloc-layout layout-name="{{layout}}" class="{{layout}}" is-loaded="isLayoutLoaded" records="records" ctrl="{{ctrl}}"></vloc-layout>\n        </div>\n        \x3c!-- <footer class="slds-modal__footer" ng-show="vlocSlideFooter">\n            <button class="slds-button slds-button_neutral" ng-click="$slideHide()">Cancel</button>\n        </footer> --\x3e\n    </div>\n</div>\n<style type="text/css">\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        top: -100%;\n        margin-bottom: 45px;\n        height: auto;\n        transition: top 250ms ease-in;\n        position: absolute;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0ms linear 1250ms,\n                    opacity 500ms ease-in 750ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-spinner_container.vloc-show-loader {\n        opacity: 1;\n        visibility: visible;\n        transition: visibility 0ms linear 0ms,\n                    opacity 500ms ease-in 0ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .slds-global-header_container {\n        opacity: 0;\n        transition: opacity 200ms ease-in 200ms;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        top: 45px;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal.vloc-modal-shown\n    .slds-global-header_container {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-edit-insured-item-modal {\n        position: absolute;\n    }\n\n    .vlocity.via-slds .slds-modal\n    .slds-modal__container.vloc-modal-container.vloc-comparison-overriden-json-container {\n        width: 90%;\n        min-width: 90%;\n        max-width: 90%;\n    }\n\n    .vlocity.via-slds .slds-modal\n    .slds-modal__container.vloc-modal-container.vloc-comparison-original-json-container {\n        width: 50%;\n        min-width: 50%;\n        max-width: 50%;\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container {\n        height: auto;\n        max-height: 62rem;\n        padding: 0;\n        margin: 1rem 0 0;\n        position: absolute;\n        left: 50%;\n        transform: translateX(-50%);\n    }\n\n    .vlocity.via-slds\n    .vloc-modal.slds-modal\n    .vloc-modal-container\n    .vloc-modal-content {\n        min-height: 20rem;\n        border-radius: 0;\n        margin-bottom: 2.5rem;\n    }\n\n    @media screen and (max-width: 600px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            height: calc(100% - 20px); /* leaving room for iPhone notification bar */\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; /* Android doesn\'t need the 20px of room like iPhone */\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container {\n            width: 100%;\n            min-width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            transform: none;\n            bottom: 0;\n            transition: bottom 250ms ease-in;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .vloc-modal-container\n        .vloc-modal-content {\n            height: 100%;\n            min-height: auto;\n            max-height: 100%;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>\n')}]);

},{}]},{},[1]);
})();

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
// Include the Visualforce page event handlers
if (typeof Visualforce !== 'undefined') {
    require('./dependencies/native.history.js');
    require('./dependencies/angular-drag-and-drop-lists.js');
    require('./polyfills/Array.find.js');
    require('./polyfills/Array.findIndex.js');
    require('./polyfills/Array.from.js');
    require('./sharedObjectService.js');
    angular.module('omniscriptLwcCompiler', ['vlocity', 'mgcrea.ngStrap']);
    require('./modules/omni-lwc-compiler/config/config.js');
    require('./modules/omni-lwc-compiler/vfPageController.js');
    require('./modules/omni-lwc-compiler/services/bpService.js');
    require('./modules/omni-lwc-compiler/services/compilerService.js');
    require('./modules/omni-lwc-compiler/services/toolingService.js');
}

require('./modules/omni-lwc-compiler/compiler/compiler.js');
},{"./dependencies/angular-drag-and-drop-lists.js":2,"./dependencies/native.history.js":3,"./modules/omni-lwc-compiler/compiler/compiler.js":7,"./modules/omni-lwc-compiler/config/config.js":9,"./modules/omni-lwc-compiler/services/bpService.js":10,"./modules/omni-lwc-compiler/services/compilerService.js":11,"./modules/omni-lwc-compiler/services/toolingService.js":12,"./modules/omni-lwc-compiler/vfPageController.js":23,"./polyfills/Array.find.js":24,"./polyfills/Array.findIndex.js":25,"./polyfills/Array.from.js":26,"./sharedObjectService.js":27}],2:[function(require,module,exports){
/**
 * angular-drag-and-drop-lists v2.1.0
 *
 * IMPORTANT: This version contains a number of Vlocity OmniScript changes
 *
 * Specifically we don't insert a placeholder element and move it around the dom. Instead we
 * insert a single placeholder element and use css to position it absolutely in the dom.
 * This avoids a lot of layout calls in larger nested trees.
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
     * Use the  dnd-draggable attribute to make your element draggable
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

          document.body.classList.add('dnd-in-progress');

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
      element.on('dragend', function (event) {
          document.body.classList.remove('dnd-in-progress');

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
      var placeholder = angular.element('<div class="dndPlaceholder"></div>');
      $('body').append(placeholder);
      return function(scope, element, attr) {
        // While an element is dragged over the list, this placeholder element is inserted
        // at the location where the element would be inserted after dropping.
        // var placeholder = getPlaceholderElement();
        // placeholder.remove();
        // laceholder);

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
          var isFirstHalf, rect;

          // Check whether the drop is allowed and determine mime type.
          var mimeType = getMimeType(event.dataTransfer.types);
          var itemType = getItemType(mimeType);
          if (!mimeType || !isDropAllowed(itemType)) return true;

          // Make sure the placeholder is shown, which is especially important if the list is empty.
          // if (placeholderNode.parentNode != listNode) {
          //   element.append(placeholder);
          // }

          if (event.target != listNode) {
            // Try to find the node direct directly below the list node.
            var listItemNode = event.target;
            while (listItemNode.parentNode != listNode && listItemNode.parentNode) {
              listItemNode = listItemNode.parentNode;
            }

            if (listItemNode.parentNode == listNode && listItemNode != placeholderNode) {
              // If the mouse pointer is in the upper half of the list item element,
              // we position the placeholder before the list item, otherwise after it.
              rect = listItemNode.getBoundingClientRect();
              if (listSettings.horizontal) {
                isFirstHalf = event.clientX < rect.left + rect.width / 2;
              } else {
                isFirstHalf = event.clientY < rect.top + rect.height / 2;
              }

              $(placeholder).css({
                position: 'absolute',
                visibility: 'visible',
                top: (isFirstHalf ? rect.y: rect.y + rect.height ) + window.scrollY,
                left: rect.left - 4,
                width: (rect.width + 8),
                opacity: 1
              });
              var placeholderIndex = Array.prototype.indexOf.call(listNode.children, listItemNode) + (isFirstHalf ? 0 : 1);
              if ($(placeholder).data('currentIndex') !== placeholderIndex) {
                $(placeholder).data('currentIndex', placeholderIndex);
              }
            }
          } else {
            rect = event.target.getBoundingClientRect();
            var top = rect.y;
            if (event.target.children.length > 0) {
              var lastItem = event.target.children[event.target.children.length - 1].getBoundingClientRect();
              top = lastItem.y + lastItem.height;
            }
            $(placeholder).css({
              position: 'absolute',
              visibility: 'visible',
              top: top + window.scrollY,
              left: rect.left - 4,
              width: rect.width + 8,
              opacity: 1
            });
            if ($(placeholder).data('currentIndex') !== event.target.children.length) {
              $(placeholder).data('currentIndex', event.target.children.length);
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
        document.body.classList.remove('dnd-in-progress');

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
          placeholder.css({
            transition: "opacity 0s",
            opacity: 0
          });
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
          return $(placeholder).data('currentIndex');
          //return Array.prototype.indexOf.call(listNode.children, placeholderNode);
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
          placeholder = $(document.querySelector('.dndPlaceholder'));
          return placeholder || angular.element("<div class='dndPlaceholder'></div>");
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
typeof JSON!="object"&&(JSON={}),function(){"use strict";function f(e){return e<10?"0"+e:e}function quote(e){return escapable.lastIndex=0,escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t=="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];a&&typeof a=="object"&&typeof a.toJSON=="function"&&(a=a.toJSON(e)),typeof rep=="function"&&(a=rep.call(t,e,a));switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a)return"null";gap+=indent,u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1)u[n]=str(n,a)||"null";return i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]",gap=o,i}if(rep&&typeof rep=="object"){s=rep.length;for(n=0;n<s;n+=1)typeof rep[n]=="string"&&(r=rep[n],i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i))}else for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i));return i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}",gap=o,i}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(e){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(e){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(e,t,n){var r;gap="",indent="";if(typeof n=="number")for(r=0;r<n;r+=1)indent+=" ";else typeof n=="string"&&(indent=n);rep=t;if(!t||typeof t=="function"||typeof t=="object"&&typeof t.length=="number")return str("",{"":e});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i=="object")for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r=walk(i,n),r!==undefined?i[n]=r:delete i[n]);return reviver.call(e,t,i)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),function(e,t){"use strict";var n=e.History=e.History||{};if(typeof n.Adapter!="undefined")throw new Error("History.js Adapter has already been loaded...");n.Adapter={handlers:{},_uid:1,uid:function(e){return e._uid||(e._uid=n.Adapter._uid++)},bind:function(e,t,r){var i=n.Adapter.uid(e);n.Adapter.handlers[i]=n.Adapter.handlers[i]||{},n.Adapter.handlers[i][t]=n.Adapter.handlers[i][t]||[],n.Adapter.handlers[i][t].push(r),e["on"+t]=function(e,t){return function(r){n.Adapter.trigger(e,t,r)}}(e,t)},trigger:function(e,t,r){r=r||{};var i=n.Adapter.uid(e),s,o;n.Adapter.handlers[i]=n.Adapter.handlers[i]||{},n.Adapter.handlers[i][t]=n.Adapter.handlers[i][t]||[];for(s=0,o=n.Adapter.handlers[i][t].length;s<o;++s)n.Adapter.handlers[i][t][s].apply(this,[r])},extractEventData:function(e,n){var r=n&&n[e]||t;return r},onDomLoad:function(t){var n=e.setTimeout(function(){t()},2e3);e.onload=function(){clearTimeout(n),t()}}},typeof n.init!="undefined"&&n.init()}(window),function(e,t){"use strict";var n=e.document,r=e.setTimeout||r,i=e.clearTimeout||i,s=e.setInterval||s,o=e.History=e.History||{};if(typeof o.initHtml4!="undefined")throw new Error("History.js HTML4 Support has already been loaded...");o.initHtml4=function(){if(typeof o.initHtml4.initialized!="undefined")return!1;o.initHtml4.initialized=!0,o.enabled=!0,o.savedHashes=[],o.isLastHash=function(e){var t=o.getHashByIndex(),n;return n=e===t,n},o.isHashEqual=function(e,t){return e=encodeURIComponent(e).replace(/%25/g,"%"),t=encodeURIComponent(t).replace(/%25/g,"%"),e===t},o.saveHash=function(e){return o.isLastHash(e)?!1:(o.savedHashes.push(e),!0)},o.getHashByIndex=function(e){var t=null;return typeof e=="undefined"?t=o.savedHashes[o.savedHashes.length-1]:e<0?t=o.savedHashes[o.savedHashes.length+e]:t=o.savedHashes[e],t},o.discardedHashes={},o.discardedStates={},o.discardState=function(e,t,n){var r=o.getHashByState(e),i;return i={discardedState:e,backState:n,forwardState:t},o.discardedStates[r]=i,!0},o.discardHash=function(e,t,n){var r={discardedHash:e,backState:n,forwardState:t};return o.discardedHashes[e]=r,!0},o.discardedState=function(e){var t=o.getHashByState(e),n;return n=o.discardedStates[t]||!1,n},o.discardedHash=function(e){var t=o.discardedHashes[e]||!1;return t},o.recycleState=function(e){var t=o.getHashByState(e);return o.discardedState(e)&&delete o.discardedStates[t],!0},o.emulated.hashChange&&(o.hashChangeInit=function(){o.checkerFunction=null;var t="",r,i,u,a,f=Boolean(o.getHash());return o.isInternetExplorer()?(r="historyjs-iframe",i=n.createElement("iframe"),i.setAttribute("id",r),i.setAttribute("src","#"),i.style.display="none",n.body.appendChild(i),i.contentWindow.document.open(),i.contentWindow.document.close(),u="",a=!1,o.checkerFunction=function(){if(a)return!1;a=!0;var n=o.getHash(),r=o.getHash(i.contentWindow.document);return n!==t?(t=n,r!==n&&(u=r=n,i.contentWindow.document.open(),i.contentWindow.document.close(),i.contentWindow.document.location.hash=o.escapeHash(n)),o.Adapter.trigger(e,"hashchange")):r!==u&&(u=r,f&&r===""?o.back():o.setHash(r,!1)),a=!1,!0}):o.checkerFunction=function(){var n=o.getHash()||"";return n!==t&&(t=n,o.Adapter.trigger(e,"hashchange")),!0},o.intervalList.push(s(o.checkerFunction,o.options.hashChangeInterval)),!0},o.Adapter.onDomLoad(o.hashChangeInit)),o.emulated.pushState&&(o.onHashChange=function(t){var n=t&&t.newURL||o.getLocationHref(),r=o.getHashByUrl(n),i=null,s=null,u=null,a;return o.isLastHash(r)?(o.busy(!1),!1):(o.doubleCheckComplete(),o.saveHash(r),r&&o.isTraditionalAnchor(r)?(o.Adapter.trigger(e,"anchorchange"),o.busy(!1),!1):(i=o.extractState(o.getFullUrl(r||o.getLocationHref()),!0),o.isLastSavedState(i)?(o.busy(!1),!1):(s=o.getHashByState(i),a=o.discardedState(i),a?(o.getHashByIndex(-2)===o.getHashByState(a.forwardState)?o.back(!1):o.forward(!1),!1):(o.pushState(i.data,i.title,encodeURI(i.url),!1),!0))))},o.Adapter.bind(e,"hashchange",o.onHashChange),o.pushState=function(t,n,r,i){r=encodeURI(r).replace(/%25/g,"%");if(o.getHashByUrl(r))throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");if(i!==!1&&o.busy())return o.pushQueue({scope:o,callback:o.pushState,args:arguments,queue:i}),!1;o.busy(!0);var s=o.createStateObject(t,n,r),u=o.getHashByState(s),a=o.getState(!1),f=o.getHashByState(a),l=o.getHash(),c=o.expectedStateId==s.id;return o.storeState(s),o.expectedStateId=s.id,o.recycleState(s),o.setTitle(s),u===f?(o.busy(!1),!1):(o.saveState(s),c||o.Adapter.trigger(e,"statechange"),!o.isHashEqual(u,l)&&!o.isHashEqual(u,o.getShortUrl(o.getLocationHref()))&&o.setHash(u,!1),o.busy(!1),!0)},o.replaceState=function(t,n,r,i){r=encodeURI(r).replace(/%25/g,"%");if(o.getHashByUrl(r))throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");if(i!==!1&&o.busy())return o.pushQueue({scope:o,callback:o.replaceState,args:arguments,queue:i}),!1;o.busy(!0);var s=o.createStateObject(t,n,r),u=o.getHashByState(s),a=o.getState(!1),f=o.getHashByState(a),l=o.getStateByIndex(-2);return o.discardState(a,s,l),u===f?(o.storeState(s),o.expectedStateId=s.id,o.recycleState(s),o.setTitle(s),o.saveState(s),o.Adapter.trigger(e,"statechange"),o.busy(!1)):o.pushState(s.data,s.title,s.url,!1),!0}),o.emulated.pushState&&o.getHash()&&!o.emulated.hashChange&&o.Adapter.onDomLoad(function(){o.Adapter.trigger(e,"hashchange")})},typeof o.init!="undefined"&&o.init()}(window),function(e,t){"use strict";var n=e.console||t,r=e.document,i=e.navigator,s=e.sessionStorage||!1,o=e.setTimeout,u=e.clearTimeout,a=e.setInterval,f=e.clearInterval,l=e.JSON,c=e.alert,h=e.History=e.History||{},p=e.history;try{s.setItem("TEST","1"),s.removeItem("TEST")}catch(d){s=!1}l.stringify=l.stringify||l.encode,l.parse=l.parse||l.decode;if(typeof h.init!="undefined")throw new Error("History.js Core has already been loaded...");h.init=function(e){return typeof h.Adapter=="undefined"?!1:(typeof h.initCore!="undefined"&&h.initCore(),typeof h.initHtml4!="undefined"&&h.initHtml4(),!0)},h.initCore=function(d){if(typeof h.initCore.initialized!="undefined")return!1;h.initCore.initialized=!0,h.options=h.options||{},h.options.hashChangeInterval=h.options.hashChangeInterval||100,h.options.safariPollInterval=h.options.safariPollInterval||500,h.options.doubleCheckInterval=h.options.doubleCheckInterval||500,h.options.disableSuid=h.options.disableSuid||!1,h.options.storeInterval=h.options.storeInterval||1e3,h.options.busyDelay=h.options.busyDelay||250,h.options.debug=h.options.debug||!1,h.options.initialTitle=h.options.initialTitle||r.title,h.options.html4Mode=h.options.html4Mode||!1,h.options.delayInit=h.options.delayInit||!1,h.intervalList=[],h.clearAllIntervals=function(){var e,t=h.intervalList;if(typeof t!="undefined"&&t!==null){for(e=0;e<t.length;e++)f(t[e]);h.intervalList=null}},h.debug=function(){(h.options.debug||!1)&&h.log.apply(h,arguments)},h.log=function(){var e=typeof n!="undefined"&&typeof n.log!="undefined"&&typeof n.log.apply!="undefined",t=r.getElementById("log"),i,s,o,u,a;e?(u=Array.prototype.slice.call(arguments),i=u.shift(),typeof n.debug!="undefined"?n.debug.apply(n,[i,u]):n.log.apply(n,[i,u])):i="\n"+arguments[0]+"\n";for(s=1,o=arguments.length;s<o;++s){a=arguments[s];if(typeof a=="object"&&typeof l!="undefined")try{a=l.stringify(a)}catch(f){}i+="\n"+a+"\n"}return t?(t.value+=i+"\n-----\n",t.scrollTop=t.scrollHeight-t.clientHeight):e||c(i),!0},h.getInternetExplorerMajorVersion=function(){var e=h.getInternetExplorerMajorVersion.cached=typeof h.getInternetExplorerMajorVersion.cached!="undefined"?h.getInternetExplorerMajorVersion.cached:function(){var e=3,t=r.createElement("div"),n=t.getElementsByTagName("i");while((t.innerHTML="<!--[if gt IE "+ ++e+"]><i></i><![endif]-->")&&n[0]);return e>4?e:!1}();return e},h.isInternetExplorer=function(){var e=h.isInternetExplorer.cached=typeof h.isInternetExplorer.cached!="undefined"?h.isInternetExplorer.cached:Boolean(h.getInternetExplorerMajorVersion());return e},h.options.html4Mode?h.emulated={pushState:!0,hashChange:!0}:h.emulated={pushState:!Boolean(e.history&&e.history.pushState&&e.history.replaceState&&!/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(i.userAgent)&&!/AppleWebKit\/5([0-2]|3[0-2])/i.test(i.userAgent)),hashChange:Boolean(!("onhashchange"in e||"onhashchange"in r)||h.isInternetExplorer()&&h.getInternetExplorerMajorVersion()<8)},h.enabled=!h.emulated.pushState,h.bugs={setHash:Boolean(!h.emulated.pushState&&i.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),safariPoll:Boolean(!h.emulated.pushState&&i.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),ieDoubleCheck:Boolean(h.isInternetExplorer()&&h.getInternetExplorerMajorVersion()<8),hashEscape:Boolean(h.isInternetExplorer()&&h.getInternetExplorerMajorVersion()<7)},h.isEmptyObject=function(e){for(var t in e)if(e.hasOwnProperty(t))return!1;return!0},h.cloneObject=function(e){var t,n;return e?(t=l.stringify(e),n=l.parse(t)):n={},n},h.getRootUrl=function(){var e=r.location.protocol+"//"+(r.location.hostname||r.location.host);if(r.location.port||!1)e+=":"+r.location.port;return e+="/",e},h.getBaseHref=function(){var e=r.getElementsByTagName("base"),t=null,n="";return e.length===1&&(t=e[0],n=t.href.replace(/[^\/]+$/,"")),n=n.replace(/\/+$/,""),n&&(n+="/"),n},h.getBaseUrl=function(){var e=h.getBaseHref()||h.getBasePageUrl()||h.getRootUrl();return e},h.getPageUrl=function(){var e=h.getState(!1,!1),t=(e||{}).url||h.getLocationHref(),n;return n=t.replace(/\/+$/,"").replace(/[^\/]+$/,function(e,t,n){return/\./.test(e)?e:e+"/"}),n},h.getBasePageUrl=function(){var e=h.getLocationHref().replace(/[#\?].*/,"").replace(/[^\/]+$/,function(e,t,n){return/[^\/]$/.test(e)?"":e}).replace(/\/+$/,"")+"/";return e},h.getFullUrl=function(e,t){var n=e,r=e.substring(0,1);return t=typeof t=="undefined"?!0:t,/[a-z]+\:\/\//.test(e)||(r==="/"?n=h.getRootUrl()+e.replace(/^\/+/,""):r==="#"?n=h.getPageUrl().replace(/#.*/,"")+e:r==="?"?n=h.getPageUrl().replace(/[\?#].*/,"")+e:t?n=h.getBaseUrl()+e.replace(/^(\.\/)+/,""):n=h.getBasePageUrl()+e.replace(/^(\.\/)+/,"")),n.replace(/\#$/,"")},h.getShortUrl=function(e){var t=e,n=h.getBaseUrl(),r=h.getRootUrl();return h.emulated.pushState&&(t=t.replace(n,"")),t=t.replace(r,"/"),h.isTraditionalAnchor(t)&&(t="./"+t),t=t.replace(/^(\.\/)+/g,"./").replace(/\#$/,""),t},h.getLocationHref=function(e){return e=e||r,e.URL===e.location.href?e.location.href:e.location.href===decodeURIComponent(e.URL)?e.URL:e.location.hash&&decodeURIComponent(e.location.href.replace(/^[^#]+/,""))===e.location.hash?e.location.href:e.URL.indexOf("#")==-1&&e.location.href.indexOf("#")!=-1?e.location.href:e.URL||e.location.href},h.store={},h.idToState=h.idToState||{},h.stateToId=h.stateToId||{},h.urlToId=h.urlToId||{},h.storedStates=h.storedStates||[],h.savedStates=h.savedStates||[],h.normalizeStore=function(){h.store.idToState=h.store.idToState||{},h.store.urlToId=h.store.urlToId||{},h.store.stateToId=h.store.stateToId||{}},h.getState=function(e,t){typeof e=="undefined"&&(e=!0),typeof t=="undefined"&&(t=!0);var n=h.getLastSavedState();return!n&&t&&(n=h.createStateObject()),e&&(n=h.cloneObject(n),n.url=n.cleanUrl||n.url),n},h.getIdByState=function(e){var t=h.extractId(e.url),n;if(!t){n=h.getStateString(e);if(typeof h.stateToId[n]!="undefined")t=h.stateToId[n];else if(typeof h.store.stateToId[n]!="undefined")t=h.store.stateToId[n];else{for(;;){t=(new Date).getTime()+String(Math.random()).replace(/\D/g,"");if(typeof h.idToState[t]=="undefined"&&typeof h.store.idToState[t]=="undefined")break}h.stateToId[n]=t,h.idToState[t]=e}}return t},h.normalizeState=function(e){var t,n;if(!e||typeof e!="object")e={};if(typeof e.normalized!="undefined")return e;if(!e.data||typeof e.data!="object")e.data={};return t={},t.normalized=!0,t.title=e.title||"",t.url=h.getFullUrl(e.url?e.url:h.getLocationHref()),t.hash=h.getShortUrl(t.url),t.data=h.cloneObject(e.data),t.id=h.getIdByState(t),t.cleanUrl=t.url.replace(/\??\&_suid.*/,""),t.url=t.cleanUrl,n=!h.isEmptyObject(t.data),(t.title||n)&&h.options.disableSuid!==!0&&(t.hash=h.getShortUrl(t.url).replace(/\??\&_suid.*/,""),/\?/.test(t.hash)||(t.hash+="?"),t.hash+="&_suid="+t.id),t.hashedUrl=h.getFullUrl(t.hash),(h.emulated.pushState||h.bugs.safariPoll)&&h.hasUrlDuplicate(t)&&(t.url=t.hashedUrl),t},h.createStateObject=function(e,t,n){var r={data:e,title:t,url:n};return r=h.normalizeState(r),r},h.getStateById=function(e){e=String(e);var n=h.idToState[e]||h.store.idToState[e]||t;return n},h.getStateString=function(e){var t,n,r;return t=h.normalizeState(e),n={data:t.data,title:e.title,url:e.url},r=l.stringify(n),r},h.getStateId=function(e){var t,n;return t=h.normalizeState(e),n=t.id,n},h.getHashByState=function(e){var t,n;return t=h.normalizeState(e),n=t.hash,n},h.extractId=function(e){var t,n,r,i;return e.indexOf("#")!=-1?i=e.split("#")[0]:i=e,n=/(.*)\&_suid=([0-9]+)$/.exec(i),r=n?n[1]||e:e,t=n?String(n[2]||""):"",t||!1},h.isTraditionalAnchor=function(e){var t=!/[\/\?\.]/.test(e);return t},h.extractState=function(e,t){var n=null,r,i;return t=t||!1,r=h.extractId(e),r&&(n=h.getStateById(r)),n||(i=h.getFullUrl(e),r=h.getIdByUrl(i)||!1,r&&(n=h.getStateById(r)),!n&&t&&!h.isTraditionalAnchor(e)&&(n=h.createStateObject(null,null,i))),n},h.getIdByUrl=function(e){var n=h.urlToId[e]||h.store.urlToId[e]||t;return n},h.getLastSavedState=function(){return h.savedStates[h.savedStates.length-1]||t},h.getLastStoredState=function(){return h.storedStates[h.storedStates.length-1]||t},h.hasUrlDuplicate=function(e){var t=!1,n;return n=h.extractState(e.url),t=n&&n.id!==e.id,t},h.storeState=function(e){return h.urlToId[e.url]=e.id,h.storedStates.push(h.cloneObject(e)),e},h.isLastSavedState=function(e){var t=!1,n,r,i;return h.savedStates.length&&(n=e.id,r=h.getLastSavedState(),i=r.id,t=n===i),t},h.saveState=function(e){return h.isLastSavedState(e)?!1:(h.savedStates.push(h.cloneObject(e)),!0)},h.getStateByIndex=function(e){var t=null;return typeof e=="undefined"?t=h.savedStates[h.savedStates.length-1]:e<0?t=h.savedStates[h.savedStates.length+e]:t=h.savedStates[e],t},h.getCurrentIndex=function(){var e=null;return h.savedStates.length<1?e=0:e=h.savedStates.length-1,e},h.getHash=function(e){var t=h.getLocationHref(e),n;return n=h.getHashByUrl(t),n},h.unescapeHash=function(e){var t=h.normalizeHash(e);return t=decodeURIComponent(t),t},h.normalizeHash=function(e){var t=e.replace(/[^#]*#/,"").replace(/#.*/,"");return t},h.setHash=function(e,t){var n,i;return t!==!1&&h.busy()?(h.pushQueue({scope:h,callback:h.setHash,args:arguments,queue:t}),!1):(h.busy(!0),n=h.extractState(e,!0),n&&!h.emulated.pushState?h.pushState(n.data,n.title,n.url,!1):h.getHash()!==e&&(h.bugs.setHash?(i=h.getPageUrl(),h.pushState(null,null,i+"#"+e,!1)):r.location.hash=e),h)},h.escapeHash=function(t){var n=h.normalizeHash(t);return n=e.encodeURIComponent(n),h.bugs.hashEscape||(n=n.replace(/\%21/g,"!").replace(/\%26/g,"&").replace(/\%3D/g,"=").replace(/\%3F/g,"?")),n},h.getHashByUrl=function(e){var t=String(e).replace(/([^#]*)#?([^#]*)#?(.*)/,"$2");return t=h.unescapeHash(t),t},h.setTitle=function(e){var t=e.title,n;t||(n=h.getStateByIndex(0),n&&n.url===e.url&&(t=n.title||h.options.initialTitle));try{r.getElementsByTagName("title")[0].innerHTML=t.replace("<","&lt;").replace(">","&gt;").replace(" & "," &amp; ")}catch(i){}return r.title=t,h},h.queues=[],h.busy=function(e){typeof e!="undefined"?h.busy.flag=e:typeof h.busy.flag=="undefined"&&(h.busy.flag=!1);if(!h.busy.flag){u(h.busy.timeout);var t=function(){var e,n,r;if(h.busy.flag)return;for(e=h.queues.length-1;e>=0;--e){n=h.queues[e];if(n.length===0)continue;r=n.shift(),h.fireQueueItem(r),h.busy.timeout=o(t,h.options.busyDelay)}};h.busy.timeout=o(t,h.options.busyDelay)}return h.busy.flag},h.busy.flag=!1,h.fireQueueItem=function(e){return e.callback.apply(e.scope||h,e.args||[])},h.pushQueue=function(e){return h.queues[e.queue||0]=h.queues[e.queue||0]||[],h.queues[e.queue||0].push(e),h},h.queue=function(e,t){return typeof e=="function"&&(e={callback:e}),typeof t!="undefined"&&(e.queue=t),h.busy()?h.pushQueue(e):h.fireQueueItem(e),h},h.clearQueue=function(){return h.busy.flag=!1,h.queues=[],h},h.stateChanged=!1,h.doubleChecker=!1,h.doubleCheckComplete=function(){return h.stateChanged=!0,h.doubleCheckClear(),h},h.doubleCheckClear=function(){return h.doubleChecker&&(u(h.doubleChecker),h.doubleChecker=!1),h},h.doubleCheck=function(e){return h.stateChanged=!1,h.doubleCheckClear(),h.bugs.ieDoubleCheck&&(h.doubleChecker=o(function(){return h.doubleCheckClear(),h.stateChanged||e(),!0},h.options.doubleCheckInterval)),h},h.safariStatePoll=function(){var t=h.extractState(h.getLocationHref()),n;if(!h.isLastSavedState(t))return n=t,n||(n=h.createStateObject()),h.Adapter.trigger(e,"popstate"),h;return},h.back=function(e){return e!==!1&&h.busy()?(h.pushQueue({scope:h,callback:h.back,args:arguments,queue:e}),!1):(h.busy(!0),h.doubleCheck(function(){h.back(!1)}),p.go(-1),!0)},h.forward=function(e){return e!==!1&&h.busy()?(h.pushQueue({scope:h,callback:h.forward,args:arguments,queue:e}),!1):(h.busy(!0),h.doubleCheck(function(){h.forward(!1)}),p.go(1),!0)},h.go=function(e,t){var n;if(e>0)for(n=1;n<=e;++n)h.forward(t);else{if(!(e<0))throw new Error("History.go: History.go requires a positive or negative integer passed.");for(n=-1;n>=e;--n)h.back(t)}return h};if(h.emulated.pushState){var v=function(){};h.pushState=h.pushState||v,h.replaceState=h.replaceState||v}else h.onPopState=function(t,n){var r=!1,i=!1,s,o;return h.doubleCheckComplete(),s=h.getHash(),s?(o=h.extractState(s||h.getLocationHref(),!0),o?h.replaceState(o.data,o.title,o.url,!1):(h.Adapter.trigger(e,"anchorchange"),h.busy(!1)),h.expectedStateId=!1,!1):(r=h.Adapter.extractEventData("state",t,n)||!1,r?i=h.getStateById(r):h.expectedStateId?i=h.getStateById(h.expectedStateId):i=h.extractState(h.getLocationHref()),i||(i=h.createStateObject(null,null,h.getLocationHref())),h.expectedStateId=!1,h.isLastSavedState(i)?(h.busy(!1),!1):(h.storeState(i),h.saveState(i),h.setTitle(i),h.Adapter.trigger(e,"statechange"),h.busy(!1),!0))},h.Adapter.bind(e,"popstate",h.onPopState),h.pushState=function(t,n,r,i){if(h.getHashByUrl(r)&&h.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(i!==!1&&h.busy())return h.pushQueue({scope:h,callback:h.pushState,args:arguments,queue:i}),!1;h.busy(!0);var s=h.createStateObject(t,n,r);return h.isLastSavedState(s)?h.busy(!1):(h.storeState(s),h.expectedStateId=s.id,p.pushState(s.id,s.title,s.url),h.Adapter.trigger(e,"popstate")),!0},h.replaceState=function(t,n,r,i){if(h.getHashByUrl(r)&&h.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(i!==!1&&h.busy())return h.pushQueue({scope:h,callback:h.replaceState,args:arguments,queue:i}),!1;h.busy(!0);var s=h.createStateObject(t,n,r);return h.isLastSavedState(s)?h.busy(!1):(h.storeState(s),h.expectedStateId=s.id,p.replaceState(s.id,s.title,s.url),h.Adapter.trigger(e,"popstate")),!0};if(s){try{h.store=l.parse(s.getItem("History.store"))||{}}catch(m){h.store={}}h.normalizeStore()}else h.store={},h.normalizeStore();h.Adapter.bind(e,"unload",h.clearAllIntervals),h.saveState(h.storeState(h.extractState(h.getLocationHref(),!0))),s&&(h.onUnload=function(){var e,t,n;try{e=l.parse(s.getItem("History.store"))||{}}catch(r){e={}}e.idToState=e.idToState||{},e.urlToId=e.urlToId||{},e.stateToId=e.stateToId||{};for(t in h.idToState){if(!h.idToState.hasOwnProperty(t))continue;e.idToState[t]=h.idToState[t]}for(t in h.urlToId){if(!h.urlToId.hasOwnProperty(t))continue;e.urlToId[t]=h.urlToId[t]}for(t in h.stateToId){if(!h.stateToId.hasOwnProperty(t))continue;e.stateToId[t]=h.stateToId[t]}h.store=e,h.normalizeStore(),n=l.stringify(e);try{s.setItem("History.store",n)}catch(i){if(i.code!==DOMException.QUOTA_EXCEEDED_ERR)throw i;s.length&&(s.removeItem("History.store"),s.setItem("History.store",n))}},h.intervalList.push(a(h.onUnload,h.options.storeInterval)),h.Adapter.bind(e,"beforeunload",h.onUnload),h.Adapter.bind(e,"unload",h.onUnload));if(!h.emulated.pushState){h.bugs.safariPoll&&h.intervalList.push(a(h.safariStatePoll,h.options.safariPollInterval));if(i.vendor==="Apple Computer, Inc."||(i.appCodeName||"")==="Mozilla")h.Adapter.bind(e,"hashchange",function(){h.Adapter.trigger(e,"popstate")}),h.getHash()&&h.Adapter.onDomLoad(function(){h.Adapter.trigger(e,"hashchange")})}},(!h.options||!h.options.delayInit)&&h.init()}(window)
},{}],4:[function(require,module,exports){
require('./../../templates/managed/sldsTemplate.js');
require('./../../templates/managed/ndsTemplate.js');
require('./../../templates/managed/cssTemplate.js');
require('./../../templates/managed/ndsCssTemplate.js');
require('./../../templates/deactivated/htmlTemplate.js');
require('./../../templates/deactivated/cssTemplate.js');
require('./../../templates/managed/editBlockTemplate.js');

function OmniscriptHtmlBuilder(namespacePrefix) {

  const allowedUiElements = new Set([
    'Block', 'Checkbox', 'Currency', 'Date', 'Date/Time (Local)', 'Disclosure', 'Edit Block', 'Email', 'Lookup',
    'Multi-select', 'Number', 'Password', 'Radio', 'Radio Group', 'Range', 'Select', 'Signature', 'Step',
    'Telephone', 'Text', 'Text Area', 'Time', 'Type Ahead Block', 'URL', 'Type Ahead', 'Places Typeahead', 'Action Block'
  ]);
  const allowedAggElements = new Set(['Aggregate', 'Formula', 'Custom Lightning Web Component']);

  // This is a list of elements that can be repeated and might/might not have repeat=true on their propSetMap
  const repeatElements = ['Edit Block'];

  this.getHtml = function(json) {
    json.children = json.children.filter(child => child.type !== 'OmniScript');
    const html = buildOmniHtml(json),
      type = json.bpType,
      subType = json.bpSubType,
      language = json.bpLang;
    let rawKBHtml = '';

    // now process the html string for attributes which are name="{something}" and remove the quotes
    // also, be aware that the HTML was created using <template2></template2> tag. This because
    // the outerHtml is not returning any values if using <template><template>
    // eslint-disable-next-line @lwc/lwc/no-inner-html
    const rawHtml = html.outerHTML
      .replace(/="({[^}]*})"/g, '=$1')
      .replace(/<(template2)\b/gi, '<template')
      .replace(/<\/(template2)\b/gi, '</template');

    if (json.propSetMap.persistentComponent && Array.isArray(json.propSetMap.persistentComponent)) {
      let kbObject = json.propSetMap.persistentComponent.find(el => el.id === 'vlcKnowledge');
      if (kbObject) {
        const dispOutsideOmni = kbObject.dispOutsideOmni || false;

        rawKBHtml = !dispOutsideOmni ? `<template if:true={_isKbEnabledOnScript}>
                                <{$namespace}-omniscript-knowledge-base knowledge-options={kbOptions}
                                                             data-omni-key='omniscriptKnowledgeBase'
                                                             layout={layout}
                                                             data-stepchart-placement={_stepChartPlacement}
                                                             omniscript-key={scriptHeaderDef.omniscriptKey}
                                                             kb-label={knowledgeLabel}>
                                </{$namespace}-omniscript-knowledge-base>
                            </template>` : '';
      }
    }

    // build root templates for lightning and nds
    const rootTemplate = buildRootTemplates(OmniscriptLwcSldsTemplate, OmniscriptLwcNdsTemplate),
      templateMapping = json.propSetMap.elementTypeToLwcTemplateMapping || {};

    let stepChart = namespacePrefix + '-omniscript-step-chart';
    let modal = `${namespacePrefix}-omniscript-modal`;
    let sflAcknowledge = `${namespacePrefix}-omniscript-save-for-later-acknowledge`;

    // Generate custom template for Step Chart
    if (templateMapping.StepChart) stepChart = generateCustomTemplate(templateMapping.StepChart, /[A-Z]/g);

    // Generate custom template for Modal
    if (templateMapping.Modal) modal = generateCustomTemplate(templateMapping.Modal, /[A-Z]/g);

    // Generate custom tmeplate for Save for Later Modal
    if (templateMapping.SaveForLaterAcknowledge) {
      sflAcknowledge = generateCustomTemplate(templateMapping.SaveForLaterAcknowledge, /[A-Z]/g);
    }

    let sldsRootTemplate = rootTemplate.sldsTemplate
      .replace('{$omniKBhtml}', rawKBHtml)
      .replace('{$omnihtml}', rawHtml);

    // replace all edit block placeholder for slds
    if (window.editBlockReplace) {
      for (let ebTmpl of Object.keys(window.editBlockReplace)) {
        sldsRootTemplate = sldsRootTemplate.replace(new RegExp(ebTmpl, 'g'), window.editBlockReplace[ebTmpl].slds);
      }
    }

    sldsRootTemplate = sldsRootTemplate.replace(/\{\$stepChart\}/g, stepChart)
      .replace(/\{\$modal\}/g, modal)
      .replace(/\{\$sflAcknowledge\}/g, sflAcknowledge)
      .replace(/\{\$namespace\}/g, namespacePrefix)
      .replace('$subType', subType)
      .replace('$type', type)
      .replace('$language', language);

    // Adds support for overriding SLDS design tokens
    const designTokenOverride = json.propSetMap.designTokenOverride ? `:host {${json.propSetMap.designTokenOverride}}` : '';
    const sldsRootCssTemplate = OmniscriptLwcCssTemplate.replace('$designTokenOverride', designTokenOverride)

    let ndsRootTemplate = rootTemplate.ndsTemplate
      .replace('{$omniKBhtml}', rawKBHtml)
      .replace('{$omnihtml}', rawHtml);

    // replace all edit block placeholder for nds
    if (window.editBlockReplace) {
      for (let ebTmpl of Object.keys(window.editBlockReplace)) {
        ndsRootTemplate = ndsRootTemplate.replace(new RegExp(ebTmpl, 'g'), window.editBlockReplace[ebTmpl].nds);
      }
    }

    ndsRootTemplate = ndsRootTemplate.replace(/\{\$stepChart\}/g, stepChart)
      .replace(/\{\$modal\}/g, modal)
      .replace(/\{\$sflAcknowledge\}/g, sflAcknowledge)
      .replace(/\{\$namespace\}/g, namespacePrefix)
      .replace('$subType', subType)
      .replace('$type', type)
      .replace('$language', language);

    cleanUp();

    return {
      slds: sldsRootTemplate,
      nds: ndsRootTemplate,
      css: sldsRootCssTemplate,
      ndsCss: OmniscriptLwcNdsCssTemplate
    };
  }

  /**
   * Generates custom templates according to Element Template Mapping.
   * @param {String} templateNode
   * @param {*} regex
   * @returns {String}
   */
  function generateCustomTemplate(templateNode, regex) {
    return `c-${templateNode.replace(regex, match => `-${match.toLowerCase()}`)}`;
  }

  /**
   * Builds the root templates for lightning and newport.
   * @param {object} json
   * @param {string} sldsTemplate - OOTB slds compiler template
   * @param {string} ndsTemplate - OOTB nds compiler template
   * @returns {object}
   */
  function buildRootTemplates(sldsTemplate, ndsTemplate) {
    return {
      sldsTemplate: sldsTemplate,
      ndsTemplate: ndsTemplate
    }
  }

  this.getDeactivatedHtml = function(type, subType, language) {
    return {
      html: DeactivatedOmniscriptLwcHtmlTemplate
        .replace('$subType', subType)
        .replace('$type', type)
        .replace('$language', language),
      css: DeactivatedOmniscriptLwcCssTemplate
    };
  }

  this.processJson = function(json, isDesignMode) {
    json.children = json.children.filter(child => child.type !== 'OmniScript');
    getUniqueComponents(json.children, new Map(), json.labelMap, json.propSetMap.elementTypeToLwcTemplateMapping || {}, json.rMap, isDesignMode);
  }


  /**
   *
   * @param {object} json The OmniScript JSON
   * @returns {HTMLElement}
   */
  function buildOmniHtml(json) {
    // First of all, we need a list of unique elements on the root node
    const uniqueComponents = new Map();
    getUniqueComponents(json.children, uniqueComponents, json.labelMap, json.propSetMap.elementTypeToLwcTemplateMapping || {}, json.rMap);

    // Add lwc variable mapping to json root
    addLwcVariableList(json, uniqueComponents);

    // Let's create the template that will hold the children HTML
    const template = document.createElement('template2');
    template.setAttribute('for:each', `{jsonDef.children}`);
    template.setAttribute('for:item', 'item');
    template.setAttribute('for:index', 'idx');

    buildComponentHtml(template, ['item'], uniqueComponents);

    return template;
  };

  /**
   * Creates the HTML elements for an array of components
   * @param {HTMLElement} parentElement The parent HTML Element where the component will be inserted
   * @param {Array} parentPath An array that keeps track of the current path that is used to build the loop item name
   * @param {Map} components The Map of components that will be created
   */
  function buildComponentHtml(parentElement, parentPath, components) {
    // Create the string of the current JSON path that is used to build the unique name of the for:item
    const currentPath = parentPath.join('');

    // Loop through each component
    components.forEach(component => {
      // We will create the HTML of components that have htmlTag
      if (component.hasOwnProperty('htmlTag')) {

        // Create the HTML for the element and assign the attributes
        const ns = component.ns || namespacePrefix;
        const htmlElement = document.createElement(`${ns}-${component.htmlTag}`);

        let baseAttributes = JSON.parse(JSON.stringify(OmniscriptLwcCompilerConfig.baseAttributes));
        // remove attributes that should be ignored
        if (component.ignoreAttributes && component.ignoreAttributes.length > 0) {
          component.ignoreAttributes.forEach(attr => {
            delete baseAttributes[attr];
          });
        }

        // Assign the attributes of the element
        const attr = Object.assign({
            'if:true': `{${currentPath}.${component.bProperty}}`
          },
          baseAttributes,
          component.attributes
        );

        setElementAttributes(htmlElement, attr, currentPath);

        // This part will allow us to inject some static HTML to the component body (specially needed for STEP)
        if (component.html && component.html.preHtml) {
          // Get the HTML and replace the tokens
          const preHtml = replaceElements(component.html.preHtml, currentPath);

          // Insert in the component
          htmlElement.insertAdjacentHTML('afterbegin', preHtml);
        }

        // If this element has children, we need to build 2 different loops,
        // one for the children and one for the eleArray
        if (component.children && component.children.size > 0) {
          // We need a new path for the children element
          const newPath = parentPath.slice();
          newPath.push('Child');
          newPath.push(component.level);

          // Let's create the outer children for:each loop
          let childrenPath = newPath.join('');
          const childrenTemplate = document.createElement('template2');
          childrenTemplate.setAttribute('for:each', `{${currentPath}.children}`);
          childrenTemplate.setAttribute('for:item', childrenPath);
          childrenTemplate.setAttribute('for:index', `${childrenPath}Idx`);

          // Let's now create the eleArray for:each loop
          // Append the eleArray to the path
          newPath.push('Ele');
          const eleArrayPath = newPath.join('');

          // Create the template for the eleArray
          const eleArrayTemplate = document.createElement('template2');
          eleArrayTemplate.setAttribute('for:each', `{${childrenPath}.eleArray}`);
          eleArrayTemplate.setAttribute('for:item', eleArrayPath);
          eleArrayTemplate.setAttribute('for:index', `${childrenPath}Idx`);

          let compChildren = component.children;
          const editBlockComp = {
            label: new Map(),
            body: new Map(),
            new: new Map()
          }
          let compChildrenNoEditBlock = new Map(component.children);

          // removes edit block related components from main component children
          for (let [key, value] of component.children) {
            if (value.type === 'Edit Block') {
              editBlockComp.body.set(key, value);
              compChildrenNoEditBlock.delete(key);
            }
            if (value.type === 'Edit Block Label') {
              editBlockComp.label.set(key, value);
              compChildrenNoEditBlock.delete(key);
            }
            if (value.type === 'Edit Block New') {
              editBlockComp.new.set(key, value);
              compChildrenNoEditBlock.delete(key);
            }
          }

          if (editBlockComp.body.size > 0) {
            // Build the separate children elements template
            const editBlockTemplate = separateEditBlockTemplate(editBlockComp, newPath, childrenPath, eleArrayPath);
            childrenTemplate.append(editBlockTemplate)

            // Build the children (none-separate) elements into the template
            compChildren = compChildrenNoEditBlock;
          }

          // Build the elements into the template
          buildComponentHtml(eleArrayTemplate, newPath, compChildren);

          // Append the templates to the step
          childrenTemplate.appendChild(eleArrayTemplate);
          htmlElement.appendChild(childrenTemplate);

        }

        if (component.html && component.html.postHtml) {
          // Get the HTML and replace the tokens
          const postHtml = replaceElements(component.html.postHtml, currentPath);

          // Insert in the component
          htmlElement.insertAdjacentHTML('beforeend', postHtml);
        }

        if (component.custom || component.childrenC) {
          let customElements = component.custom ? [component.custom] : component.childrenC;
          buildComponentHtml(htmlElement, parentPath, customElements);
        }

        // Add the step to the parent element
        parentElement.appendChild(htmlElement);
      }
    });
  };

  /**
   * Assigns the attributes of the component to the HTMLElement
   * @param {HTMLElement} element
   * @param {object} attributes
   * @param {string} currentPath
   */
  function setElementAttributes(element, attributes, currentPath) {
    // Assign the attributes of the element
    Object.keys(attributes).forEach(key => {
      const attributeValue = replaceElements(attributes[key], currentPath);
      element.setAttribute(key, attributeValue);
    });
  };

  function replaceElements(str, currentPath) {
    return str
      .replace(/\$object/g, currentPath)
      .replace('$index', `${currentPath}Idx`);
  }

  /**
   * Creates a map of unique components used on the OmniScript
   * @param {Array} componentChildren The parent component (Step, Edit Block, etc.) children
   * @param {Map} elements The map that holds the unique elements for the omniscript
   * @param {Object} labelMap The label map object
   */
  function getUniqueComponents(componentChildren, components, labelMap, globalLwcOverride, rMap, isDesignMode) {
    componentChildren.forEach((child, index) => {
      if (child.type === 'Navigate Action' && child.name === 'CANCEL') {
        child.type = 'Cancel Action';
      }

      // Is this an overridden LWC component?
      const config = getElementProperties(child, components, globalLwcOverride, isDesignMode);
      const componentConfig = config.componentConfig;

      let eleType = config.eleType;

      // Upsert the component type
      components.set(eleType, componentConfig);

      if (allowedUiElements.has(child.type)) {
        child.propSetMap.uiElements = {
          [child.name]: ''
        };
      }
      if (allowedAggElements.has(child.type)) {
        child.propSetMap.aggElements = {
          [child.name]: ''
        };
      } else {
        child.propSetMap.aggElements = {};
      }

      getUniqueChildComponents([index], child, componentConfig.children, 1, labelMap, `${child.name}`, `${child.name}`, child.propSetMap.uiElements, globalLwcOverride, rMap, isDesignMode, child.propSetMap.aggElements);

      // Let's assign the bProperty that will be used to hide/display the component on the DOM
      if (componentConfig.hasOwnProperty('bProperty')) {
        child[componentConfig.bProperty] = true;
      }

      // Assigns a property to identify Step elements for supporting the Step Chart
      if (child.type === 'Step') {
        child.isStep = true;
      }

      // For consistency, the path is the same as the name
      child.JSONPath = child.name;
      labelMap[child.name] = child.name;

      // Also, we need to assign a unique ID
      child.lwcId = `${isDesignMode ? child.JSONPath : 'lwc'}${index}`;

      // Delete from rMap if not needed
      if (rMap.hasOwnProperty(child.name) && (child.propSetMap.repeat !== true && repeatElements.indexOf(child.type) === -1)) {
        delete rMap[child.name];
      }
    });
  };

  /**
   * Creates a map of unique eleArray components that are used on each of the OmniScript root component
   * @param {Array} parentIndex An array that keeps track of all the indexes of the parent components. Used to build the unique lwcId.
   * @param {object} component The component that we are currently building
   * @param {Map} uniqueComponents A map of unique child components
   * @param {number} currentLevel The current level of the node
   * @param {Object} labelMap The label map object
   * @param {Object} uiElements The uiElements object from the propSetMap
   */
  function getUniqueChildComponents(parentIndex, component, uniqueComponents, currentLevel, labelMap, jsonPath, labelPath, uiElements, globalLwcOverride, rMap, isDesignMode, aggElements) {
    // If no elements or component is Action Block, skip
    if (!component.children || component.children.length === 0 || (component.type === 'Action Block' && !isDesignMode)) {
      return;
    }

    // Create a loop for the [children] property
    component.children.forEach((child, childIndex) => {
      if (!child.eleArray || child.eleArray.length === 0) {
        return;
      }

      // Loop into the eleArray
      child.eleArray.forEach((element, elementIndex) => {
        // The new parent index that is used to create the unique lwcId
        const newParentIndex = parentIndex.slice();
        newParentIndex.push(childIndex);
        newParentIndex.push(elementIndex);

        // Override for placed typeahead.
        if (element.type == 'Type Ahead' && element.propSetMap.enableGoogleMapsAutocomplete === true) {
          element.type = 'Places Typeahead';
        }
        // Is this an overridden LWC component?
        const config = getElementProperties(element, uniqueComponents, globalLwcOverride, isDesignMode);
        const componentConfig = config.componentConfig;
        let eleType = config.eleType;

        if (isDesignMode) {
          // For designer we need to actually render the Actions inside the action block. To do that we re-assign them
          // back to `element.chlldren` so they're available in the template
          if (element.type === 'Action Block' && element.propSetMap.actions && element.propSetMap.actions.length > 0) {
            element.children = element.propSetMap.actions.map((action, index) => {
              return {
                response: null,
                level: currentLevel + 1,
                indexInParent: index,
                eleArray: [action],
                bHasAttachment: false
              }
            });
          } else if (element.type === 'Edit Block') {
            // need to handle actions differenly in Edit Block in design mode for them to appear.
            const compilerConfig = OmniscriptLwcCompilerConfig;
            if (!element.children) {
              element.children = [];
            }
            element.children = element.children.map(child => {
              child.eleArray[0].indexInParent = child.eleArray[0].propSetMap._di;
              return Object.assign({}, child, {
                indexInParent: child.eleArray[0].propSetMap._di
              })
            });
            if (element.propSetMap.actions) {
              element.children = element.children.concat(element.propSetMap.actions.map(action => {
                const elementConfig = compilerConfig.elements[action.type] || compilerConfig.helpers[action.type] || {};
                action[elementConfig.bProperty] = true;
                action.indexInParent = action.propSetMap._di
                return {
                  bHasAttachment: false,
                  response: null,
                  eleArray: [action],
                  indexInParent: action.indexInParent,
                  level: action.level
                };
              }));
            }
            if (element.propSetMap.gActions) {
              element.children = element.children.concat(element.propSetMap.gActions.map(action => {
                const elementConfig = compilerConfig.elements[action.type] || compilerConfig.helpers[action.type] || {};
                action[elementConfig.bProperty] = true;
                action.indexInParent = action.propSetMap._di
                return {
                  bHasAttachment: false,
                  response: null,
                  eleArray: [action],
                  indexInParent: action.indexInParent,
                  level: action.level
                };
              }));
            }
            // other actions need to be manually added:
            ['editAction', 'delAction', 'newAction'].forEach(actionType => {
              const action = element.propSetMap[actionType]
              if (action) {
                action.indexInParent = action.propSetMap._di
                element.children.push({
                  bHasAttachment: false,
                  response: null,
                  eleArray: [action],
                  indexInParent: action.indexInParent,
                  level: action.level
                });
              }
            });

            element.children.sort((a, b) => {
              return a.indexInParent < b.indexInParent ? -1 : a.indexInParent > b.indexInParent ? 1 : 0;
            });
          } else if (element.type === 'Type Ahead Block') {
            element.children = element.children.map(child => {
              child.eleArray[0].indexInParent = child.eleArray[0].propSetMap._di;
              return Object.assign({}, child, {
                indexInParent: child.eleArray[0].propSetMap._di
              });
            });
            if (element.children[0].eleArray[0].propSetMap.taAction) {
              const action = element.children[0].eleArray[0].propSetMap.taAction;
              const compilerConfig = OmniscriptLwcCompilerConfig;
              const elementConfig = compilerConfig.elements[action.type] || compilerConfig.helpers[action.type] || {};
              action[elementConfig.bProperty] = true;
              action.indexInParent = action.propSetMap._di;
              element.children.push({
                bHasAttachment: false,
                response: null,
                eleArray: [action],
                indexInParent: action.indexInParent,
                level: action.level
              });
            }
            element.children.sort((a, b) => {
              return a.indexInParent < b.indexInParent ? -1 : a.indexInParent > b.indexInParent ? 1 : 0;
            });
          }
        }

        // If this component has children components, process the leaf
        if (element.children && element.children.length > 0) {
          const newJsonPath = `${jsonPath}:${element.name}|${elementIndex + 1}`;
          const newLabelPath = `${labelPath}:${element.name}`;
          const newLevel = currentLevel + 1;

          getUniqueChildComponents(newParentIndex, element, componentConfig.children, newLevel, labelMap, newJsonPath, newLabelPath, uiElements, globalLwcOverride, rMap, isDesignMode, aggElements);

          if (element.type === 'Edit Block' && !isDesignMode) {
            // We already processed the leaf, let's remove the children and convert to custom
            element.childrenC = JSON.parse(JSON.stringify(element.children));
            element.children = [];
          }
        }

        // Adding boolean for Edit Block without checking eleArray elements
        if (element.type === 'Edit Block') {
          child.bEB = true;
          child.lwcId = `${isDesignMode ? element.JSONPath : 'lwc'}${newParentIndex.slice(0, newParentIndex.length - 1).join('')}`;
          child.lwcId += '-' + newParentIndex[newParentIndex.length - 1];

          const editBlockDef = child.eleArray[0];
          // specify edit block parent class in json def to control edit block parent width
          const width = editBlockDef.propSetMap.controlWidth;
          child.sldsCls = window.editBlockSldsTemplateCls.replace(/\$CTRLWIDTH/g, width);
          child.ndsCls = window.editBlockNdsTemplateCls.replace(/\$CTRLWIDTH/g, width);

          // Need to specify type to also filter for custom edit blocks
          componentConfig.type = element.type;

          // edit block label component setup
          let labelDef = {
            type: 'Edit Block Label',
            propSetMap: {
              lwcComponentOverride: editBlockDef.propSetMap.editBlockLabelLwcOverride
            }
          }
          const labelProp = getElementProperties(labelDef, uniqueComponents, globalLwcOverride, isDesignMode);
          const labelConfig = labelProp.componentConfig;
          // include type for filtering
          labelConfig.type = 'Edit Block Label';
          // update json def with bprop
          if (labelConfig.bProperty) {
            child[labelConfig.bProperty] = true;
          }

          // edit block new component setup
          let newDef = {
            type: 'Edit Block New',
            propSetMap: {
              lwcComponentOverride: editBlockDef.propSetMap.editBlockNewLwcOverride
            }
          }
          const newProp = getElementProperties(newDef, uniqueComponents, globalLwcOverride, isDesignMode);
          const newConfig = newProp.componentConfig;
          newConfig.type = 'Edit Block New';
          // update json def with bprop
          if (newConfig.bProperty) {
            child[newConfig.bProperty] = true;
          }

          uniqueComponents.set(labelProp.eleType, labelConfig);
          uniqueComponents.set(newProp.eleType, newConfig);
        }

        // Custom Lightning Web Component's tag is part of definition
        if (eleType === 'Custom Lightning Web Component' && isDesignMode) {
          element.bCustomLightningWebComponent = true;
        }
        if (eleType === 'Custom Lightning Web Component' && element.propSetMap.lwcName && element.propSetMap.lwcName.length > 0) {
          let index = 1;
          // increment until element is uniquely named
          for (; uniqueComponents.get(eleType + index); index++);
          // set unique name for omniscriptCustomLwc (container for custom component)
          eleType = eleType + index;

          let tag = eleType.replace(/[A-Z]/g, function(match) {
            return '-' + match.toLowerCase();
          });
          // Remove unallowed characters in javascript variables
          let bProp = 'b' + tag.replace(/[-_ ]*/g, '');
          // set boolean into jsondef
          element[bProp] = true;

          // set bProp in the config for if:true directive
          componentConfig.bProperty = bProp;

          // custom component : convert camelCase to kebab-case
          let customHtmlTag = element.propSetMap.lwcName.replace(/[A-Z]/g, function(match) {
            return '-' + match.toLowerCase();
          });

          // create config used for the custom component
          let custom = componentConfig.custom;
          custom.ns = 'c'; // Custom LWC should be in the 'c' namespace
          custom.htmlTag = customHtmlTag;
          if (custom.htmlTag.indexOf('__') > -1) {
            const parts = custom.htmlTag.split('__');
            custom.ns = parts[0];
            custom.htmlTag = parts[1];
          }
          custom.bProperty = bProp;
          custom.attributes = {};
          if (!element.propSetMap.bStandalone) {
            custom.attributes = JSON.parse(JSON.stringify(custom.omniattributes));
          }

          // custom attributes
          custom.varMapAttributes = {};
          element.propSetMap.customAttributes.forEach(attr => {
            // prevents overwriting existing attributes
            if (attr.name && attr.source && !custom.omniattributes[attr.name]) {
              let mergeField = attr.source.replace(/\s+/g, '');
              // convert mergefield syntax to js dot notation
              if (mergeField.startsWith('%') && mergeField.endsWith('%')) {
                const dotNotation = mergeField.replace(/:/g, '.');
                mergeField = '{' + 'jsonDef.response' + '.' + dotNotation.slice(1, -1) + '}';
                custom.varMapAttributes[attr.name] = dotNotation.slice(1, -1);
              }
              custom.attributes[attr.name] = mergeField;
            }
          });
          // storing new instance of componentConfig to prevent shared references
          const customComponentConfig = JSON.parse(JSON.stringify(componentConfig));
          uniqueComponents.set(eleType, customComponentConfig);

          if (isDesignMode) {
            element.htmlTag = custom.htmlTag;
            element.htmlTagNs = custom.ns;
          }
        } else {
          // Update the map of uniqueComponents with the new data
          uniqueComponents.set(eleType, componentConfig);
        }

        // Set the bProperty if exists on the component configuration
        if (componentConfig.hasOwnProperty('bProperty')) {
          element[componentConfig.bProperty] = true;
        }

        // Set the bPath
        element.JSONPath = `${jsonPath}:${element.name}`;

        if ((element.type === 'Type Ahead' || element.type === 'Places Typeahead') && element.propSetMap.taAction) {
          // example jpath = "autos:auto|1:autoYear-Block|1:autoYear"
          let jpath = element.JSONPath;
          if (jpath) {
            jpath = jpath.slice(0, jpath.length - element.name.length - 1);
            // jpath = "autos:auto|1:autoYear-Block|1
            jpath = jpath.slice(0, jpath.indexOf(element.name + '-Block') - 1);
            // jpath = "autos:auto|1
            jpath = jpath + ":" + element.name + "-Block:" + element.name;
          }
          element.propSetMap.taAction.JSONPath = jpath;
          element.JSONPath = jpath;
        }

        if (allowedUiElements.has(element.type)) {
          uiElements[element.name] = '';
        }
        if (allowedAggElements.has(element.type)) {
          aggElements[element.name] = '';
        }
        labelMap[element.name] = `${labelPath}:${element.name}`;

        // Set the lwcId. This is needed in order to track the element in the loop
        // and it requires a UNIQUE id between all the components
        element.lwcId = `${isDesignMode ? element.JSONPath : 'lwc'}${newParentIndex.slice(0, newParentIndex.length - 1).join('')}`;
        element.lwcId += '-' + newParentIndex[newParentIndex.length - 1];
        element.ns = componentConfig.ns;

        // Delete from rMap if not needed
        if (rMap.hasOwnProperty(element.name) && (element.propSetMap.repeat !== true && repeatElements.indexOf(element.type) === -1)) {
          delete rMap[element.name];
        }
      });
    });
  };

  function getElementProperties(child, components, globalLwcOverride, isDesignMode) {

    // Is this an overridden LWC component?
    let eleType = child.type,
      isOverridden = false,
      ns = undefined;

    // Overriden LWC
    if (eleType === 'Type Ahead Block') child.propSetMap.lwcComponentOverride = child.propSetMap.lwcBlockComponentOverride;

    if (child.propSetMap.lwcComponentOverride || globalLwcOverride[child.type]) {
      eleType = child.propSetMap.lwcComponentOverride || globalLwcOverride[child.type];

      // Let's get the namespace
      if (eleType.indexOf('__') > -1) {
        const parts = eleType.split('__');
        ns = parts[0];
        eleType = parts[1];
      } else {
        // If no namespace, by default it should be 'c' for overriden components
        ns = 'c';
      }

      isOverridden = true;
    }

    // For this component, we need to loop into the node in order to get the child components
    const componentConfig =
      components.get(eleType) ||
      getComponentProperties(child.type, 0, components.size);

    // Override the component properties
    if (isOverridden && !isDesignMode) {
      componentConfig.bProperty = `b` + (eleType.charAt(0).toUpperCase() + eleType.slice(1));
      componentConfig.ns = ns;
      componentConfig.htmlTag = eleType.replace(/[A-Z]/g, function(match) {
        return '-' + match.toLowerCase();
      });
    }

    return {
      eleType,
      componentConfig
    };
  }

  /**
   * Returns the properties for an specific type of OmniScript component type
   * @param {string} type The type of the element (Ex: Step, Text, etc.)
   * @param {number} level The current level of the element
   * @param {number} index The current index of the element
   */
  function getComponentProperties(type, level, index) {
    const compilerConfig = OmniscriptLwcCompilerConfig;

    // Get the configuration of the element type and merge the properties with the base properties
    const elementConfig = compilerConfig.elements[type] || compilerConfig.helpers[type] || {};

    return {
      ...elementConfig,
      children: new Map(),
      level: level,
      index: index
    };
  };

  /**
   * Creates an object based on a list of paths where the innermost variable is set to null
   * For Example : jsonDef.response.Step1.hello.world , jsonDef.response.hey
   * Result :
   * {
   *      Step1: {
   *          hello: {
   *              world: null
   *          }
   *      },
   *      hey: null
   * }
   *
   * The result will be added into the jsonDef
   * @param {object} json The OmniScript JSON
   * @param {Map} uniqueComponent A map of unique child components
   *
   */
  function addLwcVariableList(json, uniqueComponent) {
    const lwcVariableList = [];
    uniqueComponent.forEach(component => {
      if (component.children && component.children.size > 0) {
        component.children.forEach(childComponent => {
          if (childComponent.custom && childComponent.custom.varMapAttributes) {
            const keys = Object.keys(childComponent.custom.varMapAttributes);
            keys.forEach(key => {
              let jsonDefRespVar = childComponent.custom.varMapAttributes[key];
              if (jsonDefRespVar) {
                lwcVariableList.push(jsonDefRespVar.trim());
              }
            })
          }
        })
      }
    });


    if (lwcVariableList) {
      json.lwcVarMap = {};
      lwcVariableList.forEach(lwcVar => {
        // split up the variable list
        const controlKeys = lwcVar.split('.');
        let resp = json.lwcVarMap;
        // how many levels deep do we allow something like this to occur?
        for (let i = 0; i < controlKeys.length - 1; i++) {
          if (resp[controlKeys[i]] === undefined) {
            resp[controlKeys[i]] = {};
          }
          resp = resp[controlKeys[i]];
        }
        resp[controlKeys[controlKeys.length - 1]] = null;
      });
    }

  }

  function separateEditBlockTemplate(compChildren, newPath, childrenPath, eleArrayPath) {
    const editBlockCondition = document.createElement('template2');
    editBlockCondition.setAttribute('if:true', `{${childrenPath}.bEB}`);

    // Create the template for the eleArray
    const eleArrayTemplate = document.createElement('template2');
    eleArrayTemplate.setAttribute('for:each', `{${childrenPath}.eleArray}`);
    eleArrayTemplate.setAttribute('for:item', eleArrayPath);
    eleArrayTemplate.setAttribute('for:index', `${childrenPath}Idx`);

    // Build the elements into the template
    buildComponentHtml(eleArrayTemplate, newPath, compChildren.body);

    if (!window.editBlockReplace) {
      window.editBlockReplace = {};
    }
    let editBlockLabelStr = '';
    let editBlockNewStr = '';

    for (let [key, labelComp] of compChildren.label) {
      const ns = labelComp.ns || namespacePrefix;
      const attr = Object.assign({
          'if:true': `{${childrenPath}.${labelComp.bProperty}}`
        },
        labelComp.attributes
      )
      const editBlockLabel = document.createElement(`${ns}-${labelComp.htmlTag}`);
      setElementAttributes(editBlockLabel, attr, childrenPath);
      editBlockLabelStr += editBlockLabel.outerHTML;
    }

    for (let [key, newComp] of compChildren.new) {
      const ns = newComp.ns || namespacePrefix;
      const attr = Object.assign({
          'if:true': `{${childrenPath}.${newComp.bProperty}}`
        },
        newComp.attributes
      )
      const editBlockNew = document.createElement(`${ns}-${newComp.htmlTag}`);
      setElementAttributes(editBlockNew, attr, childrenPath);
      editBlockNewStr += editBlockNew.outerHTML;
    }

    // slds, substitute placeholders with generated editblock markup
    let sldsTemplate = window.editBlockSldsTemplate + '';
    sldsTemplate = replaceElements(sldsTemplate, childrenPath);
    sldsTemplate = sldsTemplate
      .replace(/\$EDITBLOCKLABEL/g, editBlockLabelStr)
      .replace(/\$EDITBLOCKNEW/g, editBlockNewStr)
      .replace(/\$EDITBLOCK/g, eleArrayTemplate.outerHTML)
      .replace(/="({[^}]*})"/g, '=$1')
      .replace(/<(template2)\b/gi, '<template')
      .replace(/<\/(template2)\b/gi, '</template');

    // nds
    let ndsTemplate = window.editBlockNdsTemplate + '';
    ndsTemplate = replaceElements(ndsTemplate, childrenPath);
    ndsTemplate = ndsTemplate
      .replace(/\$EDITBLOCKLABEL/g, editBlockLabelStr)
      .replace(/\$EDITBLOCKNEW/g, editBlockNewStr)
      .replace(/\$EDITBLOCK/g, eleArrayTemplate.outerHTML)
      .replace(/="({[^}]*})"/g, '=$1')
      .replace(/<(template2)\b/gi, '<template')
      .replace(/<\/(template2)\b/gi, '</template');

    // edit block context is unique to steps
    let uniqueName = 'OMNICOMPILEREDITBLOCK' + Object.keys(window.editBlockReplace).length;

    // store editblock markup globally then substitute back to correct template layout
    window.editBlockReplace[uniqueName] = {
      slds: sldsTemplate,
      nds: ndsTemplate
    };

    editBlockCondition.innerHTML = uniqueName;

    return editBlockCondition;
  }

  function cleanUp() {
    window.editBlockReplace = {};
  };
}

window.OmniscriptHtmlBuilder = OmniscriptHtmlBuilder;

},{"./../../templates/deactivated/cssTemplate.js":13,"./../../templates/deactivated/htmlTemplate.js":14,"./../../templates/managed/cssTemplate.js":17,"./../../templates/managed/editBlockTemplate.js":18,"./../../templates/managed/ndsCssTemplate.js":20,"./../../templates/managed/ndsTemplate.js":21,"./../../templates/managed/sldsTemplate.js":22}],5:[function(require,module,exports){
require('./../../templates/managed/jsTemplate.js');
require('./../../templates/deactivated/jsTemplate.js');

function OmniscriptLwcJsBuilder(namespacePrefix) {
    const maxFileLength = 130000;

    /**
     * Retuns the JavaScript for the LWC component
     */
    this.getPackageJs = function (lwcName) {
        const js = OmniscriptLwcJavascriptTemplate
            .replace(/\{\$lwcName\}/g, lwcName)
            .replace(/\{\$namespace\}/g, namespacePrefix);
        return js;
    };

    /**
     * Returns the JavaScript for the deactivated LWC componemnt    
     */
    this.getDeactivatedJs = function (lwcName) {
        return DeactivatedOmniscriptLwcJavascriptTemplate
            .replace(/\{\$namespace\}/g, namespacePrefix)
            .replace(/\{\$lwcName\}/g, lwcName);
    }


    /**
     * Generates an array of files for the JSON definition
     * @param {string} lwcName
     * @param {object} json
     * @returns {Array}
     */
    this.getOmniDefinitionFiles = function (lwcName, json) {
        delete json.testTemplates;
        delete json.templateList;
        delete json.customJS;

        // Parse the JSON string into a JSON object
        const jsonString = JSON.stringify(json);
        if (jsonString.length > maxFileLength) {
            // Split the children into smaller files
            const prefix = 'jsonDef';
            const files = splitChildrenDefinition(lwcName, json.children, prefix);

            // Remove the children
            json.children = [];

            // Push the jsonDef into a file
            files.push({
                name: `lwc/${lwcName}/${lwcName}_def.js`,
                contents: `
                import { ${prefix} } from './${prefix}.js';
                const omniDef = ${JSON.stringify(json)};
                omniDef.children = ${prefix};

                export const OMNIDEF = omniDef;`,
            });

            return files;
        } else {
            return [
                {
                    name: `lwc/${lwcName}/${lwcName}_def.js`,
                    contents: `export const OMNIDEF = ${jsonString};`,
                },
            ];
        }
    };

    /**
     * @param {string} lwcName
     * @param {Array} children
     * @param {string} prefix
     */
    function splitChildrenDefinition(lwcName, children, prefix) {
        let files = [], // An array of all files
            index = 0, // A count of how many files we have right now (excluding the splited childs)
            fileContents = [], // An array for temporary store children
            fileSize = 0; // The total size of the children added to a file

        children.forEach(child => {
            // Serialize the child in order to get the size
            const childSize = JSON.stringify(child).length;

            // If this child does not fit into the current file,
            // save the current content and start a new file
            if (childSize + fileSize > maxFileLength) {
                // Save previous file
                index = saveContent(files, lwcName, prefix, fileContents, index);

                // Reset the current content and file size
                fileContents = [];
                fileSize = 0;
            }

            // Does the child fits into a new file?
            if (childSize > maxFileLength) {
                const subChildPrefix = `${prefix}Child${index}`,
                    fileName = `${prefix}${index}`;

                // Split the children of this child into smaller files
                files = files.concat(splitChildrenDefinition(lwcName, child.children, subChildPrefix));

                // Remove the children from this child element
                child.children = [];

                // Create a file that will put the contents all together again.
                // Add the contents of the child to the file
                files.push({
                    name: `lwc/${lwcName}/${fileName}.js`,
                    contents: `
                        import { ${subChildPrefix} } from './${subChildPrefix}.js';
                        const ${fileName}Def = ${JSON.stringify(child)};
                        ${fileName}Def.children = ${subChildPrefix};

                        export const ${fileName} = [${fileName}Def];`,
                });

                // We added a file, so, let's update the count of how many files we have
                index++;
            } else {
                // Just push this into the next file
                fileContents.push(child);
                fileSize += childSize;
            }
        });

        // Save the contents if we have more
        index = saveContent(files, lwcName, prefix, fileContents, index);

        // Add the "All together markup"
        files.push({
            name: `lwc/${lwcName}/${prefix}.js`,
            contents: buildJsMarkup(prefix, index),
        });

        return files;
    };

    /**
     * @param {Array} files
     * @param {string} lwcName
     * @param {string} prefix
     * @param {Array} fileContent The content of the file
     * @param {number} totalFiles How many files we have saved until now
     */
    function saveContent(files, lwcName, prefix, fileContent, totalFiles) {
        if (fileContent.length > 0) {
            const name = `${prefix}${totalFiles}`;
            files.push({
                name: `lwc/${lwcName}/${name}.js`,
                contents: `export const ${name} = ${JSON.stringify(fileContent)};`,
            });

            totalFiles++;
        }

        return totalFiles;
    };

    /**
     *
     * @param {string} prefix
     * @param {number} totalFiles
     * @returns {string}
     */
    function buildJsMarkup(prefix, totalFiles) {
        // Initialize the imports by importing the main definition
        const imports = [],
            names = [];

        // Now, let's import all files that we splited
        for (let i = 0; i < totalFiles; i++) {
            const name = `${prefix}${i}`;
            imports.push(`import { ${name} } from './${name}.js';`);
            names.push(name);
        }

        const contents = `
        ${imports.join('\n')}
        export const ${prefix} = [].concat(${names.join(',')})`;

        return contents;
    };


}

window.OmniscriptLwcJsBuilder = OmniscriptLwcJsBuilder;

},{"./../../templates/deactivated/jsTemplate.js":15,"./../../templates/managed/jsTemplate.js":19}],6:[function(require,module,exports){
require('./../../templates/iconTemplate.js');

function OmniscriptLwcMetaBuilder() {

    /**
     * Generates the package meta XML
     * @param {object} json The OmniScript JSON definition
     * @param {boolean} hidden If the OmniScript should be shown or hidden on the AppBuilder
     */
    this.getPackageMetaXml = function (type, subType, language, sId, hidden, addRuntimeNamespace, namespace) {
        type = type.replace(/[\W]+/g, '');
        subType = subType.replace(/[\W]+/g, '');

        let targets = '',
            namespaceMeta = '';
        if (!hidden) {
            targets = `
            <targets>
                <target>lightningCommunity__Page</target>
                <target>lightningCommunity__Default</target>
                <target>lightning__RecordPage</target>
                <target>lightning__AppPage</target>
                <target>lightning__HomePage</target>
            </targets>
            <targetConfigs>
                <targetConfig targets="lightning__AppPage, lightning__HomePage, lightning__RecordPage">
                    <property name="layout" type="String" datasource="lightning,newport"/>
                    <property name="inline" type="boolean" default="false" />
                    <property name="inlineLabel" type="string" default="Launch ${type}/${subType}" />
                    <property name="inlineVariant" type="string" default="brand" datasource="brand,outline-brand,neutral,success,destructive,text-destructive,inverse,link"/>
                </targetConfig>
                <targetConfig targets="lightningCommunity__Default">
                    <property name="layout" type="String" datasource="lightning,newport"/>
                    <property name="inline" type="boolean" default="false" />
                    <property name="inlineLabel" type="string" default="Launch ${type}/${subType}" />
                    <property name="inlineVariant" type="string" default="brand" datasource="brand,outline-brand,neutral,success,destructive,text-destructive,inverse,link"/>
                    <property name="recordId" type="String" label="Record Id" description="Automatically bind the page's record id to the component variable" default="{!recordId}" />
                </targetConfig>
            </targetConfigs>`;
        }

        if (addRuntimeNamespace === true || addRuntimeNamespace === "true") {
            namespaceMeta = `<runtimeNamespace>${namespace}</runtimeNamespace>`;
        }

        return `<?xml version="1.0" encoding="UTF-8"?>
        <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
            <apiVersion>46.0</apiVersion>
            <description>Vlocity OmniScript Auto-generated - ${sId}</description>
            <isExposed>true</isExposed>${namespaceMeta}
            <masterLabel>${type}/${subType}/${language}</masterLabel>${targets}
        </LightningComponentBundle>`;
    };

    this.getPackageIcon = function () {
        return window.OmniscriptLwcIconTemplate;
    }
}

window.OmniscriptLwcMetaBuilder = OmniscriptLwcMetaBuilder;

},{"./../../templates/iconTemplate.js":16}],7:[function(require,module,exports){
require('./compilerConfig.js');
require('./builders/omniHtmlBuilder.js');
require('./builders/omniMetaBuilder.js');
require('./builders/omniJsBuilder.js');

function OmniscriptLwcCompiler(namespacePrefix) {

    const htmlBuilder = new OmniscriptHtmlBuilder(namespacePrefix);
    const jsBuilder = new OmniscriptLwcJsBuilder(namespacePrefix);
    const metaBuilder = new OmniscriptLwcMetaBuilder(namespacePrefix);

    /**
     * @param {string} lwcName The name of the LWC component
     * @param {string} json The OmniScript JSON definition
     * @param {boolean} hidden If the component is available or not on the AppBuilder
     * @param {boolean} addRuntimeNamespace When in a package org, runtimeNamespace allows the use of packed LWC components.
     * @param {string} namespace The namespace of the package
     * @returns {Stream}
     */
    this.compileActivatedAsZip = function (lwcName, json, hidden, addRuntimeNamespace, namespace) {
        return new Promise((resolve, reject) => {
            this.compileActivated(lwcName, json, hidden, addRuntimeNamespace, namespace)
                .then(resources => {
                    const zip = new JSZip();

                    zip.file('package.xml', getZipFileMetadata());
                    resources.forEach(resource => {
                        zip.file(resource.name, resource.source);
                    });

                    zip.generateAsync({ type: 'base64' })
                        .then(content => { resolve(content); })
                        .catch(error => { reject(error); });
                })
                .catch(reject);
        });
    }

    /**
     * @param {string} lwcName The name of the LWC component
     * @param {string} json The OmniScript JSON definition
     * @param {boolean} hidden If the component is available or not on the AppBuilder
     * @param {boolean} addRuntimeNamespace When in a package org, runtimeNamespace allows the use of packed LWC components.
     * @param {string} namespace The namespace of the package
     * @returns {Promise}
     */
    this.compileActivated = function (lwcName, json, hidden, addRuntimeNamespace, namespace) {
        return new Promise((resolve, reject) => {
            var resources = [];

            // Get the HTML for slds and nds
            const html = htmlBuilder.getHtml(json);

            // Add css for slds and nds templates
            resources.push({ name: `lwc/${lwcName}/${lwcName}.html`, source: html.slds, type: 'html' });
            resources.push({ name: `lwc/${lwcName}/${lwcName}_nds.html`, source: html.nds, type: 'html' });

            // Add css
            resources.push({ name: `lwc/${lwcName}/${lwcName}.css`, source: html.css, type: 'css' });
            resources.push({ name: `lwc/${lwcName}/${lwcName}_nds.css`, source: html.ndsCss, type: 'css' });

            // OmniDef MUST be after HTML as the HTML modified the JSON object in order to append the bProperty
            const jsFiles = jsBuilder.getOmniDefinitionFiles(lwcName, json);
            jsFiles.forEach(file => {
                resources.push({ name: file.name, source: file.contents, type: 'def' });
            });

            // Get the Javascript file
            resources.push({ name: `lwc/${lwcName}/${lwcName}.js`, source: jsBuilder.getPackageJs(lwcName), type: 'js' });

            // Now, let's create the metadata for the package
            resources.push({ name: `lwc/${lwcName}/${lwcName}.js-meta.xml`, source: metaBuilder.getPackageMetaXml(json.bpType, json.bpSubType, json.bpLang, json.sOmniScriptId, hidden, addRuntimeNamespace, namespace), type: 'meta' });

            // And, finally, the icon for the component
            resources.push({ name: `lwc/${lwcName}/${lwcName}.svg`, source: metaBuilder.getPackageIcon(), type: 'icon' });

            resolve(resources);
        });
    }

    this.compileDeactivatedZip = function (type, subType, language, sId, lwcName, addRuntimeNamespace, namespace) {
        return new Promise((resolve, reject) => {
            this.compileDeactivated(type, subType, language, sId, lwcName, addRuntimeNamespace, namespace)
                .then(resources => {
                    const zip = new JSZip();
                    zip.file('package.xml', getZipFileMetadata());
                    resources.forEach(resource => {
                        zip.file(resource.name, resource.source);
                    });

                    zip.generateAsync({ type: 'base64' })
                        .then(content => { resolve(content); })
                        .catch(error => { reject(error); });
                })
                .catch(reject);
        });
    }

    this.compileDeactivated = function (type, subType, language, sId, lwcName, addRuntimeNamespace, namespace) {
        return new Promise((resolve, reject) => {
            const resources = [];

            // Get the HTML
            const html = htmlBuilder.getDeactivatedHtml(type, subType, language);
            resources.push({ name: `lwc/${lwcName}/${lwcName}.html`, source: html.html, type: 'html' });
            resources.push({ name: `lwc/${lwcName}/${lwcName}.css`, source: html.css, type: 'css' });

            // Get the Javascript file
            resources.push({ name: `lwc/${lwcName}/${lwcName}.js`, source: jsBuilder.getDeactivatedJs(lwcName), type: 'js' });

            // Now, let's create the metadata for the package
            resources.push({ name: `lwc/${lwcName}/${lwcName}.js-meta.xml`, source: metaBuilder.getPackageMetaXml(type, subType, language, sId, false, addRuntimeNamespace, namespace), type: 'meta' });

            // And, finally, the icon for the component
            resources.push({ name: `lwc/${lwcName}/${lwcName}.svg`, source: metaBuilder.getPackageIcon(), type: 'icon' });

            resolve(resources);
        });
    }

    function getZipFileMetadata() {
        return `<?xml version="1.0" encoding="UTF-8"?>
        <Package xmlns="http://soap.sforce.com/2006/04/metadata">
            <types>
                <members>*</members>
                <name>LightningComponentBundle</name>
            </types>
            <version>46.0</version>
        </Package>`;
    }
}

window.OmniscriptLwcCompiler = OmniscriptLwcCompiler;

},{"./builders/omniHtmlBuilder.js":4,"./builders/omniJsBuilder.js":5,"./builders/omniMetaBuilder.js":6,"./compilerConfig.js":8}],8:[function(require,module,exports){
window.OmniscriptLwcCompilerConfig = {
    baseAttributes: {
        key: '{$object.lwcId}',
        'json-def': '{$object}',
        'data-omni-key': '{$object.name}',
        'json-data': '{jsonDef.response}',
        'json-data-str': '{jsonDataStr}',
        layout: '{layout}',
        resume: '{resume}',
        'script-header-def': '{scriptHeaderDef}',
        'run-mode': '{runMode}',
    },
    elements: {
        Step: {
            bProperty: 'bStep',
            htmlTag: 'omniscript-step',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}',
            }
        },
        Text: {
            bProperty: 'bText',
            htmlTag: 'omniscript-text',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        Checkbox: {
            bProperty: 'bCheckbox',
            htmlTag: 'omniscript-checkbox',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        'Custom Lightning Web Component': {
            htmlTag: 'omniscript-custom-lwc',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            },
            custom: {
                omniattributes: {
                    'omni-resume': '{resume}',
                    'data-omni-layout': '{layout}',
                    'omni-json-def': '{$object}',
                    'omni-json-data': '{jsonDef.response}',
                    'omni-seed-json': '{jsonDef.propSetMap.seedDataJSON}',
                    'omni-custom-state': '{jsonDef.customSaveState}',
                    'omni-script-header-def': '{scriptHeaderDef}',
                    'omni-json-data-str': '{jsonDataStr}',
                    'data-omni-input': ''
                },
                ignoreAttributes: ['resume', 'layout', 'json-def', 'json-data', 'script-header-def', 'run-mode', 'json-data-str']
            }
        },
        Radio: {
            bProperty: 'bRadio',
            htmlTag: 'omniscript-radio',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        Lookup: {
            bProperty: 'bLookup',
            htmlTag: 'omniscript-lookup',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}',
            },
        },
        'Radio Group': {
            bProperty: 'bRadioGroup',
            htmlTag: 'omniscript-radio-group',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        Number: {
            bProperty: 'bNumber',
            htmlTag: 'omniscript-number',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        Password: {
            bProperty: 'bPassword',
            htmlTag: 'omniscript-password',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        Select: {
            bProperty: 'bSelect',
            htmlTag: 'omniscript-select',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        'Text Block': {
            bProperty: 'bTextBlock',
            htmlTag: 'omniscript-text-block'
        },
        Date: {
            bProperty: 'bDate',
            htmlTag: 'omniscript-date',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        'Date/Time (Local)': {
            bProperty: 'bDateTime',
            htmlTag: 'omniscript-date-time',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        Time: {
            bProperty: 'bTime',
            htmlTag: 'omniscript-time',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        Range: {
            bProperty: 'bRange',
            htmlTag: 'omniscript-range',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        Telephone: {
            bProperty: 'bTelephone',
            htmlTag: 'omniscript-telephone',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        'Text Area': {
            bProperty: 'bTextarea',
            htmlTag: 'omniscript-textarea',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        URL: {
            bProperty: 'bURL',
            htmlTag: 'omniscript-url',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        File: {
            bProperty: 'bFile',
            htmlTag: 'omniscript-file',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}',
            }
        },
        Image: {
            bProperty: 'bImage',
            htmlTag: 'omniscript-image',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}',
            }
        },
        Currency: {
            bProperty: 'bCurrency',
            htmlTag: 'omniscript-currency',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        Email: {
            bProperty: 'bEmail',
            htmlTag: 'omniscript-email',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        Block: {
            bProperty: 'bBlock',
            htmlTag: 'omniscript-block',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            },
        },
        'Type Ahead Block': {
            bProperty: 'bTypeaheadBlock',
            htmlTag: 'omniscript-typeahead-block',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            },
        },
        'Type Ahead': {
            bProperty: 'bTypeahead',
            htmlTag: 'omniscript-typeahead',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            },
        },
        'Places Typeahead': {
            bProperty: 'bPlacesTypeahead',
            htmlTag: 'omniscript-places-typeahead',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            },
        },
        'Edit Block': {
            bProperty: 'bEditBlock',
            htmlTag: 'omniscript-edit-block',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}',
                'mode': '{$object.propSetMap.mode}'
            },
        },
        'Navigate Action': {
            bProperty: 'bNavigate',
            htmlTag: 'omniscript-navigate-action',
        },
        'Cancel Action': {
            bProperty: 'bCancel',
            htmlTag: 'omniscript-cancel-action',
        },
        'Remote Action': {
            bProperty: 'bRemoteAction',
            htmlTag: 'omniscript-remote-action',
        },
        'Integration Procedure Action': {
            bProperty: 'bIntegrationProcedureAction',
            htmlTag: 'omniscript-ip-action',
        },
        'DataRaptor Extract Action': {
            bProperty: 'bDataRaptorExtractAction',
            htmlTag: 'omniscript-dr-extract-action',
        },
        'DataRaptor Post Action': {
            bProperty: 'bDataRaptorPostAction',
            htmlTag: 'omniscript-dr-post-action',
        },
        'DataRaptor Transform Action': {
            bProperty: 'bDataRaptorTransformAction',
            htmlTag: 'omniscript-dr-transform-action',
        },
        'Set Values': {
            bProperty: 'bSetValues',
            htmlTag: 'omniscript-set-values',
        },
        'Rest Action': {
            bProperty: 'bHttpAction',
            htmlTag: 'omniscript-http-action',
        },
        Formula: {
            bProperty: 'bFormula',
            htmlTag: 'omniscript-formula',
        },
        'Validation': {
            bProperty: 'bMessaging',
            htmlTag: 'omniscript-messaging',
        },
        'Multi-select': {
            bProperty: 'bMultiselect',
            htmlTag: 'omniscript-multiselect',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        'Line Break': {
            bProperty: 'bLineBreak',
            htmlTag: 'omniscript-line-break',
            ignoreAttributes: ['json-data'],
        },
        'Email Action': {
            bProperty: 'bEmailAction',
            htmlTag: 'omniscript-email-action',
        },
        'DocuSign Envelope Action': {
            bProperty: 'bDocusignEnvelopeAction',
            htmlTag: 'omniscript-docusign-envelope-action',
        },
        'DocuSign Signature Action': {
            bProperty: 'bDocusignSignatureAction',
            htmlTag: 'omniscript-docusign-signature-action',
        },
        'Disclosure': {
            bProperty: 'bDisclosure',
            htmlTag: 'omniscript-disclosure',
            attributes: {
                'seed-json': '{jsonDef.propSetMap.seedDataJSON}'
            }
        },
        'Action Block': {
            bProperty: 'bActionBlock',
            htmlTag: 'omniscript-action-block',
        },
        'Calculation Action': {
            bProperty: 'bCalculationAction',
            htmlTag: 'omniscript-calculation-action',
        },
        Aggregate: {
            bProperty: 'bAggregate',
            htmlTag: 'omniscript-aggregate',
        },
        'Matrix Action': {
            bProperty: 'bMatrixAction',
            htmlTag: 'omniscript-matrix-action',
        },
        'DataRaptor Turbo Action': {
            bProperty: 'bDataRaptorTurboAction',
            htmlTag: 'omniscript-dr-turbo-action',
        },
        'Delete Action': {
            bProperty: 'bDeleteAction',
            htmlTag: 'omniscript-delete-action',
        },
        'Set Errors': {
            bProperty: 'bSetErrors',
            htmlTag: 'omniscript-set-errors',
        }
    },
    helpers: {
        'Edit Block Label': {
            bProperty: 'bEditBlockLabel',
            htmlTag: 'omniscript-edit-block-label',
            attributes: {
                'json-def': '{$object}',
                'json-data': '{jsonDef.response}',
                'json-data-str': '{jsonDataStr}',
                layout: '{layout}',
                resume: '{resume}',
                'run-mode': '{runMode}',
                'script-header-def': '{scriptHeaderDef}',
            }
        },
        'Edit Block New': {
            bProperty: 'bEditBlockNew',
            htmlTag: 'omniscript-edit-block-new',
            attributes: {
                'json-def': '{$object}',
                'json-data': '{jsonDef.response}',
                'json-data-str': '{jsonDataStr}',
                layout: '{layout}',
                resume: '{resume}',
                'run-mode': '{runMode}',
                'script-header-def': '{scriptHeaderDef}',
            }
        }
    }
};

},{}],9:[function(require,module,exports){
/*global fileNsPrefixDot*/
(function () {
    'use strict';
    angular.module('omniscriptLwcCompiler')
        .config(['remoteActionsProvider', function (remoteActionsProvider) {
            'use strict';
            remoteActionsProvider.setRemoteActions({
            });
        }])
        .config(['$localizableProvider', function ($localizableProvider) {
            $localizableProvider.setLocalizedMap(window.i18n);
            $localizableProvider.setDebugMode(window.ns === '');
        }]);
})();

},{}],10:[function(require,module,exports){
(function () {
    /* jshint -W030 */
    'use strict';
    window.angular.module('omniscriptLwcCompiler')
        .service('bpService', function () {

            this.loadActiveLwc = loadActiveLwc;
            this.loadInactiveLwc = loadInactiveLwc;

            function loadActiveLwc(type, subType, language) {
                return new Promise((resolve, reject) => {
                    Visualforce.remoting.Manager.invokeAction(
                        omniLwcCompilerConfig.remoteActions.buildJSONWithPrefillV2.action,
                        type, subType, language, null, null, null,
                        json => {
                            const jsonObj = JSON.parse(json);

                            if (jsonObj.error !== 'OK') {
                                reject(`The OmniScript could not be fetched: ${jsonObj.error}`);
                                return;
                            }

                            resolve(jsonObj);
                        },
                        omniLwcCompilerConfig.remoteActions.buildJSONWithPrefillV2.config
                    );
                })
            }

            function loadInactiveLwc(id) {

                return new Promise((resolve, reject) => {
                    Visualforce.remoting.Manager.invokeAction(
                        omniLwcCompilerConfig.remoteActions.BuildJSONV3.action,
                        id,
                        'new',
                        true,
                        null, // sId, scriptState, bPreview, multiLangCode
                        json => {
                            const jsonObj = JSON.parse(json);

                            if (jsonObj.error !== 'OK') {
                                reject(`The OmniScript could not be fetched: ${jsonObj.error}`);
                                return;
                            }

                            resolve(jsonObj);
                        },
                        omniLwcCompilerConfig.remoteActions.BuildJSONV3.config,
                    );
                });
            }
        });
}());    
},{}],11:[function(require,module,exports){
(function () {
    /* jshint -W030 */
    'use strict';
    angular.module('omniscriptLwcCompiler')
        .service('compilerService', ['toolingService', '$modal', '$rootScope', function (toolingService, $modal, $rootScope) {

            // Instance of the compiler
            const isInsidePckg = omniLwcCompilerConfig.isInsidePckg === 'true';
            const namespace = omniLwcCompilerConfig.namespacePrefix;
            const compiler = new OmniscriptLwcCompiler(isInsidePckg ? namespace : 'c');

            let missingTypeLabel, missingSubTypeLabel, missingLanguageLabel;

            this.compileDeactivated = compileDeactivated;
            this.verifyIfExists = verifyIfExists;
            this.getLwcName = getLwcName;
            this.deactivateLwc = deactivateLwc;
            this.getComponentTag = getComponentTag;
            this.hasLwcErrors = hasLwcErrors;
            this.validate = validate;
            this.compileActivated = compileActivated;
            this.showDeploymentError = showDeploymentError;
            this.getLwcErrors = getLwcErrors;

            // Used for download
            this.getComponentZip = getComponentZip;

            /**
             * Validates if type, subType and language are valid for an LWC component.
             * Displays a modal if any error.
             * @param {string} type
             * @param {string} subType
             * @param {string} language
             */
            function validate(type, subType, language) {
                return new Promise((resolve, reject) => {
                    hasLwcErrors(type, subType, language)
                        .then(lwcErrors => {
                            if (lwcErrors.length > 0) {
                                $rootScope.vlocity.getCustomLabels('OmniDesActivationError', 'OmniDesActivationValidationError')
                                    .then(function (results) {
                                        $modal({
                                            title: results[0],
                                            templateUrl: 'alertModal.tpl.html',
                                            backdrop: 'static',
                                            show: true,
                                            controller: function ($scope) {
                                                $scope.content = results[1];
                                                $scope.errors = lwcErrors;
                                                $scope.ok = () => {
                                                    reject(lwcErrors);
                                                }
                                            }
                                        });
                                    });
                            } else {
                                resolve();
                            }
                        });
                });
            }

            function showDeploymentError(error, messagePrefix = null) {
                return new Promise(resolve => {

                    // Make sure is an array
                    if (!Array.isArray(error)) {
                        error = [error];
                    }

                    $rootScope.vlocity.getCustomLabels('OmniDesActivation')
                        .then(function (results) {
                            $modal({
                                title: results[0],
                                templateUrl: 'alertModal.tpl.html',
                                show: true,
                                controller: function ($scope) {
                                    $scope.content = messagePrefix;
                                    $scope.errors = error;
                                    $scope.ok = () => resolve();
                                }
                            });
                        });
                });
            }

            /**
             * Validates if type, subType and language are valid for an LWC component.
             * Validates if we have labels before checking for LWC errors
             * @param {string} type
             * @param {string} subType
             * @param {string} language
             * @returns {Array}
             */
            function hasLwcErrors(type, subType, language) {
                return new Promise(resolve => {
                    if (missingLanguageLabel && missingSubTypeLabel && missingTypeLabel) {
                        resolve(getLwcErrors(type, subType, language))
                    } else {
                        $rootScope.vlocity.getCustomLabels('OmniDesMissingType', 'OmniDesMissingSubType', 'OmniDesMissingLanguage')
                            .then(function (results) {
                                missingTypeLabel = results[0];
                                missingSubTypeLabel = results[1];
                                missingLanguageLabel = results[2];
                                resolve(getLwcErrors(type, subType, language))
                            });
                    }
                });
            }

            /**
             * Validates if type, subType and language are valid for an LWC component
             * @param {string} type
             * @param {string} subType
             * @param {string} language
             * @returns {Array}
             */
            function getLwcErrors(type, subType, language) {
                const errors = [];

                if (!(/^(\w)+$/.test(type)) || !type) {
                    errors.push(missingTypeLabel);
                }

                if (!(/^(\w)+$/.test(subType)) || !subType) {
                    errors.push(missingSubTypeLabel);
                }

                if (!language) {
                    errors.push(missingLanguageLabel);
                }

                return errors;
            }

            /**
             * Creates the LWC class name. If this is modified, modify on saveForLater.js as well.
             * @param {string} type
             * @param {string} subType
             * @param {string} language
             */
            function getLwcName(type, subType, language) {
                const cpType = type ? (type.charAt(0).toLowerCase() + type.slice(1)) : type;
                const cpSubType = (subType) ? (subType.charAt(0).toUpperCase() + subType.slice(1)) : subType;
                const cpLanguage = (language) ? (language.replace(/[\s()-]+/gi, '')) : language;
                return cpType + cpSubType + cpLanguage;
            }

            /**
             * @param {string} lwcName The name of the LWC component
             * @param {string} json The OmniScript JSON definition
             * @param {boolean} addRuntimeNamespace When in a package org, runtimeNamespace allows the use of packed LWC components.
             * @param {string} namespace The namespace of the package
             * @returns {Array} An array of LWC resources
             */
            function compileActivated(lwcName, json, addRuntimeNamespace, namespace) {
                return compiler.compileActivated(lwcName, json, false, addRuntimeNamespace, namespace);
            }

            /**
             * @param {string} lwcName The name of the LWC component
             * @param {string} json The OmniScript JSON definition
             * @param {boolean} addRuntimeNamespace When in a package org, runtimeNamespace allows the use of packed LWC components.
             * @param {string} namespace The namespace of the package
             * @returns {Array} An array of LWC resources
             */
            function getComponentZip(lwcName, json, addRuntimeNamespace, namespace) {
                return compiler.compileActivatedAsZip(lwcName, json, false, addRuntimeNamespace, namespace);
            }

            function compileDeactivated(lwcName, type, subType, language, sId, addRuntimeNamespace, namespace) {
                return compiler.compileDeactivated(type, subType, language, sId, lwcName, addRuntimeNamespace, namespace);
            }

            function verifyIfExists(lwcName) {
                return toolingService.existsLwcComponent(lwcName);
            }

            /**
             * Builds the html tag for the LWC component
             * @param {string} lwcName The raw LWC name of the component
             */
            function getComponentTag(lwcName) {
                return `c-${lwcName.replace(/([A-Z])/g, l => `-${l.toLowerCase()}`)}`;
            }

            /**
             * Deploys the deactivated LWC OmniScript component
             * @param {string} type
             * @param {string} subType
             * @param {string} language
             * @param {boolean} addRuntimeNamespace
             * @param {string} namespace
             * @returns {Promise}
             */
            function deactivateLwc(type, subType, language, sId, addRuntimeNamespace, namespace) {
                return new Promise((resolve, reject) => {
                    const lwcName = getLwcName(type, subType, language);
                    toolingService.existsLwcComponent(lwcName)
                        .then(exists => {
                            if (exists) {
                                // Remove the LWC and then deactivate
                                compileDeactivated(lwcName, type, subType, sId, language, addRuntimeNamespace, namespace)
                                    .then(resources => toolingService.deployResources(lwcName, resources, sId))
                                    .then(resolve)
                                    .catch(reject);
                            } else {
                                // There is no LWC, just deactivate the OmniScript
                                resolve();
                            }
                        })
                        .catch(reject);
                });
            }
        }]);
}());

},{}],12:[function(require,module,exports){
(function () {
    /* jshint -W030 */
    'use strict';
    window.angular.module('omniscriptLwcCompiler')
        .service('toolingService', ['$http', function ($http) {

            // Patch method will look for the current resources and patch them
            // When false, this will delete all current resources and then create them again
            const usePatchMethod = true;

            this.existsLwcComponent = existsLwcComponent;
            this.getLwcComponentBundle = getLwcComponentBundle;
            this.removeLwcComponent = removeLwcComponent;
            this.deploy = deploy;
            this.deployResources = deployResources;
            this.getNonOmniScriptLwcs = getNonOmniScriptLwcs;

            const urlPrefix = '/services/data/v46.0/tooling/',
                sobjectsUrl = urlPrefix + 'sobjects/',
                batchUrl = urlPrefix + 'composite/batch',
                query = urlPrefix + 'query?q=';

            /**
             * Checks if an LWC component exists on the org.
             * @param {string} name 
             */
            function existsLwcComponent(name) {
                return new Promise((resolve, reject) => {
                    conn.tooling.query("SELECT Id, DeveloperName FROM LightningComponentBundle WHERE DeveloperName = '" + name + "'", (error, result) => {
                        if (error) { console.error(error); reject(error); return; }
                        resolve(result.totalSize === 1);
                    });
                });
            }

            /**
             * Returns the Id and DeveloperName of an LWC Component. Returns null if component does not exists.
             * @param {string} name 
             */
            function getLwcComponentBundle(name) {
                return new Promise((resolve, reject) => {
                    conn.tooling.query("SELECT Id,DeveloperName,Description FROM LightningComponentBundle WHERE DeveloperName = '" + name + "'", (error, result) => {
                        if (error) { console.error(error); reject(error); return; }
                        resolve(result.totalSize === 1 ? result.records[0] : null);
                    });
                });
            }

            /**
             * Deletes an LWC Component from the org.
             * @param {string} id 
             */
            function removeLwcComponent(id) {
                return new Promise((resolve, reject) => {
                    conn.tooling.delete('LightningComponentBundle', id, (error, result) => {
                        if (error) { console.error(error); reject(error); return; }
                        resolve(result.success);
                    });
                });
            }

            /**
             * Deploys an LWC component into an org using the deployment tooling API
             * @param {Stream} stream 
             * @deprecated
             */
            function deploy(stream) {
                return new Promise((resolve, reject) => {
                    // Deploy to Salesforce
                    console.log('Start', new Date());

                    conn.metadata
                        .deploy(stream, {
                            singlePackage: true,
                            autoUpdatePackage: true,
                        })
                        .complete(function (err, deployResult) {
                            // If there is an error, reject the promise
                            if (err) {
                                reject([err.message]);
                                return;
                            }

                            // Check the deployment status and make sure it was completed sucessfully
                            checkDeployStatus(deployResult.id, resolve, reject);
                        });
                });
            }

            /**
             * 
             * @param {string} id The ID of the deployment
             * @param {Function} resolve The resolve promise callback
             * @param {Function} reject The reject promise callback
             * @deprecated
             */
            function checkDeployStatus(id, resolve, reject) {
                // Check the deployment status and make sure it was completed sucessfully
                conn.metadata.checkDeployStatus(id, true, (err, result) => {

                    // Make sure we don't have an error. If so, reject the promise.
                    if (err) {
                        reject([err.message]);
                        return;
                    }

                    // There are scenarios where the deployment is success but partially deployed, so, let's raise an error
                    if (result.success === false || result.status === "SucceededPartial") {
                        if (result.details) {
                            const errors = new Set();
                            const failures = Array.isArray(result.details.componentFailures) ? result.details.componentFailures : [result.details.componentFailures];
                            failures.forEach(error => {
                                errors.add(error.problem);
                            });

                            // Reject the promise
                            reject(Array.from(errors));
                        }
                        return;
                    }

                    // All fine, resolve the promise
                    resolve();
                    console.log('End', new Date());
                });
            }

            function getNonOmniScriptLwcs(nextUrl = '') {
                return new Promise((resolve, reject) => {

                    let url = nextUrl !== '' ?
                        nextUrl :
                        query + encodeURIComponent("SELECT Id,DeveloperName,NamespacePrefix FROM LightningComponentBundle WHERE Description != 'Vlocity DEPRECATED' AND (NOT Description LIKE 'Vlocity OmniScript Auto-generated%')");

                    submitRequest({
                        url: url,
                        data: undefined,
                        method: "GET"
                    })
                        .then(resolve)
                        .catch(reject);
                });
            }

            /**
             * Deploys the LWC component resources using the Tooling API batch.
             * @param {string} lwcName The LWC component name
             * @param {Array} resources The files to be created
             * @param {string} sId The OmniScript Id
             */
            function deployResources(lwcName, resources, sId) {
                return new Promise((resolve, reject) => {
                    const start = new Date();
                    getLwcComponentBundle(lwcName)
                        .then(bundle => usePatchMethod ?
                            processByPatch(bundle, lwcName, resources, sId) :
                            processByReplace(bundle, lwcName, resources, sId)
                        )
                        .then(data => submitResources(data.bundleId, data.resources))
                        .then(resolve)
                        .catch(reject)
                        .finally(() => {
                            const total = new Date() - start;
                            console.info('Deployment total time:', total / 1000)
                        });
                });
            }

            function processByReplace(bundle, lwcName, resources, sId) {
                const promise = bundle ?
                    updateLwcBundle(bundle.Id, sId)
                        .then(bundleId => getBundleResources(bundleId))
                        .then(bundleResources => {
                            return new Promise(resolve => {
                                resources.splice(0, 0, ...bundleResources.map(res => { return { ...res, method: 'DELETE' } })); // Using splice to modify the array by reference
                                resolve(bundle.Id);
                            });
                        })
                    :
                    createLwcBundle(lwcName, sId);

                return promise
                    .then(bundleId =>
                        createEmptyFile(bundleId, lwcName)
                            .then(fileId => new Promise(resolve => {
                                // Create a new array of elements
                                const newResources = resources.filter(res => res.type !== 'js');

                                // Get the JS file as will be a patch
                                const jsFile = resources.find(res => res.type === 'js');
                                jsFile.id = fileId;
                                jsFile.method = 'PATCH';

                                // Add the JS back, this time at the end
                                newResources.push(jsFile);

                                // Resolve
                                resolve({ bundleId, resources: newResources });
                            }))
                    );
            }

            function processByPatch(bundle, lwcName, resources, sId) {

                // If we have bundle, resolve with the id, 
                // otherwise, create the bundle, the initial file (as we can't add files if no JS in the bundle)
                // and then resolve with the bundle id
                let promise = bundle ?
                    updateLwcBundle(bundle.Id, sId) :
                    createLwcBundle(lwcName, sId)
                        .then(bundleId =>
                            createEmptyFile(bundleId, lwcName)
                                .then(() => new Promise(resolve => {
                                    // Just resolve with the bundleId
                                    resolve(bundleId);
                                }))
                        );

                return new Promise((resolve, reject) => {
                    promise
                        .then(bundleId => getBundleResources(bundleId)
                            .then(bundleResources => matchResources(resources, bundleResources))
                            .then(matchedResources => new Promise(resolve => resolve({ bundleId, resources: matchedResources })))
                        )
                        .then(resolve)
                        .catch(error => {
                            if (!Array.isArray(error)) error = [error];
                            reject([...new Set(error.map(e => e.message || e))]);
                        });
                })
            }

            /**
             * Creates an empty LWC component using the tooling API.
             * @param {string} lwcName 
             * @returns {Promise<string>}
             */
            function createLwcBundle(lwcName, sId) {
                return new Promise((resolve, reject) => {
                    submitRequest({
                        url: `${sobjectsUrl}LightningComponentBundle`, data: {
                            FullName: lwcName,
                            Metadata: {
                                isExposed: true,
                                description: 'Vlocity OmniScript Auto-generated - ' + sId,
                                targetConfigs: btoa('<targetConfig targets="lightning__AppPage, lightning__HomePage, lightning__RecordPage"><property name="layout" type="String"></property></targetConfig>\
                                <targetConfig targets="lightningCommunity__Default"><property name="layout" type="String" /><property name="recordId" type="String" label="Record Id" description="Automatically bind the page\'s record id to the component variable" default="{!recordId}" /></targetConfig>'),
                                targets: { target: ['lightningCommunity__Page', 'lightningCommunity__Default', 'lightning__RecordPage', 'lightning__AppPage', 'lightning__HomePage'] }
                            }
                        }
                    })
                        .then(result => {
                            if (!result.success) {
                                reject(result.errors);
                                return;
                            }
                            resolve(result.id);
                        })
                        .catch(error => {
                            if (!Array.isArray(error)) error = [error];
                            reject([...new Set(error.map(e => e.message))]);
                        })
                });
            }

            function updateLwcBundle(bundleId, sId) {
                return new Promise((resolve, reject) => {
                    submitRequest({
                        url: `${sobjectsUrl}LightningComponentBundle/${bundleId}`,
                        method: 'PATCH',
                        data: {
                            Metadata: {
                                description: 'Vlocity OmniScript Auto-generated - ' + sId
                            }
                        }
                    })
                        .then(result => {
                            // Patch will NOT return anything if success
                            if (!result) {
                                resolve(bundleId);
                                return;
                            }
                            if (!result.success) {
                                reject(result.errors);
                                return;
                            }
                            resolve(bundleId);
                        })
                        .catch(error => {
                            if (!Array.isArray(error)) error = [error];
                            reject([...new Set(error.map(e => e.message))]);
                        })
                });
            }

            /**
             * Returns a list of resources that belongs to the LightningComponentBundle
             * @param {string} bundleId 
             * @returns {Promise<Array>}
             */
            function getBundleResources(bundleId) {
                return new Promise((resolve, reject) => {
                    conn.tooling.query(`Select Id, FilePath From LightningComponentResource Where LightningComponentBundleId='${bundleId}'`, (error, result) => {
                        if (error) { reject(error); return; }

                        const resources = [];
                        result.records.forEach(record => {
                            resources.push({
                                id: record.Id,
                                name: record.FilePath
                            });
                        });
                        resolve(resources);
                    });
                });
            }

            /**
             * 
             * @param {Array} resources 
             * @param {Array} bundleResources 
             */
            function matchResources(resources, bundleResources) {
                return new Promise(resolve => {
                    const newResources = [];

                    for (let i = 0; i < resources.length; i++) {

                        // Does this file already exists on the current bundle?
                        let bundleResource = bundleResources.find(r => r.name === resources[i].name);

                        if (bundleResource) {

                            newResources.push({
                                ...resources[i],
                                method: 'PATCH',
                                id: bundleResource.id
                            });
                            bundleResource.found = true;

                        } else {
                            // Push to create
                            newResources.push({
                                ...resources[i],
                                method: 'POST'
                            })
                        }
                    }

                    // resolve(newResources.concat(bundleResources.filter(br => !br.found).map(br => { return { ...br, method: 'DELETE' } })));
                    resolve(newResources);
                });
            }

            function createEmptyFile(bundleId, lwcName) {
                return new Promise((resolve, reject) => {
                    // Create a dummy request as we need this in order to re-create the removed resources
                    let request = createLightningResourceRequest(bundleId, {
                        name: `lwc/${lwcName}/${lwcName}.js`,
                        source: "import { api } from 'lwc'; export default class test { @api layout; }"
                    });

                    submitRequest({ url: request.url, data: request.richInput, method: request.method })
                        .then(response => {
                            if (!response.success) {
                                throw new Error(response.errors);  // Throw the error so it can be handled on the catch
                            }
                            resolve(response.id);
                        })
                        .catch(error => {
                            if (!Array.isArray(error)) error = [error];
                            const errors = new Set(error.map(e => typeof (e) === 'String' ? e : e.message || e));
                            reject([...errors]);
                        });
                });
            }

            /**
             * Creates the request object for the LightningComponentResource
             * @param {string} bundleId The LightningComponentBundle (LWC) component
             * @param {object} resource The resource object that comes from the compiler o other tooling methods
             * @returns {object}
             */
            function createLightningResourceRequest(bundleId, resource) {
                const baseUrl = `${sobjectsUrl}LightningComponentResource`;
                const request = {
                    url: baseUrl,
                    method: resource.method || 'POST',
                    richInput: null
                }

                switch (resource.method) {
                    case 'PATCH':
                        request.richInput = {
                            Source: resource.source
                        };
                        request.url = `${baseUrl}/${resource.id}`
                        break;
                    case 'DELETE':
                        request.url = `${baseUrl}/${resource.id}`
                        break;
                    default:
                        const format = resource.name.split(".");
                        request.richInput = {
                            FilePath: resource.name,
                            LightningComponentBundleId: bundleId,
                            Source: resource.source,
                            Format: format[format.length - 1]
                        };
                        break;
                }
                return request;
            }

            /**
             * Transforms an array of resources into an array of lightning resource requests and submits them in batches
             * @param {string} lwcName The LWC component name
             * @param {string} bundleId The LightningComponentBundle Id that willhold the resources
             * @param {Array} resources The LightningComponentResource resources to be created, modified or deleted
             */
            function submitResources(bundleId, resources) {
                return new Promise((resolve, reject) => {
                    const requests = resources.map(resource => createLightningResourceRequest(bundleId, resource));
                    const size = 25;
                    const chunks = Array.from(Array(Math.ceil(requests.length / size)), (_, i) => requests.slice(i * size, i * size + size));

                    // We can process only 25 elements at the time using batch
                    return chunks.reduce((previousPromise, chunk) => {
                        return previousPromise.then(_ => processPartialBatch(chunk));
                    }, Promise.resolve({ hasErrors: false }))
                        .then(resolve)
                        .catch(error => {
                            if (!Array.isArray(error)) error = [error];
                            const errors = new Set(error.map(e => typeof (e) === 'String' ? e : e.message || e));
                            reject([...errors]);
                        });
                });
            }

            /**
             * Submits an array of LightningComponentResource in a batch request.
             * @param {Array} resources The LightningComponentResource that will be processed
             * @returns {Promise<void>}
             */
            function processPartialBatch(resources) {
                return new Promise((resolve, reject) => {
                    const request = {
                        batchRequests: resources,
                        haltOnError: true
                    };
                    submitRequest({ url: batchUrl, data: request })
                        .then(response => {
                            if (response.hasErrors) {
                                const errors = response.results
                                    .filter(result => result.statusCode < 200 || result.statusCode > 299)    // Only the errors
                                    .map(result => result.result)                                            // Return the array or results of the result
                                    .reduce((accumulator, result) => accumulator.concat(result.map(r => r.message)), [])         // Flatten array of arrays (only the message)
                                    .reduce((errors, error) => errors.add(error), new Set());                                    // Convert to a set, so no duplicate errors

                                reject([...errors]);
                            } else {
                                resolve();
                            }
                        })
                        .catch(reject);
                });
            }

            /**
             * Creates an HTTP request to the provided URL.
             * @param {object} request 
             * @param {string} request.url The URL for the request.
             * @param {string} request.data Optional. Any data that needs to be sent on the request.
             * @param {string} request.method Optional. The HTTP method. POST by default.
             */
            function submitRequest(request) {
                return new Promise((resolve, reject) => {
                    const baseUrl = window.omniLwcCompilerConfig.toolingBaseUrl;
                    const url = `${baseUrl}${request.url}`;

                    $http({
                        method: request.method || 'POST',
                        url: url,
                        headers: {
                            'Authorization': 'Bearer ' + window.omniLwcCompilerConfig.accessToken,
                            'Content-Type': 'application/json'
                        },
                        data: request.data
                    })
                        .then(response => resolve(response.data))
                        .catch(response => reject(response.data));
                });
            }
        }]);
}());

},{}],13:[function(require,module,exports){
window.DeactivatedOmniscriptLwcCssTemplate = `
.footer-message {
    font-style: italic;
    font-weight: 700;
    margin-top: 10px;
}`;

},{}],14:[function(require,module,exports){
window.DeactivatedOmniscriptLwcHtmlTemplate = `<template>
<div>
    <lightning-layout vertical-align="stretch">
        <lightning-layout-item flexibility="auto" padding="around-small" class="slds-text-align_center slds-p-around_small" size="1">
            <lightning-icon icon-name="utility:error" alternative-text="Error!" variant="error" size="large">
            </lightning-icon>
        </lightning-layout-item>
        <lightning-layout-item flexibility="auto" padding="around-small" class="custom-box">
            <p class="slds-text-heading_medium">{label.OmniScriptError}</p>
            <p class="bold">{label.OmniScriptNotFound1}</p>
            <dl class="slds-dl_inline">
                <dt class="slds-dl_inline__label"><strong>{label.OmniScriptType}:</strong></dt>
                <dd class="slds-dl_inline__detail">$type</dd>
                <dt class="slds-dl_inline__label"><strong>{label.OmniScriptSubType}:</strong></dt>
                <dd class="slds-dl_inline__detail">$subType</dd>
                <dt class="slds-dl_inline__label"><strong>{label.OmniScriptLang}:</strong></dt>
                <dd class="slds-dl_inline__detail">$language</dd>
            </dl>
            <p class="footer-message">{label.OmniScriptNotFound2}</p>
        </lightning-layout-item>
    </lightning-layout>
</div>
</template>`;

},{}],15:[function(require,module,exports){
window.DeactivatedOmniscriptLwcJavascriptTemplate = `
import { api, LightningElement } from 'lwc';
import OmniScriptError from '@salesforce/label/{$namespace}.OmniScriptError';
import OmniScriptNotFound1 from '@salesforce/label/{$namespace}.OmniScriptNotFound1';
import OmniScriptType from '@salesforce/label/{$namespace}.OmniScriptType';
import OmniScriptSubType from '@salesforce/label/{$namespace}.OmniScriptSubType';
import OmniScriptLang from '@salesforce/label/{$namespace}.OmniScriptLang';
import OmniScriptNotFound2 from '@salesforce/label/{$namespace}.OmniScriptNotFound2';


/**
 *  IMPORTANT! Generated class DO NOT MODIFY
 */
export default class {$lwcName} extends LightningElement {
    @api layout;
    label = {
        OmniScriptError,
        OmniScriptNotFound1,
        OmniScriptType,
        OmniScriptSubType,
        OmniScriptLang, 
        OmniScriptNotFound2
    }
}`;
},{}],16:[function(require,module,exports){
window.OmniscriptLwcIconTemplate = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve">  <image id="image0" width="32" height="32" x="0" y="0"
    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABzlBMVEUAAAAAirQAirQAirQA
irQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQA
irQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQA
irQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQA
irQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQA
irQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQA
irQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQA
irQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQA
irQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAirQAAAC7rtkGAAAA
mHRSTlMAGY3w4SYakPe7+K0l8rE4mf4qZ6ZpFF1eBF/bpSD89HgCG/qqYNzixySg3eqjmGYGmxyp
QiP9xKgeWvnL8e0iLJN9ug2yw4hNB7AT5jWJ3pQBUoYxuFw2wluzPYFzdcAPh4q28xBHHc7TQIDI
7Arv9sUMUHDW2kgLH83oCdRsrn8zNBIV9Z/pcQjkRuC9Veee6/uOvsysUwmEucIAAAABYktHRACI
BR1IAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH4wgCFgAFrrxriwAAAcNJREFUOMvVUflb
UlEQHaQAFZdnhSzGI9EnSRIJWWpoRYmilrQvKlG20Aq5V5qGRWSZWtr5c537+MDnV/ye833v3Jk5
583MnUv0v5iuTH/gYGnaYDShvKKyJG+uQnUN1Up1dOjwEcs/BPWwks3ukBroqBOy69hfgkZ3U7OC
Fo/zOLUC8HidJ9rMexQ+QDnpN0unqD2AvMlBreB0xxkbH2fdnURdHeg+FwJ69gzT6uxlPI8LjBfD
Brp0GeiL9A8UBXWSTxxRk47I5mdvsFv0GbIWFQF3I+MwrhQSV/OjjMREcO063YBReDflQudbwdvW
O6xwsX8XPNw9k6DuY1Q72hgE1S4D41SDiEjF9Q+0ilogQQ+BR3zJ8onHnHmi1izaU+AZJSGJOz7H
C5F6+eq1VqHgDaWgqH665y3jJKa0gmnIVIUZ1Z9Vq8eS0xp+zgSHaDGvRu/ef2AML2gEi4CPEsBH
dR2TWGL0eHb55QngExlSQFS8biyNpgwthAv0yvhn4As7XWKnWcfXWM6Ib2OhSlr9zubNivSPnJCu
6dW98yuu/gTWyS6iDf42f/nzxTKu3w7+aWuYLNvuP1SvVlDiS720X2wHqSyACsaeqeUAAAAldEVY
dGRhdGU6Y3JlYXRlADIwMTktMDgtMDJUMjI6MDA6MDUrMDM6MDCbrNRGAAAAJXRFWHRkYXRlOm1v
ZGlmeQAyMDE5LTA4LTAyVDIyOjAwOjA1KzAzOjAw6vFs+gAAAABJRU5ErkJggg==" />
</svg>
`;

},{}],17:[function(require,module,exports){
/*
  Note: Please make sure that all classes that are specified in the compiler's CSS Template are also applied to the
  OmniscriptPreview component as well in order to align the styling architecture.
*/
window.OmniscriptLwcCssTemplate = `
  @media (min-width: 48em) {
    .omniscript-btn-previous~.omniscript-btn-next,
    .omniscript-btn-previous~.omniscript-btn-save-for-later {
      margin-left: 0.75rem;
    }

    .omniscript-body[data-stepborder='right'] {
      border-right: 1px solid rgb(217, 219, 221);
    }

    .omniscript-body[data-stepborder='left'] {
      border-left: 1px solid rgb(217, 219, 221);
    }
  }

  .omniscript-article[data-content-position='right'] {
    flex-direction: row-reverse;
  }

  .omniscript-article[data-content-position='left'] {
    flex-direction: row;
  }

  .slds-spinner-container__wrapper {
    min-height: 200px;
    position: relative;
  }

  .footer-message {
    font-style: italic;
    font-weight: 700;
    margin-top: 10px;
  }

.omniscript-sfl-actions {
    font-size: 1rem;
    color: #00396b;
    font-weight: 300;
}
.omniscript-sfl-actions > div {
    display: inline-block;
    border-right: 2px solid #f4f6f9; 
    padding: 0px 10px;
}

.omniscript-sfl-actions > div:last-of-type {
    border-right: none
}

$designTokenOverride

`;

},{}],18:[function(require,module,exports){
window.editBlockSldsTemplate = `
    <div key={$object.lwcId} class={$object.sldsCls}>
        $EDITBLOCKLABEL
        $EDITBLOCK
        $EDITBLOCKNEW
    </div>
`;
window.editBlockSldsTemplateCls = "slds-grid slds-wrap slds-size_1-of-1 slds-is-relative omni-edit-block slds-size_$CTRLWIDTH-of-12"

window.editBlockNdsTemplate = `
    <div key={$object.lwcId} class={$object.ndsCls}>
        $EDITBLOCKLABEL
        $EDITBLOCK
        $EDITBLOCKNEW
    </div>
`;
window.editBlockNdsTemplateCls = "nds-grid nds-wrap nds-size_1-of-1 nds-is-relative omni-edit-block nds-size_$CTRLWIDTH-of-12"
},{}],19:[function(require,module,exports){
window.OmniscriptLwcJavascriptTemplate = `
import { api, track } from 'lwc';
import OmniscriptHeader from '{$namespace}/omniscriptHeader';
import { allCustomLabels } from '{$namespace}/omniscriptCustomLabels';
import { OMNIDEF } from './{$lwcName}_def.js';
import tmpl from './{$lwcName}.html';
import tmpl_nds from './{$lwcName}_nds.html';

/**
 *  IMPORTANT! Generated class DO NOT MODIFY
 */
export default class {$lwcName} extends OmniscriptHeader {
    @track jsonDef = {};
    @track resume = false;
    @api get inline() {
        return this._inline;
    }
    set inline(value) {
        this._inline = String(value) === 'true';
    }
    _inline = false;
    @api inlineLabel;
    @api inlineVariant;
    @api layout;
    @api recordId;

    connectedCallback() {
        // We don't need the full JSON def if we are opening a save for later
        this.jsonDef = this.instanceId ?
                        {
                            sOmniScriptId: OMNIDEF.sOmniScriptId,
                            lwcId: OMNIDEF.lwcId,
                            labelMap: OMNIDEF.labelMap,
                            propSetMap: OMNIDEF.propSetMap,
                            bpType: OMNIDEF.bpType,
                            bpSubType: OMNIDEF.bpSubType,
                            bpLang: OMNIDEF.bpLang
                        } :
                        JSON.parse(JSON.stringify(OMNIDEF));
        this.resume = !!this.instanceId;
        super.connectedCallback();
    }

    handleContinueInvalidSfl() {
        this.jsonDef = JSON.parse(JSON.stringify(OMNIDEF));
        super.handleContinueInvalidSfl();
    }

    render() {
        return this.layout === 'newport' ? tmpl_nds : tmpl;
    }
}`;

},{}],20:[function(require,module,exports){
/*
  Note: Please make sure that all classes that are specified in the compiler's CSS Template are also applied to the
  OmniscriptPreview component's nds template as well in order to align the styling architecture.

  The following spinner css is temporary until sfdc fixes the svg tagName support issue as outlined in
  https://github.com/salesforce/lwc/issues/1367.
*/
window.OmniscriptLwcNdsCssTemplate = `
  .omni-spinner-container_wrapper {
    min-height: 200px;
    position: relative;
  }

  .footer-message {
    font-style: italic;
    font-weight: 700;
    margin-top: 10px;
  }
`;

},{}],21:[function(require,module,exports){
window.OmniscriptLwcNdsTemplate = `
<template>
    <template if:true={hasErrors}>
        <lightning-layout vertical-align="stretch">
            <lightning-layout-item flexibility="auto" padding="around-small" class="slds-text-align_center slds-p-around_small" size="1">
                <lightning-icon icon-name="utility:error" alternative-text="Error!" variant="error" size="large">
                </lightning-icon>
            </lightning-layout-item>
            <lightning-layout-item flexibility="auto" padding="around-small" class="custom-box">
                <p class="slds-text-heading_medium">{allCustomLabelsUtil.OmniScriptError}</p>
                <p class="bold">{_errorMsg}</p>
                <dl class="slds-dl_inline" if:false={_isActiveOs}>
                    <dt class="slds-dl_inline__label"><strong>{allCustomLabelsUtil.OmniScriptType}:</strong></dt>
                    <dd class="slds-dl_inline__detail">$type</dd>
                    <dt class="slds-dl_inline__label"><strong>{allCustomLabelsUtil.OmniScriptSubType}:</strong></dt>
                    <dd class="slds-dl_inline__detail">$subType</dd>
                    <dt class="slds-dl_inline__label"><strong>{allCustomLabelsUtil.OmniScriptLang}:</strong></dt>
                    <dd class="slds-dl_inline__detail">$language</dd>
                </dl>
                <p class="footer-message">{allCustomLabelsUtil.OmniScriptNotFound2}</p>
            </lightning-layout-item>
        </lightning-layout>
    </template>
    <template if:false={hasErrors}>
        <div class="via-nds">
            <template if:false={compLoaded}>
                <div class="omni-spinner-container_wrapper">
                    <{$namespace}-spinner variant="brand"
                                        alternative-text="Loading.."
                                        theme={_theme}
                                        size="medium">
                    </{$namespace}-spinner>
                </div>
            </template>
            <template if:true={bSflValid}>
                <template if:true={firstRender}>
                    <{$namespace}-navigate-action if:true={isLauncherVisible}
                                                  target-type={_launcherAction.type}
                                                  target-params={_launcherAction.params}>
                        <{$namespace}-button label={inlineLabel}
                                             variant={inlineVariant}
                                             theme={_theme}
                                             extraclass="slds-button_stretch">
                        </{$namespace}-button>
                    </{$namespace}-navigate-action>
                    <article class={containerClasses}>
                        <div class="nds-card__body nds-card__body_inner nds-m-top_medium">
                            <template if:true={bSflAuto}>
                                <{$sflAcknowledge} result={bSflResult}
                                                   layout={layout}
                                                   auto></{$sflAcknowledge}>
                            </template>
                            <{$stepChart} json-def={jsonDef}
                                          json-data={jsonDef.response}
                                          if:false={jsonDef.propSetMap.hideStepChart}
                                          data-omni-key='omniscriptStepChart'
                                          props={stepChartProps}
                                          layout={layout}
                                          script-header-def={scriptHeaderDef}>
                            </{$stepChart}>
                            {$omniKBhtml}
                            <template if:true={isPageLoading}>
                                <{$namespace}-spinner variant="brand"
                                                    alternative-text="Loading..."
                                                    extraouterclass="nds-theme_default"
                                                    theme={_theme}
                                                    message={spinnerMessage}
                                                    size="medium">
                                </{$namespace}-spinner>
                            </template>
                            {$omnihtml}
                        </div>
                        <div class="nds-m-around_small">
                            <div class="nds-grid nds-grid_align-center">
                                <div class="nds-grid nds-grid_align-center nds-wrap nds-button-group-row nds-size_1-of-1 nds-medium-size_8-of-12 nds-p-horizontal_medium">
                                    <template if:true={hasNext}>
                                        <{$namespace}-navigate-action
                                            if:true={_isSeoEnabled}
                                            target-type="Current Page"
                                            class={navButton.next.classes}
                                            use-href
                                            target-params={navButton.next.targetParams}>
                                            <{$namespace}-button
                                                type="button"
                                                label={navButton.next.label}
                                                variant="brand"
                                                extraclass="slds-size_1-of-1 slds-p-horizontal_none slds-text-align_center"
                                                theme={_theme}>
                                            </{$namespace}-button>
                                        </{$namespace}-navigate-action>

                                        <{$namespace}-button
                                            if:false={_isSeoEnabled}
                                            type="button"
                                            variant="brand"
                                            onclick={nextStep}
                                            class={navButton.next.classes}
                                            label={navButton.next.label}
                                            extraclass="nds-button_stretch nds-p-around_xx-small nds-size_1-of-1"
                                            theme={_theme}>
                                        </{$namespace}-button>
                                    </template>
                                </div>
                            </div>
                            <div class="nds-grid nds-grid_align-center">
                                <div class="nds-grid nds-grid_align-center nds-wrap nds-button-group-row nds-size_1-of-1 nds-medium-size_8-of-12 nds-p-horizontal_medium">
                                    <template if:true={hasPrev}>
                                        <{$namespace}-navigate-action
                                            if:true={_isSeoEnabled}
                                            target-type="Current Page"
                                            use-href
                                            class={navButton.previous.classes}
                                            target-params={navButton.previous.targetParams}>
                                            <{$namespace}-button
                                                type="button"
                                                variant="neutral"
                                                label={navButton.previous.label}
                                                extraclass="nds-button_stretch nds-p-around_xx-small nds-size_1-of-1"
                                                theme={_theme}>
                                            </{$namespace}-button>
                                        </{$namespace}-navigate-action>

                                        <{$namespace}-button
                                            if:false={_isSeoEnabled}
                                            type="button"
                                            variant="neutral"
                                            onclick={prevStep}
                                            label={navButton.previous.label}
                                            class={navButton.previous.classes}
                                            extraclass="nds-button_stretch nds-p-around_xx-small nds-size_1-of-1"
                                            theme={_theme}>
                                        </{$namespace}-button>
                                    </template>
                                </div>
                            </div>
                            <div class="nds-grid nds-grid_align-center">
                                <div class="nds-grid nds-grid_align-center nds-wrap nds-button-group-row nds-size_1-of-1 nds-medium-size_8-of-12 nds-p-horizontal_medium">

                                    <template if:true={cancelAction}>
                                        <{$namespace}-button type="button"
                                                label={cancelLabel}
                                                variant="base"
                                                class={navButton.save.classes}
                                                extraclass="nds-button_stretch nds-p-around_xx-small nds-size_1-of-1"
                                                onclick={cancel}
                                                theme={_theme}>
                                        </{$namespace}-button>
                                    </template>
                                    <{$namespace}-navigate-action
                                        data-omni-key="DEFAULT-CANCEL"
                                        target-type={_defaultCancel.type}
                                        target-params={_defaultCancel.params}>
                                    </{$namespace}-navigate-action>

                                    <template if:true={allowSfl}>
                                        <{$namespace}-button type="button"
                                                            variant="base"
                                                            onclick={saveForLater}
                                                            class={navButton.save.classes}
                                                            label={navButton.save.label}
                                                            extraclass="nds-button_stretch nds-p-around_xx-small nds-size_1-of-1"
                                                            theme={_theme}>
                                        </{$namespace}-button>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </article>

                    <template if:true={bSflComplete}>
                        <{$sflAcknowledge} result={bSflResult} layout={layout}></{$sflAcknowledge}>
                    </template>
                    <template for:each={modalEvents}
                            for:item="modallvl1"
                            for:index="indexlvl1">
                        <{$modal} data-omni-key='omnimodal'
                                  key={modallvl1.modalHeader}
                                  type={modallvl1.type}
                                  layout={layout}
                                  triggered-on-step={modallvl1.triggeredOnStep}
                                  hide-footer={modallvl1.hideFooter}
                                  hide-header={modallvl1.hideHeader}>
                            <div slot="header">
                                <h1>{modallvl1.modalHeader}</h1>
                            </div>
                            <div slot="content">
                                <{$namespace}-omniscript-formatted-rich-text value={modallvl1.modalMessage} disable-linkify></{$namespace}-omniscript-formatted-rich-text>
                            </div>
                            <div slot="footer">
                                <ul class="slds-button-group-row">
                                    <template for:each={modallvl1.buttons}
                                            for:item="modalbutton"
                                            for:index="modalbuttonindex">
                                        <template if:true={modalbutton.label}>
                                            <li class="slds-button-group-item"
                                                key={modalbutton.key}>
                                                <lightning-button label={modalbutton.label}
                                                                value={indexlvl1}
                                                                onclick={modalbutton.handleClick}>
                                                </lightning-button>
                                            </li>
                                        </template>
                                    </template>
                                </ul>
                            </div>
                        </{$modal}>
                    </template>
                </template>
            </template>
            <template if:false={bSflValid}>
                <div class="nds-grid nds-wrap nds-gutters nds-p-horizontal_medium">
                    <div class="nds-col nds-size_12-of-12 nds-medium-size_2-of-12"></div>
                    <div class="nds-col nds-size_12-of-12 nds-medium-size_8-of-12">
                        <div class='nds-card omniscript-save-for-later'>
                            <div class="nds-card__header nds-grid">
                                <header class="nds-media nds-media_center nds-has-flexi-truncate">
                                    <div class="nds-media__figure">
                                        <lightning-icon icon-name="utility:warning"
                                                        alternative-text="Ok"
                                                        size="large"></lightning-icon>
                                    </div>
                                    <div class="nds-media__body">
                                        <h2 class="nds-card__header-title">
                                            <span class="nds-text-heading_large">{allCustomLabelsUtil.OmniInvalidLwcComponent}</span>
                                        </h2>
                                    </div>
                                </header>
                            </div>
                            <div class='nds-card__body nds-card__body_inner'>
                                <p class="bold">{allCustomLabelsUtil.OmniInvalidLwcComponentMessage}</p>
                                <p>&nbsp;</p>
                                <div class="nds-m-around_small">
                                    <div class="nds-grid">
                                        <div class="nds-grid nds-wrap nds-button-group-row nds-size_1-of-1 nds-medium-size_8-of-12 nds-p-horizontal_medium">
                                                <{$namespace}-button type="button"
                                                                    variant="brand"
                                                                    onclick={handleContinueInvalidSfl}
                                                                    label={allCustomLabelsUtil.OmniContinue}
                                                                    class="nds-m-left_x-small"
                                                                    extraclass="nds-button_stretch nds-p-around_xx-small nds-size_1-of-1"
                                                                    theme={_theme}>
                                                </{$namespace}-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="nds-col nds-size_12-of-12 nds-medium-size_2-of-12"></div>
                </div>
            </template>
        </div>
    </template>
</template>`;

},{}],22:[function(require,module,exports){
window.OmniscriptLwcSldsTemplate = `
<template>
    <template if:true={hasErrors}>
        <lightning-layout vertical-align="stretch">
            <lightning-layout-item flexibility="auto" padding="around-small" class="slds-text-align_center slds-p-around_small" size="1">
                <lightning-icon icon-name="utility:error" alternative-text="Error!" variant="error" size="large">
                </lightning-icon>
            </lightning-layout-item>
            <lightning-layout-item flexibility="auto" padding="around-small" class="custom-box">
                <p class="slds-text-heading_medium">{allCustomLabelsUtil.OmniScriptError}</p>
                <p class="bold">{_errorMsg}</p>
                <dl class="slds-dl_inline" if:false={_isActiveOs}>
                    <dt class="slds-dl_inline__label"><strong>{allCustomLabelsUtil.OmniScriptType}:</strong></dt>
                    <dd class="slds-dl_inline__detail">$type</dd>
                    <dt class="slds-dl_inline__label"><strong>{allCustomLabelsUtil.OmniScriptSubType}:</strong></dt>
                    <dd class="slds-dl_inline__detail">$subType</dd>
                    <dt class="slds-dl_inline__label"><strong>{allCustomLabelsUtil.OmniScriptLang}:</strong></dt>
                    <dd class="slds-dl_inline__detail">$language</dd>
                </dl>
                <p class="footer-message">{allCustomLabelsUtil.OmniScriptNotFound2}</p>
            </lightning-layout-item>
        </lightning-layout>
    </template>
    <template if:false={hasErrors}>
        <template if:false={compLoaded}>
            <div class="slds-spinner-container__wrapper">
                <{$namespace}-spinner variant="brand"
                                    alternative-text="Loading..."
                                    size="medium">
                </{$namespace}-spinner>
            </div>
        </template>
        <template if:true={bSflValid}>
            <template if:true={firstRender}>
                <{$namespace}-navigate-action if:true={isLauncherVisible}
                                              target-type={_launcherAction.type}
                                              target-params={_launcherAction.params}>
                    <{$namespace}-button label={inlineLabel}
                                         variant={inlineVariant}
                                         theme={_theme}
                                         extraclass="slds-button_stretch">
                    </{$namespace}-button>
                </{$namespace}-navigate-action>
                <article class={containerClasses}
                         data-content-position={stepChartProps.position}>
                    <div class={_sideContentClasses}>
                        <{$stepChart} json-def={jsonDef}
                                      json-data={jsonDef.response}
                                      if:false={jsonDef.propSetMap.hideStepChart}
                                      data-omni-key='omniscriptStepChart'
                                      props={stepChartProps}
                                      layout={layout}
                                      script-header-def={scriptHeaderDef}>
                        </{$stepChart}>
                        {$omniKBhtml}
                    </div>
                    <div data-stepborder={stepChartProps.position}
                        class={contentSldsClass}>
                        <template if:true={isPageLoading}>
                            <{$namespace}-spinner variant="brand"
                                                alternative-text="Loading..."
                                                extraouterclass="slds-theme_default"
                                                message={spinnerMessage}
                                                size="medium">
                            </{$namespace}-spinner>
                        </template>
                        <template if:true={bSflAuto}>
                            <{$sflAcknowledge} result={bSflResult}
                                               layout={layout}
                                               auto></{$sflAcknowledge}>
                        </template>
                        {$omnihtml}
                        <div class="slds-grid slds-wrap slds-gutters slds-p-horizontal_medium">
                            <div class="slds-col slds-size_12-of-12 slds-medium-size_6-of-12">
                                <div class="omniscript-sfl-actions">
                                    <div if:true={cancelAction}>
                                        <{$namespace}-button
                                            type="button"
                                            label={cancelLabel}
                                            variant="base"
                                            class={navButton.save.classes}
                                            onclick={cancel}>
                                        </{$namespace}-button>
                                    </div>

                                    <{$namespace}-navigate-action
                                        data-omni-key="DEFAULT-CANCEL"
                                        target-type={_defaultCancel.type}
                                        target-params={_defaultCancel.params}>
                                    </{$namespace}-navigate-action>

                                    <template if:true={allowSfl}>
                                        <div>
                                            <{$namespace}-button type="button"
                                                    label={navButton.save.label}
                                                    variant="base"
                                                    class={navButton.save.classes}
                                                    onclick={saveForLater}>
                                            </{$namespace}-button>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div class="slds-col slds-size_12-of-12 slds-medium-size_6-of-12">
                                <div class="slds-grid slds-wrap slds-grid_align-end">
                                    <template if:true={hasPrev}>
                                        <{$namespace}-navigate-action
                                            if:true={_isSeoEnabled}
                                            target-type="Current Page"
                                            class={navButton.previous.classes}
                                            use-href
                                            replace
                                            target-params={navButton.previous.targetParams}>
                                            <{$namespace}-button
                                                type="button"
                                                label={navButton.previous.label}
                                                variant="brand"
                                                extraclass="slds-size_1-of-1 slds-p-horizontal_none slds-text-align_center">
                                            </{$namespace}-button>
                                        </{$namespace}-navigate-action>

                                        <{$namespace}-button
                                            if:false={_isSeoEnabled}
                                            type="button"
                                            label={navButton.previous.label}
                                            variant="brand"
                                            class={navButton.previous.classes}
                                            extraclass="slds-size_1-of-1 slds-p-horizontal_none slds-text-align_center"
                                            onclick={prevStep}>
                                        </{$namespace}-button>
                                    </template>
                                    <template if:true={hasNext}>
                                        <{$namespace}-navigate-action
                                            if:true={_isSeoEnabled}
                                            target-type="Current Page"
                                            use-href
                                            replace
                                            class={navButton.next.classes}
                                            target-params={navButton.next.targetParams}>
                                            <{$namespace}-button
                                                type="button"
                                                label={navButton.next.label}
                                                variant="brand"
                                                extraclass="slds-size_1-of-1 slds-p-horizontal_none slds-text-align_center">
                                            </{$namespace}-button>
                                        </{$namespace}-navigate-action>

                                        <{$namespace}-button
                                            if:false={_isSeoEnabled}
                                            type="button"
                                            label={navButton.next.label}
                                            variant="brand"
                                            class={navButton.next.classes}
                                            extraclass="slds-size_1-of-1 slds-p-horizontal_none slds-text-align_center"
                                            onclick={nextStep}>
                                        </{$namespace}-button>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                <template if:true={bSflComplete}>
                    <{$sflAcknowledge} result={bSflResult} layout={layout}></{$sflAcknowledge}>
                </template>
                <template for:each={modalEvents}
                        for:item="modallvl1"
                        for:index="indexlvl1">
                    <{$modal} data-omni-key='omnimodal'
                              key={modallvl1.modalHeader}
                              type={modallvl1.type}
                              layout={layout}
                              triggered-on-step={modallvl1.triggeredOnStep}
                              hide-footer={modallvl1.hideFooter}
                              hide-header={modallvl1.hideHeader}>
                        <div slot="header">
                            <h1>{modallvl1.modalHeader}</h1>
                        </div>
                        <div slot="content">
                            <{$namespace}-omniscript-formatted-rich-text value={modallvl1.modalMessage} disable-linkify></{$namespace}-omniscript-formatted-rich-text>
                        </div>
                        <div slot="footer">
                            <ul class="slds-button-group-row">
                                <template for:each={modallvl1.buttons}
                                        for:item="modalbutton"
                                        for:index="modalbuttonindex">
                                    <template if:true={modalbutton.label}>
                                        <li class="slds-button-group-item"
                                            key={modalbutton.key}>
                                            <lightning-button label={modalbutton.label}
                                                            value={indexlvl1}
                                                            onclick={modalbutton.handleClick}>
                                            </lightning-button>
                                        </li>
                                    </template>
                                </template>
                            </ul>
                        </div>
                    </{$modal}>
                </template>
            </template>
        </template>

        <template if:false={bSflValid}>
            <div class="slds-grid slds-wrap slds-gutters slds-p-horizontal_medium">
                <div class="slds-col slds-size_12-of-12 slds-medium-size_2-of-12"></div>
                <div class="slds-col slds-size_12-of-12 slds-medium-size_8-of-12">
                    <div class='slds-card omniscript-save-for-later'>
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__figure">
                                    <lightning-icon icon-name="utility:warning"
                                                    alternative-text="Ok"
                                                    variant="warning"
                                                    size="large"></lightning-icon>
                                </div>
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">
                                        <span class="slds-text-heading_large">{allCustomLabelsUtil.OmniInvalidLwcComponent}</span>
                                    </h2>
                                </div>
                            </header>
                        </div>
                        <div class='slds-card__body slds-card__body_inner'>
                            <p class="bold">{allCustomLabelsUtil.OmniInvalidLwcComponentMessage}</p>
                            <p>&nbsp;</p>
                            <div class="slds-grid slds-wrap slds-gutters slds-p-horizontal_medium">
                                <div class="slds-col slds-size_12-of-12 slds-medium-size_6-of-12">
                                    <lightning-button variant="brand"
                                                    label={allCustomLabelsUtil.OmniContinue}
                                                    title={allCustomLabelsUtil.OmniContinue}
                                                    class="slds-m-left_x-small"
                                                    onclick={handleContinueInvalidSfl}
                                                    style="padding-left: 10px"></lightning-button>
                                </div>
                                <div class="slds-col slds-size_12-of-12 slds-medium-size_6-of-12"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="slds-col slds-size_12-of-12 slds-medium-size_2-of-12"></div>
            </div>
        </template>
    </template>
</template>`;

},{}],23:[function(require,module,exports){
(function () {
    /* jshint -W030 */
    'use strict';
    angular.module('omniscriptLwcCompiler').controller('vfPageController', function ($rootScope, $scope, compilerService, toolingService, bpService) {

        $scope.loading = false;
        $scope.errors = [];
        $scope.cmp = null;
        $scope.params = {
            download: false,
            deploy: false,
            deactivated: false,
            addRuntimeNamespace: false,
            layout: 'lightning',
            prefill: null
        }

        function addEventListeners() {

            // Listen for the event
            window.addEventListener('message', receiveMessage, false);
            window.addEventListener('omniaggregate', function (event) {
                // Pass the data to the parent, as is needed there (because we are in an iframe)
                const data = JSON.parse(JSON.stringify(event.detail.data));
                var event = new CustomEvent('omniaggregate', {
                    bubbles: true,
                    cancelable: false,
                    composed: false,
                    detail: data
                });
                window.parent.document.dispatchEvent(event);
            }, false);
            window.addEventListener('omniactiondebug', function (event) {
                // Pass the data to the parent, as is needed there (because we are in an iframe)
                const data = JSON.parse(JSON.stringify(event.detail));
                var event = new CustomEvent('omniactiondebug', {
                    bubbles: true,
                    cancelable: false,
                    composed: false,
                    detail: {
                        element: data.element,
                        response: data.response,
                        args: [data.params.sMethodName, data.params.sClassName, data.params.input, data.params.options]
                    }
                });
                window.parent.document.dispatchEvent(event);
            }, false);

            const targetNode = document.querySelector("#auraErrorMessage");
            const config = { childList: true };

            // Callback function to execute when mutations are observed
            const callback = function (mutationsList, observer) {
                for (var mutation of mutationsList) {
                    if (mutation.type == 'childList') {
                        // This means an error has ocurred and the auraErrorMessage has been populated
                        if (mutation.addedNodes.length > 0 && $scope.loading) {
                            $scope.$apply(_ => {
                                // If lwc load succesfully, making sure error div is empty
                                const error = document.querySelector("#auraErrorMessage").innerHTML;
                                document.querySelector("#auraErrorMessage").innerHTML = '';

                                // Hide the loading
                                $scope.errors = [error];
                                $scope.loading = false;
                            });
                        }
                    }
                }
            };

            // Create an observer instance linked to the callback function
            var observer = new MutationObserver(callback);

            // Start observing the target node for configured mutations
            observer.observe(targetNode, config);
        }

        /**
         * Callback when the event "message" is received
         * @param {any} event
         */
        function receiveMessage(event) {
            // Get the values from the event data
            let lwcName, jsonObj;
            const data = event.data;

            // LWC dispatches window events, so, we need to be sure that we handle ONLY events with fetchType
            // OWC-279 and OWC-383
            if (!data || !data.fetchType) {
                return;
            }

            $scope.$apply(_ => {
                // Set the scope
                $scope.errors = [];
                $scope.loading = true;

                $scope.params.download = data.download;
                $scope.params.deploy = data.deploy;
                $scope.params.deactivated = data.deactivated;
                $scope.params.addRuntimeNamespace = data.addRuntimeNamespace;
                $scope.params.layout = data.layout || 'lightning';
                $scope.params.prefill = data.prefill || '';
            });

            switch (data.fetchType) {
                case 'id':
                    // When loading an inactive OmniScript, we should load the preview component. The component will make the remote call
                    // to load the OmniScript definition
                    if (data.download) {
                        bpService.loadInactiveLwc(data.sId)
                            .then(json => processJsonDef(`omniScript${data.sId}`, json))
                            .catch(() => { alert('Could not generate download file'); });
                    }

                    // Load the preview
                    loadPreview('omniscriptPreview', data.sId);
                    break;
                case 'active':
                    loadActiveLwc(data.type, data.subType, data.language);
                    break;
                case 'jsonDef':
                    jsonObj = JSON.parse(event.data.jsonDef);
                    lwcName = compilerService.getLwcName(jsonObj.bpType, jsonObj.bpSubType, jsonObj.bpLang, data.download, data.deploy);
                    processJsonDef(lwcName, jsonObj);
                    break;
            }
        }

        function loadActiveLwc(type, subType, language) {

            let lwcName = compilerService.getLwcName(type, subType, language);

            compilerService.verifyIfExists(lwcName)
                .then(exists => {
                    if (!exists || $scope.params.download || $scope.params.deploy) {

                        // The OmniScript designer sends deploy = false as we don't want to overwrite the component
                        // But, the compiler page can manually send deploy = true (for testing)
                        if (!exists) {
                            $scope.$apply(() => { $scope.params.deploy = true; });
                        }

                        bpService.loadActiveLwc(type, subType, language)
                            .then(json => processJsonDef(lwcName, json))
                            .catch(() => alert('Could not load active OmniScript'));
                    } else {
                        loadPreview(lwcName);
                    }
                });
        }

        /**
         * Callback that process the result of fetching an OmniScript from the backend
         * @param {string} lwcName The LWC package name
         * @param {object} jsonObj The OmniScript JSON result
         * @param {boolean} downloadFile Do we need to download the ZIP file
         * @param {boolean} deployToOrg Do we need to deploy to the org
         * @param {boolean} hidden If the LWC component is available or not on the AppBuilder
         */
        function processJsonDef(lwcName, json) {
            // Process the json and create the ZIP stream
            const namespace = window.omniLwcCompilerConfig.namespacePrefix;

            if ($scope.params.download) {
                compilerService.getComponentZip(lwcName, json, $scope.params.addRuntimeNamespace, namespace)
                    .then(stream => saveAs(b64toFile(stream), lwcName + '.zip'))
                    .catch(() => alert('Could not generate download file'))
                    .finally(() => {
                        $scope.$apply(() => {
                            $scope.loading = false;
                        });
                    });
            }

            if ($scope.params.deploy) {
                const fn = $scope.params.deactivated ?
                    compilerService.compileDeactivated(lwcName, json.bpType, json.bpSubType, json.bpLang, json.sOmniScriptId, $scope.params.addRuntimeNamespace, namespace) :
                    compilerService.compileActivated(lwcName, json, $scope.params.addRuntimeNamespace, namespace);

                // Deploy now
                fn.then(resources => toolingService.deployResources(lwcName, resources, json.sOmniScriptId))
                    .then(() => {
                        try {
                            sforce.one.showToast({
                                title: 'LWC Component Deployment',
                                message: 'The LWC component was deployed successfully',
                                type: 'success'
                            });
                        } catch{ }  // Swallow the error. sforce is only available on Visualforce, not on Lightning (compiler standalone)
                        loadPreview(lwcName);
                    })
                    .catch(errors => {
                        $scope.$apply(() => {
                            $scope.errors = typeof errors !== Array ? [errors] : errors;
                        });
                    })
                    .finally(() => {
                        $scope.$apply(() => {
                            $scope.loading = false;
                        });
                    });
            }
        }

        /**
         * Loads a preview of the LWC component
         * @param {string} lwcName The LWC component to load
         * @param {object} attrs The attributes to load the LWC component
         */
        function loadPreview(lwcName, omniScriptId) {
            let attrs = { prefill: $scope.params.prefill, layout: $scope.params.layout, id: omniScriptId, preview: true },
                namespace = window.omniLwcCompilerConfig.namespacePrefix,
                componentNamespace = omniScriptId ? namespace : 'c';        // if it is preview, the namespace is the package namespace

            if ($scope.cmp) {
                $scope.cmp.destroy();
            }

            document.getElementById('lightning').innerHTML = "";
            $Lightning.use(`${namespace}:OmniPreviewAuraWrapper`, function () {
                $Lightning.createComponent(`${componentNamespace}:${lwcName}`,
                    attrs,
                    "lightning",
                    function (cmp, status) {
                        $scope.$apply(_ => {
                            // If lwc load succesfully, making sure error div is empty
                            document.querySelector("#auraErrorMessage").innerHTML = "";
                            $scope.cmp = cmp;

                            // Hide the loading
                            $scope.loading = false;
                        });
                    }
                );
            });
        }

        /**
         * Converts a base64 string to a Blob file
         * @param {string} b64Data
         * @param {string} filename
         * @param {string} contentType
         */
        function b64toFile(b64Data, filename, contentType) {
            var sliceSize = 512;
            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);
                var byteNumbers = new Array(slice.length);

                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            var file = new File(byteArrays, filename, { type: contentType });
            return file;
        }

        // Add the event listeners for the compiler / LWC
        addEventListeners();
    });
}());
},{}],24:[function(require,module,exports){
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    /* jshint eqnull:true */
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
},{}],25:[function(require,module,exports){
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    /* jshint eqnull:true */
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}
},{}],26:[function(require,module,exports){
// Production steps of ECMA-262, Edition 6, 22.1.2.1
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from?v=example
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method 
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}
},{}],27:[function(require,module,exports){
/**
 * Module: sharedObjectService[For using common data/Object for using in different controller]
 */
angular.module('sharedObjectService', [])

    /**
     * Factory NotSupportedElmService[For getting non supported element for base template]
     * @param  {[function]} 
     * @return {[Service]}
     */
    .factory('NotSupportedElmService', function() {
        var NotSupportedElmService;

        NotSupportedElmService = (function() {
            function NotSupportedElmService() {}

            /**
             * [getList return list of not supported element in Base template]
             * @return {[type]} [object]
             */
            NotSupportedElmService.prototype.getList = function() {
                return {
                    "Image": "Image",
                    "Block": "Block",
                    "File": "File",
                    "Disclosure": "Disclosure",
                    "Headline": "Headline",
                    "Validation": "Validation",
                    "Line Break": "Line Break",
                    "Text Block": "Text Block",
                    "Radio Group": "Radio Group",
                    "Type Ahead Block":"Type Ahead Block"
                }
            };
            return NotSupportedElmService;
    })();

    if (typeof(window.angularSharedService) === 'undefined' || window.angularSharedService === null) {
        window.angularSharedService = new NotSupportedElmService();
    }

    return window.angularSharedService;
});
},{}]},{},[1]);
})();

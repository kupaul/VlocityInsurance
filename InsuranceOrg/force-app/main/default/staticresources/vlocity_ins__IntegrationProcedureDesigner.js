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
'use strict';
require('./dependencies/native.history.js');
require('./dependencies/angular-drag-and-drop-lists.js');
require('./polyfills/Array.find.js');
require('./polyfills/Array.findIndex.js');
require('./polyfills/Array.from.js');
require('./sharedObjectService.js');

angular.module('omniscriptDesigner', ['vlocity', 'omnidesigner.core', 'oui', 'mgcrea.ngStrap',
        'ui-rangeSlider', 'dndLists', 'ngSanitize', 'sldsangular', 'ngOrderObjectBy',
        'viaExpressionEngine', 'ui.tinymce', 'dataraptor', 'drvcomp', 'ouihome', 'sharedObjectService', 'monacoEditor'
    ])
    .value('isIntegrationProcedure', true)
    .constant('vkbeautify', window.vkbeautify);

require('./modules/oui/Oui.js');

require('./modules/designer/config/run.js');
require('./modules/designer/config/config.js');

require('./modules/designer/component/ips/IntegrationProcedurePropertySet.js');
require('./modules/designer/component/DataSourceProperty.js');
require('./modules/designer/component/DataraptorSelect.js');

require('./modules/designer/component/ips/action/index.js');
require('./modules/designer/component/ips/group/index.js');
require('./modules/designer/component/common/index.js');

require('./modules/designer/controller/OmniScriptDesigner.js');
require('./modules/designer/controller/ElementPalette.js');
require('./modules/designer/controller/StructureCanvas.js');
require('./modules/designer/controller/intProcedureTabbedController.js');
require('./modules/designer/controller/PropertiesController.js');
require('./modules/designer/controller/ScriptFormController.js');

require('./modules/designer/directive/NumberInputNullValueFix.js');
require('./modules/designer/directive/PreventDeleteBack.js');
require('./modules/designer/directive/PaletteGroup.js');
require('./modules/designer/directive/ViaAffix.js');
require('./modules/designer/directive/vlc-draggable.js');
require('./modules/designer/directive/vlc-bubble-canceller.js');
require('./modules/designer/directive/vlc-expand-collapse.js');
require('./modules/designer/directive/intProcedurePreviewPanel.js');
require('./modules/designer/directive/ngOrderObjectBy.js');
require('./modules/designer/directive/showHideRule.js');

require('./modules/designer/filter/ActiveElementTitle.js');
require('./modules/designer/filter/ClassName.js');
require('./modules/designer/filter/ElementLabel.js');
require('./modules/designer/filter/GetTypeForElement.js');
require('./modules/designer/filter/FixMissingProperties.js');
require('./modules/designer/filter/ReadablePropertyName.js');
require('./modules/designer/filter/ControlType.js');

require('./modules/designer/factory/propCompUtil.js');
require('./modules/designer/services/vlocityUiTemplatesService.js');
require('./modules/designer/factory/InterTabMsgBus.js');
require('./modules/designer/factory/Delete.js');
require('./modules/designer/services/dataraptorBundleService.js');
require('./modules/designer/services/sObjectService.js');
require('./modules/designer/services/tinyMCEImageInsert.js');
require('./modules/designer/services/propertyEditorModalService.js');
require('./modules/designer/services/customViewModalService.js');
require('./modules/designer/services/customLabelService.js');
require('./modules/designer/oui_tinymce_plugins/smart_link.js');
require('./modules/designer/oui_tinymce_plugins/doc_insert.js');

require('./modules/designer/templates/templates.js');
require('./modules/designer/directive/logging.js');
require('./modules/designer/directive/treeView.js');
require('./modules/designer/directive/vlcCollapsible.js');
require('./modules/designer/directive/vlcClipboard.js');
require('./modules/designer/factory/tObjectFactory.js');

angular.module('ouihome', ['vlocity']);
require('./modules/ouihome/factory/BackcompatExport.js');

},{"./dependencies/angular-drag-and-drop-lists.js":2,"./dependencies/native.history.js":3,"./modules/designer/component/DataSourceProperty.js":5,"./modules/designer/component/DataraptorSelect.js":6,"./modules/designer/component/common/index.js":20,"./modules/designer/component/ips/IntegrationProcedurePropertySet.js":21,"./modules/designer/component/ips/action/index.js":40,"./modules/designer/component/ips/group/index.js":45,"./modules/designer/config/config.js":46,"./modules/designer/config/run.js":47,"./modules/designer/controller/ElementPalette.js":48,"./modules/designer/controller/OmniScriptDesigner.js":49,"./modules/designer/controller/PropertiesController.js":50,"./modules/designer/controller/ScriptFormController.js":51,"./modules/designer/controller/StructureCanvas.js":52,"./modules/designer/controller/intProcedureTabbedController.js":53,"./modules/designer/directive/NumberInputNullValueFix.js":54,"./modules/designer/directive/PaletteGroup.js":55,"./modules/designer/directive/PreventDeleteBack.js":56,"./modules/designer/directive/ViaAffix.js":57,"./modules/designer/directive/intProcedurePreviewPanel.js":58,"./modules/designer/directive/logging.js":59,"./modules/designer/directive/ngOrderObjectBy.js":60,"./modules/designer/directive/showHideRule.js":61,"./modules/designer/directive/treeView.js":62,"./modules/designer/directive/vlc-bubble-canceller.js":63,"./modules/designer/directive/vlc-draggable.js":64,"./modules/designer/directive/vlc-expand-collapse.js":65,"./modules/designer/directive/vlcClipboard.js":66,"./modules/designer/directive/vlcCollapsible.js":67,"./modules/designer/factory/Delete.js":68,"./modules/designer/factory/InterTabMsgBus.js":69,"./modules/designer/factory/propCompUtil.js":70,"./modules/designer/factory/tObjectFactory.js":71,"./modules/designer/filter/ActiveElementTitle.js":72,"./modules/designer/filter/ClassName.js":73,"./modules/designer/filter/ControlType.js":74,"./modules/designer/filter/ElementLabel.js":75,"./modules/designer/filter/FixMissingProperties.js":76,"./modules/designer/filter/GetTypeForElement.js":77,"./modules/designer/filter/ReadablePropertyName.js":78,"./modules/designer/oui_tinymce_plugins/doc_insert.js":79,"./modules/designer/oui_tinymce_plugins/smart_link.js":80,"./modules/designer/services/customLabelService.js":81,"./modules/designer/services/customViewModalService.js":82,"./modules/designer/services/dataraptorBundleService.js":83,"./modules/designer/services/propertyEditorModalService.js":84,"./modules/designer/services/sObjectService.js":85,"./modules/designer/services/tinyMCEImageInsert.js":86,"./modules/designer/services/vlocityUiTemplatesService.js":87,"./modules/designer/templates/templates.js":88,"./modules/oui/Oui.js":89,"./modules/ouihome/factory/BackcompatExport.js":98,"./polyfills/Array.find.js":99,"./polyfills/Array.findIndex.js":100,"./polyfills/Array.from.js":101,"./sharedObjectService.js":102}],2:[function(require,module,exports){
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
/* globals VOUINS */
window.VOUINS = window.VOUINS || {};

// v102 multi-lang support
VOUINS.ootbLabelMap = {
    'Step': ['previousLabel', 'nextLabel', 'cancelLabel', 'saveLabel', 'completeLabel',
        'cancelMessage', 'saveMessage', 'completeMessage', 'instructionKey', 'chartLabel', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Text Block': ['textKey'],
    'Headline': ['labelKey'],
    'Submit': ['summaryLabel', 'submitLabel', 'reviseLabel','errorMessage:custom|n:message', 'errorMessage:default'],
    'DataRaptor Extract Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'redirectNextLabel', 'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 
        'postMessage', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Remote Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel',
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Rest Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel',
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'DataRaptor Post Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'redirectNextLabel', 'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 
        'postMessage', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Post to Object Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel',
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Done Action': ['consoleTabLabel', 'errorMessage:custom|n:message', 'errorMessage:default'],
    'Review Action': ['nextLabel', 'previousLabel', 'errorMessage:custom|n:message', 'errorMessage:default'],
    'Filter Block': ['buttonLabel'],
    'Calculation Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel',
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'PDF Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel','redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'DocuSign Envelope Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'DocuSign Signature Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'inProgressMessage', 'failureAbortMessage', 'postMessage', 'errorMessage:custom|n:message', 
        'errorMessage:default'
    ],
    'Type Ahead': ['newItemLabel'],
    'Email Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel','redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'DataRaptor Transform Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'redirectNextLabel', 'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 
        'postMessage', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Matrix Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Integration Procedure Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'redirectNextLabel', 'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 
        'postMessage', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Edit Block': ['newLabel', 'editLabel', 'deleteLabel'],
    'Delete Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'remoteConfirmMsg', 'cancelLabel', 'subLabel'
    ],
    'Validation': ['messages|n:text'],
    'Checkbox': ['checkLabel'],
    'Email': ['ptrnErrText'],
    'Number': ['ptrnErrText'],
    'Password': ['ptrnErrText'],
    'Telephone':['ptrnErrText'],
    'Text': ['ptrnErrText'],
    'Text Area': ['ptrnErrText'],
    'URL':['ptrnErrText'],
    'Disclosure': ['checkLabel','textKey'],
    'Script': ['persistentComponent|n:label', 'consoleTabLabel','errorMessage:custom|n:message'],
    'Radio': ['options|n:value'],
    'Select': ['options|n:value'],
    'Multi-select': ['options|n:value'],
    'Radio Group' : ['options|n:value', 'radioLabels|n:value'],
    'File' : ['errorMessage:custom|n:message', 'errorMessage:default'],
    'Image' : ['errorMessage:custom|n:message', 'errorMessage:default'],
    'Lookup' : ['errorMessage:custom|n:message', 'errorMessage:default']
};

VOUINS.ootbLabelMap2 = ['subLabel','remoteConfirmMsg','cancelLabel'];
VOUINS.actionEleTypesBase = ['Remote Action', 'Rest Action', 'DataRaptor Extract Action', 'DataRaptor Post Action', 'Post to Object Action', 'Review Action', 'Done Action', 'Calculation Action', 'PDF Action', 'Set Values', 'Set Errors', 'DocuSign Envelope Action', 'DocuSign Signature Action', 'Email Action', 'DataRaptor Transform Action', 'Matrix Action', 'Integration Procedure Action'];
VOUINS.actionEleTypes = VOUINS.actionEleTypesBase.concat(['Delete Action']);

VOUINS.picklistEleList = ['Select', 'Multi-select', 'Radio'];

VOUINS.getPropToUpdate = function (prop, tokenList) {
    'use strict';
    for (var ind = 0; ind < tokenList.length - 1; ind++) {
        if (tokenList[ind].indexOf('|n') >= 0) {
            tokenList[ind] = tokenList[ind].slice(0, tokenList[ind].length - 2);
        }
        var buildupArray = [];
        if(!prop) return null; //property does not exist in object
        if (Array.isArray(prop)) {
            for (var j = 0; j < prop.length; j++) {
                prop[j] = prop[j][tokenList[ind]];
                if (Array.isArray(prop[j])) {
                    for (var k = 0; k < prop[j].length; k++) {
                        buildupArray.push(prop[j][k]);
                    }
                }
            }
        } else {
            if(prop) {
                prop = prop[tokenList[ind]];
            }
            if (Array.isArray(prop)) {
                for (var l = 0; l < prop.length; l++) {
                    buildupArray.push(prop[l]);
                }
            }
        }
        if (buildupArray.length > 0) {
            prop = buildupArray;
        }
    }
    return prop;
};

/*

Input
    prop : any object
    tokenstr : path syntax used such as :   abc|n:efg
               where abc is a key of the prop object, 
               abc's key is associated with a value of type array (hence the |n)
               n is a digit >= 0
               efg is a property of the object contained inside the array

Output
    pathList : an array of object paths that match the pathStr
*/
VOUINS.createPropPaths = function (prop, pathStr) {
    'use strict';
    var path = "";
    var pathList = [];

    if(typeof pathStr !== "string") return pathList;

    // swap n with regex \d to match digits
    pathStr = pathStr.replace(/[|]n/g,'|\\d');
    // escape the pipe to prevent false positive matches
    pathStr = pathStr.replace(/[|]/g,'\[\|\]');
    var pathStrRegex = new RegExp('^' + pathStr + '$');

    var flatten = function(prop, path) {
        if(!prop)
            return path;

        var keys = Object.keys(prop);
        for(var i = 0; i < keys.length; i++) {
            if(typeof prop[keys[i]] === "object") {
                var symbol = Array.isArray(prop[keys[i]]) ? "|" : ":";
                flatten(prop[keys[i]], path + keys[i] + symbol);
            }
            else {
                var pathFlat = path + keys[i];
                if(pathStrRegex.test(pathFlat)) {
                    pathList.push(pathFlat);
                }
            }
        }

    }

    flatten(prop, path);

    return pathList;
}

},{}],5:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('datasourceProperty', {
            templateUrl: 'propertysets/datasource.tpl.html',
            controller: DataSourcePropertyController,
            controllerAs: 'vm',
            bindings: {
                datasource: '<',
                scriptElement: '<'
            }
        });

    DataSourcePropertyController.$inject = ['remoteActions','sObjectService','propCompUtil'];
    function DataSourcePropertyController(remoteActions, sObjectService, propCompUtil) {
        var vm = this;
        propCompUtil.baseConstructor.apply(vm);

        vm.$onInit = function() {
            loadFieldsForExistingData();
        };

        function loadFieldsForExistingData() {
            if (vm.datasource && vm.datasource.mapItems && vm.datasource.mapItems.phase1MapItems) {
                if (vm.sobjectTypes) {
                    vm.datasource.mapItems.phase1MapItems.forEach(function(object) {
                        vm.loadFieldsFor(object.InterfaceObjectName__c);
                    });
                }
            }
        }

        vm.filterOptions = [
            '=', '<', '>', '<=', '>=',
            'LIKE', 'NOT LIKE', '<>', 'INCLUDES', 'EXCLUDES'
        ];
        vm.allFieldsForObjects = {};

        sObjectService.getSObjects().then(function (allObjects) {
            vm.sobjectTypes = allObjects;
            loadFieldsForExistingData();
            if (vm.sobjectTypes.length > 0) {
                vm.loadFieldsFor(vm.sobjectTypes[0].name);
            }
        });

        vm.loadFieldsFor = function (object) {
            remoteActions.getFieldsForObject(object).then(function (fields) {
                vm.allFieldsForObjects[object] = fields;
            });
        };

        vm.addNewInputParameter = function(inputParamArray) {
            inputParamArray.push({
                'inputParam': '',
                'element': ''
            });
        };

        vm.getAllFieldsForObjects = function (obj) {
            if (vm.allFieldsForObjects[obj]) {
                return Object.keys(vm.allFieldsForObjects[obj]);
            }
            return [];
        };

        vm.deleteInputParameter = function (inputParam, inputParamArray) {
            inputParamArray.splice(inputParamArray.indexOf(inputParam), 1);
        };

        vm.addNewMapping = function (mappingArray) {
            mappingArray.push({
                'InterfaceObjectLookupOrder__c': 1,
                'InterfaceObjectName__c': '',
                'DomainObjectFieldAPIName__c': '',
                'FilterValue__c': '',
                'InterfaceFieldAPIName__c': '',
                'FilterOperator__c': '='
            });
        };

        vm.deleteMapping = function (mapping, mappingArray) {
            mappingArray.splice(mappingArray.indexOf(mapping), 1);
            if (mappingArray.length === 0) {
                vm.addNewMapping(mappingArray);
            }
        };
    }
})();

},{}],6:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('dataraptorSelect', {
            templateUrl: 'propertysets/dataraptorselect.tpl.html',
            controller: DataraptorSelectPropertyController,
            require: {
                ngModel: "ngModel"
            },
            controllerAs: 'vm',
            bindings: {
                scriptElement: '<',
                ngDisabled: '<',
                type: '@',
                inputType: '@',
                outputType: '@',
                includeInputJson: '@',
                idPrefix: '@',
                mode: '@'
            }
        });

    DataraptorSelectPropertyController.$inject = ['dataraptorBundleService', '$q', 'remoteActions', '$dataraptor'];

    function DataraptorSelectPropertyController(dataraptorBundleService, $q, remoteActions, $dataraptor) {
        var vm = this;

        vm.$onInit = function () {
            var ngModel = vm.ngModel;
            ngModel.$viewChangeListeners.push(onChange);
            ngModel.$render = onChange;
        };

        vm.$onChanges = function (changes) {
            vm.modelValue = vm.ngModel.$modelValue;
        }

        function onChange() {
            vm.modelValue = vm.ngModel.$modelValue;
        }

        vm.updateParentModel = function () {
            if (vm.modelValue !== '+ Create New DataRaptor') {
                vm.ngModel.$setViewValue(vm.modelValue);
                return;
            }

            createNewDataRaptor(vm.ngModel.$modelValue);
        };

        vm.openDR = function ($event) {
            vm.loading = true;
            getMatchingDRBundles(vm.modelValue, vm.type)
                .then(function (bundles) {
                    var bundle = bundles.find(function (bundle) {
                        return bundle.Name === vm.modelValue;
                    });
                    if (!bundle) {
                        alert('Dataraptor named "' + vm.modelValue + '" does not exist in this org.');
                        vm.loading = false;
                        return;
                    }
                    var id = bundle;
                    doWindowOpen('/apex/' + window.ns + 'DRMapper?id=' + bundle.Id, $event);
                    vm.loading = false;
                })
                .catch(function (error) {
                    vm.loading = false;
                });
        }

        function doWindowOpen(url, $event) {
            window.vlocityOpenUrl(url, $event, true);
        }

        vm.handleBlur = function (value) {
            if (vm.drBundles) {
                var match;
                vm.drBundles.forEach(function (item) {
                    if (item.Name === value) {
                        match = item;
                    }
                });
                if (match) {
                    vm.ngModel.$setViewValue(value);
                } else {
                    vm.ngModel.$setViewValue(null);
                }
            }
        }

        vm.getBundles = function (value) {
            vm.loading = true;
            return getMatchingDRBundles(value, vm.type)
                .then(function (results) {
                    vm.loading = false;
                    vm.drBundles = results;
                    if (vm.drBundles)
                    return results.concat({
                        Name: '+ Create New DataRaptor',
                        Id: '+ Create New DataRaptor'
                    });
                })
                .catch(function (error) {
                    vm.loading = false;
                    throw error;
                });
        };

        function getMatchingDRBundles(value, type) {
            var requiredTypes = type ? [type] : [];
            if (type === 'Extract') {
                requiredTypes.push('Extract (JSON)');
            } else if (type === 'Turbo Extract') {
                requiredTypes.push('Turbo Extract');
            } else if (type === 'Load') {
                requiredTypes.push('Load (JSON)');
            }

            return dataraptorBundleService.getMatchingDRBundles(value, requiredTypes);
        }

        function createNewDataRaptor(originalValue) {
            var newName = prompt('Please enter a new name for the DataRaptor interface', '');
            if (newName === '' && !isSafari()) {
                alert('Please enter a Name');
                createNewDataRaptor(originalValue);
            } else if (!/^[a-zA-Z0-9\s-_]+$/.test(newName) && newName && newName.length > 0) {
                alert('This interface name can only contain letters, numbers and spaces. Please choose a different name.');
                createNewDataRaptor(originalValue);
                return;
            } else if (newName !== null && !(newName === '' && isSafari())) {
                vm.loading = true;
                // ensure drbundle doesn't exist
                getMatchingDRBundles(newName, null)
                    .then(function (bundles) {
                        var found = false;
                        bundles.forEach(function (bundle) {
                            found = (found || bundle.Name == newName);
                            if (found) {
                                return false;
                            }
                        });
                        if (found) {
                            alert('This name is already in use. Please enter a different name');
                            createNewDataRaptor(originalValue);
                            vm.loading = false;
                            return;
                        }
                        var prePromise = $q.when(null);
                        if (vm.includeInputJson) {
                            prePromise = remoteActions.viewFullDataJson(vm.scriptElement.Id)
                                .then(function (omniScriptResult) {
                                    return omniScriptResult.replace(/&quot;/g, '"');
                                });
                        }

                        prePromise.then(function (json) {
                            return $dataraptor.createNewBundle({
                                'Name': newName,
                                'DRMapName__c': newName,
                                'Type__c': vm.type,
                                'InterfaceObject__c': 'json',
                                'InputJson__c': json,
                                'InputType__c': vm.inputType || 'JSON',
                                'OutputType__c': vm.outputType || 'JSON'
                            });
                        }).then(function (bundle) {
                            vm.ngModel.$setViewValue(newName);
                            vm.modelValue = newName;
                            vm.openDR(null);
                            vm.loading = false;
                            return bundle;
                        })
                        .catch(function (error) {
                            vm.loading = false;
                        })
                    });
            } else {
                vm.ngModel.$setViewValue(originalValue);
                vm.modelValue = originalValue;
            }
        }

    }
})();

},{}],7:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('arrayListProp', {
            templateUrl: 'propertysets/common/array-list.tpl.html',
            controller: ArrayListController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                label: '@',
                addBtnLabel: '@',
                ngDisabled: '=',
                ngModel: '<'
            }
        });

    ArrayListController.$inject = [];

    function ArrayListController() {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!vm.addBtnLabel) {
                vm.addBtnLabel = 'Add New Value';
            }
        }

        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        };

        vm.add = function () {
            vm.ngModel.push(null);
        }

        vm.remove = function (index) {
            vm.ngModel.splice(index, 1);
        }
    }
})();

},{}],8:[function(require,module,exports){
(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('checkboxProp', {
            templateUrl: 'propertysets/common/checkbox.tpl.html',
            controller: CheckboxController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                label: '@',
                helpText: '@',
                ngDisabled: '=',
                ngModel: '<'
            }
        });

    CheckboxController.$inject = [];
    function CheckboxController() {
        var vm = this;
        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        };
    }
})();

},{}],9:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('elementNameProp', {
            templateUrl: 'propertysets/common/element-name.tpl.html',
            controller: ElementNameController,
            controllerAs: 'vm',
            require: {
                form: '^form',
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                ngDisabled: '=',
                ngModel: '<'
            }
        });

    ElementNameController.$inject = [];
    function ElementNameController() {
        var vm = this;
        vm.isValidHTMLId = true;

        var validHtmlIdRegex = /^[A-Za-z]+[\/\w\ \-\:\.]*$/;

        vm.$onInit = function () {
            isValid();
        }

        vm.$onChanges = function (changes) {
            isValid();
        }
        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
            isValid();
        };

        function isValid() {
            vm.isValidHTMLId = validHtmlIdRegex.test(vm.ngModel)
        }
    }
})();

},{}],10:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('errormessageHandler', {
            templateUrl: 'propertysets/common/errormessage-handler.tpl.html',
            controller: ErrorMessageHandlerController,
            controllerAs: 'vm',
            bindings: {
                ngModel: '<',
                ngDisabled: '='
            }
        });

    ErrorMessageHandlerController.$inject = [];

    function ErrorMessageHandlerController() {
        var vm = this;

        vm.$onInit = function () {
            vm.errorMessages = vm.ngModel;
        }

        vm.$onChanges = function (changes) {
            if (changes.ngModel) {
                vm.errorMessages = vm.ngModel;
            }
        }

        vm.addNewErrorMessage = function () {
            vm.errorMessages.custom.push({
                path: '',
                value: '',
                message: ''
            });
        };

        vm.deleteErrorMessage = function (option) {
            vm.errorMessages.custom.splice(vm.errorMessages.custom.indexOf(option), 1);
        };
    }
})();

},{}],11:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('groupProp', {
            templateUrl: 'propertysets/common/group.tpl.html',
            controller: GroupController,
            controllerAs: 'vm',
            transclude: true,
            bindings: {
                label: '@',
                helpText: '@',
                isOpen: '@'
            }
        });

    GroupController.$inject = [];

    function GroupController() {
        var vm = this;
        vm.isOpen = false;
    }
})();

},{}],12:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('htmlTemplateIdProp', {
            templateUrl: 'propertysets/common/html-template-id.tpl.html',
            controller: HtmlTemplateIdController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                ngDisabled: '=',
                ngModel: '<',
                scriptElement: '<',
                hideLabel: '<'
            }
        });

    HtmlTemplateIdController.$inject = ['$window', 'vlocityUiTemplateService'];
    function HtmlTemplateIdController($window, vlocityUiTemplateService) {
        var vm = this;
        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        };

        vm.templateList = [];
        vm.templateMap = {};

        vm.getTemplates =  vlocityUiTemplateService.getGeneralTemplates;

        vm.openTemplate = function openTemplate($event, templateId) {
            $window.vlocityOpenUrl('/apex/' + $window.ns + 'UITemplateDesigner?name=' + templateId, $event, true);
        };

        vm.refreshTemplates = function(){
            vm.getTemplates().then(function(result){
                vm.templateMap = result;
                vm.templateList = vm.objectToKeyValueArray(result);
            });
        };

        vm.objectToKeyValueArray = function objectToKeyValueArray(map) {
            return Object.keys(map).filter(function (key) {
                if (!vm.ignoreKeys) {
                    return true;
                }
                return vm.ignoreKeys.indexOf(key) === -1;
            }).map(function (key) {
                return {
                    key: key,
                    value: map[key],
                    type: (typeof getType==="function"&&vm.getType(map[key]))||undefined
                };
            });
        };
        
        vm.refreshTemplates();
    }
})();

},{}],13:[function(require,module,exports){
(function () {
    'use strict';

    const properties = {
        templateUrl: 'propertysets/common/key-value.tpl.html',
        controller: KeyValueController,
        controllerAs: 'vm',
        require: {
            ngModelCtrl: 'ngModel'
        },
        transclude: true,
        bindings: {
            ngDisabled: '=',
            ngModel: '<',
            label: '@',
            helpText: '@',
            keyLabel: '@',
            valueLabel: '@',
            addBtnLabel: '@',
            idPrefix: '@',
            ignoreKeys: '<',
            scriptElement: '<',
            renderTemplateCell: '<',
            renderExpressionCell: '<'
        }
    };

    angular
        .module('omniscriptDesigner')
        .component('keyValueProp', properties);

    // This keyValuePropSmall is used on the LWC preview and has a different sizing of columns
    angular
        .module('omniscriptDesigner')
        .component('keyValueSmallProp', {
            ...properties,
            templateUrl: 'propertysets/common/key-value-small.tpl.html',
        });

    KeyValueController.$inject = ['$modal'];

    function KeyValueController($modal) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!vm.ngModel) {
                vm.ngModel = {};
            }
            const newMap = vm.objectToKeyValueArray(vm.ngModel);
            if (!_.isEqual(newMap, vm.map)) {
                vm.map = newMap;
            }
            if (!vm.addBtnLabel) {
                vm.addBtnLabel = 'Add Key/Value Pair';
            }
        };

        vm.objectToKeyValueArray = function objectToKeyValueArray(map) {
            return Object.keys(map).filter(function (key) {
                if (!vm.ignoreKeys) {
                    return true;
                }

                return vm.ignoreKeys.indexOf(key) === -1;
            }).map(function (key) {
                return {
                    key: key,
                    value: map[key],
                    type: (typeof vm.getType === "function" && vm.getType(map[key])) || undefined
                };
            });
        }

        vm.getType = function (value) {
            if (vm.ngModel == null) {
                vm.type = 'text';
                return;
            }
            switch (typeof value) {
                case 'object':
                    if (Array.isArray(value)) {
                        return 'array';
                    }
                    return 'object';
                default:
                    return 'text';
            }
        };

        vm.addNewKeyValue = function () {
            vm.map.push({
                key: '',
                value: ''
            });
            vm.updateKeyValueProperty();
        };

        vm.deleteKeyValue = function (option) {
            vm.map.splice(vm.map.indexOf(option), 1);
            vm.updateKeyValueProperty();
        };

        vm.updateKeyValueProperty = function () {
            const baseObj = {};
            if (vm.ignoreKeys) {
                vm.ignoreKeys.forEach(function (key) {
                    baseObj[key] = vm.ngModel[key];
                });
            }
            const newValue = vm.map.reduce(function (obj, prop) {
                var value = prop.value;
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    // try convert to a more appropriate type if possible.
                }
                obj[prop.key] = value;

                return obj;
            }, baseObj);
            vm.ngModel = newValue;
            vm.ngModelCtrl.$setViewValue(newValue);
        };

        vm.editAsExpression = function (property, expressionOnly) {
            var input = {};
            input.currentVal = property.value;
            if (typeof input.currentVal == "undefined") {
                input.currentVal = "";
            }
            input.elementNames = function () {
                return vm.elementNamesAsObject();
            };

            // delete leading '=' token
            if (!expressionOnly) {
                input.currentVal = String(property.value).replace(/(?:^\s*=)|(?:\s*$)/g, '');
            }
            $modal({
                title: 'Expression Editor',
                templateUrl: 'modal-edit-expression.tpl.html',
                backdrop: 'static',
                controller: function ($scope) {
                    $scope.obj = input;

                    $scope.obj.newVal = $scope.obj.currentVal;

                    $scope.cancel = function () {
                        $scope.$hide();
                    };

                    $scope.submit = function () {
                        if ($scope.obj.newVal || $scope.obj.newVal == 'false') {
                            property.value = '=' + $scope.obj.newVal;
                            vm.updateKeyValueProperty();
                        }
                        $scope.cancel();
                    };
                }
            });
        };
    }
})();

},{}],14:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('lwcOverrideProp', {
            templateUrl: 'propertysets/common/lwc-override.tpl.html',
            controller: LwcOverrideController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            transclude: true,
            bindings: {
                ngDisabled: '=',
                ngModel: '<',
                label: '@',
                helpText: '@',
                keyLabel: '@',
                valueLabel: '@',
                addBtnLabel: '@',
                idPrefix: '@',
                scriptElement: '<',
                options: '<'
            }
        });

    LwcOverrideController.$inject = ['lwcService', '$scope'];

    function LwcOverrideController(lwcService, $scope) {
        var vm = this;
        let timeout = undefined;

        lwcService.getLwcList().then(lwcs => {
            // Clone so we don't mess the list
            const values = [''].concat(lwcs);
            $scope.$apply(() => {
                vm.lwcList = values;
            });
        });

        vm.$onChanges = function () {
            if (!vm.ngModel) {
                vm.ngModel = {};
            }
            const newMap = vm.objectToKeyValueArray(vm.ngModel);
            if (!_.isEqual(newMap, vm.map)) {
                vm.map = newMap;
            }
            if (!vm.addBtnLabel) {
                vm.addBtnLabel = 'Add Key/Value Pair';
            }
        };

        vm.objectToKeyValueArray = function objectToKeyValueArray(map) {
            return Object.keys(map).map(function (key) {
                return {
                    key: key,
                    value: map[key]
                };
            });
        }

        vm.addNewKeyValue = function () {
            vm.map.push({
                key: '',
                value: ''
            });
            vm.updateKeyValueProperty();
        };

        vm.deleteKeyValue = function (option) {
            vm.map.splice(vm.map.indexOf(option), 1);
            vm.updateKeyValueProperty();
        };

        vm.updateKeyValueProperty = function () {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                const baseObj = {};
                const newValue = vm.map.reduce(function (obj, prop) {
                    var value = prop.value;
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        // try convert to a more appropriate type if possible.
                    }
                    obj[prop.key] = value;

                    return obj;
                }, baseObj);
                vm.ngModel = newValue;
                vm.ngModelCtrl.$setViewValue(newValue);
            }, 500);
        };
    }
})();

},{}],15:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('lwcSelectionProp', {
            templateUrl: 'propertysets/common/lwc-selection.tpl.html',
            controller: LwcSelectionController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                ngDisabled: '=',
                ngModel: '<',
                scriptElement: '<'
            }
        });

    LwcSelectionController.$inject = ['lwcService', '$scope'];
    function LwcSelectionController(lwcService, $scope) {
        var vm = this;

        lwcService.getLwcList().then(lwcs => {
            // Clone so we don't mess the list
            const values = [''].concat(lwcs);
            $scope.$apply(() => {
                vm.lwcList = values;
            })
        });

        vm.updateModel = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        }
    }
})();

},{}],16:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('monacoEditorProp', {
            templateUrl: 'propertysets/common/monaco-editor-prop.tpl.html',
            controller: MonacoEditorController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                label: '@',
                ngDisabled: '=',
                ngModel: '<'
            }
        });

    MonacoEditorController.$inject = [];

    function MonacoEditorController() {
        var vm = this;

        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        };
    }
})();

},{}],17:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('patternProp', {
            templateUrl: 'propertysets/common/pattern.tpl.html',
            controller: PatternPropController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                label: '@',
                helpText: '@',
                ngDisabled: '=',
                ngModel: '=',
                lwcEnabled: '<',
                documentation: '@'
            }
        });

    PatternPropController.$inject = [];
    function PatternPropController() {
        this.$onInit = onInit;

        function onInit() {
            this.ngModelCtrl.$validators['Invalid Pattern'] = validatePattern.bind(this);
        }

        function validatePattern(modelValue) {
            let isValid = true;

            try {
                new RegExp(modelValue, 'u');
            } catch(err) {
                if (this.lwcEnabled)
                    isValid = false;
            }

            return isValid;
        }
    }
})();

},{}],18:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('showPersistentComponentProp', {
            templateUrl: 'propertysets/common/show-persistent-component.tpl.html',
            controller: ShowPersistentComponentController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                persistentComponent: '<',
                ngDisabled: '=',
                ngModel: '<'
            }
        });

    ShowPersistentComponentController.$inject = [];
    function ShowPersistentComponentController() {
        var vm = this;

        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        }

    }
})();

},{}],19:[function(require,module,exports){
(function () {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('omniscriptDesigner')
        .component('textProp', {
            templateUrl: 'propertysets/common/text.tpl.html',
            controller: TextController,
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                label: '@',
                helpText: '@',
                placeholder: '@',
                ngDisabled: '=',
                ngModel: '<',
                documentation: '@'
            }
        });

    TextController.$inject = [];

    function TextController() {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (vm.ngModel == null) {
                vm.type = 'text';
                return;
            }
            switch (typeof vm.ngModel) {
                case 'object':
                    if (Array.isArray(vm.ngModel)) {
                        vm.type = 'array';
                        break;
                    }
                    vm.type = 'object';
                    break;
                default:
                    vm.type = 'text';
            }
        };

        vm.ngModelChange = () => {
            vm.ngModelCtrl.$setViewValue(vm.ngModel);
        };
    }
})();

},{}],20:[function(require,module,exports){
require('./ArrayListProp.js');
require('./CheckboxProp.js');
require('./TextProp.js');
require('./PatternProp.js');
require('./ElementNameProp.js');
require('./GroupProp.js');
require('./HtmlTemplateIdProp.js');
require('./KeyValueProp.js');
require('./LwcOverrideProp.js');
require('./LwcSelectionProp.js');
require('./ShowPersistentComponentProp.js');
require('./MonacoEditorProp.js');
require('./ErrorMessageHandlerProp.js');
},{"./ArrayListProp.js":7,"./CheckboxProp.js":8,"./ElementNameProp.js":9,"./ErrorMessageHandlerProp.js":10,"./GroupProp.js":11,"./HtmlTemplateIdProp.js":12,"./KeyValueProp.js":13,"./LwcOverrideProp.js":14,"./LwcSelectionProp.js":15,"./MonacoEditorProp.js":16,"./PatternProp.js":17,"./ShowPersistentComponentProp.js":18,"./TextProp.js":19}],21:[function(require,module,exports){
var htmlEncodeDecode = require('../../../oui/util/HtmlEncodeDecode.js');

(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('integrationProcedurePropertySet', {
            templateUrl: 'propertysets/ips/integration-procedure.tpl.html',
            controller: IntegrationProcedurePropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "linkToExternalObject": "",
        "trackingCustomData": {},
        "includeAllActionsInResponse": false,
        "columnsPropertyMap": [],
        "relationshipFieldsMap": [],
        "labelSingular": "",
        "labelPlural": "",
        "description": "",
        "nameColumn": "",
        "rollbackOnError": false,
        "chainableQueriesLimit": 50,
        "chainableDMLStatementsLimit": null,
        "chainableCpuLimit": 2000,
        "chainableHeapSizeLimit": null,
        "chainableDMLRowsLimit": null,
        "chainableQueryRowsLimit": null,
        "chainableSoslQueriesLimit": null,
        "chainableActualTimeLimit": null,
        "additionalChainableResponse": {},
        "queueableChainableQueriesLimit": 120,
        "queueableChainableCpuLimit": 40000,
        "queueableChainableHeapSizeLimit": 6,
        "ttlMinutes": 5
    };

    IntegrationProcedurePropertySetController.$inject = ['propCompUtil', 'remoteActions', 'ScriptElementTypes', 'AvailableScriptTypesInit', 'sObjectService'];

    function IntegrationProcedurePropertySetController(propCompUtil, remoteActions, ScriptElementTypes, AvailableScriptTypesInit, sObjectService) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.types = [];
        vm.subtypes = [];
        vm.cacheTypes = ['', 'Session Cache', 'Org Cache'];
        vm.columnPropertyTypes = ['Boolean', 'Date/Time', 'Text', 'Number', 'Long text area', 'URL'];
        vm.relationshipTypes = ['External lookup relationship', 'Indirect lookup relationship',
            'Lookup relationship'
        ];

        sObjectService.getSObjects().then(function (allObjects) {
            vm.sobjectTypes = allObjects;
        });

        remoteActions.getExternalObjects().then(function (externalObjects) {
            vm.externalObjectTypes = externalObjects.sort(function (a, b) {
                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            });
        });

        addTypes(ScriptElementTypes, vm.types);
        // Load from Existing Scripts
        addTypes(AvailableScriptTypesInit, vm.types);

        function addTypes(types, target) {
            delete types['null'];
            delete types[''];
            var i = -1;
            Object.keys(types).forEach(function (property) {
                i = target.findIndex(equalsLabel, property);
                if (i == -1) {
                    i = target.length;
                    target[i] = {
                        label: htmlEncodeDecode.unescapeHTML(property),
                        value: htmlEncodeDecode.unescapeHTML(property),
                        $$subTypes: []
                    };
                }
                for (var y = 0; y < types[property].length; y++) {
                    types[property][y] = htmlEncodeDecode.unescapeHTML(types[property][y]);
                    if (target[i].$$subTypes.findIndex(equalsLabel, types[property][y]) === -1, types[property][y]) {
                        target[i].$$subTypes.push({
                            label: types[property][y],
                            value: types[property][y]
                        });
                    }
                }
                target[i].$$subTypes.sort(compareLabels);
            });
            target.sort(compareLabels);
        }

        function equalsLabel(a) {
            var label = typeof a == "string" ? a : a.label;
            return this && label == this || (typeof label == 'string' && typeof this == 'string' && label.trim() == this.trim());
        }

        function compareLabels(a, b) {
            return String(a.label).localeCompare(b.value);
        }

        vm.$onInit = function () {
            vm.element.PropertySet__c = Object.assign({}, _.cloneDeep(DEFAULT_PROP_SET), vm.element.PropertySet__c);
        };

        vm.handleTypeChange = function () {
            var matchingType = vm.types.find(function (type) {
                return type.value === vm.element.Type__c;
            });
            vm.subtypes = matchingType ? matchingType.$$subTypes : [];
            vm.element.SubType__c = null;
        };

        vm.openExternalObjects = function ($event) {
            window.vlocityOpenUrl('/p/setup/custent/ExternalObjectsPage', $event, true);
        };

        vm.addColumnsPropertyMap = function () {
            if (!vm.element.PropertySet__c.columnsPropertyMap) {
                vm.element.PropertySet__c.columnsPropertyMap = [];
            }
            vm.element.PropertySet__c.columnsPropertyMap.push({
                name: '',
                label: '',
                description: '',
                sortable: true,
                filterable: true,
                type: '',
                length: 255,
                decimalPlaces: 0
            });
        };

        vm.deleteColumnsPropertyMap = function (index) {
            vm.element.PropertySet__c.columnsPropertyMap.splice(index, 1);
        };

        vm.addRelationshipFieldsMap = function () {
            if (!vm.element.PropertySet__c.relationshipFieldsMap) {
                vm.element.PropertySet__c.relationshipFieldsMap = [];
            }
            vm.element.PropertySet__c.relationshipFieldsMap.push({
                name: '',
                label: '',
                description: '',
                sortable: true,
                filterable: true,
                type: '',
                length: 255,
                referenceTo: '',
                referenceTargetField: ''
            });
        };

        vm.deleteRelationshipFieldsMap = function (index) {
            vm.element.PropertySet__c.relationshipFieldsMap.splice(index, 1);
        };
    }
})();

},{"../../../oui/util/HtmlEncodeDecode.js":92}],22:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('batchActionPropertySet', {
            templateUrl: 'propertysets/ips/action/batch-action.tpl.html',
            controller: BatchActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "scheduledJobId": "",
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "chainOnStep": false,
        "actionMessage": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalInput": {},
        "additionalOutput": {},
        "failureResponse": {},
        "sendOnlyAdditionalInput": false,
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "batchOptions": {},
        "chainable": false,
        "listInput":""
    };

    BatchActionPropertySetController.$inject = ['propCompUtil', '$modal', 'remoteActions'];

    function BatchActionPropertySetController(propCompUtil, $modal, remoteActions) {
        var vm = this;
        vm.nsPrefix = fileNsPrefix();

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        remoteActions.GetScheduledJobs().then(function (scheduledJobs) {
            vm.scheduledJobs = scheduledJobs;
        });

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],23:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('calculationActionPropertySet', {
            templateUrl: 'propertysets/ips/action/calculation-action.tpl.html',
            controller: CalculationActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalInput": {},
        "additionalOutput": {},
        "failureResponse": {},
        "sendOnlyAdditionalInput": false,
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "remoteClass": fileNsPrefixDot() + "PricingMatrixCalculationService",
        "remoteMethod": "calculate",
        "remoteOptions": {
            "configurationName": ""
        },
        "chainOnStep": false,
        "actionMessage": ""
    };

    CalculationActionPropertySetController.$inject = ['propCompUtil'];
    function CalculationActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],24:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('chatterActionPropertySet', {
            templateUrl: 'propertysets/ips/action/chatter-action.tpl.html',
            controller: ChatterActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "communityId": "",
        "subjectId": "",
        "mentionedUserId":"",
        "imageId":"",
        "markupType":"",
        "fileId":"",
        "text": "",
        "responseJSONPath":"",
        "responseJSONNode": "",
        "useFormulas": true,
        "returnOnlyAdditionalOutput": false,
        "additionalOutput": {},
        "returnOnlyFailureResponse": false,
        "failureResponse": {},
        "executionConditionalFormula": "",
        "failOnStepError": true,
        "failureConditionalFormula": "",
        "chainOnStep": false,
        "additionalChainableResponse": {},
        "actionMessage": ""
    };

    ChatterActionPropertySetController.$inject = ['propCompUtil', '$modal', 'remoteActions'];

    function ChatterActionPropertySetController(propCompUtil, $modal, remoteActions) {
        var vm = this;

        vm.markupTypes = ['', 'Bold', 'Italic', 'Underline'];

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],25:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('dataraptorExtractActionPropertySet', {
            templateUrl: 'propertysets/ips/action/dataraptor-extract-action.tpl.html',
            controller: DataraptorExtractActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalInput": {},
        "additionalOutput": {},
        "failureResponse": {},
        "sendOnlyAdditionalInput": false,
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "bundle": "",
        "dataRaptor Input Parameters": [],
        "chainOnStep": false,
        "actionMessage": "",
        "ignoreCache": false
    };

    DataraptorExtractActionPropertySetController.$inject = ['propCompUtil'];
    function DataraptorExtractActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        vm.deleteInputParameter = function (inputParam, inputParamArray) {
            inputParamArray.splice(inputParamArray.indexOf(inputParam), 1);
        };

        vm.addNewInputParameter = function(inputParamArray) {
            inputParamArray.push({
                'inputParam': '',
                'element': ''
            });
        };
    }
})();

},{}],26:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('dataraptorPostActionPropertySet', {
            templateUrl: 'propertysets/ips/action/dataraptor-post-action.tpl.html',
            controller: DataraptorPostActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalInput": {},
        "additionalOutput": {},
        "failureResponse": {},
        "sendOnlyAdditionalInput": false,
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "bundle": "",
        "chainOnStep": false,
        "actionMessage": ""
    };

    DataraptorPostActionPropertySetController.$inject = ['propCompUtil'];
    function DataraptorPostActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],27:[function(require,module,exports){
(function() {
    'use strict';


    angular
        .module('omniscriptDesigner')
        .component('dataraptorTransformActionPropertySet', {
            templateUrl: 'propertysets/ips/action/dataraptor-transform-action.tpl.html',
            controller: DataraptorTransformActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalInput": {},
        "additionalOutput": {},
        "failureResponse": {},
        "sendOnlyAdditionalInput": false,
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "bundle": "",
        "chainOnStep": false,
        "actionMessage": "",
        "ignoreCache": false
    };

    DataraptorTransformActionPropertySetController.$inject = ['propCompUtil'];
    function DataraptorTransformActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],28:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('deleteActionPropertySet', {
            templateUrl: 'propertysets/ips/action/delete-action.tpl.html',
            controller: DeleteActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "deleteSObject": [],
        "responseJSONPath": "",
        "responseJSONNode": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "additionalOutput": {},
        "failureResponse": {},
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "chainOnStep": false,
        "actionMessage": "",
        "allOrNone": false
    };

    DeleteActionPropertySetController.$inject = ['propCompUtil', 'sObjectService'];
    function DeleteActionPropertySetController(propCompUtil, sObjectService) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        sObjectService.getSObjects().then(function (allObjects) {
            vm.sobjectTypes = allObjects;
        });

        vm.addDeleteSObjectMap = function () {
            var obj = {
                Type: '',
                Id: '',
                AllOrNone : false
            };
            if (vm.element.PropertySet__c.deleteSObject) {
                vm.element.PropertySet__c.deleteSObject.push(obj);
            }
        };

        vm.deleteDeleteSObjectMap = function (ind) {
            if (vm.element.PropertySet__c.deleteSObject) {
                vm.element.PropertySet__c.deleteSObject.splice(ind, 1);
            }
        };
    }
})();

},{}],29:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('docusignEnvelopeActionPropertySet', {
            templateUrl: 'propertysets/ips/action/docusign-envelope-action.tpl.html',
            controller: DocusignEnvelopeActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalInput": {},
        "additionalOutput": {},
        "failureResponse": {},
        "sendOnlyAdditionalInput": false,
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "docuSignTemplatesGroup": [],
        "emailSubject": "",
        "emailBody": "",
        "dateFormat": "",
        "dateTimeFormat": "",
        "timeFormat": "",
        "validationRequired": "Step",
        "HTMLTemplateId": "",
        "chainOnStep": false,
        "actionMessage": ""
    };

    DocusignEnvelopeActionPropertySetController.$inject = ['propCompUtil', 'remoteActions', '$q', 'dataraptorBundleService'];

    function DocusignEnvelopeActionPropertySetController(propCompUtil, remoteActions, $q, dataraptorBundleService) {
        var vm = this;
        vm.nsPrefix = fileNsPrefix();
        vm.templateRolesByTemplate = {};

        getDocusignTemplates();

        vm.getBundles = function (value) {
            return dataraptorBundleService.getMatchingDRBundles(value, ["Transform"]);
        }

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));

            if (vm.element.PropertySet__c.docuSignTemplate) {
                const obj = {
                    docuSignTemplate: vm.element.PropertySet__c.docuSignTemplate,
                    transformBundle: vm.element.PropertySet__c.transformBundle,
                    sendJSONPath: vm.element.PropertySet__c.sendJSONPath,
                    sendJSONNode: vm.element.PropertySet__c.sendJSONNode,
                    signerList: vm.element.PropertySet__c.signerList || [],
                    includeToSend: true
                };
                vm.element.PropertySet__c.docuSignTemplatesGroup.push(obj);
                delete vm.element.PropertySet__c.signerList;
                delete vm.element.PropertySet__c.docuSignTemplate;
                delete vm.element.PropertySet__c.transformBundle;
                delete vm.element.PropertySet__c.sendJSONPath;
                delete vm.element.PropertySet__c.sendJSONNode;
            }
        }

        function getDocusignTemplates() {
            if (vm.docuSignTemplates) {
                return $q.when(vm.docuSignTemplates);
            }
            return remoteActions.loadDocuSignTemplates().then(function (docuSignTemplates) {
                vm.docuSignTemplates = docuSignTemplates;
                vm.docuSignTemplates.forEach(function (template) {
                    var roleArray = angular.fromJson(template[vm.nsPrefix + 'RolesData__c']
                        .replace(/&quot;/g, '"'));
                    vm.templateRolesByTemplate[template[vm.nsPrefix + 'TemplateIdentifier__c']] = roleArray;
                })
                return vm.docuSignTemplates;
            });
        }

        vm.addDocuSignTemplate = function () {
            const obj = {
                docuSignTemplate: "",
                transformBundle: "",
                sendJSONPath: "",
                sendJSONNode: "",
                includeToSend: true,
                signerList: []
            };
            vm.element.PropertySet__c.docuSignTemplatesGroup.push(obj);
        }

        vm.onChangeDocusignTemplate = function (index) {
            if (vm.element.PropertySet__c.docuSignTemplatesGroup[index].signerList) {
                vm.element.PropertySet__c.docuSignTemplatesGroup[index].signerList = [];
                delete vm.element.PropertySet__c.docuSignTemplatesGroup[index].templateRoleName;
            }
        };

        vm.deleteDocuSignTemplate = function (index) {
            vm.element.PropertySet__c.docuSignTemplatesGroup.splice(index, 1);
        };

        vm.addDocuSignSigner = function (index) {
            if (!vm.element.PropertySet__c.docuSignTemplatesGroup[index].signerList) {
                vm.element.PropertySet__c.docuSignTemplatesGroup[index].signerList = [];
            }
            vm.element.PropertySet__c.docuSignTemplatesGroup[index].signerList.push({
                signerName: "",
                signerEmail: "",
                templateRole: "",
                routingOrder: ""
            });
        };

        vm.deleteDocuSignSigner = function (index, parentIndex) {
            vm.element.PropertySet__c
                .docuSignTemplatesGroup[parentIndex].signerList.splice(index, 1);
        };

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],30:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('emailActionPropertySet', {
            templateUrl: 'propertysets/ips/action/email-action.tpl.html',
            controller: EmailActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "useTemplate": true,
        "emailTemplateInformation": {
            "emailTemplateName": "",
            "emailTargetObjectId": "",
            "saveAsActivity": false,
            "whatId": ""
        },
        "emailInformation": {
            "toAddressList": [],
            "ccAddressList": [],
            "bccAddressList": [],
            "emailSubject": "",
            "emailBody": "",
            "setHtmlBody": false
        },
        "OrgWideEmailAddress": "",
        "attachmentList": "",
        "contentVersionList": "",
        "staticDocList": [],
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "chainOnStep": false,
        "actionMessage": ""
    };

    EmailActionPropertySetController.$inject = ['propCompUtil', 'remoteActions'];

    function EmailActionPropertySetController(propCompUtil, remoteActions) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        remoteActions.GetEmailTemplates().then(function (emailTemplates) {
            vm.emailTemplates = emailTemplates;
        });

        remoteActions.GetEmailDocuments().then(function (emailDocuments) {
            vm.emailDocuments = emailDocuments;
        });

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],31:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('integrationProcedureActionPropertySet', {
            templateUrl: 'propertysets/ips/action/integration-procedure-action.tpl.html',
            controller: IntegrationProcedureActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalInput": {},
        "additionalOutput": {},
        "failureResponse": {},
        "sendOnlyAdditionalInput": false,
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "integrationProcedureKey": "",
        "remoteOptions": {},
        "chainOnStep": false,
        "actionMessage": "",
        "disableChainable": false
    };

    IntegrationProcedureActionPropertySetController.$inject = ['propCompUtil', 'remoteActions'];

    function IntegrationProcedureActionPropertySetController(propCompUtil, remoteActions) {
        const vm = this;

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        };

        (function loadIPs() {
            remoteActions.loadIntegrationProcedureKeys2().then(function (intProcedureKeys) {
                vm.integrationProcedures = intProcedureKeys;
                vm.integrationProceduresArray = Object.keys(intProcedureKeys);
            });
        })();

        vm.openIntegrationProcedure = function ($event) {
            const ipName = vm.element.PropertySet__c.integrationProcedureKey;
            if (!ipName) {
                return;
            }
            const ip = vm.integrationProcedures[ipName];
            if (!ip) {
                alert('There is currently no Integration Procedure named "' + ipName + '" in this org. If "' + ipName + '" was created recently, please try again in a few moments.');
                loadIPs();
                return;
            }
            doWindowOpen('/apex/' + window.ns + 'integrationproceduredesigner?id=' + ip, $event);
        }

        function doWindowOpen(url, $event) {
            window.vlocityOpenUrl(url, $event, true);
        }

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],32:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('intelligenceActionPropertySet', {
            templateUrl: 'propertysets/ips/action/intelligence-action.tpl.html',
            controller: IntelligenceActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalInput": {},
        "additionalOutput": {},
        "failureResponse": {},
        "sendOnlyAdditionalInput": false,
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "machineDeveloperName": "",
        "inputData": {},
        "itemsToRankPath": "",
        "chainOnStep": false,
        "actionMessage": ""
    };

    IntelligenceActionPropertySetController.$inject = ['propCompUtil', 'remoteActions'];

    function IntelligenceActionPropertySetController(propCompUtil, remoteActions) {
        const vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],33:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('listMergeActionPropertySet', {
            templateUrl: 'propertysets/ips/action/list-merge-action.tpl.html',
            controller: ListMergeActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalInput": {},
        "additionalOutput": {},
        "failureResponse": {},
        "sendOnlyAdditionalInput": false,
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "advancedMerge": false,
        "advancedMergeMap": [],
        "mergeFields": [],
        "allowMergeNulls": true,
        "hasPrimary": false,
        "primaryListKey": "",
        "sortBy": [],
        "sortInDescendingOrder": false,
        "mergeListsOrder": [],
        "filterListFormula": "",
        "dynamicOutputFields": "",
        "updateFieldValue": {},
        "chainOnStep": false,
        "actionMessage": "",
        "additionalChainableResponse": {}
    };

    ListMergeActionPropertySetController.$inject = ['propCompUtil', '$modal'];

    function ListMergeActionPropertySetController(propCompUtil, $modal) {
        var vm = this;
        vm.matchingGroupOptions = ['1', '2', '3', '4', '5'];

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        vm.addAdvancedMergeMap = function () {
            vm.element.PropertySet__c.advancedMergeMap.push({
                listKey: '',
                matchingPath: '',
                normalizeKey: ''
            });
        };

        vm.deleteAdvancedMergeMap = function (map) {
            vm.element.PropertySet__c.advancedMergeMap.splice(vm.element.PropertySet__c.advancedMergeMap.indexOf(map), 1);
        };

        vm.editAsExpression = function () {
            var input = {};
            input.currentVal = vm.element.PropertySet__c.filterListFormula;
            if (typeof input.currentVal == "undefined") {
                input.currentVal = "";
            }

            // delete leading '=' token
            input.currentVal = String(vm.element.PropertySet__c.filterListFormula).replace(/(?:^\s*=)|(?:\s*$)/g, '');
            $modal({
                title: 'Expression Editor',
                templateUrl: 'modal-edit-expression.tpl.html',
                backdrop: 'static',
                controller: function ($scope) {
                    $scope.obj = input;

                    $scope.obj.newVal = $scope.obj.currentVal;

                    $scope.cancel = function () {
                        $scope.$hide();
                    };

                    $scope.submit = function () {
                        if ($scope.obj.newVal || $scope.obj.newVal == 'false') {
                            vm.element.PropertySet__c.filterListFormula = '=' + $scope.obj.newVal;
                        }
                        $scope.cancel();
                    };
                }
            });
        };

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],34:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('matrixActionPropertySet', {
            templateUrl: 'propertysets/ips/action/matrix-action.tpl.html',
            controller: MatrixActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalOutput": {},
        "failureResponse": {},
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "matrix Input Parameters": [],
        "remoteOptions": {
            "matrixName": ""
        },
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "defaultMatrixResult": {},
        "chainOnStep": false,
        "actionMessage": ""
    };

    MatrixActionPropertySetController.$inject = ['propCompUtil', 'remoteActions'];

    function MatrixActionPropertySetController(propCompUtil, remoteActions) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        remoteActions.getMatrixNames().then(function (matrixNames) {
            vm.matrixNames = matrixNames;
        });

        vm.deleteInputParameter = function (inputParam, inputParamArray) {
            inputParamArray.splice(inputParamArray.indexOf(inputParam), 1);
        };

        vm.addNewInputParameter = function (inputParamArray) {
            inputParamArray.push({
                'value': '',
                'name': ''
            });
        };
    }
})();

},{}],35:[function(require,module,exports){
var htmlEncodeDecode = require('../../../../oui/util/HtmlEncodeDecode.js');

(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('omniFormPropertySet', {
            templateUrl: 'propertysets/ips/action/omni-form.tpl.html',
            controller: OmniFormPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalInput": {},
        "additionalOutput": {},
        "failureResponse": {},
        "sendOnlyAdditionalInput": false,
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "Type": "",
        "Sub Type": "",
        "Language": "",
        "preIP": null,
        "postIP": null,
        "remoteOptions": {},
        "chainOnStep": false,
        "actionMessage": ""
    };

    OmniFormPropertySetController.$inject = ['propCompUtil', 'remoteActions','$timeout','LanguagesJson'];

    var persist={};

    function OmniFormPropertySetController(propCompUtil, remoteActions, $timeout, LanguagesJson) {
        var vm = this;

        Object.defineProperty(vm, 'types', {
            get: function() {
                return persist.types;
            }
        });
        Object.defineProperty(vm, 'subtypes', {
            get: function() {
                var tmp = vm.types.find(equalsLabel,vm.element.PropertySet__c.Type);
                return (tmp&&tmp.$$subTypes)||[];
            }
        });
        Object.defineProperty(vm, 'languages', {
            get: function() {
                var tmp = vm.subtypes.find(equalsLabel,vm.element.PropertySet__c['Sub Type']);
                return (tmp&&tmp.$$languages)||[];
            }
        });
        Object.defineProperty(vm, 'id', {
            get: function() {
                var tmp = vm.languages.find(equalsLabel,vm.element.PropertySet__c.Language);
                return (tmp&&tmp.$$id);
            }
        });
        persist.types = persist.types || [];
        updateOmniKeysMapAsync();

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        propCompUtil.baseConstructor.apply(vm);

        remoteActions.getMatrixNames().then(function (matrixNames) {
            vm.matrixNames = matrixNames;
        });

        vm.deleteInputParameter = function (inputParam, inputParamArray) {
            inputParamArray.splice(inputParamArray.indexOf(inputParam), 1);
        };

        vm.addNewInputParameter = function (inputParamArray) {
            inputParamArray.push({
                'inputParam': '',
                'element': ''
            });
        };

        vm.openOmniForm = function ($event) {
            doWindowOpen('/apex/' + window.ns + 'omniscriptdesigner?id=' + vm.id, $event);
        };

        function equalsLabel (a){
            var label = typeof a == "string" ? a : a.label;
            return this && label == this || (typeof label == 'string' && typeof this == 'string' && label.trim() == this.trim());
        }

        function compareLabels (a,b){
            return String(a.label).localeCompare(b.value);
        }

        function addTypes(types, tgt){
            var target = tgt;
            delete types['null'];
            delete types[''];
            var i = -1;
            for (var type in types) {
                type = htmlEncodeDecode.unescapeHTML(type);
                if (types.hasOwnProperty(type)){
                    i = target.findIndex(equalsLabel, type);
                    if (i == -1){
                        i = target.length;
                        target[i]={label: type, value: type, $$subTypes:[]};
                    }
                    var j = -1;
                    for (var subtype in types[type]) {
                        if (types[type].hasOwnProperty(subtype)){
                            subtype = htmlEncodeDecode.unescapeHTML(subtype);
                            j = target[i].$$subTypes.findIndex(equalsLabel, subtype);
                            if (j == -1){
                                j = target[i].$$subTypes.length;
                                target[i].$$subTypes[j]={label: subtype, value: subtype, $$languages:[]};
                            }
                            for (var language in types[type][subtype]) {
                                language = htmlEncodeDecode.unescapeHTML(language);
                                if (target[i].$$subTypes[j].$$languages.findIndex(equalsLabel, language) === -1) {
                                    target[i].$$subTypes[j].$$languages.push({label: LanguagesJson[language], value: language, $$id: types[type][subtype][language]});
                                }
                            }
                            target[i].$$subTypes[j].$$languages.sort(compareLabels);
                        }
                    }
                    target[i].$$subTypes.sort(compareLabels);
                }
            }
            target.sort(compareLabels);
            tgt = target;
        }

        function updateOmniKeysMapAsync () {
            $timeout(function(){
                remoteActions.queryOmniScriptKeys(false,false).then(function(result) {
                    var stor={};
                    result.forEach(function(script){
                        var type=script[ns+"Type__c"],
                            subtype=script[ns+"SubType__c"],
                            lang=script[ns+"Language__c"],
                            id=script['Id'];
                        if(stor.hasOwnProperty(type)){
                            if(stor[type].hasOwnProperty(subtype)){
                                if(!stor[type][subtype].hasOwnProperty(lang)){
                                    stor[type][subtype][lang]='';
                                }
                            }else{
                                stor[type][subtype]={};
                                stor[type][subtype][lang]='';
                            }
                        }else{
                            stor[type] = {};
                            stor[type][subtype]={};
                            stor[type][subtype][lang]='';
                        }
                        stor[type][subtype][lang]=id;
                    });
                    addTypes(stor,persist.types);
                });
            });
        }

        function doWindowOpen(url, $event) {
            window.vlocityOpenUrl(url, $event, true);
        }
    }

})();

},{"../../../../oui/util/HtmlEncodeDecode.js":92}],36:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('remoteActionPropertySet', {
            templateUrl: 'propertysets/ips/action/remote-action.tpl.html',
            controller: RemoteActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalInput": {},
        "additionalOutput": {},
        "failureResponse": {},
        "sendOnlyAdditionalInput": false,
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "remoteClass": "",
        "remoteOptions": {},
        "remoteMethod": "",
        "chainOnStep": false,
        "actionMessage": "",
        "additionalChainableResponse": {}
    };

    RemoteActionPropertySetController.$inject = ['propCompUtil'];

    function RemoteActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],37:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('responseActionPropertySet', {
            templateUrl: 'propertysets/ips/action/response-action.tpl.html',
            controller: ResponseActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "useFormulas": true,
        "additionalOutput": {},
        "returnOnlyAdditionalOutput": false,
        "returnFullDataJSON": false,
        "responseFormat": "JSON",
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "responseDefaultData": {},
        "vlcResponseHeaders": {}
    };

    ResponseActionPropertySetController.$inject = ['propCompUtil'];

    function ResponseActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],38:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('restActionPropertySet', {
            templateUrl: 'propertysets/ips/action/rest-action.tpl.html',
            controller: RestActionPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "useFormulas": true,
        "additionalInput": {},
        "additionalOutput": {},
        "failureResponse": {},
        "sendOnlyAdditionalInput": false,
        "returnOnlyAdditionalOutput": false,
        "returnOnlyFailureResponse": false,
        "responseJSONPath": "",
        "responseJSONNode": "",
        "sendJSONPath": "",
        "sendJSONNode": "",
        "preActionLogging": "%endpoint%",
        "postActionLogging": "",
        "restPath": "",
        "restMethod": "",
        "retryCount": 0,
        "restOptions": {
            "headers": {},
            "params": {},
            "timeout": 0,
            "sendBody": true,
            "xmlEscapeResponse": false,
            "clientCertificateName": "",
            "isCompressed": false
        },
        "namedCredential": "",
        "type": "Integration",
        "chainOnStep": false,
        "actionMessage": ""
    };

    RestActionPropertySetController.$inject = ['propCompUtil'];

    function RestActionPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],39:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('setValuesPropertySet', {
            templateUrl: 'propertysets/ips/action/set-values.tpl.html',
            controller: SetValuesPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "failureConditionalFormula": "",
        "failOnStepError": true,
        "elementValueMap": {},
        "responseJSONPath": "",
        "responseJSONNode": "",
        "chainOnStep": false,
        "actionMessage": ""
    };

    SetValuesPropertySetController.$inject = ['propCompUtil', '$modal'];

    function SetValuesPropertySetController(propCompUtil, $modal) {
        var vm = this;

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
            vm.elementValueMap = vm.objectToKeyValueArray(vm.element.PropertySet__c.elementValueMap);
        };

        vm.objectToKeyValueArray = function objectToKeyValueArray(map) {
            return Object.keys(map).map(function (key) {
                return {
                    key: key,
                    value: map[key],
                    type: vm.getType(map[key])
                };
            });
        }

        vm.getType = function (value) {
            switch (typeof value) {
                case 'object':
                    if (Array.isArray(value)) {
                        return 'array';
                    }
                    return 'object';
                default:
                    if (value && value[0] === '=') {
                        return 'expression';
                    }
                    return 'text';
            }
        };

        vm.addNewKeyValue = function () {
            vm.elementValueMap.push({
                key: '',
                type: 'text',
                value: ''
            });
            vm.updateKeyValueProperty();
        };

        vm.deleteKeyValue = function (option) {
            vm.elementValueMap.splice(vm.elementValueMap.indexOf(option), 1);
            vm.updateKeyValueProperty();
        };

        vm.updateKeyValueProperty = function () {
            const newValue = vm.elementValueMap.reduce(function (obj, prop) {
                var value = prop.value;
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    // try convert to a more appropriate type if possible.
                }
                obj[prop.key] = value;

                return obj;
            }, {});
            vm.element.PropertySet__c.elementValueMap = newValue;

        };

        vm.editAsExpression = function (property, expressionOnly) {
            var input = {};
            input.currentVal = property.value;
            if (typeof input.currentVal == "undefined") {
                input.currentVal = "";
            }

            // delete leading '=' token
            if (!expressionOnly) {
                input.currentVal = String(property.value).replace(/(?:^\s*=)|(?:\s*$)/g, '');
            }
            $modal({
                title: 'Expression Editor',
                templateUrl: 'modal-edit-expression.tpl.html',
                backdrop: 'static',
                controller: function ($scope) {
                    $scope.obj = input;

                    $scope.obj.newVal = $scope.obj.currentVal;

                    $scope.cancel = function () {
                        $scope.$hide();
                    };

                    $scope.submit = function () {
                        if ($scope.obj.newVal || $scope.obj.newVal == 'false') {
                            property.value = '=' + $scope.obj.newVal;
                            vm.updateKeyValueProperty();
                        }
                        $scope.cancel();
                    };
                }
            });
        };

        propCompUtil.baseConstructor.apply(vm);
    }
})();

},{}],40:[function(require,module,exports){
require('./CalculationAction.js');
require('./ChatterAction.js');
require('./DataraptorExtractAction.js');
require('./DataraptorPostAction.js');
require('./DataraptorTransformAction.js');
require('./DeleteAction.js');
require('./DocusignEnvelopeAction.js');
require('./EmailAction.js');
require('./IntegrationProcedureAction.js');
require('./IntelligenceAction.js');
require('./ListMergeAction.js');
require('./MatrixAction.js');
require('./OmniForm.js');
require('./RemoteAction.js');
require('./RestAction.js');
require('./ResponseAction.js');
require('./SetValues.js');
require('./BatchAction.js');

},{"./BatchAction.js":22,"./CalculationAction.js":23,"./ChatterAction.js":24,"./DataraptorExtractAction.js":25,"./DataraptorPostAction.js":26,"./DataraptorTransformAction.js":27,"./DeleteAction.js":28,"./DocusignEnvelopeAction.js":29,"./EmailAction.js":30,"./IntegrationProcedureAction.js":31,"./IntelligenceAction.js":32,"./ListMergeAction.js":33,"./MatrixAction.js":34,"./OmniForm.js":35,"./RemoteAction.js":36,"./ResponseAction.js":37,"./RestAction.js":38,"./SetValues.js":39}],41:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('cacheBlockPropertySet', {
            templateUrl: 'propertysets/ips/group/cache-block.tpl.html',
            controller: CacheBlockPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "refreshCacheConditionalFormula": "",
        "ignoreCacheConditionalFormula": "",
        "executionConditionalFormula": "",
        "cacheKeys": {},
        "cacheBlockOutput": {},
        "ttlMinutes": 5,
        "cacheType":""
    };

    CacheBlockPropertySetController.$inject = ['propCompUtil'];

    function CacheBlockPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }

        vm.cacheTypes = ['Session Cache', 'Org Cache'];
    }
})();

},{}],42:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('conditionalBlockPropertySet', {
            templateUrl: 'propertysets/ips/group/conditional-block.tpl.html',
            controller: ConditionalBlockPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "executionConditionalFormula": "",
        "isIfElseBlock": false
    };

    ConditionalBlockPropertySetController.$inject = ['propCompUtil'];

    function ConditionalBlockPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],43:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('loopBlockPropertySet', {
            templateUrl: 'propertysets/ips/group/loop-block.tpl.html',
            controller: LoopBlockPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "loopList": "",
        "executionConditionalFormula": "",
        "loopOutput": {}
    };

    LoopBlockPropertySetController.$inject = ['propCompUtil'];

    function LoopBlockPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],44:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .component('tryCatchBlockPropertySet', {
            templateUrl: 'propertysets/ips/group/try-catch-block.tpl.html',
            controller: TryCatchBlockPropertySetController,
            controllerAs: 'vm',
            bindings: {
                element: '<',
                scriptElement: '<'
            }
        });

    const DEFAULT_PROP_SET = {
        "failureResponse": {},
        "remoteClass":"",
        "remoteMethod":"",
        "executionConditionalFormula": "",
        "failOnBlockError": true
    };

    TryCatchBlockPropertySetController.$inject = ['propCompUtil'];

    function TryCatchBlockPropertySetController(propCompUtil) {
        var vm = this;

        propCompUtil.baseConstructor.apply(vm);

        vm.$onChanges = function (changes) {
            if (!changes.element) {
                return;
            }

            vm.element.PropertySet__c = vm.updateDefaultProperties(DEFAULT_PROP_SET, vm.element.PropertySet__c, vm.getElementType(vm.element));
        }
    }
})();

},{}],45:[function(require,module,exports){
require('./ConditionalBlock.js');
require('./LoopBlock.js');
require('./CacheBlock.js');
require('./TryCatchBlock.js');

},{"./CacheBlock.js":41,"./ConditionalBlock.js":42,"./LoopBlock.js":43,"./TryCatchBlock.js":44}],46:[function(require,module,exports){
/*global fileNsPrefixDot*/
(function () {
    'use strict';
    angular.module('omniscriptDesigner')
        .config(['remoteActionsProvider', function (remoteActionsProvider) {
            'use strict';
            remoteActionsProvider.setRemoteActions({
                getOmniScript: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetOmniScript",
                    config: {
                        buffer: false
                    }
                },
                getDocuments: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetDocuments",
                    config: {
                        buffer: false
                    }
                },
                getReusableOmniScripts: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetReusableOmniScripts",
                    config: {
                        buffer: false
                    }
                },
                getOmniScriptTypes: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetOmniScriptTypes",
                    config: {
                        buffer: false
                    }
                },
                getElements: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetElements",
                    config: {
                        buffer: false
                    }
                },
                loadElementTypes: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadElementTypes",
                    config: {
                        buffer: false
                    }
                },
                loadScriptElementTypes: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadScriptElementTypes",
                    config: {
                        buffer: false
                    }
                },
                getMatchingDRBundles: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.getMatchingDRBundles",
                    config: {
                        buffer: false
                    }
                },
                loadIntegrationProcedureKeys2: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadIntegrationProcedureKeys2",
                    config: {
                        buffer: false
                    }
                },
                loadVlocityUITemplates: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadVlocityUITemplates",
                    config: {
                        buffer: false
                    }
                },
                uploadDocument: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.uploadDocument",
                    config: {
                        buffer: false
                    }
                },
                getAllDocuments: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetAllDocuments",
                    config: {
                        buffer: false
                    }
                },
                getLanguageCodeMap: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.getLanguageCodeMap",
                    config: {
                        buffer: false
                    }
                },
                loadLanguages: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadLanguages",
                    config: {
                        buffer: false
                    }
                },
                loadPropertySetForElement: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadPropertySetForElement",
                    config: {
                        buffer: false
                    }
                },
                getKnowledgeArticles: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.getKnowledgeArticles",
                    config: {
                        buffer: false
                    }
                },
                saveOmniScript: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.SaveOmniScript",
                    config: {
                        buffer: false
                    }
                },
                saveElement: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.SaveElement",
                    config: {
                        buffer: false
                    }
                },
                deleteOmniScript: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.DeleteOmniScript",
                    config: {
                        buffer: false
                    }
                },
                deleteElement: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.DeleteElement",
                    config: {
                        buffer: false
                    }
                },
                getAllObjects: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetAllObjects",
                    config: {
                        buffer: false
                    }
                },
                getExternalObjects: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetExternalObjects",
                    config: {
                        buffer: false
                    }
                },
                getFieldsForObject: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetFieldsForObject",
                    config: {
                        buffer: false
                    }
                },
                getExternalObjects: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetExternalObjects",
                    config: {
                        buffer: false
                    }
                },
                createVersion: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.CreateVersion",
                    config: {
                        buffer: false
                    }
                },
                activateVersion: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.ActivateVersion",
                    config: {
                        buffer: false
                    }
                },
                deactivateVersion: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.DeactivateVersion",
                    config: {
                        buffer: false
                    }
                },
                loadDocuSignTemplates: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadDocuSignTemplates",
                    config: {
                        buffer: false
                    }
                },
                viewFullDataJson: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.ViewFullDataJson",
                    config: {
                        buffer: false
                    }
                },
                GetEmailTemplates: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetEmailTemplates",
                    config: {
                        buffer: false
                    }
                },
                GetEmailDocuments: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetEmailDocuments",
                    config: {
                        buffer: false
                    }
                },
                ensureDocumentUploads: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.EnsureDocumentUploads",
                    config: {
                        buffer: false
                    }
                },
                getMatrixNames: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetMatrixNames",
                    config: {
                        buffer: false
                    }
                },
                getMatrixHeaders: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetMatrixHeaders",
                    config: {
                        buffer: false
                    }
                },
                exportOmniScript: {
                    action: fileNsPrefixDot() + "OmniScriptHomeController.exportScripts",
                    config: {
                        buffer: true,
                        escape: false
                    }
                },
                BuildJSONV2: {
                    action: fileNsPrefixDot() + "OmniScriptHomeController.BuildJSONV2",
                    config: {
                        escape: false,
                        buffer: false
                    }
                },
                toggleElementTrigger: {
                    action: fileNsPrefixDot() + "OmniScriptHomeController.toggleElementTrigger",
                    config: {
                        buffer: false
                    }
                },
                createElement: {
                    action: fileNsPrefixDot() + "OmniScriptHomeController.createElement",
                    config: {
                        escape: false,
                        buffer: true
                    }
                },
                getCustomLabels: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.getCustomLabels",
                    config: {
                        escape: false,
                        buffer: true
                    }
                },
                updateScriptLastPreviewPage: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.updateScriptLastPreviewPage",
                    config: {
                        escape: false,
                        buffer: true
                    }
                },
                createScript: fileNsPrefixDot() + "OmniScriptHomeController.createScript",
                queryOmniScriptKeys: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.QueryOmniScriptKeys",
                    config: {
                        buffer: false
                    }
                },
                loadIntegrationProcedureElementTypes: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.LoadIntegrationProcedureElementTypes",
                    config: {
                        buffer: false
                    }
                },
                testIntegrationProcedure: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.testIntegrationProcedure",
                    config: {
                        escape: false
                    }
                },
                getAllLWCNames: {
                    action: fileNsPrefixDot() + "LWCDesignerController.getAllLWCNames",
                    config: {
                        escape: false,
                        buffer: true
                    }
                },
                getLWCBundles: {
                    action: fileNsPrefixDot() + "LWCDesignerController.getLWCBundles",
                    config: {
                        escape: false,
                        buffer: false
                    }
                },
                vlocityFormulaParserFunctions: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.vlocityFormulaParserFunctions",
                    config: {
                        escape: false
                    }
                },
                GetScheduledJobs: {
                    action: fileNsPrefixDot() + "OmniScriptDesignerController.GetScheduledJobs",
                    config: {
                        escape: false
                    }
                }
            });
        }]).config(function ($locationProvider) {
            $locationProvider.html5Mode({
                enabled: !!(window.history && history.pushState),
                requireBase: false
            });
        }).config(['$compileProvider', function ($compileProvider) {
            $compileProvider.debugInfoEnabled(false);
        }]).config(['$localizableProvider', function ($localizableProvider) {
            $localizableProvider.setLocalizedMap(window.i18n);
            $localizableProvider.setDebugMode(window.ns === '');
            $localizableProvider.setSyncModeOnly();
        }]).config(function ($typeaheadProvider) {
            angular.extend($typeaheadProvider.defaults, {
                watchOptions: true,
                minLength: 0,
                limit: 1000
            });
        }).config(function ($tooltipProvider) {
            angular.extend($tooltipProvider.defaults, {
                delay: {
                    show: 0,
                    hide: 100
                }
            });
        });
})();

},{}],47:[function(require,module,exports){
var PaletteElement = require('../../oui/util/PaletteElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module('omniscriptDesigner')
    .run(function($rootScope, isIntegrationProcedure, OmniScriptJson,
                    ElementTypesJson,  $localizable) {
        'use strict';
        var defaultConfigForScriptElement = {
            'Name': $localizable(isIntegrationProcedure ? 'IntProcNewIntProc' : 'OmniDesNewOmniScript')
        };
        defaultConfigForScriptElement[fileNsPrefix() + 'IsProcedure__c'] = !!isIntegrationProcedure;

        if (OmniScriptJson.Id) {
            $rootScope.scriptElement = new ScriptElement(OmniScriptJson);
            if ($rootScope.scriptElement.IsActive__c) {
                var pageDescription = $('.pageDescription');
                pageDescription.append('&nbsp;<span class="active text-success">' +
                        $localizable('OmniDesActive') + '</span>');
                pageDescription.addClass('vlocity');
            }
        } else {
            $rootScope.scriptElement = new ScriptElement(defaultConfigForScriptElement);
        }
        if (typeof sforce !== 'undefined') {
            if (sforce.console && sforce.console.isInConsole()) {
                sforce.console.setTabTitle($rootScope.scriptElement.Name);
                if (isIntegrationProcedure) {
                    sforce.console.setTabIcon('custom:custom63');
                } else {
                    sforce.console.setTabIcon('standard:template');
                }
                document.getElementById('omnidesigner_goback').style.display = 'none';
            }
        }
        var titleEl = document.querySelector('title');
        if (!titleEl) {
            var headEl = document.querySelector('head');
            titleEl = document.createElement('title');
            headEl.appendChild(titleEl);
        }
        titleEl.innerText = (isIntegrationProcedure ? 'IP: ' : 'OmniScript: ') + $rootScope.scriptElement.Name;

        ElementTypesJson.filter(function (element) {
            return !/(Button)/gi.test(element);
        }).map(function (element) {
            return PaletteElement.factory(element);
        });

        $rootScope.vlocityOpenUrl = window.vlocityOpenUrl;
    });

},{"../../oui/util/PaletteElement.js":93,"../../oui/util/ScriptElement.js":94}],48:[function(require,module,exports){
var PaletteElement = require('../../oui/util/PaletteElement.js');
var CanvasElement = require('../../oui/util/CanvasElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module('omniscriptDesigner')
    .controller('elementPalette', function ($scope, isIntegrationProcedure, ElementTypesJson, ReusableScriptsInit) {
        'use strict';
        $scope.groupedControlsGroupCollapse = $scope.navigationGroupCollapse = $scope.inputControlsGroupCollapse = false;

        if (!isIntegrationProcedure) {
            $scope.reusableScripts = ReusableScriptsInit.map(function (script) {
                return PaletteElement.factory(script);
            }).sort();
        }
        $scope.allElements = ElementTypesJson.filter(function (element) {
            return !/(Button)/gi.test(element);
        }).sort().map(function (element) {
            return PaletteElement.factory(element);
        });
    });

},{"../../oui/util/CanvasElement.js":91,"../../oui/util/PaletteElement.js":93,"../../oui/util/ScriptElement.js":94}],49:[function(require,module,exports){
var CanvasElement = require('../../oui/util/CanvasElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module('omniscriptDesigner')
    .controller('omniscriptDesignerController', function ($rootScope, $scope, $q, remoteActions, fixMissingPropertiesFilter,
        $location, $timeout, save, $localizable, $modal, ElementsJson, $injector, isIntegrationProcedure) {
        'use strict';
        var urlPrefix = window.location.protocol + '//' + window.location.hostname;

        function sortByOrder(a, b) {
            if (a.Order__c === undefined) {
                return (b.Order__c === undefined) ? 0 : 1;
            } else if (b.Order__c === undefined) {
                return -1;
            }
            return a.Order__c - b.Order__c;
        }

        $timeout(function () {
            $rootScope.$broadcast('activeElementInCanvas', $rootScope.scriptElement);
        });
        var transformedElements = [],
            inProgressMap = {};
        ElementsJson.forEach(function (elementPreConvert) {
            var element = CanvasElement.fromJson(elementPreConvert);
            if (element) {
                fixMissingPropertiesFilter(element);
                transformedElements.push(element);
                inProgressMap[element.Id] = element;
            }
        });
        for (var i = 0; i < transformedElements.length; i++) {
            var transformedElement = transformedElements[i];
            if (transformedElement.ParentElementId__c) {
                if (inProgressMap[transformedElement.ParentElementId__c]) {
                    inProgressMap[transformedElement.ParentElementId__c].children.push(transformedElement);
                }
                transformedElements.splice(i, 1);
                i--;
            }
        }
        transformedElements.forEach(function (transformedElement) {
            $rootScope.scriptElement.children.push(transformedElement);
        });
        $rootScope.scriptElement.each(function (element) {
            if (element.children) {
                element.children.sort(sortByOrder);
            }
        });

        $scope.saveOmniScript = function () {
            return save($rootScope.scriptElement);
        };

        $scope.toggleCollapsePalette = function () {
            $rootScope.collapsePalette = !$rootScope.collapsePalette;
        };

        $scope.toggleFullScreen = function () {
            $rootScope.fullScreen = !$rootScope.fullScreen;
        };

        $scope.showHowToUse = function () {
            var modal = $modal({
                title: 'How to launch',
                templateUrl: 'modal-how-to-use-this.tpl.html',
                show: false,
                html: true,
                backdrop: 'static',
                controller: function ($scope, $timeout) {
                    var pageToMode = {
                        'Universal Page': 'OmniScriptUniversalPage',
                        'Universal Page with Header': 'OmniScriptUniversalPageWHeader',
                        'Universal Page with Header/Sidebar': 'OmniScriptUniversalPageWHeaderSidebar',
                        'Mobile': 'OmniScriptUniversalMobilePage',
                        'Communities': 'OmniScriptUniversalCommunitiesPage',
                        'Console': 'OmniScriptUniversalPageConsole'
                    };

                    $scope.modes = Object.keys(pageToMode);
                    $scope.currentMode = $scope.modes[0];
                    $scope.vertOrHoriz = 'lightning';
                    $scope.$watch('currentMode', buildUrl);
                    $scope.$watch('vertOrHoriz', buildUrl);
                    $scope.embedLayout = 'lightning';
                    $scope.lwcLayout = 'lightning';
                    $scope.lwcEnabled = $rootScope.scriptElement.IsLwcEnabled__c;
                    $scope.tabs = [{
                        title: 'Angular',
                        content: '',
                    }];
                    $scope.tabs.activeTab = 0;
                    var nsPrefix = window.ns.replace(/__$/, '');

                    if ($rootScope.scriptElement.IsLwcEnabled__c) {
                        $scope.tabs.push({
                            title: 'LWC',
                            content: ''
                        })
                    }

                    function buildUrl() {
                        var mode, layout, layoutParams, verHor;

                        //default mode is vertical, vertical is true
                        mode = $scope.vertOrHoriz === 'horizontal' ? 'horizontal' : 'vertical';
                        verHor = $scope.vertOrHoriz !== 'horizontal';

                        if ($scope.currentMode !== 'Mobile' && $scope.currentMode !== 'Communities') {
                            if ($scope.vertOrHoriz === 'lightning') {
                                layout = 'lightning'
                            }
                            else if ($scope.vertOrHoriz === 'newport') {
                                layout = 'newport';
                            }
                        }
                        else { //defaults to vertical if currentMode changes
                            $scope.vertOrHoriz = 'vertical';
                        }

                        //default layout parameters
                        layoutParams = layout ? '&layout=' + layout : '';

                        $scope.url = urlPrefix + '/apex/' + window.ns +

                            pageToMode[$scope.currentMode] + '?id={0}' + layoutParams + '#/OmniScriptType/' + $rootScope.scriptElement.Type__c +
                            '/OmniScriptSubType/' + $rootScope.scriptElement.SubType__c +
                            '/OmniScriptLang/' + $rootScope.scriptElement.Language__c +
                            '/ContextId/{0}/PrefillDataRaptorBundle//' + verHor;

                        layoutParams = '&scriptMode=' + mode;

                        if (($scope.currentMode !== 'Mobile' && $scope.currentMode !== 'Communities')) {
                            if (layout) {
                                layoutParams = layoutParams + '&layout=' + layout;
                            }
                        }


                        $scope.urlWithParam = urlPrefix + '/apex/' + window.ns +
                            pageToMode[$scope.currentMode] + '?id={0}&OmniScriptType=' + encodeURIComponent($rootScope.scriptElement.Type__c) +
                            '&OmniScriptSubType=' + encodeURIComponent($rootScope.scriptElement.SubType__c) +
                            '&OmniScriptLang=' + encodeURIComponent($rootScope.scriptElement.Language__c) +
                            '&PrefillDataRaptorBundle=' + layoutParams + '&ContextId={0}';


                        if (!isIntegrationProcedure && $rootScope.scriptElement.IsLwcEnabled__c) {
                            const compilerService = $injector.get('compilerService'),
                                type = $rootScope.scriptElement.Type__c,
                                subType = $rootScope.scriptElement.SubType__c,
                                language = $rootScope.scriptElement.Language__c,
                                lwcName = compilerService.getLwcName(type, subType, language),
                                cTag = compilerService.getComponentTag(lwcName),
                                consoleTabTitle = $rootScope.scriptElement.PropertySet__c.consoleTabTitle,
                                consoleTabIcon = $rootScope.scriptElement.PropertySet__c.consoleTabIcon,
                                componentNs = window.isInsidePckg === "true" || window.isInsidePckg === true ? 'c' : (nsPrefix || 'c');

                            let consoleTabTitleUrlParam = '',
                                consoleTabIconUrlParam = '';

                            if (consoleTabTitle) {
                                consoleTabTitleUrlParam = `&c__tabLabel=${consoleTabTitle}`;
                            }

                            if (consoleTabIcon) {
                                consoleTabIconUrlParam = `&c__tabIcon=${consoleTabIcon}`;
                            }

                            $scope.lwcWrapperUrl = urlPrefix + '/lightning/cmp/' + (window.ns || 'c__') + 'vlocityLWCOmniWrapper?c__target=' + componentNs + ':' + lwcName + '&c__layout=' + $scope.lwcLayout +
                                consoleTabTitleUrlParam + consoleTabIconUrlParam;
                            $scope.lwcTag = `<${cTag} layout="${$scope.lwcLayout}" prefill={prefill}></${cTag}>`;
                            $scope.lwcTag2 = `<${cTag} layout="${$scope.lwcLayout}" prefill='\\{"contextId":"abc","OmniScriptType":"FAQ"}'></${cTag}>`;
                            $scope.lwcName = lwcName;
                        }
                    }

                    var appName = $rootScope.scriptElement.Name.replace(/( |_|-)/gi, '');
                    var elementPrefix = (nsPrefix || nsPrefix === '' ? nsPrefix : 'c') + ':';

                    $scope.onChangeLayout = function (scp) {
                        if ($scope.embedLayout === "lightning") {
                            $scope.textarea = $scope.makeVFTemplateForLayout("lightning");
                        }
                        else if ($scope.embedLayout === "newport") {
                            $scope.textarea = $scope.makeVFTemplateForLayout("newport");
                        }
                        else {
                            $scope.textarea = $scope.makeVFTemplateForLayout();
                        }
                    };

                    $scope.onChangeLwcLayout = function () {
                        if (isIntegrationProcedure) return;

                        const compilerService = $injector.get('compilerService'),
                            type = $rootScope.scriptElement.Type__c,
                            subType = $rootScope.scriptElement.SubType__c,
                            language = $rootScope.scriptElement.Language__c,
                            lwcName = compilerService.getLwcName(type, subType, language),
                            cTag = compilerService.getComponentTag(lwcName),
                            consoleTabTitle = $rootScope.scriptElement.PropertySet__c.consoleTabTitle,
                            consoleTabIcon = $rootScope.scriptElement.PropertySet__c.consoleTabIcon,
                            componentNs = window.isInsidePckg === "true" || window.isInsidePckg === true ? 'c' : (nsPrefix || 'c');

                        let consoleTabTitleUrlParam = '',
                            consoleTabIconUrlParam = '';

                        if (consoleTabTitle) {
                            consoleTabTitleUrlParam = `&c__tabLabel=${consoleTabTitle}`;
                        }

                        if (consoleTabIcon) {
                            consoleTabIconUrlParam = `&c__tabIcon=${consoleTabIcon}`;
                        }

                        $scope.lwcWrapperUrl = urlPrefix + '/lightning/cmp/' + (window.ns || 'c__') + 'vlocityLWCOmniWrapper?c__target=' + componentNs + ':' + lwcName + '&c__layout=' + $scope.lwcLayout +
                            consoleTabTitleUrlParam + consoleTabIconUrlParam;
                        $scope.lwcTag = `<${cTag} layout="${$scope.lwcLayout}" prefill={prefill}></${cTag}>`;
                        $scope.lwcTag2 = `<${cTag} layout="${$scope.lwcLayout}" prefill='\\{"contextId":"abc","OmniScriptType":"FAQ"}'></${cTag}>`;
                    }

                    var xmls = 'http://www.w3.org/2000/svg',
                        xlink = 'http://www.w3.org/1999/xlink';


                    $scope.makeVFTemplateForLayout = function (layout) {
                        var header, sidebar, scriptLayout;
                        // default to classic
                        if (!layout) {
                            header = true;
                            sidebar = true;
                            scriptLayout = '';
                        }
                        // lightning, newport layout
                        else {
                            header = false;
                            sidebar = false;
                            scriptLayout = '\t\t\tscriptLayout=\"' + layout + '\"\n';
                        }

                        return '<apex:page standardStylesheets=\"false\" ' +
                            'showHeader=\"' + header + '\" sidebar=\"' + sidebar + '\" docType=\"html-5.0\">\n' +
                            '\t<div class=\"vlocity via-slds\" xmlns=\"' + xmls + '\" xmlns:xlink=\"' + xlink + '\" ng-app=\"' + appName + '\">\n' +
                            '\t\t<' + elementPrefix + 'BusinessProcessComponent\n' +
                            '\t\t\tstrOmniScriptType=\"' + $rootScope.scriptElement.Type__c + '\"\n' +
                            '\t\t\tstrOmniScriptSubType=\"' + $rootScope.scriptElement.SubType__c + '\"\n' +
                            '\t\t\tstrOmniScriptLang=\"' + $rootScope.scriptElement.Language__c + '\"\n' +
                            '\t\t\tpreviewMode=\"{!$CurrentPage.parameters.previewEmbedded}\"\n' +
                            '\t\t\tverticalMode=\"{!$CurrentPage.parameters.verticalMode}\"\n' +
                            '\t\t\tstrOmniScriptId=\"{!$CurrentPage.parameters.designerPreviewId}\"\n' +
                            scriptLayout + '\t\t\t/>\n' +
                            '\t\t<script type=\"text/javascript\">\n' +
                            '\t\t\tvar modules = [\'vlocity-business-process\'];\n' +
                            '\t\t\tvar myModule = angular.module(\'' + appName + '\', modules);\n' +
                            '\t\t</script>\n' +
                            ($rootScope.scriptElement.CustomJavaScript__c && $rootScope.scriptElement.CustomJavaScript__c !== '' ?
                                ('\t\t<script type=\"text/javascript\">\n' +
                                    $rootScope.scriptElement.CustomJavaScript__c +
                                    '\n\t\t</script>\n') : '') +
                            $rootScope.scriptElement.TestHTMLTemplates__c +
                            '\n\t</div>\n' +
                            '\t<' + elementPrefix + 'VFActionFunction/> \n' +
                            '</apex:page>';
                    }

                    $scope.textarea = $scope.makeVFTemplateForLayout($scope.embedLayout);
                }
            });
            modal.$promise.then(modal.show)
                .then(function (done) {
                    $timeout(function () {
                        var clipboard = new Clipboard('.copy-btn');
                        clipboard.on('success', function (e) {
                            showTooltip(e.trigger, 'Copied!');
                        });

                        function showTooltip(elem, msg) {
                            $(elem).addClass('tooltipped tooltipped-s');
                            elem.setAttribute('aria-label', msg);
                            $(elem).on('mouseleave', function (e) {
                                $(elem).removeClass('tooltipped tooltipped-s');
                                elem.removeAttribute('aria-label');
                            });
                        }
                    });
                });
        };

        $scope.viewFullDataJson = function () {
            var modal = $modal({
                title: $localizable('OmniDesFullDataJsonModalTitle'),
                templateUrl: 'modal-view-full-data-json.tpl.html',
                show: false,
                html: true,
                controller: function ($scope, $timeout) {
                    $scope.initFullDataJson = function () {
                        $scope.loading = true;
                        var scriptId = window.location ? window.location.href.split(/[?&]/).find(function (item) {
                            return /^id\=/.test(item);
                        }) : null;
                        if (scriptId) {
                            scriptId = scriptId.replace(/^id=/, '');
                            remoteActions.viewFullDataJson(scriptId)
                                .then(function (omniScriptResult) {
                                    $scope.loading = false;
                                    $scope.dataJson = omniScriptResult.replace(/&quot;/g, '"');
                                    $scope.dataJson = JSON.stringify(JSON.parse($scope.dataJson), null, 4);
                                });
                        }
                    }
                }
            });

            modal.$promise.then(modal.show)
                .then(function (done) {
                    $timeout(function () {
                        var clipboard = new Clipboard('.copy-btn');
                        clipboard.on('success', function (e) {
                            showTooltip(e.trigger, 'Copied!');
                        });

                        function showTooltip(elem, msg) {
                            $(elem).addClass('tooltipped tooltipped-s');
                            elem.setAttribute('aria-label', msg);
                            $(elem).on('mouseleave', function (e) {
                                $(elem).removeClass('tooltipped tooltipped-s');
                                elem.removeAttribute('aria-label');
                            });
                        }
                    });
                });
        };
    });

},{"../../oui/util/CanvasElement.js":91,"../../oui/util/ScriptElement.js":94}],50:[function(require,module,exports){
/* globals _, VOUINS */
var CanvasElement = require('../../oui/util/CanvasElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

(function () {
    'use strict';
    var angular = window.angular;

    angular.module('omniscriptDesigner')
        .controller('propertiesController', function ($rootScope, $scope, save, $timeout) {
            $scope.showJsonEditor = false;
            $scope.propertySetAsText = '';

            $scope.toggleJsonEditor = function () {
                $scope.showJsonEditor = !$scope.showJsonEditor;
            };

            $scope.onJsonChange = function (propSetAsText) {
                $scope.propertySetAsText = propSetAsText;
            };

            $scope.$watch('propertySetAsText', function (newValue, oldValue) {
                try {
                    if ($scope.showJsonEditor) {
                        $scope.activeElement.PropertySet__c = JSON.parse($scope.propertySetAsText);
                        $scope.propertySetInvalid = false;
                    }
                } catch (exp) {
                    $scope.propertySetInvalid = true;
                }
            });

            $rootScope.$on('activeElementInCanvas', function (event, args) {
                if (angular.isString(args)) {
                    $scope.activeElement = CanvasElement.getById(args);
                } else {
                    $scope.activeElement = args;
                }
                if (!$scope.activeElement) {
                    $scope.activeElement = $rootScope.scriptElement;
                }

                $scope.showJsonEditor = false;
            });

            function without(obj, keys) {
                return Object.keys(obj).filter(function (key) {
                    return keys.indexOf(key) === -1;
                }).reduce(function (result, key) {
                    result[key] = obj[key];
                    return result;
                }, {});
            }

            // save changes on every call
            var timeouts = {};
            $scope.$watch(function () {
                if ($scope.activeElement) {
                    return without($scope.activeElement, ['parent', 'children', 'saving', 'collapse',
                        'errors', 'allowDrop', 'originalJson', 'filter', 'deleted', 'deleting'
                    ]);
                } else {
                    return [];
                }
            }, _.debounce(function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    var elementToSave = $scope.activeElement;
                    if (elementToSave &&
                        // only autosave script element if it has an ID,
                        //i.e. it has been explicitly saved already
                        !(elementToSave instanceof ScriptElement && !elementToSave.Id)) {
                        if (elementToSave.Id && timeouts[elementToSave.Id]) {
                            $timeout.cancel(timeouts[elementToSave.Id]);
                        }
                        timeouts[elementToSave.Id] = $timeout(function () {
                            save(elementToSave);
                            $rootScope.$broadcast('elementPropertyChanged');
                        }, 750);
                        $scope.propertySetAsText = JSON.stringify($scope.activeElement.PropertySet__c, null, 4);
                    }
                }
            }, 250), true);

        });
}());

},{"../../oui/util/CanvasElement.js":91,"../../oui/util/ScriptElement.js":94}],51:[function(require,module,exports){
/* globals vlocityVFActionFunctionControllerHandlers */
angular.module('omniscriptDesigner')
    .controller('scriptFormController', function ($scope, $rootScope, $window, $modal, remoteActions, $localizable, $drvExport, backcompatExport, isIntegrationProcedure, $injector) {
        'use strict';

        let compilerService = null,
            toolingService = null,
            bpService = null;

        if (!isIntegrationProcedure) {
            compilerService = $injector.get('compilerService');
            toolingService = $injector.get('toolingService');
            bpService = $injector.get('bpService');
        }

        $scope.createVersion = function () {
            $rootScope.scriptElement.saving = true;
            $rootScope.scriptElement.activating = true;
            var input = angular.toJson({
                Id: $rootScope.scriptElement.Id
            });
            var options = angular.toJson({
                url: isIntegrationProcedure ? 'integrationproceduredesigner' : 'omniscriptdesigner'
            });
            var className = fileNsPrefixDot() + 'BusinessProcessController.BusinessProcessControllerOpen';

            vlocityVFActionFunctionControllerHandlers.runServerMethod(className, 'CreateVersion',
                input, options, false)
                .then(function (response) {
                    var responseObj = JSON.parse(response);
                    if ($window.top !== $window && $window.sforce.console.isInConsole()) {
                        sforce.console.getEnclosingPrimaryTabId(function (parentTabResponse) {
                            sforce.console.getEnclosingTabId(function (response) {
                                if (response.id === parentTabResponse.id) {
                                    sforce.console.openPrimaryTab(null, fixUpUrlWithParams(responseObj.url), true);
                                } else {
                                    sforce.console.openSubtab(parentTabResponse.id, fixUpUrlWithParams(responseObj.url), true, '');
                                }
                                sforce.console.closeTab(response.id);
                            });
                        });
                    } else {
                        window.location = fixUpUrlWithParams(responseObj.url);
                    }
                });
        };

        $scope.activateVersion = function () {

            // Validate we have ALL 3 elements in order to allow activate when LWC is enabled
            if (!isIntegrationProcedure && $rootScope.scriptElement.IsLwcEnabled__c) {
                const type = $rootScope.scriptElement.Type__c,
                    subType = $rootScope.scriptElement.SubType__c,
                    language = $rootScope.scriptElement.Language__c;

                compilerService.validate(type, subType, language)
                    .then(() => {
                        var modalScope = $scope.$new();
                        modalScope.ok = () => preActivateVersion(true);
                        $modal({
                            title: 'Activation',
                            templateUrl: 'confirmationModal.tpl.html',
                            content: $localizable('OmniDesConfirmActivationWithLwc'),
                            scope: modalScope,
                            show: true
                        });
                    })
                    .catch(() => {
                        $rootScope.scriptElement.saving = false;
                        $rootScope.scriptElement.activating = false;
                    });

            } else {
                preActivateVersion(true);
            }
        };

        function fixUpUrlWithParams(url) {
            var searchParams = window.location.search.substr(1).split('&');
            var hrefEl = document.createElement('a');
            hrefEl.href = url;
            var newSearchParams = hrefEl.search.substr(1).split('&');
            var combinedSearchParams = searchParams.reduce(function (obj, param) {
                var keyValue = param.split('=');
                obj[keyValue[0]] = keyValue[1];
                return obj;
            }, {});
            newSearchParams.forEach(function (param) {
                var keyValue = param.split('=');
                combinedSearchParams[keyValue[0]] = keyValue[1];
            });
            combinedSearchParams.cb = Date.now();
            return hrefEl.pathname + '?' + Object.keys(combinedSearchParams).reduce(function (str, paramKey) {
                if (paramKey && paramKey.length > 0 && combinedSearchParams[paramKey] !== undefined) {
                    str += '&' + paramKey + '=' + combinedSearchParams[paramKey];
                }
                return str;
            }, '');
        }

        $scope.deactivateVersion = () => preActivateVersion(false);

        $scope.delete = function () {
            var modalScope = $scope.$new();
            modalScope.ok = function () {
                remoteActions.deleteOmniScript($rootScope.scriptElement.Id)
                    .then(function (response) {
                        if ($window.top !== $window && $window.sforce.console.isInConsole()) {
                            sforce.console.getEnclosingTabId(function (response) {
                                sforce.console.closeTab(response.id);
                            });
                        } else {
                            window.vlocityOpenUrl(response);
                        }
                    });
            };
            $modal({
                title: $localizable('OmniDesConfirmDeleteTitle'),
                template: 'confirmationModal.tpl.html',
                content: $localizable(isIntegrationProcedure ?
                    'IntDesConfirmDeleteContent' : 'OmniDesConfirmDeleteContent'),
                scope: modalScope,
                show: true
            });
        };

        $scope.export = function ($event) {
            if ($event.altKey) {
                backcompatExport($rootScope.scriptElement);
                return;
            }
            $drvExport({
                scope: $scope,
                drvExport: $rootScope.scriptElement.Id,
                drvSuggestedName: $rootScope.scriptElement.Name,
                drvDataPackType: isIntegrationProcedure ? 'IntegrationProcedure' : 'OmniScript'
            });
        };

        $scope.disableOpenInLwcDesigner = function() {
            return $rootScope.scriptElement.IsLwcEnabled__c && compilerService.getLwcErrors($rootScope.scriptElement.Type__c, $rootScope.scriptElement.SubType__c, $rootScope.scriptElement.Language__c).length > 0;
        }

        function preActivateVersion(isActivate) {

            // Enable spinners
            $rootScope.scriptElement.saving = true;
            $rootScope.scriptElement.activating = true;

            executeActivation(isActivate)
                .then(responseObj => {

                    if (isIntegrationProcedure || !$rootScope.scriptElement.IsLwcEnabled__c || /redirectTo/.test(responseObj.url)) {
                        postActivation(responseObj);
                    } else {
                        let promise = Promise.resolve();
                        if (isActivate) {
                            // Process the LWC
                            promise = processLwc(isActivate);
                        }
                        promise.then(() => postActivation(responseObj));
                    }
                });
        }

        function executeActivation(isActivate) {
            return new Promise((resolve, reject) => {
                // Create the request
                var input = angular.toJson({
                    Id: $rootScope.scriptElement.Id
                });
                var options = angular.toJson({
                    url: isIntegrationProcedure ? 'integrationproceduredesigner' : 'omniscriptdesigner'
                });
                var className = fileNsPrefixDot() + 'BusinessProcessController.BusinessProcessControllerOpen';
                const method = isActivate ? 'ActivateVersion' : 'DeactivateVersion';

                // Execute the request
                vlocityVFActionFunctionControllerHandlers.runServerMethod(className, method,
                    input, options, false)
                    .then(response => resolve(JSON.parse(response)))
                    .catch(reject);
            });
        }

        function postActivation(responseObj) {
            // Disable spinners
            $rootScope.scriptElement.saving = false;
            $rootScope.scriptElement.activating = false;

            // Complete the activation
            var url = responseObj.url;
            if ($window.top !== $window && $window.sforce.console.isInConsole()) {
                sforce.console.getEnclosingPrimaryTabId(function (parentTabResponse) {
                    sforce.console.getEnclosingTabId(function (response) {
                        if (response.id === parentTabResponse.id) {
                            sforce.console.openPrimaryTab(null, fixUpUrlWithParams(url), true);
                        } else {
                            sforce.console.openSubtab(parentTabResponse.id, fixUpUrlWithParams(url), true);
                        }
                        sforce.console.closeTab(response.id);
                    });
                });
            } else {
                window.location = fixUpUrlWithParams(url);
            }
        }

        /**
         * If a component exists, re-deploys the LWC in order to overwrite the "Not found" component
         */
        function processLwc(isActivate) {
            return new Promise((resolve, reject) => {

                const type = $rootScope.scriptElement.Type__c,
                    subType = $rootScope.scriptElement.SubType__c,
                    language = $rootScope.scriptElement.Language__c,
                    sId = $rootScope.scriptElement.Id,
                    addRuntimeNamespace = window.omniLwcCompilerConfig.isInsidePckg,
                    namespace = window.omniLwcCompilerConfig.namespacePrefix;

                if (isActivate) {

                    const lwcName = compilerService.getLwcName(type, subType, language);
                    bpService.loadActiveLwc(type, subType, language)
                        .then(jsonObj => compilerService.compileActivated(lwcName, jsonObj, addRuntimeNamespace, namespace))
                        .then(resources => toolingService.deployResources(lwcName, resources, sId))
                        .then(resolve)
                        .catch(error => compilerService.showDeploymentError(error, $localizable('OmniDesLwcDeployError')).then((resolve)));
                } else {

                    compilerService.deactivateLwc(type, subType, language, sId, addRuntimeNamespace, namespace)
                        .then(resolve)
                        .catch(error => {

                            // Re-activate the OS, we were not able to deploy. Notify the user that needs to verify the LWC manually.
                            executeActivation(true)
                                .finally(() => {
                                    compilerService.showDeploymentError(error, $localizable('OmniDesLwcDeactivateDeployError'))
                                        .then(resolve);
                                });
                        });
                }
            });
        }
    });

},{}],52:[function(require,module,exports){
var PaletteElement = require('../../oui/util/PaletteElement.js');
var CanvasElement = require('../../oui/util/CanvasElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module('omniscriptDesigner')
  .controller('structureCanvas', function ($rootScope, $scope, $q, remoteActions, save,
    deleteElement, $timeout, $interval, $modal, $localizable, NotSupportedElmService) {
    'use strict';

    $scope.notDispOnTmltObj = NotSupportedElmService.getList();

    $scope.onDNDDrop = function (event, index, item, external, type, allowedType, eleParent) {
      var elementBeingDragged, parent;
      var eleParentIsActionBlock = eleParent && eleParent.Type__c && eleParent.Type__c.type === 'action-block';
      // we're moving an existing element
      if (angular.isString(item)) {
        elementBeingDragged = CanvasElement.getById(item);
        if (elementBeingDragged.saving) {
          return false;
        }

        parent = elementBeingDragged.parent();
        var oldIndex = parent.children.indexOf(elementBeingDragged);
        var newParentId = $(event.currentTarget).data('elementId');
        // check we're not dropping something on to itself
        if (newParentId === item) {
          return false;
        }

        // Prevent existing actions from being dropped inside an action-block when max number of children
        // in action block >= 4 and prevent existing Set Values and Set Errors from being dragged in
        if (newParentId !== parent.Id && eleParentIsActionBlock &&
            (eleParent.children.length >= 4 || elementBeingDragged.Type__c.label === 'Set Values' ||
                elementBeingDragged.Type__c.label === 'Set Errors')) {
          return false;
        }

        if (newParentId === parent.Id) {
          // if the oldIndex is the same as the newIndex then this element was moved upwards
          // therefore we need to find a copy of it at the end of the list.
          if (oldIndex === index) {
            oldIndex = parent.children.lastIndexOf(elementBeingDragged);
            var removed = parent.children.splice(oldIndex, 1);
            if (removed.length === 0) {
              console.log('Could not delete element');
            }
            return elementBeingDragged;
          }
        }

        // if we've moved the element lower in the same parent
        // then we need to defer the removal to prevent the new element
        // being inserted in the wrong place - this is because
        // when this function returns the angular-drap-and-drop-lists
        // library will do the actual move of the element into `index`
        // but if we've removed something earlier in the list `index` will be
        // off by one.
        if (oldIndex < index && parent.Id === newParentId) {
          $timeout(function () {
            var removed = parent.children.splice(oldIndex, 1);
            if (removed.length === 0) {
              console.log('Could not delete element');
            }
          });
        } else {
          // we can't do the others in a timeout (e.g. if moving up
          // or to a different parent) because the logic causes duplicate
          // elements to appear and/or disappear completely. It's only
          // safe to do the timeout option in the same parent.
          var removed = parent.children.splice(oldIndex, 1);
          if (removed.length === 0) {
            console.log('Could not delete element');
          }
        }
        elementBeingDragged.ParentElementId__c = null;
      } else {
        // Prevent new action elements from being dropped from the palette when the number of childrens
        // in an existing action-block is >= 4. Also prevents Set Values and Set Errors from being dropped into an Action Block
        if (eleParentIsActionBlock && (eleParent.children.length >= 4 || item.label === 'Set Values' || item.label === 'Set Errors')) {
          return false;
        }
        var paletteElementBeingDragged = PaletteElement.getPaletteElement(item.label, item.scriptElement ? {
          Type: item.scriptElement.Type__c,
          'Sub Type': item.scriptElement.SubType__c,
          'Language': item.scriptElement.Language__c
        } : {}, item.scriptElement);
        elementBeingDragged = new CanvasElement(paletteElementBeingDragged);
      }
      $timeout(function () {
        // in addition any elements we've dropped it in front of
        // need their Order__c updated so we need to save them too
        var parentOfDraggedEl = elementBeingDragged.parent();
        // we'll go through all the children because if some came with an existing
        // Order__c which was using base 10 or 100 they will be completely out of place now
        // - there's logic in Save to avoid resending unchanged data which will avoid
        //   the performance hit of unnecessary requests
        for (var i = 0; i < parentOfDraggedEl.children.length; i++) {
          save(parentOfDraggedEl.children[i]);
        }

        $rootScope.$broadcast('activeElementInCanvas', elementBeingDragged);
        $scope.setDisOnTpltPrp(elementBeingDragged);
      }, 200);

      return elementBeingDragged;
    };

    var debounce = null;
    $scope.onDNDMove = function (event, index, type, external, allowedType, eleParent) {
      // prevent DnD actions from being moved inside an action-block when max number of children in action block > 4
      if (eleParent && eleParent.Type__c && eleParent.Type__c.type === 'action-block' && eleParent.children.length > 4) {
        return;
      }

      // scroll the structure panel if we need to on mouse over while dragging
      var lastMouseEvent = null;
      var config = {
        activationDistance: 30,
        scrollDistance: 50,
        scrollInterval: 250
      };

      if (debounce) {
        $timeout.cancel(debounce);
      }
      debounce = $timeout(function () {
        if (!lastMouseEvent) return;
        var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var scrollY = 0;
        if (lastMouseEvent.clientY < config.activationDistance) {
          // If the mouse is on the top of the viewport within the activation distance.
          scrollY = -config.scrollDistance;
        } else if (lastMouseEvent.clientY > viewportHeight - config.activationDistance) {
          // If the mouse is on the bottom of the viewport within the activation distance.
          scrollY = config.scrollDistance;
        }

        if (scrollY !== 0) {
          var structureCanvas = angular.element('.structureCanvas')[0];
          structureCanvas.scrollTop += scrollY;
        }
      }, 250);

      lastMouseEvent = event;
      return true; // always return true because we can always drop here
    };

    $scope.onCanvasElementClick = function (element, $event) {
      $rootScope.$broadcast('activeElementInCanvas', element);
      if ($event) {
        $event.stopPropagation();
      }
    };

    /**
     * [onCanvasCheckboxElementClick save the updated element based on updated value of disOnTplt]
     * @param  {[type]} element [checked element which is dragged element from omniscript component to Script Configuration ]
     * @param  {[type]} evnt  [event after clicking on element]
     * @return {[type]}         [None]
     */
    $scope.onCanvasCheckboxElementClick = function (element, evnt) {
      save(element);
      $rootScope.$broadcast('elementPropertyChanged');
      if (evnt) {
        evnt.stopPropagation();
      }
    };


    /**
     * [setDisOnTpltPrp Initialize checkbox model value based disOnTplt and non-supported element list]
     * @param {[type]} element [element of editBlock]
     */
    $scope.setDisOnTpltPrp = function (element) {
      if (element.PropertySet__c.disOnTplt === undefined) {
        element.PropertySet__c.disOnTplt = false;
        save(element);
        return;
      }
    };


    $scope.delete = function (element) {
      return $q(function (resolve, reject) {
        var modalScope = $scope.$new();
          modalScope.ok = function () {
            var parent = element.parent();
            deleteElement(element)
                .then(function () {
                    parent.each(function (child) {
                        save(child);
                    });
                })
                .then(function () {
                    $rootScope.$broadcast('activeElementInCanvas', element.ParentElementId__c || element.OmniScriptId__c);
                    resolve(true);
                });
        };
        return $modal({
          title: $localizable('OmniDesConfirmDeleteTitle'),
          templateUrl: 'confirmationModal.tpl.html',
          content: $localizable('OmniDesConfirmDeleteElContent'),
          scope: modalScope,
          show: true
        });
      });
    };

    $scope.clone = function (element) {
      var clone = element.clone();
      var parent = clone.parent();

      // prevent cloning of actions inside an action-block when max number of children in action block >= 4
      if (parent && parent.Type__c && parent.Type__c.type === 'action-block' && parent.children.length >= 4) {
          return;
      }

      parent.children.splice(parent.children.indexOf(element) + 1, 0, clone);
      // we'll go through all the children because if some came with an existing
      // Order__c which was using base 10 or 100 they will be completely out of place now
      // - there's logic in Save to avoid resending unchanged data which will avoid
      //   the performance hit of unnecessary requests
      var promises = [];
      for (var i = 0; i < parent.children.length; i++) {
        promises.push(save(parent.children[i]));
      }
      $q.all(promises).then(function () {
        $rootScope.$broadcast('activeElementInCanvas', clone);
      });
    };

    $rootScope.$on('activeElementInCanvas', function (event, args) {
      if (angular.isString(args)) {
        $scope.activeElement = CanvasElement.getById(args);
      } else {
        $scope.activeElement = args;
      }
      if (!$scope.activeElement) {
        $scope.activeElement = $rootScope.scriptElement;
      }
    });

    var getNextColor = (function () {
      var colors = ['pink', 'orange', '#008ab3', '#f65327', '#05a6df', '#eac438', '#58a300'];
      var index = 0,
        mapOfKeysToColor = {};
      return function (key) {
        if (!mapOfKeysToColor[key]) {
          if (index === colors.length) {
            index = 0;
          }
          mapOfKeysToColor[key] = colors[index++];
        }
        return mapOfKeysToColor[key];
      };
    })();

    function compileShowGroup(group, element) {
      var evalString = ['('],
        evalStringIfUndefined = ['('];
      var colorMap = $scope.popover.controllingElementsColors;
      for (var i = 0; i < group.rules.length; i++) {
        if (i > 0) {
          if (group.rules[i].group || group.rules[i].field) {
            evalString.push(group.operator === 'AND' ? '&&\n' : '||\n');
          }
          if (group.rules[i].field) {
            evalStringIfUndefined.push(group.operator === 'AND' ? '&&\n' : '||\n');
          }
        }
        if (group.rules[i].group) {
          evalString.push(compileShowGroup(group.rules[i].group, element));
        } else if (group.rules[i].field) {
          var fieldName = group.rules[i].field.split('|')[0];
          var key = '$scope[\'' + fieldName + '\']',
            nextColor = getNextColor(fieldName);
          if (colorMap[fieldName]) {
            if (colorMap[fieldName].indexOf(nextColor) < 0) {
              colorMap[fieldName].push(nextColor);
            }
            if (!colorMap[element.Name]) {
              colorMap[element.Name] = [nextColor];
            } else if (colorMap[element.Name].indexOf(nextColor) < 0) {
              colorMap[element.Name].push(nextColor);
            }
            evalString.push(key);
            var condition = group.rules[i].condition;
            evalStringIfUndefined.push(key + ' != undefined');
            evalString.push(condition === '=' ? '==' : (condition === '<>' ? '!=' : condition));
            evalString.push('\'' + group.rules[i].data + '\'');
          }
        }
      }
      evalString.push(')');
      evalStringIfUndefined.push(')');
      if (evalStringIfUndefined.length < 3) {
        return evalString.join(' ');
      }
      return '(' + evalString.join(' ') + '&&' + evalStringIfUndefined.join(' ') + ')';
    }

    function compileShow(element) {
      if (element.PropertySet__c && element.PropertySet__c.show) {
        var evalString = compileShowGroup(element.PropertySet__c.show.group, element);
        evalString = evalString.replace(/(\|\||\&\&)*\s*\(\s*\)/g, '');
        if (!/^(\(\s*\)|\(\(\s*\)(\|\|\(\s*\))*\)|)$/.test(evalString)) {
          /*jshint evil:true */
          try {
            return new Function('$scope', 'return ' + evalString + ';');
          } catch (e) {
            console.log('Could not compile show rules into function', e,
              'function($scope) {\n\treturn ' + evalString + ';\n}');
          }
        }
      }
      return function () {
        return true;
      };
    }

    function evaluateShowRules(rules) {
      var scope = {},
        noRules = true;
      for (var i = 0; i < rules.length; i++) {
        if (rules[i].element) {
          noRules = false;
          scope[rules[i].element] = rules[i].value;
        }
      }
      if ($rootScope.scriptElement) {
        Object.keys($scope.popover.controllingElementsColors).forEach(function (key) {
          $scope.popover.controllingElementsColors[key] = [];
        });
        // filter the Structure Element and it's children to hide filtered out rules
        $rootScope.scriptElement.each(function (element) {
          if (element instanceof CanvasElement) {
            if (noRules) {
              element.filter = false;
              compileShow(element)(scope);
              if (angular.isObject(element.collapse) && element.collapse.automated) {
                element.collapse = false;
              }
            } else {
              var dontCollapseAgain = false;
              if (element.filter === true) {
                dontCollapseAgain = true;
              }
              element.filter = !compileShow(element)(scope);
              if (element.filter === true && !dontCollapseAgain) {
                element.collapse = {
                  automated: true
                };
              } else if (angular.isObject(element.collapse) && element.collapse.automated) {
                element.collapse = false;
              }
            }
          }
        });
      }
    }

    $scope.$watch('popover.rules', evaluateShowRules, true);

    $rootScope.$on('elementPropertyChanged', function (event, args) {
      $scope.popover.controllingEntities();
      evaluateShowRules($scope.popover.rules);
    });

    $scope.popover = {
      rules: [{
        element: null,
        value: ''
      }],
      controllingElementsColors: {},
      addRule: function () {
        $scope.popover.rules.push({
          element: null,
          value: ''
        });
      },
      clear: function () {
        $scope.popover.rules = [{
          element: null,
          value: ''
        }];
      },
      deleteRule: function (rule) {
        var indexToRemove = $scope.popover.rules.indexOf(rule);
        $scope.popover.rules.splice(indexToRemove, 1);
        if ($scope.popover.rules.length === 0) {
          $scope.popover.clear();
        }
      },
      controllingEntities: function () {
        function getAllEntitiesForGroup(group) {
          var names = [];
          if (group.rules) {
            for (var i = 0; i < group.rules.length; i++) {
              if (group.rules[i].group) {
                names = names.concat(getAllEntitiesForGroup(group.rules[i].group));
              }
              if (group.rules[i].field) {
                names.push(group.rules[i].field.split('|')[0]);
              }
            }
          }
          return names;
        }

        function getAllNamesForElement(element) {
          var controllingEntityNames = element.PropertySet__c &&
            element.PropertySet__c.show ? getAllEntitiesForGroup(element.PropertySet__c.show.group) : [];
          var children = element.children;
          for (var i = 0; i < children.length; i++) {
            controllingEntityNames = controllingEntityNames.concat(getAllNamesForElement(children[i]));
          }
          return controllingEntityNames;
        }
        var allNames = getAllNamesForElement($rootScope.scriptElement);

        for (var i = 0; i < allNames.length; i++) {
          var nextColor = getNextColor(allNames[i]);
          if (!$scope.popover.controllingElementsColors[allNames[i]]) {
            $scope.popover.controllingElementsColors[allNames[i]] = [nextColor];
          } else if ($scope.popover.controllingElementsColors[allNames[i]].indexOf(nextColor) < 0) {
            $scope.popover.controllingElementsColors[allNames[i]].push(nextColor);
          }
          var existingIndex = allNames.indexOf(allNames[i]);
          if (existingIndex !== i && existingIndex > -1) {
            allNames.splice(i--, 1);
          }
        }
        return allNames;
      }
    };

    $scope.collapseAll = function () {
      $rootScope.scriptElement.each(function (element) {
        element.collapse = true;
      });
    };

    $scope.expandAll = function () {
      $rootScope.scriptElement.each(function (element) {
        element.collapse = false;
      });
    };

    $scope.allExpanded = function () {
      var allExpanded = true;
      if ($rootScope.scriptElement) {
        $rootScope.scriptElement.each(function (element) {
          if (element.collapse) {
            allExpanded = false;
          }
        });
      }
      return allExpanded;
    };

  });

},{"../../oui/util/CanvasElement.js":91,"../../oui/util/PaletteElement.js":93,"../../oui/util/ScriptElement.js":94}],53:[function(require,module,exports){
angular.module('omniscriptDesigner')
    .controller('intProcedureTabbedController', function($rootScope, $scope, $localizable) {
        'use strict';

        $scope.tabs = [{title:$localizable('OmniDesTabProperties'), content: ''}];
        $scope.tabs.activeTab = 0;

        $scope.$watch(function() {
            return $scope.tabs.activeTab;
        }, function(newValue, oldValue) {
            if (newValue === 1 && $rootScope.scriptElement.Id) {
                $rootScope.collapsePalette = $rootScope.fullScreen = true;
            } else {
                $rootScope.collapsePalette = $rootScope.fullScreen = false;
            }
        });

        $rootScope.$on('activeElementInCanvas', function(event, element, skipTabChange) {
            if ($scope.tabs.activeTab !== 0 && !skipTabChange) {
                $scope.tabs.activeTab = 0;
            }
        });

        $scope.$watch('scriptElement.Id', function(id) {
            if (id && $scope.tabs.length < 2) {
                $scope.tabs.push({
                    title: $localizable('OmniDesTabPreview'),
                    content: ''
                });
            }
        });

    });

},{}],54:[function(require,module,exports){
angular.module("omniscriptDesigner")
.directive('input', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (attrs.type.toLowerCase() !== 'number') {
                return;
            } //only augment number input!
            ctrl.$formatters.push(function (value) {
                return !isNaN(value) ? parseFloat(value) : null;
            });
        }
    };
});
},{}],55:[function(require,module,exports){
angular.module("omniscriptDesigner")
.directive("paletteGroup", function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      group: "=elements",
      grouptitle: "=",
      expanded: '=?'
    },
    templateUrl: 'paleteElementGroup.tpl.html',
    link: function($scope) {
      $scope.model = {
        expand: $scope.expanded == true
      };
    }
  };
});
},{}],56:[function(require,module,exports){
angular.module("omniscriptDesigner")
.directive("preventDeleteBack", function($window){
    return function (scope, element, attrs) {
      /*
       * this swallows backspace keys on any non-input element.
       * stops backspace -> back
       */
      var rx = /INPUT|SELECT|TEXTAREA/i;

      angular.element(document).bind("keydown keypress", function(e){
        if( e.which == 8 ){ // 8 == backspace
          if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
            e.preventDefault();
          }
        }
      });
    };
  });
},{}],57:[function(require,module,exports){
angular.module("omniscriptDesigner")
.directive("viaAffix", function($window){
    if ($window.parent && $window.parent !== $window) {
      return {};
    }
    return function (scope, element, attrs) {
      var stickyTop = $(element).offset().top; 
      $(window).scroll(function() {
        var windowTop = $(window).scrollTop();
        if (stickyTop < windowTop) {
          $(element).parent().height($(window).height());
          $(element).css({ position: 'fixed', top: 0, width: "calc(100% - 20px)" });
          $(element).addClass("viaAffix");
        } else {
          $(element).removeClass("viaAffix");
          $(element).css({'position':'static', width: '100%'});
        }
      });
    };
  });
},{}],58:[function(require,module,exports){
angular.module('omniscriptDesigner')
    .directive('intProcedurePreviewPanel', function($q, $location, remoteActions) {
        'use strict';
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                jsonParams: '=initialJson',
                omniscript: '=',
            },
            bindToController: true,
            templateUrl: 'previewIntProcedure.tpl.html',
            controllerAs: 'vm',
            controller: function($rootScope, $scope, remoteActions, vkbeautify) {
                var vm = this;

                this.jsonMode = false;                    
                this.requesting = false;
                this.hostPrefix = $location.protocol() + '://' + $location.host();
                this.serviceUrl = this.hostPrefix + this.url;

                this.toggleJsonMode = toggleJsonMode;
                this.submitRequest = submitRequest;
                this.addParam = addParam;
                this.deleteParam = deleteParam;
                this.reset = reset;
                this.toggleAccordian = toggleAccordian;
                this.getDebugType = getDebugType;
                this.currentSection = 'debug';
                this.optionsJson = '{"isDebug":true, "chainable":false, "resetCache":false, "ignoreCache":true, "queueableChainable":false, "useQueueableApexRemoting":false}';
                this.isDebug = true;

                // public functions
                function toggleJsonMode() {
                    vm.jsonMode = !vm.jsonMode;
                    if (vm.jsonMode) {
                        if (vm.params) {
                            vm.jsonParams = JSON.stringify(vm.params.reduce(function(obj, param) {
                                obj[param.key] = param.value;
                                return obj;
                            }, {}), null, 4);
                        }
                    } else {
                        var params = JSON.parse(vm.jsonParams);
                        vm.params = Object.keys(params).reduce(function(arr, key) {
                            arr.push({key: key, value: params[key]});
                            return arr;
                        }, []);
                        vm.invalidJSON = false;
                    }
                }

                var unwatch = $scope.$watch('vm.omniscript', function(omni) {
                    if (omni && !vm.jsonParams) {
                        vm.jsonParams = '{}';
                        unwatch();
                    }
                });

                $scope.$watch('vm.jsonParams', function(json) {
                    try {
                        JSON.parse(vm.jsonParams);
                        if (!vm.params) {
                            var params;
                            if (vm.jsonParams) {
                                params = JSON.parse(vm.jsonParams);
                            }
                            vm.params = Object.keys(params).reduce(function(arr, key) {
                                arr.push({key: key, value: params[key]});
                                return arr;
                            }, []);
                        }
                        vm.invalidJSON = false;
                    } catch (e) {
                        vm.invalidJSON = true;
                    }
                });

                $scope.$watch('vm.params', function(params) {
                    if (vm.omniscript && vm.omniscript.Id) {
                        vm.jsonParams = JSON.stringify(vm.params.reduce(function(obj, param) {
                            obj[param.key] = param.value;
                            return obj;
                        }, {}), null, 4);
                    }
                }, true);

                $scope.$watch('vm.optionsJson', function(optionsJson) {
                    try {
                        JSON.parse(vm.optionsJson);

                        var options;

                        if (vm.optionsJson) {
                            options = JSON.parse(vm.optionsJson);
                        }

                        vm.inputOptions = Object.keys(options).reduce(function(obj, key) {
                            obj[key] = options[key];
                            return obj;
                        }, {});

                        vm.isDebug = vm.inputOptions.isDebug;
                        vm.validJson = true;
                    } catch (e) {
                        vm.validJson = false;
                    }
                 });

                function reset() {
                    vm.params = [];
                }

                function addParam() {
                    vm.params.push({key:'',value:''});
                }

                function deleteParam(param) {
                    vm.params.forEach(function(param_, i) {
                        if (param_ == param) {
                            vm.params.splice(i, 1);
                        }
                    });
                }

                function runChainable(response) {
                    var options = {
                        'vlcIPData' : response.vlcIPData,
                        'isDebug' : vm.inputOptions.isDebug
                    };

                    submitRequest(options);
                }

                function responseHandler(response) {
                    if (typeof(response) === 'string') {
                        response = JSON.parse(response);
                    }

                    if (response
                     && response.vlcIPData
                     && response.vlcStatus === 'InProgress') {
                        runChainable(response);
                    } else {
                        vm.requesting = false;
                        vm.elapsedTimeActual = response.elapsedTimeActual;
                        vm.elapsedTimeCPU = response.elapsedTimeCPU;
                        vm.vlcCacheResult = !!response.vlcCacheResult;

                        if (response.response) {
                           vm.response.returnResultsData = response.response;
                        } else if (response && !vm.isDebug) {
                            vm.response.returnResultsData = response;
                        } else if (response && response.responseText) {
                            vm.response.errors = JSON.parse(response.responseText);
                        } else {
                            vm.response.errors = [response || 'Request Failed'];
                        }
                
                        vm.outputDropdown = [{
                                name: 'Debug Response Full',
                                response: response
                            },
                            {
                                name: 'Debug Log',
                                response: response.debugLog
                            },
                            {
                                name: 'Full DataJSON',
                                response: response.fullDataJson
                            },
                            {
                                name: 'Response',
                                response: response.response
                            },
                            {
                                name: 'Original Input',
                                response: response.originalInput
                            },
                            {
                                name: 'Execution Sequence',
                                response: response.executionSequence
                            }
                        ];

                        (response.executionSequence || []).forEach(function(key) {
                            if (response[key] !== null) {
                                var language = getDebugType(response[key]);
                                var config = {
                                    name: key,
                                    response: response[key],
                                    language: language
                                };
                                if (language === 'xml') {
                                    config.response = vkbeautify.xml(config.response);
                                }

                                vm.outputDropdown.push(config);

                                if (response[key + 'Debug']) {
                                    vm.outputDropdown.push({
                                        name: key + 'Debug',
                                        response: response[key + 'Debug'],
                                        language: 'json'
                                    });
                                }
                                
                            }
                        });                

                        vm.selectedOption = vm.outputDropdown[0];
                    }
                }

                function submitRequest(options) {
                    vm.requesting = true;
                    var startTime = Date.now();
                    vm.response = {};
                    vm.response.errors = [];
                    vm.response.debugLog = {};
                    vm.outputDropdown = [];
                    var vlcResponse = {};
                    var timeoutIsSet = false;

                    if (!options) {
                        options = vm.inputOptions;
                    }

                    remoteActions.testIntegrationProcedure(vm.omniscript.Id, vm.jsonParams, options).then(function(response) {
                        if (typeof(response) === 'string') {
                            vlcResponse = JSON.parse(response);
                        }

                        if (vlcResponse
                            && vlcResponse.vlcIPData
                            && vlcResponse.vlcStatus === 'InProgress'
                            && vlcResponse.vlcAsync)
                        {
                            timeoutIsSet = true;

                            setTimeout(function() 
                            {
                                timeoutIsSet = false;
                                responseHandler(response);
                            }, 5000);
                        }
                        else
                        {
                            responseHandler(response);
                        }
                    })
                    .catch(function(response) {
                        if (response.responseText) {
                            vm.response.errors = JSON.parse(response.responseText);
                        } else if (response.message) {
                            vm.response.errors = [ response.message, response ];
                        } else {
                            vm.response.errors = [response || 'Request Failed'];
                        }
                    })
                    .finally(function() {
                        if (!timeoutIsSet)
                        {
                            vm.requesting = false;

                            if (vlcResponse.vlcIPData && vlcResponse.vlcStatus == 'InProgress') {
                                vm.requesting = true;
                            }
                            
                            var doneTime = Date.now();
                            vm.requestTime = doneTime - startTime;
                            vm.sidebarOpen = true;
                            if (!_.isEmpty(vm.response.errors)) {
                                if (!angular.isArray(vm.response.errors)) {
                                    vm.response.errors = [vm.response.errors];
                                }
                                vm.response.errors = vm.response.errors.map(function(error) {
                                    return error.errorCode ? error.errorCode + ' - ' + error.message : error;
                                });
                                vm.currentSection = 'errors';
                            } else {
                                vm.currentSection = 'debug';
                            }
                        }
                    })
                }

                function toggleAccordian(openIfClosed, openIfOpen) {
                    if (vm.currentSection === openIfClosed) {
                        vm.currentSection = openIfOpen;
                    } else {
                        vm.currentSection = openIfClosed;
                    }
                }

                function getDebugType(data) {
                    if (angular.isString(data)) {
                        try {
                            JSON.parse(data);
                            return 'json';
                        } catch (e) {}
                        try {
                            if (window.DOMParser)
                            {
                                var parser = new DOMParser();
                                parser.parseFromString(data,"text/xml");
                                return 'xml';
                            } else { // Internet Explorer
                                var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                                xmlDoc.async = "false";
                                xmlDoc.loadXML(data);
                                return 'xml';
                            }
                        } catch (e) {}
                        return 'yaml';
                    }
                    return 'json';
                }
            }

        };
    });

},{}],59:[function(require,module,exports){
(function(){
    'use strict';
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('enableLogging', ['tObjectFactory', function(tObjectFactory){
        return{
            restrict: 'A',
            link: function(scope, element, attrs){
                element.on('click', function() {
                    scope.$apply(function() {
                        tObjectFactory.visible = !tObjectFactory.visible;
                    });
                });
            }
        };
    }]);
    
}());

},{}],60:[function(require,module,exports){
// https://github.com/fmquaglia/ngOrderObjectBy
'use strict';
(
  function(angular) {
    return angular
      .module('ngOrderObjectBy', [])
      .filter('orderObjectBy', function() {
        return function (items, field, reverse) {

          function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
          }
          
          var filtered = [];

          angular.forEach(items, function(item, key) {
            if (angular.isString(item)) {
                item = {
                    key: key,
                    value: item
                };
            } else {
                item.key = key;
            }      
            filtered.push(item);
          });

          function index(obj, i) {
            return obj[i];
          }

          filtered.sort(function (a, b) {
            var comparator;
            var reducedA = field.split('.').reduce(index, a);
            var reducedB = field.split('.').reduce(index, b);

            if (isNumeric(reducedA) && isNumeric(reducedB)) {
              reducedA = Number(reducedA);
              reducedB = Number(reducedB);
            } else if (angular.isString(reducedA) && angular.isString(reducedB)) {
                reducedA = reducedA.toLowerCase();
                reducedB = reducedB.toLowerCase();
            }

            if (reducedA === reducedB) {
              comparator = 0;
            } else {
              comparator = reducedA > reducedB ? 1 : -1;
            }

            return comparator;
          });

          if (reverse) {
            filtered.reverse();
          }

          return filtered;
        };
      });
  }
)(angular);
},{}],61:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .directive('showHideRule', ShowHideRuleDirective);

    ShowHideRuleDirective.$inject = [];
    function ShowHideRuleDirective() {
        var directive = {
            bindToController: true,
            controller: ShowHideRuleController,
            controllerAs: 'vm',
            restrict: 'A',
            replace: true,
            templateUrl: 'show-rule-property-template.tpl.html',
            scope: {
                rule: '=',
                isDisabled: '=',
                rootRule: '=?',
                parent: '=?',
                elementNames: '='
            }
        };
        return directive;
    }
    
    ShowHideRuleController.$inject = ['$localizable'];
    function ShowHideRuleController ($localizable) {
        var vm = this;

        vm.operators = [{
            value: 'AND',
            label: $localizable('OmniDesAnd')
        }, {
            value: 'OR',
            label: $localizable('OmniDesOr')
        }];

        vm.conditions = [{
            value: '=',
            label: $localizable('OmniDesIsEqualTo')
        }, {
            value: '<>',
            label: $localizable('OmniDesDoesNotEqual')
        }, {
            value: '<',
            label: $localizable('OmniDesIsLessThan')
        }, {
            value: '>',
            label: $localizable('OmniDesIsGreaterThan')
        }, {
            value: '<=',
            label: $localizable('OmniDesIsLessThanEqual')
        }, {
            value: '>=',
            label: $localizable('OmniDesIsGreaterThanEqual')
        }];

        
        vm.addCondition = function (group) {
            group.rules.push({
                'condition': '=',
                'field': null,
                'data': null
            });
        };

        vm.addGroup = function (group) {
            group.rules.push({
                'group': {
                    operator: 'AND',
                    'rules': [{
                        'condition': '=',
                        'field': null,
                        'data': null
                    }]
                }
            });
        };

        vm.deleteRule = function (rule) {
            var resolvedRuleSet = (vm.parent.rule ? vm.parent.rule.group.rules :  vm.parent.group.rules);
            for (var i = 0; i < resolvedRuleSet.length; i++) {
                if (resolvedRuleSet[i] === rule) {
                    resolvedRuleSet.splice(i, 1);
                    return;
                } else if (resolvedRuleSet[i].group) {
                    vm.deleteRule(rule, resolvedRuleSet[i].group.rules);
                }
            }
        };

        vm.deleteGroup = function (group) {
            vm.deleteRule(group);
        };

    }
})();
},{}],62:[function(require,module,exports){
(function(){
    /*jshint -W030 */
    'use strict';
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcDebugJsonTreeView', ['$compile', 'tObjectFactory', function($compile, tObjectFactory){
        return {
            restrict: 'E',
            scope:{
                jsonData: '=',
            },
            transclude: true,
            controller: function($scope, $element) {
                $scope.clear = function() {
                    tObjectFactory.clearTObjects();
                    $scope.jsonData = tObjectFactory.tObjects();
                };
                
                $scope.tPanel = function(tObject, flag) {
                    if (flag) {
                        tObject.visible = !tObject.visible;
                    }
                };

                //close the debug panel based on this switch
                $scope.toggleVisibility = function() {
                    tObjectFactory.visible = false;
                    $scope.$broadcast('eScroll'); //OMNI-2176
                };

                $scope.getClass = function(tObject) {
                    if (tObject.visible) {
                        return 'spreadOut';
                    }else {
                        return '';
                    }
                };

                //property on scope displays the prop based on the json object
                $scope.display = function(key) {
                    if(key === 'stage' || key === 'visible' || key === 'created' || key === 'name') {
                        return false;
                    }
                    return true;
                };

                //pre formatting the json 
                $scope.beautify = function(value,innerObject){
                    if (!innerObject.oneLineItem){
                        return '<pre>' + angular.toJson(value, true) + '</pre>';
                    }else{
                        return angular.toJson(value); 
                    }
                };
            },
            template: //comment
            '<div class="vlc-debug-panel modal-content" ng-if=visible vlc-modal-draggable vlc-bubble-canceller>'+
                '<div class="hexpand" vlc-expand-collapse prop="width"></div>'+
                '<div class="modal-header">'+
                '  <button type="button" class="close" aria-label="Close" ng-click="toggleVisibility()">'+
                '    X'+
                '  </button>'+
                '  <h4 class="modal-title vlc-debug-console-header"><strong>Omniscript Debug Console</strong></h4>'+
                '  <div class="vlc-debug-controls">'+
                '    <input type="text" class="form-control" ng-model="input.search" placeholder="Search"/>'+
                '  </div>'+
                '</div>'+
                '<div class="modal-body">'+
                '    <ul class="debug-object-list">' +
                '      <li ng-repeat="tObject in jsonData | filter:{name:input.search}" ng-click="tPanel(tObject,true)" ng-class="getClass(tObject)">'+
                '        <strong>{{tObject.name}}</strong>( {{tObject.stage}}{{tObject.created | date:"yyyy-MM-dd HH:mm:ss Z"}} )'+
                '        <button style="background:none;padding:0;margin:0" class="btn" vlc-clipboard="{}" vlc-clipboard-value="tObject">'+
                '        <span style="position:relative;top: -1px" class="glyphicon icon-v-copy" aria-hidden="true"></span>'+
                '        </button>'+
                '        <ul ng-show="tObject.visible" class="sublist">'+
                '          <li ng-repeat="(key,value) in tObject" ng-if="display(key)" vlc-collapsible>'+
                '            <strong>{{key}}</strong>'+
                '            <button ng-hide="innerObject.oneLineItem" obj=innerObject style="background:none;padding:0;margin:0" class="btn"'+
                '              vlc-clipboard="{}" vlc-clipboard-value="value">'+
                '              <span style="position:relative;top: -1px" class="glyphicon icon-v-copy" aria-hidden="true"></span>'+
                '            </button>'+
                '            <div ng-class=innerObject.oneLineItem?"li-flat":"" ng-show="innerObject.visible" class="sublist">'+
                '              <span vlc-bubble-canceller click="true" ng-bind-html="beautify(value, innerObject)"></span>'+ 
                '            </div>'+
                '          </li>'+
                '        </ul>'+
                '      </li>'+
                '    </ul>'+
                '</div>'+
                '<div class="modal-footer">'+
                '  <button ng-click="clear()" class="btn btn-default">Clear</button>' +
                '  <div class="expand" vlc-expand-collapse="" classes="vlc-debug-panel, modal-body" prop="min-height">'+
                '  </div>'+
                '</div>'+
                '</div>', //div ends for modal content
                compile: function(element, attrs, transclude){
                    var contents = element.contents().remove();
                    var compiledContents;
                    
                    return function(scope, iElement, iAttrs){
                        scope.visible = tObjectFactory.visible;
                        
                        //this watch toggles  the modal window
                        scope.$watch(function(){
                            return tObjectFactory.visible;
                        },function(newValue, oldValue){
                            if (newValue !== oldValue){
                                scope.visible = tObjectFactory.visible;
                            }
                        });

                        //puts the objects into the queue - would only work in ie 9 and above 
                        window.addEventListener && (function(){
                            window.addEventListener('message', function(event){
                                try {
                                    tObjectFactory.createNetTransObject(angular.fromJson(event.data));
                                    //view only needs to be updated if the console is up
                                    if (scope.visible){
                                        scope.$apply(); //will fire the watchers on the updated flag
                                    }
                                } catch (e) {
                                    // swallow unparsable data
                                }
                            }, false);
                        }());

                        //preveent scroll bubbling
                        /*angular.element(iElement).bind('mouseenter', function(e){
                            angular.element('body').addClass('noScroll');
                        });

                        angular.element(iElement).bind('mouseleave', function(e){
                            angular.element('body').removeClass('noScroll');
                        });*/

                        //watches the queue to repaint the tree
                        scope.$watch(function(){
                            return tObjectFactory.factoryUpdated();
                        },function(newValue, oldValue){
                            scope.jsonData = tObjectFactory.tObjects();
                        });
                        
                        if(!compiledContents) {
                            compiledContents = $compile(contents, transclude);
                        }
                        compiledContents(scope, function(clone, scope) {
                            iElement.append(clone); 
                        });
                    };

                }
        };

    }]);
}());

},{}],63:[function(require,module,exports){
(function(){
    'use strict';
    /*the purpose of this directive is to cancel the bubbling of scrolling events
      this could be extended for other events in the future by passing attributes*/
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcBubbleCanceller', function(){
        return {
            restrict: 'A',
            scope:false,
            link: function(scope, elem, attrs){

                if (attrs.click){
                    elem.bind('click', function(e){
                        return false;
                    });
                    elem.bind('mouseenter', function(e){
                        return false;
                    });
                    return;
                }
                //preveent scroll bubbling
                angular.element(elem).bind('mouseenter', function(e){
                    angular.element('body').addClass('noScroll');
                });

                angular.element(elem).bind('mouseleave', function(e){
                    angular.element('body').removeClass('noScroll');
                });

                //OMNI-2176
                scope.$on('eScroll', function(){
                     angular.element('body').removeClass('noScroll');
                });

            }
        };
    });
}());

},{}],64:[function(require,module,exports){
(function(){
    /*the purpose of this directive is to drag elements with position fixed across the screen
      dnd draggable requires the position to be relative */
    'use strict';
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcModalDraggable', ['$compile', '$document', function($compile, $document){
        return {
            restrict: 'A',
            scope:false,
            link: function(scope, elem){
                var startX, startY, x, y;
                var width = elem[0].offsetWidth;
                var height = elem[0].offsetHeight;
                var header = elem.find('.modal-header');
                header.on('mousedown', function(e){
                    startX = e.clientX - elem[0].offsetLeft;
                    startY = e.clientY - elem[0].offsetTop;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);

                });

                // Handle drag event
                function mousemove(e) {
                    y = e.clientY - startY;
                    x = e.clientX - startX;
                    setPosition();
                }

                // Unbind drag events
                function mouseup(e) {
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }

                function setPosition(){
                    elem.css({
                        top: y + 'px',
                        left:  x + 'px'
                    });
                }
                
            }
        };
    }]);
}());

},{}],65:[function(require,module,exports){
(function(){
    /*jshint -W030 */
    'use strict';
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcExpandCollapse', ['$document', 'tObjectFactory', function($document, tObjectFactory){
        var startX, startY, x, deltaX;
        return {
            restrict:'A',
            scope:'false',
            link: function(scope, element, attrs){
                element.bind('mousedown', function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });

                function mousemove($event) {

                    //whenever there is a mouse down event deactivate the iframe
                    $('.iframe-holder').css({
                        'opacity': 0.3,//
                        'z-index':-1
                    });
                    
                    if (attrs.prop === 'width'){
                        //calculates  the start X and Y and calculates
                        //the dist travelled by the mouse and adds to the width
                        x = $event.pageX;
                        startX = element.offset().left;
                        startX = parseInt(startX);
                        deltaX = x  - startX;
                        var top = element.parent();
                    
                        top.css({
                            'width': parseInt(top.css('width')) + deltaX + 'px'
                        });
                        
                    }else{
                        //calculates the height of parent div - vlc-debug-modal
                        //cals mouse position , then dist moved by the mouse and adds it to the initial height
                        //diagonal drag

                        x = $event.pageX;
                        startX = element.offset().left;
                        startX = parseInt(startX);
                        deltaX = x  - startX;
                        
                        var y = $event.pageY;
                        startY = element.offset().top;
                        startY = parseInt(startY); //
                        var delta = y - startY;
                        var topP = element.parent().parent();
                        topP.css({
                            'width': parseInt(topP.css('width')) + deltaX + 'px',
                            'height': parseInt(topP.css('height')) + delta + 'px'
                        });

                        //120 is the min height of the parent div
                        var mBody = element.parent().parent().find('.modal-body');
                        mBody.css({
                            'height': parseInt(topP.css('height')) - 120 + 'px'
                        });
                    } 
                }

                function mouseup($event){
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);

                    //whenever there is a mouse down event deactivate the iframe
                    $('.iframe-holder').css({
                        'opacity': 'initial',
                        'z-index':'auto'
                    });
                    
                }

            }
        };
    }]);
}());

},{}],66:[function(require,module,exports){
(function(){
    'use strict';
    var Clipboard = window.Clipboard;

    
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcClipboard', function() {
        console.log('inside the clipboard directive');
        return {
            restrict: 'A',
            scope:{
                vlcClipboardValue: '='
            },
            controller: function($scope){
                $scope.select  = function(element){
                    if (Clipboard.selectedElement){ //this stores the previous selection
                        Clipboard.selectedElement.nextElementSibling.firstElementChild.style = '';
                    }
                    element.nextElementSibling.firstElementChild.style = 'background:#dedede';
                    Clipboard.selectedElement = element;
                };
            },
            link: function(scope, element, attr, ctrl) {
                var clipboard = new Clipboard(element[0], {
                    text: function(trigger) {
                        return '' + JSON.stringify(scope.vlcClipboardValue);
                    }
                });
                var btn = angular.element;

                //this will make click event not bubbble thereby not toggling the sublist
                element.bind('click', function(){
                    return false;
                });

                clipboard.on('success', function(e) {
                    var elem = e.trigger;
                    scope.select(elem);
                    

                    /* this is for the tooltip to show up on the right */
                    $(elem).addClass('tooltipped tooltipped-e');
                    elem.setAttribute('aria-label', 'copied to clipboard');
                    
                    $(elem).on('mouseleave', function(e) {
                        $(elem).removeClass('tooltipped tooltipped-e');
                        elem.removeAttribute('aria-label');
                    });

                    console.log('copy success');
                });

                clipboard.on('error', function(e) {
                    var payloadCharLimit = 200000;

                    // This will notify user that the clipboard errored due too large of a data load
                    if (JSON.stringify(scope.vlcClipboardValue).length > payloadCharLimit) {
                        var elem = e.trigger;
                        scope.select(elem);
                        
                        /* this is for the tooltip to show up on the right */
                        $(elem).addClass('tooltipped tooltipped-e');
                        elem.setAttribute('aria-label', 'copy error - payload too large\nplease manually copy');
                        
                        $(elem).on('mouseleave', function(e) {
                            $(elem).removeClass('tooltipped tooltipped-e');
                            elem.removeAttribute('aria-label');
                        });
                    }

                    console.log('copy error');
                });

            }
        };
    });
    
}());

},{}],67:[function(require,module,exports){
(function() {
    'use strict';
    var dModule = angular.module('omniscriptDesigner');
    dModule.directive('vlcCollapsible', ['$compile', function($compile) {
        var keys = ['remoteClass', 'remoteMethod', 'apexRestPath' ,
                    'apexRestMethod','extRestUrl', 'httpVerb']; 
        // these keys will not toggle should refactor them to be attributes
        return {
            restrict: 'A',
            scope:false,
            link: function($scope, element, attr) {
                //new comment which is added
                element.addClass('collapsible');
                $scope.innerObject = {};

                if (keys.indexOf($scope.key || '') !== -1) {
                    //disable the toggle behaviour
                    $scope.innerObject.visible = true;
                    $scope.innerObject.oneLineItem = true;
                    element.bind('click', function(event) {
                        if (!event.spanClicked) {
                            event.stopPropagation();
                        }
                    });
                    return;
                }

                element.bind('click', function(event) {
                    if (!event.spanClicked) {
                        element.toggleClass('spreadOut');
                        event.stopPropagation();
                        $scope.$apply();
                    }
                });

                $scope.$watch(function() {
                    return /spreadOut/.test(element.attr('class'));
                }, function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $scope.innerObject.toggle(); // new o
                    }
                });

                $scope.innerObject.visible =  false;
                $scope.innerObject.toggle =  function() {
                    $scope.innerObject.visible = !$scope.innerObject.visible;
                };
            }
        };
    }]);
}());

},{}],68:[function(require,module,exports){
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module("omniscriptDesigner")
.factory('deleteElement', function($q, remoteActions, $rootScope) {
  return function deleteVisitor(element) {
    if ($rootScope.scriptElement.IsActive__c) {
      return $q(function(resolve, reject){
        reject();
      });
    }
    element.deleting = true;
    element.setSaving();
    $rootScope.$broadcast("delete", element);

    var allPromises = [];
    if (element.children.length > 0) {
      for (var i = 0; i < element.children.length; i++) {
        allPromises.push(deleteVisitor(element.children[i]));
      }
    }

    if (allPromises.length === 0) {
      allPromises.push($q.when(true));
    }
    return $q.all(allPromises).then(function() {
      return remoteActions.deleteElement(element.Id);
    }).then(function(result) {
      element.saving = false;
      if (angular.isArray(result) && (result.length === 0 || result[0].success))  {
        $rootScope.$broadcast("deleted", element);
        element.deleting = true;
        element.delete();
      } else {
        element.setErrors(result.errors);
      }
      return element;
    });
  };
});
},{"../../oui/util/ScriptElement.js":94}],69:[function(require,module,exports){
(function() {
    'use strict';
    angular.module('omniscriptDesigner')
        .factory('interTabMsgBus', function($q, $rootScope) {
            var listeners = {};
            var tabKey = Date.now().toString();
            var keysAdded = [];
            var objKeys = []; //adding the custom view layout

            //$(window).on('storage', handleStorageEvent);
            $(window).on('beforeunload', emptySessionStorage);
            $(window).on('message', handlePostMessageEvent);

            function handleStorageEvent(e) {
                e = e.originalEvent;
                var keyParts = e.key.split('.');
                if (keyParts[0] === tabKey) {
                    if (listeners[keyParts[1]]) {
                        listeners[keyParts[1]].forEach(function(callbackConfig) {
                            callbackConfig.fn.apply(callbackConfig.scope, [e.newValue, e.oldValue, wasDelete]);
                        });
                    }
                }
                wasDelete = false;
            }

            function handlePostMessageEvent(e) {
                e = e.originalEvent;
                var data = e.data;
                if (angular.isString(data)) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        // swallow exception if can't be parsed
                        return;
                    }
                }
                if (!data.key) {
                    return;
                }
                var keyParts = data.key.split('.');
                if (keyParts[0] === tabKey) {
                    if (listeners[keyParts[1]]) {
                        listeners[keyParts[1]].forEach(function(callbackConfig) {
                            callbackConfig.fn.apply(callbackConfig.scope, [data.newValue, data.oldValue, wasDelete]);
                        });
                    }
                }
            }

            function emptySessionStorage() {
                keysAdded.forEach(function(key) {
                    localStorage.removeItem(tabKey + '.' + key);
                });

                //deleting the obj containing window layout details
                objKeys.forEach(function(key) {
                    localStorage.removeItem(key);
                });
            }

            var wasDelete = false,
                targetWindow = null;

            return {
                setTarget: function(_targetWindow) {
                    targetWindow = _targetWindow;
                },
                tabKey: function() {
                    return tabKey;
                },
                on: function(key, listener, scope) {
                    if (!listeners[key]) {
                        listeners[key] = [];
                    }
                    listeners[key].push({
                        fn: listener,
                        scope: scope
                    });
                },
                set: function(key, value, isObject) {
                    keysAdded.push(key);
                    if (isObject === true) {
                        //localStorage.setItem(tabKey + '.' + key, JSON.stringify(value));
                        targetWindow.postMessage({
                            key: tabKey + '.' + key,
                            newValue: JSON.stringify(value)
                        }, '*');
                    }else {
                        //localStorage.setItem(tabKey + '.' + key, value);
                        targetWindow.postMessage({
                            key: tabKey + '.' + key,
                            newValue: value
                        }, '*');
                    }
                },
                get: function(key, isObject) {
                    if (isObject === true) {
                        return JSON.parse(localStorage.getItem(tabKey + '.' + key));
                    }else {
                        return localStorage.getItem(tabKey + '.' + key);
                    }
                },
                delete: function(key) {
                    // if (localStorage.getItem(tabKey + '.' + key)) {
                    //     wasDelete = true;
                    // }
                    // localStorage.removeItem(tabKey + '.' + key);
                }
            };
        });
}());

},{}],70:[function(require,module,exports){
/* globals VOUINS */
var osLabelSet = require('../../common/shared/osLabelSet.js');

(function () {
    // Usage:
    // To provide a base constructor and utils for Property Components
    angular.module("omniscriptDesigner")
        .factory('propCompUtil', propCompUtil);

    propCompUtil.$inject = [];

    function propCompUtil() {
        var names = [],
            namesAsObjects = [];


        var service = {
            baseConstructor: basePropCompConstructor
        };

        return service;

        ////

        function basePropCompConstructor() {
            angular.extend(this, {
                elementNames: elementNames,
                elementNamesAsObject: elementNamesAsObject,
                elementPath: elementPath,
                updateDefaultProperties: updateDefaultProperties,
                getElementType: getElementType
            });
        }

        function updateDefaultProperties(defaultProperties, propertySet, type) {
            if (this.element && this.element.scriptElement().Language__c === 'Multi-Language') {
                defaultProperties = fixDefaultPropertiesForMultiLanguage(type, defaultProperties)
            }
            return Object.assign({}, _.cloneDeep(defaultProperties), propertySet);
        }

        function elementNamesAsObject() {
            namesAsObjects.splice(0, namesAsObjects.length);
            const scriptEl = this.scriptElement;
            this.scriptElement.each(function (element) {
                if (element !== scriptEl) {
                    namesAsObjects.push({
                        label: element.Name
                    });
                }
            });
            return namesAsObjects;

        }

        function elementNames(asObject) {
            if (asObject) {
                return this.elementNamesAsObject();
            }

            names.splice(0, names.length);
            const scriptEl = this.scriptElement;
            scriptEl.each(function (element) {
                if (element !== scriptEl) {
                    names.push(element.Name);
                }
            });
            return names;
        }

        function elementPath() {
            names = [];
            const scriptEl = this.scriptElement;
            // root
            if (scriptEl.children) {
                for (var i = 0; i < scriptEl.children.length; i++) {
                    var elem = scriptEl.children[i];
                    getElementPath(elem, elem.Name, names);
                }
            }
            return names;
        }

        function getElementPath(element, path, names) {
            names.push(path);
            if (element.children) {
                for (var i = 0; i < element.children.length; i++) {
                    var elem = element.children[i];
                    getElementPath(elem, path + '.' + elem.Name, names);
                }
            }
        }

        function getElementType(element) {
            return element.Type__c.type === 'OmniScript' ? element.Type__c.type : element.type();
        }

        function resolveType(type) {
            switch (type) {
                case 'Script Configuration':
                    return 'Script';
                default:
                    return type;
            }
        }

        function fixDefaultPropertiesForMultiLanguage(type, defaultProperties) {
            var knownLabels = VOUINS.ootbLabelMap[resolveType(type)];
            if (!knownLabels) {
                return defaultProperties;
            }
            knownLabels.forEach(function (key) {
                if (key.indexOf('|n') > -1) {
                    // handle array property
                    var keyPart = key.substring(0, key.indexOf('|n'));
                    var subKeyPart = key.substring(key.indexOf('|n:') + 3);
                    var prop = defaultProperties[keyPart];
                    if (Array.isArray(prop)) {
                        prop.forEach(function (childProp) {
                            childProp[subKeyPart] = '';
                        });
                    } else if (prop && prop[subKeyPart]) {
                        prop[subKeyPart] = '';
                    }
                } else {
                    // clear out value for multi-lang
                    defaultProperties[key] = '';
                }
            });
            return defaultProperties;
        }

    }

})();

},{"../../common/shared/osLabelSet.js":4}],71:[function(require,module,exports){
(function() {
    /*jshint -W030 */
    'use strict';
    angular.module('omniscriptDesigner')
        .factory('tObjectFactory', function() {
            /*
              input: arguement object passed from the bpService decorator
            */

            var classNamesToBeHidden = ['invokeInboundDR',
                                        'invokeTransformDR',
                                        'invokeOutboundDR',
                                       ];

            var containsString = function(sString){
                for(var i = 0 ; i < this.length; i++){
                    if (this[i].indexOf(sString) !== -1){
                        return true;
                    }
                }
                return false;
            };

            var tObjectsMap = [];
            var _factoryUpdated = false;

            function isValidObject(input) {
                if (input.response && input.response.name && input.response.type) {
                    return false;
                }

                if (input.args && input.args.name && input.args.type) {
                    return false;
                }

                return true;
            }

            function beautify(input){
                var request;
                try{
                    var test  = input && input[2] && input[2].replace(/\\\"/g,'\"');

                    if(test === input[2]){
                        request = (input && input[2] && angular.fromJson(input[2])) || {} ;
                        return request;
                    }
                    
                    test = test.replace(/\"{/g,'{');
                    test = test.replace(/}\"/g,'}'); 
                    request = angular.fromJson(test);

                } catch(err){
                    console.log('error in json parser ' + err);
                    request = (input && input[2] && angular.fromJson(input[2])) || {} ;
                }

                return request;
            }

            function CreateTObject(input, element) {
                var path = (input && input[0]) || 'anonymous';
                var restMethod = (input && input[1]) || 'anonymous';
                var self = this;

                //these names should be visible in the window
                !containsString.call(classNamesToBeHidden, restMethod) && (function(){
                    (element.type === 'web') && (function() {
                        self.extRestUrl = path;
                        self.httpVerb = restMethod;
                    }());
                    (element.type === 'apex') && (function() {
                        self.apexRestPath = path;
                        self.apexRestMethod = restMethod;
                    }());
                    (!element.type) && (function() {
                        self.remoteClass = (input && input[0]) || 'anonymous';
                        self.remoteMethod = (input && input[1]) || 'anonymous';
                    }());
                }());
                
                this.remoteOptions = (input && input[3] && angular.fromJson(input[3])) || {} ;

                //replaces the escaped json with beautified one 
                this.request = beautify(input);

                this.response = {};
                this.stage = (element.stage && element.stage + '-') || '';
                this.name = element.label || 'anonymous';
                this.created = Date.now();
            }

            //takes out the non display properties before copying the clipboard
            CreateTObject.prototype.toJSON = function() {
                var copy = {};
                angular.copy(this,copy);
                delete copy.visible;
                delete copy.stage;
                delete copy.name;
                delete copy.created;
                return copy;
            };

            function createRequestObject(input, element) {
                var tObject = new CreateTObject(input, element);
                //tObjectsMap.unshift(tObject);
                tObjectsMap.push(tObject);
                
            }

            function createResponseObject(input, element) {

                var tObject ;
                //check the element name of the last object matches
                /* jshint -W030 */
                var output = (tObject = tObjectsMap[tObjectsMap.length-1]) && (function() {
                    //stage has been lower cased in the above if clause
                    tObject.response  = input;
                    return true;
                }());

                if (!output) {
                    console.log('orphan response : something is wrong');
                }

            }

            function remoteCallObject(input) {

                //the step and type calls are also getting logged thats why - this check
                if (!(isValidObject(input))) {
                    return {
                        invalidObject: true
                    };
                }

                //this is a request object
                if (input.args) {
                    createRequestObject(input.args, input.element);
                }

                if (input.response) {
                    createResponseObject(input.response, input.element);
                }

                _factoryUpdated = !_factoryUpdated;

            }

            return {
                createNetTransObject: function(input) {
                    remoteCallObject(input);
                    _factoryUpdated = _factoryUpdated;
                },

                clearTObjects: function() {
                    tObjectsMap = [];
                    _factoryUpdated = _factoryUpdated;
                },

                factoryUpdated: function() {
                    return _factoryUpdated;
                },

                tObjects: function() {
                    return tObjectsMap;
                }

            };

        });

}());

},{}],72:[function(require,module,exports){
var CanvasElement = require('../../oui/util/CanvasElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module("omniscriptDesigner")
.filter("activeElementTitle", function($localizable, isIntegrationProcedure) {
    return function(canvasElement) {
      if (!canvasElement) {
        return "";
      }
      if (canvasElement instanceof ScriptElement) {
        if (isIntegrationProcedure) {
          return $localizable('IntProcHeaderProps');
        }
        return $localizable("OmniDesScriptHeaderProps", "Script Header Properties");
      }
      return canvasElement.CanvasType ? canvasElement.CanvasType : canvasElement.Name;
    };
  });
},{"../../oui/util/CanvasElement.js":91,"../../oui/util/ScriptElement.js":94}],73:[function(require,module,exports){
var CanvasElement = require('../../oui/util/CanvasElement.js');
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module("omniscriptDesigner")
.filter("className", function() {
  return function(canvasElement) {
    if (!canvasElement) {
      return "";
    }
    if (!(canvasElement instanceof CanvasElement) && !(canvasElement instanceof ScriptElement)) {
      if (angular.isString(canvasElement)) {
        canvasElement = CanvasElement.getById(canvasElement);
      } else {
        canvasElement = CanvasElement.getById(canvasElement.Id);
      }
    }
    var className = '';
    if (canvasElement instanceof CanvasElement) {
      className = canvasElement.type().replace(/ /gi, "").toLowerCase() + "Element" + (canvasElement.isInput() ? " inputElement" : "");
    } else {
      className = canvasElement.CanvasType;
    }
    if (canvasElement.hasErrors()) {
      className += " bg-danger";
    }
    if (!canvasElement.Active__c && (canvasElement instanceof CanvasElement)) {
      className += " inactive";
    }
    return className;
  };
});
},{"../../oui/util/CanvasElement.js":91,"../../oui/util/ScriptElement.js":94}],74:[function(require,module,exports){
var PaletteElement = require('../../oui/util/PaletteElement.js');

angular.module("omniscriptDesigner")
.filter("controlType", function() {
  function isInGroup(element) {
    return /Cache Block|Try Catch Block|Loop Block|Conditional Block/.test(element.label) || /Step/.test(element.label) || /filterblock|inputblock|selectable-items|typeahead-block|edit-block|action-block|radiogroup/.test(element.type) || element.isGroupedControl();
  }

  function isInInput(element) {
    return !/Submit/.test(element.label) && (/Filter/.test(element.label) || element.isInput()) &&
           !isInFunction(element) && !isInDisplay(element) && !isInGroup(element);
  }

  function isInDisplay(element) {
    return /Headline|Text Block|Line Break/.test(element.label);
  }

  function isInFunction(element) {
    return /Aggregate|Formula|Geolocation|Validation/.test(element.label);
  }

  function isInAction(element) {
    return /Submit/.test(element.label) || (!/OmniScript/.test(element.label) && !isInInput(element) &&
           !isInGroup(element) && !isInDisplay(element) && !isInFunction(element));
  }

  var funcs = {
    group: isInGroup,
    input: isInInput,
    action: isInAction,
    display: isInDisplay,
    func: isInFunction
  };

  var arrayCache = {
    empty: []
  };

  return function(elements, type) {
    if (!arrayCache[type]) {
      arrayCache[type] = [];
    } else {
      arrayCache[type].splice(0, arrayCache[type].length);
    }
    if (elements) {
      elements.forEach(function(element) {
        if (funcs[type](element)) {
          arrayCache[type].push(element);
        }
      });
      return arrayCache[type];
    } else {
      return arrayCache.empty;
    }
  };
});

},{"../../oui/util/PaletteElement.js":93}],75:[function(require,module,exports){
angular.module("omniscriptDesigner")
.filter("elementLabel", function() {
    return function(paletteElement, showOmniIfReUsable) {
      if (!paletteElement) {
        return "";
      }
      if (showOmniIfReUsable && paletteElement.type === 'OmniScript') {
        return 'OmniScript';
      }
      if (paletteElement.prettyName) {
        return paletteElement.prettyName();
      }
      if (/Rest/i.test(this.label)) {
        if (/^rest action$/i.test(this.label))
            return this.label.replace(/\brest\b/i, 'HTTP');
        else
            return this.label.replace(/\brest\b/i, 'REST');
      } else if (/^Validation$/.test(paletteElement.label)) {
        return "Messaging";
      // OMNI-2769
      } else if (/^Custom Lightning Web Component$/.test(paletteElement.label)) {
        return "Custom LWC";
      } else if (/^Date\/Time \(Local\)$/.test(paletteElement.label)) {
        return "Date\/Time";
      } else {
        return paletteElement.label;
      }
    };
  });

},{}],76:[function(require,module,exports){
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var CanvasElement = require('../../oui/util/CanvasElement.js');
var requiredProperties = require('../../oui/util/requiredProperties.js');

angular.module('omniscriptDesigner')
    .filter('fixMissingProperties', function ($rootScope, remoteActions, save) {
        'use strict';
        var pendingPropertySetPromises = {};
        return function (canvasElement) {
            if (!canvasElement) {
                return '';
            }
            if (requiredProperties[canvasElement.type()]) {
                if (!pendingPropertySetPromises[canvasElement.type()]) {
                    pendingPropertySetPromises[canvasElement.type()] = remoteActions.loadPropertySetForElement(canvasElement.type(), $rootScope.scriptElement.IsProcedure__c);
                }
                pendingPropertySetPromises[canvasElement.type()].then(function (textJson) {
                    if (!textJson || textJson.result === '') {
                        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                        textJson = JSON.stringify(canvasElement.PropertySet__c);
                    }
                    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                    var defaultProperties = JSON.parse(textJson.replace(/\&quot;/gi, '\"'));
                    var needsSaving = false;
                    requiredProperties[canvasElement.type()].forEach(function (requiredPropName) {
                        /* jshint eqnull:true */
                        if (canvasElement.PropertySet__c[requiredPropName] == null) {
                            canvasElement.PropertySet__c[requiredPropName] = defaultProperties[requiredPropName];
                            needsSaving = true;
                        }
                    });
                    if (needsSaving) {
                        // this is to help with batching
                        setTimeout(function () {
                            save(canvasElement);
                        }, 1000 * (Math.floor((Math.random() * 10) + 1)));
                    }
                });
            }
            return canvasElement;
        };
    });
},{"../../oui/util/CanvasElement.js":91,"../../oui/util/requiredProperties.js":96}],77:[function(require,module,exports){
angular.module("omniscriptDesigner")
.filter("getTypeForElement", function($localizable, $rootScope, elementLabelFilter) {
    return function(elementName) {
      var matchingElement = null;
      $rootScope.scriptElement.each(function(element){
        if (element.Name === elementName) {
          matchingElement = element;
        }
      });
      if (matchingElement) {
        return elementLabelFilter(matchingElement.Type__c);
      } else if (elementName !== '') {
        return 'JSON Node';
      } else {
        return '';
      }
    };
  });
},{}],78:[function(require,module,exports){
var ScriptElement = require('../../oui/util/ScriptElement.js');

angular.module('omniscriptDesigner')
.filter('readablePropertyName', function() {
    var transforms = {
        'label': 'Label',
        'Name' : 'Element Name',
        'controlWidth': 'Control Width',
        'required': 'Required?',
        'help': 'Help text active?',
        'showInputWidth': 'Label outside of field',
        'inputWidth': 'Field Width',
        'helpText': 'Help Text',
        'show': 'Hide Element If False',
        'mask': 'Mask',
        'maskCurrency': 'Decimal Places',
        'pattern': 'Pattern',
        'ptrnErrText': 'Error Text',
        'Active__c': 'Active?',
        'IsReusable__c': 'Reusable?',
        'Type__c': 'Type',
        'SubType__c': 'SubType',
        'DataRaptorBundleId__c': 'DataRaptor Submit Interface',
        'Language__c': 'Language',
        'bundle': 'DataRaptor Interface',
        'preTransformBundle': 'Pre-Transform DataRaptor Interface',
        'postTransformBundle': 'Post-Transform DataRaptor Interface',
        'xmlPreTransformBundle': 'XML Pre-Transform DataRaptor Interface',
        'xmlPostTransformBundle': 'XML Post-Transform DataRaptor Interface',
        'transformBundle' : 'Transform DataRaptor Interface',
        'remoteTimeout': 'Remote Timeout (ms)',
        'instruction': 'Instruction (Horizontal and Lightning Mode Only)',
        'URIEncode': 'Encode URI',
        'docuSignReturnUrl': 'DocuSign Return Url',
        'AdditionalInformation__c' : 'Description',
        'InternalNotes__c' : 'Internal Notes',
        'callFrequency' : 'Call Frequency (ms)',
        'fileAttachments' : 'File Attachments from OmniScript',
        'staticDocList' : 'Document Attachments',
        'contentVersionList' : 'Content Versions',
        'docList' : 'Document Attachments from OmniScript',
        'wpm': 'Window Post Message?',
        'ssm': 'Session Storage Message?',
        'allowCancel': 'Allow Cancel',
        'docuSignTemplatesGroup': 'DocuSign Templates Group',
        'docuSignTemplatesGroupSig': 'DocuSign Templates Group',
        'horizontalMode':'Display Mode',
        'type':'Option Source',
        'padding': 'Additonal Padding (px)',
        'svgSprite':'Default Svg Sprite',
        'svgIcon':'Default Svg Icon',
        'elementName':'Svg Controlling Element',
        'selectCheckBox':'Checkbox Element Name',
        'valueSvgMap':'Svg Controlling Element Map',
        'advancedMergeMap':'Advanced Merge Map',
        'deleteSObject':'Delete SObject',
        'columnsPropertyMap':'Columns Property Map',
        'linkToExternalObject' : 'External Objects Page',
        'labelSingular':'Singular Label',
        'labelPlural':'Plural Label',
        'nameColumn':'Column Name',
        'disOnTplt': 'Display On Template',
        'allowMergeNulls': 'NULL is a Valid Matching Value when Merging',
        'remoteConfirmMsg':'Confirmation Dialog Message',
        'subLabel':'Confirm Label',
        'timeTracking':'Enable Tracking',
        'rtpSeed':'Fetch Picklist Values at Script Load',
        'hideStepChart':'Hide Step Chart',
        'uploadContDoc':'Upload To Content Document',
        'vlcResponseHeaders':'Response Headers',
        'updateFieldValue':'Update Field Value',
        'dynamicOutputFields':'Dynamic Output Fields',
        'enableKnowledge' : 'Enable Knowledge',
        'bLK': 'Lightning Knowledge',
        'lkObjName' : 'Lightning Knowledge Object API Name',
        'knowledgeArticleTypeQueryFieldsMap' : 'Article/Record Type Query Fields Map',
        'typeFilter' : 'Record Type Filter (Lightning Knowledge Only)',
        'chartLabel' : 'Step Chart Label',
        'accessibleInFutureSteps':'Available for prefill when hidden',
        'chainableCpuLimit':'Chainable CPU Limit (ms)',
        'chainableSoslQueriesLimit':'Chainable SOSL Query Limit',
        'chainableHeapSizeLimit':'Chainable Heap Size Limit (MB)'
    };

    // creates String acronyms = '(JSON|XML|URL|...)' for use in regex patterns
    acronyms = (function (acArr){
            var pattern = "";
            acArr.forEach(function(item){
                pattern = pattern +'|'+ item;
            });
            return pattern.replace(/^\|/,"(?:")+')';
        })([
        // Array of acronyms to be handled by regex. Replace will capitalize these so don't include lower case
        'JSON','REST','HTTP','HTML','XML','URL','URI'
    ]);

    var elementSpecificTransforms = {
        'PDF Action': {
            'templateName': 'Document'
        },
        'Script Configuration': {
            'Name': 'OmniScript name'
        },
        'Procedure Configuration': {
            'Name': 'Integration Procedure Name'
        },
        'Headline': {
            'label': 'Headline',
            'labelKey': 'Headline Key'
        }
    };

    return function readablePropertyName(propertyName, element) {
        if (propertyName) {
            var parts = propertyName.split('.');
            if (propertyName.indexOf('|') > -1 || propertyName.indexOf(':') > -1) {
                return propertyName.replace(/[|:]/g,'.');
            }
            if (/^showPersistentComponent$/.test(parts[0]) && parts.length > 1) {
                return parts[1];
            }

            //changing label name from mask to decimal places for currency
            // var typeC = element['Type__c'];
            // if (typeC && /Mask/i.test(propertyName) && /Currency/i.test(typeC.label)) {
            //     return transforms['maskCurrency'];
            // }

            var lastPropName = parts[parts.length - 1];
            if (element && elementSpecificTransforms[element.type()]) {
                if (elementSpecificTransforms[element.type()][lastPropName]) {
                    return elementSpecificTransforms[element.type()][lastPropName];
                }
            } else if (/^\d+$/.test(lastPropName)) {
                return +lastPropName + 1;
            }
            if (transforms[propertyName]) {
                return transforms[propertyName];
            } else if (transforms[lastPropName]) {
                return transforms[lastPropName];
            }
            if (/Rest Action/i.test((element.Type__c||{label:""}).label||""))
                lastPropName = lastPropName.replace(/[Rr]est([A-Z])/, 'http$1');
            return lastPropName
                  // puts space before words, capitalized acronyms and numbers
                  .replace(/[A-Z][a-z]+|[A-Z]+(?=[A-Z][a-z]|$)|[0-9]+/g,' $&')
                  // Capitalizes recognized acronyms and first character
                  .replace(new RegExp('\\b'+acronyms+'\\b\|^.','ig'), v => v = v.toUpperCase())
                  .trim();
        }
        return '';
    };
});

},{"../../oui/util/ScriptElement.js":94}],79:[function(require,module,exports){
(function() {
    'use strict';
    /* jshint -W030 */

    //var MAX_SIZE = 5048576;
    var MAX_SIZE = 750000; /* 1 000 000 * 3/4 to account for base64 */
    //var FILE_SIZE_WARNING = 'file size exceeds the limit';
    var FILE_SIZE_WARNING = 'File exceeds the 1mb Remote Action upload limit. Please go' +
        ' to the Documents tab to upload the file (up to 5mb).';
    var FAILED_UPLOAD = 'The file could not be uploaded';

    function isSmallEnough(file) {
        return file.size < MAX_SIZE ;
    }

    window.tinymce.PluginManager.add('docInsert', function(editor, url) {
        editor.addCommand('openDocInsertWindow', function(callback) {
            var obj = callback();
            obj.getDocs = obj.getDocs || []; /* obj = {getDocs: [], callback: function(){}} */
            var selValue = ''; //value selected from listbox

            editor.windowManager.open(
                {
                    title: obj.imageInsert ? 'Image Insert' : 'Document Insert',
                    width: 400,
                    height: 300,
                    body: [
                        {
                            id: 'insertFromSF',
                            type:'checkbox',
                            text:'pick from existing ' + (obj.imageInsert ? 'images' : 'documents'),
                            onclick: function() {
                                var toggleValue = $('#insertFromSF').attr('aria-checked');
                                $('#filePicker').toggle();
                                (toggleValue === 'true') ? $('#selDocuments').show() : $('#selDocuments').hide();

                                //clears the error message if any
                                $('#errorLabel').text('');
                            }
                        },
                        {
                            type: 'textbox',
                            id: 'filePicker',
                            onPostRender: function() {
                                $('#filePicker').attr('placeholder', 'click to browse for files');
                            },
                            onclick: function() {
                                //clears the error message if any
                                $('#errorLabel').text('');

                                $('#fileSelector').click();
                            },
                            onChange: function(e) {
                                var files = ($('input:file'))[0].file;

                            }
                        },
                        {
                            type:'selectbox',
                            id:'selDocuments',
                            style: 'height:25px; padding: 2px 0;background-color: #F0F0F0; border-radius: 3px',
                            width: 200,
                            options: obj.getDocs () || []
                        },
                        {
                            type: 'textbox',
                            subtype: 'file',
                            id: 'fileSelector',
                            style: 'display:none',
                            width: 200,
                            onPostRender: function() {
                                obj.imageInsert && (function() {
                                    setTimeout(function() {
                                        $('#fileSelector').attr('accept', 'image/*');
                                    });
                                }());
                            },
                            onChange: function(e) {
                                //updates the text field
                                var files = ($('input:file'))[0].files;
                                document.getElementById('filePicker').value = files[0].name;
                            }
                        },
                        {
                            type: 'container',
                            html:'<div><p style="color:red; word-break: break-all; white-space: normal;' +
                                'font-size: 12px; font-style: italic; position:relative; top:-20px" id="errorLabel"></p></div>'
                        }
                    ],
                    onPostRender: function() {
                        setTimeout(function() {
                            $('#selDocuments').hide();
                        });
                    },
                    onsubmit: function() {
                        var win = this;

                        //gets executed when select from salesforce is checked
                        ($('#insertFromSF').attr('aria-checked') === 'true') && (function() {

                            //getting the value from the selectbox
                            var value = $('#selDocuments').val(),
                                docId = '';
                            value && (function() {
                                docId = $.parseHTML (value)[0].id;
                            }());

                            //this step is very important otherwise
                            //the selValue contains non ascii
                            //characters
                            selValue = '' + selValue.trim();

                            if (/oid=/.test(docId)){
                                document.getElementById(obj.fieldName).value = 'https://' + window.location.hostname +
                                    '/servlet/servlet.ImageServer?id=' + docId;
                            } else {
                                document.getElementById(obj.fieldName).value = 'https://' + window.location.hostname +
                                    '/servlet/servlet.FileDownload?file=' + docId;
                            }

                            obj.callback = false;
                            win.close();
                            return true;
                        }());

                        //gets executes when the select from salesforce checkbox is not checked
                        obj.callback && (function() {
                            var files = ($('input:file'))[0].files;
                            var reader = new FileReader();
                            //console.log(files[0]);
                            reader.readAsBinaryString(files[0]);

                            reader.onerror = function(e) {
                                document.getElementById('filePicker').value =  files[0].name;
                                console.log(e);
                            };

                            reader.onload = function(e) {
                                if (!isSmallEnough(files[0])) {
                                    //document.getElementById('filePicker').value =  FILE_SIZE_WARNING + ': ' +
                                    //files[0].name;

                                    $('#errorLabel').text(FILE_SIZE_WARNING);
                                    return false;
                                }

                                document.getElementById('filePicker').value =  'uploading ' + files[0].name + '...';

                                var bstring = e.target.result;
                                var result = obj.callback(bstring,files[0].name, files[0].type);

                                //dont see error from SF incase of failed uploads
                                result.then && result.then(function(result) {
                                    //this returns an array of valid
                                    //docs or erraneous doc - check
                                    //the remote action upload
                                    //document
                                    var urlLocation = '';
                                    if (obj.imageInsert) {
                                        urlLocation =   'https://' + window.location.hostname +
                                                            '/servlet/servlet.ImageServer?' + 
                                                            'id=' + result[0].Id +
                                                            '\&\&docName=' + result[0].DeveloperName + 
                                                            '\&\&oid=' + window.oid;

                                    } else {
                                        var fileId = result[0].Id + '\&\&docName=' + result[0].DeveloperName;
                                        urlLocation =  'https://' + window.location.hostname +
                                            '/servlet/servlet.FileDownload?file=' + fileId ;
                                    }

                                    window.document.getElementById (obj.fieldName).value = urlLocation;
                                    win.close();
                                }, function(fail) {
                                    $('#errorLabel').text(FAILED_UPLOAD + (fail.message ? 'Error message: ' + fail.message : '.'));
                                });
                            };
                        }());

                        //this makese the window stay up till the reader on load gets done
                        return false;
                    }
                });
        });

    });
}());

},{}],80:[function(require,module,exports){
(function() {
    /*jshint -W030 */
    'use strict';
    var htmlString = '<div id="articleList" style="overflow-y:auto; padding: 5px; border-radius: 5px; border: 1px solid #C5C5C5;' +
        ' width: 550px !important; height: 250px !important;" readonly="readonly"></div>';

    window.tinymce.PluginManager.add('smartLink', function(editor, url) {

        editor.addButton('example', {
            icon: 'anchor',
            tooltip:'Smart link',
            onclick: function() {
                editor.editorCommands.execCommand('openSmartLinkWindow');
            }
        });

        editor.addCommand('openSmartLinkWindow', function(callback, callback2) {
            var selValue = 'online';
            var langCode = '';

            editor.windowManager.open({
                title: 'Smart Link Article',
                buttons: [],
                body: [
                    {
                        type: 'listbox',
                        id: 'publishStatus',
                        values: [
                            {text: 'Publish', value: 'online'},
                            {text: 'Draft', value: 'draft'},
                            {text: 'Draft Translation', value: 'archived'},
                        ],
                        onselect: function(v) {
                            selValue = v.target.settings.value;
                        }
                    },{
                        type: 'listbox',
                        id: 'langCode',
                        values: window.tinymce.getLanguageCodeMap(),
                        onselect: function(v) {
                            langCode = v.target.settings.value;
                        },
                        onPostRender: function(v){
                            this.value('en_US');
                            langCode = 'en_US';
                        }
                    },{
                        type: 'textbox',
                        id: 'sText',
                        subtype: 'text',
                    },{
                        type: 'container',
                        style: 'padding-bottom: 10px; height: 250px ! important',
                        html:htmlString
                    }
                ],
                onsubmit: function(e) {
                    // Insert content when the window form is submitted
                    //editor.insertContent('Title: ' + e.data.title);
                    $('#articleList').empty();
                    var resultString = '';
                    var sKey = $('#sText').val() || '';
                    console.log(sKey, selValue, langCode);

                    window.tinymce.remoteCall(sKey, selValue, langCode).then(function(results) {
                        var articles = JSON.parse(results.replace(/&quot;/g,'"'));

                        (!articles.error) && (function(){
                            window.angular.forEach(articles,function(article) {
                            var display = article.urlName;
                            
                            //popup true disables the salesforce headerforarticles
                            resultString = resultString  + '<p class="mce-anchor" style="padding: 5px" ><a title="' +
                                article.title + '" href="/articles/' + article.articleType + '/' +
                                article.urlName + '?popup=true" target="_blank">' + display +  '</a></p>';
                            });
                        }());
                        
                        resultString &&
                            (function(){
                                $('#articleList').append(resultString);
                            }());
                    });

                    //query the remote actions object and see what it gives you
                    return false;
                },
                onPostRender: function() {
                    var win = this;

                    //bubbles the click on the links inside the div area
                    $('#articleList').click(function(event) {

                        //incase the user clicks on the empty div
                        if (event.target.id === 'articleList'){
                            return ;
                        }
                        
                        var aTag = '\<a class=mce-anchor' + ' href="' + event.target.getAttribute('href') +
                            '" target="_blank"\>' + (event.target.text ||  event.target.getAttribute('href'))  + '\<\/a\>&nbsp;';
                        editor.insertContent(aTag);
                        event.preventDefault();
                        win.close();
                    });

                    setTimeout(function() {
                        $('#sText').attr('placeholder', 'enter the name of the article and press enter');
                    });
                }

            });
        });
    });

}());

},{}],81:[function(require,module,exports){
/* globals VOUINS */
var osLabelSet = require('../../common/shared/osLabelSet.js');

(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .service('customLabelService', CustomLabelService);

    CustomLabelService.$inject = ['remoteActions', '$q', '$timeout'];

    // increase the polling timeout to 5 minutes
    window.conn.metadata.pollTimeout = 5 * 60 * 1000;

    function CustomLabelService(remoteActions, $q, $timeout) {
        var self = this,
            allUnmanagedLabels = {},
            ns = fileNsPrefix();

        this.currentEditLanguage = 'en_US';
        this.getLabelValue = getLabelValue;
        this.isValidLabelName = isValidLabelName;
        this.getLanguageCodeFor = getLanguageCodeFor;
        this.getLabelsForElement = getLabelsForElement;
        this.loadAllCustomLabelsInOrg = loadAllCustomLabelsInOrg;
        this.saveAll = saveAll;

        this.translations = [
            {
                value: 'zh_CN',
                label: 'Chinese (Simplified)'
            }, {
                value: 'zh_TW',
                label: 'Chinese (Traditional)'
            }, {
                value: 'da',
                label: 'Danish'
            }, {
                value: 'nl_NL',
                label: 'Dutch'
            }, {
                value: 'en_US',
                label: 'English (US)'
            }, {
                value: 'fi',
                label: 'Finnish'
            }, {
                value: 'fr',
                label: 'French'
            }, {
                value: 'de',
                label: 'German'
            }, {
                value: 'it',
                label: 'Italian'
            }, {
                value: 'ja',
                label: 'Japanese'
            }, {
                value: 'ko',
                label: 'Korean',
            }, {
                value: 'no',
                label: 'Norwegian'
            }, {
                value: 'pt_BR',
                label: 'Portuguese (Brazil)'
            }, {
                value: 'ru',
                label: 'Russian'
            }, {
                value: 'es',
                label: 'Spanish'
            }, {
                value: 'es_MX',
                label: 'Spanish (Mexico)'
            }, {
                value: 'sv',
                label: 'Swedish'
            }, {
                value: 'th',
                label: 'Thai'
            }, {
                value: 'ar',
                label: 'Arabic'
            }, {
                value: 'bg',
                label: 'Bulgarian'
            }, {
                value: 'hr',
                label: 'Croatian'
            }, {
                value: 'cs',
                label: 'Czech'
            }, {
                value: 'en_GB',
                label: 'English (UK)'
            }, {
                value: 'el',
                label: 'Greek'
            }, {
                value: 'iw',
                label: 'Hebrew'
            }, {
                value: 'hu',
                label: 'Hungarian'
            }, {
                value: 'in',
                label: 'Indonesian'
            }, {
                value: 'pl',
                label: 'Polish'
            }, {
                value: 'pt_PT',
                label: 'Portuguese (European)'
            }, {
                value: 'ro',
                label: 'Romanian'
            }, {
                value: 'sk',
                label: 'Slovak'
            }, {
                value: 'sl',
                label: 'Slovenian'
            }, {
                value: 'tr',
                label: 'Turkish'
            }, {
                value: 'uk',
                label: 'Ukrainian'
            }, {
                value: 'vi',
                label: 'Vietnamese'
            }
        ].sort(function(a, b) {
            var nameA = a.label.toUpperCase(); // ignore upper and lowercase
            var nameB = b.label.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });

        this.defaultValuesToLabelNames = {
            'previousLabel': ns + 'OmnipreviousLabel',
            'nextLabel': ns + 'OmninextLabel',
            'cancelLabel': ns + 'OmnicancelLabel',
            'saveLabel': ns + 'OmnisaveLabel',
            'completeLabel': ns + 'OmnicompleteLabel',
            'submitLabel': ns + 'OmnisubmitLabel',
            'summaryLabel': ns + 'OmnisummaryLabel',
            'reviseLabel': ns + 'OmnireviseLabel',
            'failureNextLabel': ns + 'OmnifailureNextLabel',
            'failureAbortLabel': ns + 'OmnifailureAbortLabel',
            'failureGoBackLabel': ns + 'OmnifailureGoBackLabel',
            'redirectNextLabel': ns + 'OmniredirectNextLabel',
            'redirectPreviousLabel': ns + 'OmniredirectPreviousLabel',
            'consoleTabLabel': ns + 'OmniconsoleTabLabel',
            'newItemLabel': ns + 'OmninewItemLabel',
            'newLabel': ns + 'OmninewLabel',
            'editLabel': ns + 'OmnieditLabel',
            'cancelMessage': ns + 'OmnicancelMessage',
            'saveMessage': ns + 'OmnisaveMessage',
            'completeMessage': ns + 'OmnicompleteMessage',
            'inProgressMessage': ns + 'OmniinProgressMessage',
            'postMessage': ns + 'OmnipostMessage',
            'failureAbortMessage': ns + 'OmnifailureAbortMessage',
            'subLabel': ns + 'OmniDelete',
            'remoteConfirmMsg': ns + 'OmniremoteActionConfirm'
        };

        this.omniInbuiltLangsToSFDCCode = null;
        ////////////////

        function getLabelValue(labelName, language) {
            return makeRequestForLabelIfNotInflight(labelName, language);
        }

        var mapOfInflightRequests = {};

        function makeRequestForLabelIfNotInflight(labelName, language) {
            if (!mapOfInflightRequests[labelName + '-' + language]) {
                mapOfInflightRequests[labelName + '-' + language] =
                getLabelFromApexHack(labelName, language)
                        .finally(function () {
                            mapOfInflightRequests[labelName + '-' + language] = null;
                        });
            }
            return mapOfInflightRequests[labelName + '-' + language];
        }

        function getLabelFromApexHack(labelName, languageCode) {
            return $q(function(resolve, reject) {
                    remoteActions.getCustomLabels([labelName], languageCode)
                        .then(function (allLabels) {
                            var labelResult = JSON.parse(allLabels) || {};
                            if (labelResult.messages && labelResult.messages.length > 0) {
                                labelResult.messages.forEach(function (message) {
                                    if (message.severity === 'ERROR') {
                                        throw new Error(message.message);
                                    }
                                });
                            }
                            if (labelResult.data && labelResult.data.dataMap) {
                                labelResult = labelResult.data.dataMap;
                            }
                            var map = {};
                            Object.keys(labelResult).forEach(function (returnedLabelName) {
                                if (returnedLabelName !== 'language' &&
                                    returnedLabelName === labelName) {
                                    resolve(labelResult[returnedLabelName]);
                                    return;
                                }
                            });
                            reject('No translation of "' + labelName + '" in ' + languageCode);
                        })
                        .catch(function(err) {
                            reject(err);
                        });
                });
        }

        function isValidLabelName(labelName) {
            if (labelName && /__/.test(labelName)) {
                return isValidLabelName(labelName.split('__')[1]);
            }

            // The name must begin with a letter
            // and use only alphanumeric characters and underscores.
            // The name cannot end with an underscore
            // or have two consecutive underscores.
            // from https://unix.stackexchange.com/a/78524
            return labelName && /^[A-Za-z][0-9A-Za-z]*(_[0-9A-Za-z]+)*$/.test(labelName);
        }

        function saveAll(arrayOfLabels) {
            if (!allUnmanagedLabels) {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(saveAll(arrayOfLabels));
                    }, 1000);
                });
            }

            var arrayToUpsert = [],
                arrayToDeploy = [];
            arrayOfLabels.forEach(function(label) {
                if (label.value === null ||
                    label.value === undefined) {
                    return;
                }

                // Do a metadata deploy instead of upsert if this label is from a managed
                // package.
                if (/__/.test(label.name)) {
                    arrayToDeploy.push(label);
                    return;
                }

                var existingLabel = allUnmanagedLabels[label.name.toLowerCase()];

                // change the name to match the case sensitive version of the existing one
                // otherwise we'll get a duplicate error
                if (existingLabel) {
                    label.name = existingLabel.originalName;
                }

                // Do a metadata deploy instead of upsert if the label exists
                // but this is a different language.
                if (existingLabel &&
                    existingLabel.originalLanguage !== label.language) {
                    arrayToDeploy.push(label);
                    return;
                }

                // Don't do anything if the language and label value are the same
                if (existingLabel &&
                    existingLabel.originalLanguage === label.language &&
                    existingLabel.value === label.value) {
                    return;
                }

                arrayToUpsert.push(label);
            });

            var promiseToUpsert = upsertAll(_.uniqBy(arrayToUpsert, 'name'));
            var promiseToDeploy = deployAll(_.uniqBy(arrayToDeploy, 'name'));

            return $q.all([promiseToUpsert, promiseToDeploy]);
        }

        function upsertAll(arrayOfLabels) {
            if (!arrayOfLabels ||
                arrayOfLabels.length === 0) {
                return $q.when(true);
            }

            // Metadata api only accepts 10 inserts at a time, so split
            // up larger arrays into multiple smaller ones and submit individually
            if (arrayOfLabels.length > 10) {
                var maxSizeTenArrays = [];
                while (arrayOfLabels.length > 0) {
                    maxSizeTenArrays.push(arrayOfLabels.splice(0, 10));
                }

                return $q.all(maxSizeTenArrays.map(function(arrayOfLabels) {
                    return upsertAll(arrayOfLabels);
                }));
            }

            var metadata = arrayOfLabels.map(function(label) {
                return {
                    fullName: label.name,
                    language: label.language,
                    protected: false,
                    shortDescription: label.shortDescription,
                    value: label.value
                };
            });
            return $q(function (resolve, reject) {
                window.conn.metadata.upsert('CustomLabel', metadata, function (err, results) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!Array.isArray(results)) {
                        results = [results];
                    }
                    var errors = results.filter(function(result) {
                        return result.errors;
                    }).map(function(result) {
                        return result.errors;
                    });
                    if (errors.length > 0) {
                        reject(errors);
                        return;
                    }
                    resolve(results[0]);
                });
            });
        }

        function deployAll(arrayOfLabels) {
            if (!arrayOfLabels ||
                arrayOfLabels.length === 0) {
                return $q.when(true);
            }

            return createZipOfAll(arrayOfLabels)
                .then(function(zipStream) {
                    return $q(function(resolve, reject) {
                        window.conn.metadata.deploy(zipStream, {
                                singlePackage: true
                            })
                            .complete(function(err, deployResult) {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                if (deployResult.success === false) {
                                    window.conn.metadata.checkDeployStatus(deployResult.id, true,
                                            function(err, result) {
                                                console.log(err);
                                                console.log(result);
                                            });
                                    reject(deployResult);
                                    return;
                                }

                                resolve(deployResult);
                            });
                    });
                });
        }

        function createZipOfAll(arrayOfLabels) {
            return $q(function(resolve, reject) {
                var zip = new window.JSZip();

                var langToLabelsMap = arrayOfLabels.reduce(function(map, label) {
                    if (!map[label.language]) {
                        map[label.language] = [];
                    }

                    map[label.language].push(label);

                    return map;
                }, {});

                zip.file(
                    'package.xml',
                    '<?xml version=\"1.0\" encoding=\"UTF-8\"?>' +
                    '<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\">' +
                        '<types>' +
                            '<members>*</members>' +
                            '<name>CustomLabels</name>' +
                        '</types>' +
                        '<types>' +
                            Object.keys(langToLabelsMap)
                                    .map(function(language) {
                                        return '<members>' + language + '</members>';
                                    })
                                    .join('') +
                            '<name>Translations</name>' +
                        '</types>' +
                        '<version>42.0</version>' +
                    '</Package>'
                );

                Object.keys(langToLabelsMap)
                    .forEach(function(language) {
                        var languageLabels = langToLabelsMap[language];

                        var languageLabelsXml = arrayOfLabels.map(function(label) {
                            return '<customLabels>' +
                                        '<label>' + label.value + '</label>' +
                                        '<name>' + label.name + '</name>' +
                                    '</customLabels>';
                        });

                        // translation file
                        zip.file(
                            'translations/' + language + '.translation',
                            '<?xml version=\"1.0\" encoding=\"UTF-8\"?>' +
                            '<Translations xmlns=\"http://soap.sforce.com/2006/04/metadata\">' +
                                languageLabelsXml +
                            '</Translations>'
                        );
                    });

                var content = zip.generateAsync({type: 'base64'})
                    .then(function(content) {
                        resolve(content);
                    });
            });
        }

        function loadOmniLanguages() {
            return remoteActions.getLanguageCodeMap()
                .then(function (langCodeMap) {
                    self.omniInbuiltLangsToSFDCCode = langCodeMap;
                    return self.omniInbuiltLangsToSFDCCode;
                });
        }

        function getLanguageCodeFor(language) {
            if (!self.omniInbuiltLangsToSFDCCode) {
                return loadOmniLanguages()
                    .then(function (languages) {
                        return self.omniInbuiltLangsToSFDCCode[language];
                    });
            } else {
                return $q.when(self.omniInbuiltLangsToSFDCCode[language]);
            }
        }

        function xmlToJson(xmlString) {
            var xml = xmlString;
            if (xml == null) {
                return {};
            }
            if (angular.isString(xmlString)) {
                var oParser = new DOMParser();
                xml = oParser.parseFromString(xmlString, 'text/xml');
                if (isParseError(xml)) {
                    return {};
                }
            }

            // Create the return object
            var obj = {};
            if (xml.nodeType === 1) { // element
                processXmlAttributes(xml, obj);
            } else if (xml.nodeType === 3) { // text
                obj = xml.nodeValue;
            }

            // do children
            if (xml.hasChildNodes()) {
                processChildNodes(xml, obj);
            }
            return obj;
        }

        function processXmlAttributes(xml, obj) {
            // do attributes
            if (xml.attributes.length > 0) {
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj['@' + attribute.nodeName] = attribute.nodeValue;
                }
            }
        }

        function processChildNodes(xml, obj) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) === 'undefined') {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) === 'undefined') {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }

        function isParseError(parsedDocument) {
            // parser and parsererrorNS could be cached on startup for efficiency
            var parser = new DOMParser(),
                errorneousParse = parser.parseFromString('<', 'text/xml'),
                parsererrorNS = errorneousParse.getElementsByTagName('parsererror')[0].namespaceURI;

            if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
                // In PhantomJS the parseerror element doesn't seem to have a special
                // namespace, so we are just guessing here :(
                return parsedDocument.getElementsByTagName('parsererror').length > 0;
            }

            return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
        }

        function resolveType(type) {
            switch (type) {
                case 'Script Configuration': return 'Script';
                default: return type;
            }
        }

        function getLabelsForElement(element) {
            var labels = VOUINS.ootbLabelMap[resolveType(element.type())];
            if (!labels) {
                labels = [];
            }

            switch(element.type()) {
                case 'Step': labels.push('instruction');
                    break;
                case 'Text Block': // text block and disclosure to be treated the same
                case 'Disclosure': labels.push('text');
                    break;
                default: break;
            }

            if (element.PropertySet__c &&
                element.PropertySet__c.label !== undefined &&
                element.type() !== 'Line Break') {
                labels.push('label');
            }
            return labels.reduce(function(array, key) {
                if (key.indexOf('|n') > -1 || key.indexOf(':') > -1) {

                    var prop = element.PropertySet__c;
                    var paths = VOUINS.createPropPaths(prop, key);
                    array = array.concat(paths);

                } else {
                    array.push(key);
                }
                return array;
            }, []).filter(function(label) {
                return !!label;
            }).filter(function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            });
        }

        function loadAllCustomLabelsInOrg() {
            allUnmanagedLabels = null;
            window.conn.metadata.retrieve({
                unpackaged: {
                    'types': {
                        'members': '*',
                        'name': 'CustomLabel'
                    },
                    'version': '42.0'
                }
            }).complete(function (err, result) {
                window.JSZip.loadAsync(result.zipFile, {base64: true})
                    .then(function (zip) {
                        var customLabelsFile = $q.when('<?xml version=\"1.0\" ' +
                        'encoding=\"UTF-8\"?><CustomLabels xmlns=\"http://soap.sforce.com/2006/04/metadata\">' +
                        '</CustomLabels>');
                        if (zip.files['unpackaged/labels/CustomLabels.labels']) {
                            var outputFile = zip.file('unpackaged/labels/CustomLabels.labels');
                            if (outputFile) {
                                customLabelsFile = outputFile.async('string');
                            }
                        }
                        return customLabelsFile;
                    }).then(function (text) {
                        var jsonResponse = xmlToJson(text);

                        var labels = jsonResponse.CustomLabels.labels;
                        if (!Array.isArray(labels) && labels) {
                            labels = [labels];
                        }
                        if (!labels) {
                            allUnmanagedLabels = {};
                            return;
                        }
                        allUnmanagedLabels = labels.reduce(function (obj, label) {
                            if (!obj[label.fullName['#text'].toLowerCase()]) {
                                obj[label.fullName['#text'].toLowerCase()] = {};
                            }
                            obj[label.fullName['#text'].toLowerCase()] = {
                                originalName: label.fullName['#text'],
                                originalLanguage: label.language['#text'],
                                isDefault: true,
                                value: label.value['#text']
                            };
                            return obj;
                        }, {});
                    });
            });
        }
    }
})();

},{"../../common/shared/osLabelSet.js":4}],82:[function(require,module,exports){
(function() {
    /* jshint -W030 */
    'use strict';
    window.angular.module('omniscriptDesigner').
        service('customViewModalService', ['$modal', 'interTabMsgBus', function($modal, interTabMsgBus){

            this.getCustomViewModalWindow = function(pScope, newValue, oldValue, pageToMode, callback){
                
                var self = this;

                //gets the layout and the view name from the localStorage
                this.config = (function(){
                    return interTabMsgBus.get('config', true) ; //this can be a valid object or an empty object
                }());

                
                //if nothing was written to the localStorage
                (!this.config) && (function(){
                    self.config = {};
                    self.config.layout = self.config.layout || 'false';
                }());

                return $modal ({
                    title: 'Custom Visual Force Page Setup',
                    templateUrl: 'custom-VF-modal.tpl.html',
                    backdrop: 'static',
                    keyboard: false,
                    controller: function($scope, $http){
                        $scope.customViewModal = self.config;

                        $scope.submit = function(){

                            //newValue is custom
                            pageToMode[newValue] = $scope.customViewModal.pageName;
                            
                            var sucessCallback = function(result){
                                //this is a hack - since salesforce always the header as 200 no matter what happens
                                if (/Visualforce Error/.test(result.data)){
                                    $scope.errorMessage = $scope.customViewModal.pageName + ' is not a valid page';
                                } else {
                                    $scope.$hide();

                                    window.setTimeout(function(){
                                        //writing to the session no matter what
                                        interTabMsgBus.set('config', self.config, true);
                                    },0);
                                    
                                    callback && (function(){
                                        callback(function(){
                                            //replace this with an object
                                            return {
                                                verticalMode: '&verticalMode='+ $scope.customViewModal.layout,
                                            };
                                        });
                                    }());
                                    
                                    $scope.errorMessage = '';
                                }
                            };

                            var failureCallback = function(error){
                                //notify the user that the page is invalid
                                $scope.errorMessage = $scope.customViewModal.pageName + ' is not a valid page';
                            };

                            //check the page for 404s 
                            $http.get('/apex/' + $scope.customViewModal.pageName).then(sucessCallback,
                                                                                       failureCallback);

                        };

                        $scope.cancel = function() {
                            //flips the select to the oldervalue when we cancel the modal
                            pScope.previewMode = oldValue;
                            $scope.$hide();
                        };
                    }
                });
            };
        }]);
}());

},{}],83:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .service('dataraptorBundleService', dataraptorBundleService);

    dataraptorBundleService.$inject = ['remoteActions'];

    function dataraptorBundleService(remoteActions) {
        this.getMatchingDRBundles = getMatchingDRBundles;

        ////////////////

        function getMatchingDRBundles(name, types) {
            return remoteActions.getMatchingDRBundles(name, types);
        }

    }
})();

},{}],84:[function(require,module,exports){
(function(){
    window.angular.module('omniscriptDesigner')
        .service('propertyEditorModalService', ['$timeout', '$modal', 'remoteActions',function($timeout, $modal, remoteActions){

            this.imgDocs = [];

            this.supportedFormats = ['png', 'gif', 'jpeg', 'jpg'];

            var self = this;

            this.init = function(documents) {
                this.documents = documents.map(function(document) {
                        ((document.IsPublic && document.Type && document.Type.indexOf('image') !== -1) ||  self.supportedFormats.includes(document.Type)) &&
                            (function() {
                                self.imgDocs.push(document);
                            }());

                        return document ;
                });
            };

            this.loadDocs = function(){
                remoteActions.getAllDocuments().then(function(documents) {
                    self.init(documents);
                });
            };

            this.loadDocs();

            this.prepDocInsert = function(parentObject, tgtProp, imageInsert) {
                var input = {};
                input.filePicker = false;
                input.fileUpload = null;
                input.selDocuments = null;
                input.imageInsert = imageInsert;
                input.currentValue = parentObject[tgtProp];

                input.callback = function(bstring, name) {
                    return remoteActions.uploadDocument(btoa(bstring),name, 'image'); //this returns a promise
                };

                input.getTest = function(){
                    return self.names;
                };

                input.getDocs = function(imageInsert) {
                    if (imageInsert)
                        return self.imgDocs;
                    else return self.documents;
                };

                input.loadDocs = function(){return self.loadDocs();};

                        if (input.currentValue){
                            input.filePicker = true;
                            input.selDocuments = input.getDocs(imageInsert).find(function(doc){
                                if (doc.Id == input.currentValue.match(/[^=&;]+(?=(?:&(?:amp;?)?){1,2}(?:docName|oid=))/)[0])
                                    return doc;
                            });
                        }

                        this.openDocInsert(function(){
                            return input;
                        }, parentObject, tgtProp);
            };

            this.openDocInsert = function(callback, parentObject, tgtProp) {

                return $modal({
                        title: (callback().imageInsert ? 'Image' : 'Document') + ' Insert',
                        templateUrl: 'modal-doc-insert.tpl.html',
                        controller: function($scope){
                            $scope.obj = callback();

                            var MAX_SIZE = 750000;

                            var FILE_SIZE_WARNING = 'File exceeds the 1mb Remote Action upload limit. Please go' +
                                                    ' to the Documents tab to upload the file (up to 5mb).';
                            var FAILED_UPLOAD = 'The file could not be uploaded';

                            function isSmallEnough(file) {
                                return file.size < MAX_SIZE ;
                            }



                            $scope.cancel = function(){
                                $scope.$hide();
                            };

                            $scope.delete = function(){
                                parentObject[tgtProp] = null;
                                $scope.$hide();
                            };

                            $scope.submit = function(){

                                var basePath = ($scope.obj.imageInsert ? '../servlet/servlet.ImageServer?' : '../servlet/servlet.FileDownload?file=');

                                if($scope.obj.filePicker && $scope.obj.selDocuments !== null){
                                    if ($scope.obj.imageInsert) {
                                        parentObject[tgtProp] = basePath + 
                                                                'id=' + $scope.obj.selDocuments.Id +
                                                                '&&docName=' + $scope.obj.selDocuments.DeveloperName +
                                                                '&&oid=' + window.oid;
                                    } else {
                                        parentObject[tgtProp] = basePath + $scope.obj.selDocuments.Id +
                                                                '&&docName=' + $scope.obj.selDocuments.DeveloperName;
                                    }

                                    $scope.obj.callback = false;
                                    $scope.cancel();


                                }else if(!($scope.obj.filePicker || document.getElementById('filePicker').files === null)){
                                    //Submit UPLOADED docId
                                    var file = document.getElementById('filePicker').files[0];
                                    var reader = new FileReader();

                                    reader.readAsBinaryString(file);

                                    reader.onerror = function(e) {
                                        document.getElementById('docSelModalFile').value =  file.name;
                                    };

                                    reader.onload = function(e) {
                                        if (!isSmallEnough(file)) {
                                            $('#errorLabel').text(FILE_SIZE_WARNING);
                                            return false;
                                        }

                                        document.getElementById('docSelModalFile').value =  'uploading ' + file.name + '...';

                                        var bstring = e.target.result;
                                        var result = $scope.obj.callback(bstring,file.name, file.type);

                                        result.then && result.then(function(result) {
                                            if ($scope.obj.imageInsert){
                                                parentObject[tgtProp] = basePath + 
                                                                        'id=' + result[0].Id +
                                                                        '&&docName=' + result[0].DeveloperName+
                                                                        '&&oid=' + window.oid;
                                            } else{
                                                parentObject[tgtProp] = basePath + result[0].Id +
                                                                        '&&docName=' + result[0].DeveloperName;
                                            }

                                            $scope.obj.loadDocs();
                                            $scope.cancel();
                                        }, function(fail) {
                                            $('#errorLabel').text(FAILED_UPLOAD + (fail.message ? 'Error message: ' + fail.message : '.'));
                                        });
                                    };


                                }
                            };

                            $scope.clearError = function(){
                                $('#errorLabel').text('');
                            };

                        }                    
                });
            };

            this.prepExpressionEditor = function(elementNames,parentObject, tgtProp, expressionOnly){
                var input = {};
                input.currentVal = parentObject[tgtProp];
                if (typeof input.currentVal == 'undefined'){
                    input.currentVal='';
                }
                input.elementNames = elementNames;

                // delete leading '=' token
                if (!expressionOnly) {
                    input.currentVal = String(input.currentVal).replace(/(?:^\s*=)|(?:\s*$)/g,'');
                }

                this.openExpressionEditor(function(){
                    return input;
                },parentObject, tgtProp);
            };

            this.openExpressionEditor = function(callback, parentObject, tgtProp) {

                return $modal({
                    title: 'Expression Editor',
                    templateUrl: 'modal-edit-expression.tpl.html',
                    backdrop:'static',
                    controller: function($scope) {
                        $scope.obj = callback();

                        $scope.obj.newVal = $scope.obj.currentVal;

                        $scope.cancel = function(){
                            $scope.$hide();
                        };

                        $scope.submit = function(){
                            if($scope.obj.newVal || $scope.obj.newVal == 'false'){
                                parentObject[tgtProp] = '='+$scope.obj.newVal;
                                if(parentObject.hasOwnProperty('$parentProperty') && parentObject.$parentProperty){
                                    parentObject.$parentProperty.update();
                                } else {
                                    parentObject.update();
                                }
                            }
                            $scope.cancel();
                        };
                    }
                });
            };
        }
    ]);
}());
},{}],85:[function(require,module,exports){
(function () {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .service('sObjectService', sObjectService);

        sObjectService.$inject = ['remoteActions'];

    function sObjectService(remoteActions) {
        this.getSObjects = getSObjects;

        var cachedSObjects = undefined;


        // call to get them straight away since this is slow
        getSObjects();

        ////////////////

        function getSObjects() {
            var fetchPromise = fetchSObjects()
                                .then(function (sObjects) {
                                    cachedSObjects = sObjects;
                                    return cachedSObjects;
                                });

            // to ensure we get fresh sObjects we'll always return the latest set but then update the
            // result. So on first call to this function we return undefined which let's Angular know
            // there's no results yet.
            if (!cachedSObjects) {
                return fetchPromise;
            }
            return Promise.resolve(cachedSObjects);
        }

        function fetchSObjects() {
            return remoteActions.getAllObjects().then(function (allObjects) {
                return allObjects.sort(function (a, b) {
                    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
                });
            });
        }

    }
})();

},{}],86:[function(require,module,exports){
(function () {
    /* jshint -W030 */
    'use strict';
    window.angular.module('omniscriptDesigner')
        .service('tinyMCEService', ['$timeout', 'remoteActions',function($timeout, remoteActions) {
            var tinyMCE = window.tinyMCE;
            var self = this;

            var stylesheetref = $('link[rel=stylesheet]').filter(function () {
                return /vlocity\.css/.test(this.getAttribute('href'));
            });

            this.plugins = (function() {
                return 'docInsert smartLink';
            }());
            this.imageDocs = [];

            this.supportedFormats = ['png', 'gif', 'jpeg', 'jpg'];

            this.tinymceOptions = {
                body_class: 'vlocity',
                menubar: true,
                //relative_urls: false,
                elementpath: false,
                plugins: [
                    'code advlist autolink lists link image charmap preview hr anchor pagebreak',
                    'searchreplace wordcount visualblocks visualchars code fullscreen',
                    'insertdatetime table media nonbreaking contextmenu directionality',
                    'template paste textcolor colorpicker textpattern imagetools ' + this.plugins
                ],
                imagetools_toolbar: 'imageoptions',
                menu: {
                    edit: {
                        title: 'Edit',
                        items: 'undo redo | cut copy paste pastetext | selectall'
                    },
                    insert: {
                        title: 'Insert',
                        items: 'link image | anchor hr charmap insertdatetime'
                    },
                    view: {
                        title: 'View',
                        items: 'visualaid preview '
                    },
                    format: {
                        title: 'Format',
                        items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'
                    },
                    table: {
                        title: 'Table',
                        items: 'inserttable tableprops deletetable | cell row column'
                    },
                    tools: {
                        title: 'Tools',
                        items: 'spellchecker code'
                    }
                },
                default_link_target: '_blank',
                file_browser_callback: function (fieldName, url, type, win) {
                    self.openDocInsertWindow(tinyMCE, fieldName, type);
                },
                toolbar1: 'undo redo | styleselect | bold italic |' +
                ' alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                toolbar2: 'preview | forecolor backcolor | code | example | ltr rtl',
                content_css: stylesheetref[0].getAttribute('href'),
                extended_valid_elements: 'button[*],a[*],p[*],ul[*],input[*],li[*],' +
                'nav[*],script[language|type|src|defer],select[*]',
                forced_root_block: 'p'
            };

            this.init = function(documents) {
                self.documents = documents.map(function(document) {
                    ((document.Type && document.Type.indexOf('image') !== -1) ||  self.supportedFormats.includes(document.Type)) &&
                        (function() {
                            if (document.IsPublic){
                                self.imageDocs.push('\<span id=' + document.Id +
                                                    '\&\&docName=' + document.DeveloperName +
                                                    '\&\&oid=' + window.oid +
                                                    '> ' +document.Name +'\</span>');
                            }
                        }());

                    return '\<span id=' + document.Id + '\&\&docName=' +
                        document.DeveloperName + '> ' +  document.Name +'\</span>' ;
                });
            };

            remoteActions.getAllDocuments().then(function(documents) {
                self.init(documents);
            });

            remoteActions.getLanguageCodeMap().then(function(langCodeMap){
                var langMap = [];

                angular.forEach(langCodeMap, function(key, value){
                    langMap.push({text: value, value: key });
                });

                window.tinymce.getLanguageCodeMap = function(){
                    return langMap;
                };
            });

            window.tinyMCE.remoteCall = function(searchKey, status, langCode) {
                searchKey = searchKey || '';
                status = status || '' ;
                langCode = langCode || '';
                return remoteActions.getKnowledgeArticles(searchKey, status, langCode);
            };

            this.openDocInsertWindow = function(tinyMCE,field_name, type) {
                var input = {};
                input.fieldName = field_name || '';
                input.imageInsert = (type === 'image') ? true : false;

                input.callback = function(bstring, name, type) {
                    return remoteActions.uploadDocument(btoa(bstring),name, type); //this returns a promise
                };

                input.getTest = function(){
                    return self.names;
                };

                input.getDocs = function() {
                    if (type === 'image') {
                        return self.imageDocs;
                    }else {
                        return self.documents;
                    }
                };

                tinyMCE.activeEditor.editorCommands.execCommand('openDocInsertWindow', function() {
                    return input;
                });
            };

        }]);

}());

},{}],87:[function(require,module,exports){
var templateMgr = require('../../oui/util/vlcUiTempMgr.js');

(function() {
    'use strict';

    angular
        .module('omniscriptDesigner')
        .service('vlocityUiTemplateService', VlocityUiTemplateService);

    VlocityUiTemplateService.$inject = ['remoteActions', '$q'];
    function VlocityUiTemplateService(remoteActions, $q) {
        var templates;
        function loadTemplates() {
            return remoteActions.loadVlocityUITemplates().then(function(uiTemplates) {
                templates = uiTemplates.map(function(uiTemplate) {
                    return {
                        Id: uiTemplate.Id,
                        Name: uiTemplate.Name,
                        Type__c: uiTemplate[ns + 'Type__c']
                    };
                });
                return templates = _.sortBy(templates, [function(o) { return o.Name.toLowerCase() }]);
            });
        }
        this.getGeneralTemplates = function getGeneralTemplates() {
            if (!templates) {
                return loadTemplates()
                    .then(function() {
                        return getGeneralTemplates();
                    });
            }
            return $q.resolve(templateMgr.getGenTemplates(templates));
        };
    }
})();

},{"../../oui/util/vlcUiTempMgr.js":97}],88:[function(require,module,exports){

},{}],89:[function(require,module,exports){
angular.module("oui", ["vlocity"]);

require('./factory/Save.js');

},{"./factory/Save.js":90}],90:[function(require,module,exports){
/* global History, ns */
var ScriptElement = require('../util/ScriptElement.js');
var unescapeHTML = require('../util/HtmlEncodeDecode.js').unescapeHTML;

angular.module('oui')
    .factory('save', function ($q, remoteActions, $rootScope, $timeout, $localizable, isIntegrationProcedure, $sldsToast) {
        'use strict';
        var promisesInProgress = {};

        function saveVisitor(element) {
            var isScriptElement = (element === $rootScope.scriptElement);
            var isNewElement = !element.Id;
            var elementId = element.Id ? element.Id : (isNewElement && isScriptElement ? 'scriptElement' : element.Name);

            var promise = doSave(element);
            if (promise && elementId) {
                var chain = promisesInProgress[elementId];
                if (!chain) {
                    promisesInProgress[elementId] = [];
                }
                promisesInProgress[elementId].push(promise);
            }
            return promise;
        }

        function getNameOrNull(property) {
            return property ? unescapeHTML(property.Name) : null;
        }

        function compare(str1, str2) {
            return str1 && str2 &&
                String(str1).toUpperCase() === String(str2).toUpperCase();
        }

        function doSave(element) {
            var isScriptElement = (element === $rootScope.scriptElement);
            var isNewElement = !element.Id;
            var elementId = element.Id;
            var flag = false;

            if ($rootScope.scriptElement.IsActive__c || element.deleted || element.deleting) {
                return $q.when(element);
            }

            if ($rootScope.scriptElement.activating) {
                return;
            }

            if (element.saving) {
                if (isNewElement) {
                    if (isScriptElement) {
                        elementId = 'scriptElement';
                    } else {
                        elementId = element.Name;
                    }
                }
                // queue this save
                var currentChain = promisesInProgress[elementId];
                if (currentChain) {
                    return currentChain[currentChain.length - 1].then(function () {
                        var previousJson = element.originalJson,
                            json = element.asJson();
                        var isEqualToOldJson = angular.equals(json, previousJson);
                        if (!isEqualToOldJson) {
                            saveVisitor(element);
                        }
                    });
                } else {
                    promisesInProgress[elementId] = [];
                }
            } else if (elementId) {
                promisesInProgress[elementId] = [];
            }
            var previousJson = element.originalJson,
                json = element.asJson();
            var isEqualToOldJson = angular.equals(json, previousJson);

            //check name and type/subtype before checking if there is a difference
            //reason : enforcing character validation
            if (!element.Name || element.Name === '') {
                element.setErrors([{
                    message: $localizable('OmniDesMustSetName', 'You must set a name')
                }]);
                return $q.when(element);
            } else if (isEqualToOldJson && !isNewElement && !element.errors) {
                return $q.when(element);
            } else if (element.type() === 'DocuSign Envelope Action') {
                var list = element.PropertySet__c.docuSignTemplatesGroup;
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        var signerList = list[i].signerList;
                        for (var j = 0; j < signerList.length; j++) {
                            flag = ((signerList[j].signerName === undefined || signerList[j].signerName === '') ||
                                (signerList[j].signerEmail === undefined || signerList[j].signerEmail === '') ||
                                (signerList[j].templateRole === undefined || signerList[j].templateRole === ''));
                            if (flag) {
                                break;
                            }
                        }
                        if (flag) {
                            break;
                        }
                    }
                    if (flag) {
                        element.setErrors([{
                            message: $localizable('OmniDesDocuRecipientErr', 'Please complete recipient information')
                        }]);
                        return $q.when(element);
                    }
                }
            } else if (element.type() === 'DocuSign Signature Action') {
                var listSig = element.PropertySet__c.docuSignTemplatesGroupSig;
                if (listSig) {
                    for (var k = 0; k < listSig.length; k++) {
                        flag = ((listSig[k].docuSignTemplate === undefined || listSig[k].docuSignTemplate === '') ||
                            (listSig[k].templateRole === undefined || listSig[k].templateRole === ''));
                        if (flag) {
                            break;
                        }
                    }
                    if (flag) {
                        element.setErrors([{
                            message: $localizable('OmniDesDocuTemplateErr', 'Please complete template information')
                        }]);
                        return $q.when(element);
                    }
                }
            } else if (element.type() === 'Edit Block') {
                var listsObMap = element.PropertySet__c.sobjectMapping;
                if (listsObMap) {
                    for (var l = 0; l < listsObMap.length; l++) {
                        flag = ((listsObMap[l].osElement === undefined || listsObMap[l].osElement === '') ||
                            (listsObMap[l].sObjectField === undefined || listsObMap[l].sObjectField === ''));
                        if (flag) {
                            break;
                        }
                    }
                    if (flag) {
                        element.setErrors([{
                            message: $localizable('OmniEditBlockMappingErr', 'Please complete sObject Maping')
                        }]);
                        return $q.when(element);
                    }
                }
            }
            // we haven't full initialized the propertyset from the server if we only have 3 keys (show, label and disOnTplt)
            if (Object.keys(element.PropertySet__c).length < 4 && !isScriptElement) {
                return $q.when(element);
            }
            if (element.originalJson && (element.originalJson[ns + 'Version__c'] === json[ns + 'Version__c'])) {
                delete json[ns + 'Version__c'];
            }
            element.originalJson = json;
            element.setSaving();
            var saveFn = (element instanceof ScriptElement) ? remoteActions.saveOmniScript : remoteActions.saveElement;
            $rootScope.$broadcast('save', element);
            return saveFn.call(remoteActions, json)
                .then(function (result) {
                    var promises = [];
                    element.saving = false;
                    if (result.success) {
                        $rootScope.$broadcast('saved', element);
                        if (isNewElement) {
                            element.setId(result.id);
                            // if update the Id and have children then we need to save them all too
                            if (element.children.length > 0) {
                                for (var i = 0; i < element.children.length; i++) {
                                    promises.push(saveVisitor(element.children[i]));
                                }
                            }
                            if (isScriptElement && isNewElement) {
                                $timeout(function () {
                                    var location = window.location;
                                    var pageName = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
                                    var newUrl = '/apex/' + ns + pageName +
                                        (location.search.length === 0 ? '?' : location.search + '&') +
                                        'id=' + result.id;
                                    if (window.top !== window) {
                                        if (window.sforce && window.sforce.console && window.sforce.console.isInConsole()) {
                                            sforce.console.getEnclosingPrimaryTabId(function (parentTabResponse) {
                                                sforce.console.getEnclosingTabId(function (response) {
                                                    if (response.id === parentTabResponse.id) {
                                                        sforce.console.openPrimaryTab(null, newUrl, true);
                                                    } else {
                                                        sforce.console.openSubtab(parentTabResponse.id, newUrl, true);
                                                    }
                                                    sforce.console.closeTab(response.id);
                                                });
                                            });
                                        } else if (window.sforce && window.sforce.one && window.sforce.one.navigateToURL) {
                                            window.sforce.one.navigateToURL(newUrl);
                                        } else {
                                            History.pushState('', '', newUrl);
                                        }
                                    } else {
                                        History.pushState('', '', newUrl);
                                    }
                                });
                            }
                        }
                        if (isScriptElement) {
                            var titleEl = document.querySelector('title');
                            if (titleEl) {
                                titleEl.innerText = (isIntegrationProcedure ? 'IP: ' : 'OmniScript: ') +
                                    $rootScope.scriptElement.Name;
                            }
                            // also need to update the language in case it was default to the users language
                            promises.push(remoteActions.getOmniScript($rootScope.scriptElement.Id)
                                .then(function (omniScriptResult) {
                                    var scriptElement = $rootScope.scriptElement;
                                    if (omniScriptResult[ns + 'Language__c'] &&
                                        !/&/.test(omniScriptResult[ns + 'Language__c'])) {
                                        scriptElement.Language__c = omniScriptResult[ns + 'Language__c'];
                                    }
                                    if (omniScriptResult[ns + 'Type__c'] &&
                                        compare(omniScriptResult[ns + 'Type__c'], scriptElement.Type__c)) {
                                        scriptElement.Type__c = omniScriptResult[ns + 'Type__c'];           // Replace due OWC-337
                                    }
                                    if (omniScriptResult[ns + 'SubType__c'] &&
                                        compare(omniScriptResult[ns + 'SubType__c'], scriptElement.SubType__c)) {
                                        scriptElement.SubType__c = omniScriptResult[ns + 'SubType__c'];           // Replace due OWC-337
                                    }
                                    scriptElement.Version__c = omniScriptResult[ns + 'Version__c'];
                                    scriptElement.LastModifiedDate = omniScriptResult.LastModifiedDate;
                                    scriptElement.LastModifiedById = omniScriptResult.LastModifiedById;
                                    scriptElement.LastModifiedBy = getNameOrNull(omniScriptResult.LastModifiedBy);
                                    if (isNewElement) {
                                        // also update the Version, Owner & Created fields
                                        scriptElement.CreatedById = omniScriptResult.CreatedById;
                                        scriptElement.CreatedDate = omniScriptResult.CreatedDate;
                                        scriptElement.CreatedBy = getNameOrNull(omniScriptResult.CreatedBy);
                                        scriptElement.Owner = getNameOrNull(omniScriptResult.Owner);
                                    }
                                }));
                        }
                    } else {
                        element.setErrors(result.errors);
                    }
                    if (promises) {
                        return $q.all(promises).then(function () {
                            return element;
                        });
                    }
                    return element;
                }).catch(function (err) {
                    $sldsToast({
                        title: 'Failed to save',
                        content: err && err.message ? err.message : JSON.stringify(err),
                        severity: 'error',
                        autohide: false
                    });
                });
        }

        return saveVisitor;
    });

},{"../util/HtmlEncodeDecode.js":92,"../util/ScriptElement.js":94}],91:[function(require,module,exports){
/* globals ns */
'use strict';
var idFunction = require('../util/generateId.js');
var unescapeHTML = require('../util/HtmlEncodeDecode.js').unescapeHTML;
var PaletteElement = require('../util/PaletteElement.js');
var ScriptElement = require('../util/ScriptElement.js');
var requiredProperties = require('../util/requiredProperties.js');
var nameSpacePropsRegex = /^(Active__c|Level__c|OmniScriptId__c|OmniScriptVersion__c|Order__c|ParentElementId__c|ReusableOmniScript__c|SearchKey__c|Type__c|InternalNotes__c)$/i;

/*
 * Represents an element in the middle canvas
 * which may have one or more children
 */
function CanvasElement(paletteElement) {
    if (!paletteElement) {
        throw 'You must set a PaletteElement';
    }
    this.Type__c = paletteElement;
    this.ParentElementId__c = null;
    if (paletteElement.scriptElement) {
        this.PropertySet__c = {
            'Type': paletteElement.scriptElement.Type__c,
            'Sub Type': paletteElement.scriptElement.SubType__c,
            'Language': paletteElement.scriptElement.Language__c
        };
    } else {
        this.PropertySet__c = {};
    }
    this.PropertySet__c.show = {
        group: {
            operator: 'AND',
            rules: []
        }
    };
    this.OmniScriptId__c = null;
    this.SearchKey__c = null;
    this.Order__c = null;
    this.Active__c = true;
    this.Name = idFunction(this.Type__c.prettyName(true));
    this.Id = null;
    this.InternalNotes__c = null;
    this.children = [];
    var me = this;
    this.children.splice = function () {
        if (arguments.length === 3) {
            arguments[2].ParentElementId__c = me.Id;
            arguments[2].OmniScriptId__c = me.OmniScriptId__c;
        }
        var result = Array.prototype.splice.apply(this, arguments);
        // update Order__c
        for (var i = 0; i < this.length; i++) {
            this[i].Order__c = i + 1;
        }
        return result;
    };
}

CanvasElement.prototype.type = function () {
    return this.Type__c.label;
};

CanvasElement.fromJson = function (json) {
    var propSet = JSON.parse(json[ns + 'PropertySet__c']);
    if (propSet == null) {
        propSet = {};
    }
    var paletteElement = PaletteElement.getPaletteElement(json[ns + 'Type__c'], propSet);
    if (!paletteElement) {
        console.log('Warning: Couldn\'t find existing palatte element for ' + json[ns + 'Type__c']);
        paletteElement = PaletteElement.factory(angular.extend({
            Name: json[ns + 'Type__c']
        }, propSet));
    }
    var canvasElement = new CanvasElement(paletteElement);
    canvasElement.Id = json.Id;
    canvasElement.Name = unescapeHTML(json.Name);
    idFunction.registerExistingPrefix(json.Name);
    canvasElement.ParentElementId__c = json[ns + 'ParentElementId__c'];
    canvasElement.PropertySet__c = propSet;
    canvasElement.OmniScriptId__c = json[ns + 'OmniScriptId__c'];
    canvasElement.SearchKey__c = json[ns + 'SearchKey__c'];
    canvasElement.Order__c = json[ns + 'Order__c'];
    canvasElement.Level__c = json[ns + 'Level__c'];
    canvasElement.Active__c = json[ns + 'Active__c'];
    canvasElement.InternalNotes__c = json[ns + 'InternalNotes__c'] ? unescapeHTML(json[ns + 'InternalNotes__c']) : null;
    if (!canvasElement.PropertySet__c.show) {
        canvasElement.PropertySet__c.show = {
            group: {
                operator: 'AND',
                rules: []
            }
        };
    }
    if (propSet.hasOwnProperty('showPersistentComponent')) {
        propSet.showPersistentComponent = CanvasElement.convertShowPersistentComponentToMap(canvasElement, propSet);
    }
    allElementsById[json.Id] = canvasElement;
    canvasElement.originalJson = json;
    return canvasElement;
};

CanvasElement.convertShowPersistentComponentToMap = function (canvasElement, propSet) {
    // convert from array of true/false into map of persistentComponentId to bool
    var scriptElement = canvasElement.scriptElement();
    if (!scriptElement) {
        return [];
    }
    var newShowPersistentComponent = {};
    if (angular.isArray(scriptElement.PropertySet__c.persistentComponent)) {
        if (!angular.isArray(propSet.showPersistentComponent)) {
            propSet.showPersistentComponent = [propSet.showPersistentComponent];
        }
        scriptElement.PropertySet__c.persistentComponent.forEach(function (persistentComponent, index) {
            newShowPersistentComponent[persistentComponent.id] = propSet.showPersistentComponent.length > index ? propSet.showPersistentComponent[index] || false : false;
        });
    }
    return newShowPersistentComponent;
};

CanvasElement.prototype.allowsChild = function (childPaletteElement) {
    var childLabel = childPaletteElement.label,
        isAllowedAsChild = false;
    switch (this.type()) {
        case 'OmniScript':
            isAllowedAsChild = /^(OmniScript|Step)$/.test(childLabel);
            break;
        case 'Step':
            isAllowedAsChild = !childPaletteElement.isNavigation();
            break;
        case 'Block':
            isAllowedAsChild = !childPaletteElement.isNavigation() && !childPaletteElement.isGroupedControl();
            break;
        default:
            break;
    }
    return isAllowedAsChild;
};

CanvasElement.prototype.allowedTypes = function () {
    return this.Type__c.allowedTypes();
};

CanvasElement.prototype.allowsChildren = function () {
    return this.allowedTypes().length > 0;
};

CanvasElement.prototype.isBlock = function () {
    return /^Block$/.test(this.type());
};

CanvasElement.prototype.isStep = function () {
    return /Cache Block|Try Catch Block|Loop Block|Conditional Block/.test(this.type()) || /^Step/.test(this.type());
};

CanvasElement.prototype.isAction = function () {
    return /Action$/.test(this.type());
};

CanvasElement.prototype.isInput = function () {
    return this.Type__c.isInput();
};

CanvasElement.prototype.parent = function () {
    if (this.ParentElementId__c) {
        return CanvasElement.getById(this.ParentElementId__c);
    } else if (this.OmniScriptId__c) {
        return ScriptElement.getById(this.OmniScriptId__c);
    }
};

CanvasElement.prototype.scriptElement = function () {
    if (this.OmniScriptId__c) {
        return ScriptElement.getById(this.OmniScriptId__c);
    }
};

CanvasElement.prototype.delete = function () {
    this.deleted = true;
    var parent = this.parent();
    if (parent) {
        var existingIndex = parent.children.indexOf(this);
        parent.children.splice(existingIndex, 1);
        if (this.ParentElementId__c) {
            this.ParentElementId__c = null;
        } else if (this.OmniScriptId__c) {
            this.OmniScriptId__c = null;
        }
    }
};

CanvasElement.prototype.clone = function () {
    var newElement = new CanvasElement(this.Type__c);
    for (var i = 0; i < this.children.length; i++) {
        var childClone = this.children[i].clone();
        newElement.children.push(childClone);
    }
    for (var property in this) {
        if (this.hasOwnProperty(property) &&
            !angular.isObject(this[property]) &&
            !angular.isFunction(this[property]) &&
            !/^(\$\$hashKey|Id|Name)$/gi.test(property)) {
            newElement[property] = this[property];
        } else if (/^PropertySet__c$/.test(property)) {
            newElement[property] = angular.copy(this[property]);
        }
    }
    return newElement;
};

CanvasElement.prototype.setId = function (id) {
    this.Id = id;
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].ParentElementId__c = id;
    }
    allElementsById[id] = this;
};

CanvasElement.prototype.asJson = function () {
    var json = {
        Name: this.Name,
        Id: this.Id
    };
    for (var property in this) {
        if (this.hasOwnProperty(property)) {
            if (nameSpacePropsRegex.test(property) && (this[property] != null ||
                    // if null and the property didn't exist in originalJson
                    (this.originalJson && this[property] == null && this.originalJson[ns + property] != null))) {
                json[ns + property] = this[property];
            }
        }
    }
    var propSet = angular.copy(this.PropertySet__c);
    if (propSet.show) {
        propSet.show = resetExpressionIfEmpty(propSet.show);
    }
    if (propSet.validateExpression) {
        propSet.validateExpression = resetExpressionIfEmpty(propSet.validateExpression);
    }
    // OMNI-271 - only set label to name if this is the first time the Element
    //            is being saved
    if (this.Type__c.type !== 'OmniScript' && this.scriptElement().Language__c !== 'Multi-Language') {
        if (!propSet.label && !this.Id) {
            propSet.label = this.PropertySet__c.label = this.Name;
        } else if (propSet.label === '') {
            propSet.label = null;
        }
    }
    if (propSet.hasOwnProperty('showPersistentComponent')) {
        // turn this into an array based on order of persistentComponents in ScriptElement
        var scriptElement = this.scriptElement();
        if (scriptElement) {
            var arrayOfShowPersistentComponent = [];
            if (scriptElement.PropertySet__c.persistentComponent) {
                scriptElement.PropertySet__c.persistentComponent.forEach(function (persistentComponent, index) {
                    arrayOfShowPersistentComponent[index] = propSet.showPersistentComponent[persistentComponent.id];
                });
            }
            propSet.showPersistentComponent = arrayOfShowPersistentComponent;
        }
    }

    if (this.originalJson && this.originalJson[ns + 'PropertySet__c']) {
        propSet = cleanUnnecessaryEmptyPropsOnPropertySet(propSet,
            JSON.parse(this.originalJson[ns + 'PropertySet__c']),
            requiredProperties[this.type()]);
    }
    json[ns + 'PropertySet__c'] = JSON.stringify(propSet);
    if (this.Type__c.type === 'OmniScript') {
        json[ns + 'Type__c'] = 'OmniScript';
    } else {
        json[ns + 'Type__c'] = json[ns + 'Type__c'].label;
    }
    return json;
};

function cleanUnnecessaryEmptyPropsOnPropertySet(propSet, originalPropSet, skipProperties) {
    Object.keys(propSet).forEach(function (key) {
        if (skipProperties && skipProperties.indexOf(key) !== -1) {
            return;
        }
        if (propSet[key] === '' || propSet[key] == null) {
            if (originalPropSet[key] === undefined) {
                delete propSet[key];
            }
        }
    });
    return propSet;
}

function resetExpressionIfEmpty(object) {
    if (object && object.group && object.group.rules && object.group.rules.length === 0) {
        return null;
    }
    return object;
}

CanvasElement.prototype.setSaving = function () {
    if (this.OmniScriptId__c) {
        this.errors = null;
        this.saving = true;
    }
};

CanvasElement.prototype.setOmniScriptId = function (omniScriptId) {
    this.OmniScriptId__c = omniScriptId;
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].setOmniScriptId(omniScriptId);
    }
};

CanvasElement.prototype.toString = function () {
    return 'Element: ' + this.Name;
};

CanvasElement.prototype.setErrors = function (errors) {
    this.errors = errors;
};

CanvasElement.prototype.hasErrors = function (errors) {
    return this.errors && this.errors.length > 0;
};

CanvasElement.prototype.each = function (expFunction) {
    expFunction(this);
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].each(expFunction);
    }
};

var allElementsById = {};

CanvasElement.getById = function (id) {
    return allElementsById[id];
};

module.exports = CanvasElement;

},{"../util/HtmlEncodeDecode.js":92,"../util/PaletteElement.js":93,"../util/ScriptElement.js":94,"../util/generateId.js":95,"../util/requiredProperties.js":96}],92:[function(require,module,exports){
var escape = document.createElement('textarea');
function escapeHTML(html) {
    escape.innerHTML = html;
    return escape.innerHTML;
}

function unescapeHTML(html) {
    escape.innerHTML = html;
    return escape.value;
}

exports.escapeHTML = escapeHTML;
exports.unescapeHTML = unescapeHTML;

},{}],93:[function(require,module,exports){
var ScriptElement = require('../util/ScriptElement.js');

/*
 * Represents an Element in the palatte
 * of drag/droppable canvas elements
 */
function PaletteElement(label, type, scriptElement) {
    'use strict';
    this.label = label;
    this.type = type;
    this.scriptElement = scriptElement;

    if (elementsSupportedInLwc.includes(label) === true || type === 'OmniScript') {
        this.lwcEnabled = true;
    }
}

const elementsSupportedInLwc = ["DataRaptor Extract Action", "DataRaptor Turbo Action", "DataRaptor Transform Action", "DataRaptor Post Action",
    "Integration Procedure Action", "Navigate Action", "Remote Action", "Rest Action", "Set Values", "Set Errors", "Text Block", "Formula",
    "Radio Group", "Step", "Checkbox", "Currency", "Custom Lightning Web Component", "Date", "Date/Time (Local)", "Email", "Lookup", "Multi-select",
    "Number", "OmniScript", "Radio", "Range", "Select", "Telephone", "Text", "Text Area", "Time", "URL", "DocuSign Envelope Action",
    "DocuSign Signature Action", "Email Action", "Validation", "Block", "Edit Block", "Type Ahead Block", "File", "Image", "Password",
    "Action Block", "Disclosure", "Calculation Action", "Aggregate", "Matrix Action", "Delete Action", "Line Break"
];

PaletteElement.prototype.prettyName = function (isDropped) {
    'use strict';
    if (/Rest/i.test(this.label)) {
        if (/^rest action$/i.test(this.label))
            return this.label.replace(/\brest\b/i, 'HTTP');
        else
            return this.label.replace(/\brest\b/i, 'REST');
    } else if (/^Validation$/.test(this.label)) {
        return 'Messaging';
    } else if (/^Custom Lightning Web Component$/.test(this.label)) {
        return 'Custom LWC';
    } else if (isDropped && /^Type Ahead Block$/.test(this.label)) {
        return this.label.substring(0, this.label.lastIndexOf('Block')-1);
    //OMNI-2769
    } else if (/^Date\/Time \(Local\)$/.test(this.label)) {
        return "Date\/Time";
    } else if (/List Merge Action/.test(this.label)) {
        return "List Action";
    } else {
        return this.label;
    }
};

PaletteElement.prototype.isNavigation = function() {
    'use strict';
    return this.type == 'navigation';
};

PaletteElement.prototype.isScript = function() {
    'use strict';
    return this.type == 'OmniScript';
};

PaletteElement.prototype.isGroupedControl = function() {
    'use strict';
    return this.type == 'groupedControl';
};

PaletteElement.prototype.isInput = function() {
    'use strict';
    return (this.type == 'input' || this.type == 'typeahead-excluded-input' || this.type == 'editblock-excluded-input');
};

PaletteElement.prototype.isAction = function() {
    'use strict';
    return (this.type == 'action' || this.type == 'typeahead-action' || this.type == 'common-action' || this.type == 'editblock-action');
};

PaletteElement.prototype.toString = function() {
    'use strict';
    return 'Palette: ' + this.label;
};

PaletteElement.prototype.allowedTypes = function() {
    'use strict';
    if (this.label === 'OmniScript' || /^Input Block$/i.test(this.label) || /^Radio Group$/i.test(this.label)) {
        return [];
    }

    if (this.label === 'Conditional Block' || this.label === 'Loop Block' || this.label === 'Cache Block' || this.label === 'Try Catch Block') {
        return ['navigation','action', 'typeahead-action', 'common-action', 'editblock-action', 'input', 'typeahead-excluded-input', 'editblock-excluded-input', 'groupedControl', 'selectable-items', 'inputblock', 'filterblock', 'docuSign-signature-action', 'typeahead-block','edit-block', 'radiogroup'];
    } else if (this.label === 'Step') {
        return ['action', 'typeahead-action', 'common-action', 'editblock-action', 'input', 'typeahead-excluded-input', 'editblock-excluded-input', 'groupedControl', 'selectable-items', 'inputblock', 'filterblock', 'docuSign-signature-action', 'typeahead-block','edit-block', 'radiogroup', 'action-block'];
    } else if (this.isNavigation()) {
        return ['action', 'typeahead-action', 'common-action', 'editblock-action', 'input', 'typeahead-excluded-input', 'editblock-excluded-input', 'groupedControl', 'filterblock','edit-block', 'radiogroup'];
    } else if (this.isGroupedControl()) {
        return ['action', 'typeahead-action', 'common-action', 'editblock-action', 'input', 'typeahead-excluded-input', 'editblock-excluded-input', 'selectable-items', 'groupedControl', 'docuSign-signature-action', 'typeahead-block', 'radiogroup'];
    } else if (this.type == 'filterblock') {
        return ['filter'];
    } else if (this.type == 'typeahead-block') {
        return ['typeahead-action', 'common-action', 'input'];
    } else if(this.type == 'edit-block') {
        return ['editblock-action', 'common-action', 'input', 'typeahead-excluded-input', 'groupedControl', 'typeahead-block', 'radiogroup'];
    } else if (this.type === 'action-block') {
        return ['action', 'common-action', 'typeahead-action', 'editblock-action'];
    } else {
        return [];
    }
};

PaletteElement.factory = function(label) {
    'use strict';
    var paletteElement = null;
    if (angular.isString(label)) {
        if (/^(Step|OmniScript|Conditional Block|Loop Block|Cache Block|Try Catch Block)$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'navigation');
        } else if (/^OmniForm$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'action');
        } else if (/^Block$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'groupedControl');
        } else if (/^DocuSign Signature Action/i.test(label)) {
            paletteElement = new PaletteElement(label, 'docuSign-signature-action');
        } else if (/(Action$|^Set)/i.test(label)) {
            if (/^DataRaptor Extract Action$/i.test(label) || /^Calculation Action$/i.test(label) || /^DataRaptor Turbo Action$/i.test(label)) {
                paletteElement = new PaletteElement(label, 'typeahead-action');
            } else if(/^Matrix Action$/i.test(label) || /^Delete Action$/i.test(label)) {
                paletteElement = new PaletteElement(label, 'editblock-action');
            } else if(/^Remote Action$/i.test(label) || /^Rest Action$/i.test(label) || /^Integration Procedure Action$/i.test(label)) {
                paletteElement = new PaletteElement(label, 'common-action');
            } else {
                paletteElement = new PaletteElement(label, 'action');
            }
        } else if (/^Filter Block$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'filterblock');
        } else if (/^Filter$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'filter');
        } else if (/^Input Block$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'inputblock');
        } else if (/^Radio Group$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'radiogroup');
        } else if (/^Selectable Items/i.test(label)) {
            paletteElement = new PaletteElement(label, 'selectable-items');
        } else if (/^Type Ahead Block$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'typeahead-block');
        } else if (/^Edit Block$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'edit-block');
        } else if (/^Action Block$/i.test(label)) {
            paletteElement = new PaletteElement(label, 'action-block')
        } else {
            if(editBlockExcludedElements[label]) {
                paletteElement = new PaletteElement(label, 'editblock-excluded-input');
            } else if (!typeaheadExcludedElements[label]) {
                paletteElement = new PaletteElement(label, 'input');
            } else {
                paletteElement = new PaletteElement(label, 'typeahead-excluded-input');
            }
        }
        allElements[label] = paletteElement;
    } else if (label instanceof ScriptElement) {
        var scriptElement = label;
        paletteElement = new PaletteElement(scriptElement.Name, 'OmniScript', scriptElement);
    } else if (angular.isObject(label)) {
        var json = label;
        paletteElement = new PaletteElement(unescapeHTML(json.Name), 'OmniScript',{
            Type__c:     json[ns + 'Type__c'] ? unescapeHTML(json[ns + 'Type__c']) : null,
            SubType__c:  json[ns + 'SubType__c'] ? unescapeHTML(json[ns + 'SubType__c']) : null,
            Language__c: json[ns + 'Language__c'] ? unescapeHTML(json[ns + 'Language__c']) : null
        });
    }
    return paletteElement;
};

PaletteElement.getPaletteElement = function(label, configuration, scriptEle) {
    'use strict';
    if (label === 'OmniForm' || (
        !configuration.hasOwnProperty('Type') &&
        !configuration.hasOwnProperty('Sub Type') &&
        !configuration.hasOwnProperty('Language'))) {
        if (allElements[label]) {
            return allElements[label];
        } else {
            return new PaletteElement(label, configuration);
        }
    } else {
        // need to look up for a re-usable script with the matching
        // Type__c, SubType__c and Language__c
        try {
            return allElements.scripts[configuration.Type][configuration['Sub Type']][configuration.Language];
        } catch (e) {
            return new PaletteElement(label, "OmniScript", scriptEle);
        }
    }
};

var allElements = {
    'scripts': {}
};

var typeaheadExcludedElements = {
    'Disclosure':'Disclosure',
    'File':'File',
    'Filter':'Filter',
    'Image':'Image',
    'Lookup':'Lookup',
    'Password':'Password',
    'Signature':'Signature',
    'Headline':'Headline',
    'Text Block':'Text Block',
    'Geolocation':'Geolocation',
    'Validation':'Validation'
};

var editBlockExcludedElements = {
    'Submit':'Submit',
    'Geolocation':'Geolocation'
}

module.exports = PaletteElement;

},{"../util/ScriptElement.js":94}],94:[function(require,module,exports){
/* globals ns */
'use strict';
var unescapeHTML = require('../util/HtmlEncodeDecode.js').unescapeHTML;
var nameSpacePropsRegex = /(IsActive__c|AdditionalInformation__c|DataRaptorBundleId__c|DataRaptorBundleName__c|IsReusable__c|IsProcedure__c|JSON_Output__c|Language__c|SubType__c|Type__c|Version__c|TestHTMLTemplates__c|CustomJavaScript__c|LastPreviewPage__c|IsLwcEnabled__c|ProcedureResponseCacheType__c|DisableMetadataCache__c|RequiredPermission__c)$/i;
var allScriptsById = {};

/*
 * ScriptElement represents the OmniScript root object all
 * forms are designed for
 */
function ScriptElement(json) {
    this.Id = json.Id;
    if (this.Id) {
        // OMNI-559 - do not clobber the existing instance
        //            instead return it
        if (allScriptsById[this.Id]) {
            return allScriptsById[this.Id];
        }
        allScriptsById[this.Id] = this;
    }
    this.Type__c = json[ns + 'Type__c'] ? unescapeHTML(json[ns + 'Type__c']) : null;
    this.SubType__c = json[ns + 'SubType__c'] ? unescapeHTML(json[ns + 'SubType__c']) : null;
    if (json[ns + 'PropertySet__c']) {
        this.PropertySet__c = JSON.parse(unescapeHTML(json[ns + 'PropertySet__c']));
    } else {
        this.PropertySet__c = {};
    }
    this.TestHTMLTemplates__c = json[ns + 'TestHTMLTemplates__c'] ?
        unescapeHTML(json[ns + 'TestHTMLTemplates__c']) : '';
    this.CustomJavaScript__c = json[ns + 'CustomJavaScript__c'] ?
        unescapeHTML(json[ns + 'CustomJavaScript__c']) : '';
    this.IsActive__c = json[ns + 'IsActive__c'];
    this.IsReusable__c = !!json[ns + 'IsReusable__c'];
    this.Version__c = json[ns + 'Version__c'];
    this.Language__c = json[ns + 'Language__c'] ? unescapeHTML(json[ns + 'Language__c']) : null;
    this.DataRaptorBundleId__c = json[ns + 'DataRaptorBundleId__c'] ? json[ns + 'DataRaptorBundleId__c'] : null;
    this.Version__c = json[ns + 'Version__c'];
    this.LastPreviewPage__c = json[ns + 'LastPreviewPage__c'] ? unescapeHTML(json[ns + 'LastPreviewPage__c']) : null;
    this.IsProcedure__c = !!json[ns + 'IsProcedure__c'];
    this.IsLwcEnabled__c = !!json[ns + 'IsLwcEnabled__c'];
    this.CanvasType = this.IsProcedure__c ? 'Procedure Configuration' : 'Script Configuration';
    this.Name = unescapeHTML(json.Name);
    this.OwnerId = json.OwnerId;
    this.Owner = json.Owner ? unescapeHTML(json.Owner.Name) : null;
    this.CreatedById = json.CreatedById;
    this.CreatedBy = json.CreatedBy ? unescapeHTML(json.CreatedBy.Name) : null;
    this.CreatedDate = json.CreatedDate;
    this.LastModifiedDate = json.LastModifiedDate;
    this.LastModifiedById = json.LastModifiedById;
    this.LastModifiedBy = json.LastModifiedBy ? unescapeHTML(json.LastModifiedBy.Name) : null;
    this.children = [];
    this.AdditionalInformation__c = json[ns + 'AdditionalInformation__c'] ?
        unescapeHTML(json[ns + 'AdditionalInformation__c']) : null;
    this.ProcedureResponseCacheType__c = json[ns + 'ProcedureResponseCacheType__c'] ? json[ns + 'ProcedureResponseCacheType__c'] : '';
    this.DisableMetadataCache__c = !!json[ns + 'DisableMetadataCache__c'];
    this.RequiredPermission__c = json[ns + 'RequiredPermission__c'] ? json[ns + 'RequiredPermission__c'] : '';
    // fix up persistentComponent to be an array
    if (this.PropertySet__c.persistentComponent && !angular.isArray(this.PropertySet__c.persistentComponent)) {
        this.PropertySet__c.persistentComponent = [this.PropertySet__c.persistentComponent];
    }
    var me = this;
    this.children.splice = function () {
        if (arguments.length === 3) {
            arguments[2].OmniScriptId__c = me.Id;
        }
        var result = Array.prototype.splice.apply(this, arguments);
        // update Order__c
        for (var i = 0; i < this.length; i++) {
            this[i].Order__c = i + 1;
        }
        return result;
    };
    this.originalJson = this.asJson();
}

ScriptElement.prototype.isAction = function () {
    return false;
};

ScriptElement.prototype.allowedTypes = function () {
    return ['navigation', 'action', 'typeahead-action', 'editblock-action', 'common-action', 'OmniScript', 'action-block'];
};

ScriptElement.prototype.type = function () {
    return this.CanvasType;
};

ScriptElement.prototype.setId = function (id) {
    this.Id = id;
    if (this.children) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].setOmniScriptId(id);
        }
    }
    allScriptsById[this.Id] = this;
};

ScriptElement.prototype.asJson = function () {
    var json = {
        Name: this.Name,
        Id: this.Id
    };
    for (var property in this) {
        if (nameSpacePropsRegex.test(property)) {
            json[ns + property] = this[property];
        }
    }
    var propSet = angular.copy(this.PropertySet__c);
    json[ns + 'PropertySet__c'] = JSON.stringify(propSet);
    return json;
};

ScriptElement.prototype.setSaving = function () {
    this.errors = null;
    this.saving = true;
};

ScriptElement.prototype.setErrors = function (errors) {
    this.errors = errors;
};

ScriptElement.prototype.hasErrors = function (errors) {
    return this.errors && this.errors.length > 0;
};

ScriptElement.getById = function (id) {
    return allScriptsById[id];
};

ScriptElement.prototype.each = function (expFunction) {
    expFunction(this);
    if (this.children) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].each(expFunction);
        }
    }
};

ScriptElement.prototype.scriptElement = function () {
    return this;
};

ScriptElement.reset = function () {
    allScriptsById = {};
};

module.exports = ScriptElement;

},{"../util/HtmlEncodeDecode.js":92}],95:[function(require,module,exports){
var idFunction = (function idFunction() {
  var prefixCounts = {"OmniScript Component": 1};
  var fn = function(prefix) {
    prefix = prefix ? prefix : "OmniScript Component";
    prefix = prefix.replace(/\brest\b/i, "REST");
    if (!prefixCounts[prefix]) {
      prefixCounts[prefix] = 1;
    }
    // string is never null
    return (prefix + " " + (prefixCounts[prefix]++)).replace(/\s/g,'');
  };
  fn.registerExistingPrefix = function(name) {
    var nameParts = name.split(/(?=[A-Z0-9 ])/);
    if (!isNaN(nameParts[nameParts.length - 1])) {
      var count = parseInt(nameParts[nameParts.length - 1], 10),
          key = nameParts.splice(0, nameParts.length - 1).join(' ');
      if (!prefixCounts[key] || prefixCounts[key] <= count) {
        prefixCounts[key] = count + 1;
      }
    }
  };
  return fn;
})();
module.exports = idFunction;
},{}],96:[function(require,module,exports){
var requiredProperties = {
    'Selectable Items': [
        'modalHTMLTemplateId','modalController','modalSize',
        'maxCompareSize','modalConfigurationSetting', 'accessibleInFutureSteps'
    ],
    'Block':['conditionType', 'accessibleInFutureSteps', 'repeatClone'],
    'Checkbox':['conditionType', 'accessibleInFutureSteps', 'repeatClone','readOnly', 
      'optionSource', 'controllingField'],
    'Currency':['conditionType','debounceValue', 'repeatClone','readOnly'],
    'Date':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Date/Time (Local)':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Disclosure':['conditionType', 'accessibleInFutureSteps','readOnly'],
    'Email':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Lookup':['conditionType', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Multi-select':['conditionType', 'accessibleInFutureSteps', 'repeatClone','readOnly', 'horizontalMode',
       'optionSource', 'controllingField'],
    'Number':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Password':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Radio':['conditionType', 'accessibleInFutureSteps', 'repeatClone','readOnly', 
      'horizontalMode', 'optionSource', 'controllingField'],
    'Range':['conditionType', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Select':['conditionType', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Signature':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Step':['conditionType', 'knowledgeOptions', 'remoteOptions', 'remoteClass', 'remoteMethod', 'remoteTimeout'],
    'Telephone':['conditionType', 'accessibleInFutureSteps', 'debounceValue', 'repeatClone','readOnly'],
    'Text':['conditionType', 'accessibleInFutureSteps', 'debounceValue', 'repeatClone','readOnly'],
    'Text Area':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Time':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'URL':['conditionType', 'debounceValue', 'accessibleInFutureSteps', 'repeatClone','readOnly'],
    'Filter Block':['accessibleInFutureSteps'],
    'Filter':['accessibleInFutureSteps'],
    'Input Block':['accessibleInFutureSteps']
};

module.exports = requiredProperties;
},{}],97:[function(require,module,exports){
(function () {
    'use strict';
    /*jshint -W030*/

    var tempMgr  = {
        ootb : {
            ' ': null,
            'vlcSelectableItem.html': 'vlcSelectableItem.html',
            'vlcSmallItems.html': 'vlcSmallItems.html',
            'vlcCardList.html': 'vlcCardList.html',
            'vlcPaymentList.html': 'vlcPaymentList.html',
            'vlcAssetList.html': 'vlcAssetList.html',
            'vlcSelectableItemV2.html':'vlcSelectableItemV2.html',
            'vlcSmallItemsV2.html':'vlcSmallItemsV2.html',
            'vlcSelectableItemHyb.html':'vlcSelectableItemHyb.html',
            'vlcSmallItemsHyb.html':'vlcSmallItemsHyb.html'
        },

        getModalTemplates: function(uiTemplates) {
            var obj = {};
            uiTemplates.map(function(template) {
                if (/^OmniScript Modal$/.test(template['Type__c'])) {
                    obj[template.Name] = template.Name;
                }
            });

            return obj;

        },

        getRedirectTemplates: function(uiTemplates) {
            var obj = {};
            uiTemplates.map(function(template) {
                if (/^OmniScript Redirect$/.test(template['Type__c'])) {
                    obj[template.Name] = template.Name;
                }
            });
            return obj;
        },

        getSelectableTemplates: function(uiTemplates) {
            var obj = {};
            uiTemplates.map(function(template) {
                if (/^OmniScript Selectable Items$/.test(template['Type__c'])) {
                    obj[template.Name] = template.Name;
                }
            });

            for (var prop in this.ootb) {
                if (this.ootb.hasOwnProperty(prop)) {
                    obj[prop] = this.ootb[prop];
                }
            }
            return obj;
        },

        getGenTemplates: function(uiTemplates) {
            var obj = {};
            uiTemplates.map(function(template) {
                if (/^OmniScript$/.test(template['Type__c'])) {
                    obj[template.Name] = template.Name;
                }
            });

            return obj;
        },

        getInputBlockTemplates: function(uiTemplates) {
            var obj = {};
            uiTemplates.map(function(template) {
                obj[template.Name] = template.Name;
            });

            return obj;

        },

        getDefaultValues: function(label, obj) {
            var map = {
                'modalHTMLTemplateId': 'vlcModalContent.html',
                'modalConfigurationSetting.modalHTMLTemplateId': 'vlcProductConfig.html',
                'inputBlock': 'vlcTableSample.html',
                'Submit.redirectTemplateUrl': 'vlcApplicationAcknowledge.html',
                'Submit.confirmRedirectTemplateUrl': 'vlcApplicationConfirmation.html',
                'DataRaptor Extract Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'Remote Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'Rest Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'Done Action.redirectTemplateUrl': 'vlcMobileConfirmation.html',
                'Calculation Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'DocuSign Envelope Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'PDF Action.redirectTemplateUrl': 'vlcPDF.html',
                'DataRaptor Post Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'DataRaptor Transform Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'Matrix Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'Delete Action.redirectTemplateUrl': 'vlcAcknowledge.html',
                'Post to Object Action.redirectTemplateUrl': 'vlcApplicationAcknowledgeV2.html',
                'Review Action.redirectTemplateUrl': 'vlcApplicationConfirmationV2.html',
                'vlcProductConfig.html': 'vlcProductConfig.html'
            };

            if (map[label]) {
                obj[map[label]] = map[label];
            }
            return obj;
        },

        getTemplates: function(uiTemplates, property) {
            if (!(angular.isArray(uiTemplates))) {
                return {};
            }

            if (/modal/i.test(property.label)) {
                if (/persistentComponent\.\d+\.modalConfigurationSetting\.modalHTMLTemplateId/.test(property.label)) {
                    if (property.$canvasElement && property.$canvasElement.PropertySet__c &&
                            property.$canvasElement.PropertySet__c.persistentComponent) {
                        var persistentComponentConf = property.$canvasElement.PropertySet__c.persistentComponent;
                        var index = +property.label.split('.')[1];
                        if (persistentComponentConf.length > index) {
                            if (persistentComponentConf[index].id === 'vlcCart') {
                                return this.getDefaultValues('vlcProductConfig.html',this.getModalTemplates(uiTemplates));
                            }
                            else {
                                return this.getModalTemplates(uiTemplates);
                            }
                        }
                    }
                    return {};
                } else {
                    return this.getDefaultValues(property.label,this.getModalTemplates(uiTemplates));
                }
            }

            if (/redirect/i.test(property.label) && property.$canvasElement.CanvasType === 'Script Configuration') {
                return {
                    'vlcSaveForLaterAcknowledge.html':'vlcSaveForLaterAcknowledge.html'
                };
            } else if (/redirect/i.test(property.label) && property.$canvasElement['Type__c']) {
                return this.getDefaultValues(property.$canvasElement['Type__c'].label + '.' + property.label,
                                                this.getRedirectTemplates(uiTemplates));
            }

            if (property.$canvasElement['Type__c'] && /input block/i.test(property.$canvasElement['Type__c'].label)) {
                return this.getDefaultValues('inputBlock',this.getGenTemplates(uiTemplates));
            }

            if (property.$canvasElement['Type__c'] && /selectable/i.test(property.$canvasElement['Type__c'].label)) {
                return this.getDefaultValues(property.label,this.getSelectableTemplates(uiTemplates));
            }

            //this is the default case
            return this.getGenTemplates(uiTemplates);
        }
    };

    module.exports = tempMgr ;
}());

},{}],98:[function(require,module,exports){
angular.module('ouihome')
       .factory('backcompatExport', function(remoteActions, $localizable) {
           var $scope = {};

           return function backcompatExport(script, dontRetryCompile, useJSONV2)  {
                var exportResult,
                    initialPromise;
                if (useJSONV2) {
                    initialPromise = remoteActions.BuildJSONV2(script.Id)
                } else {
                    initialPromise = remoteActions.exportOmniScript(script.Id);
                }
                initialPromise
                    .then(function(result) {
                        var pom = document.createElement('a');
                        if (!angular.isString(result)) {
                            // OMNI-421 - always make into array for backcompat
                            if (!angular.isArray(result) && useJSONV2 !== true) {
                                result = [result];
                            }
                            result = JSON.stringify(result);
                            result = result.replace('&quot;', '&amp;quot;');
                        }
                        try {
                            pom.setAttribute('href', 'data:application/zip;charset=utf-8,' + encodeURIComponent(result));
                            var name = (script[fileNsPrefix() + 'Type__c'] || '') + '_' + (script[fileNsPrefix() + 'SubType__c'] || '') + '_' + (script[fileNsPrefix() + 'Language__c'] || '');
                            name = name.replace(/ /g, '');
                            pom.setAttribute('download', name + '.json');
                            pom.style.display = 'none';
                            document.body.appendChild(pom);
                            pom.click();
                        } catch (e) {
                            window.alert($localizable('OmniHomeFailExport', 'Unable to export {1}', script.Name));
                        }
                        document.body.removeChild(pom);
                    }, function(error) {
                        if (dontRetryCompile) {
                            window.alert($localizable('OmniHomeFailExport', 'Unable to export {1}', script.Name));
                        } else {
                            // if false then try compile it
                            var iframe = document.createElement('iframe');
                            iframe.src = window.previewUrl + '?id=' + script.Id;
                            iframe.style.display = 'none';
                            $(iframe).load(function() {
                                setTimeout(function() {
                                    document.body.removeChild(iframe);
                                    backcompatExport(script, true, useJSONV2);
                                }, 5000);
                            });
                            document.body.appendChild(iframe);
                        }
                    });
           };
       });

},{}],99:[function(require,module,exports){
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
},{}],100:[function(require,module,exports){
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
},{}],101:[function(require,module,exports){
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
},{}],102:[function(require,module,exports){
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
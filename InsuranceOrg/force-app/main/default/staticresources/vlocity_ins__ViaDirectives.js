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
angular.module('viaDirectives', []);

require('./modules/viaDirectives/directive/GroupedTable.js');
require('./modules/viaDirectives/directive/NumberInputNullValueFix.js');
require('./modules/viaDirectives/directive/PreventDeleteBack.js');
require('./modules/viaDirectives/directive/ViaAffix.js');
require('./modules/viaDirectives/directive/ViaMask.js');
require('./modules/viaDirectives/directive/ViaScreenHeight.js');
require('./modules/viaDirectives/directive/ViaFileReader.js');

require('./modules/viaDirectives/factory/InterTabMsgBus.js');

require('./modules/viaDirectives/filter/GroupAndExpanded.js');
require('./modules/viaDirectives/filter/HtmlEncodeDecode.js');

require('./modules/viaDirectives/templates/templates.js');

},{"./modules/viaDirectives/directive/GroupedTable.js":2,"./modules/viaDirectives/directive/NumberInputNullValueFix.js":3,"./modules/viaDirectives/directive/PreventDeleteBack.js":4,"./modules/viaDirectives/directive/ViaAffix.js":5,"./modules/viaDirectives/directive/ViaFileReader.js":6,"./modules/viaDirectives/directive/ViaMask.js":7,"./modules/viaDirectives/directive/ViaScreenHeight.js":8,"./modules/viaDirectives/factory/InterTabMsgBus.js":9,"./modules/viaDirectives/filter/GroupAndExpanded.js":10,"./modules/viaDirectives/filter/HtmlEncodeDecode.js":11,"./modules/viaDirectives/templates/templates.js":12}],2:[function(require,module,exports){
angular.module('viaDirectives')
    .directive('groupedTable', function($modal, $q, $localizable, $rootScope) {
        'use strict';

        return {
            restrict: 'AEC',
            scope: {
                rowData: '=',
                name: '@',
                delete: '&onDelete',
                loading: '='
            },
            link: function(scope) {

                scope.rows = [];

                function rowGroupID(row) {
                    return row.Name;
                }

                function sortByVersion(a, b) {
                    /*jshint camelcase: false */
                    return a.Version__c > b.Version__c ? -1 : (a.Version__c < b.Version__c ? 1 : 0);
                }

                function sortByName(a, b) {
                    return a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : (a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 0);
                }

                scope.$watchCollection('rowData', function(newRowData) {
                    var existingExpandedModules = {};
                    var groupedTemplateMap;
                    if (scope.rows) {
                        scope.rows.forEach(function(row) {
                            var id = rowGroupID(row);
                            existingExpandedModules[id] = row.expand || existingExpandedModules[id];
                        });
                    }
                    // group them into header by version
                    groupedTemplateMap = (newRowData || []).map(function(row) {
                        return angular.copy(row);
                    }).sort(function(a, b) {
                        // sort by Name first then by version within that
                        var nameSortValue = sortByName(a,b);
                        return nameSortValue !== 0 ? nameSortValue : sortByVersion(a, b);
                    }).reduce(function(rowMap, row) {
                        var id = rowGroupID(row);
                        if (!rowMap[id]) {
                            rowMap[id] = angular.extend(row, {
                                group: true,
                                expand: false,
                                rows: []
                            });
                        } else {
                            rowMap[id].rows.push(row);
                        }
                        rowMap[id].expand = row.expand = existingExpandedModules[id];
                        /*jshint camelcase: false */
                        rowMap[id].IsActive__c = row.IsActive__c | rowMap[id].IsActive__c;
                        return rowMap;
                    }, {});

                    scope.rows = Object.keys(groupedTemplateMap).reduce(function(array, key) {
                        var group = groupedTemplateMap[key];
                        group.rows.sort(sortByVersion);
                        return array.concat([groupedTemplateMap[key]]).concat(groupedTemplateMap[key].rows);
                    }, []);
                    scope.loading = false;
                });

                scope.expand = function(groupedTemplate, shouldExpand) {
                    groupedTemplate.rows.forEach(function(row) {
                        row.expand = shouldExpand;
                    });
                    groupedTemplate.expand = shouldExpand;
                };

                scope.deleteTemplate = function(row) {
                    var modalScope = scope.$new();
                    modalScope.ok = function() {
                        //remoteActions.deleteTemplate(row).then(loadTemplates);
                    };

                    $modal({
                        title: $localizable('TemplateHomeConfirmDelete', 'Confirm deletion'),
                        rowUrl: 'ConfirmationModal.tpl.html',
                        content: $localizable('TemplateHomeConfirmDeleteContent',
                            'Are you sure you want to delete "{1}" (version {2})? <br/><br/> <i>' +
                            'Cards in this row will remain available for use in other rows.</i>',
                            row.Name, row[$rootScope.nsPrefix + 'Version__c']),
                        scope: modalScope,
                        html: true,
                        show: true
                    });
                };

            }
        };
    });

},{}],3:[function(require,module,exports){
angular.module('viaDirectives')
.directive('input', function () {
    'use strict';
    return {
        restrict: 'E',
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (attrs.type == null || attrs.type.toLowerCase() !== 'number') {
                return;
            } //only augment number input!
            ctrl.$formatters.push(function (value) {
                return !isNaN(value) ? parseFloat(value) : null;
            });
        }
    };
});

},{}],4:[function(require,module,exports){
angular.module('viaDirectives')
.directive('preventDeleteBack', function() {
    'use strict';
    return function () {
        /*
         * this swallows backspace keys on any non-input element.
         * stops backspace -> back
         */
        var rx = /INPUT|SELECT|TEXTAREA/i;

        angular.element(document).bind('keydown keypress', function(e) {
            if (e.which === 8) { // 8 == backspace
                if (!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
                    e.preventDefault();
                }
            }
        });
    };
});

},{}],5:[function(require,module,exports){
angular.module('viaDirectives')
.directive('viaAffix', function() {
    'use strict';
    return function (scope, element) {
        var stickyTop = $(element).offset().top;
        $(window).scroll(function() {
            var windowTop = $(window).scrollTop();
            if (stickyTop < windowTop) {
                $(element).parent().height($(window).height());
                $(element).css({position: 'fixed', top: 0, width: '100%'});
                $(element).addClass('viaAffix');
            } else {
                $(element).removeClass('viaAffix');
                $(element).css('position','static');
            }
        });
    };
});

},{}],6:[function(require,module,exports){
angular.module('viaDirectives')
    .directive('viaFilereader', function($q) {
        'use strict';
        console.log('calling appFilereader');
        var slice = Array.prototype.slice;
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel) {
                if (!ngModel) {
                    console.log('no ngModel');
                    return;
                }

                ngModel.$render = function() {};

                element.bind('change', function(e) {
                    var element = e.target;
                    console.log('file input changed');
                    if (!element.value) return;

                    element.disabled = true;
                    $q.all(slice.call(element.files, 0).map(readFile))
                        .then(function(values) {
                        if (element.multiple) {
                            ngModel.$setViewValue(JSON.parse(values));
                        } else {
                            ngModel.$setViewValue(values.length ? JSON.parse(values[0]) : null);
                        }
                        element.value = null;
                        element.disabled = false;
                    });

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            deferred.resolve(e.target.result);
                        };
                        reader.onerror = function(e) {
                            deferred.reject(e);
                        };
                        reader.readAsText(file);

                        return deferred.promise;
                    }

                }); //change
            } //link
        }; //return
    });
 // appFilereader
},{}],7:[function(require,module,exports){
window.format = require('../../../util/javascript-number-formatter.js');
var format = window.format;

// polyfill MAX_SAFE_INTEGER and MIN_SAFE_INTEGER in older browsers
Number.MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
Number.MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -9007199254740991;

angular.module('viaDirectives')
.directive('viaMask', function($parse) {
    'use strict';

    var decimalSeperator = '.';
    try {
        // this works in FF, Chrome, IE, Safari and Opera
        var sep = parseFloat(3 / 2).toLocaleString().substring(1,2);
        if (sep === '.' || sep === ',') {
            decimalSeperator = sep;
        }
    } catch (e) {}

    var decimalKeyCode = decimalSeperator === '.' ? 46 : 44;

    var replacementRegex = new RegExp('[^-\\' + decimalSeperator + '\\d]', 'g');

    function parseFloatIfNum(value) {
        return isNaN(value) ? value : parseFloat(value);
    }

    function cleanNumberValue(value) {
        if (!isNaN(value)){
            // passes through values that already satisfy isNaN
            return value;
        }
        if (typeof value === "string"){
            //handling for strings with locale defined decimal separators
            return value.replace(replacementRegex, '').replace(decimalSeperator, '.');
        }
        // if we don't match the previous situations we should ensure that the code goes no further
        return NaN;
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {

            ctrl.$validators.minInt = function(value) {
                return ctrl.$isEmpty(value) || value >= Number.MIN_SAFE_INTEGER;
            };

            ctrl.$validators.maxInt = function(value) {
                return ctrl.$isEmpty(value) || value <= Number.MAX_SAFE_INTEGER;
            };

            // only allow numbers, shift, ctrl, command keys
            $(element).on('keypress', function (evt) {
                var _ref, _ref1;
                if ((// don't prevent 'backspace', 'tab', 'end', 'home', 'left', 'right', 'delete'
                    ((_ref = evt.keyCode) !== 8 && _ref !== 9 && _ref !== 35 &&
                       _ref !== 36 && _ref !== 37 && _ref !== 39 && _ref !== 46) &&
                    // don't prevent 'print screen', 'insert', 'del', '0-9'
                    ((_ref1 = evt.which) !== decimalKeyCode && _ref1 !== 45 &&
                       _ref1 !== 48 && _ref1 !== 49 && _ref1 !== 50 && _ref1 !== 51 && _ref1 !== 52 &&
                        _ref1 !== 53 && _ref1 !== 54 && _ref1 !== 55 && _ref1 !== 56 && _ref1 !== 57)) ||
                    // don't allow multiple . or ,
                    ((_ref === decimalKeyCode || _ref1 === decimalKeyCode) &&
                      evt.target.value.indexOf(decimalSeperator) > -1) ||
                    // only allow one - at start
                    ((_ref === 45 || _ref1 === 45) &&
                      (evt.target.selectionStart !== 0 || evt.target.value.indexOf('-') > -1)) ||
                    // don't allow anything before a '-' if the cursor is at the start
                    (evt.target.selectionStart === 0 && evt.target.value.indexOf('-') > -1 &&
                evt.target.selectionEnd === 0)) {
                    evt.preventDefault();
                }
            });

            function getMask() {
                return $parse(attrs.viaMask)(scope);
            }

            function parser(value, isFromProgrammaticCall) {
                var mask = getMask(),
                    modelValue = ctrl.$modelValue;
                /* jshint eqnull: true */
                if (!isFromBlur || ctrl.$isEmpty(value) || mask == null || !ctrl.$valid) {
                    return parseFloatIfNum(value);
                }

                // we need to convert typed value back to number formatted to reformate
                // so we need to replace everything but the decimal sep and numbers
                var convertedValue = cleanNumberValue(modelValue);
                if (isNaN(convertedValue)) {
                    return modelValue;
                }

                var formatedValue = '' + format(mask, parseFloat(convertedValue));
                if (ctrl.$viewValue !== formatedValue) {
                    ctrl.$setViewValue(formatedValue);
                    ctrl.$render();
                }

                return isFromProgrammaticCall ? parseFloat(convertedValue) : parseFloatIfNum(modelValue);
            }

            function formatter(value) {
                var mask = getMask();
                /* jshint eqnull: true */
                if (ctrl.$isEmpty(value) || mask == null || !ctrl.$valid) {
                    return value;
                }
                var convertedValue = cleanNumberValue(value);
                if (isNaN(convertedValue)) {
                    return value;
                }

                return '' + format(mask, convertedValue);
            }

            var isFromBlur = false;

            // on focus turn view value into regular number
            $(element).on('focus', function() {
                formatOnFirstTime = false;
                try {
                    if (ctrl.$valid) {
                        var cusorPos = this.selectionStart;
                        var convertedValue = cleanNumberValue(ctrl.$modelValue);
                        if (isNaN(convertedValue)) {
                            return;
                        }
                        ctrl.$setViewValue(convertedValue);
                        ctrl.$render();
                        this.selectionStart = cusorPos;
                    }
                } catch (e) {}
            });

            $(element).on('blur', function() {
                isFromBlur = true;
                try {
                    scope.$apply(function() {
                        parser(ctrl.$viewValue, true);
                    });
                } catch (e) {}
                isFromBlur = false;
            });

            // format on firstTime
            var formatOnFirstTime = true;
            scope.$watch(function() {
                return ctrl.$modelValue;
            }, function(newValue) {
                /* jshint eqnull: true */
                if (formatOnFirstTime && newValue != null) {
                    isFromBlur = true;
                    try {
                        parser(newValue, true);
                    } catch (e) {}
                    isFromBlur = formatOnFirstTime = false;
                }
            });

            ctrl.$formatters.push(formatter);
            ctrl.$parsers.push(parser);

            if (attrs.viaMask) {
                scope.$watch(attrs.viaMask, function() {
                    parser(ctrl.$viewValue);
                });
            }
        }
    };
});

},{"../../../util/javascript-number-formatter.js":13}],8:[function(require,module,exports){
angular.module('viaDirectives')
.directive('viaScreenHeight', function($window) {
    'use strict';
    return function(scope, element) {
        var el = element[0];
        el.style.height = $window.document.documentElement.clientHeight + 'px';
        scope.$watch(function() {
            return $window.document.documentElement.clientHeight;
        }, function() {
            el.style.height = $window.document.documentElement.clientHeight + 'px';
        });
        var previousHeight = el.style.height;
        setInterval(function() {
            var docHeight = $window.document.documentElement.clientHeight;
            if (docHeight !== previousHeight) {
                el.style.height = docHeight + 'px';
                previousHeight = docHeight;
            }
        }, 50);
    };
});

},{}],9:[function(require,module,exports){
angular.module('viaDirectives')
.factory('interTabMsgBus', function() {
    'use strict';
    var listeners = {};
    var tabKey = Date.now().toString();
    var keysAdded = [];

    function handleStorageEvent(e) {
        e = e.originalEvent;
        if (e.key) {
            var keyParts = e.key.split('.');
            if (keyParts[0] === tabKey) {
                if (listeners[keyParts[1]]) {
                    listeners[keyParts[1]].forEach(function(callbackConfig) {
                        callbackConfig.fn.apply(callbackConfig.scope, [e.newValue, e.oldValue]);
                    });
                }
            }
        }
    }

    function emptySessionStorage() {
        keysAdded.forEach(function(key) {
            localStorage.removeItem(tabKey + '.' + key);
        });
    }

    $(window).on('storage', handleStorageEvent);
    $(window).on('beforeunload', emptySessionStorage);

    return {
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
        set: function(key, value) {
            keysAdded.push(key);
            localStorage.setItem(tabKey + '.' + key, value);
        },
        get: function(key) {
            return localStorage.getItem(tabKey + '.' + key);
        },
        delete: function(key) {
            localStorage.removeItem(tabKey + '.' + key);
        }
    };
});

},{}],10:[function(require,module,exports){
angular.module('viaDirectives')
.filter('groupAndExpanded', function() {
    'use strict';
    return function(objects) {
        var output = [];
        if (objects) {
            output = objects.filter(function(object) {
                return object.group || object.expand;
            });
        }
        return output;
    };
});

},{}],11:[function(require,module,exports){
var escape = document.createElement('textarea');
function escapeHTML(html) {
    'use strict';
    if (angular.isString(html)) {
        escape.innerHTML = html;
        return escape.innerHTML;
    } else {
        return html;
    }
}

function unescapeHTML(html) {
    'use strict';
    if (angular.isString(html)) {
        escape.innerHTML = html;
        return escape.value;
    } else {
        return html;
    }
}

angular.module('viaDirectives')
.filter('htmlEscape', function() {
    'use strict';
    return escapeHTML;
}).filter('htmlUnescape', function() {
    'use strict';
    return unescapeHTML;
});

},{}],12:[function(require,module,exports){
angular.module("viaDirectives").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("GroupedTable.tpl.html",'<div class="panel panel-sf">\n  <div class="panel-heading">\n    {{ title }}\n    <a href="{{newUrl}}" class="btn-primary btn pull-right">{{ ::\'VlocNew\' | localize:\'New\' }}</a>\n  </div>\n  <table class="table table-grouped" ng-table="tableParams" template-pagination="removePagerRow.html" show-group="false">\n    <colgroup>\n      <col width="5%" />\n      <col width="35%" />\n      <col width="20%" />\n      <col width="20%" />\n      <col width="20%" />\n    </colgroup>\n    <tr class="ng-table-group" ng-repeat-start="group in $groups">\n      <td>\n        <i class="icon" ng-click="group.$hideRows = !group.$hideRows"\n           ng-class="{\'icon-v-right-arrow\': group.$hideRows, \'icon-v-down-arrow\': !group.$hideRows}"></i>\n      </td>\n      <td colspan="{{$groups.visibleColumnCount - 1}}">{{ group.value }}</td>\n    </tr>\n    <tr ng-hide="group.$hideRows" ng-repeat="row in group.data" ng-repeat-end=" ">\n      <td data-title="\'\'">&nbsp;</td>\n      <td data-title="::\'VlocName\' | localize:\'Name\'">\n        <div>\n          <a href="{!newUrl}?id={{row.Id}}">{{ ::\'VlocEdit\' | localize:\'Edit\' }}</a>\n          <span ng-if="!row[$root.nsPrefix+\'Active__c\']"> | </span>\n          <a href="{!newUrl}?id={{row.Id}}">{{ ::\'VlocExport\' | localize:\'Export\' }}</a>\n          <span ng-if="!row[$root.nsPrefix+\'Active__c\']"> | </span>\n          <a ng-click="deleteLayout(row)" ng-if="!row[$root.nsPrefix+\'Active__c\']">{{ ::\'VlocDelete\' | localize:\'Delete\' }}</a>\n        </div>\n      </td>\n'+"      <td data-title=\"::'VlocType' | localize:'Type'\">{{row[$root.nsPrefix+'Type__c']}}</td>\n      <td data-title=\"::'TemplateParent' | localize:'Parent Template'\">{{row[$root.nsPrefix+'Version__c'] | number:1}}</td>\n      <td data-title=\"::'VlocVersion' | localize:'Version'\">{{row[$root.nsPrefix+'Version__c'] | number:1}}</td>\n      <td data-title=\"::'VlocActive' | localize:'Active'\"><i class=\"icon icon-v-check\" ng-if=\"row[$root.nsPrefix+'Active__c']\"></i> </td>\n    </tr>\n  </table>\n  <div class=\"mask\" ng-if=\"loading\">\n    <div class=\"center-block spinner\"></div>\n  </div>\n</div>"),$templateCache.put("DeleteModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header" ng-show="title">\n        <button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" ng-bind="title"></h4>\n      </div>\n      <div class="modal-body" ng-bind="content"></div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-primary" ng-click="ok();$hide()">{{ ::\'LayoutConfirmOk\' | localize: \'Delete\' }}</button>\n        <button type="button" class="btn btn-default" ng-click="$hide()">{{ ::\'LayoutConfirmCancel\' | localize: \'Cancel\' }}</button>\n      </div>\n    </div>\n  </div>\n</div>')}]);

},{}],13:[function(require,module,exports){
/**
 * javascript-number-formatter
 * Lightweight & Fast JavaScript Number Formatter
 *
 * @preserve IntegraXor Web SCADA - JavaScript Number Formatter (http://www.integraxor.com/)
 * @author KPL
 * @maintainer Rob Garrison
 * @copyright 2015 ecava
 * @license MIT <http://www.opensource.org/licenses/mit-license.php>
 * @link http://mottie.github.com/javascript-number-formatter/
 * @version 1.1.5
 */
/*jshint browser:true */
/* global define, module */
(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object') {
        module.exports = factory();
    } else {
        root.format = factory();
    }
}(this, function () {
    'use strict';
    function toFixed(number, numDigits) {
        /* jshint eqnull: true */
        if (numDigits == null || isNaN(numDigits)) {
            numDigits = 0;
        }
        // Shift
        number = number.toString().split('e');
        number = Math.round(+(number[0] + 'e' + (number[1] ? (+number[1] + numDigits) : numDigits)));

        // Shift back
        number = number.toString().split('e');
        return (+(number[0] + 'e' + (number[1] ? (+number[1] - numDigits) : -numDigits))).toFixed(numDigits);
    }

    return function (mask, value) {
        if (!mask || isNaN(+value)) {
            return value; // return as it is.
        }

        var isNegative, result, decimal, group, posLeadZero, posTrailZero, posSeparator,
          part, szSep, integer,

          // find prefix/suffix
          len = mask.length,
          start = mask.search(/[0-9\-\+#]/),
          prefix = start > 0 ? mask.substring(0, start) : '',
          // reverse string: not an ideal method if there are surrogate pairs
          str = mask.split('').reverse().join(''),
          end = str.search(/[0-9\-\+#]/),
          offset = len - end,
          indx = offset + ((mask.substring(offset, offset + 1) === '.') ? 1 : 0),
          suffix = end > 0 ? mask.substring(indx, len) : '';

        // mask with prefix & suffix removed
        mask = mask.substring(start, indx);

        // convert any string to number according to formation sign.
        value = mask.charAt(0) === '-' ? -value : +value;
        isNegative = value < 0 ? value = -value : 0; // process only abs(), and turn on flag.

        // search for separator for grp & decimal, anything not digit, not +/- sign, not #.
        result = mask.match(/[^\d\-\+#]/g);
        decimal = (result && result[ result.length - 1 ]) || '.'; // treat the right most symbol as decimal
        if (result && result.length === 1 && result[0] !== '.') {
            decimal = '.';
        }
        group = (result && result[ 1 ] && result[ 0 ]) || ',';  // treat the left most symbol as group separator

        // split the decimal for the format string if any.
        mask = mask.split(decimal);
        // Fix the decimal first, toFixed will auto fill trailing zero.
        value = toFixed(value, mask[ 1 ] && mask[ 1 ].length);
        value = +(value) + ''; // convert number to string to trim off *all* trailing decimal zero(es)

        // fill back any trailing zero according to format
        posTrailZero = mask[ 1 ] && (mask[ 1 ].length -  1); // look for last zero in format
        part = value.split('.');
        // integer will get !part[1]
        if (!part[ 1 ] || (part[ 1 ] && part[ 1 ].length <= posTrailZero)) {
            value = toFixed((+value), posTrailZero + 1);
        }
        szSep = mask[ 0 ].split(group); // look for separator
        mask[ 0 ] = szSep.join(''); // join back without separator for counting the pos of any leading 0.

        posLeadZero = mask[ 0 ] && mask[ 0 ].indexOf('0');
        if (posLeadZero > -1) {
            while (part[ 0 ].length < (mask[ 0 ].length - posLeadZero)) {
                part[ 0 ] = '0' + part[ 0 ];
            }
        } else if (+part[ 0 ] === 0) {
            part[ 0 ] = '';
        }

        value = value.split('.');
        value[ 0 ] = part[ 0 ];

        // process the first group separator from decimal (.) only, the rest ignore.
        // get the length of the last slice of split result.
        posSeparator = (szSep[ 1 ] && szSep[ szSep.length - 1 ].length);
        if (posSeparator) {
            integer = value[ 0 ];
            str = '';
            offset = integer.length % posSeparator;
            len = integer.length;
            for (indx = 0; indx < len; indx++) {
                str += integer.charAt(indx); // ie6 only support charAt for sz.
                // -posSeparator so that won't trail separator on full length
                /*jshint -W018 */
                if (!((indx - offset + 1) % posSeparator) && indx < len - posSeparator) {
                    str += group;
                }
            }
            value[ 0 ] = str;
        }
        value[ 1 ] = (mask[ 1 ] && value[ 1 ]) ? decimal + value[ 1 ] : '';

        // remove negative sign if result is zero
        result = value.join('');
        if (result === '0' || result === '') {
            // remove negative sign if result is zero
            isNegative = false;
        }

        // put back any negation, combine integer and fraction, and add back prefix & suffix
        return prefix + ((isNegative ? '-' : '') + result) + suffix;
    };

}));

},{}]},{},[1]);
})();

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
angular.module('interactionSummary',
    ['vlocity', 'sldsangular','viaDirectives','ngAnimate','tmh.dynamicLocale','mgcrea.ngStrap','ngSanitize'])
    .config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    }]).config(function($locationProvider) {
        'use strict';
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });
    }).config(['$compileProvider', function($compileProvider) {
        'use strict';
        $compileProvider.debugInfoEnabled(false);

    }]).config(['$localizableProvider', function($localizableProvider) {
        'use strict';
        $localizableProvider.setLocalizedMap(window.i18n);
        $localizableProvider.setDebugMode(window.ns === '');

    }]).config(['$datepickerProvider', function($datepickerProvider) {
        'use strict';
        angular.extend($datepickerProvider.defaults, {
            templateUrl: 'SldsDatepicker.tpl.html',
            dateFormat: 'M/d/yyyy',
            modelDateFormat: 'yyyy-MM-dd',
            dateType: 'string',
            autoclose: true,
            onHide: function() {

            }
        });
    }]).config(['$timepickerProvider', function($timepickerProvider) {
        'use strict';
        angular.extend($timepickerProvider.defaults, {
            templateUrl: 'SldsTimepicker.tpl.html',
            timeFormat: 'h:mm:ss a',
            placement: 'bottom-right',
            length: 7,
            autoclose: true
        });
    }]).config(['$tooltipProvider', function($tooltipProvider) {
        'use strict';
        angular.extend($tooltipProvider.defaults, {
            templateUrl: 'SldsTooltip.tpl.html',
            placement: 'auto top-left'
        });
    }]);

// Factories
//require('./modules/interactionSummary/factory/NotificationHandler.js');

// Controllers
require('./modules/interactionSummary/controller/InteractionSummaryController.js');

// Templates
require('./modules/interactionSummary/templates/templates.js');

},{"./modules/interactionSummary/controller/InteractionSummaryController.js":2,"./modules/interactionSummary/templates/templates.js":3}],2:[function(require,module,exports){
angular.module('interactionSummary').controller('InteractionSummaryController', function(
    $scope, $rootScope, $timeout, remoteActions, $interval) {
    'use strict';
    $rootScope.vlcLoading  = false;
    $scope.namespacePrefix = window.namespacePrefix;
    $scope.notification = {};
    $scope.interactionId = window.interactionId;
    $scope.interactionObj = {};
    $scope.datetimeDisplay = {};
    $scope.activityFeed  = [];
        
    $scope.formatTime = function(time) {
        var formattedTime;
        time = parseInt(time);
        if (time >= 1000) {
            formattedTime = (time / 1000).toFixed(2).toString() + 's';
        } else {
            formattedTime = time.toString() + 'ms';
        }
        return formattedTime;
    };

    $scope.formatDatetime = function(d) {
        return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
            ('0' + (d.getDate())).slice(-2) + ' ' + ('0' + (d.getHours())).slice(-2) + ':' +
            ('0' + (d.getMinutes())).slice(-2) + ':' + ('0' + (d.getSeconds())).slice(-2);
    };

    $scope.interactionAction = function (type) {
        var obj = new sforce.SObject(namespacePrefix + 'CustomerInteraction__c');
        var result = null;
        if (type === 'Completed') {
            $scope.interactionObj.fieldValueMap[namespacePrefix + 'Status__c'] = 'Completed';
        }
        else if (type === 'Cancel') {
            $scope.interactionObj.fieldValueMap[namespacePrefix + 'Status__c'] = 'Cancel';
        }
        $scope.dateStringToUTC();
        obj = angular.extend(obj, $scope.interactionObj.fieldValueMap);
        obj.Id = $scope.interactionId;
        result = sforce.connection.update([obj]);
        if (result && result[0].success === 'false') {
            $scope.notification.message = result[0].errors && result[0].errors.message;
            return;
        }

        remoteActions.updateTask($scope.interactionObj, $scope.interactionId).then(function (result) {
            if (type === 'Completed') {
                $scope.notification.message = 'The interaction has been set to Complete. The Console Primary Tab will close in 3 seconds...';
            } else if (type === 'Cancel') {
                $scope.notification.message = 'The interaction has been Cancelled. The Console Primary Tab will close in 3 seconds...';
            }
            $timeout(function () {
                sforce.console.getEnclosingPrimaryTabId($scope.closePrimaryTab);
            }, 3000);
        }, function (error) {
            console.log('Updating task status error: ' + error.message);
            $scope.notification.message = error.message || error.data.message;
        });
    };

    $scope.dateStringToUTC = function() {
    	for ( var field in $scope.datetimeDisplay) {
    		$scope.interactionObj.fieldValueMap[field] = new Date($scope.datetimeDisplay[field]).toISOString();
    	}
    };

    $scope.closePrimaryTab = function(result) {
        console.log('Primary tab id: ', result.id);
        sforce.console.closeTab(result.id);
    };

    $scope.refreshFrame = function() {
        window.location.reload();
    };


    $scope.getInteractionObject = function() {
    	$rootScope.vlcLoading = true;
        remoteActions.getInteractionObject($scope.interactionId).then(function(result) {
        	console.log('getInteractionObject', result);
        	if (result) {
        		$scope.interactionObj = result;
                var interactionLabel = result.interactionObjName;
                sforce.console.getFocusedPrimaryTabId(function(result) {
                    sforce.console.setTabTitle(interactionLabel, result.id);
                });

                
        		var coeff = 1000 * 60 * 5;
                var now = new Date();
                var rounded = new Date(Math.round(now.getTime() / coeff) * coeff);
        		for ( var i = 0; i < $scope.interactionObj.fieldList.length; i++) {
        			var field = $scope.interactionObj.fieldList[i];
        			
        			if ($scope.interactionObj.fieldLabelTypeMap[field].datatype.indexOf('date') > -1) {
        				if (!$scope.interactionObj.fieldValueMap[field]) {
        					//create default
        					$scope.datetimeDisplay[field] =  new Date($scope.formatDatetime(rounded));
        				}
        				else {
        					//format it
        					var formatedDate = new Date($scope.interactionObj.fieldValueMap[field]);
        					$scope.datetimeDisplay[field] = formatedDate;
        				}
        			}
        		}
        	}
        	$rootScope.vlcLoading = false;

        }, function(error) {
        	console.log('Error getting interaction object: ' + error);
            $scope.notification.message = error.data.message || error.data.error;
        });
    };

    $scope.getTrackingEntries = function() {

        function getIconForType(type) {
            switch(type) {
               case 'Viewed': return 'preview';
               case 'Launched': return 'new_window';
               case 'Step': return 'layout';
               case 'Call Out': return 'sort';
               default: return null; // or empty string if that makes more sense
            }
        }

        var intervalHolder = $interval(function(){
            remoteActions.getTrackingEntries($scope.interactionId).then(function(result) {
                if(result) {
                    $scope.activityFeed = angular.fromJson(result);
                    for (var i = 0; i < $scope.activityFeed.length; i++) {
                        $scope.activityFeed[i].Icon = getIconForType($scope.activityFeed[i].Type);
                        // format Ellapsedtime:
                        $scope.activityFeed[i].Elapsedtime = $scope.formatTime($scope.activityFeed[i].Elapsedtime);
                    }
                }
                else {
                    console.log('No tracking entries is retrieved for interaction: ', $scope.interactionId);
                }
            }, function(error) {
                $scope.notification.message = error.data.message || error.data.error;
            })
        }, 4000);

        $scope.$on("$destroy", function() {
            $interval.cancel(intervalHolder);
        });
    };

});
},{}],3:[function(require,module,exports){
angular.module("interactionSummary").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("SldsTooltip.tpl.html",'<div class="slds-popover slds-popover--tooltip slds-nubbin--bottom{{status.position}}" role="tooltip" ng-show="title">\n    <div class="slds-popover__body" ng-bind="title"></div>\n</div>\n'),$templateCache.put("SldsTimepicker.tpl.html",'<div class="slds-dropdown slds-datepicker timepicker" style="min-width: 0px;width: auto">\n    <table height="100%">\n        <thead>\n            <tr class="text-center">\n                <th>\n                    <button tabindex="-1" type="button" class="slds-button slds-button--icon" ng-click="$arrowAction(-1, 0)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'chevronup\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Up</span>\n                    </button>\n                </th>\n                <th>&nbsp;</th>\n                <th>\n                    <button tabindex="-1" type="button" class="slds-button slds-button--icon" ng-click="$arrowAction(-1, 1)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'chevronup\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Up</span>\n                    </button>\n                </th>\n                <th>&nbsp;</th>\n                <th>\n                    <button ng-if="showSeconds" tabindex="-1" type="button" class="slds-button slds-button--icon" ng-click="$arrowAction(-1, 2)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'chevronup\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Up</span>\n                    </button>\n                </th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr ng-repeat="(i, row) in rows">\n                <td class="text-center" ng-class="{\'slds-is-selected\': row[0].selected}">\n                    <span class="slds-day" ng-class="{\'text-muted\': row[0].muted}" ng-bind="row[0].label" ng-click="$select(row[0].date, 0)" ng-disabled="row[0].disabled"></span>\n                </td>\n                <td><span ng-bind="i == midIndex ? timeSeparator : \' \'"></span></td>\n                <td class="text-center" ng-class="{\'slds-is-selected\': row[1].selected}">\n                    <span class="slds-day" ng-class="{\'text-muted\': row[1].muted}" ng-bind="row[1].label" ng-click="$select(row[1].date, 1)" ng-disabled="row[1].disabled"></span>\n                </td>\n                <td><span ng-bind="i == midIndex ? timeSeparator : \' \'"></span></td>\n                <td class="text-center" ng-class="{\'slds-is-selected\': row[2].selected}">\n                    <span class="slds-day" ng-class="{\'text-muted\': row[2].muted}" ng-bind="row[2].label" ng-click="$select(row[2].date, 2)" ng-disabled="row[2].disabled"></span>\n                </td>\n                <td ng-if="showAM">&nbsp;</td>\n                <td ng-if="showAM">\n                    <span class="slds-day" ng-show="i == midIndex - !isAM * 1" ng-click="$switchMeridian()" ng-disabled="el.disabled" ng-class="{\'slds-is-selected\': !!isAM}">AM</span>\n                    <span class="slds-day" ng-show="i == midIndex + 1 - !isAM * 1" ng-click="$switchMeridian()" ng-disabled="el.disabled" ng-class="{\'slds-is-selected\': !isAM}">PM</span>\n                </td>\n            </tr>\n        </tbody>\n        <tfoot>\n            <tr class="text-center">\n                <th>\n                    <button tabindex="-1" type="button" class="slds-button slds-button--icon" ng-click="$arrowAction(1, 0)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'chevrondown\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Down</span>\n                    </button>\n                </th>\n                <th>&nbsp;</th>\n                <th>\n                    <button tabindex="-1" type="button" class="slds-button slds-button--icon" ng-click="$arrowAction(1, 1)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'chevrondown\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Down</span>\n                    </button>\n                </th>\n                <th>&nbsp;</th>\n                <th>\n                    <button ng-if="showSeconds" tabindex="-1" type="button" class="slds-button slds-button--icon" ng-click="$arrowAction(1, 2)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'chevrondown\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Down</span>\n                    </button>\n                </th>\n            </tr>\n        </tfoot>\n    </table>\n</div>\n'),$templateCache.put("SldsDatepicker.tpl.html",'<div class="slds-datepicker slds-dropdown slds-dropdown--right" aria-hidden="false" ng-class="\'datepicker-mode-\' + $mode">\n    <div class="slds-datepicker__filter slds-grid">\n        <div class="slds-datepicker__filter--month slds-grid slds-grid--align-spread slds-grow">\n            <div class="slds-align-middle">\n                <button type="button" class="slds-button slds-button--icon-container" ng-click="$selectPane(-1)">\n                    <slds-button-svg-icon sprite="\'utility\'" icon="\'left\'" size="\'small\'"></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Previous Month</span>\n                </button>\n            </div>\n            <button type="button" class="slds-button slds-button--neutral slds-align-middle" ng-click="$toggleMode()" aria-live="assertive" aria-atomic="true"><span ng-bind="title"></span></button>\n            <div class="slds-align-middle">\n                <button type="button" class="slds-button slds-button--icon-container" ng-click="$selectPane(+1)">\n                    <slds-button-svg-icon sprite="\'utility\'" icon="\'right\'" size="\'small\'"></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Next Month</span>\n                </button>\n            </div>\n        </div>\n    </div>\n    <table class="datepicker__month" role="grid" aria-labelledby="month">\n        <thead>\n            <tr id="weekdays" ng-if="showLabels" ng-bind-html="labels"></tr>\n        </thead>\n        <tbody>\n            <tr ng-repeat="(i, row) in rows">\n                <td ng-repeat="(j, el) in row" role="gridcell" aria-selected="{\'true\': el.selected, \'false\': !el.selected}" ng-class="{\'slds-is-today\': el.isToday && !el.selected, \'slds-is-selected\': el.selected}">\n                    <span class="slds-day" ng-class="{\'text-muted\': el.muted}" ng-bind="el.label" ng-click="$select(el.date)" ng-disabled="el.disabled"></span>\n                </td>\n            </tr>\n            <tr ng-if="$hasToday">\n                <td colspan="7" role="gridcell"><a href="javascript:void(0);" class="slds-show--inline-block slds-p-bottom--x-small" ng-click="$setToday()">Today</a></td>\n            </tr>\n        </tbody>\n    </table>\n</div>\n')}]);

},{}]},{},[1]);
})();

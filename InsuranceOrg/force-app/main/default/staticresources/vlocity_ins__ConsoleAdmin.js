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
angular.module('consoleadmin', ['vlocity', 'ngSanitize', 'sldsangular', 'mgcrea.ngStrap'])
.config(['remoteActionsProvider', function(remoteActionsProvider) {
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}]);

require('./modules/consoleadmin/controller/ConsoleAdminController.js');
require('./modules/consoleadmin/controller/DashboardController.js');
require('./modules/consoleadmin/directive/tabset.js');
require('./modules/consoleadmin/directive/tab.js');
require('./modules/consoleadmin/factory/ConsoleAdminService.js');
require('./modules/consoleadmin/templates/templates.js');

},{"./modules/consoleadmin/controller/ConsoleAdminController.js":2,"./modules/consoleadmin/controller/DashboardController.js":3,"./modules/consoleadmin/directive/tab.js":4,"./modules/consoleadmin/directive/tabset.js":5,"./modules/consoleadmin/factory/ConsoleAdminService.js":6,"./modules/consoleadmin/templates/templates.js":7}],2:[function(require,module,exports){
angular.module('consoleadmin')
.controller('ConsoleAdminController', ['$scope', '$timeout', 'consoleAdminService', '$rootScope', 'remoteActions', '$window',
    function ($scope, $timeout, consoleAdminService, $rootScope, remoteActions, $window) {
        consoleAdminService.createModuleMap();

        //Calling remote method to check if Versioning is Enabled.
        $scope.checkIfVersioningIsEnabled = function(){
            remoteActions.invokeMethod('isVersioningEnabled', null).then(function(results) {
                //Versioning is on, throw error
                if(results == true){
                    consoleAdminService.showNotification({
                        type: 'error',
                        title: 'Error',
                        content : $window.labels.EPCVersioningNotEnabledErrorMessageLabel
                    });
                }
            }, function(error) {
                //This error is if backend calls fails for some reason.
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.checkIfVersioningIsEnabled();
        $scope.tabs = consoleAdminService.getTabs();

        $timeout(function() {
            resizeTabContent();
        }, 500);

        j$(window).resize(_.debounce(resizeTabContent, 150));

        $scope.$on('launchConsoleTab', function(event, data) {
            if (data.closeCurrentTab) {
                $rootScope.$broadcast('closeCurrentConsoleTab');
            }
            var tabInfo = {
                'doAction': data.doAction,
                'doAPIName': data.doAPIName,
                'doAPILabel': data.doAPILabel,
                'obj': data.obj
            }
            consoleAdminService.openTab(tabInfo);
        });

        $scope.$on('showNotification', function(event, data) {
            consoleAdminService.showNotification(data.message);
        });

        $scope.evalIframeEvents = function(action, data) {
            if (action === 'broadcast') {
                $rootScope.$broadcast(data.eventName, data.eventData);
            }
        };
    }
]);

},{}],3:[function(require,module,exports){
angular.module('consoleadmin')
.controller('DashboardController', ['$scope', '$rootScope', 'remoteActions', 'consoleAdminService',
    function ($scope, $rootScope, remoteActions, consoleAdminService) {
        $scope.nsp = fileNsPrefix();
        $scope.modules = [];

        $scope.searchObject = function(obj) {
            var tabInfo = {
                'obj': obj,
                'doAction': 'searchRecords'
            };

            if (obj.searchTranslations) {
                tabInfo.doAction = 'searchTranslationRecords';
            }
            consoleAdminService.openTab(tabInfo);
        };

        $scope.openObjectTab = function(obj) {
            var tabInfo = {
                obj:obj,
                'doAction': 'openMLSTranslationRecords'
            };
            consoleAdminService.openTab(tabInfo);
        };

        $scope.newObject = function(obj) {
            var tabInfo = {
                'obj': obj,
                'doAction': 'newRecord'
            }
            consoleAdminService.openTab(tabInfo);
        };

        $scope.init = function() {
            var tmpModules = consoleAdminService.getModules();
            angular.forEach(tmpModules, function(module) {
                var activeObjects = module.consoleObjects.filter(function(o) {
                    return o.active;
                });
                if (activeObjects.length > 0) {
                    $scope.modules.push(module);
                }
            });
        };
        $scope.init();
    }
]);

},{}],4:[function(require,module,exports){
angular.module('consoleadmin')
.directive('tab', [function() {
    return {
        restrict: 'E',
        transclude: true,
        template: '<div role="tabpanel" ng-show="active" class="tab-pane" ng-include="templateUrl"></div>',
        require: '^tabset',
        scope: {
            heading: '@',
            objectUrl: '@',
            objectId: '@',
            active: '@',
            templateUrl: '@'
        },
        link: function(scope, elem, attr, tabsetCtrl) {
            scope.active = (attr.active === 'true');
            tabsetCtrl.addTab(scope);

            elem.on('$destroy', function() {
                tabsetCtrl.removeTab(scope);
            });
        }
    };
}]);

},{}],5:[function(require,module,exports){
angular.module('consoleadmin')
.directive('tabset', ['$rootScope', 'consoleAdminService',
    function($rootScope, consoleAdminService) {
        return {
            restrict: 'C',
            transclude: true,
            scope: {},
            templateUrl: 'tabset.tpl.html',
            bindToController: true,
            controllerAs: 'tabset',
            controller: function($scope) {
                $scope.$on('closeCurrentConsoleTab', function(event, data) {
                    var currentTab = consoleAdminService.getCurrentTab();
                    self.closeTab(currentTab);
                });

                var self = this;
                self.tabs = [];

                self.addTab = function(tab) {
                    self.tabs.push(tab);
                    if (self.tabs.length === 1) {
                        tab.active = true;
                    } else {
                        if (tab.active) {
                            self.selectTab(tab);
                        }
                    }
                };

                self.removeTab = function(tab) {
                    var idx = -1;
                    var isActive = false;
                    for (var i = 0; i < self.tabs.length; i++) {
                        if (tab == self.tabs[i]) {
                            idx = i;
                            isActive = self.tabs[i].active;
                            break;
                        }
                    }

                    if (idx !== -1) {
                        self.tabs.splice(idx, 1);
                    }

                    var previousTab;
                    if (isActive) {
                        previousTab = consoleAdminService.getPreviousTab();
                        consoleAdminService.setCurrentTab(null);
                        if (previousTab === null) {
                            self.selectTab(self.tabs[0]);
                        } else {
                            self.selectTab(previousTab);
                        }
                    } else {
                        previousTab = consoleAdminService.getPreviousTab();
                        if (tab === previousTab) {
                            consoleAdminService.setPreviousTab(null);
                        }
                    }

                    return idx;
                };

                self.selectTab = function(selectedTab) {
                    var currentTab = consoleAdminService.getCurrentTab();
                    if (selectedTab !== currentTab) {
                        consoleAdminService.setPreviousTab(currentTab);
                        consoleAdminService.setCurrentTab(selectedTab);

                        angular.forEach(self.tabs, function(tab) {
                            if (tab.active && tab !== selectedTab) {
                                tab.active = false;
                            }
                        });
                        selectedTab.active = true;
                    }
                };

                self.closeTab = function(tab, idx, $event) {
                    if ($event) {
                        $event.stopPropagation();
                    }

                    var tabIdx = self.removeTab(tab);
                    if (idx === undefined) {
                        idx = tabIdx;
                    }
                    consoleAdminService.closeTab(idx);
                };
            }
        };
    }
]);

},{}],6:[function(require,module,exports){
angular.module('consoleadmin')
.factory('consoleAdminService', ['$rootScope', '$sldsToast', 
    function($rootScope, $sldsToast) {
        var nsp = fileNsPrefix();

        var tabs = [
            {
                'title': 'Dashboard',
                'template': 'Dashboard.tpl.html',
                'active': true
            }
        ];

        var moduleMap = {};
        var modules = [
            {
                id: 'prodMgmt',
                name: 'Product Management',
                sequence: 1,
                active: true,
                consoleObjects: [
                    {
                        objLabel: 'Product',
                        objAPIName: 'Product2',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Promotion',
                        objAPIName: nsp + 'Promotion__c',
                        recordType: 'Promotion',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Discount',
                        objAPIName: nsp + 'Promotion__c',
                        recordType: 'Discount',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Offer Migration Plan',
                        objAPIName: nsp + 'OfferMigrationPlan__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    }
                ]
            },
            {
                id: 'pricing',
                name: 'Pricing',
                sequence: 2,
                active: true,
                consoleObjects: [
                    {
                        objLabel: 'Price List',
                        objAPIName: nsp + 'PriceList__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Pricing Plan',
                        objAPIName: nsp + 'PricingPlan__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Pricing Variable',
                        objAPIName: nsp + 'PricingVariable__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Time Plan',
                        objAPIName: nsp + 'TimePlan__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Time Policy',
                        objAPIName: nsp + 'TimePolicy__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    }
                ]
            },
            {
                id: 'rules',
                name: 'Rules',
                sequence: 3,
                active: true,
                consoleObjects: [
                    {
                        objLabel: 'Function',
                        objAPIName: nsp + 'VlocityFunction__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Context Action',
                        objAPIName: nsp + 'ContextAction__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Context Dimension',
                        objAPIName: nsp + 'ContextDimension__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Context Scope',
                        objAPIName: nsp + 'ContextScope__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Object Level Rule',
                        objAPIName: nsp + 'ObjectRuleAssignment__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Rule',
                        objAPIName: nsp + 'EntityFilter__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Rule Set',
                        objAPIName: nsp + 'Rule__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    }
                ]
            },
            {
                id: 'foundation',
                name: 'Foundation',
                sequence: 4,
                active: true,
                consoleObjects: [
                    {
                        objLabel: 'Attribute',
                        objAPIName: nsp + 'Attribute__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Picklist',
                        objAPIName: nsp + 'Picklist__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    }
                ]
            },
            {
                id: 'metadata',
                name: 'Metadata',
                sequence: 5,
                active: true,
                consoleObjects: [
                    {
                        objLabel: 'Object',
                        objAPIName: nsp + 'ObjectClass__c',
                        recordType: 'Object',
                        active: true,
                        createRecord: false
                    },
                    {
                        objLabel: 'String Translations',
                        objAPIName: nsp + 'StringTranslation__c',
                        recordType: '',
                        active: true,
                        createRecord: false,
                        searchTranslations:true
                    }
                ]
            },
            {
                id: 'layoutMgmt',
                name: 'Layout Management',
                sequence: 6,
                active: true,
                consoleObjects: [
                    {
                        objLabel: 'Facet',
                        objAPIName: nsp + 'UIFacet__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    },
                    {
                        objLabel: 'Section',
                        objAPIName: nsp + 'UISection__c',
                        recordType: '',
                        active: true,
                        createRecord: true
                    }
                ]
            }
        ];

        var previousTab = null;
        var currentTab = null;

        function addTab(tabInfo) {
            var nsp = fileNsPrefix();
            var tab, url, productSpecId;
            var obj = tabInfo.obj;
            
            if (tabInfo.doAction === 'searchRecords') {
                /* Search Records */
                url = '/apex/ConsoleAdminSearch?doLabel=' + obj.objLabel + '&doAPIName=' + obj.objAPIName + '&doRecordType=' + obj.recordType;
                tab = {'title': 'Search ' + obj.objLabel, 'objectUrl': url, 'objectId': obj.id, 'template': 'ObjectTab.tpl.html', 'active': true};
            }
            else if (tabInfo.doAction === 'searchTranslationRecords') {
                /* Search Records */
                url = '/apex/MLSHome',
                tab = {'title': 'String Translations','objectUrl': url, 'template': 'ObjectTab.tpl.html', 'active': true};
            } 
            else if (tabInfo.doAction === 'newRecord') {
                /* Create New Record */
                url = '/apex/NewObjectRecord?doLabel=' + obj.objLabel + '&doAPIName=' + obj.objAPIName + '&doRecordType=' + obj.recordType;
                tab = {'title': 'New ' + obj.objLabel, 'objectUrl': url, 'objectId': ('new' + obj.id + '_' + tabs.length), 'template': 'ObjectTab.tpl.html', 'active': true};
            } else if (tabInfo.doAction === 'viewRecord') {
                /* View Record */
                var doAPIName = tabInfo.doAPIName;
                var consoleObj = moduleMap[doAPIName];

                var doAPILabel = tabInfo.doAPILabel;
                var encodedObjName, encodedObjAPILabel, encodedObjAPIName;
                encodedObjName = encodeURIComponent(obj.Name);
                if (consoleObj) {
                	if(doAPILabel == undefined)
                	{
                		encodedObjAPILabel = encodeURIComponent(consoleObj.objLabel);
                	}
                	else
                	{
                		encodedObjAPILabel = encodeURIComponent(doAPILabel);
                	}
                    encodedObjAPIName = encodeURIComponent(consoleObj.objAPIName);
                } else {
                    encodedObjAPILabel = encodeURIComponent(tabInfo.doAPILabel);
                    encodedObjAPIName = encodeURIComponent(doAPIName);
                }

                if (doAPIName === (nsp + 'ObjectClass__c')) {
                    url = '/apex/ObjectClassAdmin?id=' + obj.Id + '&name=' + encodedObjName + '&objAPILabel=' + encodedObjAPILabel + '&objAPIName=' + encodedObjAPIName + '&isVirtual=' + obj[nsp + 'IsVirtual__c'];
                    tab = {'title': obj.Name, 'objectUrl': url, 'objectId': obj.Id, 'template': 'ObjectTab.tpl.html', 'active': true};
                } else if (doAPIName === 'OBJECT_TYPE') {
                    url = '/apex/ObjectTypeAdmin?id=' + obj.Id + '&name=' + encodedObjName + '&objAPILabel=' + encodedObjAPILabel + '&objAPIName=' + encodedObjAPIName;
                    tab = {'title': obj.Name, 'objectUrl': url, 'objectId': obj.Id, 'template': 'ObjectTab.tpl.html', 'active': true};
                } else {
                    url = '/apex/EPCAdmin?id=' + obj.Id + '&name=' + encodedObjName + '&objAPILabel=' + encodedObjAPILabel + '&objAPIName=' + encodedObjAPIName;
                    tab = {'title': obj.Name, 'objectUrl': url, 'objectId': obj.Id, 'template': 'ObjectTab.tpl.html', 'active': true};
                }
            }
            tabs.push(tab);
        }

        function removeTab(idx) {
            if (-1 < idx < tabs.length) {
                tabs.splice(idx, 1);
            }
        }

        return {
            createModuleMap: function() {
                angular.forEach(modules, function(module) {
                    angular.forEach(module.consoleObjects, function(consoleObj) {
                        moduleMap[consoleObj.objAPIName] = consoleObj;
                    });
                });
            },
            getTabs: function() {
                return tabs;
            },
            openTab: function(tabInfo) {
                addTab(tabInfo);
            },
            closeTab: function(idx) {
                removeTab(idx);
            },
            getPreviousTab: function() {
                return previousTab;
            },
            setPreviousTab: function(tab) {
                previousTab = tab;
            },
            getCurrentTab: function() {
                return currentTab;
            },
            setCurrentTab: function(tab) {
                currentTab = tab;
            },
            getModules: function() {
                return modules;
            },
            showNotification: function(message) {
                message.icon = '';
                message.severity = '';

                switch(message.type) {
                    case 'error':
                        message.icon = 'error';
                        message.severity = 'error';
                        message.autohide = true;
                        message.timeout = 10000;
                        break;
                    case 'success':
                        message.icon = 'success';
                        message.severity = 'success';
                        break;
                    case 'warning':
                        message.icon = 'warning';
                        message.severity = 'warning';
                        break;
                }
                
                $sldsToast({
                    title: message.title,
                    content: message.content,
                    severity: message.type,
                    icon: message.icon,
                    autohide: message.autohide,
                    timeout: message.timeout
                });
            }
        };
    }
]);

},{}],7:[function(require,module,exports){
angular.module("consoleadmin").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("Dashboard.tpl.html",'<div class="console-dashboard" ng-controller="DashboardController">\n    <div class="slds-grid slds-wrap slds-grid--pull-padded">\n        <div ng-repeat="module in modules" class="slds-col--padded slds-size--1-of-3 module" ng-if="module.active">\n            <div class="slds-card">\n                <div class="slds-card__header slds-grid grid--flex-spread">\n                    <h2 class="slds-text-heading--medium slds-truncate">{{module.name}}</h2>\n                </div>\n                <div class="slds-card__body">\n                    <ul class="slds-list--vertical slds-has-dividers--top-space console-objects">\n                        <li class="slds-list__item" ng-repeat="obj in module.consoleObjects" ng-if="obj.active">\n                            <div class="slds-clearfix">\n                                <div class="slds-float--left">{{obj.objLabel}}</div>\n                                <div class="slds-float--right">\n                                    <span class="slds-icon_container action" ng-click="searchObject(obj)">\n                                        <slds-svg-icon sprite="\'utility\'" size="\'x-small\'" icon="\'search\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                                        <span class="slds-assistive-text">Search {{obj.objLabel}}</span>\n                                    </span>\n                                    <span class="slds-icon_container action" ng-click="newObject(obj)" ng-if="obj.createRecord">\n                                        <slds-svg-icon sprite="\'action\'" size="\'x-small\'" icon="\'new\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                                        <span class="slds-assistive-text">New {{obj.objLabel}}</span>\n                                    </span>\n                                </div>\n                            </div>\n                        </li>\n                    </ul>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>'),$templateCache.put("tabset.tpl.html",'<div role="tabpanel">\n\t<ul class="nav nav-tabs console-navs" role="tablist">\n\t\t<li role="presentation" ng-repeat="tab in tabset.tabs" ng-class="{\'active\': (tab.active && ($index > 0)), \'object\': $first}">\n\t\t\t<div role="tab" ng-click="tabset.selectTab(tab)">\n                <span class="tab-heading">{{tab.heading}}</span>\n                <button ng-if="!$first" class="slds-button slds-button--icon btn-close-tab" ng-click="tabset.closeTab(tab, $index, $event)">\n                    <slds-button-svg-icon sprite="\'utility\'" size="\'small\'" icon="\'close\'"></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Close</span>\n                </button>\n            </div>\n\t\t</li>\n\t</ul>\n\t<div class="console-tab-content" ng-transclude></div>\n</div>'),$templateCache.put("ObjectTab.tpl.html",'<iframe src="{{$parent.objectUrl}}" id="consoletab_{{$parent.objectId}}" class="object-tab"></iframe>')}]);

},{}]},{},[1]);
})();

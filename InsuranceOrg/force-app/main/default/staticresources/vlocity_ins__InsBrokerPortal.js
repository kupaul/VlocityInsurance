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
angular.module('insBrokerPortal', ['vlocity', 'CardFramework', 'sldsangular', 'forceng',
    'ngSanitize', 'cfp.hotkeys', 'insProductSelection', 'insQuote', 'insValidationHandler'
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
        $rootScope.currentLocation = parent.window.location.href;
        var i = $rootScope.currentLocation.indexOf('/s/');
        $rootScope.currentLocation = $rootScope.currentLocation.substring(0, i) + '/s/';

    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        'use strict';
        return function(sldsURL) {
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]);

// Controllers
require('./modules/insBrokerPortal/controller/InsBrokerController.js');

// Templates
require('./modules/insBrokerPortal/templates/templates.js');

},{"./modules/insBrokerPortal/controller/InsBrokerController.js":2,"./modules/insBrokerPortal/templates/templates.js":3}],2:[function(require,module,exports){
angular.module('insBrokerPortal').controller('InsBrokerController',
    ['$scope', '$rootScope', function(
    $scope, $rootScope) {
    'use strict';

    $scope.vlocBroker = {}; 
    var activeTab = 0;

    $scope.vlocBroker.switchTab = function(index){
        $scope.vlocBroker.tabs[activeTab].isActive = false; 
        activeTab = index; 
        $scope.vlocBroker.tabs[activeTab].isActive = true;
        $scope.vlocBroker.activeTab = $scope.vlocBroker.tabs[activeTab].label;
        $scope.vlocBroker.activeTabNo = $rootScope.tabCount[$scope.vlocBroker.activeTab];
    };

    $scope.vlocBroker.setRecords = function(records, cards) {
        $scope.vlocBroker.tabs  = [];
        $rootScope.tabCount = {};
        console.log(records);
        for(var i = 0; i < cards[0].states.length; i++) {
            var obj = {
                label : cards[0].states[i].name,
                isActive : false,
                no: 0, 
                sprite:  cards[0].states[i].definedActions.actions[0].extraParams.sprite,
                icon:  cards[0].states[i].definedActions.actions[0].extraParams.icon, 
                filter: cards[0].states[i].filter
            }; 
            if(i === 0){
                obj.isActive = true;
            }
            $rootScope.tabCount[obj.label] = 0;
            $scope.vlocBroker.tabs.push(obj);
        }
        $scope.vlocBroker.records = records;
        $scope.vlocBroker.activeTabNo = $scope.vlocBroker.tabs[0].no;
        $scope.vlocBroker.activeTab = $scope.vlocBroker.tabs[0].label;
        console.log($scope.vlocBroker.records);
    };

    $scope.vlocBroker.setStates = function(data, activeTab){
        $scope.data = data;
        var result = $scope.data.invokeCardFunctions('getActiveStates'); 
        $scope.data.cardState = result.data[0].name;
        $rootScope.tabCount[$scope.data.cardState] += 1;
    };


}]);
},{}],3:[function(require,module,exports){
angular.module("insBrokerPortal").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("SldsTooltip.tpl.html",'<div class="slds-popover slds-popover_tooltip slds-nubbin_bottom popover_{{title}}" role="tooltip" ng-show="title" style="display: flex">\n    <div class="slds-popover__body slds-text-align_center" style="display:inline-block; margin:0; padding: 0; padding-left:.2rem; padding-right:.2rem; text-align: center" ng-bind="title"></div>\n</div>\n')}]);

},{}]},{},[1]);
})();

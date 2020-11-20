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
 * Build: v100.0.0
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
/*jshint ignore:start */
require('./VlocTemplates.js');
var _$provide;
angular.module('CardFramework',['vlocity', 'vlocTemplates', 'mgcrea.ngStrap', 'sldsangular'])
.config(['$localizableProvider', function($localizableProvider) {
    'use strict';
    $localizableProvider.setLocalizedMap(window.i18n);
    $localizableProvider.setDebugMode(window.ns === '');
}])
.config(function($provide) {
    _$provide = $provide;
})
.config(['$compileProvider','$logProvider', function ($compileProvider, $logProvider) {
    'use strict';
    var debugMode;
    //had to copy from pageService as services are not available
    //in config

    var params = function() {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var queryString = {};
        var query, vars;
        // for Desktop
        if (typeof Visualforce !== 'undefined') {
            query = window.location.search.substring(1);
        // for Mobile Hybrid Ionic
        } else {
            query = window.location.hash.split('?')[1];
        }

        if (query) {
            vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                // If first entry with this name
                if (typeof queryString[pair[0]] === 'undefined') {
                    queryString[pair[0]] = decodeURIComponent(pair[1]);
                    // If second entry with this name
                } else if (typeof queryString[pair[0]] === 'string') {
                    var arr = [queryString[pair[0]],decodeURIComponent(pair[1])];
                    queryString[pair[0]] = arr;
                    // If third or later entry with this name
                } else {
                    queryString[pair[0]].push(decodeURIComponent(pair[1]));
                }
            }
        }

        return queryString;
    }();

    debugMode = params.debugMode ? params.debugMode === 'true' : false;

    $compileProvider.debugInfoEnabled(debugMode);
    $logProvider.debugEnabled(debugMode);

}])
.config(['$controllerProvider','$windowProvider','$filterProvider','$provide','$compileProvider', function($controllerProvider, $windowProvider, $filterProvider, $provide, $compileProvider) {
    'use strict';
    $windowProvider.$get().vlocity  = $windowProvider.$get().vlocity || {};
    $windowProvider.$get().vlocity.cardframework = $windowProvider.$get().vlocity.cardframework || {};
    //set registerModule method to be global
    $windowProvider.$get().vlocity.cardframework.registerModule =
    {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service
    };
}])
.run(['$rootScope', 'actionService', 'cardIconFactory', 'pageService', '$timeout', '$log', 'interactionTracking','userProfileService','dataService','configService',
 function($rootScope, actionService, cardIconFactory, pageService, $timeout, $log, interactionTracking, userProfileService, dataService, configService) {
    'use strict';
    $rootScope.nsPrefix = fileNsPrefix();
    $rootScope.cardIconFactory = cardIconFactory;

    //@TODO Line numbers always point to the closure function in console rather than the
    //call stack for errors or debug when $log.getIntance is used. Needs Fix

    //setup logging
    $log.getInstance = function(context) {
        return {
            log   : enhanceLogging($log.log, context),
            info  : enhanceLogging($log.info, context),
            warn  : enhanceLogging($log.warn, context),
            debug : enhanceLogging($log.debug, context),
            error : enhanceLogging($log.error, context)
        };
    };

    function enhanceLogging(loggingFunc, context) {
        return function() {
            var modifiedArguments = [].slice.call(arguments);
            modifiedArguments[0] = ['::[' + context + ']> '] + modifiedArguments[0];
            loggingFunc.apply(null, modifiedArguments);
        };
    }

    //Cache buster for session storage
    //useCache url param name is case insensitive
    if (pageService.params.useCache && pageService.params.useCache === 'false' || pageService.params.usecache && pageService.params.usecache === 'false') {
        try {
            //Private/Incognito mode will throw an error while accessing local/sessionstorage in some browsers
            sessionStorage.clear();
        } catch (e) {};
    }

    //get all vlocity Actions
    actionService.getActionsInfo().then(function(actions) {
        if (actions) {
            $rootScope.allActions = actions;
        } else {
            $rootScope.allActions = [];
        }
    });

    userProfileService.userInfoPromise();
    //initialize vlocityCards global variable
    $rootScope.vlocityCards = $rootScope.vlocityCards || {};
    //get the Card Framework Configuration
    dataService.getCustomSettings($rootScope.nsPrefix + 'CardFrameworkConfiguration__c').then(
        function(customSettings){
            $rootScope.vlocityCards.customSettings = $rootScope.vlocityCards.customSettings || {};
            if(customSettings.length > 0){
                var resultSettings = {};
                //combining custom settings for org, profile and user
                angular.forEach(customSettings, function(setting){
                    _.mergeWith(resultSettings, setting, function(objValue, srcValue){
                        return objValue || srcValue;
                    });
                });
                angular.forEach(Object.keys(resultSettings), function(settingName){
                    if(settingName.startsWith($rootScope.nsPrefix)){
                        $rootScope.vlocityCards.customSettings[settingName] = resultSettings[settingName];
                    }
                });    
            }
            $log.debug('vlocity settings ',$rootScope.vlocityCards.customSettings);

        }, function(err){
            $log.debug('vlocity settings err ',err);
            $rootScope.vlocityCards.customSettings = $rootScope.vlocityCards.customSettings || {};
        });

    var showDigestChart = pageService.params.debugMode ? pageService.params.debugMode === 'true' : false;

    if (showDigestChart && typeof showAngularStats !== 'undefined'){
        //add timeout to wait for angular to initiate before showing chart
        $timeout(function() {
            showAngularStats();
        }, 50);
    }

    $log.debug('page params ',pageService.params);
    //check if interaction has already been initiated
    if (pageService.params['vlocity.token']) {
        $rootScope.vlocity = $rootScope.vlocity || {};
        $rootScope.vlocity.CardsSesssionToken = pageService.params['vlocity.token'];
    } else {
        //init tracking here
        var initTracking = {
            'TrackingService' : 'CardFramework',
            'TrackingEvent' : 'initTracking',
            'Language': navigator.Language,
            'AppVersion' : navigator.appVersion,
            'Browser' : navigator,
            'PageParams': pageService.params,
            'ContextId' : pageService.params.id || pageService.params.Id
        };

        setTimeout( function() {
            configService.isTrackingEnabled('CardFramework').then(function(enabled){
                if(enabled){
                    interactionTracking.addInteraction(angular.extend(initTracking, interactionTracking.getDefaultTrackingData()));
                }
            }, function(err){
                //error handling
            });
        }, 0);
        

    }

    var initCards = {
        'TrackingService' : 'CardFramework',
        'TrackingEvent' : 'initCardFramework',
        'PageParams': pageService.params,
        'ContextId' : pageService.params.id || pageService.params.Id
    };

    setTimeout( function() {
        configService.isTrackingEnabled('CardFramework').then(function(enabled){
                if(enabled){
                    interactionTracking.addInteraction(angular.extend(initCards, interactionTracking.getDefaultTrackingData()));
                }
        }, function(err){
           //error handling
        });
    }, 0);
    
    // setup of Lightning related code
    // register external handler for message events from iframeresizer
    window.vlocityUniversalCardPage = {
        handleExternalEvent: function(message) {
            if (message.type && message.type == 'cardevent') {
                $scope.$apply(function() {
                    $scope.$broadcast('vlocity.layout.' + message.layoutName + '.events', message.message);
                });
            }
        }
    };

    function normalizeProperties(action, nsPrefix) {
        return Object.keys(action).reduce(function(obj, key) {
            obj[key.replace(nsPrefix, '')] = action[key];
            return obj;
        }, {});
    }

    _$provide.decorator('performAction', function($delegate) {
        var performAction = $delegate;
        
        var wrapper = function (action, actionConfig, obj, data, filter, pickedState) {
            if ('parentIFrame' in window) {
                var record = performAction.getSORecord(data, obj);
                parentIFrame.sendMessage({
                    message:'actionLauncher:windowopen',
                    actionConfig: normalizeProperties(actionConfig, $rootScope.nsPrefix),
                    action: normalizeProperties(action, $rootScope.nsPrefix),
                    sObjType: performAction.getSObjectType(obj, pickedState),
                    contextId: record ? record.Id : null
                });
            } else {
                performAction.apply(this, arguments);
            }
        };
        
        wrapper.getSORecord = performAction.getSORecord;
        wrapper.getSObjectType = performAction.getSObjectType;
    
        return wrapper;
    });

}])

.config(['remoteActionsProvider', function(remoteActionsProvider) {

    var nsPrefixDotNotation = fileNsPrefixDot();

    var remoteActions = {
        getUserProfile: {
            action: nsPrefixDotNotation + 'CardCanvasController.getUserProfile',
            config: {escape: false,  buffer: false}
        },
        getDataViaDynamicSoql: {
            action: nsPrefixDotNotation + 'CardCanvasController.getDataViaDynamicSoql',
            config: {escape: false,  buffer: false}
        },
        getDatasourceQuery: {
            action: nsPrefixDotNotation + 'CardCanvasController.getDatasourceQuery',
            config: {escape: false,  buffer: false}
        },
        getDataViaDataRaptor: {
            action: nsPrefixDotNotation + 'CardCanvasController.getDataViaDataRaptor',
            config: {escape: false,  buffer: false}
        },
        getAccountById: {
            action: nsPrefixDotNotation + 'CardCanvasController.getAccountById',
            config: {escape: false,  buffer: false}
        },
        getConsoleCardsAction: {
            action: nsPrefixDotNotation + 'CardCanvasController.getConsoleCardsAction',
            config: {escape: false,  buffer: false}
        },
        getActionsInfo: {
            action: nsPrefixDotNotation + 'CardCanvasController.getActionsInfo',
            config: {escape: false, buffer: false}
        },
        getActions: {
            action: nsPrefixDotNotation + 'CardCanvasController.getActionDetails',
            config: {escape: false,  buffer: false}
        },
        getActionDetailsByName: {
            action: nsPrefixDotNotation + 'CardCanvasController.getActionDetailsByName',
            config: {escape: false,  buffer: false}
        },
        getLayouts: {
            action: nsPrefixDotNotation + 'CardCanvasController.getAllLayouts',
            config: {escape: false,  buffer: false}
        },
        getLayout: {
            action: nsPrefixDotNotation + 'CardCanvasController.getLayout',
            config: {escape: false,  buffer: false}
        },
        getLayoutsByName: {
            action: nsPrefixDotNotation + 'CardCanvasController.getLayoutByName',
            config: {escape: false,  buffer: false}
        },
        getCards: {
            action: nsPrefixDotNotation + 'CardCanvasController.getAllCardDefinitions',
            config: {escape: false,  buffer: false}
        },
        getCardByName: {
            action: nsPrefixDotNotation + 'CardCanvasController.getCardByName',
            config: {escape: false,  buffer: false}
        },
        getCardsByNames: {
            action: nsPrefixDotNotation + 'CardCanvasController.getCardsByNames',
            config: {escape: false,  buffer: false}
        },
        getStaticResourcesUrl: {
            action: nsPrefixDotNotation + 'CardCanvasController.getStaticResourcesUrl',
            config: {escape: false,  buffer: false}
        },
        doGenericInvoke: {
            action: nsPrefixDotNotation + 'CardCanvasController.doGenericInvoke',
            config: {escape: false, buffer: false}
        },
        getAllObjects: {
            action: nsPrefixDotNotation + 'CardCanvasController.getAllObjects',
            config: {escape: false,  buffer: false}
        },
        getFieldsForObject: {
            action: nsPrefixDotNotation + 'CardCanvasController.getFieldsForObject',
            config: {escape: false,  buffer: false}
        },
        getActiveTemplateNames: {
            action: nsPrefixDotNotation + 'CardCanvasController.getActiveTemplateNames',
            config: {escape: false, buffer: false}
        },
        getTemplate: {
            action: nsPrefixDotNotation + 'CardCanvasController.getTemplate',
            config: {escape: false,  buffer: false}
        },
        getCustomLabelValue: {
            action: nsPrefixDotNotation + 'CardCanvasController.getCustomLabelValue',
            config: {escape: false,  buffer: false}
        },
        getCustomLabels: {
            action: nsPrefixDotNotation + 'CardCanvasController.getCustomLabels',
            config: {escape: false,  buffer: false}
        },
        doNamedCredentialCallout: {
            action: nsPrefixDotNotation + 'CardCanvasController.doNamedCredentialCallout',
            config: {escape: false,  buffer: false}
        },
        getCustomSettings: {
            action: nsPrefixDotNotation + 'CardCanvasController.getCustomSettings',
            config: {escape: false,  buffer: false}
        },
        trackVlocityInteraction: {
            action: nsPrefixDotNotation + 'CardCanvasController.trackVlocityInteraction',
            config: {escape: false,  buffer: false}
        },
    };
    // Only desktop would need RemoteActions
    if (typeof Visualforce !== 'undefined') {
        remoteActionsProvider.setRemoteActions(remoteActions || {});
    }
}])

.filter('picker', function($interpolate) {
    return function() {
        // console.info(arguments);
        var result;
        if (arguments[1] === 'currency' || arguments[1] === 'datetime' ||
            arguments[1] === 'percentage' || arguments[1] === 'phone') {
            result = $interpolate('{{value | ' + arguments[1] + '}}');
            return result({value: arguments[0]});
        } else if (arguments[1] === 'date') {
            result = $interpolate('{{value | ' + arguments[1] + ':\"shortDate\"}}');
            return result({value: arguments[0]});
        } else if (arguments[1] === 'address') {
            result = $interpolate('{{value | ' + arguments[1] + '}}');
            return result({value: arguments[0]});
        } else {
            return arguments[0];
        }

    };
})

.filter('getter', function() {
    return function(expr, scope) {
        var result = '';
        var funcRegex = /^\[\'.*\'\]$/m;
        var field;
        try {
            if (arguments[2]) {
                if (!arguments[1].hasOwnProperty(arguments[2])) {
                    if (arguments[1].hasOwnProperty('label')) {
                        // need to evaluate regex here if bracket notated
                        if (funcRegex.test(arguments[1].label)) {
                            console.log()
                            field = arguments[1].label;
                        } else {
                            return arguments[1].label;
                        }
                    } else {
                        return '';
                    }
                // need to evaluate regex here if bracket notated
                } else if (funcRegex.test(arguments[1][arguments[2]])) {
                    field = arguments[1][arguments[2]];
                } else {
                    return arguments[1][arguments[2]];
                }
            } else {
                field = (arguments[1].name || arguments[1].Name);
            }
            result = _.get(expr,field);
        } catch (e) {

        }
        return result;
    };
})
.filter('groupByField', function () {
    return function (data, key) {
        if(data === undefined) {
            return [];
        }
        var filtered = angular.copy(data);

        var results = _(filtered)
            .groupBy(key) // gropping it by key which creates multiple array group
            .map(function (g) {
                g[0].isGroupedBy = g[0][key]; // the first item in each group is added a extra field
                return g;
            })
            .flatten() // flatten multiple array group to one
            .value();

        return results;
    };
})
.filter('resolveCustomField', ['$rootScope', function($rootScope){
    return function(input, fieldName, path) {
        var resolvedName = fieldName;
        if (resolvedName.slice(-3) === '__c') {
            resolvedName = resolvedName.slice(0, -3);
        }

        if (_.isEmpty($rootScope.nsPrefix)) {
            resolvedName = resolvedName + "__c";
        } else {
            resolvedName = $rootScope.nsPrefix + resolvedName + "__c";
        }

        if (path && path.length > 0) {
            return _.get(input[resolvedName], path);
        }
        return input[resolvedName];
    };
}])

.filter('customLabel', ['$rootScope', 'remoteActions','$timeout', '$log','dataService', function($rootScope, remoteActions, $timeout, $log, dataService) {
    $log = $log.getInstance('CardFramework: filter: customLabel');
    //initialazing label cache
    $rootScope.vlocity = ($rootScope.vlocity || {});
    $rootScope.vlocity.customLabels = ($rootScope.vlocity.customLabels || {});
    //setting locale if non-existant
    $rootScope.vlocity.userLanguage = $rootScope.vlocity.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage;
    //normalize between locale formats : en_US and en-US
    $rootScope.vlocity.userLanguage = $rootScope.vlocity.userLanguage.toLowerCase().replace('_','-');
    function getCustomLabel(labelName) {
        $log.debug('getting label ',labelName, $rootScope.vlocity.userLanguage, $rootScope.vlocity.customLabels[labelName]);
        if ($rootScope.vlocity.customLabels[labelName] && $rootScope.vlocity.customLabels[labelName][$rootScope.vlocity.userLanguage]) {
            return $rootScope.vlocity.customLabels[labelName][$rootScope.vlocity.userLanguage];
        } else {
            $rootScope.vlocity.customLabels[labelName] = {};
        }
        $rootScope.vlocity.customLabels[labelName][$rootScope.vlocity.userLanguage] = labelName; //loading

        try {   
            dataService.fetchCustomLabels([labelName], $rootScope.vlocity.userLanguage, $rootScope.forcetkClient).then(
            function(allLabels) {
                $log.debug('customLabel getAllLabelsPromise ',  allLabels);
                $rootScope.vlocity.customLabels[labelName][$rootScope.vlocity.userLanguage] = allLabels[labelName];
            },
            function(error) {
                $log.debug('customLabel getAllLabelsPromise retrieval error: ', error);
            });
        } catch (e) {
            $log.error(e);
        }
        return $rootScope.vlocity.customLabels[labelName][$rootScope.vlocity.userLanguage];
    };

    getCustomLabel.$stateful = true;

    return getCustomLabel;
}])

.filter('moment', ['$rootScope', function($rootScope) {
    return function(dateString, format) {
        var localTime = moment.tz(dateString, $rootScope.vlocity.userTimeZone);
        return moment(localTime).format(format);
    };
}])

.filter('datetime', ['$filter', function($filter) {
    return function(input) {
        if (!input || input === '') {
            return '';
        }
        return $filter('moment')(input, 'lll');
    };
}])

.filter('percentage', ['$filter', function($filter) {
    return function(input, decimals) {
        // we cannot use !input here as that would exclude input === 0 which is legit
        if (input === 'undefined' || input == null || input === '') {
            return '';
        }
        return $filter('number')(input, decimals) + '%';
    };
}])

.filter('address', [function() {
    return function(input) {
        // we cannot use !input here as that would exclude input === 0 which is legit
        if (input === 'undefined' || input == null || input === '') {
            return '';
        }
        // check if input type is string and has char { to ensure its an object
        if(typeof input === 'string' && input.charAt(0) === '{') {
            input = JSON.parse(input);
        }
        var address = [
            input.street || input.Street,
            input.city || input.City,
            input.state || input.State,
            input.postalCode || input.PostalCode,
            input.country || input.Country
        ].filter(function(val) {
            return val != null;
        });
        if (address.length === 0 && (input.Latitude || input.latitude)) {
            return 'Longitude: ' + (input.longitude || input.Longitude) + '; Latitude: ' + (input.latitude || input.Latitude);
        }

        return address.join(', ');
    };
}])

.filter('uniqueValues', function() {
  return function (items, filterOn, includeEmpty) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [];

      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }

    if (includeEmpty) {
        items.push(includeEmpty);
    }
    return items;
  };
})

.filter('phone', function() {
    return function(phone) {

        if (!phone) {
            return '';
        }

        var value = phone.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return phone;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return phone;
        }

        if (country === 1) {
            country = '';
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + ' (' + city + ') ' + number).trim();
    };
})

.filter('currency', ['$rootScope', 'ISO_CURRENCY_INFO', function($rootScope, ISO_CURRENCY_INFO) {
    return function(amt) {
        // we cannot use !amt here as that would exclude amt === 0 which is legit
        if (amt === 'undefined' || amt == null || amt === '') {
            return '';
        }
        var isoCurrencyCode = $rootScope.vlocity.userCurrency || 'USD';
        var isoCurrencySymbol = ISO_CURRENCY_INFO[isoCurrencyCode].text;
        return OSREC.CurrencyFormatter.format(amt, { currency: isoCurrencyCode, symbol: isoCurrencySymbol});
    };
}])

.constant('ISO_CURRENCY_INFO', {'ALL':{'text':'Lek','uniDec':'76, 101, 107','uniHex':'4c, 65, 6b'},'AFN':{'text':'؋','uniDec':'1547','uniHex':'60b'},'ARS':{'text':'$','uniDec':'36','uniHex':'24','format':'#.###,##'},'AWG':{'text':'ƒ','uniDec':'402','uniHex':'192','format':'#,###.##'},'AUD':{'text':'$','uniDec':'36','uniHex':'24','format':'# ###.##'},'AZN':{'text':'ман','uniDec':'1084, 1072, 1085','uniHex':'43c, 430, 43d'},'BSD':{'text':'$','uniDec':'36','uniHex':'24','format':'#,###.##'},'BBD':{'text':'$','uniDec':'36','uniHex':'24'},'BYR':{'text':'p.','uniDec':'112, 46','uniHex':'70, 2e'},'BZD':{'text':'BZ$','uniDec':'66, 90, 36','uniHex':'42, 5a, 24','format':'#,###.##'},'BMD':{'text':'$','uniDec':'36','uniHex':'24','format':'#,###.##'},'BOB':{'text':'$b','uniDec':'36, 98','uniHex':'24, 62','format':'#,###.##'},'BAM':{'text':'KM','uniDec':'75, 77','uniHex':'4b, 4d','format':'#,###.##'},'BWP':{'text':'P','uniDec':'80','uniHex':'50','format':'#,###.##'},'BGN':{'text':'лв','uniDec':'1083, 1074','uniHex':'43b, 432'},'BRL':{'text':'R$','uniDec':'82, 36','uniHex':'52, 24','format':'#.###,##'},'BND':{'text':'$','uniDec':'36','uniHex':'24','format':'#,###.##'},'KHR':{'text':'៛','uniDec':'6107','uniHex':'17db'},'CAD':{'text':'$','uniDec':'36','uniHex':'24','format':'#,###.##'},'KYD':{'text':'$','uniDec':'36','uniHex':'24','format':'#,###.##'},'CLP':{'text':'$','uniDec':'36','uniHex':'24','format':'#.###'},'CNY':{'text':'¥','uniDec':'165','uniHex':'a5','format':'#,###.##'},'COP':{'text':'$','uniDec':'36','uniHex':'24','format':'#.###,##'},'CRC':{'text':'₡','uniDec':'8353','uniHex':'20a1','format':'#.###,##'},'HRK':{'text':'kn','uniDec':'107, 110','uniHex':'6b, 6e','format':'#.###,##'},'CUP':{'text':'₱','uniDec':'8369','uniHex':'20b1','format':'#,###.##'},'CZK':{'text':'Kč','uniDec':'75, 269','uniHex':'4b, 10d','format':'#.###,##'},'DKK':{'text':'kr','uniDec':'107, 114','uniHex':'6b, 72','format':'#.###,##'},'DOP':{'text':'RD$','uniDec':'82, 68, 36','uniHex':'52, 44, 24','format':'#,###.##'},'XCD':{'text':'$','uniDec':'36','uniHex':'24','format':'#,###.##'},'EGP':{'text':'£','uniDec':'163','uniHex':'a3','format':'#,###.##'},'SVC':{'text':'$','uniDec':'36','uniHex':'24','format':'#,###.##'},'EEK':{'text':'kr','uniDec':'107, 114','uniHex':'6b, 72','format':'#,###.##'},'EUR':{'text':'€','uniDec':'8364','uniHex':'20ac','format':'#,###.##'},'FKP':{'text':'£','uniDec':'163','uniHex':'a3'},'FJD':{'text':'$','uniDec':'36','uniHex':'24'},'GHC':{'text':'¢','uniDec':'162','uniHex':'a2','format':'#,###.##'},'GIP':{'text':'£','uniDec':'163','uniHex':'a3','format':'#,###.##'},'GTQ':{'text':'Q','uniDec':'81','uniHex':'51','format':'#,###.##'},'GGP':{'text':'£','uniDec':'163','uniHex':'a3'},'GYD':{'text':'$','uniDec':'36','uniHex':'24'},'HNL':{'text':'L','uniDec':'76','uniHex':'4c','format':'#,###.##'},'HKD':{'text':'$','uniDec':'36','uniHex':'24','format':'#,###.##'},'HUF':{'text':'Ft','uniDec':'70, 116','uniHex':'46, 74','format':'#.###'},'ISK':{'text':'kr','uniDec':'107, 114','uniHex':'6b, 72','format':'#.###'},'INR':{'text':'₹','uniDec':'8377','uniHex':'20B9','format':'#,##,###.##'},'IDR':{'text':'Rp','uniDec':'82, 112','uniHex':'52, 70','format':'#.###,##'},'IRR':{'text':'ریال','uniDec':'65020','uniHex':'fdfc','format':'#,###.##'},'IMP':{'text':'£','uniDec':'163','uniHex':'a3'},'ILS':{'text':'₪','uniDec':'8362','uniHex':'20aa','format':'#,###.##'},'IQD':{'text':'د.ع.‏','uniDec':'','uniHex':'','format':'#,###.###' },'JMD':{'text':'J$','uniDec':'74, 36','uniHex':'4a, 24','format':'#,###.##'},'JPY':{'text':'¥','uniDec':'165','uniHex':'a5','format':'#,###'},'JEP':{'text':'£','uniDec':'163','uniHex':'a3'},'KZT':{'text':'лв','uniDec':'1083, 1074','uniHex':'43b, 432'},'KPW':{'text':'₩','uniDec':'8361','uniHex':'20a9'},'KRW':{'text':'₩','uniDec':'8361','uniHex':'20a9','format':'#,###'},'KGS':{'text':'лв','uniDec':'1083, 1074','uniHex':'43b, 432'},'LAK':{'text':'₭','uniDec':'8365','uniHex':'20ad'},'LVL':{'text':'Ls','uniDec':'76, 115','uniHex':'4c, 73','format':'#,###.##'},'LBP':{'text':'£','uniDec':'163','uniHex':'a3','format':'# ###'},'LRD':{'text':'$','uniDec':'36','uniHex':'24'},'LTL':{'text':'Lt','uniDec':'76, 116','uniHex':'4c, 74','format':'# ###,##'},'MKD':{'text':'ден','uniDec':'1076, 1077, 1085','uniHex':'434, 435, 43d','format':'#,###.##'},'MYR':{'text':'RM','uniDec':'82, 77','uniHex':'52, 4d','format':'#,###.##'},'MUR':{'text':'Rs','uniDec':'8360','uniHex':'20a8','format':'#,###'},'MXN':{'text':'$','uniDec':'36','uniHex':'24','format':'#,###.##'},'MNT':{'text':'₮','uniDec':'8366','uniHex':'20ae'},'MZN':{'text':'MT','uniDec':'77, 84','uniHex':'4d, 54'},'NAD':{'text':'$','uniDec':'36','uniHex':'24'},'NPR':{'text':'Rs','uniDec':'8360','uniHex':'20a8','format':'#,###.##'},'ANG':{'text':'ƒ','uniDec':'402','uniHex':'192','format':'#.###,##'},'NZD':{'text':'$','uniDec':'36','uniHex':'24','format':'#,###.##'},'NIO':{'text':'C$','uniDec':'67, 36','uniHex':'43, 24'},'NGN':{'text':'₦','uniDec':'8358','uniHex':'20a6'},'NOK':{'text':'kr','uniDec':'107, 114','uniHex':'6b, 72','format':'#.###,##'},'OMR':{'text':'ریال','uniDec':'65020','uniHex':'fdfc','format':'#,###.###'},'PKR':{'text':'Rs','uniDec':'8360','uniHex':'20a8','format':'#,###.##'},'PAB':{'text':'B/.','uniDec':'66, 47, 46','uniHex':'42, 2f, 2e'},'PYG':{'text':'Gs','uniDec':'71, 115','uniHex':'47, 73'},'PEN':{'text':'S/.','uniDec':'83, 47, 46','uniHex':'53, 2f, 2e','format':'#,###.##'},'PHP':{'text':'₱','uniDec':'8369','uniHex':'20b1','format':'#,###.##'},'PLN':{'text':'zł','uniDec':'122, 322','uniHex':'7a, 142','format':'# ###,##'},'QAR':{'text':'ریال','uniDec':'65020','uniHex':'fdfc'},'RON':{'text':'lei','uniDec':'108, 101, 105','uniHex':'6c, 65, 69','format':'#.###,##'},'RUB':{'text':'руб','uniDec':'1088, 1091, 1073','uniHex':'440, 443, 431','format':'#.###,##'},'SHP':{'text':'£','uniDec':'163','uniHex':'a3'},'SAR':{'text':'ریال','uniDec':'65020','uniHex':'fdfc','format':'#,###.##'},'RSD':{'text':'Дин.','uniDec':'1044, 1080, 1085, 46','uniHex':'414, 438, 43d, 2e'},'SCR':{'text':'Rs','uniDec':'8360','uniHex':'20a8'},'SGD':{'text':'$','uniDec':'36','uniHex':'24','format':'#,###.##'},'SBD':{'text':'$','uniDec':'36','uniHex':'24'},'SOS':{'text':'S','uniDec':'83','uniHex':'53'},'ZAR':{'text':'R','uniDec':'82','uniHex':'52','format':'# ###.##'},'LKR':{'text':'Rs','uniDec':'8360','uniHex':'20a8'},'SEK':{'text':'kr','uniDec':'107, 114','uniHex':'6b, 72','format':'# ###,##'},'CHF':{'text':'CHF','uniDec':'67, 72, 70','uniHex':'43, 48, 46','format':'#\'###.##'},'SRD':{'text':'$','uniDec':'36','uniHex':'24'},'SYP':{'text':'£','uniDec':'163','uniHex':'a3'},'TWD':{'text':'NT$','uniDec':'78, 84, 36','uniHex':'4e, 54, 24'},'THB':{'text':'฿','uniDec':'3647','uniHex':'e3f','format':'#,###.##'},'TTD':{'text':'TT$','uniDec':'84, 84, 36','uniHex':'54, 54, 24'},'TRY':{'text':'₺','uniDec':'8378','uniHex':'20ba','format':'#,###.##'},'TRL':{'text':'₤','uniDec':'8356','uniHex':'20a4'},'TVD':{'text':'$','uniDec':'36','uniHex':'24'},'UAH':{'text':'₴','uniDec':'8372','uniHex':'20b4','format':'# ###,##'},'GBP':{'text':'£','uniDec':'163','uniHex':'a3','format':'#,###.##'},'USD':{'text':'$','uniDec':'36','uniHex':'24','format':'#,###.##'},'UYU':{'text':'$U','uniDec':'36, 85','uniHex':'24, 55','format':'#.###,##'},'UZS':{'text':'лв','uniDec':'1083, 1074','uniHex':'43b, 432'},'VEF':{'text':'Bs','uniDec':'66, 115','uniHex':'42, 73','format':'#.###,##'},'VND':{'text':'₫','uniDec':'8363','uniHex':'20ab','format':'#.###'},'YER':{'text':'ریال','uniDec':'65020','uniHex':'fdfc'},'ZWD':{'text':'Z$','uniDec':'90, 36','uniHex':'5a, 24','format':'# ###.##'}})

.constant('API_VERSION', 'v39.0')

.value('timeStampInSeconds', Math.floor(new Date().getTime() / 1000))

.service('debugService', function() {

    this.valueOfNameSpacePrefix = function(nsPrefix) {
        return (nsPrefix == '') ? 'no namespace required for this org' : nsPrefix;
    };

    this.displayNameSpacePrefix = function(functionName, nsPrefix) {
        var nsPrefixDisplayName = this.valueOfNameSpacePrefix(nsPrefix);
        //console.log(functionName + '(): nsPrefix: ' + nsPrefixDisplayName);
    };
})

.service('networkService', function() {

})
.factory('nameSpaceService', function($q) {
    return {
        getNameSpacePrefix: function() {
            return $q(function(resolve) {
                resolve(fileNsPrefix());
            });
        }
    };
})

.factory('userProfileService', function(remoteActions, $log, $q, $rootScope) {
    return {
        promiseQueue: [],
        getUserProfile: function() {
            return remoteActions.getUserProfile().then(
                function(userp) {
                    return userp;
                },
                function(error) {
                    $log.debug('getUserProfile retrieval error: ' + error);
                });
        },
        userInfoPromise: function() {
            var deferred = $q.defer();
            this.promiseQueue.push(deferred);
            
            //check if userLocale is available
            if ($rootScope.vlocity.userId) {
                deferred.resolve();
            } 
            else if (this.promiseQueue.length <= 1) {
                if (typeof Visualforce !== 'undefined') {
                    var self = this;
                    this.getUserProfile().then(
                        function(data) {
                            $log.debug('user infos ', data);
                            $rootScope.vlocity.userId = data.userid;
                            $rootScope.vlocity.userAnLocale = data.anlocale;
                            $rootScope.vlocity.userSfLocale = data.sflocale;
                            $rootScope.vlocity.userCurrency = data.money;
                            $rootScope.vlocity.userLanguage = data.language;
                            $rootScope.vlocity.userTimeZone = data.timezone;
                            $rootScope.vlocity.userName = data.name;
                            $rootScope.vlocity.userType = data.type;
                            $rootScope.vlocity.userRole = data.role;
                            $rootScope.vlocity.userProfileName = data.profilename;
                            $rootScope.vlocity.userProfileId = data.profileid;
                            $rootScope.vlocity.userAccountId = data.accountid;
                            $rootScope.vlocity.userContactId = data.contactid;

                            self.promiseQueue.forEach(function(deferred) {
                                deferred.resolve();
                            });
                            self.promiseQueue = [];

                            /* DEPRECATED */
                            /* DO NOT USE the following. Use $rootScope.vlocity.userCurrency instead. */
                            $rootScope.userId = data.userid;
                            $rootScope.userAnLocale = data.anlocale;
                            $rootScope.userSfLocale = data.sflocale;
                            $rootScope.userCurrency = data.money;
                            $rootScope.userLanguage = data.language;
                            $rootScope.userTimeZone = data.timezone;
                    });
                }
            }
            
            return deferred.promise;
        }
    };
})

.factory('metaDataService', function($log) {
    $log = $log.getInstance('CardFramework: metaDataService');
    return {

        getGlobalDescribeTk: function(forcetkClient) {

            //$log.debug('calling actionService: getGlobalDescribe()');

            return forcetkClient.describeGlobal(
                function(result) {
                    var sObjects = result.sobjects;
                    //$log.debug('getGlobalDescribe completed with sObjects:');
                    //$log.debug(sObjects);
                    return sObjects;
                },
                function(error) {
                    $log.error('getGlobalDescribe retrieval error: ' + error);
                }
            );

        },

        getDescribeTk: function(sObjectType, forcetkClient) {

            //console.log('calling actionService: getDescribe()');

            return forcetkClient.describe(sObjectType,
                function(result) {
                    var sObjectTypeFields = result.fields;
                    //console.log('getDescribe completed with sObjectTypeFields:');
                    //console.log(sObjectTypeFields);
                    return sObjectTypeFields;
                },
                function(error) {
                    $log.debug('getDescribe retrieval error: ' + error);
                }
            );

        }

    };

})

.factory('actionService', function($q, remoteActions, force, nameSpaceService, debugService, $log, $rootScope) {

    var QueryString = function() {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var queryString = {};
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            // If first entry with this name
            if (typeof queryString[pair[0]] === 'undefined') {
                queryString[pair[0]] = decodeURIComponent(pair[1]);
                  // If second entry with this name
            } else if (typeof queryString[pair[0]] === 'string') {
                var arr = [queryString[pair[0]],decodeURIComponent(pair[1])];
                queryString[pair[0]] = arr;
                  // If third or later entry with this name
            } else {
                queryString[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return queryString;
    }();

    var cachedActions = null;

    var self = {
        getActionsInfo: function(ignoreCache) {
            /**
             * getActionsInfo will retrieve all 'active' vlocity actions just once.
             * Subsequent calls will get actions from the cached data unless the 'ignoreCache' flag is set
             */
            if (ignoreCache !== true && cachedActions != null) {
                return $q.when(cachedActions);
            }

            // Create the deffered object
            return $q(function(resolve, reject) {
                if (remoteActions != null && remoteActions['getActionsInfo']) {
                    remoteActions.getActionsInfo().then(
                        function(actions) {
                            cachedActions = actions;
                            resolve(cachedActions);
                        },
                        function(error) {
                            $log.debug('getActionsInfo retrieval error:' + error);
                            cachedActions = [];
                            reject(new Error('getActionsInfo retrieval error: ' + error));
                        });

                } else {
                    //check if the user is authenticated and that oauth has started
                    //getOauth will return undefined if force.init hasn't been called
                    if(!force.isAuthenticated() && force.getOAuth()){
                        cacheActions = undefined;
                        return $q.when([]);
                    }
                    //This is used when remoteactions are not available eg: ionic apps/ mobile apps
                    nameSpaceService.getNameSpacePrefix().then(
                        function(nsPrefix) {
                            debugService.displayNameSpacePrefix('getActionsInfo', nsPrefix);
                            var actionsQuery = 'SELECT Id, Name, ' + nsPrefix + 'ApplicableTypes__c, ' + nsPrefix + 'ApplicableUserProfiles__c, ' + nsPrefix + 'DisplayLabel__c, ' + nsPrefix + 'DisplayOn__c, ' + nsPrefix + 'Filter__c, ' + nsPrefix + 'LinkType__c, ' + nsPrefix + 'OpenUrlMode__c, ' + nsPrefix + 'Url__c, ' + nsPrefix + 'UrlParameters__c, ' + nsPrefix + 'VlocityIcon__c FROM ' + nsPrefix + 'VlocityAction__c WHERE Name != \'ConsoleCards\' AND ' + nsPrefix + 'IsActive__c = true';
                            return force.query(actionsQuery).then(
                                function(data) {
                                    cachedActions = data.records;
                                    resolve(cachedActions);
                                },
                                function(error) {
                                    $log.debug('getActionsInfo retrieval error: ' + error);
                                    cachedActions = [];
                                    reject(new Error('getActionsInfo retrieval error: ' + error));
                                });
                        });
                }
            });
        },

        getActionsInfoAsMap: function() {
            return self.getActionsInfo()
                .then(function(actions) {
                    return actions.reduce(function(obj, action) {
                        obj[action.Name] = action;
                        // Maintain the displayName and vlocityIcon as it's used in templates
                        // as part of old getActions implemenetation
                        action['displayName'] = action[$rootScope.nsPrefix + 'DisplayLabel__c'];
                        action['vlocityIcon'] = action[$rootScope.nsPrefix + 'VlocityIcon__c'];
                        return obj;
                    }, {});
                }, function(err){
                    $log.debug('getActionsInfoAsMap error ',err);
                    return err;
                });
        },

        getActions: function(objType, soRecord, displayOn, linkType, forcetkClient, $log) {
            var ctxId = soRecord ? soRecord.Id : QueryString.Id;
            ctxId = ctxId ? ctxId : null; //nulling works better than undefined for salesforce

            if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getActions']) {

                return remoteActions.getActions(objType, ctxId, displayOn, linkType).then(
                    function(actionsJSON) {
                        return JSON.parse(actionsJSON);
                    },
                    function(error) {
                        $log.debug('getActionsTk retrieval error: ' + error);
                    });

            } else {

                return nameSpaceService.getNameSpacePrefix().then(
                    function(nsPrefix) {

                        debugService.displayNameSpacePrefix('getActionsTk', nsPrefix);
                        var apexRestUrlNameSpacePrefix = (nsPrefix === '') ? '' : '/' + nsPrefix.replace('__','');
                        return force.apexrest({
                                path: apexRestUrlNameSpacePrefix + '/v1/action/action',
                                params: {
                                    objType: objType,
                                    sFilterContextId: ctxId,
                                    sDisplayOn: displayOn,
                                    sLinkType: linkType
                                }
                            },
                            function(actions) {
                                return actions;
                            },
                            function(error) {
                                $log.debug('getActionsTk retrieval error: ' + error);
                                $log.debug(error);
                            },'GET'
                        );

                    }, function(err){
                        $log.debug('error retrieving nsPrefix ',err);
                    });

            }

        },

        getActionsByName: function(objType, soRecord, displayOn, linkType, forcetkClient, $log, actionNames) {
            var ctxId = soRecord ? soRecord.Id : QueryString.Id;
            ctxId = ctxId ? ctxId : null; //nulling works better than undefined for salesforce

            if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getActionDetailsByName']) {

                return remoteActions.getActionDetailsByName(objType, ctxId, displayOn, linkType, actionNames).then(
                    function(actionsJSON) {
                        return JSON.parse(actionsJSON);
                    },
                    function(error) {
                        $log.debug('getActionsByName retrieval error: ' + error);
                    });

            } else {

                return nameSpaceService.getNameSpacePrefix().then(
                    function(nsPrefix) {

                        debugService.displayNameSpacePrefix('getActionsByName', nsPrefix);
                        var apexRestUrlNameSpacePrefix = (nsPrefix === '') ? '' : '/' + nsPrefix.replace('__','');
                        return force.apexrest({
                                path: apexRestUrlNameSpacePrefix + '/v1/action/actions',
                                params: {
                                    objType: objType,
                                    sFilterContextId: ctxId,
                                    sDisplayOn: displayOn,
                                    sLinkType: linkType,
                                    actionName: actionNames
                                }
                            },
                            function(actions) {
                                return actions;
                            },
                            function(error) {
                                $log.debug('getActionsByName retrieval error: ' + error);
                                $log.debug(error);
                                return error;
                            },'GET'
                        );

                    }, function(error) {
                        $log.debug('getNameSpacePrefix retrieval error: ' + error);
                    });
            }

        }

    };

    return self;

})

.factory('dataService', function($rootScope, remoteActions, force, nameSpaceService, debugService, pageService, $interpolate, $log, $q) {
    $log = $log.getInstance ? $log.getInstance('CardFramework: dataService') : $log;
    return {

        getRecords: function(queryStr) {
            var cardQuery = queryStr ? queryStr : 'SELECT Id, Name, AccountNumber, Industry, AccountSource, LastModifiedDate, (SELECT Id,Name,Title,FirstName,LastName,Phone,Department FROM Contacts) FROM Account LIMIT 2';
            // cardQuery = $interpolate(cardQuery)(pageService);
            //$log.debug(cardQuery);

            if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getDatasourceQuery']) {

                return remoteActions.getDatasourceQuery(queryStr).then(
                    function(records) {
                        var records = JSON.parse(records);
                        $log.debug('getRecords completed: ', records);
                        return records;
                    },

                    function(error) {
                        $log.error('getRecords retrieval error: ', error);
                        return error; // this is needed for the Card Designer to display SOQL error
                    });

            } else {

                return force.query(cardQuery).then(
                   function(data) {
                        var records = data.records;
                        $log.debug('getRecords: records retrieved: ', records);
                        return records;
                    },

                    function(error) {
                        $log.error('getRecords retrieval error: ',error);
                        return error; // this is needed for the Card Designer to display SOQL error
                    });

            }

        },

        getDataRaptorBundle: function(bundle, ctxId, forcetkClient) {
            var myService = this;
            return nameSpaceService.getNameSpacePrefix().then(
                function(nsPrefix) {

                    debugService.displayNameSpacePrefix('getDataRaptorBundle', nsPrefix);

                    if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getDataViaDataRaptor']) {
                        //creating map
                        var inputMap = {
                            Id: ctxId
                        };

                        return remoteActions.getDataViaDataRaptor(inputMap, bundle).then(
                            function(result) {
                                $log.debug('getDataRaptorBundle completed: ', result);
                                return JSON.parse(result);
                            },

                            function(error) {
                                $log.error('getDataRaptorBundle retrieval error: ', error);
                                return error; // this is needed for the Card Designer to display SOQL error
                            });

                    } else {

                        var apexRestUrlNameSpacePrefix = (nsPrefix == '') ? '' : '/' + nsPrefix.replace('__','');
                        return myService.getApexRest(apexRestUrlNameSpacePrefix + '/v2/DataRaptor/' + bundle + '/' + ctxId,'GET', null, forcetkClient).then(
                            function(records) {
                                //$log.debug('getDataRaptorBundle records: ', result);
                                return records;
                            },
                            function(error) {
                                $log.debug('getDataRaptorBundle retrieval error: ', error);
                                return error;
                            }
                        );
                    }
                }, function(error) {
                    $log.debug('getNameSpacePrefix retrieval error: ' + error);
                });
        },

        doGenericInvoke: function(className, methodName, inputMap, optionsMap) {
            forcetkClient = $rootScope.forcetkClient;
            $log.debug('calling dataService: doGenericInvoke()',className, methodName);
            var myService = this;
            return nameSpaceService.getNameSpacePrefix().then(
                function(nsPrefix) {

                    if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['doGenericInvoke']) {
                        inputMap = inputMap ? inputMap : {};
                        optionsMap = optionsMap ? optionsMap : {};
                        return remoteActions.doGenericInvoke(className, methodName, inputMap, optionsMap).then(
                            function(records) {
                                var records = JSON.parse(records);
                                $log.debug('doGenericInvoke completed for '+methodName+': ', records);
                                return records;
                            },

                            function(error) {
                                $log.debug('doGenericInvoke error: ' + error);
                                return error; // this is needed for the Card Designer to the error
                            });

                    } else {
                        var apexRestUrlNameSpacePrefix = (nsPrefix == '') ? '' : '/' + nsPrefix.replace('__','');
                        var payload = {
                                    sClassName: className,
                                    sMethodName: methodName,
                                    input: inputMap,
                                    options: optionsMap,
                            };

                        payload = JSON.stringify(payload);

                        return myService.getApexRest(apexRestUrlNameSpacePrefix + '/v1/invoke/','POST', payload, forcetkClient).then(function(records) {
                                $log.debug('doGenericInvoke completed for '+methodName+': ', records);
                                return records;
                            },
                            function(error) {
                                $log.debug('doGenericInvoke error: ' + error);
                                return error; // this is needed for the Card Designer to the error
                            });
                    }

                }, function(error) {
                    $log.debug('getNameSpacePrefix retrieval error: ', error);
                });
        },
        doNamedCredentialCallout: function(requestMap) {
            $log.debug('calling dataService: doNamedCredentialCallout()',requestMap);

            //returning rejected promise when datasource is disabled
            var deferred = $q.defer();
            if($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'Disable_Datasource_REST__c']) {
                deferred.reject('DataRaptor not enabled');
                return deferred.promise;
            }

            return nameSpaceService.getNameSpacePrefix().then(
                function(nsPrefix) {

                    if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['doNamedCredentialCallout']) {
                        return remoteActions.doNamedCredentialCallout(requestMap).then(
                            function(records) {
                                try {
                                    var records = JSON.parse(records);
                                    $log.debug('doNamedCredentialCallout completed: ', records);
                                    return records;
                                } catch (e) {
                                    $log.debug('error parsing response ',e);
                                }   return records;
                            },

                            function(error) {
                                $log.debug('doNamedCredentialCallout error: ', error);
                                return error; // this is needed for the Card Designer to the error
                            });

                    } else {
                        $log.debug('doNamedCredentialCallout not supported outside of salesforce');
                    }

                }, function(error) {
                    $log.debug('getNameSpacePrefix retrieval error: ' + error);
                });
        },

        getAccountById: function(id) {
            //$log.debug('calling dataService: getAccountById()');

            if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getAccountById']) {

                return remoteActions.getAccountById(id).then(
                    function(account) {
                        var account = JSON.parse(account);
                        $log.debug('getAccountById completed: ', account);
                        return account;
                    },

                    function(error) {
                        $log.debug('getAccountById retrieval error: ' + error);
                    });

            } else {
                return force.retrieve('Account', id, 'Id, Name, BillingAddress, Phone, PhotoURL, Website').then(
                    function(account) {
                        //$log.debug('getAccountById(): account: ' + account);
                        return account;
                    },

                    function(error) {
                        $log.debug('getAccountById retrieval error: ' + error);
                    });
            }
        },

        getCustomSettings: function(customSettingsName) {
            // Create the deferred object
            var deferred = $q.defer();
            var myService = this;
            if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getCustomSettings']) {

                remoteActions.getCustomSettings(customSettingsName).then(
                    function(result) {
                        var customSettings = JSON.parse(result);
                        $log.debug('getCustomSettings completed: ', customSettings);
                        deferred.resolve(customSettings);
                    },

                    function(error) {
                        $log.debug('getCustomSettings retrieval error: ',error);
                        deferred.reject(error);
                    });

            } else {
                var genericInvokeMap = {
                    'className' : 'CardCanvasController',
                    'methodName' : 'getCustomSettings',
                    'inputMap' : {
                        'customSettingsName' : customSettingsName
                    } 
                };
                return myService.doGenericInvoke(genericInvokeMap.className, genericInvokeMap.methodName, JSON.stringify(genericInvokeMap.inputMap)).then(function(data) {
                        $log.debug('getCustomSettings doGenericInvoke completed for ', data);
                        if(data.result){
                            var customSettings = JSON.parse(data.result);
                            deferred.resolve(customSettings);
                            return customSettings;
                        } else {
                            deferred.reject(data);
                        }
                    },
                    function(error) {
                        $log.debug('getCustomSettings doGenericInvoke error: ',error);
                        deferred.reject(error);
                    });
            }

            return deferred.promise;
        },

        fetchCustomLabels: function(labelNames, language, forcetkClient) {
            // Create the deferred object
            var deferred = $q.defer();

            $rootScope.vlocity = ($rootScope.vlocity || {});
            $rootScope.vlocity.userLanguage = $rootScope.vlocity.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage;
            //normalize between locale formats : en_US and en-us
            $rootScope.vlocity.userLanguage = $rootScope.vlocity.userLanguage.toLowerCase().replace('_','-');
            //if no language passed to function use user locale
            language = language || $rootScope.vlocity.userLanguage;
            $rootScope.vlocity.customLabels = ($rootScope.vlocity.customLabels || {});
            forcetkClient = forcetkClient || $rootScope.forcetkClient;

            $log.debug('custom labels being fetched ',language, labelNames);
            var cachedLabels = JSON.parse(sessionStorage.getItem('vlocity.customLabels')) || {};
            //set the local app cache
            _.assign($rootScope.vlocity.customLabels,cachedLabels);
            $log.debug('cached labels ', JSON.parse(sessionStorage.getItem('vlocity.customLabels')));

            angular.forEach(Object.keys(cachedLabels), function(labelKey) {
                var index = labelNames.indexOf(labelKey);
                if(index != -1) {
                    //check that it also includes the language locale
                    if(labelNames[index][language]) {
                        //remove cached label name from query list
                        labelNames.splice(index, 1);
                    } else {
                        $log.debug('label cached but not in right language ',language, labelNames[index]);
                    }
                }
            });
            if(labelNames.length > 0) {
                //APEX REMOTE
                if (typeof remoteActions !== 'undefined' && remoteActions !== null && remoteActions['getCustomLabels']) {
                        remoteActions.getCustomLabels(labelNames, language).then(
                            function(allLabels) {
                                var labelsMap = JSON.parse(allLabels);
                                $log.debug('getCustomLabels RESULTS: ', labelsMap);
                                if(labelsMap.messages.length > 0){
                                    $log.debug('getCustomLabels REMOTE error: ', labelsMap.messages);
                                    deferred.reject(labelsMap.messages);
                                } else {
                                    $rootScope.vlocity.userLanguage = labelsMap.data.dataMap.language.toLowerCase().replace('_','-');
                                    for (var key in labelsMap.data.dataMap) {
                                        if(key != 'language'){
                                            $rootScope.vlocity.customLabels[key] = $rootScope.vlocity.customLabels[key] || {};
                                            $rootScope.vlocity.customLabels[key][$rootScope.vlocity.userLanguage] = labelsMap.data.dataMap[key];
                                        }
                                    }
                                    sessionStorage.setItem('vlocity.customLabels', JSON.stringify($rootScope.vlocity.customLabels));
                                    deferred.resolve(labelsMap.data.dataMap);
                                }
                            },
                            function(error) {
                                $log.debug('getCustomLabels REMOTE error: ', error);
                            }
                        );    
                    
                } else if(forcetkClient){ //REST
                    nameSpaceService.getNameSpacePrefix().then(
                        function(nsPrefix) {

                            debugService.displayNameSpacePrefix('getCustomLabels', nsPrefix);

                            var apexRestUrlBase = '/v1/usercustomlabels?names=' + labelNames.join(',') + '&language=' + language;

                            var apexRestUrlNameSpacePrefix = (nsPrefix == '') ? '' : '/' + nsPrefix.replace('__','');

                            var apexRestUrl = apexRestUrlNameSpacePrefix + apexRestUrlBase;

                             forcetkClient.apexrest(apexRestUrl,
                                function(labelsMap) {
                                    //var labelsMap = JSON.parse(allLabels);
                                    $log.debug('getCustomLabels RESULTS: ', labelsMap);
                                    if(labelsMap.data.dataMap) {
                                        $rootScope.vlocity.userLanguage = labelsMap.data.dataMap.language.toLowerCase().replace('_','-');
                                        for (var key in labelsMap.data.dataMap) {
                                            if(key != 'language'){
                                                $rootScope.vlocity.customLabels[key] = $rootScope.vlocity.customLabels[key] || {};
                                                $rootScope.vlocity.customLabels[key][$rootScope.vlocity.userLanguage] = labelsMap.data.dataMap[key];    
                                            }
                                        }
                                    }
                                    if(labelsMap.messages.length > 0){
                                        $log.debug('getCustomLabels REST error: ', labelsMap.messages);
                                    } else {
                                        sessionStorage.setItem('vlocity.customLabels', JSON.stringify($rootScope.vlocity.customLabels));
                                    }
                                    deferred.resolve(labelsMap.data.dataMap);
                                },
                                function(error) {
                                    $log.error('getCustomLabels retrieval error: ' + error);
                                    deferred.reject(error);
                                },'GET'
                            );
                        }, function(error) {
                            $log.debug('getNameSpacePrefix retrieval error: ' + error);
                    });
                } else {
                    var myService = this;
                    nameSpaceService.getNameSpacePrefix().then(
                        function(nsPrefix) {
                            var apexRestUrlNameSpacePrefix = (nsPrefix == '') ? '' : '/' + nsPrefix.replace('__','');
                            var apexRestUrlBase = apexRestUrlNameSpacePrefix+'/v1/usercustomlabels?names=' + labelNames.join(',') + '&language=' + language;
                            myService.getApexRest(apexRestUrlBase,'GET',null,null).then(
                                function(labelsMap) {
                                    //var labelsMap = JSON.parse(allLabels);
                                    $log.debug('getCustomLabels FORCENG RESULTS: ', labelsMap);
                                    var labelsDataMap = labelsMap.data.dataMap || labelsMap.data;
                                    if(labelsDataMap) {
                                        $rootScope.vlocity.userLanguage = labelsDataMap.language.toLowerCase().replace('_','-');
                                        for (var key in labelsDataMap) {
                                            if(key != 'language'){
                                                $rootScope.vlocity.customLabels[key] = $rootScope.vlocity.customLabels[key] || {};
                                                $rootScope.vlocity.customLabels[key][$rootScope.vlocity.userLanguage] = labelsDataMap[key];    
                                            }
                                        }
                                    }
                                    if(labelsDataMap.messages.length > 0){
                                        $log.debug('getCustomLabels FORCENG REST error: ', labelsDataMap.messages);
                                    } else {
                                        sessionStorage.setItem('vlocity.customLabels', JSON.stringify($rootScope.vlocity.customLabels));
                                    }
                                    deferred.resolve(labelsDataMap);
                                },
                                function(error) {
                                    $log.error('getCustomLabels FORCENG retrieval error: ' + error);
                                    deferred.reject(error);
                                });
                    }, function(error) {
                        $log.debug('getNameSpacePrefix retrieval error: ' + error);
                    });
                }
            } else {
                $log.debug('getCustomLabels: labels already in cache.');
                deferred.resolve($rootScope.vlocity.customLabels);
            }
            return deferred.promise;
        },  

        getConsoleCardsAction: function(objType, filterContextId, forcetkClient) {
            if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getConsoleCardsAction']) {

                return remoteActions.getConsoleCardsAction(objType, filterContextId).then(
                    function(consoleCardsActionJSON) {
                        var consoleCardsAction = JSON.parse(consoleCardsActionJSON);
                        $log.debug('getConsoleCardsAction: ', consoleCardsAction);
                        // var actions = [];
                        // actions.push(consoleCardsAction);
                        return consoleCardsAction;
                    },
                    function(error) {
                        $log.debug('getConsoleCardsAction retrieval error: ' + error);
                    });

            } else {

                return nameSpaceService.getNameSpacePrefix().then(
                    function(nsPrefix) {

                        debugService.displayNameSpacePrefix('getConsoleCardsAction', nsPrefix);

                        var apexRestUrlBase = '/v1/action?objType=' + objType + '&sFilterContextId=' + filterContextId + '&sDisplayOn=' + 'Web%20Client' + '&sLinkType=' + 'Other';

                        var apexRestUrlNameSpacePrefix = (nsPrefix == '') ? '' : '/' + nsPrefix.replace('__','');

                        var apexRestUrl = apexRestUrlNameSpacePrefix + apexRestUrlBase;

                        //$log.debug('getConsoleCardsAction(): apexRestUrl: ' + apexRestUrl);

                        return forcetkClient.apexrest(apexRestUrl,
                            function(actions) {

                                var consoleCardsAction;
                                for (var i = 0; i < actions.length; i++) {
                                    if (actions[i].name != null && actions[i].name == 'ConsoleCards') {
                                        consoleCardsAction = actions[i];
                                        break;
                                    }
                                }

                                //$log.debug('getConsoleCardsAction action: ', consoleCardsAction);
                                return consoleCardsAction;

                            },
                            function(error) {
                                $log.error('getConsoleCardsAction retrieval error: ' + error);
                            },'GET'
                        );

                    }, function(error) {
                        $log.debug('getNameSpacePrefix retrieval error: ' + error);
                    });

            }

        },

        getApexRest: function(endpoint, method, payload, forcetkClient) {
            console.log('getApexRest ',endpoint);
            return nameSpaceService.getNameSpacePrefix().then(
                function(nsPrefix) {

                    debugService.displayNameSpacePrefix('getApexRest', nsPrefix);

                    var apexRestUrlBase = endpoint;

                    var apexRestUrl = apexRestUrlBase;

                    // for desktop use forceTk
                    if (typeof Visualforce !== 'undefined') {

                        return forcetkClient.apexrest(apexRestUrl,
                            function(result) {
                                //$log.debug('getConsoleCardsAction action: ', actions[0]);
                                return result;

                            },
                            function(error) {
                                console.info('getApexRest error: ',error);
                            },
                            method,
                            payload
                        );

                    // for Mobile Hybrid Ionic use forceng
                    } else {
                        if (apexRestUrlBase.charAt(0) !== '/') {
                            apexRestUrlBase = '/' + apexRestUrlBase;
                        }

                        if (apexRestUrlBase.substr(0, 18) !== '/services/apexrest') {
                            apexRestUrlBase = '/services/apexrest' +apexRestUrlBase;
                        }
                        console.log('force request ',apexRestUrlBase, method, payload);
                        // need to use force.request() rather than force.apexrest() because the latter does not support POST
                        return force.request(
                                {path: apexRestUrlBase,
                                 method: method,
                                 data: payload
                                }).then(

                            function (result){
                                return result;
                            },

                            function (error){
                                console.error('getApexRest retrieval error: ', error);
                            });

                    }

                }, function(error) {
                    $log.debug('getNameSpacePrefix retrieval error: ' + error);
                });
        }

    };

})

.factory('relationshipMgmtService', function(force, nameSpaceService, debugService, $log) {
    $log = $log.getInstance('CardFramework: relationshipMgmtService');
    return {

        getStoriesTk: function(objectId, forcetkClient, numberOfDays, storyType) {
            //$log.debug('calling relationshipMgmtService: getStories()');

            return nameSpaceService.getNameSpacePrefix().then(
                function(nsPrefix) {

                    debugService.displayNameSpacePrefix('getStoriesTk', nsPrefix);

                    var apexRestUrlNameSpacePrefix = (nsPrefix == '') ? '' : '/' + nsPrefix.replace('__','');
                    var apexRestUrl = apexRestUrlNameSpacePrefix + '/v1/story/' + objectId;
                    var extraRequestParameters = '';
                    var days = parseInt(numberOfDays);
                    var isNumber = isNaN(days);
                    if (numberOfDays !== null && !isNaN(parseInt(numberOfDays))) {
                        extraRequestParameters = '?days=' + numberOfDays;
                    }
                    if (storyType !== null) {
                        if (extraRequestParameters) {
                            extraRequestParameters += '&storyType=' + storyType;
                        } else {
                            extraRequestParameters += '?storyType=' + storyType;
                        }
                    }
                    apexRestUrl += extraRequestParameters;
                    //
                    return forcetkClient.apexrest(apexRestUrl,
                        function(result) {
                            //$log.debug('getStoriesTk stories: ', result);
                            //return result['Stories'];
                            return result;
                        },
                        function(error) {
                            console.info('getStoriesTk retrieval error: ' + error);
                        },'GET'
                    );

                }, function(error) {
                    $log.debug('getNameSpacePrefix retrieval error: ' + error);
                });

        },

        getAttributesTk: function(objectId, forcetkClient) {
            //$log.debug('calling relationshipMgmtService: getAttributesTk()');

            return nameSpaceService.getNameSpacePrefix().then(
                function(nsPrefix) {

                    debugService.displayNameSpacePrefix('getAttributesTk', nsPrefix);

                    var apexRestUrlNameSpacePrefix = (nsPrefix === '') ? '' : '/' + nsPrefix.replace('__','');

                    return forcetkClient.apexrest(apexRestUrlNameSpacePrefix + '/v1/segment/assignments/' + objectId,
                        function(result) {
                            //$log.debug('getAttributesTk stories: ', result);
                            //return result['Stories'];
                            return result;
                        },
                        function(error) {
                            console.info('getAttributesTk retrieval error: ' + error);
                        },'GET'
                    );

                }, function(error) {
                    $log.debug('getNameSpacePrefix retrieval error: ' + error);
                });

        }
    };

})

.factory('dataSourceService', function(dataService, $interpolate, $localizable, $q, $http, $log, $timeout, $rootScope, userProfileService) {

    function handleQuery(datasource, scope, deferred, errorContainer) {

        if($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'Disable_Datasource_Query__c']) {
            deferred.reject('SOQL Query not enabled');
        }

        query = datasource.value.query;
        query = $interpolate(query)(scope);
        dataService.getRecords(query).then(
            function(records) {
                $log.debug('datasourceService ',records);
                if (records && records.type === 'exception') {
                    //sfdc returned with a query error
                    errorContainer.sourceType = datasource.type;
                    errorContainer.data = records;
                    errorContainer.message = records.message; //when there is an error it shows on the records
                    deferred.reject(errorContainer);
                }
                //otherwise its all good.
                deferred.resolve(records);
            },
            function(err) {
                deferred.reject(err);
            }
        );

    }

    function handleDataRaptor(datasource, scope, deferred, errorContainer, forcetkClient) {
        var errorMsg;

        if($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'Disable_Datasource_DataRaptor__c']) {
            errorMsg = 'DataRaptor not enabled';
            errorContainer.sourceType = datasource.type;
            errorContainer.data = errorMsg;
            errorContainer.message = errorMsg;
            deferred.reject(errorContainer);
        }

        var cardBundle = datasource.value.bundle;
        var cardCtxId = $interpolate('{{' + datasource.value.ctxId + '}}')(scope);
        dataService.getDataRaptorBundle(cardBundle,cardCtxId, forcetkClient).then(
            function(records) {
                $log.debug(records);
                var hasError = true;
                var errorMsg;

                if (records && records.type === 'exception') {
                    //sfdc returned with a query error
                    errorContainer.sourceType = datasource.type;
                    errorContainer.data = records;
                    errorContainer.message = records.message; //when there is an error it shows on the records
                    deferred.reject(errorContainer);
                    return;
                }
                
                for (var prop in records) {
                    if (records.hasOwnProperty(prop)) {
                        hasError = false;
                        break;
                    }
                }

                //empty arrays are valid - just no records were returned
                if(records && Array.isArray(records) && records.length === 0) {
                    hasError = false;
                }

                if (hasError) {
                    $localizable('CardDesignerDataSourceDataRaptorError', 'Something is wrong with either the interface name or the context id is invalid').then(function(label){
                        errorMsg = label;
                        errorContainer.sourceType = datasource.type;
                        errorContainer.data = records;
                        errorContainer.message = errorMsg;
                        deferred.reject(errorContainer);
                    });
                } else {
                    deferred.resolve(records);
                }

            }, function(err) {
                errorContainer.sourceType = datasource.type;
                errorContainer.data = err;
                errorContainer.message = 'DataRaptor Error';
                deferred.reject(errorContainer);
            }
        );

    }

    function handleApexRemote(datasource, scope, deferred, errorContainer) {

        if($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'Disable_Datasource_ApexRemote__c']) {
            deferred.reject('ApexRemote not enabled');
            return;
        }

        var className = datasource.value.remoteNSPrefix ? datasource.value.remoteNSPrefix + '.' + datasource.value.remoteClass : datasource.value.remoteClass;
        var methodName = datasource.value.remoteMethod;
        var inputMap = datasource.value.inputMap ? $interpolate(JSON.stringify(datasource.value.inputMap))(scope) : null;

        //must initialize
        datasource.value.optionsMap = datasource.value.optionsMap || {};
        //supporting Continuation Object - set vlcClass key if not set
        datasource.value.optionsMap['vlcClass']  = datasource.value.optionsMap['vlcClass'] || className;
        //then we interpolate
        var optionsMap = datasource.value.optionsMap ? $interpolate(JSON.stringify(datasource.value.optionsMap))(scope) : null;
        //can't execute Apex Remote without class or method names
        if (!className || !methodName) {
            errorContainer.sourceType = datasource.type;
            errorContainer.data = null;
            errorContainer.message = 'Cannot execute Apex Remote without Class or Method names';
            deferred.reject(errorContainer);
            return deferred.promise;
        }
        // we need to create the $scope.apexClass object from server values.
        // This is because the RemoteClass input field is bound to $scope.apexClass via ng-model
        // Otherwise, no remote class will show up even if a legit open interface class is stored on server
        var apexClassInfo = className.split('.');
        var apexClass = {
            NamespacePrefix: apexClassInfo.length > 1 ? apexClassInfo[0] : null,
            Name: apexClassInfo.length > 1 ? apexClassInfo[1] : apexClassInfo[0]

        };

        if (apexClass.Name && methodName) {

            var classError = null;
            var methodError = null;

            dataService.doGenericInvoke(className, methodName, inputMap, optionsMap).then(
            function(records) {
                $log.debug(records);
                var hasError = false;
                var errorMsg, errorCode;
                if (!records.status & records.type === 'exception') {

                    errorContainer.sourceType = datasource.type;
                    errorContainer.data = records;
                    errorContainer.message = records.message;
                    deferred.reject(errorContainer);
                }
                if (records['error'] && records['error'] != 'OK') {
                    errorCode = records['errorCode'];
                    errorMsg = records['error'];
                    hasError = true;
                    if (errorCode) {
                        if (errorCode == 'INVOKECLASS-404') {
                            errorMsg = $localizable('CardDesignerDataSourceApexRemoteClassNotFoundError', 'Class not found');
                        } else if (errorCode == 'INVOKEMETHOD-405') {
                            errorMsg = $localizable('CardDesignerDataSourceApexRemoteMethodNotFoundError', 'Method not found');
                        } else if (errorCode == 'INVOKE_500') {
                            errorMsg = records['error'];
                        }
                    }
                    errorContainer.sourceType = datasource.type;
                    errorContainer.data = records;
                    errorContainer.message = errorMsg;
                    deferred.reject(errorContainer);
                }
                // if (!hasError && datasource.value.apexRemoteResultVar) {
                //     records = _.get(records,datasource.value.apexRemoteResultVar);
                //     if (!records) {
                //         errorMsg = $localizable('CardDesignerDataSourceApexRemoteMethodOrResultJasonPathInvalidError', 'Please make sure your method name exists and your result json path matches that in the result set');
                //         hasError = true;
                //         errorContainer.sourceType = datasource.type;
                //         errorContainer.data = records;
                //         errorContainer.message = errorMsg;
                //         deferred.reject(errorContainer);
                //     }
                // }
                deferred.resolve(records);
                return records;
            }, function(error) {
                    $log.debug('doGenericInvoke error: ', error);
                    deferred.reject(error);
            });
        }

    }

    function handleApexRest(datasource, scope, deferred, errorContainer, forcetkClient) {

        var endpoint =  $interpolate(datasource.value.endpoint)(scope);
        var method = datasource.value.methodType;
        var payload;
        if (scope) {
            // scope will exist if function called from Card Designer
            payload = datasource.value.body && datasource.value.methodType != 'GET' ? $interpolate(datasource.value.body)(scope) : null;
        } else {
            // scope does not exist if function called directly from runtime HybridCPQ.js invokeAction()
            payload = datasource.value.body && datasource.value.methodType != 'GET' ? datasource.value.body : null;
        }
        console.info(endpoint);
        dataService.getApexRest(endpoint,method,payload, forcetkClient).then(
        function(records) {
            $log.debug(records);
            if (records && records.type === 'exception') {
                //sfdc returned with a rest error
                errorContainer.sourceType = datasource.type;
                errorContainer.data = records;
                errorContainer.message = records.message;
                deferred.reject(errorContainer);
                return;
            }
            deferred.resolve(records);

        }, function(error) {
            console.error(error);
            var errorMsg = '';
            try {
                errorMsg = JSON.parse(error.responseText);
                $log.debug(errorMsg[0]);
                errorMsg = errorMsg[0].message;
            }catch (e) {
                errorMsg = error.status + ' - ' + error.statusText;
            }

            errorContainer.sourceType = datasource.type;
            errorContainer.data = error;
            errorContainer.message = errorMsg;
            deferred.reject(errorContainer);
        });

    }

    function handleRest(datasource, scope, deferred, errorContainer) {

        if($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'Disable_Datasource_REST__c']) {
            deferred.reject('REST not enabled');
            return;
        }

        var payload = datasource.value.body && datasource.value.methodType != 'GET' ? JSON.parse($interpolate(datasource.value.body)(scope)) : null;
        //set to empty array to conform with named credential scenario
        var headers = datasource.value.header ? angular.copy(datasource.value.header) : [];
        var headerObj = {};
        angular.forEach(headers, function(header) {
            header.val = header.val ? $interpolate(header.val)(scope) : header.val;
            if (header.name && header.val) {
                headerObj[header.name] = header.val;
            }
        });
        var req = {
            'method': datasource.value.methodType,
            'url': datasource.value.endpoint ? $interpolate(datasource.value.endpoint)(scope) : '',
            'headers': headerObj,
            'data': payload
        };

        $log.debug(req);
        if (datasource.value.subType === 'NamedCredential') {
            var inputMap = {
                'namedCredential' : datasource.value.namedCredential,
                'headers': headers.length > 0 ? headerObj : null,
                'restMethod': datasource.value.methodType,
                'restPath': datasource.value.endpoint ? $interpolate(datasource.value.endpoint)(scope) : '',
                'data': payload
            };

            dataService.doNamedCredentialCallout(JSON.stringify(inputMap)).then(
            function(records) {
                $log.debug(records);
                deferred.resolve(records);

            }, function(error) {
                console.error(error);
                var errorMsg = '';
                try {
                    errorMsg = JSON.parse(error.responseText);
                    $log.debug(errorMsg[0]);
                    errorMsg = errorMsg[0].message;
                }catch (e) {
                    errorMsg = error.status + ' - ' + error.statusText;
                }

                errorContainer.sourceType = datasource.type;
                errorContainer.data = error;
                errorContainer.message = errorMsg;
                deferred.reject(errorContainer);
            });

        } else {
            $http(req).then(
            function(records) {
                $log.debug(records);
                deferred.resolve(records);
            },
            function(error) {
                console.info('rest error',error);
                if (error.status === 0) { //cross domain issue so its like a 404
                    error.status = 404;
                    error.statusText = $localizable('CardDesignerDataSourceRestResultCrossDomainError', 'No Access-Control-Allow-Origin header is present on the requested resource. The response had HTTP status code 404');
                }
                errorContainer.sourceType = datasource.type;
                errorContainer.data = error;
                errorContainer.message = error.statusText;
                deferred.reject(errorContainer);
            });
        }
    }

    function handleCustom(datasource, deferred) {
        
        try {
            var records = JSON.parse(datasource.value.body);
            $log.debug(records);
            //select root
            // records = datasource.value.resultVar ? _.get(records,datasource.value.resultVar) : records;
            if (!records) {
                errorContainer.sourceType = datasource.type;
                errorContainer.data = null;
                errorContainer.message = $localizable('CardDesignerValidJSON', 'Please enter valid JSON');;
                deferred.reject(errorContainer);
            } else {
                deferred.resolve(records);
            }

            //return records;
        }catch (e) {
            //Don't show modal errors for auto save. User is alerted with inline error for JSON field. Fix for CARD-407
            //If the sample json is invalid on page load, higlight the field with error
            $log.debug(e);
        }

    }

    function getDataHelper(datasource, scope, forcetkClient) {
        $log.debug('calling the datasourceService ',datasource);
        var deferred = $q.defer();
        var errorContainer = {};
        //haven't finished setting up datasource
        if (!datasource.value && datasource.type) {
            errorContainer.sourceType = datasource.type;
            errorContainer.data = null;
            errorContainer.message = 'You need to finish setting up the datasource';
            deferred.reject(errorContainer);
            return deferred.promise;
        }
        switch (datasource.type) {
            case 'Query':
                handleQuery(datasource, scope, deferred, errorContainer);
                break;
            case 'DataRaptor':
                handleDataRaptor(datasource, scope, deferred, errorContainer, forcetkClient);
                break;
            case 'ApexRemote':
                handleApexRemote(datasource, scope, deferred, errorContainer);
                break;
            case 'ApexRest':
                handleApexRest(datasource, scope, deferred, errorContainer, forcetkClient);
                break;
            case 'Dual':
                if (typeof Visualforce !== 'undefined') {
                    handleApexRemote(datasource, scope, deferred, errorContainer);
                } else {
                    handleApexRest(datasource, scope, deferred, errorContainer, forcetkClient);
                }
                break;
            case 'REST':
                handleRest(datasource, scope, deferred, errorContainer);
                break;
            case 'Custom':
                handleCustom(datasource, deferred);
                break;
            case 'Inherit':
                //special scenario where the data is coming as the flyout data
                deferred.resolve('inherit success');
                break;
            default:
                $log.debug('no data source');
                errorContainer.sourceType = datasource.type;
                errorContainer.data = null;
                errorContainer.message = 'bad data source';
                deferred.reject(errorContainer);
                break;
        }

        if (datasource.value && datasource.value.interval && datasource.value.interval >= 2000) {

            if (scope.intervalTimer) {
                $timeout.cancel(scope.intervalTimer);
            } else {
                try {
                    scope.$on('$destroy', function() {
                        $timeout.cancel(scope.intervalTimer);
                    });
                }
                catch(err) {
                    $log.error("scope on doesnot exists in designer");
                }
            }

            scope.intervalTimer = $timeout(function() {
                getDataHelper(datasource, scope, forcetkClient).then(function(value) {
                    $log.log(value);
                    if (datasource.value.resultVar) {
                        value = value[datasource.value.resultVar];
                    }
                    if (scope.records && !_.isEqual(scope.records, value)) {
                        if (scope.layoutId || scope.layoutName) {
                            $log.info("reload Layout");
                            scope.reloadLayout2();
                            return;
                        } else {
                            $log.info("reload Card.");
                            scope.reloadCard(false);
                            return;
                        }
                    }
                });
            }, datasource.value.interval);

        }


        if(datasource.value && datasource.value.timeout && datasource.value.timeout > 0) {
             $timeout(function(){
                //deferred.reject('timeout: '+datasource.value.timeout);
                var timeoutError = {
                    code: '504',
                    message: 'Response timed out at ' + datasource.value.timeout + ' ms'
                };

                deferred.reject(timeoutError);
             }, datasource.value.timeout);
        }
        return deferred.promise;
    }

    return {
    getData: function(datasource, scope, forcetkClient) {
        if(JSON.stringify(datasource).indexOf('$root.vlocity') > 0) {
            return userProfileService.userInfoPromise().then(
                function(){
                    return getDataHelper(datasource, scope, forcetkClient);
                }
            );
        }
        return getDataHelper(datasource, scope, forcetkClient);
    },

    selectResultNode: function(datasource, records, nodeVar) {
        if(!datasource || !datasource.value) {
            return records; //just passing records back
        }
        if(datasource.type === 'Dual') {
            if (typeof Visualforce !== 'undefined') {
                records = datasource.value.apexRemoteResultVar ? _.get(records,datasource.value.apexRemoteResultVar) : records;
            } else {
                records = datasource.value.apexRestResultVar ? _.get(records,datasource.value.apexRestResultVar) : records;
            }
        } else {
            if(nodeVar) {
                records = _.get(records,nodeVar);
            } else {
                records = (datasource.value && datasource.value.resultVar) ? _.get(records,datasource.value.resultVar) : records;
            }
        }

        return records;
    }
}
});

require('./modules/cardframework/factory/configService.js');
require('./modules/cardframework/factory/cardIconFactory.js');
require('./modules/cardframework/factory/actionLauncher.js');
require('./modules/cardframework/factory/performAction.js');
require('./modules/cardframework/factory/parseUri.js');

require('./modules/cardframework/directives/hotkeysLayoutNavigation.js');
require('./modules/cardframework/directives/flyout.js');
require('./modules/cardframework/directives/vlocInput.js');
require('./modules/cardframework/directives/vlocCard.js');
require('./modules/cardframework/directives/vlocCardIcon.js');
require('./modules/cardframework/directives/vlocCmp.js');
require('./modules/cardframework/directives/vlocLayout.js');
require('./modules/cardframework/templates/templates.js');

/* fix for scrolling Card's in Salesforce1 iframe */
var a = navigator.userAgent;
if ((a.indexOf('Salesforce') != -1) && (a.indexOf('iPhone') != -1 || a.indexOf('iPad') != -1) && (a.indexOf('Safari') == -1)) {
    var s = document.createElement('style');
    s.innerHTML = "html,html body{overflow:scroll;-webkit-overflow-scrolling:touch;zindex:0;}body{position:absolute;left:0;right:0;top:0;bottom:0;}";
    document.getElementsByTagName('head')[0].appendChild(s);
}

// setup iframe config
window.iFrameResizer = {
    messageCallback: function(message) {
        try {
            if (window.vlocityUniversalCardPage && window.vlocityUniversalCardPage.handleExternalEvent) {
                window.vlocityUniversalCardPage.handleExternalEvent(message);
            }
        } catch (e) {};
    }
};
},{"./VlocTemplates.js":2,"./modules/cardframework/directives/flyout.js":3,"./modules/cardframework/directives/hotkeysLayoutNavigation.js":4,"./modules/cardframework/directives/vlocCard.js":5,"./modules/cardframework/directives/vlocCardIcon.js":6,"./modules/cardframework/directives/vlocCmp.js":7,"./modules/cardframework/directives/vlocInput.js":8,"./modules/cardframework/directives/vlocLayout.js":9,"./modules/cardframework/factory/actionLauncher.js":10,"./modules/cardframework/factory/cardIconFactory.js":11,"./modules/cardframework/factory/configService.js":12,"./modules/cardframework/factory/parseUri.js":13,"./modules/cardframework/factory/performAction.js":14,"./modules/cardframework/templates/templates.js":15}],2:[function(require,module,exports){
'use strict';
var templates = {};

angular.module('vlocTemplates', ['vlocity'])
  .value('vlocTemplateInternalCache', {
      names: null,
      pending: {initialize:[]},
      resolved:{}
  })
  .config(['remoteActionsProvider', function(remoteActionsProvider) {
      remoteActionsProvider.setRemoteActions({
          getActiveTemplateNames: {
              action: fileNsPrefixDot() + 'CardCanvasController.getActiveTemplateNames'
          },
          getTemplate: {
              action: fileNsPrefixDot() + 'CardCanvasController.getTemplate'
          }
      });
  }]).config(['$compileProvider', function ($compileProvider) {
      $compileProvider.debugInfoEnabled(false);
  }]).run(function(remoteActions, vlocTemplateInternalCache, force) {
      //this only runs on the init of the module, in mobile we do not have the session token yet
      if(typeof Visualforce !== 'undefined') {
        remoteActions.getActiveTemplateNames().
          then(function(templatesNames) {
              vlocTemplateInternalCache.names = templatesNames;
              if (vlocTemplateInternalCache.pending.initialize) {
                  vlocTemplateInternalCache.pending.initialize.forEach(function(callback) {
                      callback();
                  });
              }
              delete vlocTemplateInternalCache.pending.initialize;
        });
      }
  }).config(['$provide', function($provide) {
    var escape = document.createElement('textarea');
    function unescapeHTML(html) {
        if (angular.isString(html)) {
            escape.innerHTML = html;
            return escape.value;
        } else {
            return html;
        }
    }

    function insertCSS(templateName, cssContent) {
        var head = document.getElementsByTagName('head')[0];
        var cssId = templateName + '.css';
        var existingStyle = document.getElementById(cssId);
        if (!existingStyle) { //style does not exist
            existingStyle = document.createElement('style');
            existingStyle.setAttribute('type', 'text/css');
            existingStyle.setAttribute('id', cssId);
            head.appendChild(existingStyle);
        } else {
            while (existingStyle.firstChild) {
                existingStyle.removeChild(existingStyle.firstChild);
            }
        }
        if (existingStyle.styleSheet) {
            existingStyle.styleSheet.cssText = cssContent;
        } else {
            existingStyle.appendChild(document.createTextNode(cssContent));
        }
    }

    function registerController(templateName, controllerJS) {

      var tryHeader = '(function() { try { \n';
      var catchBlock = '\n } catch(e) { console.log(\'error in '+templateName+'.js \',e); } })();\n//# sourceURL=vlocity/dynamictemplate/' + templateName + '.js\n';
      var head = document.getElementsByTagName('head')[0];
      var jsId = templateName + '.js';
      var existingScript = document.getElementById(jsId);
      if (!existingScript) { //style does not exist
          existingScript = document.createElement('script');
          existingScript.setAttribute('type', 'text/javascript');
          existingScript.setAttribute('id', jsId);
          head.appendChild(existingScript);
          existingScript.appendChild(document.createTextNode(tryHeader + controllerJS + catchBlock));
      }
    }

    $provide.decorator('$templateCache', ['$delegate', 'vlocTemplateInternalCache',
            function($delegate, vlocTemplateInternalCache) {
              var original = $delegate.get;
              $delegate.get = function(name) {
                  if (vlocTemplateInternalCache.resolved[name]) {
                      insertCSS(name, vlocTemplateInternalCache.resolved[name][fileNsPrefix() + 'CSS__c']);
                      if(vlocTemplateInternalCache.resolved[name][fileNsPrefix() + 'CustomJavascript__c']) {
                        registerController(name, vlocTemplateInternalCache.resolved[name][fileNsPrefix() + 'CustomJavascript__c']);
                      }
                      return vlocTemplateInternalCache.resolved[name][fileNsPrefix() + 'HTML__c'];
                  } else {
                      if (vlocTemplateInternalCache.names && vlocTemplateInternalCache.names.indexOf(name) > -1) {
                          try {
                              console.warn(name + ' was expected to be in cache but not found - has it been downloaded via $templateRequest yet? Will trigger request in backgroud');
                          } catch (e) {
                              //
                          }
                      }
                      return original.apply($delegate, Array.prototype.slice.call(arguments));
                  }
              };
              return $delegate;
          }]);
    $provide.decorator('$templateRequest',['$delegate', 'vlocTemplateInternalCache', 'remoteActions', '$q', 'force', 'pageService','$log',
            function($delegate, vlocTemplateInternalCache, remoteActions, $q, force, pageService, $log) {
              var original = $delegate;
              var useCache = (pageService.params.useCache)?(pageService.params.useCache === 'true'):true; // default is to use cache
              return function vlocTemplateRequest(name) {
                  var originalArgs = Array.prototype.slice.call(arguments),
                      me = this;
                  if (!vlocTemplateInternalCache.names) {
                      // need to wait to initialize our internal list
                      return $q(function(resolve) {
                          vlocTemplateInternalCache.pending.initialize.push(function() {
                              resolve(vlocTemplateRequest.apply(me, originalArgs));
                          });
                      });
                  }
                  //internal cache is already resolved from loading templates externally
                  if(vlocTemplateInternalCache.resolved[name]) {
                      return original.apply(me, originalArgs);
                  }
                  if (vlocTemplateInternalCache.names.indexOf(name) > -1 && !vlocTemplateInternalCache.resolved[name]) {
                      if (vlocTemplateInternalCache.pending[name]) {
                          return vlocTemplateInternalCache.pending[name];
                      }

                      // this internal cache would be cleared everytime user refresh browser, so we need to use cache
                      // in session storage to avoid retrieving of templates over and over again

                      var templateDefinitionStringFromCache = sessionStorage.getItem('template::' + name);
                      var templateDefinitionJsonFromCache;

                      if (useCache && templateDefinitionStringFromCache) {

                          templateDefinitionJsonFromCache = JSON.parse(templateDefinitionStringFromCache);
                          vlocTemplateInternalCache.resolved[name] = templateDefinitionJsonFromCache;
                          return original.apply(me, originalArgs);

                      } else {

                        if(typeof Visualforce !== 'undefined'){
                          var promise = remoteActions.getTemplate(name)
                            .then(function(template) {
                                delete vlocTemplateInternalCache.pending[name];
                                template[fileNsPrefix() + 'HTML__c'] = unescapeHTML(template[fileNsPrefix() + 'HTML__c']);
                                template[fileNsPrefix() + 'Sass__c'] = unescapeHTML(template[fileNsPrefix() + 'Sass__c']);
                                template[fileNsPrefix() + 'CSS__c'] = unescapeHTML(template[fileNsPrefix() + 'CSS__c']);
                                sessionStorage.setItem('template::' + name, JSON.stringify(template));
                                vlocTemplateInternalCache.resolved[name] = template;
                                return original.apply(me, originalArgs);
                          }, function(err){
                              $log.debug('error retrieving template ',name, err);
                          });
                        } else {
                              var query = 'SELECT Id,  Name, '+fileNsPrefix()+'HTML__c, '+fileNsPrefix()+'Type__c, '+fileNsPrefix()+'CSS__c, '+fileNsPrefix()+'CustomJavascript__c FROM '+fileNsPrefix()+'VlocityUITemplate__c WHERE Name = \''+name+'\' AND '+fileNsPrefix()+'Active__c = true';
                              var promise = force.query(query)
                              .then(function(data) {
                                var template = data.records[0];
                                delete vlocTemplateInternalCache.pending[name];
                                template[fileNsPrefix() + 'HTML__c'] = unescapeHTML(template[fileNsPrefix() + 'HTML__c']);
                                template[fileNsPrefix() + 'Sass__c'] = unescapeHTML(template[fileNsPrefix() + 'Sass__c']);
                                template[fileNsPrefix() + 'CSS__c'] = unescapeHTML(template[fileNsPrefix() + 'CSS__c']);
                                sessionStorage.setItem('template::' + name, JSON.stringify(template));//
                                vlocTemplateInternalCache.resolved[name] = template;
                                return original.apply(me, originalArgs);
                              }, function(err){
                                console.error(err);
                              });
                        }
                        vlocTemplateInternalCache.pending[name] = promise;
                        return promise;
                      }

                  } else {
                      return original.apply(me, originalArgs)
                        .then(function(responseText) {
                          if (/(<title>Visualforce Error ~ Salesforce - Developer Edition<\/title>|sendTitleToParent\('Visualforce Error'\))/.test(responseText)) {
                            throw new Error('Failed to load template: ' + name);
                          } else {
                            return responseText;
                          }
                        })
                  }
              };
          }]);
  }]).service('pageService', function() {
    this.params = function() {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var queryString = {};
        var query, vars;
        // for Desktop
        if (typeof Visualforce !== 'undefined') {
            query = window.location.search.substring(1);
        // for Mobile Hybrid Ionic
        } else {
            query = window.location.hash.split('?')[1];
        }

        if (query) {
            vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                // If first entry with this name
                if (typeof queryString[pair[0]] === 'undefined') {
                    queryString[pair[0]] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
                      // If second entry with this name
                } else if (typeof queryString[pair[0]] === 'string') {
                    var arr = [queryString[pair[0]],decodeURIComponent(pair[1].replace(/\+/g, ' '))];
                    queryString[pair[0]] = arr;
                      // If third or later entry with this name
                } else {
                    queryString[pair[0]].push(decodeURIComponent(pair[1].replace(/\+/g, ' ')));
                }
            }
        }

        return queryString;
    }();
  });

},{}],3:[function(require,module,exports){
angular.module('CardFramework')
  .directive('flyout', function() {
      'use strict';
      return {
          transclude: true,
          replace: true,
          template: '<section class="console-flyout active flyout"><div class="flyout-arrow" style="left:{{flyoutArrowLeftPos}}px"></div><div class="flyout-close" ng-click="hideFlyout()"><i class="icon icon-v-close"></i></div><div class="card-info"><ng-transclude></ng-transclude></div></section>'
      };
  }).directive('embeddedFlyout', function() {
      'use strict';
      return {
          transclude: true,
          replace: true,
          template: '<section class="console-flyout active flyout"><div class="card-info" ng-transclude></div></section>'
      };
  })
  .service('$vlocFlyout', function($rootScope, $sldsPopover, $compile, $log, $timeout) {
      var openSldsFlyouts = [];
      $rootScope.hideFlyout = hideFlyout;

      $rootScope.$on('vlocity.layouts.closeflyouts', function(event, data) {
          openSldsFlyouts.forEach(function(flyout) {
              flyout.hide();
          });
      });

      $rootScope.$on('$includeContentLoaded', function(event, data) {
          openSldsFlyouts.forEach(function(popover) {
            popover.show();
            $timeout(function() {
                popover.$applyPlacement();
            });
          });
      });


      function performFlyout($scope, layoutName, data, cardIndex, parentObj) {
          var isCardSelected = false;
          isCardSelected = $('.cards-container').find('[data-card=' + cardIndex + ']').hasClass('selected');
          //TBD: Need to be optimized
          //If the the selected card is clicked again, close the flyout

          if (isCardSelected) {
              hideFlyout();
              return false;
          }
          console.log('calling performFlyout in layout ' + layoutName);
          $scope.newLayoutName = layoutName;
          $scope.childData = data;
          $scope.parentObj = parentObj;
          console.log($scope.layout);
          openFlyout($scope, cardIndex, parentObj);
      };

      function openFlyout($scope, cardIndex, parentObj) {
        var cardsContainer = $('.cards-container'),
            selectedCard = cardsContainer.find('[data-card=' + cardIndex + ']:not(".flyout [data-card]")'),
            sectionCardsLength = cardsContainer.find('[data-card]:not(".flyout [data-card]")').length,
            currentElementPos, flyoutEl, index;

        hideFlyout(); //Close any open flyouts

        //support both old and new templates
        var cardIndexSplit = cardIndex.split('-');
        //unique layout name will be blank on older card-active templates
        var uniqueLayoutName = cardIndexSplit.length > 2 ? cardIndexSplit[0] + '-' : '';

        $rootScope.selected = cardIndexSplit.length > 2 ? cardIndexSplit[2]: cardIndexSplit[1];

        if (selectedCard.length === 0) {
            //If selected card is not available, return.
            return;
        }

        if (selectedCard.data('popover-flyout')) {
            $scope.$on('popover.hide.before', function(event, $sldsPopover) {
                var indexToRemove = openSldsFlyouts.indexOf($sldsPopover);
                if (indexToRemove > -1) {
                    openSldsFlyouts.splice(indexToRemove, 1);
                }
            });

            openSldsFlyouts.push($sldsPopover(selectedCard, {
                template: '<vloc-layout layout-type="flyout" layout-name="{{newLayoutName}}" records="childData" parent="parentObj" class="slds-m-around--small" style="max-width: calc(100% - 3rem);"></vloc-layout>',
                show: true,
                nubbinDirection: 'top',
                container: cardsContainer,
                trigger: 'manual',
                scope: $scope
            }));
        } else if (selectedCard.data('embed-flyout') && ':parent' !== selectedCard.data('embed-flyout')) {
            flyoutEl = $compile('<embedded-flyout><vloc-layout layout-type="flyout"  layout-name="{{newLayoutName}}" records="childData" parent="parentObj"></vloc-layout></embedded-flyout>')($scope);
            $(selectedCard.data('embed-flyout'), selectedCard).append(flyoutEl);
        } else {
            //Calculate currentElementPos after existing flyouts are closed
            currentElementPos = (selectedCard.length > 0) ? selectedCard.position().top : undefined,

            //Finding the mid position for selected card for arrow placement
            $scope.flyoutArrowLeftPos = parseInt((selectedCard.position().left + selectedCard.position().left + selectedCard.outerWidth()) / 2, 10);

            flyoutEl = $compile('<flyout><vloc-layout layout-type="flyout"  layout-name="{{newLayoutName}}" records="childData" parent="parentObj"></vloc-layout></flyout>')($scope);
            //changing to last index of split to account for newer templates and support older ones
            index = Number(cardIndexSplit[cardIndexSplit.length - 1]);
            while (index <= sectionCardsLength) {
                //Avoid selecting cards inside flyout
                var nextElem = cardsContainer.find('[data-card='+ uniqueLayoutName +'card-' + (index + 1) + ']:not(".flyout [data-card]")');
                var nextElemTopPos = nextElem.length > 0 ? nextElem.position().top : 'empty';

                //When the next elem top position is same as previous, it's considered same row
                if (nextElemTopPos - currentElementPos > 10 || nextElemTopPos === 'empty') {
                    var target = cardsContainer.find('[data-card=' + uniqueLayoutName +'card-' + index + ']:not(".flyout [data-card]")');
                    if (selectedCard.data('embed-flyout') == ':parent') {
                        $(flyoutEl).insertAfter($(target).parent());
                    } else {
                        $(flyoutEl).insertAfter(target);
                    }
                    positionFlyoutToViewport(selectedCard);
                    break;
                }else {
                    //Increment the index when nextElem is in same row
                    index = index + 1;
                }
            }
        }
    };

    /**
     * Positions the Flyout into the viewport
     * @param  {*} card - jquery element
     */
    function positionFlyoutToViewport(card) {
        var cardTop, flyoutTop, flyoutHeight, windowHeight, newScrollTop;
        var scrollSpeed = 100; //In milliseconds
        var marginForFlyout = 15; //15px padding between card and flyout
        var jqFlyout = $('.flyout');

        /**
         * Multiple use cases are handled to ensure the Flyout is best fitted within the viewport in the given
         * form factor. Usecases handled are listed below:
         *
         * 1. Flyout and Card can fit into window's height.
         *    -- Display's both.
         * 2. Flyout and Card can not fit into window but Flyout alone can fit.
         *    -- Displays full Flyout and the partial card in remaining area.
         * 3. Flyout can not fit into window.
         *    -- Display top of the Flyout
         */

        if (card && card.length > 0 && jqFlyout.length > 0) {
            try {
                cardTop = card.offset().top;
                flyoutTop = jqFlyout.offset().top;
                windowHeight = $window.innerHeight;
                flyoutHeight = jqFlyout.outerHeight();

                if ((flyoutHeight + card.outerHeight() + marginForFlyout) <= windowHeight) {
                    newScrollTop = cardTop - 5; //Adjustments for the outline and border
                } else if (flyoutHeight < windowHeight) {
                    newScrollTop = flyoutTop - (windowHeight - flyoutHeight);
                } else {
                    newScrollTop =  flyoutTop;
                }

                $('html, body').animate({scrollTop : newScrollTop}, scrollSpeed);

            } catch (e) {
                $log.log('Error occured while scrolling the flyout to viewport', e.message);
            }
        } else {
            $log.log('Failed to scroll the Flyout to viewport - Card/Flyout element not available');
        }
    };

    function hideFlyout(e) {
        $rootScope.selected = 'none';
        $rootScope.$broadcast('vlocity.layouts.closeflyouts');
        $('.cards-container .flyout').addClass('hide').remove();
    };

    return {
      performFlyout:  performFlyout,
      openFlyout:     openFlyout,
      hideFlyout:     hideFlyout
    };

  })
},{}],4:[function(require,module,exports){
/**
 * Directive: hotkeysLayoutNavigation
 *
 * Navigates across cards in layout
 *
 * Use it in only attribute form of directive eg: <div hotkeys-layout-navigation></div>
 *             ****Events****
 * Custom Events available for salesforce console keyboard shortcuts configuration.
 *   1. customShortcut.vlocity.cards.right    - Right traversing for cards
 *   2. customShortcut.vlocity.cards.left     - Left traversing for cards
 *   3. customShortcut.vlocity.cards.up       - Traverse upwards for cards and actions
 *   4. customShortcut.vlocity.cards.down     - Traverse downwards for cards and actions
 *   5. customShortcut.vlocity.cards.deselect - De highlight or deselect the card
 *
 */
angular.module('CardFramework')
    .directive('hotkeysLayoutNavigation',['hotkeys','$window', '$document', '$log', '$rootScope',
        function(hotkeys, $window, $document, $log, $rootScope) {
        'use strict';
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var customEventsArray = ['customShortcut.vlocity.cards.right',
                                         'customShortcut.vlocity.cards.left',
                                         'customShortcut.vlocity.cards.up',
                                         'customShortcut.vlocity.cards.down',
                                         'customShortcut.vlocity.cards.deselect'];

                /**
                 * Using 'element' attribute from link function has issue when we use ngInclude inside layout (eg: flyout)
                 * Layout inside a layout binds multiple hotkeys and 'element' get's overridden with new layouts DOM
                 * Keep an eye on nested layouts
                 */

                //TBD: Dehighlight implementation
                scope.$on('hotkeys.navigation.dehighlight', function(event) {
                    //deHighlight();
                });

                /**
                 * Get the direction type and order based on the various pre defined traverse directions
                 *
                 * @param  {type} type String. Accepted Values are right, left, up, down
                 * @return {*}  returns description Object if successful else an empty string.
                 */
                function getDirection(type) {
                    var directionObj = {
                        'right' : {
                            'directionType' : 'horizontal',
                            'order': 1
                        },
                        'left' : {
                            'directionType' : 'horizontal',
                            'order': -1
                        },
                        'up' : {
                            'directionType' : 'vertical',
                            'order': -1
                        },
                        'down' : {
                            'directionType' : 'vertical',
                            'order': 1
                        }
                    };

                    if (type) {
                        return directionObj[type.toLowerCase()];
                    } else {
                        return '';
                    }
                }

                /**
                 * Delegates based on the action type
                 * @param  {String} action actiontype for hotkeys
                 */
                function customEventAction(action) {
                    if (action && action.toLowerCase() === 'deselect') {
                        deSelect();
                    }else {
                        navigate(action);
                    }
                }

                /**
                 * Navigates through items either left,right,up or down. It stops when it reaches end and
                 * keeps the highlight to last element.
                 *
                 * @param  {direction} String [values are right, left, up, down]
                 */
                function navigate(direction) {
                    var jqCardElements,
                        prevSelectedItemIndex,
                        nextSelectionItemIndex,
                        directionType,
                        order,
                        iterativeIndex,
                        prevSelectedItem = element.find('[hotkey-layout-card].hotkey-highlight').not('.flyout');

                    directionType = getDirection(direction).directionType;
                    order = getDirection(direction).order;

                    //Bring the window to focus when custom hotkeys are used.
                    //Salesforce doesn't enable the focus to window
                    if (!document.hasFocus()) {
                        $window.focus();
                    }

                    if (prevSelectedItem.length === 0) {
                        if (directionType === 'horizontal') {
                            //If the item is not selected, Select the first item for horizontal navigation
                            element.find('[hotkey-layout-card]:eq(0)').addClass('hotkey-highlight');
                            scrollToViewport(element.find('[hotkey-layout-card]:eq(0)'));
                            //scrollTo.focus(element.find('[hotkey-layout-card]:eq(0)'))
                            return;
                        } else if (directionType === 'vertical') {
                            //If the item is not selected, don't trigger vertical navigation
                            return;
                        }
                    }

                    jqCardElements = element.find('[hotkey-layout-card]:not(".flyout [hotkey-layout-card]")');
                    prevSelectedItemIndex = jqCardElements.index(prevSelectedItem);

                    //If the card is selected navigate between actions for vertical direction keys
                    if (directionType === 'vertical' && jqCardElements.hasClass('selected')) {
                        navigateCardActions(order);
                        return;
                    }

                    iterativeIndex = (directionType === 'vertical') ? itemsPerRow() : 1;
                    nextSelectionItemIndex = prevSelectedItemIndex + (order * iterativeIndex);
                    if (jqCardElements.eq(nextSelectionItemIndex).length > 0) {
                        // Checking for nextSelectionItemIndex to be positive while reverse navigation.
                        // Negative value for jquery .eq selects backwards
                        if (order === -1 && nextSelectionItemIndex < 0) {
                            return;
                        }

                        prevSelectedItem.removeClass('hotkey-highlight');
                        jqCardElements.eq(nextSelectionItemIndex).addClass('hotkey-highlight');
                        scrollToViewport(jqCardElements.eq(nextSelectionItemIndex));
                        //scrollTo.focus(jqCardElements.eq(nextSelectionItemIndex))
                    }
                }

                /**
                 * Finds the number of items per row
                 *
                 * @return {integer} [Returns number of items per row]
                 */
                function itemsPerRow() {
                    var offset,
                        itemsPerRowCount = 0;

                    element.find('[hotkey-layout-card]').each(function() {
                        var $this = $(this);
                        //Comparing offset position as layouts are responsive and number of items per row is not fixed
                        if (!offset) {
                            offset = $this.offset().top;
                        }else if ($this.offset().top > offset + 10) {
                            //Comparing with offset+10 just to ensure few pixels offset at top in some cards won't cause any issues
                            return false;
                        }
                        itemsPerRowCount = itemsPerRowCount + 1;
                    });
                    return itemsPerRowCount;
                }

                /**
                 * Navigate across the hotkey-card-action elements inside the selected card
                 * and focus the element.
                 *
                 * @param  {Integer} order Accepted values are 1 and -1
                 */
                function navigateCardActions(order) {
                    var actionList,
                        focusedElementIndex,
                        flyoutActionList,
                        selectedCard = element.find('[hotkey-layout-card].selected').not('.flyout'),
                        focusElement = selectedCard.find('.focus[hotkey-card-action]');

                    //If selected action item not found in card, find in flyout.
                    if (focusElement.length === 0) {
                        focusElement = element.find('.flyout .focus[hotkey-card-action]');
                    }

                    if (focusElement.length === 0) {
                        //If no selected action item found in card/flyout, select first action item
                        selectedCard.find('[hotkey-card-action]:eq(0)').addClass('focus').focus();
                    }else {
                        //Navigate for actions in both card and it's flyout if exists
                        actionList = element.find('[hotkey-layout-card].selected [hotkey-card-action]');
                        flyoutActionList = element.find('.flyout [hotkey-card-action]');
                        actionList = actionList.add(flyoutActionList);

                        focusedElementIndex = actionList.index(focusElement);
                        focusElement.removeClass('focus').blur();

                        actionList.eq(focusedElementIndex + order).addClass('focus').focus();
                    }
                }

                /**
                 * Scrolls the element to view port if it's not visible
                 *
                 * @param  {*} element Pass the angular element or jquery element
                 */
                function scrollToViewport(element) {
                    //TBD: check for half screen(scrollY/2) to avoid edge case scrolling
                    if (element.offset() && (element.offset().top + 100 < ($window.scrollY + $window.innerHeight))) {
                        $('html, body').animate({scrollTop: element.offset().top - 100}, 'fast');
                        $log.info('Selected card is not visible in view port, scrolling to to make it visible');
                    }
                }

                /**
                 * De highlight all the cards
                 */
                function deHighlight() {
                    //De-select the highlighted card
                    element.find('[hotkey-layout-card].hotkey-highlight').removeClass('hotkey-highlight').blur();
                }

                /**
                 * De select the selected card. Also triggers an event for closing the flyout
                 */
                function deSelect() {
                    var selectedItem = element.find('[hotkey-layout-card].hotkey-highlight');
                    var isFlyoutOpen = element.find('.cards-container .flyout').length > 0 ? true : false;
                    var selectedCard = element.find('[hotkey-layout-card].selected');

                    //If flyout is open, close it and return. Or if a card with out flyout is selected deselect.
                    if (isFlyoutOpen || selectedCard.length > 0) {
                        $rootScope.$broadcast('hotkeys.navigation.deselectCard');
                        selectedCard.find(':focus').removeClass('focus').blur();
                        return;
                    }

                    //De-highight the card
                    selectedItem.removeClass('hotkey-highlight');
                    $log.info('De-select active card, Esc key pressed');
                }

                /**
                 * Selects a card. Also publishes an event
                 */
                function selectCard() {
                    var highlightedIndex,
                        selectedCard = element.find('[hotkey-layout-card].selected');

                    if (element.find('[hotkey-layout-card].hotkey-highlight').not('.selected').length > 0) {
                        highlightedIndex = element.find('[hotkey-layout-card]:not(".flyout [hotkey-layout-card]")').index(element.find('[hotkey-layout-card].hotkey-highlight'));
                        $rootScope.$broadcast('hotkeys.navigation.selectcard', highlightedIndex);
                    }

                    //If selected card and highlighted card are different. Remove any focus elements
                    if (element.find('[hotkey-layout-card].hotkey-highlight.selected').length === 0 && selectedCard.length > 0) {
                        selectedCard.find(':focus').removeClass('focus').blur();
                    }
                }

                //Bind hotkeys to scope. When the scope is destroyed, hotkeys unbind
                hotkeys.bindTo(scope)
                    .add({
                        combo: ['right', 'alt+right'],
                        description: 'Card selection traverses from left to right. Alternately use "ALT + RIGHT"',
                        callback: function(event, hotkey) {
                            event.preventDefault();
                            event.stopPropagation();
                            navigate('right');
                        }
                    })
                    .add({
                        combo: ['left', 'alt+left'],
                        description: 'Card selection traverses from right to left. Alternately use "ALT + LEFT"',
                        callback: function() {
                            event.preventDefault();
                            event.stopPropagation();
                            navigate('left');
                        }
                    })
                    .add({
                        combo: 'up',
                        description: 'Card selection traverses upwards',
                        callback: function(event, hotkey) {
                            event.preventDefault();
                            event.stopPropagation();
                            navigate('up');
                        }
                    })
                    .add({
                        combo: 'down',
                        description: 'Card selection traverses downwards',
                        callback: function(event, hotkey) {
                            event.preventDefault();
                            event.stopPropagation();
                            navigate('down');
                        }
                    })
                    .add({
                        combo: 'enter',
                        description: 'Opens flyout for active card',
                        callback: function() {
                            //Don't use prevent default or stopPropagation. Focus element action needs to be launched
                            selectCard();
                        }
                    })
                    .add({
                        combo: 'esc',
                        description: 'Deselect the card',
                        callback: function() {
                            event.preventDefault();
                            event.stopPropagation();
                            deSelect();
                        }
                    });

                //Salesforce console custom event handling starts

                /**
                 * Custom Events exposed outside to salesforce console keyboard shortcuts configuration
                 * This is enabled to users to configure custom keys when they have conflicts with default keys
                 * All the events are prefixed with customShortcut as it's enforced by salesforce.
                 *
                 * 1. customShortcut.vlocity.cards.right
                 * 2. customShortcut.vlocity.cards.left
                 * 3. customShortcut.vlocity.cards.up
                 * 4. customShortcut.vlocity.cards.down
                 */

                try {
                    if (typeof sforce !== 'undefined' && sforce && sforce.console && sforce.console.isInConsole()) {

                        /**
                         * Salesforce's sforce.console.addEventlistener won't accept any custom paramters except
                         * the salesforce predefined tabId and it restricts the implementation to handle the multiple
                         * event listeners dynamically.
                         * Also, removeEventListener in JS won't work on anonymous functions.
                         * So, implemented the closure patterns to overcome the limitations as listed.
                         *
                         * Note:
                         * 1. It's very important to remove the listeners, else it will lead to too many duplicate
                         *    listeners and keep's listening  to events even after scope is destroyed. Leads to
                         *    unexpected results.
                         * 2. Also, In addition to this limitation/complexity, we need to consider multiple Tabs in
                         *    salesforce console and not to mixup the events across the tabs.
                         */
                        sforce.console.getFocusedSubtabId(function(subtab) {
                            // get the enclosing subtab id at the inital load and cache it
                            var subtabId = subtab && subtab.id;

                            customEventsArray.forEach(function(element, index) {

                                (function(subtabId) {
                                    var actionTypeCache,
                                        actionType = element.split('.');
                                    actionTypeCache = actionType[actionType.length - 1];

                                    function customNavigate(result) {
                                        sforce.console.getFocusedSubtabId(function(focusedSubtab) {
                                            // Check if the enclosing subtab(where your code is loaded) is same as focused tab
                                            // as events are emitted irrespective of tabs

                                            if (subtabId === focusedSubtab.id) {
                                                if (actionTypeCache) {
                                                    customEventAction(actionTypeCache);
                                                }
                                            }
                                        });
                                    }

                                    sforce.console.addEventListener(element, customNavigate);

                                    scope.$on('$destroy', function() {
                                        //Remove salesforce console custom event listeners
                                        sforce.console.removeEventListener(element, customNavigate);
                                    });

                                })(subtabId);

                            });
                        });
                    }
                }catch (e) {
                    $log.error('Error occured in salesforce custom keyboard events in cards', e.message);
                }
            }
            //End of Salesforce console custom event handling
        };
    }]);
},{}],5:[function(require,module,exports){
angular.module('CardFramework')
    .directive('vlocCard', function($compile) {
    'use strict';
    return {
        restrict: 'EA',
        require: '?ngModel',
        replace: true,
        scope: {
            customtemplate: '@',
            ctrl: '@',
            name: '@?',
            data: '=?',
            obj: '=?',
            loaded: '=?',
            useExistingElementType: '@?',
            records: '=?',
            sessionId: '@',
            cardIndex: '@index'
        },
        compile: function(element, attributes) {
             return {
                 post: function(scope, element, attributes, controller, transcludeFn) {
                     scope.init();
                 }
             };
         },
        controller: ['$scope', '$rootScope','$element','$q','$controller','$attrs','timeStampInSeconds','actionService', 'dataService', '$interpolate','pageService','networkService','configService','performAction','$filter','$http', 'dataSourceService', '$vlocFlyout', '$log','interactionTracking',
         function($scope, $rootScope, $element, $q, $controller, $attrs, timeStampInSeconds, actionService, dataService,
              $interpolate, pageService, networkService, configService, performAction, $filter, $http, dataSourceService, $vlocFlyout, $log, interactionTracking) {
            $log = $log.getInstance('CardFramework: vloc-card');

             $scope.sObjects = null;
             $scope.finishedLoading = false;
             $scope.nsPrefix = $rootScope.nsPrefix;
             $scope.session = {}; //need to store session variables
             $scope.placeholder = {}; //need to store session variables
             $scope.params = pageService.params;
             $scope.attrs = $attrs;
             //need to be able to pass the unique layout id to cards that will be cloned from this one
             $scope.uniqueLayoutId = ($scope.data && $scope.data.uniqueLayoutId) || Date.now();
             $scope.data.uniqueLayoutId = $scope.uniqueLayoutId;
             $scope.loggedUser = $rootScope.loggedUser ? $rootScope.loggedUser : null;
             $scope.inactiveError = {
                 'header': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveErrorHeader', 'Error'),
                 'errorMsg': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveErrorMsg', 'There is no active instance of'),
                 'associationNameLabel': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveAssociationNameLabel', 'associated with'),
                 'associationTypeLabel': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveAssociationTypeLabel', 'of type'),
                 'associationType': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveAssociationTypeCard', 'card'),
                 'contactAdminMsg': $rootScope.vlocity.getCustomLabelSync('CardFrameworkContactAdminMsg', 'Please contact your Salesforce Admin')
             };

            var innerElement = [];
            var childScope = [];
            var unbindEvents = [];

             function cleanUpElement() {
                if(!$scope.isRedraw) {
                    return;
                }
                childScope.forEach(function(scope) {
                    scope.$destroy();
                });
                innerElement.forEach(function(element) {
                    element.remove();
                });
                childScope = [];
                innerElement = [];
                $element.html('');
             }

             $log.debug('------------------------------------------------------card loaded: ',$scope.name,$scope.data);

             //TBD: Avoid binding event Listener if possible for cards.
            unbindEvents[unbindEvents.length] =
             $scope.$on('hotkeys.navigation.selectcard', function(event, highlightIndex) {
                if (Number($scope.cardIndex) === highlightIndex) {
                    $log.debug('hot key Enter');
                    $scope.performFlyout('card-' + highlightIndex);
                }
            });

            $scope.deleteObj = function() {
                $log.debug('deleting card');
                delete $scope.obj;
                delete $scope.data.obj;
                delete $scope.pickedState; //remove the previously selected state
                $scope.data.status = 'non-existent';
                $log.debug('element to be deleted ',$element);
                cleanUpElement();
                pickState();
            };

            $scope.toggleEditMode = function(){
                $log.debug('toggling editmode '+$scope.data.editMode);
                $scope.editWatch = $scope.editWatch || function(){ $log.debug('watch not set up'); };
                $scope.data.status = $scope.data.editMode ? 'edit-mode' : 'active';

                if($scope.data.status === 'edit-mode') {
                    $scope.editWatch();
                } else {
                    $scope.editWatch = $scope.$watch('obj', function(newVal, oldVal){
                        var sameObj = angular.equals(oldVal, newVal);
                        if(!sameObj && newVal) {
                            $log.debug('changed from ',oldVal, newVal);
                            $scope.data.validationError = [];
                            $scope.data.validationSuccess = null;
                            $scope.evaluateSessionVars();
                            if($scope.pickedState.editCustomCallback) {
                                $log.debug($scope.pickedState.editCustomCallback);
                                try {
                                    eval($scope.pickedState.editCustomCallback+'($scope.obj)');
                                } catch(e) {
                                    $scope.data.validationError = [];
                                    $scope.data.validationError.push({message: 'error using custom callback for editing: '+e});
                                    $log.debug('error using custom callback for editing: ',e);
                                }

                            } else if($scope.obj.attributes && $scope.obj.attributes.type) {
                                configService.saveObject($scope.obj, $scope.obj.attributes.type).then(
                                    function(result){
                                        $log.debug(result);
                                        $scope.data.validationSuccess = 'Successfully Saved Record!';
                                        if(result) {
                                         $scope.obj = result;
                                        }
                                    },
                                    function(errors) {
                                        $log.debug(errors);
                                        $scope.data.validationError = [];
                                        angular.forEach(errors, function(err){
                                            $scope.data.validationError.push(err);
                                        });
                                        $log.debug('setting validation error ',$scope.data.validationError);
                                    }
                                );
                            }
                        }

                    }, true);
                }
                pickState();
            };

             $scope.init = function() {
                $log.debug('initializing card');

                if(pageService.params.previewMode)
                {
                    $scope.test = {};
                    _.set($scope.test,'$root.vlocity',{});
                    if ($scope.data.dataSource) {
                        angular.forEach($scope.data.dataSource.contextVariables, function(ctxVar) {
                            if (ctxVar.name) {
                                // this is used for the Preview tab to get the accountId that a layout with a context variable "loggedUser.AccountId"
                                // would need to launch the layout by including the accountId in the iframe url
                                if (ctxVar.name === 'loggedUser.AccountId' && ctxVar.val) {
                                    $rootScope.loggedUserAccountId = ctxVar.val;
                                }

                                _.set($scope.test,ctxVar.name,ctxVar.val);
                            }
                        });
                    }
                    angular.extend($scope.$root.vlocity, $scope.test.$root.vlocity);
                }

                if ($scope.ctrl) {
                    $log.debug('injecting ' + $scope.ctrl);
                    var injectedScopeModel = $scope.$new();
                    //You need to supply a scope while instantiating.
                    //Provide the scope, you can also do $scope.$new(true) in order to create an isolated scope.
                    //In this case it is the child scope of this scope.
                    $controller($scope.ctrl,{$scope: injectedScopeModel});

                    $scope.importedScope = injectedScopeModel;
                    $log.debug('importedScope ',$scope.importedScope);
                }
                if (!$scope.data && $scope.name) {
                    $log.debug('lonely card');
                    loadCardDefinition().then(loadRecords).then(startCard);
                }else if ($scope.data.dataSource && (!$scope.obj && !$scope.data.obj)) {
                    $log.debug('card needs data');
                    loadRecords().then(startCard);
                } else {
                    $log.debug('load card template ',$scope.data);
                    startCard();
                }
            };

             /**
               * [loadCardDefinition description]
               * @return {[type]} [description]
               */
             var loadCardDefinition = function() {
                $log.debug('loadCardDefinition');
                return configService.getCardByName($scope.name).then(
                    function(card) {

                        if (!card) {
                            $log.error('configService.getCardByName: card undefined: ' + $scope.name);
                            return;
                        }

                        $log.debug('fetched card ',card);
                        $scope.data = card;
                        $scope.data.status = null;
                    }
                );
            };

             /**
              * [loadRecords description]
              * @return {[type]} [description]
              */
             var loadRecords = function() {
                $log.debug('loadRecords');
                $log.debug($scope.data.dataSource);
                var deferred = $q.defer();
                //must check if datasource exist and then it has a type
                //if no type then we take the data from the layout
                //TODO: find better way to handle this
                if ($scope.data.dataSource) {
                    if ($scope.data.dataSource.type) {
                        dataSourceService.getData($scope.data.dataSource, $scope, $rootScope.forcetkClient).then(
                            function(records) {
                                $log.debug('result from datasourceService ',records);
                                $scope.payload = records; //temporary variable holding all of the result from the datasource
                                $scope.records = dataSourceService.selectResultNode($scope.data.dataSource, records);
                                $scope.datasourceStatus = {status: 'loaded'};
                                deferred.resolve('Success');
                            },
                            function(err) {
                                $scope.datasourceStatus = {status: 'error', msg: err};
                                $log.debug('data error ',err);
                            }
                        );
                    } else {
                        if($scope.records) {
                            angular.forEach($scope.data.sessionVars, function(sessionVar){
                                try{
                                    $scope.session[sessionVar.name] = $interpolate('{{'+sessionVar.val+'}}')($scope);
                                } catch(e) {
                                    $log.debug('could not set ',sessionVar, e);
                                }
                            });
                            $scope.datasourceStatus = {status: 'none'};
                            //adding result node support for layout/parent datasources
                            $scope.records = dataSourceService.selectResultNode($scope.data.dataSource, $scope.records);
                            deferred.resolve('Success');
                        } else {
                            $log.debug('card dataSource not implemented');
                            $scope.datasourceStatus = {status: 'error', msg: 'card dataSource not implemented'};
                            deferred.reject('Failure');
                        }
                    }
                } else {
                    if ($scope.records) {
                        deferred.resolve('Success');
                    } else {
                        $log.debug('card dataSource not implemented');
                        $scope.datasourceStatus = {status: 'error', msg: 'card dataSource not implemented'};
                        deferred.reject('Failure');
                    }

                }
                return deferred.promise;
            };

            $scope.reloadCard = function(isRedraw) {
                $scope.isRedraw = isRedraw === undefined ? true : isRedraw;
                if(isRedraw) {
                    delete $scope.obj;
                    delete $scope.data.obj;
                    delete $scope.pickedState; //remove the previously selected state
                }
                cleanUpElement();
                $scope.payload = null;
                $scope.records = [];
                $scope.data.status = null;
                loadRecords().then(startCard);
            };

             /**
              * [startCard description]
              * @return {[type]} [description]
              */
             var startCard = function() {
                $log.debug('startCard',$scope.data);
                $scope.obj = $scope.obj ? $scope.obj : $scope.data.obj;
                if (!$scope.obj || ($scope.isRedraw !== undefined && !$scope.isRedraw)) {
                    $log.debug('calling pickRecords');
                    $scope.pickRecords($scope.records);
                } else {
                    //Handling the usecase for status where append/prepend of new card doesn't go through
                    //the cards loadrecords function which sets $scope.data.status to 'active' or 'non-existent'
                    //Append or prepend is always for active cards, so setting it to active when not defined.
                    //pickState function's state.filter evaluation needs active status
                    if (!$scope.data.status) {
                        $scope.data.status = 'active';
                    }
                    pickState();
                }
            };

             var pickState = function() {
                 //pick states here?
                 if ($scope.data.states) {
                     angular.forEach($scope.data.states,function(state) {
                         
                        angular.forEach(state.fields,function(field) {
                            if(field.data !== undefined){
                                angular.forEach(field.data,function(value,key) {
                                    field.data[key] = _.get($scope.obj, value) !== undefined ? _.get($scope.obj, value) : (value.charAt(0) === '[' ? '' : value);
                                });
                            }
                        });

                        if (typeof state.filter === 'string' && !$scope.pickedState) {
                            try {
                                if (eval(state.filter)) {
                                    $scope.pickedState = state;
                                    $scope.pickedState.sObjectType = $scope.pickedState.sObjectType ? $scope.pickedState.sObjectType : 'All';
                                    $scope.data.fields = state.fields;
                                    $scope.data.flyout = state.flyout;
                                    $scope.data.definedActions = state.definedActions;
                                    if ($scope.obj) {
                                        // _.get($scope.obj,state.actionCtxId) below extracts state.actionCtxId from $scope.obj even when the value
                                        // of state.actionCtxId is surrounded by bracket (to support spece in field name)
                                        $scope.data.actionCtxId = state.actionCtxId ? _.get($scope.obj,state.actionCtxId) : $scope.obj.Id;
                                    }
                                    else {
                                        $scope.data.actionCtxId = state.actionCtxId ? _.get($scope,state.actionCtxId) : $scope.params.id || $scope.params.Id;
                                    }
                                    $scope.templateUrl = state.templateUrl;
                                    $scope.getActions();
                                    evalPlaceholders();
                                    cleanUpElement();
                                    $scope.loadTemplate();

                                    return $scope.pickedState;
                                }
                            } catch (e) {
                                $log.error('Bad Eval', e);
                            }
                        } else if (configService.checkFilter($scope, $scope.obj, state.filter) && !$scope.pickedState) {
                            $scope.pickedState = state;
                            $scope.pickedState.sObjectType = $scope.pickedState.sObjectType ? $scope.pickedState.sObjectType : 'All';
                            $scope.data.fields = state.fields;
                            $scope.data.flyout = state.flyout;
                            $scope.data.definedActions = state.definedActions;
                            if ($scope.obj) {
                                // _.get($scope.obj,state.actionCtxId) below extracts state.actionCtxId from $scope.obj even when the value
                                // of state.actionCtxId is surrounded by bracket (to support spece in field name)
                                $scope.data.actionCtxId = state.actionCtxId ? _.get($scope.obj,state.actionCtxId) : $scope.obj.Id;
                            } else {
                                $scope.data.actionCtxId = state.actionCtxId ? _.get($scope,state.actionCtxId) : $scope.params.id || $scope.params.Id;
                            }
                            $scope.templateUrl = state.templateUrl;
                            $scope.getActions();
                            evalPlaceholders();
                            cleanUpElement();
                            $scope.loadTemplate();
                            return $scope.pickedState;
                        }
                    });

                    if(!$scope.pickedState){
                        $log.debug('didnt find a state ',$scope.pickedState);
                        $element.remove();
                        $scope.loadTemplate();
                    }
                } else {
                    $scope.loadTemplate();
                }
            };

            var evalPlaceholders = function(){
                angular.forEach($scope.pickedState.placeholders, function(placeholder){
                    try{
                        $scope.placeholder[placeholder.name] = $scope.placeholder[placeholder.name] || {};
                        var placeholderVal = placeholder.value.charAt(0) === '[' ? 'obj' + placeholder.value : placeholder.value;
                        var placeholderResult = $interpolate('{{'+placeholderVal+'}}')($scope);
                        $scope.placeholder[placeholder.name].value = placeholderResult || (placeholder.value.indexOf('[') > -1 || placeholder.value.indexOf('obj.') > -1 ? '' : placeholder.value);
                        $scope.placeholder[placeholder.name].type = placeholder.type;
                        $scope.placeholder[placeholder.name].label = placeholder.label;
                    } catch(e) {
                        $log.debug('placeholder could not set ',placeholder, e);
                    }
                });
            };

             /**
               * [pickRecords description]
               * @param  {[type]} records [description]
               * @return {[type]}         [description]
               */
             $scope.pickRecords = function(records) {
                $log.debug('records for card:',records);

                if (records && (!$scope.sObjects || $scope.sObjects.length === 0)) {
                    $scope.sObjects = [];
                    records = angular.isArray(records) ? records : [records]; //DR returns just the object if only one record is found
                    $log.debug('picking records from ' + records.length + ' choices');
                    angular.forEach(records,function(rec, i) {
                        //make sure records are objects and that they match the filter criteria
                        if (typeof rec === 'object' && configService.checkFilter($scope, rec, $scope.data.filter)) {
                            rec.$$vlocityCardIndex = i;
                            $scope.sObjects.push(rec);
                        }
                    });

                    $log.debug('sObjects after pickRecords',$scope.sObjects);
                    $scope.finishedLoading = true;
                    if ($scope.sObjects.length > 0) {
                        $scope.obj = $scope.sObjects[0];
                        $scope.data.cardIndex = $scope.obj.$$vlocityCardIndex;
                        delete $scope.obj.$$vlocityCardIndex; //we don't need this any longer
                        $scope.sObjects.splice(0,1); //pick off first record
                        if ($scope.data.status != 'active') {
                            $scope.data.status = 'active';//trying to not fire this watch again
                        }

                        //adding extra cards
                        if (!$scope.data.obj) {
                            angular.forEach($scope.sObjects,function(sObject, i) {
                                var cardData = angular.copy($scope.data);
                                cardData.obj = sObject;
                                cardData.cardIndex = sObject.$$vlocityCardIndex;
                                delete sObject.$$vlocityCardIndex; //we don't need this any longer
                                //use event to bubble up card to its parent layout
                                $log.debug('calling '+$scope.data.layoutName+'.addCard ---- '+cardData.cardIndex);
                                $scope.$emit($scope.data.layoutName+'.addCard', cardData);
                            });
                            $scope.sObjects = [];
                        }
                    } else {
                        $scope.data.status = 'non-existent';
                    }
                    //pick state
                    if ($scope.data.states) {
                        pickState();
                    } else {
                        $scope.getActions();
                        cleanUpElement();
                        $scope.loadTemplate();
                    }
                }
            };

            //Flyout card elements are destroyed(DOM removal). Trigger the scope destroy.
            //Removes all listeners
            $element.on('$destroy', function() {
                $scope.$destroy();
            });

            $scope.$on('$destroy', function () {
                unbindEvents.forEach(function (fn) {
                    fn();
                });
            });

            $scope.deleteCard = function() {
                $log.debug('deleting card');
                $scope.$destroy();
            };

             $scope.changeStatus = function(status) {
                //$log.debug($scope.data.status);
                if (status) {
                    $scope.data.status = status;
                } else {
                    $scope.data.status =  $scope.data.status === 'active' ? 'disabled' : 'active';
                }
            };

             $scope.getObjFieldValue = function(obj, objFieldName) {
                if (typeof obj != 'undefined' && obj != null) {
                    // if this is a customized field
                    if (objFieldName.indexOf('__c') > -1) {
                        var nsPrefixedObjFieldName = $rootScope.nsPrefix + objFieldName;
                        var nsPrefixedObjFieldValue = obj[nsPrefixedObjFieldName];
                        return nsPrefixedObjFieldValue;
                    } else {
                        var objFieldValue = obj[objFieldName];
                        return objFieldValue;
                    }
                } else {
                    return null;
                }
            };

             $scope.getChildrenDataForForeignKey = function(childrenForeignKey) {
                // initialize to empty array to make sure ng-repeat in template works even if parent has no child items
                $scope.childrenDataList = [];
                if (typeof $scope.obj != 'undefined' && $scope.obj != null) {
                    if (childrenForeignKey.indexOf('__r') > -1) {
                        var nsPrefixedChildrenForeignKey = $rootScope.nsPrefix + childrenForeignKey;
                        // make sure the obj has child items
                        if ($scope.obj[nsPrefixedChildrenForeignKey] != null) {
                            $scope.childrenDataList = $scope.obj[nsPrefixedChildrenForeignKey].records;
                        }
                    } else {
                        // make sure the obj has child items
                        if ($scope.obj[childrenForeignKey] != null) {
                            $scope.childrenDataList = $scope.obj[childrenForeignKey].records;
                        }
                    }
                }
            };

            $scope.trackField = function (field, entityName, entityLabel) {
                    var rawData = $scope.data.obj;
                    var fieldValue = $filter('getter')(rawData, field);
                    var trackingData = {};

                    trackingData.TrackingService = 'CardFramework';
                    trackingData.TrackingEvent = 'trackField';
                    trackingData.Timestamp = new Date().toISOString();
                    trackingData.EntityName = entityName || rawData.Name || '';
                    trackingData.EntityLabel = entityLabel || '';
                    trackingData.fieldValue = fieldValue;
                    trackingData.CustomerInteractionId = rawData.InteractionId;
                    //set card as tracked
                    $scope.data.checkedEntity = true;
                    //set field as tracked
                    field.tracked = true;

                    $scope.trackInteraction('trackField', trackingData);
            };

            $scope.trackInteraction = function(interactionType, eventData) {
                var interactionData = interactionTracking.getDefaultTrackingData($scope);
                $log.debug('trackInteraction - card interactionData ',interactionData, interactionType, eventData);
                switch (interactionType) {
                    case 'selectCard':
                            var eventData = {
                                'TrackingService' : 'CardFramework',
                                'TrackingEvent' : interactionType,
                                'CardInfo': $scope.data,
                                'CardObj':$scope.obj,
                                'FlyoutEnabled': $scope.data.flyout && $scope.data.flyout.layout,
                                'ContextId' : $scope.obj.Id || $scope.obj.id ? $scope.obj.Id || $scope.obj.id : $scope.name,
                            }
                            interactionData = angular.extend(interactionData, eventData);
                            break;
                    case 'performAction':
                            var eventData = {
                                'TrackingService' : 'CardFramework',
                                'TrackingEvent' : interactionType,
                                'CardInfo': $scope.data,
                                'ActionInfo': eventData,
                                'ContextId' : $scope.data.actionCtxId,
                            };
                            interactionData = angular.extend(interactionData, eventData);
                            break;
                    default:
                        interactionData = eventData;
                        break;
                }
                setTimeout( function() {
                        configService.isTrackingEnabled('CardFramework').then(function(enabled){
                                if(enabled){
                                        interactionTracking.addInteraction(interactionData);
                                }
                        }, function(err){
                            //error handling
                        });
                }, 0);
            }

             /**
              * [performAction description]
              * @param  {[type]} action Vlocity Action object
              */
             $scope.performAction = function(action, actionConfig) {
                $log.debug('perform action ',action);
                var checkForBracketField = /\[.*\]/;
                var extraParams = actionConfig && actionConfig.extraParams? actionConfig.extraParams : {};
                extraParams = _.assign(extraParams, action.extraParams);
                if(action.isCustomAction) {
                    if (action.type === 'OmniScript') {
                        var record = performAction.getSORecord($scope.data, $scope.obj);
                        var queryStringObj = {
                            id: record ? record.Id : null,
                            ContextId: record ? record.Id : null,
                            OmniScriptType: action.omniType, 
                            OmniScriptSubType: action.omniSubType,
                            OmniScriptLang: action.omniLang,
                            scriptMode: 'vertical',
                            layout: 'lightning'
                        };
                        var queryString = Object.keys(queryStringObj).reduce(function(queryString, key) {
                            var value = queryStringObj[key];
                            if (!extraParams[key]) {
                                return queryString + (queryString.length > 1 ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(value);
                            } else {
                                return queryString;
                            }
                        }, '');
                        action.url = '/apex/' + $rootScope.nsPrefix + 'OmniScriptUniversalPage?' + queryString;
                    }
                    action.url = $interpolate(action.url)($scope);
                }
                angular.forEach(extraParams, function(paramVal, paramKey){
                    if(checkForBracketField.test(paramVal)){
                        // check for undefined and return empty
                        extraParams[paramKey] = _.get($scope.obj,paramVal) || '';
                    } else {
                        extraParams[paramKey] = $interpolate('{{'+paramVal+'}}')($scope) === '' ? paramVal : $interpolate('{{'+paramVal+'}}')($scope);
                    }
                    
                });
                actionConfig = actionConfig || {};
                actionConfig.extraParams = extraParams;

                $scope.trackInteraction('performAction',{action: action, actionConfig: actionConfig});
                return performAction(action, actionConfig, $scope.obj, $scope.data, $scope.data.filter, $scope.pickedState);
             };

             /**
              * [performFlyout description]
              * @param  {[type]} sectionName [description]
              * @param  {[type]} cardIndex   [description]
              * @return {[type]}             [description]
              */
             $scope.performFlyout = function(cardIndex) {
                var childData = [], layoutName, parentObj;
                $log.debug($scope.data.flyout);
                $scope.trackInteraction('selectCard');
                if ($scope.data.flyout && $scope.data.flyout.layout) {
                    $log.debug($rootScope.layouts);
                    // CARD-535: Handle cases when Flyout Data Object field can't be evaluated
                    try {
                        childData = eval($scope.data.flyout.data);
                    } catch (e) {
                        $log.debug('Evaluating card Flyout Data Object failed. ', e.message);
                    }

                    layoutName = $scope.data.flyout.layout;
                    parentObj = $scope.data;

                    $vlocFlyout.performFlyout($scope, layoutName, childData, cardIndex, parentObj);

                } else {
                    $rootScope.selectCard(cardIndex);
                    $log.debug('flyout not enabled for this card');
                }
            };

             $scope.isSelected = function(cardIndex) {
                if (!cardIndex) {
                    return false;
                }
                return $rootScope.selected === cardIndex;
            };

            $scope.getActions = function() {
                if ($scope.data.actions && $scope.data.actions.length > 0) {
                    return;
                }

                actionService.getActionsInfoAsMap()
                    .then(function(orgActions) {
                        var evalActions = $scope.data.definedActions && $scope.data.definedActions.actions;
                        var actionList = evalActions ? evalActions : [];
                        var device = ((window.screen && window.screen.availWidth) || window.outerWidth) > 768 ? 'Web Client' : 'Mobile';

                        $scope.data.actions = [];
                        angular.forEach(actionList, function(defAction) {
                            var displayOnFlag;
                            if (defAction.type === 'Vlocity Action' && orgActions[defAction.id]) {
                                var clonedAction = angular.copy(orgActions[defAction.id]);

                                displayOnFlag = clonedAction[$rootScope.nsPrefix + 'DisplayOn__c'];

                                //Actions are displayed based on DisplayOn__c flag for device resolution
                                //Options: 'All', 'Mobile', 'Web client';'
                                var objType = 'All';
                                if ($scope.pickedState) {
                                    if ($scope.obj && (!$scope.pickedState.sObjectType || $scope.pickedState.sObjectType === 'All')) {
                                        objType = $scope.obj.attributes ? $scope.obj.attributes.type : 'All';
                                    } else {
                                        objType = $scope.pickedState.sObjectType;
                                    }
                                }

                                //this will match the applicable obj type to match the objType of the card or 'All'
                                var actionApplicableTypes = clonedAction[$rootScope.nsPrefix + 'ApplicableTypes__c'];
                                var objMatchesFlag = objType === 'All' || (actionApplicableTypes.indexOf(objType) > -1 || actionApplicableTypes.indexOf('All') > -1);

                                //support extra parameters for Vlocity Actions
                                if(defAction.hasExtraParams) {
                                    clonedAction.extraParams = defAction.extraParams;
                                }

                                if ((displayOnFlag === 'All' || displayOnFlag === device) && objMatchesFlag) {
                                    $scope.data.actions.push(clonedAction);
                                }

                            } else if (defAction.type === 'Custom' || defAction.type === 'OmniScript') { //custom action
                                $scope.data.actions.push(defAction);
                            } else {
                                $log.debug('action not setup properly ',defAction);
                            }
                        });
                    }, function(err){
                        $log.debug('no salesforce actions available ',err);
                        var evalCustomActions = $scope.data.definedActions && $scope.data.definedActions.actions;
                        var customActionList = evalCustomActions ? evalCustomActions : [];
                        angular.forEach(customActionList, function(defAction) {
                            if (defAction.type === 'Custom' || defAction.type === 'OmniScript') { //custom action
                                $scope.data.actions.push(defAction);
                            }
                        });
                    });
            };

            $scope.evaluateSessionVars = function() {
                angular.forEach($scope.data.sessionVars, function(sessionVar){
                    try{
                        $scope.session[sessionVar.name] = $interpolate('{{'+sessionVar.val+'}}')($scope);
                        $log.debug('session var ',$scope.session, sessionVar);
                    } catch(e) {
                        $log.debug('could not set ',sessionVar, e);
                    }
                });
                $log.debug('session variables',$scope.session);
                delete $scope.payload;
            };

            $scope.hideFlyout = function() {
                $vlocFlyout.hideFlyout();
            }

             /**
               * [loadTemplate description]
               * @return {[type]} [description]
               */
             $scope.loadTemplate = function() {
                var templateUrl;
                if ($scope.customtemplate) {
                    //Use custom template if vloc-card has customtemplate attribute
                    templateUrl = $scope.customtemplate;
                } else {
                    templateUrl = $scope.templateUrl;
                }

                $log.debug('loading card template: ' + $scope.data.title + '-' + templateUrl);
                $log.debug(templateUrl , $scope.data.status);

                $scope.evaluateSessionVars();
                configService.checkIfTemplateIsActive(templateUrl)
                    .then(function(ok) {
                        if ($attrs.useExistingElementType == null) {
                            var newScope = $scope.$new(false);
                            childScope.push(newScope);
                            var compiledDom = $compile('<ng-include src="\'' + templateUrl + '\'"></ng-include>')(newScope);
                            innerElement.push(compiledDom);
                            // clear out the contents of element to prevent memory leak
                            $element.empty().append(compiledDom);
                        }
                    }, function(error) {
                    if (!$scope.params.previewMode) {
                        $scope.inactiveError.inactiveEntityNameLabel = $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveTemplateNameLabel', 'Template Name');
                        $scope.inactiveError.inactiveEntityName = templateUrl;
                        $scope.inactiveError.associationFlag = true;
                        $scope.inactiveError.associationName = $scope.data.title;
                        var newScope = $scope.$new(false);
                        childScope.push(newScope);
                        var compiledDom = $compile('<ng-include src="\'displayInactiveError.tpl.html\'"></ng-include>')(newScope);
                        innerElement.push(compiledDom);
                        if ($element.get(0).nodeName === '#comment') {
                            $element = $element.replaceWith(compiledDom);
                        } else {
                            // clear out the contents of element to prevent memory leak
                            $element.empty().append(compiledDom);
                    }
                    }
                });

                $log.debug('card index ' + $scope.attrs.index);
                $scope.data.obj = $scope.obj;
            };

             
         }],
        template: function(tElement, tAttrs) {
            if (tAttrs.useExistingElementType != null) {
                return '<' + tElement[0].localName + ' ng-include="customtemplate ? customtemplate : templateUrl"></' + tElement[0].localName + '>';
            }
            return '<div></div>';
        }
    };
}).directive('includeReplace', function() {
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

},{}],6:[function(require,module,exports){
angular.module('CardFramework')
    .directive('vlocCardIcon', function() {
    'use strict';
    
    function getViewBoxForSprite(sprite) {
        switch (sprite) {
            case 'custom':
            case 'standard': return '0 0 100 100';
            case 'docType': return '0 0 56 64';
            default: return '0 0 52 52';
        }
    }

    return {
        restrict: 'EA',
        replace: true,
        scope: {
            data: '=?',
            obj: '=?',
            icon: '=?',
            sprite: '=?',
            size: '=?',
            extraClasses: '=?',
            live: '@?'
        },
        controller: ['$scope', '$rootScope', '$element','$attrs', 'cardIconFactory', '$sldsGetAssetPrefix', 'svgIconFactory', '$timeout', function($scope, $rootScope, $element, $attrs, cardIconFactory, $sldsGetAssetPrefix, svgIconFactory, $timeout) {
            if (!$scope.size) {
                $scope.size = 'medium';
            }

            function isLive() {
                return $scope.live == 'true' || $scope.live === true;
            };
            $scope.internalExtraClasses = $scope.extraClasses || '';
            var iconConfig = null;
            var timeoutForSettingDomElement = null;
            var dereg = $scope.$watch(function() {
                return svgIconFactory($scope.sprite, $scope.icon, true);
            }, function(svgtext) {
                function getSvgElement() {
                    var svgElement = $element.get(0);
                    if (svgElement.localName !== 'svg') {
                        svgElement = $element.children('svg').get(0);
                    }
                    return svgElement;
                }
                function setDomElementAttributes() {   
                    if (timeoutForSettingDomElement) {
                        $timeout.cancel(timeoutForSettingDomElement);
                    }
                    var svgElement = getSvgElement();
                    if (!svgElement) {
                            timeoutForSettingDomElement = $timeout(setDomElementAttributes);
                    } else {
                            svgElement.setAttribute('viewBox', getViewBoxForSprite($scope.sprite));
                            $(svgElement).children().replaceWith(svgIconFactory($scope.sprite, $scope.icon));
                    }
                }
                if (svgtext !== '') {
                    $scope.isSldsIcon = true;
                    if ($scope.sprite == 'standard' || $scope.sprite == 'custom') {
                        $scope.internalExtraClasses = ($scope.extraClasses || '') +  ' slds-icon-' + $scope.sprite + '-' + $scope.icon;
                    }
                  
                    setDomElementAttributes();
                    if (!isLive()) {
                        dereg();
                    }
                } else {
                    $scope.isSldsIcon = false;
                }
            });
            if (!$scope.sprite && !$scope.icon) {
                // sprite and icon not set then try figure it out
                if ($scope.data && $scope.data.sprite && $scope.data.icon) {
                    iconConfig = {
                        sprite: $scope.data.sprite,
                        icon: $scope.data.icon
                    };
                } else if ($scope.data && $scope.data.vlocityIcon && !/^icon-/.test($scope.data.vlocityIcon)) {
                    var parts = $scope.data.vlocityIcon.split('-');
                    $scope.sprite = parts[0];
                    $scope.icon = parts[1];
                    iconConfig = {
                        sprite: $scope.sprite,
                        icon: $scope.icon
                    };
                } else if ($scope.obj && $scope.obj.attributes && $scope.obj.attributes.type && (!$scope.data || !$scope.data.vlocityIcon)) {
                    // try match exact type
                    var cleanType = $scope.obj.attributes.type.replace('__c', '');
                    iconConfig = cardIconFactory(cleanType, true);
                    if (!iconConfig) {
                        iconConfig = cardIconFactory($scope.data.title, true);
                    }
                }

                if (!iconConfig && (!$scope.data || !$scope.data.vlocityIcon) || isLive()) {
                    iconConfig = cardIconFactory('');
                    var vlocIconDereg = $scope.$watch('data.vlocityIcon', function(vlocityIcon) {
                        if (vlocityIcon) {
                            if (!/^icon-/.test(vlocityIcon)) {
                                var parts = $scope.data.vlocityIcon.split('-');
                                $scope.sprite = parts[0];
                                $scope.icon = parts[1];
                            } else {
                                $scope.internalExtraClasses = '';
                                $scope.sprite = null;
                                $scope.icon = null;
                            }
                            if (!isLive()) {
                                vlocIconDereg();
                            }
                        }
                    });
                }
                if (iconConfig) {
                    $scope.sprite = iconConfig.sprite;
                    $scope.icon = iconConfig.icon;
                }
            }
            $scope.$watch('extraClasses', function(newValue) {
                if ($scope.sprite == 'standard' || $scope.sprite == 'custom') {
                    $scope.internalExtraClasses = ($scope.extraClasses || '') +  ' slds-icon-' + $scope.sprite + '-' + $scope.icon;
                }
            });
            
        }],
        templateUrl: function(elem, attr) {
            return elem.parent().hasClass('slds-media__figure') ? 'vlocCardIconSimple.tpl.html' : 'vlocCardIcon.tpl.html';
        }
    };
});
},{}],7:[function(require,module,exports){
angular.module('CardFramework')
    .directive('vlocCmp', function($compile) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            cards: '=',
            customtemplate: '@',
            data: '=',
            records: '=',
            ctrl: '@',
            loaded: '=?',
            init: '&',
            sessionId: '@'
        },
        replace: true,
        controller: ['$scope', '$rootScope','$element', '$controller','$attrs','force','configService','pageService', function($scope, $rootScope, $element, $controller, $attrs, force, configService, pageService) {

            $scope.params = pageService.params;
            $scope.attrs = $attrs;
            $scope.loggedUser = $rootScope.loggedUser ? $rootScope.loggedUser : null;
            $scope.inactiveError = {
                'header': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveErrorHeader', 'Error'),
                'errorMsg': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveErrorMsg', 'There is no active instance of'),
                'associationNameLabel': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveAssociationNameLabel', 'associated with'),
                'associationTypeLabel': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveAssociationTypeLabel', 'of type'),
                'associationType': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveAssociationTypeComponent', 'component'),
                'contactAdminMsg': $rootScope.vlocity.getCustomLabelSync('CardFrameworkContactAdminMsg',
                                                'Please contact your Salesforce Admin')
            };

            $scope.$watch('ready',function() {
                if ($scope.ready && $scope.importedScope) {
                    $scope.importedScope.init();
                }
            });
            var innerElement = [],
                childScope = [];

            if ($scope.ctrl) {
                var injectedScopeModel = $scope.$new();
                //You need to supply a scope while instantiating.
                //Provide the scope, you can also do $scope.$new(true) in order to create an isolated scope.
                //In this case it is the child scope of this scope.
                $controller($scope.ctrl,{$scope: injectedScopeModel});

                $scope.importedScope = injectedScopeModel;
            }

            $scope.loadTemplate = function() {
                var templateUrl;
                if ($scope.customtemplate) {
                    templateUrl = $scope.customtemplate;
                } else {
                    templateUrl = evaluateTemplate();
                    templateUrl = templateUrl ? templateUrl : 'card-canvas';
                }

                configService.checkIfTemplateIsActive(templateUrl)
                    .then(function(ok) {
                    var newScope = $scope.$new(false);
                    childScope.push(newScope);
                    var newElement = $compile('<ng-include src="\'' + templateUrl + '\'"></ng-include>')(newScope, function() {
                        $scope.ready = true;
                        $scope.loaded = true;
                    });
                    innerElement.push(newElement);
                    $element.append(newElement);
                }, function(error) {
                    if (!$scope.params.previewMode) {
                        $scope.inactiveError.inactiveEntityNameLabel = $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveTemplateNameLabel', 'Template Name');
                        $scope.inactiveError.inactiveEntityName = templateUrl;
                        $scope.inactiveError.associationFlag = true;
                        $scope.inactiveError.associationName = $scope.attrs.name;
                        var newScope = $scope.$new(false);
                        childScope.push(newScope);
                        var newElement = $compile('<ng-include src="\'displayInactiveError.tpl.html\'"></ng-include>')(newScope);
                        innerElement.push(newElement);
                        $element.append(newElement);
                    }
                });
            };

            function evaluateTemplate() {
                var foundIt = false;
                var templateUrl;
                angular.forEach($scope.data.templates, function(template) {
                    if (!foundIt) {
                        if (typeof template.filter === 'string') {
                            try {
                                if (eval(template.filter)) {
                                    foundIt = true;
                                    templateUrl = template.templateUrl;
                                }
                            } catch (e) {}
                        } else if (configService.checkFilter($scope, $scope.data, template.filter)) {
                            foundIt = true;
                            templateUrl = template.templateUrl;
                        }
                    }
                });
                return templateUrl;
            }



            childScope.forEach(function(scope) {
                scope.$destroy();
            });
            innerElement.forEach(function(element) {
                element.remove();
            });
            childScope = [];
            innerElement = [];
            $element.html('');
            $scope.loadTemplate();
        }],
        template: '<div></div>'
    };
});
},{}],8:[function(require,module,exports){
angular.module('CardFramework')
.directive('vlocInput', function($parse, $templateRequest, $compile) {
    'use strict';
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            type: '@',
            obj: '=',
            path: '@',
            ngModel: '=',
            customTemplate: '@'
        },
        link: function(scope, element, attr, ngModel) {
            var objVal = _.get(scope.obj,scope.path);
            ngModel.$modelValue = objVal;
            scope.ngModel = ngModel.$modelValue;
            ngModel.$setViewValue(ngModel.$modelValue);
            element.attr('value',ngModel.$viewValue);
          
            ngModel.$parsers.push(function(value) {
                if(value) {
                    _.set(scope.obj, scope.path, value);
                } else {
                    value = _.get(scope.obj,scope.path);
                    scope.ngModel = _.get(scope.obj,scope.path);
                    ngModel.$setViewValue(value);
                }
                return value;
            });
          
            ngModel.$render = function() {};
            if(scope.customTemplate) {
                $templateRequest(scope.customTemplate).then(function(html){
                    console.log('requested custom template ',html);
                    var compiledHtml = $compile(html)(scope);
                    console.log(compiledHtml);
                    element.replaceWith(compiledHtml);
                    console.log(element);
                });    
            }
        }
    };
});
},{}],9:[function(require,module,exports){
angular.module('CardFramework')
    .directive('vlocLayout', function($compile) {
    'use strict';
    return {
        restrict: 'EA',
        scope: {
            cards: '=?',
            ctrl: '@',
            customtemplate: '@',
            useExistingElementType: '@?',
            data: '=?',
            layoutName: '@',
            layoutId: '@',
            records: '=?',
            loaded: '=?',
            parent: '=?',
            isLoaded: '=?',
            loadingMore: '=?',
            sessionId: '@'
        },
        replace: true,
        controller: ['$scope', '$rootScope','$element', '$window', '$log', '$controller','$filter','$attrs','$http','force','configService', 'dataService',
        'pageService','actionService','performAction','$interpolate','$localizable','dataSourceService', '$vlocFlyout', '$q', 'parseUri','interactionTracking','$interval',
        function($scope, $rootScope, $element, $window, $log, $controller, $filter, $attrs, $http, force, configService, dataService,
             pageService, actionService, performAction, $interpolate, $localizable, dataSourceService, $vlocFlyout, $q, parseUri, interactionTracking,$interval) {

            $log = $log.getInstance('CardFramework: vloc-layout');
            $log.debug('layout loading: ', $scope.layoutName);
            $scope.nsPrefix = $rootScope.nsPrefix;
            $scope.params = pageService.params;
            $scope.attrs = $attrs;
            $scope.loggedUser = $rootScope.loggedUser ? $rootScope.loggedUser : null;
            $scope.session = {};
            $scope.uniqueLayoutId = Date.now(); 
            $scope.inactiveError = {
                'header': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveErrorHeader', 'Error'),
                'errorMsg': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveErrorMsg', 'There is no active instance of'),
                'associationNameLabel': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveAssociationNameLabel', 'associated with'),
                'associationTypeLabel': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveAssociationTypeLabel', 'of type'),
                'associationType': $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveAssociationTypeLayout', 'layout'),
                'contactAdminMsg':  $rootScope.vlocity.getCustomLabelSync('CardFrameworkContactAdminMsg', 'Please contact your Salesforce Admin')
            };
            var innerElement = null,
                childScope = null,
                currentTemplateUrl = null;

            $scope.uniqueName = 'vlocity.layout.' + $scope.layoutName;
            $scope.isLoaded = false; //initially set to false until calling datasource
            $scope.loadingMore = false; //initially set to false until appending datasource

            var unbindEvents = [];

            $scope.$on('$destroy', function() {
                //Removes all listeners
                unbindEvents.forEach(function (fn) {
                    fn();
                });
            });

            $element.on('$destroy', function() {
                $scope.$destroy();
            });

            if (configService.options.enableWindowListener) {
                //adding event listener for postmessage
                $window.addEventListener('message', function(e) {
                    $log.debug(e);
                    handleFrameEvents(e);
                });
            }

            unbindEvents[unbindEvents.length] =
                $scope.$on('reloadLayout', function(event, layoutName, reloadTemplate) {
                    console.info('Layout reload triggered for layout ', layoutName);
                    if (layoutName && layoutName === $scope.layoutName) {
                        //Clear the records before reload
                        $scope.records = null;
                        $scope.cards = null;
                        if (reloadTemplate || $scope.params.reloadTemplate) {
                            currentTemplateUrl = null;
                        }
                        //We dont have to fetch layouts or cards  definition on reload
                        //Passing the layout object ($scope.data) for handleLayoutLoaded function
                        handleLayoutLoaded($scope.data);
                    }
                });


            unbindEvents[unbindEvents.length] =
                $scope.$on('hotkeys.navigation.deselectCard', function(event) {
                    $vlocFlyout.hideFlyout();
                });
            

            unbindEvents[unbindEvents.length] =
                $scope.$on($scope.uniqueName + '.addCard', function(event, data) {
                    addCard(data);
                });


            unbindEvents[unbindEvents.length] =
                $scope.$on($scope.uniqueName + '.events', function(event, data) {
                    $log.debug(data);
                    switch (data.event) {
                        case 'reload':
                            $log.debug('Layout reload triggered for layout ', $scope.layoutName, data);
                            if (data.reloadTemplate || $scope.params.reloadTemplate) {
                                currentTemplateUrl = null;
                            }
                            $scope.reloadLayout2(data.message);
                            break;
                        case 'newPayload':
                            $log.debug('Layout reload triggered for layout ', $scope.layoutName, data);
                            //lets reset certain variables and evaluate the session
                            $scope.payload = data.message;
                            $scope.records = dataSourceService.selectResultNode($scope.data.dataSource, data.message);
                            $scope.evaluateSessionVars();
                            $scope.cards = null;
                            handleLayoutLoaded($scope.data);
                            loadLayout('newPayload');
                            break;
                        case 'prepend' :
                            $log.debug('Layout prepend triggered for layout ', $scope.layoutName, data);
                            if (!$scope.records) {
                                $scope.records = [];
                            }
                            if ($scope.prependRecords(data.message) !== false) {
                                $scope.records.unshift.apply($scope.records, data.message);
                            }
                            break;
                        case 'append' :
                            $log.debug('Layout append triggered for layout ', $scope.layoutName, data);
                            if (!$scope.records) {
                                $scope.records = [];
                            }
                            if ($scope.appendRecords(data.message) !== false) {
                                $scope.records = $scope.records.concat(data.message);
                            }
                            break;
                        case 'removeCard' :
                            $log.debug('Layout removeCard triggered for layout ', $scope.layoutName, data);
                            $scope.removeCard(data.message);
                            break;
                        case 'setLoading' :
                            $log.debug('Layout setLoading triggered for layout ', $scope.layoutName, data);
                            $scope.isLoaded = !data.message;
                            break;
                        case 'updateDatasource' :
                            $log.debug('Layout updateDatasource triggered for layout ', $scope.layoutName, data);
                            if (data.reloadTemplate || $scope.params.reloadTemplate) {
                                currentTemplateUrl = null;
                            }
                            $scope.updateDatasource(data.message.params, data.message.appendFlag, data.message.updateSilently, data.message.bypassTemplateRefresh);
                            break;
                        default:
                            // statements_def
                            break;
                    }
                });
            

            $scope.reloadLayout2 = function(newRecords) {
                //$scope.cards = null;

                //check if newRecords is different from current records
                //store old records
                //$scope.payload = $scope.records ? angular.copy($scope.records) : null;
                $scope.records = newRecords ? newRecords : null;
                $log.debug('layout records ',$scope.records);
                return handleLayoutLoaded($scope.data, true);
            };

            $scope.updateDatasource = function(params, appendFlag, updateSilently, bypassTemplateRefresh) {
                $log.debug('updating datasource ',params);
                switch ($scope.data.dataSource.type) {
                    case 'Query':
                        $scope.data.dataSource.value.query = params.query || $scope.data.dataSource.value.query;
                        break;
                    case 'ApexRemote':
                        angular.forEach(params, function(paramVal, paramKey) {
                            $scope.data.dataSource.value.inputMap[paramKey] = paramVal;
                        });
                        break;
                    case 'Dual':
                        if (typeof Visualforce !== 'undefined') { // the params are for the input map
                            angular.forEach(params, function(paramVal, paramKey) {
                                $scope.data.dataSource.value.inputMap[paramKey] = paramVal;
                            });
                            break;
                        }
                        // else fallthrough for regular REST api replacement
                    case 'REST': // intentionally fallthrough
                    case 'ApexRest':
                        $scope.data.dataSource.value.endpoint = replaceUrlParam($scope.data.dataSource.value.endpoint, params);
                        break;
                    default:
                        $log.debug('update datasource not supported for ' + $scope.data.dataSource.type);
                        break;
                }

                // If the datasource updateSilently flag is true, return
                // TBD: please revisit this and implement the fix for layout reload
                if (updateSilently) {
                    return $q.when(true);
                }

                $log.debug('new datasource:',$scope.data.dataSource);
                $scope.bypassTemplateRefresh = typeof bypassTemplateRefresh !== 'undefined' ?  bypassTemplateRefresh : true;
                if (appendFlag) {
                    $scope.loadingMore = true;
                    $scope.datasourceStatus = {status: 'loading'};
                    return dataSourceService.getData($scope.data.dataSource, $scope, $rootScope.forcetkClient).then(
                        function(records) {
                            $log.debug('layout append got data ',records);
                            $scope.payload = records; //refreshing payload data
                            $scope.loadingMore = false;
                            $log.debug('payload ',$scope.payload);
                            var recordsToAppend = dataSourceService.selectResultNode($scope.data.dataSource, records);
                            $scope.evaluateSessionVars();

                            $log.debug('session variables ',$scope.session);
                            if (!$scope.records) {
                                $scope.records = [];
                            }
                            if ($scope.appendRecords(recordsToAppend) !== false) {
                                $scope.records = $scope.records.concat(recordsToAppend);
                            }
                            $scope.datasourceStatus = {status: 'loaded'};
                            return $scope.records;
                        },
                        function(err) {
                            $log.debug('data error ',err);
                            loadLayout('bad data');
                            $scope.datasourceStatus = {status: 'error', msg: err};
                            $scope.loadingMore = false;
                        }
                    );
                } else {
                    //refresh layout
                    return $scope.reloadLayout2();
                }
            };

            function replaceUrlParam(endpoint, params) {
                var parsed = parseUri(endpoint);
                var output = (parsed.protocol ? parsed.protocol + '://' : '') + parsed.host + (parsed.port ? ':' + parsed.port : '') + parsed.path;
                if (parsed.query || params) {
                    if (params && !parsed.queryKey) {
                        parsed.queryKey = {};
                    }
                    // first iterate over params and update parsed.queryKey
                    Object.keys(params).forEach(function(key) {
                        if (params[key]) {
                            parsed.queryKey[key] = params[key];
                        } else if (parsed.queryKey[key]) {
                            delete parsed.queryKey[key];
                        }
                    });

                    // now update parsed.query
                    parsed.query = Object.keys(parsed.queryKey).map(function(key) {
                        return key + '=' + encodeURIComponent(parsed.queryKey[key]);
                    }).join('&');
                }

                return output + (parsed.query ? '?' + parsed.query : '') + (parsed.anchor ? '#' + parsed.anchor : '');
            }

            $scope.prependRecords = function(newRecords) {
                appendOrPrependRecords(newRecords, false);
            };

            $scope.appendRecords = function(newRecords) {
                appendOrPrependRecords(newRecords, true);
            };

            /**
             * appendOrPrependRecords : Private function
             * @param  {Array}  newRecords [Array of records]
             * @param  {Boolean} isAppend  true: append, false: prepend
             * @return {[type]}             [description]
             */
            function appendOrPrependRecords (newRecords, isAppend) {
                var existingCard;
                //Manual deletion of last record/last card, sets the cards array to empty
                //Using initialCardDefinition when cards array is empty.
                if ($scope.cards && $scope.cards.length > 0 || $scope.initialCardDefinition && $scope.initialCardDefinition.length > 0) {
                    //copy first card or initial card definition
                    existingCard = angular.copy($scope.cards[0]) || angular.copy($scope.initialCardDefinition[0]);
                    existingCard.obj = null;
                    $log.debug(isAppend ? 'Appending ' : 'Prepending ', existingCard, newRecords);

                    angular.forEach(newRecords, function(record) {
                        var newCard = angular.copy(existingCard);
                        newCard.obj = record;
                        if (isAppend) {
                            addCard(newCard, record, null, true);
                        } else {
                            if($scope.data.zones && $scope.data.zones[newCard.zone]) {
                                $scope.data.zones[newCard.zone].cards.unshift(newCard);
                            } else {
                                $scope.cards.unshift(newCard);
                            }
                            
                        }
                    });
                    //$scope.evaluateSessionVars();
                    return true;
                } else {
                    return false;
                }
            }

            $scope.removeCard = function(card, isSoftRemoval) {
                $log.debug('removing card ', card, card.cardIndex);
                card.deleteCard();
                if(!card.data.zone) {
                    $scope.cards.splice(card.cardIndex, 1);
                } else {
                    $scope.data.zones[card.data.zone].cards.splice(card.cardIndex, 1);
                }

                //Deleting from records array by default. If record is not removed from records array,
                //you may have discrepancies in records.length
                //isSoftRemoval flag should only be used when you're doing custom implementation and
                //you should take care of records

                if (!isSoftRemoval) {
                    angular.forEach($scope.records,function(record, index) {
                        if (record === card.obj) {
                            $scope.records.splice(index, 1);
                            return false;
                        }
                    });
                }
            };

            function handleFrameEvents(e) {
                if (!e.data) {
                    return;
                }
                var frameEventType = e.data.action;
                var frameEventPayload = e.data.data;
                switch (frameEventType){
                    case 'setParent':
                        $scope.$apply(function() {
                            $scope.parent = frameEventPayload;
                        });
                        break;
                    default:
                        $log.debug('got a strange message ',e);
                }
            }

            $scope.trackInteraction = function(interactionType, extraData) {
                var interactionData = interactionTracking.getDefaultTrackingData($scope);
                $log.debug('trackInteraction - interactionData ',interactionData, interactionType);
                switch (interactionType) {
                    case 'initLayout':
                            var eventData = {
                                'TrackingService' : 'CardFramework',
                                'TrackingEvent' : interactionType,
                                'LayoutInfo': $scope.layoutName,
                                'Cards': $scope.data.Deck,
                                'LayoutAttributes' : $scope.attrs,
                                'LayoutVersion' : $scope.data[$rootScope.nsPrefix + 'Version__c'],
                                'ContextId': $scope.layoutName,
                            };
                            interactionData = angular.extend(interactionData, eventData);
                        break;
                    default:
                            interactionData = angular.extend(interactionData, extraData);
                        break;
                }
                setTimeout( function() {
                    configService.isTrackingEnabled('CardFramework').then(function(enabled){
                            if(enabled){
                                interactionTracking.addInteraction(interactionData);
                            }
                    }, function(err){
                        //error handling 
                    });
                }, 0);
                
            }

            function loadLayout(src) {
                $log.debug('layout finished loading! ' + src, $scope.data);
                //bypass template refresh when just reloading cards and set to false for other scenarios
                if(!$scope.bypassTemplateRefresh) {
                    $scope.loadTemplate();
                    $scope.isLoaded = true;
                    $scope.trackInteraction('initLayout');

                } else {
                    $scope.isLoaded = true;
                    //$scope.bypassTemplateRefresh = false;
                    //trackInteraction('initLayout');
                }
                //TODO - insert refresh interval here
            }

            function handleLayoutLoaded(layout, isRefreshing) {
                var templateNames;
                if (!layout) {
                    // try by Id
                    $log.error('configService.getLayout: layout inactive or undefined: ' + $scope.layoutName + ' - ID was: ' + $scope.layoutId);

                    if (!$scope.params.previewMode) {

                        $localizable('CardFrameworkInactiveLayoutNameLabel', 'Layout Name').then(function(label) { $scope.inactiveError.inactiveEntityNameLabel = label; });
                        
                        if ($attrs.layoutType === 'flyout') {
                            $localizable('CardFrameworkInactiveAssociationTypeFlyout', 'flyout').then(function(label) {$scope.inactiveError.associationType = label;});
                        }

                        // consold-side-bar layout name is never on the page url.  So if it is inactive,
                        // the only place to get its name would be from $scope.layoutName
                        if (!pageService.params.layout) {
                            $scope.inactiveError.inactiveEntityName = $scope.layoutName;
                            $scope.inactiveError.associationFlag = false;
                        // if layout name exists on page url (that means it is on the Console Cards side) and that name
                        // is the same as $scope.layoutName, that means a layout is inactive
                        }else if (pageService.params.layout === $scope.layoutName) {
                            $scope.inactiveError.inactiveEntityName = pageService.params.layout;
                            $scope.inactiveError.associationFlag = false;
                        // if layout name exists on page url (that means it is on the Console Cards side) BUT that name
                        // is NOT the same as $scope.layoutName, that means a flyout $scope.layoutName that should have been
                        // launched from the layout pageService.params.layout is inactive
                        } else {
                            $scope.inactiveError.inactiveEntityName = $scope.layoutName;
                            $scope.inactiveError.associationFlag = true;
                            $scope.inactiveError.associationName = pageService.params.layout;
                        }
                        if (currentTemplateUrl !== 'displayInactiveError.tpl.html') {
                            if (childScope) {
                                childScope.$destroy();
                            }
                            if (innerElement) {
                                innerElement.remove();
                            }
                            $element.html('');
                            childScope = $scope.$new(false);
                            currentTemplateUrl = 'displayInactiveError.tpl.html';
                            innerElement = $compile('<ng-include src="\'displayInactiveError.tpl.html\'"></ng-include>')(childScope);
                            // clear out the contents of element to prevent memory leak
                            $element.empty().append(innerElement);
                        }
                    }

                    return $q.when(true);
                }

                // /* Cache the definition of first card which gets used while layout is reloaded.
                // * Layout Reload doesn't use configService.getLayoutByName or configService.getLayoutById which provides the first card definition.
                // */
                $scope.initialCardDefinition = $scope.initialCardDefinition ? $scope.initialCardDefinition : angular.copy(layout.Deck);

                $scope.order = 'order';
                var skipSetCards = false;
                $scope.data = layout;

                if($scope.params.previewMode)
                {
                    $scope.test = {};
                    _.set($scope.test,'$root.vlocity',{});
                    if ($scope.data.dataSource) {
                        angular.forEach($scope.data.dataSource.contextVariables, function(ctxVar) {
                            if (ctxVar.name) {
                                // this is used for the Preview tab to get the accountId that a layout with a context variable "loggedUser.AccountId"
                                // would need to launch the layout by including the accountId in the iframe url
                                if (ctxVar.name === 'loggedUser.AccountId' && ctxVar.val) {
                                    $rootScope.loggedUserAccountId = ctxVar.val;
                                }

                                _.set($scope.test,ctxVar.name,ctxVar.val);
                            }
                        });
                    }
                    angular.extend($scope.$root.vlocity, $scope.test.$root.vlocity);
                }

                //get templates
                templateNames = [];
                angular.forEach($scope.data.templates,function(template) {
                    if (templateNames.indexOf(template.templateUrl) === -1) {
                        templateNames.push(template.templateUrl);
                    }
                });

                if (!$scope.records && $scope.data.dataSource) {
                    $log.debug($scope.data.dataSource);
                    $scope.isLoaded = false;
                    $scope.datasourceStatus = {status: 'loading'};
                    dataSourceService.getData($scope.data.dataSource, $scope, $rootScope.forcetkClient).then(
                        function(records) {
                            $log.debug('layout got data ',records);
                            
                            //var equalPayload = _.isEqual(records, $scope.payload);
                            var equalPayload = configService.checkFilter($scope,$scope.payload,records,['$$hashKey']);
                            //var equalPayload = $scope.checkFilter(records, $scope.payload);
                            //check that we need to skipSettingCards
                            // skipSetCards = isRefreshing && angular.isDefined($scope.payload);

                            $scope.payload = records;
                            if(equalPayload && isRefreshing){
                                $scope.bypassTemplateRefresh = true;
                            } 
                            
                            $scope.cards = skipSetCards ? $scope.cards : null;
                            $scope.records = dataSourceService.selectResultNode($scope.data.dataSource, records);
                            $scope.evaluateSessionVars();
                            $log.debug('session variables ',$scope.session);
                            $log.debug('layout records ',$scope.records);
                            setCards(skipSetCards);
                            
                            $scope.datasourceStatus = {status: 'loaded'};
                            loadLayout('src');
                        },
                        function(err) {
                            $scope.evaluateSessionVars();
                            if($scope.data.dataSource.type) {
                                $log.debug('data error ',err);
                                $scope.datasourceStatus = {status: 'error', msg: err};
                            } else {
                                $log.debug('datasource null');
                                $scope.datasourceStatus = {status: 'none'};
                            }
                            setCards();
                            loadLayout('other');
                        }
                    );
                } else {
                    $scope.evaluateSessionVars();
                    $scope.datasourceStatus = {status: 'none'};
                    setCards();
                    $log.debug('datasource null');
                    loadLayout('other');
                }
            }

            function setCards(isRefreshing) {
                $log.debug('setCards ',isRefreshing);
                if(!isRefreshing){
                    if ($scope.initialCardDefinition) {
                        //Used when the layout is reloaded
                        $scope.cards = angular.copy($scope.initialCardDefinition);
                         
                         if($scope.data.zones){
                            angular.forEach($scope.data.zones, function(zone){
                                zone.cards = $scope.cards.filter(function(card){
                                    return zone.cardNames.indexOf(card.cardName) > -1;
                                });
                            });
                            $log.debug('placed cards in zone ',$scope.data.zones);  
                        }
                    } else {
                        //Used for page load
                        $scope.cards = $scope.data.Deck ? $scope.data.Deck : [];
                        $log.debug('layout has zones defined ',$scope.data.zones);
                        if($scope.data.zones){
                            angular.forEach($scope.data.zones, function(zone){
                                zone.cards = $scope.cards.filter(function(card){
                                    return zone.cardNames.indexOf(card.cardName) > -1;
                                });
                            });
                            $log.debug('placed cards in zone ',$scope.data.zones);  
                        }
                    }

                    angular.forEach($scope.cards,function(card, order) {
                        card.order = order;
                    });
                } else {
                    angular.forEach($scope.cards,function(card, order) {
                        card.records = $scope.records;
                    });
                }
            }

            if ($scope.layoutId != null && !/^\s*$/.test($scope.layoutId)) {
                configService.getLayoutById($scope.layoutId).then(handleLayoutLoaded);
            } else {
                configService.getLayoutByName($scope.layoutName).then(handleLayoutLoaded);
            }

            $scope.evaluateSessionVars = function() {
                angular.forEach($scope.data.sessionVars, function(sessionVar) {
                    try {
                        $log.debug('var name ',sessionVar);
                        $scope.session[sessionVar.name] = $interpolate('{{' + sessionVar.val + '}}')($scope);
                        $log.debug('session var ',$scope.session);
                    } catch (e) {
                        $log.debug('could not set ',sessionVar, e);
                    }
                });
                $log.debug('session variables',$scope.session);
                //delete $scope.payload;
            };

            function addCard(cardData, sObject, parentCard, appendToEnd) {
                $log.debug('addCard-----------------------------------------------', $scope);
                //cardData.obj = sObject;
                $scope.cards = $scope.cards ? $scope.cards : [];
                $log.debug(cardData);
                if (appendToEnd) {
                    $scope.cards.push(cardData);
                } else {
                    var cardIndex = $scope.cards.map(function(x) {
                        //combining title and index for matching cards in the right place
                        return x.title + x.cardIndex;
                    }).indexOf(cardData.title + (cardData.cardIndex - 1));
                    $log.debug('::::index of card::::',cardIndex, cardData.title);
                    if ($scope.cards.length >= cardIndex + 1 && cardIndex !== -1) {
                        $scope.cards.splice(cardIndex + 1, 0, cardData);
                    } else {
                        $scope.cards.push(cardData);
                    }
                }

                $log.debug('adding card to zones ',$scope.data.zones, cardData);
                if($scope.data.zones && $scope.data.zones[cardData.zone]) {
                    $scope.data.zones[cardData.zone].cards = $scope.data.zones[cardData.zone].cards || [];
                    if (appendToEnd) {
                        $scope.data.zones[cardData.zone].cards.push(cardData);
                    } else {
                        var zoneCardIndex = $scope.data.zones[cardData.zone].cards.map(function(x) {
                            //combining title and index for matching cards in the right place
                            return x.title + x.zoneCardIndex;
                        }).indexOf(cardData.title + (cardData.cardIndex - 1));
                        $log.debug('::::index of card::::',zoneCardIndex, cardData.title);
                        if ($scope.data.zones[cardData.zone].cards.length >= zoneCardIndex + 1) {
                            $scope.data.zones[cardData.zone].cards.splice(zoneCardIndex + 1, 0, cardData);
                        } else {
                            $scope.data.zones[cardData.zone].cards.push(cardData);
                        }
                    }
                    
                    $log.debug('added cards in zone ',$scope.data.zones);
                }
            }

            $scope.flyoutArrowLeftPos = 0;

            //Flyout

            $scope.hideFlyout = function() {
                $vlocFlyout.hideFlyout();
            };

            $rootScope.selectCard = function(cardIndex) {
                $vlocFlyout.hideFlyout();
                $rootScope.selected = cardIndex.split('-')[1];
                  $log.debug('card selected ',$rootScope.selected);
            };

            /**
             * Used by flyout actions
             * @param  {[type]} action vlocity action object
             */
            $scope.performAction = function(action) {
                $log.debug('perform action from layout ',action);
                return performAction(action, $scope.obj, $scope.records, $scope.data.filter, $scope.records.pickedState);
            };

            if ($scope.ctrl) {
                $log.debug('loading ' + $scope.ctrl);
                var injectedScopeModel = $scope.$new();
                //You need to supply a scope while instantiating.
                //Provide the scope, you can also do $scope.$new(true) in order to create an isolated scope.
                //In this case it is the child scope of this scope.
                $controller($scope.ctrl,{$scope: injectedScopeModel});

                $scope.importedScope = injectedScopeModel;
                $log.debug('importedScope ',$scope.importedScope);
                if ($scope.importedScope.init) {
                    $scope.importedScope.init();
                }
            }

            $scope.setOrder = function(order) {
                $log.debug('setting order');
                $scope.order = order;
            };

            $scope.searchFunc = function(cardObj, passedSearchToken) {
                // Wrapping in array since the 'filter' $filter expects an array
                return function(card) {
                    var searchedObj = [card.obj];
                    var searchToken = passedSearchToken || $scope.searchTerm;
                    if (searchToken) {
                        var matches = $filter('filter')(searchedObj, searchToken);
                        return matches.length > 0;
                    } else {
                        return true;
                    }
                };
            };

            $scope.loadTemplate = function() {
                //check if we really need to refresh template
                if($scope.bypassTemplateRefresh){
                    $scope.bypassTemplateRefresh = false;
                    return;
                }
                var templateUrl,
                    layoutType,
                    hotkeyLayoutAttr = 'hotkeys-layout-navigation';
                if ($scope.customtemplate) {
                    $log.debug('loading custom template ' + $scope.customtemplate);
                    templateUrl = $scope.customtemplate;
                } else {
                    templateUrl = evaluateTemplate();
                    templateUrl = templateUrl ? templateUrl : 'card-canvas';
                }

                $log.debug('loading layout template ' + templateUrl);

                configService.checkIfTemplateIsActive(templateUrl)
                    .then(function(ok) {
                        layoutType = $scope.data && $scope.data[$rootScope.nsPrefix + 'Type__c'];
                        if (layoutType && layoutType.toLowerCase() === 'flyout') {
                            //Disable hotkeys binding for flyout. Flyout's use parent layouts hotkeys
                            hotkeyLayoutAttr = '';
                            try {
                                $localizable('CardFrameworkInactiveAssociationTypeFlyout', 'flyout').then(function(label) {$scope.inactiveError.associationType = label;});    
                            } catch(err) {
                                $log.debug(err);
                            }
                            

                        }
                        if (currentTemplateUrl !== templateUrl) {
                            if (childScope) {
                                childScope.$destroy();
                            }
                            if (innerElement) {
                                innerElement.remove();
                            }
                            $element.html('');
                            childScope = $scope.$new(false);
                            currentTemplateUrl = templateUrl;
                            innerElement = $compile('<ng-include src="\'' + templateUrl + '\'" ' + hotkeyLayoutAttr + '></ng-include>')(childScope);
                            // clear out the contents of element to prevent memory leak
                            $element.empty().append(innerElement);
                        }
                    }, function(error) {
                        if (!$scope.params.previewMode) {
                            $scope.inactiveError.inactiveEntityNameLabel = $rootScope.vlocity.getCustomLabelSync('CardFrameworkInactiveTemplateNameLabel', 'Template Name');
                            $scope.inactiveError.inactiveEntityName = templateUrl;
                            $scope.inactiveError.associationFlag = true;
                            $scope.inactiveError.associationName = $scope.layoutName;
                            if (currentTemplateUrl !== templateUrl) {
                                if (childScope) {
                                    childScope.$destroy();
                                }
                                if (innerElement) {
                                    innerElement.remove();
                                }
                                $element.html('');
                                childScope = $scope.$new(false);
                                currentTemplateUrl = 'displayInactiveError.tpl.html';
                                innerElement = $compile('<ng-include src="\'displayInactiveError.tpl.html\'"></ng-include>')(childScope);
                                // clear out the contents of element to prevent memory leak
                                $element.empty().append(innerElement);
                            }
                        }
                    });
            };

            function evaluateTemplate() {
                var foundIt = false;
                $log.debug('evaluateTemplate layout');
                $log.debug($scope.data.templates);
                var templateUrl;
                angular.forEach($scope.data.templates, function(template) {
                    if (!foundIt) {
                        if (typeof template.filter === 'string') {
                            try {
                                if (eval(template.filter)) {
                                    foundIt = true;
                                    templateUrl = template.templateUrl;
                                }
                            } catch (e) {}
                        } else if (configService.checkFilter($scope,$scope.data, template.filter)) {
                            foundIt = true;
                            templateUrl = template.templateUrl;
                        }
                    }
                });
                return templateUrl;
            }

        }],
        template: function(tElement, tAttrs) {
            if (tAttrs.useExistingElementType != null) {
                return '<' + tElement[0].localName + '></' + tElement[0].localName + '>';
            }
            return '<div></div>';
        }
    };
});

},{}],10:[function(require,module,exports){
angular.module('CardFramework')
    .provider('actionLauncher', function actionLauncherProvider() {

      var defaultWindowOpen = function(url, params, action) {
        window.open(url, params);
      };

      var windowOpen = defaultWindowOpen;
      var alwaysUseOverride = false

      this.setCustomWindowOpen = function(customWindowOpen, alwaysUse) {
        windowOpen = customWindowOpen;
        alwaysUseOverride = alwaysUse;
      };

      this.$get = function($rootScope, dataService, actionService, $injector, $log) {
        'use strict';
        $log.debug('calling action launcher');
        if (windowOpen !== defaultWindowOpen) {
            windowOpen = windowOpen($injector);
        } 
        var launchAction = function (action, actionConfig) {
            var className = action[$rootScope.nsPrefix +'InvokeClassName__c'];
            var classMethod = action[$rootScope.nsPrefix +'InvokeMethodName__c'];
            var redirectByContext = actionConfig ? actionConfig.contextRedirectFlag : false;
            var actionCallback = actionConfig ? actionConfig.showLoadingSpinner: null;
            if(actionCallback) { actionCallback(); }

            if(className && classMethod) {
                var inputMap = {};
                inputMap.contextId = action.contextId;
                //Invoke VOI method
                dataService.doGenericInvoke(className, classMethod, angular.toJson(inputMap), null).then(
                function(data) {
                    //check if action is a context redirect
                    if(redirectByContext) {
                        try {
                            var device = window.outerWidth > 768 ? 'Web Client': 'Mobile';
                            var objId = data.records[0].id || data.records[0].Id;
                            var objType = data.records[0].objectType || 'All';
                            var soRecord = {Id: objId};
                            actionService.getActions(objType, soRecord, device, null, $rootScope.forcetkClient).then(
                            function(reloadActions) {
                                if (reloadActions.length > 0) {
                                    angular.forEach(reloadActions,function(reloadAction) {
                                        if(reloadAction.name === action.Name) {
                                            if(actionCallback) { actionCallback(); }
                                            openActionUrl(reloadAction, actionConfig);
                                            return;
                                        }
                                    });
                                }
                            });
                        }catch(e) {
                            console.log('error redirecting action ',e);
                            //default go to url
                            openActionUrl(action, actionConfig);
                        }
                    } else {
                        //otherwise open passed action url
                        if(actionCallback) { actionCallback(); }
                        openActionUrl(action, actionConfig);
                    }

                }, function(err){
                    console.error('action err ',err);
                    if(actionCallback) { actionCallback(); }
                    openActionUrl(action, actionConfig);
                });
            } else {
                if(actionCallback) { actionCallback(); }
                openActionUrl(action, actionConfig);
            }
        };

        function openActionUrl(action, actionConfig) {
            var selRecordEvent, openSubtab, openSuccess, primaryTabId;
            var externalUrl = false;
            var openUrlMode = action[$rootScope.nsPrefix +'OpenUrlMode__c'] || action[$rootScope.nsPrefix +'OpenURLMode__c'] || action.openUrlIn;
            var className = action[$rootScope.nsPrefix +'InvokeClassName__c'];
            var classMethod = action[$rootScope.nsPrefix +'InvokeMethodName__c'];
            var pathValid = new RegExp('^(?:[a-z]+:)?//', 'i');
            var communityUrl = localStorage.getItem('currentInstanceUrlWithPath');
            var toBeLaunchedUrl, basicUrl;

            //vlocity action
            var params = (openUrlMode === 'New Tab / Window') ? '_blank' : '_self';

            // separate action.url from the actual url to be launched.  The former determines if the url is internal (Omniscript /apex/...)
            // or external (like www.google.com).  The latter would have to be prepend with 'https://' in the case of internal url.

            // Note: Url__c contains the evalauted url if it's dynamic url. Refer vloccard performAction();
            // CORE-740: using fallback on URL__c
            toBeLaunchedUrl = action[$rootScope.nsPrefix + 'Url__c'] || action[$rootScope.nsPrefix + 'URL__c'] || action.url;
            if(actionConfig && actionConfig.extraParams) {
                angular.forEach(actionConfig.extraParams, function(paramVal, paramKey){
                    toBeLaunchedUrl = replaceUrlParam(toBeLaunchedUrl, paramKey, paramVal);
                });
            }
            basicUrl = toBeLaunchedUrl;
            console.log('Opening action url ' + toBeLaunchedUrl );

            //If url is undefined, return. If we need to handle other new variations apart from url launch
            //like methods or classname, add the check here to bypass
            if(!toBeLaunchedUrl) {
                console.error('actionLauncher.invoke :: Vlocity action url not found for this action', action);
                return false;
            }

            // if action.url is not prefixed by 'https://', then it must be an internal Omniscript url that starts with
            // '/apex/...'
            if (!pathValid.test(toBeLaunchedUrl)) {
                // ONLY community (both ALoha and Lightning Community) would need the instance url including the community subdomain(subpath).
                // If this is coming from community, then it would have a value currentInstanceUrl in localStorage.
                // For community, this would be the community url + path.
                // For non-community, which includes console, LEX with consoleCards component, the relative path of Omniscript
                // from VlocityAction is sufficient to launch Omniscript.
                toBeLaunchedUrl = (communityUrl) ?  communityUrl + toBeLaunchedUrl : toBeLaunchedUrl;
            // else if action.url is prefixed by 'https://', it must be an external url like 'www.google.com'
            } else {
                externalUrl = true;
                console.log('external url: ' + toBeLaunchedUrl);
            }

            selRecordEvent = $rootScope.$$listeners['actionSelected'];
            if (selRecordEvent) {
                console.log('firing event :: actionSelected');
                $rootScope.showContent = false;
                $rootScope.$broadcast('actionSelected',toBeLaunchedUrl);
            } else if (typeof sforce !== 'undefined' && !alwaysUseOverride) {
                if (sforce.console && sforce.console.isInConsole() && !externalUrl && params === '_blank') {
                    openSubtab = function openSubtab(result) {
                        //Now that we have the primary tab ID, we can open a new subtab in it
                        primaryTabId = result.id;
                        sforce.console.openSubtab(primaryTabId , toBeLaunchedUrl, false,
                            action.displayName, null, openSuccess, null);
                    };
                    openSuccess = function openSuccess(result) {
                        sforce.console.focusSubtabById(result.id);
                    };
                    sforce.console.getEnclosingPrimaryTabId(openSubtab);
                } else {
                    if(typeof sforce.one === 'object') {
                        if(params === '_blank') {

                            var lightningRedirect = '{"componentDef":"one:alohaPage","attributes":{"values":{"address":"'+basicUrl+'"},"history":[]},"t":'+Date.now()+'}';
                            var lightningInstanceUrl = '/one/one.app#'+window.btoa(lightningRedirect);
                            windowOpen(lightningInstanceUrl, params, action);

                        }else {
                            sforce.one.navigateToURL(toBeLaunchedUrl, false);
                        }

                    } else {
                        windowOpen(toBeLaunchedUrl, params, action);
                    }

                }
            }else {
                windowOpen(toBeLaunchedUrl, params, action);
            }
        }

        function replaceUrlParam(endpoint, paramName, paramValue) {
            var pattern = new RegExp('\\b('+paramName+'=).*?(&|$)');
            if(endpoint.search(pattern) >= 0){
                return endpoint.replace(pattern,'$1' + paramValue + '$2');
            }
            return endpoint + (endpoint.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue ;
        }

        return {
            invoke: function(action, actionConfig){
                launchAction(action, actionConfig);
            }
        };
    };

});

},{}],11:[function(require,module,exports){
angular.module('CardFramework')
  .provider('cardIconFactory', function cardIconFactoryProvider() {
      var standard = ['account', 'announcement', 'approval', 'apps', 'article', 'avatar', 'calibration', 
                      'call', 'campaign', 'campaign_members', 'canvas', 'case', 'case_change_status', 'case_comment', 
                      'case_email', 'case_log_a_call', 'case_transcript', 'client', 'coaching', 'connected_apps', 
                      'contact', 'contract', 'custom', 'dashboard', 'default', 'document', 'drafts', 'email', 
                      'email_chatter', 'empty', 'endorsement', 'environment_hub', 'event', 'feed',
                      'feedback', 'file', 'flow', 'folder', 'forecasts', 'generic_loading', 'goals', 'group_loading', 'groups',
                      'hierarchy', 'home', 'household', 'insights', 'investment_account', 'lead', 'link', 'log_a_call', 
                      'marketing_actions', 'merge', 'metrics', 'news', 'note', 'opportunity', 'orders', 'people', 'performance',
                      'person_account', 'photo', 'poll', 'portal', 'post', 'pricebook', 'process', 'product', 
                      'question_best', 'question_feed', 'quotes', 'recent', 'record', 'related_list', 'relationships', 'report',
                      'reward', 'sales_path', 'scan_card', 'service_contract', 'skill_entity', 'social', 'solution', 'sossession', 'task', 'task2',
                      'team_member', 'thanks', 'thanks_loading', 'today', 'topic', 'unmatched', 'user', 'work_order', 
                      'work_order_item'];
      function makeCustomIcon(iconNumber) {
        return {
          sprite: 'custom',
          icon: 'custom' + iconNumber
        };
      }
      function makeStandardIcon(iconName) {
        return {
          sprite: 'standard',
          icon: iconName
        };
      }
      var iconMap = {
        'claim': makeCustomIcon(41),

        'campaign member action log': makeStandardIcon('call'),

        'customer interaction': makeCustomIcon(15),

        'asset': makeCustomIcon(75),
        'asset landline': makeCustomIcon(22),
        'asset internet': makeCustomIcon(68),
        'asset tv': makeCustomIcon(99),
        'asset mobile': makeCustomIcon(28),
        'asset support': makeStandardIcon('question_feed'),
        'asset internet+tv': makeCustomIcon(22),
        'asset accessories': makeCustomIcon(22),
        'asset security': makeCustomIcon(77),
        'asset wireless': makeCustomIcon(30),

        'policy': makeCustomIcon(91),
        'policy ad&d': makeCustomIcon(1),
        'policy auto': makeCustomIcon(31),
        'policy boatowners': makeCustomIcon(88),
        'policy boat': makeCustomIcon(88),
        'policy business owners': makeCustomIcon(32),
        'policy condominium': makeCustomIcon(24),
        'policy crime': makeCustomIcon(91),
        'policy d&o': makeCustomIcon(32),
        'policy equity−indexed annuity': makeCustomIcon(16),
        'policy fixed annuity': makeCustomIcon(16),
        'policy general liability': makeCustomIcon(16),
        'policy homeowners': makeStandardIcon('home'),
        'policy inland marine': makeCustomIcon(98),
        'policy motorcycle': makeCustomIcon(98),
        'policy ocean marine': makeCustomIcon(92),
        'policy permanent life': makeCustomIcon(1),
        'policy pers/scheduled property': makeCustomIcon(43),
        'policy property': makeStandardIcon('home'),
        'policy renters': makeStandardIcon('person_account'),
        'policy term life': makeCustomIcon(1),
        'policy umbrella liability': makeCustomIcon(60),
        'policy unit linked life': makeCustomIcon(1),
        'policy universal life': makeCustomIcon(1),
        'policy universal variable life': makeCustomIcon(1),
        'policy variable annuity': makeCustomIcon(16),
        'policy variable life': makeCustomIcon(1),
        'policy workers compensation': makeCustomIcon(32),

      };
      // map non held policies to same as policies
      Object.keys(iconMap).forEach(function(keyInMap) {
        if (/^policy/.test(keyInMap)) {
          iconMap['non held ' + keyInMap] = iconMap[keyInMap];
        }
      });
      // map standard icons from salesforce
      standard.forEach(function(icon) {
        iconMap[icon] = makeStandardIcon(icon);
      });
      this.applyIconMapping = function(key, sprite, icon) {
        if (angular.isObject(key)) {
          Object.keys(key).forEach(function(keyInMap) {
            iconMap[keyInMap]= key[keyInMap];
          });
        } else {
          iconMap[key] = {
            sprite: sprite,
            icon: icon
          }
        }
      };

      this.$get = function() {
        return function(objectType, noDefault) {
          var found = null,
              objectTypeParts = objectType.split(' ');
          while (!found && objectTypeParts.length > 0) {
            found = iconMap[objectTypeParts.join(' ').toLowerCase()];
            objectTypeParts.pop(); // remove last item
          }
          if (!found) {
            return noDefault ? null : {
              sprite: 'custom',
              icon: 'custom91'
            };
          } else {
            return found;
          }
        };
      };
  });
},{}],12:[function(require,module,exports){
angular.module('CardFramework')
.factory('configService', function(remoteActions, force, $rootScope, nameSpaceService, debugService, $q, vlocTemplateInternalCache, $log, $interval , $interpolate, dataService) {
    'use strict';
    $log = $log.getInstance ? $log.getInstance('CardFramework: configService') : $log;

    var convertStringArray2SoqlInClause = function(strArray) {
        if (strArray.length === 0) {
            return null;
        } else {
            var returnStr = '(';
            for (var i = 0; i < strArray.length; i++) {
                returnStr += '\'' + strArray[i] + '\'';
                if (i < strArray.length - 1) {
                    returnStr += ',';
                }
            }
            returnStr += ')';
            return returnStr;
        }
    };

    function makeErrorHandler(message) {
        return function(error) {
            if (console.error) {
                console.error(message, error);
            } else {
                $log.debug(message, error);
            }
            throw error;
        };
    };

     function loadCardframeworkDefinitions(datapack){
        var q = $q.defer();
        var dataPackString = JSON.stringify(datapack).replace(/%vlocity_namespace%__/g,'');
        datapack = JSON.parse(dataPackString);
        $log.debug('loading datapack nsPrefix',$rootScope.nsPrefix,' datapack ',datapack);
        $rootScope.vlocityCards = $rootScope.vlocityCards || {};
        processDataPack(datapack.data.dataPacks);
        q.resolve(true);

        return q.promise;
    };

    function processDataPack(packs){
        var success = true;
        var nsPrefixMask = '';
        try {
             angular.forEach(packs, function(pack){
                switch(pack.VlocityDataPackType) {
                    case 'VlocityUILayout':
                        $log.debug('layout ', pack);
                        $rootScope.vlocityCards.cachedLayouts = $rootScope.vlocityCards.cachedLayouts || {};
                        angular.forEach(pack.VlocityDataPackData[nsPrefixMask + 'VlocityUILayout__c'], function(layout){
                            $rootScope.vlocityCards.cachedLayouts[layout.Name] = layout;
                        });

                        break;
                    case 'VlocityCard':
                        $log.debug('card ',pack);
                        $rootScope.vlocityCards.cachedCards = $rootScope.vlocityCards.cachedCards || {};
                        angular.forEach(pack.VlocityDataPackData[nsPrefixMask + 'VlocityCard__c'], function(card){
                            $rootScope.vlocityCards.cachedCards[card.Name] = card;
                        });
                        break;
                    case 'VlocityUITemplate':
                        $log.debug('template ',pack);
                        vlocTemplateInternalCache.names = vlocTemplateInternalCache.names || [];
                        angular.forEach(pack.VlocityDataPackData[nsPrefixMask + 'VlocityUITemplate__c'], function(template){
                            vlocTemplateInternalCache.names = vlocTemplateInternalCache.names || [];
                            vlocTemplateInternalCache.names.push(template.Name);
                            vlocTemplateInternalCache.resolved[template.Name] = template;
                            $log.debug('added template ',template.Name,vlocTemplateInternalCache.names, vlocTemplateInternalCache.resolved);
                            //caching right away
                            sessionStorage.setItem('template::' + template.Name, JSON.stringify(template));
                        });
                        break;
                    default:
                        $log.debug('not supported ',pack);
                        break;
                }
            });
            $log.debug('cached items ',$rootScope.vlocityCards, vlocTemplateInternalCache);
        } catch(e){
            $log.debug(e);
            success = false;
        }

       return success;
    };

    function fetchLayoutFromVlocCache(layoutName) {
        var q = $q.defer();
        var layout;
        //check if anything is cached
        if(!$rootScope.vlocityCards || !$rootScope.vlocityCards.cachedLayouts[layoutName]) {
            q.reject(null);
            return q.promise;
        }

        layout = $rootScope.vlocityCards.cachedLayouts[layoutName];
        //var nsPrefix = '%vlocity_namespace%__';
        var nsPrefix = '';
        while (typeof layout[nsPrefix + 'Definition__c'] !== 'object' && typeof layout[nsPrefix + 'Definition__c'] !== 'undefined') {//making sure we parse the json
            layout[nsPrefix + 'Definition__c'] = JSON.parse(layout[nsPrefix + 'Definition__c']);
        }
        if (!layout[nsPrefix + 'Definition__c']) {
            layout[nsPrefix + 'Definition__c'] = {templates:[], dataSource: [], Cards: []};
        }
        layout.templates = layout[nsPrefix + 'Definition__c'].templates;
        layout.dataSource = layout[nsPrefix + 'Definition__c'].dataSource;
        layout.Loaded = false;
        layout.session = {};
        layout.sessionVars = layout[nsPrefix + 'Definition__c'].sessionVars || [];
        layout.zones = layout[nsPrefix + 'Definition__c'].zones;

        var cardNames = layout[nsPrefix + 'Definition__c'].Cards || [];
        if (cardNames.length > 0) {
            //pre-filling array with nulls to make sure cards get added to the right index in the Deck array
            layout.Deck = _.fill(new Array(cardNames.length), null);
            angular.forEach(cardNames, function(cardName) {
                var card = $rootScope.vlocityCards.cachedCards[cardName];
                var cardDefinition = {Cards:[]};
                if (card[nsPrefix + 'Definition__c']) {
                    cardDefinition = JSON.parse(card[nsPrefix + 'Definition__c']);
                }
                cardDefinition.cardName = card.Name;
                cardDefinition.layoutName = 'vlocity.layout.'+layout.Name; //need to know the parent name
                card[nsPrefix + 'Definition__c'] = cardDefinition;
                var cardIndex = layout[nsPrefix + 'Definition__c'].Cards.indexOf(card.Name);
                if (cardIndex > -1) {
                    // console and community only use cardDefinition
                    layout.Deck[cardIndex] = cardDefinition;
                }
                if(layout.zones){
                    angular.forEach(layout.zones, function(zone){
                        $log.debug('zone match ',card[nsPrefix + 'Definition__c'].cardName, zone.cardNames, zone.cardNames.indexOf(card[nsPrefix + 'Definition__c'].cardName));
                        if(zone.cardNames.indexOf(card[nsPrefix + 'Definition__c'].cardName) > -1) {
                            card[nsPrefix + 'Definition__c'].zone = zone.name;
                            $log.debug('matching zone ',zone.name, card[nsPrefix + 'Definition__c']);
                        }
                    });
                }
            });

            layout.Deck = layout.Deck.filter(function(card) {
                return card !== null;
            });

            sessionStorage.setItem('layout::' + layout.Name, JSON.stringify(layout));
            q.resolve(layout);
            //return layout;

        } else {
            layout.Deck = [];
            sessionStorage.setItem('layout::' + layout.Name, JSON.stringify(layout));
            layout.Loaded = true;
            q.resolve(layout);
            //return layout;
        }

        return q.promise;
    }

    function checkFilter(scope, sObject, filterObject, ignoreFields) {
        var objField, field, isFieldMatch = true;
        if (!sObject || Object.keys(sObject).length == 0) {
            return false;
        }
        if (filterObject) {
            angular.forEach(filterObject, function(value, field) {
                if (!ignoreFields || ignoreFields.indexOf(field) === -1){
                    if (typeof sObject[field] === 'object') {
                        if (checkFilter(scope, sObject[field], filterObject[field]) == false) {
                            isFieldMatch = false;
                        }
                    } else {
                        try {
                            if (typeof filterObject[field] !== 'object' && ($interpolate(filterObject[field])(scope) !== _.get(sObject, field))) {
                                isFieldMatch = false;
                            }
                        } catch(err) {
                            $log.debug('error in checkFilter ',err);
                            isFieldMatch = false;
                        }
                    }
                }
            });
        }
        return isFieldMatch;
    }

    function isTrackingEnabled(trackingEvent) {
        var q = $q.defer();
        if($rootScope.vlocityCards.customSettings && typeof $rootScope.vlocityCards.customSettings['Track.'+trackingEvent] !== undefined){
            q.resolve($rootScope.vlocityCards.customSettings['Track.'+trackingEvent]);
            return q.promise;
        } else {
             return dataService.getCustomSettings($rootScope.nsPrefix + 'TriggerSetup__c').then(
                function(customSettings){
                    $log.debug('TriggerSetup__c custom settings ',customSettings);
                    $rootScope.vlocityCards.customSettings = $rootScope.vlocityCards.customSettings || {};

                    angular.forEach(customSettings, function(setting){
                        $rootScope.vlocityCards.customSettings[setting.Name] = setting[$rootScope.nsPrefix + 'IsTriggerOn__c'];
                    });    
                    $log.debug('vlocity custom settings ',$rootScope.vlocityCards.customSettings);
                    return $rootScope.vlocityCards.customSettings['Track.'+trackingEvent] || false;

                }, function(err){
                    $log.debug('vlocity settings err ',err);
                    $rootScope.vlocityCards.customSettings = $rootScope.vlocityCards.customSettings || {};
                    return false;
            });
        }
    }

    return {
        options : {enableWindowListener : true},
        checkIfTemplateIsActive: function(templateUrl) {
            // create an object that contain a promise
            var q = $q.defer();

            // in most cases, template cache is already initialized and the following
            // will return with no delay
            if (vlocTemplateInternalCache.names) {
                if (vlocTemplateInternalCache.names.indexOf(templateUrl) > -1) {
                    q.resolve('ok');
                } else {
                    q.reject('error');
                }
                return q.promise;
            // in rare occasion in Community where one of the components try to have
            // its template loaded but the template cache has not been initialized,
            // only then would we have a 0.1 sec delay
            } else {
                var checkInterval = setInterval(function() {
                    if (vlocTemplateInternalCache.names) {
                        if (vlocTemplateInternalCache.names.indexOf(templateUrl) > -1) {
                            q.resolve('ok');
                        } else {
                            q.reject('error');
                        }
                        // stop checking once the template cache has been initialized
                        clearInterval(checkInterval);
                    }
                }, 100); // 100 millsec = 0.1 sec
                return q.promise;
            }
        },

        // used by the old CardDesigner
        getLayouts: function() {
            $log.debug('calling configService: getLayouts()');
            if (remoteActions.getLayouts && typeof Visualforce !== 'undefined') {
                return remoteActions.getLayouts();
            } else {
                return nameSpaceService.getNameSpacePrefix().then(
                    function(nsPrefix) {
                        $log.debug('getLayouts(): nsPrefix: ' + nsPrefix);
                        return force.query('SELECT Id, Name, ' + nsPrefix + 'Definition__c,' + nsPrefix + 'Description__c,' + nsPrefix + 'Active__c,' + nsPrefix + 'Type__c,' + nsPrefix + 'Version__c, CreatedDate, CreatedBy.Name, LastModifiedDate, LastModifiedBy.Name FROM ' + nsPrefix + 'VlocityUILayout__c ORDER BY Name').then(
                            function(data) {
                                var layouts = data.records;
                                var layoutList = [];
                                angular.forEach(layouts,function(layout) {
                                    layout[nsPrefix + 'Definition__c'] = JSON.parse(layout[nsPrefix + 'Definition__c']);
                                    layoutList.push(layout);
                                });
                                return layoutList;
                            }, makeErrorHandler('layouts retrieval error: '));
                    });
            }
        },

        // used by vloc-layout, which in turn is used by Console and Community
        getLayoutByName: function(layoutName) {
            var layoutDefinitionStringFromCache = sessionStorage.getItem('layout::' + layoutName);
            var layoutDefinitionJsonFromCache;

            // create an object that contain a promise
            var q = $q.defer();

            if (layoutDefinitionStringFromCache) {
                layoutDefinitionJsonFromCache = JSON.parse(layoutDefinitionStringFromCache);
                q.resolve(layoutDefinitionJsonFromCache);
                return q.promise;
            } else {

                if (typeof remoteActions !== 'undefined' && remoteActions !== null &&
                    remoteActions['getLayout'] &&
                    remoteActions['getCardsByNames'] && typeof Visualforce !== 'undefined') {
                    return this.getLayoutViaRemoting('Name', layoutName);
                } else if(force.isAuthenticated()) {
                    var searchCriterion = ' WHERE Name = \'' + layoutName + '\'';
                    return this.getLayoutViaApi('Name', searchCriterion).then(
                        function(layout) {
                            return layout;
                        });
                } else {
                    return fetchLayoutFromVlocCache(layoutName);
                }
            }
        },

        // used by new Designer in CardDesigner.js
        getLayoutById: function(layoutId) {
            if (typeof remoteActions !== 'undefined' && remoteActions !== null &&
                remoteActions['getLayout'] &&
                remoteActions['getCardsByNames'] && typeof Visualforce !== 'undefined') {

                return this.getLayoutViaRemoting('Id', layoutId).then(
                    function(layout) {
                        return layout;
                    });
            } else if(force.isAuthenticated()){
                var searchCriterion = ' WHERE Id = \'' + layoutId + '\'';
                return this.getLayoutViaApi('Id', searchCriterion).then(
                    function(layout) {
                        return layout;
                    });
            }
        },

        // used by getLayoutByName and getLayoutById via VF Remoting
        getLayoutViaRemoting: function(searchCriterionType, searchParam) {
            return nameSpaceService.getNameSpacePrefix().then(
                function(nsPrefix) {
                    debugService.displayNameSpacePrefix('getLayoutViaRemoting', nsPrefix);
                    return remoteActions.getLayout(searchCriterionType, searchParam).then(
                        function(data) {
                            if (data.length > 0) {
                                var layout = data[0];
                                while (typeof layout[nsPrefix + 'Definition__c'] !== 'object' && typeof layout[nsPrefix + 'Definition__c'] !== 'undefined') {//making sure we parse the json
                                    layout[nsPrefix + 'Definition__c'] = JSON.parse(layout[nsPrefix + 'Definition__c']);
                                }
                                if (!layout[nsPrefix + 'Definition__c']) {
                                    layout[nsPrefix + 'Definition__c'] = {templates:[], dataSource: [], Cards: []};
                                }
                                layout.templates = layout[nsPrefix + 'Definition__c'].templates;
                                layout.dataSource = layout[nsPrefix + 'Definition__c'].dataSource;
                                layout.Loaded = false;
                                layout.session = {};
                                layout.sessionVars = layout[nsPrefix + 'Definition__c'].sessionVars || [];
                                layout.zones = layout[nsPrefix + 'Definition__c'].zones;

                                var cardNames = layout[nsPrefix + 'Definition__c'].Cards || [];
                                if (cardNames.length > 0) {

                                    return remoteActions.getCardsByNames(cardNames).then(
                                            function(data) {
                                                var cards = data;
                                                //pre-filling array with nulls to make sure cards get added to the right index in the Deck array
                                                var cardsLength = cards.length > cardNames.length ? cardNames.length : cards.length;
                                                layout.Deck = _.fill(new Array(cardsLength), null);

                                                angular.forEach(cards, function(card) {
                                                    var cardDefinition = {Cards:[]};
                                                    if (card[nsPrefix + 'Definition__c']) {
                                                        cardDefinition = JSON.parse(card[nsPrefix + 'Definition__c']);
                                                    }
                                                    cardDefinition.cardName = card.Name;
                                                    cardDefinition.layoutName = 'vlocity.layout.'+layout.Name; //need to know the parent name
                                                    card[nsPrefix + 'Definition__c'] = cardDefinition;
                                                    var cardIndex = layout[nsPrefix + 'Definition__c'].Cards.indexOf(card.Name);
                                                    if (cardIndex > -1) {
                                                        // console and community only use cardDefinition
                                                        layout.Deck[cardIndex] = cardDefinition;
                                                    }
                                                    if(layout.zones){
                                                        angular.forEach(layout.zones, function(zone){
                                                            $log.debug('zone match ',card[nsPrefix + 'Definition__c'].cardName, zone.cardNames, zone.cardNames.indexOf(card[nsPrefix + 'Definition__c'].cardName));
                                                            if(zone.cardNames.indexOf(card[nsPrefix + 'Definition__c'].cardName) > -1) {
                                                                card[nsPrefix + 'Definition__c'].zone = zone.name;
                                                                $log.debug('matching zone ',zone.name, card[nsPrefix + 'Definition__c']);
                                                            }
                                                        });
                                                    }
                                                });

                                                layout.Deck = layout.Deck.filter(function(card) {
                                                    return card !== null;
                                                });

                                                sessionStorage.setItem('layout::' + layout.Name, JSON.stringify(layout));
                                                //layout.Loaded = true;
                                                return layout;
                                            }, makeErrorHandler('cards retrieval error: '));

                                } else {
                                    layout.Deck = [];
                                    sessionStorage.setItem('layout::' + layout.Name, JSON.stringify(layout));
                                    layout.Loaded = true;
                                    return layout;
                                }

                            } else {
                                //query did not return anything
                                return null;
                            }

                        }, makeErrorHandler('layouts retrieval error: '));

                });

        },

        // used by getLayoutByName and getLayoutById via API calls
        getLayoutViaApi: function(searchCriterionType, searchCriterion) {
            return nameSpaceService.getNameSpacePrefix().then(
                function(nsPrefix) {

                    debugService.displayNameSpacePrefix('getLayoutViaApi', nsPrefix);

                    var baseQuery = 'SELECT Id, Name, ' + nsPrefix + 'Definition__c,' + nsPrefix + 'Description__c,' + nsPrefix + 'Active__c,' + nsPrefix + 'Type__c,' + nsPrefix + 'Version__c, CreatedDate, CreatedBy.Name, LastModifiedDate, LastModifiedBy.Name FROM ' + nsPrefix + 'VlocityUILayout__c';
                    var activeCriterion = ' AND ' + nsPrefix + 'Active__c = True';
                    var soqlQuery;

                    if (searchCriterionType === 'Name') {
                        // getLayoutByName() must use an active layout version
                        soqlQuery = baseQuery + searchCriterion + activeCriterion;
                    } else {
                        // designer should be able to pull out any versions of a layout
                        soqlQuery = baseQuery + searchCriterion;
                    }

                    return force.query(soqlQuery).then(
                        function(data) {

                            if (data.records.length > 0) {

                                var layout = data.records[0];

                                while (typeof layout[nsPrefix + 'Definition__c'] !== 'object') {//making sure we parse the json
                                    layout[nsPrefix + 'Definition__c'] = JSON.parse(layout[nsPrefix + 'Definition__c']);
                                }

                                layout.templates = layout[nsPrefix + 'Definition__c'].templates;
                                layout.dataSource = layout[nsPrefix + 'Definition__c'].dataSource;
                                layout.Loaded = false;
                                layout.session = {};
                                layout.sessionVars = layout[nsPrefix + 'Definition__c'].sessionVars || [];

                                var cardNames = layout[nsPrefix + 'Definition__c'].Cards || [];
                                if (cardNames.length > 0) {

                                    var cardsSoql = 'SELECT Id, Name, ' + nsPrefix + 'Type__c, ' + nsPrefix + 'Definition__c, LastModifiedDate FROM ' + nsPrefix + 'VlocityCard__c WHERE Name IN ';
                                    var inClause = convertStringArray2SoqlInClause(cardNames);
                                    var cardsSoqlWithInClause = cardsSoql + inClause;

                                    return force.query(cardsSoqlWithInClause).then(
                                            function(data) {
                                                var cards = data.records;
                                                //pre-filling array with nulls to make sure cards get added to the right index in the Deck array
                                                var cardsLength = cards.length > cardNames.length ? cardNames.length : cards.length;
                                                layout.Deck = _.fill(new Array(cardsLength), null);

                                                angular.forEach(cards, function(card) {
                                                    var cardDefinition = {Cards:[]};
                                                    if (card[nsPrefix + 'Definition__c']) {
                                                        cardDefinition = JSON.parse(card[nsPrefix + 'Definition__c']);
                                                    }
                                                    cardDefinition.layoutName = 'vlocity.layout.'+layout.Name; //need to know the parent name
                                                    card[nsPrefix + 'Definition__c'] = cardDefinition;
                                                    var cardIndex = layout[nsPrefix + 'Definition__c'].Cards.indexOf(card.Name);
                                                    if (cardIndex > -1) {
                                                        // console and community only use cardDefinition
                                                        layout.Deck[cardIndex] = cardDefinition;
                                                    }
                                                });

                                                layout.Deck = layout.Deck.filter(function(card) {
                                                    return card !== null;
                                                });

                                                sessionStorage.setItem('layout::' + layout.Name, JSON.stringify(layout));
                                                layout.Loaded = true;
                                                return layout;
                                            },
                                            function(error) {
                                                $log.debug('cards retrieval error: ' + error);
                                            });
                                } else {
                                    sessionStorage.setItem('layout::' + layout.Name, JSON.stringify(layout));
                                    layout.Loaded = true;
                                    return layout;
                                }

                            } else {
                                //query did not return anything
                                return null;
                            }

                        }, makeErrorHandler('layouts retrieval error: '));

                });
        },

        // used by CardDesigner
        getCards: function() {
            return nameSpaceService.getNameSpacePrefix().then(
                function(nsPrefix) {

                    debugService.displayNameSpacePrefix('getCards', nsPrefix);

                    if (typeof remoteActions !== 'undefined' && remoteActions !== null && remoteActions['getCards']  && typeof Visualforce !== 'undefined') {

                        return remoteActions.getCards().then(
                            function(cards) {
                                return cards;
                            }, makeErrorHandler('getCards retrieval error: '));
                    } else {

                        return force.query('SELECT Id, Name, ' + nsPrefix + 'Type__c, ' + nsPrefix + 'Definition__c, LastModifiedDate FROM ' + nsPrefix + 'VlocityCard__c').then(

                            function(data) {
                                var cards = data.records;
                                return cards;
                            }, makeErrorHandler('getCards retrieval error: '));
                    }

                });
        },

        // used by vloc-card
        getCardByName: function(cardName) {
            var cardDefinitionStringFromCache = sessionStorage.getItem('card::' + cardName);
            var cardDefinitionJsonFromCache;

            // create an object that contain a promise
            var q = $q.defer();

            if (cardDefinitionStringFromCache) {
                cardDefinitionJsonFromCache = JSON.parse(cardDefinitionStringFromCache);
                q.resolve(cardDefinitionJsonFromCache);
                return q.promise;
            } else {
                return nameSpaceService.getNameSpacePrefix().then(
                    function(nsPrefix) {

                        debugService.displayNameSpacePrefix('getCardByName', nsPrefix);

                        if (typeof remoteActions !== 'undefined' && remoteActions !== null && remoteActions['getCardByName'] && typeof Visualforce !== 'undefined') {

                            return remoteActions.getCardByName(cardName).then(
                                function(card) {
                                    if (card) {
                                        var cardDefinitionString = card[nsPrefix + 'Definition__c'];
                                        sessionStorage.setItem('card::' + cardName, cardDefinitionString);
                                        return JSON.parse(cardDefinitionString);
                                    } else {
                                        return null;
                                    }
                                }, makeErrorHandler('getCardByName retrieval error: '));

                        } else {

                            var soql = 'SELECT Id, Name, ' + nsPrefix + 'Type__c, ' + nsPrefix + 'Definition__c, LastModifiedDate' +
                                       ' FROM ' + nsPrefix + 'VlocityCard__c WHERE Name = \'' + cardName + '\'';

                            return force.query(soql).then(

                                function(data) {
                                    if (data.records.length > 0) {
                                        var card = data.records[0];
                                        var cardDefinitionString = card[nsPrefix + 'Definition__c'];
                                        sessionStorage.setItem('card::' + cardName, cardDefinitionString);
                                        return JSON.parse(cardDefinitionString);

                                    } else {
                                        return null;
                                    }
                                }, makeErrorHandler('getCardByName retrieval error: '));
                        }

                    });
            }

        },

        saveObject: function(object, sObjectName) {
            //sObject Name should come with nsPrefix already included
            $log.debug('calling configService: saveObject() ',sObjectName, object);
            return nameSpaceService.getNameSpacePrefix().then(
                function(nsPrefix) {
                    debugService.displayNameSpacePrefix('saveObject', nsPrefix);

                    if (object.Id == null) {
                        return force.create(sObjectName, object);
                    } else {
                        // remove system fields
                        delete object.LastModifiedDate;
                        delete object.CreatedDate;
                        delete object.CreatedBy;
                        delete object.LastModifiedBy;

                        return force.update(sObjectName, object);
                    }

                });
        },

        deleteObject: function(object, sObjectName) {
            $log.debug('calling configService: deleteObject()');
            return nameSpaceService.getNameSpacePrefix().then(
                function(nsPrefix) {
                    debugService.displayNameSpacePrefix('deleteObject', nsPrefix);

                    return force.del(nsPrefix + sObjectName, object.Id).then(

                        function(response) {
                            $log.debug('deleteObject ' + sObjectName + ' successful: response: ' + response);
                            return response;
                        },

                        function(error) {
                            $log.debug('deleteObject ' + sObjectName + ' failure error: ' + error);
                            $log.debug(error);
                        });
                });
        },

        getStaticResourcesUrl: function() {
            if (typeof remoteActions !== 'undefined' && remoteActions !== null && remoteActions['getStaticResourcesUrl'] && typeof Visualforce !== 'undefined') {
                return remoteActions.getStaticResourcesUrl().then(
                    function(resources) {
                        return JSON.parse(resources);
                    }, makeErrorHandler('getStaticResourcesUrl retrieval error: '));
            } else {
                return force.query('SELECT Name, NamespacePrefix, SystemModStamp FROM StaticResource').then(
                    function(data) {
                        var resourceList = data.records;
                        var resourceMap = {};
                        angular.forEach(resourceList,function(st) {
                            var namespace = st.NamespacePrefix;
                            var systemTimeStamp = new Date(st.SystemModstamp);
                            var systemTimeStampInSec = systemTimeStamp.getTime();
                            resourceMap[st.Name] = '/resource/' + systemTimeStampInSec + '/' + (namespace !== null && namespace !== '' ? namespace + '__' : '') + st.Name;
                        });
                        return resourceMap;
                    }, makeErrorHandler('getStaticResourcesUrl retrieval error: '));
            }
        },

        getNamedCredentials: function() {
            return force.query('SELECT DeveloperName,Endpoint,Id,Language,MasterLabel,NamespacePrefix,PrincipalType FROM NamedCredential LIMIT 10000').then(
                function(result) {
                    var credentials = result.data.records;
                    $log.debug('getNamedCredentials completed ',result.data, credentials);
                    return credentials;
                }, makeErrorHandler('getNamedCredentials retrieval error: '));

        },

        // used in vlocLayout, vlocCmp, vlocCard  directive to filter the records
        checkFilter: checkFilter,
        //check for a particular service if the tracking is enabled, i.e. CardFramework or HybridCPQ
        isTrackingEnabled: isTrackingEnabled,
        //load layout, card and template definitions
        loadCardframeworkDefinitions: loadCardframeworkDefinitions

    };
});

},{}],13:[function(require,module,exports){
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
angular.module('CardFramework')
.factory('parseUri', function() {
    'use strict';

    return function parseUri (str) {
        var o   = {
                    strictMode: false,
                    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
                    q:   {
                        name:   "queryKey",
                        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                    },
                    parser: {
                        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                    }
                  },
            m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
            uri = {},
            i   = 14;

        while (i--) uri[o.key[i]] = m[i] || "";

        uri[o.q.name] = {};
        uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
            if ($1) uri[o.q.name][$1] = $2;
        });

        return uri;
    };
});
},{}],14:[function(require,module,exports){
angular.module('CardFramework')
.factory('performAction', function($rootScope, actionLauncher, actionService, $log) {
    'use strict';

    function getSORecord(data, obj) {
        if (data && data.actionCtxId)  {
            return {Id: data.actionCtxId};
        } else if (obj) {
            if (obj.actionCtxId) {
                return {Id: obj.actionCtxId};
            } else if (obj.Id) {
                return {Id: obj.Id};
            }
        }
        return null;
    }

    function getSObjectType(obj, pickedState) {
        var objType = 'All'
        // Check if obj exists and is an sObject, otherwise use setting
        // If it fails set object type as all to get actions anyway
        if (pickedState && pickedState.sObjectType) {
            objType = pickedState.sObjectType;
        } else if (obj && obj.attributes && obj.attributes.type) {
            objType = obj.attributes.type;
        }
        return objType;
    }

    function performAction(action, actionConfig, obj, data, filter, pickedState) {
        $log.debug('performing action ',action);
        var soRecord = getSORecord(data, obj),
            device = window.outerWidth > 768 ? 'Web Client' : 'Mobile';

        if (!action[$rootScope.nsPrefix + 'UrlParameters__c'] || action.evaluated) {
            //Launch action for static urls or if the actions are already evaluated.
            actionLauncher.invoke(action, actionConfig);
        } else {
            //Actions get evaluated only once per card if the action has dynamic url.
            var actionNames = [];
            angular.forEach(pickedState.definedActions.actions, function(action){
                if(!action.isCustomAction){
                    actionNames.push(action.id);
                }
            });
            actionService.getActionsByName(getSObjectType(obj, pickedState), soRecord, device, null, $rootScope.forcetkClient, $log, actionNames)    
                .then(function(actions) {
                    actions.forEach(function(actionObj) {
                        //filtering out actions in the card vs actions returned
                        var evalAction = data.actions.filter(function(actionElem){
                            return actionObj.id === actionElem.Id;
                        });
                        //evaluate action that was clicked
                        if (action.Id === actionObj.id && actionObj.url) {
                            action[$rootScope.nsPrefix + 'Url__c'] = actionObj['url'];
                            //card-740: updating fallback paramter as well
                            action[$rootScope.nsPrefix + 'URL__c'] = actionObj['url'];
                            //setting a runtime contextId variable for our action to use when calling apex methods
                            action['contextId'] = soRecord ? soRecord.Id : null;
                            action.evaluated = true; //action has been evaluated

                        } else if (evalAction.length > 0 && evalAction[0].Id === actionObj.id && actionObj.url) {
                            //evaluate the rest of the actions returned
                            evalAction[0][$rootScope.nsPrefix + 'Url__c'] = actionObj['url'];
                            //card-740: updating fallback paramter as well
                            evalAction[0][$rootScope.nsPrefix + 'URL__c'] = actionObj['url'];
                            //setting a runtime contextId variable for our action to use when calling apex methods
                            evalAction[0]['contextId'] = soRecord ? soRecord.Id : null;
                            evalAction[0].evaluated = true;
                        }
                    });
                    actionLauncher.invoke(action, actionConfig);
                });
        }
    }

    performAction.getSORecord = getSORecord;
    performAction.getSObjectType = getSObjectType;

    return performAction;
});

},{}],15:[function(require,module,exports){
angular.module("CardFramework").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("displayInactiveError.tpl.html","<style>\n[layout-type=flyout] > ng-include[src='\\'displayInactiveError.tpl.html\\'']:before {\n    width: 1rem;\n    height: 1rem;\n    position: absolute;\n    transform: rotate(45deg);\n    content: '';\n    background-color: inherit;\n    left: 50%;\n    top: -.5rem;\n    margin-left: -.5rem;\n}\n\n[layout-type=flyout] > ng-include[src='\\'displayInactiveError.tpl.html\\'']:after {\n    width: 1rem;\n    height: 1rem;\n    position: absolute;\n    transform: rotate(45deg);\n    content: '';\n    background-color: #FFF;\n    left: 50%;\n    top: -.4rem;\n    margin-left: -.5rem;\n    box-shadow: -1px -1px 0 0 rgba(0,0,0,.16);\n    z-index: 0;\n}\n</style>\n<div class='panel panel-default script-not-found'>\n    <div class='panel-body'>\n        <div class=\"text-danger\">\n            <span class=\"icon-v-close-circle\"></span>\n            <b class=\"has-error\">{{inactiveError.header}}:</b>\n        </div>\n        <br/>\n        <div>\n            <label>{{inactiveError.errorMsg}}</label>\n            <br/>\n            <div>\n                <span>\n                    <b>{{inactiveError.inactiveEntityNameLabel}}: </b><label>{{inactiveError.inactiveEntityName}}</label>\n                    <br/>\n                </span>\n                <span ng-if=\"inactiveError.associationFlag\">\n                    <b>{{inactiveError.associationNameLabel}}: </b><label>{{inactiveError.associationName}}</label>\n                    <br/>\n                    <b>{{inactiveError.associationTypeLabel}}: </b><label>{{inactiveError.associationType}}</label>\n                </span>\n            </div>\n            <br/>\n            <label>{{inactiveError.contactAdminMsg}}</label>\n        </div>\n    </div>\n</div>"),$templateCache.put("vlocCardIcon.tpl.html","<span ng-class=\"!isSldsIcon && data.vlocityIcon ? 'icon ' + data.vlocityIcon + ' ' + internalExtraClasses : 'slds-icon__container ' + (sprite == 'standard' || sprite == 'custom' ? 'slds-icon-' + sprite + '-' + icon : '')\">\n"+'    <slds-svg-icon sprite="sprite" icon="icon" size="size" extra-classes="internalExtraClasses" no-hint="true" ng-if="isSldsIcon"></slds-svg-icon>\n</span>'),$templateCache.put("vlocCardIconSimple.tpl.html",'<svg aria-hidden="true" class="slds-icon slds-icon--{{size}} {{internalExtraClasses}}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">\n    <use xlink:href=""></use>\n</svg>')}]);
},{}]},{},[1]);

})();
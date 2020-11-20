/*************************************************************************
 *
 * VLOCITY, INC. CONFIDENTIAL
 * __________________
 *
 *  [2014] - [2020] Vlocity, Inc.
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
 * Build: v108.0.0
 */

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
/*jshint ignore:start */
require('./VlocTemplates.js');
var _$provide;
angular.module('CardFramework', ['vlocity', 'vlocTemplates', 'mgcrea.ngStrap', 'sldsangular', 'cometd'])
    .config(['$localizableProvider', 'dataServiceProvider', function ($localizableProvider, dataServiceProvider) {
        'use strict';
        $localizableProvider.setLocalizedMap(window.i18n);
        $localizableProvider.setDebugMode(window.ns === '');
        var map = {},
            asyncMode = true;
        $localizableProvider.$get = function $LocalizableFactory(remoteActions, $rootScope, $timeout, $q, userProfileService) {
            var pendingTimeoutToken, requestedLabels = {},
                pendingLabels = {},
                pendingLabelPromise = {};

            /* Merge cachedLabels with those from the localizedMap - localizedMap takes priority */
            var cachedLabels = JSON.parse(sessionStorage.getItem('vlocity.customLabels')) || {};
            $rootScope.vlocity = ($rootScope.vlocity || {});
            $rootScope.vlocity.customLabels = map = _.merge(map, cachedLabels);

            function requestLabel(pendingLabels) {
                var dataService = dataService ? dataService : dataServiceProvider.$get();
                return userProfileService.userInfoPromise().then(
                    function () {
                        return dataService.fetchCustomLabels(pendingLabels)
                            .then(function (allLabels) {
                                var labelResult = allLabels || {};
                                angular.forEach(labelResult, function (labelValue, labelName) {
                                    if (labelName !== 'language' && labelName !== 'totalSize') {
                                        map[labelName] = labelResult[labelName] || requestedLabels[labelName];
                                        requestedLabels[labelName] = undefined;
                                        map[labelName] = map[labelName] || {};
                                        if (angular.isString(map[labelName])) {
                                            // update existing key to be based on userLanguage
                                            map[labelName] = {};
                                            map[labelName][$rootScope.vlocity.userLanguage] = labelValue;
                                        }
                                        map[labelName][$rootScope.vlocity.userLanguage] = labelResult[labelName];
                                    }
                                });
                                $rootScope.$emit('vlocity.labelRetrieved', Object.keys(labelResult));
                            }).catch(function (error) {
                                if (pendingLabels.length > 1) {
                                    var splitAt = Math.round(pendingLabels.length / 2);
                                    return $q.all([
                                        requestLabel(pendingLabels.slice(0, splitAt)),
                                        requestLabel(pendingLabels.slice(splitAt))
                                    ]);
                                } else if (pendingLabels.length == 1) {
                                    var labelName = pendingLabels[0];
                                    map[labelName] = map[labelName] || {};
                                    map[labelName][$rootScope.vlocity.userLanguage] = requestedLabels[labelName];
                                    console.warn('No CustomLabel found for key ' + labelName);
                                    return $q.when(map[labelName]);
                                }
                            }).finally(function () {
                                // sync back to sessionStorage
                                sessionStorage.setItem('vlocity.customLabels', JSON.stringify(map));
                            });
                    }
                );
            }

            function getLabel(labelName, defaultValue) {
                if (pendingLabels[labelName] != null || requestedLabels[labelName] != null) {
                    return pendingLabelPromise[labelName].promise;
                }
                pendingLabels[labelName] = defaultValue || '';
                if (pendingTimeoutToken) {
                    $timeout.cancel(pendingTimeoutToken);
                }
                var defered = $q.defer();
                pendingTimeoutToken = $timeout(function () {
                    var keys = Object.keys(pendingLabels);
                    keys.forEach(function (key) {
                        requestedLabels[key] = pendingLabels[key];
                    });
                    requestLabel(keys)
                        .finally(function () {
                            keys.forEach(function (key) {
                                pendingLabelPromise[key].resolve(map[key][$rootScope.vlocity.userLanguage]);
                            });
                        });
                    pendingLabels = {};
                }, 50);
                return (pendingLabelPromise[labelName] = defered).promise;
            }

            function localizeFn(key, defaultString) {
                // make sure Key is valid label to prevent errors from server
                var sanitizedKey = key.replace(/ /g, '_');
                var result = null;
                var aliasArgs = arguments;
                //setting locale if non-existant
                $rootScope.vlocity.userLanguage = $rootScope.vlocity.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage;
                //normalize between locale formats : en_US and en-US
                $rootScope.vlocity.userLanguage = $rootScope.vlocity.userLanguage.toLowerCase().replace('_', '-');
                if (angular.isString(map[sanitizedKey])) {
                    result = map[sanitizedKey];
                } else if (angular.isObject(map[sanitizedKey])) {
                    result = map[sanitizedKey][$rootScope.vlocity.userLanguage];
                }
                // if we don't have a result return 'undefined' so angular won't hand out a default
                if (!result) {
                    return getLabel(sanitizedKey, defaultString)
                        .then(function (result) {
                            if (aliasArgs.length > 2 && angular.isString(result)) {
                                // need to replace tokens
                                result = result.replace(/\{(\d+)\}/g, function (match, number) {
                                    number = Number(number);
                                    if (number > 0) {
                                        if (aliasArgs.length >= number && aliasArgs[number + 1] !== FORCE_SYNC_KEY) {
                                            return aliasArgs[number + 1] || '';
                                        } else {
                                            return '';
                                        }
                                    }
                                });
                            }
                            return result;
                        })
                }
                if (aliasArgs.length > 2) {
                    // need to replace tokens
                    result = result.replace(/\{(\d+)\}/g, function (match, number) {
                        number = Number(number);
                        if (number > 0) {
                            if (aliasArgs.length >= number && aliasArgs[number + 1] !== FORCE_SYNC_KEY) {
                                return aliasArgs[number + 1] || '';
                            } else {
                                return '';
                            }
                        }
                    });
                }
                if (asyncMode && remoteActions.getCustomLabels && arguments[arguments.length - 1] !== FORCE_SYNC_KEY) {
                    return $q.when(result);
                } else if (typeof (this) !== 'undefined') {
                    return result;
                } else {
                    return $q.resolve(result);
                }
            }
            return localizeFn;
        };
    }])
    .config(function ($provide) {
        _$provide = $provide;
    })
    .config(['$compileProvider', '$logProvider', function ($compileProvider, $logProvider) {
        'use strict';
        var debugMode;
        //had to copy from pageService as services are not available
        //in config

        var params = function () {
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
                        var arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
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
    .config(['$controllerProvider', '$windowProvider', '$filterProvider', '$provide', '$compileProvider', function ($controllerProvider, $windowProvider, $filterProvider, $provide, $compileProvider) {
        'use strict';
        $windowProvider.$get().vlocity = $windowProvider.$get().vlocity || {};
        $windowProvider.$get().vlocity.cardframework = $windowProvider.$get().vlocity.cardframework || {};
        //set registerModule method to be global
        $windowProvider.$get().vlocity.cardframework.registerModule = {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };
    }])
    .config(['remoteActionsProvider', function (remoteActionsProvider) {

        var nsPrefixDotNotation = fileNsPrefixDot();

        var remoteActions = {
            getUserProfile: {
                action: nsPrefixDotNotation + 'CardCanvasController.getUserProfile',
                config: {
                    escape: false,
                    buffer: true
                }
            },
            getDataViaDynamicSoql: {
                action: nsPrefixDotNotation + 'CardCanvasController.getDataViaDynamicSoql',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getDatasourceQuery: {
                action: nsPrefixDotNotation + 'CardCanvasController.getDatasourceQuery',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getDataViaDataRaptor: {
                action: nsPrefixDotNotation + 'CardCanvasController.getDataViaDataRaptor',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getAccountById: {
                action: nsPrefixDotNotation + 'CardCanvasController.getAccountById',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getConsoleCardsAction: {
                action: nsPrefixDotNotation + 'CardCanvasController.getConsoleCardsAction',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getActionsInfo: {
                action: nsPrefixDotNotation + 'CardCanvasController.getActionsInfo',
                config: {
                    escape: false,
                    buffer: true
                }
            },
            getActions: {
                action: nsPrefixDotNotation + 'CardCanvasController.getActionDetails',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getActionDetailsByName: {
                action: nsPrefixDotNotation + 'CardCanvasController.getActionDetailsByName',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getLayouts: {
                action: nsPrefixDotNotation + 'CardCanvasController.getAllLayouts',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getLayout: {
                action: nsPrefixDotNotation + 'CardCanvasController.getLayout',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getLayoutsByName: {
                action: nsPrefixDotNotation + 'CardCanvasController.getLayoutByName',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getCards: {
                action: nsPrefixDotNotation + 'CardCanvasController.getAllCardDefinitions',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getCardByName: {
                action: nsPrefixDotNotation + 'CardCanvasController.getCardByName',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getCardsByNames: {
                action: nsPrefixDotNotation + 'CardCanvasController.getCardsByNames',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getActiveCardsByNames: {
                action: nsPrefixDotNotation + 'CardCanvasController.getActiveCardsByNames',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getStaticResourcesUrl: {
                action: nsPrefixDotNotation + 'CardCanvasController.getStaticResourcesUrl',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            doGenericInvoke: {
                action: nsPrefixDotNotation + 'CardCanvasController.doGenericInvoke',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            doAsyncInvoke: {
                action: nsPrefixDotNotation + 'CardCanvasController.doAsyncInvoke',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getAllObjects: {
                action: nsPrefixDotNotation + 'CardCanvasController.getAllObjects',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getFieldsForObject: {
                action: nsPrefixDotNotation + 'CardCanvasController.getFieldsForObject',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getActiveTemplateNames: {
                action: nsPrefixDotNotation + 'CardCanvasController.getActiveTemplateNames',
                config: {
                    escape: false,
                    buffer: true
                }
            },
            getTemplate: {
                action: nsPrefixDotNotation + 'CardCanvasController.getTemplate',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getCustomLabelValue: {
                action: nsPrefixDotNotation + 'CardCanvasController.getCustomLabelValue',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getCustomLabels: {
                action: nsPrefixDotNotation + 'CardCanvasController.getCustomLabels',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            doNamedCredentialCallout: {
                action: nsPrefixDotNotation + 'CardCanvasController.doNamedCredentialCallout',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getCustomSettings: {
                action: nsPrefixDotNotation + 'CardCanvasController.getCustomSettings',
                config: {
                    escape: false,
                    buffer: true
                }
            },
            trackVlocityInteraction: {
                action: nsPrefixDotNotation + 'CardCanvasController.trackVlocityInteraction',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getSearchQuery: {
                action: nsPrefixDotNotation + 'CardCanvasController.getSearchQuery',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            updateTask: {
                action: nsPrefixDotNotation + 'CardCanvasController.updateTask',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getCardsByGlobalKeys: {
                action: nsPrefixDotNotation + 'CardCanvasController.getCardsByGlobalKeys',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            doEncryptedDatasource: {
                action: nsPrefixDotNotation + 'CardCanvasController.doEncryptedDatasource',
                config: {
                    escape: false,
                    buffer: false
                }
            },
            getCustomPermissionsForUser: {
                action: nsPrefixDotNotation + 'CardCanvasController.getCustomPermissionsForUser',
                config: {
                    escape: false,
                    buffer: true
                }
            },
            getNamedCredentials: {
                action: nsPrefixDotNotation + 'CardCanvasController.getNamedCredentials',
                config: {
                    escape: false,
                    buffer: false
                }
            }
        };
        // Only desktop would need RemoteActions
        if (typeof Visualforce !== 'undefined') {
            remoteActionsProvider.setRemoteActions(remoteActions || {});
        }
    }])
    .run(['$rootScope', 'actionService', 'cardIconFactory', 'pageService', '$timeout', '$log', 'interactionTracking', 'userProfileService', 'dataService', 'configService', 'cometd',
        function ($rootScope, actionService, cardIconFactory, pageService, $timeout, $log, interactionTracking, userProfileService, dataService, configService, cometd) {
            'use strict';
            $rootScope.nsPrefix = fileNsPrefix();
            $rootScope.cardIconFactory = cardIconFactory;

            //@TODO Line numbers always point to the closure function in console rather than the
            //call stack for errors or debug when $log.getIntance is used. Needs Fix

            //setup logging
            $log.getInstance = function (context) {
                return {
                    log: enhanceLogging($log.log, context),
                    info: enhanceLogging($log.info, context),
                    warn: enhanceLogging($log.warn, context),
                    debug: enhanceLogging($log.debug, context),
                    error: enhanceLogging($log.error, context)
                };
            };

            function enhanceLogging(loggingFunc, context) {
                return function () {
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
            actionService.getActionsInfo().then(function (actions) {
                if (actions) {
                    $rootScope.allActions = actions;
                } else {
                    $rootScope.allActions = [];
                }
            });

            userProfileService.userInfoPromise();
            userProfileService.getUserPermissions();
            //initialize vlocityCards global variable
            $rootScope.vlocityCards = $rootScope.vlocityCards || {};
            //get the Card Framework Configuration
            dataService.getCustomSettings($rootScope.nsPrefix + 'CardFrameworkConfiguration__c').then(
                function (customSettings) {
                    $rootScope.vlocityCards.customSettings = $rootScope.vlocityCards.customSettings || {};
                    if (customSettings && customSettings.length > 0) {
                        var resultSettings = {};
                        //combining custom settings for org, profile and user
                        angular.forEach(customSettings, function (setting) {
                            _.mergeWith(resultSettings, setting, function (objValue, srcValue) {
                                return objValue || srcValue;
                            });
                        });
                        angular.forEach(Object.keys(resultSettings), function (settingName) {
                            if (settingName.substr(0, $rootScope.nsPrefix.length) === $rootScope.nsPrefix) {
                                $rootScope.vlocityCards.customSettings[settingName] = resultSettings[settingName];
                            }
                        });
                    }
                    $log.debug('vlocity settings ', $rootScope.vlocityCards.customSettings);

                },
                function (err) {
                    $log.debug('vlocity settings err ', err);
                    $rootScope.vlocityCards.customSettings = $rootScope.vlocityCards.customSettings || {};
                });

            var showDigestChart = pageService.params.debugMode ? pageService.params.debugMode === 'true' : false;

            if (showDigestChart && typeof showAngularStats !== 'undefined') {
                //add timeout to wait for angular to initiate before showing chart
                $timeout(function () {
                    showAngularStats();
                }, 50);
            }

            var initCards = {
                'TrackingService': 'CardFramework',
                'TrackingEvent': 'initCardFramework',
                'PageParams': pageService.params,
                'ContextId': pageService.params.id || pageService.params.Id
            };

            $log.debug('page params ', pageService.params);
            //check if interaction has already been initiated
            if (pageService.params['vlocity.token']) {
                $rootScope.vlocity = $rootScope.vlocity || {};
                $rootScope.vlocity.CardsSesssionToken = pageService.params['vlocity.token'];
                interactionTracking.initInteraction(angular.extend(initCards, interactionTracking.getDefaultTrackingData()), false, Date.now());
            } else {
                //init tracking here
                var initTracking = {
                    'TrackingService': 'CardFramework',
                    'TrackingEvent': 'initTracking',
                    'Language': navigator.Language,
                    'AppVersion': navigator.appVersion,
                    'Browser': navigator,
                    'PageParams': pageService.params,
                    'ContextId': pageService.params.id || pageService.params.Id
                };
                if (pageService.params.layoutId || pageService.params.layout) {
                    interactionTracking.initInteraction(angular.extend(initTracking, interactionTracking.getDefaultTrackingData()), false, Date.now());
                    interactionTracking.initInteraction(angular.extend(initCards, interactionTracking.getDefaultTrackingData()), false, Date.now());
                }
            }

            // setup of Lightning related code
            // register external handler for message events from iframeresizer
            window.vlocityUniversalCardPage = {
                handleExternalEvent: function (message) {
                    var event;
                    switch (message.type) {
                        case 'cardevent':
                            event = 'vlocity.layout.' + message.layoutName + '.events';
                            break;
                        case 'locationchangeevent':
                            event = 'vlocity.layout.locationchangeevent';
                            break;
                    }
                    if (event) {
                        $rootScope.$apply(function () {
                            $rootScope.$broadcast(event, message.message);
                        });
                    }
                }
            };

            function normalizeProperties(action, nsPrefix) {
                return Object.keys(action).reduce(function (obj, key) {
                    obj[key.replace(nsPrefix, '')] = action[key];
                    return obj;
                }, {});
            }

            _$provide.decorator('performAction', function ($delegate) {
                var performAction = $delegate;

                var wrapper = function (action, actionConfig, obj, data, filter, pickedState) {
                    if ('parentIFrame' in window) {
                        var record = performAction.getSORecord(data, obj);
                        var className = action[$rootScope.nsPrefix + 'InvokeClassName__c'];
                        var classMethod = action[$rootScope.nsPrefix + 'InvokeMethodName__c'];
                        var redirectByContext = actionConfig ? actionConfig.contextRedirectFlag : false;
                        var actionCallback = actionConfig ? actionConfig.showLoadingSpinner : null;
                        var inputMap = actionConfig.inputMap ? actionConfig.inputMap : action.inputMap;
                        var optionsMap = actionConfig.optionsMap ? actionConfig.optionsMap : action.optionsMap;
                        action.contextId = record ? record.Id : (data && data.actionCtxId ? data.actionCtxId : null);

                        var parentMessage = {
                            message: 'actionLauncher:windowopen',
                            actionConfig: normalizeProperties(actionConfig, $rootScope.nsPrefix),
                            action: normalizeProperties(action, $rootScope.nsPrefix),
                            sObjType: performAction.getSObjectType(obj, pickedState),
                            contextId: action.contextId
                        };

                        if (actionCallback) {
                            actionCallback();
                        }

                        if (className && classMethod) {
                            inputMap.contextId = action.contextId;
                            //Invoke VOI methodsss
                            dataService.doGenericInvoke(className, classMethod, angular.toJson(inputMap), angular.toJson(optionsMap)).then(
                                function (data) {
                                    //check if action is a context redirect
                                    if (redirectByContext) {
                                        try {
                                            var device = window.outerWidth > 768 ? 'Web Client' : 'Mobile';
                                            var objId = data.records[0].id || data.records[0].Id;
                                            var objType = data.records[0].objectType || 'All';
                                            var soRecord = {
                                                Id: objId
                                            };
                                            actionService.getActions(objType, soRecord, device, null, null).then(
                                                function (reloadActions) {
                                                    if (reloadActions.length > 0) {
                                                        angular.forEach(reloadActions, function (reloadAction) {
                                                            if (reloadAction.name === action.Name) {
                                                                if (actionCallback) {
                                                                    actionCallback();
                                                                }
                                                                parentIFrame.sendMessage(parentMessage);
                                                                if (actionConfig && actionConfig.extraParams && actionConfig.extraParams.trackKey) {
                                                                    interactionTracking.doneInteraction(actionConfig.extraParams.trackKey);
                                                                }
                                                                return;
                                                            }
                                                        });
                                                    }
                                                });
                                        } catch (e) {
                                            $log.debug('error redirecting action ', e);
                                            //default go to url
                                            parentIFrame.sendMessage(parentMessage);
                                        }
                                    } else {
                                        //otherwise open passed action url
                                        if (actionCallback) {
                                            actionCallback();
                                        }
                                        parentIFrame.sendMessage(parentMessage);
                                        if (actionConfig && actionConfig.extraParams && actionConfig.extraParams.trackKey) {
                                            interactionTracking.doneInteraction(actionConfig.extraParams.trackKey);
                                        }
                                    }

                                },
                                function (err) {
                                    console.error('action err ', err);
                                    if (actionCallback) {
                                        actionCallback();
                                    }
                                    parentIFrame.sendMessage(parentMessage);
                                });
                        } else { //no invocation
                            if (actionCallback) {
                                actionCallback();
                            }
                            parentIFrame.sendMessage(parentMessage);
                            if (actionConfig && actionConfig.extraParams && actionConfig.extraParams.trackKey) {
                                interactionTracking.doneInteraction(actionConfig.extraParams.trackKey);
                            }
                        }
                    } else { //Non-lightning scenario
                        performAction.apply(this, arguments);
                    }
                };

                wrapper.getSORecord = performAction.getSORecord;
                wrapper.getSObjectType = performAction.getSObjectType;

                return wrapper;
            });

        }
    ])
    .run(['$localizable', '$rootScope', 'remoteActions', '$q', function ($localizable, $rootScope, remoteActions, $q) {
        $rootScope.vlocity = ($rootScope.vlocity || {});
        if (!$rootScope.vlocity.userSfLocale) {
            //set default + normalize between locale formats : en_US and en-US
            $rootScope.vlocity.userSfLocale = (navigator.language || navigator.browserLanguage || navigator.systemLanguage).toLowerCase().replace('_', '-');
        }

        if (!remoteActions.getCustomLabels) {
            console.warn('Remote Action for getCustomLabels has not been registered. Will not be able to dynamically fetch labels.');
        }

        // register our global function on the rootScope
        // this will return undefined if there is no resolved value yet
        // this allows for use of Angular's one time binding
        // e.g. {{::$root.vlocity.getCustomLabel('SomeLabel')}}
        $rootScope.vlocity.getCustomLabel = function () {
            var args = Array.prototype.slice.call(arguments);
            args.push(FORCE_SYNC_KEY);
            var result = $localizable.apply(this, args);
            if (!angular.isString(result)) {
                return undefined;
            } else {
                return result;
            }
        };

        $rootScope.vlocity.getCustomLabelSync = function () {
            var args = Array.prototype.slice.call(arguments);
            args.push(FORCE_SYNC_KEY);
            var result = $localizable.apply(this, args);
            args.splice(args.length - 1, 1);
            if (!angular.isString(result)) {
                var aliasArgs = arguments;
                // need to replace tokens
                if (args.length < 2 || !angular.isString(args[1])) {
                    return undefined;
                }
                return args[1].replace(/\{(\d+)\}/g, function (match, number) {
                    number = Number(number);
                    if (number > 0) {
                        if (aliasArgs.length >= number) {
                            return aliasArgs[number + 1] || '';
                        } else {
                            return '';
                        }
                    }
                });
            } else {
                return result;
            }
        };

        $rootScope.vlocity.getCustomLabels = function () {
            var args = Array.prototype.slice.call(arguments);
            return $q.all(
                args.map(function (labelName) {
                    return $q.when($localizable(labelName));
                })
            );
        };
    }])
    .filter('localize', function ($rootScope) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return $rootScope.vlocity.getCustomLabelSync.apply($rootScope.vlocity, args);
        };
    })
    .filter('dynamicLocalize', function ($rootScope) {
        $localizable.$stateful = true;
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return $rootScope.vlocity.getCustomLabel.apply($rootScope.vlocity, args);
        };
    })
    .filter('picker', function ($interpolate) {
        return function () {
            // console.info(arguments);
            var result;
            if (arguments[1] === 'currency' || arguments[1] === 'datetime' ||
                arguments[1] === 'percentage' || arguments[1] === 'phone') {
                result = $interpolate('{{value | ' + arguments[1] + '}}');
                return result({
                    value: arguments[0]
                });
            } else if (arguments[1] === 'date') {
                result = $interpolate('{{value | ' + arguments[1] + ':\"shortDate\"}}');
                return result({
                    value: arguments[0]
                });
            } else if (arguments[1] === 'address') {
                result = $interpolate('{{value | ' + arguments[1] + '}}');
                return result({
                    value: arguments[0]
                });
            } else {
                return arguments[0];
            }

        };
    })

    .filter('getter', function () {
        return function (expr, scope) {
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
                result = _.get(expr, field);
            } catch (e) {

            }
            return result;
        };
    })
    .filter('groupByField', function () {
        return function (data, key) {
            if (data === undefined) {
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
    .filter('resolveCustomField', ['$rootScope', function ($rootScope) {
        return function (input, fieldName, path) {
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

    .filter('customLabel', ['$rootScope', 'remoteActions', '$timeout', '$log', 'dataService', function ($rootScope, remoteActions, $timeout, $log, dataService) {
        $log = $log.getInstance('CardFramework: filter: customLabel');
        //initialazing label cache
        $rootScope.vlocity = ($rootScope.vlocity || {});
        $rootScope.vlocity.customLabels = ($rootScope.vlocity.customLabels || {});
        //setting locale if non-existant
        $rootScope.vlocity.userLanguage = $rootScope.vlocity.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage;
        //normalize between locale formats : en_US and en-US
        $rootScope.vlocity.userLanguage = $rootScope.vlocity.userLanguage.toLowerCase().replace('_', '-');

        function getCustomLabel(labelName) {
            $log.debug('getting label ', labelName, $rootScope.vlocity.userLanguage, $rootScope.vlocity.customLabels[labelName]);
            if ($rootScope.vlocity.customLabels[labelName] && $rootScope.vlocity.customLabels[labelName][$rootScope.vlocity.userLanguage]) {
                return $rootScope.vlocity.customLabels[labelName][$rootScope.vlocity.userLanguage];
            } else {
                $rootScope.vlocity.customLabels[labelName] = {};
            }
            $rootScope.vlocity.customLabels[labelName][$rootScope.vlocity.userLanguage] = labelName; //loading

            try {
                dataService.fetchCustomLabels([labelName], $rootScope.vlocity.userLanguage).then(
                    function (allLabels) {
                        $log.debug('customLabel getAllLabelsPromise ', allLabels);
                        $rootScope.vlocity.customLabels[labelName][$rootScope.vlocity.userLanguage] = allLabels[labelName];
                    },
                    function (error) {
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

    .filter('moment', ['$rootScope', function ($rootScope) {
        return function (dateString, format) {
            var localTime = moment.tz(dateString, $rootScope.vlocity.userTimeZone);
            return moment(localTime).format(format);
        };
    }])

    .filter('datetime', ['$filter', function ($filter) {
        return function (input) {
            if (!input || input === '') {
                return '';
            }
            return $filter('moment')(input, 'lll');
        };
    }])

    .filter('percentage', ['$filter', function ($filter) {
        return function (input, decimals) {
            // we cannot use !input here as that would exclude input === 0 which is legit
            if (input === 'undefined' || input == null || input === '') {
                return '';
            }
            return $filter('number')(input, decimals) + '%';
        };
    }])

    .filter('address', [function () {
        return function (input) {
            // we cannot use !input here as that would exclude input === 0 which is legit
            if (input === 'undefined' || input == null || input === '') {
                return '';
            }
            // check if input type is string and has char { to ensure its an object
            if (typeof input === 'string' && input.charAt(0) === '{') {
                input = JSON.parse(input);
            }
            var address = [
                input.street || input.Street,
                input.city || input.City,
                input.state || input.State,
                input.postalCode || input.PostalCode,
                input.country || input.Country
            ].filter(function (val) {
                return val != null;
            });
            if (address.length === 0 && (input.Latitude || input.latitude)) {
                return 'Longitude: ' + (input.longitude || input.Longitude) + '; Latitude: ' + (input.latitude || input.Latitude);
            }

            return address.join(', ');
        };
    }])

    .filter('uniqueValues', function () {
        return function (items, filterOn, includeEmpty) {

            if (filterOn === false) {
                return items;
            }

            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var hashCheck = {},
                    newItems = [];

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

    .filter('phone', function () {
        return function (phone) {

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

    .filter('currency', ['$rootScope', 'ISO_CURRENCY_INFO', function ($rootScope, ISO_CURRENCY_INFO) {
        return function (amt, isoCurrCode) {
            // we cannot use !amt here as that would exclude amt === 0 which is legit
            if (amt === 'undefined' || amt == null || amt === '') {
                return '';
            }


            //HYB-1573
            if (isoCurrCode && isoCurrCode.isSymbol) {
                return OSREC.CurrencyFormatter.format(amt, {
                    symbol: isoCurrCode.expression
                });
            }

            var isoCurrencyCode = (isoCurrCode && isoCurrCode.expression) || $rootScope.vlocity.userCurrency || 'USD';
            // some org returns userLanguage as en-us and some returns en_US causes issue we have to discuss on that and resolve
            //var userLocale = 'en_US';
            var isoCurrencySymbol = ISO_CURRENCY_INFO[isoCurrencyCode].text;
            var isoCurrencyFormat = ISO_CURRENCY_INFO[isoCurrencyCode].format;
            var isoCurrencyDecimal = ISO_CURRENCY_INFO[isoCurrencyCode].decimal ? ISO_CURRENCY_INFO[isoCurrencyCode].decimal : '.';
            var isoCurrencyGroup = ISO_CURRENCY_INFO[isoCurrencyCode].group ? ISO_CURRENCY_INFO[isoCurrencyCode].group : ',';
            return OSREC.CurrencyFormatter.format(amt, {
                symbol: isoCurrencySymbol,
                pattern: isoCurrencyFormat,
                decimal: isoCurrencyDecimal,
                group: isoCurrencyGroup
            });
        };
    }])

    .constant('API_VERSION', 'v39.0')

    .value('timeStampInSeconds', Math.floor(new Date().getTime() / 1000))

    .service('debugService', function () {

        this.valueOfNameSpacePrefix = function (nsPrefix) {
            return (nsPrefix == '') ? 'no namespace required for this org' : nsPrefix;
        };

        this.displayNameSpacePrefix = function (functionName, nsPrefix) {
            var nsPrefixDisplayName = this.valueOfNameSpacePrefix(nsPrefix);
            //console.log(functionName + '(): nsPrefix: ' + nsPrefixDisplayName);
        };
    })

    .service('networkService', function () {

    })
    .factory('nameSpaceService', function ($q) {
        return {
            getNameSpacePrefix: function () {
                return $q(function (resolve) {
                    resolve(fileNsPrefix());
                });
            }
        };
    })

    .factory('userProfileService', function (remoteActions, $log, $q, $rootScope, dataService) {
        return {
            //getCustomPermissionsForUser
            promiseQueue: [],
            getUserProfile: function () {
                var deferred = $q.defer();
                if (typeof Visualforce !== 'undefined') {
                    if (remoteActions && remoteActions['getUserProfile']) {
                        return remoteActions.getUserProfile().then(
                            function (userp) {
                                return userp;
                            },
                            function (error) {
                                $log.debug('getUserProfile retrieval error: ' + error);
                            });
                    } else {
                        deferred.resolve('pass through');
                        return deferred.promise;
                    }
                } else {
                    return dataService.doGenericInvoke('CardCanvasController', 'getUserProfile').then(
                        function (data) {
                            if (data && data.result) {
                                return data.result;
                            } else {
                                deferred.resolve('pass through');
                                return deferred.promise;
                            }
                        },
                        function (error) {
                            deferred.resolve('pass through');
                            return deferred.promise;
                        });
                }

            },
            getUserPermissions: function () {
                var deferred = $q.defer();
                if (remoteActions && remoteActions['getCustomPermissionsForUser']) {
                    return remoteActions.getCustomPermissionsForUser().then(
                        function (userp) {
                            $rootScope.vlocity.userPermissions = [];
                            angular.forEach(userp, function (permission) {
                                $rootScope.vlocity.userPermissions.push(permission.DeveloperName);
                            });
                            return userp;
                        },
                        function (error) {
                            $log.debug('getCustomPermissionsForUser retrieval error: ' + error);
                        });
                } else {
                    deferred.resolve('pass through');
                    return deferred.promise;
                }

            },
            userInfoPromise: function () {
                var deferred = $q.defer();
                this.promiseQueue.push(deferred);

                //check if userLocale is available
                if ($rootScope.vlocity.userId) {
                    deferred.resolve();
                } else if (this.promiseQueue.length <= 1) {

                    var self = this;
                    this.getUserProfile().then(
                        function (data) {
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

                            self.promiseQueue.forEach(function (deferred) {
                                deferred.resolve(data);
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

                return deferred.promise;
            }
        };
    })

    .factory('metaDataService', function ($log) {
        $log = $log.getInstance('CardFramework: metaDataService');
        return {

            getGlobalDescribeTk: function (forcetkClient) {

                //$log.debug('calling actionService: getGlobalDescribe()');

                return forcetkClient.describeGlobal(
                    function (result) {
                        var sObjects = result.sobjects;
                        //$log.debug('getGlobalDescribe completed with sObjects:');
                        //$log.debug(sObjects);
                        return sObjects;
                    },
                    function (error) {
                        $log.error('getGlobalDescribe retrieval error: ' + error);
                    }
                );

            },

            getDescribeTk: function (sObjectType, forcetkClient) {

                //console.log('calling actionService: getDescribe()');

                return forcetkClient.describe(sObjectType,
                    function (result) {
                        var sObjectTypeFields = result.fields;
                        return sObjectTypeFields;
                    },
                    function (error) {
                        $log.debug('getDescribe retrieval error: ' + error);
                    }
                );

            }

        };

    })

    .factory('actionService', function ($q, remoteActions, force, nameSpaceService, debugService, $log, $rootScope, dataService) {

        var QueryString = function () {
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
                    var arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
                    queryString[pair[0]] = arr;
                    // If third or later entry with this name
                } else {
                    queryString[pair[0]].push(decodeURIComponent(pair[1]));
                }
            }
            return queryString;
        }();


        var self = {
            getActionsInfo: function (ignoreCache) {
                /**
                 * getActionsInfo will retrieve all 'active' vlocity actions just once.
                 * Subsequent calls will get actions from the cached data unless the 'ignoreCache' flag is set
                 */
                var cachedActions = JSON.parse(sessionStorage.getItem('vlocity.allActions')) || null;
                if (ignoreCache !== true && !$rootScope.isReloadAction && cachedActions != null) {
                    return $q.when(cachedActions);
                }

                // Create the deffered object
                return $q(function (resolve, reject) {
                    if (remoteActions != null && remoteActions['getActionsInfo']) {
                        remoteActions.getActionsInfo().then(
                            function (actions) {
                                sessionStorage.setItem('vlocity.allActions', JSON.stringify(actions));
                                $rootScope.isReloadAction = false;
                                cachedActions = actions;
                                resolve(cachedActions);
                            },
                            function (error) {
                                $rootScope.isReloadAction = false;
                                $log.debug('getActionsInfo retrieval error:' + error);
                                cachedActions = [];
                                reject(new Error('getActionsInfo retrieval error: ' + error));
                            });

                    } else {
                        //check if the user is authenticated and that oauth has started
                        //getOauth will return undefined if force.init hasn't been called
                        if (!force.isAuthenticated() && force.getOAuth()) {
                            cacheActions = undefined;
                            return $q.when([]);
                        }
                        //This is used when remoteactions are not available eg: ionic apps/ mobile apps
                        var payload = {
                            sClassName: "CardCanvasController",
                            sMethodName: "getActionsInfo",
                            input: '{}',
                            options: '{}'
                        };
                        dataService.doGenericInvoke(payload.sClassName, payload.sMethodName, payload.input, payload.options).then(
                            function (data) {
                                //$log.debug('getActionsInfo records: ', result);
                                $rootScope.isReloadAction = false;
                                cachedActions = data.result;
                                sessionStorage.setItem('vlocity.allActions', JSON.stringify(cachedActions));
                                resolve(cachedActions);
                            },
                            function (error) {
                                $rootScope.isReloadAction = false;
                                $log.debug('getActionsInfo retrieval error: ' + error);
                                //TODO: required for out -  check for other scenarios
                                cachedActions = null;
                                reject(new Error('getActionsInfo retrieval error: ' + error));
                            }
                        );
                    }
                });
            },

            getActionsInfoAsMap: function () {
                return self.getActionsInfo()
                    .then(function (actions) {
                        return actions.reduce(function (obj, action) {
                            obj[action.Name] = action;
                            // Maintain the displayName and vlocityIcon as it's used in templates
                            // as part of old getActions implemenetation
                            action['displayName'] = action[$rootScope.nsPrefix + 'DisplayLabel__c'];
                            action['vlocityIcon'] = action[$rootScope.nsPrefix + 'VlocityIcon__c'];
                            return obj;
                        }, {});
                    }, function (err) {
                        $log.debug('getActionsInfoAsMap error ', err);
                        return err;
                    });
            },

            getActions: function (objType, soRecord, displayOn, linkType, forcetkClient, $log) {
                var ctxId = soRecord ? soRecord.Id : QueryString.Id;
                ctxId = ctxId ? ctxId : null; //nulling works better than undefined for salesforce

                if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getActions']) {

                    return remoteActions.getActions(objType, ctxId, displayOn, linkType).then(
                        function (actionsJSON) {
                            return JSON.parse(actionsJSON);
                        },
                        function (error) {
                            $log.debug('getActionsTk retrieval error: ' + error);
                        });

                } else {

                    return nameSpaceService.getNameSpacePrefix().then(
                        function (nsPrefix) {

                            debugService.displayNameSpacePrefix('getActionsTk', nsPrefix);
                            var apexRestUrlNameSpacePrefix = (nsPrefix === '') ? '' : '/' + nsPrefix.replace('__', '');
                            return force.apexrest({
                                path: apexRestUrlNameSpacePrefix + '/v1/action/action',
                                params: {
                                    objType: objType,
                                    sFilterContextId: ctxId,
                                    sDisplayOn: displayOn,
                                    sLinkType: linkType
                                }
                            }).then(
                                function (actions) {
                                    actions = actions.data ? actions.data : actions;
                                    return actions;
                                },
                                function (error) {
                                    $log.debug('getActionsTk retrieval error: ' + error);
                                    $log.debug(error);
                                }, 'GET'
                            );

                        },
                        function (err) {
                            $log.debug('error retrieving nsPrefix ', err);
                        });

                }

            },

            getActionsByName: function (objType, soRecord, displayOn, linkType, forcetkClient, $log, actionNames) {
                // In some API's, Id is now a jsonField object with properties label and value.  If so, Id.value is the contextId.  If not, then Id is the contextId
                var ctxId = soRecord && soRecord.Id ? (angular.isObject(soRecord.Id) ? soRecord.Id.value : soRecord.Id) : QueryString.Id;
                ctxId = ctxId ? ctxId : null; //nulling works better than undefined for salesforce

                if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getActionDetailsByName']) {

                    return remoteActions.getActionDetailsByName(objType, ctxId, displayOn, linkType, actionNames).then(
                        function (actionsJSON) {
                            return JSON.parse(actionsJSON);
                        },
                        function (error) {
                            $log.debug('getActionsByName retrieval error: ' + error);
                        });

                } else {

                    return nameSpaceService.getNameSpacePrefix().then(
                        function (nsPrefix) {

                            debugService.displayNameSpacePrefix('getActionsByName', nsPrefix);
                            var apexRestUrlNameSpacePrefix = (nsPrefix === '') ? '' : '/' + nsPrefix.replace('__', '');
                            return force.apexrest({
                                path: apexRestUrlNameSpacePrefix + '/v1/action/actions',
                                params: {
                                    objType: objType,
                                    sFilterContextId: ctxId,
                                    sDisplayOn: displayOn,
                                    sLinkType: linkType,
                                    actionName: actionNames
                                }
                            }).then(
                                function (actions) {
                                    actions = actions.data ? actions.data : actions;
                                    return actions;
                                },
                                function (error) {
                                    $log.debug('getActionsByName retrieval error: ' + error);
                                    $log.debug(error);
                                    return error;
                                }, 'GET'
                            );

                        },
                        function (error) {
                            $log.debug('getNameSpacePrefix retrieval error: ' + error);
                        });
                }

            }

        };

        return self;

    })

    .factory('dataService', function ($rootScope, remoteActions, force, nameSpaceService, debugService, pageService, $interpolate, $log, $q, $httpParamSerializer, cometd, $timeout) {
        $log = $log.getInstance ? $log.getInstance('CardFramework: dataService') : $log;

        var doAsyncInvoke = function (className, methodName, inputMap, optionsMap, asyncDataMap, stagingObjectId, deferred) {
            deferred = deferred ? deferred : $q.defer();
            remoteActions.doAsyncInvoke(className, methodName, inputMap, optionsMap, stagingObjectId).then(
                function (records) {
                    if (records.result === 'WAIT') {
                        $timeout(function () {
                            doAsyncInvoke(className, methodName, inputMap, optionsMap, asyncDataMap, records.responseId, deferred);
                        }, asyncDataMap.asyncTimeout);
                    } else {
                        deferred.resolve(records.result);
                    }
                },
                function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        return {
            promiseQueue: {},
            getRecords: function (queryStr) {
                // cardQuery = $interpolate(cardQuery)(pageService);
                //$log.debug(cardQuery);

                if (queryStr && typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getDatasourceQuery']) {

                    return remoteActions.getDatasourceQuery(queryStr).then(
                        function (records) {
                            var records = JSON.parse(records);
                            $log.debug('getRecords completed: ', records);
                            return records;
                        },

                        function (error) {
                            $log.error('getRecords retrieval error: ', error);
                            return error; // this is needed for the Card Designer to display SOQL error
                        });

                } else if (queryStr) {

                    return force.query(cardQuery).then(
                        function (data) {
                            data = data.data ? data.data : data;
                            var records = data.records;
                            $log.debug('getRecords: records retrieved: ', records);
                            return records;
                        },

                        function (error) {
                            $log.error('getRecords retrieval error: ', error);
                            return error; // this is needed for the Card Designer to display SOQL error
                        });

                } else {
                    return [];
                }

            },

            getSearchRecords: function (searchStr) {
                var cardSearchQuery = searchStr ? searchStr : 'FIND {a} IN NAME FIELDS RETURNING Account(Name) LIMIT 2';
                // cardQuery = $interpolate(cardQuery)(pageService);
                //$log.debug(cardQuery);

                if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getSearchQuery']) {

                    return remoteActions.getSearchQuery(searchStr).then(
                        function (records) {
                            var records = JSON.parse(records);
                            $log.debug('getRecords completed: ', records);
                            return records;
                        },

                        function (error) {
                            $log.error('getRecords retrieval error: ', error);
                            return error; // this is needed for the Card Designer to display SOQL error
                        });

                } else {

                    return force.search(cardSearchQuery).then(
                        function (data) {
                            data = data.data ? data.data : data;
                            var records = data.searchRecords;
                            $log.debug('getRecords: records retrieved: ', records);
                            return records;
                        },

                        function (error) {
                            $log.error('getRecords retrieval error: ', error);
                            return error; // this is needed for the Card Designer to display SOQL error
                        });

                }

            },

            getSubscription: function (topic, replayEnabled, callback) {
                var replayExtension = new root.org.cometd.ReplayExtension();
                var replayAll = 'cometd_replay_all';
                var getAllReply = -2; // -2 gets all data from past 24 hours and -1 will get the data pushed after subscription
                console.log('getSubscription topic ', topic, 'callback ', callback);
                if ($rootScope.readyToSubscribe) {
                    $rootScope.isSubscribed = $rootScope.isSubscribed || {};
                    if (replayEnabled) {
                        replayExtension.setChannel(topic);
                        replayExtension.setReplay(getAllReply);
                        replayExtension.setExtensionEnabled($rootScope.readyToSubscribe);
                        if (cometd.getExtension(replayAll) != null) {
                            cometd.unregisterExtension(replayAll, replayExtension);
                        };
                        cometd.registerExtension(replayAll, replayExtension);
                    }
                    cometd.batch(function () {
                        if (!$rootScope.isSubscribed[topic]) {
                            $rootScope.isSubscribed[topic] = cometd.subscribe(topic, callback);
                        }
                    });
                }
            },

            cancelSubscription: function (topic, callback) {
                var deferred = $q.defer();
                if ($rootScope.isSubscribed && $rootScope.isSubscribed[topic]) {
                    cometd.unsubscribe($rootScope.isSubscribed[topic], null, function (data) {
                        deferred.resolve('topic ' + topic + ' unsubscribed ', data);
                    });
                }
                return deferred.promise;
            },

            getDataRaptorBundle: function (bundle, ctxId, forcetkClient, inputMap) {
                var myService = this;
                return nameSpaceService.getNameSpacePrefix().then(
                    function (nsPrefix) {

                        debugService.displayNameSpacePrefix('getDataRaptorBundle', nsPrefix);

                        if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getDataViaDataRaptor']) {
                            return remoteActions.getDataViaDataRaptor(inputMap, bundle).then(
                                function (result) {
                                    $log.debug('getDataRaptorBundle completed: ', result);
                                    result = JSON.parse(result);
                                    result = result instanceof Array && result.length === 1 ? result[0] : result;
                                    return result;
                                },

                                function (error) {
                                    $log.error('getDataRaptorBundle retrieval error: ', error);
                                    return error; // this is needed for the Card Designer to display SOQL error
                                });

                        } else {

                            var apexRestUrlNameSpacePrefix = (nsPrefix == '') ? '' : '/' + nsPrefix.replace('__', '');
                            var apexRestUrl = apexRestUrlNameSpacePrefix + '/v2/DataRaptor/' + bundle + '/?' + $httpParamSerializer(inputMap);
                            return myService.getApexRest(apexRestUrl, 'GET', null).then(
                                function (records) {
                                    //$log.debug('getDataRaptorBundle records: ', result);
                                    return records;
                                },
                                function (error) {
                                    $log.debug('getDataRaptorBundle retrieval error: ', error);
                                    return error;
                                }
                            );
                        }
                    },
                    function (error) {
                        $log.debug('getNameSpacePrefix retrieval error: ' + error);
                    });
            },

            doGenericInvoke: function (className, methodName, inputMap, optionsMap, asyncDataMap) {
                $log.debug('calling dataService: doGenericInvoke()', className, methodName);
                var myService = this;
                return nameSpaceService.getNameSpacePrefix().then(
                    function (nsPrefix) {
                        inputMap = inputMap ? inputMap : "{}";
                        optionsMap = optionsMap ? optionsMap : "{}";

                        if (asyncDataMap && asyncDataMap.isAsync && typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['doAsyncInvoke']) {
                            return doAsyncInvoke(className, methodName, inputMap, optionsMap, asyncDataMap, null).then(
                                function (records) {
                                    var records = JSON.parse(records);
                                    $log.debug('doAsyncInvoke completed for ' + methodName + ': ', records);
                                    return records;
                                },
                                function (error) {
                                    $log.debug('doAsyncInvoke error: ' + error);
                                    return error; // this is needed for the Card Designer to the error
                                });
                        } else if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['doGenericInvoke']) {
                            return remoteActions.doGenericInvoke(className, methodName, inputMap, optionsMap).then(
                                function (records) {
                                    var records = JSON.parse(records);
                                    $log.debug('doGenericInvoke completed for ' + methodName + ': ', records);
                                    return records;
                                },

                                function (error) {
                                    $log.debug('doGenericInvoke error: ' + error);
                                    return error; // this is needed for the Card Designer to the error
                                });

                        } else {
                            var apexRestUrlNameSpacePrefix = (nsPrefix == '') ? '' : '/' + nsPrefix.replace('__', '');
                            var payload = {
                                sClassName: className,
                                sMethodName: methodName,
                                input: inputMap,
                                options: typeof optionsMap === 'object' ? JSON.stringify(optionsMap) : optionsMap
                            };
                            let classMethodPath = encodeURI(className + '/' + methodName);

                            payload = JSON.stringify(payload);

                            return myService.getApexRest(apexRestUrlNameSpacePrefix + '/v1/invoke/' + classMethodPath, 'POST', payload).then(function (records) {
                                    $log.debug('doGenericInvoke completed for ' + methodName + ': ', records);
                                    return records;
                                },
                                function (error) {
                                    $log.debug('doGenericInvoke error: ' + error);
                                    return error; // this is needed for the Card Designer to the error
                                });
                        }

                    },
                    function (error) {
                        $log.debug('getNameSpacePrefix retrieval error: ', error);
                    });
            },
            doNamedCredentialCallout: function (requestMap) {
                $log.debug('calling dataService: doNamedCredentialCallout()', requestMap);

                //returning rejected promise when datasource is disabled
                var deferred = $q.defer();
                if ($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'DisableDatasourceREST__c']) {
                    deferred.reject('DataRaptor not enabled');
                    return deferred.promise;
                }

                return nameSpaceService.getNameSpacePrefix().then(
                    function (nsPrefix) {

                        if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['doNamedCredentialCallout']) {
                            return remoteActions.doNamedCredentialCallout(requestMap).then(
                                function (records) {
                                    try {
                                        var records = JSON.parse(records);
                                        $log.debug('doNamedCredentialCallout completed: ', records);
                                        return records;
                                    } catch (e) {
                                        $log.debug('error parsing response ', e);
                                    }
                                    return records;
                                },

                                function (error) {
                                    $log.debug('doNamedCredentialCallout error: ', error);
                                    return error; // this is needed for the Card Designer to the error
                                });

                        } else {
                            $log.debug('doNamedCredentialCallout not supported outside of salesforce');
                        }

                    },
                    function (error) {
                        $log.debug('getNameSpacePrefix retrieval error: ' + error);
                    });
            },

            getAccountById: function (id) {
                //$log.debug('calling dataService: getAccountById()');

                if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getAccountById']) {

                    return remoteActions.getAccountById(id).then(
                        function (account) {
                            var account = JSON.parse(account);
                            $log.debug('getAccountById completed: ', account);
                            return account;
                        },

                        function (error) {
                            $log.debug('getAccountById retrieval error: ' + error);
                        });

                } else {
                    return force.retrieve('Account', id, 'Id, Name, Phone, PhotoURL, Website').then(
                        function (account) {
                            //$log.debug('getAccountById(): account: ' + account);
                            account = account.data ? account.data : account;
                            return account;
                        },

                        function (error) {
                            $log.debug('getAccountById retrieval error: ' + error);
                        });
                }
            },

            getCustomSettings: function (customSettingsName) {
                // Create the deferred object
                var deferred = $q.defer();
                if (typeof (this.promiseQueue[customSettingsName]) !== "undefined") {
                    this.promiseQueue[customSettingsName].push(deferred);
                } else {
                    this.promiseQueue[customSettingsName] = [deferred];
                }

                var myService = this;
                if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getCustomSettings'] && this.promiseQueue[customSettingsName].length <= 1) {

                    remoteActions.getCustomSettings(customSettingsName).then(
                        function (result) {
                            var customSettings = JSON.parse(result);
                            $log.debug('getCustomSettings completed: ', customSettings);
                            //deferred.resolve(customSettings);
                            myService.promiseQueue[customSettingsName].forEach(function (deferred) {
                                deferred.resolve(customSettings);
                            });
                            myService.promiseQueue[customSettingsName] = [];
                        },

                        function (error) {
                            $log.debug('getCustomSettings retrieval error: ', error);
                            deferred.reject(error);
                        });

                } else if (typeof remoteActions === 'undefined' || remoteActions == null) {
                    var genericInvokeMap = {
                        'className': 'CardCanvasController',
                        'methodName': 'getCustomSettings',
                        'inputMap': {
                            'customSettingsName': customSettingsName
                        }
                    };
                    return myService.doGenericInvoke(genericInvokeMap.className, genericInvokeMap.methodName, JSON.stringify(genericInvokeMap.inputMap)).then(function (data) {
                            $log.debug('getCustomSettings doGenericInvoke completed for ', data);
                            if (data.result) {
                                var customSettings = JSON.parse(data.result);
                                deferred.resolve(customSettings);
                                return customSettings;
                            } else {
                                deferred.reject(data);
                            }
                        },
                        function (error) {
                            $log.debug('getCustomSettings doGenericInvoke error: ', error);
                            deferred.reject(error);
                        });
                }

                return deferred.promise;
            },

            fetchCustomLabels: function (labelNames, language) {
                // Create the deferred object
                var deferred = $q.defer();

                $rootScope.vlocity = ($rootScope.vlocity || {});
                $rootScope.vlocity.userLanguage = $rootScope.vlocity.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage;
                //normalize between locale formats : en_US and en-us
                $rootScope.vlocity.userLanguage = $rootScope.vlocity.userLanguage.toLowerCase().replace('_', '-');
                //if no language passed to function use user locale
                language = language || $rootScope.vlocity.userLanguage;
                $rootScope.vlocity.customLabels = ($rootScope.vlocity.customLabels || {});

                $log.debug('custom labels being fetched ', language, labelNames);
                var cachedLabels = JSON.parse(sessionStorage.getItem('vlocity.customLabels')) || {};
                //set the local app cache
                _.assign($rootScope.vlocity.customLabels, cachedLabels);
                $log.debug('cached labels ', JSON.parse(sessionStorage.getItem('vlocity.customLabels')));

                angular.forEach(Object.keys(cachedLabels), function (labelKey) {
                    var index = labelNames.indexOf(labelKey);
                    if (index != -1) {
                        //check that it also includes the language locale
                        if (labelNames[index][language]) {
                            //remove cached label name from query list
                            labelNames.splice(index, 1);
                        } else {
                            $log.debug('label cached but not in right language ', language, labelNames[index]);
                        }
                    }
                });
                if (labelNames.length > 0) {
                    //APEX REMOTE
                    if (typeof remoteActions !== 'undefined' && remoteActions !== null && remoteActions['getCustomLabels']) {
                        remoteActions.getCustomLabels(labelNames, language).then(
                            function (allLabels) {
                                var labelsMap = JSON.parse(allLabels);
                                $log.debug('getCustomLabels RESULTS: ', labelsMap);
                                if (labelsMap.messages && labelsMap.messages.length > 0) {
                                    $log.debug('getCustomLabels REMOTE error: ', labelsMap.messages);
                                    deferred.reject(labelsMap.messages);
                                } else {
                                    $rootScope.vlocity.userLanguage = labelsMap.data.language.toLowerCase().replace('_', '-');
                                    for (var key in labelsMap.data) {
                                        if (key != 'language') {
                                            $rootScope.vlocity.customLabels[key] = $rootScope.vlocity.customLabels[key] || {};
                                            $rootScope.vlocity.customLabels[key][$rootScope.vlocity.userLanguage] = labelsMap.data[key];
                                        }
                                    }
                                    sessionStorage.setItem('vlocity.customLabels', JSON.stringify($rootScope.vlocity.customLabels));
                                    deferred.resolve(labelsMap.data);
                                }
                            },
                            function (error) {
                                $log.debug('getCustomLabels REMOTE error: ', error);
                            }
                        );

                    } else if (force && force.apexrest) { //REST
                        nameSpaceService.getNameSpacePrefix().then(
                            function (nsPrefix) {

                                debugService.displayNameSpacePrefix('getCustomLabels', nsPrefix);

                                var apexRestUrlBase = '/v1/usercustomlabels?names=' + labelNames.join(',') + '&language=' + language;

                                var apexRestUrlNameSpacePrefix = (nsPrefix == '') ? '' : '/' + nsPrefix.replace('__', '');

                                var apexRestUrl = apexRestUrlNameSpacePrefix + apexRestUrlBase;

                                force.apexrest({
                                    path: apexRestUrl
                                }).then(
                                    function (labelsMap) {
                                        $log.debug('getCustomLabels RESULTS: ', labelsMap);
                                        var labelsDataMap = labelsMap.data.data || labelsMap.data;
                                        if (labelsDataMap) {
                                            $rootScope.vlocity.userLanguage = $rootScope.vlocity.userLanguage.replace('_', '-');
                                            for (var key in labelsDataMap) {
                                                if (key != 'language') {
                                                    $rootScope.vlocity.customLabels[key] = $rootScope.vlocity.customLabels[key] || {};
                                                    $rootScope.vlocity.customLabels[key][$rootScope.vlocity.userLanguage] = labelsDataMap[key];
                                                }
                                            }
                                        }
                                        if (labelsDataMap.messages && labelsDataMap.messages.length > 0) {
                                            $log.debug('getCustomLabels REST error: ' + labelsDataMap.messages);
                                        } else {
                                            sessionStorage.setItem('vlocity.customLabels', JSON.stringify($rootScope.vlocity.customLabels));
                                        }
                                        deferred.resolve(labelsDataMap);
                                    },
                                    function (error) {
                                        $log.error('getCustomLabels retrieval error: ' + error);
                                        deferred.reject(error);
                                    }
                                );
                            },
                            function (error) {
                                $log.debug('getNameSpacePrefix retrieval error: ' + error);
                            });
                    } else {
                        var myService = this;
                        nameSpaceService.getNameSpacePrefix().then(
                            function (nsPrefix) {
                                var apexRestUrlNameSpacePrefix = (nsPrefix == '') ? '' : '/' + nsPrefix.replace('__', '');
                                var apexRestUrlBase = apexRestUrlNameSpacePrefix + '/v1/usercustomlabels?names=' + labelNames.join(',') + '&language=' + language;
                                myService.getApexRest(apexRestUrlBase, 'GET', null).then(
                                    function (labelsMap) {
                                        //var labelsMap = JSON.parse(allLabels);
                                        $log.debug('getCustomLabels FORCENG RESULTS: ', labelsMap);
                                        var labelsDataMap = labelsMap.data;
                                        if (labelsDataMap) {
                                            $rootScope.vlocity.userLanguage = labelsDataMap.language.toLowerCase().replace('_', '-');
                                            for (var key in labelsDataMap) {
                                                if (key != 'language') {
                                                    $rootScope.vlocity.customLabels[key] = $rootScope.vlocity.customLabels[key] || {};
                                                    $rootScope.vlocity.customLabels[key][$rootScope.vlocity.userLanguage] = labelsDataMap[key];
                                                }
                                            }
                                        }
                                        if (labelsDataMap && labelsDataMap.messages && labelsDataMap.messages.length > 0) {
                                            $log.debug('getCustomLabels FORCENG REST error: ', labelsDataMap.messages);
                                        } else {
                                            sessionStorage.setItem('vlocity.customLabels', JSON.stringify($rootScope.vlocity.customLabels));
                                        }
                                        deferred.resolve(labelsDataMap);
                                    },
                                    function (error) {
                                        $log.error('getCustomLabels FORCENG retrieval error: ' + error);
                                        deferred.reject(error);
                                    });
                            },
                            function (error) {
                                $log.debug('getNameSpacePrefix retrieval error: ' + error);
                            });
                    }
                } else {
                    $log.debug('getCustomLabels: labels already in cache.');
                    deferred.resolve($rootScope.vlocity.customLabels);
                }
                return deferred.promise;
            },

            getConsoleCardsAction: function (objType, filterContextId) {
                if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['getConsoleCardsAction']) {

                    return remoteActions.getConsoleCardsAction(objType, filterContextId).then(
                        function (consoleCardsActionJSON) {
                            var consoleCardsAction = JSON.parse(consoleCardsActionJSON);
                            $log.debug('getConsoleCardsAction: ', consoleCardsAction);
                            // var actions = [];
                            // actions.push(consoleCardsAction);
                            return consoleCardsAction;
                        },
                        function (error) {
                            $log.debug('getConsoleCardsAction retrieval error: ' + error);
                        });

                } else {

                    return nameSpaceService.getNameSpacePrefix().then(
                        function (nsPrefix) {

                            debugService.displayNameSpacePrefix('getConsoleCardsAction', nsPrefix);

                            var apexRestUrlBase = '/v1/action?objType=' + objType + '&sFilterContextId=' + filterContextId + '&sDisplayOn=' + 'Web%20Client' + '&sLinkType=' + 'Other';

                            var apexRestUrlNameSpacePrefix = (nsPrefix == '') ? '' : '/' + nsPrefix.replace('__', '');

                            var apexRestUrl = apexRestUrlNameSpacePrefix + apexRestUrlBase;

                            //$log.debug('getConsoleCardsAction(): apexRestUrl: ' + apexRestUrl);

                            return force.apexrest({
                                path: apexRestUrl
                            }).then(
                                function (actions) {
                                    var consoleCardsAction;
                                    actions = actions.data ? actions.data : actions;
                                    for (var i = 0; i < actions.length; i++) {
                                        if (actions[i].name != null && actions[i].name == 'ConsoleCards') {
                                            consoleCardsAction = actions[i];
                                            break;
                                        }
                                    }

                                    //$log.debug('getConsoleCardsAction action: ', consoleCardsAction);
                                    return consoleCardsAction;

                                },
                                function (error) {
                                    $log.error('getConsoleCardsAction retrieval error: ' + error);
                                }, 'GET'
                            );

                        },
                        function (error) {
                            $log.debug('getNameSpacePrefix retrieval error: ' + error);
                        });

                }

            },

            getApexRest: function (endpoint, method, payload) {
                console.log('getApexRest ', endpoint);
                return nameSpaceService.getNameSpacePrefix().then(
                    function (nsPrefix) {

                        debugService.displayNameSpacePrefix('getApexRest', nsPrefix);

                        var apexRestUrlBase = endpoint;

                        var apexRestUrl = apexRestUrlBase;

                        // for desktop use forceTk
                        if (typeof Visualforce !== 'undefined') {

                            var apexRestUrlSubUrl = apexRestUrl.indexOf('/services/apexrest') === 0 ? apexRestUrl : '/services/apexrest' + apexRestUrl;
                            var mydomainUrl = window.mydomainUrl ? window.mydomainUrl : "";
                            var apexRestFullUrl = mydomainUrl + apexRestUrlSubUrl;

                            return force.apexrest({
                                path: apexRestFullUrl,
                                method: method,
                                data: payload
                            }).then(
                                function (result) {
                                    //$log.debug('getConsoleCardsAction action: ', actions[0]);
                                    result = result.data ? result.data : result;
                                    return result;

                                },
                                function (error) {
                                    console.info('getApexRest error: ', error);
                                }
                            );

                            // for Mobile Hybrid Ionic use forceng
                        } else {

                            //check if force.isAuthenticated()
                            if (apexRestUrlBase.charAt(0) !== '/') {
                                apexRestUrlBase = '/' + apexRestUrlBase;
                            }

                            if (apexRestUrlBase.substr(0, 18) !== '/services/apexrest') {
                                apexRestUrlBase = '/services/apexrest' + apexRestUrlBase;
                            }
                            console.log('force request ', apexRestUrlBase, method, payload);
                            return force.request({
                                path: apexRestUrlBase,
                                method: method,
                                data: payload
                            }).then(

                                function (result) {
                                    result = result.data ? result.data : result;
                                    return result;
                                },

                                function (error) {
                                    console.error('getApexRest retrieval error: ', error);
                                });

                        }

                    },
                    function (error) {
                        $log.debug('getNameSpacePrefix retrieval error: ' + error);
                    });
            },

            getEncryptedDatasource: function (objId, scope) {
                var myService = this;
                if (typeof remoteActions != 'undefined' && remoteActions != null && remoteActions['doEncryptedDatasource']) {

                    return remoteActions.doEncryptedDatasource(objId, scope).then(
                        function (records) {
                            var records = JSON.parse(records);
                            $log.debug('doEncryptedDatasource: ', records);
                            // var actions = [];
                            // actions.push(consoleCardsAction);
                            return records;
                        },
                        function (error) {
                            $log.debug('doEncryptedDatasource retrieval error: ' + error);
                        });

                } else {
                    var genericInvokeMap = {
                        'className': 'CardCanvasController',
                        'methodName': 'doEncryptedDatasource',
                        'inputMap': {
                            'objId': objId,
                            'scope': scope
                        }
                    };
                    return myService.doGenericInvoke(genericInvokeMap.className, genericInvokeMap.methodName, JSON.stringify(genericInvokeMap.inputMap)).then(function (data) {
                            $log.debug('doEncryptedDatasource doGenericInvoke completed for ', data);
                            if (data.result) {
                                var records = JSON.parse(data.result);
                                //deferred.resolve(customSettings);
                                return records;
                            } else {
                                //deferred.reject(data);
                            }
                        },
                        function (error) {
                            $log.debug('doEncryptedDatasource doGenericInvoke error: ', error);
                            //deferred.reject(error);
                        });
                }

            }

        };

    })

    .factory('relationshipMgmtService', function (force, nameSpaceService, debugService, $log) {
        $log = $log.getInstance('CardFramework: relationshipMgmtService');
        return {

            getStoriesTk: function (objectId, forcetkClient, numberOfDays, storyType) {
                //$log.debug('calling relationshipMgmtService: getStories()');

                return nameSpaceService.getNameSpacePrefix().then(
                    function (nsPrefix) {

                        debugService.displayNameSpacePrefix('getStoriesTk', nsPrefix);

                        var apexRestUrlNameSpacePrefix = (nsPrefix == '') ? '' : '/' + nsPrefix.replace('__', '');
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
                        return force.apexrest({
                            path: apexRestUrl
                        }).then(
                            function (result) {
                                //$log.debug('getStoriesTk stories: ', result);
                                //return result['Stories'];
                                result = result.data ? result.data : result;
                                return result;
                            },
                            function (error) {
                                console.info('getStoriesTk retrieval error: ' + error);
                            }, 'GET'
                        );

                    },
                    function (error) {
                        $log.debug('getNameSpacePrefix retrieval error: ' + error);
                    });

            },

            getAttributesTk: function (objectId, forcetkClient) {
                //$log.debug('calling relationshipMgmtService: getAttributesTk()');

                return nameSpaceService.getNameSpacePrefix().then(
                    function (nsPrefix) {

                        debugService.displayNameSpacePrefix('getAttributesTk', nsPrefix);

                        var apexRestUrlNameSpacePrefix = (nsPrefix === '') ? '' : '/' + nsPrefix.replace('__', '');

                        return force.apexrest({
                            path: apexRestUrlNameSpacePrefix + '/v1/segment/assignments/' + objectId
                        }).then(
                            function (result) {
                                //$log.debug('getAttributesTk stories: ', result);
                                //return result['Stories'];
                                result = result.data ? result.data : result;
                                return result;
                            },
                            function (error) {
                                console.info('getAttributesTk retrieval error: ' + error);
                            }, 'GET'
                        );

                    },
                    function (error) {
                        $log.debug('getNameSpacePrefix retrieval error: ' + error);
                    });

            }
        };

    })

    .factory('dataSourceService', function (dataService, $interpolate, $localizable, $q, $http, $log, $timeout, $rootScope, userProfileService, $filter, interactionTracking, configService) {

        function handleQuery(datasource, scope, deferred, errorContainer) {

            if ($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'DisableDatasourceQuery__c']) {
                deferred.reject('SOQL Query not enabled');
            }

            if (datasource.value && datasource.value.query) {
                query = datasource.value.query;
                query = $interpolate(query)(scope);
                dataService.getRecords(query).then(
                    function (records) {
                        $log.debug('datasourceService ', records);
                        if (records && records.type === 'exception') {
                            //sfdc returned with a query error
                            errorContainer.sourceType = datasource.type;
                            errorContainer.data = records;
                            errorContainer.message = records.message; //when there is an error it shows on the records
                            deferred.reject(errorContainer);
                        }
                        //otherwise its all good.
                        deferred.resolve(records);
                        //this is to end the timed interaction tracking which got init inside getData
                        interactionTracking.doneInteraction(scope && scope.trackKey);


                    },
                    function (err) {
                        deferred.reject(err);
                    }
                );
            } else {
                //is encrypted
                handleEncrypted(datasource, scope, deferred, errorContainer);
            }



        }

        function handleEncrypted(datasource, scope, deferred, errorContainer) {

            var objId = scope.objId;
            var params = null;
            var dataSourceVal = datasource.value;

            if (dataSourceVal && dataSourceVal.jsonMap) {
                params = $interpolate(dataSourceVal.jsonMap)(scope);
            }
            if (dataSourceVal && dataSourceVal.search) {
                params = params ? JSON.parse(params) : {};
                params.vlocityUpdatedSearch = dataSourceVal.search;
                params = JSON.stringify(params);
            }

            dataService.getEncryptedDatasource(objId, params).then(
                function (records) {
                    $log.debug('datasourceService ', records);
                    if (records && records.type === 'exception') {
                        //sfdc returned with a query error
                        errorContainer.sourceType = datasource.type;
                        errorContainer.data = records;
                        errorContainer.message = records.message; //when there is an error it shows on the records
                        deferred.reject(errorContainer);
                    }

                    //otherwise its all good.
                    deferred.resolve(records);
                    //this is to end the timed interaction tracking which got init inside getData
                    interactionTracking.doneInteraction(scope && scope.trackKey);
                },
                function (err) {
                    deferred.reject(err);
                }
            );
        }

        function handleStreamingAPI(datasource, scope, deferred, errorContainer) {
            var isReplay = false;
            if ($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'DisableStreamingAPI__c']) {
                deferred.reject('Push Topic not enabled');
            }

            if (datasource.value.channel && datasource.value.channel !== '') {

                //to get last 24 hours data subscribing to reply extension
                isReplay = datasource.value.replayAll === 'true' ? true : false;
                dataService.getSubscription(datasource.value.channel, isReplay, function (data) {
                    scope.payload = scope.payload ? scope.payload : (scope.records ? scope.records : []);
                    if (_.findIndex(scope.payload, {
                            'data': {
                                'event': {
                                    'replayId': data.data.event.replayId
                                }
                            }
                        }) == -1) {
                        if (datasource.value.isReplace === 'true') {
                            scope.payload[0] = data;
                        } else {
                            scope.payload.push(data);
                        }
                    }
                    deferred.resolve(scope.payload);
                    if (scope.reloadLayout2) {
                        scope.reloadLayout2(scope.payload);
                    } else if (scope.setPayload) {
                        scope.setPayload(scope.payload);
                    } else {
                        $rootScope.$broadcast('vlocity.data.streamingAPI', scope.payload);
                    }
                });
                deferred.resolve(scope.payload);
            }
        }

        function handleSearch(datasource, scope, deferred, errorContainer) {

            if ($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'DisableDatasourceSearch__c']) {
                deferred.reject('SOSL Search not enabled');
            }
            if (datasource.value && datasource.value.fields) {
                var searchFor = datasource.value.search;
                searchFor = $interpolate(searchFor)(scope);

                var fields = datasource.value.fields;
                var limitTo = datasource.value.limitTo;
                var objectKeys = _.keys(datasource.value.objectMap);

                var returningObjArray = [];
                angular.forEach(datasource.value.objectMap, function (value, key) {
                    var returningObj = key;
                    if (value !== '') {
                        returningObj += '(' + value + ')';
                    }
                    returningObjArray.push(returningObj);
                });

                var search = 'Find {' + searchFor + '} IN ' + fields +
                    (returningObjArray.length > 0 ? ' RETURNING ' + returningObjArray.join(',') : '') +
                    (limitTo ? ' LIMIT ' + limitTo : '');

                dataService.getSearchRecords(search).then(
                    function (records) {
                        $log.debug('datasourceService ', records);
                        if (records && records.type === 'exception') {
                            //sfdc returned with a query error
                            errorContainer.sourceType = datasource.type;
                            errorContainer.data = records;
                            errorContainer.message = records.message; //when there is an error it shows on the records
                            deferred.reject(errorContainer);
                        }
                        var res = {};
                        angular.forEach(records, function (item, index) {
                            res[objectKeys[index]] = item;
                        });
                        //otherwise its all good.
                        deferred.resolve(res);
                        //this is to end the timed interaction tracking which got init inside getData
                        interactionTracking.doneInteraction(scope && scope.trackKey);
                    },
                    function (err) {
                        deferred.reject(err);
                    }
                );
            } else {
                //is encrypted
                handleEncrypted(datasource, scope, deferred, errorContainer);
            }

        }

        function handleDataRaptor(datasource, scope, deferred, errorContainer) {
            var errorMsg;

            if ($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'DisableDatasourceDataRaptor__c']) {
                errorMsg = 'DataRaptor not enabled';
                errorContainer.sourceType = datasource.type;
                errorContainer.data = errorMsg;
                errorContainer.message = errorMsg;
                deferred.reject(errorContainer);
            }

            var cardBundle = datasource.value.bundle;
            // To support older datasource definition and check if its not blank
            if (datasource.value.ctxId && datasource.value.ctxId.length > 0) {
                datasource.value.inputMap = typeof datasource.value.inputMap === 'undefined' ? {} : datasource.value.inputMap;
                datasource.value.inputMap.Id = '{{' + datasource.value.ctxId + '}}';
                delete datasource.value.ctxId;
            }
            // Check if scope.test exists and add test key to the input map
            if (datasource.value.inputMap && scope.test) {
                let re = /\{\{(.*?)\}\}/;
                let tempObj = Object.assign({}, datasource.value.inputMap);
                for (let item in tempObj) {
                    // Check if hardcoded values are available then bypass those
                    if(tempObj[item].indexOf('}}') !== -1){
                        datasource.value.inputMap[item] = '{{test.' + tempObj[item].replace(re, "$1") + '}}';
                    }
                }
            }
            var inputMap = datasource.value.inputMap ? JSON.parse($interpolate(JSON.stringify(datasource.value.inputMap))(scope)) : {};
            dataService.getDataRaptorBundle(cardBundle, '', null, inputMap).then(
                function (records) {
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
                    if (records && Array.isArray(records) && records.length === 0) {
                        hasError = false;
                    }

                    if (hasError) {
                        $localizable('CardDesignerDataSourceDataRaptorError', 'Something is wrong with either the interface name or the context id is invalid').then(function (label) {
                            errorMsg = label;
                            errorContainer.sourceType = datasource.type;
                            errorContainer.data = records;
                            errorContainer.message = errorMsg;
                            deferred.reject(errorContainer);
                        });
                    } else {
                        deferred.resolve(records);
                        //this is to end the timed interaction tracking which got init inside getData
                        if (scope.trackKey) {
                            interactionTracking.doneInteraction(scope && scope.trackKey);
                        }
                    }

                },
                function (err) {
                    errorContainer.sourceType = datasource.type;
                    errorContainer.data = err;
                    errorContainer.message = 'DataRaptor Error';
                    deferred.reject(errorContainer);
                }
            );

        }

        function handleApexRemote(datasource, scope, deferred, errorContainer) {

            if ($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'DisableDatasourceApexRemote__c']) {
                deferred.reject('ApexRemote not enabled');
                return;
            }

            var className = datasource.value.remoteNSPrefix ? datasource.value.remoteNSPrefix + '.' + datasource.value.remoteClass : datasource.value.remoteClass;
            var methodName = datasource.value.remoteMethod;
            var inputMap = datasource.value.inputMap ? $interpolate(JSON.stringify(datasource.value.inputMap))(scope) : null;
            //To handle Asynchronous condition
            var asyncDataMap = {
                isAsync: datasource.value.vlocityAsync || false,
                asyncTimeout: datasource.value.vlocityAsyncTimeout || 1000
            };

            //must initialize
            datasource.value.optionsMap = datasource.value.optionsMap || {};
            //supporting Continuation Object - set vlcClass key if not set
            datasource.value.optionsMap['vlcClass'] = datasource.value.optionsMap['vlcClass'] || className;
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

                dataService.doGenericInvoke(className, methodName, inputMap, optionsMap, asyncDataMap).then(
                    function (records) {
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
                        //this is to end the timed interaction tracking which got init inside getData
                        interactionTracking.doneInteraction(scope && scope.trackKey);
                        return records;
                    },
                    function (error) {
                        $log.debug('doGenericInvoke error: ', error);
                        deferred.reject(error);
                    });
            }

        }

        function handleApexRest(datasource, scope, deferred, errorContainer) {

            var endpoint = $interpolate(datasource.value.endpoint.replace(/ /g, '').replace(/(\r\n\t|\n|\r\t)/gm, ''))(scope);
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
            dataService.getApexRest(endpoint, method, payload).then(
                function (records) {
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
                    //this is to end the timed interaction tracking which got init inside getData
                    interactionTracking.doneInteraction(scope && scope.trackKey);

                },
                function (error) {
                    console.error(error);
                    var errorMsg = '';
                    try {
                        errorMsg = JSON.parse(error.responseText);
                        $log.debug(errorMsg[0]);
                        errorMsg = errorMsg[0].message;
                    } catch (e) {
                        errorMsg = error.status + ' - ' + error.statusText;
                    }

                    errorContainer.sourceType = datasource.type;
                    errorContainer.data = error;
                    errorContainer.message = errorMsg;
                    deferred.reject(errorContainer);
                });

        }

        function handleRest(datasource, scope, deferred, errorContainer) {

            if ($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'DisableDatasourceREST__c']) {
                deferred.reject('REST not enabled');
                return;
            }
            datasource.value.endpoint = datasource.value.endpoint.replace(/ /g, '').replace(/(\r\n\t|\n|\r\t)/gm, '');
            var payload = datasource.value.body && datasource.value.methodType != 'GET' ? JSON.parse($interpolate(datasource.value.body)(scope)) : null;
            //set to empty array to conform with named credential scenario
            var headers = datasource.value.header ? angular.copy(datasource.value.header) : [];
            var headerObj = {};
            angular.forEach(headers, function (header) {
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
                    'namedCredential': datasource.value.namedCredential,
                    'headers': headers.length > 0 ? headerObj : null,
                    'restMethod': datasource.value.methodType,
                    'restPath': datasource.value.endpoint ? $interpolate(datasource.value.endpoint)(scope) : '',
                    'data': payload
                };

                dataService.doNamedCredentialCallout(JSON.stringify(inputMap)).then(
                    function (records) {
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
                        //this is to end the timed interaction tracking which got init inside getData
                        interactionTracking.doneInteraction(scope && scope.trackKey);

                    },
                    function (error) {
                        console.error(error);
                        var errorMsg = '';
                        try {
                            errorMsg = JSON.parse(error.responseText);
                            $log.debug(errorMsg[0]);
                            errorMsg = errorMsg[0].message;
                        } catch (e) {
                            errorMsg = error.status + ' - ' + error.statusText;
                        }

                        errorContainer.sourceType = datasource.type;
                        errorContainer.data = error;
                        errorContainer.message = errorMsg;
                        deferred.reject(errorContainer);
                    });

            } else {
                $http(req).then(
                    function (records) {
                        $log.debug(records);
                        deferred.resolve(records);
                        interactionTracking.doneInteraction(scope && scope.trackKey);
                    },
                    function (error) {
                        console.info('rest error', error);
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

        function handleIntegrationProcedures(datasource, scope, deferred, errorContainer) {

            if ($rootScope.vlocityCards.customSettings && $rootScope.vlocityCards.customSettings[$rootScope.nsPrefix + 'DisableDatasourceIntegrationProcedures__c']) {
                deferred.reject('IntegrationProcedures not enabled');
                return;
            }

            var className = fileNsPrefixDot() + 'IntegrationProcedureService';
            var methodName = datasource.value.ipMethod;
            var inputMap = datasource.value.inputMap ? $interpolate(JSON.stringify(datasource.value.inputMap))(scope) : null;
            var asyncDataMap = {
                isAsync: datasource.value.vlocityAsync || false,
                asyncTimeout: datasource.value.vlocityAsyncTimeout || 1000
            };

            //must initialize
            datasource.value.optionsMap = datasource.value.optionsMap || {};
            //supporting Continuation Object - set vlcClass key if not set
            datasource.value.optionsMap['vlcClass'] = datasource.value.optionsMap['vlcClass'] || className;
            //then we interpolate
            var optionsMap = datasource.value.optionsMap ? $interpolate(JSON.stringify(datasource.value.optionsMap))(scope) : null;
            //can't execute Integration Procedures without class or method names
            if (!className || !methodName) {
                errorContainer.sourceType = datasource.type;
                errorContainer.data = null;
                errorContainer.message = 'Cannot execute Integration Procedures without Class or Method names';
                deferred.reject(errorContainer);
                return deferred.promise;
            }

            if (className && methodName) {

                var classError = null;
                var methodError = null;

                dataService.doGenericInvoke(className, methodName, inputMap, optionsMap, asyncDataMap).then(
                    function (records) {
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
                                    errorMsg = $localizable('CardDesignerDataSourceIntegrationProceduresClassNotFoundError', 'Class not found');
                                } else if (errorCode == 'INVOKEMETHOD-405') {
                                    errorMsg = $localizable('CardDesignerDataSourceIntegrationProceduresMethodNotFoundError', 'Method not found');
                                } else if (errorCode == 'INVOKE_500') {
                                    errorMsg = records['error'];
                                }
                            }
                            errorContainer.sourceType = datasource.type;
                            errorContainer.data = records;
                            errorContainer.message = errorMsg;
                            deferred.reject(errorContainer);
                        }
                        deferred.resolve(records.IPResult);
                        interactionTracking.doneInteraction(scope && scope.trackKey);
                        return records.IPResult;
                    },
                    function (error) {
                        $log.debug('doGenericInvoke error: ', error);
                        deferred.reject(error);
                    });
            }

        }

        function handleCustom(datasource, deferred, scope) {

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
                    //this is to end the timed interaction tracking which got init inside getData
                    interactionTracking.doneInteraction(scope && scope.trackKey);
                }

                //return records;
            } catch (e) {
                //Don't show modal errors for auto save. User is alerted with inline error for JSON field. Fix for CARD-407
                //If the sample json is invalid on page load, higlight the field with error
                $log.debug(e);
            }

        }

        function getDataHelper(datasource, scope) {
            $log.debug('calling the datasourceService ', datasource);
            var deferred = $q.defer();
            var errorContainer = {};
            //haven't finished setting up datasource
            if (!datasource.value && datasource.type && !datasource.type == 'Encrypted') {
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
                case 'Search':
                    handleSearch(datasource, scope, deferred, errorContainer);
                    break;
                case 'DataRaptor':
                    handleDataRaptor(datasource, scope, deferred, errorContainer);
                    break;
                case 'ApexRemote':
                    handleApexRemote(datasource, scope, deferred, errorContainer);
                    break;
                case 'ApexRest':
                    handleApexRest(datasource, scope, deferred, errorContainer);
                    break;
                case 'Dual':
                    if (typeof Visualforce !== 'undefined') {
                        handleApexRemote(datasource, scope, deferred, errorContainer);
                    } else {
                        handleApexRest(datasource, scope, deferred, errorContainer);
                    }
                    break;
                case 'REST':
                    handleRest(datasource, scope, deferred, errorContainer);
                    break;
                case 'IntegrationProcedures':
                    handleIntegrationProcedures(datasource, scope, deferred, errorContainer);
                    break;
                case 'Custom':
                    handleCustom(datasource, deferred, scope);
                    break;
                case 'Inherit':
                    //special scenario where the data is coming as the flyout data
                    deferred.resolve('inherit success');
                    interactionTracking.doneInteraction(scope && scope.trackKey);
                    break;
                case 'StreamingAPI':
                    $rootScope.enableCometD = true;
                    console.log('enabling cometd');
                    configService.initCometD().then(function () {
                        handleStreamingAPI(datasource, scope, deferred, errorContainer);
                    });
                    break;
                case 'Encrypted':
                    handleEncrypted(datasource, scope, deferred, errorContainer);
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
                        scope.$on('$destroy', function () {
                            $timeout.cancel(scope.intervalTimer);
                        });
                    } catch (err) {
                        $log.error("scope on doesnot exists in designer");
                    }
                }

                scope.intervalTimer = $timeout(function () {
                    getDataHelper(datasource, scope).then(function (value) {
                        $log.log(value);
                        if (datasource.value.resultVar) {
                            value = value[datasource.value.resultVar];
                        }
                        if (scope.records && !angular.equals(scope.records, value)) {
                            $rootScope.isReloadAction = true;
                            if (scope.layoutId || scope.layoutName) {
                                $log.info("reload Layout");
                                scope.reloadLayout2();
                                return;
                            } else {
                                $log.info("reload Card.");
                                /* the isRedraw value of reloadCard needs to be set to true so that the card data
                                 * does that have scope.obj value and scope.pickedState value. Its neccessary to reset
                                 * them for moving from inactive to active state and vice a versa.
                                 */
                                scope.reloadCard(true);
                                return;
                            }
                        }
                    });
                }, datasource.value.interval);

            }


            if (datasource.value && datasource.value.timeout && datasource.value.timeout > 0) {
                $timeout(function () {
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

        function trackInteraction(datasource, scope) {
            var interactionData = interactionTracking.getDefaultTrackingData();
            var now = Date.now();
            var eventData = {
                'TrackingService': 'CardFramework',
                'TrackingEvent': 'datasource',
                'datasource': datasource,
            };
            if (scope && scope.data) {
                eventData['CardInfo'] = (scope.data && scope.data.cardName) ? scope.data.cardName : '';
                eventData['LayoutInfo'] = (scope.data && scope.data.Name) ? scope.data.Name : '';
                scope.trackKey = now;
            }
            interactionData = angular.extend(interactionData, eventData);

            //factory method to add a interaction tracking entry. 
            //Now when particular execution is complete we can call interactionTracking.doneInteraction with trackKey
            interactionTracking.initInteraction(interactionData, true, now);
        }

        return {
            getData: function (datasource, scope) {
                //init of timed track interaction, this is done to calculate the elapsed time & to add a tracking entry
                trackInteraction(datasource, scope);
                if (JSON.stringify(datasource).indexOf('$root.vlocity') > 0) {
                    return userProfileService.userInfoPromise().then(
                        function () {
                            return getDataHelper(datasource, scope);
                        }
                    );
                }
                return getDataHelper(datasource, scope);
            },

            selectResultNode: function (datasource, records, nodeVar) {
                var isReverse = false;
                if (!datasource || !datasource.value) {
                    return records; //just passing records back
                }
                if (datasource.type === 'Dual') {
                    if (typeof Visualforce !== 'undefined') {
                        records = datasource.value.apexRemoteResultVar ? _.get(records, datasource.value.apexRemoteResultVar) : records;
                    } else {
                        records = datasource.value.apexRestResultVar ? _.get(records, datasource.value.apexRestResultVar) : records;
                    }
                } else {
                    if (nodeVar) {
                        records = _.get(records, nodeVar);
                    } else {
                        records = (datasource.value && datasource.value.resultVar) ? _.get(records, datasource.value.resultVar) : records;
                    }
                }

                if (datasource.orderBy && datasource.orderBy.name && angular.isArray(records)) {
                    isReverse = datasource.orderBy.isReverse === 'true' ? true : false;
                    records = $filter('orderBy')(records, datasource.orderBy.name, isReverse);
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
    messageCallback: function (message) {
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
    }]).run(function (remoteActions, vlocTemplateInternalCache, force, vlocTemplateService, $rootScope) {
        $rootScope.bypassActiveCheck = $rootScope.bypassActiveCheck ? $rootScope.bypassActiveCheck : false;
        if(typeof $rootScope.bypassActiveCheck != 'undefined' && !$rootScope.bypassActiveCheck){ 
            vlocTemplateService.getActiveTemplates(remoteActions, vlocTemplateInternalCache, force);
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
                      var nsPrefix = fileNsPrefix() ? fileNsPrefix() : '';
                      // Before inserting CSS tag check whether it is defined or not
                      if(vlocTemplateInternalCache.resolved[name][nsPrefix + 'CSS__c']) {
                        insertCSS(name, vlocTemplateInternalCache.resolved[name][nsPrefix + 'CSS__c']);
                      }
                      // Before inserting script tag check whether it is defined or not
                      if(vlocTemplateInternalCache.resolved[name][nsPrefix + 'CustomJavascript__c']) {
                        registerController(name, vlocTemplateInternalCache.resolved[name][nsPrefix + 'CustomJavascript__c']);
                      }
                      return vlocTemplateInternalCache.resolved[name][nsPrefix + 'HTML__c'];
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
    $provide.decorator('$templateRequest',['$delegate', 'vlocTemplateInternalCache', 'remoteActions', '$q', 'force', 'pageService','$log','dataService',
            function($delegate, vlocTemplateInternalCache, remoteActions, $q, force, pageService, $log,dataService) {
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
                            var inputMap = {
                                templateName: name
                            };
                            var payload = {
                                sClassName: (fileNsPrefixDot() ? fileNsPrefixDot() : '') +  "CardCanvasController",
                                sMethodName: "getTemplate",
                                input: JSON.stringify(inputMap),
                                options: '{}'
                            };
                            var promise = dataService.doGenericInvoke(payload.sClassName, payload.sMethodName, payload.input, payload.options).then(
                                function (data) {
                                    data = data.result ? data.result : data;
                                    var template = data;
                                    delete vlocTemplateInternalCache.pending[name];
                                    template[fileNsPrefix() + 'HTML__c'] = unescapeHTML(template[fileNsPrefix() + 'HTML__c']);
                                    template[fileNsPrefix() + 'Sass__c'] = unescapeHTML(template[fileNsPrefix() + 'Sass__c']);
                                    template[fileNsPrefix() + 'CSS__c'] = unescapeHTML(template[fileNsPrefix() + 'CSS__c']);
                                    sessionStorage.setItem('template::' + name, JSON.stringify(template)); //
                                    vlocTemplateInternalCache.resolved[name] = template;
                                    return original.apply(me, originalArgs);
                                },
                                function (error) {
                                    console.error(error);
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
        if(!query && window.location.search) {
            query = window.location.search.substring(1);
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

    // Method to be used to add/update params object
    this.updateParams = function(attr, value){
        if(attr) {
            this.params[attr] = value;
        }
    };

    // Method to be used to delete property from params object
    this.deleteParams = function(attr){
        if(attr) {
            delete this.params[attr];
        }
    };
    }).service('vlocTemplateService',['dataService', function (dataService) {
        this.getActiveTemplates = function (remoteActions, vlocTemplateInternalCache, force) {
            //this only runs on the init of the module, in mobile we do not have the session token yet
            if (typeof Visualforce !== 'undefined') {
                remoteActions.getActiveTemplateNames().
                    then(function (templatesNames) {
                        vlocTemplateInternalCache.names = templatesNames;
                        if (vlocTemplateInternalCache.pending.initialize) {
                            vlocTemplateInternalCache.pending.initialize.forEach(function (callback) {
                                callback();
                            });
                        }
                        delete vlocTemplateInternalCache.pending.initialize;
                    });
            } else {
                var payload = {
                    sClassName: (fileNsPrefixDot() ? fileNsPrefixDot() : '') +  "CardCanvasController",
                    sMethodName: "getActiveTemplateNames",
                    input: '{}',
                    options: '{}'
                };
                dataService.doGenericInvoke(payload.sClassName, payload.sMethodName, payload.input, payload.options).then(
                    function (data) {
                        data = data.result ? data.result : data;
                        vlocTemplateInternalCache.names = data;
                        if (vlocTemplateInternalCache.pending.initialize) {
                            vlocTemplateInternalCache.pending.initialize.forEach(function (callback) {
                                callback();
                            });
                        }
                        delete vlocTemplateInternalCache.pending.initialize;
                    },
                    function (error) {
                        console.error(error);
                    });
            }
        };
  
    }]);
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
        
        //If multiple layouts exists in case of zones it should pick the correct parent.
        cardsContainer = selectedCard.closest(".cards-container")

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
            cardIndex: '@index',
            parentLayout : '=?',
            onLoaded : '&onLoaded'
        },
        compile: function(element, attributes) {
             return {
                 post: function(scope, element, attributes, controller, transcludeFn) {
                     scope.init();
                 }
             };
         },
        controller: ['$scope', '$rootScope','$element','$q','$controller','$attrs','timeStampInSeconds','actionService', 'dataService', '$interpolate','pageService','networkService','configService','performAction','$filter','$http', 'dataSourceService', '$vlocFlyout', '$log','interactionTracking', '$timeout','$window',
         function($scope, $rootScope, $element, $q, $controller, $attrs, timeStampInSeconds, actionService, dataService,
              $interpolate, pageService, networkService, configService, performAction, $filter, $http, dataSourceService, $vlocFlyout, $log, interactionTracking, $timeout, $window) {
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
             $scope.data = $scope.data ? $scope.data : {};
             $scope.data.uniqueLayoutId = $scope.uniqueLayoutId;
             $scope.objId = $scope.data.cardId;
             $scope.loggedUser = $rootScope.loggedUser ? $rootScope.loggedUser : null;
             $scope.inactiveError = {
                 'header': {
                     label: 'CardFrameworkInactiveErrorHeader',
                     value: 'Error'
                 },
                 'errorMsg': {
                     label: 'CardFrameworkInactiveErrorMsg',
                     value: 'There is no active instance of'
                 },
                 'associationNameLabel': {
                     label: 'CardFrameworkInactiveAssociationNameLabel',
                     value: 'associated with'
                 },
                 'associationTypeLabel': {
                     label: 'CardFrameworkInactiveAssociationTypeLabel',
                     value: 'of type'
                 },
                 'associationType': {
                     label: 'CardFrameworkInactiveAssociationTypeCard',
                     value: 'card'
                 },
                 'contactAdminMsg': {
                     label: 'CardFrameworkContactAdminMsg',
                     value: 'Please contact your Salesforce Admin'
                 }
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

            /**
             * Allow instances of the card definition to call certain functions from
             * inside the scope
             */
            $scope.data.invokeCardFunctions = function (fName) {
                //return always the same structure, no matter the function called
                var result = { success: false, data: null, exception: null };
                switch (fName) {
                    case 'getActiveStates': 
                        try {
                            result.data = getActiveStates();
                            result.success = true;
                        } catch(e) {
                            result.success = false;
                            result.exception = e;
                        }
                        break;
                    default: 
                        //default return exception
                        result.exception = fName + ' not available as a function.';
                        break;
                }

                return result;
            };

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
                            $scope.evaluateMetatags();
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
                } else if ($scope.data.dataSource && (!$scope.obj && !$scope.data.obj)) {
                    $log.debug('card needs data');
                    loadRecords().then(startCard, function(error){
                         $log.debug('loadRecords: ', error);
                    });
                } 
                // Need this var for template with paginations to be aware of datasource interval timer on all of its pages.
                else if ($rootScope.reloadRecords) {
                    $log.debug('card needs data');
                    loadRecords().then(startCard, function(error){
                         $log.debug('loadRecords: ', error);
                    });
                    $rootScope.reloadRecords = false;
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
                        dataSourceService.getData($scope.data.dataSource, $scope).then(
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
                                deferred.reject('Failure');
                            }
                        );
                    } else {
                        if($scope.records) {
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

            $scope.setPayload = function(payload,isRedraw) {
                $scope.isRedraw = isRedraw === undefined ? true : isRedraw;
                if($scope.isRedraw) {
                    delete $scope.obj;
                    delete $scope.data.obj;
                    delete $scope.pickedState; //remove the previously selected state
                }
                $scope.payload = payload;
                $scope.sObjects = undefined;
                $scope.records = $scope.payload;
                $scope.datasourceStatus = {status: 'loaded'};
                startCard();
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
                loadRecords().then(startCard, function(error){
                    $log.debug('loadRecords: ', error);
                });
            };

             /**
              * [startCard description]
              * @return {[type]} [description]
              */
             var startCard = function() {
                 angular.forEach($scope.data.sessionVars, function (sessionVar) {
                     try {
                         $scope.session[sessionVar.name] = $interpolate('{{' + sessionVar.val + '}}')($scope);
                     } catch (e) {
                         $log.debug('could not set ', sessionVar, e);
                     }
                 });
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
                    if (!$scope.data.status || $scope.data.status == 'non-existent') {
                        $scope.data.status = 'active';
                    }
                    pickState();
                }
            };

            var getActiveStates = function() {
                var activeStates = [];
                if ($scope.data.states) {
                    angular.forEach($scope.data.states,function(state) {
                        if (typeof state.filter === 'string') {
                            try {
                                if (eval(state.filter)) {
                                    activeStates.push(state);
                                    return;
                                }
                            } catch (e) {
                                $log.error('Bad Eval', e);
                            }
                        } else if (configService.checkFilter($scope, $scope.obj, state.filter)) {
                            activeStates.push(state);
                            return;
                        }
                    });
                    return activeStates;
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
                                if (eval(validateStateFilterCondition(state.filter))) {
                                    evalState(state);
                                    cleanUpElement();
                                    $scope.loadTemplate();

                                    return $scope.pickedState;
                                }
                            } catch (e) {
                                $log.error('Bad Eval', e);
                            }
                        } else if (!$scope.pickedState && configService.checkFilter($scope, $scope.obj, state.filter)) {
                            evalState(state);
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
                // callback after card loadeds
                $scope.onLoaded();
            };

            var validateStateFilterCondition = function(str){
                var validationObj = {
                    "'null'" : null,
                    "'undefined'" : undefined,
                    "'true'" : true,
                    "'false'" : false
                }
                var re = /^(null|undefined|true|false)/gi;
                return str.replace(re, function(matched){
                    return validationObj[matched.toLowerCase()];
                });
            };

            var evalState = function(state) {
                $scope.pickedState = state;
                $scope.pickedState.sObjectType = $scope.pickedState.sObjectType ? $scope.pickedState.sObjectType : 'All';
                $scope.data.fields = state.fields;
                $scope.data.flyout = state.flyout;
                $scope.data.definedActions = {actions:[]};
                if(state.definedActions && state.definedActions.actions.length > 0) {
                    angular.forEach(state.definedActions.actions, function(action){
                        if(action.filter){
                            if(typeof action.filter === 'string' && eval(validateStateFilterCondition(action.filter))){
                                $scope.data.definedActions.actions.push(action);
                            }
                        } else {
                            $scope.data.definedActions.actions.push(action);
                        }
                    });
                }
                if ($scope.obj) {
                    // _.get($scope.obj,state.actionCtxId) below extracts state.actionCtxId from $scope.obj even when the value
                    // of state.actionCtxId is surrounded by bracket (to support spece in field name)
                    $scope.data.actionCtxId = state.actionCtxId ? _.get($scope.obj,state.actionCtxId) : $scope.obj.Id;
                    // To resolve if field labels are dynamic
                    angular.forEach(state.fields, function(field){
                        try {

                        //Added to resolve conversion of " - " to " 0 " 
                            var fieldLabelValue = field.label.charAt(0) === '[' ? '{{ obj'+ field.label + ' }}' : (field.label.indexOf(' ') > -1 ? '{{ }}' : field.label);

                            var fieldLabel = fieldLabelValue.charAt(0) === '{' ? $interpolate(fieldLabelValue)($scope) : fieldLabelValue;

                            field.label = fieldLabel || (field.label.indexOf('[') > -1 || field.label.indexOf('obj.') > -1 ? '' : field.label);
                        } catch(e) {
                            $log.debug('field label resolve error ',field, e);
                        }
                    });
                }
                else {
                    $scope.data.actionCtxId = state.actionCtxId ? _.get($scope,state.actionCtxId) : $scope.params.id || $scope.params.Id;
                }
                $scope.templateUrl = state.templateUrl;
                $scope.getActions();
                evalPlaceholders();
            };

            var evalPlaceholders = function(){
                angular.forEach($scope.pickedState.placeholders, function(placeholder){
                    try{
                        $scope.placeholder[placeholder.name] = $scope.placeholder[placeholder.name] || {};
                        var placeholderVal = placeholder.value.charAt(0) === '[' ? 'obj' + placeholder.value : (placeholder.value.indexOf(' ') > -1 ? '' :  placeholder.value);
                        var placeholderResult = $interpolate('{{'+placeholderVal+'}}')($scope);
                        $scope.placeholder[placeholder.name].value = placeholderResult || (placeholder.value.indexOf('[') > -1 || placeholder.value.indexOf('obj.') > -1 ? '' : placeholder.value);
                        $scope.placeholder[placeholder.name].type = placeholder.type;
                        // To resolve if placeholder labels are dynamic
                        var placeholderLabel = placeholder.label.charAt(0) === '[' ? 'obj' + placeholder.label : (placeholder.label.indexOf(' ') > -1 ? '' :  placeholder.label);
                        var placeholderLabelResult = $interpolate('{{'+placeholderLabel+'}}')($scope);
                        $scope.placeholder[placeholder.name].label = placeholderLabelResult || (placeholder.label.indexOf('[') > -1 || placeholder.label.indexOf('obj.') > -1 ? '' : placeholder.label)
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
                var cardDataArray = [];
                $log.debug('records for card:',records);

                if (records && (!$scope.sObjects || $scope.sObjects.length === 0 || !$scope.isRedraw)) {
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

                        // Need to set this for templates with pagination to support reloadCard on all of its pages.
                        $scope.data.uniqueId = $scope.data.globalKey + '--' + $scope.data.cardIndex; 
                        delete $scope.obj.$$vlocityCardIndex; //we don't need this any longer
                        $scope.sObjects.splice(0,1); //pick off first record
                        if ($scope.data.status != 'active') {
                            $scope.data.status = 'active';//trying to not fire this watch again
                        }

                        //adding extra cards
                        if (!$scope.data.obj || !$scope.isRedraw) {
                            angular.forEach($scope.sObjects,function(sObject, i) {
                                var cardData = angular.copy($scope.data);
                                cardData.obj = sObject;

                                cardData.cardIndex = sObject.$$vlocityCardIndex;
                                //adding unique id to update data if card already exists
                                cardData.uniqueId = cardData.globalKey + '--' + cardData.cardIndex; 
                                delete sObject.$$vlocityCardIndex; //we don't need this any longer
                                cardDataArray.push(cardData);
                            });                    
                        }
                    } else {
                        $scope.data.status = 'non-existent';
                    }

                    /* For a card datasource, when there are no sObjects or only 1 sobject, in order to make 
                    * the Layout aware of the invalid/extra cards, the 'addCard' event needs to be emitted even when
                    * cardDataArray.length == 0/1
                    */
                    $timeout(function() {

                        //use event to bubble up cards to its parent layout

                        /* Need to include $scope.obj in the call as on receiving this event, 
                         * Layout first removes all the cards by the given name and only keeps the
                         * current card based on its SObject value.
                         */
                        $scope.$emit($scope.data.layoutName+'.addCard', $scope.data.cardName, $scope.obj, $scope.data.uniqueId, cardDataArray);
                        $scope.sObjects = []; 
                    });

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
                    trackingData.CardElement = field.label;
                    //set card as tracked
                    $scope.data.checkedEntity = true;
                    //set field as tracked
                    field.tracked = true;

                    $scope.trackInteraction('trackField', trackingData);
            };

            $scope.trackInteraction = function(interactionType, eventData, trackKey) {
                var interactionData = interactionTracking.getDefaultTrackingData($scope);
                var rawData = $scope.data.obj;
                var isTimed = false;
                trackKey = trackKey ? trackKey : Date.now();
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
                                'CardElement' : eventData.action[$scope.nsPrefix + 'DisplayLabel__c'],
                                'CustomerInteractionId' : typeof rawData !== 'undefined' ? (rawData.InteractionId || '') : '',
                                'EntityName' : typeof rawData !== 'undefined' ? (rawData.Name || '') : ''
                            };
                            interactionData = angular.extend(interactionData, eventData);
                            break;
                    default:
                        interactionData = eventData;
                        break;
                }
                //This is to pass InteractionId, if vlocity action doesnt include it in URL params already. For CARD-1224
                if(typeof rawData !== 'undefined' && rawData.InteractionId && interactionData.ActionInfo && interactionData.ActionInfo.actionConfig) {
                    interactionData.ActionInfo.actionConfig.extraParams.InteractionId = rawData.InteractionId
                }
                interactionTracking.initInteraction(interactionData, isTimed, trackKey);
            }

            /**
             * A way to communicate from Layout/cards to LWC
             * @param channel 
             * @param event
             * @param data
             */
            $scope.performLwcAction = function(channel, event, data) {
                if ('parentIFrame' in window) {
                    parentIFrame.sendMessage({
                        message:'lwc:event',
                        channel : channel,
                        event : event,
                        data : data
                    });
                }
            }

             /**
              * [performAction description]
              * @param  {[type]} action Vlocity Action object
              */
             $scope.performAction = function (action, actionConfig) {
                $log.debug('perform action ', action);
                var checkForBracketField = /\[.*\]/;
                var extraParams = actionConfig && actionConfig.extraParams ? actionConfig.extraParams : {};
                extraParams = _.assign(extraParams, action.extraParams);
                var inputMap = actionConfig && actionConfig.inputMap ? actionConfig.inputMap : {};
                inputMap = _.assign(inputMap, action.inputMap);
                var optionsMap = actionConfig && actionConfig.optionsMap ? actionConfig.optionsMap : {};
                optionsMap = _.assign(optionsMap, action.optionsMap);
                if (action.isCustomAction) {
                    if (action.type === 'OmniScript') {
                        var record = performAction.getSORecord($scope.data, $scope.obj);
                        let queryStringObj = {};
                        let omniscriptTypeArr = action.omniType && action.omniType.Name ? action.omniType.Name.split('/') : [];
                        if (action.isLwcOS) {
                            let targetStr = '';
                            if (omniscriptTypeArr && omniscriptTypeArr.length) {
                                omniscriptTypeArr[1] = capitalize(omniscriptTypeArr[1]);
                                omniscriptTypeArr[2] = capitalize(omniscriptTypeArr[2]);
                                let omniScriptLwcName = omniscriptTypeArr.join('');
                                targetStr = (action.orgNsPrefix ? action.orgNsPrefix : 'c') + ':' + omniScriptLwcName;
                            } else {
                                targetStr = '';
                            }
                            queryStringObj = {
                                c__target: targetStr ? targetStr : null,
                                c__layout: action.layoutType ? action.layoutType : 'lightning'
                            };
                            if (action.ContextId) {
                                if (typeof (action.ContextId) !== 'boolean') {
                                    if(action.ContextId.indexOf('$scope') <= -1 && action.ContextId.indexOf('$root') <= -1 && action.ContextId.indexOf('params.') <= -1 && checkForBracketField.test(action.ContextId)){
                                        // check for undefined and return empty
                                        queryStringObj.c__ContextId = _.get($scope.obj, action.ContextId) || '';
                                    } else {
                                        if(action.ContextId.indexOf('$scope') > -1 || action.ContextId.indexOf('$root') > -1 || action.ContextId.indexOf('params.') > -1 ) {
                                            queryStringObj.c__ContextId =  $interpolate('{{' + action.ContextId.replace('$scope.', '') + '}}')($scope)
                                        } else {
                                            queryStringObj.c__ContextId = action.ContextId;
                                        }
                                    }
                                } else {
                                    queryStringObj.c__ContextId = action.ContextId;
                                }
                            }
                            
                            if (action.tabIcon)
                                queryStringObj.c__tabIcon = action.tabIcon;
                            if (action.tabLabel)
                                queryStringObj.c__tabLabel = action.tabLabel;
                        } else {
                            queryStringObj = {
                                id: record ? record.Id : null,
                                ContextId: record ? record.Id : null,
                                OmniScriptType: omniscriptTypeArr[0] || action.omniType,
                                OmniScriptSubType: omniscriptTypeArr[1] || action.omniSubType,
                                OmniScriptLang: omniscriptTypeArr[2] || action.omniLang,
                                layout: action.layoutType ? action.layoutType : 'lightning'
                            };
                        }
                        var queryString = Object.keys(queryStringObj).reduce(function (queryString, key) {
                            var value = queryStringObj[key];
                            if (!extraParams[key]) {
                                return queryString + (queryString.length > 1 ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(value);
                            } else {
                                return queryString;
                            }
                        }, '');
                        if (action.isLwcOS) {
                            let urlPrefix = $rootScope.isCommunity ? "/lwcos?" : "ltng:/lightning/cmp/" + $rootScope.nsPrefix + "vlocityLWCOmniWrapper?";
                            action.url = urlPrefix + queryString;
                        } else {
                            let vForcePage = action.vForcewithNsPrefix ? action.vForcewithNsPrefix : $rootScope.nsPrefix + 'OmniScriptUniversalPage';
                            action.url = '/apex/' + vForcePage + '?' + queryString;
                        }
                    }
                    action.url = $interpolate(action.url)($scope);
                }
                angular.forEach(extraParams, function (paramVal, paramKey) {
                    if (typeof (paramVal) !== 'boolean') {
                        if(paramVal.indexOf('$scope') <= -1 && paramVal.indexOf('$root') <= -1 && paramVal.indexOf('params.') <= -1 && checkForBracketField.test(paramVal)){
                            // check for undefined and return empty
                            extraParams[paramKey] = _.get($scope.obj, paramVal) || '';
                        } else {
                            var paramValField = paramVal.charAt(0) === '[' ? '$scope.obj' + paramVal : '$scope.obj.' + paramVal;
                            var valueField = paramVal.indexOf('$scope') > -1 ? paramVal : paramValField;

                            if(paramVal.indexOf('$scope') > -1 || paramVal.indexOf('$root') > -1 || paramVal.indexOf('params.') > -1 ) {
                                extraParams[paramKey] =  $interpolate('{{' + paramVal.replace('$scope.', '') + '}}')($scope)
                            } else {
                                extraParams[paramKey] = paramVal;
                            }
                        }
                    } else {
                        extraParams[paramKey] = paramVal;
                    }

                });
                actionConfig = actionConfig || {};
                actionConfig.extraParams = extraParams;
                actionConfig.inputMap = JSON.parse($interpolate(JSON.stringify(inputMap))($scope));
                actionConfig.optionsMap = JSON.parse($interpolate(JSON.stringify(optionsMap))($scope));

                //if field value is selected as value of input/output map
                angular.forEach(actionConfig.inputMap, function (inpMapValue, inpMapKey) {
                    actionConfig.inputMap[inpMapKey] = _.get($scope.obj, inpMapValue) ? _.get($scope.obj, inpMapValue) : inpMapValue;
                });
                angular.forEach(actionConfig.optionsMap, function (outMapValue, outMapKey) {
                    actionConfig.optionsMap[outMapKey] = _.get($scope.obj, outMapValue) ? _.get($scope.obj, outMapValue) : outMapValue;
                });

                actionConfig.closeTab = actionConfig.closeTab ? actionConfig.closeTab : false;

                var now = Date.now();
                $scope.trackInteraction('performAction', { action: action, actionConfig: actionConfig }, now);
                actionConfig.extraParams.trackKey = now;
                setTimeout(function () {
                    return performAction(action, actionConfig, $scope.obj, $scope.data, $scope.data.filter, $scope.pickedState);
                }, 10);
            };

            var capitalize = function(str) {
                if (typeof (str) == 'string')
                  return str.charAt(0).toUpperCase() + str.slice(1);
                return "";
              }

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
                        var device = typeof ionic !== 'undefined' && ionic.Platform ? 'Mobile' : 'Web Client';

                        $scope.data.actions = [];
                        angular.forEach(actionList, function(defAction) {
                            var displayOnFlag;
                            if (defAction.type === 'Vlocity Action' && orgActions[defAction.id]) {
                                var clonedAction = angular.copy(orgActions[defAction.id]);
                                var customIcon;
                                displayOnFlag = clonedAction[$rootScope.nsPrefix + 'DisplayOn__c'];
                                if(clonedAction.Attachments && clonedAction.Attachments.length > 0) {
                                    clonedAction.imageRef = '../servlet/servlet.FileDownload?file=' + clonedAction.Attachments[0].Id;
                                } else if(clonedAction.ContentDocumentLinks && clonedAction.ContentDocumentLinks.length > 0) {
                                    customIcon = _.find(clonedAction.ContentDocumentLinks, {"ContentDocument":{"Title":clonedAction.vlocityIcon}});
                                    clonedAction.imageRef = customIcon && '/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB120BY90&versionId=' + customIcon.ContentDocument.LatestPublishedVersionId;
                                }
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
                                    //support inputMap and OptionMap for action with Invoke class
                                    if(defAction[$rootScope.nsPrefix + 'InvokeClassName__c']){
                                      clonedAction.inputMap = defAction.inputMap;
                                      clonedAction.optionsMap = defAction.optionsMap;
                                    }
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

            $scope.evaluateMetatags = function() {
                angular.forEach($scope.data.metatagVars, function(metatag) {
                    try {
                        $log.debug('metatag ',metatag);
                        //To make sure metatag with unique name only gets added once to header.
                        var existingElem = $window.document.head.querySelector("meta[name='"+metatag.name+"'][data-custom='true']");
                        if(existingElem) {
                            existingElem.parentNode.removeChild(existingElem);
                        }
                        var tag = document.createElement('meta');
                        tag.name=metatag.name;
                        tag.content=$interpolate(metatag.val)($scope);
                        tag.dataset.custom = true;
                        $window.document.head.appendChild(tag);
                    } catch (e) {
                        $log.debug('could not set ',metatag, e);
                    }
                });
                $log.debug('metatag variables',$scope.session);
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
                $scope.evaluateMetatags();
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
                        $scope.inactiveError.inactiveEntityNameLabel = { label : 'CardFrameworkInactiveTemplateNameLabel', value :  'Template Name'};
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
                'header': { label : 'CardFrameworkInactiveErrorHeader', value : 'Error'},
                'errorMsg': { label : 'CardFrameworkInactiveErrorMsg', value : 'There is no active instance of'},
                'associationNameLabel': { label : 'CardFrameworkInactiveAssociationNameLabel', value : 'associated with'},
                'associationTypeLabel': { label : 'CardFrameworkInactiveAssociationTypeLabel', value : 'of type'},
                'associationType': { label : 'CardFrameworkInactiveAssociationTypeComponent', value :'component'},
                'contactAdminMsg': { label : 'CardFrameworkContactAdminMsg', value : 'Please contact your Salesforce Admin'}
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
                        $scope.inactiveError.inactiveEntityNameLabel = { label : 'CardFrameworkInactiveTemplateNameLabel', value : 'Template Name'};
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
             pageService, actionService, performAction, $interpolate, $localizable, dataSourceService, $vlocFlyout, $q, parseUri, interactionTracking, $interval) {

            $log = $log.getInstance('CardFramework: vloc-layout');
            $log.debug('layout loading: ', $scope.layoutName);
            $scope.nsPrefix = $rootScope.nsPrefix;
            $scope.params = pageService.params;
            $scope.attrs = $attrs;
            $scope.loggedUser = $rootScope.loggedUser ? $rootScope.loggedUser : null;
            $scope.session = {};
            $scope.uniqueLayoutId = Date.now(); 
            $scope.objId = $scope.layoutId || null;
            $scope.inactiveError = {
                'header': { label : 'CardFrameworkInactiveErrorHeader', value : 'Error'},
                'errorMsg': { label : 'CardFrameworkInactiveErrorMsg', value : 'There is no active instance of'},
                'associationNameLabel': { label : 'CardFrameworkInactiveAssociationNameLabel', value :'associated with'},
                'associationTypeLabel': { label : 'CardFrameworkInactiveAssociationTypeLabel', value : 'of type'},
                'associationType': { label : 'CardFrameworkInactiveAssociationTypeLayout', value : 'layout'},
                'contactAdminMsg':  { label : 'CardFrameworkContactAdminMsg', value : 'Please contact your Salesforce Admin'}
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
                $scope.$on($scope.uniqueName + '.addCard', function (event, cardName, originalSObject, originalUniqueId, cards) {
                    // handle event only if it was not defaultPrevented
                    if (event.defaultPrevented) {
                        return;
                    }
                    // mark event as "not handle in children scopes"
                    event.preventDefault();

                    removeUnwantedCards(cardName, originalSObject, originalUniqueId);

                    angular.forEach(cards, function (cardData) {
                        addCard(cardData);
                    });

                    // Need this event for template with paginations to be aware of record data update.
                    if($rootScope.emitCardChanges) {
                        $rootScope.$emit('vlocity.CardChanges', $scope.cards);
                    }
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
                    case 'DataRaptor':
                        angular.forEach(params, function(paramVal, paramKey) {
                            $scope.data.dataSource.value.inputMap[paramKey] = paramVal;
                        });
                        break;
                    case 'IntegrationProcedures':
                    case 'ApexRemote':
                        $scope.data.dataSource.value.vlocityAsync = params.vlocityAsync || $scope.data.dataSource.value.vlocityAsync;
                        $scope.data.dataSource.value.vlocityAsyncTimeout = params.vlocityAsyncTimeout || $scope.data.dataSource.value.vlocityAsyncTimeout;
                        delete params.vlocityAsync;
                        delete params.vlocityAsyncTimeout;
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
                    case 'Search':
                        $scope.data.dataSource.value.search = params.search || $scope.data.datasource.value.search;
                        break;
                    case 'StreamingAPI':
                        $scope.data.dataSource.value.channel = params.channel || $scope.data.datasource.value.channel;
                        break;
                    case 'Custom':
                        $scope.data.dataSource.value.body = params.body || $scope.data.datasource.value.body;
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
                    return dataSourceService.getData($scope.data.dataSource, $scope).then(
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
                        var paramVal = (parsed.queryKey[key] === decodeURIComponent(parsed.queryKey[key])) ? encodeURIComponent(parsed.queryKey[key]) : parsed.queryKey[key];
                        return key + '=' + paramVal;
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

                    angular.forEach(newRecords, function(record) {
                        var isCardMatch = true;
                        if($scope.cards && $scope.cards.length) {
                            for(var i=0; i< $scope.cards.length; i++){
                                existingCard = angular.copy($scope.cards[i]) || angular.copy($scope.initialCardDefinition[i]);
                                if (typeof record === 'object' && configService.checkFilter($scope, record, existingCard.filter)) {
                                    isCardMatch = true;
                                    if(!$scope.cards[i].obj){
                                        $scope.cards.splice($scope.cards.indexOf($scope.cards[i]),1);
                                    }
                                    break;
                                } else{
                                    isCardMatch = false;
                                }
                            } 
                        } else {
                            existingCard = angular.copy($scope.initialCardDefinition[0]);
                        }
                        if(isCardMatch){
                            existingCard.obj = null;
                            $log.debug(isAppend ? 'Appending ' : 'Prepending ', existingCard, newRecords);
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
                        }
                    });
                    //$scope.evaluateSessionVars();
                    return true;
                } else {
                    return false;
                }
            }

            /** 
             * The method removes card data for the extra cards of given name. 
             * If SObject exists, it keeps the card that has the given SObject and given uniqueId.
             * If SObject is not available, it removes all cards by the given name.
             * Its necessary to call this method on 'addCard' event of a Card as 
             * otherwise the Layout is not aware of the invalid/extra cards of a card datasource.
             */
            function removeUnwantedCards(cName, originalSObject, originalUniqueId ) {

                var matchCount = 0;

                for (var i = $scope.cards.length - 1; i >= 0; --i) {

                    var card = $scope.cards[i];

                    if(card.cardName == cName && originalSObject && card.obj) {
                            if((_.isEqual(card.obj, originalSObject) && card.uniqueId == originalUniqueId && matchCount == 1) || 
                                (_.isEqual(card.obj, originalSObject) && card.uniqueId != originalUniqueId) ||
                                (!_.isEqual(card.obj, originalSObject))) {
                                $scope.cards.splice(i, 1);
                            } else if (_.isEqual(card.obj, originalSObject) && card.uniqueId == originalUniqueId) {
                                matchCount = matchCount + 1;
                            }
                    } else if (card.cardName == cName && !originalSObject && card.obj) {
                        $scope.cards.splice(i, 1);
                    }
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
                    case 'lwcEvent':
                        var event = frameEventPayload.layoutName ? 'vlocity.layout.'+frameEventPayload.layoutName+'.events' : frameEventPayload.event;
                        $scope.$broadcast(event, frameEventPayload);
                        break;
                    default:
                        $log.debug('got a strange message ',e);
                }
            }

            /**
             * A way to communicate from Layout/cards to LWC
             * @param channel 
             * @param event
             * @param data
             */
            $scope.performLwcAction = function(channel, event, data) {
                if ('parentIFrame' in window) {
                    parentIFrame.sendMessage({
                        message:'lwc:event',
                        channel : channel,
                        event : event,
                        data : data
                    });
                }
            }

            $scope.trackInteraction = function(interactionType, extraData, trackKey) {
                var interactionData = interactionTracking.getDefaultTrackingData($scope);
                $log.debug('trackInteraction - interactionData ',interactionData, interactionType);
                var isTimed = false;
                var trackKey = trackKey ? trackKey : Date.now();
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
                interactionTracking.initInteraction(interactionData, isTimed, trackKey);
            }

            function loadLayout(src) {
                $log.debug('layout finished loading! ' + src, $scope.data);
                var layoutRecord, layoutParent;
                angular.forEach($scope.data.zones, function(zone){ 
                    angular.forEach(zone.layouts, function(layout){
                        layoutRecord = $interpolate('{{' + layout.records + '}}')($scope);
                        layout.records = layoutRecord ? JSON.parse(layoutRecord) : layout.records;
                        layoutParent = $interpolate('{{' + layout.parent + '}}')($scope);
                        layout.parent = layoutParent ? JSON.parse(layoutParent) : layout.parent;
                    });
                });
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
                $scope.objId = layout && layout.Id;
                $log.debug('handlelayoutloaded ',layout, $scope.objId);
                
                if (!layout) {
                    // try by Id
                    $log.error('configService.getLayout: layout inactive or undefined: ' + $scope.layoutName + ' - ID was: ' + $scope.layoutId);

                    if (!$scope.params.previewMode) {

                        $scope.inactiveError.inactiveEntityNameLabel = { label : 'CardFrameworkInactiveLayoutNameLabel', value : 'Layout Name' };
                        
                        if ($attrs.layoutType === 'flyout') {
                            $scope.inactiveError.associationType = { label : 'CardFrameworkInactiveAssociationTypeFlyout', value : 'flyout' };
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
                    dataSourceService.getData($scope.data.dataSource, $scope).then(
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
                            $scope.evaluateMetatags();
                            $log.debug('session variables ',$scope.session);
                            $log.debug('layout records ',$scope.records);
                            setCards(skipSetCards);
                            
                            $scope.datasourceStatus = {status: 'loaded'};
                            loadLayout('src');
                        },
                        function(err) {
                            $scope.evaluateSessionVars();
                            $scope.evaluateMetatags();
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
                    $scope.evaluateMetatags();
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
                                    return _.map(zone.zoneCards, 'globalKey').indexOf(card.globalKey) > -1;
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
                                    return _.map(zone.zoneCards, 'globalKey').indexOf(card.globalKey) > -1;
                                });
                            });
                            $log.debug('placed cards in zone ',$scope.data.zones);  
                        }
                    }

                    angular.forEach($scope.cards,function(card, order) {
                        card.order = order;
                    });

                    // Need this event for template with paginations to be aware of record data update.
                    if($rootScope.emitCardChanges) {
                        $rootScope.$emit('vlocity.CardChanges', $scope.cards);
                    }

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

            $scope.evaluateMetatags = function() {
                angular.forEach($scope.data[$rootScope.nsPrefix+'Definition__c'].metatagVars, function(metatag) {
                    try {
                        $log.debug('metatag ',metatag);
                        //To make sure metatag with unique name only gets added once to header.
                        var existingElem = $window.document.head.querySelector("meta[name='"+metatag.name+"'][data-custom='true']");
                        if(existingElem) {
                            existingElem.parentNode.removeChild(existingElem);
                        }
                        var tag = document.createElement('meta');
                        tag.name=metatag.name;
                        tag.content=$interpolate(metatag.val)($scope);
                        tag.dataset.custom = true;
                        $window.document.head.appendChild(tag);
                    } catch (e) {
                        $log.debug('could not set ',metatag, e);
                    }
                });
                $log.debug('metatag variables',$scope.session);
            };

            function addCard(cardData, sObject, parentCard, appendToEnd) {
                $log.debug('addCard-----------------------------------------------', $scope);
                //cardData.obj = sObject;
                var cindex;
                var czindex;
                $scope.cards = $scope.cards ? $scope.cards : [];
                $log.debug(cardData);
                if (appendToEnd) {
                    $scope.cards.push(cardData);
                } else {
                    var cardIndex = $scope.cards.map(function(x) {
                        //combining title and index for matching cards in the right place
                        return x.cardName + x.author + x.version + x.cardIndex;
                    }).indexOf(cardData.cardName + cardData.author + cardData.version + (cardData.cardIndex - 1));
                    $log.debug('::::index of card::::',cardIndex, cardData.title);
                    if ($scope.cards.length >= cardIndex + 1 && cardIndex !== -1) {
                        cindex = _.findIndex($scope.cards, function(o) { return o.uniqueId === cardData.uniqueId;});
                        if(cindex !== -1) {
                            if (!angular.equals($scope.cards[cindex].obj, cardData.obj)) {
                                $scope.cards[cindex] = cardData;
                            }
                        } else {
                            $scope.cards.splice(cardIndex + 1, 0, cardData);
                        }
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
                            return x.cardName + x.author + x.version + x.cardIndex;
                        }).indexOf(cardData.cardName + cardData.author + cardData.version + (cardData.cardIndex - 1));
                        $log.debug('::::index of card::::',zoneCardIndex, cardData.title);
                        if ($scope.data.zones[cardData.zone].cards.length >= zoneCardIndex + 1) {
                            czindex = _.findIndex($scope.data.zones[cardData.zone].cards, function (o) { return o.uniqueId === cardData.uniqueId; });
                            if (czindex !== -1) {
                                if(!angular.equals($scope.data.zones[cardData.zone].cards[czindex].obj, cardData.obj)) {
                                    $scope.data.zones[cardData.zone].cards[czindex] = cardData;
                                }
                            } else {
                                $scope.data.zones[cardData.zone].cards.splice(zoneCardIndex + 1, 0, cardData);
                            }
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
                                $scope.inactiveError.associationType = {label : 'CardFrameworkInactiveAssociationTypeFlyout', value: 'flyout'};    
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
                            $scope.inactiveError.inactiveEntityNameLabel = { label :'CardFrameworkInactiveTemplateNameLabel', value : 'Template Name'};
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

      this.$get = function($rootScope, dataService, actionService, $injector, $log, interactionTracking) {
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
            var inputMap = actionConfig.inputMap ? actionConfig.inputMap : action.inputMap;
            var optionsMap = actionConfig.optionsMap ? actionConfig.optionsMap : action.optionsMap;
            if(actionCallback) { actionCallback(); }

            if(className && classMethod) {
                inputMap.contextId = action.contextId;
                //Invoke VOI method
                dataService.doGenericInvoke(className, classMethod, angular.toJson(inputMap), angular.toJson(optionsMap)).then(
                function(data) {
                    //check if action is a context redirect
                    if(redirectByContext) {
                        try {
                            var device = window.outerWidth > 768 ? 'Web Client': 'Mobile';
                            var objId = data.records[0].id || data.records[0].Id;
                            var objType = data.records[0].objectType || 'All';
                            var soRecord = {Id: objId};
                            actionService.getActions(objType, soRecord, device, null, null).then(
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
                            $log.debug('error redirecting action ',e);
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
            // # added to the end of omniscript url makes it irresponsive when we add the url parameters after that
            var urlHelper = document.createElement('a');
            urlHelper.href = toBeLaunchedUrl;
            toBeLaunchedUrl = pathValid.test(toBeLaunchedUrl) ? toBeLaunchedUrl : urlHelper.pathname.replace(/(^\/?)/,'/') + urlHelper.search;
            if (actionConfig && actionConfig.extraParams) {
                angular.forEach(actionConfig.extraParams, function(paramVal, paramKey){
                    toBeLaunchedUrl = replaceUrlParam(toBeLaunchedUrl, paramKey, paramVal);
                });
            }
            toBeLaunchedUrl += urlHelper.hash;
            basicUrl = toBeLaunchedUrl;
            $log.debug('Opening action url ' + toBeLaunchedUrl);

            //If url is undefined, return. If we need to handle other new variations apart from url launch
            //like methods or classname, add the check here to bypass
            if (!toBeLaunchedUrl) {
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
                $log.debug('external url: ' + toBeLaunchedUrl);
            }

            selRecordEvent = $rootScope.$$listeners['actionSelected'];
            if (selRecordEvent && !externalUrl) {
                $log.debug('firing event :: actionSelected');
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
                            sforce.one.navigateToURL(toBeLaunchedUrl, actionConfig.closeTab || false);
                        }

                    } else {
                        windowOpen(toBeLaunchedUrl, params, action);
                    }

                }
            } else {
                windowOpen(toBeLaunchedUrl, params, action);
            }
            interactionTracking.doneInteraction(actionConfig.extraParams.trackKey);
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
.factory('configService', function(remoteActions, force, $rootScope, nameSpaceService, debugService, $q, vlocTemplateInternalCache, $log, $interval , $interpolate, dataService, cometd) {
    'use strict';
    $log = $log.getInstance ? $log.getInstance('CardFramework: configService') : $log;
    var cometDPromise;

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
        var dataPackString = JSON.stringify(datapack).replace(/%vlocity_namespace%__/g, $rootScope.nsPrefix ? $rootScope.nsPrefix : '');
        dataPackString = dataPackString.replace(/%vlocity_namespace%/g, $rootScope.nsPrefix ? $rootScope.nsPrefix.substring(0 , $rootScope.nsPrefix.length - 2) : '');
        datapack = JSON.parse(dataPackString);
        $log.debug('loading datapack nsPrefix',$rootScope.nsPrefix,' datapack ',datapack);
        $rootScope.vlocityCards = $rootScope.vlocityCards || {};
        processDataPack(datapack.data.dataPacks);
        q.resolve(true);

        return q.promise;
    };

    function processDataPack(packs){
        var success = true;
        var nsPrefixMask = $rootScope.nsPrefix ? $rootScope.nsPrefix : '';
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
        if(!$rootScope.vlocityCards || !$rootScope.vlocityCards.cachedLayouts || !$rootScope.vlocityCards.cachedLayouts[layoutName]) {
            q.reject(null);
            return q.promise;
        }

        layout = $rootScope.vlocityCards.cachedLayouts[layoutName];
        //var nsPrefix = '%vlocity_namespace%__';
        var nsPrefix = $rootScope.nsPrefix ? $rootScope.nsPrefix : '';
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
                    try {
                        cardDefinition = angular.isString(card[nsPrefix + 'Definition__c']) ? JSON.parse(card[nsPrefix + 'Definition__c']) : card[nsPrefix + 'Definition__c'];
                        //parse until object as safe guard to fix broken card
                        while (angular.isString(cardDefinition)) {
                            cardDefinition = JSON.parse(cardDefinition);
                        }
                    } catch (e) {
                        $log.debug('Loaded a bad Card definition for ' + card.Name, card[$rootScope.nsPrefix + 'Definition__c'], e);
                    }
                }
                cardDefinition.layoutName = 'vlocity.layout.'+layout.Name; //need to know the parent name
                cardDefinition.cardName = card.Name;
                cardDefinition.globalKey = card[nsPrefix + 'GlobalKey__c'];
                cardDefinition.author = card[nsPrefix + 'Author__c'] ? card[nsPrefix + 'Author__c'] : '';
                cardDefinition.version = card[nsPrefix + 'Version__c'] ? card[nsPrefix + 'Version__c'] : '';
                card[nsPrefix + 'Definition__c'] = cardDefinition;
       
                var cardIndex = layout[nsPrefix + 'Definition__c'].Cards.indexOf(card.Name);
                if (cardIndex > -1) {
                    // console and community only use cardDefinition
                    layout.Deck[cardIndex] = cardDefinition;
                }
                if(layout.zones){
                    angular.forEach(layout.zones, function(zone){
                        zone.cardNames = zone.cardNames ? zone.cardNames : [];
                        $log.debug('zone match ',card[nsPrefix + 'Definition__c'].cardName, zone.cardNames, zone.cardNames.indexOf(card[nsPrefix + 'Definition__c'].cardName));
                        if(_.map(zone.zoneCards, 'globalKey').indexOf(cardDefinition.globalKey) > -1) {
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
                            if (typeof filterObject[field] !== 'object' && (($interpolate(filterObject[field])(scope) != _.get(sObject, field )) && (stringToBoolean($interpolate(filterObject[field])(scope)) != _.get(sObject, field)))) {
                                isFieldMatch = false;
                            }
                            // special condition when filter value is null
                            // And when value is hardcoded directly in the filter
                            if(isFieldMatch == true) {
                                if((filterObject[field].toLowerCase() === 'null' &&  _.get(sObject, field) === null) || (stringToBoolean(filterObject[field]) == stringToBoolean(_.get(sObject, field)))) {
                                    isFieldMatch = true;
                                }
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
        if($rootScope.vlocityCards.customSettings && typeof $rootScope.vlocityCards.customSettings['Track.'+trackingEvent] !== "undefined" ){
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
                    // Setting tracking event by default to false which is not there in custom settings to avoid multiple apex call for the same
                    $rootScope.vlocityCards.customSettings['Track.' + trackingEvent] = typeof $rootScope.vlocityCards.customSettings['Track.' + trackingEvent] === "undefined" ? false : $rootScope.vlocityCards.customSettings['Track.' + trackingEvent];
                    $log.debug('vlocity custom settings ',$rootScope.vlocityCards.customSettings);
                    return $rootScope.vlocityCards.customSettings['Track.'+trackingEvent] || false;

                }, function(err){
                    $log.debug('vlocity settings err ',err);
                    $rootScope.vlocityCards.customSettings = $rootScope.vlocityCards.customSettings || {};
                    return false;
            });
        }
    }

    function stringToBoolean(value){
        if(typeof value !== 'string'){
            return value;
        }
        switch(value.toLowerCase().trim()){
            case "true": return true;
            case "false": return false;
            default: return value;
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
                var payload = {
                    sClassName: (fileNsPrefixDot() ? fileNsPrefixDot() : '') + "CardCanvasController",
                    sMethodName: "getAllLayouts",
                    input: '{}',
                    options: '{}'
                };

                return dataService.doGenericInvoke(payload.sClassName, payload.sMethodName, payload.input, payload.options).then(
                    function (data) {
                        var layouts = data.result;
                        var layoutList = [];
                        angular.forEach(layouts, function (layout) {
                            layout[nsPrefix + 'Definition__c'] = JSON.parse(layout[nsPrefix + 'Definition__c']);
                            layoutList.push(layout);
                        });
                        return layoutList;
                    }, makeErrorHandler('layouts retrieval error: '));
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
                //Now checking for local instances for layouts first and then moving ahead to actually fetch them if not found.
                if($rootScope.vlocityCards && $rootScope.vlocityCards.cachedLayouts && $rootScope.vlocityCards.cachedLayouts[layoutName]) {
                    return fetchLayoutFromVlocCache(layoutName);
                } else if (typeof remoteActions !== 'undefined' && remoteActions !== null &&
                    remoteActions['getLayout'] &&
                    remoteActions['getCardsByNames'] && typeof Visualforce !== 'undefined') {
                    return this.getLayoutViaRemoting('Name', layoutName);
                } else if (force.isAuthenticated()) {
                    return this.getLayoutViaApi('Name', layoutName).then(
                        function (layout) {
                            return layout;
                        });
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
                return this.getLayoutViaApi('Id', layoutId).then(
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

                                var previewType = layout[nsPrefix + 'Definition__c'].previewType ? layout[nsPrefix + 'Definition__c'].previewType : 'runTime';

                                //To handle the case when layout is active and design time view is disabled for the user.
                                if(layout[nsPrefix + 'Active__c']) {
                                    layout[nsPrefix + 'Definition__c'].previewType = 'runTime';
                                    previewType = layout[nsPrefix + 'Definition__c'].previewType;
                                } else {
                                    previewType = layout[nsPrefix + 'Definition__c'].previewType ? layout[nsPrefix + 'Definition__c'].previewType : 'runTime';
                                }

                                function previewLayoutDeck(data) {
                                    var cards = data;
                                    //pre-filling array with nulls to make sure cards get added to the right index in the Deck array
                                    var cardsLength = cards.length > cardNames.length ? cardNames.length : cards.length;
                                    layout.Deck = _.fill(new Array(cardsLength), null);

                                    angular.forEach(cards, function(card) {
                                        var cardDefinition = {Cards:[]};
                                        if (card[nsPrefix + 'Definition__c']) {
                                            try {
                                                cardDefinition = angular.isString(card[nsPrefix + 'Definition__c']) ? JSON.parse(card[nsPrefix + 'Definition__c']) : card[nsPrefix + 'Definition__c'];
                                                //parse until object as safe guard to fix broken card
                                                while (angular.isString(cardDefinition)) {
                                                    cardDefinition = JSON.parse(cardDefinition);
                                                }
                                            } catch (e) {
                                                $log.debug('Loaded a bad Card definition for ' + card.Name, card[$rootScope.nsPrefix + 'Definition__c'], e);
                                            }
                                        }
                                        cardDefinition.cardName = card.Name;
                                        cardDefinition.cardId = card.Id;
                                        cardDefinition.layoutName = 'vlocity.layout.'+layout.Name; //need to know the parent name
                                        cardDefinition.globalKey = card[nsPrefix + 'GlobalKey__c'];
                                        cardDefinition.author = card[nsPrefix + 'Author__c'] ? card[nsPrefix + 'Author__c'] : '';
                                        cardDefinition.version = card[nsPrefix + 'Version__c'] ? card[nsPrefix + 'Version__c'] : '';
                                        card[nsPrefix + 'Definition__c'] = cardDefinition;
                                        var cardIndex = previewType === 'runTime' ? layout[nsPrefix + 'Definition__c'].Cards.indexOf(card.Name) : layout[nsPrefix + 'Definition__c'].workspace.indexOf(card[nsPrefix + 'GlobalKey__c']);
                                        if (cardIndex > -1) {
                                            // console and community only use cardDefinition
                                            layout.Deck[cardIndex] = cardDefinition;
                                        }
                                        if(layout.zones){
                                            angular.forEach(layout.zones, function(zone){
                                                zone.cardNames = zone.cardNames ? zone.cardNames : [];
                                                $log.debug('zone match ',card[nsPrefix + 'Definition__c'].cardName, zone.cardNames, zone.cardNames.indexOf(card[nsPrefix + 'Definition__c'].cardName));
                                                if(_.map(zone.zoneCards, 'globalKey').indexOf(cardDefinition.globalKey) > -1) {
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
                                }

                                var cardNames, actionName;
                                if (previewType === 'runTime') {
                                    cardNames = layout[nsPrefix + 'Definition__c'].Cards || [];
                                    actionName = 'getActiveCardsByNames';
                                } else {
                                    cardNames = layout[nsPrefix + 'Definition__c'].workspace || [];
                                    actionName = 'getCardsByGlobalKeys';
                                }

                                if (cardNames.length > 0) {
                                    return remoteActions[actionName](cardNames).then(
                                    previewLayoutDeck, makeErrorHandler('cards retrieval error: '));
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
        getLayoutViaApi: function (searchCriterionType, searchCriterion) {
            var inputMap = {
                searchCriterionType: searchCriterionType,
                searchParam: searchCriterion
            }
            var payload = {
                sClassName: (fileNsPrefixDot() ? fileNsPrefixDot() : '') + "CardCanvasController",
                sMethodName: "getLayout",
                input: JSON.stringify(inputMap),
                options: '{}'
            };
            return nameSpaceService.getNameSpacePrefix().then(
                function (nsPrefix) {
                    return dataService.doGenericInvoke(payload.sClassName, payload.sMethodName, payload.input, payload.options).then(
                        function (data) {
                            if (data.result.length > 0) {
                                var layout = data.result[0];

                                while (typeof layout[nsPrefix + 'Definition__c'] !== 'object') { //making sure we parse the json
                                    layout[nsPrefix + 'Definition__c'] = JSON.parse(layout[nsPrefix + 'Definition__c']);
                                }

                                layout.templates = layout[nsPrefix + 'Definition__c'].templates;
                                layout.dataSource = layout[nsPrefix + 'Definition__c'].dataSource;
                                layout.Loaded = false;
                                layout.session = {};
                                layout.sessionVars = layout[nsPrefix + 'Definition__c'].sessionVars || [];
                                layout.zones = layout[nsPrefix + 'Definition__c'].zones;

                                var cardNames = layout[nsPrefix + 'Definition__c'].Cards || [];
                                if (cardNames.length > 0) {

                                    var payloadCard = {
                                        sClassName: (fileNsPrefixDot() ? fileNsPrefixDot() : '') + "CardCanvasController",
                                        sMethodName: "getActiveCardsByNames",
                                        input: JSON.stringify({
                                            cardNames: cardNames.join(",")
                                        }),
                                        options: '{}'
                                    };

                                    return dataService.doGenericInvoke(payloadCard.sClassName, payloadCard.sMethodName, payloadCard.input, payloadCard.options).then(
                                        function (data) {
                                            var cards = data.result;
                                            //pre-filling array with nulls to make sure cards get added to the right index in the Deck array
                                            var cardsLength = cards.length > cardNames.length ? cardNames.length : cards.length;
                                            layout.Deck = _.fill(new Array(cardsLength), null);

                                            angular.forEach(cards, function (card) {
                                                var cardDefinition = {
                                                    Cards: []
                                                };
                                                if (card[nsPrefix + 'Definition__c']) {
                                                    try {
                                                        cardDefinition = angular.isString(card[nsPrefix + 'Definition__c']) ? JSON.parse(card[nsPrefix + 'Definition__c']) : card[nsPrefix + 'Definition__c'];
                                                        //parse until object as safe guard to fix broken card
                                                        while (angular.isString(cardDefinition)) {
                                                            cardDefinition = JSON.parse(cardDefinition);
                                                        }
                                                    } catch (e) {
                                                        $log.debug('Loaded a bad Card definition for ' + card.Name, card[$rootScope.nsPrefix + 'Definition__c'], e);
                                                    }
                                                }
                                                cardDefinition.cardId = card.Id;
                                                cardDefinition.layoutName = 'vlocity.layout.' + layout.Name; //need to know the parent name
                                                cardDefinition.cardName = card.Name;
                                                cardDefinition.globalKey = card[nsPrefix + 'GlobalKey__c'];
                                                cardDefinition.author = card[nsPrefix + 'Author__c'] ? card[nsPrefix + 'Author__c'] : '';
                                                cardDefinition.version = card[nsPrefix + 'Version__c'] ? card[nsPrefix + 'Version__c'] : '';
                                                card[nsPrefix + 'Definition__c'] = cardDefinition;
                                                var cardIndex = layout[nsPrefix + 'Definition__c'].Cards.indexOf(card.Name);
                                                if (cardIndex > -1) {
                                                    // console and community only use cardDefinition
                                                    layout.Deck[cardIndex] = cardDefinition;
                                                }
                                                if (layout.zones) {
                                                    angular.forEach(layout.zones, function (zone) {
                                                        zone.cardNames = zone.cardNames ? zone.cardNames : [];
                                                        $log.debug('zone match ', card[nsPrefix + 'Definition__c'].cardName, zone.cardNames, zone.cardNames.indexOf(card[nsPrefix + 'Definition__c'].cardName));
                                                        if (_.map(zone.zoneCards, 'globalKey').indexOf(cardDefinition.globalKey) > -1) {
                                                            card[nsPrefix + 'Definition__c'].zone = zone.name;
                                                            $log.debug('matching zone ', zone.name, card[nsPrefix + 'Definition__c']);
                                                        }
                                                    });
                                                }
                                            });

                                            layout.Deck = layout.Deck.filter(function (card) {
                                                return card !== null;
                                            });

                                            sessionStorage.setItem('layout::' + layout.Name, JSON.stringify(layout));
                                            layout.Loaded = true;
                                            return layout;
                                        },
                                        function (error) {
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

                        var payload = {
                            sClassName: (fileNsPrefixDot() ? fileNsPrefixDot() : '') + "CardCanvasController",
                            sMethodName: "getCards",
                            input: '{}',
                            options: '{}'
                        };

                        return dataService.doGenericInvoke(payload.sClassName, payload.sMethodName, payload.input, payload.options).then(
                            function (data) {
                                var cards = data.result;
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

                            var payload = {
                                sClassName: (fileNsPrefixDot() ? fileNsPrefixDot() : '') + "CardCanvasController",
                                sMethodName: "getCardByName",
                                input: JSON.stringify({
                                    cardName: cardName
                                }),
                                options: '{}'
                            };

                            return dataService.doGenericInvoke(payload.sClassName, payload.sMethodName, payload.input, payload.options).then(
                                function (data) {
                                    if (data && data.result.length > 0) {
                                        var card = data.result[0];
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
                var payload = {
                    sClassName: (fileNsPrefixDot() ? fileNsPrefixDot() : '') + "CardCanvasController",
                    sMethodName: "getStaticResourcesUrl",
                    input: '{}',
                    options: '{}'
                };

                return dataService.doGenericInvoke(payload.sClassName, payload.sMethodName, payload.input, payload.options).then(
                    function (data) {
                        var resourceList = data.result;
                        var resourceMap = {};
                        angular.forEach(resourceList, function (st) {
                            var namespace = st.NamespacePrefix;
                            var systemTimeStamp = new Date(st.SystemModstamp);
                            var systemTimeStampInSec = systemTimeStamp.getTime();
                            resourceMap[st.Name] = '/resource/' + systemTimeStampInSec + '/' + (namespace !== null && namespace !== '' ? namespace + '__' : '') + st.Name;
                        });
                        return resourceMap;
                    }, makeErrorHandler('getStaticResourcesUrl retrieval error: '));
            }
        },

        initCometD: function() {
            if (cometDPromise) {
                return cometDPromise;
            }

            var q = $q.defer();
            cometDPromise = q.promise;

            if (typeof cometd != 'undefined' && typeof sessionId != 'undefined' && $rootScope.enableCometD) {
                cometd.websocketEnabled = false;
                var auth = 'OAuth ' + sessionId;
                var cometdURL = window.location.protocol + '//' + window.location.hostname + (null != window.location.port ? (':' + window.location.port) : '') + '/cometd/41.0/';
                cometd.configure({
                    url: cometdURL,
                    requestHeaders: { Authorization: auth }
                });

                cometd.addListener('/meta/handshake', function (message) {
                    if (message.successful) {
                        $rootScope.readyToSubscribe = true;
                        q.resolve(true);
                    } else {
                        q.reject('bad handshake');
                    }
                });
                cometd.handshake();
            } else {
                q.reject('cometd not enabled');
            }

            return q.promise;
        },

        isRunningOnDesktop: function() { 
            return typeof Visualforce !== 'undefined'; 
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
            actionService.getActionsByName(getSObjectType(obj, pickedState), soRecord, device, null, null, $log, actionNames)    
                .then(function(actions) {
                    actions = actions.data ? actions.data : actions;
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
angular.module("CardFramework").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("displayInactiveError.tpl.html","<style>\n[layout-type=flyout] > ng-include[src='\\'displayInactiveError.tpl.html\\'']:before {\n    width: 1rem;\n    height: 1rem;\n    position: absolute;\n    transform: rotate(45deg);\n    content: '';\n    background-color: inherit;\n    left: 50%;\n    top: -.5rem;\n    margin-left: -.5rem;\n}\n\n[layout-type=flyout] > ng-include[src='\\'displayInactiveError.tpl.html\\'']:after {\n    width: 1rem;\n    height: 1rem;\n    position: absolute;\n    transform: rotate(45deg);\n    content: '';\n    background-color: #FFF;\n    left: 50%;\n    top: -.4rem;\n    margin-left: -.5rem;\n    box-shadow: -1px -1px 0 0 rgba(0,0,0,.16);\n    z-index: 0;\n}\n</style>\n<div class='panel panel-default script-not-found'>\n    <div class='panel-body'>\n        <div class=\"text-danger\">\n            <span class=\"icon-v-close-circle\"></span>\n            <b class=\"has-error\">{{::$root.vlocity.getCustomLabel( inactiveError.header.label , inactiveError.header.value )}}:</b>\n        </div>\n        <br/>\n        <div>\n            <label>{{::$root.vlocity.getCustomLabel(inactiveError.errorMsg.label, inactiveError.errorMsg.value)}}</label>\n            <br/>\n            <div>\n                <span>\n                    <b>{{::$root.vlocity.getCustomLabel(inactiveError.inactiveEntityNameLabel.label, inactiveError.inactiveEntityNameLabel.value)}}: </b><label>{{inactiveError.inactiveEntityName}}</label>\n                    <br/>\n                </span>\n                <span ng-if=\"inactiveError.associationFlag\">\n                    <b>{{::$root.vlocity.getCustomLabel(inactiveError.associationNameLabel.label, inactiveError.associationNameLabel.value)}}: </b><label>{{inactiveError.associationName}}</label>\n                    <br/>\n                    <b>{{::$root.vlocity.getCustomLabel(inactiveError.associationTypeLabel.label , inactiveError.associationTypeLabel.value)}}: </b><label>{{::$root.vlocity.getCustomLabel(inactiveError.associationType.label, inactiveError.associationType.value)}}</label>\n                </span>\n            </div>\n            <br/>\n            <label>{{::$root.vlocity.getCustomLabel(inactiveError.contactAdminMsg.label, inactiveError.contactAdminMsg.value)}}</label>\n        </div>\n    </div>\n</div>"),$templateCache.put("vlocCardIcon.tpl.html","<span ng-class=\"!isSldsIcon && data.vlocityIcon ? 'icon ' + data.vlocityIcon + ' ' + internalExtraClasses : 'slds-icon__container ' + (sprite == 'standard' || sprite == 'custom' ? 'slds-icon-' + sprite + '-' + icon : '')\">\n"+'    <slds-svg-icon sprite="sprite" icon="icon" size="size" extra-classes="internalExtraClasses" no-hint="true" ng-if="isSldsIcon"></slds-svg-icon>\n</span>'),$templateCache.put("vlocCardIconSimple.tpl.html",'<svg aria-hidden="true" class="slds-icon slds-icon--{{size}} {{internalExtraClasses}}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">\n    <use xlink:href=""></use>\n</svg>')}]);

},{}]},{},[1]);
})();

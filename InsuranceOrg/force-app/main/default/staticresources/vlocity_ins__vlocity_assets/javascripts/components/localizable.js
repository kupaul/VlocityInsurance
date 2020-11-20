/**
 * vlocity.localizable
 * @author Matt Goldspink <mgoldspink@vlocity.com>
 *
 * This provider allows simple configuration of Localizing Strings using Salesforce Labels.
 *
 * First setup your labels in your Apex Page like so
 *
 *   var i18n = {
 *    MyFirstLabel: '{!Label.MyFirstLabel}',
 *    AnotherLabel: '{!Label.AnotherLabel}'
 *   }
 *
 * Then in your Angular module you need to configure it like so:
 *
 *   angular.module('myApp', ['vlocity'])
 *    .config(['$localizableProvider', function($localizableProvider){
 *        $localizableProvider.setLocalizedMap(window.i18n);
 *        $localizableProvider.setDebugMode(true);
 *    }]);
 *
 * You can then use the filter in your pages like so:
 *
 *    <h3>{{ 'MyFirstLabel' | localize }}</h3>
 *
 * You can also provide a default String incase the key isn't defined in the current locale
 *
 *    <h3>{{ 'MyFirstLabel' | localize:'A Default Value' }}</h3>
 *
 * Or if you need to use it in a controller:
 *
 *   angular.module('myApp')
 *     .controller('mycontroller', ['$localizable', '$scope', function($localizable, $scope) {
 *        $scope.someLabel = $localizable('MyFirstLabel', 'A default value if one isn't available');
 *     }]);
 *
 */
'use strict';
if (!window.console) {
  window.console = {};
}
if (!window.console.log) {
  window.console.log = function() {};
}
if (!window.console.warn) {
  window.console.warn = function() {};
}

var FORCE_SYNC_KEY = new Object();

angular.module('vlocity')
  .provider('$localizable', function $LocalizableProvider(){

    var map = {}, 
        asyncMode = true;

    // preprime our map of resolved values.
    this.setLocalizedMap = function(localizedMap) {
      map = localizedMap || {};
    };

    this.setDebugMode = function() {};

    this.setSyncModeOnly = function() {
      asyncMode = false;
    };

    this.$get = function $LocalizableFactory(remoteActions, $rootScope, $timeout, $q) {
      var pendingTimeoutToken, requestedLabels = {},
          pendingLabels = {}, pendingLabelPromise = {};

      /* Merge cachedLabels with those from the localizedMap - localizedMap takes priority */
      var cachedLabels = JSON.parse(sessionStorage.getItem('vlocity.customLabels')) || {};
      $rootScope.vlocity = ($rootScope.vlocity || {});
      $rootScope.vlocity.customLabels = map = _.merge(map, cachedLabels);

      function requestLabel(pendingLabels) {
        if (remoteActions.getCustomLabels) {
            return remoteActions.getCustomLabels(pendingLabels, null)
            .then(function(allLabels) {
                var labelResult = JSON.parse(allLabels) || {};
                if (labelResult.messages && labelResult.messages.length > 0) {
                  labelResult.messages.forEach(function(message) {
                    if (message.severity === "ERROR" ) {
                      throw new Error(message.message);
                    }
                  });
                }
                if (labelResult.data) {
                    $rootScope.vlocity.userLanguage = labelResult.data.language.toLowerCase().replace('_','-');
                    labelResult = labelResult.data;
                }
                Object.keys(labelResult).forEach(function(labelName) {
                  if (labelName !== 'language') {
                    map[labelName] = labelResult[labelName] || requestedLabels[labelName];
                    requestedLabels[labelName] = undefined;
                    map[labelName] = map[labelName] || {};
                    if (angular.isString(map[labelName])) {
                      // update existing key to be based on userSfLocale
                      var labelValue = map[labelName];
                      map[labelName] = {};
                      map[labelName][$rootScope.vlocity.userLanguage] = labelValue;
                    }
                    map[labelName][$rootScope.vlocity.userLanguage] = labelResult[labelName];
                  }
                });
                $rootScope.$emit('vlocity.labelRetrieved', Object.keys(labelResult));
            }).catch(function(error) {
                if (pendingLabels.length > 1) {
                    var splitAt = Math.round(pendingLabels.length/2);
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
            }).finally(function() {
                // sync back to sessionStorage
                sessionStorage.setItem('vlocity.customLabels', JSON.stringify(map));
            });
        } else if(typeof force != 'undefined' && force.apexrest) {
          var language = $rootScope.vlocity.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage;
          //normalize between locale formats : en_US and en-us
          language = language.toLowerCase().replace('_','-');

          $rootScope.vlocity.userLanguage = language;

          var apexRestUrlBase = '/v1/usercustomlabels?names=' + pendingLabels.join(',') + '&language=' + language;

          var apexRestUrlNameSpacePrefix = (fileNsPrefix() == '') ? '' : '/' + fileNsPrefix().replace('__','');

          var apexRestUrl = apexRestUrlNameSpacePrefix + apexRestUrlBase;

          return force.apexrest({
              path: apexRestUrl
          }).then(
              function(labelsMap) {
                  var labelsDataMap = labelsMap.data.data || labelsMap.data;
                  if(labelsDataMap) {
                      $rootScope.vlocity.userLanguage = $rootScope.vlocity.userLanguage.replace('_','-');
                      for (var key in labelsDataMap) {
                          if(key != 'language'){
                              map[key] = map[key] || {};
                              map[key][$rootScope.vlocity.userLanguage] = labelsDataMap[key];    
                          }
                      }
                  }
              },
              function(error) {
              }
          );
        }
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
          pendingTimeoutToken = $timeout(function() {
              var keys = Object.keys(pendingLabels);
              keys.forEach(function(key) {
                  requestedLabels[key] = pendingLabels[key];
              });
              requestLabel(keys)
                .finally(function() {
                  keys.forEach(function(key) {
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
        if (angular.isString(map[sanitizedKey])) {
          result = map[sanitizedKey];
        } else if (angular.isObject(map[sanitizedKey])) {
          result = map[sanitizedKey][$rootScope.vlocity.userLanguage];
        }
        // if we don't have a result return 'undefined' so angular won't hand out a default
        if (!result) {
          if(asyncMode) {
            if(remoteActions.getCustomLabels || (typeof force != "undefined" && force.apexrest)){
              // here we need to trigger a request for the value.
              return getLabel(sanitizedKey, defaultString)
              .then(function(result) {
                if (aliasArgs.length > 2 && angular.isString(result)) {
                  // need to replace tokens
                  result = result.replace(/\{(\d+)\}/g, function(match, number) {
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
            } else {
                 result = defaultString;
            }
          } else {
            result = defaultString;
          }
        }
        if (aliasArgs.length > 2) {
          // need to replace tokens
          result = result.replace(/\{(\d+)\}/g, function(match, number) {
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
        } else if(typeof(this) !== 'undefined') {
            return result;
        } else {
            return $q.resolve(result);
        }
      }
      return localizeFn;
    };
  })
  .run(['$localizable', '$rootScope', 'remoteActions', '$q', function($localizable, $rootScope, remoteActions, $q) {
      $rootScope.vlocity = ($rootScope.vlocity || {});
      if (!$rootScope.vlocity.userSfLocale) {
        //set default + normalize between locale formats : en_US and en-US
        $rootScope.vlocity.userSfLocale = (navigator.language || navigator.browserLanguage || navigator.systemLanguage).toLowerCase().replace('_','-');
      }
      //setting userLanguage as well
      if (!$rootScope.vlocity.userLanguage) {
        //set default + normalize between locale formats : en_US and en-US
        $rootScope.vlocity.userLanguage = (navigator.language || navigator.browserLanguage || navigator.systemLanguage).toLowerCase().replace('_','-');
      }

      if (!remoteActions.getCustomLabels) {
        console.warn('Remote Action for getCustomLabels has not been registered. Will not be able to dynamically fetch labels.');
      }

      // register our global function on the rootScope
      // this will return undefined if there is no resolved value yet
      // this allows for use of Angular's one time binding
      // e.g. {{::$root.vlocity.getCustomLabel('SomeLabel')}}
      $rootScope.vlocity.getCustomLabel = function() {
        var args = Array.prototype.slice.call(arguments);
        args.push(FORCE_SYNC_KEY);
        var result = $localizable.apply(this, args);
        if (!angular.isString(result)) {
          return undefined;
        } else {
          return result;
        }
      };

      $rootScope.vlocity.getCustomLabelSync = function() {
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
          return args[1].replace(/\{(\d+)\}/g, function(match, number) {
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

      $rootScope.vlocity.getCustomLabels = function() {
        var args = Array.prototype.slice.call(arguments);
        return $q.all(
          args.map(function(labelName) {
            return $q.when($localizable(labelName));
          })
        );
      };
  }])
  .filter('localize', function($rootScope) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        return $rootScope.vlocity.getCustomLabelSync.apply($rootScope.vlocity, args);
    };
  })
  .filter('dynamicLocalize', function($rootScope) {
    $localizable.$stateful = true;
    return function() {
        var args = Array.prototype.slice.call(arguments);
        return $rootScope.vlocity.getCustomLabel.apply($rootScope.vlocity, args);
    };
  });

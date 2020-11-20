/* globals Visualforce, alert */
/**
 * vlocity.remoteActions
 * @author Matt Goldspink <mgoldspink@vlocity.com>
 *
 * This provider simplifies the logic of communicating to RemoteActions
 * on an Apex backend from a seperate .resource file by allowing the
 * available RemoteActions to be configured as a JSON object in the Apex
 * page in the format:
 *
 *   var remoteActions = {
 *    GetMapping: '{!RemoteAction.ControllerName.GetMappingRemoteActionName}',
 *    SaveMapping: '{!RemoteAction.ControllerName.SaveMappingRemoteActionName}'
 *   }
 *
 * Then in your Angular module you need to configure it like so:
 *
 *   angular.module('myApp', ['vlocity'])
 *    .config(['remoteActionsProvider', function(remoteActionsProvider){
 *        remoteActionsProvider.setRemoteActions(remoteActions);
 *    }]);
 *
 * You can then call services in the following manner:
 *
 *   angular.module('myApp')
 *     .controller('mycontroller', ['remoteActions', function(remoteActions) {
 *         remoteActions.GetMapping('mappingId').then(function(mapping){
 *           // handle the result
 *         });
 *     }]);
 *
 */
angular.module('vlocity')
  .provider('remoteActions', ['$qProvider', function RemoteActionsProvider($q){
    'use strict';

    var remoteActions = {},
        mockedRemoteActions;

    try {
      VFExt3.Direct.on('exception', function(e) {
        if (e.transaction && e.transaction.cb && e.code === 'xhr') {
          e.transaction.cb(e.result, e);
        }
      });
    } catch (e) {}

    this.setRemoteActions = function(remoteActionsParam) {
      Object.keys(remoteActionsParam).forEach(function(key) {
        if (remoteActions[key]) {
          console.warn('Overriding existing remoteActions definition ' + key);
        }
        remoteActions[key] = remoteActionsParam[key];
      });
    };

    this.setMockedRemoteActions = function(mockedRemoteActionsParam) {
      mockedRemoteActions = mockedRemoteActionsParam;
    };

    this.$get = ['$q', '$rootScope', function RemoteActionsFactory($q, $rootScope) {
      var inMockMode = !!mockedRemoteActions;
      var serviceObject = {};
      var recordedServiceCalls = {};

      function doDigest() {
        if(!$rootScope.$$phase) {
          $rootScope.$apply();
        } else {
          setTimeout(doDigest, 10);
        }
      }

      angular.forEach((inMockMode ? mockedRemoteActions : remoteActions), function(value, key) {
        if (inMockMode) {
          serviceObject[key] = function() {
            if (!recordedServiceCalls[key]) {
              recordedServiceCalls[key] = [];
            }
            var invokeArgs = arguments;
            return $q(function(resolve){
              recordedServiceCalls[key].push(invokeArgs);
              resolve(angular.isFunction(value) ? value.apply(this, invokeArgs) : value);
              setTimeout(function() {
                doDigest();
              }, 10);
            });
          };
        } else {
          serviceObject[key] = function() {
            var config = value;
            if (angular.isString(config)) {
              config = {
                action: config
              };
            }
            var invokeArgs = [config.action],
              deferred = $q.defer();
            for (var i = 0; i < arguments.length; i++) {
              invokeArgs.push(arguments[i]);
            }
            invokeArgs.push(function(result, event){
              /* by default let's handle STORAGE_LIMIT_EXCEEDED globally for all apps */
              if (!result && event.status === false && ((event.errors && event.errors.length > 0) || event.type === 'exception')) {
                if (event.type === 'exception' && /STORAGE_LIMIT_EXCEEDED/.test(event.message)) {
                  alert(event.message + '.\n You can increase your storage limit by contacting Salesforce or deleting unwanted data.');
                } else if (event.errors && angular.isArray(event.errors)) {
                  event.errors.forEach(function(error){
                    if (error.status === 'STORAGE_LIMIT_EXCEEDED') {
                      alert(error.message + '.\n You can increase your storage limit by contacting Salesforce or deleting unwanted data.');
                    }
                  });
                }
              }
              if (event.statusCode < 400) {
                deferred.resolve(result);
              } else {
                deferred.reject(event);
              }
            });
            if (angular.isObject(config.config)) {
              invokeArgs.push(config.config);
            }
            var invokeAction = Visualforce.remoting.Manager.invokeAction;
            invokeAction.apply(Visualforce.remoting.Manager, invokeArgs);
            return deferred.promise;
          };
        }
      });

      if (inMockMode) {
        serviceObject.recordedServiceCalls = recordedServiceCalls;
      }
      return serviceObject;
    }];
}]);
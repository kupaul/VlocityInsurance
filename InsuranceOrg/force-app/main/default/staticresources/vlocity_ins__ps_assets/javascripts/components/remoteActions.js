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
 *    GetMapping: "{!RemoteAction.ControllerName.GetMappingRemoteActionName}",
 *    SaveMapping: "{!RemoteAction.ControllerName.SaveMappingRemoteActionName}"
 *   }
 *
 * Then in your Angular module you need to configure it like so:
 *
 *   angular.module("myApp", ["vlocity"])
 *    .config(["remoteActionsProvider", function(remoteActionsProvider){
 *        remoteActionsProvider.setRemoteActions(remoteActions);
 *    }]);
 *
 * You can then call services in the following manner:
 *
 *   angular.module("myApp")
 *     .controller("mycontroller", ["remoteActions", function(remoteActions) {
 *         remoteActions.GetMapping("mappingId").then(function(mapping){
 *           // handle the result
 *         });
 *     }]);
 *
 */
angular.module("vlocity")
  .provider("remoteActions", ["$qProvider", function RemoteActionsProvider($q){

    var remoteActions = {},
        mockedRemoteActions;

    this.setRemoteActions = function(remoteActionsParam) {
      remoteActions = remoteActionsParam;
    };

    this.setMockedRemoteActions = function(mockedRemoteActionsParam) {
      mockedRemoteActions = mockedRemoteActionsParam;
    };

    this.$get = ["$q", function RemoteActionsFactory($q) {
      var inMockMode = !!mockedRemoteActions;
      var serviceObject = {};
      var recordedServiceCalls = {};
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
            });
          }
        } else {
          serviceObject[key] = function() {
            var invokeArgs = [value],
              deferred = $q.defer();
            for (var i = 0; i < arguments.length; i++) {
              invokeArgs.push(arguments[i]);
            }
            invokeArgs.push(function(result){
              deferred.resolve(result);
            });
            var invokeAction = Visualforce.remoting.Manager.invokeAction;
            invokeAction.apply(Visualforce.remoting.Manager, invokeArgs);
            return deferred.promise;
          }
        }
      });

      if (inMockMode) {
        serviceObject.recordedServiceCalls = recordedServiceCalls;
      }
      return serviceObject;
    }];
}]);
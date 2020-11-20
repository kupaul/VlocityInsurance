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
angular.module('campaignStatus', ['vlocity', 'CardFramework', 'viaDirectives' , 'sldsangular', 'forceng', 'mgcrea.ngStrap',
    'ngSanitize', 'cfp.hotkeys'
]).config(['remoteActionsProvider', function(remoteActionsProvider) {
    'use strict';
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}]).run(['$rootScope', function($rootScope) {
        'use strict';
        $rootScope.nsPrefix = fileNsPrefix();
        // Used in templates for slds assets
        $rootScope.staticResourceURL = vlocCPQ.staticResourceURL;
        $rootScope.log = function(string, obj, color, fontSize) {
            string = '%c' + string;
            obj = obj || null;
            color = color || 'orange';
            fontSize = fontSize || '14px';
            console.log(string, 'color: ' + color + '; font-size: ' + fontSize + ';', obj);
        };

    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        'use strict';
        return function(sldsURL) {
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]);
// Controllers
require('./modules/campaignStatus/controller/CampaignStatusController.js');

// Factories
require('./modules/campaignStatus/factory/CampaignService.js');

},{"./modules/campaignStatus/controller/CampaignStatusController.js":2,"./modules/campaignStatus/factory/CampaignService.js":3}],2:[function(require,module,exports){
angular.module('campaignStatus').controller('CampaignStatusController', function(
    $scope, $sce, $rootScope, CampaignService) {
    'use strict';
    $scope.nameSpacePrefix = fileNsPrefix();
    $scope.status = [];
    $scope.defaultIndex = 0;
    $scope.isLoading = false;
    
    $scope.campaignMemberStatusObj = function(id, label, isdefault, hasresponded, sortorder) {
        var obj = {
            id: id,
            statusLabel: label,
            isDefault: isdefault,
            hasResponded: hasresponded,
            sortOrder: sortorder
        };
        $scope.status.push(obj);
    };

    $scope.setObj = function(data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            $scope.campaignMemberStatusObj(data[i].Id.value, data[i].Label.value, data[i].IsDefault.value, data[i].HasResponded.value, data[i].SortOrder.value);
            if ($scope.status[i].isDefault) {
                $scope.defaultIndex = i;
            }
        }
        $scope.status[$scope.defaultIndex].isDefault = true;
        console.log('Status:', $scope.status);
    };

    $scope.updateDefault = function(index) {
        $scope.status[$scope.defaultIndex].isDefault = false;
        $scope.defaultIndex = index;
        $scope.status[$scope.defaultIndex].isDefault = true;
    };

    $scope.saveStatus = function() {
        $scope.isLoading = true;
        var addCampaignMemberStatus = {
            client: {
                params: ''
            },
            remote: {
                params: {
                    customStatus: $scope.status,
                    campaignId: $scope.campaignId,
                    methodName: 'addCampaignMemberStatus'
                }
            },
            rest: {
                params: {
                    customStatus: $scope.status,
                    campaignId: $scope.campaignId,
                    methodName: 'addCampaignMemberStatus'
                }
            }
        };
        CampaignService.invokeAction(addCampaignMemberStatus).then(
            function(data) {
                console.log('success', data);
                $scope.showBanner = true;
                $scope.bannerText = 'Your changes were saved successfully';
                $scope.isLoading = false;
            }, function(error) {
                console.log('error', error);
                $scope.showErrorBanner = true;
                //$scope.bannerText = 'Failed to save changes to campaign member status';
                $scope.bannerText = error.data.error;
                $scope.isLoading = false;
            });
    };

    $scope.removeElement = function(index) {
        console.log('index:', index);
        $scope.status.splice(index, 1);
    };

});

},{}],3:[function(require,module,exports){
angular.module('campaignStatus')
.factory('CampaignService', ['$http', 'dataSourceService', 'dataService', '$q', function($http, dataSourceService, dataService, $q) {
    'use strict';
    var REMOTE_CLASS = 'CampaignListHandler';
    var DUAL_DATASOURCE_NAME = 'Dual';
    var insideOrg = false;
    var errorContainer = {};

    function getDualDataSourceObj(actionObj) {
        var datasource = {};
        var temp = '';
        var nsPrefix = fileNsPrefix().replace('__', '');

        if (actionObj.remote.remoteClass) {
            temp = REMOTE_CLASS;
            REMOTE_CLASS = actionObj.remote.remoteClass;
        }
        if (actionObj) {
            datasource.type = DUAL_DATASOURCE_NAME;
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.inputMap = actionObj.remote.params || {};
            datasource.value.remoteClass = REMOTE_CLASS;
            datasource.value.remoteMethod = actionObj.remote.params.methodName;
            datasource.value.endpoint = actionObj.rest.link;
            datasource.value.methodType = actionObj.rest.method;
            datasource.value.body = actionObj.rest.params;
        } else {
            console.log('Error encountered while trying to read the actionObject');
        }
        if (temp) {
            REMOTE_CLASS = temp;
        }
        return datasource;
    }

    return {
        getMembersAggInfoByCampaign: function(campaignId, scope) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('getting getMembersAggInfoByCampaign');
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'CampaignListHandler';
            datasource.value.remoteMethod = 'getMembersAggInfoByCampaign';
            datasource.value.inputMap = {
                'campaignId': campaignId
            };
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.apexRestResultVar = 'result.records';
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },

        getMemberStatus: function(campaignId, scope) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('getting getMemberStatus');
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'CampaignListHandler';
            datasource.value.remoteMethod = 'getMemberStatusByCampaign';
            datasource.value.inputMap = {
                'campaignId': campaignId
            };
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.apexRestResultVar = 'result.records';
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },

        getAttachments: function(campaignId, scope) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('getting attachments');
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'CampaignListHandler';
            datasource.value.remoteMethod = 'getCampaignAttachments';
            datasource.value.inputMap = {
                'campaignId': campaignId
            };
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.apexRestResultVar = 'result.records';
            datasource.value.endpoint = '/' + nsPrefix + '/v2/campaign/' + campaignId + '/attachments';
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },

        getAvailableProducts: function(orderId, forcetkClient) {
            var deferred = $q.defer();
            var payload = '[{"command":"getAvailProducts", "channel":"Mobile"}]';
            var method = 'POST';
            var endpoint;
            orderId = orderId ? orderId : '';
            endpoint = '/v1/CPQServices/' + orderId;
            console.log('getting getAvailableProducts');
            console.log(orderId);
            if (insideOrg) {

            } else { //outside
                dataService.getApexRest(endpoint,method,payload, forcetkClient).then(
                    function(data) {
                        console.log(data);
                        deferred.resolve(data.result);
                        // return records;

                    }, function(error) {
                        var errorMsg = '';
                        console.error(error);
                        try {
                            errorMsg = JSON.parse(error.responseText);
                            console.log(errorMsg[0]);
                            errorMsg = errorMsg[0].message;
                        }catch (e) {
                            errorMsg = error.status + ' - ' + error.statusText;
                        }

                        errorContainer.data = error;
                        errorContainer.message = errorMsg;
                        deferred.reject(errorContainer);
                    });
                return deferred.promise;
            }
        },
        /**
         * invokeAction : Use this method when the actions are straight forward based on actionObj.
         *
         * @param  {[object]} actionObj [Pass the action object]
         * @return {promise} [Result data]
         */
        invokeAction: function(actionObj) {
            var deferred = $q.defer();
            var datasource = getDualDataSourceObj(actionObj);

            dataSourceService.getData(datasource, null, null).then(
                function(data) {
                    deferred.resolve(data);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    };
}]);

},{}]},{},[1]);
})();

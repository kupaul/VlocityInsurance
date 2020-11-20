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
angular.module('campaignResults', ['vlocity', 'CardFramework', 'viaDirectives' , 'sldsangular', 'forceng', 'mgcrea.ngStrap', 'chart.js',
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
require('./modules/campaignResults/controller/CampaignResultsController.js');

// Factories
require('./modules/campaignResults/factory/CampaignService.js');


},{"./modules/campaignResults/controller/CampaignResultsController.js":2,"./modules/campaignResults/factory/CampaignService.js":3}],2:[function(require,module,exports){
angular.module('campaignResults').controller('CampaignResultsController', function(
    $scope, $sce, $rootScope, CampaignService) {
    'use strict';
    $scope.nameSpacePrefix = fileNsPrefix();
    $scope.labels = [];
    $scope.data = [];
    $scope.series = [];
    $scope.status = ['All'];
    $scope.groupBy = ['Day', 'Week', 'Month'];
    $scope.dateRange = ['This Week', 'This Month', 'Custom'];
    $scope.options = {
        'groupBy': $scope.groupBy[0],
        'dateRange': $scope.dateRange[0],
        'filter': $scope.status[0]
    };
    $scope.totalSize = 0;
    $scope.date = new Date();
    $scope.today = {
        'day':  $scope.date.getDay(),
        'month': $scope.date.getMonth(),
        'year': $scope.date.getFullYear()
    };
    $scope.thisMonth = [];
    $scope.thisWeek = [];
    $scope.customRange = [];
    $scope.invalidDateRange = false;
    $scope.daysInMonth = [];
    $scope.monthNames = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $scope.memberData = {};
    $scope.campaignId = '';
    $scope.colorIndex = [];
    $scope.noData = false;
    $scope.maxY = 0;
    $scope.error = '';
    $scope.colorIndex = {};
    $scope.colorsLib = [
          { //blue
            backgroundColor: '#5ab0d2',
            borderColor: '#5ab0d2'
          },
          {//Turquoise 
            backgroundColor: '#50ceb9',
            borderColor: '#50ceb9'
          },
          { //Green
            backgroundColor: '#4dca76',
            borderColor: '#4dca76'
          },
          { //Lime Green
            backgroundColor: '#acd360',
            borderColor: '#acd360'
          },
          { //Yellow 
            backgroundColor: '#ffb75d',
            borderColor: '#ffb75d'
          },
          {//Orange
            backgroundColor: '#e9af67',
            borderColor: '#e9af67'
          },
          {//Red
            backgroundColor: '#c23934',
            borderColor: '#c23934'
          },
          {//Pink
            backgroundColor: '#e56798', 
            borderColor: '#e56798'
          },
          { //Purple
            backgroundColor: '#8b85f9',
            borderColor: '#8b85f9'
          }
    ];

    $scope.shuffle = function(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }
    //$scope.shuffle($scope.colorsLib);
    $scope.colors = $scope.colorsLib;

    $scope.setMonth = function() {
        var feb = 28;
        var isLeap = (new Date($scope.today.year, 1, 29).getMonth() === 1);
        if (isLeap) {
            feb = 29;
        }
        $scope.daysInMonth = [31,feb,31,30,31,30,31,31,30,31,30,31];
        for (var i = 1; i <= $scope.daysInMonth[$scope.today.month]; i++) {
            var d = new Date($scope.today.year, $scope.today.month, i).toLocaleString().split(',')[0] ;
            $scope.thisMonth.push(d);
        }
    };
    $scope.setMonth();

    $scope.setWeek = function() {
        var date = new Date();
        var restOfWeek = 7 - date.getDay();
        var endDate = new Date(date.setDate(date.getDate() + restOfWeek));
        var startDate = new Date(date.setDate(endDate.getDate() - 6));
        for (startDate; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
            $scope.thisWeek.push(new Date(startDate).toLocaleString().split(',')[0]);
        }
    };
    $scope.setWeek();

    $scope.setCustomTimeFrame = function(startDate, endDate) {
        var customDateRange = [];
        for (startDate; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
            customDateRange.push(new Date(startDate).toLocaleString().split(',')[0]);
        }
        return customDateRange;
    };

    $scope.groupByWeek = function(dates) {
        for (var i = 0; i <= dates.length; i += 7) {
            if (dates[i + 6]) {
                $scope.labels.push(dates[i] + '-' + dates[i + 6]);
            }else {
                $scope.labels.push(dates[i] + '-' + dates[dates.length - 1]);
            }
        }
    };

    $scope.filterData = function() {
        $scope.data = [];
        if ($scope.options.filter !== 'All') {
            $scope.data.push($scope.memberData[$scope.options.filter]);
            $scope.series = $scope.options.filter;
            $scope.colors = $scope.colorIndex[$scope.options.filter];
        } else {
            $scope.colors = $scope.colorsLib;
            $scope.series = $scope.status.slice(1, $scope.status.length);
            for (var key in $scope.memberData) {
                if (key !== 'All') {
                    $scope.data.push($scope.memberData[key]);
                }
            }
        }
    };

    $scope.getCampaignMemberActionLog = function(startDate, endDate, groupBy) {
        if($scope.campaignId){
            $scope.isLoading = true;
            var getCampaignMemberActionLog = {
                client: {
                    params: ''
                },
                remote: {
                    params: {
                        campaignId: $scope.campaignId,
                        methodName: 'getCampaignMemberActionLog',
                        startDate: startDate,
                        endDate: endDate,
                        groupBy: groupBy
                    }
                },
                rest: {
                    params: {
                        campaignId: $scope.campaignId,
                        methodName: 'getCampaignMemberActionLog',
                        startDate: startDate,
                        endDate: endDate,
                        groupBy: groupBy
                    }
                }
            };
            console.log(getCampaignMemberActionLog);
            CampaignService.invokeAction(getCampaignMemberActionLog).then(
                function(data) {
                    console.log('success', data);
                    $scope.memberData = {};
                    
                    var key, value, array, dummyData, i, j, firstRecord, lastRecord;
                    if (data.result && data.result.records) {
                        firstRecord = data.result.records[0];
                        lastRecord = data.result.records[data.result.records.length - 1];
                        $scope.noData = false;
                    } else {
                        $scope.noData = true;
                        $scope.error = 'No Data To Display';
                    }

                    //Generate 0s from startDate until firstRecord date
                    if (firstRecord) {
                        if (firstRecord.startDateGroupNumber < firstRecord.groupNumber) {
                            dummyData = firstRecord.groupNumber - firstRecord.startDateGroupNumber;
                            for (j = 0; j < $scope.status.length; j++) {
                                key = $scope.status[j];
                                value = new Array(dummyData);
                                value.fill(null);
                                $scope.memberData[key] = value;
                            }
                        }
                    }
                    //Inserts all record data
                    if (!$scope.noData) {
                        for (i = 0; i < data.result.records.length; i++) {
                            for (j = 0; j < $scope.status.length; j++) {
                                key = $scope.status[j];
                                value = data.result.records[i][key];
                                if (!value) {
                                    value = 0;
                                }
                                array = $scope.memberData[key];
                                if (!array) {
                                    array = [];
                                }
                                array.push(value);
                                $scope.memberData[key] = array;
                                if (value > $scope.maxY) {
                                    $scope.maxY = value;
                                }
                            }
                            //If gap between current and next record, fill with nulls
                            if (data.result.records[i] !== lastRecord) {
                                if ((data.result.records[i].groupNumber + 1) !== data.result.records[i + 1].groupNumber) {
                                    dummyData =  data.result.records[i + 1].groupNumber - (data.result.records[i].groupNumber + 1);
                                    for (j = 0; j < $scope.status.length; j++) {
                                        key = $scope.status[j];
                                        array = new Array(dummyData);
                                        array.fill(null);
                                        value = $scope.memberData[key];
                                        if (!value) {
                                            value = [];
                                        }
                                        value = value.concat(array);
                                        $scope.memberData[key] = value;
                                    }
                                }
                            }
                        }
                    }
                    $scope.filterData();
                    $scope.chartOptions = {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    max: $scope.maxY,
                                    fontFamily: "'Salesforce Sans', 'Arial', 'sans-serif'"
                                },
                                labels: 'Number Of Campaign Members'
                            }],
                            xAxes: [{
                              gridLines: {
                                display: false
                              },
                              ticks: {
                                fontFamily: "'Salesforce Sans', 'Arial', 'sans-serif'"
                              }
                            }],
                        },
                        legend: {
                            display: true,
                            labels: {
                                fontFamily: "'Salesforce Sans', 'Arial', 'sans-serif'"
                            }
                        }
                    };
                    $scope.isLoading = false;
                }, function(error) {
                    console.log('error', error);
                    $scope.isLoading = false;
                    $scope.error = error.message;
                });
        }
    };

    $scope.toolTip = function(event, legendItem) {
        $scope.showToolTip = true
    }; 

    $scope.setRange = function() {
        $scope.labels = [];
        $scope.invalidDateRange = false;
        if ($scope.options.dateRange === 'This Week') {
            $scope.getCampaignMemberActionLog($scope.thisWeek[0], $scope.thisWeek[6], $scope.options.groupBy);
            if ($scope.options.groupBy === 'Day') {
                $scope.labels = $scope.thisWeek;
            }
            if ($scope.options.groupBy === 'Week') {
                $scope.labels.push($scope.thisWeek[0] + '-' + $scope.thisWeek[$scope.thisWeek.length - 1]);
            }
        }
        if ($scope.options.dateRange === 'This Month') {
            $scope.getCampaignMemberActionLog($scope.thisMonth[0], $scope.thisMonth[$scope.thisMonth.length - 1], $scope.options.groupBy);
            if ($scope.options.groupBy === 'Day') {
                $scope.labels = $scope.thisMonth;
            } if ($scope.options.groupBy === 'Week') {
                $scope.groupByWeek($scope.thisMonth);
            } if ($scope.options.groupBy === 'Month') {
                $scope.labels.push($scope.monthNames[$scope.thisMonth[0].split('/')[0] - 1]);
            }
        }
        if ($scope.options.dateRange === 'Custom') {
            if ($scope.customRange[0] <= $scope.customRange[1]) {
                var dates = $scope.setCustomTimeFrame(new Date($scope.customRange[0]), $scope.customRange[1]);
                $scope.getCampaignMemberActionLog(dates[0], dates[dates.length - 1], $scope.options.groupBy);
                if ($scope.options.groupBy === 'Day') {
                    $scope.labels = dates;
                }
                if ($scope.options.groupBy === 'Week') {
                    $scope.groupByWeek(dates);
                }
                if ($scope.options.groupBy === 'Month') {
                    for (var i = 0; i <= dates.length - 1; i++) {
                        var m = (dates[i].split('/')[0]) - 1;
                        $scope.labels.push($scope.monthNames[m]);
                        i += $scope.daysInMonth[m] - 1;
                    }
                }
            } else {
                console.log('Invalid Date Range');
                $scope.invalidDateRange = true;
            }
        }
    };
    $scope.setRange();

    $scope.setData = function(data, campaignId) {
        $scope.campaignId = campaignId;
        for (var i = 0; i < data.records.length; i++) {
            $scope.status.push(data.records[i].label);
            if(!$scope.colorsLib[i]){
                $scope.colorLibs = $scope.colorsLib.concat($scope.colorsLib);
            }
            $scope.colorIndex[data.records[i].label] = [$scope.colorsLib[i]];
        }
        $scope.totalSize = data.totalSize;
        $scope.series = $scope.status.slice(1, $scope.status.length);
        $scope.getCampaignMemberActionLog($scope.thisWeek[0], $scope.thisWeek[6], $scope.options.groupBy);
    };

});

},{}],3:[function(require,module,exports){
angular.module('campaignResults')
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

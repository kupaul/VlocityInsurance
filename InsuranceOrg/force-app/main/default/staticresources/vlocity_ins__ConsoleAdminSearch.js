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
angular.module('consoleadminsearch', ['vlocity', 'ngSanitize', 'sldsangular', 'epcadmin'])
.config(['remoteActionsProvider', function(remoteActionsProvider) {
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}])
.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

require('./modules/consoleadminsearch/controller/ConsoleAdminSearchController.js');

},{"./modules/consoleadminsearch/controller/ConsoleAdminSearchController.js":2}],2:[function(require,module,exports){
angular.module('consoleadminsearch')
.controller('ConsoleAdminSearchController', ['$scope', '$location', 'remoteActions', '$sldsModal', '$window', 'cpqService', 
    function ($scope, $location, remoteActions, $sldsModal, $window, cpqService) {
        $scope.nsp = fileNsPrefix();
        $scope.doLabel = $location.search().doLabel;
        $scope.doAPIName = $location.search().doAPIName;
        $scope.doRecordType = $location.search().doRecordType;
        $scope.searchTerm = '';
        $scope.searchResults = null;
        $scope.fieldSet = null;
        $scope.objectFields = null;
        $scope.searchCfg = {
            currentPage: 1,
            totalPages: 1
        };

        $scope.getFieldSetsByName = function(objectName) {
            var inputMap = { 'objectName' : objectName, 'recordType': $scope.doRecordType};
            remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                console.log('getFieldSets ' + objectName + ': ', results);
                if(results[$scope.nsp.toLowerCase() + 'consoleadminsearch_'+ $scope.doRecordType.toLowerCase()] == undefined)
                {
                	if (results[$scope.nsp.toLowerCase() + 'consoleadminsearch'] === undefined) {
                        $scope.fieldSet = null;
                    } else {
                        $scope.fieldSet = results[$scope.nsp.toLowerCase() + 'consoleadminsearch'];
                    }
                }
                else
                {
                	$scope.fieldSet = results[$scope.nsp.toLowerCase() + 'consoleadminsearch_' + $scope.doRecordType.toLowerCase()];
                }
                
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.deleteObject = function(item, event) {
            if (event) {
                event.stopPropagation();
            }

            var modalScope = $scope.$new();
            modalScope.confirmationTitle = 'Delete Object';
            modalScope.confirmationMsg = 'Are you sure you want to delete <i>' + item.Name + '</i>?';
            modalScope.cancelActionLbl = 'Cancel';
            modalScope.confirmActionLbl = 'Delete';
            modalScope.confirmAction = function(event) {
                var originalText;
                if (event) {
                    originalText = event.currentTarget.innerText;
                    event.currentTarget.disabled = true;
                    event.currentTarget.innerText = 'Deleting...';
                }

                var itemToDelete = {};
                for (var key in item) {
                    if (key !== '$$hashKey') {
                        itemToDelete[key] = item[key];
                    }
                }

                if ($scope.doAPIName == 'Product2') {
                    //Delete Product
                    var inputMap = { 'productId' : itemToDelete.Id };
                    remoteActions.invokeMethod('deleteProduct', JSON.stringify(inputMap)).then(function(results) {
                        $scope.search();
                        deleteModal.hide();
                        //TODO: show delete success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        deleteModal.hide();
                    });
                } else {
                    var inputMap = { 'objectId' : itemToDelete.Id };
                    remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('!!delete object results: ', results);
                        $scope.search();
                        deleteModal.hide();
                        //TODO: show delete success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        deleteModal.hide();
                    });
                }
            };

            var deleteModal = $sldsModal({
                templateUrl: 'ConfirmationModal.tpl.html',
                backdrop: 'static',
                scope: modalScope,
                show: true
            });
        };

        $scope.describeObject = function(objectName) {
            var inputMap = { 'objectName' : objectName };
            remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                console.log('describeObject ' + objectName + ': ', results);
                $scope.objectFields = results;
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.search = function(pageNum) {
            if (pageNum) {
                $scope.searchCfg.currentPage = pageNum;
            }
            if ($scope.searchCfg.currentPage < 1) {
                $scope.searchCfg.currentPage = 1;
            }
            if ($scope.searchCfg.totalPages !== 0 && ($scope.searchCfg.currentPage > $scope.searchCfg.totalPages)) {
                $scope.searchCfg.currentPage = $scope.searchCfg.totalPages;
            }

            var searchTerm = $scope.searchTerm.trim().toLowerCase();
            if (searchTerm === '') {
                searchTerm = '%';
            }

            var searchCondition = '';
            if ($scope.doAPIName === $scope.nsp + 'PriceList__c') {
                searchCondition += $scope.nsp + 'ParentPriceListId__c=\'\'';
            }

            var searchInputMap = {
                'objectType': $scope.doAPIName,
                'recordType': $scope.doRecordType,
                'condition' : searchCondition,
                'searchString': searchTerm,
                'pageNumber': $scope.searchCfg.currentPage,
                'fieldSetName': 'consoleadminsearch'
            };
            var searchInputMapJSON = JSON.stringify(searchInputMap);
            remoteActions.invokeMethod('getSearchResultsMap', searchInputMapJSON).then(function(response) {
                console.log('search results for ' + searchTerm + ': ', response);
                $scope.searchCfg.previousPage = response.previousPage;
                $scope.searchCfg.nextPage = response.nextPage;
                $scope.searchCfg.totalCount = response.totalCount;
                $scope.searchCfg.totalPages = response.totalPages;
                $scope.searchCfg.pageSize = response.pageSize;
                $scope.searchCfg.fromCount = response.fromCount;
                $scope.searchCfg.toCount = response.toCount;
                $scope.searchResults = response.results;
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.launchTab = function(item, event) {
            if (event) {
                event.stopPropagation();
            }

            var data = {
                'doAction': 'viewRecord',
                'doAPIName': $scope.doAPIName,
                'doAPILabel': $scope.doLabel,
                'obj': item,
                'closeCurrentTab': false
            };
            var broadcastAction = {
                'eventName': 'launchConsoleTab',
                'eventData': data
            };
            if (window.frameElement !== null) {
                // create a iframe resize event binding with the parent
                window.parent.bindIframeEvents('broadcast', broadcastAction);
            }
        };

        $scope.init = function() {
            $scope.describeObject($scope.doAPIName);
            $scope.getFieldSetsByName($scope.doAPIName);
            $window.document.getElementById('searchTerm').focus();
        };
        $scope.init();
    }
]);

},{}]},{},[1]);
})();

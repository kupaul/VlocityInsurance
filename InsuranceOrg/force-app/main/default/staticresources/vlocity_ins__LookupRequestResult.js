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
angular.module('lookuprequestresult', ['vlocity', 'viaDirectives', 'sldsangular', 'ngAnimate', 'mgcrea.ngStrap',
    'ngSanitize'])
.config(['remoteActionsProvider', function(remoteActionsProvider) {
    'use strict';
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}])
.config(['$datepickerProvider', function($datepickerProvider) {
    'use strict';
    angular.extend($datepickerProvider.defaults, {
        templateUrl: 'SldsDatepicker.tpl.html',
        dateFormat: 'M/d/yyyy',
        modelDateFormat: 'yyyy-MM-dd',
        dateType: 'string',
        autoclose: true
    });
}]);

// Factories:
require('./modules/lookuprequestresult/factory/ValidationErrorHandler.js');
require('./modules/lookuprequestresult/factory/ActionFramework.js');

// Services:
require('./modules/lookuprequestresult/services/BrowserDetection.js');

// Controllers:
require('./modules/lookuprequestresult/controller/LookupController.js');

// Directives:
require('./modules/lookuprequestresult/directive/AutoFocus.js');
require('./modules/lookuprequestresult/directive/FixToTop.js');

// Filters:
require('./modules/lookuprequestresult/filter/MaskField.js');

// Templates:
require('./modules/lookuprequestresult/templates/templates.js');

},{"./modules/lookuprequestresult/controller/LookupController.js":2,"./modules/lookuprequestresult/directive/AutoFocus.js":3,"./modules/lookuprequestresult/directive/FixToTop.js":4,"./modules/lookuprequestresult/factory/ActionFramework.js":5,"./modules/lookuprequestresult/factory/ValidationErrorHandler.js":6,"./modules/lookuprequestresult/filter/MaskField.js":7,"./modules/lookuprequestresult/services/BrowserDetection.js":8,"./modules/lookuprequestresult/templates/templates.js":9}],2:[function(require,module,exports){
angular.module('lookuprequestresult').controller('lookupController', function(
    $scope, $rootScope, $timeout, remoteActions, ValidationErrorHandler, browserDetection, ActionFramework) {
    'use strict';
    $scope.setInitialState = function() {
        $rootScope.vlcLoading = false;
        if (window.nameSpacePrefix !== undefined) {
            $scope.nameSpacePrefix = window.nameSpacePrefix;
        }
        if (window.userName !== undefined) {
            $scope.userName = window.userName;
        }
        if (window.liLabels !== undefined) {
            $scope.liLabels = window.liLabels;
        }
        $scope.validationErrorHandler = new ValidationErrorHandler();
        $scope.actionFramework = new ActionFramework($scope);
        $scope.browser = browserDetection.detectBrowser();
        $scope.isSafari = ($scope.browser === 'safari') ? true : false;
        $scope.isInternetExplorer = ($scope.browser === 'msielte10' || $scope.browser === 'msiegt10') ? true : false;
        $scope.browserVersion = browserDetection.getBrowserVersion();
        $scope.lookupRequests = [];
        $scope.moreRequests = [];
        $scope.nextLookupRequests = [];
        $scope.searchSection = {};
        $scope.searchResult = [];
        $scope.roleBasedActions = [];
        $scope.callerData = {};
        $scope.contextIds = null;
        // DEPRECATED AS OF v100
        $scope.viaPanes = ['via-pane-search', 'via-pane-search-results', 'via-pane-related-parties',
            'via-pane-verify-caller', 'via-pane-caller-verified', 'via-pane-search-policies',
            'via-pane-agent-search-results'];
        $scope.viaPane = 0;
        $scope.focusIndex = 0;
        $scope.showScratchPad = (window.showScratchPad === 'true') ? true : false;
        $scope.tabStyle = (window.tabStyle === 'true') ? true : false;
        $scope.eventDrivenMode = angular.fromJson(window.eventDrivenMode);
        $scope.eventDrivenNonOverride = $scope.eventDrivenMode.eventDriven;
        $scope.eventData = null;
        console.log('eventDrivenMode: ', $scope.eventDrivenMode);
    };
    $scope.setInitialState();

    // Get lookup request form field objects
    $scope.getLookupRequests = function(eventDriven) {
        $rootScope.vlcLoading = true;
        remoteActions.getLookupRequests($scope.eventData).then(function(result) {
            console.log('getLookupRequests', result);
            $scope.lookupRequests = result;
            $rootScope.vlcLoading = false;
            if (eventDriven) {
                $scope.eventDrivenMode.eventDriven = false;
                sforce.console.setCustomConsoleComponentVisible(true);
            }
            $timeout(function() {
                angular.element(document).find('.via-slds').removeClass('preload');
            }, 500);
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };
    $scope.getLookupRequests();

    $scope.cleanFormField = function(searchValueMap) {
        var key;
        for (key in searchValueMap) {
            if (searchValueMap[key] === '') {
                delete searchValueMap[key];
            }
        }
    };

    $scope.getSearchResult = function(requests, contextIds, searchResultData, previousResults, secondSearch) {
        console.log('searchResultData: ', searchResultData);
        var i, j, k, key;
        var parentId = searchResultData.recordId || null;
        var searchObjectLabelName = '';
        var searchTerm = '';
        var isError = false;
        console.log('parentId: ', parentId);
        $scope.validationErrorHandler.validation.message = '';
        // Clear our search section:
        if (secondSearch) {
            $scope.searchSection = {};
        }
        // Figure out which section has data, and only send that:
        for (i = 0; i < requests.length; i++) {
            for (key in requests[i]) {
                if (key === 'searchValueMap' &&
                    !angular.equals({}, requests[i][key])) {
                    $scope.searchSection = requests[i];
                }
            }
        }
        console.log('searchSection: ', $scope.searchSection);
        if (previousResults === undefined || secondSearch) {
            $scope.searchResult = [];
            $scope.hasMoreResults = false;
            $scope.previousResults = undefined;
            $scope.resultsPerPage = undefined;
            $scope.lastResultIndex = undefined;
            $scope.retrievedAllResults = undefined;
        }
        if ($scope.searchSection === undefined || angular.equals({}, $scope.searchSection)) {
            $scope.validationErrorHandler.validation.message = $scope.liLabels.InteractionLauncher_EnterSearchTerms;
        } else {
            angular.forEach($scope.searchSection.searchValueMap, function(value, key) {
                if (value.toString().indexOf('*') !== -1 && $scope.searchSection.nonWildCardFields && $scope.searchSection.nonWildCardFields.indexOf(key) !== -1) {
                    $scope.validationErrorHandler.validation.message = $scope.liLabels.InteractionLauncher_WildCardSupportDisabled + ': ' + key;
                    isError = true;
                }
            });
            if (isError) {
                return;
            }
            $rootScope.vlcLoading = true;
            if ($scope.searchSection && $scope.searchSection.searchFieldList) {
                for (j = 0; j < $scope.searchSection.searchFieldList.length; j++) {
                    if ($scope.searchSection.searchFieldList[j] in $scope.searchSection.searchValueMap) {
                        searchTerm +=
                            $scope.searchSection.searchValueMap[$scope.searchSection.searchFieldList[j]] + ' ';
                    }
                }
                searchTerm = searchTerm.trim();
            } else {
                searchTerm = 'Event Search';
            }
            // Show Previous Results:
            var cachedPreviousResults = $scope.previousResults;
            var resultsPerPage = $scope.resultsPerPage;
            var recordFound = false;
            if (previousResults && $scope.previousResults.length && $scope.resultsPerPage) {
                console.log('cachedPreviousResults', cachedPreviousResults);
                // Check to see if we need to add current results to $scope.previousResults every time
                // the previous button is hit. This makes the cached previous/more retrieval work when
                // the user has not gone all the way to the last page.
                // Filter through the cached records and make sure we aren't adding duplicates:
                $scope.previousResults.filter(function(obj) {
                    if ($scope.searchResult[0].recordId === obj.recordId) {
                        recordFound = true;
                    }
                });
                if (!recordFound) {
                    $scope.previousResults = $scope.previousResults.concat($scope.searchResult);
                }
                // If this is the last page $scope.hasMoreResults will be false:
                if (!$scope.hasMoreResults) {
                    // 1) Cache the index of the last search result now:
                    $scope.lastResultIndex = cachedPreviousResults.length;
                    // 2) Change $scope.searchResult to the last $scope.resultsPerPage amount of the
                    // cachedPreviousResults. Need to subtract the mod from the beginning parameter
                    // to account last page records that are less than the resultsPerPage amount
                    $scope.searchResult = cachedPreviousResults.slice(
                        cachedPreviousResults.length - $scope.resultsPerPage - (cachedPreviousResults.length % $scope.resultsPerPage),
                        cachedPreviousResults.length
                    );
                    // 4) Change $scope.hasMoreResults back to true
                    $scope.hasMoreResults = true;
                } else {
                    // If we get in here, we know we've already gone back at least once to a previous page
                    // 1) If We've cycled back to the last page of results (not through remote action), then
                    // we need to reset the $scope.lastResultIndex to reflect the index of the last result on
                    // the previous page since that is the direction we're going:
                    if ($scope.lastResultIndex % $scope.resultsPerPage) {
                        $scope.lastResultIndex = $scope.lastResultIndex - ($scope.lastResultIndex % $scope.resultsPerPage);
                    }
                    // 2) Change the $scope.searchResult to the $scope.resultsPerPage amount before the current
                    // based on the $scope.lastResultIndex
                    $scope.searchResult = cachedPreviousResults.slice($scope.lastResultIndex - ($scope.resultsPerPage*2), $scope.lastResultIndex - $scope.resultsPerPage);
                    // 3) Change the $scope.lastResultIndex
                    $scope.lastResultIndex = $scope.lastResultIndex - $scope.resultsPerPage;
                }
                // Return here because we don't want to call the remote action:
                $rootScope.vlcLoading = false;
                return;
            } else {
                // Add Previous Results:
                if (!$scope.previousResults) {
                    $scope.previousResults = $scope.searchResult;
                } else if ($scope.previousResults && $scope.previousResults.length < $scope.lastResultIndex) {
                    $scope.previousResults = $scope.previousResults.concat($scope.searchResult);
                }
                // Check to see if we can go forward one page without calling remote action:
                if ($scope.lastResultIndex < $scope.previousResults.length) {
                    var originalResultsPerPage = $scope.resultsPerPage;
                    if (($scope.previousResults.length - $scope.lastResultIndex) < $scope.resultsPerPage &&
                        ($scope.previousResults.length - $scope.lastResultIndex) % $scope.resultsPerPage) {
                        $scope.resultsPerPage = ($scope.previousResults.length - $scope.lastResultIndex) % $scope.resultsPerPage;
                    }
                    $scope.searchResult = cachedPreviousResults.slice($scope.lastResultIndex, $scope.lastResultIndex + $scope.resultsPerPage);
                    $scope.lastResultIndex = $scope.lastResultIndex + $scope.resultsPerPage;
                    $scope.resultsPerPage = originalResultsPerPage;
                    if ($scope.retrievedAllResults && ($scope.previousResults.length - $scope.lastResultIndex + $scope.resultsPerPage) <= $scope.resultsPerPage) {
                        $scope.hasMoreResults = false;
                    }
                    $rootScope.vlcLoading = false;
                    return;
                }
            }
            console.log('sending to getSearchResult:', angular.toJson($scope.searchSection), parentId);
            remoteActions.getSearchResult(angular.toJson($scope.searchSection), contextIds, parentId).then(function(result) {
                var verificationResult = null;
                var hasResult = true;
                var stepName = secondSearch ? 'SecondResultPane' : 'ResultPane';
                $scope.hasMoreResults = result.hasMore;
                if (result.parentContextSearchResult && result.parentContextSearchResult.length) {
                    // If there are results in the parentContextSearchResult object, there are objects related
                    // to the searchObjectLabel (i.e. policies related to an Agent):
                    $scope.searchResult = result.parentContextSearchResult;
                    // Need to assign $scope.lastResultIndex here too so that previous button shows up
                    $scope.lastResultIndex = $scope.searchResult.length + $scope.previousResults.length;
                    // Check to see if we need to paginate:
                    if ($scope.hasMoreResults) {
                        if (!$scope.resultsPerPage) {
                            $scope.resultsPerPage = $scope.searchResult.length;
                        }
                        $scope.searchSection.lastRecordId = $scope.searchResult[$scope.searchResult.length - 1].recordId;
                        // CORE-1103
                        $scope.searchSection.recordOffSet = result.recordOffSet;
                    } else {
                        $scope.retrievedAllResults = true;
                    }
                } else if (result.parentContextSearchResult && result.parentContextSearchResult.length === 0) {
                    // Assign results because certain data is needed for getting actions, etc.
                    $scope.searchResult = result.parentContextSearchResult;
                    $scope.searchResultMessage = result.message;
                } else {
                    $scope.searchResult = result.searchResult;
                }
                for (k = 0; k < $scope.searchResult.length; k++) {
                    $scope.searchResult[k].parentId = parentId;
                    if ($scope.eventData) {
                        $scope.searchResult[k].eventData = $scope.eventData;
                        $scope.searchResult[k].tabId = $scope.eventData.tabId;
                        $scope.searchResult[k]['parent' + $scope.searchResult[k].interactionObjName + 'Id'] =
                            $scope.eventData['parentId'];
                    }
                }
                if (!$scope.searchResult.length) {
                    hasResult = false;

                    if (!$scope.searchResultMessage) {
                        $scope.searchResultMessage = {
                            value: $scope.liLabels.InteractionLauncher_NoSearchResults,
                            type: 'alert-texture'
                        };
                    }
                }
                if (angular.equals({}, $scope.callerData) && !angular.equals({}, searchResultData)) {
                    verificationResult = searchResultData.verificationResult;
                } else {
                    verificationResult = $scope.callerData.verificationResult;
                }
                // Get step actions to show on result pane:
                if (secondSearch) {
                    $scope.actionFramework.getStepActions(
                        $scope.searchSection.requestUniqueName,
                        stepName,
                        $scope.searchSection.searchValueMap,
                        null,
                        $scope.eventData,
                        verificationResult,
                        hasResult);
                    // Call again after second search
                    $scope.actionFramework.getVerificationPaneActions(
                        $scope.searchSection.requestUniqueName,
                        null,
                        searchResultData.resultValueMap,
                        $scope.eventData,
                        searchResultData.verificationResult);
                } else {
                    $scope.actionFramework.getStepActions(
                        $scope.searchSection.requestUniqueName,
                        stepName,
                        $scope.searchSection.searchValueMap,
                        null,
                        $scope.eventData,
                        null,
                        hasResult);
                }
                // $scope.proceedPane(); moving this to getStepActions()
                console.log('$scope.searchResult: ', $scope.searchResult);
                $timeout(function() {
                    $rootScope.vlcLoading = false;
                }, 500);
            }, function(error) {
                $scope.validationErrorHandler.throwError(error);
            });
        }
    };

    $scope.$watch(function (scope) { return scope.viaPane; },
        function () {
            $timeout(function() {
                if ($scope.viaPane === 5) {
                    document.getElementsByClassName('via-pane-'+ $scope.viaPane)[0].getElementsByTagName('input')[0].focus();
                } else {
                    document.getElementsByClassName('via-pane-'+ $scope.viaPane)[0].getElementsByTagName('button')[0].focus();
                }
            }, 1000);
        }
    );


    $scope.proceedPane = function() {
        if ($scope.eventData && $scope.eventData.viaPane) {
            $scope.viaPane = $scope.eventData.viaPane;
        } else if ($scope.searchResult.length === 0 && $scope.actionFramework.resultActions && !$scope.actionFramework.resultActions.length) {
            if ($scope.searchResultMessage) {
                $scope.validationErrorHandler.validation.message = $scope.searchResultMessage.value;
                $scope.validationErrorHandler.validation.type = $scope.searchResultMessage.type;
            } else {
                $scope.validationErrorHandler.validation.message = $scope.liLabels.InteractionLauncher_NoSearchResults;
            }
        } else if ($scope.nextLookupRequests && $scope.nextLookupRequests.length) {
            // This means it's an agent's policy holder search, so go to correct pane:
            $scope.viaPane = 6;
        } else if ($scope.searchSection.searchType === 'Caller Identification') {
            $scope.viaPane = 1;
        } else if ($scope.searchSection.searchType === 'Related Party') {
            $scope.viaPane = 2;
        } else {
            $scope.viaPane = 2;
        }
    };

    $scope.getNextLookupRequestsHelper = function(result, newRecordId, tabId, fromEvent) {
        $scope.nextLookupRequests = result;
        if (!$scope.nextLookupRequests.length) {
            $scope.validationErrorHandler.validation.message = $scope.liLabels.InteractionLauncher_NoLookupRequests;
            $scope.validationErrorHandler.validation.type = 'error';
            $rootScope.vlcLoading = false;
            return;
        }
        if ($scope.callerData.verificationResult) {
            $scope.nextLookupRequests[0].verificationResult = $scope.callerData.verificationResult;
        } else {
            $scope.nextLookupRequests[0].verificationResult.status = true;
            $scope.nextLookupRequests[0].verificationResult.timestamp = new Date();
            $scope.nextLookupRequests[0].verificationResult.username = $scope.userName;
        }
        $scope.nextLookupRequests[0].parentId = newRecordId;
        $scope.nextLookupRequests[0].tabId = tabId;
        if (fromEvent) {
            $scope.actionFramework.getVerificationPaneActions(
                $scope.nextLookupRequests[0].uniqueRequestName,
                null,
                $scope.nextLookupRequests[0].resultValueMap,
                $scope.eventData,
                $scope.nextLookupRequests[0].verificationResult);
        }
        console.log('$scope.nextLookupRequests: ', $scope.nextLookupRequests);
        $scope.moreRequests = result[0].moreRequests;
        $scope.validationErrorHandler.validation.message = '';
        $scope.viaPane = 5;
        $rootScope.vlcLoading = false;
    };

    $scope.getNextLookupRequests = function(data, fromEvent) {
        var newRecordId = $scope.callerData.recordId;
        var newSearchType = $scope.callerData.uniqueRequestName;
        var tabId = $scope.callerData.tabId;
        if (data) {
            newRecordId = data.recordId;
            newSearchType = data.searchType;
            tabId = data.tabId;
        }
        $rootScope.vlcLoading = true;
        $scope.checkFieldVerification(newRecordId, newSearchType, tabId, null, null, function(newRecordId, newSearchType, tabId) {
            if (fromEvent) {
                $scope.eventDrivenMode.eventDriven = false;
                console.log(newRecordId, newSearchType);
                remoteActions.getNextLookupRequests([newRecordId], newSearchType, $scope.eventData)
                .then(function(result) {
                    $scope.getNextLookupRequestsHelper(result, newRecordId, tabId, fromEvent);
                    sforce.console.setCustomConsoleComponentVisible(true);
                }, function(error) {
                    $scope.validationErrorHandler.throwError(error);
                });
            } else {
                remoteActions.getNextLookupRequestsWithoutSearch(
                    angular.toJson($scope.callerData), $scope.callerData.uniqueRequestName)
                    .then(function(result) {
                    $scope.getNextLookupRequestsHelper(result, newRecordId, tabId, fromEvent);
                }, function(error) {
                    $scope.validationErrorHandler.throwError(error);
                });
            }
        }, false);
    };

    sforce.console.addEventListener('via-relaunch-verified-caller', function(e) {
        var data = angular.fromJson(e.message);
        $rootScope.vlcLoading = true;
        console.log(data);
        $scope.eventData = data;
        $scope.getNextLookupRequests(data, true);
    });

    sforce.console.addEventListener('via-verify-caller-from-console', function(e) {
        var data = angular.fromJson(e.message);
        $rootScope.vlcLoading = true;
        console.log(data);
        $scope.eventData = data;
        $scope.getSearchResultById(data, true);
    });

    sforce.console.addEventListener('via-display-search-results', function(e) {
        var data = angular.fromJson(e.message);
        $rootScope.vlcLoading = true;
        console.log(data);
        data.viaPane = $scope.searchSection.searchType === 'Caller Identification' ? 1 : 2;
        $scope.eventData = data;
        $scope.getSearchResultByIds(data, true);
    });

    sforce.console.addEventListener('via-launch-lookup-widget', function(e) {
        var data = angular.fromJson(e.message);
        $rootScope.vlcLoading = true;
        console.log(data);
        $scope.eventData = data;
        $scope.startNewSearch(true);
    });

    $scope.getSearchResultById = function(data, eventDriven) {
        if (eventDriven) {
            $scope.eventDrivenMode.eventDriven = false;
        }
        $scope.validationErrorHandler.validation.message = '';
        remoteActions.getSearchResultById(data.recordId, data.searchType, $scope.eventData).then(function(result) {
            console.log(result);
            if (result && result.length) {
                $scope.callerData = result[0];
                $scope.callerData.focusedTabId = data.tabId;
                $scope.callerData.recordId = data.recordId;
                console.log('Verify/callerData: ', $scope.callerData);
                $scope.actionFramework.getVerificationPaneActions(
                    $scope.callerData.uniqueRequestName,
                    null,
                    $scope.callerData.resultValueMap,
                    $scope.eventData,
                    $scope.callerData.verificationResult);
                if ($scope.eventData) {
                    $scope.callerData.eventData = $scope.eventData;
                }
                $scope.viaPane = 3;
                if ($scope.callerData && !$scope.callerData.request.continueSearch) {
                    $scope.actionFramework.getStepActions(
                        $scope.callerData.uniqueRequestName,
                        'Second Result Pane',
                        $scope.searchSection.searchValueMap,
                        $scope.callerData.resultValueMap,
                        $scope.eventData,
                        $scope.callerData.verificationResult,
                        true);
                }
            } else {
                $scope.validationErrorHandler.validation.message =
                    $scope.liLabels.InteractionLauncher_NoSearchResultsRecordId + ' \'' + data.searchType + '\'.';
                $scope.validationErrorHandler.validation.type = 'error';
            }
            sforce.console.setCustomConsoleComponentVisible(true);
            $scope.vlcLoading = false;
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.getSearchResultByIds = function(data, eventDriven) {
        var i, recordList;
        var hasResult = true;
        if (eventDriven) {
            $scope.eventDrivenMode.eventDriven = false;
        }
        $scope.validationErrorHandler.validation.message = '';
        try {
            recordList = angular.fromJson(data.recordId);
        } catch (e) {
            recordList = [data.recordId];
        }
        console.log('recordList', recordList);
        if (typeof recordList[0] === 'object') {
            recordList = [data.recordId];
        }
        console.log(recordList);
        $scope.contextIds = recordList;
        remoteActions.getSearchResultByIds(recordList, data.searchType, $scope.eventData).then(function(result) {
            console.log('getSearchResultByIds: ', result);
            if (result && result.parentContextSearchResult && result.parentContextSearchResult.length) {
                $scope.searchResult = result.parentContextSearchResult;
                $scope.hasMoreResults = result.hasMore;
                // This needs to be stored so that pagination will work:
                $scope.searchSection = $scope.searchResult[$scope.searchResult.length - 1].request;
                $scope.searchSection.lastRecordId = $scope.searchResult[$scope.searchResult.length - 1].recordId;
                // CORE-1103
                $scope.searchSection.recordOffSet = result.recordOffSet;
                for (i = 0; i < $scope.searchResult.length; i++) {
                    $scope.searchResult[i].eventData = data;
                    $scope.searchResult[i].tabId = data.tabId;
                }
                $scope.actionFramework.getStepActions(
                    $scope.searchSection.requestUniqueName,
                    'ResultPane',
                    $scope.searchSection.searchValueMap,
                    null,
                    $scope.eventData,
                    null,
                    hasResult);
            } else {
                hasResult = false;
                $scope.searchResultMessage = {
                    value: $scope.liLabels.InteractionLauncher_NoSearchResults,
                    type: 'alert-texture'
                };
                $scope.actionFramework.getStepActions(
                    $scope.eventData.searchType,
                    'ResultPane',
                    null,
                    null,
                    $scope.eventData,
                    null,
                    hasResult);
            }
            $scope.actionFramework.getStepActions(
                $scope.eventData.searchType,
                'ResultPane',
                null,
                null,
                $scope.eventData,
                null,
                hasResult);
            sforce.console.setCustomConsoleComponentVisible(true);
            $scope.vlcLoading = false;
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.checkFieldVerification = function(newRecordId, newSearchType, tabId, selectedAction, input, callback, alreadyInvoked) {
        var key, i;
        var checkArray = [];
        var verificationFieldKeys = [];
        var requiredFieldsChecked = true;
        var numOfOptionalVerificationFields = $scope.callerData.numOfOptionalVerificationFields || 0;
        console.log('callerData:', $scope.callerData);
        if ($scope.callerData.verificationResult && !angular.equals({}, $scope.callerData.verificationResult) && $scope.callerData.verificationResult.fields) {
            verificationFieldKeys = Object.keys($scope.callerData.verificationResult.fields);
            for (i = 0; i < $scope.callerData.verificationFieldList.length; i++) {
                if (verificationFieldKeys.indexOf($scope.callerData.verificationFieldList[i]) < 0 ||
                    !$scope.callerData.verificationResult.fields[$scope.callerData.verificationFieldList[i]]) {
                    requiredFieldsChecked = false;
                    i = $scope.callerData.verificationFieldList.length + 1;
                }
            }
            for (key in $scope.callerData.verificationResult.fields) {
                if ($scope.callerData.verificationResult.fields[key]) {
                    checkArray.push($scope.callerData.verificationResult.fields[key]);
                }
            }
            // If we got through the for loop without any false verifications over the allowed amount,
            // check to make sure all required fields + required optional fields were actually verfied
            if (!requiredFieldsChecked || checkArray.length < ($scope.callerData.verificationFieldList.length +
                numOfOptionalVerificationFields)) {
                $scope.callerData.verificationResult.status = false;
            } else {
                $scope.callerData.verificationResult.status = true;
                $scope.callerData.verificationResult.timestamp = new Date();
                $scope.callerData.verificationResult.username = $scope.userName;
                // If alreadyInvoked is true, we don't want to invokeAction again as we'll get into a recursive mess:
                if (!alreadyInvoked) {
                    $scope.actionFramework.invokeAction($scope.actionFramework.verifyAction[0], $scope.callerData, true);
                }
                // Call callback only if verfied:
                // recordId, searchType, tabId, selectedAction, input
                callback(newRecordId, newSearchType, tabId, selectedAction, input);
                return true;
            }
            console.log($scope.callerData.verificationResult);
            if ($scope.callerData.verificationResult.status === undefined ||
                $scope.callerData.verificationResult.status === false) {
                $scope.validationErrorHandler.validation.message =
                    $scope.liLabels.InteractionLauncher_CallerFields;
                $scope.validationErrorHandler.validation.type = 'error';
                // If alreadyInvoked is true, we don't want to invokeAction again as we'll get into a recursive mess:
                if (!alreadyInvoked) {
                    $scope.actionFramework.invokeAction($scope.actionFramework.verifyAction[0], $scope.callerData, true);
                }
                $rootScope.vlcLoading = false;
                return false;
            }
        } else if (angular.equals({}, $scope.callerData.verificationResult)) {
            $scope.validationErrorHandler.validation.message =
                $scope.liLabels.InteractionLauncher_CallerFields;
            $scope.validationErrorHandler.validation.type = 'error';
            // If alreadyInvoked is true, we don't want to invokeAction again as we'll get into a recursive mess:
            if (!alreadyInvoked) {
                $scope.actionFramework.invokeAction($scope.actionFramework.verifyAction[0], $scope.callerData, true);
            }
            $rootScope.vlcLoading = false;
            return false;
        } else {
            callback(newRecordId, newSearchType, tabId, selectedAction, input);
        }
    };

    // On Search Results Page, format label as class name for styling
    $scope.formatLabelAsClass = function(label) {
        if (label !== undefined) {
            return label.toLowerCase().replace(' ', '-');
        }
        return '';
    };

    // Verify Search Result
    $scope.verifySearchResult = function(result) {
        $scope.callerData = result;
        console.log('$scope.callerData: ', $scope.callerData);
        $scope.viaPane = 3;
        $scope.actionFramework.getVerificationPaneActions(
            $scope.callerData.uniqueRequestName,
            $scope.searchSection.searchValueMap || null,
            $scope.callerData.resultValueMap,
            $scope.eventData,
            $scope.callerData.verificationResult);
    };

    // On Last Pane, each field needs to be verified:
    $scope.verifyField = function($event, verification, field) {
        $event.currentTarget.blur();
        if ($scope.callerData.verificationResult.fields === undefined) {
            $scope.callerData.verificationResult.fields = {};
        }
        $scope.callerData.verificationResult.fields[field] = verification;
        console.log($scope.callerData);
    };

    // Navigate backwards:
    $scope.goBackOnePane = function() {
        // $scope.searchSection needs to stay in tact so the user can refine their search if they go
        // backwards. However, if there is pagination, and the user paginated, there are two keys that
        // need to be removed upon navigating backwards: 'lasRecordId' and 'recordOffSet'. If these are
        // still present when searching from the first pane, the controller will return results based on 
        // these values as it will assume we're in the middle of pagination
        if ('lastRecordId' in $scope.searchSection) {
            delete $scope.searchSection.lastRecordId;
        }
        if ('recordOffSet' in $scope.searchSection) {
            delete $scope.searchSection.recordOffSet;
        }
        $scope.validationErrorHandler.validation.message = '';
        if ($scope.viaPane !== 2 && $scope.viaPane !== 3) {
            $scope.viaPane = $scope.viaPane - 1;
        } else if ($scope.viaPane === 3 && $scope.searchSection.searchType === 'Caller Identification') {
            $scope.viaPane = $scope.viaPane - 2;
            console.log('Went back 2 spots to search results');
        } else if ($scope.viaPane === 3 && $scope.searchSection.searchType === 'Related Party') {
            $scope.viaPane = $scope.viaPane - 1;
            console.log('Went back 1 spots to search results');
        } else {
            $scope.viaPane = $scope.viaPane - 2;
        }
    };

    $scope.closeWidget = function() {
        sforce.console.setCustomConsoleComponentVisible(false, function() {
            $timeout(function() {
                $scope.startNewSearch();
            }, 1000);
        });
    };

    // Start a new search and reset all data:
    $scope.startNewSearch = function(eventDriven) {
        $scope.viaPane = 0;
        $scope.lookupRequests = [];
        $scope.moreRequests = [];
        $scope.nextLookupRequests = [];
        $scope.eventDrivenMode = angular.fromJson(window.eventDrivenMode);
        if (!eventDriven) {
            $scope.eventData = null;
        }
        $scope.getLookupRequests(eventDriven);
        $timeout(function() {
            $scope.validationErrorHandler.validation.message = '';
            $scope.searchResult = [];
            $scope.searchResultMessage = undefined;
            $scope.callerData = {};
            $scope.searchSection = {};
            $scope.roleBasedActions = [];
            $scope.hasMoreResults = false;
            $scope.previousResults = undefined;
            $scope.resultsPerPage = undefined;
            $scope.lastResultIndex = undefined;
            $scope.retrievedAllResults = false;
            $scope.contextIds = null;
        }, 750);
    };
});

},{}],3:[function(require,module,exports){
angular.module('lookuprequestresult').directive('customAutofocus', function() {
    'use strict';
    var unfocused = true;
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
            if (unfocused && scope.focusIndex !== null) {
                scope.$watch(function() {
                    if (scope.$eval(attrs.customAutofocus)) {
                        return scope.$eval(attrs.customAutofocus);
                    }
                }, function(newValue) {
                    if (newValue === true) {
                        element[0].focus();
                        unfocused = false;
                        scope.focusIndex = null;
                    }
                });
            }
        }
    };
});

},{}],4:[function(require,module,exports){
angular.module('lookuprequestresult').directive('fixToTop', function($timeout) {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var scrollEl = $(attrs.scrollElement);
            var topSibling = $(attrs.topSibling);
            var topClass = attrs.fixToTop; // get CSS class from directive's attribute value
            var offsetTop = element.offset().top; // get element's offset top relative to document

            scrollEl.on('scroll', function(e) {
                if (scrollEl.scrollTop() <= offsetTop) {
                    element.removeClass(topClass);
                    topSibling.removeClass(topClass);
                } else {
                    element.addClass(topClass);
                    topSibling.addClass(topClass);
                }
            });

            scope.$watch('viaPane', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $('.via-pane-' + newValue).scrollTop(0);
                    if (element.hasClass(topClass)) {
                        $timeout(function() {
                            element.removeClass(topClass);
                            topSibling.removeClass(topClass);
                        }, 200);
                    }
                }
            });
        }
    };
});

},{}],5:[function(require,module,exports){
angular.module('lookuprequestresult').factory('ActionFramework', function(
    remoteActions, $rootScope) {
    'use strict';
    var ActionFramework = function(scp) {
        this.initialize = function() {

        };

        var self = this;
        this.actions = [];
        this.resultActions = [];
        this.verificationActions = [];
        this.verifyAction = [];
        this.isSforce = (typeof sforce !== 'undefined' && typeof sforce.one !== 'undefined') ? (true) : (false);
        $rootScope.vlcLoading = false;
        this.selectedAction = {};

        this.getStepActions = function(
            unqiueRequestName, stepName, searchValueMap, resultValueMap, additionalData, verificationResult, hasResult) {
            remoteActions.getStepActions(
                unqiueRequestName,
                stepName,
                searchValueMap,
                resultValueMap,
                additionalData,
                verificationResult,
                hasResult).then(function(result) {
                self.resultActions = result;
                console.log('getStepActions:', result);
                if (!result.length && !scp.searchResultMessage) {
                    scp.searchResultMessage = result.message;
                }
                scp.proceedPane();
                $rootScope.vlcLoading = false;
            }, function(error) {
                scp.validationErrorHandler.throwError(error);
            });
        };

        this.getVerificationPaneActions = function(
            unqiueRequestName, searchValueMap, resultValueMap, additionalData, verificationResult) {
            remoteActions.getVerificationPaneActions(
                unqiueRequestName,
                searchValueMap,
                resultValueMap,
                additionalData,
                verificationResult).then(function(result) {
                self.actions = result.Launch;
                self.verificationActions = result.VerificationPane;
                self.verifyAction = result.VerifyAction;
                self.selectedAction = self.actions[0];
                console.log('getVerificationPaneActions:', result);
                $rootScope.vlcLoading = false;
            }, function(error) {
                scp.validationErrorHandler.throwError(error);
            });
        };

        // DEPRECATED
        this.getRoleBasedActions = function(searchObjectName) {
            console.log(searchObjectName);
            console.log('policy id: ' + scp.searchResult[0].resultValueMap[scp.nameSpacePrefix + 'PolicyId__c']);
            remoteActions.getRoleBasedActions(searchObjectName,
                scp.searchResult[0].resultValueMap[scp.nameSpacePrefix + 'PolicyId__c']).then(function(result) {
                scp.roleBasedActions = result;
                console.log(scp.roleBasedActions);
            });
        };

        this.onNavigate = function(url, label, urlOpenMode, subTabUrl, input) {
            var doneData;
            var actionData = {
                currentUrl: url,
                currentLabel: label
            };
            console.log('currentUrl: ' + actionData.currentUrl);
            console.log('currentLabel: ' + actionData.currentLabel);
            console.log('subTabUrl: ' + subTabUrl);
            if (sforce.console.isInConsole() && url != null) {
                // If it is no tabId
                if (!input.tabId || input.focusedTabId) {
                    // TODO: Pass in tab name from input which comes from invokeAction policyData,
                    // passed in from search result
                    sforce.console.openPrimaryTab(
                        null, actionData.currentUrl, true, actionData.currentLabel, function(result) {
                        if (subTabUrl) {
                            sforce.console.openSubtab(
                                result.id, subTabUrl, true, actionData.currentLabel, null, function(subtabResult) {
                                sforce.console.setCustomConsoleComponentVisible(false, function(closeResult) {
                                    console.log('closed Console Component: ', closeResult);
                                    scp.startNewSearch();
                                    // Fire Done Event:
                                    doneData = {
                                        primaryTabId: result.id,
                                        subTabId: subtabResult.id,
                                        inputData: input
                                    };
                                    sforce.console.fireEvent('via-interaction-done', angular.toJson(doneData));
                                    // viaLoading is set to false in startNewSearch() via getLookupRequests()
                                });
                                if (scp.callerData && scp.callerData.focusedTabId) {
                                    sforce.console.closeTab(scp.callerData.focusedTabId);
                                    delete scp.callerData.focusedTabId;
                                }
                            });
                        } else {
                            sforce.console.setCustomConsoleComponentVisible(false, function(closeResult) {
                                console.log('closed Console Component: ', closeResult);
                                scp.startNewSearch();
                                // Fire Done Event:
                                doneData = {
                                    primaryTabId: result.id,
                                    subTabId: null,
                                    inputData: input
                                };
                                sforce.console.fireEvent('via-interaction-done', angular.toJson(doneData));
                                // viaLoading is set to false in startNewSearch() via getLookupRequests()
                            });
                            if (scp.callerData && scp.callerData.focusedTabId) {
                                sforce.console.closeTab(scp.callerData.focusedTabId);
                                delete scp.callerData.focusedTabId;
                            }
                        }
                    });
                // if there is a tabId
                } else {
                    console.log('input.tabId: ' + input.tabId);
                    sforce.console.openSubtab(
                        input.tabId, subTabUrl, true, actionData.currentLabel, null, function(subTabResult) {
                        var subTabId = subTabResult.id;
                        console.log('Opened subtab with id: ' + subTabId);
                        sforce.console.setCustomConsoleComponentVisible(false, function(closeResult) {
                            console.log('closed Console Component: ', closeResult);
                            scp.startNewSearch();
                            console.log('Minimized Colsole Component widget and refreshed search.');
                            // viaLoading is set to false in startNewSearch() via. getLookupRequests()
                            sforce.console.getSubtabIds(input.tabId, function(subTabIds) {
                                console.log('subTabIds.ids: ', subTabIds.ids);
                                sforce.console.refreshSubtabById(subTabIds.ids[0], true, function(refreshSubtab) {
                                    sforce.console.focusSubtabById(subTabId);
                                    console.log('Refreshed primary tab and focused subTab.');
                                    // Fire Done Event:
                                    doneData = {
                                        subTabId: subTabId,
                                        inputData: input
                                    };
                                    sforce.console.fireEvent('via-interaction-done', angular.toJson(doneData));
                                }, true);
                            });
                        });
                        if (scp.callerData && scp.callerData.focusedTabId) {
                            sforce.console.closeTab(scp.callerData.focusedTabId);
                            delete scp.callerData.focusedTabId;
                        }
                    });
                }
            } else if (!this.isSforce && url != null) { // aloha
                if (urlOpenMode === 'New Tab / Window') {
                    window.open(actionData.currentUrl, '_blank');
                } else {
                    window.parent.location.href = actionData.currentUrl;
                }
                scp.viaPane = 4;
                $rootScope.vlcLoading = false;
            } else if (this.isSforce && url != null) { // sf1
                sforce.one.navigateToURL(actionData.currentUrl);
                scp.viaPane = 4;
                $rootScope.vlcLoading = false;
            }
        };

        var invokeVOIMethod = function(recordId, searchType, tabId, selectedAction, input, verifyAction) {
            // Case 5
            if (selectedAction && selectedAction.url && !selectedAction.className && !selectedAction.methodName) {
                // Need to add tabId in this case so url opens in a subtab:
                if (scp.eventData && scp.eventData.tabId) {
                    input.tabId = scp.eventData.tabId;
                    // Need to delete focusedTabId so that the current primary tab does not get closed:
                    if (scp.callerData && scp.callerData.focusedTabId) {
                        delete scp.callerData.focusedTabId;
                    }
                }
                var subTabUrl = input.tabId ? selectedAction.url : null;
                self.onNavigate(
                    selectedAction.url,
                    selectedAction.displayName,
                    selectedAction.openUrlIn,
                    subTabUrl,
                    input
                );
                return;
            // Cases 1-4
            } else if (selectedAction.className && selectedAction.methodName) {
                var option = {};
                var parentActionUrl, actionUrl, doneData;
                console.log('input in checkFieldVerificationAndProcess callback', input);
                console.log('passing input stringified: ', input);
                remoteActions.invokeVOIMethod(selectedAction.className, selectedAction.methodName,
                    angular.toJson(input), angular.toJson(option)).then(function(result) {
                    var remoteResp = angular.fromJson(result);
                    console.log('invokeVOIMethod: ', result);
                    if (remoteResp && remoteResp.Error !== 'OK') {
                        scp.validationErrorHandler.validation.message = remoteResp.Error;
                        scp.validationErrorHandler.validation.type = 'error';
                        $rootScope.vlcLoading = false;
                    } else {
                        if (remoteResp[input.interactionObjName + 'Id'] === undefined ||
                            remoteResp['parent' + input.interactionObjName + 'Id'] === undefined) {
                            scp.validationErrorHandler.validation.message =
                                'There was an error creating the ' + input.interactionObjName;
                            scp.validationErrorHandler.validation.type = 'error';
                            $rootScope.vlcLoading = false;
                            return;
                        }
                        if (selectedAction.url) {
                            // URL & caseId
                            if (remoteResp[input.interactionObjName + 'Id']) {
                                actionUrl = selectedAction.url +
                                    '?launchSource=VlocityInteraction&' +
                                    input.interactionObjName +
                                    'Id=' + remoteResp[input.interactionObjName + 'Id'];
                                parentActionUrl = actionUrl;
                                if (remoteResp['parent' + input.interactionObjName + 'Id']) {
                                    actionUrl = actionUrl + '&parent' + input.interactionObjName + 'Id=' +
                                        remoteResp['parent' + input.interactionObjName + 'Id'];
                                    parentActionUrl = actionUrl;
                                }
                            // URL & no caseId
                            } else {
                                actionUrl = selectedAction.url + '?launchSource=VlocityInteraction';
                                parentActionUrl = actionUrl;
                            }
                        } else if (verifyAction) {
                            // This is a verifyAction and we just needed to invokeVOIMethod so custom code gets
                            // run.
                            console.log('verifyAction found, action invoked.');
                            return;
                        // No URL
                        } else {
                            // No URL & caseId exists
                            if (remoteResp[input.interactionObjName + 'Id']) {
                                actionUrl = '/' + remoteResp[input.interactionObjName + 'Id'] +
                                    '?launchSource=VlocityInteraction';
                                parentActionUrl = '/' + remoteResp['parent' + input.interactionObjName + 'Id'] +
                                    '?launchSource=VlocityInteraction';
                            // No URL & no caseId
                            } else {
                                // Close LI and send done event:
                                sforce.console.setCustomConsoleComponentVisible(false, function(closeResult) {
                                    console.log('closed Console Component: ', closeResult);
                                    scp.startNewSearch();
                                    // Fire Done Event:
                                    doneData = {
                                        primaryTabId: null,
                                        subTabId: null,
                                        inputData: input
                                    };
                                    sforce.console.fireEvent('via-interaction-done', angular.toJson(doneData));
                                    // viaLoading is set to false in startNewSearch() via getLookupRequests()
                                });
                            }
                        }
                        console.log('actionUrl:', actionUrl);
                        console.log('parentActionUrl:', parentActionUrl);
                        // onNavigate: url, label, urlOpenMode, subTabUrl, input
                        if (!input.tabId) {
                            console.log('No tab Id');
                            self.onNavigate(
                                parentActionUrl,
                                selectedAction.displayName,
                                selectedAction.openUrlIn,
                                actionUrl,
                                input
                            );
                        // No tabId
                        } else {
                            console.log('Found tab Id');
                            // Pass in nextLookupResults
                            self.onNavigate(
                                parentActionUrl,
                                selectedAction.displayName,
                                selectedAction.openUrlIn,
                                actionUrl,
                                input
                            );
                        }
                    }
                });
            // Case 6
            } else {
                scp.validationErrorHandler.validation.message = 'Action Button not configured correctly.';
                scp.validationErrorHandler.validation.type = 'error';
                $rootScope.vlcLoading = false;
                return;
            }
        };

        this.checkFieldVerificationAndProcess = function(selectedAction, policyData, alreadyInvoked) {
            var input = policyData || scp.callerData;
            alreadyInvoked = alreadyInvoked || false;
            console.log('input in checkFieldVerificationAndProcess', input);
            console.log('selectedAction in checkFieldVerificationAndProcess', selectedAction);
            scp.checkFieldVerification(
                policyData.recordId,
                policyData.uniqueRequestName,
                policyData.tabId,
                selectedAction,
                input,
                invokeVOIMethod,
                alreadyInvoked
            );
        };

        this.invokeAction = function(selectedAction, policyData, verifyAction) {
            var uniqueRequestName = 'uniqueRequestName';
            $rootScope.vlcLoading = true;
            verifyAction = verifyAction || false;
            console.log('policyData: ', policyData);
            if (policyData) {
                // policyData is passed in when the view button is clicked after a second search is
                // done on a parent's (agent) policies:
                if (scp.callerData.recordId && scp.callerData.verificationResult) {
                    policyData.parentId = scp.callerData.recordId;
                    policyData.searchTimestamp = new Date();
                    policyData.verificationResult = scp.callerData.verificationResult;
                    // add parent interactionObjName id
                }
            } else if (!angular.equals({}, scp.callerData)) {
                policyData = scp.callerData;
            } else if (scp.searchResult.length && !angular.equals({}, scp.searchResult[0])) {
                policyData = scp.searchResult[0];
            } else {
                policyData = scp.searchSection;
                uniqueRequestName = 'requestUniqueName';
            }
            if (scp.eventData) {
                policyData.eventData = scp.eventData;
                policyData.tabId = scp.eventData.tabId;
            }
            if (scp.callerData.focusedTabId) {
                policyData.focusedTabId = scp.callerData.focusedTabId;
            }
            if (!verifyAction) {
                scp.validationErrorHandler.validation.message = '';
            }
            if (selectedAction !== undefined) {
                invokeVOIMethod(
                    policyData.recordId,
                    policyData[uniqueRequestName],
                    policyData.tabId,
                    selectedAction,
                    policyData,
                    verifyAction
                );
            } else if (verifyAction) {
                return;
            } else {
                this.checkFieldVerificationAndProcess(self.selectedAction, policyData, true);
            }
        };

        this.invokeValidation = function() {
            var selectedAction = self.selectedAction;
            var input = scp.callerData;
            var option = {};
            console.log('passing input stringified: ', input);
            remoteActions.invokeVOIMethod(selectedAction.validationClassName, selectedAction.validationMethodName,
                angular.toJson(input), angular.toJson(option)).then(function(result) {
                var remoteResp = angular.fromJson(result);
                if (remoteResp && remoteResp.Error !== 'OK') {
                    scp.validationErrorHandler.validation.message = remoteResp.Error;
                    scp.validationErrorHandler.validation.type = 'error';
                } else if (remoteResp && remoteResp.Warning) {
                    scp.validationErrorHandler.validation.message = remoteResp.Warning;
                    scp.validationErrorHandler.validation.type = 'warning';
                }
            });
        };

        this.invoke = function(selected) {
            self.selectedAction = selected || self.selectedAction;
            if (self.selectedAction.validationClassName && self.selectedAction.validationMethodName) {
                self.invokeValidation();
            } else {
                self.invokeAction();
            }
        };

        this.refreshSuccess = function(result) {
            //Report whether refreshing the primary tab was successful
            if (result.success === true) {
                console.log('Primary tab refreshed successfully');
            } else {
                console.log('Primary did not refresh');
            }
        };

        // Initialize
        this.initialize();
    };
    return (ActionFramework);
});

},{}],6:[function(require,module,exports){
angular.module('lookuprequestresult').factory('ValidationErrorHandler', function(
    remoteActions, $modal, $rootScope, $timeout) {
    'use strict';
    var ValidationErrorHandler = function() {
        this.initialize = function() {
            // anything that immediately should fire upon instantiation
        };

        this.validation = {
            type: ''
        };

        this.hideValidation = function() {
            this.validation.message = '';
            this.validation.type = '';
        };

        // Error handling helper
        this.throwError = function(error) {
            var statusCode;
            console.log(error.message);
            if (!error.message) {
                error.message = 'No error message.';
            }
            if (error.statusCode) {
                statusCode = '(' + error.statusCode + '): ';
            } else {
                statusCode = '';
            }
            if (typeof error.type === 'string') {
                error.type = error.type.capitalizeFirstLetter() + ' ';
            } else {
                error.type = '';
            }
            if (error.message.indexOf('Logged in?') > -1) {
                error.message =
                    'You have been logged out of Salesforce. ' +
                    'Please back up any changes to your document and refresh your browser window to login again.';
                error.type = '';
                statusCode = '';
            }
            // this.validation.message = error.type + statusCode + error.message;
            this.validation.message = error.message;
            this.validation.type = 'error';
            $timeout(function() {
                $rootScope.vlcLoading = false;
            }, 500);
        };

        // Adding to String prototype
        String.prototype.capitalizeFirstLetter = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        // Initialize
        this.initialize();
    };
    return (ValidationErrorHandler);
});

},{}],7:[function(require,module,exports){
angular.module('lookuprequestresult').filter('maskField', function () {
    return function (input, type, label) {
        if(type === 'encryptedstring') {
            switch (label) {
                case 'Social Security Number':
                    return input ? 'XXX-XX-' + input.substr(5, 4) : input;
                    break;
                default:
                    return input;
            }
        } else {
            return input;
        }
    };
})
},{}],8:[function(require,module,exports){
(function() {
    'use strict';
    window.angular.module('lookuprequestresult').service('browserDetection', ['$window', function($window) {
        this.userAgent = $window.navigator.userAgent;
        this.browsers = {
            chrome: /chrome/i,
            safari: /safari/i,
            firefox: /firefox/i,
            msielte10: /msie/i,
            msiegt10: /rv:/i,
            edge: /edge/i
        };

        this.detectBrowser = function() {
            var key;
            var userAgent = this.userAgent;
            var browsers = this.browsers;
            for (key in browsers) {
                if (browsers[key].test(userAgent)) {
                    return key;
                }
            }
            return 'unknown';
        };

        this.getBrowserVersion = function() {
            var version, i;
            var browser = this.detectBrowser();
            var userAgent = this.userAgent;
            var versionSearch = [{
                browser: 'chrome',
                before: ' ',
                after: 'Chrome/'
            }, {
                browser: 'safari',
                before: ' ',
                after: 'Version/'
            }, {
                browser: 'firefox',
                before: '',
                after: 'Firefox/'
            }, {
                browser: 'msielte10',
                before: ';',
                after: 'MSIE '
            }, {
                browser: 'msiegt10',
                before: ')',
                after: 'rv:'
            }, {
                browser: 'edge',
                before: '',
                after: 'Edge/'
            }];

            for (i = 0; i < versionSearch.length; i++) {
                if (browser === versionSearch[i].browser) {
                    version = userAgent.split(versionSearch[i].after)[1];
                    if (versionSearch[i].before) {
                        version = parseFloat(version.substr(0, version.indexOf(versionSearch[i].before)));
                    }
                }
            }

            return version;
        };
    }]);
}());

},{}],9:[function(require,module,exports){
angular.module("lookuprequestresult").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("viaPane2.tpl.html",'\x3c!-- DEPRECATED AS OF v100 / Search Result Pane for Related Party Types  --\x3e\n<div class="inner-pane-container">\n    <div class="slds-clearfix vloc-il-header-panel">\n        <div class="slds-text-heading--medium related-parties slds-float--left">{{liLabels.InteractionLauncher_RelatedParty}}</div>\n        <p class="slds-float--right">Showing {{searchResult.length}} Results</p>\n    </div>\n    <h3 ng-if="actionFramework.resultActions.length" class="slds-section-title--divider via-result-actions slds-clearfix" fix-to-top="fix-to-top" scroll-element=".via-pane-2" top-sibling=".via-pane-2 .vloc-il-header-panel">\n        <span ng-if="actionFramework.resultActions.length < 7">{{liLabels.InteractionLauncher_UnrelatedParty}}</span>\n        <div class="slds-button-group" ng-class="{\'slds-float--right\': actionFramework.resultActions.length < 7}" role="group">\n            <button class="slds-button slds-button--icon-border via-result-action-btn via-result-action-{{$index}} via-result-action-pane-2-{{$index}}-{{action.displayName.toLowerCase().split(\' \').join(\'-\')}}" ng-click="actionFramework.invokeAction(action)" ng-repeat="action in actionFramework.resultActions" slds-popover data-nubbin-direction="{{(actionFramework.resultActions.length > 6) ? \'top-left\' : \'top-right\'}}" data-container=".via-result-action-pane-2-{{$index}}-{{action.displayName.toLowerCase().split(\' \').join(\'-\')}}" data-title="{{action.displayName}}" tooltip="true" ng-class="{\'overflow\': actionFramework.resultActions.length > 6}">\n                <i class="icon {{action.vlocityIcon}} slds-button__icon" ng-if="action.vlocityIcon && !action.imageRef"></i>\n                <img class="slds-button__icon" ng-src="{{action.imageRef}}" ng-if="action.imageRef"/>\n                <span class="slds-assistive-text">{{action.displayName}}</span>\n            </button>\n        </div>\n    </h3>\n    <div class="slds-notify_container no-search-results" ng-if="!searchResult.length && searchResultMessage">\n        <div class="slds-notify slds-notify--alert slds-theme--{{searchResultMessage.type}}" role="alert">\n            <span class="slds-assistive-text">Info</span>\n            <h2>{{searchResultMessage.value}} <a href="javascript:void(0)" ng-click="startNewSearch()">Restart Search</a></h2>\n        </div>\n    </div>\n    <ul class="slds-has-dividers--bottom">\n        <li class="slds-item list-header">\n            <div class="col"><span>{{searchResult[0].resultFieldsLabelTypeMap[searchResult[0].resultFieldList[0]].label}}</span></div>\n            <div class="col"><span>{{searchResult[0].resultFieldsLabelTypeMap[searchResult[0].resultFieldList[1]].label}}</span></div>\n            <div class="col"></div>\n        </li>\n        <li class="slds-item list-related-party" ng-repeat="result in searchResult">\n            <div class="col" ng-repeat="field in result.resultFieldList" ng-if="$index < 2">\n                <span ng-bind-html="result.resultValueMap[field]"></span>\n            </div>\n            <div class="col">\n                <button class="slds-button slds-button--neutral" ng-click="verifySearchResult(result)">{{liLabels.InteractionLauncher_Verify}}</button>\n            </div>\n        </li>\n    </ul>\n    <div class="pagination-buttons-container" ng-class="{\'active\': ((previousResults.length && (lastResultIndex > resultsPerPage)) || hasMoreResults) && viaPane === 2}">\n        <div class="slds-button-group pagination-buttons" role="group">\n            <button class="slds-button slds-button--neutral pagination-button pagination-previous" ng-click="getSearchResult(searchSection, contextIds, callerData, true);" ng-if="previousResults.length && (lastResultIndex > resultsPerPage)">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'back\'" extra-classes="\'slds-icon-text-default\'"></slds-button-svg-icon>\n                <span>Previous Results</span>\n            </button>   \n            <button class="slds-button slds-button--neutral pagination-button pagination-next" ng-click="getSearchResult(searchSection, contextIds, callerData, false); iconRotate = !iconRotate" ng-if="hasMoreResults" ng-class="{\'rotate\': iconRotate}">\n                <span>More Results</span>\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'sync\'" extra-classes="\'slds-icon-text-default\'"></slds-button-svg-icon>\n            </button>\n        </div>\n    </div>\n    <div class="request-form-footer" ng-class="{\'active\': (searchResult.length || searchResultMessage) && viaPane === 2}">\n        <div class="slds-button-group" role="group">\n            <button class="slds-button slds-button--icon-border" ng-click="goBackOnePane()" ng-hide="previousResults.length && (lastResultIndex > resultsPerPage)">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'back\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Back</span>\n            </button>\n            <button class="slds-button slds-button--icon-border" ng-click="startNewSearch()" ng-if="!eventDrivenNonOverride">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'redo\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Restart Search</span>\n            </button>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("viaPane5.tpl.html",'\x3c!-- DEPRECATED AS OF v100 / Second Search Form --\x3e\n<div class="inner-pane-container">\n    <form class="search-form" ng-submit="getSearchResult(moreRequests, contextIds, nextLookupRequests[0], false, true)" autocomplete="off">\n        <h3 class="slds-section-title--divider section-header no-margin-bottom">{{callerData.request.searchObjectLabel}}</h3>\n        <section class="search-result-section verified-agent" ng-repeat="result in nextLookupRequests">\n            <div ng-repeat="field in result.resultFieldList" class="search-result-field {{formatLabelAsClass(result.resultFieldsLabelTypeMap[field].label)}}">\n                <label ng-if="result.resultFieldsLabelTypeMap[field] && result.resultFieldsLabelTypeMap[field].label && field.indexOf(\'Name\') < 0 && field.toLowerCase().indexOf(\'address\') < 0">{{result.resultFieldsLabelTypeMap[field].label}}: </label>\n                <span class="search-result-field-value" ng-bind-html="result.resultValueMap[field]"></span>\n            </div>\n            <button type="button" class="slds-button slds-button--neutral" ng-click="actionFramework.invokeAction(undefined, nextLookupRequests[0])" ng-if="nextLookupRequests[0].interactionObjName">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'tabset\'" extra-classes="\'slds-button__icon--left\'"></slds-button-svg-icon>\n                View\n            </button>\n        </section>\n        <div class="slds-form--horizontal lookup-request-form" ng-repeat="request in moreRequests">\n            <h3 class="slds-section-title--divider section-header">{{request.searchObjectLabel}}</h3>\n            <div class="slds-form-element" ng-repeat="searchField in request.searchFieldList">\n                <label class="slds-form-element__label" for="{{searchField}}">{{request.searchFieldsLabelTypeMap[searchField].label}}</label>\n                <div class="slds-form-element__control {{request.searchFieldsLabelTypeMap[searchField].datatype}}" ng-include="\'LookupSearchForm.tpl.html\'"></div>\n            </div>\n        </div>\n        <div class="request-form-footer" ng-class="{\'active\': lookupRequests.length && viaPane === 5}">\n            <div class="slds-button-group" role="group" ng-if="!eventDrivenNonOverride">\n                <button type="button" class="slds-button slds-button--icon-border via-start-new-search" ng-click="startNewSearch()">\n                    <slds-button-svg-icon sprite="\'utility\'" icon="\'redo\'"></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Restart Search</span>\n                </button>\n            </div>\n            <button type="submit" class="slds-button slds-button--brand" ng-show="moreRequests.length">{{liLabels.InteractionLauncher_Search}}</button>\n        </div>\n    </form>\n</div>\n'),$templateCache.put("viaPane1.tpl.html",'\x3c!-- DEPRECATED AS OF v100 / Search Result Pane for Caller Identification Type --\x3e\n<div class="inner-pane-container">\n    <div class="slds-clearfix vloc-il-header-panel">\n        <div class="slds-text-heading--medium slds-float--left">{{liLabels.InteractionLauncher_SearchResult}}</div>\n        <p class="slds-float--right">Showing {{searchResult.length}} Results</p>\n    </div>\n    <h3 ng-if="actionFramework.resultActions.length" class="slds-section-title--divider via-result-actions slds-clearfix" fix-to-top="fix-to-top" scroll-element=".via-pane-1" top-sibling=".via-pane-1 .vloc-il-header-panel">\n        <span ng-if="actionFramework.resultActions.length < 7">{{liLabels.InteractionLauncher_UnrelatedParty}}</span>\n        <div class="slds-button-group" ng-class="{\'slds-float--right\': actionFramework.resultActions.length < 7}" role="group">\n            <button class="slds-button slds-button--icon-border via-result-action-btn via-result-action-{{$index}} via-result-action-pane-1-{{$index}}-{{action.displayName.toLowerCase().split(\' \').join(\'-\')}}" ng-click="actionFramework.invokeAction(action)" ng-repeat="action in actionFramework.resultActions" slds-popover data-nubbin-direction="{{(actionFramework.resultActions.length > 6) ? \'top-left\' : \'top-right\'}}" data-container=".via-result-action-pane-1-{{$index}}-{{action.displayName.toLowerCase().split(\' \').join(\'-\')}}" data-title="{{action.displayName}}" tooltip="true" ng-class="{\'overflow\': actionFramework.resultActions.length > 6}">\n                <i class="icon {{action.vlocityIcon}} slds-button__icon" ng-if="action.vlocityIcon && !action.imageRef"></i>\n                <img class="slds-button__icon" ng-src="{{action.imageRef}}" ng-if="action.imageRef"/>\n                <span class="slds-assistive-text">{{action.displayName}}</span>\n            </button>\n        </div>\n    </h3>\n    <div class="slds-notify_container no-search-results" ng-if="!searchResult.length && searchResultMessage">\n        <div class="slds-notify slds-notify--alert slds-theme--{{searchResultMessage.type}}" role="alert">\n            <span class="slds-assistive-text">Info</span>\n            <h2>{{searchResultMessage.value}} <a href="javascript:void(0)" ng-click="startNewSearch()">Restart Search</a></h2>\n        </div>\n    </div>\n    <section class="search-result-section" ng-repeat="result in searchResult">\n        <div ng-repeat="field in result.resultFieldList" class="search-result-field {{formatLabelAsClass(result.resultFieldsLabelTypeMap[field].label)}}">\n            <label ng-if="result.resultFieldsLabelTypeMap[field] && result.resultFieldsLabelTypeMap[field].label && field.indexOf(\'Name\') < 0 && field.toLowerCase().indexOf(\'address\') < 0">{{result.resultFieldsLabelTypeMap[field].label}}: </label>\n            <span class="search-result-field-value" ng-bind-html="result.resultValueMap[field]"></span>\n        </div>\n        <button class="slds-button slds-button--neutral" ng-click="verifySearchResult(result)">Verify</button>\n    </section>\n    <div class="pagination-buttons-container" ng-class="{\'active\': ((previousResults.length && (lastResultIndex > resultsPerPage)) || hasMoreResults) && viaPane === 1}">\n        <div class="slds-button-group pagination-buttons" role="group">\n            <button class="slds-button slds-button--neutral pagination-button pagination-previous" ng-click="getSearchResult(searchSection, contextIds, callerData, true);" ng-if="previousResults.length && (lastResultIndex > resultsPerPage)">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'back\'" extra-classes="\'slds-icon-text-default\'"></slds-button-svg-icon>\n                <span>Previous Results</span>\n            </button>   \n            <button class="slds-button slds-button--neutral pagination-button pagination-next" ng-click="getSearchResult(searchSection, contextIds, callerData, false); iconRotate = !iconRotate" ng-if="hasMoreResults" ng-class="{\'rotate\': iconRotate}">\n                <span>More Results</span>\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'sync\'" extra-classes="\'slds-icon-text-default\'"></slds-button-svg-icon>\n            </button>\n        </div>\n    </div>\n    <div class="request-form-footer" ng-class="{\'active\': (searchResult.length || searchResultMessage) && viaPane === 1}">\n        <div class="slds-button-group" role="group">\n            <button class="slds-button slds-button--icon-border" ng-click="goBackOnePane()" ng-hide="previousResults.length && (lastResultIndex > resultsPerPage)">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'back\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Back</span>\n            </button>\n            <button class="slds-button slds-button--icon-border via-start-new-search" ng-click="startNewSearch()" ng-if="!eventDrivenNonOverride">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'redo\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Restart Search</span>\n            </button>\n        </div>\n    </div>\n</div>'),$templateCache.put("LookupSearchForm.tpl.html",'<input ng-model="request.searchValueMap[searchField]" id="{{searchField}}" class="slds-input" type="{{request.searchFieldsLabelTypeMap[searchField].datatype}}" ng-change="cleanFormField(request.searchValueMap)" ng-if="request.searchFieldsLabelTypeMap[searchField].datatype !== \'date\' && request.searchFieldsLabelTypeMap[searchField].datatype !== \'picklist\' && request.searchFieldsLabelTypeMap[searchField].datatype !== \'checkbox\'" custom-autofocus="$parent.$index === focusIndex && $index === focusIndex" />\n<span class="slds-checkbox" ng-if="request.searchFieldsLabelTypeMap[searchField].datatype === \'checkbox\'">\n    <label class="slds-checkbox__label" for="checkbox-{{$index}}">\n        <input ng-model="request.searchValueMap[searchField]" type="checkbox" name="options-{{$index}}" id="checkbox-{{$index}}" ng-checked="request.searchValueMap[searchField]" />\n        <span class="slds-form-element__label">{{request.searchFieldsLabelTypeMap[searchField].label}}</span>\n        <span class="slds-checkbox--faux"></span>\n    </label>\n</span>\n<input ng-model="request.searchValueMap[searchField]" id="{{searchField}}" class="slds-input slds-ngstrap-datepicker" type="text" ng-change="cleanFormField(request.searchValueMap)" ng-if="request.searchFieldsLabelTypeMap[searchField].datatype === \'date\'" bs-datepicker="true" />\n<div class="slds-select_container" ng-if="request.searchFieldsLabelTypeMap[searchField].datatype === \'picklist\'">\n    <select id="{{searchField}}" ng-model="request.searchValueMap[searchField]" class="slds-select" ng-options="picklist for picklist in request.fieldPicklistValues[searchField]"></select>\n</div>\n<slds-svg-icon sprite="\'utility\'" icon="\'monthlyview\'" size="\'small\'" extra-classes="\'slds-icon-monthlyview icon-text-email slds-m-right--x-small\'" ng-if="request.searchFieldsLabelTypeMap[searchField].datatype === \'date\'"></slds-svg-icon>\n<span class="via-input-group-addon left" ng-if="request.searchFieldsLabelTypeMap[searchField].currencySymbol">{{request.searchFieldsLabelTypeMap[searchField].currencySymbol}}</span>\n<span class="via-input-group-addon right" ng-if="request.searchFieldsLabelTypeMap[searchField].datatype === \'percent\'">%</span>'),$templateCache.put("viaPane3.tpl.html",'\x3c!-- DEPRECATED AS OF v100 / Verification Pane with field verification checks and scratchpad --\x3e\n<div class="inner-pane-container">\n    <div class="slds-clearfix vloc-il-header-panel">\n        <div class="slds-text-heading--medium" ng-if="callerData.resultValueMap.Name">{{liLabels.InteractionLauncher_VerifyCaller}}: {{callerData.resultValueMap.Name}}</div>\n        <div class="slds-text-heading--medium" ng-if="callerData.resultValueMap[nameSpacePrefix + \'RelatedParty__c\']">{{liLabels.InteractionLauncher_VerifyCaller}}: {{callerData.resultValueMap[nameSpacePrefix + \'RelatedParty__c\']}}</div>\n        <div class="slds-text-heading--medium" ng-if="!callerData.resultValueMap.Name && !callerData.resultValueMap[nameSpacePrefix + \'RelatedParty__c\']">{{liLabels.InteractionLauncher_VerifyCaller}}</div>\n    </div>\n    <h3 ng-if="actionFramework.verificationActions.length" class="slds-section-title--divider via-result-actions slds-clearfix" fix-to-top="fix-to-top" scroll-element=".via-pane-3" top-sibling=".via-pane-3 .slds-text-heading--medium">\n        <span ng-if="actionFramework.verificationActions.length < 7">{{liLabels.InteractionLauncher_UnrelatedParty}}</span>\n        <div class="slds-button-group" ng-class="{\'slds-float--right\': actionFramework.verificationActions.length < 7}" role="group">\n            <button class="slds-button slds-button--icon-border via-result-action-btn via-result-action-{{$index}} via-result-action-pane-3-{{$index}}-{{action.displayName.toLowerCase().split(\' \').join(\'-\')}}" ng-click="actionFramework.invokeAction(action)" ng-repeat="action in actionFramework.verificationActions" slds-popover data-nubbin-direction="{{(actionFramework.verificationActions.length > 6) ? \'top-left\' : \'top-right\'}}" data-container=".via-result-action-pane-3-{{$index}}-{{action.displayName.toLowerCase().split(\' \').join(\'-\')}}" data-title="{{action.displayName}}" tooltip="true" ng-class="{\'overflow\': actionFramework.verificationActions.length > 6}">\n                <i class="icon {{action.vlocityIcon}} slds-button__icon" ng-if="action.vlocityIcon && !action.imageRef"></i>\n                <img class="slds-button__icon" ng-src="{{action.imageRef}}" ng-if="action.imageRef"/>\n                <span class="slds-assistive-text">{{action.displayName}}</span>\n            </button>\n        </div>\n    </h3>\n    <h3 ng-if="callerData.verificationFieldList.length" class="slds-section-title--divider" ng-bind-html="liLabels.InteractionLauncher_VerifyHeading"></h3>\n    <section ng-if="callerData.verificationFieldList.length" class="verification-section verification-section-verify" ng-repeat="vField in callerData.verificationFieldList" ng-class="{\'last-section\': $index === callerData.verificationFieldList.length - 1}">\n        <div class="field-data">\n            <label class="slds-text-heading--label section-item-label"><abbr class="slds-required" title="required" ng-class="{\'verified\': callerData.verificationResult.fields[vField]}">*</abbr>{{callerData.resultFieldsLabelTypeMap[vField].label}}</label>\n            <span class="section-item-value" ng-bind-html="callerData.resultValueMap[vField]"></span>\n        </div>\n        <div class="verification-buttons">\n            <button class="slds-button via-approve" ng-click="verifyField($event, true, vField)" ng-class="{\'active\': callerData.verificationResult.fields[vField] === true}">\n                <span class="slds-icon_container--circle slds-icon-standard-approval verification-icon" title="Approve Party Field">\n                    <slds-svg-icon sprite="\'action\'" icon="\'approval\'"></slds-svg-icon>\n                    <span class="slds-assistive-text">Approve Party Field</span>\n                </span>\n            </button>\n            <button class="slds-button via-reject" ng-click="verifyField($event, false, vField)" ng-class="{\'active\': callerData.verificationResult.fields[vField] === false}">\n                <span class="slds-icon_container--circle slds-icon-standard-approval verification-icon" title="Reject Party Field">\n                    <slds-svg-icon sprite="\'action\'" icon="\'reject\'"></slds-svg-icon>\n                    <span class="slds-assistive-text">Reject Party Field</span>\n                </span>\n            </button>\n        </div>\n    </section>\n    <h3 ng-if="callerData.optionalVerificationFieldList.length" class="slds-section-title--divider">{{liLabels.InteractionLauncher_OptionalVerifyHeading}} <span>({{liLabels.InteractionLauncher_MustVerify}} {{callerData.numOfOptionalVerificationFields}})</span></h3>\n    <section ng-if="callerData.optionalVerificationFieldList.length" class="verification-section verification-section-optional" ng-repeat="ovField in callerData.optionalVerificationFieldList" ng-class="{\'last-section\': $index === callerData.optionalVerificationFieldList.length - 1}">\n        <div class="field-data">\n            <label class="slds-text-heading--label section-item-label">{{callerData.resultFieldsLabelTypeMap[ovField].label}}</label>\n            <span class="section-item-value" ng-bind-html="callerData.resultValueMap[ovField]"></span>\n        </div>\n        <div class="verification-buttons">\n            <button class="slds-button via-approve" ng-click="verifyField($event, true, ovField)" ng-class="{\'active\': callerData.verificationResult.fields[ovField] === true}">\n                <span class="slds-icon_container--circle slds-icon-standard-approval verification-icon" title="Approve Party Field">\n                    <slds-svg-icon sprite="\'action\'" icon="\'approval\'"></slds-svg-icon>\n                    <span class="slds-assistive-text">Approve Party Field</span>\n                </span>\n            </button>\n            <button class="slds-button via-reject" ng-click="verifyField($event, false, ovField)" ng-class="{\'active\': callerData.verificationResult.fields[ovField] === false}">\n                <span class="slds-icon_container--circle slds-icon-standard-approval verification-icon" title="Reject Party Field">\n                    <slds-svg-icon sprite="\'action\'" icon="\'reject\'"></slds-svg-icon>\n                    <span class="slds-assistive-text">Reject Party Field</span>\n                </span>\n            </button>\n        </div>\n    </section>\n    <section class="notes-section" ng-show="showScratchPad">\n        <div class="slds-form-element">\n            <label class="slds-text-heading--label section-item-label" for="notes-textarea">Notes</label>\n            <div class="slds-form-element__control">\n                <textarea id="notes-textarea" class="slds-textarea" ng-model="callerData.verificationResult.note" placeholder="{{liLabels.InteractionLauncher_Scratchpad}}"></textarea>\n            </div>\n        </div>\n    </section>\n    <div class="request-form-footer" ng-class="{\'active\': viaPane === 3 && (actionFramework.actions.length || callerData.request.continueSearch)}">\n        <div class="slds-button-group" role="group">\n            <button class="slds-button slds-button--icon-border" ng-click="goBackOnePane()">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'back\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Back</span>\n            </button>\n            <button class="slds-button slds-button--icon-border" ng-click="startNewSearch()" ng-if="!eventDrivenNonOverride">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'redo\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Restart Search</span>\n            </button>\n        </div>\n        <button ng-if="!callerData.request.continueSearch" type="submit" class="slds-button slds-button--brand launch-console" ng-click="actionFramework.invokeAction()">\n            <slds-button-svg-icon sprite="\'utility\'" icon="\'tabset\'" extra-classes="\'slds-button__icon--left\'"></slds-button-svg-icon>\n            {{liLabels.InteractionLauncher_Launch}}\n        </button>\n        <button ng-if="callerData.request.continueSearch" type="submit" class="slds-button slds-button--brand launch-console" ng-click="getNextLookupRequests()">{{liLabels.InteractionLauncher_VerifyAndSearch}}</button>\n    </div>\n</div>\n'),$templateCache.put("viaPane4.tpl.html",'\x3c!-- DEPRECATED AS OF v100 / This screen shows up after caller has been verified. Won\'t ever be seen in console --\x3e\n<div class="inner-pane-container">\n    <div class="slds-text-heading--medium" ng-if="callerData.resultValueMap.Name">{{callerData.resultValueMap.Name}} Verified</div>\n    <div class="slds-text-heading--medium" ng-if="callerData.resultValueMap[nameSpacePrefix + \'RelatedParty__c\']">{{callerData.resultValueMap[nameSpacePrefix + \'RelatedParty__c\']}} Verified</div>\n    <div class="slds-text-heading--medium" ng-if="!callerData">Verified Caller</div>\n    <span class="slds-icon_container--circle slds-icon-standard-approval success-icon" title="The caller has been verified">\n        <slds-svg-icon sprite="\'action\'" icon="\'check\'"></slds-svg-icon>\n        <span class="slds-assistive-text">The caller has been verified</span>\n    </span>\n    <div class="slds-text-heading--small slds-text-align--center">The caller has been verified.</div>\n    <button type="submit" class="slds-button slds-button--brand start-new-search" ng-click="startNewSearch()">Start New Search</button>\n</div>\n'),$templateCache.put("viaPane0.tpl.html",'\x3c!-- DEPRECATED AS OF v100 / First Pane with search form --\x3e\n<div class="inner-pane-container">\n    <div role="alertdialog" tabindex="-1" aria-labelledby="prompt-heading-id" aria-describedby="prompt-message-wrapper" class="slds-modal slds-fade-in-open slds-modal--prompt" ng-if="eventDrivenMode.eventDriven">\n        <div class="slds-modal__container">\n            <div class="slds-modal__header slds-theme--warning slds-theme--alert-texture">\n                <h2 class="slds-text-heading--small" id="prompt-heading-id">Warning</h2>\n            </div>\n            <div class="slds-modal__content slds-p-around--medium">\n                <div>\n                    <p>{{eventDrivenMode.message}}</p>\n                </div>\n            </div>\n            <div class="slds-modal__footer slds-theme--default">\n                <button class="slds-button slds-button--neutral" ng-click="closeWidget()">{{liLabels.InteractionLauncher_OK}}</button>\n            </div>\n        </div>\n    </div>\n    <div class="slds-backdrop slds-backdrop--open" ng-if="eventDrivenMode.eventDriven"></div>\n    <form class="search-form" ng-submit="getSearchResult(lookupRequests, contextIds, callerData)" autocomplete="off" ng-if="!eventDrivenMode.eventDriven">\n        <div class="slds-form--horizontal lookup-request-form" ng-repeat="request in lookupRequests">\n            <h3 class="slds-section-title--divider section-header">{{request.searchObjectLabel}}</h3>\n            <div class="slds-form-element" ng-repeat="searchField in request.searchFieldList">\n                <label class="slds-form-element__label" for="{{searchField}}" ng-if="request.searchFieldsLabelTypeMap[searchField].datatype !== \'checkbox\'">{{request.searchFieldsLabelTypeMap[searchField].label}}</label>\n                <div class="slds-form-element__control {{request.searchFieldsLabelTypeMap[searchField].datatype}}" ng-include="\'LookupSearchForm.tpl.html\'"></div>\n            </div>\n        </div>\n        <div class="request-form-footer" ng-class="{\'active\': lookupRequests.length && viaPane === 0}">\n            <div class="slds-button-group" role="group" ng-if="!eventDrivenNonOverride">\n                <button type="button" class="slds-button slds-button--icon-border" ng-click="startNewSearch()">\n                    <slds-button-svg-icon sprite="\'utility\'" icon="\'redo\'"></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Restart Search</span>\n                </button>\n            </div>\n            <button type="submit" class="slds-button slds-button--brand">{{liLabels.InteractionLauncher_Search}}</button>\n        </div>\n    </form>\n</div>\n'),$templateCache.put("viaPane6.tpl.html",'\x3c!-- DEPRECATED AS OF v100 / Search Results after second search --\x3e\n<div class="inner-pane-container">\n    <div class="slds-clearfix vloc-il-header-panel">\n        <div class="slds-text-heading--medium slds-float--left">{{liLabels.InteractionLauncher_SearchResult}}</div>\n        <p class="slds-float--right">Showing {{searchResult.length}} Results</p>\n    </div>\n    <h3 ng-if="actionFramework.resultActions.length" class="slds-section-title--divider via-result-actions slds-clearfix" fix-to-top="fix-to-top" scroll-element=".via-pane-6" top-sibling=".via-pane-6 .vloc-il-header-panel">\n        <span ng-if="actionFramework.resultActions.length < 7">{{liLabels.InteractionLauncher_UnrelatedParty}}</span>\n        <div class="slds-button-group" ng-class="{\'slds-float--right\': actionFramework.resultActions.length < 7}" role="group">\n            <button class="slds-button slds-button--icon-border via-result-action-btn via-result-action-{{$index}} via-result-action-pane-6-{{$index}}-{{action.displayName.toLowerCase().split(\' \').join(\'-\')}}" ng-click="actionFramework.invokeAction(action)" ng-repeat="action in actionFramework.resultActions" slds-popover data-nubbin-direction="{{(actionFramework.resultActions.length > 6) ? \'top-left\' : \'top-right\'}}" data-container=".via-result-action-pane-6-{{$index}}-{{action.displayName.toLowerCase().split(\' \').join(\'-\')}}" data-title="{{action.displayName}}" tooltip="true" ng-class="{\'overflow\': actionFramework.resultActions.length > 6}">\n                <i class="icon {{action.vlocityIcon}} slds-button__icon" ng-if="action.vlocityIcon && !action.imageRef"></i>\n                <img class="slds-button__icon" ng-src="{{action.imageRef}}" ng-if="action.imageRef"/>\n                <span class="slds-assistive-text">{{action.displayName}}</span>\n            </button>\n        </div>\n    </h3>\n    <div class="slds-notify_container no-search-results" ng-if="!searchResult.length && searchResultMessage">\n        <div class="slds-notify slds-notify--alert slds-theme--{{searchResultMessage.type}}" role="alert">\n            <span class="slds-assistive-text">Info</span>\n            <h2>{{searchResultMessage.value}} <a href="javascript:void(0)" ng-click="goBackOnePane()">Restart Search</a></h2>\n        </div>\n    </div>\n    <section class="search-result-section" ng-repeat="result in searchResult" ng-if="!searchResult[searchResult.length - 1].message">\n        <div ng-repeat="field in result.resultFieldList" class="search-result-field {{formatLabelAsClass(result.resultFieldsLabelTypeMap[field].label)}}">\n            <label ng-if="result.resultFieldsLabelTypeMap[field] && result.resultFieldsLabelTypeMap[field].label && field.indexOf(\'Name\') < 0 && field.toLowerCase().indexOf(\'address\') < 0">{{result.resultFieldsLabelTypeMap[field].label}}: </label>\n            <span class="search-result-field-value" ng-bind-html="result.resultValueMap[field]"></span>\n        </div>\n        <button class="slds-button slds-button--neutral" ng-click="actionFramework.invokeAction(undefined, result)">\n            <slds-button-svg-icon sprite="\'utility\'" icon="\'tabset\'" extra-classes="\'slds-button__icon--left\'"></slds-button-svg-icon>\n            View\n        </button>\n    </section>\n    <div class="pagination-buttons-container" ng-class="{\'active\': ((previousResults.length && (lastResultIndex > resultsPerPage)) || hasMoreResults) && viaPane === 6}">\n        <div class="slds-button-group pagination-buttons" role="group">\n            <button class="slds-button slds-button--neutral pagination-button pagination-previous" ng-click="getSearchResult(searchSection, contextIds, callerData, true);" ng-if="previousResults.length && (lastResultIndex > resultsPerPage)">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'back\'" extra-classes="\'slds-icon-text-default\'"></slds-button-svg-icon>\n                <span>Previous Results</span>\n            </button>   \n            <button class="slds-button slds-button--neutral pagination-button pagination-next" ng-click="getSearchResult(searchSection, contextIds, callerData, false); iconRotate = !iconRotate" ng-if="hasMoreResults" ng-class="{\'rotate\': iconRotate}">\n                <span>More Results</span>\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'sync\'" extra-classes="\'slds-icon-text-default\'"></slds-button-svg-icon>\n            </button>\n        </div>\n    </div>\n    <div class="request-form-footer" ng-class="{\'active\': (searchResult.length || searchResultMessage) && viaPane === 6}">\n        <div class="slds-button-group" role="group">\n            <button class="slds-button slds-button--icon-border" ng-click="goBackOnePane()">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'back\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Back</span>\n            </button>\n            <button class="slds-button slds-button--icon-border" ng-click="startNewSearch()" ng-if="!eventDrivenNonOverride">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'redo\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Restart Search</span>\n            </button>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("SldsDatepicker.tpl.html",'<div class="slds-datepicker slds-dropdown slds-dropdown--right" aria-hidden="false" ng-class="\'datepicker-mode-\' + $mode">\n    <div class="slds-datepicker__filter slds-grid">\n        <div class="slds-datepicker__filter--month slds-grid slds-grid--align-spread slds-grow">\n            <div class="slds-align-middle">\n                <button type="button" class="slds-button slds-button--icon-container" ng-click="$selectPane(-1)">\n                    <slds-button-svg-icon sprite="\'utility\'" icon="\'left\'" size="\'small\'"></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Previous Month</span>\n                </button>\n            </div>\n            <button type="button" class="slds-button slds-button--neutral slds-align-middle" ng-click="$toggleMode()" aria-live="assertive" aria-atomic="true"><span ng-bind="title"></span></button>\n            <div class="slds-align-middle">\n                <button type="button" class="slds-button slds-button--icon-container" ng-click="$selectPane(+1)">\n                    <slds-button-svg-icon sprite="\'utility\'" icon="\'right\'" size="\'small\'"></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Next Month</span>\n                </button>\n            </div>\n        </div>\n    </div>\n    <table class="datepicker__month" role="grid" aria-labelledby="month">\n        <thead>\n            <tr id="weekdays" ng-if="showLabels" ng-bind-html="labels"></tr>\n        </thead>\n        <tbody>\n            <tr ng-repeat="(i, row) in rows">\n                <td ng-repeat="(j, el) in row" role="gridcell" aria-selected="{\'true\': el.selected, \'false\': !el.selected}" ng-class="{\'slds-is-today\': el.isToday && !el.selected, \'slds-is-selected\': el.selected}">\n                    <span class="slds-day" ng-class="{\'text-muted\': el.muted}" ng-bind="el.label" ng-click="$select(el.date)" ng-disabled="el.disabled"></span>\n                </td>\n            </tr>\n            <tr ng-if="$hasToday">\n                <td colspan="7" role="gridcell"><a href="javascript:void(0);" class="slds-show--inline-block slds-p-bottom--x-small" ng-click="$setToday()">Today</a></td>\n            </tr>\n        </tbody>\n    </table>\n</div>\n')}]);

},{}]},{},[1]);
})();

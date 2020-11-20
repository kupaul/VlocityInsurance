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
var manualQueueApp = angular.module('manualQueueApp',['vlocity', 'ngSanitize']);
var displayedFields="State__c, TimestampReady__c, Account__c, OrderFulfilmentRequest__c, AssignedToUserId__c";
manualQueueApp.config(function(remoteActionsProvider) {
    remoteActionsProvider.setRemoteActions(remoteActions);
});
manualQueueApp.value('queueDetails' , {
                  manualQueueId : manualQueueId,
                  userId : "",
                  displayedFields : displayedFields,
                  title : ""
});
angular.module('manualQueueApp')
.directive('infiniteScroll', function() {
       return function(scope, elm, attr) {
            var raw = elm[0];
            elm.bind('scroll', function() {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.infiniteScroll);
            }
        });
};
});
require('./modules/manualqueueview/directive/progressBarDirective.js');
require('./modules/manualqueueview/controller/manualQueueController.js');
},{"./modules/manualqueueview/controller/manualQueueController.js":2,"./modules/manualqueueview/directive/progressBarDirective.js":3}],2:[function(require,module,exports){
angular.module('manualQueueApp').controller('manualQueueController', function($scope, remoteActions, queueDetails, $interval, $filter, $sce) {
                /*
                 * scope Variables
                 */
                $scope.columnNameMap;
                $scope.items = [];
                $scope.selectAllCheck = false;
                $scope.fieldsToDisplay = [];
                $scope.fieldsToSort = {};
                $scope.filterFieldsMetadata;
                $scope.isFilterPanelVisible = true;
                $scope.isFilterPanelVisible = false;
                $scope.showProgressModal = false;
                $scope.totalBatch = 0;
                $scope.completedBatch = 0;
                $scope.action = '';
                $scope.manualQueueName = '';
                $scope.underProcessCheck = false;
                $scope.filterBoxCheck = false;
                $scope.showSpinner = true;
                $scope.notification = {};
                $scope.notification.successMessage = '';
                $scope.notification.errorMessage = '';
                $scope.showAssignmentModal = false;
                $scope.isSearchDropDownActive = false;
                $scope.selectedObject = '';
                $scope.assignmentModalList = [];
                $scope.search = {};
                $scope.search.searchTerm = '';
                $scope.searchMode = false;
                $scope.assignmentModalHeader = '';
                $scope.userAssignmentList = [];
                $scope.isLoading = false;
                $scope.isApplyAll = false;
                $scope.numberOfItemsToProcess = 0;
                $scope.extraActionsArray = [ {'label' : 'Apply to all items' , 'action' : 'applyAll'}, 
                                             {'label' : 'Apply to first records', 'action' : 'applyFirst'} ]
                $scope.actionArray = [ {'label' : 'Retry' , 'extraActions' : true, 'action' : 'retry', 'extraActionsOpenCheck' : false},
                                       {'label' : 'Complete' , 'extraActions' : true, 'action' : 'complete', 'extraActionsOpenCheck' : false},
                                       {'label' : 'Assign To Me' , 'extraActions' : false, 'action' : 'assignToMe', 'extraActionsOpenCheck' : false},
                                       {'label' : 'Clear User Assignment', 'extraActions' : false, 'action' : 'clearAssignment', 'extraActionsOpenCheck' : false},
                                       {'label' : 'Assign To User', 'extraActions' : false, 'action' : 'assignToUser', 'extraActionsOpenCheck' : false},
                                       {'label' : 'Assign To Queue', 'extraActions' : false, 'action' : 'assignToQueue', 'extraActionsOpenCheck' : false}];
                          
                /*
                 * scope Variables end
                 */   
                 
                /*
                 * Variables start
                 */
                var isAllLoaded = false;
                var lastBatchLoadedLength = 0;
                var offSet = 0;
                var nextBatch = 30;
                var limit = nextBatch;
                var batchsize = 100;
                var utilityObject = new UtilityMethods();
                var deepCheckFlag = false;
                var nsPrefix = '';
                var regEx = '';
                var idList = {};
                const SORT_ASC = 'asc';
                const SORT_DESC = 'desc';
                var additionalFilterReferenced = null;
                var additionalFilter = null;
                var sortBy = '';
                var timeZoneOffset = '';
                
                /*
                 * Variables end
                 */
                
                $scope.sortManualQueue = function(key){
                    if ($scope.columnNameMap[key]['type'] !== 'TEXTAREA'){
                      $scope.showSpinner = true;
                      if ($scope.fieldsToSort[key] === ''){
                          $scope.fieldsToSort[key] = SORT_ASC;
                      } else if ($scope.fieldsToSort[key] === SORT_ASC) {
                          $scope.fieldsToSort[key] = SORT_DESC;
                      } else if ($scope.fieldsToSort[key] === SORT_DESC) {
                          $scope.fieldsToSort[key] = '';
                      }
                      sortBy = '';
                      for (let i=0; i<$scope.fieldsToDisplay.length; i++) {
                        if ($scope.fieldsToSort[$scope.fieldsToDisplay[i]] !== '') {
                          if (deepCheckFlag || ($scope.columnNameMap[$scope.fieldsToDisplay[i]]['type'] === 'ID' 
                                  &&  $scope.columnNameMap[$scope.fieldsToDisplay[i]]['field'] === 'name'))
                              sortBy = sortBy+' '+$scope.columnNameMap[$scope.fieldsToDisplay[i]]['field']+' '+$scope.fieldsToSort[$scope.fieldsToDisplay[i]]+ ' NULLS LAST ' 
                                    +','+$scope.fieldsToDisplay[i]+' '+$scope.fieldsToSort[$scope.fieldsToDisplay[i]]+',';
                          else 
                              sortBy = sortBy+' '+$scope.fieldsToDisplay[i]+' '+$scope.fieldsToSort[$scope.fieldsToDisplay[i]]+' NULLS LAST '+',';
                        }
                      }
                      sortBy = sortBy.substring(0, sortBy.length - 1);
                      console.log(sortBy);
                      resetView();
                    } else {
                      console.log(key+' is of type TEXTAREA which can not be sorted');
                    }
                }
                
                $scope.getSuggestedValues = function(attribute) {
                  if ((attribute.type === 'REFERENCE' || attribute.type === 'ID') && !idList[attribute['field']] && !deepCheckFlag) {
                    remoteActions.getSuggestedValues(attribute['field'], queueDetails.manualQueueId).then(
                      function(successResponse) {
                        var itemsList = successResponse.map(utilityObject.flattenObject);
                        idList[attribute['field']] = itemsList.map(item => item[attribute['field']]).filter(id => id);
                        console.log('idList');
                        console.log(idList);
                      },
                      function(errorResponse) {
                        $scope.notification.errorMessage ='Something went wrong : '+errorResponse.message;
                        console.log('errorResponse');
                        console.log(errorResponse);
                      }
                    )
                  }
                }
                $scope.selectAll = function() {
                  console.log('selectall called '+$scope.selectAllCheck);
                  if ($scope.selectAllCheck) {
                    $scope.items = $scope.items.map((item) => { 
                              item.selected = true;
                              return item;
                            });
                  } else {
                    $scope.items = $scope.items.map((item) => { 
                              item.selected = false;
                              return item;        
                            });
                  }
                  console.log($scope.items);
                }
                
                $scope.setStatus = function() {
                  var selectedItemsId = $scope.items.map((item) => {  
                              if (item.selected)
                              return item['id'];        
                          });
                }
                
                $scope.takeAction = function(action, extraAction) {
                  $scope.action = action;
                  if (action === 'retry') {
                    retry(extraAction);
                  } else if (action === 'complete') {
                    complete(extraAction);
                  } else if (action === 'assignToMe') {
                    assignTo('currentUser');
                  } else if (action === 'clearAssignment') {
                	assignTo(null);
                  } else if (action === 'assignToUser') {
                	assignToUserModal();
                  } else if (action === 'assignToQueue') {
                	assignToQueueModal();
                  }
                }
                
                $scope.closeExtraActionsMenu = function(action) {
                  $interval(function() { // closing after 100ms to allow the onClick event to happen on the menu item
                      action['extraActionsOpenCheck'] = false;
                  }, 300, 1);
              }
              
              $scope.onSearchButtonPress = function() {
                $scope.showSpinner = true;
                additionalFilterReferenced = {};
                additionalFilter = {};
                var keys = Object.keys($scope.filterFieldsMetadata);
                for (let i=0; i<keys.length; i++) {
                  let fieldMetaData = $scope.filterFieldsMetadata[keys[i]];
                  if (fieldMetaData['value'] && (fieldMetaData['type'] === 'REFERENCE' || fieldMetaData['type'] === 'ID') && !deepCheckFlag) {
                    additionalFilterReferenced[keys[i]] = idList[keys[i]].filter(id => id.includes(fieldMetaData['value']));
                  } else if (fieldMetaData['value']) {
                    additionalFilter[fieldMetaData['field']] = fieldMetaData['value'];
                  }
                }
                console.log('additionalFilterReferenced');
                console.log(additionalFilterReferenced);
                console.log('additionalFilter');
                console.log(additionalFilter);
                resetView();
              }
              $scope.closeProgressModal = function() {
                $scope.showSpinner = true;
                $scope.totalBatch = 0;
                $scope.completedBatch = 0;
                $scope.showProgressModal = false;
                resetView();
              }
              $scope.closeAssignmentModal = function() {
                  $scope.showAssignmentModal = false;
              }
              $scope.clearError = function() {
                $scope.notification.errorMessage = '';
              }
              $scope.clearSuccess = function() {
                $scope.notification.successMessage = '';
              }
              $scope.onResetButtonPress = function() {
                $scope.showSpinner = true;
                Object.keys($scope.filterFieldsMetadata).forEach(utilityObject.addExtraKey);
                additionalFilter = null;
                additionalFilterReferenced = null;
                resetView();
              }
              $scope.getNextItems = function(){
                if(!$scope.isLoading && !isAllLoaded){
                  $scope.isLoading = true;
                  console.log('getNextItems called');
                  offSet = offSet + nextBatch;
                  limit = nextBatch;
                  getItems(sortBy, additionalFilter, additionalFilterReferenced);
                }
              }
              
              $scope.showSearchDropDown = function() {
                $scope.isSearchDropDownActive = true;
              }
              $scope.hideSearchDropDown = function() {
                $interval(function() { // closing after 100ms to allow the onClick event to happen on the menu item
                    $scope.isSearchDropDownActive = false;
                    $scope.searchMode = false;
                }, 300, 1);
              }
              
              $scope.modelSelected = function(model) {
                  $scope.search.searchTerm = model.Name;
                  $scope.selectedObject = model;
              } 
              $scope.enterSearchMode = function() {
                $scope.searchMode = true;
              }
              $scope.removeObject = function() {
                $scope.search.searchTerm = '';
                $scope.selectedObject = {};
              }
              $scope.onSearchQueryChange = function() {
                $scope.assignmentModalList = $filter('filter')($scope.userAssignmentList, {Name : $scope.search.searchTerm}).slice(0, 5);
              }
              $scope.assigned = function() {
                if($scope.selectedObject.Id){
                    if($scope.action === 'assignToUser'){
                        assignTo($scope.selectedObject.Id);
                    } else if ($scope.action === 'assignToQueue') {
                        console.log('assign to manual queue '+$scope.selectedObject);
                        assignToQueue($scope.selectedObject.Id);
                    }
                    $scope.search.searchTerm = '';
                    $scope.selectedObject = {};
                    $scope.closeAssignmentModal();
                }
                else {
                  $scope.notification.errorMessage ='Please select from dropdown';
                }
              }
              
              $scope.$watch('selectAllCheck', function(){
                 $scope.selectAll();
              })
              
              $scope.deliberatelyTrustDangerousSnippet = function(snippet) {
               return $sce.trustAsHtml(snippet);
              };
              
              $scope.startAction = function(action, numberOfItemsToProcess) {
            	  numberOfItemsToProcess = numberOfItemsToProcess || 0;
            	  var itemsToUpdate = $scope.items.slice(0, numberOfItemsToProcess).map((item) => {return item['id'];});
            	  if (action === 'retry'){
            	  	retrySupportingMethod(itemsToUpdate);
            	  } else if (action === 'complete') {
            		completeSupportingMethod(itemsToUpdate);
            	  }
            	  
              }
              
              $scope.convertDateToReadableForm = function(dates){
            	  let convertingTimeZone = dates + new Date().getTimezoneOffset()*60000 + timeZoneOffset;
            	  let calculatedDate = new Date(convertingTimeZone);
            	  let formattedDate = dates;
            	  let options = {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'};
            	  if(calculatedDate instanceof Date && !isNaN(calculatedDate)){
            		formattedDate = new Intl.DateTimeFormat('en-US', options).format(calculatedDate);
            	  }
            	  return formattedDate;
              }
              
	        function UtilityMethods() {
	          this.flattenObject = (obj, prefix = '') =>
	            Object.keys(obj).reduce((acc, k) => {
	            let pre = prefix.length ? prefix + '.' : '';
	            if (typeof obj[k] === 'object') 
	              Object.assign(acc, this.flattenObject(obj[k], pre + k));
	            else 
	              acc[(pre + k).replace(regEx,'').toLowerCase()] = obj[k];
	            acc.selected = false;
	            return acc;
	          }, {})
	    //this.updateSelectedCheck = ()
	          this.addExtraKey = (key) => $scope.filterFieldsMetadata[key]['value'] = '';
	        }
          
          function getItems(sortBy, additionalFilter, additionalFilterReferenced) {
            console.log('making remote call');
            remoteActions.getItems(queueDetails.manualQueueId, queueDetails.userId, sortBy, additionalFilter, additionalFilterReferenced, deepCheckFlag, queueDetails.displayedFields, offSet, limit).then(
              function(response) {
                let items = [];
                timeZoneOffset = response['timeZone'];
                nsPrefix = response['nsPrefix'];
                regEx = new RegExp(nsPrefix, 'g');
                $scope.fieldsToDisplay = response['fieldsToDisplay'];
                $scope.manualQueueName = response['manualQueueName'];
                for (let i=0; i<$scope.fieldsToDisplay.length; i++) {
                  if ($scope.fieldsToSort[$scope.fieldsToDisplay[i]]) {
                    $scope.fieldsToSort[$scope.fieldsToDisplay[i]] = $scope.fieldsToSort[$scope.fieldsToDisplay[i]];
                  } else {
                    $scope.fieldsToSort[$scope.fieldsToDisplay[i]] = ''
                  }
                }
                items = response['items'];
                if($scope.items.length === 0){
                	$scope.items = items.map(utilityObject.flattenObject);
                } else {
                	$scope.items = $scope.items.concat(items.map(utilityObject.flattenObject));
                }
                $scope.columnNameMap = response['displayMap'];
                if (!$scope.filterFieldsMetadata) {
                  $scope.filterFieldsMetadata = response['filterFieldsMetaData'];
                  Object.keys($scope.filterFieldsMetadata).forEach(utilityObject.addExtraKey);
                  $scope.filterBoxCheck = Object.keys($scope.filterFieldsMetadata).length > 0;
                }
                
                if(items.length === 0){
                	isAllLoaded = true;
                	offSet = offSet - lastBatchLoadedLength;
                } else {
                	lastBatchLoadedLength = items.length;
                }
                deepCheckFlag = response['deepCheckFlag'];
                $scope.showSpinner = false;
                $scope.isLoading = false;
                $scope.selectAll();
                console.log('------------------------LOGS getItems------------------------------');
                console.log('ManualQueueName');
                console.log(response['manualQueueName']);
                console.log('fieldsToDisplay');
                console.log(response['fieldsToDisplay']);
                console.log('$scope.fieldsToSort');
                console.log($scope.fieldsToSort);
                console.log('$scope.items');
                console.log($scope.items);
                console.log('displayMap');
                console.log(response['displayMap']);
                console.log('filterFieldsMetadata');
                console.log(response['filterFieldsMetaData']);
                console.log('------------------------LOGS getItems End------------------------------');
                
              },             
              function(error) {
                $scope.notification.errorMessage ='Something went wrong : '+error.message;
                console.log(error);
              }
          )
        }
        
        function resetView(){
            $scope.items = [];
            offSet = 0;
            limit = nextBatch;
            isAllLoaded = false;
            $scope.isLoading = false;
            $scope.selectAllCheck = false;
            getItems(sortBy, additionalFilter, additionalFilterReferenced);
        }
        function assignToUserModal() {
          $scope.showAssignmentModal = true;
          $scope.assignmentModalList = [];
          $scope.searchTerm = '';
          $scope.assignmentModalHeader = 'Select User for Task';
          remoteActions.getActiveUsers().then(function(response){
            $scope.assignmentModalList = response.slice(0, 5);
            $scope.userAssignmentList = response;
          },
          function(errorResponse) {
              $scope.notification.errorMessage ='Something went wrong : '+errorResponse.message;
              console.log('errorResponse');
              console.log(errorResponse);
          });
        }
          
          function assignToQueueModal() {
            $scope.showAssignmentModal = true;
            $scope.assignmentModalList = [];
              $scope.searchTerm = '';
              $scope.assignmentModalHeader = 'Select Queue for Task';
              remoteActions.getActiveQueueMethod().then(function(response){
                $scope.assignmentModalList = response.slice(0, 5);
                $scope.userAssignmentList = response;
              },
              function(errorResponse) {
                  $scope.notification.errorMessage ='Something went wrong : '+errorResponse.message;
                  console.log('errorResponse');
                  console.log(errorResponse);
              })
          }
          function retry(extraAction) {
            var itemsToUpdate;
            if (extraAction && extraAction === 'applyAll') {
              $scope.showProgressModal = true;
              $scope.isApplyAll = true;
              itemsToUpdate = returnItemId('all');
              retrySupportingMethod(itemsToUpdate);
            } else if (extraAction && extraAction === 'applyFirst') {
              $scope.showProgressModal = true;
              $scope.isApplyAll = false;
            } else {
              itemsToUpdate = returnItemId('selected');
              $scope.isApplyAll = false;
              retrySupportingMethod(itemsToUpdate);
            }
            
            
          }
          
          function retrySupportingMethod(itemsToUpdate) {
        	  if (itemsToUpdate.length === 0) {
                  $scope.notification.errorMessage ='Please select atleast one item';
                  return;
                }
                
                
                if (!$scope.showProgressModal) {
                  $scope.showSpinner = true;
                  remoteActions.retryItems(itemsToUpdate).then(function(response) {
                    console.log(response);
                    if (response['failSize'] && response['failSize'] > 0) {
                      $scope.notification.errorMessage = 'Ready Orchestration Items cannot be switched to ready.';
                    } else if (response['successSize'] && response['successSize'] > 0) {
                      $scope.notification.successMessage = 'Item(s) successfully retried';
                    }
                    resetView();
                  }, function(errorResponse) {
                    $scope.notification.errorMessage ='Something went wrong : '+errorResponse.message;
                  })
                } else {
                  $scope.totalBatch = itemsToUpdate.length;
                  batchOperation('retryItems', itemsToUpdate, 0, batchsize, 0, 0);
                }
          }
          
          function complete(extraAction) {
            var itemsToUpdate;
            if (extraAction && extraAction === 'applyAll') {
              $scope.showProgressModal = true;
              $scope.isApplyAll = true;
              itemsToUpdate = returnItemId('all');
              completeSupportingMethod(itemsToUpdate)
            } else if (extraAction && extraAction === 'applyFirst') {
              $scope.showProgressModal = true;
              $scope.isApplyAll = false;
            } else {
              itemsToUpdate = returnItemId('selected');
              completeSupportingMethod(itemsToUpdate)
            }
          }
          
          function completeSupportingMethod(itemsToUpdate) {
        	  if (itemsToUpdate.length === 0) {
                  $scope.notification.errorMessage ='Please select atleast one item';
                  return;
                }
                
                if (!$scope.showProgressModal) {
                  $scope.showSpinner = true;
                  remoteActions.completeItems(itemsToUpdate).then(function(response) {
                    console.log(response);
                    if (response['successSize'] && response['successSize'] > 0) {
                      $scope.notification.successMessage = 'Item(s) successfully completed';
                    }
                    resetView();
                  }, function(errorResponse) {
                    $scope.notification.errorMessage ='Something went wrong : '+errorResponse.message;
                  })
                } else {
                  $scope.totalBatch = itemsToUpdate.length;
                  batchOperation('completeItems', itemsToUpdate, 0, batchsize, 0, 0);
                }
          }
          function batchOperation(action, itemsToUpdate, start, batchSize, successSize, failedSize) {
            $scope.underProcessCheck = true;
            var newItemsToUpdate;
            var end;
            if (start === itemsToUpdate.length) {
              $scope.underProcessCheck = false;
              if (failedSize > 0) {
                $scope.notification.errorMessage = action.replace('Items', '')+' operation for '+failedSize+' items can not be completed';
              } else if (successSize > 0) {
                $scope.notification.successMessage = action.replace('Items', '')+' operation for '+successSize+' items successfully completed';
              }
              return;
            } 
            end = start + batchSize > itemsToUpdate.length ? itemsToUpdate.length : start + batchSize;
            
            newItemsToUpdate = itemsToUpdate.slice(start, end);
            remoteActions[action](newItemsToUpdate).then(function(response) {
                console.log(response);
                $scope.completedBatch = end;
                if (response['failSize'] && response['failSize'] > 0) {
                  //$scope.notification.errorMessage = 'Ready Orchestration Items cannot be switched to ready.';
                  failedSize = failedSize + response['failSize'];
                }
                if (response['successSize'] && response['successSize'] > 0) {
                  //$scope.notification.successMessage = 'Item(s) successfully retried';
                  successSize = successSize + response['successSize'];
                }
                batchOperation(action, itemsToUpdate, end, batchSize, successSize, failedSize)
              }, function(errorResponse) {
                $scope.notification.errorMessage ='Something went wrong : '+errorResponse.message;
              })
          }
          
          function assignTo(assignToString) {
            var itemsToUpdate = returnItemId('selected');
            console.log('itemsToUpdate');
            console.log(itemsToUpdate);
            if (itemsToUpdate.length === 0) {
              $scope.notification.errorMessage ='Please select atleast one item';
              return;
            }
            $scope.showSpinner = true;
            remoteActions.pickUpItems(itemsToUpdate, assignToString).then(function(response) {
                console.log(response);
                if (response['successSize'] && response['successSize'] > 0 && assignToString !== null) {
                  $scope.notification.successMessage = 'Item(s) successfully assigned';
                } else if (response['successSize'] && response['successSize'] > 0 && assignToString === null) {
                	$scope.notification.successMessage = 'Item(s) successfully unassigned';
                }
                resetView();
              }, function(errorResponse) {
                  $scope.notification.errorMessage ='Something went wrong : '+errorResponse.message;
              })
          }
          function assignToQueue(queueId){
              var itemsToUpdate = returnItemId('selected');
              console.log('itemsToUpdate');
              console.log(itemsToUpdate);
              if (itemsToUpdate.length === 0) {
                $scope.notification.errorMessage ='Please select atleast one item';
                return;
              }
              $scope.showSpinner = true;
              remoteActions.assignQueue(itemsToUpdate, queueId).then(function(response) {
                  console.log(response);
                  if (response['successSize'] && response['successSize'] > 0) {
                    $scope.notification.successMessage = 'Item(s) successfully assigned to queue';
                  }
                  resetView();
               },
               function(errorResponse) {
                   $scope.notification.errorMessage ='Something went wrong : '+errorResponse.message;
                   console.log('errorResponse');
                   console.log(errorResponse);
                })
                    
          }
          //Convert these methods in one method
          
          function returnItemId(type) {
            if (type === 'selected') {
              return $scope.items.filter((item) => item.selected).map(item => item['id']);
            } else if (type === 'all') {
              return $scope.items.map((item) => {return item['id'];});
            } else if (type === 'first') {
              return [$scope.items[0]['id']];
            }
            
          }
          /*
                 * Utility Method end
                 */
                   
              getItems('', null, null);   
              
})
},{}],3:[function(require,module,exports){
angular.module('manualQueueApp').directive('progressBar', [function () {
              return {
                    restrict: 'E',
                    scope: {
                      curVal: '@',
                      maxVal: '@'
                    },
                    template: "<div class='slds-progress-bar'>"+
                            "<div class='slds-progress-bar__value'></div>"+
                          "</div>",    

                    link: function ($scope, element, attrs) {
                      function updateProgress() {
                        var progress = 0;
                          if ($scope.maxVal) {
                              progress = Math.min($scope.curVal, $scope.maxVal) / $scope.maxVal * element.find('.slds-progress-bar').width();
                          }
                          element.find('.slds-progress-bar__value').css('width', progress);          
                      }
                      $scope.$watch('curVal', updateProgress);
                      $scope.$watch('maxVal', updateProgress);        
                    }
              };  
          }]);
},{}]},{},[1]);
})();

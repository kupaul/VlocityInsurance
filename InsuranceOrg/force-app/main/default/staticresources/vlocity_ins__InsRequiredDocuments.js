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
angular.module('insDirectives', ['sldsangular']);

// Directives
require('./modules/insDirectives/directive/InsDropdownHandler.js');
require('./modules/insDirectives/directive/InsInclude.js');
},{"./modules/insDirectives/directive/InsDropdownHandler.js":3,"./modules/insDirectives/directive/InsInclude.js":4}],2:[function(require,module,exports){
var insRequiredDocuments = angular.module('insRequiredDocuments', ['vlocity', 'CardFramework', 'sldsangular', 'forceng',
'ngSanitize', 'cfp.hotkeys', 'insDirectives', 'VlocityDynamicForm'])
.config(['remoteActionsProvider', function(remoteActionsProvider) {
    'use strict';
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}]).config(['$compileProvider', function ($compileProvider) {
    'use strict';
    $compileProvider.debugInfoEnabled(true);
}]).config(['$sldsDatePickerProvider', function($sldsDatePickerProvider) {
    angular.extend($sldsDatePickerProvider.defaults, {
        timezone: 'UTC'
    });
}]).config(['$sldsTimePickerProvider', function($sldsTimePickerProvider) {
    angular.extend($sldsTimePickerProvider.defaults, {
        timeType: 'iso'
    });
}]).run(['$rootScope', function($rootScope) {
    'use strict';
    $rootScope.nsPrefix = fileNsPrefix();
    $rootScope.isLoaded = false;
    $rootScope.vdfInputTypeMap = {
        date: 'date',
        datetime: 'datetime',
        string: 'text',
        boolean: 'checkbox',
        picklist: 'dropdown'
    };
}]).run(['$rootScope', '$injector', function($rootScope, userProfileService, dataService) {
    'use strict';
    // Custom Label Management
    var labelNames = [];
    if (labelNames.length) {
        userProfileService.userInfoPromise().then(function() {
            dataService.fetchCustomLabels(labelNames, $rootScope.vlocity.userLanguage);
        }, function(error) {
            $log.error('User info promise error', error);
        });
    }
}]);;

// Dependencies
require('./InsDirectives.js');

// Controllers
require('./modules/insRequiredDocuments/controller/InsRequiredDocumentsCtrl.js');

// Factory
require('./modules/insRequiredDocuments/factory/InsRequiredDocumentsService.js');
require('./modules/insRequiredDocuments/factory/InsRequiredDocumentsNotificationService.js');

// Directives
require('./modules/insRequiredDocuments/directive/InsStopPropagation.js');
require('./modules/insRequiredDocuments/directive/InsRequiredDocumentsCollapseHeight.js');
require('./modules/insRequiredDocuments/directive/InsDropzone.js');

// Templates
require('./modules/insRequiredDocuments/templates/templates.js');
},{"./InsDirectives.js":1,"./modules/insRequiredDocuments/controller/InsRequiredDocumentsCtrl.js":5,"./modules/insRequiredDocuments/directive/InsDropzone.js":6,"./modules/insRequiredDocuments/directive/InsRequiredDocumentsCollapseHeight.js":7,"./modules/insRequiredDocuments/directive/InsStopPropagation.js":8,"./modules/insRequiredDocuments/factory/InsRequiredDocumentsNotificationService.js":9,"./modules/insRequiredDocuments/factory/InsRequiredDocumentsService.js":10,"./modules/insRequiredDocuments/templates/templates.js":11}],3:[function(require,module,exports){
angular.module('insDirectives').directive('insDropdownHandler', function($document) {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var focused = false;
            var initial = false;
            var elementEvents = attrs.useFocus === 'true' || attrs.useFocus === undefined ? 'click focus' : 'click';
            var onClick = function (event) {
                var isChild = element.has(event.target).length > 0;
                var isSelf = element[0] == event.target;
                var isInside = isChild || isSelf;
                var className = event.target.className;
                if (event.target.parentElement) {
                    className = className + ' ' + event.target.parentElement.className;
                }
                if (initial) {
                    initial = false;
                    return;
                }
                if (event.target.nodeName === 'path') {
                    className = event.target.parentElement.parentElement.className;
                } else if (event.target.nodeName === 'svg') {
                    className = event.target.parentElement.className;
                }
                if ((!isInside && className.indexOf(attrs.restrictElement) < 0) || (isInside && className.indexOf(attrs.restrictElement) < 0 && !attrs.hasOwnProperty('ngClick'))) {
                    scope.$apply(attrs.insDropdownHandler);
                    $document.off('click', onClick);
                    focused = false;
                }
            };
            element.on(elementEvents, function(event) {
                if (!focused) {
                    scope.$apply(attrs.insDropdownHandler);
                    $document.on('click', onClick);
                    focused = true;
                    initial = true;
                }
            });
        }
    };
});

},{}],4:[function(require,module,exports){
angular.module('insDirectives').directive('insInclude', function() {
    'use strict';
    // This directive will act like ng-include,
    // but not create a new scope for the template
    // Use: <div ins-include="my-template-name-here"></div>
    return {
        restrict: 'A',
        templateUrl: function(element, attrs) {
            return attrs.insInclude;
        }
    };
});

},{}],5:[function(require,module,exports){
angular.module('insRequiredDocuments').controller('insRequiredDocumentsCtrl', ['$scope', '$rootScope', '$timeout', '$sldsModal', 'insRequiredDocumentsService', 'insRequiredDocumentsNotificationService', 'dataService','userProfileService', function($scope, $rootScope, $timeout, $sldsModal, insRequiredDocumentsService, insRequiredDocumentsNotificationService, dataService, userProfileService) {
    'use strict';
    $scope.params.lightningExperience = $scope.params.lightningExperience || JSON.stringify($scope.params.sfdcIFrameOrigin.includes('lightning'));
    $scope.newCategoryName = '';
    $scope.communityTabs = {};
    $scope.customLabels = {};

    // Get status list first:
    // Get Statuses
    if (!$rootScope.statusList) {
        insRequiredDocumentsService.performApexRemoteAction($scope, 'TrailingDocumentHandler', 'getStatusValues', {}).then(function(result) {
            $rootScope.statusList = result.result;
            console.log('$rootScope.statusList', $rootScope.statusList);
        }, function(error) {
            insRequiredDocumentsNotificationService.throwError(error);
        });
    }

    const translationKeys = ['InsAssetLastModifiedBy', 'InsAssetToggle', 'InsAssetFile', 'InsAssetFiles', 'InsAssetNoFiles', 'InsAssetNoFilesYet', 'InsAssetRequirements',
        'InsAssetRequirementsRemaining', 'InsAssetNoRequirements', 'InsAssetNoRequirementsRemaining', 'LoadingLC', 'InsAssetUploadFiles', 'InsAssetFilesStoredInCategory',
        'InsAssetEditPlaceholder', 'InsAssetDeletePlaceholder', 'InsAssetDeleteDocument', 'InsAssetDue', 'InsAssetUploadFileToPlaceholder', 'InsAssetDragAndDrop',
        'InsAssetNoPlaceholderReqsDefined', 'InsAssetAddOtherFiles', 'InsAssetChooseFile', 'InsAssetUploadFileToCategory', 'InsAssetSuccessfulUpdatePlaceholder',
        'InsAssetSuccessfulDocumentStatus', 'InsAssetDeletePlaceholderMessage', 'InsAssetSavePlaceholder', 'InsAssetSuccessfullyDeletedPlaceholder', 'InsAssetNoCategories', 'Close',
        'InsAssetCategoryName', 'Create', 'InsAssetSelectCategory', 'InsAssetEnterCategoryName', 'InsAssetRequiredField', 'Edit', 'Delete'];

    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                $scope.customLabels = translatedLabels;
            }
        )
    });

    $scope.getFormattedTranslationLabel = function(lastModifiedDate, uploaderFirstName, uploaderLastName) {
        uploaderFirstName = uploaderFirstName ? uploaderFirstName + ' ' : '';
        uploaderLastName = uploaderLastName || '';
        var formattedFullName = uploaderFirstName + uploaderLastName;
        var formattedLastModifiedDate = lastModifiedDate || '';
        return ($scope.customLabels.InsAssetLastModifiedBy || '').replace(/\{0\}/g, formattedLastModifiedDate).replace(/\{1\}/g, formattedFullName);
    }


    if (!$rootScope.networkId) {
        insRequiredDocumentsService.performApexRemoteAction($scope, 'TrailingDocumentHandler', 'getNetworkId', {}).then(function (result) {
            $rootScope.networkId = result.networkId;
        }, function (error) {
            insRequiredDocumentsNotificationService.throwError(error);
        });
    }

    $scope.insReqDocInit = function(data) {
        // Hide VF page spinner:
        angular.element('.vloc-req-doc-initial-spinner').hide();
        if (!data) {
            insRequiredDocumentsNotificationService.throwError({
                message: $scope.customLabels.InsAssetNoRecordsFound || 'No records found.',
                details: 'id: ' + $scope.params.id
            });
            return;
        }
        insRequiredDocumentsService.formatResponseData(data).then(function(result) {
            $rootScope.insReqDocData = result;
        });
    };

    $scope.createDocumentPlaceholder = function() {
        if ($scope.newCategoryName === '') {
            $scope.newCategoryNameError = true;
            return;
        }
        var inputMap = {
            objectId: $scope.params.id,
            fields: [{
                fieldValue: $scope.newCategoryName,
                fieldName: 'Name',
                fieldType: 'STRING'
            }]
        };
        angular.element('.vloc-req-doc-initial-spinner').show();
        insRequiredDocumentsService.performApexRemoteAction($scope, 'TrailingDocumentHandler', 'createDocumentPlaceholder', inputMap).then(function(result) {
            console.log(result);
            $rootScope.$broadcast('reloadLayout', $scope.params.layout, true);
        }, function(error) {
            angular.element('.vloc-req-doc-initial-spinner').hide();
            insRequiredDocumentsNotificationService.throwError(error);
        });
    };

    $scope.insRequiredDocumentsService = insRequiredDocumentsService;
    $scope.placeholdersAccordion = insRequiredDocumentsService.placeholdersAccordion;
    $scope.decideOverflowClass = function(placeholder, index) {
        insRequiredDocumentsService.decideOverflowClass.call(this, placeholder, index);
    };

    $scope.getTabIndex = function(obj, key, index) {
        index = parseInt(index);
        $timeout(function() {
            if (isNaN(parseFloat(index))) {
                // index is a boolean from uploadedDocument.menuOpen
                if (index) {
                    obj[key] = 0;
                } else {
                    obj[key] = -1;
                }
            } else {
                if ($scope.placeholdersAccordion.activePlaceholders.indexOf(index) > -1) {
                    obj[key] = 0;
                } else {
                    obj[key] = -1;
                }
            }
        });
    };

    $scope.getPlaceholderStatusClass = function(status) {
        status = status.toLowerCase().replace(/[_ ]/g, '-');
        return status;
    };

    $scope.decideXIconVisibility = function(status, icon) {
        var showIcon = false;
        status = status.toLowerCase();
        switch (icon) {
            case 'clock':
                if (status === 'submitted') {
                    showIcon = true;
                }
                break;
            case 'approval':
                if (status === 'complete') {
                    showIcon = true;
                }
                break;
            case 'reject':
                if (status === 'exception' || status === 'error') {
                    showIcon = true;
                }
                break;
            case 'refresh':
                if (status === 'accepted' || status === 'in process') {
                    showIcon = true;
                }
                break;
            default:
                showIcon = false;
        }
        return showIcon;
    };

    function decidePopoverLocationHelper(idx, className, mod) {
        if (idx === 0 || ((idx + 1) % mod) === 1) {
            className = 'vloc-popover-left';
        } else if (!((idx + 1) % mod)) {
            className = 'vloc-popover-right';
        }
        return className;
    }

    // Assumes a 4-col flex on desktop
    $scope.decidePopoverLocation = function(idx) {
        var windowWith = window.innerWidth;
        var className = '';
        if (windowWith > 1023) {
            className = decidePopoverLocationHelper(idx, className, 4);
        } else if (windowWith > 767 && windowWith < 1024) {
            className = decidePopoverLocationHelper(idx, className, 3);
        }
        return className;
    };

    $scope.editPlaceholder = function(documentPlaceholder, elementClassName, category, cardIndex) {
        var modalScope = $scope.$new();
        documentPlaceholder.editingDeletingPlaceholder = true;
        // Use documentPlaceholderCopy to prevent original fields from being affected on modal close
        var documentPlaceholderCopy = angular.copy(documentPlaceholder);

        modalScope.vlocPrompt = {
            heading: ($scope.customLabels.Edit || 'Edit') + ' "' + documentPlaceholderCopy.Name + '"',
            useVdf: true,
            topOffset: '-2.5rem',
            documentPlaceholder: documentPlaceholderCopy,
            mapObject: {
                'fieldMapping': {
                    'type': 'inputType',
                    'value': 'fieldValue',
                    'label': 'fieldLabel',
                    'readonly': 'readonly',
                    'hidden': 'hidden',
                    'valuesArray' : { //multiple values. Eg: select, fieldset, radio
                        'field': 'values',  //Points to an array
                        'value': 'value',   //Points to an value field in an object of an array
                        'label': 'label'
                    }
                }
            },
            button1: {
                label: $scope.customLabels.InsAssetSavePlaceholder || 'Save Placeholder',
                className: 'slds-button_brand',
                method: function() {
                    var inputMap = {};
                    var sendToRemote = {};
                    var self = this;
                    angular.forEach(documentPlaceholderCopy.fields, function(field) {
                        if (field.fieldType !== 'REFERENCE' && field.fieldType !== 'ID') {
                            if (field.fieldType === 'DATE' && field.fieldValue && typeof field.fieldValue === 'object') {
                                sendToRemote[field.fieldName] = field.fieldValue;
                            } else {
                                sendToRemote[field.fieldName] = field.fieldValue;
                            }
                        }
                    });
                    inputMap = {
                        placeholderId: angular.copy(documentPlaceholderCopy.Id),
                        fieldValues: angular.copy(sendToRemote)
                    };
                    documentPlaceholder.fields = angular.copy(documentPlaceholderCopy.fields);
                    console.log('documentPlaceholder and inputMap before send', documentPlaceholder, inputMap);

                    insRequiredDocumentsService.performApexRemoteAction($scope, 'TrailingDocumentHandler', 'updateDocumentPlaceholder', inputMap).then(function(result) {
                        var newCategoryData = {
                            records: [category]
                        };
                        insRequiredDocumentsService.formatResponseData(newCategoryData).then(function(formatResult) {
                            $rootScope.insReqDocData[parseInt(cardIndex)] = formatResult;
                        });
                        documentPlaceholder.editingDeletingPlaceholder = false;
                        $rootScope.insReqDocModal.$scope.$slideHide();
                        console.log('updateDocumentPlaceholder success', result);
                        insRequiredDocumentsNotificationService.deliverNotification({message: $scope.customLabels.InsAssetSuccessfulUpdatePlaceholder || 'Successfully updated Placeholder.', type: 'success'});
                    }, function(error) {
                        documentPlaceholder.editingDeletingPlaceholder = false;
                        insRequiredDocumentsNotificationService.throwError(error);
                    });
                }
            },
            closeModal: function() {
                $rootScope.insReqDocModal.$scope.$slideHide();
                documentPlaceholder.editingDeletingPlaceholder = false;
                console.warn('Placeholder (' + documentPlaceholder.Name + ') edit cancelled by ' + $rootScope.vlocity.userName);
            }
        };
        $rootScope.insReqDocModal = $sldsModal({
            scope: modalScope,
            templateUrl: 'InsSldsPrompt.tpl.html',
            container: elementClassName,
            backdrop: 'static',
            show: true,
            vlocSlide: true,
            vlocSlideHeader: false,
            vlocSlideFooter: false
        });
    };

    $scope.deletePlaceholder = function(documentPlaceholder, elementClassName, categoryIndex) {
        var inputMap = {
            placeholderId: documentPlaceholder.Id
        };
        var modalScope = $scope.$new();
        documentPlaceholder.editingDeletingPlaceholder = true;
        modalScope.vlocPrompt = {
            heading: ($scope.customLabels.Delete || 'Delete') + ' ""' + documentPlaceholder.Name  + '"',
            topOffset: '-2.5rem',
            content: $scope.customLabels.InsAssetDeletePlaceholderMessage || 'Are you sure you want to permanently delete this Placeholder and all its Files?',
            button1: {
                label: $scope.customLabels.InsAssetDeletePlaceholder || 'Delete Placeholder',
                className: 'slds-button_destructive',
                method: function() {
                    $rootScope.insReqDocModal.$scope.$slideHide();
                    insRequiredDocumentsService.performApexRemoteAction($scope, 'TrailingDocumentHandler', 'deletePlaceholder', inputMap).then(function(result) {
                        angular.forEach($rootScope.insReqDocData.records[parseInt(categoryIndex)].documentPlaceholders.records, function(docPlaceholder, i) {
                            if (docPlaceholder.Id === documentPlaceholder.Id) {
                                $rootScope.insReqDocData.records[parseInt(categoryIndex)].documentPlaceholders.records.splice(i, 1);
                            }
                        });
                        insRequiredDocumentsService.formatResponseData($rootScope.insReqDocData, true).then(function(result2) {
                            $rootScope.insReqDocData = result2;
                            documentPlaceholder.editingDeletingPlaceholder = false;
                            insRequiredDocumentsNotificationService.deliverNotification({message: ($scope.customLabels.InsAssetSuccessfullyDeletedPlaceholder || 'Successfully deleted Placeholder.'), type: 'success'});
                        });
                    }, function(error) {
                        documentPlaceholder.editingDeletingPlaceholder = false;
                        insRequiredDocumentsNotificationService.throwError(error);
                    });
                }
            },
            closeModal: function() {
                $rootScope.insReqDocModal.$scope.$slideHide();
                documentPlaceholder.editingDeletingPlaceholder = false;
                console.warn('Delete Placeholder (' + documentPlaceholder.Name + ') cancelled by ' + $rootScope.vlocity.userName);
            }
        };
        $rootScope.insReqDocModal = $sldsModal({
            scope: modalScope,
            templateUrl: 'InsSldsPrompt.tpl.html',
            container: elementClassName,
            backdrop: 'static',
            show: true,
            vlocSlide: true,
            vlocSlideHeader: false,
            vlocSlideFooter: false
        });
    };

    $scope.goToContentDocument = function(uploadedDocument, event) {
        var origin = $scope.params.sfdcIFrameOrigin;
        var message = {
            vlocityCardCmpOpenFiles: {
                recordId: uploadedDocument.ContentDocumentId
            }
        };
        window.parent.postMessage(message, origin);
    };

    $scope.getTranslatedDocumentStatus = function(status) {
        let documentStatus = $rootScope.statusList.documentStatus;
        for(var i = 0; i < documentStatus.length; i++) {
            if(documentStatus[i].value === status) {
                return documentStatus[i].label;
            }
        }
    }

    $scope.updateDocumentStatus = function(uploadedDocument, elementClassName) {
        var inputMap = {
            LatestPublishedVersionId: uploadedDocument.LatestPublishedVersionId,
            toStatus: uploadedDocument[$rootScope.nsPrefix + 'Status__c']
        };
        insRequiredDocumentsService.performApexRemoteAction($scope, 'TrailingDocumentHandler', 'updateDocumentStatus', inputMap).then(function(result) {
            insRequiredDocumentsNotificationService.deliverNotification({message: ($scope.customLabels.InsAssetSuccessfulDocumentStatus || 'Successfully updated Document Status.'), type: 'success'});
        }, function(error) {
            insRequiredDocumentsNotificationService.throwError(error);
        });
    };

    $scope.deleteDocument = function(elementClassName, categoryIndex, documentPlaceholder, uploadedDocument) {
        var inputMap, action;
        var isLast = false;
        if (documentPlaceholder.uploadedDocuments && documentPlaceholder.uploadedDocuments.records && documentPlaceholder.uploadedDocuments.records.length === 1) {
            isLast = true;
        }
        inputMap = {
            docId: uploadedDocument.Id,
            isLast: isLast,
            placeholderId: null
        };
        action = {
            remote: {
                params: {
                    methodName: 'deleteDocument'
                }
            }
        }
        insRequiredDocumentsService.deleteDocument(insRequiredDocumentsService, elementClassName, inputMap, action, $scope, categoryIndex, documentPlaceholder, uploadedDocument);
    };
}]);

},{}],6:[function(require,module,exports){
angular.module('insDirectives').directive('insDropzone', ['$rootScope', '$sldsModal', '$timeout', '$q', 'insRequiredDocumentsService', 'insRequiredDocumentsNotificationService', 'dataService', 'userProfileService', function($rootScope, $sldsModal, $timeout, $q, insRequiredDocumentsService, insRequiredDocumentsNotificationService, dataService, userProfileService) {
    'use strict';
    sforce.connection.serverUrl = sitePrefix + sforce.connection.serverUrl; // for the community portal
    sforce.connection.sessionId = window.sessionId;

    var successfulUploadMessage;

    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(['InsAssetSuccessfulUploadMessage'], userLanguage).then(
            function(translatedLabel) {
                successfulUploadMessage = translatedLabel.InsAssetSuccessfulUploadMessage || 'Successfully uploaded document.';
            }
        )
    })


    /**
     * Uploads the file to Salesforce using the SOAP API
     * @param {string} fileName
     * @param {base64} fileContent
     * @param {string} contentDocumentId
     * @param {boolean} newVersion
     */
    function saveFileToSforce(fileName, fileContent, contentDocumentId, newVersion) {
        var deferred = $q.defer();
        var contentVersionSObj;
        contentVersionSObj = new sforce.SObject('ContentVersion');
        contentVersionSObj.Title = fileName;
        contentVersionSObj.PathOnClient = fileName;
        contentVersionSObj.VersionData = fileContent;
        contentVersionSObj[$rootScope.nsPrefix + 'Status__c'] = 'Submitted';
        if (newVersion) {
            contentVersionSObj.ContentDocumentId = contentDocumentId;
        }
        if ($rootScope.networkId) {
            contentVersionSObj.NetworkId = $rootScope.networkId;
        }
        sforce.connection.create([contentVersionSObj], {
            onSuccess: function(result) {
                deferred.resolve(result);
            },
            onFailure: function(error) {
                deferred.reject(error);
            }
        });
        return deferred.promise;
    }

    /**
     * Starting function used to upload documents
     * @param {object} scope
     * @param {File} file
     * @param {string} objectId
     * @param {string} contentDocumentId
     * @param {boolean} newVersion
     */
    function uploadDocuments(scope, file, objectId, contentDocumentId, newVersion) {
        var deferred = $q.defer();
        var inputMap = {};
        var reader = new FileReader();
        var methodName = 'uploadDocuments';
        var readerResult, fileSize;
        reader.onload = function() {
            readerResult = reader.result.substring(reader.result.indexOf('base64,') + 7);
            saveFileToSforce(file.name, readerResult, contentDocumentId, newVersion).then(function(result) {
                if (result[0].errors) {
                    deferred.reject(result[0].errors);
                } else {
                    if (newVersion) {
                        methodName = 'getTrailingDocuments';
                        inputMap = {
                            objectId: objectId
                        };
                    } else {
                        inputMap = {
                            placeholderId: objectId,
                            contentVersionIds: [result[0].id]
                        };
                    }
                    insRequiredDocumentsService.performApexRemoteAction(scope, 'TrailingDocumentHandler', methodName, inputMap).then(function(result2) {
                        deferred.resolve(result2);
                    }, function(error) {
                        deferred.reject(error);
                    });
                }
            }, function(error) {
                deferred.reject(error);
            });
        };
        reader.readAsDataURL(file);
        return deferred.promise;
    }

    /**
     * Used to compare the new uploadedDocument Ids back to a previously collected list of the previous uploadedDocument Ids
     * in order to find the new file and momentarily highlight it in the UI so the user knows which one is new
     * @param {object} result
     */
    function findNewFile(result) {
        let uploadedDocumentsReference, documentReference;
        if (result.records[0].documentPlaceholders) {
            uploadedDocumentsReference = result.records[0].documentPlaceholders.records[0].uploadedDocuments.records;
        } else if (!result.records[0].documentPlaceholders && result.records[0].uploadedDocuments) {
            uploadedDocumentsReference = result.records[0].uploadedDocuments.records;
        }
        if (uploadedDocumentsReference) {
            for (let i = 0; i < uploadedDocumentsReference.length; i++) {
                let uploadedDocument = uploadedDocumentsReference[i];
                if ($rootScope.currentPlaceholderFiles.indexOf(uploadedDocument.LatestPublishedVersionId) === -1) {
                    $rootScope.currentPlaceholderFiles.push(uploadedDocument.LatestPublishedVersionId);
                    documentReference = uploadedDocument;
                    documentReference.newlyAddedFile = true;
                    break;
                }
            }
        }
        return documentReference;
    }

    /**
     * After the upload to SFDC is complete, this function is used to add the new file to the UI
     * @param {object} result
     * @param {object} attrs
     */
    function addNewFilesHelper(result, attrs) {
        console.log('addNewFilesHelper result', result);
        // Mark new file as new so UI flashes its row on completion:
        const documentReference = findNewFile(result);
        const scopeRecord = $rootScope.insReqDocData.records[parseInt(attrs.insDropzone)];
        const resultRecord = result.records[0];
        if (scopeRecord.filesInCategory) {
            // Must set this to false in order for the data to be formatted again:
            scopeRecord.filesInCategory = false;
        }

        if (resultRecord.documentPlaceholders) {
            let placeholder, field, documentId;
            const scopePlaceholders = scopeRecord.documentPlaceholders.records;
            const resultPlaceholderFields = resultRecord.documentPlaceholders.records[0].fields;
            for (let i = 0; i < resultPlaceholderFields.length; i++) {
                field = resultPlaceholderFields[i];
                if (field.fieldName === 'Id') {
                    documentId = field.fieldValue;
                    break;
                }
            }
            for (let i = 0; i < scopePlaceholders.length; i++) {
                placeholder = scopePlaceholders[i];
                if (placeholder.Id === documentId) {
                    if (scopePlaceholders[i].uploadedDocuments) {
                        // Add new document to existing uploadedDocuments
                        scopePlaceholders[i].uploadedDocuments.records.push(documentReference);
                    } else {
                        // Set new uploadedDocuments
                        scopePlaceholders[i].uploadedDocuments = resultRecord.documentPlaceholders.records[0].uploadedDocuments;
                    }
                    break;
                }
            }
        } else if (resultRecord.uploadedDocuments) {
            if (scopeRecord.uploadedDocuments) {
                // Add new document to existing uploadedDocuments
                scopeRecord.uploadedDocuments.records.push(documentReference);
            } else {
                // Set new uploadedDocuments
                scopeRecord.uploadedDocuments = resultRecord.uploadedDocuments;
            }
        }

        insRequiredDocumentsService.formatResponseData($rootScope.insReqDocData, true).then(function(result2) {
            $rootScope.insReqDocData = result2;
            insRequiredDocumentsNotificationService.deliverNotification({message: successfulUploadMessage, type: 'success'});
            $timeout(function() {
                documentReference.newlyAddedFile = false;
                if (attrs.objectType === 'category') {
                    $rootScope.insReqDocData.records[parseInt(attrs.insDropzone)].fileUploading = false;
                }
            }, 1000);
        });
    }

    function bytesToSize(bytes) {
        var sizes, i;
        if (bytes == 0) {
            return '0 Bytes';
        }
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    function maxFileSizeLimit(bytes) {
        const maxFileSize = 37100; // roughly 38MB
        return (bytes / 1024) > maxFileSize;
    }

    function maxSizeError(scope, file) {
        var modalScope = scope.$new();
        var fileSize = bytesToSize(file.size);
        modalScope.isLayoutLoaded = false;
        modalScope.vlocPrompt = {
            heading: '"' + file.name  + '" is too large',
            content: 'This file is ' + fileSize + '. The max file size is 38MB.',
            topOffset: '0',
            closeModal: function() {
                $rootScope.insReqDocModal.$scope.$slideHide();
                console.warn('File (' + file.name + ') upload cancelled because file size (' + fileSize + ') exceeds 38MB limit');
            }
        };
        $rootScope.insReqDocModal = $sldsModal({
            scope: modalScope,
            templateUrl: 'InsSldsPrompt.tpl.html',
            container: '.via-slds',
            backdrop: 'static',
            show: true,
            vlocSlide: true,
            vlocSlideHeader: false,
            vlocSlideFooter: false
        });
    }

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            let clickableElement = element[0].getElementsByClassName('vloc-req-doc-upload-helper-text-upload-link')[0];
            if (element[0].className.indexOf('vloc-req-doc-file-info-container') > -1) {
                clickableElement = null;
            }
            const dropzoneConfig = {
                url: location.pathname,
                clickable: clickableElement,
                createImageThumbnails: false,
                uploadMultiple: true,
                parallelUploads: 20,
                init: function() {
                    this.on('sendingmultiple', function(files) {
                        const self = this;
                        const firstName = $rootScope.vlocity.userName.split(' ')[0];
                        const lastName = $rootScope.vlocity.userName.split(' ')[1];
                        const docTypeSvgMap = insRequiredDocumentsService.getDocTypeSvgMap();
                        const docTypeSvgMapKeys = Object.keys(docTypeSvgMap);
                        let file;

                        for (let i = 0; i < files.length; i++) {
                            file = files[i];
                            if (maxFileSizeLimit(file.size)) {
                                maxSizeError(scope, file);
                                self.removeAllFiles(true);
                                return;
                            }
                        }

                        angular.forEach(files, function(file) {
                            let modalScope, fileType, placeholderReference, elementClassName;
                            angular.forEach(docTypeSvgMapKeys, function(docTypeSvgMapKey) {
                                if (file.name.indexOf(docTypeSvgMapKey) > -1) {
                                    fileType = docTypeSvgMap[docTypeSvgMapKey].svgIcon;
                                }
                            });
                            console.log(file, element, scope);
                            console.log('Object Type:', attrs.objectType);

                            // Compiling a list of Ids from LatestPublishedVersionId on the document in order to find the newest
                            // file uploaded by finding the missing Id in this list after upload
                            if ($rootScope.insReqDocData.records[parseInt(attrs.insDropzone)]) {
                                const scopeRecord = $rootScope.insReqDocData.records[parseInt(attrs.insDropzone)];
                                if (attrs.objectType === 'category') {
                                    scopeRecord.fileUploading = true;
                                }
                                $rootScope.currentPlaceholderFiles = [];
                                if (scopeRecord.documentPlaceholders) {
                                    placeholderReference = scopeRecord.documentPlaceholders;
                                    angular.forEach(placeholderReference.records, function(docPlaceholder) {
                                        if (docPlaceholder.Id === attrs.objectId && docPlaceholder.uploadedDocuments) {
                                            angular.forEach(docPlaceholder.uploadedDocuments.records, function(uploadedDocument) {
                                                if ($rootScope.currentPlaceholderFiles.indexOf(uploadedDocument.LatestPublishedVersionId) === -1) {
                                                    $rootScope.currentPlaceholderFiles.push(uploadedDocument.LatestPublishedVersionId);
                                                }
                                            });
                                        }
                                    });
                                } else if (scopeRecord.uploadedDocuments) {
                                    placeholderReference = scopeRecord.uploadedDocuments;
                                    angular.forEach(placeholderReference.records, function(uploadedDocument) {
                                        if ($rootScope.currentPlaceholderFiles.indexOf(uploadedDocument.LatestPublishedVersionId) === -1) {
                                            $rootScope.currentPlaceholderFiles.push(uploadedDocument.LatestPublishedVersionId);
                                        }
                                    });
                                }
                                console.log('$rootScope.currentPlaceholderFiles', $rootScope.currentPlaceholderFiles);
                            }

                            if (scope.uploadedDocument) {
                                // We know this is a file the user is either trying to replace or trying to add
                                // a new file to the same placeholder
                                if ($rootScope.lightningExperience) {
                                    angular.forEach(element[0].classList, function(className, i) {
                                        if (className.indexOf('current-obj-id') > -1) {
                                            elementClassName = '.' + className;
                                            i = element[0].classList.length;
                                        }
                                    });
                                } else {
                                    elementClassName = '.via-slds';
                                }
                                modalScope = scope.$new();
                                modalScope.isLayoutLoaded = false;
                                modalScope.vlocPrompt = {
                                    heading: 'Uploading "' + file.name  + '"',
                                    content: 'Should this file replace the existing file with a new version, or add as new?',
                                    button1: {
                                        label: 'Replace File', // a user can only replace a file if the status is submitted or rejected
                                        className: 'slds-button_brand',
                                        method: function() {
                                            $rootScope.insReqDocModal.$scope.$slideHide();
                                            uploadDocuments(scope, file, attrs.objectId, attrs.contentDocumentId, true).then(function(result) {
                                                addNewFilesHelper(result, attrs);
                                            }, function(error) {
                                                self.removeFile(file);
                                                insRequiredDocumentsNotificationService.throwError(error);
                                            });
                                        }
                                    },
                                    button2: {
                                        label: 'Add New File',
                                        className: 'slds-button_brand',
                                        method: function() {
                                            $rootScope.insReqDocModal.$scope.$slideHide();
                                            uploadDocuments(scope, file, attrs.objectId, attrs.contentDocumentId, false).then(function(result) {
                                                addNewFilesHelper(result, attrs);
                                            }, function(error) {
                                                self.removeFile(file);
                                                insRequiredDocumentsNotificationService.throwError(error);
                                            });
                                        }
                                    },
                                    closeModal: function() {
                                        self.removeAllFiles(true);
                                        $rootScope.insReqDocModal.$scope.$slideHide();
                                        console.warn('File (' + file.name + ') upload cancelled by ' + firstName + ' ' + lastName);
                                    }
                                };
                                $rootScope.insReqDocModal = $sldsModal({
                                    scope: modalScope,
                                    templateUrl: 'InsSldsPrompt.tpl.html',
                                    container: elementClassName,
                                    backdrop: 'static',
                                    show: true,
                                    vlocSlide: true,
                                    vlocSlideHeader: false,
                                    vlocSlideFooter: false
                                });
                                console.log('modalScope', modalScope);
                            } else {
                                uploadDocuments(scope, file, attrs.objectId, attrs.contentDocumentId, false).then(function(result) {
                                    console.log('uploaded document and it returned', result);
                                    addNewFilesHelper(result, attrs);
                                }, function(error) {
                                    insRequiredDocumentsNotificationService.throwError(error);
                                });
                            }
                        });
                        self.removeAllFiles(true);
                    });
                },
            };
            var currentDropzone = new Dropzone(element[0], dropzoneConfig);
        }
    };
}]);

},{}],7:[function(require,module,exports){
angular.module('insRequiredDocuments').directive('insCollapseCalcHeight', ['$timeout', function($timeout) {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var watchElementsClassNames = [
                '.vloc-req-doc-subtree-item-container',
                '.vloc-req-doc-new-file-uploaded',
                '.vloc-req-doc-new-file-deleted',
                '.slds-notify'
            ];
            scope.$watch(
                // This function returns the value that is watched in the next function.
                // Collecting the length of child elements that would affect the height of this container.
                function() { 
                    var watchElementsLength = 0;
                    watchElementsLength = watchElementsLength + element[0].children.length;
                    angular.forEach(watchElementsClassNames, function(watchElementsClassName) {
                        if ($(element[0]).find(watchElementsClassName) && $(element[0]).find(watchElementsClassName).length) {
                            watchElementsLength = watchElementsLength + $(element[0]).find(watchElementsClassName).length;
                        }
                    });
                    return watchElementsLength;
                },
                function(newValue, oldValue) {
                    var containerHeight = 0;
                    if (newValue !== oldValue || !attrs.style) {
                        $timeout(function() {
                            angular.forEach(element[0].children, function(child) {
                                containerHeight += $(child).outerHeight(true);
                            });
                            containerHeight = containerHeight + 'px';
                            $(element[0]).css({height: containerHeight});
                        }, 250);
                    }
                }
            );
        }
    };
}]);
},{}],8:[function(require,module,exports){
angular.module('insRequiredDocuments').directive('insStopPropagation', [function() {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('click', function(e) {
                e.stopPropagation();
            });
        }
    };
}]);
},{}],9:[function(require,module,exports){
angular.module('insRequiredDocuments').factory('insRequiredDocumentsNotificationService', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    'use strict';
    return {
        /**
         * Shows a notification in a toast. Notification format: {message: '', type: 'success/warning/error'}
         * @param {object} notification
         */
        deliverNotification: function(notification) {
            var themeMap = {
                success: {
                    theme: 'success'
                },
                warning: {
                    theme: 'warning'
                },
                error: {
                    theme: 'error'
                }
            };
            $rootScope.insReqDocNotification = {
                message: notification.message,
                type: notification.type,
                theme: themeMap[notification.type].theme,
                show: true
            };
            // Remove toast from UI automatically after a certain time
            $timeout(function() {
                $rootScope.insReqDocNotification.show = false;
            }, 4000);
        },
        throwError: function(error) {
            console.error(error);
            this.deliverNotification({message: error.message || error.faultstring || error.data.message || error.data.error, type: 'error'});
        }
    };
}]);
},{}],10:[function(require,module,exports){
angular.module('insRequiredDocuments').factory('insRequiredDocumentsService', ['$rootScope','$timeout', '$q', '$sldsModal', 'dataSourceService', 'insRequiredDocumentsNotificationService','dataService', 'userProfileService', function($rootScope, $timeout, $q, $sldsModal, dataSourceService, insRequiredDocumentsNotificationService, dataService, userProfileService) {
    'use strict';
    var placeholdersAccordion = {
        activePlaceholders: [0]
    };

    let customLabels = {};
    const translationKeys = ['InsAssetExtraFilesIn', 'InsAssetFilesDeleteConfirmation', 'InsAssetFilesDeleting', 'InsAssetDeleteFile', 'InsAssetSuccessfulDeleteMessage'];

    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) {
                customLabels = translatedLabels;
            }
        )
    })

    function deleteDocument(self, elementClassName, inputMap, action, scope, categoryIndex, documentPlaceholder, uploadedDocument) {
        var modalScope = scope.$new();
        uploadedDocument.deleteStarted = true;
        modalScope.isLayoutLoaded = false;
        modalScope.vlocPrompt = {
            heading: (customLabels.InsAssetFilesDeleting || 'Deleting') + uploadedDocument.PathOnClient,
            content: customLabels.InsAssetFilesDeleteConfirmation || 'Are you sure you want to permanently delete this document and all its versions?',
            button1: {
                label: customLabels.InsAssetDeleteFile || 'Delete file',
                className: 'slds-button_destructive',
                method: function() {
                    $rootScope.insReqDocModal.$scope.$slideHide();
                    performActionHelper(self, action, inputMap).then(function(result) {
                        documentPlaceholder.fileJustDeleted = true;
                        angular.forEach($rootScope.insReqDocData.records[parseInt(categoryIndex)].documentPlaceholders.records, function(docPlaceholder, i) {
                            if (docPlaceholder.uploadedDocuments && docPlaceholder.uploadedDocuments.records) {
                                angular.forEach(docPlaceholder.uploadedDocuments.records, function(uploadedDoc, j) {
                                    if (uploadedDoc.LatestPublishedVersionId === uploadedDocument.LatestPublishedVersionId) {
                                        docPlaceholder.uploadedDocuments.records.splice(j, 1);
                                        if (!docPlaceholder.uploadedDocuments.records.length) {
                                            delete docPlaceholder.uploadedDocuments;
                                            if (docPlaceholder.notInPlaceholder && $rootScope.lightningExperience === 'true') {
                                                delete $rootScope.insReqDocData.records[parseInt(categoryIndex)].uploadedDocuments;
                                                $rootScope.insReqDocData.records[parseInt(categoryIndex)].documentPlaceholders.records.splice(i, 1);
                                            }
                                            i = $rootScope.insReqDocData.records[parseInt(categoryIndex)].documentPlaceholders.records.length;
                                        }
                                        self.formatResponseData($rootScope.insReqDocData, true).then(function(result2) {
                                            $rootScope.insReqDocData = result2;
                                            if (!documentPlaceholder.uploadedDocuments) {
                                                documentPlaceholder.placeholderStatus = 'Not Started';
                                                angular.forEach(docPlaceholder.fields, function(field) {
                                                    if (field.fieldName.indexOf('Status') > -1) {
                                                        field.fieldValue = 'Not Started';
                                                    }
                                                });
                                            }
                                            insRequiredDocumentsNotificationService.deliverNotification({message: customLabels.InsAssetSuccessfulDeleteMessage || 'Successfully deleted document.', type: 'success'});
                                        });
                                    }
                                });
                            }
                        });
                        $timeout(function() {
                            documentPlaceholder.fileJustDeleted = false;
                        }, 1000);
                    });
                }
            },
            closeModal: function() {
                uploadedDocument.deleteStarted = false;
                $rootScope.insReqDocModal.$scope.$slideHide();
                console.warn('File (' + uploadedDocument.PathOnClient + ') deletion cancelled by ' + $rootScope.vlocity.userName);
            }
        };
        $rootScope.insReqDocModal = $sldsModal({
            scope: modalScope,
            templateUrl: 'InsSldsPrompt.tpl.html',
            container: elementClassName,
            backdrop: 'static',
            show: true,
            vlocSlide: true,
            vlocSlideHeader: false,
            vlocSlideFooter: false
        });
        console.log('modalScope', modalScope);
    }


    /**
     * Reusable function I can call on two different conditions in this.performAction
     * @param {this} self
     * @param {object} action
     * @param {object} inputMap
     */

    function performActionHelper(self, action, inputMap) {
        var deferred = $q.defer();
        self.performApexRemoteAction(self, 'TrailingDocumentHandler', action.remote.params.methodName, inputMap).then(function(result) {
            deferred.resolve(result);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    return {
        placeholdersAccordion: placeholdersAccordion,
        getDocTypeSvgMap: function() {
            return {
                png: {
                    fileType: 'PNG',
                    fileExtention: 'png',
                    svgIcon: 'image'
                },
                jpg: {
                    fileType: 'JPG',
                    fileExtention: 'jpg',
                    svgIcon: 'image'
                },
                jpeg: {
                    fileType: 'JPEG',
                    fileExtention: 'jpeg',
                    svgIcon: 'image'
                },
                pdf: {
                    fileType: 'PDF',
                    fileExtention: 'pdf',
                    svgIcon: 'pdf'
                },
                doc: {
                    fileType: 'DOC',
                    fileExtention: 'doc',
                    svgIcon: 'word'
                },
                docx: {
                    fileType: 'DOCX',
                    fileExtention: 'docx',
                    svgIcon: 'word'
                },
                ppt: {
                    fileType: 'PPT',
                    fileExtention: 'ppt',
                    svgIcon: 'ppt'
                },
                pptx: {
                    fileType: 'PPTX',
                    fileExtention: 'pptx',
                    svgIcon: 'ppt'
                },
                csv: {
                    fileType: 'CSV',
                    fileExtention: 'csv',
                    svgIcon: 'csv'
                },
                xls: {
                    fileType: 'XLS',
                    fileExtention: 'xls',
                    svgIcon: 'excel'
                },
                xlsx: {
                    fileType: 'XLSX',
                    fileExtention: 'xlsx',
                    svgIcon: 'excel'
                },
                zip: {
                    fileType: 'ZIP',
                    fileExtention: 'zip',
                    svgIcon: 'zip'
                }
            };
        },
        formatResponseData: function(data, replaceFile) {
            var self = this;
            var deferred = $q.defer();
            var insReqDocTypeSvgMap = self.getDocTypeSvgMap();
            if (!data) return;
            data.categoryMetadata = {
                currentId: null,
                overflowItemSelected: false,
                categories: [],
                overflowCategories: [],
                allCategories: [],
                overflowRequirements: 0
            };
            if (data && data.records && data.records.length) {
                angular.forEach(data.records, function(category, i) {
                    var categoryMetadataObj = {};
                    category.requirementsCount = 0;
                    category.filesCount = 0;
                    if (!category.documentPlaceholders) {
                        category.documentPlaceholders = {
                            records: [],
                        };
                    }
                    if (!category.filesInCategory) {
                        if (replaceFile) {
                            angular.forEach(category.documentPlaceholders.records, function(docPlaceholder, i) {
                                if (docPlaceholder.Id === category.Id) {
                                    category.documentPlaceholders.records.splice(i, 1);
                                }
                            });
                        }
                        category.documentPlaceholders.records.push({
                            displaySequence: category.documentPlaceholders.records.length + 1,
                            Name: (customLabels.InsAssetExtraFilesIn  || 'Extra files in') + ' ' + category.Name,
                            Id: category.Id,
                            categoryName: category.Name,
                            uploadedDocuments: category.uploadedDocuments,
                            notInPlaceholder: true,
                            placeholderStatus: category.uploadedDocuments && category.uploadedDocuments.records.length ? 'Submitted' : category[$rootScope.nsPrefix + 'Status__c'],
                            DueDateFormatted: self.formatDate(category[$rootScope.nsPrefix + 'DueDate__c'])
                        });
                        category.documentPlaceholders.totalSize = category.documentPlaceholders.records.length;
                    }
                    if (category.uploadedDocuments && category.uploadedDocuments.records) {
                        category.filesInCategory = true;
                    } else {
                        category.filesInCategory = false;
                    }
                    if (category.documentPlaceholders && category.documentPlaceholders.records) {
                        if (!category.menuTabIndex) {
                            if (placeholdersAccordion.activePlaceholders.indexOf(i) > -1) {
                                category.menuTabIndex = 0;
                            } else {
                                category.menuTabIndex = -1;
                            }
                        }
                        if (!category.overflowUnset) {
                            self.decideOverflowClass(category, i);
                        }
                        angular.forEach(category.documentPlaceholders.records, function(docPlaceholder) {
                            if (docPlaceholder.fields) {
                                angular.forEach(docPlaceholder.fields, function(field) {
                                    var dueDate;
                                    if (field.fieldName === 'Id') {
                                        docPlaceholder.Id = field.fieldValue;
                                    }
                                    if (field.fieldName === 'Name') {
                                        docPlaceholder.Name = field.fieldValue;
                                    }
                                    if (field.fieldName.indexOf('Status') > -1) {
                                        docPlaceholder.placeholderStatus = field.fieldValue;
                                    }
                                    if (field.fieldName.indexOf('IsRequired') > -1) {
                                        docPlaceholder.isRequired = field.fieldValue;
                                    }
                                    if (field.fieldName.indexOf('DueDate') > -1) {
                                        dueDate = angular.copy(field.fieldValue);
                                        docPlaceholder.DueDateFormatted = self.formatDate(dueDate);
                                    }
                                    field.inputType = $rootScope.vdfInputTypeMap[field.fieldType.toLowerCase()];
                                });
                            }
                            if (docPlaceholder.uploadedDocuments && docPlaceholder.uploadedDocuments.records) {
                                category.filesCount += docPlaceholder.uploadedDocuments.records.length;
                                angular.forEach(docPlaceholder.uploadedDocuments.records, function(uploadedDocument) {
                                    if (uploadedDocument.LastModifiedDate) {
                                        uploadedDocument.LastModifiedDateFormatted = self.formatDate(uploadedDocument.LastModifiedDate);
                                    }
                                    if (uploadedDocument.FileExtension && insReqDocTypeSvgMap[uploadedDocument.FileExtension]) {
                                        uploadedDocument.svgIcon = insReqDocTypeSvgMap[uploadedDocument.FileExtension].svgIcon;
                                    } else if (!uploadedDocument.svgIcon) {
                                        uploadedDocument.svgIcon = 'attachment';
                                    }
                                });
                            } else if (!docPlaceholder.notInPlaceholder) {
                                category.requirementsCount++;
                            }
                        });
                    }
                    // Need to access category names for the tabs in Communities
                    categoryMetadataObj = {
                        name: category.Name,
                        displaySequence: category.displaySequence,
                        Id: category.Id,
                        requirementsCount: category.requirementsCount,
                        filesCount: category.filesCount,
                        filesInCategory: category.filesInCategory
                    };
                    if (categoryMetadataObj.requirementsCount > 1) {
                        categoryMetadataObj.mobileName = category.Name + ' (' + category.requirementsCount + ' Requirements Left)';
                    } else if (categoryMetadataObj.requirementsCount === 1) {
                        categoryMetadataObj.mobileName = category.Name + ' (' + category.requirementsCount + ' Requirement Left)';
                    } else {
                        categoryMetadataObj.mobileName = category.Name;
                    }
                    if (i === 0) {
                        data.categoryMetadata.currentId = category.Id;
                    }
                    if (i >= 0 && i <= 3) {
                        data.categoryMetadata.categories.push(categoryMetadataObj);
                    } else if (i > 3) {
                        categoryMetadataObj.overflow = true;
                        data.categoryMetadata.overflowCategories.push(categoryMetadataObj);
                        if (category.requirementsCount) {
                            data.categoryMetadata.overflowRequirements = data.categoryMetadata.overflowRequirements + category.requirementsCount;
                        }
                    }
                    data.categoryMetadata.allCategories.push(categoryMetadataObj);
                });
            }
            console.log('formatted data', data);
            deferred.resolve(data);
            return deferred.promise;
        },
        decideOverflowClass: function(placeholder, index) {
            index = parseInt(index);
            // Wait for $digest
            $timeout(function(self) {
                if (placeholdersAccordion.activePlaceholders.indexOf(index) > -1) {
                    // Wait for CSS transition to finish
                    $timeout(function() {
                        placeholder.overflowUnset = true;
                    }, 300);
                } else {
                    placeholder.overflowUnset = false;
                }
            });
        },
        formatDate: function(date) {
            var self = this;
            var dateObj, formattedDate, insReqDocMonthNames;
            // if userTimeZone is undefined, set default to UTC
            const userTimeZone = $rootScope.vlocity.userTimeZone || 'UTC';
            const userLocale = $rootScope.vlocity.userAnLocale || $rootScope.vlocity.userSfLocale.replace("_", "-");
            const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: userTimeZone };
            if (date) {
                if (moment) {
                    insReqDocMonthNames = moment.months();
                    dateObj = moment(date).toDate();
                } else {
                    insReqDocMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    dateObj = new Date(date);
                    if (Object.prototype.toString.call(dateObj) === '[object Date]') {
                        if (isNaN(dateObj.getTime())) {
                            if (typeof date === 'string' && date.indexOf('.') > -1) {
                                date = date.split('.')[0];
                                return self.formatDate(date);
                            }
                        }
                    } else {
                        console.error('This date is invalid', date);
                    }
                }
                formattedDate = dateObj.toLocaleDateString(userLocale, options) || insReqDocMonthNames[dateObj.getUTCMonth()] + ' ' + dateObj.getUTCDate() + ', ' + dateObj.getUTCFullYear();
            }
            return formattedDate;
        },
        performApexRemoteAction: function(scope, remoteClass, remoteMethod, inputParams, optionParams) {
            console.log('perform apex remote action');
            var deferred = $q.defer();
            var datasource = {};
            datasource.type = 'ApexRemote';
            datasource.value = {
                remoteNSPrefix: $rootScope.nsPrefix,
                remoteClass: remoteClass,
                remoteMethod: remoteMethod
            };
            if (inputParams && inputParams.constructor === Object) {
                datasource.value.inputMap = inputParams;
            }
            if (optionParams && optionParams.constructor === Object) {
                datasource.value.optionsMap = optionParams;
            }
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    deferred.resolve(data);
                },
                function(error) {
                    console.error(error);
                    insRequiredDocumentsNotificationService.throwError(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        performAction: function(action, elementClassName, scope, categoryIndex, documentPlaceholder, uploadedDocument) {
            var self = this;
            var inputMap = {};
            var firstName = $rootScope.vlocity.userName.split(' ')[0];
            var lastName = $rootScope.vlocity.userName.split(' ')[1];
            var methodName;
            angular.forEach(action.remote.params, function(param, key) {
                if (key !== 'methodName') {
                    inputMap[key] = param;
                } else {
                    methodName = param;
                }
            });
            if (methodName === 'deleteDocument') {
                deleteDocument(self, elementClassName, inputMap, action, scope, categoryIndex, documentPlaceholder, uploadedDocument);
            } else {
                performActionHelper(self, action, inputMap);
            }
        },
        deleteDocument: deleteDocument
    };
}]);

},{}],11:[function(require,module,exports){
angular.module("insRequiredDocuments").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("InsSldsPrompt.tpl.html",'<section role="alertdialog" tabindex="-1" aria-labelledby="prompt-heading-id" aria-describedby="prompt-message-wrapper" class="slds-modal slds-fade-in-open slds-modal_prompt vloc-modal-slds-slide-up vloc-modal" ng-style="{\'top\': vlocPrompt.topOffset || \'-4.5rem\'}">\n    <div class="slds-modal__container vloc-modal-container">\n        <header class="slds-modal__header slds-theme_inverse slds-theme_alert-texture">\n            <button class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" title="Close" ng-click="vlocPrompt.closeModal()" ng-show="1">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 class="slds-text-heading_medium" id="prompt-heading-id" ng-bind="vlocPrompt.heading"></h2>\n        </header>\n        <div class="slds-modal__content slds-p-around_medium vloc-modal-content" id="modal-content-id-1">\n            <p ng-bind-html="vlocPrompt.content" ng-if="vlocPrompt.content"></p>\n            <div ng-if="vlocPrompt.useVdf">\n                <vlocity-dynamic-form ng-model="vlocPrompt.documentPlaceholder.fields" class="slds-form_vertical" name="editPlaceholder" map-object="{{vlocPrompt.mapObject}}"></vlocity-dynamic-form>\n            </div>\n        </div>\n        <footer class="slds-modal__footer slds-theme_default">\n            <button class="slds-button {{vlocPrompt.button1.className}}" ng-class="{\'slds-button_brand\': !vlocPrompt.button1.className}" ng-bind="vlocPrompt.button1.label" ng-if="vlocPrompt.button1" ng-click="vlocPrompt.button1.method()"></button>\n            <button class="slds-button {{vlocPrompt.button2.className}}" ng-class="{\'slds-button_brand\': !vlocPrompt.button2.className}" ng-bind="vlocPrompt.button2.label" ng-if="vlocPrompt.button2" ng-click="vlocPrompt.button2.method()"></button>\n            <button class="slds-button {{vlocPrompt.button3.className}}" ng-class="{\'slds-button_brand\': !vlocPrompt.button3.className}" ng-bind="vlocPrompt.button3.label" ng-if="vlocPrompt.button3" ng-click="vlocPrompt.button3.method()"></button>\n            <button class="slds-button slds-button_neutral slds-m-left_small" ng-if="vlocPrompt.closeModal" ng-click="vlocPrompt.closeModal()">{{::$root.vlocity.getCustomLabel(\'Cancel\', \'Cancel\')}}</button>\n        </footer>\n    </div>\n</section>\n<style type="text/css">\n    .vlocity.via-slds .slds-modal_prompt .slds-modal__close {\n        display: block;\n    }\n    .vlocity.via-slds .vloc-modal.slds-modal {\n        bottom: auto;\n        transition: opacity 250ms ease-in;\n        opacity: 0;\n        position: absolute;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal.vloc-modal-shown {\n        opacity: 1;\n    }\n\n    .vlocity.via-slds .vloc-modal.slds-modal .vloc-modal-container .vloc-modal-content {\n        line-height: 1.4;\n    }\n\n    @media screen and (max-width: 744px) {\n        .vlocity.via-slds .vloc-modal.slds-modal {\n            top: auto;\n            height: calc(100% - 20px); /** leaving room for iPhone notification bar **/\n            bottom: -100%;\n        }\n\n        .vlocity.via-slds.platform-android .vloc-modal.slds-modal {\n            height: 100%; /** Android doesn\'t need the 20px of room like iPhone **/\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__header {\n            border-radius: 0;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close {\n            top: 0.5rem;\n            left: auto;\n            right: auto;\n            z-index: 999;\n            color: #00396B;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-left {\n            left: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__close.vloc-align-right {\n            right: 0.5rem;\n        }\n\n        .vlocity.via-slds\n        .vloc-modal.slds-modal\n        .slds-modal__footer {\n            border-radius: 0;\n        }\n    }\n</style>\n')}]);

},{}]},{},[2]);
})();

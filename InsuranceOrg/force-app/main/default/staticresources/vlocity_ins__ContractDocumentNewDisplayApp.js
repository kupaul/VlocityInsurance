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
angular.module('contractDocumentNewDisplayApp',
    ['vlocity', 'ngAnimate', 'mgcrea.ngStrap', 'ngSanitize', 'sldsangular'])
.config(['remoteActionsProvider', function(remoteActionsProvider) {
    'use strict';
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}]);

// Services
require('./modules/contractDocumentNewDisplayApp/services/attachmentFileTypes.js');
require('./modules/contractDocumentNewDisplayApp/services/BrowserDetection.js');

// Factories
require('./modules/contractDocumentNewDisplayApp/factory/ValidationErrorHandler.js');
require('./modules/contractDocumentNewDisplayApp/factory/MsieUpload.js');

// Controllers
require('./modules/contractDocumentNewDisplayApp/controller/ContractDocumentNewDisplayController.js');

// Directives
require('./modules/contractDocumentNewDisplayApp/directive/VlcLoader.js');
require('./modules/contractDocumentNewDisplayApp/directive/Dropzone.js');

// Templates
require('./modules/contractDocumentNewDisplayApp/templates/templates.js');

},{"./modules/contractDocumentNewDisplayApp/controller/ContractDocumentNewDisplayController.js":2,"./modules/contractDocumentNewDisplayApp/directive/Dropzone.js":3,"./modules/contractDocumentNewDisplayApp/directive/VlcLoader.js":4,"./modules/contractDocumentNewDisplayApp/factory/MsieUpload.js":5,"./modules/contractDocumentNewDisplayApp/factory/ValidationErrorHandler.js":6,"./modules/contractDocumentNewDisplayApp/services/BrowserDetection.js":7,"./modules/contractDocumentNewDisplayApp/services/attachmentFileTypes.js":8,"./modules/contractDocumentNewDisplayApp/templates/templates.js":9}],2:[function(require,module,exports){
angular.module('contractDocumentNewDisplayApp').controller('contractDocumentNewDisplayCtrl', function(
    $scope, $rootScope, $window, $sldsModal, $timeout, attachmentFileTypes, remoteActions, browserDetection, ValidationErrorHandler, MsieUpload, $q) {
    'use strict';
    var openSubtab, openSuccess, showTabId, refreshSuccess;
    $scope.nameSpacePrefix = '';
    $scope.contractId = '';
    $scope.sourceId = '';
    $scope.baseRequestUrl = '';
    $scope.contractActiveVersionId = '';
    $scope.defaultTemplateId = '';
	$scope.sitePrefix = '';
    if (window.nameSpacePrefix !== undefined) {
        $scope.nameSpacePrefix = window.nameSpacePrefix;
    }
    if (window.contractId !== undefined) {
        $scope.contractId = window.contractId;
    }
    if (window.sourceId !== undefined) {
        $scope.sourceId = window.sourceId;
    }
    if (window.baseRequestUrl !== undefined) {
        $scope.baseRequestUrl = window.baseRequestUrl;
    }
    if (window.contractActiveVersionId !== undefined) {
        $scope.contractActiveVersionId = window.contractActiveVersionId;
    }
    if (window.docType !== undefined) {
        $scope.autoAttachDocType = window.docType;
    }
	if (window.sitePrefix !== undefined) {
		$scope.sitePrefix = window.sitePrefix;
	}

    $rootScope.vlcLoading = false;
    $scope.fileTypes = attachmentFileTypes.fileTypes;
    $scope.versions = [];
    $scope.originalVersions = [];
    $scope.activeVersionFromDb = {};
    $scope.versionIds = [];
    $scope.versionsLoaded = false;
    $scope.actions = [];
    $scope.panels = {
        'activePanel': 0
    };
    $scope.isSforce = (typeof sforce !== 'undefined' && typeof sforce.one !== 'undefined') ? (true) : (false);
    $scope.dropzone = {};

    $scope.selectedAction = {};
    $scope.warningMessage = '';
    $scope.cancelLabel = window.cancelLabel;
    $scope.continueLabel = window.continueLabel;
    $scope.uploadWordFileLabel = window.uploadWordFileLabel;
    $scope.reconcileSuccessLabel = window.reconcileSuccessLabel;
    $scope.notWordDocument = window.notWordDocument;
    $scope.actionWarningModal = false;
    $rootScope.reconcileFileAdded = false;
    $scope.triedReconcile = false;
    $scope.uploadResponse = {};
    $scope.attachDocUrl = undefined;
    $scope.isInConsole = sforce.console.isInConsole();
    $scope.browser = browserDetection.detectBrowser();
    $scope.isSafari = ($scope.browser === 'safari') ? true : false;
    $scope.isInternetExplorer = ($scope.browser === 'msielte10' || $scope.browser === 'msiegt10') ? true : false;
    $scope.browserVersion = browserDetection.getBrowserVersion();
    $scope.headerLabels = window.headerLabels;
    $scope.labels = window.labels;
    console.log('Browser: ', $scope.browser);
    console.log('Browser Version: ', $scope.browserVersion);
    if ($scope.isInternetExplorer) {
        $scope.locationOrigin = location.protocol + '//' + location.host;
    } else {
        $scope.locationOrigin = location.origin;
    }
    $scope.accessedFromHistory = false;
    $scope.needCreateDocument = window.needCreateDocument;
    $scope.accessedFromHistory = (window.currentTime - window.serverTime > 12000) ? true : false;
    $scope.isDocXTemplate = false;
    console.log('Difference: ', window.currentTime - window.serverTime);

    function attachmentIdListener(e) {
        var dzFiles, fileName, i, iconClass, element, attachmentLoading;

        if (!$scope.isInternetExplorer && document.getElementsByClassName('dropzone')[0].dropzone) {
            dzFiles = document.getElementsByClassName('dropzone')[0].dropzone.files;
            if (dzFiles[dzFiles.length - 1]) {
                // Add click event to newly added file:
                if(dzFiles[dzFiles.length - 1].previewElement.classList.contains("canDownload")) {
                    dzFiles[dzFiles.length - 1].previewElement.getElementsByClassName('dz-details')[0]
                    .addEventListener('click', $scope.clickCallback(null, 0, e.detail));
                }
                // Add custom icon to newly added file:
                // loop through file types (data stored in service):
                fileName = dzFiles[dzFiles.length - 1].name.toLowerCase();
                // Defaults if extension isn't found:
                iconClass = ' icon-v-attachment';
                for (i = 0; i < $scope.fileTypes.length; i++) {
                    var fileExtension = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
                    if ($scope.fileTypes[i].ext === fileExtension) {
                        iconClass = ' ' + $scope.fileTypes[i].icon;
                        break;
                    }
                }
                dzFiles[dzFiles.length - 1].Id = e.detail;
                element = dzFiles[dzFiles.length - 1].previewElement;
                attachmentLoading = element.getElementsByClassName('attachment-loading')[0];
                if (attachmentLoading) {
                    attachmentLoading.remove();
                }
                element.className += iconClass;
            }
        }
        if ($rootScope.reconcileFileAdded) {
            // Add URL to iframe so Qin's check in script runs
            $scope.attachDocUrl = $scope.locationOrigin + $scope.sitePrefix + '/apex/' + $scope.nameSpacePrefix + 'DocumentGeneration?id=' + $scope.contractId;
            $scope.$apply();
        }
        window.removeEventListener('AttachmentId', attachmentIdListener);
        // Reregister Custom Event that fires once the attachment has been uploaded to SFDC:
        window.addEventListener('AttachmentId', attachmentIdListener);
    }

    // Custom Event that fires once the attachment has been uploaded to SFDC:
    window.addEventListener('AttachmentId', attachmentIdListener);

     $scope.getDefaultTemplateInfo = function() {
        var deferred = $q.defer();
        remoteActions.getDefaultTemplateInfo($scope.contractId, $scope.contractActiveVersionId).then(function(result) {
            if (result != null) {
                $scope.isDocXTemplate = (result.documentTemplateType != null && result.documentTemplateType == 'Microsoft Word .DOCX Template') ? true: false;
                $scope.defaultTemplateId = result.templateId;
            }
             deferred.resolve();
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
            deferred.reject(errorMsg);
        });
         return deferred.promise;
    };

    $scope.onPageLoad = function() {
        //console.log('$scope.needCreateDocument ' +$scope.needCreateDocument);
        $rootScope.vlcLoading = true;
        console.log('$scope.accessedFromHistory: ', $scope.accessedFromHistory);
        if ($scope.needCreateDocument === true && $scope.accessedFromHistory === false) {
            $scope.getDefaultTemplateInfo().then(function(){
                if($scope.isDocXTemplate === false){
                    console.log('WebTemplate Auto Attach document process started');
                     $scope.attachDocUrl = $scope.locationOrigin + '/apex/DocumentGeneration?id=' + $scope.contractId;
                     window.addEventListener('ContractDocumentAttachDone', function contractDocumentAttachDoneListener() {
                         remoteActions.removeCustomSetting($scope.contractId).then(function() {
                             $scope.getContractVersions();
                         }, function(error) {
                             $scope.validationErrorHandler.throwError(error);
                            });
                         window.removeEventListener('ContractDocumentAttachDone', contractDocumentAttachDoneListener);
                     });
                }
                else if($scope.isDocXTemplate === true){
                    if($scope.defaultTemplateId != '' && $scope.defaultTemplateId !== undefined){
                        console.log('DOCX Auto Attach document process started')
                        $scope.attachDocUrl = $scope.locationOrigin + '/apex/ContractDocXAutoGenerate?id=' + $scope.contractId + '&autoAttachDoc=true&'+'documentTemplateId=' + $scope.defaultTemplateId + '&autoAttachDocType=' + $scope.autoAttachDocType;
                        window.addEventListener('ContractDocXDocumentAttachDone', function contractDocumentAttachDoneListener() {
                             remoteActions.removeCustomSetting($scope.contractId).then(function() {
                                 $scope.getContractVersions();
                             }, function(error) {
                                 $scope.validationErrorHandler.throwError(error);
                                });
                             window.removeEventListener('ContractDocXDocumentAttachDone', contractDocumentAttachDoneListener);
                        });
                    }else{
                        var error = 'No Default Template Found!';
                        $scope.validationErrorHandler.throwError(error);
                    }
                }
            });
        } else {
            $scope.getContractVersions();
        }
    };

    $scope.clickCallback = function(element, index, newAttachmentId) {
        if (newAttachmentId) {
            return function() {
                window.open('/servlet/servlet.FileDownload?file=' + newAttachmentId);
            };
        } else {
            return function() {
                window.open(element.dropzone.files[index].fullPath);
            };
        }
    };

    // Set up & configuration for dropzonejs:
    $scope.createVersionDZConfig = function(version) {
        var clickableElement;
        if ($scope.isInternetExplorer) {
            clickableElement = false;
        } else if (version[$scope.nameSpacePrefix + 'Status__c'] === 'Active' && version.canAddDoc) {
            clickableElement = '.version-' + version[$scope.nameSpacePrefix + 'VersionNumber__c'] + '-browse-files';
        } else {
            clickableElement = false;
        }
        return {
            options: { // passed into the Dropzone constructor
                dictDefaultMessage: 'Drag and drop files here or click to upload',
                url: '/apex/ContractDocumentNewDisplay',
                clickable: clickableElement,
                maxFilesize: 4,
                filesizeBase: 1000
            },
            eventHandlers: {
                sending: function(file) {
                    var reader, readerResult;
                    if (file.name.length > 80) {
                        return;
                    }
                    reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function() {
                        readerResult = reader.result.substring(reader.result.indexOf('base64,') + 7);
                        vlocityUploadDocumentAttachment(readerResult, version.Id, file.name);
                    };
                },
                addedfile: function(file) {
                    // Create the remove button
                    var date = new Date(file.lastModified);
                    var dateStr, removeIcon, fileDate, loadingOverlay;
                    if (file.name.length > 80) {
                        $scope.actionWarningModal = $sldsModal({
                            title: $scope.labels.warning,
                            templateUrl: 'error-handler-modal.tpl.html',
                            content: $scope.labels.clmErrorFileNameLength,
                            html: true,
                            container: 'div.vlocity',
                            placement: 'top'
                        });
                        return;
                    }
                    // Capture the Dropzone instance as closure:
                    var _this = this;
                    if (file.status === 'added') {
                        if(version.canDownload) {
                            file.previewElement.className += ' canDownload';
                        }
                        file.previewElement.className += ' new-attachment';
                    }
                    dateStr = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear().toString().substr(2,2);
                    fileDate = Dropzone.createElement('<div class="dz-date"><span>' + dateStr + '</span></div>');
                    if (file.status === 'added') {
                        loadingOverlay = Dropzone.createElement('<div class="attachment-loading"></div>');
                        file.previewElement.appendChild(loadingOverlay);
                    }
                    // Listen to the click event
                    if (version.canDeleteDoc) {
                        removeIcon = Dropzone.createElement('<i class="icon icon-v-trash"></i>');
                        removeIcon.addEventListener('click', function(e) {
                            // Make sure the button click doesn't submit the form:
                            e.preventDefault();
                            e.stopPropagation();
                            // Remove the file preview.
                            _this.removeFile(file);
                            if (file.accepted === true) {
                                // Remove from server:
                                $scope.deleteContractDocumentAttachment(file);
                            }
                        });
                        file.previewElement.appendChild(removeIcon);
                    }
                    // Add the date to the file preview element.
                    file.previewElement.getElementsByClassName('dz-details')[0].appendChild(fileDate);
                },
                success: function(file) {
                    var activeDropzone = document.getElementsByClassName('dropzone')[0];
                    var dzFiles = document.getElementsByClassName('dropzone')[0].dropzone.files;
                    var lastThumbnail = dzFiles[dzFiles.length - 1].previewElement;
                    var loadingSvg = Dropzone.createElement(
                        '<div class="slds-spinner_container">' +
                            '<div class="slds-spinner_brand slds-spinner slds-spinner_small" role="alert">' +
                                '<span class="slds-assistive-text">Loading</span>' +
                                '<div class="slds-spinner__dot-a"></div>' +
                                '<div class="slds-spinner__dot-b"></div>' +
                            '</div>' +
                            '<span class="finishing">Finishing up...</span>' +
                        '</div>'
                    );
                    if (file.previewElement.getElementsByClassName('attachment-loading')[0]) {
                        file.previewElement.getElementsByClassName('attachment-loading')[0].appendChild(loadingSvg);
                    }
                    // Move the file thumbail to the beginning of the list:
                    activeDropzone.insertBefore(lastThumbnail, activeDropzone.children[4]);
                    lastThumbnail.className = lastThumbnail.className.replace(' new-attachment', '');
                },
                complete: function(file) {
                    // Sometimes this class doesn't get added on a very small file. Just ensuring it does:
                    file.previewElement.className += ' dz-complete';
                    if (file.name.length > 80) {
                        file.previewElement.remove();
                        return;
                    }
                }
            }
        };
    };

    // Get all contract versions, then feed the version ID into the getContractVersionAttachments remoteAction to
    // get each version's attachments.
    $scope.getContractVersions = function() {
        var i;
        //$rootScope.vlcLoading = true;

        // Get the contract versions and then get the actions and attachments:
        remoteActions.getContractVersions($scope.contractId).then(function(result) {
            $scope.originalVersions = angular.toJson(result);
            $scope.versions = result;
            $scope.panels.activePanel = -1;
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        }).then(function() {
            var attachedTemplate, createdDate, createdDateStr, modifiedDate, modifiedDateStr, documentLocked;
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            for (i = 0; i < $scope.versions.length; i++) {
                createdDate = new Date($scope.versions[i].CreatedDate);
                createdDateStr = monthNames[createdDate.getMonth()] + ' ' + createdDate.getDate() + ', ' + createdDate.getFullYear();
                modifiedDate = new Date($scope.versions[i].LastModifiedDate);
                modifiedDateStr = monthNames[modifiedDate.getMonth()] + ' ' + modifiedDate.getDate() + ', ' + modifiedDate.getFullYear();
                // Get actions
                $scope.getContractVersionDocumentActions($scope.versions[i]);
                // Get attachements
                if (i === ($scope.versions.length - 1)) {
                    //$scope.getContractVersionAttachments($scope.versions[i], true, true);
                    $scope.getContractVersionDocumentCollections($scope.versions[i], true, true);
                } else {
                    //$scope.getContractVersionAttachments($scope.versions[i], false, true);
                    $scope.getContractVersionDocumentCollections($scope.versions[i], false, true);

                }
                if ($scope.versions[i][$scope.nameSpacePrefix + 'DocumentTemplateName__c']) {
                    attachedTemplate = $scope.versions[i][$scope.nameSpacePrefix + 'DocumentTemplateName__c'] +
                        ' (Version ' + $scope.versions[i][$scope.nameSpacePrefix + 'DocumentTemplateVersion__c'] + ')';
                } else {
                    attachedTemplate = 'No Template Attached';
                }
                if ($scope.versions[i][$scope.nameSpacePrefix + 'DocumentLockedUserName__c']) {
                    documentLocked = '<li>' + '<strong>Checked Out By:</strong> ' + $scope.versions[i][$scope.nameSpacePrefix + 'DocumentLockedUserName__c'] + '</li>';
                } else {
                    documentLocked = '';
                }
                $scope.versions[i].popover = {
                    'title': $scope.versions[i].Name + ' Information',
                    'content':  '<ul>' +
                                    '<li>' + '<strong>' + $scope.headerLabels.attachedTemplate + '</strong> ' + attachedTemplate + '</li>' +
                                    '<li>' + '<strong>' + $scope.headerLabels.creationMethod + '</strong> ' + $scope.versions[i][$scope.nameSpacePrefix + 'DocumentCreationSource__c'] + '</li>' +
                                    '<li>' + '<strong>' + $scope.headerLabels.created + '</strong> ' + createdDateStr + '</li>' +
                                    '<li>' + '<strong>' + $scope.headerLabels.lastModified + '</strong> ' + modifiedDateStr + '</li>' +
                                '</ul>'
                };
                $scope.versionIds.push($scope.versions[i].Id);
            }
            console.log('Versions: ', $scope.versions);
        });
    };
    //$scope.getContractVersions();
    $scope.onPageLoad();

    $scope.manageContractTerms = function(version) {
        var url= '/apex/' + nameSpacePrefix + 'ContractTermRunTime?id='+version.Id;
        $scope.onNavigate(url,'Manage Contract Terms', 'Current Window')
    }

    $scope.getContractVersionAttachments = function(version, lastVersion, notGetActiveVersion) {
        remoteActions.getContractVersionAttachments(version.Id).then(function(result) {
            if (notGetActiveVersion) {
                version.versionAttachments = result;
                $scope.uploadResponse = {};
                $scope.panels.activePanel = 0;
                if ($scope.actionWarningModal) {
                    $scope.actionWarningModal.hide();
                }
            }
            if (lastVersion) {
                if ($scope.actionWarningModal) {
                    $scope.actionWarningModal.hide();
                }
            }
            if ($scope.isInternetExplorer && $scope.browserVersion < 10) {
                $rootScope.vlcLoading = false;
            }
            // Hide spinner once attachments are retrieved since they take the longest & are requested last:
            // $rootScope.vlcLoading = false;
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.getContractVersionDocumentCollections = function(version, lastVersion, notGetActiveVersion) {
        remoteActions.getContractVersionDocumentCollections(version.Id).then(function(result) {
            if (notGetActiveVersion) {
                version.versionAttachments = result;
                $scope.uploadResponse = {};
                $scope.panels.activePanel = 0;
                if ($scope.actionWarningModal) {
                    $scope.actionWarningModal.hide();
                }
            }
            if (lastVersion) {
                if ($scope.actionWarningModal) {
                    $scope.actionWarningModal.hide();
                }
            }
            if ($scope.isInternetExplorer && $scope.browserVersion < 10) {
                $rootScope.vlcLoading = false;
            }
            // Hide spinner once attachments are retrieved since they take the longest & are requested last:
            // $rootScope.vlcLoading = false;
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.getContractVersionDocumentActions = function(version) {
        var i;
        remoteActions.getContractVersionDocumentActions(version.Id).then(function(result) {
            version.actions = result;
            version.canAddDoc = false;
            version.canDeleteDoc = false;
            version.canDownload = true;
            for (i = 0; i < version.actions.length; i++) {
                version.actions[i].showAction = true;
                if (version.actions[i].name === 'Add') {
                    version.canAddDoc = true;
                    version.actions[i].showAction = false;
                } else if (version.actions[i].name === 'Delete') {
                    version.canDeleteDoc = true;
                    version.actions[i].showAction = false;
                } else if (version.actions[i].name === 'Disable Download') {
                    version.canDownload = false;
                    version.actions[i].showAction = false;
                } else if (version.actions[i].name.indexOf('Customize') >= 0) {
                    version.actions[i].showAction = false;
                    if ($scope.isInConsole === true && version.actions[i].name.indexOf('Console') >= 0) {
                        version.actions[i].showAction = true;
                    } else if ($scope.isInConsole === false && version.actions[i].name.indexOf('Console') < 0) {
                        version.actions[i].showAction = true;
                    }
                }
                // Add action short name:
                if (version.actions[i].name === 'Check Out To Generate') {
                    version.actions[i].shortName = 'Generate';
                } else if (version.actions[i].name === 'Check Out To Customize') {
                    version.actions[i].shortName = 'Customize';
                } else if (version.actions[i].name === 'Check Out To Customize In Console') {
                    version.actions[i].shortName = 'Customize';
                } else if (version.actions[i].name === 'Reconcile Word Doc') {
                    version.actions[i].shortName = 'Reconcile';
                } else if (version.actions[i].name === 'Create Version') {
                    version.actions[i].shortName = 'Version';
                } else {
                    version.actions[i].shortName = version.actions[i].name;
                }
            }
            version.dropzoneConfig = $scope.createVersionDZConfig(version);
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.getActiveVersion = function(triedReconcile) {
        remoteActions.getActiveVersion($scope.contractId).then(function(result) {
            var retrievedActiveVersion = new CustomEvent('retrievedActiveVersion', {
                detail: true
            });
            // Save copy of unedited data:
            $scope.activeVersionFromDb = angular.toJson(result);
            // Add active version to the beginning of the versions array:
            if (triedReconcile) {
                // Remove active version since it was previously added and needs to be updated:
                $scope.versions.splice(0, 1, result);
            } else {
                $scope.versions.unshift(result);
            }
            window.dispatchEvent(retrievedActiveVersion);
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        }).then(function() {
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            var attachedTemplate, createdDate, createdDateStr, modifiedDate, modifiedDateStr, documentLocked;
            createdDate = new Date($scope.versions[0].CreatedDate);
            createdDateStr = monthNames[createdDate.getMonth()] + ' ' + createdDate.getDate() + ', ' + createdDate.getFullYear();
            modifiedDate = new Date($scope.versions[0].LastModifiedDate);
            modifiedDateStr = monthNames[modifiedDate.getMonth()] + ' ' + modifiedDate.getDate() + ', ' + modifiedDate.getFullYear();
            // Get actions
            $scope.getContractVersionDocumentActions($scope.versions[0]);
            // Get attachements
            //$scope.getContractVersionAttachments($scope.versions[0], false, false);
            $scope.getContractVersionDocumentCollections($scope.versions[0], false, false);
            if ($scope.versions[0][$scope.nameSpacePrefix + 'DocumentTemplateName__c']) {
                attachedTemplate = $scope.versions[0][$scope.nameSpacePrefix + 'DocumentTemplateName__c'] +
                    ' (Version ' + $scope.versions[0][$scope.nameSpacePrefix + 'DocumentTemplateVersion__c'] + ')';
            } else {
                attachedTemplate = 'No Template Attached';
            }
            if ($scope.versions[0][$scope.nameSpacePrefix + 'DocumentLockedUserName__c']) {
                documentLocked = '<li>' + '<strong>Checked Out By:</strong> ' + $scope.versions[0][$scope.nameSpacePrefix + 'DocumentLockedUserName__c'] + '</li>';
            } else {
                documentLocked = '';
            }
            $scope.versions[0].popover = {
                'title': $scope.versions[0].Name + ' Information',
                'content':  '<ul>' +
                                '<li>' + '<strong> ' + $scope.headerLabels.attachedTemplate + '</strong> ' + attachedTemplate + '</li>' +
                                '<li>' + '<strong> ' + $scope.headerLabels.creationMethod + '</strong> ' + $scope.versions[0][$scope.nameSpacePrefix + 'DocumentCreationSource__c'] + '</li>' +
                                '<li>' + '<strong> ' + $scope.headerLabels.created + ' </strong> ' + createdDateStr + '</li>' +
                                '<li>' + '<strong> ' + $scope.headerLabels.lastModified + ' </strong> ' + modifiedDateStr + '</li>' +
                            '</ul>'
            };
            // Set previously active version to inactive:
            $scope.versions[1][$scope.nameSpacePrefix + 'Status__c'] = 'Inactive';
            // Get actions for previous version as it is now inactive:
            $scope.getContractVersionDocumentActions($scope.versions[1]);
            $scope.versionIds.push($scope.versions[0].Id);
        }).then(function() {
            var cachedVersions = $scope.versions;
            $scope.versions = [];
            $timeout(function() {
                $scope.versions = cachedVersions;
                $scope.panels.activePanel = 0;
            });
        });
    };

    // Delete version attachment:
    $scope.deleteContractDocumentAttachment = function(attachment) {
        $rootScope.vlcLoading = true;
        remoteActions.deleteContractDocumentAttachment(attachment.Id).then(function(result) {
            console.log('Deleted attachment "' + attachment.name + '": ', result);
            $rootScope.vlcLoading = false;
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    // Used after reconcile in order to refresh new version attachments
    $scope.getContractVersionAttachmentsAfterReconcile = function(versionId) {
        var url, element;
        //remoteActions.getContractVersionAttachments(versionId).then(function(result) {
        remoteActions.getContractVersionDocumentCollections(versionId).then(function(result) {
            console.log('getContractVersionAttachmentsAfterReconcile result: ', result);
            // This change to the version data will trigger the Dropzone directive watcher:
            $scope.versions[0].versionAttachments = result;
            $scope.versions[0].reconciledVersion = false;
            $scope.uploadResponse.responseType = 'success';
            $scope.uploadResponse.importStatus = $scope.reconcileSuccessLabel + ' ' + $scope.uploadResponse.statusMessage +
                ' <a href="' + $scope.sitePrefix + '/apex/' + $scope.nameSpacePrefix + 'ContractDocumentCreation?Id=' + $scope.versions[0].Id + '&preview=true&reconcile=true">View reconciliation details</a>.';
            if ($scope.isInConsole) {
                url = $scope.sitePrefix + '/apex/' + $scope.nameSpacePrefix + 'ContractDocumentCreation?Id=' + $scope.versions[0].Id + '&preview=true&reconcile=true';
                $scope.uploadResponse.importStatus = $scope.reconcileSuccessLabel + ' ' + $scope.uploadResponse.statusMessage +
                ' <a href="#" class="reconciliation-details-console">View reconciliation details</a>.';
                $timeout(function() {
                    console.log('setting event listener');
                    element = document.getElementsByClassName('reconciliation-details-console');
                    element[element.length - 1].addEventListener('click', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log('clicked reconciliation link', e);
                        $scope.onNavigate(url, 'Reconciliation Details');
                        if ($scope.actionWarningModal) {
                            $scope.actionWarningModal.hide();
                        }
                    });
                }, 1000);
            }
            $scope.attachDocUrl = undefined;
            $scope.triedReconcile = false;
            $rootScope.reconcileFileAdded = false;
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    // Deprecated:
    $scope.getContractDocumentActions = function() {
        remoteActions.getContractDocumentActions($scope.contractId).then(function(result) {
            $scope.actions = result;
            // console.log($scope.actions);
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    /////*** Start porting action JS functionality from Action Component ***/////
    $scope.getActionUrl = function(action) {
        if (action.openUrlIn === 'New Tab / Window') {
            window.open($scope.baseRequestUrl + action.url, '_blank');
        } else {
            window.top.location.href = $scope.baseRequestUrl + action.url;
        }
    };

    if ($scope.actions !== undefined && $scope.actions != null) {
        $scope.actionNum = $scope.actions.length;
        $scope.currentUrl = [];
        $scope.currentLabel = [];
        $scope.style = '{!style}';
        $scope.isVertical = false;
        $scope.isHorizontal = false;
        $scope.isSelect = false;
    }

    $scope.onNavigate = function(url, label, urlOpenMode) {
        if (url != null && $scope.contractId && url.indexOf('?') < 0) {
            $scope.currentUrl = url + '?id=' + $scope.contractId;
        } else {
            $scope.currentUrl = url;
        }
        $scope.currentLabel = label;
        if ($scope.isInConsole && url != null) {
            //First find the ID of the primary tab to put the new subtab in
            sforce.console.getEnclosingPrimaryTabId(openSubtab);
            $rootScope.vlcLoading = false;
        }
        //aloha
        else if (!$scope.isSforce && url != null) {
            if (urlOpenMode === 'New Tab / Window') {
                window.open($scope.baseRequestUrl + $scope.currentUrl, '_blank');
            } else {
                window.top.location.href = $scope.baseRequestUrl + $scope.currentUrl;
            }
        }
        //sf1
        else if ($scope.isSforce && url != null) {
            sforce.one.navigateToURL($scope.sitePrefix + $scope.currentUrl);
        }
    };

    openSubtab = function openSubtab(result) {
        //Now that we have the primary tab ID, we can open a new subtab in it
        var primaryTabId = result.id;
        // console.log('primary tab id' + primaryTabId);
        sforce.console.openSubtab(primaryTabId, $scope.currentUrl, true, $scope.currentLabel);
    };

    openSuccess = function openSuccess(result) {
        //Report whether we succeeded in opening the subtab
        if (result.success === true) {
            alert('subtab successfully opened');
        } else {
            alert('subtab cannot be opened');
        }
    };

    $scope.invoke = function(selectedAction) {
        $scope.selectedAction = selectedAction;
        if (!$scope.isSafari) {
            $rootScope.vlcLoading = true;
        }
        if ($scope.selectedAction.validationClassName && $scope.selectedAction.validationMethodName) {
            $scope.invokeValidation();
        } else {
            if (selectedAction.name === 'Check In') {
                selectedAction.attachDocUrl = $scope.locationOrigin + $scope.sitePrefix + '/apex/DocumentGeneration?id=' + $scope.contractId;
                window.addEventListener('ContractDocumentAttachDone', function() {
                    $scope.invokeAction();
                });
            } else {
                $scope.invokeAction();
            }
        }
    };

    $scope.invokeValidation = function() {
        var input = {}; var option = {};
        input.contextId = $scope.contractId;
        $rootScope.vlcLoading = true;
        remoteActions.invokeVOIMethod($scope.selectedAction.validationClassName, $scope.selectedAction.validationMethodName, angular.toJson(input), angular.toJson(option)).then(function(result) {
            var remoteResp = angular.fromJson(result);
            console.log('invokeVOIMethod result: ', result);
            console.log('remoteResp: ', remoteResp);
            if (remoteResp && remoteResp.Error !== 'OK') { // no access
                // console.log(remoteResp.Error);
                $scope.continueLabel = window.continueLabel;
                $rootScope.vlcLoading = false;
                $scope.actionWarningModal = $sldsModal({
                    title: $scope.labels.clmContractDocActionButtonClicked,
                    templateUrl: 'error-handler-modal.tpl.html',
                    content: remoteResp.Error,
                    html: true,
                    container: 'div.vlocity',
                    placement: 'top'
                });
            } else if (remoteResp && remoteResp.Warning) { // warning message
                $scope.warningMessage = remoteResp.Warning;
                $rootScope.vlcLoading = false;
                if ($scope.selectedAction.name.indexOf('Reconcile') > -1) {
                    $scope.continueLabel = $scope.uploadWordFileLabel;
                } else {
                    $scope.continueLabel = window.continueLabel;
                }
                //invoke modal
                $scope.actionWarningModal = $sldsModal({
                    title: $scope.labels.clmContractDocActionButtonClicked,
                    templateUrl: 'action-warning-modal.tpl.html',
                    html: true,
                    scope: $scope,
                    container: 'div.vlocity',
                    placement: 'top',
                    prefixEvent: 'actionWarningModal'
                });
            }
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.invokeAction = function() {
        var selectedAction = $scope.selectedAction;
        $scope.uploadResponse = {};
        if (!$scope.isSafari) {
            $rootScope.vlcLoading = true;
        }
        if ($scope.continueLabel === $scope.uploadWordFileLabel && document.getElementById('reconcile-word-file')) {
            document.getElementById('reconcile-word-file').click();
            $rootScope.vlcLoading = false;
        } else if (selectedAction.name === 'Continue Reconcile Word') {
            $scope.continueLabel = $scope.uploadWordFileLabel;
            $scope.triedReconcile = true;
            $scope.actionWarningModal = $sldsModal({
                title: $scope.labels.clmContractDocActionButtonClicked,
                templateUrl: 'action-warning-modal.tpl.html',
                html: true,
                scope: $scope,
                container: 'div.vlocity',
                placement: 'top',
                prefixEvent: 'actionWarningModal'
            });
            $rootScope.vlcLoading = false;
        } else {
            if (selectedAction.className && selectedAction.methodName) {
                $scope.invokeVOIMethod(selectedAction);
                if ($scope.actionWarningModal) {
                    $scope.actionWarningModal.hide();
                }
            } else {
                if (selectedAction.url) {
                    $scope.onNavigate(selectedAction.url, selectedAction.displayName, selectedAction.openUrlIn);
                    if ($scope.actionWarningModal) {
                        $scope.actionWarningModal.hide();
                    }
                } else {
                    $rootScope.vlcLoading = false;
                    $sldsModal({
                        title: $scope.labels.clmContractDocActionButtonClicked,
                        templateUrl: 'error-handler-modal.tpl.html',
                        content: 'No URL specified for selected Action.',
                        html: true,
                        container: 'div.vlocity',
                        placement: 'top'
                    });
                }
            }
        }
    };

    $scope.invokeVOIMethod = function(selectedAction) {
        var remoteResp, finishedInvokeVoiMethod;
        var input = {};
        var option = {};
        input.contextId = $scope.contractId;
        if (selectedAction.stateTransitionId) {
            input.stateTransitionId = selectedAction.stateTransitionId;
        }
        remoteActions.invokeVOIMethod(selectedAction.className, selectedAction.methodName, angular.toJson(input), angular.toJson(option)).then(function(result) {
            remoteResp = angular.fromJson(result);
            if (remoteResp && remoteResp.Error !== 'OK') {
                $rootScope.vlcLoading = false;
                $sldsModal({
                    title: $scope.labels.clmContractDocActionButtonClicked,
                    templateUrl: 'error-handler-modal.tpl.html',
                    content: remoteResp.Error,
                    html: true,
                    container: 'div.vlocity',
                    placement: 'top'
                });
            } else {
                if (selectedAction.url) {
                    $scope.onNavigate(selectedAction.url, selectedAction.displayName, selectedAction.openUrlIn);
                    if ($scope.actionWarningModal) {
                        $scope.actionWarningModal.hide();
                    }
                } else if ($scope.continueLabel !== $scope.uploadWordFileLabel) {
                    $scope.refreshContractPage();
                    if ($scope.actionWarningModal) {
                        $scope.actionWarningModal.hide();
                    }
                } else {
                    finishedInvokeVoiMethod = new CustomEvent('finished-invoke-voi-method', {
                        detail: true
                    });
                    console.log('Finished with invokeVOIMethod.');
                    window.dispatchEvent(finishedInvokeVoiMethod);
                    console.log('fired finished-invoke-voi-method event');
                }
            }
        }, function(error) {
            $scope.validationErrorHandler.throwError(error);
        });
    };

    $scope.browseMsieFiles = function(version) {
        return MsieUpload.browseMsieFiles(version);
    };

    $scope.uploadMsieFile = function(files, version) {
        return MsieUpload.uploadMsieFile(files, version);
    };

    $scope.uploadFile = function(files) {
        var cachedFile = files[0]; // Cache file for use after docx check
        var reader = new FileReader(); // Reader for docx & contract check
        console.log(JSON.stringify(files[0], null, '\t'));
        console.log('File name: ', files[0].name);
        console.log('File type: ', files[0].type);
        // If this isn't a Word document, stop:
        if (!$scope.isInternetExplorer && files[0].type.indexOf('vnd.openxmlformats-officedocument.wordprocessingml') === -1) {
            $scope.uploadResponse.responseType = 'error';
            $scope.uploadResponse.importStatus =
                $scope.notWordDocument + ' The file type is \'<em>' + files[0].type + '</em>\' which is not the correct type for Microsoft Word .docx format.';
            $scope.$apply();
            console.log('File does not have proper .docx file type.');
        } else if (files[0].name.indexOf('.docx') === -1) {
            $scope.uploadResponse.responseType = 'error';
            $scope.uploadResponse.importStatus =
                $scope.notWordDocument + ' The file name is \'<em>' + files[0].name + '</em>\' which does not contain the proper Microsoft Word .docx extension.';
            $scope.$apply();
            console.log('File does not have proper .docx file type.');
        } else {
            $rootScope.reconcileFileAdded = true;
            $rootScope.vlcLoading = true;
            if (!$scope.isInternetExplorer) {
                $scope.$apply();
            }
            $scope.invokeVOIMethod($scope.selectedAction);
            window.addEventListener('finished-invoke-voi-method', function finishedInvokeVoiMethod() {
                console.log('Observed finished-invoke-voi-method event');
                reader.readAsArrayBuffer(files[0]);
                reader.onload = function() {
                    var fileContents, styleFileContents, wordDocContentsMap;
                    var zip = new JSZip(reader.result);
                    var file = zip.file('word/document.xml');
                    var styleFile = zip.file('word/styles.xml');
                    if (file != null && styleFile != null) {
                        fileContents = file.asText();
                        styleFileContents = styleFile.asText();
                        wordDocContentsMap = {
                            contractId: $scope.sourceId,
                            wordDocContents: fileContents,
                            styleContents: styleFileContents
                        };
                        console.log('wordDocContentsMap: ', wordDocContentsMap);
                        remoteActions.handleWordDocImport(wordDocContentsMap).then(function(result) {
                            var newReader, readerResult;
                            console.log('handleWordDocImport result: ', result);
                            $scope.uploadResponse = result;
                            if ($scope.uploadResponse.responseType === 'regular') {
                                $scope.cancelLabel = 'Close';
                                newReader = new FileReader();
                                newReader.readAsDataURL(cachedFile);
                                newReader.onload = function() {
                                    readerResult = newReader.result.substring(newReader.result.indexOf('base64,') + 7);
                                    $timeout(function() {
                                        console.log('Getting new active version.');
                                        $scope.getActiveVersion($scope.triedReconcile);
                                        window.addEventListener('retrievedActiveVersion', function retrievedActiveVersion(e) {
                                            console.log('Listened for and heard retrievedActiveVersion event. Calling vlocityUploadDocumentAttachment()', e);
                                            vlocityUploadDocumentAttachment(readerResult, $scope.uploadResponse.contractVersionId, 'Reco_' + cachedFile.name);
                                            console.log('Just called vlocityUploadDocumentAttachment to attach document to version.');
                                            window.removeEventListener('retrievedActiveVersion', retrievedActiveVersion);
                                        });
                                        // Custom Event that fires once the attachment has been uploaded to SFDC:
                                        window.addEventListener('AttachmentId', attachmentIdListener);
                                        // Listening to see when document has finished being checked in:
                                        window.addEventListener('ContractDocumentAttachDone', function contractDocumentAttachDone() {
                                            $scope.activeVersionFromDb = angular.fromJson($scope.activeVersionFromDb);
                                            if (!angular.equals({}, $scope.activeVersionFromDb)) {
                                                remoteActions.checkInDocument($scope.activeVersionFromDb).then(function() {
                                                    $scope.versions[0].reconciledVersion = true;
                                                    $scope.getContractVersionAttachmentsAfterReconcile($scope.activeVersionFromDb.Id);
                                                }, function(error) {
                                                    $scope.validationErrorHandler.throwError(error);
                                                });
                                            }
                                            window.removeEventListener('ContractDocumentAttachDone', contractDocumentAttachDone);
                                        });
                                    }, 200);
                                };
                            } else if ($scope.uploadResponse.responseType === 'error' && $scope.selectedAction.name !== 'Continue Reconcile Word') {
                                $rootScope.reconcileFileAdded = false;
                                if (!$scope.triedReconcile) {
                                    $scope.getActiveVersion($scope.triedReconcile);
                                    $scope.panels.activePanel = -1;
                                    $scope.triedReconcile = true;
                                } else {
                                    $rootScope.vlcLoading = false;
                                }
                            } else {
                                $rootScope.vlcLoading = false;
                                $rootScope.reconcileFileAdded = false;
                            }
                        }, function(error) {
                            $scope.validationErrorHandler.throwError(error);
                            $scope.actionWarningModal.hide();
                            $rootScope.reconcileFileAdded = false;
                            $scope.uploadResponse = {};
                        });
                    }
                };
                window.removeEventListener('finished-invoke-voi-method', finishedInvokeVoiMethod);
            });
        }
        return $scope.uploadResponse;
    };

    // Whenever action modal closes, reset all applicable data:
    $scope.$on('actionWarningModal.hide', function() {
        console.log('Action warning modal hidden.');
        $scope.uploadResponse = {};
        $rootScope.reconcileFileAdded = false;
        $scope.continueLabel = window.continueLabel;
        $scope.cancelLabel = window.cancelLabel;
    });

    $scope.refreshContractPage = function() {
        if ($scope.isSforce && $scope.isInConsole) {
            //First find the ID of the primary tab to put the new subtab in
            $scope.refreshCurrentPrimaryTab();
        } else {
            if (!$scope.isSforce) {
                window.top.location.href = $scope.baseRequestUrl + $scope.sourceId;
            } else {
                sforce.one.navigateToURL($scope.baseRequestUrl + $scope.sourceId);
            }
        }
    };

    $scope.refreshCurrentPrimaryTab = function() {
        sforce.console.getFocusedPrimaryTabId(showTabId);
    };

    showTabId = function showTabId(result) {
        var tabId = result.id;
        //alert('Primary Tab IDs: primaryTabId ' + tabId );
        sforce.console.refreshPrimaryTabById(tabId, true, refreshSuccess);
    };

    refreshSuccess = function refreshSuccess(result) {
        //Report whether refreshing the primary tab was successful
        if (result.success === true) {
            //alert('Primary tab refreshed successfully');
        } else {
            //alert('Primary did not refresh');
        }
    };
    /////*** End porting action JS functionality from Action Component ***/////

    // Instantiating ValidationErrorHandler Factory:
    $scope.validationErrorHandler = new ValidationErrorHandler();

});

},{}],3:[function(require,module,exports){
angular.module('contractDocumentNewDisplayApp').directive('dropzone', function($rootScope, attachmentFileTypes) {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var fileTypes = attachmentFileTypes.fileTypes;
            var config, myDropzone, attachments, i, j, k, mockFile, fileType, iconClass, fileName, imagePath, attachmentsLength, namespacePrefix;

            if (scope.isInternetExplorer && scope.browserVersion < 10) {
                return;
            }

            scope.$watch('versions', function(newValue) {
                var l;
                config = newValue[scope[attrs.dropzone]].dropzoneConfig;
                attachments = newValue[scope[attrs.dropzone]].versionAttachments;
                namespacePrefix = scope.$parent.nameSpacePrefix;
                // This is for MSIE when uploading a file since dropzone upload/drag and drop doesn't work
                if (scope.isInternetExplorer && newValue[scope[attrs.dropzone]].msieDzRefresh) {
                    attachmentsLength = element[0].getElementsByClassName('dz-preview').length;
                    if (element[0].dropzone !== undefined) {
                        element[0].dropzone = undefined;
                    }
                    if (attachmentsLength) {
                        for (l = 0; l < attachmentsLength; l++) {
                            element[0].removeChild(element[0].getElementsByClassName('dz-preview')[0]);
                        }
                    }
                    scope[attrs.dropzone].msieDzRefresh = false;
                }
                // End MSIE customization
                if ($rootScope.reconcileFileAdded === false && newValue && config && attachments && element[0].dropzone === undefined) {
                    // create a Dropzone for the element with the given options, and do not instantiate
                    // new Dropzone on latest version after reconciling document until latest checked in
                    // document has been added:

                    if (newValue[scope[attrs.dropzone]].reconciledVersion === false ||
                        newValue[scope[attrs.dropzone]].reconciledVersion === undefined) {

                        myDropzone = new Dropzone(element[0], config.options);
                        // bind the given event handlers
                        angular.forEach(config.eventHandlers, function(handler, event) {
                            myDropzone.on(event, handler);
                        });
                        if (attachments.length) {
                            // loop through attachments:
                            for (i = 0; i < attachments.length; i++) {
                                //fileName = attachments[i].Name.toLowerCase();
                                fileName = attachments[i][namespacePrefix + 'DocumentTitle__c'];
                                // Defaults if extension isn't found:
                                fileType = 'text/plain';
                                iconClass = 'icon-v-attachment';
                                // loop through file types (data stored in service):
                                for (k = 0; k < fileTypes.length; k++) {
                                    var fileExtension = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
                                    if (fileTypes[k].ext === fileExtension) {
                                        fileType = fileTypes[k].type;
                                        iconClass = fileTypes[k].icon;
                                        break;
                                    }
                                }
                                //imagePath = '/servlet/servlet.FileDownload?file=' + attachments[i].Id;
                                if (attachments[i][namespacePrefix + 'AttachmentId__c']) {
                                    imagePath = scope.$parent.sitePrefix + '/servlet/servlet.FileDownload?file=' + attachments[i][namespacePrefix + 'AttachmentId__c'];
                                } else if (attachments[i][namespacePrefix + 'ContentVersionId__c']) {
                                    imagePath = scope.$parent.sitePrefix + '/sfc/servlet.shepherd/version/download/' + attachments[i][namespacePrefix + 'ContentVersionId__c'];
                                } else {
                                    imagePath = attachments[i][namespacePrefix + 'DocumentLink__c'];
                                }
                                mockFile = {
                                    name: fileName, //attachments[i].Name,
                                    size: attachments[i][namespacePrefix + 'DocumentSize__c'],//attachments[i].BodyLength,
                                    type: fileType,
                                    lastModified: attachments[i][namespacePrefix + 'DocumentModifiedDate__c'] !== null && attachments[i][namespacePrefix + 'DocumentModifiedDate__c'] !== undefined ?
                                                    attachments[i][namespacePrefix + 'DocumentModifiedDate__c'] : attachments[i].LastModifiedDate,//attachments[i].LastModifiedDate,
                                    accepted: true,
                                    fullPath: imagePath,
                                    Id: attachments[i].Id
                                };
                                myDropzone.emit('addedfile', mockFile);
                                myDropzone.emit('processing', mockFile);
                                if (fileType.indexOf('image') > -1) {
                                    myDropzone.options.thumbnail.call(myDropzone, mockFile, imagePath);
                                    myDropzone.emit('thumbnail', mockFile, imagePath);
                                }
                                myDropzone.emit('complete', mockFile);
                                mockFile.previewElement.classList.add(iconClass);
                                myDropzone.files.push(mockFile);
                            }
                        }
                        if (!$rootScope.reconcileFileAdded) {
                            $rootScope.vlcLoading = false;
                        }
                        // Setting up click event on thumbnails so file opens in new tab:
                        for (j = 0; j < element[0].dropzone.files.length; j++) {
                            if(newValue[scope[attrs.dropzone]].canDownload){
                                element[0].dropzone.files[j].previewElement.getElementsByClassName('dz-details')[0].addEventListener('click', scope.clickCallback(element[0], j));
                            }
                        }
                        if (config.options.clickable === false) {
                            myDropzone.disable();
                        }
                    }
                }
            }, true);
        }
    };
});

},{}],4:[function(require,module,exports){
angular.module('contractDocumentNewDisplayApp').directive('vlcLoader', function() {
    'use strict';
    return {
        restrict: 'E',
        templateNamespace: 'svg',
        replace: true,
        template:
        '<svg x="0px" y="0px" width="28" height="28" viewBox="0 0 48 48">' +
            '<g width="48" height="48">' +
                '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="0.75s" repeatCount="indefinite"/>' +
                '<path fill="#dedede" d="M24,45C12.4,45,3,35.6,3,24S12.4,3,24,3V0l0,0C10.7,0,0,10.7,0,24c0,13.3,10.7,24,24,24V45z"/>' +
                '<path fill="#05a6df" d="M24,3c11.6,0,21,9.4,21,21s-9.4,21-21,21v3l0,0c13.3,0,24-10.7,24-24C48,10.7,37.3,0,24,0V3z"/>' +
            '</g>' +
        '</svg>',
        scope: {
            stroke: '@'
        }
    };
});

},{}],5:[function(require,module,exports){
angular.module('contractDocumentNewDisplayApp').factory('MsieUpload', ['$rootScope', '$timeout', 'remoteActions', 'ValidationErrorHandler',
    function($rootScope, $timeout, remoteActions, ValidationErrorHandler) {
    'use strict';
    // This Factory is for uploading files using OOB JS FileReader and not Dropzone (which does not work in IE):
    var MsieUpload = {};
    var nameSpacePrefix = window.nameSpacePrefix;
    var validationErrorHandler = new ValidationErrorHandler();

    MsieUpload.browseMsieFiles = function(version) {
        document.getElementById('version-' + version[nameSpacePrefix + 'VersionNumber__c'] + '-msie-select-file').click();
    };

    MsieUpload.uploadMsieFile = function(files, version) {
        var reader = new FileReader();
        $rootScope.vlcLoading = true;
        reader.readAsDataURL(files[0]);
        reader.onload = function() {
            var readerResult = reader.result.substring(reader.result.indexOf('base64,') + 7);
            $timeout(function() {
                vlocityUploadDocumentAttachment(readerResult, version.Id, files[0].name);
            }, 200);
        };

        window.addEventListener('AttachmentId', function() {
            remoteActions.getContractVersionAttachments(version.Id).then(function(result) {
                version.versionAttachments = result;
                version.msieDzRefresh = true;
            }, function(error) {
                validationErrorHandler.throwError(error);
            });
        });
    };

    return MsieUpload;
}]);

},{}],6:[function(require,module,exports){
angular.module('contractDocumentNewDisplayApp').factory('ValidationErrorHandler', function(remoteActions, $sldsModal, $rootScope) {
    'use strict';
    var ValidationErrorHandler = function() {
        this.initialize = function() {
            // anything that immediately should fire upon instantiation
        };

        // Error handling helper:
        this.throwError = function(error) {
            var statusCode;
            if (!error.message) {
                error.message = 'No error message.';
            }
            if (error.statusCode) {
                statusCode = '(' + error.statusCode + '): ';
            }
            if (typeof error.type === 'string') {
                error.type = error.type.capitalizeFirstLetter() + ' ';
            }
            if (error.message.indexOf('Logged in?') > -1) {
                error.message = 'You have been logged out of Salesforce. Please back up any changes to your document and refresh your browser window to login again.';
                error.type = '';
                statusCode = '';
            }
            $sldsModal({
                title: 'There Has Been An Error',
                templateUrl: 'error-handler-modal.tpl.html',
                content: error.type + statusCode + error.message,
                html: true,
                container: 'div.vlocity',
                placement: 'center'
            });
            $rootScope.vlcLoading = false;
        };

        // Adding to String prototype:
        String.prototype.capitalizeFirstLetter = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        // Initialize
        this.initialize();
    };
    return (ValidationErrorHandler);
});

},{}],7:[function(require,module,exports){
(function() {
    'use strict';
    window.angular.module('contractDocumentNewDisplayApp').service('browserDetection', ['$window', function($window) {
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
                    if (version && versionSearch[i].before) {
                        version = parseFloat(version.substr(0, version.indexOf(versionSearch[i].before)));
                    }
                }
            }

            return version;
        };
    }]);
}());

},{}],8:[function(require,module,exports){
(function() {
    'use strict';
    window.angular.module('contractDocumentNewDisplayApp').service('attachmentFileTypes', function() {
        this.fileTypes = [{
                'ext': 'pdf',
                'not': '',
                'type': 'application/pdf',
                'icon': 'icon-v-file-psd'
            }, {
                'ext': 'docx',
                'not': '',
                'type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'icon': 'icon-v-file-word'
            }, {
                'ext': 'doc',
                'not': 'docx',
                'type': 'application/msword',
                'icon': 'icon-v-file-word'
            }, {
                'ext': 'xlsx',
                'not': '',
                'type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'icon': 'icon-v-file-excel'
            }, {
                'ext': 'xls',
                'not': 'xlsx',
                'type': 'application/vnd.ms-excel',
                'icon': 'icon-v-file-excel'
            }, {
                'ext': 'pptx',
                'not': '',
                'type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'icon': 'icon-v-file-powerpoint'
            }, {
                'ext': 'ppt',
                'not': 'pptx',
                'type': 'application/vnd.ms-powerpoint',
                'icon': 'icon-v-file-powerpoint'
            }, {
                'ext': 'jpg',
                'not': '',
                'type': 'image/jpeg',
                'icon': 'no-icon'
            }, {
                'ext': 'jpeg',
                'not': '',
                'type': 'image/jpeg',
                'icon': 'no-icon'
            }, {
                'ext': 'png',
                'not': '',
                'type': 'image/png',
                'icon': 'no-icon'
            }, {
                'ext': 'gif',
                'not': '',
                'type': 'image/gif',
                'icon': 'no-icon'
            }];
    });
}());

},{}],9:[function(require,module,exports){
angular.module("contractDocumentNewDisplayApp").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("version-info-popover.tpl.html",'<div class="popover" tabindex="-1">\n    <div class="arrow"></div>\n    <h3 class="popover-title" ng-bind-html="version.popover.title" ng-show="version.popover.title"></h3>\n    <div class="popover-content" ng-bind-html="version.popover.content"></div>\n</div>\n'),$templateCache.put("action-warning-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium slds-m-bottom_none" ng-bind-html="title">{{labels.warning}}</h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <div class="slds-notify_container">\n                    <div class="slds-notify slds-notify_alert slds-theme_alert-texture" role="alert" ng-hide="uploadResponse.responseType === \'success\' || triedReconcile || selectedAction.name === \'Continue Reconcile Word\'">\n                        <span class="slds-assistive-text">{{labels.warning}}</span>\n                        <h2>{{warningMessage}}</h2>\n                    </div>\n                    <div class="slds-notify slds-notify_alert slds-theme_alert-texture" role="alert" ng-hide="continueLabel !== uploadWordFileLabel || uploadResponse.responseType === \'regular\' || uploadResponse.responseType === \'success\'" ng-show="uploadResponse.responseType !== \'regular\' || uploadResponse.responseType !== \'success\' || selectedAction.name === \'Continue Reconcile Word\'">\n                        <span class="slds-assistive-text">{{labels.warning}}</span>\n                        <h2>{{labels.clmReconcileDocPlsUploadWord}}</h2>\n                    </div>\n                    <div class="slds-notify slds-notify_alert slds-theme_alert-texture" role="alert" ng-show="uploadResponse.responseType === \'regular\'">\n                        <span class="slds-assistive-text">{{labels.warning}}</span>\n                        <h2 ng-bind-html="uploadResponse.importStatus"></h2>\n                    </div>\n                    <div class="slds-notify slds-notify_alert slds-theme_alert-texture" role="alert" ng-show="uploadResponse.responseType === \'error\'">\n                        <span class="slds-assistive-text">{{labels.warning}}</span>\n                        <h2 ng-bind-html="uploadResponse.importStatus"></h2>\n                    </div>\n                    <div class="slds-notify slds-notify_alert slds-theme_alert-texture" role="alert" ng-show="uploadResponse.responseType === \'success\'">\n                        <span class="slds-assistive-text">{{labels.warning}}</span>\n                        <h2 ng-bind-html="uploadResponse.importStatus"></h2>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button ng-hide="reconcileFileAdded" type="button" class="slds-button slds-button_neutral modal-cancel-btn" ng-click="$hide()">{{cancelLabel}}</button>\n            <button ng-hide="uploadResponse.responseType === \'success\' || reconcileFileAdded" type="button" class="slds-button slds-button_brand modal-continue-btn" ng-click="invokeAction();">{{continueLabel}}</button>\n            <div class="word-file-processing" ng-show="reconcileFileAdded">\n                <span class="finishing">{{labels.clmReconcileDocProcessingFile}}</span>\n                <div class="slds-spinner_brand slds-spinner slds-spinner_small" role="alert">\n                    <span class="slds-assistive-text">{{labels.loading}}</span>\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n            <input id="reconcile-word-file" type="file" name="file" onchange="angular.element(this).scope().uploadFile(this.files)" ng-model="model1" style="display: none" />\n        </div>\n    </div>\n</div>\n'),$templateCache.put("error-handler-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium" ng-bind-html="title">{{modalLabels.CLMTemplateDeleteSection}}</h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <div class="slds-notify_container">\n                    <div class="slds-notify slds-notify_alert slds-theme_error slds-theme_alert-texture" role="alert">\n                        <span class="slds-assistive-text">Error</span>\n                        <h2>\n                            <slds-svg-icon sprite="\'utility\'" icon="\'ban\'" size="\'small\'" extra-classes="\'slds-m-right_x-small\'"></slds-svg-icon>\n                            {{content}}\n                        </h2>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral modal-close-btn" ng-click="$hide()">Close</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n')}]);

},{}]},{},[1]);
})();

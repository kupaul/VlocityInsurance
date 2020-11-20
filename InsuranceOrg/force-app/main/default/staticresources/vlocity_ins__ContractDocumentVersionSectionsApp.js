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
var contractDocumentVersionSectionsApp = angular.module('contractDocumentVersionSectionsApp', ['vlocity', 'mgcrea.ngStrap',
    'ngSanitize', 'ngAnimate', 'angularUtils.directives.dirPagination'
]).config(['remoteActionsProvider', function(remoteActionsProvider) {
    'use strict';
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}]);

// Services
require('./modules/contractDocumentVersionSectionsApp/services/BrowserDetection.js');

// Controllers
require('./modules/contractDocumentVersionSectionsApp/controller/ContractVersionController.js');

// Directives
require('./modules/contractDocumentVersionSectionsApp/directive/VlcLoader.js');

// Templates
require('./modules/contractDocumentVersionSectionsApp/templates/templates.js');

},{"./modules/contractDocumentVersionSectionsApp/controller/ContractVersionController.js":2,"./modules/contractDocumentVersionSectionsApp/directive/VlcLoader.js":3,"./modules/contractDocumentVersionSectionsApp/services/BrowserDetection.js":4,"./modules/contractDocumentVersionSectionsApp/templates/templates.js":5}],2:[function(require,module,exports){
angular.module('contractDocumentVersionSectionsApp').controller('contractDocumentVersionCtrl', function($scope, remoteActions, browserDetection, $filter, $q, $modal) {
    'use strict';
    $scope.nameSpacePrefix = '';
    $scope.contractVersionId = '';
    $scope.editPageUrl = '';
    if (window.nameSpacePrefix !== undefined) {
        $scope.nameSpacePrefix = window.nameSpacePrefix;
    }
    if (window.contractVersionId !== undefined) {
        $scope.contractVersionId = window.contractVersionId;
    }
    if (window.editSectionPage !== undefined) {
        $scope.editPageUrl = window.editSectionPage;
    }
    $scope.vlcLoading = true;
    $scope.activeTemplates = true;
    $scope.canEditVersion = false;
    $scope.showSuccessMessage = false;
    $scope.showRemovedMessage = false;
    $scope.validationMessage = {
        'type': 'alert-success',
        'content': '',
        'error': false
    };
    $scope.versionData = {
        'sections': []
    };
    $scope.originalSections = {};
    $scope.initialTemplateOption = {
        templateLabel: 'Select a Template'
    };
    $scope.versionLoadedData = {};
    $scope.contractTemplates = [];
    $scope.templateAttached = false;
    $scope.currentAttachedTemplate = false;
    $scope.availableTemplatesLabel = 'Available Templates';
    $scope.versionUrl = document.referrer.split('?')[0];
    $scope.newVersionId = '';
    $scope.isConsole = window.isInConsole;
    $scope.browser = browserDetection.detectBrowser();
    $scope.isSafari = ($scope.browser === 'safari') ? true : false;
    $scope.isInternetExplorer = ($scope.browser === 'msielte10' || $scope.browser === 'msiegt10') ? true : false;
    $scope.browserVersion = browserDetection.getBrowserVersion();
    console.log('Browser: ', $scope.browser);
    console.log('Browser Version: ', $scope.browserVersion);

    // Called when page loads:
    $scope.init = function() {
        var newUrl;
        // Show success message (after remote action) if attachedTemplate URL param is true:
        if (document.referrer.split('attachedTemplate=')[1] === 'true') {
            $scope.showSuccessMessage = true;
        }
        // Show remove message (after remote action) if removedTemplate URL param is true:
        if (document.referrer.split('removedTemplate=')[1] === 'true') {
            $scope.showRemovedMessage = true;
            newUrl = $scope.removeParam('removedTemplate', document.referrer);
        }
    };

    // Boolean to decide whether or not to show or hide the buttons/drop-down:
    $scope.canEditContractVersion = function() {
        remoteActions.canEditContractVersion($scope.contractVersionId).then(function(result) {
            $scope.canEditVersion = result;
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };
    $scope.canEditContractVersion();

    // Need to cache already attached template data:
    $scope.getContractSectionsForVersion = function() {
        remoteActions.getContractSectionsForVersion($scope.contractVersionId).then(function(result) {
            $scope.versionLoadedData = result;
            console.log($scope.versionLoadedData);
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };
    $scope.getContractSectionsForVersion();

    // Get list of templates from the server and customize an array of objects for our select
    // dropdown. Then automatically select the default as "Select a Template"
    $scope.getTemplateList = function() {
        var selectedTemplateLabel, selectedTemplate, i, j, temporaryObj, temporaryVersion;
        remoteActions.getTemplateList($scope.contractVersionId).then(function(result) {
            var isTemplatePresentInList = false;
            if ($scope.versionLoadedData.documentVersionObj[$scope.nameSpacePrefix + 'DocumentTemplateId__c']) {
                selectedTemplateLabel = $scope.versionLoadedData.documentVersionObj[$scope.nameSpacePrefix + 'DocumentTemplateName__c'] + ' (version ' +
                $scope.versionLoadedData.documentVersionObj[$scope.nameSpacePrefix + 'DocumentTemplateVersion__c'] + ')';
                selectedTemplate = {
                    templateGroup: 'Attached Template',
                    templateId: $scope.versionLoadedData.documentVersionObj[$scope.nameSpacePrefix + 'DocumentTemplateId__c'],
                    templateVersion: $scope.versionLoadedData.documentVersionObj[$scope.nameSpacePrefix + 'DocumentTemplateVersion__c'],
                    templateLabel: selectedTemplateLabel
                };
            }
            $scope.versionData.template = selectedTemplate;
            console.log(result);
            $scope.contractTemplates.push($scope.initialTemplateOption);
            if (result !== null) {
                for (i = 0; i < result.length; i++) {
                    temporaryVersion = result[i][$scope.nameSpacePrefix + 'VersionNumber__c'];
                    temporaryObj = {
                        templateLabel: result[i].Name + ' (version ' + temporaryVersion + ')',
                        templateVersion: temporaryVersion,
                        templateId: result[i].Id,
                        templateGroup: $scope.availableTemplatesLabel
                    };
                    $scope.contractTemplates.push(temporaryObj);
                }
            } else {
                $scope.activeTemplates = false;
            }
            // Check which template to select and sections to show on page load:
            if ($scope.versionLoadedData.documentVersionObj[$scope.nameSpacePrefix + 'DocumentTemplateId__c']) {
                for (j = 0; j < $scope.contractTemplates.length; j++) {
                    if ($scope.contractTemplates[j].templateId === $scope.versionLoadedData.documentVersionObj[$scope.nameSpacePrefix + 'DocumentTemplateId__c']) {
                        isTemplatePresentInList = true;
                        $scope.versionData.template = $scope.contractTemplates[j];
                        $scope.contractTemplates[j].templateGroup = 'Attached Template';
                        $scope.templateAttached = true;
                    }
                }
            } else {
                // If there is no template ID, then we just show the default "Select a Template" in the dropdown:
                $scope.versionData.template = $scope.contractTemplates[0];
            }
            if (!isTemplatePresentInList && $scope.versionLoadedData.documentVersionObj[$scope.nameSpacePrefix + 'DocumentTemplateId__c']) {
                $scope.contractTemplates.push(selectedTemplate);
                $scope.templateAttached = true;
            }
            console.log('Template attached: ' + $scope.templateAttached);
            console.log($scope.contractTemplates);
            $scope.vlcLoading = false;
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };
    $scope.getTemplateList();

    // Watch for changes to the select dropdown model so section data can refresh in the table
    $scope.$watch('versionData.template', function(newValue, oldValue) {
        if ($scope.showRemovedMessage) {
            $scope.validationMessage.type = 'alert-success';
            $scope.validationMessage.content = 'Successfully Removed Template from Contract Version.';
            $scope.showSuccessMessage = false;
        }
        if ($scope.activeTemplates === false) {
            $scope.validationMessage.type = 'alert-warning';
            $scope.validationMessage.content = 'There are no active Document Templates to attach. Please activate at least one template.';
            $scope.activeTemplates = false;
        }
        if (newValue && !newValue.templateId) {
            $scope.currentAttachedTemplate = true;
        }
        if (angular.equals(newValue, oldValue) === false && newValue.templateId) {
            $scope.validationMessage.content = '';
            $scope.validationMessage.error = false;
            $scope.createContractSectionsforVersion(newValue);
        }
    });

    // Assign sections of the selected template into a scope variable to loop through and create table
    $scope.createContractSectionsforVersion = function(currentTemplate) {
        var i, temporaryContentAttached, htmlTagRegexAttached, temporaryObjAttached;
        $scope.vlcLoading = true;
        $scope.versionData.sections = [];
        // Load the data from the cached $scope.versionLoadedData if we are showing the attached template
        // because this data reflects any edits made to the sections and not the stored section data in
        // the template:
        if (currentTemplate.templateGroup === 'Attached Template') {
            htmlTagRegexAttached = /(<([^>]+)>)/ig;
            for (i = 0; i < $scope.versionLoadedData.documentSectionObjs.length; i++) {
                temporaryContentAttached = $scope.versionLoadedData.documentSectionObjs[i][$scope.nameSpacePrefix + 'SectionContent__c'];
                if (temporaryContentAttached) {
                    temporaryContentAttached = temporaryContentAttached.replace(htmlTagRegexAttached, '');
                }
                temporaryObjAttached = {
                    sectionName: $scope.versionLoadedData.documentSectionObjs[i].Name,
                    sectionType: $scope.versionLoadedData.documentSectionObjs[i][$scope.nameSpacePrefix + 'Type__c'],
                    sectionContent: temporaryContentAttached
                };
                $scope.versionData.sections.push(temporaryObjAttached);
                if ($scope.showSuccessMessage) {
                    $scope.validationMessage.type = 'alert-success';
                    $scope.validationMessage.content = 'Successfully Attached Template to Contract Version.';
                    $scope.showSuccessMessage = false;
                }
            }
            $scope.showEditSectionsButton();
            $scope.vlcLoading = false;
        } else if (currentTemplate.templateLabel === $scope.initialTemplateOption.templateLabel) {
            $scope.showEditSectionsButton();
            $scope.vlcLoading = false;
        } else {
            remoteActions.createContractSectionsforVersion($scope.versionData.template.templateId, $scope.contractVersionId).then(function(result) {
                var i, temporaryObj, temporaryContent;
                var htmlTagRegex = /(<([^>]+)>)/ig;
                $scope.originalSections = result;
                console.log($scope.originalSections);
                console.log($scope.versionData);
                for (i = 0; i < result.documentSectionObjs.length; i++) {
                    temporaryContent = result.documentSectionObjs[i][$scope.nameSpacePrefix + 'SectionContent__c'];
                    if (temporaryContent) {
                        temporaryContent = temporaryContent.replace(htmlTagRegex, '');
                    }
                    temporaryObj = {
                        sectionName: result.documentSectionObjs[i].Name,
                        sectionType: result.documentSectionObjs[i][$scope.nameSpacePrefix + 'Type__c'],
                        sectionContent: temporaryContent
                    };
                    $scope.versionData.sections.push(temporaryObj);
                }
                $scope.showEditSectionsButton();
                $scope.vlcLoading = false;
            }, function(error) {
                $scope.validationErrorHandler(error);
            });
        }
    };

    $scope.showEditSectionsButton = function() {
        var attachedTemplateId, i;
        for (i = 0; i < $scope.contractTemplates.length; i++) {
            if ($scope.contractTemplates[i].templateGroup && $scope.contractTemplates[i].templateGroup === 'Attached Template') {
                attachedTemplateId = $scope.contractTemplates[i].templateId;
            }
        }
        console.log($scope.versionData.template.templateLabel);
        if (attachedTemplateId === $scope.versionData.template.templateId || $scope.versionData.template.templateLabel === $scope.initialTemplateOption.templateLabel) {
            $scope.currentAttachedTemplate = true;
        } else {
            $scope.currentAttachedTemplate = false;
        }
    };

    // Attach template sections to contract version
    $scope.saveNewDocumentSections = function() {
        $scope.validationMessage.content = '';
        $scope.validationMessage.error = false;
        $scope.vlcLoading = true;
        if ($scope.templateAttached) {
            remoteActions.updateContractSections($scope.versionData.template.templateId, $scope.contractVersionId).then(function() {
                console.log('Updated contract sections');
                if ($scope.isConsole) {
                    $scope.showSuccessMessage = true;
                    refreshCurrentPrimaryTab();
                } else {
                    window.top.location.href = $scope.versionUrl + '?attachedTemplate=true';
                }
            }, function(error) {
                $scope.validationErrorHandler(error);
            });
        } else {
            remoteActions.saveNewDocumentSections($scope.originalSections).then(function() {
                console.log('Saved new document sections');
                console.log($scope.contractTemplates);
                if ($scope.isConsole) {
                    $scope.showSuccessMessage = true;
                    refreshCurrentPrimaryTab();
                } else {
                    window.top.location.href = $scope.versionUrl + '?attachedTemplate=true';
                }
            }, function(error) {
                $scope.validationErrorHandler(error);
            });
        }
    };

    // Remove template and sections from version
    $scope.removeContractSections = function() {
        $scope.vlcLoading = true;
        remoteActions.removeContractSections($scope.contractVersionId).then(function() {
            if ($scope.isConsole) {
                $scope.showRemovedMessage = true;
                refreshCurrentPrimaryTab();
            } else {
                window.top.location.href = $scope.versionUrl + '?removedTemplate=true';
            }
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };

    function refreshCurrentPrimaryTab() {
        sforce.console.getFocusedPrimaryTabId(showTabId);
    }

    var showTabId = function showTabId(result) {
        var tabId = result.id;
        //alert('Primary Tab IDs: primaryTabId ' + tabId );
        sforce.console.refreshPrimaryTabById(tabId , true, refreshSuccess);
    };

    var refreshSuccess = function refreshSuccess(result) {
        //Report whether action was successful
        if (result.success === true) {
            if ($scope.showSuccessMessage) {
                alert('Successfully Attached Template to Contract Version.');
                $scope.showSuccessMessage = false;
            } else if ($scope.showRemovedMessage) {
                alert('Successfully Removed Template from Contract Version.');
                $scope.showRemovedMessage = false;
            }
        } else {
            //alert('Primary did not refresh');
        }
    };

    $scope.customizeDocument = function() {
        $modal({
            title: 'Customize Document',
            templateUrl: 'check-status-modal.tpl.html',
            html: true,
            scope: $scope,
            container: 'div.vlocity',
            placement: 'center',
            backdrop: false
        });
    };

    $scope.editNewContractVersion = function() {
        $scope.vlcLoading = true;
        remoteActions.editNewContractVersion($scope.contractVersionId).then(function(result) {
            $scope.newVersionId = result;
            console.log(' $scope.editPageUrl is ' + $scope.editPageUrl);
            var navigateUrl = $scope.editPageUrl + '&contractVersionId=' + $scope.newVersionId;
            if ($scope.isConsole) {
                //close version tab
                sforce.console.getEnclosingTabId(function(result) {
                    var tabId = result.id;
                    sforce.console.closeTab(tabId);
                });
                sforce.console.getEnclosingPrimaryTabId(openSubtab);
            } else {
                window.top.location.href = navigateUrl;
            }
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };

    var openSubtab = function openSubtab(result) {
        //Now that we have the primary tab ID, we can open a new subtab in it
        var primaryTabId = result.id;
        //console.log('primary tab id' + primaryTabId);
        var navigateUrl = $scope.editPageUrl + '&contractVersionId=' + $scope.newVersionId;
        sforce.console.openSubtab(primaryTabId , navigateUrl, true, 'Customize Document');
    };

    var openSuccess = function openSuccess(result) {
        //Report whether we succeeded in opening the subtab
        if (result.success === true) {
            //alert('subtab successfully opened');
        } else {
            //alert('subtab cannot be opened');
        }
    };

    $scope.removeParam = function(key, sourceURL) {
        var rtn, i, param, paramsArr, queryString;
        rtn = sourceURL.split('?')[0];
        paramsArr = [];
        queryString = (sourceURL.indexOf('?') !== -1) ? sourceURL.split('?')[1] : '';
        if (queryString !== '') {
            paramsArr = queryString.split('&');
            for (i = paramsArr.length - 1; i >= 0; i -= 1) {
                param = paramsArr[i].split('=')[0];
                if (param === key) {
                    paramsArr.splice(i, 1);
                }
            }
            if (paramsArr.length) {
                rtn = rtn + '?' + paramsArr.join('&');
            }
        }
        return rtn;
    };

    // Error handling helper
    $scope.validationErrorHandler = function(error) {
        $scope.showRemovedMessage = false;
        if (!error.message) {
            error.message = 'No error message.';
        }
        if (typeof error.type === 'string') {
            error.type = error.type.capitalizeFirstLetter();
        }
        $scope.validationMessage.type = 'alert-danger';
        $scope.validationMessage.content = error.type + ' (' + error.statusCode + '): ' + error.message;
        $scope.validationMessage.error = true;
        $scope.versionData.template = $scope.contractTemplates[0];
        $scope.vlcLoading = false;
    };

    // Adding to String prototype
    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
});

},{}],3:[function(require,module,exports){
angular.module('contractDocumentVersionSectionsApp').directive('vlcLoader', function() {
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

},{}],4:[function(require,module,exports){
(function() {
    'use strict';
    window.angular.module('contractDocumentVersionSectionsApp').service('browserDetection', ['$window', function($window) {
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

},{}],5:[function(require,module,exports){
angular.module("contractDocumentVersionSectionsApp").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("check-status-modal.tpl.html",'<div class="modal" tabindex="-1" role="dialog">\n    <div class="modal-dialog">\n        <div class="modal-content">\n            <div class="modal-header" ng-show="title">\n                <button type="button" class="close" ng-click="$hide()">&times;</button>\n                <h4 class="modal-title" ng-bind-html="title"></h4></div>\n            <div class="modal-body">\n                <div class="alert alert-warning" role="alert">A new contract version will be created (Version {{versionLoadedData.documentVersionObj[nameSpacePrefix + \'VersionNumber__c\'] + 1}}), and your current version (Version {{versionLoadedData.documentVersionObj[nameSpacePrefix + \'VersionNumber__c\']}}) will be set to \'Inactive\'. Would you like to proceed?</div>\n            </div>\n            <div class="modal-footer">\n                <button type="button" class="btn btn-primary pull-right modal-proceed-btn" ng-click="editNewContractVersion(); $hide()">Proceed</button>\n                <button type="button" class="btn btn-default pull-right modal-cancel-btn" ng-click="$hide()">Cancel</button>                \n            </div>\n        </div>\n    </div>\n</div>'),$templateCache.put("dir-pagination-controls.tpl.html",'<ul class="pagination" ng-if="1 < pages.length">\n    <li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(1)">&laquo;</a>\n    </li>\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a>\n    </li>\n    <li ng-repeat="pageNumber in pages track by $index" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' }">\n        <a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a>\n    </li>\n\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a>\n    </li>\n    <li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.last)">&raquo;</a>\n    </li>\n</ul>')}]);

},{}]},{},[1]);
})();

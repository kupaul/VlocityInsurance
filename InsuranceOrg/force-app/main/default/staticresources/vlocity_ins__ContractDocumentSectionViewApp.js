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
var contractDocumentSectionViewApp = angular.module('contractDocumentSectionViewApp', ['vlocity', 'viaDirectives', 'mgcrea.ngStrap',
    'ngSanitize', 'ngAnimate', 'sldsangular', 'ui.tinymce', 'angularUtils.directives.dirPagination'
]).config(['remoteActionsProvider', function(remoteActionsProvider) {
    'use strict';
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}]);

// Services
require('./modules/contractDocumentSectionViewApp/services/BrowserDetection.js');

// Controllers
require('./modules/contractDocumentSectionViewApp/controller/ContractDocumentSectionViewController.js');

// Directives
require('./modules/contractDocumentSectionViewApp/directive/CheckSectionSaved.js');

// Templates
require('./modules/contractDocumentSectionViewApp/templates/templates.js');

},{"./modules/contractDocumentSectionViewApp/controller/ContractDocumentSectionViewController.js":2,"./modules/contractDocumentSectionViewApp/directive/CheckSectionSaved.js":3,"./modules/contractDocumentSectionViewApp/services/BrowserDetection.js":4,"./modules/contractDocumentSectionViewApp/templates/templates.js":5}],2:[function(require,module,exports){
angular.module('contractDocumentSectionViewApp').controller('contractDocumentSectionViewCtrl', function($scope, $sce, remoteActions, browserDetection, $q, $modal) {
    'use strict';
    $scope.vlcLoading = true;

    $scope.nameSpacePrefix = '';
    if (window.nameSpacePrefix !== undefined) {
        $scope.nameSpacePrefix = window.nameSpacePrefix;
    }
    
    $scope.labels = {};
    if (window.labels !== undefined) {
        $scope.labels = window.labels;
    }

    $scope.baseRequestUrl = '';
    if (window.baseRequestUrl !== undefined) {
        $scope.baseRequestUrl = window.baseRequestUrl;
    }

    $scope.contractId = '';
    if (window.contractId !== undefined) {
        $scope.contractId = window.contractId;
    }

    $scope.parentId = '';
    if (window.parentId !== undefined) {
        $scope.parentId = window.parentId;
    }

    $scope.docName = '';
    if (window.docName !== undefined) {
        $scope.docName = window.docName;
    }

	$scope.sitePrefix = '';
	if ( window.sitePrefix !== undefined ) {
		$scope.sitePrefix = window.sitePrefix;
		sforce.connection.serverUrl = $scope.sitePrefix + sforce.connection.serverUrl;
	}

    $scope.userName = window.userName;
    $scope.userId = window.userId;

    $scope.sections = [];
    $scope.unsavedSections = {};
    $scope.originalSectionData = {};
    $scope.versionData = {
        'sections': []
    };
    $scope.redlines = {
        'containsRedlines': false,
        'redlinesCount': 0
    };
    $scope.validationErrors = {
        'sections': {}
    };
    $scope.validationMessage = {
        'type': 'alert-success',
        'content': '',
        'error': false
    };
    $scope.alert = {
        message: '',
        type: ''
    };

    $scope.expandedSearch = false;
    $scope.searchOptions = {
        'filterName': false,
        'searchTerm': '',
        'filterRedlines': false,
        'hasRedlines': false
    };
    $scope.showPagination = false;
    $scope.paginationOptions = {
        'pageNumber': 1
    };
    $scope.disableSaveAllBtn = true;

    $scope.docxTemplateName = 'DocxGenTemplate';
    $scope.userAccess = '';
    $scope.isFullAccess = true;
    $scope.currentSectionSequence = null;
    $scope.isTemplateBatchable = true;
    $scope.statusClass = 'active';
    $scope.isTracking = false;
    $scope.isCheckIn = false;
    $scope.attachDocUrl = '';
    $scope.isConsole = sforce.console.isInConsole();
    $scope.isSforce = (typeof sforce !== 'undefined' && typeof sforce.one !== 'undefined') ? (true) : (false);
    $scope.browser = browserDetection.detectBrowser();
    $scope.isSafari = ($scope.browser === 'safari') ? true : false;
    $scope.isInternetExplorer = ($scope.browser === 'msielte10' || $scope.browser === 'msiegt10') ? true : false;
    $scope.browserVersion = browserDetection.getBrowserVersion();
    
    var documentStylesheetRef = $('link[rel=stylesheet]').filter(function() {
        return /DocumentBaseCss/.test(this.getAttribute('href'));
    });

    function refreshSuccess(result) {
        // Report whether refreshing the primary tab was successful
    }

    function showTabId(result) {
        var tabId = result.id;
        sforce.console.refreshPrimaryTabById(tabId , true, refreshSuccess);
    }

    function refreshCurrentPrimaryTab() {
        sforce.console.getFocusedPrimaryTabId(showTabId);
    }

    function getTemplateZip(result) {
        var zip = new JSZip(result.templateEncoded, {base64: true});
        return zip;
    }

    function getRelsFile(zip) {
        var file = zip.file('word/_rels/document.xml.rels');
        if (file != null) {
            return file.asText();
        }
        return '';
    }

    function generateDocx(result, type, zip) {
        var i, doc, out;
        var contractData = result.contractData;
        var imageCount = result.imageData.numImages;
        for (i = 0; i < imageCount; i++) {
            if (typeof result.imageData['imageData' + i] !== 'undefined' && result.imageData['imageData' + i] !== null) {
                zip.file('word/media/imageData' + i + '.png', result.imageData['imageData' + i], {base64: true});
            }
        }
        if (result.contractData.numberingXML !== null && result.contractData.numberingXML !== '') {
            zip.remove('word/numbering.xml');
            zip.file('word/numbering.xml',result.contractData.numberingXML,{});
        }
        if (typeof result.contractData.DocxRels !== 'undefined' && result.contractData.DocxRels !== null) {
            zip.remove('word/_rels/document.xml.rels');
            zip.file('word/_rels/document.xml.rels', result.contractData.DocxRels, {});
        }
        doc = new Docxtemplater();
        doc.loadZip(zip);
        doc.setData(contractData);
        doc.render();

        if (type === 'blob') {
            out = doc.getZip().generate({type: 'blob'});
        } else {
            out = doc.getZip().generate({type: 'base64'});
        }

        return out;
    }

    function b64toBlob(b64Data, contentType, sliceSize) {
        var byteCharacters, byteArrays, offset, slice, byteNumbers, i, byteArray, blob;
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        byteCharacters = atob(b64Data);
        byteArrays = [];

        for (offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            slice = byteCharacters.slice(offset, offset + sliceSize);
            byteNumbers = new Array(slice.length);
            for (i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    $scope.$watch('unsavedSections', function(newValue) {
        $scope.disableSaveAllBtn = (Object.keys(newValue).length === 0);
    }, true);

    $scope.getSectionViewData = function() {
        $scope.vlcLoading = true;
        var inputData = {
            'contractId': $scope.contractId,
            'pageNumber': $scope.paginationOptions.pageNumber,
            'filterName': false,
            'searchTerm': '',
            'filterRedlines': false,
            'hasRedlines': false
        };
        remoteActions.getSectionViewData(inputData).then(function(result) {
            console.log('Section View Data:', result);
            $scope.contractVersion = result.contractVersion;
            $scope.documentSectionSize = result.documentSectionSize;
            $scope.docxTemplateName = result.docxTemplateName;
            $scope.documentTemplateResource = result.documentTemplateResource;
            $scope.documentMetadata = result.documentMetadata;
            $scope.isTemplateBatchable = $scope.contractVersion[$scope.nameSpacePrefix + 'IsTemplateBatchable__c'];
            $scope.isTracking = $scope.contractVersion[$scope.nameSpacePrefix + 'TrackContractRedlines__c'];
            $scope.userAccess = result.userAccess;
            $scope.isFullAccess = ($scope.userAccess === 'FullDocumentAccess');
            
            // process search results
            $scope.processSearchResults(result);

            // configure tinymce editor
            $scope.configureTinyMCE();
            if ($scope.isTracking) {
                $scope.tinymceOptions.plugins = 'ice ' + $scope.tinymceOptions.plugins;
                        
                if ($scope.userAccess === 'EditDocument') {
                    $scope.tinymceOptions.toolbar2 = 'preview | forecolor backcolor | table | fontselect fontsizeselect | ice_toggleshowchanges';
                } else if ($scope.userAccess === 'ReviewDocument' || $scope.userAccess === 'FullDocumentAccess') {
                    $scope.tinymceOptions.toolbar2 = 'preview | forecolor backcolor | table | fontselect fontsizeselect | ice_toggleshowchanges iceacceptall iceaccept icerejectall icereject';
                }
            }
        }, function(error) {
            $scope.vlcLoading = false;
            $scope.validationErrorHandler(error);
        });
    };

    $scope.searchSections = function(pageNumber) {
        $scope.vlcLoading = true;
        $scope.currentSectionSequence = null;
        $scope.paginationOptions.pageNumber = (pageNumber || 1);
        var inputData = {
            'contractVersionId': $scope.contractVersion.Id,
            'pageNumber': $scope.paginationOptions.pageNumber,
            'filterName': $scope.searchOptions.filterName,
            'searchTerm': $scope.searchOptions.searchTerm.trim(),
            'filterRedlines': $scope.searchOptions.filterRedlines,
            'hasRedlines': $scope.searchOptions.hasRedlines
        };
        remoteActions.searchContractSections(inputData).then(function(result) {
            $scope.processSearchResults(result);
        }, function(error) {
            $scope.vlcLoading = false;
            $scope.validationErrorHandler(error);
        });
    };

    $scope.processSearchResults = function(result) {
        $scope.sections = [];

        for (var i = 0; i < result.contractSections.length; i++) {
            var section = result.contractSections[i];
            $scope.originalSectionData[section.sectionId] = angular.copy(section);
            $scope.validationErrors.sections[section.sectionId] = {
                'sectionName': '',
                'sectionContent': '',
                'sectionSaved': true,
                'sectionErrors': false
            };

            section.disabled = (section.type === 'Item' || section.type === 'Signature' || section.type === 'Custom');
            $scope.sections.push(section);
        }

        $scope.paginationOptions = {
            'pageNumber': result.pageNumber,
            'totalPages': result.totalPages,
            'previousPage': result.previousPage,
            'nextPage': result.nextPage,
            'fromCount': result.fromCount,
            'toCount': result.toCount,
            'totalCount': result.totalCount
        };
        $scope.showPagination = (result.totalCount > 0);

        $scope.vlcLoading = false;
    };

    $scope.showSectionContent = function(section) {
        $scope.vlcLoading = true;
        $scope.validationMessage.content = '';
        $scope.validationMessage.error = false;

        if (section.type === 'Custom' || section.content) {
            $scope.displaySectionContent(section);
        } else {
            $scope.getSectionContent(section);
        }
    };

    $scope.displaySectionContent = function(section) {
        if (section.disabled) {
            if (section.type === 'Custom') {
                section.content = 'This is a custom section with no content.';
            }
            $scope.showContentEditor = false;
        } else {
            $scope.showContentEditor = true;
            $scope.tinymceOptions.readonly = section.isRestricted;
        }

        $scope.currentSectionSequence = section.sequence;
        $scope.vlcLoading = false;
    };

    $scope.getSectionContent = function(section) {
        $scope.vlcLoading = true;
        var inputData = {
            'sectionId': section.sectionId
        };
        remoteActions.getSectionContent(inputData).then(function(result) {
            section.content = result.sectionContent;
            $scope.originalSectionData[section.sectionId].content = angular.copy(result.sectionContent);

            if (section.content.indexOf('span class="ins') > 0 || section.content.indexOf('span class="del') > 0) {
                $scope.redlines.redlinesCount++;
                $scope.redlines.containsRedlines = true;
                section.hasRedlines = true;
            }
            if ($scope.isInternetExplorer && section.content.indexOf('padding-left: 0px; width: 100%; display: inline-block;') > -1) {
                section.content = section.content.replace('padding-left: 0px; width: 100%; display: inline-block;', 'padding-left: 0px; width: 100%; display: block;');
            }
            $scope.removeWrappers(section);
            $scope.formatSectionContent(section);
        }, function(error) {
            $scope.vlcLoading = false;
            $scope.validationErrorHandler(error);
        });
    };

    // helper method to strip span tags out of section content when loading the UI
    $scope.removeWrappers = function(section) {
        var htmlTagRegex, sectionContentArray, tempSectionContent, i;
        if (section.content) {
            htmlTagRegex = /(<[^>]*>)/;
            sectionContentArray = section.content.split(htmlTagRegex);
            tempSectionContent = '';
            for (i = 0; i < sectionContentArray.length; i++) {
                if (sectionContentArray[i] !== '<viawrapper>' && sectionContentArray[i] !== '</viawrapper>') {
                    tempSectionContent = tempSectionContent + sectionContentArray[i];
                }
            }
            section.content = tempSectionContent;
        }
    };

    $scope.formatSectionContent = function(section) {
        if (section.type === 'Item') {
            $scope.formatItemSection(section);
        } else if (section.type === 'Signature') {
            // Remove signature strings between \ and \
            var signatureContent = section.content;
            
            // split string at anything starting with \
            var signatureSplit = signatureContent.split(/(?=\\)/);
            for (var i = 0; i < signatureSplit.length; i++) {
                if (signatureSplit[i].charAt(0) === '\\') {
                    // if we reach a word starting with \, remove it:
                    signatureContent = signatureContent.replace(signatureSplit[i] + '\\', '');
                }
            }
            
            section.content = signatureContent;
            $scope.displaySectionContent(section);
        } else {
            $scope.displaySectionContent(section);
        }
    };

    $scope.formatItemSection = function(section) {
        remoteActions.formatItemSection(section.sectionId).then(function(result) {
            section.content = result;
            $scope.displaySectionContent(section);
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };

    // Save section
    $scope.saveSection = function(section) {
        $scope.vlcLoading = true;

        // validate the section
        $scope.validateSection(section);

        if ($scope.validationErrors.sectionValid) {
            var inputData = {
                'sectionId': section.sectionId,
                'content': angular.copy(section.content),
                'contractVersionId': $scope.contractVersion.Id,
                'docxTemplateName': $scope.docxTemplateName
            };
            
            // insert wrappers into the section content so it is saved properly
            $scope.insertWrappers(inputData);
            
            // update the original section content in the cached map
            $scope.originalSectionData[section.sectionId].content = inputData.content;
            
            // save the section
            remoteActions.saveContractSection(inputData).then(function(result) {
                delete $scope.unsavedSections[section.sectionId];

                $scope.validationErrors.sections[section.sectionId].sectionSaved = true;
                $scope.validationErrors.sections[section.sectionId].sectionErrors = false;
                
                $scope.validationMessage.type = 'alert-success';
                $scope.validationMessage.content = 'Section saved successfully.';
                $scope.validationMessage.error = false;

                // move the `right-col` scroll to top so we can actually see the validation msg
                document.getElementsByClassName('right-col')[0].scrollTop = 0;
                
                $scope.vlcLoading = false;
            }, function(error) {
                $scope.vlcLoading = false;
                $scope.validationErrorHandler(error);
            });
        } else {
            $scope.validationMessage.type = 'alert-danger';
            $scope.validationMessage.content = $scope.validationErrors.sections[section.sectionId].errorMessage;
            $scope.validationMessage.error = true;
            $scope.vlcLoading = false;
        }
    };

    // Save all sections
    $scope.saveAllSections = function(checkInDocument) {
        $scope.vlcLoading = true;

        var sectionsToSave = [];
        angular.forEach($scope.unsavedSections, function(section) {
            var tmpSection = {};
            tmpSection.sectionId = section.sectionId;
            tmpSection.content = section.content;

            // insert wrappers into the section content so it is saved properly
            $scope.insertWrappers(tmpSection);
            
            // update the original section data in the cached map
            $scope.originalSectionData[section.sectionId].content = tmpSection.content;

            sectionsToSave.push(tmpSection);
        });

        if (sectionsToSave.length > 0) {
            var inputData = {
                'contractVersionId': $scope.contractVersion.Id,
                'docxTemplateName': $scope.docxTemplateName,
                'sections': JSON.stringify(sectionsToSave)
            };

            // save the sections
            remoteActions.saveContractSections(inputData).then(function(result) {
                $scope.unsavedSections = {};

                angular.forEach(result.sections, function(section) {
                    $scope.validationErrors.sections[section.sectionId].sectionSaved = true;
                    $scope.validationErrors.sections[section.sectionId].sectionErrors = false;
                });
                
                if (checkInDocument) {
                    $scope.checkInDocument();
                } else {
                    $scope.validationMessage.type = 'alert-success';
                    $scope.validationMessage.content = 'Sections saved successfully.';
                    $scope.validationMessage.error = false;
                    
                    $scope.vlcLoading = false;
                }
            }, function(error) {
                $scope.vlcLoading = false;
                $scope.validationErrorHandler(error);
            });
        } else {
            if (checkInDocument) {
                $scope.checkInDocument();
            }
        }
    };

    // Validate section
    $scope.validateSection = function(section) {
        // reset template sections errors
        $scope.validationMessage.content = '';
        $scope.validationMessage.error = false;
        $scope.validationErrors.sections[section.sectionId].errorMessage = '';
        $scope.validationErrors.sectionValid = true;

        // check if current section content is empty
        if (section && section.sectionType !== 'Conditional' && section.sectionType !== 'Embedded Template') {
            if (section.content.indexOf('<img') < 0 && /\S/.test($scope.stripHtml(section.content)) === false) {
                $scope.validationErrors.sections[section.sectionId].errorMessage = 'Please enter Section Content.';
                $scope.validationErrors.sectionValid = false;
            }
        }
    };

    // Helper method to add spans into sectionContent before it is saved to the db:
    $scope.insertWrappers = function(section) {
        if (section.content) {
            section.content = $scope.insertViawrappers(section.content);

            // Check sectionContent to see if the wrapper div exists with document styling:
            if (section.content.indexOf('section-content-wrapper') < 0) {
                section.content = '<div class="section-content-wrapper" style="font-size: 10pt;">' + section.content + '</div>';
            }
        }
    };

    // Helper method to add spans into sectionContent before it is saved to the db for console:
    $scope.insertWrappersConsole = function(sequence) {
        var versionData = document.getElementById('customizeDoc').contentWindow.angular.element('.vlocity').scope().versionData;
        if (versionData.sections[sequence].content) {
            versionData.sections[sequence].content = $scope.insertViawrappers(versionData.sections[sequence].content);

            // Check sectionContent to see if the wrapper div exists with document styling:
            if (versionData.sections[sequence].content.indexOf('section-content-wrapper') < 0) {
                versionData.sections[sequence].content = '<div class="section-content-wrapper" style="font-size: 10pt;">' +
                    versionData.sections[sequence].content + '</div>';
            }
        }

        if (versionData.sections[sequence].sectionDisplayHeader) {
            versionData.sections[sequence].sectionDisplayHeader = $scope.insertViawrappers($scope.versionData.sections[sequence].sectionDisplayHeader);
        }
    };

    //Help method to add viawrapper
    $scope.insertViawrappers = function(content) {
        var trimmedContent, htmlTagRegex, i, contentArray, charCode;
        if (content) {
            //Replace all occurrences of &nbsp; with ' ' except when immediately preceded by <p> and immediately followed by </p>
            trimmedContent = content.replace(/&nbsp;/g, ' ').replace(/<p>\s<\/p>/g, '<p>&nbsp;</p>');
            htmlTagRegex = /(<[^>]*>)/;
            contentArray = trimmedContent.split(htmlTagRegex);

            //wrap viawrapper around all text in content
            trimmedContent = '';
            for (i = 0; i < contentArray.length; i++) {
                charCode = contentArray[i].charCodeAt(0);
                if (contentArray[i] !== '' && contentArray[i].charAt(0) !== '<' &&
                    contentArray[i].slice(-1) !== '>' && charCode !== 10) {
                    contentArray[i] = '<viawrapper>' + contentArray[i] + '</viawrapper>';
                }
                if (i > 0) {
                    trimmedContent = trimmedContent + contentArray[i];
                }
            }
        }
        //console.log('after wrapping with viawrapper: ' + trimmedContent );
        return trimmedContent;
    };

    // Used to validate sectionContent to make sure there is real text available, not just HTML code
    $scope.stripHtml = function(html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    // Error handling helper
    $scope.validationErrorHandler = function(error) {
        if (!error.message) {
            error.message = 'No error message.';
        }
        if (typeof error.type === 'string') {
            error.type = error.type.capitalizeFirstLetter();
        }
        $scope.validationMessage.type = 'alert-danger';
        $scope.validationMessage.content = error.type + ' (' + error.statusCode + '): ' + error.message;
        $scope.validationMessage.error = true;
        $scope.vlcLoading = false;
    };

    // Adding to String prototype
    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };

    $scope.navigateBack = function() {
        if ($scope.isInConsole) {
            $scope.navigateBackConsole();
        } else {
            $modal({
                title: $scope.labels.checkInDocLabel + ' ?',
                templateUrl: 'checkin-modal.tpl.html',
                html: true,
                scope: $scope,
                container: 'div.vlocity',
                placement: 'center',
                prefixEvent: 'checkinModal',
                backdrop: false
            });
        }
    };

    $scope.navigateBackConsole = function() {
        $modal({
            title: $scope.labels.checkInDocLabel + ' ?',
            templateUrl: 'checkin-console-modal.tpl.html',
            html: true,
            scope: $scope,
            container: 'div.vlocity',
            placement: 'center',
            prefixEvent: 'checkinModal',
            backdrop: false
        });
    };

    $scope.goBack = function() {
        $scope.vlcLoading = true;
        if ($scope.isConsole) {
            // close current tab
            sforce.console.getEnclosingTabId(function(result) {
                var tabId = result.id;
                sforce.console.closeTab(tabId);
            });
            // refocus primary tab
            refreshCurrentPrimaryTab();
        } else {
            if (!$scope.isSforce) {
                window.top.location.href = $scope.baseRequestUrl + '/' + $scope.contractId;
                return false;
            } else if ($scope.isSforce) {
				if ( $scope.baseRequestUrl != '' ) {
					$scope.baseRequestUrl = $scope.baseRequestUrl + '/s/detail';
				}
                sforce.one.navigateToURL($scope.baseRequestUrl + '/' + $scope.contractId);
            }
        }
    };

    $scope.switchToPageView = function() {
        $scope.vlcLoading = true;
        
        var pageViewUrl = location.origin + $scope.sitePrefix + '/apex/'+$scope.nameSpacePrefix+'ContractDocumentEditSections?id=' + $scope.contractId;
        var pageViewConsoleUrl = location.origin + $scope.sitePrefix + '/apex/'+$scope.nameSpacePrefix+'ContractDocumentEditSectionsOuter?id=' + $scope.contractId;

        if ($scope.isConsole) {
            // navigate current subtab to the Section View
            sforce.console.getFocusedSubtabId(function (result) {
                var subTabId = result.id;
                sforce.console.getEnclosingPrimaryTabId(function (result) {
                    var primaryTabId = result.id;
                    sforce.console.openSubtab(primaryTabId, pageViewConsoleUrl, true, 'Customize', null, function(result){
                        sforce.console.closeTab(subTabId);
                    } );
                });
            });
        } else {
            if (!$scope.isSforce) {
                window.top.location.href = pageViewUrl;
                return false;
            } else if ($scope.isSforce) {
				pageViewUrl = pageViewUrl.replace(location.origin, '');
                sforce.one.navigateToURL(pageViewUrl);
            }
        }
    };

    $scope.clearAlert = function() {
        $scope.alert.message = '';
        $scope.alert.type = '';
    };

    $scope.configureTinyMCE = function() {
        $scope.tinymceOptions = {
            entity_encoding: "raw",
            selector: 'textarea.tinymce-editor',
            schema: 'html5-strict',
            height: 350,
            body_class: 'vlocity',
            content_css: documentStylesheetRef[0].getAttribute('href'),
            menubar: false,
            elementpath: false,
            browser_spellcheck: true,
            toolbar1: 'undo redo | styleselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link code',
            toolbar2: 'preview | forecolor backcolor | table | fontselect fontsizeselect',
            fontsize_formats: '6pt 7pt 8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 30pt 36pt',
            advlist_number_styles: 'default,lower-alpha,upper-alpha,lower-roman,upper-roman',
            advlist_bullet_styles: 'default,circle,disc,square',
            style_formats: [
                {
                    title: 'Inline', 
                    items: [
                        {title: 'Bold', icon: 'bold', format: 'bold'},
                        {title: 'Italic', icon: 'italic', format: 'italic'},
                        {title: 'Underline', icon: 'underline', format: 'underline'},
                        {title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough'},
                        {title: 'Superscript', icon: 'superscript', format: 'superscript'},
                        {title: 'Subscript', icon: 'subscript', format: 'subscript'}
                    ]
                },
                {
                    title: 'Blocks', 
                    items: [
                        {title: 'Paragraph', format: 'p'}
                    ]
                },
                {
                    title: 'Alignment', 
                    items: [
                        {title: 'Left', icon: 'alignleft', format: 'alignleft'},
                        {title: 'Center', icon: 'aligncenter', format: 'aligncenter'},
                        {title: 'Right', icon: 'alignright', format: 'alignright'},
                        {title: 'Justify', icon: 'alignjustify', format: 'alignjustify'}
                    ]
                }
            ],
            init_instance_callback: function(editor) {
                $(editor.getBody()).css({
                    'font-size': '10pt'
                });
                editor.on('ExecCommand',function(e) {
                    var val, node, nodeParent, children, i, child;
                    var cmd = e.command;
                    if (cmd === 'FontSize' || cmd === 'FontName') {
                        val = e.value;
                        node = e.target.selection.getNode();
                        nodeParent = node.parentNode;
                        if (node.nodeName === 'SPAN' && nodeParent.nodeName === 'LI') {
                            children = $(node).children('li');
                            if (children) {
                                children.removeAttr('data-mce-style');
                                if (cmd === 'FontSize') {
                                    children.css('font-size',val);
                                    $(node.parentNode).css('font-size',val);
                                }
                                if (cmd === 'FontName') {
                                    children.css('font-family',val);
                                    $(node.parentNode).css('font-family',val);
                                }
                            }
                        } else if (node.nodeName === 'OL' || node.nodeName === 'UL') {
                            children = node.children;
                            for (i = 0; i < children.length; i++) {
                                child = $(children[i]);
                                child.removeAttr('data-mce-style');
                                if (cmd === 'FontSize') {
                                    child.css('font-size',val);
                                }
                                if (cmd === 'FontName') {
                                    child.css('font-family',val);
                                }
                            }
                        }
                    }
                });
            },
            plugins: 'advlist autolink code colorpicker contextmenu lists link preview table textcolor textpattern visualblocks visualchars',
            ice: {
                user: {name: $scope.userName, id: $scope.userId},
                preserveOnPaste: 'p,a[href],i,em,strong,b,span',
                isTracking: $scope.isTracking
            },
            table_toolbar: '',
            table_default_styles: {
                fontFamily: 'Times New Roman',
                fontSize: '10pt',
                width: '100%'
            },
            paste_auto_cleanup_on_paste: true
        };
    };

    $scope.checkInDocument = function() {
        $scope.vlcLoading = true;
        if ($scope.isTemplateBatchable) {
            $scope.generateFileForBatchableTemplate(true).then(function(wordContents) {
                $scope.createAttachmentForBatchableTemplate(wordContents).then(function() {
                    $scope.checkInDocForWebTemplate(true);
                }, function(error) {
                    console.error('error: ', error);
                    $scope.vlcLoading = false;
                });
            }, function(error) {
                console.error('error: ', error);
                $scope.vlcLoading = false;
            });
        } else {
            $scope.attachDocUrl = location.origin + $scope.sitePrefix + '/apex/'+$scope.nameSpacePrefix+'DocumentGeneration?id=' + $scope.contractId ;
            window.addEventListener('ContractDocumentAttachDone', function() {
                $scope.checkInDocForWebTemplate(true);
            });
        }
    };

    $scope.createAttachmentForBatchableTemplate = function(wordContents) {
        var deferred = $q.defer();
        var attachmentSObj = new sforce.SObject('Attachment');
        attachmentSObj.Body = wordContents;
        attachmentSObj.IsPrivate = false;
        attachmentSObj.Name = $scope.docName + '.docx';
        attachmentSObj.ParentId = $scope.contractVersion.Id;
        attachmentSObj.ContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        sforce.connection.sessionId = window.sessionId;
        sforce.connection.create([attachmentSObj], {
            onSuccess: function(result) {
                deferred.resolve(true);
            },
            onFailure: function(result) {
                deferred.reject(result.faultstring);
            }
        });
        return deferred.promise;
    };

    $scope.checkInDocForWebTemplate = function(goBack) {
        remoteActions.checkIn($scope.contractVersion.Id).then(function(result) {
            console.log('check in document complete', result);
            if (goBack) {
                $scope.goBack();
            }
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };

    $scope.preDownloadDocx = function() {
        if ($scope.isSafari) {
            $scope.alert.message = 'This operation is currently not supported in the Safari browser. Please use another browser like ' + '<a href="https://www.google.com/chrome/browser" target="_blank">Chrome</a> or ' + '<a href="https://www.mozilla.org/firefox" target="_blank">Firefox</a>.';
            $scope.alert.type = 'danger';

        } else {
            if ($scope.redlines.containsRedlines) {
                $modal({
                    title: $scope.labels.downloadWordLabel,
                    templateUrl: 'docx-contains-redlines-modal.tpl.html',
                    html: true,
                    scope: $scope,
                    container: 'div.vlocity',
                    placement: 'center',
                    backdrop: false
                });
            } else {
                $scope.downloadDocx();
            }
        }
    };
    
    $scope.downloadDocx = function() {
        $scope.vlcLoading = true;
        if ($scope.isTemplateBatchable) {
            $scope.generateFileForBatchableTemplate(false);
        } else {
            remoteActions.getWordFileTemplateContent($scope.contractVersion.Id).then(function(result) {
                var zip;
                if (result.errorString !== undefined) {
                    $scope.validationErrorHandler(result.errorString);
                    $scope.vlcLoading = false;
                } else {
                    zip = getTemplateZip(result);
                    parseContentTypes(zip); // parse the document content to convert all jpeg/jpg images to png
    
                    remoteActions.getGeneratedWordDocumentContent($scope.contractVersion.Id, getRelsFile(zip)).then(function(result) {
                        if (result.errorString !== undefined) {
                            $scope.validationErrorHandler(result.errorString);
                        } else {
                            saveAs(generateDocx(result,'blob', zip), $scope.docName + '.docx');
                        }
                        $scope.vlcLoading = false;
                    }, function(error) {
                        $scope.validationErrorHandler(error);
                        $scope.vlcLoading = false;
                    });
                }
            }, function(error) {
                $scope.validationErrorHandler(error);
                $scope.vlcLoading = false;
            });
        }
    };

    $scope.generateFileForBatchableTemplate = function(isAttachCall) {
        var deferred = $q.defer();

        if ($scope.documentTemplateResource.errorString !== undefined) {
            console.error('Error in the document template resource: ', $scope.documentTemplateResource.errorString);
        } else {
            var zip = new JSZip($scope.documentTemplateResource, {base64: true});
            var contentDataMap = $scope.documentMetadata.contentDataMap;
            var imageDataMap = $scope.documentMetadata.imageDataMap;
            for (var i = 0; i < imageDataMap.numImages; i++) {
                if (typeof imageDataMap['imageData' + i] !== 'undefined' && imageDataMap['imageData' + i] !== null) {
                    zip.file('word/media/imageData' + i + '.png', imageDataMap['imageData' + i], {base64: true});
                }
            }
            if (contentDataMap.numberingXML !== null && contentDataMap.numberingXML !== '') {
                zip.remove('word/numbering.xml');
                zip.file('word/numbering.xml', contentDataMap.numberingXML,{});
            }
            if (typeof contentDataMap.DocxRels !== 'undefined' && contentDataMap.DocxRels !== null) {
                zip.remove('word/_rels/document.xml.rels');
                zip.file('word/_rels/document.xml.rels', contentDataMap.DocxRels, {});
            }

            var doc = new Docxtemplater();
            doc.loadZip(zip);
            $scope.startIndex = 0;
            $scope.wmlContents = '';
            if (isAttachCall) {
                $scope.fetchWML(doc, contentDataMap, true, 'base64');
                $scope.$on('wordFileContents', function (event, data) {
                    deferred.resolve(data);
                });
            } else {
                $scope.fetchWML(doc, contentDataMap, false, 'blob');
            }
        }

        return deferred.promise;
    };

    $scope.fetchWML = function (doc, contentDataMap, isAttachCall, docType) {
        var recordCount = 100;
        remoteActions.getWMLData($scope.contractVersion.Id, $scope.startIndex, recordCount).then(function(result, event) {
            $scope.wmlContents += result;
            $scope.startIndex += recordCount;
            if ($scope.startIndex < $scope.documentSectionSize) {
                $scope.fetchWML(doc, contentDataMap, isAttachCall, docType);
            } else {
                contentDataMap.ContractData = $scope.wmlContents;
                doc.setData(contentDataMap);
                doc.render();

                var outputFileConfig = {
                    'type': docType, 
                    'mimeType': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'compression': 'DEFLATE', 
                    'compressionOptions': {
                        'level': 9
                    }
                };
                var out = doc.getZip().generate(outputFileConfig);

                if (isAttachCall) {
                    $scope.$emit('wordFileContents', out);
                } else {
                    saveAs(out, $scope.docName + '.docx');
                    $scope.vlcLoading = false;
                }
            }
        }, function(error) {
            console.log(error);
        });
    };

    $scope.preDownloadPdf = function() {
        if ($scope.redlines.containsRedlines) {
            $modal({
                title: $scope.labels.downloadPDFLabel,
                templateUrl: 'pdf-contains-redlines-modal.tpl.html',
                html: true,
                scope: $scope,
                container: 'div.vlocity',
                placement: 'center',
                backdrop: false
            });
        } else {
            $scope.downloadPdf();
        }
    };

    $scope.downloadPdf = function() {
        remoteActions.downloadPdf($scope.parentId, $scope.docName).then(function(result) {
            var data = result;
            var blob = b64toBlob(data, 'application/pdf');
            saveAs(blob, $scope.docName + '.pdf');
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };
    
    this.$onInit = function() {
        $scope.getSectionViewData();
    };
});

},{}],3:[function(require,module,exports){
angular.module('contractDocumentSectionViewApp').directive('checkSectionSaved', function() {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            validationErrors: '=',
            docSection: '=',
            unsavedSections: '=',
            redlines: '='
        },
        link: function(scope) {
            scope.$watch('docSection', function(newValue, oldValue) {
                if (newValue.content) {
                    scope.$parent.removeWrappers(scope.docSection.sequence);
                    if (newValue.sectionType === 'Embedded Template') {
                        return;
                    }
                    // tinymce inserts \n linebreaks in the code for their code view which disrupts the data. Ignore.
                    if (oldValue.content) {
                        if ((oldValue.content.match(/\n/g) || []).length !== (newValue.content.match(/\n/g) || []).length) {
                            return;
                        }
                    }
                }

                // Need to only do this on subsequent saves to a section
                if (oldValue.content && angular.equals(newValue, oldValue) === false) {
                    scope.validationErrors.sections[scope.docSection.sectionId].sectionSaved = false;
                    scope.unsavedSections[scope.docSection.sectionId] = scope.docSection;

                    if (!oldValue.hasRedlines && (newValue.content.indexOf('span class="ins') > 0 || newValue.content.indexOf('span class="del') > 0)) {                        
                        newValue.hasRedlines = true;
                        scope.redlines.containsRedlines = true;
                        scope.redlines.redlinesCount++;
                    } else if (oldValue.hasRedlines && (newValue.content.indexOf('span class="ins') < 0 && newValue.content.indexOf('span class="del') < 0)) {
                        newValue.hasRedlines = false;
                        scope.redlines.redlinesCount--;
                        if (scope.redlines.redlinesCount === 0 && scope.redlines.containsRedlines) {
                            scope.redlines.containsRedlines = false;
                        }
                    }
                }
            }, true);
        }
    };
});

},{}],4:[function(require,module,exports){
(function() {
    'use strict';
    window.angular.module('contractDocumentSectionViewApp').service('browserDetection', ['$window', function($window) {
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
angular.module("contractDocumentSectionViewApp").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("checkin-console-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="close" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium slds-m-bottom_none" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{labels.customizeReadyCheckInLabel}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral modal-back-btn" ng-click="goBack(); $hide()">{{labels.noCheckInLabel}}</button>\n            <button type="button" class="slds-button slds-button_neutral modal-cancel-btn" ng-click="$hide()">{{labels.cancelLabel}}</button>\n            <button type="button" class="slds-button slds-button_brand modal-check-in-btn" ng-click="checkInDocument(); $hide();">{{labels.yesCheckInLabel}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>'),$templateCache.put("dir-pagination-controls.tpl.html",'<ul class="pagination" ng-if="1 < pages.length">\n    <li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(1)">&laquo;</a>\n    </li>\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a>\n    </li>\n    <li ng-repeat="pageNumber in pages track by $index" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' }">\n        <a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a>\n    </li>\n\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a>\n    </li>\n    <li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.last)">&raquo;</a>\n    </li>\n</ul>'),$templateCache.put("pdf-contains-redlines-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium slds-m-bottom_none" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{labels.downloadDocRedlineLabel}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral modal-cancel-btn" ng-click="$hide()">{{labels.cancelLabel}}</button>\n            <button type="button" class="slds-button slds-button_brand modal-download-btn" ng-click="downloadPdf(); $hide();">{{labels.yesDownloadLabel}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>'),$templateCache.put("docx-contains-redlines-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium slds-m-bottom_none" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{labels.downloadDocRedlineLabel}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral modal-cancel-btn" ng-click="$hide()">{{labels.cancelLabel}}</button>\n            <button type="button" class="slds-button slds-button_brand modal-download-btn" ng-click="downloadDocx(); $hide();">{{labels.yesDownloadLabel}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>'),$templateCache.put("checkin-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium slds-m-bottom_none" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{labels.customizeReadyCheckInLabel}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral modal-back-btn" ng-click="goBack(); $hide()">{{labels.noCheckInLabel}}</button>\n            <button type="button" class="slds-button slds-button_neutral modal-cancel-btn" ng-click="$hide()">{{labels.cancelLabel}}</button>\n            <button type="button" class="slds-button slds-button_brand modal-check-in-btn" ng-click="checkInDocument(); $hide();">{{labels.yesCheckInLabel}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>')}]);

},{}]},{},[1]);
})();

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
var contractDocumentEditSectionsApp = angular.module('contractDocumentEditSectionsApp', ['vlocity','mgcrea.ngStrap',
    'ngSanitize', 'ngAnimate', 'sldsangular', 'ui.tinymce', 'angularUtils.directives.dirPagination'
]).config(['remoteActionsProvider', function(remoteActionsProvider) {
    'use strict';
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}]);

// Services
require('./modules/contractDocumentEditSectionsApp/services/BrowserDetection.js');

// Controllers
require('./modules/contractDocumentEditSectionsApp/controller/ContractEditSectionsController.js');

// Directives
require('./modules/contractDocumentEditSectionsApp/directive/CheckSectionSaved.js');
require('./modules/contractDocumentEditSectionsApp/directive/VlcLoader.js');

// Templates
require('./modules/contractDocumentEditSectionsApp/templates/templates.js');

},{"./modules/contractDocumentEditSectionsApp/controller/ContractEditSectionsController.js":2,"./modules/contractDocumentEditSectionsApp/directive/CheckSectionSaved.js":3,"./modules/contractDocumentEditSectionsApp/directive/VlcLoader.js":4,"./modules/contractDocumentEditSectionsApp/services/BrowserDetection.js":5,"./modules/contractDocumentEditSectionsApp/templates/templates.js":6}],2:[function(require,module,exports){
angular.module('contractDocumentEditSectionsApp').controller('contractDocumentEditSectionsCtrl', function($scope, $sce, $timeout,
    remoteActions, $location, browserDetection, $filter, $q, $modal) {
    'use strict';
    $scope.vlcLoading = true;
    $scope.nameSpacePrefix = '';
    $scope.contractId = '';
    $scope.contractVersionId = '';
    $scope.parentId = '';
    $scope.isEditableValue = false;
    $scope.docName = '';
    //$scope.containsRedlines = false;
    $scope.redlines = {
        'containsRedlines': false,
        'redlinesCount': 0
    };
    $scope.currentSectionSequence = null;
    $scope.bodyHeader = '';
    $scope.formattedLineItemTable = '';
    $scope.saveButtonVisible = true;
    $scope.labels = {};
    if (window.labels !== undefined) {
        $scope.labels = window.labels;
    }

    $scope.saveAllSectionsBtn = {
        'text': $scope.labels.clmContractDocAllSectionsSaved
    };
    $scope.baseRequestUrl = '';
    if (window.nameSpacePrefix !== undefined) {
        $scope.nameSpacePrefix = window.nameSpacePrefix;
    }
    if (window.contractId !== undefined) {
        $scope.contractId = window.contractId;
    }
    if (window.contractVersionId !== undefined) {
        $scope.contractVersionId = window.contractVersionId;
    }
    if (window.parentId !== undefined) {
        $scope.parentId = window.parentId;
    }
    if (window.isEditableValue !== undefined) {
        $scope.isEditableValue = (window.isEditableValue === 'true');
    }
    if (window.docName !== undefined) {
        $scope.docName = window.docName;
    }
    if (window.containsRedlines !== undefined) {
        $scope.redlines.containsRedlines = window.containsRedlines;
    }
    if (window.baseRequestUrl !== undefined) {
        $scope.baseRequestUrl = window.baseRequestUrl;
    }

	$scope.sitePrefix = '';
	if ( window.sitePrefix !== undefined ) {
		$scope.sitePrefix = window.sitePrefix;
	}

    //console.log('isEditableValue', $scope.isEditableValue);
    $scope.originalSectionData = [];
    $scope.versionData = {
        'sections': []
    };
    $scope.validationErrors = {
        'sections': []
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
    $scope.isConsole = window.isInConsole;
    $scope.versionName = window.versionName;
    $scope.userName = window.userName;
    $scope.userId = window.userId;
    $scope.isTracking = false;
    $scope.userAccess = '';
    $scope.isFullAccess = true;
    $scope.isCheckIn = false;
    $scope.attachDocUrl = '';
    $scope.isSforce = (typeof sforce !== 'undefined' && typeof sforce.one !== 'undefined') ? (true) : (false);
    $scope.browser = browserDetection.detectBrowser();
    $scope.isSafari = ($scope.browser === 'safari') ? true : false;
    $scope.isInternetExplorer = ($scope.browser === 'msielte10' || $scope.browser === 'msiegt10') ? true : false;
    $scope.browserVersion = browserDetection.getBrowserVersion();
    $scope.customizeDocUrl = location.origin + '/apex/ContractDocumentEditSectionsInner?id=' + $scope.contractId ;
    var documentStylesheetRef = $('link[rel=stylesheet]').filter(function() {
        return /DocumentBaseCss/.test(this.getAttribute('href'));
    });

    function refreshSuccess(result) {
        //Report whether refreshing the primary tab was successful
        if (result.success === true) {
        } else {
        }
    }

    function showTabId(result) {
        var primaryTabId = result.id;
        console.log('primaryTabId::', primaryTabId );
        sforce.console.refreshSubtabByNameAndPrimaryTabId($scope.originalSectionData.documentObj.ContractNumber , primaryTabId, true, refreshSuccess);
       // sforce.console.refreshPrimaryTabById(tabId , true, refreshSuccess);
    }

    function refreshCurrentPrimaryTab() {
        sforce.console.getFocusedPrimaryTabId(showTabId);
    }

    $scope.goBack = function() {
        $scope.vlcLoading = true;
        if ($scope.isConsole) {
            //close current tab
            sforce.console.getEnclosingTabId(function(result) {
                var tabId = result.id;
                sforce.console.closeTab(tabId);
            });
            //refocus primary tab
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

    $scope.configureTinymce = function() {
        $scope.tinymceOptions = {
            entity_encoding: "raw",
            selector: 'div.tinymce-editor',
            fixed_toolbar_container: '.tinymce-toolbar',
            schema: 'html5-strict',
            inline: true,
            body_class: 'vlocity',
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
                isTracking: false
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

    // Get user access
    $scope.getUserAccess = function() {
        remoteActions.getUserAccess().then(function(result) {
            $scope.userAccess = result;
            $scope.isFullAccess = (result === 'FullDocumentAccess') ? true : false;

            $scope.configureTinymce();
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };
    $scope.getUserAccess();

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

    $scope.preDownloadPdfConsole = function() {
        var redlines = document.getElementById('customizeDoc').contentWindow.angular.element('.vlocity').scope().redlines;
        if (redlines.containsRedlines) {
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

    $scope.downloadPdf  = function() {
        remoteActions.downloadPdf($scope.parentId, $scope.docName).then(function(result) {
            var data = result;
            var blob = b64toBlob(data, 'application/pdf');
            saveAs(blob,$scope.docName + '.pdf');
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

    $scope.preDownloadDocxConsole = function() {
        var redlines = document.getElementById('customizeDoc').contentWindow.angular.element('.vlocity').scope().redlines;
        if ($scope.isSafari) {
            $scope.alert.message = 'This operation is currently not supported in the Safari browser. Please use another browser like ' +
                            '<a href="https://www.google.com/chrome/browser" target="_blank">Chrome</a> or ' +
                            '<a href="https://www.mozilla.org/firefox" target="_blank">Firefox</a>.';
            $scope.alert.type = 'danger';
        } else {
            if (redlines.containsRedlines) {
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
        remoteActions.getDocxTemplate($scope.contractVersionId).then(function(result) {
            var zip;
            if (result.errorString !== undefined) {
                alert(result.errorString);
            } else {
                zip = getTemplateZip(result);
                parseContentTypes(zip); // parse the document content to convert all jpeg/jpg images to png

                remoteActions.downloadDocx($scope.parentId, getRelsFile(zip)).then(function(result) {
                    if (result.errorString !== undefined) {
                        alert(result.errorString);
                    } else {
                        saveAs(generateDocx(result,'blob',zip),$scope.docName + '.docx');
                    }
                }, function(error) {
                    $scope.validationErrorHandler(error);
                });
            }
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };

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

    // Get the list of sections from the attached template and load into the UI:
    $scope.getContractSectionsForVersion = function() {
        remoteActions.getContractSectionsForVersion($scope.contractVersionId).then(function(result) {
            var i, temporaryObj, temporaryValidationObj, thisTinymceOption;
            $scope.originalSectionData = result;
            console.log($scope.originalSectionData);

            for (i = 0; i < result.documentSectionObjs.length; i++) {
                temporaryObj = {
                    sectionId: result.documentSectionObjs[i].Id,
                    sectionIsRestricted: result.documentSectionObjs[i][$scope.nameSpacePrefix + 'IsRestricted__c'],
                    sectionName: result.documentSectionObjs[i].Name,
                    sectionContent: result.documentSectionObjs[i][$scope.nameSpacePrefix + 'SectionContent__c'],
                    sectionSequence: result.documentSectionObjs[i][$scope.nameSpacePrefix + 'Sequence__c'],
                    sectionType: result.documentSectionObjs[i][$scope.nameSpacePrefix + 'Type__c'],
                    sectionNonStandard: result.documentSectionObjs[i][$scope.nameSpacePrefix + 'IsSectionNonStandard__c'],
                    sectionShown: false
                };
                if (temporaryObj.sectionContent.indexOf('span class="ins') > 0 || temporaryObj.sectionContent.indexOf('span class="del') > 0) {
                    $scope.redlines.redlinesCount++;
                    temporaryObj.hasRedlines = true;
                }
                if ($scope.isInternetExplorer && temporaryObj.sectionContent.indexOf('padding-left: 0px; width: 100%; display: inline-block;') > -1) {
                    temporaryObj.sectionContent = temporaryObj.sectionContent.replace('padding-left: 0px; width: 100%; display: inline-block;', 'padding-left: 0px; width: 100%; display: block;');
                }

                //turn on/off trackings & buttons based on ContractVersion__c.TrackContractRedLines__c
                if (result.documentVersionObj) {
                    $scope.isTracking = result.documentVersionObj[$scope.nameSpacePrefix + 'TrackContractRedlines__c'];
                    if ($scope.isTracking) {
                        // Enable the ice plugin in TinyMCE
                        $scope.tinymceOptions.ice.isTracking = true;
                        $scope.tinymceOptions.plugins = 'ice ' + $scope.tinymceOptions.plugins;
                        if ($scope.userAccess === 'EditDocument') {
                            $scope.tinymceOptions.toolbar2 = 'preview | forecolor backcolor | table | fontselect fontsizeselect | ice_toggleshowchanges';
                        } else if ($scope.userAccess === 'ReviewDocument' || $scope.userAccess === 'FullDocumentAccess') {
                            $scope.tinymceOptions.toolbar2 = 'preview | forecolor backcolor | table | fontselect fontsizeselect | ice_toggleshowchanges iceacceptall iceaccept icerejectall icereject';
                        }
                    }
                }
                if (result.documentSectionObjs[i][$scope.nameSpacePrefix + 'DisplayHeaderData__c']) {
                    temporaryObj.sectionDisplayHeader = result.documentSectionObjs[i][$scope.nameSpacePrefix + 'DisplayHeaderData__c'];
                }
                temporaryValidationObj = {
                    'sectionName': '',
                    'sectionContent': '',
                    'sectionSaved': true,
                    'sectionErrors': false
                };

                $scope.versionData.sections.push(temporaryObj);
                $scope.validationErrors.sections.push(temporaryValidationObj);
                $scope.removeWrappers(i);
                $scope.showSectionData(temporaryObj.sectionType, temporaryObj.sectionSequence);

            }
            console.log($scope.versionData);
            $timeout(function() {
                $scope.vlcLoading = false;
            }, 1000);
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };
    $scope.getContractSectionsForVersion();

    $scope.formatProductSection = function(sequence) {
        remoteActions.formatProductSection($scope.originalSectionData.documentSectionObjs[sequence]).then(function(result) {
            //$scope.formattedLineItemTable[sequence] = result.replace('<table', '<table class="table" ');
            $scope.versionData.sections[sequence].formattedLineItemTable = result;
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };

    $scope.formatSignatureSection = function(sequence) {
        remoteActions.formatSignatureSection(angular.toJson($scope.versionData.sections[sequence].sectionContent)).then(function(result) {
            $scope.versionData.sections[sequence].sectionContent = result;
            //console.log($scope.versionData.sections[sequence].sectionContent);
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };

    // On click of a section in the left-col:
    $scope.showSectionData = function(type, sequence) {
        var signatureContent, signatureSplit, i;
        $scope.validationMessage.content = '';
        $scope.validationMessage.error = false;
        $scope.bodyHeader = 'Editing ' + type + ' Section';
        $scope.currentSectionSequence = sequence;
        if ($scope.versionData.sections[sequence].sectionType === 'Item') {
            $scope.formatProductSection(sequence);
        }
        // Remove signature strings between \ and \
        if ($scope.versionData.sections[sequence].sectionType === 'Signature') {
            signatureContent = $scope.versionData.sections[sequence].sectionContent;
            // Split string at anything starting with \
            signatureSplit = signatureContent.split(/(?=\\)/);
            for (i = 0; i < signatureSplit.length; i++) {
                if (signatureSplit[i].charAt(0) === '\\') {
                    // If we reach a word starting with \, remove it:
                    signatureContent = signatureContent.replace(signatureSplit[i] + '\\', '');
                }
            }
            // Assign our local signatureContent var back to the $scope sectionContent
            $scope.versionData.sections[sequence].sectionContent = signatureContent;
        }
        // $scope.formatSignatureSection(sequence);
        $scope.versionData.sections[sequence].sectionShown = true;
        $scope.showSaveButton(sequence);
    };

    // Hide save button if isEditableValue is false && isRestricted is true
    $scope.showSaveButton = function(sequence) {
        if ($scope.isEditableValue === false) {
            if ($scope.versionData.sections[sequence].sectionIsRestricted === true) {
                $scope.saveButtonVisible = false;
            } else {
                $scope.saveButtonVisible = true;
            }
        }
        if ($scope.versionData.sections[sequence].sectionType === 'Signature') {
            $scope.saveButtonVisible = false;
        } else {
            $scope.saveButtonVisible = true;
        }
    };

    // Save all sections link btn in the left column
    $scope.saveAllSections = function() {
        var j, l, m;
        // Need to check that no client-side validation errors are present in any unsaved sections before proceeding with bulk save:
        var sectionErrorsExist = false;
        // If we're all clean then save everything:
        if (!sectionErrorsExist) {
            // Add wrappers for saving & assign new data back into originalSectionData so it is saved properly:
            for (j = 0; j < $scope.versionData.sections.length; j++) {
                // Once saved, this section immediately gets flagged as 'non-standard':
                if ($scope.validationErrors.sections[j].sectionSaved === false) {
                    $scope.versionData.sections[j].sectionNonStandard = true;
                }

                if ($scope.versionData.sections[j].sectionType !== 'Item' && $scope.versionData.sections[j].sectionType !== 'Signature') {
                    $scope.insertWrappers(j);
                    // Assign data back into expected DocumentContentStructure format (previously cached):
                    $scope.originalSectionData.documentSectionObjs[j].Id = $scope.versionData.sections[j].sectionId;
                    $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'IsRestricted__c'] = $scope.versionData.sections[j].sectionIsRestricted;
                    $scope.originalSectionData.documentSectionObjs[j].Name = $scope.versionData.sections[j].sectionName;
                    //$scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'DisplayHeaderData__c'] = $scope.updateDisplayHeader(j, $scope.versionData.sections[j].sectionName);
                    $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'DisplayHeaderData__c'] = $scope.versionData.sections[j].sectionDisplayHeader;
                    $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'SectionContent__c'] = $scope.versionData.sections[j].sectionContent;
                    $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'Sequence__c'] = $scope.versionData.sections[j].sectionSequence;
                    $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'Type__c'] = $scope.versionData.sections[j].sectionType;
                    $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'IsSectionNonStandard__c'] = $scope.versionData.sections[j].sectionNonStandard;
                    if ($scope.versionData.sections[j].sectionNonStandard) {
                        $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'SectionCreationSource__c'] = 'Customize';
                    }
                }
            }
            console.log('Original Section Data:', $scope.originalSectionData);
            $scope.vlcLoading = true;
            remoteActions.saveAllSections($scope.originalSectionData).then(function() {
                if (!$scope.isCheckIn) {
                    for (l = 0; l < $scope.validationErrors.sections.length; l++) {
                        $scope.validationErrors.sections[l].sectionSaved = true;
                        $scope.validationErrors.sections[l].sectionErrors = false;
                    }
                    $scope.alert.message = $scope.labels.clmContractDocAllSectionsSavedSuccess;
                    $scope.alert.type = 'success';

                    // Remove spans for UI:
                    for (m = 0; m < $scope.versionData.sections.length; m++) {
                        $scope.removeWrappers(m);
                    }
                    $scope.saveAllSectionsBtn.text = $scope.labels.clmContractDocAllSectionsSaved;
                    $scope.bodyHeader = '';
                    $scope.currentSectionSequence = null;
                    $scope.vlcLoading = false;
                } else {
                    $scope.attachDocUrl = location.origin + $scope.sitePrefix + '/apex/'+$scope.nameSpacePrefix+'DocumentGeneration?id=' + $scope.contractId ;
                    window.addEventListener('ContractDocumentAttachDone', function() {
                        remoteActions.checkInDocument($scope.originalSectionData.documentVersionObj).then(function() {
                            $scope.goBack();
                        }, function(error) {
                            $scope.validationErrorHandler(error);
                        });
                    });
                }
            }, function(error) {
                $scope.validationErrorHandler(error);
            });
        }else {
            $scope.vlcLoading = false;
            $scope.alert.message = $scope.labels.clmContractDocValidationErrorCorrect;
            $scope.alert.type = 'danger';
        }
    };

    // Save all sections in console
    $scope.saveAllSectionsConsoleCheckin = function() {
        var j;
        // Need to check that no client-side validation errors are present in any unsaved sections before proceeding with bulk save:
        //var sectionErrorsExist = false;

        // If we're all clean then save everything:
        //if (!sectionErrorsExist) {
        // Add wrappers for saving & assign new data back into originalSectionData so it is saved properly:
        var versionData = document.getElementById('customizeDoc').contentWindow.angular.element('.vlocity').scope().versionData;
        var validationErrors = document.getElementById('customizeDoc').contentWindow.angular.element('.vlocity').scope().validationErrors;
        for (j = 0; j < versionData.sections.length; j++) {
            // Once saved, this section immediately gets flagged as 'non-standard':
            if (validationErrors.sections[j].sectionSaved === false) {
                versionData.sections[j].sectionNonStandard = true;
            }

            if (versionData.sections[j].sectionType !== 'Item' && $scope.versionData.sections[j].sectionType !== 'Signature') {
                //$scope.insertWrappers(j);
                $scope.insertWrappersConsole(j);
                // Assign data back into expected DocumentContentStructure format (previously cached):
                $scope.originalSectionData.documentSectionObjs[j].Id = versionData.sections[j].sectionId;
                $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'IsRestricted__c'] = versionData.sections[j].sectionIsRestricted;
                $scope.originalSectionData.documentSectionObjs[j].Name = versionData.sections[j].sectionName;
                $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'DisplayHeaderData__c'] = versionData.sections[j].sectionDisplayHeader;
                $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'SectionContent__c'] = versionData.sections[j].sectionContent;
                $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'Sequence__c'] = versionData.sections[j].sectionSequence;
                $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'Type__c'] = versionData.sections[j].sectionType;
                $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'IsSectionNonStandard__c'] = versionData.sections[j].sectionNonStandard;
                if (versionData.sections[j].sectionNonStandard) {
                    $scope.originalSectionData.documentSectionObjs[j][$scope.nameSpacePrefix + 'SectionCreationSource__c'] = 'Customize';
                }
            }
        }
        console.log('Original Section Data:', $scope.originalSectionData);
        $scope.vlcLoading = true;
        remoteActions.saveAllSections($scope.originalSectionData).then(function() {
            $scope.attachDocUrl = location.origin + '/apex/DocumentGeneration?id=' + $scope.contractId ;
            console.log('$scope.attachDocUrl: ' + $scope.attachDocUrl);
            window.addEventListener('ContractDocumentAttachDone', function() {
                remoteActions.checkInDocument($scope.originalSectionData.documentVersionObj).then(function() {
                    $scope.goBack();
                });
            });
        }, function(error) {
            $scope.validationErrorHandler(error);
        });
    };

    // Save current section:
    $scope.saveTemplateSection = function(sequence) {
        var i;
        // Validate first
        $scope.validateSection(sequence);
        if ($scope.validationErrors.sectionValid) {
            // Once saved, this section immediately gets flagged as 'non-standard':
            $scope.versionData.sections[sequence].sectionNonStandard = true;
            // Add wrappers for saving & assign new data back into originalSectionData so it is saved properly:
            $scope.insertWrappers(sequence);
            // Assign data back into expected DocumentContentStructure format (previously cached):
            $scope.originalSectionData.documentSectionObjs[sequence].Id = $scope.versionData.sections[sequence].sectionId;
            $scope.originalSectionData.documentSectionObjs[sequence][$scope.nameSpacePrefix + 'IsRestricted__c'] = $scope.versionData.sections[sequence].sectionIsRestricted;
            $scope.originalSectionData.documentSectionObjs[sequence].Name = $scope.versionData.sections[sequence].sectionName;
            $scope.originalSectionData.documentSectionObjs[sequence][$scope.nameSpacePrefix + 'DisplayHeaderData__c'] =
                $scope.updateDisplayHeader(sequence, $scope.versionData.sections[sequence].sectionName);
            $scope.originalSectionData.documentSectionObjs[sequence][$scope.nameSpacePrefix + 'SectionContent__c'] = $scope.versionData.sections[sequence].sectionContent;
            $scope.originalSectionData.documentSectionObjs[sequence][$scope.nameSpacePrefix + 'Sequence__c'] = $scope.versionData.sections[sequence].sectionSequence;
            $scope.originalSectionData.documentSectionObjs[sequence][$scope.nameSpacePrefix + 'Type__c'] = $scope.versionData.sections[sequence].sectionType;
            $scope.originalSectionData.documentSectionObjs[sequence][$scope.nameSpacePrefix + 'IsSectionNonStandard__c'] = $scope.versionData.sections[sequence].sectionNonStandard;
            $scope.vlcLoading = true;
            remoteActions.saveTemplateSection($scope.originalSectionData.documentSectionObjs[sequence]).then(function() {
                // Move the right-col scroll to top so we can actually see the validation msg:
                document.getElementsByClassName('right-col')[0].scrollTop = 0;
                $scope.validationErrors.sections[sequence].sectionSaved = true;
                $scope.validationErrors.sections[sequence].sectionErrors = false;
                $scope.saveAllSectionsBtn.text = $scope.labels.clmContractDocAllSectionsSaved;
                for (i = 0; i < $scope.validationErrors.sections.length; i++) {
                    if ($scope.validationErrors.sections[i].sectionSaved === false) {
                        $scope.saveAllSectionsBtn.text = $scope.labels.saveAllSectionLabel;
                    }
                }
                $scope.removeWrappers(sequence);
                $scope.validationMessage.type = 'alert-success';
                $scope.validationMessage.content = 'Section saved successfully.';
                $scope.validationMessage.error = false;
                $scope.vlcLoading = false;
            }, function(error) {
                $scope.validationErrorHandler(error);
            });
        }
    };

    // Helper method to strip span tags out of sectionContent when loading the UI:
    $scope.removeWrappers = function(sequence) {
        var htmlTagRegex, sectionContentArray, tempSectionContent, i;
        if ($scope.versionData.sections[sequence].sectionContent) {
            htmlTagRegex = /(<[^>]*>)/;
            sectionContentArray = $scope.versionData.sections[sequence].sectionContent.split(htmlTagRegex);
            tempSectionContent = '';
            for (i = 0; i < sectionContentArray.length; i++) {
                if (sectionContentArray[i] !== '<viawrapper>' && sectionContentArray[i] !== '</viawrapper>') {
                    tempSectionContent = tempSectionContent + sectionContentArray[i];
                }
            }
            $scope.versionData.sections[sequence].sectionContent = tempSectionContent;
        }
    };

    // Helper method to add spans into sectionContent before it is saved to the db:
    $scope.insertWrappers = function(sequence) {
        if ($scope.versionData.sections[sequence].sectionContent) {
            $scope.versionData.sections[sequence].sectionContent = $scope.insertViawrappers($scope.versionData.sections[sequence].sectionContent);

            // Check sectionContent to see if the wrapper div exists with document styling:
            if ($scope.versionData.sections[sequence].sectionContent.indexOf('section-content-wrapper') < 0) {
                $scope.versionData.sections[sequence].sectionContent = '<div class="section-content-wrapper" style="font-size: 10pt;">' +
                    $scope.versionData.sections[sequence].sectionContent + '</div>';
            }
        }

        if ($scope.versionData.sections[sequence].sectionDisplayHeader) {
            $scope.versionData.sections[sequence].sectionDisplayHeader = $scope.insertViawrappers($scope.versionData.sections[sequence].sectionDisplayHeader);
        }
    };

    // Helper method to add spans into sectionContent before it is saved to the db for console:
    $scope.insertWrappersConsole = function(sequence) {
        var versionData = document.getElementById('customizeDoc').contentWindow.angular.element('.vlocity').scope().versionData;
        if (versionData.sections[sequence].sectionContent) {
            versionData.sections[sequence].sectionContent = $scope.insertViawrappers(versionData.sections[sequence].sectionContent);

            // Check sectionContent to see if the wrapper div exists with document styling:
            if (versionData.sections[sequence].sectionContent.indexOf('section-content-wrapper') < 0) {
                versionData.sections[sequence].sectionContent = '<div class="section-content-wrapper" style="font-size: 10pt;">' +
                    versionData.sections[sequence].sectionContent + '</div>';
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

    // Helper method to update Display Header if someone has changed the name of a section:
    $scope.updateDisplayHeader = function(sequence, name) {
        var sectionDisplayHeader, htmlTagRegex, sectionDisplayHeaderArray, sectionDisplayHeaderString, i;
        if ($scope.versionData.sections[sequence].sectionDisplayHeader) {
            sectionDisplayHeader = $scope.versionData.sections[sequence].sectionDisplayHeader;
            htmlTagRegex = /(<[^>]*>)/;
            sectionDisplayHeaderArray = sectionDisplayHeader.split(htmlTagRegex);
            //console.log(sectionDisplayHeaderArray);
            for (i = 0; i < sectionDisplayHeaderArray.length; i++) {
                if (sectionDisplayHeaderArray[i].charAt(0) !== '<' &&
                    sectionDisplayHeaderArray[i].charAt(sectionDisplayHeaderArray[i].length - 1) !== '>' &&
                    sectionDisplayHeaderArray[i] !== '') {
                    sectionDisplayHeaderString = sectionDisplayHeaderArray[i];
                    //console.log(sectionDisplayHeaderString);

                    if (isNaN(parseInt(sectionDisplayHeaderString.charAt(0)))) {
                        $scope.versionData.sections[sequence].sectionDisplayHeader =
                            $scope.versionData.sections[sequence].sectionDisplayHeader
                                .replace(
                                    sectionDisplayHeaderString,
                                    name
                                );
                    } else {
                        console.log('With number', sectionDisplayHeaderString);
                        $scope.versionData.sections[sequence].sectionDisplayHeader =
                            $scope.versionData.sections[sequence].sectionDisplayHeader
                                .replace(
                                    sectionDisplayHeaderString.substr(sectionDisplayHeaderString.indexOf(' ') + 1),
                                    name
                                );
                    }
                    console.log($scope.versionData.sections[sequence].sectionDisplayHeader);
                    return $scope.versionData.sections[sequence].sectionDisplayHeader;
                }
            }
            console.log($scope.versionData.sections);
        }
    };

    // Used to validate sectionContent to make sure there is real text available, not just HTML code
    $scope.stripHtml = function(html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    $scope.validateSection = function(sequence) {
        // Reset template sections errors:
        $scope.validationErrors.sections[sequence].sectionName = '';
        $scope.validationErrors.sections[sequence].sectionContent = '';

        // Innocent until proven guilty:
        $scope.validationErrors.sectionValid = true;
        $scope.validationErrors.sections[sequence].sectionErrors = false;

        // Check Current Section Name is not empty:
        if ($scope.versionData.sections[sequence] && !$scope.versionData.sections[sequence].sectionName) {
            $scope.validationErrors.sections[sequence].sectionName = 'Please enter a Section Name.';
            $scope.validationErrors.sections[sequence].sectionErrors = true;
            $scope.validationErrors.sectionValid = false;
        }
        // Check Current Section Content is not empty:
        if ($scope.versionData.sections[sequence] && $scope.versionData.sections[sequence].sectionType !== 'Conditional' &&
            $scope.versionData.sections[sequence].sectionType !== 'Embedded Template') {
            if ($scope.versionData.sections[sequence].sectionContent.indexOf('<img') < 0 && /\S/.test($scope.stripHtml($scope.versionData.sections[sequence].sectionContent)) === false) {
                $scope.validationErrors.sections[sequence].sectionContent = 'Please enter Section Content text.';
                $scope.validationErrors.sections[sequence].sectionErrors = true;
                $scope.validationErrors.sectionValid = false;
            }
        }

        // Check Current Section Content is not empty:
        if ($scope.versionData.sections[sequence].sectionType === 'Item' && $scope.versionData.sections[sequence].sectionLineItems !== undefined) {
            $scope.validationErrors.sections[sequence].sectionContent = 'Please enter Section Content.';
            $scope.validationErrors.sections[sequence].sectionErrors = true;
            $scope.validationErrors.sectionValid = false;
        }
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

    $scope.checkInDocument = function() {
        $scope.isCheckIn = true;
        $scope.saveAllSections();
    };

    $scope.checkInDocumentConsole = function() {
        $scope.isCheckIn = true;
        $scope.saveAllSectionsConsoleCheckin();
    };

    $scope.clearAlert = function() {
        $scope.alert.message = '';
        $scope.alert.type = '';
    };

    $scope.switchToSectionView = function() {
        $scope.vlcLoading = true;
        var sectionViewUrl = location.origin + $scope.sitePrefix + '/apex/'+$scope.nameSpacePrefix+'ContractDocumentSectionView?id=' + $scope.contractId;
        if ($scope.isConsole) {
            // navigate current subtab to the Section View
            sforce.console.getFocusedSubtabId(function (result) {
                var subTabId = result.id;
                sforce.console.getEnclosingPrimaryTabId(function (result) {
                    var primaryTabId = result.id;
                    sforce.console.openSubtab(primaryTabId, sectionViewUrl, true, 'Customize', null, function(result){                        
                        sforce.console.closeTab(subTabId);
                    });
                });
            });
        } else {
            if (!$scope.isSforce) {
                window.top.location.href = sectionViewUrl;
                return false;
            } else if ($scope.isSforce) {
				sectionViewUrl = sectionViewUrl.replace(location.origin, '');
                sforce.one.navigateToURL(sectionViewUrl);
            }
        }
    };
});

},{}],3:[function(require,module,exports){
angular.module('contractDocumentEditSectionsApp').directive('checkSectionSaved', function() {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            validationErrors: '=',
            btnText: '=',
            docSection: '=',
            redlines: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('docSection', function(newValue, oldValue) {
                if( !scope.docSection ) {
                    return;
                }
                scope.$parent.removeWrappers(scope.docSection.sectionSequence);
                if (newValue.sectionType === 'Embedded Template') {
                    if (oldValue.embeddedSections === undefined) {
                        return;
                    }
                }
                if (angular.equals(newValue.tinymceOptions, oldValue.tinymceOptions) === false) {
                    return;
                }
                // tinymce inserts \n linebreaks in the code for their code view which disrupts the data. Ignore.
                if ((oldValue.sectionContent.match(/\n/g) || []).length !== (newValue.sectionContent.match(/\n/g) || []).length) {
                    return;
                }

                // exclude item section and Signature as they are not editable
                if (newValue.sectionType === 'Item' || newValue.sectionType === 'Signature') {
                    return;
                }

                // console.log(angular.toJson(oldValue.sectionContent));
                // console.log(angular.toJson(newValue.sectionContent));
                //Need to only do this on subsequent saves to a section
                if (angular.equals(newValue, oldValue) === false && oldValue.sectionId !== null && oldValue.sectionId !== undefined) {
                    scope.validationErrors.sections[scope.docSection.sectionSequence].sectionSaved = false;
                    scope.btnText.text = window.labels.saveAllSectionLabel;
                    if (!oldValue.hasRedlines && (newValue.sectionContent.indexOf('span class="ins') > 0 || newValue.sectionContent.indexOf('span class="del') > 0 ) ) {                        
                        newValue.hasRedlines = true;
                        scope.redlines.containsRedlines = true;
                        scope.redlines.redlinesCount ++;
                    } else if ( oldValue.hasRedlines && (newValue.sectionContent.indexOf('span class="ins') < 0 && newValue.sectionContent.indexOf('span class="del') < 0)) {
                        newValue.hasRedlines = false;
                        scope.redlines.redlinesCount --;
                        if (scope.redlines.redlinesCount === 0 && scope.redlines.containsRedlines ) {
                            scope.redlines.containsRedlines = false;
                        }
                    }
                }
            },true);
        }
    };
});

},{}],4:[function(require,module,exports){
angular.module('contractDocumentEditSectionsApp').directive('vlcLoader', function() {
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
(function() {
    'use strict';
    window.angular.module('contractDocumentEditSectionsApp').service('browserDetection', ['$window', function($window) {
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
                    if(key === 'safari' && userAgent.match('CriOS')) {
                        return 'chrome';
                    }
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

},{}],6:[function(require,module,exports){
angular.module("contractDocumentEditSectionsApp").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("checkin-console-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="close" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium slds-m-bottom_none" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{labels.customizeReadyCheckInLabel}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral modal-back-btn" ng-click="goBack(); $hide()">{{labels.noCheckInLabel}}</button>\n            <button type="button" class="slds-button slds-button_neutral modal-cancel-btn" ng-click="$hide()">{{labels.cancelLabel}}</button>\n            <button type="button" class="slds-button slds-button_brand modal-check-in-btn" ng-click="checkInDocumentConsole(); $hide();">{{labels.yesCheckInLabel}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n'),$templateCache.put("dir-pagination-controls.tpl.html",'<ul class="pagination" ng-if="1 < pages.length">\n    <li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(1)">&laquo;</a>\n    </li>\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a>\n    </li>\n    <li ng-repeat="pageNumber in pages track by $index" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' }">\n        <a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a>\n    </li>\n\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a>\n    </li>\n    <li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.last)">&raquo;</a>\n    </li>\n</ul>'),$templateCache.put("pdf-contains-redlines-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium slds-m-bottom_none" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{labels.downloadDocRedlineLabel}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral modal-cancel-btn" ng-click="$hide()">{{labels.cancelLabel}}</button>\n            <button type="button" class="slds-button slds-button_brand modal-download-btn" ng-click="downloadPdf(); $hide();">{{labels.yesDownloadLabel}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n\n'),$templateCache.put("docx-contains-redlines-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium slds-m-bottom_none" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{labels.downloadDocRedlineLabel}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral modal-cancel-btn" ng-click="$hide()">{{labels.cancelLabel}}</button>\n            <button type="button" class="slds-button slds-button_brand modal-download-btn" ng-click="downloadDocx(); $hide();">{{labels.yesDownloadLabel}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n\n'),$templateCache.put("checkin-modal.tpl.html",'<div class="slds-modal slds-fade-in-open" tabindex="-1" role="dialog">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n           <button class="slds-button slds-button_icon-inverse slds-modal__close" ng-click="$hide();">\n                <slds-svg-icon id="clause-page-header_icon" sprite="\'action\'" icon="\'close\'" size="\'medium\'"></slds-svg-icon>\n            </button>\n            <h4 class="slds-text-heading_medium slds-m-bottom_none" ng-bind-html="title"></h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{labels.customizeReadyCheckInLabel}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral modal-back-btn" ng-click="goBack(); $hide()">{{labels.noCheckInLabel}}</button>\n            <button type="button" class="slds-button slds-button_neutral modal-cancel-btn" ng-click="$hide()">{{labels.cancelLabel}}</button>\n            <button type="button" class="slds-button slds-button_brand modal-check-in-btn" ng-click="checkInDocument(); $hide();">{{labels.yesCheckInLabel}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n')}]);

},{}]},{},[1]);
})();

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
angular.module('ObjectDocumentPdfMergeApp', ['vlocity', 'mgcrea.ngStrap',
    'ngSanitize', 'viaDirectives', 'ngAnimate'])
    .config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}]);

// Controllers
require('./modules/ObjectDocumentPdfMergeApp/controller/ObjectDocPdfMergeController.js');
require('./modules/ObjectDocumentPdfMergeApp/directive/FilePreviewPdfTron.js'); 

},{"./modules/ObjectDocumentPdfMergeApp/controller/ObjectDocPdfMergeController.js":2,"./modules/ObjectDocumentPdfMergeApp/directive/FilePreviewPdfTron.js":3}],2:[function(require,module,exports){
angular.module('ObjectDocumentPdfMergeApp').controller('ObjectDocPdfMergeController', [
    '$scope', 'remoteActions', '$window', '$q', '$timeout', function($scope, remoteActions, $window, $q, $timeout) {
    'use strict';
    this.$onInit = function() {
        $scope.showProcessMsg = false;
        $scope.pdfIntegrationConfig={};
        $scope.vlcLoading = true;
        $scope.selectedTemplates = [];
        $scope.labels = (window.labels || {});
        $scope.clientSidePdfGenerationConfig={};
        $scope.isPdfDownloadReady = false;
        $scope.pdfSinglePageViewer = {};
        $scope.pdfViewer='vlocityclientsideviewer';
        $scope.generatedContentVersion={};
        $scope.generatedPDFContentVersion={};
        $scope.pdfIntegrationConfig={};
		$scope.sitePrefix = '';
        if (window.pdfViewer !== undefined) {
            $scope.pdfViewer =window.pdfViewer.toLowerCase();
        }
        if (window.nameSpacePrefix !== undefined) {
            $scope.nameSpacePrefix = window.nameSpacePrefix;
        }
		if (window.sitePrefix !== undefined) {
			$scope.sitePrefix = window.sitePrefix;
			sforce.connection.serverUrl = $scope.sitePrefix + sforce.connection.serverUrl;
		}

        $window.parent.postMessage({'GET_Merge_BPTREE_RESPONSE': true}, '*');
        
    }

    $window.addEventListener('message', function(event) {
        if(!event.data.hasOwnProperty('clmDocxMergeBpTreeResponse')) {
            return;
        }
        $scope.bpTreeResponse = event.data.clmDocxMergeBpTreeResponse;
        $scope.pdfIdList = []
        $scope.selectedTemplates = $scope.bpTreeResponse.templates;
        $scope.contextId = $scope.bpTreeResponse.contextId;
        $scope.inTest = ($scope.bpTreeResponse.inTest && $scope.bpTreeResponse.inTest === 'true');
        $scope.documentType = (($scope.bpTreeResponse.documentType && $scope.bpTreeResponse.documentType.toLowerCase()) || 'all');
        $scope.attachPdfFormat = $scope.bpTreeResponse.attachPdfFormat;
        $scope.showDownloadPDF = ($scope.inTest || $scope.documentType === 'all' || $scope.documentType === 'pdf');
        $scope.osPdfViewer = $scope.bpTreeResponse.pdfViewer && $scope.bpTreeResponse.pdfViewer.toLowerCase();
        
        if($scope.osPdfViewer == 'vlocityclientsideviewer') {
            $scope.pdfViewer = 'vlocityclientsideviewer';
        } else if($scope.osPdfViewer == 'none'){
            $scope.pdfViewer = 'none';
        }
        for(var i=0;i<$scope.selectedTemplates.length; i++) {
            /*var myObj  = {};
            myObj[$scope.selectedTemplates[i].Name] = $scope.selectedTemplates[i].docGenContentVersionId;
            $scope.templateContentVersionIds.push(myObj);*/ 
            $scope.pdfIdList.push($scope.selectedTemplates[i].pdfGenContentVersionId);
        }
        $scope.getPDFIntegrationConfig();
        
    }, false);
    
    $scope.mergeDocuments = function(pdfTronLicense) {
        mergeDocuments($scope.pdfIdList, pdfTronLicense).then(function(result){
            result.getFileData().then(function(pdf){
                var base64Data = $scope.arrayBufferToBase64(pdf);
                var filename = $scope.contextId+'.pdf';
                $scope.saveGeneratedPdfFile( filename,base64Data );
                console.log(pdf);
            },function(error) {
                $scope.vlcLoading = false;
            });
        },function(error) {
            $scope.vlcLoading = false;
        });
    }

    $scope.getPDFIntegrationConfig = function (){
        pdfTronSetResourcePath(remoteActions, $scope.clientSidePdfGenerationConfig).then(function(result){
            if ( $scope.labels.VlocityPDFTronNoSystemUserMsg === result){
                console.log('### Error occured: ', result);
            } else {
                $scope.clientSidePdfGenerationConfig = result.clientSidePdfGenerationConfig
                $scope.pdfIntegrationConfig= JSON.parse(result.license);
                $scope.mergeDocuments(result.license);
            }
        });
    } 


    //generate PDF using pdfTron.
    $scope.saveGeneratedPdfFile = function(fileName, fileContent) {
        var contentVersionSObj = new sforce.SObject('ContentVersion');
        contentVersionSObj.Title = fileName;
        contentVersionSObj.PathOnClient = fileName;
        contentVersionSObj.VersionData = fileContent;

        sforce.connection.sessionId = window.sessionId;
        sforce.connection.create([contentVersionSObj], {
            onSuccess: function(result) {
                var status = result[0].getBoolean('success');
                var generatedContentVersionId = result[0].id;
                
                $scope.generatedPDFContentVersion = {
                     'Id': generatedContentVersionId,
                     'Title': fileName,
                     'VersionData': fileContent
                }
                $scope.isPdfDownloadReady = true;
                $scope.vlcLoading = false;
                $scope.$apply();
                //link the new ContentVersion record to the Object based on the attachFileFormat setup value('PDF' or 'Word,PDF').
                if($scope.attachPdfFormat) {
                    $scope.linkContentVersionToObject($scope.generatedPDFContentVersion.Id);
                }
            },
            onFailure: function(result) {
                $scope.vlcLoading = false;
                console.log(result);
            } 
        });
    };

    $scope.linkContentVersionToObject = function(contentVersionId) {
        var inputData = {
            'contentVersionId': contentVersionId,
            'contextId': $scope.contextId
        };
        remoteActions.linkContentVersionToObject(inputData).then(function(result) {
            //$scope.vlcLoading = false;
        }, function(error) {
            $scope.vlcLoading = false;
        });
    };

    $scope.downloadFile = function() {
        var urlPrefix = $scope.sitePrefix + '/sfc/servlet.shepherd/version/download/';
        location.href = urlPrefix + $scope.generatedPDFContentVersion.Id;
    };

    $scope.arrayBufferToBase64 = function ( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }
}]);

},{}],3:[function(require,module,exports){
angular.module('ObjectDocumentPdfMergeApp').directive('filePreviewPdfTron', ['$timeout', function($timeout) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            width: '=',
            height: '='
        },
        link: function(scope, elem, attrs) {
            var webViewerCustomOptions = {
                'clientSidePdfGenerationConfig':scope.$parent.$parent.clientSidePdfGenerationConfig
            };
            var wvElement = document.getElementById('viewer');
            var  wv = new PDFTron.WebViewer({
                // get path from pdf config 
                path: scope.$parent.$parent.clientSidePdfGenerationConfig['cs_pdftron_lib'],
                //List the elements that need to hide/disable.
                disabledElements: [
                    'toolsButton',
                    'textPopup'
                ], 
                custom: JSON.stringify(webViewerCustomOptions),
                l: atob(scope.$parent.$parent.pdfIntegrationConfig),
               // config:'/resource/' + scope.$parent.$parent.nameSpacePrefix + 'cs_pdftron_config'
            }, wvElement);
           
            window.addEventListener('ready', function(event) {
                console.log('document ready to load', wv.getInstance());
                //Set WorkerPath before loading the document
                var coreContrls = wv.iframe.contentWindow.CoreControls;
                setWorkerPath(coreContrls,scope.$parent.$parent.clientSidePdfGenerationConfig);
                //Load document for previewer
                var instance =wv.getInstance();
                instance.disableDownload(); // disable download feature
                instance.disablePrint(); // disable print feature
                instance.disableTools(); //disable the tools that are used for editing the document.
                wv.loadDocument(base64ToBlob(scope.$parent.$parent.generatedPDFContentVersion.VersionData));
            });

            //Method to set the CoreControls Worker Path
            function setWorkerPath(coreContrls, clientSidePdfGenerationConfig){
                coreContrls.forceBackendType('ems');
                //window.CoreControls.setPDFWorkerPath(clientSidePdfGenerationConfig['cs_pdftron_full']);
                coreContrls.setPDFWorkerPath(clientSidePdfGenerationConfig['cs_pdftron_lean']);
                coreContrls.setOfficeWorkerPath(clientSidePdfGenerationConfig['cs_pdftron_office']);
                coreContrls.setPDFResourcePath(clientSidePdfGenerationConfig['cs_pdftron_resource']);
                coreContrls.setPDFAsmPath(clientSidePdfGenerationConfig['cs_pdftron_asm']);
                coreContrls.setExternalPath(clientSidePdfGenerationConfig['cs_pdftron_external']);
                //Set the path for Fonts
                coreContrls.setCustomFontURL(clientSidePdfGenerationConfig['cs_vlocity_webfonts_main'] + '/');
                //Set the path for office workers
                coreContrls.setOfficeAsmPath(clientSidePdfGenerationConfig['cs_pdftron_officeasm']); //cs_pdftron_officeresource
                coreContrls.setOfficeResourcePath(clientSidePdfGenerationConfig['cs_pdftron_officeresource']);
            }

            var base64ToBlob = function(base64) {
                var binaryString = window.atob(base64);
                var len = binaryString.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; ++i) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
              
                return new Blob([bytes], { type: 'application/pdf' });
            };
        } 
    };
}]);
},{}]},{},[1]);
})();

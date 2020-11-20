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
/* globals fileNsPrefixDot, fileNsPrefix */
angular.module('drvcomp', ['vlocity', 'sldsangular', 'ngSanitize', 'ngAnimate'])
  .config(['$compileProvider', function ($compileProvider) {
      'use strict';
      $compileProvider.debugInfoEnabled(false);
  }]).config(['$localizableProvider', function($localizableProvider) {
      'use strict';
      $localizableProvider.setLocalizedMap(window.localeMap);
      $localizableProvider.setDebugMode(window.ns === '');
  }]).constant('fileNsPrefixDot', fileNsPrefixDot)
     .constant('fileNsPrefix', fileNsPrefix)
     .constant('replacementNamespace', '%vlocity_namespace%')
     .constant('replacementURLFormatNamespace', '%vlocity_url_namespace%');

require('./modules/drvcomp/config/config.js');

require('./modules/drvcomp/filter/RecursionHelper.js');
require('./modules/drvcomp/filter/readableDataPackTypeName.js');
require('./modules/drvcomp/filter/fixExportMessage.js');
require('./modules/drvcomp/filter/adaptErrorMessage.js');
require('./modules/drvcomp/filter/groupByType.js');

require('./modules/drvcomp/templates/templates.js');

require('./modules/drvcomp/directive/AppFileReader.js');
require('./modules/drvcomp/directive/DrvCompTree.js');
require('./modules/drvcomp/directive/drv-export.js');
require('./modules/drvcomp/directive/drv-import.js');

require('./modules/drvcomp/factory/drvDataPack.js');
require('./modules/drvcomp/factory/drvImportScopeManager.js');

},{"./modules/drvcomp/config/config.js":2,"./modules/drvcomp/directive/AppFileReader.js":3,"./modules/drvcomp/directive/DrvCompTree.js":4,"./modules/drvcomp/directive/drv-export.js":5,"./modules/drvcomp/directive/drv-import.js":6,"./modules/drvcomp/factory/drvDataPack.js":7,"./modules/drvcomp/factory/drvImportScopeManager.js":8,"./modules/drvcomp/filter/RecursionHelper.js":9,"./modules/drvcomp/filter/adaptErrorMessage.js":10,"./modules/drvcomp/filter/fixExportMessage.js":11,"./modules/drvcomp/filter/groupByType.js":12,"./modules/drvcomp/filter/readableDataPackTypeName.js":13,"./modules/drvcomp/templates/templates.js":14}],2:[function(require,module,exports){
angular.module('drvcomp')
    .config(['remoteActionsProvider', 'fileNsPrefixDot', function(remoteActionsProvider, fileNsPrefixDot) {
        'use strict';
        var remoteActions = {
            runExport: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.runExport',
                config: {escape: false}
            },
            runImport: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.runImport',
                config: {escape: false}
            },
            runActivate: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.runActivate',
                config: {escape: false}
            },
            updateDataPackData: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.updateDataPackData',
                config: {escape: false}
            },
            addDataPack: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.addDataPack',
                config: {escape: false}
            },
            saveDataPack: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.saveDataPack'
            },
            updateDataPackInfo: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.updateDataPackInfo'
            },
            publishDataPack: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.publishDataPack'
            },
            saveLibraryOrgs: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.saveLibraryOrgs'
            },
            deleteLibraryOrgs: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.deleteLibraryOrgs'
            },
            getDataPack: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getDataPack'
            },
            getInstalledTabDataPacks: {
                 action: fileNsPrefixDot() + 'DRDataPackRunnerController.getInstalledTabDataPacks',
                config: {escape: false}
            },
            getPublishedTabDataPacks: {
                 action: fileNsPrefixDot() + 'DRDataPackRunnerController.getPublishedTabDataPacks',
                config: {escape: false}
            },
            getAllDataPackData: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getAllDataPackData',
                config: {escape: false}
            },
            getDataPackDataChunks: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getDataPackDataChunks',
                config: {escape: false}
            },
            getAllDataPacks: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getAllDataPacks'
            },
            getAllDataPacksNoSummary: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getAllDataPacksNoSummary'
            },
            getOrganizations: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getOrganizations'
            },
            getRemoteDataPacks: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getRemoteDataPacks'
            },
            getRemoteDataPackData: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getRemoteDataPackData',
                config: {escape: false}
            },
            getRemoteDataPackDataChunks: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getRemoteDataPackDataChunks',
                config: {escape: false}
            },
            getStoredPublicDataPackData: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getStoredPublicDataPackData',
                config: {escape: false}
            },
            deleteDataPack: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.deleteDataPack'
            },
            combineDataPacks: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.combineDataPacks'
            },
            refreshDataPack: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.refreshDataPack'
            },
            deleteObject: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.deleteObject'
            },
            deleteObjects: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.deleteObjects'
            },
            ignoreErrorForDataPacks: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.ignoreErrorForDataPacks',
                config: {escape: false}
            },
            getObjectDescription: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getObjectDescription',
                config: {escape: false}
            },
            getDataViaDynamicSoql: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getDataViaDynamicSoql',
                config: {escape: false}
            },
            getBaseDatapacks: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getBaseDatapacks',
                config: {escape: false}
            },
            getCustomLabels: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getCustomLabels',
                config: {escape: false,  buffer: false}
            },
            getActiveTemplates: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getActiveTemplates',
                config: {escape: false,  buffer: false}
            },
            getActiveLayouts: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getActiveLayouts',
                config: {escape: false,  buffer: false}
            },
            getLayoutsByName: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getLayoutsByName',
                config: {escape: false,  buffer: false}
            },
            getCardsByNames: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getCardsByNames',
                config: {escape: false,  buffer: false}
            },
            getTemplatesByName: {
                action: fileNsPrefixDot() + 'DRDataPackRunnerController.getTemplatesByName',
                config: {escape: false,  buffer: false}
            },
            getTemplate: {
                action: fileNsPrefixDot() + 'TemplateController.getTemplate',
                config: {escape: false,  buffer: false}
            },
            getTemplates: {
                action: fileNsPrefixDot() + 'TemplateController.getTemplates',
                config: {escape: false,  buffer: false}
            },
            saveTemplate: {
                action: fileNsPrefixDot() + 'TemplateController.saveTemplate',
                config: {escape: false,  buffer: false}
            },
            setTemplateStatus: {
                action: fileNsPrefixDot() + 'TemplateController.setTemplateStatus',
                config: {escape: false,  buffer: false}
            },
            getCustomSettings: {
                action: fileNsPrefixDot() + 'TemplateController.getCustomSettings',
                config: {escape: false,  buffer: false}
            },
            isInsidePckg: {
                action: fileNsPrefixDot() + 'TemplateController.isInsidePckg',
                config: {escape: false,  buffer: false}
            }
        };
        remoteActionsProvider.setRemoteActions(remoteActions);
    }]);

},{}],3:[function(require,module,exports){
angular.module('drvcomp')
    .directive('appFilereader', function ($q, $document) {
        'use strict';
        /*
        	    made by elmerbulthuis@gmail.com WTFPL licensed
        */
        var isAdvancedUpload = function() {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
        }();

        var droppedFiles = false;

        function readFile(file, readAs) {
            var deferred = $q.defer();

            var reader = new FileReader();
            reader.onload = function (e) {
                deferred.resolve(e.target.result);
            };
            reader.onerror = function (e) {
                deferred.reject(e);
            };
            if (!readAs || readAs.toLowerCase() == 'text') {
                reader.readAsText(file);
            } else if (readAs.toLowerCase() == 'data-url') {
                reader.readAsDataURL(file);
            } else if (readAs.toLowerCase() == 'binary-string') {
                reader.readAsBinaryString(file);
            } else if (readAs.toLowerCase() == 'array-buffer') {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file);
            }

            return deferred.promise;
        }

        var slice = Array.prototype.slice;
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                filename: '=',
                filetype: '=?',
                dragDropElementSelector: '@?',
                readAs: '@?'
            },
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }
                if (isAdvancedUpload) {
                    var $modal;
                    if (scope.dragDropElementSelector) {
                        $modal = element.closest(scope.dragDropElementSelector);
                    } else {
                        $modal = element.closest('.slds-modal');
                    }
                    $modal.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    })
                    .on('dragover dragenter dragleave dragend drop',  _.throttle(function(event) {
                        if (event.type === 'dragover' || event.type === 'dragenter') {
                            $modal.addClass('is-dragover');
                        }  else {
                            $modal.removeClass('is-dragover');
                        }
                    }, 200))
                    .on('drop', function(e) {
                        if (e.originalEvent.dataTransfer.files) {
                            $q.all(slice.call(e.originalEvent.dataTransfer.files, 0)
                                .map(function(file) {
                                    scope.filename = file.name;
                                    try {
                                        scope.filetype = file.type || file.headers["content-type"];
                                    } catch (e) {}
                                    return readFile(file, scope.readAs);
                            })).then(function (values) {
                                if (element.multiple) {
                                    ngModel.$setViewValue(values);
                                } else {
                                    ngModel.$setViewValue(values.length ? values[0] : null);
                                }
                                element.value = null;
                                element.disabled = false;
                            });
                        }
                    });
                }

                ngModel.$render = function () {};

                element.bind('change', function (e) {
                    var element = e.target;
                    if (!element.value) {
                        return;
                    }

                    element.disabled = true;
                    $q.all(slice.call(element.files, 0)
                        .map(function (file) {
                            scope.filename = file.name;
                            try {
                                scope.filetype = file.type || file.headers["content-type"];
                            } catch (e) {}
                            return readFile(file, scope.readAs);
                        })).then(function (values) {
                        if (element.multiple) {
                            ngModel.$setViewValue(values);
                        } else {
                            ngModel.$setViewValue(values.length ? values[0] : null);
                        }
                        element.value = null;
                        element.disabled = false;
                    });
                }); //change

            } //link

        }; //return

    }) //appFilereader
;
},{}],4:[function(require,module,exports){
angular.module('drvcomp').directive('drvComptree', function(RecursionHelper) {
    return {
        restrict: 'E',
        templateUrl: 'DrvCompTree.tpl.html',
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
                scope.$watchGroup(['isEditable', 'isLocked', 'expandAll'], function() {
                    scope.update();
                });
                scope.$watch('objectData',function() {
                    scope.update();
                },true);
            });
        },

        scope: {
            objectData: '=',
            recordStatus: '=',
            showStatus: '=',
            isEditable: '=',
            isLocked: '=',
            hideLabel: '=',
            expandAll: '=',
            depth: '='
        },

        controller: function($scope) {

            $scope.hideLabel === $scope.hideLabel === true || $scope.hideLabel === 'true';

            $scope.filteredType = function(key) {
                return /(MapItem__c|CalculationProcedureStep__c|CalculationMatrixRow__c|Element__c)/.test(key);
            }

            $scope.getDisplayType = function (obj) {

                var displayType = 'VlocityDataPack';
                var displayName = 'VlocityDataPack';

                if (obj != null)
                                {
                    if (obj['VlocityDataPackType'] == 'SObject')
                    {
                        displayType = obj.VlocityRecordSObjectType ? obj.VlocityRecordSObjectType : obj.VlocityDataPackType;
                        displayName = obj.Name ? obj.Name : obj.VlocityDataPackType;
                    }
                    else if ($scope.objectData['VlocityDataPackKey'] != null)
                    {
                        displayType = 'VlocityDataPack';
                        displayName = obj.VlocityDataPackLabel;
                    }
                    else if ($scope.objectData['VlocityDataPackType'] == 'VlocityLookupMatchingKeyObject')
                    {
                        displayType = 'Reference';
                        displayName = obj.VlocityRecordSObjectType;
                    }
                }

                return {'displayType' : displayType, 'displayName' : displayName};
            };

            $scope.update = function() {
                var oldShowChildren = $scope.showChildren;
                $scope.showChildren = {};
                $scope.displayChildren = {};
                $scope.recordStatusObject = {};

                angular.forEach($scope.recordStatus, function(stats) {
                    $scope.recordStatusObject[stats.VlocityRecordSourceKey] = stats;
                });

                var displayInfo = $scope.getDisplayType($scope.objectData);

                $scope.displayType = displayInfo.displayType;
                $scope.displayName = displayInfo.displayName;
                $scope.displayMessage = $scope.objectData.VlocityDataPackWarning ? $scope.objectData.VlocityDataPackWarning : '';
                $scope.displayActiveWarning = $scope.objectData.VlocityDataPackActiveWarning ? $scope.objectData.VlocityDataPackActiveWarning : '';
                $scope.displayMoreInfo = $scope.objectData.VlocityDataPackMoreInfo ? $scope.objectData.VlocityDataPackMoreInfo : '';


                if ($scope.objectData.VlocityRecordSourceKey && $scope.recordStatusObject[$scope.objectData.VlocityRecordSourceKey])
                {
                    $scope.displayStatus = $scope.recordStatusObject[$scope.objectData.VlocityRecordSourceKey].VlocityRecordStatus;
                }

                if ($scope.displayStatus == 'Error')
                {
                    $scope.displayError = $scope.recordStatusObject[$scope.objectData.VlocityRecordSourceKey].VlocityRecordError;
                }

                if ($scope.objectData.VlocityDataPackIsIncluded == null)
                                    {
                    $scope.objectData.VlocityDataPackIsIncluded = true;
                }

                angular.forEach($scope.objectData, function(value, key)
                {
                    if (angular.isArray(value))
                    {
                        for (var i = 0; i < value.length; i++)
                        {
                            if (angular.isObject(value[i]))
                            {
                                var childDisplayInfo = $scope.getDisplayType(value[i]);

                                if ($scope.displayChildren[childDisplayInfo.displayType] == null)
                                                                {
                                    $scope.displayChildren[childDisplayInfo.displayType] = [];
                                }

                                $scope.displayChildren[childDisplayInfo.displayType].push(value[i]);

                                var oldShowValue = oldShowChildren && oldShowChildren[childDisplayInfo.displayType];
                                $scope.showChildren[childDisplayInfo.displayType] = oldShowValue || !!$scope.expandAll;
                            }
                        }
                    }
                });
            };

            $scope.selectedChildCount = function(array) {
                return array.reduce(function(count, child) {
                    return child.VlocityDataPackIsIncluded ? count + 1 : count;
                }, 0);
            }
        },
    };
});

},{}],5:[function(require,module,exports){
angular.module('drvcomp')
    .provider('$drvExport', function() {
        'use strict';

        this.$get = function($sldsModal, $sldsPrompt, remoteActions, $rootScope, $q,
                                        drvDataPack, drvImportScopeManager, fileNsPrefix) {

            function DrvExportFactory(config) {
                if (this === window || this == null) {
                    return new DrvExportFactory(config);
                }
                this.config = config;
                if (angular.element(document.querySelectorAll('.via-slds')).length === 0) {
                    // inject an element with class slds to hook our modal into
                    $('body').append('<div class="via-slds"></div>');
                }

                // show our export modal
                var modalScope = drvImportScopeManager(config.scope);
                modalScope.fileNsPrefix = fileNsPrefix();
                modalScope.loading = true;
                modalScope.exportTo = {
                    name: ''
                };
                modalScope.drvDataPackType = config.drvDataPackType;
                modalScope.drvMaxDepth = config.drvMaxDepth;
                modalScope.stage = 0;
                modalScope.viewModel = {
                    download: true,
                    addToLibrary: false,
                    createNewVersion: true
                };

                modalScope.cancel = function() {
                    if (modalScope.dataToProcess && modalScope.dataToProcess.dataPackId) {
                        remoteActions.deleteDataPack(modalScope.dataToProcess.dataPackId);
                    }
                    thisModal.hide();
                };

                function getLatestDataPacks() {
                    return remoteActions.getAllDataPacksNoSummary()
                        .then(function(existingDataPacks) {
                            modalScope.$watch('datapack.Name', function(newName) {
                                var remainingPacks = existingDataPacks.filter(function(existing) {
                                    var isCorrectType = (existing.Type === 'Export' || existing.Type === 'MultiPack');
                                    var isPublishedOrSaved = /(Saved|Published)/.test(existing.Status);
                                    if (isCorrectType && isPublishedOrSaved) {
                                        existing.Version = existing.Version == null ? 1 : +existing.Version;
                                        return existing.Name === newName;
                                    } else {
                                        return false;
                                    }
                                }).sort(function(a, b) {
                                    return a.Version > b.Version ? -1 : (a.Version < b.Version ? 1 : 0);
                                });
                                if (remainingPacks.length > 0) {
                                    modalScope.viewModel.existingVersion = remainingPacks[0].Version;
                                    modalScope.viewModel.existingId = remainingPacks[0].Id;
                                    modalScope.viewModel.newVersion = Math.floor(remainingPacks[0].Version + 1);
                                } else {
                                    modalScope.viewModel.existingVersion = 0;
                                    modalScope.viewModel.newVersion = 1;
                                }
                            });
                        }, function(error) {
                            modalScope.viewModel.existingVersion = 0;
                            modalScope.viewModel.newVersion = 1;
                        });
                }

                if (!config.drvDataPackType) {
                    console.error('Missing value for drv-data-pack-type attribute or drvDataPackType in $drvExport');
                }

                if (config.drvDataPackType === 'MultiPack') {
                    modalScope.stage = 2;
                    $q.all(Object.keys(config.drvSelected).map(function(key) {
                        return drvDataPack.getAllDataPackData(config.drvSelected[key]);
                    })).then(function(datapacks) {
                        modalScope.loading = false;
                        modalScope.dataToProcess = {
                            dataPacks: datapacks.reduce(function(array, datapack) {
                                return array.concat(datapack.dataPacks);
                            }, [])
                        };
                        modalScope.addAdditionalInfo(modalScope.dataToProcess.dataPacks);
                    });
                    modalScope.datapack = {
                        Name: 'MultiPack',
                        types: 'MultiPack',
                        Source: 'Local'
                    };
                } else {
                    var exportData;
                    if (config.drvSelected) {
                        exportData = config.drvSelected;
                    } else {
                        exportData = {'Id': config.drvExport};
                    }

                    drvDataPack.prepareDataPackForExport(config.drvDataPackType, exportData, config.drvMaxDepth, '')
                        .then(function(dataToProcess) {
                            modalScope.stage = Math.min(modalScope.stage + 1, 3);
                            modalScope.dataToProcess = dataToProcess;
                            modalScope.addAdditionalInfo(modalScope.dataToProcess.dataPacks);
                            return remoteActions.getDataPack(dataToProcess.dataPackId);
                        }, function(error) {
                            modalScope.error = error;
                            modalScope.loading = false;
                        }, function(progress) {
                            modalScope.progress = progress;
                        }).then(function(dataPack) {
                            if (!thisModal.$isShown) {
                                //modal was closed before we completed so lets remove the datapack
                                remoteActions.deleteDataPack(modalScope.dataToProcess.dataPackId);
                            } else {
                                dataPack.Name = config.drvSuggestedName ? config.drvSuggestedName : '';
                                modalScope.datapack = dataPack;
                            }
                            modalScope.loading = false;
                        }, function(error) {
                            modalScope.error = error;
                            modalScope.loading = false;
                        });
                }

                modalScope.ignoreErrorForDataPacks = function(keys) {
                    modalScope.loading = true;
                    drvDataPack.ignoreErrorForDataPacks(keys, modalScope.dataToProcess, config.drvDataPackType)
                        .then(function(dataToProcess) {
                            // don't move to next stage - we're just dismissing errors before actual export
                            modalScope.dataToProcess = dataToProcess;
                            modalScope.loading = false;
                        }, function(error) {
                            modalScope.error = error;
                            modalScope.loading = false;
                        });
                };

                modalScope.previous = function() {
                    modalScope.stage = Math.max(modalScope.stage - 1, 0);
                    modalScope.dataToProcess = modalScope.originalData;
                };

                modalScope.next = function() {
                    modalScope.stage = Math.min(modalScope.stage + 1, 3);
                    if (modalScope.stage === 2) {
                        modalScope.hideChildren = {};
                        modalScope.originalData = angular.copy(modalScope.dataToProcess);
                        modalScope.dataToProcess = drvDataPack.removeDeselectedKeys(modalScope.dataToProcess);
                    }
                    if (modalScope.stage === 3) {
                        modalScope.loading = true;
                        getLatestDataPacks()
                            .then(function() {
                                modalScope.loading = false;
                            },function() {
                                modalScope.loading = false;
                            });
                    }
                };

                if (config.drvCustomSave) {
                    modalScope.done = function() {
                        modalScope.stage = Math.min(modalScope.stage + 1, 3);
                        modalScope.loading = true;
                        config.drvCustomSave({
                            'modalScope': modalScope,
                            'dataToProcess': modalScope.dataToProcess,
                            'modal': thisModal
                        });
                    };
                } else {
                    modalScope.done = function() {
                        modalScope.stage = Math.min(modalScope.stage + 1, 3);
                        modalScope.loading = true;
                        if (!modalScope.viewModel.createNewVersion) {
                            // need to delete one we just created and change the pack Id to the new pack Id
                            remoteActions.deleteDataPack(modalScope.dataToProcess.dataPackId);
                            modalScope.dataToProcess.dataPackId = modalScope.viewModel.existingId;
                        }
                        drvDataPack.exportDataPack(modalScope.dataToProcess)
                            .then(function(dataToProcess) {
                                return $q.all([
                                    $q.when(dataToProcess),
                                    remoteActions.updateDataPackInfo(modalScope.dataToProcess.dataPackId, {
                                        Name: modalScope.datapack.Name,
                                        Description: modalScope.datapack.Description,
                                        Version: modalScope.viewModel.createNewVersion ?
                                                    modalScope.viewModel.newVersion :
                                                    modalScope.viewModel.existingVersion,
                                        Status: modalScope.viewModel.addToLibrary ? 'Saved' : 'Complete'
                                    })
                                ]);
                            }).then(function(result) {
                                var dataToProcess = result[0];
                                dataToProcess.name = modalScope.datapack.Name;
                                dataToProcess.description = modalScope.datapack.Description;
                                dataToProcess.version = (modalScope.viewModel.createNewVersion ?
                                                    modalScope.viewModel.newVersion :
                                                    modalScope.viewModel.existingVersion);
                                dataToProcess.status = modalScope.datapack.Status;
                                if (modalScope.viewModel.Published) {
                                    return remoteActions.publishDataPack(modalScope.dataToProcess.dataPackId, false)
                                        .then(function() {
                                            return dataToProcess;
                                        });
                                } else {
                                    return dataToProcess;
                                }
                            }).then(function(dataToProcess) {
                                modalScope.dataToProcess = dataToProcess;
                                if (!modalScope.viewModel.addToLibrary) {
                                    return remoteActions.deleteDataPack(modalScope.dataToProcess.dataPackId);
                                } else {
                                    return true;
                                }
                            }).then(function() {
                                if (modalScope.viewModel.download) {
                                    modalScope.downloadFile(modalScope.dataToProcess,
                                                            (/\.json/.test(modalScope.datapack.Name) ?
                                                        modalScope.datapack.Name : modalScope.datapack.Name + '.json'));
                                }
                            }).then(function() {
                                modalScope.stage = Math.min(modalScope.stage + 1, 3);
                                modalScope.loading = false;
                                thisModal.hide();
                            }, function(error) {
                                modalScope.error = error;
                                modalScope.loading = false;
                            }, function(progress) {
                                modalScope.progress = progress;
                            });
                    };
                }

                var thisModal = $sldsModal({
                    title: $rootScope.vlocity.getCustomLabelSync('ExportDataPacksTitle', 'Export DataPacks'),
                    backdrop: 'static',
                    templateUrl: 'DrvExportModal.tpl.html',
                    scope: modalScope,
                    show: true
                });

            }

            return DrvExportFactory;
        };
    })
    .directive('drvExport', function($drvExport) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                drvExport: '=?',
                drvSuggestedName: '=?',
                drvDataPackType: '@',
                drvSelected: '=?',
                backcompatExport: '&',
                drvCustomSave: '&',
                onExportComplete: '&'
            },

            link: function(scope, element, iAttrs) {
                angular.element(element).on('click', function(event) {

                    if (event.altKey && iAttrs.backcompatExport) {
                        scope.backcompatExport({
                            event: event,
                            Id: scope.drvExport
                        });
                        return;
                    }

                    if (!scope.drvDataPackType) {
                        console.error('Missing value for drv-data-pack-type attribute');
                    }

                    $drvExport({
                        scope: scope,
                        drvDataPackType: scope.drvDataPackType,
                        drvSelected: scope.drvSelected,
                        drvExport: scope.drvExport,
                        drvCustomSave: iAttrs.drvCustomSave ? scope.drvCustomSave : null,
                        drvSuggestedName: scope.drvSuggestedName,
                        onExportComplete: scope.onExportComplete
                    });

                });
            }
        };
    });

},{}],6:[function(require,module,exports){
angular.module('drvcomp')
    .provider('$drvImport', function() {
        'use strict';

        this.$get = function($sldsModal, $localizable, drvDataPack, drvImportScopeManager,
                                        fileNsPrefix, remoteActions, replacementNamespace,
                                        replacementURLFormatNamespace, $injector) {
            var replacementRegex, replacementURLRegex;
            if (fileNsPrefix() === '') {
                replacementRegex = new RegExp(replacementNamespace + '(__|\\.|\\/)?', 'g');
                replacementURLRegex = new RegExp(replacementURLFormatNamespace, 'g');
            } else {
                replacementRegex = new RegExp(replacementNamespace, 'g');
                replacementURLRegex = new RegExp(replacementURLFormatNamespace, 'g');
            }

            function b64EncodeUnicode(str) {
                return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
                    return String.fromCharCode('0x' + p1);
                }));
            }

            function configureForOrgMode(modalScope, factory) {
                modalScope.org = factory.config.org;
                modalScope.source = modalScope.org;
                modalScope.selectedPack = factory.config.selectedPack;
                modalScope.selectToImport = function(pack) {
                        if (pack) {
                            modalScope.selectedPack = pack;
                        } else {
                            modalScope.selectedPack = null;
                        }
                    };
                modalScope.triggerRemoteImport = function() {
                        modalScope.loading = true;
                        remoteActions.getRemoteDataPackData(modalScope.org, modalScope.selectedPack.Id)
                            .then(function(json) {
                                modalScope.loading = false;
                                modalScope.dataToProcess = json;
                                modalScope.dataToProcess.name = modalScope.selectedPack.Name;
                                modalScope.dataToProcess.description = modalScope.selectedPack.Description;
                                modalScope.dataToProcess.version = modalScope.selectedPack.Version;
                                modalScope.dataToProcess.status = modalScope.selectedPack.Status;
                                modalScope.dataToProcess.source = modalScope.org;
                                if (modalScope.packs) {
                                    modalScope.packs.forEach(function(pack) {
                                        if (pack.Id === modalScope.selectedPack.Id) {
                                            modalScope.remotePack = pack;
                                        }
                                    });
                                } else {
                                    modalScope.remotePack = modalScope.selectedPack;
                                }
                                modalScope.next();
                            }, function(errors) {
                                modalScope.error = errors;
                            });
                    };
                if (modalScope.selectedPack) {
                    modalScope.triggerRemoteImport();
                } else {
                    var NgTableParams = $injector.get('NgTableParams');
                    modalScope.tableParams = new NgTableParams({
                        }, {
                            debugMode: false,
                            counts: [],
                            getData: function() {
                                modalScope.tableLoading = true;
                                return remoteActions.getRemoteDataPacks(factory.config.org)
                                .then(function(packs) {
                                    modalScope.tableLoading = false;
                                    if (angular.isArray(packs)) {
                                        if (packs.length > 0 && packs[0].errorCode) {
                                            modalScope.error = {
                                                message: 'There was an error retrieving the remote datapack :\n' +
                                                            packs[0].message
                                            };
                                            return null;
                                        } else {
                                            packs.map(function(pack) {
                                                pack.Version = pack.Version == null ? 1 : +pack.Version;
                                                pack.types = pack.DataPacks && pack.DataPacks.length > 0 ?
                                                                    pack.DataPacks[0].VlocityDataPackType : '';
                                                pack.label = pack.DataPacks && pack.DataPacks.length > 0 ?
                                                                    pack.DataPacks[0].VlocityDataPackLabel : '';
                                                return pack;
                                            }).sort(function(a, b) {
                                                return a.Version > b.Version ? -1 : (a.Version < b.Version ? 1 : 0);
                                            });
                                            modalScope.tableParams.count(packs.length);
                                            modalScope.packs = packs;
                                            return packs;
                                        }
                                    }
                                }, function(error) {
                                    modalScope.tableLoading = false;
                                    modalScope.error = error;
                                });
                            }
                        });
                }
            }

            function cleanNamespace(json) {
                var stringVersion = json;
                if (!angular.isString(stringVersion)) {
                    stringVersion = JSON.stringify(json);
                }
                var nsWithoutUnderscores = fileNsPrefix().substring(0, fileNsPrefix().length - 2);
                var nsForURL = nsWithoutUnderscores.replace('_', '-');

                stringVersion = stringVersion.replace(replacementRegex, nsWithoutUnderscores)
                                             .replace(replacementURLRegex, nsForURL);

                return JSON.parse(stringVersion);
            }

            function configureForFileMode(modalScope, factory) {
                modalScope.$watch('import.file', function(file) {
                    if (file != null) {
                        modalScope.hadErrors = false;
                        modalScope.error = null;
                        try {
                            var json = cleanNamespace(file);
                            if (json.dataPacks) {
                                modalScope.dataToProcess = json;
                            } else if (factory.config.handleIncompatibleFile &&
                                        factory.config.handleIncompatibleFile({
                                            json: json,
                                            done: function() {
                                                factory.hide();
                                            }}) !== false) {
                                modalScope.stage = 4;
                                modalScope.loading = true;
                            } else {
                                modalScope.error = {
                                    message: 'Incompatible file type'
                                };
                            }
                        } catch (e) {
                            modalScope.error = {
                                message: 'Incompatible file type'
                            };
                        }
                    }
                });
                modalScope.$watch('import.name', function(name) {
                    if (name && modalScope.dataToProcess && !modalScope.dataToProcess.name) {
                        modalScope.dataToProcess.name = name.replace(/\.json$/, '');
                    }
                });
            }

            function DrvImportFactory(config) {
                if (this === window || this == null) {
                    return new DrvImportFactory(config);
                }
                this.config = config;
                if (!config.scope.onImportComplete && config.onImportComplete) {
                    config.scope.onImportComplete = config.onImportComplete;
                }
                var modalScope = drvImportScopeManager(config.scope);
                modalScope.fileNsPrefix = fileNsPrefix();

                if (config.mode === 'org') {
                    configureForOrgMode(modalScope, this);
                } else if (!config.mode || config.mode === 'file') {
                    config.mode = modalScope.mode = 'file';
                    configureForFileMode(modalScope, this);
                } else if (config.mode === 'publicdata' || config.mode === 'staticresource') {
                    modalScope.loading = true;
                    var dataPackDataPublicId = config.dataPackDataPublicId;
                    var dataPackDataPublicSource = config.dataPackDataPublicSource;
                    modalScope.source = dataPackDataPublicSource;
                    remoteActions.getStoredPublicDataPackData(dataPackDataPublicId, dataPackDataPublicSource)
                        .then(function(json) {
                            modalScope.loading = false;
                            try {
                                modalScope.dataToProcess = cleanNamespace(json);
                                modalScope.next();
                            } catch (e) {
                                modalScope.error = {
                                    message: 'Incompatible file type'
                                };
                            }
                        }, function(errors) {
                            modalScope.loading = false;
                            modalScope.error = errors;
                        });
                }

                if (angular.element(document.querySelectorAll('.via-slds')).length === 0) {
                    // inject an element with class slds to hook our modal into
                    $('body').append('<div class="via-slds"></div>');
                }

                this.hide = function() {
                    thisModal.hide();

                    // Reload Page and strip URL Params when they are being used to run some kind of action
                    if (config.reloadPageOnComplete) {
                        window.location = window.location.pathname;
                    }
                };

                var thisModal = $sldsModal({
                    templateUrl: 'DrvImportModal.tpl.html',
                    backdrop: 'static',
                    scope: modalScope,
                    show: true
                });

            }

            return DrvImportFactory;
        };
    })
    .directive('drvImport', function($drvImport) {
        'use strict';
        return {
            restrict: 'A',
            scope: {
                drvDataPackType: '@',
                mode: '=?',
                org: '=?',
                onImportComplete: '&',
                selectedPack: '=?',
                handleIncompatibleFile: '&'
            },
            link: function(scope, element, iAttrs) {
                angular.element(element).on('click', function() {
                    $drvImport({
                        scope: scope,
                        handleIncompatibleFile: iAttrs.handleIncompatibleFile ? scope.handleIncompatibleFile : null,
                        mode: scope.mode,
                        org: scope.org,
                        onImportComplete: scope.onImportComplete,
                        selectedPack: scope.selectedPack
                    });
                });
            }
        };
    });

},{}],7:[function(require,module,exports){
angular.module('drvcomp')
    .factory('drvDataPack', function(remoteActions, $q) {
        'use strict';

        function setAllDataPackDataChunked(fullDataPackData, initialProcessResult, processedKeys, deferred, onSuccess) {

            var nextDataPack = null;

            fullDataPackData.dataPacks.forEach(function(dataPack) {
                if (processedKeys.indexOf(dataPack.VlocityDataPackKey) === -1) {
                    nextDataPack = dataPack;
                }
            });

            if (nextDataPack === null) {
                onSuccess();
            } else {
                var sendData = {
                    'VlocityDataPackId': fullDataPackData.dataPackId,
                    'dataPack': nextDataPack,
                    'currentProcess': initialProcessResult
                };

                var sendDataString = JSON.stringify(sendData);

                // If less than 2MB do queueable
                if (typeof(vlocityVFActionFunctionControllerHandlers) !== 'undefined' &&
                    typeof(vlocityVFActionFunctionControllerHandlers.runServerMethod) === 'function' &&
                    sendDataString.length > 700000) {

                    vlocityVFActionFunctionControllerHandlers.runServerMethod(
                        fileNsPrefixDot() + 'DRDataPackRunnerController.DRDataPackRunnerControllerOpen',
                            'addDataPack', sendDataString, '{}', true).then(function(result) {
                                result = JSON.parse(result);

                                if (result.Status == 'Success') {
                                    processedKeys.push(nextDataPack.VlocityDataPackKey);
                                    setAllDataPackDataChunked(fullDataPackData, initialProcessResult, processedKeys, deferred, onSuccess);

                                } else {
                                    if (deferred) {
                                        deferred.reject(result);
                                    }
                                }
                            });
                } else {
                    remoteActions.addDataPack(JSON.stringify(sendData)).then(
                        function(result) {
                            if (result.Status == 'Success') {
                                processedKeys.push(nextDataPack.VlocityDataPackKey);
                                setAllDataPackDataChunked(fullDataPackData, initialProcessResult, processedKeys, deferred, onSuccess);

                            } else {
                                if (deferred) {
                                    deferred.reject(result);
                                }
                            }
                        },
                        function(error) {
                            if (deferred) {
                                deferred.reject(error);
                            }
                        });
                }
            }
        }

        function getAllDataPackData(vlocityDataPackId) {
            return getAllDataPackDataFromSource('Local', vlocityDataPackId);
        }

        function getRemoteDataPackData(org, vlocityDataPackId) {
            return getAllDataPackDataFromSource(org, vlocityDataPackId);
        }

        function processAllDataResult(source, dataPackDataInfo, deferred) {
            return function continueProcessResult(result) {

                if (!angular.isObject(result)) {
                    result = JSON.parse(result);
                }

                if (result.VlocityDataPackProcess == 'GetChunks') {
                    // Already in progress
                    getDataPackDataChunksFromSource(source, dataPackDataInfo, result, deferred);

                } else {
                    // Initialization
                    if (Object.keys(result.warnings).length ===  0) {
                        delete result.warnings;
                    }
                    if (Object.keys(result.errors).length ===  0) {
                        delete result.errors;
                    }

                    if (result.isChunked) {

                        var keysToRetrieveInitial = [];

                        // Get all the keys to retrieve as chunks
                        result.dataPacks.forEach(function(dataPack) {
                            keysToRetrieveInitial.push(dataPack.VlocityDataPackKey);
                        });

                        // Empty out the dataPacks Array
                        result.dataPacks = [];

                        var dataPackDataInfoInitial = {
                            allRetrievedData: result,
                            keysToRetrieve: keysToRetrieveInitial,
                            retrievedKeys: []
                        };

                        getDataPackDataChunksFromSource(source, dataPackDataInfoInitial, null, deferred);
                    } else {
                        // Not Chunked so returning full data. Happens when under 900KB
                        deferred.resolve(result);
                    }
                }
            }
        }

        function getAllDataPackDataFromSource(source, vlocityDataPackId) {

            var deferred = $q.defer();

            setTimeout(function() {

                if (source == 'Local') {
                    remoteActions.getAllDataPackData(vlocityDataPackId).then(processAllDataResult(source, null, deferred),
                        function(error) {
                        deferred.reject(error);
                    });
                } else {
                    remoteActions.getRemoteDataPackData(source, vlocityDataPackId).then(processAllDataResult(source, null, deferred),
                        function(error) {
                        deferred.reject(error);
                    });
                }
            });

            return deferred.promise;
        }

        function getDataPackDataChunksFromSource(source, dataPackDataInfo, chunkResult, deferred) {

            if (chunkResult != null) {
                if (chunkResult.dataPacks) {
                    chunkResult.dataPacks.forEach(function(dataPack) {
                        dataPackDataInfo.allRetrievedData.dataPacks.push(dataPack);
                        dataPackDataInfo.retrievedKeys.push(dataPack.VlocityDataPackKey);
                    });
                }
            }

            var keysRemaining = [];

            dataPackDataInfo.keysToRetrieve.forEach(function(key) {
                if (dataPackDataInfo.retrievedKeys.indexOf(key) === -1) {
                    keysRemaining.push(key);
                }
            });

            if (keysRemaining.length == 0) {
                deferred.resolve(dataPackDataInfo.allRetrievedData);
            } else {

                var getNextChunk = {
                    'Source': source,
                    'VlocityDataPackKeys' : keysRemaining,
                    'VlocityDataPackId' : dataPackDataInfo.allRetrievedData.dataPackId
                };

                if (source == 'Local') {
                    return remoteActions.getDataPackDataChunks(JSON.stringify(getNextChunk))
                        .then(processAllDataResult(source, dataPackDataInfo, deferred),
                            function(error) {
                            deferred.reject(error);
                        });
                } else {
                    return remoteActions.getRemoteDataPackDataChunks(JSON.stringify(getNextChunk))
                        .then(processAllDataResult(source, dataPackDataInfo, deferred),
                            function(error) {
                            deferred.reject(error);
                        });
                }
            }
        }

        function runCombine(dataPackList, currentDataPackId, deferred) {
            remoteActions.combineDataPacks(currentDataPackId, dataPackList)
                .then(makeResultHandler('MultiPack', dataPackList, currentDataPackId, deferred),
                    function(error) {
                    deferred.reject(error);
                });
        }

        function runActivate(dataPackKeysToActivate, dataPackId, deferred) {
            var activateData = {
                'VlocityDataPackKeysToActivate': angular.isArray(dataPackKeysToActivate) ? dataPackKeysToActivate :
                                                                                                [dataPackKeysToActivate],
                'VlocityDataPackId' : dataPackId
            };

            remoteActions.runActivate(JSON.stringify(activateData))
                .then(makeResultHandler('Activate', dataPackKeysToActivate, dataPackId, deferred),
                    function(error) {
                    deferred.reject(error);
                });
        }

        function runExport(exportDataPackType, dataPackData, maxDepth, currentDataPackId, deferred) {
            var exportData = {
                'VlocityDataPackType': exportDataPackType,
                'VlocityDataPackData': dataPackData,
                'VlocityDataPackId' : currentDataPackId,
                maxDepth: maxDepth,
                name: '',
                description: '',
                version: 0
            };
            remoteActions.runExport(JSON.stringify(exportData))
                .then(makeResultHandler(exportDataPackType, dataPackData, currentDataPackId, deferred),
                    function(error) {
                    deferred.reject(error);
                });
        }

        function pruneDataJSON(dataObject, removeKeys) {
            // If this is the dataPack parent it will only have a single Array,
            // If that is empty then the whole object is unecessary
            var vlocityDataPackKey = dataObject.VlocityDataPackKey;

            // Check if is Object and isIncluded
            // isIncluded is null not a failure case
            if (angular.isObject(dataObject) &&  !angular.isArray(dataObject) &&
                dataObject.VlocityDataPackIsIncluded === false) {
                return false;
            }
            if (!angular.isObject(dataObject)) {
                return false;
            }

            Object.keys(dataObject).forEach(function(key) {
                if (key !== 'VlocityDataPackParents' && key !== 'VlocityDataPackRecords') {
                    var child = dataObject[key];
                    if (angular.isObject(child)) {
                        if (angular.isArray(child)) {
                            var newArray = [];
                            var wasRemoved = false;
                            for (var i = 0; i < child.length; i++) {
                                // Check to see if children are included
                                if (pruneDataJSON(child[i], removeKeys)) {
                                    newArray.push(child[i]);
                                } else if (angular.isObject(child[i])) {
                                    wasRemoved = true;
                                }
                            }

                            // Replace array
                            if (newArray.length > 0 || wasRemoved) {
                                dataObject[key] = newArray;
                                if (vlocityDataPackKey && newArray.length === 0) {
                                    removeKeys.push(vlocityDataPackKey);
                                }
                            } else if (vlocityDataPackKey != null) {
                                removeKeys.push(vlocityDataPackKey);
                            }
                        } else {
                            // Check to see if children are included
                            pruneDataJSON(child, removeKeys);
                        }
                    }
                }
            });
            return true;
        }

        function removeDeselectedKeys(dataPackData) {
            var removeKeys = [];
            pruneDataJSON(dataPackData, removeKeys);

            var selectedDataPacks = [];
            for (var i = 0; i < dataPackData.dataPacks.length; i++) {
                if (removeKeys.indexOf(dataPackData.dataPacks[i].VlocityDataPackKey) === -1) {
                    selectedDataPacks.push(dataPackData.dataPacks[i]);
                }
            }

            dataPackData.dataPacks = selectedDataPacks;
            return dataPackData;
        }

        function setDataToReady(dataObject, exporting) {
            dataObject = removeDeselectedKeys(dataObject);
            if (exporting) {
                var dataObjectString = JSON.stringify(dataObject);

                // If greater than 900KB
                if (dataObjectString.length > 900000)
                {
                    // If less than 2MB do queueable
                    if (typeof(vlocityVFActionFunctionControllerHandlers) !== 'undefined' &&
                        typeof(vlocityVFActionFunctionControllerHandlers.runServerMethod) === 'function' && dataObjectString.length < 2000000) {
                        return vlocityVFActionFunctionControllerHandlers.runServerMethod(
                            fileNsPrefixDot() + 'DRDataPackRunnerController.DRDataPackRunnerControllerOpen',
                            'updateDataPackData', dataObjectString, '{}', true).then(function(result) {
                                console.log('Finish with Result', result);

                                if (result != null) {
                                    return getAllDataPackData(dataObject.dataPackId);
                                } else {
                                    return $q.reject({message: 'Not found'});
                                }
                            });
                    } else {
                        // Otherwise chunked
                        var allDataPacks = dataObject.dataPacks;

                        dataObject.dataPacks = [];

                        var withoutDataPacks = JSON.stringify(dataObject);

                        dataObject.dataPacks = allDataPacks;

                        return remoteActions.updateDataPackData(dataObject.dataPackId, withoutDataPacks)
                        .then(function(result) {
                            var deferred = $q.defer();

                            setTimeout(function() {
                                setAllDataPackDataChunked(dataObject, {}, [], deferred, function() {
                                    deferred.resolve(getAllDataPackData(dataObject.dataPackId));
                                });
                            });
                            return deferred.promise;
                        });
                    }
                } else {
                    return remoteActions.updateDataPackData(dataObject.dataPackId, dataObjectString)
                    .then(function(result) {
                        if (result != null) {
                            return getAllDataPackData(dataObject.dataPackId);
                        } else {
                            return $q.reject({message: 'Not found'});
                        }
                    });
                }
            } else {
                dataObject.dataPackId = '';
                return $q.as(dataObject);
            }
        }

        var timeoutRate = {}

        function makeResultHandler(dataPackType, dataPackData, currentDataPackId, deferred) {
            return function continueRequest(result) {
                if (!angular.isObject(result)) {
                    result = JSON.parse(result);
                }
                if (result.Finished != null && result.Total != null) {
                    deferred.notify({
                        Finished: result.Finished,
                        Total: result.Total
                    });
                }
                if (/(Ready|InProgress)/.test(result.Status)) {

                    var timeoutTime = result.Async ? 3000 : 100;

                    if (dataPackType == 'Activate') {
                        setTimeout(function() { runActivate(dataPackData, result.VlocityDataPackId, deferred); }, timeoutTime);
                    } else if (dataPackType === 'MultiPack') {
                        setTimeout(function() { runCombine(dataPackData, result.VlocityDataPackId, deferred); }, timeoutTime);
                    } else if (dataPackType) {
                        setTimeout(function() { runExport(dataPackType, dataPackData, -1, result.VlocityDataPackId, deferred); }, timeoutTime);
                    } else {
                        setTimeout(function() { runImport(dataPackData, result.VlocityDataPackId, deferred); }, timeoutTime);
                    }
                } else if (/Complete/.test(result.Status)) {
                    getAllDataPackData(result.VlocityDataPackId)
                        .then(function(dataPackData) {
                            deferred.resolve(dataPackData);
                        }, function(error) {
                            deferred.reject(error);
                        });
                } else if (/Error/.test(result.Status)) {
                    if (dataPackType == 'Activate') {
                        if (result.activationError != null) {
                            result.activationError.forEach(function(errMessObj) {
                                result.message = errMessObj.ActivationMessage;
                            });
                        }

                        if (!result.message) {
                            result.message = result.Error ? result.Error : result.error;
                        }
                        deferred.reject(result);
                    } else {
                        getAllDataPackData(result.VlocityDataPackId)
                                .then(function(dataPackData) {
                                    deferred.resolve(dataPackData);
                                }, function(error) {
                                    deferred.reject(error);
                                });
                    }
                } else {
                    getAllDataPackData(result.VlocityDataPackId)
                        .then(function(dataPackData) {
                            deferred.reject({
                                message: 'Unknown response status: ' + result.Status,
                                result: result,
                                VlocityDataPackData: dataPackData,
                                VlocityDataPackId: currentDataPackId
                            });
                        }, function(error) {
                            deferred.reject(error);
                        });
                }
            };
        }

        function runImport(dataPackData, currentDataPackId, deferred) {
            var importData;
            if (currentDataPackId !== null) {
                importData = {'VlocityDataPackId': currentDataPackId, name: dataPackData.name,
                                description: dataPackData.description, version: dataPackData.version, source: dataPackData.source};
                remoteActions.runImport(JSON.stringify(importData))
                    .then(makeResultHandler(null, dataPackData, currentDataPackId, deferred), function(error) {
                        deferred.reject(error);
                    });

            } else {

                importData = {'VlocityDataPackData' : dataPackData, name: dataPackData.name,
                                description: dataPackData.description, version: dataPackData.version, source: dataPackData.source};

                var importString = JSON.stringify(importData);

                // 1 Million char Remoting Limit
                if (importString.length > 900000) {

                    // Less Than 3MB initialize as Salesforce Queueable
                    if (typeof(vlocityVFActionFunctionControllerHandlers) !== 'undefined' &&
                        typeof(vlocityVFActionFunctionControllerHandlers.runServerMethod) === 'function' &&
                        importString.length < 3000000) {

                        vlocityVFActionFunctionControllerHandlers.runServerMethod(fileNsPrefixDot() + 'DRDataPackRunnerController.DRDataPackRunnerControllerOpen',
                            'runImport', importString, '{}', true)
                            .then(makeResultHandler(null, dataPackData, currentDataPackId, deferred), function(error) {
                                deferred.reject(error);
                            });
                    } else {
                        // Apply to DataPack 1 at a time
                        var allDataPacks = importData.VlocityDataPackData.dataPacks;

                        importData.VlocityDataPackData.dataPacks = [];

                        // First import empty
                        remoteActions.runImport(JSON.stringify(importData)).then(function(result) {

                            var initialImportResult = result;

                            if (result.Status == 'Ready')
                            {
                                importData.VlocityDataPackData.dataPacks = allDataPacks;
                                importData.VlocityDataPackData.dataPackId = result.VlocityDataPackId;

                                // Add all DataPacks to imported Id
                                setAllDataPackDataChunked(importData.VlocityDataPackData, result, [], deferred, function() {

                                    // Continue Import sending in the result as import only needs the dataPackId to continue
                                    remoteActions.runImport(JSON.stringify(result))
                                        .then(makeResultHandler(null, dataPackData, currentDataPackId, deferred), function(error) {
                                            deferred.reject(error);
                                        });
                                });
                            }
                        }, function(error) {
                                deferred.reject(error);
                            }
                        );
                    }
                } else {
                    remoteActions.runImport(importString)
                        .then(makeResultHandler(null, dataPackData, currentDataPackId, deferred), function(error) {
                            deferred.reject(error);
                        });
                }
            }
        }

        function refreshDataPack(datapack, deferred) {
            remoteActions.refreshDataPack(datapack.Id)
                .then(makeResultHandler('MultiPack', [], datapack.Id, deferred),
                    function(error) {
                    deferred.reject(error);
                });
        }

        return {
            getAllDataPackData: function(dataPackId) {
                return getAllDataPackData(dataPackId);
            },
            getRemoteDataPackData: function(org, dataPackId) {
                return getRemoteDataPackData(org, dataPackId);
            },
            prepareDataPackForExport: function (exportDataPackType, exportDataPackInfo, maxDepth, currentDataPackId) {
                var deferred = $q.defer();
                setTimeout(function() {
                    runExport(exportDataPackType, exportDataPackInfo, maxDepth, currentDataPackId, deferred);
                });
                return deferred.promise;
            },
            exportDataPack: function(dataPackData) {
                return setDataToReady(dataPackData, true);
            },
            removeDeselectedKeys: removeDeselectedKeys,
            importDataPack: function(dataPackData) {
                var deferred = $q.defer();
                setTimeout(function() {
                    runImport(dataPackData, null, deferred);
                });
                return deferred.promise;
            },
            combineDataPacks: function(dataPackList) {
                var deferred = $q.defer();
                setTimeout(function() {
                    runCombine(dataPackList, '', deferred);
                });
                return deferred.promise;
            },
            activateDataPack: function(dataPackId, dataPackKeysToActivate) {
                var deferred = $q.defer();
                setTimeout(function() {
                    runActivate(dataPackKeysToActivate, dataPackId, deferred);
                });
                return deferred.promise;
            },
            refreshDataPack: function(datapack) {
                var deferred = $q.defer();
                setTimeout(function() {
                    refreshDataPack(datapack, deferred);
                });
                return deferred.promise;
            },
            ignoreErrorForDataPacks: function(key, dataPackData, dataPackType) {
                if (!angular.isArray(key)) {
                    key = [key];
                }
                var deferred = $q.defer();
                setTimeout(function() {
                    remoteActions.ignoreErrorForDataPacks(dataPackType ? 'Export' : 'Import', dataPackData.dataPackId, key)
                        .then(makeResultHandler(dataPackType, {},  dataPackData.dataPackId, deferred), function(error) {
                            deferred.reject(error);
                        });
                });
                return deferred.promise;
            }
        };
    });

},{}],8:[function(require,module,exports){
angular.module('drvcomp')
    .factory('drvImportScopeManager', function(drvDataPack, fileNsPrefix, $http, $rootScope,
                                                remoteActions, replacementNamespace, replacementURLFormatNamespace, $localizable, $window, $q) {
        'use strict';

        var nsWithoutUnderscores = fileNsPrefix().substring(0, fileNsPrefix().length - 2);
        var nsForURL = nsWithoutUnderscores.replace('_', '-');
        var DEFAULT_AUTHOR = 'vlocity';
        var DEFAULT_AUTHOR_SUFFIX = 'Dev';
        var namespaceRegEx = new RegExp(nsWithoutUnderscores, 'g');
        var replacementURLRegex = new RegExp(replacementURLFormatNamespace, 'g');
        var dataPackEnum = {
            Layout : 'VlocityUILayout__c',
            Template : 'VlocityUITemplate__c',
            Card : 'VlocityCard__c'
        };
        function downloadFile(data, filename) {
            if (typeof data === 'object') {
                data = JSON.stringify(data, undefined, 0);
            }
            if (nsWithoutUnderscores === '') {
                data = data.replace(/"([A-Za-z]*)__c"/g, '"%vlocity_namespace%__$1__c"').replace(replacementURLRegex, replacementURLFormatNamespace);
            } else {
                data = data.replace(namespaceRegEx, replacementNamespace).replace(replacementURLRegex, replacementURLFormatNamespace);
            }

            var attachmentForm = $('<form>', {
                action: '/apex/' + fileNsPrefix() + 'JSONDownload',
                target: '_top',
                method: 'POST'
            }).append($('<input>', {
                type: 'hidden',
                name: 'json',
                value: data
            }));
            attachmentForm.append($('<input>', {
                type: 'hidden',
                name: 'filename',
                value: filename
            }));
            attachmentForm.appendTo(document.body)
            attachmentForm.submit().remove();
        }

        return function(scope) {
            var modalScope = scope.$new();
            modalScope.import = {
                file: null,
                name: ''
            };
            modalScope.downloadFile = downloadFile;
            modalScope.loading = false;
            modalScope.hadErrors = false;
            modalScope.stage = 1;
            modalScope.hideChildren = {};

            modalScope.select = function(all) {
                modalScope.dataToProcess.dataPacks.forEach(function(data) {
                    selectAll(data.VlocityDataPackData, all);
                });
            };

            function selectAll(dataPack, recurse) {
                Object.keys(dataPack).forEach(function(key) {
                    if (angular.isArray(dataPack[key])) {
                        dataPack[key].forEach(function(data) {
                            if (angular.isObject(data)) {
                                data.VlocityDataPackIsIncluded = recurse;
                                if (recurse) {
                                    selectAll(data, recurse);
                                }
                            }
                        });
                    }
                });
            }

            modalScope.previous = function() {
                modalScope.stage = Math.max(modalScope.stage - 1, 1);
                modalScope.dataToProcess = modalScope.originalData;
            };

            modalScope.next = function() {
                modalScope.stage = Math.min(modalScope.stage + 1, 7);
                if (modalScope.stage === 3) {
                    modalScope.hideChildren = {};
                    modalScope.originalData = angular.copy(modalScope.dataToProcess);
                    modalScope.dataToProcess = drvDataPack.removeDeselectedKeys(modalScope.dataToProcess);
                }
                if (modalScope.stage === 5 && modalScope.org) {
                    modalScope.loading = true;
                    remoteActions.updateDataPackInfo(modalScope.dataToProcess.dataPackId, {
                            Name: modalScope.remotePack.Name,
                            Description: modalScope.remotePack.Description,
                            Version: modalScope.remotePack.Version,
                            Status: 'Complete',
                            Source: modalScope.org
                        }).then(function() {
                            modalScope.loading = false;
                        },function() {
                            modalScope.loading = false;
                        });
                }
                if (modalScope.stage === 6) {
                    // we're into activation mode
                    modalScope.dataToProcess.dataPacks = modalScope.dataToProcess.dataPacks.filter(function(pack) {
                        return pack.ActivationStatus !== 'NA' && pack.VlocityDataPackStatus !== 'Not Included';
                    });
                    updateWarningMessageOnActivation(modalScope.dataToProcess.dataPacks);
                } else if (modalScope.stage === 7) {
                    $scope.loading = true;
                }
                if(modalScope.stage === 2) {
                    checkForActiveLayoutTemplate(modalScope.dataToProcess.dataPacks);
                }
            };

            function getDataPackType(type) {
                var packType = '';
                switch (type) {
                    case 'VlocityUILayout':
                        packType = 'Layout';
                        break;
                    case 'VlocityUITemplate':
                        packType = 'Template';
                        break;
                    case 'VlocityCard':
                        //For card versioning
                        packType = 'Card';
                        break;
                    default:
                        break;
                }
                return packType;
            }

            function checkForActiveLayoutTemplate(packs) {
                var dataPackNameArr = {
                    Layout: [],
                    Template:[],
                    Card: []
                };

                var author =  fileNsPrefix() + 'Author__c';
                var version = fileNsPrefix() + 'Version__c';
                var isActive = fileNsPrefix() + 'Active__c';

                var packType = '';
                angular.forEach(packs, function(pack) {
                    packType = getDataPackType(pack.VlocityDataPackType);
                    if (packType) {
                        angular.forEach(pack.VlocityDataPackData[fileNsPrefix() + dataPackEnum[packType]], function(item) {
                            dataPackNameArr[packType].push(item.Name);
                        });
                    }
                });

                //For already active layouts
                if (dataPackNameArr.Layout.length > 0) {
                    remoteActions.getLayoutsByName(dataPackNameArr.Layout).then(
                        function(data) {
                            addWarningMessage(packs, data, 'Layout');
                    });
                }
                //for already active templates
                if (dataPackNameArr.Template.length > 0) {
                    remoteActions.getTemplatesByName(dataPackNameArr.Template).then(
                        function(data) {
                            addWarningMessage(packs, data, 'Template');
                    });
                }
                //for already active cards
                if (dataPackNameArr.Card.length > 0) {
                    remoteActions.getCardsByNames(dataPackNameArr.Card).then(
                        function(data) {
                            addWarningMessage(packs, data, 'Card');
                    });
                }

                function addWarningMessage(packs, data, type) {
                    var packType, itemObj, existingItem, activeItem, activeText, activeExitingItem, itemAuthor;
                    angular.forEach(packs, function(pack) {
                        packType = getDataPackType(pack.VlocityDataPackType);
                        if(type === packType) {
                            angular.forEach(pack.VlocityDataPackData[fileNsPrefix() + dataPackEnum[packType]], function(item) {
                                itemAuthor = (typeof item[author] === 'undefined' || item[author] === '') ? ($rootScope.insidePckg ? ($window.orgName.toLowerCase() === DEFAULT_AUTHOR ? DEFAULT_AUTHOR + DEFAULT_AUTHOR_SUFFIX : $window.orgName) : 'Vlocity') : item[author];
                                item[version] = (typeof item[version] === 'undefined' || item[version] === null || item[version] === '') ? (type === 'Card' ? null : 1) : item[version];
                                if (data && data.length > 0) {
                                    itemObj = {'Name' : item.Name};
                                    itemObj[author] = itemAuthor;
                                    itemObj[version] = item[version];
                                    existingItem = _.find(data, itemObj);
                                    if (type === 'Card' && !existingItem) {
                                        itemObj = {'Name' : item.Name};
                                        itemObj[author] = itemAuthor;
                                        existingItem = _.find(data, itemObj); 
                                    } 
                                    if (existingItem) {
                                        activeItem = existingItem;
                                        if (activeItem[author] === '' || typeof activeItem[author] === 'undefined') {
                                            activeItem[author] =  $window.orgName.toLowerCase() === DEFAULT_AUTHOR ? DEFAULT_AUTHOR + DEFAULT_AUTHOR_SUFFIX : $window.orgName;
                                        }
                                        activeItem[version] = (typeof activeItem[version] === 'undefined' || activeItem[version] === null || item[version] === '') ? (type === 'Card' ? null : 1) : activeItem[version];
                                        if (activeItem[author] === itemAuthor && activeItem[version] === item[version]) {
                                            activeText = activeItem[isActive] ? 'active ' : '';
                                            $q.when($localizable('Import' + packType + 'Warning','Will overwrite the {3}' + packType + ' with same name (Author: {1}, Version: {2}).', activeItem[author], activeItem[version] === null ? 'Legacy' : activeItem[version], activeText))
                                            .then(function(label) {
                                                item.VlocityDataPackWarning = label;
                                            });
                                            item.VlocityDataPackActiveWarning = activeItem[isActive];
                                            itemObj = {'Name' : item.Name};
                                            itemObj[isActive] = true;
                                            activeExitingItem = _.find(data, itemObj);
                                            if(activeExitingItem && activeExitingItem != existingItem) {
                                                $q.when($localizable('Active' + packType + 'Warning', packType + ' with same name (Author: {1}, Version: {2}) is already activated.', activeExitingItem[author], activeExitingItem[version] === null ? 'Legacy' : activeExitingItem[version])).then(function(label) {
                                                    item.VlocityActiveDataPackWarning = label;
                                                });    
                                            }
                                        }
                                    } else {
                                        itemObj = {'Name' : item.Name};
                                        itemObj[isActive] = true;
                                        activeExitingItem = _.find(data, itemObj);
                                        if(activeExitingItem) {
                                            $q.when($localizable('Active' + packType + 'Warning', packType + ' with same name (Author: {1}, Version: {2}) is already activated.', activeExitingItem[author],activeExitingItem[version])).then(function(label) {
                                                item.VlocityActiveDataPackWarning = label;
                                            });    
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
                modalScope.addAdditionalInfo(packs);
            }

            modalScope.addAdditionalInfo = function(packs){
                var packType;
                var author =  fileNsPrefix() + 'Author__c';
                var version = fileNsPrefix() + 'Version__c';
                var isActive = fileNsPrefix() + 'Active__c';
                angular.forEach(packs, function(pack) {
                        packType = getDataPackType(pack.VlocityDataPackType);
                        angular.forEach(pack.VlocityDataPackData[fileNsPrefix() + dataPackEnum[packType]], function(item) {
                                $q.when($localizable('DataPackItemMoreInfo', '(Author: {1}, Version: {2})', (typeof item[author] === 'undefined' || item[author] === '') ? '<Blank>' : item[author], (!item[version] || item[version] === null) ? 'Legacy' : item[version])).then(function(label) {
                                    item.VlocityDataPackMoreInfo = label;
                                });
                            });
                    });
            }

            function updateWarningMessageOnActivation(packs) {
                angular.forEach(packs, function(pack) {
                    var packType = getDataPackType(pack.VlocityDataPackType);
                    angular.forEach(pack.VlocityDataPackData[fileNsPrefix() + dataPackEnum[packType]], function(item) {
                        if (item.VlocityActiveDataPackWarning) {
                            item.VlocityDataPackWarning = item.VlocityActiveDataPackWarning;
                            item.VlocityDataPackActiveWarning = true;
                            item.VlocityDataPackIsIncluded = false;
                        } else {
                            item.VlocityDataPackWarning = '';
                        }
                    });
                });
            }

            modalScope.startImport = function() {
                modalScope.loading = true;
                modalScope.stage = Math.min(modalScope.stage + 1, 7);
                modalScope.dataToProcess = drvDataPack.removeDeselectedKeys(modalScope.dataToProcess);
                
                drvDataPack.importDataPack(modalScope.dataToProcess)
                    .then(function(dataPack) {
                        modalScope.dataToProcess = dataPack;
                        modalScope.loading = false;
                        if (!dataPack.errors || Object.keys(dataPack.errors).length === 0) {
                            modalScope.stage = Math.min(modalScope.stage + 1, 7);
                            if (modalScope.source) {
                                modalScope.loading = true;
                                remoteActions.updateDataPackInfo(modalScope.dataToProcess.dataPackId, {
                                        Status: 'Complete',
                                        Source: modalScope.source
                                    }).then(function() {
                                        modalScope.loading = false;
                                    }, function() {
                                        modalScope.loading = false;
                                    });
                            }
                        }
                    }, function(error) {
                        modalScope.loading = false;
                        modalScope.error = error;
                    }, function(progress) {
                        modalScope.progress = progress;
                    });
            };

            modalScope.startActivation = function() {
                modalScope.loading = true;
                modalScope.stage = Math.min(modalScope.stage + 1, 7);
                modalScope.progress = null;
                modalScope.dataToProcess = drvDataPack.removeDeselectedKeys(modalScope.dataToProcess);

                var keysToActivate = modalScope.dataToProcess.dataPacks.map(function(pack) {
                    return pack.VlocityDataPackKey;
                });

                drvDataPack.activateDataPack(modalScope.dataToProcess.dataPackId, keysToActivate)
                    .then(function(dataPack) {
                        modalScope.loading = false;
                        if (!dataPack.errors || Object.keys(dataPack.errors).length === 0) {
                            modalScope.stage = Math.min(modalScope.stage + 1, 8);
                        }
                    }, function(error) {
                        modalScope.loading = false;
                        modalScope.error = error;
                    }, function(progress) {
                        modalScope.progress = progress;
                    });
            };

            modalScope.warningCount = function() {
                if (!modalScope.dataToProcess || !modalScope.dataToProcess.warnings) {
                    return 0;
                }
                return Object.keys(modalScope.dataToProcess.warnings)
                            .reduce(function(count, warning) {
                                return count + modalScope.dataToProcess.warnings[warning].length;
                            }, 0);
            };

            modalScope.errorCount = function() {
                if (!modalScope.dataToProcess || !modalScope.dataToProcess.errors) {
                    return 0;
                }
                return Object.keys(modalScope.dataToProcess.errors)
                            .reduce(function(count, error) {
                                return count + modalScope.dataToProcess.errors[error].length;
                            }, 0);
            };

            modalScope.hasDataPacks = function() {
                if (!modalScope.dataToProcess || !modalScope.dataToProcess.dataPacks) {
                    return false;
                }
                var hasData = false;
                modalScope.dataToProcess.dataPacks.forEach(function(datapack) {
                    if (datapack.VlocityDataPackStatus === 'Success') {
                        hasData = true;
                        return false;
                    }
                });
                return hasData;
            };

            modalScope.hasDataPacksToActivate = function() {
                if (!modalScope.dataToProcess || !modalScope.dataToProcess.dataPacks) {
                    return false;
                }
                return modalScope.dataToProcess.dataPacks.filter(function(pack) {
                    return pack.ActivationStatus !== 'NA' && pack.VlocityDataPackStatus === 'Success';
                }).length > 0;
            }

            modalScope.selectedChildCount = function(array) {
                return array.reduce(function(count, child) {
                    return Object.keys(child.VlocityDataPackData).reduce(function(count, key) {
                        if (/VlocityDataPack/.test(key)) {
                            return count;
                        } else if (angular.isArray(child.VlocityDataPackData[key])) {
                            return child.VlocityDataPackData[key].reduce(function(count, child) {
                                return child.VlocityDataPackIsIncluded ? count + 1 : count;
                            }, count);
                        } else {
                            return count;
                        }
                    }, count);
                }, 0);
            };

            modalScope.hasASelection = function() {
                if (!modalScope.dataToProcess || !modalScope.dataToProcess.dataPacks) {
                    return false;
                }
                var hasData = false;
                modalScope.dataToProcess.dataPacks.forEach(function(data) {
                    Object.keys(data.VlocityDataPackData).forEach(function(key) {
                        if (angular.isArray(data.VlocityDataPackData[key])) {
                            data.VlocityDataPackData[key].forEach(function(data) {
                                if (data.VlocityDataPackIsIncluded)  {
                                    hasData = true;
                                    return false;
                                }
                            });
                            if (hasData) {
                                return false;
                            }
                        }
                    });
                    if (hasData) {
                        return false;
                    }
                });
                return hasData;
            };

            modalScope.ignoreErrorForDataPacks = function(keys) {
                modalScope.loading = true;
                drvDataPack.ignoreErrorForDataPacks(keys, modalScope.dataToProcess)
                    .then(function(dataToProcess) {
                        modalScope.dataToProcess = dataToProcess;
                        modalScope.loading = false;
                        if (!dataToProcess.errors || Object.keys(dataToProcess.errors).length === 0) {
                            modalScope.stage = Math.min(modalScope.stage + 1, 7);
                        }
                        if (modalScope.stage === 5 && modalScope.org) {
                            modalScope.loading = true;
                            remoteActions.updateDataPackInfo(modalScope.dataToProcess.dataPackId, {
                                    Name: modalScope.remotePack.Name,
                                    Description: modalScope.remotePack.Description,
                                    Version: modalScope.remotePack.Version,
                                    Status: 'Complete',
                                    Source: modalScope.org
                                }).then(function() {
                                    modalScope.loading = false;
                                });
                        } else if (modalScope.stage === 5 && modalScope.source) {
                            modalScope.loading = true;
                            remoteActions.updateDataPackInfo(modalScope.dataToProcess.dataPackId, {
                                    Status: 'Complete',
                                    Source: modalScope.source
                                }).then(function() {
                                    modalScope.loading = false;
                                });
                        }
                    }, function(error) {
                        modalScope.error = error;
                        modalScope.loading = false;
                    }, function(progress) {
                        modalScope.progress = progress;
                    });
            };
            modalScope.$on('sldsModal.hide', function() {
                if (scope.onImportComplete) {
                    scope.onImportComplete();
                }
                modalScope.$destroy();
            });
            return modalScope;
        };

    });

},{}],9:[function(require,module,exports){
/*
 * An Angular service which helps with creating recursive directives.
 * @author Mark Lagendijk
 * @license MIT
 */
angular.module('drvcomp').factory('RecursionHelper', ['$compile', function($compile) {
    return {
        /**
        		 * Manually compiles the element, fixing the recursion loop.
        		 * @param element
        		 * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
        		 * @returns An object containing the linking functions.
        		 */
        compile: function(element, link) {
            // Normalize the link parameter
            if (angular.isFunction(link)) {
                link = {post: link};
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                				 * Compiles and re-adds the contents
                				 */
                post: function(scope, element) {
                    // Compile the contents
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function(clone) {
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if (link && link.post) {
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
}]);

},{}],10:[function(require,module,exports){
angular.module('drvcomp')
    .filter('adaptErrorMessage', function() {
        'use strict';
        return function(message) {
            if (/Input too long/.test(message)) {
                return 'Data is too large to export. Please export the data in smaller batches by deselecting items.';
            } else if (/apex heap size too large/.test(message)) {
                return 'Data is too large to export';
            } else if (/Logged in/.test(message)) {
                return 'Your session has expired. Please login again.';
            }
            return message;
        };
    });

/Input too long. [1, 107]/

},{}],11:[function(require,module,exports){
angular.module('drvcomp')
    .filter('fixExportMessage', function() {
        'use strict';
        return function(message) {
            return message.replace(/ Export/g,' Import').replace(/ export/g, ' import');
        };
    });

},{}],12:[function(require,module,exports){
angular.module('drvcomp')
    .filter('groupByType', function() {
        'use strict';
        var cache = {};

        return function(datapack) {
            if (!datapack) {
                return [];
            }
            var existing = cache[datapack.dataPackId];
            var obj = datapack.dataPacks.reduce(function(obj, pack) {
                if (pack.VlocityDataPackStatus === 'Success' &&
                    pack.VlocityDataPackRelationshipType != 'Pagination' &&
                    !/(MultiPack|MultiPackCombination|MapItem__c|CalculationProcedureStep__c|CalculationMatrixRow__c)/
                                                .test(pack.VlocityDataPackLabel)) {
                    if (!obj[pack.VlocityDataPackType]) {
                        obj[pack.VlocityDataPackType] = [];
                    }
                    obj[pack.VlocityDataPackType].push(pack);
                }
                return obj;
            }, {});
            var newVersion = Object.keys(obj).map(function(key) {
                return {
                    $type: key,
                    $label: obj[key][0].VlocityDataPackLabel || obj[key][0].VlocityDataPackType,
                    $records: obj[key]
                };
            });
            if (existing && newVersion) {
                // need to see what changed now - it will only ever be that some items don't exist any more
                if (existing.length !== newVersion.length) {
                    // shortcut for if the length is totally different, no need to traverse
                    cache[datapack.dataPackId] = newVersion;
                } else {
                    // else traverse each array until we hit a difference
                    var same = true;
                    existing.forEach(function(existing, index) {
                        if (!angular.equals(existing.$records, newVersion[index].$records)) {
                            same = false;
                            return false;
                        }
                    });
                    if (!same) {
                        cache[datapack.dataPackId] = newVersion;
                    }
                }
            } else {
                cache[datapack.dataPackId] = newVersion;
            }
            return cache[datapack.dataPackId];
        };
    });

},{}],13:[function(require,module,exports){
angular.module('drvcomp')
    .filter('readableDataPackTypeName', function(fileNsPrefix) {
        'use strict';
        return function(objectType) {
            if (objectType === 'MultiPackCombination') {
                return 'MultiPack';
            } else if (angular.isString(objectType)) {
                return objectType.replace(/__c$/, '').replace(/^.*__/, '');
            } else {
                return '';
            }
        };
    });
},{}],14:[function(require,module,exports){
angular.module("drvcomp").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("DrvImportModal.tpl.html",'<div id="datapack-import-modal"  class="slds-modal slds-fade-in-open">\n  <style>\n    .slds-modal .vlc-framed {\n      border: 1px solid #d8dde6;\n      min-height: 465px;\n      max-height: 465px;\n    }\n    .slds-modal.is-dragover .via-message .slds-box {\n      max-width: 50vw;\n      max-height: 50vh;\n    }\n    .slds-modal.is-dragover .slds-modal__container {\n      display:none;\n    }\n  </style>\n  <div class="slds-modal__container">\n    <div class="slds-modal__header">\n      <h4 class="slds-text-heading--medium" ng-if="stage == 1 && mode === \'publicdata\'" id="datapack-import-modal-title">{{ ::\'ImportRemoteData\'| localize:\'Import Vlocity DataPack\' }}</h4>\n      <h4 class="slds-text-heading--medium" ng-if="stage == 1 && mode === \'file\'" id="datapack-import-modal-title">{{ ::\'SelectFile\'| localize:\'Select File\' }}</h4>\n      <h4 class="slds-text-heading--medium" ng-if="stage == 1 && mode === \'org\'" id="datapack-import-modal-title">{{ \'ManageOrgConnections\'| localize:\'Import From {1}\':org }}</h4>\n      <h4 class="slds-text-heading--medium" ng-if="stage == 2" id="datapack-import-modal-title">{{ ::\'SelectItemsToImport\'| localize:\'Select Items to Import\' }}</h4>\n      <h4 class="slds-text-heading--medium" ng-if="stage == 3" id="datapack-import-modal-title">{{ ::\'Dev2ProdImportReview\'| localize:\'Review Items to Import\' }}</h4>\n      <h4 class="slds-text-heading--medium" ng-if="stage == 4" id="datapack-import-modal-title">{{ ::\'Importing\'| localize:\'Importing...\' }}</h4>\n      <h4 class="slds-text-heading--medium" ng-if="stage == 5" id="datapack-import-modal-title">{{ ::\'ImportComplete\'| localize:\'Import Complete\' }}</h4>\n      <h4 class="slds-text-heading--medium" ng-if="stage == 6" id="datapack-import-modal-title">{{ ::\'SelectItemsToActivate\'| localize:\'Select Items to Activate\' }}</h4>\n      <h4 class="slds-text-heading--medium" ng-if="stage == 7" id="datapack-import-modal-title">{{ ::\'Activating\'| localize:\'Activating...\' }}</h4>\n      <h4 class="slds-text-heading--medium" ng-if="stage == 8" id="datapack-import-modal-title">{{ ::\'ActivateComplete\'| localize:\'Activation Complete\' }}</h4>\n      <div class="slds-notify_container" ng-if="(warningCount(dataToProcess) > 0 && stage == 2) || (error.message || (stage > 1 && errorCount() > 0))" id="datapack-import-modal-title-errors">\n        <div class="slds-notify slds-notify--toast " role="alert" ng-class="{\'slds-theme--warning\': warningCount(dataToProcess) > 0 && stage == 2, \'slds-theme--error\': error.message || (stage > 1 && errorCount() > 0)}">\n          <span class="slds-assistive-text" ng-if="warningCount(dataToProcess) > 0 && stage == 2">Warning</span>\n          <span class="slds-assistive-text" ng-if="error.message || (stage > 1 && errorCount() > 0)">Error</span>\n          <div class="notify__content slds-grid">\n            <slds-svg-icon sprite="\'utility\'" icon="\'warning\'" size="\'small\'" extra-classes="\'slds-m-right--small slds-col slds-no-flex\'"></slds-svg-icon>\n            <div class="slds-col slds-align-middle">\n              <h2 class="slds-text-heading--small" ng-if="warningCount(dataToProcess) > 0 && stage == 2" id="datapack-import-modal-title-error-message">          {{ ::\'Dev2ProdImportWarningTitle\'|localize:\'Import has warnings\'}}</h2>\n              <h2 class="slds-text-heading--small" ng-if="(error.message && stage < 6) || (stage > 1 && stage < 6 && errorCount() > 0)" id="datapack-import-modal-title-error-message">{{ ::\'Dev2ProdImportErrorTitle\'|localize:\'Import Error\'}}</h2>\n              <h2 class="slds-text-heading--small" ng-if="(error.message && stage > 5) || (stage > 5 && errorCount() > 0)" id="datapack-import-modal-title-error-message">{{ ::\'Dev2ProdImportActivateErrorTitle\'|localize:\'Activation Error\'}}</h2>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class="slds-modal__content slds-grid slds-grid--vertical"\n          ng-class="{\'slds-p-around--x-large\': !(stage == 1 && !loading && mode === \'org\' && !error.message)}">\n      <div style="min-height: 200px; position: relative;" ng-if="loading">\n        <div class="slds-spinner--brand slds-spinner slds-spinner--large slds-m-top--medium slds-m-bottom--medium" aria-hidden="false" role="alert">\n          <div class="slds-spinner__dot-a"></div>\n          <div class="slds-spinner__dot-b"></div>\n        </div>\n        <h2 class="slds-text-align--center slds-text-heading--medium slds-m-top--large" ng-if="stage < 6">{{ ::\'Importing\'| localize:\'Importing\' }} <span ng-if="progress.Finished || progress.Total">{{progress.Finished}} {{ ::\'Of\'|localize:\'of\'}} {{progress.Total}}</span>\n        </h2>\n        <h2 class="slds-text-align--center slds-text-heading--medium slds-m-top--large" ng-if="stage > 6">{{ ::\'Activating\'| localize:\'Activating\' }} <span ng-if="progress.Finished || progress.Total">{{progress.Finished}} {{ ::\'Of\'|localize:\'of\'}} {{progress.Total}}</span>\n        </h2>\n      </div>\n\n      <form ng-if="stage == 1 && mode === \'file\'" name="drvImportForm">\n        <div class="slds-form-element" ng-class="{\'slds-has-error\': error.message}">\n          <label class="slds-form-element__label">{{ ::\'FileName\'| localize:\'File Name\' }}</label>\n          <div class="slds-form-element__control">\n            <input type="text" class="slds-input" ng-model="import.name" placeholder="{{ ::\'SelectAFile\'| localize:\'Click Browse To Get Started\' }}" readonly="readonly" id="datapack-import-modal-filename-input"/>\n          </div>\n          <div class="slds-form-element__help" ng-if="error.message">{{error.message}}</div>\n        </div>\n        <div class="slds-m-top--medium">\n          <label class="slds-button slds-button--brand " for="datapack-import-modal-file-input">\n                  {{ ::\'Browse\' | localize:\'Browse\' }}\n                  <input type="file" id="datapack-import-modal-file-input" style="display:none;" accept=".json" ng-model="import.file" app-filereader="true" filename="import.name" />\n          </label>\n          <span class="slds-m-around--x-small">{{ ::\'OrDragAndDrop\' | localize:\'Or drag and drop a datapack on to the window.\'}}</span>\n        </div>\n      </form>\n\n      <table ng-show="stage == 1 && !loading && mode === \'org\' && !error.message" class="slds-table slds-table--bordered" ng-table="tableParams" id="datapack-import-modal-remote-org-table" >\n        <tbody ng-if="!tableLoading">\n          <tr ng-repeat="row in $data | orderBy:\'+Name\'" id="datapack-import-modal-remote-org-table-row-{{$index}}">\n            <td class="slds-cell-shrink" title="\'\'">\n              <div class="slds-form-element__control">\n                <label class="slds-radio">\n                  <input type="radio" name="selectedPack" ng-model="selectedPackId" ng-value="row.Id" ng-change="selectToImport(selectedPackId === row.Id ? row : null)"\n                   id="datapack-import-modal-remote-org-table-row-{{$index}}-selectPack"/>\n                  <span class="slds-radio--faux"></span>\n                </label>\n              </div>\n            </td>\n            <td class="slds-truncate" data-title="::\'Name\' | localize:\'Name\'">{{row.Name}}</td>\n            <td class="slds-truncate" data-title="::\'Version\' | localize:\'Version\'">{{row.Version | number:1}}</td>\n            <td class="slds-truncate" data-title="::\'Type\' | localize:\'Type\'">{{ row.label | readableDataPackTypeName }}</td>\n            <td class="slds-truncate" title="\'\'">\n              <div>\n                <a ng-click="$root.showInfo(row, org)" id="datapack-import-modal-remote-org-table-row-{{$index}}-view"> {{ ::\'VlocView\' | localize:\'View\' }}</a>\n              </div>\n            </td>\n          </tr>\n        </tbody>\n        <tbody ng-if="tableLoading">\n          <tr>\n            <td colspan="5" style="width: 100%; height: 400px">\n              <div class="slds-spinner_container">\n                <div class="slds-spinner--brand slds-spinner slds-spinner--large" aria-hidden="false" role="alert">\n                  <div class="slds-spinner__dot-a"></div>\n                  <div class="slds-spinner__dot-b"></div>\n                </div>\n              </div>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n\n      <div ng-if="stage > 1 && !loading && errorCount() > 0" class="datapack-import-modal-errors">\n        <ul class="slds-list--vertical">\n          <li class="slds-list__item" ng-repeat="(dataPackKey, errorList) in dataToProcess.errors">\n            <div role="presentation" >\n              <span class="slds-icon_container">\n                <slds-svg-icon sprite="\'utility\'" icon="\'warning\'" size="\'x-small\'" extra-classes="\'slds-icon-text-error\'"></slds-svg-icon>\n              </span>\n              <b>{{ errorList[0].VlocityDataPackName }} ({{ errorList[0].VlocityDataPackLabel }}):</b> {{ errorList[0].VlocityDataPackMessage }}\n              <a class="slds-button" ng-click="ignoreErrorForDataPacks(dataPackKey)" style="cursor: pointer"\n                  id="datapack-import-modal-ignore-errors-{{$index}}-button">\n                  {{ ::\'Dev2ProdIgnoreError\'| localize:\'Ignore This Error\' }}\n              </a>\n            </div>\n          </li>\n        </ul>\n        <button ng-if="Object.keys(dataToProcess.errors).length > 1" id="datapack-import-modal-ignore-all-errors-button"\n                ng-click="ignoreErrorForDataPacks(Object.keys(dataToProcess.errors))" class="slds-button">\n            {{ ::\'Dev2ProdIgnoreAllErrors\'| localize:\'Ignore All Errors\' }}\n        </button>\n      </div>\n\n      <div class="vlc-framed slds-scrollable--y datapack-import-modal-select-step"\n            ng-if="(stage == 2 || stage == 3) && !loading && errorCount() == 0">\n        <ul class="slds-tree" role="tree" ng-if="hasDataPacks()">\n          <li role="treeitem" aria-level="1" ng-if="stage == 2 && warningCount(dataToProcess) > 0" ng-init="showChildren.warnings = true" id="datapack-import-modal-warnings" >\n            <div class="slds-tree__item" id="datapack-import-modal-toggle-warnings-button" ng-click="showChildren.warnings = !showChildren.warnings">\n              <button class="slds-button slds-button--icon-bare slds-m-right--x-small">\n                <slds-button-svg-icon icon="\'chevronright\'" sprite="\'utility\'" size="\'small\'" ng-if="!showChildren.warnings"></slds-button-svg-icon>\n                <slds-button-svg-icon icon="\'chevrondown\'" sprite="\'utility\'" size="\'small\'" ng-if="showChildren.warnings"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Toggle</span>\n              </button>\n              <a role="presentation" class="slds-truncate"  id="datapack-import-modal-warnings-summary-text">{{ ::\'Dev2ProdWarning\' | localize:\'Warnings\' }} ({{warningCount(dataToProcess)}})</a>\n            </div>\n            <ul class="slds-is-expanded">\n              <li role="treeitem" aria-level="2" ng-repeat="(dataPackKey, errorList) in dataToProcess.warnings" ng-show="showChildren.warnings">\n                <div class="slds-tree__item">\n                  <div class="slds-form-element">\n                    <div class="slds-form-element__control slds-input-has-icon slds-input-has-icon--left">\n                      <label class="slds-checkbox" ng-disabled="!isEditable">\n                        <slds-svg-icon sprite="\'utility\'" icon="\'warning\'" size="\'x-small\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                        <span class="slds-m-left--x-small slds-form-element__label" id="datapack-import-modal-warning-{{$index}}-message">\n                          <b>{{errorList[0].VlocityDataPackName }} ({{ errorList[0].VlocityDataPackLabel }}):</b> {{ errorList[0].VlocityDataPackMessage | fixExportMessage }}\n                        </span>\n                      </label>\n                    </div>\n                  </div>\n                </div>\n              </li>\n            </ul>\n          </li>\n          <li role="treeitem" aria-level="1" ng-repeat="data in dataToProcess | groupByType track by $index" id="datapack-import-modal-tree-item-{{$index}}">\n            <div class="slds-tree__item" ng-click="hideChildren[data.$type] = (!hideChildren[data.$type] && !isLocked)"\n            id="datapack-import-modal-tree-item-{{$index}}-toggle-button">\n              <button class="slds-button slds-button--icon-bare slds-m-right--x-small">\n                <slds-button-svg-icon icon="\'chevronright\'" sprite="\'utility\'" size="\'small\'" ng-if="hideChildren[data.$type]"></slds-button-svg-icon>\n                <slds-button-svg-icon icon="\'chevrondown\'" sprite="\'utility\'" size="\'small\'" ng-if="!hideChildren[data.$type]"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Toggle</span>\n              </button>\n              <a role="presentation" class="slds-truncate" id="datapack-import-modal-tree-item-{{$index}}-summary-text">\n                {{ data.$label | readableDataPackTypeName }} ({{selectedChildCount(data.$records)}})\n              </a>\n            </div>\n            <drv-comptree object-data="value.VlocityDataPackData"\n                      record-status="value.VlocityDataPackRecords"\n                      ng-repeat="value in data.$records"\n                      is-editable="stage == 2 && !loading"\n                      hide-label="true"\n                      expand-all="stage == 3"\n                      depth="1"\n                      showStatus="true"\n                      ng-show="!hideChildren[data.$type]"\n                      is-locked="loading && stage == 2">\n            </drv-comptree>\n          </li>\n        </ul>\n        <div class="list-group" ng-if="!hasDataPacks()" id="datapack-import-modal-no-tree-items">\n          <div class="list-group-item-text">\n            <div class="list-group-item-heading">\n              <label>\n                <i class="icon icon-v-claim-line"></i>\n                <b>{{ :: \'ImportNothing\' | localize:\'There is nothing to import.\' }}</b>\n              </label>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="stage == 2 && !loading && errorCount() == 0 && hasDataPacks()">\n        <a ng-click="select(true)" class="slds-button slds-button-link" id="datapack-import-modal-select-all-button">Select All</a>&nbsp;|&nbsp;<a ng-click="select(false)" class="slds-button slds-button-link" id="datapack-import-modal-select-none-button">Select None</a>\n      </div>\n\n      <div ng-if="((stage == 1 && !loading && mode !== \'file\') || stage == 4) && error.message" id="datapack-import-modal-error-message">\n        {{error.message | adaptErrorMessage | fixExportMessage }}\n      </div>\n\n      <div ng-if="stage == 1 && import.file &&!loading && mode === \'file\' && !hasASelection()" id="datapack-import-modal-no-datapack-to-import-message">\n        {{::\'DRVNoDataPack\' | localize:\'This file contains no Data Packs to import\'}}\n      </div>\n\n      <div class="slds-text-align--center slds-m-around--xx-large" ng-if="stage == 5 && !loading" id="datapack-import-modal-completed-message">\n        <div>\n          <span class="slds-icon_container slds-icon_container--circle slds-icon-action-check">\n            <slds-svg-icon sprite="\'action\'" icon="\'check\'" size="\'large\'"></slds-svg-icon>\n            <span class="slds-assistive-text">Check icon</span>\n          </span>\n        </div>\n        <h2 class="slds-text-heading--medium slds-m-top--large" ng-if="hasDataPacksToActivate()">{{ :: \'NowActivateMessage\' | localize:\'You can now activate the components.\' }}</h2>\n        <h2 class="slds-text-heading--medium slds-m-top--large" ng-if="!hasDataPacksToActivate()">{{ :: \'ImportSuccessfulMessage\' | localize:\'The import completed.\' }}</h2>\n      </div>\n\n      <div class="vlc-framed slds-scrollable--y datapack-import-modal-activate-select-step"\n            ng-if="stage == 6 && !loading && errorCount() == 0">\n        <ul class="slds-tree" role="tree" ng-if="hasDataPacks()">\n          <li role="treeitem" aria-level="1" ng-repeat="data in dataToProcess | groupByType track by $index" id="datapack-import-modal-tree-item-{{$index}}">\n            <div class="slds-tree__item" ng-click="hideChildren[data.$type] = (!hideChildren[data.$type] && !isLocked)"\n            id="datapack-import-modal-tree-item-{{$index}}-toggle-button">\n              <button class="slds-button slds-button--icon-bare slds-m-right--x-small">\n                <slds-button-svg-icon icon="\'chevronright\'" sprite="\'utility\'" size="\'small\'" ng-if="hideChildren[data.$type]"></slds-button-svg-icon>\n                <slds-button-svg-icon icon="\'chevrondown\'" sprite="\'utility\'" size="\'small\'" ng-if="!hideChildren[data.$type]"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Toggle</span>\n              </button>\n              <a role="presentation" class="slds-truncate" id="datapack-import-modal-tree-item-{{$index}}-summary-text">\n                {{ data.$label | readableDataPackTypeName }} ({{selectedChildCount(data.$records)}})\n              </a>\n            </div>\n            <drv-comptree object-data="value.VlocityDataPackData"\n                      record-status="value.VlocityDataPackRecords"\n                      ng-repeat="value in data.$records"\n                      is-editable="stage == 6 && !loading"\n                      hide-label="true"\n                      expand-all="stage == 7"\n                      depth="1"\n                      showStatus="true"\n                      ng-show="!hideChildren[data.$type]"\n                      is-locked="loading && stage == 6">\n            </drv-comptree>\n          </li>\n        </ul>\n        <div class="list-group" ng-if="!hasDataPacks()" id="datapack-import-modal-no-tree-items">\n          <div class="list-group-item-text">\n            <div class="list-group-item-heading">\n              <label>\n                <i class="icon icon-v-claim-line"></i>\n                <b>{{ :: \'ImportNothing\' | localize:\'There is nothing to import.\' }}</b>\n              </label>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="stage == 6 && !loading && errorCount() == 0 && hasDataPacks()">\n        <a ng-click="select(true)" class="slds-button slds-button-link" id="datapack-import-modal-select-all-button">Select All</a>&nbsp;|&nbsp;<a ng-click="select(false)" class="slds-button slds-button-link" id="datapack-import-modal-select-none-button">Select None</a>\n      </div>\n\n      <div class="slds-text-align--center slds-m-around--xx-large" ng-if="stage == 8 && !loading && !error.message" id="datapack-import-modal-completed-message">\n        <div>\n          <span class="slds-icon_container slds-icon_container--circle slds-icon-action-check">\n            <slds-svg-icon sprite="\'action\'" icon="\'check\'" size="\'large\'"></slds-svg-icon>\n            <span class="slds-assistive-text">Check icon</span>\n          </span>\n        </div>\n        <h2 class="slds-text-heading--medium slds-m-top--large">{{ :: \'ActivateSuccessfulMessage\' | localize:\'The selected components have all activated.\' }}</h2>\n        <p class="slds-m-top--small">{{ :: \'ActivateOmniscriptLwcComponentsMessage\' | localize:\'If this DataPack contains LWC-enabled OmniScripts/Cards, please go to the OmniScript/Card Designer for each one and click “LWC Preview” to deploy the Lightning Web Component.\' }}</p>\n      </div>\n\n      <div class="slds-text-align--center slds-m-around--xx-large" ng-if="stage > 6 && !loading && error.message" id="datapack-import-modal-failed-message">\n        <div>\n          <span class="slds-icon_container slds-icon_container--circle slds-icon-action-close">\n            <slds-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-svg-icon>\n            <span class="slds-assistive-text">Cross icon</span>\n          </span>\n        </div>\n        <h2 class="slds-text-heading--medium slds-m-top--large">{{ :: \'ActivateFailedMessage\' | localize:\'The selected components could not be activated.\' }}</h2>\n        <br/>\n        <p>{{error.message}}</p>\n      </div>\n\n    </div>\n    <div class="slds-modal__footer" ng-class="{\'slds-modal__footer--directional\': stage == 3}">\n      <button type="button"\n              class="slds-button slds-button--brand"\n              ng-click="previous()"\n              ng-if="stage == 3"\n              id="datapack-import-modal-previous-button"\n              ng-disabled="loading || errorCount() > 0">\n        {{ ::\'Previous\' | localize: \'Previous\' }}\n      </button>\n      <button type="button"\n              class="slds-button slds-button--neutral"\n              ng-click="$hide()"\n              id="datapack-import-modal-cancel-button"\n              ng-disabled="loading"\n              ng-if="stage < 5 || (stage > 6 && stage < 8)">\n        {{ ::\'Cancel\' | localize: \'Cancel\' }}\n      </button>\n      <button type="button"\n              class="slds-button slds-button--brand"\n              ng-click="triggerRemoteImport()"\n              ng-if="stage == 1 && mode === \'org\'"\n              id="datapack-import-modal-next-button"\n              ng-disabled="error.message || loading || !selectedPack">\n        {{ ::\'Next\' | localize: \'Next\' }}\n      </button>\n      <button type="button"\n              class="slds-button slds-button--brand"\n              ng-click="next()"\n              id="datapack-import-modal-next-button"\n              ng-if="((stage == 1 && mode === \'file\') || stage == 2 || (stage == 4 && errorCount() > 0)) && hasDataPacks()"\n              ng-disabled="error.message || loading || ((mode === \'file\' && !import.file) || (mode === \'org\' && !hasASelection())) || errorCount() > 0 || !hasASelection()">\n        {{ ::\'Next\' | localize: \'Next\' }}\n      </button>\n      <button type="button"\n              class="slds-button slds-button--brand"\n              ng-click="startImport()"\n              id="datapack-import-modal-next-button"\n              ng-if="(stage == 3 && !error.message && hasDataPacks()) "\n              ng-disabled="loading || errorCount() > 0">\n        {{ ::\'Next\' | localize: \'Next\' }}\n      </button>\n      <button type="button"\n              class="slds-button slds-button--brand"\n              ng-click="$hide()"\n              id="datapack-import-modal-done-button"\n              ng-if="stage < 5 && ((stage > 1 && error.message) || (((stage > 1 && mode == \'org\') || mode === \'file\')) && !hasDataPacks() && errorCount() == 0)"\n              ng-disabled="loading || (mode === \'file\' && exportTo.file == \'\')">\n        {{ ::\'Done\' | localize: \'Done\' }}\n      </button>\n      <button type="button"\n              class="slds-button slds-button--brand"\n              ng-click="$hide()"\n              id="datapack-import-activate-now-button"\n              ng-if="stage == 5 && !hasDataPacksToActivate()"\n              ng-disabled="loading || (mode === \'file\' && exportTo.file == \'\')">\n        {{ ::\'Done\' | localize: \'Done\' }}\n      </button>\n      <button type="button"\n              class="slds-button slds-button--neutral"\n              ng-click="$hide()"\n              id="datapack-import-activate-later-button"\n              ng-if="stage == 5 && hasDataPacksToActivate()"\n              ng-disabled="loading || (mode === \'file\' && exportTo.file == \'\')">\n        {{ ::\'ActivateLater\' | localize: \'Activate Later\' }}\n      </button>\n      <button type="button"\n              class="slds-button slds-button--brand"\n              ng-click="next()"\n              id="datapack-import-activate-now-button"\n              ng-if="stage == 5 && hasDataPacksToActivate()"\n              ng-disabled="loading || (mode === \'file\' && exportTo.file == \'\')">\n        {{ ::\'ActivateNow\' | localize: \'Activate Now\' }}\n      </button>\n      <button type="button"\n              class="slds-button slds-button--neutral"\n              ng-click="$hide()"\n              id="datapack-import-modal-cancel-button"\n              ng-disabled="loading"\n              ng-if="(stage == 6 && !error.message && hasDataPacks())">\n        {{ ::\'Cancel\' | localize: \'Cancel\' }}\n      </button>\n      <button type="button"\n              class="slds-button slds-button--brand"\n              ng-click="startActivation()"\n              id="datapack-import-modal-next-button"\n              ng-if="(stage == 6 && !error.message && hasDataPacks()) "\n              ng-disabled="loading || errorCount() > 0 || !hasASelection()">\n        {{ ::\'Next\' | localize: \'Start Activation\' }}\n      </button>\n      <button type="button"\n              class="slds-button slds-button--brand"\n              ng-click="$hide()"\n              id="datapack-import-modal-done-button"\n              ng-if="stage == 8"\n              ng-disabled="loading">\n        {{ ::\'Done\' | localize: \'Done\' }}\n      </button>\n    </div>\n  </div>\n  <div class="via-message slds-grid slds-grid--frame slds-grid--align-center">\n    <div class="slds-align--absolute-center slds-box slds-theme--default">\n      <h1 class="slds-text-heading--large">{{ \'DragAndDropDataPack\' | localize:\'Drag and drop a DataPack file onto the window.\'}}</h1>\n      <slds-svg-icon sprite="\'utility\'" icon="\'upload\'" size="\'x-large\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n    </div>\n  </div>\n</div>'),$templateCache.put("DataPackEditForm.tpl.html",'<form class="slds-grid slds-wrap slds-grid--pull-padded">\n  <div class="slds-col--padded slds-size--1-of-2">\n    <div class="slds-form-element">\n      <label class="slds-form-element__label">{{ ::\'Name\'| localize:\'Name\' }}</label>\n      <div class="slds-form-element__control">\n        <input id="datapack-name-input" class="slds-input" type="text" ng-model="datapack.Name" placeholder="{{ ::\'Dev2ProdName\'| localize:\'e.g. Pack Name \'}}" ng-disabled="remote"/>\n      </div>\n    </div>\n  </div>\n  <div class="slds-col--padded slds-size--1-of-2">\n    <div class="slds-form-element">\n      <span class="slds-form-element__label">{{ ::\'Type\'| localize:\'Type\' }}</span>\n      <div class="slds-form-element__control slds-has-divider--bottom">\n        <span id="datapack-type-text" class="slds-form-element__static">{{ datapack.PrimaryDataPackType || datapack.Type | readableDataPackTypeName}}</span>\n      </div>\n    </div>\n  </div>\n  <div class="slds-col--padded slds-size--1-of-1">\n    <div class="slds-form-element">\n      <label class="slds-form-element__label">{{ ::\'Description\'| localize:\'Description\' }}</label>\n      <div class="slds-form-element__control">\n        <textarea id="datapack-description-textarea" class="slds-textarea" type="text" ng-model="datapack.Description" ng-disabled="remote"></textarea>\n      </div>\n    </div>\n  </div>\n  <div class="slds-col--padded slds-size--1-of-2">\n    <div class="slds-form-element">\n      <span class="slds-form-element__label">{{ ::\'Version\'| localize:\'Version\' }}</span>\n      <div class="slds-form-element__control slds-has-divider--bottom">\n        <span id="datapack-version-text" class="slds-form-element__static">{{datapack.Version | number:1}}</span>\n      </div>\n    </div>\n  </div>\n  <div class="slds-col--padded slds-size--1-of-2">\n    <div class="slds-form-element">\n      <span class="slds-form-element__label">{{ ::\'Source\'| localize:\'Source\' }}</span>\n      <div class="slds-form-element__control slds-has-divider--bottom">\n        <span id="datapack-source-text" class="slds-form-element__static">{{datapack.Source}}</span>\n      </div>\n    </div>\n  </div>\n</form>'),$templateCache.put("DrvCompTree.tpl.html",'<li role="treeitem" ng-if="displayType != \'VlocityDataPack\'" aria-level="{{depth}}">\n  <div class="slds-tree__item">\n    <div class="slds-form-element">\n      <div class="slds-form-element__control slds-input-has-icon slds-input-has-icon--left">\n        <label class="slds-checkbox" ng-disabled="!isEditable">\n          <input type="checkbox" ng-model="objectData.VlocityDataPackIsIncluded" ng-show="isEditable" ng-disabled="isLocked || !isEditable" class="datapack-tree-{{depth}}-name-is-selected-checkbox" />\n          <span class="slds-checkbox--faux" ng-show="isEditable"></span>\n          <slds-svg-icon sprite="\'utility\'" icon="\'page\'" size="\'x-small\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n          <span class="slds-m-left--x-small slds-form-element__label datapack-tree-{{depth}}-name-text">\n            {{ displayName }} {{ displayMoreInfo ? \'-\' : \'\' }} {{ displayMoreInfo }}<span ng-if="showStatus" class="datapack-tree-{{depth}}-status-text">{{ displayStatus ? \'-\' : \'\'}}  {{ displayStatus }} {{ displayError ? \'-\' : \'\' }} {{ displayError }}</span>\n            <b ng-if="$root.packsNeedingUpdate.ToUpdate == displayName" class="datapack-tree-{{depth}}-update-status-text">(Will update {{$root.packsNeedingUpdate.CurrentVersion}} <slds-svg-icon sprite="\'utility\'" icon="\'forward\'" size="\'x-small\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon> {{$root.packsNeedingUpdate.NewVersion | number:1}})</b>\n          </span>\n        </label>\n        <span ng-if="displayMessage" class="slds-text-body--small slds-text-color--error slds-m-around--large" style="color:darkgray;">\n          <slds-svg-icon ng-if="displayActiveWarning" sprite="\'utility\'" icon="\'warning\'" size="\'x-small\'" extra-classes="\'slds-icon-text-warning\'"></slds-svg-icon>\n            {{ displayMessage }}\n        </span>\n      </div>\n    </div>\n  </div>\n</li>\n<ul class="slds-is-expanded" role="group" ng-if="displayChildren != null && objectData.VlocityDataPackIsIncluded">\n  <li role="treeitem" ng-repeat="(key, val) in displayChildren" aria-level="{{$parent.depth}}" ng-if="!filteredType(key)">\n    <div class="slds-tree__item" ng-if="!hideLabel">\n      <button class="slds-button slds-button--icon-bare slds-m-right--x-small datapack-tree-{{depth}}-toggle-button" ng-click="showChildren[key] = (!showChildren[key] && !isLocked)" >\n        <slds-button-svg-icon icon="\'chevronright\'" sprite="\'utility\'" size="\'small\'" ng-if="!showChildren[key]"></slds-button-svg-icon>\n        <slds-button-svg-icon icon="\'chevrondown\'" sprite="\'utility\'" size="\'small\'" ng-if="showChildren[key]"></slds-button-svg-icon>\n        <span class="slds-assistive-text">Toggle</span>\n      </button>\n      <a href="#" tabindex="-1" role="presentation" class="slds-truncate datapack-tree-{{depth}}-name-text" >\n        {{ key | readableDataPackTypeName }} ({{selectedChildCount(val)}})\n      </a>\n    </div>\n    <drv-comptree object-data="child"\n                  ng-repeat="child in displayChildren[key]"\n                  showStatus="$parent.showStatus"\n                  record-status="recordStatus"\n                  is-editable="isEditable"\n                  is-locked="isLocked"\n                  expand-all="expandAll"\n                  depth="$parent.depth + 1"\n                  ng-show="showChildren[key] || hideLabel"\n                  hide-label="false"></drv-comptree>\n  </li>\n</ul>'),$templateCache.put("DrvExportModal.tpl.html",'<div id="datapack-export-modal" class="slds-modal slds-fade-in-open">\n  <style>\n    .slds-modal .vlc-framed {\n      border: 1px solid #d8dde6;\n      min-height: 465px;\n      max-height: 465px;\n    }\n  </style>\n  <div class="slds-modal__container">\n    <div class="slds-modal__header">\n      <h2 class="slds-text-heading--medium" ng-if="stage != 2" id="datapack-export-modal-title">{{ ::\'Dev2ProdExportModalTitle\'| localize:\'Export DataPack\' }}</h2>\n      <h2 class="slds-text-heading--medium" ng-if="stage == 2" id="datapack-export-modal-title">{{ ::\'Dev2ProdExportReviewModalTitle\'| localize:\'Review DataPack Export\' }}</h2>\n      <div class="slds-notify_container" ng-if="(warningCount(dataToProcess) > 0 && !dataToProcess.errors && stage < 2) || (dataToProcess.errors || error.message)" id="datapack-export-modal-title-errors">\n        <div class="slds-notify slds-notify--toast" role="alert" ng-class="{\'slds-theme--warning\': warningCount(dataToProcess) > 0 && !dataToProcess.errors && stage < 2, \'slds-theme--error\': dataToProcess.errors || error.message}">\n          <span class="slds-assistive-text" ng-if="warningCount(dataToProcess) > 0 && !dataToProcess.errors && stage < 2">Warning</span>\n          <span class="slds-assistive-text" ng-if="dataToProcess.errors || error.message">Error</span>\n          <div class="notify__content slds-grid">\n            <slds-svg-icon sprite="\'utility\'" icon="\'warning\'" size="\'small\'" extra-classes="\'slds-m-right--small slds-col slds-no-flex\'"></slds-svg-icon>\n            <div class="slds-col slds-align-middle">\n              <h2 class="slds-text-heading--small" ng-if="warningCount(dataToProcess) > 0 && !dataToProcess.errors && stage < 2" id="datapack-export-modal-title-error-message">{{ ::\'Dev2ProdExportWarningTitle\'|localize:\'Export has warnings\'}}</h2>\n              <h2 class="slds-text-heading--small" ng-if="dataToProcess.errors || error.message" id="datapack-export-modal-title-error-message">{{ ::\'Dev2ProdExportErrorTitle\'|localize:\'Export Error\'}}</h2>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class="slds-modal__content slds-p-around--x-large slds-grid slds-grid--vertical">\n      <div style="min-height: 200px; position: relative;" ng-if="loading">\n        <div class="slds-spinner--brand slds-spinner slds-spinner--large slds-m-top--medium slds-m-bottom--medium" aria-hidden="false" role="alert">\n          <div class="slds-spinner__dot-a"></div>\n          <div class="slds-spinner__dot-b"></div>\n        </div>\n        <h2 class="slds-text-align--center slds-text-heading--medium slds-m-top--large" ng-if="stage < 3 && (progress.Finished || progress.Total)">{{ ::\'PreparingForExport\'| localize:\'Preparing For Export \' }} {{progress.Finished}} {{ ::\'Of\'|localize:\'Of\'}} {{progress.Total}}</h2>\n        <h2  class="slds-text-align--center slds-text-heading--medium slds-m-top--large" ng-if="stage >= 3 && (progress.Finished || progress.Total)">{{ ::\'Exporting\'| localize:\'Exporting\' }} {{progress.Finished}} {{ ::\'Of\'|localize:\'Of\'}} {{progress.Total}}</h2>\n      </div>\n\n      <div ng-if="error.message">\n        {{error.message | adaptErrorMessage }}\n      </div>\n\n      <div ng-show="stage < 2 && !loading && dataToProcess.errors" class="datapack-export-modal-errors">\n        <ul class="slds-list--vertical">\n          <li class="slds-list__item" ng-repeat="(dataPackKey, errorList) in dataToProcess.errors">\n            <div role="presentation" >\n              <span class="slds-icon_container">\n                <slds-svg-icon sprite="\'utility\'" icon="\'warning\'" size="\'x-small\'" extra-classes="\'slds-icon-text-error\'"></slds-svg-icon>\n              </span>\n              <b>{{ errorList[0].VlocityDataPackName }} ({{ errorList[0].VlocityDataPackLabel }}):</b> {{ errorList[0].VlocityDataPackMessage }}\n              <a class="slds-button" ng-click="ignoreErrorForDataPacks(dataPackKey)" style="cursor: pointer" id="datapack-export-modal-ignore-errors-{{$index}}-button">{{ ::\'Dev2ProdIgnoreWarning\'| localize:\'Ignore This Error\' }}</a>\n            </div>\n          </li>\n        </ul>\n        <button ng-if="Object.keys(dataToProcess.errors).length > 1" ng-click="ignoreErrorForDataPacks(Object.keys(dataToProcess.errors))" class="slds-button"\n          id="datapack-export-modal-ignore-all-errors-button">{{ ::\'Dev2ProdIgnoreAllWarning\'| localize:\'Ignore All Errors\' }}</button>\n      </div>\n\n      <div class="vlc-framed slds-scrollable--y datapack-export-modal-select-step"\n            ng-if="(stage < 3 && !loading && dataToProcess.dataPacks && dataToProcess.dataPacks.length > 0 && !dataToProcess.errors)">\n        <ul class="slds-tree" role="tree" ng-if="hasDataPacks()">\n          <li role="treeitem" aria-level="1" id="datapack-export-modal-warnings" ng-if="stage < 2 && warningCount(dataToProcess) > 0" ng-init="showChildren.warnings = true">\n            <div class="slds-tree__item" id="datapack-export-modal-toggle-warnings-button" ng-click="showChildren.warnings = !showChildren.warnings">\n              <button class="slds-button slds-button--icon-bare slds-m-right--x-small">\n                <slds-button-svg-icon icon="\'chevronright\'" sprite="\'utility\'" size="\'small\'" ng-if="!showChildren.warnings"></slds-button-svg-icon>\n                <slds-button-svg-icon icon="\'chevrondown\'" sprite="\'utility\'" size="\'small\'" ng-if="showChildren.warnings"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Toggle</span>\n              </button>\n              <a role="presentation" class="slds-truncate" id="datapack-export-modal-warnings-summary-text">{{ ::\'Dev2ProdWarning\' | localize:\'Warnings\' }} ({{warningCount(dataToProcess)}})</a>\n            </div>\n            <div ng-show="showChildren.warnings" >\n            <ul class="slds-is-expanded" role="group">\n              <li role="treeitem" aria-level="2" ng-repeat="(dataPackKey, errorList) in dataToProcess.warnings" id="datapack-export-modal-warning-{{$index}}">\n                <div class="slds-tree__item">\n                  <div class="slds-form-element">\n                    <div class="slds-form-element__control slds-input-has-icon slds-input-has-icon--left">\n                      <label class="slds-checkbox" ng-disabled="!isEditable">\n                        <slds-svg-icon sprite="\'utility\'" icon="\'warning\'" size="\'x-small\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                        <span class="slds-m-left--x-small slds-form-element__label" id="datapack-export-modal-warning-{{$index}}-message">\n                          <b>{{errorList[0].VlocityDataPackName }} ({{ errorList[0].VlocityDataPackLabel }}):</b> {{ errorList[0].VlocityDataPackMessage }}\n                        </span>\n                      </label>\n                    </div>\n                  </div>\n                </div>\n              </li>\n            </ul>\n          </div>\n          </li>\n          <li role="treeitem" aria-level="1" ng-repeat="data in dataToProcess | groupByType track by $index"\n              id="datapack-export-modal-tree-item-{{$index}}">\n            <div class="slds-tree__item" ng-click="hideChildren[data.$type] = (!hideChildren[data.$type] && !isLocked)" id="datapack-export-modal-tree-item-{{$index}}-toggle-button">\n              <button class="slds-button slds-button--icon-bare slds-m-right--x-small">\n                <slds-button-svg-icon icon="\'chevronright\'" sprite="\'utility\'" size="\'small\'" ng-if="hideChildren[data.$type]"></slds-button-svg-icon>\n                <slds-button-svg-icon icon="\'chevrondown\'" sprite="\'utility\'" size="\'small\'" ng-if="!hideChildren[data.$type]"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Toggle</span>\n              </button>\n              <a role="presentation" class="slds-truncate" id="datapack-export-modal-tree-item-{{$index}}-summary-text">\n                 {{ data.$label | readableDataPackTypeName }} ({{selectedChildCount(data.$records)}})\n              </a>\n            </div>\n            <drv-comptree object-data="value.VlocityDataPackData" \n                      record-status="value.VlocityDataPackRecords"\n                      ng-repeat="value in data.$records"\n                      is-editable="stage < 2 && !loading"\n                      hide-label="true"\n                      expand-all="stage == 2"\n                      depth="1"\n                      showStatus="false"\n                      ng-show="!hideChildren[data.$type]"\n                      is-locked="loading && stage < 2">\n            </drv-comptree>\n          </li>\n        </ul>\n        <div class="list-group" ng-if="!hasDataPacks()" id="datapack-export-modal-no-tree-items">\n          <div class="list-group-item-text">\n            <div class="list-group-item-heading">\n              <label>\n                <i class="icon icon-v-claim-line"></i>\n                <b>{{ :: \'ExportNothing\' | localize:\'There is nothing to export.\' }}</b>\n              </label>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div ng-if="stage < 2 && !loading && dataToProcess.dataPacks && dataToProcess.dataPacks.length > 0 && !dataToProcess.errors">\n        <a ng-click="select(true)" class="slds-button slds-button-link" id="datapack-export-modal-select-all-button">Select All</a>&nbsp;|&nbsp;<a ng-click="select(false)" class="slds-button slds-button-link" id="datapack-export-modal-select-none-button">Select None</a>\n      </div>\n\n      <div ng-if="stage == 3 && !loading" class="content">\n        <form class="slds-grid slds-wrap slds-grid--pull-padded" id="datapack-export-modal-data-pack-form">\n          <div class="slds-col--padded slds-size--1-of-2">\n            <div class="slds-form-element">\n              <label class="slds-form-element__label">{{ ::\'Name\'| localize:\'Name\' }}</label>\n              <div class="slds-form-element__control">\n                <input class="slds-input" type="text" ng-model="datapack.Name" placeholder="{{ ::\'Dev2ProdName\'| localize:\'e.g. Pack Name\'}}" id="datapack-export-modal-data-pack-name-input"/>\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-2">\n            <div class="slds-form-element">\n              <span class="slds-form-element__label">{{ ::\'Type\'| localize:\'Type\' }}</span>\n              <div class="slds-form-element__control slds-has-divider--bottom">\n                <span class="slds-form-element__static" id="datapack-export-modal-data-pack-type-text">{{ datapack.PrimaryDataPackType }}</span>\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-1">\n            <div class="slds-form-element">\n              <label class="slds-form-element__label">{{ ::\'Description\'| localize:\'Description\' }}</label>\n              <div class="slds-form-element__control">\n                <textarea class="slds-textarea" type="text" ng-model="datapack.Description"\n                id="datapack-export-modal-data-pack-description-textarea"></textarea>\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-2">\n            <div class="slds-form-element">\n              <div class="slds-form-element__control">\n                <label class="slds-checkbox">\n                  <input type="checkbox" ng-model="viewModel.addToLibrary" \n                         id="datapack-export-modal-data-pack-add-to-library-checkbox" />\n                  <span class="slds-checkbox--faux"></span>\n                  <span class="slds-form-element__label">{{ ::\'AddToLibrary\' | localize:\'Add To Library\'}}</span>\n                </label>\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-2">\n            <div class="slds-form-element">\n              <div class="slds-form-element__control">\n                <label class="slds-checkbox">\n                  <input type="checkbox" ng-model="viewModel.Published" ng-disabled="!viewModel.addToLibrary" \n                         id="datapack-export-modal-data-published-checkbox"/>\n                  <span class="slds-checkbox--faux"></span>\n                  <span class="slds-form-element__label">{{ ::\'Published\' | localize:\'Published\'}}</span>\n                </label>\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-2">\n            <div class="slds-form-element__control slds-m-top--small">\n              <label class="slds-radio">\n                <input type="radio" ng-model="viewModel.createNewVersion" ng-value="true" ng-disabled="!viewModel.addToLibrary" \n                       id="datapack-export-modal-create-new-version-true-radio"/>\n                <span class="slds-radio--faux"></span>\n                <span class="slds-form-element__label">{{ ::\'CreateNewVersion\' | localize:\'Create New Version\' }}</span>\n              </label>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-form--inline slds-size--1-of-2">\n             <div class="slds-form-element slds-m-top--x-small">\n              <label class="slds-form-element__label">{{ ::\'Version\' | localize:\'Version\' }}</label>\n              <div class="slds-form-element__control">\n                <input class="slds-input slds-input--small" type="number" step="0.1" ng-model="viewModel.newVersion" ng-disabled="!viewModel.addToLibrary" ng-attr-min="{{((viewModel.existingVersion*10)+1)/10}}"\n                       id="datapack-export-modal-new-version-input" >\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-2" ng-if="viewModel.existingVersion > 0">\n            <div class="slds-form-element__control slds-m-top--small">\n              <label class="slds-radio">\n                <input type="radio" ng-model="viewModel.createNewVersion" ng-value="false" ng-disabled="!viewModel.addToLibrary" \n                       id="datapack-export-modal-create-new-version-false-radio"/>\n                <span class="slds-radio--faux"></span>\n                <span class="slds-form-element__label">{{ ::\'UpdateExistingVersion\' | localize:\'Update Existing Version\' }}</span>\n              </label>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-form--inline slds-size--1-of-2" ng-if="viewModel.existingVersion > 0">\n             <div class="slds-form-element slds-m-top--x-small">\n              <label class="slds-form-element__label">{{ ::\'Version\' | localize:\'Version\' }}</label>\n              <div class="slds-form-element__control">\n                <input class="slds-input slds-input--small" type="number" step="0.1" ng-model="viewModel.existingVersion" disabled="disabled" ng-attr-min="1" \n                       id="datapack-export-modal-existing-version-input">\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-1 slds-m-top--x-small">\n            <div class="slds-form-element">\n              <div class="slds-form-element__control">\n                <label class="slds-checkbox">\n                  <input type="checkbox" ng-model="viewModel.download" \n                          id="datapack-export-modal-download-checkbox"/>\n                  <span class="slds-checkbox--faux"></span>\n                  <span class="slds-form-element__label">{{ ::\'Download\' | localize:\'Download\'}}</span>\n                </label>\n              </div>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n    <div class="slds-modal__footer" ng-class="{\'slds-modal__footer--directional\': stage == 2 && datapack.types !== \'MultiPack\'}">\n      <button type="button" class="slds-button slds-button--brand" id="datapack-export-modal-previous-button"\n              ng-click="previous();" ng-if="stage == 2 && datapack.types !== \'MultiPack\'" ng-disabled="loading || dataToProcess.errors">\n              {{ ::\'Previous\' | localize: \'Previous\' }}\n        </button>\n      <button type="button" class="slds-button slds-button--neutral" id="datapack-export-modal-cancel-button"\n              ng-click="cancel()">\n              {{ ::\'Cancel\' | localize: \'Cancel\' }}\n      </button>\n      <button type="button" class="slds-button slds-button--brand" ng-click="next();" id="datapack-export-modal-next-button"\n              ng-if="stage < 3" ng-disabled="loading || dataToProcess.errors || !hasASelection()">\n              {{ ::\'Next\' | localize: \'Next\' }}\n      </button>\n      <button type="button" class="slds-button slds-button--brand" ng-click="done();"  id="datapack-export-modal-done-button"\n              ng-if="stage == 3" \n              ng-disabled="(loading || !datapack.Name || datapack.Name == \'\') || (!viewModel.addToLibrary && !viewModel.download)">\n'+"              {{ ::'Done' | localize: 'Done' }}\n      </button>\n    </div>\n  </div>\n</div>")}]);

},{}]},{},[1]);
})();

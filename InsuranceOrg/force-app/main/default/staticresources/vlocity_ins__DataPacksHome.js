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
require('./polyfills/Array.find.js');
require('./polyfills/Array.findIndex.js');

angular.module('datapackshome', ['vlocity', 'ngTable', 'ngSanitize', 'drvcomp', 'sldsangular', 'infinite-scroll'])
  .config(['remoteActionsProvider', function(remoteActionsProvider) {
      'use strict';
      remoteActionsProvider.setRemoteActions(window.remoteActions || {});
  }]).config(['$compileProvider', function ($compileProvider) {
      'use strict';
      $compileProvider.debugInfoEnabled(false);
  }]).config(['$localizableProvider', function($localizableProvider) {
      'use strict';
      $localizableProvider.setLocalizedMap(window.localeMap);
      $localizableProvider.setDebugMode(window.ns === '');
  }]);

require('./modules/datapackshome/controller/homeController.js');
require('./modules/datapackshome/controller/installedController.js');
require('./modules/datapackshome/controller/publishedController.js');

require('./modules/datapackshome/filter/onlyActive.js');

require('./modules/datapackshome/templates/templates.js');

},{"./modules/datapackshome/controller/homeController.js":2,"./modules/datapackshome/controller/installedController.js":3,"./modules/datapackshome/controller/publishedController.js":4,"./modules/datapackshome/filter/onlyActive.js":5,"./modules/datapackshome/templates/templates.js":6,"./polyfills/Array.find.js":7,"./polyfills/Array.findIndex.js":8}],2:[function(require,module,exports){
angular.module('datapackshome')
    .controller('homeController', function($scope, $rootScope, $sldsModal, $localizable,
                                            remoteActions, drvDataPack, $drvImport, $drvExport,
                                            replacementNamespace, $sldsPrompt, $sanitize) {
        'use strict';
        var escape = document.createElement('textarea');
        $rootScope.unescapeHtml = function unescapeHTML(html) {
            'use strict';
            if (angular.isString(html)) {
                escape.innerHTML = html;
                return escape.value;
            } else {
                return html;
            }
        };

        function parseQuery(qstr) {
            var query = {};
            var a = qstr.substr(1).split('&');
            for (var i = 0; i < a.length; i++) {
                var b = a[i].split('=');
                // Suggested Name for DataPacks will often have spaces and something is converting them to + even when they are %20 in the URL
                query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '').replace('+', ' ');
            }
            return query;
        }

        if (fileNsPrefix() === '') {
            $rootScope.showNamespaceAlert = true;
        }

        $rootScope.hideErrorBanner = function() {
            $rootScope.showNamespaceAlert = false;
        };

        var nsWithoutUnderscores = fileNsPrefix().substring(0, fileNsPrefix().length - 2);
        var namespaceRegEx = new RegExp(nsWithoutUnderscores, 'g');

        $rootScope.nsPrefix = fileNsPrefix();
        $scope.tabs = [{
            title: 'Published',
            type: 'Export',
            template: 'PublishedTable.tpl.html'
        }, {
            title: 'Installed',
            type: 'Import',
            template: 'InstalledTable.tpl.html'
        }];
        $scope.tabs.activeTab = 0;

        $scope.$watch('tabs.activeTab', function(newValue) {
            $scope.$broadcast('reload');
        });

        $rootScope.showInfo = $scope.showInfo = function(datapack, org) {
            var modalScope = $scope.$new();
            modalScope.datapack = datapack;
            modalScope.hideChildren = {};
            modalScope.remote = !!org;
            modalScope.loading = true;

            modalScope.warningCount = function(warning) {
                if (!modalScope.datapack || !modalScope.datapack.warnings) {
                    return 0;
                }
                return Object.keys(modalScope.datapack.warnings)
                            .reduce(function(count, warning) {
                                return count + modalScope.datapack.warnings[warning].length;
                            }, 0);
            };

            modalScope.save = function() {
                remoteActions.updateDataPackInfo(datapack.Id, {
                    Name: modalScope.datapack.Name,
                    Description: modalScope.datapack.Description
                }).then(function(result) {
                    $scope.$broadcast('reload');
                    thisModal.hide();
                }, function(error) {
                });
                return false;
            };

            modalScope.selectedChildCount = function(array) {
                var count = array.reduce(function(count, child) {
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
                return count;
            };

            if (!modalScope.remote) {
                drvDataPack.getAllDataPackData(datapack.Id)
                    .then(function(dataPacks) {
                        modalScope.datapack.dataPacks = dataPacks.dataPacks;
                        modalScope.loading = false;
                    }, function(errors) {
                        modalScope.error = errors;
                        modalScope.loading = false;
                    });
            } else {
                drvDataPack.getRemoteDataPackData(org, datapack.Id)
                    .then(function(json) {
                        modalScope.datapack.dataPacks = json.dataPacks;
                        modalScope.loading = false;
                    }, function(errors) {
                        modalScope.error = errors;
                        modalScope.loading = false;
                    });
            }

            var thisModal;
            $localizable('PackDetails', 'Pack Details')
                .then(function(label) {
                    thisModal = $sldsModal({
                        title: label,
                        template: 'DataPackInfoModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                });
        };

        $scope.downloadPack = function(datapack) {
            return drvDataPack.getAllDataPackData(datapack.Id)
                .then(function(dataToProcess) {
                    dataToProcess.name = datapack.Name;
                    dataToProcess.description = datapack.Description;
                    dataToProcess.version = datapack.Version;
                    dataToProcess.status = datapack.Status;
                    downloadFile(dataToProcess, (/\.json/.test(datapack.Name) ?
                                                    datapack.Name : datapack.Name + '.json'));
                });
        };

        function downloadFile(data, filename) {
            if (typeof data === 'object') {
                data = JSON.stringify(data, undefined, 2);
            }
            data = data.replace(namespaceRegEx, replacementNamespace);

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

        $scope.deleteDataPack = function(datapack, group, $groups) {
            var deletePrompt = $sldsPrompt({
                title: 'Delete DataPack',
                content: 'Are you sure you want to delete this datapack?<br/> <br/>"' +
                    $sanitize(datapack.Name) + ' (Version ' + $sanitize(datapack.Version) + ')" ',
                theme: 'error',
                show: true,
                buttons: [{
                    label: 'Cancel',
                    type: 'neutral',
                    action: function() {
                        deletePrompt.hide();
                    }
                }, {
                    label: 'Delete',
                    type: 'destructive',
                    action: function() {
                        deletePrompt.hide();
                        datapack.deleting = true;
                        remoteActions.deleteDataPack(datapack.Id)
                            .then(function() {
                                $scope.$broadcast('reload', {
                                    delete: true,
                                    packId: datapack.Id,
                                    name: datapack.Name,
                                    group: group,
                                    $groups: $groups
                                });
                                //$scope[$scope.tabs.activeTab == 0 ? 'publishedTableParams' : 'installedTableParams'].reload();
                            }, function() {
                                $scope.$broadcast('reload', {
                                    delete: true,
                                    packId: datapack.Id,
                                    name: datapack.Name,
                                    group: group,
                                    $groups: $groups
                                });
                                //$scope[$scope.tabs.activeTab == 0 ? 'publishedTableParams' : 'installedTableParams'].reload();
                                datapack.deleting = false;
                            });
                    }
                }]
            });
        };

        var searchParams = parseQuery(window.location.search);

        if (searchParams.dataPackDataPublicId && searchParams.dataPackDataPublicSource) {
            $drvImport({
                scope: $scope,
                mode: 'publicdata',
                dataPackDataPublicId: searchParams.dataPackDataPublicId,
                dataPackDataPublicSource: searchParams.dataPackDataPublicSource,
                reloadPageOnComplete: true
            });
        }

        if (searchParams.exportDataPackType && searchParams.exportData) {
            $drvExport({
                scope: $scope,
                drvDataPackType: searchParams.exportDataPackType,
                drvExport: searchParams.exportData,
                drvMaxDepth: searchParams.maxDepth ? parseInt(searchParams.maxDepth) : -1,
                drvSuggestedName: searchParams.exportSuggestedName,
                reloadPageOnComplete: true
            });
        }

    });

},{}],3:[function(require,module,exports){
angular.module('datapackshome')
    .controller('installedController', function($scope, $sldsModal, $sanitize, $timeout, drvImportScopeManager,
                                            remoteActions, $filter, $rootScope) {
        'use strict';
        $scope.orgs = [];
        var checkingRemoteEntries = {};

        function loadRemoteOrgs() {
            remoteActions.getOrganizations()
                .then(function(remoteOrgs) {
                    if (remoteOrgs.length > 0) {
                        $scope.orgs = remoteOrgs;
                        $scope.orgs.forEach(function(org) {
                            if (org[fileNsPrefix() + 'Active__c']) {
                                validateOrgConnection(org.Name);
                            }
                        });
                    }
                });
        }

        loadRemoteOrgs();
        $scope.loading = true;
        $scope.viewModel = {
            showDropdown: false
        };

        $scope.$on('reload', function(event, args) {
            if (args && args.delete) {
                args.group.data = args.group.data.filter(function(row) {
                    return row.Id !== args.packId;
                });
                if (args.group.data.length === 0) {
                    var index = args.$groups.findIndex(function(group) {
                        return group.value === args.group.value;
                    });
                    args.$groups.splice(index, 1);
                }
            } else {
                $scope.installedTableParams.reload();
            }
        });

        $scope.isChecking = function(sourceOrg) {
            return checkingRemoteEntries[sourceOrg] &&  checkingRemoteEntries[sourceOrg].checking;
        };

        $scope.hasConnectionIssue = function(sourceOrg) {
            return checkingRemoteEntries[sourceOrg] && checkingRemoteEntries[sourceOrg].error;
        };

        $scope.getTooltipErrorMessage = function(sourceOrg) {
            if (checkingRemoteEntries[sourceOrg] && checkingRemoteEntries[sourceOrg].error) {
                return 'There was an error connecting to ' + sourceOrg + ':  ' +
                    checkingRemoteEntries[sourceOrg].error.message ?
                    checkingRemoteEntries[sourceOrg].error.message : checkingRemoteEntries[sourceOrg].error;
            } else {
                return '';
            }
        };

        $scope.hasNewVersion = function(sourceOrg, latestDataPack) {
            return checkingRemoteEntries[sourceOrg] && checkingRemoteEntries[sourceOrg][latestDataPack.Name] &&
                checkingRemoteEntries[sourceOrg][latestDataPack.Name].Version !== latestDataPack.Version;
        };

        $scope.getTooltipDownloadMessage = function(sourceOrg, latestDataPack) {
            return 'The published version on ' + sourceOrg + ' has changed to:  ' +
            $filter('number')(checkingRemoteEntries[sourceOrg][latestDataPack.Name].Version, 1);
        };

        $scope.installedTableParams = {
            multiselect: false,
            groupBy: 'Name',
            columns: [{
                id: 'name-text',
                field: 'Name',
                title: 'Name',
                sortable: 'Name',
                dynamic: 'row',
                getValue: function(rowScope, row) {
                    return '<a ng-click="$root.showInfo(row)">' + _.escape(row.Name) + ' (Version ' + row.Version + ')</a>';
                },
                getGroupValue: function($scope, $group) {
                    return _.escape($group.data[0].Name);
                },
                getGroupSortValue: function($scope, $group) {
                    return _.escape($group.data[0].Name);
                },
                resizable: true
            }, {
                id: 'type-text',
                field: 'Type',
                title: 'Type',
                sortable: 'Type',
                getValue: function(rowScope, row) {
                    return row.types;
                },
                getGroupValue: function($scope, $group) {
                    return $group.data[0].types;
                },
                getGroupSortValue: function($scope, $group) {
                    return $group.data[0].types;
                },
                resizable: true
            }, {
                title: 'Last Modified Date',
                id: 'last-modifed-date',
                sortable: 'LastModifiedDate',
                resizable: true,
                width: 140,
                field: 'LastModifiedDate',
                getGroupValue: function($scope, $group) {
                    return $filter('date')($group.data[0].LastModifiedDate, 'short');
                },
                getGroupSortValue: function($scope, $group) {
                    return $group.data[0].LastModifiedDate;
                },
                getValue: function($scope, row) {
                    return $filter('date')(row.LastModifiedDate, 'short');
                }
            }, {
                title: 'Last Modified By',
                id: 'last-modifed-by',
                resizable: true,
                width: 140,
                field: 'LastModifiedById',
                getGroupValue: function($scope, $group) {
                    return $group.data[0].LastModifiedBy ? _.escape($group.data[0].LastModifiedBy.Name) : '';
                },
                getValue: function($scope, row) {
                    return row.LastModifiedBy ? _.escape(row.LastModifiedBy.Name) : '';
                }
            }, {
                title: 'Source',
                field: 'Source',
                id: 'source',
                getGroupValue: function($scope, $group) {
                    return _.escape($group.data[0].Source);
                },
                resizable: true
            }],
            actions:[{
                text: 'Download',
                icon: {
                    sprite: 'utility',
                    icon: 'download'
                },
                click: function(row, group) {
                    $scope.downloadPack(row);
                }
            }, {
                type: 'delete',
                promptTitle: 'Delete Data Pack?',
                promptContent: function(row) {
                    return 'Are you sure you want to delete this Data Pack?<br/> <br/>"' +
                    _.escape(row.Name) + ' (Version ' + row.Version + ')" ';
                }
            }],
            data: function(offset, limit, tableParams) {
                $scope.loading = true;
                return $scope.getDataPacks('Import', tableParams);
            },
            sorting: {
                'Name': 'asc'
            }
        };

        var existingDataPacks = [];
        function validateOrgConnection(sourceOrg) {
            if (sourceOrg) {
                checkingRemoteEntries[sourceOrg] = {checking: true};
                remoteActions.getRemoteDataPacks(sourceOrg)
                    .then(function() {
                        checkingRemoteEntries[sourceOrg] = {};
                    }, function(error) {
                        checkingRemoteEntries[sourceOrg].checking = false;
                        checkingRemoteEntries[sourceOrg].error = error;
                    });
            }
        }

        $scope.getDataPacks = function(type, tableParams) {
            return remoteActions.getInstalledTabDataPacks().then(function(results) {
                existingDataPacks = results;
                var orderedData = results.filter(function(datapack) {
                    // DR-402 - exclude V11 DataPacks
                    if (datapack.Id.substr(0, datapack.Name.length) === datapack.Name) {
                        return false;
                    }
                    datapack[fileNsPrefix() + 'Version__c'] = datapack.Version =
                                                                    datapack.Version == null ? 1 : +datapack.Version;
                    datapack.types = datapack.PrimaryDataPackType ? datapack.PrimaryDataPackType : (datapack.DataPacks && datapack.DataPacks.length > 0 ? datapack.DataPacks[0].VlocityDataPackLabel : '');
                    datapack.Published = datapack.Status === 'Published';
                    if (!datapack.Source) {
                        datapack.Source = 'From File';
                    } else if (datapack.Source !== 'Local') {
                        if ($scope.orgs.find(function(org) {
                            return org.Name === datapack.Source;
                        })) {
                            checkingRemoteEntries[datapack.Source] = {
                                checking: true
                            };
                        }
                    }
                    datapack.Description = $rootScope.unescapeHtml(datapack.Description);
                    return datapack.Type === type || (type === 'Export' && datapack.Type === 'MultiPack');
                });
                tableParams.count(orderedData.length);
                $scope.loading = false;
                $timeout(checkUpdatesToRemoteSources, 2000);
                return orderedData;
            });
        };

        var checkUpdatesToRemoteSources = function() {
            Object.keys(checkingRemoteEntries).forEach(function(sourceOrg) {
                remoteActions.getRemoteDataPacks(sourceOrg)
                    .then(function(datapacks) {
                        if (checkingRemoteEntries[sourceOrg]) {
                            checkingRemoteEntries[sourceOrg].checking = false;
                        }
                        checkingRemoteEntries[sourceOrg] = datapacks.reduce(function(obj, pack) {
                            obj[pack.Name] = pack;
                            return obj;
                        }, checkingRemoteEntries[sourceOrg] ? checkingRemoteEntries[sourceOrg] : {});
                    }, function(error) {
                        checkingRemoteEntries[sourceOrg].checking = false;
                        checkingRemoteEntries[sourceOrg].error = error;
                    });
            });
        };

        $scope.onImportComplete = function(modalScope) {
            remoteActions.updateDataPackInfo(modalScope.dataToProcess.dataPackId, {
                Name: modalScope.selectedPack.Name,
                Description: modalScope.selectedPack.Description,
                Status: 'Saved',
                Version: modalScope.selectedPack.Version__c
            }).then(function() {
                $scope.installedTableParams.reload();
            });
        };

        $scope.remotePackForUpgrade = function(org, existingPack) {
            return checkingRemoteEntries[org][existingPack.Name];
        };

        $scope.updateToNewVersion = function(org, existingPack) {
            var modalScope = drvImportScopeManager($scope);
            modalScope.fileNsPrefix = fileNsPrefix();
            modalScope.loading = true;
            modalScope.org = org;
            modalScope.selectedPack = checkingRemoteEntries[org][existingPack.Name];
            modalScope.selectToImport = function(pack) {
                if (pack) {
                    modalScope.selected = pack.Id;
                    modalScope.selectedPack = pack;
                } else {
                    modalScope.selected = null;
                }
            };
            $scope.onImportComplete = function() {
                remoteActions.updateDataPackInfo(modalScope.dataToProcess.dataPackId, {
                    Name: modalScope.selectedPack.Name,
                    Description: modalScope.selectedPack.Description,
                    Status: 'Saved',
                    Version: modalScope.selectedPack.Version__c,
                    Source: org
                }).then(function() {
                    $scope.installedTableParams.reload();
                });
            };
            modalScope.loading = true;
            remoteActions.getRemoteDataPackData(org, modalScope.selectedPack.Id)
                .then(function(json) {
                    modalScope.loading = false;
                    modalScope.dataToProcess = json;
                    modalScope.next();
                }, function(errors) {
                    modalScope.error = errors;
                });
            var thisModal = $sldsModal({
                template: 'DrvImportModal.tpl.html',
                backdrop: 'static',
                scope: modalScope,
                show: true
            });
        };

        $scope.showManageOrgConnectionsModal = function() {
            var modalScope = $scope.$new();
            modalScope.done = function() {
                loadRemoteOrgs();
                thisModal.hide();
            };
            modalScope.fileNsPrefix = fileNsPrefix();
            modalScope.addAnOrg = function() {
                $scope.orgs.push({
                    edit: true
                });
            };
            modalScope.editOrg = function(sourceOrg) {
                sourceOrg.edit = true;
                sourceOrg._Name = sourceOrg.Name;
            };
            modalScope.stopEditOrg = function(sourceOrg, skipNameChange) {
                sourceOrg.edit = false;
                if (!skipNameChange) {
                    sourceOrg.Name = sourceOrg._Name;
                    delete sourceOrg._Name;
                } else if (!!sourceOrg._Name && sourceOrg.Name !== sourceOrg._Name) {
                    sourceOrg.Name = sourceOrg._Name;
                    delete sourceOrg._Name;
                }
                checkingRemoteEntries[sourceOrg.Name] = {checking: true};
                if (sourceOrg.Name === '' || sourceOrg.Name == null) {
                    checkingRemoteEntries[sourceOrg.Name].checking = false;
                    checkingRemoteEntries[sourceOrg.Name].error = {
                        message: 'You must set a name'
                    };
                    return;
                }
                remoteActions.saveLibraryOrgs([{
                    'Active__c': !!sourceOrg[fileNsPrefix() + 'Active__c'],
                    'Name': sourceOrg.Name,
                    'Id': sourceOrg.Id
                }]).then(function(result) {
                    if (!sourceOrg.Id) {
                        sourceOrg.Id = result[0].id;
                    }
                    validateOrgConnection(sourceOrg.Name);
                }, function(error) {
                    checkingRemoteEntries[sourceOrg.Name].checking = false;
                    checkingRemoteEntries[sourceOrg.Name].error = error;
                });
            };
            modalScope.deleteOrg = function(org) {
                org.deleting = true;
                remoteActions.deleteLibraryOrgs([org.Name])
                    .then(function() {
                        $scope.orgs = $scope.orgs.filter(function(existingOrg) {
                            return existingOrg.Name !== org.Name;
                        });
                    });
            };

            modalScope.isChecking = function(sourceOrg) {
                if (!sourceOrg) {
                    return $scope.orgs.find(function(sourceOrg) {
                        return $scope.isChecking(sourceOrg.Name) || sourceOrg.deleting;
                    });
                }
                return $scope.isChecking(sourceOrg.Name);
            };

            modalScope.hasConnectionIssue = function(sourceOrg) {
                return $scope.hasConnectionIssue(sourceOrg.Name);
            };
            modalScope.getTooltipErrorMessage = function(sourceOrg) {
                return $scope.getTooltipErrorMessage(sourceOrg.Name);
            };
            var thisModal = $sldsModal({
                template: 'DataPackOrgManagementModal.tpl.html',
                backdrop: 'static',
                scope: modalScope,
                show: true
            });
        };

    });

},{}],4:[function(require,module,exports){
angular.module('datapackshome')
    .controller('publishedController', function($scope, $sldsModal, $sanitize, drvImportScopeManager, $timeout,
                                            remoteActions, $filter, drvDataPack, $q, $rootScope) {
        'use strict';
        $scope.selectedMultiPack = {};

        $scope.onBeforeSelectAll = function() {
            return false;
        };

        $scope.onSelected = function(row) {
            var selected = $scope.publishedTableParams.selected();
            if ($scope.selectedMultiPack[row.Name] !== row.Id) {
                var indexToRemove = selected.findIndex(function(existing) {
                    return $scope.selectedMultiPack[row.Name] === existing;
                });
                if (indexToRemove > -1) {
                    selected.splice(indexToRemove, 1);
                    $scope.publishedTableParams.getData().forEach(function(group) {
                        group.data.forEach(function(row_) {
                            if (row_.Id === $scope.selectedMultiPack[row.Name]) {
                                row_.selected = false;
                            }
                        });
                    });
                }
                $scope.selectedMultiPack[row.Name] = row.Id;
            } else {
                delete $scope.selectedMultiPack[row.Name];
            }
        };

        $scope.hasSelectionsForMultiPack = function() {
            var hasSelectionCount = 0;
            Object.keys($scope.selectedMultiPack).forEach(function(key) {
                if ($scope.selectedMultiPack[key]) {
                    hasSelectionCount++;
                }
            });
            return hasSelectionCount >= 2;
        };

        $scope.saveNewMultiPack = function(modalScope, dataToProcess, thisModal) {
            packsNeedingUpdate = {};
            return saveMultiPack(modalScope, Object.keys($scope.selectedMultiPack).map(function(key) {
                    return $scope.selectedMultiPack[key];
                }), thisModal);
        };

        function saveMultiPack(modalScope, packsToJoin, thisModal) {
            // if we're updating an existing pack we need to combine the packs
            // into a seperate new datapack first.
            // Then we'll use  drvDataPack.setDataToReady to update the existing version
            // Then we'll delete the new one
            modalScope.loading = true;
            drvDataPack.combineDataPacks(packsToJoin)
                .then(function(packData) {
                    modalScope.dataToProcess = packData;
                    if (!modalScope.viewModel.createNewVersion) {
                        var packToUpdate = existingDataPacks[modalScope.datapack.Name].find(function(pack) {
                            return pack.Version === modalScope.viewModel.existingVersion;
                        });
                        if (packToUpdate) {
                            var newPackId = packData.dataPackId;
                            packData.dataPackId = packToUpdate.Id;
                            return $q.all([
                                // This allows the chunking flow.
                                drvDataPack.exportDataPack(packData),
                                remoteActions.deleteDataPack(newPackId)
                            ]).then(function() {
                                modalScope.dataToProcess.dataPackId = packToUpdate.Id;
                            }, function(error) {
                                modalScope.loading = false;
                                modalScope.error = error;
                            }).then(function(error)  {
                                return remoteActions.updateDataPackInfo(packData.dataPackId, {
                                    Name: modalScope.datapack.Name,
                                    Description: modalScope.datapack.Description
                                });
                            });
                        }
                    }
                    return remoteActions.updateDataPackInfo(packData.dataPackId, {
                            Name: modalScope.datapack.Name,
                            Description: modalScope.datapack.Description,
                            Version: modalScope.viewModel.createNewVersion ?
                                        modalScope.viewModel.newVersion :
                                        modalScope.viewModel.existingVersion,
                            Status: modalScope.viewModel.addToLibrary ? 'Saved' : 'Complete'
                        });
                }, function(error) {
                modalScope.loading = false;
                modalScope.error = error;
            }, function(progress) {
                modalScope.progress = progress;
            }).then(function() {
                return drvDataPack.exportDataPack(modalScope.dataToProcess);
            }).then(function(dataToProcess) {
                dataToProcess.name = modalScope.datapack.Name;
                dataToProcess.description = modalScope.datapack.Description;
                dataToProcess.version = (modalScope.viewModel.createNewVersion ?
                                    modalScope.viewModel.newVersion :
                                    modalScope.viewModel.existingVersion);
                dataToProcess.status = modalScope.viewModel.addToLibrary ? 'Saved' : 'Complete';
                if (modalScope.viewModel.Published) {
                    return remoteActions.publishDataPack(modalScope.dataToProcess.dataPackId, false)
                        .then(function() {
                            return dataToProcess;
                        });
                } else {
                    return remoteActions.updateDataPackInfo(modalScope.dataToProcess.dataPackId, {
                        Name: modalScope.datapack.Name,
                        Description: modalScope.datapack.Description,
                        Version: modalScope.viewModel.createNewVersion ?
                                    modalScope.viewModel.newVersion :
                                    modalScope.viewModel.existingVersion,
                        Status: modalScope.viewModel.addToLibrary ? 'Saved' : 'Complete'
                    });
                }
            }).then(function(dataToProcess) {
                if (modalScope.viewModel.download) {
                    return $scope.downloadPack({
                        Id: modalScope.dataToProcess.dataPackId,
                        Name: modalScope.datapack.Name,
                        Description: modalScope.datapack.Description,
                        Version: modalScope.viewModel.createNewVersion ?
                                    modalScope.viewModel.newVersion :
                                    modalScope.viewModel.existingVersion,
                        Status: modalScope.viewModel.addToLibrary ? 'Saved' : 'Complete'
                    }).then(function() {
                        if (!modalScope.viewModel.addToLibrary) {
                            return remoteActions.deleteDataPack(modalScope.dataToProcess.dataPackId);
                        } else {
                            return true;
                        }
                    });
                } else if (!modalScope.viewModel.addToLibrary) {
                    return remoteActions.deleteDataPack(modalScope.dataToProcess.dataPackId);
                } else {
                    return true;
                }
            }).then(function() {
                modalScope.loading = false;
                $scope.publishedTableParams.reload();
                $scope.selectedMultiPack = {};
                thisModal.hide();
            }, function (e) {
                // the below works around a bug in Safari where by we need to replay the XHR
                // due to the file download causing an error
                if (e && e.code === 'xhr') {
                    modalScope.loading = false;
                    $scope.publishedTableParams.reload();
                    thisModal.hide();
                } else {
                    throw e;
                }
            });
            return false;
        }

        $scope.updatePack = function(datapack) {
            var modalScope = drvImportScopeManager($scope);
            modalScope.fileNsPrefix = fileNsPrefix();
            modalScope.datapack = datapack;
            $rootScope.packsNeedingUpdate = packsNeedingUpdate[datapack.Name];
            modalScope.viewModel = {
                refresh: true,
                download: true,
                addToLibrary: true,
                createNewVersion: true,
                existingVersion: datapack.Version,
                Published: datapack.Published,
                newVersion: ((datapack.Version * 10) + 10) / 10
            };
            modalScope.$on('sldsModal.hide', function() {
                $rootScope.packsNeedingUpdate = null;
            });
            drvDataPack.getAllDataPackData(modalScope.datapack.Id)
                .then(function(dataPacks) {
                    modalScope.datapack.dataPacks = dataPacks.dataPacks;
                });
            modalScope.saveMultiPack = function() {
                modalScope.loading = true;
                if (modalScope.viewModel.createNewVersion) {
                    var packsToCombine = modalScope.datapack.dataPacks[0].VlocityDataPackData.VlocityDataPacksToCombine;
                    // need to figure out which pack with name has changed
                    packsToCombine = packsToCombine.map(function(packId) {
                        var existingPack = existingDataPacksById[packId];
                        var collectionOfPacks = existingDataPacks[existingPack.Name];
                        var published = collectionOfPacks.find(function(pack) {
                            return pack.Published;
                        });
                        if (published) {
                            return published.Id;
                        } else {
                            return packId;
                        }
                    });
                    // need to recombine packs
                    saveMultiPack(modalScope, packsToCombine, thisModal);
                    return false;
                } else {
                    // else refresh this version
                    drvDataPack.refreshDataPack(datapack)
                        .then(function(packData) {
                            modalScope.dataToProcess = packData;
                            return modalScope.dataToProcess;
                        }, function(error) {
                        modalScope.loading = false;
                        modalScope.error = error;
                    }, function(progress) {
                        modalScope.progress = progress;
                    }).then(function(dataToProcess) {
                        delete packsNeedingUpdate[modalScope.datapack.Name];
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
                        if (modalScope.viewModel.download) {
                            modalScope.downloadFile(modalScope.dataToProcess, (/\.json/.test(modalScope.datapack.Name) ?
                                                modalScope.datapack.Name : modalScope.datapack.Name + '.json'));
                        }
                        return $q.all([
                            remoteActions.deleteDataPack(modalScope.datapack.Id),
                            remoteActions.updateDataPackInfo(modalScope.dataToProcess.dataPackId, {
                                Name: modalScope.datapack.Name,
                                Description: modalScope.datapack.Description,
                                Version: modalScope.viewModel.createNewVersion ?
                                                modalScope.viewModel.newVersion :
                                                modalScope.viewModel.existingVersion
                            })]);
                    }).then(function() {
                        modalScope.loading = false;
                        $scope.publishedTableParams.reload();
                        thisModal.hide();
                    }, function (e) {
                        // the below works around a bug in Safari where by we need to replay the XHR
                        // due to the file download causing an error
                        if (e && e.code === 'xhr') {
                            modalScope.loading = false;
                            $scope.publishedTableParams.reload();
                            thisModal.hide();
                        } else {
                            throw e;
                        }
                    });
                    return false;
                }
            };
            var thisModal = $sldsModal({
                template: 'DataPackCreateMultiPack.tpl.html',
                backdrop: 'static',
                scope: modalScope,
                show: true
            });
        };
        $scope.loading = true;

        $scope.togglePublishedState = function(row, group) {
            var weArePublishing = !row.Published;
            row.updatingPublishing = true;
            remoteActions.publishDataPack(row.Id, row.Published)
                .then(function(updated) {
                    packsNeedingUpdate = {};
                    $timeout(function() {
                        delete row.updatingPublishing;
                        row.Published = weArePublishing;
                        if (weArePublishing) {
                            // unp
                            group.data.forEach(function(dataPack) {
                                if (dataPack.Published && dataPack.Id !== row.Id) {
                                    dataPack.Published = false;
                                }
                            });
                        }
                    });
                });
        };

        $scope.hasPublished = function(group) {
            return group.data.find(function(dataPack) {
                return dataPack.Published;
            });
        };

        $scope.publishedTableParams = {
            multiselect: true,
            groupBy: 'Name',
            columns: [{
                id: 'name-text',
                field: 'Name',
                title: 'Name',
                dynamic: 'row',
                sortable: 'Name',
                getValue: function(rowScope, row) {
                    return '<a ng-click="$root.showInfo(row)">' + _.escape(row.Name) + ' (Version ' + row.Version + ')</a>';
                },
                getGroupValue: function($scope, $group) {
                    return _.escape($group.data[0].Name);
                },
                getGroupSortValue: function($scope, $group) {
                    return _.escape($group.data[0].Name);
                },
                resizable: true
            }, {
                id: 'type-text',
                field: 'Type',
                title: 'Type',
                sortable: 'Type',
                getValue: function(rowScope, row) {
                    return row.types;
                },
                getGroupValue: function($scope, $group) {
                    return $group.data[0].types;
                },
                getGroupSortValue: function($scope, $group) {
                    return $group.data[0].types;
                },
                resizable: true
            }, {
                title: 'Last Modified Date',
                id: 'last-modifed-date',
                resizable: true,
                sortable: 'LastModifiedDate',
                width: 140,
                field: 'LastModifiedDate',
                getGroupValue: function($scope, $group) {
                    return $filter('date')($group.data[0].LastModifiedDate, 'short');
                },
                getGroupSortValue: function($scope, $group) {
                    return $group.data[0].LastModifiedDate;
                },
                getValue: function($scope, row) {
                    return $filter('date')(row.LastModifiedDate, 'short');
                }
            }, {
                title: 'Latest Version',
                id: 'latest-version',
                field: 'Version',
                getValue: function($scope, row) {
                    return 'Version ' + row.Version;
                },
                getGroupValue: function($scope, $group) {
                    var mostRecent = $group.data[0].Version;
                    $group.data.forEach(function(data) {
                        if (data.Version > mostRecent) {
                            mostRecent = data.Version;
                        }
                    });
                    return 'Version ' + mostRecent;
                },
                resizable: true
            }, {
                title: 'Published',
                shrink: true,
                dynamic: true,
                sortable: 'Published',
                getValue: function($scope, row) {
                    if (row.Published) {
                        return '<span class="slds-icon_container" title="Is Published"><slds-svg-icon ' +
                                'sprite="\'utility\'" icon="\'success\'" size="\'x-small\'"  extra-classes="\'slds-icon-text-default \'"></slds-svg-icon></span>';
                    }
                },
                getGroupValue: function($scope, $group) {
                    var hasAnActiveEntry = false;
                    $group.data.forEach(function(row) {
                        if (row.Published) {
                            hasAnActiveEntry = true;
                            return false;
                        }
                    });
                    if (hasAnActiveEntry) {
                        return '<span class="slds-icon_container" title="Is Published"><slds-svg-icon ' +
                                'sprite="\'utility\'" icon="\'success\'" size="\'x-small\'"  extra-classes="\'slds-icon-text-default \'"></slds-svg-icon></span>';
                    }
                },
                getGroupSortValue: function($scope, $group) {
                    var hasAnActiveEntry = false;
                    $group.data.forEach(function(row) {
                        if (row.Published) {
                            hasAnActiveEntry = true;
                            return false;
                        }
                    });
                    if (hasAnActiveEntry) {
                        return '<span class="slds-icon_container" title="Is Published"><slds-svg-icon ' +
                                'sprite="\'utility\'" icon="\'success\'" size="\'x-small\'"  extra-classes="\'slds-icon-text-default \'"></slds-svg-icon></span>';
                    }
                },
                resizable: false,
                width: 110
            }, {
                title: 'Updates',
                shrink: true,
                dynamic: true,
                sortable: true,
                getValue: function(_$scope, row) {
                    if ($scope.needsUpdateToChildren(row)) {
                        return '<span class="slds-icon_container" title="Has Updates"><slds-svg-icon ' +
                                'sprite="\'utility\'" icon="\'refresh\'" size="\'x-small\'"  extra-classes="\'slds-icon-text-default \'"></slds-svg-icon></span>';
                    }
                },
                getGroupValue: function(_$scope, $group) {
                    if ($scope.hasChildWhichNeedsUpdate($group.value)) {
                        return '<span class="slds-icon_container" title="Has Updates"><slds-svg-icon ' +
                                'sprite="\'utility\'" icon="\'refresh\'" size="\'x-small\'"  extra-classes="\'slds-icon-text-default \'"></slds-svg-icon></span>';
                    }
                },
                getGroupSortValue: function(_$scope, $group) {
                    if ($scope.hasChildWhichNeedsUpdate($group.value)) {
                        return '<span class="slds-icon_container" title="Has Updates"><slds-svg-icon ' +
                                'sprite="\'utility\'" icon="\'refresh\'" size="\'x-small\'"  extra-classes="\'slds-icon-text-default \'"></slds-svg-icon></span>';
                    }
                },
                resizable: false,
                width: 110
            }],
            actions:[{
                text: 'Download',
                icon: {
                    sprite: 'utility',
                    icon: 'download'
                },
                click: function(row, group) {
                    $scope.downloadPack(row);
                }
            }, {
                type: 'delete',
                promptTitle: 'Delete Data Pack?',
                promptContent: function(row) {
                    return 'Are you sure you want to delete this Data Pack?<br/> <br/>"' +
                    _.escape(row.Name) + ' (Version ' + row.Version + ')" ';
                }
            }, {
                text: 'Publish',
                icon: {
                    $$hashKey: 'upload-utility',
                    sprite: 'utility',
                    icon: 'upload'
                },
                click: function(row, group) {
                    $scope.togglePublishedState(row, group);
                },
                hide: function(row, group) {
                    return row.Published;
                }
            }, {
                text: 'Unpublish',
                icon: {
                    $$hashKey: 'close-utility',
                    sprite: 'utility',
                    icon: 'close'
                },
                click: function(row, group) {
                    $scope.togglePublishedState(row, group);
                },
                hide: function(row, group) {
                    return !row.Published;
                }
            }, {
                hide: function(row, group) {
                    return !$scope.needsUpdateToChildren(row);
                },
                text: 'Update',
                icon: {
                    sprite: 'utility',
                    icon: 'refresh'
                },
                click: function(row, group) {
                    $scope.updatePack(row);
                }
            }],
            data: function(offset, limit, tableParams) {
                $scope.loading = true;
                return $scope.getDataPacks('Export', tableParams);
            },
            sorting: {
                'Name': 'asc'
            }
        };

        $scope.$on('reload', function(event, args) {
            packsNeedingUpdate = {};
            if (args && args.delete) {
                existingDataPacks[args.name] = args.group.data = args.group.data.filter(function(row) {
                    return row.Id !== args.packId;
                });
                if (args.group.data.length === 0) {
                    var index = args.$groups.findIndex(function(group) {
                        return group.value === args.group.value;
                    });
                    args.$groups.splice(index, 1);
                }
            } else {
                $scope.publishedTableParams.reload();
            }
        });

        var existingDataPacks = {};
        var existingDataPacksById = {};
        var packsNeedingUpdate = {};

        $scope.hasChildWhichNeedsUpdate = function(name) {
            return !!packsNeedingUpdate[name];
        };

        $scope.needsUpdateToChildren = function(datapack) {
            if (datapack.Type === 'MultiPack' && datapack.Published) {
                var needsUpdate = false;
                datapack.DataPacks.forEach(function(child) {
                    if (child.VlocityDataPackData && child.VlocityDataPackType === 'MultiPack') {
                        var combined = child.VlocityDataPackData.VlocityCombinedDataPackEntries;
                        if (combined) {
                            combined.forEach(function(child) {
                                if (existingDataPacks[child.Name]) {
                                    var publishedPack = existingDataPacks[child.Name].find(function(child) {
                                        return child.Published;
                                    });
                                    if (!child.Version) {
                                        child.Version = 1.0;
                                    }
                                    if (publishedPack && publishedPack.Version !== child.Version) {
                                        needsUpdate = {
                                            ToUpdate: publishedPack.Name,
                                            CurrentVersion: child.Version ,
                                            NewVersion: publishedPack.Version
                                        };
                                        return false;
                                    }
                                }
                            });
                        }
                    }
                    if (needsUpdate) {
                        return false;
                    }
                });
                var existing = packsNeedingUpdate[datapack.Name];
                if (needsUpdate &&
                        (!existing ||
                            (existing.ToUpdate !== needsUpdate.ToUpdate ||
                                existing.NewVersion !== needsUpdate.NewVersion))
                    ) {
                    packsNeedingUpdate[datapack.Name] = needsUpdate;
                }
                return !!needsUpdate;
            } else {
                return false;
            }
        };

        $scope.getTooltipUpdateMessage = function(datapack) {
            var data = packsNeedingUpdate[datapack.Name];
            return 'Child Pack ' + _.escape(data.ToUpdate) + ' has new published version ' + data.NewVersion +
                    ' (current version in pack is ' + (data.CurrentVersion ? data.CurrentVersion : 'unset')  +
                            '). Click to Update MultiPack';
        };

        $scope.latestPublishedVersion = function(rows) {
            var version = 0;
            rows.forEach(function(row) {
                if (row.Published) {
                    version = row.Version;
                    return false;
                } else {
                    if (row.Version > version) {
                        version = row.Version;
                    }
                }
            });
            return version;
        };

        $scope.getDataPacks = function(type, tableParams) {
            return remoteActions.getPublishedTabDataPacks().then(function(results) {
                existingDataPacks = {};
                packsNeedingUpdate = {};
                existingDataPacksById = {};
                var orderedData = results.filter(function(datapack) {
                    // DR-402 - exclude V11 DataPacks
                    if (datapack.Id.substr(0, datapack.Name.length) === datapack.Name) {
                        return false;
                    }
                    var isCorrectType = (datapack.Type === type ||
                                            (type === 'Export' && datapack.Type === 'MultiPack'));
                    var isPublishedOrSaved = /(Saved|Published)/.test(datapack.Status);
                    if (!existingDataPacks[datapack.Name]) {
                        existingDataPacks[datapack.Name] = [];
                    }
                    existingDataPacksById[datapack.Id] = datapack;
                    datapack[fileNsPrefix() + 'Version__c'] = datapack.Version =
                                                                datapack.Version == null ? 1 : +datapack.Version;
                    datapack.Description = $rootScope.unescapeHtml(datapack.Description);
                    if (isCorrectType && isPublishedOrSaved) {
                        datapack.types = datapack.PrimaryDataPackType ? datapack.PrimaryDataPackType : (datapack.DataPacks && datapack.DataPacks.length > 0 ? datapack.DataPacks[0].VlocityDataPackLabel : '');
                        datapack.Published = datapack.Status === 'Published';
                        if (!datapack.Source) {
                            datapack.Source = 'From File';
                        }
                        existingDataPacks[datapack.Name].push(datapack);
                        return true;
                    } else {
                        return false;
                    }
                });
                tableParams.count(orderedData.length);
                $scope.loading = false;
                return orderedData;
            }, function (e) {
                // the below works around a bug in Safari where by we need to replay the XHR
                // due to the file download causing an error
                if (e && e.code === 'xhr') {
                    $scope.getDataPacks(type, tableParams);
                }
                throw e;
            });
        };

    });

},{}],5:[function(require,module,exports){
angular.module('datapackshome')
    .filter('onlyActive', function() {
        'use strict';
        return function(orgs) {
            return orgs.filter(function(org) {
                return org.local || org[fileNsPrefix() + 'Active__c'];
            });
        }
    });

},{}],6:[function(require,module,exports){
angular.module("datapackshome").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("DataPackCreateMultiPack.tpl.html",'<div id="datapack-multipack-modal" class="slds-modal slds-fade-in-open">\n  <style>\n    .slds-modal .vlc-framed {\n      border: 1px solid #d8dde6;\n      min-height: 465px;\n      max-height: 465px;\n    }\n  </style>\n  <div class="slds-modal__container">\n    <div class="slds-modal__header">\n      <h4 class="slds-text-heading--medium" ng-if="stage != 2 && !viewModel.refresh" id="datapack-multipack-modal-title">{{ ::\'CreateMultiPack\'| localize:\'Create MultiPack\' }}</h4>\n      <h4 class="slds-text-heading--medium" ng-if="stage != 2 && viewModel.refresh" id="datapack-multipack-modal-title">{{ ::\'Dev2ProdRefreshMultiPackModalTitle\'| localize:\'Refresh MultiPack\' }}</h4>\n    </div>\n    <div class="slds-modal__content slds-p-around--x-large">\n      <div ng-if="stage == 1 && !loading" class="content">\n        <form class="slds-grid slds-wrap slds-grid--pull-padded">\n          <div class="slds-col--padded slds-size--1-of-2">\n            <div class="slds-form-element">\n              <label class="slds-form-element__label">{{ ::\'Name\'| localize:\'Name\' }}</label>\n              <div class="slds-form-element__control">\n                <input class="slds-input" type="text" ng-model="datapack.Name" placeholder="{{ ::\'Dev2ProdName\'| localize:\'e.g. Pack Name\'}}" id="datapack-multipack-modal-name-input" />\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-2">\n            <div class="slds-form-element">\n              <span class="slds-form-element__label">{{ ::\'Type\'| localize:\'Type\' }}</span>\n              <div class="slds-form-element__control slds-has-divider--bottom">\n                <span class="slds-form-element__static" id="datapack-multipack-modal-types-text">{{datapack.types}}</span>\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-1">\n            <div class="slds-form-element">\n              <label class="slds-form-element__label">{{ ::\'Description\'| localize:\'Description\' }}</label>\n              <div class="slds-form-element__control">\n                <textarea class="slds-textarea" type="text" ng-model="datapack.Description"\n                        id="datapack-multipack-modal-description-textarea"></textarea>\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-2">\n            <div class="slds-form-element">\n              <div class="slds-form-element__control">\n                <label class="slds-checkbox">\n                  <input type="checkbox" ng-model="viewModel.addToLibrary" ng-disabled="viewModel.refresh" \n                        id="datapack-multipack-modal-add-to-library-checkbox"/>\n                  <span class="slds-checkbox--faux"></span>\n                  <span class="slds-form-element__label">{{ ::\'AddToLibrary\' | localize:\'Add To Library\'}}</span>\n                </label>\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-2">\n            <div class="slds-form-element">\n              <div class="slds-form-element__control">\n                <label class="slds-checkbox">\n                  <input type="checkbox" ng-model="viewModel.Published" ng-disabled="!viewModel.addToLibrary" \n                          id="datapack-multipack-modal-published-checkbox"/>\n                  <span class="slds-checkbox--faux"></span>\n                  <span class="slds-form-element__label">{{ ::\'Published\' | localize:\'Published\'}}</span>\n                </label>\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-2">\n            <div class="slds-form-element__control slds-m-top--small">\n              <label class="slds-radio">\n                <input type="radio" ng-model="viewModel.createNewVersion" ng-value="true" ng-disabled="!viewModel.addToLibrary" id="datapack-multipack-modal-create-new-version-true-radio"/>\n                <span class="slds-radio--faux"></span>\n                <span class="slds-form-element__label">{{ ::\'CreateNewVersion\' | localize:\'Create New Version\' }}</span>\n              </label>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-form--inline slds-size--1-of-2">\n             <div class="slds-form-element slds-m-top--x-small">\n              <label class="slds-form-element__label">{{ ::\'Version\' | localize:\'Version\' }}</label>\n              <div class="slds-form-element__control">\n                <input class="slds-input slds-input--small" type="number" step="0.1" ng-model="viewModel.newVersion" ng-disabled="!viewModel.addToLibrary" min="{{viewModel.existingVersion + 0.1}}" \n                id="datapack-multipack-modal-new-version-input">\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-2" ng-if="viewModel.existingVersion > 0" >\n            <div class="slds-form-element__control slds-m-top--small">\n              <label class="slds-radio">\n                <input type="radio" ng-model="viewModel.createNewVersion" ng-value="false" ng-disabled="!viewModel.addToLibrary" id="datapack-multipack-modal-create-new-version-false-radio"/>\n                <span class="slds-radio--faux"></span>\n                <span class="slds-form-element__label">{{ ::\'UpdateExistingVersion\' | localize:\'Update Existing Version\' }}</span>\n              </label>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-form--inline slds-size--1-of-2" ng-if="viewModel.existingVersion > 0">\n             <div class="slds-form-element slds-m-top--x-small">\n              <label class="slds-form-element__label">{{ ::\'Version\' | localize:\'Version\' }}</label>\n              <div class="slds-form-element__control">\n                <input class="slds-input slds-input--small" type="number" step="0.1" ng-model="viewModel.existingVersion" disabled="disabled" min="1" id="datapack-multipack-modal-existing-version-input">\n              </div>\n            </div>\n          </div>\n          <div class="slds-col--padded slds-size--1-of-1 slds-m-top--x-small">\n            <div class="slds-form-element">\n              <div class="slds-form-element__control">\n                <label class="slds-checkbox">\n                  <input type="checkbox" ng-model="viewModel.download" id="datapack-multipack-modal-download-checkbox"/>\n                  <span class="slds-checkbox--faux"></span>\n                  <span class="slds-form-element__label">{{ ::\'Download\' | localize:\'Download\'}}</span>\n                </label>\n              </div>\n            </div>\n          </div>\n        </form>\n        <div class="slds-m-top--medium vlc-framed slds-scrollable--y" ng-if="datapack.dataPacks && datapack.dataPacks.length > 0">\n          <ul class="slds-tree" role="tree" id="datapack-multipack-modal-datapack-tree">\n            <li role="treeitem" aria-level="1" ng-repeat="data in ::datapack | groupByType track by $index" id="datapack-multipack-modal-tree-item-{{$index}}">\n              <div class="slds-tree__item" ng-click="hideChildren[data.$type] = (!hideChildren[data.$type] && !isLocked)"\n                    id="datapack-multipack-modal-tree-item-{{$index}}-toggle-button">\n                <button class="slds-button slds-button--icon-bare slds-m-right--x-small">\n                  <slds-button-svg-icon icon="\'chevronright\'" sprite="\'utility\'" size="\'small\'" ng-if="hideChildren[data.$type]"></slds-button-svg-icon>\n                  <slds-button-svg-icon icon="\'chevrondown\'" sprite="\'utility\'" size="\'small\'" ng-if="!hideChildren[data.$type]"></slds-button-svg-icon>\n                  <span class="slds-assistive-text">Toggle</span>\n                </button>\n                <a role="presentation" class="slds-truncate" id="datapack-multipack-modal-tree-item-{{$index}}-summary-text">\n                  {{ data.$type | readableDataPackTypeName }} ({{selectedChildCount(data.$records)}})\n                </a>\n              </div>\n              <drv-comptree object-data="value.VlocityDataPackData"\n                            record-status="value.VlocityDataPackRecords"\n                            ng-repeat="value in ::data.$records track by $index"\n                            is-editable="false"\n                            showStatus="false"\n                            hide-label="true"\n                            depth="1"\n                            ng-show="!hideChildren[data.$type]"\n                            is-locked="false">\n              </drv-comptree>\n            </li>\n          </ul>\n        </div>\n      </div>\n\n      <div style="min-height: 200px; position: relative;" ng-if="loading">\n        <div class="slds-spinner--brand slds-spinner slds-spinner--large slds-m-top--medium slds-m-bottom--medium" aria-hidden="false" role="alert">\n          <div class="slds-spinner__dot-a"></div>\n          <div class="slds-spinner__dot-b"></div>\n        </div>\n        <h2  class="slds-text-align--center slds-text-heading--medium slds-m-top--large" ng-if="(progress.Finished || progress.Total)">{{ ::\'CreatingMultiPack\'| localize:\'Creating MultiPack\' }} {{progress.Finished}} {{ ::\'Of\'|localize:\'Of\'}} {{progress.Total}}</h2>\n      </div>\n    </div>\n    <div class="slds-modal__footer">\n      <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()" id="datapack-multipack-modal-cancel-button">\n          {{ ::\'Cancel\' | localize: \'Cancel\' }}\n      </button>\n      <button type="button" class="slds-button slds-button--brand" ng-click="saveMultiPack();" ng-disabled="loading"\n              id="datapack-multipack-modal-done-button">\n'+"            {{ ::'Done' | localize: 'Done' }}\n      </button>\n    </div>\n  </div>\n</div>"),$templateCache.put("PublishedTable.tpl.html",'<div id="datapack-published-tab" ng-controller="publishedController">\n  <div id="create-multipack-tab-button-wrapper">\n      <button drv-export="row.Id"\n              drv-data-pack-type="MultiPack"\n              drv-suggested-name="MultiPack"\n              drv-selected="selectedMultiPack"\n              drv-custom-save="saveNewMultiPack(modalScope, dataToProcess, modal)"\n              id="datapack-create-multipack-button"\n              ng-if="tabs.activeTab === 0" ng-disabled="!hasSelectionsForMultiPack()"\n              class="slds-button--brand slds-button">{{ ::\'CreateMultiPack\' | localize:\'Create MultiPack\' }}</button>\n  </div>\n  <slds-grouped-table\n        slds-grouped-table-params="publishedTableParams"\n        id-prefix="datapack-published"\n        on-selected="onSelected(row, group)"\n        on-before-select-all="onBeforeSelectAll()"></slds-grouped-table>\n</div>'),$templateCache.put("DataPackOrgManagementModal.tpl.html",'<div id="datapack-import-modal" class="slds-modal slds-fade-in-open">\n  <div class="slds-modal__container">\n    <div class="slds-modal__header">\n      <h4 class="slds-text-heading--medium" ng-if="stage != 2" id="datapack-import-modal-title">{{ ::\'ManageOrgConnections\'| localize:\'Manage Org Connections\' }}</h4>\n    </div>\n    <div class="slds-modal__content">\n      <table class="slds-table .slds-table--fixed-layout slds-table--bordered">\n        <thead>\n          <th class="slds-cell-shrink">{{::\'Active\' | localize: \'Active\'}}</th>\n          <th>{{::\'NamedCredential\' | localize: \'Named Credential\'}}</th>\n          <th class="slds-cell-shrink"></th>\n        </thead>\n        <tr ng-repeat="org in orgs | orderBy:\'Name\'" id="datapack-import-modal-org-{{$index}}">\n          <td>\n            <div class="slds-form-element">\n              <div class="slds-form-element__control">\n                <label class="slds-checkbox">\n                  <input type="checkbox" ng-model="org[fileNsPrefix+\'Active__c\']" ng-change="stopEditOrg(org, true)" ng-disabled="loading || isChecking()"\n                      id="datapack-import-modal-org-{{$index}}-active-checkbox" />\n                  <span class="slds-checkbox--faux"></span>\n                </label>\n              </div>\n            </div>\n          </td>\n          <td style="padding: 3px 8px">\n            <div class="slds-form-element">\n              <div class="slds-form-element__control slds-input-has-icon slds-input-has-icon--right" ng-class="{\'slds-has-divider--bottom\': !org.edit}">\n                <slds-input-svg-icon icon="\'edit\'" sprite="\'utility\'" extra-classes="\'slds-icon-text-default\'" ng-if="!org.edit && !isChecking(org) && !hasConnectionIssue(org)" ng-click="editOrg(org)"\n                  id="datapack-import-modal-org-{{$index}}-edit-button"></slds-input-svg-icon>\n\n                <slds-input-svg-icon icon="\'check\'" sprite="\'utility\'" extra-classes="\'slds-icon-text-default\'" ng-if="org.edit && !isChecking(org)" ng-click="stopEditOrg(org)" id="datapack-import-modal-org-{{$index}}-stop-edit-button"></slds-input-svg-icon>\n\n                <slds-input-svg-icon icon="\'spinner\'" sprite="\'utility\'" extra-classes="\'slds-icon-text-default\'" ng-if="isChecking(org)"></slds-input-svg-icon>\n\n                <div slds-popover\n                  data-container=".slds-modal"\n                  nubbin-direction="bottom-right"\n                  tooltip="true"\n                  data-title="{{getTooltipErrorMessage(org)}}"\n                   ng-if="!isChecking(org) && hasConnectionIssue(org) && !org.edit" ng-click="editOrg(org)"\n                  id="datapack-import-modal-org-{{$index}}-has-connection-issue-button">\n                  <slds-input-svg-icon icon="\'warning\'" sprite="\'utility\'" extra-classes="\'slds-icon-text-default\'"></slds-input-svg-icon>\n                </div>\n                  \n                <input class="slds-input slds-input--small" type="text"\n                       ng-model="org._Name" ng-if="org.edit" ng-blur="stopEditOrg(org)"\n                       id="datapack-import-modal-org-{{$index}}-name-input">\n                <span class="slds-form-element__static slds-input--small"  ng-if="!org.edit"\n                      id="datapack-import-modal-org-{{$index}}-name-text">{{org.Name}}</span>\n              </div>\n            </div>\n          </td>\n          <td>\n            <button class="slds-button slds-button--icon" ng-click="deleteOrg(org)" ng-disabled="org.deleting" id="datapack-import-modal-org-{{$index}}-delete-button">\n              <slds-button-svg-icon icon="\'delete\'" sprite="\'utility\'" ng-if="!org.deleting"></slds-button-svg-icon>\n              <slds-button-svg-icon icon="\'spinner\'" sprite="\'utility\'" ng-if="org.deleting"></slds-button-svg-icon>\n              <span class="slds-assistive-text">Delete</span>\n            </button>\n          </td>\n        </tr>\n        <tr>\n          <td colspan="3">\n            <button type="button" class="slds-button slds-button--brand" ng-click="addAnOrg()"  id="datapack-import-modal-add-org-button">+ Add An Org</button>\n          </td>\n        </tr>\n      </table>\n    </div>\n    <div class="slds-modal__footer">\n      <button type="button" class="slds-button slds-button--brand" ng-click="done();" ng-disabled="loading || isChecking()"\n        id="datapack-import-modal-done-button">{{ ::\'Done\' | localize: \'Done\' }}</button>\n    </div>\n  </div>\n</div>'),$templateCache.put("InstalledTable.tpl.html",'<div id="datapack-installed-tab" ng-controller="installedController">\n  <div id="datapack-installed-tab-wrapper">\n    <div class="slds-picklist slds-dropdown-trigger--click" aria-expanded="true" ng-if="tabs.activeTab === 1" ng-class="{\'slds-is-open\': viewModel.showDropdown}" id="datapack-import-from-dropdown">\n      <button class="slds-button slds-button--neutral slds-picklist__label" aria-haspopup="true" ng-click="viewModel.showDropdown = !viewModel.showDropdown" id="datapack-import-from-button" >\n        <span class="slds-truncate">{{::\'ImportFrom\' | localize:\'Import From\'}}</span>\n        <slds-svg-icon sprite="\'utility\'" icon="\'down\'" ></slds-svg-icon>\n      </button>\n      <div class="slds-dropdown slds-dropdown--left slds-dropdown--menu">\n        <ul class="slds-dropdown__list slds-dropdown--length-5" role="menu" ng-click="viewModel.showDropdown = false">\n          <li class="slds-dropdown__item">\n            <a drv-import on-import-complete="installedTableParams.reload()" role="menuitemradio" \n                id="datapack-import-from-file-button">\n              <p class="slds-truncate">{{::\'FromFile\' |  localize:\'From File\'}}</p>\n            </a>\n          </li>\n          <li class="slds-dropdown__item" ng-repeat="org in orgs | onlyActive | orderBy:\'Name\'">\n            <a role="menuitemradio" drv-import on-import-complete="installedTableParams.reload()" mode="\'org\'" org="org.Name"\n              id="datapack-import-from-{{$index}}-button">\n              <p class="slds-truncate">{{org.Name}}</p>\n              <button class="slds-button slds-button--icon"\n                  ng-if="isChecking(org.Name)">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'spinner\'" ></slds-button-svg-icon>\n              </button>\n              <button class="slds-button slds-button--icon"\n                  ng-show="hasConnectionIssue(org.Name)">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'warning\'" ></slds-button-svg-icon>\n              </button>\n            </a>\n          </li>\n          <li class="slds-dropdown__item slds-has-divider--top-space">\n            <a ng-click="showManageOrgConnectionsModal()" role="menuitemradio" id="datapack-manage-org-connections-button">\n              <p class="slds-truncate">{{::\'ManageOrgConnections\' |  localize:\'Manage Org Connections\'}}</p>\n            </a>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </div>\n  <slds-grouped-table\n        slds-grouped-table-params="installedTableParams"\n        id-prefix="datapack-installed"></slds-grouped-table>\n</div>'),$templateCache.put("DataPackInfoModal.tpl.html",'<div id="datapack-info-modal"class="slds-modal slds-fade-in-open">\n  <style>\n    .slds-modal .vlc-framed {\n      border: 1px solid #d8dde6;\n      min-height: 465px;\n      max-height: 465px;\n    }\n  </style>\n  <div class="slds-modal__container">\n    <div class="slds-modal__header">\n      <h4 class="slds-text-heading--medium" ng-if="stage != 2 && !remote" id="datapack-info-modal-title">{{ ::\'DataPackDetailsHeader\'| localize:\'Pack Details\' }}</h4>\n      <h4 class="slds-text-heading--medium" ng-if="stage != 2 && remote" id="datapack-info-modal-title">{{ ::\'RemoteDataPackDetailsHeader\'| localize:\'Remote  Pack Details\' }}</h4>\n    </div>\n    <div class="slds-modal__content slds-p-around--x-large">\n      <div ng-include src="\'DataPackEditForm.tpl.html\'"></div>\n      <div class="slds-m-top--medium slds-grid slds-wrap slds-grid--pull-padded">\n        <div class="slds-col--padded slds-size--1-of-1">\n          <div class="slds-text-body--regular" id="datapack-info-modal-created-text">{{ ::\'Created\'| localize:\'Created\' }} {{::\'On\' | localize:\'On\'}} {{ datapack.CreatedDate | date:\'mediumDate\'  }} {{ datapack.CreatedDate | date:\'shortTime\' }} {{::\'By\' | localize:\'By\'}} {{ datapack.CreatedBy }}</div>\n        </div>\n        <div class="slds-m-top--medium slds-col--padded slds-size--1-of-1">\n          <div class="slds-text-body--regular" id="datapack-info-modal-last-modified-text">{{ ::\'LastModified\'| localize:\'Last Modified\' }} {{::\'On\' | localize:\'On\'}} {{ datapack.LastModifiedDate | date:\'mediumDate\' }} {{ datapack.LastModifiedDate | date:\'shortTime\' }} {{::\'By\' | localize:\'By\'}} {{ datapack.LastModifiedBy.Name ? datapack.LastModifiedBy.Name : datapack.LastModifiedBy }}</div>\n        </div>\n      </div>\n      <div class="slds-m-top--medium vlc-framed slds-scrollable--y">\n        <ul class="slds-tree" role="tree" ng-if="!loading" id="datapack-info-modal-datapack-tree">\n          <li role="treeitem" aria-level="1" ng-repeat="data in ::datapack | groupByType track by $index" id="datapack-multipack-modal-tree-item-{{$index}}">\n            <div class="slds-tree__item" ng-click="hideChildren[data.$type] = (!hideChildren[data.$type] && !isLocked)"\n                id="datapack-info-modal-tree-item-{{$index}}-toggle-button">\n              <button class="slds-button slds-button--icon-bare slds-m-right--x-small">\n                <slds-button-svg-icon icon="\'chevronright\'" sprite="\'utility\'" size="\'small\'" ng-if="hideChildren[data.$type]"></slds-button-svg-icon>\n                <slds-button-svg-icon icon="\'chevrondown\'" sprite="\'utility\'" size="\'small\'" ng-if="!hideChildren[data.$type]"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Toggle</span>\n              </button>\n              <a role="presentation" class="slds-truncate" id="datapack-info-modal-tree-item-{{$index}}-summary-text">\n                {{  data.$label | readableDataPackTypeName }} ({{selectedChildCount(data.$records)}})\n              </a>\n            </div>\n            <drv-comptree object-data="value.VlocityDataPackData"\n                          record-status="value.VlocityDataPackRecords"\n                          ng-repeat="value in ::data.$records track by $index"\n                          is-editable="false"\n                          showStatus="false"\n                          hide-label="true"\n                          depth="1"\n                          ng-show="!hideChildren[data.$type]"\n                          is-locked="false">\n            </drv-comptree>\n          </li>\n        </ul>\n        <div style="min-height: 465px; position: relative;" ng-if="loading">\n          <div class="slds-spinner--brand slds-spinner slds-spinner--large slds-m-top--medium slds-m-bottom--medium" aria-hidden="false" role="alert">\n            <div class="slds-spinner__dot-a"></div>\n            <div class="slds-spinner__dot-b"></div>\n          </div>\n          <h2  class="slds-text-align--center slds-text-heading--medium slds-m-top--large" ng-if="(progress.Finished || progress.Total)">{{ ::\'CreatingMultiPack\'| localize:\'Creating MultiPack\' }} {{progress.Finished}} {{ ::\'Of\'|localize:\'Of\'}} {{progress.Total}}</h2>\n        </div>\n      </div>\n    </div>\n    <div class="slds-modal__footer">\n      <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()" ng-if="!remote" id="datapack-info-modal-cancel-button">{{ ::\'Cancel\' | localize: \'Cancel\' }}</button>\n      <button type="button" class="slds-button slds-button--brand" ng-click="save();" ng-disabled="loading" ng-if="!remote" id="datapack-info-modal-save-button">{{ ::\'Save\' | localize: \'Save\' }}</button>\n      <button type="button" class="slds-button slds-button--brand" ng-click="$hide();" ng-if="remote" id="datapack-info-modal-done-button">{{ ::\'Done\' | localize: \'Done\' }}</button>\n    </div>\n  </div>\n</div>')}]);

},{}],7:[function(require,module,exports){
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        'use strict';
        /* jshint eqnull:true */
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

},{}],8:[function(require,module,exports){
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
        'use strict';
        /* jshint eqnull:true */
        if (this == null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}

},{}]},{},[1]);
})();

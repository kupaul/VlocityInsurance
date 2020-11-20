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
angular.module('cardhome', ['cardutil', 'sldsangular', 'drvcomp', 'ngTable', 'vlocity', 'infinite-scroll'])
	.config(['$localizableProvider', function($localizableProvider) {
      'use strict';
      $localizableProvider.setLocalizedMap(window.i18n);
      $localizableProvider.setDebugMode(false);
  }]);

require('./modules/cardhome/controller/CardHome.js');
require('./modules/cardhome/config/Config.js');
require('./modules/cardhome/factory/Save.js');
require('./modules/cardhome/templates/templates.js');

},{"./modules/cardhome/config/Config.js":2,"./modules/cardhome/controller/CardHome.js":3,"./modules/cardhome/factory/Save.js":4,"./modules/cardhome/templates/templates.js":5}],2:[function(require,module,exports){
/*global fileNsPrefixDot*/
angular.module('cardhome')
    .config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        var actions = ['saveLayout', 'getLayout', 'isInsidePckg', 'setLayoutStatus', 'getCustomSettings', 'isAllTriggersOn', 'setAllTriggers', 'getLWCBundles', 'updateLWCResources', 'createLWCBundle', 'createLWCResources', 'getAllLWC', 'deleteComponent','getLayoutsById','clearAllCache'];
        var config = actions.reduce(function(config, action) {
            config[action] = {
                action: fileNsPrefixDot() + 'CardCanvasController.' + action,
                config: {escape: false}
            };
            return config;
        }, {});
        remoteActionsProvider.setRemoteActions(config);
    }]);
},{}],3:[function(require,module,exports){
angular.module('cardhome')
.controller('cardhome', ['$scope', '$rootScope', '$drvExport', '$sldsPrompt',
                            'remoteActions', '$filter',  '$drvImport', '$localizable', '$sldsModal', 'save', '$window', '$q', '$timeout', '$compile', 'LightningWebCompFactory','$sldsToast',
    function($scope, $rootScope, $drvExport, $sldsPrompt, remoteActions, $filter, $drvImport, $localizable, $sldsModal, save, $window, $q, $timeout, $compile, LightningWebCompFactory, $sldsToast) {

        'use strict';
        var DEFAULT_AUTHOR = 'vlocity';
        var DEFAULT_AUTHOR_SUFFIX = 'Dev';
        $rootScope.nsPrefix = fileNsPrefix();
        var DEFAULT_AUTHOR = 'vlocity';
        var DEFAULT_AUTHOR_SUFFIX = 'Dev';
        $scope.defaultColumns = [{
            field: 'Name',
            width: 300,
            additionalFields: [fileNsPrefix() + 'Version__c'],
            getGroupValue: function($scope, $group) {
                return '<span>' + _.escape($group.data[0].Name) + '</span>';
            },
            getValue: function($scope, row) {
                var url = window.cardsNewUrl + '?id=' + row.Id;
                return '<a href="' + url + '" ng-mouseup="$root.vlocityOpenUrl(\'' +
                url  + '\', $event)">' + _.escape(row.Name) + ' (Version ' +
                                row[fileNsPrefix() + 'Version__c'] + ')</a>';
            },
            dynamic: true,
            resizable: true
        }, {
            field: fileNsPrefix() + 'Type__c',
            resizable: true
        }, {
            field: fileNsPrefix() + 'Definition__c',
            shrink: true,
            dynamic: true,
            title: 'LWC Enabled',
            resizable: true,
            getGroupValue: function ($scope, $group) {
                return;
            },
            getValue: function ($scope, row) {
                let def = JSON.parse(row[fileNsPrefix() + 'Definition__c']);
                if (def && def.enableLwc)
                return '<span class="slds-icon_container" title="LWC Enabled"><slds-svg-icon sprite="\'utility\'"' +
                ' icon="\'success\'" size="\'x-small\'" extra-classes="\'slds-icon-text-default \'"></slds-svg-icon></span>';
            }
        }, {
            field: fileNsPrefix() + 'Author__c',
            width: 140,
            resizable: true,
            getGroupValue: function($scope, $group) {
                return;
            },
            getValue: function($scope, row) {
                return _.escape(row[fileNsPrefix() + 'Author__c']);
            }
        }, {
            resizable: true,
            field: 'LastModifiedDate',
            getGroupValue: function($scope, $group) {
                return $filter('date')($group.data[0].LastModifiedDate, 'short');
            },
            getValue: function($scope, row) {
                return $filter('date')(row.LastModifiedDate, 'short');
            }
        }, {
            resizable: true,
            field: 'LastModifiedById',
            getGroupValue: function($scope, $group) {
                return $group.data[0].LastModifiedBy ? _.escape($group.data[0].LastModifiedBy.Name) : '';
            },
            getValue: function($scope, row) {
                return row.LastModifiedBy ? _.escape(row.LastModifiedBy.Name) : '';
            }
        }, {
            field: fileNsPrefix() + 'Active__c',
            shrink: true,
            dynamic: true,
            getGroupSortValue: function($scope, $group) {
                var hasAnActiveEntry = false;
                _.forEach($group.data, function(row) {
                    if (row[fileNsPrefix() + 'Active__c']) {
                        hasAnActiveEntry = true;
                        return false;
                    }
                });
                return hasAnActiveEntry
            },
            getValue: function($scope, row) {
                if (row[fileNsPrefix() + 'Active__c']) {
                    return '<span class="slds-icon_container" title="Is Active"><slds-svg-icon sprite="\'utility\'"' +
                            ' icon="\'success\'" size="\'x-small\'" extra-classes="\'slds-icon-text-default \'"></slds-svg-icon></span>';
                }
            },
            getGroupValue: function($scope, $group) {
                var hasAnActiveEntry = false;
                _.forEach($group.data, function(row) {
                    if (row[fileNsPrefix() + 'Active__c']) {
                        hasAnActiveEntry = true;
                        return false;
                    }
                });
                if (hasAnActiveEntry) {
                    return '<span class="slds-icon_container" title="Is Active"><slds-svg-icon sprite="\'utility\'"' +
                            ' icon="\'success\'" size="\'x-small\'" extra-classes="\'slds-icon-text-default \'"></slds-svg-icon></span>';
                }
            },
            resizable: true,
            width: 110
        }];
        //Row actions
        $rootScope.vlocity.getCustomLabels('DeleteLayout', 'Preview')
            .then(function(labels) {
                $scope.rowActions = [{
                    type: 'export',
                    drvType: 'VlocityUILayout'
                }, {
                    type: 'delete',
                    promptTitle: labels[0],
                    promptContent: function(row) {
                        return $localizable('DeleteLayoutConfirmation', 'Are you sure you want to delete this Layout?<br/> <br/>"{1} (Version {2})" ', _.escape(row.Name), row[fileNsPrefix() + 'Version__c']);
                    },
                    hide: function(row, group) {
                        return row[fileNsPrefix() + 'Active__c'];
                    },
                    click: function (row, group) {
                        function showPrompt(content,action) {
                            var deletePrompt = $sldsPrompt({
                                title: action.promptTitle ?
                                action.promptTitle :
                                    $rootScope.vlocity.getCustomLabelSync('Delete_Name', 'Delete {1}', _.escape(row.Name) || ''),
                                content: content,
                                theme: 'error',
                                show: true,
                                buttons: [{
                                    label: $rootScope.vlocity.getCustomLabelSync('Cancel', 'Cancel'),
                                    type: 'neutral',
                                    action: function () {
                                        deletePrompt.hide();
                                    }
                                }, {
                                    label: $rootScope.vlocity.getCustomLabelSync('Delete', 'Delete'),
                                    type: 'destructive',
                                    action: function () {
                                        deletePrompt.hide();
                                        row.deleting = true;
                                        let promise = [];
                                        let lwc;
                                        let lwcActive;
                                        if (action.deleteAction) {
                                            promise.push(action.deleteAction(row, group));
                                        } else {
                                            let lwcName = LightningWebCompFactory.convertNameToValidLWCCase(LightningWebCompFactory.DEFAULT_LWC_PREFIX + row.Name + "_" + row[$rootScope.nsPrefix + 'Version__c'] + "_" +row[$rootScope.nsPrefix + 'Author__c'])
                                            lwc = _.find($rootScope.lightningwebcomponents, { DeveloperName : lwcName });
                                            let lwcActiveName = LightningWebCompFactory.convertNameToValidLWCCase(LightningWebCompFactory.DEFAULT_LWC_PREFIX + row.Name);
                                            lwcActive = _.find($rootScope.lightningwebcomponents, { DeveloperName : lwcActiveName });
                                            if (lwc) {
                                                let matchingLWC = _.filter($rootScope.lightningwebcomponents, function(lwc) { 
                                                    return _.includes(lwc.DeveloperName, lwcActiveName+"_"); 
                                                });
                                                if(matchingLWC.length <= 1) {
                                                    if(lwcActive) {
                                                        promise.push(remoteActions.deleteComponent('LwcBundle', lwcActive.Id));
                                                    }
                                                } else {
                                                    promise.push(remoteActions.deleteComponent('LwcBundle', lwc.Id));
                                                }
                                            } else if(lwcActive) {
                                                promise.push(remoteActions.deleteComponent('LwcBundle', lwcActive.Id));
                                            } else {
                                                promise.push(remoteActions.deleteObject(row.Id));
                                            }
                                        }
                                        Promise.all(promise).then(function (result) {
                                            let hasError = _.find(result, { error: "error"}); 
                                            if(hasError) {
                                                let res = JSON.parse(hasError.body);
                                                $sldsToast({
                                                    title: $rootScope.vlocity.getCustomLabelSync('FailedToDelete', "Failed to delete '{1} (Version {2})'", _.escape(row.Name), row[$rootScope.nsPrefix + 'Version__c']),
                                                    content: res[0].message,
                                                    severity: 'error',
                                                    autohide: false
                                                });
                                                row.deleting = false;
                                            } else if(lwc || lwcActive) {
                                                let remainingPromise = [];
                                                if(lwcActive) {
                                                    _.remove($rootScope.lightningwebcomponents, {
                                                        Id: lwcActive.Id
                                                    });
                                                }
                                                if(lwc) {
                                                    _.remove($rootScope.lightningwebcomponents, {
                                                        Id: lwc.Id
                                                    });
                                                    remainingPromise.push(remoteActions.deleteComponent('LwcBundle', lwc.Id));
                                                }
                                                remainingPromise.push(remoteActions.deleteObject(row.Id));
                                                Promise.all(remainingPromise).then(function () {
                                                    $rootScope.sldsGroupTableDeleteLayout(row,group);
                                                }, function () {
                                                    row.deleting = false;
                                                });
                                            } else { //in case it's a layout without lwc
                                                row.deleting = false;
                                                $rootScope.sldsGroupTableDeleteLayout(row,group);
                                            }
                                        }, function (error) {
                                            row.deleting = false;
                                        });
                                    }
                                }]
                            });
                        }
                        if (angular.isFunction(this.action.promptContent)) {
                            var result = this.action.promptContent(row, group);
                            var action = this.action;
                            if (!angular.isString(result)) {
                                result.then(function (label) {
                                    showPrompt(label,action);
                                });
                            } else {
                                showPrompt(result,action);
                            }
                        } else {
                            showPrompt($rootScope.vlocity.getCustomLabelSync('SLDS_ConfirmDelete', 'Are you sure you want to delete {1}?', row.Name ? ('"' + _.escape(row.Name) + '"') : 'this'),action);
                        }
                    }
                }, {
                    text: labels[1],
                    icon: {
                        sprite: 'utility',
                        icon: 'preview'
                    },
                    click: function(row, group) {
                        window.open('/apex/' + fileNsPrefix() + 'ConsoleCards?isdtp=vw&layout=' + row.Name + '&layoutId=' +
                                            row.Id + '&previewMode=Universal','_blank');
                    }
                }, {
                    text: 'Clone',
                    icon: {
                        sprite: 'action',
                        icon: 'clone'
                    },
                    click: function(row, group) {
                        $scope.showCloneModal(row);
                    }
                }, {
                    text: 'Activate',
                    icon: {
                        sprite: 'utility',
                        icon: 'success'
                    },
                    click: function(row, group) {
                        $scope.setLayoutStatus([row], true, true, null, group);
                    },
                    hide: function(row, group) {
                        return row[fileNsPrefix() + 'Active__c'];
                    }
                },{
                    text: 'Deactivate',
                    icon: {
                        sprite: 'utility',
                        icon: 'error'
                    },
                    click: function(row, group) {
                        $scope.setLayoutStatus([row], false, true, null, group);
                    },
                    hide: function(row, group) {
                        return !row[fileNsPrefix() + 'Active__c'];
                    }
                }];
            });

        $scope.showCloneModal = function(parentLayout) {
            console.log('cloning layout parent',parentLayout);

            remoteActions.getLayout('Id',parentLayout.Id).then(
                function(layout) {
                    console.log('received parent layout ',layout[0]);
                    var modal, modalScope, title = 'Clone Layout';

                    modalScope = $scope.$new();
                    modalScope.parentLayout = layout[0];
                    modalScope.parentLayout[$rootScope.nsPrefix + 'Definition__c'] = JSON.parse(modalScope.parentLayout[$rootScope.nsPrefix + 'Definition__c']);
                    modalScope.clonedLayout = angular.copy(modalScope.parentLayout);
                    modalScope.clonedLayout[$rootScope.nsPrefix + 'Author__c'] = $window.orgName.toLowerCase() === DEFAULT_AUTHOR ? DEFAULT_AUTHOR + DEFAULT_AUTHOR_SUFFIX : $window.orgName;

                    modalScope.saveLayout = function(hideModal){
                        modalScope.clonedLayout[$rootScope.nsPrefix + 'Version__c'] = 1;
                        modalScope.clonedLayout[$rootScope.nsPrefix + 'ParentID__c'] = modalScope.parentLayout[$rootScope.nsPrefix + 'GlobalKey__c'];
                        delete modalScope.clonedLayout.Id;
                        delete modalScope.clonedLayout.createNewLayout;
                        delete modalScope.clonedLayout[$rootScope.nsPrefix + 'GlobalKey__c'];
                        console.log(modalScope.clonedLayout);
                        save(modalScope.clonedLayout, null, true).then(function(savedLayout) {
                            console.log('saved the new new layout',savedLayout);
                            if(savedLayout.errors){
                                console.log('look at these errors',savedLayout.errors);
                                modalScope.errors = savedLayout.errors;
                            } else {
                                hideModal();
                                if (typeof sforce != "undefined" && sforce.one) {
                                    sforce.one.navigateToURL('/apex/' + fileNsPrefix() + 'CardDesignerNew?id=' + savedLayout.Id);
                                } else {
                                    window.open('/apex/' + fileNsPrefix() + 'CardDesignerNew?id=' + savedLayout.Id, '_current');
                                }
                                
                            }

                        }, function(err){
                            console.log('couldnt save ',err);
                        });
                    };

                    modal = $sldsModal({
                        templateUrl: 'CloneModal.tpl.html',
                        show: true,
                        backdrop: 'static',
                        scope: modalScope,
                    });
                },
                function(err) {
                    console.log(err);
            });



        };

        remoteActions.isInsidePckg()
        .then(function(insidePckg) {
            console.log('inside pckg? ',insidePckg);
            $rootScope.insidePckg = insidePckg;
            // $rootScope.lockedLayout = $rootScope.insidePckg && $rootScope.layout[$rootScope.nsPrefix + 'Author__c'].toUpperCase() === 'VLOCITY';
            console.log('is layout locked? ',$rootScope.lockedLayout);
        }, function(err){
            console.log('inside pckg error ',err);
            //set to true if error returns that user does not have access to package
            $rootScope.insidePckg = true;
        });

        remoteActions.getBaseDatapacks('DP_CARDS_').then(
            function(packs){
                $scope.additionalTableButtons = $scope.additionalTableButtons || [];
                angular.forEach(packs, function(pack, index) {
                    $localizable('InstallDataPack', 'Install {1}', pack.Name.replace('DP_CARDS_',''))
                        .then(function(label) {
                            var tableButton = {
                                text: label,
                                id: pack.Name,
                                click: function() {
                                    $drvImport({
                                        scope: $scope,
                                        mode: 'staticresource',
                                        dataPackDataPublicId: pack.Name,
                                        dataPackDataPublicSource: 'Vlocity Resource',
                                        onImportComplete: function() {
                                            $rootScope.$broadcast('reload.table', 'cards-home');
                                        }
                                    });
                                }
                            };
                            $scope.additionalTableButtons.push(tableButton);
                        })
                });
            },
            function(error){
                console.log(error);
        });

        $scope.additionalHeaderButtons = $scope.additionalHeaderButtons || [];

        var cacheSettings = {
            id: 'cacheSettings',
            text: 'Cache Settings',
            enabled : true,
            click: function (scope, event) {
                var modalScope = $scope.$new();
                modalScope.showSpinner = false;
                modalScope.clearBtnDisabled = false;
                modalScope.clearCache = function(hideModal) {

                    modalScope.showSpinner = true;
                    modalScope.clearBtnDisabled = true;
                    let sessList = [];
                    let orgList = [];
                    modalScope.sessionCacheList.map(data => {
                        if (data.checked) {
                            sessList.push(data.value);
                        }
                    });
                    modalScope.orgCacheList.map(data => {
                        if (data.checked) {
                            orgList.push(data.value);
                        }
                    });
                    if(orgList.length > 0 || sessList.length > 0) {
                        remoteActions.clearAllCache(orgList.join(','),sessList.join(',')).then(
                            function(result) {
                                modalScope.showSpinner = false;
                                hideModal();
                                modalScope.clearBtnDisabled = false;
                                $sldsToast({
                                    title: "Success",
                                    content: "Cache cleared successfully!",
                                    severity: 'success',
                                    autohide: true
                                });
                            },function(err) {
                                console.log('couldnt save ',err);
                                modalScope.showSpinner = false;
                                modalScope.clearBtnDisabled = false;
                            });
                    } else {
                        hideModal();
                    }

                }
                modalScope.sessionCacheList = [{
                    label : 'User Profile',
                    value : 'getUserProfile',
                    checked : false
                }];
                modalScope.orgCacheList = [{
                    label : 'Layouts',
                    value : 'getLayout',
                    checked : false
                },{
                    label : 'Cards',
                    value : 'getActiveCardsByName',
                    checked : false
                },{
                    label : 'Templates',
                    value : 'getTemplate',
                    checked : false
                },{
                    label : 'Custom Labels',
                    value : 'getCustomLabels',
                    checked : false
                }];
                $sldsModal({
                    templateUrl: 'CacheSettings.tpl.html',
                    show: true,
                    backdrop: 'static',
                    scope: modalScope,
                });
            }
        };

        $scope.additionalHeaderButtons.push(cacheSettings);

        var activateButton = {
            id : 'activate',
            text : 'Activate',
            click : function(scope, event) {
                        var selectedRows = scope.sldsGroupedTableParams.selected();
                        $scope.setLayoutStatus(selectedRows, true, false, scope);
                    },
            hide: function(row, group) {
                        return $scope.$$childHead.sldsGroupedTableParams.selected().length === 0;
                    }
        };

        var deactivateButton = {
            id: 'deactivate',
            text : 'Deactivate',
            click : function(scope, event) {
                        var selectedRows = scope.sldsGroupedTableParams.selected();
                        $scope.setLayoutStatus(selectedRows, false, false, scope);
                    },
            hide: function(row, group) {
                        return $scope.$$childHead.sldsGroupedTableParams.selected().length === 0;
                    }
        };

        $scope.additionalHeaderButtons.push(activateButton);
        $scope.additionalHeaderButtons.push(deactivateButton);

        $scope.setLayoutStatus = function(rows, status, isRowAction, scope, group){
            var rowIds;
            if(isRowAction){
                rows[0].deleting = true;
                rowIds = [rows[0].Id];
            } else {
                rowIds = rows;
            }
            remoteActions.setLayoutStatus(rowIds, status).then(
                function(layouts){
                    if(layouts.length == 0){
                            if(isRowAction) {
                                rows[0].deleting = false;
                                if(group && group.data && group.data.length > 1 && status) {
                                    group.data.forEach(function(row) {
                                        row[$rootScope.nsPrefix + 'Active__c'] = false
                                    });
                                } 
                                rows[0][$rootScope.nsPrefix + 'Active__c'] = status;
                            } else {
                                scope.sldsGroupedTableParams.reload();
                            }
                        $timeout(function () {
                            remoteActions.getLayoutsById(rowIds).then(function(activatedLayouts){
                                activatedLayouts.forEach(function(layout){
                                    if (layout[$rootScope.nsPrefix+"Definition__c"] && typeof layout[$rootScope.nsPrefix+"Definition__c"] === "string") {
                                        layout[$rootScope.nsPrefix+"Definition__c"] = JSON.parse(layout[$rootScope.nsPrefix+"Definition__c"]);
                                    }
                                    if(layout[$rootScope.nsPrefix+"Definition__c"].enableLwc){
                                        $scope.createLwc(layout, status);
                                    }
                                })
                             });
                        }, 0);
                        return;
                    }
                    var modalScope = $scope.$new();
                    var labelPrefix = status ? 'A' : 'Dea';
                    var labelTitlePromise = $localizable(labelPrefix + 'ctivationTitle', labelPrefix + 'ctivation Error');
                    var labelBodyPromise = $localizable(labelPrefix + 'ctivateLayoutsError', 'Please select only one layout of a particular name to ' + labelPrefix.toLowerCase() + 'ctivate. ' + labelPrefix + 'ctivation of layouts with the same name is not allowed: {1}.?',
                                _.map(layouts, 'Name').join(', '));

                    $q.all([
                        labelTitlePromise,
                        labelBodyPromise
                    ]).then(function(labels) {
                        $sldsModal({
                            title: labels[0],
                            templateUrl: 'ErrorModal.tpl.html',
                            content: labels[1],
                            scope: modalScope,
                            show: true
                        });
                    });
            });
        };

        $scope.createLwc = function(obj, status){
            var nameOfLwc = LightningWebCompFactory.convertNameToValidLWCCase(LightningWebCompFactory.DEFAULT_LWC_PREFIX + obj.Name);
            var layoutLwc = _.find($rootScope.lightningwebcomponents, { DeveloperName: nameOfLwc });
            if(layoutLwc){
                LightningWebCompFactory.updateLocalResources(nameOfLwc, obj, 'layout', !status).then(function(){
                    // do something to indicate its done
                });
            } else {
                var lwcCmp = { name: nameOfLwc, files: [] };
                lwcCmp.files = LightningWebCompFactory.generateLWCFiles(
                    nameOfLwc,
                    obj,
                    'layout',
                    true
                );
                LightningWebCompFactory.createNewLwc(lwcCmp, obj, 'layout').then(function(){
                    // do something to indicate its done
                });
            }
        }

        $scope.globalWarnings = $scope.globalWarnings || [];
        $scope.isGlobalWarnings = false;

        remoteActions.isAllTriggersOn().then(
            function(isAllTriggerOn) {
                if(!isAllTriggerOn) {
                    var warningAllTriggers = {
                        name:"allTriggers",
                        message: {
                            label: 'AllTriggersNotOnWarning',
                            defaultValue: 'All Triggers custom setting (instance of TriggerSetup__c) has the Trigger On checkbox unchecked and should be checked for all operations.'
                        },
                        click: function(globalWarngs, globalWarng, hideModal) { $scope.setAllTriggers(globalWarngs, globalWarng, hideModal); }
                    }
                    $scope.globalWarnings.push(warningAllTriggers);
                    $scope.isGlobalWarnings = true;
                } 
            },
            function(error) {
                var warningAllTriggers = {
                    name:"allTriggers",
                    message: {
                        label: 'AllTriggersNotOnWarning',
                        defaultValue: 'All Triggers custom setting (instance of TriggerSetup__c) has the Trigger On checkbox unchecked and should be checked for all operations.'
                    },
                    click: function(globalWarngs, globalWarng, hideModal) { $scope.setAllTriggers(globalWarngs, globalWarng, hideModal); }
                }
                $scope.globalWarnings.push(warningAllTriggers);
                $scope.isGlobalWarnings = true;
            });

        $scope.isRemoteSite = function() {

            var warningforRemoteSite = {
                name: "remoteSite",
                types: [],
                message: {
                    label: 'RemoteSiteNotOnWarning',
                    defaultValue: 'Urls, needed for LWC, not added to Remote Site Settings. (format: https://[My Domain]--[vlocity namespace].visualforce.com and https://[My Domain].lightning.force.com)'
                },
                click: function (globalWarngs, globalWarng, hideModal) { $scope.addRemoteSite(globalWarngs, globalWarng, hideModal); }
            }

            var updateGlobalWarnings = function(type) {
                var index = $scope.globalWarnings.findIndex(globalWarning => globalWarning.name == "remoteSite")
                // here you can check specific property for an object whether it exist in your array or not

                if (index === -1) {
                    warningforRemoteSite.types.push(type);
                    $scope.globalWarnings.push(warningforRemoteSite);
                } else {
                    $scope.globalWarnings.map(globalWarning => {
                        if(globalWarning.name == "remoteSite") {
                            globalWarning.types.push(type);
                        }
                    });
                }
                
                $scope.isGlobalWarnings = true;
            }

            LightningWebCompFactory.isRemoteSiteVisualforce().then(
                function (res) {
                    // do something to indicate its done
                },
                function (error) {   
                    updateGlobalWarnings('visualforceRemoteSite');
                });

            LightningWebCompFactory.isRemoteSiteLightning().then(
                function (res) {
                    // do something to indicate its done
                },
                function (error) {
                    updateGlobalWarnings('lightningRemoteSite');
                });
        }

        $scope.isRemoteSite();
        
        $scope.setAllTriggers = function (globalWarngs, globalWarng, hideModal) {
            remoteActions.setAllTriggers().then(
                function (result) {
                    
                    _.remove($scope.globalWarnings, function(globalWarning) { return globalWarning.name == "allTriggers";});
                    _.remove(globalWarngs, function(globalWarng) { return globalWarng.name == "allTriggers";});

                    if ($scope.globalWarnings.length > 0) {
                        $scope.isGlobalWarnings = true;
                    } else {
                        $scope.isGlobalWarnings = false;
                        hideModal();
                    }
                },
                function (error) {
                    console.log("Could not set AllTriggers in TriggerSetup__c CustomSettings.");
                })
        };

        $scope.addRemoteSite = function (globalWarngs, globalWarng, hideModal) {

            var updateGlobalWarnings = function(type) {

                _.remove(globalWarng.types, function (t) { return t == type });

                if (globalWarng.types.length == 0) {
                    _.remove($scope.globalWarnings, function (globalWarning) { return globalWarning.name == "remoteSite"; });
                    _.remove(globalWarngs, function (globalWarng) { return globalWarng.name == "remoteSite"; });
                }

                if ($scope.globalWarnings.length > 0) {
                    $scope.isGlobalWarnings = true;
                } else {
                    $scope.isGlobalWarnings = false;
                    hideModal();
                }
            }

            if (globalWarng.types.includes("visualforceRemoteSite")) {

                LightningWebCompFactory.addRemoteSiteVisualforce().then(
                    function (res) {
                        updateGlobalWarnings("visualforceRemoteSite");
                    },
                    function (error) {
                        console.log("Could not add visualforce url to Remote Site Settings");
                    });
            }

            if (globalWarng.types.includes("lightningRemoteSite")) {

                LightningWebCompFactory.addRemoteSiteLightning().then(
                    function (res) {
                        updateGlobalWarnings("lightningRemoteSite");
                    },
                    function (error) {
                        console.log("Could not add visualforce url to Remote Site Settings");
                    });
            }
        }

        $scope.showGlobalWarnings = function() {
           
            var modalScope = $scope.$new();
            modalScope.globalWarnings = $scope.globalWarnings;

            $sldsModal({
                templateUrl: 'GlobalWarningsModal.tpl.html',
                scope: modalScope,
                show: true
            });
        }

        $timeout(function () {
            remoteActions.getLWCBundles('').then(function (lwcs) {
                $rootScope.lightningwebcomponents = lwcs.records;
            });
        }, 0);

    }]);

},{}],4:[function(require,module,exports){
angular.module('cardhome')
    .factory('save', function ($q, remoteActions, $rootScope, $timeout, $window, $localizable) {
        'use strict';
        var DEFAULT_AUTHOR = 'vlocity';
        function adaptLayoutJsonForSave(json, isLayout, ignoreCards) {
            return Object.keys(json).reduce(function (outputObject, key) {
                if (/(^Id|^Name|__c)$/.test(key)) {
                    outputObject[key] = json[key];
                    if (/Definition__c/.test(key)) {
                        if (isLayout && !ignoreCards) {
                            // update Deck on definition with the latest names of cards
                            outputObject[key].Cards = json[key].Cards = $rootScope.layoutCards.filter(function (card) {
                                return card !== null;
                            }).map(function (card) {
                                return card.Name;
                            });
                        }
                        outputObject[key] = angular.toJson(outputObject[key]);
                    }
                }
                return outputObject;
            }, {});
        }

        function shouldSave(item, json, isLayout, ignoreCards) {
            //parse definition if it comes in as string
            item[$rootScope.nsPrefix + 'Definition__c'] = typeof item[$rootScope.nsPrefix + 'Definition__c'] === 'string' ?
                JSON.parse(item[$rootScope.nsPrefix + 'Definition__c']) : item[$rootScope.nsPrefix + 'Definition__c'];
            if (item.saving) {
                return false;
            } else if (!item.Name || item.Name === '' || item.Name === '*') {
                $localizable('CardDesignerMustSetName', 'Please provide a name')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    })
                return false;
            }

            // if it is layout, check for template as it is mandatoryf
            if (isLayout && !item[$rootScope.nsPrefix + 'Author__c']) {
                $localizable('CardDesignerLayoutMustSelectAuthor', 'Please provide a Layout author')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    });
                return false;
            }

            // check for author name exists and not similar to default author 
            if ($rootScope.insidePckg && item[$rootScope.nsPrefix + 'Author__c'] && item[$rootScope.nsPrefix + 'Author__c'].toLowerCase() === DEFAULT_AUTHOR && !item.Id) {
                $localizable('DesignerMustSetAuthor', 'You cannot set Vlocity as your author')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    });
                return false;
            }

            // if it is layout with disabled LWC, check for template as it is mandatoryf
            if (isLayout && !item[$rootScope.nsPrefix + 'Definition__c'].enableLwc && (!item[$rootScope.nsPrefix + 'Definition__c'].templates ||
                item[$rootScope.nsPrefix + 'Definition__c'].templates.length === 0)) {
                $localizable('CardDesignerLayoutMustSelectTemplate', 'Please provide a template for the layout')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    });
                return false;
            }

            // if it is layout with enabled LWC, check for layout lwc as it is mandatory
            if (isLayout && item[$rootScope.nsPrefix + 'Definition__c'].enableLwc && !(item[$rootScope.nsPrefix + 'Definition__c'].lwc && item[$rootScope.nsPrefix + 'Definition__c'].lwc.DeveloperName)) {
                $localizable('CardDesignerLayoutMustSelectLwc', 'Please provide a component for the layout.')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    });
                return false;
            }

            // check layout name doesn't exist already
            if (isLayout && item.createNewLayout && $rootScope.layouts.find(function (layout) {
                // a layout name is duplicated if it was created by the "New" button from the CardHome page (item.createNewLayout)
                // and its name is the same as an existing one in the DB
                return layout.Name === item.Name && item[$rootScope.nsPrefix + 'Author__c'] === layout[$rootScope.nsPrefix + 'Author__c'] && item[$rootScope.nsPrefix + 'Version__c'] === layout[$rootScope.nsPrefix + 'Version__c'];
            })) {
                $localizable('CardDesignerNameAlreadyInUse', 'This name is already in use')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    });
                return false;
            }

            function convertNameToValidLWCCase(str) {
                return str
                    .replace(/\s(.)/g, function (a) {
                        return a.toUpperCase();
                    })
                    .replace(/\s/g, '')
                    .replace(/^(.)/, function (b) {
                        return b.toLowerCase();
                    })
                    .replace(/-(\w)/g, (m => m[1].toUpperCase()))
                    .replace(/__/g, "_")
                    .replace(/[^a-zA-Z0-9_]/g, "");
            }

            // check LWC component exist with same name (for this we first convert layout name to valid LWC name)
            if (isLayout && item[$rootScope.nsPrefix + 'Definition__c'].enableLwc && $rootScope.lightningwebcomponents.find(function (component) {
                return component.DeveloperName.toLowerCase() === (convertNameToValidLWCCase("cf-" + item.Name + "_" + item[$rootScope.nsPrefix + 'Version__c'] + "_" + item[$rootScope.nsPrefix + 'Author__c']).toLowerCase()) ||
                    component.DeveloperName.toLowerCase() === (convertNameToValidLWCCase("cf-" + item.Name).toLowerCase());
                //return layout.Name === item.Name && item[$rootScope.nsPrefix + 'Author__c'] === layout[$rootScope.nsPrefix + 'Author__c'] && item[$rootScope.nsPrefix + 'Version__c'] === layout[$rootScope.nsPrefix + 'Version__c'];
            })) {
                $localizable('CardLWCComponentExistsError', 'Lightning Web Component with same name exists.')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    });
                return false;
            }

            // Check if the layout already exists in case of enable lwc. Check for the layout name and author combination after formating the name and author of the layout.
            if (
                isLayout &&
                item.createNewLayout &&
                item[$rootScope.nsPrefix + "Definition__c"].enableLwc &&
                $rootScope.layouts.find(function(layout) {
                return (
                    JSON.parse(layout[$rootScope.nsPrefix + "Definition__c"])
                    .enableLwc === true &&
                    convertNameToValidLWCCase($rootScope.layout.Name).toLowerCase() ===
                    convertNameToValidLWCCase(layout.Name).toLowerCase() &&
                    convertNameToValidLWCCase(
                    $rootScope.layout[$rootScope.nsPrefix + "Author__c"]
                    ).toLowerCase() ===
                    convertNameToValidLWCCase(
                        item[$rootScope.nsPrefix + "Author__c"]
                    ).toLowerCase()
                );
                })
            ) {
                $localizable(
                    "LayoutLWCComponentExistsError",
                    "Lwc name already exists. Please try a different name or author"
                ).then(function(label) {
                    item.errors = [
                    {
                        message: label
                    }
                    ];
                });
                return false;
            };

            if (isLayout && !ignoreCards) {
                // don't save it if the change is a Card name and it's now invalid
                if ($rootScope.layoutCards.some(function (card) {
                    return card.Name === '' || card.Name === '*' || (card.errors && card.errors.length > 0);
                })) {
                    return false;
                }
            } else {
                // check card name doesn't exist already
                if (!ignoreCards && $rootScope.cards.find(function (card) {
                    return card.Name === item.Name && card.Id !== item.Id;
                })) {
                    if (item.originalJson) {
                        if (item.Name !== item.originalJson.Name) { //make sure the name changed to a used name
                            $localizable('CardDesignerNameAlreadyInUse', 'This name is already in use')
                                .then(function (label) {
                                    item.errors = [{
                                        message: label
                                    }];
                                });
                        } else {
                            delete item.errors;
                        }
                    } else {
                        $localizable('CardDesignerNameAlreadyInUse', 'This name is already in use')
                            .then(function (label) {
                                item.errors = [{
                                    message: label
                                }];
                            });
                    }

                    return false;
                }

                if (item[$rootScope.nsPrefix + 'Definition__c'] && item[$rootScope.nsPrefix + 'Definition__c'].states && item[$rootScope.nsPrefix + 'Definition__c'].states.length === 0) {
                    $localizable('CardDesignerCardStateMustExist', 'Please provide a Card State')
                        .then(function (label) {
                            item.errors = [{
                                message: label
                            }];
                        });
                    return false;
                }

                if (item[$rootScope.nsPrefix + 'Definition__c'] && item[$rootScope.nsPrefix + 'Definition__c'].states && item[$rootScope.nsPrefix + 'Definition__c'].states.length > 0) {
                    angular.forEach(item[$rootScope.nsPrefix + 'Definition__c'].states, function (state) {
                        if (!state.name || !state.templateUrl) {
                            $localizable('CardDesignerCardStateMustHaveNameAndTemplate', 'Please provide a Card State name and template')
                                .then(function (label) {
                                    item.errors = [{
                                        message: label
                                    }];
                                });
                            return false;
                        }
                    });
                }

            }

            if (angular.equals(item.originalJson, json)) {
                return false;
            }

            item.originalJson = json;
            item.saving = true;
            item.errors = null;
            return item;
        }

        function saveLayout(layout, ignoreCards) {
            var jsonToSave = adaptLayoutJsonForSave(layout, true, ignoreCards);
            if (shouldSave(layout, jsonToSave, true, ignoreCards)) {
                layout.saving = true;
                return remoteActions.saveLayout(jsonToSave).then(function (updatedLayout) {
                    layout.saving = false;
                    $rootScope.$broadcast('saved', layout);
                    if (updatedLayout) {
                        layout.Id = updatedLayout.Id;
                        var existingId = $window.location.href.split(/[?&]/).find(function (item) {
                            return /^id\=/.test(item);
                        });
                        if (existingId) {
                            existingId = existingId.replace(/^id=/, '');
                        }
                        if (!existingId || existingId !== layout.Id) {
                            $timeout(function () {
                                if (existingId) {
                                    var pathname = $window.location.href.replace(existingId, layout.Id);
                                    $window.history.pushState('', '', pathname);
                                } else {
                                    var newUrl = $window.location.pathname +
                                        ($window.location.search.length === 0 ? '?' :
                                            $window.location.search + '&') + 'id=' + layout.Id;
                                    $window.history.pushState('', '', newUrl);
                                }
                            });
                        }
                        if (updatedLayout.errors) {
                            layout.errors = updatedLayout.errors;
                        } else if (updatedLayout.type === 'exception') {
                            layout.errors = [{
                                message: updatedLayout.message
                            }];
                        }
                    }
                    return layout;
                }, function (error) {
                    console.log('bad save layout promise ', error);
                    layout = layout || {};
                    layout.saving = false;
                    layout.errors = [{
                        message: error.message,
                        data: error
                    }];
                    return layout;
                })
                    .catch(function (error) {
                        console.log('saving layout error ', error);
                        layout = layout || {};
                        layout.saving = false;
                        layout.errors = [{
                            message: error.message,
                            data: error
                        }];
                    });
            } else {
                return $q.when(layout);
            }
        }
        function saveCard(card) {
            var jsonToSave = adaptLayoutJsonForSave(card);
            if (shouldSave(card, jsonToSave)) {
                card.saving = true;
                return remoteActions.saveCard(jsonToSave).then(function (updatedCard) {
                    card.saving = false;
                    $rootScope.$broadcast('saved', card);
                    if (updatedCard) {
                        if (card.Id !== updatedCard.Id) {
                            card.Id = updatedCard.Id;
                            $rootScope.cards.push(card);
                        }
                        if (updatedCard.errors) {
                            card.errors = updatedCard.errors;
                        } else if (updatedCard.type === 'exception') {
                            card.errors = [{
                                message: updatedCard.message
                            }];
                        }
                    }
                }).catch(function (error) {
                    card.saving = false;
                    card.errors = [{
                        message: error.message
                    }];
                });
            } else {
                return $q.when(card);
            }
        }

        return function save(layout, cards, ignoreCards) {
            if (!layout || (!cards && !ignoreCards)) {
                //throw "Missing cards or layout when trying to save!";
                return $q.when(layout);
            }
            if (ignoreCards) {
                return saveLayout(layout, !!ignoreCards);
            }
            return $q.all(cards.filter(function (card) {
                return !(card.Name === '' && !card.originalJson);
            }).map(function (card) {
                return saveCard(card);
            })).then(function () {
                return saveLayout(layout);
            });
        };
    });

},{}],5:[function(require,module,exports){
angular.module("cardhome").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("GlobalWarningsModal.tpl.html",'<div class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n      <div class="slds-modal__header slds-theme--error slds-theme--alert-texture">\n          <h2 class="slds-text-heading--medium"><slds-svg-icon sprite="\'utility\'" icon="\'warning\'" size="\'small\'" extra-classes="\'slds-m-right--small slds-col slds-no-flex\'"></slds-svg-icon>{{::$root.vlocity.getCustomLabel(\'WarningsTitle\', \'Warnings\')}}</h2>\n      </div>\n      <div class="slds-modal__content slds-p-around--x-large slds-grid slds-grid--vertical">\n          <div class="" role="alert">\n            <table class="slds-wrap slds-table slds-table--bordered">\n              <tbody>\n                <tr ng-repeat="globalWarning in globalWarnings">\n                  <td class="slds-size_3-of-4 slds-cell-wrap">{{::$root.vlocity.getCustomLabel(globalWarning.message.label, globalWarning.message.defaultValue)}}</td>\n                  <td class="slds-size_1-of-4">\n                    <button ng-click="globalWarning.click(globalWarnings, globalWarning, $hide);"  type="button" class="slds-button slds-button--neutral">\n                      {{::$root.vlocity.getCustomLabel(\'FixWarnings\', \'Fix\')}}\n                    </button>\n                  </td>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n      </div>\n      <div class="slds-modal__footer">\n          <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()">\n              Close\n          </button>\n      </div>\n    </div>\n  </div>'),$templateCache.put("CloneModal.tpl.html",'<div class="slds-modal slds-fade-in-open">\n    <div>\n        <div class="slds-modal__container">\n            <div class="slds-modal__header">\n                <h2 class="slds-text-heading--medium">CLONE LAYOUT</h2>\n            </div>\n            <div ng-if="clonedLayout.errors">\n                <div class="slds-notify slds-notify--alert slds-theme--error slds-theme--alert-texture" role="alert" ng-repeat="error in clonedLayout.errors">\n                    <h2>\n                    <svg class="slds-icon slds-icon--small slds-m-right--x-small" aria-hidden="true">\n                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#ban"></use>\n                    </svg>{{error.message}}</h2>\n                </div>\n            </div>\n            <div class="slds-modal__content slds-p-around--x-large" style="min-height: 200px;">\n                <div class="slds-form-element">\n                    <label class="slds-form-element__label" for="layoutName">Layout Name</label>\n                    <div class="slds-form-element__control">\n                        <input type="text" id="layoutName" class="slds-input" ng-model="clonedLayout.Name" required=""/>\n                    </div>\n                </div>\n                <div class="slds-form-element">\n                    <label class="slds-form-element__label" for="select-01">Layout Type</label>\n                    <div class="slds-form-element__control">\n                        <div class="slds-select_container">\n                        <select id="select-01" class="slds-select" ng-model="clonedLayout[$root.nsPrefix+\'Type__c\']">\n                            <option>Layout</option>\n                            <option>Flyout</option>\n                        </select>\n                        </div>\n                    </div>\n                </div>\n                <div class="slds-form-element">\n                    <label class="slds-form-element__label" for="layoutName">Layout Author</label>\n                    <div class="slds-form-element__control">\n                        <input type="text" id="layoutName" class="slds-input" ng-model="clonedLayout[$root.nsPrefix+\'Author__c\']"/>\n                    </div>\n                </div>\n            </div>\n            <div class="slds-modal__footer">\n                <button type="button" class="slds-button slds-button--neutral"\n                        ng-click="$hide()">\n                        Close\n                </button>\n                <button type="button" class="slds-button slds-button--brand"\n                        ng-click="saveLayout($hide);" >\n                        Clone\n                </button>\n            </div>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("CacheSettings.tpl.html",'<div class="slds-modal slds-fade-in-open">\n    <div>\n        <div class="slds-modal__container">\n            <div class="slds-modal__header">\n                <h2 class="slds-text-heading--medium">Cache Settings</h2>\n            </div>\n            <div class="slds-modal__content slds-p-around_large slds-is-relative" style="min-height: 200px;">\n                <div ng-if="showSpinner" class="slds-spinner_container">\n                    <div class="slds-spinner--brand slds-spinner slds-spinner--large" aria-hidden="false" role="alert">\n                        <div class="slds-spinner__dot-a"></div>\n                        <div class="slds-spinner__dot-b"></div>\n                    </div>\n                </div>\n               \n                <div class="slds-grid slds-wrap">\n                    <div class="slds-col">\n                        <h2 class="slds-text-heading_small slds-p-bottom_small">Platform Org Cache</h2>\n                        <div class="slds-form-element">\n                            <div class="slds-form-element__control">\n                                <div class="slds-checkbox  slds-p-bottom_xx-small" ng-repeat="oCache in orgCacheList">\n                                    <input type="checkbox" name="ocache" id="checkbox-ocache-{{$index}}"\n                                        value="{oCache.value}" ng-model="oCache.checked" />\n                                    <label class="slds-checkbox__label" for="checkbox-ocache-{{$index}}">\n                                        <span class="slds-checkbox_faux"></span>\n                                        <span class="slds-form-element__label">{{oCache.label}}</span>\n                                    </label>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="slds-col">\n                        <h2 class="slds-text-heading_small slds-p-bottom_small">Platform Session Cache</h2>\n                        <div class="slds-form-element">\n                            <div class="slds-form-element__control">\n                                <div class="slds-checkbox  slds-p-bottom_xx-small" ng-repeat="sCache in sessionCacheList">\n                                    <input type="checkbox" ng-model="sCache.checked"  name="scache" id="checkbox-scache-{{$index}}"\n                                        value="{sCache.value}" />\n                                    <label class="slds-checkbox__label" for="checkbox-scache-{{$index}}">\n                                        <span class="slds-checkbox_faux"></span>\n                                        <span class="slds-form-element__label">{{sCache.label}}</span>\n                                    </label>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class="slds-modal__footer">\n                <button type="button" class="slds-button slds-button--neutral"\n                        ng-click="$hide()">\n                        Close\n                </button>\n                <button type="button" ng-disabled="clearBtnDisabled" class="slds-button slds-button--brand"\n                        ng-click="clearCache($hide);" >\n                        Clear\n                </button>\n            </div>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("ErrorModal.tpl.html",'<div class="slds-modal slds-fade-in-open">\n  <div class="slds-modal__container">\n    <div class="slds-modal__header slds-theme--error slds-theme--alert-texture">\n        <h2 class="slds-text-heading--medium"><slds-svg-icon sprite="\'utility\'" icon="\'warning\'" size="\'small\'" extra-classes="\'slds-m-right--small slds-col slds-no-flex\'"></slds-svg-icon>{{title}}</h2>\n    </div>\n    <div class="slds-modal__content slds-p-around--x-large slds-grid slds-grid--vertical">\n        <div class="" role="alert">\n           <slds-svg-icon sprite="\'utility\'" icon="\'warning\'" size="\'small\'" extra-classes="\'slds-icon-text-error\'"></slds-svg-icon>\n            {{content}}\n        </div>\n    </div>\n    <div class="slds-modal__footer">\n        <button ng-if="fixWarning" ng-click="fixWarning($hide)" type="button" class="slds-button slds-button--neutral">\n            {{labelFixItButton}}\n          </button>\n          <button type="button" class="slds-button slds-button--neutral" ng-click="$hide()">  \n            Close\n        </button>\n    </div>\n  </div>\n</div>'),$templateCache.put("ConfirmationModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header" ng-show="title">\n        <button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" ng-bind="title"></h4>\n      </div>\n      <div class="modal-body" ng-bind="content"></div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-primary" ng-click="ok();$hide()">{{ ::\'LayoutConfirmOk\' | localize: \'Delete\' }}</button>\n        <button type="button" class="btn btn-default" ng-click="$hide()">{{ ::\'LayoutConfirmCancel\' | localize: \'Cancel\' }}</button>\n      </div>\n    </div>\n  </div>\n</div>')}]);

},{}]},{},[1]);
})();

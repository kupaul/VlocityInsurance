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

angular.module('ouihome', ['vlocity', 'sldsangular', 'drvcomp', 'ngTable', 'infinite-scroll'])
  .config(['$compileProvider', function ($compileProvider) {
      $compileProvider.debugInfoEnabled(false);
  }]).config(['$localizableProvider', function($localizableProvider) {
      $localizableProvider.setLocalizedMap(window.i18n);
      $localizableProvider.setDebugMode(window.ns === '');
  }]).value('isIntegrationProcedure', true);

require('./modules/ouihome/config/config.js');
require('./modules/ouihome/factory/BackcompatExport.js');
require('./modules/ouihome/factory/BackcompatImport.js');
require('./modules/integrationprocedurehome/controller/ipHome.js');
},{"./modules/integrationprocedurehome/controller/ipHome.js":2,"./modules/ouihome/config/config.js":3,"./modules/ouihome/factory/BackcompatExport.js":4,"./modules/ouihome/factory/BackcompatImport.js":5,"./polyfills/Array.find.js":6,"./polyfills/Array.findIndex.js":7}],2:[function(require,module,exports){
/* global sforce*/
angular.module('ouihome')
.controller('iphome', ['$scope', '$rootScope', '$drvExport', '$sldsPrompt', 'remoteActions',
                             '$filter',  '$drvImport', '$window', 'backcompatExport', 'backcompatImport',
    function($scope, $rootScope, $drvExport, $sldsPrompt,
                remoteActions, $filter, $drvImport, $window, backcompatExport, backcompatImport) {

        'use strict';

        $scope.groupBy = function(script) {
            var type = script[fileNsPrefix() + 'Type__c'],
                subType = script[fileNsPrefix() + 'SubType__c'],
                language = script[fileNsPrefix() + 'Language__c'];
            return (type ? type : '') + '/' + (subType ? subType : '') + '/' +
                     (language ? language : '');
        };

        $scope.backcompatImport = backcompatImport;
        $scope.searchColumns = [fileNsPrefix() + 'Type__c', fileNsPrefix() + 'SubType__c', 'Name'];
        $scope.defaultColumns = [
            {
                resizable: true,
                field: fileNsPrefix() + 'Type__c',
                additionalFields: [fileNsPrefix() + 'SubType__c', fileNsPrefix() + 'Version__c'],
                getValue: function($scope, row) {
                    var url = window.omniNewUrl + '?id=' + row.Id;
                    return '<a href="' + url + '" ng-mouseup="$root.vlocityOpenUrl(\'' + url  + '\', $event);">' +
                    _.escape(row.Name) + ' (Version ' + row[fileNsPrefix() + 'Version__c'] + ')</a>';
                },
                getGroupValue: function($scope, $group) {
                    var type = _.escape($group.data[0][fileNsPrefix() + 'Type__c']),
                        subType = _.escape($group.data[0][fileNsPrefix() + 'SubType__c']);
                    if (!type) {
                        return '<span>&nbsp;</span>';
                    }
                    return '<span>' + type + (subType ? '/' + subType : '') + '</span>';
                },
                dynamic: true,
                sortable: false
            }, {
                title: 'Description',
                resizable: true,
                field: fileNsPrefix() + 'AdditionalInformation__c'
            }, {
                title: 'Last Modified Date',
                resizable: true,
                width: 140,
                field: 'LastModifiedDate',
                getGroupValue: function($scope, $group) {
                    return $filter('date')($group.data[0].LastModifiedDate, 'short');
                },
                getValue: function($scope, row) {
                    return $filter('date')(row.LastModifiedDate, 'short');
                }
            }, {
                title: 'Last Modified By',
                resizable: true,
                width: 140,
                field: 'LastModifiedById',
                getGroupValue: function($scope, $group) {
                    return _.escape($group.data[0].LastModifiedBy.Name);
                },
                getValue: function($scope, row) {
                    return _.escape(row.LastModifiedBy.Name)
                }
            },  {
                field: fileNsPrefix() + 'IsActive__c',
                resizable: false,
                width: 90,
                dynamic: true,
                getValue: function($scope, row) {
                    if (row[fileNsPrefix() + 'IsActive__c']) {
                        return '<span class="slds-icon_container" title="Is Active">' +
                                '<slds-svg-icon sprite="\'utility\'"' +
                                ' icon="\'success\'" size="\'x-small\'"  extra-classes=\"\'slds-icon-text-default\'\"></slds-svg-icon></span>';
                    }
                },
                getGroupSortValue: function($scope, $group) {
                    var hasAnActiveEntry = false;
                    _.forEach($group.data, function(row) {
                        if (row[fileNsPrefix() + 'IsActive__c']) {
                            hasAnActiveEntry = true;
                            return false;
                        }
                    });
                    return hasAnActiveEntry;
                },
                getGroupValue: function($scope, $group) {
                    var hasAnActiveEntry = false;
                    _.forEach($group.data, function(row) {
                        if (row[fileNsPrefix() + 'IsActive__c']) {
                            hasAnActiveEntry = true;
                            return false;
                        }
                    });
                    if (hasAnActiveEntry) {
                        return '<span class="slds-icon_container" title="Is Active">' +
                                '<slds-svg-icon sprite="\'utility\'"' +
                                ' icon="\'success\'" size="\'x-small\'"  extra-classes=\"\'slds-icon-text-default\'\"></slds-svg-icon></span>';
                    }
                }
            }
        ];

        function changeActivation(row, group, isActivate) {
            var input = angular.toJson({
                Id: row.Id
            });
            var options = angular.toJson({
                url: 'integrationprocedurehome'
            });
            // note - this is to simply change the icon to a spinner for user feedback.
            row.deleting = true;
            var className = fileNsPrefixDot() + 'BusinessProcessController.BusinessProcessControllerOpen';

            vlocityVFActionFunctionControllerHandlers.runServerMethod(className, isActivate ? 'ActivateVersion' : 'DeactivateVersion', input, options, false)
                .then(function(response) {
                var responseObj = JSON.parse(response);

                if (/integrationprocedurehome/.test(responseObj.url)) {
                    $scope.$evalAsync(function() {
                        row.deleting = false;
                        if (isActivate) {
                            group.data.forEach(function(row) {
                                row[fileNsPrefix() + 'IsActive__c'] = false;
                            });
                        }
                        row[fileNsPrefix() + 'IsActive__c'] = isActivate;
                    });
                } else {
                    window.vlocityOpenUrl(responseObj.url);
                }
            });
        }

        $scope.rowActions = [
            {
                text: 'Activate',
                icon: {
                    sprite: 'utility',
                    icon: 'success'
                },
                click: function(row, group) {
                    changeActivation(row, group, true);
                },
                hide: function(row, group) {
                    return row[fileNsPrefix() + 'IsActive__c'];
                }
            },
            {
                text: 'Deactivate',
                icon: {
                    sprite: 'utility',
                    icon: 'clear'
                },
                click: function(row, group) {
                    changeActivation(row, group, false);
                },
                hide: function(row, group) {
                    return !row[fileNsPrefix() + 'IsActive__c'];
                }
            },
            {
                type: 'export',
                drvType: 'IntegrationProcedure',
                backcompatExport: backcompatExport
            }, {
                type: 'delete',
                promptTitle: 'Delete Integration Procedure?',
                promptContent: function(row) {
                    return 'Are you sure you want to delete this Integration Procedure?<br/> <br/>"' +
                    _.escape(row.Name) + ' (Version ' + row[fileNsPrefix() + 'Version__c'] + ')" ';
                },
                hide: function(row, group) {
                    return row[fileNsPrefix() + 'IsActive__c'];
                }
            }, {
                text: 'Publish',
                icon: {
                    sprite: 'utility',
                    icon: 'upload'
                },
                click: function(row, group) {
                    backcompatExport(row, false, true);
                },
                hide: function(row, group) {
                    return !row[fileNsPrefix() + 'IsActive__c'];
                }
            }
        ];

        $scope.sorting = {
        };
        $scope.sorting[fileNsPrefix() + 'Type__c'] = 'asc';

        $scope.extraFilters = [{
            name: {
                Name: fileNsPrefix() + 'IsProcedure__c',
                Type: 'BOOLEAN'
            },
            operator: '=',
            value: true
        }];

    }]);

},{}],3:[function(require,module,exports){
angular.module('ouihome')
    .config(['remoteActionsProvider', 'fileNsPrefixDot', function(remoteActionsProvider, fileNsPrefixDot) {
        'use strict';
        var remoteActions = {
            exportOmniScript: {
                action: fileNsPrefixDot() + 'OmniScriptHomeController.exportScripts',
                config: {buffer: true,escape: false}
            },
            BuildJSONV2: {
                action: fileNsPrefixDot() + 'OmniScriptHomeController.BuildJSONV2',
                config: {escape: false, buffer: false}
            },
            toggleElementTrigger: fileNsPrefixDot() + 'OmniScriptHomeController.toggleElementTrigger',
            createElement: {
                action: fileNsPrefixDot() + 'OmniScriptHomeController.createElement',
                config: {escape: false, buffer: true}
            },
            createScript: fileNsPrefixDot() + 'OmniScriptHomeController.createScript',
        };
        remoteActionsProvider.setRemoteActions(remoteActions);
    }])
    .config(['$localizableProvider', function ($localizableProvider) {
        $localizableProvider.setLocalizedMap(window.i18n);
        $localizableProvider.setDebugMode(window.ns === '');
    }])
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }]).value('isIntegrationProcedure', true);

},{}],4:[function(require,module,exports){
angular.module('ouihome')
       .factory('backcompatExport', function(remoteActions, $localizable) {
           var $scope = {};

           return function backcompatExport(script, dontRetryCompile, useJSONV2)  {
                var exportResult,
                    initialPromise;
                if (useJSONV2) {
                    initialPromise = remoteActions.BuildJSONV2(script.Id)
                } else {
                    initialPromise = remoteActions.exportOmniScript(script.Id);
                }
                initialPromise
                    .then(function(result) {
                        var pom = document.createElement('a');
                        if (!angular.isString(result)) {
                            // OMNI-421 - always make into array for backcompat
                            if (!angular.isArray(result) && useJSONV2 !== true) {
                                result = [result];
                            }
                            result = JSON.stringify(result);
                            result = result.replace('&quot;', '&amp;quot;');
                        }
                        try {
                            pom.setAttribute('href', 'data:application/zip;charset=utf-8,' + encodeURIComponent(result));
                            var name = (script[fileNsPrefix() + 'Type__c'] || '') + '_' + (script[fileNsPrefix() + 'SubType__c'] || '') + '_' + (script[fileNsPrefix() + 'Language__c'] || '');
                            name = name.replace(/ /g, '');
                            pom.setAttribute('download', name + '.json');
                            pom.style.display = 'none';
                            document.body.appendChild(pom);
                            pom.click();
                        } catch (e) {
                            window.alert($localizable('OmniHomeFailExport', 'Unable to export {1}', script.Name));
                        }
                        document.body.removeChild(pom);
                    }, function(error) {
                        if (dontRetryCompile) {
                            window.alert($localizable('OmniHomeFailExport', 'Unable to export {1}', script.Name));
                        } else {
                            // if false then try compile it
                            var iframe = document.createElement('iframe');
                            iframe.src = window.previewUrl + '?id=' + script.Id;
                            iframe.style.display = 'none';
                            $(iframe).load(function() {
                                setTimeout(function() {
                                    document.body.removeChild(iframe);
                                    backcompatExport(script, true, useJSONV2);
                                }, 5000);
                            });
                            document.body.appendChild(iframe);
                        }
                    });
           };
       });

},{}],5:[function(require,module,exports){
angular.module('ouihome')
       .factory('backcompatImport', function($localizable, remoteActions, $q) {
           var $scope = {};

           return function backcompatImport(json, done) {
               if (!angular.isArray(json)) {
                   json = [json];
               }
               $scope.importScripts = json;
               $scope.importScripts = $scope.importScripts.filter(function(script) {
                   return script.Name && script.jsonScript && script.jsonScript.propSetMap;
               });
               if ($scope.importScripts.length === 0) {
                   return false;
               }
               $scope.importedScriptNames = [];
               $scope.importMessage = $localizable('OmniScriptImport', 'Importing Script...');
               remoteActions.toggleElementTrigger(false)
                .then(function() {
                    if ($scope.importScripts) {
                        var promises = $scope.importScripts.reduce(function(array, script) {
                          return array.concat(angular.isArray(script) ? script : [script]);
                      }, []).map(function(script) {
                          return importScripts(script)
                            .then(function(result) {
                                $scope.importedScriptNames.push(result.Name);
                                $scope.importMessage = $localizable('OmniHomeImportMessage', 'Importing \'{1}\'...',
                                                                      result.Name);
                                return createElements(result.sfdcId, result.sfdcId, result.jsonScript.children);
                            });
                      });

                        return $q.all(promises);
                    } else {
                        return remoteActions.toggleElementTrigger(true);
                    }
                })
                  .then(flattenOrLoad)
                  .then(function() {
                      done();
                  }, function() {
                      done();
                  });
               return true;
           };

           function recursivelyFlatten(result, intoArray) {
              if (angular.isArray(result)) {
                  intoArray = intoArray.concat(result.reduce(function(array, value) {
                      return array.concat(recursivelyFlatten(value, []));
                  }, []));
              } else {
                  intoArray.push(result);
              }
              return intoArray;
          }

           function flattenOrLoad(result) {
              var promises = [];
              if (!angular.isArray(result)) {
                  result = [result];
              }
              promises = recursivelyFlatten(result, []).filter(function(value) {
                  return value && value.then;
              }).map(function(value) {
                  return $q.when(value);
              });
              if (promises.some(function(value) {
                  return !!value.then;
              })) {
                  return $q.all(promises).then(flattenOrLoad);
              }
          }

           function importScripts(script) {
                var propSetMap = '';
                if (script.jsonScript.propSetMap) {
                    propSetMap = JSON.stringify(script.jsonScript.propSetMap);
                }
                return remoteActions.createScript(script.Name, script.jsonScript, propSetMap)
                        .then(function(result) {
                            script.sfdcId = result;
                            return script;
                        });
            }

           function createElements(omniscriptId, parentId, elements) {
                var ind = 0;
                return elements.map(function(element) {
                    if (element.bEmbed === true)
                    {
                        ind++;
                        return $q.when(true);
                    }
                    $scope.importedElements++;
                    return createElement(omniscriptId, parentId, element, ind++)
                      .then(function(result) {
                          $scope.importedElements--;
                          $scope.totalImportedElements++;
                          var promises = [];
                          if (result.children && result.children.length > 0) {
                              promises.push(createElements(result.omniId, result.sfdcId, result.children));
                          }
                          if ($scope.importedElements === 0) {
                              $scope.importMessage = $localizable('OmniHomeImportMessage2',
                                  'Completed: Imported {1} scripts and {2} elements', $scope.importScripts.length,
                                  $scope.totalImportedElements);
                              promises.push(remoteActions.toggleElementTrigger(true));
                          }
                          return $q.all(promises);
                      }, function(reason) {
                          $scope.importMessage = $localizable('OmniHomeImportMessage3',
                              'Completed with Errors: Imported {1} scripts and {2} elements',
                                $scope.importScripts.length, $scope.totalImportedElements);
                          return remoteActions.toggleElementTrigger(true);
                      });
                });
            }

           function createElement(omniscriptId, parentId, jsonData, eleOrder) {
               if (jsonData.eleArray) {
                   jsonData = jsonData.eleArray[0];
               }
               var propSetMap = JSON.stringify(jsonData.propSetMap);
               return remoteActions.createElement(omniscriptId, parentId, jsonData, propSetMap, eleOrder)
                  .then(function(result) {
                      jsonData.sfdcId = result;
                      jsonData.omniId = omniscriptId;
                      return jsonData;
                  });
           }

       });

},{}],6:[function(require,module,exports){
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
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
},{}],7:[function(require,module,exports){
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
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

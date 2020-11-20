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
angular.module('drhome', ['sldsangular', 'drvcomp', 'ngTable', 'vlocity', 'infinite-scroll'])
	.config(['$localizableProvider', function($localizableProvider) {
      'use strict';
      $localizableProvider.setLocalizedMap(window.i18n);
      $localizableProvider.setDebugMode(window.ns === '');
  	}]);

require('./modules/drhome/config/config.js');

require('./modules/drhome/controller/DRHome.js');

},{"./modules/drhome/config/config.js":2,"./modules/drhome/controller/DRHome.js":3}],2:[function(require,module,exports){
angular.module('drhome')
    .config(['remoteActionsProvider', 'fileNsPrefixDot', function(remoteActionsProvider, fileNsPrefixDot) {
        'use strict';
        var remoteActions = {
            getAllBundles: {
                action: fileNsPrefixDot() + 'DRHomeController.getAllBundles',
                config: {escape: false}
            },
            deleteBundle: {
                action: fileNsPrefixDot() + 'DRHomeController.deleteBundle'
            }
        };
        remoteActionsProvider.setRemoteActions(remoteActions);
    }]);

},{}],3:[function(require,module,exports){
angular.module('drhome')
    .controller('drhome', ['$sanitize', '$scope', 'remoteActions', '$filter', '$localizable',
                                function($sanitize, $scope, remoteActions, $filter, $localizable) {
        'use strict';

        $scope.defaultColumns = [{
            field: 'Name',
            resizable: true
        }, {
            field: fileNsPrefix() + 'Type__c',
            resizable: true,
            width: 180,
            additionalFields: [fileNsPrefix() + 'InputType__c', fileNsPrefix() + 'OutputType__c'],
            sortable: fileNsPrefix() + 'Type__c, ' + fileNsPrefix() + 'InputType__c, ' + fileNsPrefix() + 'OutputType__c',
            getValue: function($scope, row) {
                var output = row[fileNsPrefix() + 'Type__c'];
                if (!/\(/.test(output)) {
                    if (row[fileNsPrefix() + 'InputType__c'] && row[fileNsPrefix() + 'OutputType__c']) {
                        output += ' (' + row[fileNsPrefix() + 'InputType__c'] + ' → ' + row[fileNsPrefix() + 'OutputType__c'] + ')';
                    } else if (row[fileNsPrefix() + 'OutputType__c']) {
                        output += ' (' + row[fileNsPrefix() + 'OutputType__c'] + ')';
                    }
                }
                return _.escape(output);
            }
        }, {
            field: fileNsPrefix() + 'Description__c',
            getValue: function($scope, row) {
                if (!row[fileNsPrefix() + 'Description__c']) {
                    return '';
                }
                return '<span title="' + _.escape(row[fileNsPrefix() + 'Description__c']) + '">' +
                _.escape(row[fileNsPrefix() + 'Description__c']) + '</span>';
            },
            resizable: true
        }, {
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
            resizable: true,
            width: 140,
            field: 'LastModifiedById',
            getGroupValue: function($scope, $group) {
                return $group.data[0].LastModifiedBy ? _.escape($group.data[0].LastModifiedBy.Name) : '';
            },
            getValue: function($scope, row) {
                return row.LastModifiedBy ? _.escape(row.LastModifiedBy.Name) : '';
            }
        }];

        $localizable('DeleteDataRaptor', 'Delete DataRaptor')
            .then(function(label) {
                $scope.rowActions = [{
                    type: 'export',
                    drvType: 'DataRaptor'
                }, {
                    type: 'delete',
                    promptTitle: label,
                    promptContent: function(row, group) {
                        return $localizable('DeleteDataraptorConfirmation2', 'Are you sure you want to delete this DataRaptor interface?<br/> <br/> {1}', _.escape(row.Name));
                    },
                    deleteAction: function(row, group) {
                        return remoteActions.deleteBundle(row.Id);
                    }
                }];
            });

        $scope.extraFilters = [{
            name: {
                Name: fileNsPrefix() + 'Type__c'
            },
            operator: '!=',
            value: 'Migration'
        }, {
            name: {
                Name: fileNsPrefix() + 'Type__c'
            },
            operator: '!=',
            value: 'Export (Component)'
        }];

    }]);

},{}]},{},[1]);
})();

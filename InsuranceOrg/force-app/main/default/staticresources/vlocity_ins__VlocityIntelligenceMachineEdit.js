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
angular.module('vlocityIntelligenceMachineEdit', ['vlocity', 'drvcomp', 'sldsangular', 'ngSanitize', 'ngMessages', 'ngAria', 'ngAnimate'])
  .config(['remoteActionsProvider', function(remoteActionsProvider) {
      'use strict';
      var actions = ['getMachine', 'getResource', 'saveMachine', 'saveMachineConfig', 'saveMachineResource', 'deleteMachineResource', 'saveResource', 'simulateRequest'];
      var config = actions.reduce(function(config, action) {
            config[action] = {
                action: fileNsPrefixDot() + 'VlocityIntelligenceMachineEditCtrl.' + action,
                config: {escape: (action === 'saveMachineConfig')}
            };
            return config;
        }, {});
      remoteActionsProvider.setRemoteActions(config);
  }])
  .run(function(VqMachine, $$resources, $rootScope) {
    delete VqMachine.attributes;
    if (VqMachine.Owner) {
      delete VqMachine.Owner.attributes;
    }
    VqMachine.$$originalJSON = angular.toJson(VqMachine);
    VqMachine.$$resources = $$resources;
    VqMachine.$$resources.forEach(function(resource) {
      delete resource.attributes;
      resource.$$originalJSON = angular.toJson(resource);
    });
    $rootScope.nsPrefix = fileNsPrefix();
  })
.constant('_', window._);

require('./modules/vlocityIntelligenceMachineEdit/controller/vlocityIntelligenceMachine.js');

require('./modules/vlocityIntelligenceMachineEdit/directives/vimResources.js');
require('./modules/vlocityIntelligenceMachineEdit/directives/vimWeightings.js');

require('./modules/vlocityIntelligenceMachineEdit/templates/templates.js');
},{"./modules/vlocityIntelligenceMachineEdit/controller/vlocityIntelligenceMachine.js":2,"./modules/vlocityIntelligenceMachineEdit/directives/vimResources.js":3,"./modules/vlocityIntelligenceMachineEdit/directives/vimWeightings.js":4,"./modules/vlocityIntelligenceMachineEdit/templates/templates.js":5}],2:[function(require,module,exports){
angular.module('vlocityIntelligenceMachineEdit')
    .controller('vlocityIntelligenceMachine', function(VqMachine, fieldMetadata, fieldSetMetadata, _, remoteActions, $window) {
        'use strict';
        var ns = fileNsPrefix();
        this.machine = VqMachine;
        this.fields = fieldMetadata.VqMachine;
        this.fields.Owner = {'Name': {'label': 'Owner'}};
        this.visibleFields = fieldSetMetadata.VqMachine;
        this.activeTab = 0;

        this.buttons = [
            {
                type: 'edit',
                handleSave: function(machine) {
                    var safeJson = angular.fromJson(angular.toJson(machine));
                    return remoteActions.saveMachine(safeJson)
                            .then(function(updatedMachine) {
                                var newUrl;
                                if (!machine.Id) {
                                    newUrl = '/apex/' + ns + $window.location.pathname.substring($window.location.pathname.lastIndexOf('/') + 1) +
                                                ($window.location.search.length === 0 ? '?' :
                                                $window.location.search + '&') + 'id=' + updatedMachine.Id;
                                    if (window.top !== window) {
                                        if (window.sforce && window.sforce.console && window.sforce.console.isInConsole()) {
                                            sforce.console.getEnclosingPrimaryTabId(function(parentTabResponse) {
                                                sforce.console.getEnclosingTabId(function(response) {
                                                    if (response.id === parentTabResponse.id) {
                                                        sforce.console.openPrimaryTab(null, newUrl, true);
                                                    } else {
                                                        sforce.console.openSubtab(parentTabResponse.id, newUrl, true, '');
                                                    }
                                                    sforce.console.closeTab(response.id);
                                                });
                                            });
                                        } else if (window.sforce && window.sforce.one && window.sforce.one.navigateToURL) {
                                            window.sforce.one.navigateToURL(newUrl);
                                        } else {
                                            $window.history.replaceState('', '', newUrl);
                                        }
                                    } else {
                                        $window.history.replaceState('', '', newUrl);
                                    }
                                }
                                _.assign(machine, updatedMachine);
                            });
                }
            },{
                type: 'export'
            }];

        if (typeof sforce !== 'undefined') {
            if (sforce.console && sforce.console.isInConsole()) {
                sforce.console.setTabTitle(VqMachine.Name || 'New Intelligence Machine');
                sforce.console.setTabIcon('custom:custom109');
            }
        }
    });

},{}],3:[function(require,module,exports){
angular.module('vlocityIntelligenceMachineEdit')
    .directive('vimResources', function(remoteActions, $timeout, $sldsDeletePrompt, $sldsToast, $localizable, $q, resources, resourcePage) {

        return {
            restrict: 'ACE',
            bindToController: {
                resources: '=',
                machine: '=',
                onDelete: '&'
            },
            scope: {},
            templateUrl: 'vimResources.tpl.html',
            controllerAs: 'ctrl',
            controller: function($scope, fieldMetadata, $element, $rootScope) {
                var self = this;
                this.ns = fileNsPrefix();

                this.deleteResource = function(resource, $index) {
                    $sldsDeletePrompt(resource, function() {
                        var promise = $q.when(resource);
                        if (resource.Id) {
                            promise = remoteActions.deleteMachineResource(resource.Id, self.machine.Id);
                        }
                        promise.then(function() {
                            self.resources.splice($index, 1);
                        });
                        var selectedResource = self.resources[$index >= self.resources.length ? self.resources.length-1 : $index];
                        self.selectResource(selectedResource);
                        return promise;
                    });                  
                };

                this.addResource = function(resource) {
                    var machineResource = {};
                    machineResource[fileNsPrefix() + 'VqResourceId__c'] = resource.Id;
                    machineResource[fileNsPrefix() + 'VqMachineId__c'] = self.machine.Id;
                    self.machine.$$saving = true;
                    remoteActions.saveMachineResource(machineResource)
                        .then(function() {
                            self.selectedNewResource = null;
                            self.machine.$$saving = false;
                            self.resources.push(resource);
                            self.selectResource(resource);
                            return $localizable('SavedToastTitle', '{1} "{2}" was saved.', '', resource.Name);
                        }).then(function(toastTitle) {
                            $sldsToast({
                                severity: 'success',
                                title: toastTitle,
                                icon: 'success'
                            });
                        }).catch(function(error) {
                            console.log(error);
                            self.machine.$$saving = false;
                            resource.$$error = error;
                            $localizable("CouldNotSave", "Could not save '{1}'", resource.Name)
                                .then(function(label) {
                                    $sldsToast({
                                        severity: 'error',
                                        title: label,
                                        icon: 'warning',
                                        autohide: false,
                                        content: error.message
                                    });
                                });
                        });
                };

                this.getResources = function() {
                    var map = self.resources.reduce(function(map, resource) {
                        map[resource.Id] = resource;
                        return map;
                    }, {});
                    return resources.filter(function(resource) {
                        return !map[resource.Id];
                    });
                };

                this.selectResource = function(resource) {
                    if (this.selectedResource == resource) {
                        return;
                    }
                    this.selectedResource = resource;
                    this.selectedResource.$$loading = true;
                    remoteActions.getResource(resource.Id)
                        .then(function(resource) {
                            self.selectedResource.$$loading = false;
                            resource[fileNsPrefix() + 'EffectiveDate__c'] = resource[fileNsPrefix() + 'EffectiveDate__c'] ? new Date(resource[fileNsPrefix() + 'EffectiveDate__c']) : undefined;
                            resource[fileNsPrefix() + 'ExpirationDate__c'] = resource[fileNsPrefix() + 'ExpirationDate__c'] ? new Date(resource[fileNsPrefix() + 'ExpirationDate__c']) : undefined;
                            _.assign(self.selectedResource, resource);
                        })
                        .catch(function(error) {
                            self.selectedResource.$$loading = false;
                            console.log(error);
                            self.selectedResource.$$error = error;
                            $localizable("CouldNotLoad", "Could not load '{1}'", resource.Name)
                                .then(function(label) {
                                    $sldsToast({
                                        severity: 'error',
                                        title: label,
                                        icon: 'warning',
                                        autohide: false,
                                        content: error.message
                                    });
                                });
                        })
                        .finally(function() {
                            renderLightningComponent();
                        });
                };

                function renderLightningComponent() {
                    var prefix = fileNsPrefix().replace("__", "");
                    var el = document.getElementById(self.selectedResource.Id + '-profiler');
                    if (!el) {
                        $timeout(renderLightningComponent, 250);
                        return;
                    }
                    $Lightning.use(prefix + ":ltngOutVF", function() {
                        el.innerHTML = '';
                        $Lightning.createComponent(prefix + ":profileTopLevelContainerView",
                            { 
                                entityId : self.selectedResource.Id,
                                applicableSubTypes: ['Profile Attribute', 'Product Attribute'],
                                ignoreApplicableTypes: true
                            },
                            self.selectedResource.Id + '-profiler',
                            function(cmp) {
                            });
                    });
                }

                function getActivityData(resource) {
                    var preParsed = resource[fileNsPrefix() + 'ActivityData__c'];
                    if (!preParsed) {
                        return {};
                    }
                    return JSON.parse(preParsed);
                }

                this.getViewedStats = function(resource) {
                    var activityData = getActivityData(resource);
                    return Object.keys(activityData).reduce(function(sum, attrCode) {
                        var attrData = activityData[attrCode];
                        return (sum + attrData.On.View);
                    }, 0);
                };

                this.getClickedStats = function(resource) {
                    var activityData = getActivityData(resource);
                    var clicked = Object.keys(activityData).reduce(function(sum, attrCode) {
                        var attrData = activityData[attrCode];
                        return [(sum[0] + attrData.On.Accept), (sum[1] + attrData.On.View)];
                    }, [0, 0]);
                    if (clicked[0] === 0 || clicked[1] == 0) {
                        return clicked[0] + ' (0%)';
                    }
                    return clicked[0] + ' (' + ((clicked[0]/clicked[1])*100) + '%)';
                };

                this.getRejectedStats = function(resource) {
                    var activityData = getActivityData(resource);
                    var rejected = Object.keys(activityData).reduce(function(sum, attrCode) {
                        var attrData = activityData[attrCode];
                        return [(sum[0] + attrData.On.Reject), (sum[1] + attrData.On.View)];
                    }, [0, 0]);
                    if (rejected[0] === 0 || rejected[1] == 0) {
                        return rejected[0] + ' (0%)';
                    }
                    return rejected[0] + ' (' + ((rejected[0]/rejected[1])*100) + '%)';
                };

                var dereg = $scope.$watch('ctrl.resources', function(resources) {
                    if (resources && resources.length > 0) {
                        self.selectResource(resources[0]);
                        dereg();
                    }
                });

                this.openResource = function(resource, $event) {
                    window.vlocityOpenUrl(resourcePage + '?id=' + resource.Id, '_blank', $event, true);
                };
            }
        };
    });
},{}],4:[function(require,module,exports){
angular.module('vlocityIntelligenceMachineEdit')
    .directive('vimWeightings', function(remoteActions, $timeout, $sldsDeletePrompt, $sldsToast, $localizable, $q, categories) {

        return {
            restrict: 'ACE',
            bindToController: {
                machine: '=',
                onDelete: '&'
            },
            scope: {},
            templateUrl: 'vimWeightings.tpl.html',
            controllerAs: 'ctrl',
            controller: function($scope, fieldMetadata, $element, $rootScope) {
                var self = this;
                this.ns = fileNsPrefix();
                this.categories = categories;
                this.selectedCategory = null;
                this.nothingYet = true;
                this.simulateData = {};
                this.jsonMode = false;
                this.invalidJSON = false;

                var params = {
                    'ContextId': '',
                    'pageSize': '2'
                };
                try {
                    if (this.jsonParams) {
                        params = JSON.parse(this.jsonParams);
                    }
                    this.params = Object.keys(params).reduce(function(arr, key) {
                        arr.push({key: key, value: params[key]});
                        return arr;
                    }, []);
                    
                } catch (e) {
                    this.jsonMode = true;
                    this.invalidJSON = true;
                }

                // public functions
                this.toggleJsonMode = function() {
                    this.jsonMode = !this.jsonMode;
                    if (this.jsonMode) {
                        this.jsonParams = JSON.stringify(this.params.reduce(function(obj, param) {
                            obj[param.key] = param.value;
                            return obj;
                        }, {}), 4);
                    } else {
                        var params = JSON.parse(this.jsonParams);
                        this.params = Object.keys(params).reduce(function(arr, key) {
                            arr.push({key: key, value: params[key]});
                            return arr;
                        }, []);
                        self.invalidJSON = false;
                    }
                }

                $scope.$watch('ctrl.jsonParams', function(json) {
                    try {
                        JSON.parse(self.jsonParams);
                        self.invalidJSON = false;
                    } catch (e) {
                        self.invalidJSON = true;
                    }
                });

                $scope.$watch('ctrl.params', function(params) {
                    self.jsonParams = JSON.stringify(self.params.reduce(function(obj, param) {
                        obj[param.key] = param.value;
                        return obj;
                    }, {}), 4);
                }, true);

                this.reset = function() {
                    self.params = [];
                }

                this.addParam = function() {
                    this.params.push({key:'',value:''});
                }

                this.deleteParam = function(param){
                    this.params.forEach(function(param_, i) {
                        if (param_ == param) {
                            self.params.splice(i, 1);
                        }
                    });
                }

                
                this.getCategories = function(existinglabels) {
                    if (!existinglabels) return this.categories;
                    return this.categories.filter(function(category) {
                        return !existinglabels.categoryLabels[category.CategoryCode];
                    });
                };

                this.addCategory = function(selectedCategory, scoringInterface) {
                    scoringInterface.categoryLabels[selectedCategory.CategoryCode] = selectedCategory.CategoryName;
                    scoringInterface.categoryWeights[selectedCategory.CategoryCode] = 10;
                    this.selectedCategory = null;
                };

                this.removeCategory = function(scoringInterface, key, label) {
                    var asObj = {
                        Id: key,
                        Name: label
                    };
                    $sldsDeletePrompt(asObj, function() {
                        var promise = $q.when(asObj);
                        delete scoringInterface.categoryLabels[key];
                        delete scoringInterface.categoryWeights[key];
                        return promise;
                    })
                }

                $scope.$watch('ctrl.machine', function(machine) {
                    if (machine) {
                        self.loading = true;
                        remoteActions.getMachine(JSON.parse(angular.toJson(machine)))
                            .then(function(machineConfig) {
                                self.machineConfig = machineConfig;
                                if (!self.machineConfig.Id) {
                                    self.machineConfig.Id = self.machine.Id;
                                    self.machineConfig.Name = self.machine[self.ns + 'RestResourceName__c'];
                                }
                                self.machineConfig.$$originalJSON = angular.toJson(machineConfig);
                                self.loading = false;
                            })
                            .catch(function(error) {
                                console.log(error);
                                self.loading = false;
                                self.machine.$$error = error;
                                $localizable("CouldNotLoadMachineConfig", "Could not load machine config for '{1}'", machine.Name)
                                    .then(function(label) {
                                        $sldsToast({
                                            severity: 'error',
                                            title: label,
                                            icon: 'warning',
                                            autohide: false,
                                            content: error.message
                                        });
                                    });
                            });
                    }
                });

                var saveToken = null;
                $scope.$watch('ctrl.machineConfig', function(machineConfig) {
                    if (machineConfig) {
                        if (saveToken) {
                            $timeout.cancel(saveToken);
                        }
                        var jsonString = angular.toJson(self.machineConfig);
                        if (machineConfig.$$originalJSON !== jsonString) {
                            saveToken = $timeout(function() {
                                    self.machine.$$saving = true;
                                    var capturedSaveToken = saveToken;
                                    remoteActions.saveMachineConfig(jsonString)
                                        .then(function(machineConfig) {
                                            _.assign(self.machineConfig, machineConfig);
                                            self.machine.$$saving = false;
                                            self.machineConfig.$$originalJSON = angular.toJson(self.machineConfig);
                                        }).catch(function(error) {
                                            console.log(error);
                                            self.machine.$$saving = false;
                                            self.machine.$$error = error;
                                            $localizable("CouldNotSave", "{1} could not be saved.", self.machineConfig.Name)
                                                .then(function(label) {
                                                    $sldsToast({
                                                        severity: 'error',
                                                        title: label,
                                                        icon: 'warning',
                                                        autohide: false,
                                                        content: error.message
                                                    });
                                                });
                                            });
                            }, 1000);
                        }
                    }
                }, true);

                // simulate
                this.simulate = function() {
                    self.simulateData.$$requesting = true;
                    remoteActions.simulateRequest(self.machine[self.ns + 'RestResourceName__c'], JSON.parse(self.jsonParams))
                        .then(function(response) {
                            self.simulateData.$$requesting = false;
                            self.simulateData.response = response;
                        })
                        .catch(function(error) {
                            self.simulateData.$$requesting = false;
                            console.log(error);
                            self.simulateData.$$error = error;
                            $localizable("CouldNotLoadMachineConfig", "Could not execute simulate for '{1}'", self.machine.Name)
                                    .then(function(label) {
                                        $sldsToast({
                                            severity: 'error',
                                            title: label,
                                            icon: 'warning',
                                            autohide: false,
                                            content: error.message
                                        });
                                    });
                        });
                }

                var clipboard = new Clipboard('.copy-btn');
                clipboard.on('success', function(e) {
                    $sldsToast({
                        severity: 'success',
                        title: 'Copied Successfully',
                        content: 'The Machine REST url is in your clipboard'
                    });
                });
            }
        };
    });
},{}],5:[function(require,module,exports){
angular.module("vlocityIntelligenceMachineEdit").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("vimWeightings.tpl.html",'<div class="slds-col slds-grid slds-grid--vertical-stretch slds-grid--pull-padded" style="max-width: 100%">\n    <div class="slds-col slds-size--1-of-{{ctrl.machineConfig.scoringInterfaces.length + 2}} slds-p-left_small slds-panel slds-grid slds-grid--vertical slds-nowrap"\n        ng-repeat="scoringInterface in ctrl.machineConfig.scoringInterfaces" ng-if="!ctrl.loading">\n        <div class="slds-panel__section slds-has-divider--bottom slds-grid">\n            <div class="slds-col slds-media slds-media--center slds-has-flexi-truncate">\n                <div class="slds-media__body slds-truncate">\n                    <p class="slds-truncate slds-text-heading--small">Category Weights</p>\n                </div>\n            </div>\n        </div>\n        <div class="slds-form-stacked slds-scrollable--y">\n            <div class="slds-panel__section">\n                <div class="slds-form-element" ng-repeat="(key, label) in scoringInterface.categoryLabels">\n                    <span class="slds-form-element__label">\n                        <span class="slds-slider-label">\n                            <span class="slds-slider-label__label" ng-bind="label"></span>\n                            <span class="slds-slider-label__range">0 - 100</span>\n                        </span>\n                    </span>\n                    <div class="slds-form-element__control">\n                        <div class="slds-slider">\n                            <input type="range" class="slds-slider__range" ng-model="scoringInterface.categoryWeights[key]" min="0" max="100" step="1">\n                            <span class="slds-slider__value" aria-hidden="true">{{scoringInterface.categoryWeights[key]}}</span>\n                        </div>\n                    </div>\n                </div>\n                <div class="slds-form-element slds-m-top--small">\n                    <span class="slds-form-element__label">&nbsp;</span>\n                    <slds-picklist multiple="false" ng-model="ctrl.selectedCategory" slds-options="option as option.CategoryName for option in ctrl.getCategories(scoringInterface)"\n                        empty-text="Select a Category"\n                        autocomplete="true"\n                        ng-disabled="ctrl.getCategories(scoringInterface).length == 0"\n                        style="display:inline-block"></slds-picklist>\n                    <button class="slds-button slds-button--icon" title="Add" ng-disabled="!ctrl.selectedCategory" ng-click="ctrl.addCategory(ctrl.selectedCategory, scoringInterface)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'new\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Add</span>\n                    </button>\n                </div>\n            </div>\n            <div class="slds-panel__section slds-has-divider--top">\n                <h3 class="slds-text-heading--small slds-m-bottom--medium">Activity Weights</h3>\n                <div class="slds-form-element">\n                    <span class="slds-form-element__label">\n                            <span class="slds-slider-label">\n                                    <span class="slds-slider-label__label">View</span>\n                                    <span class="slds-slider-label__range">0 - 100</span>\n                                </span>\n                    </span>\n                    <div class="slds-form-element__control">\n                        <div class="slds-slider">\n                            <input type="range" class="slds-slider__range" ng-model="scoringInterface.viewDecayWeight" min="0" max="100" step="1">\n                            <span class="slds-slider__value" aria-hidden="true">{{scoringInterface.viewDecayWeight}}</span>\n                        </div>\n                    </div>\n                </div>\n                <div class="slds-form-element">\n                    <span class="slds-form-element__label">\n                        <span class="slds-slider-label">\n                                <span class="slds-slider-label__label">Accept</span>\n                                <span class="slds-slider-label__range">0 - 100</span>\n                        </span>\n                    </span>\n                    <div class="slds-form-element__control">\n                        <div class="slds-slider">\n                            <input type="range" class="slds-slider__range" ng-model="scoringInterface.acceptDecayWeight" min="0" max="100" step="1">\n                            <span class="slds-slider__value" aria-hidden="true">{{scoringInterface.acceptDecayWeight}}</span>\n                        </div>\n                    </div>\n                </div>\n                <div class="slds-form-element">\n                    <span class="slds-form-element__label">\n                        <span class="slds-slider-label">\n                            <span class="slds-slider-label__label">Reject</span>\n                            <span class="slds-slider-label__range">0 - 100</span>\n                        </span>\n                    </span>\n                    <div class="slds-form-element__control">\n                        <div class="slds-slider">\n                            <input type="range" class="slds-slider__range" ng-model="scoringInterface.rejectDecayWeight" min="0" max="100" step="1">\n                            <span class="slds-slider__value" aria-hidden="true">{{scoringInterface.rejectDecayWeight}}</span>\n                        </div>\n                    </div>\n                </div>\n                <div class="slds-form-element">\n                    <span class="slds-form-element__label">\n                        <span class="slds-slider-label">\n                            <span class="slds-slider-label__label">Decay</span>\n                            <span class="slds-slider-label__range">0 - 100</span>\n                        </span>\n                    </span>\n                    <div class="slds-form-element__control">\n                        <div class="slds-slider">\n                            <input type="range" class="slds-slider__range" ng-model="scoringInterface.weight" min="0" max="100" step="1">\n                            <span class="slds-slider__value" aria-hidden="true">{{scoringInterface.weight}}</span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class="slds-col slds-size--2-of-{{ctrl.machineConfig.scoringInterfaces.length + 2}} slds-border--left slds-panel slds-grid slds-grid--vertical slds-nowrap"\n        ng-if="!ctrl.loading">\n        <div class="slds-grow slds-grid slds-grid--vertical slds-grid--vertical-stretch slds-scrollable--y">\n            <div class="slds-panel__section slds-has-divider--bottom">\n                <div class="slds-grid">\n                    <p class="slds-text-heading--small slds-col--bump-right" title="Simulate">Simulate</p>\n                    <span class="slds-type-focus slds-p-right--x-small copy-btn" title="Copy this link to access your machine service" data-clipboard-text="/services/apexrest/{{::ctrl.ns.replace(\'__\', \'\')}}/v1/acuity/{{ctrl.machine[ctrl.ns + \'RestResourceName__c\']}}">/services/apexrest/{{::ctrl.ns.replace(\'__\', \'\')}}/v1/intelligence/{{ctrl.machine[ctrl.ns + \'RestResourceName__c\']}}</span>\n                    <slds-svg-icon sprite="\'utility\'" icon="\'copy\'" size="\'x-small\'" extra-classes="\'copy-btn slds-icon-text-default slds-type-focus\'"\n                        data-clipboard-text="/services/apexrest/{{::ctrl.ns.replace(\'__\', \'\')}}/v1/intelligence/{{ctrl.machine[ctrl.ns + \'RestResourceName__c\']}}"></slds-svg-icon>\n                </div>\n            </div>\n            <div class="slds-col slds-grid slds-grid--vertical slds-grid--vertical-stretch slds-is-relative slds-scrollable--y slds-p-left--small">\n                <div class="slds-col slds-grid slds-grid--vertical-stretch">\n                    <div class="slds-size--1-of-2 slds-grid slds-p-right--small slds-p-top--small slds-p-bottom--small slds-grid--vertical  slds-grid--vertical-stretch">\n                        <div class="slds-col slds-grid slds-grid--vertical">\n                            <div class="slds-grid slds-m-bottom--small">\n                                <div class="slds-text-heading--medium">{{ \'InputParameters\' | localize:\'Input Parameters\' }}</div>\n                                <button class="slds-button slds-button--neutral slds-col--bump-left" ng-click="ctrl.toggleJsonMode()" ng-if="!ctrl.jsonMode">{{ \'EditAsJSON\' | localize:\'Edit as JSON\' }}</button>\n                                <button class="slds-button slds-button--neutral slds-col--bump-left" ng-click="ctrl.toggleJsonMode()" ng-if="ctrl.jsonMode" ng-disabled="ctrl.invalidJSON">{{ \'EditAsParams\' | localize:\'Edit as Params\' }}</button>\n\n                            </div>\n                            <div class="slds-form--compound" ng-if="!ctrl.jsonMode">\n                                <div class="slds-form-element__group">\n                                    <div class="slds-form-element__row">\n                                        <div class="slds-form-element slds-size--1-of-2">\n                                            <label class="slds-form-element__label">{{\'Key\' | localize:\'Key\'}}</label>\n                                        </div>\n                                        <div class="slds-form-element slds-size--1-of-2">\n                                            <label class="slds-form-element__label">{{\'Value\' | localize:\'Value\'}}</label>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <fieldset class="slds-form--compound" ng-repeat="param in ctrl.params" ng-if="!ctrl.jsonMode">\n                                <div class="slds-form-element__group">\n                                    <div class="slds-form-element__row">\n                                        <div class="slds-form-element slds-col">\n                                            <input class="slds-input" type="text" ng-model="param.key" />\n                                        </div>\n                                        <div class="slds-form-element slds-col">\n                                            <input id="input-02" class="slds-input" type="text" ng-model="param.value" />\n                                        </div>\n                                        <button class="slds-button slds-button--icon slds-m-left--x-small" ng-click="ctrl.deleteParam(param)"\n                                        style="flex-shrink: 0">\n                                            <slds-button-svg-icon sprite="\'utility\'" icon="\'delete\'"></slds-button-svg-icon>\n                                        </button>\n                                    </div>\n                                </div>\n                            </fieldset>\n                            <div class="slds-text-align--center slds-m-bottom--small" ng-if="!ctrl.jsonMode">\n                                <button class="slds-button" ng-click="ctrl.addParam()">\n                                    <slds-button-svg-icon sprite="\'utility\'" icon="\'add\'"></slds-button-svg-icon>\n                                    {{ \'AddNewKeyValuePair\' | localize:\'Add New Key/Value Pair\' }}\n                                </button>\n                            </div>\n                            <div class="slds-col slds-grid slds-grid--vertical-stretch slds-p-bottom--small slds-form-element" ng-class="{\'slds-has-error\': ctrl.invalidJSON}"\n                                ng-if="ctrl.jsonMode">\n                                <div class="slds-form-element__control slds-grid slds-grid--vertical-stretch" style="width:100%;">\n                                    <textarea class="slds-col slds-textarea" style="width: 100%; " ng-model="ctrl.jsonParams"></textarea>\n                                </div>\n                                <div class="slds-form-element__help" ng-if="ctrl.invalidJSON">{{ \'InvalidJSON\' | localize:\'Invalid JSON\'}}</div>\n                            </div>\n                            <div class="slds-clearfix">\n                                <a ng-click="ctrl.reset()" class="slds-button">{{\'ClearData\' | localize:\'Clear Data\'}}</a>\n                                <button class="slds-button slds-button--brand slds-float--right" ng-click="ctrl.simulate()" ng-disabled="ctrl.invalidJSON">{{ \'Simulate\' | localize:\'Simulate\' }}</button>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="slds-size--1-of-2 slds-grid slds-p-top--small slds-p-bottom--small slds-grid--vertical  slds-grid--vertical-stretch">\n                        <div class="slds-text-heading--medium slds-m-left--small">{{ ::$root.vlocity.getCustomLabel(\'Response\', \'Response:\') }}</div>\n                        <div class="slds-col slds-col--rule-left slds-p-left--small slds-grid slds-box slds-theme--default slds-m-top--small">\n                            <pre style="overflow: auto; margin: 0">{{ctrl.simulateData.response | json}}</pre>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class="slds-spinner_container slds-col" ng-if="ctrl.loading || ctrl.simulateData.$$requesting">\n        <div class="slds-spinner--brand slds-spinner slds-spinner--medium" role="alert">\n            <span class="slds-assistive-text">Loading</span>\n            <div class="slds-spinner__dot-a"></div>\n            <div class="slds-spinner__dot-b"></div>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("vimResources.tpl.html",'<div class="slds-col slds-grid slds-grid_vertical-stretch slds-grid_pull-padded">\n    <div class="slds-col slds-size_2-of-3 slds-p-horizontal_left slds-scrollable_y">\n        <table class="slds-table slds-table_bordered slds-table_cell-buffer slds-table_fixed-layout">\n            <thead>\n                <tr class="slds-text-title_caps">\n                    <th scope="col">\n                        <div class="slds-truncate" title="Resource">Resource</div>\n                    </th>\n                    <th scope="col" style="width: 90px">\n                        <div class="slds-truncate" title="Is Active">Is Active?</div>\n                    </th>\n                    <th scope="col">\n                        <div class="slds-truncate" title="Viewed">Viewed</div>\n                    </th>\n                    <th scope="col">\n                        <div class="slds-truncate" title="Clicked">Click</div>\n                    </th>\n                    <th scope="col">\n                        <div class="slds-truncate" title="Rejected">Reject</div>\n                    </th>\n                    <th class="slds-cell-shrink" scope="col"></th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr ng-repeat="resource in ctrl.resources" ng-click="ctrl.selectResource(resource)"\n                    ng-class="{\'slds-is-selected via-selected-item\': ctrl.selectedResource == resource}"\n                    ng-attr-aria-selected="{{ctrl.selectedResource == resource}}">\n                    <th scope="row" ng-attr-data-label="{{::resource.Name}}" style="cursor: pointer">\n                        <div class="slds-truncate" ng-attr-title="{{::resource.Name}}"  ng-bind="resource.Name" style="cursor: pointer"></div>\n                    </th>\n                    <td data-label="Is Active">\n                        <div class="slds-truncate slds-text-align_center">\n                            <span class="slds-icon_container" title="Is Active">\n                                <slds-svg-icon sprite="\'utility\'"\n                                        icon="\'success\'"\n                                        size="\'x-small\'"\n                                        extra-classes="\'slds-icon-text-default\'"\n                                        ng-if="resource[ctrl.ns + \'IsActive__c\']">\n                                </slds-svg-icon>\n                            </span>\n                        </div>\n                    </td>\n                    <td data-label="Viewed">\n                        <div class="slds-truncate" ng-bind="::ctrl.getViewedStats(resource)" style="cursor: pointer"></div>\n                    </td>\n                    <td data-label="Clicked">\n                        <div class="slds-truncate" ng-bind="::ctrl.getClickedStats(resource)" style="cursor: pointer"></div>\n                    </td>\n                    <td data-label="Rejected">\n                        <div class="slds-truncate" ng-bind="::ctrl.getRejectedStats(resource)" style="cursor: pointer"></div>\n                    </td>\n                    <td role="gridcell" class="slds-cell-shrink" data-label="Actions">\n                        <button class="slds-button slds-button_icon-x-small" title="Delete" ng-click="ctrl.deleteResource(resource, $index)" ng-if="!resource.$$deleting">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'delete\'" size="\'small\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Delete</span>\n                    </button>\n                    <button class="slds-button slds-button_icon-x-small" title="Delete" disabled="disabled" ng-if="resource.$$deleting">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'spinner\'" size="\'small\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Deleting</span>\n                    </button>\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n        <div class="slds-form-element slds-m-top_small">\n            <span class="slds-form-element__label">&nbsp;</span>\n            <slds-picklist multiple="false" restrict="true" ng-model="ctrl.selectedNewResource" slds-options="option as option.Name for option in ctrl.getResources() | orderBy:\'+Name\'" ng-disabled="ctrl.getResources().length == 0" empty-text="Select a Resource" autocomplete="true" style="display: inline-block;"></slds-picklist>\n            <button class="slds-button slds-button_icon" title="Add" ng-disabled="!ctrl.selectedNewResource" ng-click="ctrl.addResource(ctrl.selectedNewResource)">\n                <slds-button-svg-icon sprite="\'utility\'" icon="\'new\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Add</span>\n            </button>\n        </div>\n    </div>\n    <div class="slds-col slds-size_1-of-3 slds-border_left slds-p-bottom_xx-large slds-grid slds-grid_vertical slds-grid_vertical-stretch">\n        <div class="slds-panel__section slds-has-divider_bottom slds-grid" ng-if="ctrl.selectedResource">\n            <div class="slds-col slds-media slds-media_center slds-has-flexi-truncate">\n                <div class="slds-media__body slds-truncate">\n                    <p class="slds-truncate slds-text-heading_small" ng-if="ctrl.selectedResource.Name" ><span ng-bind="ctrl.selectedResource.Name"></span><button class="slds-button slds-button_icon slds-m-left_x-small" title="Open in new window" ng-click="ctrl.openResource(ctrl.selectedResource, $event)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'new_window\'" size="\'small\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Open in new window</span>\n                    </button></p>\n\n                </div>\n            </div>\n            <div class="slds-no-flex" style="margin-top: -8px;">\n                <div class="slds-icon_container" ng-if="ctrl.selectedResource.$$loading">\n                    <slds-svg-icon sprite="\'utility\'" icon="\'spinner\'" size="\'small\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                </div>\n            </div>\n        </div>\n        <div class="slds-scrollable_y slds-p-bottom_xx-large slds-col" ng-if="ctrl.selectedResource">\n            <div class="slds-panel__section slds-form_stacked slds-grid slds-wrap slds-has-divider_bottom">\n                <div class="slds-form-element slds-size--1-of-1">\n                    <span class="slds-form-element__label">Headline</span>\n                    <div class="slds-form-element__control slds-has-divider--bottom">\n                        <span class="slds-form-element__static">{{ctrl.selectedResource[$root.nsPrefix + \'Headline__c\']}}</span>\n                    </div>\n                </div>\n                <div class="slds-form-element slds-size_1-of-1">\n                    <span class="slds-form-element__label">Sub-Title</span>\n                    <div class="slds-form-element__control slds-has-divider_bottom">\n                        <div class="slds-form-element__static slds-text-longform">\n                        <p>{{ctrl.selectedResource[$root.nsPrefix + \'SubTitle__c\']}}</p>\n                        </div>\n                    </div>\n                </div>\n                <div class="slds-form-element slds-size_1-of-1">\n                    <span class="slds-form-element__label">Description</span>\n                    <div class="slds-form-element__control slds-has-divider_bottom">\n                        <div class="slds-form-element__static slds-text-longform">\n                        <p>{{ctrl.selectedResource[$root.nsPrefix + \'Description__c\']}}</p>\n                        </div>\n                    </div>\n                </div>\n                <div class="slds-form-element slds-size_1-of-2">\n                    <span class="slds-form-element__label">Effective Date</span>\n                    <div class="slds-form-element__control slds-has-divider_bottom">\n                        <span class="slds-form-element__static" ng-if="ctrl.selectedResource[$root.nsPrefix + \'EffectiveDate__c\']">{{ctrl.selectedResource[$root.nsPrefix + \'EffectiveDate__c\'] | date}}</span>\n                        <span class="slds-form-element__static" ng-if="!ctrl.selectedResource[$root.nsPrefix + \'EffectiveDate__c\']">&nbsp;<span>\n                    </div>\n                </div>\n                <div class="slds-form-element slds-size_1-of-2 slds-p-left_x-small">\n                    <span class="slds-form-element__label">Expiration Date</span>\n                    <div class="slds-form-element__control slds-has-divider_bottom">\n                        <span class="slds-form-element__static" ng-if="ctrl.selectedResource[$root.nsPrefix + \'ExpirationDate__c\']">{{ctrl.selectedResource[$root.nsPrefix + \'ExpirationDate__c\'] | date }}</span>\n                        <span class="slds-form-element__static" ng-if="!ctrl.selectedResource[$root.nsPrefix + \'ExpirationDate__c\']">&nbsp;<span>\n                    </div>\n                </div>\n            </div>\n            <div class="slds-panel__section slds-has-divider_bottom slds-grid">\n                <div class="slds-col slds-media slds-media_center slds-has-flexi-truncate">\n                    <div class="slds-media__body slds-truncate">\n                        <p class="slds-truncate slds-text-heading_small">Attributes</p>\n                    </div>\n                </div>\n                <div class="slds-no-flex" style="margin-top: -8px;">\n                    <div class="slds-icon_container" ng-if="ctrl.selectedResource.$$loading">\n                        <slds-svg-icon sprite="\'utility\'" icon="\'spinner\'" size="\'small\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                    </div>\n                </div>\n            </div>\n            <div ng-attr-id="{{ctrl.selectedResource.Id}}-profiler" ng-if="!ctrl.selectedResource.$$loading"></div>\n        </div>\n    </div>\n</div>\n')}]);

},{}]},{},[1]);
})();

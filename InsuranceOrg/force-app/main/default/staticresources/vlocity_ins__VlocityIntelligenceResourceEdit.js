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
angular.module('vlocityIntelligenceResourceEdit', ['vlocity', 'drvcomp', 'sldsangular', 'ngSanitize', 'ngMessages', 'ngAria', 'ngAnimate'])
  .config(['remoteActionsProvider', function(remoteActionsProvider) {
      'use strict';
      var actions = ['saveResource', 'getAttachments', 'saveAttachment', 'deleteAttachment', 
      'getAttributesForAttributeCode'];
      var config = actions.reduce(function(config, action) {
            config[action] = {
                action: fileNsPrefixDot() + 'VlocityIntelligenceResourceEditCtrl.' + action,
                config: {escape: false}
            }; 
            return config;
        }, {});
      remoteActionsProvider.setRemoteActions(config);
  }])
  .run(function(VqResource, $rootScope, $sldsToast) {
      try {
        if (VqResource[fileNsPrefix() + 'ActivityData__c']) {
          VqResource[fileNsPrefix() + 'ActivityData__c'] = JSON.parse(VqResource[fileNsPrefix() + 'ActivityData__c']);
        }
      } catch (e) {
        $sldsToast({
            severity: 'error',
            title: 'Corrupted Activity Data!',
            icon: 'warning',
            autohide: false,
            content: 'The data in the field ' + fileNsPrefix() + 'ActivityData__c is corrupt: ' + e.message
        });
      }
      delete VqResource.attributes;
      if (VqResource.Owner) {
        delete VqResource.Owner.attributes;
      }
      VqResource.$$originalJSON = angular.toJson(VqResource);
      $rootScope.nsPrefix = fileNsPrefix();
  })
.constant('_', window._); 

require('./modules/vlocityIntelligenceResourceEdit/controller/vlocityIntelligenceResource.js');

require('./modules/vlocityIntelligenceResourceEdit/directives/virEdit.js');
require('./modules/vlocityIntelligenceResourceEdit/directives/virActivity.js');

require('./modules/vlocityIntelligenceResourceEdit/templates/templates.js');
},{"./modules/vlocityIntelligenceResourceEdit/controller/vlocityIntelligenceResource.js":2,"./modules/vlocityIntelligenceResourceEdit/directives/virActivity.js":3,"./modules/vlocityIntelligenceResourceEdit/directives/virEdit.js":4,"./modules/vlocityIntelligenceResourceEdit/templates/templates.js":5}],2:[function(require,module,exports){
/* globals moment */
'use strict';
angular.module('vlocityIntelligenceResourceEdit')
    .controller('vlocityIntelligenceResource', function(VqResource, fieldMetadata, _, remoteActions, $window, fieldSetMetadata, $q, sobjects, actions, $filter, $scope) {
        var effectiveDateField, targetObjectKeyField, targetObjectTypeField, me;
        me = this;

        this.resource = VqResource;
        this.ns = fileNsPrefix();
        this.fields = fieldMetadata.VqResource;
        this.visibleFields = fieldSetMetadata.VqResource;
        effectiveDateField = this.fields[fileNsPrefix() + 'EffectiveDate__c'];
        effectiveDateField.customValidator = function(modelValue, viewValue, parentObject) {
            var expirationDate = parentObject && parentObject[fileNsPrefix() + 'ExpirationDate__c'];

            // ensure effective date is before expirationdate
            if (expirationDate && modelValue && moment(modelValue).isSameOrAfter(expirationDate)) {
                return $q.reject('Invalid');
            }
            return $q.when(true);
        };

        effectiveDateField.customValidatorMessage = effectiveDateField.label + ' must be before ' + this.fields[fileNsPrefix() + 'ExpirationDate__c'].label;
        effectiveDateField.dependsOn = fileNsPrefix() + 'ExpirationDate__c';

        // since 90% of the time TargetObjectType is Action, we'll default TargetObjectKey to be a PICKLIST of SObjects
        targetObjectTypeField = this.fields[fileNsPrefix() + 'TargetObjectType__c'];
        targetObjectKeyField = this.fields[fileNsPrefix() + 'TargetObjectKey__c'];
        targetObjectTypeField.customValidator = function(modelValue) {
            if (modelValue === 'VlocityAction') {
                targetObjectKeyField.type = 'PICKLIST';
            } else {
                targetObjectKeyField.type = 'STRING';
            }
            return $q.when(true);
        };
        targetObjectKeyField.picklistValues = sobjects.concat(actions).map(function(sobject) {
            return {
                isDefaultValue: false,
                isActive: true,
                value: sobject.Name,
                label: sobject.Label
            };
        });
        targetObjectKeyField.picklistValues = $filter('orderBy')(targetObjectKeyField.picklistValues, '+label');
        this.activeTab = 0;

        $scope.$watch(function() {
            return me.resource[me.ns + 'DataSourceType__c'];
        }, function(datasourceType) {
            if (datasourceType === 'Query') {
                me.activeTab = 1;
            }
        });

        this.buttons = [
            {
                type: 'edit',
                handleSave: function(resource) {
                    var safeJson = angular.fromJson(angular.toJson(resource));
                    safeJson[fileNsPrefix() + 'EffectiveDate__c'] = Date.parse(safeJson[fileNsPrefix() + 'EffectiveDate__c']) || undefined;
                    safeJson[fileNsPrefix() + 'ExpirationDate__c'] = Date.parse(safeJson[fileNsPrefix() + 'ExpirationDate__c']) || undefined;
                    safeJson[fileNsPrefix() + 'ActivityData__c'] = Date.parse(safeJson[fileNsPrefix() + 'ActivityData__c']) || undefined;
                    safeJson.Owner = undefined;
                    return remoteActions.saveResource(safeJson)
                            .then(function(updatedResource) {
                                var newUrl;
                                if (!resource.Id) {
                                    newUrl = '/apex/' + fileNsPrefix() + window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) +
                                                ($window.location.search.length === 0 ? '?' :
                                                $window.location.search + '&') + 'id=' + updatedResource.Id;
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
                                _.assign(resource, updatedResource);
                            });
                }
            },{
                type: 'export'
            }];

        if (typeof sforce !== 'undefined') {
            if (sforce.console && sforce.console.isInConsole()) {
                sforce.console.setTabTitle(VqResource.Name || 'New Intelligence Resource');
                sforce.console.setTabIcon('custom:custom57');
            }
        }

    });

},{}],3:[function(require,module,exports){
angular
  .module("vlocityIntelligenceResourceEdit")
  .directive("virActivity", function(
    remoteActions,
    $timeout,
    $sldsDeletePrompt,
    $sldsToast,
    $localizable,
    $q
  ) {
    return {
      restrict: "ACE",
      bindToController: {
        resource: "="
      },
      scope: {},
      templateUrl: "virActivity.tpl.html",
      controllerAs: "ctrl",
      controller: function($scope, fieldMetadata, $element, $rootScope) {
        var self = this;
        this.ns = fileNsPrefix();

        function loadAndInjectLightning() {
          var prefix = fileNsPrefix().replace("__", "");
          if (!self.resource.Id) {
            $timeout(loadAndInjectLightning, 1000);
            return;
          }
          self.$$loading = true;
          // need nested timeout to have older DOM element removed :( Lightning needs a destroy api
          $timeout(function() {
            $Lightning.use(prefix + ":ltngOutVF", function() {
              $timeout(function() {
                // skip adding it if we don't have the DOM element.
                // this happens when the datasource of the resource is set to Query
                if (!document.getElementById(self.resource.Id + "-profiler")) {
                  return;
                }
                $Lightning.createComponent(
                  prefix + ":profileTopLevelContainerView",
                  {
                    entityId: self.resource.Id,
                    applicableSubTypes: [
                      "Profile Attribute",
                      "Product Attribute"
                    ],
                    ignoreApplicableTypes: true
                  },
                  self.resource.Id + "-profiler",
                  function(cmp) {
                    $scope.$evalAsync(function() {
                      self.$$loading = false;
                    });
                  }
                );
              });
            });
            $Lightning.use(prefix + ":ltngOutVF", function() {
              $timeout(function() {
                $Lightning.createComponent(
                  prefix + ":profileTopLevelContainerView",
                  {
                    entityId: self.resource.Id,
                    applicableSubTypes: [
                      "Profile Attribute",
                      "Product Attribute"
                    ],
                    ignoreApplicableTypes: true
                  },
                  self.resource.Id + "-profiler-activity",
                  function(cmp) {
                    $scope.$evalAsync(function() {
                      self.$$loading = false;
                    });
                  }
                );
              });
            });
          });
        }

        var dereg = $scope.$watch("ctrl.resource.Id", function(id) {
          if (id) {
            loadAndInjectLightning();
            var activityData =
              self.resource[fileNsPrefix() + "ActivityData__c"];
            if (angular.isObject(activityData)) {
              self.attributeDefinitions = {};
              remoteActions
                .getAttributesForAttributeCode(Object.keys(activityData))
                .then(function(attributes) {
                  self.attributeDefinitions = attributes.reduce(function(
                    map,
                    attr
                  ) {
                    if (
                      !map[attr[fileNsPrefix() + "AttributeCategoryName__c"]]
                    ) {
                      map[
                        attr[fileNsPrefix() + "AttributeCategoryName__c"]
                      ] = [];
                    }
                    map[attr[fileNsPrefix() + "AttributeCategoryName__c"]].push(
                      attr
                    );
                    return map;
                  },
                  {});
                  if (Object.keys(self.attributeDefinitions).length === 0) {
                    self.attributeDefinitions = null;
                  }
                });
              self.maxValue = 0;
              Object.keys(activityData).forEach(function(attrCode) {
                if (activityData[attrCode]) {
                  Object.keys(activityData[attrCode].On).forEach(function(key) {
                    self.maxValue = Math.max(
                      self.maxValue,
                      activityData[attrCode].On[key]
                    );
                  });
                }
              });
            } else if (angular.isString(activityData)) {
              // activityData had error and couldn't be parsed
              self.corruptActivityData = true;
              try {
                JSON.parse(activityData);
              } catch (e) {
                self.corruptActivityDataMessage = e.message;
              }
            }
            dereg();
          }
        });

        this.getBarWidth = function(attribute, field) {
          var activityData = self.resource[fileNsPrefix() + "ActivityData__c"];
          var value =
            activityData[attribute[fileNsPrefix() + "Code__c"]].On[field];
          return (value / self.maxValue) * 100 + "%";
        };
      }
    };
  });

},{}],4:[function(require,module,exports){
angular.module('vlocityIntelligenceResourceEdit')
    .directive('virEdit', function(remoteActions, $timeout, $sldsDeletePrompt, $sldsModal, $sldsToast, $localizable, $q) {

        return {
            restrict: 'ACE',
            bindToController: {
                resource: '=',
            },
            scope: {},
            templateUrl: 'virEdit.tpl.html',
            controllerAs: 'ctrl',
            controller: function($scope, fieldMetadata, $element, $rootScope) {
                var self = this;
                this.ns = fileNsPrefix();

                self.form = [
                    [fileNsPrefix() + 'Headline__c'],
                    [fileNsPrefix() + 'SubTitle__c'],
                    [fileNsPrefix() + "Description__c"]
                ].reduce(function(array, row) {
                    return array.concat(row.map(function(key) {
                        var field = _.defaults({
                            class: 'slds-size--1-of-' + row.length,
                        }, fieldMetadata.VqResource[key]);
                        return field;
                    }));
                }, []);

                var saveToken = null;
                $scope.$watchGroup(['ctrl.resource.' + fileNsPrefix() + 'Headline__c', 
                                    'ctrl.resource.' + fileNsPrefix() + 'SubTitle__c',
                                    'ctrl.resource.' + fileNsPrefix() + 'Description__c'], function() {
                    if (self.resource && self.resource.Id) {
                        if (saveToken) {
                            $timeout.cancel(saveToken);
                        }
                        var jsonString = angular.toJson(self.resource);
                        if (self.resource.$$originalJSON !== jsonString) {
                            saveToken = $timeout(function() {
                                self.resource.$$saving = true;
                                var capturedSaveToken = saveToken;
                                var safeJson = JSON.parse(jsonString);
                                safeJson[fileNsPrefix() + 'EffectiveDate__c'] = Date.parse(safeJson[fileNsPrefix() + 'EffectiveDate__c']) || undefined;
                                safeJson[fileNsPrefix() + 'ExpirationDate__c'] = Date.parse(safeJson[fileNsPrefix() + 'ExpirationDate__c']) || undefined;
                                safeJson[fileNsPrefix() + 'ActivityData__c'] = Date.parse(safeJson[fileNsPrefix() + 'ActivityData__c']) || undefined;
                                remoteActions.saveResource(safeJson)
                                    .then(function(resource) {
                                        _.assign(self.resource, resource);
                                        self.resource.$$saving = false;
                                        self.resource.$$originalJSON = angular.toJson(self.resource);
                                    }).catch(function(error) {
                                        console.log(error);
                                        self.resource.$$saving = false;
                                        self.resource.$$error = error;
                                        $localizable("CouldNotSave", "{1} could not be saved.", self.resource.Name)
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


                $scope.$watch('ctrl.resource.Id', function(id) {
                    if (id) {
                        self.resource.$$loading = true;
                        remoteActions.getAttachments(self.resource.Id)
                            .then(function(attachments) {
                                self.resource.$$loading = false;
                                self.resource.$$attachments = attachments;
                            }).catch(function(error) {
                                self.resource.$$loading = false;
                                self.resource.$$error = error;
                                $localizable("CouldNotLoad", "{1} could not be loaded.", self.resource.Name)
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

                this.editAttachment = function(attachment, isNew) {
                    var modalScope = $scope.$new();
                    var $modal;
                    modalScope.cancel = function() {
                        modalScope.editInstance = null;
                        $modal.hide();
                    };
                    modalScope.save = function() {
                        if (this.instanceForm.$valid) {
                            attachment.$$saving = modalScope.saving = true;
                            Object.keys(modalScope.editInstance).forEach(function(key) {
                                attachment[key] = modalScope.editInstance[key];
                            });
                            // wrap in timeout so Angular $digest can update UI to show saving spinners
                            $timeout(function() {
                                var save = remoteActions.saveAttachment(JSON.parse(angular.toJson(attachment)), attachment.$$file ? attachment.$$file.replace(/^data:.*\/.*;base64,/, '') : null)
                                    .then(function(response) {
                                        _.assign(attachment, response);
                                        attachment.$$saving = modalScope.saving = false;
                                        modalScope.editInstance = null;
                                        if (isNew) {
                                            self.resource.$$attachments.push(attachment);
                                        }
                                        $modal.hide();
                                        return $localizable('SavedToastTitle', '{1} "{2}" was saved.', 'Attachment', attachment.Name);
                                    }).then(function(toastTitle) {
                                        $sldsToast({
                                            severity: 'success',
                                            title: toastTitle,
                                            icon: 'success'
                                        });
                                    }).catch(function(error) {
                                        console.log(error);
                                        attachment.$$saving = modalScope.saving = false;
                                        attachment.$$error = error;
                                        $localizable("CouldNotSave", "{1} could not be saved.", attachment.Name)
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
                            });
                        }
                    };
                    modalScope.editInstance = angular.copy(attachment);
                    $localizable('SldsEditRecordTitle', 'Edit {1}', attachment.Name)
                        .then(function(title) {
                            $modal = $sldsModal({
                                title: title,
                                backdrop: 'static',
                                templateUrl: 'virEditAttachmentModal.tpl.html',
                                scope: modalScope,
                                show: true
                            });
                        })
                    
                };

                this.deleteAttachment = function(attachment, $index) {
                    $sldsDeletePrompt(attachment, function() {
                        var promise = $q.when(attachment);
                        if (attachment.Id) {
                            promise = remoteActions.deleteAttachment(JSON.parse(angular.toJson(attachment)));
                        }
                        promise.then(function() {
                            self.resource.$$attachments.splice($index, 1);
                        });
                        return promise;
                    });    
                }

                $scope.$watch('ctrl.newAttachmentFile', function(newAttachmentFile) {
                    if (newAttachmentFile) {
                        $timeout(function() {
                            self.editAttachment({
                                Name: self.newAttachmentName,
                                $$file: newAttachmentFile,
                                ParentId: self.resource.Id,
                                ContentType: self.newAttachmentType
                            }, true);
                            self.newAttachmentName = null;
                            self.newAttachmentFile = null;
                        });
                    }
                })
            }
        };
    });
},{}],5:[function(require,module,exports){
angular.module("vlocityIntelligenceResourceEdit").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("virEditAttachmentModal.tpl.html",'<div role="dialog" tabindex="-1" class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <h2 class="slds-text-heading--medium" ng-bind="title"></h2>\n        </div>\n        <div class="slds-modal__content slds-p-around--medium">\n            <form class="slds-form--stacked" name="instanceForm">\n                <div class="slds-form-element">\n                    <label class="slds-form-element__label" for="text-input-01">Name</label>\n                    <div class="slds-form-element__control">\n                        <input class="slds-input" type="text" ng-model="editInstance.Name" ng-disabled="saving"/>\n                    </div>\n                </div>\n                <div class="slds-form-element">\n                    <span class="slds-form-element__label" id="file-selector-id">Image</span>\n                    <figure class="slds-image slds-image--card">\n                        <a href="javascript:void(0);" class="slds-image__crop slds-image__crop--16-by-9">\n                            <img ng-attr-alt="{{editInstance.Name}}" ng-src="/servlet/servlet.FileDownload?file={{editInstance.Id}}" ng-if="editInstance.Id && !editInstance.$$file" />\n                            <img ng-attr-alt="{{editInstance.Name}}" ng-src="{{editInstance.$$file}}" ng-if="!editInstance.Id || editInstance.$$file" />\n                        </a>\n                        <figcaption class="slds-image__title slds-image__title--card">\n                            <span class="slds-icon_container slds-m-right--x-small" title="image">\n                                <slds-svg-icon sprite="\'doctype\'" icon="\'image\'" size="\'x-small\'"></slds-svg-icon>\n                                <span class="slds-assistive-text">image</span>\n                            </span>\n                            <span class="slds-image__text slds-truncate" ng-attr-title="{{editInstance.Name}}">{{editInstance.Name}}</span>\n                        </figcaption> \n                    </figure>\n                </div>\n                <div class="slds-form-element">\n                    <span class="slds-form-element__label" id="file-selector-id">Upload New Image</span>\n                    <div class="slds-form-element__control">\n                        <div class="slds-file-selector slds-file-selector--files">\n                            <div class="slds-file-selector__dropzone">\n                                <input type="file" class="slds-file-selector__input slds-assistive-text" ng-model="editInstance.$$file" app-filereader="true"\n                                id="edit-modal-file-attachment-upload" aria-describedby="file-selector-id" filename="" \n                                filetype="editInstance.ContentType" read-as="data-url" ng-disabled="saving"/>\n                                <label class="slds-file-selector__body" for="edit-modal-file-attachment-upload">\n                                    <span class="slds-file-selector__button slds-button slds-button--neutral">\n                                        <slds-button-svg-icon sprite="\'utility\'" icon="\'upload\'" extra-classes="\'slds-button__icon--left\'"></slds-button-svg-icon>Upload new image</span>\n                                        <span class="slds-file-selector__text slds-medium-show">or Drop a File</span>\n                                    </label>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </form>\n        </div>\n        <div class="slds-modal__footer">\n            <button class="slds-button slds-button--neutral" ng-click="cancel()" ng-disabled="saving">{{::$root.vlocity.getCustomLabel(\'Cancel\', \'Cancel\')}}</button>\n            <button class="slds-button slds-button--brand" ng-click="!saving && save()" ng-disabled="!editInstance.Name"> <span ng-if="!saving">{{::$root.vlocity.getCustomLabel(\'Save\', \'Save\')}}</span><slds-button-svg-icon sprite="\'utility\'" icon="\'spinner\'" ng-if="saving"></slds-button-svg-icon></button>\n        </div>\n    </div>\n</div>'),$templateCache.put("virActivity.tpl.html",'<div class="slds-col slds-grid slds-grid--vertical-stretch slds-grid--pull-padded">\n    <div class="slds-col slds-size--1-of-3 slds-grid slds-p-horizontal--small slds-grid--vertical slds-grid--vertical-stretch">\n        <div class="slds-panel__section slds-has-divider--bottom slds-grid" >\n            <div class="slds-col slds-media slds-media--center slds-has-flexi-truncate">\n                <div class="slds-media__body slds-truncate">\n                    <p class="slds-truncate slds-text-heading--small">Training Attributes</p>\n                </div>\n            </div>\n            <div class="slds-no-flex" style="margin-top: -8px;">\n                <div class="slds-icon_container" ng-if="ctrl.resource.$$saving">\n                    <slds-svg-icon sprite="\'utility\'" icon="\'spinner\'" size="\'small\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                </div>\n            </div>\n        </div>\n        <div class="slds-col" style="position:relative">\n            <div class="slds-spinner_container" ng-if="ctrl.$$loading">\n                <div class="slds-spinner--brand slds-spinner slds-spinner--medium" role="alert">\n                    <span class="slds-assistive-text">Loading</span>\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n            <div class="slds-scrollable--y slds-p-bottom--xx-large">\n                <div ng-attr-id="{{ctrl.resource.Id}}-profiler-activity"></div>\n            </div>\n        </div>\n    </div>\n    <div class="slds-col slds-size--2-of-3 slds-p-horizontal--small slds-border--left slds-grid slds-grid--vertical slds-grid--vertical-stretch">\n        <div class="slds-panel__section slds-has-divider--bottom slds-grid">\n            <div class="slds-col slds-media slds-media--center slds-has-flexi-truncate">\n                <div class="slds-media__body slds-truncate">\n                    <p class="slds-truncate slds-text-heading--small">Observed Attributes</p>\n                </div>\n            </div>\n            <div class="slds-no-flex slds-grid slds-grid--vertical-align-center" style="margin-top: -8px;">\n                <div class="slds-p-left--small slds-icon_container">\n                    <slds-svg-icon sprite="\'utility\'" icon="\'stop\'" size="\'small\'" style="fill:#1589ee;"></slds-svg-icon>\n                </div>\n                <p>Viewed</p>\n                <div class="slds-p-left--small slds-icon_container">\n                    <slds-svg-icon sprite="\'utility\'" icon="\'stop\'" size="\'small\'" style="fill:#028048;"></slds-svg-icon>\n                </div>\n                <p>Accepted</p>\n                <div class="slds-p-left--small slds-icon_container">\n                    <slds-svg-icon sprite="\'utility\'" icon="\'stop\'" size="\'small\'" style="fill:#c23934;"></slds-svg-icon>\n                </div>\n                <p>Rejected</p>\n                <div class="slds-p-left--small slds-icon_container" ng-if="ctrl.resource.$$saving">\n                    <slds-svg-icon sprite="\'utility\'" icon="\'spinner\'" size="\'small\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                </div>\n            </div>\n        </div>\n        <div class="slds-col" ng-class="{\'slds-align--absolute-center\': !ctrl.attributeDefinitions}">\n            <h2 ng-if="!ctrl.attributeDefinitions && !ctrl.corruptActivityData" class="slds-text-heading--large">No activity data available</h2>\n            <h2 ng-if="!ctrl.attributeDefinitions && ctrl.corruptActivityData" class="slds-text-align--center slds-text-heading--large slds-text-color--error">\n                Corrupt Activity Data: <br/>\n                {{ctrl.corruptActivityDataMessage}}\n            </h2>\n            <div ng-repeat="(categoryname, attrs) in ctrl.attributeDefinitions" ng-if="ctrl.attributeDefinitions">\n                <h4 class="slds-section-title--divider slds-p-bottom--small" ng-bind="categoryname"></h4>\n                <div class="slds-grid slds-wrap slds-p-around--large">\n                    <div class="slds-size--1-of-5 slds-p-bottom--small" ng-repeat-start="attr in attrs">\n                        <span class="slds-badge" ng-bind="attr.Name"></span>\n                    </div>\n                    <div class="slds-size--4-of-5 slds-p-bottom--small slds-p-left--small" ng-repeat-end>\n                        <div ng-style="{\'width\': ctrl.getBarWidth(attr, \'View\') }" style="height: 10px;background: #1589ee; margin-bottom: 1px; cursor: pointer" ng-attr-title="Viewed: {{ctrl.resource[ctrl.ns + \'ActivityData__c\'][attr[ctrl.ns + \'Code__c\']].On.View}}"></div>\n                        <div ng-style="{\'width\': ctrl.getBarWidth(attr, \'Accept\')}" style="height: 10px;background: #028048; margin-bottom: 1px; cursor: pointer" ng-attr-title="Accepted: {{ctrl.resource[ctrl.ns + \'ActivityData__c\'][attr[ctrl.ns + \'Code__c\']].On.Accept}}"></div>\n                        <div ng-style="{\'width\': ctrl.getBarWidth(attr, \'Reject\')}" style="height: 10px;background: #c23934; margin-bottom: 1px; cursor: pointer" ng-attr-title="Rejected: {{ctrl.resource[ctrl.ns + \'ActivityData__c\'][attr[ctrl.ns + \'Code__c\']].On.Reject}}"></div>\n                    </div>\n                <div>\n            </div>\n        </div>\n    </div>\n</div>'),$templateCache.put("virEdit.tpl.html",'<div class="slds-col slds-grid slds-grid--vertical-stretch slds-grid--pull-padded">\n    <div class="slds-col slds-size--2-of-3 slds-p-horizontal--small slds-scrollable--y" ng-if="ctrl.resource.Id">\n        <div class="slds-panel__section slds-has-divider--bottom">\n            <div class="slds-col slds-media slds-media--center slds-has-flexi-truncate">\n                <div class="slds-media__body slds-truncate">\n                    <p class="slds-truncate slds-text-heading--small">Text</p>\n                </div>\n            </div>\n        </div>\n        <div class="slds-panel__section slds-has-divider--bottom">\n            <div class="slds-grid slds-wrap slds-grid--pull-padded">\n                <div class="slds-p-horizontal--small slds-p-bottom--small {{field.class}}" ng-repeat="field in ctrl.form">\n                    <slds-form-element field="field" model="ctrl.resource[field.name]" form-element-id="resource.name" ng-disabled="ctrl.resource.$$deleting"></slds-form-element>\n                </div>\n            </div>\n        </div>\n        <div class="slds-panel__section slds-has-divider--bottom">\n            <div class="slds-col slds-media slds-media--center slds-has-flexi-truncate">\n                <div class="slds-media__body slds-truncate">\n                    <p class="slds-truncate slds-text-heading--small">Images</p>\n                </div>\n            </div>\n        </div>\n        <div class="slds-panel__section">\n            <div class="slds-grid slds-wrap slds-grid--pull-padded">\n                <div class="slds-p-horizontal--small slds-p-bottom--small slds-size--1-of-1">\n                    <ul class="slds-grid slds-grid--pull-padded slds-wrap">\n                        <li class="slds-p-horizontal--small slds-p-bottom--small slds-size--1-of-3" ng-repeat="attachment in ctrl.resource.$$attachments">\n                            <figure class="slds-image slds-image--card">\n                                <a href="javascript:void(0);" class="slds-image__crop slds-image__crop--16-by-9" ng-click="ctrl.editAttachment(attachment)">\n                                    <img ng-attr-alt="{{attachment.Name}}" ng-src="/servlet/servlet.FileDownload?file={{attachment.Id + \'&_cb=\' + attachment.LastModifiedDate}}" />\n                                </a>\n                                <div class="slds-button-group slds-image__actions" role="group">\n                                    <button class="slds-button slds-button--icon-border-filled" title="Edit" ng-click="ctrl.editAttachment(attachment)">\n                                        <slds-button-svg-icon sprite="\'utility\'" icon="\'edit\'"></slds-button-svg-icon>\n                                        <span class="slds-assistive-text">Edit</span>\n                                    </button>\n                                    <button class="slds-button slds-button--icon-border-filled" title="Delete" ng-click="ctrl.deleteAttachment(attachment, $index)">\n                                        <slds-button-svg-icon sprite="\'utility\'" icon="\'delete\'"></slds-button-svg-icon>\n                                        <span class="slds-assistive-text">Delete</span>\n                                    </button>\n                                </div>\n                                <figcaption class="slds-image__title slds-image__title--card">\n                                    <span class="slds-icon_container slds-m-right--x-small" title="image">\n                                    <slds-svg-icon sprite="\'doctype\'" icon="\'image\'" size="\'x-small\'"></slds-svg-icon>\n                                    <span class="slds-assistive-text">image</span>\n                                    </span>\n                                    <span class="slds-image__text slds-truncate" ng-attr-title="{{attachment.Name}}">{{attachment.Name}}</span>\n                                </figcaption>\n                            </figure>\n                        </li>\n                        <li class="slds-p-horizontal--small slds-size-1-of-3 slds-medium-size--1-of-3" style="position:relative" ng-if="ctrl.resource.$$loading">\n                            <div class="slds-col slds-spinner_container" ng-if="ctrl.$$loading">\n                                <div class="slds-spinner slds-spinner--small" role="alert">\n                                    <span class="slds-assistive-text">Loading</span>\n                                    <div class="slds-spinner__dot-a"></div>\n                                    <div class="slds-spinner__dot-b"></div>\n                                </div>\n                            </div>\n                        </li>\n                    </ul>\n                    <div class="slds-form-element">\n                        <span class="slds-form-element__label" id="file-selector-id">Add Image</span>\n                        <div class="slds-form-element__control">\n                            <div class="slds-file-selector slds-file-selector--files">\n                            <div class="slds-file-selector__dropzone">\n                                <input type="file" ng-model="ctrl.newAttachmentFile" app-filereader="true" \n                                        filename="ctrl.newAttachmentName" \n                                        filetype="ctrl.newAttachmentType"\n                                        drag-drop-element-selector=".slds-file-selector__dropzone"\n                                        class="slds-file-selector__input slds-assistive-text" \n                                        read-as="data-url" id="new-image-attachment-upload"/>\n                                <label class="slds-file-selector__body" for="new-image-attachment-upload">\n                                <span class="slds-file-selector__button slds-button slds-button--neutral">\n                                    <slds-button-svg-icon sprite="\'utility\'" icon="\'upload\'" extra-classes="\'slds-button__icon--left\'"></slds-button-svg-icon>\n                                    Upload Image</span>\n                                    <span class="slds-file-selector__text slds-medium-show">or Drop Image</span>\n                                </label>\n                            </div> \n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class="slds-col slds-size--1-of-3 slds-p-horizontal--small slds-border--left slds-grid slds-grid--vertical slds-grid--vertical-stretch">\n        <div class="slds-panel__section slds-has-divider--bottom slds-grid" >\n            <div class="slds-col slds-media slds-media--center slds-has-flexi-truncate">\n                <div class="slds-media__body slds-truncate">\n                    <p class="slds-truncate slds-text-heading--small">Training Attributes</p>\n                </div>\n            </div>\n            <div class="slds-no-flex" style="margin-top: -8px;">\n                <div class="slds-icon_container" ng-if="ctrl.resource.$$saving">\n                    <slds-svg-icon sprite="\'utility\'" icon="\'spinner\'" size="\'small\'" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n                </div>\n            </div>\n        </div>\n        <div class="slds-col" style="position:relative">\n            <div class="slds-spinner_container" ng-if="ctrl.$$loading">\n                <div class="slds-spinner--brand slds-spinner slds-spinner--medium" role="alert">\n                    <span class="slds-assistive-text">Loading</span>\n                    <div class="slds-spinner__dot-a"></div>\n                    <div class="slds-spinner__dot-b"></div>\n                </div>\n            </div>\n            <div class="slds-scrollable--y slds-p-bottom--xx-large">\n                <div ng-attr-id="{{ctrl.resource.Id}}-profiler"></div>\n            </div>\n        </div>\n    </div>\n</div>')}]);

},{}]},{},[1]);
})();

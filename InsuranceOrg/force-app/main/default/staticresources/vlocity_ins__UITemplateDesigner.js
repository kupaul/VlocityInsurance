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

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
angular.module('templatedesigner', ['vlocity', 'viaDirectives', 'ngTable', 'mgcrea.ngStrap',
                                    'ngSanitize', 'ui.ace'])
  .constant('BASE_TEMPLATE_AUTHOR', 'Vlocity')
  .config(['remoteActionsProvider', function(remoteActionsProvider) {
      'use strict';
      var actions = ['getTemplates', 'getTemplate', 'getTemplateTypes', 'getTemplateByName', 'saveTemplate', 'getSassMixins',
                       'isInsidePckg'];
      var config = actions.reduce(function(config, action) {
            config[action] = {
                action: fileNsPrefixDot() + 'TemplateController.' + action,
                config: {escape: false}
            };
            return config;
        }, {});
      remoteActionsProvider.setRemoteActions(config);
  }]).config(function($locationProvider) {
      'use strict';
      $locationProvider.html5Mode({
          enabled: !!(window.history && history.pushState),
          requireBase: false
      });
  }).config(['$compileProvider', function ($compileProvider) {
      'use strict';
      $compileProvider.debugInfoEnabled(false);
  }]).config(['$localizableProvider', function($localizableProvider) {
      'use strict';
      $localizableProvider.setLocalizedMap(window.i18n);
      $localizableProvider.setDebugMode(window.ns === '');
      $localizableProvider.setSyncModeOnly();
  }]).value('fileNsPrefix', fileNsPrefix);

require('./modules/templatedesigner/controller/TemplateListController.js');
require('./modules/templatedesigner/controller/TemplateDesignerController.js');
require('./modules/templatedesigner/controller/TemplatePropertiesController.js');
require('./modules/templatedesigner/controller/EditorController.js');
require('./modules/templatedesigner/controller/TabController.js');

require('./modules/templatedesigner/factory/Save.js');
require('./modules/templatedesigner/factory/SampleJson.js');

require('./modules/templatedesigner/templates/templates.js');

},{"./modules/templatedesigner/controller/EditorController.js":2,"./modules/templatedesigner/controller/TabController.js":3,"./modules/templatedesigner/controller/TemplateDesignerController.js":4,"./modules/templatedesigner/controller/TemplateListController.js":5,"./modules/templatedesigner/controller/TemplatePropertiesController.js":6,"./modules/templatedesigner/factory/SampleJson.js":7,"./modules/templatedesigner/factory/Save.js":8,"./modules/templatedesigner/templates/templates.js":9,"./polyfills/Array.find.js":10,"./polyfills/Array.findIndex.js":11}],2:[function(require,module,exports){
angular.module('templatedesigner')
  .controller('editorController', ['$scope', '$timeout', '$modal', function($scope, $timeout, $modal) {
    'use strict';
    var cssEditor = null,
        jsEditor = null,
        htmlEditor = null;

    //initial state
    $scope.showHTML = true;
    $scope.showCSS = true;
    $scope.showJS = false;

    $scope.helpNodeText = function (helpNode) {
        var modalScope = $scope.$new();
        modalScope.helpNode = helpNode ? helpNode + 'HelpNode.tpl.html': '';

        $modal({
            backdrop: 'static',
            scope: modalScope,
            templateUrl: 'helpModal.tpl.html',
            show: true
        });
    };

    $scope.aceLoaded = function(_editor){
      cssEditor = _editor;
    };

    $scope.aceHTMLLoaded = function(_editor){
      htmlEditor = _editor;
    };

    $scope.aceJSLoaded = function(_editor){
      jsEditor = _editor;
    };

    $scope.toggleEditor = function(editorToggle) {
      console.log(editorToggle);
      $scope[editorToggle] = !$scope[editorToggle];
      $timeout(function() {
        $scope.$broadcast('template.resize.editors');
      }, 300);
    };

    $scope.$on('template.resize.editors', function (){
      console.log('resizing editors ',cssEditor,htmlEditor,jsEditor);
      if (cssEditor) {
        cssEditor.resize();
      }

      if (htmlEditor) {
        htmlEditor.resize();
      }

      if (jsEditor) {
        jsEditor.resize();
      }
    });

    $scope.$watch('template.errors', function(errorArray) {
      if (errorArray && errorArray.length > 0 && /Sass__c/.test(errorArray[0].property)) {
        var errorMessage = errorArray[0].message;
        cssEditor.getSession().setAnnotations([{
          row: errorMessage.line - 1,
          column: errorMessage.column,
          text: errorMessage.message,
          type: 'error' // also warning and information
        }]);
      } else if (cssEditor) {
        cssEditor.getSession().setAnnotations();
      }
    });

  }]);

},{}],3:[function(require,module,exports){
angular.module('templatedesigner')
  	.controller('tabController', function($rootScope, $scope, $timeout, interTabMsgBus, $localizable, fileNsPrefix) {
      	'use strict';
      	var triggeredReload = false;
      	var needsReload = true;

      	$scope.tabs = [{title: $localizable('DesCode', 'Code'), content: ''}];
      	$scope.tabs.activeTab = 0;
      	$scope.currentScriptElementInPreview = null;
      	$scope.viewModel = {};

        var iframeConfig = {
            log: false,
            checkOrigin: false,
            scrolling: 'auto',
            heightCalculationMethod: 'lowestElement'
        };

      	$scope.$watch('template.Id', function(id) {
          console.log('changed id ',id);
          	if (id && $scope.tabs.length < 2) {
              	$scope.tabs.push({
                  	title: $localizable('DesTabPreview', 'Preview'),
                  	content: ''
              	});
          	}
          	//load preview every time Id changes
          	loadPreviewPage();
      	});

      	$rootScope.$on('saved', function() {
            needsReload = true;
            if ($scope.tabs.activeTab === 1 || ($scope.newwindow && $scope.newwindow.closed === false)) {
                loadPreviewPage();
            }
        });

      	$rootScope.$on('loadTemplate', function(template) {
          	needsReload = true;
          	if ($scope.tabs.activeTab === 1 || ($scope.newwindow && $scope.newwindow.closed === false)) {
              	loadPreviewPage();
          	}
      	});

      	function loadPreviewPage() {
            $scope.$evalAsync(function() {
                var pageUrl;
                if(!($rootScope.template && $rootScope.template.Id)) {
                  return;
                }
                pageUrl = '/apex/' + fileNsPrefix() + 'TemplatePreview?templateId=' + $rootScope.template.Id;

                if ($scope.newwindow && $scope.newwindow.closed === false) {
                    $scope.newwindow.location.href = pageUrl;
                }
                triggeredReload = true;
                var element = $('.iframe-holder');
                var extraParams = {};
                element[0].innerHTML = '<iframe src="' + pageUrl + '" style="border: 0"></iframe>';
                needsReload = false;
                var iFrames = $('.iframe-holder iframe');
                iFrameResize(iframeConfig, iFrames[0]);
                var timer = null;
                iFrames.on('load', function() {
                    var localDoc = this.contentWindow.document,
                        lastHeight = localDoc.documentElement.offsetHeight,
                        iframe = this;
                    if (timer) {
                        clearInterval(timer);
                    }
                    // handle reload of page with prep'd data to use
                    timer = setInterval(function() {
                        iframe.style.width = '100%';
                    }, 500);
                });
            });
        }

      	$scope.$watch('tabs.activeTab', function(newValue) {
            if (newValue === 1 && $rootScope.template.Id) {
                if (needsReload) {
                    loadPreviewPage();
                }
                $rootScope.collapsePalette = true;
            } else {
                $rootScope.collapsePalette = $rootScope.fullScreen = false;
            }
        });

      	$scope.$watch('previewMode', function(newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                loadPreviewPage();
            }
        });

      	interTabMsgBus.on('layoutPreviewJson', function(newJson, oldJson) {
            if (!triggeredReload || !oldJson) {
                $timeout(function() {
                    if (angular.isString(newJson)) {
                        newJson = JSON.stringify(JSON.parse(newJson), null, 2);
                    }
                    $scope.$apply(function() {
                        $scope.viewModel.testJSON = newJson;
                    });
                });
            } else {
                interTabMsgBus.set('layoutPreviewJson', oldJson + ' ');
            }
            triggeredReload = false;
        });

      	$scope.reload = function() {
            needsReload = true;
            loadPreviewPage();
        };

      	$scope.popOut = function() {
            var pageUrl = '/apex/' + fileNsPrefix() + 'TemplatePreview?templateId=' + $rootScope.template.Id;
            $scope.newwindow = window.open(pageUrl, 'name', 'menubar=true,resizable=true,scrollbars=true,toolbar=true,status=true');
            if (window.focus) {
                $scope.newwindow.focus();
            }
            return false;
        };

      	// clear old localStorage values
      	interTabMsgBus.delete('layoutPreviewJson');
  });

},{}],4:[function(require,module,exports){
angular.module('templatedesigner')
  .controller('templateDesignerController', function($q, $scope, $rootScope, $timeout, $localizable, $interpolate,
                                                      remoteActions, htmlUnescapeFilter, fileNsPrefix , $window, $modal, save,
                                                      sampleJSON, $alert, BASE_TEMPLATE_AUTHOR) {
      'use strict';
      $rootScope.nsPrefix = fileNsPrefix();
      $rootScope.isInConsole = sforce && sforce.console && sforce.console.isInConsole();

      var templateId = window.location ? window.location.href.split(/[?&]/).find(function(item) {
        return /^id\=/.test(item);
    }) : null;
      var templateName = window.location ? window.location.href.split(/[?&]/).find(function(item) {
        return /^name\=/.test(item);
    }) : null;

      $('.pageDescription').addClass('vlocity').append('&nbsp;<span class="active text-success">' +
                                      $localizable('Active', 'Active') + '</span>');

      $scope.disableSaveBtn = false;

      function handleTemplateLoaded(data) {
          var template = data;
          console.log(template);
          if (data) {
              templateId = template.Id;
              $scope.checkIfInsidePckg().then(function(insidePckg) {
                $rootScope.insidePckg = insidePckg;
                $rootScope.locked = insidePckg &&
                    template[fileNsPrefix() + 'Author__c'].trim().toLowerCase() === 'vlocity';
                console.log('locked ' + $rootScope.locked + 'insidePckg ' + $rootScope.insidePckg);
            });
              template[fileNsPrefix() + 'HTML__c'] = htmlUnescapeFilter(template[fileNsPrefix() + 'HTML__c']);
              template[fileNsPrefix() + 'Sass__c'] = htmlUnescapeFilter(template[fileNsPrefix() + 'Sass__c']);
              template[fileNsPrefix() + 'SampleJson__c'] = htmlUnescapeFilter(template[fileNsPrefix() + 'SampleJson__c']);
              if (!template[fileNsPrefix() + 'CSS__c']) {
                  template[fileNsPrefix() + 'CSS__c'] = '';
              }
              template.originalJson = JSON.parse(JSON.stringify(template, null, 2));
              Object.keys(template.originalJson).forEach(function(key) {
                if (/^(CreatedBy|CreatedDate|LastModifiedBy|LastModifiedDate)$/.test(key)) {
                    delete template.originalJson[key];
                }
            });
              $rootScope.template = template;
              if (!$rootScope.template[fileNsPrefix() + 'Version__c'] ||
                      $rootScope.template[fileNsPrefix() + 'Version__c'] === '') {
                  $rootScope.template[fileNsPrefix() + 'Version__c'] = 1.0;
              }
          } else {
              $rootScope.template = {
                'Name': $localizable('NewTemplate')
            };
              $rootScope.template[fileNsPrefix() + 'Version__c'] = 1.0;
              $rootScope.template[fileNsPrefix() + 'Definition__c'] = {Cards: []};
          }
          $rootScope.$broadcast('rootTemplateReady', $rootScope.template);
      }

      function loadTemplate(templateId, templateName) {
          if (templateId) {
              templateId = templateId.replace(/^id=/, '');
              remoteActions.getTemplate(templateId).then(
                handleTemplateLoaded,
              function(error) {
                  console.log('template retrieval error: ' + error);
              });

          } else if (templateName) {
              templateName = templateName.replace(/^name=/, '');
              var latestVersion = 0;
              console.log('getting template by name ',templateName);
              remoteActions.getTemplateByName(templateName).then(
                  handleTemplateLoaded,
                function(error) {
                    console.log('template retrieval error: ' + error);
                });

          } else {
              //$scope.hideAll = true;
              createNewTemplate();
              // Should never get here as the New button on template home would have directed traffic to designer
              // ONLY when there is a successful creation of a new template!!!');
              //console.error('The New button on template home would have directed traffic to a created template');

          }
      }
      loadTemplate(templateId, templateName);

      //Get all layouts
      $q.all([
        remoteActions.getTemplates(),
        remoteActions.getTemplateTypes()
      ]).then(function(results) {
          var templates = results[0];
          $rootScope.templates = []; // this is used by save.js to
          // make sure layout name is unique when user creates new layout
          if (templates) {
              $rootScope.templates = templates;
              $rootScope.templateTypes = [];
              $rootScope.templates.forEach(function(template) {
                  if ($rootScope.templateTypes.indexOf(template[fileNsPrefix() + 'Type__c']) === -1) {
                      $rootScope.templateTypes.push(template[fileNsPrefix() + 'Type__c']);
                  }
              });
          }
      });

      $rootScope.$on('loadTemplate', function(event, template) {
          var existingId = $window.location.href.split(/[?&]/).find(function(item) {
              return /^id\=/.test(item);
          });
          if (existingId) {
              existingId = existingId.replace(/^id=/, '');
          }
          if (!existingId || existingId !== template.Id) {
              if (existingId) {
                  var pathname = $window.location.href.replace(existingId, template.Id);
                  $window.history.pushState('', '', pathname);
              } else {
                  var newUrl = $window.location.pathname +
                              ($window.location.search.length === 0 ? '?' :
                               $window.location.search + '&') + 'id=' + template.Id;
                  $window.history.pushState('','', newUrl);
              }
          }
          $timeout(function() {
              loadTemplate(template.Id);
          });
      });

      $scope.$watch(function() {
            if ($rootScope.template) {
                return [$rootScope.template[fileNsPrefix() + 'SampleJson__c'],
                        $rootScope.template[fileNsPrefix() + 'Type__c'],
                        $rootScope.template.Id];
            } else {
                return [null, null];
            }
        }, function(newValue, oldValue) {
            if ($rootScope.template &&
                ($rootScope.template[fileNsPrefix() + 'SampleJson__c'] == '' ||
                    $rootScope.template[fileNsPrefix() + 'SampleJson__c'] == null) &&
                sampleJSON[$rootScope.template[fileNsPrefix() + 'Type__c']]) {
                $rootScope.template[fileNsPrefix() + 'SampleJson__c'] =
                    JSON.stringify(sampleJSON[$rootScope.template[fileNsPrefix() + 'Type__c']], null, 2);
                $scope.saveCurrentTemplate();
            }
        }, true);

      $scope.$watch('template[nsPrefix + "Active__c"]' , function() {
          if ($rootScope.template && $rootScope.template[fileNsPrefix()  + 'Active__c']) {
              $('.pageDescription .active').css({
                'visibility': 'visible'
            });
          } else {
              $('.pageDescription .active').css({
                'visibility': 'hidden'
            });
          }
      });

      $scope.toggleLeftPanel = function() {
          $rootScope.collapsePalette = !$rootScope.collapsePalette;

          //resize after transition-duration: 0.7s
          $timeout(function() {
              $rootScope.$broadcast('template.resize.editors');
          }, 700);
      };

      $scope.toggleFullScreen = function() {
          $rootScope.fullScreen = !$rootScope.fullScreen;

          //resize after transition-duration: 0.7s
          $timeout(function() {
              $rootScope.$broadcast('template.resize.editors');
          }, 700);
      };

      $scope.saveCurrentTemplate = function() {
          $scope.disableVersionBtn = true;
          $scope.disableCloneBtn = true;
          $scope.disableSaveBtn = true;
          save($rootScope.template).then(function(template) {
            console.log('saved the current template',template);
            $rootScope.template = template;
            $scope.disableCloneBtn = false;
            $scope.disableVersionBtn = false;
            $scope.disableSaveBtn = true;
        });
      };

      $scope.checkIfInsidePckg = function() {
          return remoteActions.isInsidePckg()
            .then(function(insidePckg) {
                $scope.insidePckg = insidePckg;
                console.log(insidePckg);
                return $scope.insidePckg;
            });

      };

      function createNewTemplate() {

          var inputNewTemplateInfoModal;
          var errorMsg;
          var nameErrorAlert, typeErrorAlert, authorErrorAlert;
          var invalidTemplateNameHeader = $localizable('SaveTemplateDialogNameErrorHeader',
                                                          'Template name error: ');
          var invalidTemplateTypeHeader = $localizable('SaveTemplateDialogTypeErrorHeader',
                                                          'Template type error: ');
          var invalidTemplateAuthorHeader = $localizable('SaveTemplateDialogAuthorErrorHeader',
                                                          'Template author error: ');

          inputNewTemplateInfoModal = $modal({
                title: $localizable('TemplateHomeInputNewTemplateInfo', 'Input New Template Info'),
                templateUrl: 'InputNewTemplateInfoModal.tpl.html',
                show: false,
                scope: $scope,
                controller: function($scope, $rootScope) {

                    var isSaveTemplateFieldValid = function(field) {
                        if (!field) {
                            return false;
                        } else {
                            return true;
                        }
                    };

                    var isSaveTemplateNameAuthorUnique = function(userInputName, userInputAuthor) {
                        if ($rootScope.templates.find(function(template) {
                            return template.Name.toLowerCase() === userInputName.toLowerCase() && template[$rootScope.nsPrefix + 'Author__c'].toLowerCase() === userInputAuthor.toLowerCase();
                        })) {
                            return false;
                        }
                        return true;
                    };

                    var isSaveTemplateFieldUsingSpecialCharacters = function(userInputName) {
                        var specialCharacters = /[~`!#$%\^&*+=\[\]\\';,/{}|:<>\?]/;
                        if (specialCharacters.test(userInputName)) {
                            return true;
                        } else {
                            return false;
                        }
                    };

                    var isSaveTemplateUsingBaseTemplateAuthorName = function(userInputAuthor) {
                        if (userInputAuthor.toLowerCase() === BASE_TEMPLATE_AUTHOR.toLowerCase() && $rootScope.insidePckg) {
                            return true;
                        } else {
                            return false;
                        }
                    };

                    var displayErrorAlert = function(errorTitle, errorContent, alertContainer, alert) {
                        if (alert) {
                            // if you don't do this, the screen will display multiple instances
                            // of error messages that occurred for the same entity.
                            alert.destroy();
                        }
                        return $alert({
                            title: errorTitle,
                            content: errorContent,
                            container: alertContainer,
                            type: 'danger',
                            show: true
                        });
                    };

                    $scope.template = {
                        'Name': $localizable('NewTemplate')
                    };

                    // initialize origin / author with the organizatin name
                    $scope.saveTemplateAuthor = orgName;

                    $scope.saveTemplate = function() {

                        $scope.saveTemplateNameInvalid = false;

                        if (!isSaveTemplateFieldValid($scope.saveTemplateName)) {

                            $scope.saveTemplateNameInvalid = true;
                            errorMsg = $localizable('SaveTemplateDialogNameMissingError',
                                                    'You must specify template name!');
                            nameErrorAlert = displayErrorAlert(invalidTemplateNameHeader, errorMsg,
                                                                '#name-alert-container', nameErrorAlert);

                        } else if (isSaveTemplateFieldUsingSpecialCharacters($scope.saveTemplateName)) {

                            $scope.saveTemplateNameInvalid = true;
                            errorMsg = $localizable('SaveTemplateDialogNameHasSpecialCharactersError',
                                                    'Special characters cannot be used in template name!');
                            nameErrorAlert = displayErrorAlert(invalidTemplateNameHeader, errorMsg,
                                                                '#name-alert-container', nameErrorAlert);

                        } else if (!isSaveTemplateNameAuthorUnique($scope.saveTemplateName, $scope.saveTemplateAuthor)) {

                            $scope.saveTemplateNameInvalid = true;
                            errorMsg = $localizable('SaveTemplateDialogError', 'A template with same name and author already exists, try creating a new version.');
                            nameErrorAlert = displayErrorAlert(invalidTemplateNameHeader, errorMsg,
                                                                '#alert-container', nameErrorAlert);

                        }

                        // clear error message from previous "save"
                        if (!$scope.saveTemplateNameInvalid && nameErrorAlert) {
                            nameErrorAlert.destroy();
                        }

                        if (!isSaveTemplateFieldValid($scope.saveTemplateType)) {

                            $scope.saveTemplateTypeInvalid = true;
                            errorMsg = $localizable('SaveTemplateDialogTypeMissingError',
                                                    'You must specify template type!');
                            typeErrorAlert = displayErrorAlert(invalidTemplateTypeHeader, errorMsg,
                                                                '#type-alert-container', typeErrorAlert);

                        } else {
                            $scope.saveTemplateTypeInvalid = false;
                        }

                        // clear error message from previous "save"
                        if (!$scope.saveTemplateTypeInvalid && typeErrorAlert) {
                            typeErrorAlert.destroy();
                        }

                        $scope.saveTemplateAuthorInvalid = false;

                        if (!isSaveTemplateFieldValid($scope.saveTemplateAuthor)) {

                            $scope.saveTemplateAuthorInvalid = true;
                            errorMsg = $localizable('SaveTemplateDialogAuthorMissingError',
                                                                  'You must specify template author!');
                            authorErrorAlert = displayErrorAlert(invalidTemplateAuthorHeader, errorMsg,
                                                                   '#author-alert-container', authorErrorAlert);

                        } else if (isSaveTemplateUsingBaseTemplateAuthorName($scope.saveTemplateAuthor)) {

                            $scope.saveTemplateAuthorInvalid = true;
                            errorMsg = $localizable('SaveTemplateDialogUsingBaseTemplateAuthorNameError',
                                                    'Creating \'Vlocity\' authored template is not allowed.');
                            authorErrorAlert = displayErrorAlert(invalidTemplateAuthorHeader, errorMsg,
                                                                '#author-alert-container', authorErrorAlert);

                        }

                        // clear error message from previous "save"
                        if (!$scope.saveTemplateAuthorInvalid && authorErrorAlert) {
                            authorErrorAlert.destroy();
                        }

                        if ($scope.saveTemplateNameInvalid || $scope.saveTemplateTypeInvalid ||
                            $scope.saveTemplateAuthorInvalid) {
                            return;
                        }

                        var newTemplate = angular.copy($scope.template);
                        newTemplate['Name'] = $scope.saveTemplateName;
                        newTemplate[$rootScope.nsPrefix + 'Type__c'] = $scope.saveTemplateType;
                        newTemplate[$rootScope.nsPrefix + 'Author__c'] = $scope.saveTemplateAuthor;
                        newTemplate[$rootScope.nsPrefix + 'Version__c'] = 1;
                        newTemplate[$rootScope.nsPrefix + 'Active__c'] = false;
                        save(newTemplate).then(function(template) {
                            console.log('saved the new template',template);
                            inputNewTemplateInfoModal.$promise.then(inputNewTemplateInfoModal.hide);
                            $timeout(function() {
                                $rootScope.$broadcast('rootTemplateReady', template);
                            }, 100);
                            $rootScope.locked = false;
                            window.location = $window.location.pathname + '?id='  + template.Id;
                        });

                    };
                }
            });

          inputNewTemplateInfoModal.$promise.then(inputNewTemplateInfoModal.show);

      };

  });

},{}],5:[function(require,module,exports){
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
angular.module('templatedesigner')
  .controller('templateListController',
    ['$scope', 'remoteActions', 'NgTableParams', 'fileNsPrefix', '$rootScope', '$q',
        function($scope, remoteActions, NgTableParams, fileNsPrefix , $rootScope, $q) {
      'use strict';

      $scope.openTemplates = [];
      $scope.templates = null;
      var requiresRemoteLoad = true;

      function sortByVersion(a, b) {
          /*jshint camelcase: false */
          var prevElemVersion = a[fileNsPrefix() + 'Version__c'];
          var nextElemVersion = b[fileNsPrefix() + 'Version__c'];
          return prevElemVersion > nextElemVersion ? -1 : (prevElemVersion < nextElemVersion ? 1 : 0);
      }

      function sortByName(a, b) {
          if (a.Name && b.Name) { //there is a chance where you will reach this with a template with no name
              return a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 :
                 (a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 0);
          } else {
              return 0;
          }

      }

      $rootScope.$on('rootTemplateReady', function(event, template) {
          console.log('on template ready');
          if (!$scope.openTemplates.find(function(t) {
              return t.Id === template.Id;
          })) {
              $scope.openTemplates.push(template);
          }
          requiresRemoteLoad = false;
          $scope.tableParams.reload();
      });

      $rootScope.$on('saved', function(event, template) {
          var existingMatch = $scope.openTemplates.find(function(t) {
              return t.Id === template.Id;
          });
          if (existingMatch) {
              existingMatch[fileNsPrefix() + 'Active__c'] = template[fileNsPrefix() + 'Active__c'];
              existingMatch.Name = template.Name;
              existingMatch[fileNsPrefix() + 'Version__c'] = template[fileNsPrefix() + 'Version__c'];
          } else {
              $scope.templates.push(template);
              $scope.openTemplates.push(template);
          }
          requiresRemoteLoad = false;
          $scope.tableParams.reload();
      });

      $scope.tableParams = new NgTableParams({
            group: fileNsPrefix() + 'Type__c',
            count: 200,  // CARD-491:ngtable limits the display to 10 items by default. Set the count to max number when pagination is not used. 
            filter: {}
        }, {
            debugMode: true,
            groupOptions: {
                isExpanded: false
            },
            counts: [],
            getData: function() {
                if ($scope.tableParams.filter().$ && $scope.tableParams.filter().$ !== '') {
                    $scope.tableParams.settings().groupOptions.isExpanded = true;
                } else { //close when search box is blank
                  $scope.tableParams.settings().groupOptions.isExpanded = false;
                }
                var promise = $q.when($scope.templates);
                if (requiresRemoteLoad || $scope.templates === null) {
                    promise = remoteActions.getTemplates();
                }
                requiresRemoteLoad = true;
                return promise.then(function(templates) {
                        $scope.templates = templates;
                        templates = templates.concat($scope.openTemplates.map(function(template) {
                            template = angular.copy(template);
                            template[fileNsPrefix() + 'Type__c'] = ' Opened';
                            return template;
                        }));
                        templates.sort(function(a, b) {
                            var nameSortValue =  sortByName(a, b);
                            if (nameSortValue === 0) {
                                return sortByVersion(a, b);
                            } else {
                                return nameSortValue;
                            }
                        });
                        if ($scope.tableParams.filter().$ && $scope.tableParams.filter().$ !== '') {
                            var regex = new RegExp($scope.tableParams.filter().$, 'i');
                            return templates.filter(function(template) {
                                return regex.test(template.Name);
                            });
                        } else {
                            return templates;
                        }
                    });
            }
        });

      $rootScope.$on('ngTable:afterReloadData', function(event, params, newData, oldData) {
          if (newData.length > 0 && newData[0].value === ' Opened') {
              newData[0].$hideRows = false;
          }
      });

      $scope.searchText = '';

      $scope.filterTemplates = function(searchText) {
          if(!searchText) {
            $scope.tableParams.settings().groupOptions.isExpanded = false;
            $scope.tableParams.reload();
          } 
          $scope.tableParams.filter({$: searchText});
      };

      $scope.openTemplate = function(template) {
          $rootScope.$broadcast('loadTemplate', template);
      };

  }]);

},{}],6:[function(require,module,exports){
angular.module('templatedesigner')
  .controller('templatePropertiesController', function($rootScope, $scope, save, $timeout, fileNsPrefix, $modal,
                                                        $alert, remoteActions, htmlUnescapeFilter, $localizable,
                                                        BASE_TEMPLATE_AUTHOR, $window) {
      'use strict';
      var saveTimeoutToken = null;
      var DEFAULT_AUTHOR_SUFFIX = 'Dev';

      $rootScope.$on('rootTemplateReady', function(event, template) {
          $rootScope.template = template;
          if(sforce.console && sforce.console.isInConsole()) {
            sforce.console.setTabTitle(template.Name);
            sforce.console.onFocusedSubtab(function(tab){
                sforce.console.setTabTitle(template.Name);
            });
          }
          if($rootScope.template[$rootScope.nsPrefix + 'Definition__c'] ){
            $rootScope.template[$rootScope.nsPrefix + 'Definition__c'] = JSON.parse($rootScope.template[$rootScope.nsPrefix + 'Definition__c']);
          }
          
          $scope.justLoaded = true;
      });

      $scope.newVersion = function() {
          var cloneTemplate;
          var latestVersionNum = 1;
          cloneTemplate = angular.copy($rootScope.template);
          $scope.disableVersionBtn = true;
          delete cloneTemplate.Id;
          delete cloneTemplate[$rootScope.nsPrefix + 'ExternalID__c'];

          $rootScope.templates.filter(function(template) {
              return template.Name === cloneTemplate.Name && template[$rootScope.nsPrefix + 'Author__c'] === cloneTemplate[$rootScope.nsPrefix + 'Author__c'];
          }).forEach(function(template) {
              latestVersionNum = template[fileNsPrefix() + 'Version__c'] > latestVersionNum ?
                                    template[fileNsPrefix() + 'Version__c'] : latestVersionNum;
          });
          cloneTemplate[fileNsPrefix() + 'Version__c'] = latestVersionNum + 1;
          console.log('new version template ',cloneTemplate);
          cloneTemplate[fileNsPrefix() + 'Active__c'] = false;
          cloneTemplate[$rootScope.nsPrefix + 'Definition__c'] = $rootScope.template[$rootScope.nsPrefix + 'Definition__c'];
          save(cloneTemplate).then(function(template) {
              console.log('saved the new new template',template);
              $rootScope.template = template;
              $scope.disableVersionBtn = false;
              $scope.disableSaveBtn = true;

              if($rootScope.template[$rootScope.nsPrefix + 'Definition__c'] ){
                    $rootScope.template[$rootScope.nsPrefix + 'Definition__c'] = JSON.parse($rootScope.template[$rootScope.nsPrefix + 'Definition__c']);
                }
          });
      };

      $scope.clone = function() {

          var inputClonedTemplateInfoModal;
          var errorMsg;
          var nameErrorAlert, typeErrorAlert, authorErrorAlert;
          var invalidTemplateNameHeader = $localizable('SaveTemplateDialogNameErrorHeader',
                                                          'Template name error: ');
          var invalidTemplateTypeHeader = $localizable('SaveTemplateDialogTypeErrorHeader',
                                                          'Template type error: ');
          var invalidTemplateAuthorHeader = $localizable('SaveTemplateDialogAuthorErrorHeader',
                                                            'Template author error: ');

          inputClonedTemplateInfoModal = $modal({
                title: $localizable('TemplateDesignerInputClonedTemplateInfo', 'CLONE TEMPLATE'),
                templateUrl: 'InputClonedTemplateNameModal.tpl.html',
                show: false,
                backdrop: 'static',
                controller: function($scope) {

                    var isSaveTemplateFieldValid = function(field) {
                        if (!field) {
                            return false;
                        } else {
                            return true;
                        }
                    };

                    var isSaveTemplateNameAuthorUnique = function(userInputName, userInputAuthor) {
                        if ($rootScope.templates.find(function(template) {
                        return template.Name.toLowerCase() === userInputName.toLowerCase() && template[$rootScope.nsPrefix + 'Author__c'].toLowerCase() === userInputAuthor.toLowerCase();
                    })) {
                        return false;
                    }
                        return true;
                    };

                    var isSaveTemplateFieldUsingSpecialCharacters = function(userInputName) {
                        var specialCharacters = /[~`!#$%\^&*+=\[\]\\';,/{}|:<>\?]/;
                        if (specialCharacters.test(userInputName)) {
                            return true;
                        } else {
                           return false; 
                        }
                    };

                    var isSaveTemplateUsingBaseTemplateAuthorName = function(userInputAuthor) {
                        if (userInputAuthor.toLowerCase() === BASE_TEMPLATE_AUTHOR.toLowerCase() && $rootScope.insidePckg) {
                            return true;
                        } else {
                           return false; 
                        }
                    };

                    var displayErrorAlert = function(errorTitle, errorContent, alertContainer, alert) {
                        if (alert) {
                            // if you don't do this, the screen will display multiple instances
                            // of error messages that occurred for the same entity.
                            alert.destroy();
                        }
                        return $alert({title: errorTitle,
                                                content: errorContent,
                                                container: alertContainer,
                                                type: 'danger', show: true});
                    };

                    // initialize origin / author with the organization name
                    $scope.saveTemplateName = $rootScope.template.Name;
                    $scope.saveTemplateType = $rootScope.template[$rootScope.nsPrefix+'Type__c'];
                    $scope.saveTemplateAuthor = $rootScope.template[$rootScope.nsPrefix + 'Author__c'];
                    $scope.saveTemplateAuthor = isSaveTemplateUsingBaseTemplateAuthorName($scope.saveTemplateAuthor) ? ($window.orgName.toLowerCase() === BASE_TEMPLATE_AUTHOR ? BASE_TEMPLATE_AUTHOR + DEFAULT_AUTHOR_SUFFIX : $window.orgName) : $scope.saveTemplateAuthor;
                    $scope.saveTemplate = function() {

                        $scope.saveTemplateNameInvalid = false;

                        if (!isSaveTemplateFieldValid($scope.saveTemplateName)) {

                            $scope.saveTemplateNameInvalid = true;
                            errorMsg = $localizable('SaveTemplateDialogNameMissingError',
                                                    'You must specify template name!');
                            nameErrorAlert = displayErrorAlert(invalidTemplateNameHeader, errorMsg,
                                                                '#name-alert-container', nameErrorAlert);

                        } else if (isSaveTemplateFieldUsingSpecialCharacters($scope.saveTemplateName)) {

                            $scope.saveTemplateNameInvalid = true;
                            errorMsg = $localizable('SaveTemplateDialogNameHasSpecialCharactersError',
                                                    'Special characters cannot be used in template name!');
                            nameErrorAlert = displayErrorAlert(invalidTemplateNameHeader, errorMsg,
                                                                '#name-alert-container', nameErrorAlert);

                        } else if (!isSaveTemplateNameAuthorUnique($scope.saveTemplateName, $scope.saveTemplateAuthor)) {

                            $scope.saveTemplateNameInvalid = true;
                            errorMsg = $localizable('SaveTemplateDialogError', 'A template with same name and author already exists, try creating a new version.');
                            nameErrorAlert = displayErrorAlert(invalidTemplateNameHeader, errorMsg,
                                                                '#alert-container', nameErrorAlert);

                        }

                        // clear error message from previous "save"
                        if (!$scope.saveTemplateNameInvalid && nameErrorAlert) {
                            nameErrorAlert.destroy();
                        }

                        if (!isSaveTemplateFieldValid($scope.saveTemplateType)) {

                            $scope.saveTemplateTypeInvalid = true;
                            errorMsg = $localizable('SaveTemplateDialogTypeMissingError',
                                                    'You must specify template type!');
                            typeErrorAlert = displayErrorAlert(invalidTemplateTypeHeader, errorMsg, 
                                                                '#type-alert-container', typeErrorAlert);

                        } else {
                            $scope.saveTemplateTypeInvalid = false;
                        }

                        // clear error message from previous "save"
                        if (!$scope.saveTemplateTypeInvalid && typeErrorAlert) {
                            typeErrorAlert.destroy();
                        }

                        $scope.saveTemplateAuthorInvalid = false;

                        if (!isSaveTemplateFieldValid($scope.saveTemplateAuthor)) {

                            $scope.saveTemplateAuthorInvalid = true;
                            errorMsg = $localizable('SaveTemplateDialogAuthorMissingError',
                                                                  'You must specify template author!');
                            authorErrorAlert = displayErrorAlert(invalidTemplateAuthorHeader, errorMsg, 
                                                                   '#author-alert-container', authorErrorAlert);

                        } else if (isSaveTemplateUsingBaseTemplateAuthorName($scope.saveTemplateAuthor)) {

                            $scope.saveTemplateAuthorInvalid = true;
                            errorMsg = $localizable('SaveTemplateDialogUsingBaseTemplateAuthorNameError',
                                                    'Creating \'Vlocity\' authored template is not allowed.');
                            authorErrorAlert = displayErrorAlert(invalidTemplateAuthorHeader, errorMsg, 
                                                                '#author-alert-container', authorErrorAlert);

                        }

                        // clear error message from previous "save"
                        if (!$scope.saveTemplateAuthorInvalid && authorErrorAlert) {
                            authorErrorAlert.destroy();
                        }

                        if ($scope.saveTemplateNameInvalid || $scope.saveTemplateTypeInvalid ||
                            $scope.saveTemplateAuthorInvalid) {
                            return;
                        }

                        var cloneTemplate = angular.copy($rootScope.template);
                        cloneTemplate['Name'] = $scope.saveTemplateName;
                        cloneTemplate[$rootScope.nsPrefix + 'Type__c'] = $scope.saveTemplateType;
                        cloneTemplate[$rootScope.nsPrefix + 'Author__c'] = $scope.saveTemplateAuthor;
                        $scope.disableCloneBtn = true;
                        delete cloneTemplate.Id;
                        delete cloneTemplate[$rootScope.nsPrefix + 'ExternalID__c'];
                        delete cloneTemplate.originalJson;
                        cloneTemplate[$rootScope.nsPrefix + 'Version__c'] = 1;
                        cloneTemplate[$rootScope.nsPrefix + 'ParentID__c'] = $rootScope.template[$rootScope.nsPrefix + 'ExternalID__c'];
                        cloneTemplate[$rootScope.nsPrefix + 'Definition__c'] = $rootScope.template[$rootScope.nsPrefix + 'Definition__c'];
                        cloneTemplate[$rootScope.nsPrefix + 'Active__c'] = false;
                        save(cloneTemplate).then(function(template) {
                            console.log('saved the new cloned template',template);
                            $rootScope.template = template;
                            $scope.disableCloneBtn = false;
                            $scope.disableSaveBtn = true;
                            $rootScope.locked = false;
                            inputClonedTemplateInfoModal.$promise.then(inputClonedTemplateInfoModal.hide);

                            //Push the new template type. Used in bs-options in clone modal
                            if($rootScope.templateTypes && $rootScope.templateTypes.indexOf($scope.saveTemplateType) === -1) {
                              $rootScope.templateTypes.push($scope.saveTemplateType);
                            }

                            if($rootScope.template[$rootScope.nsPrefix + 'Definition__c'] ){
                                $rootScope.template[$rootScope.nsPrefix + 'Definition__c'] = JSON.parse($rootScope.template[$rootScope.nsPrefix + 'Definition__c']);
                            }
                        });

                    };
                }
            });

          inputClonedTemplateInfoModal.$promise.then(inputClonedTemplateInfoModal.show);

      };

      $scope.addToDefinition = function(defProperty) {
        $rootScope.template[$rootScope.nsPrefix + 'Definition__c'] = $rootScope.template[$rootScope.nsPrefix + 'Definition__c'] || {};
        var newPlaceholder  = { name : '', label : ''},
            newZone         = { name : '', label : ''};
            
        switch(defProperty) {
            case 'zones':
                $rootScope.template[$rootScope.nsPrefix + 'Definition__c'][defProperty] = $rootScope.template[$rootScope.nsPrefix + 'Definition__c'][defProperty] || [];
                $rootScope.template[$rootScope.nsPrefix + 'Definition__c']['zones'].push(newZone);
                break;
            case 'placeholders':
                $rootScope.template[$rootScope.nsPrefix + 'Definition__c'][defProperty] = $rootScope.template[$rootScope.nsPrefix + 'Definition__c'][defProperty] || [];
                $rootScope.template[$rootScope.nsPrefix + 'Definition__c']['placeholders'].push(newPlaceholder);
                break;
        }
        
      };

      $scope.deleteFromDefinition = function(defProperty, zoneIndex) {
            switch(defProperty) {
                case 'zones':
                    $rootScope.template[$rootScope.nsPrefix + 'Definition__c']['zones'].splice(zoneIndex,1);
                    break;
                case 'placeholders':
                    $rootScope.template[$rootScope.nsPrefix + 'Definition__c']['placeholders'].splice(zoneIndex,1);
                    break;
            }
      };

      function without(obj, keys) {
          if (!obj) {
              return null;
          }
          return Object.keys(obj).filter(function(key) {
              return keys.indexOf(key) === -1;
          }).reduce(function(result, key) {
              result[key] = obj[key];
              return result;
          }, {});
      }

      $scope.$watch(
          function() {
              return without($rootScope.template, ['saving', 'errors']);
          }, function() {
              if (saveTimeoutToken) {
                  $timeout.cancel(saveTimeoutToken);
              }
              saveTimeoutToken = $timeout(function() {
                  if (!$scope.justLoaded) {
                      save($rootScope.template); //avoid saving on load
                  }
                  $scope.justLoaded = false;
              }, 1000);
          }, true);

      $scope.toggleActivate = function() {
          if ($rootScope.template[fileNsPrefix() + 'Active__c']) {
              remoteActions.getTemplateByName($rootScope.template.Name)
                .then(function(activeTemplate) {
                    if (activeTemplate) {
                        if (activeTemplate[fileNsPrefix() + 'Version__c'] !==
                            $rootScope.template[fileNsPrefix() + 'Version__c']) {
                            activeTemplate[fileNsPrefix() + 'Active__c'] = false;
                            activeTemplate[fileNsPrefix() + 'HTML__c'] =
                                                      htmlUnescapeFilter(activeTemplate[fileNsPrefix() + 'HTML__c']);
                            activeTemplate[fileNsPrefix() + 'Sass__c'] =
                                                      htmlUnescapeFilter(activeTemplate[fileNsPrefix() + 'Sass__c']);
                            save(activeTemplate, null, true);
                        }
                    }
                    $rootScope.template[fileNsPrefix() + 'Active__c'] = true;
                    $rootScope.templateActive = $rootScope.template[fileNsPrefix() + 'Active__c'];

                });
          }
          save($rootScope.template);
      };
  });

},{}],7:[function(require,module,exports){
angular.module('templatedesigner')
  .factory('sampleJSON', function() {
      'use strict';
      var defaultForCards = {
          data: {
              title: 'Card Title',
              actions: [
            {
                vlocityIcon: 'icon-v-heart',
                displayName: 'Like Action'
            }
          ],
              fields: [{
                  label: 'Description',
                  name: 'description'
              },{
                  label: 'Cost',
                  name: 'cost',
                  type: 'currency'
              }]
          },
          obj: {
              Id: '123456',
              Name: 'Object Name',
              LastModifiedDate: new Date(),
              description: 'Some description',
              cost: 150
          }
      };

      return {
          'Card': defaultForCards,
          'Cards': defaultForCards,
          'OmniScript Selectable Items': {
        control: {
            propSetMap: {
                label: 'Property Label'
            },
            itemsKey: 'results',
            vlcSI: {
              results: [
                {
                    added: false,
                    Name: 'Product Name',
                    Description: 'Product Description',
                    OneTimeCost: 100,
                    MonthlyCost: 20,
                }
            ]
          }
        },
        OmniOneTime: 'One Time Cost',
        OmniMonthly: 'Monthly Cost',
        AddToCart: 'Add to Cart'
    },
          'OmniScript Redirect': {
              response: {
                  CallSuccess: true,
                  applicationRefNumber: '123456',
              },
              OmniCallResult: 'Call Result',
              OmniApplicationAcknowledge: 'Application Number'
          },
          'OmniScript Modal': {
              content: {
                  recSet: [{
                      ProductName: 'Product A',
                      TermLifeMatrix__Rate: 90,
                      attributes: [{
                          name: 'Attribute 1'
                      }, {
                          name: 'Attribute 2'
                      }]
                  }, {
                      ProductName: 'Product B',
                      TermLifeMatrix__Rate: 10,
                      attributes: [{
                          name: 'Attribute 1'
                      }, {
                          name: 'Attribute 2'
                      }]
                  }]
              }
          }
      };
  });

},{}],8:[function(require,module,exports){
/* globals Sass */
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
angular.module('templatedesigner')
  .factory('save', function($q, $window, remoteActions, $rootScope, $timeout,
                            $localizable, htmlUnescapeFilter, fileNsPrefix) {
      'use strict';

      var sass = new Sass();

      remoteActions.getSassMixins().then(function(mixins) {
        $rootScope.mixins = [];
        if (mixins) {
            $rootScope.mixins = mixins;
            $rootScope.mixins.forEach(function(mixin) {
                var ngSass =
                    mixin[fileNsPrefix() + 'Sass__c'] ? htmlUnescapeFilter(mixin[fileNsPrefix() + 'Sass__c']) : '';
                sass.writeFile(mixin.Name, ngSass);
            });
        }
    });

      function adaptTemplateJsonForSave(json) {
        console.log('adapting json ',json);
        var pendingCompilePromise = $q(function(resolve) {
            var sawSass = false;
            var outputObject = Object.keys(json).reduce(function(outputObject, key) {
                if (/(Id|Name|__c)$/.test(key)) {
                    outputObject[key] = json[key];
                    if (/Sass__c/.test(key)) {
                        sawSass = true;
                        sass.compile(outputObject[key] || '', function(result) {
                            if (result.status === 1) {
                                json.errors = [{
                                    message: result,
                                    property: key
                                }];
                            } else if (!result.status || !json[key] || json[key] !== '') {
                                //Sass field is empty
                                outputObject[fileNsPrefix() + 'CSS__c'] = result.text ? result.text : '';
                            }
                            resolve(outputObject);
                        });
                    }
                }
                if(outputObject[fileNsPrefix() + 'Definition__c'] && typeof outputObject[fileNsPrefix() + 'Definition__c'] === 'object') {
                    outputObject[fileNsPrefix() + 'Definition__c'] = angular.toJson(outputObject[fileNsPrefix() + 'Definition__c']);
                }
                
                return outputObject;
            }, {});
            if (!sawSass) {
                resolve(outputObject);
            }
        });
        return pendingCompilePromise;
    }

      function hasUniqueNameAndVersion(item) {
        // check template name doesn't exist already
        if ($rootScope.templates.find(function(template) {
            return template.Name.toLowerCase() === item.Name.toLowerCase() &&
                    (!item[fileNsPrefix() + 'Version__c'] ||
                      item[fileNsPrefix() + 'Version__c'] === template[fileNsPrefix() + 'Version__c']) && item[fileNsPrefix() + 'Author__c'] === template[fileNsPrefix() + 'Author__c'] &&
                    template.Id !== item.Id;
        })) {
            item.errors = [{
                message: $localizable('SaveTemplateDialogError', 'A template with same name and author already exists, try creating a new version.'),
                property: 'Name'
            }];
            return false;
        }
        return true;
    }

      function hasSpecialCharacters(item) {
        var specialCharacters = /[~`!#$%\^&*+=\[\]\\';,/{}|:<>\?]/;
        if (specialCharacters.test(item.Name)) {
            item.errors = [{
                message: $localizable('TemplateNameWithSpecialCharacters',
                                      'Special characters not allowed in name'),
                property: 'Name'
            }];
            return true;
        }
        return false; //good user input
    }

      function hasName(item) {
        if (!item.Name || item.Name === '') {
            if (item.Id) {
                item.errors = [{
                  message: $localizable('DesignerMustSetName', 'You must set a name'),
                  property: 'Name'
              }];
            }
            return false;
        }
        return true;
    }

      function hasType(item) {
        if (!item[fileNsPrefix() + 'Type__c'] || item[fileNsPrefix() + 'Type__c'] === '') {
            item.errors = [{
                message: $localizable('DesignerMustSetType', 'You must set a type'),
                property: fileNsPrefix() + 'Type__c'
            }];
            return false;
        }
        return true;
    }

      function hasOrigin(item) {
        if (!item[fileNsPrefix() + 'Author__c'] || item[fileNsPrefix() + 'Author__c'] === '') {
            item.errors = [{
                message: $localizable('DesignerMustSetType', 'You must set an author'),
                property: fileNsPrefix() + 'Author__c'
            }];
            return false;
        }
        return true;
    }

      function hasWrongOrigin(item) {
        //Temporary fix
        //TBD: Implement the check. Currently has issue
        return false;

        //End of temporary fix

        if (item.originalJson) {
            if ((item[fileNsPrefix() + 'Active__c'] != item.originalJson[fileNsPrefix() + 'Active__c']) &&
                $rootScope.insidePckg) {
                return false; //let them save when just activating a vlocity template
            }
        }
        //if(item[fileNsPrefix() + 'Author__c'].trim().toLowerCase() === 'vlocity' && $rootScope.insidePckg) {
        if ($rootScope.locked) {
            item.errors = [{
                message: $localizable('DesignerMustSetAuthor', 'You cannot set Vlocity as your author'),
                property: fileNsPrefix() + 'Author__c'
            }];
            return true;
        }
        return false;
    }

      function shouldSave(item, json) {

          if (item.saving || (item.errors && item.errors.length > 0) ||
              !hasName(item) || !hasType(item) || !hasOrigin(item) || !hasUniqueNameAndVersion(item) ||
              angular.equals(item.originalJson, json) || hasWrongOrigin(item) || hasSpecialCharacters(item)
            ) {
              return false;
          }

          item.originalJson = json;
          item.saving = true;
          item.errors = null;
          return item;
      }

      function getExternalID(template) {
        return template.Name + '/' + template[fileNsPrefix() + 'Version__c'] + '/' + template[fileNsPrefix() + 'Author__c'];
    }

      function saveTemplate(template) {
        return adaptTemplateJsonForSave(template).then(function(jsonToSave) {
            if (shouldSave(template, jsonToSave)) {
                console.log('json to save ',jsonToSave);
                template.saving = true;
                return remoteActions.saveTemplate(jsonToSave)
                  .then(function(updatedTemplate) {
                      template.saving = false;
                      console.log('saved template ',updatedTemplate);
                      $rootScope.templates.push(updatedTemplate);
                      $rootScope.$broadcast('saved', template);
                      if (updatedTemplate) {
                          template.Id = updatedTemplate.Id;
                          var existingId = $window.location.href.split(/[?&]/).find(function(item) {
                              return /^id\=/.test(item);
                          });
                          if (existingId) {
                              existingId = existingId.replace(/^id=/, '');
                          }
                          if (!existingId || existingId !== template.Id) {
                              $timeout(function() {
                                  if (existingId) {
                                      var pathname = $window.location.href.replace(existingId, template.Id);
                                      $window.history.pushState('', '', pathname);
                                  } else {
                                      var newUrl = $window.location.pathname +
                                                  ($window.location.search.length === 0 ? '?' :
                                                   $window.location.search + '&') + 'id=' + template.Id;
                                      $window.history.pushState('','', newUrl);
                                  }
                              });
                          }
                          if (updatedTemplate.errors) {
                              template.errors = updatedTemplate.errors;
                          } else if (updatedTemplate.type === 'exception') {
                              template.errors = [{
                                  message: updatedTemplate.message
                              }];
                          }
                          console.log('returning saved template ',updatedTemplate);
                          return updatedTemplate;
                      } else {
                          return template;
                      }

                  });
            } else {
                return $q.when(template);
            }
        });
    }

      return function save(template) {
        if (!template) {
            return $q.when(template);
        }
        template.errors = [];
        return saveTemplate(template);
    };
  });

},{}],9:[function(require,module,exports){
angular.module("templatedesigner").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("RemovePagerRow.tpl.html",""),$templateCache.put("JSEditor.tpl.html",'<h4>Javascript <a href="#" ng-click="helpNodeText(\'javascript\')"><i class="icon icon-v-information-line"></i></a></h4>\n<div class="ace" ui-ace="{\n    useWrapMode : true,\n    showGutter: true,\n    theme:\'monokai\',\n    mode: \'javascript\',\n    showPrintMargin : false,\n    onLoad: aceJsLoaded\n  }"\n      ng-model="$root.template[$root.nsPrefix+\'CustomJavascript__c\']"\n      ng-readonly="$root.template[nsPrefix + \'Active__c\'] || $root.locked"></div>'),$templateCache.put("TemplateProperties.tpl.html",'<form>\n  <div class="row">\n    <div class="form-group col-lg-12">\n      <label for="name">Name</label>\n      <input type="text" class="form-control" id="name" ng-model="$root.template.Name" ng-disabled="$root.template[nsPrefix + \'Active__c\'] || $root.locked || $root.template.Id"/>\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-12">\n      <label for="name">Type</label>\n      <input class="form-control" ng-model="$root.template[$root.nsPrefix+\'Type__c\']" bs-options="layoutType for layoutType in $root.templateTypes" bs-typeahead="bs-typeahead" ng-disabled="$root.template[nsPrefix + \'Active__c\'] || $root.locked || $root.template.Id" />\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-sm-12">\n      <label for="origin">{{::"DesignerOriginName" | localize:\'Author\'}}</label>\n      <input type="text" class="form-control" id="origin" ng-model="$root.template[$root.nsPrefix+\'Author__c\']" ng-disabled="$root.template[nsPrefix + \'Active__c\'] || $root.locked || $root.template.Id"/>\n     </div>\n  </div>\n  <div class="row" ng-if="$root.template[nsPrefix + \'ParentID__c\']">\n    <div class="form-group col-sm-12">\n      <label for="name">Parent ID: {{$root.template[nsPrefix + \'ParentID__c\']}}</label>\n     </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-4">\n      <label for="name">Version {{$root.template[$root.nsPrefix+\'Version__c\']}}</label>\n    </div>\n    <div class="form-group col-lg-4">\n      <button class="btn btn-default always-active" type="button" ng-disabled="($root.template.errors.length>0 || disableVersionBtn) || $root.locked || !$root.template.Id" ng-click="newVersion($event)"> Create Version </button>\n    </div>\n    <div class="form-group col-lg-3">\n      <button class="btn btn-default always-active" type="button" ng-disabled="$root.template.errors.length>0 || disableCloneBtn || !$root.template.Id" ng-click="clone($event)"> Clone </button>\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-6">\n      <div class="toggle-switch">\n        <span class="toggle-label toggle-to">Activate:</span>\n        <div class="switch">\n          <input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round" type="checkbox" ng-disabled="$root.template.errors.length>0" ng-model="$root.template[$root.nsPrefix+\'Active__c\']" ng-change="toggleActivate()">\n          <label for="cmn-toggle-1"></label>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-12">\n      <label for="name">{{::"DesignerDescription" | localize:\'Description\'}}</label>\n    </div>\n    <div class="form-group col-lg-12">\n      <textarea class="form-control" ng-model="$root.template[$root.nsPrefix+\'Description__c\']" ng-disabled="$root.template[nsPrefix + \'Active__c\'] || $root.locked" rows="5"/>\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-12">\n      <label for="name">{{::"DesignerSampleDataJson" | localize:\'Sample JSON\'}}</label>\n    </div>\n    <div class="form-group col-lg-12">\n      <textarea class="form-control" ng-model="$root.template[$root.nsPrefix+\'SampleJson__c\']" ng-disabled="$root.template[nsPrefix + \'Active__c\']" rows="5"/>\n    </div>\n  </div>\n\n   <div class="row">\n    \x3c!-- ZONES --\x3e\n    <div class="form-group col-sm-12">\n      <label for="name">\n          {{::"DesignerZones" | localize:\'Zones\'}}\n      </label>\n      <div>\n          \x3c!-- Restrict drag and drop of fields and actions within their state --\x3e\n          <ul class="field-list"\n              ng-if="$root.template[$root.nsPrefix+\'Definition__c\'][\'zones\'].length">\n            <li ng-repeat="zone in $root.template[$root.nsPrefix+\'Definition__c\'][\'zones\']">\n\n                <div class="row stateFields" ng-if="$first">\n                  <div class="form-group col-sm-5">\n                    <label for="name">\n                        Name\n                    </label>\n                  </div>\n                  <div class="form-group col-sm-5">\n                      <label for="name">\n                          Label\n                      </label>\n                  </div>\n                  \n              </div>\n              \n              <div class="row">\n                <div class="form-group col-sm-5">\n\t\t\t\t\t        <input type="text"\n                      class="form-control fieldLabel" \n                      placeholder="Name" \n                      ng-model="zone.name"\n                      ng-disabled="$root.template[nsPrefix + \'Active__c\']"/>\n                </div>\n                <div class="form-group col-sm-5">\n                    <input type="text"\n                      class="form-control fieldLabel" \n                      placeholder="Label" \n                      ng-model="zone.label" \n                      ng-disabled="$root.template[nsPrefix + \'Active__c\']"/>\n                </div>\n                <div class="form-inline col-sm-2">\n                    <button type="button" class="btn btn-link pull-right" ng-click="deleteFromDefinition(\'zones\',$index)" ng-disabled="$root.template[nsPrefix + \'Active__c\']">\n                      <span class="icon icon-v-trash"></span>\n                    </button>\n                </div>\n              </div>\n            </li>\n          </ul>\n          <div class="add-field row">\n            <div class="col-xs-12">\n              <button type="button" class="btn btn-default pull-right" \n                      ng-click="addToDefinition(\'zones\')" \n                      ng-disabled="$root.template[nsPrefix + \'Active__c\']">\n                        {{::"DesignerAddZone" | localize:\'+ Add Zone\'}}\n              </button>\n            </div>\n          </div>\n      </div>\n    </div>\n   </div>\n   <div class="row">\n    \x3c!-- PLACEHOLDERS --\x3e\n    <div class="form-group col-sm-12">\n      <label for="name">\n          {{::"DesignerPlaceholders" | localize:\'Placeholders\'}}\n      </label>\n      <div>\n          \x3c!-- Restrict drag and drop of fields and actions within their state --\x3e\n          <ul class="field-list"\n              ng-if="$root.template[$root.nsPrefix+\'Definition__c\'][\'placeholders\'].length">\n            <li ng-repeat="zone in $root.template[$root.nsPrefix+\'Definition__c\'][\'placeholders\']">\n              \n              <div class="row">\n                <div class="form-group col-sm-6">\n\t\t\t\t\t <input type="text" title="{{ ::\'stateFieldLabel\' | localize:\'Label\' }}" \n                      class="form-control fieldLabel" \n                      placeholder="Name" \n                      ng-model="zone.name"\n                      ng-disabled="$root.template[nsPrefix + \'Active__c\']"/>\n                </div>\n\t\t\t\t<div class="form-inline col-sm-6">\n\t\t\t\t\t<button type="button" class="btn btn-link pull-right" ng-click="deleteFromDefinition(\'placeholders\',$index)" ng-disabled="$root.template[nsPrefix + \'Active__c\']">\n                      <span class="icon icon-v-trash"></span>\n                    </button>\n\t\t\t\t </div>\n              </div>\n            </li>\n          </ul>\n          <div class="add-field row">\n            <div class="col-xs-12">\n              <button type="button" class="btn btn-default pull-right" \n                      ng-click="addToDefinition(\'placeholders\')" \n                      ng-disabled="$root.template[nsPrefix + \'Active__c\']">\n                       {{::"DesignerAddPlaceholder" | localize:\'+ Add Placeholder\'}}\n              </button>\n            </div>\n          </div>\n      </div>\n    </div>\n   </div>\n</form>'),$templateCache.put("helpModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">Help</h4>\n      </div>\n\n      <div class="modal-body">\n          <div ng-include="helpNode"></div>\n      </div>\n\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" ng-click="$hide()">{{ ::\'helpDialogClose\' | localize: \'Close\' }}</button>\n      </div>\n    </div>\n  </div>\n</div>'),$templateCache.put("InputClonedTemplateNameModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header" ng-show="title">\n        <button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" ng-bind="title"></h4>\n      </div>\n      \x3c!--div class="modal-body" ng-bind="content"></div--\x3e\n\n      <div class="col-sm-12">\n            <form role="form">\n              <div class="row">\n                <div class="form-group col-sm-8">\n                  <div id="alert-container"></div>\n                </div>\n                <div class="form-group col-sm-8" ng-class="{\'has-error\': saveTemplateNameInvalid}">\n                  <label for="name">Template Name</label>\n                  <input class="form-control" ng-model="saveTemplateName" placeholder="Enter name" type="text" />\n                </div>\n                <div class="form-group col-sm-8">\n                  <div id="name-alert-container"></div>\n                </div>\n              </div>\n              <div class="row">\n                <div class="form-group col-sm-8" ng-class="{\'has-error\': saveTemplateTypeInvalid}">\n                  <label for="name">Template Type</label>\n                  <input class="form-control" ng-model="saveTemplateType" placeholder="Enter type" type="text" bs-options="type for type in $root.templateTypes" bs-typeahead />\n                </div>\n                <div class="form-group col-sm-8">\n                  <div id="type-alert-container"></div>\n                </div>\n              </div>\n              <div class="row">\n                <div class="form-group col-sm-8" ng-class="{\'has-error\': saveTemplateAuthorInvalid}">\n                  <label for="name">Template Author</label>\n                  <input class="form-control" ng-model="saveTemplateAuthor" type="text" />\n                </div>\n                <div class="form-group col-sm-8">\n                  <div id="author-alert-container"></div>\n                </div>\n              </div>\n            </form>\n      </div>\n\n      <div class="modal-footer">\n        <button type="button" class="btn btn-primary" ng-click="saveTemplate()">{{ ::\'cloneCardButtonLabel\' | localize: \'Clone\' }}</button>\n        <button type="button" class="btn btn-default" ng-click="$hide()">{{ ::\'Close\' | localize: \'Close\' }}</button>\n      </div>\n    </div>\n  </div>\n</div>'),$templateCache.put("TemplateList.tpl.html",'<form>\n   <div class="input-group">\n      <input type="text" class="form-control" placeholder="Search" ng-change="filterTemplates(searchText)" \n             ng-model="searchText"></input>\n      <div class="input-group-addon"><i class="icon icon-v-search"></i></div>\n  </div>\n</form>\n<table class="table table-grouped layout-list" ng-table="tableParams" template-pagination="RemovePagerRow.tpl.html"\n        show-group="false">\n  <colgroup>\n    <col width="30px" />\n    <col />\n  </colgroup>\n  <tr class="ng-table-group" ng-repeat-start="group in $groups" ng-click="group.$hideRows = !group.$hideRows">\n    <td style="text-align: center;">\n      <i class="icon"\n         ng-class="{\'icon-v-right-arrow\': group.$hideRows, \'icon-v-down-arrow\': !group.$hideRows}"></i>\n    </td>\n    <td style="text-transform:capitalize;">{{ group.value }}</td>\n  </tr>\n  <tr ng-hide="group.$hideRows" ng-repeat="row in group.data" ng-repeat-end=" "\n      ng-class="{\'active\': row.Id === $root.template.Id}">\n    <td style="text-align: right;"><i class="icon icon-v-view" ng-show="row.Id === $root.template.Id"></i>\n      <i class="icon icon-v-star-line" title="{{ ::\'Active\'| localize:\'Active\' }}" ng-show="row[$root.nsPrefix + \'Active__c\']"></i>\n    </td>\n'+"    <td data-title=\"''\" ng-click=\"openTemplate(row)\" ng-attr-title=\"{{row.Name}} ({{row[$root.nsPrefix+'Author__c']}}, {{ (row[$root.nsPrefix+'Version__c'] || 1) | number:1}} {{row[$root.nsPrefix + 'Active__c'] ? 'Active' : ''}})\" filter=\"{ Name: 'text' }\" >\n      {{row.Name}} ({{row[$root.nsPrefix+'Author__c']}}, {{ (row[$root.nsPrefix+'Version__c'] || 1) | number:1}})\n    </td>\n  </tr>\n</table>"),$templateCache.put("HtmlEditor.tpl.html",'<h4>HTML <a href="#" ng-click="helpNodeText(\'html\')"><i class="icon icon-v-information-line"></i></a></h4>\n<div class="ace" ui-ace="{\n    useWrapMode : true,\n    showGutter: true,\n    theme:\'monokai\',\n    mode: \'html\',\n    showPrintMargin : false,\n    onLoad: aceHTMLLoaded\n  }"\n      ng-model="$root.template[$root.nsPrefix+\'HTML__c\']"\n      ng-readonly="$root.template[nsPrefix + \'Active__c\'] || $root.locked"></div>'),$templateCache.put("cssHelpNode.tpl.html","<div>\n  <h2>SASS/CSS</h2>\n  <p>\n    Template designer supports both SASS and CSS. <b>But we strongly recommend to use only 'SASS' and adhere to the 'SMACSS' principles. This helps in Scalable and Modular Architecture for CSS.</b> In other words, you don't have to worry about leaky styles if you follow the guidelines.\n  </p>\n  <p>\n    Stylesheets are getting larger, more complex, and harder to maintain. This is where a preprocessor can help. \n    SASS lets you use features that don't exist in CSS yet like variables, nesting, mixins, inheritance and few others.<br/>\n\n    Once you start tinkering with SASS, it will take your preprocessed SASS file and save it as a normal CSS file that gets used on the app/site.\n  </p>\n\n  <pre>\n    /*** VARIABLES ***/\n    @import \"my-variables\";\n\n    /*** MIXINS ***/\n    @import \"my-mixin\";\n\n    /*** STYLES ***/\n    .vlocity {   /* Always use vlocity class as a wrapper */\n        .myapp-home-product-template { /* Always use template specific unique class, follow the template name */\n            /* Your code goes here */\n        }   \n    }\n  </pre>\n  <p>\n    Note:\n    <ul>\n      <li><code>vlocity</code> class is needed as a wrapper to inherit the vlocity styles and to isolate styles to only vlocity apps.</li>\n      <li>Template specific unique classes are needed to avoid styles from leaking into other templates or components. Templates always have the unique name, it's good to follow the same naming convention.</li>\n    </ul>\n  </p>\n  <b>How to create and use 'variables' and 'mixins'?</b>\n  <ol>\n    <li>Create the mixins or variables</li>\n    <li>Refresh the entire page(template designer). This needs to be done so that all templates have access to the new files</li>\n    <li>Go to any SASS/CSS file and use mixin/variable by importing it</li>\n  </ol>\n  <b>Note:</b> When you update the Mixin/Variables, you need to save all the templates again as SASS needs to be preprocessed across all templates. SASS is preprocessed and saved as CSS when you save the templates.\n  <p>\n    <br/>Read More:\n    <br/>\n    <ul>\n"+'      <li><a href="http://sass-lang.com" target="_blank">SASS</a></li>\n      <li><a href="https://smacss.com" target="_blank">SMACSS</a></li>\n    </ul>\n  </p>\n</div>\n'),$templateCache.put("javascriptHelpNode.tpl.html","<div>\n    <h2>Javascript </h2> Please use vlocity.cardframework.registerModule to register your Angular Module:\n    <br/>\n    <h2>Controller :</h2>\n    <pre>\n      vlocity.cardframework.registerModule.controller('myappHomeProductController', ['$scope', function($scope) {\n        // Your code goes here\n      }]);\n    </pre>\n    <h2>Service :</h2> Note : If you want to inject a service inside the registered controller then you have to register the service before controller.\n    <br/><br/>\n    <pre>\n     vlocity.cardframework.registerModule.service('myTestService', [function() {\n        // Your code goes here\n     }]);\n    </pre>\n    <h2>Factory :</h2> Note : If you want to inject a factory inside the registered controller then you have to register the factory before controller.\n    <br/><br/>\n    <pre>\n    vlocity.cardframework.registerModule.factory('myTestFactory', [function() {\n        // Your code goes here\n    }]);\n    </pre>\n    <h2>Directive :</h2>\n    <pre>\n    vlocity.cardframework.registerModule.directive(\"myTestDirective\", function() {\n        // Your code goes here\n    });\n    </pre> Now we can use the directive in our html page using <code>my-test-directive</code> as an Element, Attribute or Class as per our configuration.\n    <br/>\n    <h2>Filter :</h2>\n    <pre>\n    vlocity.cardframework.registerModule.filter(\"myTestFilter\", function() {\n        // Your code goes here\n    });\n    </pre> Now we can use the filter in our html page as <code>{{ \"Vlocity\" | myTestFilter }}</code>\n</div>\n"),$templateCache.put("CssEditor.tpl.html",'<h4>CSS/SCSS\n    <i class="icon icon-v-claim-line"\n        ng-if="$root.template.errors[0].property.indexOf(\'Sass__c\') > -1"\n        data-container=".container"\n        data-type="info" bs-tooltip="$root.template"\n        bs-enabled="true"\n        data-html = "true"\n        data-title="{{errors[0].message.message}}"></i>\n      <a href="#" ng-click="helpNodeText(\'css\')"><i class="icon icon-v-information-line"></i></a></h4>\n</h4>\n<div ui-ace="{useWrapMode : true, showGutter: true, theme: \'monokai\', mode: \'scss\',showPrintMargin : false, onLoad : aceLoaded}" ng-model="$root.template[$root.nsPrefix+\'Sass__c\']"\n     ng-readonly="$root.template[nsPrefix + \'Active__c\'] || $root.locked"></div>\n'),$templateCache.put("htmlHelpNode.tpl.html","<div>\n    <h2>HTML</h2>\n    <p>\n      HTML templates support all the standard HTML structures(DOM).<br/>\n      Templates can't have the <code>html</code> or <code>body</code> tags as it's embedded into a page which already has html/body tags.\n    </p>\n\n    Template names are unique.<br/>\n    <b>Naming convention:</b> {appname}-{featurename}-{sub-feature}<br/>\n    Eg: myapp-home-product, myapp-home-kitchen-sink<br/><br/>\n\n    Always have the unique class name on the root element in the HTML template. This unique class needs to be used in respective SASS/CSS <br/><br/>\n    <pre>\n        &lt;!-- Template: myapp-home-kitchen-sink --&gt;\n        &lt;div class=&quot;myapp-home-kitchen-sink&quot;&gt;\n          &lt;h2&gt;Title&lt;h2&gt;\n          &lt;div&gt;Template Body&lt;/div&gt;\n        &lt;/div&gt;\n    </pre>\n    <br/>\n    <b>Note:</b> Whenever you're cloning or copying the templates, ensure that you rename the root level class('myapp-home-kitchen-sink' in above example). If not renamed, same class name will be used across multiple templates and styles gets leaked.\n</div>\n"),$templateCache.put("InputNewTemplateInfoModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header" ng-show="title">\n        <button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" ng-bind="title"></h4>\n      </div>\n      \x3c!--div class="modal-body" ng-bind="content"></div--\x3e\n\n      <div class="col-sm-12">\n            <form role="form">\n              <div class="row">\n                <div class="form-group col-sm-8">\n                    <div id="alert-container"></div>\n                </div>\n                <div class="form-group col-sm-8" ng-class="{\'has-error\': saveTemplateNameInvalid}">\n                  <label for="name">Template Name</label>\n                  <input class="form-control" ng-model="saveTemplateName" placeholder="Enter name" type="text" />\n                </div>\n                <div class="form-group col-sm-8">\n                  <div id="name-alert-container"></div>\n                </div>\n              </div>\n              <div class="row">\n                <div class="form-group col-sm-8" ng-class="{\'has-error\': saveTemplateTypeInvalid}">\n                  <label for="name">Template Type</label>\n                  <input class="form-control" ng-model="saveTemplateType" placeholder="Enter type" type="text" bs-options="type for type in $root.templateTypes" bs-typeahead />\n                </div>\n                <div class="form-group col-sm-8">\n                  <div id="type-alert-container"></div>\n                </div>\n              </div>\n              <div class="row">\n                <div class="form-group col-sm-8" ng-class="{\'has-error\': saveTemplateAuthorInvalid}">\n                  <label for="name">Author</label>\n                  <input class="form-control" ng-model="saveTemplateAuthor" type="text" />\n                </div>\n                <div class="form-group col-sm-8">\n                  <div id="author-alert-container"></div>\n                </div>\n              </div>\n            </form>\n      </div>\n\n      <div class="modal-footer">\n        <button type="button" class="btn btn-primary" ng-click="saveTemplate()">{{ ::\'SaveTemplateDialogConfirmOk\' | localize: \'Save\' }}</button>\n      </div>\n    </div>\n  </div>\n</div>\n')}]);

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

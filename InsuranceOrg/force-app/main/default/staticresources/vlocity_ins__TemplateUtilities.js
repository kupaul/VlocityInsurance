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
angular.module('templateutilities', ['vlocity', 'ngSanitize'])
  .config(['remoteActionsProvider', function(remoteActionsProvider) {
      'use strict';
      remoteActionsProvider.setRemoteActions(window.remoteActions || {});
  }]);

require('./modules/templateutilities/factory/Save.js');

},{"./modules/templateutilities/factory/Save.js":2}],2:[function(require,module,exports){
/* globals Sass */
angular.module('templateutilities')
  .factory('save', function($q, $window, remoteActions, $rootScope, $timeout, $localizable, htmlUnescapeFilter) {
    'use strict';

    var sass = new Sass();

    remoteActions.getSassMixins().then(function(mixins) {
        $rootScope.mixins = [];
        if (mixins) {
            $rootScope.mixins = mixins;
            $rootScope.mixins.forEach(function(mixin) {
                var ngSass = mixin[fileNsPrefix() + 'Sass__c'] ? htmlUnescapeFilter(mixin[fileNsPrefix() + 'Sass__c']) : '';
                sass.writeFile(mixin.Name, ngSass);
            });
        }
    });

    function adaptTemplateJsonForSave(json) {
        //json[fileNsPrefix + 'ExternalID__c'] = json[fileNsPrefix + 'ExternalID__c']? json[fileNsPrefix + 'ExternalID__c'] : getExternalID(json);
        //console.log('json to save ',json);
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
                return outputObject;
            }, {});
            if (!sawSass) {
                resolve(outputObject);
            }
        });
        return pendingCompilePromise;
    }

    function shouldSave(item, json) {
        // console.log('in shouldSave ',item,json);
        if (item.saving || (item.errors && item.errors.length > 0)) {
            console.error('error saving template ',item.Name, item.errors);
            return false;
        } else if (!item.Name || item.Name === '') {
            if (item.Id) {
                item.errors = [{
                    message: $localizable('DesignerMustSetName', 'You must set a name'),
                    property: 'Name'
                }];
            }
            return false;
        } else if (!item[fileNsPrefix() + 'Type__c'] || item[fileNsPrefix() + 'Type__c'] === '') {
            item.errors = [{
                message: $localizable('DesignerMustSetType', 'You must set a type'),
                property: fileNsPrefix() + 'Type__c'
            }];
            return false;
        }

        // check layout name doesn't exist already
        if (item.createNewTemplate && $rootScope.templates.find(function(template) {
            // a template name is duplicated if it was created by the "New" button from the TemplateHome page (item.createNewTemplate)
            // and its name is the same as an existing one in the DB
            return template.Name.toLowerCase() === item.Name.toLowerCase();
        })) {
            item.errors = [{
                message: $localizable('DesignerNameAlreadyInUse', 'This name is already in use'),
                property: 'Name'
            }];
            return false;
        }

        var specialCharacters =  /[~`!#$%\^&*+=\[\]\\';,/{}|:<>\?]/;
        if (specialCharacters.test(item.Name)) {
            item.errors = [{
                message: $localizable('specialCharactersInName', 'Name should not contain special characters.'),
                property: 'Name'
            }];
            return true;
        }

        if (angular.equals(item.originalJson, json)) {
            return false;
        }

        item.originalJson = json;
        item.saving = true;
        item.errors = null;
        return item;
    }

    function getExternalID(template) {
        //return template.Name + '/' + template[fileNsPrefix + 'Version__c'] + '/' +template[fileNsPrefix + 'Author__c'] + '/' + new Date().getTime();
        template[fileNsPrefix() + 'Version__c'] = template[fileNsPrefix() + 'Version__c'] ? template[fileNsPrefix() + 'Version__c'] : 1.0;
        return template.Name + '/' + template[fileNsPrefix() + 'Version__c'] + '/' + template[fileNsPrefix() + 'Author__c'];
    }

    function saveTemplate(template) {
        return adaptTemplateJsonForSave(template).then(function(jsonToSave) {
            if (shouldSave(template, jsonToSave)) {
                template.saving = true;
                return remoteActions.saveTemplate(jsonToSave)
                  .then(function(updatedTemplate) {
                      template.saving = false;
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
                          if (template[ fileNsPrefix() + 'Type__c'] === 'mixin') {
                              var ngSass = template[ fileNsPrefix() + 'Sass__c'] ? htmlUnescapeFilter(template[ fileNsPrefix() + 'Sass__c']) : '';
                              sass.writeFile(template.Name, ngSass);
                          }
                      }
                      return template;
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

},{}]},{},[1]);
})();

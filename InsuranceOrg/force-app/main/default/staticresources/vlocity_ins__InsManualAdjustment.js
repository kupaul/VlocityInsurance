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
angular.module('insManualAdjustment', ['vlocity',  'cfp.hotkeys',  'CardFramework', 'sldsangular', 'forceng',
    'ngSanitize', 'insDirectives'
    ]).config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    }]).config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }]).run(['$rootScope', function($rootScope) {
        'use strict';
        $rootScope.nsPrefix = fileNsPrefix();
        $rootScope.isLoaded = false;
        $rootScope.setLoaded = function(boolean) {
            $rootScope.isLoaded = boolean;
        };
        $rootScope.notification = {
            message: '',
            type: '',
            active: false
        };
    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        'use strict';
        return function(sldsURL) {
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]).filter('formatCurrency', ['$rootScope', function($rootScope) {
        'use strict';
        return function(amount, currencyCode) {
            if(!amount) {
                amount = 0;
            }
            currencyCode = currencyCode ? currencyCode : $rootScope.vlocity.userCurrency;
            return amount.toLocaleString($rootScope.vlocity.userAnLocale, {style: 'currency', currency: currencyCode || 'USD'});
        };
    }]);


// Directives
require('./modules/insManualAdjustment/directive/InsManualAdjustment.js');

// Templates
require('./modules/insManualAdjustment/templates/templates.js');

// Factory
require('./modules/insManualAdjustment/factory/InsManualAdjustmentFactory.js');


},{"./modules/insManualAdjustment/directive/InsManualAdjustment.js":2,"./modules/insManualAdjustment/factory/InsManualAdjustmentFactory.js":3,"./modules/insManualAdjustment/templates/templates.js":4}],2:[function(require,module,exports){
(function() {
    'use strict';
    angular.module('insManualAdjustment')
        .component('insManualAdjustment', {
            templateUrl: 'ins-manual-adjustment-template.tpl.html',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                initFn: '@?',
                initFnHandler: '@?',
                saveFn: '@?',
                saveFnHandler: '@?',
                records: '@?',
                quoteId: '@?'
            },
            controllerAs: 'vloc',
            controller: InsManualAdjustmentController
        });

    InsManualAdjustmentController.$inject = ['$scope', '$rootScope', '$q', '$window', '$timeout', 'InsManualAdjustmentFactory', 'dataService', 'userProfileService'];

    function InsManualAdjustmentController($scope, $rootScope, $q, $window, $timeout, InsManualAdjustmentFactory, dataService, userProfileService) {

        $scope.unitAdjustments = 0;
        var vloc = this,
            defaultConfig = {
            };

        vloc.$onInit = doInit;

        $scope.customLabels = {};
        const translationKeys = ['InsQuotesNetPremium', 'InsQuotesGrossPremium', 'InsQuotesAdjustments', 'InsQuotesCommentsRequired',
            'InsQuotesAddComments', 'InsQuotesAddCommentsPlaceholder', 'Save'];

        userProfileService.getUserProfile().then(function(user){
            let userLanguage = user.language.replace("_", "-") || user.language;
            dataService.fetchCustomLabels(translationKeys, userLanguage).then(
                function(translatedLabels) {
                    $scope.customLabels = translatedLabels;
                }
            )
        });

        window.addEventListener("message", function(event) {
            if(event.data === '[iFrameSizer]message:"ReloadChildAdjustments"'){
                $rootScope.isLoaded = false;
                var inputMap = {
                    quoteId : vloc.quoteId
                };
                InsManualAdjustmentFactory.invokeRemoteMethod($scope, vloc.initFnHandler, vloc.initFn, inputMap);
            }
        }, false);

        var urlParam = function(name){
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results === null){
               return null;
            }
            else{
               return decodeURI(results[1]) || 0;
            }
        };

        function doInit(){
            if(!vloc.quoteId){
                vloc.quoteId = urlParam('id');
            }
            if(!vloc.records){
                var inputMap = {
                    quoteId : vloc.quoteId
                };
                InsManualAdjustmentFactory.invokeRemoteMethod($scope, vloc.initFnHandler, vloc.initFn, inputMap);
            }
        }

        $scope.saveAttr = function(){
            $timeout(function() {
                var inputMap = {};
                var attrs = {};
                var hasError = false;
                $scope.unitAdjustments = 0;
                for(var i = 0; i < $scope.attrs.length; i++){
                    if(!$scope.attrs[i].adjustmentJustification && $scope.attrs[i].adjustmentComments === 'Required'){
                        $scope.attrs[i].throwError = true;
                        $scope.attrs[i].editComments = true;
                        hasError = true;
                    } else {
                          $scope.attrs[i].throwError = false;
                    }
                    attrs[$scope.attrs[i].code] = {
                        value : $scope.attrs[i].userValues,
                        justification : $scope.attrs[i].adjustmentJustification
                    };
                    if($scope.attrs[i].adjustmentUnits === 'Currency') {
                        $scope.unitAdjustments += $scope.attrs[i].userValues;
                    } else {
                        $scope.unitAdjustments += ($scope.attrs[i].userValues / 100) * $scope.unitPrice;
                    }
                }
                if(!hasError){
                    attrs.adjustments = $scope.unitAdjustments;
                    inputMap.quoteId  = vloc.quoteId;
                    inputMap.adjustmentsMap = attrs;
                    $rootScope.isLoaded = false;
                    InsManualAdjustmentFactory.saveRemoteMethod($scope, vloc.saveFnHandler, vloc.saveFn, inputMap);
                }
            }, 1000);

         };

    }

})();

},{}],3:[function(require,module,exports){
angular.module('insManualAdjustment').factory('InsManualAdjustmentFactory',
['$rootScope', '$q', 'dataSourceService',
function($rootScope, $q, dataSourceService) {
    'use strict';

    var refreshList = function() {
        var message = {
            event: 'reload'
        };
        $rootScope.$broadcast('vlocity.layout.ins-manual-adjustment-template-tpl.html', message);
        $rootScope.isLoaded = true;
    };

    var REMOTE_CLASS = 'InsurancePCRuntimeHandler';
    var DUAL_DATASOURCE_NAME = 'Dual';
    var insideOrg = false;
    var errorContainer = {};
    var getDualDataSourceObj = function(actionObj) {
        var datasource = {};
        var temp = '';
        var nsPrefix = fileNsPrefix().replace('__', '');

        if (actionObj.remote.remoteClass) {
            temp = REMOTE_CLASS;
            REMOTE_CLASS = actionObj.remote.remoteClass || temp;
        }
        if (actionObj) {
            datasource.type = DUAL_DATASOURCE_NAME;
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.inputMap = actionObj.remote.params || {};
            datasource.value.remoteClass = REMOTE_CLASS;
            datasource.value.remoteMethod = actionObj.remote.params.methodName;
            datasource.value.endpoint = actionObj.rest.link;
            datasource.value.methodType = actionObj.rest.method;
            datasource.value.body = actionObj.rest.params;
        } else {
            console.log('Error encountered while trying to read the actionObject');
        }
        if (temp) {
            REMOTE_CLASS = temp;
        }
        return datasource;
    };

    return {
        invokeRemoteMethod: function(scope, remoteClass, remoteMethod, inputMap) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('Calling: ', remoteMethod);
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = remoteClass;
            datasource.value.remoteMethod = remoteMethod;
            datasource.value.inputMap = inputMap;
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.endpoint = '/services/apexrest/' + nsPrefix + '/v2/campaigns/';
            datasource.value.apexRestResultVar = 'result.records';

            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    $rootScope.isLoaded = true;
                    if(data.records && data.records[0] && data.records[0].currencyCode) {
                        scope.currencyCode = data.records[0].currencyCode;
                        $rootScope.currencyCode = data.records[0].currencyCode;
                    }

                    deferred.resolve(data);
                    if(remoteMethod === 'getRootAdjustments'){
                        scope.results = data.records;
                        scope.attrs = [];
                        for(var i = 0; i < scope.results.length; i++){
                            scope.unitPrice = scope.results[i].UnitPrice;
                            scope.unitAdjustments = scope.results[i].Adjustments;
                            if(scope.results[i] && scope.results[i].attributeCategories && scope.results[i].attributeCategories.records){
                                for(var j = 0; j < scope.results[i].attributeCategories.records.length; j++){
                                    for(var k = 0; k < scope.results[i].attributeCategories.records[j].productAttributes.records.length; k++){
                                        console.log(scope.results[i].attributeCategories.records[j].productAttributes.records[k]);
                                        if(scope.results[i].attributeCategories.records[j].productAttributes.records[k].adjustmentUnits){
                                            scope.results[i].attributeCategories.records[j].productAttributes.records[k].adjustments = scope.results[i].attributeCategories.records[j].productAttributes.records[k].userValues;
                                            scope.attrs.push(scope.results[i].attributeCategories.records[j].productAttributes.records[k]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    $rootScope.isLoaded = true;
                });
            return deferred.promise;
        },  saveRemoteMethod: function(scope, remoteClass, remoteMethod, inputMap) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('Calling: ', remoteMethod);
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = remoteClass;
            datasource.value.remoteMethod = remoteMethod;
            datasource.value.inputMap = inputMap;
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.endpoint = '/services/apexrest/' + nsPrefix + '/v2/campaigns/';
            datasource.value.apexRestResultVar = 'result.records';

            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    $rootScope.isLoaded = true;
                    console.log(data);
                    deferred.resolve(data);
                    var message = "RefreshHighlightPanel";
                    parent.postMessage(message, '*');

                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    $rootScope.isLoaded = true;
                });
            return deferred.promise;
        }
    };
}]);
},{}],4:[function(require,module,exports){
angular.module("insManualAdjustment").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("ins-manual-adjustment-template.tpl.html",'<div class="ins-manual-adjustment slds-form-element" id="ins-manual-adjustment-template">\n    <div class="slds-size_1-of-1 slds-grid slds-wrap slds-p-bottom_small slds-border_bottom slds-p-right_small">\n        <div class="slds-text-title_caps slds-size_2-of-3 slds-float_right">\n            {{ ::customLabels.InsQuotesGrossPremium }}\n        </div>\n        <div class="slds-size_1-of-3 slds-float_left slds-text-align_right">\n            {{unitPrice | formatCurrency : $root.currencyCode}}\n        </div>\n        <div class="slds-text-title_caps slds-size_2-of-3 slds-float_right">\n            {{ ::customLabels.InsQuotesAdjustments }}\n        </div>\n        <div class="slds-size_1-of-3 slds-float_left slds-text-align_right">\n            {{unitAdjustments | formatCurrency : $root.currencyCode}}\n        </div>\n        <div class="slds-text-title_caps  slds-size_2-of-3 slds-float_right">\n            {{ ::customLabels.InsQuotesNetPremium }}\n        </div>\n        <div class="slds-size_1-of-3 slds-float_left slds-text-align_right">\n            {{unitPrice + unitAdjustments | formatCurrency : $root.currencyCode}}\n        </div>\n    </div>\n    <div class="slds-m-bottom_large" ng-repeat="attr in attrs">\n        <div class="slds-size_1-of-1 vloc-title">\n            <label class="slds-form-element__label" for="slider-id-{{index}}-label">\n                <span class="slds-slider-label">\n                    <span class="slds-slider-label__label slds-p-right_small">{{attr.label}}</span>\n                </span>\n            </label>\n            <div class="vloc-value slds-slider__value slds-float_right" aria-hidden="true">\n                <span\n                    ng-if="attr.adjustmentUnits === \'Percentage\' || attr.adjustmentUnits === \'Percent\'">{{attr.userValues}}%</span>\n                <span\n                    ng-if="attr.adjustmentUnits === \'Currency\'">{{attr.userValues | formatCurrency : $root.currencyCode}}</span>\n            </div>\n        </div>\n        <div class="slds-form-element__control slds-grid slds-size_1-of-1 slds-wrap slds-p-right_medium"\n            ng-if="attr.inputType === \'equalizer\'">\n            <slds-equalizer class="slds-size_1-of-1" attr="attr" index="{{$index}}" ng-model="attr.userValues"\n                ng-change="saveAttr()"></slds-equalizer>\n        </div>\n        <div class="slds-form-element__control slds-grid slds-size_1-of-1 slds-wrap" ng-if="attr.inputType === \'range\'">\n            <div class="slds-form-element slds-size_1-of-1">\n                <label class="slds-form-element__label" for="slider-id-01">\n                    <span class="slds-slider-label">\n                        <span class="slds-slider-label__range"> <span\n                                ng-if="attr.adjustmentUnits === \'Percentage\' || attr.adjustmentUnits === \'Percent\'">{{attr.min}}%</span>\n                            <span\n                                ng-if="attr.adjustmentUnits === \'Currency\'">{{attr.min | formatCurrency : $root.currencyCode}}</span>\n                            - <span\n                                ng-if="attr.adjustmentUnits === \'Percentage\' || attr.adjustmentUnits === \'Percent\'">{{attr.max}}%</span>\n                            <span\n                                ng-if="attr.adjustmentUnits === \'Currency\'">{{attr.max | formatCurrency : $root.currencyCode}}</span></span>\n                    </span>\n                </label>\n                <div class="slds-form-element__control">\n                    <div class="slds-slider slds-m-left_xx-small">\n                        <input type="range" id="slider-id-01" min="{{attr.min}}" max="{{attr.max}}"\n                            class="slds-slider__range" ng-model="attr.userValues" ng-change="saveAttr()" />\n                        <span class="slds-slider__value" aria-hidden="true"></span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="slds-p-horizontal_large slds-form-element__control slds-grid slds-size_1-of-1 slds-wrap"\n            ng-if="attr.inputType !== \'equalizer\' && attr.inputType !== \'range\'">\n            <input class="slds-input slds-size_1-of-2" type="number" format="currency" ng-model="attr.userValues"\n                ng-change="saveAttr()" />\n        </div>\n        <div class="ins-manual-adjustment-comments slds-p-top_x-small slds-p-horizontal_medium slds-m-horizontal_x-small slds-grid slds-wrap"\n            ng-if="attr.adjustmentComments !== \'Not Used\'">\n            <div class="vloc-has-error slds-text-color_error slds-text-align_center" ng-if="attr.throwError">\n                {{ customLabels.InsQuotesCommentsRequired }}\n            </div>\n            <div class="vloc-add-comments" ng-if="!attr.editComments && !attr.adjustmentJustification"\n                ng-click="attr.editComments = true" ng-if="!attr.adjustmentJustification">\n                {{ ::customLabels.InsQuotesAddComments }}</div>\n            <div ng-if="!attr.editComments" ng-click="attr.editComments = true" class="vloc-comments">\n                {{attr.adjustmentJustification}}\n                <div class="vloc-edit slds-p-horizontal_xx-small slds-float_right">\n                    <slds-button-svg-icon sprite="\'utility\'" icon="\'edit\'" size="\'small\'"\n                        ng-click="attr.editComments = !attr.editComments"></slds-button-svg-icon>\n                </div>\n            </div>\n            <textarea type="text" class="slds-textarea" ng-model="attr.adjustmentJustification"\n                placeholder="{{ customLabels.InsQuotesAddCommentsPlaceholder }}" ng-show="attr.editComments"></textarea>\n            <div ng-if="attr.editComments" class="slds-link vloc-comments"\n                ng-click="attr.editComments = false; saveAttr();">{{ ::customLabels.Save }}</div>\n        </div>\n    </div>\n\n</div>\n\n<style type="text/css">\n    .ins-manual-adjustment-comments {\n        position: relative;\n    }\n\n    .vloc-has-error {\n        font-size: .6rem;\n    }\n\n    .vloc-title {\n        position: relative;\n    }\n\n    .vloc-value {\n        font-size: .8rem;\n        margin-right: 0.7rem;\n        margin-top: .2rem;\n        color: #54698d;\n    }\n\n    .vloc-edit {\n        top: -2px;\n        position: relative;\n        color: #dddbda;\n    }\n\n    .vloc-edit:hover {\n        cursor: pointer;\n    }\n\n    .vloc-add-comments {\n        font-style: italic;\n        font-size: .6rem;\n        color: #dddbda;\n    }\n\n    .vloc-add-comments:hover {\n        cursor: pointer;\n    }\n\n    .vloc-comments {\n        color: #005fb2;\n        font-size: .6rem;\n    }\n\n    .vloc-comments:hover {\n        cursor: pointer;\n    }\n</style>')}]);

},{}]},{},[1]);
})();

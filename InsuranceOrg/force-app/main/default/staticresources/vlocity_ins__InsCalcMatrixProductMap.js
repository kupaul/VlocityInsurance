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
angular.module('insCalcMatrixProductMap', ['vlocity', 'CardFramework', 'sldsangular', 'forceng',
    'ngSanitize', 'cfp.hotkeys', 'insValidationHandler', 'dndLists', 'insRules', 'insFormulaBuilder'
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
    }]);

// Controllers
require('./modules/insCalcMatrixProductMap/controller/InsCalcMatrixProductMapController.js');

// Factories
require('./modules/insCalcMatrixProductMap/factory/InsCalcMatrixProductMapService.js');

},{"./modules/insCalcMatrixProductMap/controller/InsCalcMatrixProductMapController.js":2,"./modules/insCalcMatrixProductMap/factory/InsCalcMatrixProductMapService.js":3}],2:[function(require,module,exports){
angular.module('insCalcMatrixProductMap').controller('InsCalcMatrixProductMapController',
    ['$scope', '$rootScope', '$timeout', '$filter', '$q', 'InsCalcMatrixProductMapService', 'dataService', 'userProfileService', function(
    $scope, $rootScope, $timeout, $filter, $q, InsCalcMatrixProductMapService, dataService, userProfileService) {
    'use strict';

    $scope.showOutputCarrot = {};
    $rootScope.isLoaded = true;
    $scope.effectiveDate;

    $scope.getValueLength = function(value, index) {
        $scope.showOutputCarrot[index] = Object.keys(value).length > 2;
    };

    const translationKeys = ['InsProductEffectiveDate', 'InsProductVlocityProductSimulator', 'InsProductSimulate', 'InsProductRatingInputs', 'InsProductInputMapping',
        'InsProductSimulateValues','InsProductRatingOutputs', 'InsProductOutputMapping', 'InsProductTotalInsuredFormula', 'InsProductTotalPricingFormulaResult',
        'InsProductInsuredFormulaResult', 'Output', 'InsProductNoOutput', 'Input', 'InsProductRatingInputs', 'InsProductOptional', 'InsProductTotalPricingFormula',
        'InsProductTotalPricingFormulaResult', 'InsProductSetFormulaProduct', 'InsProductSetTotalInsuredFormula', 'InsProductCopiedToClipboard', 'InsProductParameters'];

    userProfileService.getUserProfile().then(function(user){
        let userLanguage = user.language.replace("_", "-") || user.language;
        dataService.fetchCustomLabels(translationKeys, userLanguage).then(
            function(translatedLabels) { 
                $scope.customLabels = translatedLabels;
            }
        )
    })

    $scope.notification = {
        message: '',
        type: 'success',
        show: false
    };

    $scope.rulesOptions = {
        ruleTypes: [
            'Expression'
        ],
        messageTypes: [{
            code: 'INFO',
            label: 'Information'
        }, {
            code: 'WARN',
            label: 'Warning'
        }, {
            code: 'ERROR',
            label: 'Error'
        }, {
            code: 'RECOMMENDATION',
            label: 'Recommendation'
        }]
    };

    $scope.showRules = function(index) {
        for (var i = 0; i < $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'].length; i++) {
            $rootScope.config.attr[$rootScope.nsPrefix + 'ValidValuesData__c'][i].showRules = index === i;
        }
    };

    //Handle splitcode rating input
    function pairSplitCodeRatingInput(value, simulateMap, key) {
        const char = /[/!@#%&*()\*?+^${}[\]().|\\]/;
        value.splitDecoderArr = value.valueDecoder.split(char);
        value.splitDecoderArr.forEach(split => {split = trim(split)});
        for (let splitCode in value.breakdownRatingInput) {
            let splitRatingInput = value.breakdownRatingInput[splitCode];
            if ($scope.records.ratingMappings.pricingInterface[key]) {
                let isRatingInputOpt = $scope.records.ratingMappings.pricingInterface[key].pricingInputVariables ? $scope.records.ratingMappings.pricingInterface[key].pricingInputVariables.indexOf(splitRatingInput) >= 0 : true;
                if (isRatingInputOpt) {
                    simulateMap.show[splitRatingInput] = value.breakdownAttrValue[splitCode];
                } else {
                    value.breakdownRatingInput[splitCode] = undefined;
                }
            }
        }
    }


    $scope.setRecords = function(records) {
        console.log(records);
        $scope.records = records;
        if($scope.records){
            if(!$scope.records.ratingMappings.productRatingInfo.ratingOptions){
                $scope.records.ratingMappings.productRatingInfo.ratingOptions = {};
            } else {
                delete $scope.records.ratingMappings.productRatingInfo.ratingOptions.vlcClass;
            }
            if(!$scope.records.ratingMappings.productRatingInfo.ratingOptions.effectiveDate){
                let today = moment().format('MM/DD/YY');
                $scope.records.ratingMappings.productRatingInfo.ratingOptions.effectiveDate = today;
            }
            $scope.procedures = {
                calcProc: [],
                intProc: []
            };
            var procedures = {};
            var versionId, procedureType, configurationName;
            var simulateMap = {
                input: {},
                config: {},
                show: {},
                output: {}
            };
            $scope.outputArray = [];

            if ($scope.records.ratingMappings.productRatingInfo.ratingFields) {
                simulateMap.show = $scope.records.ratingMappings.productRatingInfo.ratingFields;
            }

            $scope.rootProductId = $scope.records.ratingMappings.productRatingInfo.rootProductId;
            if($scope.records.ratingMappings.pricingInterface[$scope.rootProductId]){
                let rootProcedureInfo = $scope.records.ratingMappings.pricingInterface[$scope.rootProductId];
                if(rootProcedureInfo && rootProcedureInfo.procedureType === 'Integration Procedure'){
                    simulateMap.show.productKey = $scope.rootProductId; 
                    simulateMap.show.parentProdKey = $scope.rootProductId; 
                }
            }
            for (var k in $scope.records.ratingMappings.productRatingInfo.productRatingOutputs) {
                $scope.records.ratingMappings.productRatingInfo.productRatingOutputs[k].key =  k;
                for (var j in $scope.records.ratingMappings.productRatingInfo.productRatingOutputs[k]) {
                    if (typeof $scope.records.ratingMappings.productRatingInfo.productRatingOutputs[k][j] === 'object') {
                        $scope.records.ratingMappings.productRatingInfo.productRatingOutputs[k].hasChildren = true;
                    }
                }
                $scope.outputArray.push($scope.records.ratingMappings.productRatingInfo.productRatingOutputs[k]);
            }
            for (var key in $scope.records.ratingMappings.pricingInterface) {
                if ($scope.records.ratingMappings.productRatingInfo.productRatingInputs[key]) {
                    var values = $scope.records.ratingMappings.productRatingInfo.productRatingInputs[key];
                    var count = 0;
                    if (values.instanceKey !== undefined) {
                        let code = values.productCode + '.instanceKey';
                        simulateMap.input[code] = {
                            ratingInput: code,
                            value: values.instanceKey
                        };
                        if(values.instanceKey !== ''){
                            simulateMap.show[code] = values.instanceKey;
                        }
                        count++;
                    }
                    for (let k in values) {
                        if (typeof values[k] === 'object' && values[k] !== null) {
                            if(values[k].attributeDataType === 'Boolean' && typeof values[k].attributeDefaultValue === 'string') {
                                values[k].attributeDefaultValue = JSON.parse(values[k].attributeDefaultValue);
                            }
                            simulateMap.input[k] = {
                                ratingInput: values[k].breakdownRatingInput || values[k].ratingInput,
                                value: values[k].breakdownAttrValue || values[k].attributeDefaultValue 
                            };
                            count += 1;
                            values[k].count = count;
                            if (values[k].ratingInput && values[k].attributeDefaultValue) {
                                if (!values[k].breakdownRatingInput) {
                                    simulateMap.show[values[k].ratingInput] = values[k].attributeDefaultValue;
                                } else {
                                    pairSplitCodeRatingInput(values[k], simulateMap, key);
                                }
                            }
                        }
                    }
                }
                var prod = {};
                if ($scope.records.ratingMappings.pricingInterface[key]) {
                    prod = $scope.records.ratingMappings.pricingInterface[key];
                    if(prod.pricingInputVariables) {
                        prod.pricingInputVariables.push('');
                    }
                    if(prod.pricingOutputVariables) {
                        prod.pricingOutputVariables.push('');
                    }
                }
                prod.tags = [];
                if (prod.pricingOutputVariables) {
                    for (var i = 0; i < prod.pricingOutputVariables.length; i++) {
                        var textObj = {
                            value: prod.pricingOutputVariables[i]
                        };
                        var obj = {
                            insertText: textObj,
                            label:  prod.pricingOutputVariables[i]
                        };
                        prod.tags.push(obj);
                    }
                }

            }
            for (var j in procedures) {
                if (procedures[j] === 'Calculation Procedure') {
                    $scope.procedures.calcProc.push(j);
                } else {
                    $scope.procedures.intProc.push(j);
                }
            }
            console.log($scope.procedures);
            $scope.simulateMap = simulateMap;
        }
    };

    $scope.navigateTo = function(id) {
        if ((typeof sforce !== 'undefined') && (sforce !== null)) {
            sforce.one.navigateToSObject(id, 'detail');
        } else {
            window.location.href = '/' + id;
        }
    };

    $scope.simulate = function() {
        $rootScope.isLoaded = false;
        delete $scope.records.ratingMappings.productRatingInfo.ratingOptions.vlcClass;
        var inputMap = {
            productRatingInfo: $scope.records.ratingMappings.productRatingInfo
        };
        let optionsMap;
        let optionsMapType = typeof $scope.records.ratingMappings.productRatingInfo.ratingOptions;
        let showProductKey;
        if(optionsMapType === 'string'){
            optionsMap = angular.copy(JSON.parse($scope.records.ratingMappings.productRatingInfo.ratingOptions));
            $scope.records.ratingMappings.productRatingInfo.ratingOptions = JSON.parse($scope.records.ratingMappings.productRatingInfo.ratingOptions);
        } else {
            optionsMap = angular.copy($scope.records.ratingMappings.productRatingInfo.ratingOptions);
        }
        var values = Object.values($scope.simulateMap.input);
        if($scope.simulateMap.show.productKey){
            showProductKey = true;
        }
        $scope.simulateMap.show = {};
        if ($scope.records.ratingMappings.productRatingInfo.ratingFields) {
            $scope.simulateMap.show = $scope.records.ratingMappings.productRatingInfo.ratingFields;
        }
        if(showProductKey){
            $scope.simulateMap.show.productKey = $scope.rootProductId; 
            $scope.simulateMap.show.parentProdKey = $scope.rootProductId; 
        }
        for (var i = 0; i < values.length; i++) {
            let ratingInputType = typeof values[i].ratingInput;
            if (values[i].value !== null && values[i].value !== '') {
                if (ratingInputType !== 'object') {
                    $scope.simulateMap.show[values[i].ratingInput] = values[i].value;
                } else {
                    for (let splitCode in values[i].ratingInput){
                        if (values[i].ratingInput[splitCode] !== undefined && values[i].ratingInput[splitCode] !== '') {
                            $scope.simulateMap.show[values[i].ratingInput[splitCode]] = values[i].value[splitCode];
                        }
                    }
                }
            }
        }
        InsCalcMatrixProductMapService.invokeRemoteMethod($scope, 'InsuranceProductAdminHandler',
            'saveRatingInputOutputs', inputMap);
        var result = InsCalcMatrixProductMapService.setSimulationRating($scope, 'InsuranceProductAdminHandler',
            'getSimulateRate', inputMap, optionsMap);
    };

    $scope.saveIO = function() {
        var inputMap = {
            productRatingInfo: $scope.records.ratingMappings.productRatingInfo
        };
        InsCalcMatrixProductMapService.invokeRemoteMethod($scope, 'InsuranceProductAdminHandler',
            'saveRatingInputOutputs', inputMap);
    };

    $scope.searchProductListCallback = function(query, list, callback) {
        query = query.trim();
        var filter = {};
        if (query !== '') {
            filter.text = query;
            var data = $filter('filter')(list, filter);
            callback(data);
        }else {
            callback(list);
        }
    };

    $scope.searchText = function(query, list) {
        var deferred = $q.defer();
        var callbackfunction = function(result) {
            $scope.$apply(function() {
                var sresult = [];
                if (result) {
                    sresult = angular.fromJson(result);
                }
                deferred.resolve(sresult);
            });
        };
        $scope.searchProductListCallback(query, list, callbackfunction);
        return deferred.promise;
    };

    $scope.strTag = function(obj) {
        var str = '';
        for (var i = 0; i < obj.length; i++) {
            str += obj[i].text + ' ';
        }
        return str;
    };

    $scope.copyToClipboard = function(element) {
        var $temp = $('<input>');
        $('body').append($temp);
        $temp.val($(element).text()).select();
        document.execCommand('copy'); 
        $temp.remove();
        $scope.notification.message = $rootScope.vlocity.getCustomLabel('InsProductCopiedToClipboard') || 'JSON Successfully Copied to Clipboard';
        $scope.notification.show = true;
        $scope.notification.type = 'Success';
        $timeout(function() {
        $scope.notification.show = false;
    }, 900);

    };
}]);

},{}],3:[function(require,module,exports){
angular.module('insCalcMatrixProductMap')
.factory('InsCalcMatrixProductMapService', ['$http', 'dataSourceService', 'dataService', '$q', '$rootScope', 'InsValidationHandlerService', function($http, dataSourceService, dataService, $q, $rootScope, InsValidationHandlerService) {
    'use strict';
    var REMOTE_CLASS = 'InsuranceProductAdminHandler';
    var DUAL_DATASOURCE_NAME = 'Dual';
    var insideOrg = false;
    var errorContainer = {};

    function getDualDataSourceObj(actionObj) {
        var datasource = {};
        var temp = '';
        var nsPrefix = fileNsPrefix().replace('__', '');

        if (actionObj.remote && actionObj.remote.remoteClass) {
            temp = REMOTE_CLASS;
            REMOTE_CLASS = actionObj.remote.remoteClass;
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
    }

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
            datasource.value.apexRestResultVar = 'result.records';

            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    $rootScope.isLoaded = true;
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    InsValidationHandlerService.throwError(error);
                    $rootScope.isLoaded = true;
                });
            return deferred.promise;
        },setSimulationRating: function(scope, remoteClass, remoteMethod, inputMap, optionsMap) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('Calling: ', remoteMethod);
            scope.simulateMap.output = null;
            for(let key in scope.records.ratingMappings.productRatingInfo.productRatingOutputs){
                scope.records.ratingMappings.productRatingInfo.productRatingOutputs[key].simulatedInsuredValue = null;   
                scope.records.ratingMappings.productRatingInfo.productRatingOutputs[key].simulatedValue = null;
            }
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = remoteClass;
            datasource.value.remoteMethod = remoteMethod;
            datasource.value.inputMap = inputMap;
            datasource.value.optionsMap = optionsMap;
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.apexRestResultVar = 'result.records';

            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    deferred.resolve(data);
                    console.log(data);
                    var result = JSON.parse(data.result);
                    if(result){
                        scope.simulateMap.output = result;
                        $rootScope.isLoaded = true;
                    var map = {};
                    if(scope.simulateMap.output){
                        for(var keyVal in scope.simulateMap.output){
                            console.log(keyVal);
                            if(keyVal !== 'ID'){
                                map[keyVal] = scope.simulateMap.output[keyVal];
                            }
                        }
                        for(var key in scope.records.ratingMappings.productRatingInfo.productRatingOutputs){
                            var source = scope.records.ratingMappings.productRatingInfo.productRatingOutputs[key].pricingSource; 
                            if(scope.records.ratingMappings.productRatingInfo.productRatingOutputs[key].isRoot &&  map.totalInsuredformulaResult){
                                scope.records.ratingMappings.productRatingInfo.productRatingOutputs[key].simulatedInsuredValue = map.totalInsuredformulaResult;
                            } else if(scope.records.ratingMappings.productRatingInfo.productRatingOutputs[key].totalInsuredFormula && map.iiTotalInsuredformulaResult) {
                                scope.records.ratingMappings.productRatingInfo.productRatingOutputs[key].simulatedInsuredValue =  map.iiTotalInsuredformulaResult;
                            }

                            if(scope.records.ratingMappings.productRatingInfo.productRatingOutputs[key].isRoot &&  map.formulaResult){
                                scope.records.ratingMappings.productRatingInfo.productRatingOutputs[key].simulatedValue = map.formulaResult;
                            } else if (scope.records.ratingMappings.productRatingInfo.productRatingOutputs[key].formula && map.iiFormulaResult) {
                                scope.records.ratingMappings.productRatingInfo.productRatingOutputs[key].simulatedValue = map.iiFormulaResult;
                            }
                            else {
                            scope.records.ratingMappings.productRatingInfo.productRatingOutputs[key].simulatedValue = map[source];
                            }
                            
                        }
                    }
                }
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                    InsValidationHandlerService.throwError(error);
                    $rootScope.isLoaded = true;
                });
            return deferred.promise;
        },
        /**
         * invokeAction : Use this method when the actions are straight forward based on actionObj.
         *
         * @param  {[object]} actionObj [Pass the action object]
         * @return {promise} [Result data]
         */
        invokeAction: function(actionObj) {
            console.log(actionObj);
            var deferred = $q.defer();
            var datasource = getDualDataSourceObj(actionObj);
            $rootScope.isLoaded = false;
            dataSourceService.getData(datasource, null, null).then(
                function(data) {
                    deferred.resolve(data);
                    console.log(data);
                    $rootScope.isLoaded = true;
                    refreshList();
                }, function(error) {
                    deferred.reject(error);
                    console.log(error);
                    InsValidationHandlerService.throwError(error);
                    $rootScope.isLoaded = true;
                });
            return deferred.promise;
        }
    };
}]);

},{}]},{},[1]);
})();

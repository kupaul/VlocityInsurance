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
const pricingCalculationConfigurationApp = angular.module('pricingCalculationConfigurationApp', ['vlocity', 'ngTagsInput','ui.bootstrap','ngAnimate', 'dndLists']).config(['remoteActionsProvider', function(remoteActionsProvider) {
    'use strict';
    remoteActionsProvider.setRemoteActions(vlocCALC.remoteActions || {});
}]);

// Controllers
require('./modules/pricingCalculationConfigurationApp/controller/PricingCalculationConfigurationCtrl.js');

// Factory
require('./modules/pricingCalculationConfigurationApp/factory/PricingCalculationConfigurationService.js');

// Directives
require('./modules/pricingCalculationConfigurationApp/directive/angular-drag-and-drop-lists.js');

// Templates
require('./modules/pricingCalculationConfigurationApp/templates/templates.js');

},{"./modules/pricingCalculationConfigurationApp/controller/PricingCalculationConfigurationCtrl.js":2,"./modules/pricingCalculationConfigurationApp/directive/angular-drag-and-drop-lists.js":3,"./modules/pricingCalculationConfigurationApp/factory/PricingCalculationConfigurationService.js":4,"./modules/pricingCalculationConfigurationApp/templates/templates.js":5}],2:[function(require,module,exports){
angular
    .module('pricingCalculationConfigurationApp')
    .controller(
        'pricingCalculationConfigurationCtrl',
        function($scope, $document, $timeout, $interval, pricingCalculationConfigurationService, $filter, $q)
        {
            $scope.isSforce = typeof sforce != 'undefined' && typeof sforce.one != 'undefined' ? true : false;
            $scope.namespacePrefix = vlocCALC.namespacePrefix;
            $scope.versionObj = JSON.parse(vlocCALC.versionObj);
            $scope.versionObjId = $scope.versionObj['Id'];
            $scope.enableLooping = false;
            const variablesWithNamespacePrefix = $scope.namespacePrefix + 'Variables__c';
            const constantsWithNamespacePrefix = $scope.namespacePrefix + 'Constants__c';
            const isEnabledWithNamespacePrefix = $scope.namespacePrefix + 'IsEnabled__c';
            const preprocessorWithNamespacePrefix = $scope.namespacePrefix + 'PreProcessorClass__c';
            const postprocessorWithNamespacePrefix = $scope.namespacePrefix + 'PostProcessorClass__c';
            const enableLoopingWithNameSpaceprefix = $scope.namespacePrefix + 'EnableLooping__c';

            const mathOperators = ['+', '-', '*', '/', '^'];
            const operators = ['(', ')', ','];
            const roundModes = ['UP', 'DOWN', 'HALF_UP', 'HALF_DOWN', 'HALF_EVEN', 'CEILING', 'FLOOR'];
            const inputFunctions = ['DATEDIFF', 'AGE', 'AGEON', 'MONTH', 'YEAR', 'EOM', 'ADDDAY', 'ADDMONTH', 'ADDYEAR', 'ROUND', 'TODAY ( )', 'SQRT', 'MAX', 'MIN', 'NOT'];
            const inputFunctionsAll = ['PREVIOUS'].concat(inputFunctions);

            pricingCalculationConfigurationService
                .getProcedureSettings()
                .then(function(result, event)
                {
                    console.log('getProcedureSettings', result);
                    $scope.procedureSettings = result;
                });

            if ($scope.versionObj[enableLoopingWithNameSpaceprefix] !== undefined)
            {
                $scope.enableLooping = $scope.versionObj[enableLoopingWithNameSpaceprefix];
            }
            $scope.versionEnabled = false;

            $scope.variables = [];
            if ($scope.versionObj[variablesWithNamespacePrefix] !== undefined)
                $scope.variables = JSON.parse($scope.versionObj[variablesWithNamespacePrefix]);
            $scope.constants = [];
            $scope.customClass = {};
            $scope.preProcessorClassName = '';
            $scope.postProcessorClassName = '';
            if ($scope.versionObj[constantsWithNamespacePrefix] !== undefined)
                $scope.constants = JSON.parse($scope.versionObj[constantsWithNamespacePrefix]);
            if ($scope.versionObj[isEnabledWithNamespacePrefix] !== undefined)
                $scope.versionEnabled = $scope.versionObj[isEnabledWithNamespacePrefix];
            if ($scope.versionObj[preprocessorWithNamespacePrefix] !== undefined)
            {
                $scope.customClass['preProcessorClassName'] = $scope.versionObj[preprocessorWithNamespacePrefix];
            }
            if ($scope.versionObj[postprocessorWithNamespacePrefix] !== undefined)
            {
                $scope.customClass['postProcessorClassName'] = $scope.versionObj[postprocessorWithNamespacePrefix];
            }

            $scope.sequenceNumber = 1;
            $scope.selectedPricingInput = {};

            $scope.variableTypes = ['Number', 'Boolean', 'Percent', 'Currency', 'Text', 'Date'];
            $scope.constantTypes = ['Number', 'Percent', 'Currency', 'Text'];

            $scope.pricingStepInputCopy = [];
            $scope.pricingStepInputs = JSON.parse(vlocCALC.svcSteps);
            $scope.validationErrors = [];
            $scope.validationErrorsFound = true;
            $scope.aggregateStepInputs = [];

            $scope.allMatrices;
            pricingCalculationConfigurationService.getPricingMatrixList($scope.versionObjId).then(function(result, event)
            {
                $scope.allMatrices = result;
            });

            $scope.dragging = false;
            $scope.autoScrollInterval = null;
            $scope.mousePosition = {
                y: 0
            };

            $scope.addVariableRow = function()
            {
                let idx = -1;
                for (let i = 0; i < $scope.variables.length; i++)
                {
                    $scope.variables[i].isEditable = false;
                    $scope.variables[i].isSelected = false;
                    if ($scope.variables[i].name.trim() == '' && $scope.variables[i].dataType.trim() == '') idx = i;
                }
                const newRow = {
                    name: '',
                    dataType: '',
                    alias: '',
                    typeaheadDisplayName: '',
                    isEditable: true,
                    userDefined: true,
                    isSelected: true,
                    precision: '',
                    defaultValue: ''
                };
                if (idx == -1)
                {
                    $scope.variables.push(newRow);
                }
                else
                {
                    $scope.variables[idx].isEditable = true;
                    $scope.variables[idx].isSelected = true;
                }
            };

            $scope.addConstantRow = function()
            {
                let idx = -1;
                for (let i = 0; i < $scope.constants.length; i++)
                {
                    $scope.constants[i].isEditable = false;
                    if ($scope.constants[i].name.trim() == '' &&
                        $scope.constants[i].dataType.trim() == '' &&
                        $scope.constants[i].value.trim() == '')
                        idx = i;
                }
                const newRow = {
                    name: '',
                    value: '',
                    dataType: '',
                    isEditable: true,
                    userDefined: true,
                    precision: '',
                    valuePlaceHolder: 'Enter a Value'
                };
                if (idx == -1) $scope.constants.push(newRow);
                else $scope.constants[idx].isEditable = true;
            };

            $scope.makeVariableEditable = function(index)
            {
                if ($scope.versionEnabled) index = -1;
                for (let i = 0; i < $scope.variables.length; i++)
                {
                    $scope.variables[i].isEditable = false;
                    $scope.variables[i].isSelected = false;
                }
                if (index > -1)
                {
                    if ($scope.variables[index].userDefined)
                    {
                        $scope.variables[index].isEditable = true;
                    }
                    $scope.variables[index].isSelected = true;
                }
            };
            $scope.makeConstantEditable = function(index)
            {
                if ($scope.versionEnabled) index = -1;
                for (let i = 0; i < $scope.constants.length; i++)
                {
                    $scope.constants[i].isEditable = false;
                }
                if (index > -1) $scope.constants[index].isEditable = true;
            };

            $scope.deleteFromVariables = function(currentName, index)
            {
                const variable = $scope.variables[index];
                $scope.validateIfUsedInMatrix(currentName, variable);

                $scope.variables.splice(index, 1);
            };

            $scope.deleteFromConstants = function(currentName, index)
            {
                const variable = $scope.constants[index];
                $scope.validateIfUsedInMatrix(currentName, variable);

                $scope.constants.splice(index, 1);
            };

            $scope.createVariableAlias = function(currentName, index)
            {
                $scope.validationErrors = [];
                const variable = $scope.variables[index];
                const oldVariable = angular.copy(variable);

                $scope.validateIfUsedInMatrix(currentName, variable);

                const variableName = variable.name;
                let alias = '';
                for (let i = 0; i < variableName.length; i++) // remove the spaces
                {
                    if (variableName[i] != ' ') alias = alias + variableName[i];
                }
                variable.alias = alias;

                $scope.validateVariableConstantUniqueness();
                if (variable.dataType != '')
                {
                    $scope.editCalculationSteps(oldVariable, variable);
                }
            };

            $scope.createConstantAlias = function(currentName, index)
            {
                $scope.validationErrors = [];
                const constant = $scope.constants[index];
                const oldConstant = angular.copy(constant);

                $scope.validateIfUsedInMatrix(currentName, constant);

                const constantName = constant.name;
                let alias = '';
                for (let i = 0; i < constantName.length; i++)
                {
                    if (constantName[i] != ' ') alias = alias + constantName[i];
                }
                constant.alias = alias;
                $scope.validateVariableConstantUniqueness();
                if (constant.value != '' && constant.dataType != '')
                {
                    $scope.editCalculationSteps(oldConstant, constant);
                    constant.precision = '';
                }
            };

            $scope.validateIfUsedInMatrix = function(currentName, variable)
            {
                let usedInMatrix = isUsedVariableInMatrix(currentName);
                // console.log('currentName', currentName, 'usedInMatrix', usedInMatrix, 'variable.name', variable.name);
                if (usedInMatrix.length > 0)
                {
                    $scope.validationErrors.push(currentName + ' was used in Matrix Lookup/s, ' + usedInMatrix);
                    // variable.name = currentName;
                }
            }

            function isUsedVariableInMatrix(currentName)
            {
                let usedInMatrix = [];

                let steps = $scope.pricingStepInputs;

                for (let i = 0; i < steps.length; i++)
                {
                    let step = steps[i];
                    if (step.matrixName == '' ||
                        usedInMatrix.indexOf(step.matrixName) > -1 ||
                        (!isInMatrixVariables(step.matrixInputTagList, currentName) &&
                            !isInMatrixVariables(step.matrixOutputTagList, currentName)))
                    {
                        continue;
                    }

                    usedInMatrix.push(step.matrixName);

                    // console.log('input', step.matrixInputTagList, 'output', step.matrixOutputTagList);
                }

                return usedInMatrix;
            };

            function isInMatrixVariables(variableList, currentName)
            {
                let found = false;

                if (!variableList) return found;

                for (let j = 0; j < variableList.length; j++)
                {
                    if (currentName != variableList[j].text) continue;

                    found = true;
                    break;
                }

                return found;
            }

            $scope.onConstantDataTypeChange = function(currentName, index)
            {
                const constant = $scope.constants[index];

                validateIfVariableDataTypeInMatrix(currentName, constant);

                if (constant.dataType === 'Text')
                {
                    constant.valuePlaceHolder = 'Enter text inside single quotes';
                }
            };

            $scope.onVariableDataTypeChange = function(currentName, index)
            {
                const variable = $scope.variables[index];

                validateIfVariableDataTypeInMatrix(currentName, variable);

                if (variable.dataType === 'Text' || variable.dataType === 'Boolean' || variable.dataType === 'Date')
                {
                    variable.precision = '';
                }
            };

            function validateIfVariableDataTypeInMatrix(currentName, variable)
            {
                let steps = $scope.pricingStepInputs;

                for (let i = 0; i < steps.length; i++)
                {
                    let step = steps[i];
                    if (step.matrixName == '') continue;

                    validateMatrixVariableDataType(step.matrixInputTagList, step.matrixName, currentName, variable);
                    validateMatrixVariableDataType(step.matrixOutputTagList, step.matrixName, currentName, variable);

                    // console.log('input', step.matrixInputTagList, 'output', step.matrixOutputTagList);
                }
            }

            function validateMatrixVariableDataType(variableList, matrixName, currentName, variable)
            {
                let dataType = getMatrixVariableDataType(variableList, currentName);

                // console.log('validateMatrixVariableDataType', 'matrix dataType', dataType, 'new datatype', variable.dataType);

                if (dataType != null && dataType != variable.dataType)
                {
                    $scope.validationErrors.push(currentName + ' was used in Matrix Lookup/s, ' + matrixName + ', with data type - ' + dataType);
                }
            }

            function getMatrixVariableDataType(variableList, currentName)
            {
                let dataType = null;

                // console.log('getMatrixVariableDataType', 'currentName', currentName, 'variableList', variableList);

                if (!variableList) return dataType;

                for (let j = 0; j < variableList.length; j++)
                {
                    if (currentName != variableList[j].text) continue;

                    dataType = variableList[j].dataType;

                    break;
                }

                return dataType
            }

            $scope.validateConstantValue = function(index)
            {
                const constant = $scope.constants[index];
                const constantValue = constant.value;
                if (constantValue != null && !isNumber(constantValue) && constant.dataType != 'Text')
                {
                    const replacedValue = constantValue.replace(/[^0-9.-]/g, '');
                    constant.value = replacedValue;
                }
            };

            $scope.editCalculationSteps = function(oldObject, newObject)
            {
                for (let i = 0; i < $scope.pricingStepInputs.length; i++)
                {
                    const stepInput = $scope.pricingStepInputs[i];
                    if (stepInput['functionType'] == 'Calculation')
                    {
                        $scope.setInputOutputTagList(stepInput);
                        const inputs = stepInput['calculationInputExpressions'];
                        const outputs = stepInput['calculationOutput'];

                        for (let j = 0; j < inputs.length; j++)
                        {
                            const input = inputs[j];
                            if (input['alias'] == oldObject['alias'])
                            {
                                input['dataType'] = newObject['dataType'];
                                input['text'] = newObject['name'];
                                input['alias'] = newObject['alias'];
                            }
                        }
                        for (let j = 0; j < outputs.length; j++)
                        {
                            const output = outputs[j];
                            if (output['alias'] == oldObject['alias'])
                            {
                                output['dataType'] = newObject['dataType'];
                                output['text'] = newObject['name'];
                                output['alias'] = newObject['alias'];
                            }
                        }
                    }
                }
            };

            function isNumber(n)
            {
                return n != undefined && !isNaN(parseFloat(n)) && isFinite(n);
            }

            $scope.addTooltipToTag = function()
            {
                jQuery(window).trigger('new-tag-added');
            };

            $scope.deleteFromPricingStep = function(index)
            {
                const pricingStep = $scope.pricingStepInputs[index];
                //If function type is Matrix Lookup, delete
                //the associated variables
                if (pricingStep['functionType'] == 'Matrix Lookup')
                {
                    const matrixName = pricingStep['matrixName'];
                    $scope.deleteMatrixVariables(matrixName, index, true);
                }
                $scope.pricingStepInputs.splice(index, 1);

                for (let i = 0; i < $scope.pricingStepInputs.length; i++)
                {
                    $scope.pricingStepInputs[i].sequence = i + 1;
                }
            };

            $scope.deleteFromAggregationStep = function(index)
            {
                $scope.aggregateStepInputs.splice(index, 1);
            };

            $scope.deleteMatrixVariables = function(matrixName, index, isDeleteStep)
            {
                let count = 0;
                for (let i = 0; i < $scope.pricingStepInputs.length; i++)
                {
                    if ($scope.pricingStepInputs[i]['matrixName'] == matrixName) count++;
                }

                if (count > 1) return;

                //Go over the variable list and delete variables whose alias
                //is associated to the Matrix being deleted
                const removalIndices = [];
                const variableNamesToDelete = [];
                for (let i = 0; i < $scope.variables.length; i++)
                {
                    const variable = $scope.variables[i];
                    // if a variable is defined prior to creating a lookup step but is also used in the lookup, it is not assigned a matrixName.
                    if (variable['matrixName'] != matrixName) continue;

                    removalIndices.push(i);
                    variableNamesToDelete.push(variable.alias);
                }
                for (let i = removalIndices.length - 1; i >= 0; i--)
                {
                    $scope.variables.splice(removalIndices[i], 1);
                }

                removeMatrixVarsFromSteps(matrixName, variableNamesToDelete, index, isDeleteStep);
            };

            function removeMatrixVarsFromSteps(matrixName, variableNamesToDelete, matrixIndex, isDeleteStep)
            {
                let stepsAffected = [];

                for (let i = 0; i < variableNamesToDelete.length; i++)
                {
                    const variableName = variableNamesToDelete[i];

                    // traverse all steps (except matrix lookup step) and delete variables related to the matrix lookup step deleted
                    for (let j = 0; j < $scope.pricingStepInputs.length; j++)
                    {
                        if (j == matrixIndex) continue;

                        const step = $scope.pricingStepInputs[j];

                        const calcFormulaTags = JSON.parse(step.calculationFormulaTags);

                        const calcInputJson = JSON.parse(step.calculationInputJSON);
                        const calcInputExps = step.calculationInputExpressions;

                        const calcInputTagList = step.calculationInputTagList;
                        const calcOutputTagList = step.calculationOutputTagList;

                        const calcOutput = step.calculationOutput;

                        const condInputs = JSON.parse(step.conditionalInputData);
                        const condInputExps = step.conditionalInputExpressions;

                        const sequence = isDeleteStep && j > matrixIndex ? step.sequence - 1 : step.sequence;

                        if (calcInputJson != null && calcInputJson.length > 0)
                        {
                            let inputJson = null;

                            if (calcInputJson.every(isNameNotTheVariable))
                            {
                                inputJson = calcInputJson;
                            }
                            else
                            {
                                if (stepsAffected.indexOf(sequence) < 0) stepsAffected.push(sequence);
                                inputJson = calcInputJson.filter(isNameNotTheVariable);
                            }

                            step.calculationInputJSON = JSON.stringify(inputJson);

                            function isNameNotTheVariable(element)
                            {
                                return element.name != variableName
                            }
                        }

                        if (calcFormulaTags != null && calcFormulaTags.length > 0)
                            step.calculationFormulaTag = JSON.stringify(excludeMatrixVariableViaAlias(calcFormulaTags, sequence, variableName));

                        if (calcInputExps != null && calcInputExps.length > 0)
                            step.calculationInputExpressions = excludeMatrixVariableViaAlias(calcInputExps, sequence, variableName);

                        if (condInputs != null && condInputs.length > 0)
                            step.conditionalInputData = JSON.stringify(excludeMatrixVariableViaAlias(condInputs, sequence, variableName));

                        if (condInputExps != null && condInputExps.length > 0)
                            step.conditionalInputExpressions = excludeMatrixVariableViaAlias(condInputExps, sequence, variableName);

                        if (calcInputTagList != null && calcInputTagList.length > 0)
                            step.calculationInputTagList = excludeMatrixVariableViaAlias(calcInputTagList, null, variableName);

                        if (calcOutputTagList != null && calcOutputTagList.length > 0)
                            step.calculationOutputTagList = excludeMatrixVariableViaAlias(calcOutputTagList, sequence, variableName);

                        if (calcOutput != null && calcOutput.length > 0)
                            step.calculationOutput = excludeMatrixVariableViaAlias(calcOutput, sequence, variableName);
                    }
                }

                if (stepsAffected.length > 0)
                {
                    const message = 'Matrix ' + matrixName + '\'s variables have been removed from the following steps: ' + stepsAffected.sort();
                    alert(message);
                    // $scope.validationErrors.push();
                }

                function excludeMatrixVariableViaAlias(tagList, sequence, variableName)
                {
                    if (tagList.every(isAliasNotTheVariable)) return tagList;

                    if (sequence && stepsAffected.indexOf(sequence) < 0) stepsAffected.push(sequence);

                    return tagList.filter(isAliasNotTheVariable);

                    function isAliasNotTheVariable(element)
                    {
                        return element.alias != variableName;
                    }
                }
            }

            $scope.processPricingStepInputs = function()
            {
                for (let i = 0; i < $scope.pricingStepInputs.length; i++)
                {
                    const sequence = i + 1;
                    const stepInput = $scope.pricingStepInputs[i];
                    stepInput['sequence'] = sequence;
                    //Set Calculation Formula, Calculation Formula tags and
                    //Create an alias for Calculation Function Type
                    if (stepInput['functionType'] == 'Calculation')
                    {
                        let calculationFormula = '';
                        const calculationFormulaTags = [];
                        const inputList = [];
                        const outputMap = {};
                        const outputAliasMap = {};

                        for (let j = 0; j < stepInput.calculationInputExpressions.length; j++)
                        {
                            const calcExpression = stepInput.calculationInputExpressions[j];
                            if (calcExpression['userDefined'])
                            {
                                const inputMap = {};
                                const inputName = calcExpression['text'];
                                const inputDataType = calcExpression['dataType'];
                                inputMap['name'] = inputName;
                                inputMap['dataType'] = inputDataType;
                                inputList.push(inputMap);
                            }
                            calculationFormula = calculationFormula + calcExpression['alias'] + ' ';
                            calculationFormulaTags.push(calcExpression);
                        }
                        for (let j = 0; j < stepInput.calculationOutput.length; j++)
                        {
                            const outputName = stepInput.calculationOutput[j]['text'];
                            outputMap['name'] = outputName;
                            outputMap['dataType'] = stepInput.calculationOutput[j]['dataType'];
                            outputMap['alias'] = stepInput.calculationOutput[j]['alias'];
                            const alias = $scope.removeSpace(stepInput.calculationOutput[j]['text']);
                            outputAliasMap[outputName] = alias;
                        }
                        stepInput['calculationFormula'] = calculationFormula;
                        stepInput['calculationFormulaTags'] = JSON.stringify(calculationFormulaTags);
                        stepInput['calculationOutputJSON'] = JSON.stringify(outputMap);
                        stepInput['outputAliasMap'] = JSON.stringify(outputAliasMap);
                        stepInput['calculationInputJSON'] = JSON.stringify(inputList);
                    }
                    let conditionalInput = '';
                    for (let k = 0; k < stepInput.conditionalInputExpressions.length; k++)
                    {
                        const conditionalInputExpression = stepInput.conditionalInputExpressions[k];
                        conditionalInput = conditionalInput + conditionalInputExpression.alias + ' ';
                    }
                    stepInput['condition'] = conditionalInput;
                }
            };

            $scope.processAggregationStepInputs = function()
            {
                for (let i = 0; i < $scope.aggregateStepInputs.length; i++)
                {
                    const sequence = i + 1;
                    const aggregateStepInput = $scope.aggregateStepInputs[i];
                    aggregateStepInput['sequence'] = sequence;
                    aggregateStepInput['task'] = 'Aggregation';
                    let calculationFormula = '';
                    const calculationFormulaTags = [];
                    const inputList = [];
                    const outputMap = {};
                    const outputAliasMap = {};
                    if (aggregateStepInput['functionType'] == 'Calculation')
                    {
                        for (let j = 0; j < aggregateStepInput.calculationInputExpressions.length; j++)
                        {
                            const calcExpression = aggregateStepInput.calculationInputExpressions[j];
                            if (calcExpression['userDefined'])
                            {
                                const inputMap = {};
                                const inputName = calcExpression['text'];
                                const inputDataType = calcExpression['dataType'];
                                inputMap['name'] = inputName;
                                inputMap['dataType'] = inputDataType;
                                inputList.push(inputMap);
                            }
                            calculationFormula = calculationFormula + calcExpression['alias'] + ' ';
                            calculationFormulaTags.push(calcExpression);
                        }
                        for (let j = 0; j < aggregateStepInput.calculationOutput.length; j++)
                        {
                            const outputName = aggregateStepInput.calculationOutput[j]['text'];
                            outputMap['name'] = outputName;
                            outputMap['dataType'] = aggregateStepInput.calculationOutput[j]['dataType'];
                            outputMap['alias'] = aggregateStepInput.calculationOutput[j]['alias'];
                            const alias = $scope.removeSpace(aggregateStepInput.calculationOutput[j]['text']);
                            outputAliasMap[outputName] = alias;
                        }
                        aggregateStepInput['calculationFormula'] = calculationFormula;
                        aggregateStepInput['calculationFormulaTags'] = JSON.stringify(calculationFormulaTags);
                        aggregateStepInput['calculationOutputJSON'] = JSON.stringify(outputMap);
                        aggregateStepInput['outputAliasMap'] = JSON.stringify(outputAliasMap);
                        aggregateStepInput['calculationInputJSON'] = JSON.stringify(inputList);
                    }
                    else if (aggregateStepInput['functionType'] == 'Aggregation')
                    {
                        for (let j = 0; j < aggregateStepInput.aggregateInputExpressions.length; j++)
                        {
                            const aggregateExpression = aggregateStepInput.aggregateInputExpressions[j];
                            if (aggregateExpression['userDefined'])
                            {
                                const inputMap = {};
                                const inputName = aggregateExpression['text'];
                                const inputDataType = aggregateExpression['dataType'];
                                inputMap['name'] = inputName;
                                inputMap['dataType'] = inputDataType;
                                inputList.push(inputMap);
                            }
                            calculationFormula = calculationFormula + aggregateExpression['alias'] + ' ';
                            calculationFormulaTags.push(aggregateExpression);
                        }
                        for (let j = 0; j < aggregateStepInput.aggregateOutput.length; j++)
                        {
                            const outputName = aggregateStepInput.aggregateOutput[j]['text'];
                            outputMap['name'] = outputName;
                            outputMap['dataType'] = aggregateStepInput.aggregateOutput[j]['dataType'];
                            outputMap['alias'] = aggregateStepInput.aggregateOutput[j]['alias'];
                            const alias = $scope.removeSpace(aggregateStepInput.aggregateOutput[j]['text']);
                            outputAliasMap[outputName] = alias;
                        }
                        aggregateStepInput['calculationFormula'] = calculationFormula;
                        aggregateStepInput['calculationFormulaTags'] = JSON.stringify(calculationFormulaTags);
                        aggregateStepInput['calculationInputJSON'] = JSON.stringify(inputList);
                        aggregateStepInput['calculationOutputJSON'] = JSON.stringify(outputMap);
                        aggregateStepInput['outputAliasMap'] = JSON.stringify(outputAliasMap);
                    }
                }
            };

            $scope.getUnsavedStepInputData = function(currentLength)
            {
                const chunkSizeLimit = $scope.procedureSettings.rowLimit || 30;
                const chunkLengthLimit = $scope.procedureSettings.characterLimit || 1800000;

                // Split the pricing step inputs in chunks and save
                const pricingStepInputChunk = [];
                let totalChunksAdded = 0;

                for (let i = 0; i < $scope.pricingStepInputCopy.length; i++)
                {
                    pricingStepInputChunk.push($scope.pricingStepInputCopy[i]);
                    totalChunksAdded = i + 1;

                    let inputChunkLength = JSON.stringify(pricingStepInputChunk).length + currentLength;
                    if (pricingStepInputChunk.length == chunkSizeLimit || inputChunkLength >= chunkLengthLimit)
                    {
                        break;
                    }
                }

                //Delete the first chunk
                if ($scope.pricingStepInputCopy.length > totalChunksAdded)
                {
                    $scope.pricingStepInputCopy.splice(0, totalChunksAdded);
                }
                else
                {
                    $scope.pricingStepInputCopy = [];
                }

                return pricingStepInputChunk;
            };

            $scope.savePricingStep = function(recursiveCall)
            {
                const pricingStepMap = {};
                $scope.processPricingStepInputs();
                $scope.processAggregationStepInputs();
                $scope.validationWarning = 'Calculation Steps are currently being saved, please remain on page or data will be lost.';

                if ($scope.pricingStepInputCopy.length === 0)
                {
                    $scope.pricingStepInputCopy = angular.copy($scope.pricingStepInputs);
                }

                pricingStepMap['versionId'] = $scope.versionObjId;

                if (recursiveCall === null || recursiveCall === undefined)
                {
                    pricingStepMap['aggregation'] = JSON.stringify($scope.aggregateStepInputs);
                    pricingStepMap['variables'] = JSON.stringify($scope.variables);
                    pricingStepMap['constants'] = JSON.stringify($scope.constants);
                    pricingStepMap['preprocessor'] = $scope.customClass['preProcessorClassName'];
                    pricingStepMap['postprocessor'] = $scope.customClass['postProcessorClassName'];
                    pricingStepMap['firstChunk'] = true;
                    $scope.validateData();
                }
                else if (recursiveCall)
                {
                    pricingStepMap['firstChunk'] = false;
                    const emptyArray = [];
                    pricingStepMap['aggregation'] = JSON.stringify(emptyArray);
                }

                let pricingStepConfDetails = JSON.stringify(pricingStepMap);

                const chunkedInputs = $scope.getUnsavedStepInputData(pricingStepConfDetails.length);
                pricingStepMap['pricingStep'] = JSON.stringify(chunkedInputs);

                pricingStepConfDetails = JSON.stringify(pricingStepMap);

                if ($scope.validationErrors.length == 0)
                {
                    $scope.validationErrorsFound = false;
                    pricingCalculationConfigurationService
                        .savePricingStepDetails(pricingStepConfDetails)
                        .then(function(result, event)
                        {
                            if ($scope.pricingStepInputCopy.length == 0)
                            {
                                $scope.validationErrors = [];
                                if (result)
                                {
                                    alert('Save successful.');
                                    $scope.validationWarning = null;
                                }
                                else
                                {
                                    alert('Save unsuccessful due to errors. Please look at the logs.');
                                    $scope.validationWarning = null;

                                    if ($scope.saveErrors == null)
                                        $scope.saveErrors = [];

                                    $scope.saveErrors.concat(pricingStepMap);
                                }
                            }
                            else
                            {
                                $scope.savePricingStep(true);
                            }
                        });

                    console.log('saveErrors', $scope.saveErrors);
                }
                else
                {
                    //If there is validation errors, clear the copy and wait for the user to fix it
                    $scope.pricingStepInputCopy = [];
                }
            };

            $scope.validateVariableConstantUniqueness = function()
            {
                const variableConstantMap = {};
                for (let i = 0; i < $scope.variables.length; i++)
                {
                    const variable = $scope.variables[i];
                    if (variableConstantMap[variable.alias] == null) variableConstantMap[variable.alias] = true;
                    else if (variableConstantMap[variable.alias])
                    {
                        variable.duplicateAlias = true;
                        const variableNotUnique = vlocCALC.labels.variableNotUnique;
                        const variableNotUniqueLabel = variableNotUnique.replace('{0}', variable.name);
                        $scope.validationErrors.push(variableNotUniqueLabel);
                    }
                }
                for (let i = 0; i < $scope.constants.length; i++)
                {
                    const constant = $scope.constants[i];
                    if (variableConstantMap[constant.alias] == null) variableConstantMap[constant.alias] = true;
                    else if (variableConstantMap[constant.alias])
                    {
                        constant.duplicateAlias = true;
                        const constantNotUnique = vlocCALC.labels.constantNotUnique;
                        const constantNotUniqueLabel = constantNotUnique.replace('{0}', constant.name);
                        $scope.validationErrors.push(constantNotUniqueLabel);
                    }
                }
            };

            $scope.validateDefaultvalue = function(variable)
            {
                let value = variable.defaultValue;
                // check if error already there or value is undefined then ignore
                if (value == null || typeof value == 'undefined' || value.trim() == '' || $scope.validationErrors.includes(vlocCALC.labels.defaultValueInvalid))
                {
                    return;
                }
                value = value.trim();
                switch (variable.dataType.trim())
                {
                    case 'Date':
                        $scope.validateDateData(value);
                        break;
                    case 'Number Range':
                    case 'Number':
                    case 'Percent':
                    case 'Currency':
                        $scope.validateNumberData(value);
                        break;
                    case 'Boolean':
                        $scope.validateBooleanData(value);
                        break;
                }
            };

            $scope.validateBooleanData = function(value)
            {
                const validValues = ['TRUE', 'FALSE'];
                if (!validValues.includes(value.toUpperCase()))
                {
                    $scope.validationErrors.push(vlocCALC.labels.defaultValueInvalid);
                }
            };

            $scope.validateNumberData = function(value)
            {
                //replaces all decimal with blank
                const numberValue = value.replace(/\./g, '');
                //check if number and if only 1 decimal was placed by checking the length of the old number value with the replaced number value - 1
                if (!isNumber(numberValue) || value.length - numberValue.length > 1)
                {
                    $scope.validationErrors.push(vlocCALC.labels.defaultValueInvalid);
                }
            };

            $scope.validateDateData = function(value)
            {
                console.log(new Date(value));
                if (new Date(value) == 'Invalid Date' || isNaN(new Date(value)))
                {
                    $scope.validationErrors.push(vlocCALC.labels.defaultValueInvalid);
                }
            };

            $scope.validateVariableConstantEmptyValue = function()
            {
                for (let i = 0; i < $scope.variables.length; i++)
                {
                    const variable = $scope.variables[i];
                    if (variable.name.trim() == '' || variable.dataType.trim() == '')
                    {
                        const variableEntryEmpty = vlocCALC.labels.variableEntryEmpty;
                        $scope.validationErrors.push(variableEntryEmpty);
                    }
                    $scope.validateDefaultvalue(variable);
                }
                for (let i = 0; i < $scope.constants.length; i++)
                {
                    const constant = $scope.constants[i];
                    if (constant.name.trim() == '' || constant.dataType.trim() == '' || constant.value.trim() == '')
                    {
                        const constantEntryEmpty = vlocCALC.labels.constantEntryEmpty;
                        $scope.validationErrors.push(constantEntryEmpty);
                    }
                }
            };

            $scope.validateCalculationStepOutput = function()
            {
                const outputVariableMap = {};
                for (let i = 0; i < $scope.pricingStepInputs.length; i++)
                {
                    const stepInput = $scope.pricingStepInputs[i];
                    if (stepInput['functionType'] == 'Calculation' && stepInput['calculationOutputJSON'] == '{}')
                    {
                        const outputCalculationEmpty = vlocCALC.labels.outputCalculationEmpty;
                        const outputCalculationEmptyLabel = outputCalculationEmpty.replace('{0}', stepInput['sequence']);
                        $scope.validationErrors.push(outputCalculationEmptyLabel);
                    }
                    else if (stepInput['functionType'] == 'Calculation' && stepInput['calculationOutputJSON'] != '{}')
                    {
                        const outputAlias = stepInput['calculationOutput'][0]['alias'];
                        if (outputVariableMap[outputAlias] == null)
                        {
                            outputVariableMap[outputAlias] = true;
                        }
                    }
                }
                // Validate Aggregation Steps
                for (let i = 0; i < $scope.aggregateStepInputs.length; i++)
                {
                    const aggregateStepInput = $scope.aggregateStepInputs[i];
                    if (aggregateStepInput['functionType'] == 'Calculation' && aggregateStepInput['calculationOutputJSON'] == '{}')
                    {
                        const outputCalculationEmpty = 'Output for Aggregation Step {0} is empty.';
                        const outputCalculationEmptyLabel = outputCalculationEmpty.replace('{0}', aggregateStepInput['sequence']);
                        $scope.validationErrors.push(outputCalculationEmptyLabel);
                    }
                }
            };

            $scope.validateCalculationStepInput = function()
            {
                const LONGTEXT_SIZE = 131072;
                //Validate Pricing Step Input
                for (let i = 0; i < $scope.pricingStepInputs.length; i++)
                {
                    const stepInput = $scope.pricingStepInputs[i];
                    if (stepInput['functionType'] == '')
                    {
                        const inputCalculationEmpty = 'Function Type for Calculation Step {0} is empty.';
                        const inputCalculationEmptyLabel = inputCalculationEmpty.replace('{0}', stepInput['sequence']);
                        $scope.validationErrors.push(inputCalculationEmptyLabel);
                    }
                    if (stepInput['functionType'] == 'Calculation' && stepInput['calculationFormula'] == '')
                    {
                        const inputCalculationEmpty = vlocCALC.labels.inputCalculationEmpty;
                        const inputCalculationEmptyLabel = inputCalculationEmpty.replace('{0}', stepInput['sequence']);
                        $scope.validationErrors.push(inputCalculationEmptyLabel);
                    }
                    //check if the formula input is too long
                    if (stepInput['functionType'] === 'Calculation' && (stepInput['calculationFormula'].length > LONGTEXT_SIZE || stepInput['calculationFormulaTags'].length > LONGTEXT_SIZE))
                    {
                        const inputCalculationTooLong = vlocCALC.labels.inputCalculationTooLong;
                        const inputCalculationTooLongLabel = inputCalculationTooLong.replace('{0}', stepInput['sequence']);
                        $scope.validationErrors.push(inputCalculationTooLongLabel);
                    }
                }

                //Validate Aggregation Step Input
                for (let i = 0; i < $scope.aggregateStepInputs.length; i++)
                {
                    const aggregateStepInput = $scope.aggregateStepInputs[i];
                    if (aggregateStepInput['functionType'] == 'Calculation' && aggregateStepInput['calculationFormula'] == '')
                    {
                        const inputCalculationEmpty = 'Input for Aggregation Step {0} is empty.';
                        const inputCalculationEmptyLabel = inputCalculationEmpty.replace('{0}', aggregateStepInput['sequence']);
                        $scope.validationErrors.push(inputCalculationEmptyLabel);
                    }
                }
            };

            $scope.validateMatrixSelection = function()
            {
                for (let i = 0; i < $scope.pricingStepInputs.length; i++)
                {
                    const stepInput = $scope.pricingStepInputs[i];
                    if (stepInput['functionType'] == 'Matrix Lookup' && stepInput['matrixId'] == '')
                    {
                        const matrixSelectionInvalid = vlocCALC.labels.matrixSelectionInvalid;
                        const matrixSelectionInvalidLabel = matrixSelectionInvalid.replace('{0}', stepInput['sequence']);
                        $scope.validationErrors.push(matrixSelectionInvalidLabel);
                    }
                }
            };

            $scope.validateAggregationStep = function()
            {
                for (let i = 0; i < $scope.aggregateStepInputs.length; i++)
                {
                    const aggregateStepInput = $scope.aggregateStepInputs[i];
                    if (aggregateStepInput['functionType'] == '')
                    {
                        const inputCalculationEmpty = 'Function Type for Aggregation Step {0} is empty.';
                        const inputCalculationEmptyLabel = inputCalculationEmpty.replace('{0}', aggregateStepInput['sequence']);
                        $scope.validationErrors.push(inputCalculationEmptyLabel);
                    }
                    if (aggregateStepInput['functionType'] == 'Aggregation')
                    {
                        if (aggregateStepInput['aggregateInputExpressions'].length == 0)
                        {
                            const inputCalculationEmpty = 'Input for Aggregation Step {0} is empty.';
                            const inputCalculationEmptyLabel = inputCalculationEmpty.replace('{0}', aggregateStepInput['sequence']);
                            $scope.validationErrors.push(inputCalculationEmptyLabel);
                        }
                        else if (aggregateStepInput['aggregateOutput'].length == 0)
                        {
                            const outputCalculationEmpty = 'Output for Aggregation Step {0} is empty.';
                            const outputCalculationEmptyLabel = outputCalculationEmpty.replace('{0}', aggregateStepInput['sequence']);
                            $scope.validationErrors.push(outputCalculationEmptyLabel);
                        }
                    }
                }
            };

            $scope.validateData = function()
            {
                $scope.validationErrors = [];
                //Ensure Variables and Constants aliases are unique
                //Ensure Variables and Constants have no empty value
                //Ensure Calculation Steps have input specified
                //Ensure Calculation Steps have output specified
                //Ensure Matrix Selection is valid
                //Ensure Aggregation Step is valid
                $scope.validateVariableConstantUniqueness();
                $scope.validateVariableConstantEmptyValue();
                $scope.validateCalculationStepInput();
                $scope.validateCalculationStepOutput();
                $scope.validateMatrixSelection();
                $scope.validateAggregationStep();
                if ($scope.validationErrors.length > 0)
                {
                    $scope.validationWarning = null;
                    //remove validate warning to remove the message being displayed as there is an error
                }
            };

            $scope.removeAlert = function(obj, $event)
            {
                const target = angular.element($event.target);
                target.parents('.alert').remove();
            };

            $scope.addCalculationStep = function()
            {
                $scope.selectedPricingInput = {};
                $scope.openCalculationModal();
            };

            $scope.addPricingCalculationStep = function()
            {
                const sequence = $scope.pricingStepInputs.length + 1;
                const selectedMatrix = {
                    Name: '',
                    ObjectId: ''
                };
                $scope.pricingStepInputs.push({
                    functionType: '',
                    matrixName: '',
                    matrixId: '',
                    matrixInputTagList: [],
                    matrixOutputTagList: [],
                    matrixInputJSON: '',
                    matrixOutputJSON: '',
                    calculationFormula: '',
                    calculationFormulaTags: '',
                    calculationInputJSON: '',
                    calculationOutputJSON: '',
                    outputMap: '',
                    resultIncluded: false,
                    matrixMode: false,
                    calculationMode: false,
                    matrixList: [],
                    calculationInputTagList: [],
                    calculationOutputTagList: [],
                    calculationInputExpressions: [],
                    calculationOutput: [],
                    selectedMatrix: selectedMatrix,
                    sequence: sequence,
                    conditionalStep: false
                });
            };

            $scope.addAggregationStep = function()
            {
                const sequence = $scope.aggregateStepInputs.length + 1;
                $scope.aggregateStepInputs.push({
                    functionType: '',
                    calculationFormula: '',
                    calculationFormulaTags: '',
                    calculationInputJSON: '',
                    calculationOutputJSON: '',
                    outputMap: '',
                    aggregateMode: false,
                    resultIncluded: false,
                    calculationMode: false,
                    calculationInputTagList: [],
                    calculationOutputTagList: [],
                    calculationInputExpressions: [],
                    calculationOutput: [],
                    aggregateInputTagList: [],
                    aggregateInputExpressions: [],
                    aggregateOutput: [],
                    sequence: sequence
                });
            };

            $scope.aggregateFunctionTypeChanged = function(index)
            {
                const aggregateStep = $scope.aggregateStepInputs[index];
                if (aggregateStep.functionType == 'Aggregation')
                {
                    aggregateStep.aggregateMode = true;
                    aggregateStep.calculationMode = false;
                }
                else
                {
                    aggregateStep.aggregateMode = false;
                    aggregateStep.calculationMode = true;
                }
            };

            $scope.updateMatrixList = function(index)
            {
                const pricingStep = $scope.pricingStepInputs[index];
                pricingStep.matrixMode = true;
                pricingStep.calculationMode = false;

                pricingStep.matrixList = $scope.allMatrices;
            }

            $scope.functionTypeChanged = function(index)
            {
                const pricingStep = $scope.pricingStepInputs[index];
                if (pricingStep.functionType == 'Matrix Lookup')
                {
                    $scope.updateMatrixList(index);
                }
                else
                {
                    pricingStep.matrixMode = false;
                    pricingStep.calculationMode = true;
                }
            };

            $scope.removeNonCalculationOutputFlagInputs = function(inputList)
            {
                //Create a Map of all the Pricing Step Outputs
                //with Include in Calculation Output flag checked
                const calcOutputMap = {};
                const removalIndices = [];
                for (let i = 0; i < $scope.pricingStepInputs.length; i++)
                {
                    const pricingStep = $scope.pricingStepInputs[i];
                    if (pricingStep['resultIncluded'] != null && pricingStep['resultIncluded'])
                    {
                        //calculationOutput matrixOutputTagList
                        if (pricingStep['functionType'] == 'Matrix Lookup')
                        {
                            const outputList = pricingStep['matrixOutputTagList'];
                            const outputAliasMap = JSON.parse(pricingStep['outputAliasMap']);
                            for (let j = 0; j < outputList.length; j++)
                            {
                                const output = outputList[j];
                                const outputAlias = outputAliasMap[output['text']];
                                calcOutputMap[outputAlias] = true;
                            }
                        }
                        else if (pricingStep['functionType'] == 'Calculation')
                        {
                            const outputList = pricingStep['calculationOutput'];
                            for (let j = 0; j < outputList.length; j++)
                            {
                                const output = outputList[j];
                                calcOutputMap[output['alias']] = true;
                            }
                        }
                    }
                }

                //Iterate through inputList and remove aliases not in the map
                for (let i = 0; i < inputList.length; i++)
                {
                    const input = inputList[i];
                    if (calcOutputMap[input['alias']] == null) removalIndices.push(i);
                }

                for (let i = removalIndices.length - 1; i >= 0; i--)
                {
                    inputList.splice(removalIndices[i], 1);
                }
            };

            $scope.setAggregationInputList = function(aggregateStep)
            {
                const functions = ['MIN', 'MAX', 'AVG', 'SUM', '(', ')'];
                const inputList = [];

                for (let i = 0; i < $scope.variables.length; i++)
                {
                    const variable = $scope.variables[i];
                    if (variable.userDefined)
                    {
                        inputList.push({
                            text: variable.name,
                            alias: variable.alias,
                            userDefined: variable.userDefined,
                            dataType: variable.dataType
                        });
                    }
                    else
                    {
                        inputList.push({
                            text: variable.typeaheadDisplayName,
                            alias: variable.alias,
                            userDefined: variable.userDefined,
                            dataType: variable.dataType
                        });
                    }
                }
                //Delete from Input List, variables without
                //the Include in calculation output flag
                $scope.removeNonCalculationOutputFlagInputs(inputList);

                for (let i = 0; i < $scope.constants.length; i++)
                {
                    const constant = $scope.constants[i];
                    inputList.push({
                        text: constant.name,
                        alias: constant.alias
                    });
                }
                for (let i = 0; i < functions.length; i++)
                {
                    const func = functions[i];
                    inputList.push({
                        text: func,
                        alias: func
                    });
                }
                aggregateStep.aggregateInputTagList = inputList;
            };

            function findIndexOf(value, array)
            {
                for (let i = 0; i < array.length; i++)
                {
                    const expressionObj = array[i];
                    if (value == expressionObj.text)
                        return i;
                }

                return -1;
            }

            $scope.setInputOutputTagList = function(pricingStep)
            {
                const inputList = [];
                const outputList = [];
                const arraysList = [operators, mathOperators];

                //only when looping is enabled, we expose the index and previous function
                if ($scope.enableLooping)
                {
                    inputList.push({
                        text: 'ITERATION',
                        alias: 'ITERATION',
                        userDefined: false,
                        dataType: 'Object'
                    });

                    inputList.push({
                        text: 'index',
                        alias: 'index',
                        userDefined: false,
                        dataType: 'Number'
                    });

                    arraysList.push(inputFunctionsAll);
                }
                else arraysList.push(inputFunctions);

                if (pricingStep.calculationInputExpressions)
                {
                    const roundPosition = findIndexOf('ROUND', pricingStep.calculationInputExpressions);

                    if (roundPosition >= 0) arraysList.push(roundModes);
                }

                for (let i = 0; i < $scope.variables.length; i++)
                {
                    const variable = $scope.variables[i];
                    if (variable.userDefined)
                    {
                        inputList.push({
                            text: variable.name,
                            alias: variable.alias,
                            userDefined: variable.userDefined,
                            dataType: variable.dataType
                        });

                        outputList.push({
                            text: variable.name,
                            alias: variable.alias,
                            dataType: variable.dataType
                        });
                    }
                    else
                    {
                        inputList.push({
                            text: variable.typeaheadDisplayName,
                            alias: variable.alias,
                            userDefined: variable.userDefined,
                            dataType: variable.dataType
                        });
                    }
                }

                for (let i = 0; i < $scope.constants.length; i++)
                {
                    const constant = $scope.constants[i];
                    inputList.push({
                        text: constant.name,
                        alias: constant.alias,
                        dataType: constant.dataType
                    });
                }

                for (let i = 0; i < arraysList.length; i++)
                {
                    for (let j = 0; j < arraysList[i].length; j++)
                    {
                        const value = arraysList[i][j];
                        inputList.push({
                            text: value,
                            alias: value
                        });
                    }
                }

                pricingStep.calculationInputTagList = inputList;
                pricingStep.calculationOutputTagList = outputList;
            };

            $scope.aliasPresent = function(inputHeader)
            {
                for (let i = 0; i < $scope.variables.length; i++)
                {
                    const variable = $scope.variables[i];
                    if (variable.name == inputHeader)
                    {
                        return true;
                    }
                }
                return false;
            };

            $scope.outputAliasPresent = function(outputAlias)
            {
                for (let i = 0; i < $scope.variables.length; i++)
                {
                    const variable = $scope.variables[i];
                    if (variable.alias == outputAlias) return true;
                }

                return false;
            };

            $scope.matrixPicked = function(selectedMatrix, index)
            {
                const pricingStep = $scope.pricingStepInputs[index];
                if (pricingStep.matrixName != '') $scope.deleteMatrixVariables(pricingStep.matrixName, index, false);
                pricingStep.matrixName = selectedMatrix.Name;
                pricingStep.matrixId = selectedMatrix.ObjectId;
                pricingStep.matrixInputTagList = [];
                pricingStep.matrixOutputTagList = [];
                pricingCalculationConfigurationService
                    .getMatrixLookupTableHeaders(selectedMatrix.ObjectId, $scope.versionObjId)
                    .then(function(result, event)
                    {
                        const matrixName = selectedMatrix.Name;
                        const matrixLookupHeader = result;
                        const inputHeaders = matrixLookupHeader['inputHeader'];
                        const outputHeaders = matrixLookupHeader['outputHeader'];
                        pricingStep.matrixInputJSON = JSON.stringify(inputHeaders);
                        pricingStep.matrixOutputJSON = JSON.stringify(outputHeaders);
                        for (let i = 0; i < inputHeaders.length; i++)
                        {
                            const inputHeader = inputHeaders[i]['name'];
                            const inputAlias = $scope.removeSpace(inputHeader);
                            const inputHeaderDataType = inputHeaders[i]['dataType'];
                            //Check if variable is already present before adding
                            if (!$scope.aliasPresent(inputHeader))
                            {
                                $scope.variables.push({
                                    name: inputHeader,
                                    typeaheadDisplayName: inputHeader,
                                    userDefined: false,
                                    alias: inputAlias,
                                    isEditable: false,
                                    isSelected: false,
                                    dataType: inputHeaderDataType,
                                    matrixName: matrixName,
                                    index: index
                                });
                            }
                            pricingStep.matrixInputTagList.push({
                                text: inputHeader,
                                dataType: inputHeaderDataType
                            });
                        }

                        const outputMap = {};
                        //Create an alias for output map and add the output alias variables
                        //to the variable list
                        for (let j = 0; j < outputHeaders.length; j++)
                        {
                            const outputHeader = outputHeaders[j]['name'];
                            const outputAlias = $scope.removeSpace(matrixName) + '__' + $scope.removeSpace(outputHeader);
                            const outputHeaderDataType = outputHeaders[j]['dataType'];
                            pricingStep.matrixOutputTagList.push({
                                text: outputHeader,
                                dataType: outputHeaderDataType
                            });
                            if (!$scope.outputAliasPresent(outputAlias))
                            {
                                $scope.variables.push({
                                    name: outputHeader,
                                    typeaheadDisplayName: outputHeader + ' ( ' + matrixName + ' )',
                                    userDefined: false,
                                    alias: outputAlias,
                                    isEditable: false,
                                    dataType: outputHeaderDataType,
                                    matrixName: matrixName,
                                    index: index
                                });
                            }
                            outputMap[outputHeader] = outputAlias;
                        }
                        pricingStep['outputAliasMap'] = JSON.stringify(outputMap);
                    });
            };

            $scope.removeSpace = function(inputText)
            {
                let outputText = '';
                if (inputText != null)
                {
                    for (let i = 0; i < inputText.length; i++)
                    {
                        if (inputText[i] != ' ') outputText = outputText + inputText[i];
                    }
                }
                return outputText;
            };

            $scope.searchInputText = function(index, query, type)
            {
                const deferred = $q.defer();
                const callbackfunction = function(result)
                {
                    $scope.$apply(function()
                    {
                        let sresult = [];
                        if (result)
                        {
                            sresult = angular.fromJson(result);
                        }
                        deferred.resolve(sresult);
                    });
                };
                $scope.searchInputCallback(index, query, type, callbackfunction);
                return deferred.promise;
            };

            $scope.searchInputCallback = function(index, query, type, callback)
            {
                let input;
                let usedText = false;
                let usedMath = false;
                let usedFunction = false;

                if (type == 'Calculation')
                {
                    input = $scope.pricingStepInputs[index];

                    const calculationInputExpressions = input.calculationInputExpressions;
                    if (calculationInputExpressions && calculationInputExpressions.length > 0)
                    {
                        const stringOrBooleanExpressions = calculationInputExpressions.filter(function(entity, index, array)
                        {
                            return entity.dataType && (entity.dataType == 'Text' || entity.dataType == 'Boolean');
                        });

                        const mathExpressions = calculationInputExpressions.filter(function(entity, index, array)
                        {
                            return mathOperators.indexOf(entity.text) > -1;
                        });

                        const functionExpressions = calculationInputExpressions.filter(function(entity, index, array)
                        {
                            return inputFunctionsAll.indexOf(entity.text) > -1;
                        });

                        usedText = stringOrBooleanExpressions.length > 0;
                        usedMath = mathExpressions.length > 0;
                        usedFunction = functionExpressions.length > 0;
                    }
                }
                else input = $scope.aggregateStepInputs[index];

                $scope.setInputOutputTagList(input);

                if (type == 'Calculation' && input.calculationInputTagList && input.calculationInputTagList.length > 0)
                {
                    if (!usedFunction)
                    {
                        if (usedText)
                        {
                            input.calculationInputTagList = input.calculationInputTagList.filter(function(entity)
                            {
                                return mathOperators.indexOf(entity.text) == -1;
                            });
                        }
                        else if (usedMath)
                        {
                            input.calculationInputTagList = input.calculationInputTagList.filter(function(entity)
                            {
                                return !entity.dataType || (entity.dataType != 'Text' && entity.dataType != 'Boolean');
                            });
                        }
                    }
                }

                query = query.trim();
                const filter = {};

                if (query != '')
                {
                    filter['text'] = query;
                    const data = $filter('filter')(input.calculationInputTagList, filter);
                    data.sort(function(a, b)
                    {
                        return a.text.length - b.text.length;
                    });
                    callback(data);
                }
                else
                {
                    callback(input.calculationInputTagList);
                }
            };

            $scope.searchCalculationInput = function(query, index, type)
            {
                const searchList = $scope.searchInputText(index, query, type);
                return searchList;
            };

            $scope.setConditionTagList = function(pricingStep)
            {
                $scope.setInputOutputTagList(pricingStep);
                //Add conditional based inputs to the list
                const conditionalInputs = [
                    'AND',
                    'OR',
                    '>',
                    '>=',
                    '<',
                    '<=',
                    '==',
                    '<>',
                    'LIKE',
                    'NOTLIKE',
                    'INCLUDES',
                    'EXCLUDES'
                ];
                for (let i = 0; i < conditionalInputs.length; i++)
                {
                    const conditionalInput = conditionalInputs[i];
                    pricingStep.calculationInputTagList.push({
                        text: conditionalInput,
                        alias: conditionalInput
                    });
                }
            };

            $scope.searchConditionInputCallback = function(query, index, callback)
            {
                const input = $scope.pricingStepInputs[index];
                $scope.setConditionTagList(input);
                query = query.trim();
                const filter = {};
                if (query != '')
                {
                    filter['text'] = query;
                    const data = $filter('filter')(input.calculationInputTagList, filter);
                    data.sort(function(a, b)
                    {
                        return a.text.length - b.text.length;
                    });
                    callback(data);
                }
                else
                {
                    callback(input.calculationInputTagList);
                }
            };

            $scope.searchConditionInputText = function(query, index)
            {
                const deferred = $q.defer();
                const callbackfunction = function(result)
                {
                    $scope.$apply(function()
                    {
                        let sresult = [];
                        if (result)
                        {
                            sresult = angular.fromJson(result);
                        }
                        deferred.resolve(sresult);
                    });
                };
                $scope.searchConditionInputCallback(query, index, callbackfunction);
                return deferred.promise;
            };

            $scope.searchConditionInput = function(query, index)
            {
                const searchList = $scope.searchConditionInputText(query, index);
                return searchList;
            };

            $scope.onConditionalInputChecked = function(index)
            {
                const pricingStepInput = $scope.pricingStepInputs[index];
                pricingStepInput.conditionalInputExpressions = [];
            };

            $scope.searchAggregateInputCallback = function(index, query, callback)
            {
                const aggregateStepInput = $scope.aggregateStepInputs[index];
                $scope.setAggregationInputList(aggregateStepInput);
                query = query.trim();
                const filter = {};

                if (query != '')
                {
                    filter['text'] = query;
                    const data = $filter('filter')(aggregateStepInput.aggregateInputTagList, filter);
                    data.sort(function(a, b)
                    {
                        return a.text.length - b.text.length;
                    });
                    callback(data);
                }
                else
                {
                    callback(aggregateStepInput.aggregateInputTagList);
                }
            };

            $scope.searchAggregateInputText = function(index, query)
            {
                const deferred = $q.defer();
                const callbackfunction = function(result)
                {
                    $scope.$apply(function()
                    {
                        let sresult = [];
                        if (result)
                        {
                            sresult = angular.fromJson(result);
                        }
                        deferred.resolve(sresult);
                    });
                };
                $scope.searchAggregateInputCallback(index, query, callbackfunction);
                return deferred.promise;
            };

            $scope.searchAggregateInput = function(query, index)
            {
                const searchList = $scope.searchAggregateInputText(index, query);
                return searchList;
            };

            $scope.searchOutputText = function(index, query, type)
            {
                const deferred = $q.defer();
                const callbackfunction = function(result)
                {
                    $scope.$apply(function()
                    {
                        let sresult = [];
                        if (result)
                        {
                            sresult = angular.fromJson(result);
                        }
                        deferred.resolve(sresult);
                    });
                };
                $scope.searchOutputCallback(index, query, type, callbackfunction);
                return deferred.promise;
            };

            $scope.searchOutputCallback = function(index, query, type, callback)
            {
                let input;
                if (type == 'Calculation')
                {
                    input = $scope.pricingStepInputs[index];
                }
                else
                {
                    input = $scope.aggregateStepInputs[index];
                }
                $scope.setInputOutputTagList(input);

                query = query.trim();
                const filter = {};

                if (query != '')
                {
                    filter['text'] = query;
                    const data = $filter('filter')(input.calculationOutputTagList, filter);
                    data.sort(function(a, b)
                    {
                        return a.text.length - b.text.length;
                    });
                    callback(data);
                }
                else
                {
                    callback(input.calculationOutputTagList);
                }
            };

            $scope.searchCalculationOutput = function(query, index, type)
            {
                return $scope.searchOutputText(index, query, type);
            };

            $scope.initializeCalculationSteps = function(svcStep)
            {
                //Create Input and Output Tags for Matrix Lookup
                if (svcStep.functionType == 'Matrix Lookup')
                {
                    svcStep.matrixMode = true;
                    svcStep.calculationMode = false;
                    const selectedMatrix = {
                        Name: svcStep.matrixName,
                        ObjectId: svcStep.matrixId
                    };
                    svcStep.selectedMatrix = selectedMatrix;
                    const matrixInputs = JSON.parse(svcStep.matrixInputJSON);
                    const matrixInputTags = [];
                    const matrixOutputs = JSON.parse(svcStep.matrixOutputJSON);
                    const matrixOutputTags = [];
                    for (let j = 0; j < matrixInputs.length; j++)
                    {
                        const matrixInput = matrixInputs[j]['name'];
                        const matrixInputDataType = matrixInputs[j]['dataType'];
                        matrixInputTags.push({
                            text: matrixInput,
                            dataType: matrixInputDataType
                        });
                    }
                    for (let j = 0; j < matrixOutputs.length; j++)
                    {
                        const matrixOutput = matrixOutputs[j]['name'];
                        const matrixOutputDataType = matrixOutputs[j]['dataType'];
                        matrixOutputTags.push({
                            text: matrixOutput,
                            dataType: matrixOutputDataType
                        });
                    }
                    svcStep.matrixInputTagList = matrixInputTags;
                    svcStep.matrixOutputTagList = matrixOutputTags;
                }
                //Create Calculation Formula and Output Tags for Calculation
                else
                {
                    svcStep.matrixMode = false;
                    svcStep.calculationMode = true;
                    const calculationFormulaTags = JSON.parse(svcStep.calculationFormulaTags);
                    const calculationFormulaList = [];
                    const calculationOutputList = [];
                    const calculationOutput = JSON.parse(svcStep.calculationOutput);
                    for (let j = 0; j < calculationFormulaTags.length; j++)
                    {
                        const calculationFormulaTag = calculationFormulaTags[j];
                        calculationFormulaList.push({
                            text: calculationFormulaTag['text'],
                            alias: calculationFormulaTag['alias'],
                            userDefined: calculationFormulaTag['userDefined'],
                            dataType: calculationFormulaTag['dataType']
                        });
                    }
                    calculationOutputList.push({
                        text: calculationOutput.name,
                        dataType: calculationOutput.dataType,
                        alias: calculationOutput.alias
                    });
                    svcStep.calculationInputExpressions = calculationFormulaList;
                    svcStep.calculationOutput = calculationOutputList;
                    $scope.setInputOutputTagList(svcStep);
                }
                if (svcStep.conditionalInputData != null)
                {
                    svcStep.conditionalInputExpressions = JSON.parse(svcStep.conditionalInputData);
                }
            };

            $scope.initializeAggregationSteps = function(svcStep)
            {
                const calculationFormulaTags = JSON.parse(svcStep.calculationFormulaTags);
                const calculationFormulaList = [];
                const calculationOutputList = [];
                const calculationOutput = JSON.parse(svcStep.calculationOutput);
                for (let j = 0; j < calculationFormulaTags.length; j++)
                {
                    const calculationFormulaTag = calculationFormulaTags[j];
                    calculationFormulaList.push({
                        text: calculationFormulaTag['text'],
                        alias: calculationFormulaTag['alias'],
                        userDefined: calculationFormulaTag['userDefined'],
                        dataType: calculationFormulaTag['dataType']
                    });
                }
                calculationOutputList.push({
                    text: calculationOutput.name,
                    dataType: calculationOutput.dataType,
                    alias: calculationOutput.alias
                });
                if (svcStep['functionType'] == 'Calculation')
                {
                    svcStep.aggregateMode = false;
                    svcStep.calculationMode = true;

                    svcStep.calculationInputExpressions = calculationFormulaList;
                    svcStep.calculationOutput = calculationOutputList;
                    $scope.setInputOutputTagList(svcStep);
                }
                else
                {
                    svcStep.aggregateMode = true;
                    svcStep.calculationMode = false;
                    svcStep.aggregateInputExpressions = calculationFormulaList;
                    svcStep.aggregateOutput = calculationOutputList;
                }
                $scope.aggregateStepInputs.push(svcStep);
            };

            $scope.initializePricingSteps = function()
            {
                $scope.makeVariableEditable(-1);
                $scope.makeConstantEditable(-1);
                const aggregationIndices = [];
                //Iterate through the Pricing Service Steps
                //and create the tags
                for (let i = 0; i < $scope.pricingStepInputs.length; i++)
                {
                    const svcStep = $scope.pricingStepInputs[i];
                    if (svcStep['taskType'] == null)
                    {
                        $scope.initializeCalculationSteps(svcStep);
                    }
                    else if (svcStep['taskType'] == 'Aggregation')
                    {
                        aggregationIndices.push(i);
                        $scope.initializeAggregationSteps(svcStep);
                    }
                }
                //Remove Aggregation Steps from the Pricing Steps
                for (let i = aggregationIndices.length - 1; i >= 0; i--)
                {
                    $scope.pricingStepInputs.splice(aggregationIndices[i], 1);
                }
            };
            $scope.initializePricingSteps();

            $scope.navigateMatrix = function(matrixId)
            {
                if (!$scope.isSforce)
                {
                    window.top.location.href = vlocCALC.BaseRequestUrl + '/' + matrixId;
                    return false;
                }
                else if ($scope.isSforce)
                {
                    sforce.one.navigateToURL('/' + matrixId);
                }
            };

            function handleAutoScroll()
            {
                const minBoundary = 3 / 10; /* boundary top */
                const maxBoundary = 9 / 10; /* boundary bottom */
                const autoScrollSpeed = 30;
                const windowEdge = {
                    min: {
                        y: window.outerHeight * minBoundary
                    },
                    max: {
                        y: window.outerHeight * maxBoundary
                    }
                };
                const origin = location.ancestorOrigins[0];
                const message = {};

                if ($scope.mousePosition.y > 0 && $scope.mousePosition.y < windowEdge.min.y)
                {
                    message.scrollSpeed = -autoScrollSpeed;
                    window.parent.postMessage(message, origin);
                }
                else if ($scope.mousePosition.y > 0 && $scope.mousePosition.y > windowEdge.max.y)
                {
                    message.scrollSpeed = autoScrollSpeed;
                    window.parent.postMessage(message, origin);
                }
            }

            function updateMousePosition(event)
            {
                $scope.mousePosition.y = event.screenY;
            }

            $scope.startDragging = function()
            {
                $scope.dragging = true;
                // add scroll listener if in a Lightning Experience theme
                if (vlocCALC.uiTheme.indexOf('Theme4') > -1)
                {
                    $document.on('drag', updateMousePosition);
                    if (!$scope.autoScrollInterval)
                    {
                        $scope.autoScrollInterval = $interval(function()
                        {
                            handleAutoScroll();
                        }, 50);
                    }
                }
                return true;
            };

            $scope.endDragging = function()
            {
                $scope.dragging = false;
                if ($scope.autoScrollInterval)
                {
                    $document.off('drag', updateMousePosition);
                    $interval.cancel($scope.autoScrollInterval);
                    $scope.autoScrollInterval = null;
                }
            };

            $scope.reorderSteps = function(targetIndex, item, stepsType)
            {
                let stepInputs;
                if (stepsType === 'pricing')
                {
                    stepInputs = $scope.pricingStepInputs;
                }
                else if (stepsType === 'aggregate')
                {
                    stepInputs = $scope.aggregateStepInputs;
                }
                $scope.dragging = false;
                const srcIndex = item.sequence - 1;
                if (targetIndex > srcIndex)
                {
                    targetIndex--;
                }
                stepInputs.splice(srcIndex, 1);
                stepInputs.splice(targetIndex, 0, item);
                for (let i = 0; i < stepInputs.length; i++)
                {
                    stepInputs[i].sequence = i + 1;
                }
                item.inserted = true;
                $timeout(function()
                {
                    item.inserted = false;
                }, 2000);
            };
        });
},{}],3:[function(require,module,exports){
/**
 * angular-drag-and-drop-lists v2.1.0
 *
 * Copyright (c) 2014 Marcel Juenemann marcel@juenemann.cc
 * Copyright (c) 2014-2017 Google Inc.
 * https://github.com/marceljuenemann/angular-drag-and-drop-lists
 *
 * License: MIT
 */
(function(dndLists) {

    // In standard-compliant browsers we use a custom mime type and also encode the dnd-type in it.
    // However, IE and Edge only support a limited number of mime types. The workarounds are described
    // in https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
    var MIME_TYPE = 'application/x-dnd';
    var EDGE_MIME_TYPE = 'application/json';
    var MSIE_MIME_TYPE = 'Text';
  
    // All valid HTML5 drop effects, in the order in which we prefer to use them.
    var ALL_EFFECTS = ['move', 'copy', 'link'];
  
    /**
     * Use the dnd-draggable attribute to make your element draggable
     *
     * Attributes:
     * - dnd-draggable      Required attribute. The value has to be an object that represents the data
     *                      of the element. In case of a drag and drop operation the object will be
     *                      serialized and unserialized on the receiving end.
     * - dnd-effect-allowed Use this attribute to limit the operations that can be performed. Valid
     *                      options are "move", "copy" and "link", as well as "all", "copyMove",
     *                      "copyLink" and "linkMove". The semantics of these operations are up to you
     *                      and have to be implemented using the callbacks described below. If you
     *                      allow multiple options, the user can choose between them by using the
     *                      modifier keys (OS specific). The cursor will be changed accordingly,
     *                      expect for IE and Edge, where this is not supported.
     * - dnd-type           Use this attribute if you have different kinds of items in your
     *                      application and you want to limit which items can be dropped into which
     *                      lists. Combine with dnd-allowed-types on the dnd-list(s). This attribute
     *                      must be a lower case string. Upper case characters can be used, but will
     *                      be converted to lower case automatically.
     * - dnd-disable-if     You can use this attribute to dynamically disable the draggability of the
     *                      element. This is useful if you have certain list items that you don't want
     *                      to be draggable, or if you want to disable drag & drop completely without
     *                      having two different code branches (e.g. only allow for admins).
     *
     * Callbacks:
     * - dnd-dragstart      Callback that is invoked when the element was dragged. The original
     *                      dragstart event will be provided in the local event variable.
     * - dnd-moved          Callback that is invoked when the element was moved. Usually you will
     *                      remove your element from the original list in this callback, since the
     *                      directive is not doing that for you automatically. The original dragend
     *                      event will be provided in the local event variable.
     * - dnd-copied         Same as dnd-moved, just that it is called when the element was copied
     *                      instead of moved, so you probably want to implement a different logic.
     * - dnd-linked         Same as dnd-moved, just that it is called when the element was linked
     *                      instead of moved, so you probably want to implement a different logic.
     * - dnd-canceled       Callback that is invoked if the element was dragged, but the operation was
     *                      canceled and the element was not dropped. The original dragend event will
     *                      be provided in the local event variable.
     * - dnd-dragend        Callback that is invoked when the drag operation ended. Available local
     *                      variables are event and dropEffect.
     * - dnd-selected       Callback that is invoked when the element was clicked but not dragged.
     *                      The original click event will be provided in the local event variable.
     * - dnd-callback       Custom callback that is passed to dropzone callbacks and can be used to
     *                      communicate between source and target scopes. The dropzone can pass user
     *                      defined variables to this callback.
     *
     * CSS classes:
     * - dndDragging        This class will be added to the element while the element is being
     *                      dragged. It will affect both the element you see while dragging and the
     *                      source element that stays at it's position. Do not try to hide the source
     *                      element with this class, because that will abort the drag operation.
     * - dndDraggingSource  This class will be added to the element after the drag operation was
     *                      started, meaning it only affects the original element that is still at
     *                      it's source position, and not the "element" that the user is dragging with
     *                      his mouse pointer.
     */
    dndLists.directive('dndDraggable', ['$parse', '$timeout', function($parse, $timeout) {
      return function(scope, element, attr) {
        // Set the HTML5 draggable attribute on the element.
        element.attr("draggable", "true");
  
        // If the dnd-disable-if attribute is set, we have to watch that.
        if (attr.dndDisableIf) {
          scope.$watch(attr.dndDisableIf, function(disabled) {
            element.attr("draggable", !disabled);
          });
        }
  
        /**
         * When the drag operation is started we have to prepare the dataTransfer object,
         * which is the primary way we communicate with the target element
         */
        element.on('dragstart', function(event) {
          event = event.originalEvent || event;
  
          // Check whether the element is draggable, since dragstart might be triggered on a child.
          if (element.attr('draggable') == 'false') return true;
  
          // Initialize global state.
          dndState.isDragging = true;
          dndState.itemType = attr.dndType && scope.$eval(attr.dndType).toLowerCase();
  
          // Set the allowed drop effects. See below for special IE handling.
          dndState.dropEffect = "none";
          dndState.effectAllowed = attr.dndEffectAllowed || ALL_EFFECTS[0];
          event.dataTransfer.effectAllowed = dndState.effectAllowed;
  
          // Internet Explorer and Microsoft Edge don't support custom mime types, see design doc:
          // https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
          var item = scope.$eval(attr.dndDraggable);
          var mimeType = MIME_TYPE + (dndState.itemType ? ('-' + dndState.itemType) : '');
          try {
            event.dataTransfer.setData(mimeType, angular.toJson(item));
          } catch (e) {
            // Setting a custom MIME type did not work, we are probably in IE or Edge.
            var data = angular.toJson({item: item, type: dndState.itemType});
            try {
              event.dataTransfer.setData(EDGE_MIME_TYPE, data);
            } catch (e) {
              // We are in Internet Explorer and can only use the Text MIME type. Also note that IE
              // does not allow changing the cursor in the dragover event, therefore we have to choose
              // the one we want to display now by setting effectAllowed.
              var effectsAllowed = filterEffects(ALL_EFFECTS, dndState.effectAllowed);
              event.dataTransfer.effectAllowed = effectsAllowed[0];
              event.dataTransfer.setData(MSIE_MIME_TYPE, data);
            }
          }
  
          // Add CSS classes. See documentation above.
          element.addClass("dndDragging");
          $timeout(function() { element.addClass("dndDraggingSource"); }, 0);
  
          // Try setting a proper drag image if triggered on a dnd-handle (won't work in IE).
          if (event._dndHandle && event.dataTransfer.setDragImage) {
            event.dataTransfer.setDragImage(element[0], 0, 0);
          }
  
          // Invoke dragstart callback and prepare extra callback for dropzone.
          $parse(attr.dndDragstart)(scope, {event: event});
          if (attr.dndCallback) {
            var callback = $parse(attr.dndCallback);
            dndState.callback = function(params) { return callback(scope, params || {}); };
          }
  
          event.stopPropagation();
        });
  
        /**
         * The dragend event is triggered when the element was dropped or when the drag
         * operation was aborted (e.g. hit escape button). Depending on the executed action
         * we will invoke the callbacks specified with the dnd-moved or dnd-copied attribute.
         */
        element.on('dragend', function(event) {
          event = event.originalEvent || event;
  
          // Invoke callbacks. Usually we would use event.dataTransfer.dropEffect to determine
          // the used effect, but Chrome has not implemented that field correctly. On Windows
          // it always sets it to 'none', while Chrome on Linux sometimes sets it to something
          // else when it's supposed to send 'none' (drag operation aborted).
          scope.$apply(function() {
            var dropEffect = dndState.dropEffect;
            var cb = {copy: 'dndCopied', link: 'dndLinked', move: 'dndMoved', none: 'dndCanceled'};
            $parse(attr[cb[dropEffect]])(scope, {event: event});
            $parse(attr.dndDragend)(scope, {event: event, dropEffect: dropEffect});
          });
  
          // Clean up
          dndState.isDragging = false;
          dndState.callback = undefined;
          element.removeClass("dndDragging");
          element.removeClass("dndDraggingSource");
          event.stopPropagation();
  
          // In IE9 it is possible that the timeout from dragstart triggers after the dragend handler.
          $timeout(function() { element.removeClass("dndDraggingSource"); }, 0);
        });
  
        /**
         * When the element is clicked we invoke the callback function
         * specified with the dnd-selected attribute.
         */
        element.on('click', function(event) {
          if (!attr.dndSelected) return;
  
          event = event.originalEvent || event;
          scope.$apply(function() {
            $parse(attr.dndSelected)(scope, {event: event});
          });
  
          // Prevent triggering dndSelected in parent elements.
          event.stopPropagation();
        });
  
        /**
         * Workaround to make element draggable in IE9
         */
        element.on('selectstart', function() {
          if (this.dragDrop) this.dragDrop();
        });
      };
    }]);
  
    /**
     * Use the dnd-list attribute to make your list element a dropzone. Usually you will add a single
     * li element as child with the ng-repeat directive. If you don't do that, we will not be able to
     * position the dropped element correctly. If you want your list to be sortable, also add the
     * dnd-draggable directive to your li element(s).
     *
     * Attributes:
     * - dnd-list             Required attribute. The value has to be the array in which the data of
     *                        the dropped element should be inserted. The value can be blank if used
     *                        with a custom dnd-drop handler that always returns true.
     * - dnd-allowed-types    Optional array of allowed item types. When used, only items that had a
     *                        matching dnd-type attribute will be dropable. Upper case characters will
     *                        automatically be converted to lower case.
     * - dnd-effect-allowed   Optional string expression that limits the drop effects that can be
     *                        performed in the list. See dnd-effect-allowed on dnd-draggable for more
     *                        details on allowed options. The default value is all.
     * - dnd-disable-if       Optional boolean expresssion. When it evaluates to true, no dropping
     *                        into the list is possible. Note that this also disables rearranging
     *                        items inside the list.
     * - dnd-horizontal-list  Optional boolean expresssion. When it evaluates to true, the positioning
     *                        algorithm will use the left and right halfs of the list items instead of
     *                        the upper and lower halfs.
     * - dnd-external-sources Optional boolean expression. When it evaluates to true, the list accepts
     *                        drops from sources outside of the current browser tab. This allows to
     *                        drag and drop accross different browser tabs. The only major browser
     *                        that does not support this is currently Microsoft Edge.
     *
     * Callbacks:
     * - dnd-dragover         Optional expression that is invoked when an element is dragged over the
     *                        list. If the expression is set, but does not return true, the element is
     *                        not allowed to be dropped. The following variables will be available:
     *                        - event: The original dragover event sent by the browser.
     *                        - index: The position in the list at which the element would be dropped.
     *                        - type: The dnd-type set on the dnd-draggable, or undefined if non was
     *                          set. Will be null for drops from external sources in IE and Edge,
     *                          since we don't know the type in those cases.
     *                        - dropEffect: One of move, copy or link, see dnd-effect-allowed.
     *                        - external: Whether the element was dragged from an external source.
     *                        - callback: If dnd-callback was set on the source element, this is a
     *                          function reference to the callback. The callback can be invoked with
     *                          custom variables like this: callback({var1: value1, var2: value2}).
     *                          The callback will be executed on the scope of the source element. If
     *                          dnd-external-sources was set and external is true, this callback will
     *                          not be available.
     * - dnd-drop             Optional expression that is invoked when an element is dropped on the
     *                        list. The same variables as for dnd-dragover will be available, with the
     *                        exception that type is always known and therefore never null. There
     *                        will also be an item variable, which is the transferred object. The
     *                        return value determines the further handling of the drop:
     *                        - falsy: The drop will be canceled and the element won't be inserted.
     *                        - true: Signalises that the drop is allowed, but the dnd-drop
     *                          callback already took care of inserting the element.
     *                        - otherwise: All other return values will be treated as the object to
     *                          insert into the array. In most cases you want to simply return the
     *                          item parameter, but there are no restrictions on what you can return.
     * - dnd-inserted         Optional expression that is invoked after a drop if the element was
     *                        actually inserted into the list. The same local variables as for
     *                        dnd-drop will be available. Note that for reorderings inside the same
     *                        list the old element will still be in the list due to the fact that
     *                        dnd-moved was not called yet.
     *
     * CSS classes:
     * - dndPlaceholder       When an element is dragged over the list, a new placeholder child
     *                        element will be added. This element is of type li and has the class
     *                        dndPlaceholder set. Alternatively, you can define your own placeholder
     *                        by creating a child element with dndPlaceholder class.
     * - dndDragover          Will be added to the list while an element is dragged over the list.
     */
    dndLists.directive('dndList', ['$parse', function($parse) {
      return function(scope, element, attr) {
        // While an element is dragged over the list, this placeholder element is inserted
        // at the location where the element would be inserted after dropping.
        var placeholder = getPlaceholderElement();
        placeholder.remove();
  
        var placeholderNode = placeholder[0];
        var listNode = element[0];
        var listSettings = {};
  
        /**
         * The dragenter event is fired when a dragged element or text selection enters a valid drop
         * target. According to the spec, we either need to have a dropzone attribute or listen on
         * dragenter events and call preventDefault(). It should be noted though that no browser seems
         * to enforce this behaviour.
         */
        element.on('dragenter', function (event) {
          event = event.originalEvent || event;
  
          // Calculate list properties, so that we don't have to repeat this on every dragover event.
          var types = attr.dndAllowedTypes && scope.$eval(attr.dndAllowedTypes);
          listSettings = {
            allowedTypes: angular.isArray(types) && types.join('|').toLowerCase().split('|'),
            disabled: attr.dndDisableIf && scope.$eval(attr.dndDisableIf),
            externalSources: attr.dndExternalSources && scope.$eval(attr.dndExternalSources),
            horizontal: attr.dndHorizontalList && scope.$eval(attr.dndHorizontalList)
          };
  
          var mimeType = getMimeType(event.dataTransfer.types);
          if (!mimeType || !isDropAllowed(getItemType(mimeType))) return true;
          event.preventDefault();
        });
  
        /**
         * The dragover event is triggered "every few hundred milliseconds" while an element
         * is being dragged over our list, or over an child element.
         */
        element.on('dragover', function(event) {
          event = event.originalEvent || event;
  
          // Check whether the drop is allowed and determine mime type.
          var mimeType = getMimeType(event.dataTransfer.types);
          var itemType = getItemType(mimeType);
          if (!mimeType || !isDropAllowed(itemType)) return true;
  
          // Make sure the placeholder is shown, which is especially important if the list is empty.
          if (placeholderNode.parentNode != listNode) {
            element.append(placeholder);
          }
  
          if (event.target != listNode) {
            // Try to find the node direct directly below the list node.
            var listItemNode = event.target;
            while (listItemNode.parentNode != listNode && listItemNode.parentNode) {
              listItemNode = listItemNode.parentNode;
            }
  
            if (listItemNode.parentNode == listNode && listItemNode != placeholderNode) {
              // If the mouse pointer is in the upper half of the list item element,
              // we position the placeholder before the list item, otherwise after it.
              var rect = listItemNode.getBoundingClientRect();
              if (listSettings.horizontal) {
                var isFirstHalf = event.clientX < rect.left + rect.width / 2;
              } else {
                var isFirstHalf = event.clientY < rect.top + rect.height / 2;
              }
              listNode.insertBefore(placeholderNode,
                  isFirstHalf ? listItemNode : listItemNode.nextSibling);
            }
          }
  
          // In IE we set a fake effectAllowed in dragstart to get the correct cursor, we therefore
          // ignore the effectAllowed passed in dataTransfer. We must also not access dataTransfer for
          // drops from external sources, as that throws an exception.
          var ignoreDataTransfer = mimeType == MSIE_MIME_TYPE;
          var dropEffect = getDropEffect(event, ignoreDataTransfer);
          if (dropEffect == 'none') return stopDragover();
  
          // At this point we invoke the callback, which still can disallow the drop.
          // We can't do this earlier because we want to pass the index of the placeholder.
          if (attr.dndDragover && !invokeCallback(attr.dndDragover, event, dropEffect, itemType)) {
            return stopDragover();
          }
  
          // Set dropEffect to modify the cursor shown by the browser, unless we're in IE, where this
          // is not supported. This must be done after preventDefault in Firefox.
          event.preventDefault();
          if (!ignoreDataTransfer) {
            event.dataTransfer.dropEffect = dropEffect;
          }
  
          element.addClass("dndDragover");
          event.stopPropagation();
          return false;
        });
  
        /**
         * When the element is dropped, we use the position of the placeholder element as the
         * position where we insert the transferred data. This assumes that the list has exactly
         * one child element per array element.
         */
        element.on('drop', function(event) {
          event = event.originalEvent || event;
  
          // Check whether the drop is allowed and determine mime type.
          var mimeType = getMimeType(event.dataTransfer.types);
          var itemType = getItemType(mimeType);
          if (!mimeType || !isDropAllowed(itemType)) return true;
  
          // The default behavior in Firefox is to interpret the dropped element as URL and
          // forward to it. We want to prevent that even if our drop is aborted.
          event.preventDefault();
  
          // Unserialize the data that was serialized in dragstart.
          try {
            var data = JSON.parse(event.dataTransfer.getData(mimeType));
          } catch(e) {
            return stopDragover();
          }
  
          // Drops with invalid types from external sources might not have been filtered out yet.
          if (mimeType == MSIE_MIME_TYPE || mimeType == EDGE_MIME_TYPE) {
            itemType = data.type || undefined;
            data = data.item;
            if (!isDropAllowed(itemType)) return stopDragover();
          }
  
          // Special handling for internal IE drops, see dragover handler.
          var ignoreDataTransfer = mimeType == MSIE_MIME_TYPE;
          var dropEffect = getDropEffect(event, ignoreDataTransfer);
          if (dropEffect == 'none') return stopDragover();
  
          // Invoke the callback, which can transform the transferredObject and even abort the drop.
          var index = getPlaceholderIndex();
          if (attr.dndDrop) {
            data = invokeCallback(attr.dndDrop, event, dropEffect, itemType, index, data);
            if (!data) return stopDragover();
          }
  
          // The drop is definitely going to happen now, store the dropEffect.
          dndState.dropEffect = dropEffect;
          if (!ignoreDataTransfer) {
            event.dataTransfer.dropEffect = dropEffect;
          }
  
          // Insert the object into the array, unless dnd-drop took care of that (returned true).
          if (data !== true) {
            scope.$apply(function() {
              scope.$eval(attr.dndList).splice(index, 0, data);
            });
          }
          invokeCallback(attr.dndInserted, event, dropEffect, itemType, index, data);
  
          // Clean up
          stopDragover();
          event.stopPropagation();
          return false;
        });
  
        /**
         * We have to remove the placeholder when the element is no longer dragged over our list. The
         * problem is that the dragleave event is not only fired when the element leaves our list,
         * but also when it leaves a child element. Therefore, we determine whether the mouse cursor
         * is still pointing to an element inside the list or not.
         */
        element.on('dragleave', function(event) {
          event = event.originalEvent || event;
  
          var newTarget = document.elementFromPoint(event.clientX, event.clientY);
          if (listNode.contains(newTarget) && !event._dndPhShown) {
            // Signalize to potential parent lists that a placeholder is already shown.
            event._dndPhShown = true;
          } else {
            stopDragover();
          }
        });
  
        /**
         * Given the types array from the DataTransfer object, returns the first valid mime type.
         * A type is valid if it starts with MIME_TYPE, or it equals MSIE_MIME_TYPE or EDGE_MIME_TYPE.
         */
        function getMimeType(types) {
          if (!types) return MSIE_MIME_TYPE; // IE 9 workaround.
          for (var i = 0; i < types.length; i++) {
            if (types[i] == MSIE_MIME_TYPE || types[i] == EDGE_MIME_TYPE ||
                types[i].substr(0, MIME_TYPE.length) == MIME_TYPE) {
              return types[i];
            }
          }
          return null;
        }
  
        /**
         * Determines the type of the item from the dndState, or from the mime type for items from
         * external sources. Returns undefined if no item type was set and null if the item type could
         * not be determined.
         */
        function getItemType(mimeType) {
          if (dndState.isDragging) return dndState.itemType || undefined;
          if (mimeType == MSIE_MIME_TYPE || mimeType == EDGE_MIME_TYPE) return null;
          return (mimeType && mimeType.substr(MIME_TYPE.length + 1)) || undefined;
        }
  
        /**
         * Checks various conditions that must be fulfilled for a drop to be allowed, including the
         * dnd-allowed-types attribute. If the item Type is unknown (null), the drop will be allowed.
         */
        function isDropAllowed(itemType) {
          if (listSettings.disabled) return false;
          if (!listSettings.externalSources && !dndState.isDragging) return false;
          if (!listSettings.allowedTypes || itemType === null) return true;
          return itemType && listSettings.allowedTypes.indexOf(itemType) != -1;
        }
  
        /**
         * Determines which drop effect to use for the given event. In Internet Explorer we have to
         * ignore the effectAllowed field on dataTransfer, since we set a fake value in dragstart.
         * In those cases we rely on dndState to filter effects. Read the design doc for more details:
         * https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
         */
        function getDropEffect(event, ignoreDataTransfer) {
          var effects = ALL_EFFECTS;
          if (!ignoreDataTransfer) {
            effects = filterEffects(effects, event.dataTransfer.effectAllowed);
          }
          if (dndState.isDragging) {
            effects = filterEffects(effects, dndState.effectAllowed);
          }
          if (attr.dndEffectAllowed) {
            effects = filterEffects(effects, attr.dndEffectAllowed);
          }
          // MacOS automatically filters dataTransfer.effectAllowed depending on the modifier keys,
          // therefore the following modifier keys will only affect other operating systems.
          if (!effects.length) {
            return 'none';
          } else if (event.ctrlKey && effects.indexOf('copy') != -1) {
            return 'copy';
          } else if (event.altKey && effects.indexOf('link') != -1) {
            return 'link';
          } else {
            return effects[0];
          }
        }
  
        /**
         * Small helper function that cleans up if we aborted a drop.
         */
        function stopDragover() {
          placeholder.remove();
          element.removeClass("dndDragover");
          return true;
        }
  
        /**
         * Invokes a callback with some interesting parameters and returns the callbacks return value.
         */
        function invokeCallback(expression, event, dropEffect, itemType, index, item) {
          return $parse(expression)(scope, {
            callback: dndState.callback,
            dropEffect: dropEffect,
            event: event,
            external: !dndState.isDragging,
            index: index !== undefined ? index : getPlaceholderIndex(),
            item: item || undefined,
            type: itemType
          });
        }
  
        /**
         * We use the position of the placeholder node to determine at which position of the array the
         * object needs to be inserted
         */
        function getPlaceholderIndex() {
          return Array.prototype.indexOf.call(listNode.children, placeholderNode);
        }
  
        /**
         * Tries to find a child element that has the dndPlaceholder class set. If none was found, a
         * new li element is created.
         */
        function getPlaceholderElement() {
          var placeholder;
          angular.forEach(element.children(), function(childNode) {
            var child = angular.element(childNode);
            if (child.hasClass('dndPlaceholder')) {
              placeholder = child;
            }
          });
          return placeholder || angular.element("<li class='dndPlaceholder'></li>");
        }
      };
    }]);
  
    /**
     * Use the dnd-nodrag attribute inside of dnd-draggable elements to prevent them from starting
     * drag operations. This is especially useful if you want to use input elements inside of
     * dnd-draggable elements or create specific handle elements. Note: This directive does not work
     * in Internet Explorer 9.
     */
    dndLists.directive('dndNodrag', function() {
      return function(scope, element, attr) {
        // Set as draggable so that we can cancel the events explicitly
        element.attr("draggable", "true");
  
        /**
         * Since the element is draggable, the browser's default operation is to drag it on dragstart.
         * We will prevent that and also stop the event from bubbling up.
         */
        element.on('dragstart', function(event) {
          event = event.originalEvent || event;
  
          if (!event._dndHandle) {
            // If a child element already reacted to dragstart and set a dataTransfer object, we will
            // allow that. For example, this is the case for user selections inside of input elements.
            if (!(event.dataTransfer.types && event.dataTransfer.types.length)) {
              event.preventDefault();
            }
            event.stopPropagation();
          }
        });
  
        /**
         * Stop propagation of dragend events, otherwise dnd-moved might be triggered and the element
         * would be removed.
         */
        element.on('dragend', function(event) {
          event = event.originalEvent || event;
          if (!event._dndHandle) {
            event.stopPropagation();
          }
        });
      };
    });
  
    /**
     * Use the dnd-handle directive within a dnd-nodrag element in order to allow dragging with that
     * element after all. Therefore, by combining dnd-nodrag and dnd-handle you can allow
     * dnd-draggable elements to only be dragged via specific "handle" elements. Note that Internet
     * Explorer will show the handle element as drag image instead of the dnd-draggable element. You
     * can work around this by styling the handle element differently when it is being dragged. Use
     * the CSS selector .dndDragging:not(.dndDraggingSource) [dnd-handle] for that.
     */
    dndLists.directive('dndHandle', function() {
      return function(scope, element, attr) {
        element.attr("draggable", "true");
  
        element.on('dragstart dragend', function(event) {
          event = event.originalEvent || event;
          event._dndHandle = true;
        });
      };
    });
  
    /**
     * Filters an array of drop effects using a HTML5 effectAllowed string.
     */
    function filterEffects(effects, effectAllowed) {
      if (effectAllowed == 'all') return effects;
      return effects.filter(function(effect) {
        return effectAllowed.toLowerCase().indexOf(effect) != -1;
      });
    }
  
    /**
     * For some features we need to maintain global state. This is done here, with these fields:
     * - callback: A callback function set at dragstart that is passed to internal dropzone handlers.
     * - dropEffect: Set in dragstart to "none" and to the actual value in the drop handler. We don't
     *   rely on the dropEffect passed by the browser, since there are various bugs in Chrome and
     *   Safari, and Internet Explorer defaults to copy if effectAllowed is copyMove.
     * - effectAllowed: Set in dragstart based on dnd-effect-allowed. This is needed for IE because
     *   setting effectAllowed on dataTransfer might result in an undesired cursor.
     * - isDragging: True between dragstart and dragend. Falsy for drops from external sources.
     * - itemType: The item type of the dragged element set via dnd-type. This is needed because IE
     *   and Edge don't support custom mime types that we can use to transfer this information.
     */
    var dndState = {};
  
  })(angular.module('dndLists', []));
},{}],4:[function(require,module,exports){
angular
    .module('pricingCalculationConfigurationApp')
    .factory(
        'pricingCalculationConfigurationService',
        function($q, $rootScope, remoteActions)
        {
            const factory = {};

            factory.getPricingMatrixList = function(versionObjId)
            {
                const deferred = $q.defer();
                const callbackfunction = function(result)
                {
                    $rootScope.$apply(function()
                    {
                        let sresult = [];
                        if (result)
                        {
                            sresult = angular.fromJson(result);
                        }
                        deferred.resolve(sresult);
                    });
                };

                remoteActions.getPricingMatrixList(versionObjId, callbackfunction);
                return deferred.promise;
            }

            factory.getMatrixLookupTableHeaders = function(matrixId, versionObjId)
            {
                const deferred = $q.defer();
                const callbackfunction = function(result)
                {
                    $rootScope.$apply(function()
                    {
                        let sresult = [];
                        if (result)
                        {
                            sresult = angular.fromJson(result);
                        }
                        deferred.resolve(sresult);
                    });
                };
                remoteActions.getMatrixLookupTableHeaders(matrixId, versionObjId, callbackfunction);
                return deferred.promise;
            };

            factory.savePricingStepDetails = function(pricingStepConfDetails)
            {
                const deferred = $q.defer();
                const callbackfunction = function(result)
                {
                    $rootScope.$apply(function()
                    {
                        deferred.resolve(result);
                    });
                };
                remoteActions.savePricingStepDetails(pricingStepConfDetails, callbackfunction);
                return deferred.promise;
            }

            factory.getProcedureSettings = function()
            {
                const deferred = $q.defer();
                const callbackfunction = function(result)
                {
                    $rootScope.$apply(function()
                    {
                        deferred.resolve(result);
                    });
                };
                remoteActions.getProcedureSettings(callbackfunction);
                return deferred.promise;
            }

            return factory;
        });
},{}],5:[function(require,module,exports){
angular.module("pricingCalculationConfigurationApp").run(["$templateCache",function($templateCache){}]);

},{}]},{},[1]);
})();

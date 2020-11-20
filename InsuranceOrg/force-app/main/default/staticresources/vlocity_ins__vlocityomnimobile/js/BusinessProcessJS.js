/*************************************************************************
 *
 * VLOCITY, INC. CONFIDENTIAL
 * __________________
 *
 *  [2014] - [2020] Vlocity, Inc.
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Vlocity, Inc. and its suppliers,
 * if any. The intellectual and technical concepts contained
 * herein are proprietary to Vlocity, Inc. and its suppliers and may be
 * covered by U.S. and Foreign Patents, patents in process, and are
 * protected by trade secret or copyright law. Dissemination of this
 * information and reproduction, modification or reverse-engineering
 * of this material, is prohibited unless prior written permission
 * is obtained from Vlocity, Inc.
 *
 * Build: v108.0.0
 */
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
require('./polyfills/Object.assign.js');

angular.module('vlocity-oui-common', []);

//loading the omniout module
require('./modules/omni-out/main.js');
require('./modules/omni-knowledge/main.js');

require('./modules/common/shared/osLabelSet.js');
require('./modules/common/shared/misc.js');
require('./modules/common/shared/miscBP.js');
require('./sharedObjectService.js');
require('./modules/common/factory/baseService.js');
require('./modules/common/directives/baseChainup.js');

require('./modules/player/factory/uiStateService.js');
require('./modules/player/factory/bpService.js');
require('./modules/common/controller/OmniFormController.js');

//main class player file
require('./modules/player/main/busProcess');

//all the directives
require('./modules/common/directives/vlcSldsValChecker.js');
require('./modules/common/directives/vlcSldsNgPattern.js');
require('./modules/common/directives/vlcSldsMinMaxLen.js');
require('./modules/common/directives/vlcSldsCheckValChecker.js');
require('./modules/common/directives/vlcSldsBubbleCanceller.js');
require('./modules/common/directives/vlcSldsValCheckCurrency.js');
require('./modules/common/directives/vlcBindHtml.js');
require('./modules/common/directives/appFileReader.js');
require('./modules/common/directives/vlcSldsMuValChecker.js');
require('./modules/common/directives/vlcSldsFileSelect.js');
require('./modules/common/directives/vlcSldsNumValChecker.js');
require('./modules/common/directives/vlcSldsOnlyNumeric.js');
require('./modules/common/directives/vlcRangeSlider.js');
require('./modules/common/directives/vlcLookupControl.js');
require('./modules/common/directives/vlcSldsToolTip.js');
require('./modules/common/directives/vlcDateTimeFormatVal.js');


require('./modules/player/directives/ngConfirmClick.js');
require('./modules/player/directives/vlcRightPanel.js');
require('./modules/player/directives/vlcSldsBanner.js');
require('./modules/player/directives/vlcSldsDatePicker.js');
require('./modules/player/directives/vlcSldsDisableAutocomplete.js');
require('./modules/player/directives/vlcSldsEmbeddedArticle.js');
require('./modules/player/directives/vlcSldsHelpText.js');
require('./modules/player/directives/vlcSldsInclude.js');
require('./modules/player/directives/vlcSldsInstruction.js');
require('./modules/player/directives/vlcSldsLightningBanner.js');
require('./modules/player/directives/vlcSldsModal.js');
require('./modules/player/directives/vlcSldsPopOver.js');
require('./modules/player/directives/vlcSldsReadOnly.js');
require('./modules/player/directives/vlcSldsSpinner.js');
require('./modules/player/directives/vlcSldsStep.js');
require('./modules/player/directives/vlcSldsSvgSize.js');
require('./modules/player/directives/vlcSldsTimePicker.js');
require('./modules/player/directives/vlcSldsToggle.js');
require('./modules/player/directives/vlcSldsToggleHelpText.js');
require('./modules/player/directives/vlcSldsWindowScroll.js');
require('./modules/player/directives/vlcTimePicker.js');
require('./modules/player/directives/vlcSldsRemoveItem.js');
require('./modules/player/directives/vlcSldsValWatchProdConf.js');
require('./modules/player/directives/vlcSldsTypeaheadPrefill.js');
require('./modules/player/directives/vlcPreventParentScroll.js');
require('./modules/player/directives/vlcSldsChangeInlineTemplates.js');
require('./modules/player/directives/vlcSldsModelUpdate.js');
require('./modules/player/directives/vlcSldsEditBlockModal.js');
require('./modules/player/directives/preventEnterSubmit.js');
require('./modules/player/directives/vlcSldsInlineEditBlock.js');

//factory
require('./modules/common/factory/currencySymbol.js');

//config block files
require('./modules/player/config/alertConfig.js');
require('./modules/player/config/cardframeworkConfig.js');
require('./modules/player/config/httpInterceptor.js');
require('./modules/player/config/forceTkConfig.js');
require('./modules/player/config/bpServiceConfig.js');
require('./modules/player/config/xhrConfig.js');
require('./modules/player/config/lazyLoadDirectives.js');
//require('./modules/player/config/httpCustomParamSerializer.js');
require('./modules/player/config/locationProviderConfig.js');




},{"./modules/common/controller/OmniFormController.js":2,"./modules/common/directives/appFileReader.js":3,"./modules/common/directives/baseChainup.js":4,"./modules/common/directives/vlcBindHtml.js":5,"./modules/common/directives/vlcDateTimeFormatVal.js":6,"./modules/common/directives/vlcLookupControl.js":7,"./modules/common/directives/vlcRangeSlider.js":8,"./modules/common/directives/vlcSldsBubbleCanceller.js":9,"./modules/common/directives/vlcSldsCheckValChecker.js":10,"./modules/common/directives/vlcSldsFileSelect.js":11,"./modules/common/directives/vlcSldsMinMaxLen.js":12,"./modules/common/directives/vlcSldsMuValChecker.js":13,"./modules/common/directives/vlcSldsNgPattern.js":14,"./modules/common/directives/vlcSldsNumValChecker.js":15,"./modules/common/directives/vlcSldsOnlyNumeric.js":16,"./modules/common/directives/vlcSldsToolTip.js":17,"./modules/common/directives/vlcSldsValCheckCurrency.js":18,"./modules/common/directives/vlcSldsValChecker.js":19,"./modules/common/factory/baseService.js":20,"./modules/common/factory/currencySymbol.js":21,"./modules/common/shared/misc.js":22,"./modules/common/shared/miscBP.js":23,"./modules/common/shared/osLabelSet.js":24,"./modules/omni-knowledge/main.js":26,"./modules/omni-out/main.js":29,"./modules/player/config/alertConfig.js":31,"./modules/player/config/bpServiceConfig.js":32,"./modules/player/config/cardframeworkConfig.js":33,"./modules/player/config/forceTkConfig.js":34,"./modules/player/config/httpInterceptor.js":35,"./modules/player/config/lazyLoadDirectives.js":36,"./modules/player/config/locationProviderConfig.js":37,"./modules/player/config/xhrConfig.js":38,"./modules/player/directives/ngConfirmClick.js":39,"./modules/player/directives/preventEnterSubmit.js":40,"./modules/player/directives/vlcPreventParentScroll.js":41,"./modules/player/directives/vlcRightPanel.js":42,"./modules/player/directives/vlcSldsBanner.js":43,"./modules/player/directives/vlcSldsChangeInlineTemplates.js":44,"./modules/player/directives/vlcSldsDatePicker.js":45,"./modules/player/directives/vlcSldsDisableAutocomplete.js":46,"./modules/player/directives/vlcSldsEditBlockModal.js":47,"./modules/player/directives/vlcSldsEmbeddedArticle.js":48,"./modules/player/directives/vlcSldsHelpText.js":49,"./modules/player/directives/vlcSldsInclude.js":50,"./modules/player/directives/vlcSldsInlineEditBlock.js":51,"./modules/player/directives/vlcSldsInstruction.js":52,"./modules/player/directives/vlcSldsLightningBanner.js":53,"./modules/player/directives/vlcSldsModal.js":54,"./modules/player/directives/vlcSldsModelUpdate.js":55,"./modules/player/directives/vlcSldsPopOver.js":56,"./modules/player/directives/vlcSldsReadOnly.js":57,"./modules/player/directives/vlcSldsRemoveItem.js":58,"./modules/player/directives/vlcSldsSpinner.js":59,"./modules/player/directives/vlcSldsStep.js":60,"./modules/player/directives/vlcSldsSvgSize.js":61,"./modules/player/directives/vlcSldsTimePicker.js":62,"./modules/player/directives/vlcSldsToggle.js":63,"./modules/player/directives/vlcSldsToggleHelpText.js":64,"./modules/player/directives/vlcSldsTypeaheadPrefill.js":65,"./modules/player/directives/vlcSldsValWatchProdConf.js":66,"./modules/player/directives/vlcSldsWindowScroll.js":67,"./modules/player/directives/vlcTimePicker.js":68,"./modules/player/factory/bpService.js":69,"./modules/player/factory/uiStateService.js":70,"./modules/player/main/busProcess":71,"./polyfills/Object.assign.js":72,"./sharedObjectService.js":73}],2:[function(require,module,exports){
// bot form controller
window.VOUINS = window.VOUINS || {};

VOUINS.OmniFormCtrl = function($scope, ouiBaseService, $timeout, $rootScope, $q, currencySymbol, $window, force, $filter) {

    $scope.customLabels = customLabels;
    $scope.ouiBaseService = ouiBaseService;
    $scope.isSforce = ( (typeof sforce != 'undefined') && (sforce != null) )?(true):(false);
    $scope.sforce = (typeof sforce != 'undefined')?sforce:null;
    $scope.actionStatus = {};
    $scope.isFormValid = true;

    VOUINS.initiateForce($scope, force);

    $scope.reset = function() {
        $scope.bpTree.readOnly = false;
        $scope.submitted = false;
        $scope.actionStatus = {};
    }

    $scope.cancel = function() {
        setActionStatus('cancelling', null, null);
        $scope.processAction($scope.cancelParams, 'cancel');
    }

    $scope.submit = function() {
        //checkValidity returning false means the form is valid
        $scope.isFormValid = !$scope.checkValidity($scope, 0, 0, 'Submit', null, true);
        if($scope.isFormValid) {
            //setting the intermediate status
            setActionStatus('submitting', null, null);
            $scope.submitted = true;
            $scope.processAction($scope.submitParams, 'submit');
        }
    }

    $scope.processAction = function(params, type) {
        params = params || {};
        var IPKey;
        var payload = {};
        var option = {};
        var namespace = sfdcVars.sNS;

        if(!$scope.bpTree) {
            $scope.bpTree = {};
        }
        // checks for prop set in designer
        params.vlcOmniFormClose = $scope.bpTree.vlcOmniFormClose;

        // For submit, if OmniForm has its own postIP, then use it, otherwise, use the one passed in
        if(type === 'submit' && $scope.omniInput.OmniPostAction) {
            IPKey = $scope.omniInput.OmniPostAction;
        }
        
        if(!IPKey) {
            IPKey = params.inputIP;            
        }

        if(IPKey) {
            // payload should be submitParams.extraInput overwritten by the form response
            payload = params.extraInput;
            payload = payload || {};

            // add omniform responses into payload
            if($scope.bpTree.response) {
                (_.mergeWith||_.merge)(payload, $scope.bpTree.response, VOUINS.mergeJSONLogic);    
            }
            
            if($scope.bpTree.filesMap) {
                option.vlcFilesMap = VOUINS.getFilesMap($scope.bpTree.filesMap, $scope.isSforce, $scope.sforce);
            }

            var configObj = {
                sClassName: namespace + ".IntegrationProcedureService",
                sMethodName: IPKey,
                input: angular.toJson(payload),
                options: angular.toJson(option),
                iTimeout:120000,
                label:""
            };
            
            if($scope.bpTree.debug) {
                var dbgConfigObj = {
                        sClassName: namespace + ".IntegrationProcedureService",
                        sMethodName: IPKey,
                        input: payload,
                        options: option,
                        iTimeout:120000,
                        label:""
                    };
                $scope.bpTree.debugArray.push("TO SERVER: "+JSON.stringify(dbgConfigObj, null, 2));
            }

            $scope.remoteAction(configObj, params, type);
        }
        
        $scope.bpTree.readOnly = true;

        // non-remote action
        if(!IPKey) {
            setActionStatus(type, $scope.bpTree.response, true);

            if(params.vlcOmniFormClose) {
                VOUINS.ClearData($scope);
            }
        }

    }

    $scope.remoteAction = function(configObj, params, type) {
        
        ouiBaseService.OmniRemoteInvoke(configObj).then(
            function(result){
                var remoteResp = angular.fromJson(result);

                if($scope.bpTree.debug) {
                    $scope.bpTree.debugArray.push("FROM SERVER: "+JSON.stringify(angular.copy(remoteResp), null, 2));
                }                
                setActionStatus(type, remoteResp, (remoteResp.error === 'OK'))

                if (remoteResp.error === 'OK') {
                    if(remoteResp.IPResult.fileAttachmentSyncData) {
                        VOUINS.syncFileAttachmentData(remoteResp.IPResult, false, $scope, $q, null, $scope.bpTree.filesMap, ouiBaseService, $window)
                            .then(function (result) {
                            $timeout(function()
                            {
                            }, 0);
                        });
                    }
                }
            },
            function(error)
            {
                if($scope.bpTree.debug) {
                    $scope.bpTree.debugArray.push("FROM SERVER: "+JSON.stringify(angular.copy(error), null, 2));
                }                 
                setActionStatus(type, error, false)
            }

        ).then(function(){ //after remote actions completed
            if(params.vlcOmniFormClose) {
                VOUINS.ClearData($scope);
            }
        })
    }

    function setActionStatus(status, response, callSuccess) {
        $scope.output = $scope.output || {};

        $scope.output.vlcOmniFormResp = response;
        $scope.output.callSuccess = callSuccess;
        $scope.output.vlcOmniFormStatus = status;

        $scope.actionStatus.callSuccess = callSuccess;        
        $scope.actionStatus.vlcOmniFormStatus = status;
    }

    $scope.getOptions = function(control, scp) {
        if(ouiBaseService.bPLSeeding && $rootScope.VlocPicklistSeeding) {
            if(control.propSetMap.optionSource.type === 'SObject' || control.propSetMap.optionSource.type === 'Custom') {
                var key = control.propSetMap.optionSource.source;
                if(control.type === 'Multi-select' && key && $rootScope.VlocPicklistSeeding[key] && $rootScope.VlocPicklistSeeding[control.name+':'+control.$$hashKey+':'+key] === undefined) {
                    $rootScope.VlocPicklistSeeding[control.name+':'+control.$$hashKey+':'+key] = angular.copy($rootScope.VlocPicklistSeeding[key]);
                } 
                var plKey = (control.type === 'Multi-select')?(control.name+':'+control.$$hashKey+':'+key):(key);
                VOUINS.resetOptions(control, $rootScope.VlocPicklistSeeding[plKey]);                 
            }
        }      
        return control.propSetMap.options;
    };

    // helper function to call shared aggregate in bpService
    $scope.aggregate = function(scp, arrayIndex, indexInParent, bUIUpdate, removeIndex) {
        ouiBaseService.miniForm = true;
        ouiBaseService.aggregate(scp, arrayIndex, indexInParent, bUIUpdate, removeIndex);
    };
        
    // function to handle applying remote call response to the script
    // algorithm: traverse through the JSON response, if matching input element (Element Name and JSON node)
    // apply it, the remaining JSON gets merged into the Data JSON of the OmniScript
    // @param
    // remote call response
    $scope.applyCallResp = function(resp, bValidation, bKnowledge, element, editBlockElementIndex)
    {
        if(typeof resp === 'string'){
            resp = JSON.parse(resp);
        }
        
        ouiBaseService.invokeResp = {};
    
        if(!$scope.topBPDom)
            $scope.topBPDom = VOUINS.getTopBPDom($scope);
        $scope.applyCallRespAux(resp, $scope.topBPDom, bValidation, editBlockElementIndex);
                    
        // merge with Data JSON if it's not validation messages
        // this makes sure Data JSON structure won't be destroyed
        //$scope.bpTree.response = $.extend(true, {}, resp, $scope.bpTree.response);
        switch(bValidation)
        {
            case true:
                break;
            default:
                if(resp !== null && resp !== undefined && resp.constructor === Object && Object.keys(resp).length > 0)
                {
                    // if not in preview mode, should not allow the user to overwrite the system JSON nodes
                    if(ouiBaseService.previewMode !== true)
                    {
                        delete resp.ContextId;
                        delete resp.userId;   
                        delete resp.userName;
                        delete resp.userProfile;
                        delete resp.timeStamp;
                    }
                    if(Object.keys(resp).length > 0)
                    {
                        if(element && angular.equals(element.type, 'DocuSign Envelope Action')){
                            var eleName = element.name;
                            if(angular.isUndefined($scope.bpTree.response[eleName]))
                                $scope.bpTree.response[eleName] = [];
                            $scope.bpTree.response[eleName].unshift(resp[eleName]);
                        } else {
                            //var tempDataJSON = angular.copy($scope.bpTree.response);
                            //$scope.bpTree.response = (_.mergeWith||_.merge)(resp, $scope.bpTree.response, mergeJSONLogic);
                            (_.mergeWith||_.merge)($scope.bpTree.response, resp, VOUINS.mergeJSONLogic);
                            //(_.mergeWith||_.merge)(tempDataJSON, resp, mergeJSONLogic);
                            //$scope.bpTree.response = tempDataJSON;
                        }
                    }
                }
        }        
    };

    // aux function to handle applying remote call response to the script
    // @param
    // resp - JSON to be applied
    // parentDomEle - recursive, starts with document, then a specific Element, then a child Element, so on so forth
    $scope.applyCallRespAux = function(resp, parentDomEle, bValidation, editBlockElementIndex)
    {
        if(resp === undefined || resp === null)
            return;

        if(resp.constructor !== Object)
            return;

        // only go through root node
        for (var key in resp)
        {
            if(resp.hasOwnProperty(key))
            {
                var data = resp[key];
                // global persistent component (cart)

                // should support ElementName, including Array
                // ElementName|n, including Array
                // Block|1:Select|2, including Array
                if(data === undefined) 
                    data = null;
                //if(data !== undefined && data != null)
                //{
                    $scope.applyDatatoElement(parentDomEle, data, key, resp, bValidation, editBlockElementIndex);
                //}
            }
        }
    };

    // aux function to handle applying remote call response to the script
    // @param
    // parentDomEle - parent DOM element
    // data - JSON to be applied
    // key - json key
    // parentResp - parent JSON
    $scope.applyDatatoElement = function(parentDomEle, data, key, parentResp, bValidation, editBlockElementIndex)
    {
        var scope;
        var bConvertToArray = false;
        // multiple
        if(!angular.isArray(data) && (!$scope.bpTree.pcId || $scope.bpTree.pcId.indexOf(key) < 0))
        {
            data = [data];
            bConvertToArray = true;
        }

        if(!data)
            return;

        var domEle = $scope.getDomElementV2(parentDomEle, key);
        if(domEle.length === 0)
            return;

        var element = angular.element(domEle[0]);
        var size = 1;
        if(element)
        {
            scope = element.scope();

            if(scope && scope.control)
            {
                if(scope.control.propSetMap.repeatLimit !== undefined && scope.control.propSetMap.repeatLimit !== null
                   && scope.control.propSetMap.repeatLimit.constructor === Number && angular.isArray(data)
                   && scope.control.propSetMap.repeatLimit+1 < data.length) {
                    data = data.slice(0, scope.control.propSetMap.repeatLimit+1);
                }
                
                if(
                    (scope.control.type === 'Multi-select' ||
                     scope.control.type === 'Radio' ||
                     (scope.control.type === 'Filter' &&
                      scope.control.propSetMap.type === 'Multi-select')) &&
                   scope.control.propSetMap.options && angular.isArray(scope.control.propSetMap.options)) {
                    size = scope.control.propSetMap.options.length;
                    if(size <= 0)
                        return;
                }
                else if(scope.control.type === 'Edit Block' && (!parentResp[key] || parentResp[key].length === 0) && editBlockElementIndex == null) {
                    if(scope.control.children.length > 0) {
                        var ebScope, ebRec, i;
                        for(i=domEle.length-1; i>=0; i--) {
                            ebRec = angular.element(domEle[i]);
                            if(ebRec) {
                               ebScope  = ebRec.scope();
                               if(ebScope && ebScope.control && ebScope.$parent && ebScope.$parent.child)
                                   ebScope.deleteRecordFromDom(ebScope.$parent.child, i, ebScope, ebScope.$parent);
                            }
                        }
                        ebRec = null;
                        ebScope = null;
                    }
                    delete parentResp[key];
                    return;
                }
            }
        }

        var domLength = domEle.length/size;

        var min = (domLength >= data.length)?(data.length):(domLength);
        var max = (domLength >= data.length)?(domLength):(data.length);
        if(scope && ((scope.control && ouiBaseService.repeatEleTypeList.indexOf(scope.control.type) < 0 ) ||
                     (scope.bpTree.pcId && scope.bpTree.pcId.indexOf(key) >= 0) ))
        {
            min = 1;
            max = 1;
        }
        
        if(editBlockElementIndex !== undefined && editBlockElementIndex !== null)
            min=max=1;

        var eleScope, control, controlType;
        for(var ind=0; ind<min; ind++)
        {
            eleScope = $scope.getEleAngularScope(domEle[ind*size]);
            if(eleScope)
            {
                if((scope.bpTree.pcId && scope.bpTree.pcId.indexOf(key) >= 0) || (key.match('_Top') && scope.bpTree.pcId && scope.bpTree.pcId.indexOf(key.substring(0,key.indexOf('_Top'))) >= 0))
                {
                    switch(bValidation)
                    {
                        case true:
                            break;
                        default:
                            var jsFunc;
                                jsFunc = ouiBaseService.dataPreprocessorMap[key];
                            if(jsFunc && jsFunc.constructor === Function)
                                scope.bpTree.response.vlcPersistentComponent[key] = jsFunc(data);
                            else
                                scope.bpTree.response.vlcPersistentComponent[key] = data;
                            delete parentResp[key];
                    }
                }
                else
                {
                    control = (eleScope.control)?(eleScope.control):(eleScope.child);
                    controlType = control.type;
                    // leaf node
                    if(control && ouiBaseService.applyRespSkipTypeList.indexOf(controlType) === -1)
                    {
                        //var dataToBeApplied = (bpService.repeatEleTypeList.indexOf(controlType) < 0)?(data):(data[ind]);    
                        var dataToBeApplied = data[ind];    
                        if(ouiBaseService.placeholderEleTypeList.indexOf(controlType) >= 0)
                            dataToBeApplied = (bConvertToArray)?(data[0]):data;

                        switch(bValidation)
                        {
                            case true:
                                if(dataToBeApplied && dataToBeApplied.constructor === String)
                                {
                                    //if(controlType !== 'Radio' && eleScope.loopform && eleScope.loopform.loopname)
                                        //eleScope.loopform.loopname.$setValidity("vlcsrverror", false);
                                         
                                    //if((controlType === 'Radio' || controlType === 'Multi-select') && eleScope.loopform)
                                        //eleScope.$parent.loopform.$setValidity("vlcsrverror", false);                                         
                                     
                                    control.srvErr = dataToBeApplied;
                                    var invalidStepIndex = $scope.findStepIndex(eleScope, control.index, control.indexInParent);
                                    if(invalidStepIndex !== undefined && invalidStepIndex !== null)
                                    {
                                        $scope.children[invalidStepIndex].tInvalid = true;
                                        $scope.children[invalidStepIndex].inValid = ($scope.children[invalidStepIndex].propSetMap.validationRequired)?(true):(false);
                                        
                                        $scope.children[invalidStepIndex].bSrvErr = true;
                                        if($scope.invalidStepIndex === undefined || $scope.invalidStepIndex === null
                                           || $scope.invalidStepIndex > invalidStepIndex)
                                            $scope.invalidStepIndex = invalidStepIndex;
                                    }
                                }                            
                                break;
                            default:
                                var bSet = false;
                                bSet = $scope.setElementValue(control, dataToBeApplied, false);
    
                                if(bSet)
                                {
                                    if(ouiBaseService.placeholderEleTypeList.indexOf(controlType) < 0)
                                        ouiBaseService.invokeResp[control.name+control.$$hashKey] = control.response;   
                                    
                                    // v100, regression from prefill refactor in v15, Selectable Items does not have 
                                    // val check
                                    if(controlType === 'Selectable Items') {
                                        eleScope.aggregate(eleScope, control.index, control.indexInParent, true, -1);
                                    }
                                }
                                delete parentResp[key];
                        }                            
                    }
                    // group element - Step, Block, Filter Block
                    else if(control && ouiBaseService.groupEleTypeList.indexOf(controlType) >= 0)
                    {
                        if(/Edit Block$/.test(controlType)) {
                            if(editBlockElementIndex !== undefined && editBlockElementIndex !== null) {
                                $scope.applyCallRespAux(data[ind], domEle[editBlockElementIndex], bValidation);
                            }
                            else if(!control.childrenC) {
                                $scope.applyCallRespAux(data[ind], domEle[ind], bValidation);
                            }
                        } else if(/Type Ahead Block$/.test(controlType) && (editBlockElementIndex !== undefined && editBlockElementIndex !== null)) {
                            $scope.applyCallRespAux(data[ind], domEle[editBlockElementIndex], bValidation);
                        }
                        else
                            $scope.applyCallRespAux(data[ind], domEle[ind], bValidation);
                    }
                }
            }
        }
        // last element eleScope
        switch(bValidation)
        {
            case true:
                break;
            default:
                var ebApply = false;
                if(/Edit Block$/.test(controlType) && control.childrenC) {
                    control.children = angular.copy(control.childrenC);
                    //delete control.childrenC;      
                    domLength--;
                    min--;
                }
                    
                // v100, you have to mark the element as repeat
                if(data.length > domLength && eleScope && control)
                {
                    // OMNI-2174, backward compatible
                    if((!$scope.bpTree.rMap) || ($scope.bpTree.rMap && $scope.bpTree.rMap.hasOwnProperty(control.name))) {
                        if(ouiBaseService.actionEleTypes.indexOf(controlType) === -1 && controlType !== 'Step'
                           && controlType !== 'Filter Block' && controlType !== 'Filter')
                        {
                            var index = eleScope.control.index;
                            for(var ind=min; ind<max; ind++)
                            {
                                var bIncreaseIndex = (!eleScope.child.eleArray[index].childrenC);
                                $scope.addElement(eleScope, eleScope.child, index, angular.copy(data[ind]), data[ind]);
                                if(bIncreaseIndex)
                                    index++;
                                if(controlType === 'Edit Block')
                                    ebApply = true;
                            }
                        }
                    }
                }

            var remainder = parentResp[key];
            if(remainder !== null && remainder !== undefined)
            {
                if( (remainder.constructor === Object && Object.keys(remainder).length === 0)
                    || (angular.isArray(remainder) && $scope.bpTree.labelMap.hasOwnProperty(key)) 
                    || ebApply)
                    delete parentResp[key];                        
            }
            else
                delete parentResp[key];  
        }
    };
    
    // second version function to get the DOM element
    // parentDomEle - parent DOM Element, starts with document
    // path - JSON path
    $scope.getDomElementV2 = function(parentDomEle, path)
    {
        var domEle = [];
        try {
            // rMap is undefine pre v100
            if($scope.bpTree.rMap) {
                if(!$scope.bpTree.rMap.hasOwnProperty(path) && !/\s/g.test(path) && 
                    parentDomEle.getElementById) {
                        var tempEle = parentDomEle.getElementById(path);
                        if(tempEle)
                            domEle = [tempEle];
                }
                else {
                    // repeat element
                    if($scope.bpTree.rMap.hasOwnProperty(path))
                        domEle = parentDomEle.querySelectorAll("[id='"+path+"']");
                    // not a repeat element
                    else {
                        var tempEle = parentDomEle.querySelector("[id='"+path+"']");  
                        if(tempEle)
                            domEle = [tempEle];
                        
                    }
                }                                                          
            }
            else {
                domEle = parentDomEle.querySelectorAll("[id='"+path+"']");                
            }     
            return domEle;
        }
        catch(err)
        {
            console.log(err);
            return [];
        }
        
        return [];
    };
    

    // helper function to get the angular scope of a dom element
    // @param
    // domEle - DOM Element
    $scope.getEleAngularScope = function(domEle)
    {
        var scope = null;
        var element = angular.element(domEle);
        if(element)
        {
            scope = element.scope();
        }
        return scope;
    };    
    
    // helper function to find the current step index
    // @param
    // scp - Element scope
    // arrayIndex - index of the repeated Element
    // indexInParent - index of the Element as a child to the parent Element
    $scope.findStepIndex = function(scp, arrayIndex, indexInParent) {
        var stepIndex;
        if(scp)
        {
            if(scp.$parent)
            {
                var parent = (ouiBaseService.layout === 'lightning' || ouiBaseService.layout === 'newport')?scp.$parent:scp.$parent.$parent;
                if(parent) {
                    if(parent.child && parent.child.eleArray)
                    {
                        stepIndex = this.findStepIndex(parent.$parent, arrayIndex, parent.child.indexInParent);
                    }
                    else
                    // hit root
                    {
                        if(parent.child)
                            stepIndex = parent.child.indexInParent;
                        if(parent.step)
                            stepIndex = parent.step.indexInParent;                            
                    }
                }
            }
        }
        return stepIndex;
    };
    
    // function to set the value of an Element
    // @param
    // control - Element
    // eleVal - value to set
    // bNew - is it a pristine set
    $scope.setElementValue = function(control, eleVal, bNew, setOrigVal)
    {
        var bSet = false;
        var oldVal = control.response;
        var cType = control.type;
        if(cType === 'Filter')
            cType += ' ' + control.propSetMap.type;  
        
        var newVal = eleVal;
        if(cType === 'Radio' || cType === 'Select' || cType === 'Filter Select'
           || cType === 'Multi-select' || cType === 'Filter Multi-select' || cType === 'Lookup') 
        {
            if(eleVal !== undefined && eleVal !== null && eleVal.constructor === Object)
                newVal = eleVal.name;
            if(oldVal !== undefined && oldVal !== null)
            {
                if(oldVal.constructor === Object && (cType === 'Radio' || cType === 'Select' || cType === 'Filter Select' || cType === 'Lookup'))
                    oldVal = oldVal.name;
                if(angular.isArray(oldVal) && (cType === 'Multi-select' || cType === 'Filter Multi-select'))
                    oldVal = ouiBaseService.handleSelect(cType, oldVal);
            }
        }
        
        if(angular.equals(newVal, oldVal) && ouiBaseService.placeholderEleTypeList.indexOf(cType) < 0)
        {
            if(bNew && setOrigVal)
                setOrigVal.bSet = true;
            return bSet;
        }    

        var node = (cType === 'Selectable Items')?('vlcSI'):('vlcInputBlock');
        
        try
        {
            switch(cType)
            {
                case 'Selectable Items':
                case 'Input Block':
                     control.compDisable = false;
                     control.response = null; 
                     control[node] = {}; 
                                             
                     var jsFunc = ouiBaseService.dataPreprocessorMap[control.name];
                     if(jsFunc && jsFunc.constructor === Function)   
                         eleVal = jsFunc(eleVal);
                        
                     if(eleVal !== undefined && eleVal !== null)    
                     {
                         if(angular.isArray(eleVal) && cType === 'Selectable Items')
                             control.vlcSI[control.itemsKey] = eleVal;  
                         else if(cType === 'Selectable Items' && (!eleVal[control.itemsKey] || !angular.isArray(eleVal[control.itemsKey])))   
                             control.vlcSI[control.itemsKey] = [eleVal];            
                         else if(eleVal.constructor === Object)
                             control[node] = eleVal;   
                     }

                     bSet = true;
                     break;
                case 'Select':
                case 'Filter Select':                     
                     if(eleVal !== undefined && eleVal !== null &&
                        ((eleVal.constructor === Object && eleVal.name) || (eleVal.constructor === String && eleVal !== '')))
                     {
                         if(control.propSetMap.dependency && control.type === 'Select') {
                             // for dependent picklist prefill, we bypass validation
                             if(eleVal.constructor === Object)
                                 control.response = eleVal;
                             else
                                 control.response = {name: eleVal, value:eleVal};
                             control.propSetMap.options = null;
                             bSet = true;
                         }
                         else {                              
                             var nameString = (eleVal.constructor === Object && eleVal.name)?(eleVal.name):(eleVal);
                             var options = angular.copy(control.propSetMap.options);
                             if(options !== undefined && options !== null && angular.isArray(options))
                             {
                                 for(var i=0; i<options.length; i++)
                                 {
                                     if(options[i].name === nameString)
                                     {
                                         control.response = options[i];
                                         //eleVal.value = options[i].value;
                                         bSet = true;
                                         break;
                                     }
                                 }
                             }
                         }
                     }
                     break;     
                case 'Checkbox':
                case 'Disclosure':
                     // if invalid value, default it to false
                     if(eleVal !== undefined && eleVal !== null && eleVal.constructor === Boolean)
                     {
                         control.response = eleVal;
                         bSet = true;
                     }                        
                     break;
                case 'Email':
                case 'URL':
                case 'Type Ahead':
                     // has to be a string
                     if(eleVal !== undefined && eleVal !== null && eleVal.constructor === String)
                     {    
                         control.response = eleVal;
                         bSet = true;
                     }                     
                     break;
                case 'Password':
                case 'Signature':
                case 'Text':
                case 'Text Area':
                     if(eleVal !== undefined && eleVal !== null && eleVal.constructor === String) {
                         var bValid = true;
                         if(control.propSetMap.minLength !== undefined && control.propSetMap.minLength !== null
                            && control.propSetMap.minLength.constructor === Number
                            && eleVal.length < control.propSetMap.minLength)
                            bValid = false;
                         if(control.propSetMap.maxLength !== undefined && control.propSetMap.maxLength !== null
                            && control.propSetMap.maxLength.constructor === Number
                            && eleVal.length > control.propSetMap.maxLength)  
                            bValid = false;                       
                         if(bValid) {    
                             control.response = eleVal;
                             bSet = true;
                         }                     
                     }
                     break;                                             
                case 'Lookup':
                     if(eleVal !== undefined && eleVal !== null &&
                        ((eleVal.constructor === Object && eleVal.name) ||
                         (eleVal.constructor === String && eleVal !== '')
                       ))  {
                         var nameString = (eleVal.constructor === Object && eleVal.name)?(eleVal.name):(eleVal);
                         var options = angular.copy(control.propSetMap.options);
                         if(options !== undefined && options !== null &&
                            angular.isArray(options)) {                             
                             for(var i=0; i<options.length; i++) {
                                 if(options[i].name === nameString) {
                                     control.response = options[i].name;
                                     bSet = true;
                                }
                             }
                         }

                         //OMNI-2007 prefill lookup 
                         if (!bSet) {
                             control.propSetMap.options = control.propSetMap.options || [];
                
                             //prefill  if its an object 
                             if (angular.isObject(eleVal)) {
                                 control.propSetMap.options.push(eleVal);
                                 control.response = eleVal.name || '';
                             }
                
                             //prefill  if its an string 
                             if (angular.isString(eleVal)) {
                                 control.propSetMap.options.push({
                                     name:eleVal,
                                     value: eleVal
                                 });
                                 control.response = eleVal
                             }

                             bSet = true;
                        }
                    }                
                    break;
                case 'Radio':
                     if(eleVal !== undefined && eleVal !== null &&
                        ((eleVal.constructor === Object && eleVal.name) || (eleVal.constructor === String && eleVal !== '')))
                     {
                         if(control.propSetMap.dependency) {
                             // for dependent picklist prefill, we bypass validation
                             control.response = (eleVal.constructor === Object)?(eleVal.name):(eleVal);
                             control.propSetMap.options = null;
                             bSet = true;
                         }
                         else {
                             var nameString = (eleVal.constructor === Object && eleVal.name)?(eleVal.name):(eleVal);
                             var options = angular.copy(control.propSetMap.options);
                             if(options !== undefined && options !== null && angular.isArray(options))
                             {                             
                                 for(var i=0; i<options.length; i++)
                                 {
                                     if(options[i].name === nameString)
                                     {
                                         control.response = options[i].name;
                                         //eleVal.value = options[i].value;
                                         bSet = true;
                                     }
                                 }
                             }
                         }
                     }                
                     break;
                case 'Currency':
                     if(eleVal !== undefined && eleVal !== null && eleVal.constructor === Number)
                     {
                         var bValid = true;
                         // check min, max
                         if(control.propSetMap.min !== undefined && control.propSetMap.min !== null
                            && control.propSetMap.min.constructor === Number
                            && eleVal < control.propSetMap.min)
                             bValid = false;
                         if(control.propSetMap.max !== undefined && control.propSetMap.max !== null
                            && control.propSetMap.max.constructor === Number
                            && eleVal > control.propSetMap.max)
                             bValid = false;

                         if(bValid)
                         {
                             control.response = eleVal;
                             bSet = true;
                         }
                     }
                     break;
                case 'Number':
                     if(eleVal !== undefined && eleVal !== null && eleVal.constructor === Number)
                     {
                         control.response = eleVal;
                         bSet = true;
                     }                         
                     break;
                case 'Telephone':
                     if(eleVal !== undefined && eleVal !== null && eleVal.constructor === String) {
                         var bValid = true;
                         if(control.propSetMap.minLength !== undefined && control.propSetMap.minLength !== null
                            && control.propSetMap.minLength.constructor === Number
                            && eleVal.length < control.propSetMap.minLength)
                             bValid = false;
                         if(control.propSetMap.maxLength !== undefined && control.propSetMap.maxLength !== null
                            && control.propSetMap.maxLength.constructor === Number
                            && eleVal.length > control.propSetMap.maxLength)  
                             bValid = false;                       
                         if(bValid) {    
                             control.response = eleVal;
                             bSet = true;
                         }                     
                     }
                     break;
                case 'Range':
                     var bValid = false;
              
                     if(eleVal !== undefined && eleVal !== null && eleVal.constructor === Number)
                     {
                         bValid = true;
                         // check min, max
                         if(eleVal < control.propSetMap.rangeLow)
                             bValid = false;
                         if(eleVal > control.propSetMap.rangeHigh)
                             bValid = false;
                     }
                     control.response = bValid?eleVal:control.propSetMap.rangeLow;
                     bSet = true;                         
                     break; 
                case 'Date':
                     var dateVal = eleVal;
                     if (eleVal==="today"){
                        eleVal = moment();
                     } else if (control.propSetMap.dateType == "string"){
                         //currently using string.toUpperCase() to convert from Angularjs Date Format to momentjs date format, should eventually write full function
                         eleVal = moment(eleVal,control.propSetMap.modelDateFormat.toUpperCase()); 
                     } else {
                         eleVal = moment.utc(eleVal);
                     }
                     if(eleVal !== undefined && eleVal !== null && eleVal.isValid())
                     {
                         if(control.propSetMap.dateType === 'string')
                             control.response = eleVal.format(control.propSetMap.modelDateFormat.toUpperCase());
                         else if (dateVal.match(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/)) {
                            control.response = dateVal;
                         } else {
                             eleVal = new Date(eleVal.format("YYYY-MM-DD"));
                             eleVal = new Date(eleVal.getTime() + eleVal.getTimezoneOffset()*60000);
                             eleVal = eleVal.toISOString();
                             control.response = eleVal;
                         }
                         bSet = true;
                     }                      
                     break;
                case 'Date/Time (Local)':
                     if (eleVal==="today"||eleVal==="now")
                        eleVal = moment.utc();
                     else 
                        eleVal = moment.utc(eleVal);
                     if(eleVal !== undefined && eleVal !== null && eleVal.isValid())
                     {
                         eleVal = eleVal.toISOString();
                         control.response = eleVal;
                         bSet = true;
                     }                      
                     break;
                case 'Time':
                     var temp;
                     if (eleVal==="now"){
                         temp=moment.utc();
                         eleVal=temp._d;
                     } else if ((temp=/^(\d\d):(\d\d):(\d\d)\.(\d\d\d)Z$/.exec(eleVal))){
                        eleVal = new Date(Date.UTC(70,0,1));
                        eleVal.setHours(temp[1],temp[2],temp[3],temp[4]);
                        temp = moment(eleVal);
                     } else {
                        temp=moment.utc(eleVal);
                     }
                     if(temp !== undefined && temp !== null && temp.isValid())
                     {
                         temp = new Date(eleVal);
                         temp = new Date(70, 0, 1, temp.getHours(), temp.getMinutes(), temp.getSeconds(), temp.getMilliseconds());
                         if(control.propSetMap.timeType === 'string')
                             control.response = $filter('date')(eleVal,control.propSetMap.modelTimeFormat);
                         else
                             control.response = temp.toISOString();
                         bSet = true;
                     }                       
                     break;
                case 'Multi-select':
                case 'Filter Multi-select':
                     if(eleVal !== undefined && eleVal !== null && 
                        ((eleVal.constructor === Object && eleVal.name) || (eleVal.constructor === String && eleVal !== '')))
                     {
                         var nameString = (eleVal.constructor === Object && eleVal.name)?(eleVal.name):(eleVal);
                         var names = nameString.split(';');                          
                         if(control.propSetMap.dependency) {
                             // for dependent picklist prefill, we bypass validation
                             if(names && names.length > 0) {
                                 var resp = [];
                                 for(var j=0; j<names.length; j++) {
                                     resp.push({name: names[j], value: names[j], selected:true});
                                 }
                                 control.response = resp;
                                 control.propSetMap.options = null;
                                 bSet = true;
                             }
                         }
                         else {
                             var msResp = angular.copy(control.propSetMap.options);
                             if(names && names.length > 0 && msResp !== undefined && msResp !== null
                                && angular.isArray(msResp))
                             {
                                 //eleVal.value = '';
                                 for(var i=0; i<msResp.length; i++)
                                 {
                                     if(names.indexOf(msResp[i].name) >= 0)
                                     {
                                         msResp[i].selected = true;
                                         //eleVal.value += msResp[i].value;
                                         //eleVal.value += ';';
                                         control.propSetMap.options[i].selected = true;
                                     }
                                     else
                                     {
                                         msResp[i].selected = false;
                                         delete control.propSetMap.options[i].selected;
                                     }
                                 }
                                 //eleVal.value = eleVal.value.substring(0, eleVal.value.length - 1);
                             }
                             control.response = msResp;                             
                             bSet = true;
                         }
                     }                          
                     break;
                case 'Radio Group':
                     if(eleVal !== undefined && eleVal !== null && (eleVal.constructor === Object))
                     {
                        // check against options before setting control.response
                        var radioGroup = {};
                        var options = angular.copy(control.propSetMap.options);
                        if(options !== undefined && options !== null && angular.isArray(options)) {
                            var keys = Object.keys(eleVal);

                            for(var i = 0; i < keys.length; i++) {
                                for(var oindex = 0; oindex < options.length; oindex++) {
                                    if(options[oindex].name === eleVal[keys[i]]) {
                                        radioGroup[keys[i]] = options[oindex].name;
                                        bSet = true;
                                    }
                                }
                            }
                            control.response = radioGroup;
                        }
                     }
                     break;
                default:
                     break;
            }
        }
        catch(err)
        {
            console.log(err);
        }
        
        if(bSet)
        {
            if(bNew && setOrigVal)
                setOrigVal.bSet = true;
            return bSet;
        }

        if(bNew || !bSet)
        {
            var newVal = null;
            
            if(cType === 'Checkbox' || cType === 'Disclosure')
                newVal = false;
            else if (cType === 'Multi-select' || cType === 'Filter Multi-select') {
                newVal = angular.copy(control.response);
                if(newVal && angular.isArray(newVal)) {
                    for(var ind=0; ind<newVal.length; ind++)
                        delete newVal[ind].selected;
                }
                if(control.propSetMap.options && angular.isArray(control.propSetMap.options)) {
                    for(var i=0; i<control.propSetMap.options.length; i++) {
                        delete control.propSetMap.options[i].selected;
                    }                    
                }
            }
            else if(ouiBaseService.placeholderEleTypeList.indexOf(cType) >= 0)
                newVal = {};  
            
            if( (angular.equals(newVal, oldVal) || ( (cType === 'Multi-select' || cType === 'Filter Multi-select') && oldVal === null )) 
                && ouiBaseService.placeholderEleTypeList.indexOf(cType) < 0)
            {
                if(bNew && setOrigVal)
                    setOrigVal.bSet = bSet;
                return bSet;        
            }          
               
            if(ouiBaseService.placeholderEleTypeList.indexOf(cType) < 0)   
                control.response = newVal;         

            if(ouiBaseService.placeholderEleTypeList.indexOf(control.type) >= 0)
                control[node] = {};

            bSet = true;    
            if(bNew && setOrigVal)
                setOrigVal.bSet = false;         
        }
        return bSet;
    };    
    
    // helper function
    // when the remote call JSON response comes back
    // if it's an array, need to create repeated Element
    // @param
    // scp - Element scope
    // control - Element
    // index - index to insert the repeated Element
    // data - JSON response
    // dataCopy - copy of the JSON response
    $scope.addElement = function(scp, control, index, data, dataCopy)
    {
        var newItem = angular.copy(control.eleArray[index]);
        //this.nullifyResponse(newItem);
        if(!control.eleArray[index].childrenC) {            
            newItem.index = index+1;
            control.eleArray.splice(index+1, 0, newItem);
            for(var i=index+2; i<control.eleArray.length; i++)
                control.eleArray[i].index = control.eleArray[i].index+1;
        }
        else {
            control.eleArray.splice(index, 1, newItem);
            delete newItem.childrenC;
        }
        
        $timeout(function() {
            $scope.setResponse(newItem, data, dataCopy);                
            if((ouiBaseService.blockEleTypeList.indexOf(control.eleArray[0].type) >= 0) && scp.$parent) {
                scp.aggregate(scp.$parent, control.index, control.indexInParent, false, index);
            }
            else
                scp.aggregate(scp, control.index, control.indexInParent, false, index);                       
        }, 0);  
    };   
    
    // helper function to handle the case
    // when the remote call JSON response comes back
    // if it's an array, need to create repeated Element
    // @param
    // eleNode - Element
    // data - JSON response
    // dataCopy - copy of the JSON response
    $scope.setResponse = function(eleNode, data, dataCopy)
    {
        // leaf node
        if(eleNode)
        {
            // leaf node
            if(ouiBaseService.applyRespSkipTypeList.indexOf(eleNode.type) === -1)
            {
                var setOrigVal = {};
                var bSet = $scope.setElementValue(eleNode, data, true, setOrigVal);
                if(setOrigVal.bSet)
                    ouiBaseService.invokeResp[eleNode.name+eleNode.$$hashKey] = eleNode.response;
                return setOrigVal.bSet;
            }
            else
            {
                var realData = {};
                var bAllNull = true;
                for(var i=0; i<eleNode.children.length; i++)
                {
                    if(ouiBaseService.noneDataControlTypeListV2.indexOf(eleNode.children[i].eleArray[0].type) >= 0)
                        continue;
                    
                    var bHasKey = false;
                    var eleData;
                    if(data)
                    {
                        bHasKey = data.hasOwnProperty(eleNode.children[i].eleArray[0].name);
                        eleData = data[eleNode.children[i].eleArray[0].name];
                    }
                    else
                        eleData = null;
                    if(eleData === undefined)
                        eleData = null;
                    var eleDataArray = eleData;
                    if(!angular.isArray(eleDataArray))
                        eleDataArray = [eleData];

                    var min = (eleNode.children[i].eleArray.length>=eleDataArray.length)?(eleDataArray.length):(eleNode.children[i].eleArray.length);
                    var max = (eleNode.children[i].eleArray.length<=eleDataArray.length)?(eleDataArray.length):(eleNode.children[i].eleArray.length);
                    for(var k=0; k<min; k++)
                    {
                        if(!$scope.setResponse(eleNode.children[i].eleArray[k], eleDataArray[k], angular.copy(eleDataArray[k])))
                            eleDataArray[k] = eleNode.children[i].eleArray[k].response;
                    }

                    if(eleDataArray.length < eleNode.children[i].eleArray.length)
                        eleNode.children[i].eleArray.splice(min, max-min);
                    else if(eleDataArray.length > eleNode.children[i].eleArray.length)
                    {
                        for(var k=min; k<max; k++)
                        {
                            var temp = angular.copy(eleNode.children[i].eleArray[0]);
                            eleNode.children[i].eleArray.splice(k, 0, temp);
                            eleNode.children[i].eleArray[k].index = k;
                            if(!$scope.setResponse(eleNode.children[i].eleArray[k], eleDataArray[k], angular.copy(eleDataArray[k])))
                                eleDataArray[k] = eleNode.children[i].eleArray[k].response;
                        }
                    }

                    // set eleNode.children[i] response
                    if(eleDataArray.length === 1)
                        eleDataArray = eleDataArray[0];

                    eleNode.children[i].response = eleDataArray;

                    realData[eleNode.children[i].eleArray[0].name] = eleNode.children[i].response;
                    if(eleNode.children[i].response !== undefined && eleNode.children[i].response !== null)
                        bAllNull = false;
                    if(bHasKey)
                        delete dataCopy[eleNode.children[i].eleArray[0].name];
                }
                if(bAllNull && eleNode.type !== 'Edit Block' && !(eleNode.type === 'Block' && eleNode.propSetMap.ebp))
                    eleNode.response = null;
                else
                    eleNode.response = realData;
                return false;
            }
        }
    };  
    
    $scope.init = function(scp, control, option)
    {
        // v102, we'd want to wait until picklist seeding is done
        var initInterval;

        switch(control.type)
        {
           case 'Select':
           case 'Radio':
           case 'Multi-select':
               if(ouiBaseService.bPLSeeding) {
                   initInterval = setInterval(check, 10);
               }
               else {
                   $scope.initAux(scp, control, option);
               }
               break;
           default: 
               $scope.initAux(scp, control, option);
               break;
        }
        
        function check() {
            if ($rootScope.seedingDone === true || $rootScope.seedingFailed === true) {
                clearInterval(initInterval);                
                $scope.initAux(scp, control, option);
            }
        }
    }
    // function to be called in ng-init
    // 2.5 prefill
    // handle flat json
    // @param
    // scp - Element scope
    // control - Element
    $scope.initAux = function(scp, control, option)
    {
        if(control.response !== undefined && control.response !== null)
            return;
        
        try
        {
            if((ouiBaseService.applyRespSkipTypeList.indexOf(control.type) === -1
               && ouiBaseService.pfJSON && Object.getOwnPropertyNames(ouiBaseService.pfJSON).length > 0
               && ouiBaseService.pfJSON.hasOwnProperty(control.name))||control.propSetMap.hasOwnProperty('defaultValue')&&control.propSetMap.defaultValue!=null)
            {
                var eleVal = ouiBaseService.pfJSON[control.name];

                if (eleVal==null&&control.propSetMap.hasOwnProperty('defaultValue')&&control.propSetMap.defaultValue!=null){
                    eleVal=control.propSetMap.defaultValue;
                }

                if(eleVal !== undefined && eleVal !== null)
                {
                    if($scope.setElementValue(control, eleVal, false))
                    {
                        // need to check validation!!
                        ouiBaseService.pfJSONFill[control.name] = eleVal;
                        // CPQ TODO
                    }
                }
                delete scp.bpTree.response[control.name];
                delete ouiBaseService.pfJSON[control.name];
            }
            else if(control.type === 'Multi-select' && control.req && !control.response) {
                scp.loopform.$setValidity("required", false);
            }
            // sets form to be invalid because radio group is valid by default
            else if(control.type === 'Radio Group' && control.req && !control.response) {
                scp.loopform.$setValidity("required", false);
            }

            if((control.type === 'Checkbox' || control.type === 'Disclosure') && control.response === null)
            {
                control.response = false;
                scp.aggregate(scp, control.index, control.indexInParent, true, -1);
            }
            else if(control.type === 'Multi-select')
                scp.onMultiSelect(scp, control, option, true);
            else if(control.type === 'Range' && control.response === null && !isNaN(control.propSetMap.rangeLow)) {
                control.response = parseFloat(control.propSetMap.rangeLow);
            }
        }
        catch(err)
        {
            console.log(err.message);
        }
    }; 
    
    // function to handle Multi-select
    // @param
    // scp - Element scope
    // control - Element
    // option - Multi-select option
    $scope.onMultiSelect = function(scp, control, option, bInit)
    {   
        if(!bInit || !control.propSetMap.dependency)
            control.response = control.propSetMap.options;
        var validForm = false;
        if(control.type === 'Multi-select')
        {
            if(!control.req){
                validForm = true;
            }
            else{         
                if(option && option.selected){
                    validForm = true;
                } else {
                    validForm = $scope.MultiSelectFilled(control);
                }
            }

            if((ouiBaseService.layout === 'lightning' || ouiBaseService.layout === 'newport') && bInit)
                scp.loopform.$setValidity("required", validForm);
            else
                scp.$parent.loopform.$setValidity("required", validForm);
        }

        scp.aggregate(scp, control.index, control.indexInParent, true, -1);
    };
    
    $scope.MultiSelectFilled = function(control)
    {
        if(control.propSetMap.options && control.response !== undefined && control.response !== null) {
            for(var i = 0; i <control.response.length; i++){
                if(control.response[i].selected) {
                    return true;
                }
            }
        }
        return false;    
    }; 

    // sets all radio fields to the same radio button value
    // @param
    // scp - Element scope
    // control - Element
    // newValue - RadioGroup option used to set all radio buttons
    $scope.setAllRadioGroup = function(scp, newValue) {
        var radiolabels = scp.control.propSetMap.radioLabels;
        var radioGroup = {};
        for(var i = 0; i < radiolabels.length; i++) {
             radioGroup[radiolabels[i].name] = newValue;
        }
        scp.control.response = radioGroup;
    }

    // function to handle Radio Group
    // @param
    // scp - Element scope
    // control - Element
    // option - Radio Group select option
    $scope.onRadioGroupSelect = function(scp, control, option, bInit)
    {   
        var validForm = false;
        if(control.type === 'Radio Group')
        {
            if(!control.req){
                validForm = true;
            }
            else {
                validForm = $scope.radioGroupFilled(control);
            }

            if((ouiBaseService.layout === 'lightning' || ouiBaseService.layout === 'newport') && bInit)
                scp.loopform.$setValidity("required", validForm);
            else
                scp.$parent.loopform.$setValidity("required", validForm);
        }

        scp.aggregate(scp, control.index, control.indexInParent, true, -1);
    };
    
    $scope.radioGroupFilled = function(control)
    {
        if(control.propSetMap.options && control.response !== undefined && control.response !== null) {
            var ctrlKeys = Object.keys(control.response);
            var ctrlVals = Object.values(control.response);

            var rLabels = control.propSetMap.radioLabels;
            var radioLabels = control.propSetMap.radioLabels;
            var options = control.propSetMap.options;

            var rKeyCheck = {};
            var rValueCheck = {};
            //radio label keys into map
            for(var i = 0; i < rLabels.length; i++) {
                rKeyCheck[rLabels[i].name] = 0; 
            }

            //check control.response for radio labels
            for(var i = 0; i < ctrlKeys.length; i++) {
                if(ctrlKeys[i] in rKeyCheck) {
                    rKeyCheck[ctrlKeys[i]] += 1;
                }
            }

            if(Object.values(rKeyCheck).reduce(function(a,b){ return a + b}) !== rLabels.length) {
                return false;
            }

            //option keys into map
            for(var i = 0; i < options.length; i++) {
                rValueCheck[options[i].name] = true;
            }

            //checks if prefilled options are valid
            for(var i = 0; i < ctrlVals.length; i++) {
                if(!(ctrlVals[i] in rValueCheck)) {
                    return false;
                }
            }

            return true;
        }

        return false;
    };

    // validate when control.req gets updated, specifically for conditional view = optional if false
    // @param
    // scp - Element scope
    // control - Element
    $scope.validateRequired = function(scp, control, bInit) {
        if(!scp.loopform)
            return;
                
        if(control.req || (scp.miniForm && control.propSetMap.required)) {
            if(control.type === "Radio Group") {
                scp.loopform.$setValidity("required", $scope.radioGroupFilled(control));
            }
            else if (control.type === "Multi-select") {
                scp.loopform.$setValidity("required", $scope.MultiSelectFilled(control));
            }
            else if (control.type === 'Disclosure') {
                scp.loopform.$setValidity("required", control.response === true)
            }
         }
         else { // elements not required, make them valid
            scp.loopform.$setValidity("required", true);
         }

        return true;
    }

    // user click - function to
    // @param
    // scp - Element scope
    // control - Element
    // index - the index of the file to be removed
    $scope.removeFile = function(scp, control, index)
    {
        if(control && control.response)
        {
            var dataBeingDeleted = control.response[index];
            var toDelete = scp.bpTree.filesMap[control.response[index].data];

            delete scp.bpTree.filesMap[control.response[index].data];
            control.response.splice(index, 1);

            // Will always be 18 if a ContentDocumentId 
            if (control.propSetMap.uploadContDoc && toDelete && toDelete.length == 18) {
                var configObj = { 
                    sClassName: ouiBaseService.sNSC + "BusinessProcessDisplayController.BusinessProcessDisplayControllerOpen",
                    sMethodName: "DeleteOSContentDocument",
                    input: angular.toJson({
                        contentDocumentId: toDelete
                    }),
                    options: "{}"
                };

                ouiBaseService.OmniRemoteInvoke(configObj).then(function(){
                    if (control.propSetMap.remoteClass && $scope.remoteCallInvoke) {

                        var controlClone = angular.copy(control);

                        controlClone.propSetMap.remoteOptions.vlcFileDeleted = toDelete;
                        controlClone.propSetMap.remoteOptions.vlcFileKey = control.name;
                        controlClone.ui = {};

                        var input = {};
                        input[control.name] = [ dataBeingDeleted ];

                        $scope.remoteCallInvoke(input, controlClone, false, null, scp, null, 'contentDocumentDelete');
                    }
                });
            }
        }

        scp.aggregate(scp, control.index, control.indexInParent, true, index);
    };  

    // user click - function to
    // @param
    // scp - Element scope
    // control - Element
    // index - the index of the file to be removed
    $scope.uploadContentVersions = function(scp, control)
    {
        if(control && control.response)
        {
            var promiseArray = [];
            // Iterate over the list of files and send them to the server, then replace the files map data with the Id of the contentdocument

            var cancelRemote = false;
            var documentFiles = [];
            control.response.forEach(function(file) {

                var bodyData = scp.bpTree.filesMap[file.data];

                if (bodyData && bodyData.length > 18) {

                    bodyData = bodyData.substr(bodyData.indexOf(',') + 1);
                    var actualParentIds = [];

                    control.propSetMap.contentParentId.forEach(function(parentId) {
                        try {
                            var asArray = angular.fromJson(scp.handleMergeField(angular.toJson(parentId), null, null, null, null, null, true));
                            actualParentIds = actualParentIds.concat(asArray);
                        } catch (e){
                            actualParentIds.push(scp.handleMergeField(parentId));
                        }
                    });
                    
                    $rootScope.loading = true;
                    $rootScope.loadingMessage = '';

                    var configObj = { 
                        sClassName: "Vlocity CreateOSContentVersion",
                        sMethodName: "CreateOSContentVersion",
                        bodyData: bodyData,
                        parentId: angular.toJson(actualParentIds),
                        filename: file.filename, 
                        options: angular.toJson(control.propSetMap)
                    };

                    var promise = ouiBaseService.CreateOSContentVersion(configObj).then(function(result)
                        {
                            if (typeof result == "string") {
                                result = angular.fromJson(result);
                            }

                            if(result && (control.type==='File' || control.type==='Image')) {
                                control.response[control.response.length-1].contentDocumentId = result.contentDocumentId;
                                control.response[control.response.length-1].vId = result.contentVersionId;
                                scp.aggregate(scp, control.index, control.indexInParent, true, -1);
                            }

                            scp.bpTree.filesMap[file.data] = result.contentDocumentId;
                            
                            if (!scp.bpTree.contentVersions) {
                                scp.bpTree.contentVersions = {};
                            }

                            documentFiles.push(file);

                            scp.bpTree.contentVersions[file.data] = result.contentVersionId;
                        }, function(error) {
                            
                            delete scp.bpTree.filesMap[file.data];

                            control.response = control.response.filter(function(resFile) {

                                return resFile.data != file.data;
                            });

                            var errorMsg = $scope.errorReplace(error.error, control);
                            $window.alert(new Error(errorMsg));
                        });

                    promiseArray.push(promise);
                }

            });

            if (promiseArray.length) {
                $q.all(promiseArray).then(function(results) {
                    if (documentFiles.length > 0 && control.propSetMap.remoteClass && $scope.remoteCallInvoke) {
                        var input = {}; 
                        input[control.name] = documentFiles;

                        var controlClone = angular.copy(control);
                        controlClone.propSetMap.remoteOptions.vlcFileKey = control.name;
                        controlClone.ui = {};

                        $scope.remoteCallInvoke(input, controlClone, false, null, scp, null, 'contentDocumentAdd', null, null, null, null,
                            function(result) {
                            $rootScope.loading = false;
                        });
                    } else {
                        $rootScope.loading = false;
                    }
                }, function(error) {
                    $rootScope.loading = false;
                    var errorMsg = $scope.errorReplace(error.error, control);
                    $window.alert(new Error(errorMsg));
                });
            }
            else 
            {
                $rootScope.loading = false;
            }
           
        }
    };

    // helper function to check if a file is removable
    // @param
    // scp - Element scope
    // control - Element
    // index - the index of the file to be removed
    $scope.isFileRemovable = function(scp, control, index)
    {
        if(control && control.response)
        {
            var fileData = scp.bpTree.filesMap[control.response[index].data];

            if(fileData && (fileData.substring(0, 4) !== 'data' && ouiBaseService.scriptState == 'review'))
                return false;
            if(fileData !== null)
                return true;

        }
        return false;
    };
    
    // function - remote call to call DR or custom implementation to populate the lookup options
    // supports two types: SObject and Custom
    // SObject calls DR engine
    // Custom calls a custom Apex class which implements VlocityOpenInterface
    // @param
    // control - Element
    $scope.getLookupOptions = function(control, scp)
    {   
        //$scope.resetSrvErr(control);          
        //control.propSetMap.options = [{"name":"001","value":"001"}];
        control.propSetMap.options = [];
        if (control.propSetMap.clearValue !== false){
            control.response = null;
            scp.aggregate(scp, control.index, control.indexInParent, true, -1);
        }
        
        var className, methodName, timeout;
        var input = {};
        var type = control.propSetMap.dataSource.type;
        var index = $scope.findRepeatIndex(control);
        var option = {};
        
        if(type === 'SObject')
        {
            className = ouiBaseService.sNSC + 'DefaultFetchPicklistOptionsImpl';
            methodName = 'fetchLookupOptions';

            var mapItems = control.propSetMap.dataSource.mapItems;
            if(mapItems && mapItems.phase1MapItems && mapItems.phase2MapItems && angular.isArray(mapItems.phase1MapItems)
              && angular.isArray(mapItems.phase2MapItems) && mapItems.phase1MapItems.length > 0
              && mapItems.phase2MapItems.length > 0)
            {
                input['MapItems'] = mapItems.phase1MapItems.concat(mapItems.phase2MapItems);
                var inputParams = control.propSetMap.dataSource.mapItems.inputParameters;
                var queryCriteria = {};
                if(inputParams && angular.isArray(inputParams))
                {
                    for(var i=0; i<inputParams.length; i++)
                    {
                        var eleName = inputParams[i].element;
                        if(!angular.equals(index, NaN))
                            eleName = $scope.replaceNIndex(eleName, index+1);
                        queryCriteria[inputParams[i].inputParam] = $scope.getElementValue(eleName);
                    }
                    input['DRParams'] = queryCriteria;
                }
            }
        }
        else if(type === 'Custom')
        {
            var source = control.propSetMap.dataSource.source;
            if(source)
            {
                var strArray = source.split('.');
                if(strArray)
                {
                    if(strArray.length === 2)
                    {
                        className = strArray[0];
                        methodName = strArray[1];
                    }
                    else if(strArray.length === 3)
                    {
                        className = strArray[0] + '.' + strArray[1];
                        methodName = strArray[2];
                    }
                }
                input = $scope.bpTree.response;
                if(!input)
                    input = {};
            }
        } else if(type === 'PicklistFilteredbyRecordType') {
            className = ouiBaseService.sNSC + 'DefaultOmniScriptSObjectPicklist';
            methodName = 'GetSObjectPicklistValues';
            var picklistObjectAndField = control.propSetMap.dataSource.picklistObjectAndField.split('.');
            option.picklistObject = picklistObjectAndField[0];
            option.picklistField = picklistObjectAndField[1];
            option.picklistRecordType = scp.handleMergeField(control.propSetMap.dataSource.picklistRecordType, false, null, control);
            input = $scope.bpTree.response;
        }

        if(className === undefined || className === null || methodName === undefined
           || methodName === null || !input || Object.getOwnPropertyNames(input).length === 0)
        {
            return;
        }

        $rootScope.loading = true;
        $rootScope.loadingMessage = '';
        option.useQueueableApexRemoting = (control.propSetMap.useQueueableApexRemoting === true);

        //lightning patch
        var deferred = $q.defer();
        
        var configObj = {sClassName:className,sMethodName:methodName,input:angular.toJson(input),
                         options:angular.toJson(option),iTimeout:timeout,label:{label:control && control.name}};                                            
        ouiBaseService.OmniRemoteInvoke(configObj).then(
            function(result)
            {
                //$scope.invokeResp = angular.fromJson(result);
                // we may need this later for debug mode
                var remoteResp = angular.fromJson(result);

                if(remoteResp)
                {
                    if(remoteResp.error !== 'OK')
                    {
                        $rootScope.loading = false;
                        var errorMsg = $scope.errorReplace(remoteResp.error, control);
                        $window.alert(new Error(errorMsg));
                    }
                    else
                    {
                        $rootScope.loading = false;
                        if(remoteResp.options)
                        {
                            if(!angular.isArray(remoteResp.options) && remoteResp.options.constructor === Object)
                            {
                                if(Object.keys(remoteResp.options).length > 0)
                                    remoteResp.options = [remoteResp.options];
                                else
                                    remoteResp.options = [];
                            }
                            control.propSetMap.options = remoteResp.options;
                        }
                        else
                            control.propSetMap.options = [];
                    }
                }
                else{
                    $rootScope.loading = false;
                }
                deferred.resolve();
                
            },
            function(error)
            {
                $rootScope.loading = false;
                var errorMsg = $scope.errorReplace(error, control);
                $window.alert(new Error(errorMsg));
                deferred.reject();
            }
        );

        //lightning
        return deferred.promise;
    };
    
    $scope.findRepeatIndex = function(control)
    {
        var index = NaN; 
        if(!$scope.topBPDom)
            $scope.topBPDom = VOUINS.getTopBPDom($scope);
        
        var domEle = $scope.topBPDom;
        // start with the step
        if(control.rootIndex !== undefined && control.rootIndex !== null) {
            if(!(/\s/g.test($scope.bpTree.children[control.rootIndex].name)) && $scope.topBPDom.getElementById)
                domEle = $scope.topBPDom.getElementById($scope.bpTree.children[control.rootIndex].name);
            else
                domEle = $scope.topBPDom.querySelector("[id='"+$scope.bpTree.children[control.rootIndex].name+"']");    
        }

        if(domEle) {
            var eleArray = [];
            if($scope.bpTree.rMap) {
                if(!$scope.bpTree.rMap.hasOwnProperty(control.name)) {
                    var tempEle = domEle.querySelector("[id='"+control.name+"']");
                    if(tempEle)
                        eleArray = [tempEle];
                }
                else
                    eleArray = domEle.querySelectorAll("[id='"+control.name+"']"); 
            }
            else 
                eleArray = domEle.querySelectorAll("[id='"+control.name+"']");
            
            var elementArray = [];
            if(eleArray && eleArray.length > 0)
            {
                for(var i=0; i<eleArray.length; i++)
                {
                    var element = angular.element(eleArray[i]);
                    if(element)
                    {
                        var scp = element.scope();
                        if(scp)
                        {
                            var ctrl = scp.control;                          
                            if(ctrl && ctrl.$$hashKey === control.$$hashKey)
                                return i;
                        }
                    }
                }
            }
        }
        
        return index;        
    };   
    
    // user click - user selects one item in Selectable Items (container)
    // @param
    // control - Element
    // option - the item selected
    // index - index of the selected item
    // scp - Element scope
    $scope.onSelectItem = function(control, option, index, scp, bFlip)
    {
        if(control === undefined || control === null || option === undefined || option === null)
            return;
        // multi-select, single select
        var bSetVal = true;
        var response = [];
        if(bFlip)
        {
            if(option.vlcSelected === undefined || option.vlcSelected === null)
            {
                option.vlcSelected = bSetVal;
            }
            else
            {
                bSetVal = !option.vlcSelected;
                option.vlcSelected = bSetVal;
            }
        }

        // update 'Selectable Items' response
        var recSet = control.vlcSI[control.itemsKey];
        // HP bug, use $$hashKey to check
        for(var i=0; i<recSet.length; i++)
        {
            if(option.vlcSelected === true && option.$$hashKey !== recSet[i].$$hashKey && control.propSetMap.selectMode === 'Single')
                 recSet[i].vlcSelected = false;                     
            if(recSet[i].vlcSelected === true)
                response.push(recSet[i]);
        }

        if(response.length > 0)
            control.response = response;
        else
            control.response = null;

        if(control.propSetMap.dataJSON === true)
            scp.aggregate(scp, control.index, control.indexInParent, true, -1);
    }; 

    // function to process merge fields
    // use the regex to parse %xxx% pattern
    // merge fields are used in (1) Text Block (2) Headline (3) Post to Object Action (4) Done Action
    // @param
    // inputStr - input string
    $scope.handleMergeField = function(inputStr, bReplaceIndex, index, element, display, editBlkIndex, bEscape)
    {
        if(inputStr === undefined || inputStr === null)
            return '';
                       
        if(index === undefined || index === null)
            index = NaN;               
             
        if(editBlkIndex !== undefined && editBlkIndex !== null) {
            index = editBlkIndex;
        } 
        else if(VOUINS.isRepeatNotation(inputStr) && element) 
            index = $scope.findRepeatIndex(element);        
            
        var fields = inputStr.match(/%([^[%]+)%/g);

        var resultName = inputStr;
        if(fields)
        {
            for (var i = 0; i < fields.length; i++)
            {
                var elem = fields[i].replace(/%/g,'');
                if(!angular.equals(index, NaN))
                    elem = $scope.replaceNIndex(elem, index+1);                    
                if(bReplaceIndex !== true)    
                {
                    var elemValue = $scope.getElementValue(elem, display?'Display':false);
                    //var exp = new RegExp(fields[i].replace('\|','\\|'),'g'); //we need to escape the pipe character to match in the regex            
                    {
                        if(elemValue===null || elemValue===undefined)
                            resultName = resultName.split(fields[i]).join('');
                        else
                        {
                            if(bEscape && elemValue.constructor === String) {
                                elemValue = elemValue.replace(/\\/g,'\\\\');
                                elemValue = elemValue.replace(/\"/g,'\\"');
                                elemValue = elemValue.replace(/[\r\n]+/gm, '\\n'); 
                            }

                            // Sanitizes merge field value for Headline and Text Block when sanitize flag is true
                            if (element && ((element.type === "Headline" || element.type === "Text Block") && element.propSetMap.sanitize)) {
                                elemValue = sanitizeValue(elemValue);
                            }

                            if(elemValue.constructor === String)
                                resultName = resultName.split(fields[i]).join(elemValue);
                            else if(elemValue.constructor === Object || elemValue.constructor === Array) {
                                resultName = resultName.split('"'+fields[i]+'"').join(angular.toJson(elemValue));    
                                resultName = resultName.split(fields[i]).join(angular.toJson(elemValue));                                        
                            }
                            else
                            {
                                if(fields.length === 1 && inputStr.match("^%") && inputStr.match("%$"))
                                    resultName = elemValue;
                                else {
                                    resultName = resultName.split('"'+fields[i]+'"').join(elemValue); 
                                    resultName = resultName.split(fields[i]).join(elemValue); 
                                }
                            }
                        }
                    }                        
                }
                else if(!angular.equals(index, NaN))
                {
                    if(elem !== null && elem !== undefined)
                        resultName = resultName.split(fields[i]).join('%'+elem+'%'); 
                }                    
            }
        }

        if (resultName && typeof resultName === 'string' && resultName.indexOf('$Vlocity.Percent') > -1) {
            resultName = resultName.replace(/\$Vlocity.Percent/g, '%');
        }

        resultName = (resultName === null || resultName === undefined)?(''):(resultName);
        return resultName;
    };

    // Sanitizes values
    sanitizeValue = function (value) {
        //* String - Directly sanitize value
        if (typeof value === 'string' || value instanceof String) {
            return $('<div>').text(value).html();
        }

        var isObject = value && typeof value === 'object' && value.constructor === Object;
        var isArray = Array.isArray(value);

        //* Objects & Arrays - Stringify and then sanitize
        if (isObject || isArray) {
            return $('<div>').text(angular.toJson(value)).html();
        }

        //* All other data types - Sanitization is not needed
        return value;
    }
          
    $scope.replaceNIndex = function(prop, index)
    {
        try
        {            
            var propArray = $scope.preprocessElementInput(prop);
            var concatStr = '';

            if(propArray && propArray.length > 0)
            {
                for(var idx=0; idx<propArray.length; idx++)
                {  
                    if(propArray[idx].length > 0)
                    {
                        concatStr += propArray[idx][0];
                        if(propArray[idx].length > 1)
                        {
                            // there should only be one
                            var n = index;
                            concatStr += '|' + eval(propArray[idx][1]);
                        }
                    } 
                    if(idx < propArray.length - 1)
                        concatStr += ':';                                            
                }
            } 
            return concatStr;     
        }
        catch(e)
        {
        }
        
        return prop;               
    }; 

    // function to get the value of an Element or JSON node
    // it supports (1) single Element (2) path (3) json node (4) json node with path
    // @param
    // prop - path
    $scope.getElementValue = function(prop, returnType)
    {
        // if the element is not found, return undefined instead of null
        try
        {
            var propArray = $scope.preprocessElementInput(prop);
            // scope is an array
            var scope = $scope.getElement(prop);

            // scope will be an array
            if(scope)
            {
                if(scope.length > 0)
                {
                    if(scope.length === 1)
                        return $scope.getSingleElementValueAux(scope[0], returnType);
                    else
                    {
                        var returnVal = [];
                        for(var i=0; i<scope.length; i++)
                        {
                            var contrl = scope[i].control;
                            if((contrl.type === 'Multi-select' || contrl.type === 'Radio' || (contrl.type === 'Filter' && contrl.propSetMap.type === 'Multi-select') || contrl.type === 'Radio Group')
                               && contrl.propSetMap.options && angular.isArray(contrl.propSetMap.options))  
                            {
                                var optionLength = contrl.propSetMap.options.length;
                                if(i%optionLength === 0)                                 
                                    returnVal.push($scope.getSingleElementValueAux(scope[i], returnType));
                            } 
                            else                                                   
                                returnVal.push($scope.getSingleElementValueAux(scope[i], returnType));
                        }
                        if(returnVal.length === 1)
                            returnVal = returnVal[0];
                        return returnVal;
                    }
                }
                else 
                    return undefined;
            }
            else
            {
                // if we can't find the Element, assume that it's in Data JSON
                // get it from Data JSON
                // Step 1|m:Text|n
                if(prop === 'timeStamp' || prop === 'userId' || prop === 'userName' || prop === 'userProfile')
                    return $scope.bpTree[prop];
                           
                return $scope.getJSONNode($scope.bpTree.response, propArray);  
            }
        }
        catch(err)
        {
            console.log(err);
            return undefined;
        }

        return undefined;
    };
    
    $scope.getJSONNode = function(data, propArray)
    {
        data = [data];
        var bArray = false;
        if(propArray && propArray.length > 0)
        {
            for(var idx1=0; idx1<propArray.length; idx1++)
            {
                // propArray[idx1] is an array as well
                var returnData = [];
                for(var i=0; i<data.length; i++)
                {                                
                    var tmp = $scope.getJSONDataByPath(data[i], propArray[idx1]);
                    if(angular.isArray(tmp))
                        bArray = true;
                    if(tmp !== null && tmp !== undefined)
                        returnData = returnData.concat(tmp);
                }
                data = returnData;
                if(!returnData || returnData.length === 0)
                    break;                            
            }
            if(data)
            {
                if(data.length === 1)
                {
                    if(data[0] !== null && data[0] !== undefined && !angular.equals(data[0], NaN))                       
                    {
                        if(!bArray)
                            return data[0];
                        else
                            return data;
                    }
                    else
                        return null;
                }
                else if(data.length > 1)
                    return data;
            }
            
            return undefined;
        } 
        
        return undefined;     
    };

    // function to get the value of a JSON node
    // supports path
    // @param
    // data - JSON
    // path - json path
    $scope.getJSONDataByPath = function(data, path)
    {
        if(path.length === 0)
            return null;
        if(!data)
            return null; //weird instance when this is called before the response is created

        try
        {
            data = data[path[0]];

            if(data === undefined || data === null || angular.equals(data, NaN))
                return null;

            var index = NaN;
            // data is not an array
            if(path.length === 1 && !angular.isArray(data))
            {
                //data = [data];
                return data;
            }

            if(path.length > 1 && !angular.isArray(data)) {
                data = [data];
            }

            // data is an array
            if(path.length > 1)
            {
                if(VOUINS.isDigit(path[1]))
                    index = parseInt(path[1], 10)-1;
                else
                    index = NaN;
            }

            if(!angular.equals(index, NaN))
            {
                if(index<data.length && index >= 0)
                {
                    data = data[index];
                    if(data === undefined || data === null || angular.equals(data, NaN))
                        return null;

                    //if(!angular.isArray(data))
                        //data = [data];
                    return data;
                }

                return null;
            }

            return data;
        }
        catch(err)
        {
            console.log(err);
            return null;
        }

        return null;
    }; 
    
    // helper function to parse a string based on the JSON path
    // @param
    // prop - JSON path
    $scope.preprocessElementInput = function(prop)
    {
        if(!prop)
            return null;

        var substrArray = prop.split(':');
        var ind;
        if(substrArray)
        {
            for(var ind=0; ind<substrArray.length; ind++)
            {
                substrArray[ind] = substrArray[ind].split('|');
            }
        }
        return substrArray;
    };

    $scope.getSingleElementValueAux = function(scope, returnType)
    {
        var dateAsDate = (returnType == 'Date' || returnType == true);
        if(scope && scope.control)
        {
            if(scope.control.show === false)
                return null;
            var cType = scope.control.type;
            if(scope.control.type === 'Filter')
                cType += ' ' + scope.control.propSetMap.type;
            if(returnType == 'Display') {
                if(scope.loopform && scope.loopform.loopname && scope.loopform.loopname.$viewValue !== null){
                    var out = '';
                    //OMNI-2770
                    switch(cType){
                        case 'Password':
                            if (scope.loopform.loopname.$viewValue === null){
                                out = null;
                                break;
                            }
                            for (var i = 0; i < (scope.loopform.loopname.$viewValue.value || scope.loopform.loopname.$viewValue).length; i++){
                                out = out + "*";
                            }
                            break;
                        case 'Date/Time (Local)':
                            if (angular.isString(scope.loopform.loopname.$viewValue)){
                                if (scope.loopform.timectrl !== undefined && typeof scope.loopform.timectrl.$viewValue == "string"){
                                    out = scope.loopform.loopname.$viewValue + " " + scope.loopform.timectrl.$viewValue;
                                } else {
                                    out = angular.isString(scope.control.response) ? new Date(scope.control.response): scope.control.response;
                                }
                                break;
                            }
                        default:
                            out = (scope.loopform.loopname.$viewValue&&scope.loopform.loopname.$viewValue.value) || scope.loopform.loopname.$viewValue;
                    }
                    return out;
                }else if(scope.control.response && scope.control.response.value != null){
                    return scope.control.response.value;
                }
            }
            switch(cType)
            {
                case 'Radio':
                case 'Select':
                case 'Filter Select':
                case 'Lookup':
                     if(scope.control.response !== undefined && scope.control.response !== null)
                     {
                         if(returnType=='Display')
                            return scope.control.propSetMap.options.find(function(opt){return opt.name == scope.control.response || opt.name == scope.control.response.name}).value;
                         if(scope.control.response.name !== undefined && scope.control.response.name !== null && scope.control.response.name !== '')
                            return scope.control.response.name;
                         return scope.control.response;
                     } 
                     else
                         return null;
                     break;
                case 'Radio Group':
                    if(scope.control.response !== null) {
                        return scope.control.response[scope.label.name];
                    }
                    else
                        return null;
                    break;
                case 'Checkbox':
                case 'Disclosure':
                     if(scope.control.response !== undefined && scope.control.response !== null)
                         return scope.control.response;
                     else
                         return false;
                     break;
                case 'Email':
                case 'Password':
                case 'Signature':
                case 'Telephone':
                case 'Text':
                case 'Text Area':
                case 'URL':
                case 'Type Ahead':
                case 'File':
                case 'Image':
                     if(scope.control.response !== undefined && scope.control.response !== null && scope.control.response !== '')
                         return scope.control.response;
                     else
                         return null;
                     break;
                case 'Currency':
                case 'Number':
                case 'Range':
                     if(!isNaN(scope.control.response) && scope.control.response != null)
                         return Number(scope.control.response);
                     else
                         return null;
                     break;
                case 'Date':
                case 'Date/Time (Local)': 
                case 'Time':
                     if(scope.control.response !== undefined && scope.control.response !== null)
                     {
                         if((scope.control.propSetMap.timeType||scope.control.propSetMap.dateType) === 'string'){
                             return scope.control.response;
                         } else{
                             var temp = moment.utc(scope.control.response);
                             if(temp.isValid()) {
                                 return dateAsDate ? temp.toDate() : temp.toISOString();
                             }
                         }
                     }
                     else
                         return null;
                     break;
                case 'Multi-select':
                case 'Filter Multi-select':
                     if(scope.control.response !== undefined && scope.control.response !== null && scope.control.response !== '')
                     {
                         return ouiBaseService.handleSelect(cType, scope.control.response,returnType=='Display');
                     }
                     else
                         return null;
                     break;
                case 'Formula':
                case 'Aggregate':
                case 'Validation':
                     if(scope.control.propSetMap.dataType === 'Date' && scope.control.response)
                         return scope.control.response.toISOString();
                     return scope.control.response;
                     break;    
                case 'Selectable Items':
                case 'Input Block':
                case 'Filter Block':
                case 'Block':
                case 'Type Ahead Block':
                case 'Edit Block':
                     return scope.control.response;
                     break;                    
                default:
                     return null;
            }
        }
        else if(scope && scope.child && scope.child.type === 'Step')
            return scope.child.response;
        else 
            return null;        
    }; 
    
    // function to get dom Element or a JSON node
    // will also support Block|1:Select|2
    // @param
    // prop - example: Block|1:Select|2 (supports path)
    // now returns an array
    $scope.getElement = function(prop)
    {
        var scope = [];
        if(!prop)
            return null;

        var propArray = $scope.preprocessElementInput(prop);
        
        if(!$scope.topBPDom)
            $scope.topBPDom = VOUINS.getTopBPDom($scope);
        
        var domEleArray = [[$scope.topBPDom]];
        // this should cover nested repeated Elements
        if(propArray && propArray.length > 0)
        {
            for(var idx=0; idx<propArray.length; idx++)
            {
                var returnDomArray = [];
                for(var dIdx=0; dIdx<domEleArray.length; dIdx++)
                // propArray[idx] is an array as well
                {
                    var tmp = domEleArray[dIdx];
                    for(var i=0; i<tmp.length; i++)
                    {
                        var tempArray = $scope.getDomElement(tmp[i], propArray[idx]);
                        if(tempArray && tempArray.length > 0)
                        {
                            returnDomArray.push(tempArray);
                        }
                    }
                }
                domEleArray = returnDomArray;
                if(!returnDomArray || returnDomArray.length === 0)
                    break;
            }
        }

        if(domEleArray && domEleArray.length > 0)
        {
            for(var i=0; i<domEleArray.length; i++)
            {
                var tmp = domEleArray[i];
                for(var j=0; j<tmp.length; j++)
                {
                    var element = angular.element(tmp[j]);
                    if(element)
                    {
                        scope.push(element.scope());
                        //var test = angular.element(scope.$id);
                    }                        
                }
            }
        }

        return ((scope && scope.length > 0)?scope:null);
    };  
    
    // helper function to get the DOM based on the JSON path
    // @param
    // parentDomEle - parent DOM Element, starts with document
    // path - JSON path
    $scope.getDomElement = function(parentDomEle, path)
    {
        if(path.length === 0)
            return null;

        var domEleArray = [];
        var bAdjust = false;
        var optionLength;
        try
        {
            var eleArray = [];
            // rMap will be undefined in pre v100
            if($scope.bpTree.rMap) {
                // not a repeat element + name does not have white space in it + parentDomEle = document
                if(!$scope.bpTree.rMap.hasOwnProperty(path[0]) && !/\s/g.test(path[0]) && 
                   parentDomEle.getElementById) {
                       var tempEle = parentDomEle.getElementById(path[0]);
                       if(tempEle)
                           eleArray = [tempEle];
                }
                else {
                    // repeat element
                    if($scope.bpTree.rMap.hasOwnProperty(path[0]))
                        eleArray = parentDomEle.querySelectorAll("[id='"+path[0]+"']");
                    // not a repeat element
                    else {
                        eleArray = parentDomEle.querySelector("[id='"+path[0]+"']");   
                        if(eleArray)
                            eleArray = [eleArray];
                    }
                }                   
            }
            else {
                eleArray = parentDomEle.querySelectorAll("[id='"+path[0]+"']");               
            }                

            if(eleArray && eleArray.length>0)
            {
                // if the user does not specify the index
                // then we need to return the dom array
                // first figure out the type 
                var element = angular.element(eleArray[0]);
                if(element)
                {
                    scope = element.scope();

                    if(scope && scope.control && 
                       ((scope.control.type === 'Multi-select' || scope.control.type === 'Radio' || (scope.control.type === 'Filter' && scope.control.propSetMap.type === 'Multi-select'))
                         && scope.control.propSetMap.options && angular.isArray(scope.control.propSetMap.options)))
                    {
                        bAdjust = true;  
                        optionLength = scope.control.propSetMap.options.length;   
                    }  
                }     
                                    
                var index = NaN;
                if(path.length > 1)
                {
                    if(VOUINS.isDigit(path[1]))
                        index = parseInt(path[1], 10)-1;
                    else
                        index = NaN;
                }

                if(!angular.equals(index, NaN))
                {
                    if(index < eleArray.length && index >= 0)
                    {
                        if(bAdjust)
                            index = index*optionLength; 
                    
                        if(index < eleArray.length && index >= 0)
                        {
                            domEleArray.push(eleArray[index]);
                            return domEleArray;   
                        }
                    }
                    
                    return null;                 
                }

                return eleArray;
            }
        }
        catch(err)
        {
            console.log(err);
            return null;
        }
        
        return null;
    };
    
    $scope.getCurrencySymbol =function(scope, scpService)
    {
        try {
            if(!scope.bpTree.hasOwnProperty('oSCurrencySymbol')) {
                var curSymbol;
                if(!scpService)
                    scpService = {};
            
                if(scope.bpTree.propSetMap.hasOwnProperty('currencyCode'))
                    curSymbol = currencySymbol[scpService.oSCurrencyCode] || currencySymbol[scpService.oSCurrencyCodeAttr] ||
                                currencySymbol[scope.bpTree.propSetMap.currencyCode] || currencySymbol[scope.bpTree.userCurrencyCode];
                else {
                    scope.bpTree.oSCurrencySymbol = null;
                    return;
                }
            
                if(!curSymbol)
                    curSymbol = currencySymbol['USD'];
            
                scope.bpTree.oSCurrencySymbol = curSymbol['text'];
                scope.bpTree.oSCurrencySetting = curSymbol;
                scope.bpTree.cpqCurrencySymbol = currencySymbol[scope.bpTree.userCurrencyCode] ? currencySymbol[scope.bpTree.userCurrencyCode]['text'] : currencySymbol['USD']['text'];
            }
        }
        catch(err) {
            console.log(err);
        }
    }


    // helper function to check the validity of a step or the entire script
    // @param
    // scp - scope
    // arrayIndex - index of the repeated Element
    // indexInParent - index of the Element as a child to the Parent Element
    // validationRequired - need validation or not
    $scope.checkValidity = function(scp, arrayIndex, indexInParent, validationRequired, ngformId, bNoAlert)
    {
        var isInvalid = false;
        var isTruelyInvalid = false;
        var stepValidationReq = {};

        var hasClass = function(element, cls) {
            return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
        }

        if(validationRequired === 'Submit' && scp.bpTree && scp.bpTree.children)
        {
            // need to validate all forms
            for(var i=0; i < scp.bpTree.children.length; i++)
            {
                var formId = scp.bpTree.sOmniScriptId + '-' + i;
                var form = document.getElementById(formId);
                //var form = document.querySelector('[id='+formId+']');
                if(form)
                {
                    isInvalid = hasClass(form, 'ng-invalid');
                    if(isInvalid === true)
                        break;
                }
            }
        }

        if(validationRequired === 'Step' || validationRequired === 'StepNext')
        {
            // get the step the button belongs to
            var formId = (validationRequired === 'Step')?($scope.findStep(scp, arrayIndex, indexInParent, stepValidationReq)):ngformId;
            //var form = document.querySelector('[id='+formId+']');
            var form = document.getElementById(formId);
            if(form)
            {
                isTruelyInvalid = hasClass(form, 'ng-invalid');
                isInvalid = isTruelyInvalid;
            }

            // if validation Required for Step is false
            if(stepValidationReq.validationRequired === false )
                isInvalid = false;
            if(stepValidationReq.truelyInvalid === true)
                isTruelyInvalid = true;
            if(scp.child && scp.child.type === 'Step')
            {
                scp.child.tInvalid = isTruelyInvalid;
                scp.child.inValid = isInvalid;
            }
        }

        if(isInvalid && !bNoAlert)
        {
            if(validationRequired === 'Submit')
                window.alert(new Error(customLabels.OmniStepValidationError));
            else
                window.alert(new Error(customLabels.OmniStepValidationError));
        }

        //omniForm validation
        if($scope.miniForm) {
            return isInvalid;
        }

        if(bNoAlert)
           return false;
        else
           return isInvalid;
    };

    $scope.findStep = function(scp, arrayIndex, indexInParent, stepValidationReqProp) {
        var formId;
        if(scp)
        {
            if(scp.$parent)
            {
                var parent = (ouiBaseService.layout === 'lightning' || ouiBaseService.layout === 'newport')?scp.$parent:scp.$parent.$parent;

                if(parent) {
                    if(parent.child && parent.child.eleArray)
                    {
                        formId = $scope.findStep(parent.$parent, arrayIndex, parent.child.indexInParent, stepValidationReqProp);
                    }
                    else
                    // hit root
                    {
                        var root = (parent.child)?parent.child:parent.step;
                        if(root)
                        {
                            var stepIndex = root.indexInParent;
                            formId = scp.bpTree.sOmniScriptId + '-' + stepIndex;
                            if(!root.propSetMap.validationRequired)
                                stepValidationReqProp.validationRequired = false;
                            if(root.bSrvErr === true)
                                stepValidationReqProp.truelyInvalid = true;
                        }
                    }
                }
            }
        }
        return formId;
    };

    /*
        inputError : accepts error objects or error strings,
        customError : array of objects that contain the following properties 
                      path : specifies object path of property to replace
                      value : the value of the property defined by the path
                      message : the new error message to be displayed for specified path and value

        string error messages get replaced if value matches.
        object error messages will get checked against the path, if no replacements occur, stringify the error object.

        if header contains errorMessages to replace, use them.
        if no header, use element level error messages,
    */
    $scope.errorReplace = function(inputError, control) {
        var customError = (control && control.propSetMap) ? control.propSetMap.errorMessage : null;
        // jsonstring -> object
        // string -> string
        // null, int, undefined -> does nothing
        var error = (function(err) {
            try {
                return angular.fromJson(err);
            }
            catch(e) {
                return err;
            }
        })(inputError);

        var newError = error;
        var headerError = ($scope.bpTree && $scope.bpTree.propSetMap) ? $scope.bpTree.propSetMap.errorMessage : null;

        // error messages defined in script configuration (header)
        if(headerError) {
            newError = $scope.performErrorReplace(error, headerError.custom);
        }
        // error messages defined in element/action level
        if(newError === error && customError) {
            newError = $scope.performErrorReplace(error, customError.custom);
        }
        // default error message from element/action level
        if(newError === error && customError && customError.default) {
            newError = customError.default;
        }
        // could not find matches, stringify it
        else if(typeof newError === "object") { 
            newError = angular.toJson(error);
        }

        return newError;
    }

    /* 
       error: an error string or error object, and
       customError: a custom error object that contains replacement strings and a default error message

       if no matches: returns the original input (int, string, array, object, null, undefined)
       if matches: returns new error message (string)
    */
    $scope.performErrorReplace = function(error, customError) {
        if(!customError) return error;
        
        if(typeof error === "string") {
            for(var i = 0; i < customError.length; i++) {
                if(error === customError[i].value) {
                    error = customError[i].message;
                    break;
                }
            }
        }
        else if(typeof error === "object") {
            for(var i = 0; i < customError.length; i++) {
                var path = customError[i].path;
                var propArray = $scope.preprocessElementInput(path);
                var node = $scope.getJSONNode(error, propArray) || null;
                if(node) {
                    // only path is specified, use that as the error message
                    if(path && !customError[i].value && !customError[i].message) {
                        error = node;
                        break;
                    }
                    // confirm the path's value matches then replace
                    else if(node === customError[i].value) {
                        error = customError[i].message;
                        break;
                    }
                }
            }
        }

        return error;
    }
};

},{}],3:[function(require,module,exports){
/* cancells the bubbling of events */
(function(){
    'use strict';
    /*the purpose of this directive is to cancel the bubbling of scrolling events
      this could be extended for other events in the future by passing attributes*/
    var dModule = angular.module('vlocity-oui-common');
    dModule.directive('appFilereader', function($q, ouiBaseService){
        var slice = Array.prototype.slice;
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 10,
            link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return;

                if(attrs.appFilereader === 'miniForm') {
                    ouiBaseService.miniForm = true;
                }
                ngModel.$render = function() {}

                element.bind('change', function(e) {
                    var element = e.target;
                    if(!element.value) return;

                    element.disabled = true;
                    $q.all(slice.call(element.files, 0).map(readFile))
                    .then(function(values) {

                        if(element.multiple || element)
                        {
                            var fileArray = ngModel.$viewValue;
                            if(VOUINS.isEmpty(fileArray))
                                fileArray = [];
                            for(var i=0; i<element.files.length; i++)
                            {
                                var f = {};
                                f.filename = element.files[i].name;
                                f.size = element.files[i].size;
                                // store the key
                                f.data = VOUINS.generateUUID();
                                if(!scope.bpTree.filesMap)
                                    scope.bpTree.filesMap = {};

                                scope.bpTree.filesMap[f.data] = values[i];

                                //f.data = values[i];
                                fileArray.push(f);
                            }
                            ngModel.$setViewValue(fileArray);
                        }
                        element.value = null;
                        element.disabled = false;
                        ouiBaseService.aggregate(scope, scope.control.index, scope.control.indexInParent, true, -1);

                        if (scope.control.propSetMap.uploadContDoc) {
                            scope.uploadContentVersions(scope, scope.control);
                        }
                    });

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            deferred.resolve(e.target.result);
                        }
                        reader.onerror = function(e) {
                            deferred.reject(e);
                        }

                        reader.readAsDataURL(file);

                        return deferred.promise;
                    };
                }); // change
            } // link
        }; // return
    }); // appFilereader

}());


},{}],4:[function(require,module,exports){
// directive - to trigger aggregation when an input Element is modified
// to update the data json
(function() {
    var app = angular.module('vlocity-oui-common');
    app.directive('chainup', function (ouiBaseService) {
        'use strict';         
        return {
            restrict: 'A', // only activate on element attribute
            require: 'ngModel', // get hold of NgModelController
            priority: 1,         
            link: function(scope, element, attrs, ngModel) {
                if (!ngModel)
                    return; // do nothing if no ng-model

                // Listen for change events to enable binding
                // NOTE1: this directive does not work for Checkbox, Disclosure, Radio and File type, so for these three types
                // for Checkbox, Disclosure, Radio, Multi-select use ng-change
                // for File, take care of the chainup in appFilereader directive
                // NOTE2, for control which uses ui-mask, change event does not fire, have to use change blur
                if(attrs.chainup === 'miniForm') {
                    ouiBaseService.miniForm = true;
                }
                if(scope.control)
                {                 
                    if(scope.control.propSetMap.mask === undefined || scope.control.propSetMap.mask === null || 
                       scope.control.propSetMap.mask === '')
                    {
                        element.bind('change', function() {
                            ouiBaseService.aggregate(scope, scope.control.index, scope.control.indexInParent, true, -1);
                        });
                    }
                    else
                    {
                        element.bind('change blur', function() {
                            ouiBaseService.aggregate(scope, scope.control.index, scope.control.indexInParent, true, -1);
                        });
                    }
                }
            }
        };
    });
}()); 
},{}],5:[function(require,module,exports){
/*
* Usage : <p vlc-bind-html="{{control.propSetMap.text}}"></p>
* Required: ng-bind-html directive on the same element
* Notes : ng-bind-html attribute can have any value and the directive would bind a variable
* on the scope with the same name
* Following are some of the valid usages:
*/
(function(){

    'use strict';
    if(window.sessionId === '{!$Api.Session_ID}') {
        var omniout = true;
    }

    var bpModule = angular.module('vlocity-oui-common').
        directive('vlcBindHtml',
                  ['$sce',
                   '$parse',
                   '$compile',
                   function($sce, $parse, $compile) {
                       return {
                           restrict: 'A',
                           compile: function ngBindHtmlCompile(tElement, tAttrs){
                               var ngBindHtmlGetter = $parse(tAttrs.vlcBindHtml);
                               var ngBindHtmlWatch = $parse(tAttrs.vlcBindHtml, function sceValueOf(val) {
                                   // Unwrap the value to compare the actual inner safe value, not the wrapper object.
                                   return $sce.valueOf(val);
                               });

                               $compile.$$addBindingClass(tElement);

                               return function ngBindHtmlLink(scope,element, attrs) {
                                   $compile.$$addBindingInfo(element, attrs.vlcBindHtml);
                                   var control = scope.control;

                                   function bindHtml(value) {
                                       if (omniout) {
                                           element.html($compile($sce.getTrustedHtml(value))(scope) || '');
                                       }else {
                                           element.html($sce.getTrustedHtml(value) || '');
                                       }
                                   }

                                   //we don't want to support merge fields for disclosure elements
                                   //therefore no need to watch
                                   if (control.type === 'Disclosure'){
                                       var value = control.propSetMap.text;

                                       if (!value){
                                           return ;
                                       }

                                       //OMNI-2055
                                       value = $sce.trustAsHtml(value);

                                       bindHtml(value);

                                       return ;
                                   }
                                   else if(scope.miniForm) {
                                       var value = control.propSetMap.value;

                                       if (!value){
                                           return ;
                                       }

                                       bindHtml(value);

                                       return ;
                                   }

                                   
                                   //handling text blocks with merge fields in them
                                   var contentUpdate = scope.$watch(function(){
                                       return scope.refresh(control, true);
                                   }, function(val){
                                       //OMNI-2055
                                       var value = $sce.trustAsHtml(val);
                                       bindHtml(value);
                                   });
                               }
                           }
                       };
                   }]);
}());

},{}],6:[function(require,module,exports){
// fixes date and time formats moment.js-ish --> angularjs
(function(){
    'use strict';
    angular.module('vlocity-oui-common')
        .directive('dateFormat',function () {
            var dateFormatPtrn = /Y(?!ear)|D(?!ate)|m/g;
            var dateTimeFormatPtrn = /Y(?!ear)|D(?!ate)/g;

            var dateFormatFn = function(match){
                if (/^[YD]$/.test(match))
                    return match.toLowerCase();
                if (/^[m]$/.test(match))
                    return match.toUpperCase();
                return match;
            };

            return {
                restrict:'A',
                link:function (scope, el, attrs){
                    // use regex to detect and fix dateformats
                    var formatKey = attrs.hasOwnProperty('dateFormat') ? 'dateFormat' : 'modelDateFormat';
                    var formatPtrn = (scope.control && scope.control.type !== 'Formula') ? dateFormatPtrn : dateTimeFormatPtrn;
                    if (attrs[formatKey] && angular.isString(attrs[formatKey])){
                        attrs[formatKey] = attrs[formatKey].replace(formatPtrn,dateFormatFn);
                        if (scope.control){
                            scope.control.propSetMap[formatKey] = attrs[formatKey];
                        }
                    }
                }
            };
        });

    angular.module('vlocity-oui-common')
        .directive('timeFormat', function () {
            var time1224Ptrn = /(h)([^Aa]*?$)/g;

            var time1224Fn = function(match){
                return match.replace(/h/g,'H');
            };

            return {
                restrict:'A',
                link:function (scope, el, attrs){
                    // use regex to detect and fix dateformats
                    if (attrs.timeFormat && angular.isString(attrs.timeFormat)){
                        attrs.timeFormat = attrs.timeFormat.replace(time1224Ptrn,time1224Fn);
                        if (scope.control)
                            scope.control.propSetMap.timeFormat = attrs.timeFormat;
                    }
                }
            };
        });

}());

},{}],7:[function(require,module,exports){
(function(){
    'use strict';
    var bpModule = angular.module('vlocity-oui-common');
    bpModule.directive('vlcSldsLookupControl', ['$rootScope','$window',function($rootScope,$window){
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope,element,attrs, ngModelCtrl){

                var bodyEl = angular.element($window.document.body);
                
                ngModelCtrl.$validators.validateValLookup = function(modelValue){
                    if (modelValue || modelValue === null){
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                };

                var progMessage = scope.customLabels.OmniLoading || ' - loading list from the server .....';

                ngModelCtrl.$formatters.unshift(function(modelValue){
                    var vObjects = scope.control.viewObjects || scope.control.propSetMap.options;
                    var index = _.findIndex(vObjects, {
                        name: modelValue
                    });
                    if (modelValue && vObjects && (index >= 0)){
                        ngModelCtrl.$setTouched();
                        ngModelCtrl.$setDirty();
                        scope.aggregate(scope, scope.control.index, scope.control.indexInParent, true, -1);
                        return vObjects[index].value;
                    }
                    // if the user wants to set it to null
                    if(modelValue === null)
                        scope.aggregate(scope, scope.control.index, scope.control.indexInParent, true, -1);
                    return null;
                });


                //this will convert the result from array to object
                scope.convertToObject = function(flag){
                    if (flag){
                        show();
                    }
                    scope.control.viewObjects = [];

                    var options = scope.control.propSetMap.options;

                    (!(options && options.length)) && (function(){
                        scope.loadingData = progMessage;
                    }());

                    //code ref in the legacy code to make it a promise
                    var optPromise = scope.getLookupOptions(scope.control, scope);
                    optPromise && optPromise.then && optPromise.then(function(){
                        //scope.control.viewObjects = _.keyBy(scope.control.propSetMap.options, 'name');
                        scope.control.viewObjects = scope.control.propSetMap.options;
                        scope.loadingData = '';
                    });

                };

                scope.setViewValue = function(obj){
                    scope.control.response = obj.name;
                    hide();
                };

                function onBodyClick(evt) {
                    if (element[0] === evt.target || 
                        $.contains(element[0], evt.target) ||
                        $.contains(element[0].nextElementSibling, evt.target)) { 
                        return;
                    }
                    hide();
                    return true;
                }

                function show () {
                    bodyEl.on('click', onBodyClick);
                    scope.control.showSubList = true;
                }

                function hide () {
                    bodyEl.off('click', onBodyClick);
                    scope.control.showSubList = false;
                    safeDigest(scope);

                }

                function safeDigest(scope) {
                    /* eslint-disable no-unused-expressions */
                    scope.$$phase || (scope.$root && scope.$root.$$phase) || scope.$digest();
                    /* eslint-enable no-unused-expressions */
                }

                //scope.convertToObject(true);//prefilling lookup

            }
        };
    }]);
}());

},{}],8:[function(require,module,exports){
// Only one handle is supported, supporting multiple handles will require significant rewrites
(function(){
    'use strict';

    function parseFloatIfNum(x) {
        return x === "" ? 0 : isNaN(x) ? 0 : parseFloat(x);
    }

    var bpModule = angular.module('vlocity-oui-common');
    bpModule.provider('$vlcRangeSlider', function () {

        // defaults and overrides for this directive, not for noUISlider
        var defaults = this.defaults = {
            animate: false,
            animationDuration: 100,
            behaviour: 'drag',
            orientation: 'horizontal',
            range: { min: 5, max: 10 },
            step: 1,
            start: 5,
            direction: 'ltr'
        };

        this.$get = function ($rootScope, $window) {
            var isNative = /(ip[ao]d|iphone|android)/ig.test($window.navigator.userAgent);
            var isTouch = ('createTouch' in $window.document || 'ontouchstart' in $window.document) && isNative;

            function VlcRangeSliderFactory(element, controller, config) {
                var $vlcRangeSlider = noUiSlider.create(element[0], angular.extend({}, defaults, config));
                var options = $vlcRangeSlider.options;
                var scope = $vlcRangeSlider.$scope = options.scope && options.scope.$new() || $rootScope.$new();
                var keyMap = { 37: options.direction != 'ltr', 38: 1, 39: options.direction == 'ltr', 40: 0 };
                options.scope.control.prevScrollval = options.scope.control.propSetMap.defaultValue != null ? options.scope.control.propSetMap.defaultValue : options.range.min;
                if (options.scope.control.response != null)
                    options.scope.control.prevScrollval = options.scope.control.response;

                // Scope Methods
                scope.commitSliderVal = function (event, ui) {
                    if (event != null && event[ui] != null && (event[ui] - options.scope.control.prevScrollval >= 0) && (event[ui] - options.scope.control.prevScrollval) != options.step && event[ui] + options.step > options.range.max) {
                        $vlcRangeSlider.set(options.scope.control.prevScrollval);
                        return false;
                    }
                    options.scope.control.prevScrollval = (event != null && event[ui] != null) ? event[ui] : options.scope.control.prevScrollval;
                    controller.$setViewValue($vlcRangeSlider.get());
                    (angular.isFunction(controller.$oldRender) ? controller.$oldRender : controller.$render)();
                };

                // Public methods
                $vlcRangeSlider.init = function () {
                    bindSliderEvents();
                    bindKeyboardEvents();
                    controller.$render();
                };

                var _destroy = $vlcRangeSlider.destroy;
                $vlcRangeSlider.destroy = function () {
                    unbindSliderEvents();
                    unbindKeyboardEvents();
                    scope.$destroy();
                    _destroy();
                };

                // Protected methods
                $vlcRangeSlider.$onKeyDown = function (evt) {
                    if (element.attr('disabled')) return;
                    var offset = $vlcRangeSlider.steps()[0][keyMap[evt.keyCode] * 1];
                    if (typeof offset == 'number' && !isNaN(offset)) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        controller.$setViewValue($vlcRangeSlider.get() * 1 + offset * (keyMap[evt.keyCode] * 2 - 1));
                        controller.$render();
                    }
                };

                // bind/unbind events
                function bindSliderEvents() {
                    $vlcRangeSlider.on('slide', scope.commitSliderVal);
                }
                function unbindSliderEvents() {
                    $vlcRangeSlider.off();
                }

                function bindKeyboardEvents() {
                    element.children().children().on('keydown', $vlcRangeSlider.$onKeyDown);
                }
                function unbindKeyboardEvents() {
                    element.children().children().off('keydown');
                }

                return $vlcRangeSlider;
            }

            VlcRangeSliderFactory.defaults = defaults;

            return VlcRangeSliderFactory;
        };

    })
    .directive('vlcRangeSlider', function ($window, $vlcRangeSlider, ngIfDirective) {
        // window.format provided by viaMasks
        var defaults = $vlcRangeSlider.defaults;
        var format = typeof $window.format == "function" ? $window.format : function (mask, input) { return input; };
        var isNative = /(ip[ao]d|iphone|android)/ig.test($window.navigator.userAgent);
        var isTouch = ('createTouch' in $window.document || 'ontouchstart' in $window.document) && isNative;
        var ngIf = ngIfDirective[0];

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, controller, $rootScope) {

                var options = { scope: scope },
                    rangeLowVal = scope.control.propSetMap.rangeLow,
                    rangeHighVal = scope.control.propSetMap.rangeHigh,
                    repeatClone = scope.control.propSetMap.repeatClone,
                    defaultValue = scope.control.propSetMap.defaultValue,
                    rangeLow = 5, rangeHigh = 10, mergeLowVal, mergeHighVal, slider, updateOpt, repeatCloneResp;

                // Directive options
                angular.forEach(['mask'], function (key) {
                    if (angular.isDefined(attrs[key])) options[key] = attrs[key];
                });

                angular.forEach(['min', 'max', 'step'], function (key) {
                    if (angular.isDefined(attrs[key])) options[key] = parseFloatIfNum(attrs[key]);
                });

                // Dynamic min max

                if (rangeLowVal === undefined || rangeLowVal === null) {
                    scope.control.propSetMap.rangeLow = 5;
                    rangeLowVal = 5;
                }

                if (rangeHighVal === undefined || rangeHighVal === null) {
                    scope.control.propSetMap.rangeHigh = 10;
                    rangeHighVal = 10;
                }

                if (typeof rangeLowVal === 'string' && /^[%].*?[%]$/.test(rangeLowVal) && !repeatClone) {
                    if (scope.control.response == null)
                        scope.control.response = (defaultValue == null) ? rangeLow : defaultValue;
                } else if (!repeatClone) {
                    rangeLow = isNaN(rangeLowVal) ? 5 : parseFloatIfNum(rangeLowVal);
                    if (scope.control.response == null)
                        scope.control.response = (defaultValue == null) ? rangeLow : defaultValue;
                } else if (repeatClone) {
                    rangeLow = isNaN(rangeLowVal) ? 5 : parseFloatIfNum(rangeLowVal);
                    if (scope.control.response == null)
                        scope.control.response = (defaultValue == null) ? rangeLow : defaultValue;
                    repeatCloneResp = scope.control.response;
                }

                if (!(typeof rangeHighVal === 'string' && /^[%].*?[%]$/.test(rangeHighVal))) {
                    rangeHigh = parseFloatIfNum(rangeHighVal);
                }

                attrs.ngIf = function () {
                    if ((typeof rangeLowVal === 'string' && /^[%].*?[%]$/.test(rangeLowVal)) ||
                        (typeof rangeHighVal === 'string' && /^[%].*?[%]$/.test(rangeHighVal))) {
                        var element = (scope.$parent && scope.$parent.control) ? scope.$parent.control : scope.control;
                        mergeLowVal = (typeof rangeLowVal !== 'string') ? rangeLowVal : scope.handleMergeField(rangeLowVal, false, null, element);
                        mergeHighVal = (typeof rangeHighVal !== 'string') ? rangeHighVal : scope.handleMergeField(rangeHighVal, false, null, element);

                        if (isNaN(mergeLowVal) || mergeLowVal == null)
                            mergeLowVal = 5;
                        if (isNaN(mergeHighVal) || mergeHighVal == null)
                            mergeHighVal = 10;
                        mergeLowVal = parseFloatIfNum(mergeLowVal);
                        mergeHighVal = parseFloatIfNum(mergeHighVal);
                        updateRangeOptions(mergeLowVal, mergeHighVal);
                    }
                };
                ngIf.link.apply(ngIf, arguments);

                function updateRangeOptions(mergeLVal, mergeHVal) {
                    if ((rangeLow !== mergeLVal) || (rangeHigh !== mergeHVal)) {
                        rangeLow = mergeLVal;
                        rangeHigh = mergeHVal;
                        if (rangeLow == rangeHigh)
                            return;

                        if (scope.control.response == null)
                            scope.control.response = rangeLow;

                        updateOpt = {
                            range: {
                                min: rangeLow,
                                max: rangeHigh
                            },
                            start: rangeLow
                        }
                        if (!repeatClone) {
                            if (scope.control.response == null)
                                scope.control.response = (defaultValue == null) ? rangeLow : defaultValue;
                        }

                        if (repeatCloneResp != null) {
                            scope.control.response = repeatCloneResp;
                            repeatCloneResp = null;
                        }

                        options.range.min = rangeLow;
                        options.range.max = rangeHigh;
                        options.scope.control.prevScrollval = scope.control.response != null ? scope.control.response : rangeLow;
                        element.attr('min', rangeLow);
                        element.attr('max', rangeHigh);
                        element.attr('aria-valuemin', rangeLow);
                        element.attr('aria-valuemax', rangeHigh);
                        slider.updateOptions(updateOpt);
                        slider.set(rangeLow);
                        slider.init();
                    }
                }

                // Generated options
                if (!angular.isDefined(options.start)) {
                    options.start = parseFloatIfNum(rangeLow) ? parseFloatIfNum(rangeLow) : 5;
                }

                options = angular.extend({}, options, {
                    direction: element.css('direction') === 'rtl' ? 'rtl' : 'ltr',
                    range: {
                        min: angular.isDefined(rangeLow) ? parseFloatIfNum(rangeLow) : 5,
                        max: angular.isDefined(rangeHigh) ? parseFloatIfNum(rangeHigh) : 10
                    },
                    step: angular.isDefined(attrs.step) ? parseFloatIfNum(attrs.step) : 1,
                    tooltips: { to: formatDisplayVal },
                    format: {
                        to: roundToStep,
                        from: parseFloatIfNum
                    }
                });

                function formatDisplayVal(x) {
                    return String(format(options.mask, roundToStep(x)));
                }

                function roundToStep(x) {
                    var rVal = Math.round((parseFloatIfNum(x) - options.range.min) / options.step) * options.step + options.range.min;
                    return (options.range.max >= rVal ? rVal : options.range.max);
                }

                // Use native on touch devices
                if (isTouch) {
                    element.after('<span vlc-range-slider-generated></span>');
                    var sliderTooltip = element.next();
                    var updateToolTip = function () {
                        sliderTooltip.text(formatDisplayVal(controller.$viewValue));
                    };

                    controller.$oldRender = controller.$render;
                    controller.$render = function () {
                        controller.$oldRender();
                        updateToolTip();
                    };

                    controller.$viewChangeListeners.push(updateToolTip);
                } else {
                    // Generate noUiSlider target and hide base slider
                    element.after('<div class="noUISlider" vlc-range-slider-generated></div>');
                    var noUiEle = element.next();
                    element.css('display', 'none');

                    // Watch Attrs
                    if (attrs.ngDisabled) {
                        scope.$watch(attrs.ngDisabled, function (newValue, oldValue) {
                            if (!slider || !angular.isDefined(newValue)) return;
                            if (newValue === true) {
                                noUiEle.attr('disabled', true);
                            } else {
                                noUiEle.removeAttr('disabled');
                            }
                        });
                    }

                    // Initialize noUISlider
                    slider = $vlcRangeSlider(noUiEle, controller, options);

                    // Initialize link between noUISlider and model
                    scope.$evalAsync(function init() {
                        controller.$oldRender = controller.$render;
                        controller.$render = function () {
                            controller.$oldRender();
                            slider.set(controller.$viewValue);
                        };

                        // Null handling
                        controller.$formatters.push(function (modelValue) {
                            return modelValue === null ? options.start : modelValue;
                        });

                        slider.init();
                    });

                    // Garbage collection
                    scope.$on('$destroy', function () {
                        if (slider) slider.destroy();
                        options = null;
                        slider = null;
                    });
                }

            }
        };
    })
    .directive('vlcNewportRangeSlider', function ($window, ngIfDirective) {
        var ngIf = ngIfDirective[0];
        var format = typeof $window.format == "function" ? $window.format : function (mask, input) { return input; };

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, controller) {

                var rangeLowVal = scope.control.propSetMap.rangeLow,
                    rangeHighVal = scope.control.propSetMap.rangeHigh,
                    repeatClone = scope.control.propSetMap.repeatClone,
                    defaultValue = scope.control.propSetMap.defaultValue,
                    rangeLow = 5, rangeHigh = 10, mergeLowVal, mergeHighVal, repeatCloneResp;

                // Dynamic min max

                if (rangeLowVal === undefined || rangeLowVal === null) {
                    scope.control.propSetMap.rangeLow = 5;
                    rangeLowVal = 5;
                }

                if (rangeHighVal === undefined || rangeHighVal === null) {
                    scope.control.propSetMap.rangeHigh = 10;
                    rangeHighVal = 10;
                }

                if (typeof rangeLowVal === 'string' && /^[%].*?[%]$/.test(rangeLowVal) && !repeatClone) {
                    if (scope.control.response == null)
                        scope.control.response = (defaultValue == null) ? rangeLow : defaultValue;
                } else if (!repeatClone) {
                    rangeLow = isNaN(rangeLowVal) ? 5 : parseFloatIfNum(rangeLowVal);
                    if (scope.control.response == null)
                        scope.control.response = (defaultValue == null) ? rangeLow : defaultValue;
                } else if (repeatClone) {
                    rangeLow = isNaN(rangeLowVal) ? 5 : parseFloatIfNum(rangeLowVal);
                    if (scope.control.response == null)
                        scope.control.response = (defaultValue == null) ? rangeLow : defaultValue;
                    repeatCloneResp = scope.control.response;
                }

                if (!(typeof rangeHighVal === 'string' && /^[%].*?[%]$/.test(rangeHighVal))) {
                    rangeHigh = parseFloatIfNum(rangeHighVal);
                }

                element.attr('min', rangeLow);
                element.attr('max', rangeHigh);
                element.attr('aria-valuemin', rangeLow);
                element.attr('aria-valuemax', rangeHigh);

                attrs.ngIf = function () {
                    if ((typeof rangeLowVal === 'string' && /^[%].*?[%]$/.test(rangeLowVal)) ||
                        (typeof rangeHighVal === 'string' && /^[%].*?[%]$/.test(rangeHighVal))) {
                        var element = (scope.$parent && scope.$parent.control) ? scope.$parent.control : scope.control;
                        mergeLowVal = (typeof rangeLowVal !== 'string') ? rangeLowVal : scope.handleMergeField(rangeLowVal, false, null, element);
                        mergeHighVal = (typeof rangeHighVal !== 'string') ? rangeHighVal : scope.handleMergeField(rangeHighVal, false, null, element);

                        if (isNaN(mergeLowVal) || mergeLowVal == null)
                            mergeLowVal = 5;
                        if (isNaN(mergeHighVal) || mergeHighVal == null)
                            mergeHighVal = 10;
                        mergeLowVal = parseFloatIfNum(mergeLowVal);
                        mergeHighVal = parseFloatIfNum(mergeHighVal);
                        updateRangeOptions(mergeLowVal, mergeHighVal);
                    }
                };
                ngIf.link.apply(ngIf, arguments);

                scope.formatDisplayVal = function () {
                    if (!attrs.mask) {
                        return scope.control.response;
                    }

                    return String(format(attrs.mask, roundToStep(scope.control.response)));
                }

                function roundToStep(x) {
                    var step = angular.isDefined(attrs.step) ? parseFloatIfNum(attrs.step) : 1;
                    var rVal = Math.round((parseFloatIfNum(x) - rangeLow) / step) * step + rangeLow;
                    return (rangeHigh >= rVal ? rVal : rangeHigh);
                }

                function updateRangeOptions(mergeLVal, mergeHVal) {
                    if ((rangeLow !== mergeLVal) || (rangeHigh !== mergeHVal)) {
                        rangeLow = mergeLVal;
                        rangeHigh = mergeHVal;
                        if (rangeLow == rangeHigh)
                            return;

                        if (scope.control.response == null) {
                            scope.control.response = rangeLow;
                        }

                        if (!repeatClone && scope.control.response == null) {
                            scope.control.response = (defaultValue == null) ? rangeLow : defaultValue;
                        }

                        if (repeatCloneResp != null) {
                            scope.control.response = repeatCloneResp;
                            repeatCloneResp = null;
                        }


                        element.attr('min', rangeLow);
                        element.attr('max', rangeHigh);
                        element.attr('aria-valuemin', rangeLow);
                        element.attr('aria-valuemax', rangeHigh);

                        if (rangeLow > scope.control.response) {
                            scope.control.response = rangeLow;
                        }

                        if (rangeHigh < scope.control.response) {
                            scope.control.response = rangeHigh;
                        }
                    }
                }

            }
        };
    });
}());

},{}],9:[function(require,module,exports){
/* cancells the bubbling of events */
(function(){
    'use strict';
    /*the purpose of this directive is to cancel the bubbling of scrolling events
      this could be extended for other events in the future by passing attributes*/
    var dModule = angular.module('vlocity-oui-common');
    dModule.directive('vlcBubbleCanceller', function(){
        return {
            restrict: 'A',
            scope:false,
            link: function(scope, elem, attrs){
                elem.bind('click keydown', function (e) {
                    var keyCode = e.which || e.keyCode;
                    if(e.type!='click'&&keyCode !== 32 && keyCode !== 13){return;}
                    e.stopPropagation();
                    if (attrs.vlcBubbleCanceller === 'true'){
                        e.preventDefault();
                    }
                    if(e.type=='keydown'&&e.target.type==="button"&&e.target.attributes.hasOwnProperty('ng-click')){
                        e.target.click();
                    }
                    return false;
                }); 
            }
        };
    });

}());


},{}],10:[function(require,module,exports){
(function(){
    'use strict';
    /*the purpose of this directive is to
      1. Validate the values when the model is modified externally
      2. This directive is only applicable for checkbox
     */
    var dModule = angular.module('vlocity-oui-common');
    function setViewValue(mask, value, elem){
        if (mask) {
            elem[0].value = value;
        }
    }
    
    dModule.directive('vlcSldsCheckValChecker', function(){
        return {
            restrict: 'A',
            scope:false,
            require: 'ngModel',
            link: function(scope, elem, attrs, ngModelCtrl){                
                if(scope.bpTree.readOnly === true)
                    return;

                /*jshint -W074 */
                ngModelCtrl.$formatters.unshift(function(modelValue){

                    var result = ngModelCtrl.$$runValidators(modelValue,
                                                             modelValue,
                                                             angular.noop);
                    
                    if (ngModelCtrl.$valid){
                        scope.aggregate(scope,
                                        scope.control.index,
                                        scope.control.indexInParent,
                                        true, -1);
                        ngModelCtrl.$setTouched();
                        ngModelCtrl.$setDirty();
                        setViewValue(scope.control.propSetMap.mask,modelValue,elem);
                        return modelValue;
                    }

                    if (scope.control.response !== null) {
                        scope.control.response = null;
                    }

                    scope.aggregate(scope,
                                    scope.control.index,
                                    scope.control.indexInParent,
                                    true, -1);

                    setViewValue(scope.control.propSetMap.mask,modelValue,elem);
                    return null;
                });

            }
        };
    });

}());

},{}],11:[function(require,module,exports){
/*
* This directive decides whether a file picker is multi or single
*
*/
(function(){
    'use strict';
    var dModule = angular.module('vlocity-oui-common');
    dModule.directive('vlcSldsFileSelect', function($compile){
        return{
            restrict: 'A',
            link: function(scope, element, attrs){
                if (attrs.vlcSldsFileSelect === 'true'){
                    element.attr('multiple', '');
                }
            }
        };
    });
}());

},{}],12:[function(require,module,exports){
/*
What this directive does: 
1. Looks for ui-mask on the template
2. if ui-mask is present then - 
   clears min and max length validators from the control
3. if there is no-mask set on the control -
   does nothing 
What does the priority of this directive mean
1. post link( link function) runs in the reverse order of priority . This 
means higher the priority lower down the chain it runs .
2. 999 makes sure that this directive runs at the very end
*/
(function(){
    'use strict';

    var dModule = angular.module('vlocity-oui-common');
    dModule.directive('vlcSldsMinMaxLen', function($parse, $compile){
        return {
            restrict: 'A',
            require:'ngModel',
            priority:999,
            link:function (scope, element, attrs, ngModelCtrl){
                if (attrs.uiMask && scope.control.propSetMap.mask){
                    delete ngModelCtrl.$validators.minlength;
                    delete ngModelCtrl.$validators.maxlength;
                }
            }
        }
    });
}());
 

},{}],13:[function(require,module,exports){
(function(){
    'use strict';
    /*the purpose of this directive is to
      1. Validate the values when the model is modified externally
      2. This directive is only applicable for multiSelect controls
     */
    var dModule = angular.module('vlocity-oui-common');
    
    dModule.directive('vlcSldsMuValChecker', function(){
        return {
            restrict: 'A',
            scope:false,
            require: ['^form', 'ngModel'],
            link: function(scope, elem, attrs, ctrls){                
                if(scope.bpTree.readOnly === true)
                    return;

                var ngModelCtrl = ctrls[1];
                var formCtrl = ctrls[0];

                /*jshint -W074 */
                ngModelCtrl.$formatters.unshift(function(modelValue){

                    var result = ngModelCtrl.$$runValidators(modelValue,
                                                             modelValue,
                                                             angular.noop);
                    if (ngModelCtrl.$valid){
                        if(scope.control.type === 'Multi-select') {
                            scope.onMultiSelect(scope, scope.control, scope.option, true);
                        }
                        else if(scope.control.type === 'Radio Group') {
                            scope.onRadioGroupSelect(scope, scope.control, scope.option, true);
                        }
                        ngModelCtrl.$setTouched();
                        ngModelCtrl.$setDirty();

                        //setting the form controller
                        if (formCtrl){
                            formCtrl.$setDirty();
                        }
                        return modelValue;
                    }

                    // required check
                    if (scope.control.req && scope.control.response !== null) {
                        scope.control.response = null;
                    }

                    scope.aggregate(scope,
                                    scope.control.index,
                                    scope.control.indexInParent,
                                    true, -1);

                    return null;
                });

            }
        };
    });

}());
},{}],14:[function(require,module,exports){
(function (){
    'use strict';
    
    var REG_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

    var dModule = angular.module('vlocity-oui-common');
    dModule.directive('vlcSldsNgPattern', function($timeout){
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, elm, attr, ctrl) {
                if (!ctrl) {return;}

                var regexp = attr.vlcSldsNgPattern;
                var regex;

                if(attr.type === 'email' && attr.vlcSldsNgPattern.length === 0) {
                    regex = REG_EMAIL;
                } else if(angular.isString(regexp) && regexp.length > 0) {
                    regex = /^\s*\/(.*)\/([gimuy]*)\s*$/.exec(regexp);
                    if(regex){
                        regex = new RegExp(regex[1],regex[2]);
                    }else {
                        regex = new RegExp('^' + regexp + '$');
                    }

                    if (regex && !regex.test) {
                        console.error('invalid regular expression ' + regex);
                    }
                }
                
                regexp = regex || undefined;

                //incase there is no pattern
                if (angular.isUndefined(regex)) {
                    return; 
                }

                //this validator matches the ngPattern validator
                ctrl.$validators.pattern = function(modelValue, viewValue) {
                    //this means this call is coming from the formatter
                    if (modelValue !== viewValue) {
                        viewValue = modelValue;
                    }

                    var val =  ctrl.$isEmpty(viewValue) || angular.isUndefined(regexp) || 
                        /*jshint -W033 */
                        (function(viewValue,ctrl){
                            if (regexp.test(viewValue)) {
                                return true;
                            }
                            return false ; //this is for the validator to function
                        }(viewValue, ctrl));
                    
                    return val;
                    
                };

            }
        };
    });
}());

},{}],15:[function(require,module,exports){
(function(){
    'use strict';
    /*the purpose of this directive is to
      1. Validate the values when the model is modified externally
      2. This directive is only applicable for number controls
     */
    var dModule = angular.module('vlocity-oui-common');
    function setViewValue(mask, value, elem){
        if (mask) {
            elem[0].value = value;
        }
    }

    dModule.directive('vlcSldsNumValChecker', function(){
        return {
            restrict: 'A',
            scope:false,
            require: 'ngModel',
            link: function(scope, elem, attrs, ngModelCtrl){                
                if(scope.bpTree.readOnly === true)
                    return;                

                /* runs all the validators outside of the ngModelCtrl context and does not update
                   the control */
                ngModelCtrl.runAllValidators = function(required, modelValue){
                    var result = true ;
                    if (!required) {
                        for (var key in this.$validators){
                            if (this.$validators.hasOwnProperty(key) && key !== 'required') {
                                result = result && this.$validators[key]('' + ngModelCtrl.$modelValue,
                                                                         '' + ngModelCtrl.$modelValue);
                            }
                        }
                    }

                    return result;
                
                };

                //element.ctrl = ngModelCtrl.$validators;

                //OMNI-2221 - viaMask already formats the input to view
                if (attrs.viaMask){
                    var valObjBackUp ;
                    ngModelCtrl.$formatters.unshift(function valCheckerFormatter(modelValue){

                        var editBlockParent = (scope.ouiBaseService.layout == 'lightning') ? '.vlc-slds-edit-block--child' : '.nds-edit-block_child';
                        // when modal launches for the Edit Block, disable formatter for the control in the base inline form
                        if((scope.control.noformatterebmodal === "true" || (scope.$parent && scope.$parent.control && scope.$parent.control.noformatterebmodal === "true"))
                            && $(elem).parents(editBlockParent).attr('noformattereb')  === "true")
                            return modelValue;
                        // via-mask already converts the same to the view value
                        //input made string for min and max length
                        //OMNI-2226 - runs all the validators on the controls but does not update the model state

                        //OMNI-2248 - when you have seed data and setup one after the other
                        // on the same element
                        if ((Object.keys(ngModelCtrl.$validators).length === 0)  && valObjBackUp && !scope.control.req){
                            ngModelCtrl.$validators = valObjBackUp;
                        }

                        if (!ngModelCtrl.runAllValidators(scope.control.req, modelValue)){
                            modelValue = null;
                        }else{
                            ngModelCtrl.$$runValidators('' + ngModelCtrl.$modelValue,
                                                        '' + ngModelCtrl.$modelValue,
                                                        angular.noop);
                        }


                        if (modelValue && ngModelCtrl.$valid){
                            ngModelCtrl.$setTouched();
                            ngModelCtrl.$setDirty();
                            scope.aggregate(scope,
                                            scope.control.index,
                                            scope.control.indexInParent,
                                            true, -1);

                            return modelValue;
                        }

                        if (scope.control.response !== null) {
                            scope.control.response = null; //was '' and will call the validators
                            //after and then this formatter and we want to suppress the validators to hide the visual cues
                            ngModelCtrl.$setPristine();
                            ngModelCtrl.$setUntouched();

                            var reqVal = (scope.control.req === undefined)?(scope.control.propSetMap.required):(scope.control.req);
                            if (!reqVal){
                                valObjBackUp = ngModelCtrl.$validators;
                                ngModelCtrl.$validators = {};

                                setTimeout(function(){
                                    ngModelCtrl.$validators = valObjBackUp;
                                });
                            }
                            
                        }

                        scope.aggregate(scope,
                                        scope.control.index,
                                        scope.control.indexInParent,
                                        true, -1);
                        
                        setViewValue(scope.control.propSetMap.mask,modelValue,elem);
                        return null;
                    });

                    scope.init(scope,scope.control);
                }
            }
        };
    });

}());

},{}],16:[function(require,module,exports){
(function() {
    'use strict';
    var dModule = angular.module('vlocity-oui-common');

    dModule.directive('vlcSldsOnlyNumeric', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                var decimalSeperator = '.';

                try {
                    // this works in FF, Chrome, IE, Safari and Opera
                    var sep = parseFloat(3 / 2)
                        .toLocaleString()
                        .substring(1, 2);
                    if (sep === '.' || sep === ',') {
                        decimalSeperator = sep;
                    }
                } catch (e) {}

                var decimalKeyCode = decimalSeperator === '.' ? '.' : ',';

                element.on('keypress', function(evt) {
                    var _ref = evt.key,
                        _ref1 = evt.key;

                    var isKeyAllowed =
                        _ref === 'ArrowLeft' ||
                        _ref === 'ArrowRight' ||
                        _ref === '.' ||
                        _ref === 'Backspace' ||
                        _ref === 'Tab' ||
                        _ref === 'End' ||
                        _ref === 'Home' ||
                        _ref === 'Delete';

                    // Conditionals to see if the key can be entered into the Number field
                    if (isKeyAllowed) {
                        // This is to prevent FF from having the cursor stuck at selection position 0
                        if (evt.key == 'ArrowRight' && this.selectionStart == 0) {
                            this.selectionStart = 0;
                            this.selectionEnd = 1;
                        }
                    } else if (
                        // Allows '0-9', '-', and decimalKeyCode
                        (_ref1 !== decimalKeyCode &&
                            _ref1 !== '1' &&
                            _ref1 !== '2' &&
                            _ref1 !== '3' &&
                            _ref1 !== '4' &&
                            _ref1 !== '5' &&
                            _ref1 !== '6' &&
                            _ref1 !== '7' &&
                            _ref1 !== '8' &&
                            _ref1 !== '9' &&
                            _ref1 !== '0' &&
                            _ref1 !== '-') ||
                        // don't allow multiple . or ,
                        ((_ref === decimalKeyCode || _ref1 === decimalKeyCode) &&
                            evt.target.value.indexOf(decimalSeperator) > -1) ||
                        // only allow one - at start
                        ((_ref === '-' || _ref1 === '-') &&
                            (evt.target.selectionStart !== 0 ||
                                evt.target.value.indexOf('-') > -1)) ||
                        // don't allow anything before a '-' if the cursor is at the start
                        (evt.target.selectionStart === 0 &&
                            evt.target.value.indexOf('-') > -1 &&
                            evt.target.selectionEnd === 0)
                    ) {
                        evt.preventDefault();
                    }
                });

                //parser to convert the model to numeric
                //OMNI-1986
                /*jshint -W068 */
                /* OMNI-2226 - via-mask already does this, removing code duplication */
            }
        };
    });
})();

},{}],17:[function(require,module,exports){
/*custom directive for popovers based on patterns used in, and leveraging sldsAngular,
which is in turn based on an older version of angular strap*/
(function(){
    'use strict';
    var bpModule = angular.module('vlocity-oui-common');

    bpModule.provider('$vlcSldsToolTip', function () {

        var defaults = this.defualts = {
            templateUrl: 'vlcSldsOmniToolTip.html',
            placement: 'auto bottom',
            nubbinDirection:'top-right',
            tooltip: "true",
            trigger: 'hover focus'
        };

        this.$get = function($sldsPopover){
            function VlcSldsToolTipFactory(element,config){
                var $vlcSldsToolTip = $sldsPopover(element, angular.extend({},defaults,config));
                var parentScope = config.scope;
                var options = $vlcSldsToolTip.$options;
                var scope = $vlcSldsToolTip.$scope;
                
                return $vlcSldsToolTip;
            }

            VlcSldsToolTipFactory.defaults = defaults;
            return VlcSldsToolTipFactory;

        };
    })

    .directive('vlcSldsToolTip',['$vlcSldsToolTip','$aria', function($vlcSldsToolTip,$aria){
        var defaults = $vlcSldsToolTip.defaults;
        return {
            restrict: 'A',
            scope: true,
            link: function postLink(scope, element, attr){
                // Directive options
                var options = {scope: scope};
                angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate',
                                 'placement', 'container', 'delay', 'trigger', 'html', 'nubbinDirection', 'tooltip', 'animation', 'id', 'prefixClass', 'prefixEvent'], function (key) {
                    if (angular.isDefined(attr[key])) options[key] = attr[key];
                });

                if ($aria.config('tabindex') && !element.attr('tabindex')) {
                    element.attr('tabindex', 0);
                }

                // use string regex match boolean attr falsy values, leave truthy values be
                var falseValueRegExp = /^(false|0|)$/i;
                angular.forEach(['html', 'container'], function (key) {
                    if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) {
                        options[key] = false;
                    }
                });

                // bind functions from the attrs to the show and hide events
                angular.forEach(['onBeforeShow', 'onShow', 'onBeforeHide', 'onHide'], function (key) {
                    var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
                    if (angular.isDefined(attr[bsKey])) {
                        options[key] = scope.$eval(attr[bsKey]);
                    }
                });

                // Initialize toolTip
                var toolTip = $vlcSldsToolTip(element, options);
                options = toolTip.$options;

                scope.nubbinDirection = options.nubbinDirection;

                // Garbage collection
                scope.$on('$destroy', function () {
                    if (toolTip) toolTip.destroy();
                    options = null;
                    toolTip = null;
                });

            }
        };
    }]);
}());


},{}],18:[function(require,module,exports){
(function(){
    'use strict';
    /*the purpose of this directive is to cancel the bubbling of scrolling events
      this could be extended for other events in the future by passing attributes*/
    var dModule = angular.module('vlocity-oui-common');
    dModule.directive('vlcSldsValCheckCurrency', function(){
        return {
            restrict: 'A',
            scope: false,
            require:'ngModel',
            link: function(scope, element, attrs,ngModelCtrl){
                if(scope.bpTree.readOnly === true)
                    return;
                
                var min = scope.control.propSetMap.min || null;
                ngModelCtrl.$validators.min = function(modelValue, viewValue) {
                    return (angular.isUndefined(min) || min === null) ||
                        ngModelCtrl.$isEmpty(ngModelCtrl.$$rawModelValue) || Number(ngModelCtrl.$$rawModelValue) >= min;
                };

                var max = scope.control.propSetMap.max || null;
                ngModelCtrl.$validators.max = function(modelValue, viewValue) {
                    return (angular.isUndefined(max) || max === null) ||
                        ngModelCtrl.$isEmpty(ngModelCtrl.$$rawModelValue) || Number(ngModelCtrl.$$rawModelValue) <= max;
                };
                
                /**
                 * [Parser for setting up null value if view Value is empty string]
                 * @param  {[number]} value) {  if(value [input view value]
                 * @return {[number]}        [it will return a number or null value]
                 */
                ngModelCtrl.$parsers.push(function(value) {
                    if(value === '') {
                        return null;
                    } else {
                        return value
                    }
                });
            }
        };
    });
}());

},{}],19:[function(require,module,exports){
(function(){
    'use strict';
    /*the purpose of this directive is to
      1. Validate the values when the model is modified externally
      2. This directive is only applicable for all controls except number and checkbox
    */
    var dModule = angular.module('vlocity-oui-common');
    function setViewValue(mask, value, elem){
        if (mask) {
            elem[0].value = value || '';
        }
    }

    var valChecker = function valChecker(inputObj, modelValue) {
        var elem = inputObj.elem,
            scope = inputObj.scope,
            ngModelCtrl = inputObj.ngModelCtrl,
            attrs = inputObj.attrs,
            formIndex = inputObj.formIndex;
        
        // OMNI-2964
        if(scope.bpTree.readOnly === true) {
            return modelValue;
        }
        
        // OMNI-2846
        if(scope.control.type === 'Disclosure' && scope.control.req === true && scope.control.response === false) {
            ngModelCtrl.$setValidity("required", false);
            return modelValue;
        }
        
        var editBlockParent = (scope.ouiBaseService.layout == 'lightning') ? '.vlc-slds-edit-block--child' : '.nds-edit-block_child';
        var ebCtrl = (scope.$parent && scope.$parent.control) ? scope.$parent.control : {};
        // when modal launches for the Edit Block, disable formatter for the control in the base inline form
        if((scope.control.noformatterebmodal === "true" || ebCtrl.noformatterebmodal === "true")
           && ($(elem).parents(editBlockParent).attr('noformattereb')  === "true") || (ebCtrl.hasOwnProperty('showInlineEBRow') && ngModelCtrl.hasOwnProperty('$$lastCommittedViewValue')))
            return modelValue;

        //OMNI-4122
        if(scope.$parent && scope.$parent.control && scope.$parent.control.propSetMap) {
            if(!scope.$parent.control.propSetMap.isNewInlineBlock && scope.control.noformatterebmodal === "true" && (modelValue === null || modelValue === undefined))
                return modelValue;            
        }

        //OMNI-2313
        if (modelValue && attrs['vlcSldsValChecker'] === 'telControl'){
            if (ngModelCtrl.$viewValue === ngModelCtrl.$modelValue &&
                modelValue === ngModelCtrl.$viewValue) {
                return modelValue;
            }
        }

        var result = ngModelCtrl.$$runValidators(modelValue,
                                                 modelValue,
                                                 angular.noop);

        //if the control has a mask then there is an additional formatter
        if (attrs.uiMask && scope.control.propSetMap.mask && modelValue){
            //if there is a mask the modelValue needs to be changed to a string- OMNI-1986
            modelValue = modelValue + '' ;
            
            //formatter 0 being the val checker formater
            var mValue = ngModelCtrl.$formatters[formIndex](modelValue);
            var maxLength =  scope.control.propSetMap.maxLength;
            var minLength =  scope.control.propSetMap.minLength;

            
            //OMNI-2118
            maxLength = maxLength === null ? 255 :maxLength ;
            minLength = minLength === null ? 0 : minLength ;
            
            
            //if the formatter function is not able to format the same it means its invaild mask
            if (!mValue) {
                modelValue = null;
            }

            if (mValue &&
                (mValue.length > maxLength ||
                 mValue.length < minLength) ) {
                modelValue = null;
            }

        }
        
        if (modelValue && ngModelCtrl.$valid){
            scope.aggregate(scope,
                            scope.control.index,
                            scope.control.indexInParent,
                            true, -1);
            ngModelCtrl.$setTouched();
            ngModelCtrl.$setDirty();
            setViewValue(scope.control.propSetMap.mask,modelValue,elem);
            return modelValue;
        }

        if (scope.control.response !== null) {
            if (/Disclosure/.test(scope.control.type)){
                scope.control.response = false;
            // adding exception for active Date/Time(local) to prevent formatter/parser loops between inputs overwriting both null with invalid input.
            }else if (!/Date\/Time \(Local\)/.test(scope.control.type)||document.activeElement.closest('*[name="loopform"]')!=elem[0].closest('*[name="loopform"]')){
                scope.control.response = null;
            }
        }

        scope.aggregate(scope,
                        scope.control.index,
                        scope.control.indexInParent,
                        true, -1);

        setViewValue(scope.control.propSetMap.mask,modelValue,elem);
        return null;
    }

    
    dModule.directive('vlcSldsValChecker', function(){
        return {
            restrict: 'A',
            scope:false,
            require: 'ngModel',
            priority:440,
            link: function(scope, elem, attrs, ngModelCtrl){

                var editBlockParent = (scope.ouiBaseService.layout == 'lightning') ? '.vlc-slds-edit-block--child' : '.nds-edit-block_child';
                var ebCtrl = (scope.$parent && scope.$parent.control) ? scope.$parent.control : {};
                // when modal launches for the Edit Block, disable formatter for the control in the base inline form
                if((scope.control.noformatterebmodal === "true" || ebCtrl.noformatterebmodal === "true")
                   && ($(elem).parents(editBlockParent).attr('noformattereb')  === "true") || (ebCtrl.hasOwnProperty('showInlineEBRow') && ngModelCtrl.hasOwnProperty('$$lastCommittedViewValue')))
                    return null;

                if (scope.control.type === 'Type Ahead' && scope.control.propSetMap.enableLookup){
                    ngModelCtrl.$formatters.push(valChecker.bind(null, {
                        elem:elem,
                        ngModelCtrl:ngModelCtrl,
                        formIndex:0,
                        scope:scope,
                        attrs:attrs
                    }));
                    return null;
                }

                if (scope.control.propSetMap.mask && ('uiMask' in attrs)){
                    /*
                      Without this the mask will not be proceesed when the the control is prefilled using
                      seed data
                      this line ngModelCtrl.$formatters[formIndex](modelValue), will return the input value as is
                      - fixed after looking into the ui Mask source code
                    */
                    ngModelCtrl.$$attr &&
                        ngModelCtrl.$$attr.$$observers &&
                        ngModelCtrl.$$attr.$$observers.uiMask &&
                        ngModelCtrl.$$attr.$$observers.uiMask[0] &&
                        ngModelCtrl.$$attr.$$observers.uiMask[0](attrs.uiMask);
                }

                /*jshint -W074*/
                if (scope.control.propSetMap.mask && ('uiMask' in attrs) && scope.control.propSetMap.pattern){
                    ngModelCtrl.$formatters.push(valChecker.bind(null, {
                        elem:elem,
                        ngModelCtrl:ngModelCtrl,
                        formIndex:0,
                        scope:scope,
                        attrs:attrs
                    }));
                } else {
                    ngModelCtrl.$formatters.unshift(valChecker.bind(null, {
                        elem:elem,
                        ngModelCtrl:ngModelCtrl,
                        formIndex:1,
                        scope:scope,
                        attrs:attrs
                    }));
                }

                if ('uiMask' in attrs){
                    scope.init(scope, scope.control);
                }

            }
        };
    });

}());

},{}],20:[function(require,module,exports){
angular.module('vlocity-oui-common')
    .factory('ouiBaseService', function($q, $rootScope) {
        
        var factory = {};

        // VF remote asyn promise         
        factory.GenericInvoke = function(sClassName, sMethodName, input, options, iTimeout)
        {
            var deferred = $q.defer();
            VOUINS.GenericInvoke(sClassName, sMethodName, input, options, iTimeout, function(result, event)
            {
                $rootScope.$apply(function()
                {
                    if(event.status)
                        deferred.resolve(result);
                    else
                        deferred.reject(event);
                });
            });
            return deferred.promise;
        };
        
        // Omni Remote Call        
        factory.OmniRemoteInvokeAux = function(configObj, src)
        {     
            var called = false;
            if(window.customVOmniRemoteInvoke && window.customVOmniRemoteInvoke.constructor === Function) {
                called = true;
                return window.customVOmniRemoteInvoke(configObj, src);
            }    
                
            if(window.OmniOut && window.OmniForce && window.OmniForce.isAuthenticated()&&!(configObj.sClassName === 'Vlocity BuildJSONWithPrefill' && window.forceLocalDef)) {
                called = true;
                var restPath = '';
                if (this.apexRestPathMap.hasOwnProperty(configObj.sClassName)) {
                    restPath = this.apexRestPathMap[configObj.sClassName];
                }
                else if (configObj.sMethodName) {
                    restPath = configObj.sClassName + '/' + configObj.sMethodName + '/';
                }
                return window.OmniForce.apexrest({
                        path:'/' + this.sNS + '/v1/GenericInvoke/' + restPath,
                        params:configObj.params,
                        data:configObj,
                        method:'POST'}
                );                  
            }
            
            return called;
        };
        
        factory.OmniRemoteInvoke = function(configObj) {
            var prom = this.OmniRemoteInvokeAux(configObj, this);            
            
            if(prom === false) {
                return this.GenericInvoke(configObj.sClassName, configObj.sMethodName, configObj.input, configObj.options, configObj.iTimeout, configObj.label);                
            }
            else
                return prom;
        };
        
        factory.miniForm = false;
        
        factory.previewMode = sfdcVars.previewMode;
        factory.dataPreprocessorMap = {};
        factory.pfJSON = {};
        factory.scriptState = sfdcVars.scriptState;
        
        // shared variables
        // most of them come from component controller
        factory.sNS = sfdcVars.sNS;
        factory.sNSC = (factory.sNS)?(factory.sNS+'.'):factory.sNS;
            
        factory.layout = sfdcVars.layout;     
        // Root Element Types
        factory.rootEleTypes = ['Step', 'Remote Action', 'Rest Action', 'DataRaptor Extract Action', 'DataRaptor Post Action', 'Post to Object Action', 'Review Action', 'Done Action', 'Calculation Action', 'PDF Action', 'Set Values', 'Set Errors', 'DocuSign Envelope Action', 'Email Action', 'DataRaptor Transform Action', 'Matrix Action', 'Integration Procedure Action', 'Delete Action'];
        // Action Element Types
        factory.actionEleTypes = VOUINS.actionEleTypes;
        // Remote Invoke Element Types
        // Support both pre and post transform
        factory.remoteInvokePrePostEleTypes = ['Remote Action', 'Rest Action', 'Calculation Action', 'Integration Procedure Action'];
        // Support only post transform
        factory.remoteInvokePostEleTypes = ['DataRaptor Post Action', 'Post to Object Action', 'Matrix Action'];   
        // Support only pre transform
        factory.remoteInvokePreEleTypes = ['PDF Action'];                  
        // Element Types excluded from data json generation
        factory.noneDataControlTypeListV2 = sfdcVars.noneDataControlTypeListV2;
        if(factory.noneDataControlTypeListV2 === 'default')
            factory.noneDataControlTypeListV2 = ['Button','Submit','Headline','Text Block','Remote Action','Rest Action','DataRaptor Extract Action','DataRaptor Post Action','Post to Object Action','Review Action','Done Action','Calculation Action','PDF Action','Set Values', 'Set Errors', 'DocuSign Envelope Action', 'DocuSign Signature Action', 'Line Break', 'Email Action', 'DataRaptor Transform Action', 'Matrix Action', 'Integration Procedure Action', 'Delete Action'];
        // None Leaf Element Types
        factory.applyRespSkipTypeList = ['Block','Edit Block','Step','Type Ahead Block','File','Button','Headline','Text Block','Remote Action','Rest Action','DataRaptor Extract Action','DataRaptor Post Action','Post to Object Action','Review Action','Done Action','Filter Block','Calculation Action','PDF Action','Image','Geolocation','Formula','Aggregate','Validation','Set Values','Set Errors', 'DocuSign Envelope Action', 'DocuSign Signature Action', 'Line Break', 'Email Action', 'DataRaptor Transform Action', 'Matrix Action', 'Integration Procedure Action', 'Delete Action'];
        // Group Element Types
        factory.groupEleTypeList = ['Step','Block','Edit Block','Filter Block', 'Type Ahead Block'];
        // Element Types which support readOnly/required property
        factory.readOnlyReqEleTypeList = ['Checkbox','Currency','Date','Date/Time (Local)','Disclosure','Email','Lookup','Multi-select',
                                          'Number','Password','Radio','Radio Group','Range','Select','Signature','Telephone','Text','Text Area',
                                          'Time','URL','Type Ahead'];
        // repeatable elements
        factory.repeatEleTypeList = ['Block','Edit Block','Checkbox','Currency','Date','Date/Time (Local)','Email','Lookup','Multi-select',
                                     'Number','Password','Radio','Range','Select','Signature','Telephone',
                                     'Text','Text Area','Time','URL'];      
                                                             
        // Select Types
        factory.selectTypeList = ['Select', 'Multi-select'];        
        
        // Selectable Items, Input Block
        factory.placeholderEleTypeList = ['Selectable Items','Input Block'];
        
        // v16 Block type
        factory.blockEleTypeList = ['Block', 'Edit Block'];
        
        // OOTB Element Type to HTML markup map
        // OmniScript and miniform common types        
        factory.elementTypeToHTMLMap = { 'Checkbox': 'vlcCheckbox.html',
                                         'Currency': 'vlcCurrency.html', 'Date': 'vlcDate.html',
                                         'Date/Time (Local)': 'vlcDatetime-local.html', 'Disclosure': 'vlcDisclosure.html',
                                         'Email': 'vlcEmail.html', 'File': 'vlcFile.html', 
                                         'Image': 'vlcImage.html',
                                         'Headline': 'vlcHeadline.html', 'Lookup': 'vlcLookup.html',
                                         'Multi-select': 'vlcMulti-select.html',                                                                                   
                                         'Number': 'vlcNumber.html', 'Password': 'vlcPassword.html',
                                         'Radio': 'vlcRadio.html',
                                         'Range': 'vlcRange.html','Step': 'vlcStep.html', 'Select': 'vlcSelect.html',
                                         'Signature': 'vlcSignature.html', 'Telephone': 'vlcTel.html',
                                         'Text': 'vlcText.html', 'Text Area': 'vlcTextarea.html', 'Text Block': 'vlcTextblock.html',
                                         'Time': 'vlcTime.html', 'URL': 'vlcURL.html',
                                         'Selectable Items': 'vlcSelectableItems.html',
                                         'Line Break':'vlcLineBreak.html',
                                         'Error Sub Block': 'vlcErrorSubBlock.html',
                                         'Selectable Item': 'vlcEmpty.html'
                                      }; 
        
        factory.apexRestPathMap = {
            'Vlocity SaveBP' : 'ApplicationService/SaveBPInstance',
            'Vlocity BuildJSONV3' : 'ApplicationService/BuildJSONV3',
            'Vlocity CompleteScript' : 'ApplicationService/CompleteScript',
            'Vlocity CreateOSAttachment' : 'BusinessProcessDisplayController/CreateOSAttachment',
            'Vlocity DeleteOSAttachment' : 'BusinessProcessDisplayController/DeleteOSAttachment',
            'Vlocity VlocityTrack' : 'VlocityTrackingService/trackListObject',
            'Vlocity BuildJSONWithPrefill' : 'BusinessProcessDisplayController/BuildJSONWithPrefillV2',
            'Vlocity GetUserInfo' : 'BusinessProcessDisplayController/GetUserInfo',
            'Vlocity GetCustomLabels' : 'DRDataPackRunnerController/getCustomLabels',
            'Vlocity CreateOSContentVersion' : 'BusinessProcessUtility/CreateOSContentVersion'
        }
        // in ChatBot miniform, the VF component attribute will overwrite the default Type-HTML Map
        factory.elementTypeToHTMLMapOW = angular.copy(factory.elementTypeToHTMLMap);        
        (_.mergeWith||_.merge)(factory.elementTypeToHTMLMapOW, sfdcVars.eleTypeToHTMLTemplateMap, VOUINS.mergeJSONLogic);
        
        function checkRoot(scp, miniForm) {
            if(miniForm) {
                return (scp.child && scp.$parent
                        && scp.$parent.children);
            }
            return (scp.$parent.$parent && 
                    scp.$parent.$parent.$parent && scp.$parent.$parent.$parent.child
                    && scp.$parent.$parent.$parent.children);
        };
        
        // Aggregate
        // recursive function to handle data json generation
        // whenver the user changes any input Element in the script, this function will be called to update the nested data json
        // this is also called when the remote call response is applied to the script, when the user repeat an Element
        // @param
        // scp - element scope
        // arrayIndex - for repeated Element, array index
        // indexInParent - for Elements under the same parent, index
        // bUIUpdate - whether the change is triggered from UI update or not
        // addOrRemoveIndex - for repeated Elements, add or remove index
        factory.aggregate = function(scp, arrayIndex, indexInParent, bUIUpdate, addOrRemoveIndex, notFirstTime)
        {
            var key;
            var newArrayIndex = arrayIndex;
            var eleType;
            if(scp)
            {
                // refresh knowledge PC
                if(scp.bpTree.propSetMap && scp.bpTree.propSetMap.enableKnowledge === true && scp.bpTree.asIndex !== null && notFirstTime !== true)
                    scp.searchKnowledgeArticle(scp.bpTree.children[scp.bpTree.asIndex]);
            
                var ctrlLevel = -10;
                if(scp.control)
                {
                    ctrlLevel = scp.control.level;
                }
                var level = -10;
                if(scp.children && scp.children.length > 0)
                    level = scp.children[0].level;

                // need to aggregate
                if(level === ctrlLevel+1 && scp.control)
                {
                    if(scp.control.type === 'Filter Block')
                        this.handleFilterBlock(scp.control);
                    else
                    {
                        // very first time
                        if(VOUINS.isEmpty(scp.control.response))
                        {
                            scp.control.response = {};
                            for(var j=0; j<scp.children.length; j++)
                            {
                                if(this.noneDataControlTypeListV2.indexOf(scp.children[j].eleArray[0].type) === -1)
                                {
                                    if(this.placeholderEleTypeList.indexOf(scp.children[j].eleArray[0].type) < 0 
                                       || (this.placeholderEleTypeList.indexOf(scp.children[j].eleArray[0].type) >= 0 && scp.children[j].eleArray[0].propSetMap.dataJSON === true))
                                    {
                                        key = scp.children[j].eleArray[0].name;
                                        scp.control.response[key] = scp.children[j].response;
                                    }
                                }
                            }
                        }
                        else
                        {
                            // only need to process the child node being affected
                            if(this.noneDataControlTypeListV2.indexOf(scp.children[indexInParent].eleArray[0].type) === -1)
                            {
                                if(this.placeholderEleTypeList.indexOf(scp.children[indexInParent].eleArray[0].type) < 0
                                   || (this.placeholderEleTypeList.indexOf(scp.children[indexInParent].eleArray[0].type) >= 0 && scp.children[indexInParent].eleArray[0].propSetMap.dataJSON === true))
                                {
                                    key = scp.children[indexInParent].eleArray[0].name;
                                    scp.control.response[key] = scp.children[indexInParent].response;
                                }
                            }
                        }
                    }
                    newArrayIndex = scp.control.index;
                }
                // process the control first
                // take care of repeated controls
                if(scp.$parent)
                {                
                    if(scp.$parent.child && scp.$parent.child.eleArray)
                    {
                        if(scp.$parent.child.eleArray.length > 0)
                        {
                             // control is not repeated
                             if(scp.$parent.child.eleArray.length == 1)
                             {
                                 if(VOUINS.isEmpty(scp.$parent.child.response) && !bUIUpdate)
                                     return;
                                 eleType = scp.$parent.child.eleArray[0].type;
                                 if(this.selectTypeList.indexOf(eleType) >= 0)
                                     scp.$parent.child.response = this.handleSelect(eleType, scp.$parent.child.eleArray[0].response);
                                 else if(eleType === 'Date' || eleType === 'Date/Time (Local)'
                                         || eleType === 'Time')
                                 {
                                     var tempResp = scp.$parent.child.eleArray[0].response;
                                     if(tempResp !== undefined && tempResp !== null && tempResp.constructor === Date)
                                         tempResp = tempResp.toISOString();
                                     scp.$parent.child.response = tempResp;
                                 }
                                 else
                                     scp.$parent.child.response = scp.$parent.child.eleArray[0].response;
                             }
                             // control is repeated
                             else
                             {
                                 // from add/remove repeatable controls
                                 if(!bUIUpdate)
                                 {
                                     if(VOUINS.isEmpty(scp.$parent.child.response))
                                         return;

                                     // test if response is an array or not
                                     if(angular.isArray(scp.$parent.child.response))
                                     {
                                         // add
                                         if(scp.$parent.child.response.length < scp.$parent.child.eleArray.length)
                                         {     
                                             if(addOrRemoveIndex !== null) {                                            
                                                 var newItemResp = scp.$parent.child.eleArray[addOrRemoveIndex+1].response;
                                                 eleType = scp.$parent.child.eleArray[addOrRemoveIndex+1].type;
                                                 if(this.selectTypeList.indexOf(eleType) >= 0)
                                                     newItemResp = this.handleSelect(eleType, newItemResp);
                                                 scp.$parent.child.response.splice(addOrRemoveIndex+1, 0, newItemResp);
                                              }
                                         }
                                         // remove
                                         else if(scp.$parent.child.response.length > scp.$parent.child.eleArray.length)
                                         {
                                             if(addOrRemoveIndex !== null) { 
                                                 scp.$parent.child.response.splice(addOrRemoveIndex, 1);
                                                 // change it to Map
                                                 if(scp.$parent.child.response.length === 1)
                                                 {
                                                     scp.$parent.child.response = scp.$parent.child.response[0];
                                                 }
                                              }
                                         }
                                     }
                                     else
                                     {
                                         // there is only one single control
                                         var resp = scp.$parent.child.response;
                                         // add
                                         if(scp.$parent.child.eleArray.length > 1)
                                         {
                                             scp.$parent.child.response = [];
                                             var newItemResp = scp.$parent.child.eleArray[1].response;
                                             eleType = scp.$parent.child.eleArray[1].type;
                                             if(this.selectTypeList.indexOf(eleType) >= 0)
                                                 newItemResp = this.handleSelect(eleType, newItemResp);
                                             scp.$parent.child.response.splice(0, 0, resp, newItemResp);
                                         }
                                     }
                                 }
                                 else
                                 {
                                     if(VOUINS.isEmpty(scp.$parent.child.response))
                                     {
                                         scp.$parent.child.response = [];
                                         for(var i=0; i<scp.$parent.child.eleArray.length; i++)
                                         {
                                             eleType = scp.$parent.child.eleArray[i].type;
                                             if(this.selectTypeList.indexOf(eleType) >= 0)
                                                 scp.$parent.child.response.push(this.handleSelect(eleType, scp.$parent.child.eleArray[i].response));
                                             else if(eleType === 'Date' || eleType === 'Time'
                                                     || eleType === 'Date/Time (Local)')
                                             {
                                                 var tempResp = scp.$parent.child.eleArray[i].response;
                                                 if(tempResp !== undefined && tempResp !== null && tempResp.constructor === Date)
                                                     tempResp = tempResp.toISOString();
                                                 scp.$parent.child.response.push(tempResp);
                                             }
                                             else
                                                 scp.$parent.child.response.push(scp.$parent.child.eleArray[i].response);
                                         }
                                     }
                                     else if(scp.$parent.child.eleArray[arrayIndex] && scp.$parent.child.eleArray[arrayIndex].type) // only update that element
                                     {
                                         eleType = scp.$parent.child.eleArray[arrayIndex].type;
                                         if(!angular.isArray(scp.$parent.child.response))
                                             scp.$parent.child.response = [scp.$parent.child.response];
                                         
                                         if(this.selectTypeList.indexOf(eleType) >= 0)
                                             scp.$parent.child.response[arrayIndex] = this.handleSelect(eleType, scp.$parent.child.eleArray[arrayIndex].response);
                                         else if(eleType === 'Date' || eleType === 'Time' || eleType === 'Date/Time (Local)')
                                         {
                                             var tempResp = scp.$parent.child.eleArray[arrayIndex].response;
                                             if(tempResp !== undefined && tempResp !== null && tempResp.constructor === Date)
                                                 tempResp = tempResp.toISOString();
                                             scp.$parent.child.response[arrayIndex] = tempResp;
                                         }
                                         else
                                             scp.$parent.child.response[arrayIndex] = scp.$parent.child.eleArray[arrayIndex].response;
                                     }
                                 }
                             }
                        }
                        this.aggregate(scp.$parent.$parent, newArrayIndex, scp.$parent.child.indexInParent, bUIUpdate, null, true);
                    }
                    else if(checkRoot(scp, this.miniForm))                              
                    // hit Step or root
                    {
                        var root, children;
                        if(this.miniForm) {
                            children = scp.$parent.$parent.children;
                            root = scp.$parent.child; 
                            if(!children) {
                                children = scp.$parent.children;
                                root = scp.child;
                            }
                        }
                        else {
                            root = (this.layout !== 'lightning' && this.layout !== 'newport')?(scp.$parent.$parent.$parent.child):(scp.$parent.child); 
                            children = scp.$parent.$parent.$parent.children;                               
                        }
                 
                        if(scp.children.length > 0)
                        {
                            // very first time
                            if(VOUINS.isEmpty(root.response))
                            {
                                root.response = {};

                                for(var k=0; k<scp.children.length; k++)
                                {
                                    if(this.noneDataControlTypeListV2.indexOf(scp.children[k].eleArray[0].type) === -1)
                                    {
                                        if(this.placeholderEleTypeList.indexOf(scp.children[k].eleArray[0].type) < 0 
                                           || (this.placeholderEleTypeList.indexOf(scp.children[k].eleArray[0].type) >= 0 && scp.children[k].eleArray[0].propSetMap.dataJSON === true))
                                        {
                                            key = scp.children[k].eleArray[0].name;
                                            root.response[key] = scp.children[k].response;
                                            if(scp.children[k].bHasAttachment)
                                            {
                                                if(scp.children[k].response && scp.children[k].response.length > 0)
                                                    root.bHasAttachment = true;
                                                //else
                                                    //scp.$parent.child.bHasAttachment = false;
                                            }
                                        }
                                    }
                                    if(scp.children[k].eleArray[0].type === 'Filter Block')
                                        scp.children[k].eleArray[0].vlcJSONPath = root.name+':'+scp.children[k].eleArray[0].name;
                                }
                            }
                            else
                            {
                                // only update the affected node
                                if(this.noneDataControlTypeListV2.indexOf(scp.children[indexInParent].eleArray[0].type) === -1)
                                {
                                    if(this.placeholderEleTypeList.indexOf(scp.children[indexInParent].eleArray[0].type) < 0
                                       || (this.placeholderEleTypeList.indexOf(scp.children[indexInParent].eleArray[0].type) >= 0 && scp.children[indexInParent].eleArray[0].propSetMap.dataJSON === true))
                                    {
                                        key = scp.children[indexInParent].eleArray[0].name;
                                        root.response[key] =  scp.children[indexInParent].response;
                                        if(scp.children[indexInParent].bHasAttachment)
                                        {
                                            if(scp.children[indexInParent].response && scp.children[indexInParent].response.length > 0)
                                                root.bHasAttachment = true;
                                            //else
                                                //scp.$parent.child.bHasAttachment = false;
                                        }
                                    }
                                }
                            }
                        }


                        // very first time
                        if(VOUINS.isEmpty(scp.bpTree.response))
                        {
                            scp.bpTree.response = {};

                            for(var m=0; m<children.length; m++)
                            {
                                if(this.noneDataControlTypeListV2.indexOf(children[m].type) === -1)
                                {
                                    key = children[m].name;
                                    scp.bpTree.response[key] = children[m].response;
                                    if(children[m].bHasAttachment)
                                        scp.bpTree.bHasAttachment = true;
                                    //else
                                        //scp.bpTree.bHasAttachment = false;
                                }
                            }
                        }
                        else
                        {
                            // only update the affected node
                            key = root.name; 
                            if(!key)
                                return;

                            //scp.bpTree.response[key] = children[scp.$parent.child.indexInParent].response;
                            //scp.bpTree.response[key] = $.extend(true, {}, scp.bpTree.response[key], children[scp.$parent.child.indexInParent].response);
                            var tempNode = {};
                            tempNode[key] = children[root.indexInParent].response;
                            //var tempDataJSON = angular.copy(scp.bpTree.response);
                            (_.mergeWith||_.merge)(scp.bpTree.response, tempNode, VOUINS.mergeJSONLogic);
                            //(_.mergeWith||_.merge)(tempDataJSON, tempNode, VOUINS.mergeJSONLogic);
                            //scp.bpTree.response = tempDataJSON;
                            if(children[root.indexInParent].bHasAttachment)
                                scp.bpTree.bHasAttachment = true;
                            //else
                                //scp.bpTree.bHasAttachment = false;
                        }
                    }
                }
            }
            if ($rootScope.tabKey || this.previewMode) {
                scp.$evalAsync(function() {
                    scp.bpTree.responseAsText = JSON.stringify(scp.bpTree.response, null, 4);
                });
            }
        };
        
        // Filter Block - Filters under it are tied to Attribute Category and Attributes
        // requires special handling
        // @param
        // element - Element
        factory.handleFilterBlock = function(element)
        {
            var filters = [];
            for(var i=0; i<element.children.length; i++)
            {
                var filter = element.children[i].eleArray[0].response;
                if(filter)
                {
                    var filterEle = {};
                    var attributes = [];

                    if(angular.isArray(filter))
                    {
                        for (var j=0; j<filter.length; j++)
                        {
                            if(filter[j] && filter[j].selected === true)
                                attributes.push(filter[j].name);
                        }
                    }
                    else
                        attributes.push(filter.name);


                    if(attributes.length > 0)
                    {
                        filterEle.category = element.children[i].eleArray[0].propSetMap.attributeCategoryCode;
                        filterEle.attributes = attributes;
                        filters.push(filterEle);
                    }
                }
            }
            if(filters.length > 0)
                element.response = filters;
            else
                element.response = null;
        };

        // 3.0: handle Select and Radio as well, for Data JSON, we now only want the LIC portion for
        // Select and Radio and Multi-select
        // Multi-select and Filter Multi-select
        // requires special handling to match SFDC convention
        // aaa;bbb;ccc
        // @param
        // response - ui response
        factory.handleSelect = function(eleType, response, display)
        {
            if(eleType === 'Select')
            {
                if(response && response.constructor === Object)
                    return display?response.value:response.name;
                else
                    return null;
            }
            if((eleType === 'Multi-select' || eleType === 'Filter Multi-select') && angular.isArray(response))
            {
                var name = '';
                var value = '';
                var reformattedResp = {};
                for(var ind=0; ind<response.length; ind++)
                {
                    if(response[ind].selected)
                    {
                        if(name !== '')
                            name += ';';
                        name += response[ind].name;
                        if(value != '')
                            value += ';';
                        value += response[ind].value;
                    }
                }
                reformattedResp.name = name;
                reformattedResp.value = value;
                if(name === '')
                    name = null;
                return display?value:name;
            }
            else 
                return null;
        };
        
        // VF remote asyn promise
        factory.UpdateOSAttachment = function(bodyData, attachmentId, options, callback)
        {
            var deferred = $q.defer();
            VOUINS.UpdateOSAttachment(bodyData, attachmentId, options, function(result, event)
            {
                $rootScope.$apply(function()
                {
                    if(event.status)
                        deferred.resolve(result);
                    else
                        deferred.reject(null);
                });
            });
            return deferred.promise;
        };   

        // VF remote asyn promise
        factory.CreateOSContentVersion = function(configObj)
        {
            var prom = this.OmniRemoteInvokeAux(configObj, this);            
            
            if(prom === false) {
                var deferred = $q.defer();
        
                VOUINS.CreateOSContentVersion(configObj.bodyData, configObj.filename, configObj.parentId, configObj.options, function(result, event)
                {
                    if(event.status)
                        deferred.resolve(result);
                    else if (result) {
                        deferred.reject(result);
                    } else {
                        deferred.reject({ error: event.message });
                    }
                });

                return deferred.promise;               
            }
            else
                return prom;
        };            

        return factory;
    });
},{}],21:[function(require,module,exports){
(function(){
    'use strict';
    var bpModule = angular.module('vlocity-oui-common');
    bpModule.factory('currencySymbol', function(){
        return {
            "ALL": {
                "text": "Lek",
                "uniDec": "76, 101, 107",
                "uniHex": "4c, 65, 6b",
                "decimal": ",",
                "group": ".",
                "format": "!##,###.00"
            },
            "AFN": {
                "text": "؋",
                "uniDec": "1547",
                "uniHex": "60b",
                "decimal": "٫",
                "group": "٬",
                "format": "##,###.00!"
            },
            "ARS": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "decimal": ",",
                "group": ".",
                "format": "!##,###.00"
            },
            "AWG": {
                "text": "ƒ",
                "uniDec": "402",
                "uniHex": "192",
                "decimal": ",",
                "group": ".",
                "format": "! ##,###.00"
            },
            "AUD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!##,###.00"
            },
            "AZN": {
                "text": "ман",
                "uniDec": "1084, 1072, 1085",
                "uniHex": "43c, 430, 43d",
                "decimal": ",",
                "group": ".",
                "format": "! ##,###.00"
            },
            "BSD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!#,###.00"
            },
            "BBD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!#,###.00"
            },
            "BYR": {
                "text": "p.",
                "uniDec": "112, 46",
                "uniHex": "70, 2e",
                "decimal": ",",
                "group": " ",
                "format": "!#,###.00"
            },
            "BZD": {
                "text": "BZ$",
                "uniDec": "66, 90, 36",
                "uniHex": "42, 5a, 24",
                "format": "!#,###.00"
            },
            "BMD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!#,###.00"
            },
            "BOB": {
                "text": "$b",
                "uniDec": "36, 98",
                "uniHex": "24, 62",
                "decimal": ",",
                "group": ".",
                "format": "!##,###.00"
            },
            "BAM": {
                "text": "KM",
                "uniDec": "75, 77",
                "uniHex": "4b, 4d",
                "decimal": ",",
                "group": ".",
                "format": "##,###.00 !"
            },
            "BWP": {
                "text": "P",
                "uniDec": "80",
                "uniHex": "50",
                "format": "!#,###.00"
            },
            "BGN": {
                "text": "лв",
                "uniDec": "1083, 1074",
                "uniHex": "43b, 432",
                "decimal": ",",
                "group": " ",
                "format": "##,###.00 !"
            },
            "BRL": {
                "text": "R$",
                "uniDec": "82, 36",
                "uniHex": "52, 24",
                "decimal": ",",
                "group": ".",
                "format": "! ##,###.00"
            },
            "BND": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "decimal": ",",
                "group": ".",
                "format": "!##,###.00"
            },
            "KHR": {
                "text": "៛",
                "uniDec": "6107",
                "uniHex": "17db",
                "decimal": ",",
                "group": ".",
                "format": "!##,###.00"
            },
            "CAD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!#,###.00"
            },
            "KYD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!#,###.00"
            },
            "CLP": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "decimal": ",",
                "group": ".",
                "format": "!##,###.00"
            },
            "CNY": {
                "text": "¥",
                "uniDec": "165",
                "uniHex": "a5",
                "format": "! #,###.00"
            },
            "COP": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "decimal": ",",
                "group": ".",
                "format": "!##,###.00"
            },
            "CRC": {
                "text": "₡",
                "uniDec": "8353",
                "uniHex": "20a1",
                "format": "!##,###.00"
            },
            "HRK": {
                "text": "kn",
                "uniDec": "107, 110",
                "uniHex": "6b, 6e",
                "decimal": ",",
                "group": ".",
                "format": "! ##,###.00"
            },
            "CUP": {
                "text": "₱",
                "uniDec": "8369",
                "uniHex": "20b1",
                "decimal": ",",
                "group": ".",
                "format": "!##,###.00"
            },
            "CZK": {
                "text": "Kč",
                "uniDec": "75, 269",
                "uniHex": "4b, 10d",
                "decimal": ",",
                "group": " ",
                "format": "##,###.00 !"
            },
            "DKK": {
                "text": "kr",
                "uniDec": "107, 114",
                "uniHex": "6b, 72",
                "decimal": ",",
                "group": ".",
                "format": "! ##,###.00"
            },
            "DOP": {
                "text": "RD$",
                "uniDec": "82, 68, 36",
                "uniHex": "52, 44, 24",
                "format": "!##,###.00"
            },
            "XCD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!#,###.00"
            },
            "EGP": {
                "text": "£",
                "uniDec": "163",
                "uniHex": "a3",
                "decimal": "٫",
                "group": "٬",
                "format": "##,###.00 !"
            },
            "SVC": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!#,###.00"
            },
            "EUR": {
                "text": "€",
                "uniDec": "8364",
                "uniHex": "20ac",
                "decimal": ",",
                "group": " ",
                "format": "##,###.00 !"
            },
            "FKP": {
                "text": "£",
                "uniDec": "163",
                "uniHex": "a3",
                "format": "!##,###.00"
            },
            "FJD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!##,###.00"
            },
            "GHS": {
                "text": "¢",
                "uniDec": "162",
                "uniHex": "a2",
                "format": "!#,###.00"
            },
            "GIP": {
                "text": "£",
                "uniDec": "163",
                "uniHex": "a3",
                "format": "!#,###.00"
            },
            "GTQ": {
                "text": "Q",
                "uniDec": "81",
                "uniHex": "51",
                "format": "!#,###.00"
            },
            "GYD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!##,###.00"
            },
            "HNL": {
                "text": "L",
                "uniDec": "76",
                "uniHex": "4c",
                "format": "!#,###.00"
            },
            "HKD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!#,###.00"
            },
            "HUF": {
                "text": "Ft",
                "uniDec": "70, 116",
                "uniHex": "46, 74",
                "decimal": ",",
                "group": " ",
                "format": "##,###.00 !"
            },
            "ISK": {
                "text": "kr",
                "uniDec": "107, 114",
                "uniHex": "6b, 72",
                "decimal": ",",
                "group": ".",
                "format": "##,###.00 !"
            },
            "INR": {
                "text": "₹",
                "uniDec": "8377",
                "uniHex": "20B9",
                "decimal": ".",
                "group": ",",
                "format": "!##,###.00"
            },
            "IDR": {
                "text": "Rp",
                "uniDec": "82, 112",
                "uniHex": "52, 70",
                "decimal": ",",
                "group": ".",
                "format": "!##,###.00"
            },
            "IRR": {
                "text": "ریال",
                "uniDec": "65020",
                "uniHex": "fdfc",
                "decimal": "٫",
                "group": "٬",
                "format": "##,###.00!"
            },
            "ILS": {
                "text": "₪",
                "uniDec": "8362",
                "uniHex": "20aa",
                "decimal": ",",
                "group": ".",
                "format": "##,###.00 !"
            },
            "IQD": {
                "text": "د.ع.‏",
                "uniDec": "",
                "uniHex": "",
                "decimal": "٫",
                "group": "٬",
                "format": "##,###.00 !"
            },
            "JMD": {
                "text": "J$",
                "uniDec": "74, 36",
                "uniHex": "4a, 24",
                "format": "!#,###.00"
            },
            "JPY": {
                "text": "¥",
                "uniDec": "165",
                "uniHex": "a5",
                "format": "!#,###.00"
            },
            "KZT": {
                "text": "лв",
                "uniDec": "1083, 1074",
                "uniHex": "43b, 432",
                "decimal": ",",
                "group": " ",
                "format": "##,###.00!"
            },
            "KPW": {
                "text": "₩",
                "uniDec": "8361",
                "uniHex": "20a9",
                "format": "!##,###.00"
            },
            "KRW": {
                "text": "₩",
                "uniDec": "8361",
                "uniHex": "20a9",
                "format": "!##,###.00"
            },
            "KGS": {
                "text": "лв",
                "uniDec": "1083, 1074",
                "uniHex": "43b, 432",
                "decimal": ",",
                "group": " ",
                "format": "##,###.00 !"
            },
            "LAK": {
                "text": "₭",
                "uniDec": "8365",
                "uniHex": "20ad",
                "decimal": ",",
                "group": ".",
                "format": "!##,###.00"
            },
            "LBP": {
                "text": "£",
                "uniDec": "163",
                "uniHex": "a3",
                "decimal": "٫",
                "group": "٬",
                "format": "##,###.00 !"
            },
            "LRD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!##,###.00"
            },
            "MKD": {
                "text": "ден",
                "uniDec": "1076, 1077, 1085",
                "uniHex": "434, 435, 43d",
                "decimal": ",",
                "group": ".",
                "format": "! ##,###.00"
            },
            "MYR": {
                "text": "RM",
                "uniDec": "82, 77",
                "uniHex": "52, 4d",
                "format": "!#,###.00"
            },
            "MUR": {
                "text": "Rs",
                "uniDec": "8360",
                "uniHex": "20a8",
                "format": "!#,###.00"
            },
            "MXN": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!#,###.00"
            },
            "MZN": {
                "text": "MT",
                "uniDec": "77, 84",
                "uniHex": "4d, 54",
                "decimal": ",",
                "group": " ",
                "format": "##,###.00 !"
            },
            "NAD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!##,###.00"
            },
            "NPR": {
                "text": "Rs",
                "uniDec": "8360",
                "uniHex": "20a8",
                "format": "! #,###.00"
            },
            "ANG": {
                "text": "ƒ",
                "uniDec": "402",
                "uniHex": "192",
                "format": "!#,###.00"
            },
            "NZD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!#,###.00"
            },
            "NIO": {
                "text": "C$",
                "uniDec": "67, 36",
                "uniHex": "43, 24",
                "format": "!#,###.00"
            },
            "NGN": {
                "text": "₦",
                "uniDec": "8358",
                "uniHex": "20a6",
                "format": "!#,###.00"
            },
            "NOK": {
                "text": "kr",
                "uniDec": "107, 114",
                "uniHex": "6b, 72",
                "decimal": ",",
                "group": " ",
                "format": "! ##,###.00"
            },
            "OMR": {
                "text": "ریال",
                "uniDec": "65020",
                "uniHex": "fdfc",
                "decimal": "٫",
                "group": "٬",
                "format": "##,###.00 !"
            },
            "PKR": {
                "text": "Rs",
                "uniDec": "8360",
                "uniHex": "20a8",
                "format": "!#,###.00"
            },
            "PAB": {
                "text": "B/.",
                "uniDec": "66, 47, 46",
                "uniHex": "42, 2f, 2e",
                "format": "!#,###.00"
            },
            "PYG": {
                "text": "Gs",
                "uniDec": "71, 115",
                "uniHex": "47, 73",
                "decimal": ",",
                "group": ".",
                "format": "!##,###.00"
            },
            "PEN": {
                "text": "S/.",
                "uniDec": "83, 47, 46",
                "uniHex": "53, 2f, 2e",
                "decimal": ",",
                "group": ".",
                "format": "!##,###.00"
            },
            "PHP": {
                "text": "₱",
                "uniDec": "8369",
                "uniHex": "20b1",
                "format": "! ##,###.00"
            },
            "PLN": {
                "text": "zł",
                "uniDec": "122, 322",
                "uniHex": "7a, 142",
                "decimal": ",",
                "group": " ",
                "format": "##,###.00 !"
            },
            "QAR": {
                "text": "ریال",
                "uniDec": "65020",
                "uniHex": "fdfc",
                "decimal": "٫",
                "group": "٬",
                "format": "##,###.00 !"
            },
            "RON": {
                "text": "lei",
                "uniDec": "108, 101, 105",
                "uniHex": "6c, 65, 69",
                "decimal": ",",
                "group": ".",
                "format": "##,###.00 !"
            },
            "RUB": {
                "text": "руб",
                "uniDec": "1088, 1091, 1073",
                "uniHex": "440, 443, 431",
                "decimal": ",",
                "group": " ",
                "format": "##,###.00 !"
            },
            "SHP": {
                "text": "£",
                "uniDec": "163",
                "uniHex": "a3",
                "format": "!#,###.00"
            },
            "SAR": {
                "text": "ریال",
                "uniDec": "65020",
                "uniHex": "fdfc",
                "decimal": "٫",
                "group": "٬",
                "format": "##,###.00 !"
            },
            "RSD": {
                "text": "Дин.",
                "uniDec": "1044, 1080, 1085, 46",
                "uniHex": "414, 438, 43d, 2e",
                "decimal": ",",
                "group": ".",
                "format": "! ##,###.00"
            },
            "SCR": {
                "text": "Rs",
                "uniDec": "8360",
                "uniHex": "20a8",
                "format": "!##,###.00"
            },
            "SGD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!##,###.00"
            },
            "SBD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "format": "!##,###.00"
            },
            "SOS": {
                "text": "S",
                "uniDec": "83",
                "uniHex": "53",
                "format": "!##,###.00"
            },
            "ZAR": {
                "text": "R",
                "uniDec": "82",
                "uniHex": "52",
                "format": "!##,###.00"
            },
            "LKR": {
                "text": "Rs",
                "uniDec": "8360",
                "uniHex": "20a8",
                "format": "! ##,###.00"
            },
            "SEK": {
                "text": "kr",
                "uniDec": "107, 114",
                "uniHex": "6b, 72",
                "decimal": ",",
                "group": " ",
                "format": "##,###.00 !"
            },
            "CHF": {
                "text": "CHF",
                "uniDec": "67, 72, 70",
                "uniHex": "43, 48, 46",
                "decimal": ".",
                "group": "'",
                "format": "! ##,###.00"
            },
            "SRD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "decimal": ",",
                "group": ".",
                "format": "! ##,###.00"
            },
            "SYP": {
                "text": "£",
                "uniDec": "163",
                "uniHex": "a3",
                "decimal": "٫",
                "group": "٬",
                "format": "##,###.00 !"
            },
            "TWD": {
                "text": "NT$",
                "uniDec": "78, 84, 36",
                "uniHex": "4e, 54, 24",
                "format": "!##,###.00"
            },
            "THB": {
                "text": "฿",
                "uniDec": "3647",
                "uniHex": "e3f",
                "format": "!#,###.00"
            },
            "TTD": {
                "text": "TT$",
                "uniDec": "84, 84, 36",
                "uniHex": "54, 54, 24",
                "format": "!##,###.00"
            },
            "TRY": {
                "text": "₺",
                "uniDec": "8378",
                "uniHex": "20ba",
                "group": ".",
                "decimal": ",",
                "format": "!#,###.00"
            },
            "TVD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "group": ",",
                "decimal": ".",
                "format": "!#,###.00"
            },
            "UAH": {
                "text": "₴",
                "uniDec": "8372",
                "uniHex": "20b4",
                "group": " ",
                "decimal": ",",
                "format": "#,###.00 !"
            },
            "GBP": {
                "text": "£",
                "uniDec": "163",
                "uniHex": "a3",
                "group": ",",
                "decimal": ".",
                "format": "!#,###.00"
            },
            "USD": {
                "text": "$",
                "uniDec": "36",
                "uniHex": "24",
                "group": ",",
                "decimal": ".",
                "format": "!#,###.00"
            },
            "UYU": {
                "text": "$U",
                "uniDec": "36, 85",
                "uniHex": "24, 55",
                "group": ".",
                "decimal": ",",
                "format": "! #,###.00"
            },
            "UZS": {
                "text": "soʻm",
                "uniDec": "1083, 1074",
                "uniHex": "43b, 432",
                "group": ",",
                "decimal": ".",
                "format": "#,###.00 !"
            },
            "VEF": {
                "text": "Bs",
                "uniDec": "66, 115",
                "uniHex": "42, 73",
                "decimal": ",",
                "group": ".",
                "format": "!#,###.00"
            },
            "VND": {
                "text": "₫",
                "uniDec": "8363",
                "uniHex": "20ab",
                "decimal": ",",
                "group": ".",
                "format": "#,###.00 !"
            },
            "XOF": {
                "text": "CFA",
                "uniDec": "8363",
                "uniHex": "20ab",
                "decimal": ".",
                "group": ",",
                "format": "!#,###.00"
            },
            "YER": {
                "text": "ر.ي.",
                "uniDec": "65020",
                "uniHex": "fdfc",
                "decimal": ".",
                "group": ",",
                "format": "#,###.00 !"
            },
            "ZWD": {
                "text": "Z$",
                "uniDec": "90, 36",
                "uniHex": "5a, 24",
                "format": "# ###.##"
            },
            "AED": {
                "text": "د.إ"
            },
            "AOA": {
                "text": "Kz"
            },
            "BDT": {
                "text": "Tk"
            },
            "BHD": {
                "text": "BD"
            },
            "ETB": {
                "text": "Br"
            },
            "HTG": {
                "text": "G"
            },
            "KES": {
                "text": "KSh"
            },
            "KWD": {
                "text": "ك"
            },
            "LYD": {
                "text": "LD"
            },
            "MGA": {
                "text": "Ar"
            },
            "MMK": {
                "text": "K"
            },
            "MNT": {
                "text": "₮"
            },
            "MOP": {
                "text": "MOP$"
            },
            "MWK": {
                "text": "MK"
            },
            "PGK": {
                "text": "K"
            },
            "SLL": {
                "text": "Le"
            },
            "TOP": {
                "text": "T$"
            },
            "UGX": {
                "text": "UGX"
            },
            "VUV": {
                "text": "VT"
            },
            "MAD": {
                "text": "MAD",
                "format": "!##,###.00"
            }
        }
   });
}());
},{}],22:[function(require,module,exports){
window.VOUINS = window.VOUINS || {};

// VF remote function - call any Apex class which implements VlocityOpenInterface
// @param
// sClassName - Apex class name (Apex class which implements VlocityOpenInterface
// sMethodName - method in the Apex class
// options - remote call options
// iTimeout - timeout of VF remote call, default - 30000
VOUINS.GenericInvoke = function(sClassName, sMethodName, input, options, iTimeout, callback)
{
    var optionsJson = JSON.parse(options);

    var customFunction;

    if (optionsJson.customAjaxFunction !== undefined)
    {
        customFunction = window[optionsJson.customAjaxFunction];
        customFunction(sClassName, sMethodName, input, options, iTimeout, callback);
    }
    else
    {
        var remoteOptions = {escape: false, buffer: false };
        // Only set the timeout for Visualforce remoting if it is not the default of 30000.
        // Allows overriding on the global level with Visualforce.remoting.timeout = 120000;
        if(iTimeout != undefined && iTimeout !== null && iTimeout !== 30000)
            remoteOptions.timeout = iTimeout;
        if(sClassName === undefined || sClassName === null)
          sClassName = '';
        if(sMethodName === undefined || sMethodName === null)
          sMethodName = '';

        var totalLength = input.length + options.length;

        if ((optionsJson.useQueueableApexRemoting === true || totalLength > 700000) &&
            typeof(vlocityVFActionFunctionControllerHandlers) !== 'undefined' &&
            typeof(vlocityVFActionFunctionControllerHandlers.runServerMethod) === 'function') {

            var isQueueable = (optionsJson.useQueueableApexRemoting === true);

            vlocityVFActionFunctionControllerHandlers.runServerMethod(sClassName, sMethodName, input, options, isQueueable, callback);
        }
        else if(typeof Visualforce !== 'undefined')
        {
            var onCompete = function(result, event) {

                if (event.message && !event.error)
                {
                    if (event.message.indexOf('Input too long.') > -1)
                    {
                        event.error = customLabels.RequestTooLarge;
                    }
                    else
                    {
                        event.error = event.message;
                    }
                }

                callback(result, event);
            }

            Visualforce.remoting.Manager.invokeAction(
                  remoteActionMap.GenericInvoke2,
                  sClassName, sMethodName, input, options, onCompete, remoteOptions);
        }
        else
            VOUINS.fakeAjax(callback);
    }
};

// utility function
VOUINS.isEmpty = function(obj)
{
    return (obj === undefined || obj === null || obj === '' || (obj.constructor === Object && Object.keys(obj).length === 0));
};

// utility function
// customizer for lodash .merge
// used to handle deep merge of two JSON objects
VOUINS.mergeJSONLogic = function(a, b)
{
    // if one of them is an array, we just overwrite it
    // if one of them is null, just overwrite it
    if ((_.isArray(a) || _.isArray(b)) || (a === null || b === null))
    {
        return b;
    }
    if(b === undefined) {
        return null;
    }
};

VOUINS.fakeAjax = function(callback) {
     var timer = setTimeout(function () {
         callback({error:customLabels.OmniNoSFDCConnection}, {status:true});
     }, 0);
};

VOUINS.generateUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

VOUINS.getQueryParams = function(queryString) {
    var query = (queryString || window.location.search).substring(1); // delete ?
    if (!query) {
        return false;
    }

    // From https://unixpapa.com/js/querystring.html
    function decode(s) {
        if (!s) {
            return '';
        }
        s = s.replace(/\+/g, ' ');
        s = s.replace(/%([EF][0-9A-F])%([89AB][0-9A-F])%([89AB][0-9A-F])/gi,
            function (code, hex1, hex2, hex3) {
                var n1 = parseInt(hex1, 16) - 0xE0;
                var n2 = parseInt(hex2, 16) - 0x80;
                if (n1 == 0 && n2 < 32) return code;
                var n3 = parseInt(hex3, 16) - 0x80;
                var n = (n1 << 12) + (n2 << 6) + n3;
                if (n > 0xFFFF) return code;
                return String.fromCharCode(n);
            });
        s = s.replace(/%([CD][0-9A-F])%([89AB][0-9A-F])/gi,
            function (code, hex1, hex2) {
                var n1 = parseInt(hex1, 16) - 0xC0;
                if (n1 < 2) return code;
                var n2 = parseInt(hex2, 16) - 0x80;
                return String.fromCharCode((n1 << 6) + n2);
            });
        s = s.replace(/%([0-7][0-9A-F])/gi,
            function (code, hex) {
                return String.fromCharCode(parseInt(hex, 16));
            });
        return s;
    };
    // LODASH INTER VERSION COMPATABILITY PATCH
    var tmp0 = _.chain(query.split('&'))
        .map(function (params) {
            var p = params.split('=');
            if (p[0] && unescape(p[0]) && unescape(p[0]).toLowerCase().indexOf('</script') >= 0 ||
                decode(p[1]) && unescape(decode(p[1])) && unescape(decode(p[1])).toLowerCase().indexOf('</script') >= 0) {
                return;
            }
            return [p[0], decode(p[1])];
        });
    if (tmp0.fromPairs && typeof tmp0.fromPairs === "function"){
        return tmp0.fromPairs().value();
    }
    return tmp0.object().value();
};

VOUINS.initiateForce = function(scope, force) {
    scope.instanceHost = '..';

    if (sfdcVars != null && sfdcVars.instanceHost != null) {
        scope.instanceHost = sfdcVars.instanceHost;
    }

    window.OmniForce = force;
    if(window.sessionId === '{!$Api.Session_ID}') {
        if(window.customVOmniAuth && window.customVOmniAuth.constructor === Function) {
            window.customVOmniAuth(scope);
        }
        else {
            if(window.parent.VlocOmniOut && window.parent.VlocOmniOut.force) {
                if(window.parent.VlocOmniOut.forceLocalDef){
                    window.forceLocalDef = window.parent.VlocOmniOut.forceLocalDef;
                }
                if(window.parent.VlocOmniOut.callUserInfo){
                    window.callUserInfo = window.parent.VlocOmniOut.callUserInfo;
                }
                var oauth = window.parent.VlocOmniOut.force.getOAuth();
                var urls = window.parent.VlocOmniOut.force.getURLs();
                if(oauth && urls) {
                    window.OmniForce.init({useProxy:urls.useProxy,proxyURL:urls.proxyURL,oauthCallbackURL:urls.oauthCallbackURL,
                                           accessToken:oauth.access_token,instanceURL:oauth.instance_url});
                }
            }
            //embedded in a native mobile app
            else if(window.parent.sfdccredentials) {
                var accessToken = window.parent.sfdccredentials.accessToken;
                var instanceURL = window.parent.sfdccredentials.instanceURL;
                if(accessToken && instanceURL) {
                    window.OmniForce.init({
                        accessToken: accessToken,
                        instanceURL: instanceURL,
                        useProxy: false
                    });
                }
            }

            if(!window.OmniForce || !window.OmniForce.getOAuth())
                return;
            else {
                scope.instanceHost = window.OmniForce.getOAuth().instance_url;
                scope.$root.instanceHost = window.OmniForce.getOAuth().instance_url;
            }
        }
    }
}

VOUINS.loadCustomHTMLJS = function(scope) {
    var htmlMarkup = null;
    if(scope.bpTree && scope.bpTree.testTemplates !== undefined && scope.bpTree.testTemplates !== null)
        htmlMarkup = scope.bpTree.testTemplates;
    if(scope.bpTree && scope.bpTree.customJS !== undefined && scope.bpTree.customJS !== null)
    {
        var customJS = document.createElement("SCRIPT");
        var customJSCode = document.createTextNode(scope.bpTree.customJS);
        customJS.appendChild(customJSCode);
        document.body.appendChild(customJS);
    }
    return htmlMarkup;
};

VOUINS.loadHeaderHTML = function(scope,compile) {
    var headerMarkup = "";
    var headerScripts = window.document.head.getElementsByTagName("script");
    var length = headerScripts.length;

    for (var i = 0 ; i<length; i++){
        if(headerScripts[i].getAttribute('type')=='text/ng-template'){
            headerMarkup=headerMarkup+headerScripts[i].outerHTML;
        }
    }
    if (headerMarkup != ""){
        compile(headerMarkup);
    }
};

VOUINS.getTopBPDom = function(scp) {
    var returnDom = (scp.miniForm)?(document.getElementById(scp.bpTree.sOmniScriptId)):(document);
    if(!returnDom)
        returnDom = document;

    return returnDom;
}

// utility function
VOUINS.isDigit = function(s)
{
    return (/[\d()+]/.test(s));
};

VOUINS.isRepeatNotation = function(key)
{
    if(key !== undefined && key !== null) {
        var parseFlds = key.match(/[|]( *)[n]/g);
        if(parseFlds && parseFlds.length > 0)
        return true;
    }
    return false;
};

VOUINS.getFilesMap = function(filesMap, bSforce, sf) {

    if (filesMap)
    {
        if (bSforce && sf.connection)
        {
            var filesString = angular.toJson(filesMap);
            var filesMapReduced = {};

            if (filesString.length > 1000000)
            {
                var filesMapReduced = {};
                angular.forEach(filesMap, function(value, fileKey) {
                    filesMapReduced[fileKey] = fileKey;
                });

                return filesMapReduced;
            }
            else
            {
                return filesMap;
            }
        }
        else
        {
            return filesMap;
        }
    }
    else
    {
        return {};
    }
}

// helper function
// Fills in Attachments with data from the filesMap
// @param
// response - response
VOUINS.syncFileAttachmentData = function(response, block, rootScp, qSrv, scp, filesMap, injSrc, winSrv)
{
    var deferred = qSrv.defer();

    if (block)
    {
        rootScp.loading = true;
    }
    else if(scp && scp.bpTree)
    {
        scp.bpTree.savingAttachments = true;
    }

    setTimeout(function() {

        var attachmentSyncData;

        if (response)
        {
            attachmentSyncData = response.fileAttachmentSyncData;
        }

        if (!attachmentSyncData)
        {
            if (block)
            {
                rootScp.loading = false;
            }
            else
            {
                scp.bpTree.savingAttachments = false;
            }

            deferred.resolve({ status: true });
        }
        else
        {
            var allAttachmentPromises = [];

            angular.forEach(attachmentSyncData, function(attachmentId, fileMapKey)
            {

                if (rootScp.isSforce
                    && filesMap
                    && filesMap[fileMapKey]
                    && typeof filesMap[fileMapKey] === 'string')
                {
                    allAttachmentPromises.push(injSrc.UpdateOSAttachment(filesMap[fileMapKey].substr(filesMap[fileMapKey].indexOf(',') + 1), attachmentId, {
                        ContentType: filesMap[fileMapKey].substring(5, filesMap[fileMapKey].indexOf(';'))
                    }));
                }
            });

            var onSyncComplete = function(results) {
                console.log('results', results);
                if (block)
                {
                    rootScp.loading = false;
                }
                else if(scp && scp.bpTree)
                {
                    scp.bpTree.savingAttachments = false;
                }

                if (!results)
                {
                    winSrv.alert(customLabels.OmniScriptSavingAttachmentsFailed);
                }

                deferred.resolve({ status: true });
            }

            qSrv.all(allAttachmentPromises).then(onSyncComplete, onSyncComplete);
        }
    });

    return deferred.promise;
};

VOUINS.UpdateOSAttachment = function(bodyData, attachmentId, options, callback)
{
    sforce.connection.sessionId = window.sessionId;

    var attachmentSObj = new sforce.SObject("Attachment");
    attachmentSObj.Id = attachmentId;
    attachmentSObj.Body = bodyData;


    if (options.ContentType)
    {
         attachmentSObj.ContentType = options.ContentType;
    }
    sforce.connection.update([attachmentSObj], {
        onSuccess: function(result)
        {
            if (callback)
            {
                callback(attachmentId, { status: result[0].getBoolean("success") });
            }
        },
        onFailure: function(result)
        {
            if (callback)
            {
                callback(attachmentId, { status: false });
            }
        }
    });
};

VOUINS.propShortNameMap = {'previousLabel':'ompl','nextLabel':'omnl','cancelLabel':'omcl','saveLabel':'omsl','completeLabel':'omcoml',
                           'summaryLabel':'omsul','submitLabel':'omsubl','reviseLabel':'omrl','failureNextLabel':'omfnl',
                           'failureAbortLabel':'omfal','failureGoBackLabel':'omfgbl','redirectNextLabel':'omrnl','redirectPreviousLabel':'omrpl',
                           'consoleTabLabel':'omctl','newItemLabel':'omnil','newLabel':'omnewl','editLabel':'omel',
                           'deleteLabel':'omdl','cancelMessage':'omcm','saveMessage':'omsm','completeMessage':'omcomm',
                           'inProgressMessage':'omipm','postMessage':'ompm','failureAbortMessage':'omfam',
                           'buttonLabel':'ombl', 'checkLabel':'omckl', 'messages|n:text':'omtl',
                           'persistentComponent|n:label':'ompcl', 'options|n:value':'omov','radioLabels|n:value':'omrlv', 'instructionKey':'omik',
                           'labelKey':'omlk', 'textKey':'omtk', 'subLabel':'omsbl', 'remoteConfirmMsg':'omrcm', 'errorMessage:custom|n:message':'omermc',
                           'errorMessage:default':'omerd', 'ptrnErrText':'ompet'}

VOUINS.updatePropJSON = function(propInput, labelMsg, labelKeyMap) {
    var tokenList = labelMsg.split(':');
    var propToUpdate = VOUINS.getPropToUpdate(propInput, tokenList);
    if(!propToUpdate) return;
    var node = tokenList[tokenList.length-1];
    if(angular.isArray(propToUpdate)) {
        for(var j=0; j<propToUpdate.length; j++) {
            if(propToUpdate[j][VOUINS.propShortNameMap[labelMsg]] === undefined) {
                propToUpdate[j][VOUINS.propShortNameMap[labelMsg]] = propToUpdate[j][node];
            }
            if(!propToUpdate[j][VOUINS.propShortNameMap[labelMsg]] && customLabels.hasOwnProperty('Omni'+labelMsg)) {
                propToUpdate[j][node] = customLabels['Omni'+labelMsg];
            }
            else {
                propToUpdate[j][node] = labelKeyMap[propToUpdate[j][VOUINS.propShortNameMap[labelMsg]]];
            }
        }
    }
    else {
        if(propToUpdate[VOUINS.propShortNameMap[labelMsg]] === undefined) {
            propToUpdate[VOUINS.propShortNameMap[labelMsg]] = propToUpdate[node];
        }
        if(!propToUpdate[VOUINS.propShortNameMap[labelMsg]] && customLabels.hasOwnProperty('Omni'+labelMsg)) {
            propToUpdate[node] = customLabels['Omni'+labelMsg];
        }
        else {
            propToUpdate[node] = labelKeyMap[propToUpdate[VOUINS.propShortNameMap[labelMsg]]];
        }
    }
}

VOUINS.handleMultiLangLabel = function(control, labelKeyMap, scriptHd)
{
    if(control) {
        if(VOUINS.picklistEleList.indexOf(control.type)>=0 &&
            (control.propSetMap.optionSource.type === 'Custom' || control.propSetMap.optionSource.type === 'SObject') )
            return;
        var labelMsgList = VOUINS.ootbLabelMap[control.type];
        // action type, to support confirm popup
        if(VOUINS.actionEleTypesBase.indexOf(control.type)>=0 && control.propSetMap.confirm === true) {
            labelMsgList = labelMsgList.concat(VOUINS.ootbLabelMap2);
        }
        if(labelMsgList) {
            for(var i=0; i<labelMsgList.length; i++) {
                if(labelMsgList[i].indexOf(':') < 0 && labelMsgList[i].indexOf('|') < 0) {
                    if(control.propSetMap[VOUINS.propShortNameMap[labelMsgList[i]]] === undefined) {
                        control.propSetMap[VOUINS.propShortNameMap[labelMsgList[i]]] = control.propSetMap[labelMsgList[i]];
                    }
                    if(!control.propSetMap[VOUINS.propShortNameMap[labelMsgList[i]]] && customLabels.hasOwnProperty('Omni'+labelMsgList[i])) {
                        control.propSetMap[labelMsgList[i]] = customLabels['Omni'+labelMsgList[i]];
                    }
                    else {
                        control.propSetMap[labelMsgList[i]] = labelKeyMap[control.propSetMap[VOUINS.propShortNameMap[labelMsgList[i]]]];
                    }
                }
                else {
                    VOUINS.updatePropJSON(control.propSetMap, labelMsgList[i], labelKeyMap);
                }
            }
        }
    }

    // header ompcl， omctl
    if(scriptHd) {
        var labelMsgList = VOUINS.ootbLabelMap['Script'];
        for(var i=0; i<labelMsgList.length; i++) {
            VOUINS.updatePropJSON(scriptHd, labelMsgList[i], labelKeyMap);
        }
    }
}

VOUINS.pickListSeeding = function(rootScope, bpSrc, bpTree) {
    if(bpSrc.bPLSeeding === undefined) {
        bpSrc.bPLSeeding = false;
        if(bpTree.propSetMap.rtpSeed === true || bpSrc.bMultiLang) {
            bpSrc.bPLSeeding = true;
        }
    }

    if(bpSrc.bPLSeeding === false)
        return;

    // if there are no Radio/Select/Multi-select,
    if(Object.getOwnPropertyNames(bpTree.sobjPL).length <= 0 && Object.getOwnPropertyNames(bpTree.cusPL).length <= 0
       && Object.getOwnPropertyNames(bpTree.depSOPL) <= 0 && Object.getOwnPropertyNames(bpTree.depCusPL) <= 0) {
        rootScope.VlocPicklistSeeding = {};
        rootScope.seedingDone = true;
        return;
    }
    var input = {sobjPL:Object.keys(bpTree.sobjPL).join(),cusPL:Object.keys(bpTree.cusPL).join(),
                 depSOPL:Object.keys(bpTree.depSOPL).join(),depCusPL:Object.keys(bpTree.depCusPL).join(),
                 LanguageCode:bpSrc.LanguageCode};
    var configObj = {sClassName:bpSrc.sNSC+'DefaultFetchPicklistOptionsImpl',sMethodName:'OmniScriptPicklistSeed',input:angular.toJson(input),
                     options:"{}",iTimeout:null,label:{label:'PicklistSeeding',stage:'PicklistSeeding'}};
    bpSrc.OmniRemoteInvoke(configObj).then(
        function(result)
        {
            var remoteResp = angular.fromJson(result);
            if(remoteResp && remoteResp.VlocPicklistSeeding) {
                rootScope.VlocPicklistSeeding = angular.fromJson(remoteResp.VlocPicklistSeeding);
            }
            else {
                rootScope.VlocPicklistSeeding = {};
            }
            rootScope.seedingDone = true;
            console.log('seeding');
        },
        function(error)
        {
            rootScope.seedingFailed = true;
            rootScope.VlocPicklistSeeding = {};
            console.log('Picklist seeding failed ' + scope.child.eleArray[0].name);
        }
    );
}

VOUINS.CreateOSContentVersion = function(bodyData, filename, parentId, options, callback)
{
    var optionsJson = JSON.parse(options);

    var customFunction;

    if (optionsJson.customAjaxFunction !== undefined)
    {
        customFunction = window[optionsJson.customAjaxFunction];
        customFunction(bodyData, parentId, filename, options, callback);
    }
    else if(typeof Visualforce !== 'undefined')
    {
        if (bodyData.length > 50000000)
        {
            callback({ error: customLabels.OmniMaxFileSize }, { status: false });
        }
        else if (typeof(sforce) !== 'undefined' && sforce.connection && bodyData.length > 2000000)
        {
            VOUINS.CreateOSContentVersionSOAP(bodyData, filename, function(result) {

                if (typeof result == "string") {
                    result = JSON.parse(result);
                }

                if (result.contentVersionId) {
                    VOUINS.CreateOSContentVersionCallback(result.contentVersionId, parentId, callback);
                } else {
                    callback(result, { status: false });
                }

            });

        }
        else if (bodyData.length > 700000 &&
            typeof(vlocityVFActionFunctionControllerHandlers) !== 'undefined' &&
            typeof(vlocityVFActionFunctionControllerHandlers.runServerMethod) === 'function')
        {
            var className = 'BusinessProcessDisplayController.BusinessProcessDisplayControllerOpen';

            if (sfdcVars.sNS != '')
                className = sfdcVars.sNS + '.' + className;

            var input = angular.toJson({ bodyData: bodyData, filename: filename, parentId: parentId });

            vlocityVFActionFunctionControllerHandlers.runServerMethod(className, 'CreateOSContentVersion', input, '{}', false,

                function(result, event) {

                    if (!result) {
                        result = event;
                    }

                    if (typeof result == "string") {
                        result = JSON.parse(result);
                    }

                    if (result.contentDocumentId) {
                        callback(result, { status: true });
                    } else {
                        if (!result.error) {
                            result.error = customLabels.UploadFailed;
                        }

                        callback(result, { status: false });
                    }
                });
        }
        else
        {
            Visualforce.remoting.Manager.invokeAction(
                remoteActionMap.CreateOSContentVersion,
                bodyData,
                filename,
                parentId,
                callback,
                { escape: false, buffer: false });
        }
    }
    else
        VOUINS.fakeAjax(callback);
}

VOUINS.CreateOSContentVersionSOAP = function(bodyData, filename, callback)
{
    sforce.connection.sessionId = window.sessionId;

    var attachmentSObj = new sforce.SObject("ContentVersion");
    attachmentSObj.VersionData = bodyData;
    attachmentSObj.Title = filename;
    attachmentSObj.PathOnClient = filename;

    if (sfdcVars.communitiesNetworkId) {
        attachmentSObj.NetworkId =  sfdcVars.communitiesNetworkId;
    }

    sforce.connection.create([attachmentSObj], {
        onSuccess: function(result)
        {
            if (callback)
            {
                callback({ contentVersionId: result[0].id }, { status: result[0].getBoolean("success") });
            }
        },
        onFailure: function(result)
        {
            if (callback)
            {
                callback({ error: result.faultstring }, { status: false });
            }
        }
    });
};

VOUINS.CreateOSContentVersionCallback = function(contentVersionId, parentId, callback) {
    Visualforce.remoting.Manager.invokeAction(
        remoteActionMap.ContentVersionAddLink,
        contentVersionId,
        parentId,
        function(result) {
            if (typeof result == 'string') {
                result = angular.fromJson(result);
            }
            callback(result, { status: true });
        },
        { escape: false, buffer: false });
}

VOUINS.ClearData = function(scope) {
    scope.bpTree = null;
    scope.omniInput = null;
    scope.child = {};
    scope.children = [];
    scope.submitted = false;
    scope.actionStatus = {};
    scope.isFormValid = true;
}

VOUINS.resetOptions = function(control, newOpt) {
    if(control.type !== 'Multi-select'){
        control.propSetMap.options = newOpt;
    } else {
        var existingOptMap = {};
        if(angular.isArray(control.propSetMap.options)) {
            for(var i=0; i<control.propSetMap.options.length; i++) {
                if(control.propSetMap.options[i].selected === true) {
                    existingOptMap[control.propSetMap.options[i].name] = '';
                }
            }
        }
        if(angular.isArray(newOpt) && Object.getOwnPropertyNames(existingOptMap).length > 0) {
            for(var i=0; i<newOpt.length; i++) {
                if(existingOptMap.hasOwnProperty(newOpt[i].name)) {
                    newOpt[i].selected = true;
                }
            }
        }
        control.propSetMap.options = newOpt;
    }
}

VOUINS.handleEditBlockLabel = function(children, labelKeyMap, labelMap) {
    for(var i=0; i<children.length; i++) {
        for(var j=0; j<children[i].eleArray.length; j++) {
            if(children[i].eleArray[j].propSetMap.disOnTplt) {
                children[i].eleArray[j].propSetMap.label = labelKeyMap[labelMap[children[i].eleArray[j].name]];
            }
        }
    }
}

},{}],23:[function(require,module,exports){
window.VOUINS = window.VOUINS || {};

VOUINS.VlocityTrack = function(trackingData)
{
    if(typeof Visualforce !== 'undefined') {
        Visualforce.remoting.Manager.invokeAction(
            remoteActionMap.VlocityTrack,
            trackingData, function() {
            }, {escape: false, buffer: true});
    }
};

// VF remote function - launch the script using script id (preview and resume case (submit to Application object))
// 3.0 - OmniScript Instance case
// @param 
// sId - row id of the OmniScript Id
// scriptState - review (Application case), new, saveAndResume
// bPreview - preview mode or not
VOUINS.BuildJSONV3 = function(sId, scriptState, bPreview, multiLangCode, callback)
{
    if(multiLangCode === undefined) {
        multiLangCode = null;
    }
    if(typeof Visualforce !== 'undefined') {
        Visualforce.remoting.Manager.invokeAction(
            remoteActionMap.BuildJSONV3,
            sId, scriptState, bPreview, multiLangCode, callback, {escape: false, buffer: false});
    }
    else
        VOUINS.fakeAjax(callback);
};
 
VOUINS.fakeAjax = function(callback) {
     var timer = setTimeout(function () {
         callback({error:customLabels.OmniNoSFDCConnection}, {status:true});
     }, 0);
};

// VF remote function - to save the OmniScript
// @param 
// sId - row id of the OmniScript Id
// scriptState - review (Application case), new, saveAndResume
// bPreview - preview mode or not
VOUINS.SaveBP = function(bpTree, files, callback)
{
    if (((bpTree.length+files.length) > 700000) && 
        typeof(vlocityVFActionFunctionControllerHandlers) !== 'undefined' &&
        typeof(vlocityVFActionFunctionControllerHandlers.runServerMethod) === 'function')
    {
        var input = angular.toJson({bpTree: bpTree, files: files });

        var className = 'BusinessProcessDisplayController.BusinessProcessDisplayControllerOpen';
        
        if (sfdcVars.sNS != '')
            className = sfdcVars.sNS + '.' + className;

        vlocityVFActionFunctionControllerHandlers.runServerMethod(className, 'SaveBP', input, '{}', false, callback);
    }
    else if(typeof Visualforce !== 'undefined')
    {
        Visualforce.remoting.Manager.invokeAction(
            remoteActionMap.SaveBP,
            bpTree, files, callback, {escape: false, buffer: false});
    }            
    else
        VOUINS.fakeAjax(callback);
};  

// VF remote function - Set the Status of the OmniScript Instance to Completed
// @param        
// sInstanceId - OmniScript Instance record
VOUINS.CompleteScript = function(sInstanceId, callback)
{
    if(typeof Visualforce !== 'undefined') {
        Visualforce.remoting.Manager.invokeAction(
            remoteActionMap.CompleteScript,
            sInstanceId, callback, {escape: false, buffer: false});
    }
    else
        VOUINS.fakeAjax(callback);
};

// VF remote function - call any Apex class which implements VlocityOpenInterface
// @param 
// bodyData - Base64 Encoded Attachment Data
// parentId - actual record Id to attach to
// filename - the name of the file
VOUINS.CreateOSAttachment = function(bodyData, parentId, filename, options, callback)
{
    var optionsJson = JSON.parse(options);

    var customFunction;

    if (optionsJson.customAjaxFunction !== undefined)
    {
        customFunction = window[optionsJson.customAjaxFunction];
        customFunction(bodyData, parentId, filename, options, callback);
    }
    else if(typeof Visualforce !== 'undefined')
    {
        if (typeof(sforce) !== 'undefined' && sforce.connection && bodyData.length > 2000000) 
        {
            Visualforce.remoting.Manager.invokeAction(
                  remoteActionMap.CreateOSAttachment,
                  'TEMP BODY', parentId, filename, 
                    function(attachmentId)
                    {
                        UpdateOSAttachment(bodyData, attachmentId, options, callback);

                    }, {escape: false, buffer: false});
        }
        else if ((optionsJson.useQueueableApexRemoting === true || bodyData.length > 700000) && 
            typeof(vlocityVFActionFunctionControllerHandlers) !== 'undefined' &&
            typeof(vlocityVFActionFunctionControllerHandlers.runAddAttachment) === 'function')
        {

            vlocityVFActionFunctionControllerHandlers.runAddAttachment(bodyData, parentId, filename,  function(attachmentId) {
                    callback(attachmentId, { status: true });
                }, function() {
                    callback(null, { status: false } );
                });
        }
        else
        {
            Visualforce.remoting.Manager.invokeAction(
                  remoteActionMap.CreateOSAttachment,
                  bodyData, parentId, filename, callback, {escape: false, buffer: false});
        }        
    }
    else
        VOUINS.fakeAjax(callback);
};

VOUINS.DeleteOSAttachment = function(attachmentId, deleteParent, options, callback)
{
    if(typeof Visualforce !== 'undefined') {
        Visualforce.remoting.Manager.invokeAction(
                     remoteActionMap.DeleteOSAttachment,
                     attachmentId, deleteParent, callback, {escape: false, buffer: false});
    }
    else
        VOUINS.fakeAjax(callback);
};

// VF remote function - launch the script in production - Type, Sub Type and Lang
// @param        
// sType - Type of the OmniScript
// sSubType - Sub Type of the OmniScript
// sLang - Language of the OmniScript
// sPfBundle - prefill bundle
// sDrParams - DataRaptor parameters 
VOUINS.BuildJSONWithPrefill = function(sType, sSubType, sLang, sPfBundle, sDrParams, multiLangCode, callback)
{
    if(multiLangCode === undefined)
        multiLangCode = null;
    if(!window.OmniOut) {
        if(typeof Visualforce !== 'undefined') {
            Visualforce.remoting.Manager.invokeAction(
                remoteActionMap.BuildJSONWithPrefill,
                sType, sSubType, sLang, sPfBundle, sDrParams, multiLangCode, callback, {escape: false, buffer: false});
        }
        else
            VOUINS.fakeAjax(callback);
    }
    else {
        VOUINS.BuildJSONWithPrefillLocalDef(sType, sSubType, sLang, sPfBundle, sDrParams, multiLangCode, callback);
    }
};

// VF remote function - launch the script in production - Type, Sub Type and Lang
// @param        
// sType - Type of the OmniScript
// sSubType - Sub Type of the OmniScript
// sLang - Language of the OmniScript
// sPfBundle - prefill bundle
// sDrParams - DataRaptor parameters 
VOUINS.BuildJSONWithPrefillLocalDef = function(sType, sSubType, sLang, sPfBundle, sDrParams, multiLangCode, callback)
{
    var path = "";
    var xhttp = new XMLHttpRequest();
    if(typeof window.VOmniScriptDefPath == 'string'){
        path = window.VOmniScriptDefPath;
    }
    else{
        path = './scripts/'
    }
    path = path + sType.replace(/\s+/g, '') + '_' + sSubType.replace(/\s+/g, '') + '_' + sLang.replace(/\s+/g, '') + '.json';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            var reqObj = this;
            this.state = this.state || this.status;

            // ios sets status to 0 even though the request was successful
            if(this.status === 0 && this.responseText && this.responseText.length > 0) {
                // new obj because this.status is read-only
                reqObj = Object.assign({}, reqObj, {status: 200, state: 200});
            }
            else if(this.state !== 200) {
                this.message = this.responseText;
                this.errType = 'LocalScriptDefNotFound';
            }

            callback(this.responseText.replace(/^{/,'{"refreshUserInfo":true,'), reqObj);
        }
    };
    xhttp.open("GET", path, true);
    xhttp.send();         
};

// CreateOSDocumentAttachment - Create the large document using soap request.
// @param 
// bodyData - Base64 Encoded Attachment Data
// foldeId - Folder to store create document.
// filename - the name of the file.
// contentType - content type of document file.
VOUINS.CreateOSDocumentAttachment = function(bodyData, fileName, foldeId, contentType, callback)
{
    sforce.connection.sessionId = window.sessionId;

    var attachmentSObj = new sforce.SObject("Document");
    attachmentSObj.Body = bodyData;
    attachmentSObj.Name = fileName;
    attachmentSObj.FolderId = foldeId;
    attachmentSObj.ContentType = contentType;

    sforce.connection.create([attachmentSObj], {
        onSuccess: function(result)
        {
            if (callback)
            {
                callback(result[0].id, { status: result[0].getBoolean("success") });
            }
        },  
        onFailure: function(result)
        {
            if (callback)
            {
                callback(result.faultstring, { status: false });
            }
        }
    });
};

VOUINS.constructSFLLink = function(location, service)
{
    var link = location.origin + location.pathname + '?';
    var qParam = VOUINS.getQueryParams(location.search);
    if(qParam) {
        for (var key in qParam) {
            if(qParam.hasOwnProperty(key)) {
                if(service.incQueryParams.hasOwnProperty(key)) {
                    link += key + '=' + qParam[key] + '&';
                }
            }
        }                            
    }
    if(link && link[link.length-1] == '&') {
        link = link.substring(0, link.length-1);
    }
    return link;
}
},{}],24:[function(require,module,exports){
/* globals VOUINS */
window.VOUINS = window.VOUINS || {};

// v102 multi-lang support
VOUINS.ootbLabelMap = {
    'Step': ['previousLabel', 'nextLabel', 'cancelLabel', 'saveLabel', 'completeLabel',
        'cancelMessage', 'saveMessage', 'completeMessage', 'instructionKey', 'chartLabel', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Text Block': ['textKey'],
    'Headline': ['labelKey'],
    'Submit': ['summaryLabel', 'submitLabel', 'reviseLabel','errorMessage:custom|n:message', 'errorMessage:default'],
    'DataRaptor Extract Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'redirectNextLabel', 'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 
        'postMessage', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Remote Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel',
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Rest Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel',
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'DataRaptor Post Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'redirectNextLabel', 'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 
        'postMessage', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Post to Object Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel',
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Done Action': ['consoleTabLabel', 'errorMessage:custom|n:message', 'errorMessage:default'],
    'Review Action': ['nextLabel', 'previousLabel', 'errorMessage:custom|n:message', 'errorMessage:default'],
    'Filter Block': ['buttonLabel'],
    'Calculation Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel',
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'PDF Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel','redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'DocuSign Envelope Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'DocuSign Signature Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'inProgressMessage', 'failureAbortMessage', 'postMessage', 'errorMessage:custom|n:message', 
        'errorMessage:default'
    ],
    'Type Ahead': ['newItemLabel'],
    'Email Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel','redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'DataRaptor Transform Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'redirectNextLabel', 'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 
        'postMessage', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Matrix Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Integration Procedure Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 
        'redirectNextLabel', 'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 
        'postMessage', 'errorMessage:custom|n:message', 'errorMessage:default'
    ],
    'Edit Block': ['newLabel', 'editLabel', 'deleteLabel'],
    'Delete Action': ['failureNextLabel', 'failureAbortLabel', 'failureGoBackLabel', 'redirectNextLabel', 
        'redirectPreviousLabel', 'inProgressMessage', 'failureAbortMessage', 'postMessage', 
        'remoteConfirmMsg', 'cancelLabel', 'subLabel'
    ],
    'Validation': ['messages|n:text'],
    'Checkbox': ['checkLabel'],
    'Email': ['ptrnErrText'],
    'Number': ['ptrnErrText'],
    'Password': ['ptrnErrText'],
    'Telephone':['ptrnErrText'],
    'Text': ['ptrnErrText'],
    'Text Area': ['ptrnErrText'],
    'URL':['ptrnErrText'],
    'Disclosure': ['checkLabel','textKey'],
    'Script': ['persistentComponent|n:label', 'consoleTabLabel','errorMessage:custom|n:message'],
    'Radio': ['options|n:value'],
    'Select': ['options|n:value'],
    'Multi-select': ['options|n:value'],
    'Radio Group' : ['options|n:value', 'radioLabels|n:value'],
    'File' : ['errorMessage:custom|n:message', 'errorMessage:default'],
    'Image' : ['errorMessage:custom|n:message', 'errorMessage:default'],
    'Lookup' : ['errorMessage:custom|n:message', 'errorMessage:default']
};

VOUINS.ootbLabelMap2 = ['subLabel','remoteConfirmMsg','cancelLabel'];
VOUINS.actionEleTypesBase = ['Remote Action', 'Rest Action', 'DataRaptor Extract Action', 'DataRaptor Post Action', 'Post to Object Action', 'Review Action', 'Done Action', 'Calculation Action', 'PDF Action', 'Set Values', 'Set Errors', 'DocuSign Envelope Action', 'DocuSign Signature Action', 'Email Action', 'DataRaptor Transform Action', 'Matrix Action', 'Integration Procedure Action'];
VOUINS.actionEleTypes = VOUINS.actionEleTypesBase.concat(['Delete Action']);

VOUINS.picklistEleList = ['Select', 'Multi-select', 'Radio'];

VOUINS.getPropToUpdate = function (prop, tokenList) {
    'use strict';
    for (var ind = 0; ind < tokenList.length - 1; ind++) {
        if (tokenList[ind].indexOf('|n') >= 0) {
            tokenList[ind] = tokenList[ind].slice(0, tokenList[ind].length - 2);
        }
        var buildupArray = [];
        if(!prop) return null; //property does not exist in object
        if (Array.isArray(prop)) {
            for (var j = 0; j < prop.length; j++) {
                prop[j] = prop[j][tokenList[ind]];
                if (Array.isArray(prop[j])) {
                    for (var k = 0; k < prop[j].length; k++) {
                        buildupArray.push(prop[j][k]);
                    }
                }
            }
        } else {
            if(prop) {
                prop = prop[tokenList[ind]];
            }
            if (Array.isArray(prop)) {
                for (var l = 0; l < prop.length; l++) {
                    buildupArray.push(prop[l]);
                }
            }
        }
        if (buildupArray.length > 0) {
            prop = buildupArray;
        }
    }
    return prop;
};

/*

Input
    prop : any object
    tokenstr : path syntax used such as :   abc|n:efg
               where abc is a key of the prop object, 
               abc's key is associated with a value of type array (hence the |n)
               n is a digit >= 0
               efg is a property of the object contained inside the array

Output
    pathList : an array of object paths that match the pathStr
*/
VOUINS.createPropPaths = function (prop, pathStr) {
    'use strict';
    var path = "";
    var pathList = [];

    if(typeof pathStr !== "string") return pathList;

    // swap n with regex \d to match digits
    pathStr = pathStr.replace(/[|]n/g,'|\\d');
    // escape the pipe to prevent false positive matches
    pathStr = pathStr.replace(/[|]/g,'\[\|\]');
    var pathStrRegex = new RegExp('^' + pathStr + '$');

    var flatten = function(prop, path) {
        if(!prop)
            return path;

        var keys = Object.keys(prop);
        for(var i = 0; i < keys.length; i++) {
            if(typeof prop[keys[i]] === "object") {
                var symbol = Array.isArray(prop[keys[i]]) ? "|" : ":";
                flatten(prop[keys[i]], path + keys[i] + symbol);
            }
            else {
                var pathFlat = path + keys[i];
                if(pathStrRegex.test(pathFlat)) {
                    pathList.push(pathFlat);
                }
            }
        }

    }

    flatten(prop, path);

    return pathList;
}

},{}],25:[function(require,module,exports){
(function(){
    /*
     * auto fixes the source for img elements in omniout
     */
    'use strict';
    var kModule = angular.module('vlocity-omni-knowledge');
    kModule.directive('vlcSldsOpen', function($compile, bpService, $aria){

        var opInConsole = function openInConsole(sforce, bpService){
            return function openArticleInConsole(article){
                var url = '/articles/' + article.aType + '/' + article.urlName;
                if(bpService.isInConsole) {
                    sforce.console.getEnclosingPrimaryTabId(function (result) {
                        var tabId = result.id;
                        sforce.console.openSubtab(tabId ,
                                                  url,
                                                  true,
                                                  article.title,
                                                  null,
                                                  null,
                                                  'articleSubTab');                                                                                        
                    });
                }
                else if((typeof sforce !== 'undefined') &&
                        (sforce !== null && sforce.one !== undefined && sforce.one !== null)){
                    sforce.one.navigateToURL(url, false);
                } else {
                    window.open(url, '_blank');
                }
            };
        }(window.sforce, bpService);

        return {
            restrict: 'A',
            isOmniOut: false,
            link: function(scope, element, attrs){

                // add aria attrs when supported
                if ($aria){
                    if ($aria.config('bindRoleForClick') && !element.attr('role')) {
                      element.attr('role', 'button');
                    }
                    if ($aria.config('tabindex') && !element.attr('tabindex')) {
                      element.attr('tabindex', 0);
                    }
                    if ($aria.config('bindKeydown') && !attrs.ngKeydown && !attrs.ngKeypress && !attrs.ngKeyup) {
                      element.on('keyup', function(event) {
                        var keyCode = event.which || event.keyCode;
                        if (keyCode === 32) {
                            listener(event);
                        }
                      });
                      element.on('keydown', function(event) {
                        var keyCode = event.which || event.keyCode;
                        if (keyCode === 13) {
                            listener(event);
                        }
                      });
                    }
                }


                var listener = function (){
                    opInConsole(scope.i);  
                };

                element.on('click', listener);

                scope.$on('destroy', function(){
                    element.off('click', listener);
                });
            }
        };
    });
}());

                      
                      

},{}],26:[function(require,module,exports){
(function(){
    'use strict';
    angular.module('vlocity-omni-knowledge', []);
}());

require('./directives/vlcSldsOpen.js');

},{"./directives/vlcSldsOpen.js":25}],27:[function(require,module,exports){
(function(){
    /*
      * auto fixes the source for img elements in omniout
     */
    'use strict';
    var omniOut = angular.module('vlocity-omni-out');
    omniOut.directive('img', ['$q',function($q){
        return {
            restrict: 'E',
            link: function(scope, element, attrs){
                var rootScope = scope.$root;
                //this is for contents from tinymce
                var sString = attrs.src||attrs.ngSrc;

                function reloadImage(resolve,reject){
                    if (attrs.hasOwnProperty('src'))
                        attrs.$set('src',attrs.src + "&time=" + new Date());
                }

                //OMNI-2173
                if (!sString) {
                    return ;
                }

                if(!scope.instanceHost) {
                    scope.instanceHost = scope.$root.instanceHost || null;
                }

                if (scope.instanceHost) {
                    //attrs.$set('src', sString.replace('..', scope.instanceHost));
                    //forr src with interpolations we can't
                    //change the src attribute in house
                    setTimeout(function(){
                        attrs.$set('src', sString.replace('..', scope.instanceHost));
                    });
                }
            }
        };
    }]);
}());

},{}],28:[function(require,module,exports){
(function(){
    /*
     * external url handling from the knowledge component
     */
    'use strict';
    var oModule = angular.module('vlocity-omni-out');
    oModule.directive('vlcSldsOpen', function(bpService){

        var opInConsole = function openInConsole(){
            return function openArticleInConsole(article, instance){
                var url = '/articles/' + article.aType + '/' + article.urlName;
                url = instance + url;
                window.open(url, '_blank');
            };
        }();

        return {
            restrict: 'A',
            isOmniOut: true,
            link: function(scope, element, attrs){

                var listener = function (){
                    opInConsole(scope.i, scope.instanceHost);  
                };

                element.on('click', listener);

                scope.$on('destroy', function(){
                    element.off('click', listener);
                });
            }
        };
    });
}());

                      
                      

},{}],29:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('vlocity-omni-out', []);
}());

require('./directives/vlcSldsImage.js');
require('./directives/vlcSldsOmniOutOpen.js');
require('./run/cordovaKeyboardHandler.js');

/* fix for scrolling Card's and omniscript in Salesforce1 iframe */
var a = navigator.userAgent;
if ((a.indexOf('Salesforce') != -1) && (a.indexOf('iPhone') != -1 || a.indexOf('iPad') != -1) && (a.indexOf('Safari') == -1)) {
    var s = document.createElement('style');
    s.innerHTML = "html,html body{overflow:scroll;-webkit-overflow-scrolling:touch;zindex:0;}body{position:absolute;left:0;right:0;top:0;bottom:0;}";
    document.getElementsByTagName('head')[0].appendChild(s);
}

},{"./directives/vlcSldsImage.js":27,"./directives/vlcSldsOmniOutOpen.js":28,"./run/cordovaKeyboardHandler.js":30}],30:[function(require,module,exports){
(function () {
    /*
     * fixes the keyboard dismiss issue after the momentum scrolling fix was introduced
     */
    'use strict';
    var omniOut = angular.module('vlocity-omni-out');
    omniOut.run(function () {
        var isNative = /(ip[ao]d|iphone|android)/ig.test(window.navigator.userAgent);
        var isTouch = ('createTouch' in window.document || 'ontouchstart' in window.document) && isNative;

        if (!isTouch) {
            return;
        }

        var type = null;
        var list = {
            'Type Ahead': 1,
            'Lookup': 1
        };
        /*
        * scrolls elements like typeahead and lookup to the top of screen
        * because they do not usually trigger keyboard to show up
        */
        window.addEventListener('click', function (evt) {

            if (evt.target.nodeName.toLowerCase() === 'input') {
                try {
                    type = angular.element(evt.target).scope().control.type || angular.element(evt.target).scope().$parent.control.type;
                    if (type in list) {
                        evt.target.scrollIntoView();
                    }
                }
                catch (e) { }
            }
        });

    });
}());

},{}],31:[function(require,module,exports){
//Overriding window.alert
(function () {
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.decorator('$window', ['$delegate', '$injector', function ($delegate, $injector) {
        var windowDecorate = {};

        // saving old versions of functions to support non-lightning mode and allow access when needed
        if (!$delegate.oldAlert) {
            windowDecorate.oldAlert = $delegate.alert;
            windowDecorate.oldConfirm = $delegate.confirm;
            windowDecorate.oldPrompt = $delegate.prompt;
        } else {
            windowDecorate.oldAlert = $delegate.oldAlert;
            windowDecorate.oldConfirm = $delegate.oldConfirm;
            windowDecorate.oldPrompt = $delegate.oldPrompt;
        }

        windowDecorate.alertPromise = function (message, alertType, resp) {
            var dialog = $injector.get('$vlcDialog')({
                content: message.toString(),
                scopeVars: {
                    alertType: alertType,
                    resp: resp,
                    message: message
                }
            });
            return dialog.deferred.promise;
        };

        // these accessor functions return promises that resolve with the alert response
        windowDecorate.alert = function (message) {
            return windowDecorate.alertPromise(message, 'Alert');
        };
        windowDecorate.confirm = function (message) {
            return windowDecorate.alertPromise(message, 'Confirm');
        };
        windowDecorate.prompt = function (message, resp) {
            return windowDecorate.alertPromise(message, 'Prompt', resp);
        };

        console.log('Overriding window alert functions, these can still be accessed by prefixing the function name with the word \'old\'');


        //***********************START NEW SECTION FOR IFRAME RESIZER HANDLING***********************//

        // iFrameResizer Handling
        (function ($delegate) {
            // escape if decorator has already run
            if ($delegate.vlocIFrameResizeHandler) {
                return;
            }

            // offset hardcoded from LEX header height
            var scrollOffset;
            if ($delegate.sfdcVars.urlParams.scrollOffset) {
                if ($delegate.sfdcVars.urlParams.scrollOffset === "" || $delegate.sfdcVars.urlParams.scrollOffset === "undefined") {
                    scrollOffset = {
                        x: 0,
                        y: 90
                    };
                } else if (!isNaN($delegate.sfdcVars.urlParams.scrollOffset)) {
                    scrollOffset = {
                        x: 0,
                        y: $delegate.sfdcVars.urlParams.scrollOffset * 1
                    };
                }
            }

            $delegate.vlocIFrameResizeHandler = $delegate.vlocIFrameResizeHandler || {};

            setupPublicMethods();
            setupHandler();

            function setupHandler() {
                // Setup iFrameResizer object with callback decorators
                if ('parentIFrame' in $delegate) {
                    handler();
                } else {
                    $delegate.iFrameResizer = $delegate.iFrameResizer || {};
                    // Writing to window.iFrameResizer.readyCallback is the approach provided by iFrameResizer's API to launching a callback on ready
                    $delegate.iFrameResizer.readyCallback = wrapReadyCallback;
                }
            }

            function wrapReadyCallback() {
                // Wrap existing callback (if any) and also fire hanlder
                var prev = $delegate.iFrameResizer;
                if (prev && prev.readyCallback && typeof prev.readyCallback === 'function' && prev.readyCallback !== wrapReadyCallback) {
                    prev.readyCallback();
                }
                handler();
            }

            function handler() {
                document.body.classList.add('iframeresizer--child');
                var styleFixEl = document.createElement('style');
                styleFixEl.type = 'text/css';
                styleFixEl.appendChild(document.createTextNode('.iframeresizer--child .via-nds #alert-container { height: auto; }'));
                var head = document.head || document.getElementsByTagName('head')[0];
                head.appendChild(styleFixEl);
                overridePublicMethods();
                setConsoleTabAndIcon();
            }

            function setupPublicMethods() {
                Object.assign($delegate.vlocIFrameResizeHandler, {
                    scrollTo: function (x, y) {
                        return $delegate.scrollTo(x, y);
                    },
                    scrollToEle: function (element) {
                        if (typeof element === 'string') {
                            element = document.getElementById(element);
                        }
                        if (!element) return;
                        this.scrollTo(0, element.getBoundingClientRect().top);
                    },
                    // specifically makes #VlocityBP to scroll content to top (on mobile)
                    scrollEleToTop: function (element) {
                        if (typeof element === 'string') {
                            element = document.getElementById(element);
                        }
                        if (!element) return;
                        element.scrollIntoView();
                    }
                });
                $delegate.vlocScrollToEle = function (element) {
                    return this.vlocIFrameResizeHandler.scrollToEle(element);
                };
                $delegate.vlocScrollEleToTop = function (element) {
                    return this.vlocIFrameResizeHandler.scrollEleToTop(element);
                };
            }

            function overridePublicMethods() {
                Object.assign($delegate.vlocIFrameResizeHandler, {
                    scrollTo: function (x, y) {
                        if (scrollOffset)
                            return $delegate.parentIFrame.scrollToOffset(x - scrollOffset.x, y - scrollOffset.y);
                        else
                            return $delegate.parentIFrame.scrollTo(x, y);
                    }
                });
            }

            function setConsoleTabAndIcon() {
                if ('parentIFrame' in window && (sfdcVars.urlParams.omniIframeEmbedded == "true" || sfdcVars.urlParams.omniIframeEmbedded == true) && typeof scope !== "undefined" && scope && scope.bpTree && scope.bpTree.propSetMap) {
                    if (scope.bpTree.propSetMap.consoleTabTitle) {
                        parentIFrame.sendMessage({
                            message: 'ltng:setConsoleTabLabel',
                            label: scope.bpTree.propSetMap.consoleTabTitle
                        });
                    }
                    if (scope.bpTree.propSetMap.consoleTabIcon) {
                        parentIFrame.sendMessage({
                            message: 'ltng:setConsoleTabIcon',
                            icon: scope.bpTree.propSetMap.consoleTabIcon
                        });
                    }
                }
            }

        })($delegate);

        //************************END NEW SECTION FOR IFRAME RESIZER HANDLING************************//


        Object.assign($delegate, windowDecorate);
        return $delegate;
    }]);


    if (sfdcVars.layout === 'lightning' || sfdcVars.layout === 'newport') {
        bpModule.decorator('$sldsModal', ['$delegate', '$window', 'uiStateService', function ($delegate, $window, uiStateService) {
            return function (config) {



                function initScopeLog (scope) {
                    scope.actionLogs = {
                        actions: [],
                        asyncActions: [],
                        baseflag: $rootScope.loading
                    };

                    Object.defineProperty(scope,"loading",{
                        set: function(val){
                            this.actionLogs.baseflag = val;
                            if (!val){
                                this.actionLogs.basemsg = "";
                            }
                        },
                        get: function(){
                            return this.actionLogs.baseflag || this.actionLogs.actions.length > 0;
                        }
                    });
                }

                var _onShow = config.onShow;
                config.onShow = function wrapOnShow($vlcModal) {
                    if (_onShow && typeof _onShow === 'function') {
                        _onShow($vlcModal);
                    }
                    uiStateService.logBlocker($vlcModal);
                    if ('parentIFrame' in $window) {
                        scrollToTop($vlcModal);
                    }
                };

                function scrollToTop() {
                    if ('vlocIFrameResizeHandler' in $window) {
                        $window.vlocScrollToEle('VlocityBP');
                    }
                }
                return $delegate(config);
            };

        }]);
    }
}());

},{}],32:[function(require,module,exports){
(function(){
    /* jshint -W030 */
    /* this directive decorates the the bpService remote call invoke function */
    'use strict';
    
    var bpModule = angular.module('vlocity-business-process');

    bpModule.config(function($provide){
        var oPlayerUtil = window.oPlayerUtil;

        $provide.decorator('bpService', function($delegate){
            var injector = angular.injector(['ng']);
            var q = injector.get('$q');
            var rScope = injector.get('$rootScope');

            //when the app is loaded in the preview window in the designer window
            if(/previewEmbedded=true/.test(window.location.href)){
                $delegate.debug = true;
            }

            if (!$delegate.debug){
                console.log('in the normal preview mode do not do anything to the service ');
                return $delegate;
            }

            //none of this code is going to get executed if the the mode is debug
            //decorating the service to log the remote calls 
            var ofunction = $delegate.GenericInvoke;
            $delegate.GenericInvoke = function(){
                var deferred = q.defer();
                var element;

                //remove the last arguement in case its is {label : elementName}
                var lastObject = arguments[arguments.length - 1];
                if (lastObject && lastObject.label){
                    element = [].splice.call(arguments, -1, 1);
                    element = element[0];
                }else{
                    element = {
                        label: 'Element'  //this is just a placeholder
                    }
                }

                if ($delegate.debug){
                    var requestObject = {
                            element: element,
                            args: arguments
                    };
                    window.parent.postMessage(angular.toJson(requestObject), '*');
                }

                ofunction.apply($delegate,arguments).then(function(result){
                    if ($delegate.debug){
                        var resultObject = {
                            element: element,
                            response: (function(){
                                try{
                                    var resultObj = angular.fromJson(result);
                                    //Named credential uses this node from the response
                                    return (resultObj.NCCallresp && angular.fromJson(resultObj.NCCallresp)) || resultObj;
                                }
                                catch(exception){
                                    console.log('NCCallResp was invalid');
                                    return resultObj;
                                }
                            }())
                        };
                        if (element){
                            window.parent.postMessage(angular.toJson(resultObject), '*');
                        }
                    }
                    //fix for the generic Invoke
                    rScope.$apply(function(){
                      deferred.resolve(result);
                    });
                }, function(error){

                    var errResult = {
                        element: element,
                        response: angular.fromJson(error)
                    };
                    if (element){
                        window.parent.postMessage(angular.toJson(errResult), '*');
                    }

                    rScope.$apply(function(){
                      deferred.resolve(error);
                    });
                });

                return deferred.promise;
            };
            
            console.log('bpService was decorated to include the debug feature.....');
            return $delegate;
        });
    });
}());

},{}],33:[function(require,module,exports){
var bpModule = angular.module('vlocity-business-process');
bpModule.config(['$controllerProvider','$windowProvider','$filterProvider','$provide','$compileProvider', function($controllerProvider, $windowProvider, $filterProvider, $provide, $compileProvider) {
    'use strict';
    $windowProvider.$get().vlocity  = $windowProvider.$get().vlocity || {};
    $windowProvider.$get().vlocity.cardframework = $windowProvider.$get().vlocity.cardframework || {};
    //set registerModule method to be global
    $windowProvider.$get().vlocity.cardframework.registerModule =
    {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service
    };
}]);

// Dependency fix for classic player
if(sfdcVars.layout === 'lightning'){
    bpModule.config(['$localizableProvider', function($localizableProvider) {
        'use strict';
        if (window.customLabels) {
            $localizableProvider.setLocalizedMap(window.customLabels);
        }
    }]);
}
},{}],34:[function(require,module,exports){
(function(){
    /*
      This service decorates forcetk Client when run within the designer view
      This service does not provide any api that the angular application can use
    */
    'use strict';

    var bpModule = angular.module('vlocity-business-process');
    bpModule.config(function($windowProvider){

        if(!(/previewEmbedded=true/.test(window.location.href))){
            console.log('script is running in the normal mode do not do anything to forcetkClient');
            return;
        }

        var injector = angular.injector(['ng']);
        var q = injector.get('$q');

        var forceClient = window.forceTKClient;

        if (!forceClient) {
            console.log('forceTKClient not initiliase globally');
        }

        var oSCallback;
        var oECallback;
        var element;
        function postMessageToWindow(jqXR, object){
            var resultObject = {
                element: object,
                response: (function(){
                    try{
                        return angular.fromJson(jqXR.responseText);
                    }catch(e){
                        return {error: e.message};
                    }
                }())
            };

            if (object){
                window.parent.postMessage(angular.toJson(resultObject), '*');
            }
        }

        var ofunction = forceClient.apexrest;

        forceClient.apexrest = function(rClassName, sCallback, eCallback, rMethodName, input){
            var self = this;

            var deferred = q.defer();

            //remove the last arguement in case its is {label : elementName}
            if (arguments[arguments.length - 1] && arguments[arguments.length - 1].label){
                element = [].splice.call(arguments, -1, 1);
                element = element[0];
                element.type = 'apex';
            }else{
                element = {
                    label: 'ApexRestElement',
                    type: 'apex'
                };
            }

            //post a message to the debug console window
            var requestObject = {
                element: element || '',
                //rClassName, rMethodName, rOptions, input - no value for rOptions in this case
                args: [rClassName, rMethodName, input, '']
            };

            window.parent.postMessage(angular.toJson(requestObject), '*');

            //overriding the success and failure callbacks
            oSCallback = sCallback;
            arguments[1] = function(){
                console.log('success callback');
                postMessageToWindow(arguments[2],element);
                //deferred.resolve(arguments);
                oSCallback.apply('', arguments);
            };

            oECallback = eCallback;
            arguments[2] = function(){
                console.log('error callback');
                postMessageToWindow(arguments[0], element);
                //deferred.reject(arguments);
                oECallback.apply('', arguments);
            };
            
            ofunction.apply(self, arguments).then(function(data){
                deferred.resolve(data);
            }, function(error){
                deferred.resolve(error);
            });
            return deferred.promise;
        };

    });
}());

},{}],35:[function(require,module,exports){
//http interceptors for external rest actions
//this will only run in the preview mode
(function(){
    //this service will intercept all the requests from the angular app using $http service
    //and log the ones for external web credentials
    'use strict';
    if(!(/previewEmbedded=true/.test(window.location.href))){
        console.log('script is running the normal mode do nothing to http service');
        return;
    }

    var element;
    var dModule = angular.module('vlocity-business-process');
    dModule.factory('vlcInjector', function(){
        var vlcInjector = {};
        vlcInjector.request = function(config){
            if (!config ||  !config.label){
                console.log('no label for the element was passed : skip request transformation');
                return config ; //we are not interested in calls without element label
            }
            element = {
                label: config.label,
                type: 'web'
            };

            var request = angular.extend({'params':config.params}, {'headers': config.headers});
            var requestObject = {
                element: element,
                args: [config.url, config.method,request,'']
            };

            console.log('inside debug request');

            //these calls will be made as soon as the app starts up
            window.parent.postMessage(angular.toJson(requestObject), '*');
            return config;
        };

        vlcInjector.responseError = function(response){

            if (!response.config || !response.config.label){
                console.log('no label for the element was passed : skip response transformation');
                return response;
            }
            var responseObject = {
                element: element,
                response: angular.fromJson(response.data)
            };
            console.log('inside debug response error');
            window.parent.postMessage(angular.toJson(responseObject), '*');
            element = null;
            return response;
        };

        vlcInjector.response = function(response){

            if (!response.config || !response.config.label){
                console.log('no label for the element was passed : skip response transformation');
                return response;
            }

            var responseObject = {
                element: element,
                response: angular.fromJson(response.data)
            };
            console.log('inside debug response new');
            window.parent.postMessage(angular.toJson(responseObject), '*');
            element = null;
            return response;
        };
        
        return vlcInjector;
    });
}());

//configuring the interceptor
(function(){
    'use strict';
    if(!(/previewEmbedded=true/.test(window.location.href))){
        console.log('script is running the normal mode do nothing http service interceptor');
        return;
    }

    var dModule = angular.module('vlocity-business-process');
    dModule.config(function($httpProvider){
        $httpProvider.interceptors.push('vlcInjector');
    });
    
}());

},{}],36:[function(require,module,exports){
(function() {
    'use strict';
    var bpModule = angular.module('vlocity-business-process');
    bpModule.config(function($compileProvider){
        bpModule.directives = $compileProvider;
    });
}());

},{}],37:[function(require,module,exports){
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.config(function($locationProvider) {
        $locationProvider.hashPrefix('');
    });
}());

},{}],38:[function(require,module,exports){
(function(){
    'use strict';
    var bpModule = angular.module('vlocity-business-process');
    var sarissa  = window.Sarissa;
    
    /* The below is to workaround issues with Sarissa, an AJAX wrapper for IE that Salesforce uses.
     * We need to use the standard XMLHTTPRequest within Angular for Ajax calls when Sarissa is loaded.
     */
    bpModule.decorator("$xhrFactory", [
        "$delegate", "$rootScope",
        function($delegate, $rootScope) {
            return function(method, url) {
                if (sarissa && sarissa.originalXMLHttpRequest) {
                    return new sarissa.originalXMLHttpRequest();
                }
                return $delegate(method, url);
            }
        }
    ])
}());

},{}],39:[function(require,module,exports){
//Overriding window.alert
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.provider('$vlcDialog', function () {

        var defaults = this.defaults = {
            templateUrl: 'vlcAlertModal.html',
            show: true,
            size:'lg',
            msg: "Are you sure?",
            backdrop: 'static',
            submitLabel: customLabels.OmniOK,
            cancelLabel: customLabels.OmniCancel
        };

        this.$get = function ($window, $timeout, $q, $injector, $sce, $rootScope) {
            function VlcDialogFactory (config) {
                //Instance specific vars and methods
                var $vlcDialog = {};
                var deferred = $q.defer();
                var scopeVars = config.scopeVars;

                //Default to window.alert in classic
                if(sfdcVars.layout !== 'lightning' && sfdcVars.layout !== 'newport'){
                    $timeout(function(){
                        scopeVars.resp = $window['old'+scopeVars.alertType].call($window,config.content,scopeVars.resp);
                        if (scopeVars.resp === undefined)
                            scopeVars.resp = true;
                        else if (scopeVars.resp === null)
                            scopeVars.resp = false;
                        deferred.resolve(scopeVars.resp);
                    });
                $vlcDialog.deferred = deferred;
                    return $vlcDialog;
                }

                $vlcDialog = $injector.get('$sldsModal')(angular.extend({}, defaults, config));

                $vlcDialog.deferred = deferred;
                
                var options = $vlcDialog.$options;
                var scope = $vlcDialog.$scope;

                angular.forEach(['title', 'content', 'titleKey', 'warning', 'error', 'cancelLabel','submitLabel'], function (key) {
                  if (options[key]) {
                        scope[key] = options[key];
                    }
                });

                Object.assign(scope, scopeVars);

                scope.input = scope.resp;

                // Auto title and Error handling
                if (scope.message instanceof Error){
                    // custom label now used for prepended text before content
                    scope.content = customLabels['OmniError'] + " : " + scope.message.message;
                    scope.error = true;
                }
                scope.title = scope.title||customLabels['Omni'+(scope.titleKey=scope.error?'Error':scope.titleKey||scope.alertType)]||scope.titleKey;

                // Scope methods
                scope.submit = function() {
                    scopeVars.resp = scope.alertType=='Prompt'?scope.$$childHead.$$childHead.input:true;
                    scope.$hide();
                    deferred.resolve(scopeVars.resp);
                };

                scope.cancel = function() {
                    scope.$hide();
                    deferred.resolve(false);
                };

                return $vlcDialog;
            }

            VlcDialogFactory.defaults = defaults;
            return VlcDialogFactory;
        };
    }).directive('ngConfirmClick', ['$parse','$window', '$vlcDialog', '$sce'].concat(/lightning|newport/.test(sfdcVars.layout)?['$aria']:[]).concat(function($parse,$window,$vlcDialog,$sce,$aria) {
        return {
            link: function (scope, element, attr) {
                var fn = $parse(attr.confirmedClick, /* interceptorFn */ null, /* expensiveChecks */ true);
                var msg = attr.ngConfirmClick || "Are you sure?";

                // Directive config
                var options = {scope: scope};
                angular.forEach(['templateUrl', 'contentTemplate', 'backdrop', 'keyboard', 'html', 'container', 'id', 'vlocSlide', 'vlocSlideCustomClass', 'vlocSlideMobileClose', 'vlocSlideHeader', 'vlocSlideFooter', 'error', 'warning', 'titleKey', 'prefill', 'submitLabel', 'cancelLabel'], function (key) {
                    if (angular.isDefined(attr[key])) options[key] = attr[key];
                });

                // use string regex match boolean attr falsy values, leave truthy values be
                var falseValueRegExp = /^(false|0|)$/i;
                angular.forEach(['backdrop', 'keyboard', 'html', 'container'], function (key) {
                    if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
                });

                // Support scope as data-attrs
                angular.forEach(['title', 'content'], function (key) {
                    if (attr[key]) {
                        attr.$observe(key, function (newValue, oldValue) {
                            scope[key] = newValue;
                        });
                    }
                });

                // add aria attrs when supported
                if ($aria){
                    if ($aria.config('bindRoleForClick') && !element.attr('role')) {
                      element.attr('role', 'button');
                    }
                    if ($aria.config('tabindex') && !element.attr('tabindex')) {
                      element.attr('tabindex', 0);
                    }
                    if ($aria.config('bindKeydown') && !attr.ngKeydown && !attr.ngKeypress && !attr.ngKeyup) {
                      element.on('keyup', function(event) {
                        var keyCode = event.which || event.keyCode;
                        if (keyCode === 32) {
                            confirmCallback(event);
                        }
                      });
                      element.on('keydown', function(event) {
                        var keyCode = event.which || event.keyCode;
                        if (keyCode === 13) {
                            confirmCallback(event);
                        }
                      });
                    }
                }

                options = angular.extend({},options,{
                    content: msg.toString(),
                    scopeVars: {
                            alertType: 'Confirm',
                            message: msg,
                            resp:options.prefill
                    },
                    
                });

                function confirmCallback(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $vlcDialog(options).deferred.promise.then(function(resp){
                        if(resp){
                            scope.$applyAsync(fn);
                        }
                    });
                }

                element.on('click', confirmCallback);
            }
       };
    }));
}());
},{}],40:[function(require,module,exports){
(function(){
    'use strict';
    angular.module('vlocity-business-process')
        .directive('preventEnterSubmit', function (bpService) {
            return {
                restrict:'A',
                link:function (scope,el, attrs){
                    if ( bpService.layout === 'lightning' || bpService.layout === 'newport'){
                        return;
                    }

                    el.bind('keydown', function (event) {

                        if (event.target.type === 'textarea') {
                            return true;
                        }
                            
                        if (13 == event.which && (!event.target.attributes['vlc-slds-only-numeric'])) {
                            return false;
                        }
                    });
                }
            };
        });
}());

},{}],41:[function(require,module,exports){
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcPreventParentScroll', function($timeout){
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var lastYDir, curYDir;

                element.bind('mousewheel', function (e) {
                    var $this = $(this),
                        scrollTop = this.scrollTop,
                        scrollHeight = this.scrollHeight,
                        height = $this.height(),
                        deltaScroll = (e.type == 'DOMMouseScroll' ? e.originalEvent.detail * -40 : e.originalEvent.wheelDelta),
                        upScroll = deltaScroll > 0; 

                    if (!upScroll && -deltaScroll > scrollHeight - height - scrollTop) {
                        $this.scrollTop(scrollHeight);
                        return preventScroll(e);
                    } else if (upScroll && deltaScroll > scrollTop) {
                        $this.scrollTop(0);
                        return preventScroll(e);
                    }
                });

                element.bind('touchstart', function (e) {
                    lastYDir = e.originalEvent.touches[0].clientY;
                });

                element.bind('touchmove', function (e) {
                    var $this = $(this),
                        scrollTop = this.scrollTop,
                        scrollHeight = this.scrollHeight,
                        height = $this.height(),
                        upScroll; 
                        curYDir = e.originalEvent.touches[0].clientY;

                    if(!(/mobile|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())))
                        return;

                    if(curYDir > lastYDir)
                        upScroll = false;
                    else if(curYDir < lastYDir)
                        upScroll = true;

                    if(!upScroll && scrollTop <= 0) {
                        $this.scrollTop(0);
                        return preventScroll(e);
                    } else if(upScroll && (scrollTop + 25 >= scrollHeight - height)) {
                        $this.scrollTop(scrollHeight);
                        return preventScroll(e);
                    }

                });

                function preventScroll(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                };

            }
        };
    });

}());
},{}],42:[function(require,module,exports){
/*custom directive for right panel */
(function(){
    'use strict';
    var bpModule = angular.module('vlocity-business-process');
    bpModule.directive('vlcSldsRightPanel', function($sce, $compile){
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'vlcSldsRightPanel.html'
        };
    });
}());

},{}],43:[function(require,module,exports){
/*custom directive for banner */
(function(){
    'use strict';
    var bpModule = angular.module('vlocity-business-process');
    bpModule.directive('vlcSldsBanner', function(){
        return{
            restrict: 'E',
            replace: true,
            templateUrl: function(elem, attrs){
                return attrs.src || 'vlcSldsHeadingBanner.html';
            }
        };
    });
}());    

},{}],44:[function(require,module,exports){
/*
* 1.This directive changes the template from ootb to inline incase showInputWidth is true
* 2.In case the control is overridden with custom template and show INput width is set to true
*   it will do nothing
*/
(function(){
    'use strict';
    var templateMaps = {
        cTypes: {
            'Date/Time (Local)':"Datetime-local",
            'Telephone':"Tel",
            'Text Area':"Textarea",
            'Aggregate':"Formula",
            'Type Ahead':"TypeAhead",
            'Filter':"FilterItemSelect"
        },
        
        type: function(control){
            if (control.type  in this.cTypes){
                return this.cTypes[control.type];
            }else{
                return control.type;
            }
        }
    }
    var bpModule = angular.module('vlocity-business-process');
    bpModule.directive('vlcSldsChangeInlineTemplates' ,function($compile, $parse, $templateCache){
        return {
            restrict:'A',
            priority:'-1',
            link: function (scope, element, attrs){
                // OMNI-2699
                var bShowInputWidth = false;
                if(scope.bpTree.propSetMap.showInputWidth === true) {
                    bShowInputWidth = true;
                }   
                else {
                    bShowInputWidth = $parse(attrs.vlcSldsChangeInlineTemplates)(scope);
                }

                var control = scope.child.eleArray[0];
                if (bShowInputWidth === true){
                    control.propSetMap.HTMLTemplateId = control.propSetMap.HTMLTemplateId || (function(){
                        if(/Filter/.test(control.type) && /Multi-select/.test(control.propSetMap.type))
                            return;
                        var id = ["altVlc",templateMaps.type(control), ".html"].join('');
                        if ($templateCache.get(id)){
                            return id;
                        }else{
                            return control.propSetMap.HTMLTemplateId;
                        }
                    }());
                }
            }
        };
    });
}());

},{}],45:[function(require,module,exports){
/*
 * This date and datetime picker control
 * displays the native date / date time picker on touch based devices
 */
(function(){
    'use strict';
    var bpModule = angular.module('vlocity-business-process');
    bpModule.directive('vlcSldsDatePicker', function(dateFilter, $window){
        var moment = window.moment;
        var isNative = /(ip[ao]d|iphone|android)/ig.test($window.navigator.userAgent);
        var isTouch = ('createTouch' in $window.document || 'ontouchstart' in $window.document) && isNative;

        if (!isTouch){
            var rtl = angular.element('html').css('direction');
            var dfn = $.fn.datepicker;
            // Register Custom Labels for Air Datepicker localization, missing props use english values
            dfn.language.customLabels = Object.assign({},dfn.language.en);
            Object.assign(dfn.language.customLabels,JSON.parse(customLabels.OmniDatepickerConfig));
        }

        function modelFormat(mFormat){
            var modelFormat = mFormat;
            return modelFormat && modelFormat.toUpperCase();
        }

        // converts time format from moment.js to Air Datepicker
        function convertTimeFormat(timeFormat){
            return timeFormat?timeFormat.replace(/H/g,'h').replace(/m/gi,'i').replace(/a/i,'$&$&'):undefined;
        }

        function formatDate(dateFormat, timeFormat,isDateTimePicker){
            timeFormat = timeFormat?timeFormat:'hh:mm a';
            var tFormatAir = timeFormat.replace(/H/g,'h').replace(/m/gi,'i').replace(/a/i,'$&$&');


            if (timeFormat !== undefined && typeof timeFormat == 'string'){
                // force all 'M's to lower case
                timeFormat = timeFormat.replace(/M/g,'m');
                // force 24 hour format in absence of day period
                if (timeFormat.match(/a/i) === null){
                    timeFormat = timeFormat.replace(/h/ig,'H');
                }
            }


            if (dateFormat){
                return  (function(dFormat,tFormat){
                    if (isDateTimePicker){
                        return dFormat.toUpperCase() + ' ' + timeFormat;
                    }else{
                        return dFormat.toUpperCase();
                    }
                }(dateFormat.replace(/ hh:mm a$/,'')));
            } else {
                return 'yyyy/mm/dd'.toUpperCase();
            }
        }

        return{
            restrict: 'A',
            require: 'ngModel',
            scope: false,
            link: function(scope, element, attrs, ngModelCtrl){
                var temp;
                var rDate;
                var fDate;
                var dFormat = scope.control ? scope.control.propSetMap.dateFormat : scope.dateFormat;
                var tFormat = scope.control ? scope.control.propSetMap.timeFormat : scope.timeFormat;

                var isDateTimePicker = (attrs.vlcSldsDatePicker === 'Date/Time (Local)') ||(/hh:mm a/.test(dFormat));
                var modelFormat = typeof (temp = attrs.vlcSldsModelDateFormat) == 'string'?temp.toUpperCase():temp;
                var isString = /string/.test(attrs.vlcSldsDateType);
                var format = formatDate(dFormat,tFormat,isDateTimePicker);


                if (isTouch){
                    element.attr('readonly', 'readonly');
                    //jquery 1.8 hack - does not change attributes - using props instead
                    if (isDateTimePicker){
                        element.prop('type', 'datetime-local');
                    }else{
                        element.prop('type', 'date');
                    }

                    format = isDateTimePicker? 'YYYY-MM-DDTHH:mm': 'YYYY-MM-DD';

                    ngModelCtrl.$formatters.unshift(function (modelValue) {
                        if (modelValue){
                            var newModelValue = moment(modelValue).format(format);
                            if(newModelValue !== 'Invalid date') {
                              return newModelValue;
                            }
                        }
                        return modelValue;
                    });

                    var pFunction  = (function(){
                        if (isString){
                            return function(viewValue){
                                return viewValue || null;
                            };
                        }
                        return function(viewValue){
                            if (viewValue){
                                return moment(viewValue).toISOString();
                            }
                            return null;
                        };
                    }());

                    ngModelCtrl.$parsers.unshift(pFunction);

                    return;
                }

                var config = {
                    language: "customLabels",
                    position: (function(){
                        if (rtl === 'rtl'){
                            return 'bottom right';
                        }else{
                            return 'bottom left';
                        }
                    }()),
                    autoClose: false,
                    keyboardNav: false,
                    startDate: new Date(),
                    clearButton: true,
                    onSelect: function(formattedDate, date, inst){
                        fDate=(rDate=moment(date)).isValid()?(rDate).format(format):'';
                        element.val(fDate);
                        ngModelCtrl.$setViewValue(fDate);
                    },
                    timepicker: isDateTimePicker,
                    timeFormat: convertTimeFormat(tFormat)
                };

                var datepicker = dfn.call(element, config).data('datepicker');

                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    console.log('formatters are running: ' + modelValue);

                    if (modelValue && modelValue !== null && modelValue !== 'Invalid Date'){
                        if (isString){
                            rDate = moment(modelValue,modelFormat,true);
                        }else{
                            rDate = moment(modelValue);
                            datepicker.selectDate(modelValue._d);
                        }
                        return rDate.format(format);
                    }
                });

                ngModelCtrl.$parsers.unshift(function(viewValue) {
                    console.log('date parsers run: ' + viewValue + ' after run');
                    var fromPicker = true;
                    if (rDate.format(format) != viewValue) {
                        rDate  = moment(viewValue, format, true);
                        fromPicker = false;
                    }
                    if (rDate.isValid()){
                        ngModelCtrl.$setValidity('valid', true);

                        if(!fromPicker){
                            datepicker.date=rDate._d;
                            datepicker.selectDate(rDate._d);
                        }

                        if (isString){
                            return rDate.format(modelFormat);
                        }else{
                            return rDate._d;
                        }
                    }else{
                        if (viewValue !== ''){
                            ngModelCtrl.$setValidity('valid', false);
                        }else{
                            ngModelCtrl.$setValidity('valid', true);
                        }
                        return null;
                    }
                });

                if($(element).parents('.vlc-slds-edit-block--modal').length > 0) {
                    element.bind('click', function(event) {
                        config.position = (function(){
                            if($window.editBlockModalDate) {
                                if (rtl === 'rtl'){
                                    if($window.editBlockModalDate.position === 'openTop')
                                        return 'top right';
                                    else if($window.editBlockModalDate.position === 'openBottom')
                                        return 'bottom right';
                                }else{
                                    if($window.editBlockModalDate.position === 'openTop')
                                        return 'top left';
                                    else if($window.editBlockModalDate.position === 'openBottom')
                                        return 'bottom left';
                                }
                            }
                        }());
                        dfn.call(element, config);
                    });
                }
            }
        };
    });
}());


},{}],46:[function(require,module,exports){
/* disables auto complete on input forms  - esp for chrome
 *  should be used on input 
 */
(function(){
    'use strict';
    /*the purpose of this directive is to cancel the bubbling of scrolling events
      this could be extended for other events in the future by passing attributes*/
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcDisableAutoComplete', function(){
        return {
            restrict: 'A',
            scope:false,
            link: function(scope, elem, attrs){
                elem.attr('autocomplete', 'off');
                elem.attr('readonly', 'true');
            }
        };
    });

}());


/*
 * This directive disables autocomplete on forms
 */
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsDisableAutoComplete', function(){
        return{
            restrict: 'A',
            compile: function(element, attrs){
                element.attr('autocomplete', 'off');
                element.attr('autocorrect', 'off');
                element.attr('autocapitalize', 'off');
                element.attr('spellcheck', 'false');
            }
        };
    });
}());

},{}],47:[function(require,module,exports){
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsEditBlockModal', function($window) {
        return {
            restrict: 'A',
            scope:false,
            link: function(scope, elem, attrs) {
                elem.bind('mousedown', function(event) {
                    var modalHeight = $(elem).height();
                    var clickY = event.clientY;
                    $window.editBlockModalDate = {};
                    if(modalHeight/2 >= clickY)
                        $window.editBlockModalDate.position = 'openBottom';
                    else if(modalHeight/2 < clickY)
                        $window.editBlockModalDate.position = 'openTop';
                });
            }
        };
    });

}());
},{}],48:[function(require,module,exports){
/*
 * This directive is responsible for displaying the banner header
 */
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsEmbeddedArticle', function(){
        return{
            restrict: 'E',
            templateUrl: 'vlcEmbeddedArticle.html',
            replace: true,
        };
    });
}());

},{}],49:[function(require,module,exports){
/*
 * This directive controls whether to display the helpText
 *
*/
(function(){
   'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('helpText',function(){
        return{
            restrict: 'C',
            link: function(scope, element, attrs){
                if (!scope.control.propSetMap.help){
                    element.remove();
                }
            }
        };
    });
}());

},{}],50:[function(require,module,exports){
(function(){
    'use strict';
    /*the purpose of this directive is to cancel the bubbling of scrolling events
      this could be extended for other events in the future by passing attributes*/
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsInclude', function($templateCache, bpService, $compile){
        return {
            restrict: 'A',
            scope:false,
            compile: function(element, attrs){

                var templateName ;
                
                templateName = attrs.vlcSldsInclude;

                if (!templateName){
                    throw new Error('expected template Name');
                }

                var template = $templateCache.get(templateName);

                element.replaceWith(template); //vlc-flex rule depends on this

                var altTemp = templateName.indexOf('altVlc') == 0;
                if (altTemp){
                    var compileFn = $compile(template);
                }

                //element.html(template);
                return function (scope, element, attrs){
                    if (templateName.indexOf('altVlc') == 0 && compileFn){
                        //OMNI-2383
                        compileFn(scope, function(cloned,scope){
                            element.replaceWith(cloned);
                        });
                    }
                }
            }
        };
    });

}());

},{}],51:[function(require,module,exports){
(function() {
	'use strict';
	var bpModule = angular.module('vlocity-business-process');

	bpModule.provider("$sldsInlineBlock", function() {
		var defaults = this.defaults = {
			templateUrl: 'vlcEditBlockInline.html',
			element: null,
			show: true
		};

		this.$get = function($window, $rootScope, $sldsInlineBlockCompiler, $animate, $sce, $timeout) {
			var forEach = angular.forEach,
				requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout,
				bodyElement = angular.element($window.document.body),
				currentELement = document.activeElement;

			function SldsEditBlockFactory(config) {
				var $sldsInlineBlock = {}, options = $sldsInlineBlock.$options = angular.extend({}, defaults, config),
					promise = $sldsInlineBlock.$promise = $sldsInlineBlockCompiler.compile(options),
					focusPromise, focusCatcher, compileData, modalElement, modalScope,
					scope = $sldsInlineBlock.$scope = options.scope && options.scope.$new() || $rootScope.$new();

					if (!config.templateUrl) {
						config.templateUrl = 'vlcEditBlockInline.html';
					}

					$sldsInlineBlock.$id = options.id || options.element && options.element.attr('id') || '';

					if (config.show) {
						scope.$$postDigest(function () {
							$sldsInlineBlock.show();
						});
					}

					// Publish isShown as a protected var on scope
					$sldsInlineBlock.$isShown = scope.$isShown = false;

					promise.then(function (data) {
						compileData = data;
						$sldsInlineBlock.init();
					});

					$sldsInlineBlock.init = function () {
						if (options.show) {
							scope.$$postDigest(function () {
								$sldsInlineBlock.show();
							});
						}
					};

					scope.$dismiss = scope.$hide = function (canc, evt) {
						scope.$$postDigest(function () {
							$sldsInlineBlock.hide(evt);
						});
					};

					scope.$show = function () {
						scope.$$postDigest(function () {
							$sldsInlineBlock.show();
						});
					};

					$sldsInlineBlock.show = function () {
						if ($sldsInlineBlock.$isShown) return;

						// create a new scope, so we can destroy it and all child scopes
						// when destroying the modal element
						modalScope = $sldsInlineBlock.$scope.$new();
						// Fetch a cloned element linked from template (noop callback is required)
						modalElement = $sldsInlineBlock.$element = compileData.link(modalScope, function (clonedElement, scope) {});
						$(document.activeElement.parentElement).append(modalElement[0]);

						$sldsInlineBlock.$isShown = scope.$isShown = true;
						safeDigest(scope);
						focusCatcher = modalElement.next();
					};


					$sldsInlineBlock.hide = function (evt) {
						if (!$sldsInlineBlock.$isShown) return;

						var modEle = modalElement,
						curEle = currentELement,
						clsPrefix = angular.equals(sfdcVars.layout, 'lightning') ? '.slds-' : (angular.equals(sfdcVars.layout, 'newport') ? '.nds-' : '');

						if(document.getElementsByClassName(modalElement[0].classList[0])[0] !== undefined) {
							$(evt.currentTarget).closest(clsPrefix + 'edit-block-edit__container').remove();
						}
					};

					function safeDigest(scope) {
						/* eslint-disable no-unused-expressions */
						scope.$$phase || (scope.$root && scope.$root.$$phase) || scope.$digest();
						/* eslint-enable no-unused-expressions */
					}
				return $sldsInlineBlock;
			}
			return SldsEditBlockFactory;
		};
	});

	bpModule.service('$sldsInlineBlockCompiler', sldsCompilerService);

	function sldsCompilerService($q, $http, $injector, $compile, $controller, $templateCache) {
		this.compile = function (options) {
			if (options.template && /\.html$/.test(options.template)) {
				options.templateUrl = options.template;
				options.template = '';
			}

			var templateUrl = options.templateUrl, template = options.template || '', 
			controller = options.controller,
			controllerAs = options.controllerAs, 
			resolve = angular.copy(options.resolve || {}), 
			locals = angular.copy(options.locals || {}),
			transformTemplate = options.transformTemplate || angular.identity, 
			bindToController = options.bindToController;

			angular.forEach(resolve, function (value, key) {
				if (angular.isString(value)) {
					resolve[key] = $injector.get(value);
				} else {
					resolve[key] = $injector.invoke(value);
				}
			});

			// Add the locals, which are just straight values to inject
			// eg locals: { three: 3 }, will inject three into the controller
			angular.extend(resolve, locals);

			if (template) {
				resolve.$template = $q.when(template);
			} else if (templateUrl) {
				resolve.$template = fetchTemplate(templateUrl);
			} else {
				throw new Error('Missing `template` / `templateUrl` option.');
			}

			// Wait for all the resolves to finish if they are promises
			return $q.all(resolve).then(function (locals) {
				var template = transformTemplate(locals.$template),
				element = angular.element('<div>').html(template.trim()).contents(),
				linkFn = $compile(element);

				// Return a linking function that can be used later when the element is ready
				return {
					locals: locals,
					element: element,
					link: function link(scope) {
						locals.$scope = scope;

						// Instantiate controller if it exists, because we have scope
						if (controller) {
							var invokeCtrl = $controller(controller, locals, true);
							if (bindToController) {
								angular.extend(invokeCtrl.instance, locals);
							}
							var ctrl = angular.isObject(invokeCtrl) ? invokeCtrl : invokeCtrl();
							if (controllerAs) {
								scope[controllerAs] = ctrl;
							}
						}
						return linkFn.apply(null, arguments);
					}
				};
			});
		};

		var fetchPromises = {};
		function fetchTemplate(template) {
			if (fetchPromises[template]) return fetchPromises[template];
			return (fetchPromises[template] = $http.get(template, {cache: $templateCache})
				.then(function (res) {
					return res.data;
				}));
		}
	}
}());
},{}],52:[function(require,module,exports){
/*custom directive to manage the instructions box */
(function(){
    'use strict';
    var bpModule = angular.module('vlocity-business-process');
    bpModule.directive('vlcSldsInstruction', function(){
        return{
            restrict: 'E',
            replace: true,
            templateUrl:'vlcSldsInstructions.html'
        };
    });
}());

},{}],53:[function(require,module,exports){
/*
 * This directive is responsible for displaying the banner header
 */
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsLightningBanner', function($compile, $templateCache, bpService){
        return{
            restrict: 'E',
            //templateUrl: (bpService.layout === 'lightning')?('vlcLightningBanner.html'):('vlcEmpty.html'),
            templateUrl: 'vlcEmpty.html',
            link: function(scope,element, attrs){
                //scope.title = attrs.title;
            }
        };
    });
}());

},{}],54:[function(require,module,exports){
(function(){
    'use strict';
    var bpModule = angular.module('vlocity-business-process');
    // directive - used to move the modal popup
    bpModule.directive('modalmove', function ($compile, $document)
                       {
                           return {
                               restrict: 'A',
                               scope:false,
                               link: function(scope, elem){
                                   var startX, startY, x, y;
                                   var width = elem[0].offsetWidth;
                                   var height = elem[0].offsetHeight;
                                   var header = scope.bpService.layout == 'lightning' ? elem.find('.slds-modal__header') : elem.find('.nds-modal__header');
                                   header.on('mousedown', function(e){
                                       startX = e.clientX - elem[0].offsetLeft;
                                       startY = e.clientY - elem[0].offsetTop;
                                       $document.on('mousemove', mousemove);
                                       $document.on('mouseup', mouseup);
                                   });

                                   // Handle drag event
                                   function mousemove(e) {
                                       y = e.clientY - startY;
                                       x = e.clientX - startX;
                                       setPosition();
                                   }

                                   // Unbind drag events
                                   function mouseup(e) {
                                       $document.unbind('mousemove', mousemove);
                                       $document.unbind('mouseup', mouseup);
                                   }

                                   function setPosition(){
                                       elem.css({
                                           top: y + 'px',
                                           left:  x + 'px'
                                       });
                                   }
                               }
                           };
                       });

    // directive - used to resize the modal popup
    bpModule.directive('modalresize', function($document){
        var startX, startY, x, deltaX;
        return {
            restrict:'A',
            scope:'false',
            link: function(scope, element, attrs){
                var layout = scope.bpService.layout;
                element.bind('mousedown', function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    var clsName = '';
                    if(layout == 'lightning')
                        clsName = 'vlc-slds-edit-block--modal_bottom';
                    else if(layout == 'newport')
                        clsName = 'nds-modal_custom-bottom';
                    if($(event.target).parents('.'+clsName).length > 0)
                        $(event.target).parents('.'+clsName).removeClass(clsName);
                    if($(event.target).parents('.vloc-modal-shown').length > 0)
                        $(event.target).parents('.vloc-modal-shown').removeClass('vloc-modal-shown');
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });

                function mousemove($event) {

                    //whenever there is a mouse down event deactivate the iframe
                    $('.iframe-holder').css({
                        'opacity': 0.3,//
                        'z-index':-1
                    });
                    
                    if (attrs.prop === 'width'){
                        //calculates  the start X and Y and calculates
                        //the dist travelled by the mouse and adds to the width
                        x = $event.pageX;
                        startX = element.offset().left;
                        startX = parseInt(startX);
                        deltaX = x  - startX;
                        var top = element.parent();
                        
                        top.css({
                            'width': parseInt(top.css('width')) + deltaX + 'px'
                        });
                        
                    }else{
                        //calculates the height of parent div - vlc-debug-modal
                        //cals mouse position , then dist moved by the mouse and adds it to the initial height
                        //diagonal drag

                        x = $event.pageX;
                        startX = element.offset().left;
                        startX = parseInt(startX);
                        deltaX = x  - startX;
                        
                        var y = $event.pageY;
                        startY = element.offset().top;
                        startY = parseInt(startY); //
                        var delta = y - startY;
                        var topP = element.parent().parent().parent();
                        topP.css({
                            'width': parseInt(topP.css('width')) + deltaX + 'px',
                            'height': parseInt(topP.css('height')) + delta + 'px'
                        });

                        //120 is the min height of the parent div
                        var mBody = element.parent().parent().parent().find('.slds-modal__container');
                        mBody.css({
                            'height': parseInt(topP.css('height')) - 120 + 'px'
                        });
                    } 
                }

                function mouseup($event){
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);

                    //whenever there is a mouse down event deactivate the iframe
                    $('.iframe-holder').css({
                        'opacity': 'initial',
                        'z-index':'auto'
                    });
                    
                }

            }
        };
    });
}());

},{}],55:[function(require,module,exports){
/*
* This directive updates the model value to the data json if its prefilled and valid
*/
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsModelUpdate', function(){
        return {
            restrict:'A',
            require:'ngModel',
            link: function (scope, element, attrs, ngModelCtrl){
                /* if its gets here its a valida model in the pipeline */
                ngModelCtrl.$formatters.push(function modelUpdater(value){
                    scope.aggregate(scope,
                                    scope.control.index,
                                    scope.control.indexInParent,
                                    true, -1);
                    return value;
                });
            }
        };
    });
}());

},{}],56:[function(require,module,exports){
/*custom directive for popovers */
(function(){
    'use strict';
    var bpModule = angular.module('vlocity-business-process');
    bpModule.directive('vlcSldsPopOver', function($sce, $compile){
        return{
            restrict: 'A',
            link: function(scope, element, attrs){

                var tTip = '<div id=\"vlc-slds-toolTip\" class=\"slds-popover slds-popover--tooltip  slds-nubbin--bottom-left\"' +
                        ' role=\"tooltip\"><div class=\"slds-popover__body\"><p>' +
                        attrs.vlcSldsPopOver+
                        '</p></div></div>';

                element.bind('mouseenter', function($event){
                    element.append(tTip);
                });

                element.bind('mouseleave', function(){
                    var target = document.querySelector('#vlc-slds-toolTip')
                    target.remove();
                });
            }
        };
    });
}());

},{}],57:[function(require,module,exports){
/*
* This directive makes the input readonly
*
*/
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsReadonly', function($compile){
        return{
            restrict: 'A',
            link: function(scope, element, attrs){
                element.attr('readonly', 'readonly');
                element.attr('disabled', 'disabled');    
                element.attr('cloned', 'dirty');
            }
        };
    });
}());

},{}],58:[function(require,module,exports){
(function(){
    'use strict';
    /* the purpose of this directive is to remove elements from the dom
     * OMNI-1856 - when we have formula fields in the OS any action with the dom modification needs to done before 
     * the digest cycle completes since the expression engine queries the live collection within a digest cycle
     * use case 1
         * repeated blocks with a formula field counting the number of blocks
         * when a block is deleted the scope method performCalculation updates the formula field by querying
               the number of blocks
         * now if the delete button does not delete the dom and waits for angular to do it 
           the perf calc method would return with the older number of blocks 
           (delete one from 3 and perfcalc would give you 3 instead of 2)
         * now for the formula to be correct the digest cycle needs to be invoked as many times as it needs 
         * which may differ case to case
    * This directive is used both in classic and lightning player
    */
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsRemoveItem', ['bpService','$timeout'].concat(/lightning|newport/.test(sfdcVars.layout)?['$sldsDOMNavigation']:[]).concat(function(bpService, $timeout, $sldsDOMNavigation){
        var isNative = /(ip[ao]d|iphone|android)/ig.test(window.navigator.userAgent);
        return {
            restrict: 'A',
            scope:false,
            link: function($scope, elem, attrs){

                /*
                var selectorString = (function(){
                    return (bpService.layout === 'lightning' || bpService.layout === 'newport') ?  'ng-form.vlc-slds-block':
                        ('#' + $scope.control.name);
                })();
                */

                //gives the selector of the item to be removed
                var selectorString = attrs.vlcSldsRemoveItem ;

                //handling spaces in the ids
                selectorString = selectorString && selectorString.replace(/ /g, '\\ ');

                $scope.removeDomElement = function(scp, child, $index) {
                    //adding timeout to allow events to fire
                    $timeout(function(){
                        var closestElem = elem.closest(selectorString),
                        blockElemLength = child.response.length,
                        elemIndex = scp.control.index;

                        if($sldsDOMNavigation){
                            var newFocus = $sldsDOMNavigation.nextTabbableElement(closestElem[0],0,1);
                        }
                        /*jshint -W030 */
                        closestElem[0].remove && closestElem[0].remove() || (function(){ closestElem.remove(); }() );
                        $scope.removeItem(scp,child, $index);
                        if($sldsDOMNavigation&&!isNative){
                            if(elemIndex < blockElemLength-1)
                                $sldsDOMNavigation.simulateTab(newFocus,1);}
                        }
                    );
                };
            }
        };
    }));

    /* This directive compiles the element and puts the
     * vlcSldsRemoveItem directive with all the required attributes
     * this way don't have to modify all the mobile templates and desktop ones
     */

    dModule.directive('iconVMinusCircle', function($compile){
        return{
            restrict:'C',
            scope:false,
            priority: 601,
            terminal: true,
            compile: function (tElement, attrs){
                tElement.removeAttr('ng-if');
                tElement.removeAttr('ng-click');
                tElement.attr('ng-if', 'child.eleArray.length > 1');
                tElement.attr('vlc-slds-remove-item', 'ng-form.vlc-form-group');
                tElement.attr('ng-click', 'removeDomElement(this,child,$index)');
                tElement.removeClass('icon-v-minus-circle');
                tElement.addClass('ICON-V-Minus-Circle');
                var fn = $compile(tElement);


                return function(scope,element, attrs){
                    //at this point we want to remove the ng-if watcher from the parent
                    //remove the if watcher when  addded
                    //var length = scope.$parent.$$watchers.length;
                    /*
                    if (length > 0 ){
                        var lastWatcher = scope.$parent.$$watchers[length - 1];
                        if (lastWatcher.exp === attrs.ngIf){
                            scope.$parent.$$watchers[length - 1] = null;
                        }
                    }
                    */
                    fn(scope, function(cloned, scope){
                        element.after(cloned);
                    });
                    //$compile(element)(scope);
                };
            }
        };
    });

}());

},{}],59:[function(require,module,exports){
/*This makes sure that the spinner in case of lightning will be in sync with
* bootstrap spinner
*/
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsSpinner', function($compile, bpService, $templateCache, $rootScope){
        $rootScope.$watch('loading',function(newVal,oldVal,scope){
            if (!newVal){
                scope.loadingMessage='';
            }
        });
        return {
            restrict: 'A',
            compile: function(element, attrs){
                 if (bpService.layout !== 'lightning' && bpService.layout !== 'newport'){
                   console.log('old spinner');
                   return;
                 }
                 console.log('new spinner');

                 var html = '';
                 if(bpService.layout == 'lightning') {
                    html = $templateCache.get('vlcSldsSpinner.html');
                 } else if(bpService.layout == 'newport') {
                    html = $templateCache.get('vlcNdsSpinner.html');
                 }

                 var fn = $compile(html);
                 
                 return function(scope, element, attrs){
                    element.replaceWith(fn(scope));
                 };

            }
        };
    });
}());

},{}],60:[function(require,module,exports){
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsStepChart', function($templateCache, bpService, $compile){
        return{
            restrict: 'A',
            scope:false,
            link: function(scope, element, attrs){
                console.log('link function ' + bpService.elementTypeToHTMLMap[attrs.map]);
                var templateName = bpService.elementTypeToHTMLMap[attrs.map];
                var template = $templateCache.get(templateName);
                element.html(template); //element[0].outerHtml =
                $compile(element.contents())(scope);
            }
        };
    });

}());

/*
 * directive dictates the look and feel and of the  
 * individual step in the step container
 *
 * Step Chart has 4 states
 *
 * (1) Pristine (the step has not been visited)
 * (2) Active (current step)
 * (3) dirty + invalid - should display cross icon
 * (4) dirty + valid - should display check icon
 *
 */

(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsStepStyler', function($compile, $rootScope){
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs){
                element.bind('click', function(){
                    $rootScope.$emit('disAnim');
                });

                if(scope.bpService.layout == 'newport') {
                    angular.element(window).bind('resize', function() {
                        $('.nds-progress-bar').find('.nds-progress-bar__value').css('width', scope.calculateProgressWidth());
                    });
                }

                attrs.$observe('state', function(newValue){
                    if (newValue === 'true'){
                        element.addClass('active');
                        if(scope.bpService.layout == 'newport') {
                            element.addClass('nds-progress__visited');
                            scope.step.visited = true;
                        }
                        return;
                    }

                    if (newValue === 'false' && scope.step.dirty) {
                        if(element.hasClass('active')) {
                            element.removeClass('active');
                        } 
                        if(scope.step.inValid === true) {
                            //leaving an active step, not valid
                            element.addClass('invalid');
                            element.removeClass('completed');
                            scope.step.completed = false;
                        } 
                        else {
                            //leaving an active step, valid
                            scope.step.completed = true;
                        }
                    }

                    if (scope.step.completed){
                        element.addClass('completed');
                    }
                });

            }
        };
    });
}());
/*
 * This makes sure that the window is scrolled back to the intial position when
 * these steps are animated
 */

(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcAnimationSlider', function($compile, $rootScope, $animate){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                var el;
                
                element.bind('click keydown', function(evt){
                    var keyCode = evt.which || evt.keyCode;
                    if (evt.type == 'keydown' && keyCode != 13 && keyCode != 32){
                        return;
                    }

                    //if animations are disables restart them
                    if (!$animate.enabled()){
                        $animate.enabled(true);
                    }
                    if (el) {
                        el.stop(true);
                    }

                    /* jshint -W116 */
                    if(attrs.reverse == 'true'){
                        el = angular.element('section.step-step');
                        //stop animations
                        el.stop(true);
                        el.removeClass('animate-if');
                        el.removeClass('animate-ifMod');
                        el.addClass('animate-rev');
                    }else{
                        el = angular.element('section.step-step');
                        el.stop(true);
                        el.removeClass('animate-ifMod');
                        el.removeClass('animate-rev');
                        el.addClass('animate-if');
                        //if the next step is an action dont animate the hide for the current step
                        // add a class to the next actual step with a modified keyframe -css -ifMod
                        if (scope.child.isAction) {
                            element.closest('section.step-step').removeClass('animate-if');
                            el.addClass('animate-ifMod');
                        }
                        $rootScope.$emit('scroll');
                    }
                });

                $rootScope.$on('disAnim', function(){
                    console.log('event received');
                    $animate.enabled(false);
                    //OMNI-1482 - typeahead needs animations enabled to work
                    setTimeout(function(){
                        $animate.enabled(true);
                    });
                });
            }
        };
    });
}());

},{}],61:[function(require,module,exports){
(function(){
   'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsSvgSize', function($templateCache, bpService){
        return{
            restrict: 'A',
            scope:false,
            link: function(scope, element,attrs){
                var symbol = scope.control.propSetMap.currencySymbol || '';
                
                symbol = symbol.length || 0;
                element.css({
                    width: symbol * 10 + 10,
                    background: '#fff',
                    zIndex: '2'
                });
            }
        };
    });
}());


},{}],62:[function(require,module,exports){
(function(){
    'use strict';
    var bpModule = angular.module('vlocity-business-process');
    bpModule.directive('vlcSldsTimePicker', function(dateFilter, $window){
        var epoch = "1 Jan 1970 ";
        var isValidPattern = function(val){
          return val.match(/^(0?[1-9]|1[012])(:[0-5]\d)[APap][mM]$/);
        };
          
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelCtrl){
               console.log('time picker response is ### ' + scope.control.response);
               var rTime ;
               var format = 'hh:mmA';
               var pickerViewVal ;
               
               ngModelCtrl.$formatters.unshift(function (modelValue) {
                   console.log('time formatters run ' + modelValue);
                   if (modelValue && modelValue !== null){
                       pickerViewVal = moment(new Date(modelValue)).format(format);
                       return pickerViewVal;
                   }
                   //return dateFilter(modelValue, format);
               });
           
               ngModelCtrl.$parsers.unshift(function(viewValue) {
                   console.log('time parsers run' + viewValue);
                   var twentyFourTime  = moment( viewValue , 'h:mm a' ).format('HH:mm:ss');
                   var tempTime = moment (new Date(epoch +  twentyFourTime));

                   if (tempTime.isValid() && isValidPattern(viewValue)){
                       ngModelCtrl.$setValidity('valid', true);
                       return tempTime.toISOString();
                   }else{
                       if (viewValue !== ''){
                           ngModelCtrl.$setValidity('valid', false);
                       }else{
                           ngModelCtrl.$setValidity('valid', true);
                       }
                       return null;
                   }

               });

                var rtl = angular.element('html').css('direction');

                var dfn = $.fn['clockpicker'];
                var config = {
                                donetext: 'Done',
                                twelvehour: true,
                                autoClose:true,
                                align: rtl === 'rtl' ? 'right': 'left',
                                afterDone: function(){
                                    //ngModelCtrl.$setViewValue();
                                }
                            };
                var instance  = dfn.call(element, config);

                if($(element).parents('.vlc-slds-edit-block--modal').length > 0) {
                    element.bind('click', function(event) {
                        if($window.editBlockModalDate) {
                            if($window.editBlockModalDate.position === 'openTop') {
                                element.data("clockpicker").options.placement = 'top';
                                element.clockpicker('locate');
                            } else if($window.editBlockModalDate.position === 'openBottom') {
                                element.data("clockpicker").options.placement = 'bottom';
                                element.clockpicker('locate');
                            }
                        }
                    });
                }

            }
        };
    });
}());

},{}],63:[function(require,module,exports){
/*
 * toggles the visibility of the element based on the selector
 * string passed to it
 *
 */
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsToggle', ['$aria',function($aria){
        return{
            restrict: 'A',
            scope: false,
            link: function(scope,element, attrs){
                //OMNI-1718 - the new svg directive replaces the element making the listener
                //obsolute

                if ($aria.config('bindRoleForClick') && !element.attr('role')) {
                  element.attr('role', 'button');
                }

                if ($aria.config('tabindex') && !element.attr('tabindex')) {
                  element.attr('tabindex', 0);
                }

                if ($aria.config('bindKeydown') && !attrs.ngKeydown && !attrs.ngKeypress && !attrs.ngKeyup) {
                  element.on('keydown', function(event) {
                    var keyCode = event.which || event.keyCode;
                    if (keyCode === 32 || keyCode === 13) {
                      callback(event);
                    }
                  });
                }

                element.on('click', callback);

                function callback(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    element.toggleClass('clicked');
                    scope.$emit('toggle', {'toggle': true});
                }

                //have the block expanded by default       
                if (!scope.control.propSetMap.collapse){
                    scope.$emit('toggle', {'toggle': true});
                    element.toggleClass('clicked');
                }
            }
        };
    }]);
}());


/* toggle element based on the click of vlcSldsToggle
 *
 *
 */
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsToggleElem', function(){
        return{
            restrict: 'A',
            link: function(scope, element, attrs){

                //block has no label
                if (!scope.control.propSetMap.label){
                    element.removeClass('ng-hide');
                    return;
                }

                var handler = scope.$on('toggle', function($event , data){
                    //handles nested blocks so that all of them dont expand at once
                    if ($event.defaultPrevented){
                        return;
                    }

                    element.toggleClass('ng-hide');
                    if(element.hasClass('ng-hide')){
                        element.attr('aria-hidden','true');
                        element.attr('aria-expanded','false');
                    } else{
                        element.attr('aria-hidden','false');
                        element.attr('aria-expanded','true');
                    }
                    $event.preventDefault();
                });
            }
        };
    });
}());

/*
 * Toggle element directive
 */
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsToggleElement', function($compile, $templateCache){
        return{
            restrict: 'A',
            scope:{
            },
            transclude: true,
            replace: true,
            template: '<div ng-transclude></div>',
            link:function(scope, element, attrs){
                scope.$on('expand', function(){
                    element.toggleClass('expand');
                    if(!element.hasClass('expand')){
                        element.attr('aria-hidden','true');
                        element.attr('aria-expanded','false');
                    } else{
                        element.attr('aria-hidden','false');
                        element.attr('aria-expanded','true');
                    }

                    //cannot put the same on body since mobile browsers ignore the same;
                    angular.element('body').toggleClass('slds-modal--shown');

                    setTimeout(function(){
                        element.scrollTop(true);
                    });
                });
            }
        };
    });

}());

/*
 * expand and  collapse the element - a better alternative for toggle
 * refactor toggle to match this
 */

(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsExpand',['$rootScope','$aria', function($rootScope,$aria){
        return{
            restrict: 'A',
            link:function(scope, element, attrs){
                if ($aria.config('bindRoleForClick') && !element.attr('role')) {
                  element.attr('role', 'button');
                }

                if ($aria.config('tabindex') && !element.attr('tabindex')) {
                  element.attr('tabindex', 0);
                }

                if ($aria.config('bindKeydown') && !attrs.ngKeydown && !attrs.ngKeypress && !attrs.ngKeyup) {
                  element.on('keydown', function(event) {
                    var keyCode = event.which || event.keyCode;
                    if (keyCode === 32 || keyCode === 13) {
                      callback();
                      event.preventDefault();
                    }
                  });
                }

                element.on('click', callback);

                function callback() {
                    $rootScope.$broadcast('expand');
                }
            }
        };
    }]);

}());


/**
 * [toggle element based on the click of vlcSldsToggle with animation]
 * Note: Didn't use ng-hide class
 */
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsToggleCustElem', function(){
        return{
            restrict: 'A',
            link: function(scope, element, attrs){

                //block has no label
                if (!scope.control.propSetMap.label){
                    element.removeClass('toggleElement');
                    return;
                }

                var handler = scope.$on('toggle', function($event , data){
                    //handles nested blocks so that all of them dont expand at once
                    if ($event.defaultPrevented){
                        return;
                    }

                    element.toggleClass('toggleElement');
                    if(element.hasClass('toggleElement')){
                        element.attr('aria-hidden','true');
                        element.attr('aria-expanded','false');
                    } else{
                        element.attr('aria-hidden','false');
                        element.attr('aria-expanded','true');
                    }
                    $event.preventDefault();
                });
            }
        };
    });
}());

},{}],64:[function(require,module,exports){
/*
 * This directive controls whether to display the helpText
 */
(function(){
   'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsToggleHelpText',function() {
        return{
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var control = scope.control;
                function getHelpTextElement() {
                    return $('.nds-form-element__control-help', element.parents('.nds-input__tooltip'));
                }
                element.bind('focus',function () {
                    if(control.propSetMap.help)
                        getHelpTextElement().addClass('nds-helptext-focus');
                })
                .bind('blur', function () {
                    if(control.propSetMap.help)
                        getHelpTextElement().removeClass('nds-helptext-focus');
                });
            }
        };
    });
}());

},{}],65:[function(require,module,exports){
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsTypeaheadPrefill', function($timeout){
        return {
            restrict: 'A',
            scope:false,
            link: function(scope, elem, attrs){
                if (scope.control && scope.control[attrs.vlcSldsTypeaheadPrefill]){
                   elem.attr('cloned','dirty');
                }

                var sldsWatcher = scope.$watch(function(){
                    return elem.val();
                },function(newVal){
                    if (newVal){
                        elem.attr('cloned','dirty');
                        sldsWatcher();
                    }
                });

            }
        };
    });

}());
},{}],66:[function(require,module,exports){
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsValWatchProdConf', function($timeout) {
        console.log('inside the val watch');
        return {
            restrict: 'A',
            scope:false,
            link: function(scope, elem, attrs){
                if (attrs.vlcSldsValWatchProdConf){
                    var sldsWatcher = scope.$watch(function(){
                        return elem.val();
                    },function(newVal){
                        if (newVal){
                            elem.attr('cloned','dirty');
                            sldsWatcher(); //remove the watcher
                        }
                    });
                    return;
                }
            }
        };
    });

}());
},{}],67:[function(require,module,exports){
(function(){
    'use strict';
    var dModule = angular.module('vlocity-business-process');
    dModule.directive('vlcSldsWindowScroll', [
        '$rootScope', 
        '$window', 
        '$timeout',
        function($rootScope,$window,$timeout){
            var isNative = /(ip[ao]d|iphone|android)/ig.test(window.navigator.userAgent);
            var isTouch = ('createTouch' in $window.document || 'ontouchstart' in $window.document) && isNative;

            // OMNI-2285: scrolls window but not any elements above, in case of iframe.
            $window.vlocScrollToEle = $window.vlocScrollToEle||function(element){
                if (typeof element === 'string'){
                    element = this.document.getElementById(element);
                }
                if (!element) return;
                this.scrollTo(0,element.getBoundingClientRect().top);
            };
            return{
                restrict: 'A',
                link: function(scope, element, attrs){
                    //put a value on the scope so that the click event knows is the next action is an action or not
                    //only applicable for forward animation
                    var nextIndex = scope.child.nextIndex;
                    if (nextIndex){
                        var child = scope.$parent && scope.$parent.children && scope.$parent.children[nextIndex];
                        if (/action/i.test(child.type)){
                            scope.child.isAction = true;
                        }
                    }

                    // defining scrollListener on rootscope so it is only registered once
                    if ($rootScope.scrollListener === undefined){
                        $rootScope.scrollListener = $rootScope.$on('scroll', function(){
                            // defining scrollPromise with a timeout to allow other processes
                            // to finish before execution and limit to one execution
                            if ($rootScope.scrollPromise !== undefined){
                                $timeout.cancel($rootScope.scrollPromise);
                            }
                            if(isTouch) {
                              $rootScope.scrollPromise = $timeout(function(){
                                $window.vlocScrollEleToTop('VlocityBP');
                              },50,true);
                            }
                            else {
                              $rootScope.scrollPromise = $timeout(function(){
                                $window.vlocScrollToEle('VlocityBP');
                              },50,true);
                            }
                        });
                    }
                }
            };
        }
    ]);
}());
},{}],68:[function(require,module,exports){
(function(){
    'use strict';
    var bpModule = angular.module('vlocity-business-process');
    bpModule.directive('vlcTimePicker', function($timeout){
        var epoch = "1 Jan 1970";
        return {
            restrict: 'A',
            link: function(scope, element, attrs){

                var dfn = $.fn['clockpicker'];
                var instance  = dfn.call(angular.element(element), {
                    donetext: 'Done',
                    twelvehour: true,
                });

                scope.$watch(function(){
                    return angular.element(element).val();
                },function(newVal){
                    var twentyFourTime  = moment(newVal, 'h:mm a').format('HH:mm:ss');
                    scope.control.response = moment(new Date(epoch +  twentyFourTime)).toISOString();
                });
                
            }
        };
    });
}());

},{}],69:[function(require,module,exports){
angular.module('vlocity-oui-common')
    .factory('bpService', ['ouiBaseService', '$q', '$rootScope', '$timeout', '$sce', 'force', '$injector', 'uiStateService',
             function(ouiBaseService, $q, $rootScope, $timeout, $sce, force, $injector, uiStateService) {

        var factory = {};
        $rootScope.loading = false;
        $rootScope.loadingMessage = '';

        if(window.VOmniServicesInject && angular.isArray(window.VOmniServicesInject) && window.VOmniServicesInject.length>0) {
            for(var i=0; i<window.VOmniServicesInject.length; i++) {
                factory[window.VOmniServicesInject[i]] = $injector.get(window.VOmniServicesInject[i]);
            }
        }

        // VF remote asyn promise
        factory.BuildJSONV3 = function(sId, scriptState, bPreview, multiLangCode)
        {
            var deferred = $q.defer();
            VOUINS.BuildJSONV3(sId, scriptState, bPreview, multiLangCode, function(result, event)
            {
                $rootScope.$apply(function()
                {
                    if(event.status)
                        deferred.resolve(result);
                    else
                        deferred.reject(event);
                });
            });
            return deferred.promise;
        };

        // VF remote asyn promise
        factory.SaveBP = function(bpTree, files)
        {
            var deferred = $q.defer();
            VOUINS.SaveBP(bpTree, files, function(result, event)
            {
                $rootScope.$apply(function()
                {
                    if(event.status)
                        deferred.resolve(result);
                    else
                        deferred.reject(event);
                });
            });
            return deferred.promise;
        };

        // VF remote asyn promise
        factory.GenericInvoke = ouiBaseService.GenericInvoke;
        factory.handleFilterBlock = ouiBaseService.handleFilterBlock;

        // Omni Rest Call
        factory.OmniRestInvoke = function(configObj)
        {
            if(window.customVOmniRestInvoke && window.customVOmniRestInvoke.constructor === Function) {
                return window.customVOmniRestInvoke(configObj, this);
            }

            if(window.OmniOut) {
                return window.OmniForce.apexrest({
                        path: configObj.path,
                        params: {},
                        data: configObj.input,
                        method:configObj.method}
                );
            }
            else {
                return window.forceTKClient.apexrest(
                    configObj.path,
                    function(result) {
                        return result;
                    },
                    function(error) {
                    },
                    configObj.method,
                    angular.toJson(configObj.input),
                    configObj.params,
                    false,
                    configObj.label
                );
            }
        };

        factory.OmniRemoteInvoke =  function(configObj, scp, element, bpScp)
        {
            var fnScp = scp || bpScp;
            var invokePromise = this.OmniRemoteInvokeBase(configObj);

            if(element && element.propSetMap && ["Remote Action", "Integration Procedure Action"].includes(element.type)){
                if (element.propSetMap.invokeMode && element.level === 0 && fnScp && fnScp.nextRepeater && angular.isFunction(fnScp.nextRepeater)) {
                    // turns off the spinner and unblocks UI when invokeMode is set
                    $rootScope.loading = false;

                    fnScp.nextRepeater(element.nextIndex, element.indexInParent);
                }
                if (element.propSetMap.invokeMode==="fireAndForget"){
                    // unhooks fire and forget by returning an empty object with method then being noop
                    invokePromise = {then:function(){}};
                    // logs noop promise with delay of 3 to fire loading spinner on element.
                    uiStateService.logAction($timeout(function(){},500), null, scp, element);
                } else {
                    uiStateService.logAction(invokePromise, configObj, scp, element);
                }
            }

            return invokePromise;
        };

        // Omni Remote Call
        factory.OmniRemoteInvokeBase = function(configObj)
        {
            var prom = ouiBaseService.OmniRemoteInvokeAux(configObj, this);

            if(prom === false) {
                if(configObj.sClassName === 'Vlocity SaveBP')
                    return this.SaveBP(configObj.input, configObj.files);
                if(configObj.sClassName === 'Vlocity BuildJSONV3')
                    return this.BuildJSONV3(configObj.sId, configObj.scriptState, configObj.bPreview, configObj.multiLangCode);
                if(configObj.sClassName === 'Vlocity CompleteScript')
                    return this.CompleteScript(configObj.sInstanceId);
                if(configObj.sClassName === 'Vlocity CreateOSAttachment')
                    return this.CreateOSAttachment(configObj.input, configObj.parentId, configObj.fileName, configObj.options);
                if(configObj.sClassName === 'Vlocity DeleteOSAttachment')
                    return this.DeleteOSAttachment(configObj.attachmentId, configObj.deleteParent, configObj.options);
                if(configObj.sClassName === 'Vlocity VlocityTrack')
                    return this.VlocityTrack(configObj.trackingData);
                if(configObj.sClassName === 'Vlocity BuildJSONWithPrefill')
                    return this.BuildJSONWithPrefill(configObj.sType, configObj.sSubType, configObj.sLang, configObj.sPFRPBundleName, configObj.drParams, configObj.multiLangCode);
                if(configObj.sClassName === 'Vlocity GetUserInfo')
                    return this.UserInfo||this.GenericInvoke(configObj.sClassName, configObj.sMethodName, configObj.input, configObj.options, configObj.iTimeout, configObj.label);

                return this.GenericInvoke(configObj.sClassName, configObj.sMethodName, configObj.input, configObj.options, configObj.iTimeout, configObj.label);
            }
            else
                return prom;
        };

        // VF remote asyn promise
        factory.BuildJSONWithPrefill = function(sType, sSubType, sLang, sPfBundle, sDrParams, multiLangCode)
        {
            var deferred = $q.defer();
            var userInfoResultStor,buildFnResultStor,buildfn,userInfoPromise;
            var thisService = this;

            if (window.OmniForce&&window.forceLocalDef){
                buildfn = VOUINS.BuildJSONWithPrefillLocalDef;
                if(window.OmniForce.isAuthenticated()&&window.callUserInfo){
                    var configObj = {sClassName:'Vlocity GetUserInfo'};
                    userInfoPromise=this.OmniRemoteInvoke(configObj).then(
                        function(userInfoResult){
                            if (buildFnResultStor)
                                deferred.resolve(buildFnResultStor);
                            else
                                userInfoResultStor = userInfoResult;
                            window.userInfoResult = userInfoResult;
                            thisService.UserInfo = $q.defer();
                            thisService.UserInfo.resolve(userInfoResult);
                        },
                        function(error){
                            deferred.reject(angular.toJson(error));
                        }
                    );
                }
            } else {
                buildfn = VOUINS.BuildJSONWithPrefill;
            }

            buildfn(sType, sSubType, sLang, sPfBundle, sDrParams, multiLangCode, function(result, event)
            {
                $rootScope.$apply(function()
                {
                    if(event.status === true || event.status === 200){
                        if (!userInfoPromise||userInfoResultStor)
                            deferred.resolve(result);
                        else
                            buildFnResultStor = result;
                    } else
                        deferred.reject(event);
                });
            });

            return deferred.promise;
        };

        // VF remote asyn promise
        factory.CompleteScript = function(sInstanceId)
        {
            var deferred = $q.defer();
            VOUINS.CompleteScript(sInstanceId, function(result, event)
            {
                $rootScope.$apply(function()
                {
                    if(event.status)
                        deferred.resolve(result);
                    else
                        deferred.reject(event);
                });
            });
            return deferred.promise;
        };

        factory.VlocityTrack = function(trackingData)
        {
            VOUINS.VlocityTrack(trackingData);
        }

        // VF remote asyn promise
        factory.CreateOSAttachment = function(bodyData, parentId, filename, options, callback)
        {
            var deferred = $q.defer();
            VOUINS.CreateOSAttachment(bodyData, parentId, filename, options, function(result, event)
            {
                $rootScope.$apply(function()
                {
                    if(event.status)
                        deferred.resolve(result);
                    else
                        deferred.reject(event);
                });
            });
            return deferred.promise;
        };

        // soap asyn promise for CreateOSDocumentAttachment
        factory.CreateOSDocumentAttachment = function(bodyData, filename, folderId, contentType, callback)
        {
            var deferred = $q.defer();
            VOUINS.CreateOSDocumentAttachment(bodyData, filename, folderId, contentType, function(result, event)
            {
                $rootScope.$apply(function()
                {
                    if(event.status)
                        deferred.resolve(result);
                    else
                        deferred.reject(result);
                });
            });
            return deferred.promise;
        };

        // VF remote asyn promise
        factory.UpdateOSAttachment = ouiBaseService.UpdateOSAttachment;

        // VF remote asyn promise
        factory.DeleteOSAttachment = function(attachmentId, deleteParent, options, callback)
        {
            var deferred = $q.defer();
            VOUINS.DeleteOSAttachment(attachmentId, deleteParent, options, function(result, event)
            {
                $rootScope.$apply(function()
                {
                    if(event.status)
                        deferred.resolve(result);
                    else
                        deferred.reject(event);
                });
            });
            return deferred.promise;
        };

        // fake async method
        // needed for implement the action framework
        factory.fakeAsync = function(num, fromIndex, input, stage, bSkipSFL)
        {
            var d = $q.defer();

            $timeout(function() {
                d.resolve(num*20);
            }, 0);

            return d.promise;
        };

        // shared variables
        // most of them come from component controller
        factory.sNS = ouiBaseService.sNS;
        factory.sNSC = ouiBaseService.sNSC;
        factory.bpId = sfdcVars.bpId;
        factory.bpType = sfdcVars.bpType;
        factory.bpSubType = sfdcVars.bpSubType;
        factory.bpLang = sfdcVars.bpLang;
        factory.parentObjectId = sfdcVars.parentObjectId;
        //factory.parentObjectLabel = '{!sParentObjectLabel}';
        factory.pfDRBundle = sfdcVars.pfDRBundle;
        // save&resume
        // default is always new
        factory.scriptState = ouiBaseService.scriptState;
        if(factory.scriptState === 'review')
            factory.resumeMode = true;
        else if(factory.scriptState === 'new')
            factory.resumeMode = false;
        else
        {
            factory.resumeMode = false;
            factory.sflMode = true;
        }

        factory.previewMode = ouiBaseService.previewMode;
        factory.debugInformation = [];
        factory.layout = ouiBaseService.layout;
        factory.verticalMode = sfdcVars.verticalMode;
        if(factory.layout === 'lightning' || factory.layout === 'newport')
            factory.verticalMode = true;
        factory.appId = sfdcVars.appId;
        factory.instanceId = sfdcVars.instanceId;
        //factory.bInitialize = true;
        factory.redirectPageTemplateMap = {};
        factory.restResponse = {};
        // Root Element Types
        factory.rootEleTypes = ouiBaseService.rootEleTypes;
        // Action Element Types
        factory.actionEleTypes = ouiBaseService.actionEleTypes;
        // Remote Invoke Element Types
        // Support both pre and post transform
        factory.remoteInvokePrePostEleTypes = ouiBaseService.remoteInvokePrePostEleTypes;
        // Support only post transform
        factory.remoteInvokePostEleTypes = ouiBaseService.remoteInvokePostEleTypes;
        // Support only pre transform
        factory.remoteInvokePreEleTypes = ouiBaseService.remoteInvokePreEleTypes;
        // Element Types excluded from data json generation
        factory.noneDataControlTypeListV2 = ouiBaseService.noneDataControlTypeListV2;
        // None Leaf Element Types
        factory.applyRespSkipTypeList = ouiBaseService.applyRespSkipTypeList;
        // Group Element Types
        factory.groupEleTypeList = ouiBaseService.groupEleTypeList;
        // Element Types which support readOnly/required property
        factory.readOnlyReqEleTypeList = ouiBaseService.readOnlyReqEleTypeList;
        // repeatable elements
        factory.repeatEleTypeList = ouiBaseService.repeatEleTypeList;

        // Select Types
        factory.selectTypeList = ouiBaseService.selectTypeList;

        // Selectable Items, Input Block
        factory.placeholderEleTypeList = ouiBaseService.placeholderEleTypeList;

        // v16 Block type
        factory.blockEleTypeList = ouiBaseService.blockEleTypeList;

        factory.jsonTreeHTMLTmpl = sfdcVars.jsonTreeHTMLTmpl;
        // total OmniScript width, 12 - Bootstrap grid
        factory.bpW = 12;
        // OOTB Element Type to HTML markup map
        // retire Button, Button Remote
        factory.elementTypeToHTMLMap = ouiBaseService.elementTypeToHTMLMap;
        var OmniOnlyMap = { 'Block': 'vlcBlock.html',
                            'Color': 'vlcColor.html',
                            'Radio Hor': 'vlcHorRadio.html',
                            'Remote Action': 'vlcRemoteAction.html',
                            'Rest Action': 'vlcRemoteAction.html',
                            'DataRaptor Extract Action': 'vlcRemoteAction.html',
                            'DataRaptor Post Action': 'vlcRemoteAction.html',
                            'DataRaptor Transform Action': 'vlcRemoteAction.html',
                            'Matrix Action': 'vlcRemoteAction.html',
                            'Integration Procedure Action': 'vlcRemoteAction.html',
                            'Formula': 'vlcFormula.html',
                            'Aggregate': 'vlcFormula.html',
                            'Validation': 'vlcValidation.html',
                            'Calculation Action': 'vlcRemoteAction.html',
                            'Calculation Action Btn': 'vlcRemoteActionBtn.html',
                            'Done Action': 'vlcDoneAction.html',
                            'Done Action Btn': 'vlcRemoteActionBtn.html',
                            'Delete Action' : 'vlcRemoteAction.html',
                            'Delete Action Btn' : 'vlcRemoteActionBtn.html',
                            'Post to Object Action': 'vlcRemoteAction.html',
                            'Review Action': 'vlcDoneAction.html',
                            'Remote Action Btn': 'vlcRemoteActionBtn.html',
                            'Rest Action Btn': 'vlcRemoteActionBtn.html',
                            'DataRaptor Extract Action Btn': 'vlcRemoteActionBtn.html',
                            'DataRaptor Post Action Btn': 'vlcRemoteActionBtn.html',
                            'DataRaptor Transform Action Btn': 'vlcRemoteActionBtn.html',
                            'Matrix Action Btn': 'vlcRemoteActionBtn.html',
                            'Integration Procedure Action Btn': 'vlcRemoteActionBtn.html',
                            'Post to Object Action Btn': 'vlcRemoteActionBtn.html',
                            'Review Action Btn': 'vlcRemoteActionBtn.html',
                            'Submit': 'vlcSubmit.html',
                            'Filter Block': 'vlcFilterBlock.html',
                            'Filter Select': 'vlcFilterItemSelect.html',
                            //'Filter Radio': 'vlcFilterItem.html',
                            'Filter Multi-select': 'vlcFilterItemMSelect.html',
                            'Selectable Item': 'vlcSelectableItemV2.html',
                            'Horizontal Mode Persistent Component': ['vlcHCart.html', 'vlcHKnowledge.html'],
                            'Vertical Mode Persistent Component': ['vlcVCart.html', 'vlcVKnowledge.html'],
                            'SideBar': 'vlcSideBar.html',
                            'StepChart': 'vlcStepChart.html',
                            'OmniMain': 'vlcBPTreeMain.html',
                            'PDF Action': 'vlcRemoteAction.html',
                            'PDF Action Btn': 'vlcRemoteActionBtn.html',
                            'Redirect Action Footer': 'vlcRedirectActionFooter.html',
                            'Redirect Action Button Footer': 'vlcRedirectActionBtnFooter.html',
                            'Review Action Footer': 'vlcReviewActionFooter.html',
                            'Review Action Button Footer': 'vlcReviewActionBtnFooter.html',
                            'Geolocation': 'vlcGeolocation.html',
                            'Auto Save for Later Message': 'vlcAutoSFLMsg.html',
                            'Set Values': 'vlcEmpty.html',
                            'Set Values Btn': 'vlcRemoteActionBtn.html',
                            'Set Errors': 'vlcEmpty.html',
                            'Set Errors Btn': 'vlcRemoteActionBtn.html',
                            'ProdConfText': 'vlcProdConfText.html',
                            'ProdConfNumber':'vlcProdConfNumber.html',
                            'ProdConfCurrency':'vlcProdConfCurrency.html',
                            'ProdConfPercent':'vlcProdConfPercent.html',
                            'ProdConfCheckbox':'vlcProdConfCheckbox.html',
                            'ProdConfPicklist':'vlcProdConfPicklist.html',
                            'ProdConfMulti Picklist':'vlcProdConfMultiPicklist.html',
                            'ProdConfDate':'vlcProdConfDate.html',
                            'ProdConfDatetime':'vlcProdConfDatetime.html',
                            'Input Block': 'vlcInputBlock.html',
                            'DocuSign Envelope Action': 'vlcRemoteAction.html',
                            'DocuSign Envelope Action Btn':'vlcRemoteActionBtn.html',
                            'DocuSign Signature Action Btn':'vlcRemoteActionBtn.html',
                            'Type Ahead Block':'vlcTypeAheadBlock.html',
                            'Type Ahead':'vlcTypeAhead.html',
                            'Email Action': 'vlcRemoteAction.html',
                            'Email Action Btn':'vlcRemoteActionBtn.html',
                            'Error Sub Block': 'vlcErrorSubBlock.html',
                            'Typeahead Dropdown': 'vlcTypeAheadDropdown.html',
                            'Edit Block': 'vlcEditBlock.html',
                            'Radio Group': 'vlcRadioGroup.html'
                          };

        $.extend( factory.elementTypeToHTMLMap, OmniOnlyMap );
        // Detect mobile browser
        factory.isMobileBrowser = /mobile|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
        // mobile
        factory.bMobile = sfdcVars.bMobile;
        // custom Element Type to HTML markup map - to overwrite default html template for a control or introduce custom type
        factory.eleTypeToHTMLTemplateMap = sfdcVars.eleTypeToHTMLTemplateMap;
        factory.channel = sfdcVars.channel;
        if(Object.getOwnPropertyNames(factory.eleTypeToHTMLTemplateMap).length === 0)
        {
            if(factory.channel === 'community' )
                factory.eleTypeToHTMLTemplateMap = {'Step': 'vlcCommunitiesStep.html'};
            else if(factory.channel === 'mobile')
            {
                factory.eleTypeToHTMLTemplateMap = {'Checkbox': 'vlcSwitch.html', 'Radio': 'vlcMobileRadio.html',
                                                    'SideBar' : 'vlcMobileSideBar.html', 'Disclosure': 'vlcMobileDisclosure.html',
                                                    'Select':'vlcMobileSelect.html', 'Multi-select': 'vlcMobileSelectItem.html',
                                                    'Range': 'vlcMobileRange.html', 'Step': 'vlcMobileStep.html',
                                                    'Time': 'vvlcMobileTime.html', 'Date/Time (Local)': 'vlcMobileDatetime-local.html',
                                                    'Currency': 'vlcMobileCurrency.html', 'Date': 'vlcMobileDate.html',
                                                    'Review Action Footer': 'vlcMobileReviewActionFooter.html', 'Geolocation': 'vlcMobileGeolocation.html',
                                                    'Selectable Items': 'vlcMobileSelectableItems.html', 'Selectable Item': 'vlcMobileSelectableItem.html',
                                                    'Filter Block': 'vlcMobileFilterBlock.html', 'Horizontal Mode Persistent Component': 'vlcMobileHCart.html',
                                                    'Vertical Mode Persistent Component': 'vlcMobileVCart.html',
                                                    'Filter Multi-select': 'vlcMobileFilterItemMSelect.html', 'OmniMain': 'vlcMobileBPTreeMain.html',
                                                    'Auto Save for Later Message': 'vlcEmpty.html'};
                factory.bMobile = true;
            }
        }

        // OmniOut, process queryParam
        factory.internalUrlKeyList = ['tabKey','previewEmbedded','designerPreviewId','OmniScriptType','OmniScriptSubType','OmniScriptLang','PrefillDataRaptorBundle',
                                      'scriptMode', 'OmniScriptInstanceId','OmniScriptId','OmniScriptApplicationId',
                                      'loadWithPage'];

        // used for show/hide expression
        factory.showExprData = {};
        // used for overwriting the HTML templates defined in the script def
        factory.overwriteHTMLTemplateMapping = sfdcVars.overwriteHTMLTemplateMapping;
        factory.oSCurrencyCode = sfdcVars.oSCurrencyCode;
        factory.oSCurrencyCodeAttr = sfdcVars.oSCurrencyCodeAttr;
        if(Object.getOwnPropertyNames(factory.overwriteHTMLTemplateMapping).length === 0)
        {
            if(factory.channel === 'mobile')
            {
                factory.overwriteHTMLTemplateMapping = {'vlcApplicationConfirmationV2.html':'vlcMobileReview.html',
                                                        'vlcApplicationConfirmation.html':'vlcMobileReview.html',
                                                        'vlcApplicationAcknowledgeV2.html': 'vlcMobileConfirmation.html',
                                                        'vlcSaveForLaterAcknowledge.html':'vlcMobileSaveForLater.html',
                                                        'vlcCartSummary.html': 'vlcMobileCartSummary.html',
                                                        'vlcAcknowledge.html': 'vlcMobileConfirmation.html',
                                                        'vlcSelectableItem.html': 'vlcMobileSelectableItem.html',
                                                        'vlcSmallItems.html': 'vlcMobileSmallItems.html',
                                                        'vlcSelectableItemV2.html': 'vlcMobileSelectableItem.html',
                                                        'vlcSmallItemsV2.html': 'vlcMobileSmallItems.html'}
            }
        }
        // validateExpression
        factory.validateExprData = {};

        factory.isInConsole = typeof sforce !== 'undefined' && sforce !== null && sforce.console !== undefined && sforce.console !== null && sforce.console.isInConsole();

        // pfJSON should be flat (except for Select, Multi-select, Radio, Lookup, Filter, etc.)
        factory.pfJSON = ouiBaseService.pfJSON;
        factory.pfJSONFill = {};

        // knowledgeKeyword map
        factory.stepKnowledgeKWMap = {};
        factory.stepKnowledgeDataCatMap = {};

        // persistent component and selectable JS Data preprocessor
        factory.dataPreprocessorMap = ouiBaseService.dataPreprocessorMap;

        // v12, url Pattern to launch OS
        factory.urlMode = false;

        // v102, Multi-lang support
        factory.incQueryParams = {'layout':'','LanguageCode':''};

        // For Future use
        //factory.pfJSONLookup = null;
        factory.generateJSONLookupTable = function(obj, lookup)
        {
            for(var key in obj)
            {
                if(obj.hasOwnProperty(key))
                {
                    if("object" == typeof(obj[key]))
                    {
                        this.generateJSONLookupTable(obj[key], lookup);
                    }

                    lookup[key] = obj[key];
                }
            }
        };
        ////////////////////////////


        // Aggregate
        // recursive function to handle data json generation
        // whenver the user changes any input Element in the script, this function will be called to update the nested data json
        // this is also called when the remote call response is applied to the script, when the user repeat an Element
        // @param
        // scp - element scope
        // arrayIndex - for repeated Element, array index
        // indexInParent - for Elements under the same parent, index
        // bUIUpdate - whether the change is triggered from UI update or not
        // addOrRemoveIndex - for repeated Elements, add or remove index
        factory.aggregate = ouiBaseService.aggregate;

        // 3.0: handle Select and Radio as well, for Data JSON, we now only want the LIC portion for
        // Select and Radio and Multi-select
        // Multi-select and Filter Multi-select
        // requires special handling to match SFDC convention
        // aaa;bbb;ccc
        // @param
        // response - ui response
        factory.handleSelect = ouiBaseService.handleSelect;

        ////////////////////////////
        // for future use
        factory.nameSpaceStep = function(eleNode, ns)
        {
            if(eleNode)
            {
                eleNode.name = ns + '__' + eleNode.name;
                if(eleNode.propSetMap.show)
                    this.nameSpaceShowProp(eleNode.propSetMap.show, ns);

                if(eleNode.children.length === 0)
                    return;
                else
                {
                    for(var i=0; i<eleNode.children.length; i++)
                    {
                        for(var j=0; j<eleNode.children[i].eleArray.length; j++)
                        {
                            this.nameSpaceStep(eleNode.children[i].eleArray[j], ns);
                        }
                    }
                }
            }
        };

        factory.nameSpaceShowProp = function(showProp, ns)
        {
            if(showProp && showProp.group && showProp.group.rules && showProp.group.rules.length > 0)
            {
                for(var i=0; i<showProp.group.rules.length; i++)
                {
                    if(showProp.group.rules[i].field)
                    {
                        var substrArray = showProp.group.rules[i].field.split(':');
                        var newField = '';
                        if(substrArray)
                        {
                            for(var j=0; j<substrArray.length; j++)
                            {
                                substrArray[j] = ns + '__' + substrArray[j];
                                newField += substrArray[j];
                                if(j < substrArray.length-1)
                                    newField += ':';
                            }
                            showProp.group.rules[i].field = newField;
                        }
                    }
                    else if(showProp.group.rules[i].group)
                    {
                        this.nameSpaceShowProp(showProp.group.rules[i], ns);
                    }
                    else
                        return;
                }
            }
        };
        ////////////////////////////

        factory.getHTMLTemplate = function(templateId)
        {
            if(this.overwriteHTMLTemplateMapping[templateId])
                return this.overwriteHTMLTemplateMapping[templateId];
            else
                return templateId;
        };

        factory.generateHyperLinks = function(){
            //replacing docName with ids
            function replaceIds(input, dMap, idTag){
                (!dMap || !(input)) && (function(){
                    console.log('links were broken');
                    return '';
                }());

                var output = input;
                for( var key in dMap){
                    //console.log('key is' + key);
                    var re = new RegExp('docName=' + key, 'g');
                    if (dMap.hasOwnProperty(key)){
                        output = output.replace(re, idTag + dMap[key]);
                        //console.log(output);
                    }
                }
                //console.log('final output');
                //console.log(output);
                return output;
            }

            return function generateHyperLinks(input, dMap){
                if (input.html) {
                    var idTag = 'id=';
                    if (/FileDownload/.test(input.html)){
                        idTag = 'file=';
                    }
                    var replacedOutput = input.html.replace(new RegExp(idTag), 'docName=');
                    if (input.trustedHtml) {
                        return replaceIds(replacedOutput, dMap, idTag);
                    }else{
                        return $sce.trustAsHtml(replaceIds(replacedOutput, dMap, idTag));
                    }
                }
            };

        }();

        return factory;
    }]);

},{}],70:[function(require,module,exports){
angular.module('vlocity-oui-common')
    .factory('uiStateService', ['$rootScope', '$injector', function($rootScope, $injector) {

    		var $sldsToast;

    		try{
    			$sldsToast = $injector.get("$sldsToast");
    		} catch (error) {
    			console.warn('Asynchronous Loading Messaging only works on Lightning and Newport Players. Asynchronously fired actions will not message the UI');
    		}
	        
	        if ($sldsToast){
	        	$rootScope.$on("uiStateService.actionComplete", function loadingServiceToast (event, configObj){
	        		// HAVE TO GET INTERNATIONALIZATION SUPPORT
	        		if (configObj.label.stage && (configObj.label.stage=="PreTransform" || configObj.label.stage==="PreTransform"))
	        			return;
	        		var config = {
	        			title: "Action Completed",
	        			content: "The action " + configObj.label.label + " has completed.",
	        			templateUrl: "vlcNotifyToast.html",
	        			container:".via-slds"
	        		};
	        		$sldsToast(config);
	        	});
	        }

	        var factory = {
	        	logAction: logAction,
	        	logBlocker: logBlocker
	        };

	        initRootScopeState($rootScope);

	        // Main mechanism to log promises to scope
	        // @param
	        // @prom - the promise being watched for loading state
	        // @configObj - the promise's configuration information in a map
	        // @logType - a mode selector, false, undefined or null for default behavior, mostly for fire and forget
	        // @scpOverride - an optional override for the scope, mostly for non-blocking actions
	        function logAction (prom, configObj, scpOverride, element) {
	        	var log,entry,async,scp;

	        	if (element.propSetMap.invokeMode){
	        		async = !scpOverride;
	        		scp = scpOverride || $rootScope;
	        	} else {
	        		async = false;
	        		scp = $rootScope;
	        	}

	        	if (!(scp.hasOwnProperty("actionLogs"))){
	        		initScopeState(scp);
	        	}

	        	log = async?'asyncActions':'actions';

	        	entry = {
	        		promise:prom
	        	};
	        	scp.actionLogs[log].push(entry);
	        	prom.finally(dereg);

	        	function dereg(){
	        		var promInd = scp.actionLogs[log].findIndex(function(entry){return angular.equals(prom,entry.promise);});
	        		if(-1 !== promInd){
	        			scp.actionLogs[log].splice(promInd,1);
	        		} 
	        		if ((element && element.propSetMap && element.propSetMap.toastComplete && configObj))
	        			scp.$emit("uiStateService.actionComplete",configObj);
	        	}

	        	return prom;
	        }

	        function logBlocker (instance) {
	        	var scp = $rootScope;

	        	if (!(scp.hasOwnProperty("blockerLog"))){
	        		initRootScopeLog(scp);
	        	}

	        	if (!instance.destroy){
	        		return;
	        	}

	        	entry = {
	        		instance:instance
	        	};

	        	scp.blockerLog.blockers.push(entry);

	        	var _destroy = instance.destroy;
	        	instance.destroy = function destroyWrapper(){
	        		dereg();
	        		return _destroy.apply(instance,arguments);
	        	};

	        	function dereg(){
	        		var index = scp.blockerLog.blockers.findIndex(function(entry){return angular.equals(instance,entry.instance);});
	        		if(-1 !== index){
	        			scp.blockerLog.blockers.splice(index,1);
	        		}
	        	}

	        	return instance;
	        }

	        function initScopeState (scope) {
	        	scope.actionLogs = {
	        		actions: [],
		        	asyncActions: [],
		        	baseflag: $rootScope.loading
	        	};

		        Object.defineProperty(scope,"loading",{
		            set: function(val){
		                this.actionLogs.baseflag = val;
		            },
		            get: function(){
		                return this.actionLogs.baseflag || this.actionLogs.actions.length > 0;
		            }
		        });
	        }

	        function initRootScopeState (scope) {
	        	if (scope.$root!==scope){
	        		return false;
	        	}

	        	scope.blockerLog = {
	        		blockers: [],
		        	baseflag: false
	        	};

		        Object.defineProperty(scope,"locked",{
		            set: function(val){
		                this.blockerLog.baseflag = val;
		            },
		            get: function(){
		            	var output = false;
		            	if (this.loading || this.blockerLog.baseflag){
		            		return true;
		            	}
		            	var empties = [];
		            	var entry;
		            	for (var i = 0; i < this.blockerLog.blockers.length; i++){
		            		entry = this.blockerLog.blockers[i];
	            			if (entry && entry.instance){
	            				if (!entry.instance.hasOwnProperty('$isShown') || entry.instance.$isShown){
            						output = true;
            						break;
            					}
	            			} else {
	            				empties.push(i);
	            			}
		            	}
		            	for (i = 0; i < empties.length; i++){
		            		blockerLog.blockers.splice(empties[i]-i,1);
		            	}
		                return output;
		            }
		        });

	        	initScopeState(scope);
	        }

	        return factory;
	    }

	]);

},{}],71:[function(require,module,exports){
        // v11 release - loading time performance improvement
        // code base for OmniScript player, moved out from components

        // IE console.log issue
        if(typeof console === "undefined")
            console = {};

        if(typeof console.log === "undefined")
            console.log= function() {};

        // JS REST Toolkit
        // in order to call Apex REST APIs from JS
        if(window.sessionId === '{!$Api.Session_ID}')
            window.OmniOut = true;
        if(window.sessionId !== 'NULL_SESSION_ID' && !window.OmniOut)
        {
            window.forceTKClient = new forcetk.Client();
            window.forceTKClient.setSessionToken(window.sessionId);
        }
        else if(!window.OmniOut)
        {
            var customPath = '';
            if(location.pathname !== undefined && location.pathname !== null)
            {
                var pathList = location.pathname.split("/");
                if(pathList !== undefined && pathList !== null && pathList.length > 1 && pathList[1] !== 'apex'
                   && pathList[1] !== '')
                {
                    customPath = pathList[1];
                }
            }
            var proxyURL = location.protocol + "//" + location.hostname;
            if(customPath !== '')
                proxyURL += '/' + customPath;
            proxyURL += "/services/proxy";
            window.forceTKClient = new forcetk.Client(undefined, undefined, proxyURL);
            var instanceURL = location.hostname;
            instanceURL = 'https://' + instanceURL;
            if(customPath !== '')
                instanceURL += '/' + customPath;
            window.forceTKClient.authzHeader = null;
            window.forceTKClient.setSessionToken(window.sessionId, 'v27.0', instanceURL);
        }
        var historyCount = window.history.length;

        // load angular modules
        if(moduleList === 'default')
        {
        	moduleList = ['ngSanitize',
                          'ngRoute',
                          'ui.mask',
                          'json-tree',
                          'mgcrea.ngStrap',
                          'ui.bootstrap',
                          'jsonFormatter',
                          'ui.utils.masks',
                          'leaflet-directive',
                          'viaDirectives',
                          'forceng',
                          'sharedObjectService',
                          'vlocity-oui-common'
                         ];

            //modules to be laoded based on omniout or not
            if (window.OmniOut){
                moduleList.push('vlocity-omni-out');
            }else{
                moduleList.push('vlocity-omni-knowledge');
            }

            //url takes the priority
            var animate = sfdcVars.animate && !(/animate=false/.test(window.location.href));

            //make url higher prioriy
            if (/animate=true/.test(window.location.href)){
                animate = true;
            }

            if(animate){
            	moduleList.push('ngAnimate');
            }

            if(sfdcVars.layout === 'lightning' || sfdcVars.layout === 'newport'){
                //moduleList.push('sldsangular');
                //if its lightning we don't need ui.bootstrap
                var index = moduleList.indexOf('ui.bootstrap');
                moduleList.splice(index,1,'sldsangular');
                moduleList.push('VlocityDynamicForm');
                moduleList.push('ngAria');
                console.debug(moduleList);
            }

        }


        bpModule = angular.module('vlocity-business-process', moduleList);
        //this is for backward comptability since the legacy code expect bpModule as global
        window.bpModule = angular.module('vlocity-business-process');

        /**
         * Filter an array of items by comparing passed key strictly.
         * @param
         * @return Filtered Items
         */
        bpModule.filter('filterMultiple',['$filter',function ($filter) {
            return function (items, keyObj) {
                var filterObj = {
                    data:items,
                    filteredData:[],
                    applyFilter : function(obj,key){
                        var fData = [];
                        if(this.filteredData.length == 0)
                            this.filteredData = this.data;
                        if(obj){
                            var fObj = {};
                            if(angular.isString(obj)){
                                fObj[key] = obj;
                                fData = fData.concat($filter('filter')(this.filteredData,fObj));
                            }else if(angular.isArray(obj)){
                                if(obj.length > 0){
                                    for(var i=0;i<obj.length;i++){
                                        if(angular.isString(obj[i])){
                                            fObj[key] = obj[i];
                                            fData = fData.concat($filter('filter')(this.filteredData,fObj,true));
                                        }
                                    }
                                }
                            }
                            this.filteredData = fData;
                        }
                    }
                };
                if(keyObj && items){
                    angular.forEach(keyObj,function(obj,key){
                        filterObj.applyFilter(obj,key);
                    });
                }
                return filterObj.filteredData;
            }
        }]);

        bpModule.filter('filterProductsItems',['$filter',function ($filter) {
            return function (items, keyObj) {
                var filterObj = {
                    data:items,
                    filteredData:[],
                    applyFilter : function(obj,key){
                        var fData = [];
                        if(this.filteredData.length == 0)
                            this.filteredData = this.data;
                        if(obj) {
                            var fObj = {},
                                key = obj[0]+key;
                            if(angular.isArray(obj)){
                                if(obj.length > 0){
                                    for(var i=1;i<obj.length;i++){
                                        if(angular.isString(obj[i])){
                                            fObj[key] = {value:obj[i]};
                                            fData = fData.concat($filter('filter')(this.filteredData,fObj,true));
                                        }
                                    }
                                }
                            }
                            this.filteredData = fData;
                        }
                    }
                };
                if(keyObj && items){
                    angular.forEach(keyObj,function(obj,key){
                        filterObj.applyFilter(obj,key);
                    });
                }
                return filterObj.filteredData;
            }
        }]);

        function nullifySrvErr(eleNode)
        {
            if(eleNode)
            {
                if(eleNode.srvErr)
                    eleNode.srvErr = null;
                if(eleNode.children.length === 0)
                    return;
                else
                {
                    for(var i=0; i<eleNode.children.length; i++)
                    {
                        for(var j=0; j<eleNode.children[i].eleArray.length; j++)
                        {
                            nullifySrvErr(eleNode.children[i].eleArray[j]);
                        }
                    }
                }
            }
        };

        function nullifyBlockResponse(value)
        {
            var returnVal = value;
            if(value === true)
                returnVal = false;
            else if(value.constructor === Object)
            {
                for (var key in value)
                {
                    if(value.hasOwnProperty(key))
                    {
                        var data = value[key];
                        if(data)
                            returnVal[key] = nullifyBlockResponse(data);
                    }
                }
            }
            else if(angular.isArray(value))
            {
                for(var i=0; i<value.length; i++)
                    if(value[i])
                        returnVal[i] = nullifyBlockResponse(value[i]);
            }
            else
                returnVal = null;

            return returnVal;
        };

        function searchSrvErr(eleNode, result)
        {
            if(eleNode)
            {
                if(eleNode.srvErr)
                {
                    result.bFound = true;
                }
                if(eleNode.children.length === 0)
                    return;
                else
                {
                    for(var i=0; i<eleNode.children.length; i++)
                    {
                        for(var j=0; j<eleNode.children[i].eleArray.length; j++)
                        {
                            searchSrvErr(eleNode.children[i].eleArray[j], result);
                        }
                    }
                }
            }
        };

        function startWatch(step)
        {
            if(!step.watchStarted)
            {
                step.StartMilliseconds = new Date().getTime();
                step.watchStarted = true;
            }
        };

        function stopWatch(step)
        {
            if(step.watchStarted === true)
            {
                step.ElapsedMilliseconds = (new Date().getTime() - step.StartMilliseconds);
                step.StartMilliseconds = 0; // reset
            }
            //step.watchStarted = false;
        };

        function checkAgainstOptions(response, options, type) {
            switch(type)
            {
                case 'Select':
                case 'Radio':
                	if(angular.isArray(options)) {
                    	var key = (response.constructor === Object)?(response.name):(response);
                		for(var i=0; i<options.length; i++) {
                			if(options[i].name && options[i].name === key)
                				return {valid: true, index: i};
                		}
                	}
                    break;
                case 'Multi-select':
                    var resp = null;
                    if(angular.isArray(response) && angular.isArray(options)) {
                        if(options.length > 0) {
                            resp = angular.copy(options);
                            for(var i=0; i<resp.length; i++) {
                                if(existInOptions(response, resp[i].name)) {
                                    resp[i].selected = true;
                                    options[i].selected = true;
                                }
                                else {
                                    resp[i].selected = false;
                                    delete options[i].selected;
                                }
                            }
                        }
                        return {valid: true, resp: resp};
                    }
                    break;
            }

        	return {valid: false, index: null};
        };

        function existInOptions(array, key) {
        	if(angular.isArray(array)) {
        		for(var i=0; i<array.length; i++) {
        			if(array[i].selected === true && array[i].name === key)
        				return true;
        		}
        	}

        	return false;
        }

        // NOTE, need to modify this once Edit Block supports more than one level
        function resetNoFormatter(control) {
            if(control && angular.isArray(control.children) && control.children.length > 0) {
                for(var i=0; i<control.children.length; i++) {
                    for(j=0; j<control.children[i].eleArray.length; j++) {
                        delete control.children[i].eleArray[j].noformatterebmodal;
                    }
                }
            }
        }

        // SKY CPQ
        // Fitler to handle currency display
        // input is a String
        bpModule.filter('numFormatFilter', function(bpService){
            return function(input) {
                var formatted="";
                if(input)
                {
                    for (var i = 0; i < input.length; i++){
                        if (input[i] == ",") {
                            formatted += sfdcVars.thousandSep;
                        } else if (input[i] == ".") {
                            formatted += sfdcVars.decimalSep;
                        } else {
                            formatted += input[i];
                        }
                    }
                }
                return formatted;
            };
        });

        // initiated from Manulife demo
        // input is a number
        bpModule.filter('numFormatFilter1', function(bpService){
          return function(input) {
              var formatted="";
              if(input)
                  formatted=input.toFixed(2);
              return formatted;
          };
        });

        /*
        This directive allows us to pass a function in on an enter key to do what we want.
         */
        bpModule.directive('ngEnter', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    element.bind("keydown keypress", function (event) {
                        if(event.which === 13) {
                            ngModelCtrl.$commitViewValue();
                            scope.$apply(function (){
                                scope.$eval(attrs.ngEnter);
                            });

                            event.preventDefault();
                        }
                    });
                }
            };
        });

        // directive - for vlc-slds__border focus
        bpModule.directive('vlcSldsBorder', [
            function() {
                return {
                    restrict: 'C',
                    link: function (scope, element, attr) {
                        if(scope.loopform && scope.loopform.loopname && scope.loopform.loopname.$$element){
                            scope.loopform.loopname.$$element.on('focus',function(){
                                element.addClass('vlc-slds__border--focus');
                            });
                            scope.loopform.loopname.$$element.on('blur',function(){
                                element.removeClass('vlc-slds__border--focus');
                            });
                        }
                    }
               };
        }]);

        // main directive - render the nested script tree
        bpModule.directive('child', function ($compile, $templateCache, bpService, $sce)
        {
            return {
                restrict: "E",
                replace: true,
                transclude: true,
                require: '?ngModel',
                scope: false,
                link: function (scope, ele, attrs, ngModel) {
                    if(scope.child.level === 0)
                    {
                        // v102 Multi-lang
                        if(bpService.bMultiLang) {
                            scope.child.propSetMap.label = scope.bpTree.labelKeyMap[scope.bpTree.labelMap[scope.child.name]];
                            if(VOUINS.ootbLabelMap.hasOwnProperty(scope.child.type)) {
                                VOUINS.handleMultiLangLabel(scope.child, scope.bpTree.labelKeyMap);
                            }
                        }

                        // 3.0 upgrade
                        // Step uses ng-show, so even hidden Steps will go through initialization
                        if(scope.child.type === 'Step')
                        {
                            if(!scope.child.propSetMap.saveLabel)
                                scope.child.propSetMap.saveLabel = 'Save for later';
                            if(!scope.child.propSetMap.saveMessage)
                                scope.child.propSetMap.saveMessage = 'Are you sure you want to save it for later?';
                            if(!scope.child.propSetMap.completeLabel)
                                scope.child.propSetMap.completeLabel = 'Complete';
                            if(!scope.child.propSetMap.completeMessage)
                                scope.child.propSetMap.completeMessage = 'Are you sure you want to complete the script?';

                            if (scope.child.propSetMap.instruction || (bpService.bMultiLang && scope.child.propSetMap.instructionKey)){
                                //console.log(scope.bpTree); // this is the object that the server returns from the bp tree
                                var dMap = scope.bpTree.dMap;
                                //console.log(scope.child.propSetMap.instruction);

                                var instruc = (bpService.bMultiLang)?scope.child.propSetMap.instructionKey:scope.child.propSetMap.instruction;

                                scope.child.propSetMap.instructionDisplay = bpService.generateHyperLinks({
                                    html:  instruc,
                                    trustedHtml: false
                                }, dMap);

                            }

                            if(scope.child.bAccordionActive === true)
                                scope.bpTree.asIndex = scope.child.indexInParent;
                        }

                        if(scope.child.propSetMap.showPersistentComponent === undefined || scope.child.propSetMap.showPersistentComponent === null)
                            scope.child.propSetMap.showPersistentComponent = true;

                        scope.child.open = (bpService.verticalMode===true)?(scope.child.bAccordionOpen):(true);

                        // very first load and NOT save&resume case
                        //if(bpService.bInitialize === true && bpService.scriptState !== 'saveAndResume')
                        if(!scope.child.bInit && (bpService.scriptState !== 'saveAndResume' && bpService.scriptState !== 'review'))
                        {
                            var inheritedShowProp = scope.child.inheritShowProp;
                            var eleShowProp = scope.child.propSetMap.show;
                            if(inheritedShowProp !== undefined && inheritedShowProp !== null)
                            {
                                 if(inheritedShowProp && inheritedShowProp.group && inheritedShowProp.group.rules.length === 0)
                                     // do nothing
                                     ;
                                 else
                                 {
                                     if(eleShowProp !== undefined && eleShowProp !== null)
                                     {
                                         if(eleShowProp && eleShowProp.group && eleShowProp.group.rules.length === 0)
                                             scope.child.propSetMap.show = inheritedShowProp;
                                         else
                                             // merge
                                             scope.child.propSetMap.show = {"group": {"operator": "AND","rules": [eleShowProp, inheritedShowProp]}};
                                     }
                                     else
                                         scope.child.propSetMap.show = inheritedShowProp;
                                 }
                            }
                            scope.child.bInit = true;
                        }

                        var htmlId = bpService.elementTypeToHTMLMap[scope.child.type];
                        if(scope.child.propSetMap.HTMLTemplateId) {
                            scope.child.propSetMap.HTMLTemplateId = bpService.getHTMLTemplate(scope.child.propSetMap.HTMLTemplateId);
                            htmlId = scope.child.propSetMap.HTMLTemplateId;
                        }

                        var htmlMarkup = $templateCache.get(htmlId);
                        $compile(htmlMarkup)(scope, function(cloned, scope){
                            ele.append(cloned);
                        });
                    }
                    else if(angular.isArray(scope.child.eleArray[0].children))
                    {
                        //This attribute is for edit block controls only
                    	if(attrs.noformatterebmodal !== undefined)
                            scope.child.eleArray[0].noformatterebmodal = attrs.noformatterebmodal;

                        for(var i=0; i<scope.child.eleArray.length; i++)
                        {
                            // v102 Multi-lang
                            if(bpService.bMultiLang) {
                                if(scope.child.eleArray[i].type !== 'Headline' && scope.child.eleArray[i].type !== 'Type Ahead Block') {
                                    var nameKey = scope.child.eleArray[i].name;
                                    if(scope.child.eleArray[i].type === 'Type Ahead') {
                                        nameKey += '-Block';
                                    }
                                    scope.child.eleArray[i].propSetMap.label = scope.bpTree.labelKeyMap[scope.bpTree.labelMap[nameKey]];
                                }
                                if(VOUINS.ootbLabelMap.hasOwnProperty(scope.child.eleArray[i].type)) {
                                    VOUINS.handleMultiLangLabel(scope.child.eleArray[i], scope.bpTree.labelKeyMap);
                                }
                                if(scope.child.eleArray[i].type === 'Disclosure') {
                                    scope.child.eleArray[i].propSetMap.text = scope.child.eleArray[i].propSetMap.textKey;
                                }

                            }

                            // show/hide, req, ro
                            if(!scope.child.eleArray[i].propSetMap.show)
                            {
                                scope.child.eleArray[i].show = true;
                            }
                            else
                            {
                                if(scope.child.eleArray[i].propSetMap.conditionType === 'Optional if False')
                                {
                                    if(scope.child.eleArray[i].show === undefined)
                                        scope.child.eleArray[i].show = true;
                                }
                                else if(scope.child.eleArray[i].propSetMap.conditionType === 'Readonly if False')
                                {
                                    if(scope.child.eleArray[i].show === undefined)
                                        scope.child.eleArray[i].show = true;
                                }
                                else
                                {
                                    if(scope.child.eleArray[i].show === undefined)
                                        scope.child.eleArray[i].show = false;
                                }
                            }

                            if(bpService.readOnlyReqEleTypeList.indexOf(scope.child.eleArray[0].type) >= 0) {
                                if(scope.child.eleArray[i].ro === undefined || scope.child.eleArray[i].ro === null)
                                    scope.child.eleArray[i].ro = scope.child.eleArray[i].propSetMap.readOnly;

                                if(scope.child.eleArray[i].req === undefined || scope.child.eleArray[i].req === null)
                                    scope.child.eleArray[i].req = scope.child.eleArray[i].propSetMap.required;
                            }

                            if(scope.child.eleArray[i].type === 'Currency') {
                                if(scope.child.eleArray[i].propSetMap.mask === undefined ||
                                    scope.child.eleArray[i].propSetMap.mask === null)
                                    scope.child.eleArray[i].propSetMap.mask = 2;
                                if(scope.child.eleArray[i].propSetMap.allowNegative === undefined ||
                                    scope.child.eleArray[i].propSetMap.allowNegative === null)
                                    scope.child.eleArray[i].propSetMap.allowNegative = false;
                                if(scope.child.eleArray[i].propSetMap.hideGroupSep === undefined ||
                                    scope.child.eleArray[i].propSetMap.hideGroupSep === null)
                                    scope.child.eleArray[i].propSetMap.hideGroupSep = false;
                            }

                            if(scope.child.eleArray[i].type === 'Range') {
                                if(scope.child.eleArray[i].propSetMap.step === undefined || scope.child.eleArray[i].propSetMap.step === null)
                                    scope.child.eleArray[i].propSetMap.step = 1;
                            }

                            if((scope.child.eleArray[i].type === 'Date' || scope.child.eleArray[i].type === 'Date/Time (Local)') && !scope.child.eleArray[i].bInit) {
                                scope.child.eleArray[i].bInit = true;
                            }
                        }

                        //html massaging for Text Block and Headline - headline done - no need to $sce since the hrml ad already been parsed
                        if(scope.child.eleArray[0].type === 'Text Block' &&
                            ( ( (scope.child.eleArray[0].propSetMap.value === undefined || scope.child.eleArray[0].propSetMap.value === null) && !bpService.bMultiLang)
                            || bpService.bMultiLang) ) {
                               var textBlock = scope.child.eleArray[0];
                               var textVal = (bpService.bMultiLang)?textBlock.propSetMap.textKey:textBlock.propSetMap.text;
                               textBlock.propSetMap.text = textVal;
                               textVal && textVal.match(/(href|src)/) && (function(){
                                   textBlock.propSetMap.text = bpService.generateHyperLinks({
                                       html:  textVal,
                                       trustedHtml: true
                                   }, scope.bpTree.dMap);
                               }());

                               scope.child.eleArray[0].propSetMap.value = scope.child.eleArray[0].propSetMap.text;

                        }
                        else if(scope.child.eleArray[0].type === 'Headline' &&
                                (((scope.child.eleArray[0].propSetMap.value === undefined || scope.child.eleArray[0].propSetMap.value === null) && !bpService.bMultiLang)
                                 || bpService.bMultiLang) ) {
                                var headline = scope.child.eleArray[0]; //nesting into prototypes makes the chain walk slow
                                var labelVal = (bpService.bMultiLang)?headline.propSetMap.labelKey:headline.propSetMap.label;
                                headline.propSetMap.label = labelVal;
                                labelVal && labelVal.match(/(href|src)/) && (function(){
                                    headline.propSetMap.label = bpService.generateHyperLinks({
                                        html:  labelVal,
                                        trustedHtml: true
                                    },scope.bpTree.dMap);
                                }());

                                scope.child.eleArray[0].propSetMap.value = scope.child.eleArray[0].propSetMap.label;
                        }
                        else if(scope.child.eleArray[0].type === 'Filter Block')
                        {
                            if(scope.child.eleArray[0].open === undefined || scope.child.eleArray[0].open === null)
                                scope.child.eleArray[0].open = true;
                        }
                        else if(scope.child.eleArray[0].type === 'Selectable Items')
                        {
                            scope.child.eleArray[0].itemsKey = scope.child.eleArray[0].propSetMap.itemsKey;
                            if(!scope.child.eleArray[0].itemsKey)
                                scope.child.eleArray[0].itemsKey = 'recSet';
                            if(scope.child.eleArray[0].vlcSI === undefined || scope.child.eleArray[0].vlcSI === null)
                                scope.child.eleArray[0].vlcSI = {};
                        }
                        else if(scope.child.eleArray[0].type === 'Input Block')
                        {
                            if(scope.child.eleArray[0].vlcInputBlock === undefined || scope.child.eleArray[0].vlcInputBlock === null)
                                scope.child.eleArray[0].vlcInputBlock = {};
                        }
                        // v16, Edit Block, unlike Block, for Edit Block, we don't want the default element
                        else if(scope.child.eleArray[0].type === 'Edit Block' && scope.child.eleArray[0].children.length > 0
                                && !scope.child.eleArray[0].response) {
                            if(bpService.bMultiLang) {
                                VOUINS.handleEditBlockLabel(scope.child.eleArray[0].children, scope.bpTree.labelKeyMap, scope.bpTree.labelMap);
                            }
                        	scope.child.eleArray[0].childrenC = angular.copy(scope.child.eleArray[0].children);
                        	scope.child.eleArray[0].children = [];
                        }

                        //var htmlMarkup = getTemplate(scope.child.eleArray[0].type);
                        var type = scope.child.eleArray[0].type;
                        if(bpService.actionEleTypes.indexOf(scope.child.eleArray[0].type) >=0)
                        {
                            type = type + ' Btn';
                            if(scope.child.eleArray[0].propSetMap.showPersistentComponent === undefined ||
                               scope.child.eleArray[0].propSetMap.showPersistentComponent === null)
                                scope.child.eleArray[0].propSetMap.showPersistentComponent = true;
                        }
                        if(scope.child.eleArray[0].type === 'Filter')
                        {
                            type = type + ' ' + scope.child.eleArray[0].propSetMap.type;
                        }

                        var htmlId = bpService.elementTypeToHTMLMap[type];
                        if(bpService.placeholderEleTypeList.indexOf(scope.child.eleArray[0].type) < 0 && scope.child.eleArray[0].propSetMap.HTMLTemplateId) {
                            scope.child.eleArray[0].propSetMap.HTMLTemplateId = bpService.getHTMLTemplate(scope.child.eleArray[0].propSetMap.HTMLTemplateId);
                            htmlId = scope.child.eleArray[0].propSetMap.HTMLTemplateId;
                        }

                        var htmlMarkup = $templateCache.get(htmlId);
                        if(scope.child.eleArray[0].type === 'Selectable Items')
                        {
                            if(!scope.child.eleArray[0].propSetMap.HTMLTemplateId)
                                scope.child.eleArray[0].propSetMap.HTMLTemplateId = scope.bpTree.dfSITmpl;
                            scope.child.eleArray[0].propSetMap.HTMLTemplateId = bpService.getHTMLTemplate(scope.child.eleArray[0].propSetMap.HTMLTemplateId);
                        }
                        if(scope.child.eleArray[0].type === 'Input Block')
                        {
                            scope.child.eleArray[0].propSetMap.HTMLTemplateId = bpService.getHTMLTemplate(scope.child.eleArray[0].propSetMap.HTMLTemplateId);
                        }
                        $compile(htmlMarkup)(scope, function(cloned, scope){
                            ele.append(cloned);
                        });
                    }
                }
            }
        });

        // directive - allow custom template for sidebar
bpModule.directive('sidebar', function ($compile, $templateCache, bpService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: false,
        link: function (scope, ele, attrs) {
            var customMarkup = VOUINS.loadCustomHTMLJS(scope);
            if (window.OmniOut){
                VOUINS.loadHeaderHTML(scope,$compile);
            }
            if(customMarkup !== null) {
                $('head').append(customMarkup);
                $compile(customMarkup); //will put the same in temp cache
            }

            var htmlMarkup;
            if(bpService.layout === 'lightning' || bpService.layout === 'newport' || bpService.verticalMode === false)
                htmlMarkup = $templateCache.get(bpService.elementTypeToHTMLMap['SideBar']);
            else
            {
                htmlMarkup = $templateCache.get('vlcVertPC.html');
            }
            $compile(htmlMarkup)(scope, function(cloned, scope){
                ele.append(cloned);
            });

        }
    }
});

// directive - allow custom template for bptree
bpModule.directive('bptree', function ($compile, $templateCache, bpService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: false,
        link: function (scope, ele, attrs) {

            htmlMarkup = $templateCache.get(bpService.elementTypeToHTMLMap['OmniMain']);

            $compile(htmlMarkup)(scope, function(cloned, scope){
                ele.append(cloned);
            });
        }
    }
});

// directive - allow custom template for auto save for later message
bpModule.directive('autoSaveforlaterMsg', function ($compile, $templateCache, bpService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: false,
        link: function (scope, ele, attrs) {
            var htmlMarkup = $templateCache.get(bpService.elementTypeToHTMLMap['Auto Save for Later Message']);
            $compile(htmlMarkup)(scope, function(cloned, scope){
                ele.append(cloned);
            });
        }
    }
});

        // directive - used for CMT Product Configuration
        // This directive is used to render all controls
        // Pick the templates from elementTypeToHTMLMap map
        bpModule.directive('prodconf', function ($compile, $templateCache, bpService)
        {
            return {
                restrict: "E",
                replace: true,
                transclude: true,
                require: '?ngModel',
                scope: false,
                link: function (scope, ele, attrs, prod, ngModel) {
                    try{
                        var type = 'ProdConf' + scope.attr.attributeRunTimeInfo.dataType;
                        var htmlMarkup = $templateCache.get(bpService.elementTypeToHTMLMap[type]);
                        $compile(htmlMarkup)(scope, function(cloned, scope){
                            ele.append(cloned);
                        });
                        if(angular.equals(scope.attr.attributeRunTimeInfo.dataType, 'Multi Picklist')) {
                            scope.$watch("prod.quantity", function(newValue, oldValue) {
                                var scp = ele.find('[name="loopform"]').scope();
                                if((newValue !== oldValue) && !scp.qtyChanged)
                                    scp.qtyChanged = true;
                            });
                        }
                    } catch(e) {
                        console.log(e);
                    }
                }
            }
        });

        // routing
        bpModule.config(function ($routeProvider)
        {
            var bPreview = sfdcVars.previewMode;

            $routeProvider.
            when('/OS/:OSId/scriptState/:osState/:bVert?/:bNew?/:redirect?/:navDir?', {controller: 'ctrlBusinessProcess as baseCtrl', reloadOnSearch: false, templateUrl:
                 function(urlattr)
                 {
                     if(bPreview)
                         return 'bpTreePreview.html';
                     else
                         return 'bpTree.html';
                 }
            }).
            when('/OmniScriptType/:OSType/OmniScriptSubType/:OSSubType/OmniScriptLang/:OSLangCode/ContextId/:parentObjectId?/PrefillDataRaptorBundle/:pfBundleName?/:bVert?/:bNew?/:redirect?/:navDir?', {controller: 'ctrlBusinessProcess as baseCtrl', reloadOnSearch: false, templateUrl: "bpTree.html"}).
            when('/custom/:pageName/:bReview?', {controller: sfdcVars.redirectController +' as redirectCtrl', template: ''}).
            when('/reset', {controller: 'ctrlBusinessProcess as baseCtrl', reloadOnSearch: false, template: ''}).
            when('/cancel', {controller: 'ctrlBusinessProcess as baseCtrl', reloadOnSearch: false, template: ''}).
            when('/', {controller: 'ctrlBusinessProcess as baseCtrl', reloadOnSearch: false, templateUrl:
                 function(urlattr)
                 {
                     if(bPreview)
                         return 'bpTreePreview.html';
                     else
                         return 'bpTree.html';
                 }
            }).
            when('/:bVert?/:bNew?/:redirect?/:navDir?', {controller: 'ctrlBusinessProcess as baseCtrl', reloadOnSearch: false, templateUrl: "bpTree.html"}).
            otherwise({redirectTo: ''});
        });

    // Base controller for OmniScript
    // @param
    // bpService - common factory defined in BusinessProcessComponent
    // jsonTreeConfig - json tree config
    function baseCtrl($scope, $sce, $window, $location, $route, $routeParams, $http, $compile, bpService, ouiBaseService, jsonTreeConfig, $templateCache, $sanitize, $timeout, $rootScope, $modal, $q, $injector, force, NotSupportedElmService, currencySymbol)
    {
        $injector.invoke(VOUINS.OmniFormCtrl, this, {$scope: $scope});
        var base_applyCallResp = $scope.applyCallResp;

        // SFDC labels
        $scope.bpService = bpService;
        $scope.knowledge = { isToggled: false };

        // Back forwards functionaltiy
        $window.onpopstate = function (event){
            if (!$scope.$root.locked){
                $timeout(function(){
                    if(event && event.state && typeof event.state.stepIndex !== "undefined" && !isNaN(event.state.stepIndex)){
                        $scope.sidebarNav($scope.getStep(event.state.stepIndex), true);
                }});
            } else {
                // Cancel the event
                event.preventDefault();
                // Chrome requires returnValue to be set
                event.returnValue = '';

                return false;
            }
        };

        // Alert on navigate away
        $window.addEventListener("beforeunload", showUnloadMessage);

        function showUnloadMessage (e){
            var skipUnloadMessage = $window.baseCtrl.prototype.$scope.bpTree.propSetMap.disableUnloadWarn!==false||$window.baseCtrl.prototype.$scope.previewMode;
            if (!skipUnloadMessage){
                var confirmationMessage = $window.skipUnsavedAlert?false:"Test Confirmation Message";
                (e || $window.event).returnValue = confirmationMessage;
                return confirmationMessage;
            }
        }

        //////////////////
        // functions
        /////////////////

        // helper function to activate an accordion and show persistentComponent based on the property
        // @param
        // scp - Element scope
        // step - Step Element
        if(angular.equals(sfdcVars.layout, 'lightning') || angular.equals(sfdcVars.layout, 'newport')) {
            $modal = {};
            $inlineEditBlockCont = {};
            $modal.open = $injector.get('$sldsModal');
            $inlineEditBlockCont.open = $injector.get('$sldsInlineBlock');
        }

        $scope.setSessionStorageMessage = function(data) {
            if (data != null) {
                var existing = sessionStorage.getItem($scope.bpTree.messagingKey);
                var array;
                try {
                    array = JSON.parse(existing);
                } catch (e) {}
                if (!array) {
                    array = [];
                }
                array.push(data);
                sessionStorage.setItem($scope.bpTree.messagingKey, JSON.stringify(array));
            }
        };

        $scope.saveForLater = function(element, bAuto)
        {
            if($scope.bpTree.propSetMap.allowSaveForLater !== true || bpService.scriptState === "review")
                return;

            var input = angular.copy($scope.bpTree);

            if(!input)
                return;

            if($scope.bpService.bSflInProgress) {
                $scope.bpService.bSflQueued = true;
                return;
            }
            // header property to save the script
            if($scope.bpTree.propSetMap.saveNameTemplate && !input.bpInstanceName)
            {
                input.bpInstanceName = $scope.handleMergeField($scope.bpTree.propSetMap.saveNameTemplate);
            }

            if($scope.bpTree.propSetMap.saveObjectId === undefined || $scope.bpTree.propSetMap.saveObjectId === null)
                $scope.bpTree.propSetMap.saveObjectId = '%ContextId%';

            input.saveObjectId = $scope.handleMergeField($scope.bpTree.propSetMap.saveObjectId);

            if(input.asIndex === undefined || input.asIndex === null)
                input.activeRootIndex = element.indexInParent + 1;
            else if(input.children && input.children.length > 0)
            {
                var activeStep = input.children[input.asIndex];
                if(activeStep)
                {
                    activeStep.knowledgeKeyword = '';
                    activeStep.articleBody = '';
                    activeStep.articleTitle = '';
                    activeStep.articleLink = '';
                }
            }

            var files = input.filesMap;
            input.prefillJSON = ouiBaseService.pfJSON;
            if(!files)
                files = {};

            $scope.prepBeforeSubmit(input, false, true);

            if(!bAuto)
            {
                $rootScope.loading = true;
                $rootScope.loadingMessage = '';

                // step timing
                if($scope.bpTree.propSetMap.timeTracking)
                {
                    $scope.trackOutcome(activeStep||element, 'Save');
                    $scope.calcStepActionTiming(activeStep||element, false);
                    input.response.vlcTimeTracking = angular.copy($scope.bpTree.response.vlcTimeTracking);
                }
            }

            $scope.bpService.bSflInProgress = true;
            return $q.resolve()
                .then(function () {
                        $scope.bpService.bSflInProgress = true;
                        var configObj = {sClassName:'Vlocity SaveBP',input:angular.toJson(input),
                                         files:angular.toJson(VOUINS.getFilesMap(files, $rootScope.isSforce, $rootScope.sforce))};
                        return configObj;
                    })
                    .then(function (configObj) {
                        return bpService.OmniRemoteInvoke(configObj);
                    })
                    .then(function (result) {
                        var remoteResp = angular.fromJson(result);

                    return VOUINS.syncFileAttachmentData(remoteResp, !bAuto, $rootScope, $q, $scope, $scope.bpTree.filesMap, bpService, $window)
                        .then(function () {
                            if (remoteResp && remoteResp.error !== 'OK') {
                                return $q.reject(remoteResp.error);
                            } else {
                                $scope.bpTree.sInstanceId = remoteResp.instanceId;
                                bpService.instanceId = remoteResp.instanceId;
                                $scope.bpTree.response.sInstanceId = remoteResp.instanceId;
                                $scope.bpTree.sflTimestamp = remoteResp.sflTimestamp;
                                $scope.handleSFLRedirect(remoteResp, true, null, bAuto);
                                return remoteResp;
                            }
                        });
                })
                .catch(function (error) {
                    var errorMsg = $scope.errorReplace(error, element);
                    var separator = (/lightning|newport/.test($scope.bpTree.layout))? '<br/><br/>' : '\n\n' ;
                    $window.alert(new Error(errorMsg + separator + customLabels.OmniSavedFailed));
                })
                .finally(function () {
                    if(!bAuto)
                        $rootScope.loading = false;
                        $scope.bpService.bSflInProgress = false;

                    if ($scope.bpService.bSflQueued) {
                        $scope.bpService.bSflQueued = false;
                        return $scope.saveForLater(element, bAuto);
                    }
                });
        };


        $scope.prepBeforeSubmit = function(input, bReadonly, bClearLabelKeyMap)
        {
            delete input.filesMap;
            delete input.submitButton;
            delete input.IdMode;
            delete input.scriptState;
            delete input.responseAsText;
            delete input.resumeURL;
            delete input.resumeURLMailTo;
            delete input.RTTracking;
            if(bReadonly)
                delete input.prefillJSON;
            if(input.asIndex !== undefined && input.asIndex !== null && input.children && input.children.length > 0)
            {
                var activeStep = input.children[input.asIndex];
                if(activeStep)
                {
                    activeStep.knowledgeKeyword = '';
                    activeStep.articleBody = '';
                    activeStep.articleTitle = '';
                    activeStep.articleLink = '';
                }
            }

            if(bReadonly)
            {
                input.asIndex = null;
                for(var ind=0; ind<input.children.length; ind++)
                {
                    if(input.children[ind].type === 'Step')
                    {
                        if(ind==0)
                        {
                            $scope.setStepStatus(input.children[ind], true, true, false, true, null);
                            input.asIndex = ind;
                        }
                        else
                        {
                            $scope.setStepStatus(input.children[ind], false, true, false, true, null);
                        }
                    }
                }
            }

            if(bClearLabelKeyMap && input.bpLang === 'Multi-Language') {
                for (var key in input.labelKeyMap)
                {
                    if(input.labelKeyMap.hasOwnProperty(key))
                    {
                        input.labelKeyMap[key] = '';
                    }
                }
            }

            input.verticalMode = bpService.verticalMode;
            input.layout = bpService.layout;
        };

        $scope.handleSFLRedirect = function(resp, bSuccess, errorMsg, bAuto)
        {
            var sflURL = null;
            if(resp && resp.instanceId)
            {
                if(!bpService.urlMode)
                    sflURL = $scope.bpTree.saveURL + '#/OS/' + resp.instanceId
                             + '/scriptState/saveAndResume/' + bpService.verticalMode
                             + '/true';
                else
                {
                    var mode = (!bpService.verticalMode)?('horizontal'):('vertical');
                    sflURL = $scope.bpTree.saveURL + '&OmniScriptInstanceId=' + resp.instanceId
                             + '&scriptMode=' + mode + '&loadWithPage=false';
                }
            }

            if(bAuto)
            {
                if(!bSuccess)
                    $window.alert(new Error(angular.toJson(errorMsg)));
                if(sflURL) {
                    $scope.bpTree.resumeURL = sflURL;
                    $scope.bpTree.resumeURLMailTo = sflURL.replace(/&/g, '%26');
                }

                return;
            }

            if(!bSuccess)
                resp.error = errorMsg;
            var redirect = $scope.bpTree.propSetMap.saveForLaterRedirectPageName;
            var redirectTemplateUrl = $scope.bpTree.propSetMap.saveForLaterRedirectTemplateUrl;

            if(!redirect)
                redirect = 'sflRedirect';
            if(!redirectTemplateUrl)
                redirectTemplateUrl = 'vlcSaveForLaterAcknowledge.html';

            redirectTemplateUrl = bpService.getHTMLTemplate(redirectTemplateUrl);

            bpService.redirectPageTemplateMap[redirect] = redirectTemplateUrl;

            bpService.restResponse[redirect] = {};
            bpService.restResponse[redirect].bpTree = angular.copy($scope.bpTree);
            bpService.restResponse[redirect].response = resp;
            if(resp && resp.instanceId) {
                bpService.restResponse[redirect].response.saveURL = sflURL;
                bpService.restResponse[redirect].response.saveURLMailTo = sflURL.replace(/&/g, '%26');
            }
            $location.path('/custom/' + redirect);
        };

        $scope.adjustshowPC = function(element)
        {
            $scope.bpTree.showPC = false;
            if($scope.bpTree.propSetMap && $scope.bpTree.propSetMap.persistentComponent)
            {
                if($scope.bpTree.showPCNew === undefined || $scope.bpTree.showPCNew === null)
                    $scope.bpTree.showPCNew = [];

                if(!angular.isArray(element.propSetMap.showPersistentComponent))
                    element.propSetMap.showPersistentComponent = [element.propSetMap.showPersistentComponent];
                for(var i=0; i<$scope.bpTree.propSetMap.persistentComponent.length; i++)
                {
                    if($scope.bpTree.propSetMap.persistentComponent[i].render === true && element.propSetMap.showPersistentComponent[i] === true)
                    {
                        $scope.bpTree.showPCNew[i] = true;
                        $scope.bpTree.showPC = true;
                    }
                    else
                        $scope.bpTree.showPCNew[i] = false;
                }
            }
        };

        // helper function to activate an accordion and show persistentComponent based on the property
        // @param
        // scp - Element scope
        // step - Step Element
        $scope.activateStep = function(step, bTimeTrack, dontPushState)
        {
            $scope.setStepStatus(step, true, false, bTimeTrack, null, dontPushState);
            //step.bAccordionOpen = true;
            //step.bAccordionActive = true;

            $scope.adjustshowPC(step);
        };

        $scope.adjustStepState = function(step, bAdjustPrevious)
        {
            // adjust bHasPrevious and bHasNext
            var stepIndex = step.indexInParent;
            var rootElements = $scope.bpTree.children;

            if(bAdjustPrevious)
            {
                var bHasPrevious = false;
                for(var i=stepIndex-1; i>=0; i--)
                {
                    if(rootElements[i].type === 'Step' && rootElements[i].show)
                    {
                        bHasPrevious = true;
                        break;
                    }
                }
                step.bHasPrevious = bHasPrevious;
            }

            var bHasNext = false;
            for(var i=stepIndex+1; i<rootElements.length; i++)
            {
                if(rootElements[i].show && (!bpService.resumeMode || (bpService.resumeMode && rootElements[i].type === 'Step')))
                {
                    bHasNext = true;
                    break;
                }
            }
            step.bHasNext = bHasNext;
        };

        // helper function to digest the script definition coming back from the server
        // after the remote call
        // @param
        // idMode - whether it's id mode (preview or resume) or not (Type, Sub Type, Lang case)
        $scope.processBPDef = function(idMode, result, bLoaded)
        {
            //bpService.bInitialize = true;
            if(bLoaded)
                result = angular.toJson(result).replace(/&lt;\/script/g, '</script');
            $scope.bpTree = angular.fromJson(result);

            if (window.OmniForce&&window.OmniForce.isAuthenticated()){
                $scope.bpTree.userId = window.OmniForce.getUserId() || $scope.bpTree.userId;

                if(window.userInfoResult) {
                    Object.assign($scope.bpTree, angular.fromJson(window.userInfoResult));
                }
            }

            if($scope.bpTree && Object.getOwnPropertyNames($scope.bpTree).length > 0)
            {
                if($scope.bpTree.osState === 'newResume') {
                    bpService.scriptState = 'new';
                    bpService.sflMode = false;
                    bpService.bpType = $scope.bpTree.bpType;
                    bpService.bpSubType = $scope.bpTree.bpSubType;
                    bpService.bpLang = $scope.bpTree.bpLang;
                }
                if($scope.bpTree.error && $scope.bpTree.error !== 'OK')
                {
                    $timeout(function() {
                        $rootScope.loading = false;
                        if($scope.bpTree.error === 'ScriptNotFound1')
                        {
                        	$rootScope.rootCustomLabels = customLabels;
                            $rootScope.scriptNotFound1 = true;
                            $rootScope.scriptNotFound2 = false;
                            $rootScope.type = bpService.bpType;
                            $rootScope.subType = bpService.bpSubType;
                            $rootScope.lang = bpService.bpLang;
                        }
                        else if($scope.bpTree.error === 'ScriptNotFound2')
                        {
                        	$rootScope.rootCustomLabels = customLabels;
                            $rootScope.scriptNotFound1 = false;
                            $rootScope.scriptNotFound2 = true;
                            $rootScope.id = bpService.bpId;
                        }
                        else
                            $window.alert(new Error($scope.bpTree.error));
                    }, 0);
                }
                else if($scope.bpTree.children && $scope.bpTree.children.length > 0)
                {
                    ouiBaseService.bMultiLang = $scope.bpTree.bpLang === 'Multi-Language';
                    bpService.bMultiLang = ouiBaseService.bMultiLang;

                    VOUINS.pickListSeeding($rootScope, ouiBaseService, $scope.bpTree);

                    // IdMode and scriptState will be deleted before (1) Post to Object
                    // sumbit to App (3) Save for later
                    // this is always a new script
                    if(!idMode)
                        $scope.bpTree.IdMode = false;

                    else if(bpService.scriptState === 'new')
                        $scope.bpTree.previewMode = ouiBaseService.previewMode;

                    $scope.bpTree.scriptState = bpService.scriptState;

                    if($scope.bpTree.labelMap)
                    {
                        $scope.bpTree.labelMap['value'] = 'value';
                        $scope.bpTree.labelMap['size'] = 'size';
                        $scope.bpTree.labelMap['filename'] = 'filename';
                    }

                    if(bpService.scriptState !== 'review')
                        ouiBaseService.pfJSON = angular.fromJson($scope.bpTree.prefillJSON);

                    var deleteIndex = [];
                    // backward compatibility
                    if($scope.bpTree.children)
                    {
                        // time tracking
                        $scope.bpTree.RTTracking = {};
                        for(var i=0; i<$scope.bpTree.children.length; i++)
                        {
                            if($scope.bpTree.children[i].type !== 'Step' && ($scope.bpTree.children[i].ui === undefined || $scope.bpTree.children[i].ui === null))
                                $scope.bpTree.children[i].ui = {};
                            if($scope.bpTree.children[i].type === 'OmniScript')
                                deleteIndex.push(i);
                            if($scope.bpTree.scriptState === 'new' && $scope.bpTree.children[i].bEmbed && $scope.bpTree.children[i].offSet !== undefined && $scope.bpTree.children[i].offSet !== null)
                                $scope.adjustOffSet($scope.bpTree.children[i], $scope.bpTree.children[i].offSet);
                            if($scope.bpTree.propSetMap.timeTracking)
                            {
                                $scope.bpTree.RTTracking[$scope.bpTree.children[i].name] = {};
                                $scope.bpTree.RTTracking[$scope.bpTree.children[i].name].StartMilliseconds = 0;
                                $scope.bpTree.RTTracking[$scope.bpTree.children[i].name].ElapsedMilliseconds = 0;
                                $scope.bpTree.RTTracking[$scope.bpTree.children[i].name].watchStarted = false;
                            }

                            // For backwards-compatibility for older OmniScripts that do not have the
                            // failureGoBackLabel introduced in v104+
                            if ($scope.bpTree.children[i].propSetMap.failureAbortLabel &&
                                $scope.bpTree.children[i].propSetMap.failureGoBackLabel === undefined) {
                                $scope.bpTree.children[i].propSetMap.failureGoBackLabel = $scope.customLabels.OmnifailureGoBackLabel;
                            }

                            if($scope.bpTree.scriptState === 'new') {
                                if(!$scope.bpTree.children[i].propSetMap.show)
                                {
                                    $scope.bpTree.children[i].show = true;
                                }
                                else
                                {
                                    if($scope.bpTree.children[i].propSetMap.conditionType === 'Optional if False')
                                    {
                                        $scope.bpTree.children[i].show = true;
                                    }
                                    else if($scope.bpTree.children[i].propSetMap.conditionType === 'Readonly if False')
                                    {
                                        $scope.bpTree.children[i].show = true;
                                    }
                                    else
                                    {
                                        $scope.bpTree.children[i].show = false;
                                    }
                                }

                                if($scope.bpTree.children[i].indexInParent > 0)
                                {
                                    $scope.bpTree.children[i].previousIndex = $scope.bpTree.children[i].indexInParent - 1;
                                    $scope.bpTree.children[i].bHasPrevious = true;
                                }
                                $scope.bpTree.children[i].nextIndex = $scope.bpTree.children[i].indexInParent + 1;
                                $scope.bpTree.children[i].bHasNext = true;
                            }
                        }

                        for(var j=0; j<deleteIndex.length; j++)
                        {
                            $scope.bpTree.children.splice(deleteIndex[j]-j, 1);
                        }
                        if($scope.bpTree.scriptState === 'new' && $scope.bpTree.children.length > 0)
                        {
                            $scope.bpTree.children[$scope.bpTree.children.length-1].nextIndex = null;
                            $scope.bpTree.children[$scope.bpTree.children.length-1].bHasNext = false;
                        }
                    }

                    // 3.0 feature, added Property Set Map to the script header
                    // this is to take care of the 2.7 (and before) active scripts after upgrade to 3.0
                    if($scope.bpTree.propSetMap === undefined || $scope.bpTree.propSetMap === null)
                        $scope.bpTree.propSetMap = {};

                    if($scope.bpTree.propSetMap.allowSaveForLater === undefined || $scope.bpTree.propSetMap.allowSaveForLater === null)
                    {
                        var tempPropSetMap = angular.copy($scope.bpTree.propSetMap);
                        tempPropSetMap.allowSaveForLater = true;
                        $scope.bpTree.propSetMap = tempPropSetMap;
                    }

                    // Assigns allowCancel for Activated scripts that do not have the allowCancel in its datapack
                    if ($scope.bpTree.propSetMap.allowCancel === undefined) {
                        $scope.bpTree.propSetMap.allowCancel = true;
                    }

                    // 3.0 persistent component, the default id is 'vlcCart'
                    // the default node to display line items is cartItems
                    // 4.0 multiple PCs
                    // NEED to sync up $scope.bpTree.propSetMap.persistentComponent, $scope.bpTree.pcId,
                    // $scope.bpTree.pcItemsKey, $scope.bpTree.showPC, $scope.bpTree.dfHPSTmpl, $scope.bpTree.dfVertPSTmpl
                    // $scope.bpTree.response['vlcPersistentComponent']
                    if($scope.bpTree.propSetMap.persistentComponent)
                    {
                        if($scope.bpTree.propSetMap.persistentComponent.constructor === Object)
                        {
                            if($scope.bpTree.pcId === undefined || $scope.bpTree.pcId === null)
                            {
                                $scope.bpTree.pcId = $scope.bpTree.propSetMap.persistentComponent.id;
                                if($scope.bpTree.pcId === undefined || $scope.bpTree.pcId === null)
                                    $scope.bpTree.pcId = 'vlcCart';
                            }
                            if($scope.bpTree.pcItemsKey === undefined || $scope.bpTree.pcItemsKey === null)
                            {
                                $scope.bpTree.pcItemsKey = $scope.bpTree.propSetMap.persistentComponent.itemsKey;
                                if($scope.bpTree.pcItemsKey === undefined || $scope.bpTree.pcItemsKey === null)
                                    $scope.bpTree.pcItemsKey = 'cartItems';
                            }

                            $scope.bpTree.propSetMap.persistentComponent = [$scope.bpTree.propSetMap.persistentComponent];
                            $scope.bpTree.pcId = [$scope.bpTree.pcId];
                            $scope.bpTree.pcItemsKey = [$scope.bpTree.pcItemsKey];
                            $scope.bpTree.propSetMap.persistentComponent[0].pcIndex = 0;
                            // only one PC
                        }
                        else if(angular.isArray($scope.bpTree.propSetMap.persistentComponent))
                        {
                            $scope.bpTree.pcId = [];
                            $scope.bpTree.pcItemsKey = [];
                            for(var i=0; i<$scope.bpTree.propSetMap.persistentComponent.length; i++)
                            {
                                $scope.bpTree.pcId.push($scope.bpTree.propSetMap.persistentComponent[i].id);
                                $scope.bpTree.pcItemsKey.push($scope.bpTree.propSetMap.persistentComponent[i].itemsKey);
                                $scope.bpTree.propSetMap.persistentComponent[i].pcIndex = i;
                            }
                        }
                    }
                    //else
                    //$scope.bpTree.showPC = null;
                    // v102 - Multi-lang support
                    if(bpService.bMultiLang) {
                        // alert added for custom label retrieval failure
                        if($scope.bpTree.labelKeyMap.messages) {
                            var errorMsg = $scope.errorReplace($scope.bpTree.labelKeyMap.messages, $scope.bpTree);
                            $window.alert(new Error(errorMsg));
                            return ;
                        }

                        VOUINS.handleMultiLangLabel(null, $scope.bpTree.labelKeyMap, $scope.bpTree.propSetMap);
                    }

                    ////// template customization
                    if($scope.bpTree.propSetMap.elementTypeToHTMLTemplateMapping)
                    {
                        // use this to overwrite global setting
                        // first use what's defined in the script header property
                        $.extend( bpService.elementTypeToHTMLMap, $scope.bpTree.propSetMap.elementTypeToHTMLTemplateMapping );
                    }

                    // then use the component attribute ones
                    // the component attribute ones allow the user to specify different templates for the same script
                    $.extend( bpService.elementTypeToHTMLMap, bpService.eleTypeToHTMLTemplateMap );
                    if($scope.bpTree.propSetMap.persistentComponent)
                    {
                        $scope.bpTree.dfHPSTmpl = bpService.elementTypeToHTMLMap['Horizontal Mode Persistent Component'];
                        if(!angular.isArray($scope.bpTree.dfHPSTmpl))
                            $scope.bpTree.dfHPSTmpl = [$scope.bpTree.dfHPSTmpl];
                        $scope.bpTree.dfVertPSTmpl = bpService.elementTypeToHTMLMap['Vertical Mode Persistent Component'];
                        if(!angular.isArray($scope.bpTree.dfVertPSTmpl))
                            $scope.bpTree.dfVertPSTmpl = [$scope.bpTree.dfVertPSTmpl];

                        for(var i=0; i<$scope.bpTree.propSetMap.persistentComponent.length - $scope.bpTree.dfHPSTmpl.length; i++)
                            $scope.bpTree.dfHPSTmpl.push('vlcEmpty.html');
                        for(var i=0; i<$scope.bpTree.propSetMap.persistentComponent.length - $scope.bpTree.dfVertPSTmpl.length; i++)
                            $scope.bpTree.dfVertPSTmpl.push('vlcEmpty.html');
                    }
                    $scope.bpTree.dfSITmpl = bpService.elementTypeToHTMLMap['Selectable Item'];
                    /////////////////////

                    $scope.children = $scope.bpTree.children;
                    $scope.child = { children: $scope.children };

                    $scope.bpTree.ContextId = bpService.parentObjectId;

                    // OMNI-3146
                    if(bpService.scriptState === 'saveAndResume') {
                        $scope.bpTree.userName = $scope.bpTree.userName1;
                        $scope.bpTree.userId = $scope.bpTree.userId1;
                        $scope.bpTree.userProfile = $scope.bpTree.userProfile1;
                        delete $scope.bpTree.userName1;
                        delete $scope.bpTree.userId1;
                        delete $scope.bpTree.userProfile1;
                        $scope.bpTree.response.userId = $scope.bpTree.userId;
                        $scope.bpTree.response.userName = $scope.bpTree.userName;
                        $scope.bpTree.response.userProfile = $scope.bpTree.userProfile;
                    }

                    if (bpService.isInConsole) {
                        if ($scope.bpTree.propSetMap.consoleTabTitle) {
                            sforce.console.setTabTitle($scope.bpTree.propSetMap.consoleTabTitle);
                        }
                        if ($scope.bpTree.propSetMap.consoleTabIcon) {
                            sforce.console.setTabIcon($scope.bpTree.propSetMap.consoleTabIcon);
                        }
                    }

                    if ('parentIFrame' in window && (sfdcVars.urlParams.omniIframeEmbedded == "true" || sfdcVars.urlParams.omniIframeEmbedded == true)) {
                        if ($scope.bpTree.propSetMap.consoleTabTitle) {
                            parentIFrame.sendMessage({
                                message:'ltng:setConsoleTabLabel',
                                label: $scope.bpTree.propSetMap.consoleTabTitle
                            });
                        }
                        if ($scope.bpTree.propSetMap.consoleTabIcon) {
                            parentIFrame.sendMessage({
                                message:'ltng:setConsoleTabIcon',
                                icon: $scope.bpTree.propSetMap.consoleTabIcon
                            });
                        }
                    }

                    $scope.extraInfo = {};
                    $scope.extraInfo['ContextId'] = bpService.parentObjectId;
                    $scope.extraInfo['timeStamp'] = $scope.bpTree.timeStamp;
                    $scope.extraInfo['userId'] = $scope.bpTree.userId;
                    $scope.extraInfo['userName'] = $scope.bpTree.userName;
                    $scope.extraInfo['userProfile'] = $scope.bpTree.userProfile;
                    $scope.extraInfo['userTimeZone'] = $scope.bpTree.userTimeZone;
                    $scope.extraInfo['userCurrencyCode'] = $scope.bpTree.userCurrencyCode;
                    if($scope.bpTree.response === undefined || $scope.bpTree.response === null)
                    {
                        if ($rootScope.loading && $rootScope.tabKey && $scope.previewMode) {
                            if ($rootScope.testContextId) {
                                $scope.extraInfo['ContextId'] = $scope.bpTree.ContextId = $rootScope.testContextId;
                            }
                            $window.parent.postMessage({
                                key: $rootScope.tabKey + ".initialLoad"
                            }, '*');
                        }
                        $scope.setSessionStorageMessage('initialLoad');

                        // url Parameters
                        var urlParams = angular.fromJson(sfdcVars.urlParams);
                        if(window.OmniOut) {
                        	urlParams = angular.copy(VOUINS.getQueryParams());
                        	for(var i=0; i<bpService.internalUrlKeyList.length; i++)
                        		delete urlParams[bpService.internalUrlKeyList[i]];
                        }
                        if(urlParams && urlParams.constructor === Object) {
                            for (var key in urlParams) {
                                if(urlParams.hasOwnProperty(key)) {
                                    if(urlParams[key] === 'true')
                                        urlParams[key] = true;
                                    if(urlParams[key] === 'false')
                                        urlParams[key] = false;
                                }
                            }
                            $scope.bpTree.response = $.extend({}, urlParams, $scope.bpTree.response);
                        }
                        $scope.bpTree.response = $.extend({}, $scope.extraInfo, $scope.bpTree.response);

                        // seed data json
                        // logic:
                        // merge it with pfJSON (2.5 prefill)
                        // prefill overwrites seed data json if there are conflicts
                        if($scope.bpTree.propSetMap && $scope.bpTree.propSetMap.seedDataJSON &&
                           $scope.bpTree.propSetMap.seedDataJSON.constructor === Object)
                            ouiBaseService.pfJSON = $.extend({}, $scope.bpTree.propSetMap.seedDataJSON, ouiBaseService.pfJSON);

                        $scope.bpTree.response = $.extend({}, ouiBaseService.pfJSON, $scope.bpTree.response);

                        if($scope.bpTree.propSetMap.persistentComponent &&
                           ($scope.bpTree.response['vlcPersistentComponent'] === undefined || $scope.bpTree.response['vlcPersistentComponent'] === null))
                            $scope.bpTree.response['vlcPersistentComponent'] = {};
                    }
                    // Messaging key
                    $scope.bpTree.messagingKey = ($scope.bpTree.response.messagingKey)?($scope.bpTree.response.messagingKey):('OmniScript-Messaging');

                    // time tracking
                    if($scope.bpTree.propSetMap.timeTracking && !$scope.bpTree.response.vlcTimeTracking)
                        $scope.bpTree.response.vlcTimeTracking = {};

                    // construct the resume link
                    $scope.bpTree.saveURL = VOUINS.constructSFLLink(window.location, bpService);

                    if(!$scope.bpTree.saveURL)
                        $scope.bpTree.saveURL = '';

                    // check expiration
                    if(bpService.sflMode && $scope.bpTree.expired === true)
                    {
                        if($scope.bpTree.children && $scope.bpTree.children.length > 0)
                        {
                            $scope.bpTree.asIndex = null;
                            for(var ind=0; ind<$scope.bpTree.children.length; ind++)
                            {
                                if($scope.bpTree.children[ind].type === 'Step')
                                {
                                    if(ind==0)
                                    {
                                        $scope.setStepStatus($scope.bpTree.children[ind], true, true, false, null, null);
                                        //$scope.bpTree.children[ind].bAccordionActive = true;
                                        //$scope.bpTree.children[ind].bAccordionOpen = true;
                                        //$scope.activateStep(input, input.children[ind]);
                                        $scope.bpTree.asIndex = ind;
                                    }
                                    else
                                    {
                                        $scope.setStepStatus($scope.bpTree.children[ind], false, true, false, null, null);
                                        //$scope.bpTree.children[ind].bAccordionActive = false;
                                        //$scope.bpTree.children[ind].bAccordionOpen = false;
                                    }
                                }
                            }
                        }
                    }

                    $scope.errHTMLId = bpService.elementTypeToHTMLMap['Error Sub Block'];
                    $scope.typeaheadHTMLId = bpService.elementTypeToHTMLMap['Typeahead Dropdown'];
                    if (bpService.scriptState === 'saveAndResume')
                    {
                        $scope.asyncLoadFilesMap();
                    }

                    // Currency Symbol Support for OmniScript
                    $scope.getCurrencySymbol($scope, $scope.bpService);

                    var startInd;
                    var bSkipSFL = false;

                    // assumption, the first element should always show
                    // now start the serialization of action/step
                    if(!bpService.sflMode || (bpService.sflMode && $scope.bpTree.expired === true))
                    {
                        startInd = -1;
                    }
                    //
                    else
                    {
                        startInd = ($scope.bpTree.asIndex !== undefined && $scope.bpTree.asIndex !== null)?($scope.bpTree.asIndex - 1):($scope.bpTree.activeRootIndex - 1);
                        bSkipSFL = true;
                    }

                    if(ouiBaseService.bPLSeeding) {
                        var firstVisRootInd;
                        var interval;
                        // if the first root element is an action, we need to wait until seeding is done
                        for(var firstVisRootInd=startInd+1; firstVisRootInd<$scope.children.length; firstVisRootInd++) {
                            if($scope.children[firstVisRootInd].show)
                                break;
                        }
                        if($scope.children[firstVisRootInd].type !== 'Step') {
                            interval = setInterval(check, 10);
                        }
                        else {
                            $scope.nextRepeater(startInd+1, startInd, null, null, bSkipSFL);
                            $rootScope.loading = false;
                        }

                        function check() {
                            if ($rootScope.seedingDone === true || $rootScope.seedingFailed === true) {
                                clearInterval(interval);
                                $scope.nextRepeater(startInd+1, startInd, null, null, bSkipSFL);
                                $rootScope.loading = false;
                            }
                        }
                    }
                    else {
                        $scope.nextRepeater(startInd+1, startInd, null, null, bSkipSFL);
                        $rootScope.loading = false;
                    }
                }
                else {
                    $rootScope.loading = false;
                }
            }
            else
                $rootScope.loading = false;

            console.timeEnd('START');
        };

        $scope.adjustOffSet = function(root, offSet)
        {
            if(root.children) {
                for(var i=0; i<root.children.length; i++)
                {
                    for(var j=0; j<root.children[i].eleArray.length; j++)
                    {
                        if(root.children[i].eleArray[j].rootIndex !== undefined && root.children[i].eleArray[j].rootIndex !== null)
                            root.children[i].eleArray[j].rootIndex += offSet;
                        $scope.adjustOffSet(root.children[i].eleArray[j], offSet);
                    }
                }
            }
        };

        // user click - Previous button
        // @param
        // scp - Element scope
        // step - Stemp Element
        $scope.previous = function(scp, step)
        {
            if(scp && step)
            {
                $scope.setStepStatus(scp.bpTree.children[step.indexInParent], false, true, true, null, null);
                //scp.bpTree.children[step.indexInParent].bAccordionOpen = false;
                //scp.bpTree.children[step.indexInParent].bAccordionActive = false;
                var prevIndex = $scope.findPreShowStep(step.indexInParent);
                if(prevIndex !== undefined && prevIndex !== null)
                {
                    scp.activateStep(scp.bpTree.children[prevIndex], true, null);
                    scp.bpTree.asIndex = prevIndex;
                    $scope.activeIndex = prevIndex;
                }

                // Closes modal if an error modal exists
                if (step.ui) {
                    step.ui.error = false;
                    step.ui.show = false;
                }
            }
        };

        $scope.getKnowledgeDataCatLabel = function(step, vlcPC)
        {
            if(!step)
                return;

            var label = '';

            if(bpService.stepKnowledgeDataCatMap.hasOwnProperty(step.name))
                label = bpService.stepKnowledgeDataCatMap[step.name];
            else if(step.propSetMap.knowledgeOptions && step.propSetMap.knowledgeOptions.dataCategoryCriteria)
            {
                label = step.propSetMap.knowledgeOptions.dataCategoryCriteria;
                //label = $scope.handleMergeField(label);
                label = label.replace('WITH DATA CATEGORY ', '');
                label = label.replace(/__c/g, '') ;
                label = (label)?(customLabels.OmniScriptDataCategory + ' ' + label + ''):('');
                bpService.stepKnowledgeDataCatMap[step.name] = label;
            }

            return label;
        };

        $scope.setStepStatus = function(step, status, bDoNotRefreshKPC, bTimeTrack, bPrep, dontPushState)
        {
            // disable back/forwards in aura component for communities
            dontPushState = ('parentIFrame' in window && sfdcVars.urlParams.omniIframeEmbedded == true) || dontPushState;
            step.bAccordionOpen = status;
            step.bAccordionActive = status;
            step.open = (bpService.verticalMode===true)?(step.bAccordionOpen):(true);
            step.knowledgeKeyword = '';
            step.articleBody = '';
            step.articleTitle = '';
            step.articleLink = '';
            //step.userKWKeyword = '';
            bpService.stepKnowledgeKWMap = {};

            if (step.bAccordionActive) {
                /*
                 * OMNI-839 - Add postMessage support to send messages across iframe's to tell
                 * parent where the Script is up to. Don't leak extra info though, just element name.
                 */
                $window.parent.postMessage(JSON.stringify({
                    name: step.name,
                    type: step.type
                }), "*");
                $scope.setSessionStorageMessage({
                    name: step.name,
                    type: step.type,
                    messageType: 'stepStatus'
                });
                $scope.handleMessaging(step,false);
            }

            if(status === true && !bPrep)
            {
                $scope.bpTree.asIndex = step.indexInParent;
                $scope.activeIndex = step.indexInParent;
                $scope.adjustStepState(step, true);
                if(!dontPushState){
                    if (window.history.state==undefined || typeof window.history.state.stepIndex === undefined){
                        window.history.replaceState({stepIndex:step.indexInParent},step.propSetMap.label,window.location.href);
                    } else if (window.history.state.stepIndex!==step.indexInParent){
                        window.history.pushState({stepIndex:step.indexInParent},step.propSetMap.label,window.location.href);
                    }
                }

                if($scope.bpTree.propSetMap.enableKnowledge === true && !bDoNotRefreshKPC)
                    $scope.searchKnowledgeArticle(step, false, true);

                // auto focus
                if(document.forms && $scope.bpTree.propSetMap.autoFocus) {
                    for(var ind = 0; ind<document.forms.length; ind++) {
                        if(document.forms[ind].id === $scope.bpTree.sOmniScriptId + '-' + step.indexInParent) {
                            if(document.forms[ind].elements) {
                                for(var j=0; j<document.forms[ind].elements.length; j++) {
                                    if(!document.forms[ind].elements[j].disabled && !document.forms[ind].elements[j].hidden) {
                                        $timeout(function() {
                                            document.forms[ind].elements[j].focus();
                                        }, 0);
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            }

            if($scope.bpTree.propSetMap.timeTracking && bTimeTrack)
            {
                // step timing
                $scope.calcStepActionTiming(step, status);
            }
        };

        $scope.calcStepActionTiming = function(element, status)
        {
            if(!element)
                return;

            var rootNode = $scope.bpTree.RTTracking[element.name];
            if(status && !rootNode.clickStarted)
                $scope.clickTracking(element, true, rootNode);
            (status)?(startWatch(rootNode)):(stopWatch(rootNode));
            if(status === false && rootNode.watchStarted === true)
            {
                $scope.trackTime(element, rootNode);

                if($scope.bpTree.response.vlcTimeTracking[element.name] === undefined || $scope.bpTree.response.vlcTimeTracking[element.name] === null)
                    $scope.bpTree.response.vlcTimeTracking[element.name] = 0;
                $scope.bpTree.response.vlcTimeTracking[element.name] += rootNode.ElapsedMilliseconds;
                rootNode.ElapsedMilliseconds = 0;
                rootNode.watchStarted = false;
                if(rootNode.clickStarted === true)
                {
                    $scope.clickTracking(element, false);
                    rootNode.clickStarted = false;
                }
            }
        };

        $scope.getDefaultTrackingData = function(element) {

            if (!$scope.bpTree.response.vlcTimeTracking)
            {
                $scope.bpTree.response.vlcTimeTracking = {};
            }

            if (!$scope.bpTree.response.vlcTimeTracking.OmniScriptSessionToken)
            {
                $scope.bpTree.response.vlcTimeTracking.OmniScriptSessionToken = VOUINS.generateUUID();
            }

            var defaultData = {
                TrackingService: "OmniScript",
                VlocityInteractionToken: $scope.bpTree.response.vlcTimeTracking.OmniScriptSessionToken,
                OmniScriptId: $scope.bpTree.sOmniScriptId,
                OmniScriptContextId: $scope.handleMergeField("%ContextId%"),
                OmniScriptType:  $scope.bpTree.bpType,
                OmniScriptSubType:  $scope.bpTree.bpSubType,
                OmniScriptLanguage:  $scope.bpTree.bpLang,
                Timestamp: moment.utc().format()
            };

            if (element)
            {
                defaultData.ElementType = element.type;
                defaultData.ElementName = element.name;
                defaultData.ElementLabel = element.propSetMap.label;
                defaultData.ElementStepNumber = (element.indexInParent+1);
            }

            if ($scope.bpTree.propSetMap.trackingCustomData)
            {
                angular.forEach($scope.bpTree.propSetMap.trackingCustomData, function(value, key) {
                    defaultData[key] = $scope.handleMergeField(value);
                });
            }

            return defaultData;
        }

        $scope.trackOutcome = function(element, outcome)
        {
            if (!element || !outcome)
                return;

            var sendData = angular.extend({Outcome: outcome, TrackingEvent: "Outcome"}, $scope.getDefaultTrackingData(element));

            if (!angular.isArray(sendData))
            {
                sendData = [sendData];
            }

            bpService.OmniRemoteInvoke({"sClassName":"Vlocity VlocityTrack", "trackingData":sendData});
        }

        $scope.trackTime = function(element, timingData)
        {
        	var sendData = angular.extend({TrackingEvent: "StepActionTime", ElapsedTime: timingData.ElapsedMilliseconds}, $scope.getDefaultTrackingData(element));
            if (!angular.isArray(sendData)) {
            	sendData = [sendData];
            }

            bpService.OmniRemoteInvoke({"sClassName":"Vlocity VlocityTrack", "trackingData":sendData});
        }

        $scope.clickTracking = function(element, status, rootNode)
        {
            // click tracking in console
            if(bpService.isInConsole)
            {
                if(status === true)
                {
                    if(rootNode.clickStarted === true)
                        return;
                    else
                        rootNode.clickStarted = true;
                }

                //sforce.console.getEnclosingTabId(function (result) {
                    var msg = {};
                    msg.command = 'event';
                    if(element.type === 'Step')
                        msg.type = (status)?('OmniScript Enter Step'):('OmniScript Exit Step');
                    else
                        msg.type = (status)?('OmniScript Start Action'):('OmniScript End Action');
                    msg.objID = (bpService.bpId)?(bpService.bpId):($scope.bpTree.sOmniScriptId);
                    //msg.tabID = result.id;
                    msg.tabID = element.name;
                    msg.source = bpService.bpType + '|' + bpService.bpSubType + '|' + bpService.bpLang;
                    msg.value = element.name;
                    sforce.console.fireEvent("VlocityConsoleHelper", JSON.stringify(msg));
                //});
            }
        };

        $scope.isLoadingAttachments = function()
        {
            var isLoading = false;
            if ($scope.bpTree.loadingAttachments)
            {
                angular.forEach($scope.bpTree.loadingAttachments, function(key)
                {
                    if (key)
                    {
                        isLoading = true;
                    }
                });
            }

            return isLoading;
        }

        $scope.asyncLoadFilesMap = function()
        {
            if ($rootScope.isSforce
                && sforce.connection
                && $scope.bpTree.filesMap)
            {
                angular.forEach($scope.bpTree.filesMap, function(attachmentId)
                {
                    sforce.connection.sessionId = window.sessionId;
                    if (!$scope.bpTree.loadingAttachments)
                    {
                        $scope.bpTree.loadingAttachments = {};
                    }

                    if (attachmentId != null && attachmentId.length == 18)
                    {
                        $scope.bpTree.loadingAttachments[attachmentId] = true;

                        sforce.connection.query( "Select Id, Name, Body, ContentType FROM Attachment where Id = \'" + attachmentId + "\'", {
                            onSuccess: function(result)
                            {
                                delete $scope.bpTree.loadingAttachments[ attachmentId ];

                                if ($scope.bpTree.filesMap[result.records.Name])
                                {
                                    $scope.bpTree.filesMap[result.records.Name] = "data:" + result.records.ContentType + ";base64," + result.records.Body;
                                }

                                if (!$scope.isLoadingAttachments())
                                {
                                    $scope.$apply();
                                }
                            },
                            onFailure: function(result)
                            {
                                delete $scope.bpTree.loadingAttachments[attachmentId];
                            }
                        });
                    }
                });
            }
        }

        // helper function
        // When Attachments in the filesMap are more than 1MB or so it will cause potential heap sizeissues
        // This will take in a list of Attachment Id's and fill in the Salesforce Attachments with the proper data
        // @param
        // element - Action Element or script persistent component (element = null)
        $scope.prepareInputJSON = function(element)
        {
            var dataJSON = {};
            if(element)
            {
                if(bpService.remoteInvokePrePostEleTypes.indexOf(element.type) >=0 || element.type === 'Filter Block' || element.type === 'DocuSign Envelope Action' || element.type === 'DocuSign Signature Action' ||
                   bpService.placeholderEleTypeList.indexOf(element.type) >= 0 || bpService.remoteInvokePreEleTypes.indexOf(element.type) >=0)
                    dataJSON = $scope.bpTree.response;
                else if(element.type === 'DataRaptor Post Action' || element.type === 'Post to Object Action'
                        || element.type === 'DataRaptor Transform Action')
                    dataJSON = $scope.bpTree;
            }
            else
                dataJSON = $scope.bpTree.response;
            return dataJSON;
        };

        // function to serialize actions/steps of the script
        // @param
        // i - current index
        // fromIndex - previous index
        // input - JSON input used to call the next action
        // stage - 'PreTransform', 'PostTransform', 'Middle' or undefined/null
        $scope.nextRepeater = function(i, fromIndex, input, stage, bSkipSFL)
        {
            // next element
            var element = $scope.bpTree.children[i];

            // Initialize
            if($rootScope.bInitialize === false)
            {
                bpService.fakeAsync(i, fromIndex, input, stage, bSkipSFL).then(function(ret)
                {
                    //bpService.bInitialize = false;
                    $scope.nextRepeater(i, fromIndex, input, stage, bSkipSFL);
                    $rootScope.loading = false;
                });
                if(element)
                    $scope.activeIndex = element.indexInParent;
                $rootScope.bInitialize = true;
                return;

            }

            // if next element is hidden, then move to the one after
            if(element && (!element.show || (bpService.resumeMode && element.type !== 'Step') ))
            {
                $scope.nextRepeater(i+1, fromIndex, input, stage, bSkipSFL);
                return;
            }

            var bPrevStepValid = true;
            var fromEle;
            if(i !== fromIndex && fromIndex >=0 )
            {
                fromEle = $scope.bpTree.children[fromIndex];
                // need to validate the previous step
                if(fromEle && fromEle.type === 'Step' && fromEle.propSetMap.validationRequired === true)
                {
                    var formId = $scope.bpTree.sOmniScriptId + '-' + fromEle.indexInParent;
                    bPrevStepValid = !$scope.checkValidity($scope, null, null, 'StepNext', formId);
                }

                if(!bPrevStepValid)
                    return;

                if (fromEle)
                {
                    if(fromEle.type === 'Step')
                    {
                        $scope.clearSrvErr(fromIndex);
                        // optional remote call to do server validation
                        if(!stage && fromEle.propSetMap.remoteClass && fromEle.propSetMap.remoteMethod)
                        {
                            $scope.nextRepeater(i, fromIndex, input, 'stepRemoteCall');
                            return;
                        }

                        if(stage === 'stepRemoteCall')
                        {
                            input = $scope.prepareInputJSON(null);
                            $scope.remoteCallInvoke(input, fromEle, false, i, null, null, null, null, fromIndex);
                            return;
                        }
                        else
                        {
                            $scope.setStepStatus(fromEle, false, true, true, null, null);
                            //fromEle.bAccordionOpen = false;
                            //fromEle.bAccordionActive = false;
                            $scope.bpTree.asIndex = null;
                            // auto save on Step next
                            if($scope.bpTree.propSetMap.autoSaveOnStepNext === true && !bSkipSFL)
                            {
                                $scope.saveForLater(fromEle, true);
                            }
                        }
                    }
                    else
                        fromEle.ui.show = false;

                    // complete script case
                    if((i === undefined || i === null) && fromEle.type !== 'Step'
                       && fromEle.nextIndex === null && bpService.sflMode)
                    {
                        $scope.completeScript(true);
                    }
                }
            }

            if(element)
            {
                $scope.activeIndex = element.indexInParent;
                // element.show === true
                if($scope.bpTree.propSetMap.timeTracking)
                {
                    if(fromIndex >= 0)
                       $scope.calcStepActionTiming(fromEle, false);

                    // time tracking
                    $scope.calcStepActionTiming(element, true);
                }

                $scope.adjustshowPC(element);

                // in resume mode, we do not execute actions
                if(!bpService.resumeMode)
                {
                    // first check validity
                    var bValid = true;
                    if(element.propSetMap.validationRequired === 'Submit')
                        bValid = !$scope.checkValidity($scope, null, null, 'Submit');

                    if(bValid)
                    {
                        // pre-transform and post-transform
                        // 1. DataRaptor Extract Action does not need pre and post transform
                        // 2. DataRaptor Post Action does not need pre transform
                        // 3. Post to Object does not need pre transform
                        // 4. PDF Action does not need post transform
                        if(stage === 'PreTransform' || stage === 'PostTransform')
                        {
                            if(bpService.remoteInvokePrePostEleTypes.indexOf(element.type) >=0 ||
                               bpService.remoteInvokePreEleTypes.indexOf(element.type) >=0 ||
                               (bpService.remoteInvokePostEleTypes.indexOf(element.type) >=0 && stage === 'PostTransform'))
                                $scope.drTransformInvoke(input, element, false, fromIndex, null, i, stage);
                            else if(stage === 'PreTransform'){
                                $scope.nextRepeater(i, fromIndex, input, 'Middle');
                            }
                            else if(stage === 'PostTransform')
                                $scope.nextRepeater(element.nextIndex, i);
                        }
                        else
                        {
                            if(stage === 'Middle' || (!stage && !element.propSetMap.preTransformBundle) || (stage === 'stepRemoteCallDone' && !element.propSetMap.preTransformBundle))
                            {
                                if(stage !== 'Middle')
                                    input = $scope.prepareInputJSON(element);
                                // 7 types of actions
                                stage = 'Middle';
                                if(element.type === 'Remote Action' || element.type === 'Calculation Action' || element.type === 'Integration Procedure Action')
                                {
                                    $scope.remoteCallInvoke(input, element, false, i, null, null, null, null, fromIndex);
                                }
                                else if(element.type === 'Rest Action')
                                {
                                    $scope.restCallInvoke(input, element, false, i, null, fromIndex);
                                }
                                else if(element.type === 'DataRaptor Extract Action')
                                {
                                    // no pre and post tranform
                                    $scope.drExtractInvoke(element, false, i, null, fromIndex);
                                }
                                else if(element.type === 'DataRaptor Post Action')
                                {
                                    // no pre transform
                                    $scope.drPostInvoke(input, element, false, i, null, fromIndex);
                                }
                                else if(element.type === 'DataRaptor Transform Action')
                                {
                                    $scope.drTransformActionInvoke(input, element, false, i, null, fromIndex);
                                }
                                else if(element.type === 'Matrix Action')
                                {
                                    $scope.matrixActionInvoke(element, false, i, null, fromIndex);
                                }
                                else if (element.type === 'Delete Action')
                                {
                                    $scope.deleteActionInvoke(element, false, i, null, fromIndex);
                                }
                                else if(element.type === 'Post to Object Action')
                                {
                                    // no pre transform
                                    $scope.objectPostInvoke(input, element, false, i, null, fromIndex);
                                }
                                else if(element.type === 'PDF Action')
                                {
                                    // no pre transform
                                    $scope.pdfInvoke(input, element, false, i, null, fromIndex, 'fetchPDFTemplate');
                                }
                                else if(element.type === 'Set Values' || element.type === 'Set Errors')
                                {
                                    if($scope.setValuesErrors(element, false)) {
                                        bpService.fakeAsync().then(function()
                                        {
                                            $scope.nextRepeater(element.nextIndex, i);
                                        });
                                    }
                                }
                                else if(element.type === 'DocuSign Envelope Action')
                                {
                                    $scope.sendDocuSigEnvelope(input, element, false, i, fromIndex);
                                }
                                else if(element.type === 'Email Action')
                                {
                                    $scope.sendEmail(input, element, false, i, fromIndex);
                                }
                            }
                            else
                            {
                                var dataJSON = $scope.prepareInputJSON(element);
                                $scope.nextRepeater(i, fromIndex, dataJSON, 'PreTransform');
                            }
                        }

                        if(element.type === 'Done Action')
                        {
                            $scope.doneAction(element, false, i, null);
                        }
                    }
                    else if(element.type !== 'Review Action')
                    {
                        element.ui.show = true;
                        element.ui.error = true;
                        element.ui.errorMessage = customLabels.OmniActionValidationError;
                    }

                    if(element.type === 'Review Action')
                    {
                        $scope.reviewAction(element, false, i, null);
                    }
                }
                else if(element.type !== 'Step')
                {
                    $scope.nextRepeater(element.nextIndex, i);
                }

                if(element.type === 'Step')
                {
                    $scope.setStepStatus(element, true, false, false, null, null);
                    //element.bAccordionOpen = true;
                    //element.bAccordionActive = true;

                    $scope.bpTree.asIndex = i;
                    element.dirty = true;
                    // need to have a flag
                }
            }
            else if($scope.bpTree.propSetMap.timeTracking) // last Step/Action
            {
                if(fromIndex >= 0)
                   $scope.calcStepActionTiming(fromEle, false);
            }
        };

        // function to serialize pre transform, action and post transform BUTTON calls
        // @param
        // element - Action Element or persistent component (element = null)
        // scp - Element scope
        // input - JSON input for the next action call
        // stage - 'PreTransform', 'PostTransform', 'Middle' or undefined/null
        // selectedItem - in Selectable Items Element case, the item selected by the user where they trigger the remote call
        // operation - the operation of the remote call ('Delete', 'Add', etc.)
        // customizer - the customized function to be called once the remote call promise comes back
        $scope.remoteCallRepeater = function(element, scp, input, stage, selectedItem, operation, customizer, pcIndex, callback)
        {
            // pre-transform and post-transform
            // 1. DataRaptor Extract Action does not need pre and post transform
            // 2. DataRaptor Post Action does not need pre transform
            // 3. Post to Object does not need pre transform
            if(stage === 'PreTransform' || stage === 'PostTransform')
            {
                // !element ---> persistent component (cart) case
                if(!element ||
                   (element && (bpService.remoteInvokePrePostEleTypes.indexOf(element.type) >=0
                                || bpService.remoteInvokePreEleTypes.indexOf(element.type) >=0
                                || (bpService.remoteInvokePostEleTypes.indexOf(element.type) >=0 && stage === 'PostTransform')
                                || element.type === 'Filter Block' || bpService.placeholderEleTypeList.indexOf(element.type) >= 0)))
                    $scope.drTransformInvoke(input, element, true, null, scp, null, stage, selectedItem, operation, customizer, pcIndex, callback);
                else if(stage === 'PreTransform')
                    $scope.remoteCallRepeater(element, scp, input, 'Middle', selectedItem, operation, customizer, pcIndex);
            }
            else
            {
                // either it's 'Middle' stage OR
                // !stage AND there is no pre transform defined
                // we should then execute the action itself
                if(stage === 'Middle'
                   || (!stage && !element && $scope.bpTree.propSetMap.persistentComponent && pcIndex !== undefined && pcIndex !== null && !$scope.bpTree.propSetMap.persistentComponent[pcIndex].preTransformBundle)
                   || (!stage && element && !element.propSetMap.preTransformBundle))
                {
                    if(stage !== 'Middle' && !angular.equals(operation,'vlcEBOperation'))
                        input = $scope.prepareInputJSON(element);
                    stage = 'Middle';
                    // !element ---> persistent component (cart) case
                    if(!element || element.type === 'Remote Action' || element.type === 'Calculation Action'
                       || element.type === 'Filter Block' || element.type === 'Integration Procedure Action' || bpService.placeholderEleTypeList.indexOf(element.type) >= 0)
                    {
                        $scope.remoteCallInvoke(input, element, true, null, scp, selectedItem, operation, customizer, null, stage, pcIndex, callback);
                    }
                    else if(element.type === 'Rest Action')
                    {
                        $scope.restCallInvoke(input, element, true, null, scp, null, stage, operation, callback);
                    }
                    else if(element.type === 'DataRaptor Post Action')
                    {
                        // no pre transform
                        $scope.drPostInvoke(input, element, true, null, scp);
                    }
                    else if(element.type === 'DataRaptor Transform Action')
                    {
                        // no pre transform
                        $scope.drTransformActionInvoke(input, element, true, null, scp);
                    }
                    else if(element.type === 'Matrix Action')
                    {
                        // no pre transform
                        $scope.matrixActionInvoke(element, true, null, scp);
                    }
                    else if(element.type === 'Delete Action')
                    {
                        $scope.deleteActionInvoke(element, true, null, scp);
                    }
                    else if(element.type === 'Post to Object Action')
                    {
                        // no pre transform
                        $scope.objectPostInvoke(input, element, true, null, scp);
                    }
                    else if(element.type === 'PDF Action')
                    {
                        // no pre transform
                        $scope.pdfInvoke(input, element, true, null, scp, null, 'fetchPDFTemplate');
                    }
                }
                // if !stage && there is pre-transform defined
                else
                {
                	var dataJSON = input;
                	if(!angular.equals(operation,'vlcEBOperation'))
                        dataJSON = $scope.prepareInputJSON(element);
                    $scope.remoteCallRepeater(element, scp, dataJSON, 'PreTransform', selectedItem, operation, customizer, pcIndex, callback);
                }
            }
        };

        $scope.completeScript = function(bDismiss, doneConfig)
        {
            $rootScope.loading = true;
            $rootScope.loadingMessage = '';

            var configObj = {sClassName:'Vlocity CompleteScript',sInstanceId:bpService.instanceId};
            bpService.OmniRemoteInvoke(configObj).then(
                function(result)
                {
                    var resp = angular.fromJson(result);
                    $rootScope.loading = false;
                    if(resp.error && resp.error !== 'OK')
                    {
                        $window.alert(new Error(resp.error));
                    }
                    else {
                    	if(bDismiss)
                            $scope.cancel();
                    	if(doneConfig)
                            $scope.doneActionAux(doneConfig.element, doneConfig.bBtn, doneConfig.fromIndex, doneConfig.scp);
                    }
                },
                function(error)
                {
                    $rootScope.loading = false;
                    $window.alert(new Error(angular.toJson(error)));
                }
            );
        };

        $scope.copyToClipboard = function(msg, text)
        {
            $window.prompt(msg, text);
        };

        // function to call DR transform service to tranform the in and out JSON
        // @param
        // payload - JSON input
        // element - Action Element or persistent component (element = null)
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        // curIndex - current index
        // selectedItem - in Selectable Items Element case, the item selected by the user where they trigger the remote call
        // operation - the operation of the remote call ('Delete', 'Add', etc.)
        // customizer - the customized function to be called once the remote call promise comes back
        $scope.drTransformInvoke = function(payload, element, bBtn, fromIndex, scp, curIndex, stage, selectedItem, operation, customizer, pcIndex, callback)
        {
            var input = {};
            input.objectList = payload;
            var iTimeout;
            if(stage === 'PreTransform')
            {
                if(element)
                {
                    input.objectList = $scope.getSendResponseJSON(input.objectList, element.propSetMap.sendJSONPath, element.propSetMap.sendJSONNode);
                    input.bundleName = element.propSetMap.preTransformBundle;
                    if(!bBtn)
                    {
                        element.ui.preTransform = true;
                        element.ui.postTransform = false;
                    }
                }
                else if($scope.bpTree.propSetMap.persistentComponent && pcIndex !== undefined && pcIndex !== null )
                {
                    input.objectList = $scope.getSendResponseJSON(input.objectList, $scope.bpTree.propSetMap.persistentComponent[pcIndex].sendJSONPath, $scope.bpTree.propSetMap.persistentComponent[pcIndex].sendJSONNode);
                    input.bundleName = $scope.bpTree.propSetMap.persistentComponent[pcIndex].preTransformBundle;
                    input.objectList = payload.response;
                }
            }
            else if(stage === 'PostTransform')
            {
                if(element)
                {
                    input.bundleName = element.propSetMap.postTransformBundle;
                    if(!bBtn)
                    {
                        element.ui.preTransform = false;
                        element.ui.postTransform = true;
                    }
                }
                else if($scope.bpTree.propSetMap.persistentComponent && pcIndex !== undefined && pcIndex !== null)
                {
                    input.bundleName = $scope.bpTree.propSetMap.persistentComponent[pcIndex].postTransformBundle;
                }
            }

            if(element)
                iTimeout = element.propSetMap.remoteTimeout;
            else if($scope.bpTree.propSetMap.persistentComponent && pcIndex !== undefined && pcIndex !== null)
                iTimeout = $scope.bpTree.propSetMap.persistentComponent[pcIndex].remoteTimeout;

            $rootScope.loading = true;
            $rootScope.loadingMessage = '';

            if(!bBtn && element)
            {
                element.ui.show = true;
                element.ui.error = false;
                element.ui.errorMessage = '';
            }

            if(element)
            {
                $rootScope.loadingMessage = element.propSetMap.label;
                if(stage === 'PreTransform')
                    $rootScope.loadingMessage += customLabels.OmniPreTransform;
                if(stage === 'PostTransform')
                    $rootScope.loadingMessage += customLabels.OmniPostTransform;
            }

            var option = {};
            option.useQueueableApexRemoting = (element.propSetMap.useQueueableApexRemoting === true);
            option.ignoreCache = (element.propSetMap.ignoreCache === true);

            var configObj = {sClassName:bpService.sNSC+'DefaultDROmniScriptIntegration',sMethodName:'invokeTransformDR',input:angular.toJson(input),
                             options:angular.toJson(option),iTimeout:iTimeout,label:{label:element && element.name,stage:stage}};
            bpService.OmniRemoteInvoke(configObj).then(
                function(result)
                {
                    var remoteResp = angular.fromJson(result);

                    if(remoteResp && remoteResp.error !== 'OK')
                    {
                        if(customizer && customizer.constructor === Function)
                        {
                            customizer(operation, selectedItem, false, element, pcIndex, scp);
                        }

                        $scope.handleRemoteCallError(element, remoteResp.error, bBtn, false, operation, callback);
                    }
                    else
                    {
                        if(stage === 'PostTransform')
                        {
                            if(angular.equals(operation,'vlcEBOperation') && angular.isFunction(callback)){
                                callback(true);
                            }
                            if(element && element.type === 'DataRaptor Post Action')
                                ;  // do not apply
                            else if(remoteResp && remoteResp['TFDRresp'])
                            {
                                if(element)
                                    remoteResp['TFDRresp'] = $scope.getSendResponseJSON(remoteResp['TFDRresp'], element.propSetMap.responseJSONPath, element.propSetMap.responseJSONNode);
                                if($scope.bpTree.propSetMap.persistentComponent && pcIndex !== undefined && pcIndex !== null)
                                    remoteResp['TFDRresp'] = $scope.getSendResponseJSON(remoteResp['TFDRresp'], $scope.bpTree.propSetMap.persistentComponent[pcIndex].responseJSONPath, $scope.bpTree.propSetMap.persistentComponent[pcIndex].responseJSONNode);
                                if(angular.equals(operation,'typeAheadSearch') && angular.isFunction(callback)){
                                    $rootScope.loading = false;
                                    callback(remoteResp['TFDRresp']);
                                    return;
                                }
                                var validationResp = remoteResp['TFDRresp'].vlcValidationErrors;
                                var bValidationError = (validationResp && validationResp.constructor === Object && Object.getOwnPropertyNames(validationResp).length > 0)?(true):(false);

                                if(customizer && customizer.constructor === Function)
                                {
                                    if(bValidationError)
                                        customizer(operation, selectedItem, false, element, pcIndex, scp);
                                    else
                                        customizer(operation, selectedItem, true, element, pcIndex, scp);
                                }
                                var bContinue = $scope.applyCallRespMain(angular.copy(remoteResp['TFDRresp']), element, null, scp);
                                if(bValidationError && !bContinue)
                                    return;
                            }
                        }

                        $rootScope.loading = false;

                        $timeout(function(){
                            if(stage === 'PreTransform')
                            {
                                if(!bBtn)
                                    $scope.nextRepeater(curIndex, fromIndex, remoteResp['TFDRresp'], 'Middle');
                                else
                                    $scope.remoteCallRepeater(element, scp, remoteResp['TFDRresp'], 'Middle', selectedItem, operation, customizer, pcIndex, callback);
                            }
                            else if(stage === 'PostTransform')
                            {
                                $scope.handleMessaging(element, bBtn);
                                if(element && element.propSetMap.redirectPageName && element.propSetMap.redirectTemplateUrl)
                                {
                                    if(!bBtn)
                                    {
                                        element.ui.show = false;
                                        $scope.processCustomRedirect(element, remoteResp['TFDRresp'], false, null);
                                    }
                                    else
                                        $scope.processCustomRedirect(element, remoteResp['TFDRresp'], true, scp);
                                }
                                else
                                {
                                    if(!bBtn)
                                        $scope.nextRepeater(element.nextIndex, curIndex);
                                }
                            }
                            //$scope.$apply();
                        }, 0);
                    }
                },
                function(error)
                {
                    if(customizer && customizer.constructor === Function)
                    {
                        customizer(operation, selectedItem, false, element, pcIndex, scp);
                    }

                    $scope.handleRemoteCallError(element, error, bBtn, false, operation, callback);
                }
            );
        };

        // function to handle Review Action, review action supports redirect
        // @param
        // element
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        $scope.reviewAction = function(element, bBtn, fromIndex, scp)
        {
            $scope.handleMessaging(element, bBtn);
            element.ui = {};
            var redirect = element.propSetMap.redirectPageName;
            var redirectTemplateUrl = element.propSetMap.redirectTemplateUrl;
            if(redirect && redirectTemplateUrl)
            {
                redirectTemplateUrl = bpService.getHTMLTemplate(redirectTemplateUrl);
                bpService.redirectPageTemplateMap[redirect] = redirectTemplateUrl;

                var redirectJSON = angular.copy($scope.bpTree);
                redirectJSON.responseT = $scope.getSendResponseJSON(redirectJSON.response, element.propSetMap.sendJSONPath, element.propSetMap.sendJSONNode);
                if(!bBtn)
                {
                    $scope.adjustStepState(element, true);
                    redirectJSON.reviewAction = angular.copy(element);
                }
                else
                {
                    redirectJSON.reviewActionBtn = angular.copy(element);
                    redirectJSON.parentStepIndex = $scope.findStepIndex(scp, element.index, element.indexInParent);
                }
                redirectJSON.skipElements = element.propSetMap.skipElements;
                bpService.restResponse[redirect] = redirectJSON;
                $scope.redirect('/custom/' + redirect + '/review', element, bBtn);
                //$location.path('/custom/' + redirect + '/review');
            }
            else
                $scope.nextRepeater(element.nextIndex, fromIndex);
        };

        // function to handle DataRaptor Extract action
        // @param
        // element
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        // lastIndex - last index
        $scope.drExtractInvoke = function(element, bBtn, fromIndex, scp, lastIndex, operation, callback)
        {
            if(!element)
                return;

            var iTimeout = element.propSetMap.remoteTimeout;
            element.propSetMap.preTransformBundle = null;
            element.propSetMap.postTransformBundle = null;
            var input = {};
            var inputParams = element.propSetMap['dataRaptor Input Parameters'];
            var queryCriteria = {}, inputParamEle;
            if(inputParams && angular.isArray(inputParams))
            {
                for(var j=0; j<inputParams.length; j++)
                {
                    if(scp && scp.control) {
                        inputParamEle = (scp.control.blockIndex === undefined || scp.control.blockIndex === null) ?
                                        inputParams[j].element : $scope.replaceNIndex(inputParams[j].element, scp.control.blockIndex+1);
                    } else {
                        inputParamEle = inputParams[j].element;
                    }
                    queryCriteria[inputParams[j].inputParam] = $scope.getElementValue(inputParamEle);
                }
                input['DRParams'] = queryCriteria;
            }

            input['Bundle'] = element.propSetMap.bundle;
            // for DataRaptor Extract Action, we don't need pre and post transform

            $rootScope.loading = true;
            $rootScope.loadingMessage = '';

            if(!bBtn)
            {
                element.ui.show = true;
                element.ui.error = false;
                element.ui.errorMessage = '';
            }
            if(element)
                $rootScope.loadingMessage = element.propSetMap.label;
            var option = {};
            option.useQueueableApexRemoting = (element.propSetMap.useQueueableApexRemoting === true);
            option.ignoreCache = (element.propSetMap.ignoreCache === true);

            var configObj = {sClassName:bpService.sNSC+'DefaultDROmniScriptIntegration',sMethodName:'invokeOutboundDR',input:angular.toJson(input),
                             options:angular.toJson(option),iTimeout:iTimeout,label:{label:element && element.name}};
            bpService.OmniRemoteInvoke(configObj).then(
                function(result)
                {
                    var remoteResp = angular.fromJson(result);

                    if(remoteResp && remoteResp.error !== 'OK')
                    {
                        $scope.handleRemoteCallError(element, remoteResp.error, bBtn, false);
                    }
                    else
                    {
                        if(remoteResp && remoteResp['OBDRresp'])
                        {
                            remoteResp['OBDRresp'] = $scope.getSendResponseJSON(remoteResp['OBDRresp'], element.propSetMap.responseJSONPath, element.propSetMap.responseJSONNode);
                            if(angular.equals(operation,'typeAheadSearch') && angular.isFunction(callback)){
                                $rootScope.loading = false;
                                callback(remoteResp['OBDRresp']);
                                return;
                            }
                            var bContinue = $scope.applyCallRespMain(angular.copy(remoteResp['OBDRresp']), element, null, scp);
                            if(remoteResp['OBDRresp'].vlcValidationErrors && !bContinue)
                                return;
                        }
                        $scope.handleRemoteCallSuccess(element, remoteResp['OBDRresp'], bBtn, true, fromIndex, lastIndex, scp);
                    }
                },
                function(error)
                {
                    $scope.handleRemoteCallError(element, error, bBtn, false);
                }
            );
        };

          // function to handle DataRaptor Extract action
        // @param
        // element
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        // lastIndex - last index
        $scope.drTransformActionInvoke = function(payload, element, bBtn, fromIndex, scp, lastIndex)
        {
           var input = {};
            // fix the issue with contextId/ContextId
            input.objectList = angular.copy(payload.response);
            input.objectList = $scope.getSendResponseJSON(input.objectList, element.propSetMap.sendJSONPath, element.propSetMap.sendJSONNode);
            if(input.objectList)
                input.objectList.contextId = input.objectList.ContextId;
            input.bundleName = element.propSetMap.bundle;

            var iTimeout = element.propSetMap.remoteTimeout;

            $rootScope.loading = true;
            $rootScope.loadingMessage = '';

            if(!bBtn)
            {
                element.ui.show = true;
                element.ui.error = false;
                element.ui.errorMessage = '';
            }
            if(element)
                $rootScope.loadingMessage = element.propSetMap.label;

            var option = {};
            option.useQueueableApexRemoting = (element.propSetMap.useQueueableApexRemoting === true);

            var configObj = {sClassName:bpService.sNSC+'DefaultDROmniScriptIntegration',sMethodName:'invokeTransformDR',input:angular.toJson(input),
                             options:angular.toJson(option),iTimeout:iTimeout,label:{label: element && element.name}};

            bpService.OmniRemoteInvoke(configObj).then(
                function(result)
                {
                    var remoteResp = angular.fromJson(result);

                    if(remoteResp && remoteResp.error !== 'OK')
                    {
                        $scope.handleRemoteCallError(element, remoteResp.error, bBtn, false);
                    }
                    else
                    {
                        if(remoteResp && remoteResp['TFDRresp'])
                        {
                            remoteResp['TFDRresp'] = $scope.getSendResponseJSON(remoteResp['TFDRresp'], element.propSetMap.responseJSONPath, element.propSetMap.responseJSONNode);

                            var bContinue = $scope.applyCallRespMain(angular.copy(remoteResp['TFDRresp']), element, null, scp);
                            if(remoteResp['TFDRresp'].vlcValidationErrors && !bContinue)
                                return;
                        }
                        $scope.handleRemoteCallSuccess(element, remoteResp['TFDRresp'], bBtn, true, fromIndex, lastIndex, scp);
                    }
                },
                function(error)
                {
                    $scope.handleRemoteCallError(element, error, bBtn, false);
                }
            );
        };

           // function to handle Matrix Action
        // @param
        // element
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        // lastIndex - last index
        $scope.matrixActionInvoke = function(element, bBtn, fromIndex, scp, lastIndex, operation, callback)
        {
            if(!element)
                return;

            var iTimeout = element.propSetMap.remoteTimeout;
            element.propSetMap.preTransformBundle = null;
            var input = { matrixData: [{}] };

            // CMT 100, support Matrix Action in Edit Block
            var index = NaN;
            if(scp) {
            	index = scp.editBlockIndex;
            	if(index === undefined || index === null)
            		index = NaN;
            }

            var inputParams = element.propSetMap['matrix Input Parameters'];
            var queryCriteria = {};

            if(inputParams && angular.isArray(inputParams))
            {
                for(var j=0; j<inputParams.length; j++)
                {
                    var eleName = inputParams[j].name;
                    if(!angular.equals(index, NaN))
                        eleName = $scope.replaceNIndex(eleName, index+1);
                    var inputEleVal = $scope.getElementValue(eleName);

                    if (angular.isArray(inputEleVal))
                    {
                        for (i = 0; i < inputEleVal.length; i++)
                        {
                            if (input.matrixData.length-1 < i)
                            {
                                input.matrixData.push({});
                            }

                            input.matrixData[i][inputParams[j].value] = inputEleVal[i];
                        }
                    }
                    else
                    {
                        input.matrixData[0][inputParams[j].value] = inputEleVal;
                    }
                }
            }
            var option = {};

            option.PricingMatrixId = element.propSetMap.remoteOptions.matrixName;

            if (element.propSetMap.remoteOptions.postTransformBundle) {
                option.postTransformBundle = element.propSetMap.remoteOptions.postTransformBundle;
            }

            option.defaultMatrixResult = element.propSetMap.defaultMatrixResult;

            if (element.propSetMap.executionDateTime) {
                option.executionDateTime = $scope.handleMergeField(element.propSetMap.executionDateTime);
            }

            $rootScope.loading = true;
            $rootScope.loadingMessage = '';

            if(!bBtn)
            {
                element.ui.show = true;
                element.ui.error = false;
                element.ui.errorMessage = '';
            }
            if(element)
                $rootScope.loadingMessage = element.propSetMap.label;

            option.useQueueableApexRemoting = (element.propSetMap.useQueueableApexRemoting === true);

            var configObj = {sClassName:bpService.sNSC+'DefaultOmniScriptMatrix',sMethodName:'calculate',input:angular.toJson(input),
                             options:angular.toJson(option),iTimeout:iTimeout,label:{label: element && element.name}};

            bpService.OmniRemoteInvoke(configObj).then(
                function(result)
                {
                    var remoteResp = angular.fromJson(result);

                    if(remoteResp && remoteResp.error !== 'OK')
                    {
                        $scope.handleRemoteCallError(element, remoteResp.error, bBtn, false, operation, callback);
                    }
                    else
                    {
                        if(remoteResp && remoteResp['matrixResult'] && remoteResp['matrixResult'][0])
                        {
                            remoteResp['matrixResult'] = $scope.getSendResponseJSON(remoteResp['matrixResult'][0], element.propSetMap.responseJSONPath, element.propSetMap.responseJSONNode);

                            if (!element.propSetMap.postTransformBundle)
                            {
                                var bContinue = $scope.applyCallRespMain(angular.copy(remoteResp['matrixResult']), element, null, scp);
                            }
                        }

                        $scope.handleRemoteCallSuccess(element, remoteResp['matrixResult'], bBtn, true, fromIndex, lastIndex, scp, null, operation, null, null, callback);
                    }
                },
                function(error)
                {
                    $scope.handleRemoteCallError(element, error, bBtn, false, operation, callback);
                }
            );
        };

        // function to handle Delete Action
        // @param
        // element
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        // lastIndex - last index
        $scope.deleteActionInvoke = function(element, bBtn, fromIndex, scp, lastIndex, operation, callback)
        {
            if(!element)
                return;

            var iTimeout = element.propSetMap.remoteTimeout;
            // element.propSetMap.preTransformBundle = null;

            var index = NaN;
            if(scp) {
                index = scp.editBlockIndex;
                if(index === undefined || index === null)
                    index = NaN;
            }

            var inputParams = {};
            inputParams.propSetMap = element.propSetMap;

            var paramString = angular.toJson(inputParams.propSetMap);
            paramString = $scope.handleMergeField(paramString, false, null, (bBtn)?element:null, null, null, true);

            inputParams.propSetMap = angular.fromJson(paramString);

            var option = {};

            if (element.propSetMap.executionDateTime)
            {
                option.executionDateTime = element.propSetMap.executionDateTime;
            }

            $rootScope.loading = true;
            $rootScope.loadingMessage = '';

            if(!bBtn)
            {
                element.ui.show = true;
                element.ui.error = false;
                element.ui.errorMessage = '';
            }
            if(element)
                $rootScope.loadingMessage = element.propSetMap.label;

            option.useQueueableApexRemoting = (element.propSetMap.useQueueableApexRemoting === true);

            var configObj = {sClassName:bpService.sNSC+'IntegrationProcedureService',sMethodName:'vlcOmniScriptDeleteAction',input:angular.toJson(inputParams),
            options:angular.toJson(option),iTimeout:iTimeout,label:{label: element && element.name}};

            bpService.OmniRemoteInvoke(configObj).then(
                function(result)
                {
                    var remoteResp = angular.fromJson(result);

                    if(remoteResp && remoteResp.error !== 'OK')
                    {
                        $scope.handleRemoteCallError(element, remoteResp.error, bBtn, false, operation, callback);
                    }
                    else
                    {
                        if(remoteResp && remoteResp['deleteResult'] && remoteResp['deleteResult'][0])
                        {
                            remoteResp['deleteResult'] = $scope.getSendResponseJSON(remoteResp['deleteResult'][0], element.propSetMap.responseJSONPath, element.propSetMap.responseJSONNode);
                            var bContinue = $scope.applyCallRespMain(angular.copy(remoteResp['deleteResult']), element, null, scp);
                        }

                        $scope.handleRemoteCallSuccess(element, remoteResp['deleteResult'], bBtn, true, fromIndex, lastIndex, scp, null, operation, null, null, callback);
                    }
                },
                function(error)
                {
                    $scope.handleRemoteCallError(element, error, bBtn, false, operation, callback);
                }
            );
        };

        // function to handle pdf generation
        // @param
        // element
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        // lastIndex - last index
        // function to handle DataRaptor Post Action
        // @param
        // payload - JSON input
        // element
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        // lastIndex - last index
        $scope.pdfInvoke = function(payload, element, bBtn, fromIndex, scp, lastIndex, methodName)
        {
            if(!methodName && bBtn)
            {
                $scope.remoteCallRepeater(element, scp, payload, methodName);
                return;
            }

            var iTimeout = element.propSetMap.remoteTimeout;
            element.propSetMap.postTransformBundle = null;
            var input = {};
            if(methodName === 'fetchPDFTemplate')
                input.templateName = element.propSetMap.templateName;
            else
            {
                input = payload;
                if(!element.propSetMap.preTransformBundle)
                    input = $scope.getSendResponseJSON(input, element.propSetMap.sendJSONPath, element.propSetMap.sendJSONNode);
            }

            $rootScope.loading = true;
            $rootScope.loadingMessage = '';

            if(!bBtn)
            {
                element.ui.show = true;
                element.ui.preTransform = false;
                element.ui.error = false;
                element.ui.errorMessage = '';
            }
            if(element)
                $rootScope.loadingMessage = element.propSetMap.label;

            var option = {};
            option.useQueueableApexRemoting = (element.propSetMap.useQueueableApexRemoting === true);

            var configObj = {sClassName:bpService.sNSC+'DefaultPDFOmniScriptIntegration',sMethodName:methodName,input:angular.toJson(input),
		                     options:angular.toJson(option),iTimeout:iTimeout,label:{label:element && element.name}};
		    bpService.OmniRemoteInvoke(configObj).then(
                function(result)
                {
                    // remoteResp will not be undefined or null, because it always calls GenericInvoke
                    var remoteResp = angular.fromJson(result);
                    var respError;
                    var formFields;

                    if(remoteResp.error !== 'OK')
                        respError = remoteResp.error;
                    else if(methodName === 'fetchPDFTemplate')
                    {
                        if(!remoteResp.templateBody)
                            respError = customLabels.OmniPDFError;
                        else
                        {
                            var pdfDocument = new buffer.Buffer(remoteResp.templateBody, 'base64');
                            if(!pdfDocument)
                                respError = customLabels.OmniPDFError;
                            else
                            {
                                formFields = vlocityPdfWriter.getFormFields(pdfDocument);
                                if(formFields === undefined || formFields === null || !angular.isArray(formFields)
                                   || formFields.length <= 0)
                                    respError = customLabels.OmniPDFError;
                            }
                        }
                    }

                    if(respError)
                        $scope.handleRemoteCallError(element, respError, bBtn, false);
                    else
                    {
                        if(methodName === 'fetchPDFTemplate')
                        {
                            var options = {};
                            options.dateFormat = element.propSetMap.dateFormat;
                            options.dateTimeFormat = element.propSetMap.dateTimeFormat;
                            options.timeFormat = element.propSetMap.timeFormat;
                            options.readOnly = element.propSetMap.readOnly;

                            try {
                                var filledinForm = vlocityPdfWriter.fillPdfForm(pdfDocument, payload, options);
                                var tempInput = {};
                                tempInput.vlcAttachmentBody = filledinForm.toString('base64');

                                $scope.handleRemoteCallSuccess(element, tempInput, bBtn, true, fromIndex, lastIndex, scp);
                            } catch (e) {
                                $scope.handleRemoteCallError(element, element.propSetMap.label + " - " + customLabels.OmniPDFError + " - " + e, bBtn, false);
                            }
                        }
                    }
                },
                function(error)
                {
                    $scope.handleRemoteCallError(element, error, bBtn, false);
                }
            );
        };

        // function to handle DataRaptor Post Action
        // @param
        // payload - JSON input
        // element
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        // lastIndex - last index
        $scope.drPostInvoke = function(payload, element, bBtn, fromIndex, scp, lastIndex, operation, callback)
        {
            var input = {};
            // fix the issue with contextId/ContextId
            input.objectList = angular.copy(payload.response);
            input.objectList = $scope.getSendResponseJSON(input.objectList, element.propSetMap.sendJSONPath, element.propSetMap.sendJSONNode);
            if(input.objectList)
                input.objectList.contextId = input.objectList.ContextId;
            input.bundleName = element.propSetMap.bundle;

            input.filesMap = VOUINS.getFilesMap(payload.filesMap, $rootScope.isSforce, $rootScope.sforce);

            var iTimeout = element.propSetMap.remoteTimeout;

            $rootScope.loading = true;
            $rootScope.loadingMessage = '';

            if(!bBtn)
            {
                element.ui.show = true;
                element.ui.error = false;
                element.ui.errorMessage = '';
            }
            if(element)
                $rootScope.loadingMessage = element.propSetMap.label;

            var option = {};
            option.useQueueableApexRemoting = (element.propSetMap.useQueueableApexRemoting === true);

            var configObj = {sClassName: bpService.sNSC+'DefaultDROmniScriptIntegration',sMethodName:'invokeInboundDR',input: angular.toJson(input),
                             options: angular.toJson(option),iTimeout: iTimeout,label: {label: element && element.name}};
            bpService.OmniRemoteInvoke(configObj).then(
                function(result)
                {
                    var remoteResp = angular.fromJson(result);

                    if(remoteResp && remoteResp.error !== 'OK')
                    {
                        $scope.handleRemoteCallError(element, remoteResp.error, bBtn, false, operation, callback);
                    }
                    else
                    {
                        if(angular.equals(operation,'vlcEBOperation') && angular.isFunction(callback)){
                            callback(true);
                        }
                        // for DR Post, for the time being, we don't apply the response to OmniScript
                        if(remoteResp && remoteResp['IBDRresp'])
                        {
                            var bContinue = $scope.applyCallRespMain(remoteResp['IBDRresp'], element, null, scp);
                            if(remoteResp['IBDRresp'].vlcValidationErrors && !bContinue)
                                return;

                            // include the record created in the data json if there is only one record created
                            if(remoteResp['IBDRresp'].createdObjectsByType)
                            {
                                var recMap = remoteResp['IBDRresp'].createdObjectsByType[element.propSetMap.bundle];
                                if(recMap)
                                {
                                    var recCreatedJSON = {};
                                    for (var key in recMap)
                                    {
                                        if(recMap.hasOwnProperty(key))
                                        {
                                            var data = recMap[key];
                                            if(data !== undefined && data != null && angular.isArray(data) && data.length === 1)
                                                recCreatedJSON['DRId_'+key] = data[0];
                                        }
                                    }
                                    $scope.bpTree.response = $.extend({}, $scope.bpTree.response, recCreatedJSON);
                                }
                            }

                            $scope.handleRemoteCallSuccess(element, remoteResp['IBDRresp'], bBtn, true, fromIndex, lastIndex, scp);
                        }
                        else
                        {
                            $scope.handleRemoteCallSuccess(element, remoteResp['IBDRresp'], bBtn, true, fromIndex, lastIndex, scp);
                        }

                    }
                },
                function(error)
                {
                    $scope.handleRemoteCallError(element, error, bBtn, false, operation, callback);
                }
            );
        };

        // helper function - when remote call errors out
        // @param
        // element
        // errorMsg - error msg to display
        // bBtn - button case or not
        // bApply - call $scope.$apply() or not
        $scope.handleRemoteCallError = function(element, errorMsg, bBtn, bApply, operation, callback)
        {
            errorMsg = $scope.errorReplace(errorMsg, element);

        	// v16 Edit Block
            if(angular.equals(operation,'vlcEBOperation') && angular.isFunction(callback)){
                callback(false);
            }

            if (!element.propSetMap.invokeMode){
                $rootScope.loading = false;
            }

            if(element && !(bBtn || element.propSetMap.invokeMode) && element.type !== 'Step')
            {
                element.ui.error = true;
                element.ui.errorMessage = errorMsg;
            }
            else
            {
                if (errorMsg)
                {
                    if (typeof errorMsg === 'string')
                    {
                        $window.alert(new Error(errorMsg));
                    }
                    else // with errorReplace added, this should never be reached
                    {
                        $window.alert(new Error(angular.toJson(errorMsg)));
                    }
                }
                else
                {
                    $window.alert(new Error(customLabels.OmniError));
                }
            }

            if(bApply)
                $scope.$apply();
        };

        $scope.handleRemoteCallRedirect = function(element, resp, bBtn, scp)
        {
            if(!bBtn)
            {
                element.ui.show = false;
                $scope.processCustomRedirect(element, resp, false, null);
            }
            else
                $scope.processCustomRedirect(element, resp, true, scp);
        }

        // helper function - when remote call errors out
        // @param
        // element
        // resp - remote call response to be applied
        // bBtn - button case or not
        // bApply - call $scope.$apply() or not
        // fromIndex - previous index
        // lastIndex - last index
        // scp - Element scope in button case
        // selectedItem - in Selectable Items Element case, the item selected by the user where they trigger the remote call
        // operation - the operation of the remote call ('Delete', 'Add', etc.)
        // customizer - the customized function to be called once the remote call promise comes back
        $scope.handleRemoteCallSuccess = function(element, resp, bBtn, bApply, fromIndex, lastIndex, scp, selectedItem, operation, customizer, pcIndex, callback)
        {
            var syncProm;
        	// v16 Edit Block
            if(angular.equals(operation,'vlcEBOperation') && angular.isFunction(callback)){
                callback(true);
            }

            if (element.propSetMap.invokeMode){
                syncProm = {then:function(successCallback){successCallback();}}
            } else {
                $rootScope.loading = false;
                syncProm = VOUINS.syncFileAttachmentData(resp, true, $rootScope, $q, $scope, $scope.bpTree.filesMap, bpService, $window);
            }

            syncProm.then(function () {
                $timeout(function()
                {
                    if(element)
                    {
                        if(!element.propSetMap.postTransformBundle)
                        {
                            $scope.handleMessaging(element, bBtn);

                            var hasRedirect = element.propSetMap.redirectPageName && element.propSetMap.redirectTemplateUrl;

                            if(element && element.type === 'PDF Action' && resp && resp.vlcAttachmentBody)
                            {
                                var parentId = $scope.handleMergeField(element.propSetMap.attachmentParentId);
                                var customFileName = $scope.handleMergeField(element.propSetMap.attachmentName).replace(/\.pdf/,'').replace(/\./g,'');
                                var configObj = {sClassName:'Vlocity CreateOSAttachment',input: resp.vlcAttachmentBody,
                                                 parentId: parentId||'TEMP',fileName:(customFileName||element.name) + '.pdf', options:'{}'};
                                bpService.OmniRemoteInvoke(configObj).then(function(attachmentId)
                                {
                                    $rootScope.loading = false;
                                    resp.attachmentUrl = $scope.instanceHost+'/servlet/servlet.FileDownload?file='+attachmentId;

                                    if(hasRedirect)
                                    {
                                        $scope.handleRemoteCallRedirect(element, resp, bBtn, scp);
                                    }
                                    else
                                    {
                                        if (element.propSetMap.showPopup&&!$window.open(resp.attachmentUrl))
                                        {
                                            $window.alert(customLabels.OmniPopupBlocked);
                                        }
                                        if(!bBtn){
                                            $scope.nextRepeater(element.nextIndex, fromIndex);
                                        }
                                    }
                                    if (!parentId){
                                        // Delete Attachment Parent Record for TEMP files
                                        $timeout(function() {
                                            var configObj = { sClassName:'Vlocity DeleteOSAttachment',
                                                                attachmentId: attachmentId,
                                                             deleteParent:true };
                                            bpService.OmniRemoteInvoke(configObj);
                                        }, 10000);
                                    }
                                    var temp = {};
                                    temp[element.name] = {attachmentId: attachmentId}
                                    $scope.applyCallResp(temp);
                                }, function(error){
                                    $rootScope.loading = false;
                                    // If this errors out it may have been a forceTk issue and will need to be cleaned up as well
                                    if (error.attachmentId)
                                    {
                                        var configObj = {sClassName:'Vlocity DeleteOSAttachment',attachmentId: error.attachmentId,
                                                         deleteParent: true};
                                        bpService.OmniRemoteInvoke(configObj);
                                    }
                                    var errorMsg = $scope.errorReplace(error, element);
                                    $window.alert(new Error(customLabels.OmniPDFError + ': ' + errorMsg));
                                })
                                $rootScope.loading = true;
                            }
                            else
                            {
                                if (hasRedirect)
                                {
                                    $scope.handleRemoteCallRedirect(element, resp, bBtn, scp);
                                }
                                else
                                {
                                    if(element && element.type === 'Step')
                                        $scope.nextRepeater(element.nextIndex, lastIndex, null, 'stepRemoteCallDone');
                                    else if(!bBtn && !element.propSetMap.invokeMode)
                                        $scope.nextRepeater(element.nextIndex, fromIndex);
                                }
                            }
                        }
                        else
                        {
                            if(!bBtn)
                                $scope.nextRepeater(fromIndex, lastIndex, resp, 'PostTransform');
                            else
                                $scope.remoteCallRepeater(element, scp, resp, 'PostTransform', selectedItem, operation, customizer, pcIndex, callback);
                        }
                    }
                    else
                    {
                       if($scope.bpTree.propSetMap.persistentComponent && pcIndex !== undefined && pcIndex !== null && $scope.bpTree.propSetMap.persistentComponent[pcIndex].postTransformBundle)
                       {
                           $scope.remoteCallRepeater(element, scp, resp, 'PostTransform', selectedItem, operation, customizer, pcIndex, callback);
                       }
                    }
                }, 0);
            });
        };

        // function to handle the custom redirect
        // @param
        // element
        // resp - remote call response
        // bBtn - button case or not
        // scp - Element scope in button case
        $scope.processCustomRedirect = function(element, resp, bBtn, scp)
        {
            // Last Action
            if(!bBtn && bpService.sflMode && element && element.nextIndex === null)
                $scope.completeScript(false);

            var redirect = element.propSetMap.redirectPageName;
            var redirectTemplateUrl = element.propSetMap.redirectTemplateUrl;

            $scope.adjustshowPC(element);

            if(redirect && redirectTemplateUrl)
            {
                redirectTemplateUrl = bpService.getHTMLTemplate(redirectTemplateUrl);
                bpService.redirectPageTemplateMap[redirect] = redirectTemplateUrl;

                bpService.restResponse[redirect] = {};
                bpService.restResponse[redirect].bpTree = angular.copy($scope.bpTree);
                if(bBtn)
                {
                    bpService.restResponse[redirect].bpTree.redirectActionBtn = angular.copy(element);
                    bpService.restResponse[redirect].bpTree.parentStepIndex = $scope.findStepIndex(scp, element.index, element.indexInParent);
                }
                else
                {
                    $scope.adjustStepState(element, false);
                    bpService.restResponse[redirect].bpTree.redirectAction = angular.copy(element);
                }
                bpService.restResponse[redirect].response = resp;
                $scope.redirect('/custom/' + redirect, element, bBtn);
                //$location.path('/custom/' + redirect);
            }
        };

        // user click - function to delete the repeatable element
        // @param
        // scp - Element scope
        // control - Element
        // index - the index of the repeatable elemen to be removed
        $scope.removeItem = function(scp, control, index)
        {
            /*
            console.debug('object is ' + control.eleArray[index].name);
            control.eleArray[index] = {};
            */

            control.eleArray.splice(index, 1);

            /*
            console.debug('lengther is ' + control.eleArray.length);
            */

            for(var i=index; i<control.eleArray.length; i++) {
                control.eleArray[i].index = control.eleArray[i].index-1;

                for(var j=0; j<control.eleArray[i].children.length; j++) {
                     if(control.eleArray[i].children[j].eleArray[0].type === 'Type Ahead Block'){
                        control.eleArray[i].children[j].blockIndex = control.eleArray[i].index;
                        control.eleArray[i].children[j].eleArray[0].blockIndex = control.eleArray[i].index;
                        control.eleArray[i].children[j].eleArray[0].children[0].eleArray[0].blockIndex = control.eleArray[i].index;
                     }
                }
            }

            if(control.eleArray[0].type === 'Block' && scp.$parent && scp.$parent.$parent) {
                var parentNode = scp.$parent.$parent.$parent;
                if(parentNode)
                    bpService.aggregate(parentNode, control.index, control.indexInParent, false, index);
            } else {
                bpService.aggregate(scp, control.index, control.indexInParent, false, index);
            }
        };

        // helper function to nullify the response when an element (especially block or nested block)
        // is repeated
        // @param
        // eleNode
        $scope.nullifyResponse = function(eleNode)
        {
            if(eleNode)
            {
                if(bpService.blockEleTypeList.indexOf(eleNode.type) >= 0)
                {
                    var blkResp = eleNode.response;
                    if(blkResp)
                        eleNode.response = nullifyBlockResponse(blkResp);
                }
                else
                    eleNode.response = null;
                if(eleNode.type === 'Multi-select' && angular.isArray(eleNode.propSetMap.options))
                {
                    for(var k=0; k<eleNode.propSetMap.options.length; k++)
                        delete eleNode.propSetMap.options[k].selected;
                }
                if(eleNode.children.length === 0)
                    return;
                else
                {
                    for(var i=0; i<eleNode.children.length; i++)
                    {
                        if(eleNode.children[i].response)
                            eleNode.children[i].response = nullifyBlockResponse(eleNode.children[i].response);

                        for(var j=0; j<eleNode.children[i].eleArray.length; j++)
                        {
                            $scope.nullifyResponse(eleNode.children[i].eleArray[j]);
                        }
                    }
                }
            }
        };

        // helper function to call shared aggregate in bpService
        $scope.aggregate = function(scp, arrayIndex, indexInParent, bUIUpdate, removeIndex)
        {
            bpService.aggregate(scp, arrayIndex, indexInParent, bUIUpdate, removeIndex);
        };

        $scope.resetSrvErr = function(control)
        {
            if(control.srvErr)
                control.srvErr = null;
            var result = {};
            var currentStep = $scope.bpTree.children[$scope.bpTree.asIndex];
            searchSrvErr(currentStep, result);
            if(!result.bFound)
                $scope.bpTree.children[$scope.bpTree.asIndex].bSrvErr = false;

            if (window.event && window.event.type === "focus") {
                /*
                 * OMNI-839 - Add postMessage support to send messages across iframe's to tell
                 * parent where the Script is up to. Don't leak extra info though, just element name.
                 */
                $window.parent.postMessage(JSON.stringify({
                    name: control.name,
                    type: control.type
                }), "*");
                $scope.setSessionStorageMessage({
                    name: control.name,
                    type: control.type,
                    messageType: 'focus'
                });
            }
        };

        $scope.clearSrvErr = function(stepIndex)
        {
            var step = $scope.bpTree.children[stepIndex];
            for(var i=0; i < step.children.length; i++)
            {
                for(var j=0; j<step.children[i].eleArray.length; j++)
                    nullifySrvErr(step.children[i].eleArray[j]);
            }
            $scope.children[stepIndex].bSrvErr = false;
        };

        // user click - Submit button
        // with the new action framework in 2.7, recommend the user to move away from using Submit type
        // Submit button will get retired in future release
        // @param
        // control - Element
        $scope.submit = function(scp, control)
        {
            if($scope.checkValidity(scp, control.index, control.indexInParent, 'Submit'))
                return;

            var confirmRedirect = control.propSetMap? control.propSetMap.confirmRedirectPageName: control.confirmRedirectPageName;
            var confirmRedirectTemplateUrl = control.propSetMap? control.propSetMap.confirmRedirectTemplateUrl: control.confirmRedirectTemplateUrl;
            if(confirmRedirect && confirmRedirectTemplateUrl)
            {
                confirmRedirectTemplateUrl = bpService.getHTMLTemplate(confirmRedirectTemplateUrl);
                if($scope.bpTree.response)
                {
                    $scope.bpTree.response.userId = $scope.bpTree.userId;
                    $scope.bpTree.response.userName = $scope.bpTree.userName;
                    $scope.bpTree.response.userProfile = $scope.bpTree.userProfile;
                    $scope.bpTree.response.timeStamp = $scope.bpTree.timeStamp;
                    $scope.bpTree.ContextId = bpService.parentObjectId;
                    $scope.bpTree.response.ContextId = bpService.parentObjectId;
                    $scope.bpTree.response.userCurrencyCode = $scope.bpTree.userCurrencyCode;
                }

                if(control.propSetMap.postNameTemplate && !$scope.bpTree.bpApplicationName) {
                    $scope.bpTree.bpApplicationName = $scope.handleMergeField(control.propSetMap.postNameTemplate);
                }

                bpService.redirectPageTemplateMap[confirmRedirect] = confirmRedirectTemplateUrl;
                var ctrl = angular.copy(control);
                ctrl.type = 'Button';
                $scope.bpTree.submitButton = ctrl;
                bpService.restResponse[confirmRedirect] = angular.fromJson(angular.toJson($scope.bpTree));
                $location.path('/custom/' + confirmRedirect);
            }
        };

        $scope.navigateAux = function(bpTree, control, redirect, direction)
        {
            if(!control)
                return;

            if(bpTree)
            {
            	if(bpTree.responseT)
            	    delete bpTree.responseT;
                var path;
                if(bpTree.IdMode === false)
                {
                    if(!bpService.urlMode)
                        path = '/OmniScriptType/' + bpTree.bpType + '/OmniScriptSubType/' + bpTree.bpSubType + '/OmniScriptLang/' + bpTree.bpLang
                                   + '/ContextId/' + bpService.parentObjectId + '/PrefillDataRaptorBundle/' + bpService.pfDRBundle + '/' + bpService.verticalMode + '/false/' + redirect;
                    else
                        path = '/' + bpService.verticalMode + '/false/' + redirect;
                }
                else
                {
                    var sId = (bpService.resumeMode)?(bpService.appId):(bpService.bpId);
                    if(bpService.sflMode)
                        sId = bpService.instanceId;
                    if(!bpService.urlMode)
                        path = '/OS/' + sId + '/scriptState/' + bpService.scriptState + '/' + bpService.verticalMode + '/false/' + redirect;
                    else
                        path = '/' + bpService.verticalMode + '/false/' + redirect;
                }

                if(direction)
                    path += '/' + direction;
                $location.path(path);
            }
        };

        // user click - navigate back from the custom redirect to the main flow
        // action case
        // @param
        // bpTree - script tree
        // control - Element
        $scope.goBack = function(bpTree, control)
        {
            $scope.navigateAux(bpTree, control, control.propSetMap.confirmRedirectPageName);
        };

        // user click - navigate buttons on the actions between steps
        // @param
        // bpTree - script tree
        // control - Element
        // direction - forward or backward nav
        $scope.navigate = function(bpTree, control, direction)
        {
            $scope.navigateAux(bpTree, control, control.propSetMap.redirectPageName, direction);
        };

        // user click - navigate back from the custom redirect back to the main flow
        // - button case
        // @param
        // bpTree - script tree
        // control - Element
        // parentStepIndex - index of the parent step where the redirect initiates
        $scope.navigateBackToStep = function(bpTree, control)
        {
            $scope.navigateAux(bpTree, control, control.propSetMap.redirectPageName);
        };

        // user click - Cancel button to quit the script
        $scope.cancel = function()
        {
            // Prevents cancel functionality if cancel is not allowed
            if($scope.bpTree.propSetMap.allowCancel !== true)
            {
                return;
            }

            if($scope.bpTree.propSetMap.timeTracking)
            {
                $scope.trackOutcome($scope.bpTree.children[$scope.bpTree.asIndex], 'Cancel');
            }

            var cancelType = $scope.bpTree.propSetMap.cancelType;
            if(cancelType === 'Dismiss')
                $location.path('/cancel');
            else
            {
                $scope.bpTree.propSetMap.cancelType = ($scope.bpTree.propSetMap.cancelType === undefined)?('SObject'):($scope.bpTree.propSetMap.cancelType);
                $scope.bpTree.propSetMap.cancelSource = ($scope.bpTree.propSetMap.cancelSource === undefined)?('%ContextId%'):($scope.bpTree.propSetMap.cancelSource);
                $scope.bpTree.propSetMap.cancelRedirectPageName = ($scope.bpTree.propSetMap.cancelRedirectPageName === undefined)?('mobileDone'):($scope.bpTree.propSetMap.cancelRedirectPageName);
                $scope.bpTree.propSetMap.cancelRedirectTemplateUrl = ($scope.bpTree.propSetMap.cancelRedirectTemplateUrl === undefined)?('vlcMobileConfirmation.html'):($scope.bpTree.propSetMap.cancelRedirectTemplateUrl);

                var fakeEle = {};
                fakeEle.type = 'Cancel Script';
                fakeEle.propSetMap = {"type":$scope.bpTree.propSetMap.cancelType,"source":$scope.bpTree.propSetMap.cancelSource,"redirectPageName":$scope.bpTree.propSetMap.cancelRedirectPageName,"redirectTemplateUrl":$scope.bpTree.propSetMap.cancelRedirectTemplateUrl,
                               "wpm":$scope.bpTree.propSetMap.wpm, "ssm":$scope.bpTree.propSetMap.ssm,
                               "message":$scope.bpTree.propSetMap.message};
                $scope.handleMessaging(fakeEle, false);
                $scope.doneCancelAux(fakeEle.propSetMap, true);
            }
        };

        if ($rootScope.tabKey) {
            var handle_message = function(e) {
                if (!e) { e = window.event; }
                e = e.data;
                if (angular.isString(e)) {
                    e = JSON.parse(e);
                }
                if (!e.key) {
                    return;
                }
                var keyParts = e.key.split(".");
                if (keyParts[0] === $rootScope.tabKey &&
                    (keyParts[1] === "ouiTestJson")) {
                        switch (keyParts[1]) {
                            case 'ouiTestJson': pendingInitialLoad = false;
                                                if ($scope.bpTree) {
                                                    var newValue = JSON.stringify(JSON.parse(e.newValue), null, 4);
                                                    if (pendingBpTreeIfNonExisting && newValue === "null") {
                                                        $scope.$evalAsync(function() {
                                                            $scope.bpTree.responseAsText = pendingBpTreeIfNonExisting;
                                                            $scope.applyCallResp($scope.bpTree.responseAsText);
                                                        });
                                                    } else if (newValue !== $scope.bpTree.responseAsText) {
                                                        $scope.$evalAsync(function() {
                                                            $scope.bpTree.responseAsText = newValue;
                                                            $scope.applyCallResp($scope.bpTree.responseAsText);
                                                        });
                                                    }
                                                }
                            default:        break;
                        }
                }
            }

            ////////////
            // added for designer
            if (window.addEventListener) {
                window.addEventListener("message", handle_message, false);
            } else {
                window.attachEvent("onmessage", handle_message, false);
            };

            $scope.$watch("bpTree.responseAsText", function(newValue, oldValue) {
                if (newValue && newValue !== oldValue) {
                    try {
                        var asJson = JSON.parse(newValue);
                        if (asJson) {
                            if (Object.keys($scope.bpTree.response).length < 8) {
                                $timeout(function() {
                                    // triggers blur which triggers aggregate which updates the JSON
                                    $('[ng-blur]').blur();
                                }, 200);
                            }
                            $window.parent.postMessage({
                                key: $rootScope.tabKey + ".ouiTestJson",
                                newValue: newValue
                            }, '*');
                        }
                    } catch (e) {
                        // swallow invalid JSON
                    }
                }
            });
        }
        ////////////

        // user click - simulate a prefill in the trouble shoot widget
        // @param
        // bundleName - DR bundle
        // ctxObjId - Context Id
        $scope.invokeDR = function(bundleName, ctxObjId)
        {
            var inputMap = {'bundleName': bundleName ,'ctxObjId': ctxObjId};
            inputMap = JSON.stringify(inputMap);

            var className = 'DefaultDROmniScriptIntegration';
            var methodName = 'processDRQuery';
            $rootScope.loading = true;
            $rootScope.loadingMessage = '';

            var option = {};

            var configObj = {sClassName:className,sMethodName:methodName,input:inputMap,
                             options:angular.toJson(option),iTimeout:2000,label:null};
            bpService.OmniRemoteInvoke(configObj).then(
                function(result)
                {
                    var remoteResp = angular.fromJson(result);

                    if($scope.previewMode) {
                        $scope.addDebugLog('invoke Prefill test', result);
                    }

                    if(remoteResp)
                    {
                        if(remoteResp.error !== 'OK')
                        {
                            $rootScope.loading = false;
                            $window.alert(new Error(remoteResp.error));
                        }
                        else
                        {
                            $scope.applyCallResp(remoteResp.result);
                            $rootScope.loading = false;
                        }
                    }
                    else
                        $rootScope.loading = false;
                },
                function(error)
                {
                    $rootScope.loading = false;
                    $window.alert(new Error(angular.toJson(error)));
                }
            );
        };

        $scope.getSendResponseJSON = function(response, path, rootNode)
        {
            var resp;
            var rNode;
            //preparing the node to be used as response (value)
            if(path) {
                var propArray = $scope.preprocessElementInput(path);
                if(propArray && propArray.length > 0) {
                    resp = $scope.getJSONNode(response, propArray) || {};
                    rNode = propArray[propArray.length-1][0];
                }
            }
            else {
                resp = angular.copy(response);
            }
            response = {};

            //no root node
            if((!path && !rootNode) || rootNode === 'VlocityNoRootNode') {
                response = resp;
            }
            //nested root node
            else if(rootNode.indexOf(':') > -1) {
                var nodeKeys = $scope.preprocessElementInput(rootNode);
                if(nodeKeys && nodeKeys.length > 0) {
                    response = {};
                    var reference = response;
                    var element;
                    //key1:key2:key3 will create a nested object {key1:{key2:{key3:resp}}}
                    for(var i = 0; i < nodeKeys.length; i++) {
                        if(element) {
                            reference = reference[element];
                        }
                        element = nodeKeys[i][0];
                        reference[element] = {};
                    }
                    //innermost node
                    reference[element] = resp;
                }
            }
            //one root node
            else {
                //use rootNode over path's node
                rNode = rootNode ? rootNode : rNode;
                response[rNode] = resp;
            }

            return response;
        };
        $scope.handleExtraPayload = function(extraPayloadProp, input, bBtn, element, scp)
        {
            var ePayloadString = angular.toJson(angular.copy(extraPayloadProp));
            if(scp && scp.control && scp.control.blockIndex !== undefined && scp.control.blockIndex !== null)
                ePayloadString = $scope.handleMergeField(ePayloadString, false, null, (bBtn)?element:null, null, scp.control.blockIndex, true);
            else
                ePayloadString = $scope.handleMergeField(ePayloadString, false, null, (bBtn)?element:null, null, scp?scp.editBlockIndex:null, true);
            var ePayload = angular.fromJson(ePayloadString);
            var tempPayload = angular.copy(input);
            (_.mergeWith||_.merge)(tempPayload, ePayload, VOUINS.mergeJSONLogic);
            input = tempPayload;

            return input;
        };

        // function to handle Rest Call Action
        // @param
        // payload - JSON input
        // element - Action Element or persistent component (element = null)
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        // lastIndex - last index
        // stage - 'Pretransform', 'PostTransform', 'Middle', undefined/null
        $scope.restCallInvoke = function(payload, element, bBtn, fromIndex, scp, lastIndex, stage, operation, callback)
        {
            if(!element)
                return;

            var restType = element.propSetMap.type;
            if(restType === undefined || restType === null)
                restType = 'Apex'; // default

            var input = payload;

            if(!stage && bBtn)
            {
                $scope.remoteCallRepeater(element, scp, input, stage, null, operation, null, null, callback);
                return;
            }

            // element should never be undefined or null
            var path = element.propSetMap.restPath;
            var method = element.propSetMap.restMethod;

            if(!element.propSetMap.preTransformBundle && restType !== 'Named Credential' && restType !== 'SOAP/XML')
                input = $scope.getSendResponseJSON(input, element.propSetMap.sendJSONPath, element.propSetMap.sendJSONNode);

            if(!bBtn)
                element.ui.preTransform = false;

            $rootScope.loading = true;
            $rootScope.loadingMessage = '';

            if(!bBtn)
            {
                element.ui.show = true;
                element.ui.error = false;
                element.ui.errorMessage = '';
            }
            if(element)
                $rootScope.loadingMessage = element.propSetMap.label;

            // v16, additional payload
            if(element.propSetMap.extraPayload && Object.getOwnPropertyNames(element.propSetMap.extraPayload).length > 0) {
                input = $scope.handleExtraPayload(element.propSetMap.extraPayload, input, bBtn, element, scp);
            }

            if(scp && scp.control && scp.control.blockIndex !== undefined && scp.control.blockIndex !== null)
                path = $scope.handleMergeField(path, false, null, (bBtn)?element:null, null, scp.control.blockIndex);
            else
                path = $scope.handleMergeField(path, false, null, (bBtn)?element:null, null, scp?scp.editBlockIndex:null);

            switch(restType)
            {
                case 'Apex':
                    if($scope.bpTree.filesMap)
                        input.vlcFilesMap = VOUINS.getFilesMap($scope.bpTree.filesMap, $rootScope.isSforce, $rootScope.sforce);

                    input = method === 'GET' ? null : input;
                    var configObj = {path:path, input:input, method:method, label:{label: (element && element.name) || false}};
                    bpService.OmniRestInvoke(configObj).then(
                        function (data){
                             if(!element.propSetMap.postTransformBundle)
                                 data = $scope.getSendResponseJSON(data, element.propSetMap.responseJSONPath, element.propSetMap.responseJSONNode);
                             if(data && !element.propSetMap.postTransformBundle)
                             {
                                 if(angular.equals(operation,'typeAheadSearch') && angular.isFunction(callback)){
                                     $rootScope.loading = false;
                                     callback(data);
                                     return;
                                 }

                                 var bContinue = $scope.applyCallRespMain(angular.copy(data), element, null, scp);
                                 if(data.vlcValidationErrors && !bContinue)
                                     return;
                             }

                             $scope.handleRemoteCallSuccess(element, data, bBtn, true, fromIndex, lastIndex, scp, null, operation, null, null, callback);
                        },
                        function (jqXHR){
                             $scope.handleRemoteCallError(element, jqXHR.responseText, bBtn, true, operation, callback);
                    });
                    break;
                case 'Web':
                case 'Named Credential':
                case 'SOAP/XML':
                    var headerObj = {};
                    var paramObj = {};
                    var eleCopy = angular.copy(element);
                    var cache = (element.propSetMap.restOptions && element.propSetMap.restOptions.cache !== undefined &&
                                 element.propSetMap.restOptions.cache !== null)?(element.propSetMap.restOptions.cache):false;
                    eleCopy.propSetMap.restOptions.cache = cache;
                    var URIEncode = (element.propSetMap.restOptions && element.propSetMap.restOptions.URIEncode !== undefined &&
                                     element.propSetMap.restOptions.URIEncode !== null)?(element.propSetMap.restOptions.URIEncode):false;
                    eleCopy.propSetMap.restOptions.URIEncode = URIEncode;
                    var timeout = (element.propSetMap.restOptions && element.propSetMap.restOptions.timeout !== undefined &&
                                   element.propSetMap.restOptions.timeout !== null)?(element.propSetMap.restOptions.timeout):null;
                    eleCopy.propSetMap.restOptions.timeout = timeout;
                    var withCredentials = (element.propSetMap.restOptions && element.propSetMap.restOptions.withCredentials !== undefined &&
                                           element.propSetMap.restOptions.withCredentials !== null)?(element.propSetMap.restOptions.withCredentials):false;
                    eleCopy.propSetMap.restOptions.withCredentials = withCredentials;
                    //var responseType = (element.propSetMap.restOptions && element.propSetMap.restOptions.responseType)?(element.propSetMap.restOptions.responseType):'json';
                    responseType = 'json';
                    if(element.propSetMap.restOptions && element.propSetMap.restOptions.headers) {
                        var headerString = angular.toJson(element.propSetMap.restOptions.headers);
                        if(scp && scp.control && scp.control.blockIndex !== undefined && scp.control.blockIndex !== null)
                            headerString = $scope.handleMergeField(headerString, false, null, (bBtn)?element:null, null, scp.control.blockIndex, true);
                        else
                            headerString = $scope.handleMergeField(headerString, false, null, (bBtn)?element:null, null, scp?scp.editBlockIndex:null, true);
                        headerObj = angular.fromJson(headerString);
                        eleCopy.propSetMap.restOptions.headers = headerObj;
                    }

                    if(element.propSetMap.restOptions && element.propSetMap.restOptions.params) {
                        var paramString = angular.toJson(element.propSetMap.restOptions.params);
                        if(scp && scp.control && scp.control.blockIndex !== undefined && scp.control.blockIndex !== null)
                            paramString = $scope.handleMergeField(paramString, false, null, (bBtn)?element:null, null, scp.control.blockIndex, true);
                        else
                            paramString = $scope.handleMergeField(paramString, false, null, (bBtn)?element:null, null, scp?scp.editBlockIndex:null, true);
                        paramObj = angular.fromJson(paramString);
                        if(URIEncode) {
                            for (var key in paramObj) {
                                if(paramObj.hasOwnProperty(key))
                                    paramObj[key] = encodeURI(paramObj[key]);
                            }
                        }
                        eleCopy.propSetMap.restOptions.params = paramObj;
                    }

                    if(URIEncode)
                        path = encodeURI(path);
                    eleCopy.propSetMap.restPath = path;

                    input = (element.propSetMap.restOptions.sendBody)?input:null;
                    if(restType === 'Web')
                    {
                        var req = {
                            method: method,
                            url: path,
                            headers: headerObj,
                            data: input,
                            params: paramObj,
                            cache: cache,
                            timeout: timeout,
                            withCredentials: withCredentials,
                            responseType: responseType,
                            label: (element && element.name) || 'WebElement' //added for the debug calls
                        };

                        $http(req).then(
                            function(data) {
                                if(!element.propSetMap.postTransformBundle)
                                    data = $scope.getSendResponseJSON(data, element.propSetMap.responseJSONPath, element.propSetMap.responseJSONNode);
                                if(data && !element.propSetMap.postTransformBundle)
                                {
                                    if(angular.equals(operation,'typeAheadSearch') && angular.isFunction(callback)){
                                        $rootScope.loading = false;
                                        callback(data);
                                        return;
                                    }

                                    var bContinue = $scope.applyCallRespMain(angular.copy(data), element, null, scp);
                                    if(data.vlcValidationErrors && !bContinue)
                                        return;
                                }

                                $scope.handleRemoteCallSuccess(element, data, bBtn, true, fromIndex, lastIndex, scp, null, operation, null, null, callback);
                            },
                            function(error) {
                                var errMsg = customLabels.OmniScriptWebCalloutFailed + '\nStatus Code - ' + error.status + '\nStatus -' + error.statusText + '\n';
                                errMsg += 'Response - ' + angular.toJson(error.data) + '.';

                                $scope.handleRemoteCallError(element, errMsg, bBtn, false, operation, callback);
                            });
                    }
                    else
                    {
                        var ele = angular.copy(eleCopy);
                        ele.type = 'Remote Action';
                        delete ele.propSetMap.extraPayload;

                        ele.propSetMap.remoteClass = bpService.sNSC+'DefaultOmniScriptNamedCredentialCallout';
                        ele.propSetMap.remoteOptions = {};
                        ele.propSetMap.remoteOptions.restOptions = eleCopy.propSetMap.restOptions;
                        ele.propSetMap.remoteOptions.restOptions.restPath = eleCopy.propSetMap.restPath;
                        ele.propSetMap.remoteOptions.restOptions.namedCredential = eleCopy.propSetMap.namedCredential;
                        ele.propSetMap.remoteOptions.restOptions.restMethod = eleCopy.propSetMap.restMethod;
                        ele.propSetMap.remoteOptions.restOptions.xmlPreTransformBundle = eleCopy.propSetMap.xmlPreTransformBundle;
                        ele.propSetMap.remoteOptions.restOptions.xmlPostTransformBundle = eleCopy.propSetMap.xmlPostTransformBundle;
                        ele.propSetMap.remoteMethod = 'NCCallout';

                        if(restType !== 'SOAP/XML')
                        {
                            delete ele.propSetMap.preTransformBundle;
                        }

                        $scope.remoteCallInvoke(input, ele, bBtn, fromIndex, scp, null, operation, null, lastIndex, 'Middle', null, callback);
                    }

                    break;
            }
        };

        // function to handle Post to Object Action
        // call VF Remote or ApexRest
        // @param
        // payload - JSON input
        // element - Action Element or persistent component (element = null)
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        // lastIndex - last index
        $scope.objectPostInvoke = function(payload, element, bBtn, fromIndex, scp, lastIndex)
        {
            if(!payload)
                return;

            var path = element.propSetMap.restPath;
            var restMethod = element.propSetMap.restMethod;
            var remoteClass = element.propSetMap.remoteClass=="DefaultOmniScriptApplicationService"?bpService.sNSC+element.propSetMap.remoteClass:element.propSetMap.remoteClass;
            var useRest = element.propSetMap.useRest;
            var remoteMethod = element.propSetMap.remoteMethod;
            var configObj = {};
            // v102 Multi-lang, only in save for later, or post to Application case, we want to clear the labelKeyMap
            var bClearLabelKeyMap = false;
            if( (useRest && path && path.indexOf('/v1/application/')>=0)
                || (!useRest && remoteClass && remoteClass.indexOf('DefaultOmniScriptApplicationService')>=0) ) {
                bClearLabelKeyMap = true;
            }

            var input = angular.copy(payload);
            if(element.propSetMap.postNameTemplate && !input.bpApplicationName)
            {
                input.bpApplicationName = $scope.handleMergeField(element.propSetMap.postNameTemplate, false, null, (bBtn)?element:null);
            }

            if(!input.response)
                input.response = {};

            var sendPayload = {};
            sendPayload.filesMap = angular.toJson(VOUINS.getFilesMap(input.filesMap, $rootScope.isSforce, $rootScope.sforce));

            //delete input.filesMap;
            var tempPayload = angular.copy(input);
            $scope.prepBeforeSubmit(tempPayload, true, bClearLabelKeyMap);

            sendPayload.fullJSON = angular.toJson(tempPayload);

            var iTimeout = element.propSetMap.remoteTimeout||30000;

            $rootScope.loading = true;
            $rootScope.loadingMessage = '';

            if(!bBtn)
            {
                element.ui.show = true;
                element.ui.error = false;
                element.ui.errorMessage = '';
            }
            if(element)
                $rootScope.loadingMessage = element.propSetMap.label;

            var option = {};
            option.useQueueableApexRemoting = (element.propSetMap.useQueueableApexRemoting === true);

            if(useRest!==false){
                configObj = {path: path, input: sendPayload, method: restMethod, label: {label: (element && element.name) || false}};
                bpService.OmniRestInvoke(configObj).then(invokeResolve, invokeReject);
            }else{
                configObj = {sClassName: remoteClass, sMethodName: remoteMethod, input: angular.toJson(sendPayload),
                                 options: angular.toJson(option), iTimeout: iTimeout, label: {label: element && element.name}};
                bpService.OmniRemoteInvoke(configObj).then(
                    function(result){
                        var remoteResp = angular.fromJson(result)
                        if(remoteResp && remoteResp.error === 'OK' && remoteResp['PTsOBJresp'])
                            invokeResolve(angular.fromJson(remoteResp['PTsOBJresp']));
                        else
                            invokeReject({responseText: remoteResp.error});
                    },
                    function(error){
                        $scope.handleRemoteCallError(element, error, bBtn, false);
                    }
                );
            }


            function invokeResolve (data){
                 // if there is no post transform bundle defined, then this action is done, apply the Resp
                 if(!element.propSetMap.postTransformBundle)
                     data = $scope.getSendResponseJSON(data, element.propSetMap.responseJSONPath, element.propSetMap.responseJSONNode);
                 if(data && element && !element.propSetMap.postTransformBundle)
                 {
                     var bContinue = $scope.applyCallRespMain(angular.copy(data), element);
                     if(data.vlcValidationErrors && !bContinue)
                         return;
                 }
                 delete element.propSetMap.retrialNum;
                 $scope.handleRemoteCallSuccess(element, data, bBtn, true, fromIndex, lastIndex, scp);
            }

            function invokeReject (jqXHR) {
                if(element.propSetMap.retrial && element.propSetMap.retrial.constructor === Number && element.propSetMap.retrial > 0) {
                    if(!element.propSetMap.retrialNum)
                        element.propSetMap.retrialNum = 0;
                    element.propSetMap.retrialNum ++;
                    if(element.propSetMap.retrialNum <= element.propSetMap.retrial) {
                        if(!bBtn)
                            $scope.nextRepeater(fromIndex, lastIndex, payload);
                        else
                            $scope.remoteCallRepeater(element, scp, payload);
                    }
                    else {
                        delete element.propSetMap.retrialNum;
                        $scope.handleRemoteCallError(element, jqXHR.responseText, bBtn, true);
                    }
                }
                else
                    $scope.handleRemoteCallError(element, jqXHR.responseText, bBtn, true);
            }

        };

        /* OMNI-2072
        $scope.openArticleInConsole = function(article)
        {
            var url = $scope.instanceHost + '/articles/' + article.aType + '/' + article.urlName;
            if(bpService.isInConsole)
            {
                sforce.console.getEnclosingPrimaryTabId(function (result)
                {
                    var tabId = result.id;
                    sforce.console.openSubtab(tabId , url, true,
                                              article.title, null, null, 'articleSubTab');
                });
            }
            else if((typeof sforce !== 'undefined') && (sforce !== null && sforce.one !== undefined && sforce.one !== null))
                sforce.one.navigateToURL(url, false);
            else
                window.open(url, '_blank');
        };
        */

        // function to get the Knowledge Article body
        $scope.getArticleBody = function(element, article, openInModal)
        {
            if($scope.bpTree.propSetMap.enableKnowledge !== true /*|| bpService.resumeMode === true*/)
                return true;

            if(element && element.type === 'Step')
            {
                var sClassName = bpService.sNSC + 'DefaultKnowledgeOmniScriptIntegration';
                var sMethodName = 'getArticleBody';
                var iTimeout;
                var stepOption = angular.copy(element.propSetMap.knowledgeOptions);

                if(stepOption === undefined || stepOption === null)
                    stepOption = {};
                iTimeout = stepOption.remoteTimeout;

                var option = {};
                option.aType = article.articleType;
                option.articleId = article.articleId;
                option.useQueueableApexRemoting = (element.propSetMap.useQueueableApexRemoting === true);

                var searchFlds = $scope.bpTree.propSetMap.knowledgeArticleTypeQueryFieldsMap;
                if(searchFlds) {
                    option.bodyFields = searchFlds[option.aType];
                }

                //updating aType to use the lightning knowledge object
                if($scope.bpTree.propSetMap.bLK === true) {
                    option.aType = $scope.bpTree.propSetMap.lkObjName;
                }

                var input = {};

                var configObj = {sClassName:sClassName,sMethodName:sMethodName,input:angular.toJson(input),
                                 options:angular.toJson(option),iTimeout:iTimeout,label:{label:element && element.name}};
                bpService.OmniRemoteInvoke(configObj).then(
                    function(result)
                    {
                        var remoteResp = angular.fromJson(result);

                        if(remoteResp && remoteResp.error !== 'OK')
                        {
                            //$scope.handleRemoteCallError(element, remoteResp.error, bBtn, false);
                        }
                        else
                        {
                            // if there is no post transform bundle defined, then this action is done, apply the Resp
                            if(remoteResp && remoteResp.vlcArticleBody)
                            {
                                // var bContinue = $scope.applyCallRespMain(angular.copy(remoteResp), element);
                                var Body = '';
                                for(var i=0; i<remoteResp.vlcArticleBody.length; i++)
                                {
                                    for (var key in remoteResp.vlcArticleBody[i])
                                    {
                                        if(remoteResp.vlcArticleBody[i].hasOwnProperty(key))
                                        {
                                            if(i !== 0)
                                                Body += (bpService.layout === 'lightning')? '<br/><hr/>': '<br/>';
                                            Body += remoteResp.vlcArticleBody[i][key];
                                        }
                                    }
                                }
                                if(!openInModal)
                                {
                                    element.articleBody = $sce.trustAsHtml(Body);
                                    element.articleTitle = article.title;
                                    element.articleLink = '/articles/' + article.aType + '/' + article.urlName;
                                }
                                else
                                {
                                    var modalContent = {};
                                    modalContent.articleBody = $sce.trustAsHtml(Body);
                                    modalContent.articleTitle = article.title;
                                    modalContent.articleLink = '/articles/' + article.aType + '/' + article.urlName;
                                    $scope.openKnowledgeModal(modalContent);
                                }
                                //$scope.handleRemoteCallSuccess(element, remoteResp, bBtn, true, fromIndex, lastIndex, scp, selectedItem, operation, customizer, pcIndex);
                            }
                        }
                    },
                    function(error)
                    {
                        //$scope.handleRemoteCallError(element, error.message, bBtn, false);
                    }
                );
            }
            return true;
        };

        $scope.closeArticle = function(step)
        {
            step.articleBody = '';
            step.articleTitle = '';
            step.articleLink = '';
        };

        // function to handle knowledge article search
        $scope.searchKnowledgeArticle = function(element, bUserInput, bRefresh)
        {
            if($scope.bpTree.propSetMap.enableKnowledge !== true /*|| bpService.resumeMode === true*/)
                return;
            if(element && element.type === 'Step')
            {
                var option = angular.copy(element.propSetMap.knowledgeOptions);

                if(option === undefined || option === null)
                    option = {};
                var iTimeout = option.remoteTimeout;

                var elementKeyword = element.knowledgeKeyword;
                var optionKeyword = option.keyword;
                if(optionKeyword)
                    optionKeyword = $scope.handleMergeField(optionKeyword);
                var keyword = '';

                if(bUserInput)
                {
                    element.userKWKeyword = elementKeyword;
                    keyword = elementKeyword;
                }
                else
                {
                    if(element.userKWKeyword)
                        keyword += element.userKWKeyword + ' ';

                    keyword += optionKeyword;
                    //element.userKWKeyword = '';
                }
                //var keyword = (bUserInput)?(elementKeyword):(optionKeyword);

                if(bpService.stepKnowledgeKWMap[element.name] === keyword && bRefresh !== true)
                    return;

                element.knowledgeKeyword = keyword;
                var sClassName = bpService.sNSC + 'DefaultKnowledgeOmniScriptIntegration';
                var sMethodName = 'searchArticle';
                var iTimeout;
                option.keyword = keyword;
                //option.dataCategoryCriteria = $scope.handleMergeField(option.dataCategoryCriteria);

                if($scope.bpTree.propSetMap.bLK === true){
                    option.lkObj = $scope.bpTree.propSetMap.lkObjName;
                }

                var input = {};

                bpService.stepKnowledgeKWMap[element.name] = keyword;

                var configObj = {sClassName:sClassName,sMethodName:sMethodName,input:angular.toJson(input),
                                 options:angular.toJson(option),iTimeout:iTimeout,label:{label:element && element.name}};
                bpService.OmniRemoteInvoke(configObj).then(
                    function(result)
                    {
                        var remoteResp = angular.fromJson(result);

                        if(remoteResp && remoteResp.error !== 'OK')
                        {
                            //$scope.handleRemoteCallError(element, remoteResp.error, bBtn, false);
                        }
                        else
                        {
                            // if there is no post transform bundle defined, then this action is done, apply the Resp
                            if(remoteResp)
                            {
                                var bContinue = $scope.applyCallRespMain(angular.copy(remoteResp), null, true);
                                if(bpService.layout === 'newport' && remoteResp && remoteResp.vlcKnowledge &&remoteResp.vlcKnowledge.knowledgeItems&& angular.isArray(remoteResp.vlcKnowledge.knowledgeItems) && remoteResp.vlcKnowledge.knowledgeItems.length > 0) {
                                    $scope.knowledge.isToggled = true;
                                }
                                //$scope.handleRemoteCallSuccess(element, remoteResp, bBtn, true, fromIndex, lastIndex, scp, selectedItem, operation, customizer, pcIndex);
                            }
                        }
                    },
                    function(error)
                    {
                        //$scope.handleRemoteCallError(element, error.message, bBtn, false);
                    }
                );
            }
        };

        // function to handle Remote Call Action
        // @param
        // payload - JSON input
        // element - Action Element or persistent component (element = null)
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        // selectedItem - in Selectable Items Element case, the item selected by the user where they trigger the remote call
        // operation - the operation of the remote call ('Delete', 'Add', etc.)
        // customizer - the customized function to be called once the remote call promise comes back
        // lastIndex - last index
        // stage - 'Pretransform', 'PostTransform', 'Middle', undefined/null
        $scope.remoteCallInvoke = function(payload, element, bBtn, fromIndex, scp, selectedItem, operation, customizer, lastIndex, stage, pcIndex, callback)
        {
            var input = payload;
            var sClassName;
            var sMethodName;
            var iTimeout;
            var option;

            if (element && !["Remote Action", "Integration Procedure Action"].includes(element.type)){
                $rootScope.loading = true;
            }

            if(!stage && bBtn)
            {
                $scope.remoteCallRepeater(element, scp, input, stage, selectedItem, operation, customizer, pcIndex, callback);
                return;
            }

            if(element)
            {
                sClassName = element.propSetMap.remoteClass;
                sMethodName = element.propSetMap.remoteMethod;
                iTimeout = element.propSetMap.remoteTimeout;
                option = element.propSetMap.remoteOptions;

                if(!bBtn && element.type !== 'Step')
                    element.ui.preTransform = false;

                if(!(element.propSetMap.preTransformBundle || element.propSetMap.transformBundle) )
                    input = $scope.getSendResponseJSON(input, element.propSetMap.sendJSONPath, element.propSetMap.sendJSONNode);

                if (element.type === 'Integration Procedure Action') {
                    sClassName = bpService.sNSC + 'IntegrationProcedureService';
                    sMethodName = element.propSetMap.integrationProcedureKey;

                    if (option == null) {
                        option = {};
                    }

                    option.useContinuation = element.propSetMap.useContinuation;
                }
            }
            // global persistent component (cart)
            else if($scope.bpTree.propSetMap.persistentComponent && pcIndex !== undefined && pcIndex !== null)
            {
                sClassName = $scope.bpTree.propSetMap.persistentComponent[pcIndex].remoteClass;
                sMethodName = $scope.bpTree.propSetMap.persistentComponent[pcIndex].remoteMethod;
                iTimeout = $scope.bpTree.propSetMap.persistentComponent[pcIndex].remoteTimeout;
                //input = payload.response;
                option = $scope.bpTree.propSetMap.persistentComponent[pcIndex].remoteOptions;
                if(!$scope.bpTree.propSetMap.persistentComponent[pcIndex].preTransformBundle)
                    input = $scope.getSendResponseJSON(input, $scope.bpTree.propSetMap.persistentComponent[pcIndex].sendJSONPath, $scope.bpTree.propSetMap.persistentComponent[pcIndex].sendJSONNode);
            }

            if(option === undefined || option === null)
                option = {};

            if(element)
            {
                if(bpService.placeholderEleTypeList.indexOf(element.type) >= 0)
                {
                    option.vlcJSONNode = element.name;
                    if(element.JSONPath)
                        option.jsonPath = element.JSONPath;
                }
                if(element.type === 'Filter Block')
                    option.vlcFilters = element.vlcJSONPath;
            }

            if(selectedItem && element){
                if(element.type === 'Selectable Items')
                    option.vlcSelectedItem = selectedItem;
                if(element.type === 'Input Block')
                    option.vlcInputBlock = selectedItem;
             } else if(selectedItem)
                option.vlcSelectedItem = selectedItem;

            if(operation)
                option.vlcOperation = operation;

            if(!bBtn && element && element.type !== 'Step')
            {
                element.ui.show = true;
                element.ui.error = false;
                element.ui.errorMessage = '';
            }

            // to support Continuation
            option.vlcClass = sClassName;

            var restOptions;
            if(element && (element.propSetMap.type === 'Named Credential' || element.propSetMap.type === 'SOAP/XML')) {
                restOptions = (option.restOptions === undefined)?null:(angular.copy(option.restOptions));

                delete option.restOptions;
            }
            var optionString = angular.toJson(option);
            if(scp && scp.control && scp.control.blockIndex !== undefined && scp.control.blockIndex !== null)
                optionString = $scope.handleMergeField(optionString, false, null, (bBtn)?element:null, null, scp.control.blockIndex, true);
            else
                optionString = $scope.handleMergeField(optionString, false, null, (bBtn)?element:null, null, scp?scp.editBlockIndex:null, true);
            option = angular.fromJson(optionString);
            if(restOptions && element && (element.propSetMap.type === 'Named Credential' || element.propSetMap.type === 'SOAP/XML')) {
                option.restOptions = restOptions;
            }
            if($scope.bpTree.filesMap)
                option.vlcFilesMap = VOUINS.getFilesMap($scope.bpTree.filesMap, $rootScope.isSforce, $rootScope.sforce);

            // v16, additional payload
            if(element && element.propSetMap.extraPayload && Object.getOwnPropertyNames(element.propSetMap.extraPayload).length > 0) {
                input = $scope.handleExtraPayload(element.propSetMap.extraPayload, input, bBtn, element, scp);
            }

            //remote calls when made from persistent component
            var dLabel = (pcIndex !== null) && (pcIndex >= 0) && $scope.bpTree.propSetMap.persistentComponent && $scope.bpTree.propSetMap.persistentComponent[pcIndex].id;

            var configObj = {sClassName:sClassName,sMethodName:sMethodName,input:angular.toJson(input),
                             options:angular.toJson(option),iTimeout:iTimeout,label:{label:(element && element.name) || dLabel}};

            bpServiceFunction(configObj);

            function bpServiceFunction(configObj) {
                bpService.OmniRemoteInvoke(configObj, scp, element, $scope).then(function(result) {
                    var remoteResp = angular.fromJson(result);

                    if(checkRemoteCallError(remoteResp))
                    {
                        if(customizer && customizer.constructor === Function)
                        {
                            customizer(operation, selectedItem, false, element, pcIndex, scp);
                        }

                        $scope.handleRemoteCallError(element, remoteResp.error, bBtn, false, operation, callback);
                    }
                    else
                    {
                        if(element && (element.propSetMap.type === 'Named Credential' || element.propSetMap.type === 'SOAP/XML')) {
                            remoteResp = remoteResp.NCCallresp;

                            try {
                                if(remoteResp)
                                    remoteResp = angular.fromJson(remoteResp);
                            } catch (e) {
                                $scope.handleRemoteCallError(element, customLabels.OmniDesInvalidJson, bBtn, false);
                                return;
                            }

                            if(element.propSetMap.type === 'SOAP/XML')
                                delete element.propSetMap.postTransformBundle;
                        }

                        if (element && element.type === 'Integration Procedure Action' && remoteResp.IPResult) {
                            remoteResp = remoteResp.IPResult;

                            if (remoteResp.hasOwnProperty('vlcIPData')
                                && remoteResp.hasOwnProperty('vlcStatus')
                                && remoteResp.vlcStatus === 'InProgress') {

                                $rootScope.loading = true;
                                // overwriting as object in order to use same prop, but also have different display conditions
                                $rootScope.loadingMessage = {actionMessage: remoteResp.vlcMessage};

                                configObj.options = angular.toJson(remoteResp);
                                configObj.input = '{}';

                                if (remoteResp.hasOwnProperty('vlcAsync'))
                                {
                                    setTimeout(function()
                                    {
                                        return bpServiceFunction(configObj);
                                    }, 5000);
                                }
                                else
                                {
                                    return bpServiceFunction(configObj);
                                }
                            }
                        }

                        // if there is no post transform bundle defined, then this action is done, apply the Resp
                        if(element && !element.propSetMap.postTransformBundle){
                            remoteResp = $scope.getSendResponseJSON(remoteResp, element.propSetMap.responseJSONPath, element.propSetMap.responseJSONNode);
                        }
                        if(!element && $scope.bpTree.propSetMap.persistentComponent && pcIndex !== undefined && pcIndex !== null && !$scope.bpTree.propSetMap.persistentComponent[pcIndex].postTransformBundle){
                            remoteResp = $scope.getSendResponseJSON(remoteResp, $scope.bpTree.propSetMap.persistentComponent[pcIndex].responseJSONPath, $scope.bpTree.propSetMap.persistentComponent[pcIndex].responseJSONNode);
                        }
                        if(remoteResp && ((element && !element.propSetMap.postTransformBundle) || (!element && $scope.bpTree.propSetMap.persistentComponent && pcIndex !== undefined && pcIndex !== null && !$scope.bpTree.propSetMap.persistentComponent[pcIndex].postTransformBundle)))
                        {
                            if(angular.equals(operation,'typeAheadSearch') && angular.isFunction(callback)){
                                $rootScope.loading = false;
                                callback(remoteResp);
                                return;
                            }

                            if(angular.equals(operation,'emailAction') && angular.isFunction(callback)){
                                callback(remoteResp);
                            }

                            var validationResp = remoteResp.vlcValidationErrors;
                            var bValidationError = (validationResp && validationResp.constructor === Object && Object.getOwnPropertyNames(validationResp).length > 0)?(true):(false);

                            if(customizer && customizer.constructor === Function)
                            {
                                if(bValidationError)
                                    customizer(operation, selectedItem, false, element, pcIndex, scp);
                                else
                                    customizer(operation, selectedItem, true, element, pcIndex, scp);
                            }
                            var bContinue = $scope.applyCallRespMain(angular.copy(remoteResp), element, null, scp);
                            if(bValidationError && !bContinue)
                                return;
                        }

                        $scope.handleRemoteCallSuccess(element, remoteResp, bBtn, true, fromIndex, lastIndex, scp, selectedItem, operation, customizer, pcIndex, callback);
                    }
                },
                function(error)
                {
                    if(customizer && customizer.constructor === Function)
                    {
                        customizer(operation, selectedItem, false, element, pcIndex, scp);
                    }

                    $scope.handleRemoteCallError(element, error, bBtn, false, operation, callback);
                }
                );
            }
        };

        function checkRemoteCallError(remoteResp) {
            if(remoteResp && remoteResp.error !== undefined && remoteResp.error !== 'OK')
                return true;
            else if(remoteResp && remoteResp.error === undefined && !remoteResp.records && angular.isArray(remoteResp.messages) && remoteResp.messages.length > 0) {
                remoteResp.error = [];
                for(var i=0; i<remoteResp.messages.length; i++){
                    if(angular.equals(remoteResp.messages[i].severity,'ERROR'))
                        remoteResp.error.push(remoteResp.messages[i]);
                }
                if(remoteResp.error.length > 0)
                    return true;
            }
            return false;
        }

        $scope.applyCallRespMain = function(respToApply, element, bKnowledgePC, scp)
        {
        	// v16
        	var editBlockElementIndex = (scp)?(scp.editBlockIndex):(null);
        	var remoteResp = null;
        	if(editBlockElementIndex !== undefined && editBlockElementIndex !== null) {
        	    var ebName = (scp.control)?(scp.control.name):(scp.editBlockName);
        		remoteResp = {};
        		remoteResp[ebName] = respToApply;
        	}
        	if(remoteResp === null) {
            	remoteResp = respToApply;
        	}

            var bContinue = true;
            $scope.invalidStepIndex = null;
            var validationResp = remoteResp.vlcValidationErrors;
            if((!validationResp || (validationResp.constructor === Object && Object.getOwnPropertyNames(validationResp).length <= 0))
                && (!element || element.type !== 'DataRaptor Post Action'))
            {
                if(element && element.type === 'Step' && bpService.resumeMode)
                    ;  // in review mode, we still execute the remote action tied to the Step to run validation, but we should not apply the normal response just to be consistent
                else
                    $scope.applyCallResp(remoteResp, false, bKnowledgePC, element, editBlockElementIndex);
            }
            else
            {
                $scope.applyCallResp(remoteResp.vlcValidationErrors, true, element, editBlockElementIndex);
                $rootScope.loading = false;
                if($scope.invalidStepIndex !== undefined && $scope.invalidStepIndex !== null)
                {
                    var ind = $scope.invalidStepIndex;
                    var currentIndex;
                    var activeStepIndex;

                    // $scope.bpTree.asIndex = undefined if it's an action
                    if($scope.bpTree.asIndex !== undefined && $scope.bpTree.asIndex !== null)
                    {
                        currentIndex = $scope.bpTree.asIndex;
                        activeStepIndex = $scope.bpTree.asIndex;
                    }
                    else if(element && element.level === 0 && element.type !== 'Step')
                        currentIndex = element.indexInParent;

                    if(currentIndex !== undefined && currentIndex !== null)
                    {
                        if($scope.bpTree.propSetMap.timeTracking)
                            $scope.calcStepActionTiming($scope.bpTree.children[currentIndex], false);

                        // since we are able to apply the validation error
                        // step ind must be a show step
                        if(ind <= currentIndex)
                        {
                            if(activeStepIndex !== undefined && activeStepIndex !== null)
                                $scope.setStepStatus($scope.bpTree.children[activeStepIndex], false, true, true, null, null);

                            $scope.activateStep($scope.bpTree.children[ind], true, null);
                            //$scope.bpTree.children[ind].bAccordionOpen = true;
                            //$scope.bpTree.children[ind].bAccordionActive = true;
                            $scope.bpTree.asIndex = ind;

                            $window.alert(new Error(customLabels.OmniStepValidationError));
                            bContinue = false;
                        }
                        else
                            $window.alert(new Error(customLabels.OmniStepValidationError));
                    }
                }
            }
            return bContinue;
        };


        // function to handle applying remote call response to the script
        // algorithm: traverse through the JSON response, if matching input element (Element Name and JSON node)
        // apply it, the remaining JSON gets merged into the Data JSON of the OmniScript
        // @param
        // remote call response
        $scope.applyCallResp = function(resp, bValidation, bKnowledge, element, editBlockElementIndex)
        {
            base_applyCallResp(resp, bValidation, bKnowledge, element, editBlockElementIndex);

            // refresh knowledge widget
            if(!bKnowledge && $scope.bpTree.propSetMap.enableKnowledge === true && $scope.bpTree.asIndex !== undefined && $scope.bpTree.asIndex !== null)
                $scope.searchKnowledgeArticle($scope.bpTree.children[$scope.bpTree.asIndex], false, true);
        };

        // helper function to handle the case
        // apply remote call response to the script, invalid data leading to validation errors
        // @param
        // error - validation error
        $scope.checkFldError = function(error)
        {
            var trueKeyArray = [];

            for (var key in error)
            {
                if(error.hasOwnProperty(key))
                {
                    if(error[key] === true)
                    {
                        trueKeyArray.push(key);
                    }
                }
            }
            if(trueKeyArray.length === 1 && (trueKeyArray[0] === 'required' || trueKeyArray[0] === 'vlcsrverror'))
                return true;

            return false;
        };

        // helper function to handle the case
        // apply remote call response to the script, invalid data leading to validation errors
        // @param
        // scp - Element scope
        // control - Element
        $scope.ngInitValidation = function(scp, control)
        {
            try
            {
                var bCalledAggregate = false;

                // ng-init change
                if(bpService.pfJSONFill && Object.getOwnPropertyNames(bpService.pfJSONFill).length > 0
                   && bpService.pfJSONFill.hasOwnProperty(control.name) && scp.loopform
                   && scp.loopform.$pristine && scp.loopform.$invalid)
                {
                    control.response = null;
                    if(control.type === 'Checkbox' || control.type === 'Disclosure')
                        control.response = false;
                    scp.aggregate(scp, control.index, control.indexInParent, true, -1);
                    bCalledAggregate = true;
                    delete bpService.pfJSONFill[control.name];
                }

                // comment it out until I fix the required field issue
                // Call resp
                var key = control.name+control.$$hashKey;
                if(ouiBaseService.invokeResp && Object.getOwnPropertyNames(ouiBaseService.invokeResp).length > 0
                   && ouiBaseService.invokeResp.hasOwnProperty(key) && scp.loopform && scp.loopform.$invalid)
                {
                    if(angular.equals(ouiBaseService.invokeResp[key], control.response) && scp.loopform.loopname &&
                       !$scope.checkFldError(scp.loopform.loopname.$error) && !bCalledAggregate)
                    {
                        control.response = null;
                        scp.aggregate(scp, control.index, control.indexInParent, true, -1);
                        delete ouiBaseService.invokeResp[key];
                    }
                }

                if(control.type === 'Multi-select' && control.req)
                    scp.$parent.loopform.$setValidity("required", $scope.MultiSelectFilled(control));
                if(control.type === 'Radio Group' && control.req)
                    scp.$parent.loopform.$setValidity("required", $scope.radioGroupFilled(control));
            }
            catch(err)
            {
                console.log(err);
            }

            return true;
        };

        ////// handle show/hide expression builder
        // helper function
        $scope.htmlEntities = function(str) {
            return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        };

        $scope.handleConditionData = function(data, mfMap)
        {
            if(data !== null && data != undefined && data.constructor === String)
            {
                var fields;
                if(data.indexOf('%')>=0)
                    fields = data.match(/%([^[%]+)%/g);

                if(fields) {
                    mfMap[data] = null;
                    data = "mergeField['" + data + "']";
                }
                else {
                   if(data === 'true')
                       data = true;
                    else if(data === 'false')
                       data = false;

                    if(data !== null && data !== undefined && data.constructor === String && data !== '')
                        data = "'" + data + "'";
                    if(data === '')
                        data = null;
                }
            }

            return data;
        };

        $scope.operatorMap = {"AND" : "&&", "OR" : "||"};
        $scope.conditionMap = {"=": "==", "<>": "!=", "<": "<", "<=": "<=", ">": ">", ">=": ">="};

        $scope.computed = function(group) {
            var result = {expression : "", data : {}, mergeField : {}};
            if (!group) return result;
            var dataMap = {};
            var mfMap = {};
            for (var str = "(", i = 0; i < group.rules.length; i++) {
                i > 0 && (str += " " + $scope.operatorMap[group.operator] + " ");

                if(group.rules[i].group)
                {
                    var s = $scope.computed(group.rules[i].group);
                    str += s.expression;
                    for (var key in s.data) {
                        if (s.data.hasOwnProperty(key)) {
                            dataMap[key] = s.data[key];
                        }
                    }
                    for (var key in s.mergeField) {
                        if (s.mergeField.hasOwnProperty(key)) {
                            mfMap[key] = s.mergeField[key];
                        }
                    }
                    if(s.repeat && !result.repeat)
                        result.repeat = true;
                }
                else
                {
                    var val = $scope.handleConditionData(group.rules[i].data, mfMap);
                    dataMap[group.rules[i].field] = null;
                    str += "data['" + group.rules[i].field + "'] " + $scope.conditionMap[group.rules[i].condition] + " " + val;

                    if(VOUINS.isRepeatNotation(group.rules[i].field))
                        result.repeat = true;

                    if(!result.repeat && VOUINS.isRepeatNotation(group.rules[i].data))
                        result.repeat = true;
                }
            }

            result.expression = str + ")";
            result.data = dataMap;
            result.mergeField = mfMap;

            return result;
        };

        // to refresh Text Block or Headline (HTML rich), support merge fields
        // @param
        // control - Element
        $scope.refresh = function(control, bReturnVal){
            var formula = null;
            // perf enhancment: the calc should only happen for the fields in the current step
            if(control.rootIndex !== undefined && control.rootIndex !== null &&
               control.rootIndex !== $scope.bpTree.asIndex)
            {
                if(control.propSetMap.value === undefined || control.propSetMap.value === null || (control.propSetMap.value.constructor === String))
                    control.propSetMap.value = bReturnVal?'':$sce.trustAsHtml('');
                if(bReturnVal) {
                    return control.propSetMap.value;
                }

                else {
                    return true;
                }
            }

            //console.log('refresh ' + control.name);

            if(control.propSetMap.text || control.propSetMap.label){
                formula = control.propSetMap.text? control.propSetMap.text : control.propSetMap.label;
                formula = $scope.handleMergeField(formula, false, null, control, true);
                if(formula !== null && formula.constructor !== String)
                    formula = '' + formula + '';
                control.propSetMap.value = bReturnVal?formula:$sce.trustAsHtml(formula);
            }

            if(control.type === 'Text Block' && control.propSetMap.dataJSON === true)
                $scope.bpTree.response[control.name] = formula;

            if(bReturnVal) {
                return formula;
            }
            else {
                return true;
            }
        };

        // to resize responsive tables
        // @param
        // control - Element
        $scope.compareWindowWidth = function(prop, returnVal, altVal) {
            if($window.innerWidth<prop){
                return returnVal;
            }
            else if (altVal !== undefined)
                return altVal;
            else
                return null;
        };

        // this is for OMNI-1090
        $scope.selectTimezoneOffset = function(timezone){
            switch (timezone){
                case 'User':
                    return -1*$scope.bpTree.userTimeZone;
                case 'Local':
                default:
                    return (new Date()).getTimezoneOffset();
            }
        }

        // to resize responsive tables
        // @param
        // control - Element
        $scope.digestOnResize = function() {
            $window.addEventListener("resize", function(){
                $scope.$digest();
            });
        };

        // helper function to handle dynamic picklist
        // @param
        // control - Element
        $scope.getOptions = function(control, scp) {
            var oldOptions = control.propSetMap.options;
            if(ouiBaseService.bPLSeeding && $rootScope.VlocPicklistSeeding) {
                var key = '';
                if(control.propSetMap.controllingField.type === 'SObject') {
                    key = control.propSetMap.optionSource.source+'/'+control.propSetMap.controllingField.source;
                }
                else if(control.propSetMap.controllingField.type === 'Custom') {
                    key = control.propSetMap.controllingField.element+'/'+control.propSetMap.controllingField.source;
                }
                else if(control.propSetMap.optionSource.type === 'SObject' || control.propSetMap.optionSource.type === 'Custom') {
                    key = control.propSetMap.optionSource.source;
                }

                if(control.type === 'Multi-select' && key && $rootScope.VlocPicklistSeeding[key] && $rootScope.VlocPicklistSeeding[control.name+':'+control.$$hashKey+':'+key] === undefined) {
                    $rootScope.VlocPicklistSeeding[control.name+':'+control.$$hashKey+':'+key] = angular.copy($rootScope.VlocPicklistSeeding[key]);
                }

                var plKey = (control.type === 'Multi-select')?(control.name+':'+control.$$hashKey+':'+key):(key);

                if(control.propSetMap.controllingField.type === 'SObject') {

                    control.propSetMap.dependency = $rootScope.VlocPicklistSeeding[plKey];
                }
                else if(control.propSetMap.controllingField.type === 'Custom') {
                    control.propSetMap.dependency = $rootScope.VlocPicklistSeeding[plKey];
                }
                else if(control.propSetMap.optionSource.type === 'SObject' || control.propSetMap.optionSource.type === 'Custom') {
                    VOUINS.resetOptions(control, $rootScope.VlocPicklistSeeding[plKey]);
                }
            }

            var newOptions = control.propSetMap.options;
            var options = [];

            if(!control.propSetMap.dependency){
                //return control.propSetMap.options;
            } else {
                var eleName = control.propSetMap.controllingField.element;
                if(VOUINS.isRepeatNotation(eleName)) {
                    var blkIndex = $scope.findParentBlockIndex(scp.$parent);
                    if(!angular.equals(blkIndex, NaN))
                        eleName = $scope.replaceNIndex(eleName, blkIndex+1);
                }
                var elemValue = $scope.getElementValue(eleName);
                options = control.propSetMap.dependency[elemValue] ? control.propSetMap.dependency[elemValue]: [];
                newOptions = control.propSetMap.options = options;
            }

            if(control.propSetMap.dependency || (ouiBaseService.bPLSeeding && $rootScope.VlocPicklistSeeding)) {
                if(!angular.equals(oldOptions, newOptions)) {
                    if(control.response !== null && control.response !== undefined) {
                        var checkResult = checkAgainstOptions(control.response, newOptions, control.type);
                        if(checkResult.valid) {
                            if(control.type === 'Select')
                                control.response = newOptions[checkResult.index];
                            else if(control.type === 'Radio')
                                control.response = newOptions[checkResult.index].name;
                            else if(control.type === 'Multi-select')
                                control.response = checkResult.resp;
                        }
                        else {
                            control.response = null;
                            for(var i=0; i<newOptions.length; i++)
                                delete newOptions[i].selected;
                        }
                        scp.aggregate(scp, control.index, control.indexInParent, true, -1);
                    }
                }
                else if(control.type === 'Multi-select')
                    checkAgainstOptions(control.response, newOptions, control.type);
            }

            return newOptions;
        };

        $scope.findParentBlockIndex = function(scp)
        {
            if(scp && scp.$parent && scp.$parent.control && (bpService.blockEleTypeList.indexOf(scp.$parent.control.type) >= 0))
            {
                return $scope.findRepeatIndex(scp.$parent.control);
            }
            return NaN;
        };

        $scope.findSibling = function(scp, control)
        {
            if(scp && scp.child && scp.child.eleArray)
                return scp.child.eleArray;
            else
                return null;
        };

        $scope.evalCondition = function(control, type, scp)
        {
            var storedExpr = (type === 'show')?(bpService.showExprData):(bpService.validateExprData);
            var ctrlShowCondition = (type === 'show')?(control.propSetMap.show):(control.propSetMap.validateExpression);
            if(ctrlShowCondition === null)
                return true;

            var index = NaN;
            var result = false;
            var ctrlShowExprData = {};

            if(storedExpr.hasOwnProperty(control.name))
                ctrlShowExprData = storedExpr[control.name];
            else
            {
                ctrlShowExprData = $scope.computed(ctrlShowCondition.group);
                if( (type === 'show' && ((control.level === 0 && control.bInit === true) || control.level !== 0 ))
                    || type !== 'show')
                    storedExpr[control.name] = ctrlShowExprData;
            }

            var ctrlShowExpression = ctrlShowExprData.expression;
            if(ctrlShowExprData.repeat) {
                if(type !== 'show')
                    index = $scope.findRepeatIndex(control);
                else
                    index = $scope.findParentBlockIndex(scp);
            }

            var data = angular.copy(ctrlShowExprData.data);
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var eleName = key;
                    // support |n syntax
                    if(!angular.equals(index, NaN) && VOUINS.isRepeatNotation(key))
                        eleName = $scope.replaceNIndex(key, index+1);
                    data[key] = $scope.getElementValue(eleName);
                    // OMNI-5159 (safest fix, special processing of ContextId)
                    if (key === 'ContextId' && data[key] === '') {
                        data[key] = null;
                    }
                }
            }

            // merge field
            var mergeField = angular.copy(ctrlShowExprData.mergeField);
            for (var key in mergeField) {
                if (mergeField.hasOwnProperty(key)) {
                    mergeField[key] = $scope.handleMergeField(key, false, index, null);
                    if(mergeField[key] === '')
                        mergeField[key] = null;
                }
            }

            if(ctrlShowExpression !== '()' && ctrlShowExpression != '')
                result = eval(ctrlShowExpression);

            return result;
        };



        $scope.cascadeReadonly = function(control, result)
        {
            var cType = control.type;
            control.ro = !result;
            if(control.type === 'Filter')
                cType += ' ' + control.propSetMap.type;
            switch(cType)
            {
                case 'Checkbox':
                case 'Currency':
                case 'Date':
                case 'Date/Time (Local)':
                case 'Disclosure':
                case 'Email':
                case 'Lookup':
                case 'Multi-select':
                case 'Number':
                case 'Password':
                case 'Radio':
                case 'Radio Group':
                case 'Range':
                case 'Select':
                case 'Signature':
                case 'Telephone':
                case 'Text':
                case 'Text Area':
                case 'Time':
                case 'URL':
                case 'Type Ahead':
                    if(result === false)
                        control.ro = true;
                    else
                        control.ro = control.propSetMap.readOnly;
                    break;
                case 'Step':
                case 'Block':
                case 'Type Ahead Block':
                case 'Edit Block':
                    if(cType === 'Edit Block' && control.childrenC) {
                        for(var i=0; i<control.childrenC.length; i++) {
                            for(var j=0; j<control.childrenC[i].eleArray.length; j++) {
                                $scope.cascadeReadonly(control.childrenC[i].eleArray[j], result);
                            }
                        }
                    }
                    for(var i=0; i<control.children.length; i++)
                    {
                        for(var j=0; j<control.children[i].eleArray.length; j++)
                        {
                            $scope.cascadeReadonly(control.children[i].eleArray[j], result);
                        }
                    }
                    break;
                default:
                    ; // do nothing
            }
        };

        $scope.cascadeRequired = function(control, result)
        {
            var cType = control.type;
            control.req = result;
            if(control.type === 'Filter')
                cType += ' ' + control.propSetMap.type;
            switch(cType)
            {
                case 'Checkbox':
                case 'Currency':
                case 'Date':
                case 'Date/Time (Local)':
                case 'Disclosure':
                case 'Email':
                case 'Lookup':
                case 'Multi-select':
                case 'Number':
                case 'Password':
                case 'Radio':
                case 'Radio Group':
                case 'Range':
                case 'Select':
                case 'Signature':
                case 'Telephone':
                case 'Text':
                case 'Text Area':
                case 'Time':
                case 'URL':
                case 'Type Ahead':
                    if(result === false && control.propSetMap.required === true)
                        control.req = false;
                    else
                        control.req = control.propSetMap.required;
                    break;
                case 'Step':
                case 'Block':
                case 'Type Ahead Block':
                case 'Edit Block':
                    if(cType === 'Edit Block' && control.childrenC) {
                        for(var i=0; i<control.childrenC.length; i++) {
                            for(var j=0; j<control.childrenC[i].eleArray.length; j++) {
                                $scope.cascadeRequired(control.childrenC[i].eleArray[j], result);
                            }
                        }
                    }
                    for(var i=0; i<control.children.length; i++)
                    {
                        for(var j=0; j<control.children[i].eleArray.length; j++)
                        {
                            $scope.cascadeRequired(control.children[i].eleArray[j], result);
                        }
                    }
                    break;
                default:
                    ; // do nothing
            }
        };

        $scope.getNewValue = function(conditionType, control, result)
        {
            var newVal = null;

            if(conditionType === 'Hide if False')
                return result;

            switch(control.type)
            {
                case 'Checkbox':
                case 'Currency':
                case 'Date':
                case 'Date/Time (Local)':
                case 'Disclosure':
                case 'Email':
                case 'Lookup':
                case 'Multi-select':
                case 'Number':
                case 'Password':
                case 'Radio':
                case 'Radio Group':
                case 'Range':
                case 'Select':
                case 'Signature':
                case 'Text':
                case 'Text Area':
                case 'Time':
                case 'URL':
                    if(conditionType === 'Optional if False')
                    {
                        if(result === false && control.propSetMap.required === true)
                            newVal = false;
                        else
                            newVal = control.propSetMap.required;
                    }
                    else if(conditionType === 'Readonly if False')
                        newVal = (!result)?(true):(control.propSetMap.readOnly);
                    break;
                case 'Step':
                case 'Block':
                case 'Type Ahead Block':
                case 'Edit Block':
                        newVal = (conditionType === 'Optional if False')?(result):(!result);
                    break;
                default:
                    ; // do nothing
            }

            return newVal;
        };

        // function to handle the evaluation of show/hide of an element
        // @param
        // control - Element
        $scope.evaluateShow = function(control, scp)
        {
            // initialize, skip
            if($scope.activeIndex === undefined || $scope.activeIndex === null)
                return false;

            if(!control.propSetMap.show)
                return true;

            var conditionType = control.propSetMap.conditionType;
            if(!conditionType)
                conditionType = 'Hide if False';

            // only process the controls within the current step
            // backward compatible
            if(   (control.level !== 0 && control.rootIndex === undefined) // backward compatible
               || (control.level !== 0 && control.rootIndex !== undefined && control.rootIndex === $scope.bpTree.asIndex) // controls which belong to the current step
               || (control.level === 0 && control.indexInParent >= $scope.activeIndex && !bpService.sflMode)
               || (control.level === 0 && bpService.sflMode)  )  // root elements after the active root element
            {
                //console.log('Show/hide1: ' + control.name);
                var result = false;

                try
                {
                    result = $scope.evalCondition(control, 'show', scp);
                }
                catch(err)
                {
                    console.log(err.message);
                    return false;
                }

                var oldVal = control.show;
                if(conditionType === 'Readonly if False')
                    oldVal = control.ro;
                else if(conditionType === 'Optional if False')
                    oldVal = control.req;

                if(oldVal === $scope.getNewValue(conditionType, control, result))
                    return control.show;

                //console.log('Show/hide2: ' + control.name);
                var sibling;
                if(control.propSetMap.repeat === true || control.type === 'Edit Block')
                    siblings = $scope.findSibling(scp, control);
                else
                    siblings = [control];
                if(siblings)
                {
                    switch(conditionType)
                    {
                        case 'Readonly if False':
                            for(var i=0; i<siblings.length; i++)
                                $scope.cascadeReadonly(siblings[i], result);
                            result = true;
                            break;
                        case 'Optional if False':
                            for(var i=0; i<siblings.length; i++)
                                $scope.cascadeRequired(siblings[i], result);
                            result = true;
                            break;
                        default:
                            ;    // do nothing
                    }

                    for(var i=0; i<siblings.length; i++)
                        siblings[i].show = result;
                }

                // adjust the current step state
                if(conditionType === 'Hide if False' && control.level === 0 && $scope.bpTree.asIndex !== undefined && $scope.bpTree.asIndex !== null
                   && control.indexInParent > $scope.bpTree.asIndex)
                    $scope.adjustStepState($scope.bpTree.children[$scope.bpTree.asIndex], false);

                return result;
            }
            else
            {
                if(conditionType === 'Hide if False')
                {
                    if(control.level !== 0 && control.rootIndex !== undefined && control.rootIndex > $scope.activeIndex
                       && ((control.propSetMap.accessibleInFutureSteps === true && control.show === undefined) || control.propSetMap.forceAccessible) )
                        control.show = true;
                    return control.show;
                }
                else
                    return true;
            }
        };

        $scope.configureItem = function(payload, control, scp, selectedItem, operation, customizer, modalCustomizer, pcIndex)
        {
            var bOpenModal = false;
            if(modalCustomizer && modalCustomizer.constructor === Function)
            {
                bOpenModal = modalCustomizer(selectedItem);
            }

            if(bOpenModal)
            {
                var modalTmpl;
                var modalController;
                var modalSize;
                if(control && control.propSetMap.modalConfigurationSetting)
                {
                    modalTmpl = control.propSetMap.modalConfigurationSetting.modalHTMLTemplateId;
                    modalController = control.propSetMap.modalConfigurationSetting.modalController;
                    modalSize = control.propSetMap.modalConfigurationSetting.modalSize;
                }
                // persistent component
                else if($scope.bpTree.propSetMap.persistentComponent && $scope.bpTree.propSetMap.persistentComponent[pcIndex]
                        && $scope.bpTree.propSetMap.persistentComponent[pcIndex].modalConfigurationSetting)
                {
                    modalTmpl = $scope.bpTree.propSetMap.persistentComponent[pcIndex].modalConfigurationSetting.modalHTMLTemplateId;
                    modalController = $scope.bpTree.propSetMap.persistentComponent[pcIndex].modalConfigurationSetting.modalController;
                    modalSize = $scope.bpTree.propSetMap.persistentComponent[pcIndex].modalConfigurationSetting.modalSize;
                }

                if(modalTmpl && modalController && modalSize)
                {
                    $rootScope.loading = true;

                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: modalTmpl,
                        controller: modalController,
                        size: modalSize,
                        scope: $scope,
                        show: true,
                        resolve: {
                        mSelectedItem: function () {
                                return selectedItem;
                            },
                        mScp: function () {
                                return scp;
                            },
                        mPayload: function () {
                                return payload;
                            },
                        mControl: function () {
                                return control;
                            },
                        mOperation: function () {
                                return operation;
                            },
                        mpcIndex: function () {
                                return pcIndex;
                            }
                        }
                    });
                }
            }
            else if(operation)
            {
                $scope.buttonClick(payload, control, scp, selectedItem, operation, customizer);
            }
        };

        // to be used in future
        $scope.updateStepPreRemoteActions = function(scp, element)
        {
            var stepIndex = $scope.findStepIndex(scp, element.index, element.indexInParent);
            if(stepIndex >= 0 && stepIndex < $scope.bpTree.children.length)
            {
                if(!$scope.bpTree.children[stepIndex].preRemoteActions)
                    $scope.bpTree.children[stepIndex].preRemoteActions = [];
                if(element.propSetMap.preRemoteAction && element.propSetMap.preRemoteAction.remoteClass
                   && element.propSetMap.preRemoteAction.remoteMethod)
                {
                    $scope.bpTree.children[stepIndex].preRemoteActions = [];
                    $scope.bpTree.children[stepIndex].preRemoteActions.add(element.preRemoteAction);
                }
            }
        };

        // user click
        // button click (1) action button (2) Filter Block (3) Selectable Items
        // @param
        // payload - JSON input
        // control - Element
        // scp - Element control
        // selectedItem - in Selectable Items Element case, the item selected by the user where they trigger the remote call
        // operation - the operation of the remote call ('Delete', 'Add', etc.)
        // customizer - the customized function to be called once the remote call promise comes back
        $scope.buttonClick = function(payload, control, scp, selectedItem, operation, customizer, callback)
        {
            //MOBILE-508
            var form = document.querySelector('form#' + scp.bpTree.sOmniScriptId + '-' + scp.activeIndex);

            if (form){
                var lastInput = form.querySelectorAll('input.ng-valid.ng-dirty');
                var lastTextArea = form.querySelectorAll('textarea.ng-valid.ng-dirty');

                if (lastInput && lastInput.length > 0){
                    for (var i = 0 ; i < lastInput.length ; i++){
                        lastInput[i].blur();
                    }
                }

                if (lastTextArea && lastTextArea.length > 0){
                    for (var j = 0 ; j < lastTextArea.length ; j++){
                        lastTextArea[j].blur();
                    }
                }
            }

            //MOBILE-508
            $timeout(function(){
                if(!control)
                    return;

                var bValid = false;

                if((control.propSetMap.validationRequired === 'Submit' || control.propSetMap.validationRequired === 'Step')
                   && control.type != 'Set Values'
                   && operation !== 'vlcEBOperation')
                    bValid = !$scope.checkValidity(scp, control.index, control.indexInParent, control.propSetMap.validationRequired);
                else
                    bValid = true;
                if(!bValid)
                {
                    //control.active = false;
                    return;
                }

                // v16, Edit Block individual action
                if(operation === 'vlcEBOperation' && scp) {
                    if(scp.editBlockIndex === undefined || scp.editBlockIndex === null) {
                        scp.editBlockIndex = scp.$index;
                    }
                }
                if(control.type === 'Remote Action' || control.type === 'Filter Block' || bpService.placeholderEleTypeList.indexOf(control.type) >= 0
                   || control.type === 'Calculation Action' || control.type === 'Integration Procedure Action')
                    $scope.remoteCallInvoke(payload, control, true, null, scp, selectedItem, operation, customizer, null, null, null, callback);
                else if(control.type === 'Rest Action')
                    $scope.restCallInvoke(payload, control, true, null, scp, null, null, operation, callback);
                else if(control.type === 'DataRaptor Extract Action')
                    $scope.drExtractInvoke(control, true, null, scp);
                else if(control.type === 'Post to Object Action')
                    $scope.objectPostInvoke($scope.bpTree, control, true, null, scp);
                else if(control.type === 'DataRaptor Post Action')
                    $scope.drPostInvoke($scope.bpTree, control, true, null, scp, null, operation, callback);
                else if(control.type === 'DataRaptor Transform Action')
                    $scope.drTransformActionInvoke($scope.bpTree, control, true, null, scp);
                else if(control.type === 'Matrix Action')
                    $scope.matrixActionInvoke(control, true, null, scp, null, operation, callback);
                else if(control.type === 'Delete Action')
                    $scope.deleteActionInvoke(control, true, null, scp, null, operation, callback);
                else if(control.type === 'PDF Action')
                    $scope.pdfInvoke(payload, control, true, null, scp, null);
                // review action
                else if(control.type === 'Review Action')
                    $scope.reviewAction(control, true, null, scp);
                else if(control.type === 'Done Action')
                    $scope.doneAction(control, true, null, scp);
                else if(control.type === 'Set Values' || control.type === 'Set Errors')
                    $scope.setValuesErrors(control, true);
                else if(control.type === 'DocuSign Envelope Action')
                    $scope.sendDocuSigEnvelope(payload, control, true, null, null, scp);
                else if(control.type === 'DocuSign Signature Action')
                    $scope.sendDocuSigEnvelope(payload, control, true, null, null, scp, true);
                else if( control.type === 'Email Action')
                    $scope.sendEmail(payload, control, true, null, null, scp);
            })
        };

        // pc stands for persistent component
        // persisten Component remote call
        // @param
        // payload - JSON input
        // scp - Element scope
        // selectedItem - in Selectable Items Element case, the item selected by the user where they trigger the remote call
        // operation - the operation of the remote call ('Delete', 'Add', etc.)
        // customizer - the customized function to be called once the remote call promise comes back
        $scope.pcAction = function(pcIndex, payload, scp, selectedItem, operation, customizer)
        {
            $scope.remoteCallInvoke(payload, null, true, null, scp, selectedItem, operation, customizer, null, null, pcIndex);
        };


        // function to process expressions in JSONified valueMaps with expression engine
        // use the regex to parse "=xxx" pattern
        // this function is used by setValuesErrors and is based on .handleMergeField
        // I've left a lot of code that I haven't wrapped my head around in case it might
        // turn out to be useful later
        // @param
        // inputStr - input string
        // Assign bug tickets to Zack Sohn
        $scope.handleExpressionEngine = function(inputStr, bReplaceIndex, index, element)
        {
            if(inputStr === undefined || inputStr === null)
                return '';

            if(index === undefined || index === null)
                index = NaN;

            if(VOUINS.isRepeatNotation(inputStr) && element)
                index = $scope.findRepeatIndex(element);

            var expFields = inputStr.match(/"=(?:(?:\\")|[^"])*"/g);

            var resultName = inputStr;
            if(expFields)
            {
                for (var i = 0; i < expFields.length; i++)
                {
                    expFields[i] = expFields[i].slice(1,expFields[i].length-1);
                    var exp = expFields[i].slice(1);
                    if(!angular.equals(index, NaN)){
                        //exp = $scope.replaceNIndex(exp, index+1);
                        console.log(""); //disabling behavior, not changing if
                    }
                    if(bReplaceIndex !== true)
                    {
                        // Setting expValue
                        var expValue = null;
                        try{
                            expValue = vlocity.expressionEngine.evaluateExpression(exp.replace(/\\"/g,'"'), function(token) {
                                return $scope.getElementValue(token, true);
                            }, true);
                            scope.isInvalid = false;
                        }catch (e) {
                            console.log(e.message);
                        }
                        // Replacing value in stringified value map
                        {
                            if(expValue===null || expValue===undefined)
                                resultName = resultName.replace(expFields[i], '');
                            // Using angular.toJson() to format input
                            else
                                resultName = resultName.replace('"'+expFields[i]+'"', angular.toJson(expValue));
                        }
                    }
                    else if(!angular.equals(index, NaN))
                    {
                        //if(exp !== null && exp !== undefined)
                        //    resultName = resultName.replace(expFields[i], '%'+exp+'%');
                        console.log("dreplaceNIndex behavior is disabled on this function"); //disabling behavior, not changing if
                    }
                }
            }

            resultName = (resultName === null || resultName === undefined)?(''):(resultName);
            return resultName;
        };

        // function to do client side setValues or setErrors (applyCallResp)
        $scope.setValuesErrors = function(element, bBtn)
        {
            // first apply the element values
            var bContinue = true;
            var valueMap = {};

            if(element && element.type === 'Set Values' && element.propSetMap.elementValueMap)
                valueMap = angular.copy(element.propSetMap.elementValueMap);
            if(element && element.type === 'Set Errors' && element.propSetMap.elementErrorMap)
                valueMap = angular.copy(element.propSetMap.elementErrorMap);

            //Handles merge fields in valueMap with handleMergeFiled
            var valueString = angular.toJson(valueMap);
            // handleMergeField and handleExpressionEngine work on different targets and are non-redundant
            valueString = $scope.handleExpressionEngine(valueString, false, null, (bBtn)?element:null);
            valueString = $scope.handleMergeField(valueString, false, null, (bBtn)?element:null, null, null, true);
            valueMap = angular.fromJson(valueString);

            //Applies valueMap to the element with applyCallRespMain
            if(valueMap)
            {
                if(element.type === 'Set Values')
                    $scope.applyCallRespMain(valueMap, element, false);
                else if(element.type === 'Set Errors')
                {
                    var resp = {};
                    resp.vlcValidationErrors = valueMap;
                    bContinue = $scope.applyCallRespMain(resp, element, false);
                }
            }

            $scope.handleMessaging(element, bBtn);

            return bContinue;
        };

        // function to do window post message or writing to session storage
        $scope.handleMessaging = function(element, bBtn)
        {
            try {
                var msgMap = {};

                if( element && element.propSetMap.message
                    && (element.propSetMap.wpm || element.propSetMap.ssm) ) {
                        var valueMap = angular.copy(element.propSetMap.message);
                        if(element.type === 'Done Action' || element.type === 'Cancel Script') {
                            if(element.propSetMap.type) {
                                valueMap[element.propSetMap.type] = element.propSetMap.source;
                            }
                        }

                        valueMap['Type'] = element.type;
                        valueMap['OmniEleName'] = element.name;
                        var valueString = angular.toJson(valueMap);
                        valueString = $scope.handleMergeField(valueString, false, null, (bBtn)?element:null, null, null, true);
                        valueMap = angular.fromJson(valueString);
                        msgMap[$scope.bpTree.messagingKey] = valueMap;
                        if(msgMap) {
                            if(element.propSetMap.wpm)
                                $window.parent.postMessage(msgMap, "*");
                            if(element.propSetMap.ssm)
                                $scope.setSessionStorageMessage(valueMap);
                        }
                }
            }
            catch(err) {
                console.log(err.message);
            }
        };

        $scope.doneCancelAux = function(propSetMap, isCancel)
        {
            var bRedirect = false;

            // if we're done or canceling then remove our unload listener.
            $window.removeEventListener("beforeunload", showUnloadMessage);

            if(!bpService.bMobile)
            {
                var dest = propSetMap.source;

                dest = $scope.handleMergeField(dest);

                if(propSetMap.type === 'Redirect')
                    bRedirect = true;
                else
                {
                    $scope.$root.locked = true;
                    if (bpService.isInConsole)
                    {
                        sforce.console.getEnclosingTabId(function (result) {
                            var tabId = result.id;
                            sforce.console.closeTab(tabId);
                            if(propSetMap.type === 'SObject' && dest)
                                dest = '/' + dest;
                            if(dest) {
                                sforce.console.openPrimaryTab(null, dest, true, (propSetMap.consoleTabLabel)?(propSetMap.consoleTabLabel):('New'));
                            }
                        });
                    } else if ('parentIFrame' in window && sfdcVars.urlParams.omniIframeEmbedded == true) {
                        if (isCancel && sfdcVars.urlParams.omniCancelAction== 'back') {
                            parentIFrame.sendMessage({
                                message:'omni:cancelGoBack'
                            });
                        } else {
                            parentIFrame.sendMessage({
                                message:'omni:doneCancelAux',
                                type: propSetMap.type,
                                destination: dest,
                                additionalConfig: {
                                    action: propSetMap.action || {
                                        openUrlIn: 'New Tab / Window'
                                    },
                                    actionConfig: propSetMap.actionConfig,
                                    openActionIn: propSetMap.openActionIn,
                                    openInPrimaryTab: propSetMap.openInPrimaryTab === true,
                                    closeTab: propSetMap.closeTab || true,
                                    consoleTabLabel: propSetMap.consoleTabLabel ? propSetMap.consoleTabLabel : 'New'
                                }
                            });
                        }
                    } else if ((typeof sforce !== 'undefined') && (sforce !== null && sforce.one !== undefined && sforce.one !== null)){
                        if (isCancel && sfdcVars.urlParams.omniCancelAction == 'back') {
                            if (historyCount < window.history.length) {
                                window.history.go(historyCount - (window.history.length + 1));
                            } else if(historyCount == window.history.length) {
                                sforce.one.back();
                            }
                        } else if(propSetMap.type === 'SObject') {
                            sforce.one.navigateToSObject(dest);
                        } else if(propSetMap.type === 'URL'){
                            sforce.one.navigateToURL(dest,true);
                        }
                    } else {
                        if (isCancel && sfdcVars.urlParams.omniCancelAction == 'back') {
                            if (historyCount < window.history.length) {
                                window.history.go(historyCount - (window.history.length + 1));
                            } else {
                                window.history.back();
                            }
                        } else if(propSetMap.type === 'SObject') {
                            window.location = '/'+dest;
                        } else if(propSetMap.type === 'URL'){
                            window.location= dest;
                        }
                    }
                }
            }
            // for mobile, redirect
            else
                bRedirect = true;

            if(bRedirect)
            {
                var redirect = propSetMap.redirectPageName;
                var redirectTemplateUrl = propSetMap.redirectTemplateUrl;

                if(redirect && redirectTemplateUrl) {
                    redirectTemplateUrl = bpService.getHTMLTemplate(redirectTemplateUrl);
                    bpService.redirectPageTemplateMap[redirect] = redirectTemplateUrl;
                    bpService.restResponse[redirect] = {};
                    bpService.restResponse[redirect] = angular.copy($scope.bpTree);
                    $location.path('/custom/' + redirect);
                }
            }
        };

        // function to handle Done Action
        // @param
        // element - Element
        // bBtn - button case or not
        // fromIndex - previous index
        // scp - Element scope
        $scope.doneAction = function(element, bBtn, fromIndex, scp) {
            // complete the script
            if (element && $scope.bpTree.propSetMap.timeTracking)
            {
                var outcome = 'Done';

                if (element.propSetMap.Outcome)
                    outcome = $scope.handleMergeField(element.propSetMap.Outcome);

                $scope.trackOutcome(element, outcome);
            }

            if(bpService.sflMode || ($scope.bpTree.propSetMap.autoSaveOnStepNext === true && $scope.bpTree.sInstanceId)) {
                var doneConfig = {"element":element,"bBtn":bBtn,"fromIndex":fromIndex,"scp":scp};
                $scope.completeScript(false, doneConfig);
            }
            else
            	$scope.doneActionAux(element, bBtn, fromIndex, scp);

        };

        // OMNI-2370
        $scope.doneActionAux = function(element, bBtn, fromIndex, scp) {
            /*
             * OMNI-839 - Add postMessage support to send messages across iframe's to tell
             * parent where the Script is up to. Don't leak extra info though, just element name.
             */
            $window.parent.postMessage(JSON.stringify({
                name: element.name,
                type: element.type
            }), "*");
            $scope.setSessionStorageMessage({
                name: element.name,
                type: element.type,
                messageType: 'doneAction'
            });

            $scope.handleMessaging(element, bBtn);
            $scope.doneCancelAux(element.propSetMap);
        };

        // user click
        // function to handle the click of side bar nav icon
        // (1) in redirect mode, clicking the side bar nav icon will issue an alert
        // (2) the user can click forward if there are not Actions embedded between steps
        // (3) the user can always click backward
        // @param
        // step - Step Element
        $scope.sidebarNav = function(step, dontPushState)
        {
            if(location.indexOf('/custom') === 0)
            {
                $window.alert( new Error(customLabels.OmniSideBarError3));
                return;
            }
            if(!step)
                return;
            var bCanNav = false;
            var currentStepIndex = $scope.bpTree.asIndex;
            var currentStep;
            if(currentStepIndex !== undefined && currentStepIndex !== null)
            {
                currentStep = $scope.bpTree.children[currentStepIndex];
                // go back, always allow
                if(currentStepIndex > step.indexInParent)
                    bCanNav = true;
                // go to a future Step
                else if(currentStepIndex < step.indexInParent)
                {
                    // only if this Step does not have validation errors, and there is no remote action tied to it
                    if(currentStep.inValid === false)
                    {
                        var bAction = false;
                        var bStepError = false;

                        if(currentStep.propSetMap.remoteClass && currentStep.propSetMap.remoteMethod)
                            bAction = true;
                        else if(step.indexInParent > currentStep.indexInParent+1)
                        {
                            // check if there are actions between the current Step and the destination Step
                            for(var i=currentStep.indexInParent+1; i<step.indexInParent; i++)
                            {
                                if(bpService.scriptState !== 'review' && $scope.bpTree.children[i].type !== 'Step' && $scope.bpTree.children[i].show)
                                {
                                    bAction = true;
                                    break;
                                }

                                if($scope.bpTree.children[i].type === 'Step' && $scope.bpTree.children[i].inValid === true)
                                {
                                    bStepError = true;
                                    break;
                                }
                            }
                        }

                        if(!bAction && !bStepError)
                            bCanNav = true;
                        else if(bAction)
                            $window.alert(new Error(customLabels.OmniSideBarError1));
                        else if(bStepError)
                            $window.alert(new Error(customLabels.OmniSideBarError4));
                    }
                    else
                        $window.alert(new Error(customLabels.OmniSideBarError2));
                }
            }

            if(bCanNav)
            {
                if(currentStep)
                {
                    $scope.setStepStatus(currentStep, false, true, true, null, dontPushState);
                    //currentStep.bAccordionOpen = false;
                    //currentStep.bAccordionActive = false;
                }

                //$scope.setStepStatus(step, true);
                //step.bAccordionOpen = true;
                //step.bAccordionActive = true;
                $scope.activateStep(step, true, dontPushState);
                $scope.bpTree.asIndex = step.indexInParent;
                step.dirty = true;
            }
        };

        // Returns Step object to pass to sidebarNav() calls for autoAdvance
        $scope.getStep = function(dest){
            var out = null;
            var steps = $scope.bpTree.children;
            if (typeof dest == 'number'){
                out = $scope.bpTree.children[Math.trunc(Math.abs(dest))];
            } else if (!isNaN(Number(dest))){
                out = $scope.bpTree.children[Math.trunc(Math.abs(Number(dest)))];
            } else{
                for(i = 0; i < steps.length; i++){
                    if(steps[i].name.toLowerCase() == dest.toLowerCase()){
                        out = steps[i];
                        break;
                    }
                }
            }
            return out;
        }

        // Calls either next or sidebarNav behavior on the next digest loop
        // dest is the destination, either triggering the next case or to be passed to getStep
        $scope.autoAdvance = function(dest){
            if (dest == undefined || dest === null){
                return false;
            } else {
                var el;
                el = angular.element('section.animate-rev');
                el.stop(true)

                $timeout(function(){
                    if (dest.toLowerCase() == "next"){
                        thisStep = $scope.bpTree.children[$scope.bpTree.asIndex];
                        if (thisStep.bHasNext){
                            $scope.nextRepeater(thisStep.nextIndex,thisStep.indexInParent);
                        }
                    } else {
                        $scope.sidebarNav($scope.getStep(dest), false);
                    }
                    el.removeClass('animate-rev');
                    el.addClass('animate-if');
                    $rootScope.$emit('scroll');
                }, 0);
            }
        }

        // function to make Apex REST API
        // @param
        // payload - JSON input
        // control - Element
        // bSubmit - for Submit button (2.5) or not
        $scope.apexrest = function(payload, control)
        {
            var path = control.propSetMap.restPath;
            var method = control.propSetMap.restMethod;

            if(path && method)
            {
                // process payload
                if(!payload.response)
                    payload.response = {};

                var redirect = control.propSetMap.redirectPageName;
                var redirectTemplateUrl = control.propSetMap.redirectTemplateUrl;
                if(redirect && redirectTemplateUrl)
                {
                    redirectTemplateUrl = bpService.getHTMLTemplate(redirectTemplateUrl);
                    bpService.redirectPageTemplateMap[redirect] = redirectTemplateUrl;
                }

                sendPayload = {};
                // Raptor
                if(path.indexOf("/DataRaptor") >= 0)
                {
                    sendPayload.objectList = angular.toJson(payload.response);
                    sendPayload.bundleName = payload.RPBundle;
                    sendPayload.filesMap = angular.toJson(VOUINS.getFilesMap(payload.filesMap, $rootScope.isSforce, $rootScope.sforce));
                }
                else
                {
                    sendPayload.filesMap = angular.toJson(VOUINS.getFilesMap(payload.filesMap, $rootScope.isSforce, $rootScope.sforce));
                    var tempPayload = angular.copy(payload);

                    $scope.prepBeforeSubmit(tempPayload, true, (path.indexOf('/v1/application/')>=0)?true:false);
                    sendPayload.fullJSON = angular.toJson(tempPayload);
                }

                if($scope.previewMode) {
                    $scope.addDebugLog('Calling Apex Rest',sendPayload);
                }

                $rootScope.loading = true;
                $rootScope.loadingMessage = '';

                var configObj = {path:path, input:sendPayload, method:method, label:{label: (control && control.name)}};

                bpService.OmniRestInvoke(configObj).then(
                    function (data){
                        VOUINS.syncFileAttachmentData(data, true, $rootScope, $q, $scope, $scope.bpTree.filesMap, bpService, $window).then(function () {
                            $timeout(function()
                            {
                                 $rootScope.loading = false;
                                 console.log('SUCCESS');

                                 if($scope.previewMode) {
                                     $scope.addDebugLog('Apex Rest SUCCESS', data);
                                 }

                                 if(redirect && redirectTemplateUrl)
                                 {
                                     data.CallSuccess = true;
                                     //bpService.restResponse[redirect] = data;
                                     bpService.restResponse[redirect] = {};
                                     bpService.restResponse[redirect].bpTree = $scope.bpTree;
                                     bpService.restResponse[redirect].response = data;
                                     $location.path('/custom/' + redirect);
                                 }

                                 $scope.$apply();
                             });
                        });
                    },
	                function (jqXHR){
	                    $rootScope.loading = false;
	                    if($scope.previewMode) {
	                       $scope.addDebugLog('Apex Rest ERROR', jqXHR);
	                    }
	                    if(redirect && redirectTemplateUrl)
	                    {
	                        jqXHR.CallSuccess = false;
	                        //bpService.restResponse[redirect] = jqXHR;
	                        bpService.restResponse[redirect] = {};
	                        bpService.restResponse[redirect].bpTree = $scope.bpTree;
	                        bpService.restResponse[redirect].response = jqXHR;
	                        $location.path('/custom/' + redirect);
	                    }
	                    else if(jqXHR.responseText)
	                        $window.alert(jqXHR.responseText);
	                    $scope.$apply();
	            });
                //console.log(angular.toJson(sendPayload));
            }
        };

        $scope.redirect = function(redirect, element, bBtn)
        {
            if(!bBtn && (element.nextIndex === undefined || element.nextIndex === null) && $scope.bpTree.propSetMap.timeTracking)  // last Action
                $scope.calcStepActionTiming(element, false);
            $location.path(redirect);
        };

        $scope.performValidate = function(scp, control)
        {
            // perf enhancment: the calc should only happen for the fields in the current step
            if(control.rootIndex !== undefined && control.rootIndex !== null &&
               control.rootIndex !== $scope.bpTree.asIndex)
                return false;

            //console.log('Validate: ' + control.name);

            var oldVal = control.response;
            //control.response = null;
            // handle merge field in msg.text
            //control.displayMsg = '';

            try
            {
                control.response = $scope.evalCondition(control, 'validate', scp);
            }
            catch(err)
            {
                console.log(err.message);
                control.response = false;
            }

            if(control.response === true)
                scp.loopform.$setValidity("vlcValError", true);
            else
            {
                if(control.propSetMap.messages[1].active === true && control.propSetMap.messages[1].type === 'Requirement')
                    scp.loopform.$setValidity("vlcValError", false);
            }

            for(var i=0; i<control.propSetMap.messages.length; i++)
            {
                if(control.propSetMap.messages[i].active === true && control.response === control.propSetMap.messages[i].value)
                    control.displayMsg = $scope.handleMergeField(control.propSetMap.messages[i].text, false, true, control);
            }

            if(!angular.equals(control.response, oldVal))
                $scope.aggregate(scp, control.index, control.indexInParent, true, -1);

            return false;
        };

        $scope.performCalculation = function(scp, control) {
            // perf enhancment: the calc should only happen for the fields in the current step
            if(control.rootIndex !== undefined && control.rootIndex !== null &&
               control.rootIndex !== $scope.bpTree.asIndex)
                return true;

            try {
                var currentVal, expression, randomExpression, expressionDups, dataType;
                currentVal = control.response;
                randomExpression = 'RANDOM()';
                expression = (!control.expression)? control.propSetMap.expression: control.expression;
                expressionDups=expression;
                dataType = control.propSetMap.dataType;
                if(expression)
                {
                    if(VOUINS.isRepeatNotation(expression)) {
                        expression = $scope.handleExpression(expression, control);
                    }
                    switch(dataType) {
                        case 'Number':    // intentionally fall through
                        case 'Currency':    expression = "NUMBER(" + expression + ")";
                                            break;
                        case 'Date':        expression = "DATE(" + expression + ")";
                                            break;
                        case 'Boolean':     expression = "BOOLEAN(" + expression + ")";
                                            break;
                        case 'Text':        expression = "STRING(" + expression + ")";
                                            break;
                        default: // do nothing
                    }
                }

                if(expressionDups.search(/RANDOM\(\)/)!==-1) {
                    var newRandVal = vlocity.expressionEngine.evaluateExpression(randomExpression, function(token) {
                        return $scope.getElementValue(token, true);
                    });

                    expression = expressionDups.replace(/RANDOM\(\)/g, newRandVal);
                    control.expression = expression;
                }

                // Formula/Aggregate field are not repeatable by themselves, only if they are under repeatable blocks
                var newVal = vlocity.expressionEngine.evaluateExpression(expression, function(token) {
                    return $scope.getElementValue(token, true);
                });

                if (!angular.equals(newVal, currentVal)) {
                    control.response = newVal;
                    $scope.aggregate(scp, control.index, control.indexInParent, true, -1);
                }

            } catch (e) {
                /*
                console.debug('inside exception ' + angular.toJson(e));
                */
            }
            return true;
        };

        $scope.handleExpression = function(expression, control)
        {
            if(!control)
                return expression;

            var index = $scope.findRepeatIndex(control);

            if(!angular.equals(index, NaN))
            {
                return $scope.handleMergeField(expression, true, index);
            }
        };

        /**
         * Troubleshooting widget tab logic
         *
         */
        $scope.showDebugTabs = false;

        $scope.tabs = [
            {title:'Logs', page: 'previewLogs.html'},
            {title:'Pre Fill', page: 'previewDR.html'},
            {title:'Simulate', page: 'previewSimulate.html'},
            {title:'Form State', page: 'previewApplication.html'},
        ];

        $scope.testJSON = '';

        $scope.currentTab = 'previewLogs.html';

        $scope.onClickTab = function (tab, event) {
            $scope.currentTab = tab.page;
            event.stopPropagation()
            event.preventDefault();
        };

        $scope.isActiveTab = function(tabUrl) {
            return tabUrl == $scope.currentTab;
        };

        if ($rootScope.tabKey) {
            var pendingTimeoutId = null,
                pendingInitialLoad = true,
                pendingBpTreeIfNonExisting = null;
            $scope.$watch("bpTree.response", function(newValue, oldValue) {
                if ($scope.bpTree) {
                    if (pendingTimeoutId) {
                        $timeout.cancel(pendingTimeoutId);
                    }
                    pendingTimeoutId = $timeout(function() {
                        if (pendingInitialLoad) {
                            pendingBpTreeIfNonExisting = JSON.stringify($scope.bpTree.response, null, 4);
                        } else {
                            $scope.bpTree.responseAsText = JSON.stringify($scope.bpTree.response, null, 4);
                        }
                    }, 500);
                }
            }, true);
        }

        if(sfdcVars.urlParams.omniIframeEmbedded && sfdcVars.urlParams.vlcOmniEmbeddedInFlow) {
           var inter = setInterval(function(){
              if('parentIFrame' in window) {
                 if($scope.bpTree.response) {
                      parentIFrame.sendMessage({
                          message:'omni:sendResponseToFlow',
                          omniScriptOutput: angular.toJson(($scope.bpTree.response))
                      });
                  }
                  $scope.$watch("bpTree.response", function(newValue, oldValue) {
                      if('parentIFrame' in window && $scope.bpTree) {
                          parentIFrame.sendMessage({
                              message:'omni:sendResponseToFlow',
                              omniScriptOutput: angular.toJson(($scope.bpTree.response))
                          });
                      }
                  }, true);
                  clearInterval(inter);
              }
            }, 1000);
        }

        /**
         * Add debug logs to array to be shown in widget
         * @param {[type]} label : label of the log
         * @param {[type]} log   : actual json representation of js object being logged
         */
        $scope.addDebugLog = function(label, log) {
            var debugLog = {};
            debugLog.label = label;
            debugLog.log = log;
            $scope.debugInformation.push(debugLog);
        };

        // function to get Geolocation - longtitude or latitude
        // @param
        // control - Element
        // data - JSON response
        // dataCopy - copy of the JSON response
        $scope.getLocation = function(scp, control)
        {
            control.response = null;
            control.center = null;
            if(navigator.geolocation)
            {
                $rootScope.loading = true;
                $rootScope.loadingMessage = '';

                navigator.geolocation.getCurrentPosition(
                     function(position)
                     {
                         $rootScope.loading = false;
                         if(position && position.coords)
                         {
                             var temp = {};
                             // use google map
                             //temp.latitude = position.coords.latitude;
                             //temp.longitude = position.coords.longitude;
                             //temp.timestamp = position.timestamp;
                             //temp.ts = new Date(position.timestamp);
                             //temp.ts = temp.ts.toLocaleString();
                             //var tempGURL = 'https://maps.google.com/?q=' + temp.latitude +
                                         //',' + temp.longitude + '&output=embed';

                             // for the time being, we don't need a track
                             control.response = {};
                             control.response[0] = {lat: position.coords.latitude,
                                                  lng: position.coords.longitude,
                                                  message: "Current Location",
                                                  focus: false,
                                                  draggable: false};
                             control.center = {lat: position.coords.latitude,
                                               lng: position.coords.longitude,
                                               zoom: 15}

                             //control.response.push(temp);
                             //control.gURL = $sce.trustAsResourceUrl(tempGURL);
                         }
                         scp.aggregate(scp, control.index, control.indexInParent, true, -1);
                         $scope.$apply();
                     },
                     function(error)
                     {
                         $rootScope.loading = false;
                         $window.alert(error);
                         $scope.$apply();
                     },{timeout:10000});
            }
            else
            {
                $window.alert(new Error(customLabels.OmniGeoError));
            }
        };

        $scope.openModal = function (scp, control)
        {
            var jsonContent = angular.copy(control.vlcSI);
            var itemsKey = control.propSetMap.itemsKey;
            if(!itemsKey)
                itemsKey = 'recSet';
            if(jsonContent && jsonContent[itemsKey] && angular.isArray(jsonContent[itemsKey]))
            {
                var deleteIndex = [];
                for(var i=0; i<jsonContent[itemsKey].length; i++)
                {
                    if(jsonContent[itemsKey][i].vlcCompSelected !== true)
                        deleteIndex.push(i);
                }
                for(var j=0; j<deleteIndex.length; j++)
                {
                    jsonContent[itemsKey].splice(deleteIndex[j]-j, 1);
                }
                jsonContent.currencyCode = $scope.bpTree.userCurrencyCode;
            }

            var modalTmpl = control.propSetMap.modalHTMLTemplateId;
            if(!modalTmpl)
                modalTmpl = 'vlcModalContent.html';

            modalTmpl = bpService.getHTMLTemplate(modalTmpl);
            var modalController = control.propSetMap.modalController;
            if(!modalController)
                modalController = 'ModalInstanceCtrl';
            var size = control.propSetMap.modalSize;

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: modalTmpl,
                controller: modalController,
                size: size,
                scope: $scope,
                show: true,
                resolve: {
                  content: function () {
                    return jsonContent;
                  }
                }
            });
        };

        $scope.openKnowledgeModal = function (step)
        {
            var modalTmpl = 'vlcKnowledgeBody.html';
            var modalController = 'ModalInstanceCtrl';
            var jsonContent = angular.copy(step);

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: modalTmpl,
                controller: modalController,
                size: 'lg',
                scope: $scope,
                show: true,
                resolve: {
                  content: function () {
                    return jsonContent;
                  }
                }
            });
        };

        $scope.onCompSelectItem = function(control)
        {
            var maxSize = control.propSetMap.maxCompareSize;
            if(maxSize === undefined || maxSize === null || maxSize.constructor !== Number || maxSize <= 0)
                maxSize = 4;
            var itemsKey = control.propSetMap.itemsKey;
            if(!itemsKey)
                itemsKey = 'recSet';
            if(control.vlcSI[itemsKey] && angular.isArray(control.vlcSI[itemsKey]))
            {
                var j = 0;
                for(var i=0; i<control.vlcSI[itemsKey].length; i++)
                {
                    if(control.vlcSI[itemsKey][i].vlcCompSelected === true)
                        j++;
                }

                if(j >= maxSize)
                    control.compDisable = true;
                else
                    control.compDisable = false;
            }
        };

        $scope.setJSDataPreprocessor = function(element, JSFunc)
        {
            if(JSFunc && JSFunc.constructor === Function)
            {
                if(bpService.placeholderEleTypeList.indexOf(element.type) >= 0)
                    ouiBaseService.dataPreprocessorMap[element.name] = JSFunc;
                else // persistent component
                    ouiBaseService.dataPreprocessorMap[element.id] = JSFunc;
            }
        };

        $scope.callBackNextStep = function(operation, selectedItem, bSuccess)
        {
            if(bSuccess)
                $scope.nextRepeater($scope.bpTree.children[$scope.bpTree.asIndex].nextIndex, $scope.bpTree.children[$scope.bpTree.asIndex].indexInParent);
        };

        $scope.findPreShowStep = function(eleIndex)
        {
            var rootElements = $scope.bpTree.children;
            if(eleIndex >= 1)
            {
                for(var i=eleIndex-1; i>=0; i--)
                {
                    if(rootElements[i].type === 'Step' && rootElements[i].show)
                        return i;
                }
            }

            return null;
        };

        // sendDocuSigEnvelope() is used to send the envelope from omniscript through docusign API rest call
        // sendDocuSigEnvelope() is using template setup in docusign account to send the envelope to signers.
        // The recipient and template information is taken from DocuSign Envelope Action Omni component properties
        $scope.sendDocuSigEnvelope = function(payload, control, isButton, i, fromIndex, scp, embedSignature) {
            var transform,
                input = payload,
                docuSignInput={},
                signerListStr='',
                options = {},
                promiseArray =[],
                signerInfo;
            control.propSetMap.remoteOptions = {};
            control.propSetMap.remoteOptions.docuSignTemplatesGroup = [];

            if(embedSignature){
                if(control.propSetMap.docuSignTemplate && control.propSetMap.docuSignTemplate !=='') {
                    control.propSetMap.docuSignTemplatesGroupSig =[];
                    docuSignInput.docuSignTemplate = control.propSetMap.docuSignTemplate;
                    signerListStr = angular.toJson(control.propSetMap.signerInformation);
                    signerInfo = angular.fromJson($scope.handleMergeField(signerListStr, false, null, (isButton)?control:null, null, null, true));
                    if(signerInfo.templateRole == '' || signerInfo.signerEmail == '' || signerInfo.signerName == ''){
                        $window.alert(customLabels.OmniDocuSignNoRecipients);
                        return;
                    }
                    docuSignInput.signerList = [];
                    docuSignInput.signerList.push(signerInfo);
                    docuSignInput.sendJSONPath = control.propSetMap.sendJSONPath;
                    docuSignInput.sendJSONNode = control.propSetMap.sendJSONNode;
                    docuSignInput.transformBundle = control.propSetMap.transformBundle;
                    docuSignInput.includeToSend = true;
                    control.propSetMap.docuSignTemplatesGroupSig.push(docuSignInput);
                } else {
                    signerListStr = angular.toJson(control.propSetMap.signerInformation);
                    signerInfo = angular.fromJson($scope.handleMergeField(signerListStr, false, null, (isButton)?control:null, null, null, true));
                    for(var i=0; i<control.propSetMap.docuSignTemplatesGroupSig.length; i++) {
                        if(control.propSetMap.docuSignTemplatesGroupSig[i].templateRole == '' || signerInfo.signerEmail == '' || signerInfo.signerName == ''){
                            $window.alert(customLabels.OmniDocuSignNoRecipients);
                            return;
                        }
                        control.propSetMap.docuSignTemplatesGroupSig[i].signerList = [];
                        var signerObj = {};
                        signerObj.signerEmail = signerInfo.signerEmail;
                        signerObj.signerName = signerInfo.signerName;
                        signerObj.templateRole = control.propSetMap.docuSignTemplatesGroupSig[i].templateRole;
                        control.propSetMap.docuSignTemplatesGroupSig[i].signerList.push(signerObj);
                    }
                }
                control.propSetMap.remoteOptions.signerInformation = signerInfo;
                control.propSetMap.remoteOptions.docuSignTemplatesGroup = control.propSetMap.docuSignTemplatesGroupSig;
            } else{
                if(control.propSetMap.docuSignTemplate && control.propSetMap.docuSignTemplate !=='') {
                    control.propSetMap.docuSignTemplatesGroup =[];
                    docuSignInput.docuSignTemplate = control.propSetMap.docuSignTemplate;
                    signerListStr = angular.toJson(control.propSetMap.signerList);
                    docuSignInput.signerList = angular.fromJson($scope.handleMergeField(signerListStr, false, null, (isButton)?control:null, null, null, true));
                    docuSignInput.sendJSONPath = control.propSetMap.sendJSONPath;
                    docuSignInput.sendJSONNode = control.propSetMap.sendJSONNode;
                    docuSignInput.transformBundle = control.propSetMap.transformBundle;
                    docuSignInput.includeToSend = true;
                    if(!validateSigner(docuSignInput))
                        return;
                    control.propSetMap.docuSignTemplatesGroup.push(docuSignInput);
                    control.propSetMap.remoteOptions.docuSignTemplatesGroup = control.propSetMap.docuSignTemplatesGroup;
                } else {
                    for(var i=0; i<control.propSetMap.docuSignTemplatesGroup.length; i++) {
                        signerListStr = angular.toJson(control.propSetMap.docuSignTemplatesGroup[i].signerList);
                        var docuInp = {};
                        docuInp.signerList = angular.fromJson($scope.handleMergeField(signerListStr, false, null, (isButton)?control:null, null, null, true));
                        if(!validateSigner(docuInp))
                            return;
                        control.propSetMap.remoteOptions.docuSignTemplatesGroup[i] = {};
                        control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].docuSignTemplate = control.propSetMap.docuSignTemplatesGroup[i].docuSignTemplate;
                        control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].sendJSONPath = control.propSetMap.docuSignTemplatesGroup[i].sendJSONPath;
                        control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].sendJSONNode = control.propSetMap.docuSignTemplatesGroup[i].sendJSONNode;
                        control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].transformBundle = control.propSetMap.docuSignTemplatesGroup[i].transformBundle;
                        control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].includeToSend = control.propSetMap.docuSignTemplatesGroup[i].includeToSend;
                        control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].signerList = docuInp.signerList;
                    }
                }
            }
            function validateSigner(docuSignInput) {
                var isValid = true;
                for(var i=0; (i<docuSignInput.signerList.length || docuSignInput.signerList.length === 0); i++) {
                    if(docuSignInput.signerList.length === 0 || (docuSignInput.signerList[i].signerEmail == '' || docuSignInput.signerList[i].signerName == '' || docuSignInput.signerList[i].templateRole == '')){
                        if(!isButton)
                            control.ui.show = true;
                        $scope.handleRemoteCallError(control, customLabels.OmniDocuSignNoRecipients, isButton, false);
                        isValid = false;
                        break;
                    }
                }
                return isValid;
            }
            if(control.propSetMap.emailSubject && control.propSetMap.emailSubject !== "")
                control.propSetMap.remoteOptions.emailSubject = $scope.handleMergeField(control.propSetMap.emailSubject, false, null, (isButton)?control:null);
            if(control.propSetMap.emailBody && control.propSetMap.emailBody !== "")
                control.propSetMap.remoteOptions.emailBody = $scope.handleMergeField(control.propSetMap.emailBody, false, null, (isButton)?control:null);
            control.propSetMap.remoteOptions.elementName = control.name;
            control.propSetMap.remoteClass = bpService.sNSC+"DefaultDocuSignOmniScriptIntegration";
            control.propSetMap.remoteMethod = "sendEnvelope";
            options.dateFormat = control.propSetMap.dateFormat;
            options.dateTimeFormat = control.propSetMap.dateTimeFormat;
            options.timeFormat = control.propSetMap.timeFormat;

            for(var i=0; i<control.propSetMap.remoteOptions.docuSignTemplatesGroup.length; i++) {
                transform = control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].transformBundle;
                if(transform != null && transform !== ""){
                    $rootScope.loading = true;
                    (function(i){
                        var bundleInput = {},
                            iTimeout = control.propSetMap.remoteTimeout,
                            inptJSON = $scope.prepareInputJSON(control);
                        inptJSON = $scope.getSendResponseJSON(inptJSON, control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].sendJSONPath, control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].sendJSONNode);
                        bundleInput.objectList = inptJSON;
                        bundleInput.bundleName = transform;
                        // This option is separate from the VlocityPDF options
                        var option = {};
                        option.useQueueableApexRemoting = (control.propSetMap.useQueueableApexRemoting === true);

                        var configObj = {sClassName:bpService.sNSC+'DefaultDROmniScriptIntegration',sMethodName:'invokeTransformDR',input:angular.toJson(bundleInput),
                                         options:angular.toJson(option),iTimeout:iTimeout,label:{label: control && control.name}};
                        var promise = bpService.OmniRemoteInvoke(configObj).then(
                            function(result){
                                var resp = angular.fromJson(result);
                                if(resp && resp.error !== 'OK'){
                                    $rootScope.loading = false;
                                    $scope.handleRemoteCallError(control, resp.error, true, false);
                                } else {
                                    var TFDRresp = $scope.applyDateFormat(resp.TFDRresp, options);
                                    input = $scope.getSendResponseJSON(input, control.propSetMap.sendJSONPath, control.propSetMap.sendJSONNode);
                                    if(control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].TFDRresp)
                                        delete control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].TFDRresp;
                                    control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].TFDRresp = resp.TFDRresp;
                                }
                            },
                            function(error){
                                $rootScope.loading = false;
                                $scope.handleRemoteCallError(control, error, true, false);
                            }
                        );
                   promiseArray.push(promise);
                   })(i);
                } else{
                    if(control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].sendJSONPath && control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].sendJSONPath !== "") {
                        control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].input = $scope.getSendResponseJSON(input, control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].sendJSONPath, control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].sendJSONNode);
                        control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].input = $scope.applyDateFormat(control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].input, options);
                    } else
                        input = $scope.applyDateFormat(input, options);
                    if(control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].TFDRresp)
                        delete control.propSetMap.remoteOptions.docuSignTemplatesGroup[i].TFDRresp;
                    promiseArray.push($q.when(true));
                }
            }

            $q.all(promiseArray).then(function(promiseArray) {
                callRemoteAction();
            });

            function callRemoteAction() {
                if(embedSignature)
                    openDocuSignModal();
                else
                    $scope.remoteCallInvoke(input, control, isButton, i, scp, null, null, null, fromIndex, true);
            }

            function openDocuSignModal(){
                $rootScope.loading = false;
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'vlcDocuSignSignatureModal.html',
                    controller: 'ModalDocuSignEmbeddedCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    scope: $scope,
                    show: true,
                    resolve: {
                        mElementScp: function () {
                            return $scope;
                        },
                        mInput: function () {
                            return input;
                        },
                        mControl: function () {
                            return control;
                        }
                    }
                });
                modalInstance = null;
            }
        };

        $scope.applyDateFormat = function(data, options){
            for(var root in data){
                if(typeof data[root] === 'object'){
                    for(childs in data[root]){
                        if(typeof data[root][childs] === 'object'){
                            for(prop in data[root][childs]){
                                if(typeof data[root][childs][prop] === 'object'){
                                    for(keys in data[root][childs][prop]){
                                        if(typeof data[root][childs][prop][keys] === 'string')
                                            data[root][childs][prop][keys] = vlocityPdfWriter.getAsDate(String(data[root][childs][prop][keys]), options);
                                    }
                                } else if(typeof data[root][childs][prop] === 'string' && data[root][childs][prop].indexOf(':') > 0)
                                    data[root][childs][prop] = vlocityPdfWriter.getAsDate(String(data[root][childs][prop]), options);
                            }
                        } else if(typeof data[root][childs] === 'string' && data[root][childs].indexOf(':') > 0)
                            data[root][childs] = vlocityPdfWriter.getAsDate(String(data[root][childs]), options);
                    }
                }
            }
            return data;
        };

        $scope.runActiveScript = function(OSType, OSSubType, OSLangCode, parentObjectId, pfBundleName, bLoaded, bNew, multiLangCode)
        {
            // in the button invoke case, have to prevent the controller from being called twice
            var sType = OSType;
            var sSubType = OSSubType;
            var sLang = OSLangCode;
            var sParentObjectId = parentObjectId;
            if(sParentObjectId && sParentObjectId.length >= 1)
            {
                if(sParentObjectId.charAt(sParentObjectId.length-1) === '?')
                    sParentObjectId = sParentObjectId.substring(0, sParentObjectId.length - 1);
            }
            else
                sParentObjectId = '';
            bpService.parentObjectId = sParentObjectId;
            var sPFRPBundleName = pfBundleName;
            if(sPFRPBundleName && sPFRPBundleName.length >= 1)
            {
                if(sPFRPBundleName.charAt(sPFRPBundleName.length-1) === '?')
                    sPFRPBundleName = sPFRPBundleName.substring(0, sPFRPBundleName.length - 1);
            }
            else
                sPFRPBundleName = '';

            // update bpService
            bpService.bpType = sType;
            bpService.bpSubType = sSubType;
            bpService.bpLang = sLang;
            bpService.parentObjectId = sParentObjectId;
            bpService.pfDRBundle = sPFRPBundleName;

            // this code will not be triggered when the script navigates from a redirect page
            // back to the main flow
            if(bNew !== "false")
            {
                if(sType && sSubType && sLang)
                {
                    $rootScope.loading = true;
                    $rootScope.loadingMessage = '';

                    if(!bLoaded)
                    {
                        var drParams = {};
                        if(sParentObjectId)
                            drParams['Id'] = sParentObjectId;
                        var configObj = {sClassName:'Vlocity BuildJSONWithPrefill', sType:sType,
                        		         sSubType:sSubType, sLang:sLang, sPFRPBundleName:sPFRPBundleName, drParams:angular.toJson(drParams),
                        		         multiLangCode:multiLangCode};
                        bpService.OmniRemoteInvoke(configObj).then(
                            function(result)
                            {
                                $rootScope.scriptNotFound1 = false;
                                $rootScope.scriptNotFound2 = false;
                                $scope.processBPDef(false, result);
                            },
                            function(error)
                            {
                                if (window.forceLocalDef){
                                    window.forceLocalDef = false;
                                    return $scope.runActiveScript(OSType, OSSubType, OSLangCode, parentObjectId, pfBundleName, bLoaded, bNew, multiLangCode);
                                }
                                $rootScope.loading = false;
                                if(window.OmniOut && error.errType === 'LocalScriptDefNotFound') {
                                	$rootScope.rootCustomLabels = customLabels;
                                    $rootScope.scriptNotFound1 = true;
                                    $rootScope.scriptNotFound2 = false;
                                    $rootScope.type = bpService.bpType;
                                    $rootScope.subType = bpService.bpSubType;
                                    $rootScope.lang = bpService.bpLang;
                                }
                                else
                                    $window.alert(new Error(angular.toJson(error)));
                            }
                        );
                    }
                    else
                    {
                        if(sfdcVars.bpDef)
                        {
                            $timeout(function() {
                                $scope.processBPDef(false, sfdcVars.bpDef, bLoaded);
                            }, 0);
                        }
                    }
                }
            }
        };

        $scope.getbVertParam = function(bVert)
        {
            if(bVert !== null && bVert !== undefined && bVert.constructor === Boolean)
                $scope.bVert = bVert;
            else {
                if(bVert)
                {
                    if(bVert.charAt(bVert.length-1) === '?')
                        bVert = bVert.substring(0, bVert.length - 1);
                }

                if(bVert !== 'false')
                    $scope.bVert = true;
                else
                    $scope.bVert = false;
            }

            if(bpService.layout === 'lightning' || bpService.layout === 'newport')
                $scope.bVert = true;
            // update bpService
            bpService.verticalMode = $scope.bVert;
            if(!$scope.bVert)
            {
                bpService.bpW = 8;
                $scope.bpW = 8;
            }
            else
            {
                bpService.bpW = 12;
                $scope.bpW = 12;
            }

            return bVert;
        };

        $scope.runScriptById = function(sId, osState, bNew, bLoaded, multiLangCode)
        {
            bpService.scriptState = osState;
            if(osState === 'new')
            {
                bpService.bpId = sId;
                bpService.resumeMode = false;
            }
            else if(osState === 'review')
            {
                bpService.appId = sId;
                bpService.resumeMode = true;
            }
            else
            {
                bpService.instanceId = sId;
                bpService.resumeMode = false;
                bpService.sflMode = true;
            }

            if(bNew !== "false")
            {
                if(sId)
                {
                    $rootScope.loading = true;
                    $rootScope.loadingMessage = '';

                    if(!bLoaded)
                    {
                        var configObj = {sClassName:'Vlocity BuildJSONV3',sId:sId,
                        		         scriptState:osState, bPreview:ouiBaseService.previewMode, multiLangCode:multiLangCode};
                        bpService.OmniRemoteInvoke(configObj).then(
                            function(result)
                            {
                                $scope.processBPDef(true, result);
                            },
                            function(error)
                            {
                                $rootScope.loading = false;
                                $window.alert(new Error(angular.toJson(error)));
                            }
                        );
                    }
                    else
                    {
                        if(sfdcVars.bpDef)
                        {
                            $timeout(function() {
                                $scope.processBPDef(false, sfdcVars.bpDef);
                            }, 0);
                        }
                    }
                }
            }
        };

        var typeAheadSearchTimeouts = {};
        $scope.typeAheadSearch = function (searchString, payload, control, scp, isLookup) {
            var element = control.name, ctrl,
                stepElements = control.children,
                debounce = control.propSetMap.callFrequency,
                dataProcessor = control.propSetMap.dataProcessorFunction,
                deferred = $q.defer(),
                actionCtrl = control.propSetMap.taAction,
                typeAheadKey = control.propSetMap.typeAheadKey,
                useDataJson = control.propSetMap.useDataJson,
                dataJsonPath = control.propSetMap.dataJsonPath,
                actionCtrlList = ['Remote Action', 'Calculation Action', 'Integration Procedure Action'];

            // Below if condition is added for inline edit block so that it should not effect other edit block templates.
            if(control.noformatterebmodal && control.selectedFromInlineEB && angular.equals(searchString, control.selectedFromEB) && !control.propSetMap.enableLookup){
            	return [];
            }

            if((control.noformatterebmodal && searchString !== "" && angular.equals(searchString, control.selectedFromEB) && !control.propSetMap.enableLookup)
                || isEBModalClosed(scp) ) {
                    control.selectedFromEB ='';
                    scp.selectedFlag = true;
                    return [];
            }
            if(control.noformatterebmodal && typeAheadKey && typeAheadKey !== "" && (searchString === "" || searchString === null)
                && scp.elementScp && !scp.elementScp.inlineEditBlock && !angular.isUndefined(scp.selectedFlag) && !control.propSetMap.enableLookup) {
                    $scope.toggleTypeAheadEditMode(scp, true, true, null, control.blockIndex);
                    $timeout(function() {
                        scp.aggregate(scp.elementScp.$parent, control.index, control.indexInParent, true, -1);
                    });
                    return [];
            }
            if(isLookup) {
                control.propSetMap.options = null;
                control.response = null;
                $scope.toggleTypeAheadEditMode(scp, true, true, null, control.blockIndex);
                if(sfdcVars.layout === 'lightning' || sfdcVars.layout === 'newport')
                    $scope.onClickTypeAheadWrapper(scp, control);
            } else if(!isLookup){
                if(angular.isObject(searchString)){
                    if(Object.keys(searchString).length === 1 && searchString[Object.keys(searchString)[0]].search('</a>') > 0)
                        control.response = '';
                    else
                        control.response = String(searchString[typeAheadKey]);
                    return [];
                }

                if (!searchString || angular.isUndefined(searchString) || searchString === "" || searchString === " " || scp.selectedFlag || (useDataJson ? false : !actionCtrl) || angular.isUndefined(scp.selectedFlag)) {
                    if(typeAheadKey && typeAheadKey !== "" && searchString == "" && !angular.isUndefined(scp.selectedFlag) && !control.noformatterebmodal)
                        $scope.toggleTypeAheadEditMode(scp, true, true, null, control.blockIndex);
                    scp.selectedFlag = false;
                    return [];
                }

                // Handle Prefill
                if( searchString !== '' && !scp.selectedFlag && !scp.isKeyPressed){
                    return [];
                }

                if (typeAheadSearchTimeouts[element]) {
                    $timeout.cancel(typeAheadSearchTimeouts[element]);
                }

                if(!debounce || debounce === "")
                    debounce = 300;
            }

            if((dataProcessor || dataProcessor !== "") && !scp.isDataProcessorSearched){
                scp.dataProcessorFunc = window[dataProcessor] || baseCtrl.prototype[dataProcessor];
                scp.isDataProcessorSearched = true;
            }
            if(!control.show)
                control.show = true;

            typeAheadSearchTimeouts[element] = $timeout(function () {
                if(typeAheadKey && typeAheadKey !== "" && !angular.isUndefined(scp.selectedFlag))
                    $scope.toggleTypeAheadEditMode(scp, true, true, null, control.blockIndex);

                if(control.noformatterebmodal && scp.elementScp) {
                    $timeout(function() {
                        scp.aggregate(scp.elementScp.$parent, control.index, control.indexInParent, true, -1);
                    });
                } else {
                    scp.aggregate(scp, control.index, control.indexInParent, true, -1);
                }

                if(useDataJson && (dataJsonPath != (undefined || null) && !angular.equals('',dataJsonPath))) {
                    var propArray = $scope.preprocessElementInput(dataJsonPath),
                        result = $scope.getJSONNode(payload, propArray);

                    if(scp.dataProcessorFunc && angular.isFunction(scp.dataProcessorFunc))
                        result = scp.dataProcessorFunc(result, control, scp, actionCtrl, searchString);
                    else if(isLookup)
                        result = $scope.typeAheadCallBack(result, control, scp, actionCtrl, searchString, isLookup);
                    else
                        result = $scope.typeAheadCallBack(result, control, scp, actionCtrl, searchString);

                    if(searchString && result && !control.propSetMap.disableDataFilter)
                        result = searchArr(searchString, result);
                    else
                        result = result;

                    function searchArr(sString, sObject) {
                        return sObject.filter(function (obj) {
                            if ((typeAheadKey && typeAheadKey !== '') && obj.hasOwnProperty(typeAheadKey))
                                return obj[typeAheadKey].toLocaleLowerCase().search(sString.toLocaleLowerCase()) !== -1;
                            else if(angular.isString(obj))
                                return obj.toLocaleLowerCase().search(sString.toLocaleLowerCase()) !== -1;
                        });
                    }

                    if(!isLookup) {
                        scp.selectedFlag = true;
                        deferred.resolve(result);
                    } else if(isLookup){
                        deferred.resolve( control.propSetMap.options = checkObjectNumber(result, typeAheadKey) );
                    }

                } else if(actionCtrl && (actionCtrlList.indexOf(actionCtrl.type) !== -1)){
                    actionCtrl.propSetMap.remoteOptions.searchString = searchString;
                    $scope.remoteCallInvoke(payload, actionCtrl, true, null, scp, null, 'typeAheadSearch', null, null, null, null, function(result){
                        if(!isLookup) {
                            scp.selectedFlag = true;
                            if(scp.dataProcessorFunc && angular.isFunction(scp.dataProcessorFunc))
                                deferred.resolve(scp.dataProcessorFunc(result, control, scp, actionCtrl, searchString));
                            else
                                deferred.resolve($scope.typeAheadCallBack(result, control, scp, actionCtrl, searchString));
                        } else if(isLookup){
                            if(scp.dataProcessorFunc && angular.isFunction(scp.dataProcessorFunc))
                                deferred.resolve( control.propSetMap.options = scp.dataProcessorFunc(result, control, scp, actionCtrl, searchString) );
                            else
                                deferred.resolve( control.propSetMap.options = checkObjectNumber($scope.typeAheadCallBack(result, control, scp, actionCtrl, searchString, isLookup), typeAheadKey) );
                            if(!$scope.$$phase)
                                $scope.$apply();
                        }
                    });
                } else if(actionCtrl && angular.equals(actionCtrl.type, 'Rest Action')){
                    $scope.restCallInvoke(payload, actionCtrl, true, null, scp, null, null, 'typeAheadSearch', function(result){
                        if(!isLookup) {
                            scp.selectedFlag = true;
                            if(scp.dataProcessorFunc && angular.isFunction(scp.dataProcessorFunc))
                                deferred.resolve(scp.dataProcessorFunc(result, control, scp, actionCtrl, searchString));
                            else
                                deferred.resolve($scope.typeAheadCallBack(result, control, scp, actionCtrl, searchString));
                        } else if(isLookup){
                            if(scp.dataProcessorFunc && angular.isFunction(scp.dataProcessorFunc))
                                deferred.resolve( control.propSetMap.options = scp.dataProcessorFunc(result, control, scp, actionCtrl, searchString) );
                            else
                                deferred.resolve( control.propSetMap.options = checkObjectNumber($scope.typeAheadCallBack(result, control, scp, actionCtrl, searchString, isLookup), typeAheadKey) );
                            if(!$scope.$$phase)
                                $scope.$apply();
                        }
                    });
                } else if(actionCtrl && angular.equals(actionCtrl.type, 'DataRaptor Extract Action')){
                    $scope.drExtractInvoke(actionCtrl, true, null, scp, null, 'typeAheadSearch', function(result){
                        if (result != null && !angular.isArray(result)) {
                            if (Object.keys(result).length === 0)
                            {
                                result = [];
                            }
                            else
                            {
                                result = [ result ];
                            }
                        }

                        if(!isLookup) {
                            scp.selectedFlag = true;
                            if(scp.dataProcessorFunc && angular.isFunction(scp.dataProcessorFunc))
                                deferred.resolve(scp.dataProcessorFunc(result, control, scp, actionCtrl));
                            else
                                deferred.resolve($scope.typeAheadCallBack(result, control, scp, actionCtrl, searchString));
                        } else if(isLookup){
                            if(scp.dataProcessorFunc && angular.isFunction(scp.dataProcessorFunc))
                                deferred.resolve( control.propSetMap.options = scp.dataProcessorFunc(result, control, scp, actionCtrl) );
                            else
                                deferred.resolve( control.propSetMap.options = checkObjectNumber($scope.typeAheadCallBack(result, control, scp, actionCtrl, searchString, isLookup), typeAheadKey) );
                            if(!$scope.$$phase)
                                $scope.$apply();
                        }

                    });
                }
            }, debounce);

           function checkObjectNumber(retArr, typeAheadKey) {
               if(retArr && retArr.length>0 && angular.isNumber(retArr[0][typeAheadKey])) {
                   for(var i=0;i <retArr.length; i++)
                       retArr[i][typeAheadKey] = String(retArr[i][typeAheadKey]);
               }
               return retArr;
           }

           function isEBModalClosed(scope) {
                if (scope.control && scope.control.hasOwnProperty('modalClosed')) {
                    return scope.control.modalClosed;
                } else if (scope.$parent && scope.$parent.control) {
                    return isEBModalClosed(scope.$parent);
                }
                return false;
            }

           return deferred.promise;
        };

        $scope.$on('$typeahead.select', function(event, selected, selectedIndex, typeaheadScope){
            var ctrl = typeaheadScope.$scope.control,
                selectedItem = angular.copy(selected),
                typeAheadBlock = {},
                scope = event.currentScope;
            if(ctrl.noformatterebmodal) {
                ctrl.selectedFromEB = selected[ctrl.propSetMap.typeAheadKey];
                ctrl.selectedFromInlineEB = typeaheadScope.$scope.elementScp.inlineEditBlock ? true : null;
            }
            if(angular.isObject(selectedItem)){
                if(ctrl.propSetMap.enableLookup) {
                    ctrl.propSetMap.options = null;
                    ctrl.response = selectedItem[ctrl.propSetMap.typeAheadKey];
                }
                if(Object.keys(selectedItem).length === 1 && selectedItem[Object.keys(selectedItem)[0]].search('</a>') > 0)
                    scope.toggleTypeAheadEditMode(typeaheadScope.$scope.$parent, true, null, null, ctrl.blockIndex);
                else {
                    selectedItem[ctrl.name] = selectedItem[ctrl.propSetMap.typeAheadKey];
                    delete selectedItem[ctrl.propSetMap.typeAheadKey];
                    typeAheadBlock[ctrl.name+'-Block'] = selectedItem;
                    scope.applyCallResp(typeAheadBlock, null, null, null, ctrl.blockIndex);
                }
                scope.$apply();
            } else if(ctrl.propSetMap.enableLookup && selectedItem.constructor === String) {
                ctrl.response = selectedItem;
            }
            if(ctrl.noformatterebmodal && typeaheadScope.$scope.elementScp)
                typeaheadScope.$scope.aggregate(typeaheadScope.$scope.elementScp.$parent, ctrl.index, ctrl.indexInParent, true, -1);
            else
                typeaheadScope.$scope.aggregate(typeaheadScope.$scope, ctrl.index, ctrl.indexInParent, true, -1);
        });

        $scope.typeAheadOnChange = function (evt, scp) {
            scp.isKeyPressed = true;
            try {
                if (!(evt.keyCode === 37 || evt.keyCode === 38 || evt.keyCode === 39 || evt.keyCode === 40 || evt.keyCode === 13))
                    scp.control.selectedFromInlineEB = scp.selectedFlag = false;
            }
            catch(e) {
                console.log(e);
            }
        };

        $scope.typeAheadCallBack = function (result, control, scp, actionCtrl, searchString, isLookup) {
            var isAppendLink = false,
                addNewLink = {},
                returnArray,
                typeAheadKey = control.propSetMap.typeAheadKey,
                newItemLabel = control.propSetMap.newItemLabel;
            if(!isLookup && (typeAheadKey && typeAheadKey !== '') && (newItemLabel && newItemLabel !== '')) {
                if(angular.equals(sfdcVars.layout, 'lightning') || angular.equals(sfdcVars.layout, 'newport'))
                    addNewLink[typeAheadKey] = '<a><font size="4" face="verdana" color="#49739C"> +</font><span> </span><font size="4" color="#49739C">' + control.propSetMap.newItemLabel + '</font></a><span class="vlc-typeahead-newopt-displaynone">'+searchString+'</span>';
                else
                    addNewLink[typeAheadKey] = '<a><font size="3">+ </font>' + control.propSetMap.newItemLabel + '</a><span class="vlc-typeahead-newopt-displaynone">'+searchString+'</span>';
                isAppendLink = true;
            }
            if(angular.isArray(result)){
                returnArray = getArrayFromResp(result);
                if(returnArray.length > 2000)
                    returnArray = returnArray.slice(0,2000);
                if(isAppendLink)
                    returnArray.push(addNewLink);
                return returnArray;
            } else if(angular.isObject(result) && Object.getOwnPropertyNames(result).length >= 1){
                for(key in result){
                    if(angular.isArray(result[key])){
                        if(result[key].length > 2000)
                            result[key] = result[key].slice(0,2000);
                        if(isAppendLink)
                            result[key].push(addNewLink);
                        return result[key];
                    }
                    // This else part is use for API which return array structure as ["A",["amazon","aaj tak"]]
                    // suggestqueries.google.com/complete/search?client=firefox&q=A
                    else if((angular.isString(result[key]) && (result[key].indexOf('[') !== -1 && result[key].lastIndexOf(']') !== -1)) && angular.isArray(angular.fromJson(result[key]))) {
                        returnArray = getArrayFromResp(angular.fromJson(result[key]));
                        if(returnArray.length > 2000)
                            returnArray = returnArray.slice(0,2000);
                        if(isAppendLink)
                            returnArray.push(addNewLink);
                        return returnArray;
                    }
                    // This else part is for smarty street, if there is only match then smarty street return's single object instead of array object
                    else if(angular.isObject(result[key]) && result[key][typeAheadKey]) {
                        returnArray = [result[key]];
                        if(isAppendLink)
                            returnArray.push(addNewLink);
                        return returnArray;
                    }
                }
                if(isAppendLink)
                    return returnArray = [addNewLink];
            }

            function getArrayFromResp(resp){
                if(!resp)
                    return;
                var isNestedArray = false;
                for(var i=0; i<=1; i++){
                    if(angular.isArray(resp[i])){
                        isNestedArray = true;
                        return resp[i];
                    }
                }

                if(!isNestedArray)
                    return resp;
            }
        };

        $scope.toggleTypeAheadEditMode = function(scp, isNewClicked, onChange, clearAll, blockIndex){
           function doToggle() {
                var typeAheadBlock = scp.$parent.$parent.control;
                if(isNewClicked) {
                    var childs = typeAheadBlock.children,
                        tAObject = {},
                        i=0;
                    if(onChange && !clearAll)
                        i=1;
                    for(i; i<childs.length; i++)
                        tAObject[childs[i].eleArray[0].name] = null;
                    var obj = {};
                    obj[scp.$parent.$parent.control.name] = tAObject;
                    $scope.applyCallResp(obj, null, null, null, blockIndex);
                    if(!onChange)
                        typeAheadBlock.propSetMap.isTypeaheadEdit = true;
                }
                else
                    typeAheadBlock.propSetMap.isTypeaheadEdit = !typeAheadBlock.propSetMap.isTypeaheadEdit;
            }

            if (!isNewClicked || !clearAll) {
               $timeout(doToggle);
            } else {
               doToggle();
            }
        }

        // onClickTypeAheadWrapper: Use to change z-index for type ahead wrapper div.
        $scope.onClickTypeAheadWrapper = function(scp, control) {
            var ctrlEleName = scp.control.name;
            if(control.blockIndex == undefined || control.blockIndex == null) {
                if($scope.prevTACtrlEleName !== null && !angular.equals($scope.prevTACtrlEleName, ctrlEleName))
                    $("[id='"+$scope.prevTACtrlEleName+"']").parent('.vlc-control-wrapper').removeAttr('style');
                $("[id='"+ctrlEleName+"']").parent('.vlc-control-wrapper').css('z-index',2);
            }
            $scope.prevTACtrlEleName = ctrlEleName;
            $scope.resetSrvErr(control);
        }

        //####This section is for Google Map Autocomple Suggestions for Type Ahead Block####
        // initAutocomplete: intialise the google api on typeahead input initialization
        $scope.initAutocomplete = function(scp, control) {
            var googleMapsAPIKey = control.propSetMap.googleMapsAPIKey,
                url = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + googleMapsAPIKey + '&language='+sfdcVars.sUserLanguage,
                ctrlName = control.name,
                transform = control.propSetMap.transformBundle,
                country = control.propSetMap.googleAddressCountry,
                googleTransformation = control.propSetMap.googleTransformation;

            if(document.getElementsByTagName('script')[0].src.indexOf(url) >= 0 || $scope.googleMapInitialized || typeof google === 'object') {
                if(typeof google === 'object')
                    $scope.googleMapInitialized = true;
                $timeout(callbackLoadAPI,1000);
                return;
            }
            $.when($.getScript(url), $.Deferred(function(deferred){$(deferred.resolve);})).then(callbackLoadAPI);
            $scope.googleMapInitialized = true;

            function callbackLoadAPI(){
                var taElement, taElementMap, modalEle,
                    clsPrefix = angular.equals(sfdcVars.layout, 'lightning') ? 'slds-' : (angular.equals(sfdcVars.layout, 'newport') ? 'nds-' : '');
                if(control.noformatterebmodal === "true") {
                    modalEle = $('.'+clsPrefix+'modal').length > 0 ? $('.'+clsPrefix+'modal') : $('.'+clsPrefix+'edit-block-edit__container');
                    if(modalEle.length > 0) {
                        taElement = modalEle.find("[id='"+ctrlName+"']")[0];
                        taElementMap =  modalEle.find("[id='"+ctrlName+"_map']")[0];
                    } else {
                        return;
                    }
                } else {
                    taElement = (control.blockIndex !== undefined && control.blockIndex !== null) ? $("[id='"+ctrlName+"']")[control.blockIndex] : document.getElementById(ctrlName);
                    taElementMap = (control.blockIndex !== undefined && control.blockIndex !== null) ? $("[id='"+ctrlName+"_map']")[control.blockIndex] : document.getElementById(ctrlName+'_map');
                }
                if(typeof google !== 'object') {
                    $scope.initAutocomplete(scp, control);
                    return;
                }
                scp.autocomplete = new google.maps.places.Autocomplete( taElement, {types: ['geocode']});
                if(country && ( country !== '' && country.toLocaleLowerCase() !== 'all') )
                    scp.autocomplete.setComponentRestrictions({'country': country});
                var address = $(taElement).val();
                if(control.blockIndex !== undefined && control.blockIndex !== null && !angular.isUndefined(address) && !angular.equals(address,''))
                    control.selectedFlg = true;
                if(!angular.isUndefined(address) && !angular.equals(address,'') && control.selectedFlg) {
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode( { 'address': address}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if($(taElementMap).length > 0) {
                                $(taElementMap).show();
                                var ltLng = { lat: results[0].geometry.location.lat(),
                                              lng: results[0].geometry.location.lng()
                                            },
                                    mpObj = { center: ltLng,
                                               zoom: 15
                                             },
                                    mp = new google.maps.Map(taElementMap, mpObj),
                                    mar = new google.maps.Marker({position: ltLng, map: mp, title: address});
                            }
                        }
                    });
                }
                // place_changed listener callback is called whenever user pick the value from autocomplete dropdown
                scp.autocomplete.addListener('place_changed', function(){
                    var place = scp.autocomplete.getPlace();
                    if(!place.address_components)
                        return false;
                    var addrMap = { street_number: 'short_name',
                                    route: 'long_name',
                                    locality: 'long_name',
                                    administrative_area_level_1: 'short_name',
                                    administrative_area_level_2: 'short_name',
                                    country: 'long_name',
                                    postal_code: 'short_name'
                                  },
                        latLang = { lat: place.geometry.location.lat(),
                                    lng: place.geometry.location.lng()
                                  },
                         mapObj = { center:latLang,
                                    zoom:15
                                  },
                        addrObject = {},
                        typeAheadBlock = {},
                        sPlace ={};

                    control.response = place.formatted_address;
                    control.selectedFlg = true;
                    if(control.noformatterebmodal && scp.elementScp) {
                        $timeout(function() {
                            scp.aggregate(scp.elementScp.$parent, control.index, control.indexInParent, true, -1);
                        });
                    } else {
                        scp.aggregate(scp, control.index, control.indexInParent, true, -1);
                    }

                    // Create map object and marker object only when hideMap is false
                    if(!control.propSetMap.hideMap) {
                        $(taElementMap).show();
                        var map = new google.maps.Map(taElementMap, mapObj);
                        var marker = new google.maps.Marker({position: latLang, map: map, title: place.formatted_address});
                    }

                    // Loop through the google place object and create standard object for address
                    var street = '';
                    for (var i = 0; i < place.address_components.length; i++) {
                        var addressType = place.address_components[i].types[0];
                        if (addrMap[addressType]) {
                            if(googleTransformation[addressType] != undefined && googleTransformation[addressType] != '')
                                addrObject[googleTransformation[addressType]] = place.address_components[i][addrMap[addressType]];
                            else
                                addrObject[addressType] = place.address_components[i][addrMap[addressType]];
                            if(addressType === 'street_number' || addressType === 'route') {
                                if(angular.element('html').css('direction') === 'rtl')
                                    street = place.address_components[i][addrMap[addressType]] + ' ' + street;
                                else
                                    street = street + ' ' + place.address_components[i][addrMap[addressType]];
                            }
                        }
                    }
                    if(googleTransformation.street != undefined && googleTransformation.street != '') {
                        addrObject[googleTransformation.street] = street.trim();
                        delete addrObject.street_number;
                        delete addrObject.route;
                    }
                    sPlace.address_components = addrObject;
                    typeAheadBlock[scp.control.name+'-Block'] = addrObject;
                    scp.applyCallResp(typeAheadBlock, null, null, null, control.blockIndex);
                    scp.$apply();
                });

                var a = navigator.userAgent;
                if ((a.indexOf('Salesforce') != -1) && (a.indexOf('iPhone') != -1 || a.indexOf('iPad') != -1) && (a.indexOf('Safari') == -1)) {
                    // OMNI-2388 - this is a little hack to fix up issues on mobile with the position of the google maps
                    //             typeahead dropdown. We listen for focus/keypress and body scroll events, then we must
                    //             calculate the top based on the first div under the body with the el offset.
                    var styleEl = document.getElementById(ctrlName + '-style');
                    if (styleEl == null) {
                        styleEl = document.createElement('style');
                        styleEl.id = ctrlName + 'style';
                        var head = document.getElementsByTagName('head')[0];
                        head.appendChild(styleEl);
                    }

                    function fixPositionOfDropdown(ctrlName) {
                        var el = $(document.getElementById(ctrlName));
                        var newTop = Math.abs($('body>div').offset().top) + el.offset().top + el.outerHeight();
                        var containers = $('.pac-container');
                        containers.each(function() {
                            if ($(this).css('display') !== 'none') {
                                styleEl.innerText = '.pac-container{ top :' + newTop + 'px !important;}';
                            }
                        });
                    }

                    $(document.getElementById(ctrlName)).on('focus keydown keyup', function() {
                        fixPositionOfDropdown(ctrlName);
                    });

                    $('body').scroll(function(){
                        //Set new top to autocomplete dropdown
                        fixPositionOfDropdown(ctrlName);
                    });
                }
            };

            // Google API call's this global function if API key is invalid.
            window.gm_authFailure = function() {
                if(angular.equals(sfdcVars.layout, 'lightning') || angular.equals(sfdcVars.layout, 'newport')) {
                    $scope.$apply($scope.googleInvalidKey = true);
                    $(document.getElementById(ctrlName)).next('label').hide();
                    $(document.getElementById(ctrlName)).css('background-repeat','no-repeat');
                    $(document.getElementById(ctrlName)).css('padding-left','50px');
                }
                $(document.getElementById(ctrlName)).after("<span style='color: #FF0000'>Google Maps API error: InvalidKeyMapError</span>");
            };

            $scope.init(scp, control);
        }

        // onFocusAutocomplete: Set the address search preference to user's geographical location
        $scope.onFocusAutocomplete = function(scp, control) {
            if(control.propSetMap.googleMapsAPIKey === '' && $scope.googleMapInitialized) {
                var ele, ctrlName = control.name, modalEle,
                    clsPrefix = angular.equals(sfdcVars.layout, 'lightning') ? 'slds-' : (angular.equals(sfdcVars.layout, 'newport') ? 'nds-' : '');
                if(control.noformatterebmodal === "true") {
                    modalEle = $('.'+clsPrefix+'modal').length > 0 ? $('.'+clsPrefix+'modal') : $('.'+clsPrefix+'edit-block-edit__container');
                    if( modalEle.length > 0)
                        ele =  modalEle.find("[id='"+ctrlName+"']")[0];
                } else {
                    ele = (control.blockIndex !== undefined && control.blockIndex !== null) ? $("[id='"+ctrlName+"']")[control.blockIndex] : document.getElementById(ctrlName);
                }
                if($(ele).next('#googleWarning').length > 0)
                    $(ele).next('#googleWarning').remove();
                $(ele).after("<span id='googleWarning' style='color: #FFA07A'>Google Maps API warning: NoApiKeys</span>");
            }
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    var circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy
                    });
                    scp.autocomplete.setBounds(circle.getBounds());
                });
            }
            $scope.googleMapInitialized = false;
            $scope.resetSrvErr(control)
        }

        // onKeyDownAutocomplete: nullify fields under typeahead block on change of value and also hides the map div.
        $scope.onKeyDownAutocomplete = function (evt, scp, control) {
            try {
                var cmaKeys = evt.ctrlKey || evt.metaKey || evt.altKey,
                    ctrlName = control.name,
                    taElementMap, modalEle,
                    clsPrefix = angular.equals(sfdcVars.layout, 'lightning') ? 'slds-' : (angular.equals(sfdcVars.layout, 'newport') ? 'nds-' : '');;
                if(control.noformatterebmodal === "true") {
                    modalEle = $('.'+clsPrefix+'modal').length > 0 ? $('.'+clsPrefix+'modal') : $('.'+clsPrefix+'edit-block-edit__container');
                    if(modalEle.length > 0)
                        taElementMap =  modalEle.find("[id='"+ctrlName+"_map']")[0];
                } else {
                    taElementMap = (control.blockIndex !== undefined && control.blockIndex !== null) ? $("[id='"+ctrlName+"_map']")[control.blockIndex] : document.getElementById(ctrlName+'_map');
                }
                if(cmaKeys && (evt.keyCode === 86 || evt.keyCode === 88))
                    cmaKeys = false;
                if (!cmaKeys && !(evt.keyCode === 37 || evt.keyCode === 38 || evt.keyCode === 39 || evt.keyCode === 40 || evt.keyCode === 13 || evt.keyCode === 9
                    || evt.keyCode === 20 || evt.keyCode === 16 || evt.keyCode === 17 || evt.keyCode === 18 || evt.keyCode === 91 || evt.keyCode === 93 || evt.keyCode === 35 || evt.keyCode === 36
                    || evt.keyCode === 112 || evt.keyCode === 113 || evt.keyCode === 114 || evt.keyCode === 115 || evt.keyCode === 116 || evt.keyCode === 117 || evt.keyCode === 118 || evt.keyCode === 119
                    || evt.keyCode === 120 || evt.keyCode === 121 || evt.keyCode === 122 || evt.keyCode === 123 || evt.keyCode === 124 || evt.keyCode === 125 || evt.keyCode === 126 || evt.keyCode === 127
                    || evt.keyCode === 128 || evt.keyCode === 129 || evt.keyCode === 130 || evt.keyCode === 27 || evt.keyCode === 33 || evt.keyCode === 34)) {
                    control.selectedFlg = false;
                    $(taElementMap).hide();
                    $scope.toggleTypeAheadEditMode(scp, true, true, null, control.blockIndex);
                    if(control.noformatterebmodal && scp.elementScp) {
                        $timeout(function() {
                            scp.aggregate(scp.elementScp.$parent, control.index, control.indexInParent, true, -1);
                        });
                    }
                }
                if(evt.keyCode === 13) {
                    evt.preventDefault();
                    evt.stopPropagation();
                }
            }
            catch(e) {
                console.log(e);
            }
        };
        //######################### Section End ############################

        // sendEmail() is used to send the emial from omniscript using SFDC's Messaging.sendEmail
        $scope.sendEmail = function(payload, control, isButton, i, fromIndex, scp) {
            var fileAttachments,
                documentAttachments,
                attachment,
                promiseArray =[],
                largeFile = false,
                totalAttachmentSize = 0,
                fileElementName;
            control.propSetMap.remoteClass = bpService.sNSC+'DefaultOmniScriptSendEmail';
            control.propSetMap.remoteMethod = 'sendEmail';
            control.propSetMap.remoteOptions = {};
            control.propSetMap.remoteOptions.emailElementName = control.name;
            control.propSetMap.remoteOptions.useTemplate = control.propSetMap.useTemplate;
            control.propSetMap.remoteOptions.emailTemplateName = angular.fromJson($scope.handleMergeField(angular.toJson(control.propSetMap.emailTemplateInformation.emailTemplateName), false, null, (isButton)?control:null, null, null, true));
            control.propSetMap.remoteOptions.emailTargetObjectId = angular.fromJson($scope.handleMergeField(angular.toJson(control.propSetMap.emailTemplateInformation.emailTargetObjectId), false, null, (isButton)?control:null, null, null, true));
            control.propSetMap.remoteOptions.whatId = angular.fromJson($scope.handleMergeField(angular.toJson(control.propSetMap.emailTemplateInformation.whatId), false, null, (isButton)?control:null, null, null, true));
            control.propSetMap.remoteOptions.saveAsActivity = control.propSetMap.emailTemplateInformation.saveAsActivity;
            control.propSetMap.remoteOptions.toAddressList = $scope.parseEmailAddresses(angular.fromJson($scope.handleMergeField(angular.toJson(control.propSetMap.emailInformation.toAddressList), false, null, (isButton)?control:null, null, null, true)));
            control.propSetMap.remoteOptions.OrgWideEmailAddress = $scope.handleMergeField(control.propSetMap.OrgWideEmailAddress);
            if(control.propSetMap.remoteOptions.useTemplate && (control.propSetMap.remoteOptions.emailTemplateName === '' || control.propSetMap.remoteOptions.emailTemplateName === undefined)){
                if(!isButton)
                    control.ui.show = true;
                $scope.handleRemoteCallError(control, customLabels.OmniSendEmailNoTemplate, isButton, false);
                return;
            }
            if(!control.propSetMap.remoteOptions.useTemplate && control.propSetMap.remoteOptions.toAddressList.length === 0) {
                if(!isButton)
                    control.ui.show = true;
                $scope.handleRemoteCallError(control, customLabels.OmniDocuSignNoRecipients, isButton, false);
                return;
            }
            control.propSetMap.remoteOptions.ccAddressList = $scope.parseEmailAddresses(angular.fromJson($scope.handleMergeField(angular.toJson(control.propSetMap.emailInformation.ccAddressList), false, null, (isButton)?control:null, null, null, true)));
            control.propSetMap.remoteOptions.bccAddressList = $scope.parseEmailAddresses(angular.fromJson($scope.handleMergeField(angular.toJson(control.propSetMap.emailInformation.bccAddressList), false, null, (isButton)?control:null, null, null, true)));
            control.propSetMap.remoteOptions.emailSubject = angular.fromJson($scope.handleMergeField(angular.toJson(control.propSetMap.emailInformation.emailSubject), false, null, (isButton)?control:null, null, null, true));
            control.propSetMap.remoteOptions.emailBody = angular.fromJson($scope.handleMergeField(angular.toJson(control.propSetMap.emailInformation.emailBody), false, null, (isButton)?control:null, null, null, true));
            control.propSetMap.remoteOptions.setHtmlBody = control.propSetMap.emailInformation.setHtmlBody;
            fileAttachments = angular.fromJson($scope.handleMergeField(angular.toJson(control.propSetMap.fileAttachments), false, null, (isButton)?control:null, null, null, true));

            // Support Upload to Content Document of file/image element
            if(fileAttachments.length > 0) {
                fileElementName = angular.toJson(control.propSetMap.fileAttachments).match(/%([^[%]+)%/g)[0].replace(/%/g,'');
                control.propSetMap.remoteOptions.uploadContDoc = $scope.getElement(fileElementName)[0].control.propSetMap.uploadContDoc;
            }

            for(var i=0; i<fileAttachments.length; i++) {
                (function(i) {
                    var leng = angular.toJson($scope.bpTree.filesMap[fileAttachments[i].data]).length;
                    totalAttachmentSize = totalAttachmentSize + leng;
                    var fileLength = (leng > 1000000) || (totalAttachmentSize > 1000000);

                    if((leng >= 6653348 || totalAttachmentSize >= 6653348) || largeFile) {
                        largeFile = true;
                        return;
                    }

                    if(fileLength && $rootScope.isSforce && sforce.connection) {
                        $rootScope.loading = true;
                        var attachmentBody = $scope.bpTree.filesMap[fileAttachments[i].data];
                        var contentType = attachmentBody.substring(attachmentBody.indexOf('data:')+5,attachmentBody.indexOf(';base64,'));
                        attachmentBody = attachmentBody.substring(attachmentBody.indexOf('base64,')+7,attachmentBody.length);

                        // Call Soap API to create Document in Document Object
                        var promise = bpService.CreateOSDocumentAttachment(attachmentBody, fileAttachments[i].filename, payload.userId, contentType).then(function(attachmentId) {
                                fileAttachments[i].attachmentId = attachmentId;
                            },
                            function(error) {
                                // If this errors out it may have been a forceTk issue and will need to be cleaned up as well
                                $window.alert(new Error(customLabels.OmniPDFError));
                            }
                        );
                        promiseArray.push(promise);
                    } else {
                        fileAttachments[i].content = $scope.bpTree.filesMap[fileAttachments[i].data];
                        promiseArray.push($q.when(true));
                    }
                })(i);
            }

            if(largeFile) {
                $rootScope.loading = false;
                $window.alert(customLabels.OmniEmailActionLargeFileErr);
                return;
            }

            $q.all(promiseArray).then(function(promiseArray) {
                callEmailAction();
            });

            function callEmailAction() {
            	// v16, attachmentList support (this can be a hard-coded value, a merge field)
            	if(control.propSetMap.attachmentList !== undefined) {
            	    var osAtt = angular.fromJson($scope.handleMergeField('{"osAttList":"'+control.propSetMap.attachmentList+'"}', false, null, (isButton)?control:null, null, null, true));
            	    if(osAtt.osAttList && !angular.isArray(osAtt.osAttList))
            	    	osAtt.osAttList = [osAtt.osAttList];
            	    if(angular.isArray(osAtt.osAttList)) {
            	    	control.propSetMap.remoteOptions.osAttList = osAtt.osAttList;
            	    }
            	}

                if(angular.equals(fileAttachments,''))
                    fileAttachments = [];
                control.propSetMap.remoteOptions.fileAttachments = fileAttachments;
                var docLst = [];
                for(var i = 0 ; i < control.propSetMap.staticDocList.length; i++)
                    docLst.push(control.propSetMap.staticDocList[i]);
                attachment = angular.fromJson($scope.handleMergeField(angular.toJson(control.propSetMap.docList), false, null, (isButton)?control:null, null, null, true));
                if(attachment && attachment !== '')
                    docLst.push(attachment);

               // Content Version Attachment Support
                if(control.propSetMap.contentVersionList !== undefined) {
                    var osConVer = angular.fromJson($scope.handleMergeField('{"osContVerList":"'+control.propSetMap.contentVersionList+'"}', false, null, (isButton)?control:null, null, null, true));
                    if(osConVer.osContVerList && !angular.isArray(osConVer.osContVerList))
                        osConVer.osContVerList = [osConVer.osContVerList];
                    if(angular.isArray(osConVer.osContVerList)) {
                        control.propSetMap.remoteOptions.contentVersionAttachments = osConVer.osContVerList;
                    }
                }
                control.propSetMap.remoteOptions.documentAttachments = docLst;
                $scope.remoteCallInvoke(payload, control, isButton, i, scp, null, 'emailAction', null, fromIndex, true, null, function(resp) {
                    var input = {},
                        opt={},
                        attchIdList =[],
                        isLargeAttachment = false;
                    for( var j=0; j < fileAttachments.length; j++) {
                        if(fileAttachments[j].attachmentId && fileAttachments[j].attachmentId !== '') {
                            attchIdList.push(fileAttachments[j].attachmentId);
                            isLargeAttachment = true;
                        }
                    }
                    input.documentList = attchIdList;
                    opt.documentList = attchIdList;
                    if(isLargeAttachment) {
                        var configObj = {sClassName:bpService.sNSC+'DefaultOmniScriptSendEmail',sMethodName:'deleteAttachedDocuments',input:angular.toJson(input),
                                         options:angular.toJson(opt),iTimeout:'',label:{label: control && control.name}};
                        bpService.OmniRemoteInvoke(configObj).then(
                            function(result) {
                                return;
                            },
                            function(error) {
                                $scope.handleRemoteCallError(control, error, true, false);
                            }
                        );
                    }
                });
            }
        }

        $scope.parseEmailAddresses = function(addresses) {
            var addrArray = [];
            if(angular.isArray(addresses)) {
                for(var i=0; i<addresses.length; i++) {
                    if(angular.isArray(addresses[i])) {
                        for(var j=0; j<addresses[i].length; j++) {
                            if(angular.isObject(addresses[i][j])) {
                                for(addr in addresses[i][j])
                                    addrArray.push(addresses[i][j][addr]);
                            } else if(angular.isString(addresses[i][j])) {
                                addrArray.push(addresses[i][j]);
                            }
                        }
                    } else if(angular.isString(addresses[i])) {
                        addrArray.push(addresses[i]);
                    }
                }
            }
            return addrArray;
        }

        $scope.onClickProductCartQuantity = function(pcIndex, payload, scp, selectedItem, operation, quantity) {
            selectedItem.itemSObject.Quantity = quantity;
            $scope.remoteCallInvoke(payload, null, true, null, scp, selectedItem, operation, null, null, null, pcIndex);
        }

        $scope.openEditModal = function(ctrl, child, scp, operation, updateIndex, event, isInlineEditBlock) {
            var isElementAdded = {},
                leng, addObj, modalTemplate, modalTemplateHtmlStr, templateURL;

            event.preventDefault();
            event.stopPropagation();

            if(operation === 'edit' && !ctrl.propSetMap.allowEdit) {
                $window.alert(customLabels.OmnieditNotAllowedAlert);
                return;
            }

            templateURL =  (isInlineEditBlock && !bpService.isMobileBrowser) ? 'vlcEditBlockInlineChildrenView.html' : 'vlcEditBlockModal.html';

            if(operation === 'new') {
                modalTempalte = child.eleArray[0].propSetMap.modalTemplate?child.eleArray[0].propSetMap.modalTemplate: templateURL;
            }
            else {
                modalTempalte = ctrl.propSetMap.modalTemplate?ctrl.propSetMap.modalTemplate: templateURL;
            }


            if (!isInlineEditBlock  && 'parentIFrame' in window) {
                modalTemplateHtmlStr = $templateCache.get(modalTempalte);
                if(modalTemplateHtmlStr.indexOf('vlc-slds-edit-block--modal_bottom') !== -1) {
                    modalTemplateHtmlStr = modalTemplateHtmlStr.replace('vlc-slds-edit-block--modal_bottom','');
                    $templateCache.put(modalTempalte, modalTemplateHtmlStr);
                    $compile($templateCache);
                }
            }

            if(!ctrl) {
                leng = child.eleArray.length-1;
                if(child.eleArray[leng].childrenC) {
                   child.eleArray[leng].children = angular.copy(child.eleArray[leng].childrenC);
                   child.eleArray[leng].index = 0;
                   ctrl = child.eleArray[leng];
                   isElementAdded.index = leng;
                   delete child.eleArray[leng].childrenC;

                } else {
                    addObj = angular.copy(child.eleArray[leng]);
                    addObj.index = leng+1;
                    scp.nullifyResponse(addObj);
                    child.eleArray.push(addObj);
                    ctrl = child.eleArray[leng+1];
                    isElementAdded.index = leng+1;
                }
                if(!angular.isArray(child.response)) {
                    var temp = angular.copy(child.response);
                    child.response = [];
                    child.response.push(temp);
                } else
                    child.response.push(ctrl.response);
                isElementAdded.added = true;
                isElementAdded.child = child;
            } if(/edit$/.test(operation)) {
                isElementAdded.index = updateIndex;
            }

            ctrl.propSetMap.isNewInlineBlock = (operation === 'new') ? true : false;

            var mdlInstance, sldsModalInstance;
            sldsModalInstance =  (isInlineEditBlock && !bpService.isMobileBrowser) ? $inlineEditBlockCont : $modal;

            mdlInstance = sldsModalInstance.open({
                templateUrl: modalTempalte,
                controller: 'ModalEditBlockCtrl',
                size: 'lg',
                backdrop: 'static',
                keyboard:false,
                scope: $scope,
                show: true,
                vlocSlide: true,
                resolve: {
                    mElementScp: function () {
                        return scp;
                    },
                    mControl: function () {
                        return ctrl;
                    },
                    mIsElementAdded: function () {
                        return isElementAdded;
                    },
                    mOperation: function () {
                        return operation;
                    }
                }
            });

            mdlInstance = null;
        }

        $scope.removeItemEditBlock = function(control, index, scp, addedElement, parentScp) {

            if(!parentScp)
                parentScp = scp.$parent;

            if(!addedElement && control.eleArray[0].propSetMap.delAction) {
                confirm(customLabels.OmniEditBlockDeleteConfirmation).then(function(success){
                    if(success) {
                        var actionCtrl = control.eleArray[0].propSetMap.delAction,
                            payload = {};
                        scp.editBlockIndex = index;

                        payload = control.eleArray[index].response;

                        if(actionCtrl){
                            if(angular.equals(actionCtrl.type, 'Remote Action') &&
                                angular.equals(actionCtrl.propSetMap.remoteClass, "DefaultOmniScriptEditBlock")) {
                                actionCtrl.propSetMap.remoteOptions.sobjectMapping = control.eleArray[index].propSetMap.sobjectMapping;
                                actionCtrl.propSetMap.remoteOptions.selectSobject = control.eleArray[index].propSetMap.selectSobject;
                            }
                            $scope.buttonClick(payload, actionCtrl, scp, null, 'vlcEBOperation', null, function(result) {
                                if(result)
                                    $scope.deleteRecordFromDom(control, index, scp, parentScp);
                            });
                        } else {
                            $scope.deleteRecordFromDom(control, index, scp, parentScp);
                        }
                    }
                });
            } else {
                if(!(scp.isElementAdded && scp.isElementAdded.added)) {
                    confirm(customLabels.OmniEditBlockDeleteConfirmation).then(function(success){
                        if(success)
                            $scope.deleteRecordFromDom(control, index, scp, parentScp);
                    });
                } else
                    $scope.deleteRecordFromDom(control, index, scp, parentScp);
            }

        }

        $scope.deleteRecordFromDom = function(control, index, scp, parentScp) {
            var scope = scp, i;
            if(index === 0 && control.eleArray.length === 1) {
                scp.nullifyResponse(control.eleArray[0]);
                control.eleArray[0].childrenC = angular.copy(control.eleArray[0].children);
                control.eleArray[0].children = [];
                control.eleArray[0].response = null;
                control.response = null;
                scp.children = [];
            }
            else {
                control.eleArray.splice(index, 1);
                control.response.splice(index, 1);
                for(i=index; i<control.eleArray.length; i++){
                    control.eleArray[i].index = control.eleArray[i].index-1;
                    for(var j=0; j<control.eleArray[i].children.length; j++) {
                        if(control.eleArray[i].children[j].eleArray[0].type === 'Type Ahead Block'){
                            control.eleArray[i].children[j].blockIndex = control.eleArray[i].index;
                            control.eleArray[i].children[j].eleArray[0].blockIndex = control.eleArray[i].index;
                            control.eleArray[i].children[j].eleArray[0].children[0].eleArray[0].blockIndex = control.eleArray[i].index;
                        }
                    }
                }
            }
            if(parentScp)
                scope = parentScp;
            scp.aggregate(scope, scp.control.index, scp.control.indexInParent, true, -1);
            if(!scp.previewMode && !scp.$$phase)
                scp.$apply();
        }

        $scope.showDefaultEditBlockImage = function(control) {
            var i=0;
            if(control.propSetMap.elementName) {
                for(i=0; i<control.propSetMap.valueSvgMap.length; i++){
                    if(control.response && (control.propSetMap.valueSvgMap[i].value == control.response[control.propSetMap.elementName])) {
                        return false;
                        break;
                    }
                }
                return true;
            } else {
                return true;
            }
        }

        $scope.onClickEditBlockRecord = function(control, ind, evt, set, currIndex) {
            if(ind >=0 && !evt.target.type) {
                control.children[ind].eleArray[0].response = !control.children[ind].eleArray[0].response;

                // if only allow to select one
                if(control.propSetMap.selectMode === 'Single' && control.children[ind].eleArray[0].response === true) {
                    for(var i=0; i<set.length; i++) {
                        if(i !== currIndex) {
                            set[i].children[ind].eleArray[0].response = false;
                        }
                    }
                }
            }

            if(evt.target.type && evt.target.className.indexOf('vlc-slds-time-picker') > 0) {
                $('.clockpicker-popover').hide();
            }

            evt.stopPropagation();
            // prevent scroll from space or enter
            evt.preventDefault();
        }

        $scope.isEditBlockRecordInvalid = function(ind, scp) {
            return scp['vlcEditBlockFormMain_'+ind].$invalid;
        }

        /**
         * [initEditBlockControlLimit will set limit of element which need to show to user]
         * @param  {[Object]} control [editBlock obj]
         * @param  {[Number]} limit   [Element limit(Number of element) need to show in view]
         * @return {[type]}         [None]
         */
        $scope.initEditBlockControlLimit = function(control, limit, maxLimitCountObj) {
            var userViewLimit = 0, controlRef = {children: null, maxDispCount: 0};
            if(control['childrenC'] === undefined) {
                controlRef.children = control.children;
            }else {
                controlRef.children = control.childrenC;
            }

            $scope.notDispOnTmltObj = NotSupportedElmService.getList();

            for(var count=0; count<controlRef.children.length; count++) {
                var isSprtedInBaseTmp = !$scope.notDispOnTmltObj.hasOwnProperty(controlRef.children[count].eleArray[0].type);   // does this element support to display in base element?
                var isDisOnTpltPropTrue = (controlRef.children[count].eleArray[0].propSetMap.disOnTplt===undefined || controlRef.children[count].eleArray[0].propSetMap.disOnTplt)  //check condition for backword compatiblity is not exist this props or disOnTplt is true

                if(isSprtedInBaseTmp && isDisOnTpltPropTrue && userViewLimit < limit) {
                    controlRef.children[count].displayInView = true;
                    controlRef.children[count].displayInViewIndex = userViewLimit;
                    userViewLimit++;
                } else {
                    controlRef.children[count].displayInView = false;
                }
            }
            if(!!maxLimitCountObj)
                maxLimitCountObj.maxDispCount = userViewLimit;
        }

        $scope.editBlockDisplayValue = function(control, scp) {
            var val, type = control.eleArray[0].type;
                switch(type) {
                    case 'Multi-select':
                              val = bpService.handleSelect(type, control.eleArray[0].response, true);
                              break;
                    case 'Radio':
                              val = control.eleArray[0].propSetMap.options.find(function(opt){return opt.name == control.eleArray[0].response});
                              if(val)
                                  val = val.value;
                              break;
                    case 'Block':
                             val = control.eleArray[0].response;
                             break;
                    case 'Date/Time (Local)':
                             if (angular.isString(scp.editblockform.loopform.loopname.$viewValue)){
                                 if (scp.editblockform.loopform.timectrl !== undefined && typeof scp.editblockform.loopform.timectrl.$viewValue == "string"){
                                     val = scp.editblockform.loopform.loopname.$viewValue + " " + scp.editblockform.loopform.timectrl.$viewValue;
                                     break;
                                 }
                             }
                    case 'Number':
                        if(isNaN(scp.editblockform.loopform.loopname.$viewValue))
                            val = null;
                        else
                            val = scp.editblockform.loopform.loopname.$viewValue;
                        break;
                    default:
                            if(scp.editblockform && scp.editblockform.loopform && scp.editblockform.loopform.loopname
                                && (scp.editblockform.loopform.loopname.$viewValue !== null && scp.editblockform.loopform.loopname.$viewValue !== undefined)) {
                                val = scp.editblockform.loopform.loopname.$viewValue.value || scp.editblockform.loopform.loopname.$viewValue;
                            }
                }
                return val;
        }

        $scope.calculateSumElememt = function(control, scp) {
            if(control.propSetMap.sumElement) {
                var tempEle = document.getElementById(control.propSetMap.sumElement);
                if($(tempEle).length != 0) {
                    scp.curSymbolFS = $(tempEle).parents('.vlc-slds-formula').find('.vlc-slds-currency-symbol').text();
                    $scope.$watch(function () {
                           return tempEle.value;
                        }, function(val) {
                           scp.set.sumControlValue = val;
                        }
                    );
                }
            }
        }

        // Newport step chart progress bar width calculation
        $scope.calculateProgressWidth = function() {
            if($('.nds-progress__list').find('.nds-progress__visited').length>0)
                return $('.nds-progress__list').find('.nds-progress__visited').last().position().left;
        }

        // recalculates progress bar width for when show/hide state changes in newport step chart's steps
        $scope.recalculateProgressWidth = function () {
            var progressBarComp = $('.nds-progress-bar').find('.nds-progress-bar__value');
            var progressBarCompWidthCss = progressBarComp.css('width');

            if (progressBarCompWidthCss) {
                setTimeout(function () {
                    progressBarComp.css('width', $scope.calculateProgressWidth());
                }, 50);
            }

            // always true so that ng-if for each step in step chart can be evaluated
            return true;
        }

        // Newport step progress width calculation for mobile
        $scope.calculateProgressWidthMobile = function() {
            var stepIndexArray = [];
            var indexOfActive = -1;
            var steps = this.bpTree.children.filter(function(child, index) {
                if(child.type === 'Step') {
                    if (child.bAccordionActive === true) {
                        stepIndexArray.push(1)
                    }else {
                        stepIndexArray.push(0)
                    }
                }

                return child.type === 'Step';
            });

            for(var count=0; count<stepIndexArray.length; count++) {
                if(stepIndexArray[count] === 1) {
                    return (100 * count / (steps.length - 1)) + '%';
                }
            }
        }

        //--- Initialize Scope Variables ---
        /// instanceHost is only used to serve Images and Documents
        // VOUINS.initiateForce($scope, force);
        // moved to base controller

        $rootScope.loading = false;
        $rootScope.loadingMessage = '';
        baseCtrl.prototype.$scope = $scope;
        var location = $location.path();

        // SFDC1 check
        $rootScope.isSforce = ( (typeof sforce != 'undefined') && (sforce != null) )?(true):(false);
        $rootScope.sforce = (typeof sforce != 'undefined')?sforce:null;
        $rootScope.isInConsole = bpService.isInConsole;
        $rootScope.isPreviewEmbedded = !!/previewEmbedded=true/.test($location.absUrl());
        var temptabKey = /tabKey=([^\&\#]*)/.exec($location.absUrl());
        if(temptabKey && angular.isArray(temptabKey) && temptabKey.length > 1) {
            $rootScope.tabKey = temptabKey[1];
            var testContextId = /testContextId=([^\&\#]*)/.exec($location.absUrl());
            if (testContextId && angular.isArray(testContextId) && testContextId.length > 1) {
                $rootScope.testContextId = testContextId[1];
            }
            sessionStorage.clear();
        }
        $scope.previewMode = ouiBaseService.previewMode;
        $scope.debugInformation = bpService.debugInformation;
        $scope.nsPrefix = bpService.sNS;
        // namespace prefix from the Apex controller
        if($scope.nsPrefix !== undefined && $scope.nsPrefix !== null && $scope.nsPrefix !== '')
            $scope.nsPrefix += '__';
        $scope.drInvokeResult = {};
        $scope.savedKnowKeyword = '';
        $rootScope.bInitialize = false;

        // v12 - support another url pattern for launching the OmniScript
        // the user should either use angular routing params (the current way, easy to decouple OS from VFP)
        // or use url parameters
        var queryParams = VOUINS.getQueryParams();
        ouiBaseService.LanguageCode = queryParams.LanguageCode;

        if(Object.getOwnPropertyNames($routeParams).length > 0)
        {
            // routing parameters
            var bNew = $routeParams.bNew;

            if(bNew && bNew.length >= 1)
            {
                if(bNew.charAt(bNew.length-1) === '?')
                    bNew = bNew.substring(0, bNew.length - 1);
            }

            // launching the script using the id - for preview and resume mode
            if(location.indexOf('/OS') === 0)
            {
                var sId = $routeParams.OSId;
                var osState = $routeParams.osState;
                $scope.getbVertParam($routeParams.bVert);

                $scope.runScriptById(sId, osState, bNew, false, ouiBaseService.LanguageCode);
            }

            // launching the script in production - Type, Sub Type and Lang
            else if(location.indexOf('/OmniScriptType') === 0)
            {
                var bVert = $scope.getbVertParam($routeParams.bVert);
                if(bNew !== 'false')
                    $scope.runActiveScript($routeParams.OSType, $routeParams.OSSubType, $routeParams.OSLangCode,
                                           $routeParams.parentObjectId, $routeParams.pfBundleName, false, bNew, ouiBaseService.LanguageCode);
            }

            // the script navigates from the redirect page back to the main flow
            if(bNew === "false")
            {
                $scope.getbVertParam($routeParams.bVert);
                var redirect = $routeParams.redirect;
                var navDir = $routeParams.navDir;
                if(redirect && redirect.length >= 1)
                {
                    if(redirect.charAt(redirect.length-1) === '?')
                        redirect = redirect.substring(0, redirect.length - 1);
                }

                if(navDir && navDir.length >= 1)
                {
                    if(navDir.charAt(navDir.length-1) === '?')
                        navDir = navDir.substring(0, navDir.length - 1);
                }

                $scope.bpTree = bpService.restResponse[redirect];
                var isReview = true;
                // redirect case
                if($scope.bpTree.bpTree)
                {
                    $scope.bpTree = $scope.bpTree.bpTree;
                    isReview = false;
                }

                if($scope.bpTree && $scope.bpTree.children)
                {
                    $scope.children = $scope.bpTree.children;
                    $scope.child = { children: $scope.children };
                    if($scope.bpTree.reviewAction || $scope.bpTree.redirectAction)
                    {
                        var eleIndex;
                        if(isReview && $scope.bpTree.reviewAction)
                        {
                            eleIndex = $scope.bpTree.reviewAction.indexInParent;
                            delete $scope.bpTree.reviewAction;
                        }
                        if(!isReview && $scope.bpTree.redirectAction)
                        {
                            eleIndex = $scope.bpTree.redirectAction.indexInParent;
                            delete $scope.bpTree.redirectAction;
                        }

                        // eleIndex, redirect, navDir for Go Back for Review Action
                        if(eleIndex !== undefined && eleIndex !== null && eleIndex >=0 && eleIndex < $scope.bpTree.children.length)
                        {
                            var currEle = $scope.bpTree.children[eleIndex];
                            if(navDir === 'previous')
                            {
                                var prevIndex = $scope.findPreShowStep(eleIndex);

                                if(prevIndex !== undefined && prevIndex !== null)
                                {
                                    bpService.fakeAsync().then(function(ret)
                                    {
                                        $scope.activateStep($scope.bpTree.children[prevIndex], true, null);
                                    });

                                    $scope.bpTree.asIndex = prevIndex;
                                }
                            }
                            else if(navDir === 'next')
                            {
                                if(currEle && currEle.nextIndex !== undefined && currEle.nextIndex !== null)
                                {
                                    var nextIndex = currEle.nextIndex;
                                    $scope.nextRepeater(nextIndex, eleIndex);
                                }
                            }
                        }
                    }
                    if(($scope.bpTree.reviewActionBtn || $scope.bpTree.redirectActionBtn)  && $scope.bpTree.parentStepIndex !== undefined && $scope.bpTree.parentStepIndex !== null)
                    {
                        var parentIndex = $scope.bpTree.parentStepIndex;
                        bpService.fakeAsync().then(function(ret)
                        {
                            $scope.activateStep($scope.bpTree.children[parentIndex], true, null);
                        });

                        $scope.bpTree.asIndex = $scope.bpTree.parentStepIndex;
                        delete $scope.bpTree.reviewActionBtn;
                        delete $scope.bpTree.redirectActionBtn;
                        delete $scope.bpTree.parentStepIndex;
                    }
                }
            }
        }

        // default launch mode - /apex/VFPage
        // and no URL paramers
        if(location === '/')
        {
            var pattern;
            if(queryParams)
            {
                var bLoaded = (queryParams.loadWithPage === 'false')?(false):(true);
                if(window.OmniOut)
                	bLoaded = false;

                // pattern one: OmniScriptType=xxx&OmniScriptSubType=yyy&OmniScriptLang=zzz&scriptMode=horizontal
                if(queryParams.hasOwnProperty('OmniScriptType') && queryParams.hasOwnProperty('OmniScriptSubType') &&
                   queryParams.hasOwnProperty('OmniScriptLang')) {
                    bpService.urlMode = true;
                    pattern = 1;
                }
                // pattern two: OmniScriptInstanceId=xxx&scriptMode=horizontal
                else if(queryParams.hasOwnProperty('OmniScriptInstanceId')) {
                    bpService.urlMode = true;
                    pattern = 2;
                }
                // pattern three: OmniScriptId=xxx&scriptMode=horizontal
                else if(queryParams.hasOwnProperty('OmniScriptId')) {
                    bpService.urlMode = true;
                    pattern = 3;
                }
                // pattern three: OmniScriptApplicationId=xxx&scriptMode=horizontal
                else if(queryParams.hasOwnProperty('OmniScriptApplicationId')) {
                    bpService.urlMode = true;
                    pattern = 4;
                }
            }

            if(bpService.urlMode)
            {
                var mode = (queryParams.scriptMode === undefined)?(''):(queryParams.scriptMode);
                var bVert = 'true';
                if(mode === 'horizontal')
                    bVert = 'false';
                $scope.getbVertParam(bVert);

                switch(pattern)
                {
                    case 1:
                        $scope.runActiveScript(queryParams.OmniScriptType, queryParams.OmniScriptSubType, queryParams.OmniScriptLang,
                                               queryParams.ContextId, queryParams.PrefillDataRaptorBundle, bLoaded, "true", ouiBaseService.LanguageCode);
                        break;
                    case 2:
                        $scope.runScriptById(queryParams.OmniScriptInstanceId, 'saveAndResume', 'true', bLoaded, ouiBaseService.LanguageCode);
                        break;
                    case 3:
                        ouiBaseService.previewMode = false;
                        $scope.runScriptById(queryParams.OmniScriptId, 'new', 'true', bLoaded, ouiBaseService.LanguageCode);
                        break;
                    case 4:
                        $scope.runScriptById(queryParams.OmniScriptApplicationId, 'review', 'true', bLoaded, ouiBaseService.LanguageCode);
                        break;
                }
            }
            else
            {
                var osState = (bpService.resumeMode)?('review'):('new');
                if(!$rootScope.tabKey && !ouiBaseService.previewMode) {
                    bpService.urlMode = true;
                    $scope.getbVertParam(bpService.verticalMode);
                }
                var sId = (bpService.resumeMode)?(bpService.appId):(bpService.bpId);
                if(bpService.sflMode) {
                    sId = bpService.instanceId;
                    osState = 'saveAndResume';
                }
                if(sId)
                {
                    if($rootScope.tabKey || ouiBaseService.previewMode)
                        $location.path('/OS/' + sId + '/scriptState/' + bpService.scriptState + '/' + bpService.verticalMode + '/true');
                    else
                        $scope.runScriptById(sId, osState, 'true', false, ouiBaseService.LanguageCode);
                }
                else if(bpService.bpType && bpService.bpSubType && bpService.bpLang)
                {
                    if($rootScope.tabKey || ouiBaseService.previewMode)
                        $location.path('/OmniScriptType/' + bpService.bpType + '/OmniScriptSubType/' + bpService.bpSubType + '/OmniScriptLang/'
                                       + bpService.bpLang + '/ContextId/' + bpService.parentObjectId + '/PrefillDataRaptorBundle/' + bpService.pfDRBundle + '/' + bpService.verticalMode + '/true');
                    else
                        $scope.runActiveScript(bpService.bpType, bpService.bpSubType, bpService.bpLang,
                                               bpService.parentObjectId, bpService.pfDRBundle, false, "true", ouiBaseService.LanguageCode);
                }
            }
        }
    };


    //this is for custom js wiring from the OS designer - OMNI-2049
    window.baseCtrl = baseCtrl;


    // prototype method example, user can extend the controller using this
    // function to handle adding a repeated Element
    // for now, add is always add after
    // @param
    // scp - element scope
    // control - Element
    // index - index to insert the repeated Element
    baseCtrl.prototype.addItem = function(scp, control, index)
    {
        if(control.eleArray[0].propSetMap.repeatLimit !== undefined && control.eleArray[0].propSetMap.repeatLimit !== null
           && control.eleArray[0].propSetMap.repeatLimit.constructor === Number && control.eleArray[0].propSetMap.repeatLimit+1 <= control.eleArray.length) {
            return;
        }

        var newItem = angular.copy(control.eleArray[index]);
        nullifySrvErr(newItem);
        if(newItem.propSetMap && newItem.propSetMap.repeatClone !== true)
            scp.nullifyResponse(newItem);
        newItem.index = index+1;
        control.eleArray.splice(index+1, 0, newItem);
        for(var i=index+2; i<control.eleArray.length; i++)
            control.eleArray[i].index = control.eleArray[i].index+1;
        if((control.eleArray[0].type === 'Block') && scp.$parent && scp.$parent.$parent) {
            var parentNode = (sfdcVars.layout === 'lightning' || sfdcVars.layout === 'newport')?scp.$parent.$parent.$parent:scp.$parent.$parent;
            if(parentNode)
                scp.aggregate(parentNode, control.index, control.indexInParent, false, index);
        }
        else
            scp.aggregate(scp, control.index, control.indexInParent, false, index);
    };

    // customized method to be passed into ButtonClick or RemoteCallInvoke
    // an example of the customizer
    // @param
    // operation - 'Delete', 'Add', etc.
    // selectItem - item selected on Selectable Items list
    // bSuccess - remote call comes back as successful or not
    baseCtrl.prototype.customHandleSelectedItem = function(operation, selectedItem, bSuccess)
    {
        if(selectedItem === undefined || selectedItem === null)
            return;
        if(operation === 'Add')
        {
            if(bSuccess)
                selectedItem.added = true;
            else
                selectedItem.added = false;
        }

        if(operation === 'Remove')
        {
            if(bSuccess)
                selectedItem.added = false;
            else
                selectedItem.added = true;
        }
    };

    // OmniScript main controller
    var contrlBP = bpModule.controller('ctrlBusinessProcess', baseCtrl);

    // extended controller to handle redirect
    function customRedirectCtrl($scope, $sce, $window, $location, $route, $routeParams, $http, $compile, bpService, ouiBaseService, jsonTreeConfig, $templateCache, $sanitize, $timeout, $rootScope, $modal, $q, $injector, force, NotSupportedElmService, currencySymbol)
    {
        // inherit from the main controller
        customRedirectCtrl.prototype.$scope = $scope;
        baseCtrl.call(this, $scope, $sce, $window, $location, $route, $routeParams, $http, $compile, bpService, ouiBaseService, jsonTreeConfig, $templateCache, $sanitize, $timeout, $rootScope, $modal, $q, $injector, force);
        var pageName = $routeParams.pageName;
        var isReview = $routeParams.bReview;
        jsonTreeConfig.templateUrl = bpService.jsonTreeHTMLTmpl;

        var templateUrl = '';
        if(pageName)
        {
            templateUrl = bpService.redirectPageTemplateMap[pageName];
            if(isReview === 'review')
                $scope.bpTree = bpService.restResponse[pageName];
            else
            {
                if(bpService.restResponse[pageName].bpTree)
                {
                    $scope.bpTree = bpService.restResponse[pageName].bpTree;
                    $scope.response = bpService.restResponse[pageName].response;
                }
                else
                    $scope.bpTree = bpService.restResponse[pageName];
            }
            $scope.children = $scope.bpTree.children;
            $scope.child = { children: $scope.children };
            $scope.bpW = bpService.bpW;
        }

        if(templateUrl)
        {
            $route.current.templateUrl = templateUrl;

            $rootScope.loading = true;
            $rootScope.loadingMessage = '';
            $timeout(function() {
                var html = $scope.loadHTMLTemplate(isReview, templateUrl);
                $('#VlocityBPView').html($compile(html)($scope));
                $rootScope.loading = false;
            }, 0);
        }

        // function to handle loading HTML template in redirect mode
        // @param
        // isReview - Review Action or not
        // templateUrl - HTML template
        $scope.loadHTMLTemplate = function(isReview, templateUrl)
        {
            var html = '';
            if(bpService.verticalMode === false && templateUrl !== 'vlcMobileConfirmation.html' && templateUrl !== 'vlcMobileReview.html' && templateUrl !== 'vlcMobileSaveForLater.html' && templateUrl !== 'vlcMobileCartSummary.html')
            {
                html += $templateCache.get(bpService.elementTypeToHTMLMap['SideBar']);
            }

            // main container
            if (bpService.layout === 'lightning' || bpService.layout === 'newport'){
                html += '<div class="slds-box" style="border:none">';
            }else{
                html += '<div class="v-col-md-{{bpW}}">';
            }
            var tempHTML = $templateCache.get(templateUrl);
            // pdf case
            if($scope.response && $scope.response.vlcAttachmentBody)
                tempHTML = tempHTML.replace('{{response.attachmentUrl}}', $scope.response.attachmentUrl);
            html += tempHTML;
            if($scope.bpTree)
            {
                if(isReview !== 'review')
                {
                    if($scope.bpTree.redirectAction)
                        html += $templateCache.get(bpService.elementTypeToHTMLMap['Redirect Action Footer']);
                    if($scope.bpTree.redirectActionBtn)
                        html += $templateCache.get(bpService.elementTypeToHTMLMap['Redirect Action Button Footer']);
                }
                else
                {
                    if($scope.bpTree.reviewAction)
                        html += $templateCache.get(bpService.elementTypeToHTMLMap['Review Action Footer']);
                    if($scope.bpTree.reviewActionBtn)
                        html += $templateCache.get(bpService.elementTypeToHTMLMap['Review Action Button Footer']);
                }
            }
            html += '</div>';

            return html;
        }
    };

    // customRedirectCtrl derives from BaseCtrl
    customRedirectCtrl.prototype = Object.create(baseCtrl.prototype);

    // OMNI-2642 and OMNI-2636 define customRedirectCtrl globally
    // note: when referring to redirect controller always use redirectCtrl
    window.customRedirectCtrl = customRedirectCtrl;

    // customRedirectCtrl can have prototype method as well
    //customRedirectCtrl.prototype.TEST = function(...)
    //{
    //    ...
    //};

    bpModule.controller('ctrlRedirect', customRedirectCtrl);

    bpModule.controller('ModalInstanceCtrl', function ($scope, content)
    {
        $scope.content = content;
        $scope.step = content;

        $scope.cancel = function()
        {
            $scope.$dismiss('cancel');
        };
    });

    baseCtrl.prototype.customIsConfigurable = function(product)
    {
        return product.isConfigurable;
    };

    // 4.0 CPQ guided selling, need to massage the data using JS, this is an OOTB example
    //################################Section Start##############################
    // Creating cart Hierarchy Structure
    // This section creates cart hierarchy structure
    // logic has been borrowed from CMT but function name
    // and implementation has been changed as per Omni Cart
    // ToDo: move this logic to CMT API side

    baseCtrl.prototype.createCartHierarchy = function(data){
        var cartItemsNew = [],
            prevIdx = 0,
            children = 'cartItems';
        angular.forEach(data.cartItems, function(item, index){
            if (item.indent === 0 && index > 0) {
                var tempItemList = data.cartItems.slice(prevIdx, index);
                var tempItemHierarchy = baseCtrl.prototype.prepareCartHierarchy(tempItemList, children);
                cartItemsNew.push(tempItemHierarchy[0]);
                prevIdx = index;
            }
        });
        if (prevIdx < data.cartItems.length) {
            var tempItemList = data.cartItems.slice(prevIdx, data.cartItems.length);
            var tempItemHierarchy = baseCtrl.prototype.prepareCartHierarchy(tempItemList, children);
            cartItemsNew.push(tempItemHierarchy[0]);
        }
        data.cartItems = cartItemsNew;
        return data;
    };

    baseCtrl.prototype.prepareCartHierarchy = function(cartList, children) {
        var cartHierarchy = [],
            rootItem = cartList[0],
            item,
            levels,
            len = cartList.length;

        rootItem.isRoot = true;
        rootItem.level = 1;

        if(rootItem.isExpanded === null || rootItem.isExpanded === undefined)
            rootItem.isExpanded = false;

        rootItem.hasConfigurableAttributes = baseCtrl.prototype.hasConfigurableAttributes(rootItem);

        for (var idx = 1; idx < len; idx++) {
            item = cartList[idx];
            levels = item.lineNumber.split('.');
            item.level = levels.length;
            item.hasConfigurableAttributes = baseCtrl.prototype.hasConfigurableAttributes(item);
            if (item.minQuantity !== undefined && item.minQuantity !== null && item.maxQuantity !== undefined && item.maxQuantity !== null && item.minQuantity === item.maxQuantity)
                item.quantity = item.minQuantity;
            if (item.quantity === undefined || item.quantity == null)
                item.quantity = item.defaultQuantity;
            if (item.minQuantity === undefined || item.minQuantity == null)
                item.minQuantity = 0;
            if (item.maxQuantity == null)
                item.maxQuantity = undefined;

            baseCtrl.prototype.setItemChildren(rootItem, levels.slice(1), item, children);
        }
        baseCtrl.prototype.filterCartHierarchy(rootItem, children);
        cartHierarchy.push(rootItem);

        return cartHierarchy;
    };

    /* Check the product has configurable attribute to show */
    baseCtrl.prototype.hasConfigurableAttributes = function(product) {
            var hasConfAttrs = false;
            if (!product.isAttrParsed && product.JSONAttribute) {
                product.JSONAttribute = JSON.parse(product.JSONAttribute);
                product.isAttrParsed = true;
            }
            if (!product.categoryMap) {
                product.categoryMap = {};
                for (var cat in product.JSONAttribute) {
                    var attrs = product.JSONAttribute[cat];
                    var attrCount = 0;
                    for (var i = 0; i < attrs.length; i++) {
                        baseCtrl.prototype.parseAttributes(attrs);

                        if (attrs[i].attributeconfigurable__c && attrs[i].isactive__c) {
                            attrCount++;
                            hasConfAttrs = true;
                            break;
                        }
                    }
                    if (attrs.length > 0) {
                        product.categoryMap[cat] = {name: attrs[0].categoryname__c, showCategory: (attrCount > 0)};
                    }
                }
            }
            return hasConfAttrs;
        };

    /* set the items children as part of building the tree hierarchy */
    baseCtrl.prototype.setItemChildren = function(rootItem, levels, p, children) {
        if (levels.length === 1) {
            if (rootItem[children] === undefined)
                rootItem[children] = [];

                rootItem[children][levels[0]-1] = p;
        } else {
            arguments.callee(rootItem[children][levels[0]-1], levels.slice(1), p, children);
        }
    };

    /* filter the tree hierarchy to remove undefined array elements */
    baseCtrl.prototype.filterCartHierarchy = function(rootItem, childNode) {
        if(!childNode)
            childNode = 'cartItems';
        if (rootItem[childNode]) {
            rootItem[childNode] = rootItem[childNode].filter(function(n) { return n !== undefined; });
            angular.forEach(rootItem[childNode], function(item) {
                baseCtrl.prototype.filterCartHierarchy(item, childNode);
            });
        }
    };

    baseCtrl.prototype.configureAttributes = function(product) {
        if (product.showAttrConfig === undefined || product.showAttrConfig === null) {
            if (!product.isAttrParsed) {
                product.JSONAttribute = JSON.parse(product.JSONAttribute);
                product.isAttrParsed = true;
            }
            for (var cat in product.JSONAttribute) {
                var attrs = product.JSONAttribute[cat];
                // parse the attributes
                baseCtrl.prototype.parseAttributes(attrs);
            }
        }
        product.showAttrConfig = !product.showAttrConfig;
    };

         /* parse the attributes */
    baseCtrl.prototype.parseAttributes = function(attrs) {
        angular.forEach(attrs, function(attr) {
            attr.Name = attr.attributedisplayname__c;
            attr.Code = attr.attributeuniquecode__c;
            attr.Filterable = attr.attributefilterable__c;
            attr.SegmentValue = '';
            var tempSegmentList = [];

            if (attr.attributeRunTimeInfo && attr.attributeRunTimeInfo.dataType) {
                if (attr.attributeRunTimeInfo.dataType === 'Text') {
                    // TEXT
                    if (attr.attributeRunTimeInfo.value === undefined) {
                        attr.attributeRunTimeInfo.value = attr.attributeRunTimeInfo.default;
                    }
                    attr.SegmentValue = attr.attributeRunTimeInfo.value;
                }
                if (attr.attributeRunTimeInfo.dataType === 'Number' || attr.attributeRunTimeInfo.dataType === 'Currency' || attr.attributeRunTimeInfo.dataType === 'Percent') {
                    // NUMBER, CURRENCY, PERCENT
                    if ((typeof attr.attributeRunTimeInfo.default) === 'string') {
                        // convert default to number, if string
                        attr.attributeRunTimeInfo.default = parseFloat(attr.attributeRunTimeInfo.default);
                    }

                    if (attr.attributeRunTimeInfo.value === undefined) {
                        attr.attributeRunTimeInfo.value = attr.attributeRunTimeInfo.default;
                    } else {
                        if ((typeof attr.attributeRunTimeInfo.value) === 'string') {
                            // convert value to number, if string
                            attr.attributeRunTimeInfo.value = parseFloat(attr.attributeRunTimeInfo.value);
                        }
                    }

                    attr.SegmentValue = attr.attributeRunTimeInfo.value + "";
                }
                if (attr.attributeRunTimeInfo.dataType === 'Date' || attr.attributeRunTimeInfo.dataType === 'Datetime') {
                    // DATE, DATETIME
                    if (attr.attributeRunTimeInfo.value === undefined) {
                        attr.attributeRunTimeInfo.value = attr.attributeRunTimeInfo.default;
                    }
                    var dateFormat = (attr.attributeRunTimeInfo.dataType === 'Date' ? 'shortDate' : 'short');
                    attr.SegmentValue = angular.injector(["ng"]).get("$filter")("date")(attr.attributeRunTimeInfo.value, dateFormat);
                }
                if (attr.attributeRunTimeInfo.dataType === 'Checkbox') {
                    // CHECKBOX
                    if (attr.attributeRunTimeInfo.value === undefined) {
                        attr.attributeRunTimeInfo.value = attr.attributeRunTimeInfo.default;
                    }
                    attr.SegmentValue = (attr.attributeRunTimeInfo.value ? 'Yes' : 'No');
                }
                if (attr.attributeRunTimeInfo.dataType === 'Picklist') {
                    // PICKLIST - RADIO BUTTON & DROPDOWN
                    var selectedId;
                    if (attr.attributeRunTimeInfo.selectedItem === undefined || attr.attributeRunTimeInfo.selectedItem === null) {
                        if (attr.attributeRunTimeInfo.default !== undefined && attr.attributeRunTimeInfo.default.length > 0)
                            selectedId = attr.attributeRunTimeInfo.default[0].id;
                    } else {
                        selectedId = attr.attributeRunTimeInfo.selectedItem.id;
                    }
                    angular.forEach(attr.attributeRunTimeInfo.values, function(value) {
                        if (value.id === selectedId) {
                            attr.attributeRunTimeInfo.selectedItem = value;
                        }
                        tempSegmentList.push(value.displayText);
                    });
                    attr.SegmentValue = tempSegmentList.join(',');
                }
                if (attr.attributeRunTimeInfo.dataType === 'Multi Picklist') {
                    // MULTI PICKLIST
                    angular.forEach(attr.attributeRunTimeInfo.values, function(value) {
                        tempSegmentList.push(value.displayText);
                    });
                    attr.SegmentValue = tempSegmentList.join(',');

                    if (attr.attributeRunTimeInfo.uiDisplayType === 'Checkbox') {
                        // CHECKBOX
                        angular.forEach(attr.attributeRunTimeInfo.values, function(value) {
                            if (value.checked === undefined) {
                                var found = attr.attributeRunTimeInfo.default.some(function (el) {
                                    return el.id === value.id;
                                });
                                value.checked = found;
                            }
                        });
                    }
                    if (attr.attributeRunTimeInfo.uiDisplayType === 'Dropdown') {
                         // DROPDOWN
                        if (attr.attributeRunTimeInfo.selectedItems === undefined) {
                            attr.attributeRunTimeInfo.selectedItems = [];
                            angular.forEach(attr.attributeRunTimeInfo.values, function(value) {
                                for (var i = 0; i < attr.attributeRunTimeInfo.default.length; i++) {
                                    if (value.id === attr.attributeRunTimeInfo.default[i].id) {
                                        attr.attributeRunTimeInfo.selectedItems.push(value);
                                        break;
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });
    };

    //addProductToCart function will be called from selectable items
    baseCtrl.prototype.addProductToCart = function(product, control, scp) {
        var className = control ? control.propSetMap.remoteClass : bpService.sNSC+'CpqAppHandler',
            methodName = control ? control.propSetMap.remoteMethod : 'postCartsItems',
            opt = {},
            timeout = control.propSetMap.remoteTimeout,
            inputParam = Object.keys(product.actions.addtocart.remote.params).length > 0 ? product.actions.addtocart.remote.params : (Object.keys(product.actions.addtocart.rest.params).length > 0 ? product.actions.addtocart.rest.params : null );

        if(!product.actions)
            return;

        var configObj = {sClassName:className,sMethodName:methodName,input:angular.toJson(inputParam),
                         options:angular.toJson(opt),iTimeout:timeout,label:{label:control && control.name}};
        scp.$root.loading = true;
        scp.bpService.OmniRemoteInvoke(configObj).then(
            function(result) {
                var configObjCart = {sClassName:className,sMethodName:'getCarts',input:angular.toJson(inputParam),
                         options:angular.toJson(opt),iTimeout:timeout,label:{label:(control && control.name)}};
                scp.bpService.OmniRemoteInvoke(configObjCart).then(
                    function(result) {
                        scp.$root.loading = false;
                        var resp = angular.fromJson(result);
                        scp.bpTree.response.vlcPersistentComponent[scp.bpTree.pcId[0]+'_Top'] = [resp];
                    },
                    function(error) {
                        scp.handleRemoteCallError(control, resp.error, true, false);
                    }
                );
                var resp = angular.fromJson(result);
                var hasError = false, errorMsg='';
                angular.forEach(resp.messages, function(message) {
                    if (message.severity === 'ERROR') {
                        hasError = true;
                        errorMsg = message.message;
                    }
                });

                if(hasError && !resp.records) {
                    scp.handleRemoteCallError(control, errorMsg, true, false);
                    return;
                }

                for(var i=0; i<resp.records.length; i++) {
                    if(scp.bpTree.response.vlcPersistentComponent[scp.bpTree.pcId[0]].records)
                        scp.bpTree.response.vlcPersistentComponent[scp.bpTree.pcId[0]].records.unshift(resp.records[i]);
                    else
                        scp.bpTree.response.vlcPersistentComponent[scp.bpTree.pcId[0]].records = resp.records;
                }
            },
            function(error) {
                scp.handleRemoteCallError(control, resp.error, true, false);
            }
        );
    }

    //loadMoreProducts function will be called from selectable items when pagination is set and has next records
    baseCtrl.prototype.loadMoreProducts = function(control, scp) {
        var className = control ? control.propSetMap.remoteClass : scp.bpService.sNSC+'CpqAppHandler',
            methodName = 'getCartsProducts',
            opt = {},
            timeout = control.propSetMap.remoteTimeout,
            inputParam = Object.keys(control.vlcSI[control.itemsKey][0].actions.nextproducts.remote.params).length > 0 ? control.vlcSI[control.itemsKey][0].actions.nextproducts.remote.params :
                         (Object.keys(control.vlcSI[control.itemsKey][0].actions.nextproducts.rest.params).length > 0 ? control.vlcSI[control.itemsKey][0].actions.nextproducts.rest.params : null );

        var configObj = {sClassName:className,sMethodName:methodName,input:angular.toJson(inputParam),
                         options:angular.toJson(opt),iTimeout:timeout,label:{label:control && control.name}};
        scp.$root.loading = true;
        scp.bpService.OmniRemoteInvoke(configObj).then(
            function(result) {
                scp.$root.loading = false;
                var resp = angular.fromJson(result);
                var hasError = false, errorMsg='';
                angular.forEach(resp.messages, function(message) {
                    if (message.severity === 'ERROR') {
                        hasError = true;
                        errorMsg = message.message;
                    }
                });
                if(!hasError) {
                    control.vlcSI[control.itemsKey][0].records.push.apply(control.vlcSI[control.itemsKey][0].records,resp.records);
                    control.vlcSI[control.itemsKey][0].actions = resp.actions;
                } else {
                    scp.handleRemoteCallError(control, errorMsg, true, false);
                }
            },
            function(error) {
                scp.$root.loading = false;
                scp.handleRemoteCallError(control, resp.error, true, false);
            }
        );
    }

    //loadMoreCartItems function will be called from cart when pagination is set and has next records
    baseCtrl.prototype.loadMoreCartItems = function(actions, scp) {
        var inputParam = Object.keys(actions.nextproducts.remote.params).length > 0 ? actions.nextproducts.remote.params : (Object.keys(actions.nextproducts.rest.params).length > 0 ? actions.nextproducts.rest.params : null ),
        configObj = {sClassName:scp.bpService.sNSC+'CpqAppHandler',sMethodName:'getCartsItems',input:angular.toJson(inputParam),
                         options:angular.toJson({}),iTimeout:null,label:null};
        scp.$root.loading = true;
        scp.bpService.OmniRemoteInvoke(configObj).then(
            function(result) {
                scp.$root.loading = false;
                var resp = angular.fromJson(result);
                var hasError = false, errorMsg='';
                angular.forEach(resp.messages, function(message) {
                    if (message.severity === 'ERROR') {
                        hasError = true;
                        errorMsg = message.message;
                    }
                });
                if(!hasError) {
                    scp.bpTree.response.vlcPersistentComponent[scp.bpTree.pcId[0]].records.push.apply(scp.bpTree.response.vlcPersistentComponent[scp.bpTree.pcId[0]].records,resp.records);
                    scp.bpTree.response.vlcPersistentComponent[scp.bpTree.pcId[0]].actions = resp.actions;
                } else {
                    scp.handleRemoteCallError(control, errorMsg, true, false);
                }
            },
            function(error) {
                scp.$root.loading = false;
                scp.handleRemoteCallError(null, resp.error, true, false);
            }
        );
    }

    //################################Product Configuration Section Start##############################
    // 4.0 CPQ guided selling, need to massage the data using JS, this is an OOTB example
    // This control is used in Product Configuration Modal
    bpModule.controller('ModalProductCtrl', function ($scope, $rootScope, $window, $timeout, bpService, mSelectedItem, mScp, mPayload, mControl, mOperation, mpcIndex) {
        //SFDC Labels Starts
        $scope.OmniConfigProdModalHeader = customLabels.OmniConfigProdModalHeader;
        $scope.OmniConfigProdName = customLabels.OmniConfigProdName;
        $scope.OmniConfigProdQTY = customLabels.OmniConfigProdQTY;
        $scope.OmniConfigProdModalOk = customLabels.OmniConfigProdModalOk;
        $scope.OmniConfigProdModalCancel = customLabels.OmniConfigProdModalCancel;
        $scope.OmniConfigProdQtyError0 = customLabels.OmniConfigProdQtyError0;
        $scope.OmniConfigProdQtyError = customLabels.OmniConfigProdQtyError;
        $scope.OmniConfigProdQtyErrorAnd = customLabels.OmniConfigProdQtyErrorAnd;
        $scope.OmniConfigProdQtyError1 = customLabels.OmniConfigProdQtyError1;
        $scope.OmniConfigProdQueryError = customLabels.OmniConfigProdQueryError;
        $scope.OmniConfigProdRequired = customLabels.OmniConfigProdRequired;
        //SFDC Labels Ends

        $scope.contentSelectedItem = mSelectedItem;
        $scope.contentScp = mScp;
        $scope.contentResp = mPayload;
        $scope.contentCtrl = mControl;
        $scope.contentBpService = bpService;
        $scope.mOperation = mOperation;
        $scope.pcIndex = mpcIndex;

        $scope.cancel = function()
        {
            $scope.$dismiss('cancel');
        };
        $scope.ok = function()
        {
            var list = $scope.createProductList($scope.content);

            if($scope.contentResp.propSetMap && $scope.contentResp.propSetMap.persistentComponent){
                var option={};
                option.vlcSelectedItem = list;

                mScp.remoteCallInvoke($scope.contentResp, null, true, null, $scope.contentScp, option.vlcSelectedItem, 'saveProductsPostConfig', null, null, null, $scope.pcIndex);
            }else{
                mScp.buttonClick($scope.contentResp, $scope.contentCtrl, $scope.contentScp, list, 'Add');
            }

            $scope.$dismiss('cancel');
        };

        $scope.initProductModal = function(){
            var sClassName,
                sMethodName,
                option = {},
                payload = $scope.contentResp,
                cfgProducts;

            if($scope.contentCtrl && $scope.contentCtrl.propSetMap.modalConfigurationSetting){
                sClassName = $scope.contentCtrl.propSetMap.remoteClass;
                sMethodName = $scope.contentCtrl.propSetMap.remoteMethod;
            }
            // persistent component
            else if($scope.contentResp.propSetMap.persistentComponent && $scope.contentResp.propSetMap.persistentComponent[$scope.pcIndex]
                 && $scope.contentResp.propSetMap.persistentComponent[$scope.pcIndex].modalConfigurationSetting)
            {
                sClassName = $scope.contentResp.propSetMap.persistentComponent[$scope.pcIndex].remoteClass;
                sMethodName = $scope.contentResp.propSetMap.persistentComponent[$scope.pcIndex].remoteMethod;
                payload = $scope.contentResp.response;

                //this is for the debug console log
                var persistComponentId = $scope.contentResp.propSetMap.persistentComponent[$scope.pcIndex].id;

           }

            option.vlcSelectedItem = $scope.contentSelectedItem;
            option.vlcOperation=$scope.mOperation;


            if($scope.contentResp.propSetMap && $scope.contentResp.propSetMap.persistentComponent){
                sClassName = $scope.contentResp.propSetMap.persistentComponent[$scope.pcIndex].remoteClass;
                sMethodName = $scope.contentResp.propSetMap.persistentComponent[$scope.pcIndex].remoteMethod;
                payload = $scope.contentResp.response;
            }

            var configObj = {sClassName:sClassName,sMethodName:sMethodName,input:angular.toJson(payload),
                             options:angular.toJson(option),iTimeout:null,label:{label: ($scope.contentCtrl && $scope.contentCtrl.name) || persistComponentId }};
            $scope.contentBpService.OmniRemoteInvoke(configObj).then(function(result, event) {
                var resp = angular.fromJson(result);
                $timeout(function() {
                    if (resp.error !== 'OK' || !resp.productTree) {
                        $rootScope.loading = false;
                        $scope.$dismiss('cancel');
                        $window.alert(new Error(resp.error));
                        return;
                    } else {
                        cfgProducts = baseCtrl.prototype.prepareCartHierarchy(resp.productTree, 'children');
                    }
                    $scope.content = cfgProducts;
                    baseCtrl.prototype.configureAttributes($scope.content[0]);
                    $rootScope.loading = false;
                });
            },
            function(error){
                $rootScope.loading = false;
                $scope.$dismiss('cancel');
                $window.alert(new Error(angular.toJson(error)));
            });
       }

        $scope.executeQueryableMethod = function(attr) {
            var queryItems = attr.querycode__c.split('|');
            if (queryItems.length < 2) {
                //ERROR
            } else {
                var className = queryItems[0];
                var methodName = queryItems[1];
                var input = queryItems[2];
                if (input === undefined)
                    input = null;
                if (attr.attributeRunTimeInfo.value !== '' && attr.attributeRunTimeInfo.value !== undefined) {
                    var inputJSON = (input === null ? {} : JSON.parse(input));
                    inputJSON.userInput = attr.attributeRunTimeInfo.value;
                    input = inputJSON;
                }
                var options = queryItems[3];
                if (options === undefined || options === null)
                    options = {};

                var persistComponentId = function(){
                    try{
                        return $scope.contentResp.propSetMap.persistentComponent[$scope.pcIndex].id;
                    }catch(exception){
                        return '';
                    }
                }();

                var configObj = {sClassName:className,sMethodName:methodName,input:angular.toJson(input),
                                 options:angular.toJson(options),iTimeout:null,label:{label: ($scope.contentCtrl && $scope.contentCtrl.name) || persistComponentId }};
                $scope.contentBpService.OmniRemoteInvoke(configObj).then(function(result, event) {
                    attr.attributeRunTimeInfo.queryresults = [];
                    if (result.length > 0 && $.isArray(result))
                        attr.attributeRunTimeInfo.queryresults = result;
                    else{
                        result = angular.fromJson(result);
                        for(key in result){
                            if($.isArray(result[key]))
                                attr.attributeRunTimeInfo.queryresults = result[key];
                        }
                    }

                    attr.attributeRunTimeInfo.showQueryResults = true;
                });
            }
       };

       $scope.setQueryResultToAttributeValue = function(attr, value) {
           if (attr.attributeRunTimeInfo.dataType === 'Number' || attr.attributeRunTimeInfo.dataType === 'Currency' || attr.attributeRunTimeInfo.dataType === 'Percent') {
               value = parseFloat(value) ? parseFloat(value) : null;
           }
           attr.attributeRunTimeInfo.value = value;
           attr.attributeRunTimeInfo.showQueryResults = false;
       };

       /* convert the product tree hierarchy into a list */
       $scope.createProductList = function(productHierarchy) {
           var productStructure = $.extend(true, {}, productHierarchy);
           var productList = [];
           angular.forEach(productStructure, function(rootProduct) {
               if (typeof(rootProduct) === 'object') {
                   var children = rootProduct.children;
                   delete rootProduct.children;
                   delete rootProduct.isRoot;
                   delete rootProduct.level;
                   delete rootProduct.hasConfigurableAttributes;
                   delete rootProduct.$$hashKey;
                   delete rootProduct.showAttrConfig;
                   delete rootProduct.isAttrParsed;
                   delete rootProduct.categoryMap;
                   rootProduct.JSONAttribute = JSON.stringify(rootProduct.JSONAttribute);
                   productList.push(rootProduct);
                   if (children) {
                       $scope.flattenChildren(productList, children);
                   }
                }
          });
          return productList;
      };

      $scope.flattenChildren = function(productList, products) {
          angular.forEach(products, function(product) {
              var children = product.children;
              delete product.children;
              delete product.isRoot;
              delete product.level;
              delete product.hasConfigurableAttributes;
              delete product.$$hashKey;
              delete product.showAttrConfig;
              delete product.isAttrParsed;
              delete product.categoryMap;
              product.JSONAttribute = JSON.stringify(product.JSONAttribute);
              productList.push(product);
              if (children) {
                  $scope.flattenChildren(productList, children);
              }
          });
      };

        $scope.onClickMultiSelect = function(scp, control, option, quantity) {
            var validForm = false;
            scp.qtyChanged = false;
            if(control.attributeRunTimeInfo.dataType === 'Multi Picklist') {
                if(!control.isrequired__c){
                    validForm = true;
                } else if(quantity == 0 || quantity == null) {
                    validForm = true;
                } else {
                    if(control.attributeRunTimeInfo.uiDisplayType === 'Checkbox') {
                        if(option && option.checked) {
                            validForm = true;
                        } else {
                            for(var i = 0; i <control.attributeRunTimeInfo.values.length; i++) {
                                if(control.attributeRunTimeInfo.values[i].checked) {
                                    validForm = true;
                                    break;
                                }
                            }
                        }
                    }
                    else
                    {
                        if(control.attributeRunTimeInfo.selectedItems && control.attributeRunTimeInfo.selectedItems.length > 0)
                            validForm = true;
                    }
                }

                $timeout(function() {
                    scp.loopform.$setValidity("required", validForm);
                });
            }
        };

        $scope.onClickConfigProdQuantity = function(prod, quantity) {
            if(quantity >= 0 && (!prod.maxQuantity || (quantity <= prod.maxQuantity)) && (!prod.minQuantity || (quantity >= prod.minQuantity))) {
                prod.quantity = quantity;
            }
        };

    });
     //################################Product Configuration Section End##############################

     //DocuSign Modal Controller for embedded signature within omniscript in a modal.
     bpModule.controller('ModalDocuSignEmbeddedCtrl', function ($scope, $rootScope, $window, $sce, $timeout, bpService, mElementScp, mInput, mControl, $templateCache) {
         //SFDC Labels Starts
         $scope.OmniDocuSignModalClose = customLabels.OmniDocuSignModalClose;
         $scope.OmniDocuSignModalViewPdf = customLabels.OmniDocuSignModalViewPdf;
         $scope.OmniDocuSignModalTitle = customLabels.OmniDocuSignModalTitle;
         //SFDC Labels Ends
         $scope.OmniConfigProdModalOk = customLabels.OmniConfigProdModalOk;
         $scope.elementScp = mElementScp;
         $scope.input = mInput;
         $scope.control = mControl;
         $scope.bpService = bpService;
         $scope.viewPdf = false;
         $scope.disableViewPdf = false;
         $scope.elementScp.docStatus = '';

         var sClassName = $scope.bpService.sNSC+'DefaultDocuSignOmniScriptIntegration',
             sMethodName = "sendEnvelopeEmbedded",
             options = mControl.propSetMap.remoteOptions,
             clsPrefix = angular.equals(sfdcVars.layout, 'lightning') ? 'slds-' : (angular.equals(sfdcVars.layout, 'newport') ? 'nds-' : ''),

             //handling the redirect urls in omniout
             redirectUrl = document.location.protocol + '//' + document.location.host,
             absolutePath = document.location.pathname.substring(0, document.location.pathname.indexOf("/apex")),
             defaultUrl = (window.OmniOut)?('/OmniScriptDocuSignReturnPage.html'):(absolutePath + '/apex/' + $scope.elementScp.nsPrefix + 'OmniScriptDocuSignReturnPage'),
             iTimeout = $scope.control.propSetMap.remoteTimeout,
             currentUrl;
         redirectUrl = redirectUrl + defaultUrl;
         if($scope.control.propSetMap.docuSignReturnUrl != undefined && $scope.control.propSetMap.docuSignReturnUrl != '')
             defaultUrl = redirectUrl = $scope.control.propSetMap.docuSignReturnUrl;

         currentUrl = document.location.href;
         currentUrl = (currentUrl.length > 400) ? currentUrl.substring(0, 400) : currentUrl;
         options.returnUrl = currentUrl+'/toOS-'+$scope.control.name+'-fromDoc/';
         options.elementName = $scope.control.name;

         $scope.initDocuSignModal = function(){
             $rootScope.loading = true;
             var isSFDCPage = false,
                 eleName = $scope.control.name,
                 frameEle,
                 frameHeight;
             if(angular.equals(sfdcVars.layout, 'lightning') || angular.equals(sfdcVars.layout, 'newport')) {
                $('.' + clsPrefix + 'modal').find('#docusign-pdf').hide();
                frameEle = $('.' + clsPrefix + 'modal').find('.' + clsPrefix + 'modal__container').find('#docusign-frame iframe');
             } else {
                $('.vlc-docusign-modal').parents('.modal-dialog').addClass('vlocity');
                $('.vlc-docusign-modal').find('#docusign-pdf').hide();
                frameEle = $('.vlc-docusign-modal').find('#docusign-frame iframe');
             }
             frameHeight = frameEle.height();
             if (!frameEle.length > 0) {
                $timeout(function() {
                    $scope.initDocuSignModal();
                }, 100);
                return;
             }

             $(frameEle).on('load', function(event){
                if(isSFDCPage){
                    try{
                        var statusString = event.currentTarget.contentWindow.location.href,
                            modalElement = null,
                            isReturnPage = (new RegExp('toOS-'+encodeURI($scope.control.name)+'-fromDoc')).test(statusString) ||
                                           (new RegExp('toOS-'+$scope.control.name+'-fromDoc')).test(statusString);

                        if(isReturnPage || (new RegExp(defaultUrl)).test(statusString)) {
                            $scope.frameLoading = true;
                            if(angular.equals(sfdcVars.layout, 'lightning') || angular.equals(sfdcVars.layout, 'newport'))
                                modalElement = '.'+ clsPrefix + 'modal';
                            else
                                modalElement = '.vlc-docusign-modal';

                            $(modalElement).find('#docusign-frame iframe').hide();

                            var html = '';
                            if(bpService.layout == 'lightning') {
                                html = '<div id="iframeDummy"><div class="mask vlc-slds-mask" ng-show="frameLoading">'+
                                    '<div class="center-block spinner slds-spinner_container nds-spinner_container"><div class="slds-spinner--brand slds-spinner slds-spinner--large nds-spinner_brand nds-spinner nds-spinner_large" role="alert">'+
                                    '<div class="slds-spinner__dot-a nds-spinner__dot-a"></div><div class="slds-spinner__dot-b nds-spinner__dot-b"></div></div></div></div></div>';
                            } else if(bpService.layout == 'newport') {
                                var htmlMarkup = $templateCache.get('vlcNdsSpinner.html');
                                html = '<div id="iframeDummy"><div class="mask vlc-slds-mask" ng-show="frameLoading">' + htmlMarkup + '</div>';
                            }

                            $(modalElement).find('#docusign-frame').append(html);


                            $(modalElement).find('#docusign-frame').find('#iframeDummy').css('height',frameHeight);
                            $(modalElement).find('#docusign-frame').find('#iframeDummy').find('.vlc-slds-mask').css('left','-7%');

                            if(statusString.indexOf(defaultUrl) >= 0) {
                                $scope.frameLoading = false;
                                delete $scope.frameLoading;
                                $(modalElement).find('#docusign-frame iframe').show();
                                $(modalElement).find('#docusign-frame').find('#iframeDummy').remove();
                                $(modalElement).find('#docusign-frame').find('#iframeDummy').empty();
                                $(modalElement).find('#docusign-frame iframe').css('height',frameHeight);
                                $scope.$apply();
                                return false;
                            }

                            $timeout(function() {
                                statusString = statusString.substring(statusString.indexOf('event='), statusString.length);
                                event.currentTarget.src = redirectUrl + '?' +statusString;
                                statusString = statusString.substring(statusString.indexOf('=') + 1,statusString.length);
                                if(statusString === 'signing_complete'){
                                    statusString = 'Completed';
                                    $scope.viewPdf = true;
                                    $scope.$digest();
                                    if(angular.equals(sfdcVars.layout, 'lightning') || angular.equals(sfdcVars.layout, 'newport'))
                                        $(modalElement).find('.vlc-expand-docusign-modal').css('left','177px');
                                } else if(statusString === 'decline')
                                    statusString = 'Declined';
                                  else if(statusString === 'cancel')
                                    statusString = 'Cancel';
                                if(angular.isDefined($scope.elementScp.bpTree.response[eleName]))
                                    $scope.elementScp.bpTree.response[eleName][0].status = statusString;
                                modalElement = null;
                            }, 3000);
                        }

                    }catch(e){
                        console.log(e.message);
                    }
                    isSFDCPage = false;
                }
                isSFDCPage = true;
             });

             var configObj = {sClassName:sClassName,sMethodName:sMethodName,input:angular.toJson($scope.input),
                              options:angular.toJson(options),iTimeout:iTimeout,label:{label: mControl && mControl.name}};
             $scope.bpService.OmniRemoteInvoke(configObj).then(function(result, event) {
                 var resp = angular.fromJson(result);
                 if (resp.error !== 'OK') {
                     $rootScope.loading = false;
                     $scope.$dismiss('cancel');
                     $window.alert(new Error(resp.error));
                     return;
                 } else {
                     $scope.redirectUri = $sce.trustAsResourceUrl(resp[eleName].url);
                     $scope.envelopeId = resp[eleName].envelopeId;
                     if($scope.envelopeId) {
                        if(angular.isUndefined($scope.elementScp.bpTree.response[eleName]))
                            $scope.elementScp.bpTree.response[eleName] = [];
                        $scope.elementScp.bpTree.response[eleName].unshift({status:'In Process', envelopeId:$scope.envelopeId});
                     }
                     $timeout(function() {
                        $rootScope.loading = false;
                     }, 1000);
                 }
            },
            function(error){
                $rootScope.loading = false;
                $scope.$dismiss('cancel');
                $window.alert(new Error(angular.toJson(error)));
            });
        }

        $scope.closeModal = function(){
            $scope.$dismiss('cancel');
        };

        $scope.ViewPDF = function(){
            var sClassName = $scope.bpService.sNSC+'DefaultDocuSignOmniScriptIntegration',
                sMethodName = 'getEnvelopePDF',
                options = {'envelopeId' : $scope.envelopeId};

            $rootScope.loading = true;

            var configObj = {sClassName:sClassName,sMethodName:sMethodName,input:angular.toJson({}),
                             options:angular.toJson(options),iTimeout:null,label:{label: mControl && mControl.name}};
            $scope.bpService.OmniRemoteInvoke(configObj).then(function(result, event) {
                $rootScope.loading = false;
                var resp = angular.fromJson(result);
                if (resp.error !== 'OK') {
                    $scope.$dismiss('cancel');
                    $window.alert(new Error(resp.error));
                    return;
                } else {
                    $scope.pdfDocUrl = $sce.trustAsResourceUrl('data:application/pdf;base64,' + resp.docuSignEnvelopePDF);
                    if(angular.equals(sfdcVars.layout, 'lightning') || angular.equals(sfdcVars.layout, 'newport')) {
                         $('.' + clsPrefix + 'modal').find('#docusign-frame').hide();
                         $('.' + clsPrefix + 'modal').find('#docusign-pdf').show();
                         $timeout(function() {
                            var ele =  $('.' + clsPrefix + 'modal').find('#docusign-pdf');
                            $('.' + clsPrefix + 'modal').find('.' + clsPrefix + 'modal__content').empty();
                            $('.' + clsPrefix + 'modal').find('.' + clsPrefix + 'modal__content').append(ele);
                        });
                    } else {
                        $('.vlc-docusign-modal').find('#docusign-frame').hide();
                        $('.vlc-docusign-modal').find('#docusign-pdf').show();
                        $timeout(function() {
                            var ele =  $('.vlc-docusign-modal').find('#docusign-pdf');
                            $('.vlc-docusign-modal').find('.modal-body').empty();
                            $('.vlc-docusign-modal').find('.modal-body').append(ele);
                        });
                    }
                    $scope.disableViewPdf = true;
                }
            },
            function(error){
                $rootScope.loading = false;
                $scope.$dismiss('cancel');
                $window.alert(new Error(angular.toJson(error)));
            });
        };
     });

//######################## hybridCPQCartController is used in CPQ Cart with new API ################

    bpModule.controller("hybridCPQCartController", function($scope, $rootScope, $window, $sldsModal, $timeout, $compile, $templateCache, bpService) {

        $scope.configAttributeObj = null;
        $scope.reRenderAttributesForm = false;
        $rootScope.vlocity.userCurrency = $scope.bpTree.userCurrencyCode;
        var queue = [], isConfigInProcess = false, vlcHCartHybStr;

        if ('parentIFrame' in window) {
            parentIFrame.setHeightCalculationMethod('documentElementOffset');
            vlcHCartHybStr = $templateCache.get('vlcHCartHyb.html');
            if(vlcHCartHybStr.indexOf('vlc-slds-cart-container__parentIFrame') === -1) {
                vlcHCartHybStr = vlcHCartHybStr.replace('vlc-slds-cart-container','vlc-slds-cart-container vlc-slds-cart-container__parentIFrame');
                $templateCache.put('vlcHCartHyb.html', vlcHCartHybStr);
                $compile($templateCache);
            }
        }

        $scope.initParent = function(scp, prod) {
            scp[scp.gParentId+'_'+scp.prodHierLevel] = prod;
            var childArray =[];

            if (prod.lineItems && prod.lineItems.records) {
                angular.forEach(prod.lineItems.records, function(value) {
                    childArray.push(value);
                });
            }

            if (prod.childProducts && prod.childProducts.records) {
                angular.forEach(prod.childProducts.records, function(childProd) {
                    // This checkIfAddonIsNotInCart(...) check is ONLY for optional products (minQuantity=0) with defaultQuantity=0,
                    // because these optionals ALWAYS have ONE Addon product in childProducts json structure, even when they have
                    // been added to cart, so we do not want to display the childProducts Addon when it has been added to cart as lineItem
                    if ($scope.checkIfAddonIsNotInCart(prod, childProd)) {
                        childArray.push(childProd);
                    }
                });
            }

            if (prod.productGroups && prod.productGroups.records) {
                angular.forEach(prod.productGroups.records, function(value) {
                    childArray.push(value);
                });
            }

            prod.childRecords = childArray;

        }

        $scope.checkIfAddonIsNotInCart = function(parent, addonChildProduct) {
            var parentCardinalityMap;
            var isParentCardinalityMapEmpty;
            var addonCountInParentCardinalityMap;
            parentCardinalityMap = parent[$scope.nsPrefix + 'InCartQuantityMap__c'];
            // if parent cardinality map does EXIST and NOT EMPTY and addon child product has a count in the map
            if (parentCardinalityMap && parentCardinalityMap.value && !_.isEmpty(parentCardinalityMap.value) &&
                addonChildProduct.Product2 && addonChildProduct.Product2.Id && parentCardinalityMap.value[addonChildProduct.Product2.Id]) {
                return false; // the child product must have been added to cart
                // otherwise
            } else {
                return true; // the child product has not been added to the cart
            }
        };

        //######### Cardinality Section Start ########

        $scope.checkCardinalityForAdd = function(parent, lineItemChildProduct) {
            var product2Id = lineItemChildProduct.PricebookEntry.Product2.Id;
            // addToCart lineItem will be added with default quantity, except when it is 0.  In the latter case, we will add quantity of 1.
            var additionalQuantity = (lineItemChildProduct.defaultQuantity > 0) ? lineItemChildProduct.defaultQuantity : 1;
            return checkCardinalityForAddOrClone(parent, lineItemChildProduct, product2Id, additionalQuantity);
        };

        $scope.checkCardinalityForClone = function(parent, lineItemChildProduct) {
            var product2Id = lineItemChildProduct.PricebookEntry.Product2.Id;
            // clone lineItem will be added with the quantity of the lineItem, except when user typed a 0 which we forbid.
            // In the latter case, we will forbid user from cloning the lineItem.
            var additionalQuantity = lineItemChildProduct.Quantity.value;
            return (additionalQuantity > 0) ? checkCardinalityForAddOrClone(parent, lineItemChildProduct, product2Id, additionalQuantity) : false;
        };

        $scope.checkCardinalityForAddon = function(parent, addonChildProduct) {
            var product2Id = addonChildProduct.Product2.Id;

            // addToCart Addon will be added with default quantity, except when it is 0.  In the latter case, we will add quantity of 1.
            var additionalQuantity = (addonChildProduct.defaultQuantity > 0) ? addonChildProduct.defaultQuantity : 1;

            var groupCardinalityCheckPassed;

            if (parent[$scope.nsPrefix + 'InCartQuantityMap__c'] && parent[$scope.nsPrefix + 'InCartQuantityMap__c'].value) {

                // Even though this is Addon with an "Add to Cart" button, but we still need to check for both PCI besides Group
                // cardinality because the first time when user clicks on the "Add to Cart" button, there is no instance of it,
                // but if the user do fast succsessive clicks, there would be other instances of it so PCI cardinality needs to be considered
                return checkCardinalityForAddOrClone(parent, addonChildProduct, product2Id, additionalQuantity);

            } else {

                // If there is no cardinality map in the parent, then it means this Addon will be the only one under the parent.
                // Simply check if the additional quantity would exceed groupMaxQuantity to decide if addToCart on this Addon is allowed.
                groupCardinalityCheckPassed = additionalQuantity <= parent.groupMaxQuantity;
                return groupCardinalityCheckPassed;

            }
        };

        var checkCardinalityForAddOrClone = function(parent, lineItemChildProduct, product2Id, additionalQuantity) {
            var parentInCartQuantityMap = parent[$scope.nsPrefix + 'InCartQuantityMap__c'].value;
            var numOfInstancesOfChildProductTypeUnderParent;

            if(parentInCartQuantityMap)
                numOfInstancesOfChildProductTypeUnderParent = parentInCartQuantityMap[product2Id];

            // If this is lineItem, numOfInstancesOfChildProductTypeUnderParent would have a value for us to check PCI Cardinality.
            // If this is Addon, it would be undefined and we would set PCI check to be true so it could move on to check Group cardinality.
            var pciCardinalityCheckPassed =
                (typeof numOfInstancesOfChildProductTypeUnderParent !== 'undefined') ? numOfInstancesOfChildProductTypeUnderParent + additionalQuantity <= lineItemChildProduct.maxQuantity : true;

            var totalNumOfChildrenUnderParent, productId, groupCardinalityCheckPassed;

            // if PCI cardinality check fails, we cannot let user add or clone
            if (!pciCardinalityCheckPassed) {
                return false;
            }

            if (typeof parent.groupMaxQuantity !== 'undefined') {

                totalNumOfChildrenUnderParent = 0;
                for (productId in parentInCartQuantityMap) {
                    if (parentInCartQuantityMap.hasOwnProperty(productId)) {
                        totalNumOfChildrenUnderParent += parentInCartQuantityMap[productId];
                    }
                }

                groupCardinalityCheckPassed = totalNumOfChildrenUnderParent + additionalQuantity <= parent.groupMaxQuantity;
                return groupCardinalityCheckPassed;

            } else {

                // this deals with products created before we implemented group cardinality on products
                return true; // pciCardinalityCheckPassed is true

            }
        };

       $scope.checkCardinalityForClone = function(parent, lineItemChildProduct) {
           var product2Id = lineItemChildProduct.PricebookEntry.Product2.Id;
           // clone lineItem will be added with the quantity of the lineItem, except when user typed a 0 which we forbid.
           // In the latter case, we will forbid user from cloning the lineItem.
           var additionalQuantity = lineItemChildProduct.Quantity.value;
           return (additionalQuantity > 0) ? checkCardinalityForAddOrClone(parent, lineItemChildProduct, product2Id, additionalQuantity) : false;
       };

       $scope.checkCardinalityForDelete = function(parent, lineItemChildProduct) {
           var parentInCartQuantityMap = parent[$scope.nsPrefix + 'InCartQuantityMap__c'].value;
           var numOfInstancesOfChildProductTypeUnderParent;
           var pciCardinalityCheckPassed;
           var totalNumOfChildrenUnderParent, productId, groupCardinalityCheckPassed;

           if(parentInCartQuantityMap)
               numOfInstancesOfChildProductTypeUnderParent = parentInCartQuantityMap[lineItemChildProduct.PricebookEntry.Product2.Id];

           // if user typed 0 in quantity input, we will get an undefined value here
           if (typeof lineItemChildProduct.Quantity.value === 'undefined') {
               return true; // we need to let them delete using the delete icon because we forbid them setting quantity to 0
           // if user typed non-zero value in quantity input
           } else {
               pciCardinalityCheckPassed = numOfInstancesOfChildProductTypeUnderParent - lineItemChildProduct.Quantity.value >= lineItemChildProduct.minQuantity;
           }

           // if PCI cardinality check fails, we cannot let user delete
           if (!pciCardinalityCheckPassed) {
               return false;
           }

           if (typeof parent.groupMaxQuantity !== 'undefined') {

               totalNumOfChildrenUnderParent = 0;
               for (productId in parentInCartQuantityMap) {
                   if (parentInCartQuantityMap.hasOwnProperty(productId)) {
                       totalNumOfChildrenUnderParent += parentInCartQuantityMap[productId];
                   }
               }

               groupCardinalityCheckPassed = totalNumOfChildrenUnderParent - lineItemChildProduct.Quantity.value >= parent.groupMinQuantity;
               return groupCardinalityCheckPassed;

           } else {

               // this deals with products created before we implemented group cardinality on products
               return true; // pciCardinalityCheckPassed is true

           }
        };

       //################ Cardinality Section End ################

        var className = bpService.sNSC+'CpqAppHandler';
        $scope.addProductFromCart = function(parent, obj, gParent) {
            var configAddObject = {'records': [{}]}, // addToCart attributes API structure
                deleteArrayList = ['Attachments', 'actions', 'messages', 'childProducts', 'lineItems', 'attributeCategories', 'childRecords'],
                parentInCardData = parent,
                parentFromAPI, lineItemToBeAdded,
                opt={},
                inputParam = Object.keys(obj.actions.addtocart.remote.params).length > 0 ? obj.actions.addtocart.remote.params : (Object.keys(obj.actions.addtocart.rest.params).length > 0 ? obj.actions.addtocart.rest.params : null );

            /*
                In this addToCart, indeed there are two kind of objects that can be added:
                1) Required products lineItems and Optional products lineItems (that have been added to cart) will have an + icon (if cardinality check succeeds)
                    For these products to be added again, need to use checkCardinalityForAdd()
                2) Optional products (minQuantity=0) that are not added to cart. In this case, they should be using checkCardinalityForAddon()
                To detect case 1: check if (obj.itemType === 'lineItem'): they are in lineItems
                To detect case 2: check if (obj.itemType === 'childProducts'): they are in childProducts
            */

            var product2Name = (obj.itemType === 'lineItem') ? obj.PricebookEntry.Product2.Name : obj.Product2.Name;
            var passedCardinality = (obj.itemType === 'lineItem') ? $scope.checkCardinalityForAdd(parentInCardData, obj) : $scope.checkCardinalityForAddon(parentInCardData, obj);
            if (!passedCardinality) {
                alert('Cardinality error: CPQAddItemFailed For :' + product2Name);
                return;
            }

            configAddObject.records[0] = angular.copy(parent);
            angular.forEach(deleteArrayList, function(key) {
                delete configAddObject.records[0][key];
            });

            inputParam.items[0].parentRecord = configAddObject;
            inputParam.hierarchy = 20;

            $rootScope.loading = true;
            var configObj = {sClassName:className,sMethodName:'postCartsItems',input:angular.toJson(inputParam),
                            options:angular.toJson(opt),iTimeout:null,label:null};
            bpService.OmniRemoteInvoke(configObj).then(
                function(result) {
                    var configObjCart = {sClassName:className, sMethodName:'getCarts', input:angular.toJson(inputParam),
                            options:angular.toJson(opt),iTimeout:null, label:null};
                    bpService.OmniRemoteInvoke(configObjCart).then(
                        function(result) {
                            $rootScope.loading = false;
                            var resp = angular.fromJson(result), bundlehasError = false, msgArry = [], msgIdArray;
                            $scope.bpTree.response.vlcPersistentComponent[$scope.bpTree.pcId[$scope.vlcPC.pcIndex]+'_Top'] = [resp];
                            $scope.showErrorIconInCart($scope.bpTree.response.vlcPersistentComponent[$scope.bpTree.pcId[0]+'_Top'][0].messages, $scope);

                            angular.forEach(resp.messages, function(message) {
                                msgIdArray = message.messageId.split('|');
                                if (message.severity === 'ERROR' && gParent && gParent.Id.value == msgIdArray[0] && gParent['PricebookEntry']['Product2Id'] == msgIdArray[1]) {
                                    bundlehasError = true;
                                    msgArry.push(message);
                                }
                            });
                            if(bundlehasError && gParent)
                               gParent.messages = msgArry;
                        },
                        function(error) {
                            $scope.handleRemoteCallError(null, error, true, false);
                        }
                    );
                    var resp = angular.fromJson(result);
                    var hasError = false, errorMsg='';
                    angular.forEach(resp.messages, function(message) {
                        if (message.severity === 'ERROR') {
                            hasError = true;
                            errorMsg = message.message;
                        }
                    });

                    if(hasError && !resp.records) {
                        $scope.handleRemoteCallError(null, errorMsg, true, false);
                        return;
                    }
                    parentFromAPI = resp.records[0];
                    // We must copy the entire map object (not just value property) in addToCart because for a parent
                    // with ONLY optional products with defaultQuantity=0 (in main cart), there is NO map to start with.  The entire map
                    // is needed for subsequent update of any of its children.  The updateItemsAPI expects all properties
                    // of the map to be passed to it
                    parentInCardData[$scope.nsPrefix + 'InCartQuantityMap__c'] = parentFromAPI[$scope.nsPrefix + 'InCartQuantityMap__c'];
                    toBeAddedLineItem = parentFromAPI.lineItems.records[0];
                    insertLineItemToParent(parentInCardData, toBeAddedLineItem);
                    $scope.initParent($scope,parentInCardData);
                },
                function(error) {
                    $scope.handleRemoteCallError(null, error, true, false);
                }
            );
        };

        var insertLineItemToParent = function(parentInCardData, toBeAddedLineItem) {
            var addonList;
            var lineItemListWithTheAddedItem = [];
            if (!parentInCardData.lineItems) {
                parentInCardData.lineItems = {'records': [{}]};
            } else {
                lineItemListWithTheAddedItem = angular.copy(parentInCardData.lineItems.records);
            }
            lineItemListWithTheAddedItem.push(toBeAddedLineItem);
            parentInCardData.lineItems.records = lineItemListWithTheAddedItem;

            // 1) If the to-be-added lineItem is an Optional product (Definition: minQuantity=0) and has defaultQuantity > 0,
            // that means it was a lineItem initially because defaultQuantity > 0,
            // but subsequently it was deleted and was removed from lineItems json array, but was added to as an Addon
            // in childProducts array.  Now that we are adding it back to lineItems, we also need to remove
            // the corresponding Addon in childProducts.
            // 2) We don't need to do this for Optional products (Definition: minQuantity=0) and have defaultQuantity = 0, because
            // they always have an Addon in the childProducts array.
            // 3) We also do not need to do this for Required products (Definition: minQuantity>0) as they cannot be
            // completely deleted and would never have a representation in the childProducts array.
            if ((toBeAddedLineItem.minQuantity === undefined || toBeAddedLineItem.minQuantity === 0) && toBeAddedLineItem.defaultQuantity > 0) {
                removeAddonFromParent(parentInCardData, toBeAddedLineItem.PricebookEntryId.value);
            }
        };

        var removeAddonFromParent = function(parentInCardData, toBeRemovedAddonId) {
            var addonList;
            var addonListWithoutTheRemovedAddon = [];
            var i;
            if (parentInCardData.childProducts) {
                addonList = angular.copy(parentInCardData.childProducts.records);
                for (i = 0; i < addonList.length; i++) {
                    if (addonList[i].Id.value !== toBeRemovedAddonId) {
                        addonListWithoutTheRemovedAddon.push(addonList[i]);
                    }
                }
                parentInCardData.childProducts.records = addonListWithoutTheRemovedAddon;
            }
        };

        $scope.deleteProductFromCart = function(parent, product, index, gParent) {
             var opt = {},
                 parentInCardData,itemObject,
                 addonProduct,
                 cardinalityMapAlreadyUpdated,
                 inputParam = Object.keys(product.actions.deleteitem.remote.params).length > 0 ? product.actions.deleteitem.remote.params : (Object.keys(product.actions.deleteitem.rest.params).length > 0 ? product.actions.deleteitem.rest.params : null );

             $rootScope.loading = true;
             var configObj = {sClassName:className,sMethodName:'deleteCartsItems',input:angular.toJson(inputParam),
                            options:angular.toJson(opt),iTimeout:null,label:null};
             bpService.OmniRemoteInvoke(configObj).then(
                function(result) {
                    var configObjCart = {sClassName:className,sMethodName:'getCarts',input:angular.toJson(inputParam),
                                        options:angular.toJson(opt),iTimeout:null,label:null},
                        deleteErrorMsg='';
                    bpService.OmniRemoteInvoke(configObjCart).then(
                        function(res) {
                            $rootScope.loading = false;
                            var resp = angular.fromJson(res), msgArry=[], msgIdArray;
                            $scope.bpTree.response.vlcPersistentComponent[$scope.bpTree.pcId[$scope.vlcPC.pcIndex]+'_Top'] = [resp];
                            $scope.showErrorIconInCart($scope.bpTree.response.vlcPersistentComponent[$scope.bpTree.pcId[0]+'_Top'][0].messages, $scope);

                            angular.forEach(resp.messages, function(message) {
                                msgIdArray = message.messageId.split('|');
                                if (message.severity === 'ERROR' && gParent && gParent.Id.value == msgIdArray[0] && gParent['PricebookEntry']['Product2Id'] == msgIdArray[1])
                                    msgArry.push(message);
                            });
                            if(gParent)
                                gParent.messages = msgArry;
                        },
                        function(error) {
                            $scope.handleRemoteCallError(null, error, true, false);
                        }
                    );
                     var data = angular.fromJson(result),
                         hasError = false;
                    angular.forEach(data.messages, function(message) {
                        if (message.severity === 'ERROR') {
                            hasError = true;
                            deleteErrorMsg = message.message;
                        }
                    });

                    if (!hasError) {
                        if (!data.records || data.records.length === 0) {
                            $scope.bpTree.response.vlcPersistentComponent[$scope.bpTree.pcId[$scope.vlcPC.pcIndex]].records.splice(index, 1);
                        } else {
                            parentInCardData = parent;
                            itemObject = product;
                            // if there is another instance of the same product type to be deleted in lineItems,
                            // API would not return addonProduct
                            if (data.records[0].childProducts) {
                                addonProduct = data.records[0].childProducts.records[0];
                            } else {
                                addonProduct = null;
                            }

                            cardinalityMapAlreadyUpdated = false;
                            deleteLineItem(parentInCardData, itemObject, addonProduct, cardinalityMapAlreadyUpdated);

                            $scope.initParent($scope,parentInCardData);
                        }
                    } else if(deleteErrorMsg !==''){
                        $scope.handleRemoteCallError(null, deleteErrorMsg, true, false);
                    }
                    $scope.closeAttributePanel();
                 },
                 function(error) {
                     $scope.handleRemoteCallError(null, error, true, false);
                 }
             );
         }

       var changeLineItemCountInCardinalityMap = function(cardinalityMap, product2Id, changeQty) {
            var productCountInMap = cardinalityMap[product2Id];
            var productCountAfterChange;
            if (productCountInMap) {
                productCountAfterChange = productCountInMap + changeQty;
                if (productCountAfterChange > 0) {
                    cardinalityMap[product2Id] = productCountAfterChange;
                } else {
                    delete cardinalityMap[product2Id];
                }
            }
        };

        var removeLineItemFromParent = function(parentInCardData, toBeRemovedLineItemId, addonProductFromAPI) {
            var lineItemList;
            var lineItemListWithoutTheRemovedItem = [];
            var i;
            var currentLineItem;

            if (parentInCardData.lineItems) {

                lineItemList = angular.copy(parentInCardData.lineItems.records);
                for (i = 0; i < lineItemList.length; i++) {
                    currentLineItem = lineItemList[i];
                    if (currentLineItem.Id.value !== toBeRemovedLineItemId) {
                        lineItemListWithoutTheRemovedItem.push(currentLineItem);
                    }
                }

                // Delete the lineItem from parent by replacing the existing lineItems under the parent
                // by an array without the to-be-deleted lineItem
                parentInCardData.lineItems.records = lineItemListWithoutTheRemovedItem;

            }
        };

        var deleteLineItem = function(parentInCardData, toBeRemovedLineItem, addonProductFromAPI, cardinalityMapAlreadyUpdated) {
            var toBeRemovedLineItemId = toBeRemovedLineItem.Id.value;
            var parentInCardDataCardinalityMap, toBeRemovedLineItemProduct2Id, toBeRemovedLineItemQuantity;
            var addonProductIsLastInstanceUnderParent;
            var numOfLineItemsUnderParent, numOfChildProductsUnderParent;
            var i, j;

            if (!cardinalityMapAlreadyUpdated) {
                parentInCardDataCardinalityMap = parentInCardData[$scope.nsPrefix + 'InCartQuantityMap__c'].value;
                toBeRemovedLineItemProduct2Id = toBeRemovedLineItem.PricebookEntry.Product2.Id;
                toBeRemovedLineItemQuantity = toBeRemovedLineItem.Quantity.value;
                if (parentInCardDataCardinalityMap) {
                    changeLineItemCountInCardinalityMap(parentInCardDataCardinalityMap, toBeRemovedLineItemProduct2Id, toBeRemovedLineItemQuantity * -1);
                }
            }

            removeLineItemFromParent(parentInCardData, toBeRemovedLineItemId, addonProductFromAPI);

            // 1) Only Optional products (Definition: minQuantity=0) with defaultQuantity > 0 would need to be put into childProducts
            // if there is NONE OTHER instance of it under the parent, such that it would show up with "Add to Cart" button.
            // 2) For Optional products (Definition: minQuantity=0) with defaultQuantity = 0,
            // they are always in childProducts and addonProduct returned from the deleteAPI would be null.
            // 3) Required products (Definition: minQuantity>0) would never have a representation in the childProducts array
            // and addonProduct returned from the deleteAPI would be null.

            // For Case 1: Optional products (Definition: minQuantity=0) with defaultQuantity > 0
            if (addonProductFromAPI && (addonProductFromAPI.minQuantity === undefined || addonProductFromAPI.minQuantity === 0) && addonProductFromAPI.defaultQuantity > 0) {

                // Only do the following to remove the childProduct representation of the lineItem if parent is NOT collapsable
                if (!parentInCardData.actions || (parentInCardData.actions && !parentInCardData.actions.getproducts)) {

                    // Check to see if addonProduct is the last instance under the parent
                    addonProductIsLastInstanceUnderParent = true;
                    numOfLineItemsUnderParent = parentInCardData.lineItems.records.length;
                    for (i = 0; i < numOfLineItemsUnderParent; i++) {
                        if (parentInCardData.lineItems.records[i].PricebookEntry.Product2.Id === addonProductFromAPI.Product2.Id) {
                            addonProductIsLastInstanceUnderParent = false;
                        }
                    }

                    // Only insert addonProduct into childProducts if it is the last instance of its product2 type under the parent,
                    // because this is Case 1: Optional products (Definition: minQuantity=0) with defaultQuantity > 0,
                    // as such, ONLY 1 addon needs to be in childProducts
                    if (addonProductIsLastInstanceUnderParent) {

                        if (!parentInCardData.childProducts) {
                            parentInCardData.childProducts = {};
                            parentInCardData.childProducts.records = [];
                        }

                        parentInCardData.childProducts.records.push(addonProductFromAPI);
                    }

                }

            // For Case 2: Optional products (Definition: minQuantity=0) with defaultQuantity = 0
            } else if (addonProductFromAPI && (addonProductFromAPI.minQuantity === undefined || addonProductFromAPI.minQuantity === 0) && addonProductFromAPI.defaultQuantity === 0) {

                if (parentInCardData.actions && parentInCardData.actions.getproducts) {
                    // remove childProduct from parent if the parent is Collapsable
                    removeAddonFromParent(parentInCardData, toBeRemovedLineItem.PricebookEntryId.value);
                } else {

                    // Replace it by the (updated) one from API
                    numOfChildProductsUnderParent = parentInCardData.childProducts.records.length;
                    for (j = 0; j < numOfChildProductsUnderParent; j++) {
                        if (parentInCardData.childProducts.records[j].Product2.Id === addonProductFromAPI.Product2.Id) {
                            parentInCardData.childProducts.records[j] = addonProductFromAPI;
                            break;
                        }
                    }

                }

            }

        };

        $scope.clone = function(parent, itemObject) {
            var configCloneObject = {'records': [{}]}; // clone API structure
            var deleteArrayList = ['Attachments', 'actions', 'messages', 'childProducts', 'lineItems', 'attributeCategories', 'childRecords'];
            var cloneActionObj = Object.keys(itemObject.actions.cloneitem.remote.params).length > 0 ? itemObject.actions.cloneitem.remote.params : (Object.keys(itemObject.actions.cloneitem.rest.params).length > 0 ? itemObject.actions.cloneitem.rest.params : null );
            var parentInCardData = parent;
            var parentFromAPI, lineItemToBeAdded;
            var processingToastMessage, opt={};

            // Only lineItems could be cloned and they would have the 'PricebookEntry' field.
            var product2Name = itemObject.PricebookEntry.Product2.Name;

            // Only check cardinality if the item being cloned is a non-root lineItem and would therefore have a ParentItemId__c field with value
            if (itemObject[$scope.nsPrefix + 'ParentItemId__c'] && itemObject[$scope.nsPrefix + 'ParentItemId__c'].value) {

                /*
                    Only lineItems can be cloned and they would be:
                    Required products lineItems and Optional products lineItems (that have been added to cart) will have an clone icon (if cardinality check succeeds)
                        For these products to be cloned, need to use checkCardinalityForAdd()
                */
                var product2Name = (itemObject.itemType === 'lineItem') ? itemObject.PricebookEntry.Product2.Name : itemObject.Product2.Name;
                var passedCardinality = $scope.checkCardinalityForClone(parentInCardData, itemObject);
                if (!passedCardinality) {
                    alert('Cardinality error: CPQAddItemFailed For :' + product2Name);
                    return;
                }

            }

            cloneActionObj.items = [
                {'itemId': itemObject.Id.value}
            ];

            if (parent) {

                configCloneObject.records[0] = angular.copy(parent);
                angular.forEach(deleteArrayList, function(key) {
                    delete configCloneObject.records[0][key];
                });

                cloneActionObj.items[0].parentRecord = configCloneObject;

            }

            cloneActionObj.hierarchy = 20;

            $rootScope.loading = true;
            var configObj = {sClassName:className,sMethodName:'cloneItems',input:angular.toJson(cloneActionObj),
                            options:angular.toJson(opt),iTimeout:null,label:null};
            bpService.OmniRemoteInvoke(configObj).then(
                function(result) {
                    var configObjCart = {sClassName:className,sMethodName:'getCarts',input:angular.toJson(cloneActionObj),
                            options:angular.toJson(opt),iTimeout:null,label:null};
                    bpService.OmniRemoteInvoke(configObjCart).then(
                        function(res) {
                            $rootScope.loading = false;
                            var resp = angular.fromJson(res);
                            $scope.bpTree.response.vlcPersistentComponent[$scope.bpTree.pcId[$scope.vlcPC.pcIndex]+'_Top'] = [resp];
                            $scope.showErrorIconInCart($scope.bpTree.response.vlcPersistentComponent[$scope.bpTree.pcId[0]+'_Top'][0].messages, $scope);
                        },
                        function(error) {
                            $scope.handleRemoteCallError(null, error, true, false);
                        }
                    );
                    var data = angular.fromJson(result);
                    // the root bundle is cloned and the response from API would have a root bundle that has its root being itself (RootItemId__c.value === Id.value)
                    if (data.records[0][$scope.nsPrefix + 'RootItemId__c'] && data.records[0][$scope.nsPrefix + 'RootItemId__c'].value &&
                        (data.records[0][$scope.nsPrefix + 'RootItemId__c'].value === data.records[0].Id.value)) {

                        // add the whole root bundle to the cart
                        $scope.bpTree.response.vlcPersistentComponent[$scope.bpTree.pcId[$scope.vlcPC.pcIndex]].records.unshift(data.records[0]);

                    // a lineItem is cloned and a skinny response object is returned with Id, cardinality map, lineItems
                    } else {

                        parentFromAPI = data.records[0];
                        parentInCardData[$scope.nsPrefix + 'InCartQuantityMap__c'] = parentFromAPI[$scope.nsPrefix + 'InCartQuantityMap__c'];
                        toBeAddedLineItem = parentFromAPI.lineItems.records[0];
                        insertLineItemToParent(parentInCardData, toBeAddedLineItem);
                        $scope.initParent($scope,parentInCardData);
                    }
                },
                function(error) {
                    $scope.handleRemoteCallError(null, error, true, false);
                }
            );
        };

        $scope.lineItemIdsWithInvalidQuantity = [];
        $scope.updateLineField = function(parent, itemObject, quantity, updateAttributeData) {
            var updateItemsActionObj = {};
            var loadMessage = {'event': 'setLoading', 'message': true};
            var configUpdateObject = {'records': [{}]}; // Update attributes API structure
            var deleteArrayList = ['Attachments', 'actions', 'messages', 'childProducts', 'lineItems', 'childRecords'];
            var modifiedChildItemObject;
            var parentFromAPI, parentInCardData;
            var updatedLineItemFromAPI, updatedLineItemInCarddata;
            var addonProduct;
            var cardinalityMapAlreadyUpdated, opt={};

            if(quantity)
                itemObject.Quantity.value = quantity;

            if(quantity === 0)
                return;

            var errorMessage = lineFieldValidation(itemObject);
            itemObject.fieldValidationMessage = '';

            if (errorMessage) {
                itemObject.fieldValidationMessage = errorMessage;
                return;
            }

            if (parent) {
                // update on a lineItem that has a parent
                configUpdateObject.records[0] = angular.copy(parent);
                angular.forEach(deleteArrayList, function(key) {
                    delete configUpdateObject.records[0][key];
                });

                modifiedChildItemObject = angular.copy(itemObject);
                angular.forEach(deleteArrayList, function(key) {
                    delete modifiedChildItemObject[key];
                });

                configUpdateObject.records[0].lineItems = {'records': [modifiedChildItemObject]};
            } else {
                // update on the root which has no parent
                configUpdateObject.records[0] = angular.copy(itemObject);
                angular.forEach(deleteArrayList, function(key) {
                    delete configUpdateObject.records[0][key];
                });
            }

            updateItemsActionObj = Object.keys(itemObject.actions.updateitems.remote.params).length > 0 ? itemObject.actions.updateitems.remote.params : (Object.keys(itemObject.actions.updateitems.rest.params).length > 0 ? itemObject.actions.updateitems.rest.params : null );;
            //Updated items for both remote and rest
            updateItemsActionObj.items = configUpdateObject;

            $rootScope.loading = true;
            var configObj = {sClassName:className,sMethodName:'putCartsItems',input:angular.toJson(updateItemsActionObj),
                            options:angular.toJson(opt),iTimeout:null,label:null};
            bpService.OmniRemoteInvoke(configObj).then(
                function(result) {
                    var configObjCart = {sClassName:className,sMethodName:'getCarts',input:angular.toJson(updateItemsActionObj),
                            options:angular.toJson(opt),iTimeout:null,label:null};
                    bpService.OmniRemoteInvoke(configObjCart).then(
                        function(res) {
                            $rootScope.loading = false;
                            resp = angular.fromJson(res);
                            $scope.bpTree.response.vlcPersistentComponent[$scope.bpTree.pcId[$scope.vlcPC.pcIndex]+'_Top'] = [resp];
                            $scope.showErrorIconInCart($scope.bpTree.response.vlcPersistentComponent[$scope.bpTree.pcId[0]+'_Top'][0].messages, $scope);
                        },
                        function(error) {
                            $scope.handleRemoteCallError(null, error, true, false);
                        }
                    );

                    var data = angular.fromJson(result);
                    var updateSuccessful = false;
                    var hasError = false;
                    parentInCardData = parent;

                    angular.forEach(data.messages, function(message) {
                        if (message.severity === 'ERROR')
                            hasError = true;

                        if (message.severity === 'INFO' && message.code === '151')
                            updateSuccessful = true;

                    });

                    // root is updated when the response has no lineItems and (no parentItemId (in modal) or parentItemId is null (in cart)
                    if (!data.records[0].lineItems && (!data.records[0][$scope.nsPrefix +
                        'ParentItemId__c'] || !data.records[0][$scope.nsPrefix + 'ParentItemId__c'].value)) {

                        // copy fields including messages
                        updatedLineItemFromAPI = data.records[0];
                        updatedLineItemInCardData = itemObject;
                        updatedLineItemInCardData.messages = updatedLineItemFromAPI.messages;
                        copyUpdatableFields(updatedLineItemInCardData, updatedLineItemFromAPI, updateAttributeData);

                    // non-root is updated
                    } else {

                        // copy fields including messages
                        parentFromAPI = data.records[0];
                        updatedLineItemFromAPI = data.records[0].lineItems.records[0];
                        updatedLineItemInCardData = findLineItem(updatedLineItemFromAPI.Id.value, parentInCardData.lineItems.records);
                        updatedLineItemInCardData.messages = updatedLineItemFromAPI.messages;
                        //API knows best
                        parentInCardData.messages = parentFromAPI.messages;

                        // Attempted quantity change of lineItem must have violated Group cardinality check since the UI
                        // has checked for PCI cardinality violation via lineFieldValidation() in this controller
                        if (parentFromAPI.messages.length && parentFromAPI.messages[0].code === '142') {
                            // then record the quantity invalid if it has not been done before
                            recordLineItemQuantityInvalid(updatedLineItemFromAPI);

                        // this is the case when update is successful BUT there is other error such as required product attribuyte missing
                        } else if (updateSuccessful) {

                            parentInCardData[$scope.nsPrefix + 'InCartQuantityMap__c'] = parentFromAPI[$scope.nsPrefix + 'InCartQuantityMap__c'];
                            copyUpdatableFields(updatedLineItemInCardData, updatedLineItemFromAPI, updateAttributeData);

                            // Now that update is successful, lineItem Quantity field must have passed Group cardinality check by API,
                            // so mark it valid in case it was invalid before
                            recordLineItemQuantityValid(updatedLineItemFromAPI);

                        }

                    }
                },
                 function(error) {
                     $scope.handleRemoteCallError(null, error, true, false);
                 }
             );
        };

        var recordLineItemQuantityInvalid = function(item) {
            if (!_.includes($scope.lineItemIdsWithInvalidQuantity, item.Id.value)) {
                $scope.lineItemIdsWithInvalidQuantity.push(item.Id.value);
            }
        };

        var recordLineItemQuantityValid = function(item) {
            recordLineItemFieldValid($scope.lineItemIdsWithInvalidQuantity, item);
        };

        var recordLineItemFieldValid = function(invalidList, item) {
            if (_.includes(invalidList, item.Id.value)) {
                _.pull(invalidList, item.Id.value);
            }
        };

        var copyUpdatableFields = function(targetLineItem, sourceLineItem, updateAttributeData) {
            targetLineItem.Quantity.value = sourceLineItem.Quantity.value;
            targetLineItem[$scope.nsPrefix + 'RecurringTotal__c'].value = sourceLineItem[$scope.nsPrefix + 'RecurringTotal__c'].value;
            targetLineItem[$scope.nsPrefix + 'OneTimeTotal__c'].value = sourceLineItem[$scope.nsPrefix + 'OneTimeTotal__c'].value;
            targetLineItem[$scope.nsPrefix + 'RecurringManualDiscount__c'].value = sourceLineItem[$scope.nsPrefix + 'RecurringManualDiscount__c'].value;
            targetLineItem[$scope.nsPrefix + 'OneTimeManualDiscount__c'].value = sourceLineItem[$scope.nsPrefix + 'OneTimeManualDiscount__c'].value;
            targetLineItem.messages = sourceLineItem.messages;
            if (updateAttributeData) {
                targetLineItem.attributeCategories = sourceLineItem.attributeCategories;
            }
        };

        var findLineItem = function(searchLineItemId, lineItemList) {
            var foundLineItem = null;
            var i, j;
            for (i = 0; i < lineItemList.length; i++) {
                if (lineItemList[i].Id.value === searchLineItemId) {
                    foundLineItem = lineItemList[i];
                    break;
                }
            }
            if (foundLineItem !== null) {
                return foundLineItem;
            } else {
                for (j = 0; j < lineItemList.length; j++) {
                    if (lineItemList[j].lineItems && lineItemList[j].lineItems.records.length > 0) {
                        return findLineItem(searchLineItemId, lineItemList[j].lineItems.records);
                    }
                }
            }
        };

        var lineFieldValidation = function(item) {
            var msg = '';
            var label;

            var recurringValue = item[$scope.nsPrefix + 'RecurringManualDiscount__c'].value;
            var oneTimeValue = item[$scope.nsPrefix + 'OneTimeManualDiscount__c'].value;

            var recurringDiscount = (recurringValue !== undefined && recurringValue !== null) ? true : false;
            var oneTimeDiscount = (oneTimeValue !== undefined && oneTimeValue !== null) ? true : false;
            var isDiscountValid = (recurringDiscount && oneTimeDiscount) ? true : false;
            var isQuantityValid = (item.Quantity.value && item.Quantity.value >= 1) ? true : false;

            // label
            if (!isQuantityValid) {
                label = item.Quantity.label;
            } else if (!recurringDiscount) {
                label = item[$scope.nsPrefix + 'RecurringManualDiscount__c'].label;
            } else if (!oneTimeDiscount) {
                label = item[$scope.nsPrefix + 'OneTimeManualDiscount__c'].label;
            }

            // message
            if (!isQuantityValid) {
                msg = label + ' cannot be set to 0. Please use the delete option if you would like to delete the item.';
                // Record the lineItemId has an invalid quantity if it has not been done
                recordLineItemQuantityInvalid(item);
            } else if (!isDiscountValid) {
                msg = label + ' cannot be empty.';
            } else if (item.Quantity.value < item.minQuantity) {
                msg = item.Name + ' can not have less than ' + item.minQuantity + ' quantity.';
                // Record the lineItemId has an invalid quantity if it has not been done
                recordLineItemQuantityInvalid(item);
            } else if (item.Quantity.value > item.maxQuantity) {
                msg = item.Name + ' can not have more than ' + item.maxQuantity + ' quantity.';
                // Record the lineItemId has an invalid quantity if it has not been done
                recordLineItemQuantityInvalid(item);
            }

            return msg;
        };

        //### VDF Section Start ###

        // Vlocity Dynamic form mapping object
        $scope.mapVDFObject = function() {
            return {
                'fieldMapping' : {
                    'type' : 'inputType',
                    'value' : 'userValues',
                    'label' : 'label',
                    'readonly':'readonly',
                    'required': 'required',
                    'disabled': 'disabled',
                    'hidden': 'hidden',
                    'multiple': 'multiselect',
                    'customTemplate': 'customTemplate',
                    'valuesArray' : { //multiple values map. Eg: select, fieldset, radiobutton group
                        'field': 'values',
                        'value': 'value',
                        'label': 'label',
                        'disabled': 'disabled'
                    }
                },
                'pathMapping': {
                    'levels': 2,
                    'path': 'productAttributes.records'
                }
            };
        };

        /*********** CPQ CART ITEM CONFIG EVENTS ************/
        $scope.openConfigPan = function(parent, gParent, itemObject, isConfigEnabled) {
            var itemKeys, lookupItem, editableItem, lookupDisplayValueItemKey, cartId, lineItemId;
            $scope.reRenderAttributesForm = false;
            $scope.configAttributeObj = null;
            $scope.configItemObject = itemObject;
            $scope.parent = parent;
            $scope.gParent = gParent;

            if(!isConfigInProcess)
                queue = [];
            else
                removeQueueElement();

            $timeout(function(){
                if (isConfigEnabled && itemObject) {
                    $scope.configAttributeObj = itemObject.attributeCategories && itemObject.attributeCategories.records || [];
                    updatedAttributes = $scope.attributesObj;
                    $scope.reRenderAttributesForm = isConfigEnabled;
                    //Set reRenderAttributesForm to false on new load. If user closes

                    queue.push({
                        parent: $scope.parent,
                        gParent: $scope.gParent,
                        configItem: $scope.configItemObject,
                        updatedAttributes: $scope.configAttributeObj
                    });

                    itemKeys = _.keys(itemObject);
                    $scope.lookupItemList = [];
                    $scope.editableItemList = [];
                    cartId = $scope.bpTree.response.cartId;
                    lineItemId = itemObject.Id.value;
                    angular.forEach(itemKeys, function(key) {
                        if (itemObject[key].editable && !itemObject[key].hidden) {
                            if (itemObject[key].dataType === 'REFERENCE') {
                                lookupItem = angular.copy(itemObject[key]);
                                lookupDisplayValueItemKey = key.slice(0, -1) + 'r';
                                if(itemObject[lookupDisplayValueItemKey]) {
                                    lookupItem.displayValue = itemObject[lookupDisplayValueItemKey].Name;
                                    lookupItem.cartId = cartId;
                                    lookupItem.lineItemId = lineItemId;
                                    $scope.lookupItemList.push(lookupItem);
                                }
                            } else {
                                editableItem = angular.copy(itemObject[key]);
                                $scope.editableItemList.push(editableItem);
                            }
                        }
                    });
                } else {
                    // Remove the vdf form by resetting the attributes and itemObject
                    $scope.configAttributeObj = null;
                    $scope.configItemObject = null;
                    $scope.reRenderAttributesForm = false;
                }
            },0);

        };

        $scope.closeAttributePanel = function() {
            $scope.reRenderAttributesForm = false;
            $scope.configAttributeObj = null;
            $scope.configItemObject = null;
            $scope.parent = null;
            $scope.gParent = null;
            removeQueueElement();
        };

        /*********** END CPQ CART ITEM CONFIG EVENTS ************/

        $scope.getModifiedAttributes = function(e, alwaysRunRules, alwaysSave) {
            var modifyAttributesActionObj = angular.copy($scope.configItemObject.actions.modifyattributes);
            var attributesObj = {'records':[]};
            var itemObject = angular.copy($scope.configItemObject);
            var cherryPickItemObjectFields = ['attributeCategories', 'Id', 'Product2', 'PricebookEntry', 'PricebookEntryId'];
            var field, modelPath, executeRules, activeInputElement, opt={};
            removeQueueElement();
            isConfigInProcess = true;
            modelPath = e && e.target && e.target.getAttribute('ng-model');
            field = getFieldObjectFromPath(modelPath);
            executeRules = (angular.isDefined(alwaysRunRules) && alwaysRunRules) ? true : field && field.hasRules;
            if (!executeRules) {
                if (alwaysSave) {
                    saveTimeout = $timeout(function () {
                        $scope.configSubmit();
                    }, 800);
                }
                return;
            }

            //Update itemObject.attributeCategories but first make sure itemObject has attributes
            if ($scope.configItemObject.attributeCategories && $scope.configItemObject.attributeCategories.records) {
                $scope.configItemObject.attributeCategories.records = $scope.configAttributeObj;
            }
            //Pass only the attribtues and mandatory fields for API to be performant.
            attributesObj.records[0] = _.pick(itemObject, cherryPickItemObjectFields);

            modifyAttributesActionObj.remote.params.items = attributesObj;

            var configObj = {sClassName:className,sMethodName:'putItemAttributes',input:angular.toJson(modifyAttributesActionObj.remote.params),
                            options:angular.toJson(opt),iTimeout:null,label:null};
            $rootScope.loading = true;
            bpService.OmniRemoteInvoke(configObj).then(
                function(data) {
                    $rootScope.loading = false;
                    data = angular.fromJson(data);
                    var attributesModified = false;
                    if (data.records.length > 0) {
                        attributesModified = data.messages.some(function(msg) {
                            return (msg.code === '161');
                        });

                        if (attributesModified) {
                            activeInputElement = document.activeElement;
                            $scope.reRenderAttributesForm = true;

                            // Update attribute categories
                            $scope.configItemObject.attributeCategories = data.records[0].attributeCategories;
                            $scope.configAttributeObj = data.records[0].attributeCategories.records || [];

                            // Run after the current call stack is executed.
                            // Rerenders VDF to reflect new attribute changes
                            $timeout(function() {
                                $scope.reRenderAttributesForm = false;
                                $timeout(function () {
                                    $scope.configSubmit();
                                }, 800);
                            }, 0);
                        }else {
                            //Handle the usecase when hasRules flag is true and attributes are not modified
                            $scope.configSubmit();
                        }
                    }
                },
                 function(error) {
                     $scope.handleRemoteCallError(null, error, true, false);
                 }
             );
        };

        $scope.configSubmit = function() {
            var updateItemsActionObj = {};
            var configUpdateObject = {'records': [{}]}; // Update attributes API structure
            var deleteArrayList = ['Attachments', 'attributes', 'childProducts', 'lineItems', 'childRecords'];
            var opt={};
            setProcessingLine($scope.configItemObject, true);

            //Update itemObject.attributeCategories but first make sure itemObject has attributes
            if (queue[0].configItem.attributeCategories && queue[0].configItem.attributeCategories.records) {
                queue[0].configItem.attributeCategories.records = queue[0].updatedAttributes;
            }

            if (queue[0].parent) {
                // update on a lineItem that has a parent
                configUpdateObject.records[0] = angular.copy(queue[0].parent);
                angular.forEach(deleteArrayList, function(key) {
                    delete configUpdateObject.records[0][key];
                });

                modifiedChildItemObject = angular.copy(queue[0].configItem);
                angular.forEach(deleteArrayList, function(key) {
                    delete modifiedChildItemObject[key];
                });

                configUpdateObject.records[0].lineItems = {'records': [modifiedChildItemObject]};
            } else {
                // update on the root which has no parent
                configUpdateObject.records[0] = angular.copy(queue[0].configItem);
                angular.forEach(deleteArrayList, function(key) {
                    delete configUpdateObject.records[0][key];
                });
            }

            updateItemsActionObj = Object.keys(queue[0].configItem.actions.updateitems.remote.params).length > 0 ? queue[0].configItem.actions.updateitems.remote.params : (Object.keys(queue[0].configItem.actions.updateitems.rest.params).length > 0 ? queue[0].configItem.actions.updateitems.rest.params : null );
            //Updated items for both remote and rest
            updateItemsActionObj.items = configUpdateObject;

            //delete extra fluff to fix HYB-761
            delete updateItemsActionObj.items.records[0].actions;

            var configObj = {sClassName:className,sMethodName:'putCartsItems',input:angular.toJson(updateItemsActionObj),
                            options:angular.toJson(opt),iTimeout:null,label:null};
            $rootScope.loading = true;
            bpService.OmniRemoteInvoke(configObj).then(
                function(res) {
                    var configObjCart = {sClassName:className,sMethodName:'getCarts',input:angular.toJson(updateItemsActionObj),
                             options:angular.toJson(opt),iTimeout:null,label:null};
                    bpService.OmniRemoteInvoke(configObjCart).then(
                        function(result) {
                            $rootScope.loading = false;
                            var resp = angular.fromJson(result);
                            $scope.bpTree.response.vlcPersistentComponent[$scope.bpTree.pcId[0]+'_Top'] = [resp];
                            $scope.showErrorIconInCart($scope.bpTree.response.vlcPersistentComponent[$scope.bpTree.pcId[0]+'_Top'][0].messages, $scope);
                            var bundlehasError = false, msgArry = [], msgIdArray;
                            angular.forEach(resp.messages, function(message) {
                                if (message.severity === 'ERROR')
                                    bundlehasError = true;
                                    msgIdArray = message.messageId.split('|');
                                if (message.severity === 'ERROR' && $scope.gParent && $scope.gParent.Id.value == msgIdArray[0] && $scope.gParent['PricebookEntry']['Product2Id'] == msgIdArray[1]) {
                                    msgArry.push(message);
                                }
                            });

                            if(!bundlehasError && $scope.gParent)
                                $scope.gParent.messages = resp.messages;
                            if(bundlehasError && $scope.gParent && msgArry.length > 0 )
                                $scope.gParent.messages = msgArry;
                        },
                        function(error) {
                            $scope.handleRemoteCallError(control, resp.error, true, false);
                        }
                    );
                    var data = angular.fromJson(res);
                    var updatedItemObj = data.records[0];
                    var hasError = false;
                    var updateSuccessful = false;

                    angular.forEach(data.messages, function(message) {
                        if (message.severity === 'ERROR') {
                            hasError = true;
                        }

                        if (message.severity === 'INFO' && message.code === '151') {
                            updateSuccessful = true;
                        }
                    });

                    if (updateSuccessful) {
                        //Handle check for itemObject existence. If user closes config panel before the update response is received
                        for(var i=0; i<queue.length; i++) {
                            if (queue[i].configItem && queue[i].configItem.Id.value === data.records[0].Id.value) {
                                // Update API is returning the empty actions object. Deleting actions before merge
                                // as a temporary fix.
                                delete updatedItemObj.actions;
                                _.assign(queue[i].configItem, updatedItemObj);
                                break;
                            } else if(queue[i].parent && queue[i].parent.Id.value === updatedItemObj.Id.value) {
                                angular.copy(updatedItemObj.messages, queue[i].parent.messages);
                                if(queue[i].configItem.Id.value === updatedItemObj.lineItems.records[0].Id.value)
                                    _.assign(queue[i].configItem, updatedItemObj.lineItems.records[0]);
                                setProcessingLine(data.records[0], false);
                                break;
                            }
                        }
                    }

                    setProcessingLine($scope.configItemObject, false);
                    isConfigInProcess = false;

                }, function(error) {
                       $rootScope.loading = false;
                }
            );

        };

        /**
         * getFieldObjectFromPath returns field based on the ng-model path
         * @param  {string} path
         * @return {Object}
         */
        function getFieldObjectFromPath(path) {
            var firstDotIndex;
            var lastDotIndex;
            if (!path) {
                return;
            }

            lastDotIndex = path.lastIndexOf('.');
            if (lastDotIndex != -1) {
                path = path.substring(0, lastDotIndex);
            }

            return _.get($scope, path);
        }

        function setProcessingLine(obj, flag) {
            if (obj) {
                obj.processingLine = flag;
            }
        }

        function removeQueueElement() {
            if (queue.length > 1) {
                queue.shift();
            }
        }

        // Addition Settings section
/*
        $scope.launchLineItemLookup = function(lookupItem) {
            var lookupFieldName = lookupItem.fieldName;
            var lookupDisplayValueItemFieldName = lookupFieldName.slice(0, -1) + 'r';
            $scope.selectedLookupItemFieldName = lookupFieldName;
            $scope.originalLookupItem = $scope.configItemObject[lookupFieldName];
            $scope.originalDisplayValueLookupItem = $scope.configItemObject[lookupDisplayValueItemFieldName];
            $rootScope.selectedLookupItem = {
                'Id': lookupItem.value,
                'Name': lookupItem.displayValue
            };
            $rootScope.createNewResultMsg = null;

            $sldsModal({
                backdrop: 'static',
                animation: true,
                templateUrl: 'CPQCartItemLookupFieldModal.html',
                show: true,
                onHide: function() {
                    refreshLookupItem();
                }
            });
        };

        var refreshLookupItem = function() {
            $log.debug('refreshLookupItem: $rootScope.selectedLookupItem: ', $rootScope.selectedLookupItem);
            var changedFieldName = $scope.selectedLookupItemFieldName;
            var changedToId = $rootScope.selectedLookupItem.Id;
            var changedToValue = $rootScope.selectedLookupItem.Name;
            for (var i = 0; i < $scope.lookupItemList.length; i++) {
                if ($scope.lookupItemList[i].fieldName === changedFieldName) {
                    $scope.lookupItemList[i].value = changedToId;
                    $scope.lookupItemList[i].displayValue = changedToValue;
                    break;
                }
            }
            $log.debug('$scope.originalLookupItem: ', $scope.originalLookupItem);
            $scope.originalLookupItem.value = changedToId;
            $log.debug('$scope.originalDisplayValueLookupItem: ', $scope.originalDisplayValueLookupItem);
            $scope.originalDisplayValueLookupItem.Id = changedToId;
            $scope.originalDisplayValueLookupItem.Name = changedToValue;
            $scope.configSubmit();
        };

        $scope.refreshEditableField = function(editableItem, alwaysSave) {
            var error_msg, changedValue, originalEditableItem, isValidFieldValue;
            var recurringValue = $rootScope.nsPrefix + 'RecurringManualDiscount__c';
            var oneTimeValue = $rootScope.nsPrefix + 'OneTimeManualDiscount__c';
            var recurringPrice = $rootScope.nsPrefix + 'RecurringCalculatedPrice__c';
            editableItem.qtyValidationMessage = '';

            if (editableItem.fieldName == recurringValue || editableItem.fieldName == oneTimeValue || editableItem.fieldName == recurringPrice) {
                if (editableItem.value >= 0 && editableItem.value < 100) {
                    isValidFieldValue = true;
                } else {
                    isValidFieldValue = false;
                }
            }

            if (editableItem.fieldName.toLowerCase() == 'quantity') {
                if (angular.isUndefined(editableItem.value) || editableItem.value < 1) {
                    error_msg = editableItem.fieldName + ' must be greater than 0.';
                } else if (editableItem.value < $scope.configItemObject.minQuantity) {
                    error_msg = editableItem.fieldName + ' cannot have less than ' + $scope.configItemObject.minQuantity + ' quantity.';
                } else if (editableItem.value > $scope.configItemObject.maxQuantity) {
                    error_msg = editableItem.fieldName + ' cannot have more than ' + $scope.configItemObject.maxQuantity + ' quantity.';
                }
            } else if (angular.isDefined(isValidFieldValue) && !isValidFieldValue) {
                error_msg = editableItem.label + ' must be greater than or equal to 0, and smaller than 100.';
            }

            if (error_msg) {
                editableItem.qtyValidationMessage = error_msg;
            } else {
                changedValue = editableItem.value;
                originalEditableItem = $scope.configItemObject[editableItem.fieldName];
                originalEditableItem.value = changedValue;
            }

            if (!error_msg && alwaysSave) {
                $scope.configSubmit();
            }
        };
*/
        //### VDF Section End ###
        // Show Error messages in top cart
        $scope.showErrorIconInCart = function(msgArr) {
            if(!msgArr) {
                $scope.showErrorIcon = false;
                return;
            }
            for(var i=0; i<msgArr.length; i++) {
                if(msgArr[i].severity === 'ERROR')
                    $scope.showErrorIcon = true;
            }

            if(msgArr.length === 0)
                $scope.showErrorIcon = false;

            $scope.bpTree.response.canOrderCheckout = !$scope.showErrorIcon;

        }
    });

    //######################## hybridCPQCartController End ########################

    //######################## ModalEditBlockCtrl Start ########################
     bpModule.controller('ModalEditBlockCtrl', function ($scope, $rootScope, $timeout, bpService, mElementScp, mControl, mIsElementAdded, mOperation) {
         //SFDC Labels Starts
         $scope.OmniConfigProdModalOk = customLabels.OmniConfigProdModalOk;
         $scope.OmniConfigProdModalCancel = customLabels.OmniConfigProdModalCancel;
         $scope.OmniEditBlockModalTitle = mControl.propSetMap.label;
         //SFDC Labels Ends
         $scope.elementScp = mElementScp;
         $scope.control = mControl;
         $scope.bpService = bpService;
         $scope.isElementAdded = mIsElementAdded;
         $scope.mOperation = mOperation;
         $scope.elementScp.editBlockIndex = $scope.isElementAdded.index;
         $scope.elementScp.editBlockName = mControl.name;
         $scope.elementScp.inlineEditBlock = mControl.hasOwnProperty("showInlineEBRow");
         $scope.control.modalClosed = false;
         var ctrl = angular.copy(mControl),
             newAction = ctrl.propSetMap.newAction,
             editAction = ctrl.propSetMap.editAction,
             actionCtrl = null,
             payload = {};

         $scope.saveEditChanges = function(evt) {
             // (1) first level check: allowNew, allowEdit, allowDelete, they determine whether New/Edit/Delete link/button displays
             // if there are no actions attached to them, then default will be JSON New/Edit/Delete
             // (2) if there are actions attached to them, then it will be JSON+remote call New/Edit/Delete
             if(/new$/.test($scope.mOperation) && newAction)
                actionCtrl = newAction;
             else if(/edit$/.test($scope.mOperation) && editAction)
                actionCtrl = editAction;

             payload = $scope.control.response;

             if(actionCtrl) {
                 if(angular.equals(actionCtrl.type, 'Remote Action') &&
                     angular.equals(actionCtrl.propSetMap.remoteClass, "DefaultOmniScriptEditBlock")) {
                     actionCtrl.propSetMap.remoteOptions.sobjectMapping = $scope.control.propSetMap.sobjectMapping;
                     actionCtrl.propSetMap.remoteOptions.selectSobject = $scope.control.propSetMap.selectSobject;
                 }
                 $scope.buttonClick(payload, actionCtrl, $scope.elementScp, null, 'vlcEBOperation', null, function(result){
                     if(result)
                        $scope.$dismiss('cancel', evt);
                 });
             } else {
                 $scope.$dismiss('cancel', evt);
             }
             // reset noformatterEBModal of the child controls

             resetNoFormatter($scope.control);
             $scope.aggregate($scope.elementScp.$parent, $scope.control.index, $scope.control.indexInParent, true, -1);
             evt.preventDefault();
         };

         $scope.closeModal = function(evt) {
             var resp={};
             resp[ctrl.name] = angular.copy(ctrl.response);
             resetNoFormatter($scope.control);
             $scope.control.modalClosed = true;
             if($scope.isElementAdded.added) {
                 $scope.elementScp.removeItemEditBlock($scope.isElementAdded.child, $scope.isElementAdded.index, $scope, $scope.isElementAdded.added, $scope.elementScp);
             } else {
                     $scope.applyCallResp(resp, false, null, $scope.control, $scope.elementScp.editBlockIndex);
                     $scope.control.response = ctrl.response;
                     $timeout(function() {
                        $scope.aggregate($scope.elementScp.$parent, $scope.control.index, $scope.control.indexInParent, true, -1);
                     });
             }
            $scope.$dismiss('cancel', evt);
            if(evt) {
                evt.preventDefault();
            }
         };

     });

     //######################## ModalEditBlockCtrl End ########################

/* adding a class check b4 animating the
 * elements
*/
(function(){
    'use strict';

    if(sfdcVars.layout !== 'lightning' && sfdcVars.layout !== 'newport'){
        return;
    }

    if (!animate){
      return;
    }

    var dModule = angular.module('vlocity-business-process');
    dModule.config(function($animateProvider){
        $animateProvider.classNameFilter([/\banimate\-*\b/,/\bam-fade\-*\b/] );
    });
    dModule.config(['remoteActionsProvider', function(remoteActionsProvider)
            { remoteActionsProvider.setRemoteActions(remoteActionMap); }
    ]);
}());

},{}],72:[function(require,module,exports){
//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}
},{}],73:[function(require,module,exports){
/**
 * Module: sharedObjectService[For using common data/Object for using in different controller]
 */
angular.module('sharedObjectService', [])

    /**
     * Factory NotSupportedElmService[For getting non supported element for base template]
     * @param  {[function]} 
     * @return {[Service]}
     */
    .factory('NotSupportedElmService', function() {
        var NotSupportedElmService;

        NotSupportedElmService = (function() {
            function NotSupportedElmService() {}

            /**
             * [getList return list of not supported element in Base template]
             * @return {[type]} [object]
             */
            NotSupportedElmService.prototype.getList = function() {
                return {
                    "Image": "Image",
                    "Block": "Block",
                    "File": "File",
                    "Disclosure": "Disclosure",
                    "Headline": "Headline",
                    "Validation": "Validation",
                    "Line Break": "Line Break",
                    "Text Block": "Text Block",
                    "Radio Group": "Radio Group",
                    "Type Ahead Block":"Type Ahead Block"
                }
            };
            return NotSupportedElmService;
    })();

    if (typeof(window.angularSharedService) === 'undefined' || window.angularSharedService === null) {
        window.angularSharedService = new NotSupportedElmService();
    }

    return window.angularSharedService;
});
},{}]},{},[1]);
})();

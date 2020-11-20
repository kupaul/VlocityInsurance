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
if(window.sessionId === '{!$Api.Session_ID}')
    window.OmniOut = true;

require('./polyfills/Object.assign.js');

//omni-out
require('./modules/omni-out/main.js');

(function(){
	angular.module('vlocity-bot-form', []);
	angular.module('vlocity-oui-common', []);
	if(window.cbModuleList === 'default') {
	    window.cbModuleList = [
	                            "forceng",
	                            "vlocity-oui-common",
	                            "vlocity-bot-form",
	                            "sldsangular",
	                            "ui.utils.masks",
	                            "viaDirectives",
	                            "ui.mask",
	                            "ngAria"
	                          ];

	    if(window.OmniOut) {
	        window.cbModuleList.push('vlocity-omni-out');
	    }	    
	}
	else {
	    window.cbModuleList = window.cbModuleList.split(',');
	}

	angular.module('vlocity-chat-bot', window.cbModuleList);
})();

// shared
require('./modules/common/shared/osLabelSet.js');
require('./modules/common/shared/misc.js');
require('./modules/common/factory/baseService.js');
require('./modules/common/directives/baseChainup.js');

// controller
require('./modules/common/controller/OmniFormController.js');
require('./modules/chatBot/controller/chatClientController.js');

// factory
require('./modules/chatBot/factory/chatBotFactory.js');
require('./modules/common/factory/currencySymbol.js');

// directive
require('./modules/common/directives/OmniForm.js');
require('./modules/common/directives/OmniFormChild.js');
require('./modules/common/directives/appFileReader.js');
require('./modules/common/directives/vlcDateTimeFormatVal.js');
require('./modules/common/directives/vlcSldsValChecker.js');
require('./modules/common/directives/vlcSldsNgPattern.js');
require('./modules/common/directives/vlcSldsMinMaxLen.js');
require('./modules/common/directives/vlcSldsCheckValChecker.js');
require('./modules/common/directives/vlcSldsBubbleCanceller.js');
require('./modules/common/directives/vlcSldsValCheckCurrency.js');
require('./modules/common/directives/vlcSldsMuValChecker.js');
require('./modules/common/directives/vlcSldsFileSelect.js');
require('./modules/common/directives/vlcSldsNumValChecker.js');
require('./modules/common/directives/vlcSldsOnlyNumeric.js');
require('./modules/common/directives/vlcRangeSlider.js');
require('./modules/common/directives/vlcLookupControl.js');
require('./modules/common/directives/vlcBindHtml.js')
require('./modules/common/directives/vlcSldsToolTip.js');


require('./modules/chatBot/directives/chatMessage.js');
require('./modules/chatBot/directives/chatScrollUpdate.js');


},{"./modules/chatBot/controller/chatClientController.js":2,"./modules/chatBot/directives/chatMessage.js":3,"./modules/chatBot/directives/chatScrollUpdate.js":4,"./modules/chatBot/factory/chatBotFactory.js":5,"./modules/common/controller/OmniFormController.js":6,"./modules/common/directives/OmniForm.js":7,"./modules/common/directives/OmniFormChild.js":8,"./modules/common/directives/appFileReader.js":9,"./modules/common/directives/baseChainup.js":10,"./modules/common/directives/vlcBindHtml.js":11,"./modules/common/directives/vlcDateTimeFormatVal.js":12,"./modules/common/directives/vlcLookupControl.js":13,"./modules/common/directives/vlcRangeSlider.js":14,"./modules/common/directives/vlcSldsBubbleCanceller.js":15,"./modules/common/directives/vlcSldsCheckValChecker.js":16,"./modules/common/directives/vlcSldsFileSelect.js":17,"./modules/common/directives/vlcSldsMinMaxLen.js":18,"./modules/common/directives/vlcSldsMuValChecker.js":19,"./modules/common/directives/vlcSldsNgPattern.js":20,"./modules/common/directives/vlcSldsNumValChecker.js":21,"./modules/common/directives/vlcSldsOnlyNumeric.js":22,"./modules/common/directives/vlcSldsToolTip.js":23,"./modules/common/directives/vlcSldsValCheckCurrency.js":24,"./modules/common/directives/vlcSldsValChecker.js":25,"./modules/common/factory/baseService.js":26,"./modules/common/factory/currencySymbol.js":27,"./modules/common/shared/misc.js":28,"./modules/common/shared/osLabelSet.js":29,"./modules/omni-out/main.js":32,"./polyfills/Object.assign.js":34}],2:[function(require,module,exports){
// chat client controller
// directive - chat msg    
angular.module('vlocity-chat-bot').controller('vlcChatCtrl', chatCtrl);

function chatCtrl($scope, ouiBaseService, force, $sce, $q, $window, $timeout) {
    // handle remote call outside SFDC
    VOUINS.initiateForce($scope, force);

    $scope.isSforce = ( (typeof sforce != 'undefined') && (sforce != null) )?(true):(false);
    $scope.sforce = (typeof sforce != 'undefined')?sforce:null;
    
    // chatbot icon url
    $scope.chatBotIconUrl = chatBotIconUrl;

    // chatbot styling
    $scope.mode = (!sfdcVars.mode || sfdcVars.mode == '') ? null : sfdcVars.mode;

    // labels
    $scope.customLabels = customLabels;
    
    // conversation history
    $scope.convHistory = [];
    // user typed in text
    $scope.typeInMsg = {"text":''}; 
    // data JSON of the bot
    $scope.botJSON = {};
    
    // bot Name passed in from VF component
    $scope.DfltIPkey = sfdcVars.botName;
    // url Params
    var queryParams = sfdcVars.urlParams;
    // outside SFDC
    if(window.OmniOut) {
        queryParams = VOUINS.getQueryParams();
    }
    if(queryParams && queryParams.constructor === Object) {
        for (var key in queryParams) {
            if(queryParams.hasOwnProperty(key)) {                     
                if(queryParams[key] === 'true')
                    queryParams[key] = true;
                if(queryParams[key] === 'false')
                    queryParams[key] = false;                                    
            }
        }
        // query param included in bot data JSON
        (_.mergeWith||_.merge)($scope.botJSON, queryParams, VOUINS.mergeJSONLogic);           
    }     
    
    // url param botName overwrites the VF component attribute 
    if(queryParams) {
        if(queryParams.botName) {
            $scope.DfltIPkey = queryParams.botName;
        }
        if(queryParams.mode) {
            $scope.mode = queryParams.mode;
        }
    }
    
    // omniform counter
    $scope.ofc = 0;
    $scope.ofcCount = 0;
    // display only form counter
    $scope.displayFormIndex = -1;
    // bot send message counter 
    $scope.sendMsgCounter = 0;
    
    // new OmniForm attributes, omni-input, prefill, output, submit-params, cancel-params
    // omni-input
    $scope.respBotForm;
    // prefill-input
    $scope.chatPrefill = {};
    // output
    $scope.chatOutput = {};
    // submit-params
    var dftSubmitParams = {extraInput:{input:{text:'yes'}}};
    $scope.submitParams = dftSubmitParams;
    // cancel-params
    var dftCancelParams = {extraInput:{input:{text:'no'}}, inputIP:$scope.DfltIPkey};
    $scope.cancelParams = dftCancelParams;
    $scope.debug = queryParams.debug;
    if($scope.debug !== true)
        $scope.debug = false;
                                    
    // scope send message function
    $scope.sendMessage = function(msg) {
        // first time, if url param 'userInput' comes in, then initialize the first 
        // AI call with that
        if($scope.sendMsgCounter == 0) {
            if(queryParams.userInput) {
                $scope.typeInMsg.text = queryParams.userInput;
            }
            $scope.sendMsgCounter++;
        }
        else {
            $scope.sendMsgCounter++;
            
            // sendMessage is not triggered if the user input is blank (except the very first time)
            if(!$scope.typeInMsg.text)
                return;            
        }
        
        // user input - push into chat history
        if($scope.typeInMsg.text) {
            $scope.convHistory.push({type:"userMsg",text:$scope.typeInMsg.text});
        }
                
        var payload = {};  
        // TO BE DONE: make it abstract to work with other AIs
        // Watson context object
        if($scope.context) {
            payload.context = $scope.context;
        }
        
        // display form JSON
        // if data JSON of the display form is not blank, merge it into bot JSON 
        // so that later conversation can use it
        if($scope.displayFormIndex >= 0) {
            if($scope.convHistory[$scope.displayFormIndex].control.OmniDef.response) {
                (_.mergeWith||_.merge)($scope.botJSON, $scope.convHistory[$scope.displayFormIndex].control.OmniDef.response, VOUINS.mergeJSONLogic); 
            }
            $scope.displayFormIndex = -1;
        }
        
        // (1) payload - first merge in bot JSON 
        (_.mergeWith||_.merge)(payload, $scope.botJSON, VOUINS.mergeJSONLogic);          
        // bot form for the user to fill in
        // (2) payload - then merge in editable form JSON
        var option = {};
        // payload - merge in user input
        payload.input = {text:$scope.typeInMsg.text};                           
        $scope.typeInMsg.text = "";
                 
        // call bot IP 
        var configObj = {sClassName:sfdcVars.sNS+".IntegrationProcedureService",sMethodName:$scope.DfltIPkey,input:angular.toJson(payload),
                         options:angular.toJson(option),iTimeout:120000,label:""}; 
        
        // debug capability
        if($scope.debug) {
            var dbgConfigObj = {sClassName:sfdcVars.sNS+".IntegrationProcedureService",sMethodName:$scope.DfltIPkey,input:payload,
                                options:option,iTimeout:120000,label:""}; 
            $scope.convHistory.push({type:"debugJSON",text:'TO SERVER: '+JSON.stringify(dbgConfigObj, null, 2)});
        }        
        ouiBaseService.OmniRemoteInvoke(configObj).then(
            function(result)
            {                   
                var remoteResp = angular.fromJson(result);
                
                // debug capability
                if($scope.debug) {
                    $scope.convHistory.push({type:"debugJSON",text:'FROM SERVER: '+JSON.stringify(angular.copy(remoteResp), null, 2)});
                }                
                
                if(remoteResp.error) {
                    if(remoteResp.error !== 'OK') {
                        $scope.convHistory.push({type:"botMsg","text":$sce.trustAsHtml($scope.customLabels.ChatBotNotAvailable)}); 
                        console.log('BOT error: ' + angular.toJson(remoteResp.error));                         
                    }
                    else {
                        var ipResult = remoteResp.IPResult;
                        $scope.updateChat(ipResult);                       
                    }                        
                }
            },
            function(error)
            {
                $scope.convHistory.push({type:"botMsg","text":$sce.trustAsHtml($scope.customLabels.ChatBotNotAvailable)}); 
                console.log('BOT error: ' + angular.toJson(error));            
            }             
        );                                       
    };
    
    $scope.updateChat = function(ipResult) {
        if(ipResult.output) { 
            // backward compatible
            // in v102, OmniForm action in IP will return OmniInput
            if(ipResult.OmniDef) {
                ipResult.OmniInput = {};
                ipResult.OmniInput.OmniDef = ipResult.OmniDef;
                ipResult.OmniInput.OmniPostAction = ipResult.OmniPostAction;
                ipResult.OmniInput.OmniPrefillJSON = ipResult.OmniPrefillJSON;
                delete ipResult.OmniDef;
                delete ipResult.OmniPostAction;
                delete ipResult.OmniPrefillJSON;
            }
            
            // IP can also sends back JSON to be merged into bot data JSON
            if(ipResult.context) {
                $scope.context = ipResult.context;
            }
            
            if(ipResult.botJSON) {
                (_.mergeWith||_.merge)($scope.botJSON, ipResult.botJSON, VOUINS.mergeJSONLogic); 
            }                             
            
            // bot Message (it's an array)
            if(ipResult.output.text && angular.isArray(ipResult.output.text)) {
                for(var i=0; i<ipResult.output.text.length; i++) {
                    if(ipResult.output.text[i]) {
                        ipResult.output.text[i] = $sce.trustAsHtml(ipResult.output.text[i]);
                        $scope.convHistory.push({type:"botMsg","text":ipResult.output.text[i]});                               
                    }
                }
            }
            
            // display micro-form 
            // display-only form: display as bot message
            // editable form - displays at the bottom of the chat (above the chat text control)
            // once editable form is canceled or submitted, it goes into user message
            if(ipResult.OmniInput && ipResult.OmniInput.OmniDef) {
                ipResult.OmniInput.OmniDef = angular.fromJson(ipResult.OmniInput.OmniDef);
                
                // Main OmniForm at the bottom of chat
                var omniForm = ipResult.OmniInput.OmniDef;
                if(omniForm) {
                    // display only form - displays as chat message
                    $scope.ofc = $scope.ofcCount;    
                    if(omniForm.propSetMap && omniForm.propSetMap.displayOnly) {                              
                        omniForm.sOmniScriptId = omniForm.sOmniScriptId + '--' + $scope.ofc;  
                        if($scope.debug) {
                            ipResult.OmniInput.OmniDef.debug = true;
                        }
                        $scope.convHistory.push({type:"displayBotForm",control:ipResult.OmniInput});                                        
                        $scope.displayFormIndex = $scope.convHistory.length-1;
                    }
                    else {                        
                        $scope.respBotForm = ipResult.OmniInput;
                        $scope.chatPrefill = $scope.botJSON;
                        if($scope.context) {
                            // submit param
                            (_.mergeWith||_.merge)($scope.submitParams.extraInput, {context:$scope.context}, VOUINS.mergeJSONLogic);   
                            (_.mergeWith||_.merge)($scope.submitParams.extraInput, $scope.botJSON, VOUINS.mergeJSONLogic);   
                            $scope.submitParams.inputIP = $scope.DfltIPkey;    
                            
                            // cancel param
                            (_.mergeWith||_.merge)($scope.cancelParams.extraInput, {context:$scope.context}, VOUINS.mergeJSONLogic);   
                            (_.mergeWith||_.merge)($scope.cancelParams.extraInput, $scope.botJSON, VOUINS.mergeJSONLogic);                                                                             
                        }
                    }
                    $scope.ofcCount++;                                    
                }
            }
        }                
    }

    $scope.$watchCollection('chatOutput', function(newValue, oldValue) {
        if(!angular.equals(newValue, oldValue) && newValue) {
            if(newValue.vlcOmniFormStatus === 'submitting' || newValue.vlcOmniFormStatus === 'cancelling') {
                // editable form - push into chat history
                var userMsg;
                if(newValue.vlcOmniFormStatus === 'submitting' && $scope.submitParams 
                   && $scope.submitParams.extraInput && $scope.submitParams.extraInput.input
                   && $scope.submitParams.extraInput.input.text) {
                    userMsg = $scope.submitParams.extraInput.input.text; 
                } 
                else if (newValue.vlcOmniFormStatus === 'cancelling' && $scope.cancelParams 
                         && $scope.cancelParams.extraInput && $scope.cancelParams.extraInput.input
                         && $scope.cancelParams.extraInput.input.text) {
                    userMsg = $scope.cancelParams.extraInput.input.text;                 
                }
                
                if(userMsg) {
                    $scope.convHistory.push({type:"userMsg",text:userMsg});
                }
                if(newValue.vlcOmniFormStatus === 'submitting') {
                    $scope.convHistory.push({type:"botForm", control:angular.copy($scope.respBotForm)}); 
                }
                delete $scope.respBotForm; 
                $scope.submitParams = dftSubmitParams;
                $scope.cancelParams = dftCancelParams;
                $scope.chatPrefill = {};
            }
            else if(newValue.vlcOmniFormStatus === 'submit' || newValue.vlcOmniFormStatus === 'cancel') {
                if(newValue.callSuccess === false) {
                    if(newValue.vlcOmniFormResp) {
                        $scope.convHistory.push({type:"botMsg","text":$sce.trustAsHtml($scope.customLabels.ChatBotNotAvailable)}); 
                        console.log('BOT error: ' + angular.toJson(newValue.vlcOmniFormResp));                               
                    }                    
                }
                else {
                    if(newValue.vlcOmniFormResp && newValue.vlcOmniFormResp.IPResult) {
                        if($scope.debug) {
                            $scope.convHistory.push({type:"debugJSON",text:'FROM SERVER: '+JSON.stringify(angular.copy(newValue.vlcOmniFormResp), null, 2)});
                        }
                        $scope.updateChat(newValue.vlcOmniFormResp.IPResult);
                    }
                }
                $scope.chatOutput = {};
            }
        }
    });    
};   
},{}],3:[function(require,module,exports){
// directive - chat msg    
(function() {
    var app = angular.module('vlocity-chat-bot');
    app.directive('vlcChatMsg', function ($compile, $templateCache, chatService, $timeout) {
        'use strict';         
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            require: '?ngModel',
            scope: false,
            link: function (scope, ele, attrs, ngModel) {
                var htmlMarkup = $templateCache.get(chatService.chatTypeHTMLTpltMap[scope.message.type]);                        
                $compile(htmlMarkup)(scope, function(cloned, scope){
                    ele.append(cloned);

                    /* updated message scroll position */
                    $timeout(function() {
                        scope.$emit('chat_updated');
                    });
                });                    
            }
        };
    });
}()); 
},{}],4:[function(require,module,exports){
//directive to scroll message container to most recent message
(function(){
    var app = angular.module('vlocity-chat-bot');
    app.directive('chatScrollUpdate', function () {
        'use strict';
        return {
            restrict:'A',
            link:function (scope, ele, attrs){
                scope.$on(attrs.chatScrollUpdate, function() {
                    var current = angular.element(ele)[0];

                    var allmsgs = document.querySelectorAll('vlc-chat-msg');
                    var anyusermsgs = document.querySelectorAll('.vlc-chat-user');

                    //temporary hack for DF to prevent scrolling to the bottom of newest message.
                    if(anyusermsgs.length > 0) {
                        current.scrollTop = document.querySelector('.chatbot-msg-container').clientHeight - allmsgs[allmsgs.length - 1].clientHeight;
                    }
                });
            }
        };
    });
}());
},{}],5:[function(require,module,exports){
// directive - bot form child  
(function() {
    var app = angular.module('vlocity-chat-bot');
    app.factory('chatService', function () {
        'use strict'; 
        var factory = {};
        factory.chatTypeHTMLTpltMap = {'botMsg':'vlcChatBotMsg.html', 
                                       'userMsg':'vlcChatUserMsg.html',
                                       'botForm': 'vlcBotForm.html',
                                       'displayBotForm': 'vlcDisplayBotForm.html',                                       
                                       'debugJSON': 'vlcBotDebugJSON.html'};
        // template customization (from VF component attribute)
        (_.mergeWith||_.merge)(factory.chatTypeHTMLTpltMap, sfdcVars.eleTypeToHTMLTemplateMap, VOUINS.mergeJSONLogic);
        
        return factory;
    });
}());
},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
// directive - bot form 
(function() {
    var app = angular.module('vlocity-oui-common');
    app.directive('vlcOmniForm', function ($compile, $timeout, ouiBaseService, currencySymbol, $rootScope) {
        'use strict';      
        return {
            restrict: 'E', 
            // omniInput - child nodes: OmniDef, OmniPostAction, OmniPrefillJSON (returned from OmniForm Action in IP)
            // prefillInput - free form
            // submitParams - child nodes: extraInput, inputIP
            // cancelParams - child nodes: extraInput, inputIP
            // offset - number
            // output 
            scope: {
                mode: '=?',
                omniInput: '=?',
                prefillInput: '<?',
                submitParams: '<?',
                cancelParams: '<?',
                view: '<?',
                offset: '<?',
                output: '=?',
                debug:'<?'
            },
            controller: VOUINS.OmniFormCtrl,
            templateUrl: 'vlcOmniForm.html',
            link: function(scope, element, attrs) {
                // default to null for ng-if to remove watchers
                scope.mode = scope.mode ? scope.mode : null;                
                // styling to console
                scope.console = (scope.mode === 'console');
                scope.omniInput = angular.fromJson(scope.omniInput);

                scope.$watchCollection('omniInput', function(newValue, oldValue) {
                    if(newValue) {
                        if(newValue.OmniDef) {
                            if(newValue.OmniDef.constructor === String) {
                                newValue.OmniDef = angular.fromJson(newValue.OmniDef); 
                                return;
                            }
                            var omniForm = newValue.OmniDef;
                            if(omniForm) {
                                /////// Prefill ///////
                                // OmniForm prefill overwrite order (1) overwrite (2) overwrites (3)
                                // (1) OmniForm prefill - scope.omniInput.OmniPrefillJSON
                                // (2) OmniForm seed data JSON - scope.bpTree.propSetMap.seedDataJSON
                                // (3) OmniForm prefillInput attribute - scope.prefillInput (in chat case, botJSON)
                                scope.prefillInput = scope.prefillInput || {};
                                omniForm.propSetMap.seedDataJSON = omniForm.propSetMap.seedDataJSON || {};
                                scope.omniInput.OmniPrefillJSON = scope.omniInput.OmniPrefillJSON || {};
                                (_.mergeWith||_.merge)(scope.prefillInput, omniForm.propSetMap.seedDataJSON, VOUINS.mergeJSONLogic);
                                (_.mergeWith||_.merge)(scope.prefillInput, scope.omniInput.OmniPrefillJSON, VOUINS.mergeJSONLogic);
                                
                                // debug
                                if(scope.debug === true || omniForm.debug === true) {
                                    omniForm.debug = true;
                                    omniForm.debugArray = omniForm.debugArray || [];
                                }
                                                                
                                // v102 Multi-Lang
                                ouiBaseService.bMultiLang = (omniForm.bpLang === 'Multi-Language')?true:false;  
                                // get LanguageCode
                                ouiBaseService.LanguageCode = scope.prefillInput.LanguageCode;
                                VOUINS.pickListSeeding($rootScope, ouiBaseService, omniForm);
                                                                
                                // only display first step
                                if(omniForm.children && angular.isArray(omniForm.children)) {
                                    var index;
                                    for(index=0; index<omniForm.children.length; index++) {
                                        if(omniForm.children[index].type === 'Step')
                                            break;
                                    }
                                    if(index >= 0) {
                                        omniForm.children = omniForm.children.slice(0, index+1);
                                    }
                                }
                                
                                if(scope.offset !== undefined && scope.offset !== null) {
                                    omniForm.sOmniScriptId = omniForm.sOmniScriptId + '--' + scope.offset;
                                }       

                                scope.bpTree = omniForm;
                                // scope.bpTree.readOnly - uiReadOnly = true, don't need prefill
                                // scope.bpTree.propSetMap.displayOnly - uiReadOnly = true, need prefill
                                if(scope.bpTree.readOnly || scope.bpTree.propSetMap.displayOnly) {
                                    scope.bpTree.uiReadOnly = true;
                                }

                                // enable omniform close flag
                                scope.bpTree.vlcOmniFormClose = scope.bpTree.propSetMap.vlcOmniFormClose;
                                scope.vlcOmniFormSubmitLabel = scope.bpTree.propSetMap.submitLabel || customLabels.OmnisubmitLabel;
                                scope.vlcOmniFormCancelLabel = scope.bpTree.propSetMap.cancelLabel || customLabels.OmnicancelLabel;
                                scope.vlcOmniFormResetLabel = scope.bpTree.propSetMap.resetLabel || 'Reset';

                                // enable to submitted 2 column format
                                if(scope.bpTree.readOnly && scope.view === 'submitted') {
                                    scope.submitted = true;
                                }


                            }

                            if(scope.bpTree) {
                                var customMarkup = VOUINS.loadCustomHTMLJS(scope);
                                if (window.OmniOut){
                                    VOUINS.loadHeaderHTML(scope,$compile);
                                }
                                if(customMarkup !== null) {
                                    $('head').append(customMarkup);
                                    $compile(customMarkup); //will put the same in temp cache
                                }
                                // template customization
                                // the map defined in the header will overwrite elementTypeToHTMLMapOW
                                // elementTypeToHTMLMapOW = VF component attribute overwrites the default map
                                if(!scope.bpTree.elementTypeToHTMLMapOW) {
                                    scope.bpTree.elementTypeToHTMLMapOW = angular.copy(ouiBaseService.elementTypeToHTMLMapOW);
                                    (_.mergeWith||_.merge)(scope.bpTree.elementTypeToHTMLMapOW, scope.bpTree.propSetMap.elementTypeToHTMLTemplateMapping, VOUINS.mergeJSONLogic);
                                }
                                scope.errHTMLId = scope.bpTree.elementTypeToHTMLMapOW['Error Sub Block'];     
                                scope.getCurrencySymbol(scope, scope.bpService);
                                
                                scope.miniForm = true;
                                scope.children = scope.bpTree.children;
                                scope.child = { children: scope.children };
                                
                                if(scope.bpTree.readOnly !== true) {
                                    if(!scope.bpTree.response) {
                                        scope.bpTree.response = {};
                                    } 
                                }

                                if(ouiBaseService.bPLSeeding) {
                                    var interval = setInterval(check, 10);   
                                    
                                    function check() {
                                        if ($rootScope.seedingDone === true || $rootScope.seedingFailed === true) {
                                            clearInterval(interval);  
                                            $timeout(function() {
                                                if(scope.bpTree.readOnly !== true) {
                                                    scope.applyCallResp(scope.prefillInput);                          
                                                }
                                            }, 0);                                             
                                        }
                                    }                                             
                                }
                                else {                                  
                                    $timeout(function() {
                                        if(scope.bpTree.readOnly !== true) {
                                            scope.applyCallResp(scope.prefillInput);                          
                                        }
                                    }, 0);    
                                }                          
                            }
                        }
                        else {
                            VOUINS.ClearData(scope);
                        }
                    }
                    else {
                        VOUINS.ClearData(scope);
                    }

                }); // watchCollection omniInput

            }          
        };
    });
}());  
 
},{}],8:[function(require,module,exports){
// directive - bot form child
(function() {
    var app = angular.module('vlocity-oui-common');
    app.directive('vlcOmniFormChild', function ($compile, $templateCache, $sce) {
        'use strict';
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            require: '?ngModel',
            scope: false,
            link: function (scope, ele, attrs, ngModel) {
                //debugger;
                var htmlMarkup;
                var htmlId;
                var bMultiLang = (scope.bpTree.bpLang === 'Multi-Language')?true:false;
                if(scope.child.level === 0) {
                    htmlId = (scope.child.propSetMap.HTMLTemplateId)?(scope.child.propSetMap.HTMLTemplateId):(scope.bpTree.elementTypeToHTMLMapOW[scope.child.type]);
                    // v102 Multi-lang
                    if(bMultiLang) {
                        scope.child.propSetMap.label = scope.bpTree.labelKeyMap[scope.bpTree.labelMap[scope.child.name]];
                        if(VOUINS.ootbLabelMap.hasOwnProperty(scope.child.type)) {
                            VOUINS.handleMultiLangLabel(scope.child, scope.bpTree.labelKeyMap);
                        }
                    }
                }
                else if(angular.isArray(scope.child.eleArray[0].children)) {
                    // v102 Multi-lang
                    if(bMultiLang) {
                        for(var i=0; i<scope.child.eleArray.length; i++) {
                            scope.child.eleArray[i].propSetMap.label = scope.bpTree.labelKeyMap[scope.bpTree.labelMap[scope.child.eleArray[i].name]];
                            if(VOUINS.ootbLabelMap.hasOwnProperty(scope.child.eleArray[i].type)) {
                                VOUINS.handleMultiLangLabel(scope.child.eleArray[i], scope.bpTree.labelKeyMap);
                            }
                        }
                    }

                    if(scope.child.eleArray[0].type === 'Text Block') {
                        scope.child.eleArray[0].propSetMap.value =
                            $sce.trustAsHtml(bMultiLang?scope.child.eleArray[0].propSetMap.textKey:scope.child.eleArray[0].propSetMap.text);
                    }
                    else if(scope.child.eleArray[0].type === 'Headline') {
                        scope.child.eleArray[0].propSetMap.value =
                            $sce.trustAsHtml(bMultiLang?scope.child.eleArray[0].propSetMap.labelKey:scope.child.eleArray[0].propSetMap.label);
                    }

                    htmlId = (scope.child.eleArray[0].propSetMap.HTMLTemplateId)?(scope.child.eleArray[0].propSetMap.HTMLTemplateId):(scope.bpTree.elementTypeToHTMLMapOW[scope.child.eleArray[0].type]);
                    if(scope.child.eleArray[0].type === 'Selectable Items')
                    {
                        scope.child.eleArray[0].itemsKey = scope.child.eleArray[0].propSetMap.itemsKey;
                        if(!scope.child.eleArray[0].itemsKey)
                            scope.child.eleArray[0].itemsKey = 'recSet';
                        if(scope.child.eleArray[0].vlcSI === undefined || scope.child.eleArray[0].vlcSI === null)
                            scope.child.eleArray[0].vlcSI = {};

                        // for SI, we should NOT use the element's HTMLTemplateId
                        htmlId = scope.bpTree.elementTypeToHTMLMapOW[scope.child.eleArray[0].type];
                    }
                }

                htmlMarkup = $templateCache.get(htmlId);
                if(scope.child.level > 0 && scope.child.eleArray[0].type === 'Selectable Items')
                {
                    if(!scope.child.eleArray[0].propSetMap.HTMLTemplateId)
                        scope.child.eleArray[0].propSetMap.HTMLTemplateId = scope.bpTree.elementTypeToHTMLMapOW['Selectable Item'];
                }

                if(htmlMarkup) {
                    $compile(htmlMarkup)(scope, function(cloned, scope){
                        ele.append(cloned);
                    });
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


},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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


},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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
 

},{}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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


},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

                      
                      

},{}],32:[function(require,module,exports){
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

},{"./directives/vlcSldsImage.js":30,"./directives/vlcSldsOmniOutOpen.js":31,"./run/cordovaKeyboardHandler.js":33}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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
},{}]},{},[1]);
})();

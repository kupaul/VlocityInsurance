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
var module = angular.module('vloc.xomNodeView', ['vlocity', 'mgcrea.ngStrap',  'ngSanitize']);

module.config(['remoteActionsProvider', function(remoteActionsProvider) {
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}]);

//changed the name of module from camel case vloc.xomNodeView since grunt is not detecting the module while injecting the dependency and needs to have the same module name as present in the folder structure
// require('./modules/xomnodeview/directive/NGIncludeTemplate.js');
require('./modules/xomnodeview/directive/XOMNodeViewDirective.js');
require('./modules/xomnodeview/filter/linenumber.js');
require('./modules/xomnodeview/templates/templates.js');

},{"./modules/xomnodeview/directive/XOMNodeViewDirective.js":2,"./modules/xomnodeview/filter/linenumber.js":3,"./modules/xomnodeview/templates/templates.js":4}],2:[function(require,module,exports){
angular.module('vloc.xomNodeView').directive('nodeView', ['$compile', 'remoteActions', function($compile, remoteActions) {

    return {

        templateUrl: 'NodeView.tpl.html',

        scope: {
            parent: '=',
            orders: '=',
            frs: '='
        },
        // replace: true,
        restrict: 'E',
        controller:  ['$scope', function($scope) {
            $scope.viewMoreCheck = {};
               $scope.viewMoreAndLess = {};
            $scope.getTooltip = function (message, helperArg) {
                if (helperArg === 'processAtrribute'){
                    message = $scope.processAtrribute(message); 
                }
                else if (helperArg != '' && helperArg != null){
                    message = message | helperArg;
                }
                return {title:message};
            };
            $scope.getRichTooltip = function(attr, helperArg, node){
                var sourceOiAttrNodeId, val;
                if (helperArg === 'processAtrribute'){
                    message = $scope.processAtrribute(message); 
                }
                else if (helperArg != '' && helperArg != null){
                    message = message | helperArg;
                }
                if(node.type=='Fulfilment Request Line')
                {
                    if (node.attrMappings != null && node.attrMappings['attr_'+node.specId+'_'+attr.name] != null 
                            && node.attrMappings['attr_'+node.specId+'_'+attr.name].length){
                        let mappings = node.attrMappings['attr_'+node.specId+'_'+attr.name];
                        let lastSourceId;
                        for (let i=0; i<mappings.length; i++){
                            let val = mappings[i];
                            if (message){
                                message = message+'<br>';
                            }
                            if (!lastSourceId || lastSourceId !== val.srcOrderItemId){
                                message = val!=null?message+'Source-Attribute:&nbsp;  '+val.mappingObj['source_attr_name']+'<br/>Mapping type: '+val.mappingObj['mapping_type']+'<br/>Source-OrderItem:  '+val.srcOrderItemName+'  ('+val.srcOrderItemId+')':message;
                            }
                            lastSourceId = val.srcOrderItemId;
                        }
                    }
                    else if (node.fieldMappings != null && node.fieldMappings['attr_'+node.specId+'_'+attr.name] != null){
                        let mappings = node.fieldMappings['attr_'+node.specId+'_'+attr.name];
                        let lastSourceId;
                        for (let i=0; i<mappings.length; i++){
                            let val = mappings[i];
                            if (message){
                                message = message+'<br>';
                            }
                            if (!lastSourceId || lastSourceId !== val.srcOrderItemId){
                                message = val!=null?message+'Source-Field:  '+val.mappingObj['source_field_name']+'<br/>Mapping type: '+val.mappingObj['mapping_type']+'<br/>Source-OrderItem:  '+val.srcOrderItemName+'  ('+val.srcOrderItemId+')':message;
                            }
                            lastSourceId = val.srcOrderItemId;
                        }
                    }
                    else if (node.staticMappings != null){
                        let mappings = node.staticMappings['attr_'+node.specId+'_'+attr.name];
                        let lastSourceId;
                        for (let i=0; i<mappings.length; i++){
                            let val = mappings[i];  
                            if (message){
                                message = message+'<br>';
                            }
                            if (!lastSourceId || lastSourceId !== val.srcOrderItemId){
                                message = val!=null?message+'Static Value:  '+val.mappingObj.value+'<br/>Mapping type: static'+'<br/>Source-OrderItem:  '+val.srcOrderItemName+'  ('+val.srcOrderItemId+')':message;
                            }
                            lastSourceId = val.srcOrderItemId;
                        }
                    }
                    else {
                        message = message+'Default Value';
                    }
                    if (val != null){
                        message = message+'<br/>Source-OrderItem:  '+val.srcOrderItemName+'  ('+val.srcOrderItemId+')';
                    }
                }
                return {title:message};
            };
            $scope.togglePanel = function(node){
                node.isPanelExpanded = !(node.isPanelExpanded);
            }

            $scope.isNodeActive = function (activeNodes, nodeIdx) {

                // console.log ('isNodeActive', $scope, nodeIdx);
                function isNumeric(n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                }

                if (isNumeric(activeNodes)) {
                    return activeNodes == nodeIdx;
                } else {
                    return activeNodes.indexOf (nodeIdx) >= 0;
                }

            };
            $scope.viewMore = function(attr, index)
            {
                $scope.viewMoreCheck[index] = !$scope.viewMoreCheck[index];
                $scope.processAtrribute(attr, index);
            }
            $scope.processAtrribute = function(attr, index) {
              var returnVal;
              if(!attr) attr = {};
              if (attr.value){
                var newValue = attr.value;
                if (attr.type === 'Date'){
                  newValue = new Date (Date.parse(attr.value));
                  console.log(newValue);
                  return moment(newValue).format('MM/DD/YYYY'); //XOM-4320
                }
                else if (attr.type === 'Datetime'){
                  newValue = new Date (Date.parse(attr.value));
                  console.log(newValue);
                  return moment(newValue).format('MM/DD/YYYY hh:mm A'); //XOM-4320
                }
                else if (attr.type === 'Currency'){
                    return Number(attr.value).toFixed(2);
                }
                else if (attr.type === 'Number' || attr.type === 'Percent'){
                    var max = 20; // max number of digits after decimal places
                    var value = attr.value;
                    var s = value.toString().split('.');
                    if (s===Array && s.length ==1) {
                        if (s[1].length > max) {
                            return Number(value).toFixed(max).replace(/\.?0+$/,"");
                        } 
                        else {
                            return Number(value).toFixed(s[1].length).replace(/\.?0+$/,"");
                        }
                    } 
                    else {
                        return value;    
                    }
                }
                else if (attr.type === 'Text' || attr.type === 'Picklist' || attr.type === 'Multi Picklist')
                {   
                    if (!(index in $scope.viewMoreCheck))
                    {
                        $scope.viewMoreCheck[index]=false;
                    }
                    let value1 = attr.value;
                    if (attr.value.length > 60 && !$scope.viewMoreCheck[index])
                    {
                        $scope.viewMoreAndLess[index] = true;
                        return value1.slice(0,50);
                    } 
                    else if (attr.value.length < 60)
                    { 
                        $scope.viewMoreAndLess[index] = false;
                    }
                    return attr.value;
                }
                return newValue;
              }
              return "";
            };

      $scope.getViewMoreCheck = function(index)
      {
        return !$scope.viewMoreCheck[index] && $scope.viewMoreAndLess[index]
      }

      $scope.getViewLessCheck=function(index)
       {
        return $scope.viewMoreCheck[index] && $scope.viewMoreAndLess[index]
      }

            $scope.highlightAttrNode = function(node, currentNodeId, event) {
                if (!node.attrMappings)
                {
                    return node;
                }
                var attrNodeIdToHighlight;
                var mappings = node.attrMappings[currentNodeId]!=null?node.attrMappings[currentNodeId]:
                    (node.fieldMappings[currentNodeId]!=null?node.fieldMappings[currentNodeId]:null);
                for (let i=0; i<node.decompRuleList.length; i++){
                    let decompRule = node.decompRuleList[i];
                    var parent = document.getElementById(decompRule.orderItem);
                    for (let i=0; i<mappings.length; i++){
                        let mapping = mappings[i];
                        attrNodeIdToHighlight = mapping.highlightId;
                        if (attrNodeIdToHighlight!=null && parent)
                        {
                            var targetElement = parent.querySelector('#'+attrNodeIdToHighlight);
                            if (!targetElement)
                            {
                                continue;
                            }
                            targetElement .style="color: blue; background:#C1DDF3";
                            targetElement.style['color']= "blue";//#1dc0fa";
                            targetElement.style['background'] = "#C1DDF3";//"#e5f8fe";
                        }
                    }
                }
                event.target.parentNode.style="color: blue; background:#C1DDF3";
                targetElement = event.target.parentNode;
                targetElement.style['color']= "blue";//#1dc0fa";
                targetElement.style['background'] = "#C1DDF3";//"#e5f8fe";
                $scope.isHighlighted = true;
                return node;
            };
            $scope.dehighlightAttrNode = function(node, currentNodeId, event)
            {
                if (!node.attrMappings)
                {
                    return node;
                }
                var mappings = node.attrMappings[currentNodeId]!=null?node.attrMappings[currentNodeId]:
                    (node.fieldMappings[currentNodeId]!=null?node.fieldMappings[currentNodeId]:null);
                var attrNodeIdToDehighlight;
                for (let i=0; i<node.decompRuleList.length; i++){
                    let decompRule = node.decompRuleList[i];
                    var parent = document.getElementById(decompRule.orderItem);
                    for (let i=0; i<mappings.length; i++){
                        let mapping = mappings[i];
                        attrNodeIdToDehighlight = mapping.highlightId;
                        if (attrNodeIdToDehighlight!=null && parent)
                        {
                            var targetElement = parent.querySelector('#'+attrNodeIdToDehighlight);
                            if (!targetElement)
                            {
                                continue;
                            }
                            targetElement.style="";
                            targetElement.style['color']= "";
                            targetElement.style['background'] = "";
                         }
                     }
                }
                event.target.parentNode.style="";
                targetElement = event.target.parentNode;
                targetElement.style['color']= "";
                targetElement.style['background'] = "";
                $scope.isHighlighted = false;
                return node;
            };
            
            /////////
            
            $scope.setDehighlightAttr = function(node){
                node.isHighlighted=false;
                if (node.nodes){
                    for (var i = 0; i < node.nodes.length; i++){
                        $scope.setDehighlightAttr (node.nodes[i]);
                    }
                }
                return node;
            };
            
            $scope.applyDehighlightStyles = function (){
                var temp, index, nodeToUpdate;
                var myHighlightedElements = document.getElementsByClassName('isHighlighted');
                while (myHighlightedElements!=null && myHighlightedElements.length>0){
                    temp = myHighlightedElements[0];
                    temp.style['border']= "";
                    temp.style['background'] = "";
                    temp.style['border-radius']="";
                    temp.style = '';
                    console.log(temp.classList);
                    if (temp.classList.contains('isHighlighted')){
                        //temp.classList.replace('isHighlighted', 'deHighlighted');
                        temp.classList.remove('isHighlighted');
                        temp.classList.add('deHighlighted');
                    }
                };
            };
            
            $scope.highlightNodes = function(node)
            {
                var nodeId = node.id;
                var tempFRlineId, targetElement;
                var targetElements = [];
                $scope.setDehighlightAttr($scope.orders);
                $scope.setDehighlightAttr($scope.frs);
                $scope.applyDehighlightStyles();
                if ((node.type==="Order Item" || node.type=='Fulfilment Request Line') && node.oiToFRLinesMap!=null && node.oiToFRLinesMap[nodeId]!=null && node.oiToFRLinesMap[nodeId].length>0)
                {
                    for(var i=0; i<node.oiToFRLinesMap[nodeId].length; i++)
                    {   
                        let isConditionFailed = JSON.parse(node.oiToFRLinesMap[nodeId][i]['isConditionFailed']);
                        tempFRlineId = node.oiToFRLinesMap[nodeId][i]['frLine'];
                        if(!isConditionFailed) {
                            document.getElementById(tempFRlineId).style = "border: 3px solid #008ab3; background:#A0F3FF;border-radius:4px;";
                            targetElement = document.getElementById(tempFRlineId);
                            targetElement.style['border']= "3px solid #008ab3";//#d6e9e6";//#1dc0fa";
                            targetElement.style['background'] = "#A0F3FF";//"#e5f8fe";
                            targetElement.style['border-radius']="4px";
                        } else {
                        	document.getElementById(tempFRlineId).style = "border: 3px solid rgba(221, 68, 82, 1); background:rgba(221, 68, 82, 0.4); border-radius:4px;";
                            targetElement = document.getElementById(tempFRlineId);
                            targetElement.style['border']= "3px solid rgba(168, 68, 82, 1)";//#d6e9e6";//#1dc0fa";
                            targetElement.style['background'] = "rgba(221, 68, 82, 0.4)";//"#e5f8fe";
                            targetElement.style['border-radius']="4px";
                        }

                        var highlightcount = targetElement.getAttribute("highlightcount");
                        if(highlightcount) {
                            highlightcount = parseInt(highlightcount) + 1;
                        } else {
                            highlightcount = 1;
                        }
                        targetElement.setAttribute("highlightcount", highlightcount);
                        if (targetElement.classList.contains('deHighlighted')){
                            //targetElement.classList.replace('deHighlighted', 'isHighlighted');
                            targetElement.classList.remove('deHighlighted');
                            targetElement.classList.add('isHighlighted');
                        }
                        else{
                            targetElement.classList.add('isHighlighted');
                        }

                    }
                    document.getElementById(nodeId).style="border: 3px solid #d6e9e6; background:#A0F3FF;border-radius:4px;";
                    targetElement = document.getElementById(nodeId);
                    targetElement.style['border']= "3px solid #008ab3";//#d6e9e6";//#1dc0fa";
                    targetElement.style['background'] = "#A0F3FF";//"#e5f8fe";
                    targetElement.style['border-radius']="4px";
                    
                    if (!(targetElement.classList.contains('isHighlighted'))){
                        targetElement.classList.add('isHighlighted');
                    }
                    if (targetElement.classList.contains('deHighlighted')){
                        targetElement.classList.remove('deHighlighted');
                    }

                //}
                node.isHighlighted=true;
                $scope.isHighlighted = true;
                }
                return node;
            };
            $scope.dehighlightNode = function(node)
            {
                var nodeId = node.id;
                var tempFRlineId;
                if ((node.type==="Order Item" || node.type=='Fulfilment Request Line') && node.oiToFRLinesMap!=null && node.oiToFRLinesMap[nodeId]!=null)
                {
                    for(var i=0; i<node.oiToFRLinesMap[nodeId].length; i++)
                    {
                    	tempFRlineId = node.oiToFRLinesMap[nodeId][i]['frLine'];
                        targetElement = document.getElementById(tempFRlineId);

                        var highlightcount = targetElement.getAttribute("highlightcount");

                        highlightcount = parseInt(highlightcount) - 1;
                        targetElement.setAttribute("highlightcount", highlightcount);

                        //if(highlightcount == 0)
                        //{
                            document.getElementById(tempFRlineId).style = "";
                            targetElement.style['border']= "";
                            targetElement.style['background'] = "";
                            targetElement.style['border-radius']="";
                        //}
                        if (targetElement.classList.contains('isHighlighted')){
                            //targetElement.classList.replace('isHighlighted', 'deHighlighted');
                            targetElement.classList.remove('isHighlighted');
                            targetElement.classList.add('deHighlighted');
                        }
                    }
                    document.getElementById(nodeId).style="";
                    targetElement = document.getElementById(nodeId);
                    targetElement.style['border']= "";
                    targetElement.style['background'] = "";
                    targetElement.style['border-radius']="";
                    console.log('targetElement.classList:'+targetElement.classList);
                    if (targetElement.classList.contains('isHighlighted')){
                        //targetElement.classList.replace('isHighlighted', 'deHighlighted');
                        targetElement.classList.remove('isHighlighted');
                        targetElement.classList.add('deHighlighted');
                    }
                }
                node.isHighlighted=false;
                $scope.isHighlighted = false;
                return node;
            };
            
            
            ///////
      $scope.resolveNavigate = function(recordId)
      {
        console.log('resolveNavigate ' + recordId);
        var isExternalId = !isNaN(parseFloat(recordId)) && isFinite(recordId);
        if(!isExternalId)
        {
            window.open('/' + recordId);
        } else 
        {
            window.open('/apex/XOMObjectParams#!/object/' + recordId);
        }
      };

      $scope.resolveByGlobalKey = function(globalKey)
      {
        if(globalKey.indexOf('-') > -1)
        {
          console.log('Node.resolveByGlobalKey key ' + globalKey);
          remoteActions.getSfIdByGlobalKey(globalKey)
            .then(function(recordId)
              {
                console.log('Node.resolveByGlobalKey globalKey ' + globalKey + '. opening page in new window for object id ' + recordId);
                window.open('/' + recordId);
              });  
        } else {
          console.log('Node.resolveByGlobalKey object id ' + globalKey);
          window.open('/' + globalKey);
        }
      };
    }],
        compile: function(tElement, tAttr) {
            var contents = tElement.contents().remove();
            var compiledContents;
            return function(scope, iElement, iAttr) {
                if(!compiledContents) {
                    compiledContents = $compile(contents);
                }
                compiledContents(scope, function(clone, scope) {
                    iElement.append(clone);
                });
            };
        }

    };

}]);

},{}],3:[function(require,module,exports){
angular.module('vloc.xomNodeView').filter('linenumber', function () {
    return function(ln) {
        return ln.replace(/^[a-zA-Z][^.]*\./, '');
    };
});
},{}],4:[function(require,module,exports){
angular.module("vloc.xomNodeView").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("NodeView.tpl.html",'<ul class="panel-group collapsibleList treeView decompositionView" ng-model="parent.activeNodes" data-allow-multiple="true" bs-collapse \n    ng-repeat="node in parent.nodes" name="newList" id="{{node.id}}" ng-init="node.viewAttrPanel=true">\n    <div class="node outcome-wrapper">\n\t    <div class="node-title step-block slider" id="nodeHeader_{{node.id}}" \n\t         ng-class="{\'node-title-frLine\': node.type==\'Fulfilment Request\' || node.type==\'Fulfilment Request Line\'}" >\n      <span class="correction">&nbsp;</span>\n\t    <span class="icon" \n\t          ng-class="{\'icon-v-right-arrow\': !node.isPanelExpanded,\'icon-v-down-arrow\': node.isPanelExpanded}" \n\t          aria-hidden="true" ng-click="togglePanel(node)"></span>\n\t    \n\t    \n\t    <i class="icon icon-v-link"\n\t       ng-show="((node.type==\'Order Item\' || node.type==\'Fulfilment Request Line\') && node.oiToFRLinesMap!=null && node.oiToFRLinesMap[node.id]!=null && node.oiToFRLinesMap[node.id].length>0)" \n\t       ng-click="node.isHighlighted!=true? highlightNodes(node):dehighlightNode(node)"></i>\n\t       \n\t    <i class="icon icon-v-link" \n\t       ng-show="(node.type==\'Order Item\' && (node.oiToFRLinesMap==null || node.oiToFRLinesMap[node.id]==null))" \n\t       data-placement="right" bs-tooltip="getTooltip(\'{{node.name}} {{::$root.translatedLabels[\'XOMDecomNotAssoDownstreamProduct\']}}\', \'\')" \n         data-trigger="hover"></i>\n         <i class="icon icon-v-link" \n\t       ng-show="(node.type==\'Order Item\' && node.oiToFRLinesMap!=null && node.oiToFRLinesMap[node.id].length<1)" \n\t       data-placement="right" bs-tooltip="getTooltip(\'{{node.name}} {{::$root.translatedLabels[\'XOMDecomNotAssoDownstreamProduct\']}}\', \'\')" \n           data-trigger="hover"></i>\n\t    <i ng-class="{\'icon icon-v-expand\':node.viewAttrPanel!=true, \'icon icon-v-collapse\':node.viewAttrPanel==true}"\n\t       ng-if="node.attrs!=null && node.attrs.length>0"\n\t       ng-click="node.viewAttrPanel=(!node.viewAttrPanel)"\n         data-placement="right" bs-tooltip="getTooltip(\'{{::$root.translatedLabels[\'XOMDecomShowHideAttriPanel\']}}\')"\n         data-trigger="hover"></i>\n\t    <a target="_blank" ng-click="resolveNavigate(node.id)" id="nodeName_{{node.id}}" \n      data-placement="bottom-right"  \n                bs-tooltip="{{getTooltip(node.name + \' \'\n                                         + (node.action != null || (node.lineNumber != undefined&&node.lineNumber != null) || node.subAction != null ? \'(\'\n                                         + (node.lineNumber != undefined&&node.lineNumber != null ? (node.lineNumber | linenumber) : \'\') + \' \'\n                                         + (node.action != null ? \' / \' + node.action : \'\') + \' \'\n                                         + (node.subAction != null ? \' / \' + node.subAction : \'\') + \')\' : \'\'), \'\')}}" >\n        {{node.type==\'Order\' || node.type==\'Fulfilment Request\' ? (node.translatedType!=null?node.translatedType:node.type) +\':\': \'\'}} {{node.type==\'Fulfilment Request\' && node.fulfilmentRequestName ? node.fulfilmentRequestName.substr(2) :node.name }} \n            <span class="node-subtitle" ng-if="node.type!=\'Order\' && node.type!=\'Fulfilment Request\'">\n                <span  ng-if="node.lineNumber">({{node.lineNumber | linenumber}}</span>\n                <span ng-if="node.action!=null || node.subAction!=null">{{node.action!=null? \' / \'+node.action:\'\'}}{{node.subAction!=null? \' / \'+node.subAction:\'\'}})&lrm;</span>\n            </span>\n        </a>\n\t    </div>\n\t    <div class="node-content" ng-show=\'node.isPanelExpanded\'>\n\t    <li ng-class="{\'collapsibleListOpen\':isNodeActive(parent.activeNodes, $index),\'collapsibleListClosed\': !isNodeActive(parent.activeNodes, $index)}">\n               <div class="panel-collapse">\n                    <div class="fields">\n                      <div class="field node-supp-action" ng-if="node.supplementalAction!=null"  id="{{node.id}}_{{node.supplementalAction}}">\n                           <span class="field-label">{{::$root.translatedLabels[\'XOMDecomSupplementalAction\']}}:&nbsp;</span>\n                           <span class="field-value node-supp-field-value">\n                           {{node.supplementalAction}}</span>\n                       </div>\n                   <div class="fields">\n                       <div class="field node-supp-action" ng-repeat="field in node.fields" ng-if="field.value && !field.refId && field.name==\'SupplementalAction\'" id="field_{{node.id}}_{{field.name}}" >\n                           <span class="field-label">{{::$root.translatedLabels[\'XOMDecomSupplementalAction\']}}:&nbsp;</span>\n                           <span class="field-value node-supp-field-value">\n                           {{field.value}}</span>\n                       </div>\n                       <div class="field" ng-repeat="field in node.fields" ng-if="field.value && !field.refId && field.name==\'Line Number\'" id="field_{{node.id}}_{{field.name}}">\n                           <span class="field-label">{{field.name}}:&nbsp;</span>\n                           <span class="field-value">\n                           {{field.value | linenumber}}</span>\n                       </div>\n                       <div class="field" ng-repeat="field in node.fields" ng-if="field.value && !field.refId && field.name!=\'Line Number\' && field.name!=\'SupplementalAction\'" id="field_{{node.id}}_{{field.name}}" >\n                           <span class="field-label" ng-if="field.name == \'Status\'">{{::$root.translatedLabels[\'XOMDecomStatus\']}}:&nbsp;</span>\n                           <span class="field-label" ng-if="field.name != \'Status\'">{{field.name}}:&nbsp;</span>\n                           <span class="field-value">{{field.value}}\n                           </span>\n                       </div>\n                       <div class="field" ng-repeat="field in node.fields" ng-if="field.value && !!field.refId" id="field_{{node.id}}_{{field.name}}">\n                           <span class="field-label">{{::$root.translatedLabels[\'XOMDecomProduct\']}}:&nbsp;</span>\n                           <span class="field-value" >\n                               <a target="_blank"  ng-click="resolveByGlobalKey(field.refId)">{{field.value}}</a>\n                           </span>\n                       </div>                       \n                       <div class="field" ng-if="node.assetId" id="field_{{node.id}}_{{field.name}}">\n                           <span class="field-label">{{::$root.translatedLabels[\'XOMDecomAssetInventoryItem\']}}:&nbsp;</span>\n                           <span class="field-value" >\n                               <a target="_blank"  ng-click="resolveNavigate(node.assetId)">\n                                   {{(node.type == \'Fulfilment Request Line\' ? node.name : node.assetName)}}\n                               </a>\n                           </span>\n                       </div>\n                   </div>\n                   <div class="fields attrs">\n                       <div ng-repeat="attr in node.attrs" ng-if="attr.value && node.viewAttrPanel==true && (attr.hidden == \'false\' || attr.hidden == false)"\n                            class="field step-block slider" expand="expand" id="attr_{{node.specId}}_{{attr.name}}"\n\n                            data-default-value="{{ (node.type==\'Fulfilment Request Line\'\n'+"\t                                   && !(((node.attrMappings!=null &&  node.attrMappings['attr_'+node.specId+'_'+attr.name]!=null)\n\t                                   ||  (node.fieldMappings!=null && node.fieldMappings['attr_'+node.specId+'_'+attr.name]!=null)\n\t                                   ||  (node.staticMappings!=null && node.staticMappings['attr_'+node.specId+'_'+attr.name]!=null)))) }}\">\n                            <i class=\"icon icon-v-link\"\n\t                          ng-show=\"(node.type=='Fulfilment Request Line'\n\t                                   && ((node.attrMappings!=null &&  node.attrMappings['attr_'+node.specId+'_'+attr.name]!=null)\n\t                                   ||  (node.fieldMappings!=null && node.fieldMappings['attr_'+node.specId+'_'+attr.name]!=null)\n\t                                   ||  (node.staticMappings!=null && node.staticMappings['attr_'+node.specId+'_'+attr.name]!=null)))\"\n\t                          ng-mouseenter=\"highlightAttrNode(node, 'attr_'+node.specId+'_'+attr.name, $event)\" \n\t                          ng-mouseleave=\"dehighlightAttrNode(node, 'attr_'+node.specId+'_'+attr.name, $event)\"\n\t                          bs-tooltip=\"getRichTooltip(attr, 'processAtrribute', node)\"\n\t                          data-placement=\"right\" data-html=\"true\"></i>\n\t                        <i class=\"icon icon-v-check\"\n\t                          ng-show=\"(node.type=='Fulfilment Request Line'\n\t                                   && !(((node.attrMappings!=null &&  node.attrMappings['attr_'+node.specId+'_'+attr.name]!=null)\n\t                                   ||  (node.fieldMappings!=null && node.fieldMappings['attr_'+node.specId+'_'+attr.name]!=null)\n\t                                   ||  (node.staticMappings!=null && node.staticMappings['attr_'+node.specId+'_'+attr.name]!=null))))\"\n\t                          bs-tooltip=\"{title:'{{::$root.translatedLabels['XOMDecomDefaultValue']}}'}\"\n\t                          data-placement=\"right\" data-html=\"true\"></i>\n                           <span class=\"field-label\"\n                                 ng-class=\"{'defaultAttr':!(node.type=='Fulfilment Request Line'\n\t                                   && ((node.attrMappings!=null &&  node.attrMappings['attr_'+node.specId+'_'+attr.name]!=null)\n\t                                   ||  (node.fieldMappings!=null && node.fieldMappings['attr_'+node.specId+'_'+attr.name]!=null)\n\t                                   ||  (node.staticMappings!=null && node.staticMappings['attr_'+node.specId+'_'+attr.name]!=null)))}\">{{attr.name}}:&nbsp;</span>\n                           <span class=\"field-value\">{{processAtrribute(attr,$parent.$parent.$index+''+$index)}}\n                           </span>\n                           <span\n\t                          ng-show=\"attr.tracked\"\n\t                          bs-tooltip=\"{title:'The attribute was updated during fulfilment'}\"\n\t                          data-placement=\"right\" data-html=\"true\">&#9432;</span>\n                           <span ng-if=\"getViewMoreCheck($parent.$parent.$index+''+$index)\"  ng-click=\"viewMore(attr,$parent.$parent.$parent.$index+''+$index)\" id=\"viewMoreLink\" class=\"viewMoreLink\">  ...view more</span>\n                           <div ng-if=\"getViewLessCheck($parent.$parent.$index+''+$index)\"  ng-click=\"viewMore(attr,$parent.$parent.$parent.$index+''+$index)\" id=\"viewLessLink\" class=\"viewLessLink\">view less</div>\n                       </div>\n                   </div>\n                   <node-view parent=\"node\" orders=\"orders\" frs=\"frs\"></node-view>\n               </div>\n           </div>\n        </li>\n        </div>\n     </div>\n</ul>")}]);

},{}]},{},[1]);
})();

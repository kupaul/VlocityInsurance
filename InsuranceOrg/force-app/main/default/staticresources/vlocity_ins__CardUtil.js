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
angular.module('cardutil', ['vlocity'])
	.config(['$localizableProvider', function($localizableProvider) {
      'use strict';
      $localizableProvider.setLocalizedMap(window.i18n);
      $localizableProvider.setDebugMode(false);
  }]);
require('./modules/cardutil/factory/LightningWebComp.js');
require('./modules/cardutil/factory/toolingService.js');
},{"./modules/cardutil/factory/LightningWebComp.js":2,"./modules/cardutil/factory/toolingService.js":3}],2:[function(require,module,exports){
angular.module('cardutil')
    .factory('LightningWebCompFactory', function ($rootScope, remoteActions, $log, toolingService) {
        'use strict';
        var DEFAULT_AUTHOR = 'vlocity';
        var layoutLwcResource = [];
        var layoutLwcBundles = {};
        var xmlObject = {};
        var DEFAULT_LWC_PREFIX = 'cf-';
        var isDeploymentPending = false;
        $rootScope.LWCResourcesList = {};

        function setXmlObject(xmlStr, metaObject, obj) {
            xmlObject.xmlStr = xmlStr;
            xmlObject.metaObject = angular.copy(metaObject);
            xmlObject.originalObject = angular.copy(obj);
        }

        function getXmlObject() {
            return xmlObject;
        }

        function createNewLwc(lwcComponent, item, type) {
            //Check if LWC with same name is already getting created. If yes then reject it, 
            if (layoutLwcBundles[lwcComponent.name] !== "creating") {
                layoutLwcBundles[lwcComponent.name] = "creating";
                return toolingService.createLwcBundle(lwcComponent.name, getMetadata(lwcComponent, item, type)).then(function (id) {
                    if (id) {
                        layoutLwcBundles[lwcComponent.name] = "created";
                        $rootScope.lightningwebcomponents.push({
                            Id: id,
                            DeveloperName: lwcComponent.name,
                            MasterLabel: item.Name
                        });
                    }
                });
            } else {
                return new Promise(function () { });
            }
        }

        function getMetadata(lwcComponent, item, type) {
            var resources = [];
            var targets = [];
            var obj = {};
            lwcComponent.files.forEach(function (file) {
                resources.push({
                    source: btoa(file.source),
                    filePath: file.filepath
                });
            });
            if (item[$rootScope.nsPrefix + "Active__c"] && type === "layout") {
                targets = ["lightning__RecordPage", "lightning__AppPage", "lightning__HomePage"];
            }
            let tConfig = `
                            <targetConfig targets="lightning__AppPage">
                                <property name="debug" type="Boolean"/>
                                <property name="recordId" type="String"/>
                            </targetConfig>
                            <targetConfig targets="lightning__RecordPage">
                                <property name="debug" type="Boolean"/>
                            </targetConfig>
                          `;
            obj = {
                apiVersion: 46,
                isExposed: true,
                lwcResources: {
                    lwcResource: resources
                },
                targets: {
                    target: targets
                },
                masterLabel: item[$rootScope.nsPrefix + "Active__c"] ? item.Name : lwcComponent.name
            }
            if ($rootScope.insidePckg) {
                obj.runtimeNamespace = $rootScope.nsPrefix.replace("__", "");
            }
            if (item[$rootScope.nsPrefix + "Active__c"] && type === "layout" && obj.targets.target && obj.targets.target.length > 0) {
                obj.targetConfigs = window.btoa(tConfig);
            }

            if (item[$rootScope.nsPrefix + "Definition__c"].xmlObject && item[$rootScope.nsPrefix + "Active__c"] && type === "layout") {
                obj = prepareMetaObject(item[$rootScope.nsPrefix + "Definition__c"].xmlObject);
                obj.lwcResources = {
                    lwcResource: resources
                };
            }
            return obj;
        }

        function getLwcNameFromFilepath(filepath) {
            var name = filepath.slice(4);
            name = name.substring(0, name.indexOf("/"));
            return name;
        }

        function getLayoutHtmlCode(compName, layout) {
            var cardArr = [];
            var layoutDefinition = layout[$rootScope.nsPrefix + "Definition__c"];
            var cardsTemplate = "";
            var cardsRepeatTemplate = "";
            var cardsOpenTemplate = "";
            compName = convertLWCBundleNameToValidHTMLElementName(compName);
            if (layout[$rootScope.nsPrefix + "Active__c"]) {
                layoutDefinition.Cards.forEach(function (cardName) {
                    cardArr.push(convertNameToValidLWCCase(DEFAULT_LWC_PREFIX + cardName));
                });
            } else {
                if (layoutDefinition.workspace) {
                    layoutDefinition.workspace.forEach(function (item) {
                        var itemArr = item.split("/");
                        var findObj = {};
                        findObj.Name = itemArr[0];
                        findObj[$rootScope.nsPrefix + "Author__c"] = itemArr[1];
                        findObj[$rootScope.nsPrefix + "Version__c"] = itemArr.length === 4 ? Number.isNaN(parseInt(itemArr[2])) ? "legacy" : parseInt(itemArr[2]) : "legacy";
                        findObj[$rootScope.nsPrefix + "Active__c"] = true;
                        var cardObject = _.find($rootScope.layoutCards, findObj);
                        var compName = cardObject ? itemArr[0] : itemArr[0] + "_" + (itemArr.length === 4 ? Number.isNaN(parseInt(itemArr[2])) ? "legacy" : parseInt(itemArr[2]) : "legacy") + "_" + itemArr[1];
                        compName = convertNameToValidLWCCase(DEFAULT_LWC_PREFIX + compName);
                        cardArr.push(compName);
                    });
                }
            }
            cardsRepeatTemplate = '<template for:each={cardRecords} for:item="record" for:index="rIndex">';
            cardsOpenTemplate = '<template if:true={cardRecords}>';
            cardArr.forEach(function (item) {
                item = convertLWCBundleNameToValidHTMLElementName(item);
                cardsTemplate += '<c-' + item + ' record-id={recordId} theme={theme} debug={debug} class="cf-vlocity-card">\
                                </c-' + item + '>';
                cardsRepeatTemplate += '<c-' + item + ' active-mode  record-id={recordId} theme={theme} debug={debug}   key={record.Id} class="cf-vlocity-card" data-rindex={rIndex} obj={record}>\
                                        </c-' + item + '>';
                cardsOpenTemplate += '<c-' + item + ' open-mode records={cardRecords} record-id={recordId} theme={theme} debug={debug} class="cf-vlocity-card">\
                                        </c-' + item + '>';
            });
            cardsRepeatTemplate += '</template>';
            cardsOpenTemplate += '</template>';
            let tempName = layoutDefinition.lwc && layoutDefinition.lwc.DeveloperName;
            let layoutLwc = _.find($rootScope.lightningwebcomponents, {
                DeveloperName: tempName
            });
            let namespace = $rootScope.insidePckg && layoutLwc && layoutLwc.NamespacePrefix ? layoutLwc.NamespacePrefix : "c";
            return '<template>\
                        <div if:true={isLoaded} >' + getInActiveHtml(layout.Name, 'Layout') + '\
                        <' + namespace + '-' + compName + ' if:true={isActive} record-id={recordId} theme={theme} parent={parent} debug={debug} ontriggermaster={triggermaster} definition={definition} records={records} >' +
                (layoutDefinition.repeatCards ? cardsRepeatTemplate + cardsOpenTemplate : cardsTemplate) +
                '</' + namespace + '-' + compName + '>\
                        </div>\
                    </template>';
        }

        function getLayoutJsCode(lwcComponentName, definition) {
            let namespace = $rootScope.insidePckg && $rootScope.nsPrefix ? $rootScope.nsPrefix.replace("__", "") : "c";
            var layoutJsCode = 'import { masterLayout } from "' + namespace + '/masterLayout";\
                                import { LightningElement, api, track } from "lwc";\
                                import data from "./definition";';
            if (definition.lwc && definition.lwc.omniSupport) {
                layoutJsCode += 'import { OmniscriptBaseMixin } from "' + namespace + '/omniscriptBaseMixin";\
                                export default class ' + lwcComponentName + ' extends OmniscriptBaseMixin(masterLayout(LightningElement)) {';
            } else {
                layoutJsCode += 'export default class ' + lwcComponentName + ' extends masterLayout(LightningElement) {';
            }
            layoutJsCode += '@api recordId;' +
                '@api theme;' +
                '@api debug;' +
                'connectedCallback() {\
                            super.connectedCallback();\
                            this.definition = data;';
            if (definition.lwc && definition.lwc.omniSupport) {
                layoutJsCode += '/* Call omniUpdateDataJson to update the omniscript\
                                 this.omniUpdateDataJson({"key":"value"});*/';
            }
            layoutJsCode += '}}';
            return layoutJsCode;
        }

        function getDefinition(item) {
            var itemDefinition = item[$rootScope.nsPrefix + "Definition__c"];
            if (itemDefinition.bypassSave)
                delete itemDefinition.bypassSave;
            if (itemDefinition && typeof itemDefinition === "string") {
                itemDefinition = JSON.parse(itemDefinition);
            }
            itemDefinition.GlobalKey__c = item[$rootScope.nsPrefix + "GlobalKey__c"]
            return `let definition = 
                ${angular.toJson(itemDefinition)}; 
            export default definition`;
        }

        function getCardHtmlCode(cardDefinition) {
            var statesTemplate = "";
            var statesTemplateNoRecord = "";
            var statesTemplateNoRepeat = "";
            if (cardDefinition && typeof cardDefinition === "string") {
                cardDefinition = JSON.parse(cardDefinition);
            }

            cardDefinition.states.forEach(function (item, i) {
                if (item.lwc && item.lwc.DeveloperName) {
                    let name = convertLWCBundleNameToValidHTMLElementName(item.lwc.DeveloperName);
                    let stateLwc = _.find($rootScope.lightningwebcomponents, {
                        DeveloperName: item.lwc.DeveloperName
                    });
                    let customLwcAttributes = " ";
                    item.customLwcAttributes && item.customLwcAttributes.forEach(function (attr) {
                        if (attr.val && attr.val.charAt(0) === '[') { //Only if we are trying to set a single record attributes
                            customLwcAttributes += attr.name + "={record." + attr.val.match(/\['(.*?)\']/)[1] + "} ";
                        } else if (attr.val && attr.val.indexOf('$scope.session.') > -1) {
                            var sessionVarName = attr.val.replace('$scope.session.', '');
                            if (cardDefinition.sessionVars && cardDefinition.sessionVars.length) {
                                var sessionVar = cardDefinition.sessionVars.find(sessionVar => sessionVar.name === sessionVarName);
                                if (sessionVar) {
                                    customLwcAttributes += attr.name + "='" + sessionVar.val + "' ";
                                }
                            }
                        } else if (attr.val && attr.val.indexOf('$scope') > -1) {
                            customLwcAttributes += attr.name + "={" + attr.val.replace('$scope.', '') + "} ";
                        } else if (attr.val.indexOf('params.') > - 1) {
                            customLwcAttributes += attr.name + "={" + attr.val.replace('params.', 'pageParams.') + "} ";
                        } else {
                            customLwcAttributes += attr.name + "='" + attr.val + "' ";
                        }

                    });
                    let namespace = $rootScope.insidePckg && stateLwc.NamespacePrefix ? stateLwc.NamespacePrefix : "c";
                    let orgNamespace = $rootScope.insidePckg && $rootScope.nsPrefix ? $rootScope.nsPrefix.replace("__", "") : "c";
                    if (item.customLwc) {
                        if (item.customLwcRepeat) {
                            statesTemplate += '<' + orgNamespace + '-magic-state key={record.Id} record-id={recordId} theme={theme} ontriggercards={triggerCards} data-index="' + i + '"  class="cf-vlocity-state-' + i + ' cf-vlocity-state" obj={record} records={records}>' +
                                '<' + namespace + '-' + name + customLwcAttributes + ' slot="card"></' + namespace + '-' + name + '>' +
                                generateFlyoutHtml(item) +
                                '</' + orgNamespace + '-magic-state>';
                        } else {
                            statesTemplateNoRepeat += '<template if:true={hasRecords}><' + orgNamespace + '-magic-state record-id={recordId} theme={theme} ontriggercards={triggerCards} data-index="' + i + '"  class="cf-vlocity-state-' + i + ' cf-vlocity-state cf-magic-state" records={records} obj={obj}>' +
                                '<' + namespace + '-' + name + ' slot="card"></' + namespace + '-' + name + '>' +
                                generateFlyoutHtml(item) +
                                '</' + orgNamespace + '-magic-state></template>';
                        }
                        statesTemplateNoRecord += '<' + orgNamespace + '-magic-state data-index="' + i + '" record-id={recordId} theme={theme} class="cf-vlocity-state-' + i + ' cf-vlocity-state" >' +
                            '<' + namespace + '-' + name + ' slot="card"></' + namespace + '-' + name + '>' +
                            '</' + orgNamespace + '-magic-state>';
                    } else {
                        statesTemplate += '<' + namespace + '-' + name + ' key={record.Id} record-id={recordId} theme={theme} ontriggercards={triggerCards} data-index="' + i + '"  class="cf-vlocity-state-' + i + ' cf-vlocity-state" obj={record}\
                        ' + customLwcAttributes + ' \
                        >' +
                            generateFlyoutHtml(item) +
                            '</' + namespace + '-' + name + '>';

                        statesTemplateNoRecord += '<' + namespace + '-' + name + ' data-index="' + i + '" record-id={recordId} theme={theme} class="cf-vlocity-state-' + i + ' cf-vlocity-state" >\
                            </' + namespace + '-' + name + '>';
                    }



                    /* if(item.customLwc && !item.customLwcRepeat){
                         statesTemplateNoRepeat += '<' + namespace + '-' + name + ' record-id={recordId} theme={theme} ontriggercards={triggerCards} data-index="' + i + '"  class="cf-vlocity-state-' + i + ' cf-vlocity-state"\
                         ' + customLwcAttributes + ' \
                         >' +
                             generateFlyoutHtml(item) +
                             '</' + namespace + '-' + name + '>';
                     } else {
                         statesTemplate += '<' + namespace + '-' + name + ' key={record.Id} record-id={recordId} theme={theme} ontriggercards={triggerCards} data-index="' + i + '"  class="cf-vlocity-state-' + i + ' cf-vlocity-state" obj={record}\
                     ' + customLwcAttributes + ' \
                     >' +
                         generateFlyoutHtml(item) +
                         '</' + namespace + '-' + name + '>';
                     }
                     statesTemplateNoRecord += '<' + namespace + '-' + name + ' data-index="' + i + '" record-id={recordId} theme={theme} class="cf-vlocity-state-' + i + ' cf-vlocity-state" >\
                                     </' + namespace + '-' + name + '>';
                                     */
                }
            })
            return '<template>\
                    <template if:true={hasRecords}> <template for:each={records}  for:item="record">' +
                statesTemplate +
                '</template> </template>' + statesTemplateNoRepeat +
                '<template if:false={hasRecords} >' +
                statesTemplateNoRecord + //blank state
                '</template>\
            </template>';
        }

        function getCardJsCode(lwcComponentName) {
            let namespace = $rootScope.insidePckg && $rootScope.nsPrefix ? $rootScope.nsPrefix.replace("__", "") : "c";

            return 'import { BaseCard } from "' + namespace + '/baseCard";\
                    import { LightningElement, api, track } from "lwc";\
                    import data from "./definition";\
                    export default class ' + lwcComponentName + ' extends BaseCard(LightningElement) {\
                        connectedCallback() {\
                            this.setDefinition(data);\
                        }\
                    }';
        }

        function generateFlyoutHtml(state) {
            if (state && state.flyout && state.flyout.lwc) {
                let name = state.flyout.lwc.name
                    .replace(/([A-Z])/g, "-$1")
                    .toLowerCase();
                let flyoutLwc = _.find($rootScope.lightningwebcomponents, {
                    DeveloperName: state.flyout.lwc.name
                });
                let namespace = $rootScope.insidePckg && flyoutLwc.NamespacePrefix ? flyoutLwc.NamespacePrefix : "c";
                let customLwcAttributes = " ";
                state.flyoutAttributes && state.flyoutAttributes.forEach(function (attr) {
                    if (attr.val && attr.val.charAt(0) === '[') { //Only if we are trying to set a single record attributes
                        customLwcAttributes += attr.name + "={record." + attr.val.match(/\['(.*?)\']/)[1] + "} ";
                    }
                });

                return '<' + namespace + '-' + name + ' ' + customLwcAttributes + ' slot="flyout" ></' + namespace + '-' + name + ">";
            } else {
                return "";
            }
        }

        function generateLWCFiles(lwcComponentName, item, type) { //itemDefinition can either be a layout or a card definition based on type
            var files = [];
            var jsSource, defSource, htmlSource;
            var itemDefinition = item[$rootScope.nsPrefix + "Definition__c"];

            if (type === "layout") {
                jsSource = getLayoutJsCode(lwcComponentName, itemDefinition);
                htmlSource = (itemDefinition && itemDefinition.lwc) ? getLayoutHtmlCode(itemDefinition.lwc.DeveloperName, item) : '';
            } else {
                jsSource = getCardJsCode(lwcComponentName);
                htmlSource = getCardHtmlCode(itemDefinition);

            }
            defSource = getDefinition(item);

            files.push({
                name: `${lwcComponentName}.js`,
                source: jsSource,
                filepath: `lwc/${lwcComponentName}/${lwcComponentName}.js`,
                format: "js"
            });
            files.push({
                name: `definition.js`,
                source: defSource,
                filepath: `lwc/${lwcComponentName}/definition.js`,
                format: "js"
            });
            files.push({
                name: `${lwcComponentName}.html`,
                source: htmlSource,
                filepath: `lwc/${lwcComponentName}/${lwcComponentName}.html`,
                format: "html"
            });
            files.push({
                name: `${lwcComponentName}.svg`,
                source: getComponentSvg(),
                filepath: `lwc/${lwcComponentName}/${lwcComponentName}.svg`,
                format: "svg"
            });
            return files;
        }

        function getComponentSvg() {
            return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
            <svg width="200px" height="200px" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g stroke="none" stroke-width="1" fill="#059DD3" fill-rule="evenodd">
                    <path d="M148,47.9c-4.2-11.3-15.1-18.8-27-18.8c-4,0-7.8,0.8-11.4,2.3c-8.4-8-19.4-12.4-31.1-12.4c-23.7,0-43.4,18.4-45.1,42
                        C19.1,67,9.8,80.9,9.8,96.5c0,21.2,17.3,38.5,38.5,38.5c4.1,0,9,0,14.3,0l2.3-15.2l-16.4,0c-12.6,0-23-10.7-23-23.3
                        c0-10.7,7.2-19.8,17.6-22.3l6.4-1.5L49,65.6l0-0.1c0-0.4-0.1-0.9-0.1-1.3c0-16.3,13.3-29.6,29.6-29.6c9.2,0,17.7,4.2,23.4,11.5
                        l4.8,6.1l0.2-0.3c2.7-4.8,7.9-7.7,13.3-7.7c8.5,0,15.4,6.9,15.4,15.4c0,1.6-0.7,5.2-0.7,5.2l-0.1,0.4l0.4-0.1
                        c0.1,0,5.9-1.6,12.2-1.6c15.5,0,28.1,12.6,28.1,28.1c0,15.5-12.6,28.1-28.1,28.1l-9.2,0l-8.5,15.3c7.9,0,14.3,0,18.2,0h0h0
                        c23.9-0.7,43.3-20.2,43.3-43.4C191.1,67.9,171.8,48.3,148,47.9z"/>
                    <polygon points="87.3,76 115.6,76 100.1,119.8 123.1,119.9 89.1,180.1 96,135.2 76.7,135.2 "/>
                </g>
            </svg>`;
        }

        function updateLocalResources(name, item, type, isNotActive) {
            var definition = item[$rootScope.nsPrefix + "Definition__c"];
            if (typeof definition === "string") {
                definition = JSON.parse(definition);
            }

            if (layoutLwcResource[name]) {
                return updateLwc(name, item, type, isNotActive);
            } else {
                return remoteActions.getAllLWC(name, '').then(function (comp) {
                    layoutLwcResource[name] = comp.records;
                    return updateLwc(name, item, type, isNotActive);
                });
            }
        }

        function getUpdatedLocalResources(name, item, type, isNotActive) {
            var definition = item[$rootScope.nsPrefix + "Definition__c"];
            if (typeof definition === "string") {
                definition = JSON.parse(definition);
            }

            if (layoutLwcResource[name]) {
                return new Promise(function (resolve, reject) {
                    resolve(getUpdatedFiles(layoutLwcResource[name], name, item, type, isNotActive));
                });
            } else {
                return remoteActions.getAllLWC(name, '').then(function (comp) {
                    layoutLwcResource[name] = comp.records;
                    return getUpdatedFiles(layoutLwcResource[name], name, item, type, isNotActive);
                });
            }
        }

        function updateLwc(lwcComponentName, item, type, isNotActive) {
            var resourcesToUpdate = getUpdatedFiles(layoutLwcResource[lwcComponentName], lwcComponentName, item, type, isNotActive);
            if (resourcesToUpdate && resourcesToUpdate.length > 0) {
                console.log("Making update request", lwcComponentName);
                return toolingService.updateResources(resourcesToUpdate, null, lwcComponentName);
            }
            return new Promise(function (resolve, reject) {
                //No pending requests
                resolve(lwcComponentName);
            });
        }

        function doUpdateRequest(resourcesToUpdate) {
            return toolingService.updateResources(resourcesToUpdate, null);
        }


        function getUpdatedFiles(resouces, lwcComponentName, item, type, isNotActive) {
            let xmlMeta = getXmlObject();
            var updateResource = [];
            var itemDefinition = item[$rootScope.nsPrefix + "Definition__c"];
            if (typeof itemDefinition === "string") {
                itemDefinition = JSON.parse(itemDefinition);
            }
            var source;
            if (resouces) {
                resouces.forEach(function (resource) {
                    if (resource.FilePath.includes("definition.js")) {
                        source = getDefinition(item);
                    } else if (resource.FilePath.includes(lwcComponentName + ".html")) {
                        if (type === "layout") {
                            source = (itemDefinition && itemDefinition.lwc) ? getLayoutHtmlCode(itemDefinition.lwc.DeveloperName, item) : '';
                            if (isNotActive) {
                                source = getInactiveHtml(item.Name, type);
                            }
                        } else {
                            source = getCardHtmlCode(itemDefinition);
                        }
                    } else if (resource.FilePath.includes(lwcComponentName + ".js-meta.xml")) {
                        if (type === "layout") {
                            source = xmlMeta.xmlStr;
                        }
                    } else if (resource.FilePath.includes(lwcComponentName + ".js")) {
                        if (type === "layout") {
                            source = (itemDefinition && itemDefinition.lwc) ? getLayoutJsCode(lwcComponentName, itemDefinition) : '';
                        } else {
                            source = getCardJsCode(lwcComponentName);
                        }
                    }
                    //checking if we are actually updating or making same Source update
                    //This reduces size of batches and they are a little faster
                    if (typeof resource.Source === 'undefined' || (resource.Source && !_.isEqual(source, resource.Source))) {
                        resource.Source = source;
                    } else {
                        source = null;
                    }
                    if (source) {
                        updateResource.push({
                            Id: resource.Id,
                            Source: source
                        });
                        source = "";
                    }
                });
            }
            return updateResource;
        }

        function deleteComponent(type, Id) {
            remoteActions.deleteComponent(type, Id);
        }

        function getInactiveHtml(name, type) {
            return '<template><div class="slds-card slds-p-around_medium">\
                        There is no active instance of <br>\
                        <b>' + type.toUpperCase() + ':</b> ' + name + '\
                    </div></template>';
        }

        function getInActiveHtml(name, type) {
            return '<div if:false={isActive} class="slds-card slds-p-around_medium">\
                        There is no active instance of <br>\
                        <b>' + type.toUpperCase() + ':</b> ' + name + '\
                    </div>';
        }

        // Method converts name to valid LWC bundle name by making it camel case, remove kebab case, remove spaces, remove double underscore
        function convertNameToValidLWCCase(str) {
            return str.replace(/\s(.)/g, function (a) {
                return a.toUpperCase();
            })
                .replace(/\s/g, '')
                .replace(/^(.)/, function (b) {
                    return b.toLowerCase();
                })
                .replace(/-(\w)/g, (m => m[1].toUpperCase()))
                .replace(/__/g, "_")
                .replace(/[^a-zA-Z0-9_]/g, '');
        }

        // Method converts LWC name to valid LWC element name which we are adding inside our auto generated html
        function convertLWCBundleNameToValidHTMLElementName(str) {
            return str.replace(/([A-Z])/g, "-$1").toLowerCase();
        }

        // Method to send a patch request to update the metadata of the provided lwcbundle

        function patchLwc(lwcId, patchData) {
            return new Promise(function (resolve, reject) {
                let metaObj = {
                    Id: lwcId,
                    metadata: patchData
                }
                toolingService.updateResources({}, metaObj).then(function (res) {
                    console.log("Success : Patching successfull");
                    resolve(res);
                }, function (err) {
                    reject(err);
                })
            })
        }


        //Download LWC by its name
        function downloadLWC(developerName) {
            return new Promise((resolve, reject) => {
                if ($rootScope.LWCResourcesList[developerName]) {
                    let comp = $rootScope.LWCResourcesList[developerName];
                    generateDownloadZip(comp, developerName, resolve);
                } else {
                    remoteActions.getLWCBundleByDevName(developerName).then(function (comp) {
                        if (comp && comp.records) {
                            generateDownloadZip(comp, developerName, resolve);
                        }
                    }, function (err) {
                        reject(err);
                    });
                }
            });
        }

        function generateDownloadZip(comp, developerName, resolve) {
            let type = 'blob';
            $rootScope.LWCResourcesList[developerName] = comp;
            var zip = new JSZip();
            comp.records.forEach(function (lwc) {
                zip.file(lwc.FilePath.replace("lwc/", ""), lwc.Source);
            });
            zip.generateAsync({
                type: type
            }).then(content => {
                if (navigator.userAgent.toLowerCase().indexOf('firefox') == -1) {
                    saveAs(content, developerName + ".zip");
                } else {
                    let url = window.URL.createObjectURL(content);
                    window.open(url, "_top");
                    setTimeout(function () {
                        window.URL.revokeObjectURL(url);
                    }, 2000);
                }
            });
            resolve(true);
        }

        function prepareMetaObject(obj) {
            let meta = {};
            for (let key in obj) {
                if (
                    key !== "runtimeNamespace" &&
                    key !== "targets" &&
                    key !== "targetConfig" &&
                    key !== "lwcResources" &&
                    key !== "selectedTag" &&
                    key !== "isExplicitImport" && 
                    key !== "targetConfigs"
                ) {
                    meta[key] = obj[key];
                }

                if (key === "runtimeNamespace" && $rootScope.insidePckg) {
                    meta[key] = obj[key];
                }

                if (key === "targets" && obj[key].length) {
                    let targetArr = [];
                    obj[key].forEach(item => {
                        targetArr.push(item.target);
                    });
                    meta[key] = {
                        target: [...targetArr]
                    };
                }
                if(key === "targetConfigs" && obj[key].length){
                    meta[key] = obj[key].asByteArray ? obj[key].asByteArray : obj[key]
                }
            }
            return meta;
        };

        function generateXml(xmlObj) {
            let xmlStr = `
                <?xml version="1.0" encoding="UTF-8"?>
                <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
                `;
            //let xmlObj = { ...$scope.xmlObject };
            if (xmlObj.apiVersion) {
                xmlStr =
                    xmlStr +
                    `
                  <apiVersion>${xmlObj.apiVersion}.0</apiVersion>
                  `;
            }
            xmlStr =
                xmlStr +
                `
                  <isExposed>${xmlObj.isExposed}</isExposed>
                  `;
            if (xmlObj.description) {
                xmlStr =
                    xmlStr +
                    `
                  <description xmlns="">${xmlObj.description}</description>
                  `;
            }
            if (xmlObj.masterLabel) {
                xmlStr =
                    xmlStr +
                    `
                  <masterLabel xmlns="">${xmlObj.masterLabel}</masterLabel>
                  `;
            }
            if (xmlObj.runtimeNamespace && $rootScope.insidePckg) {
                xmlStr =
                    xmlStr +
                    `
                  <runtimeNamespace xmlns="">${xmlObj.runtimeNamespace}</runtimeNamespace>
                  `;
            }
            if (xmlObj.targets && xmlObj.targets.length) {
                let targetStr = `
                  <targets>
                  `;
                xmlObj.targets.forEach(item => {
                    targetStr =
                        targetStr +
                        `
                      <target>${item.target}</target>
                      `;
                });
                targetStr =
                    targetStr +
                    `
                  </targets>
                  `;
                xmlStr = xmlStr + targetStr;
            }
            if (xmlObj.targetConfig && xmlObj.targetConfig.length) {
                let targetConfigStr = "";

                xmlObj.targetConfig.forEach(item => {
                    if (item.target) {
                        targetConfigStr =
                            targetConfigStr +
                            `
                      <targetConfig targets="${item.target}">
                      `;
                    }
                    if (item.property) {
                        let propertyStr = ``;

                        for (let index of item.property) {
                            propertyStr = propertyStr + `<property`;
                            if (index.name) {
                                propertyStr = propertyStr + ` name="${index.name}" `;
                            }
                            if (index.value) {
                                for (let x in index.value) {
                                    if (x !== "selectedProp" && x !== "name") {
                                        propertyStr = propertyStr + `${x}="${index.value[x]}" `;
                                    }
                                }
                            }
                            propertyStr =
                                propertyStr +
                                ` />
                        `;
                        }
                        targetConfigStr = targetConfigStr + propertyStr;
                    }
                    if (item.objects.length) {
                        let objStr = `<objects>
                      `;
                        item.objects.forEach(val => {
                            objStr =
                                objStr +
                                `<object>${val}</object>
                      `;
                        });
                        objStr =
                            objStr +
                            `</objects>
                      `;
                        targetConfigStr = targetConfigStr + objStr;
                    }
                    targetConfigStr =
                        targetConfigStr +
                        `</targetConfig>
                    `;
                });

                xmlStr = xmlStr + `<targetConfigs> ${targetConfigStr} </targetConfigs>`;
                xmlObj.targetConfigs = window.btoa(targetConfigStr);
            }
            return (
                xmlStr +
                `
                </LightningComponentBundle>
                `
            );
        };

        function getNameAndTarget(targetArray) {
            const lookup = {
                "lightning__AppPage": "AppPage",
                "lightning__HomePage": "HomePage",
                "lightning__RecordPage": "RecordPage",
                "lightningCommunity__Page": "CommunityPage",
                "lightningCommunity__Default": "CommunityDefault",
            }
            let retArr = [];
            targetArray.forEach(item => {
                retArr.push({
                    name: lookup[item],
                    target: item
                })
            })
            return retArr;
        }

        function addRemoteSiteVisualforce() {

            let fullName = "EnableLWCPreview" + Date.now();
            let visualforceUrl = window.toolingBaseUrl;

            return new Promise(function (resolve, reject) {
                toolingService.addRemoteSiteSetting(fullName, visualforceUrl).then(function (id) {
                    console.log("Success: " + id);
                    resolve(id);
                }, function (err) {
                    reject(err);
                })
            });
        }

        function addRemoteSiteLightning() {

            let fullName = "EnableLWC" + Date.now();
            let lightningUrl = window.toolingBaseUrl.replace(/(.*)--.*/, '$1.lightning.force.com');

            return new Promise(function (resolve, reject) {
                toolingService.addRemoteSiteSetting(fullName, lightningUrl).then(function (id) {
                    console.log("Success: " + id);
                    resolve(id);
                }, function (err) {
                    reject(err);
                })
            });
        }

        function isRemoteSiteVisualforce() {

            let visualforceUrl = window.toolingBaseUrl;

            return new Promise(function (resolve, reject) {
                toolingService.isRemoteSiteSetting(visualforceUrl).then(function (res) {
                    console.log("Success: " + res);
                    resolve(res);
                }, function (err) {
                    reject(err);
                })
            });
        }

        function isRemoteSiteLightning() {

            let lightningUrl = window.toolingBaseUrl.replace(/(.*)--.*/, '$1.lightning.force.com');

            return new Promise(function (resolve, reject) {
                toolingService.isRemoteSiteSetting(lightningUrl).then(function (res) {
                    console.log("Success: " + res);
                    resolve(res);
                }, function (err) {
                    reject(err);
                })
            });
        }

        return {
            createNewLwc: createNewLwc,
            getXmlObject: getXmlObject,
            setXmlObject: setXmlObject,
            patchLwc: patchLwc,
            getLwcNameFromFilepath: getLwcNameFromFilepath,
            generateLWCFiles: generateLWCFiles,
            updateLwc: updateLwc,
            updateLocalResources: updateLocalResources,
            deleteComponent: deleteComponent,
            convertNameToValidLWCCase: convertNameToValidLWCCase,
            DEFAULT_LWC_PREFIX: DEFAULT_LWC_PREFIX,
            getUpdatedLocalResources: getUpdatedLocalResources,
            doUpdateRequest: doUpdateRequest,
            layoutLwcResource: layoutLwcResource,
            downloadLWC: downloadLWC,
            isDeploymentPending: isDeploymentPending,
            prepareMetaObject: prepareMetaObject,
            generateXml: generateXml,
            getNameAndTarget: getNameAndTarget,
            isRemoteSiteVisualforce: isRemoteSiteVisualforce,
            isRemoteSiteLightning: isRemoteSiteLightning,
            addRemoteSiteVisualforce: addRemoteSiteVisualforce,
            addRemoteSiteLightning: addRemoteSiteLightning
        };
    });
},{}],3:[function(require,module,exports){
(function () {
    /* jshint -W030 */
    'use strict';
    window.angular.module('cardutil')
        .service('toolingService', ['$http', function ($http) {

            const urlPrefix = '/services/data/v46.0/tooling/',
                sobjectsUrl = urlPrefix + 'sobjects/',
                queryUrl = urlPrefix + 'query',
                batchUrl = urlPrefix + 'composite/batch';

            this.createLwcBundle = createLwcBundle;
            this.processResources = processResources;
            this.updateResources = updateResources;
            this.isRemoteSiteSetting = isRemoteSiteSetting;
            this.addRemoteSiteSetting = addRemoteSiteSetting;

            function createLwcBundle(lwcName, metadata) {
                return new Promise((resolve, reject) => {
                    submitRequest({
                        url: `${sobjectsUrl}LightningComponentBundle`, data: {
                            FullName: lwcName,
                            Metadata: metadata || {}
                        }
                    })
                    .then(result => {
                        if (!result.success) {
                            reject(result.errors);
                            return;
                        }
                        resolve(result.id);
                    })
                    .catch(error => {
                        reject([...new Set(error.map(e => e))]);
                    })
                });
            }

            function processResources(lwcName, bundleId, resources) {
                return new Promise((resolve, reject) => {

                    // Create a dummy request as we need this in order to re-create the removed resources
                    let dummyRequest = createLightningResourceRequest({
                        FilePath: `lwc/${lwcName}/${lwcName}.js`,
                        Source: "import { api } from 'lwc'; export default class test { @api layout; }",
                        LightningComponentBundleId: bundleId,
                        Format : "js"
                    });

                    submitRequest({ url: dummyRequest.url, data: dummyRequest.richInput, method: dummyRequest.method })
                        .then(dummyResponse => {
                            if (!dummyResponse.success) {
                                throw new Error(dummyResponse.errors);  // Throw the error so it can be handled on the catch
                            }

                            // Create the required amount of batches
                            const batches = resources.slice(1).map(resource => createLightningResourceRequest(resource));

                            // Now, create the request for the dummy class
                            resources[0].Id = dummyResponse.id;
                            batches.push(createLightningResourceRequest(resources[0], 'PATCH'));

                            const size = 25;
                            const chunks = Array.from(Array(Math.ceil(batches.length / size)), (_, i) => batches.slice(i * size, i * size + size));

                            // We can process only 25 elements at the time using batch
                            return chunks.reduce((previousPromise, chunk) => {
                                return previousPromise.then(_ => processPartialBatch(chunk));
                            }, Promise.resolve({ hasErrors: false }));
                        })
                        .then(resolve)
                        .catch(error => {
                            const errors = new Set(error.map(e => typeof (e) === 'String' ? e : e));
                            reject([...errors]);
                        });
                });
            }

            function updateResources(resources,metaObject){
                return new Promise((resolve, reject) => {
                    const batches = !(Object.keys(resources).length === 0 && resources.constructor === Object)?resources.map(resource => createLightningResourceRequest(resource, 'PATCH')) : [createLightningResourceRequest({},'PATCH',metaObject)];
                    const size = 25;
                    const chunks = Array.from(Array(Math.ceil(batches.length / size)), (_, i) => batches.slice(i * size, i * size + size));

                    // We can process only 25 elements at the time using batch
                    return chunks.reduce((previousPromise, chunk) => {
                        return previousPromise.then(_ => processPartialBatch(chunk));
                    }, Promise.resolve({ hasErrors: false }))
                        .then(resolve)
                        .catch(error => {
                            if (!Array.isArray(error)) error = [error];
                            const errors = new Set(error.map(e => typeof (e) === 'String' ? e : e.message || e));
                            reject([...errors]);
                        });
                });
            }

            /**
             * Submits an array of LightningComponentResource in a batch request.
             * @param {Array} resources The LightningComponentResource that will be processed
             * @returns {Promise<void>}
             */
            function processPartialBatch(resources) {
                return new Promise((resolve, reject) => {
                    const request = {
                        batchRequests: resources,
                        haltOnError: true
                    };
                    submitRequest({ url: batchUrl, data: request })
                        .then(response => {
                            if (response.hasErrors) {
                                const errors = response.results
                                    .filter(result => result.statusCode < 200 || result.statusCode > 299)    // Only the errors
                                    .map(result => result.result)                                            // Return the array or results of the result
                                    .reduce((accumulator, result) => accumulator.concat(result.map(r => r.message)), [])         // Flatten array of arrays (only the message)
                                    .reduce((errors, error) => errors.add(error), new Set());                                    // Convert to a set, so no duplicate errors

                                reject([...errors]);
                            } else {
                                resolve();
                            }
                        })
                        .catch(reject);
                });
            }

            /**
             * Creates the request object for the LightningComponentResource
             * @param {string} bundleId The LightningComponentBundle (LWC) component
             * @param {object} resource The resource object that comes from the compiler o other tooling methods
             * @returns {object}
             */
            
            function createLightningResourceRequest(resource, method, lwcObj) {
                var baseUrl = (resource && resource.metadata) ? sobjectsUrl+'LightningComponentBundle' : sobjectsUrl+'LightningComponentResource'
                const request = {
                    url: baseUrl,
                    method: method || 'POST',
                    richInput: null
                }
                switch (method) {
                    case 'PATCH':
                        request.richInput = !resource.metadata ? {
                            Source : resource.Source
                        }:{
                            Metadata: resource.metadata
                        }
                        request.url = baseUrl + "/" + resource.Id;
                        break;
                    case 'DELETE':
                        request.url = baseUrl + "/" + resource.id;
                        break;
                    default:
                        request.richInput = resource
                        break;
                }
                return request;
            }

            function addRemoteSiteSetting(fullName, endpointUrl) {
                return new Promise((resolve, reject) => {
                    submitRequest({
                        url: `${sobjectsUrl}RemoteProxy`, data: {
                            FullName: fullName,
                            Metadata: {
                                isActive: true,
                                url: endpointUrl
                            }
                        }
                    })
                    .then(result => {
                        if (!result.success) {
                            reject(result.errors);
                            return;
                        }
                        resolve(result.id);
                    })
                    .catch(error => {
                        reject([...new Set(error.map(e => e))]);
                    })
                });
            }

            function isRemoteSiteSetting(endpointUrl) {

                var queryParam = "SELECT FullName, IsActive FROM RemoteProxy WHERE EndpointUrl LIKE '" + endpointUrl + "' AND IsActive = true LIMIT 1";
                return new Promise((resolve, reject) => {
                    submitRequest({
                        method: 'GET',
                        url: `${queryUrl}`, 
                        params: {
                            q: queryParam,
                        }
                    })
                    .then(result => {
                        if (result.records && result.records.length > 0) {
                            resolve(true);
                        }
                        reject(false);
                    })
                    .catch(error => {
                        reject([...new Set(error.map(e => e))]);
                    })
                });
            }

            /**
             * Creates an HTTP request to the provided URL.
             * @param {object} request 
             * @param {string} request.url The URL for the request.
             * @param {string} request.data Optional. Any data that needs to be sent on the request.
             * @param {string} request.params Optional. Any params that needs to be sent on the request.
             * @param {string} request.method Optional. The HTTP method. POST by default.
             */
            function submitRequest(request) {
                return new Promise((resolve, reject) => {
                    const baseUrl = window.toolingBaseUrl;
                    const url = `${baseUrl}${request.url}`;

                    $http({
                        method: request.method || 'POST',
                        url: url,
                        headers: {
                            'Authorization': 'Bearer ' + window.sessionId,
                            'Content-Type': 'application/json'
                        },
                        data: request.data,
                        params: request.params
                    })
                        .then(response => resolve(response.data))
                        .catch(response => reject(response.data));
                });
            }
        }]);
}());
},{}]},{},[1]);
})();

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
require('./dependencies/native.history.js');
require('./polyfills/Array.find.js');
require('./polyfills/Array.findIndex.js');

angular.module('carddesigner', ['vlocity', 'dndLists', 'mgcrea.ngStrap',
                        'ngSanitize', 'viaDirectives', 'CardFramework', 'forceng', 'cardutil'])
  .config(function($locationProvider) {
      'use strict';
      $locationProvider.html5Mode({
          enabled: !!(window.history && history.pushState),
          requireBase: false
      });
  }).config(['remoteActionsProvider', function(remoteActionsProvider) {
      'use strict';
      remoteActionsProvider.setRemoteActions(window.remoteActions || {});
  }]).config(['$compileProvider', function ($compileProvider) {
      'use strict';
      $compileProvider.debugInfoEnabled(false);
  }]).config(['$localizableProvider', function($localizableProvider) {
      'use strict';
      $localizableProvider.setLocalizedMap(window.i18n);
      $localizableProvider.setDebugMode(window.ns === '');
  }]).run(['$rootScope', 'force', function($rootScope, force) {
      'use strict';
      $rootScope.nsPrefix = window.fileNsPrefix ? window.fileNsPrefix() : fileNsPrefix();
      $rootScope.sessionId = window.sessionId  ? window.sessionId : sessionId;
      $rootScope.enableCometD = false;
      force.init({accessToken: $rootScope.sessionId, useProxy: false});
  }]).config(function($typeaheadProvider) {
      'use strict';
      angular.extend($typeaheadProvider.defaults, {
          watchOptions: true,
          minLength: 0,
          // ApexRemote currently has 600+ Apex classes, set this from 100 to 1200
          // to make sure it can scroll all the way
          limit: 1200
      });
  });

require('./modules/carddesigner/config/config.js');

require('./modules/carddesigner/controller/CardDesignerController.js');
require('./modules/carddesigner/controller/LayoutController.js');
require('./modules/carddesigner/controller/CardController.js');
require('./modules/carddesigner/controller/TabController.js');
require('./modules/carddesigner/controller/StatesController.js');
require('./modules/carddesigner/controller/XmlInterfaceDesignController.js');

require('./modules/carddesigner/factory/Save.js');
require('./modules/carddesigner/factory/sObjectsFactory.js');
require('./modules/carddesigner/factory/InterTabMsgBus.js');
require('./modules/carddesigner/factory/HelpNode.js');

require('./modules/carddesigner/filter/FilterAndSort.js');

require('./modules/carddesigner/directive/DataSource.js');
require('./modules/carddesigner/directive/CopyToClipboard.js');

require('./modules/carddesigner/templates/templates.js');

},{"./dependencies/native.history.js":2,"./modules/carddesigner/config/config.js":3,"./modules/carddesigner/controller/CardController.js":4,"./modules/carddesigner/controller/CardDesignerController.js":5,"./modules/carddesigner/controller/LayoutController.js":6,"./modules/carddesigner/controller/StatesController.js":7,"./modules/carddesigner/controller/TabController.js":8,"./modules/carddesigner/controller/XmlInterfaceDesignController.js":9,"./modules/carddesigner/directive/CopyToClipboard.js":10,"./modules/carddesigner/directive/DataSource.js":11,"./modules/carddesigner/factory/HelpNode.js":12,"./modules/carddesigner/factory/InterTabMsgBus.js":13,"./modules/carddesigner/factory/Save.js":14,"./modules/carddesigner/factory/sObjectsFactory.js":15,"./modules/carddesigner/filter/FilterAndSort.js":16,"./modules/carddesigner/templates/templates.js":17,"./polyfills/Array.find.js":18,"./polyfills/Array.findIndex.js":19}],2:[function(require,module,exports){
typeof JSON!="object"&&(JSON={}),function(){"use strict";function f(e){return e<10?"0"+e:e}function quote(e){return escapable.lastIndex=0,escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t=="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];a&&typeof a=="object"&&typeof a.toJSON=="function"&&(a=a.toJSON(e)),typeof rep=="function"&&(a=rep.call(t,e,a));switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a)return"null";gap+=indent,u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1)u[n]=str(n,a)||"null";return i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]",gap=o,i}if(rep&&typeof rep=="object"){s=rep.length;for(n=0;n<s;n+=1)typeof rep[n]=="string"&&(r=rep[n],i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i))}else for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i));return i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}",gap=o,i}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(e){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(e){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(e,t,n){var r;gap="",indent="";if(typeof n=="number")for(r=0;r<n;r+=1)indent+=" ";else typeof n=="string"&&(indent=n);rep=t;if(!t||typeof t=="function"||typeof t=="object"&&typeof t.length=="number")return str("",{"":e});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i=="object")for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r=walk(i,n),r!==undefined?i[n]=r:delete i[n]);return reviver.call(e,t,i)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),function(e,t){"use strict";var n=e.History=e.History||{};if(typeof n.Adapter!="undefined")throw new Error("History.js Adapter has already been loaded...");n.Adapter={handlers:{},_uid:1,uid:function(e){return e._uid||(e._uid=n.Adapter._uid++)},bind:function(e,t,r){var i=n.Adapter.uid(e);n.Adapter.handlers[i]=n.Adapter.handlers[i]||{},n.Adapter.handlers[i][t]=n.Adapter.handlers[i][t]||[],n.Adapter.handlers[i][t].push(r),e["on"+t]=function(e,t){return function(r){n.Adapter.trigger(e,t,r)}}(e,t)},trigger:function(e,t,r){r=r||{};var i=n.Adapter.uid(e),s,o;n.Adapter.handlers[i]=n.Adapter.handlers[i]||{},n.Adapter.handlers[i][t]=n.Adapter.handlers[i][t]||[];for(s=0,o=n.Adapter.handlers[i][t].length;s<o;++s)n.Adapter.handlers[i][t][s].apply(this,[r])},extractEventData:function(e,n){var r=n&&n[e]||t;return r},onDomLoad:function(t){var n=e.setTimeout(function(){t()},2e3);e.onload=function(){clearTimeout(n),t()}}},typeof n.init!="undefined"&&n.init()}(window),function(e,t){"use strict";var n=e.document,r=e.setTimeout||r,i=e.clearTimeout||i,s=e.setInterval||s,o=e.History=e.History||{};if(typeof o.initHtml4!="undefined")throw new Error("History.js HTML4 Support has already been loaded...");o.initHtml4=function(){if(typeof o.initHtml4.initialized!="undefined")return!1;o.initHtml4.initialized=!0,o.enabled=!0,o.savedHashes=[],o.isLastHash=function(e){var t=o.getHashByIndex(),n;return n=e===t,n},o.isHashEqual=function(e,t){return e=encodeURIComponent(e).replace(/%25/g,"%"),t=encodeURIComponent(t).replace(/%25/g,"%"),e===t},o.saveHash=function(e){return o.isLastHash(e)?!1:(o.savedHashes.push(e),!0)},o.getHashByIndex=function(e){var t=null;return typeof e=="undefined"?t=o.savedHashes[o.savedHashes.length-1]:e<0?t=o.savedHashes[o.savedHashes.length+e]:t=o.savedHashes[e],t},o.discardedHashes={},o.discardedStates={},o.discardState=function(e,t,n){var r=o.getHashByState(e),i;return i={discardedState:e,backState:n,forwardState:t},o.discardedStates[r]=i,!0},o.discardHash=function(e,t,n){var r={discardedHash:e,backState:n,forwardState:t};return o.discardedHashes[e]=r,!0},o.discardedState=function(e){var t=o.getHashByState(e),n;return n=o.discardedStates[t]||!1,n},o.discardedHash=function(e){var t=o.discardedHashes[e]||!1;return t},o.recycleState=function(e){var t=o.getHashByState(e);return o.discardedState(e)&&delete o.discardedStates[t],!0},o.emulated.hashChange&&(o.hashChangeInit=function(){o.checkerFunction=null;var t="",r,i,u,a,f=Boolean(o.getHash());return o.isInternetExplorer()?(r="historyjs-iframe",i=n.createElement("iframe"),i.setAttribute("id",r),i.setAttribute("src","#"),i.style.display="none",n.body.appendChild(i),i.contentWindow.document.open(),i.contentWindow.document.close(),u="",a=!1,o.checkerFunction=function(){if(a)return!1;a=!0;var n=o.getHash(),r=o.getHash(i.contentWindow.document);return n!==t?(t=n,r!==n&&(u=r=n,i.contentWindow.document.open(),i.contentWindow.document.close(),i.contentWindow.document.location.hash=o.escapeHash(n)),o.Adapter.trigger(e,"hashchange")):r!==u&&(u=r,f&&r===""?o.back():o.setHash(r,!1)),a=!1,!0}):o.checkerFunction=function(){var n=o.getHash()||"";return n!==t&&(t=n,o.Adapter.trigger(e,"hashchange")),!0},o.intervalList.push(s(o.checkerFunction,o.options.hashChangeInterval)),!0},o.Adapter.onDomLoad(o.hashChangeInit)),o.emulated.pushState&&(o.onHashChange=function(t){var n=t&&t.newURL||o.getLocationHref(),r=o.getHashByUrl(n),i=null,s=null,u=null,a;return o.isLastHash(r)?(o.busy(!1),!1):(o.doubleCheckComplete(),o.saveHash(r),r&&o.isTraditionalAnchor(r)?(o.Adapter.trigger(e,"anchorchange"),o.busy(!1),!1):(i=o.extractState(o.getFullUrl(r||o.getLocationHref()),!0),o.isLastSavedState(i)?(o.busy(!1),!1):(s=o.getHashByState(i),a=o.discardedState(i),a?(o.getHashByIndex(-2)===o.getHashByState(a.forwardState)?o.back(!1):o.forward(!1),!1):(o.pushState(i.data,i.title,encodeURI(i.url),!1),!0))))},o.Adapter.bind(e,"hashchange",o.onHashChange),o.pushState=function(t,n,r,i){r=encodeURI(r).replace(/%25/g,"%");if(o.getHashByUrl(r))throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");if(i!==!1&&o.busy())return o.pushQueue({scope:o,callback:o.pushState,args:arguments,queue:i}),!1;o.busy(!0);var s=o.createStateObject(t,n,r),u=o.getHashByState(s),a=o.getState(!1),f=o.getHashByState(a),l=o.getHash(),c=o.expectedStateId==s.id;return o.storeState(s),o.expectedStateId=s.id,o.recycleState(s),o.setTitle(s),u===f?(o.busy(!1),!1):(o.saveState(s),c||o.Adapter.trigger(e,"statechange"),!o.isHashEqual(u,l)&&!o.isHashEqual(u,o.getShortUrl(o.getLocationHref()))&&o.setHash(u,!1),o.busy(!1),!0)},o.replaceState=function(t,n,r,i){r=encodeURI(r).replace(/%25/g,"%");if(o.getHashByUrl(r))throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");if(i!==!1&&o.busy())return o.pushQueue({scope:o,callback:o.replaceState,args:arguments,queue:i}),!1;o.busy(!0);var s=o.createStateObject(t,n,r),u=o.getHashByState(s),a=o.getState(!1),f=o.getHashByState(a),l=o.getStateByIndex(-2);return o.discardState(a,s,l),u===f?(o.storeState(s),o.expectedStateId=s.id,o.recycleState(s),o.setTitle(s),o.saveState(s),o.Adapter.trigger(e,"statechange"),o.busy(!1)):o.pushState(s.data,s.title,s.url,!1),!0}),o.emulated.pushState&&o.getHash()&&!o.emulated.hashChange&&o.Adapter.onDomLoad(function(){o.Adapter.trigger(e,"hashchange")})},typeof o.init!="undefined"&&o.init()}(window),function(e,t){"use strict";var n=e.console||t,r=e.document,i=e.navigator,s=e.sessionStorage||!1,o=e.setTimeout,u=e.clearTimeout,a=e.setInterval,f=e.clearInterval,l=e.JSON,c=e.alert,h=e.History=e.History||{},p=e.history;try{s.setItem("TEST","1"),s.removeItem("TEST")}catch(d){s=!1}l.stringify=l.stringify||l.encode,l.parse=l.parse||l.decode;if(typeof h.init!="undefined")throw new Error("History.js Core has already been loaded...");h.init=function(e){return typeof h.Adapter=="undefined"?!1:(typeof h.initCore!="undefined"&&h.initCore(),typeof h.initHtml4!="undefined"&&h.initHtml4(),!0)},h.initCore=function(d){if(typeof h.initCore.initialized!="undefined")return!1;h.initCore.initialized=!0,h.options=h.options||{},h.options.hashChangeInterval=h.options.hashChangeInterval||100,h.options.safariPollInterval=h.options.safariPollInterval||500,h.options.doubleCheckInterval=h.options.doubleCheckInterval||500,h.options.disableSuid=h.options.disableSuid||!1,h.options.storeInterval=h.options.storeInterval||1e3,h.options.busyDelay=h.options.busyDelay||250,h.options.debug=h.options.debug||!1,h.options.initialTitle=h.options.initialTitle||r.title,h.options.html4Mode=h.options.html4Mode||!1,h.options.delayInit=h.options.delayInit||!1,h.intervalList=[],h.clearAllIntervals=function(){var e,t=h.intervalList;if(typeof t!="undefined"&&t!==null){for(e=0;e<t.length;e++)f(t[e]);h.intervalList=null}},h.debug=function(){(h.options.debug||!1)&&h.log.apply(h,arguments)},h.log=function(){var e=typeof n!="undefined"&&typeof n.log!="undefined"&&typeof n.log.apply!="undefined",t=r.getElementById("log"),i,s,o,u,a;e?(u=Array.prototype.slice.call(arguments),i=u.shift(),typeof n.debug!="undefined"?n.debug.apply(n,[i,u]):n.log.apply(n,[i,u])):i="\n"+arguments[0]+"\n";for(s=1,o=arguments.length;s<o;++s){a=arguments[s];if(typeof a=="object"&&typeof l!="undefined")try{a=l.stringify(a)}catch(f){}i+="\n"+a+"\n"}return t?(t.value+=i+"\n-----\n",t.scrollTop=t.scrollHeight-t.clientHeight):e||c(i),!0},h.getInternetExplorerMajorVersion=function(){var e=h.getInternetExplorerMajorVersion.cached=typeof h.getInternetExplorerMajorVersion.cached!="undefined"?h.getInternetExplorerMajorVersion.cached:function(){var e=3,t=r.createElement("div"),n=t.getElementsByTagName("i");while((t.innerHTML="<!--[if gt IE "+ ++e+"]><i></i><![endif]-->")&&n[0]);return e>4?e:!1}();return e},h.isInternetExplorer=function(){var e=h.isInternetExplorer.cached=typeof h.isInternetExplorer.cached!="undefined"?h.isInternetExplorer.cached:Boolean(h.getInternetExplorerMajorVersion());return e},h.options.html4Mode?h.emulated={pushState:!0,hashChange:!0}:h.emulated={pushState:!Boolean(e.history&&e.history.pushState&&e.history.replaceState&&!/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(i.userAgent)&&!/AppleWebKit\/5([0-2]|3[0-2])/i.test(i.userAgent)),hashChange:Boolean(!("onhashchange"in e||"onhashchange"in r)||h.isInternetExplorer()&&h.getInternetExplorerMajorVersion()<8)},h.enabled=!h.emulated.pushState,h.bugs={setHash:Boolean(!h.emulated.pushState&&i.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),safariPoll:Boolean(!h.emulated.pushState&&i.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),ieDoubleCheck:Boolean(h.isInternetExplorer()&&h.getInternetExplorerMajorVersion()<8),hashEscape:Boolean(h.isInternetExplorer()&&h.getInternetExplorerMajorVersion()<7)},h.isEmptyObject=function(e){for(var t in e)if(e.hasOwnProperty(t))return!1;return!0},h.cloneObject=function(e){var t,n;return e?(t=l.stringify(e),n=l.parse(t)):n={},n},h.getRootUrl=function(){var e=r.location.protocol+"//"+(r.location.hostname||r.location.host);if(r.location.port||!1)e+=":"+r.location.port;return e+="/",e},h.getBaseHref=function(){var e=r.getElementsByTagName("base"),t=null,n="";return e.length===1&&(t=e[0],n=t.href.replace(/[^\/]+$/,"")),n=n.replace(/\/+$/,""),n&&(n+="/"),n},h.getBaseUrl=function(){var e=h.getBaseHref()||h.getBasePageUrl()||h.getRootUrl();return e},h.getPageUrl=function(){var e=h.getState(!1,!1),t=(e||{}).url||h.getLocationHref(),n;return n=t.replace(/\/+$/,"").replace(/[^\/]+$/,function(e,t,n){return/\./.test(e)?e:e+"/"}),n},h.getBasePageUrl=function(){var e=h.getLocationHref().replace(/[#\?].*/,"").replace(/[^\/]+$/,function(e,t,n){return/[^\/]$/.test(e)?"":e}).replace(/\/+$/,"")+"/";return e},h.getFullUrl=function(e,t){var n=e,r=e.substring(0,1);return t=typeof t=="undefined"?!0:t,/[a-z]+\:\/\//.test(e)||(r==="/"?n=h.getRootUrl()+e.replace(/^\/+/,""):r==="#"?n=h.getPageUrl().replace(/#.*/,"")+e:r==="?"?n=h.getPageUrl().replace(/[\?#].*/,"")+e:t?n=h.getBaseUrl()+e.replace(/^(\.\/)+/,""):n=h.getBasePageUrl()+e.replace(/^(\.\/)+/,"")),n.replace(/\#$/,"")},h.getShortUrl=function(e){var t=e,n=h.getBaseUrl(),r=h.getRootUrl();return h.emulated.pushState&&(t=t.replace(n,"")),t=t.replace(r,"/"),h.isTraditionalAnchor(t)&&(t="./"+t),t=t.replace(/^(\.\/)+/g,"./").replace(/\#$/,""),t},h.getLocationHref=function(e){return e=e||r,e.URL===e.location.href?e.location.href:e.location.href===decodeURIComponent(e.URL)?e.URL:e.location.hash&&decodeURIComponent(e.location.href.replace(/^[^#]+/,""))===e.location.hash?e.location.href:e.URL.indexOf("#")==-1&&e.location.href.indexOf("#")!=-1?e.location.href:e.URL||e.location.href},h.store={},h.idToState=h.idToState||{},h.stateToId=h.stateToId||{},h.urlToId=h.urlToId||{},h.storedStates=h.storedStates||[],h.savedStates=h.savedStates||[],h.normalizeStore=function(){h.store.idToState=h.store.idToState||{},h.store.urlToId=h.store.urlToId||{},h.store.stateToId=h.store.stateToId||{}},h.getState=function(e,t){typeof e=="undefined"&&(e=!0),typeof t=="undefined"&&(t=!0);var n=h.getLastSavedState();return!n&&t&&(n=h.createStateObject()),e&&(n=h.cloneObject(n),n.url=n.cleanUrl||n.url),n},h.getIdByState=function(e){var t=h.extractId(e.url),n;if(!t){n=h.getStateString(e);if(typeof h.stateToId[n]!="undefined")t=h.stateToId[n];else if(typeof h.store.stateToId[n]!="undefined")t=h.store.stateToId[n];else{for(;;){t=(new Date).getTime()+String(Math.random()).replace(/\D/g,"");if(typeof h.idToState[t]=="undefined"&&typeof h.store.idToState[t]=="undefined")break}h.stateToId[n]=t,h.idToState[t]=e}}return t},h.normalizeState=function(e){var t,n;if(!e||typeof e!="object")e={};if(typeof e.normalized!="undefined")return e;if(!e.data||typeof e.data!="object")e.data={};return t={},t.normalized=!0,t.title=e.title||"",t.url=h.getFullUrl(e.url?e.url:h.getLocationHref()),t.hash=h.getShortUrl(t.url),t.data=h.cloneObject(e.data),t.id=h.getIdByState(t),t.cleanUrl=t.url.replace(/\??\&_suid.*/,""),t.url=t.cleanUrl,n=!h.isEmptyObject(t.data),(t.title||n)&&h.options.disableSuid!==!0&&(t.hash=h.getShortUrl(t.url).replace(/\??\&_suid.*/,""),/\?/.test(t.hash)||(t.hash+="?"),t.hash+="&_suid="+t.id),t.hashedUrl=h.getFullUrl(t.hash),(h.emulated.pushState||h.bugs.safariPoll)&&h.hasUrlDuplicate(t)&&(t.url=t.hashedUrl),t},h.createStateObject=function(e,t,n){var r={data:e,title:t,url:n};return r=h.normalizeState(r),r},h.getStateById=function(e){e=String(e);var n=h.idToState[e]||h.store.idToState[e]||t;return n},h.getStateString=function(e){var t,n,r;return t=h.normalizeState(e),n={data:t.data,title:e.title,url:e.url},r=l.stringify(n),r},h.getStateId=function(e){var t,n;return t=h.normalizeState(e),n=t.id,n},h.getHashByState=function(e){var t,n;return t=h.normalizeState(e),n=t.hash,n},h.extractId=function(e){var t,n,r,i;return e.indexOf("#")!=-1?i=e.split("#")[0]:i=e,n=/(.*)\&_suid=([0-9]+)$/.exec(i),r=n?n[1]||e:e,t=n?String(n[2]||""):"",t||!1},h.isTraditionalAnchor=function(e){var t=!/[\/\?\.]/.test(e);return t},h.extractState=function(e,t){var n=null,r,i;return t=t||!1,r=h.extractId(e),r&&(n=h.getStateById(r)),n||(i=h.getFullUrl(e),r=h.getIdByUrl(i)||!1,r&&(n=h.getStateById(r)),!n&&t&&!h.isTraditionalAnchor(e)&&(n=h.createStateObject(null,null,i))),n},h.getIdByUrl=function(e){var n=h.urlToId[e]||h.store.urlToId[e]||t;return n},h.getLastSavedState=function(){return h.savedStates[h.savedStates.length-1]||t},h.getLastStoredState=function(){return h.storedStates[h.storedStates.length-1]||t},h.hasUrlDuplicate=function(e){var t=!1,n;return n=h.extractState(e.url),t=n&&n.id!==e.id,t},h.storeState=function(e){return h.urlToId[e.url]=e.id,h.storedStates.push(h.cloneObject(e)),e},h.isLastSavedState=function(e){var t=!1,n,r,i;return h.savedStates.length&&(n=e.id,r=h.getLastSavedState(),i=r.id,t=n===i),t},h.saveState=function(e){return h.isLastSavedState(e)?!1:(h.savedStates.push(h.cloneObject(e)),!0)},h.getStateByIndex=function(e){var t=null;return typeof e=="undefined"?t=h.savedStates[h.savedStates.length-1]:e<0?t=h.savedStates[h.savedStates.length+e]:t=h.savedStates[e],t},h.getCurrentIndex=function(){var e=null;return h.savedStates.length<1?e=0:e=h.savedStates.length-1,e},h.getHash=function(e){var t=h.getLocationHref(e),n;return n=h.getHashByUrl(t),n},h.unescapeHash=function(e){var t=h.normalizeHash(e);return t=decodeURIComponent(t),t},h.normalizeHash=function(e){var t=e.replace(/[^#]*#/,"").replace(/#.*/,"");return t},h.setHash=function(e,t){var n,i;return t!==!1&&h.busy()?(h.pushQueue({scope:h,callback:h.setHash,args:arguments,queue:t}),!1):(h.busy(!0),n=h.extractState(e,!0),n&&!h.emulated.pushState?h.pushState(n.data,n.title,n.url,!1):h.getHash()!==e&&(h.bugs.setHash?(i=h.getPageUrl(),h.pushState(null,null,i+"#"+e,!1)):r.location.hash=e),h)},h.escapeHash=function(t){var n=h.normalizeHash(t);return n=e.encodeURIComponent(n),h.bugs.hashEscape||(n=n.replace(/\%21/g,"!").replace(/\%26/g,"&").replace(/\%3D/g,"=").replace(/\%3F/g,"?")),n},h.getHashByUrl=function(e){var t=String(e).replace(/([^#]*)#?([^#]*)#?(.*)/,"$2");return t=h.unescapeHash(t),t},h.setTitle=function(e){var t=e.title,n;t||(n=h.getStateByIndex(0),n&&n.url===e.url&&(t=n.title||h.options.initialTitle));try{r.getElementsByTagName("title")[0].innerHTML=t.replace("<","&lt;").replace(">","&gt;").replace(" & "," &amp; ")}catch(i){}return r.title=t,h},h.queues=[],h.busy=function(e){typeof e!="undefined"?h.busy.flag=e:typeof h.busy.flag=="undefined"&&(h.busy.flag=!1);if(!h.busy.flag){u(h.busy.timeout);var t=function(){var e,n,r;if(h.busy.flag)return;for(e=h.queues.length-1;e>=0;--e){n=h.queues[e];if(n.length===0)continue;r=n.shift(),h.fireQueueItem(r),h.busy.timeout=o(t,h.options.busyDelay)}};h.busy.timeout=o(t,h.options.busyDelay)}return h.busy.flag},h.busy.flag=!1,h.fireQueueItem=function(e){return e.callback.apply(e.scope||h,e.args||[])},h.pushQueue=function(e){return h.queues[e.queue||0]=h.queues[e.queue||0]||[],h.queues[e.queue||0].push(e),h},h.queue=function(e,t){return typeof e=="function"&&(e={callback:e}),typeof t!="undefined"&&(e.queue=t),h.busy()?h.pushQueue(e):h.fireQueueItem(e),h},h.clearQueue=function(){return h.busy.flag=!1,h.queues=[],h},h.stateChanged=!1,h.doubleChecker=!1,h.doubleCheckComplete=function(){return h.stateChanged=!0,h.doubleCheckClear(),h},h.doubleCheckClear=function(){return h.doubleChecker&&(u(h.doubleChecker),h.doubleChecker=!1),h},h.doubleCheck=function(e){return h.stateChanged=!1,h.doubleCheckClear(),h.bugs.ieDoubleCheck&&(h.doubleChecker=o(function(){return h.doubleCheckClear(),h.stateChanged||e(),!0},h.options.doubleCheckInterval)),h},h.safariStatePoll=function(){var t=h.extractState(h.getLocationHref()),n;if(!h.isLastSavedState(t))return n=t,n||(n=h.createStateObject()),h.Adapter.trigger(e,"popstate"),h;return},h.back=function(e){return e!==!1&&h.busy()?(h.pushQueue({scope:h,callback:h.back,args:arguments,queue:e}),!1):(h.busy(!0),h.doubleCheck(function(){h.back(!1)}),p.go(-1),!0)},h.forward=function(e){return e!==!1&&h.busy()?(h.pushQueue({scope:h,callback:h.forward,args:arguments,queue:e}),!1):(h.busy(!0),h.doubleCheck(function(){h.forward(!1)}),p.go(1),!0)},h.go=function(e,t){var n;if(e>0)for(n=1;n<=e;++n)h.forward(t);else{if(!(e<0))throw new Error("History.go: History.go requires a positive or negative integer passed.");for(n=-1;n>=e;--n)h.back(t)}return h};if(h.emulated.pushState){var v=function(){};h.pushState=h.pushState||v,h.replaceState=h.replaceState||v}else h.onPopState=function(t,n){var r=!1,i=!1,s,o;return h.doubleCheckComplete(),s=h.getHash(),s?(o=h.extractState(s||h.getLocationHref(),!0),o?h.replaceState(o.data,o.title,o.url,!1):(h.Adapter.trigger(e,"anchorchange"),h.busy(!1)),h.expectedStateId=!1,!1):(r=h.Adapter.extractEventData("state",t,n)||!1,r?i=h.getStateById(r):h.expectedStateId?i=h.getStateById(h.expectedStateId):i=h.extractState(h.getLocationHref()),i||(i=h.createStateObject(null,null,h.getLocationHref())),h.expectedStateId=!1,h.isLastSavedState(i)?(h.busy(!1),!1):(h.storeState(i),h.saveState(i),h.setTitle(i),h.Adapter.trigger(e,"statechange"),h.busy(!1),!0))},h.Adapter.bind(e,"popstate",h.onPopState),h.pushState=function(t,n,r,i){if(h.getHashByUrl(r)&&h.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(i!==!1&&h.busy())return h.pushQueue({scope:h,callback:h.pushState,args:arguments,queue:i}),!1;h.busy(!0);var s=h.createStateObject(t,n,r);return h.isLastSavedState(s)?h.busy(!1):(h.storeState(s),h.expectedStateId=s.id,p.pushState(s.id,s.title,s.url),h.Adapter.trigger(e,"popstate")),!0},h.replaceState=function(t,n,r,i){if(h.getHashByUrl(r)&&h.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(i!==!1&&h.busy())return h.pushQueue({scope:h,callback:h.replaceState,args:arguments,queue:i}),!1;h.busy(!0);var s=h.createStateObject(t,n,r);return h.isLastSavedState(s)?h.busy(!1):(h.storeState(s),h.expectedStateId=s.id,p.replaceState(s.id,s.title,s.url),h.Adapter.trigger(e,"popstate")),!0};if(s){try{h.store=l.parse(s.getItem("History.store"))||{}}catch(m){h.store={}}h.normalizeStore()}else h.store={},h.normalizeStore();h.Adapter.bind(e,"unload",h.clearAllIntervals),h.saveState(h.storeState(h.extractState(h.getLocationHref(),!0))),s&&(h.onUnload=function(){var e,t,n;try{e=l.parse(s.getItem("History.store"))||{}}catch(r){e={}}e.idToState=e.idToState||{},e.urlToId=e.urlToId||{},e.stateToId=e.stateToId||{};for(t in h.idToState){if(!h.idToState.hasOwnProperty(t))continue;e.idToState[t]=h.idToState[t]}for(t in h.urlToId){if(!h.urlToId.hasOwnProperty(t))continue;e.urlToId[t]=h.urlToId[t]}for(t in h.stateToId){if(!h.stateToId.hasOwnProperty(t))continue;e.stateToId[t]=h.stateToId[t]}h.store=e,h.normalizeStore(),n=l.stringify(e);try{s.setItem("History.store",n)}catch(i){if(i.code!==DOMException.QUOTA_EXCEEDED_ERR)throw i;s.length&&(s.removeItem("History.store"),s.setItem("History.store",n))}},h.intervalList.push(a(h.onUnload,h.options.storeInterval)),h.Adapter.bind(e,"beforeunload",h.onUnload),h.Adapter.bind(e,"unload",h.onUnload));if(!h.emulated.pushState){h.bugs.safariPoll&&h.intervalList.push(a(h.safariStatePoll,h.options.safariPollInterval));if(i.vendor==="Apple Computer, Inc."||(i.appCodeName||"")==="Mozilla")h.Adapter.bind(e,"hashchange",function(){h.Adapter.trigger(e,"popstate")}),h.getHash()&&h.Adapter.onDomLoad(function(){h.Adapter.trigger(e,"hashchange")})}},(!h.options||!h.options.delayInit)&&h.init()}(window)
},{}],3:[function(require,module,exports){
/*global fileNsPrefixDot*/
angular.module('carddesigner')
    .config(['remoteActionsProvider', function (remoteActionsProvider) {
        'use strict';
        var actions = ['getLayoutsInfo', 'getAllLayouts', 'deleteCardById', 'getLayout', 'getAllActionsInfo', 'getFieldsForObject',    'getAllCardDefinitions',
            'getLayoutByName', 'saveLayout', 'saveCard', 'getCardsByNames', 'getActiveCardsByNames','getCardsByGlobalKeys', 'getTemplatesInfo', 'getActiveTemplateNames',
            'getDataViaDynamicSoql', 'getAllObjects', 'getAllObjectsPaged', 'getAllObjectsCount', 'doGenericInvoke', 'doCheckClassType', 'isInsidePckg', 'getStreamingChannel','getLWCBundles','getLWCByBundleId',
            'createLWCBundle','createLWCResources','updateLWCResources','getAllLWC','deleteComponent','getLwcBundle','getLWCMetaDataByBundleId','getLWCBundleByDevName'];
        var config = actions.reduce(function(config, action) {
            config[action] = {
                action: fileNsPrefixDot() + 'CardCanvasController.' + action,
                config: { escape: false, buffer: false }
            };
            return config;
        }, {});
        remoteActionsProvider.setRemoteActions(config);
    }]);


},{}],4:[function(require,module,exports){
/*
 * Used to work around prompt bug - https://bugs.webkit.org/show_bug.cgi?id=74961
 * No easy way to feature detect unfortunately
 */
var isSafari = function() {
    return /^((?!chrome).)*safari/i.test(navigator.userAgent) && (navigator.userAgent.indexOf('Mac') > 1);
}
angular.module('carddesigner')
.controller('cardController', function($rootScope, $scope, SaveFactory, $timeout, $modal, $localizable, $q, remoteActions, $interpolate, $window, $log, helpNode, LightningWebCompFactory) {
    'use strict';
    var DEFAULT_AUTHOR = 'vlocity';
    var DEFAULT_AUTHOR_SUFFIX = 'Dev';
    var loadPromise = null, workspacePromise = null;
    $scope.selectedLayout = {};
    $scope.dataSourceBlockCollapsed = false;
    $scope.fieldsFromLayoutOrActiveCard = [];
    $scope.tabs = [];
    $scope.tabs.activeTab = 0;

    $rootScope.$on('rootLayoutReady', function(event, layout) {
        loadCards(true);
    });

    //Documentation
    $scope.helpNode = helpNode;

    function loadCards(shouldCollapse) {
        if (!$rootScope.layout) {
            return;
        }
        var cardNames = ($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].Cards || [])
                            .filter(function(cardName) {
                                return cardName !== '' && cardName !== '*';
                            });
        //fetch workspace cards
        var workspaceCardKeys = ($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace || [])
            .filter(function (cardKey) {
                return cardKey !== '';
            });
        
        cardNames = workspaceCardKeys.length > 0 ? [] : cardNames;
        var layout = $rootScope.layout;
        if (cardNames.length === 0 && workspaceCardKeys.length === 0) {
            $rootScope.layoutCards = [];
            $rootScope.doneLoading = true;
        } else {
            if (loadPromise) {
                return;
            }
            loadPromise = remoteActions.getActiveCardsByNames(cardNames)
                .then(function(data) {
                    if (!$rootScope.layoutCards) {
                        $rootScope.layoutCards = [];
                    }
                    // to make sure all cards are getting loaded.
                    if (cardNames.length !== data.length) {
                        var remainingCardsToLoad = _.difference(cardNames, _.map(data, 'Name'));
                        remoteActions.getCardsByNames(remainingCardsToLoad)
                            .then(function(inActiveCards){
                                inActiveCards = _.sortBy(inActiveCards, ['LastModifiedDate']);
                                var mapsOfInActiveCards = _.keyBy(inActiveCards, 'Name');
                                inActiveCards = _.toArray(mapsOfInActiveCards);
                                data = _.concat(data, inActiveCards);
                                loadPromiseHandler(data);
                        });
                    } else {
                        loadPromiseHandler(data);
                    }
                });
        }

        function loadPromiseHandler(data){
            var cards = data;
            var existingCards = $rootScope.layoutCards;
            //Order the cards based on existing order in the layout
            //Backend doesn't return in order
            var mapOfCards = cards.reduce(function(obj, card) {
                obj[card.Name] = card;
                return obj;
            }, {});
            cards = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].Cards.map(function(name) {
                return mapOfCards[name];
            });


            //filter out potential empty elements from non-existent cards
            cards = cards.filter(Boolean);
            cards.forEach(function(card) {
                card.originalJson = JSON.parse(JSON.stringify(card, null, 2));
                card.lockName = true;
                delete card.originalJson.LastModifiedDate;
                var cardDefinition = {states: []};
                if (card[$rootScope.nsPrefix + 'Definition__c']) {
                    try {
                        var defType = typeof card[$rootScope.nsPrefix + 'Definition__c'];
                        cardDefinition = defType === 'string' ? JSON.parse(card[$rootScope.nsPrefix + 'Definition__c']) : card[$rootScope.nsPrefix + 'Definition__c'];
                        //parse until object as safe guard to fix broken card
                        while (angular.isString(cardDefinition)) {
                            cardDefinition = JSON.parse(cardDefinition);
                        }
                    } catch (e) {
                        $log.debug('Loaded a bad Card definition for ' + card.Name, card[$rootScope.nsPrefix + 'Definition__c'], e);
                    }
                }
                card[$rootScope.nsPrefix + 'Definition__c'] = cardDefinition;
                //instantiating the datasource to type = null if non-existent in order to use result parent json path
                card[$rootScope.nsPrefix + 'Definition__c'].dataSource = card[$rootScope.nsPrefix + 'Definition__c'].dataSource || { type: null};

                if (card[$rootScope.nsPrefix + 'Definition__c'] &&
                    card[$rootScope.nsPrefix + 'Definition__c'].filter &&
                    card[$rootScope.nsPrefix + 'Definition__c'].filter.attributes &&
                    card[$rootScope.nsPrefix + 'Definition__c'].filter.attributes.type
                    ) {
                    var currentSObject = card[$rootScope.nsPrefix + 'Definition__c'].filter.attributes.type;
                    $rootScope.loadFieldsFor(currentSObject);
                }

                $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace || [];
                if ($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace && 
                    $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.indexOf(card[$rootScope.nsPrefix + 'GlobalKey__c']) === -1) {
                    $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.push(card[$rootScope.nsPrefix + 'GlobalKey__c']);
                }

                while (typeof card[$rootScope.nsPrefix + 'Datasource__c'] !== 'object' &&
                    typeof card[$rootScope.nsPrefix + 'Datasource__c'] !== 'undefined') {
                    //making sure we parse the json
                    card[$rootScope.nsPrefix + 'Datasource__c'] = JSON.parse(card[$rootScope.nsPrefix + 'Datasource__c']);
                    // also making sure we write it back in same format to avoid CARD-752
                    card.originalJson[$rootScope.nsPrefix + 'Datasource__c'] = angular.toJson(card[$rootScope.nsPrefix + 'Datasource__c']);
                }

            });
            //Set the first card as active
            if (($rootScope.layoutCards.length > 0 || cards.length > 0) && !$scope.activeCard) {
                $scope.activeCard = $rootScope.layoutCards[0] || cards[0];
            }
            cards.forEach(function(card, index) {
                // load all fields for existing card SObjects
                if (existingCards.length > index && card.Id !== existingCards[index].Id) {
                    card.collapse = shouldCollapse;
                    existingCards.splice(index, 1, card);
                } else if ((existingCards.length - 1) < index) {
                    card.collapse = shouldCollapse;
                    card.drag = true;
                    existingCards.push(card);
                } else {
                    return;
                }
            });

            if (workspaceCardKeys.length > 0) {
                if (workspacePromise) {
                    return;
                }
                workspacePromise = remoteActions.getCardsByGlobalKeys(workspaceCardKeys)
                    .then(function (data) {
                        var cards = data;
                        var existingCards = $rootScope.layoutCards;
                        //Order the cards based on existing order in the layout
                        //Backend doesn't return in order
                        var mapOfCardKeys = cards.reduce(function (obj, card) {
                            obj[card[$rootScope.nsPrefix + 'GlobalKey__c']] = card;
                            return obj;
                        }, {});
                        cards = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.map(function (cardKey) {
                            return mapOfCardKeys[cardKey];
                        });


                        //filter out potential empty elements from non-existent cards
                        cards = cards.filter(Boolean);
                        cards.forEach(function (card) {
                            card.originalJson = JSON.parse(JSON.stringify(card, null, 2));
                            card.lockName = true;
                            card.workspaceCard = true;
                            delete card.originalJson.LastModifiedDate;
                            var cardDefinition = { states: [] };
                            if (card[$rootScope.nsPrefix + 'Definition__c']) {
                                try {
                                    var defType = typeof card[$rootScope.nsPrefix + 'Definition__c'];
                                    cardDefinition = defType === 'string' ? JSON.parse(card[$rootScope.nsPrefix + 'Definition__c']) : card[$rootScope.nsPrefix + 'Definition__c'];
                                    //parse until object as safe guard to fix broken card
                                    while (angular.isString(cardDefinition)) {
                                        cardDefinition = JSON.parse(cardDefinition);
                                    }
                                } catch (e) {
                                    $log.debug('Loaded a bad Card definition for ' + card[$rootScope.nsPrefix + 'GlobalKey__c'], card[$rootScope.nsPrefix + 'Definition__c'], e);
                                }
                            }
                            card[$rootScope.nsPrefix + 'Definition__c'] = cardDefinition;
                            //instantiating the datasource to type = null if non-existent in order to use result parent json path
                            card[$rootScope.nsPrefix + 'Definition__c'].dataSource = card[$rootScope.nsPrefix + 'Definition__c'].dataSource || { type: null };

                            if (card[$rootScope.nsPrefix + 'Definition__c'] &&
                                card[$rootScope.nsPrefix + 'Definition__c'].filter &&
                                card[$rootScope.nsPrefix + 'Definition__c'].filter.attributes &&
                                card[$rootScope.nsPrefix + 'Definition__c'].filter.attributes.type
                            ) {
                                var currentSObject = card[$rootScope.nsPrefix + 'Definition__c'].filter.attributes.type;
                                $rootScope.loadFieldsFor(currentSObject);
                            }

                            while (typeof card[$rootScope.nsPrefix + 'Datasource__c'] !== 'object' &&
                                typeof card[$rootScope.nsPrefix + 'Datasource__c'] !== 'undefined') {
                                //making sure we parse the json
                                card[$rootScope.nsPrefix + 'Datasource__c'] = JSON.parse(card[$rootScope.nsPrefix + 'Datasource__c']);
                                // also making sure we write it back in same format to avoid CARD-752
                                card.originalJson[$rootScope.nsPrefix + 'Datasource__c'] = angular.toJson(card[$rootScope.nsPrefix + 'Datasource__c']);
                            }

                        });
                        //Set the first card as active
                        if (($rootScope.layoutCards.length > 0 || cards.length > 0) && !$scope.activeCard) {
                            $scope.activeCard = $rootScope.layoutCards[0] || cards[0];
                        }

                        cards.forEach(function (card, index) {
                            // load all fields for existing card SObjects

                            if (existingCards.length > index && card.Id !== existingCards[index].Id) {
                                card.idName = card.Name.replace(/\s+/g, '-').toLowerCase();
                                card.collapse = shouldCollapse;
                                existingCards.splice(index, 1, card);
                            } else if ((existingCards.length - 1) < index) {
                                card.idName = card.Name.replace(/\s+/g, '-').toLowerCase();
                                card.collapse = shouldCollapse;
                                card.drag = true;
                                existingCards.push(card);
                            } else {
                                return;
                            }
                        });
                        $rootScope.doneLoading = true;
                        workspacePromise = null;

                    });
            } else {
                $rootScope.doneLoading = true;
            }
            loadPromise = null;
        }

        //Adding tabs for add card modal
        $q.all([
            $localizable('CardDesignerBlankCardLabel', 'Choose Exiting'),
            $localizable('CardDesignerChooseExistingLabel', 'Blank Card')
        ]).then(function(labels) {
            //make sure this is only run once
            if($scope.tabs.length === 0) {
                $scope.tabs.push({ title: labels[1], content: '' });
                $scope.tabs.push({ title: labels[0], content: '' });
            }
            
        });
    }

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

    //listening for when a card is saved
    $rootScope.$on('savedCard', function(event, card) {
       //using this way instead of filter so we can change the record directly in the layoutCards array
       //this array is usually fairly small so almost no negative drawback in using this approach
       angular.forEach($rootScope.layoutCards, function(currentCard){
           if (currentCard.Name === card.Name && currentCard[$rootScope.nsPrefix + 'Version__c'] === card[$rootScope.nsPrefix + 'Version__c'] 
               && currentCard[$rootScope.nsPrefix + 'Author__c'] === card[$rootScope.nsPrefix + 'Author__c']){
                currentCard[$rootScope.nsPrefix + 'GlobalKey__c'] = card[$rootScope.nsPrefix + 'GlobalKey__c'];
                //Create cardLWC if not yet created.
                $log.debug("Triggered Card LWC SAVE", currentCard.Name);
                $scope.createLwc(currentCard, "card");
            }
       });
        $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace || [];
        if ($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.indexOf(card[$rootScope.nsPrefix + 'GlobalKey__c']) === -1 && typeof card.$ignoreSave === 'undefined') {
            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.push(card[$rootScope.nsPrefix + 'GlobalKey__c']);
        }
    });

    var saveTimeoutToken = null;
    $scope.$watch(
    function() {
        if (!$rootScope.layoutCards) {
            return [];
        }
        return $rootScope.layoutCards.map(function(card) {
            if ((card.Name === '' || card.Name === '*') && !card.originalJson) {
                return [];
            }
            return without(card, ['saving', 'filters', 'filterArray', 'lockName', 'locked', 'justAdded', 'idName']);
        });
    }, function(newValue, oldValue) {
        var isSameCardsArray = _.isEqual(newValue, oldValue); //use lodash for deep check
        if (saveTimeoutToken) {
            $timeout.cancel(saveTimeoutToken);
        }
        //in order for the cards save to run the layout needs to be inactive and the page has to be done loading
        var allowedToSave = $rootScope.layout &&
            ($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].bypassSave ||
             ($rootScope.doneLoading && ($rootScope.layout && !$rootScope.layout[$rootScope.nsPrefix + 'Active__c'])));
        if(!isSameCardsArray && allowedToSave && !$rootScope.newLayout){
            if($rootScope.lwcCompExist){
                $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].bypassSave = true;
            }
            saveTimeoutToken = $timeout(function() {
                SaveFactory.save($rootScope.layout, $rootScope.layoutCards, false);
            }, 800);
        }
    }, true);

    $scope.setDraggable = function(cardIndex, card){
        //had to set it on timeout as element is not there as this is called
        setTimeout(function(){
            angular.element('#card-'+cardIndex).attr('draggable',card.drag);
        }, 100);

    };

    $scope.openAddCardModal = function(zone){
        var modal, modalScope, title, newCard = {};
        $scope.tabs.activeTab = 0;
        newCard[$rootScope.nsPrefix + 'Author__c'] = $window.orgName.toLowerCase() === DEFAULT_AUTHOR ? DEFAULT_AUTHOR + DEFAULT_AUTHOR_SUFFIX : $window.orgName;
        newCard[$rootScope.nsPrefix + 'Definition__c'] = {states: [], filter: {}, dataSource: { type: null, value: {}}};
        modalScope = $scope.$new();
        modalScope.card = newCard;
        modalScope.zone = zone;
        $scope.cardsToAdd = [];
        angular.forEach($rootScope.cards, function(card){
            delete card.selected;
        });

        modalScope.availableCards = $rootScope.cards.filter(function(card){
            var exists = _.find($rootScope.layoutCards, function(o) { 
                return (o.Name === card.Name && o[$rootScope.nsPrefix + 'Author__c'] === card[$rootScope.nsPrefix + 'Author__c'] && o[$rootScope.nsPrefix + 'Version__c'] === card[$rootScope.nsPrefix + 'Version__c']); 
            });
            return !exists;
        });

        if (zone) {
            angular.forEach($rootScope.layoutCards, function(card){
                delete card.selected;
            });
            modalScope.availableCards = $rootScope.layoutCards.filter(function(card){
                var exists = _.find($rootScope.zoneCardNames, function(o) { 
                    return (o.globalKey === card[$rootScope.nsPrefix + 'GlobalKey__c']); 
                });
                return !exists;
            });
        }

        modalScope.search = {};

        modalScope.selectCard = function(card){
            if (card && card.selected && $scope.cardsToAdd.indexOf(card) == -1) {
                $scope.cardsToAdd.push(card);
            } else if(card && !card.selected){
                $scope.cardsToAdd.splice($scope.cardsToAdd.indexOf(card),1);
            }
        };

        modalScope.selectAllCard = function(select){
            if (zone) {
                angular.forEach(modalScope.availableCards, function(card){
                    card.selected = select;
                });
                $scope.cardsToAdd = select ? modalScope.availableCards : [];
            } else {
                angular.forEach($rootScope.cards, function(card){
                    card.selected = select;
                });
                $scope.cardsToAdd = select ? $rootScope.cards : [];
            }
        };

        modalScope.filterTable = function(item){
            var isFound = true, itemName, itemAuthor;
            if(modalScope.search.searchTerm && item.Name !== '<<Empty Card>>') {
                isFound = false;
                itemName = item.Name ? item.Name : '';
                itemAuthor = item[$rootScope.nsPrefix + 'Author__c'] ? item[$rootScope.nsPrefix + 'Author__c'] : '';
                isFound = _.includes(itemName.toUpperCase(), modalScope.search.searchTerm.toUpperCase()) || _.includes(itemAuthor.toUpperCase(), modalScope.search.searchTerm.toUpperCase());
                return isFound;
            }
            return isFound;
        }

        modalScope.addCard = function(hideModal){
            if(zone){
                angular.forEach($scope.cardsToAdd, function(newCard){
                    $scope.addToZone(zone, newCard);
                });
                hideModal();
                return;
            }

            if ($scope.tabs.activeTab === 0) {
                angular.forEach($scope.cardsToAdd, function(newCard){
                    while (typeof newCard[$rootScope.nsPrefix + 'Definition__c'] === 'string') {
                        newCard[$rootScope.nsPrefix + 'Definition__c'] = JSON.parse(newCard[$rootScope.nsPrefix + 'Definition__c']);
                    }
                    newCard.lockName = true;
                    //if its active
                    if (newCard[$rootScope.nsPrefix + 'Active__c']) {
                        $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].Cards.push(newCard.Name);
                    } else {
                        newCard.workspaceCard = true;
                    }

                    $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace || [];
                    $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.push(newCard[$rootScope.nsPrefix + 'GlobalKey__c']);

                    newCard[$rootScope.nsPrefix + 'Definition__c'] = newCard[$rootScope.nsPrefix + 'Definition__c'] || { states: [], filter: {}, dataSource: { type: null, value: {} } };
                    newCard[$rootScope.nsPrefix + 'Definition__c'].dataSource = newCard[$rootScope.nsPrefix + 'Definition__c'].dataSource || { type: null };
                    newCard[$rootScope.nsPrefix + 'Definition__c'].enableLwc = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc
                    $rootScope.layoutCards.push(newCard);
                    $rootScope.layoutCards[$rootScope.layoutCards.length - 1].drag = false;
                    $scope.activeCard = newCard;
                    $scope.selectedCard = $rootScope.cards[0];
                });
                hideModal();
            } else if ($scope.tabs.activeTab === 1) {
                modalScope.card.errors = [];
                if (!newCard.Name) {
                    $localizable('CardDesignerMustSetName', 'Please provide a name').then(function(label){
                        modalScope.card.errors = modalScope.card.errors ? modalScope.card.errors : [];
                        modalScope.card.errors.push({message : label});
                    });
                } else if(!newCard[$rootScope.nsPrefix + 'Author__c']) {
                    $localizable('CardDesignerMustSetAuthor', 'Please provide a Card author').then(function(label){
                        modalScope.card.errors = modalScope.card.errors ? modalScope.card.errors : [];
                        modalScope.card.errors.push({message : label});
                    });
                } else {
                    remoteActions.getCardsByNames([newCard.Name]).then(function (existingCards) {
                        var isCardAvailable = true;
                        angular.forEach(existingCards, function (existingCard) {
                            //only check cards that match the same author
                            if (existingCard[$rootScope.nsPrefix + 'Author__c'] === newCard[$rootScope.nsPrefix + 'Author__c']) {
                                if (isCardAvailable) {
                                    $localizable('CardExistsError', 'Card with same name and author already exists, try creating version.').then(function(label){
                                        modalScope.card.errors = modalScope.card.errors ? modalScope.card.errors : [];
                                        modalScope.card.errors.push({message : label});
                                    });
                                }
                                isCardAvailable = false;
                            }
                        });
                        if($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc && $rootScope.lightningwebcomponents.find(function (component) {
                            return component.DeveloperName.toLowerCase() === (LightningWebCompFactory.convertNameToValidLWCCase(LightningWebCompFactory.DEFAULT_LWC_PREFIX+newCard.Name+"_1_"+newCard[$rootScope.nsPrefix + 'Author__c'])).toLowerCase();
                        })){
                            if (isCardAvailable) {
                                $localizable('CardLWCComponentExistsError', 'Lightning Web Component with same name exists.').then(function(label){
                                    modalScope.card.errors = modalScope.card.errors ? modalScope.card.errors : [];
                                    modalScope.card.errors.push({message : label});
                                });
                            }
                            isCardAvailable = false;
                        }
                        if (isCardAvailable) {
                            //DEFAULT VALUE FROM ADD STATE
                            let state = {
                                'fields': [],
                                'conditions': {
                                    'group' : [{'field': '$scope.data.status', 'operator': '===', 'value': '\'active\'', 'type': 'system'}]
                                },
                                'definedActions': {
                                    'actions': []
                                },
                                'name' : 'Active'
                            };
                            if($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc) {
                                let stateLwc = _.find($rootScope.lightningwebcomponents, { DeveloperName : "cardActiveState" });
                                state.lwc = stateLwc ? stateLwc : $rootScope.lightningwebcomponents[0];
                            } else {
                                state.templateUrl = "card-active";
                            }
                            modalScope.card.errors = [];
                            let definition = newCard[$rootScope.nsPrefix + 'Definition__c'] || {states: [state], filter: {}, dataSource: { type: null, value: {}}};
                            if(!definition.states || (definition.states && definition.states.length === 0)) {
                                definition.states = [state];
                            }
                            definition.enableLwc = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc;
                            //instantiating the datasource to type = null if non-existent in order to use result parent json path
                            newCard[$rootScope.nsPrefix + 'Definition__c'] = definition;
                            newCard[$rootScope.nsPrefix + 'Definition__c'].dataSource = newCard[$rootScope.nsPrefix + 'Definition__c'].dataSource || { type: null};
                            newCard[$rootScope.nsPrefix + 'Version__c'] = newCard[$rootScope.nsPrefix + 'Version__c'] || 1;
                            $rootScope.layoutCards.push(newCard);
                            $rootScope.layoutCards[$rootScope.layoutCards.length - 1].drag = false;
                            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].Cards.push(newCard.Name);
                            $scope.activeCard = newCard;
                            $scope.selectedCard = $rootScope.cards[0];
                            hideModal();
                        }
                    });
                }
            }
        }

        modal = $modal({
                templateUrl: 'CardAddModal.tpl.html',
                show: false,
                html:true,
                contentTemplate: false,
                scope: modalScope,
        });
        modal.$promise.then(modal.show);
    }

    $scope.toggleJsonEditor = function(card) {
        var modal = $modal({title: 'Edit Card JSON',
                            content: angular.toJson(card[$rootScope.nsPrefix + 'Definition__c'], true),
                            templateUrl: 'EditJsonModal.tpl.html',
                            show: false, html: true,
                            controller: function($scope) {
                                $scope.jsonAsText = $scope.content.$$unwrapTrustedValue();
                                $scope.onJsonChange = function(jsonAsText) {
                                    $scope.jsonAsText = jsonAsText;
                                    try {
                                        JSON.parse(jsonAsText);
                                        $scope.isInvalid = false;
                                    } catch (e) {
                                        $scope.isInvalid = true;
                                    }
                                };
                                $scope.save = function() {
                                    card[$rootScope.nsPrefix + 'Definition__c'] = JSON.parse($scope.jsonAsText);
                                    //reset active card in states controller
                                    $rootScope.$broadcast('activeCardSet', card);
                                };
                            }});
        modal.$promise.then(modal.show)
            .then(function(done) {
                $log.debug(done);
            });

    };

    $scope.onCardClick = function(card) {
        $scope.activeCard = card;
        // reset filter field data when switching between cards
        $scope.fieldsFromLayoutOrActiveCard = [];
        $scope.reloadFilter();
    };

    $scope.onDNDMove = function() {
        return true;
    };

    $scope.onDNDDrop = function(event, index, item) {
        if (angular.isString(item)) {
            return $rootScope.layoutCards.find(function(card) {
                return card.Id === item.Id;
            });
        }
    };

    $scope.dropCardCallback = function(event, droppedAtindex, item, external, type, allowedType) {
        $log.debug('dropped at: ', event, droppedAtindex, item, external, type, allowedType);
        var cards = $rootScope.layoutCards;
        var itemOriginalIndex;

        if($rootScope.layout[$rootScope.nsPrefix + "Definition__c"] && $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].workspace)
        {
            itemOriginalIndex = $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].workspace.indexOf(item[$rootScope.nsPrefix + 'GlobalKey__c']);
            $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].workspace.splice(itemOriginalIndex, 1);
            $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].workspace.splice(droppedAtindex, 0, item[$rootScope.nsPrefix + 'GlobalKey__c']);
        }

        for (var i=0; i<=cards.length; i++) {
            if (item.Id === cards[i].Id) {
                itemOriginalIndex = i;
                break;
            }
        }

        // the root cause of the dnd-list drag and drop incurrate move problem was due to the item
        // being moved was still in the array of items.  Therefore, the solution is to detect the
        // moved item's original index and splice it off the array of items
        $rootScope.layoutCards.splice(itemOriginalIndex,1);

        return item;
    };

    $scope.$watch('activeCard', function(newActiveCard) {
        $rootScope.$broadcast('activeCardSet', newActiveCard);
    });
    

    $scope.changeCardName = function(card) {
        if (!card) {
            return;
        }
        var newName = prompt('Please enter a new name', '');
        if ((newName === '' || newName === '*') && !isSafari()) {
            alert('Please enter a Name');
            $scope.loading = false;
            $scope.changeCardName(card);
        } else if (newName !== null && !((newName === '' || newName === '*') && isSafari())) {
            if ($rootScope.cards.find(function(existingCard) {
                return existingCard.Name === card.Name && existingCard.Id !== card.Id;
            })) {
                alert('This name "' + newName + '" is already in use. Please choose a different name.');
                $scope.changeCardName(card);
                return;
            } else {
                card.Name = newName;
                $timeout(function() {
                    $scope.updateCardNameToLayoutAssignment();
                }, 2000);
                $rootScope.mapOfCardsToLayouts[card.Name] = [$scope.layout.Name + ' (Version ' + $scope.layout[$rootScope.nsPrefix + 'Version__c'] + ')'];
            }
        }
    };

    $scope.lockCardName = function(card) {
        card.lockName = true;
        $timeout(function() {
            $scope.updateCardNameToLayoutAssignment();
        }, 2000);
        $rootScope.mapOfCardsToLayouts[card.Name] = [$scope.layout.Name + ' (Version ' + $scope.layout[$rootScope.nsPrefix + 'Version__c'] + ')'];
    };

    $scope.isLockedCard = function(card) {
        if(card && typeof card.locked === 'undefined') {
            card.locked = $rootScope.insidePckg && card[$rootScope.nsPrefix + 'Author__c'] && card[$rootScope.nsPrefix + 'Author__c'].toUpperCase() === 'VLOCITY';
        }

        return card ? card.locked : false;
    };

    $scope.delete = function (cardToDelete) {
        var modalScope = $scope.$new();
        let cards;
        modalScope.objType = 'card';
        modalScope.isLwc = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc;
        modalScope.cardHasId = cardToDelete.Id;
        modalScope.isCardActive = cardToDelete[$rootScope.nsPrefix + 'Active__c'];
        modalScope.isOnlyInThisLayout = modalScope.cardHasId && $rootScope.mapOfCardsToLayouts[cardToDelete.Name] ? $rootScope.mapOfCardsToLayouts[cardToDelete.Name].length <= 1 : true;
        modalScope.lockedCard = $scope.isLockedCard(cardToDelete);
        let labelsArr = [
            $localizable('ConfirmDeletionTitle', 'Confirm deletion'),
            $localizable('ConfirmCardDeleteContent', 'Are you sure you want to remove the card: \'{1}\'?', cardToDelete.Name)
        ];
        if (modalScope.isLwc && !modalScope.isOnlyInThisLayout) {
            cards = $rootScope.mapOfCardsToLayouts[cardToDelete.Name].join(', ');
            labelsArr.push($localizable('PreventLwcCardDeleteContent', 'This card is used in the following layouts: \'{1}\' .Hence you cannot delete the card', cards));
        }
        $q.all(labelsArr).then(function (labels) {
            if (modalScope.isLwc && cards)
                modalScope.lwcCardDeleteInfo = labels[2] ? labels[2] : 'Note: This card is also used in the following layouts: ' + cards + ' .Hence you cannot delete the card';
            $modal({
                title: labels[0],
                templateUrl: 'CardConfirmationModal.tpl.html',
                content: labels[1],
                scope: modalScope,
                show: true
            });
        });



        modalScope.ok = function (permDelete) {
            var workspaceIndex = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.indexOf(cardToDelete[$rootScope.nsPrefix + 'GlobalKey__c']);
            if (workspaceIndex > -1) {
                $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.splice(workspaceIndex, 1);
            }
            if (cardToDelete.Id && permDelete) {
                let lwcName = LightningWebCompFactory.convertNameToValidLWCCase(LightningWebCompFactory.DEFAULT_LWC_PREFIX + cardToDelete.Name + "_" + cardToDelete[$rootScope.nsPrefix + 'Version__c'] + "_" + cardToDelete[$rootScope.nsPrefix + 'Author__c']);
                let lwc = _.find($rootScope.lightningwebcomponents, { DeveloperName: lwcName });
                if (lwc) {
                    let lwcActiveName = LightningWebCompFactory.convertNameToValidLWCCase(LightningWebCompFactory.DEFAULT_LWC_PREFIX + cardToDelete.Name);
                    let matchingLWC = _.filter($rootScope.lightningwebcomponents, function (lwc) {
                        return _.includes(lwc.DeveloperName, lwcActiveName + "_");
                    });
                    if (matchingLWC.length <= 1) {
                        let lwcActive = _.find($rootScope.lightningwebcomponents, { DeveloperName: lwcActiveName });
                        if (lwcActive) {
                            $rootScope.lwcToBeDeleted.push({ Id: lwcActive.Id});
                        }
                        $rootScope.lwcToBeDeleted.push({ Id: lwc.Id, Name: cardToDelete.Name, Version: cardToDelete[$rootScope.nsPrefix + 'Version__c'] });
                    } else {
                        $rootScope.lwcToBeDeleted.push({ Id: lwc.Id, Name: cardToDelete.Name, Version: cardToDelete[$rootScope.nsPrefix + 'Version__c'] });
                    }
                }
                remoteActions.deleteCardById(cardToDelete.Id).then(function () {

                    // delete loaded fields from card data source using the card Id
                    delete $rootScope.fieldsFromCards[cardToDelete.Id];

                    // deleted card may have been a brand new card that does not have Id yet
                    delete $rootScope.fieldsFromCards['newCardWithHashKey-' + cardToDelete.$$hashKey];

                    if (cardToDelete.workspaceCard) {
                        $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace =
                            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.filter(function (card) {
                                return card[$rootScope.nsPrefix + 'GlobalKey__c'] !== cardToDelete[$rootScope.nsPrefix + 'GlobalKey__c'];
                            });
                    }

                    $rootScope.layoutCards = $rootScope.layoutCards.filter(function (card) {
                        return card.Id !== cardToDelete.Id;
                    });

                    //If the card is hard deleted, remove it from card selection dropdown
                    $rootScope.cards = $rootScope.cards.filter(function (card) {
                        return card.Id !== cardToDelete.Id;
                    });

                    //Reset the activeCard so that states are cleared
                    $scope.activeCard = null;
                });

            } else if (cardToDelete.Id && !permDelete) {

                // delete loaded fields from card data source using the card Id
                delete $rootScope.fieldsFromCards[cardToDelete.Id];

                // deleted card may have been a brand new card that does not have Id yet
                delete $rootScope.fieldsFromCards['newCardWithHashKey-' + cardToDelete.$$hashKey];

                $rootScope.layoutCards = $rootScope.layoutCards.filter(function (card) {
                    return card !== cardToDelete;
                });

                if (cardToDelete.workspaceCard) {
                    $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace =
                        $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.filter(function (card) {
                            return card[$rootScope.nsPrefix + 'GlobalKey__c'] !== cardToDelete[$rootScope.nsPrefix + 'GlobalKey__c'];
                        });
                }

            } else if (!cardToDelete.Id) {

                // delete loaded fields from card data source using the angular object hash for brand new card that does not have Id yet
                delete $rootScope.fieldsFromCards['newCardWithHashKey-' + cardToDelete.$$hashKey];

                $rootScope.layoutCards = $rootScope.layoutCards.filter(function (card) {
                    return card !== cardToDelete;
                });

                if (cardToDelete.workspaceCard) {
                    $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace =
                        $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.filter(function (card) {
                            return card[$rootScope.nsPrefix + 'GlobalKey__c'] !== cardToDelete[$rootScope.nsPrefix + 'GlobalKey__c'];
                        });
                }

            }

            //Reset the activeCard so that states are cleared
            $scope.activeCard = null;

            // reset filter field data when existing card removed
            $scope.fieldsFromLayoutOrActiveCard = [];
            if ($rootScope.layoutCards.length > 0) {
                $scope.activeCard = $rootScope.layoutCards[0];
            }

        };
    };

    $scope.toggleCardActivation = function(card) {
        //add/remove from layout
        var index = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].Cards.indexOf(card.Name);
        var cardsToUpdate = [];

        //toggle card name from card fetch
        if (index > -1) {
            card.workspaceCard = true;
            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].Cards.splice(index, 1);
            if($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.indexOf(card[$rootScope.nsPrefix + 'GlobalKey__c']) === -1) {
                $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.push(card[$rootScope.nsPrefix + 'GlobalKey__c']);
            }
            
        } else {
            if (card[$rootScope.nsPrefix + 'Active__c']) {
                delete card.workspaceCard;
                $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].Cards.push(card.Name);
            }
        }

        //go through local cards first
        angular.forEach($rootScope.layoutCards, function(localCard) {
            if (localCard.Name == card.Name && localCard[$rootScope.nsPrefix + 'GlobalKey__c'] !== card[$rootScope.nsPrefix + 'GlobalKey__c']) {
                localCard[$rootScope.nsPrefix + 'Active__c'] = false;
            }
        });


        //toggle activation of other cards that are not in the runtime layout
        remoteActions.getCardsByNames([card.Name])
            .then(function (existingCards) { 
                console.log('existingCards ',existingCards);
                angular.forEach(existingCards, function (existingCard) {
                    //only check cards that match the same author
                    //fix global key
                    if (existingCard[$rootScope.nsPrefix + 'GlobalKey__c'] !== card[$rootScope.nsPrefix + 'GlobalKey__c']) {
                        existingCard[$rootScope.nsPrefix + 'Active__c'] = false;
                        if($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace.indexOf(existingCard[$rootScope.nsPrefix + 'GlobalKey__c']) === -1) {
                            existingCard.$ignoreSave = true;
                        }
                        cardsToUpdate.push(existingCard);
                    }
                });

                SaveFactory.save($rootScope.layout, cardsToUpdate, false).then(function (layout) {
                    if (layout.errors) {
                        //$rootScope.layoutCards.pop();
                        //modalScope.card.errors = modalScope.card.errors;
                        //modalScope.layoutSaving = false;
                    } else {
                        // Replaces the Page URL param "id" to new layout id.
                        // Refreshing the page will load new layout
                        //$scope.activeCard = newCard;
                        // $rootScope.layout = layout;
                        // delete $rootScope.parentLayout;
                        //hideModal();
                    }
                }, function (err) {
                    $log.debug('bad new card version ', err);
                    //modalScope.layoutSaving = false;
                });
        });

        if (!card[$rootScope.nsPrefix + 'Active__c']) {
            $scope.createLwc(card, "card", true);
        } else {
            LightningWebCompFactory.isDeploymentPending = true;
        }

    };

    $scope.newVersion =  function(card) {
        
        var newCard = angular.copy(card);
        $scope.disableVersionBtn = true;
        delete newCard.lockName;
        delete newCard.Id;
        delete newCard[$rootScope.nsPrefix + 'GlobalKey__c'];
        delete newCard.locked;
        //delete newCard.originalJson;
        var latestVersionNum = 1;
        remoteActions.getCardsByNames([card.Name])
            .then(function (existingCards) {
                angular.forEach(existingCards, function (existingCard) {
                    //only check cards that match the same author
                    if (existingCard[$rootScope.nsPrefix + 'Author__c'] === card[$rootScope.nsPrefix + 'Author__c']) {
                        latestVersionNum = typeof existingCard[$rootScope.nsPrefix + 'Version__c'] === 'undefined' ? 0 : latestVersionNum;
                        latestVersionNum = existingCard[$rootScope.nsPrefix + 'Version__c'] > latestVersionNum ? existingCard[$rootScope.nsPrefix + 'Version__c'] : latestVersionNum;
                    }
                });

                newCard[$rootScope.nsPrefix + 'Version__c'] = latestVersionNum + 1;
                newCard[$rootScope.nsPrefix + 'Active__c'] = false;

                //load to workspace
                $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].workspace || [];
                
                $rootScope.layoutCards.push(newCard);

                SaveFactory.save($rootScope.layout, $rootScope.layoutCards, false).then(function (layout) {
                    if (layout.errors) {
                        $rootScope.layoutCards.pop();
                        //modalScope.card.errors = modalScope.card.errors;
                        //modalScope.layoutSaving = false;
                    } else {
                        // Replaces the Page URL param "id" to new layout id.
                        // Refreshing the page will load new layout
                        $scope.activeCard = newCard;
                        $scope.disableVersionBtn = false;
                        // $rootScope.layout = layout;
                        // delete $rootScope.parentLayout;
                        //hideModal();
                    }
                }, function (err) {
                    $log.debug('bad new card version ', err);
                    $scope.disableVersionBtn = false;
                    //modalScope.layoutSaving = false;
                });
            });
    };

    $scope.showCloneModal = function(card) {
        var modal, modalScope, title, searchObj;

        title = 'Clone Card';

        modalScope = $scope.$new();
        modalScope.card = angular.copy(card);
        modalScope.card.Name = '';
        modalScope.card[$rootScope.nsPrefix + 'Author__c'] = $window.orgName.toLowerCase() === DEFAULT_AUTHOR ? DEFAULT_AUTHOR + DEFAULT_AUTHOR_SUFFIX : $window.orgName;

        modalScope.saveCard = function(hideModal){
            modalScope.card.errors = [];
            if (!modalScope.card.Name) {
                $localizable('CardDesignerMustSetName', 'Please provide a name').then(function(label){
                    modalScope.card.errors = modalScope.card.errors ? modalScope.card.errors : [];
                    modalScope.card.errors.push({message : label});
                });
            } else if(!modalScope.card[$rootScope.nsPrefix + 'Author__c']) {
                $localizable('CardDesignerMustSetAuthor', 'Please provide a Card author').then(function(label){
                    modalScope.card.errors = modalScope.card.errors ? modalScope.card.errors : [];
                    modalScope.card.errors.push({message : label});
                });
            } else {
                modalScope.layoutSaving = true;
                modalScope.card[$rootScope.nsPrefix + 'ParentID__c'] = card[$rootScope.nsPrefix + 'GlobalKey__c'];
                modalScope.card[$rootScope.nsPrefix + 'Active__c'] = false; //no cloned cards become active
                modalScope.card[$rootScope.nsPrefix + 'Version__c'] = 1;
                delete modalScope.card.lockName;
                delete modalScope.card.Id;
                delete modalScope.card[$rootScope.nsPrefix + 'GlobalKey__c'];
                delete modalScope.card.locked;
                delete modalScope.card.originalJson;

                if(modalScope.card[$rootScope.nsPrefix + 'Author__c'].toLowerCase() === DEFAULT_AUTHOR && $rootScope.insidePckg) {
                    modalScope.card[$rootScope.nsPrefix + 'Author__c'] = $window.orgName.toLowerCase() === DEFAULT_AUTHOR ? DEFAULT_AUTHOR + DEFAULT_AUTHOR_SUFFIX : $window.orgName;
                }
                searchObj = {};
                searchObj['Name'] = modalScope.card.Name;
                searchObj[$rootScope.nsPrefix + 'Author__c'] = modalScope.card[$rootScope.nsPrefix + 'Author__c'];
                if(_.findIndex($rootScope.cards, searchObj) !== -1) {
                    $localizable('CardExistsError', 'Card with same name and author already exists, try creating version.').then(function(label){
                        modalScope.card.errors = modalScope.card.errors ? modalScope.card.errors : [];
                        modalScope.card.errors.push({message : label});
                    });
                    modalScope.layoutSaving = false;
                    return;
                }

                if($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc && $rootScope.lightningwebcomponents.find(function (component) {
                    return component.DeveloperName.toLowerCase() === LightningWebCompFactory.convertNameToValidLWCCase(LightningWebCompFactory.DEFAULT_LWC_PREFIX+modalScope.card.Name+"_"+modalScope.card[$rootScope.nsPrefix + 'Version__c']+"_"+modalScope.card[$rootScope.nsPrefix + 'Author__c']).toLowerCase();
                })){
                    $localizable('CardLWCComponentExistsError', 'Lightning Web Component with same name exists.').then(function(label){
                        modalScope.card.errors = modalScope.card.errors ? modalScope.card.errors : [];
                        modalScope.card.errors.push({message : label});
                    });
                    modalScope.layoutSaving = false;
                    return;
                }

                $rootScope.layoutCards.push(modalScope.card);
                SaveFactory.save($rootScope.layout, $rootScope.layoutCards, false).then(function(layout) {
                    if(layout.errors){
                        $rootScope.layoutCards.pop();
                        modalScope.card.errors = modalScope.card.errors;
                        modalScope.layoutSaving = false;
                    } else {
                        // Replaces the Page URL param "id" to new layout id.
                        // Refreshing the page will load new layout
                        $scope.activeCard = modalScope.card;
                       // $rootScope.layout = layout;
                       // delete $rootScope.parentLayout;
                        hideModal();
                    }
                }, function(err){
                    $log.debug('bad clone ',err);
                    modalScope.layoutSaving = false;
                });
            }
        };
        modal = $modal({
                    title: title,
                    templateUrl: 'CardCloneModal.tpl.html',
                    show: false,
                    html:true,
                    contentTemplate: false,
                    scope: modalScope,
        });

        modal.$promise.then(modal.show);
    };

    $scope.clone = function(card) {
        if(!card[$rootScope.nsPrefix + 'GlobalKey__c']) {
                card.errors = [{
                    message: 'Please save Card before cloning. Refresh the page if you encounter any issues'
                }];
                return;
        }

        var cloneCard = angular.copy(card);
        cloneCard.Name = '*';
        cloneCard[$rootScope.nsPrefix + 'ParentID__c'] = card[$rootScope.nsPrefix + 'GlobalKey__c'];
        delete cloneCard.lockName;
        delete cloneCard.Id;
        delete cloneCard[$rootScope.nsPrefix + 'GlobalKey__c'];
        delete cloneCard.locked;
        delete cloneCard.originalJson;
        if(cloneCard[$rootScope.nsPrefix + 'Author__c'].toLowerCase() === DEFAULT_AUTHOR && $rootScope.insidePckg) {
            cloneCard[$rootScope.nsPrefix + 'Author__c'] = $window.orgName.toLowerCase() === DEFAULT_AUTHOR ? DEFAULT_AUTHOR + DEFAULT_AUTHOR_SUFFIX : $window.orgName;
        }
        $rootScope.layoutCards.push(cloneCard);
        $scope.activeCard = cloneCard;
    };

    $scope.getParent = function(card, fieldToReturn) {
        //getting the card name and author name from the Parent ID field
        //example: test/Vlocity/1234 => Card Name : test Author: Vlocity timestamp: 1234
        if(!card[$rootScope.nsPrefix + 'ParentID__c']) {
            return;
        }

        var firstSepator = card[$rootScope.nsPrefix + 'ParentID__c'].indexOf('/'),
            lastSepator = card[$rootScope.nsPrefix + 'ParentID__c'].lastIndexOf('/');

        switch(fieldToReturn.toUpperCase()) {
            case 'NAME':
                return card[$rootScope.nsPrefix + 'ParentID__c'].substring(0, firstSepator);
                break;
            case 'AUTHOR':
                return card[$rootScope.nsPrefix + 'ParentID__c'].substring(firstSepator + 1, lastSepator);
                break;
            case 'TIMESTAMP':
                return card[$rootScope.nsPrefix + 'ParentID__c'].substring(lastSepator, card[$rootScope.nsPrefix + 'ParentID__c'].length -1);
                break;
            default:
                return;
        }
    };

    $scope.addToZone = function(zone, card) {
        $rootScope.zoneCardNames.push({globalKey: card[$rootScope.nsPrefix + 'GlobalKey__c']});
        zone.zoneCards = zone.zoneCards ? zone.zoneCards : [];
        var zoneCard = {};
        zoneCard.Name = card.Name;
        zoneCard.Author = card[$rootScope.nsPrefix + 'Author__c'] ? card[$rootScope.nsPrefix + 'Author__c'] : $window.orgName.toLowerCase() === DEFAULT_AUTHOR ? DEFAULT_AUTHOR + DEFAULT_AUTHOR_SUFFIX : $window.orgName;
        zoneCard.Version = card[$rootScope.nsPrefix + 'Version__c'] ? card[$rootScope.nsPrefix + 'Version__c'] : 'Legacy';
        zoneCard.globalKey = card[$rootScope.nsPrefix + 'GlobalKey__c'];
        if(_.findIndex(zone.zoneCards, zoneCard) === -1) {
            zone.zoneCards.push(zoneCard);
        }
    };

    $scope.addLayout = function(layouts, layoutName) {
        layouts.push({ name : layoutName, id : layoutName });
        $scope.selectedLayout.name = '';
    };

    $scope.deleteLayout = function(layouts, index) {
        layouts.splice(index,1);
    };

    $scope.dropZoneLayoutCallback = function(event, droppedAtindex, item, external, type, allowedType, parentLayouts) {
        console.log('dropped at: ', event, droppedAtindex, item, external, type, allowedType, parentLayouts);

        var itemOriginalIndex = _.findIndex(parentLayouts,{name: item.name} );
        // the root cause of the dnd-list drag and drop incurrate move problem was due to the item
        // being moved was still in the array of items.  Therefore, the solution is to detect the
        // moved item's original index and splice it off the array of items
        if(itemOriginalIndex !== -1) {
            parentLayouts.splice(itemOriginalIndex,1);
        }

        return item;
    };

    $scope.removeFromZone = function (zone, card) { 
        var index = _.findIndex(zone.zoneCards, card);
        _.remove($rootScope.zoneCardNames, {globalKey : card.globalKey});
        zone.zoneCards.splice(index, 1);
    };

    function KeyValuePair(key, value, card) {
        this.key = this.previousKey = key;
        this.value = value;
        this.card = card;
    }

    KeyValuePair.prototype.update = function() {
        if (this.key !== this.previousKey) {
            delete this.card[$rootScope.nsPrefix + 'Definition__c'].filter[this.previousKey];
            delete cacheOfCardKeyProps[this.card.Id][this.previousKey];
            this.previousKey = this.key;
        }

        this.card[$rootScope.nsPrefix + 'Definition__c'].filter[this.key] = this.value;
        cacheOfCardKeyProps[this.card.Id][this.key] = this;
    };

    var cacheOfCardKeyProps = {};

    $scope.propertySet = function(card) {
        if (!cacheOfCardKeyProps[card.Id]) {
            cacheOfCardKeyProps[card.Id] = {};
        }
        if (card[$rootScope.nsPrefix + 'Definition__c'] &&
            card[$rootScope.nsPrefix + 'Definition__c'].filter) {
            return Object.keys(card[$rootScope.nsPrefix + 'Definition__c'].filter).filter(function(key) {
                return key !== 'attributes';
            }).map(function(key) {
                if (!cacheOfCardKeyProps[card.Id][key]) {
                    cacheOfCardKeyProps[card.Id][key] = new KeyValuePair(key, card[$rootScope.nsPrefix + 'Definition__c'].filter[key], card);
                }
                return cacheOfCardKeyProps[card.Id][key];
            });
        }
        return [];
    };

    $scope.removeFilterProperty = function(card, propName) {
        if (card[$rootScope.nsPrefix + 'Definition__c'] &&
            card[$rootScope.nsPrefix + 'Definition__c'].filter) {
            delete card[$rootScope.nsPrefix + 'Definition__c'].filter[propName];
            delete cacheOfCardKeyProps[card.Id][propName];
        }
    };

    $scope.addFilter = function(card) {
        cacheOfCardKeyProps[card.Id][''] = new KeyValuePair('', '', card);
        cacheOfCardKeyProps[card.Id][''].update();
    };

    $scope.addSessionVars = function(card) {
        card[$rootScope.nsPrefix+'Definition__c']['sessionVars'] = card[$rootScope.nsPrefix+'Definition__c']['sessionVars'] || [];
        card[$rootScope.nsPrefix+'Definition__c']['sessionVars'].push({'name': '', 'val': ''});
    };

    $scope.removeSessionVar = function(index, card) {
        $log.debug('removing session variables');
        card[$rootScope.nsPrefix+'Definition__c']['sessionVars'].splice(index,1);
        //evaluate here for testing purposes
    };

    $scope.addMetatags = function(card) {
        card[$rootScope.nsPrefix+'Definition__c']['metatagVars'] = card[$rootScope.nsPrefix+'Definition__c']['metatagVars'] || [];
        card[$rootScope.nsPrefix+'Definition__c']['metatagVars'].push({'name': '', 'val': ''});
    };

    $scope.removeMetatag = function(index, card) {
        $log.debug('removing metatags');
        card[$rootScope.nsPrefix+'Definition__c']['metatagVars'].splice(index,1);
    };

    $scope.updateMetatag = function(name, card) {
        var metaObj = {'name' : name};
        var index = _.findIndex(card[$rootScope.nsPrefix+'Definition__c']['metatagVars'], metaObj);
        var lastIndex = _.findLastIndex(card[$rootScope.nsPrefix+'Definition__c']['metatagVars'], metaObj);
        if(index !== -1 && index !== lastIndex){
            card[$rootScope.nsPrefix+'Definition__c']['metatagVars'].splice(index,1);            
        }
    };

    $scope.addDataSource = function(card) {
        if (!card[$rootScope.nsPrefix + 'Definition__c'].dataSource) {
            card[$rootScope.nsPrefix + 'Definition__c'].dataSource = {};
        }
    };

    $scope.removeDataSource = function(card) {
        delete card[$rootScope.nsPrefix + 'Definition__c'].dataSource;
    };

    //TBD: make a common function
    $scope.dataSourceExists = function(dataSourceObj) {
        var dataSourceExists = false;

        if (!(dataSourceObj && dataSourceObj.type && dataSourceObj.value)) {
            return dataSourceExists;
        }

        switch (dataSourceObj.type) {
            case 'Query':
                dataSourceExists = !!dataSourceObj.value.query;
                break;
            case 'DataRaptor':
                dataSourceExists = !!dataSourceObj.value.bundle;
                break;
            case 'ApexRemote':
                dataSourceExists = !!dataSourceObj.value.remoteClass;
                break;
            case 'ApexRest':
                dataSourceExists = !!dataSourceObj.value.endpoint;
                break;
            case 'Rest':
                dataSourceExists = !!dataSourceObj.value.endpoint;
                break;
            case 'Custom':
                dataSourceExists = !!dataSourceObj.value.body;
                break;
            case 'StreamingAPI':
                dataSourceExists = !!dataSourceObj.value.channel;
                break;
            default:
                $log.debug('Data Source Type did not match');
                break;
        }
        return dataSourceExists;
    };

    $rootScope.$on('FetchedCardsData', function() {
        $scope.reloadFilter();
    });

    $rootScope.$on('FetchedLayoutData', function() {
        $scope.reloadFilter();
    });

    // reloadFilter is always called with an $scope.activeCard
    $scope.reloadFilter = function() {
        if(!$scope.activeCard) {
            return;
        }
        var uniqueCardKeyUsingId = $scope.activeCard.Id;
        var uniqueCardKeyUsingAngularHashKey = 'newCardWithHashKey-' + $scope.activeCard.$$hashKey;

        // for existing card with Id
        if (!!$rootScope.fieldsFromCards[uniqueCardKeyUsingId] && $scope.activeCard[$rootScope.nsPrefix + 'Definition__c'].dataSource.type) {

            $scope.fieldsFromLayoutOrActiveCard = $rootScope.fieldsFromCards[uniqueCardKeyUsingId];

        // for new card created without Id in the beginning
        } else if (!!$rootScope.fieldsFromCards[uniqueCardKeyUsingAngularHashKey] && $scope.activeCard[$rootScope.nsPrefix + 'Definition__c'].dataSource.type) {

            $scope.fieldsFromLayoutOrActiveCard = $rootScope.fieldsFromCards[uniqueCardKeyUsingAngularHashKey];

        // if card has no data source, then use layout data source loaded fields
        } else if ($rootScope.fieldsFromLayout) {

            $scope.fieldsFromLayoutOrActiveCard = $rootScope.fieldsFromLayout;

        }

        $log.debug($scope.fieldsFromLayoutOrActiveCard);

    };

    $scope.isZonesAvailable = function() {
        if($rootScope.layout && $rootScope.layout[$rootScope.nsPrefix+'Definition__c'] && $rootScope.layout[$rootScope.nsPrefix+'Definition__c']['zones']){
                return Object.keys($rootScope.layout[$rootScope.nsPrefix+'Definition__c']['zones']).length > 0 ? true : false;
        }
        return false;
    };

});

},{}],5:[function(require,module,exports){
/* globals forcetk, sessionId */
angular.module('carddesigner')
    .controller('cardDesignerController', function ($scope, $rootScope, SaveFactory, $timeout, $localizable, remoteActions, configService, $log, $window, dataService, LightningWebCompFactory, toolingService, $q, $modal, $alert, sObjectsFactory) {
        'use strict';
        var DEFAULT_AUTHOR = 'vlocity';
        var DEFAULT_AUTHOR_SUFFIX = 'Dev';
        var DEFAULT_TEMPLATE_URL = '/apex/' + $rootScope.nsPrefix + 'UITemplateDesigner?name=';
        var DEACTIVE_TEMPLATE_URL = '/apex/' + $rootScope.nsPrefix + 'TemplateHome?search=';
        var layoutId = window.location ? window.location.href.split(/[?&]/).find(function (item) {
            return /^id\=/.test(item);
        }) : null;

        $localizable('Active', 'Active')
            .then(function (label) {
                $('.pageDescription').addClass('vlocity').append('&nbsp;<span class="active text-success">' + label + '</span>');
                setActiveStatus();
            })

        $rootScope.allFieldsForObjects = {};
        $rootScope.fieldsFromCards = {};
        $rootScope.fieldGroupsFromCards = {};
        $rootScope.omniScriptsArr = [];
        var allOmniScriptsArr = [];
        var lwcOmniScriptsArr = [];
        var checkDuplicateOmniScript = [];
        var selectedOSId = '';
        $rootScope.layoutTypes = ['Layout', 'Flyout'];
        $rootScope.isInConsole = sforce && sforce.console && sforce.console.isInConsole();
        var selTemplate;
        var findObj, card, cardNames;
        $rootScope.newLayout = false;
        $rootScope.lwclayoutError = [];
        $rootScope.lightningwebcomponents = [];
        $rootScope.lwcUpdatePendingRequests = [];
        $rootScope.lwcCreatePendingRequests = [];
        $scope.lwcUpdateStatus = { isCreating: false, isUpdating: false };
        $scope.knownMetatags = [{ name: 'author' }, { name: 'description' }, { name: 'name' }, { name: 'viewport' }, { name: 'robots' }, { name: 'keywords' }, { name: 'copyright' }];
        remoteActions.isInsidePckg().then(insidePckg => {
            $scope.isInsidePckg = insidePckg;
        });
        $rootScope.isValidOsName = true;

        //To access vf pages properly inside lightning
        $rootScope.lightningUrl = (typeof sforce !== 'undefined' && typeof sforce.one === 'object') ? '/one/one.app#/alohaRedirect' : '';

        if (layoutId) {
            $rootScope.newLayout = false;
            layoutId = layoutId.replace(/^id=/, '');
            remoteActions.getLayout('Id', layoutId).then(
                function (data) {
                    if (data.length > 0) {
                        var layout = data[0];
                        layout.originalJson = JSON.parse(JSON.stringify(layout, null, 2));
                        Object.keys(layout.originalJson).forEach(function (key) {
                            if (/^(CreatedBy|CreatedDate|LastModifiedBy|LastModifiedDate|CreatedById|LastModifiedById|CurrencyIsoCode)$/.test(key)) {
                                delete layout.originalJson[key];
                            }
                        });
                        while (typeof layout[$rootScope.nsPrefix + 'Definition__c'] !== 'object' &&
                            typeof layout[$rootScope.nsPrefix + 'Definition__c'] !== 'undefined') {
                            //making sure we parse the json
                            layout[$rootScope.nsPrefix + 'Definition__c'] = JSON.parse(layout[$rootScope.nsPrefix + 'Definition__c']);
                            // also making sure we write it back in same format to avoid CARD-752
                            layout.originalJson[$rootScope.nsPrefix + 'Definition__c'] = angular.toJson(layout[$rootScope.nsPrefix + 'Definition__c']);
                        }

                        while (typeof layout[$rootScope.nsPrefix + 'Datasource__c'] !== 'object' &&
                            typeof layout[$rootScope.nsPrefix + 'Datasource__c'] !== 'undefined') {
                            //making sure we parse the json
                            layout[$rootScope.nsPrefix + 'Datasource__c'] = JSON.parse(layout[$rootScope.nsPrefix + 'Datasource__c']);
                            // also making sure we write it back in same format to avoid CARD-752
                            layout.originalJson[$rootScope.nsPrefix + 'Datasource__c'] = angular.toJson(layout[$rootScope.nsPrefix + 'Datasource__c']);
                        }
                        if (!layout[$rootScope.nsPrefix + 'Definition__c']) {
                            layout[$rootScope.nsPrefix + 'Definition__c'] = { templates: [], dataSource: [], Cards: [] };
                        }
                        $rootScope.layout = layout;
                        if (!$rootScope.layout[$rootScope.nsPrefix + 'Definition__c']) {
                            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'] = { Cards: [] };
                        }
                        if (!$rootScope.layout[$rootScope.nsPrefix + 'Version__c'] || $rootScope.layout[$rootScope.nsPrefix + 'Version__c'] === '') {
                            $rootScope.layout[$rootScope.nsPrefix + 'Version__c'] = 1.0;
                        }

                        if ($rootScope.layout[$rootScope.nsPrefix + 'ParentID__c']) {
                            remoteActions.getLayout('GlobalKey__c', $rootScope.layout[$rootScope.nsPrefix + 'ParentID__c']).then(
                                function (layouts) {
                                    $log.debug('got the parent layout ', layouts);
                                    $rootScope.parentLayout = layouts[0];
                                },
                                function (error) {
                                    $log.debug('parent link retrieval error: ', error);
                                    $rootScope.parentLayout = {};
                                });
                        }
                        if ($rootScope.layout[$rootScope.nsPrefix + 'RequiredPermission__c']) {
                            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].requiredPermission = $rootScope.layout[$rootScope.nsPrefix + 'RequiredPermission__c'];
                        }
                        $rootScope.$broadcast('rootLayoutReady', $rootScope.layout);

                    } else {
                        $localizable('NewLayout', "New Layout")
                            .then(function (label) {
                                $rootScope.layout = {
                                    'Name': label,
                                    'createNewLayout': true
                                };
                                $rootScope.layout[$rootScope.nsPrefix + 'Version__c'] = 1.0;
                                $rootScope.layout[$rootScope.nsPrefix + 'Type__c'] = 'Layout';
                                $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'] = { Cards: [] };
                                $rootScope.doneLoading = true;
                            });
                        $rootScope.$broadcast('rootLayoutReady', $rootScope.layout);
                    }
                },
                function (error) {
                    $log.debug('layouts retrieval error: ' + error);
                });
        } else {
            $rootScope.newLayout = true;
            $rootScope.layout = {
                'Name': '',
                'createNewLayout': true
            };
            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'] = { Cards: [] };
            $rootScope.layout[$rootScope.nsPrefix + 'Version__c'] = 1.0;
            $rootScope.layout[$rootScope.nsPrefix + 'Type__c'] = 'Layout';
            $rootScope.doneLoading = true;
            $timeout(function () {
                $rootScope.$broadcast('rootLayoutReady', $rootScope.layout);
            }, 100);
        }

        $timeout(function () {
            remoteActions.getAllActionsInfo()
                .then(function (actions) {
                    if (actions) {
                        $rootScope.allActions = actions;
                    } else {
                        $rootScope.allActions = [];
                    }
                }, function (err) {
                    //error handling
                });
        }, 0);

        // Get all streamingChannel
        $timeout(function () {
            remoteActions.getStreamingChannel()
                .then(function (channels) {
                    if (channels) {
                        if (channels.streamingChannel) {
                            channels.pushTopic = channels.pushTopic.map(function (obj) {
                                return {
                                    Name: '/topic/' + obj.Name
                                };
                            });
                        }
                        $rootScope.channels = channels;
                    } else {
                        $rootScope.channels = [];
                    }
                }, function (err) {
                    //error handling
                });
        }, 0);

        // Get all the actions
        $timeout(function () {
            remoteActions.getDataViaDynamicSoql('SELECT Id, Name,NamespacePrefix FROM ApexClass WHERE Status = \'Active\' ORDER BY Name')
                .then(function (apexClasses) {
                    apexClasses = JSON.parse(apexClasses);
                    $log.debug(apexClasses);
                    if (apexClasses) {
                        $rootScope.allApexClasses = apexClasses;
                    } else {
                        $rootScope.allApexClasses = [];
                    }
                }, function (err) {
                    //error handling
                });
        }, 0);
        $timeout(function () {
            remoteActions.getLWCBundles('').then(function (lwcs) {
                //Filtering Deprecated lwc
                lwcs = lwcs.records.filter(function (item) {
                    return item.MasterLabel.indexOf("DEPRECATED") === -1;
                })
                $rootScope.lightningwebcomponents = $rootScope.lightningwebcomponents.concat(lwcs);
                if ($rootScope.layout && $rootScope.layout[$rootScope.nsPrefix + 'Active__c']) {
                    let nameOfLwc = LightningWebCompFactory.convertNameToValidLWCCase(LightningWebCompFactory.DEFAULT_LWC_PREFIX + $rootScope.layout.Name);
                    var layoutLwc = _.find($rootScope.lightningwebcomponents, { DeveloperName: nameOfLwc });
                    let lwcTemplate = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].lwc;
                    if (lwcTemplate && !layoutLwc) {
                        lwcTemplate = (lwcTemplate && lwcTemplate.Id) ? _.find($rootScope.lightningwebcomponents, { MasterLabel: lwcTemplate.MasterLabel }) : null;
                        $rootScope.lwcCompExist = lwcTemplate ? true : false;
                        $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].bypassSave = true;
                    }
                }
                //Checking if layout is having xml config, making sure it updates with LWC
                if ($rootScope.layout && $rootScope.layout[$rootScope.nsPrefix + "Definition__c"] && $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].xmlObject) {
                    //fetching meta data of lwc to compare with layout json and if not same then updating our lwc.
                    //meta config inside layout json always take priority
                    if (layoutLwc && layoutLwc.Id) {
                        remoteActions
                            .getLWCMetaDataByBundleId(layoutLwc.Id)
                            .then(function (data) {
                                let metaObject = data.records[0].Metadata;
                                delete metaObject.lwcResources;
                                if (metaObject.targets && metaObject.targets.target) metaObject.targets = LightningWebCompFactory.getNameAndTarget(metaObject.targets.target);
                                if (!(_.isEqual(
                                    _.omit(metaObject, ['targetConfigs']),
                                    _.omit($rootScope.layout[$rootScope.nsPrefix + "Definition__c"].xmlObject, ['runtimeNamespace', 'targetConfigs', 'targetConfig']),
                                ) && _.isEqual(window.atob(metaObject.targetConfigs.asByteArray).trim(), window.atob($rootScope.layout[$rootScope.nsPrefix + "Definition__c"].xmlObject.targetConfigs).trim()))) {
                                    var xmlObject = $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].xmlObject;
                                    xmlObject.runtimeNamespace = $rootScope.nsPrefix.replace("__", "");
                                    LightningWebCompFactory.setXmlObject(LightningWebCompFactory.generateXml(xmlObject), LightningWebCompFactory.prepareMetaObject(xmlObject), xmlObject);
                                }
                            });
                    }
                }
            });
        }, 0);

        $rootScope.lwcToBeDeleted = [];

        $rootScope.$on('modal.hide.before', function () {
            document.body.classList.remove("modal-open");
        });

        $scope.changeTemplate = function () {
            if ($rootScope.layout && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'] && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['templates'] && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['templates'][0]) {
                $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['templates'][0].templateUrl = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['templates'][0].templateUrl.Name || $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['templates'][0].templateUrl;
                var selTemplate = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['templates'][0].templateUrl;
                $log.debug('selected template ', selTemplate, $rootScope.templatesMap[selTemplate]);
                if ($rootScope.templatesMap[selTemplate]) {
                    if (!$rootScope.layout[$rootScope.nsPrefix + "Definition__c"].enableLwc && $rootScope.templatesMap[selTemplate] && $rootScope.templatesMap[selTemplate][$rootScope.nsPrefix + 'Definition__c'] && $rootScope.templatesMap[selTemplate][$rootScope.nsPrefix + 'Definition__c']['zones']) {
                        $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'] = {};
                        angular.forEach($rootScope.templatesMap[selTemplate][$rootScope.nsPrefix + 'Definition__c']['zones'], function (zone) {
                            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'][zone.name] = zone;
                            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'][zone.name]['cardNames'] = [];
                            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'][zone.name]['layouts'] = [];
                        });
                        $log.debug('loaded zones ', $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones']);
                    } else {
                        delete $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'];
                        $log.debug('removed zones ', $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones']);
                    }
                }
                $scope.scrollModal();
            }
        };
        $scope.scrollModal = function () {
            let menu = document.querySelector(".dropdown-menu");
            if (menu && menu.children.length) {
                let elem = document.querySelector(".modal-body");
                elem.scrollTop = elem.scrollHeight;
            }
        }

        $scope.selectLwc = function (name, state) {
            if (!$rootScope.layout || !$rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc) {
                return;
            }
            var selectedLWCObj;
            if (state) {
                selectedLWCObj = state;
            } else {
                selectedLWCObj = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'];
            }
            var lwc = selectedLWCObj.lwc;
            if (lwc && lwc.Id) {
                selectedLWCObj.lwc = { "MasterLabel": lwc.MasterLabel, "DeveloperName": lwc.DeveloperName, "Id": lwc.Id, "name": lwc.DeveloperName, "NamespacePrefix": lwc.NamespacePrefix };
            }
        }

        $scope.createLwc = function (obj, type, itemDeactivated) {
            var nameOfLwc;
            if (!$rootScope.layout || !$rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc) {
                return;
            }

            if ($rootScope.lightningwebcomponents.length === 0) {
                //lwcs not loaded yet.
                return;
            }

            //Fixing layout name to support lwc, this will be component name to be used for that layout
            nameOfLwc = LightningWebCompFactory.convertNameToValidLWCCase(LightningWebCompFactory.DEFAULT_LWC_PREFIX + obj.Name);

            var layoutLwc = _.find($rootScope.lightningwebcomponents, { DeveloperName: nameOfLwc });
            if (!obj[$rootScope.nsPrefix + 'Active__c']) {
                if (layoutLwc && itemDeactivated) {
                    $scope.doPendingUpdateRequests(nameOfLwc, obj, type, true);
                    return;
                }
                nameOfLwc = nameOfLwc + "_" + (obj[$rootScope.nsPrefix + 'Version__c'] || "legacy") + "_" + obj[$rootScope.nsPrefix + 'Author__c'];
                nameOfLwc = LightningWebCompFactory.convertNameToValidLWCCase(nameOfLwc);
                if (type === "layout") {
                    $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].componentName = nameOfLwc;
                }
            }
            layoutLwc = _.find($rootScope.lightningwebcomponents, { DeveloperName: nameOfLwc });
            $scope.lwcUpdateStatus = $scope.lwcUpdateStatus || {};

            if (!layoutLwc) {
                var index = _.findIndex($rootScope.lwcCreatePendingRequests, { name: nameOfLwc });
                if (index === -1) {
                    $rootScope.lwcCreatePendingRequests.push({ name: nameOfLwc, obj: _.clone(obj), type: type });
                    $localizable('UndeployedLayoutChanges', "Layout has undeployed changes")
                        .then(function (label) {
                            displayAlert("", '<i class="icon icon-v-information-line"></i> ' + label);
                        });
                }

                if (LightningWebCompFactory.isDeploymentPending && type === "layout") {
                    displayAlert(true);
                    LightningWebCompFactory.isDeploymentPending = false;
                    $scope.doLwcDeploy();
                }
            } else {
                //Checking if xml metadata is updated adding it to pending request only if layout is active.
                var xmlObject = LightningWebCompFactory.getXmlObject();
                if (xmlObject.metaObject && xmlObject.xmlStr && obj[$rootScope.nsPrefix + 'Active__c'] && type === "layout") {
                    let metaObj = {
                        Id: layoutLwc.Id,
                        metadata: angular.copy(xmlObject.metaObject)
                    }
                    xmlObject.metaObject = null;
                    $rootScope.lwcUpdatePendingRequests.push(metaObj);
                    LightningWebCompFactory.isDeploymentPending = true;
                }

                $scope.doPendingUpdateRequests(nameOfLwc, obj, type);
            }
        };

        $scope.deleteLwc = function () {
            // Deleting lwc cards which is already deleted from the layout.
            if ($rootScope.lwcToBeDeleted.length > 0) {
                $rootScope.lwcToBeDeleted.map((card) => {
                    let cardId = card.Id;
                    let cardName = card.Name ? card.Name : '';
                    let cardVersion = card.Version ? card.Version : '';
                    remoteActions.deleteComponent('LwcBundle', card.Id).then((response) => {
                        if (response && !response.error) {
                            var deletedLwc = _.find($rootScope.lightningwebcomponents, {
                                Id: cardId
                            });
                            _.remove($rootScope.lightningwebcomponents, {
                                Id: cardId
                            });
                            _.remove($rootScope.lwcToBeDeleted, {
                                Id: cardId
                            });
                            delete LightningWebCompFactory.layoutLwcResource[deletedLwc.DeveloperName];
                            let name = cardVersion ? cardName + '(Version ' + cardVersion + ')' : cardName;
                            console.log(name + " Lightning Web Component Deleted");
                            $rootScope.lightningwebcomponents.errors = [];
                        }
                        else {
                            if (cardName && cardVersion) {
                                let errorMessage = $rootScope.vlocity.getCustomLabelSync('FailedToDelete', "Failed to delete '{1} (Version {2})'", cardName, cardVersion);
                                $rootScope.lightningwebcomponents.errors = [{ message: errorMessage }];
                            }
                        }
                    }).catch(() => {
                        if (cardName && cardVersion) {
                            let errorMessage = $rootScope.vlocity.getCustomLabelSync('FailedToDelete', "Failed to delete '{1} (Version {2})'", cardName, cardVersion);
                            $rootScope.lightningwebcomponents.errors = [{ message: errorMessage }];
                        }
                    });
                });
            }
        }

        $scope.doCreateRequests = function (nameOfLwc, obj, type) {
            var deferred = $q.defer();
            $scope.lwcUpdateStatus.isCreating = true;
            $rootScope.layout.savinglwc = true;
            obj.savinglwc = true;
            var lwcCmp = { name: nameOfLwc, files: [] };
            lwcCmp.files = LightningWebCompFactory.generateLWCFiles(
                nameOfLwc,
                obj,
                type
            );
            $log.debug("DESIGNER", "creating a lwc:", nameOfLwc);
            LightningWebCompFactory.createNewLwc(lwcCmp, obj, type).then(function () {
                $log.debug("DESIGNER", "LWC creation done", nameOfLwc);
                obj.savinglwc = false;
                $rootScope.layout.savinglwc = false;
                $scope.lwcUpdateStatus.isCreating = false;
                $rootScope.lwcCreatePendingRequests.splice(_.findIndex($rootScope.lwcCreatePendingRequests, { name: nameOfLwc }), 1);
                $rootScope.$broadcast('saved', obj, true);
                deferred.resolve('Success');
            }, function (errors) {
                $log.debug("DESIGNER", "LWC creation failed:", nameOfLwc);
                $scope.lwcUpdateStatus.isCreating = false;
                obj.savinglwc = false;
                $rootScope.layout.savinglwc = false;
                deferred.reject('Failure');
            });
            return deferred.promise;
        }

        $scope.doPendingUpdateRequests = function (name, obj, type, isNotActive) {
            LightningWebCompFactory.getUpdatedLocalResources(name, obj, type, isNotActive).then(function (result) {
                //update pending request array
                result.forEach(function (item) {
                    var index = _.findIndex($rootScope.lwcUpdatePendingRequests, { Id: item.Id });
                    if (index > -1) {
                        $rootScope.lwcUpdatePendingRequests[index] = item;
                    } else {
                        $rootScope.lwcUpdatePendingRequests.push(item);
                    }
                });


                if (!($rootScope.lwcToBeDeleted.length > 0 || isNotActive) && $rootScope.lwcUpdatePendingRequests.length > 0) {
                    $localizable('UndeployedLayoutChanges', "Layout has undeployed changes")
                        .then(function (label) {
                            displayAlert("", '<i class="icon icon-v-information-line"></i> ' + label);
                        });
                }

                //Updating only when we have something to delete
                if ($rootScope.lwcToBeDeleted.length > 0 || isNotActive) {
                    $scope.doUpdateRequest();
                }

                if (LightningWebCompFactory.isDeploymentPending && type === "layout") {
                    LightningWebCompFactory.isDeploymentPending = false;
                    $scope.doLwcDeploy()
                }

            });
        }

        $scope.doUpdateRequest = function (showAlert) {
            var deferred = $q.defer();
            var resourceToUpdate = angular.copy($rootScope.lwcUpdatePendingRequests);
            if (resourceToUpdate.length > 0) {
                $rootScope.layout.savinglwc = true;
                $scope.lwcUpdateStatus.isUpdating = true;
                $rootScope.lwcUpdatePendingRequests = [];
                LightningWebCompFactory.doUpdateRequest(resourceToUpdate).then(function () {
                    $scope.$evalAsync(function () {
                        $scope.lwcUpdateStatus.isUpdating = false;
                        $rootScope.layout.savinglwc = false;
                        deferred.resolve('Success');
                        if (showAlert) {
                            $localizable('LayoutChangesDeployed', "Layout is updated")
                                .then(function (label) {
                                    displayAlert("", " " + label, 'success', 2);
                                });
                        }
                        $scope.deleteLwc();
                    });
                }, function (errors) {
                    if (errors && errors[0]) {
                        displayAlert("", errors[0], 'danger', false);
                    }
                    $scope.lwcUpdateStatus.isUpdating = false;
                    $scope.$evalAsync(function () {
                        $rootScope.layout.savinglwc = false;
                        deferred.reject('Failure');
                    });
                })
            } else {
                if (showAlert) {
                    $localizable('LayoutChangesDeployed', "Layout is updated").then(function (label) {
                        displayAlert("", " " + label, 'success', 2);
                    });
                }
                $rootScope.$broadcast('saved', null, true);
                console.info("Saved");
                deferred.resolve('Success');
            }
            return deferred.promise;
        }

        $scope.doLwcDeploy = function () {
            var modal, modalScope;
            modalScope = $scope.$new();
            modalScope.status = { title: "Deploying LWC", message: "Creating LWC" };
            if ($rootScope.lwcCreatePendingRequests.length > 0 || $rootScope.lwcUpdatePendingRequests.length > 0) {
                modal = $modal({
                    title: modalScope.status.title,
                    templateUrl: "lwcDeploymentStatusModal.tpl.html",
                    show: false,
                    html: true,
                    contentTemplate: false,
                    scope: modalScope,
                    backdrop: 'static'
                });

                modal.$promise.then(modal.show);
            }
            if ($rootScope.lwcCreatePendingRequests.length > 0) {
                //Creating Cards first
                var createRequest = _.find($rootScope.lwcCreatePendingRequests, { type: "card" });

                if (!createRequest) {
                    createRequest = $rootScope.lwcCreatePendingRequests[0];
                }

                modalScope.status.name = createRequest.obj.Name;
                $scope.doCreateRequests(createRequest.name, createRequest.obj, createRequest.type).then(function () {
                    if (modal && modal.$isShown) {
                        modal.destroy();
                    };
                    $rootScope.$broadcast('saved', null, true);
                    $scope.doLwcDeploy(modal);
                }, function () {
                    if (modal && modal.$isShown) {
                        modal.destroy();
                    };
                });
            } else {
                if (modal) {
                    modal.hide();
                    modal.$promise.then(modal.show);
                    modalScope.status.message = "Updating LWC";
                }
                $scope.doUpdateRequest(true).then(function () {
                    $rootScope.$broadcast('saved', null, true);
                    if (modal && modal.$isShown) {
                        modal.destroy();
                    };
                }, function () {
                    if (modal && modal.$isShown) {
                        modal.destroy();
                    };
                });;
            }
        }

        $scope.isTemplateActive = function (template, layoutname) {
            $scope.layoutName = layoutname;
            var hasTemplate = _.find($rootScope.templates, { Name: template });
            $scope.templateUrlPrefix = DEFAULT_TEMPLATE_URL;
            if (!hasTemplate && $rootScope.templates !== undefined) {
                $scope.templateUrlPrefix = DEACTIVE_TEMPLATE_URL;
                return true;
            }
            return false;
        };

        $scope.isLwcActive = function (lwcname, layoutname) {
            $scope.layoutName = layoutname;
            var hasLwc = _.find($rootScope.lightningwebcomponents, { DeveloperName: lwcname });
            $scope.templateUrlPrefix = DEFAULT_TEMPLATE_URL;
            if (!hasLwc && $rootScope.lightningwebcomponents !== undefined) {
                $scope.templateUrlPrefix = DEACTIVE_TEMPLATE_URL;
                return true;
            }
            return false;
        }

        let throwError = function(label,msg){
            $localizable(label,msg).then(function(value) {
                $rootScope.layout.errors = [
                {
                    message: value
                }
                ];
            });
        }

        $scope.saveNewLayout = function () {
            if (!isLWCLayoutNameInvalid($rootScope.layout)) {
                setTimeout(() => {
                    SaveFactory.save($rootScope.layout, $rootScope.layoutCards, true);
                }, 1000);
            } 
        }

        let isLWCLayoutNameInvalid = function(layout) {
            if (!layout[$rootScope.nsPrefix + "Definition__c"].enableLwc){
                return false;
            }else{
                if(layout.Name.endsWith('_')){
                    throwError("LayoutLWCComponentNameError","Name must not end with an underscore.");
                    return true;
                }else{
                    let layoutLwcName = LightningWebCompFactory.DEFAULT_LWC_PREFIX + layout.Name;
                    layoutLwcName =
                      layoutLwcName +
                      "_" +
                      (layout[$rootScope.nsPrefix + "Version__c"] || "legacy") +
                      "_" +
                      layout[$rootScope.nsPrefix + "Author__c"];
                    layoutLwcName = LightningWebCompFactory.convertNameToValidLWCCase(
                      layoutLwcName
                    );
                    if(
                        _.find($rootScope.lightningwebcomponents, {
                            DeveloperName: layoutLwcName
                        })
                    ){
                        throwError("LayoutLWCComponentExistsError","Lwc name already exists. Please try a different name or author.");
                        return true;
                    }
                    return false;
                }  
            }
        };

        var callCloseTab = function callCloseTab(result) {
            sforce.console.closeTab(result.id);
        }

        $scope.closeNewLayoutTab = function () {
            if ($rootScope.isInConsole)
                sforce.console.getEnclosingTabId(callCloseTab);
            else
                $scope.openUrl('/apex/' + $rootScope.nsPrefix + 'CardHome');
        }

        $scope.updateVfPage = function (action) {
            var actionObj = _.find($rootScope.apexPages, { Name: action.visualForce })
            if (actionObj && actionObj.NamespacePrefix) {
                action.vForcewithNsPrefix = actionObj.NamespacePrefix + '__' + action.visualForce;
            } else if (actionObj && !actionObj.NamespacePrefix) {
                action.vForcewithNsPrefix = "c__" + action.visualForce;
            } else {
                action.vForcewithNsPrefix = $rootScope.nsPrefix + 'OmniScriptUniversalPage';
            }
        };

        // Get all apex pages
        $timeout(function () {
            remoteActions.getDataViaDynamicSoql('SELECT Id, Name, NamespacePrefix FROM ApexPage ORDER BY Name')
                .then(function (apexPages) {
                    apexPages = JSON.parse(apexPages);
                    $log.debug(apexPages);
                    if (apexPages) {
                        $rootScope.apexPages = apexPages;
                    } else {
                        $rootScope.apexPages = [];
                    }
                }, function (error) {
                    $rootScope.apexPages = [];
                    $log.debug('ApexPage retrieval error: ' + error);
                });
        }, 0);

        $timeout(function () {
            dataService.getRecords('SELECT DeveloperName,Endpoint,Id,Language,MasterLabel,NamespacePrefix,PrincipalType FROM NamedCredential LIMIT 10000').then(
                function (data) {
                    $log.debug('named credentials ', data);
                    var creds = [];
                    angular.forEach(data, function (cred) {
                        creds.push({ 'name': cred.MasterLabel, 'value': cred.DeveloperName });
                    });
                    $rootScope.namedCredentials = creds;
                },
                function (err) {
                    $rootScope.namedCredentials = [];
                    $log.debug('named credentials error ', err);
                }
            );
        }, 0);

        // function to sort an array based on a particular field
        $scope.sortArray = function (array, field) {
            let tempArray = [...array];
            tempArray.sort(function (a, b) {
                return a[field].localeCompare(b[field]);
            });
            return tempArray;
        }

        // Get all dataraptor bundle
        $timeout(function () {
            remoteActions.getDataViaDynamicSoql('SELECT Id, Name FROM ' + $rootScope.nsPrefix + 'DRBundle__c')
                .then(function (drBundles) {
                    drBundles = JSON.parse(drBundles);
                    $rootScope.drBundles = drBundles.map(function (bundle) {
                        return {
                            Id: bundle.Id,
                            Name: bundle.Name
                        };
                    });
                    $rootScope.drBundles = $scope.sortArray($rootScope.drBundles, 'Name');
                }, function (error) {
                    $rootScope.drBundles = [];
                    console.log('dataraptor bundle retrieval error: ' + error);
                });
        }, 0);

        //get omniscript types
        $timeout(function () {
            dataService.getRecords('SELECT ' + $rootScope.nsPrefix + 'Type__c, ' + $rootScope.nsPrefix + 'SubType__c, ' + $rootScope.nsPrefix + 'Language__c, ' + $rootScope.nsPrefix + 'IsLwcEnabled__c FROM ' + $rootScope.nsPrefix + 'OmniScript__c').then(function (omniType) {
                omniType.map(function (bundle) {
                    if (checkDuplicateOmniScript.indexOf(bundle['Id']) == -1) {
                        let omniTypeElement = {};
                        checkDuplicateOmniScript.push(bundle['Id']);
                        omniTypeElement.Name = bundle[$rootScope.nsPrefix + 'Type__c'] + '/' + bundle[$rootScope.nsPrefix + 'SubType__c'] + '/' + bundle[$rootScope.nsPrefix + 'Language__c'];
                        omniTypeElement.Type = bundle[$rootScope.nsPrefix + 'Type__c'];
                        omniTypeElement.SubType = bundle[$rootScope.nsPrefix + 'SubType__c'];
                        omniTypeElement.Language = bundle[$rootScope.nsPrefix + 'Language__c'];
                        omniTypeElement.Id = bundle['Id'];
                        omniTypeElement.isLwc = bundle[$rootScope.nsPrefix + 'IsLwcEnabled__c'];
                        if (omniTypeElement.isLwc) {
                            lwcOmniScriptsArr.push(omniTypeElement);
                        }
                        allOmniScriptsArr.push(omniTypeElement);
                    }
                });
                $rootScope.omniScriptsArr = allOmniScriptsArr;
            });
        }, 0);


        // Get all integration procedure bundle
        $timeout(function () {
            remoteActions.getDataViaDynamicSoql('SELECT Id,' + $rootScope.nsPrefix + 'ProcedureKey__c FROM ' + $rootScope.nsPrefix + 'OmniScript__c WHERE ' + $rootScope.nsPrefix + 'IsProcedure__c = true AND ' + $rootScope.nsPrefix + 'IsActive__c = true')
                .then(function (ipBundles) {
                    ipBundles = JSON.parse(ipBundles);
                    $rootScope.ipBundles = ipBundles.map(function (bundle) {
                        return {
                            Id: bundle.Id,
                            Name: bundle[$rootScope.nsPrefix + 'ProcedureKey__c']
                        };
                    });
                    $rootScope.ipBundles = $scope.sortArray($rootScope.ipBundles, 'Name');
                }, function (error) {
                    $rootScope.ipBundles = [];
                    console.log('dataraptor bundle retrieval error: ' + error);
                });
        }, 0);

        //Get all layouts
        $rootScope.getAllLayouts = function () {
            return remoteActions.getAllLayouts().then(function (layouts) {
                $rootScope.layouts = []; // this is used by save.js to make sure layout name is unique when user creates new layout
                $rootScope.flyouts = [];
                if (layouts) {
                    $rootScope.layouts = layouts;
                    //Active Flyout list
                    $rootScope.flyouts = layouts.filter(function (layout) {
                        return layout[$rootScope.nsPrefix + 'Active__c'] && (layout[$rootScope.nsPrefix + 'Type__c'] && layout[$rootScope.nsPrefix + 'Type__c'].toLowerCase() === 'flyout');
                    });

                    //now create a map of CardNames to Layout
                    $scope.updateCardNameToLayoutAssignment();
                }
            });
        };

        $rootScope.getAllLayouts();

        let getOSLwcName = function (type, subType, language) {
            const cpSubType = (subType) ? (subType.charAt(0).toUpperCase() + subType.slice(1)) : subType;
            return type + cpSubType + language;
        }

        $rootScope.setOSAction = function (action) {

            action.isLwcOS = action.omniType && action.omniType.isLwc ? true : false;

            if (action.omniType && action.isLwcOS && action.omniType.Id && action.omniType.Id !== selectedOSId) {
                selectedOSId = action.omniType.Id;
                $rootScope.omniScriptsArr.forEach((omni) => {
                    if (omni.Id == selectedOSId) {
                        let lwcOsName = getOSLwcName(omni.Type, omni.SubType, omni.Language);
                        let lwcOs = _.find($rootScope.lightningwebcomponents, { DeveloperName: lwcOsName });
                        if (lwcOs)
                            action.orgNsPrefix = lwcOs.NamespacePrefix;
                    }
                });
                if (action.orgNsPrefix)
                    $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].orgNsPrefix = action.orgNsPrefix;
            }
            if (action.omniType && action.omniType.Name && $rootScope.omniScriptsArr.find(element => element.Name.toLowerCase() === action.omniType.Name.toLowerCase())) {
                $rootScope.isValidOsName = true;
            } else if (action.omniType) {
                $rootScope.isValidOsName = false;
            }

        }

        $scope.updateCardNameToLayoutAssignment = function () {
            remoteActions.getAllLayouts().then(function (layouts) {
                $rootScope.mapOfCardsToLayouts = layouts.reduce(function (mapOfCardsToLayouts, layout) {
                    try {
                        var definition = JSON.parse(layout[$rootScope.nsPrefix + 'Definition__c']);
                        definition.Cards.forEach(function (cardName) {
                            if (!mapOfCardsToLayouts[cardName]) {
                                mapOfCardsToLayouts[cardName] = [];
                            }
                            mapOfCardsToLayouts[cardName].push(layout.Name + ' (Version' + layout[$rootScope.nsPrefix + 'Version__c'] + ')');
                        });
                    } catch (e) {
                    }
                    return mapOfCardsToLayouts;
                }, {});
            });
        }

        $scope.$watch('layout[nsPrefix + "Active__c"]', setActiveStatus);

        function setActiveStatus() {
            if ($rootScope.layout && $rootScope.layout[$rootScope.nsPrefix + 'Active__c']) {
                $('.pageDescription .active').css({
                    'visibility': 'visible'
                });
                $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['previewType'] = 'runTime';
            } else {
                if ($rootScope.layout && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc) {
                    $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['previewType'] = 'designTime';
                }
                $('.pageDescription .active').css({
                    'visibility': 'hidden'
                });
            }
        }

        remoteActions.getTemplatesInfo().then(function (templates) {

            $rootScope.templatesMap = {};
            //parse the JSON definition field
            angular.forEach(templates, function (template) {
                if (template[$rootScope.nsPrefix + 'Definition__c']) {
                    template[$rootScope.nsPrefix + 'Definition__c'] = JSON.parse(template[$rootScope.nsPrefix + 'Definition__c']);
                }
                $rootScope.templatesMap[template.Name] = template;
            });
            $rootScope.templates = templates;
        });

        function loadZones() {
            $rootScope.zoneCardNames = [];
            if ($rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['templates']) {
                selTemplate = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['templates'][0].templateUrl;
                if ($rootScope.templatesMap) {
                    if ($rootScope.templatesMap[selTemplate][$rootScope.nsPrefix + 'Definition__c'] && $rootScope.templatesMap[selTemplate][$rootScope.nsPrefix + 'Definition__c']['zones']) {
                        //backup old zones
                        var oldZones = angular.copy($rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones']);
                        //then copy over the zones from the template and copy over the zone from the backup if it exists
                        $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'] = {};
                        angular.forEach($rootScope.templatesMap[selTemplate][$rootScope.nsPrefix + 'Definition__c']['zones'], function (zone) {
                            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'][zone.name] = oldZones[zone.name] || zone;
                            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'][zone.name]['cardNames'] = oldZones[zone.name] !== undefined ? oldZones[zone.name]['cardNames'] || [] : [];
                            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'][zone.name]['layouts'] = oldZones[zone.name] !== undefined ? oldZones[zone.name]['layouts'] || [] : [];

                            // To support old layouts having cardNames inside zone
                            // As now we can have multiple cards with same name so we can't use name as identifier.
                            if (!$rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'][zone.name]['zoneCards']) {
                                cardNames = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'][zone.name]['cardNames'];
                                $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'][zone.name]['zoneCards'] = [];
                                angular.forEach(cardNames, function (name) {
                                    var zoneCard = {};
                                    findObj = { 'Name': name };
                                    findObj[$rootScope.nsPrefix + 'Active__c'] = true;
                                    card = _.find($rootScope.cards, findObj);
                                    if (!card) {
                                        findObj = { 'Name': name };
                                        card = _.find($rootScope.cards, findObj);
                                    }
                                    zoneCard.Name = card.Name;
                                    zoneCard.Author = card[$rootScope.nsPrefix + 'Author__c'] ? card[$rootScope.nsPrefix + 'Author__c'] : $window.orgName.toLowerCase() === DEFAULT_AUTHOR ? DEFAULT_AUTHOR + DEFAULT_AUTHOR_SUFFIX : $window.orgName;
                                    zoneCard.Version = card[$rootScope.nsPrefix + 'Version__c'] ? card[$rootScope.nsPrefix + 'Version__c'] : 'Legacy';
                                    zoneCard.globalKey = card[$rootScope.nsPrefix + 'GlobalKey__c'];
                                    $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'][zone.name]['zoneCards'].push(zoneCard);
                                    $rootScope.zoneCardNames = $rootScope.zoneCardNames.concat(zoneCard.globalKey);
                                });
                                delete $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'][zone.name]['cardNames'];
                            } else {
                                var zoneCards = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'][zone.name]['zoneCards'];
                                angular.forEach(zoneCards, function (card) {
                                    $rootScope.zoneCardNames = $rootScope.zoneCardNames.concat(card.globalKey);
                                });
                            }
                        });
                        $rootScope.zoneCardNames = $rootScope.zoneCardNames.map(function (key) {
                            return { globalKey: key };
                        });
                    } else {
                        delete $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['zones'];
                    }
                }
            }
        }

        // Get all sObjects
        $timeout(function () {
            sObjectsFactory.getAllObjects().then(function (allObjects) {
                $rootScope.sobjectTypes = allObjects.sort(function (a, b) {
                    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
                });
                $rootScope.loadFieldsFor($rootScope.sobjectTypes[0].name);
            });
        }, 0);


        $rootScope.loadAllCards = function () {
            //refresh first
            $rootScope.cards = [];
            $rootScope.mapOfCardsToFlyout = {};
            remoteActions.getAllCardDefinitions().then(function (cards) {
                cards.forEach(function (card) {
                    try {
                        if (card[$rootScope.nsPrefix + 'Definition__c']) {
                            card[$rootScope.nsPrefix + 'Definition__c'] = JSON.parse(card[$rootScope.nsPrefix + 'Definition__c']);
                        }
                        var flyouts = _.without(_.map(card[$rootScope.nsPrefix + 'Definition__c'].states, 'flyout.layout'), null, undefined);
                        angular.forEach(flyouts, function (flyout) {
                            if ($rootScope.mapOfCardsToFlyout[flyout]) {
                                $rootScope.mapOfCardsToFlyout[flyout].push(card.Name);
                            } else {
                                $rootScope.mapOfCardsToFlyout[flyout] = [card.Name];
                            }
                        });
                    } catch (e) {
                        $log.debug('Card has bad definition_c ', card, e);
                    }
                });
                $localizable('CardDesNewCard', '<<Empty Card>>')
                    .then(function (label) {
                        $rootScope.cards = [{
                            Name: label,
                            isNew: true
                        }].concat(cards);
                        $rootScope.selectedCard = $rootScope.cards[0];
                        if ($rootScope.layout) {
                            loadZones();
                        } else {
                            $rootScope.$on('rootLayoutReady', function (event, layout) {
                                loadZones();
                            });
                        }
                    });
            });
        };

        $rootScope.loadAllCards();


        $rootScope.loadFieldsFor = function (object) {
            if (object) {
                remoteActions.getFieldsForObject(object).then(function (fields) {
                    $rootScope.allFieldsForObjects[object] = Object.keys(fields).map(function (key) {
                        return fields[key];
                    });
                });
            }
        };

        $scope.toggleCollapsePalette = function () {
            $rootScope.collapsePalette = !$rootScope.collapsePalette;
        };

        $scope.toggleFullScreen = function () {
            $rootScope.fullScreen = !$rootScope.fullScreen;
        };

        $scope.openUrl = window.vlocityOpenUrl;

        $scope.openLWCUrl = function (url, event, newtab, lwc) {
            var attribute = "";
            if (lwc) {
                attribute = JSON.stringify({ name: lwc.DeveloperName })
            }
            var def = {
                'componentDef': 'c:genericWrapper',
                'attributes': {
                    'componentName': "designerComp",
                    'attribute': attribute
                },
                'tabTitle': lwc.MasterLabel
            }
            $scope.openUrl(url, event, newtab, def);
        };

        $scope.downloadLWCByName = function (lwc) {
            $rootScope.downloadingLwc = true;
            if (lwc) {
                LightningWebCompFactory.downloadLWC(lwc.DeveloperName).then(function () {
                    $rootScope.downloadingLwc = false;
                }, function (err) {
                    $rootScope.downloadingLwc = false;
                    $log.debug("Download lwc error ", err);
                });
            }
        };

        $localizable("VlocityComponentsNotDownloadable", "Vlocity LWC templates and base components are not downloadable").then(label=>{
            $scope.testLabel = label;
        })
        $scope.isManagedLWC = function (currentLWC) {
            let isManaged = false;
            if ($scope.isInsidePckg && currentLWC) {
                if (currentLWC.NamespacePrefix && currentLWC.NamespacePrefix === $rootScope.nsPrefix.replace("__", "")) {
                    isManaged = true;
                } else {
                    $rootScope.lightningwebcomponents.forEach(lwc => {
                        if (currentLWC.DeveloperName === lwc.DeveloperName && $rootScope.nsPrefix.replace("__", "") === lwc.NamespacePrefix) {
                            isManaged = true;
                        }
                    });
                }
            }
            return isManaged
        }


        var displayAlert = function (removeAlert, errorContent, type, duration) {
            if ($scope.displayAlert) {
                // if you don't do this, the screen will display multiple instances
                // of error messages that occurred for the same entity.
                $scope.displayAlert.destroy();
                //$scope.displayAlert = null;
            }
            if (removeAlert) {
                return;
            }
            $scope.displayAlert = $alert({
                title: "",
                content: errorContent,
                container: '.vloc-container',
                type: type || "info",
                show: true,
                placement: 'top-right',
                duration: duration
            });
            $scope.displayAlert.$promise.then($scope.displayAlert.show);
        };

        $scope.setPermissionValue = function () {
            if ($rootScope.layout && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']) {
                $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].requiredPermission = $rootScope.layout[$rootScope.nsPrefix + 'RequiredPermission__c'];
            }
        }

    });

},{}],6:[function(require,module,exports){
angular
  .module("carddesigner")
  .controller("layoutController", function (
    $rootScope,
    $scope,
    configService,
    SaveFactory,
    $timeout,
    $modal,
    remoteActions,
    $location,
    helpNode,
    $window,
    $log,
    $localizable,
    LightningWebCompFactory
  ) {
    "use strict";
    var DEFAULT_AUTHOR = "vlocity";
    var DEFAULT_AUTHOR_SUFFIX = "Dev";
    $rootScope.$on("rootLayoutReady", function (event, layout) {
      $rootScope.layout = layout;
      $rootScope.authorLocked =
        $rootScope.layout[$rootScope.nsPrefix + "Author__c"] &&
        $rootScope.layout.Id;
      if (sforce.console && sforce.console.isInConsole()) {
        sforce.console.setTabTitle(layout.Name);
        sforce.console.onFocusedSubtab(function (tab) {
          sforce.console.setTabTitle(layout.Name);
        });
      } else {
        $window.document.title = layout.Name;
      }
      if (
        $rootScope.layout[$rootScope.nsPrefix + "Definition__c"]["previewType"]
      ) {
        $rootScope.layout[$rootScope.nsPrefix + "Definition__c"][
          "previewType"
        ] = "";
      }
      // Check if inside package
      remoteActions.isInsidePckg().then(
        function (insidePckg) {
          $log.debug("inside pckg? ", insidePckg);
          $rootScope.layout[$rootScope.nsPrefix + "Author__c"] =
            $rootScope.layout[$rootScope.nsPrefix + "Author__c"] ||
            ($window.orgName.toLowerCase() === DEFAULT_AUTHOR
              ? DEFAULT_AUTHOR + DEFAULT_AUTHOR_SUFFIX
              : $window.orgName);
          $rootScope.insidePckg = insidePckg;
          $rootScope.lockedLayout =
            $rootScope.insidePckg &&
            $rootScope.layout[$rootScope.nsPrefix + "Author__c"] &&
            $rootScope.layout[
              $rootScope.nsPrefix + "Author__c"
            ].toUpperCase() === "VLOCITY";
          if ($rootScope.layout[$rootScope.nsPrefix + "ParentID__c"]) {
            remoteActions
              .getLayout(
                "GlobalKey__c",
                $rootScope.layout[$rootScope.nsPrefix + "ParentID__c"]
              )
              .then(
                function (layouts) {
                  $log.debug("got the parent layout ", layouts);
                  $rootScope.parentLayout = layouts[0];
                },
                function (error) {
                  $log.debug("parent link retrieval error: ", error);
                  $rootScope.parentLayout = {};
                }
              );
          }
          $log.debug("is layout locked? ", $rootScope.lockedLayout);
        },
        function (err) {
          $log.debug("inside pckg error ", err);
          //set to true if error returns that user does not have access to package
          $rootScope.insidePckg = true;
        }
      );
    });

    //Documentation
    $scope.helpNode = helpNode;

    $scope.newVersion = function () {
      var cloneLayout;
      cloneLayout = angular.copy($rootScope.layout);
      $scope.disableVersionBtn = true;
      delete cloneLayout.Id;
      delete cloneLayout.createNewLayout;
      cloneLayout[$rootScope.nsPrefix + "GlobalKey__c"] = null;
      var latestVersionNum = 1;
      remoteActions
        .getLayoutByName($rootScope.layout.Name)
        .then(function (layouts) {
          angular.forEach(layouts, function (layout) {
            //only check layouts that match the same author
            if (
              layout[$rootScope.nsPrefix + "Author__c"] ===
              $rootScope.layout[$rootScope.nsPrefix + "Author__c"]
            ) {
              latestVersionNum =
                layout[$rootScope.nsPrefix + "Version__c"] > latestVersionNum
                  ? layout[$rootScope.nsPrefix + "Version__c"]
                  : latestVersionNum;
            }
          });

          cloneLayout[$rootScope.nsPrefix + "Version__c"] =
            latestVersionNum + 1;
          $rootScope.layout = cloneLayout; //set new version as the current layout
          $rootScope.layout[$rootScope.nsPrefix + "Active__c"] = false;
          SaveFactory.save(cloneLayout, $scope.cards, true).then(function (
            layout
          ) {
            $log.debug("saved the new version layout", layout);
            // Replaces the Page URL param "id" to new layout id.
            // Refreshing the page will load new layout
            //$location.search('id', layout.Id);

            $rootScope.layout = layout;
            $scope.disableVersionBtn = false;
          });
        });
    };

    $scope.showCloneModal = function () {
      var modal,
        modalScope,
        dataDisplay,
        title,
        content,
        clonedLayout,
        searchObj;
      // if query execution fails and error object is returned

      title = "Clone Layout";

      modalScope = $scope.$new();
      modalScope.parentLayout = $rootScope.layout;
      modalScope.clonedLayout = angular.copy($rootScope.layout);
      modalScope.clonedLayout[$rootScope.nsPrefix + "Author__c"] =
        $window.orgName.toLowerCase() === DEFAULT_AUTHOR
          ? DEFAULT_AUTHOR + DEFAULT_AUTHOR_SUFFIX
          : $window.orgName;
      modalScope.saveLayout = function (hideModal) {
        modalScope.layoutSaving = true;
        modalScope.clonedLayout[$rootScope.nsPrefix + "Version__c"] = 1;
        modalScope.clonedLayout[$rootScope.nsPrefix + "ParentID__c"] =
          modalScope.parentLayout[$rootScope.nsPrefix + "GlobalKey__c"];
        modalScope.clonedLayout[$rootScope.nsPrefix + "Active__c"] = false; //no cloned layouts become active
        delete modalScope.clonedLayout.Id;
        delete modalScope.clonedLayout.createNewLayout;
        delete modalScope.clonedLayout[$rootScope.nsPrefix + "GlobalKey__c"];
        modalScope.clonedLayout.errors = [];
        searchObj = {};
        searchObj["Name"] = modalScope.clonedLayout.Name;
        searchObj[$rootScope.nsPrefix + "Version__c"] =
          modalScope.clonedLayout[$rootScope.nsPrefix + "Version__c"];
        searchObj[$rootScope.nsPrefix + "Author__c"] =
          modalScope.clonedLayout[$rootScope.nsPrefix + "Author__c"];
        if (_.findIndex($rootScope.layouts, searchObj) !== -1) {
          $localizable(
            "LayoutExistsError",
            "Layout with same name and author already exists, try creating version."
          ).then(function (label) {
            modalScope.clonedLayout.errors = modalScope.clonedLayout.errors
              ? modalScope.clonedLayout.errors
              : [];
            modalScope.clonedLayout.errors.push({ message: label });
          });
          modalScope.layoutSaving = false;
          return;
        }

        if (
          $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].enableLwc &&
          $rootScope.lightningwebcomponents.find(function (component) {
            let lwcName = LightningWebCompFactory.DEFAULT_LWC_PREFIX + modalScope.clonedLayout.Name +
              "_" + modalScope.clonedLayout[$rootScope.nsPrefix + "Version__c"] +
              "_" + modalScope.clonedLayout[$rootScope.nsPrefix + "Author__c"];
            return (
              component.DeveloperName.toLowerCase() ===
              LightningWebCompFactory.convertNameToValidLWCCase(lwcName).toLowerCase() || component.DeveloperName.toLowerCase() === LightningWebCompFactory.convertNameToValidLWCCase(LightningWebCompFactory.DEFAULT_LWC_PREFIX + modalScope.clonedLayout.Name).toLowerCase()
            );
          })
        ) {
          $localizable(
            "CardLWCComponentExistsError",
            "Lightning Web Component with same name exists."
          ).then(function (label) {
            modalScope.clonedLayout.errors = modalScope.clonedLayout.errors
              ? modalScope.clonedLayout.errors
              : [];
            modalScope.clonedLayout.errors.push({ message: label });
          });
          modalScope.layoutSaving = false;
          return;
        }

        SaveFactory.save(modalScope.clonedLayout, $scope.cards, true).then(
          function (layout) {
            $log.debug("saved the new new layout", layout);
            if (layout.errors) {
              modalScope.clonedLayout.errors = layout.errors;
              modalScope.layoutSaving = false;
              return;
            } else {
              // Replaces the Page URL param "id" to new layout id.
              // Refreshing the page will load new layout
              $rootScope.layout = layout;
              delete $rootScope.parentLayout;
              hideModal();
              $rootScope.$broadcast("rootLayoutReady", $rootScope.layout);
              $rootScope.getAllLayouts(); //refresh available layouts to account for the newly created one
              //Making sure LWC saves after clone
              LightningWebCompFactory.isDeploymentPending = true;
            }
          },
          function (err) {
            $log.debug("bad clone ", err);
            modalScope.layoutSaving = false;
          }
        );
      };
      modal = $modal({
        title: title,
        templateUrl: "LayoutCloneModal.tpl.html",
        show: false,
        html: true,
        contentTemplate: false,
        scope: modalScope
      });

      modal.$promise.then(modal.show);
    };

    function without(obj, keys) {
      if (!obj) {
        return null;
      }
      return Object.keys(obj)
        .filter(function (key) {
          return keys.indexOf(key) === -1;
        })
        .reduce(function (result, key) {
          result[key] = obj[key];
          return result;
        }, {});
    }

    var saveTimeoutToken = null;
    $scope.$watch(
      function () {
        return without($rootScope.layout, ["saving"]);
      },
      function (newValue, oldValue) {
        var isSameLayout = _.isEqual(newValue, oldValue); //use lodash for deep check
        var allowedToSave,
          oldActive = oldValue
            ? oldValue.createNewLayout
              ? false
              : oldValue[$rootScope.nsPrefix + "Active__c"]
            : false,
          newActive = newValue
            ? newValue.createNewLayout
              ? false
              : newValue[$rootScope.nsPrefix + "Active__c"]
            : false;

        if (saveTimeoutToken) {
          $timeout.cancel(saveTimeoutToken);
        }
        //to save a layout it must be inactive or its active flag being toggled
        var allowedToSave =
          newActive != oldActive ||
          newActive === false ||
          $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].bypassSave;
        if (!isSameLayout && allowedToSave && !$rootScope.newLayout) {
          saveTimeoutToken = $timeout(function () {
            SaveFactory.save(
              $rootScope.layout,
              $rootScope.layoutCards,
              true
            ).then(
              function (layout) {
                //saving lwc only after layout is successfully saved
                if (!(layout.errors && layout.errors.length > 0)) {
                  $log.debug("Triggered Layout LWC SAVE", layout.Name);
                  $scope.createLwc(layout, "layout");
                }
              },
              function (err) {
                $log.debug(err);
              }
            );
          }, 1000);
        }
      },
      true
    );

    $scope.toggleActivateLayout = function () {
      if ($rootScope.layout[$rootScope.nsPrefix + "Active__c"]) {
        remoteActions
          .getLayout("Id", $rootScope.layout.Id)
          .then(function (activeLayout) {
            if (activeLayout && activeLayout.length > 0) {
              activeLayout = activeLayout[0];
              if (
                activeLayout[$rootScope.nsPrefix + "Version__c"] !==
                $rootScope.layout[$rootScope.nsPrefix + "Version__c"]
              ) {
                activeLayout[$rootScope.nsPrefix + "Active__c"] = false;
                SaveFactory.save(activeLayout, null, true);
              }
            }
            $rootScope.layout[$rootScope.nsPrefix + "Active__c"] = true;
            $rootScope.layoutActive =
              $rootScope.layout[$rootScope.nsPrefix + "Active__c"];
          });
        //Updating component name when activated.
        $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].componentName = LightningWebCompFactory.convertNameToValidLWCCase(LightningWebCompFactory.DEFAULT_LWC_PREFIX + $rootScope.layout.Name)
        LightningWebCompFactory.isDeploymentPending = true;
      } else {
        $scope.createLwc($rootScope.layout, "layout", true);
      }
    };

    $scope.toggleEnableLwc = function () {
      //if True then create LWC..
      //if false delete all rela
      var isLwc = $rootScope.layout[$rootScope.nsPrefix + "Definition__c"]
        .enableLwc
        ? true
        : false;
      $scope.cardNeedsToDeactivated = [];
      $rootScope.isCardActive = false;
      $rootScope.layoutCards.forEach(function (card) {
        if (card[$rootScope.nsPrefix + "Active__c"]) {
          angular.forEach(card[$rootScope.nsPrefix + "Definition__c"].states, function (state) {
            if (!state.lwc) {
              $scope.cardNeedsToDeactivated.push(card.Name);
            }
          });
          if ($scope.cardNeedsToDeactivated.length > 0) {
            $rootScope.isCardActive = true;
            $rootScope.layout[
              $rootScope.nsPrefix + "Definition__c"
            ].enableLwc = !isLwc;
          }
          return;
        }
      });

      if (!isLwc) {
        if ($scope.displayAlert) {
          $scope.displayAlert.destroy();
        }
      }

      // Once we switch the layout lwc state updated all cards with that state
      isLwc = $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].enableLwc;
      $rootScope.layoutCards.forEach(card => {
        card[$rootScope.nsPrefix + "Definition__c"].enableLwc = isLwc;
      })

    };

    $scope.addSessionVars = function () {
      $rootScope.layout[$rootScope.nsPrefix + "Definition__c"]["sessionVars"] =
        $rootScope.layout[$rootScope.nsPrefix + "Definition__c"][
        "sessionVars"
        ] || [];
      $rootScope.layout[$rootScope.nsPrefix + "Definition__c"][
        "sessionVars"
      ].push({ name: "", val: "" });
    };

    $scope.removeSessionVar = function (index) {
      $log.debug("removing session variables");
      $rootScope.layout[$rootScope.nsPrefix + "Definition__c"][
        "sessionVars"
      ].splice(index, 1);
      //evaluate here for testing purposes
    };

    $scope.addMetatags = function () {
      $rootScope.layout[$rootScope.nsPrefix + "Definition__c"]["metatagVars"] =
        $rootScope.layout[$rootScope.nsPrefix + "Definition__c"][
        "metatagVars"
        ] || [];
      $rootScope.layout[$rootScope.nsPrefix + "Definition__c"][
        "metatagVars"
      ].push({ name: "", val: "" });
    };

    $scope.removeMetatag = function (index) {
      $log.debug("removing metatag variables");
      $rootScope.layout[$rootScope.nsPrefix + "Definition__c"][
        "metatagVars"
      ].splice(index, 1);
      //evaluate here for testing purposes
    };

    $scope.updateMetatag = function (name) {
      var metaObj = { name: name };
      var index = _.findIndex(
        $rootScope.layout[$rootScope.nsPrefix + "Definition__c"]["metatagVars"],
        metaObj
      );
      var lastIndex = _.findLastIndex(
        $rootScope.layout[$rootScope.nsPrefix + "Definition__c"]["metatagVars"],
        metaObj
      );
      if (index !== -1 && index !== lastIndex) {
        $rootScope.layout[$rootScope.nsPrefix + "Definition__c"][
          "metatagVars"
        ].splice(index, 1);
      }
    };

    $scope.showJsonEditor = function () {
      var layout = $rootScope.layout;
      var json = angular.copy(layout[$rootScope.nsPrefix + "Definition__c"]);
      var cachedCards = json.Cards;
      delete json.Cards;
      var modal = $modal({
        title: "Edit Layout JSON",
        content: angular.toJson(json, true),
        templateUrl: "EditJsonModal.tpl.html",
        show: false,
        html: true,
        controller: function ($scope) {
          $scope.jsonAsText = $scope.content.$$unwrapTrustedValue();
          $scope.onJsonChange = function (jsonAsText) {
            $scope.jsonAsText = jsonAsText;
            try {
              JSON.parse(jsonAsText);
              $scope.isInvalid = false;
            } catch (e) {
              $scope.isInvalid = true;
            }
          };
          $scope.save = function () {
            var newDefinition = JSON.parse($scope.jsonAsText);
            newDefinition.Cards = cachedCards;
            layout[$rootScope.nsPrefix + "Definition__c"] = newDefinition;
          };
        }
      });
      modal.$promise.then(modal.show).then(function (done) {
        $log.debug(done);
      });
    };

    let getMetadata = function () {
      return new Promise(function (resolve, reject) {
        if (!$rootScope.layout[$rootScope.nsPrefix + "Definition__c"].xmlObject) {
          //   load the data for the xml from the metadata and tgen show the modal with the new data
          let layout = $rootScope.layout;
          let lwcName = LightningWebCompFactory.convertNameToValidLWCCase(LightningWebCompFactory.DEFAULT_LWC_PREFIX + layout.Name);
          // let layoutLwc = _.find($rootScope.lightningwebcomponents, { DeveloperName: lwcName });
          if (!layout[$rootScope.nsPrefix + "Active__c"]) {
            lwcName =
              lwcName +
              "_" +
              layout[$rootScope.nsPrefix + "Version__c"] +
              "_" +
              layout[$rootScope.nsPrefix + "Author__c"];
            lwcName = LightningWebCompFactory.convertNameToValidLWCCase(lwcName);
          }
          let layoutLwc = _.find($rootScope.lightningwebcomponents, {
            DeveloperName: lwcName
          });
          // we have the ID in layoutLwc.Id
          remoteActions
            .getLWCMetaDataByBundleId(layoutLwc.Id)
            .then(function (data) {
              let metaObject = data.records[0].Metadata;
              delete metaObject.lwcResources;
              if (metaObject.targets && metaObject.targets.target) metaObject.targets = LightningWebCompFactory.getNameAndTarget(metaObject.targets.target);
              $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].xmlObject = metaObject;
              LightningWebCompFactory.setXmlObject("", "", metaObject);
              resolve();
            }).catch(function (err) {
              reject(err);
            });
        } else {
          resolve()
        }

      })
    }

    $scope.showXmlInterface = function () {

      getMetadata()
        .then(function (success) {
          let modal = $modal({
            title: "Lwc Metadata Configuration",
            templateUrl: "XmlInterfaceDesigner.tpl.html",
            show: false,
            html: true,
            scope: $scope,
            backdrop: 'static',
            controller: "xmlInterfaceDesignController"
          });
          modal.$promise.then(modal.show).then(function (done) {
            $log.debug(done);
          });
        })
        .catch(function (error) {
          // handle if throws error
        });
    };
  });

},{}],7:[function(require,module,exports){
angular.module('carddesigner')
    .controller('statesController', function ($scope, $rootScope, $modal, $localizable, $q, helpNode, $interpolate, $log) {
        'use strict';
        var DEFAULT_TEMPLATE_URL = '/apex/' + $rootScope.nsPrefix + 'UITemplateDesigner?name=';
        var DEACTIVE_TEMPLATE_URL = '/apex/' + $rootScope.nsPrefix + 'TemplateHome?search=';
        $scope.states = [];
        $scope.availablePlaceholders = {};
        $scope.card = null;
        $scope.stateFields = [];
        $scope.placeholderTypes = [];
        $scope.newCustomField = { name: 'NewField', label: 'New Field*', type: 'string' };
        $scope.newCondition = { 'field': '', 'operator': '===', 'value': '', 'type': 'custom' };
        $scope.actionsList = [];
        $scope.sOptions = [];
        //Documentation
        $scope.helpNode = helpNode;

        $scope.conditionOperators = [
            { 'name': '=', 'value': '==' },
            { 'name': '!=', 'value': '!=' },
            { 'name': '<', 'value': '<' },
            { 'name': '>', 'value': '>' },
            { 'name': '>=', 'value': '>=' },
            { 'name': '<=', 'value': '<=' }
        ];

        $scope.pageReferenceType = ["App", "Login", "Component", "Knowledge Article", "Object", "Record", "Record Relationship", "Named Page", "Navigation Item", "Web Page", "Community Named Page"];

        $scope.logicalOperators = [
            { 'name': 'AND', 'value': '&&' },
            { 'name': 'OR', 'value': '||' }
        ];

        $scope.dataTypes = [
            { 'name': 'Currency', 'value': 'currency', 'fieldType': 'Standard Types' },
            { 'name': 'Date', 'value': 'date', 'fieldType': 'Standard Types' },
            { 'name': 'DateTime', 'value': 'datetime', 'fieldType': 'Standard Types' },
            { 'name': 'Percentage', 'value': 'percentage', 'fieldType': 'Standard Types' },
            { 'name': 'Phone', 'value': 'phone', 'fieldType': 'Standard Types' },
            { 'name': 'String', 'value': 'string', 'fieldType': 'Standard Types' },
            { 'name': 'Address', 'value': 'address', 'fieldType': 'Standard Types' }
        ];

        var bsOptions = [
            '$root.vlocity.userId',
            '$root.vlocity.userAnLocale',
            '$root.vlocity.userSfLocale',
            '$root.vlocity.userCurrency',
            '$root.vlocity.userLanguage',
            '$root.vlocity.userTimeZone',
            '$root.vlocity.userName',
            '$root.vlocity.userType',
            '$root.vlocity.userRole',
            '$root.vlocity.userProfileName',
            '$root.vlocity.userProfileId',
            '$root.vlocity.userAccountId',
            '$root.vlocity.userContactId'
        ];

        $rootScope.$on('activeCardSet', function (event, newActiveCard) {
            $scope.states = newActiveCard && newActiveCard[$rootScope.nsPrefix + 'Definition__c'].states;
            if (!$scope.states && newActiveCard) {
                $scope.states = newActiveCard[$rootScope.nsPrefix + 'Definition__c'].states = [];
            }

            //ran to include conditions in old states
            angular.forEach($scope.states, function (state) {
                if (!state.conditions.group) {
                    state.conditions.group = [];
                    if (state.filter && state.filter.indexOf('active') > -1) { //active state
                        state.conditions.group.push({ 'field': '$scope.data.status', 'operator': '===', 'value': '\'active\'', 'type': 'system' });
                        state.blankStateCheck = false;
                    } else if (state.filter && state.filter.indexOf('non-existent') > -1) {
                        state.conditions.group.push({ 'field': '$scope.data.status', 'operator': '===', 'value': '\'non-existent\'', 'type': 'system' });
                        state.blankStateCheck = true;
                    } else {
                        //fallback for old states if filter is not there
                        state.conditions.group.push({ 'field': '$scope.data.status', 'operator': '===', 'value': '\'active\'', 'type': 'system' });
                        state.blankStateCheck = false;
                    }
                }
            });
            $scope.card = newActiveCard;
            $scope.reloadFieldSet('CardData');
        });

        $rootScope.$on('FetchedCardsData', function () {
            $scope.reloadFieldSet('CardData');
        });

        $rootScope.$on('FetchedLayoutData', function () {
            $scope.reloadFieldSet('LayoutData');
        });

        $scope.setId = function (state, field, index) {
            if (state) {
                state = state.replace(/\s+/g, '-').toLowerCase();
                if (index != undefined)
                    var str = state + '-' + field + '-' + index;
                else
                    var str = state + '-' + field;
                return str;
            }
        }

        $scope.getShowObjectList = function () {
            var layoutHasSOQLDS = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].dataSource ? $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].dataSource.type === 'Query' ? true : false : false;
            var cardHasSOQLDS = $scope.card[$rootScope.nsPrefix + 'Definition__c'].dataSource ? $scope.card[$rootScope.nsPrefix + 'Definition__c'].dataSource.type === 'Query' ? true : false : false;
            $scope.soqlDataSourceFlag = (layoutHasSOQLDS && !$scope.card[$rootScope.nsPrefix + 'Definition__c'].dataSource) || cardHasSOQLDS;
            return $scope.soqlDataSourceFlag;
        };

        $scope.reloadFieldSet = function (type) {
            var newCustomField = { name: '<<Custom Field>>', label: '<<Custom Field>>', displayLabel: '<<Custom Field>>', type: 'string', fieldType: 'custom' };

            // if there is at least one card
            if ($scope.card) {

                var uniqueCardKeyUsingId = $scope.card.Id;
                var uniqueCardKeyUsingAngularHashKey = 'newCardWithHashKey-' + $scope.card.$$hashKey;

                if (type === 'CardData') {

                    // card fields are loaded (for either new card or existing card)
                    if (!!$rootScope.fieldsFromCards[uniqueCardKeyUsingAngularHashKey] ||
                        !!$rootScope.fieldsFromCards[uniqueCardKeyUsingId]) {

                        // card is new and dataSource.js has retrieved its data source fields
                        // and stored it inside $rootScope.fieldsFromCards with angular hashKey as key (name of property)
                        if (!!$rootScope.fieldsFromCards[uniqueCardKeyUsingId]) {
                            $scope.stateFields = angular.copy($rootScope.fieldGroupsFromCards[uniqueCardKeyUsingId].concat(angular.copy($rootScope.fieldsFromCards[uniqueCardKeyUsingId])));
                            // card is NOT new and dataSource.js has retrieved its data source fields
                            // and stored it inside $rootScope.fieldsFromCards with card Id as key (name of property)
                        } else {
                            $scope.stateFields = angular.copy($rootScope.fieldGroupsFromCards[uniqueCardKeyUsingAngularHashKey].concat(angular.copy($rootScope.fieldsFromCards[uniqueCardKeyUsingAngularHashKey])));
                        }

                        // if card is brand new BUT dataSource.js has NOT retrieved its data source fields yet
                    } else {

                        // if dataSource.js already loaded layout data
                        if ($rootScope.fieldsFromLayout) {

                            $scope.stateFields = angular.copy($rootScope.fieldGroupsFromLayout.concat(angular.copy($rootScope.fieldsFromLayout)));

                        }

                    }

                } else if (type === 'LayoutData') {

                    // dataSource.js already loaded card data source fields
                    if ((!!$rootScope.fieldsFromCards[uniqueCardKeyUsingAngularHashKey] && $rootScope.fieldsFromCards[uniqueCardKeyUsingAngularHashKey].length > 0) ||
                        (!!$rootScope.fieldsFromCards[uniqueCardKeyUsingId] && $rootScope.fieldsFromCards[uniqueCardKeyUsingId].length > 0) && $scope.card[$rootScope.nsPrefix + 'Definition__c'].dataSource.type) {

                        // card is new and dataSource.js has retrieved its data source fields
                        // and stored it inside $rootScope.fieldsFromCards with angular hashKey as key (name of property)
                        if (!!$rootScope.fieldsFromCards[uniqueCardKeyUsingId]) {
                            $scope.stateFields = angular.copy($rootScope.fieldGroupsFromCards[uniqueCardKeyUsingId].concat(angular.copy($rootScope.fieldsFromCards[uniqueCardKeyUsingId])));
                            // card is NOT new and dataSource.js has retrieved its data source fields
                            // and stored it inside $rootScope.fieldsFromCards with card Id as key (name of property)
                        } else {
                            $scope.stateFields = angular.copy($rootScope.fieldGroupsFromCards[uniqueCardKeyUsingAngularHashKey].concat(angular.copy($rootScope.fieldsFromCards[uniqueCardKeyUsingAngularHashKey])));
                        }

                        // BUT either card has no data source or dataSource.js has NOT yet retrieve the card data source fields
                    } else {

                        // if dataSource.js has loaded layout data source fields
                        if ($rootScope.fieldsFromLayout) {

                            $scope.stateFields = $scope.stateFields = angular.copy($rootScope.fieldGroupsFromLayout.concat(angular.copy($rootScope.fieldsFromLayout)));

                        }

                    }

                }

                // if there is no card
            } else {

                if (type === 'LayoutData') {

                    // if dataSource.js has loaded layout data source fields:
                    if ($rootScope.fieldsFromLayout) {

                        $scope.stateFields = $scope.stateFields = angular.copy($rootScope.fieldGroupsFromLayout.concat(angular.copy($rootScope.fieldsFromLayout)));

                    }

                }

            }

            //Add custom field option
            $scope.placeholderTypes = $scope.dataTypes.concat($scope.stateFields.map(function (item, index) {
                return { 'name': item.name, 'value': item.name, 'fieldType': 'Custom Properties' };
            }));
            $scope.stateFields.push(newCustomField);

        };

        $scope.isCustomfield = function (field) {
            return field && field.fieldType && field.fieldType.toLowerCase() === 'custom';
        };

        $scope.setDraggable = function (elemId, state) {
            //had to use timeout in order to wait for the element to exist
            setTimeout(function () {
                angular.element('#' + elemId).attr('draggable', state.collapse);
            }, 100);

        };

        $scope.onDNDMove = function () {
            return true;
        };

        $scope.dropStateCallback = function (event, droppedAtindex, item, external, type, allowedType) {
            $log.debug('dropped at: ', event, droppedAtindex, item, external, type, allowedType);
            var states = $scope.states;

            var itemOriginalIndex;
            for (var i = 0; i <= states.length; i++) {
                if (item.name === states[i].name) {
                    itemOriginalIndex = i;
                    break;
                }
            }
            // the root cause of the dnd-list drag and drop incurrate move problem was due to the item
            // being moved was still in the array of items.  Therefore, the solution is to detect the
            // moved item's original index and splice it off the array of items
            $scope.states.splice(itemOriginalIndex, 1);

            return item;
        };

        $scope.dropFieldCallback = function (event, droppedAtindex, item, external, type, allowedType, parentState) {
            console.log('dropped at: ', event, droppedAtindex, item, external, type, allowedType, parentState);
            var fields = parentState.fields;

            var itemOriginalIndex;
            for (var i = 0; i <= fields.length; i++) {
                if (item.name === fields[i].name) {
                    itemOriginalIndex = i;
                    break;
                }
            }
            // the root cause of the dnd-list drag and drop incurrate move problem was due to the item
            // being moved was still in the array of items.  Therefore, the solution is to detect the
            // moved item's original index and splice it off the array of items
            parentState.fields.splice(itemOriginalIndex, 1);

            return item;
        };

        $scope.dropActionCallback = function (event, droppedAtindex, item, external, type, allowedType, parentState) {
            console.log('dropped at: ', event, droppedAtindex, item, external, type, allowedType, parentState);
            var actions = parentState.definedActions.actions;

            var itemOriginalIndex;
            for (var i = 0; i <= actions.length; i++) {
                if (item.id === actions[i].id) {
                    itemOriginalIndex = i;
                    break;
                }
            }
            // the root cause of the dnd-list drag and drop incurrate move problem was due to the item
            // being moved was still in the array of items.  Therefore, the solution is to detect the
            // moved item's original index and splice it off the array of items
            parentState.definedActions.actions.splice(itemOriginalIndex, 1);

            return item;
        };

        $scope.onStateClick = function (state) {
            $scope.activeState = state;
        };

        $scope.clone = function (state) {
            $scope.states.push(angular.copy(state));
        };

        $scope.delete = function (objToDelete, objType, stateObj) {
            var modalScope;
            $scope.activeState = stateObj;

            if (objType === 'state') {
                modalScope = $scope.$new();

                $q.all([
                    $localizable('ConfirmDeletionTitle', 'Confirm deletion'),
                    $localizable('ConfirmStateDeleteContent', 'Are you sure you want to delete this state?')
                ]).then(function (labels) {
                    $modal({
                        title: labels[0],
                        templateUrl: 'CardConfirmationModal.tpl.html',
                        content: labels[1],
                        scope: modalScope,
                        show: true
                    });

                })

                modalScope.objType = objType;
                modalScope.ok = function () {
                    $scope.states = $scope.states.filter(function (state) {
                        return state !== objToDelete;
                    });
                    $scope.card[$rootScope.nsPrefix + 'Definition__c'].states = $scope.states;

                    //Update the local cache of cards so that once the state is deleted, cached card is updated for re-use
                    $rootScope.cards.forEach(function (card) {
                        if (card.Name === $scope.card.Name) {
                            if (typeof card[$rootScope.nsPrefix + 'Definition__c'] === 'string') {
                                card[$rootScope.nsPrefix + 'Definition__c'] = JSON.parse(card[$rootScope.nsPrefix + 'Definition__c']);
                            }
                            card[$rootScope.nsPrefix + 'Definition__c'].states = $scope.states;
                            card[$rootScope.nsPrefix + 'Definition__c'] = JSON.stringify(card[$rootScope.nsPrefix + 'Definition__c']);
                        }
                    });

                };
            } else if (objType === 'field') {
                $scope.activeState.fields = $scope.activeState.fields.filter(function (field) {
                    return field !== objToDelete;
                });
            } else if (objType === 'action') {
                $scope.activeState.definedActions.actions = $scope.activeState.definedActions.actions.filter(function (action) {
                    return action !== objToDelete;
                });
            } else if (objType === 'placeholder') {
                $scope.activeState.placeholders = $scope.activeState.placeholders.filter(function (placeholder) {
                    return placeholder !== objToDelete;
                });
            }
        };

        $scope.changeTemplate = function (state) {
            if (state.templateUrl && !$rootScope.layout[$rootScope.nsPrefix + "Definition__c"].enableLwc) {
                state.templateUrl = state.templateUrl.Name || state.templateUrl;
                $log.debug('changed template for state ', state);
                if ($scope.availablePlaceholders[selTemplate]) {
                    return;
                }

                var selTemplate = state.templateUrl;
                $log.debug('selected template ', selTemplate, $rootScope.templatesMap[selTemplate]);

                //smart template
                if ($rootScope.templatesMap[selTemplate] && $rootScope.templatesMap[selTemplate][$rootScope.nsPrefix + 'Definition__c']) {
                    if ($rootScope.templatesMap[selTemplate][$rootScope.nsPrefix + 'Definition__c']['placeholders']) {
                        $log.debug('adding placeholders ', $rootScope.templatesMap[selTemplate][$rootScope.nsPrefix + 'Definition__c']['placeholders']);
                        $scope.availablePlaceholders[selTemplate] = $rootScope.templatesMap[selTemplate][$rootScope.nsPrefix + 'Definition__c']['placeholders'];
                    }

                    state.placeholders = state.placeholders || [];
                } else {
                    //delete $scope.availablePlaceholders[selTemplate];
                }
            } else {
                delete state.placeholders;
            }
        };

        $scope.addPlaceholder = function (state, selectedPlaceholder) {
            var newPlaceholder = { name: selectedPlaceholder, value: '', type: 'string', label: '' };
            if (selectedPlaceholder) {
                state.placeholders = state.placeholders || [];
                state.placeholders.push(angular.copy(newPlaceholder));
            }
        };

        $scope.addState = function () {
            var newStateObj = {
                'fields': [],
                'conditions': {
                    'group': [{ 'field': '$scope.data.status', 'operator': '===', 'value': '\'active\'', 'type': 'system' }]
                },
                'definedActions': {
                    'actions': []
                }
            };
            $scope.card[$rootScope.nsPrefix + 'Definition__c'].states.push(newStateObj);
        };

        $scope.addStateField = function (selectedField, state) {
            $log.debug(selectedField);
            $scope.onStateClick(state);
            if (selectedField) {
                var newField = angular.copy(selectedField);
                if (newField.group !== 'Custom Fields') {
                    newField.label = newField.label.replace('][', ' ').replace(/[\[\]\']*/g, '').replace('__c', '').replace($rootScope.nsPrefix, '');
                }
                $scope.activeState.fields.push(newField);
            }
        };

        $scope.addCustomField = function () {
            var newField = { name: 'NewField', label: 'New Field*', type: 'string' };
            $scope.activeState.fields.push(angular.copy(newField));
        };

        $scope.addStateAction = function (selectedAction, state) {
            var actionObj;
            //setting active state if is not set
            $scope.onStateClick(state);
            //Dont use actual action id's, it's specific to org.
            //Instead using the Action Name
            if (selectedAction) {
                actionObj = {
                    'type': 'Vlocity Action',
                    'id': selectedAction.Name,
                    'displayName': selectedAction[$rootScope.nsPrefix + 'DisplayLabel__c'],
                    'iconName': selectedAction[$rootScope.nsPrefix + 'VlocityIcon__c'] ? selectedAction[$rootScope.nsPrefix + 'VlocityIcon__c'] : ""
                };
                if (selectedAction[$rootScope.nsPrefix + 'InvokeClassName__c']) {
                    actionObj[$rootScope.nsPrefix + 'InvokeClassName__c'] = selectedAction[$rootScope.nsPrefix + 'InvokeClassName__c'];
                    actionObj[$rootScope.nsPrefix + 'InvokeMethodName__c'] = selectedAction[$rootScope.nsPrefix + 'InvokeMethodName__c'];
                }
                $scope.activeState.definedActions.actions.push(actionObj);
            }
        };

        $scope.addStateCustomAction = function (stateObj) {
            var customAction = {
                id: 'Custom Action',
                displayName: 'Custom Action',
                type: 'Custom',
                url: '/apex/',
                isCustomAction: true
            };
            //setting active state if is not set
            $scope.activeState = $scope.activeState || stateObj;
            $scope.activeState.definedActions.actions.push(customAction);
        };

        $scope.addStateOmniScriptAction = function (stateObj) {
            var customAction = {
                id: 'OmniScript',
                displayName: 'OmniScript',
                type: 'OmniScript',
                omniType: '',
                omniSubType: '',
                omniLang: '',
                isCustomAction: true
            };
            //setting active state if is not set
            $scope.activeState = $scope.activeState || stateObj;
            $scope.activeState.definedActions.actions.push(customAction);
        };

        $scope.addStatePubSubAction = function (stateObj) {
            var customAction = {
                id: 'PubSub Action',
                displayName: 'PubSub Action',
                type: 'PubSub',
                eventName: '',
                message: '',
                isCustomAction: true
            };
            //setting active state if is not set
            $scope.activeState = $scope.activeState || stateObj;
            $scope.activeState.definedActions.actions.push(customAction);
        };
        $scope.addExtraParams = function (action) {
            action.extraParams = action.extraParams || [];
            action.extraParams.push({ name: '', val: '' });
        };

        function KeyValuePair(key, value, sourceMap, parent) {
            this.key = this.previousKey = key;
            this.value = value;
            this.sourceMap = sourceMap ? sourceMap : {};
            this.parent = parent;
        }

        KeyValuePair.prototype.update = function (mapName) {
            if (this.key !== this.previousKey) {
                delete this.sourceMap[this.previousKey];
                delete this.parent.$$cacheCustomDataMap[mapName][this.previousKey];
                this.previousKey = this.key;
            }

            //Need to convert string true/false to boolean CARD-1325
            this.value = this.value.toLowerCase() === 'true' ? true : (this.value.toLowerCase() === 'false' ? false : this.value);

            this.sourceMap[this.key] = this.value;
            this.parent.$$cacheCustomDataMap[mapName][this.key] = this;
        };

        $scope.setPageRefObj = function (action, index) {
            let pageRefType = action.targetType;
            if (!action[pageRefType]) {
                action[pageRefType] = {
                    targetType: pageRefType
                };
            }
        }

        $scope.propertySet = function (sourceMap, mapName, parent) {
            if (!parent.$$cacheCustomDataMap) {
                parent.$$cacheCustomDataMap = {};
                parent.$$cacheCustomDataMap[mapName] = {};
            }
            parent.$$cacheCustomDataMap[mapName] = parent.$$cacheCustomDataMap[mapName] || {};

            if (!sourceMap) {
                sourceMap = {};
            }
            if (sourceMap) {
                return Object.keys(sourceMap).filter(function (key) {
                    return true;
                }).map(function (key) {
                    if (!parent.$$cacheCustomDataMap[mapName][key]) {
                        parent.$$cacheCustomDataMap[mapName][key] = new KeyValuePair(key, sourceMap[key], sourceMap, parent);
                    }
                    return parent.$$cacheCustomDataMap[mapName][key];
                });
            }
            return [];
        };

        $scope.removeMapProperty = function (sourceMap, propName) {
            if (sourceMap) {
                delete sourceMap[propName];
            }
        };

        $scope.addMapProperty = function (sourceMap, mapName, parent) {
            if (!sourceMap) {
                sourceMap = {};
            }
            if (!parent[mapName]) {
                parent[mapName] = {};
            }
            parent.$$cacheCustomDataMap[mapName] = parent.$$cacheCustomDataMap[mapName] || {};

            parent.$$cacheCustomDataMap[mapName][''] = new KeyValuePair('', '', sourceMap, parent);
            parent.$$cacheCustomDataMap[mapName][''].update(mapName);

            sourceMap[''] = new KeyValuePair('', '', parent[mapName], parent);
            sourceMap[''].update(mapName);
        };

        $scope.blankStateCheck = function (state) {
            angular.forEach(state.conditions.group, function (condition) {
                if (condition.type === 'system') { //condition is the status condition
                    condition.value = state.blankCardState ? '\'non-existent\'' : '\'active\'';
                }
            });
            $scope.evalConditions(state, state.conditions.group); //evaluate conditions after checking box

            $scope.actionCtxIdCheck(state);
        };

        $scope.actionCtxIdCheck = function (state) {
            if (!state.blankCardState) {
                $scope.sOptions = $scope.stateFields;
                delete state.isActionCtxId;
            } else {
                var sessionVars = _.union(
                    _.map(angular.copy($scope.layout[$rootScope.nsPrefix + 'Definition__c'].sessionVars), function (item) {
                        item.name = "$parent.session." + item.name; return item;
                    }),
                    _.map(angular.copy($scope.card[$rootScope.nsPrefix + 'Definition__c'].sessionVars), function (item) {
                        item.name = "session." + item.name; return item;
                    })
                );


                $scope.bsOptions = _.union(_.map(bsOptions, function (item) { return { name: item }; }), sessionVars);
                //For custom field
                $scope.bsOptions.push({ name: '<<Custom Field>>', label: '<<Custom Field>>' });
            }
            if (state.blankCardState && !state.isActionCtxId && state.actionCtxId) {
                delete state.actionCtxId;
            }
        };

        $scope.editModeToggle = function (state) {
            angular.forEach(state.conditions.group, function (condition) {
                if (condition.type === 'system') { //condition is the status condition
                    condition.value = state.editMode ? '\'edit-mode\'' : 'active';
                }
            });
            $log.debug(state);
            $scope.evalConditions(state, state.conditions.group); //evaluate conditions after checking box
        };

        $scope.customLwcToggle = function (state) {
            state.customLwcRepeat = true;
        }

        $scope.addCustomLwcAttributes = function (state) {
            state.customLwcAttributes = state.customLwcAttributes || [];
            state.customLwcAttributes.push({ 'name': '', 'val': '' });
        };

        $scope.removeCustomLwcAttributes = function (index, state) {
            $log.debug('removing lwc attributes variables');
            state.customLwcAttributes.splice(index, 1);
        };

        $scope.addFlyoutAttributes = function (state) {
            state.flyoutAttributes = state.flyoutAttributes || [];
            state.flyoutAttributes.push({ 'name': '', 'val': '' });
        };

        $scope.removeFlyoutAttributes = function (index, state) {
            $log.debug('removing lwc attributes variables');
            state.flyoutAttributes.splice(index, 1);
        };

        var addAdditionalConditionParams = function (conditionGroup, group, condition) {
            if (conditionGroup.group === group && group.length >= 1) {
                condition.logicalOperator = '&&';
            } else if (conditionGroup.group !== group && group.length > 0) {
                condition.logicalOperator = '&&';
            }
            return condition;
        };

        $scope.addCondition = function (state, group) {
            var cond = angular.copy($scope.newCondition);
            cond = addAdditionalConditionParams(state.conditions, group, cond);
            group.push(cond);
        };

        $scope.addGroup = function (state, group) {
            var cond = {
                'group': []
            };
            //Add a empty condition in a new group
            $scope.addCondition(state, cond.group);
            cond = addAdditionalConditionParams(state.conditions, group, cond);
            group.push(cond);
        };

        $scope.deleteRule = function (state, rule, ruleSet) {
            for (var i = 0; i < ruleSet.length; i++) {
                if (ruleSet[i] === rule) {
                    ruleSet.splice(i, 1);
                    break;
                } else if (ruleSet[i].group) {
                    $scope.deleteRule(state, rule, ruleSet[i].group);
                }
            }
            $scope.evalConditions(state, state.conditions.group);
        };

        $scope.deleteGroup = function (state, group, ruleset) {
            $scope.deleteRule(state, group, ruleset);
        };

        //To support older conditions without grouping
        $scope.initConditions = function (state) {
            var conditionGroup = { group: [] };
            if (state.conditions && state.conditions.group && state.conditions.group.length === 1) {
                conditionGroup.group = angular.copy(state.conditions.group);
                angular.forEach(state.conditions, function (condition, index) {
                    if (condition.type !== 'system' && index !== 'group') {
                        condition = addAdditionalConditionParams(conditionGroup, conditionGroup.group, condition);
                        conditionGroup.group.push(condition);
                    }
                });
                state.conditions = conditionGroup;
            }
            state.conditions = state.conditions ? state.conditions : conditionGroup;
        };

        $scope.evalConditions = function (state, group) {
            state.filter = ''; //clear state filter
            $scope.evalMultipleConditions(state, group);
        };

        $scope.evalMultipleConditions = function (state, group) {
            var conditionErr = false;
            angular.forEach(group, function (condition, index) {
                if (condition.group) {
                    if (condition.logicalOperator) {
                        state.filter += ' ' + condition.logicalOperator + ' (';
                        $scope.evalMultipleConditions(state, condition.group);
                        state.filter += ')';
                    } else {
                        $scope.evalMultipleConditions(state, condition.group);
                    }
                }
                else if (condition.field && condition.value) {
                    state.filter += index > 0 ? ' ' + condition.logicalOperator + ' ' : ''; //add logical operator
                    //take into account dot or bracket notation
                    var scopeConditionField = condition.field.charAt(0) === '[' ? '$scope.obj' + condition.field : '$scope.obj.' + condition.field;
                    var conditionField = condition.field.indexOf('$scope') > -1 ? condition.field : scopeConditionField;
                    state.filter += conditionField + ' ' + condition.operator + ' ' + validateStateFilterValue(condition.value);
                } else {
                    conditionErr = true;
                }
            });
            state.disableAddCondition = conditionErr; //disable button if there is a condition that needs fixing
        };

        var validateStateFilterValue = function (str) {
            // To ignore below value to be converted into string while saving states.
            var validationObj = {
                "null": null,
                "undefined": undefined,
                "true": true,
                "false": false,
                "scope.*": ''
            }
            var re = /^((null|undefined|true|false)$|scope\.)/gi;

            if (re.test(str)) {
                return str.replace(re, function (matched) {
                    return validationObj[matched.toLowerCase()] ? validationObj[matched.toLowerCase()] : matched;
                });
            } else {
                if (str.length > 0 && str[0] == '\'')
                    return str;
                else
                    return '\'' + str + '\'';
            }
        };

        $scope.isStateEditable = function () {
            var isEditable = false;
            var layoutDataSourceExists, isLayoutDataSourceFetched, cardDataSourceExists, isCardDataSourceFetched;
            var uniqueCardKeyUsingId, uniqueCardKeyUsingAngularHashKey;

            //Don't block user from navigating across states if the layout is Activated
            if (!$rootScope.layout || $rootScope.layout[$rootScope.nsPrefix + 'Active__c']) {
                return true;
            }

            try {
                if ($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].dataSource) {
                    var layoutDS = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].dataSource.type === 'Query' ||
                        $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].dataSource.type === 'Search' ?
                        $rootScope.layout[$rootScope.nsPrefix + 'Datasource__c'] :
                        $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].dataSource;
                    layoutDataSourceExists = $scope.dataSourceExists(layoutDS);

                    if (layoutDataSourceExists) {
                        isLayoutDataSourceFetched = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].dataSource.type === 'Inherit' ? true : !!$rootScope.fieldsFromLayout;
                    } else {
                        isLayoutDataSourceFetched = false;
                    }
                }

                var cardDS = null;
                if ($scope.card && $scope.card[$rootScope.nsPrefix + 'Definition__c'].dataSource) {
                    cardDS = $scope.card && $scope.card[$rootScope.nsPrefix + 'Definition__c'].dataSource.type === 'Query' ||
                        $scope.card[$rootScope.nsPrefix + 'Definition__c'].dataSource.type === 'Search' ?
                        $scope.card[$rootScope.nsPrefix + 'Datasource__c'] :
                        $scope.card[$rootScope.nsPrefix + 'Definition__c'].dataSource;

                }

                cardDataSourceExists = $scope.card && cardDS && $scope.dataSourceExists(cardDS);

                if ($scope.card) {

                    // CASE 1: if the card is new (user just added), it would not have Id immediately
                    // until all required info is entered and card is stored in DB
                    if (!$scope.card.Id) {

                        uniqueCardKeyUsingAngularHashKey = 'newCardWithHashKey-' + $scope.card.$$hashKey;

                        // card is new and user already clicked "View Data" on card, so dataSource.js has retrieved its data
                        // and stored it inside $rootScope.fieldsFromCards with angular hashKey as key (name of property)
                        if (!!$rootScope.fieldsFromCards[uniqueCardKeyUsingAngularHashKey]) {

                            isCardDataSourceFetched = true;

                            // card is new BUT user has not clicked "View Data", so NO data has been retrieved
                        } else {

                            isCardDataSourceFetched = false;

                        }

                        // CASE 2: if the card existed before user added it to the layout, OR
                        // CASE 3: it is new (user just added), BUT all required info is entered and card has been stored in DB
                        //         so now the card has Id, whereas previously it did not
                    } else {

                        uniqueCardKeyUsingId = $scope.card.Id;

                        // this is CASE 2: card existed before user add it to the layout and user has already clicked "View Data"
                        // on card, so dataSource.js has retrieved its data and stored it inside $rootScope.fieldsFromCards with
                        // card Id as key (name of property)
                        if (!!$rootScope.fieldsFromCards[uniqueCardKeyUsingId]) {

                            isCardDataSourceFetched = true;

                        } else {

                            uniqueCardKeyUsingAngularHashKey = 'newCardWithHashKey-' + $scope.card.$$hashKey;

                            // CASE 3: card is new, but now it has been stored in DB, so it has Id now,
                            // whereas previously it did not.  So if user clicked "View Data" on card before it is stored in DB
                            // and hence would be given an Id, the data stored inside $rootScope.fieldsFromCards for the card
                            // is still keyed by the angular hash key
                            if (!!$rootScope.fieldsFromCards[uniqueCardKeyUsingAngularHashKey]) {

                                isCardDataSourceFetched = true;

                                // either CASE 2: card existed before BUT user has not clicked on "View Data" on the card.
                                // OR CASE 3: card is new, has been stored in DB and has Id now but user has not clicked
                                // "View Data" on card
                            } else {

                                isCardDataSourceFetched = false;

                            }

                        }

                    }

                    // Note: for a new card stored in DB with an Id (CASE 3), now if user clicks "View Data" on card again,
                    // this would become like a CASE 2: existing card with Id because dataSource.js would store the data with
                    // card Id as key
                }

                //State can be editable if the card data source
                isEditable = cardDataSourceExists ? isCardDataSourceFetched : (layoutDataSourceExists && isLayoutDataSourceFetched);

                return isEditable;

            } catch (e) {
                $log.debug('State editable check failed with data sources', e);
                return isEditable;
            }
        };

        //TBD: make a common function
        $scope.dataSourceExists = function (dataSourceObj) {
            var dataSourceExists = false;

            if (!(dataSourceObj && dataSourceObj.type && (dataSourceObj.type === 'Inherit' || dataSourceObj.value))) {
                return dataSourceExists;
            }

            switch (dataSourceObj.type) {
                case 'Query':
                    dataSourceExists = !!dataSourceObj.value.query;
                    break;
                case 'Search':
                    dataSourceExists = !!dataSourceObj.value.search;
                    break;
                case 'DataRaptor':
                    dataSourceExists = !!dataSourceObj.value.bundle;
                    break;
                case 'Dual':
                    dataSourceExists = !!dataSourceObj.value.remoteClass && !!dataSourceObj.value.endpoint;
                    break;
                case 'ApexRest':
                    dataSourceExists = !!dataSourceObj.value.endpoint;
                    break;
                case 'ApexRemote':
                    dataSourceExists = !!dataSourceObj.value.remoteClass;
                    break;
                case 'REST':
                    dataSourceExists = !!dataSourceObj.value.endpoint;
                    break;
                case 'IntegrationProcedures':
                    dataSourceExists = !!dataSourceObj.value.ipMethod;
                    break;
                case 'Custom':
                    dataSourceExists = !!dataSourceObj.value.body;
                    break;
                case 'Inherit':
                    dataSourceExists = true;
                    break;
                case 'StreamingAPI':
                    dataSourceExists = !!dataSourceObj.value.channel;
                    break;
                default:
                    $log.debug('Data Source Type did not match');
                    break;
            }
            return dataSourceExists;
        };

        $scope.getFlyoutIdForName = function (name) {
            var id = null;
            $rootScope.flyouts.forEach(function (flyout) {
                if (flyout.Name === name) {
                    id = flyout.Id;
                }
            });
            return id;
        };

        // Custom field creation //
        $scope.showCustomFieldModal = function (field, stateObj) {
            $scope.activeState = stateObj;
            $scope.activeField = field;
            var stateScope = $scope;

            var modal = $modal({
                backdrop: 'static',
                scope: stateScope,
                templateUrl: 'CustomFieldModal.tpl.html',
                show: false,
                html: true
            });

            modal.$promise.then(modal.show);
        };



        $scope.onCopyCustomProperties = function (field) {
            $scope.activeField.data = _.merge($scope.activeField.data, field.data);
        };

        //end custom field creation //

        $scope.getActionByName = function (name) {
            if ($rootScope.allActions) {
                var action = _.find($rootScope.allActions, { 'Name': name });
                return action && action.Id;
            }
        };

        $scope.isTemplateActive = function (template) {
            var hasTemplate = _.find($rootScope.templates, { Name: template });
            $scope.templateUrlPrefix = DEFAULT_TEMPLATE_URL;
            if (!hasTemplate && $rootScope.templates !== undefined) {
                $scope.templateUrlPrefix = DEACTIVE_TEMPLATE_URL;
                return true;
            }
            return false;
        };

        $scope.onChangeSalesforceObj = function (objName, state) {
            if (objName === undefined || !$rootScope.allActions) {
                return;
            }
            //storing all the possible object types in the actionsList object
            $scope.actionsList = $scope.actionsList || {};
            /*This regex test the comma seperated applicable types with particular applicable types OR with 'All' applicable types and returns true if any matches
              Helps us to identify which actions supports the selected salesforce object */
            var typesMatchRegex = new RegExp('(?:^|;)(' + objName + '|All)(?=;|$)');
            var applicableTypesKey = $rootScope.nsPrefix + 'ApplicableTypes__c';
            var linkType = $rootScope.nsPrefix + 'LinkType__c';

            //fetch actions if actions for object have not been instantiated yet
            $scope.actionsList[objName] = $scope.actionsList[objName] || $rootScope.allActions.filter(function (action) {
                return typesMatchRegex.test(action[applicableTypesKey]) && action[linkType] !== 'ConsoleCards' && action[linkType] !== 'LEXConsoleCards';
            });
        };

        /*Smart Action*/
        $scope.$watch(function () {
            return $rootScope.layout && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'] && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc;
        }, function () {
            if ($rootScope.layout) {
                if (!$rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc) {
                    angular.forEach($scope.states, function (state, index) {
                        if (state.isSmartAction) {
                            state.isSmartAction = false;
                        }
                    });
                }
            }
        });

        $scope.initSmartAction = function (state) {
            if ($rootScope.layout && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']) {
                if (!$rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc) {
                    state.isSmartAction = false;
                }
            }
            state.isSmartAction = typeof state.isSmartAction === "undefined" ? false : state.isSmartAction;
            state.smartAction = typeof state.smartAction === "undefined" ? {} : state.smartAction;
        }

    });

},{}],8:[function(require,module,exports){
angular.module('carddesigner')
    .controller('tabController', function ($rootScope, $scope, $timeout, interTabMsgBus, $localizable, $modal, helpNode, $q) {
        'use strict';
        $scope.tabs = [];
        $scope.tabs.activeTab = 0;
        $scope.tabs.previewError = false;
        $scope.currentScriptElementInPreview = null;
        $scope.viewModel = {};
        $scope.helpNode = helpNode;
        $scope.loadIframe = true;
        $scope.pendingCards = "";
        var defaultPage = [
            { label: 'Universal', page: 'ConsoleCards', group: 'Universal Pages' },
            { label: 'Sidebar', page: 'ConsoleSidebar', group: 'Universal Pages' },
            { label: 'Community', page: 'CommunityCanvas', group: 'Universal Pages' },
            { label: 'Mobile', page: 'CardMobilePreview', group: 'Universal Pages' },
            { label: 'Mobile (iPhone)', page: 'CardMobilePreview', group: 'Universal Pages' },
            { label: 'Mobile (iPad)', page: 'CardMobilePreview', group: 'Universal Pages' }
        ];
        var iframeConfig = {
            log: false,
            checkOrigin: false,
            scrolling: false,
            heightCalculationMethod: 'lowestElementNoMargin'
        };

        $scope.previewTypes = [
            { label: 'Design Time', name: 'designTime' },
            { label: 'Run Time', name: 'runTime' }
        ];

        $scope.previewModes = defaultPage;
        $scope.previewMode = defaultPage[0];

        console.log('previewMode ' + $scope.previewMode);
        var reloadPreview = true;
        var needsReload = true;

        $rootScope.$on('activeElementInCanvas', function () {
            if ($scope.tabs.activeTab !== 0) {
                $scope.tabs.activeTab = 0;
            }
        });

        $scope.$watch('layout.Id', function (id) {
            if (id && $scope.tabs.length < 2) {
                $q.all([
                    $localizable('CardDesTabStates', 'States'),
                    $localizable('Preview', 'Preview')
                ]).then(function (labels) {
                    $scope.tabs.push({
                        title: labels[0],
                        content: ''
                    });
                    $scope.tabs.push({
                        title: labels[1],
                        content: ''
                    });
                });
            }
        });

        $rootScope.$on('delete', function () {
            needsReload = true;
        });

        $rootScope.$on('saved', function (scope, obj, isLwcUpdate) {
            var reload = false;
            //If Lwc is enabled then only refresh when LWCs updates
            if ($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc) {
                if (isLwcUpdate) {
                    reload = true;
                }
            } else {
                reload = true;
            }
            if (reload) {
                needsReload = true;
                if ($scope.tabs.activeTab === 1 && reloadPreview) {
                    loadPreviewPage();
                }
            }
        });

        $rootScope.$on('deleted', function () {
            needsReload = true;
            if ($scope.tabs.activeTab === 1) {
                loadPreviewPage();
            }
        });

        $rootScope.$on('FetchedCardsData', function () {
            needsReload = true;
            if ($scope.tabs.activeTab === 1) {
                loadPreviewPage();
            }
        });

        $rootScope.$on('FetchedLayoutData', function () {
            needsReload = true;
            if ($scope.tabs.activeTab === 1) {
                loadPreviewPage();
            }
        });

        var triggeredReload = false;
        function loadPreviewPage() {
            let isLWC = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc;
            var activeCard = $rootScope.layoutCards.filter(function (obj) {
                return obj[$rootScope.nsPrefix + 'Active__c'] === true;
            })[0];
            $scope.tabs.previewError = activeCard || $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].previewType !== 'runTime' ? false : true;
            $scope.$evalAsync(function () {
                triggeredReload = true;
                var element = $('.iframe-holder');
                console.info($scope.previewMode.page);
                console.info($scope.previewMode.label);
                console.info('paramsByObj ', $rootScope.paramsByObj);
                var nsPrefix = $scope.previewMode.namespacePrefix ? $scope.previewMode.namespacePrefix + '__' : 'c__';
                nsPrefix = $scope.previewMode.group === 'Universal Pages' ? '' : nsPrefix;
                $scope.previewMode.page = isLWC ? 'LWCPreviewVFPage' : 'ConsoleCards';
                var layoutName = !isLWC ? $rootScope.layout.Name : $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].componentName;
                $scope.loadIframe = (isLWC && $rootScope.lightningwebcomponents.findIndex(x => x.DeveloperName.toLowerCase() === layoutName.toLowerCase()) > -1) || !isLWC;
                if ($scope.loadIframe) {
                    var pageUrl = '/apex/' + nsPrefix + $scope.previewMode.page +
                        '?layout=' + layoutName + '&layoutId=' + $rootScope.layout.Id + '&namespace=c' +
                        '&previewMode=' + $scope.previewMode.label + '&useCache=false' + '&isPreview=true';

                    if (!document.documentElement.classList.contains('Theme3')) {
                        pageUrl += '&isdtp=p1&sfdcIFrameOrigin=' + encodeURIComponent(window.location.protocol + '//' + window.location.hostname) + '&sfdcIFrameHost=web';
                    }
                    // this is used to Preview layout designed for Community.  loggedUserAccountId data
                    // originated from layout column context variable that is loggedUser.AccountId.
                    // Need to get accountId this way because user who is using Designer is an admin userId
                    // without contact record nor account
                    console.info('loggedUserAccountId ', $rootScope.loggedUserAccountId);
                    if ($rootScope.loggedUserAccountId) {
                        pageUrl += '&Id=' + $rootScope.loggedUserAccountId;
                    }

                    var extraParams = {};
                    angular.forEach($rootScope.paramsByObj, function (param) {
                        if (param) {
                            angular.forEach(param, function (value, key) {
                                console.info(key + ' = ' + value);
                                extraParams[key] = value;
                            });
                        }
                    });
                    angular.forEach(extraParams, function (value, key) {
                        pageUrl += '&' + key + '=' + value;
                    });
                    console.info(pageUrl);
                    element[0].innerHTML = '<iframe src="' + pageUrl + '" style="border: 0"></iframe>';
                    $scope.previewUrl = pageUrl;
                    needsReload = false;
                    var iFrames = $('.iframe-holder iframe');
                    iFrameResize(iframeConfig, iFrames[0]);
                    var timer = null;
                    iFrames.on('load', function () {
                        var iframe = this;
                        if (timer) {
                            clearInterval(timer);
                        }
                        //sending parent information to layout
                        if ($rootScope.parentInfo) {
                            var frameMessage = { action: 'setParent', data: $rootScope.parentInfo };
                            $scope.previewFrame.postMessage(frameMessage, '*');
                        }
                        // handle reload of page with prep'd data to use
                        timer = setInterval(function () {

                            if (/Mobile/.test($scope.previewMode)) {
                                // make mobile match iPad dimensions
                                element.addClass('mobile');
                                if (/iPad/i.test($scope.previewMode)) {
                                    element.addClass('ipad');
                                    element.removeClass('iphone');
                                } else if (/iPhone/i.test($scope.previewMode)) {
                                    element.addClass('iphone');
                                    element.removeClass('ipad');
                                }
                                if (/iPad/i.test($scope.previewMode)) {
                                    element.addClass('landscape');
                                    element.removeClass('portrait');
                                }
                                if (/iPhone/i.test($scope.previewMode)) {
                                    element.addClass('portrait');
                                    element.removeClass('landscape');
                                }
                            } else {
                                element.removeClass('mobile', 'ipad', 'iphone', 'portrait', 'landscape');

                                if ($scope.previewMode.label.toLowerCase().indexOf('iphone') > 0) {
                                    element.removeClass('ipad-wrapper');
                                    $(iframe).removeClass('ipad-inner');
                                    iframe.style.width = '375px';
                                    iframe.style.height = '667px';
                                    $(iframe).addClass('iphone-inner');
                                    element.addClass('iphone-wrapper');
                                }
                                else if ($scope.previewMode.label.toLowerCase().indexOf('ipad') > 0) {
                                    element.removeClass('iphone-wrapper');
                                    $(iframe).removeClass('iphone-inner');
                                    iframe.style.width = '768px';
                                    iframe.style.height = '576px';
                                    $(iframe).addClass('ipad-inner');
                                    element.addClass('ipad-wrapper');
                                }
                                else {
                                    $(iframe).removeClass('iphone-inner ipad-inner');
                                    element.removeClass('iphone-wrapper ipad-wrapper');
                                    iframe.style.width = '100%';
                                }
                            }
                        }, 500);
                    });
                } else {
                    $rootScope.lwcCreatePendingRequests.forEach(card => {
                        $scope.pendingCards += card.obj.Name + ", "
                    });
                    $scope.pendingCards = $scope.pendingCards.substring(0, $scope.pendingCards.length - 2)
                }
            });

        }

        $scope.$watch('tabs.activeTab', function (newValue) {
            if (newValue === 1 && $rootScope.layout.Id) {
                $scope.updatePreviewModes();
                if (needsReload) {
                    loadPreviewPage();
                }
                $rootScope.collapsePalette = true;
            } else {
                $rootScope.collapsePalette = $rootScope.fullScreen = false;
            }
        });

        $scope.$watch('previewMode', function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                loadPreviewPage();
            }
        });

        interTabMsgBus.on('layoutPreviewJson', function (newJson, oldJson) {
            if (!triggeredReload || !oldJson) {
                $timeout(function () {
                    if (angular.isString(newJson)) {
                        newJson = JSON.stringify(JSON.parse(newJson), null, 2);
                    }
                    $scope.$apply(function () {
                        $scope.viewModel.testJSON = newJson;
                    });
                });
            } else {
                interTabMsgBus.set('layoutPreviewJson', oldJson + ' ');
            }
            triggeredReload = false;
        });

        $scope.reload = function () {
            needsReload = true;
            loadPreviewPage();
        };

        // preview custom page implementation.
        $scope.showCustomPageModal = function () {
            reloadPreview = false;
            var tabScope = $scope;
            $modal({
                backdrop: 'static',
                scope: tabScope,
                templateUrl: 'CustomPageModal.tpl.html',
                show: true,
                html: true
            });
        };

        $scope.updateCustomPage = function (customPage) {
            var customPageObj = _.find($rootScope.apexPages, { Name: customPage.page })
            if (customPageObj) {
                customPage.label = customPageObj.Name;
                customPage.namespacePrefix = customPageObj.NamespacePrefix;
            }
        };

        $scope.updatePreviewModes = function () {
            reloadPreview = true;
            if ($rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['customPreviewPages']) {
                $scope.previewModes = defaultPage.concat($rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['customPreviewPages']);
            };
            if ($rootScope.layout[$rootScope.nsPrefix + 'Active__c']) {
                $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['previewType'] = $scope.previewTypes[1].name;
            } else {
                if ($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc) {
                    $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['previewType'] = $scope.previewTypes[0].name;
                } else {
                    $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['previewType'] = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['previewType'] || $scope.previewTypes[0].name;
                }
            }

        };

        $scope.addCustomPage = function () {
            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['customPreviewPages'] = $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['customPreviewPages'] || [];
            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['customPreviewPages'].push({ 'label': '', 'page': '', 'namespacePrefix': '', 'group': 'Custom Pages' });
        };

        $scope.removeCustomPage = function (index) {
            console.log('removing custom page');
            $rootScope.layout[$rootScope.nsPrefix + 'Definition__c']['customPreviewPages'].splice(index, 1);
            //evaluate here for testing purposes
        };

        // clear old localStorage values
        interTabMsgBus.delete('layoutPreviewJson');

    });
},{}],9:[function(require,module,exports){
angular
  .module("carddesigner")
  .controller("xmlInterfaceDesignController", function(
    $rootScope,
    $scope,
    remoteActions,
    LightningWebCompFactory,
    $modal,
    $log
  ) {
    "use strict";
    //Tooltip Documentation
    $scope.toolTip = {
      description: "Describe your component for the App Designer",
      apiVersion: "API version for the Component",
      isExposed: "Enable to make this component public",
      masterLabel: "Name of the component to be used in the App Designer",
      runtimeNamespace: "Vlocity package namespace",
      target:
        "Specifies where the component can be added, such as on a type of Lightning Page"
    };

    const targetObj = [
      { target: "lightning__AppPage", isChecked: false, name: "AppPage" },
      { target: "lightning__HomePage", isChecked: false, name: "HomePage" },
      { target: "lightning__RecordPage", isChecked: false, name: "RecordPage" },
      {
        target: "lightningCommunity__Page",
        isChecked: false,
        name: "CommunityPage"
      },
      {
        target: "lightningCommunity__Default",
        isChecked: false,
        name: "CommunityDefault"
      }
    ];

    $scope.xmlObject =
      $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].xmlObject ||
      LightningWebCompFactory.getXmlObject().originalObject ||
      {};
    $log.debug($scope.xmlObject);
    $scope.xmlObject.apiVersion = $scope.xmlObject.apiVersion || 46;
    $scope.xmlObject.runtimeNamespace = $rootScope.nsPrefix.replace("__", "");
    $scope.xmlObject.isExposed = $scope.xmlObject.isExposed || false;
    $scope.xmlObject.targets = $scope.xmlObject.targets || [];
    $scope.xmlObject.targetConfig = $scope.xmlObject.targetConfig || [];

    $scope.errorMessage = "";
    $scope.errorMessageForApiVersion = "";
    $scope.showConfigs = false;
    $scope.showTagDropdown = false;
    $scope.addProperty = false;
    $scope.editPropertyButtons = false;
    $scope.objectsArray = [];
    $scope.tags = [];
    $scope.selectedObjects = [];
    $scope.radio = { checked: false };

    $scope.xmlPropertyTypes = [
      "datasource",
      "default",
      "description",
      "label",
      "max",
      "min",
      "name",
      "placeholder",
      "required"
    ];

    $scope.xmlPropertyType = [
      {
        label: "Integer",
        value: "Integer"
      },
      {
        label: "String",
        value: "String"
      },
      {
        label: "Boolean",
        value: "Boolean"
      }
    ];

    $scope.propertyFlag = "";

    let getProperties = function(propertyNode) {
      let outterObj = {};
      let obj = {};
      if (
        propertyNode.hasAttribute("type") &&
        propertyNode.hasAttribute("name")
      ) {
        outterObj.name = propertyNode.getAttribute("name");
        obj.type = propertyNode.getAttribute("type");
        obj.name = propertyNode.getAttribute("name");
        obj.selectedProp = propertyNode.getAttribute("name");
        if (propertyNode.hasAttribute("datasource"))
          obj.datasource = propertyNode.getAttribute("datasource");
        if (propertyNode.hasAttribute("default"))
          obj.default = propertyNode.getAttribute("default");
        if (propertyNode.hasAttribute("description"))
          obj.description = propertyNode.getAttribute("description");
        if (propertyNode.hasAttribute("label"))
          obj.label = propertyNode.getAttribute("label");
        if (propertyNode.hasAttribute("max"))
          obj.max = propertyNode.getAttribute("max");
        if (propertyNode.hasAttribute("min"))
          obj.min = propertyNode.getAttribute("min");
        if (propertyNode.hasAttribute("placeholder"))
          obj.placeholder = propertyNode.getAttribute("placeholder");
        if (propertyNode.hasAttribute("required"))
          obj.required = propertyNode.getAttribute("required");
      }
      outterObj.value = obj;
      return outterObj;
    };

    // if targetConfig is there parse target config
    let parseTargetConfig = function(base64Data) {
      let currentTargetindex;
      let configArray = [];

      let targetConfigStr = window.atob(base64Data);
      targetConfigStr =
        targetConfigStr.includes("<targetConfigs>") &&
        targetConfigStr.includes("</targetConfigs>")
          ? targetConfigStr
          : `<targetConfigs> ${targetConfigStr} </targetconfigs>`;
      let parser = new DOMParser();
      let targetConfigXml = parser.parseFromString(targetConfigStr, "text/xml");
      let targetConfigNodes = targetConfigXml.getElementsByTagName(
        "targetConfig"
      );
      let i = 0;
      while (targetConfigNodes[i]) {
        let targets = targetConfigNodes[i].getAttribute("targets");
        let targetNodes = targetConfigNodes[i];
        let objArray = [];
        let j = 0;
        let xmlObj = targetNodes.getElementsByTagName("object");
        while (xmlObj[j]) {
          objArray.push(xmlObj[j].textContent);
          j++;
        }

        let propertyNode = targetNodes.getElementsByTagName("property");
        if (propertyNode.length) {
          let prop = [];
          for (let i = 0; i < propertyNode.length; i++) {
            if (
              propertyNode[i].hasAttribute("type") &&
              propertyNode[i].hasAttribute("name")
            ) {
              prop.push(getProperties(propertyNode[i]));
            }
          }
          configArray.push({
            target: targets,
            property: [...prop],
            objects: [...objArray]
          });
        } else if (targets === "lightning__RecordPage") {
          configArray.push({
            target: targets,
            property: [],
            objects: [...objArray]
          });
        }

        i++;
      }
      $log.debug(configArray);
      $scope.xmlObject.targetConfig = configArray;
    };

    if (
      $scope.xmlObject &&
      $scope.xmlObject.targetConfigs &&
      (!$scope.xmlObject.targetConfig || !$scope.xmlObject.targetConfig.length)
    )
      parseTargetConfig(
        $scope.xmlObject.targetConfigs.asByteArray ||
          $scope.xmlObject.targetConfigs
      );

    // Check if targets are there in xmlObject, then initialize with the same
    $scope.targets = [];
    if ($scope.xmlObject.targets && $scope.xmlObject.targets.length) {
      $scope.xmlObject.targets.forEach(tar => {
        $scope.targets.push({
          target: tar.target,
          isChecked: true,
          name: tar.name
        });
      });
    }

    if ($scope.xmlObject.targetConfig && $scope.xmlObject.targetConfig.length) {
      $scope.xmlObject.targetConfig.forEach(conf => {
        if (conf.target === "lightning__RecordPage") {
          $scope.selectedObjects =
            conf.objects && conf.objects.length ? conf.objects : [];
        }
      });
    }

    $scope.targets = _.uniqBy([...$scope.targets, ...targetObj], "target");
    $scope.properties = {};
    $scope.editPropertyFlag = false;
    let editPropertyName = "";
    $scope.property = {};

    $scope.selectTarget = function(targetName, isChecked) {
      if (!isChecked) {
        let deleteModalScope = $scope.$new();
        deleteModalScope.deleteTarget = function() {
          handleSelectedTarget(targetName);
          $scope.xmlObject.targetConfig.forEach(targ => {
            if (targ.target === targetName) {
              targ.property = [];
              targ.objects = [];
            }
          });
          $scope.selectedObjects = [];
          $scope.showConfigs = false;
          removeEmptyTargetConfig();
        };
        deleteModalScope.cancel = function() {
          $scope.targets.forEach(item => {
            if (item.target === targetName) {
              item.isChecked = true;
            }
          });
        };
        let modal = $modal({
          title: "Delete Target",
          templateUrl: "deleteTargetModal.tpl.html",
          html: true,
          scope: deleteModalScope,
          backdrop: "static",
          show: true
        });
        modal.$promise.then(modal.show).then(function(done) {
          $log.debug(done);
        });
      } else {
        handleSelectedTarget(targetName);
        $log.debug($scope.xmlObject.targets);
      }
    };

    let handleSelectedTarget = function(name) {
      let temp = [];
      $scope.targets.forEach(item => {
        if (item.isChecked) {
          temp.push({
            name: item.name,
            target: item.target
          });
        }
      });
      $scope.xmlObject.targets = [...temp];
    };

    let resetXmlProperties = function() {
      $scope.xmlProperties = [];
      $scope.xmlPropertyTypes.map(item => {
        let isRequired = item === "name";
        $scope.xmlProperties.push({
          type: item === "required" ? "checkbox" : "input",
          name: item,
          label: item + (isRequired ? " (required)" : ""),
          class: "xmlProperty-" + item,
          value: "",
          display: isRequired,
          required: isRequired
        });
      });
    };

    resetXmlProperties();

    $scope.save = function() {
      if ($scope.xmlObject.apiVersion) {
        $scope.errorMessageForApiVersion = "";
        // check if objects available for lightning_RecordPage, and add them.
        if ($scope.selectedObjects && $scope.selectedObjects.length) {
          //now check if selectedTarget available in targetConfig
          let found = false;
          if (!$scope.xmlObject.targetConfig)
            $scope.xmlObject.targetConfig = [];
          $scope.xmlObject.targetConfig.forEach(config => {
            if (config.target === "lightning__RecordPage") {
              config.objects = [...$scope.selectedObjects];
              found = true;
            }
          });

          if (!found) {
            $scope.xmlObject.targetConfig.push({
              target: "lightning__RecordPage",
              property: [],
              objects: [...$scope.selectedObjects]
            });
          }
        }
        if ($scope.addProperty) $scope.closeProperty();
        let xml = LightningWebCompFactory.generateXml($scope.xmlObject);
        if (
          $scope.xmlObject.targetConfig &&
          !$scope.xmlObject.targetConfig.length
        ) {
          delete $scope.xmlObject.targetConfigs;
        }
        let metaObject = LightningWebCompFactory.prepareMetaObject(
          $scope.xmlObject
        );
        if (
          !metaObject.targets ||
          (metaObject.targets && !metaObject.targets.target)
        ) {
          metaObject.targets = { target: [] };
          metaObject.targetConfigs = "";
        }
        delete $scope.xmlObject.lwcResources;
        $rootScope.layout[$rootScope.nsPrefix + "Definition__c"].xmlObject =
          $scope.xmlObject;
        $rootScope.layout[
          $rootScope.nsPrefix + "Definition__c"
        ].bypassSave = true;
        LightningWebCompFactory.setXmlObject(xml, metaObject, $scope.xmlObject);
        $log.debug("Saving xml ... ", LightningWebCompFactory.getXmlObject());
        LightningWebCompFactory.isDeploymentPending = true;
        $scope.$parent.$hide();
      } else {
        $scope.errorMessageForApiVersion = "Enter api version before saving ";
      }
    };

    $scope.getProperties = function(targetName) {
      let property = [];
      if (
        $scope.xmlObject.targetConfig &&
        $scope.xmlObject.targetConfig.length
      ) {
        $scope.xmlObject.targetConfig.forEach(item => {
          if (item.target === targetName) {
            property = item.property;
          }
        });
        $scope.properties[targetName] = property;
      }
    };

    $scope.getAllObjects = function(targetName) {
      if (targetName === "lightning__RecordPage") {
        if (!$scope.objectsArray.length && !$scope.tags.length) {
          remoteActions
            .getDataViaDynamicSoql(
              "SELECT QualifiedApiName FROM EntityDefinition WHERE IsCustomSetting = false Order by QualifiedApiName"
            )
            .then(function(objects) {
              $scope.objectsArray = JSON.parse(objects);
              $scope.objectsArray.forEach(item => {
                $scope.tags.push(item.QualifiedApiName);
              });
            })
            .catch(function(error) {
              $log.debug(error);
            });
        }
      }
    };

    $scope.onSelect = function(e) {
      if (e && $scope.selectedObjects.indexOf(e) === -1) {
        $scope.selectedObjects.push(e);
        let ele = document.getElementsByClassName("object")[0];
        ele.value = "";
        ele.blur();
      }
    };

    $scope.removeObject = function(index) {
      if ($scope.selectedObjects && $scope.selectedObjects.length) {
        let removed = $scope.selectedObjects.splice(index, 1)[0];
        $scope.xmlObject.targetConfig.forEach((item, index) => {
          if (item.target === "lightning__RecordPage") {
            $scope.xmlObject.targetConfig[
              index
            ].objects = $scope.xmlObject.targetConfig[index].objects.filter(
              val => {
                return val !== removed;
              }
            );
          }
        });
        removeEmptyTargetConfig();
      }
      $log.debug($scope.xmlObject.targetConfig);
    };

    let selectedTargetObjectExist = function(selectedTarget) {
      let found = false;
      if (
        $scope.xmlObject.targetConfig &&
        $scope.xmlObject.targetConfig.length
      ) {
        $scope.xmlObject.targetConfig.forEach(item => {
          if (item.target === selectedTarget) found = true;
        });
      }
      return found;
    };

    $scope.addProprtyForTarget = function(selectedTarget) {
      if ($scope.editPropertyButtons) {
        $scope.editPropertyButtons = false;
        document.getElementById($scope.editProp).checked = false;
      }
      $scope.errorMessage = "";
      if (!selectedTargetObjectExist(selectedTarget)) {
        if (!$scope.xmlObject.targetConfig) $scope.xmlObject.targetConfig = [];
        $scope.xmlObject.targetConfig.push({
          target: selectedTarget,
          property: [],
          objects: []
        });
      }
      $scope.propertyFlag = selectedTarget;
      toggleAddProperty();
    };

    let toggleAddProperty = function() {
      $scope.addProperty = !$scope.addProperty;
    };

    $scope.property.selectedProp = "name";
    $scope.addProperties = function(prop) {
      if (prop) {
        $scope.xmlProperties.map(item => {
          if (item.name === prop && item.name !== "name") {
            item.display = !item.display;
          }
        });
      }
    };

    let checkPropertyExists = function(propName, targetName) {
      let found = false;
      $scope.xmlObject.targetConfig.forEach(item => {
        if (item.target === targetName) {
          if (item.property && item.property.length) {
            item.property.forEach(prop => {
              if (prop.name === propName) found = true;
            });
          }
        }
      });
      return found;
    };

    $scope.saveProperty = function(prop, targetName) {
      let propertyName = prop.name;
      let propertyType = prop.type;
      $scope.errorMessage = "";
      if (!propertyName) {
        $scope.errorMessage = "Enter Name of the Property";
        return;
      }
      if (!propertyType) {
        $scope.errorMessage = "Select Type of the Property";
        return;
      }

      if ($scope.editPropertyFlag && propertyName) {
        if (propertyName === editPropertyName) {
          $scope.xmlObject.targetConfig.forEach(item => {
            if (item.target === targetName) {
              item.property.forEach(p => {
                if (p.name === propertyName) p.value = { ...prop };
              });
            }
          });
          $scope.property = {};
          toggleAddProperty();
          $scope.editPropertyFlag = false;
          editPropertyName = "";
          document.getElementById($scope.editProp).checked = false;
        } else {
          //delete the previous values
          let removeIndex;
          let properties;

          $scope.xmlObject.targetConfig.forEach(item => {
            if (item.target === targetName) {
              properties = [...item.property];
            }
          });

          for (let index in properties) {
            if (properties[index].name === editPropertyName) {
              removeIndex = index;
              break;
            }
          }
          properties.splice(removeIndex, 1);
          // add the latest values
          properties.push({
            name: propertyName,
            value: { ...prop }
          });

          $scope.xmlObject.targetConfig.forEach(item => {
            if (item.target === targetName) {
              item.property = [...properties];
            }
          });
          $scope.property = {};
          toggleAddProperty();
          $scope.editPropertyFlag = false;
          editPropertyName = "";
          document.getElementById($scope.editProp).checked = false;
        }
      } else {
        if (!checkPropertyExists(propertyName, targetName)) {
          $scope.xmlObject.targetConfig.forEach(item => {
            if (item.target === targetName) {
              item.property.push({
                name: propertyName,
                value: { ...prop }
              });
            }
          });
          $scope.property = {};
          toggleAddProperty();
          $scope.property.selectedProp = "name";
        } else {
          $scope.errorMessage = "Property Name already exists";
        }
      }
      $scope.getProperties(targetName);
    };

    let removeEmptyTargetConfig = function() {
      //remove empty targetconfigs
      if ($scope.xmlObject.targetConfig) {
        $scope.xmlObject.targetConfig = $scope.xmlObject.targetConfig.filter(
          config => {
            return (
              (config.property && config.property.length) ||
              (config.objects && config.objects.length)
            );
          }
        );
      }
    };

    $scope.closeProperty = function() {
      removeEmptyTargetConfig();
      if ($scope.editPropertyFlag) {
        $scope.editPropertyFlag = false;
        editPropertyName = "";
        document.getElementById($scope.editProp).checked = false;
      } else {
        $scope.property = {};
      }
      toggleAddProperty();
      $scope.property.selectedProp = "name";
    };

    $scope.selectPropToEdit = function(propName, targetName) {
      $scope.editPropertyButtons = true;
      $scope.editProp = propName;
      $scope.propertyFlag = targetName;
    };

    $scope.editProperty = function(targetName) {
      let propertyName = $scope.editProp;
      toggleAddProperty();
      $scope.editPropertyFlag = true;
      editPropertyName = propertyName;
      $scope.properties[targetName].map(item => {
        if (item.name === propertyName) {
          $scope.property = { ...item.value };
        }
      });
      $scope.property.selectedProp = "name";
      $scope.editPropertyButtons = false;
    };

    $scope.deleteProperty = function(targetName, propertyName) {
      if ($scope.xmlObject.targetConfig) {
        $scope.xmlObject.targetConfig.map((item, index) => {
          if (item.target === targetName) {
            if (item.property && item.property.length) {
              let deleteIndex;
              item.property.map((prop, ind) => {
                if (prop.name === propertyName) {
                  deleteIndex = ind;
                }
              });
              item.property.splice(deleteIndex, 1);
            }
          }
        });
      }
      removeEmptyTargetConfig();
      $scope.editPropertyButtons = false;
    };

    $scope.deleteAttribute = function(name) {
      $scope.xmlProperties.map(item => {
        if (item.name === name) item.display = false;
      });
    };
  });
},{}],10:[function(require,module,exports){
/**
 * ngclipboard is an angular directive for clipboardjs, used for copying the text
 * Clipboard can execute only when it is attached to the element due to browsers security restrictions. 
 * Always pass the valid DOM element for clipboard
 * 
 * Usage:
 * <button class="copy-button" ngclipboard ngclipboard-success="onSuccess(e);" ngclipboard-error="onError(e);" data-clipboard-text="Pass the text — clipboard.js">
 *     Copy to clipboard
 *  </button>
 *  Use data-clipboard-target for passing the target
 *  More on https://clipboardjs.com/
 */

angular.module('carddesigner')
    .directive('ngclipboard', ['$window', function($window) {
        'use strict';
        var Clipboard = $window.Clipboard;
        return {
            restrict: 'A',
            scope: {
                ngclipboardSuccess: '&',
                ngclipboardError: '&'
            },
            link: function($scope, element) {
                var clipboard = new Clipboard(element[0]);

                clipboard.on('success', function(event) {
                    $scope.$apply(function() {
                        $scope.ngclipboardSuccess({
                            e: event
                        });
                    });
                });

                clipboard.on('error', function(event) {
                    $scope.$apply(function() {
                        $scope.ngclipboardError({
                            e: event
                        });
                    });
                });
            }
        };
    }
    ]);

},{}],11:[function(require,module,exports){
/* jshint evil: true */
angular.module('carddesigner')
    .directive('datasourcefilter', function () {
        'use strict';

        return {
            restrict: 'AE',
            scope: {
                datasource: '=?',
                encryptedDatasource: '=?',
                obj: '=',
                type: '=',
                objId: '=',
                disabled: '='
            },
            replace: true,
            templateUrl: 'DataSource.tpl.html',
            controller: ['$scope', '$rootScope', 'dataService', '$modal',
                '$interpolate', '$http', '$timeout', 'remoteActions', '$localizable', 'dataSourceService', 'configService', 'helpNode', '$log',
                function ($scope, $rootScope, dataService, $modal, $interpolate, $http, $timeout, remoteActions,
                    $localizable, dataSourceService, configService, helpNode, $log) {

                    $scope.test = {};
                    $scope.isIpActive = true;
                    let angularDs = [
                        { 'name': null, 'value': '-- no source / layout --' },
                        { 'name': 'Query', 'value': 'SOQL Query' },
                        { 'name': 'Search', 'value': 'SOSL Search' },
                        { 'name': 'DataRaptor', 'value': 'DataRaptor' },
                        { 'name': 'Dual', 'value': 'Dual' },
                        { 'name': 'ApexRemote', 'value': 'Apex Remote' },
                        { 'name': 'ApexRest', 'value': 'Apex REST' },
                        { 'name': 'REST', 'value': 'REST' },
                        { 'name': 'IntegrationProcedures', 'value': 'Integration Procedures' },
                        { 'name': 'StreamingAPI', 'value': 'Streaming API' },
                        { 'name': 'Custom', 'value': 'Sample' },
                        { 'name': 'Inherit', 'value': 'Parent' }
                    ];

                    let lwcDs = [
                        { 'name': null, 'value': '-- no source / layout --' },
                        { 'name': 'Query', 'value': 'SOQL Query' },
                        { 'name': 'Search', 'value': 'SOSL Search' },
                        { 'name': 'DataRaptor', 'value': 'DataRaptor' },
                        { 'name': 'ApexRemote', 'value': 'Apex Remote' },
                        { 'name': 'ApexRest', 'value': 'Apex REST' },
                        { 'name': 'REST', 'value': 'REST' },
                        { 'name': 'IntegrationProcedures', 'value': 'Integration Procedures' },
                        { 'name': 'StreamingAPI', 'value': 'Streaming API' },
                        { 'name': 'Custom', 'value': 'Sample' },
                        { 'name': 'Dual', 'value': 'Dual' },
                    ];

                    $scope.dataSourceTypes = $rootScope.layout && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'] && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc ? lwcDs : angularDs;

                    $rootScope.$watch(function () {
                        return $rootScope.layout && $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'] ? $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc : 0;
                    }, function (newVal, oldVal) {
                        if (newVal !== oldVal) {
                            $scope.dataSourceTypes = newVal ? lwcDs : angularDs;
                        }
                    });

                    $scope.searchFields = [
                        { 'name': 'All Fields', 'value': 'ALL FIELDS' },
                        { 'name': 'Name Fields', 'value': 'NAME FIELDS' },
                        { 'name': 'Email Fields', 'value': 'EMAIL FIELDS' },
                        { 'name': 'Phone Fields', 'value': 'PHONE FIELDS' },
                    ];
                    if ($scope.obj) {
                        $scope.objName = $scope.obj.Name && $scope.obj.Name.replace(/\s+/g, '-').toLowerCase();
                    }
                    //Documentation
                    $scope.helpNode = helpNode;

                    $scope.lightningUrl = $rootScope.lightningUrl;

                    $scope.HTTPMethods = [
                        { 'name': 'GET', 'value': 'GET' },
                        { 'name': 'POST', 'value': 'POST' }
                    ];

                    $scope.RESTSubtypes = [
                        { 'name': 'Web', 'value': 'Web' },
                        { 'name': 'Named Credential', 'value': 'NamedCredential' }
                    ];

                    $scope.initDatasource = function () {
                        //Clearing old fields on change of datasource
                        $scope.fieldsFromDatasource = [];

                        $scope.isInvalid = false;
                        if ($scope.datasource && $scope.datasource.type) {
                            $log.debug('initiating datasource ', $scope.datasource.type);
                            $scope.dsDisabled = $scope.isDatasourceDisabled();
                            switch ($scope.datasource.type) {
                                case 'Custom':
                                    if ($scope.datasource.value) {
                                        $scope.isInvalid = $scope.datasource.value.body === '' || !$scope.datasource.value.body;
                                    }
                                    break;
                                case 'Query':
                                case 'Search':
                                    $scope.encryptDatasource();
                                    break;
                                default:
                                    // statements_def
                                    break;
                            }
                        } else {
                            let datasourceObj = {};
                            // To make sure we dont lose parent JSON result path
                            if(!$scope.datasource.type && ($scope.datasource.value && $scope.datasource.value.resultVar)){
                                datasourceObj.value = {resultVar : $scope.datasource.value.resultVar};
                            }
                            $scope.datasource = {
                                type: null,
                                value : datasourceObj.value
                            };
                        }

                    };

                    $scope.isDatasourceDisabled = function () {
                        var dsDisabledField = $rootScope.nsPrefix + 'DisableDatasource' + $scope.datasource.type + '__c';
                        $log.debug('isDatasourceDisabled for ', $scope.datasource.type, dsDisabledField);
                        var dsDisabled = $rootScope.vlocityCards.customSettings &&
                            typeof $rootScope.vlocityCards.customSettings[dsDisabledField] != 'undefined' ?
                            $rootScope.vlocityCards.customSettings[dsDisabledField] :
                            false;

                        return dsDisabled;
                    };

                    $scope.getBundleByName = function (objValue, Bundles) {
                        if (Bundles) {
                            var bundle = _.find(Bundles, { 'Name': objValue });
                            return bundle && bundle.Id;
                        }
                    };

                    $scope.loadFieldDataFromCardOrLayout = function (records) {
                        if ($scope.type === 'card') {

                            // If card existed before, then it should have an Id and we should use it as key to store the card data.
                            // If NOT, then we have to use the angular hash key to uniquely identify it during the session such that
                            //   later on in StatesController.js, the latter can determine if a new card that has not been saved yet (hence with no Id)
                            //   whether the user has clicked "View Data" and data has been retrieved or not.
                            var cardUniqueKey = $scope.$parent.$parent.card.Id ? $scope.$parent.$parent.card.Id : 'newCardWithHashKey-' + $scope.$parent.$parent.card.$$hashKey;

                            var paths = $scope.getPaths(records instanceof Array ? records[0] : records, null, 'Query');
                            $rootScope.fieldsFromCards[cardUniqueKey] = paths.leafResult;
                            $rootScope.fieldGroupsFromCards[cardUniqueKey] = paths.fieldResult;
                            $rootScope.$broadcast('FetchedCardsData');
                            $scope.fieldsFromDatasource = $rootScope.fieldsFromCards[cardUniqueKey];

                        } else {
                            var paths = $scope.getPaths(records instanceof Array ? records[0] : records, null, 'Query');
                            $rootScope.fieldsFromLayout = paths.leafResult;
                            $rootScope.fieldGroupsFromLayout = paths.fieldResult;
                            $rootScope.$broadcast('FetchedLayoutData');
                            $scope.fieldsFromDatasource = $rootScope.fieldsFromLayout;
                            if ($rootScope.layoutCards) {
                                $rootScope.layoutCards.map((card) => {
                                    if (!card[$rootScope.nsPrefix + 'Datasource__c']) {
                                        $rootScope.fieldsFromCards[card.Id] = paths.leafResult;
                                        $rootScope.fieldGroupsFromCards[card.Id] = paths.fieldResult;
                                    }
                                });
                            }
                        }
                    };

                    $scope.showTestResultModal = function (dontShowModal, datasourceType, records, error) {
                        var modal, modalScope, dataDisplay, title, content, erroMessage;
                        $scope.isFetchingData = false;
                        if (!dontShowModal) {
                            erroMessage = error && error.message ? error.message : "Sorry, we can’t find the URL you were looking for.";
                            if (datasourceType !== 'StreamingAPI') {
                                // if query execution fails and error object is returned
                                if (error) {
                                    title = datasourceType + ' Encountered Error!',
                                        content = '<h2 class="text-danger">Error Message:</h2>' + '<pre id="dataSourceResultCode">' + erroMessage + '<br/><br/></pre>';
                                    // if query execution is successful and normal data is returned
                                } else {
                                    dataDisplay = JSON.stringify(records, null, 4);
                                    dataDisplay = (dataDisplay == '[]') ? 'No Data' : dataDisplay;
                                    title = datasourceType + ' Result';
                                    content = '<h2>Data Retrieved:</h2>' + '<pre id="dataSourceResultCode">' + dataDisplay + '</pre>';
                                }

                                modalScope = $scope.$new();
                                modal = $modal({
                                    title: title,
                                    content: content,
                                    templateUrl: 'DataSourceViewModal.tpl.html',
                                    show: false,
                                    scope: modalScope,
                                    html: true
                                });
                                modal.$promise.then(modal.show);
                            } else {
                                if (error) {
                                    title = datasourceType + ' Encountered Error!',
                                        content = '<h2 class="text-danger">Error Message:</h2>' + '<pre id="dataSourceResultCode">' + erroMessage + '<br/><br/></pre>';
                                    // if query execution is successful and normal data is returned
                                } else {
                                    title = datasourceType + ' Result';
                                }
                                $scope.isFetchingModalData = $scope.fetchedModalData ? false : true;
                                modalScope = $scope;
                                modal = $modal({
                                    title: title,
                                    templateUrl: 'DataSourceViewModal.tpl.html',
                                    show: false,
                                    scope: modalScope,
                                    html: true
                                });
                                modal.$promise.then(modal.show);
                            }

                        }

                        //Process all paths for field dropdowns, typeaheads and other suggestions
                        if (!error) {
                            $scope.loadFieldDataFromCardOrLayout(records);
                        } else {
                            $scope.dsDisabled = $scope.isDatasourceDisabled();
                        }
                    };

                    $scope.showDualDatasourceTestResultModal = function (dontShowModal, datasourceType, records, leftOrRightIndicator, error) {
                        var modal, modalScope, dataDisplay, title, content, outputCodeClass;
                        $scope.isFetchingData = false;
                        if (!dontShowModal) {
                            // if query execution fails and error object is returned

                            // Important:
                            // Clipboard can execute only when it is attached to the element due to browsers security restrictions
                            outputCodeClass = leftOrRightIndicator ? leftOrRightIndicator + 'dataSourceResultCode' : 'dataSourceResultCode';
                            if (error) {
                                var errorMessage = error.message ? error.message : "Sorry, we can’t find the URL you were looking for.";
                                title = datasourceType + ' Encountered Error!';
                                content = '<h2 class="text-danger">Error Message:</h2>' + '<pre id="' + outputCodeClass + '">' + errorMessage + '<br/><br/></pre>';
                                // if query execution is successful and normal data is returned
                            } else {
                                dataDisplay = JSON.stringify(records, null, 4);
                                dataDisplay = (dataDisplay == '[]') ? 'No Data' : dataDisplay;
                                title = datasourceType + ' Result';
                                content = '<h2>Data Retrieved:</h2><pre id="' + outputCodeClass + '">' + dataDisplay + '</pre>';
                            }

                            modalScope = $scope.$new();
                            modalScope.leftOrRightIndicator = leftOrRightIndicator;
                            modal = $modal({
                                title: title,
                                content: content,
                                templateUrl: 'DataSourceViewModal.tpl.html',
                                show: false,
                                html: true,
                                scope: modalScope,
                                placement: leftOrRightIndicator
                            });

                            modal.$promise.then(modal.show);
                        }
                    };

                    $scope.testDataSource = function (dontShowModal) {
                        var payload, query;
                        $log.debug('dataSource: ', $scope.datasource);
                        if (!$scope.datasource) {
                            return;
                        }
                        $scope.isFetchingData = dontShowModal ? false : true;
                        $scope.evaluate();

                        if ($scope.datasource.type === 'Dual') {

                            var datasource = angular.copy($scope.datasource);
                            datasource.type = 'ApexRemote';

                            dataSourceService.getData(datasource, $scope.test).then(
                                function (apexRemoteRecords) {
                                    $log.debug('Dual result from ApexRemote datasourceService ', apexRemoteRecords);
                                    if ($scope.datasource.value.apexRemoteResultVar) {
                                        //apexRemoteRecords = _.get(apexRemoteRecords,$scope.datasource.value.apexRemoteResultVar);
                                        apexRemoteRecords = dataSourceService.selectResultNode(datasource, apexRemoteRecords, $scope.datasource.value.apexRemoteResultVar);
                                    }

                                    $scope.showDualDatasourceTestResultModal(dontShowModal, 'ApexRemote', apexRemoteRecords, 'left');

                                    datasource = angular.copy($scope.datasource);
                                    datasource.type = 'ApexRest';

                                    dataSourceService.getData(datasource, $scope.test).then(
                                        function (apexRestRecords) {
                                            $log.debug('Dual result from ApexRest datasourceService ', apexRestRecords);
                                            //getting node
                                            if ($scope.datasource.value.apexRestResultVar) {
                                                apexRestRecords = dataSourceService.selectResultNode(datasource, apexRestRecords, $scope.datasource.value.apexRestResultVar);
                                            }

                                            $scope.showDualDatasourceTestResultModal(dontShowModal, 'ApexRest', apexRestRecords, 'right');
                                            $scope.loadFieldDataFromCardOrLayout(apexRestRecords);

                                            /* Temporarily disable checking if json structures from ApexRemote and ApexRest are the same
                                            if (_.isEqual(apexRemoteRecords, apexRestRecords)) {
                                                $scope.showTestResultModal(dontShowModal, 'Dual', apexRestRecords);
                                            } else {
                                                $log.debug('data error ','data from ApexRemote and ApexRest not the same!');
                                                $scope.showTestResultModal(dontShowModal, 'Dual', null, {'message': 'data from ApexRemote and ApexRest not the same!'});
                                            }
                                            */
                                        },
                                        function (err) {
                                            $log.debug('data error ', err);
                                            $scope.showDualDatasourceTestResultModal(dontShowModal, 'ApexRest', err.data, 'right', err);
                                        }
                                    );

                                },
                                function (err) {
                                    $log.debug('data error ', err);
                                    $scope.showDualDatasourceTestResultModal(dontShowModal, 'ApexRemote', err.data, 'left', err);
                                }
                            );


                        } else if ($scope.datasource.type === 'Query' || $scope.datasource.type === 'Search') {

                            //check FLS now

                            dataSourceService.getData($scope.encryptedDatasource, $scope.test).then(
                                function (records) {
                                    $log.debug('result from datasourceService ', records);
                                    records = dataSourceService.selectResultNode($scope.datasource, records);
                                    $scope.loadFieldDataFromCardOrLayout(records);
                                    $scope.showTestResultModal(dontShowModal, $scope.datasource.type, records);
                                    //store layout datasource result in rootscope for use by card designer
                                    if ($scope.type === 'layout') {
                                        $rootScope.layoutDSResult = records;
                                    }
                                },
                                function (err) {
                                    $log.debug('data error ', err);
                                    $scope.showTestResultModal(dontShowModal, $scope.datasource.type, err.data, err);
                                }
                            );

                        } else if ($scope.datasource.type === 'StreamingAPI') {
                            $scope.showTestResultModal(dontShowModal, 'StreamingAPI', []);
                            dataSourceService.getData($scope.datasource, $scope.test).then(
                                function (records) {
                                    $rootScope.$on('vlocity.data.streamingAPI', function (evt, data) {
                                        if ($scope.type === 'layout') {
                                            $rootScope.layoutDSResult = data;
                                        }
                                        if (!$scope.datasource.sampleDate) {
                                            $scope.datasource.sampleDate = data;
                                            $scope.loadFieldDataFromCardOrLayout($scope.datasource.sampleDate);
                                        }
                                        if (data && data.length != 0 && data[0].channel) {
                                            if ($scope.datasource.value.channel === data[0].channel) {
                                                $scope.isFetchingModalData = false;
                                                $scope.fetchedModalData = JSON.stringify(data, null, 4);
                                            }
                                        }
                                    });
                                    if ($scope.fieldsFromDatasource && $scope.fieldsFromDatasource.length === 0 && $scope.datasource.sampleDate) {
                                        $scope.loadFieldDataFromCardOrLayout($scope.datasource.sampleDate);
                                    }
                                },
                                function (err) {
                                    $log.debug('data error ', err);
                                    $scope.showTestResultModal(dontShowModal, $scope.datasource.type, err.data, err);
                                }
                            );
                            if ($scope.fieldsFromDatasource && $scope.fieldsFromDatasource.length === 0 && $scope.datasource.sampleDate) {
                                $scope.loadFieldDataFromCardOrLayout($scope.datasource.sampleDate);
                            }

                        } else if ($scope.datasource.type) {

                            dataSourceService.getData($scope.datasource, $scope.test).then(
                                function (records) {
                                    $log.debug('result from datasourceService ', records);
                                    records = dataSourceService.selectResultNode($scope.datasource, records);
                                    $scope.showTestResultModal(dontShowModal, $scope.datasource.type, records);
                                    //store layout datasource result in rootscope for use by card designer
                                    if ($scope.type === 'layout') {
                                        $rootScope.layoutDSResult = records;
                                    }
                                },
                                function (err) {
                                    $log.debug('data error ', err);
                                    $scope.showTestResultModal(dontShowModal, $scope.datasource.type, err.data, err);
                                }
                            );

                        } else if ($scope.type === 'card') {
                            var records = dataSourceService.selectResultNode($scope.datasource, $rootScope.layoutDSResult);
                            $scope.showTestResultModal(dontShowModal, 'Layout', records);
                        }


                    };

                    $scope.encryptDatasource = function () {
                        //angular merge field regex
                        var regex = /{{(.*?)}}/gmi;
                        var jsonParams = {};

                        if ($scope.datasource.type === 'Query') {
                            if ($scope.encryptedDatasource && typeof ($scope.encryptedDatasource) === 'string') {
                                $scope.encryptedDatasource = JSON.parse($scope.encryptedDatasource);
                            }
                            $scope.encryptedDatasource = $scope.encryptedDatasource && $scope.encryptedDatasource.type === $scope.datasource.type ? $scope.encryptedDatasource : angular.copy($scope.datasource);
                            if ($scope.datasource && $scope.datasource.value) {
                                delete $scope.datasource.value.query;
                                delete $scope.datasource.value.jsonMap;
                            }
                            $scope.datasource.value = $scope.datasource.value ? $scope.datasource.value : {};
                            if ($scope.encryptedDatasource.value && $scope.encryptedDatasource.value.query) {
                                var matches = $scope.encryptedDatasource.value.query.match(regex);
                                if (matches) {
                                    for (var i = 0; i < matches.length; i++) {
                                        var key = matches[i].replace(/\{|\}/gi, '');
                                        jsonParams[key] = matches[i];
                                    }
                                    $scope.datasource.value.jsonMap = JSON.stringify(jsonParams);
                                }
                            }
                            //stuff happens
                            $scope.obj[$rootScope.nsPrefix + 'Datasource__c'] = $scope.encryptedDatasource;
                        } else if ($scope.datasource.type === 'Search') {
                            //for New layout
                            $scope.obj[$rootScope.nsPrefix + 'Definition__c'].dataSource = $scope.obj[$rootScope.nsPrefix + 'Definition__c'].dataSource || {};
                            $scope.obj[$rootScope.nsPrefix + 'Definition__c'].dataSource.type = $scope.datasource.type;

                            $scope.encryptedDatasource = $scope.encryptedDatasource && $scope.encryptedDatasource.type === $scope.datasource.type ? $scope.encryptedDatasource : angular.copy($scope.datasource);
                            if ($scope.datasource && $scope.datasource.value) {
                                delete $scope.datasource.value.search;
                                delete $scope.datasource.value.fields;
                                delete $scope.datasource.value.objectMap;
                                delete $scope.datasource.value.jsonMap;
                            }
                            $scope.datasource.value = $scope.datasource.value ? $scope.datasource.value : {};
                            if ($scope.encryptedDatasource.value && $scope.encryptedDatasource.value.search) {
                                var matches = $scope.encryptedDatasource.value.search.match(regex);
                                if (matches) {
                                    for (var i = 0; i < matches.length; i++) {
                                        var key = matches[i].replace(/\{|\}/gi, '');
                                        jsonParams[key] = matches[i];
                                    }
                                    $scope.datasource.value.jsonMap = JSON.stringify(jsonParams);
                                }
                            }
                            //stuff happens
                            $scope.obj[$rootScope.nsPrefix + 'Datasource__c'] = $scope.encryptedDatasource;
                        }


                    };

                    $scope.getPaths = function (obj, name, source) {
                        var result = {
                            leafResult: [],
                            fieldResult: []
                        };
                        var fieldsToIgnoreBySource = {
                            'Query': ['done', 'attributes', 'totalSize', 'records'],
                            'DataRaptor': [],
                            'ApexRest': [],
                            'ApexRemote': [],
                            'REST': []
                        };
                        var passName;
                        var tempObj = {};
                        var fieldKeyMap = ['dataType', 'fieldName', 'label', 'value'];
                        var designerDataTypes = ['currency', 'date', 'datetime', 'percentage', 'phone', 'string', 'address'];
                        var tempKeys = [];
                        if (!obj) {
                            return result; // null object dead end check
                        }
                        function arrayContainsAnotherArray(needle, haystack) {
                            if (needle.length < haystack.length) {
                                return false;
                            }
                            for (var i = 0; i < needle.length; i++) {
                                if (haystack.indexOf(needle[i]) === -1) {
                                    return false;
                                }
                                return true;
                            }
                        }
                        Object.keys(obj).forEach(function (prop) {
                            var value = obj[prop];
                            var isArray = angular.isArray(value);
                            if (fieldsToIgnoreBySource[source].indexOf(prop) === -1) {
                                if (value && typeof value === 'object' && !isArray) {
                                    if ($.isNumeric(prop)) {
                                        passName = name + '[\'' + prop + '\']';
                                    } else {
                                        passName = name ? name + '[\'' + prop + '\']' : '[\'' + prop + '\']';
                                    }
                                    tempObj = $scope.getPaths(value, passName, source);
                                    angular.forEach(tempObj.leafResult, function (field) {
                                        var newField = {
                                            name: field.name,
                                            label: field.label,
                                            displayLabel: field.displayLabel,
                                            type: field.type,
                                            group: field.group
                                        };
                                        result.leafResult.push(newField);
                                    });
                                    // Carry over the fieldResults too:
                                    result.fieldResult = result.fieldResult.concat(tempObj.fieldResult);
                                    if (value) {
                                        var keys = Object.keys(value).map(function (key) {
                                            return key.toLowerCase();
                                        }).sort();
                                        // it's address like so add it too:
                                        if (/city,country,countrycode(,geocodeaccuracy)?(,latitude,longitude)?,postalcode,state,statecode,street/.test(keys.join(','))) {
                                            result.leafResult.push({
                                                name: passName,
                                                label: passName,
                                                displayLabel: passName,
                                                type: 'address',
                                                fieldType: 'standard',
                                                group: 'Custom Properties'
                                            });
                                        }
                                    }
                                } else {
                                    if (fieldKeyMap.indexOf(prop) > -1) {
                                        tempKeys.push(prop);
                                        // Check if we have all the props necessary to assume a field object:
                                        if (arrayContainsAnotherArray(tempKeys, fieldKeyMap)) {
                                            var dataType = obj.dataType.toLowerCase();
                                            if (dataType === 'percent') {
                                                dataType = 'percentage';
                                            } else if (designerDataTypes.indexOf(dataType) < 0) {
                                                dataType = 'string';
                                            }
                                            result.fieldResult.push({
                                                name: '[\'' + obj.fieldName + '\'][\'value\']',
                                                label: '[\'' + obj.fieldName + '\'][\'label\']',
                                                displayLabel: obj.label,
                                                type: dataType,
                                                fieldType: 'standard',
                                                group: 'Custom Fields'
                                            });
                                            tempKeys = []; // clear out if done with object props
                                        }
                                    }
                                    var newVal = name ? name + '[\'' + prop + '\']' : '[\'' + prop + '\']';
                                    var newField = {
                                        name: newVal,
                                        label: newVal,
                                        displayLabel: newVal,
                                        type: 'string',
                                        fieldType: 'standard',
                                        group: 'Custom Properties'
                                    };
                                    result.leafResult.push(newField);
                                }
                            }
                        });
                        return result;
                    };

                    $scope.addVars = function () {
                        $scope.datasource.contextVariables = $scope.datasource.contextVariables || [];
                        $scope.datasource.contextVariables.push({ 'name': '', 'val': '' });
                    };

                    $scope.addHeaders = function () {
                        $scope.datasource.value.header = $scope.datasource.value.header || [];
                        $scope.datasource.value.header.push({ 'name': '', 'val': '' });
                    };

                    //remove test variable from array
                    $scope.removeVars = function (index) {
                        if ($scope.disabled) { //preventing remove test variables on layout active
                            return;
                        }
                        $scope.datasource.contextVariables.splice(index, 1);
                        $scope.evaluate();
                    };

                    $scope.evaluate = function () {
                        //eval(ctrl);
                        //$scope.$eval(ctrl);
                        if ($scope.datasource) {
                            $scope.test = {};
                            _.set($scope.test, '$root.vlocity', {});
                            angular.copy($rootScope.vlocity, $scope.test.$root.vlocity);
                            angular.forEach($scope.datasource.contextVariables, function (ctxVar) {
                                if (ctxVar.name) {

                                    // this is used for the Preview tab to get the accountId that a layout with a context variable "loggedUser.AccountId"
                                    // would need to launch the layout by including the accountId in the iframe url
                                    if (ctxVar.name === 'loggedUser.AccountId' && ctxVar.val) {
                                        $rootScope.loggedUserAccountId = ctxVar.val;
                                    }

                                    _.set($scope.test, ctxVar.name, ctxVar.val);
                                }
                            });
                            if ($scope.datasource.type === 'Query' || $scope.datasource.type === 'Search') {
                                $scope.encryptDatasource();
                            }
                        }
                        $log.debug('$scope.test ', $scope.test);
                        if (!$rootScope.paramsByObj) {
                            $rootScope.paramsByObj = {};
                        }
                        // don't allow 'undefined' to be a key
                        if ($scope.objId && $scope.datasource && $scope.datasource.type) {
                            $rootScope.paramsByObj[$scope.objId] = $scope.test.params;
                        } else {
                            if ($rootScope.paramsByObj && $rootScope.paramsByObj[$scope.objId]) {
                                delete $rootScope.paramsByObj[$scope.objId]; // deleting if the datasource is set to null
                            }
                        }
                        //sending parent information to be shared with preview page
                        $rootScope.parentInfo = $scope.test.parent ? $scope.test.parent : null;

                    };
                    /**
                     * Check selected class for VlocityOpenInterface
                     * implementation
                     * @param  ApexClass object apexClass
                     * @return Boolean validClass
                     */
                    $scope.checkClassType = function (apexClass) {
                        $scope.classError = null;
                        var validClass = false;
                        //call remote action to validate
                        if (apexClass !== '' && typeof apexClass !== 'string') {
                            //if no namespace then set the field as blank - sf does not handle js null well
                            apexClass.NamespacePrefix = apexClass.NamespacePrefix ? apexClass.NamespacePrefix : '';
                            return remoteActions.doCheckClassType(apexClass.Name, apexClass.NamespacePrefix).then(
                                function (result) {
                                    validClass = result;
                                    if (validClass) {
                                        if (!$scope.datasource.value) { $scope.datasource.value = {}; }
                                        $scope.datasource.value.remoteClass = apexClass.Name;
                                        $scope.datasource.value.remoteNSPrefix = apexClass.NamespacePrefix ? apexClass.NamespacePrefix : null;
                                    }
                                    else {
                                        $localizable('ApexClassNotOpenInterface', 'Class does not implement the Vlocity Open Interface')
                                            .then(function (label) {
                                                $scope.classError = {
                                                    message: label
                                                };
                                            })
                                    }
                                    $log.debug('validClass ' + validClass);
                                    return validClass;
                                });
                        } else { //erasing the remoteClass field
                            if ($scope.datasource.value) {
                                $scope.datasource.value.remoteClass = ($scope.datasource.value.remoteClass !== apexClass) ? '' : $scope.datasource.value.remoteClass; //CARD 574
                            }
                            return true;
                        }
                    };

                    $scope.onJsonChange = function (jsonAsText) {
                        try {
                            JSON.parse(jsonAsText);
                            $scope.isInvalid = false;
                        } catch (e) {
                            $scope.isInvalid = true;
                        }
                    };

                    var cacheOfDatasourceMaps = {};

                    function KeyValuePair(key, value, sourceMap) {
                        this.key = this.previousKey = key;
                        this.value = value;
                        this.sourceMap = sourceMap ? sourceMap : {};
                    }

                    KeyValuePair.prototype.update = function (mapName) {
                        $log.debug('key update ', mapName, this);
                        if (this.key !== this.previousKey) {
                            delete this.sourceMap[this.previousKey];
                            delete cacheOfDatasourceMaps[mapName][this.previousKey];
                            this.previousKey = this.key;
                        }

                        this.sourceMap[this.key] = this.value;
                        cacheOfDatasourceMaps[mapName][this.key] = this;
                    };

                    $scope.propertySet = function (sourceMap, mapName) {
                        if (!cacheOfDatasourceMaps[mapName]) {
                            cacheOfDatasourceMaps[mapName] = {};
                        }
                        if (!sourceMap) {
                            sourceMap = {};
                        }
                        if (sourceMap) {
                            return Object.keys(sourceMap).filter(function (key) {
                                return true;
                            }).map(function (key) {
                                if (!cacheOfDatasourceMaps[mapName][key]) {
                                    cacheOfDatasourceMaps[mapName][key] = new KeyValuePair(key, sourceMap[key], sourceMap);
                                }
                                return cacheOfDatasourceMaps[mapName][key];
                            });
                        }
                        return [];
                    };

                    $scope.removeMapProperty = function (sourceMap, propName) {
                        if (sourceMap) {
                            delete sourceMap[propName];
                        }
                    };

                    $scope.addMapProperty = function (sourceMap, mapName) {
                        if (!sourceMap) {
                            sourceMap = {};
                        }
                        if (!$scope.datasource.value[mapName]) {
                            $scope.datasource.value[mapName] = {};
                        }
                        cacheOfDatasourceMaps[mapName][''] = new KeyValuePair('', '', sourceMap);
                        cacheOfDatasourceMaps[mapName][''].update(mapName);

                        sourceMap[''] = new KeyValuePair('', '', $scope.datasource.value[mapName]);
                        sourceMap[''].update(mapName);
                    };

                    $scope.bypassLayoutSave = function () {
                        $rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].bypassSave = true;
                    }

                    var pendingTimeout;
                    $scope.$watch(function () {
                        return angular.toJson($scope.datasource);
                    }, function (newValue, oldValue) {
                        if (pendingTimeout) {
                            $timeout.cancel(pendingTimeout);
                        }
                        pendingTimeout = $timeout(function () {
                            $scope.testDataSource(true);
                        }, 1000);
                    }, true);

                    $scope.$watch(function () {
                        return angular.toJson($scope.encryptedDatasource);
                    }, function (newValue, oldValue) {
                        if (pendingTimeout) {
                            $timeout.cancel(pendingTimeout);
                        }
                        pendingTimeout = $timeout(function () {
                            $scope.testDataSource(true);
                        }, 1000);
                    }, true);

                    // Watching objID as cards id gets created only after state is created which leads to lose of test variables
                    var objIdWatch = $scope.$watch(function () {
                        return ($scope.type === 'card') ? $scope.objId : '';
                    }, function (newValue, oldValue) {
                        if (newValue) {
                            $scope.testDataSource(true);
                            objIdWatch(); // clearing the watch once objId is generated
                        }
                    });

                    //SOSL Search
                    $scope.addObjMap = function (sObject) {
                        if (sObject) {
                            if ($scope.encryptedDatasource.value.objectMap === undefined) {
                                $scope.encryptedDatasource.value.objectMap = {};
                            }
                            $scope.encryptedDatasource.value.objectMap[sObject] = '';
                        }
                    };

                    $scope.removeObjMap = function (key) {
                        delete $scope.encryptedDatasource.value.objectMap[key];
                    };

                    $scope.$watch(function () {
                        return $rootScope.ipBundles;
                    }, function (newValue) {
                        if (newValue && $scope.datasource && $scope.datasource.value && $scope.datasource.value.ipMethod) {
                            $scope.getIpBundleId($scope.datasource.value.ipMethod, newValue);
                        }
                    });

                    //IP 

                    $scope.getIpBundleId = function (name, Bundles) {
                        var bundleId = $scope.getBundleByName(name, Bundles);
                        $scope.isIpActive = bundleId === undefined ? false : true;
                        return bundleId;
                    };

                    $scope.onChangeStreamingType = function () {
                        $scope.datasource.value.channel = '';
                        $scope.datasource.sampleDate = null;
                        $scope.isFetchingModalData = true;
                        $scope.fetchedModalData = null;
                    };

                    $scope.onChangeChannel = function () {
                        $scope.datasource.sampleDate = null;
                        $scope.isFetchingModalData = true;
                        $scope.fetchedModalData = null;
                    };

                    $scope.openUrl = window.vlocityOpenUrl;

                }]
        };

    });

},{}],12:[function(require,module,exports){
angular.module('carddesigner')
.factory('helpNode', function($rootScope, $modal) {
    'use strict';
    return {
        helpNodeModal: function helpNodeText($event, helpNode) {
            $event.stopPropagation();
            var modalScope = $rootScope.$new();
            modalScope.helpNode = helpNode ? 'docs/'+ helpNode + '.tpl.html': '';

            $modal({
                backdrop: 'static',
                scope: modalScope,
                templateUrl: 'helpModal.tpl.html',
                show: true
            });

            return false;
        }
    };
});

},{}],13:[function(require,module,exports){
angular.module('carddesigner')
.factory('interTabMsgBus', function() {
    'use strict';
    var listeners = {};
    var tabKey = Date.now().toString();
    var keysAdded = [];

    function handleStorageEvent(e) {
        e = e.originalEvent;
        if (e.key) {
            var keyParts = e.key.split('.');
            if (keyParts[0] === tabKey) {
                if (listeners[keyParts[1]]) {
                    listeners[keyParts[1]].forEach(function(callbackConfig) {
                        callbackConfig.fn.apply(callbackConfig.scope, [e.newValue, e.oldValue]);
                    });
                }
            }
        }
    }

    function emptySessionStorage() {
        keysAdded.forEach(function(key) {
            localStorage.removeItem(tabKey + '.' + key);
        });
    }

    $(window).on('storage', handleStorageEvent);
    $(window).on('beforeunload', emptySessionStorage);

    return {
        tabKey: function() {
            return tabKey;
        },
        on: function(key, listener, scope) {
            if (!listeners[key]) {
                listeners[key] = [];
            }
            listeners[key].push({
                fn: listener,
                scope: scope
            });
        },
        set: function(key, value) {
            keysAdded.push(key);
            localStorage.setItem(tabKey + '.' + key, value);
        },
        get: function(key) {
            return localStorage.getItem(tabKey + '.' + key);
        },
        delete: function(key) {
            localStorage.removeItem(tabKey + '.' + key);
        }
    };
});

},{}],14:[function(require,module,exports){
angular.module('carddesigner')
    .factory('SaveFactory', function ($q, remoteActions, $rootScope, $timeout, $window, $localizable, $log) {
        'use strict';
        var DEFAULT_AUTHOR = 'vlocity';
        function adaptLayoutJsonForSave(json, isLayout, ignoreCards) {
            return Object.keys(json).reduce(function (outputObject, key) {
                if (/(^Id|^Name|__c)$/.test(key)) {
                    outputObject[key] = json[key];
                    if (/Definition__c/.test(key)) {
                        if (isLayout && !ignoreCards) {
                            // update Deck on definition with the latest names of cards
                            outputObject[key].Cards = json[key].Cards = $rootScope.layoutCards.filter(function (card) {
                                return card !== null && card[$rootScope.nsPrefix + 'Active__c'];
                            }).map(function (card) {
                                return card.Name;
                            });
                        }
                        outputObject[key] = angular.toJson(outputObject[key]);
                    }
                }
                return outputObject;
            }, {});
        }

        function shouldSave(item, json, isLayout, ignoreCards) {
            //parse definition if it comes in as string
            item[$rootScope.nsPrefix + 'Definition__c'] = typeof item[$rootScope.nsPrefix + 'Definition__c'] === 'string' ?
                JSON.parse(item[$rootScope.nsPrefix + 'Definition__c']) : item[$rootScope.nsPrefix + 'Definition__c'];
            if (item.saving) {
                return false;
            } else if (!item.Name || item.Name === '' || item.Name === '*') {
                $localizable('CardDesignerMustSetName', 'Please provide a Layout name')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    })
                return false;
            }

            // if it is layout, check for template as it is mandatory
            if (isLayout && !item[$rootScope.nsPrefix + 'Author__c']) {
                $localizable('CardDesignerLayoutMustSelectAuthor', 'Please provide a Layout author')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    });
                return false;
            }

            // check for author name exists and not similar to default author 
            if ($rootScope.insidePckg && item[$rootScope.nsPrefix + 'Author__c'] && item[$rootScope.nsPrefix + 'Author__c'].toLowerCase() === DEFAULT_AUTHOR && !item.Id) {
                $localizable('DesignerMustSetAuthor', 'You cannot set Vlocity as your author')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    });
                return false;
            }

            // if it is layout with disabled LWC, check for template as it is mandatory
            if (isLayout && !item[$rootScope.nsPrefix + 'Definition__c'].enableLwc && (!item[$rootScope.nsPrefix + 'Definition__c'].templates ||
                item[$rootScope.nsPrefix + 'Definition__c'].templates.length === 0)) {
                $localizable('CardDesignerLayoutMustSelectTemplate', 'Please provide a template for the layout')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    });
                return false;
            }

            // if it is layout with enabled LWC, check for layout lwc as it is mandatory
            if (isLayout && item[$rootScope.nsPrefix + 'Definition__c'].enableLwc && !(item[$rootScope.nsPrefix + 'Definition__c'].lwc && item[$rootScope.nsPrefix + 'Definition__c'].lwc.DeveloperName)) {
                $localizable('CardDesignerLayoutMustSelectLwc', 'Please provide a component for the layout.')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    });
                return false;
            }

            // check layout name doesn't exist already
            if (isLayout && item.createNewLayout && $rootScope.layouts.find(function (layout) {
                // a layout name is duplicated if it was created by the "New" button from the CardHome page (item.createNewLayout)
                // and its name is the same as an existing one in the DB
                return layout.Name === item.Name && item[$rootScope.nsPrefix + 'Author__c'] === layout[$rootScope.nsPrefix + 'Author__c'] && item[$rootScope.nsPrefix + 'Version__c'] === layout[$rootScope.nsPrefix + 'Version__c'];
            })) {
                $localizable('CardDesignerNameAlreadyInUse', 'This name is already in use')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    });
                return false;
            }

            function convertNameToValidLWCCase(str) {
                return str
                  .replace(/\s(.)/g, function(a) {
                    return a.toUpperCase();
                  })
                  .replace(/\s/g, "")
                  .replace(/^(.)/, function(b) {
                    return b.toLowerCase();
                  })
                  .replace(/-(\w)/g, m => m[1].toUpperCase())
                  .replace(/__/g, "_")
                  .replace(/[^a-zA-Z0-9_]/g, "");
            }

            // check LWC component exist with same name (for this we first convert layout name to valid LWC name)
            if (isLayout && item.createNewLayout && item[$rootScope.nsPrefix + 'Definition__c'].enableLwc && $rootScope.lightningwebcomponents.find(function (component) {
                return (component.DeveloperName.toLowerCase() === (convertNameToValidLWCCase("cf-" + item.Name + "_" + item[$rootScope.nsPrefix + 'Version__c'] + "_" + item[$rootScope.nsPrefix + 'Author__c']).toLowerCase()) ||
                    component.DeveloperName.toLowerCase() === (convertNameToValidLWCCase("cf-" + item.Name).toLowerCase()));
                //return layout.Name === item.Name && item[$rootScope.nsPrefix + 'Author__c'] === layout[$rootScope.nsPrefix + 'Author__c'] && item[$rootScope.nsPrefix + 'Version__c'] === layout[$rootScope.nsPrefix + 'Version__c'];
            })) {
                $localizable('CardLWCComponentExistsError', 'Lightning Web Component with same name exists.')
                    .then(function (label) {
                        item.errors = [{
                            message: label
                        }];
                    });
                return false;
            }

            // Check if the layout already exists in case of enable lwc. Check for the layout name and author combination after formating the name and author of the layout.
            if (
                isLayout &&
                item.createNewLayout &&
                item[$rootScope.nsPrefix + "Definition__c"].enableLwc &&
                $rootScope.layouts.find(function(layout) {
                return (
                    JSON.parse(layout[$rootScope.nsPrefix + "Definition__c"])
                    .enableLwc === true &&
                    convertNameToValidLWCCase($rootScope.layout.Name).toLowerCase() ===
                    convertNameToValidLWCCase(layout.Name).toLowerCase() &&
                    convertNameToValidLWCCase(
                    $rootScope.layout[$rootScope.nsPrefix + "Author__c"]
                    ).toLowerCase() ===
                    convertNameToValidLWCCase(
                        item[$rootScope.nsPrefix + "Author__c"]
                    ).toLowerCase()
                );
                })
            ) {
                $localizable(
                    "LayoutLWCComponentExistsError",
                    "Lwc name already exists. Please try a different name or author"
                ).then(function(label) {
                    item.errors = [
                    {
                        message: label
                    }
                    ];
                });
                return false;
            };

            if (isLayout && !ignoreCards) {
                // don't save it if the change is a Card name and it's now invalid
                if ($rootScope.layoutCards.some(function (card) {
                    return card.Name === '' || card.Name === '*' || (card.errors && card.errors.length > 0);
                })) {
                    return false;
                }
            } else {
                // check card name doesn't exist already
                if (!ignoreCards && $rootScope.cards.find(function (card) {
                    return card.Name === item.Name && card[$rootScope.nsPrefix + 'Author__c'] === item[$rootScope.nsPrefix + 'Author__c'] && card.Id !== item.Id;
                })) {
                    if (item.originalJson) {
                        if (item.Name !== item.originalJson.Name && (item[$rootScope.nsPrefix + 'Author__c'] !== item.originalJson[$rootScope.nsPrefix + 'Author__c']
                            || item[$rootScope.nsPrefix + 'Version__c'] !== item.originalJson[$rootScope.nsPrefix + 'Version__c'])) { //make sure the name changed to a used name
                            $localizable('CardDesignerNameAlreadyInUse', 'This name is already in use')
                                .then(function (label) {
                                    item.errors = [{
                                        message: label
                                    }];
                                });
                        } else {
                            delete item.errors;
                        }
                    } else {
                        $localizable('CardDesignerNameAlreadyInUse', 'This name is already in use')
                            .then(function (label) {
                                item.errors = [{
                                    message: label
                                }];
                            });
                    }

                    //return false;
                }

                //check for author as it is mandatory
                if (!item[$rootScope.nsPrefix + 'Author__c']) {
                    $localizable('CardDesignerCardMustSelectAuthor', 'Please provide a Card author')
                        .then(function (label) {
                            item.errors = [{
                                message: label
                            }];
                        });
                    return false;
                }

                //check filter field key is not empty
                if (item[$rootScope.nsPrefix + 'Definition__c'] && item[$rootScope.nsPrefix + 'Definition__c'].filter) {
                    angular.forEach(item[$rootScope.nsPrefix + 'Definition__c'].filter, function (value, key) {
                        if (key === '' || value === '') {
                            $localizable('CardDesignerEmptyFilterKey', 'Please provide a Card filter key and value')
                                .then(function (label) {
                                    item.errors = [{
                                        message: label
                                    }];
                                });
                            return false;
                        }
                    });
                }

                if (item[$rootScope.nsPrefix + 'Definition__c'] && item[$rootScope.nsPrefix + 'Definition__c'].states && item[$rootScope.nsPrefix + 'Definition__c'].states.length === 0) {
                    $localizable('CardDesignerCardStateMustExist', 'Please provide a Card State')
                        .then(function (label) {
                            item.errors = [{
                                message: label
                            }];
                        });
                    return false;
                }

                if (item[$rootScope.nsPrefix + 'Definition__c'] && item[$rootScope.nsPrefix + 'Definition__c'].states && item[$rootScope.nsPrefix + 'Definition__c'].states.length > 0) {
                    angular.forEach(item[$rootScope.nsPrefix + 'Definition__c'].states, function (state) {
                        if (!$rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc && (!state.name || !state.templateUrl)) {
                            $localizable('CardDesignerCardStateMustHaveNameAndTemplate', 'Please provide a Card State name and template/component')
                                .then(function (label) {
                                    item.errors = [{
                                        message: label
                                    }];
                                });
                            return false;
                        }
                        if ($rootScope.layout[$rootScope.nsPrefix + 'Definition__c'].enableLwc && (!state.name || !(state.lwc && state.lwc.DeveloperName))) {
                            $localizable('CardDesignerCardStateMustHaveNameAndTemplate', 'Please provide a Card State name and template/component')
                                .then(function (label) {
                                    item.errors = [{
                                        message: label
                                    }];
                                });
                            return false;
                        }
                    });
                }

            }

            if (!$rootScope.doneLoading) {
                return false;
            }

            //locked card
            if (item.locked) {
                return false;
            }

            if (angular.equals(item.originalJson, json)) {
                //Making sure this gets called even if card is not saving, this will help it to not miss any update
                if (!isLayout) {
                    $rootScope.$broadcast('savedCard', item)
                }
                return false;
            }

            item.originalJson = json;
            item.saving = true;
            item.errors = null;
            return item;
        }

        function saveLayout(layout, ignoreCards) {
            let newUrl;
            layout.errors = null;
            var jsonToSave = adaptLayoutJsonForSave(layout, true, ignoreCards);
            var hasError = _.find($rootScope.layoutCards, { errors: [] });
            if (hasError && hasError.errors.length > 0) {
                $localizable('CardErrorShouldBeResolved', 'Please resolve card errors to save layout.')
                    .then(function (label) {
                        layout.errors = [{
                            message: label
                        }];
                    });
                return layout;
            }

            if (shouldSave(layout, jsonToSave, true, ignoreCards)) {
                layout.saving = true;

                jsonToSave[$rootScope.nsPrefix + 'Datasource__c'] = typeof jsonToSave[$rootScope.nsPrefix + 'Datasource__c'] === 'object' ?
                    JSON.stringify(jsonToSave[$rootScope.nsPrefix + 'Datasource__c']) :
                    jsonToSave[$rootScope.nsPrefix + 'Datasource__c'];
                return remoteActions.saveLayout(jsonToSave).then(function (updatedLayout) {
                    layout.saving = false;
                    $rootScope.$broadcast('saved', layout);
                    if (updatedLayout) {
                        //updating global key if layout was cloned or is a new version
                        layout[$rootScope.nsPrefix + 'GlobalKey__c'] = layout[$rootScope.nsPrefix + 'GlobalKey__c'] ?
                            layout[$rootScope.nsPrefix + 'GlobalKey__c'] :
                            updatedLayout[$rootScope.nsPrefix + 'GlobalKey__c']
                        layout.Id = updatedLayout.Id;
                        var existingId = $window.location.href.split(/[?&]/).find(function (item) {
                            return /^id\=/.test(item);
                        });
                        if (existingId) {
                            existingId = existingId.replace(/^id=/, '');
                        }
                        if (!existingId || existingId !== layout.Id) {
                            $timeout(function () {
                                if (existingId) {
                                    var pathname = $window.location.href.replace(existingId, layout.Id);
                                    $window.history.pushState('', '', pathname);
                                } else {
                                    let pathname = $window.location.pathname;
                                    let arr = pathname.split('/');
                                    if (!arr[2].includes($rootScope.nsPrefix)) {
                                        arr[2] = $rootScope.nsPrefix + arr[2]
                                        pathname = arr.join('/');
                                    }
                                    newUrl = pathname +
                                        ($window.location.search.length === 0 ? '?' :
                                            $window.location.search + '&') + 'id=' + layout.Id;
                                    $window.history.pushState('', '', newUrl);
                                    if (!(sforce.console && sforce.console.isInConsole())) {
                                        $window.location = newUrl;
                                    }
                                }
                            });
                        }
                        if (updatedLayout.errors) {
                            layout.errors = updatedLayout.errors;
                        } else if (updatedLayout.type === 'exception') {
                            layout.errors = [{
                                message: updatedLayout.message
                            }];
                        }
                    }
                    delete layout[$rootScope.nsPrefix + 'Definition__c'].bypassSave;
                    $rootScope.authorLocked = layout[$rootScope.nsPrefix + 'Author__c'] && layout.Id;
                    if (sforce.console && sforce.console.isInConsole()) {
                        if ($rootScope.newLayout) {
                            let tabId;
                            sforce.console.getEnclosingTabId(function (result) {
                                tabId = result.id;
                                $timeout(function () {
                                    sforce.console.closeTab(result.id);
                                });
                            });
                            sforce.console.getEnclosingPrimaryTabId(function (result) {
                                if (tabId === result.id) {
                                    sforce.console.openPrimaryTab(null, newUrl, false,
                                        layout.Name, null, null, null);
                                } else {
                                    sforce.console.openSubtab(result.id, newUrl, false,
                                        layout.Name, null, null, null);
                                }
                            });
                        } else {
                            sforce.console.setTabTitle(layout.Name);
                            sforce.console.onFocusedSubtab(function (tab) {
                                sforce.console.setTabTitle(layout.Name);
                            });
                        }
                    }
                    else {
                        $window.document.title = layout.Name;
                    }
                    return layout;
                }, function (error) {
                    $log.debug('bad save layout promise ', error);
                    layout = layout || {};
                    layout.saving = false;
                    layout.errors = [{
                        message: error.message,
                        data: error
                    }];
                    return layout;
                })
                    .catch(function (error) {
                        $log.debug('saving layout error ', error);
                        layout = layout || {};
                        layout.saving = false;
                        layout.errors = [{
                            message: error.message,
                            data: error
                        }];
                    });
            } else {
                return $q.when(layout);
            }
        }

        /**
         * 
         * @param {*} objA : first object to compare
         * @param {*} objB : object to check against
         * @param {*} ignoreFields : fields to ignore in comparison
         * @returns success: true if objects are equal
         */
        function deepCheckEquals(objA, objB, ignoreFields) {
            var success = true;
            if (objA) {
                if (angular.isArray(objA) && angular.equals(objA, objB)) {
                    return success;
                }
                for (var field in objB) {
                    //check if we're ignoring this field
                    if (!ignoreFields || ignoreFields.indexOf(field) === -1) {
                        if (objA.hasOwnProperty(field) && success) {
                            if (typeof objA[field] === 'object') {
                                success = deepCheckEquals(objA[field], objB[field]);
                            } else {
                                if (angular.equals(objA[field], objB[field])) {
                                    // $log.debug('and theyre equal too ', field, objA[field], objB[field]);
                                } else {
                                    $log.debug('bad field ', field, objA, objB);
                                    success = false;
                                    return success;
                                }
                            }
                        } else {
                            success = false;
                            return success;
                        }
                    } else {
                        $log.debug('ignored field ', field);
                    }
                }
            } else {
                success = false;
                return success;
            }
            return success;
        }

        function saveCard(card) {
            var jsonToSave = adaptLayoutJsonForSave(card);
            var index = -1;
            if (shouldSave(card, jsonToSave)) {
                card.saving = true;
                jsonToSave[$rootScope.nsPrefix + 'Datasource__c'] = typeof jsonToSave[$rootScope.nsPrefix + 'Datasource__c'] === 'object' ?
                    JSON.stringify(jsonToSave[$rootScope.nsPrefix + 'Datasource__c']) :
                    jsonToSave[$rootScope.nsPrefix + 'Datasource__c'];
                return remoteActions.saveCard(jsonToSave).then(function (updatedCard) {
                    card.saving = false;
                    $rootScope.$broadcast('saved', card);
                    if (updatedCard) {
                        index = _.findIndex($rootScope.cards, { 'Id': updatedCard.Id });
                        if (card.$ignoreSave) {
                            updatedCard.$ignoreSave = true;
                        }
                        if (card.Id !== updatedCard.Id) {
                            card.Id = updatedCard.Id;
                            $rootScope.cards.push(card);
                        }
                        // modify the updated card data in existing list
                        if ($rootScope.cards && index !== -1) {
                            $rootScope.cards[index] = updatedCard;
                        }
                        if (updatedCard.errors) {
                            card.errors = updatedCard.errors;
                        } else if (updatedCard.type === 'exception') {
                            card.errors = [{
                                message: updatedCard.message
                            }];
                        }
                        //throw the event directly to the CardController for updating values
                        $rootScope.$broadcast('savedCard', updatedCard);
                        return card;
                    }
                }).catch(function (error) {
                    card.saving = false;
                    card.errors = [{
                        message: error.message
                    }];
                });
            } else {
                return $q.when(card);
            }
        }

        return {
            save: function (layout, cards, ignoreCards) {
                if (!layout || (!cards && !ignoreCards)) {
                    //throw "Missing cards or layout when trying to save!";
                    return $q.when(layout);
                }
                if (ignoreCards) {
                    return $q.when(saveLayout(layout, !!ignoreCards));
                }
                return $q.all(cards.filter(function (card) {
                    return !(card.Name === '' && !card.originalJson);
                }).map(function (card) {
                    return saveCard(card);
                })).then(function () {
                    return saveLayout(layout);
                });
            },
            checkObjEquality: function (objA, objB, ignoreFields) {
                return deepCheckEquals(objA, objB, ignoreFields);
            }
        };
    });

},{}],15:[function(require,module,exports){
angular.module('carddesigner').factory('sObjectsFactory', function ($q, remoteActions, dataService) {
    'use strict';
    var service = {
        getAllObjects: getAllObjects
    };

    var sObjectCount;
    var sObjects = null;
    var inProgressPromise = null;
    var currentIndex = 0;
    var inProgressSObjects = [];


    return service;
    ////////////////
    function getAllObjects() {
        return dataService.doGenericInvoke('CardCanvasController', 'getAllObjectsCount').then(function (data) {
            sObjectCount = data.result;
            if (sObjects) {
                return $q.resolve(sObjects);
            }

            return getObjectsFromRemote()
                .then(function (resolvedSObjects) {
                    return sObjects = resolvedSObjects;
                });
        });
    }

    function getObjectsFromRemote() {
        if (inProgressPromise) {
            return inProgressPromise;
        }
        // We're loading these async to avoid timeouts in the page.
        inProgressPromise = groupPagedRequests()
            .then(function (allSObjects) {
                inProgressPromise = null;
                return allSObjects;
            })
            .catch(function () {
                inProgressPromise = null;
            })

        return inProgressPromise;
    }

    /**
     * a bit of hack to put a number of requests at the same time
     */
    function groupPagedRequests() {
        var requests = [];
        let pageSize = Math.floor(sObjectCount / 500) + 1;
        for (var i = 0; i < pageSize; i++) {
            requests.push(getObjectsPaged());
        }
        return $q.all(requests)
            .then(function () {
                return inProgressSObjects;
            });
    }

    function getObjectsPaged() {
        let inputMap = {
            'index' : currentIndex++
        };
        return dataService.doGenericInvoke('CardCanvasController', 'getAllObjectsPaged', JSON.stringify(inputMap)).then(function (sObjects) {
                inProgressSObjects = inProgressSObjects.concat(sObjects.result.map(function (sObject) {
                    return Object.assign({}, sObject, {
                        "value": sObject.name,
                        "readableName": sObject.name,
                        "label": sObject.name
                    });
                }));
                if (sObjects.result.length > 0) {
                    return getObjectsPaged();
                } else {
                    return inProgressSObjects;
                }
            })
    }
});


},{}],16:[function(require,module,exports){
angular.module('carddesigner')
  .filter('filterAndSort', function() {
      'use strict';
      return function(allCards, cardsToRemove, filterBy) {
          if (!allCards) {
              return [];
          }
          if (cardsToRemove) {
              var regexOfNamesToRemove = cardsToRemove.reduce(function(regex, card, index) {
                  if (!card[filterBy]) {
                      return regex;
                  }
                  //using lodash's escapeRegex in order to be able to use special chars
                  var retVal = _.escapeRegExp(card[filterBy].replace(/\*/g, '\\*'));
                  return regex += (index > 0 ? '|' : '') + retVal;
              }, '^(') + ')$';
              regexOfNamesToRemove = new RegExp(regexOfNamesToRemove);
              allCards = allCards.filter(function(card) {
                  var cardName = card.Name || card.name;
                  return !regexOfNamesToRemove.test(cardName);
              });
          }
          return allCards.sort(function(a, b) {
              var aName = a.Name ? a.Name.toLowerCase() : a.name ? a.name.toLowerCase() : '',
                  bName = b.Name ? b.Name.toLowerCase() : b.name ? b.name.toLowerCase() : '';
              if (aName === '<<empty card>>') {
                  return -1;
              } else if (bName === '<<empty card>>') {
                  return 1;
              }
              return aName > bName ? 1 : (aName < bName ? -1 : 0);
          });
      };
  });

},{}],17:[function(require,module,exports){
angular.module("carddesigner").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("CardTemplate.tpl.html",'<h3>\n  <i class="icon icon-v-right-arrow"\n        ng-show="card.collapse"\n        ng-click="card.collapse = !card.collapse; card.drag = false;"></i>\n  <i class="icon icon-v-down-arrow"\n        ng-show="!card.collapse"\n        ng-click="card.collapse = !card.collapse; card.drag = true;"></i>\n    <span>\n      <i class="icon icon-v-information-line" ng-if="$root.mapOfCardsToLayouts[card.Name] === undefined || $root.mapOfCardsToLayouts[card.Name].length <= 1"\n            data-container=".container"\n            data-type="info" bs-tooltip="card"\n            bs-enabled="true"\n            data-html = "true"\n            data-title="This card is only used in this layout."></i>\n      <i class="icon icon-v-information-line" ng-if="$root.mapOfCardsToLayouts[card.Name].length > 1"\n            data-container=".container"\n            data-type="info" bs-tooltip="card"\n            bs-enabled="true"\n            data-html = "true"\n            data-title="This card is also used in the following layouts: {{$root.mapOfCardsToLayouts[card.Name].join(\', \')}}"></i>\n        {{card.Name}}&nbsp;\n    </span>\n    <i class="icon icon-v-grip pull-right" ng-drag-handle="ng-drag-handle"></i>\n    <i ng-if="card.saving" class="pull-right spinner"></i>\n    <button type="button" ng-if="!card.saving && !$root.layout.savinglwc" class="btn btn-link pull-right"\n        title="{{ ::\'deletecardIconLabel\' | localize:\'Remove/Delete Card\' }}"\n        bs-tooltip \n        data-container=".container" \n        ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n        ng-click="delete(card)">\n        <span class="icon icon-v-trash"></span>\n    </button>\n    <button type="button" ng-if="!card.saving" class="btn btn-link pull-right"\n        title="{{ ::\'cloneCardIconLabel\' | localize:\'Clone Card\' }}"\n        bs-tooltip \n        data-container=".container" \n        ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n        ng-click="showCloneModal(card)">\n        <span class="icon icon-v-copy"></span>\n    </button>\n    <button type="button" ng-click="toggleJsonEditor(card)"\n        title="{{ ::\'editCardJSONIconLabel\' | localize:\'Edit Card JSON\' }}"\n        bs-tooltip \n        data-container=".container" \n        ng-if="!$root.layout[nsPrefix + \'Active__c\'] && !card[nsPrefix + \'Active__c\'] && !card.saving && !$root.lockedLayout && !isLockedCard(card)"\n        class="btn btn-link pull-right"><span>{ }</span></button>\n    <i class="icon icon-v-claim text-danger pull-right" ng-if="card.errors.length > 0"\n            data-container=".container"\n            data-type="danger" bs-tooltip="card"\n            bs-enabled="true"\n            data-html = "true"\n            data-title="{{errors[0].message}}"></i>\n      \n</h3>\n\x3c!-- <form ng-show="!card.collapse" dnd-nodrag> --\x3e\n<form ng-show="!card.collapse">\n  <div class="row">\n    <div class="form-group col-lg-12">\n      <label for="name">Name</label>\n      <input type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}" ng-model="card.Name" ng-disabled="card.lockName || $root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card) || card.Id" autocomplete="new-password" />\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-12">\n      <label for="name">Title</label>\n      <input id="{{card.idName}}-title" type="text" class="form-control" ng-model="card[nsPrefix + \'Definition__c\'].title" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)" autocomplete="new-password" />\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-12">\n      <label for="name">Author</label>\n      <input type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}" ng-model="card[nsPrefix + \'Author__c\']" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card) || (card.Id && card[nsPrefix + \'Author__c\'])" autocomplete="new-password" />\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-12" ng-if="card[nsPrefix + \'ParentID__c\']">\n      <label for="name">Parent Card</label>\n      <div><label> {{::getParent(card, \'name\')}} by {{::getParent(card,\'author\')}}</label></div>\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-5">\n      <div class="toggle-switch">\n        <span class="toggle-label toggle-to">Activate:</span>\n        <div class="switch">\n          <input id="cmn-toggle-{{card.Id}}" class="cmn-toggle cmn-toggle-round" type="checkbox" ng-disabled="(card.errors.length > 0 && !card[$root.nsPrefix+\'Active__c\']) || $root.layout[nsPrefix + \'Active__c\']"\n            ng-model="card[nsPrefix + \'Active__c\']" ng-change="toggleCardActivation(card)">\n          <label for="cmn-toggle-{{card.Id}}"></label>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-5">\n      <label for="name">Version {{card[$root.nsPrefix+\'Version__c\'] || \'Legacy\'}}</label>\n    </div>\n    \x3c!-- <div class="form-group col-lg-4">\n      <button type="button" class="btn btn-default always-active btn-block" ng-disabled="$root.layout.errors.length>0 || disableVersionBtn"\n        ng-click="showCloneModal($event)"> Clone </button>\n    </div> --\x3e\n    <div class="form-group col-lg-5">\n      <button id="{{card.idName}}-new-version-btn" type="button" class="btn btn-default always-active btn-block" ng-disabled="$root.layout.errors.length>0 || disableVersionBtn  || $root.lockedLayout || $root.layout[nsPrefix + \'Active__c\']"\n        ng-click="newVersion(card)"> Create Version </button>\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-12 filter">\n      <h5 for="name"><strong>Filter</strong> </h5>\n      <hr class="no-margin" />\n      <div class="row" ng-repeat="property in propertySet(card) track by property.key">\n        <div class="form-group col-lg-6">\n          <input  type="text" id="{{card.idName}}-filter-name-{{$index}}" class="form-control"\n                  ng-model="property.key"\n                  bs-options="field.name as field.name for field in fieldsFromLayoutOrActiveCard | filterAndSort:card.fields:\'name\'"\n                  bs-typeahead="bs-typeahead"\n                  ng-change="property.update()"\n                  data-watch-options="true" \n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout" autocomplete="new-password" />\n        </div>\n        <div class="form-group col-lg-1 nopadding">\n          <span class="equal-operator">=</span>\n        </div>\n        <div class="form-group col-lg-3 nopadding">\n          <input id="{{card.idName}}-filter-val-{{$index}}" class="form-control" type="text" ng-model="property.value" ng-change="property.update()" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)" autocomplete="new-password" />\n        </div>\n        <div class="form-group col-lg-2">\n            <a  id="{{card.idName}}-filter-delete-{{$index}}" class="btn btn-link pull-left" ng-href="#" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)"><i class="icon icon-v-trash" ng-click="removeFilterProperty(card,property.key)"></i></a>\n        </div>\n      </div>\n      <div class="row">\n        <div class="col-lg-12">\n          <button id="{{card.idName}}-add-filter" type="button" class="btn btn-link" ng-click="addFilter(card)"\n          \tng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Definition__c\'].filter[\'\'] == \'\' || $root.lockedLayout || isLockedCard(card)">\n          \t\t+ Add Filter\n          </button>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class="row">\n    <div class="context-variables">\n        <div class="form-group col-lg-12">\n          <h5><strong>Card Session Variables</strong> </h5>\n          <hr class="no-margin" />\n        </div>\n        <div class="form-group col-lg-12" ng-show="card[$root.nsPrefix+\'Definition__c\'][\'sessionVars\'].length > 0">\n          <div class="row" ng-repeat="sessionVar in card[$root.nsPrefix+\'Definition__c\'][\'sessionVars\']">\n            <div class="form-group col-lg-5">\n              <label for="cardBundle" ng-if="$first">Name</label>\n              <input type="text" id="{{card.idName}}-variable-name-{{$index}}" class="form-control" ng-model="sessionVar.name" placeholder="Variable name" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)" autocomplete="new-password" />\n           </div>\n           <div class="form-group col-lg-5">\n              <label for="cardBundle" ng-if="$first">Value</label>\n              <input type="text" id="{{card.idName}}-variable-val-{{$index}}" class="form-control" ng-model="sessionVar.val" placeholder="Variable value" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)" autocomplete="new-password" />\n           </div>\n            <div class="form-group col-lg-2">\n              <label for="cardBundle" ng-if="$first">&nbsp;</label>\n              <span class="col-lg-1">\n                <a id="{{card.idName}}-variable-delete-{{$index}}" class="btn btn-link pull-right" ng-href="#"><i class="icon icon-v-trash" ng-click="removeSessionVar($index, card)" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)"></i></a>\n              </span>\n            </div>\n          </div>\n        </div>\n        <div class="form-group col-lg-12">\n          <button id="{{card.idName}}-add-session" type="button" class="btn btn-link" ng-click="addSessionVars(card)" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)">+ Add Session Variables</button>\n        </div>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col-lg-12">\n      <h4 ng-click="collapse = !collapse">\n        <i class="icon icon-v-right-arrow" ng-show="collapse"></i>\n        <i class="icon icon-v-down-arrow" ng-show="!collapse"></i>\n        Metatags\n        <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event, \'metatag\')">\n          <i class="icon icon-v-information-line"></i>\n        </a>\n      </h4>\n    </div>\n  </div>\n  <div class="row" ng-show="!collapse">\n    <div class="context-variables">\n        <div class="form-group col-lg-12" ng-show="card[$root.nsPrefix+\'Definition__c\'][\'metatagVars\'].length > 0">\n          <div class="row" ng-repeat="metatag in card[$root.nsPrefix+\'Definition__c\'][\'metatagVars\']">\n            <div class="form-group col-lg-5">\n              <label for="cardBundle" ng-if="$first">Name</label>\n              <input id="{{card.idName}}-metatag-var-name-{{$index}}" bs-options="field.name as field.name for field in knownMetatags| filterAndSort:card[$root.nsPrefix+\'Definition__c\'][\'metatagVars\']:\'name\'"\n              bs-typeahead="bs-typeahead" type="text" class="form-control" ng-model="metatag.name" ng-blur="updateMetatag(metatag.name, card)" placeholder="Metatag name" ng-disabled="$root.layout[nsPrefix + \'Active__c\']  || $root.lockedLayout" autocomplete="new-password" />\n           </div>\n           <div class="form-group col-lg-5">\n              <label for="cardBundle" ng-if="$first">Value</label>\n              <input id="{{card.idName}}-metatag-var-value-{{$index}}" type="text" class="form-control" ng-model="metatag.val" placeholder="Metatag value" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout" autocomplete="new-password" />\n           </div>\n            <div class="form-group col-lg-2">\n              <label for="cardBundle" ng-if="$first">&nbsp;</label>\n              <span class="col-lg-1">\n                <a id="{{card.idName}}-metatag-var-delete-{{$index}}" class="btn btn-link pull-right" ng-href="#"  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout">\n                  <i class="icon icon-v-trash" ng-click="removeMetatag($index, card)" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout"></i>\n                </a>\n              </span>\n            </div>\n          </div>\n        </div>\n        <div class="form-group col-lg-12">\n          <button id="{{card.idName}}-metatag-var-add-btn"type="button" class="btn btn-link" ng-click="addMetatags(card)" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout">+ Add Metatags</button>\n        </div>\n    </div>\n  </div>\n  <div class="row" >\n    <div class="col-lg-12">\n      \x3c!-- <datasourcefilter datasource="card[nsPrefix + \'Definition__c\'].dataSource" \n                        type="\'card\'" \n                        disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)"\n                        obj="card"\n                        obj-id="card.Id"></datasourcefilter> --\x3e\n      <datasourcefilter encrypted-datasource = "card[nsPrefix + \'Datasource__c\']"\n                        datasource="card[nsPrefix + \'Definition__c\'].dataSource"  type="\'card\'" \n                        disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)"\n                        obj="card"\n                        obj-id="card.Id"></datasourcefilter>\n      </div>\n    </div>\n  </div>\n</form>'),$templateCache.put("TypeaheadCustomTemp.tpl.html",'<ul tabindex="-1" class="typeahead dropdown-menu custom-typeahead" ng-show="!$root.layout[nsPrefix + \'Active__c\'] && !card[nsPrefix + \'Active__c\'] && !$root.lockedLayout && !card.locked && $isVisible()" role="select">\n    <li role="presentation" ng-repeat="match in $matches" ng-class="{active: $index == $activeIndex}">\n        <div class="typeaheadGroup" ng-if="match.value.isGroupedBy">{{ match.value.isGroupedBy }}</div>\n        <a role="menuitem" tabindex="-1" ng-click="$select($index, $event);" ng-bind="match.label"></a>\n    </li>\n</ul>'),$templateCache.put("CustomPageModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n    <div class="modal-dialog">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close" aria-label="Close" ng-click="$hide();updatePreviewModes();"><span aria-hidden="true">&times;</span></button>\n                <h4 class="modal-title">Custom Page</h4>\n            </div>\n            <div class="modal-body docsModalBody">\n                <div class="row">\n                    <div class="context-variables">\n                        <div class="form-group col-lg-12" ng-show="$root.layout[$root.nsPrefix+\'Definition__c\'][\'customPreviewPages\'].length > 0">\n                            <div class="row" ng-repeat="customPage in $root.layout[$root.nsPrefix+\'Definition__c\'][\'customPreviewPages\']">\n                                <div class="form-group col-lg-5">\n                                    <label for="cardBundle" ng-if="$first">Page Name</label>\n                                    <input type="text" class="form-control" ng-model="customPage.page" ng-change="updateCustomPage(customPage)" bs-options="page.Name as page.Name for page in $root.apexPages" bs-typeahead="bs-typeahead" placeholder="Page name" />\n                                </div>\n                                 <div class="form-group col-lg-5">\n                                    <label for="cardBundle" ng-if="$first">Page Label</label>\n                                    <input type="text" class="form-control" ng-model="customPage.label" placeholder="Page label" />\n                                </div>\n                                <div class="form-group col-lg-1">\n                                    <label for="cardBundle" ng-if="$first">&nbsp;</label>\n                                    <button class="button btn btn-link pull-right"><i class="icon icon-v-trash" ng-click="removeCustomPage($index)"></i></button>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="form-group col-lg-12">\n                            <button type="button" class="btn btn-link" ng-click="addCustomPage()">+ Add Custom Page</button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" ng-click="$hide();updatePreviewModes();">{{ ::\'helpDialogClose\' | localize: \'Close\' }}</button>\n            </div>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("StateTemplate.tpl.html",'<h2 ng-class="{\'collapsed\': state.collapse}">\n  <i class="icon icon-v-right-arrow" ng-show="state.collapse" ng-click="state.collapse = !state.collapse"></i>\n  <i class="icon icon-v-down-arrow" ng-show="!state.collapse" ng-click="state.collapse = !state.collapse"></i>\n  {{state.name}}&nbsp;\n  <button ng-if="$root.layout[nsPrefix + \'Definition__c\'].enableLwc" class="btn btn-link no-margin-padding"\n    ng-click="helpNode.helpNodeModal($event, \'cardState\');$event.stopPropagation();"><i\n      class="icon icon-v-information-line"></i></button>\n  <i class="icon icon-v-claim-line" ng-if="hasErrors(state)" data-container=".container" data-type="info"\n    bs-tooltip="element" bs-enabled="true" data-html="true" data-title="{{errors[0].message}}"></i>\n\n  <i class="icon icon-v-grip pull-right" ng-drag-handle="ng-drag-handle"></i>\n  <i ng-if="isSaving(state)" class="pull-right spinner"></i>\n  <button id="{{setId(state.name,\'delete-btn\')}}" type="button" ng-if="!isSaving(state)" class="btn btn-link pull-right"\n    title="{{ ::\'CardDesignerDeleteState\' | localize:\'Delete State\' }}" bs-tooltip data-container=".container"\n    ng-click="delete(state, \'state\')"\n    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n    <span class="icon icon-v-trash"></span>\n  </button>\n  <button id="{{setId(state.name,\'clone-btn\')}}" type="button" ng-if="!isSaving(state)" class="btn btn-link pull-right"\n    title="{{ ::\'CardDesignerCloneState\' | localize:\'Clone State\' }}" bs-tooltip data-container=".container"\n    ng-click="clone(state)"\n    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n    <span class="icon icon-v-copy"></span>\n  </button>\n  <div class="pull-right">\n    <form class="form-inline">\n      <div class="form-group" ng-show="state.editMode">\n        <label for="state.editCustomCallback">Custom JS Callback For Edit</label>\n        <input id="{{setId(state.name,\'edit-custom-callback\')}}" type="text" class="form-control custom-js-callback"\n          ng-model="state.editCustomCallback"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n          placeholder="Leave Blank for Default" autocomplete="new-password" />\n      </div>\n      <label ng-if="$root.layout[nsPrefix + \'Definition__c\'].enableLwc">\n        <input id="{{setId(state.name,\'custom-lwc\')}}" class="blank-card-state" type="checkbox"\n          ng-change="customLwcToggle(state)" ng-model="state.customLwc"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked" />{{ ::\'stateCustomLwc\' | localize:\'Custom LWC\' }}\n      </label>\n      <label>\n        <input id="{{setId(state.name,\'edit-mode\')}}" class="blank-card-state" type="checkbox"\n          ng-change="editModeToggle(state)" ng-model="state.editMode"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked" />{{ ::\'stateEditMode\' | localize:\'Edit Mode State\' }}\n      </label>\n      <label>\n        <input id="{{setId(state.name,\'blank-card\')}}" class="blank-card-state" type="checkbox"\n          ng-change="blankStateCheck(state)" ng-model="state.blankCardState"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked" />{{ ::\'stateBlankCard\' | localize:\'Blank Card State\' }}\n      </label>\n    </form>\n  </div>\n</h2>\n\x3c!-- <form ng-show="!state.collapse" dnd-nodrag on-submit="return false;"> --\x3e\n<form ng-show="!state.collapse" on-submit="return false;">\n  <div class="row">\n    <div class="form-group col-sm-6">\n      <label for="name">Name</label>\n      <input id="{{setId(state.name,\'state-name\')}}" type="text" class="form-control" ng-model="state.name"\n        ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n        autocomplete="new-password" />\n    </div>\n    <div class="form-group col-sm-6" ng-if="!$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n      <label for="name" ng-init="changeTemplate(state)">Template</label>\n      <div class="input-group">\n        <input id="{{setId(state.name,\'temp-name\')}}" type="text" data-template="TypeaheadCustomTemp.tpl.html"\n          class="form-control" ng-model="state.templateUrl"\n          bs-options="template as template.Name for template in $root.templates | orderBy: [nsPrefix + \'Type__c\', \'Name\'] | groupByField : nsPrefix + \'Type__c\'"\n          bs-typeahead="bs-typeahead" autocomplete="new-password" ng-change="changeTemplate(state)"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n\n        <span class="input-group-btn">\n          <a class="btn btn-link pull-right" title="{{ ::\'editTemplateIconLabel\' | localize:\'Edit Template\' }}"\n            ng-click="openUrl(templateUrlPrefix + state.templateUrl,$event, true)" bs-tooltip\n            data-container=".container"><i class="icon icon-v-link"></i></a>\n        </span>\n      </div>\n      <div class="input-group" ng-if="isTemplateActive(state.templateUrl)">\n        <label class="text-danger"><i class="icon icon-v-warning-circle-line text-danger"></i>\n          {{ ::\'TemplateNotActiveLabel\' | localize:\'The template is inactive/invalid\' }} </label>\n      </div>\n    </div>\n\n    <div class="form-group col-sm-6" ng-if="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n      <label for="name" ng-init="changeTemplate(state)">State LWC</label>\n      <div class="input-group">\n        <input id="{{setId(state.name,\'temp-name\')}}" type="text" data-template="TypeaheadCustomTemp.tpl.html"\n          class="form-control" ng-model="state.lwc"\n          bs-options="template as template.MasterLabel for template in $root.lightningwebcomponents"\n          bs-typeahead="bs-typeahead" autocomplete="new-password" ng-change="selectLwc(card.Name, state)"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n        <span class="input-group-btn">\n          <a class="btn btn-link pull-right download-icon-grey" title="{{ ::\'DownloadLWC\' | localize:\'Download LWC\' }}"\n            ng-disabled="isManagedLWC(state.lwc) || $root.downloadingLwc" ng-click="downloadLWCByName(state.lwc)" bs-tooltip\n            data-container=".container"><i class="icon icon-v-download2" ng-class="{\'icon-grey-disable\':isManagedLWC(state.lwc)}"></i></a>\n        </span>\n        <span class="input-group-btn" ng-if="isManagedLWC(state.lwc)">\n          <a class="btn btn-link pull-right" href="javascript:void(0);"><i class="icon icon-v-information-line" data-container=".container"\n            data-type="info" bs-tooltip="card" bs-enabled="true" data-html="true"\n            data-title="{{ ::\'VlocityComponentsNotDownloadable\' | localize:\'Vlocity LWC templates and base components are not downloadable\' }}"></i></a>\n        </span>\n      </div>\n      <div class="input-group" ng-if="isLwcActive(state.lwc.DeveloperName)">\n        <label class="text-danger"><i class="icon icon-v-warning-circle-line text-danger"></i>\n          {{ ::\'LwcNotActiveLabel\' | localize:\'The LWC is inactive/invalid\' }} </label>\n      </div>\n    </div>\n\n\n\n  </div>\n  <div class="row">\n    \x3c!-- FIELDS --\x3e\n    <div class="form-group col-sm-12"\n      ng-show="!state.blankCardState && !(state.customLwc && $root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc)">\n      <label for="name">Fields</label>\n      \x3c!-- Restrict drag and drop of fields and actions within their state --\x3e\n      <ul class="field-list" ng-if="state.fields.length"\n        dnd-disable-if="$parent.$parent.$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n        dnd-list="state.fields"\n        dnd-drop="dropFieldCallback(event, index, item, external, type, allowedType, $parent.state)"\n        dnd-allowed-types="[\'field-{{$parent.$index}}\']">\n        <li ng-repeat="field in state.fields" ng-init="field.collapse = true"\n          dnd-disable-if="$parent.$parent.$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n          dnd-draggable="field" draggable="{{!field.editing}}" dnd-effect-allowed="move"\n          dnd-type="\'field-{{$parent.$index}}\'">\n          \x3c!-- <i class="icon icon-v-grip pull-right" ng-drag-handle="ng-drag-handle" ng-disabled="$root.layout[nsPrefix + \'Active__c\']"></i>\n          <button type="button" ng-if="!isSaving(card)" class="btn btn-link pull-right" ng-click="delete(field, \'field\', state)" ng-disabled="$root.layout[nsPrefix + \'Active__c\']">\n              <span class="icon icon-v-trash"></span>\n          </button> --\x3e\n          <div class="row stateFields">\n            \x3c!-- <div class="form-group col-sm-4" dnd-nodrag> --\x3e\n            <div class="form-group col-sm-4">\n              <input id="{{setId(state.name,\'field\',$index)}}" type="text" class="form-control"\n                placeholder="{{ ::\'stateFieldName\' | localize:\'Name\' }}"\n                title="{{ ::\'stateFieldName\' | localize:\'Name\' }}" ng-model="field.name"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || !isCustomfield(field) || $root.lockedLayout || card.locked"\n                bs-tooltip ng-focus="field.editing = true" ng-blur="field.editing = false"\n                autocomplete="new-password" />\n            </div>\n            \x3c!-- <div class="form-group col-sm-2" dnd-nodrag> --\x3e\n            <div class="form-group col-sm-2">\n              \x3c!-- <input type="text" class="form-control" placeholder="{{ ::\'stateFieldType\' | localize:\'Type\' }}" ng-model="field.type" ng-disabled="$root.layout[nsPrefix + \'Active__c\']"/> --\x3e\n              \x3c!-- <select class="form-control" ng-model="field.type" ng-options="dataType.value as dataType.name for dataType in dataTypes" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n              </select>--\x3e\n              <input id="{{setId(state.name,\'field-type\',$index)}}" type="text" class="form-control"\n                ng-model="field.type" bs-options="dataType.value as dataType.value for dataType in dataTypes"\n                bs-typeahead="bs-typeahead" placeholder="Field type"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                autocomplete="new-password" />\n            </div>\n            <div class="form-inline col-sm-6">\n              \x3c!-- <input type="text" title="{{ ::\'stateFieldLabel\' | localize:\'Label\' }}" class="form-control fieldLabel" placeholder="{{ ::\'stateFieldLabel\' | localize:\'Label\' }}" ng-model="field.label" ng-disabled="$root.layout[nsPrefix + \'Active__c\']" dnd-nodrag bs-tooltip/> --\x3e\n              <input id="{{setId(state.name,\'field-label\',$index)}}" type="text"\n                title="{{ ::\'stateFieldLabel\' | localize:\'Label\' }}" class="form-control fieldLabel"\n                placeholder="{{ ::\'stateFieldLabel\' | localize:\'Label\' }}" ng-model="field.label"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || field.group === \'Custom Fields\' || $root.lockedLayout || card.locked"\n                bs-tooltip bs-options="field.name as field.name for field in stateFields" bs-typeahead="bs-typeahead"\n                ng-focus="field.editing = true" ng-blur="field.editing = false" autocomplete="new-password" />\n              <i class="icon icon-v-grip pull-right" ng-drag-handle="ng-drag-handle"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\']"></i>\n              <button id="{{setId(state.name,\'field-delete-btn\',$index)}}" type="button" ng-if="!isSaving(card)"\n                class="btn btn-link pull-right" ng-click="delete(field, \'field\', state)"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n                <span class="icon icon-v-trash"></span>\n              </button>\n              <button id="{{setId(state.name,\'field-add-btn\',$index)}}" type="button" ng-if="!isSaving(card)"\n                class="btn btn-link pull-right" ng-click="showCustomFieldModal(field,state)"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n                <span class="icon icon-v-plus"></span>\n              </button>\n            </div>\n          </div>\n        </li>\n        <div class="dndPlaceholder">\n          \x3c!-- This is used to create a bigger and more visible drop shadow placeholder.  The default one from dnd-list\n          be difficult for user to see and hence may think that dnd not working properly.  This would depend on the CSS\n          defined in CardDesigner.scss --\x3e\n          <div></div>\n        </div>\n      </ul>\n      <div class="add-field row">\n        <div class="col-xs-4">\n          <select id="{{setId(state.name,\'field-input\')}}" class="form-control" ng-model="selectedField"\n            ng-options="field.displayLabel group by field.group for field in stateFields | orderBy: [\'group\',\'displayLabel\'] | filterAndSort:state.fields:\'name\'"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n            <option value=""></option>\n          </select>\n        </div>\n        <div class="col-xs-2">\n          <button id="{{setId(state.name,\'add-field\')}}" type="button" class="btn btn-primary pull-left btn-block"\n            ng-click="addStateField(selectedField, state)"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">{{ ::\'stateAddField\' | localize:\'Add\' }}</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <div class="row" ng-show="!(state.customLwc && $root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc)">\n    \x3c!-- PLACEHOLDERS --\x3e\n    <div class="form-group col-sm-12" ng-show="state.placeholders" ng-init="changeTemplate(state);">\n      <label for="name">\n        <i class="icon icon-v-right-arrow placeholder-expand" ng-show="!state.placeholderExpand"\n          ng-click="state.placeholderExpand = !state.placeholderExpand"></i>\n        <i class="icon icon-v-down-arrow placeholder-expand" ng-show="state.placeholderExpand"\n          ng-click="state.placeholderExpand = !state.placeholderExpand"></i>\n        Placeholders\n      </label>\n      <div ng-show="state.placeholderExpand">\n        \x3c!-- Restrict drag and drop of fields and actions within their state --\x3e\n        <ul class="field-list" ng-if="state.placeholders.length">\n          <li ng-repeat="placeholder in state.placeholders" ng-init="placeholder.collapse = true">\n            <div class="row placeholderFields">\n              <div class="form-group col-sm-3">\n                <input id="{{setId(state.name,\'placeholder\',$index)}}" type="text" class="form-control"\n                  ng-model="placeholder.name" ng-disabled="true" autocomplete="new-password" />\n              </div>\n              <div class="form-group col-sm-2">\n                <input id="{{setId(state.name,\'placeholder-type\',$index)}}" type="text" class="form-control"\n                  data-template="TypeaheadCustomTemp.tpl.html" ng-model="placeholder.type"\n                  bs-options="placeholderTypes as placeholderTypes.value for placeholderTypes in placeholderTypes | groupByField : \'fieldType\'"\n                  bs-typeahead="bs-typeahead" placeholder="Placeholder type"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                  bs-tooltip ng-focus="placeholder.editing = true" ng-blur="placeholder.editing = false"\n                  ng-change="placeholder.type= placeholder.type.value || placeholder.type"\n                  autocomplete="new-password" />\n\n              </div>\n              <div class="form-group col-sm-3">\n                <input id="{{setId(state.name,\'placeholder-label\',$index)}}" type="text" class="form-control"\n                  placeholder="Label" bs-options="field.name as field.name for field in stateFields"\n                  bs-typeahead="bs-typeahead" ng-model="placeholder.label"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                  autocomplete="new-password" />\n              </div>\n              <div class="form-inline col-sm-4">\n                <input id="{{setId(state.name,\'placeholder-value\',$index)}}" type="text"\n                  title="{{ ::\'stateFieldLabel\' | localize:\'Label\' }}" class="form-control fieldLabel"\n                  placeholder="Value" bs-options="field.name as field.name for field in stateFields"\n                  bs-typeahead="bs-typeahead" data-watch-options="true" ng-model="placeholder.value"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                  bs-tooltip ng-focus="placeholder.editing = true" ng-blur="placeholder.editing = false"\n                  autocomplete="new-password" />\n\n                <button id="{{setId(state.name,\'placeholder-delete-btn\',$index)}}" type="button" ng-if="!isSaving(card)"\n                  class="btn btn-link pull-right" ng-click="delete(placeholder, \'placeholder\', state)"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n                  <span class="icon icon-v-trash"></span>\n                </button>\n              </div>\n            </div>\n          </li>\n        </ul>\n        <div class="add-field row">\n          <div class="col-xs-4">\n            <select id="{{setId(state.name,\'placeholder-input\')}}" class="form-control" ng-model="selectedPlaceholder"\n              ng-options="field.name as field.name for field in availablePlaceholders[state.templateUrl] | filterAndSort:state.placeholders:\'name\'"\n              ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n            </select>\n          </div>\n          <div class="col-xs-2">\n            <button id="{{setId(state.name,\'placeholder-add-btn\')}}" type="button"\n              class="btn btn-primary pull-left btn-block" ng-click="addPlaceholder(state,selectedPlaceholder)"\n              ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">{{ ::\'stateAddField\' | localize:\'Add\' }}</button>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    \x3c!-- SOBJECT Type --\x3e\n    \x3c!--      <div class="form-group col-sm-6" ng-show="state.blankCardState">\n        <label for="name">Salesforce Object Type</label>\n        <select class="form-control" ng-options="sobject.name as sobject.name for sobject in $root.sobjectTypes" ng-model="state.sObjectType" ng-disabled="$root.layout[nsPrefix + \'Active__c\']"/>\n      </div> --\x3e\n  </div>\n\n  \x3c!-- Actions --\x3e\n  <div class="row" ng-show="!(state.customLwc && $root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc)">\n    <div class="row no-margin" ng-init="initSmartAction(state)">\n      <div class="form-group col-sm-6 no-margin">\n        <h5 for="name"><strong>Actions</strong><a href="javascript:void(0);"\n            ng-click="helpNode.helpNodeModal($event, \'lwcActions\')"><i class="icon icon-v-information-line"></i></a>\n        </h5>\n      </div>\n      \x3c!--<div class="form-group col-sm-6 no-margin" ng-if="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n        <select class="form-control" id="{{layoutName}}-render"\n          ng-options="(item ? \'Smart Actions\': \'Standard Actions\') for item in [true, false]"\n          ng-model="state.isSmartAction"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\']  || $root.lockedLayout">\n        </select>\n      </div> --\x3e\n      <div class="form-group col-sm-12">\n        <hr class="no-margin">\n      </div>\n    </div>\n    <div class="form-group col-sm-6">\n      <label for="name">Salesforce Object Type</label>\n      <input type="text" id="{{setId(state.name,\'sObject\')}}" class="form-control"\n        ng-init="::onChangeSalesforceObj(state.sObjectType)" ng-model="state.sObjectType"\n        bs-options="sobject.name as sobject.name for sobject in $root.sobjectTypes" bs-typeahead="bs-typeahead"\n        ng-change="onChangeSalesforceObj(state.sObjectType)" data-watch-options="true"\n        ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked" />\n    </div>\n    <div class="form-group col-sm-6" ng-init="actionCtxIdCheck(state)">\n      <input class="blank-card-state" type="checkbox"\n        ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n        ng-if="state.blankCardState" ng-model="state.isActionCtxId" ng-change="actionCtxIdCheck(state)">\n      <label ng-if="state.isActionCtxId || !state.blankCardState">Id Field for Actions</label><label\n        ng-if="!state.isActionCtxId && state.blankCardState">Enable Id field for actions</label>\n      <input type="text" id="{{setId(state.name,\'action-id\')}}" class="form-control" ng-model="state.actionCtxId"\n        bs-options="field.name as field.name for field in state.blankCardState ? bsOptions : sOptions"\n        bs-typeahead="bs-typeahead" ng-focus="actionCtxIdCheck(state)" data-watch-options="true"\n        ng-if="state.isActionCtxId || !state.blankCardState"\n        ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n        autocomplete="new-password" />\n    </div>\n    <div class="form-group col-sm-12">\n      \x3c!-- <label for="name">Actions</label> --\x3e\n      <ul class="action-list" ng-if="state.definedActions.actions.length"\n        dnd-disable-if="$parent.$parent.$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n        dnd-list="state.definedActions.actions" dnd-allowed-types="[\'action-{{$parent.$index}}\']"\n        dnd-drop="dropActionCallback(event, index, item, external, type, allowedType, $parent.state)"\n        dnd-dragover="onDNDMove(event, index, item, external, type, \'itemType\')">\n        <li ng-repeat="action in state.definedActions.actions"\n          dnd-disable-if="$parent.$parent.$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || !action.collapse || $root.lockedLayout || card.locked"\n          dnd-draggable="action" dnd-effect-allowed="move" dnd-type="\'action-{{$parent.$index}}\'"\n          ng-init="action.collapse = true; action.isCustomAction = action.isCustomAction || false; action.hasExtraParams = action.hasExtraParams || false;">\n          <div id="{{setId(state.name,\'action\',$index)}}" class="title" title="{{action.id}}">\n            <i class="icon icon-v-right-arrow action-no-margin"\n              ng-show="action.collapse && (action.isCustomAction || action.hasExtraParams)"\n              ng-click="action.collapse = !action.collapse"></i>\n            <i class="icon icon-v-down-arrow action-no-margin"\n              ng-show="!action.collapse && (action.isCustomAction || action.hasExtraParams)"\n              ng-click="action.collapse = !action.collapse"></i>\n            <i class="icon icon-v-down-arrow hide-icon action-no-margin"\n              ng-show="!action.isCustomAction && !action.hasExtraParams"></i>\n            {{action.id}} <span ng-if="action.isCustomAction">&nbsp;({{action.type}})</span>\n          </div>\n          <span>\n            <i class="icon icon-v-grip pull-right" ng-drag-handle="ng-drag-handle"\n              ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"></i>\n            <button type="button" ng-if="!isSaving(card)" class="btn btn-link pull-right"\n              ng-click="delete(action, \'action\', state)"\n              ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n              <span class="icon icon-v-trash"></span>\n            </button>\n            <a class="btn btn-link pull-right" ng-if="action.type === \'Vlocity Action\'"\n              ng-click="openUrl(\'/\'+getActionByName(action.id),$event, true)" title="Edit Action" bs-tooltip\n              data-container=".container">\n              <i class="icon icon-v-link"></i>\n            </a>\n            <label class="pull-right">\n              <input type="checkbox" name="" ng-model="action.hasExtraParams"\n                ng-click="action.collapse = !(action.isCustomAction || action.hasExtraParams)"> Action Options\n            </label>\n          </span>\n\n          <div class="well" ng-if="!action.collapse">\n            \x3c!-- Custom Action --\x3e\n            <div class="row context-variables"\n              ng-if="!action.collapse && action.type != \'OmniScript\' && action.type != \'PubSub\'">\n              <div ng-if="action.isCustomAction">\n                <div class="form-group col-sm-6">\n                  <label>Id</label>\n                  <input type="text" class="form-control" ng-model="action.id"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6">\n                  <label>Display Name</label>\n                  <input type="text" class="form-control" ng-model="action.displayName"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6">\n                  <label>Vlocity Icon</label>\n                  <input type="text" class="form-control" ng-model="action.vlocityIcon"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6">\n                  <label>Open URL in</label>\n                  <select class="form-control" ng-model="action.openUrlIn"\n                    ng-init="action.openUrlIn = action.openUrlIn ? action.openUrlIn : \'_self\'"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n                    <option value="New Tab / Window">New Tab/Window</option>\n                    <option value="_self">Current Window</option>\n                  </select>\n                </div>\n                <div class="form-group col-sm-12" ng-hide="action.targetType">\n                  <label>URL</label>\n                  <input type="text" class="form-control" ng-model="action.url"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                    autocomplete="new-password" />\n                </div>\n              </div>\n              <div ng-if="(action.isCustomAction || action[nsPrefix + \'InvokeClassName__c\']) && action.hasExtraParams">\n                <div class="form-group col-sm-6">\n                  <label>Invoke Class Name</label>\n                  <input type="text" class="form-control" ng-model="action[nsPrefix + \'InvokeClassName__c\']"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || (!action.isCustomAction && action[nsPrefix + \'InvokeClassName__c\'])"\n                    bs-options="class.Name as class.Name for class in $root.allApexClasses" bs-typeahead="bs-typeahead"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6">\n                  <label>Invoke Method Name</label>\n                  <input type="text" class="form-control" ng-model="action[nsPrefix + \'InvokeMethodName__c\']"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || (!action.isCustomAction && action[nsPrefix + \'InvokeMethodName__c\'])"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-lg-12 filter">\n                  <label>Input Map</label>\n                  <div class="row"\n                    ng-repeat="property in propertySet(action.inputMap, \'inputMap\', action) track by property.key">\n                    <div class="form-group col-lg-5">\n                      <input id="{{setId(state.name,\'input-map\',$index)}}" type="text" class="form-control"\n                        ng-model="property.key" ng-change="property.update(\'inputMap\')"\n                        ng-disabled="disabled || dsDisabled" ng-model-options="{ updateOn: \'blur\'}"\n                        autocomplete="new-password" />\n                    </div>\n                    <div class="form-group col-lg-5 nopadding">\n                      <input id="{{setId(state.name,\'input-map-value\',$index)}}" class="form-control" type="text"\n                        ng-model="property.value" ng-change="property.update(\'inputMap\')"\n                        bs-options="field.name as field.name for field in stateFields" bs-typeahead="bs-typeahead"\n                        ng-disabled="disabled || dsDisabled" autocomplete="new-password" />\n                    </div>\n                    <div class="form-group col-lg-2">\n                      <a id="{{setId(state.name,\'input-map-delete\',$index)}}" class="btn btn-link pull-left"\n                        ng-href="#"><i class="icon icon-v-trash"\n                          ng-click="removeMapProperty(action.inputMap,property.key)"></i></a>\n                    </div>\n                  </div>\n                  <div class="row">\n                    <div class="col-lg-12">\n                      <button id="{{setId(state.name,\'input-map-add-btn\')}}" type="button" class="btn btn-link"\n                        ng-click="addMapProperty(action.inputMap, \'inputMap\', action)"\n                        ng-disabled="disabled || action.inputMap[\'\'] == \'\' || dsDisabled">\n                        + Add Input Map Variable\n                      </button>\n                    </div>\n                  </div>\n                </div>\n                <div class="form-group col-lg-12 filter">\n                  <label>Options Map</label>\n                  <div class="row"\n                    ng-repeat="property in propertySet(action.optionsMap, \'optionsMap\', action) track by property.key">\n                    <div class="form-group col-lg-5">\n                      <input id="{{setId(state.name,\'option-map\',$index)}}" type="text" class="form-control"\n                        ng-model="property.key" ng-change="property.update(\'optionsMap\')"\n                        ng-disabled="disabled || dsDisabled" ng-model-options="{ updateOn: \'blur\'}"\n                        autocomplete="new-password" />\n                    </div>\n                    <div class="form-group col-lg-5 nopadding">\n                      <input id="{{setId(state.name,\'option-map-value\',$index)}}" class="form-control" type="text"\n                        ng-model="property.value" bs-options="field.name as field.name for field in stateFields"\n                        bs-typeahead="bs-typeahead" data-watch-options="true" ng-change="property.update(\'optionsMap\')"\n                        ng-disabled="disabled || dsDisabled" autocomplete="new-password" />\n                    </div>\n                    <div class="form-group col-lg-2">\n                      <a id="{{setId(state.name,\'option-map-delete\',$index)}}" class="btn btn-link pull-left"\n                        ng-href="#"><i class="icon icon-v-trash"\n                          ng-click="removeMapProperty(action.optionsMap,property.key)"></i></a>\n                    </div>\n                  </div>\n                  <div class="row">\n                    <div class="col-lg-12">\n                      <button id="{{setId(state.name,\'option-map-add\')}}" type="button" class="btn btn-link"\n                        ng-click="addMapProperty(action.optionsMap, \'optionsMap\', action)"\n                        ng-disabled="disabled || action.optionsMap[\'\'] == \'\' || dsDisabled">\n                        + Add Option Map Variable\n                      </button>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n            \x3c!-- Custom OmniScript --\x3e\n            <div class="row context-variables"\n              ng-if="action.isCustomAction && !action.collapse && action.type == \'OmniScript\'">\n              <div class="form-group col-sm-6">\n                <label for="name">Id</label>\n                <input type="text" class="form-control" ng-model="action.id"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                  autocomplete="new-password" />\n              </div>\n              <div class="form-group col-sm-6">\n                <label for="name">Display Name</label>\n                <input type="text" class="form-control" ng-model="action.displayName"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                  autocomplete="new-password" />\n              </div>\n              <div class="form-group col-sm-6">\n                <label for="name">Icon</label>\n                <input type="text" class="form-control" ng-model="action.vlocityIcon"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                  autocomplete="new-password" />\n              </div>\n              <div class="form-group col-sm-6">\n                <label for="name">Open URL in</label>\n                <select class="form-control" ng-model="action.openUrlIn"\n                  ng-init="action.openUrlIn = action.openUrlIn ? action.openUrlIn : \'_self\'"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n                  <option value="New Tab / Window">New Tab/Window</option>\n                  <option value="_self">Current Window</option>\n                </select>\n              </div>\n              <div class="col-lg-12" style="padding:0">\n                <div class="form-group col-sm-6">\n                  <label for="name">Omniscript</label>\n                  <input type="text" class="form-control" ng-model="action.omniType" bs-typeahead="bs-typeahead"\n                    autocomplete="new-password" ng-model-options="{ debounce: { default: 500, blur: 100 } }"\n                    ng-change="setOSAction(action)"\n                    bs-options="omniScriptsArr as omniScriptsArr.Name for omniScriptsArr in $root.omniScriptsArr"\n                    data-watch-options="true"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                    autocomplete="new-password" />\n                  <div class="input-group" ng-hide="isValidOsName">\n                    <label class="text-danger"><i class="icon icon-v-warning-circle-line text-danger"></i>\n                      Invalid Omniscript</label>\n                  </div>\n                </div>\n                <div class="form-group col-sm-6"\n                  ng-init="action.vForcewithNsPrefix = nsPrefix + \'OmniScriptUniversalPage\'" ng-hide="action.isLwcOS">\n                  <label for="name">VisualForce Page</label>\n                  <input type="text" class="form-control" ng-model="action.visualForce" ng-change="updateVfPage(action)"\n                    bs-options="page.Name as page.Name for page in $root.apexPages" bs-typeahead="bs-typeahead"\n                    placeholder="Page name"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6" ng-show="action.isLwcOS">\n                  <label for="name">Context Id</label>\n                  <input type="text" class="form-control" ng-model="action.ContextId"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                    autocomplete="new-password" />\n                </div>\n              </div>\n              <div class="form-group col-sm-6" ng-show="action.isLwcOS">\n                <label for="name">Console Tab Icon</label>\n                <input type="text" class="form-control" ng-model="action.tabIcon"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                  autocomplete="new-password" />\n              </div>\n              <div class="form-group col-sm-6" ng-show="action.isLwcOS">\n                <label for="name">Console Tab Label</label>\n                <input type="text" class="form-control" ng-model="action.tabLabel"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                  autocomplete="new-password" />\n              </div>\n              <div class="form-group col-sm-6">\n                <label for="name">Layout</label>\n                <select class="form-control" ng-model="action.layoutType" ng-init="action.layoutType = action.layoutType ? action.layoutType : \'lightning\'"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n                  <option value="lightning">Lightning</option>\n                  <option value="newport">Newport</option>\n                </select>\n              </div>\n              <div class="form-group col-sm-6 margin-top-25">\n                <label for="{{setId(state.name,\'os-lwc\')}}">\n                  <input id="{{setId(state.name,\'os-lwc\')}}" class="blank-card-state os-lwc" type="checkbox"\n                    ng-model="action.isLwcOS"\n                    ng-disabled="!action.omniType.isLwc || $root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked" />{{ ::\'LwcEnabledOS\' | localize:\'LWC Enabled\' }}\n                </label>\n              </div>\n            </div>\n            \x3c!-- Custom PubSub --\x3e\n            <div class="row context-variables"\n              ng-if="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc && !action.collapse && action.type == \'PubSub\'">\n              <div ng-if="action.isCustomAction && !action.collapse && action.type == \'PubSub\'">\n                <div class=" form-group col-sm-6">\n                  <label>Id</label>\n                  <input type="text" class="form-control" ng-model="action.id"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6">\n                  <label>Display Name</label>\n                  <input type="text" class="form-control" ng-model="action.displayName"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6">\n                  <label>Vlocity Icon</label>\n                  <input type="text" class="form-control" ng-model="action.vlocityIcon"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6">\n                  <label>Event Name</label>\n                  <input type="text" class="form-control" ng-model="action.eventName"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6">\n                  <label>Message</label>\n                  <input type="text" class="form-control" ng-model="action.message"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                    autocomplete="new-password" />\n                </div>\n              </div>\n            </div>\n            \x3c!-- Page Reference Info --\x3e\n            <div ng-if="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc && action.type == \'Custom\'">\n              <div class="row">\n                <div class="form-group col-sm-6">\n                  <label for="action-targetType">Target Type</label>\n                  <select id="{{setId(state.name,\'select-page-reference\')}}" class="form-control"\n                    ng-model="action.targetType" ng-options="item for item in pageReferenceType"\n                    ng-change="setPageRefObj(action);"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n                    <option value=""></option>\n                  </select>\n                </div>\n              </div>\n              <div class="row" ng-show="action.targetType">\n                <div class="form-group col-sm-6" ng-hide="action.targetType == \'Login\'">\n                  <label for="action-targetName">Target Name</label>\n                  <input type="text" id="action-targetName" class="form-control"\n                    ng-model="action[action.targetType].targetName"\n                    bs-options="field.name as field.name for field in state.blankCardState ? bsOptions : sOptions"\n                    bs-typeahead="bs-typeahead" data-watch-options="true"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6" ng-show="action.targetType == \'Knowledge Article\'">\n                  <label for="action-targetArticleType">Target ArticleType</label>\n                  <input type="text" id="action-targetArticleType" class="form-control"\n                    ng-model="action[action.targetType].targetArticleType"\n                    bs-options="field.name as field.name for field in state.blankCardState ? bsOptions : sOptions"\n                    bs-typeahead="bs-typeahead" data-watch-options="true"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6"\n                  ng-show="action.targetType == \'Object\' || action.targetType == \'Record\' || action.targetType == \'Record Relationship\' || action.targetType == \'Login\'">\n                  <label for="action-targetAction">Target Action</label>\n                  <input type="text" id="action-targetAction" class="form-control"\n                    ng-model="action[action.targetType].targetAction"\n                    bs-options="field.name as field.name for field in state.blankCardState ? bsOptions : sOptions"\n                    bs-typeahead="bs-typeahead" data-watch-options="true"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6"\n                  ng-show="action.targetType == \'Record\' || action.targetType == \'Record Relationship\'">\n                  <label for="action-targetId">Target Id</label>\n                  <input type="text" id="action-targetId" class="form-control"\n                    ng-model="action[action.targetType].targetId"\n                    bs-options="field.name as field.name for field in state.blankCardState ? bsOptions : sOptions"\n                    bs-typeahead="bs-typeahead" data-watch-options="true"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n                    autocomplete="new-password" />\n                </div>\n                <div class="form-group col-sm-6" ng-show="action.targetType == \'Record Relationship\'">\n                  <label for="action-targetRelationship">Target Relationship</label>\n                  <input type="text" id="action-targetRelationship" class="form-control"\n                    ng-model="action[action.targetType].targetRelationship"\n                    bs-options="field.name as field.name for field in state.blankCardState ? bsOptions : sOptions"\n                    bs-typeahead="bs-typeahead" data-watch-options="true"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n                    autocomplete="new-password" />\n                </div>\n\n                <span ng-show="action.targetType == \'App\'">\n                  <div class="form-group col-sm-6">\n                    <label for="action-targetAppType">Type</label>\n                    <input type="text" id="action-targetAppType" class="form-control"\n                      ng-model="action[action.targetType].appPageRefType"\n                      bs-options="field.name as field.name for field in state.blankCardState ? bsOptions : sOptions"\n                      bs-typeahead="bs-typeahead" data-watch-options="true"\n                      ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n                      autocomplete="new-password" />\n                  </div>\n                  <div class="form-group">\n                    <h5 class="col-sm-12">\n                      Attributes\n                    </h5>\n                  </div>\n                  <div class="form-group col-sm-6">\n                    <label for="action-targetAppApiName">Api Name</label>\n                    <input type="text" id="action-targetAppApiName" class="form-control"\n                      ng-model="action[action.targetType].targetAttrApiName"\n                      bs-options="field.name as field.name for field in state.blankCardState ? bsOptions : sOptions"\n                      bs-typeahead="bs-typeahead" data-watch-options="true"\n                      ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n                      autocomplete="new-password" />\n                  </div>\n                  <div class="form-group col-sm-6">\n                    <label for="action-targetAppRecordId">RecordId</label>\n                    <input type="text" id="action-targetAppRecordId" class="form-control"\n                      ng-model="action[action.targetType].targetAttrRecordId"\n                      bs-options="field.name as field.name for field in state.blankCardState ? bsOptions : sOptions"\n                      bs-typeahead="bs-typeahead" data-watch-options="true"\n                      ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n                      autocomplete="new-password" />\n                  </div>\n                  <div class="form-group col-sm-6">\n                    <label for="action-targetAppActionName">Action Name</label>\n                    <input type="text" id="action-targetAppActionName" class="form-control"\n                      ng-model="action[action.targetType].targetAttrActionName"\n                      bs-options="field.name as field.name for field in state.blankCardState ? bsOptions : sOptions"\n                      bs-typeahead="bs-typeahead" data-watch-options="true"\n                      ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n                      autocomplete="new-password" />\n                  </div>\n                </span>\n\n                \x3c!-- Target Parameters --\x3e\n                <div ng-show="action.targetType == \'Component\' || action.targetType == \'Navigation Item\' || action.targetType == \'Login\'">\n                  <div class="form-group">\n                    <h5 class="col-sm-12">\n                      Target Parameters\n                    </h5>\n                  </div>\n                  <div class="form-group col-sm-12">\n                    <div class="row"\n                      ng-repeat="property in propertySet(action.targetParams, \'targetParams\', action) track by property.key">\n                      <div class="form-group col-lg-5">\n\n                        <input id="{{setId(state.name,\'targetParams\',$index)}}" type="text" class="form-control"\n                          ng-model="property.key" ng-model-options="{ updateOn: \'blur\'}"\n                          ng-change="property.update(\'targetParams\')"\n                          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                          autocomplete="new-password" />\n                      </div>\n                      <div class="form-group col-lg-5 nopadding">\n                        <input id="{{setId(state.name,\'targetParams-value\',$index)}}" type="text" class="form-control"\n                          ng-model="property.value" bs-options="field.name as field.name for field in stateFields"\n                          bs-typeahead="bs-typeahead" ng-change="property.update(\'targetParams\')"\n                          data-watch-options="true"\n                          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                          autocomplete="new-password" />\n                      </div>\n                      <div class="form-group col-lg-2">\n                        <a id="{{setId(state.name,\'targetParams-delete\',$index)}}" class="btn btn-link pull-left"\n                          ng-href="#"\n                          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"><i\n                            class="icon icon-v-trash"\n                            ng-click="removeMapProperty(action.targetParams,property.key)"></i></a>\n                      </div>\n                    </div>\n\n                    <div class="form-group col-lg-12">\n                      <button id="{{setId(state.name,\'targetParams-add\')}}" type="button" class="btn btn-link"\n                        ng-click="addMapProperty(action.targetParams, \'targetParams\', action)"\n                        ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || action.targetParams[\'\'] == \'\' || $root.lockedLayout || card.locked">\n                        + Add Parameters\n                      </button>\n                    </div>\n\n                  </div>\n                </div>\n              </div>\n            </div>\n            \x3c!-- Custom Parameters --\x3e\n            <div class="row context-variables"\n              ng-if="(action.hasExtraParams && !action.collapse)">\n              <div class="form-group" ng-if="!action.targetType">\n                <h5 class="col-sm-12">\n                  Custom Parameters\n                  \x3c!-- <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event, \'layoutTestDatasourceSettings\')"><i class="icon icon-v-information-line"></i></a> --\x3e\n                </h5>\n              </div>\n              <div class="form-group col-sm-12" ng-show="action.hasExtraParams" ng-if="!action.targetType">\n                <div class="row"\n                  ng-repeat="property in propertySet(action.extraParams, \'extraParams\', action) track by property.key">\n                  <div class="form-group col-lg-5">\n\n                    <input id="{{setId(state.name,\'parameter\',$index)}}" type="text" class="form-control"\n                      ng-model="property.key" ng-model-options="{ updateOn: \'blur\'}"\n                      ng-change="property.update(\'extraParams\')"\n                      ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                      autocomplete="new-password" />\n                  </div>\n                  <div class="form-group col-lg-5 nopadding">\n                    <input id="{{setId(state.name,\'parameter-value\',$index)}}" type="text" class="form-control"\n                      ng-model="property.value" bs-options="field.name as field.name for field in stateFields"\n                      bs-typeahead="bs-typeahead" ng-change="property.update(\'extraParams\')" data-watch-options="true"\n                      ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n                      autocomplete="new-password" />\n                  </div>\n                  <div class="form-group col-lg-2">\n                    <a id="{{setId(state.name,\'parameter-delete\',$index)}}" class="btn btn-link pull-left" ng-href="#"\n                      ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"><i\n                        class="icon icon-v-trash" ng-click="removeMapProperty(action.extraParams,property.key)"></i></a>\n                  </div>\n                </div>\n\n                <div class="form-group col-lg-12">\n                  <button id="{{setId(state.name,\'parameter-add\')}}" type="button" class="btn btn-link min-wd-103"\n                    ng-click="addMapProperty(action.extraParams, \'extraParams\', action)"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || action.extraParams[\'\'] == \'\' || $root.lockedLayout || card.locked">\n                    + Add Parameters\n                  </button>\n                </div>\n\n              </div>\n              <div class="form-group">\n                <h5 class="col-sm-12">\n                  Conditions\n                </h5>\n              </div>\n              <div class="form-group">\n                <div class="col-sm-12" ng-include="\'ConditionsGroupActionTemplate.html\'"\n                  ng-init="initConditions(action);condition = action.conditions;"></div>\n              </div>\n            </div>\n          </div>\n\n        </li>\n        <div class="dndPlaceholder">\n          \x3c!-- This is used to create a bigger and more visible drop shadow placeholder.  The default one from dnd-list\n          be difficult for user to see and hence may think that dnd not working properly.  This would depend on the CSS\n          defined in CardDesigner.scss --\x3e\n          <div></div>\n        </div>\n      </ul>\n      <div class="add-action row">\n        <div class="col-xs-6 col-sm-6 col-lg-4">\n          <select id="{{setId(state.name,\'select-action\')}}" class="form-control" ng-model="selectedAction"\n            ng-options="action.Name for action in actionsList[state.sObjectType] | filterAndSort:state.definedActions.actions:\'id\'"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n            <option value=""></option>\n          </select>\n        </div>\n        <div class="col-xs-4 col-sm-2 col-lg-2">\n          <button id="{{setId(state.name,\'add-action-btn\')}}" type="button" class="btn btn-primary btn-block"\n            ng-click="addStateAction(selectedAction, state)"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">{{ ::\'stateAddAction\' | localize:\'Add\' }}</button>\n        </div>\n        <div class="btn-group col-xs-12 col-sm-12 col-lg-6">\n          <button id="{{setId(state.name,\'add-custom-btn\')}}" type="button"\n            class="btn btn-link add-action-link padding-right-10" ng-click="addStateCustomAction(state)"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n            {{ ::\'+ Add Custom Action\' }}\n          </button>\n          <button type="button" class="btn btn-link add-action-link padding-right-10"\n            ng-click="addStateOmniScriptAction(state)"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n            {{ ::\'+ Add OS Action\' }}\n          </button>\n          <button ng-if="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc" type="button"\n            class="btn btn-link add-action-link" ng-click="addStatePubSubAction(state)"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n            {{ ::\'+ Add PubSub Action\' }}\n          </button>\n        </div>\n      </div>\n    </div>\n\n\n    <div class="form-group col-lg-12" ng-show="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n      <label for="name" ng-click="state.smartAction.$$expanded = !state.smartAction.$$expanded">\n        <i class="icon icon-v-right-arrow placeholder-expand" ng-show="!state.smartAction.$$expanded"></i>\n        <i class="icon icon-v-down-arrow placeholder-expand" ng-show="state.smartAction.$$expanded"></i>\n        Smart Actions\n      </label>\n      <div class="row" ng-if="state.smartAction.$$expanded">\n        <div class="form-group col-lg-12">\n          <label for="cardBundle">{{ ::\'smartActionsIPLabel\' | localize:\'Smart Actions Integration Procedure\' }}</label>\n          <div>\n            <input id="{{objName}}-integration-procedure-name" type="text" class="form-control"\n              ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\']  || $root.lockedLayout"\n              ng-model="state.smartAction.ipMethod"\n              bs-options="ipBundle.Name as ipBundle.Name for ipBundle in $root.ipBundles" bs-typeahead="bs-typeahead"\n              autocomplete="new-password">\n          </div>\n        </div>\n        <div class="form-group col-lg-12 filter" id="{{objName}}-integration-procedure-input">\n          <label for="name" ng-click="state.smartAction.$$inputExpanded = !state.smartAction.$$inputExpanded">\n            <i class="icon icon-v-right-arrow placeholder-expand" ng-show="!state.smartAction.$$inputExpanded"></i>\n            <i class="icon icon-v-down-arrow placeholder-expand" ng-show="state.smartAction.$$inputExpanded"></i>\n            Input Map\n          </label>\n          <div class="row" ng-if="state.smartAction.$$inputExpanded"\n            ng-repeat="property in propertySet(state.smartAction.inputMap, \'inputMap\', state.smartAction) track by property.key">\n            <div class="form-group col-lg-5">\n              <input id="{{objName}}-ip-input-map-{{$index}}" type="text" class="form-control"\n                ng-model-options="{ updateOn: \'blur\'}" ng-model="property.key" ng-change="property.update(\'inputMap\')"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\']  || $root.lockedLayout"\n                autocomplete="new-password" />\n            </div>\n            <div class="form-group col-lg-5 nopadding">\n              <input id="{{objName}}-ip-input-map-value-{{$index}}" class="form-control" type="text"\n                ng-model-options="{ updateOn: \'blur\'}" ng-model="property.value" ng-change="property.update(\'inputMap\')"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\']  || $root.lockedLayout"\n                autocomplete="new-password" />\n            </div>\n            <div class="form-group col-lg-2">\n              <a id="{{objName}}-ip-input-map-delete-{{$index}}"\n                ng-click="removeMapProperty(state.smartAction.inputMap,property.key)"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\']  || $root.lockedLayout"\n                class="btn btn-link pull-left" ng-href="#">\n                <i class="icon icon-v-trash"></i>\n              </a>\n            </div>\n          </div>\n          <div class="row" ng-if="state.smartAction.$$inputExpanded">\n            <div class="col-lg-12">\n              <button id="{{objName}}-ip-input-map-add-btn" type="button" class="btn btn-link"\n                ng-click="addMapProperty(state.smartAction.inputMap, \'inputMap\',state.smartAction)"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\']  || $root.lockedLayout || state.smartAction.inputMap[\'\'] == \'\'">\n                + Add Input Map Variable\n              </button>\n            </div>\n          </div>\n        </div>\n        <div class="form-group col-lg-12 filter" id="{{objName}}-integration-procedure-option">\n          <label for="name" ng-click="state.smartAction.$$optionsExpanded= !state.smartAction.$$optionsExpanded">\n            <i class="icon icon-v-right-arrow placeholder-expand" ng-show="!state.smartAction.$$optionsExpanded"></i>\n            <i class="icon icon-v-down-arrow placeholder-expand" ng-show="state.smartAction.$$optionsExpanded"></i>\n            Options Map\n          </label>\n          <div class="row" ng-if="state.smartAction.$$optionsExpanded"\n            ng-repeat="property in propertySet(state.smartAction.optionsMap, \'optionsMap\',state.smartAction) track by property.key">\n            <div class="form-group col-lg-5">\n              <input id="{{objName}}-ip-option-map-{{$index}}" type="text" class="form-control"\n                ng-model-options="{ updateOn: \'blur\'}" ng-model="property.key" ng-change="property.update(\'optionsMap\')"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\']  || $root.lockedLayout"\n                autocomplete="new-password" />\n            </div>\n            <div class="form-group col-lg-5 nopadding">\n              <input id="{{objName}}-ip-option-map-val-{{$index}}" class="form-control" type="text"\n                ng-model-options="{ updateOn: \'blur\'}" ng-model="property.value"\n                ng-change="property.update(\'optionsMap\')"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\']  || $root.lockedLayout"\n                autocomplete="new-password" />\n            </div>\n            <div class="form-group col-lg-2">\n              <a id="{{objName}}-ip-option-map-delete-btn-{{$index}}"\n                ng-click="removeMapProperty(state.smartAction.optionsMap,property.key)"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\']  || $root.lockedLayout"\n                class="btn btn-link pull-left" ng-href="#">\n                <i class="icon icon-v-trash"></i>\n              </a>\n            </div>\n          </div>\n          <div class="row" ng-if="state.smartAction.$$optionsExpanded">\n            <div class="col-lg-12">\n              <button id="{{objName}}-ip-option-map-add-btn" type="button" class="btn btn-link"\n                ng-click="addMapProperty(state.smartAction.optionsMap, \'optionsMap\',state.smartAction)"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\']  || $root.lockedLayout || state.smartAction.optionsMap[\'\'] == \'\'">\n                + Add Option Map Variable\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  </div>\n\n  \x3c!-- FLYOUT --\x3e\n  <div class="row">\n    <div class="form-group col-sm-12">\n      <h5 for="name"><strong>Flyout</strong>\n        <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event, \'stateFlyout\')"><i\n            class="icon icon-v-information-line"></i></a>\n      </h5>\n      <hr class="no-margin" />\n    </div>\n    <div class="form-group col-sm-6">\n      <label for="name" ng-show="!$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">Flyout Layout\n      </label>\n      <label for="name" ng-show="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">Flyout LWC\n      </label>\n      <div class="input-group" ng-if="!$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n        <select id="{{setId(state.name,\'state-fylout\')}}" class="form-control" ng-model="state.flyout.layout"\n          ng-options="flyout.Name as flyout.Name for flyout in $root.flyouts | orderBy: \'Name\'"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n          <option value=""></option>\n        </select>\n        <span class="input-group-btn">\n          <a class="btn btn-link pull-right" title="{{ ::\'editFlyoutIconLabel\' | localize:\'Edit Flyout\' }}"\n            ng-if="$root.flyouts"\n            ng-click="openUrl(\'/apex/\' + $root.nsPrefix + \'CardDesignerNew?id=\'+getFlyoutIdForName(state.flyout.layout),$event, true)"\n            bs-tooltip data-container=".container"><i class="icon icon-v-link"></i></a>\n        </span>\n      </div>\n      <div class="input-group" ng-if="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n        <input id="{{setId(state.name,\'state-fylout\')}}" type="text" data-template="TypeaheadCustomTemp.tpl.html"\n          class="form-control" ng-model="state.flyout.lwc"\n          bs-options="template as template.MasterLabel for template in $root.lightningwebcomponents"\n          bs-typeahead="bs-typeahead" autocomplete="new-password" ng-change="selectLwc(\'\', state.flyout)"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n        <span class="input-group-btn">\n          <a class="btn btn-link pull-right download-icon-grey" title="{{ ::\'DownloadLWC\' | localize:\'Download LWC\' }}"\n            ng-disabled="isManagedLWC(state.flyout.lwc) || $root.downloadingLwc" ng-click="downloadLWCByName(state.flyout.lwc)" bs-tooltip\n            data-container=".container"><i class="icon icon-v-download2" ng-class="{\'icon-grey-disable\':isManagedLWC(state.flyout.lwc)}"></i></a>\n        </span>\n        <span class="input-group-btn" ng-if="isManagedLWC(state.flyout.lwc)">\n          <a class="btn btn-link pull-right" href="javascript:void(0);"><i class="icon icon-v-information-line" data-container=".container"\n            data-type="info" bs-tooltip="card" bs-enabled="true" data-html="true"\n            data-title="{{ ::\'VlocityComponentsNotDownloadable\' | localize:\'Vlocity LWC templates and base components are not downloadable\' }}"></i></a>\n        </span>\n      </div>\n    </div>\n    <div class="form-group col-sm-6" ng-show="!$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n      <label class="strong" for="name">Flyout Data Object</label>\n      <input id="{{setId(state.name,\'state-fylout-data\')}}" type="text" class="form-control" id="name"\n        ng-model="state.flyout.data"\n        ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n        autocomplete="new-password" />\n    </div>\n  </div>\n  <div class="row" ng-show="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n    <div class="context-variables">\n      <div class="form-group col-lg-12">\n        <h5><strong>Flyout Properties</strong> </h5>\n        <hr class="no-margin" />\n      </div>\n      <div class="form-group col-lg-12">\n        <div class="row" ng-repeat="prop in state.flyoutAttributes" ng-show="state.flyoutAttributes.length > 0">\n          <div class="form-group col-lg-5">\n            <label for="cardBundle" ng-if="$first">Name</label>\n            <input type="text" id="{{setId(\'fly-prop-name\',$index)}}" class="form-control" ng-model="prop.name"\n              placeholder="Variable name"\n              ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)"\n              autocomplete="new-password" />\n          </div>\n          <div class="form-group col-lg-5">\n            <label for="cardBundle" ng-if="$first">Value</label>\n            <input type="text" id="{{setId(\'fly-prop-value\',$index)}}" class="form-control" ng-model="prop.val"\n              bs-options="field.name as field.name for field in stateFields" bs-typeahead="bs-typeahead"\n              placeholder="Variable value" data-watch-options="true"\n              ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)"\n              autocomplete="new-password" />\n          </div>\n          <div class="form-group col-lg-2">\n            <label for="cardBundle" ng-if="$first">&nbsp;</label>\n            <div>\n              <a id="{{setId(\'fly-remove-prop\',$index)}}" class="btn btn-link pull-right" ng-href="#"><i\n                  class="icon icon-v-trash" ng-click="removeFlyoutAttributes($index, state)"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)"></i></a>\n            </div>\n          </div>\n        </div>\n        <button id="{{setId(state.name,\'add-prop\')}}" type="button" class="btn btn-link"\n          ng-click="addFlyoutAttributes(state)"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)">+\n          Add Attributes</button>\n\n      </div>\n    </div>\n  </div>\n\n  \x3c!-- Custom LWC Properties--\x3e\n  <div class="row" ng-show="(state.customLwc && $root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc)">\n    <label class="form-group col-lg-12">\n      <input type="checkbox" name="" ng-model="state.customLwcRepeat"> Repeat state over records\n    </label>\n    <div class="context-variables">\n      <div class="form-group col-lg-12">\n        <h5><strong>Custom LWC Attributes</strong> </h5>\n        <hr class="no-margin" />\n      </div>\n      <div class="form-group col-lg-12" ng-show="state.customLwcAttributes.length > 0">\n        <div class="row" ng-repeat="prop in state.customLwcAttributes">\n          <div class="form-group col-lg-5">\n            <label for="cardBundle" ng-if="$first">Name</label>\n            <input type="text" id="{{setId(state.name,\'prop-name\')}}" class="form-control" ng-model="prop.name"\n              placeholder="Variable name"\n              ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)"\n              autocomplete="new-password" />\n          </div>\n          <div class="form-group col-lg-5">\n            <label for="cardBundle" ng-if="$first">Value</label>\n            <input type="text" id="{{setId(state.name,\'prop-value\')}}" class="form-control" ng-model="prop.val"\n              bs-options="field.name as field.name for field in stateFields" bs-typeahead="bs-typeahead"\n              placeholder="Variable value" data-watch-options="true"\n              ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)"\n              autocomplete="new-password" />\n          </div>\n          <div class="form-group col-lg-2">\n            <label for="cardBundle" ng-if="$first">&nbsp;</label>\n            <div>\n              <a id="{{setId(state.name,\'remove-prop\')}}" class="btn btn-link pull-right" ng-href="#"><i\n                  class="icon icon-v-trash" ng-click="removeCustomLwcAttributes($index, state)"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)"></i></a>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class="form-group col-lg-12">\n        <button id="{{setId(state.name,\'add-prop\')}}" type="button" class="btn btn-link"\n          ng-click="addCustomLwcAttributes(state)"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || isLockedCard(card)">+\n          Add Attributes</button>\n      </div>\n    </div>\n  </div>\n\n  \x3c!-- CONDITIONS --\x3e\n  <div class="row">\n    <div class="form-group col-sm-12">\n      <h5 for="name"><strong>Conditions</strong> </h5>\n      <hr class="no-margin" />\n    </div>\n    <div class="col-sm-12" ng-include="\'ConditionsGroupTemplate.html\'"\n      ng-init="initConditions(state);condition = state.conditions;"></div>\n  </div>\n</form>'),$templateCache.put("CustomFieldModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n    <div class="modal-dialog">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close" aria-label="Close" ng-click="$hide();"><span aria-hidden="true">&times;</span></button>\n                <h4 class="modal-title">Custom Field</h4>\n            </div>\n            <div class="modal-body docsModalBody">\n                <div class="row">\n                    <div class="context-variables">\n                        <div class="form-group col-lg-12" ng-show="activeField.data">\n                            <div class="row" ng-repeat="property in propertySet(activeField.data, \'data\', activeField) track by property.key">\n                                <div class="form-group col-lg-5">\n\n                                    <input type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.key" ng-change="property.update(\'data\')"/>\n                                </div>\n                                <div class="form-group col-lg-5 nopadding">\n                                    <input type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.value" bs-options="field.name as field.name for field in stateFields"\n                                        bs-typeahead="bs-typeahead" ng-change="property.update(\'data\')" data-watch-options="true"/>\n                                </div>\n                                <div class="form-group col-lg-2">\n                                    <a class="btn btn-link pull-left" ng-href="#" ><i class="icon icon-v-trash" ng-click="removeMapProperty(activeField.data,property.key)"></i></a>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="form-inline col-lg-12">\n                            <button type="button" class="btn btn-link" ng-click="addMapProperty(activeField.data, \'data\', activeField)" >\n                                + Add Field\n                            </button>\n                            <div class="form-group">\n                                <label for="copyField">Copy all custom properties from &nbsp;</label>\n                                <select id="copyField" class="form-control" ng-change="onCopyCustomProperties(copyField.selectedField)" ng-model="copyField.selectedField"\n                                    ng-options="field.label for field in activeState.fields"></select>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" ng-click="$hide();">{{ ::\'helpDialogClose\' | localize: \'Close\' }}</button>\n            </div>\n        </div>\n    </div>\n</div>'),$templateCache.put("lwcDeploymentStatusModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog modal-sm">\n    <div class="modal-content">\n      <div class="modal-header" ng-show="title">\n        <h4 class="modal-title" ng-bind="title"></h4>\n      </div>\n      <div class="modal-body text-center"><span ng-bind="content"></span>\n        <i class="spinner"></i>\n      <h1>\n        {{status.message}}\n       \x3c!-- <i>{{::\'DeleteTarget\' | localize : \'Are you sure, you want to delete target? All properties will be lost\' }}</i>--\x3e\n      </h1><h3 class="wordWrap-breakWord" ng-if="status.name">{{status.name}}</h3></div>\n      \n    </div>\n  </div>\n</div>'),$templateCache.put("EditJsonModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header" ng-show="title">\n        <button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" ng-bind="title"></h4>\n      </div>\n      <div class="modal-body">\n        <div class="form-group" \n             ng-class="{\'has-feedback has-error\': isInvalid}">\n            <textarea class="form-control json-editor"\n                      ng-model="jsonAsText"\n                      ng-change="onJsonChange(jsonAsText)"\n                      rows="30"></textarea>\n            <span ng-if="isInvalid"\n                  class="icon-v-close-circle form-control-feedback"\n                  data-container=".container"\n                  data-type="info" bs-tooltip="tooltip"\n                  bs-enabled="true"\n                  data-title="{{ ::\'DesInvalidJson\' | localize:\'Invalid JSON\' }}"\n                  aria-hidden="true"></span>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-primary" ng-disabled="isInvalid" ng-click="save();$hide()">{{ ::\'Save\' | localize: \'Save\' }}</button>\n        <button type="button" class="btn btn-default" ng-click="$hide()">{{ ::\'Cancel\' | localize: \'Cancel\' }}</button>\n      </div>\n    </div>\n  </div>\n</div>'),$templateCache.put("LayoutProperties.tpl.html",'<form>\n  <div class="row">\n    <div class="form-group col-lg-12">\n      <label for="name">Name\n        <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event, \'layoutName\')"><i\n            class="icon icon-v-information-line"></i></a>\n      </label>\n      <div ng-class="$root.layout[nsPrefix + \'Type__c\'] == \'Flyout\' ? \'input-group\':\'\'">\n        <input type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}" ng-model="$root.layout.Name"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout || $root.layout.Id "\n          autocomplete="new-password" />\n        <span class="input-group-btn" ng-if="$root.layout[nsPrefix + \'Type__c\'].toLowerCase() == \'flyout\'">\n          <a class="btn btn-link pull-right">\n            <i class="icon icon-v-information-line"\n              ng-if="$root.mapOfCardsToFlyout[$root.layout.Name] === undefined || $root.mapOfCardsToFlyout[$root.layout.Name].length == 0"\n              data-container=".container" data-type="info" bs-tooltip="$root.layout" bs-enabled="true" data-html="true"\n              data-title="{{ ::\'flyoutNotUsedInfoMessage\' | localize:\'This flyout is not used in any card.\' }}"></i>\n            <i class="icon icon-v-information-line" ng-if="$root.mapOfCardsToFlyout[$root.layout.Name].length > 0"\n              data-container=".container" data-type="info" bs-tooltip="$root.layout" bs-enabled="true" data-html="true"\n              data-title="{{ ::\'flyoutUsageInfoMessage\' | localize:\'This flyout is used in the following cards: {1}\':$root.mapOfCardsToFlyout[$root.layout.Name].join(\', \')}}"></i>\n          </a>\n        </span>\n      </div>\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-12"\n      ng-if="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc && $root.layout[$root.nsPrefix+\'Active__c\']">\n      <label for="name">Component Name : {{$root.layout[$root.nsPrefix+\'Definition__c\'].componentName}}</label>\n      </select>\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-12">\n      <label for="name">Type</label>\n      <select class="form-control" id="{{layoutName}}-type" ng-model="$root.layout[$root.nsPrefix+\'Type__c\']"\n        ng-options="layoutType for layoutType in $root.layoutTypes"\n        ng-disabled="$root.layout[nsPrefix + \'Active__c\']  || $root.lockedLayout"></select>\n      </select>\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-12">\n      <label for="name">Author</label>\n      <input type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}"\n        ng-model="$root.layout[$root.nsPrefix+\'Author__c\']"\n        ng-disabled="$root.layout[nsPrefix + \'Active__c\']  || $root.lockedLayout || $root.authorLocked"\n        autocomplete="new-password" />\n    </div>\n  </div>\n  <div class="row" ng-if="$root.parentLayout">\n    <div class="form-group col-lg-12">\n      <label for="name">Parent</label>\n      <a ng-click="openUrl(\'/apex/\'+ $root.nsPrefix + \'carddesignernew?id=\' + $root.parentLayout.Id,$event, true)"\n        class="" id="{{layoutName}}-name">{{$root.parentLayout.Name}} - Version\n        {{$root.parentLayout[$root.nsPrefix + \'Version__c\']}}</a>\n    </div>\n  </div>\n  <div class="row">\n    <div class="form-group col-lg-12" ng-init="setPermissionValue()">\n      <label for="name">Required Permissions <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event, \'requiredPermission\')"><i\n        class="icon icon-v-information-line"></i></a></label>\n      <input type="text" class="form-control" ng-change="setPermissionValue()" ng-model-options="{ updateOn: \'blur\'}"\n        ng-model="$root.layout[$root.nsPrefix+\'RequiredPermission__c\']"\n        ng-disabled="$root.layout[nsPrefix + \'Active__c\']  || $root.lockedLayout" autocomplete="new-password" />\n    </div>\n  </div>\n  <div>\n\n\n    <div class="row" ng-if="!$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n      <div class="form-group col-lg-12" ng-init="changeTemplate()">\n        <label for="name">Template</label>\n        <div class="input-group">\n          <input type="text" id="{{layoutName}}-template" data-template="TypeaheadCustomTemp.tpl.html"\n            class="form-control" ng-model="$root.layout[$root.nsPrefix+\'Definition__c\'][\'templates\'][0].templateUrl"\n            bs-options="template as template.Name for template in $root.templates | orderBy: [nsPrefix + \'Type__c\', \'Name\'] | groupByField : nsPrefix + \'Type__c\'"\n            bs-typeahead="bs-typeahead" autocomplete="new-password" ng-change="changeTemplate()"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\']  || $root.lockedLayout">\n\n          <span class="input-group-btn">\n            <a class="btn btn-link pull-right"\n              ng-click="openUrl(templateUrlPrefix + $root.layout[$root.nsPrefix+\'Definition__c\'][\'templates\'][0].templateUrl,$event, true)"\n              title="{{ ::\'editTemplateIconLabel\' | localize:\'Edit Template\' }}" bs-tooltip\n              data-container=".container"><i class="icon icon-v-link"></i></a>\n          </span>\n        </div>\n        <div class="input-group"\n          ng-if="isTemplateActive($root.layout[$root.nsPrefix+\'Definition__c\'][\'templates\'][0].templateUrl,$root.layout.Name)">\n          <label class="text-danger"><i class="icon icon-v-warning-circle-line text-danger"></i>\n            {{ ::\'TemplateNotActiveLabel\' | localize:\'The template is inactive/invalid\' }} </label>\n        </div>\n      </div>\n    </div>\n\n    <div class="row" ng-if="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n      <div class="form-group col-lg-12" ng-init="changeTemplate()">\n        <label for="name">Layout LWC</label>\n        <div class="input-group">\n          <input type="text" id="{{layoutName}}-template" data-template="TypeaheadCustomTemp.tpl.html"\n            class="form-control" ng-model="$root.layout[$root.nsPrefix+\'Definition__c\'].lwc"\n            bs-options="template as template.MasterLabel for template in $root.lightningwebcomponents"\n            bs-typeahead="bs-typeahead" autocomplete="new-password" ng-change="selectLwc($root.layout.Name)"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\']  || $root.lockedLayout">\n          <span class="input-group-btn" >\n            <a class="btn btn-link pull-right download-icon-grey"\n              ng-click="downloadLWCByName($root.layout[$root.nsPrefix+\'Definition__c\'].lwc)"\n              ng-disabled="isManagedLWC($root.layout[$root.nsPrefix+\'Definition__c\'].lwc) || $root.downloadingLwc" title="{{ ::\'DownloadLWC\' | localize:\'Download LWC\' }}" bs-tooltip\n              data-container=".container"><i class="icon icon-v-download2" ng-class="{\'icon-grey-disable\':isManagedLWC($root.layout[$root.nsPrefix+\'Definition__c\'].lwc)}"></i></a>\n          </span>\n          <span class="input-group-btn" ng-show="isManagedLWC($root.layout[$root.nsPrefix+\'Definition__c\'].lwc)">\n            <a class="btn btn-link pull-right tooltip-icon-grey" href="javascript:void(0);"><i class="icon icon-v-information-line" data-container=".container"\n              data-type="info" bs-tooltip="card" bs-enabled="true" data-html="true" data-title="{{testLabel}}"></i></a>\n          </span>\n        </div>\n        <div class="input-group"\n          ng-if="isLwcActive($root.layout[$root.nsPrefix+\'Definition__c\'].lwc.DeveloperName,$root.layout.Name)">\n          <label class="text-danger"><i class="icon icon-v-warning-circle-line text-danger"></i>\n            {{ ::\'LwcNotActiveLabel\' | localize:\'The LWC is inactive/invalid\' }} </label>\n        </div>\n      </div>\n    </div>\n\n\n    <div class="row">\n      <div class="form-group col-lg-3">\n        <label for="name">Version {{$root.layout[$root.nsPrefix+\'Version__c\']}}</label>\n      </div>\n      <div class="form-group col-lg-4">\n        <button id="{{layoutName}}-clone-btn" type="button" class="btn btn-default always-active btn-block"\n          ng-disabled="$root.layout.errors.length>0 || disableVersionBtn" ng-click="showCloneModal($event)"> Clone\n        </button>\n      </div>\n      <div class="form-group col-lg-5">\n        <button id="{{layoutName}}-new-version-btn" type="button" class="btn btn-default always-active btn-block"\n          ng-disabled="$root.layout.errors.length>0 || disableVersionBtn  || $root.lockedLayout"\n          ng-click="newVersion($event)"> Create Version </button>\n      </div>\n    </div>\n    <div class="row">\n      <div class="form-group col-lg-5">\n        <div class="toggle-switch">\n          <span class="toggle-label toggle-to">Activate:</span>\n          <div class="switch">\n            <input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round" type="checkbox"\n              ng-disabled="$root.layout.errors.length > 0 && !$root.layout[$root.nsPrefix+\'Active__c\']"\n              ng-model="$root.layout[$root.nsPrefix+\'Active__c\']" ng-change="toggleActivateLayout()"\n              autocomplete="new-password" />\n            <label for="cmn-toggle-1"></label>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class="row">\n      <div class="form-group col-lg-12">\n        <h5><strong>LWC Settings</strong> <a href="javascript:void(0);"\n            ng-click="helpNode.helpNodeModal($event, \'lwcSettings\')"><i class="icon icon-v-information-line"></i></a>\n        </h5>\n        <hr class="no-margin" />\n      </div>\n      <div class="form-group col-lg-6">\n        <div class="toggle-switch">\n          <span class=" toggle-to">Enable LWC:&nbsp;</span>\n          <div class="switch">\n            <input id="enablelwc-cmn-toggle-2" class="cmn-toggle cmn-toggle-round" type="checkbox"\n              ng-disabled="$root.layout[$root.nsPrefix+\'Active__c\']"\n              ng-model="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc" ng-change="toggleEnableLwc()"\n              autocomplete="new-password" />\n            <label for="enablelwc-cmn-toggle-2"></label>\n          </div>\n        </div>\n      </div>\n      <div class="form-group col-lg-6" ng-if="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n        <button id="{{layoutName}}-lwc-deploy-btn" type="button" class="btn btn-default always-active btn-block"\n          ng-disabled="$root.layout.errors.length>0\n            || ($root.layout[$root.nsPrefix+\'Active__c\'] && !$root.lwcCompExist) \n            || $root.layout.saving\n            || ($root.lwcCreatePendingRequests.length === 0 \n            && $root.lwcUpdatePendingRequests.length === 0)" ng-click="doLwcDeploy()"> Deploy </button>\n      </div>\n      <div class="input-group text-normal col-lg-12" ng-if="$root.isCardActive">\n        <label class="text-danger"><i class="icon icon-v-warning-circle-line text-danger"></i>\n          {{ ::\'DeactivateCards\' | localize:\'Please deactivate following cards to enable LWC: {1}\'}}\n          <ul>\n            <li ng-repeat="card in cardNeedsToDeactivated">\n              - {{card}}\n            </li>\n          </ul>\n        </label>\n      </div>\n    </div>\n    <div ng-if="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n      \x3c!--Enable User Info--\x3e\n      <div class="row">\n        <div class="form-group col-lg-12">\n          <div class="toggle-switch">\n            <span class=" toggle-to">{{ ::\'IncludeUserInfo\' | localize:\'Include User Information:\' }}&nbsp;</span>\n            <div class="switch">\n              <input id="cmn-toggle-6" class="cmn-toggle cmn-toggle-round" type="checkbox"\n                ng-disabled="$root.layout[$root.nsPrefix+\'Active__c\']"\n                ng-model="$root.layout[$root.nsPrefix+\'Definition__c\'].enableUserInfo" autocomplete="new-password" />\n              <label for="cmn-toggle-6"></label>\n            </div>\n          </div>\n        </div>\n      </div>\n      \x3c!-- Xml Interface  --\x3e\n      <div class="row">\n        <div class="context-variables">\n          <div class="form-group col-lg-6">\n            <button type="button" class="btn btn-default always-active btn-block"\n              ng-disabled="!$root.layout[$root.nsPrefix+\'Active__c\']" ng-click="showXmlInterface()">\n              {{ ::\'showXmlInterface\' | localize:\'Show Xml Interface\' }} </button>\n          </div>\n          <a href="javascript:void(0);"><i class="icon icon-v-information-line" data-container=".container"\n              data-type="info" bs-tooltip="card" bs-enabled="true" data-html="true"\n              data-title="Activate Layout to edit XML" ng-if="!$root.layout[$root.nsPrefix+\'Active__c\']"></i></a>\n        </div>\n      </div>\n      \x3c!-- Xml Interface ends --\x3e\n      <div class="row">\n\n        <div class="form-group col-lg-5">\n          <div class="toggle-switch">\n            <span class=" toggle-to">Omniscript Support: &nbsp;</span>\n            <div class="switch">\n              <input id="cmn-toggle-4" class="cmn-toggle cmn-toggle-round" type="checkbox"\n                ng-disabled="$root.layout[$root.nsPrefix+\'Active__c\']"\n                ng-model="$root.layout[$root.nsPrefix+\'Definition__c\'].lwc.omniSupport" autocomplete="new-password" />\n              <label for="cmn-toggle-4"></label>\n            </div>\n          </div>\n        </div>\n        <div class="form-group col-lg-12"\n          ng-init="$root.layout[$root.nsPrefix+\'Definition__c\'].repeatCards = $root.layout[$root.nsPrefix+\'Definition__c\'].repeatCards ? $root.layout[$root.nsPrefix+\'Definition__c\'].repeatCards : false">\n          <label>Loop Settings</label>\n          <select class="form-control" id="{{layoutName}}-render"\n            ng-options="(item ? \'Repeat Records\': \'Repeat Cards\') for item in [true, false]"\n            ng-model="$root.layout[$root.nsPrefix+\'Definition__c\'].repeatCards"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\']  || $root.lockedLayout">\n          </select>\n          <label for="cmn-toggle-4"></label>\n        </div>\n      </div>\n    </div>\n    <div class="row">\n      <div class="context-variables">\n        <div class="form-group col-lg-12">\n          <h5><strong>Layout Session Variables</strong> </h5>\n          <hr class="no-margin" />\n        </div>\n        <div class="form-group col-lg-12"\n          ng-show="$root.layout[$root.nsPrefix+\'Definition__c\'][\'sessionVars\'].length > 0">\n          <div class="row" ng-repeat="sessionVar in $root.layout[$root.nsPrefix+\'Definition__c\'][\'sessionVars\']">\n            <div class="form-group col-lg-5">\n              <label for="cardBundle" ng-if="$first">Name</label>\n              <input id="{{layoutName}}-session-var-name-{{$index}}" type="text" class="form-control"\n                ng-model="sessionVar.name" placeholder="Variable name"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\']  || $root.lockedLayout" autocomplete="new-password" />\n            </div>\n            <div class="form-group col-lg-5">\n              <label for="cardBundle" ng-if="$first">Value</label>\n              <input id="{{layoutName}}-session-var-value-{{$index}}" type="text" class="form-control"\n                ng-model="sessionVar.val" placeholder="Variable value"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout" autocomplete="new-password" />\n            </div>\n            <div class="form-group col-lg-2">\n              <label for="cardBundle" ng-if="$first">&nbsp;</label>\n              <span class="col-lg-1">\n                <a id="{{layoutName}}-session-var-delete-{{$index}}" class="btn btn-link pull-right" ng-href="#"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout">\n                  <i class="icon icon-v-trash" ng-click="removeSessionVar($index)"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout"></i>\n                </a>\n              </span>\n            </div>\n          </div>\n        </div>\n        <div class="form-group col-lg-12">\n          <button id="{{layoutName}}-session-var-add-btn" type="button" class="btn btn-link" ng-click="addSessionVars()"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout">+ Add Session Variables</button>\n        </div>\n      </div>\n    </div>\n    <div class="row">\n      <div class="col-lg-12">\n        <h4 ng-click="collapse = !collapse">\n          <i class="icon icon-v-right-arrow" ng-show="collapse"></i>\n          <i class="icon icon-v-down-arrow" ng-show="!collapse"></i>\n          Metatags\n          <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event, \'metatag\')">\n            <i class="icon icon-v-information-line"></i>\n          </a>\n        </h4>\n      </div>\n    </div>\n    <div class="row" ng-show="!collapse">\n      <div class="context-variables">\n        <div class="form-group col-lg-12"\n          ng-show="$root.layout[$root.nsPrefix+\'Definition__c\'][\'metatagVars\'].length > 0">\n          <div class="row" ng-repeat="metatag in $root.layout[$root.nsPrefix+\'Definition__c\'][\'metatagVars\']">\n            <div class="form-group col-lg-5">\n              <label for="cardBundle" ng-if="$first">Name</label>\n              <input id="{{layoutName}}-metatag-var-name-{{$index}}"\n                bs-options="field.name as field.name for field in knownMetatags| filterAndSort:$root.layout[$root.nsPrefix+\'Definition__c\'][\'metatagVars\']:\'name\'"\n                bs-typeahead="bs-typeahead" type="text" class="form-control" ng-model="metatag.name"\n                ng-blur="updateMetatag(metatag.name)" placeholder="Metatag name"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\']  || $root.lockedLayout" autocomplete="new-password" />\n            </div>\n            <div class="form-group col-lg-5">\n              <label for="cardBundle" ng-if="$first">Value</label>\n              <input id="{{layoutName}}-metatag-var-value-{{$index}}" type="text" class="form-control"\n                ng-model="metatag.val" placeholder="Metatag value"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout" autocomplete="new-password" />\n            </div>\n            <div class="form-group col-lg-2">\n              <label for="cardBundle" ng-if="$first">&nbsp;</label>\n              <span class="col-lg-1">\n                <a id="{{layoutName}}-metatag-var-delete-{{$index}}" class="btn btn-link pull-right" ng-href="#"\n                  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout">\n                  <i class="icon icon-v-trash" ng-click="removeMetatag($index)"\n                    ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout"></i>\n                </a>\n              </span>\n            </div>\n          </div>\n        </div>\n        <div class="form-group col-lg-12">\n          <button id="{{layoutName}}-metatag-var-add-btn" type="button" class="btn btn-link" ng-click="addMetatags()"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout">+ Add Metatags</button>\n        </div>\n      </div>\n    </div>\n    \x3c!-- <datasourcefilter datasource="$root.layout[$root.nsPrefix+\'Definition__c\'].dataSource"\n                    obj="$root.layout"\n                    type="\'layout\'"\n                    disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout" \n                    obj-id="$root.layout.Id">\n  </datasourcefilter> --\x3e\n\n    <datasourcefilter datasource="$root.layout[$root.nsPrefix+\'Definition__c\'].dataSource"\n      encrypted-datasource="$root.layout[$root.nsPrefix+\'Datasource__c\']" obj="$root.layout" type="\'layout\'"\n      ng-if="$root.layout" disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n      obj-id="$root.layout.Id">\n    </datasourcefilter>\n</form>'),$templateCache.put("LayoutCloneModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header" ng-show="title">\n        <button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" ng-bind="title"></h4>\n      </div>\n      <div class="modal-body">\n        <div class="alert alert-danger" role="alert" ng-if="clonedLayout.errors" ng-repeat="error in clonedLayout.errors">\n          {{error.message}}\n        </div>\n        <div class="col-sm-12">\n            <div class="row">\n              <div class="form-group col-sm-8">\n                <label for="name">Layout Name</label>\n                <input class="form-control" ng-model="clonedLayout.Name" placeholder="Enter name" type="text" />\n              </div>\n            </div>\n            <div class="row">\n              <div class="form-group col-sm-8">\n                <label for="name">Layout Type</label>\n                <select class="form-control" ng-model="clonedLayout[$root.nsPrefix+\'Type__c\']" ng-options="layoutType for layoutType in $root.layoutTypes"></select>\n              </div>\n            </div>\n            <div class="row">\n              <div class="form-group col-sm-8">\n                <label for="name">Layout Author</label>\n                <input class="form-control" ng-model="clonedLayout[$root.nsPrefix+\'Author__c\']" placeholder="Enter Author" type="text" />\n              </div>\n            </div>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button type="button" ng-if="!layoutSaving" class="btn btn-primary" ng-click="saveLayout($hide)">{{ ::\'SaveTemplateDialogConfirmOk\' | localize: \'Clone\' }}</button>\n        <i ng-if="layoutSaving" class="pull-right spinner"></i>\n        <button type="button" class="btn btn-default" ng-click="$hide()">{{ ::\'SaveTemplateDialogConfirmCancel\' | localize: \'Cancel\' }}</button>\n      </div>\n    </div>\n  </div>\n</div>'),$templateCache.put("ConditionsGroupActionTemplate.html",'<div class="row" ng-if="!condition.group && condition.type != \'system\'">\n    <div class="form-group col-sm-12">\n      <button type="button" class="btn btn-default"\n          ng-model="condition.logicalOperator"\n          ng-if="condition.logicalOperator"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n          data-html="1"\n          ng-change="evalConditions(action, action.conditions.group)"\n          bs-options="operator.value as operator.name for operator in logicalOperators" bs-select>\n    </div>\n    <div class="form-group col-sm-4">\n      <input  type="text" class="form-control"\n            ng-model="condition.field"\n            bs-options="field.name as field.name for field in stateFields"\n            bs-typeahead="bs-typeahead"\n            ng-change="evalConditions(action, action.conditions.group)"\n            data-watch-options="true" \n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"/>\n    </div>\n    <div class="form-group col-sm-2">\n      <select class="form-control" ng-model="condition.operator" ng-init="condition.operator = condition.operator ? condition.operator : \'==\'" ng-options="operator.value as operator.name for operator in conditionOperators"  ng-change="evalConditions(action, action.conditions.group)"\n              ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n      </select>\n    </div>\n    <div class="form-group col-sm-5">\n      <input type="text" ng-model="condition.value" class="form-control"  ng-change="evalConditions(action, action.conditions.group)" placeholder="Enter a value"  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"/>\n    </div>\n    <div class="form-group col-sm-1">\n        <label for="cardBundle" ng-if="$first">&nbsp;</label>\n        <span class="col-sm-1" style="padding:0">\n          <a class="btn btn-link" ng-href="#" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"><i class="icon icon-v-trash" ng-click="deleteRule(action, condition, action.conditions.group)"></i></a>\n        </span>\n    </div>\n</div>\n<button type="button" class="btn btn-default"\n          ng-model="condition.logicalOperator"\n          ng-if="condition.group && condition.logicalOperator"\n          ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n          data-html="1"\n          ng-change="evalConditions(action, action.conditions.group)"\n          bs-options="operator.value as operator.name for operator in logicalOperators" bs-select>\n</button>\n<div class="condition-group-block" ng-if="condition.group">\n  <i class="icon icon-v-right-arrow"\n          ng-show="condition.collapse && condition.group && condition != action.conditions" ng-click="condition.collapse = !condition.collapse"></i>\n  <i class="icon icon-v-down-arrow"\n      ng-show="!condition.collapse && condition.group && condition != action.conditions" ng-click="condition.collapse = !condition.collapse; evalConditions(condition, condition.group);"></i>\n  <div ng-show="condition.collapse && condition.group" class="condtion-collapse">\n    {{condition.filter}}\n  </div>\n  <div class="condition-group" ng-show="!condition.collapse">\n\n    <div ng-repeat="condition in condition.group track by $index"\n            ng-include="\'ConditionsGroupActionTemplate.html\'"></div>\n    <button type="button" class="btn btn-link"\n            ng-click="addCondition(action, condition.group)" ng-disabled="action.disableAddCondition || $root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">{{ ::\'stateAddCondition\' | localize:\'+ Add Condition\' }}</button>\n    <button type="button" class="btn btn-link"\n            ng-click="addGroup(action, condition.group)" ng-disabled="action.disableAddCondition || $root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">{{ ::\'stateAddGroup\' | localize:\'+ Add Group\' }}</button>\n    <button type="button" class="btn btn-link"\n            ng-click="deleteGroup(action, condition, action.conditions.group)" \n            ng-if="condition != action.conditions"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n        <span class="icon icon-v-trash"></span>\n    </button>\n</div>\n</div>\n'),$templateCache.put("DataSourceViewModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n    <div class="modal-dialog datasource-view">\n        <div class="modal-content">\n            <div class="modal-header" ng-show="title">\n                <button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button>\n                <h4 class="modal-title" ng-bind="title"></h4>\n            </div>\n            <div class="copy-to-clipboard">\n                <button type="button" class="btn btn-default copyToClipboard" ngclipboard data-clipboard-target="#{{leftOrRightIndicator}}dataSourceResultCode">{{::\'CopyToClipBoard\' | localize: \'Copy to clipboard\'}}</button>\n            </div>\n            <div class="modal-body datasource-view-modal" ng-if="content" ng-bind="content"></div>\n            <div class="modal-body datasource-view-modal" ng-if="!content" >\n                <div ng-if="isFetchingModalData">\n                    <p class="text-danger" ng-if="!datasource.sampleDate">{{::\'PostStreamingData\' | localize: \'Post data on channel atleast once to fetch field values.\'}}</p>\n                    <div><i class="pull-left spinner"></i> <span class="pull-left spinner-text">{{::\'WaitingForData\' | localize: \'Waiting for data...\'}}</span></div>\n                </div>\n                <div ng-if="!isFetchingModalData">\n                    <h2>LIVE DATA:</h2>\n                    <pre id="dataSourceResultCode">{{fetchedModalData}}</pre>\n                </div>\n            </div>\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" ng-click="$hide()">{{ ::\'Close\' | localize: \'Close\' }}</button>\n            </div>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("docs/customPage.tpl.html","<div>\n    <h2>Custom Page</h2>\n    <p>\n        Allows to add a custom Preview Page tied to this particular layout by specifying the Preview Page Label and the Visualforce Page Name which will be used for displaying. This page will be passed all the parameters specified on the params variable plus layout, layoutId, useCache and isdtp=vw to open the page without header and sidebars (in aloha).\n    </p>\n</div>\n"),$templateCache.put("docs/cardState.tpl.html",'<div>\n    <h2>Custom Lwc</h2>\n    <p>\n        This allows user to add a independent custom lightning web component to card.\n\n        <h3 class="sticky">Repeat state over records</h3>\n        <br>\n        This is to specify whether that selected custom lwc should iterate over records or not. To understand this better lets take two example. <br>\n        A. If selected custom lwc is to be displayed for a single record object then it will act exactly like OOTB card-active-state and iterate over records.\n        In this case this should be checked.\n        <br>\n        <br>\n        B. If selected custom lwc is more of list or data table kind of component then in that case this should be unchecked otherwise that will iterate for all records\n        In this case you can set data by using below methods.\n        <h3 class="sticky">Custom Lwc Attributes</h3>\n        <br>\n       User can set data from layout to their custom lwc by setting their @api variable names from here. <br>\n       For eg: If it is a <b>TYPE A</b> of custom lwc from above and it has @api variables like label, name then this can be set by selecting relevant record attribute from datasource.\n       Otherwise we can set scope variables too if it is a <b>TYPE B</b> category like for @api variable records value can be <b>$scope.records</b> and for session it will be <b>$scope.session.&lt;variablename&gt;</b>\n\n       <h3 class="sticky">Conditions</h3>\n        <br>\n        User can specify conditions as well, in case of multiple states. In this session variables can also be used.\n    </p>\n</div>'),$templateCache.put("docs/stateFlyout.tpl.html",'<div>\n    <h2>Flyout</h2>\n    <p>\n        The flyout section in the state allows the selection of an active Layout of <i>type = Flyout</i> to show further information about the current record, it can be children records (Contacts for an Account) or even a detailed view of the record at hand.<br/>\n        The parent context variable is always passed down the Flyout but you can also set a Flyout Data Object, this object permits you to set the records to be displayed inside of the flyout instead of using a Data Source to set them.\n\n        <h3 class="sticky">Flyout Data Object</h3>\n        Valid values are:\n        <br/>\n        <table class="docsTable">\n            <tr>\n                <td>\n                    <b>$scope.data</b>\n                </td>\n                <td>\n                    Represents the whole parent card including actions and states, this is useful when showing a detailed view of the card\n                </td>\n            </tr>\n            <tr>\n                <td>\n                    <b>$scope.obj.children</b>\n                </td>\n                <td>\n                    Children being in this context is a variable name that represents an array inside of the object like PolicyLineItems for a Policy or Contacts for an Account\n                </td>\n            </tr>\n        </table>\n        <br>\n        After setting these values the recommended data source on the Flyout layout would be "<b>Parent</b>".\n        <br>\n        Leave the Flyout Data Object empty if you want to add the custom data source for flyout.\n\n        <h3 class="sticky">Flyout Properties</h3>\n\n        User can set data from layout to their custom lwc by setting their @api variable names from here. <br><br>\n        For eg: If it is has @api variables like label, name then this can be set by selecting relevant record attribute from datasource.\n        <br/> <br/>\n        Otherwise we can set scope variables too value can be \n       \n        <ul class="no=padding">\n            <li><b>$scope.records</b> to send whole records array.</li>\n            <li><b>$scope.session.&lt;variablename&gt;</b> to set particular session variable.</li>\n            <li><b>$scope.obj</b> to set the whole card object.</li>\n            <li><b>$scope.state</b> to set the card state.</li>\n        <ul>\n \n    </p>\n</div>\n\n\n\n\n\n\n'),$templateCache.put("docs/timeOut.tpl.html","<div>\n    <h2>Timeout</h2>\n    <p>\n        The <b>timeout</b> option (set in milliseconds) is meant to control the time the framework will wait for the designated Datasource to return with a response. If the timeout takes place, the framework will provide an empty object as <b>records</b> and will provide an error message in the <b>$scope.datasourceStatus</b> object to be handled by the implementation (by either providing a retry, automatic refresh, etc).\n    </p>\n    <p>\n        Timeouts are very useful when handling user interaction with long running processes. Setting an appropriate timeout value will allow the application and users to react accordingly to long wait times.\n    </p>\n</div>"),$templateCache.put("docs/layoutTestDatasourceSettings.tpl.html",'<div>\n    <h2 class="sticky">Test Data Source Settings</h2>\n    <p>\n        Test data source settings is used to populate the dynamic fields in a data source endpoint.<br/>\n        Example:\n        <pre>\n        Rest Datasource:\n            <code ng-non-bindable>\n                Endpoint: /app/order/v2/getdetails/{{params.id}}?account={{parent.obj.accountid}}\n            </code>\n        </pre>\n        Above datasource can be tested in card designer by adding the test dataset for <code>id</code> and <code>accountid</code> by clicking on <b> +Add Test variables</b>\n        <br/><br/>\n        <table class="docsTable">\n            <tr>\n                <td><b>Name</b></td>\n                <td><b>Value</b></td>\n            </tr>\n            <tr>\n                <td>params.id</td>\n                <td>801370000006p4x</td>\n            </tr>\n            <tr>\n                <td>parent.obj.accountid</td>\n                <td>00137000003Ogdk</td>\n            </tr>\n        </table>\n        <br/>\n        Test settings are used for populating the enpoint result dataset needed for building \'card\' states. Also used in layout preview.\n\n    </p>\n</div>\n'),$templateCache.put("docs/lwcSettings.tpl.html",'<div>\n    <h2>LWC Settings</h2>\n    <p>\n        The LWC setting shows the avaliable options to configure the lwc component, the below table provide a small\n        description of what the fields does:<br />\n        <table class="docsTable">\n            <tr>\n                <td><b>Field</b></td>\n                <td><b>Description</b></td>\n            </tr>\n            <tr>\n                <td>Enable LWC</td>\n                <td>Enable/Disable the support of LWC for the Layout. When enabled, a LWC component gets created and\n                    enables the card designer to configure and edit the created LWC</td>\n            </tr>\n            <tr>\n                <td>Include User Information</td>\n                <td>Enable/Disable the fetch of User information like Profile, Locale and other information which will\n                    be set in <b>$root.vlocity.xxx</b> inside the layout. If you are using $root.vlocity.xxx in any of\n                    the fields or templates enable this feature for it to be available.\n                </td>\n            </tr>\n            <tr>\n                <td>Show Xml Interface</td>\n                <td>Provides a visual editor to configuration the metadata values for the component, including the\n                    design configuration for the Lightning App Builder and Community Builder, For more detail <a\n                        href="https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.reference_configuration_tags"\n                        target="_blank">click here</a>\n                </td>\n            </tr>\n            <tr>\n                <td>Omniscript Supports</td>\n                <td>When enabled it adds omniscript support to the generated LWC, so this layout can be directly used in\n                    Omniscript Designer.</td>\n            </tr>\n            <tr>\n                <td>Loop Settings</td>\n                <td>Repeat Cards option groups the records by cards. For example, if we have two cards, say case and\n                    task, when we\n                    select Repeat Cards option, all case cards will display first and task cards will display next.\n                    In case of Repeat Records option the cards will display according to the records order, ie: first\n                    case card, second task card, third task card etc...\n                </td>\n            </tr>\n            <tr>\n                <td>State LWC & Layout LWC</td>\n                <td>\n                    Both the fields let us select the LWC that needs to be used in the layout or the state. Usually\n                    the LWC that extends from BaseLayout is used in Layout LWC\n                    and the LWC component that extends from BaseState is used in State LWC\n                </td>\n            </tr>\n        </table>\n    </p>\n</div>'),$templateCache.put("docs/previewType.tpl.html",'<div>\n    <h2>Preview Type</h2>\n    <p>\n        This allows user to toggle between type of preview. There are two options: Design time & Run time\n\n        <h3 class="sticky">Design Time</h3>\n        <br>\n        All cards inside layout will be included in preview. This preview type is only available when layout is inactive.\n\n        <h3 class="sticky">Run Time</h3>\n        <br>\n        Only active cards will be visible in preview time.\n    </p>\n</div>'),$templateCache.put("docs/orderBy.tpl.html",'<div>\n    <h2 class="sticky">OrderBy</h2>\n    <p>\n        OrderBy is used to sort the data according to input fields.</p>\n    <pre>Single Level Json:\n    <code>\n[{\n    "name" : "test"\n },\n {\n    "name": "sample"\n}]\n    </code></pre>\n    <br>\n    <table class="docsTable">\n        <tr>\n            <td><b>OrderBy :</b></td>\n            <td>name</td>\n        </tr>\n    </table>\n    </br>\n\n    <pre>Multi Level Json:\n    <code>\n[{\n    "test": { "name": "test" }\n },\n {\n    "test": { "name": "sample" }\n}]\n    </code>\n    </pre>\n    <br>\n    <table class="docsTable">\n        <tr>\n            <td>\n                <b>OrderBy :</b>\n            </td>\n            <td>test.name</td>\n        </tr>\n    </table>\n    </br>\n</div>'),$templateCache.put("docs/interval.tpl.html","<div>\n    <h2>Interval</h2>\n    <p>\n        The refresh <b>interval</b> option (set in milliseconds) is meant to refresh the card datasource continuously at given interval and check for change in datasource records, if a change is identified it will reload the layout or card based on whether the interval is set on card or layout datasource </p>\n    <p>\n        Interval are very useful when we have live dashboard as we need to updated the records recursively.  </p>\n</div>"),$templateCache.put("docs/metatag.tpl.html",'<div>\n    <h2>Metatags</h2>\n    <p>\n        As an Admin we can set SEO options on a Vlocity Layout/Card to write metatags to the header of a page based on the information coming from a datasource or other sources.\n    </p>\n    <p>\n       <ul>\n           <li>\n               Metatag name will be set as name of the metatag element.<br>\n               For eg: <b>Description</b>\n           </li>\n           <li>\n               Metatag values can be a combination of string as well any scope variable and will be set as content of the metatag element.<br>\n               For eg: <b>Account name {{records[0].Name}\x3c!----\x3e}</b>, <b> Card account name {{obj.Name}\x3c!----\x3e}</b>\n           </li>\n       </ul>        \n    </p> \n    <p>\n        <h3 class="sticky">Example of meta tags:</h3>\n        <pre>\n            &lt;meta name=&quot;description&quot; content=&quot;Free Web tutorials&quot;&gt;\n            &lt;meta name=&quot;keywords&quot; content=&quot;HTML,CSS,XML,JavaScript&quot;&gt;\n            &lt;meta name=&quot;author&quot; content=&quot;John Doe&quot;&gt;\n            &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;\n        </pre>\n    </p>\n</div>\n'),$templateCache.put("docs/layoutName.tpl.html","<div>\n    <h2>Layout Name</h2>\n    <p>\n      Layout names are unique. Follow the standard naming convention:<br/>\n        <ul>\n            <li>Use lowercase</li>\n            <li>Separate by dash(-) for feature or sub feature</li>\n        </ul>\n        <code>myapp-home-product</code><br/>\n        <code>myapp-home-kitchen-sink</code>   \n    </p>\n</div>\n"),$templateCache.put("docs/dataSource.tpl.html",'<div>\n    <h2>Data Source</h2>\n    <p>\n        <h3 class="sticky">SOQL Query</h3>\n        Uses the Salesforce Object Query Language(SOQL) to search organization\'s Salesforce data for specific information.\n        <br><br>\n        Example:<br>\n        <pre><code>\n        SELECT Name,Id FROM Account LIMIT 5\n        </code></pre>\n    </p>\n    <p>\n        <h3 class="sticky">SOSL Search</h3>\n        Use the Salesforce Object Search Language (SOSL) to construct text-based search queries against the search index. <br/>\n        You can search text, email, and phone fields for multiple objects, including custom objects, that you have access to in a single query.\n        <br><br>\n        <table class="docsTable">\n            <tr>\n                <td><b>Field</b></td>\n                <td><b>Description</b></td>\n            </tr>\n            <tr>\n                <td>Search For</td>\n                <td>It should be more then one character, Text you want to search in the object field</td>\n            </tr>\n            <tr>\n                <td>In</td>\n                <td>Limits the types of fields to search, including email, name, or phone. All fields refrest to name, email and phone. </td>\n            </tr>\n            <tr>\n                <td>Returning sObject & fields</td>\n                <td>Mininum one object has to be Added, Use <code>+ Add sObject</code> to add objects and fields, It limits the objects and fields to return.</td>\n            </tr>\n            <tr>\n                <td>Limit to</td>\n                <td>Specifies the maximum number of rows to return.</td>\n            </tr>\n        </table>\n    </p>\n    <p>\n        <h3 class="sticky">DataRaptor</h3>\n        DataRaptor data source is used to make calls to vlocity DataRaptor.\n    </p>\n    <p>\n        <h3 class="sticky">Dual</h3>\n        Dual data source uses Apex Remote or Apex REST based on the platform. Desktop apps use Apex Remote and mobile apps use Apex REST.\n    </p>\n    <p>\n        <h3 class="sticky">Apex Remote</h3>\n        Apex Remote data source is used to make a Apex Remote call.<br>\n        Provide <code>Remote Class</code> and <code>Remote Method</code>\n    </p>\n    <p>\n        <h3 class="sticky">Apex REST</h3>\n        Apex REST data source is used to make a Apex REST call.\n    </p>\n    <p>\n        <h3 class="sticky">REST</h3>\n        Uses the standard REST API call.\n        Utilize the <code>+Add Header Variable</code> to add any request headers. Most third party API\'s expect various headers like token\'s, public keys and content-type. \n        <br><br>\n        <table class="docsTable">\n            <tr>\n                <td><b>Request header</b></td>\n                <td><b>Value</b></td>\n            </tr>\n            <tr>\n                <td>Accept:</td>\n                <td>application/json</td>\n            </tr>\n            <tr>\n                <td>Accept-Language:</td>\n                <td>en_US</td>\n            </tr>\n            <tr>\n                <td>Token</td>\n                <td>Ke2B34kmpOU9wen</td>\n            </tr>\n        </table>\n        <br>\n        If you\'re making a cross domain REST API call, you need to ensure that it abides by the Cross-Origin Resource Sharing (CORS) policy. Generally API response contains an header named <code>Access-Control-Allow-Origin: *</code> to facilitate CORS.\n    </p>\n    <p>\n        <h3 class="sticky">Sample</h3>\n        Sample data source allows user to embed the custom JSON directly into the layout and not depend on any external data.\n    </p>\n    <p>\n        <h3 class="sticky">Parent</h3>\n        Parent data source is used when user wants to inherit data from the parent card or layout.<br>\n        Most flyout Layouts use the parent data source to inherit the additional details for the record.\n    </p>\n\n    <h2 class="sticky">Context Variables</h2>\n    <p>\n        There are several context variables available across the framework to help provide context to datasources, flyouts, templates and other components.<br>\n        Note: all these variables are case sensitive.\n    </p>\n    <br>\n    <table class="docsTable" border="1px" ng-non-bindable>\n        <tr>\n            <th>Name</th>\n            <th>Variable</th>\n            <th>Access</th>\n            <th>Example</th>\n        </tr>\n        <tr>\n            <td>\n                <b>Page Parameters:</b><br>\n                Accessed by the {{params}} variable, it represents the page parameters passed to the url\n            </td>\n            <td>\n                {{params}}\n            </td>\n            <td>\n                Global\n            </td>\n            <td>\n                Page URL "/apex/consolecards?id=a0r37000001Q83IAAS" would represent {{params.id}} and it would equal to a0r37000001Q83IAAS.\n            </td>\n        </tr>\n        <tr>\n            <td>\n                <b>Object:</b><br>\n                The object that is represented in the card, it holds all the fields and information for the record\n            </td>\n            <td>{{obj}}</td>\n            <td>Card</td>\n            <td>\n                If the object for the card is an Account of Name = \'Test\' then {{obj.Name}} = \'Test\'\n            </td>\n        </tr>\n        <tr>\n            <td>\n                <b>Parent:</b> <br>\n                Provides parent object context to the flyout, its basically the parent data, including both the card data and the object.\n            </td>\n            <td>{{parent}}</td>\n            <td>Global (flyout)</td>\n            <td>\n                <code>SELECT Id, Name FROM Contact WHERE AccountId = {{parent.obj.Id}} </code>\n                <br>\n                where {{parent.obj.Id}} would be the Id of the Account object in the card above.\n            </td>\n        </tr>\n        <tr>\n            <td>\n                <b>Attributes:</b><br>\n                Allows access to the attributes passed to the vloc-card, vloc-layout and vloc-cmp directives so it can be used in any context.\n            </td>\n            <td>{{attrs}}</td>\n            <td>Global</td>\n            <td>\n                 &lt;vloc-card name="community-account" customtemplate="community-sidebar-ads"&gt;&lt;/vloc-card&gt;\n                <br>\n                you can access name and customtemplate by calling {{attrs.name}} and {{attrs.customtemplate}}\n            </td>\n        </tr>\n        <tr>\n            <td>\n                <b> Session Variables:</b> <br>\n                Variables that are set in the designer for runtime use, they can access any property in the scope plus the {{payload}} variable.\n            </td>\n            <td>{{session}}</td>\n            <td>Layout or Card</td>\n            <td>\n                You can set in the desinger a session variable to be named: "Title" and set it to obj.Name\n            </td>\n        </tr>\n        <tr>\n            <td>\n                <b>Payload:</b><br>\n                Temporary variable used by the session variables to access the whole result of a datasource.\n            </td>\n            <td>{{payload}}</td>\n            <td>Layout or Card</td>\n            <td>\n                payload variable  holds the whole result of the datasource so you can access other properties like payload.totalSize while using a result variable of result.records in the Datasource. <br>\n                Especially when records are filtered using Result JSON path and want to access data outside of the filtered data.\n            </td>\n        </tr>\n    </table>\n</div>\n'),$templateCache.put("docs/requiredPermission.tpl.html","<div>\n    <h2>Required Permissions</h2>\n    <p>\n      <b>The Required Permissions feature enables limiting user access to a card layout.<br/><br/></b>\n      To limit user access to a card layout, enter a comma-separated list of custom permissions. For example, Can_Edit_Card,Can_View_Card. <br/><br/> \n      For the user to view the layout, at least one of the custom permissions must be assigned to the user. If the user does not have any of the defined custom permissions, the layout displays an inactive template. <br/>\n    </p>\n</div>\n"),$templateCache.put("docs/lwcActions.tpl.html",'<div>\n    <h2>Smart Actions</h2>\n    <p>\n        The option is supported only when LWC is enabled at the layout level. Once its enabled, the drop down next to\n        the actions title lets us use standard actions or smart actions<br />\n\n        <h3 class="sticky">Standard Actions</h3>\n        <p>These are the actions that are predefined in the designer by selecting the sObject and contextId. They will\n            not\n            be change at runtime.</p>\n        <h3 class="sticky">Smart Actions</h3>\n        <p>These actions are driven by VIP(Vlocity Integration procedure). Once this option is selected, you will be\n            provided with options to configure a VIP.</p>\n\n        <p>The VIP will take the select sObject and contextId and pass it to VIP as default fields\n            <code>objectType</code>\n            and <code>contextId</code>. The VIP will process the inputs and returns a set of actions. These actions will\n            get generated at runtime and passed on to cards.</p>\n    </p>\n</div>'),$templateCache.put("docs/layoutResultJsonPath.tpl.html",'<div>\n    <h2 class="sticky">Result JSON Path</h2>\n    <p>\n        Result JSON path is used to drill down through json data from the endpoint and pass the specific dataset to cards. If the endpoint response looks like below:\n<pre><code>\n    "records" : {\n        results: [\n            {\n                "accountId": 00137000003Ogdk,\n                "name": "Burlington Textiles"\n            },\n            {\n                "accountId": 00136000083Ogdk,\n                "name": "GenePoint"\n            }\n        ]\n    }\n</code></pre>\n        <br>\n        <table class="docsTable">\n            <tr>\n                <td><b>Result JSON Path :</b></td>\n                <td>records.results</td>\n            </tr>\n        </table>\n        <br>\n        <code>records.results</code> drills down to <b>results</b> array and passes the array to cards. <br>\n    </p>\n</div>\n\n'),$templateCache.put("XmlInterfaceDesigner.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header" ng-show="title">\n        <button\n          type="button"\n          class="close"\n          aria-label="Close"\n          ng-click="$hide()"\n        >\n          <span aria-hidden="true">&times;</span>\n        </button>\n        <h4 class="modal-title" ng-bind="title"></h4>\n      </div>\n      <div class="modal-body">\n        <div class="form-group">\n          <div class="row">\n            <div class="col-md-6">\n              <label for="cardBundle"\n                >Master Label\n                <button\n                  type="button"\n                  bs-tooltip\n                  data-container=".container"\n                  title="{{ toolTip.masterLabel }}"\n                  class="btn btn-link"\n                >\n                  <span class="icon icon-v-information-line"></span>\n                </button>\n              </label>\n              <input\n                type="text"\n                class="form-control"\n                placeholder="Master Label"\n                ng-model="xmlObject.masterLabel"\n              />\n            </div>\n            <div class="col-md-6">\n              <label for="cardBundle"\n                >Description\n                <button\n                  type="button"\n                  bs-tooltip\n                  data-container=".container"\n                  title="{{ toolTip.description }}"\n                  class="btn btn-link"\n                >\n                  <span class="icon icon-v-information-line"></span>\n                </button>\n              </label>\n              <input\n                type="text"\n                class="form-control"\n                placeholder="Description"\n                ng-model="xmlObject.description"\n              />\n            </div>\n          </div>\n        </div>\n        <div class="form-group">\n          <div class="row">\n            <div class="col-md-6">\n              <label for="cardBundle"\n                >Api Version\n                <button\n                  type="button"\n                  bs-tooltip\n                  data-container=".container"\n                  title="{{ toolTip.apiVersion }}"\n                  class="btn btn-link"\n                >\n                  <span class="icon icon-v-information-line"></span>\n                </button>\n              </label>\n              <input\n                type="number"\n                class="form-control"\n                placeholder="{{ xmlObject.apiVersion }}"\n                ng-model="xmlObject.apiVersion"\n                required\n              />\n              <span style="color:maroon" role="alert">{{\n                errorMessageForApiVersion\n              }}</span>\n            </div>\n            <div class="col-md-6">\n              <label for="cardBundle"\n                >Runtime Namespace\n                <button\n                  type="button"\n                  bs-tooltip\n                  data-container=".container"\n                  title="{{ toolTip.runtimeNamespace }}"\n                  class="btn btn-link"\n                >\n                  <span class="icon icon-v-information-line"></span>\n                </button>\n              </label>\n              <input\n                type="text"\n                class="form-control"\n                placeholder="Runtime Namespace"\n                ng-model="xmlObject.runtimeNamespace"\n                readonly\n              />\n            </div>\n          </div>\n        </div>\n        <div class="form-group">\n          <div class="row">\n            <div class="col-md-6">\n              <input type="checkbox" class="" ng-model="xmlObject.isExposed" />\n              <label for="cardBundle"\n                >Is Exposed\n                <button\n                  type="button"\n                  bs-tooltip\n                  data-container=".container"\n                  title="{{ toolTip.isExposed }}"\n                  class="btn btn-link"\n                >\n                  <span class="icon icon-v-information-line"></span>\n                </button>\n              </label>\n            </div>\n          </div>\n        </div>\n        \x3c!-- Target starts --\x3e\n        <div class="form-group">\n          <table class="table">\n            <thead>\n              <tr>\n                <th></th>\n                <th>\n                  <label>\n                    Target Name\n                    <button\n                      type="button"\n                      bs-tooltip\n                      data-container=".container"\n                      title="{{ toolTip.target }}"\n                      class="btn btn-link"\n                    >\n                      <span class="icon icon-v-information-line"></span>\n                    </button>\n                  </label>\n                </th>\n                <th></th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr ng-repeat-start="item in targets">\n                <td>\n                  <input\n                    class="{{ item.target }}"\n                    type="checkbox"\n                    class=""\n                    ng-checked="item.isChecked"\n                    ng-model="item.isChecked"\n                    ng-change="selectTarget(item.target,item.isChecked)"\n                  />\n                </td>\n                <td>{{ item.name }}</td>\n                <td>\n                  <p ng-show="item.isChecked">\n                    <i\n                      ng-if="item.expanded"\n                      ng-click="item.expanded = false"\n                      class="icon icon-v-close"\n                    ></i>\n                    <i\n                      ng-if="!item.expanded"\n                      ng-click="item.expanded = true;getAllObjects(item.target);getProperties(item.target)"\n                      class="icon icon-v-edit"\n                    ></i>\n                  </p>\n                </td>\n              </tr>\n              <tr ng-if="item.expanded" ng-repeat-end="">\n                <td colspan="3">\n                  <table class="table">\n                    <tr>\n                      <td class="col-lg-12" colspan="3"><b>Add Properties</b>\n                      <button\n                        class="btn btn-default always-active pull-right"\n                        ng-click="addProprtyForTarget(item.target)"\n                        ng-disabled="addProperty"\n                      >\n                        +\n                      </button>\n                      </td>\n                    </tr>\n                    <tr ng-if="item.name == \'RecordPage\'">\n                      <td>Object</td>\n                      <td colspan="2">\n                        <input\n                          type="text"\n                          class="form-control object"\n                          ng-model="object"\n                          bs-options="tag for tag in tags"\n                          bs-typeahead\n                          bs-on-select="onSelect"\n                        />\n                      </td>\n                    </tr>\n                    \x3c!-- list of available properties here --\x3e\n                    <tr ng-repeat="savedProp in properties[item.target]">\n                      <td colspan="3">\n                        <input\n                          id="{{ savedProp.name }}"\n                          type="radio"\n                          ng-model="color"\n                          value="{{ savedProp.name }}"\n                          name="savedProp"\n                          ng-click="selectPropToEdit(savedProp.name,item.target)"\n                          ng-disabled="editPropertyFlag"\n                          required\n                        />\n                         {{ savedProp.name }}\n\n                        <span\n                        ng-if="editPropertyButtons && (propertyFlag == item.target)"\n                        class="pull-right"\n                      >\n                        <i\n                          ng-click="editProperty(item.target)"\n                          class="icon icon-v-edit"\n                        ></i>\n                        <i\n                          ng-click="deleteProperty(item.target,savedProp.name)"\n                          class="icon icon-v-close"\n                        ></i>\n                      </span>\n\n                      </td>\n                    </tr>\n                    \x3c!-- list of available objects here --\x3e\n                    <tr\n                      ng-if="item.name == \'RecordPage\' && selectedObjects.length"\n                    >\n                      <td colspan="3">\n                        <span\n                          ng-repeat="tag in selectedObjects"\n                          style="display:inline-block;border:1px solid rgba(0, 0, 0, 0.15);border-radius: 3px;padding: 4px;"\n                        >\n                          {{ tag }}\n                          <i\n                            class="icon icon-v-close"\n                            ng-click="removeObject($index)"\n                          ></i>\n                        </span>\n                      </td>\n                    </tr>\n                    \x3c!-- Block to add new properties --\x3e\n                    <tr ng-if="addProperty && (propertyFlag == item.target)">\n                      <table\n                        class="table"\n                        ng-show="addProperty && (propertyFlag == item.target)"\n                      >\n                        <tr>\n                          <td>Attributes</td>\n                          <td colspan="2">\n                            <select\n                              class="form-control"\n                              ng-model="property.selectedProp"\n                              ng-options="prop for prop in xmlPropertyTypes"\n                              ng-change="addProperties(property.selectedProp)"\n                            >\n                            </select>\n                          </td>\n                        </tr>\n                        <tr>\n                          <td colspan="3">Select Property Type (Required)</td>\n                        </tr>\n                        <tr>\n                          <td ng-repeat="propType in xmlPropertyType">\n                            {{ propType.label }}\n                            <input\n                              type="radio"\n                              name="xmlPropertType"\n                              value="{{ propType.value }}"\n                              ng-model="property.type"\n                              ng-required="!property.type"\n                            />\n                          </td>\n                        </tr>\n                        <tr>\n                          <td colspan="3">Attributes Added</td>\n                        </tr>\n                        <tr\n                          ng-repeat="prop in xmlProperties"\n                          ng-if="prop.display"\n                        >\n                          <td>{{ prop.name }}<span ng-if="prop.required" style="color:maroon" role="alert"> *</span></td>\n                          <td colspan="2">\n                            <input\n                              type="{{ prop.type }}"\n                              placeholder="value"\n                              required="{{ prop.required }}"\n                              ng-model="property[prop.name]"\n                            />\n                            <span class="pull-right">\n                              <button ng-disabled="prop.name == \'name\'" ng-click="deleteAttribute(prop.name)">\n                                  <i class="icon icon-v-close"></i>\n                              </button>\n                            </span>\n                          </td>\n                        </tr>\n                        <tfoot>\n                          <tr>\n                            <td colspan="2">\n                              <span style="color:maroon" role="alert">{{\n                                errorMessage\n                              }}</span>\n                            </td>\n                            <td>\n                              <button\n                                type="button"\n                                class="btn btn-default always-active"\n                                ng-click="saveProperty(property,item.target)"\n                              >\n                                Save\n                              </button>\n                              <button\n                                type="button"\n                                class="btn btn-default always-active"\n                                ng-click="closeProperty()"\n                              >\n                                close\n                              </button>\n                            </td>\n                          </tr>\n                        </tfoot>\n                      </table>\n                    </tr>\n                  </table>\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button\n          type="button"\n          class="btn btn-primary"\n          ng-disabled="isInvalid"\n          ng-click="save()"\n        >\n          {{ ::\'Save\' | localize: \'Save\' }}\n        </button>\n        <button type="button" class="btn btn-default" ng-click="$hide()">\n'+"          {{ ::'Cancel' | localize: 'Cancel' }}\n        </button>\n      </div>\n    </div>\n  </div>\n</div>"),$templateCache.put("CardConfirmationModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header" ng-show="title">\n        <button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" ng-bind="title"></h4>\n      </div>\n      <div class="modal-body"><span ng-bind="content"></span>\n      <p>\n        <i ng-if="!isLwc && !isOnlyInThisLayout">{{::\'CardDeleteInfoContent\' | localize:\'Note: This card is used in other layouts and should not be deleted.\'}}</i>\n        <i ng-if="isLwc && !isOnlyInThisLayout">{{lwcCardDeleteInfo}}</i>\n      </p></div>\n      <div class="modal-footer">\n        \x3c!-- <button type="button" class="btn btn-danger" ng-show="objType == \'card\' && cardHasId && !lockedCard" ng-disabled="!isOnlyInThisLayout" ng-click="ok(true);$hide()">{{ ::\'DesignerConfirmDelete\' | localize: \'Remove and Delete\' }}</button> --\x3e\n        <button type="button" class="btn btn-danger" ng-disabled="isLwc && !isOnlyInThisLayout" ng-show="objType == \'card\' && cardHasId && !lockedCard && !isCardActive" ng-click="ok(true);$hide()">{{ ::\'DesignerConfirmDelete\' | localize: \'Remove and Delete\' }}</button>\n        <button type="button" class="btn btn-primary" ng-click="ok(false);$hide()">{{ ::\'Remove\' | localize: \'Remove\' }}</button>\n        <button type="button" class="btn btn-default" ng-click="$hide()">{{ ::\'Cancel\' | localize: \'Cancel\' }}</button>\n      </div>\n    </div>\n  </div>\n</div>'),$templateCache.put("deleteTargetModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header" ng-show="title">\n        <button type="button" class="close" aria-label="Close" ng-click="cancel();$hide()"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" ng-bind="title"></h4>\n      </div>\n      <div class="modal-body"><span ng-bind="content"></span>\n      <p>\n        <i>{{::\'DeleteTarget\' | localize : \'Are you sure, you want to delete target? All properties will be lost\' }}</i>\n      </p></div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-primary" ng-click="deleteTarget();$hide()">{{ ::\'Remove\' | localize: \'Remove\' }}</button>\n        <button type="button" class="btn btn-default" ng-click="cancel();$hide()">{{ ::\'Cancel\' | localize: \'Cancel\' }}</button>\n      </div>\n    </div>\n  </div>\n</div>'),$templateCache.put("ZoneTemplate.tpl.html",'<h3 ng-init="zoneCollapse = true">\n  <i class="icon icon-v-right-arrow"\n        ng-show="zoneCollapse"\n        ng-click="zoneCollapse = !zoneCollapse;"></i>\n  <i class="icon icon-v-down-arrow"\n        ng-show="!zoneCollapse"\n        ng-click="zoneCollapse = !zoneCollapse;"></i>\n    <span>\n        {{zone.name}}&nbsp;\n    </span>\n</h3>\n<form ng-show="!zoneCollapse">\n\t<div class="row">\n    <div class="form-group col-lg-12">\n      <label for="name">Label</label>\n      <input type="text" class="form-control" id="name" ng-model="zone.label" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout"/>\n    </div>\n  </div>\n  <div class="row">\n\t  <div class="form-group col-lg-12">\n\t\t<label for="name">{{ ::\'DesignerSelectedCards\' | localize:\'Selected Cards\' }}</label>\n\t\t<ul class="zone-cards">\n\t\t\t<li class="row" ng-repeat="zoneCard in zone.zoneCards track by $index">\n\t\t\t\t\t<span class="col-lg-9 overFlowText">\n\t\t\t\t\t\t<label>{{zoneCard.Name}} ({{zoneCard.Author}}, {{zoneCard.Version}})</label>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class="col-lg-3">\n\t\t\t\t\t\t<button type="button"  class="btn btn-link pull-right"\n\t\t\t\t\t\t\ttitle="{{ ::\'deletecardIconLabel\' | localize:\'Remove/Delete Card\' }}"\n\t\t\t\t\t\t\tdata-container=".container"\n\t\t\t\t\t\t\tng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout"\n\t\t\t\t\t\t\tng-click="removeFromZone(zone, zoneCard)">\n\t\t\t\t\t\t\t<span class="icon icon-v-trash"></span>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</span>\n\n\t\t\t</li>\n\t\t</ul>\n\t  </div>\n  </div>\n\n  <div class="row">\n    <div class="form-group col-lg-12">\n\t\t<div class="row">\n            <div class="col-lg-12">\n                <button class="btn btn-primary pull-right" ng-click="openAddCardModal(zone)" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || !$root.layout.Name  || $root.lockedLayout">{{ ::\'CardDesAddCard\' | localize:\'+ Add Card\'}}</button>\n            </div>\n\t\t</div>\n\t</div>\n\t<div class="form-group col-lg-12">\n\t\t<div class="row">\n\t\t\t<div class="form-group col-lg-12">\n\t\t\t\t\t{{ ::\'Layouts\' | localize:\'Layouts\' }}\n\t\t\t</div>\n\t\t</div>\n\t\t\t<div class="row" ng-if="zone.layouts && zone.layouts.length > 0">\n\t\t\t\t<div class="form-group col-lg-12">\n\t\t\t\t\t<ul class="drop-zone" dnd-list="zone.layouts" dnd-allowed-types="[\'zonelayout\']"\n\t\t\t\t\t dnd-disable-if="$parent.$parent.$root.layout[nsPrefix + \'Active__c\']  || $root.lockedLayout"\n\t\t\t\t\t dnd-drop="dropZoneLayoutCallback(event, index, item, external, type, allowedType, zone.layouts)">\n\t\t\t\t\t\t\x3c!-- WARNING: don\'t use track by $index here or it breaks the dnd --\x3e\n\t\t\t\t\t\t<li class="card-wrapper" id="zonelayout-{{$index}}" draggable="{{zonelayouts.drag}}" ng-repeat="zonelayout in zone.layouts"\n\t\t\t\t\t\tdnd-draggable="zonelayout"\n\t\t\t\t\t\tdnd-effect-allowed="move"\n\t\t\t\t\t\tdnd-type="\'zonelayout\'"\n\t\t\t\t\t\tdata-test="{{zonelayout.drag}}"\n\t\t\t\t\t\tng-init="setDraggable($index,zonelayout, this)">\n\t\t\t\t\t\t\t<h3 ng-init="zonelayoutcollapse = true; zonelayouts.drag = true;">\n\t\t\t\t\t\t\t\t<i class="icon icon-v-right-arrow" ng-show="zonelayoutcollapse" ng-click="zonelayoutcollapse = !zonelayoutcollapse; zonelayouts.drag = false;"></i>\n\t\t\t\t\t\t\t\t<i class="icon icon-v-down-arrow" ng-show="!zonelayoutcollapse" ng-click="zonelayoutcollapse = !zonelayoutcollapse; zonelayouts.drag = true;"></i>\n\t\t\t\t\t\t\t\t<span class="nested-title"> {{zonelayout.name}}&nbsp; </span>\n\t\t\t\t\t\t\t\t<i class="icon icon-v-grip pull-right" ng-drag-handle="ng-drag-handle"></i>\n\t\t\t\t\t\t\t\t<button type="button" class="btn btn-link pull-right" title="{{ ::\'deletelayoutIconLabel\' | localize:\'Remove/Delete Layout\' }}"\n\t\t\t\t\t\t\t\t bs-tooltip data-container=".container" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout" ng-click="deleteLayout(zone.layouts,$index)">\n\t    \t\t\t\t\t\t<span class="icon icon-v-trash"></span>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t\t<div class="form-group" ng-show="!zonelayoutcollapse">\n\t\t\t\t\t\t\t\t<div class="row">\n\t\t\t\t\t\t\t\t\t<div class="form-group col-lg-12">\n\t\t\t\t\t\t\t\t\t\t<label>{{ ::\'Controller\' | localize:\'Controller\' }}</label>\n\t\t\t\t\t\t\t\t\t\t<input type="text" class="form-control" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout" placeholder="controller" ng-model="zonelayout.ctrl" />\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="form-group col-lg-12">\n\t\t\t\t\t\t\t\t\t\t<label>{{ ::\'Records\' | localize:\'Records\' }}</label>\n\t\t\t\t\t\t\t\t\t\t<input type="text" class="form-control" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout" placeholder="records" ng-model="zonelayout.records" />\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="form-group col-lg-12">\n\t\t\t\t\t\t\t\t\t\t<label>{{ ::\'Parent\' | localize:\'Parent\' }}</label>\n\t\t\t\t\t\t\t\t\t\t<input type="text" class="form-control" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout" placeholder="parent" ng-model="zonelayout.parent" />\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class="row">\n\t\t\t\t<div class="col-lg-7">\n\t\t\t\t \t<input type="text" class="form-control" ng-model="selectedLayout.name" bs-options="layout.Name as layout.Name for layout in $root.layouts | filter:{ [nsPrefix + \'Active__c\'] :true} | filterAndSort:zone.layouts:\'name\'" bs-typeahead="bs-typeahead"  data-watch-options="true" autocomplete="off" />\n\t\t\t\t</div>\n\t\t\t\t<div class="col-lg-3">\n\t\t\t\t\t<button class="btn btn-link" ng-click="addLayout(zone.layouts, selectedLayout.name)" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || $root.lockedLayout || (selectedLayout && !selectedLayout.name)">\n'+"\t\t\t\t\t\t\t{{ ::'DesignerAddLayout' | localize:'+ Add Layout' }}\n\t\t\t\t</button>\n\t\t\t\t</div>\n\n\t\t</div>\n\n\t</div>\n  </div>\n</form>"),$templateCache.put("DataSource.tpl.html",'<span class="data-source" ng-init="initDatasource()">\n  <div class="row">\n    <div class="form-group col-lg-12">\n      <h4 ng-click="collapse = !collapse">\n        <i class="icon icon-v-right-arrow" ng-show="collapse"></i>\n        <i class="icon icon-v-down-arrow" ng-show="!collapse"></i>\n        Data Source\n        <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event, \'dataSource\')">\n          <i class="icon icon-v-information-line"></i>\n        </a>\n      </h4>\n      <select class="form-control" id="{{objName}}-datasource-type" ng-show="!collapse"\n        ng-options="srcType.name as srcType.value for srcType in dataSourceTypes | orderBy: \'-value\' : true"\n        ng-model="datasource.type" ng-disabled="disabled" ng-change="initDatasource()">\n        <option value="" ng-if="false"></option>\n      </select>\n    </div>\n  </div>\n  <div class="label label-warning" ng-show="dsDisabled" style="display: block">\n    <i class="icon icon-v-information-line"></i>Datasource has been disabled.\n  </div>\n\n  <div class="row" ng-show="!collapse">\n    \x3c!-- NONE / LAYOUT --\x3e\n    <div class="form-group col-lg-12" ng-if="datasource.type === null && type !== \'layout\'">\n      <div>\n        <label for="cardBundle">Result Parent JSON Path</label>\n      </div>\n      <div class="row col-md-8 no-margin-padding">\n        <input type="text" class="form-control" ng-model="datasource.value.resultVar"\n          bs-options="field.name as field.name for field in $root.fieldsFromLayout" bs-typeahead="bs-typeahead"\n          ng-change="" data-watch-options="true" ng-disabled="disabled || dsDisabled" />\n      </div>\n      <div class="row col-md-4 no-margin-padding">\n        <button type="button" class="btn btn-primary pull-right" ng-disabled="!$root.layoutDSResult"\n          ng-click="testDataSource(false)">View Data</button>\n      </div>\n    </div>\n    \x3c!-- QUERY --\x3e\n    <div class="form-group col-lg-12" ng-if="datasource.type === \'Query\'">\n      <label for="name">SOQL Query</label>\n      \x3c!-- <textarea class="form-control" ng-model="datasource.value.query" ng-show="true" ng-disabled="disabled || dsDisabled" rows="5"\n      /> --\x3e\n      <textarea class="form-control" id="{{objName}}-query-text-area" ng-model="encryptedDatasource.value.query"\n        ng-show="true" ng-disabled="disabled || dsDisabled" rows="5" ng-change="encryptDatasource()"\n        ng-model-options="{ updateOn: \'blur\'}" />\n\n      <div class="row">\n        <div class="form-group col-lg-6">\n          <label for="cardBundle">Result JSON Path\n            <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event,\'layoutResultJsonPath\')">\n              <i class="icon icon-v-information-line"></i>\n            </a>\n          </label>\n          <input type="text" id ="{{objName}}-soql-json" class="form-control" bs-options="field.name as field.name for field in fieldsFromDatasource" bs-typeahead="bs-typeahead"\n            data-watch-options="true" ng-model="datasource.value.resultVar" ng-disabled="disabled || dsDisabled" />\n        </div>\n      </div>\n    </div>\n    \x3c!-- Streaming API  --\x3e\n    <div class="form-group col-lg-12" ng-if="datasource.type === \'StreamingAPI\'">\n      <div class="row">\n        <div class="form-group col-lg-12">\n          <label for="searchForId">Type</label>\n          <select id="{{objName}}-streaming-api-type" class="form-control" ng-init="datasource.value.type = datasource.value.type ? datasource.value.type :\'pushTopic\';"\n            ng-model="datasource.value.type" ng-disabled="disabled" ng-change="onChangeStreamingType()">\n            <option value="pushTopic"> Push Topic </option>\n            <option value="streamingChannel"> Streaming Channel </option>\n            <option value="platFormEvent"> Platform Event </option>\n          </select>\n        </div>\n        <div class="form-group col-lg-12">\n          <label for="searchForId">Channel</label>\n          <input id="{{objName}}-streaming-api-channel" type="text" class="form-control" ng-model="datasource.value.channel" bs-options="channel.Name as channel.Name for channel in $root.channels[datasource.value.type]"\n            bs-typeahead="bs-typeahead" ng-change="onChangeChannel()" data-watch-options="true" ng-disabled="disabled || dsDisabled" />\n        </div>\n        <div class="form-group col-lg-6">\n          <label for="searchForId">Operation</label>\n          <select id="{{objName}}-streaming-api-operation" class="form-control" ng-init="datasource.value.isReplace = datasource.value.isReplace ? datasource.value.isReplace :\'true\';"\n            ng-model="datasource.value.isReplace" ng-disabled="disabled">\n            <option value="true"> Replace </option>\n            <option value="false"> Append </option>\n          </select>\n        </div>\n        <div class="form-group col-lg-6">\n          <label for="searchForId">Get All Message</label>\n          <select id="{{objName}}-streaming-api-message" class="form-control" ng-init="datasource.value.replayAll = datasource.value.replayAll ? datasource.value.replayAll :\'true\';"\n            ng-model="datasource.value.replayAll" ng-disabled="disabled">\n            <option value="true"> True </option>\n            <option value="false"> False </option>\n          </select>\n        </div>\n        <div class="form-group col-lg-6">\n          <label for="cardBundle">Result JSON Path\n            <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event,\'layoutResultJsonPath\')">\n              <i class="icon icon-v-information-line"></i>\n            </a>\n          </label>\n          <input id="{{objName}}-streaming-api-json" type="text" class="form-control" bs-options="field.name as field.name for field in fieldsFromDatasource" bs-typeahead="bs-typeahead"\n            data-watch-options="true" ng-model="datasource.value.resultVar" ng-disabled="disabled || dsDisabled" />\n        </div>\n      </div>\n    </div>\n    \x3c!-- SEARCH --\x3e\n    <div class="form-group col-lg-12" ng-if="datasource.type === \'Search\'">\n      <div class="row">\n        <div class="form-group col-lg-12">\n          <label for="searchForId">Search For</label>\n          <input type="text" class="form-control" id="{{objName}}-searchForId" ng-model="encryptedDatasource.value.search" ng-disabled="disabled || dsDisabled"\n          />\n        </div>\n        <div class="form-group col-lg-12">\n          <label for="searchForId">In</label>\n          <select id="{{objName}}-select-field" ng-init="encryptedDatasource.value.fields = encryptedDatasource.value.fields ? encryptedDatasource.value.fields  : searchFields[0].value;" class="form-control" ng-options="sFields.value as sFields.name for sFields in searchFields"\n            ng-model="encryptedDatasource.value.fields" ng-disabled="disabled">\n            <option value="" ng-if="false"></option>\n          </select>\n        </div>\n        <div class="form-group col-lg-12 filter">\n          <label for="searchForId">Returning sObject & Fields</label>\n          <div class="row" ng-repeat="(key, value) in encryptedDatasource.value.objectMap">\n            <div class="form-group col-lg-5">\n              <input id="{{objName}}-sobject-{{$index}}" type="text" class="form-control" ng-model="key" ng-disabled="true" />\n            </div>\n            <div class="form-group col-lg-5">\n              <input id="{{objName}}-sobject-value-{{$index}}" class="form-control" type="text" ng-model="encryptedDatasource.value.objectMap[key]" ng-disabled="disabled || dsDisabled" />\n            </div>\n            <div class="form-group col-lg-2 no-padding">\n              <a id="{{objName}}-sobject-delete-{{$index}}" class="btn btn-link pull-left" ng-href="#">\n                <i class="icon icon-v-trash" ng-click="removeObjMap(key)"></i>\n              </a>\n            </div>\n          </div>\n          <div class="row">\n            <div class="col-lg-7">\n              <select id="{{objName}}-select-sobject" class="form-control" ng-options="sobject.name as sobject.name for sobject in $root.sobjectTypes" ng-model="sObjectType"\n                ng-disabled="disabled || dsDisabled">\n                <option value=""></option>\n              </select>\n            </div>\n            <div class="col-lg-5 no-padding">\n              <button type="button" class="btn btn-link" ng-click="addObjMap(sObjectType)" ng-disabled="disabled || dsDisabled">\n                + Add sObject\n              </button>\n            </div>\n          </div>\n        </div>\n\n        <div class="form-group col-lg-6">\n          <label for="cardBundle">Limit to </label>\n          <input type="number" id="{{objName}}-limit-to" class="form-control" ng-model="encryptedDatasource.value.limitTo" ng-disabled="disabled || dsDisabled" />\n        </div>\n        <div class="form-group col-lg-12">\n          <label for="cardBundle">Result JSON Path\n            <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event,\'layoutResultJsonPath\')">\n              <i class="icon icon-v-information-line"></i>\n            </a>\n          </label>\n          <input id="{{objName}}-sosl-result-json" type="text" class="form-control" bs-options="field.name as field.name for field in fieldsFromDatasource" bs-typeahead="bs-typeahead"\n            data-watch-options="true" ng-model="datasource.value.resultVar" ng-disabled="disabled || dsDisabled" />\n        </div>\n      </div>\n    </div>\n    \x3c!-- DATA RAPTOR --\x3e\n    <div class="form-group col-lg-12" ng-if="datasource.type === \'DataRaptor\'">\n      <div class="row">\n        <div class="form-group col-lg-12">\n          <label for="cardBundle">Interface Name</label>\n          <div class="input-group">\n            <input id="{{objName}}-interface-name" type="text" class="form-control" ng-disabled="disabled || dsDisabled" ng-model="datasource.value.bundle" bs-options="drBundle.Name as drBundle.Name for drBundle in $root.drBundles"\n              bs-typeahead="bs-typeahead" autocomplete="off">\n            <span class="input-group-btn">\n              <a class="btn btn-link pull-right" bs-tooltip data-container=".container" ng-click="openUrl(\'/apex/\'+ $root.nsPrefix + \'drmapper?id=\' + getBundleByName(datasource.value.bundle, $root.drBundles), $event, true)"\n                title="Edit Dataraptor">\n                <i class="icon icon-v-link"></i>\n              </a>\n            </span>\n          </div>\n        </div>\n        <div class="form-group col-lg-12 filter" id="{{objName}}-dataraptor-input">\n          <label for="name">Input Map</label>\n          <div class="row" ng-repeat="property in propertySet(datasource.value.inputMap, \'inputMap\') track by property.key">\n            <div class="form-group col-lg-5">\n              <input id="{{objName}}-dataraptor-input-map-{{$index}}" type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.key" ng-change="property.update(\'inputMap\')" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-5 nopadding">\n              <input id="{{objName}}-dataraptor-input-map-val-{{$index}}" class="form-control" type="text" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.value" ng-change="property.update(\'inputMap\')" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-2">\n              <a id="{{objName}}-dataraptor-input-map-delete-{{$index}}" class="btn btn-link pull-left" ng-href="#">\n                <i class="icon icon-v-trash" ng-click="removeMapProperty(datasource.value.inputMap,property.key)"></i>\n              </a>\n            </div>\n          </div>\n          <div class="row">\n            <div class="col-lg-12">\n              <button id="{{objName}}-dataraptor-input-map-add-btn" type="button" class="btn btn-link" ng-click="addMapProperty(datasource.value.inputMap, \'inputMap\')" ng-disabled="disabled || datasource.value.inputMap[\'\'] == \'\' || dsDisabled">\n                + Add Input Map Variable\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class="row">\n        <div class="form-group col-lg-6">\n          <label for="cardBundle">Result JSON Path\n            <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event,\'layoutResultJsonPath\')">\n              <i class="icon icon-v-information-line"></i>\n            </a>\n          </label>\n          <input id="{{objName}}-dataraptor-json" type="text" class="form-control" ng-model="datasource.value.resultVar" bs-options="field.name as field.name for field in fieldsFromDatasource"\n            bs-typeahead="bs-typeahead" data-watch-options="true" ng-disabled="disabled || dsDisabled" />\n        </div>\n      </div>\n    </div>\n    \x3c!-- DUAL --\x3e\n    <div class="form-group col-lg-12" ng-if="datasource.type === \'Dual\'">\n      <div class="row">\n        <div class="col-lg-12">\n          <span>----------Desktop ApexRemote Config----------</span>\n        </div>\n        <div class="form-group col-lg-12" id="{{objName}}-dual-remote-class" ng-class="{\'has-error\' : classError }">\n          <label for="cardBundle">Remote Class</label>\n          \x3c!-- <input type="text" class="form-control" id="cardCtxId" ng-model="datasource.value.remoteClass" ng-disabled="disabled"/> --\x3e\n          <input type="text" class="form-control" ng-model="apexClass" ng-init="apexClass = datasource.value.remoteClass? datasource.value.remoteClass: \'\'"\n            bs-options="class as class.Name for class in $root.allApexClasses" bs-typeahead="bs-typeahead" ng-change="checkClassType(apexClass)"\n            data-watch-options="true" ng-disabled="disabled || dsDisabled" />\n          <small id="{{objName}}-classHelpBlock" ng-show="classError" class="help-block">{{classError.message}}</small>\n\n        </div>\n        <div class="form-group col-lg-12" id="{{objName}}-dual-remote-method" ng-class="{\'has-error\' : methodError }">\n          <label for="cardBundle">Remote Method</label>\n          <input type="text" class="form-control" id="{{objName}}-cardCtxId" ng-model="datasource.value.remoteMethod" ng-disabled="disabled || dsDisabled"\n          />\n          <small id="{{objName}}-methodHelpBlock" ng-show="methodError" class="help-block">{{methodError.message}}</small>\n        </div>\n        <div class="form-group col-lg-12 filter" id="{{objName}}-dual-input-map">\n          <label for="name">Input Map</label>\n          <div class="row" ng-repeat="property in propertySet(datasource.value.inputMap, \'inputMap\') track by property.key">\n            <div class="form-group col-lg-5">\n              <input id="{{objName}}-dual-input-map-{{$index}}" type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.key" ng-change="property.update(\'inputMap\')" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-5 nopadding">\n              <input id="{{objName}}-dual-input-map-val-{{$index}}" class="form-control" type="text" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.value" ng-change="property.update(\'inputMap\')" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-2">\n              <a id="{{objName}}-dual-input-map-delete-{{$index}}" class="btn btn-link pull-left" ng-href="#">\n                <i class="icon icon-v-trash" ng-click="removeMapProperty(datasource.value.inputMap,property.key)"></i>\n              </a>\n            </div>\n          </div>\n          <div class="row">\n            <div class="col-lg-12">\n              <button id="{{objName}}-dual-input-map-add-btn" type="button" class="btn btn-link" ng-click="addMapProperty(datasource.value.inputMap, \'inputMap\')" ng-disabled="disabled || datasource.value.inputMap[\'\'] == \'\' || dsDisabled">\n                + Add Input Map Variable\n              </button>\n            </div>\n          </div>\n        </div>\n        <div class="form-group col-lg-12 filter" id="{{objName}}-dual-option-map">\n          <label for="name">Options Map</label>\n          <div class="row" ng-repeat="property in propertySet(datasource.value.optionsMap, \'optionsMap\') track by property.key">\n            <div class="form-group col-lg-5">\n              <input id="{{objName}}-dual-option-map-{{$index}}" type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.key" ng-change="property.update(\'optionsMap\')" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-5 nopadding">\n              <input id="{{objName}}-dual-option-map-val-{{$index}}" class="form-control" type="text" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.value" ng-change="property.update(\'optionsMap\')" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-2">\n              <a id="{{objName}}-dual-option-map-delete-{{$index}}" class="btn btn-link pull-left" ng-href="#">\n                <i class="icon icon-v-trash" ng-click="removeMapProperty(datasource.value.optionsMap,property.key)"></i>\n              </a>\n            </div>\n          </div>\n          <div class="row">\n            <div class="col-lg-12">\n              <button id="{{objName}}-dual-option-map-add-btn" type="button" class="btn btn-link" ng-click="addMapProperty(datasource.value.optionsMap, \'optionsMap\')" ng-disabled="disabled || datasource.value.optionsMap[\'\'] == \'\' || dsDisabled">\n                + Add Option Map Variable\n              </button>\n            </div>\n          </div>\n        </div>\n        <div class="form-group col-lg-6">\n          <label for="cardBundle">Result JSON Path\n            <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event,\'layoutResultJsonPath\')">\n              <i class="icon icon-v-information-line"></i>\n            </a>\n          </label>\n          <input id="{{objName}}-dual-json" type="text" class="form-control" ng-model="datasource.value.apexRemoteResultVar" ng-disabled="disabled || dsDisabled"\n          />\n        </div>\n        <div class="form-group col-lg-12">\n          <div class="row">\n            <div class="col-lg-12">\n              <span>----------Mobile Hybrid ApexRest Config----------</span>\n            </div>\n            <div class="form-group col-lg-12">\n              <label for="cardBundle">Endpoint</label>\n              <textarea id="{{objName}}-dual-endpoint" class="form-control" ng-model="datasource.value.endpoint" ng-disabled="disabled || dsDisabled" />\n            </div>\n            <div class="form-group col-lg-6">\n              <label for="cardBundle">Method</label>\n              <select id="{{objName}}-dual-method" class="form-control" ng-options="srcType.name as srcType.value for srcType in HTTPMethods" ng-model="datasource.value.methodType"\n                ng-init="datasource.value.methodType" ng-disabled="disabled || dsDisabled" />\n            </div>\n            <div class="form-group col-lg-6">\n              <label for="cardBundle">Result JSON Path\n                <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event,\'layoutResultJsonPath\')">\n                  <i class="icon icon-v-information-line"></i>\n                </a>\n              </label>\n              <input  id="{{objName}}-dual-hybrid-json" type="text" class="form-control" ng-model="datasource.value.apexRestResultVar" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-12" ng-show="datasource.value.methodType === \'POST\'">\n              <label for="cardBundle">Body</label>\n              <textarea class="form-control" ng-model="datasource.value.body" ng-disabled="disabled || dsDisabled" rows="5" />\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    \x3c!-- APEX REMOTE --\x3e\n    <div class="form-group col-lg-12" ng-if="datasource.type === \'ApexRemote\'">\n      <div class="row">\n        <div class="form-group col-lg-12" id="{{objName}}-apex-remote-class" ng-class="{\'has-error\' : classError }">\n          <label for="cardBundle">Remote Class</label>\n          \x3c!-- <input type="text" class="form-control" id="cardCtxId" ng-model="datasource.value.remoteClass" ng-disabled="disabled"/> --\x3e\n          <input type="text" class="form-control" ng-model="apexClass" ng-init="apexClass = datasource.value.remoteClass? datasource.value.remoteClass: \'\'"\n            bs-options="class as class.Name for class in $root.allApexClasses" bs-typeahead="bs-typeahead" ng-change="checkClassType(apexClass)"\n            data-watch-options="true" ng-disabled="disabled || dsDisabled" />\n          <small id="{{objName}}-classHelpBlock" ng-show="classError" class="help-block">{{classError.message}}</small>\n\n        </div>\n        <div class="form-group col-lg-12" id="{{objName}}-apex-remote-method" ng-class="{\'has-error\' : methodError }">\n          <label for="cardBundle">Remote Method</label>\n          <input type="text" class="form-control" id="{{objName}}-cardCtxId" ng-model="datasource.value.remoteMethod" ng-disabled="disabled || dsDisabled"\n          />\n          <small id="{{objName}}-methodHelpBlock" ng-show="methodError" class="help-block">{{methodError.message}}</small>\n        </div>\n        <div class="form-group col-lg-12 filter" id="{{objName}}-apex-remote-input">\n          <label for="name">Input Map</label>\n          <div class="row" ng-repeat="property in propertySet(datasource.value.inputMap, \'inputMap\') track by property.key">\n            <div class="form-group col-lg-5">\n              <input id="{{objName}}-apex-remote-input-map-{{$index}}" type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.key" ng-change="property.update(\'inputMap\')" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-5 nopadding">\n              <input id="{{objName}}-apex-remote-input-map-val-{{$index}}" class="form-control" type="text" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.value" ng-change="property.update(\'inputMap\')" ng-disabled="disabled"\n              />\n            </div>\n            <div class="form-group col-lg-2">\n              <a id="{{objName}}-apex-remote-input-map-delete-{{$index}}" class="btn btn-link pull-left" ng-href="#">\n                <i class="icon icon-v-trash" ng-click="removeMapProperty(datasource.value.inputMap,property.key)"></i>\n              </a>\n            </div>\n          </div>\n          <div class="row">\n            <div class="col-lg-12">\n              <button id="{{objName}}-apex-remote-input-map-add-btn" type="button" class="btn btn-link" ng-click="addMapProperty(datasource.value.inputMap, \'inputMap\')" ng-disabled="disabled || datasource.value.inputMap[\'\'] == \'\' || dsDisabled">\n                + Add Input Map Variable\n              </button>\n            </div>\n          </div>\n        </div>\n\n        <div class="form-group col-lg-12 filter" id="{{objName}}-apex-remote-option">\n          <label for="name">Options Map</label>\n          <div class="row" ng-repeat="property in propertySet(datasource.value.optionsMap, \'optionsMap\') track by property.key">\n            <div class="form-group col-lg-5">\n              <input id="{{objName}}-apex-remote-option-map-{{$index}}" type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.key" ng-change="property.update(\'optionsMap\')" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-5 nopadding">\n              <input id="{{objName}}-apex-remote-option-map-val-{{$index}}" class="form-control" type="text" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.value" ng-change="property.update(\'optionsMap\')" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-2">\n              <a id="{{objName}}-apex-remote-option-map-delete-{{$index}}" class="btn btn-link pull-left" ng-href="#">\n                <i class="icon icon-v-trash" ng-click="removeMapProperty(datasource.value.optionsMap,property.key)"></i>\n              </a>\n            </div>\n          </div>\n          <div class="row">\n            <div class="col-lg-12">\n              <button id="{{objName}}-apex-remote-option-map-add-btn" type="button" class="btn btn-link" ng-click="addMapProperty(datasource.value.optionsMap, \'optionsMap\')" ng-disabled="disabled || datasource.value.optionsMap[\'\'] == \'\' || dsDisabled">\n                + Add Option Map Variable\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class="row">\n        <div class="form-group col-lg-6">\n           <label for="cardBundle">Result JSON Path\n             <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event,\'layoutResultJsonPath\')">\n               <i class="icon icon-v-information-line"></i>\n             </a>\n           </label>\n           <input id="{{objName}}-apex-remote-json" type="text" class="form-control" ng-model="datasource.value.resultVar"  bs-options="field.name as field.name for field in fieldsFromDatasource" bs-typeahead="bs-typeahead" data-watch-options="true" ng-disabled="disabled || dsDisabled"/>\n        </div>\n      </div>\n     \n    <div class="row">\n     <div class="form-group col-lg-6">\n       <label for="cardBundle">Asynchronous <a href="javascript:void(0);"><i class="icon icon-v-information-line" data-container=".container" data-type="info" bs-tooltip data-title="{{ ::\'ApexRemoteAsyncCallInfo\' | localize: \'Calls the apex class asynchronously using the long polling method. Useful for larger transactions.\' }}"></i></a>\n       </label>\n       <div class="toggle-switch">\n         <div class="switch">\n           <input id="cmn-toggle-2" class="cmn-toggle cmn-toggle-round" type="checkbox" ng-disabled="disabled || dsDisabled" ng-model="datasource.value.vlocityAsync">\n           <label for="cmn-toggle-2"></label>\n         </div>\n       </div>\n     </div>\n\n     <div class="form-group col-lg-6">\n       <label for="cardBundle">{{ ::\'AsyncPollLabel\' | localize:\'Poll Interval\' }} <a href="javascript:void(0);"><i class="icon icon-v-information-line" data-container=".container" data-type="info" bs-tooltip data-title="{{ ::\'AsyncPollInvervalInfo\' | localize: \'Defines the polling interval in ms to check the result status. Default: 1000 if empty.\' }}"></i></a>\n       </label>\n       <input id="{{objName}}-apex-rempte-timeout" type="number" class="form-control" ng-model="datasource.value.vlocityAsyncTimeout" ng-disabled="disabled || dsDisabled || !datasource.value.vlocityAsync"/>\n     </div>\n    </div>\n\n    </div>\n    \x3c!-- APEXREST --\x3e\n    <div class="form-group col-lg-12" ng-if="datasource.type === \'ApexRest\'">\n      <div class="row">\n        <div class="form-group col-lg-12">\n          <label for="cardBundle">Endpoint</label>\n          <textarea id="{{objName}}-apex-rest-endpoint" class="form-control" ng-model="datasource.value.endpoint" ng-disabled="disabled || dsDisabled" />\n        </div>\n        <div class="form-group col-lg-6">\n          <label for="cardBundle">Method</label>\n          <select id="{{objName}}-apex-rest-method" class="form-control" ng-options="srcType.name as srcType.value for srcType in HTTPMethods" ng-model="datasource.value.methodType"\n            ng-init="datasource.value.methodType" ng-disabled="disabled || dsDisabled" />\n        </div>\n        <div class="form-group col-lg-6">\n          <label for="cardBundle">Result JSON Path\n            <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event,\'layoutResultJsonPath\')">\n              <i class="icon icon-v-information-line"></i>\n            </a>\n          </label>\n          <input id="{{objName}}-apex-rest-json" type="text" class="form-control" ng-model="datasource.value.resultVar" bs-options="field.name as field.name for field in fieldsFromDatasource"\n            bs-typeahead="bs-typeahead" data-watch-options="true" ng-disabled="disabled || dsDisabled" />\n        </div>\n        <div class="form-group col-lg-12" ng-show="datasource.value.methodType === \'POST\'">\n          <label for="cardBundle">Body</label>\n          <textarea class="form-control" ng-model="datasource.value.body" ng-disabled="disabled || dsDisabled" rows="5" />\n        </div>\n      </div>\n    </div>\n    \x3c!-- REST --\x3e\n    <div class="form-group col-lg-12" ng-if="datasource.type === \'REST\'">\n      <div class="row">\n        <div class="form-group col-lg-12">\n          <label for="cardBundle">Subtype</label>\n          <select id="{{objName}}-rest-subtype" class="form-control" ng-options="subType.value as subType.name for subType in RESTSubtypes" ng-model="datasource.value.subType"\n            ng-init="datasource.value.subType" ng-disabled="disabled || dsDisabled" />\n        </div>\n      </div>\n      <div class="row" ng-show="datasource.value.subType === \'NamedCredential\'">\n        <div class="form-group col-lg-12">\n          <label for="cardBundle">Named Credentials</label>\n          <select id="{{objName}}-rest-named-credential" class="form-control" ng-options="cred.value as cred.name for cred in $root.namedCredentials" ng-model="datasource.value.namedCredential"\n            ng-init="datasource.value.namedCredential" ng-disabled="disabled || dsDisabled" />\n        </div>\n      </div>\n      <div class="row">\n        <div class="form-group col-lg-12">\n          <label for="cardBundle" ng-if="!datasource.value.subType || datasource.value.subType === \'Web\'">Endpoint</label>\n          <label for="cardBundle" ng-if="datasource.value.subType === \'NamedCredential\'">Path</label>\n          <textarea id="{{objName}}-rest-endpoint" class="form-control" ng-model="datasource.value.endpoint" ng-disabled="disabled" />\n        </div>\n        <div class="form-group col-lg-6">\n          <label for="cardBundle">Method</label>\n          <select id="{{objName}}-rest-method" class="form-control" ng-options="srcType.name as srcType.value for srcType in HTTPMethods" ng-model="datasource.value.methodType"\n            ng-init="datasource.value.methodType" ng-disabled="disabled || dsDisabled" />\n        </div>\n        <div class="form-group col-lg-6">\n          <label for="cardBundle">Result JSON Path\n            <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event,\'layoutResultJsonPath\')">\n              <i class="icon icon-v-information-line"></i>\n            </a>\n          </label>\n          <input id="{{objName}}-rest-json" type="text" class="form-control" ng-model="datasource.value.resultVar" bs-options="field.name as field.name for field in fieldsFromDatasource"\n            bs-typeahead="bs-typeahead" data-watch-options="true" ng-disabled="disabled || dsDisabled" />\n        </div>\n        <div class="form-group col-lg-12" ng-show="datasource.value.methodType === \'POST\'">\n          <label for="cardBundle">Body</label>\n          <textarea class="form-control" ng-model="datasource.value.body" ng-disabled="disabled || dsDisabled" rows="5" />\n        </div>\n        <div class="form-group col-lg-12" ng-show="datasource.value.header">\n          <div class="row" ng-repeat="header in datasource.value.header">\n            <div class="form-group col-lg-5">\n              <label for="cardBundle" ng-if="$first">Name</label>\n              <input id="{{objName}}-rest-header-{{$index}}" type="text" class="form-control" ng-model="header.name" placeholder="Variable name" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-5">\n              <label for="cardBundle" ng-if="$first">Value</label>\n              <input id="{{objName}}-rest-header-val-{{$index}}" type="text" class="form-control" ng-model="header.val" placeholder="Variable value" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-2">\n              <label for="cardBundle" ng-if="$first">&nbsp;</label>\n              <span class="col-lg-1">\n                <a id="{{objName}}-rest-header-delete-{{$index}}" class="btn btn-link pull-right" ng-href="#">\n                  <i class="icon icon-v-trash" ng-click="datasource.value.header.splice($index,1)" ng-disabled="disabled || dsDisabled"></i>\n                </a>\n              </span>\n            </div>\n          </div>\n        </div>\n        <div class="form-group col-lg-12">\n          <button id="{{objName}}-rest-header-add-btn" type="button" class="btn btn-link" ng-click="addHeaders()" ng-disabled="disabled || dsDisabled">+ Add Header Variables</button>\n        </div>\n      </div>\n    </div>\n    \x3c!-- Intergration Procedures --\x3e\n    <div class="form-group col-lg-12" ng-if="datasource.type === \'IntegrationProcedures\'">\n      <div class="row">\n        <div class="form-group col-lg-12">\n          <label for="cardBundle">Name</label>\n          \x3c!-- <input type="text" class="form-control" id="{{objName}}-cardCtxId" ng-model="datasource.value.remoteClass" ng-disabled="disabled"/> --\x3e\n          <div class="input-group">\n            <input id="{{objName}}-integration-procedure-name" type="text" class="form-control" ng-disabled="disabled || dsDisabled" ng-model="datasource.value.ipMethod" bs-options="ipBundle.Name as ipBundle.Name for ipBundle in $root.ipBundles"\n              bs-typeahead="bs-typeahead" ng-change="getIpBundleId(datasource.value.ipMethod, $root.ipBundles)" autocomplete="off">\n            <span class="input-group-btn">\n              <a class="btn btn-link pull-right" bs-tooltip data-container=".container" ng-show="isIpActive" ng-click="openUrl(\'/apex/\'+ $root.nsPrefix + \'integrationproceduredesigner?id=\' + getIpBundleId(datasource.value.ipMethod, $root.ipBundles),$event, true)"\n                title="Edit Integration Procedures">\n                <i class="icon icon-v-link"></i>\n              </a>\n              <a class="btn btn-link pull-right" bs-tooltip data-container=".container" ng-if="!isIpActive" ng-click="openUrl(\'/apex/\'+$root.nsPrefix+\'integrationprocedurehome?search=\' + datasource.value.ipMethod.split(\'_\')[0],$event, true)"\n                title="Edit Integration Procedures">\n                <i class="icon icon-v-link"></i>\n              </a>\n            </span>\n          </div>\n          <div class="input-group" ng-if="!isIpActive && $root.ipBundles !== undefined">\n            <label class="text-danger">\n              <i class="icon icon-v-warning-circle-line text-danger"></i> {{ ::\'IPNotActiveLabel\' | localize:\'The integration procedure is inactive/invalid\' }} </label>\n          </div>\n        </div>\n        <div class="form-group col-lg-12 filter" id="{{objName}}-integration-procedure-input">\n          <label for="name">Input Map</label>\n          <div class="row" ng-repeat="property in propertySet(datasource.value.inputMap, \'inputMap\') track by property.key">\n            <div class="form-group col-lg-5">\n              <input id="{{objName}}-ip-input-map-{{$index}}" type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.key" ng-change="property.update(\'inputMap\')" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-5 nopadding">\n              <input id="{{objName}}-ip-input-map-value-{{$index}}" class="form-control" type="text" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.value" ng-change="property.update(\'inputMap\')" ng-disabled="disabled"\n              />\n            </div>\n            <div class="form-group col-lg-2">\n              <a id="{{objName}}-ip-input-map-delete-{{$index}}" class="btn btn-link pull-left" ng-href="#">\n                <i class="icon icon-v-trash" ng-click="removeMapProperty(datasource.value.inputMap,property.key)"></i>\n              </a>\n            </div>\n          </div>\n          <div class="row">\n            <div class="col-lg-12">\n              <button id="{{objName}}-ip-input-map-add-btn" type="button" class="btn btn-link" ng-click="addMapProperty(datasource.value.inputMap, \'inputMap\')" ng-disabled="disabled || datasource.value.inputMap[\'\'] == \'\' || dsDisabled">\n                + Add Input Map Variable\n              </button>\n            </div>\n          </div>\n        </div>\n        <div class="form-group col-lg-12 filter" id="{{objName}}-integration-procedure-option">\n          <label for="name">Options Map</label>\n          <div class="row" ng-repeat="property in propertySet(datasource.value.optionsMap, \'optionsMap\') track by property.key">\n            <div class="form-group col-lg-5">\n              <input id="{{objName}}-ip-option-map-{{$index}}" type="text" class="form-control" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.key" ng-change="property.update(\'optionsMap\')" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-5 nopadding">\n              <input id="{{objName}}-ip-option-map-val-{{$index}}" class="form-control" type="text" ng-model-options="{ updateOn: \'blur\'}" ng-model="property.value" ng-change="property.update(\'optionsMap\')" ng-disabled="disabled || dsDisabled"\n              />\n            </div>\n            <div class="form-group col-lg-2">\n              <a id="{{objName}}-ip-option-map-delete-btn-{{$index}}" class="btn btn-link pull-left" ng-href="#">\n                <i class="icon icon-v-trash" ng-click="removeMapProperty(datasource.value.optionsMap,property.key)"></i>\n              </a>\n            </div>\n          </div>\n          <div class="row">\n            <div class="col-lg-12">\n              <button id="{{objName}}-ip-option-map-add-btn" type="button" class="btn btn-link" ng-click="addMapProperty(datasource.value.optionsMap, \'optionsMap\')" ng-disabled="disabled || datasource.value.optionsMap[\'\'] == \'\' || dsDisabled">\n                + Add Option Map Variable\n              </button>\n            </div>\n          </div>\n          <div class="row">\n            <div class="form-group col-lg-6">\n              <label for="cardBundle">Result JSON Path\n                <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event,\'layoutResultJsonPath\')">\n                  <i class="icon icon-v-information-line"></i>\n                </a>\n              </label>\n              <input id="{{objName}}-integration-procedure-json" type="text" class="form-control" ng-model="datasource.value.resultVar" bs-options="field.name as field.name for field in fieldsFromDatasource"\n                bs-typeahead="bs-typeahead" data-watch-options="true" ng-disabled="disabled || dsDisabled" />\n            </div>\n          </div>\n          <div class="row">\n            <div class="form-group col-lg-6">\n              <label for="cardBundle">Asynchronous <a href="javascript:void(0);"><i class="icon icon-v-information-line" data-container=".container" data-type="info" bs-tooltip data-title="{{ ::\'ApexRemoteAsyncCallInfo\' | localize: \'Calls the apex class asynchronously using the long polling method. Useful for larger transactions.\' }}"></i></a>\n              </label>\n              <div class="toggle-switch">\n                <div class="switch">\n                  <input id="{{objName}}-cmn-toggle-2" class="cmn-toggle cmn-toggle-round" type="checkbox" ng-disabled="disabled || dsDisabled" ng-model="datasource.value.vlocityAsync">\n                  <label for="{{objName}}-cmn-toggle-2"></label>\n                </div>\n              </div>\n            </div>\n    \n            <div class="form-group col-lg-6">\n              <label for="cardBundle">{{ ::\'AsyncPollLabel\' | localize:\'Poll Interval\' }} <a href="javascript:void(0);"><i class="icon icon-v-information-line" data-container=".container" data-type="info" bs-tooltip data-title="{{ ::\'AsyncPollInvervalInfo\' | localize: \'Defines the polling interval in ms to check the result status. Default: 1000 if empty.\' }}"></i></a>\n              </label>\n              <input id="{{objName}}-integration-procedure-timeout" type="number" class="form-control" ng-model="datasource.value.vlocityAsyncTimeout" ng-disabled="disabled || dsDisabled || !datasource.value.vlocityAsync"/>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    \x3c!-- Custom --\x3e\n    <div class="form-group col-lg-12" ng-if="datasource.type === \'Custom\'">\n      <div class="row">\n        <div class="form-group col-lg-6">\n          <label for="cardBundle">Result Variable</label>\n          <input id="{{objName}}-sample-result-var" type="text" class="form-control" ng-model="datasource.value.resultVar" bs-options="field.name as field.name for field in fieldsFromDatasource"\n            bs-typeahead="bs-typeahead" data-watch-options="true" ng-disabled="disabled" />\n        </div>\n        <div class="col-lg-6">&nbsp;</div>\n        <div class="form-group col-lg-12" ng-class="{\'has-feedback has-error\': isInvalid}">\n          <label for="cardBundle">JSON</label>\n          <textarea id="{{objName}}-sample-json" class="form-control" ng-model="datasource.value.body" ng-change="onJsonChange(datasource.value.body)" ng- rows="8"\n            ng-disabled="disabled"></textarea>\n      <span ng-if="isInvalid" class="icon-v-close-circle form-control-feedback" data-container=".container"\n        data-type="info" bs-tooltip bs-enabled="true" data-title="{{ ::\'DesInvalidJson\' | localize:\'Invalid JSON\' }}"\n        aria-hidden="true"></span>\n    </div>\n  </div>\n  </div>\n  <div ng-if="datasource.type !== null">\n    <div class="form-group col-lg-12">\n      <div class="row">\n        <div class="col-lg-6">\n          <label>Order By\n            <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event,\'orderBy\')">\n              <i class="icon icon-v-information-line"></i>\n            </a>\n          </label>\n          <input id="{{objName}}-datasource-orderby" type="text" class="form-control" ng-model="datasource.orderBy.name"\n            ng-disabled="disabled" />\n        </div>\n        <div class="col-lg-6">\n          <label>Reverse Order</label>\n          <select id="{{objName}}-datasource-reverse" class="form-control" ng-model="datasource.orderBy.isReverse"\n            ng-disabled="disabled">\n            <option></option>\n            <option value="false">False</option>\n            <option value="true">True</option>\n          </select>\n        </div>\n      </div>\n    </div>\n  </div>\n  </div>\n  <div class="row context-variables"\n    ng-if="!collapse && datasource != null && datasource.type != null && datasource.type !== \'Inherit\'">\n    <div class="form-group col-lg-12">\n      <h5><strong> Options</strong></h5>\n      <hr class="no-margin" />\n      <div class="row">\n        <div class="col-lg-6">\n          <label for="cardBundle">Timeout (ms)\n            <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event, \'timeOut\')">\n              <i class="icon icon-v-information-line"></i>\n            </a>\n          </label>\n          <input id="{{objName}}-datasource-timeout" type="number" class="form-control"\n            ng-model="datasource.value.timeout" ng-disabled="disabled" min="0" oninput="validity.valid||(value=\'\');" />\n        </div>\n        <div class="col-lg-6">\n          <label for="cardBundle">Interval (ms)\n            <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event, \'interval\')">\n              <i class="icon icon-v-information-line"></i>\n            </a>\n          </label>\n          <input id="{{objName}}-datasource-interval" type="number" class="form-control"\n            ng-model="datasource.value.interval" ng-disabled="disabled" min="0" oninput="validity.valid||(value=\'\');" />\n        </div>\n        <div class="col-lg-12" ng-if="datasource.value.interval && datasource.value.interval < 2000">\n          <label class="text-danger">\n            <i class="icon icon-v-warning-circle-line text-danger"></i> the interval cannot be less than 2000ms.</label>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class="row context-variables"\n    ng-if="!collapse && datasource != null && datasource.type != null && datasource.type !== \'Inherit\'">\n    <div class="form-group col-lg-12">\n      <h5>Test Data Source Settings\n        <a href="javascript:void(0);" ng-click="helpNode.helpNodeModal($event, \'layoutTestDatasourceSettings\')">\n          <i class="icon icon-v-information-line"></i>\n        </a>\n      </h5>\n    </div>\n    <div class="form-group col-lg-12" ng-show="datasource.contextVariables.length > 0">\n      <div class="row" ng-repeat="ctxVar in datasource.contextVariables">\n        <div class="form-group col-lg-5">\n          <label for="cardBundle" ng-if="$first">Name</label>\n          <input id="{{objName}}-contextVariables-{{$index}}" type="text" ng-disabled="disabled || dsDisabled"\n            class="form-control" ng-model="ctxVar.name" placeholder="Variable name" />\n        </div>\n        <div class="form-group col-lg-5">\n          <label for="cardBundle" ng-if="$first">Value</label>\n          <input id="{{objName}}-contextVariables-val-{{$index}}" type="text" ng-disabled="dsDisabled"\n            class="form-control" ng-model="ctxVar.val" placeholder="Variable value" ng-change="bypassLayoutSave()" />\n        </div>\n        <div class="form-group col-lg-2">\n          <label for="cardBundle" ng-if="$first">&nbsp;</label>\n          <span class="col-lg-1">\n            <a id="{{objName}}-contextVariables-delete-{{$index}}" class="btn btn-link pull-right" ng-href="#"\n              ng-disabled="disabled || dsDisabled">\n              <i class="icon icon-v-trash" ng-click="removeVars($index)"></i>\n            </a>\n          </span>\n        </div>\n      </div>\n    </div>\n    <div class="form-group col-lg-12">\n      <button type="button" id="{{objName}}-add-test-variable" ng-disabled="disabled || dsDisabled" class="btn btn-link"\n        ng-click="addVars()">+ Add Test Variables</button>\n      <button type="button" id="{{objName}}-view-data-btn" class="btn btn-primary pull-right"\n        ng-disabled="datasource == null || isInvalid || isFetchingData" ng-click="testDataSource(false)">View Data</button><i ng-if="isFetchingData" class="pull-right spinner"></i>\n    </div>\n  </div>\n</span>'),$templateCache.put("CardAddModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">{{::\'CardDesAddCardLabel\' | localize: \'Add Card\'}}</h4>\n      </div>\n      <div class="modal-body">\n        <div bs-active-pane="tabs.activeTab" bs-tabs="bs-tabs" class="" ng-if="!zone">\n            <div ng-repeat="tab in tabs" title="{{tab.title}}" disabled="" ng-bind="tab.content" bs-pane="bs-pane">\n            </div>\n        </div>\n        <div ng-show="tabs.activeTab === 0">\n          <div class="col-sm-12">\n            <div class="row">\n              <div class="col-sm-5 form-group no-padding">\n                <input type="text" class="form-control" ng-model="search.searchTerm" placeholder="Search">\n              </div>\n              <table class="table header-fixed">\n                <thead>\n                  <th class="width10"><input ng-model="selectAllCards" ng-change="selectAllCard(selectAllCards);" type="checkbox"></th>\n                  <th class="width30">{{ ::\'CardNameLabel\' | localize: \'Card Name\' }}</th>\n                  <th class="width20">{{ ::\'Version\' | localize: \'Version\' }}</th>\n                  <th class="width30">{{ ::\'Author\' | localize: \'Author\' }}</th>\n                  <th class="width10">{{ ::\'Active\' | localize: \'Active\' }}</th>\n                </thead>\n                <tbody>\n                  <tr ng-repeat="card in availableCards | orderBy: \'Name\' | filter:filterTable" ng-if="card.Name != \'<<Empty Card>>\'">\n                    <td class="width10"><input ng-model="card.selected" ng-change="selectCard(card);$event.stopPropagation();" type="checkbox"></td>\n                    <td class="width30">{{card.Name}}</td>\n                    <td class="width20">{{card[nsPrefix + \'Version__c\']}}</td>\n                    <td class="width30">{{card[nsPrefix + \'Author__c\']}}</td>\n                    <td class="width10"><i ng-if="card[nsPrefix + \'Active__c\']" class="icon icon-v-check-circle"></i></td>\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n          </div>\n        </div>\n\n        <div ng-show="tabs.activeTab === 1">\n          <div class="alert alert-danger" role="alert" ng-if="card.errors && card.errors.length > 0">\n            {{card.errors[0].message}}\n          </div>\n          <div class="col-sm-12">\n              <div class="row">\n                <div class="form-group col-sm-8">\n                  <label for="name">{{ ::\'CardNameLabel\' | localize: \'Card Name\' }}</label>\n                  <input class="form-control" ng-model="card.Name" placeholder="Enter name" type="text" />\n                </div>\n              </div>\n              <div class="row">\n                <div class="form-group col-sm-8">\n                  <label for="name">{{ ::\'CardTitleLabel\' | localize: \'Card Title\' }}</label>\n                  <input class="form-control" ng-model="card[nsPrefix + \'Definition__c\'].title" placeholder="Enter title" type="text" />\n                </div>\n              </div>\n              <div class="row">\n                <div class="form-group col-sm-8">\n                  <label for="name">{{ ::\'CardAuthorLabel\' | localize: \'Card Author\' }}</label>\n                  <input class="form-control" ng-model="card[$root.nsPrefix+\'Author__c\']" placeholder="Enter Author" type="text" />\n                </div>\n              </div>\n          </div>\n        </div>\n\n      </div>\n      <div class="modal-footer">\n        <button type="button" ng-if="!layoutSaving" ng-disabled="cardsToAdd.length == 0 && tabs.activeTab === 0" class="btn btn-primary" ng-click="addCard($hide)">{{ ::\'Add\' | localize: \'Add\' }}</button>\n        <i ng-if="layoutSaving" class="pull-right spinner"></i>\n        <button type="button" class="btn btn-default" ng-click="$hide()">{{ ::\'SaveTemplateDialogConfirmCancel\' | localize: \'Cancel\' }}</button>\n      </div>\n    </div>\n  </div>\n</div>'),$templateCache.put("helpModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">Help</h4>\n      </div>\n\n      <div class="modal-body docsModalBody">\n          <div ng-include="helpNode"></div>\n      </div>\n\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" ng-click="$hide()">{{ ::\'helpDialogClose\' | localize: \'Close\' }}</button>\n      </div>\n    </div>\n  </div>\n</div>'),$templateCache.put("ConditionsGroupTemplate.html",'<div class="row" ng-if="!condition.group && condition.type != \'system\'">\n      <div class="form-group col-sm-12">\n        <button type="button" class="btn btn-default"\n            ng-model="condition.logicalOperator"\n            ng-if="condition.logicalOperator"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n            data-html="1"\n            ng-change="evalConditions(state, state.conditions.group)"\n            bs-options="operator.value as operator.name for operator in logicalOperators" bs-select>\n      </div>\n      <div class="form-group col-sm-4">\n        <input  type="text" class="form-control"\n              ng-model="condition.field"\n              bs-options="field.name as field.name for field in stateFields"\n              bs-typeahead="bs-typeahead"\n              ng-change="evalConditions(state, state.conditions.group)"\n              data-watch-options="true" \n              ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"/>\n      </div>\n      <div class="form-group col-sm-2">\n        <select class="form-control" ng-model="condition.operator" ng-init="condition.operator = condition.operator ? condition.operator : \'==\'" ng-options="operator.value as operator.name for operator in conditionOperators"  ng-change="evalConditions(state, state.conditions.group)"\n                ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n        </select>\n      </div>\n      <div class="form-group col-sm-5">\n        <input type="text" ng-model="condition.value" class="form-control"  ng-change="evalConditions(state, state.conditions.group)" placeholder="Enter a value"  ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"/>\n      </div>\n      <div class="form-group col-sm-1">\n          <label for="cardBundle" ng-if="$first">&nbsp;</label>\n          <span class="col-sm-1" style="padding:0">\n            <a class="btn btn-link" ng-href="#" ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"><i class="icon icon-v-trash" ng-click="deleteRule(state, condition, state.conditions.group)"></i></a>\n          </span>\n      </div>\n</div>\n<button type="button" class="btn btn-default"\n            ng-model="condition.logicalOperator"\n            ng-if="condition.group && condition.logicalOperator"\n            ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked"\n            data-html="1"\n            ng-change="evalConditions(state, state.conditions.group)"\n            bs-options="operator.value as operator.name for operator in logicalOperators" bs-select>\n</button>\n<div class="condition-group-block" ng-if="condition.group">\n    <i class="icon icon-v-right-arrow"\n            ng-show="condition.collapse && condition.group && condition != state.conditions" ng-click="condition.collapse = !condition.collapse"></i>\n    <i class="icon icon-v-down-arrow"\n        ng-show="!condition.collapse && condition.group && condition != state.conditions" ng-click="condition.collapse = !condition.collapse; evalConditions(condition, condition.group);"></i>\n    <div ng-show="condition.collapse && condition.group" class="condtion-collapse">\n      {{condition.filter}}\n    </div>\n    <div class="condition-group" ng-show="!(condition.collapse && condition.logicalOperator)">\n\n      <div ng-repeat="condition in condition.group track by $index"\n              ng-include="\'ConditionsGroupTemplate.html\'"></div>\n      <button type="button" class="btn btn-link"\n              ng-click="addCondition(state, condition.group)" ng-disabled="state.disableAddCondition || $root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">{{ ::\'stateAddCondition\' | localize:\'+ Add Condition\' }}</button>\n      <button type="button" class="btn btn-link"\n              ng-click="addGroup(state, condition.group)" ng-disabled="state.disableAddCondition || $root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">{{ ::\'stateAddGroup\' | localize:\'+ Add Group\' }}</button>\n      <button type="button" class="btn btn-link"\n              ng-click="deleteGroup(state, condition, state.conditions.group)" \n              ng-if="condition != state.conditions"\n              ng-disabled="$root.layout[nsPrefix + \'Active__c\'] || card[nsPrefix + \'Active__c\'] || $root.lockedLayout || card.locked">\n          <span class="icon icon-v-trash"></span>\n      </button>\n  </div>\n</div>\n'),$templateCache.put("CardCloneModal.tpl.html",'<div class="modal vlocity" tabindex="-1" role="dialog" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header" ng-show="title">\n        <button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" ng-bind="title"></h4>\n      </div>\n      <div class="modal-body">\n        <div class="alert alert-danger" role="alert" ng-if="card.errors" ng-repeat="error in card.errors">\n          {{error.message}}\n        </div>\n        <div class="col-sm-12">\n            <div class="row">\n              <div class="form-group col-sm-8">\n                <label for="name">Card Name</label>\n                <input class="form-control" ng-model="card.Name" placeholder="Enter name" type="text"  autocomplete="new-password" />\n              </div>\n            </div>\n            <div class="row">\n              <div class="form-group col-sm-8">\n                <label for="name">Card Title</label>\n                <input class="form-control" ng-model="card[nsPrefix + \'Definition__c\'].title" placeholder="Enter title" type="text"  autocomplete="new-password" />\n              </div>\n            </div>\n            <div class="row">\n              <div class="form-group col-sm-8">\n                <label for="name">Card Author</label>\n                <input class="form-control" ng-model="card[$root.nsPrefix+\'Author__c\']" placeholder="Enter Author" type="text"  autocomplete="new-password" />\n              </div>\n            </div>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button type="button" ng-if="!layoutSaving" class="btn btn-primary" ng-click="saveCard($hide)">{{ ::\'cloneCardButtonLabel\' | localize: \'Clone\' }}</button>\n        <i ng-if="layoutSaving" class="pull-right spinner"></i>\n        <button type="button" class="btn btn-default" ng-click="$hide()">{{ ::\'SaveTemplateDialogConfirmCancel\' | localize: \'Cancel\' }}</button>\n      </div>\n    </div>\n  </div>\n</div>'),$templateCache.put("NewLayoutModal.tpl.html",'<div class="modal vlocity" style="display:block" tabindex="-1" role="dialog" aria-hidden="true">\n    <div class="modal-dialog">\n        <div class="modal-content">\n            <form name="newLayoutForm">\n                <div class="modal-header">\n                    <button type="button" class="close" aria-label="Close" ng-click="closeNewLayoutTab()"><span\n                            aria-hidden="true">&times;</span></button>\n                    <h4 class="modal-title">New Layout</h4>\n                </div>\n                <div class="modal-body">\n                    <h4 class="text-danger">{{layout.errors[0].message}}</h4>\n                    <div class="col-sm-12">\n                        <div class="row">\n                            <div class="form-group col-sm-8">\n                                <label for="name">Layout Name</label>\n                                <input class="form-control" ng-model="$root.layout.Name" placeholder="Enter name"\n                                    type="text" required autocomplete="new-password" />\n                            </div>\n                        </div>\n                        <div class="row">\n                            <div class="form-group col-sm-8">\n                                <label for="name">Layout Type</label>\n                                <select class="form-control" ng-model="$root.layout[$root.nsPrefix+\'Type__c\']"\n                                    ng-options="layoutType for layoutType in $root.layoutTypes"></select>\n                            </div>\n                        </div>\n                        <div class="row">\n                            <div class="form-group col-sm-8">\n                                <label for="name">Layout Author</label>\n                                <input class="form-control" ng-model="$root.layout[$root.nsPrefix+\'Author__c\']"\n                                    placeholder="Enter Author" type="text" required autocomplete="new-password" />\n                            </div>\n                        </div>\n                        <div class="row">\n                            <div class="form-group col-lg-12">\n                                <div class="toggle-switch">\n                                    <span class="toggle-label toggle-to">Enable LWC:</span>\n                                    <div class="switch">\n                                        <input id="cmn-toggle-3" class="cmn-toggle cmn-toggle-round" type="checkbox"\n                                            ng-model="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc"  autocomplete="new-password" />\n                                        <label for="cmn-toggle-3"></label>\n                                    </div>\n                                </div>\n                                <label ng-if="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc" class="text-info"><i\n                                        class="icon icon-v-information-line text-info"></i>\n                                    {{ ::\'CardDesignerLWCInfo\' | localize:\'Creating Layouts/Cards may be slow due to the LWC deployment process.\' }}\n                                </label>\n                            </div>\n                        </div>\n                        <div class="row" ng-if="!$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n                            <div class="form-group col-sm-8">\n                                <label for="name">Template</label>\n                                <div class="input-group">\n                                    <input type="text" id="{{layoutName}}-template"\n                                        data-template="TypeaheadCustomTemp.tpl.html" class="form-control"\n                                        ng-model="$root.layout[$root.nsPrefix+\'Definition__c\'][\'templates\'][0].templateUrl"\n                                        bs-options="template as template.Name for template in $root.templates | orderBy: [nsPrefix + \'Type__c\', \'Name\'] | groupByField : nsPrefix + \'Type__c\'"\n                                        bs-typeahead="bs-typeahead" autocomplete="new-password" ng-change="changeTemplate()"\n                                        ng-click="scrollModal()"\n                                        ng-disabled="$root.layout[nsPrefix + \'Active__c\']  || $root.lockedLayout"\n                                        required>\n\n                                    <span class="input-group-btn">\n                                        <a class="btn btn-link pull-right"\n                                            ng-click="openUrl(templateUrlPrefix + $root.layout[$root.nsPrefix+\'Definition__c\'][\'templates\'][0].templateUrl,$event, true)"\n                                            title="{{ ::\'editTemplateIconLabel\' | localize:\'Edit Template\' }}"\n                                            bs-tooltip data-container=".container"><i class="icon icon-v-link"></i></a>\n                                    </span>\n                                </div>\n                                <div class="input-group"\n                                    ng-if="!newLayoutForm.$invalid && isTemplateActive($root.layout[$root.nsPrefix+\'Definition__c\'][\'templates\'][0].templateUrl,$root.layout.Name)">\n                                    <label class="text-danger"><i\n                                            class="icon icon-v-warning-circle-line text-danger"></i>\n                                        {{ ::\'TemplateNotActiveLabel\' | localize:\'The template is inactive/invalid\' }}\n                                    </label>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class="row" ng-if="$root.layout[$root.nsPrefix+\'Definition__c\'].enableLwc">\n                            <div class="form-group col-sm-8">\n                                <label for="name">Layout LWC</label>\n                                <div>\n                                    <input type="text" id="{{layoutName}}-template"\n                                        data-template="TypeaheadCustomTemp.tpl.html" class="form-control"\n                                        ng-model="$root.layout[$root.nsPrefix+\'Definition__c\'].lwc"\n                                        bs-options="template as template.MasterLabel for template in $root.lightningwebcomponents"\n                                        bs-typeahead="bs-typeahead" autocomplete="new-password"\n                                        ng-change="selectLwc($root.layout.Name)" required>\n                                </div>\n                                <div class="input-group"\n                                    ng-if="!newLayoutForm.$invalid && isLwcActive($root.layout[$root.nsPrefix+\'Definition__c\'].lwc.DeveloperName,$root.layout.Name)">\n                                    <label class="text-danger"><i\n                                            class="icon icon-v-warning-circle-line text-danger"></i>\n                                        {{ ::\'LwcNotActiveLabel\' | localize:\'The LWC is inactive/invalid\' }} </label>\n                                </div>\n                            </div>\n                        </div>\n\n                    </div>\n                </div>\n                <div class="modal-footer">\n                    <button type="button" ng-if="!layoutSaving" ng-disabled="newLayoutForm.$invalid"\n                        class="btn btn-primary" ng-click="saveNewLayout()">Save</button>\n                    <i ng-if="layoutSaving" class="pull-right spinner"></i>\n                    <button type="button" class="btn btn-default" ng-click="closeNewLayoutTab()">Cancel</button>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>')}]);

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

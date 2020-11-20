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
angular
    .module('i18', ['sldsangular'])
    .constant('TRANSLATION_FIELDS', {
        'ATTR_NAME': 'Attribute.Name',
        'ATTR_CAT_NAME': 'AttributeCategory.Name',
        'ATTR_VAL': 'Attribute.Value',
        'PROD2_NAME': 'Product2.Name',
        'PROD2_DESC': 'Product2.Description',
        'PROM_NAME': 'Promotion.Name'
    })
    .constant('TRANSLATION_RES_NOT_CHANGED', 302)
    .run (['$rootScope', function($rootScope) {
        $rootScope.vlocityMLS = {actions: {}};
        $rootScope.vlocityMLS.actions = {
            fieldSettings: function() {
                return [$rootScope.nsPrefix + 'FieldSettings__c' ];
            }(),
            getTranslationMap: function() {

                var localeCode = $rootScope.vlocity.userSfLocale;

                var params = {
                    domain: 'CPQ',
                    localeCode: localeCode,
                    page: '1'
                };

                return ["APIHandler",
                        "getDictionary",
                        params,
                        null
                ];
            },
            isMultiLangCatalogSupport: function() {
                return [
                    $rootScope.nsPrefix + 'VlocityFeature__c'
                ];
            }()
        };
    }]);

require('./modules/i18Translations/services/CPQTranslateResourcesService.js');
require('./modules/i18Translations/services/CPQTranslateService.js');
require('./modules/i18Translations/filters/CPQTranslateFilter.js');
require('./modules/i18Translations/directives/CPQTranslateDirective.js');




},{"./modules/i18Translations/directives/CPQTranslateDirective.js":2,"./modules/i18Translations/filters/CPQTranslateFilter.js":3,"./modules/i18Translations/services/CPQTranslateResourcesService.js":4,"./modules/i18Translations/services/CPQTranslateService.js":5}],2:[function(require,module,exports){
angular
    .module('i18')
    .directive(
        'cpqTranslate',
        ['CPQTranslateService',
         '$parse' ,
         '$interpolate',
         function(CPQTranslateService, $parse, $interpolate) {

             return {
                 resrict: 'A',
                 scope: false,
                 link: function(scope,element, attrs) {
                     CPQTranslateService
                         .isReady()
                         .then(function() {
                             return element.html(
                                 CPQTranslateService.translate(
                                     $interpolate(
                                        //Using text method to avoid special Char encoding
                                        element.text().toString().trim()
                                     )(scope),
                                     attrs.cpqTranslate
                                 )
                             );
                         });

                 }
             };
         }]);

},{}],3:[function(require,module,exports){
angular
    .module('i18')
    .filter('CPQTranslateFilter', ['CPQTranslateService', function(CPQTranslateService) {
        function filter(input, objType) {
            return CPQTranslateService.translate(input, objType);
        }
        
        filter.$stateful = true;
        return filter;
    }]);



},{}],4:[function(require,module,exports){
angular
    .module('i18')
    .service(
        'CPQTranslationResourceService',
        ['$q', '$rootScope', '$http', '$log','remoteActions','dataService','userProfileService','TRANSLATION_RES_NOT_CHANGED','LZString',
         function($q, $rootScope, $http, $log, remoteActions, dataService, userProfileService, TRANSLATION_RES_NOT_CHANGED, LZString) {

             var req = $rootScope.vlocityMLS.actions.fieldSettings;
             var isMultiLangCatalogSupp = $rootScope.vlocityMLS.actions.isMultiLangCatalogSupport;

             //if the service is not enabled don't translated anything

             function extractTranslatableFields(payload) {
                 var ns = $rootScope.nsPrefix;

                 var records = payload;
                 
                 var transObjects = [];
                 _.forEach(records, function(transObj) {
                     transObjects.push(
                         transObj[ns + 'ObjectName__c']
                             .replace(ns, "").replace("__c", "") +
                         "." + 
                         transObj[ns + 'FieldName__c']
                             .replace(ns, "").replace("__c","")
                     );
                 });

                 return transObjects;

             }

             function extractTranslationMap(records, updatedData, status, eTag) {

                 var data = updatedData;
                 var translationsMap = records;

                 // if the translation map is returned from the server:
                 if (translationsMap && !(status === TRANSLATION_RES_NOT_CHANGED)) {
                     $log.log(
                         'translation map came from server',
                         translationsMap
                     );

                     setTimeout(function() {
                         localStorage.setItem(
                             'translationMap',
                             LZString.compressToUTF16(JSON.stringify(translationsMap))
                         );

                         if (eTag) {
                            localStorage.setItem(
                                'translationETag',
                                 (eTag || '') + ''
                             );
                         }
                     });

                     return translationsMap;

                 }

                 //if there are no updates from the server -pick from local storage
                 translationsMap = JSON.parse(
                     LZString.decompressFromUTF16(localStorage.getItem('translationMap')) || '{}'
                 );

                 if (Object.keys(translationsMap).length > 0) {
                     $log.log('translation map from the storage container');
                 }

                 return translationsMap;

             };

             var deferred = $q.defer();

             $q.all([
                 dataService.getCustomSettings.apply(
                     dataService,
                     isMultiLangCatalogSupp
                 ),
                 userProfileService.userInfoPromise()
             ]).then(function(dataArray) {
                 //if this feature is turned off , resolve defer
                 var data = dataArray[0];
                 var enableMLSSupport = _.filter(data, function(feature) {
                     return feature.Name == "EnableMultiLanguageSupport";
                 });
                 var eTag = localStorage.getItem('translationETag');

                 //making false as string because thats what the api returns
                 //check with @Manish
                 var enableMLSFlag = enableMLSSupport.length &&
                                     enableMLSSupport[0][$rootScope.nsPrefix + 'SetupValue__c'] ||
                                     "false";

                 if (enableMLSFlag === "false") {
                     $log.warn('mls flag is turned off , none of the data woule be translated');
                     deferred.resolve({
                         translationsMap:{},
                         translatableFields:[]
                     });
                     return ;
                 }

                 /* getTranslationRequests
                 *   This function will create updated objects for calling getDictionary api to handle pagination
                 * */
                 function getTranslationRequests(index) {
                     var langTransreq = $rootScope.vlocityMLS.actions.getTranslationMap();
                     if(eTag) {
                         angular.extend(langTransreq[2], {
                             'If-None-Match': eTag + ''
                         });
                     }
                     langTransreq[2].page = (index).toString();
                     langTransreq[2] = angular.toJson(langTransreq[2]);
                     return langTransreq;
                 }
                 // Todo: Update this part to configure the number of multiple requests, currently making 4 concrrent calls.
                 $q.all(
                     [
                         remoteActions.doGenericInvoke.apply(remoteActions, getTranslationRequests(1)),
                         remoteActions.doGenericInvoke.apply(remoteActions, getTranslationRequests(2)),                     
                         remoteActions.doGenericInvoke.apply(remoteActions, getTranslationRequests(3)),
                         remoteActions.doGenericInvoke.apply(remoteActions, getTranslationRequests(4)),
                         dataService.getCustomSettings.apply(dataService , req)
                     ]
                 ).then(function (data) {
                     var eTag = '';
                     var status = 200;
                     var dataArray = [];
                     var dictionaryObject = {};
                     data[0] = angular.fromJson(data[0]);
                     data[1] = angular.fromJson(data[1]);
                     data[2] = angular.fromJson(data[2]);
                     data[3] = angular.fromJson(data[3]);
                     data[4] = angular.fromJson(data[4]);
                    
                     for(var i=0;i<4;i++) {
                         if(data[i] && data[i].records && data[i].records[0] && data[i].records[0].dictionary) {
                             dictionaryObject = data[i].records[0].dictionary; 
                             dataArray.push(dictionaryObject);
                             if(eTag != '') {
                                 eTag = eTag + ',' + data[i].records[0].eTag;    
                             }
                             else {
                                 eTag = data[i].records[0].eTag;
                             }
                         }
                     }
                     function jsonConcat(o1,o2) {
                      for (var key in o2) {
                        o1[key] = o2[key];
                      }
                      return o1; 
                     }
                    var output = {};
                    output = jsonConcat(output,dataArray[0]);
                    output = jsonConcat(output,dataArray[1]);
                    output = jsonConcat(output,dataArray[2]);
                    output = jsonConcat(output,dataArray[3]);
                    if (eTag == '') {
                        status = TRANSLATION_RES_NOT_CHANGED;
                    }

                    deferred.resolve({
                       translationsMap:extractTranslationMap(
                           output, data[0], status, eTag
                       ),
                       translatableFields:extractTranslatableFields(
                           data[4]
                       )
                   });
                 }).catch(function(error) {
                     $log.error(error);
                     deferred.reject(error);
                 });

             });

             this.getTranslationResources = function() {
                 return deferred.promise;
             };
             
         }]);

},{}],5:[function(require,module,exports){
angular
    .module('i18')
    .service(
        'CPQTranslateService',
        ['$q', '$log', 'CPQTranslationResourceService','TRANSLATION_FIELDS',
         function($q, $log, CPQTranslationResourceService, TRANSLATION_FIELDS) {

             var virtualItemIterator;
             var lineItemsIterator;
             var lineItemsObject;
             var self = this;
             var isServiceReadyPromise = $q.defer();

             function translateLabel(label, objType) {
                 var translateLabel = !objType ||
                                      _.includes(self.translatableFields, objType);

                 if (!translateLabel) {
                     return label;
                 }

                 return (
                     this.translationsMap &&
                     this.translationsMap[label]
                 ) || label;
             }


             CPQTranslationResourceService
                 .getTranslationResources()
                 .then(function(obj) {
                     self.translationsMap = obj.translationsMap;
                     self.translatableFields = obj.translatableFields;
                     self.userInfo = obj.userInfo;

                     if (Object.keys(obj.translationsMap).length > 0 ){
                         self.translate = translateLabel;
                     }

                     isServiceReadyPromise.resolve(true);
                 })
                 .catch(function(error) {
                     //no translations - base strings will be displayed as is
                     $log.error(error);
                     self.translationsMap = {};
                     self.translatableFields = [];
                     isServiceReadyPromise.resolve(true);
                 });

             self.translate = function(label){
                 return label;
             };

             self.isReady = function() {
                 return isServiceReadyPromise.promise;
             };
             //traslation of search product list when Collapse Hierarchy is on
             self.translateProductList = function(productList) {
                productList 
                 .map(function(record) {
                     record.Name.value = self.translate(
                         record.Name.value,
                         TRANSLATION_FIELDS.PROD2_NAME
                     );
                     return record;
                 });
                 return productList;
             }

             self.translateAttributeObj =  function(itemObject, preHookCallback) {

                 if (!itemObject) {
                     return itemObject;
                 }

                 //when there is a hasRule on the attribute it can result in
                 // 1. attr being added/deleted to the dom
                 // 2. attr values being changed as a result of the outbound call
                 // -- In the second case cpq app only uses the attribute Categories of the
                 // -- of the response payload and attaches the same ot the itemObject
                 // -- which will result in the object having the translated flag
                 // -- but not being translated -- prehook forces the translation
                 preHookCallback && preHookCallback(itemObject);

                 if (itemObject.i18TranslationComplete) {
                     return itemObject;
                 }

                 // iterator for vitual products virtualItemIterator
                 virtualItemIterator = function (itemObject) {
                     if (itemObject.productGroups) {
                        lineItemsObject = itemObject.productGroups.records["0"].lineItems;
                        lineItemsIterator(lineItemsObject);
                        virtualItemIterator(itemObject.productGroups.records["0"]);
                     }
                 }
                 // iterating over lineitems
                 lineItemsIterator = function (lineItemsObject) {
                     if (lineItemsObject && lineItemsObject.records) {
                        lineItemsObject
                            .records
                              .map(function(record) {
                             record.Name = self.translate(
                                record.Name,
                                TRANSLATION_FIELDS.ATTR_CAT_NAME
                             );
                             if (record.attributeCategories &&
                                record.attributeCategories.records && record.attributeCategories.records.length > 0) {
                                record
                                    .attributeCategories
                                    .records
                                    .map(function(productAttributes) {
                                            productAttributes.Name = self.translate(
                                                productAttributes.Name,
                                                TRANSLATION_FIELDS.ATTR_CAT_NAME
                                            );
                                            if (productAttributes.productAttributes.records && productAttributes.productAttributes.records > 0) {
                                            productAttributes
                                            .productAttributes
                                            .records
                                            .map(function(productAttribute) {
                                                 // translates each of the attribute label
                                                 productAttribute.label = self.translate(
                                                    productAttribute.label,
                                                    TRANSLATION_FIELDS.ATTR_NAME
                                                 );
                                                 // Based on flag isNotTranslatable we will translate attributs value labels and userValues 
                                                 if (!productAttribute.isNotTranslatable) {
                                                     // We need to translate only text box uservalue that’s why we are adding the condition productAttribute.inputType === ‘text’.
                                                     // We cannot translate the uservalue of a picklist because once it is translated,
                                                     // it will not match with the value of option tag of the picklist and therefore the default value will not be shown.
                                                     if (productAttribute.userValues && productAttribute.inputType === 'text') {
                                                        productAttribute.userValues = self.translate(
                                                            productAttribute.userValues,
                                                            TRANSLATION_FIELDS.ATTR_NAME
                                                        );
                                                     }

                                                     // translates each of the attribute value labels
                                                     if (productAttribute.values && productAttribute.values.length > 0) {
                                                         productAttribute
                                                         .values
                                                         .map(function(value) {
                                                             value.label = self.translate(
                                                                value.label,
                                                                TRANSLATION_FIELDS.ATTR_VAL
                                                            );
                                                         return value;
                                                     });
                                                 }
                                             }
                                             return productAttribute;
                                         });
                                     }
                                     return productAttributes
                                 });
                             }
                             if (record.lineItems) {
                                lineItemsIterator(record.lineItems); 
                             }
                             if (record.productGroups) {
                                lineItemsObject = record.productGroups.records["0"].lineItems;
                                lineItemsIterator(lineItemsObject);
                             }
                             return lineItemsObject;
                         });
                     }       
                 }
                 // if we have parent product alone
                 if (itemObject.attributeCategories &&
                     itemObject.attributeCategories.records) {
                     itemObject
                         .attributeCategories
                         .records
                         .map(function(record) {
                             record.Name = self.translate(
                                 record.Name,
                                 TRANSLATION_FIELDS.ATTR_CAT_NAME
                             );
                             
                             if (record.productAttributes && 
                                 record.productAttributes.records && record.productAttributes.records.length > 0) {
                                 record
                                     .productAttributes
                                     .records
                                     .map(function(productAttribute) {
                                         // translates each of the attribute label
                                         productAttribute.label = self.translate(
                                             productAttribute.label,
                                             TRANSLATION_FIELDS.ATTR_NAME
                                         );
                                         // Based on flag isNotTranslatable we will translate attributs value labels and userValues 
                                         if (!productAttribute.isNotTranslatable) {
                                             // We need to translate only text box uservalue that’s why we are adding the condition productAttribute.inputType === ‘text’.
                                             // We cannot translate the uservalue of a picklist because once it is translated,
                                             // it will not match with the value of option tag of the picklist and therefore the default value will not be shown.
                                             if (productAttribute.userValues && productAttribute.inputType === 'text') {
                                                productAttribute.userValues = self.translate(
                                                    productAttribute.userValues,
                                                    TRANSLATION_FIELDS.ATTR_NAME
                                                );
                                             }

                                            // translates each of the attribute value labels
                                            if (productAttribute.values && productAttribute.values.length > 0) {
                                                 productAttribute
                                                 .values
                                                 .map(function(value) {
                                                     value.label = self.translate(
                                                         value.label,
                                                         TRANSLATION_FIELDS.ATTR_VAL
                                                     );
                                                     return value;
                                                 });
                                             }
                                         }
                                     return productAttribute;
                                 });
                             }
                             return record;
                         });

                     itemObject.i18TranslationComplete = true;
                 }
                 // translates if itemObject have only productAttributes
                 if (itemObject.productAttributes &&
                    itemObject.productAttributes.records) {
                        itemObject.Name = self.translate(
                            itemObject.Name,
                            TRANSLATION_FIELDS.ATTR_CAT_NAME
                        );
                        if (itemObject.productAttributes.records && itemObject.productAttributes.records.length > 0) {
                            itemObject
                                .productAttributes
                                .records
                                .map(function(productAttribute) {
                                    // translates each of the attribute label
                                    productAttribute.label = self.translate(
                                        productAttribute.label,
                                        TRANSLATION_FIELDS.ATTR_NAME
                                    );
                                     // Based on flag isNotTranslatable we will translate attributs value labels and userValues
                                     if (!productAttribute.isNotTranslatable) {
                                         // We need to translate only text box uservalue that’s why we are adding the condition productAttribute.inputType === ‘text’.
                                         // We cannot translate the uservalue of a picklist because once it is translated,
                                         // it will not match with the value of option tag of the picklist and therefore the default value will not be shown.
                                         if (productAttribute.userValues && productAttribute.inputType === 'text') {
                                            productAttribute.userValues = self.translate(
                                                productAttribute.userValues,
                                                TRANSLATION_FIELDS.ATTR_NAME
                                            );
                                         }
                                         // translates each of the attribute value labels
                                         if (productAttribute.values && productAttribute.values.length > 0) {
                                            productAttribute
                                                .values
                                                .map(function(value) {
                                                    value.label = self.translate(
                                                        value.label,
                                                        TRANSLATION_FIELDS.ATTR_VAL
                                                    );
                                                return value;
                                             });
                                         }
                                     }
                                 return productAttribute;
                             });
                        }
                     itemObject.i18TranslationComplete = true;
                 }
                 // translates each lineItems product 
                 if (itemObject.lineItems) {
                    lineItemsObject = itemObject.lineItems;
                    lineItemsIterator(lineItemsObject);
                 }
                 // translates each virtual products
                 if (itemObject.productGroups) {
                    virtualItemIterator(itemObject);
                 }

                 return itemObject;
             };

         }]);

},{}]},{},[1]);
})();

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
var app = angular.module('thorIntegration', ['vlocity']);

/*TODO migrate external dependencies from main.js */
// require("./xom.scss");
// require("angular-lightning/app/scripts/fields/field-datepicker"); // TODO: get rid of this dependency
// require('ng-infinite-scroll');
// require('ng-jsoneditor');
// require('jsoneditor/dist/jsoneditor.css');
// require('./modules/planView/PlanView');
require('./modules/thorintegration/factory/thorIntegrationService.js');
require('./modules/thorintegration/factory/metadataService.js');
require('./modules/thorintegration/factory/activeRecordService.js');
/* TODO: migrate Services, Directives, Constants  */
    // Services
    // app.factory('metadataService', metadataService) // +
    // .factory('activeRecordService', activeRecordService)
    // .factory('authenticationService', authenticationService)
    // .factory('notificationService', notificationService)
    // .factory('errorHandlingService', errorHandlingService)
    // .factory('sfdcCanvasService', sfdcCanvasService) // not required
    // // Navigation directives
    // .directive('navigationHeader', navigationHeaderDirective)
    // .directive('breadcrumbs', breadcrumbsDirective)
    // .directive("breadcrumb", breadcrumbDirective)
    // .directive('objectBreadcrumbs', objectBreadcrumbsDirective)
    // .directive('objectTypeBreadcrumbs', objectTypeBreadcrumbsDirective)
    // .directive('globalSearch', globalSearchDirecrive)
    // // Facets
    // .directive('facet', facetDirective)
    // .directive('facet4412964684870411902', parametersFacetDirective)
    // .directive('parametersEditFacet', parametersEditFacetDirective)
    // .directive('facet4412964684870431356', referenceFacetDirective)
    // .directive('referenceFacetRow', referenceFacetRowDirective)
    // .directive('facet4412964684870431361', childrenFacetDirective)
    // .directive('childrenFacetRow', childrenFacetRowDirective)
    // .directive('attributeEditFacet', attributeEditFacetDirective)
    // .directive('objectTypeEditFacet', objectTypeEditFacetDirective)
    // .directive('facet4412964684871406204', orchestrationPlanViewFacetDirective)
    // .directive('facet4412964684871512704', backreferenceFacetDirective)
    // // Buttons
    // .directive('actionButton', buttonDirective)
    // .directive('button4412964684871522945', completeOrchItemButtonDirective)
    // .directive('button976718169185976322', clearSecurityCacheButtonDirective)
    // .directive('button4412964684871837317', systemUpAndUnholdOrchItemsButtonDirective)
    // // Attributes
    // .directive("attributeValue", attributeValueDirective)
    // .directive("attributeField", attributeFieldDirective)
    // .directive("textValue", textValueDirective)
    // .directive("textField", textFieldDirective)
    // .directive("datetimeValue", datetimeValueDirective)
    // .directive("datetimeField", datetimeFieldDirective)
    // .directive('objectTypeValue', objectTypeValueDirective)
    // .directive('objectTypeField', objectTypeFieldDirective)
    // .directive('referenceValue', referenceValueDirective)
    // .directive('referenceField', referenceFieldDirective)
    // .directive('referenceSingleValue', referenceSingleValueDirective)
    // .directive('referenceSingleField', referenceSingleFieldDirective)
    // .directive('referenceToAttributeValue', referenceToAttributeValueDirective)
    // .directive('referenceToAttributeField', referenceToAttributeFieldDirective)
    // .directive('referenceToPicklistValue', referenceToPicklistValueDirective)
    // .directive('referenceToPicklistField', referenceToPicklistFieldDirective)
    // .directive('picklistValue', picklistValueDirective)
    // .directive('picklistField', picklistFieldDirective)
    // .directive('booleanValue', booleanValueDirective)
    // .directive('booleanField', booleanFieldDirective)
    // .directive('jsonValue', jsonValueDirective)
    // .directive('jsonField', jsonFieldDirective)
    // .constant('DateConfig', {
    //     numWeeksShown: 5,
    //     dateFormat: 'D MMM YYYY',
    //     dateModel: 'x',
    //     dateTimeFormat: 'D MMM YYYY HH:mm:ss',
    //     datetimeModel: 'x'
    // });


},{"./modules/thorintegration/factory/activeRecordService.js":2,"./modules/thorintegration/factory/metadataService.js":3,"./modules/thorintegration/factory/thorIntegrationService.js":4}],2:[function(require,module,exports){
angular.module('thorIntegration').factory('activeRecordService', function($http, $q){
    let activeRecordService = {
        recordsById: {},
        recordsByParentId: {},
        childrenLoadedForParentId: {},
        childrenLoadedForParentAndObjectTypeId: {},

        clearCache: function clearCache(){
            this.recordsById = {};
            this.recordsByParentId = {};
            this.childrenLoadedForParentId = {};
            this.childrenLoadedForParentAndObjectTypeId = {};
        },

        clearCacheForObjectOnDeletion: function clearCacheForObjectOnDeletion(object){
            delete this.recordsById[object.id];
            delete this.childrenLoadedForParentId[object.parentId];
            for(let cacheKey in this.childrenLoadedForParentAndObjectTypeId){
                if(this.childrenLoadedForParentAndObjectTypeId.hasOwnProperty(cacheKey)){
                    if(cacheKey.includes(object.parentId)){
                        delete this.childrenLoadedForParentAndObjectTypeId[cacheKey];
                    }
                }
            }
            for(let childRecord in this.recordsByParentId[object.parentId]){
                if(childRecord.id == object.id){
                    let index = this.recordsByParentId[object.parentId].indexOf(childRecord);
                    this.recordsByParentId[object.parentId].splice(index, 1);
                }
            }
        } ,

        remember: function remember(object){
            this.recordsById[object.id] = object;
            if(object.parentId){
                if(!this.recordsByParentId[object.parentId]){
                    this.recordsByParentId[object.parentId] = [];
                }
                if(!this.containsObject(this.recordsByParentId[object.parentId], object)){
                    this.recordsByParentId[object.parentId].push(object);
                }
            }
        },

        containsObject: function containsObject(array, object){
            for(let existingObject in array){
                if(existingObject.id == object.id) return true;
            }
            return false;
        },

        deleteObjects: function deleteObjects(objects){
            let deleteRequests = [];
            for(let object in objects){
                this.clearCacheForObjectOnDeletion(object);
                deleteRequests.push($http({method: 'DELETE', url: uiServiceUrl + '/objects/'+object.id, withCredentials: true}));
            }
            return $q.all(deleteRequests);
        },

        getRecordById: function getRecordById(recordId){
            return $http({method: 'GET', url: uiServiceUrl + '/objects/show/'+recordId, withCredentials: true})
                .then(function success(response){
                    this.remember(response.data);
                    return response.data;
                }.bind(this));
        },

        getCachedRecordById: function getCachedRecordById(recordId){
            let cache = this.recordsById;
            if(cache.hasOwnProperty(recordId)){
                return $q(function(resolve, reject){
                    resolve(cache[recordId])
                });
            }else{
                return this.getRecordById(recordId);
            }
        },

        // getRecordsByParentId: function getRecordsByParentId(parentId, limit, infset, objectTypeId){
        //     let url = URI('/objects/'+parentId+'/children');
        //     if(offset > 0) url.query({'offset': offset});
        //     if(objectTypeId){
        //         url.query({'objectTypeId': objectTypeId});
        //         return $http({method: 'GET', url: url.toString()})
        //             .then(function success(response){
        //                 if(response.data.length < limit){
        //                     this.childrenLoadedForParentAndObjectTypeId[parentId+'|'+objectTypeId] = true;
        //                 }
        //                 for(let record of response.data){
        //                     this.remember(record);
        //                 }
        //                 return response.data;
        //             }.bind(this));
        //     }else{
        //         return $http({method: 'GET', url: url.toString()})
        //             .then(function success(response){
        //                 if(response.data.length < limit){
        //                     this.childrenLoadedForParentId[parentId] = true;
        //                 }
        //                 for(let record of response.data){
        //                     this.remember(record);
        //                 }
        //                 return response.data;
        //             }.bind(this));
        //     }
        // },

        getCachedRecordsByParentId: function getCachedRecordsByParentId(parentId, limit, offset, objectTypeId){
            if(this.childrenLoadedForParentId[parentId]
                || this.childrenLoadedForParentAndObjectTypeId[parentId+"|"+objectTypeId]
            ){
                return $q(function(resolve, reject){
                    let returnValue = [];
                    if(objectTypeId){
                        if(this.recordsByParentId[parentId]){
                            for(let record in this.recordsByParentId[parentId]){
                                if(record.objectTypeId == objectTypeId){
                                    returnValue.push(record);
                                }
                            }
                        }
                    }else{
                        returnValue = this.recordsByParentId[parentId];
                    }
                    resolve(returnValue);
                }.bind(this));
            }else{
                return this.getRecordsByParentId(parentId, limit, offset, objectTypeId);
            }
        },

        getRecordHierarchy: function getRecordHierarchy(recordId){
            let returnValue = [];
            let nextRecordId = recordId;

            // fetching hierarchy from cache while it exists there
            while(nextRecordId && this.recordsById.hasOwnProperty(nextRecordId)){
                let currentRecord = this.recordsById[nextRecordId];
                returnValue.unshift(currentRecord);
                if(currentRecord.parentId){
                    nextRecordId = currentRecord.parentId;
                }else{
                    nextRecordId = null;
                }
            }

            // fetching the missing remainder
            if(nextRecordId){
                return $http({
                    method: 'GET', url: uiServiceUrl + '/objects/'+nextRecordId+'/hierarchy', withCredentials: true
                }).then(function success(response){
                    for(let record in response.data){
                        this.remember(record);
                    }
                    returnValue.unshift(response.data);
                    return returnValue;
                }.bind(this));
            }else{
                return $q(function(resolve, reject){
                    resolve(returnValue);
                });
            }
        }
// ,
        // getBackreferences: function getBackreferences(referencedObjectId, attributeId, objectTypeId){
        //     // TODO: limit and offset parameters
        //     let url = URI('/objects/'+referencedObjectId+'/backreferences');
        //     if(attributeId){
        //         url.addQuery({'attributeId': attributeId});
        //     }
        //     if(objectTypeId){
        //         url.addQuery({'objectTypeId': objectTypeId});
        //     }

        //     return $http({method: 'GET', url: url.toString()})
        //         .then(function success(response){
        //             for(let record of response.data){
        //                 this.remember(record);
        //             }
        //             return response.data;
        //         }.bind(this));
        // }
    };
    console.log('activeRecordService is initialized');
    return activeRecordService;
});
},{}],3:[function(require,module,exports){
angular.module('thorIntegration').factory('metadataService', function($http, $q, $timeout){
    let metadataService = {
    	//uiServiceUrl: '',
        objectTypesById: {},
        objectTypesByIdPromises: {},
        objectTypesByParentId: {},
        attributesById: {},
        attributesByIdPromises: {},
        allObjectTypesAreLoaded: false,
        allObjectTypesAreBeingLoaded: false,
        allObjectTypesLoadingPromise: null,
        allAttributesAreLoaded: false,
        allAttributesAreBeingLoaded: false,
        allAttributesLoadingPromise: null,
        picklistsById: {},
        allPicklistsAreLoaded: false,
        allPicklistsAreBeingLoaded: false,
        allPicklistsLoadingPromise: null,
        attributeTypes: [],

        clearCache: function clearCache(){
            this.objectTypesById = {};
            this.objectTypesByIdPromises = {};
            this.objectTypesByParentId = {};
            this.attributesById = {};
            this.attributesByIdPromises = {};
            this.allObjectTypesAreLoaded = false;
            this.attributeTypes = [];
            this.picklistsById = {};
            this.allPicklistsAreLoaded = false;
            this.allPicklistsAreBeingLoaded = false;
            this.allPicklistsLoadingPromise = null;
        },

        rememberObjectType: function rememberObjectType(objectType){
            this.objectTypesById[objectType.id] = objectType;
            if(!this.objectTypesByParentId[objectType.parentId]){
                this.objectTypesByParentId[objectType.parentId] = [];
            }

            let childAlreadyExists = false;
            for(existingChild in this.objectTypesByParentId[objectType.parentId]){
                if(existingChild.id == objectType.id) childAlreadyExists = true;
            }
            if(!childAlreadyExists) this.objectTypesByParentId[objectType.parentId].push(objectType);
        },

        rememberAttribute: function rememberAttribute(attribute){
            this.attributesById[attribute.id] = attribute;
        },

        rememberPicklist: function(picklist){
            this.picklistsById[picklist.id] = picklist;
        },

        getObjectTypeById: function getObjectTypeById(objectTypeId){
            let objectTypesById = this.objectTypesById;
            if(objectTypesById.hasOwnProperty(objectTypeId)) {
                return $q(function (resolve, reject) {
                    resolve(objectTypesById[objectTypeId])
                });
            }else if(this.objectTypesByIdPromises.hasOwnProperty(objectTypeId)){
                return this.objectTypesByIdPromises[objectTypeId];
            }else{
                this.objectTypesByIdPromises[objectTypeId] = $http({method: 'GET', url: uiServiceUrl + '/objectTypes/show/'+ objectTypeId, withCredentials: true})
                    .then(function success(response){
                        this.rememberObjectType(response.data);
                        delete this.objectTypesByIdPromises[objectTypeId];
                        return response.data;
                    }.bind(this));
                return this.objectTypesByIdPromises[objectTypeId];
            }
        },

        getAttributeById: function getAttributeById(attributeId){
            if(this.attributesById.hasOwnProperty(attributeId)) {
                return $q(function (resolve, reject) {
                    resolve(this.attributesById[attributeId]);
                }.bind(this));
            }else if(this.attributesByIdPromises.hasOwnProperty(attributeId)){
                return this.attributesByIdPromises[attributeId];
            }else{
                this.attributesByIdPromises[attributeId] = $http({method: 'GET', url: uiServiceUrl + '/attributes/' + attributeId, withCredentials: true})
                    .then(function success(response){
                        this.rememberAttribute(response.data);
                        return response.data;
                    }.bind(this));
                return this.attributesByIdPromises[attributeId];
            }
        },

        getAllAttributes: function getAllAttributes(){
            if(this.allAttributesAreLoaded) {
                return $q(function (resolve, reject) {resolve(this.attributesById)}.bind(this));
            }else if(this.allAttributesAreBeingLoaded){
                return this.allAttributesLoadingPromise;
            }else{
                this.allAttributesAreBeingLoaded = true;
                this.allAttributesLoadingPromise = $http({method: 'GET', url: uiServiceUrl + '/attributes/list', withCredentials: true})
                    .then(function success(response){
                        this.allAttributesAreBeingLoaded = false;
                        this.allAttributesAreLoaded = true;
                        for(attribute in response.data){
                            this.rememberAttribute(attribute);
                        }
                        return this.attributesById;
                    }.bind(this));
                return this.allAttributesLoadingPromise;
            }
        },

        getAttributesBySearchString: function getAttributesBySearchString(searchString){
            return this.getAllAttributes()
                .then(function(attributesById){
                    var searchResults = [];
                    for(let attributeId in attributesById){
                        if(attributesById.hasOwnProperty(attributeId)){
                            let attribute = attributesById[attributeId];
                            if(
                                attribute.id == searchString ||
                                attribute.name.toLowerCase().indexOf(searchString.toLowerCase()) != -1
                            ){
                                searchResults.push(attribute);
                            }
                        }
                    }
                    return searchResults;
                });
        },

        getDerivedObjectTypes: function getDerivedObjectTypes(parentObjectTypeId){
            if(parentObjectTypeId == undefined) parentObjectTypeId = null;
            if(this.allObjectTypesAreLoaded) {
                return $q(function (resolve, reject) {
                    resolve(this.objectTypesByParentId[parentObjectTypeId]);
                }.bind(this));
            }else if(this.allObjectTypesAreBeingLoaded){
                return this.allObjectTypesLoadingPromise;
            }else{
                this.allObjectTypesAreBeingLoaded = true;
                this.allObjectTypesLoadingPromise = $http({method: 'GET', url: uiServiceUrl + '/objectTypes/list', withCredentials: true})
                    .then(function success(response){
                        this.allObjectTypesAreBeingLoaded = false;
                        this.allObjectTypesAreLoaded = true;
                        for(objectType in response.data){
                            this.rememberObjectType(objectType);
                        }
                        return this.objectTypesByParentId[parentObjectTypeId];
                    }.bind(this));
                return this.allObjectTypesLoadingPromise;
            }
        },

        getAllObjectTypes: function getAllObjectTypes(){
            if(this.allObjectTypesAreLoaded) {
                return $q(function (resolve, reject) {resolve(this.objectTypesById)}.bind(this));
            }else if(this.allObjectTypesAreBeingLoaded){
                return this.allObjectTypesLoadingPromise;
            }else{
                this.allObjectTypesAreBeingLoaded = true;
                this.allObjectTypesLoadingPromise = $http({method: 'GET', url: uiServiceUrl + '/objectTypes/list', withCredentials: true})
                    .then(function success(response){
                        this.allObjectTypesAreBeingLoaded = false;
                        this.allObjectTypesAreLoaded = true;
                        for(objectType in response.data){
                            this.rememberObjectType(objectType);
                        }
                        return this.objectTypesById;
                    }.bind(this));
                return this.allObjectTypesLoadingPromise;
            }
        },

        getObjectTypesBySearchString: function getObjectTypesBySearchString(searchString){
            return this.getAllObjectTypes()
                .then(function(objectTypesById){
                    var searchResults = [];
                    for(let objectTypeId in objectTypesById){
                        if(objectTypesById.hasOwnProperty(objectTypeId)){
                            let objectType = objectTypesById[objectTypeId];
                            if(
                                objectType.id == searchString ||
                                objectType.name.toLowerCase().indexOf(searchString.toLowerCase()) != -1
                            ){
                                searchResults.push(objectType);
                            }
                        }
                    }
                    return searchResults;
                });
        },

        getObjectTypesHierarchy: function getObjectTypesHierarchy(leafId){
            var addWithParents = function(leafId, objectTypesById){
                let returnValue = [];
                let leaf = objectTypesById[leafId];
                if(leaf){
                    if(leaf.parentId){
                        returnValue = addWithParents(leaf.parentId, objectTypesById);
                    }
                    returnValue.push(leaf);
                }
                return returnValue;
            };

            return this.getAllObjectTypes()
                .then(function(objectTypesById){
                    let searchResults = [];
                    let leaf = objectTypesById[leafId];
                    if(leaf){
                        searchResults = addWithParents(leafId, objectTypesById);
                    }
                    return searchResults;
                });
        },

        getAttributeTypes: function getAttributeTypes(){
            if(this.attributeTypes.length > 0){
                return $q(function(resolve, reject){
                    resolve(this.attributeTypes);
                }.bind(this));
            }else{
                return $http({method: 'GET', url: uiServiceUrl + '/attributes/types'})
                    .then(function success(response){
                        this.attributeTypes = response.data;
                        return response.data;
                    }.bind(this));
            }
        },

        getAllPicklists: function(){
            if(this.allPicklistsAreLoaded) {
                return $q(function (resolve, reject) {resolve(this.picklistsById)}.bind(this));
            }else if(this.allPicklistsAreLoaded){
                return this.allPicklistsLoadingPromise;
            }else{
                this.allPicklistsAreLoaded = true;
                this.allPicklistsLoadingPromise = $http({method: 'GET', url: uiServiceUrl + '/picklists/list', withCredentials: true})
                    .then(function success(response){
                        this.allPicklistsAreLoaded = false;
                        this.allPicklistsAreLoaded = true;
                        for(picklist in response.data){
                            this.rememberPicklist(picklist);
                        }
                        return this.picklistsById;
                    }.bind(this));
                return this.allPicklistsLoadingPromise;
            }
        },

        getPicklistsBySearchString: function(searchString){
            return this.getAllPicklists()
                .then(function(picklistsById){
                    var searchResults = [];
                    for(let picklistId in picklistsById){
                        if(picklistsById.hasOwnProperty(picklistId)){
                            let picklist = picklistsById[picklistId];
                            if(
                                picklist.id == searchString ||
                                picklist.name.toLowerCase().indexOf(searchString.toLowerCase()) != -1
                            ){
                                searchResults.push(picklist);
                            }
                        }
                    }
                    return searchResults;
                });
        },

        getPicklistById: function(id){
            return this.getAllPicklists()
                .then(function(picklistsById){
                    return picklistsById[id];
                });
        },

        deleteAttributes: function deleteAttributes(attributes){
            let deleteRequests = [];
            for(let attribute in attributes){
                deleteRequests.push($http({method: 'DELETE', url: uiServiceUrl + '/attributes/'+attribute.id, withCredentials: true}));
            }
            return $q.all(deleteRequests);
        },

        deleteObjectTypes: function deleteObjectTypes(objectTypes){
            let deleteRequests = [];
            for(let objectType in objectTypes){
                deleteRequests.push($http({method: 'DELETE', url: uiServiceUrl + '/objectTypes/'+objectType.id, withCredentials: true}));
            }
            return $q.all(deleteRequests);
        },

    };
    console.log('thorMetadataService is initialised');
    return metadataService;
});
},{}],4:[function(require,module,exports){
// service stores config data e.g. thor Url and authenticates external requests to thor platform
angular.module('thorIntegration').factory('thorIntegrationService', function($q, $timeout){
    let thorIntegrationService = {
        uiMode: undefined,
        uiServiceUrl: undefined,
        isOffAuthenticationInProgress: false,
        loginWindow: undefined,
        /* getOffplatformUrl and isOffplatformMode is a caching proxy to corresponding remoteActions functions */
        getOffplatformUrl: function getOffplatformUrl(remoteActionOperations){
            let uiServiceUrl = this.uiServiceUrl;
            if(uiServiceUrl != undefined){ // provide cached UI Service Url
                return $q(function(resolve, reject){
                    resolve(uiServiceUrl)
                });
            } else {
                // fetch uiServiceUrl from server
                return remoteActionOperations['getOffplatformUrl']()
                    .then(function(uiServiceUrl) {
                                return $q(function(resolve, reject){
                                    thorIntegrationService.uiServiceUrl = uiServiceUrl;
                                    resolve(uiServiceUrl);
                                });
                            });
            }
        },
        isOffplatformMode: function isOffplatformMode(remoteActionOperations){
            let uiMode = this.uiMode;
            if(uiMode != undefined){ // provide cached UI Mode
                return $q(function(resolve, reject){
                    resolve(uiMode)
                });
            } else { // fetch uiMode from server
                return remoteActionOperations['isOffplatformMode']()
                            .then(function(uiMode) {
                                return $q(function(resolve, reject){
                                    thorIntegrationService.uiMode = uiMode;
                                    resolve(uiMode);
                                });
                            });
            }
        },
        retryOperationInCaseAuthenticationError: function(operationToRetry, uiServicesUrl, retryAttemptsNumber, callback){
            var attemptsCount = 0;
            if(retryAttemptsNumber){
                // do nothing
            } else {
                retryAttemptsNumber = 3;
            }
            return $q(function(resolve, reject){
                var tryRequest = function(){
                    // console.log('retrying operation. attempt ' + attemptsCount);
                    operationToRetry()
                        .then(function(promiseResult)
                        {
                            resolve(promiseResult);
                        }
                        )
                        .catch(function(response){
                            console.log('Catching response ', response);

                            if (response.status == 401
                                || (response.data != undefined && response.data.exception == 'org.apache.shiro.authc.AuthenticationException'))
                            {
                                    console.error('thorIntegrationService.provideRetryableAuthorizationCatcher: error ', response.data);
                                    if (callback != undefined)
                                    {
                                        callback(response);    
                                    }
                                    // redirect to authentication service in a separate window
                                    if(this.loginWindow == undefined)
                                    {
                                        this.isOffAuthenticationInProgress = true;
                                        this.loginWindow = window.open(uiServicesUrl + '/security/v1/auth/openid/authorize');
                                    }
                                    var checkIfClosed = function()
                                    {
                                        if(this.loginWindow.closed){
                                            this.isOffAuthenticationInProgress = false;
                                            window.location.reload(); // XOM-2370 reloading page to refresh session id for VF page (workaround)
                                            console.log("thorIntegrationService.Authentication window is now closed. Retrying original operation...");
                                            if(attemptsCount < retryAttemptsNumber)
                                                tryRequest();
                                            attemptsCount++;
                                            this.loginWindow = undefined;
                                        }else{
                                            // console.log('Authentication window is in progress...');
                                            $timeout(checkIfClosed, 1000)
                                        }
                                    }
                                    $timeout(checkIfClosed, 1000);
                            } else {
                                // passing the error through the catch chain
                                reject(response);
                            }
                        })
                }
                // call origina operation for the first time
                tryRequest();
            })

        }
    };
    console.log('thorIntegrationService is initialised');
    return thorIntegrationService;
});
},{}]},{},[1]);
})();

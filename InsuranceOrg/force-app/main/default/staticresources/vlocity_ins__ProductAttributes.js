(function(){var fileNsPrefix=function(){"use strict";var scripts=document.getElementsByTagName("script");var lastScript=scripts[scripts.length-1];var scriptName=lastScript.src;var parts=scriptName.split("/");var thisScript=parts[parts.length-1];if(thisScript===""){thisScript=parts[parts.length-2]}var lowerCasePrefix=thisScript.indexOf("__")==-1?"":thisScript.substring(0,thisScript.indexOf("__")+2);lowerCasePrefix=lowerCasePrefix===""&&localStorage.getItem("nsPrefix")?localStorage.getItem("nsPrefix"):lowerCasePrefix;if(lowerCasePrefix!==""){lowerCasePrefix=/__$/.test(lowerCasePrefix)?lowerCasePrefix:lowerCasePrefix+"__"}if(lowerCasePrefix.length===0){return function(){lowerCasePrefix=window.nsPrefix?window.nsPrefix:lowerCasePrefix;if(lowerCasePrefix!==""){lowerCasePrefix=/__$/.test(lowerCasePrefix)?lowerCasePrefix:lowerCasePrefix+"__"}return lowerCasePrefix}}else{var resolvedNs=null;return function(){if(resolvedNs){return resolvedNs}try{var tofind=lowerCasePrefix.replace("__","");var name;var scanObjectForNs=function(object,alreadySeen){if(object&&object!==window&&alreadySeen.indexOf(object)==-1){alreadySeen.push(object);Object.keys(object).forEach(function(key){if(key==="ns"){if(typeof object[key]==="string"&&object[key].toLowerCase()===tofind){name=object[key]+"__";return false}}if(Object.prototype.toString.call(object[key])==="[object Array]"){object[key].forEach(function(value){var result=scanObjectForNs(value,alreadySeen);if(result){name=result;return false}})}else if(typeof object[key]=="object"){var result=scanObjectForNs(object[key],alreadySeen);if(result){name=result;return false}}if(name){return false}});if(name){return name}}};if(typeof Visualforce!=="undefined"){scanObjectForNs(Visualforce.remoting.Manager.providers,[])}else{return lowerCasePrefix}if(name){return resolvedNs=name}else{return resolvedNs=lowerCasePrefix}}catch(e){return lowerCasePrefix}}}}();var fileNsPrefixDot=function(){var prefix=fileNsPrefix();if(prefix.length>1){return prefix.replace("__",".")}else{return prefix}};
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('productattributes', ['vlocity', 'mgcrea.ngStrap.tooltip'])
.config(['remoteActionsProvider', function(remoteActionsProvider) {
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}])
.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

require('./modules/productattributes/controller/ProductAttributesController.js');

},{"./modules/productattributes/controller/ProductAttributesController.js":2}],2:[function(require,module,exports){
angular.module('productattributes')
.controller('ProductAttributesController', ['$scope', '$location', 'remoteActions',
    function($scope, $location, remoteActions) {
        $scope.nsp = fileNsPrefix();
        $scope.productId = $location.search().id;
        $scope.baseProductId = $location.search().baseProductId;
        $scope.rootProductId = $location.search().rootProductId;
        $scope.contextId = $scope.rootProductId;
        $scope.productChildId = $location.search().pci;
        $scope.mode = $location.search().mode;
        if ($scope.mode === undefined) {
            $scope.mode = 'edit';
        }
        $scope.attrList = [];
        $scope.attributeMap = {};
        $scope.categoryMap = {};
        $scope.allCategories = [];
        $scope.categories = [];
        $scope.refreshAllAttrs = true;
        $scope.allAttributes = [];
        $scope.objectFields = null;
        $scope.objectPicklists = null;
        $scope.showAttrAssgn = false;
        $scope.showAttrEdit = false;
        $scope.showAttrOverride = false;
        $scope.picklists = [];

        $scope.getCategories = function() {
            remoteActions.getAllCategories().then(function(results) {
                console.log('all categories: ', results);
                $scope.allCategories = [];
                $scope.categoryMap = {};
                angular.forEach(results, function(item) {
                    $scope.allCategories.push(item);
                    $scope.categoryMap[item.Id] = item;
                });
            });

            $scope.getAssignedAttributes();
        };

        $scope.getAssignedAttributes = function() {
            remoteActions.getAssignedAttributes($scope.productId, '').then(function(results) {
                var category;
                var prevCatId = '';
                $scope.attrList = [];
                $scope.categories = [];
                $scope.attributeMap = {};
                angular.forEach(results, function(item, idx) {
                    var dataType = item[$scope.nsp + 'ValueDataType__c'];
                    if (dataType === 'Picklist' || dataType === 'Multi Picklist') {
                        item.isTypePicklist = true;
                        if (item[$scope.nsp + 'UIDisplayType__c'] === undefined) {
                            item[$scope.nsp + 'UIDisplayType__c'] = 'Dropdown';
                        }
                    } else {
                        item.isTypePicklist = false;
                    }
                    $scope.attrList.push(item);

                    var attrId = item[$scope.nsp + 'AttributeId__c'];
                    $scope.attributeMap[attrId] = item;

                    var catId = item[$scope.nsp + 'AttributeCategoryId__c'];
                    var catName = $scope.categoryMap[catId].Name;
                    var disSeq = $scope.categoryMap[catId][$scope.nsp + 'DisplaySequence__c'];
                    if (prevCatId !== catId) {
                        if (idx !== 0) {
                            $scope.categories.push(category);
                        }
                        category = {
                            id: catId,
                            name: catName,
                            displaySequence: disSeq,
                            attributes: []
                        };
                    }
                    prevCatId = catId;
                    category.attributes.push(item);

                    if (idx === (results.length - 1)) {
                        $scope.categories.push(category);
                    }
                });

                angular.forEach($scope.attrList, function(attr) {
                    var inputMap = {
                        'overriddenObjectId': attr.Id,
                        'contextId': $scope.contextId,
                        'overriddenPCIId': $scope.productChildId,
                        'type': 'Attribute'
                    };
                    var inputMapJSON = JSON.stringify(inputMap);
                    remoteActions.getOverride(inputMapJSON).then(function(res) {
                        console.log('get override: ', res);
                        if (res !== null) {
                            var obj = JSON.parse(res);
                            attr.overrideObj = obj.SObject;
                            attr.overrideDef = obj.OverrideDefinition__c;
                        }
                        $scope.processPicklistItems(attr);
                    });
                });

                if ($scope.attrList.length > 0) {
                    $scope.describeObject($scope.attrList[0].Id);
                }
                console.log('attrList: ', $scope.attrList);
                console.log('categories: ', $scope.categories);
            });
        };

        $scope.describeObject = function(attrId) {
            remoteActions.describeObject(attrId).then(function(results) {
                console.log('describeObject results: ', results);
                $scope.objectFields = results;
            });

            $scope.getObjectPicklists(attrId);
        };

        $scope.getObjectPicklists = function(attrId) {
            remoteActions.getObjectPicklists(attrId).then(function(results) {
                console.log('getObjectPicklists results: ', results);
                $scope.objectPicklists = results;
            });
        };

        $scope.getAllAttributes = function() {
            remoteActions.getAllAttributes().then(function(results) {
                console.log('all attributes: ', results);
                $scope.allAttributes = [];
                angular.forEach(results, function(attr) {
                    if ($scope.attributeMap[attr.Id] === undefined) {
                        $scope.allAttributes.push(attr);
                    }
                });
                $scope.showAttrAssgn = true;
                $scope.refreshAllAttrs = false;
            });
        };

        $scope.openAssgnPanel = function() {
            if ($scope.refreshAllAttrs) {
                $scope.getAllAttributes();
            } else {
                $scope.showAttrAssgn = true;
            }
        };

        $scope.closeAssgnPanel = function() {
            $scope.showAttrAssgn = false;
            $scope.selectedAttrId = '';
        };

        $scope.assignAttribute = function(attributeId, event) {
            if (event) {
                event.currentTarget.disabled = true;
                event.currentTarget.innerText = 'Adding...';
            }
            remoteActions.assignAttribute(attributeId, $scope.productId).then(function(results) {
                console.log('assign attribute: ', results);
                if (event) {
                    event.currentTarget.innerText = 'Added!';
                }
                $scope.refreshAllAttrs = true;
                $scope.getCategories();
            });
        };

        $scope.unassignAttribute = function(attributeId) {
            remoteActions.unassignAttribute(attributeId).then(function(results) {
                console.log('unassign attribute: ', results);
                $scope.refreshAllAttrs = true;
                $scope.getCategories();
            });
        };

        $scope.openPanel = function(attribute) {
            $scope.selectedAttrId = attribute.Id;
            $scope.panelTitle = attribute[$scope.nsp + 'AttributeDisplayName__c'];
            if ($scope.mode === 'edit') {
                $scope.openEditPanel(attribute);
            }
            if ($scope.mode === 'override') {
                $scope.openOverridePanel(attribute);
            }
        };

        $scope.openEditPanel = function(attribute) {
            remoteActions.getObject(attribute.Id).then(function(result) {
                $scope.selectedAttr = result;
                var dataType = $scope.selectedAttr[$scope.nsp + 'ValueDataType__c'];
                if (dataType === 'Picklist' || dataType === 'Multi Picklist') {
                    $scope.selectedAttr.isTypePicklist = true;
                    if ($scope.selectedAttr[$scope.nsp + 'UIDisplayType__c'] === undefined) {
                        $scope.selectedAttr[$scope.nsp + 'UIDisplayType__c'] = 'Dropdown';
                    }
                    $scope.setPicklistItems($scope.selectedAttr);
                    $scope.processPicklistItems($scope.selectedAttr);
                } else {
                    $scope.selectedAttr.isTypePicklist = false;
                }
                console.log('selected attribute: ', $scope.selectedAttr);
                $scope.showAttrEdit = true;
            });
        };

        $scope.closeEditPanel = function() {
            $scope.showAttrEdit = false;
            $scope.selectedAttrId = '';
        };

        $scope.openOverridePanel = function(attribute) {
            var inputMap = {
                'overriddenObjectId': attribute.Id,
                'contextId': $scope.contextId,
                'overriddenPCIId': $scope.productChildId,
                'type': 'Attribute'
            };
            var inputMapJSON = JSON.stringify(inputMap);
            remoteActions.getObject(attribute.Id).then(function(result) {
                $scope.selectedAttr = result;
                var dataType = $scope.selectedAttr[$scope.nsp + 'ValueDataType__c'];
                if (dataType === 'Picklist' || dataType === 'Multi Picklist') {
                    $scope.selectedAttr.isTypePicklist = true;
                    if ($scope.selectedAttr[$scope.nsp + 'UIDisplayType__c'] === undefined) {
                        $scope.selectedAttr[$scope.nsp + 'UIDisplayType__c'] = 'Dropdown';
                    }
                } else {
                    $scope.selectedAttr.isTypePicklist = false;
                }
                console.log('selected attribute: ', $scope.selectedAttr);

                remoteActions.getOverride(inputMapJSON).then(function(res) {
                    console.log('get override: ', res);
                    if (res !== null) {
                        var obj = JSON.parse(res);
                        $scope.selectedAttr.overrideObj = obj.SObject;
                        $scope.selectedAttr.overrideDef = obj.OverrideDefinition__c;
                    }
                    $scope.processPicklistItems($scope.selectedAttr);
                    $scope.showAttrOverride = true;
                });
            });
        };

        $scope.closeOverridePanel = function() {
            $scope.showAttrOverride = false;
            $scope.selectedAttrId = '';
        };

        $scope.saveAttribute = function(event) {
            var originalText;
            if (event) {
                originalText = event.currentTarget.innerText;
                event.currentTarget.disabled = true;
                event.currentTarget.innerText = 'Saving...';
            }

            $scope.selectedAttr[$scope.nsp + 'DefaultPicklistValueId__c'] = $scope.selectedAttr.defaultPicklistItemId;
            var updatedObj = {};
            for (var key in $scope.selectedAttr) {
                if (key !== '$$hashKey' && key !== 'isTypePicklist' && key !== 'defaultPicklistItemId') {
                    updatedObj[key] = $scope.selectedAttr[key];
                }
            }
            remoteActions.saveAttribute(updatedObj).then(function(results) {
                console.log('save attribute: ', results);
                if (event) {
                    event.currentTarget.innerText = 'Saved!';
                    setTimeout(function() {
                        event.currentTarget.innerText = originalText;
                        event.currentTarget.disabled = false;
                    }, 2000);
                }
                $scope.getCategories();
            });
        };

        $scope.createOverride = function() {
            var inputMap = {
                'overriddenObjectId': $scope.selectedAttr.Id,
                'contextId': $scope.contextId,
                'overriddenPCIId': $scope.productChildId,
                'type': 'Attribute'
            };
            var inputMapJSON = JSON.stringify(inputMap);
            console.log('INPUT MAP: ', inputMap);
            remoteActions.createOverride(inputMapJSON).then(function(result) {
                console.log('create override: ', result);
                var obj = JSON.parse(result);
                $scope.selectedAttr.overrideObj = obj.SObject;
                $scope.selectedAttr.overrideDef = obj.OverrideDefinition__c;
                $scope.processPicklistItems($scope.selectedAttr);
            });
        };

        $scope.saveOverride = function(event) {
            var originalText;
            if (event) {
                originalText = event.currentTarget.innerText;
                event.currentTarget.disabled = true;
                event.currentTarget.innerText = 'Saving...';
            }

            var excludedIds = [];
            angular.forEach($scope.picklistItemMap[$scope.selectedAttr[$scope.nsp + 'PicklistId__c']], function(item) {
                if (item.excluded) {
                    excludedIds.push(item.Id);
                }
            });
            $scope.selectedAttr.overrideObj[$scope.nsp + 'ExcludedPicklistValues__c'] = excludedIds.join(',');
            $scope.selectedAttr.overrideObj[$scope.nsp + 'DefaultPicklistValueId__c'] = $scope.selectedAttr.overrideObj.defaultPicklistItemId;
            var tmpDefaultPicklistItemId = $scope.selectedAttr.overrideObj.defaultPicklistItemId;
            var tmpIsTypePicklist = $scope.selectedAttr.overrideObj.isTypePicklist;
            delete $scope.selectedAttr.overrideDef.attributes;
            delete $scope.selectedAttr.overrideObj.attributes;
            delete $scope.selectedAttr.overrideObj.defaultPicklistItemId;
            delete $scope.selectedAttr.overrideObj.isTypePicklist;

            var inputMap = {
                'overriddenObjectId': $scope.selectedAttr.Id,
                'contextId': $scope.contextId,
                'overriddenPCIId': $scope.productChildId,
                'type': 'Attribute',
                'sObject': JSON.stringify($scope.selectedAttr.overrideObj),
                'overrideDefinition': JSON.stringify($scope.selectedAttr.overrideDef)
            };
            var inputMapJSON = JSON.stringify(inputMap);
            console.log('INPUT MAP: ', inputMap);
            $scope.selectedAttr.overrideObj.defaultPicklistItemId = tmpDefaultPicklistItemId;
            $scope.selectedAttr.overrideObj.isTypePicklist = tmpIsTypePicklist;
            remoteActions.saveOverride(inputMapJSON).then(function(result) {
                console.log('save override: ', result);
                if (event) {
                    event.currentTarget.innerText = 'Saved!';
                    setTimeout(function() {
                        event.currentTarget.innerText = originalText;
                        event.currentTarget.disabled = false;
                    }, 2000);
                }
                $scope.getCategories();
            });
        };

        $scope.deleteOverride = function() {
            delete $scope.selectedAttr.overrideDef.attributes;
            delete $scope.selectedAttr.overrideObj.attributes;
            delete $scope.selectedAttr.overrideObj.defaultPicklistItemId;
            delete $scope.selectedAttr.overrideObj.isTypePicklist;

            var inputMap = {
                'contextId': $scope.contextId,
                'overriddenPCIId': $scope.productChildId,
                'type': 'Attribute',
                'overridingObjectId': $scope.selectedAttr.overrideObj.Id,
                'overrideDefinitionId': $scope.selectedAttr.overrideDef.Id
            };
            var inputMapJSON = JSON.stringify(inputMap);
            console.log('INPUT MAP: ', inputMap);
            remoteActions.deleteOverride(inputMapJSON).then(function(result) {
                console.log('delete override: ', result);
                delete $scope.selectedAttr.overrideDef;
                delete $scope.selectedAttr.overrideObj;
                $scope.getCategories();
            });
        };

        $scope.setPicklistItems = function(attr) {
            $scope.picklistItems = $scope.picklistItemMap[attr[$scope.nsp + 'PicklistId__c']];
            attr.defaultPicklistItemId = (attr[$scope.nsp + 'DefaultPicklistValueId__c'] || '');
            for (var i = 0; i < $scope.picklistItems.length; i++) {
                var pItem = $scope.picklistItems[i];
                if (attr.defaultPicklistItemId === '' && pItem[$scope.nsp + 'IsDefault__c']) {
                    attr.defaultPicklistItemId = pItem.Id;
                    break;
                }
            }
        };

        $scope.processPicklistItems = function(attr) {
            attr.defaultPicklistItemId = (attr[$scope.nsp + 'DefaultPicklistValueId__c'] || '');

            var excludedIds;
            if (attr.overrideObj) {
                excludedIds = (attr.overrideObj[$scope.nsp + 'ExcludedPicklistValues__c'] || '');
                attr.overrideObj.defaultPicklistItemId = (attr.overrideObj[$scope.nsp + 'DefaultPicklistValueId__c'] || '');
            }
            angular.forEach($scope.picklistItemMap[attr[$scope.nsp + 'PicklistId__c']], function(item) {
                if (attr.defaultPicklistItemId === '' && item[$scope.nsp + 'IsDefault__c']) {
                    attr.defaultPicklistItemId = item.Id;
                }
                if (attr.overrideObj) {
                    item.excluded = (excludedIds.indexOf(item.Id) !== -1);
                    if (attr.overrideObj.defaultPicklistItemId === '' && item[$scope.nsp + 'IsDefault__c']) {
                        attr.overrideObj.defaultPicklistItemId = item.Id;
                    }
                }
            });
        };

        $scope.changeValueDataType = function(attr) {
            var dataType = attr[$scope.nsp + 'ValueDataType__c'];
            if (dataType === 'Picklist' || dataType === 'Multi Picklist') {
                attr.isTypePicklist = true;
                if (attr[$scope.nsp + 'UIDisplayType__c'] === undefined) {
                    attr[$scope.nsp + 'UIDisplayType__c'] = 'Dropdown';
                }
            } else {
                attr.isTypePicklist = false;
            }
        };

        $scope.init = function() {
            $scope.getCategories();

            remoteActions.getAllPicklists().then(function(results) {
                console.log('all picklists: ', results);
                $scope.picklists = results.picklists;
                $scope.picklistItemMap = results.picklistitems;
            });
        };
        $scope.init();
    }
]);

},{}]},{},[1]);

})();
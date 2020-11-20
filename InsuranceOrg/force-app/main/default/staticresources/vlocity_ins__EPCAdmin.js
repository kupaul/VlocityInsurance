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
angular.module('epcadmin', ['vlocity', 'ngSanitize', 'sldsangular'])
.config(['remoteActionsProvider', function(remoteActionsProvider) {
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}])
.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

/* Controllers */
require('./modules/epcadmin/controller/EPCAdminController.js');
require('./modules/epcadmin/controller/NewObjectRecordController.js');
require('./modules/epcadmin/controller/ObjectClassAdminController.js');
require('./modules/epcadmin/controller/ObjectTypeAdminController.js');

/* Directives */
require('./modules/epcadmin/directive/VlocApplicableObjects.js');
require('./modules/epcadmin/directive/VlocAssignAttrsFields.js');
require('./modules/epcadmin/directive/VlocAttachment.js');
require('./modules/epcadmin/directive/VlocAttachments.js');
require('./modules/epcadmin/directive/VlocAttribute.js');
require('./modules/epcadmin/directive/VlocAttributeDefaultValue.js');
require('./modules/epcadmin/directive/VlocAttributeMetadata.js');
require('./modules/epcadmin/directive/VlocAttrFieldBindings.js');
require('./modules/epcadmin/directive/VlocContextActionInfoCard.js');
require('./modules/epcadmin/directive/VlocContextMapping.js');
require('./modules/epcadmin/directive/VlocContextMappings.js');
require('./modules/epcadmin/directive/VlocContextRule.js');
require('./modules/epcadmin/directive/VlocContextRules.js');
require('./modules/epcadmin/directive/VlocQualifyContextRules.js');
require('./modules/epcadmin/directive/VlocContextRuleInfoCard.js');
require('./modules/epcadmin/directive/VlocCustomView.js');
require('./modules/epcadmin/directive/VlocDataTable.js');
require('./modules/epcadmin/directive/VlocEntityFilterInfoCard.js');
require('./modules/epcadmin/directive/VlocFacetDetails.js');
require('./modules/epcadmin/directive/VlocFieldMetadata.js');
require('./modules/epcadmin/directive/VlocFunctionArgument.js');
require('./modules/epcadmin/directive/VlocFunctionArguments.js');
require('./modules/epcadmin/directive/VlocGlobalPricingElements.js');
require('./modules/epcadmin/directive/VlocImgCarousel.js');
require('./modules/epcadmin/directive/VlocLayoutManagement.js');
require('./modules/epcadmin/directive/VlocLayoutElement.js');
require('./modules/epcadmin/directive/VlocObjAttrsFields.js');
require('./modules/epcadmin/directive/VlocObjectClassAttrsFields.js');
require('./modules/epcadmin/directive/VlocVirObjClassAttrs.js');
require('./modules/epcadmin/directive/VlocObjectPricing.js');
require('./modules/epcadmin/directive/VlocObjectPricingElement.js');
require('./modules/epcadmin/directive/VlocObjectPricingElements.js');
require('./modules/epcadmin/directive/VlocObjectType.js');
require('./modules/epcadmin/directive/VlocObjectTypes.js');
require('./modules/epcadmin/directive/VlocObjectTypeStructure.js');
require('./modules/epcadmin/directive/VlocObjField.js');
require('./modules/epcadmin/directive/VlocOfferPricingComponent.js');
require('./modules/epcadmin/directive/VlocPicklistItem.js');
require('./modules/epcadmin/directive/VlocPicklistItems.js');
require('./modules/epcadmin/directive/VlocPriceListEntry.js');
require('./modules/epcadmin/directive/VlocPriceListHierarchy.js');
require('./modules/epcadmin/directive/VlocOfferMigrationComponentMapping.js');
require('./modules/epcadmin/directive/VlocOfferMigrationComponentMappings.js');
require('./modules/epcadmin/directive/VlocPricingElementInfoCard.js');
require('./modules/epcadmin/directive/VlocPricingPlanStep.js');
require('./modules/epcadmin/directive/VlocPricingPlanSteps.js');
require('./modules/epcadmin/directive/VlocPricingVariableBinding.js');
require('./modules/epcadmin/directive/VlocPricingVariableBindings.js');
require('./modules/epcadmin/directive/VlocProdCardinality.js');
require('./modules/epcadmin/directive/VlocProdChildDetails.js');
require('./modules/epcadmin/directive/VlocProdChildItem.js');
require('./modules/epcadmin/directive/VlocProductAttributes.js');
require('./modules/epcadmin/directive/VlocProductAdjustments.js');
require('./modules/epcadmin/directive/VlocDiscountAdjustments.js');
require('./modules/epcadmin/directive/VlocProductPricing.js');
require('./modules/epcadmin/directive/VlocProductStructure.js');
require('./modules/epcadmin/directive/VlocPromotionProduct.js');
require('./modules/epcadmin/directive/VlocDiscountProduct.js');
require('./modules/epcadmin/directive/VlocPromotionProducts.js');
require('./modules/epcadmin/directive/VlocDiscountProducts.js');
require('./modules/epcadmin/directive/VlocRuleCondition.js');
require('./modules/epcadmin/directive/VlocRuleConditions.js');
require('./modules/epcadmin/directive/VlocRuleSetInfoCard.js');
require('./modules/epcadmin/directive/VlocRuleSetRule.js');
require('./modules/epcadmin/directive/VlocRuleSetRules.js');
require('./modules/epcadmin/directive/VlocStandalonePricingElements.js');
require('./modules/epcadmin/directive/VlocSections.js');
require('./modules/epcadmin/directive/VlocJsonEdit.js');
require('./modules/epcadmin/directive/VlocDiscountPricing.js');
require('./modules/epcadmin/directive/VlocDiscountItemGeneralProperties.js');

/* Services */
require('./modules/epcadmin/factory/CpqService.js');
require('./modules/epcadmin/factory/ObjectClassService.js');
require('./modules/epcadmin/factory/ObjectTypeService.js');

/* Templates */
require('./modules/epcadmin/templates/templates.js');

},{"./modules/epcadmin/controller/EPCAdminController.js":2,"./modules/epcadmin/controller/NewObjectRecordController.js":3,"./modules/epcadmin/controller/ObjectClassAdminController.js":4,"./modules/epcadmin/controller/ObjectTypeAdminController.js":5,"./modules/epcadmin/directive/VlocApplicableObjects.js":6,"./modules/epcadmin/directive/VlocAssignAttrsFields.js":7,"./modules/epcadmin/directive/VlocAttachment.js":8,"./modules/epcadmin/directive/VlocAttachments.js":9,"./modules/epcadmin/directive/VlocAttrFieldBindings.js":10,"./modules/epcadmin/directive/VlocAttribute.js":11,"./modules/epcadmin/directive/VlocAttributeDefaultValue.js":12,"./modules/epcadmin/directive/VlocAttributeMetadata.js":13,"./modules/epcadmin/directive/VlocContextActionInfoCard.js":14,"./modules/epcadmin/directive/VlocContextMapping.js":15,"./modules/epcadmin/directive/VlocContextMappings.js":16,"./modules/epcadmin/directive/VlocContextRule.js":17,"./modules/epcadmin/directive/VlocContextRuleInfoCard.js":18,"./modules/epcadmin/directive/VlocContextRules.js":19,"./modules/epcadmin/directive/VlocCustomView.js":20,"./modules/epcadmin/directive/VlocDataTable.js":21,"./modules/epcadmin/directive/VlocDiscountAdjustments.js":22,"./modules/epcadmin/directive/VlocDiscountItemGeneralProperties.js":23,"./modules/epcadmin/directive/VlocDiscountPricing.js":24,"./modules/epcadmin/directive/VlocDiscountProduct.js":25,"./modules/epcadmin/directive/VlocDiscountProducts.js":26,"./modules/epcadmin/directive/VlocEntityFilterInfoCard.js":27,"./modules/epcadmin/directive/VlocFacetDetails.js":28,"./modules/epcadmin/directive/VlocFieldMetadata.js":29,"./modules/epcadmin/directive/VlocFunctionArgument.js":30,"./modules/epcadmin/directive/VlocFunctionArguments.js":31,"./modules/epcadmin/directive/VlocGlobalPricingElements.js":32,"./modules/epcadmin/directive/VlocImgCarousel.js":33,"./modules/epcadmin/directive/VlocJsonEdit.js":34,"./modules/epcadmin/directive/VlocLayoutElement.js":35,"./modules/epcadmin/directive/VlocLayoutManagement.js":36,"./modules/epcadmin/directive/VlocObjAttrsFields.js":37,"./modules/epcadmin/directive/VlocObjField.js":38,"./modules/epcadmin/directive/VlocObjectClassAttrsFields.js":39,"./modules/epcadmin/directive/VlocObjectPricing.js":40,"./modules/epcadmin/directive/VlocObjectPricingElement.js":41,"./modules/epcadmin/directive/VlocObjectPricingElements.js":42,"./modules/epcadmin/directive/VlocObjectType.js":43,"./modules/epcadmin/directive/VlocObjectTypeStructure.js":44,"./modules/epcadmin/directive/VlocObjectTypes.js":45,"./modules/epcadmin/directive/VlocOfferMigrationComponentMapping.js":46,"./modules/epcadmin/directive/VlocOfferMigrationComponentMappings.js":47,"./modules/epcadmin/directive/VlocOfferPricingComponent.js":48,"./modules/epcadmin/directive/VlocPicklistItem.js":49,"./modules/epcadmin/directive/VlocPicklistItems.js":50,"./modules/epcadmin/directive/VlocPriceListEntry.js":51,"./modules/epcadmin/directive/VlocPriceListHierarchy.js":52,"./modules/epcadmin/directive/VlocPricingElementInfoCard.js":53,"./modules/epcadmin/directive/VlocPricingPlanStep.js":54,"./modules/epcadmin/directive/VlocPricingPlanSteps.js":55,"./modules/epcadmin/directive/VlocPricingVariableBinding.js":56,"./modules/epcadmin/directive/VlocPricingVariableBindings.js":57,"./modules/epcadmin/directive/VlocProdCardinality.js":58,"./modules/epcadmin/directive/VlocProdChildDetails.js":59,"./modules/epcadmin/directive/VlocProdChildItem.js":60,"./modules/epcadmin/directive/VlocProductAdjustments.js":61,"./modules/epcadmin/directive/VlocProductAttributes.js":62,"./modules/epcadmin/directive/VlocProductPricing.js":63,"./modules/epcadmin/directive/VlocProductStructure.js":64,"./modules/epcadmin/directive/VlocPromotionProduct.js":65,"./modules/epcadmin/directive/VlocPromotionProducts.js":66,"./modules/epcadmin/directive/VlocQualifyContextRules.js":67,"./modules/epcadmin/directive/VlocRuleCondition.js":68,"./modules/epcadmin/directive/VlocRuleConditions.js":69,"./modules/epcadmin/directive/VlocRuleSetInfoCard.js":70,"./modules/epcadmin/directive/VlocRuleSetRule.js":71,"./modules/epcadmin/directive/VlocRuleSetRules.js":72,"./modules/epcadmin/directive/VlocSections.js":73,"./modules/epcadmin/directive/VlocStandalonePricingElements.js":74,"./modules/epcadmin/directive/VlocVirObjClassAttrs.js":75,"./modules/epcadmin/factory/CpqService.js":76,"./modules/epcadmin/factory/ObjectClassService.js":77,"./modules/epcadmin/factory/ObjectTypeService.js":78,"./modules/epcadmin/templates/templates.js":79}],2:[function(require,module,exports){
angular.module('epcadmin')
.controller('EPCAdminController', ['$scope', '$rootScope', '$compile', '$location', 'remoteActions', '$q', 'cpqService', '$timeout', '$sldsModal', 
    function ($scope, $rootScope, $compile, $location, remoteActions, $q, cpqService, $timeout, $sldsModal) {
        $scope.nsp = fileNsPrefix();
        $scope.objectId = $location.search().id;
        $scope.objectName = $location.search().name;
        $scope.objectAPILabel = $location.search().objAPILabel;
        $scope.objectAPIName = $location.search().objAPIName;
        $scope.showFacetDetail = false;
        $scope.maximizeFacetDetail = false;
        $scope.facets = [];
        $scope.objectFields = null;
        $scope.isFindButtonClicked = false;
        var originalMigrationMethod = null;

        $scope.toggleAccordian = function(index) {
            var section = document.getElementsByClassName('slds-accordion__section')[index];
            $scope.selected = section.classList.contains('slds-is-closed');

            if($scope.selected) {
                section.classList.remove('slds-is-closed');
                section.classList.add('slds-is-open');
            } else {
                section.classList.remove('slds-is-open');
                section.classList.add('slds-is-closed');
            }
        };

        $scope.isProductType = function() { return $scope.objectAPIName === 'Product2'; };

        $scope.getModalData = function() {
            var productIdObj = JSON.stringify({ "productId" : $scope.objectId });
            $scope.isFindButtonClicked = true;

            remoteActions.invokeMethod('getProductReferences', productIdObj).then(function(results) {
                $scope.itemReferences = results;
                $scope.isFindButtonClicked = false;
                var modalScope = $scope.$new();

                $sldsModal({
                    templateUrl: 'ProductReferencesModal.tpl.html',
                    backdrop: 'static',
                    scope: modalScope,
                    show: true
                });

            }, function(error) {
                $scope.isFindButtonClicked = false;
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.$on('showItemDetails', function(event, data) {
            $scope.openFacetDetails(data.facetType, data.facetData);
        });

        $scope.$on('hideItemDetails', function() {
            $scope.closeFacetDetails();
        });

        $scope.describeObjectById = function(objectId) {
            var inputMap = { 'objectId': objectId };
            remoteActions.invokeMethod('describeObjectbyId', JSON.stringify(inputMap)).then(function(results) {
                console.log($scope.objectAPIName + ' describeObjectById results:', results);
                $scope.objectFields = results;
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.getObjectPicklistsByName = function(objectName) {
            var inputMap = { 'objectName': objectName };
            remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                $scope.objectPicklists = {};
                for (var key in results) {
                    $scope.objectPicklists[key.toLowerCase()] = results[key];
                }
                console.log($scope.objectAPIName + ' getObjectPicklistsByName results:', $scope.objectPicklists);
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.getObjectLayoutById = function(objectId, forSelf) {
            var inputMap = {
                'objectId': objectId,
                'isInherited': forSelf
            };
            remoteActions.invokeMethod('getObjectLayoutById', JSON.stringify(inputMap)).then(function(results) {
                console.log($scope.objectAPIName + ' getObjectLayoutById results:', results);
                $scope.buildObjectLayout(results);
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.buildObjectLayout = function(results) {
            $scope.objFacets = results.facets;
            $scope.objectLayoutId = results.objLayout.Id;
            $scope.facets = [];
            if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
                angular.forEach($scope.objFacets, function(facet, idx) {
                    facet.hasSectionCustomView = false;
                    facet.active = (idx === 0);
                    facet.isInit = (idx === 0);
                    angular.forEach(facet.sections, function(section) {
                        if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                            section.hasCustomView = true;
                            facet.hasSectionCustomView = true;
                        }
                    });
                    $scope.facets.push(facet);
                });
            }
            console.log($scope.objectAPIName + ' FACETS:', $scope.facets);
        };

        $scope.getObject = function(objectId) {
            var inputMap = { 'objectId' : objectId };
            remoteActions.invokeMethod('getObject', JSON.stringify(inputMap)).then(function(results) {
                console.log($scope.objectAPIName + ' getObject results:', results);
                $scope.editObject = {};
                for (var key in results) {
                    $scope.editObject[key] = results[key];
                }
                if($scope.objectAPIName === ( $scope.nsp + 'Attribute__c') && $scope.editObject && $scope.editObject[$scope.nsp + 'AttributeCategoryName__c'] === 'System Attributes')
                {
                    for (var key in $scope.objectFields) {
                        if($scope.objectFields[key] && $scope.objectFields[key].isUpdateable)
                        {
                            $scope.objectFields[key].isUpdateable = false;
                        }
                    }
                }

                if($scope.objectAPIName == $scope.nsp+'OfferMigrationPlan__c'){
                    originalMigrationMethod = $scope.editObject[$scope.nsp+'MigrationMethod__c'];
                }

            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.saveObject = function(event) {
            var originalText;
            if (event) {
                originalText = event.currentTarget.innerText;
                event.currentTarget.disabled = true;
                event.currentTarget.innerText = 'Saving...';
            }

            var itemToSave = {};
            for (var key in $scope.editObject) {
                if (key !== '$$hashKey') {
                    itemToSave[key] = ($scope.editObject[key] === null ? undefined : $scope.editObject[key]);
                }
            }

            var inputMap = { 'so' : JSON.stringify(itemToSave) };
            remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                console.log($scope.objectAPIName + ' updateObject results:', results);
                $scope.editObject = {};
                for (var key in results) {
                    if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                        var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                        $scope.editObject[key] = results[key] + tzOffset;
                    } else {
                        $scope.editObject[key] = results[key];
                    }
                }
                if (event) {
                    event.currentTarget.innerText = originalText;
                    event.currentTarget.disabled = false;
                }

                //If Product2, Need to publish JSON Attribute
                if ($scope.objectAPIName === 'Product2') {
                    // save attribute assignments
                    var attrAssgnPromises = [];
                    for (key in $scope.attrAssgnObjMap) {
                        var attrAssignItem = $scope.attrAssgnObjMap[key];
                        if (attrAssignItem) {
                            var attrAssgnObj = {};
                            for (var k in attrAssignItem) {
                                attrAssgnObj[k] = attrAssignItem[k];
                            }
                            if (attrAssgnObj[$scope.nsp+'ValueDataType__c'] === 'Checkbox' && attrAssgnObj[$scope.nsp+'Value__c'] !== undefined) {
                                attrAssgnObj[$scope.nsp+'Value__c'] += '';
                            }
                            attrAssgnPromises.push($scope.saveAttributeAssignmentPromise(attrAssgnObj));
                        }
                    }
                    if (attrAssgnPromises.length > 0) {
                        $q.all(attrAssgnPromises).then(function(data) {
                            console.log('saveAttributeAssignmentPromise executed: ', data);
                            // publish product
                            var inputMap = { 'productId' : $scope.objectId };
                            remoteActions.invokeMethod('publishProduct', JSON.stringify(inputMap)).then(function(response) {
                                console.log('publishProduct executed: ', response);
                            });
                        });
                    }
                }

                //EPC-2543 : Refresh the OfferMigrationPlan facets only when MigrationMethod__c field is updated.
                if($scope.objectAPIName == $scope.nsp+'OfferMigrationPlan__c'){
                    var newMigrationMethod = $scope.editObject[$scope.nsp+'MigrationMethod__c'];
                    if(originalMigrationMethod !==  newMigrationMethod){
                        $scope.getObjectLayoutById($scope.objectId, true);
                    }
                    originalMigrationMethod = newMigrationMethod;
                }
                
                //broadcast an event to update the appliesToAllCartItems flag
                if ($scope.objectAPIName === $scope.nsp+'Promotion__c' && $scope.objectAPILabel === 'Discount') {
                	$rootScope.$broadcast('updateAppliesToAllItemsField', $scope.editObject);
                }

                cpqService.showNotification({
                    type: 'success',
                    content: $scope.objectAPILabel + ' saved!',
                    autohide: true
                });
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
                if (event) {
                    event.currentTarget.innerText = 'Error!';
                    $timeout(function() {
                        event.currentTarget.innerText = originalText;
                        event.currentTarget.disabled = false;
                    }, 5000);
                }
            });
        };

        $scope.saveAttributeAssignmentPromise = function(attrAssgnObj) {
            var deferred = $q.defer();
            var inputMap = { 'so' : JSON.stringify(attrAssgnObj) };
            remoteActions.invokeMethod('saveAttributeAssignment', JSON.stringify(inputMap)).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
            return deferred.promise;
        };

        $scope.showAttributeMetadata = function(attrId) {
            var metatdata = {
                objectId: $scope.objectId,
                attrId: attrId
            };
            $scope.openFacetDetails('ATTR_METADATA', metatdata);
        };

        $scope.init = function() {
            $scope.editObject = {};
            $scope.attrMap = {};
            $scope.attrObjMap = {};
            $scope.attrAssgnObjMap = {};

            $scope.getObjectLayoutById($scope.objectId, true);
            $scope.describeObjectById($scope.objectId);
            $scope.getObjectPicklistsByName($scope.objectAPIName);
            $scope.getObject($scope.objectId);
        };
        $scope.init();

        $scope.gotoFacet = function(facet) {
            if (!facet.active) {
                $scope.closeFacetDetails();

                angular.forEach($scope.facets, function(f) {
                    if (f.facetObj.Id === facet.facetObj.Id) {
                        f.active = true;
                        f.isInit = true;
                    } else {
                        f.active = false;
                    }
                });
            }
        };

        $scope.closeFacetDetails = function() {
            $scope.maximizeFacetDetail = false;
            $scope.showFacetDetail = false;
            j$('#facet-detail-content').html('');
        };

        $scope.openFacetDetails = function(facetType, facetData) {
            var compiledHTML, directiveHTML;
            if (facetType === 'FUNCTION_ARGUMENT') {
                $scope.function = facetData.function;
                $scope.functionArgument = facetData.functionArgument;
                compiledHTML = $compile('<vloc-function-argument function="function" argument="functionArgument"></vloc-function-argument>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'RULESET_RULE') {
                $scope.ruleSet = facetData.ruleSet;
                $scope.ruleSetRule = facetData.ruleSetRule;
                compiledHTML = $compile('<vloc-rule-set-rule rule-set="ruleSet" rule-set-rule="ruleSetRule"></vloc-rule-set-rule>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'RULE_CONDITION') {
                $scope.rule = facetData.rule;
                $scope.ruleCondition = facetData.ruleCondition;
                $scope.contextDimensions = facetData.contextDimensions;
                compiledHTML = $compile('<vloc-rule-condition rule="rule" rule-condition="ruleCondition" context-dimensions="contextDimensions"></vloc-rule-condition>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'CONTEXT_MAPPING') {
                $scope.contextMapping = facetData.contextMapping;
                $scope.objectId = facetData.contextObjectId;
                $scope.objectApiName = facetData.contextObjectAPIName;
                $scope.contextDimensions = facetData.contextDimensions;
                compiledHTML = $compile('<vloc-context-mapping context-mapping="contextMapping" object-id="objectId" object-api-name="objectApiName" context-dimensions="contextDimensions"></vloc-context-mapping>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'PRICING_VARIABLE_BINDING') {
                $scope.binding = facetData.binding;
                $scope.pricingVariable = facetData.pricingVariable;
                compiledHTML = $compile('<vloc-pricing-variable-binding binding="binding" pricing-variable="pricingVariable"></vloc-pricing-variable-binding>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'PRICELIST_ENTRY') {
                $scope.objectId = $scope.editObject.Id;
                $scope.parentPriceListId = ($scope.editObject[$scope.nsp+'ParentPriceListId__c'] || null);
                $scope.priceListEntryItem = facetData.priceListEntryItem;
                $scope.pricingMode = facetData.pricingMode;
                $scope.pricingElementObjectType = facetData.pricingElementObjectType;
                $scope.isAdj = facetData.isAdj;
                directiveHTML = '<vloc-price-list-entry object-id="objectId" parent-price-list-id="parentPriceListId" price-list-entry-item="priceListEntryItem" pricing-element-object-type="pricingElementObjectType" parent-item="editObject" pricing-mode="pricingMode" is-adj="isAdj"></vloc-price-list-entry>';
                compiledHTML = $compile(directiveHTML)($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'OBJECT_PRICING_ELEMENT') {
                $scope.pricingElementItem = facetData.pricingElementItem;
                $scope.pricingElementObjectType = facetData.pricingElementObjectType;
                $scope.priceListId = $scope.editObject.Id;
                $scope.isGlobal = facetData.isGlobal;
                directiveHTML = '<vloc-object-pricing-element pricing-element-item="pricingElementItem" pricing-element-object-type="pricingElementObjectType" price-list-id="priceListId" is-global="isGlobal"></vloc-object-pricing-element>';
                compiledHTML = $compile(directiveHTML)($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'PROD_PRICING_ELEMENT') {
                $scope.objectId = $scope.editObject.Id;
                $scope.pricingElementItem = facetData.pricingElementItem;
                $scope.pricingMode = facetData.pricingMode;
                $scope.isAdj = facetData.isAdj;
                directiveHTML = '<vloc-product-pricing object-id="objectId" pricing-element-item="pricingElementItem" parent-item="editObject" pricing-mode="pricingMode" is-adj="isAdj"></vloc-product-pricing>';
                compiledHTML = $compile(directiveHTML)($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'PROMOTION_PRODUCT') {
                $scope.promoItem = facetData.promotionItem;
                compiledHTML = $compile('<vloc-promotion-product promotion-item="promoItem" parent-item="editObject"></vloc-promotion-product>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            }
            else if (facetType === 'OFFER_MIGRATION_COMPONENT_MAPPING') {
                $scope.offerMigrationComponentMapping = facetData.offerMigrationComponentMappingItem;
                compiledHTML = $compile('<vloc-offer-migration-component-mapping offer-migration-component-mapping="offerMigrationComponentMapping" parent-item="editObject"></vloc-offer-migration-component-mapping>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            }
            else if (facetType === 'PROD_CHILD_DETAILS') {
                $scope.rootProductId = facetData.rootProductId;
                $scope.prodChildItem = facetData.prodChildItem;
                $scope.pricingMode = facetData.pricingMode;
                $scope.promotionId = facetData.promotionId;
                directiveHTML = '<vloc-prod-child-details root-product-id="rootProductId" prod-child-item="prodChildItem" pricing-mode="pricingMode" promotion-id="promotionId"></vloc-prod-child-details>';
                compiledHTML = $compile(directiveHTML)($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'PROD_CHILD_ITEM') {
                $scope.mode = facetData.mode;
                $scope.rootProductId = facetData.rootProductId;
                $scope.prodChildItem = facetData.prodChildItem;
                directiveHTML = '<vloc-prod-child-item mode="mode" root-product-id="rootProductId" prod-child-item="prodChildItem"></vloc-prod-child-item>';
                compiledHTML = $compile(directiveHTML)($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'PRICING_ELEMENT') {
                $scope.objectId = $scope.editObject.Id;
                $scope.pricingElementItem = facetData.pricingElementItem;
                $scope.pricingMode = facetData.pricingMode;
                $scope.isAdj = facetData.isAdj;
                directiveHTML = '<vloc-price-list-entry object-id="objectId" pricing-element-item="pricingElementItem" parent-item="editObject" pricing-mode="pricingMode" is-adj="isAdj"></vloc-price-list-entry>';
                compiledHTML = $compile(directiveHTML)($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'ATTACHMENT_ITEM') {
                $scope.attachmentItem = facetData.attachmentItem;
                compiledHTML = $compile('<vloc-attachment item="attachmentItem" parent-item="editObject"></vloc-attachment>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'PICKLIST_ITEM') {
                $scope.picklistItem = facetData.picklistItem;
                compiledHTML = $compile('<vloc-picklist-item item="picklistItem" parent-item="editObject"></vloc-picklist-item>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'ASSIGN_ATTRS_FIELDS') {
                $scope.objectId = facetData.objectId;
                $scope.assignedItems = facetData.assignedItems;
                compiledHTML = $compile('<vloc-assign-attrs-fields object-id="objectId" assigned-items="assignedItems"></vloc-assign-attrs-fields>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'ATTR_METADATA') {
                $scope.objectId = facetData.objectId;
                $scope.attrId = facetData.attrId;
                $scope.attrAssgnObj = null;
                $scope.isProduct = ($scope.objectAPIName === 'Product2');
                $scope.isDerivedFromObjectType = false;
                if($scope.editObject && $scope.editObject[$scope.nsp + 'ObjectTypeId__c']) {
                    $scope.isDerivedFromObjectType = true;
                }
                directiveHTML = '<vloc-attribute-metadata object-id="objectId" attr-id="attrId" attr-assgn-obj="attrAssgnObj" is-product="isProduct" is-derived-from-object-type="isDerivedFromObjectType"></vloc-attribute-metadata>';
                compiledHTML = $compile(directiveHTML)($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'FIELD_METADATA') {
                $scope.fieldObjectName = facetData.objectName;
                $scope.fieldName = facetData.fieldName;
                compiledHTML = $compile('<vloc-field-metadata object-name="fieldObjectName" field-name="fieldName"></vloc-field-metadata>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'LAYOUT_ELEMENT') {
                $scope.elementObj = facetData.elementObj;
                $scope.fieldObjectName = facetData.objectName;
                $scope.objectLayoutId = facetData.objectLayoutId;
                $scope.objectFacetId = facetData.objectFacetId;
                $scope.objectSectionId = facetData.objectSectionId;
                $scope.objectLayoutFields = facetData.objectLayoutFields;
                directiveHTML = '<vloc-layout-element item="elementObj" layout-id="objectLayoutId" ' +
                    'facet-id="objectFacetId" section-id="objectSectionId" object-name="fieldObjectName" object-layout-fields="objectLayoutFields"></vloc-layout-element>';
                compiledHTML = $compile(directiveHTML)($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'PRICING_PLAN_STEP') {
                $scope.pricingPlanStep = facetData.pricingPlanStep;
                compiledHTML = $compile('<vloc-pricing-plan-step item="pricingPlanStep" parent-item="editObject"></vloc-pricing-plan-step>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'DISCOUNT_PRODUCT') {
            	$scope.promoItem = facetData.promotionItem;
            	compiledHTML = $compile('<vloc-discount-product promotion-item="promoItem" parent-item="editObject"></vloc-discount-product>')($scope);
            	j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'DISCOUNT_PRICING') {
                $scope.objectId = $scope.editObject.Id;
                $scope.pricingElementItem = facetData.pricingElementItem;
                $scope.isAdj = facetData.isAdj;
                $scope.pricingMode = facetData.pricingMode;
                directiveHTML = '<vloc-dicount-pricing object-id="objectId" pricing-element-item="pricingElementItem" parent-item="editObject" pricing-mode="pricingMode" is-adj="isAdj"></vloc-discount-pricing>';
                compiledHTML = $compile(directiveHTML)($scope);
                j$('#facet-detail-content').html(compiledHTML);
            }


            $scope.showFacetDetail = true;
            $scope.collapseFacetHeader = false;
        };

        $scope.setupViewAttrs = function(section) {
            var ctxInfo = {
                'customObject': $scope.editObject,
                'customObjectAPILabel': $scope.objectAPILabel,
                'customObjectAPIName': $scope.objectAPIName
            };
            if ($scope.objectAPIName === 'Product2') {
                ctxInfo['pricingMode'] = 'PRODUCT';
                ctxInfo['selfLayout'] = true;
            }
            else if ($scope.objectAPIName === ($scope.nsp + 'PriceList__c')) {
                ctxInfo['pricingMode'] = 'PRICELIST';
            }
            else if ($scope.objectAPIName === ($scope.nsp + 'Promotion__c') && $scope.objectAPILabel === 'Discount') {
                ctxInfo['pricingMode'] = 'DISCOUNT';
            }
            else if ($scope.objectAPIName === ($scope.nsp + 'Promotion__c')) {
                ctxInfo['pricingMode'] = 'PROMOTION';
            }

            return {
                'name': section.facetSectionObj[$scope.nsp + 'ViewUri__c'],
                'attrs': {
                    'contextInfo': ctxInfo
                }
            };
        };
	}
]);

},{}],3:[function(require,module,exports){
angular.module('epcadmin')
.controller('NewObjectRecordController', ['$scope', '$location', 'remoteActions', '$timeout', 'cpqService',
    function ($scope, $location, remoteActions, $timeout,cpqService) {
        $scope.nsp = fileNsPrefix();
        $scope.doLabel = $location.search().doLabel;
        $scope.doAPIName = $location.search().doAPIName;
        $scope.objectAPILabel = $location.search().doRecordType;
        $scope.doRecordType = $location.search().doRecordType;
        $scope.facets = [];
        $scope.objectFields = null;
        $scope.objectPicklists = {};
        $scope.editObject = {};
        $scope.attrMap = {};
        $scope.attrObjMap = {};
        $scope.attrAssgnObjMap = {};
        $scope.attrAssgnObjPicklistMap = {};
        $scope.attrAssgnObjLookupMap = {};

        $scope.hasObjectTypes = false;
        $scope.objectTypes = [];
        $scope.objTypeSelect = {
            isCreateable: true,
            isUpdateable: true,
            isRequired: false,
            label: 'objectType',
            type: 'OTPICKLIST',
        };

        $scope.getObjectLayoutByName = function(objectName,recordType) {
            var inputMap = { 
                'objectName' : objectName,
                'recordType' : recordType
            };
            remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                console.log('getObjectLayoutByName new object record results: ', results);
                $scope.buildObjectLayout(results);
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.buildObjectLayout = function(results) {
            $scope.objFacets = results.facets;
            $scope.objectLayoutId = results.objLayout.Id;
            $scope.facets = [];
            if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
                angular.forEach($scope.objFacets, function(facet, idx) {
                    facet.hasSectionCustomView = false;
                    facet.active = (idx === 0);
                    angular.forEach(facet.sections, function(section) {
                        if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                            section.hasCustomView = true;
                            facet.hasSectionCustomView = true;
                        }
                        else {
                            var sectionEls = [];
                            angular.forEach(section.sectionElements, function(sectionElement) {
                                if (sectionElement[$scope.nsp + 'FieldApiName__c'] != null) {
                                    if (!($scope.hasObjectTypes && (sectionElement[$scope.nsp + 'FieldApiName__c'] === $scope.nsp+'ObjectTypeId__c'))) {
                                        sectionEls.push(sectionElement);
                                    }
                                }
                                if (sectionElement[$scope.nsp + 'Type__c'] === 'Attribute') {
                                    var attrId = sectionElement[$scope.nsp+'AttributeId__c'];
                                    $scope.attrObjMap[attrId] = null;
                                    $scope.attrAssgnObjMap[attrId] = null;
                                    $scope.attrAssgnObjPicklistMap[attrId] = null;
                                    $scope.attrAssgnObjLookupMap[attrId] = null;
                                    sectionEls.push(sectionElement);
                                }
                            });
                            section.sectionElements = sectionEls;
                        }
                    });
                    $scope.facets.push(facet);
                });
            }
            $scope.facet = $scope.facets[0];
            console.log('FACET for new object record: ', $scope.facet);
        };

        $scope.describeObject = function() {
            var inputMap = { 'objectName' : $scope.doAPIName };
            remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                console.log('describeObject ' + $scope.doAPIName + ': ', results);
                $scope.objectFields = results;
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.getObjectPicklistsByName = function() {
            var inputMap = { 'objectName' : $scope.doAPIName };
            remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                $scope.objectPicklists = {};
                for (var key in results) {
                    $scope.objectPicklists[key.toLowerCase()] = results[key];
                }
                console.log('getObjectPicklistsByName ' + $scope.doAPIName + ': ', $scope.objectPicklists);
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.saveObject = function(event) {
            var itemToSave = {};
            for (var key in $scope.editObject) {
                if (key !== '$$hashKey') {
                    itemToSave[key] = $scope.editObject[key];
                }
            }
            $scope.createObject(event, itemToSave);
        };

        $scope.createObject = function(event, itemToSave) {
            var originalText;
            if (event) {
                originalText = event.currentTarget.innerText;
                event.currentTarget.disabled = true;
                event.currentTarget.innerText = 'Saving...';
            }
            if(itemToSave.objectTypeId == undefined && $scope.doRecordType != undefined)
            {
            	itemToSave.RecordTypeId = $scope.doRecordType;
            }
            var inputMap = {
                'objectName' : $scope.doAPIName,
                'inputMap' : itemToSave
            };
            remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                console.log('create object ' + $scope.doAPIName + ': ', results);
                if (event) {
                    event.currentTarget.innerText = originalText;
                    event.currentTarget.disabled = false;
                }

                cpqService.showNotification({
                    type: 'success',
                    content: $scope.doLabel + ' created!',
                    autohide: true
                });

                $scope.launchTab(results);
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
                if (event) {
                    event.currentTarget.innerText = 'Error!';
                    $timeout(function() {
                        event.currentTarget.innerText = originalText;
                        event.currentTarget.disabled = false;
                    }, 5000);
                }
            });
        };

        $scope.launchTab = function(item) {
            var data = {
                'doAction': 'viewRecord',
                'doAPIName': $scope.doAPIName,
                'doAPILabel': $scope.objectAPILabel,
                'obj': item,
                'closeCurrentTab': true
            };
            var broadcastAction = {
                'eventName': 'launchConsoleTab',
                'eventData': data
            };
            if (window.frameElement !== null) {
                // create a iframe resize event binding with the parent
                window.parent.bindIframeEvents('broadcast', broadcastAction);
            }
        };

        $scope.getObjectTypes = function(item) {
            $scope.objectTypes = [];
            var inputMap = { 'objectName' : item };
            remoteActions.invokeMethod('getObjectClassTypesByName', JSON.stringify(inputMap)).then(function(results) {
                angular.forEach(results, function(type) {
                    $scope.objectTypes.push({label: type.Name, value: type.Id});
                });
                console.log('getObjectTypes result:', $scope.objectTypes);

                if (results.length > 0) {
                    $scope.hasObjectTypes = true;
                }
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.init = function() {
        	if(!(($scope.doRecordType == 'Promotion' || $scope.doRecordType == 'Discount') && $scope.doAPIName == $scope.nsp + 'Promotion__c'))
        	{
        		$scope.getObjectTypes($scope.doAPIName);
        	}
        	$scope.getObjectLayoutByName($scope.doAPIName,$scope.doRecordType);
        	$scope.describeObject();
            $scope.getObjectPicklistsByName();
        };
        $scope.init();
    }
]);

},{}],4:[function(require,module,exports){
angular.module('epcadmin')
.controller('ObjectClassAdminController', ['$scope', '$location', '$timeout', '$compile', 'remoteActions', 'objectClassService', 'cpqService',
    function ($scope, $location, $timeout, $compile, remoteActions, objectClassService, cpqService) {
        $scope.OBJECT_NAME = 'ObjectClass__c';
        $scope.nsp = fileNsPrefix();
        $scope.objectClassId = $location.search().id;
        $scope.objectClassName = $location.search().name;
        $scope.isVirtual = $location.search().isVirtual;
        $scope.objectAPILabel = $location.search().objAPILabel;
        $scope.objectAPIName = $location.search().objAPIName;
        $scope.mode = $location.search().mode;
        $scope.showFacetDetail = false;
        $scope.maximizeFacetDetail = false;
        $scope.objectFields = null;
        $scope.objectobjectClasss = {};
        $scope.objectClass = {};
        $scope.editObject = {};
        $scope.attrMap = {};
        $scope.attrObjMap = {};
        $scope.attrAssgnObjMap = {};
        $scope.objectApiName = '';

        $scope.describeObject = function(objectName) {
            var inputMap = { 'objectName' : objectName };
            remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                console.log('describeObject objectClass results: ', results);
                $scope.objectFields = results;
                if($scope.isVirtual === 'true' && $scope.objectFields && $scope.objectFields['Name'])
                {
                    $scope.objectFields['Name'].isUpdateable = false;
                }
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.getObjectPicklistsByName = function(objectName) {
            var inputMap = { 'objectName' : objectName };
            remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                $scope.objectPicklists = {};
                for (var key in results) {
                    $scope.objectPicklists[key.toLowerCase()] = results[key];
                }
                console.log('getObjectPicklistsByName results:', $scope.objectPicklists);
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.getObject = function(objectClassId) {
            var inputMap = { 'objectId' : objectClassId };
            remoteActions.invokeMethod('getObject', JSON.stringify(inputMap)).then(function(results) {
                console.log('getObject results: ', results);
                $scope.objectClass = results;
                $scope.editObject = {};
                for (var key in $scope.objectClass) {
                    $scope.editObject[key] = $scope.objectClass[key];
                }

                $scope.objectApiName = $scope.objectClass[$scope.nsp + 'ObjectApiName__c'];
                if ($scope.objectApiName && $scope.objectApiName.endsWith('__c')) {
                    $scope.objectApiName = $scope.nsp + $scope.objectApiName;
                }
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.gotoFacet = function(facet) {
            $scope.closeFacetDetails(); // close the facet details section, if open
            if (!facet.active) {
                angular.forEach($scope.facets, function(f) {
                    f.active = (f.facetObj.Id === facet.facetObj.Id);
                });
            }
        };

        $scope.saveObject = function(event) {
            var originalText;
            if (event) {
                originalText = event.currentTarget.innerText;
                event.currentTarget.disabled = true;
                event.currentTarget.innerText = 'Saving...';
            }

            var itemToSave = {};
            for (var key in $scope.editObject) {
                if (key !== '$$hashKey') {
                    itemToSave[key] = ($scope.editObject[key] === null ? undefined : $scope.editObject[key]);
                }
            }

            var inputMap = { 'so' : JSON.stringify(itemToSave) };
            remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                console.log('save objectClass results: ', results);
                $scope.objectClass = {};
                $scope.editObject = {};
                for (var key in results) {
                    if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                        var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                        $scope.objectClass[key] = results[key] + tzOffset;
                        $scope.editObject[key] = results[key] + tzOffset;
                    } else {
                        $scope.objectClass[key] = results[key];
                        $scope.editObject[key] = results[key];
                    }
                }
                if (event) {
                    event.currentTarget.innerText = originalText;
                    event.currentTarget.disabled = false;
                }
                cpqService.showNotification({
                    type: 'success',
                    content: 'Object saved!',
                    autohide: true
                });
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
                if (event) {
                    event.currentTarget.innerText = 'Error!';
                    $timeout(function() {
                        event.currentTarget.innerText = originalText;
                        event.currentTarget.disabled = false;
                    }, 5000);
                }
            });
        };

        $scope.$on('showItemDetails', function(event, data) {
            $scope.openFacetDetails(data.facetType, data.facetData, data);
        });

        $scope.$on('hideItemDetails', function() {
            $scope.closeFacetDetails();
        });

        $scope.openFacetDetails = function(facetType, facetData, data) {
            var compiledHTML;
            if (facetType === 'ATTR_METADATA') {
                $scope.objectId = facetData.objectId;
                $scope.attrId = facetData.attrId;
                $scope.attrAssgnObj = null;
                compiledHTML = $compile('<vloc-attribute-metadata object-id="objectId" attr-id="attrId" attr-assgn-obj="attrAssgnObj"></vloc-attribute-metadata>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'FIELD_METADATA') {
                $scope.objectName = facetData.objectName;
                $scope.fieldName = facetData.fieldName;
                compiledHTML = $compile('<vloc-field-metadata object-name="objectName" field-name="fieldName"></vloc-field-metadata>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'LAYOUT_ELEMENT') {
                $scope.objectId = facetData.objectId;
                $scope.elementObj = facetData.elementObj;
                $scope.objectName = facetData.objectName;
                $scope.objectLayoutId = facetData.objectLayoutId;
                $scope.objectFacetId = facetData.objectFacetId;
                $scope.objectSectionId = facetData.objectSectionId;
                $scope.objectLayoutFields = facetData.objectLayoutFields;
                var directiveHTML = '<vloc-layout-element item="elementObj" layout-id="objectLayoutId" ' +
                    'facet-id="objectFacetId" section-id="objectSectionId" object-name="objectName" ' +
                    'object-layout-fields="objectLayoutFields"></vloc-layout-element>';
                compiledHTML = $compile(directiveHTML)($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'OBJECT_TYPE') {
                //TODO: should be facetData.objectTypeItem and parent-item should be ParentObjectClass(?)
                $scope.objectTypeItem = facetData.objectTypeItem;
                $scope.objectClassItem = facetData.objectClassItem;
                compiledHTML = $compile('<vloc-object-type item="objectTypeItem" parent-item="objectClassItem" object-name="objectApiName"></vloc-object-type>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else {
                $scope.selectedItem = data;
                compiledHTML = $compile('<vloc-attachment item="selectedItem" parent-item="product" hide-item-details="closeFacetDetails"></vloc-attachment>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            }
            $scope.showFacetDetail = true;
        };

        $scope.closeFacetDetails = function() {
            $scope.maximizeFacetDetail = false;
            $scope.showFacetDetail = false;
            j$('#facet-detail-content').html('');
        };

        $scope.setupViewAttrs = function(section) {
            return {
                'name': section.facetSectionObj[$scope.nsp + 'ViewUri__c'],
                'attrs': {
                    'contextInfo': {
                        'customObject': $scope.editObject,
                        'customObjectAPILabel': $scope.objectAPILabel,
                        'customObjectAPIName': $scope.objectAPIName
                    },
                    'objectId': $scope.objectClassId,
                    'objectApiName': $scope.objectApiName
                }
            };
        };

        $scope.init = function() {
            $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
            $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);
            if($scope.isVirtual === 'true')
            {
                $scope.facets = objectClassService.getFacetsByType('virtual');
            }
            else
            {
                $scope.facets = objectClassService.getFacetsByType('nonVirtual');
            }
            if ($scope.facets.length > 0) {
                $scope.gotoFacet($scope.facets[0]);
            }

            if ($scope.mode === 'new') {
                $scope.objectClassName = 'New Object Class';
            } else {
                $scope.getObject($scope.objectClassId);
            }
        };
        $scope.init();
    }
]);

},{}],5:[function(require,module,exports){
angular.module('epcadmin')
.controller('ObjectTypeAdminController', ['$scope', '$location', '$timeout', '$compile', 'remoteActions', 'objectTypeService', 'cpqService',
    function ($scope, $location, $timeout, $compile, remoteActions, objectTypeService, cpqService) {
        $scope.OBJECT_NAME = 'ObjectClass__c';
        $scope.nsp = fileNsPrefix();
        $scope.objectClassId = $location.search().id;
        $scope.objectClassName = $location.search().name;
        $scope.customObjectAPILabel = $location.search().objAPILabel;
        $scope.customObjectAPIName = $location.search().objAPIName;
        $scope.mode = $location.search().mode;
        $scope.showFacetDetail = false;
        $scope.maximizeFacetDetail = false;
        $scope.objectFields = null;
        $scope.objectobjectClasss = {};
        $scope.objectClass = {};
        $scope.editObject = {};
        $scope.attrMap = {};
        $scope.attrObjMap = {};
        $scope.attrAssgnObjMap = {};
        $scope.objectApiName = '';

        $scope.describeObject = function(objectName) {
            var inputMap = { 'objectName' : objectName };
            remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                console.log('describeObject objectClass results: ', results);
                $scope.objectFields = results;
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.describeObjectWithQuery = function(objectName) {
            var queryMap = {};
            //Build query string: WHERE myu16__ObjectApiName__c = parentItem AND RecordType.Name = 'Object Type'
            var objName = $scope.objectApiName.replace($scope.nsp, '');
            var parentOTQueryFilter = 'WHERE ' + $scope.nsp + 'ObjectApiName__c = \'' + objName + '\' AND RecordType.Name = \'Object Type\' AND Id != \''+$scope.objectClassId+'\'';
            var lookupFieldName = $scope.nsp + 'ParentObjectClassId__c';
            queryMap[lookupFieldName] = parentOTQueryFilter;

            var inputMap = { 
                'objectName' : objectName,
                'inputMap' : JSON.stringify(queryMap)
            };
            remoteActions.invokeMethod('describeObjectWithQuery', JSON.stringify(inputMap)).then(function(results) {
                $scope.objectFields = results;
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.getObjectPicklistsByName = function(objectName) {
            var inputMap = { 'objectName' : objectName };
            remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                $scope.objectPicklists = {};
                for (var key in results) {
                    $scope.objectPicklists[key.toLowerCase()] = results[key];
                }
                console.log('getObjectPicklistsByName results:', $scope.objectPicklists);
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.getObject = function(objectClassId) {
            var inputMap = { 'objectId' : objectClassId };
            remoteActions.invokeMethod('getObject', JSON.stringify(inputMap)).then(function(results) {
                $scope.objectClass = results;
                $scope.editObject = {};
                for (var key in $scope.objectClass) {
                    $scope.editObject[key] = $scope.objectClass[key];
                }

                $scope.objectApiName = $scope.objectClass[$scope.nsp + 'ObjectApiName__c'];
                if ($scope.objectApiName && $scope.objectApiName.endsWith('__c')) {
                    $scope.objectApiName = $scope.nsp + $scope.objectApiName;
                }
                $scope.describeObjectWithQuery($scope.nsp + $scope.OBJECT_NAME);
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
            });
        };

        $scope.gotoFacet = function(facet) {
            $scope.closeFacetDetails(); // close the facet details section, if open
            if (!facet.active) {
                angular.forEach($scope.facets, function(f) {
                    f.active = (f.facetObj.Id === facet.facetObj.Id);
                });
            }
        };

        $scope.saveObject = function(event) {
            if ($scope.mode === 'new') {
                $scope.createItem(event);
            } else {
                $scope.saveItem(event);
            }
        };

        $scope.createItem = function(event) {
            var originalText;
            if (event) {
                originalText = event.currentTarget.innerText;
                event.currentTarget.disabled = true;
                event.currentTarget.innerText = 'Saving...';
            }

            var itemToSave = {};
            for (var key in $scope.editObject) {
                if (key !== '$$hashKey') {
                    itemToSave[key] = $scope.editObject[key];
                }
            }

            var inputMap = { 
                'objectName' : $scope.nsp + $scope.OBJECT_NAME,
                'inputMap' : itemToSave
            };
            remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                console.log('create objectClass results: ', results);
                for (var key in results) {
                    $scope.objectClass[key] = results[key];
                    $scope.editObject[key] = results[key];
                }
                if (event) {
                    event.currentTarget.innerText = originalText;
                    event.currentTarget.disabled = false;
                }
                cpqService.showNotification({
                    type: 'success',
                    content: 'Object Type created!',
                    autohide: true
                });
                // redirect to object page
                window.location = '/apex/objectTypeAdmin?id=' + results.Id + '&name=' + results.Name;
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
                if (event) {
                    event.currentTarget.innerText = 'Error!';
                    $timeout(function() {
                        event.currentTarget.innerText = originalText;
                        event.currentTarget.disabled = false;
                    }, 5000);
                }
            });
        };

        $scope.saveItem = function(event) {
            var originalText;
            if (event) {
                originalText = event.currentTarget.innerText;
                event.currentTarget.disabled = true;
                event.currentTarget.innerText = 'Saving...';
            }

            var itemToSave = {};
            for (var key in $scope.editObject) {
                if (key !== '$$hashKey') {
                    itemToSave[key] = ($scope.editObject[key] === null ? undefined : $scope.editObject[key]);
                }
            }

            var inputMap = { 'so' : JSON.stringify(itemToSave) };
            remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                console.log('save objectClass results: ', results);
                $scope.objectClass = {};
                $scope.editObject = {};
                for (var key in results) {
                    if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                        var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                        $scope.objectClass[key] = results[key] + tzOffset;
                        $scope.editObject[key] = results[key] + tzOffset;
                    } else {
                        $scope.objectClass[key] = results[key];
                        $scope.editObject[key] = results[key];
                    }
                }
                if (event) {
                    event.currentTarget.innerText = originalText;
                    event.currentTarget.disabled = false;
                }
                cpqService.showNotification({
                    type: 'success',
                    content: 'Object Type saved!',
                    autohide: true
                });
            }, function(error) {
                cpqService.showNotification({
                    type: 'error',
                    title: 'Error',
                    content: error.message
                });
                if (event) {
                    event.currentTarget.innerText = 'Error!';
                    $timeout(function() {
                        event.currentTarget.innerText = originalText;
                        event.currentTarget.disabled = false;
                    }, 5000);
                }
            });
        };

        $scope.$on('showItemDetails', function(event, data) {
            console.log('showItemDetails data: ',data);
            $scope.openFacetDetails(data.facetType, data.facetData, data);
        });

        $scope.$on('hideItemDetails', function() {
            $scope.closeFacetDetails();
        });

        $scope.openFacetDetails = function(facetType, facetData, data) {
            var compiledHTML;
            if (facetType === 'ATTR_METADATA') {
                $scope.objectId = facetData.objectId;
                $scope.attrId = facetData.attrId;
                $scope.attrAssgnObj = null;
                compiledHTML = $compile('<vloc-attribute-metadata object-id="objectId" attr-id="attrId" attr-assgn-obj="attrAssgnObj"></vloc-attribute-metadata>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'FIELD_METADATA') {
                $scope.objectName = facetData.objectName;
                $scope.fieldName = facetData.fieldName;
                compiledHTML = $compile('<vloc-field-metadata object-name="objectName" field-name="fieldName"></vloc-field-metadata>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'LAYOUT_ELEMENT') {
                $scope.objectId = facetData.objectId;
                $scope.elementObj = facetData.elementObj;
                $scope.objectName = facetData.objectName;
                $scope.objectLayoutId = facetData.objectLayoutId;
                $scope.objectFacetId = facetData.objectFacetId;
                $scope.objectSectionId = facetData.objectSectionId;
                $scope.objectLayoutFields = facetData.objectLayoutFields;
                var directiveHTML = '<vloc-layout-element item="elementObj" layout-id="objectLayoutId" ' +
                    'facet-id="objectFacetId" section-id="objectSectionId" object-name="objectName" object-layout-fields="objectLayoutFields"></vloc-layout-element>';
                compiledHTML = $compile(directiveHTML)($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else if (facetType === 'ASSIGN_ATTRS_FIELDS') {
                $scope.objectId = facetData.objectId;
                $scope.assignedItems = facetData.assignedItems;
                compiledHTML = $compile('<vloc-assign-attrs-fields object-id="objectId" assigned-items="assignedItems"></vloc-assign-attrs-fields>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            }
            //TODO: change this from vloc-attachment to vloc-object-type
            else if (facetType === 'OBJECT_TYPE') {
                $scope.attachmentItem = facetData.attachmentItem;
                $scope.product = facetData.product;
                compiledHTML = $compile('<vloc-attachment item="attachmentItem" parent-item="product"></vloc-attachment>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            } else {
                $scope.selectedItem = data;
                compiledHTML = $compile('<vloc-attachment item="selectedItem" parent-item="product" hide-item-details="closeFacetDetails"></vloc-attachment>')($scope);
                j$('#facet-detail-content').html(compiledHTML);
            }
            $scope.showFacetDetail = true;
        };

        $scope.closeFacetDetails = function() {
            $scope.maximizeFacetDetail = false;
            $scope.showFacetDetail = false;
            j$('#facet-detail-content').html('');
        };

        $scope.setupViewAttrs = function(section) {
            return {
                'name': section.facetSectionObj[$scope.nsp + 'ViewUri__c'],
                'attrs': {
                    'contextInfo': {
                        'customObject': $scope.editObject,
                        'customObjectAPILabel': $scope.customObjectAPILabel,
                        'customObjectAPIName': $scope.customObjectAPIName
                    },
                    'objectId': $scope.objectClassId,
                    'objectApiName': $scope.editObject[$scope.nsp+'ObjectApiName__c']
                }
            };
        };

        $scope.init = function() {
            $scope.getObject($scope.objectClassId);
            $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);
            $scope.facets = objectTypeService.getFacets();
            if ($scope.facets.length > 0) {
                $scope.gotoFacet($scope.facets[0]);
            }
        };
        $scope.init();
    }
]);


},{}],6:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocApplicableObjects', ['remoteActions', 'cpqService', 
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ApplicableObjects.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                console.log('INIT: ', $scope.customViewAttrs);
                $scope.objectId = $scope.customViewAttrs.contextInfo.customObject.Id;
                $scope.nsp = fileNsPrefix();
                $scope.objectClasses = [];

                $scope.getAllObjectClasses = function() {
                    remoteActions.invokeMethod('getAllObjectClasses', null).then(function(results) {
                        console.log('getAllObjectClasses results: ', results);
                        $scope.objectClasses = [];
                        angular.forEach(results, function(o) {
                            var obj = {
                                'Id': o.Id,
                                'Name': o.Name,
                                'applied': false
                            };
                            $scope.objectClasses.push(obj);
                        });

                        var inputMap = { 'attributeId' : $scope.objectId };
                        remoteActions.invokeMethod('getApplicableObjectClasses', JSON.stringify(inputMap)).then(function(result) {
                            console.log('getApplicableObjectClasses results: ', result);
                            $scope.appliedMap = {};
                            angular.forEach(result, function(aoc) {
                                $scope.appliedMap[aoc.Id] = '';
                                angular.forEach($scope.objectClasses, function(e) {
                                    if (aoc.Id === e.Id) {
                                        e.applied = true;
                                    }
                                });
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                        });
                    });
                };

                $scope.saveApplicableObjects = function(event) {
                    var applicableList = [], nonApplicableList = [];
                    angular.forEach($scope.objectClasses, function(e) {
                        var Id = e.Id;
                        if (e.applied && ($scope.appliedMap[Id] === undefined)) {
                            applicableList.push(Id);
                        }
                        if (!e.applied && ($scope.appliedMap[Id] !== undefined)) {
                            nonApplicableList.push(Id);
                        }
                    });
                    console.log('applicableList: ', applicableList);
                    console.log('nonApplicableList: ', nonApplicableList);

                    if ((applicableList.length > 0) || (nonApplicableList.length > 0)) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Saving...';
                        }
                        var inputMap = { 
                            'attributeId' : $scope.objectId,
                            'newApplicableObjectClasses' : JSON.stringify(applicableList),
                            'newNonApplicableObjectClasses' : JSON.stringify(nonApplicableList)
                        };
                        remoteActions.invokeMethod('saveApplicableObjectClasses', JSON.stringify(inputMap)).then(function(results) {
                            console.log('saveApplicableObjectClasses results: ', results);
                            $scope.getAllObjectClasses();
                            if (event) {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            if (event) {
                                event.currentTarget.innerText = 'Error!';
                                $timeout(function() {
                                    event.currentTarget.innerText = originalText;
                                    event.currentTarget.disabled = false;
                                }, 5000);
                            }
                        });
                    }
                };

                $scope.init = function() {
                    $scope.getAllObjectClasses();
                };
                $scope.init();
            }
        };
    }
]);

},{}],7:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocAssignAttrsFields', ['$rootScope', 'remoteActions', 'cpqService',
    function($rootScope, remoteActions, cpqService) {
        return {
            scope: {
                objectId: '=',
                assignedItems: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'AssignAttrsFields.tpl.html',
            controller: function($scope) {
                $scope.nsp = fileNsPrefix();

                $scope.getAttributeFieldBindingData = function() {
                    $scope.AttrObjMap = {};
                    $scope.AttrAssgnObjMap = {};
                    $scope.attributeMap = {};
                    $scope.fieldMap = {};
                    $scope.items = [];
                    $scope.attrList = [];
                    $scope.fieldList = [];
                    $scope.allSelected = false;
                    $scope.selectedCount = 0;

                    var inputMap = { 
                        'objectId' : $scope.objectId,
                        'allObjectAttributes' : true
                    };
                    remoteActions.invokeMethod('getAttributeFieldBindingData', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getAttributeFieldBindingData results: ', results);
                        $scope.bindings = results.AttributeBinding__c;
                        $scope.fields = results.Field;
                        $scope.parseAAWrapper(results.AAWrapper);

                        var boundAttrMap = {};
                        var boundFieldMap = {};
                        angular.forEach($scope.bindings, function(binding) {
                            var attrId = binding[$scope.nsp + 'AttributeId__c'];
                            var attrObj = $scope.attributeMap[attrId];
                            var attrName = attrObj.Name;
                            var attrCode = attrObj.Code;
                            var fieldName = binding[$scope.nsp + 'FieldApiName__c'];
                            boundAttrMap[attrId] = {'Name': fieldName, 'Label': $scope.fields[fieldName].label};
                            boundFieldMap[fieldName] = {'Id': attrId, 'Name': attrName, 'Code': attrCode};
                        });
                        angular.forEach($scope.attributes, function(attr) {
                            var item = {};
                            item.isSelected = false;
                            item.attrId = attr.Id;
                            item.attrName = attr.Name;
                            item.attrCode = attr.Code;
                            item.name = item.attrName;
                            item.type = 'Attribute';
                            item.fieldName = '';
                            item.fieldLabel = '';

                            /* IGNORE ATTRIBUTE BINDING FOR NOW
                            if (boundAttrMap[attr.Id] === undefined) {
                                item.bound = false;
                                item.fieldName = '';
                                item.fieldLabel = '';
                            } else {
                                item.bound = true;
                                item.fieldName = boundAttrMap[attr.Id].Name;
                                item.fieldLabel = boundAttrMap[attr.Id].Label;
                            }
                            */

                            if ($scope.assignedItems[attr.Id] === undefined) {
                                $scope.attrList.push(item);
                                $scope.items.push(item);
                            }
                        });
                        for (var fieldName in $scope.fields) {
                            var field = {'name': fieldName, 'label': $scope.fields[fieldName].label};
                            var item = {};
                            item.isSelected = false;
                            item.fieldName = fieldName;
                            item.fieldLabel = field.label;
                            item.name = item.fieldLabel;
                            item.type = 'Field';

                            /* IGNORE ATTRIBUTE BINDING FOR NOW
                            if (boundFieldMap[fieldName] === undefined) {
                                item.bound = false;
                                item.attrId = '';
                                item.attrName = '';
                                item.attrCode = '';
                                if ($scope.assignedItems[fieldName] === undefined) {
                                    $scope.items.push(item);
                                }
                            } else {
                                item.bound = true;
                                item.attrId = boundFieldMap[fieldName].Id;
                                item.attrName = boundFieldMap[fieldName].Name;
                                item.attrCode = boundFieldMap[fieldName].Code;
                            }
                            */

                            if ($scope.assignedItems[fieldName] === undefined) {
                                $scope.fieldList.push(item);
                                $scope.items.push(item);
                            }
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.parseAAWrapper = function(aList) {
                    $scope.attributes = [];
                    angular.forEach(aList, function(aItem) {
                        var attr = {};
                        if (aItem.attributeAssignment) {
                            // use attribute assignment
                            attr.aaId = aItem.attributeAssignment.Id;
                            attr.Id = aItem.attributeAssignment[$scope.nsp + 'AttributeId__c'];
                            attr.Name = aItem.attributeAssignment[$scope.nsp + 'AttributeDisplayName__c'];
                            attr.Code = aItem.attributeAssignment[$scope.nsp + 'AttributeUniqueCode__c'];
                            $scope.AttrAssgnObjMap[attr.Id] = aItem.attributeAssignment;
                        } else {
                            // use attribute
                            attr.Id = aItem.attribute.Id;
                            attr.Name = aItem.attribute.Name;
                            attr.Code = aItem.attribute[$scope.nsp + 'Code__c'];
                            $scope.AttrAssgnObjMap[attr.Id] = null;
                        }
                        $scope.AttrObjMap[attr.Id] = aItem.attribute;
                        $scope.attributeMap[attr.Id] = attr;
                        $scope.attributes.push(attr);
                    });
                };

                $scope.selectAll = function() {
                    angular.forEach($scope.items, function(item) {
                        item.isSelected = $scope.allSelected;
                        $scope.selectItem(item);
                    });
                    $scope.selectedCount = ($scope.allSelected ? $scope.items.length : 0);
                };

                $scope.selectItem = function(item) {
                    if (item.isSelected) {
                        $scope.selectedCount++;
                    } else {
                        $scope.selectedCount--;
                        $scope.allSelected = false;
                    }
                };

                $scope.assignItems = function() {
                    var selectedAttrList = [];
                    var selectedFieldList = [];
                    angular.forEach($scope.items, function(item) {
                        if (item.isSelected) {
                            if (item.bound) {
                                selectedAttrList.push(item.attrId);
                            } else if (item.fieldName === '') {
                                selectedAttrList.push(item.attrId);
                            } else {
                                selectedFieldList.push(item.fieldName);
                            }
                        }
                    });
                    var inputMap = { 
                        'objectId' : $scope.objectId,
                        'fieldNames' : JSON.stringify(selectedFieldList),
                        'attributeIds' : JSON.stringify(selectedAttrList)
                    };
                    remoteActions.invokeMethod('applyFieldAttribute', JSON.stringify(inputMap)).then(function(results) {
                        console.log('applyFieldAttribute results: ', results);
                        $rootScope.$broadcast('refreshItems');
                        $rootScope.$broadcast('hideItemDetails');
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.init = function() {
                    $scope.getAttributeFieldBindingData();
                };
                $scope.init();
            }
        };
    }
]);

},{}],8:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocAttachment', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                item: '=',
                parentItem: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'Attachment.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'VlocityAttachment__c';
                $scope.editObject = {};
                $scope.attrMap = {};
                $scope.attrObjMap = {};
                $scope.attrAssgnObjMap = {};
                $scope.facets = [];

                $scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = { 
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectLayoutByName attachment item results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectLayoutById = function(objectId, forSelf) {
                    var inputMap = { 
                        'objectId' : objectId,
                        'isInherited' : forSelf
                    };
                    remoteActions.invokeMethod('getObjectLayoutById', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectLayoutById attachment item results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName  results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.buildObjectLayout = function(results) {
                    $scope.objFacets = results.facets;
                    $scope.objectLayoutId = results.objLayout.Id;
                    $scope.facets = [];
                    if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
                        angular.forEach($scope.objFacets, function(facet, idx) {
                            facet.hasSectionCustomView = false;
                            facet.active = (idx === 0);
                            angular.forEach(facet.sections, function(section) {
                                if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                                    section.hasCustomView = true;
                                    facet.hasSectionCustomView = true;
                                }
                            });
                            $scope.facets.push(facet);
                        });
                    }
                    console.log('FACETS for attachments: ', $scope.facets);
                };

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('describeObject attachment item results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    console.log('editItem:: ', $scope.editObject);
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editObject[key];
                        }
                    }

                    var inputMap = { 
                        'objectName' : $scope.nsp + $scope.OBJECT_NAME,
                        'inputMap' : itemToSave
                    };
                    remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('create attachment item results: ', results);
                        $rootScope.$broadcast('refreshAttachments');
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Attachment created!',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    console.log('save attachment editItem',$scope.editObject);
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editObject[key] === null ? undefined : $scope.editObject[key]);
                        }
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('save attachment item results: ', results);
                        $rootScope.$broadcast('refreshAttachments');
                        $scope.item = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.item[key] = results[key] + tzOffset;
                            } else {
                                $scope.item[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Attachment saved!',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.init = function() {
                    if ($scope.item.Id === undefined) {
                        $scope.displayMode = 'create';
                        $scope.getObjectLayoutByName($scope.OBJECT_NAME, '');
                        $scope.editObject[$scope.nsp + 'ObjectId__c'] = $scope.parentItem.Id;
                    } else {
                        $scope.displayMode = 'edit';
                        $scope.getObjectLayoutById($scope.item.Id, true);

                        for (var key in $scope.item) {
                            if (key !== '$$hashKey') {
                                $scope.editObject[key] = $scope.item[key];
                            }
                        }
                    }
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);
                };
                $scope.init();
            }
        };
    }
]);

},{}],9:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocAttachments', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'Attachments.tpl.html',
            controller: function($scope, $rootScope, $sldsModal) {
                $scope.nsp = fileNsPrefix();
                $scope.objectId = $scope.customViewAttrs.contextInfo.customObject.Id;
                $scope.OBJECT_NAME = 'VlocityAttachment__c';

                $scope.$on('refreshAttachments', function() {
                    $scope.getAttachments($scope.objectId);
                });

                $scope.selectItem = function(item) {
                    var broadcastData = {
                        facetType: 'ATTACHMENT_ITEM',
                        facetData: {
                            attachmentItem: item
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.newItem = function() {
                    $scope.selectItem({});
                };

                $scope.editItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }
                    $scope.selectItem(item);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Attachment';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the attachment <i>' + item.Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete Attachment';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete attachment results: ', results);
                            $scope.getAttachments($scope.objectId);
                            deleteModal.hide();
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Attachment deleted.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.previewItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.title = item.Name;
                    modalScope.itemName = item.Name;
                    modalScope.itemUrl = item[$scope.nsp + 'UrlLong__c'];
                    modalScope.preview = function() {
                        var itemToPreview = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToPreview[key] = item[key];
                            }
                        }
                    };

                    var previewModal = $sldsModal({
                        templateUrl: 'PreviewItemModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('Attachments - describeObject results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + 'attachments'] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + 'attachments'];
                        }
                        console.log('Attachments - getFieldSets results: ', $scope.fieldSet);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getAttachments = function(productId) {
                    var inputMap = { 'objectId' : productId };
                    remoteActions.invokeMethod('getAttachments', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getAttachments results: ', results);
                        $scope.items = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.init = function() {
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getFieldSetsByName($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getAttachments($scope.objectId);
                };
                $scope.init();
            }
        };
    }
]);

},{}],10:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocAttrFieldBindings', ['$rootScope', 'remoteActions', 'cpqService',
    function($rootScope, remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'AttrFieldBindings.tpl.html',
            controller: function($scope, $sldsModal) {
                console.log('INIT: ', $scope.customViewAttrs);
                $scope.nsp = fileNsPrefix();
                $scope.objectId = $scope.customViewAttrs.objectId;
                $scope.selectedCount = 0;
                $scope.filter = {
                    ua: true,
                    ba: true,
                    uf: true,
                    bf: true
                };

                $scope.getAttributeFieldBindingData = function() {
                    $scope.attributeMap = {};
                    $scope.bindingMap = {};
                    $scope.attrList = [];
                    $scope.fieldList = [];
                    $scope.unboundAttrs = [];
                    $scope.unboundFields = [];

                    var inputMap = { 
                        'objectId' : $scope.objectId,
                        'allObjectAttributes' : true
                    };
                    remoteActions.invokeMethod('getAttributeFieldBindingData', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getAttributeFieldBindingData results: ', results);
                        $scope.bindings = results.AttributeBinding__c;
                        $scope.fields = results.Field;
                        $scope.parseAAWrapper(results.AAWrapper);

                        var boundAttrMap = {};
                        var boundFieldMap = {};
                        angular.forEach($scope.bindings, function(binding) {
                            var attrId = binding[$scope.nsp + 'AttributeId__c'];
                            var attrObj = $scope.attributeMap[attrId];
                            var attrName = attrObj.Name;
                            var attrCode = attrObj.Code;
                            var fieldName = binding[$scope.nsp + 'FieldApiName__c'];
                            boundAttrMap[attrId] = {'Name': fieldName, 'Label': $scope.fields[fieldName].label, 'BindingId': binding.Id};
                            boundFieldMap[fieldName] = {'Id': attrId, 'Name': attrName, 'Code': attrCode, 'BindingId': binding.Id};

                            $scope.bindingMap[binding.Id] = binding;
                        });
                        angular.forEach($scope.attributes, function(attr) {
                            var item = {};
                            item.isSelected = false;
                            item.attrId = attr.Id;
                            item.attrName = attr.Name;
                            item.attrCode = attr.Code;

                            if (boundAttrMap[attr.Id] === undefined) {
                                item.bound = false;
                                item.fieldName = '';
                                item.fieldLabel = '';
                                $scope.unboundAttrs.push(item);
                            } else {
                                item.bound = true;
                                item.fieldName = boundAttrMap[attr.Id].Name;
                                item.fieldLabel = boundAttrMap[attr.Id].Label;
                                item.bindingId = boundAttrMap[attr.Id].BindingId;
                            }

                            $scope.attrList.push(item);
                        });
                        for (var fieldName in $scope.fields) {
                            var field = {'name': fieldName, 'label': $scope.fields[fieldName].label};
                            var item = {};
                            item.isSelected = false;
                            item.fieldName = fieldName;
                            item.fieldLabel = field.label;

                            if (boundFieldMap[fieldName] === undefined) {
                                item.bound = false;
                                item.attrId = '';
                                item.attrName = '';
                                item.attrCode = '';
                                $scope.unboundFields.push(item);
                            } else {
                                item.bound = true;
                                item.attrId = boundFieldMap[fieldName].Id;
                                item.attrName = boundFieldMap[fieldName].Name;
                                item.attrCode = boundFieldMap[fieldName].Code;
                                item.bindingId = boundFieldMap[fieldName].BindingId;
                            }

                            $scope.fieldList.push(item);
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.parseAAWrapper = function(aList) {
                    $scope.attributes = [];
                    angular.forEach(aList, function(aItem) {
                        var attr = {};
                        if (aItem.aa) {
                            // use attribute assignment
                            attr.aaId = aItem.aa.Id;
                            attr.Id = aItem.aa[$scope.nsp + 'AttributeId__c'];
                            attr.Name = aItem.aa[$scope.nsp + 'AttributeDisplayName__c'];
                            attr.Code = aItem.aa[$scope.nsp + 'AttributeUniqueCode__c'];
                        } else {
                            // use attribute
                            attr.Id = aItem.attribute.Id;
                            attr.Name = aItem.attribute.Name;
                            attr.Code = aItem.attribute[$scope.nsp + 'Code__c'];
                        }
                        $scope.attributeMap[attr.Id] = attr;
                        $scope.attributes.push(attr);
                    });
                };

                $scope.newBinding = function() {
                    var modalScope = $scope.$new();
                    modalScope.nsp = $scope.nsp;
                    modalScope.title = 'Attribute-Field Binding';
                    modalScope.unboundAttrs = $scope.unboundAttrs;
                    modalScope.unboundFields = $scope.unboundFields;
                    modalScope.editAttrId = '';
                    modalScope.editFieldName = '';
                    modalScope.createBinding = function() {
                        var inputMap = { 
                            'attributeId' : this.editAttrId,
                            'fieldName' : this.editFieldName,
                            'objectId' : $scope.objectId
                        };
                        remoteActions.invokeMethod('createAttributeFieldBinding', JSON.stringify(inputMap)).then(function(results) {
                            console.log('create AttributeBinding: ', results);
                            $scope.getAttributeFieldBindingData();
                            bindingModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                        });
                    };

                    var bindingModal = $sldsModal({
                        templateUrl: 'EditAttrFieldBinding.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.deleteBinding = function(bindingId, attrName, fieldLabel) {
                    var modalScope = $scope.$new();
                    modalScope.nsp = $scope.nsp;
                    modalScope.confirmationTitle = 'Delete Attribute-Field Binding';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the binding between the Attribute <i>' + attrName + '</i> and the Field <i>' + fieldLabel + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete Binding';
                    modalScope.bindingObj = $scope.bindingMap[bindingId];
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var inputMap = { 'objectId' : this.bindingObj.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete AttributeBinding: ', results);
                            $scope.getAttributeFieldBindingData();
                            bindingModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            bindingModal.hide();
                        });
                    };

                    var bindingModal = $sldsModal({
                        template: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.init = function() {
                    $scope.getAttributeFieldBindingData();
                };
                $scope.init();
            }
        };
    }
]);

},{}],11:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocAttribute', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                attributeId: '=',
                objectId: '=',
                formElementName: '=',
                attrMap: '=',
                attrObj: '=',
                attrAssgnObj: '=',
                picklistItems: '=',
                lookupItems: '=',
                isReadOnly: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'VlocAttribute.tpl.html',
            controller: function($scope, $timeout) {
                $scope.nsp = fileNsPrefix();

                $scope.$on('refreshAttributeAssignment', function(event, data) {
                    if ($scope.attributeId === data.attrId) {
                        $scope.getAttributeAssignmentByAttributeId(data.attrId);
                    }
                });

                $scope.getAttributeAssignmentByAttributeId = function() {
                    var inputMap = { 
                        'attributeId' : $scope.attributeId,
                        'objectId' : $scope.objectId
                    };
                    remoteActions.invokeMethod('getAttributeAssignmentByAttributeId', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getAttributeAssignmentByAttributeId results: ', results);
                        $scope.attrObj = results.attribute;
                        $scope.attrAssgnObj = results.attributeAssignment;
                        $scope.picklistItems = results.picklistItems;
                        $scope.lookupItems = results.lookupItems;
                        $scope.attrMap[$scope.attributeId] = {
                            'attrObj': results.attribute,
                            'attrAssgnObj': results.attributeAssignment
                        };
                        $scope.initAttribute();
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.saveAttributeAssignment = function() {
                    var inputMap = { 'so' : JSON.stringify($scope.attrAssgnObj) };
                    remoteActions.invokeMethod('saveAttributeAssignment', JSON.stringify(inputMap)).then(function(results) {
                        console.log('saveAttributeAssignment results: ', results);
                        // publish product
                        var inputMap = { 'productId' : $scope.objectId };
                        remoteActions.invokeMethod('publishProduct', JSON.stringify(inputMap)).then(function(response) {
                            console.log('publishProduct executed: ', response);
                        }, function(err) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: err.message
                            });
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.$on('saveVlocAttribute', function() {
                    $scope.saveAttributeAssignment();
                });

                $scope.initAttribute = function() {
                    if (($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Currency') || ($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Number') || ($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Percent')) {
                        $scope.setupNumericItems();
                    }
                    if ($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Picklist') {
                        $scope.setupPicklistItems();
                    }
                    if ($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Multi Picklist') {
                        $scope.setupMultiPicklistItems();
                    }
                    if ($scope.attrAssgnObj[$scope.nsp+'ValueDataType__c'] === 'Checkbox') {
                        if ($scope.attrAssgnObj[$scope.nsp+'Value__c'] !== undefined && (typeof $scope.attrAssgnObj[$scope.nsp+'Value__c'] === 'string')) {
                            $scope.attrAssgnObj[$scope.nsp+'Value__c'] = ($scope.attrAssgnObj[$scope.nsp+'Value__c'] === 'true');
                        }
                    }
                    if ($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Lookup') {
                        $scope.setupLookupItems();
                    }
                };

                $scope.setupNumericItems = function() {
                    if ($scope.attrAssgnObj[$scope.nsp+'Value__c'] !== undefined && (typeof $scope.attrAssgnObj[$scope.nsp+'Value__c'] === 'string')) {
                        var floatValue = parseFloat($scope.attrAssgnObj[$scope.nsp+'Value__c']);
                        if (!isNaN(floatValue) && isFinite(floatValue)) {
                            $scope.attrAssgnObj[$scope.nsp+'Value__c'] = floatValue;
                        }
                    }
                };

                $scope.setupPicklistItems = function() {
                    angular.forEach($scope.picklistItems, function(o) {
                        o.selected = (o[$scope.nsp+'Value__c'] === $scope.attrAssgnObj[$scope.nsp+'Value__c']);
                    });
                    if (!$scope.attrAssgnObj[$scope.nsp + 'UIDisplayType__c'] || $scope.attrAssgnObj[$scope.nsp + 'UIDisplayType__c'] === '') {
                        $scope.attrAssgnObj[$scope.nsp + 'UIDisplayType__c'] = 'Dropdown';
                    }
                };

                $scope.setupMultiPicklistItems = function() {
                    $scope.selectedItems = {
                        mpd: []
                    };
                    var selectedValues = $scope.attrAssgnObj[$scope.nsp+'Value__c'];
                    if (selectedValues) {
                        var values = selectedValues.split(';');
                        angular.forEach($scope.picklistItems, function(o) {
                            if (values.indexOf(o[$scope.nsp+'Value__c']) !== -1) {
                                o.selected = true;
                                $scope.selectedItems.mpd.push(o[$scope.nsp+'Value__c']);
                            } else {
                                o.selected = false;
                            }
                        });
                    }
                    if (!$scope.attrAssgnObj[$scope.nsp + 'UIDisplayType__c'] || $scope.attrAssgnObj[$scope.nsp + 'UIDisplayType__c'] === '') {
                        $scope.attrAssgnObj[$scope.nsp + 'UIDisplayType__c'] = 'Dropdown';
                    }
                };

                $scope.setMultiPicklistValues = function() {
                    if ($scope.attrAssgnObj[$scope.nsp + 'UIDisplayType__c'] === 'Dropdown') {
                        if ($scope.selectedItems.mpd) {
                            $scope.attrAssgnObj[$scope.nsp+'Value__c'] = $scope.selectedItems.mpd.join(';');
                        } else {
                            $scope.attrAssgnObj[$scope.nsp+'Value__c'] = null;
                        }
                    } else {
                        var selectedValues = [];
                        angular.forEach($scope.picklistItems, function(o) {
                            if (o.selected) {
                                selectedValues.push(o[$scope.nsp+'Value__c']);
                            }
                        });
                        $scope.attrAssgnObj[$scope.nsp+'Value__c'] = selectedValues.join(';');
                    }
                };

                $scope.setupLookupItems = function() {
                    $scope.lookupMap = {};
                    $scope.lookupObj = {
                        selectedItem: '',
                        showItems: false
                    };
                    angular.forEach($scope.lookupItems, function(luItem) {
                        if (luItem.Name === undefined) {
                            luItem.Name = luItem.Id;
                        }
                        $scope.lookupMap[luItem.Name] = luItem.Id;
                        if (luItem.Id === $scope.attrAssgnObj[$scope.nsp+'Value__c']) {
                            $scope.lookupObj.selectedItem = luItem.Name;
                        }
                    });
                };

                $scope.selectLookupItem = function(luItem) {
                    if (luItem === null) {
                        var itemId = $scope.lookupMap[$scope.lookupObj.selectedItem];
                        $scope.attrAssgnObj[$scope.nsp+'Value__c'] = (itemId || '');
                    } else {
                        $scope.lookupObj.selectedItem = luItem.Name;
                        $scope.attrAssgnObj[$scope.nsp+'Value__c'] = luItem.Id;
                    }
                    $scope.lookupObj.showItems = false;
                };

                $scope.$watch('lookupObj.selectedItem', function(newValue) {
                    if (newValue === '') {
                        $scope.attrAssgnObj[$scope.nsp+'Value__c'] = '';
                    }
                }, true);

                var initializing = true;
                $scope.$watch('lookupItems', function(newValue) {
                    if (initializing) {
                        $timeout(function() { initializing = false; });
                    } else {
                        $scope.initAttribute();
                    }
                }, true);

                var initializing2 = true;
                $scope.$watch('picklistItems', function(newValue) {
                    if (initializing2) {
                        $timeout(function() { initializing2 = false; });
                    } else {
                        $scope.initAttribute();
                    }
                }, true);

                $scope.init = function() {
                    if (!$scope.attrObj || $scope.attrObj === null || !$scope.attrAssgnObj || $scope.attrAssgnObj === null) {
                        $scope.getAttributeAssignmentByAttributeId();
                    } else {
                        $scope.attrMap[$scope.attributeId] = {
                            'attrObj': $scope.attrObj,
                            'attrAssgnObj': $scope.attrAssgnObj
                        };
                        $scope.initAttribute();
                    }
                };
                $scope.init();
            }
        };
    }
]);

},{}],12:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocAttributeDefaultValue', ['remoteActions',
    function(remoteActions) {
        return {
            scope: {
                parentObj: '=',
                fieldName: '=',
                valueDataType: '=',
                picklistItems: '=',
                lookupItems: '=',
                displayMode: '=',
                configureMode: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'AttributeDefaultValue.tpl.html',
            controller: function($scope, $timeout) {
                $scope.nsp = fileNsPrefix();

                $scope.setMultiPicklistValues = function(selectedMPItems) {
                    $scope.parentObj[$scope.fieldName] = selectedMPItems.join(';');
                };

                $scope.setupValueDataType = function() {
                    $scope.objPicklists = [];
                    if ($scope.valueDataType === 'Picklist') {
                        $scope.selectedPicklistItem = $scope.parentObj[$scope.fieldName];
                        angular.forEach($scope.picklistItems, function(item) {
                            var o = {
                                'label': item.Name,
                                'value': item[$scope.nsp + 'Value__c']
                            }
                            /*if ($scope.parentObj[$scope.fieldName] === undefined || $scope.parentObj[$scope.fieldName] === null) {
                                if (item[$scope.nsp + 'IsDefault__c']) {
                                    o.selected = true;
                                    $scope.selectedPicklistItem = o.value;
                                } else {
                                    o.selected = false;
                                }
                            } else {
                                if ($scope.parentObj[$scope.fieldName] === o.value) {
                                    o.selected = true;
                                } else {
                                    o.selected = false;
                                }
                            }*/
                            o.selected = (o.value === $scope.parentObj[$scope.fieldName]);
                            $scope.objPicklists.push(o);
                        });
                        $scope.parentObj[$scope.fieldName] = $scope.selectedPicklistItem;
                    }
                    if ($scope.valueDataType === 'Multi Picklist') {
                        var values = '';
                        if ($scope.parentObj[$scope.fieldName] !== undefined && $scope.parentObj[$scope.fieldName] !== null) {
                            values = $scope.parentObj[$scope.fieldName].split(';');
                        }
                        var selectedValues = [];
                        angular.forEach($scope.picklistItems, function(item) {
                            var o = {
                                'label': item.Name,
                                'value': item[$scope.nsp + 'Value__c']
                            }
                            /*if ($scope.parentObj[$scope.fieldName] === undefined || $scope.parentObj[$scope.fieldName] === null) {
                                o.selected = item[$scope.nsp + 'IsDefault__c'];
                            } else {
                                o.selected = (values.indexOf(o.value) !== -1);
                            }*/
                            o.selected = (values.indexOf(o.value) !== -1);
                            if (o.selected) {
                                selectedValues.push(o.value);
                            }
                            $scope.objPicklists.push(o);
                        });
                        $scope.parentObj[$scope.fieldName] = selectedValues.join(';');
                    }
                    if ($scope.valueDataType === 'Lookup') {
                        $scope.setupLookupItems();
                    }
                };

                var initializing = true;
                $scope.$watch('picklistItems', function(newValue, oldValue) {
                    if (initializing) {
                        $timeout(function() { initializing = false; });
                    } else {
                        if (oldValue !== undefined) {
                            $scope.parentObj[$scope.fieldName] = null;
                        }
                        $scope.picklistItems = newValue;
                        $scope.setupValueDataType();
                    }
                });

                $scope.setupLookupItems = function() {
                    $scope.lookupMap = {};
                    $scope.lookupObj = {
                        selectedItem: '',
                        showItems: false
                    };
                    angular.forEach($scope.lookupItems, function(luItem) {
                        if (luItem.Name === undefined) {
                            luItem.Name = luItem.Id;
                        }
                        $scope.lookupMap[luItem.Name] = luItem.Id;
                        if (luItem.Id === $scope.parentObj[$scope.fieldName]) {
                            $scope.lookupObj.selectedItem = luItem.Name;
                        }
                    });
                };

                $scope.selectLookupItem = function(luItem) {
                    if (luItem === null) {
                        var itemId = $scope.lookupMap[$scope.lookupObj.selectedItem];
                        $scope.parentObj[$scope.fieldName] = (itemId || '');
                    } else {
                        $scope.lookupObj.selectedItem = luItem.Name;
                        $scope.parentObj[$scope.fieldName] = luItem.Id;
                    }
                    $scope.lookupObj.showItems = false;
                };

                $scope.$watch('lookupObj.selectedItem', function(newValue) {
                    if (newValue === '') {
                        $scope.parentObj[$scope.fieldName] = '';
                    }
                }, true);

                $scope.init = function() {
                    $scope.fieldInfo = {'label': 'defaultValue'};
                    $scope.setupValueDataType();
                };
                $scope.init();
            }
        };
    }
]);

},{}],13:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocAttributeMetadata', ['$rootScope', 'remoteActions', 'cpqService',
    function($rootScope, remoteActions, cpqService) {
        return {
            scope: {
                objectId: '=',
                attrId: '=',
                overrideAttrAssgnObj: '=',
                isProduct: '=',
                mode: '=',
                isDerivedFromObjectType: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'AttributeMetadata.tpl.html',
            controller: function($scope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'AttributeAssignment__c';
                $scope.objectFields = null;
                $scope.objectPicklists = null;
                $scope.cfg = {};

                $scope.getAttributeAssignmentByAttributeId = function() {
                    var inputMap = {
                        'attributeId' : $scope.attrId,
                        'objectId' : $scope.objectId
                    };
                    remoteActions.invokeMethod('getAttributeAssignmentByAttributeId', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getAttributeAssignmentByAttributeId results:', results);
                        $scope.picklistItems = results.picklistItems;
                        $scope.lookupItems = results.lookupItems;
                        $scope.currentPicklistId = angular.copy(results.attributeAssignment[$scope.nsp+'PicklistId__c']);
                        $scope.attrAssgnObj = results.attributeAssignment;
                        $scope.setupValueDataType();
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };
                $scope.isToDisableNonOverridableBehavior = function() {
                    return $scope.isDerivedFromObjectType || $scope.mode === 'override';
                }
                $scope.getAttributeAssignmentById = function() {
                    var inputMap = {
                        'attributeAssignmentId' : $scope.overrideAttrAssgnObj.Id
                    };
                    remoteActions.invokeMethod('getAttributeAssignmentById', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getAttributeAssignmentById results: ', results);
                        $scope.picklistItems = results.picklistItems;
                        $scope.lookupItems = results.lookupItems;
                        $scope.currentPicklistId = angular.copy(results.attributeAssignment[$scope.nsp+'PicklistId__c']);
                        $scope.attrAssgnObj = results.attributeAssignment;
                        $scope.setupValueDataType();
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.describeObjectWithQuery = function(objectName) {
                    var queryMap = {};
                    objectName = objectName.replace($scope.nsp, '');

                    //Lookup Object Id filtered by Record Type = Object
                    var parentOTQueryFilter = 'WHERE RecordType.Name = \'Object\'';
                    var lookupFieldName = $scope.nsp + 'LookupObjectId__c';
                    queryMap[lookupFieldName] = parentOTQueryFilter;

                    //Lookup Object Type Id filtered by Record Type = Object Type
                    if ($scope.attrAssgnObj != undefined && $scope.attrAssgnObj[$scope.nsp + 'LookupObjectId__c'] != null) {
                        var parentOTQueryFilter2 = 'WHERE RootObjectClassId__c = \''+$scope.attrAssgnObj[$scope.nsp + 'LookupObjectId__c']+ '\' AND RecordType.Name = \'Object Type\'';
                    } else {
                        var parentOTQueryFilter2 = 'WHERE RecordType.Name = \'Object Type\'';
                    }
                    var lookupFieldName2 = $scope.nsp + 'LookupObjectTypeId__c';
                    queryMap[lookupFieldName2] = parentOTQueryFilter2;

                    var inputMap = {
                        'objectName' : objectName,
                        'inputMap' : JSON.stringify(queryMap)
                    };
                    remoteActions.invokeMethod('describeObjectWithQuery', JSON.stringify(inputMap)).then(function(results) {
                        console.log('describeObject assignment attribute results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        $scope.objectFields = {};
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        $scope.objectPicklists = {};
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };
                $scope.setRuntimeconfig = function(fieldName) {
                    var fieldValue = $scope.attrAssgnObj[fieldName];
                    if(!fieldValue) {
                        if($scope.objectFields) {
                            $scope.objectFields[$scope.nsp + 'IsNotAssetizable__c'].isUpdateable = false;
                        }
                    }
                }
                $scope.setIsConfigurable = function(fieldName) {
                	if($scope.attrAssgnObj[fieldName] == 'Picklist' || $scope.attrAssgnObj[fieldName] == 'Multi Picklist' || $scope.attrAssgnObj[fieldName] == 'Checkbox')
            		{
                                $scope.attrAssgnObj[$scope.nsp + 'IsConfigurable__c'] = true;
                		$scope.objectFields[$scope.nsp + 'IsConfigurable__c'].isUpdateable = false;
            		}
                	else
                	{
                		$scope.objectFields[$scope.nsp + 'IsConfigurable__c'].isUpdateable = true;
                	}
                }
                $scope.changeRunTimeConfig = function(fieldValue) {
                    if(!fieldValue) {
                        $scope.attrAssgnObj[$scope.nsp + 'IsNotAssetizable__c'] = false;
                        if($scope.objectFields) {
                            $scope.objectFields[$scope.nsp + 'IsNotAssetizable__c'].isUpdateable = false;
                        }
                    } else {
                        $scope.objectFields[$scope.nsp + 'IsNotAssetizable__c'].isUpdateable = true;
                    }
                }

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.attrAssgnObj) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.attrAssgnObj[key];
                        }
                    }
                    if (itemToSave[$scope.nsp+'ValueDataType__c'] === 'Checkbox' && itemToSave[$scope.nsp+'Value__c'] !== undefined) {
                        itemToSave[$scope.nsp+'Value__c'] += '';
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('saveAttributeAssignment', JSON.stringify(inputMap)).then(function(results) {
                        console.log('save assignment attribute results: ', results);
                        if ($scope.isProduct) {
                            // publish product
                            var inputMap = { 'productId' : $scope.objectId };
                            remoteActions.invokeMethod('publishProduct', JSON.stringify(inputMap)).then(function(response) {
                                console.log('publishProduct executed: ', response);
                            });
                        }

                        $rootScope.$broadcast('refreshItems');
                        $rootScope.$broadcast('refreshAttributeAssignment', {attrId: results[$scope.nsp+'AttributeId__c']});
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $rootScope.$broadcast('hideItemDetails');
                        //TODO: show save success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.setupValueDataType = function() {
                    if (($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Currency') || ($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Number') || ($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Percent')) {
                        $scope.setupNumericItems();
                    }
                    if ($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Checkbox') {
                        if ($scope.attrAssgnObj[$scope.nsp+'Value__c'] !== undefined && (typeof $scope.attrAssgnObj[$scope.nsp+'Value__c'] === 'string')) {
                            $scope.attrAssgnObj[$scope.nsp+'Value__c'] = ($scope.attrAssgnObj[$scope.nsp+'Value__c'] === 'true');
                        }
                    }
                    if ($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Picklist' || $scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Multi Picklist') {
                        /*if ($scope.picklistItems === null) {
                            $scope.getPicklistItems($scope.attrAssgnObj[$scope.nsp + 'PicklistId__c']);
                        }*/
                        $scope.cfg.isPicklistValueType = true;
                        $scope.setupPicklistDataType();
                    } else {
                        $scope.cfg.isPicklistValueType = false;
                    }
                };

                $scope.setupNumericItems = function() {
                    if ($scope.attrAssgnObj[$scope.nsp+'Value__c'] !== undefined && (typeof $scope.attrAssgnObj[$scope.nsp+'Value__c'] === 'string')) {
                        var floatValue = parseFloat($scope.attrAssgnObj[$scope.nsp+'Value__c']);
                        if (!isNaN(floatValue) && isFinite(floatValue)) {
                            $scope.attrAssgnObj[$scope.nsp+'Value__c'] = floatValue;
                        }
                    }
                };

                $scope.setupPicklistDataType = function() {
                    if ($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Picklist') {
                        $scope.picklistDisplayTypes = [
                            {'label': 'Dropdown', 'value': 'Dropdown'},
                            {'label': 'Radiobutton', 'value': 'Radiobutton'}
                        ];
                    }

                    if ($scope.attrAssgnObj[$scope.nsp + 'ValueDataType__c'] === 'Multi Picklist') {
                        $scope.picklistDisplayTypes = [
                            {'label': 'Dropdown', 'value': 'Dropdown'},
                            {'label': 'Checkbox', 'value': 'Checkbox'}
                        ];
                    }

                    if (!$scope.attrAssgnObj[$scope.nsp + 'UIDisplayType__c']) {
                        $scope.attrAssgnObj[$scope.nsp + 'UIDisplayType__c'] = 'Dropdown';
                    }

                    $scope.selectedPicklistValueType = $scope.attrAssgnObj[$scope.nsp + 'UIDisplayType__c'];
                };

                var initializing = true;
                $scope.$watch('attrAssgnObj.' + $scope.nsp + 'ValueDataType__c', function(newValue, oldValue) {
                    if (initializing) {
                        $timeout(function() { initializing = false; });
                    } else {
                        if (oldValue !== undefined && newValue !== undefined) {
                            console.log('ValueDataType__c changed from ' + oldValue + ' to ' + newValue);
                            $scope.attrAssgnObj[$scope.nsp + 'Value__c'] = null;
                            $scope.attrAssgnObj[$scope.nsp + 'ValidValuesData__c'] = null;
                            if ((oldValue === 'Picklist' && newValue !== 'Multi Picklist') || (oldValue === 'Multi Picklist' && newValue !== 'Picklist')) {
                                $scope.attrAssgnObj[$scope.nsp + 'PicklistId__c'] = null;
                                $scope.attrAssgnObj[$scope.nsp + 'UIDisplayType__c'] = null;
                            }
                            $scope.setupValueDataType();
                        }
                    }
                });

                var initializing2 = true;
                $scope.$watch('attrAssgnObj.' + $scope.nsp + 'PicklistId__c', function(newValue, oldValue) {
                    if (initializing2) {
                        $timeout(function() { initializing2 = false; });
                    } else {
                        if (newValue !== undefined && newValue !== $scope.currentPicklistId) {
                            console.log('PICKLIST CHANGED FROM ' + oldValue + ' TO ' + newValue);
                            if (newValue === '') {
                                $scope.picklistItems = [];
                            } else {
                                $scope.getPicklistItems(newValue);
                            }
                            $scope.currentPicklistId = newValue;
                        }
                    }
                });

                $scope.getPicklistItems = function(picklistId) {
                    var inputMap = { 'picklistId' : picklistId };
                    remoteActions.invokeMethod('getPicklistItems', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getPicklistItems results: ', results);
                        $scope.picklistItems = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.init = function() {
                    if ($scope.overrideAttrAssgnObj === null || $scope.overrideAttrAssgnObj === undefined) {
                        $scope.getAttributeAssignmentByAttributeId();
                    } else {
                        $scope.getAttributeAssignmentById();
                    }
                    $scope.describeObjectWithQuery($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);
                };
                $scope.init();

                if ($scope.mode === 'override') {
                    var initializing3 = true;
                    $scope.$watch('attrAssgnObj', function(newValue, oldValue) {
                        if (initializing3) {
                            $timeout(function() { initializing3 = false; });
                        } else {
                            if (oldValue !== undefined && newValue !== undefined) {
                                $scope.$emit('ATTR_ASSGN_METADATA_CHANGE', {
                                    'attrAssgnObj': $scope.attrAssgnObj,
                                    'picklistItems': $scope.picklistItems,
                                    'lookupItems': $scope.lookupItems
                                });
                            }
                        }
                    }, true);
                }
            }
        };
    }
]);

},{}],14:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocContextActionInfoCard', ['remoteActions',
    function(remoteActions) {
        return {
            scope: {
                contextAction: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ContextActionInfoCard.tpl.html',
            controller: function($scope) {
                $scope.nsp = fileNsPrefix();
            }
        };
    }
]);

},{}],15:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocContextMapping', ['remoteActions', 'cpqService', 
    function(remoteActions, cpqService) {
        return {
            scope: {
                contextMapping: '=',
				objectId: '=',
				objectApiName: '=',
                contextDimensions: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ContextMapping.tpl.html',
            controller: function($scope, $rootScope, $timeout, $sldsModal) {
                $scope.nsp = fileNsPrefix();
                $scope.mapping = {};
                $scope.objectName = $scope.nsp + 'ContextMapping__c';
                $scope.objectNameFunction = $scope.nsp + 'VlocityFunction__c';
                $scope.objectNameFunctionArgument = $scope.nsp + 'VlocityFunctionArgument__c';
                $scope.objectFields = {
                    'contextMapping': {},
                    'function': {},
                    'functionArgument': {}
                };
                $scope.objectPicklists = {
                    'contextMapping': {},
                    'function': {},
                    'functionArgument': {}
                };
                $scope.contextDimensionsMap = {};
                $scope.valueFieldInfo = {};
                $scope.objectIdToNameMap = {};

                $scope.describeObjectByName = function(objectName, key) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields[key] = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName, key) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' getObjectPicklistsByName results:', results);
                        for (var k in results) {
                            $scope.objectPicklists[key][k.toLowerCase()] = results[k];
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.saveItem = function(mapping, event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }
                    
                    var itemToSave = {};
                    for (var key in mapping) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = (mapping[key] === null ? undefined : mapping[key]);
                        }
                    }
                    if (itemToSave[$scope.nsp + 'TypeInValue__c']) {
                        itemToSave[$scope.nsp + 'TypeInValue__c'] += '';
                    }

                    if (mapping[$scope.nsp + 'InitializationType__c'] === 'Function') {
                        angular.forEach(itemToSave.efcArguments, function(arg) {
                            if (arg[$scope.nsp+'DomainType__c'] === 'Picklist') {
                                if (arg.picklistSelectionMode === 'Multiple') {
                                    var picklistValues = arg.selectedPicklistValue;
                                    if (angular.isArray(picklistValues)) {
                                        arg.selectedPicklistValue = picklistValues.join(';');
                                    }
                                    arg[$scope.nsp+'Value__c'] = arg.selectedPicklistValue;
                                } else {
                                    arg[$scope.nsp+'PicklistValueId__c'] = arg.selectedPicklistValue;
                                }
                            }
                            if (arg[$scope.nsp+'DomainType__c'] === 'Object Lookup') {
                                arg[$scope.nsp+'ObjectId__c'] = arg.selectedObjectId;
                            }
                            if (arg[$scope.nsp+'DomainType__c'] === 'Type in') {
                                arg[$scope.nsp+'Value__c'] = arg.TypeInValue + '';
                            }

                            delete arg.selectedPicklistValue;
                            delete arg.picklistItems;
                            delete arg.picklistSelectionMode;
                            delete arg.selectedObjectId;
                            delete arg.lookupFieldInfo;
                            delete arg.TypeInValue;
                            delete arg.fArg;
                            delete arg.idx;
                            delete arg.$$hashKey;
                        });
                        delete itemToSave.function;
                        delete itemToSave.efcArguments;
                        
                        var inputMap = {
                            'mode': (mapping.Id === undefined ? 'create' : 'update'),
                            'mapping': itemToSave,
                            'Function': mapping.function,
                            'ObjectIdToNameMap': JSON.stringify($scope.objectIdToNameMap),
                            'EFCArguments': JSON.stringify(mapping.efcArguments),
                            'FunctionArgumentsMap': JSON.stringify($scope.fArgMap)
                        };
                        var inputMapJSON = JSON.stringify(inputMap);
                        var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                        remoteActions.invokeMethod('createUpdateFunctionMapping', JSON.stringify(invokeInputMap)).then(function(results) {
                            console.log('createUpdateFunctionMapping results:', results);
                            for (var k in results) {
                                mapping[k] = results[k];
                            }
                            if (event) {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }
                            $rootScope.$broadcast('refreshFacetContent');
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Context mapping saved.',
                                autohide: true
                            });
                            $scope.closeDetails();
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            if (event) {
                                event.currentTarget.innerText = 'Error!';
                                $timeout(function() {
                                    event.currentTarget.innerText = originalText;
                                    event.currentTarget.disabled = false;
                                }, 5000);
                            }
                        });
                    } else {
                        if (mapping.Id === undefined) {
                            var inputMap = {
                                'objectName': $scope.objectName,
                                'inputMap': itemToSave
                            };
                            remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                                console.log($scope.objectName + 'createObject results: ', results);
                                for (var k in results) {
                                    mapping[k] = results[k];
                                }
                                if (event) {
                                    event.currentTarget.innerText = originalText;
                                    event.currentTarget.disabled = false;
                                }
                                $rootScope.$broadcast('refreshFacetContent');
                                cpqService.showNotification({
                                    type: 'success',
                                    content: 'Context mapping saved.',
                                    autohide: true
                                });
                                $scope.closeDetails();
                            }, function(error) {
                                cpqService.showNotification({
                                    type: 'error',
                                    title: 'Error',
                                    content: error.message
                                });
                                if (event) {
                                    event.currentTarget.innerText = 'Error!';
                                    $timeout(function() {
                                        event.currentTarget.innerText = originalText;
                                        event.currentTarget.disabled = false;
                                    }, 5000);
                                }
                            });
                        } else {
                            var inputMap = { 'so' : JSON.stringify(itemToSave) };
                            remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                                console.log($scope.objectName + ' updateObject results:', results);
                                for (var k in results) {
                                    mapping[k] = results[k];
                                }
                                if (event) {
                                    event.currentTarget.innerText = originalText;
                                    event.currentTarget.disabled = false;
                                }
                                $rootScope.$broadcast('refreshFacetContent');
                                cpqService.showNotification({
                                    type: 'success',
                                    content: 'Context mapping saved.',
                                    autohide: true
                                });
                                $scope.closeDetails();
                            }, function(error) {
                                cpqService.showNotification({
                                    type: 'error',
                                    title: 'Error',
                                    content: error.message
                                });
                                if (event) {
                                    event.currentTarget.innerText = 'Error!';
                                    $timeout(function() {
                                        event.currentTarget.innerText = originalText;
                                        event.currentTarget.disabled = false;
                                    }, 5000);
                                }
                            });
                        }
                    }
                };

                $scope.getFunctionArguments = function(functionId, mapping) {
                    var inputMap = {
                        'functionId': functionId,
                        'mappingId': mapping.Id
                    };
                    var inputMapJSON = JSON.stringify(inputMap);
                    var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                    remoteActions.invokeMethod('getMappingFunctionArguments', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('getMappingFunctionArguments result:', results);
                        mapping.function = results.Function;
                        mapping.efcArguments = results.EFCArguments;
                        $scope.fArgMap = results.FunctionArgumentsMap;

                        angular.forEach(mapping.efcArguments, function(arg, idx) {
                            var fArgId = arg[$scope.nsp+'FunctionArgumentId__c'];
                            arg.idx = idx;
                            var fArg = $scope.fArgMap[fArgId];
                            arg.fArg = fArg;

                            arg.TypeInValue = '';
                            if (arg[$scope.nsp+'DomainType__c'] === 'Type in') {
                                arg.TypeInValue = arg[$scope.nsp+'Value__c'];
                            }

                            if (fArg[$scope.nsp+'DomainType__c'] === 'Picklist') {
                                var picklistId = fArg[$scope.nsp+'VlocityPicklistId__c'];
                                if (picklistId === undefined) {
                                    cpqService.showNotification({
                                        type: 'error',
                                        title: 'Error',
                                        content: 'Function agument "' + arg.Name + '" is of type Picklist, but does not have a corresponding Vlocity Picklist.'
                                    });
                                } else {
                                    $scope.getPicklistItems(picklistId, arg);
                                }

                                arg.picklistSelectionMode = fArg[$scope.nsp+'PicklistSelectionMode__c'];

                                if (arg[$scope.nsp+'DomainType__c'] === 'Picklist') {
                                    if (arg.picklistSelectionMode == 'Single') {
                                        arg.selectedPicklistValue = arg[$scope.nsp+'PicklistValueId__c'];
                                    } else if (arg.picklistSelectionMode == 'Multiple') {
                                        arg.selectedPicklistValue = arg[$scope.nsp+'Value__c'];
                                    }
                                }
                            }
                            
                            if (fArg[$scope.nsp+'DomainType__c'] === 'Object Lookup') {
                                var objectAPIName = fArg[$scope.nsp+'Object__c'];
                                if (objectAPIName === undefined) {
                                    cpqService.showNotification({
                                        type: 'error',
                                        title: 'Error',
                                        content: 'Function argument "' + arg.Name + '" is of type Object Lookup, but does not have a corresponding Object.'
                                    });
                                } else {
                                    var referenceTo = objectAPIName;
                                    if (objectAPIName.endsWith('__c')) {
                                        referenceTo = $scope.nsp + objectAPIName;
                                    }
                                    arg.lookupFieldInfo = {
                                        isCreateable: true,
                                        isDefaultedOnCreate: false,
                                        isRequired: false,
                                        isUpdateable: true,
                                        label: objectAPIName,
                                        referenceTo: referenceTo,
                                        type: 'REFERENCE'
                                    };
                                }

                                if (arg[$scope.nsp+'DomainType__c'] === 'Object Lookup') {
                                    arg.selectedObjectId = arg[$scope.nsp+'ObjectId__c'];
                                }
                            }
                            
                            if (fArg[$scope.nsp+'DomainType__c'] === 'Type in' || arg[$scope.nsp+'DomainType__c'] === 'Type in') {
                                $scope.formatTypeInValue(arg);
                            }
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getPicklistItems = function(picklistId, argument) {
                    var inputMap = { 'picklistId': picklistId };
                    remoteActions.invokeMethod('getPicklistItems', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getPicklistItems results: ', results);
                        argument.picklistItems = results;
                        angular.forEach(argument.picklistItems, function(item) {
                            $scope.objectIdToNameMap[item.Id] = item[$scope.nsp+'Value__c'];
                        });
                        if ((argument.selectedPicklistValue != undefined) && (argument[$scope.nsp+'DomainType__c'] === 'Picklist') && (argument.picklistSelectionMode === 'Multiple')) {
                            var selectedValues = argument.selectedPicklistValue.split(';');
                            angular.forEach(argument.picklistItems, function(item) {
                                item.selected = (selectedValues.indexOf(item.Id) !== -1);
                            });
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.numericValue = function(stringValue) {
                    var floatValue = parseFloat(stringValue);
                    if (!isNaN(floatValue) && isFinite(floatValue)) {
                        return floatValue;
                    } else {
                        return stringValue;
                    }
                };

                $scope.formatTypeInValue = function(arg) {
                    $scope.TypeInFieldRequired = true;
                    switch(arg.fArg[$scope.nsp+'DataType__c']) {
                        case 'Boolean':
                            $scope.TypeInFieldRequired = false;
                            arg.TypeInValue = (arg.TypeInValue === 'true');
                            break;
                        case 'Number':
                            arg.TypeInValue = $scope.numericValue(arg.TypeInValue);
                            break;
                        case 'Date':
                            arg.TypeInValue = $scope.numericValue(arg.TypeInValue);
                            break;
                        case 'DateTime':
                            arg.TypeInValue = $scope.numericValue(arg.TypeInValue);
                            break;
                    }
                };

				$scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.init = function() {
                    $scope.describeObjectByName($scope.objectName, 'contextMapping');
                    $scope.getObjectPicklistsByName($scope.objectName, 'contextMapping');
                    $scope.describeObjectByName($scope.objectNameFunction, 'function');
                    $scope.getObjectPicklistsByName($scope.objectNameFunction, 'function');
                    $scope.describeObjectByName($scope.objectNameFunctionArgument, 'functionArgument');
                    $scope.getObjectPicklistsByName($scope.objectNameFunctionArgument, 'functionArgument');

					for (var key in $scope.contextMapping) {
                        if (key !== '$$hashKey') {
                            $scope.mapping[key] = $scope.contextMapping[key];
                        }
                    }
					if ($scope.mapping.Id === undefined) {
						$scope.displayMode = 'create';
                        if ($scope.objectApiName === ($scope.nsp + 'ContextDimension__c')) {
							$scope.mapping[$scope.nsp+'Dimension__c'] = $scope.objectId;
						} else {
							$scope.mapping[$scope.nsp+'ContextScopeId__c'] = $scope.objectId;
						}
					} else {
                        $scope.displayMode = 'edit';
                    }
                    if ($scope.mapping[$scope.nsp+'VlocityFunctionId__c'] !== undefined) {
                        var functionId = $scope.mapping[$scope.nsp+'VlocityFunctionId__c'];
                        if (functionId !== undefined) {
                            $scope.getFunctionArguments(functionId, $scope.mapping);
                        }
                    }

                    angular.forEach($scope.contextDimensions, function(dimension) {
                        $scope.objectIdToNameMap[dimension.Id] = dimension.Name;
                        if (dimension[$scope.nsp+'DomainType__c'] === 'Object Lookup') {
                            var objectAPIName = dimension[$scope.nsp+'Object__c'];
                            if (objectAPIName === undefined) {
                                cpqService.showNotification({
                                    type: 'error',
                                    title: 'Error',
                                    content: 'Context dimension "' + dimension.Name + '" is of type Object Lookup, but does not have a corresponding Object.'
                                });
                            } else {
                                var referenceTo = objectAPIName;
                                if (objectAPIName.endsWith('__c')) {
                                    referenceTo = $scope.nsp + objectAPIName;
                                }
                                dimension.lookupFieldInfo = {
                                    isCreateable: true,
                                    isDefaultedOnCreate: false,
                                    isRequired: true,
                                    isUpdateable: true,
                                    label: objectAPIName,
                                    referenceTo: referenceTo,
                                    type: 'REFERENCE'
                                };
                            }
                        }
                        if (dimension[$scope.nsp+'DomainType__c'] === 'Picklist') {
                            dimension.objPicklists = [];
                            angular.forEach(dimension.PicklistItems, function(item) {
                                dimension.objPicklists.push({'label': item[$scope.nsp+'Value__c'], 'value': item[$scope.nsp+'Value__c']});
                            });
                            dimension.picklistFieldInfo = {
                                isCreateable: true,
                                isDefaultedOnCreate: false,
                                isRequired: true,
                                isUpdateable: true,
                                type: 'PICKLIST'
                            };
                        }
                        $scope.contextDimensionsMap[dimension.Id] = dimension;
                    });

                    var initializing = true;
                    $scope.$watch('mapping.' + $scope.nsp + 'VlocityFunctionId__c', function(newValue, oldValue) {
                        if (initializing) {
                            $timeout(function() { initializing = false; });
                        } else {
                            if ((newValue !== oldValue) && (newValue !== '')) {
                                $scope.getFunctionArguments(newValue, $scope.mapping);
                            }
                        }
                    });

                    $scope.$watch('mapping.' + $scope.nsp + 'Dimension__c', function(newValue, oldValue) {
                        if ((newValue !== undefined) && (newValue !== '')) {
                            var dimension = $scope.contextDimensionsMap[newValue];
                            var valueDataType = 'TEXT';
                            switch (dimension[$scope.nsp+'DataType__c']) {
                                case 'Boolean':
                                    valueDataType = 'BOOLEAN';
                                    break;
                                case 'Number':
                                    valueDataType = 'DOUBLE';
                                    break;
                                case 'Date':
                                    valueDataType = 'DATE';
                                    break;
                                case 'DateTime':
                                    valueDataType = 'DATETIME';
                                    break;
                                default:
                                    valueDataType = 'TEXT';
                                    break;
                            }
                            $scope.valueFieldInfo = {
                                isCreateable: true,
                                isDefaultedOnCreate: false,
                                isRequired: true,
                                isUpdateable: true,
                                type: valueDataType
                            };
                        }
                    });
                };
                $scope.init();
			}
		};
	}
]);

},{}],16:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocContextMappings', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ContextMappings.tpl.html',
            controller: function($scope, $rootScope, $sldsModal) {
                $scope.contextObject = $scope.customViewAttrs.contextInfo.customObject;
                $scope.contextObjectAPIName = $scope.customViewAttrs.contextInfo.customObjectAPIName;
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'ContextMapping__c';
                $scope.items = [];

				$scope.$on('refreshFacetContent', function() {
					$scope.getContextMappings();
				});

                $scope.describeObjectByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getContextMappings = function() {
                    var inputMap = {
                        'contextObjectId': $scope.contextObject.Id,
                        'contextObjectAPIName': $scope.contextObjectAPIName
                    };
                    var inputMapJSON = JSON.stringify(inputMap);
                    var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                    remoteActions.invokeMethod('getContextMappings', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('getContextMappings results: ', results.contextMappings);
                        $scope.items = results.contextMappings;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getContextDimensions = function() {
                    var invokeInputMap = { 'input': '', 'options': '' };
                    remoteActions.invokeMethod('getContextDimensions', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('getContextDimensions:', results.ContextDimensions);
                        $scope.contextDimensions = results.ContextDimensions;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.editItem = function(item) {
                    var broadcastData = {
                        facetType: 'CONTEXT_MAPPING',
                        facetData: {
                            'contextMapping': item,
                            'contextObjectId': $scope.contextObject.Id,
                            'contextObjectAPIName': $scope.contextObjectAPIName,
                            'contextDimensions': $scope.contextDimensions
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Context Mapping';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the selected Context Mapping?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete Context Mapping';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete Context Mapping results: ', results);
                            $scope.getContextMappings();
                            deleteModal.hide();
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Context mapping deleted.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.newItem = function() {
                    $scope.editItem({});
                };

                $scope.init = function() {
                    $scope.describeObjectByName($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);
					$scope.getContextMappings();
                    $scope.getContextDimensions();
                };
                $scope.init();
			}
        };
    }
]);

},{}],17:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocContextRule', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                objectType: '=',
                contextRule: '=',
                displayMode: '=',
                objectFields: '=',
                objectPicklists: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ContextRule.tpl.html',
            controller: function($scope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = $scope.nsp + 'ContextRule__c';

                $scope.getObjectLayoutByName = function(objectName, objectType) {
                    var inputMap = {
                        'objectName' : objectName,
                        'objectType' : objectType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.buildObjectLayout = function(results) {
                    $scope.objFacets = results.facets;
                    $scope.objectLayoutId = results.objLayout.Id;
                    $scope.facets = [];
                    if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
                        angular.forEach($scope.objFacets, function(facet, idx) {
                            facet.hasSectionCustomView = false;
                            facet.active = (idx === 0);
                            angular.forEach(facet.sections, function(section) {
                                if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                                    section.hasCustomView = true;
                                    facet.hasSectionCustomView = true;
                                }
                            });
                            $scope.facets.push(facet);
                        });
                    }
                };

                var initializing = true;
                $scope.$watch('objectType', function(newValue) {
                    if (initializing) {
                        $timeout(function() { initializing = false; });
                    } else {
                        console.log('OBJECT TYPE CHANGED TO: ', newValue);
                        if (newValue !== undefined) {
                            $scope.getObjectLayoutByName($scope.OBJECT_NAME, newValue);
                        }
                    }
                }, true);

                $scope.init = function() {
                    $scope.getObjectLayoutByName($scope.OBJECT_NAME, $scope.objectType);
                };
                $scope.init();
            }
        };
    }
]);

},{}],18:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocContextRuleInfoCard', ['remoteActions',
    function(remoteActions) {
        return {
            scope: {
                contextRule: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ContextRuleInfoCard.tpl.html',
            controller: function($scope) {
                $scope.nsp = fileNsPrefix();
            }
        };
    }
]);

},{}],19:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocContextRules', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ContextRules.tpl.html',
            controller: function($scope, $rootScope, $sldsModal) {
                $scope.nsp = fileNsPrefix();
                $scope.contextObject = $scope.customViewAttrs.contextInfo.customObject;
                $scope.objectNameRule = $scope.nsp + 'Rule__c';
                $scope.objectNameRuleAssignment = $scope.nsp + 'RuleAssignment__c';
                $scope.objectFields = {
                    'ruleset': {},
                    'objectRuleset': {}
                };
                $scope.objectPicklists = {
                    'ruleset': {},
                    'objectRuleset': {}
                };
                $scope.qualificationRuleSets = [];
                $scope.penaltyRuleSets = [];
                $scope.evaluationRuleSets = [];
                
                $scope.describeObjectByName = function(objectName, key) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields[key] = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName, key) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' getObjectPicklistsByName results:', results);
                        for (var k in results) {
                            $scope.objectPicklists[key][k.toLowerCase()] = results[k];
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectRuleSets = function() {
                    var inputMap = {
                        'objectId': $scope.contextObject.Id
                    };
                    var inputMapJSON = JSON.stringify(inputMap);
                    var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                    remoteActions.invokeMethod('getObjectRuleSets', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('getObjectRuleSets:', results.ruleSets);
                        $scope.qualificationRuleSets = [];
                        $scope.penaltyRuleSets = [];
                        $scope.evaluationRuleSets = [];
                        angular.forEach(results.ruleSets, function(objectRuleSet) {
                            if (objectRuleSet[$scope.nsp+'RuleType__c'] === 'Qualification') {
                                $scope.qualificationRuleSets.push(objectRuleSet);
                            } else if (objectRuleSet[$scope.nsp+'RuleType__c'] === 'Penalty') {
                                $scope.penaltyRuleSets.push(objectRuleSet);
                            } else if (objectRuleSet[$scope.nsp+'RuleType__c'] === 'Evaluation') {
                                $scope.evaluationRuleSets.push(objectRuleSet);
                            }
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' getFieldSets results:', results);
                        var fsKey = $scope.nsp.toLowerCase() + 'newruleassignment';
                        if (results[fsKey] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[fsKey];
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.deleteItem = function(objectRuleSet, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Rule Set';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the rule set <i>' + objectRuleSet[$scope.nsp+'RuleId__r'].Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in objectRuleSet) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = objectRuleSet[key];
                            }
                        }

                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            $scope.getObjectRuleSets();
                            $rootScope.$broadcast('refreshObjectPricingElements');
                            deleteModal.hide();
                            
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Rule set deleted.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.addItem = function(event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.modalTitle = 'Add Rule Set';
                    modalScope.newObject = {};
                    modalScope.newObject[$scope.nsp+'ObjectId__c'] = $scope.contextObject.Id;
                    modalScope.objectFields = $scope.objectFields['objectRuleset'];
                    modalScope.objectPicklists = $scope.objectPicklists['objectRuleset'];
                    modalScope.fieldSet = $scope.fieldSet;
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Save';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Saving...';
                        }

                        var itemToSave = {};
                        for (var key in modalScope.newObject) {
                            if (key !== '$$hashKey') {
                                itemToSave[key] = modalScope.newObject[key];
                            }
                        }

                        var inputMap = {
                            'objectName' : $scope.objectNameRuleAssignment,
                            'inputMap' : itemToSave
                        };
                        remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log($scope.objectNameRuleAssignment + ' createObject results:', results);
                            $scope.getObjectRuleSets();
                            $rootScope.$broadcast('refreshObjectPricingElements');
                            newObjectRecordModal.hide();
                            
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Rule set added.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            if (event) {
                                event.currentTarget.innerText = 'Error!';
                                $timeout(function() {
                                    event.currentTarget.innerText = originalText;
                                    event.currentTarget.disabled = false;
                                }, 5000);
                            }
                        });
                    };

                    var newObjectRecordModal = $sldsModal({
                        templateUrl: 'NewObjectRecordModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.setActiveTab = function(activeIdx) {
                    angular.forEach($scope.tabs, function(tab, idx) {
                        if (activeIdx === idx) {
                            tab.active = true;
                            tab.init = true;
                        } else {
                            tab.active = false;
                        }
                    });
                    $scope.activeIdx = activeIdx;
                    cpqService.setRuleSetTabIdx(activeIdx);
                };

                $scope.init = function() {
                    $scope.tabs = cpqService.getRuleSetTabs();
                    $scope.activeIdx = cpqService.getRuleSetTabIdx();
                    
                    $scope.describeObjectByName($scope.objectNameRule, 'ruleset');
                    $scope.getObjectPicklistsByName($scope.objectNameRule, 'ruleset');
                    
                    if ($scope.contextObject !== null && $scope.contextObject !== undefined) {
                        $scope.getObjectRuleSets();
                    }
                    
                    $scope.describeObjectByName($scope.objectNameRuleAssignment, 'objectRuleset');
                    $scope.getObjectPicklistsByName($scope.objectNameRuleAssignment, 'objectRuleset');
                    $scope.getFieldSetsByName($scope.objectNameRuleAssignment);
                };
                $scope.init();
            }
        };
    }
]);

},{}],20:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocCustomView', ['$compile',
    function($compile) {
        var VIEW_TEMPLATE_MAP = {
            'ApplicableObjects': '<vloc-applicable-objects custom-view-attrs="customViewData.attrs"></vloc-applicable-objects>',
            'ObjectClassAttrsFields': '<vloc-object-class-attrs-fields custom-view-attrs="customViewData.attrs"></vloc-object-class-attrs-fields>',
            'VirObjClassAttrs': '<vloc-vir-obj-class-attrs custom-view-attrs="customViewData.attrs"></vloc-vir-obj-class-attrs>',        
            'AttributeFieldBindings': '<vloc-attr-field-bindings custom-view-attrs="customViewData.attrs"></vloc-attr-field-bindings>',
            'VlocObjAttrsFields': '<vloc-obj-attrs-fields custom-view-attrs="customViewData.attrs"></vloc-obj-attrs-fields>',
            'LayoutManagement': '<vloc-layout-management custom-view-attrs="customViewData.attrs"></vloc-layout-management>',
            'PicklistItems': '<vloc-picklist-items custom-view-attrs="customViewData.attrs"></vloc-picklist-items>',
            'ProductDetails': '<vloc-product-details custom-view-attrs="customViewData.attrs"></vloc-product-details>',
            'ProductStructure': '<vloc-product-structure custom-view-attrs="customViewData.attrs"></vloc-product-structure>',
            'AttributeRules': '<vloc-attribute-rules custom-view-attrs="customViewData.attrs"></vloc-attribute-rules>',
            'ContextRules': '<vloc-context-rules custom-view-attrs="customViewData.attrs"></vloc-context-rules>',
            'QualifyContextRules': '<vloc-qualify-context-rules custom-view-attrs="customViewData.attrs"></vloc-qualify-context-rules>',
            'ObjectPricing': '<vloc-object-pricing custom-view-attrs="customViewData.attrs"></vloc-object-pricing>',
            'GlobalPricingElements': '<vloc-global-pricing-elements custom-view-attrs="customViewData.attrs"></vloc-global-pricing-elements>',
            'StandalonePricingElements': '<vloc-standalone-pricing-elements custom-view-attrs="customViewData.attrs"></vloc-standalone-pricing-elements>',
            'Attachments': '<vloc-attachments custom-view-attrs="customViewData.attrs"></vloc-attachments>',
            'ObjectTypes': '<vloc-object-types custom-view-attrs="customViewData.attrs"></vloc-object-types>',
            'ObjectTypeStructure': '<vloc-object-type-structure custom-view-attrs="customViewData.attrs"></vloc-object-type-structure>',
            'PriceListHierarchy': '<vloc-price-list-hierarchy custom-view-attrs="customViewData.attrs"></vloc-price-list-hierarchy>',
            'PromotionProducts': '<vloc-promotion-products custom-view-attrs="customViewData.attrs"></vloc-promotion-products>',
            'DiscountProducts': '<vloc-discount-products custom-view-attrs="customViewData.attrs"></vloc-discount-products>',
            'PromoProductDiscounts': '<vloc-product-adjustments custom-view-attrs="customViewData.attrs"></vloc-product-adjustments>',
            'OfferMigrationComponentMappings': '<vloc-offer-migration-component-mappings custom-view-attrs="customViewData.attrs"></vloc-offer-migration-component-mappings>',
            'ProductAdjustments': '<vloc-product-adjustments custom-view-attrs="customViewData.attrs"></vloc-product-adjustments>',
            'DiscountAdjustments': '<vloc-discount-adjustments custom-view-attrs="customViewData.attrs"></vloc-discount-adjustments>',
            'RuleConditions': '<vloc-rule-conditions custom-view-attrs="customViewData.attrs"></vloc-rule-conditions>',
            'RuleSetRules': '<vloc-rule-set-rules custom-view-attrs="customViewData.attrs"></vloc-rule-set-rules>',
            'FunctionArguments': '<vloc-function-arguments custom-view-attrs="customViewData.attrs"></vloc-function-arguments>',
            'ContextMappings': '<vloc-context-mappings custom-view-attrs="customViewData.attrs"></vloc-context-mappings>',
            'PricingVariableBindings': '<vloc-pricing-variable-bindings custom-view-attrs="customViewData.attrs"></vloc-pricing-variable-bindings>',
            'PricingPlanSteps': '<vloc-pricing-plan-steps custom-view-attrs="customViewData.attrs"></vloc-pricing-plan-steps>',
            'DiscountPricing': '<vloc-discount-pricing custom-view-attrs="customViewData.attrs"></vloc-discount-pricing>',
            'DiscountItemGeneralProperties': '<vloc-discount-item-general-properties custom-view-attrs="customViewData.attrs"></vloc-discount-item-general-properties>'
        };

        var getTemplate = function(view) {
            return VIEW_TEMPLATE_MAP[view];
        };

        return {
            restrict: 'E',
            scope: false,
            link: function(scope, element, attrs) {
                var viewName = scope.customViewData.name;
                element.append($compile(getTemplate(viewName))(scope));
            }
        };
    }
]);

},{}],21:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocDataTable', [function() {
    return {
        scope: {
            parentObj: '=',
            objName: '=',
            items: '=',
            selectedItem: '=',
            showItemDetails: '&'
        },
        replace: true,
        restrict: 'E',
        templateUrl: 'DataTable.tpl.html',
        controller: function($scope) {
            $scope.nsp = fileNsPrefix();
            $scope.selectedItem = null;

            $scope.selectItem = function(item) {
                $scope.selectedItem = item;
                $scope.showItemDetails()(item);
            };
        }
    };
}]);

},{}],22:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocDiscountAdjustments', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            
            templateUrl: 'DiscountAdjustments.tpl.html',
            controller: function($scope, $rootScope) {
                $scope.nsp = fileNsPrefix();
                $scope.promotion = $scope.customViewAttrs.contextInfo.customObject;
                $scope.promotionId = $scope.promotion.Id;
                $scope.pricingMode = $scope.customViewAttrs.contextInfo.pricingMode;
                $scope.OBJECT_NAME = 'PromotionItem__c';
                $scope.fieldSetName = 'discountitem';
                $scope.promotionItemList = [];
                $scope.productList = [];
                $scope.selectedProductId = '';

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('vlocDiscountItems - describeObject results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + $scope.fieldSetName] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + $scope.fieldSetName];
                        }
                        console.log('vlocPromotionProducts - getFieldSets results: ', $scope.fieldSet);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.$on('refreshPromoItems', function(event, data) {
                    $scope.getApplicableProducts();
                });

                $scope.getApplicableProducts = function() {
                    $scope.promotionItemList = [];
                    var rootProductIds = [];

                    var inputMap = {
                        'promotionId': $scope.promotionId,
                        'mode': 'ITEMS_ONLY'
                    };
                    remoteActions.invokeMethod('getPromotionItems', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getPromotionApplicableProducts results: ', results);
                        angular.forEach(results, function(item) {
                            var itemProductId = item[$scope.nsp + 'ProductId__c'];
                            rootProductIds.push(itemProductId);
                            $scope.promotionItemList.push(item);
                        });
                        $scope.getRootProducts(rootProductIds);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getRootProducts = function(rootProductIds) {
                    $scope.productList = [];
                    var inputMap = {
                        'productIds': rootProductIds,
                        'pageNumber': 1,
                        'pageSize': null
                    };
                    remoteActions.invokeMethod('getProductHierarchy', JSON.stringify(inputMap)).then(function(results) {
                        angular.forEach(results.productList, function(item, idx) {
                            var promoItem = $scope.promotionItemList[idx];
                            item.rootIndex = (idx + 1) + '.';
                            item.level = 1;
                            item.isRoot = true;
                            item.show = true;
                            item.showChildren = false;
                            item.fetchedChildren = true;
                            item.hierarchyPath = '';
                            item.isPromoItem = true;
                            item.promotionItemSO = promoItem;
                            item.rootProductId = (promoItem[$scope.nsp+'OfferId__c'] || item.productId);
                            item.uniqueId = item.promotionItemSO.Id + '_' + item.productId;
                            $scope.productList.push(item);
                            angular.forEach(item.children, function(child) {
                                if (child.pciSO && child.pciSO[$scope.nsp+'IsRootProductChildItem__c']) {
                                    item.cardinalitySO = child.pciSO;
                                } else {
                                    child.rootIndex = '';
                                    child.level = item.level + 1;
                                    child.isRoot = false;
                                    child.show = false;
                                    child.showChildren = false;
                                    child.fetchedChildren = false;
                                    child.isPromoItem = false;
                                    child.promotionItemSO = item.promotionItemSO;
                                    child.rootProductId = item.rootProductId;
                                    child.parentId = item.productId;
                                    child.hierarchyPath = child.productId;
                                    child.uniqueId = child.promotionItemSO.Id + '_' + child.productId;
                                    $scope.productList.push(child);
                                }
                            });
                            if (item.childrenInfo.currentPage < item.childrenInfo.totalPages) {
                                var loadMoreItem = {'show': false, 'loadMore': true, 'level': (item.level + 1), 'parentItem': item};
                                item.children.push(loadMoreItem);
                                $scope.productList.push(loadMoreItem);
                            }
                        });
                        console.log('getProductHierarchy ROOT: ', $scope.productList);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.toggleItem = function(parentItem, parentItemIdx, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    if (parentItem.showChildren) {
                        $scope.toggleItemVisibility(parentItem, false);
                    } else {
                        if (parentItem.fetchedChildren) {
                            // children already fetched, simply toggle visibility
                            $scope.toggleItemVisibility(parentItem, true);
                        } else {
                            // fetch children
                            $scope.getProductChildren(parentItem, parentItemIdx, 1);
                        }
                    }
                };

                $scope.toggleItemVisibility = function(parentItem, visible) {
                    parentItem.showChildren = visible;
                    angular.forEach(parentItem.children, function(item, idx) {
                        item.show = visible;
                        if (!visible && item.children) {
                            $scope.toggleItemVisibility(item, visible);
                        }
                    });
                };

                $scope.getProductChildren = function(parentItem, parentItemIdx, pageNumber) {
                    var inputMap = {
                        'productIds': [parentItem.productId],
                        'pageNumber': pageNumber,
                        'pageSize': null
                    };
                    remoteActions.invokeMethod('getProductHierarchy', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getProductHierarchy results: ', results);
                        if (pageNumber === 1) {
                            parentItem.children = [];
                            parentItemIdx++;
                        } else {
                            $scope.productList.splice(parentItemIdx, 1);
                            parentItem.children.pop();
                        }

                        if (results.productList && results.productList.length > 0) {
                            var cardinalityObjOffset = 0;
                            angular.forEach(results.productList[0].children, function(item, idx) {
                                if (item.pciSO && item.pciSO[$scope.nsp+'IsRootProductChildItem__c']) {
                                    parentItem.cardinalitySO = item.pciSO;
                                    cardinalityObjOffset++;
                                } else {
                                    item.rootIndex = '';
                                    item.level = parentItem.level + 1;
                                    item.isRoot = false;
                                    item.show = true;
                                    item.showChildren = false;
                                    item.fetchedChildren = false;
                                    item.isPromoItem = false;
                                    item.promotionItemSO = parentItem.promotionItemSO;
                                    item.rootProductId = parentItem.rootProductId;
                                    item.parentId = parentItem.productId;
                                    item.hierarchyPath = parentItem.hierarchyPath + '<' + item.productId;
                                    item.uniqueId = item.promotionItemSO.Id + '_' + item.productId;
                                    parentItem.children.push(item);
                                    $scope.productList.splice((parentItemIdx + idx - cardinalityObjOffset), 0, item);
                                }
                            });
                            parentItem.childrenInfo = results.productList[0].childrenInfo;
                            if (parentItem.childrenInfo.currentPage < parentItem.childrenInfo.totalPages) {
                                var loadMoreItem = {'show': true, 'loadMore': true, 'level': (parentItem.level + 1), 'parentItem': parentItem};
                                parentItem.children.push(loadMoreItem);
                                $scope.productList.splice((parentItemIdx + results.productList.length + 1), 0, loadMoreItem);
                            }
                        }
                        parentItem.showChildren = true;
                        parentItem.fetchedChildren = true;
                        console.log('getProductChildren: ', $scope.productList);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.selectItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    $scope.selectedProductId = item.promotionItemSO.Id + '_' + item.productId;
                    var broadcastData = {
                        facetType: 'PROD_CHILD_DETAILS',
                        facetData: {
                            promotionId: $scope.promotionId,
                            rootProductId: item.rootProductId,
                            prodChildItem: item,
                            pricingMode: $scope.pricingMode
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.$on('hideItemDetails', function() {
                    $scope.selectedProductId = '';
                });

                $scope.init = function() {
                    $scope.getApplicableProducts();
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getFieldSetsByName($scope.nsp + $scope.OBJECT_NAME);
                };
                $scope.init();
            }
        };
    }
]);

},{}],23:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocDiscountItemGeneralProperties', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
			scope: {
			    customViewAttrs: '='
			},
			replace: true,
			restrict: 'E',
			templateUrl: 'DiscountItemGeneralProperties.tpl.html',
			controller: function($scope, $rootScope) {
				$scope.nsp = fileNsPrefix();
			    $scope.displayMode = 'edit';
			    $scope.types = [{label:'Product',value: $scope.nsp + 'ProductId__c'},{label:'Catalog/Category',value:$scope.nsp + 'CatalogCategoryId__c'}];
			    $scope.editObject = $scope.customViewAttrs.editObject;
			    $scope.objectFields = $scope.customViewAttrs.objectFields;
			    $scope.objectPicklists = $scope.customViewAttrs.objectPicklists;
			    $scope.parentItem = $scope.customViewAttrs.parentItem;
			    $scope.formElementName = 'discountRecordForm';
			    $scope.catlogIdField = $scope.nsp + 'CatalogCategoryId__c';
			    $scope.prodIdField = $scope.nsp + 'ProductId__c';
			    if($scope.editObject[$scope.nsp + 'ProductId__c'] != undefined)
		    	{
			    	$scope.selectedTypes = $scope.nsp + 'ProductId__c';
		    	}
			    else if($scope.editObject[$scope.nsp + 'CatalogCategoryId__c'] != undefined)
		    	{
			    	$scope.selectedTypes = $scope.nsp + 'CatalogCategoryId__c';
		    	}
			    
			    $scope.selectItem = function()
			    {
			    	$scope.editObject['SelectedType'] = $scope.selectedTypes;
			    };
			}
        }
	}
]);

},{}],24:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocDiscountPricing', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            
            templateUrl: 'DiscountPricing.tpl.html',
            controller: function($scope, $rootScope, $sldsModal, $sldsPopover) {
                $scope.nsp = fileNsPrefix();
                $scope.promotion = $scope.customViewAttrs.contextInfo.customObject;
                $scope.promotionId = $scope.promotion.Id;
                $scope.pricingMode = $scope.customViewAttrs.contextInfo.pricingMode;
                $scope.OBJECT_NAME = 'PriceListEntry__c';
                $scope.fieldSetName = 'discountitem';
                $scope.promotionItemList = [];
                $scope.productList = [];
                $scope.catalogList = [];
                $scope.selectedProductId = '';
                $scope.pleResultsMap = {
                        'Charge': {},
                        'Cost': {},
                        'Usage': {},
                        'Adjustment': {},
                        'Override': {}
                    };
                
                
                $scope.AdjustmentResults = $scope.pleResultsMap['Adjustment'];
                $scope.OverrideResults = $scope.pleResultsMap['Override'];
                $scope.ChargeTypesDefined = [];

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('vlocDiscountItems - describeObject results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + $scope.fieldSetName] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + $scope.fieldSetName];
                        }
                        console.log('vlocPromotionProducts - getFieldSets results: ', $scope.fieldSet);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.$on('refreshPromoItems', function(event, data) {
                    $scope.getApplicableProducts();
                });

                $scope.toggleItem = function(parentItem, parentItemIdx, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    if (parentItem.showChildren) {
                        $scope.toggleItemVisibility(parentItem, false);
                    } else {
                        if (parentItem.fetchedChildren) {
                            // children already fetched, simply toggle visibility
                            $scope.toggleItemVisibility(parentItem, true);
                        } else {
                            // fetch children
                            $scope.getProductChildren(parentItem, parentItemIdx, 1);
                        }
                    }
                };

                $scope.toggleItemVisibility = function(parentItem, visible) {
                    parentItem.showChildren = visible;
                    angular.forEach(parentItem.children, function(item, idx) {
                        item.show = visible;
                        if (!visible && item.children) {
                            $scope.toggleItemVisibility(item, visible);
                        }
                    });
                };
                
                $scope.getObjectTypes = function() {
                    var inputMap = { 'objectName' : $scope.nsp + 'PricingElement__c' };
                    remoteActions.invokeMethod('getObjectClassTypesByName', JSON.stringify(inputMap)).then(function(results) {
                        angular.forEach(results, function(objType) {
                            if (objType.Name === 'Discount') {
                                $scope.DiscountOT = objType;
                            }
                            if (objType.Name === 'Charge') {
                                $scope.ChargeOT = objType;
                            }
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };
                
                $scope.$on('refreshObjectPricingElements', function() {
                    $scope.getPriceListEntriesData();
                });

                $scope.getPriceListEntries = function(priceListEntryType, pageNum, maxPages) {
                    if (pageNum < 1) {
                        pageNum = 1;
                    }
                    if (maxPages && (maxPages !== 0) && (pageNum > maxPages)) {
                        pageNum = maxPages;
                    }

                    var productIds = [];
                    productIds.push($scope.productId);
                    var offerIds = [];
                    offerIds.push($scope.rootProductId);

                    var inputMap;
                    if (priceListEntryType === 'Charge' || priceListEntryType === 'Usage') {
                        inputMap = {
                            'priceListEntryType': priceListEntryType,
                            'pageNumber': pageNum,
                        };
                    }
                    if ((priceListEntryType === 'Adjustment' || priceListEntryType === 'Override') && $scope.pricingMode === 'DISCOUNT' ) {
                        inputMap = {
                            'priceListEntryType': priceListEntryType,
                            'pageNumber': pageNum,
                        };

                        if ($scope.rootProductId !== $scope.productId) {
                            inputMap['OfferIds'] = offerIds;
                        }
                        if ($scope.pricingMode === 'PROMOTION') {
                            var promotionIds = [];
                            promotionIds.push($scope.promotionId);
                            var promotionItemIds = [];
                            promotionItemIds.push($scope.promotionItem.Id);
                            
                            inputMap['PromotionIds'] = promotionIds;
                            inputMap['PromotionItemIds'] = promotionItemIds;
                        }
                        if ($scope.pricingMode === 'DISCOUNT') {
                            var promotionIds = [];
                            promotionIds.push($scope.promotionId);
                            inputMap['PromotionIds'] = promotionIds;
                        }
                    }
                    console.log('PRODUCT PRICING INPUT MAP for ' + priceListEntryType + ': ', inputMap);

                    var inputs = {
                        'input' : JSON.stringify(inputMap),
                        'options' : ''
                    };
                    
                    $scope.ChargeTypesDefined = [];
                    remoteActions.invokeMethod('getPagedPricingElements', JSON.stringify(inputs)).then(function(results) {
                        console.log('getPricingElements for ' + priceListEntryType + ' results: ', results);
                        results.currentPage = pageNum;
                        $scope.pleResultsMap[priceListEntryType] = results;
                        $scope.ChargeResults = $scope.pleResultsMap['Charge'];
                        $scope.UsageResults = $scope.pleResultsMap['Usage'];
                        $scope.AdjustmentResults = $scope.pleResultsMap['Adjustment'];
                        $scope.OverrideResults = $scope.pleResultsMap['Override'];
                        var applyToVariableIds = [];
                        var fieldsToQuery = [];
	                    fieldsToQuery.push($scope.nsp + "PricingElementId__r."+$scope.nsp+"PricingVariableId__r."+$scope.nsp+"AppliesToVariableId__r."+$scope.nsp+"ChargeType__c");
	                    var fieldNames = JSON.stringify(fieldsToQuery);
                        for(var i = 0 ; i < $scope.pleResultsMap['Adjustment'].results.priceListEntries.length ; i++)
                        {
                        	var objectId = $scope.pleResultsMap['Adjustment'].results.priceListEntries[i]['Id'];
                        	applyToVariableIds.push(objectId);
                        }
                        $scope.getSelectedFieldValuesForObject(JSON.stringify(applyToVariableIds), fieldNames);
                        
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };
                
                $scope.getSelectedFieldValuesForObject = function(applyToVariableIds, fieldNames) {
                    var inputMap = { 'objectIds' : applyToVariableIds, 'fieldNames': fieldNames};
                    remoteActions.invokeMethod('getSelectedFieldValuesForObject', JSON.stringify(inputMap)).then(function(results) {
                    	$scope.ChargeTypesDefined = [];
                    	$scope.ChargeTypesDefinedMap = {};
                        if(results != undefined)
                        {
	                        for(var i = 0 ; i < results.length; i++)
	                    	{
	                        	if(!$scope.ChargeTypesDefined.includes(results[i][$scope.nsp +"PricingElementId__r"][$scope.nsp + "PricingVariableId__r"][$scope.nsp +"AppliesToVariableId__r"][$scope.nsp +"ChargeType__c"]))
	                            {
	                            	$scope.ChargeTypesDefined.push(results[i][$scope.nsp +"PricingElementId__r"][$scope.nsp + "PricingVariableId__r"][$scope.nsp +"AppliesToVariableId__r"][$scope.nsp +"ChargeType__c"]);
	                            	$scope.ChargeTypesDefinedMap[results[i]['Id']] = results[i][$scope.nsp +"PricingElementId__r"][$scope.nsp + "PricingVariableId__r"][$scope.nsp +"AppliesToVariableId__r"][$scope.nsp +"ChargeType__c"];
	                            }
	                    	}
                        }
                        else
                    	{
                        	$scope.ChargeTypesDefined = [];
                        	$scope.ChargeTypesDefinedMap = {};
                    	}
                        
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };
                
                $scope.setActiveTab = function(activeIdx) {
                    angular.forEach($scope.tabs, function(tab, idx) {
                        if (activeIdx === idx) {
                            tab.active = true;
                            tab.init = true;
                        } else {
                            tab.active = false;
                        }
                    });
                    $scope.activeIdx = activeIdx;
                    cpqService.setObjectPricingTabIdx(activeIdx);
                };
                
                $scope.openEditModal = function(item, elemObjType, isAdj, isOverride, definedChargeTypes, definedChargeTypesMap) {
                    var modalScope = $scope.$new();
                    modalScope.contextRuleTitle = 'Price List Entry';
                    modalScope.priceListEntryItem = item;
                    modalScope.pricingElementObjectType = elemObjType;
                    modalScope.parentObject = $scope.parentObject;
                    modalScope.objectId = $scope.productId;
                    modalScope.pricingMode = $scope.pricingMode;
                    modalScope.rootProductId = $scope.rootProductId;
                    modalScope.promotionId = $scope.promotionId;
                    modalScope.promotionItem = $scope.promotionItem;
                    modalScope.isAdj = isAdj;
                    modalScope.isOverride = isOverride;
                    modalScope.definedChargeTypes = definedChargeTypes;
                    modalScope.definedChargeTypesMap = definedChargeTypesMap;
                    modalScope.hideAction = function() {
                        editModal.hide();
                    };
                    var editModal = $sldsModal({
                        templateUrl: 'PricingElementModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.closeDetails = function() {
                    if ($scope.mode !== 'modal') {
                        $rootScope.$broadcast('hideItemDetails');
                    } else {
                        $scope.$parent.hideAction();
                    }
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Price List Entry';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the price list entry for <i>' + item[$scope.nsp + 'PricingElementId__r'].Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete price list entry results: ', results);
                            $rootScope.$broadcast('refreshObjectPricingElements');
                            deleteModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };
                
                $scope.newDiscount = function(elemObjType) {
                    if($scope.ChargeTypesDefined != undefined)
                    {
                    	var recurringCharge = $scope.ChargeTypesDefined.includes("Recurring");
                    	var oneTimeCharge = $scope.ChargeTypesDefined.includes("One-time");
                    	if(recurringCharge === true && oneTimeCharge === true)
                    	{
                    		cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: 'More than one recurring or one-time adjustment cannot be defined'
                            });
                    	}
                    	else
                		{
                    		$scope.selectItem(null, elemObjType, true, false);
                		}
                    }
                    else
                	{
                    	$scope.selectItem(null, elemObjType, true, false);
                    }
                };

                $scope.newOverride = function(elemObjType) {
                    $scope.selectItem(null, elemObjType, false, true);
                };
                
                $scope.getPriceListEntriesData = function() {
                    $scope.getPriceListEntries('Charge', 1);
                    //$scope.getPriceListEntries('Usage', 1);
                    $scope.getPriceListEntries('Adjustment', 1);
                    $scope.getPriceListEntries('Override', 1);
                };

                $scope.selectItem = function(item, elemObjType, isAdj, isOverride) {
                    var broadcastData = {
                        facetType: 'PROD_PRICING_ELEMENT',
                        facetData: {
                            priceListEntryItem: item,
                            pricingMode: $scope.pricingMode,
                            pricingElementObjectType: elemObjType,
                            isAdj: isAdj,
                            isOverride: isOverride,
                            definedChargeTypes: $scope.ChargeTypesDefined,
                            definedChargeTypesMap: $scope.ChargeTypesDefinedMap
                        }
                    };
                    if ($scope.contextCriteriaMode === 'leftPane') {
                        $rootScope.$broadcast('showItemDetails', broadcastData);
                    } else {
                        $scope.openEditModal(item, elemObjType, isAdj, isOverride,$scope.ChargeTypesDefined,$scope.ChargeTypesDefinedMap);
                    }
                };

                $scope.$on('hideItemDetails', function() {
                    $scope.selectedProductId = '';
                });
                
                $scope.launchObjectTab = function(item, objAPIName, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var data = {
                        'doAction': 'viewRecord',
                        'doAPIName': objAPIName,
                        'obj': item,
                        'closeCurrentTab': false
                    };
                    var broadcastAction = {
                        'eventName': 'launchConsoleTab',
                        'eventData': data
                    };
                    if (window.frameElement !== null) {
                        // create a iframe resize event binding with the parent
                        window.parent.bindIframeEvents('broadcast', broadcastAction);
                    }
                };

                $scope.init = function() {
                	$scope.tabs = cpqService.getObjectPricingTabs($scope.pricingMode);
                    $scope.activeIdx = cpqService.getObjectPricingTabIdx($scope.pricingMode);
                    $scope.tabs[$scope.activeIdx].init = true;
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectTypes();
                };
                $scope.init();
            }
        };
    }
]);

},{}],25:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocDiscountProduct', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                promotionItem: '=',
                parentItem: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'DiscountProduct.tpl.html',
            controller: function($scope, $rootScope, $timeout,$sldsModal) {
                $scope.nsp = fileNsPrefix();
                $scope.items = [];
                $scope.OBJECT_NAME = 'PromotionItem__c';
                $scope.editObject = {};
                $scope.attrMap = {};
                $scope.attrObjMap = {};
                $scope.attrAssgnObjMap = {};
                $scope.facets = [];

                $scope.describeObjectByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log(objectName + ' getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };
                
                $scope.setupViewAttrs = function(section) {
                	
                	$scope.customViewData = {
                            'name': section.facetSectionObj[$scope.nsp + 'ViewUri__c'],
                            'attrs': {
                            	'editObject':$scope.editObject,
                            	'objectFields':$scope.objectFields,
                            	'objectPicklists':$scope.objectPicklists,
                            	'parentItem': $scope.parentItem
                            	
                            }
                        };
                	return $scope.customViewData;
                };
                
                $scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = { 
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' getObjectLayoutByName results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

				$scope.buildObjectLayout = function(results) {
					$scope.objFacets = results.facets;
					$scope.objectLayoutId = results.objLayout.Id;
					$scope.facets = [];
					if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
						angular.forEach($scope.objFacets, function(facet, idx) {
							facet.hasSectionCustomView = false;
							facet.active = (idx === 0);
							angular.forEach(facet.sections, function(section) {
								if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
									section.hasCustomView = true;
									facet.hasSectionCustomView = true;
								}
							});
							$scope.facets.push(facet);
						});
					}
					console.log($scope.objectAPIName + ' FACETS:', $scope.facets);
				};

                $scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }
                    $scope.editObject[$scope.nsp + 'PromotionId__c'] = $scope.parentItem.Id;

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editObject[key];
                        }
                    }
                    //delete the selected flag that is maintained for the selected item
                    delete $scope.editObject['SelectedType'];
                    delete itemToSave['SelectedType'];
                    if($scope.editObject[$scope.nsp + 'ProductId__c'] == undefined && $scope.editObject[$scope.nsp + 'CatalogCategoryId__c'] == undefined)
                    {
                    	cpqService.showNotification({
							type: 'error',
							content: 'Either a Product or a Catalog/Category is mandatory for a discount item ',
							autohide: true
						});
                    	if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    }
                    else
                    {
	                    var inputMap = {
	                        'objectName' : $scope.nsp + $scope.OBJECT_NAME,
	                        'inputMap' : itemToSave
	                    };
	                    remoteActions.invokeMethod('createPromotionItem', JSON.stringify(inputMap)).then(function(results) {
	                        console.log('create promo item results: ', results);
	                        $rootScope.$broadcast('refreshPromoItems', $scope.parentItem.Id);
	                        if (event) {
	                            event.currentTarget.innerText = originalText;
	                            event.currentTarget.disabled = false;
	                        }
	                        $scope.closeDetails();
	                        cpqService.showNotification({
								type: 'success',
								content: 'Promotion item created.',
								autohide: true
							});
	                    }, function(error) {
	                        cpqService.showNotification({
	                            type: 'error',
	                            title: 'Error',
	                            content: error.message
	                        });
	                        if (event) {
	                            event.currentTarget.innerText = 'Error!';
	                            $timeout(function() {
	                                event.currentTarget.innerText = originalText;
	                                event.currentTarget.disabled = false;
	                            }, 5000);
	                        }
	                    });
                    }
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    	
                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editObject[key] === null ? undefined : $scope.editObject[key]);
                        }
                    }
                    if($scope.editObject['SelectedType'] != undefined)
                	{
                    	if($scope.editObject['SelectedType'] == $scope.nsp + 'ProductId__c')
            			{
                    		itemToSave[$scope.nsp + 'CatalogCategoryId__c'] = null;
            			}
                    	else if($scope.editObject['SelectedType'] == $scope.nsp + 'CatalogCategoryId__c')
                		{
                    		itemToSave[$scope.nsp + 'ProductId__c'] = null;
                		}
                	}
                    delete $scope.editObject['SelectedType'];
                    if($scope.editObject[$scope.nsp + 'ProductId__c'] == undefined && $scope.editObject[$scope.nsp + 'CatalogCategoryId__c'] == undefined)
                    {
                    	cpqService.showNotification({
							type: 'error',
							content: 'Either a Product or a Catalog/Category is mandatory for a discount item ',
							autohide: true
						});
                    	if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    }
                    else
                    {
	                    var inputMap = { 'so' : JSON.stringify(itemToSave) };
	                    remoteActions.invokeMethod('updatePromotionItem', JSON.stringify(inputMap)).then(function(results) {
	                        console.log('save promo item results: ', results);
	                        $rootScope.$broadcast('refreshPromoItems', $scope.parentItem.Id);
	                        $scope.item = {};
	                        for (var key in results) {
	                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
	                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
	                                $scope.item[key] = results[key] + tzOffset;
	                            } else {
	                                $scope.item[key] = results[key];
	                            }
	                        }
	                        if (event) {
	                            event.currentTarget.innerText = originalText;
	                            event.currentTarget.disabled = false;
	                        }
	
	                        $scope.closeDetails();
	                        cpqService.showNotification({
								type: 'success',
								content: 'Promotion item saved.',
								autohide: true
							});
	                    }, function(error) {
	                        cpqService.showNotification({
	                            type: 'error',
	                            title: 'Error',
	                            content: error.message
	                        });
	                        if (event) {
	                            event.currentTarget.innerText = 'Error!';
	                            $timeout(function() {
	                                event.currentTarget.innerText = originalText;
	                                event.currentTarget.disabled = false;
	                            }, 5000);
	                        }
	                    });
                    }
                };

                $scope.init = function() {
                    $scope.getObjectLayoutByName($scope.OBJECT_NAME, 'Discount');
                    $scope.describeObjectByName($scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);

                    if ($scope.promotionItem == undefined || $scope.promotionItem.Id === undefined) {
                        $scope.displayMode = 'create';
                    } else {
                        $scope.displayMode = 'edit';
                        for (var key in $scope.promotionItem) {
                            if (key !== '$$hashKey') {
                                $scope.editObject[key] = $scope.promotionItem[key];
                            }
                        }
                    }
                };
                $scope.init();
            }
        };
    }
]);

},{}],26:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocDiscountProducts', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'DiscountProducts.tpl.html',
            controller: function($scope, $rootScope, $sldsModal, $compile) {
                $scope.nsp = fileNsPrefix();
                $scope.promotion = $scope.customViewAttrs.contextInfo.customObject;
                $scope.promotionId = $scope.promotion.Id;
                $scope.$on('updateAppliesToAllItemsField', function(event, data) {
                	$scope.appliesToAllItems = data[$scope.nsp + 'AppliesToAllItems__c'];
                	if($scope.appliesToAllItems)
                	{
	                    cpqService.showNotification({
	                        type: 'warning',
	                        title: 'WARNING',
	                        content: 'Discount Items will be ignored as the discount applies to all items in the cart'
	                    });
                	}
                });
                $scope.appliesToAllItems = $scope.promotion[$scope.nsp + 'AppliesToAllItems__c'];
            	if($scope.appliesToAllItems){
                    cpqService.showNotification({
                        type: 'warning',
                        title: 'WARNING',
                        content: 'Discount Items will be ignored as the discount applies to all items in the cart'
                    });
            	}
                $scope.OBJECT_NAME = 'PromotionItem__c';
                $scope.fieldSetName = 'discountitem';
                $scope.items = [];

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('vlocDiscountProducts - describeObject results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + $scope.fieldSetName] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + $scope.fieldSetName];
                        }
                        console.log('vlocDiscountProducts - getFieldSets results: ', $scope.fieldSet);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.$on('refreshPromoItems', function(event, data) {
                    $scope.getApplicableProducts();
                });

                $scope.getApplicableProducts = function() {
                    var inputMap = {
                        'promotionId' : $scope.promotionId,
                        'mode' : 'ITEMS_ONLY'
                    };
                    remoteActions.invokeMethod('getPromotionItems', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getPromotionApplicableProducts results: ', results);
                        $scope.items = results;
                        $scope.appliesToAllItems = $scope.promotion[$scope.nsp + 'AppliesToAllItems__c'];
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.selectItem = function(item) {
                    console.log('selectItem item: ', item);
                    var broadcastData = {
                        facetType: 'DISCOUNT_PRODUCT',
                        facetData: {
                            promotionItem: item
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Discount Item';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the Discount Item <i>' + item.Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete Discount Item';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete Discount Item results: ', results);
                            $rootScope.$broadcast('hideItemDetails');
                            $rootScope.$broadcast('refreshPromoItems', $scope.promotionId);
                            deleteModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.newItem = function() {
                    $scope.selectItem({});
                };

                $scope.init = function() {
                	$scope.appliesToAllItems = true;
                    $scope.getApplicableProducts();
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getFieldSetsByName($scope.nsp + $scope.OBJECT_NAME);
                };
                $scope.init();
            }
        };
    }
]);

},{}],27:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocEntityFilterInfoCard', ['remoteActions',
    function(remoteActions) {
        return {
            scope: {
                entityFilter: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'EntityFilterInfoCard.tpl.html',
            controller: function($scope) {
                $scope.nsp = fileNsPrefix();
                $scope.ruleConditions = [];

                $scope.getRuleConditions = function() {
                    var inputMap = {
                        'entityFilterId': $scope.entityFilter.Id
                    };
                    var inputMapJSON = JSON.stringify(inputMap);
                    var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                    remoteActions.invokeMethod('getRuleConditions', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('getRuleConditions:', results.ruleConditions);
                        $scope.ruleConditions = results.ruleConditions;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.init = function() {
                    $scope.getRuleConditions();
                };
                $scope.init();
            }
        };
    }
]);

},{}],28:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocFacetDetails', ['remoteActions',
    function(remoteActions) {
        return {
            scope: {
                maximizeFacetDetail: '=',
				showFacetDetail: '=',
				closeFacetDetails: '&'
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'VlocFacetDetails.tpl.html'
        };
    }
]);

},{}],29:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocFieldMetadata', ['$rootScope', 'remoteActions', 'cpqService',
    function($rootScope, remoteActions, cpqService) {
        return {
            scope: {
                objectName: '=',
                fieldName: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'FieldMetadata.tpl.html',
            controller: function($scope) {
                $scope.nsp = fileNsPrefix();

                $scope.describeField = function() {
                    var inputMap = { 
                        'objectName' : $scope.objectName,
                        'fieldName' : $scope.fieldName
                     };
                    remoteActions.invokeMethod('describeField', JSON.stringify(inputMap)).then(function(results) {
                        $scope.fieldMetadata = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.init = function() {
                    $scope.describeField();
                };
                $scope.init();
            }
        };
    }
]);

},{}],30:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocFunctionArgument', ['remoteActions', 'cpqService', 
    function(remoteActions, cpqService) {
        return {
            scope: {
                function: '=',
				argument: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'FunctionArgument.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.objectName = $scope.nsp + 'VlocityFunctionArgument__c';
				$scope.editObject = {};
				$scope.attrMap = {};
                $scope.attrObjMap = {};
                $scope.attrAssgnObjMap = {};
                $scope.facets = [];

                $scope.describeObjectByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log(objectName + ' getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

				$scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = { 
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' getObjectLayoutByName results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

				$scope.buildObjectLayout = function(results) {
					$scope.objFacets = results.facets;
					$scope.objectLayoutId = results.objLayout.Id;
					$scope.facets = [];
					if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
						angular.forEach($scope.objFacets, function(facet, idx) {
							facet.hasSectionCustomView = false;
							facet.active = (idx === 0);
							angular.forEach(facet.sections, function(section) {
								if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
									section.hasCustomView = true;
									facet.hasSectionCustomView = true;
								}
							});
							$scope.facets.push(facet);
						});
					}
					console.log($scope.objectAPIName + ' FACETS:', $scope.facets);
				};

				$scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editObject[key];
                        }
                    }

                    var inputMap = { 
                        'objectName': $scope.objectName,
                        'inputMap': itemToSave
                    };
                    remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('createObject results:', results);
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
						$rootScope.$broadcast('refreshFacetContent');
                        cpqService.showNotification({
							type: 'success',
							content: 'Function argument created.',
							autohide: true
						});
						$scope.closeDetails();
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editObject[key] === null ? undefined : $scope.editObject[key]);
                        }
                    }

                    var inputMap = { 'so': JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('updateObject results: ', results);
                        $scope.argument = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.argument[key] = results[key] + tzOffset;
                            } else {
                                $scope.argument[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $rootScope.$broadcast('refreshFacetContent');
                        cpqService.showNotification({
							type: 'success',
							content: 'Function argument saved.',
							autohide: true
						});
						$scope.closeDetails();
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

				$scope.init = function() {
                    $scope.describeObjectByName($scope.objectName);
                    $scope.getObjectPicklistsByName($scope.objectName);
					$scope.getObjectLayoutByName($scope.objectName, '');

					if ($scope.argument.Id === undefined) {
                        $scope.displayMode = 'create';
                        $scope.editObject[$scope.nsp + 'VlocityFunctionId__c'] = $scope.function.Id;
					} else {
						$scope.displayMode = 'edit';
                        for (var key in $scope.argument) {
                            if (key !== '$$hashKey') {
                                $scope.editObject[key] = $scope.argument[key];
                            }
                        }
					}
                };
                $scope.init();
			}
		};
	}
]);

},{}],31:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocFunctionArguments', ['remoteActions', 'cpqService', 
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'FunctionArguments.tpl.html',
            controller: function($scope, $rootScope, $timeout, $sldsModal) {
                $scope.nsp = fileNsPrefix();
                $scope.contextObject = $scope.customViewAttrs.contextInfo.customObject;
                $scope.objectName = $scope.nsp + 'VlocityFunctionArgument__c';

				$scope.$on('refreshFacetContent', function() {
					$scope.getFunctionArguments();
				});

                $scope.describeObjectByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log(objectName + ' getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

				$scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + 'functionarguments'] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + 'functionarguments'];
                        }
                        console.log(objectName + ' getFieldSets results:', $scope.fieldSet);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

				$scope.getFunctionArguments = function() {
                    var inputMap = {
                        'functionId': $scope.contextObject.Id
                    };
                    var inputMapJSON = JSON.stringify(inputMap);
                    var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                    remoteActions.invokeMethod('getFunctionArgumentList', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('getFunctionArgumentList:', results.functionArguments);
                        $scope.items = results.functionArguments;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

				$scope.newItem = function(event) {
                    $scope.editItem({}, event);
                };

				$scope.editItem = function(item, event) {
					if (event) {
                        event.stopPropagation();
                    }

                    var broadcastData = {
                        facetType: 'FUNCTION_ARGUMENT',
                        facetData: {
                            functionArgument: item,
							function: $scope.contextObject
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Function Argument';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the function argument <i>' + item.Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }

                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            $scope.getFunctionArguments();
                            deleteModal.hide();
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Function argument deleted.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

				$scope.init = function() {
                    $scope.describeObjectByName($scope.objectName);
                    $scope.getObjectPicklistsByName($scope.objectName);
					$scope.getFieldSetsByName($scope.objectName);
                    $scope.getFunctionArguments();
                };
                $scope.init();
			}
		};
	}
]);

},{}],32:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocGlobalPricingElements', ['remoteActions',
    function(remoteActions) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'GlobalPricingElements.tpl.html'
        };
    }
]);

},{}],33:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocImgCarousel', [function() {
    return {
        scope: {
            attachments: '='
        },
        replace: true,
        restrict: 'E',
        templateUrl: 'ImageCarousel.tpl.html',
        controller: function($scope) {
            $scope.nsp = fileNsPrefix();
            $scope.currentImg = null;
            $scope.currentIdx = -1;

            $scope.$watch('attachments', function(attachmentList) {
                angular.forEach(attachmentList, function(att, idx) {
                    if (att[$scope.nsp + 'ContentType__c'] === 'Image') {
                        $scope.currentImg = att;
                        $scope.currentIdx = idx;
                    }
                });
            }, true);

            $scope.switchImage = function(idx) {
                if (idx === -1) {
                    idx = $scope.attachments.length - 1;
                } else if (idx === $scope.attachments.length) {
                    idx = 0;
                }

                $scope.currentImg = $scope.attachments[idx];
                $scope.currentIdx = idx;
            };
        }
    };
}]);

},{}],34:[function(require,module,exports){
angular.module('epcadmin')
       .directive('vlocJsonEdit', ['$sldsModal', function($sldsModal) {
           var template = '<button style="padding:5px"class="slds-button slds-button--icon" ng-click="openModal()">'+
                          '    <slds-button-svg-icon sprite="\'utility\'" size="\'small\'" icon="\'edit\'">'+
                          '    </slds-button-svg-icon>'+
                          '   <span class="slds-assistive-text">Delete</span>'+
                          '</button>';
                          
           return {
               restrict: 'E',
               replace: true,
               scope:{
                   name: '=',
                   obj: '='
               },
               template: function(elem, attrs){
                   return attrs.template || template;
               },
               link: function(scope, element, attrs) {
                   var nsp = fileNsPrefix();
                   var enableEditForField = new RegExp(attrs.enableEdit);

                   if (!(enableEditForField.test(
                       scope.name.replace(nsp,"").replace('__c', "")
                   ))){
                       element.remove();
                       return ;
                   }

                   scope.openModal = function() {
                       var modalScope = scope.$new();

                       modalScope.jsonObj = _.toPairs(angular.fromJson(scope.obj || null));
                       modalScope.stringify = function() {
                           var parametersString = angular.toJson(_.fromPairs(this.jsonObj));
                           scope.obj = parametersString === '{}' ? '' : parametersString;
                       };

                       modalScope.add = function(item) {
                           this.jsonObj = this.jsonObj || [];
                           this.jsonObj.push(['','']);
                       };

                       modalScope.delete = function(item){
                           this.jsonObj = _.remove(this.jsonObj, function(pair) {
                               return (pair[0] === item[0]) && (pair[1] === item[1]);
                           });
                       };

                       try {
                           $sldsModal({
                               backdrop: 'static',
                               scope: modalScope,
                               show: true,
                               template:'VlocJson.tpl.html'
                           });
                       }catch(exception) {
                           console.log('error happened ', exception);
                       }
                   }
                   console.log('field is ' , scope.field, scope.obj);
               }
           }
       }]);

},{}],35:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocLayoutElement', ['$rootScope', 'remoteActions', 'cpqService',
    function($rootScope, remoteActions, cpqService) {
        return {
            scope: {
                layoutId: '=',
                item: '=',
                facetId: '=',
                sectionId: '=',
                objectName: '=',
                objectLayoutFields: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'LayoutElement.tpl.html',
            controller: function($scope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.fieldSet = null;
                $scope.objectFields = null;
                $scope.objectPicklists = {};
                $scope.elementObj = {};
                $scope.sectionElement = {};
                $scope.sectionElement.label = '';
                $scope.sectionElement.selectedItem = null;
                $scope.sectionElement.sequence = 0;
                $scope.sectionElement.showRequired = false;
                $scope.sectionElement.required = false;
                $scope.sectionElement.isRequiredDisabled = false;

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('describeObject ' + objectName + ' results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getFieldSets ' + objectName + ': ', results);
                        if (results[$scope.nsp.toLowerCase() + 'objectfacet'] !== undefined) {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + 'objectfacet'];
                        } else if (results[$scope.nsp.toLowerCase() + 'objectsection'] !== undefined) {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + 'objectsection'];
                        } else if (results[$scope.nsp.toLowerCase() + 'objectelement'] !== undefined) {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + 'objectelement'];
                        } else {
                            $scope.fieldSet = null;
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.elementObj) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.elementObj[key];
                        }
                    }

                    if ($scope.objectName === 'ObjectFacet__c') {
                        itemToSave[$scope.nsp + 'ObjectLayoutId__c'] = $scope.layoutId;
                    }
                    if ($scope.objectName === 'ObjectSection__c') {
                        itemToSave[$scope.nsp + 'ObjectFacetId__c'] = $scope.facetId;
                    }
                    if ($scope.objectName === 'ObjectElement__c') {
                        var selectedEl = $scope.sectionElement.selectedItem;
                        if (selectedEl.attrId === '') {
                            // selected section element is a field
                            var fieldApiName = selectedEl.fieldApiName;
                            itemToSave[$scope.nsp + 'FieldApiName__c'] = fieldApiName;
                            itemToSave[$scope.nsp + 'IsRequired__c'] = $scope.sectionElement.required;
                        } else {
                            // selected section element is an attribute
                            itemToSave[$scope.nsp + 'AttributeId__c'] = selectedEl.attrId;
                        }

                        itemToSave.Name = selectedEl.label;
                        var objectSectionId = $scope.sectionId;
                        if ( objectSectionId == null &&  $scope.elementObj && $scope.elementObj[$scope.nsp + 'ObjectSectionId__c']) {
                            objectSectionId = $scope.elementObj[$scope.nsp + 'ObjectSectionId__c'];
                        }
                        itemToSave[$scope.nsp + 'ObjectSectionId__c'] = objectSectionId;
                        itemToSave[$scope.nsp + 'Sequence__c'] = $scope.sectionElement.sequence;
                        itemToSave.Name = $scope.sectionElement.label;
                    }

                    if (itemToSave.Id === undefined) {
                        var inputMap = {
                            'objectName' : $scope.nsp + $scope.objectName,
                            'inputMap' : itemToSave
                        };
                        remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('create object ' + $scope.objectName + ' results: ', results);
                            $rootScope.$broadcast('refreshItems');
                            for (var key in results) {
                                $scope.elementObj[key] = results[key];
                            }
                            if (event) {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }
                            $scope.closeDetails();
                            //TODO: show save success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            if (event) {
                                event.currentTarget.innerText = 'Error!';
                                $timeout(function() {
                                    event.currentTarget.innerText = originalText;
                                    event.currentTarget.disabled = false;
                                }, 5000);
                            }
                        });
                    } else {
                        var inputMap = { 'so' : JSON.stringify(itemToSave) };
                        remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('save object ' + $scope.objectName + ' results: ', results);
                            $rootScope.$broadcast('refreshItems');
                            $scope.elementObj = {};
                            for (var key in results) {
                                $scope.elementObj[key] = results[key];
                            }
                            if (event) {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }
                            $scope.closeDetails();
                            //TODO: show save success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            if (event) {
                                event.currentTarget.innerText = 'Error!';
                                $timeout(function() {
                                    event.currentTarget.innerText = originalText;
                                    event.currentTarget.disabled = false;
                                }, 5000);
                            }
                        });
                    }
                };

                $scope.selectSectionElement = function() {
                    var selectedEl = $scope.sectionElement.selectedItem;
                    $scope.sectionElement.label = selectedEl.label;
                    if (selectedEl.field !== null && selectedEl.field.isRequired) {
                        $scope.sectionElement.required = true;
                        $scope.sectionElement.isRequiredDisabled = true;
                    } else {
                        $scope.sectionElement.required = false;
                        $scope.sectionElement.isRequiredDisabled = false;
                    }
                    $scope.sectionElement.showRequired = (selectedEl.attrId === '');
                };

                $scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.init = function() {
                    console.log('$scope.objectLayoutFields: ', $scope.objectLayoutFields);
                    var key;
                    if ($scope.item !== undefined) {
                        for (key in $scope.item) {
                            if (key !== '$$hashKey') {
                                $scope.elementObj[key] = $scope.item[key];
                            }
                        }
                    }

                    $scope.getObjectPicklistsByName($scope.nsp + $scope.objectName);
                    $scope.getFieldSetsByName($scope.nsp + $scope.objectName);
                    $scope.describeObject($scope.nsp + $scope.objectName);

                    if ($scope.objectName === 'ObjectElement__c') {
                        $scope.sectionElement.label = ($scope.elementObj.Name || '');
                        $scope.sectionElement.sequence = $scope.elementObj[$scope.nsp + 'Sequence__c'];
                        $scope.sectionElement.required = $scope.elementObj[$scope.nsp + 'IsRequired__c'];

                        // setup the section element dropdown
                        for (var i = 0; i < $scope.objectLayoutFields.length; i++) {
                            var el = $scope.objectLayoutFields[i];
                            if ($scope.elementObj[$scope.nsp + 'FieldApiName__c']) {
                                $scope.sectionElement.showRequired = true;
                                if (el.fieldApiName !== null) {
                                    if (el.fieldApiName === $scope.elementObj[$scope.nsp + 'FieldApiName__c']) {
                                        $scope.sectionElement.selectedItem = el;
                                        if (el.field !== null && el.field.isRequired) {
                                            $scope.sectionElement.required = true;
                                            $scope.sectionElement.isRequiredDisabled = true;
                                        }
                                        break;
                                    }
                                }
                            } else {
                                $scope.sectionElement.showRequired = false;
                                if (el.attrId === $scope.elementObj[$scope.nsp + 'AttributeId__c']) {
                                    $scope.sectionElement.selectedItem = el;
                                    break;
                                }
                            }
                        }
                    }
                };
                $scope.init();
            }
        };
    }
]);

},{}],36:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocLayoutManagement', ['$rootScope', 'remoteActions', 'cpqService',
    function($rootScope, remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'LayoutManagement.tpl.html',
            controller: function($scope, $sldsModal) {
                $scope.nsp = fileNsPrefix();
                $scope.objectId = $scope.customViewAttrs.contextInfo.customObject.Id;
                $scope.selfLayout = ($scope.customViewAttrs.contextInfo.selfLayout !== undefined && $scope.customViewAttrs.contextInfo.selfLayout);
                $scope.layout = [];

                $scope.$on('refreshItems', function() {
                    $scope.getObjectLayoutById($scope.objectId, false);
                });

                $scope.getObjectLayoutById = function(objectId, fromParent) {
                    var inputMap = { 
                        'objectId' : objectId,
                        'isInherited' : fromParent,
                        'forSelf': $scope.selfLayout
                    };
                    remoteActions.invokeMethod('getObjectLayoutById', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectLayoutById layout manager results: ', results);
                        $scope.objFacets = results.facets;
                        if (results.objLayout) {
                            $scope.objectLayoutId = results.objLayout.Id;
                        } else {
                            $scope.objectLayoutId = null;
                        }
                        $scope.facets = [];
                        if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
                            angular.forEach($scope.objFacets, function(facet, idx) {
                                facet.hasSectionCustomView = false;
                                facet.active = (idx === 0);
                                angular.forEach(facet.sections, function(section) {
                                    if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                                        section.hasCustomView = true;
                                        facet.hasSectionCustomView = true;
                                    }
                                });
                                $scope.facets.push(facet);
                            });
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.selectItem = function(item, objectName) {
                    var broadcastData = {
                        facetType: 'LAYOUT_ELEMENT',
                        facetData: {
                            objectLayoutId: $scope.objectLayoutId,
                            elementObj: item,
                            objectName: objectName,
                            objectLayoutFields: $scope.attrFieldList
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.editItem = function(item, objectName, event) {
                    if (event) {
                        event.stopPropagation();
                    }
                    $scope.selectItem(item, objectName);
                };

                $scope.deleteItem = function(item, itemName, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Section Element';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the section element <i>' + itemName + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete Section Element';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete section element results: ', results);
                            $scope.getObjectLayoutById($scope.objectId, false);
                            deleteModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.deleteFacet = function(item, itemName, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Facet';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the facet <i>' + itemName + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete Facet';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectFacet' : JSON.stringify(itemToDelete) };
                        remoteActions.invokeMethod('deleteFacet', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete facet results: ', results);
                            $scope.getObjectLayoutById($scope.objectId, false);
                            deleteModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.deleteSection = function(item, itemName, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Section';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the section <i>' + itemName + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete Section';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'section' : JSON.stringify(itemToDelete) };
                        remoteActions.invokeMethod('deleteSection', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete section results: ', results);
                            $scope.getObjectLayoutById($scope.objectId, false);
                            deleteModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.addFacet = function() {
                    var broadcastData = {
                        facetType: 'LAYOUT_ELEMENT',
                        facetData: {
                            objectLayoutId: $scope.objectLayoutId,
                            objectName: 'ObjectFacet__c'
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.addSection = function(fId) {
                    console.log('addSection(' + fId + ')');
                    var broadcastData = {
                        facetType: 'LAYOUT_ELEMENT',
                        facetData: {
                            objectFacetId: fId,
                            objectName: 'ObjectSection__c'
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.addSectionElement = function(sId) {
                    var broadcastData = {
                        facetType: 'LAYOUT_ELEMENT',
                        facetData: {
                            objectSectionId: sId,
                            objectName: 'ObjectElement__c',
                            objectLayoutFields: $scope.attrFieldList
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.getAttributeFieldBindingData = function() {
                    $scope.attributeMap = {};
                    $scope.attrFieldList = [];

                    var inputMap = { 
                        'objectId' : $scope.objectId,
                        'allObjectAttributes' : false
                    };
                    remoteActions.invokeMethod('getAttributeFieldBindingData', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getAttributeFieldBindingData results: ', results);
                        var fieldList = results.Field;
                        var attributes = parseAAWrapper(results.AAWrapper);
                        $scope.attrFieldList = [];

                        var boundAttrMap = {};
                        var boundFieldMap = {};
                        angular.forEach(results.AttributeBinding__c, function(binding) {
                            var attrId = binding[$scope.nsp + 'AttributeId__c'];
                            var attrObj = $scope.attributeMap[attrId];
                            if (attrObj!= null) {                            
                                var attrName = attrObj.Name;
                                var attrCode = attrObj.Code;
                                var fieldName = binding[$scope.nsp + 'FieldApiName__c'];
                                boundAttrMap[attrId] = {'fieldApiName': fieldName, 'BindingId': binding.Id, 'fieldObj': fieldList[fieldName]};
                                boundFieldMap[fieldName] = {'Id': attrId, 'Name': attrName, 'Code': attrCode, 'BindingId': binding.Id};
                            }
                        });
                        angular.forEach(attributes, function(attr) {
                            var item = {};
                            item.attrId = attr.Id;
                            item.attrName = attr.Name;
                            item.attrCode = attr.Code;
                            item.label = attr.Name;
                            item.value = attr.Id;
                            if (boundAttrMap[attr.Id] === undefined) {
                                // unbound attribute
                                item.bound = false;
                                item.field = null;
                                item.fieldApiName = null;
                            } else {
                                // bound attribute/field
                                item.bound = true;
                                item.field = boundAttrMap[attr.Id].fieldObj;
                                item.fieldApiName = boundAttrMap[attr.Id].fieldApiName;
                                item.bindingId = boundAttrMap[attr.Id].BindingId;
                            }
                            item.idx = $scope.attrFieldList.length;
                            $scope.attrFieldList.push(item);
                        });
                        for (var fieldName in fieldList) {
                            var item = {};
                            if (boundFieldMap[fieldName] === undefined) {
                                // unbound field
                                item.bound = false;
                                item.field = fieldList[fieldName];
                                item.label = fieldList[fieldName].label;
                                item.fieldApiName = fieldName;
                                item.value = fieldName;
                                item.attrId = '';
                                item.attrName = '';
                                item.attrCode = '';
                                item.idx = $scope.attrFieldList.length;
                                $scope.attrFieldList.push(item);
                            }
                        }
                        console.log('$scope.attrFieldList: ', $scope.attrFieldList);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                function parseAAWrapper(aList) {
                    var attributes = [];
                    angular.forEach(aList, function(aItem) {
                        var attr = {};
                        if (aItem.aa) {
                            // use attribute assignment
                            attr.aaId = aItem.aa.Id;
                            attr.Id = aItem.aa[$scope.nsp + 'AttributeId__c'];
                            attr.Name = aItem.aa[$scope.nsp + 'AttributeDisplayName__c'];
                            attr.Code = aItem.aa[$scope.nsp + 'AttributeUniqueCode__c'];
                        } else {
                            // use attribute
                            attr.Id = aItem.attribute.Id;
                            attr.Name = aItem.attribute.Name;
                            attr.Code = aItem.attribute[$scope.nsp + 'Code__c'];
                        }
                        $scope.attributeMap[attr.Id] = attr;
                        attributes.push(attr);
                    });
                    return attributes;
                }

                $scope.createCustomLayout = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Creating Layout...';
                    }
                    var inputMap = { 
                        'objectId' : $scope.objectId
                    };
                    remoteActions.invokeMethod('createObjectLayoutForSelfById', JSON.stringify(inputMap)).then(function(results) {
                        console.log('createObjectLayoutForSelfById results: ', results);
                        $scope.objFacets = results.facets;
                        if (results.objLayout) {
                            $scope.objectLayoutId = results.objLayout.Id;
                        } else {
                            $scope.objectLayoutId = null;
                        }
                        $scope.facets = [];
                        if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
                            angular.forEach($scope.objFacets, function(facet, idx) {
                                facet.hasSectionCustomView = false;
                                facet.active = (idx === 0);
                                angular.forEach(facet.sections, function(section) {
                                    if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                                        section.hasCustomView = true;
                                        facet.hasSectionCustomView = true;
                                    }
                                });
                                $scope.facets.push(facet);
                            });
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.init = function() {
                    console.log('initting layout mgr');
                    $scope.getObjectLayoutById($scope.objectId, false);
                    $scope.getAttributeFieldBindingData();
                };
                $scope.init();
            }
        };
    }
]);

},{}],37:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocObjAttrsFields', ['$rootScope', 'remoteActions', '$sldsModal', 'cpqService',
    function($rootScope, remoteActions, $sldsModal, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'VlocObjAttrsFields.tpl.html',
            controller: function($scope) {
                console.log('INIT: ', $scope.customViewAttrs);
                $scope.nsp = fileNsPrefix();
                $scope.objectId = $scope.customViewAttrs.contextInfo.customObject.Id;
                $scope.objectAPIName = ($scope.customViewAttrs.objectApiName || $scope.customViewAttrs.contextInfo.customObjectAPIName);
                $scope.items = [];

                $scope.$on('refreshItems', function() {
                    $scope.getAppliedAttributesFields();
                });

                $scope.getAppliedAttributesFields = function() {
                    $scope.AttrObjMap = {};
                    $scope.AttrAssgnObjMap = {};
                    $scope.attributeMap = {};
                    var items = [];
                    $scope.assignedItems = {};
                    $scope.allSelected = false;
                    $scope.selectedCount = 0;

                    var inputMap = { 'objectId' : $scope.objectId };
                    remoteActions.invokeMethod('getAppliedAttributesFields', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getAppliedAttributesFields results:', results);
                        angular.forEach(results, function(r) {
                            var item = {};
                            item.isSelected = false;

                            if (r.field) {
                                item.type = 'Field';
                                item.fieldName = r.objectFieldAttribute[$scope.nsp + 'FieldApiName__c'];
                                item.fieldLabel = r.field.label;
                                item.name = item.fieldLabel;
                                item.attrId = '';
                                item.attrName = '';
                                item.attrCode = '';
                                $scope.assignedItems[item.fieldName] = '';
                            } else if (r.aaWrapper) {
                                item.type = 'Attribute';
                                var aItem = r.aaWrapper;
                                if (aItem.attributeAssignment) {
                                    // use attribute assignment
                                    item.aaId = aItem.attributeAssignment.Id;
                                    item.attrId = aItem.attributeAssignment[$scope.nsp + 'AttributeId__c'];
                                    item.attrName = aItem.attributeAssignment[$scope.nsp + 'AttributeDisplayName__c'];
                                    item.name = item.attrName;
                                    item.attrCode = aItem.attributeAssignment[$scope.nsp + 'AttributeUniqueCode__c'];
                                    $scope.AttrAssgnObjMap[item.attrId] = aItem.attributeAssignment;
                                } else {
                                    // use attribute
                                    item.attrId = aItem.attribute.Id;
                                    item.attrName = aItem.attribute.Name;
                                    item.name = item.attrName;
                                    item.attrCode = aItem.attribute[$scope.nsp + 'Code__c'];
                                    $scope.AttrAssgnObjMap[item.attrId] = null;
                                }
                                item.fieldName = '';
                                item.fieldLabel = '';
                                $scope.AttrObjMap[item.attrId] = aItem.attribute;
                                $scope.assignedItems[item.attrId] = '';
                                $scope.attributeMap[item.attrId] = aItem.attribute;
                            }
                            items.push(item);
                        });
                        $scope.items = items;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.selectAll = function() {
                    angular.forEach($scope.items, function(item) {
                        item.isSelected = $scope.allSelected;
                        $scope.selectItem(item);
                    });
                    $scope.selectedCount = ($scope.allSelected ? $scope.items.length : 0);
                };

                $scope.selectItem = function(item) {
                    if (item.isSelected) {
                        $scope.selectedCount++;
                    } else {
                        $scope.selectedCount--;
                        $scope.allSelected = false;
                    }
                };

                $scope.unassignAttrsFields = function() {
                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Unassign Attributes and Fields';
                    modalScope.confirmationMsg = 'The attributes and fields will also be removed from all child object types and object instances.';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Unassign';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var selectedAttrList = [];
                        angular.forEach($scope.items, function(item) {
                            if (item.isSelected) {
                                console.log('unapplyFieldAttribute', item);
                                var inputMap = { 
                                    'objectId' : $scope.objectId,
                                    'fieldName' : item.fieldName,
                                    'attributeId' : item.attrId
                                };
                                remoteActions.invokeMethod('unapplyFieldAttribute', JSON.stringify(inputMap)).then(function(results) {
                                    console.log('unapplyFieldAttribute results: ', results);
                                    $scope.getAppliedAttributesFields();
                                    deleteModal.hide();
                                }, function(error) {
                                    cpqService.showNotification({
                                        type: 'error',
                                        title: 'Error',
                                        content: error.message
                                    });
                                    deleteModal.hide();
                                });
                            }
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                
                };

                $scope.showAllAttrsFields = function() {
                    var broadcastData = {
                        facetType: 'ASSIGN_ATTRS_FIELDS',
                        facetData: {
                            objectId: $scope.objectId,
                            assignedItems: $scope.assignedItems
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.showAttributeMetadata = function(attrId) {
                    var broadcastData = {
                        facetType: 'ATTR_METADATA',
                        facetData: {
                            objectId: $scope.objectId,
                            attrId: attrId
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.showFieldMetadata = function(fieldName) {
                    var broadcastData = {
                        facetType: 'FIELD_METADATA',
                        facetData: {
                            objectName: $scope.objectAPIName,
                            fieldName: fieldName
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.init = function() {
                    $scope.getAppliedAttributesFields();
                };
                $scope.init();
            }
        };
    }
]);

},{}],38:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocObjField', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                displayMode: '=',
                parentObj: '=',
                formElementName: '=',
                fieldName: '=',
                fieldInfo: '=',
                objPicklists: '=',
                isRequired: '=',
                isDisabled: '=',
                changeCallbackFn: '&',
                pricingMode: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ObjectField.tpl.html',
            controller: function($scope, $sldsModal, $timeout) {
            	$scope.nsp = fileNsPrefix();
                $scope.initLookupItem = function() {
                    var referencedFieldName;
                    $scope.lookupMap = {};
                    $scope.lookupObj = {
                        selectedItem: $scope.parentObj[$scope.fieldName]
                    };

                    var referencedId = $scope.parentObj[$scope.fieldName];
                    if(($scope.pricingMode != undefined && $scope.pricingMode === 'DISCOUNT') && $scope.fieldName == $scope.nsp + 'TimePolicyId__c' && $scope.parentObj[$scope.nsp + 'TimePolicyId__c'] == null)
                	{
                    	$scope.getDefaultTimePlanObject();
                	}
                    if (referencedId !== undefined && referencedId !== '' && referencedId !== null) {
                        if ($scope.fieldName.endsWith('__c')) {
                            referencedFieldName = $scope.fieldName.substring(0, ($scope.fieldName.length - 1)) + 'r';
                        } else {
                            referencedFieldName = $scope.fieldName.substring(0, ($scope.fieldName.length - 2));
                        }

                        if ($scope.parentObj[referencedFieldName] === undefined) {
                            $scope.getReferencedFieldObject(referencedId);
                        } else {
                            $scope.lookupObj.selectedItem = $scope.parentObj[referencedFieldName].Name;
                        }
                    }
                };
                
                $scope.getDefaultTimePlanObject = function() {
                	var inputMap = {};
                    remoteActions.invokeMethod('getDefaultTimePlanForDiscount', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getDefaultTimePlan results: ', results);
                        if(results !== undefined)
                        {
                        	$scope.lookupObj.selectedItem = results.Name;
                        	$scope.parentObj[$scope.nsp + 'TimePolicyId__c'] = results.Id;
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getReferencedFieldObject = function(objectId) {
                    var inputMap = { 'objectId' : objectId };
                    remoteActions.invokeMethod('getObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getReferencedFieldObject results: ', results);
                        $scope.lookupObj.selectedItem = results.Name;
                        $scope.parentObj[$scope.fieldName] = objectId;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.searchReferenceField = function(event) {
                    var modalScope = $scope.$new();
                    modalScope.nsp = fileNsPrefix();
                    modalScope.modalTitle = $scope.fieldInfo.label + ' Lookup';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.fieldInfo = $scope.fieldInfo;
                    modalScope.searchResults = null;
                    modalScope.searchCfg = {
                        currentPage: 1,
                        totalPages: 1,
                        searchTerm: ($scope.lookupObj.selectedItem || '')
                    };

                    modalScope.getFieldSetsByName = function() {
                        var inputMap = { 'objectName' : modalScope.fieldInfo.referenceTo };
                        remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                            if (results[modalScope.nsp.toLowerCase() + 'consoleadminsearch'] === undefined) {
                                remoteActions.invokeMethod('getNameFieldDescriptionForObject', JSON.stringify(inputMap)).then(function(result) {
                                    if (result === null) {
                                        modalScope.fieldSet = [{'fieldLabel': 'Id', 'fieldPath': 'Id', 'type': 'STRING'}];
                                    } else {
                                        modalScope.fieldSet = [{'fieldLabel': result.label, 'fieldPath': result.name, 'type': 'STRING'}];
                                    }
                                });
                            } else {
                                modalScope.fieldSet = results[modalScope.nsp.toLowerCase() + 'consoleadminsearch'];
                            }
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                        });
                    };

                    modalScope.searchReferenceField = function(pageNum) {
                        if (pageNum) {
                            modalScope.searchCfg.currentPage = pageNum;
                        }
                        if (modalScope.searchCfg.currentPage < 1) {
                            modalScope.searchCfg.currentPage = 1;
                        }
                        if (modalScope.searchCfg.totalPages !== 0 && (modalScope.searchCfg.currentPage > modalScope.searchCfg.totalPages)) {
                            modalScope.searchCfg.currentPage = modalScope.searchCfg.totalPages;
                        }

                        var searchTerm = modalScope.searchCfg.searchTerm.trim().toLowerCase();
                        if (searchTerm === '') {
                            searchTerm = '%';
                        }
                        var searchInputMap = {
                            'objectType': modalScope.fieldInfo.referenceTo,
                            'searchString': searchTerm,
                            'pageNumber': modalScope.searchCfg.currentPage,
                            'fieldSetName': 'consoleadminsearch'
                        };
                        var searchInputMapJSON = JSON.stringify(searchInputMap);
                        remoteActions.invokeMethod('getSearchResultsMap', searchInputMapJSON).then(function(response) {
                            console.log('search results for ' + searchTerm + ': ', response);
                            modalScope.searchCfg.previousPage = response.previousPage;
                            modalScope.searchCfg.nextPage = response.nextPage;
                            modalScope.searchCfg.totalCount = response.totalCount;
                            modalScope.searchCfg.totalPages = response.totalPages;
                            modalScope.searchCfg.pageSize = response.pageSize;
                            modalScope.searchCfg.fromCount = response.fromCount;
                            modalScope.searchCfg.toCount = response.toCount;
                            modalScope.searchCfg.nameField = response.nameField;
                            modalScope.searchResults = response.results;
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                        });
                    };

                    modalScope.setReferenceField = function(itemId, itemName) {
                        modalScope.$parent.setReferenceField(itemId, itemName);
                        lookupReferenceModal.hide();
                    };

                    var lookupReferenceModal = $sldsModal({
                        templateUrl: 'LookupReferenceModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });

                    if (modalScope.searchCfg.searchTerm.trim().length > 0) {
                        modalScope.searchReferenceField(1);
                    }
                    $timeout(function() {
                        j$('#searchTerm').focus();
                    });
                };

                $scope.setReferenceField = function(itemId, itemName) {
                    $scope.lookupObj.selectedItem = itemName;
                    $scope.parentObj[$scope.fieldName] = itemId;
                    $scope.lookupMap[itemName] = itemId;
                };

                $scope.clearReferenceField = function(event) {
                    if (!$scope.fieldProp.disabled) {
                        $scope.lookupObj.selectedItem = '';
                    }
                };

                $scope.selectLookupItem = function(luItem) {
                    if (luItem === null) {
                        var itemId = $scope.lookupMap[$scope.lookupObj.selectedItem];
                        $scope.parentObj[$scope.fieldName] = (itemId || '');
                    } else {
                        $scope.lookupObj.selectedItem = luItem.Name;
                        $scope.parentObj[$scope.fieldName] = luItem.Id;
                    }
                    $scope.lookupObj.showItems = false;
                };

                $scope.setMultiPicklistValues = function() {
                    if ($scope.selectedItems.mpd === undefined || $scope.selectedItems.mpd.length === 0) {
                        $scope.parentObj[$scope.fieldName] = '';
                    } else {
                        $scope.parentObj[$scope.fieldName] = $scope.selectedItems.mpd.join(';');
                    }
                };

                $scope.init = function() {
                    $scope.fieldProp = {};
                    if ($scope.fieldInfo !== undefined) {
                        $scope.fieldProp.required = ($scope.fieldInfo.isRequired || $scope.isRequired);
                        if ($scope.displayMode === 'create') {
                            $scope.fieldProp.disabled = ($scope.isDisabled || !$scope.fieldInfo.isCreateable);
                        }
                        if ($scope.displayMode === 'edit') {
                            $scope.fieldProp.disabled = ($scope.isDisabled || !$scope.fieldInfo.isUpdateable);
                        }

                        if ($scope.fieldInfo.type === 'DATE') {
                            if ($scope.parentObj[$scope.fieldName] !== undefined) {
                                var timezoneOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.parentObj[$scope.fieldName] += timezoneOffset;
                            }
                        }
                        if ($scope.fieldInfo.type === 'REFERENCE') {
                            $scope.initLookupItem();
                        }
                        if ($scope.fieldInfo.type === 'PICKLIST' || $scope.fieldInfo.type === 'OTPICKLIST') {
                            if ($scope.parentObj[$scope.fieldName] === undefined) {
                                if ($scope.displayMode === 'create') {
                                    angular.forEach($scope.objPicklists, function(o) {
                                        if (o.isDefault) {
                                            $scope.selectedPicklistItem = o.value;
                                        }
                                    });
                                }
                            } else {
                                $scope.selectedPicklistItem = $scope.parentObj[$scope.fieldName];
                            }
                        }
                        if ($scope.fieldInfo.type === 'MULTIPICKLIST') {
                            $scope.selectedItems = {
                                mpd: []
                            };
                            var selectedValues = $scope.parentObj[$scope.fieldName];
                            if (selectedValues !== undefined) {
                                var values = selectedValues.split(';');
                                angular.forEach($scope.objPicklists, function(o) {
                                    if (values.indexOf(o.value) !== -1) {
                                        o.selected = true;
                                        $scope.selectedItems.mpd.push(o.value);
                                    } else {
                                        o.selected = false;
                                    }
                                });
                            }
                        }
                        if ($scope.fieldInfo.type === 'BOOLEAN') {
                            if ($scope.parentObj[$scope.fieldName] === undefined) {
                                $scope.parentObj[$scope.fieldName] = false;
                            }
                        }
                    }
                };
                $scope.init();

                var initializing = true;
                $scope.$watch('fieldInfo', function(newValue) {
                    if (initializing) {
                        $timeout(function() { initializing = false; });
                    } else {
                        $scope.init();
                    }
                }, true);

                var initializing2 = true;
                $scope.$watch('lookupObj.selectedItem', function(newValue) {
                    if (initializing2) {
                        $timeout(function() { initializing2 = false; });
                    } else {
                        if (newValue === '') {
                            $scope.parentObj[$scope.fieldName] = '';
                        }
                    }
                }, true);
            }
        };
    }
]);

},{}],39:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocObjectClassAttrsFields', ['$rootScope', 'remoteActions', 'cpqService',
    function($rootScope, remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'VirObjClassAttrs.tpl.html',
            controller: function($scope) {
                console.log('INIT: ', $scope.customViewAttrs);
                $scope.nsp = fileNsPrefix();
                $scope.objectId = $scope.customViewAttrs.objectId;
                $scope.objectName = $scope.customViewAttrs.objectApiName;
                $scope.attrList = [];
                $scope.fieldList = [];
                $scope.filter = {
                    ua: true,
                    ba: true,
                    uf: true,
                    bf: true
                };

                $scope.$on('refreshItems', function() {
                    $scope.getAttributeFieldBindingData();
                });

                $scope.getAttributeFieldBindingData = function() {
                    $scope.AttrObjMap = {};
                    $scope.AttrAssgnObjMap = {};
                    $scope.attributeMap = {};
                    $scope.fieldMap = {};
                    $scope.items = [];
                    $scope.allSelected = false;
                    $scope.selectedCount = 0;

                    var inputMap = { 
                        'objectId' : $scope.objectId,
                        'allObjectAttributes' : true
                    };
                    remoteActions.invokeMethod('getAttributeFieldBindingData', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getAttributeFieldBindingData results: ', results);
                        $scope.bindings = results.AttributeBinding__c;
                        $scope.fields = results.Field;
                        $scope.parseAAWrapper(results.AAWrapper);
                        var attrList = [];
                        var fieldList = [];

                        var boundAttrMap = {};
                        var boundFieldMap = {};
                        angular.forEach($scope.bindings, function(binding) {
                            var attrId = binding[$scope.nsp + 'AttributeId__c'];
                            var attrObj = $scope.attributeMap[attrId];
                            var attrName = attrObj.Name;
                            var attrCode = attrObj.Code;
                            var fieldName = binding[$scope.nsp + 'FieldApiName__c'];
                            boundAttrMap[attrId] = {'Name': fieldName, 'Label': $scope.fields[fieldName].label};
                            boundFieldMap[fieldName] = {'Id': attrId, 'Name': attrName, 'Code': attrCode};
                        });
                        angular.forEach($scope.attributes, function(attr) {
                            var item = {};
                            item.isSelected = false;
                            item.attrId = attr.Id;
                            item.attrName = attr.Name;
                            item.attrCode = attr.Code;

                            if (boundAttrMap[attr.Id] === undefined) {
                                item.bound = false;
                                item.fieldName = '';
                                item.fieldLabel = '';
                            } else {
                                item.bound = true;
                                item.fieldName = boundAttrMap[attr.Id].Name;
                                item.fieldLabel = boundAttrMap[attr.Id].Label;
                            }

                            attrList.push(item);
                            $scope.items.push(item);
                        });
                        for (var fieldName in $scope.fields) {
                            var field = {'name': fieldName, 'label': $scope.fields[fieldName].label};
                            var item = {};
                            item.isSelected = false;
                            item.fieldName = fieldName;
                            item.fieldLabel = field.label;

                            if (boundFieldMap[fieldName] === undefined) {
                                item.bound = false;
                                item.attrId = '';
                                item.attrName = '';
                                item.attrCode = '';
                                $scope.items.push(item);
                            } else {
                                item.bound = true;
                                item.attrId = boundFieldMap[fieldName].Id;
                                item.attrName = boundFieldMap[fieldName].Name;
                                item.attrCode = boundFieldMap[fieldName].Code;
                            }

                            fieldList.push(item);
                        }

                        $scope.attrList = attrList;
                        $scope.fieldList = fieldList;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.parseAAWrapper = function(aList) {
                    $scope.attributes = [];
                    angular.forEach(aList, function(aItem) {
                        var attr = {};
                        if (aItem.attributeAssignment) {
                            // use attribute assignment
                            attr.aaId = aItem.attributeAssignment.Id;
                            attr.Id = aItem.attributeAssignment[$scope.nsp + 'AttributeId__c'];
                            attr.Name = aItem.attributeAssignment[$scope.nsp + 'AttributeDisplayName__c'];
                            attr.Code = aItem.attributeAssignment[$scope.nsp + 'AttributeUniqueCode__c'];
                            $scope.AttrAssgnObjMap[attr.Id] = aItem.attributeAssignment;
                        } else {
                            // use attribute
                            attr.Id = aItem.attribute.Id;
                            attr.Name = aItem.attribute.Name;
                            attr.Code = aItem.attribute[$scope.nsp + 'Code__c'];
                            $scope.AttrAssgnObjMap[attr.Id] = null;
                        }
                        $scope.AttrObjMap[attr.Id] = aItem.attribute;
                        $scope.attributeMap[attr.Id] = attr;
                        $scope.attributes.push(attr);
                    });
                };

                $scope.showAttributeMetadata = function(attrId) {
                    var broadcastData = {
                        facetType: 'ATTR_METADATA',
                        facetData: {
                            objectId: $scope.objectId,
                            attrId: attrId
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.showFieldMetadata = function(objectName, fieldName) {
                    var objApiName = $scope.objectName;
                    var broadcastData = {
                        facetType: 'FIELD_METADATA',
                        facetData: {
                            objectName: objApiName,
                            fieldName: fieldName
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.init = function() {
                    $scope.getAttributeFieldBindingData();
                };
                $scope.init();
            }
        };
    }
]);

},{}],40:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocObjectPricing', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ObjectPricing.tpl.html',
            controller: function($scope, $rootScope, $sldsModal, $compile, $sldsPopover) {
                $scope.nsp = fileNsPrefix();
                $scope.objectId = $scope.customViewAttrs.contextInfo.customObject.Id;
                $scope.pricingMode = $scope.customViewAttrs.contextInfo.pricingMode;
                $scope.tabs = [];
                $scope.pleResultsMap = {
                    'Charge': {},
                    'Usage': {},
                    'Adjustment': {},
                    'Override': {},
                    'Cost': {}
                };
                $scope.ChargeResults = $scope.pleResultsMap['Charge'];
                $scope.UsageResults = $scope.pleResultsMap['Usage'];
                $scope.AdjustmentResults = $scope.pleResultsMap['Adjustment'];
                $scope.OverrideResults = $scope.pleResultsMap['Override'];
                $scope.CostResults = $scope.pleResultsMap['Cost'];

                $scope.OBJECT_NAME = 'PriceListEntry__c';

                $scope.$on('refreshObjectPricingElements', function() {
                    $scope.getPriceListEntriesData();
                });

                $scope.getPriceListEntries = function(priceListEntryType, pageNum, maxPages) {
                    if (pageNum < 1) {
                        pageNum = 1;
                    }
                    if (maxPages && (maxPages !== 0) && (pageNum > maxPages)) {
                        pageNum = maxPages;
                    }
                    var inputMap = {
                        'priceListEntryType': priceListEntryType,
                        'pageNumber': pageNum
                    };
                    if ($scope.pricingMode === 'PRICELIST') {
                        var pricelistIds = [];
                        pricelistIds.push($scope.objectId);
                        inputMap['PriceListIds'] = pricelistIds;
                    } else if ($scope.pricingMode === 'PRODUCT') {
                        var productIds = [];
                        productIds.push($scope.objectId);
                        inputMap['ProductIds'] = productIds;
                    }
                    var inputs = {
                        'input' : JSON.stringify(inputMap),
                        'options' : ''
                    };
                    remoteActions.invokeMethod('getPagedPricingElements', JSON.stringify(inputs)).then(function(results) {
                        console.log('getPricingElements for ' + priceListEntryType + ' results: ', results);
                        results.currentPage = pageNum;
                        $scope.pleResultsMap[priceListEntryType] = results;
                        $scope.ChargeResults = $scope.pleResultsMap['Charge'];
                        $scope.CostResults = $scope.pleResultsMap['Cost'];
                        $scope.UsageResults = $scope.pleResultsMap['Usage'];
                        $scope.AdjustmentResults = $scope.pleResultsMap['Adjustment'];
                        $scope.OverrideResults = $scope.pleResultsMap['Override'];
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.selectItem = function(item, elemObjType) {
                    var broadcastData = {
                        facetType: 'PRICELIST_ENTRY',
                        facetData: {
                            priceListEntryItem: item,
                            pricingMode: $scope.pricingMode,
                            pricingElementObjectType: elemObjType,
                            isAdj: $scope.isAdj
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.newItem = function(elemObjType) {
                    $scope.isAdj = false;
                    $scope.selectItem(null, elemObjType);
                };

                $scope.newItemAdj = function() {
                    $scope.isAdj = true;
                    $scope.selectItem(null, elemObjType);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Price List Entry';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the price list entry for <i>' + item[$scope.nsp + 'PricingElementId__r'].Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete price list entry results: ', results);
                            $rootScope.$broadcast('refreshObjectPricingElements');
                            $rootScope.$broadcast('hideItemDetails');
                            deleteModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.showRuleSetInfo = function(ruleSet, event) {
                    if ($scope.ruleSetPopover) {
                        $scope.ruleSetPopover.destroy();
                    }
                    var popoverScope = $scope.$new();
                    popoverScope.ruleSet = ruleSet;
                    $scope.ruleSetPopover = $sldsPopover(j$(event.currentTarget), {
                        scope: popoverScope,
                        sldsEnabled: true,
                        show: true,
                        autoClose: true,
                        trigger: 'manual',
                        nubbinDirection: 'right',
                        container: '.via-slds',
                        template: '<div class="slds-popover slds-popover-ruleset slds-nubbin--right" role="dialog"><div class="slds-popover__body"><vloc-rule-set-info-card rule-set="ruleSet"></vloc-rule-set-info-card></vloc-context-rule-info-card></div></div>'
                    });
                };

                $scope.launchObjectTab = function(item, objAPIName, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var data = {
                        'doAction': 'viewRecord',
                        'doAPIName': objAPIName,
                        'obj': item,
                        'closeCurrentTab': false
                    };
                    var broadcastAction = {
                        'eventName': 'launchConsoleTab',
                        'eventData': data
                    };
                    if (window.frameElement !== null) {
                        // create a iframe resize event binding with the parent
                        window.parent.bindIframeEvents('broadcast', broadcastAction);
                    }
                };

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('Pricing Elements - describeObject results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.setActiveTab = function(activeIdx) {
                    angular.forEach($scope.tabs, function(tab, idx) {
                        if (activeIdx === idx) {
                            tab.active = true;
                            tab.init = true;
                        } else {
                            tab.active = false;
                        }
                    });
                    $scope.activeIdx = activeIdx;
                    cpqService.setObjectPricingTabIdx(activeIdx);
                };

                $scope.getObjectTypes = function() {
                    var inputMap = { 'objectName' : $scope.nsp + 'PricingElement__c' };
                    remoteActions.invokeMethod('getObjectClassTypesByName', JSON.stringify(inputMap)).then(function(results) {
                        angular.forEach(results, function(objType) {
                            if (objType.Name === 'Charge') {
                                $scope.ChargeOT = objType;
                            }
                            else if (objType.Name === 'Cost') {
                                $scope.CostOT = objType;
                            }
                            else if (objType.Name === 'Usage') {
                                $scope.UsageOT = objType;
                            }
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getPriceListEntriesData = function() {
                    $scope.getPriceListEntries('Charge', 1);
                    $scope.getPriceListEntries('Cost', 1);
                    //$scope.getPriceListEntries('Usage', 1);
                    $scope.getPriceListEntries('Adjustment', 1);
                    $scope.getPriceListEntries('Override', 1);
                };

                $scope.init = function() {
                    $scope.tabs = cpqService.getObjectPricingTabs($scope.pricingMode);
                    $scope.activeIdx = cpqService.getObjectPricingTabIdx();
                    $scope.tabs[$scope.activeIdx].init = true;
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectTypes();
                };
                $scope.init();
            }
        };
    }
]);

},{}],41:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocObjectPricingElement', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                priceListId: '=',
                pricingElementItem: '=',
                pricingElementObjectType: '=',
                isGlobal: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ObjectPricingElement.tpl.html',
            controller: function($scope, $rootScope, $timeout, $sldsModal, $compile, $window) {
                $scope.nsp = fileNsPrefix();
                $scope.currencySymbol = currencySymbol;
                $scope.isLoyaltyPointsEnabled = isLoyaltyPointsEnabled;
                $scope.OBJECT_NAME = 'PricingElement__c';
                $scope.labels = $window.labels;

                $scope.getPricelist = function() {
                    var inputMap = {'objectId': $scope.priceListId };
                    remoteActions.invokeMethod('getObject', JSON.stringify(inputMap)).then(function(results) {
                        $scope.pricelistLoyaltyCode = [];
                        $scope.pricelistCurrencyCode = [];
                        var currencyCodes = results[$scope.nsp + 'CurrencyCode__c'];
                        if(currencyCodes){
                            var selectedCurrencyCodeList = currencyCodes.split(';');
                            for(var i=0; i<selectedCurrencyCodeList.length; i++) {
                                var option1 = {};
                                option1.isDefault = true;
                                option1.label = selectedCurrencyCodeList[i];
                                option1.value = selectedCurrencyCodeList[i];
                                $scope.pricelistCurrencyCode.push(option1);
                            }
                            if($scope.pricelistCurrencyCode.length > 0 && !$scope.editItem[$scope.nsp + 'CurrencyCode__c']) {
                                $scope.editItem[$scope.nsp + 'CurrencyCode__c'] = $scope.pricelistCurrencyCode[0].value;
                            }
                        }
                        var loyaltyCodes = results[$scope.nsp + 'LoyaltyCode__c'];
                        if(loyaltyCodes) {
                            var selectedLoyaltyCodeList = loyaltyCodes.split(';');
                            for(var j=0; j<selectedLoyaltyCodeList.length; j++) {
                                var option2 = {};
                                option2.isDefault = true;
                                option2.label = selectedLoyaltyCodeList[j];
                                option2.value = selectedLoyaltyCodeList[j];
                                $scope.pricelistLoyaltyCode.push(option2);
                            }
                            if($scope.pricelistLoyaltyCode.length > 0 && !$scope.editItem[$scope.nsp + 'LoyaltyCode__c']) {
                                $scope.editItem[$scope.nsp + 'LoyaltyCode__c'] = $scope.pricelistLoyaltyCode[0].value;
                            }
                        }
                        console.log('getObject Pricelist__c results: ', results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                }
                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : $scope.nsp + 'PricingVariable__c' };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectFieldsPV = results;
                        console.log('describeObject PricingVariable__c results: ', $scope.objectFieldsPV);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                    var inputMap2 = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap2)).then(function(results) {
                        $scope.objectFields = results;
                        console.log('describeObject results: ', $scope.objectFields);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName' : $scope.nsp + 'PricingVariable__c' };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklistsPV = {};
                        for (var key in results) {
                            $scope.objectPicklistsPV[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName PricingVariable__c results:', $scope.objectPicklistsPV);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                    var inputMap2 = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap2)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = $scope.labels.SavingLabel;
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editItem[key];
                        }
                    }

                    var inputMap = {
                        'objectName' : $scope.nsp + $scope.OBJECT_NAME,
                        'inputMap' : itemToSave
                    };
                    remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('create pricing element results:', results);
                        $rootScope.$broadcast('refreshObjectPricingElements');
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        //TODO: show save success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.validateObjectAndInvokeAction = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = $scope.labels.ValidatingLabel;
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editItem[key] === null ? undefined : $scope.editItem[key]);
                        }
                    }

                    var inputMap = { 'input'      : itemToSave,
                                     'methodName' : 'preValidatePricingElementObject',
                                     'options'    : null };
                    console.log(event);
                    remoteActions.invokeMethod('validateObject', JSON.stringify(inputMap)).then(function(results) {
                        if(results.warningMessages != undefined && results.warningMessages.length > 0)
                        {
                            collectiveWarningMessage = results.warningMessages.join();
                            cpqService.showNotification({
                                type: 'error',
                                title: 'ERROR',
                                content: collectiveWarningMessage
                            });
                            event.currentTarget.disabled = false;
                            event.currentTarget.innerText = originalText;
                        }
                        else
                        {
                            console.log(event);
                            event.currentTarget.innerText = originalText;
                            if ($scope.displayMode == 'create')
                            {
                                $scope.createItem(event);
                            }
                            else
                            {
                                $scope.saveItem(event);
                            }
                        }

                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                }

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = $scope.labels.SavingLabel;
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editItem[key] === null ? undefined : $scope.editItem[key]);
                        }
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) };


                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('save pricing element results:', results);
                        $rootScope.$broadcast('refreshObjectPricingElements');
                        $scope.item = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.item[key] = results[key] + tzOffset;
                            } else {
                                $scope.item[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        //TODO: show save success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.searchPriceVariables = function() {
                    delete $scope.selectedPV;
                    var inputMap = {};
                    for (var key in $scope.editPV) {
                        if ($scope.editPV[key]) {
                            inputMap[key] = $scope.editPV[key];
                        }
                    }
                    if (inputMap[$scope.nsp + 'ChargeType__c'] !== 'Recurring') {
                        delete inputMap[$scope.nsp + 'RecurringFrequency__c'];
                    }
                    var inputMapJSON = JSON.stringify(inputMap);

                    var inputMap = {
                        'objectName' : $scope.nsp + 'PricingVariable__c',
                        'inputMap' : inputMapJSON
                     };
                    remoteActions.invokeMethod('searchObjectFields', JSON.stringify(inputMap)).then(function(results) {
                        $scope.pricingVariableList = results;
                        $scope.showPVList = true;
                        console.log('pricingVariableList results: ', $scope.pricingVariableList);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.selectPricingVariable = function(pv) {
                    $scope.selectedPV = pv;
                    $scope.showPVList = false;
                    $scope.editItem[$scope.nsp + 'PricingVariableId__c'] = pv.Id;
                };

                $scope.gotoSFObject = function(objectId) {
                    $window.open(sfBaseUrl + '/' + objectId);
                };

                $scope.init = function() {
                    $scope.editItem = {};
                    $scope.editPV = {};
                    $scope.editPV[$scope.nsp + 'ValueType__c'] = 'Pricing Element';
                    $scope.editPV[$scope.nsp + 'Type__c'] = 'Price';
                    $scope.currentStep = 1;
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);
                    $scope.pricingVariableList = [];
                    $scope.showPVList = false;

                    if ($scope.pricingElementItem == null) {
                        $scope.displayMode = 'create';
                        $scope.pricingElementItem = {};
                        $scope.editItem[$scope.nsp + 'ObjectTypeId__c'] = $scope.pricingElementObjectType.Id;
                        $scope.editItem[$scope.nsp + 'IsReusable__c'] = true;
                        $scope.editItem[$scope.nsp + 'CalculationType__c'] = 'Simple';
                        if (!$scope.isGlobal) {
                            $scope.editItem[$scope.nsp + 'PriceListId__c'] = $scope.priceListId;
                        }
                    } else {
                        $scope.displayMode = 'edit';
                        var key;
                        for (key in $scope.pricingElementItem) {
                            if (key !== '$$hashKey') {
                                $scope.editItem[key] = $scope.pricingElementItem[key];
                            }
                        }
                        $scope.selectedPV = $scope.pricingElementItem[$scope.nsp + 'PricingVariableId__r'];
                        $scope.editPV[$scope.nsp + 'ChargeType__c'] = $scope.selectedPV[$scope.nsp + 'ChargeType__c'];
                        $scope.editPV[$scope.nsp + 'RecurringFrequency__c'] = $scope.selectedPV[$scope.nsp + 'RecurringFrequency__c'];
                        $scope.editPV[$scope.nsp + 'SubType__c'] = $scope.selectedPV[$scope.nsp + 'SubType__c'];
                    }

                    $scope.step2Fields = [];
                    $scope.step2Fields.push({'label': 'Name', required: true});
                    $scope.step2Fields.push({'label': $scope.nsp + 'Code__c', required: true});
                    $scope.step2Fields.push({'label': $scope.nsp + 'DisplayText__c', required: true});
                    $scope.step2Fields.push({'label': $scope.nsp + 'HelpText__c', required: false});

                    $scope.step4Fields = [];
                    $scope.step4Fields.push($scope.nsp + 'EffectiveFromDate__c');
                    $scope.step4Fields.push($scope.nsp + 'EffectiveUntilDate__c');
                    $scope.step4Fields.push($scope.nsp + 'IsActive__c');

                    $scope.chargeTypePicklist = [];
                    if ($scope.pricingElementObjectType.Name === 'Charge') {
                        $scope.chargeTypePicklist.push({'label': 'Recurring', value: 'Recurring'});
                        $scope.chargeTypePicklist.push({'label': 'One-time', value: 'One-time'});
                        $scope.chargeTypePicklist.push({'label': 'Usage', value: 'Usage'});
                    } else if ($scope.pricingElementObjectType.Name === 'Usage') {
                        $scope.chargeTypePicklist.push({'label': 'Usage', value: 'Usage'});
                        $scope.editPV[$scope.nsp + 'ChargeType__c'] = 'Usage';
                    } else if ($scope.pricingElementObjectType.Name === 'Discount') {
                        $scope.chargeTypePicklist.push({'label': 'Adjustment', value: 'Adjustment'});
                        $scope.editPV[$scope.nsp + 'ChargeType__c'] = 'Adjustment';
                    } else if($scope.pricingElementObjectType.Name === 'Cost') {
                        $scope.chargeTypePicklist.push({'label': 'Recurring', value: 'Recurring'});
                        $scope.chargeTypePicklist.push({'label': 'One-time', value: 'One-time'});
                        $scope.chargeTypePicklist.push({'label': 'Usage', value: 'Usage'});
                        $scope.editPV[$scope.nsp + 'Type__c'] = 'Cost';
                    }
                    $scope.getPricelist();
                };
                $scope.init();
            }
        };
    }
]);

},{}],42:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocObjectPricingElements', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '=',
                mode: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ObjectPricingElements.tpl.html',
            controller: function($scope, $rootScope, $sldsModal, $compile) {
                $scope.nsp = fileNsPrefix();
                $scope.objectId = $scope.customViewAttrs.contextInfo.customObject.Id;
                $scope.OBJECT_NAME = 'PricingElement__c';
                $scope.isGlobal = ($scope.mode === 'global');
                $scope.chargeList = [];
                $scope.discountList = [];
                $scope.isLoyaltyPointsEnabled = isLoyaltyPointsEnabled;

                $scope.searchCfg = {
                    'Charge': {
                        currentPage: 1,
                        totalPages: 1
                    },
                    'Cost': {
                        currentPage: 1,
                        totalPages: 1
                    },
                    'Usage': {
                        currentPage: 1,
                        totalPages: 1
                    },
                    'Discount': {
                        currentPage: 1,
                        totalPages: 1
                    }
                };

                $scope.$on('hideItemDetails', function() {
                    $scope.init();
                });

                $scope.$on('refreshObjectPricingElements', function() {
                    $scope.refreshPricingElements();
                });

                $scope.newItem = function(elemObjType) {
                    var broadcastData = {
                        facetType: 'OBJECT_PRICING_ELEMENT',
                        facetData: {
                            pricingElementItem: null,
                            pricingElementObjectType: elemObjType,
                            isGlobal: $scope.isGlobal
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.editItem = function(item, elemObjType, event) {
                    if (event) {
                        event.stopPropagation();
                    }
                    var broadcastData = {
                        facetType: 'OBJECT_PRICING_ELEMENT',
                        facetData: {
                            pricingElementItem: item,
                            pricingElementObjectType: elemObjType,
                            isGlobal: $scope.isGlobal
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Pricing Element';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the pricing element <i>' + item.Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete pricing element results: ', results);
                            $scope.refreshPricingElements();
                            $rootScope.$broadcast('hideItemDetails');
                            deleteModal.hide();
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Pricing element deleted.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.getObjectTypes = function() {
                    var inputMap = { 'objectName' : $scope.nsp + $scope.OBJECT_NAME };
                    remoteActions.invokeMethod('getObjectClassTypesByName', JSON.stringify(inputMap)).then(function(results) {
                        angular.forEach(results, function(objType) {
                            if (objType.Name === 'Charge') {
                                $scope.ChargeOT = objType;
                            }
                            if (objType.Name === 'Cost') {
                                $scope.CostOT = objType;
                            }
                            if (objType.Name === 'Usage') {
                                $scope.UsageOT = objType;
                            }
                            if (objType.Name === 'Discount') {
                                $scope.DiscountOT = objType;
                            }
                        });

                        $scope.tabs = cpqService.getPricingElementTabs();
                        $scope.activeIdx = cpqService.getPricingElementTabIdx();
                        $scope.tabs[$scope.activeIdx].init = true;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getPricingElements = function(objectType, pageNum) {
                    if (pageNum) {
                        $scope.searchCfg[objectType.Name].currentPage = pageNum;
                    }
                    if ($scope.searchCfg[objectType.Name].currentPage < 1) {
                        $scope.searchCfg[objectType.Name].currentPage = 1;
                    }
                    if ($scope.searchCfg[objectType.Name].totalPages !== 0 && ($scope.searchCfg[objectType.Name].currentPage > $scope.searchCfg[objectType.Name].totalPages)) {
                        $scope.searchCfg[objectType.Name].currentPage = $scope.searchCfg[objectType.Name].totalPages;
                    }

                    var inputMap, remoteMethodName;
                    if ($scope.isGlobal) {
                        inputMap = {
                            'objectTypeId' : objectType.Id,
                            'sortBy' : '',
                            'pageNumber': $scope.searchCfg[objectType.Name].currentPage
                        };
                        remoteMethodName = 'getGlobalPricingElements';
                    } else {
                        inputMap = {
                            'priceListId' : $scope.objectId,
                            'objectTypeId' : objectType.Id,
                            'sortBy' : '',
                            'pageNumber': $scope.searchCfg[objectType.Name].currentPage
                        };
                        remoteMethodName = 'getStandalonePricingElements';
                    }

                    remoteActions.invokeMethod(remoteMethodName, JSON.stringify(inputMap)).then(function(results) {
                        console.log(remoteMethodName + ' for ', objectType.Name, ': ', results);
                        if (objectType.Name === 'Charge') {
                            $scope.chargeList = results.pricingElements;
                        }
                        if(objectType.Name === 'Cost') {
                            $scope.costList = results.pricingElements;
                        }
                        if (objectType.Name === 'Usage') {
                            $scope.usageList = results.pricingElements;
                        }
                        if (objectType.Name === 'Discount') {
                            $scope.discountList = results.pricingElements;
                        }
                        $scope.searchCfg[objectType.Name].previousPage = results.previousPage;
                        $scope.searchCfg[objectType.Name].nextPage = results.nextPage;
                        $scope.searchCfg[objectType.Name].totalCount = results.totalCount;
                        $scope.searchCfg[objectType.Name].totalPages = results.totalPages;
                        $scope.searchCfg[objectType.Name].pageSize = results.pageSize;
                        $scope.searchCfg[objectType.Name].fromCount = results.fromCount;
                        $scope.searchCfg[objectType.Name].toCount = results.toCount;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.setActiveTab = function(activeIdx) {
                    angular.forEach($scope.tabs, function(tab, idx) {
                        if (activeIdx === idx) {
                            tab.active = true;
                            tab.init = true;
                        } else {
                            tab.active = false;
                        }
                    });
                    $scope.activeIdx = activeIdx;
                    cpqService.setPricingElementTabIdx(activeIdx);
                };

                $scope.refreshPricingElements = function() {
                    var idx = cpqService.getPricingElementTabIdx();
                    if (idx === 0) {
                        $scope.getPricingElements($scope.ChargeOT);
                    } else if (idx === 1) {
                        $scope.getPricingElements($scope.CostOT);
                    } else if (idx === 2) {
                        $scope.getPricingElements($scope.UsageOT);
                    } else if (idx === 3) {
                        $scope.getPricingElements($scope.DiscountOT);
                    }
                };

                $scope.init = function() {
                    $scope.getObjectTypes();
                };
                $scope.init();
            }
        };
    }
]);

},{}],43:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocObjectType', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                item: '=',
                parentItem: '=',
                objectName: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ObjectType.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'ObjectClass__c';
                $scope.editItem = {};
                $scope.facets = [];

                $scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = { 
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectLayoutByName vlocObjectType item results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectLayoutById = function(objectId, forSelf) {
                    var inputMap = { 
                        'objectId' : objectId,
                        'isInherited' : forSelf
                    };
                    remoteActions.invokeMethod('getObjectLayoutById', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectLayoutById vlocObjectType item results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.buildObjectLayout = function(results) {
                    $scope.objFacets = results.facets;
                    $scope.objectLayoutId = results.objLayout.Id;
                    $scope.facets = [];
                    if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
                        angular.forEach($scope.objFacets, function(facet, idx) {
                            facet.hasSectionCustomView = false;
                            facet.active = (idx === 0);
                            angular.forEach(facet.sections, function(section) {
                                if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                                    section.hasCustomView = true;
                                    facet.hasSectionCustomView = true;
                                }
                            });
                            $scope.facets.push(facet);
                        });
                    }
                    console.log('FACETS for vlocObjectType: ', $scope.facets);
                };

                $scope.describeObjectWithQuery = function(objectName) {
                    var queryMap = {};
                    $scope.objectName = $scope.objectName.replace($scope.nsp, '');
                    var parentOTQueryFilter = 'WHERE ' + $scope.nsp + 'ObjectApiName__c = \'' + $scope.objectName + '\' AND RecordType.Name = \'Object Type\'';
                    var lookupFieldName = $scope.nsp + 'ParentObjectClassId__c';
                    queryMap[lookupFieldName] = parentOTQueryFilter;

                    var inputMap = { 
                        'objectName' : objectName,
                        'inputMap' : JSON.stringify(queryMap)
                    };
                    remoteActions.invokeMethod('describeObjectWithQuery', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey' && $scope.editItem[key] !== '') {
                            itemToSave[key] = $scope.editItem[key];
                        }
                    }
                    itemToSave[$scope.nsp + 'RootObjectClassId__c'] = $scope.parentItem;

                    var inputs= { 'inputMap' : itemToSave };
                    remoteActions.invokeMethod('createObjectType', JSON.stringify(inputs)).then(function(results) {
                        console.log('create vlocObjectType item results: ', results);
                        $rootScope.$broadcast('refreshItems');
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        //TODO: show save success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    console.log('save vlocObjectType editItem',$scope.editItem);
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editItem[key] === null ? undefined : $scope.editItem[key]);
                        }
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('save vlocObjectType item results: ', results);
                        $rootScope.$broadcast('refreshItems');
                        $scope.item = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.item[key] = results[key] + tzOffset;
                            } else {
                                $scope.item[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        //TODO: show save success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.init = function() {
                    $scope.getObjectLayoutByName($scope.OBJECT_NAME, '');
                    $scope.describeObjectWithQuery($scope.nsp + $scope.OBJECT_NAME);
                    
                    if ($scope.item.Id === undefined) {
                        if ($scope.parentItem !== null && $scope.parentItem !== undefined) {
                            $scope.editItem[$scope.nsp + 'ObjectId__c'] = $scope.parentItem.Id;
                        }
                    } else {
                        for (var key in $scope.item) {
                            if (key !== '$$hashKey') {
                                $scope.editItem[key] = $scope.item[key];
                            }
                        }
                    }
                };
                $scope.init();
            }
        };
    }
]);

},{}],44:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocObjectTypeStructure', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ObjectTypeStructure.tpl.html',
            controller: function($scope, $rootScope, $sldsModal, $compile) {
                console.log('INIT: ', $scope.customViewAttrs);
                $scope.objectId = $scope.customViewAttrs.objectId;
                $scope.nsp = fileNsPrefix();

                $scope.getFieldSets = function() {
                    var inputMap = { 'objectName' : $scope.nsp + 'ObjectClass__c' };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + 'objecttype'] === undefined) {
                            $scope.prodFieldSet = null;
                        } else {
                            $scope.prodFieldSet = results[$scope.nsp.toLowerCase() + 'objecttype'];
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getNumber = function(num) {
                    return (new Array(num));
                };

                $scope.toggleItem = function(item) {                                                   
                    if (!item.showingChildren) {
                        $scope.objectTypeList.forEach(function(obj){                           
                            if(obj.objectType[$scope.nsp+'ParentObjectClassId__c'] == item.objectType.Id) {
                                obj.show = true;                               
                            }
                        }.bind(this));
                    } else {

                        var children = [];
                        children.push(item.objectType.Id);
                        $scope.objectTypeList.forEach(function(obj){
                            if( children.indexOf(obj.objectType[$scope.nsp+'ParentObjectClassId__c']) != -1 ) {
                                obj.show = false;
                                children.push(obj.objectType.Id);
                                if(obj.showingChildren) {
                                    obj.showingChildren = false;
                                }                               
                            }
                        }.bind(this));
                    }
                    item.showingChildren = !item.showingChildren;
                };

                $scope.getObjectTypeStructure = function() {
                    var inputs= { 'objectClassId' : $scope.objectId };
                    remoteActions.invokeMethod('getObjectTypeStructure', JSON.stringify(inputs)).then(function(results) {
                        var objectTypeList = [];
                        angular.forEach(results, function(objType, idx) {
                            objType.show = true;
                            objType.RecordTypeName = objType.objectType[$scope.nsp + 'RecordTypeName__c'];
                            if (objType.level === 0) {
                                objType.isRoot = true;
                            } else {
                                objType.isRoot = false;
                                if(objType.level > 0) {
                                    objType.show = false;
                                }
                            }
                            objType.showingChildren = false;
                            objectTypeList.push(objType);
                        });
                        $scope.objectTypeList = objectTypeList;
                        $scope.totalObjects = $scope.objectTypeList.length;                        
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.newItem = function() {
                    $scope.selectItem({});
                };

                $scope.selectItem = function(item) {
                    var broadcastData = {
                        facetType: 'OBJECT_TYPE',
                        facetData: {
                            objectTypeItem: item,
                            objectClassItem: $scope.objectId
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.$on('refreshItems', function() {
                    $scope.getObjectTypeStructure();
                });

                $scope.formatFieldValue = function(field) {
                    return (field === undefined ? '&nbsp;' : field);
                };

                $scope.editItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }
                    $scope.selectItem(item);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Object Type';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the Object Type <i>' + item.Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete Object Type';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputs= { 'objectTypeId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObjectType', JSON.stringify(inputs)).then(function(results) {
                            console.log('delete Object Type results: ', results);
                            $rootScope.$broadcast('refreshItems');
                            $rootScope.$broadcast('hideItemDetails');
                            deleteModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.launchTab = function(item) {
                    console.log('launchTab:item: ', item);
                    console.log('launchTab:objectId: ', $scope.objectId);
                    var data = {
                        'doAction': 'viewRecord',
                        'doAPIName': 'OBJECT_TYPE',
                        'doAPILabel': 'Object Type',
                        'obj': item,
                        'closeCurrentTab': false
                    };
                    var broadcastAction = {
                        'eventName': 'launchConsoleTab',
                        'eventData': data
                    };
                    if (window.frameElement !== null) {
                        // create a iframe resize event binding with the parent
                        window.parent.bindIframeEvents('broadcast', broadcastAction);
                    }
                };

                $scope.init = function() {
                    $scope.getFieldSets();
                    $scope.getObjectTypeStructure();
                };
                $scope.init();
            }
        };
    }
]);

},{}],45:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocObjectTypes', ['$rootScope', 'remoteActions', 'cpqService',
    function($rootScope, remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ObjectTypes.tpl.html',
            controller: function($scope, $sldsModal) {
                $scope.objectId = $scope.customViewAttrs.objectId;
                $scope.objName = $scope.customViewAttrs.objName;
                $scope.OBJECT_NAME = 'ObjectClass__c';

                $scope.nsp = fileNsPrefix();

                $scope.newItem = function() {
                    $scope.selectItem({});
                };

                $scope.$on('refreshItems', function() {
                    $scope.getObjectTypes($scope.objectId);
                });

                $scope.selectItem = function(item) {
                    var broadcastData = {
                        facetType: 'OBJECT_TYPE',
                        facetData: {
                            objectTypeItem: item,
                            objectClassItem: $scope.objectId
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.editItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }
                    $scope.selectItem(item);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Object Type';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the Object Type <i>' + item.Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete Object Type';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputs = { 'objectTypeId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObjectType', JSON.stringify(inputs)).then(function(results) {
                            console.log('delete Object Type results: ', results);
                            $rootScope.$broadcast('refreshItems');
                            $rootScope.$broadcast('hideItemDetails');
                            deleteModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.getObjectTypes = function(objectId) {
                    console.log('getObjectTypes(' + objectId + ')');
                    var inputMap = { 'objectClassId' : objectId };
                    remoteActions.invokeMethod('getObjectClassTypes', JSON.stringify(inputMap)).then(function(results) {
                        console.log('ObjectTyeps - getObjectTypes results:', results);
                        $scope.items = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('ObjectTypes - describeObject results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + 'objecttype'] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + 'objecttype'];
                        }
                        console.log('ObjectTypes - getFieldSets results: ', $scope.fieldSet);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.launchTab = function(item) {
                    console.log('launchTab:item: ', item);
                    console.log('launchTab:objectId: ', $scope.objectId);
                    var data = {
                        'doAction': 'viewRecord',
                        'doAPIName': 'OBJECT_TYPE',
                        'doAPILabel': 'Object Type',
                        'obj': item,
                        'closeCurrentTab': false
                    };
                    var broadcastAction = {
                        'eventName': 'launchConsoleTab',
                        'eventData': data
                    };
                    if (window.frameElement !== null) {
                        // create a iframe resize event binding with the parent
                        window.parent.bindIframeEvents('broadcast', broadcastAction);
                    }
                };

                $scope.init = function() {
                    console.log('object types init -- ');
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getFieldSetsByName($scope.nsp + $scope.OBJECT_NAME);

                    $scope.getObjectTypes($scope.objectId);
                };
                $scope.init();
            }
        };
    }
]);

},{}],46:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocOfferMigrationComponentMapping', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                offerMigrationComponentMapping: '=',
                parentItem: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'OfferMigrationComponentMapping.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.items = [];
                $scope.OBJECT_NAME = 'OfferMigrationComponentMapping__c';
                $scope.editObject = {};
                $scope.attrMap = {};
                $scope.attrObjMap = {};
                $scope.attrAssgnObjMap = {};
                $scope.facets = [];

                $scope.describeObjectByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log(objectName + ' getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = {
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' getObjectLayoutByName results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.buildObjectLayout = function(results) {
                    $scope.objFacets = results.facets;
                    $scope.objectLayoutId = results.objLayout.Id;
                    $scope.facets = [];
                    if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
                        angular.forEach($scope.objFacets, function(facet, idx) {
                            facet.hasSectionCustomView = false;
                            facet.active = (idx === 0);
                            angular.forEach(facet.sections, function(section) {
                                if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                                    section.hasCustomView = true;
                                    facet.hasSectionCustomView = true;
                                }
                            });
                            $scope.facets.push(facet);
                        });
                    }
                    console.log($scope.objectAPIName + ' FACETS:', $scope.facets);
                };

                $scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }
                    $scope.editObject[$scope.nsp + 'OfferMigrationPlanId__c'] = $scope.parentItem.Id;
                    
                    //Checking if Selected Source and targetProductId are not same
                    var sourceProductId = $scope.editObject[$scope.nsp + 'SourceProductId__c'];
                    var targetProductId = $scope.editObject[$scope.nsp + 'TargetProductId__c'];
                    if(sourceProductId == targetProductId)
                    {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: 'Source and Target cannot be same.'
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                        return;
                    }

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editObject[key];
                        }
                    }
                    var inputMap = {
                        'objectName' : $scope.nsp + $scope.OBJECT_NAME,
                        'inputMap' : itemToSave
                    };

                    remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('Create Offer Migration Component Mapping results: ', results);
                        $rootScope.$broadcast('refreshOfferMigrationComponentMappings', $scope.parentItem.Id);
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Offer Migration Component Mapping created.',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    //Checking if Selected Source and targetProductId are not same
                    var sourceProductId = $scope.editObject[$scope.nsp + 'SourceProductId__c'];
                    var targetProductId = $scope.editObject[$scope.nsp + 'TargetProductId__c'];
                    if(sourceProductId == targetProductId)
                    {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: 'Source and Target cannot be same.'
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                        return;
                    }

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editObject[key] === null ? undefined : $scope.editObject[key]);
                        }
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('Save Offer Migration Component Mapping results: ', results);
                        $rootScope.$broadcast('refreshOfferMigrationComponentMappings', $scope.parentItem.Id);
                        $scope.item = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.item[key] = results[key] + tzOffset;
                            } else {
                                $scope.item[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }

                        $scope.closeDetails();
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Offer Migration Component Mapping Item saved.',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.init = function() {
                    $scope.getObjectLayoutByName($scope.OBJECT_NAME, '');
                    $scope.describeObjectByName($scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);

                    if ($scope.offerMigrationComponentMapping.Id === undefined) {
                        $scope.displayMode = 'create';
                    } else {
                        $scope.displayMode = 'edit';
                        for (var key in $scope.offerMigrationComponentMapping) {
                            if (key !== '$$hashKey') {
                                $scope.editObject[key] = $scope.offerMigrationComponentMapping[key];
                            }
                        }
                    }
                };
                $scope.init();
            }
        };
    }
]);

},{}],47:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocOfferMigrationComponentMappings', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'OfferMigrationComponentMappings.tpl.html',
            controller: function($scope, $rootScope, $sldsModal, $compile) {

                $scope.nsp = fileNsPrefix();
                $scope.offerMigrationPlan = $scope.customViewAttrs.contextInfo.customObject;
                $scope.offerMigrationPlanId = $scope.offerMigrationPlan.Id;
                $scope.offerMigrationMethod = $scope.offerMigrationPlan[$scope.nsp+'MigrationMethod__c'];

                $scope.OBJECT_NAME = 'OfferMigrationComponentMapping__c';
                $scope.fieldSetName = 'offermigrationcomponentmapping';
                $scope.items = [];

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('vlocOfferMigrationComponentMappings - describeObject results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                //Displaying Migration Method Message
                $scope.getMigrationMethodMessage = function() {
                    if($scope.offerMigrationMethod == 'Any to Any Offers')
                    {
                        //For "Any to Any Offer" Migration Method
                        $scope.migrationMethodMessage = "List of Exceptions for \"Any to Any Offer\" Migration Plan.";
                    }
                    else if($scope.offerMigrationMethod == 'Specific Offers')
                    {
                        $scope.migrationMethodMessage = null;
                    }
                }

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + $scope.fieldSetName] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + $scope.fieldSetName];
                        }
                        console.log('vlocOfferMigrationComponentMappings - getFieldSets results: ', $scope.fieldSet);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.$on('refreshOfferMigrationComponentMappings', function(event, data) {
                    $scope.getApplicableComponentMappings();
                });

                $scope.getApplicableComponentMappings = function() {
                    var inputMap = {
                        'OfferMigrationPlanId' : $scope.offerMigrationPlanId,
                    };
                    console.log('inputMap=',inputMap);
                    remoteActions.invokeMethod('getAllOfferMigrationComponentMappings', JSON.stringify(inputMap)).then(function(results) {
                        console.log('vlocOfferMigrationComponentMappings - getAllOfferMigrationComponentMappings results: ', results);
                        $scope.items = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.selectItem = function(item) {
                    var broadcastData = {
                        facetType: 'OFFER_MIGRATION_COMPONENT_MAPPING',
                        facetData: {
                            offerMigrationComponentMappingItem: item
                        }
                    };
                    console.log('selectItem item: ', item);
                    console.log('broadcastData item: ', broadcastData);
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Offer Migration Component Mapping';
                    modalScope.confirmationMsg = 'Are you sure you want to delete <i>' + item.Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete Mapping';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete Offer Migration Component Mapping results: ', results);
                            $rootScope.$broadcast('hideItemDetails');
                            $rootScope.$broadcast('refreshOfferMigrationComponentMappings', $scope.offerMigrationPlanId);
                            deleteModal.hide();
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Offer Migration Component Mapping Deleted.',
                                autohide: true
                            });

                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.newItem = function() {
                    $scope.selectItem({});
                };

                $scope.init = function() {
                    $scope.getApplicableComponentMappings();
                    $scope.getMigrationMethodMessage();
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getFieldSetsByName($scope.nsp + $scope.OBJECT_NAME);
                };
                $scope.init();
            }
        };
    }
]);

},{}],48:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocOfferPricingComponent', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                offerId: '=',
                offerComponentId: '=',
                contractId: '=',
                offerPricingItem: '=',
                mode: '=',
                rootProductId: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'OfferPricingComponent.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'OfferPricingComponent__c';
                console.log('RECEIVING PRODUCT ID: ', $scope.offerId);

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('describeObject results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = { 
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectLayoutByName offer price component results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.buildObjectLayout = function(results) {
                    $scope.objFacets = results.facets;
                    $scope.objectLayoutId = results.objLayout.Id;
                    $scope.facets = [];
                    if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
                        angular.forEach($scope.objFacets, function(facet, idx) {
                            facet.hasSectionCustomView = false;
                            facet.active = (idx === 0);
                            angular.forEach(facet.sections, function(section) {
                                if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                                    section.hasCustomView = true;
                                    facet.hasSectionCustomView = true;
                                }
                            });
                            $scope.facets.push(facet);
                        });
                    }
                    console.log('FACETS for offer price component: ', $scope.facets);
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editItem[key];
                        }
                    }
                    itemToSave[$scope.nsp + 'OfferId__c'] = $scope.offerId;

                    var inputMap = { 
                        'objectName' : $scope.nsp + $scope.OBJECT_NAME,
                        'inputMap' : itemToSave
                    };
                    remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('create offer pricing component results: ', results);
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $rootScope.$broadcast('refreshItems');
                        $rootScope.$broadcast('hideItemDetails');
                        //TODO: show save success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    // special cases for nulls
                    var key;
                    for (key in $scope.objectFields) {
                        var type = $scope.objectFields[key].type;
                        if (type === 'DATE' || type === 'DOUBLE' || type === 'INTEGER') {
                            if ($scope.editItem[key] === null || $scope.editItem[key] === '') {
                                $scope.editItem[key] = undefined;
                            }
                        }
                    }

                    var itemToSave = {};
                    for (key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editItem[key] === null ? undefined : $scope.editItem[key]);
                        }
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('save offer pricing component results: ', results);
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.editItem = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.editItem[key] = results[key] + tzOffset;
                            } else {
                                $scope.editItem[key] = results[key];
                            }
                        }
                        $rootScope.$broadcast('refreshItems');
                        $rootScope.$broadcast('hideItemDetails');
                        //TODO: show save success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.getOverride = function() {
                    var inputMap = {
                        'type': 'Pricing Component',
                        'overriddenObjectId': $scope.offerPricingItem.Id,
                        'contextId': $scope.rootProductId
                    };
                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('getOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        if (result !== null) {
                            var obj = JSON.parse(result);
                            console.log('get override: ', obj);
                            $scope.overrideObj = obj.SObject;
                            $scope.overrideDef = obj.OverrideDefinition__c;
                            $scope.hasOverride = true;
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.createOverride = function() {
                    var itemToCreate = {};
                    for (var key in $scope.editItem) {
                        itemToCreate[key] = ($scope.editItem[key] === null ? undefined : $scope.editItem[key]);
                    }
                    itemToCreate[$scope.nsp + 'IsOverride__c'] = true;
                    itemToCreate.Name += ' Override';
                    delete itemToCreate.$$hashKey;
                    delete itemToCreate.Id;

                    var inputMap = {
                        'type': 'Pricing Component',
                        'overriddenObjectId': $scope.offerPricingItem.Id,
                        'contextId': $scope.rootProductId,
                        'sObject': JSON.stringify(itemToCreate)
                    };
                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('createOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        var obj = JSON.parse(result);
                        console.log('create override: ', obj);
                        $scope.overrideObj = obj.SObject;
                        $scope.overrideDef = obj.OverrideDefinition__c;
                        $scope.hasOverride = true;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.saveOverride = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    // special cases for nulls
                    var key;
                    for (key in $scope.objectFields) {
                        var type = $scope.objectFields[key].type;
                        if (type === 'DATE' || type === 'DOUBLE' || type === 'INTEGER') {
                            if ($scope.overrideObj[key] === null || $scope.overrideObj[key] === '') {
                                $scope.overrideObj[key] = undefined;
                            }
                        }
                    }

                    var itemToSave = {};
                    for (key in $scope.overrideObj) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.overrideObj[key] === null ? undefined : $scope.overrideObj[key]);
                        }
                    }

                    var inputMap = {
                        'type': 'Pricing Component',
                        'sObject': JSON.stringify(itemToSave)
                    };
                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('saveOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('save override results: ', results);
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        //TODO: show save success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.deleteOverride = function() {
                    var inputMap = {
                        'type': 'Pricing Component',
                        'overridingObjectId': $scope.overrideObj.Id,
                        'overrideDefinitionId': $scope.overrideDef.Id,
                        'contextId': $scope.rootProductId
                    };
                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('deleteOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('delete override: ', result);
                        $scope.overrideObj = null;
                        $scope.overrideDef = null;
                        $scope.hasOverride = false;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.init = function() {
                    $scope.getObjectLayoutByName($scope.OBJECT_NAME, '');
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);

                    $scope.objDisplayMode = ($scope.mode === 'edit' ? 'edit' : 'view');

                    $scope.editItem = {};
                    for (var key in $scope.offerPricingItem) {
                        $scope.editItem[key] = $scope.offerPricingItem[key];
                    }
                    delete $scope.editItem.$$hashKey;
                    delete $scope.editItem[$scope.nsp + 'PricingComponentId__r'];

                    if ($scope.mode === 'override') {
                        $scope.overrideMode = true;
                        $scope.overrideObj = null;
                        $scope.overrideDef = null;
                        $scope.hasOverride = false;
                        $scope.getOverride();
                    } else {
                        $scope.overrideMode = false;
                    }
                };
                $scope.init();
            }
        };
    }
]);

},{}],49:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocPicklistItem', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                item: '=',
                parentItem: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'PicklistItem.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'PicklistValue__c';
                $scope.editItem = {};
                $scope.facets = [];

                $scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = { 
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectLayoutByName picklist item results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectLayoutById = function(objectId, forSelf) {
                    var inputMap = { 
                        'objectId' : objectId,
                        'isInherited' : forSelf
                    };
                    remoteActions.invokeMethod('getObjectLayoutById', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectLayoutById picklist item results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.buildObjectLayout = function(results) {
                    $scope.objFacets = results.facets;
                    $scope.objectLayoutId = results.objLayout.Id;
                    $scope.facets = [];
                    if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
                        angular.forEach($scope.objFacets, function(facet, idx) {
                            facet.hasSectionCustomView = false;
                            facet.active = (idx === 0);
                            angular.forEach(facet.sections, function(section) {
                                if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                                    section.hasCustomView = true;
                                    facet.hasSectionCustomView = true;
                                }
                            });
                            $scope.facets.push(facet);
                        });
                    }
                    console.log('FACETS for picklist item: ', $scope.facets);
                };

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('describeObject picklistlist item results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editItem[key];
                        }
                    }

                    var inputMap = { 
                        'objectName' : $scope.nsp + $scope.OBJECT_NAME,
                        'inputMap' : itemToSave
                    };
                    remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('create picklist item results: ', results);
                        $rootScope.$broadcast('refreshPicklistItems');
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Picklist item created!',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editItem[key] === null ? undefined : $scope.editItem[key]);
                        }
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('save picklist item results: ', results);
                        $rootScope.$broadcast('refreshPicklistItems');
                        $scope.item = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.item[key] = results[key] + tzOffset;
                            } else {
                                $scope.item[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Picklist item saved!',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.init = function() {
                    if ($scope.item.Id === undefined) {
                        $scope.displayMode = 'create';
                        $scope.getObjectLayoutByName($scope.OBJECT_NAME, '');

                        $scope.editItem[$scope.nsp + 'PicklistId__c'] = $scope.parentItem.Id;
                    } else {
                        $scope.displayMode = 'edit';
                        $scope.getObjectLayoutById($scope.item.Id, true);

                        for (var key in $scope.item) {
                            if (key !== '$$hashKey') {
                                $scope.editItem[key] = $scope.item[key];
                            }
                        }
                    }
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);
                };
                $scope.init();
            }
        };
    }
]);

},{}],50:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocPicklistItems', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'PicklistItems.tpl.html',
            controller: function($scope, $rootScope, $sldsModal) {
                $scope.nsp = fileNsPrefix();
                $scope.objectId = $scope.customViewAttrs.contextInfo.customObject.Id;
                $scope.OBJECT_NAME = 'PicklistValue__c';

                $scope.$on('refreshPicklistItems', function() {
                    $scope.getPicklistItems($scope.objectId);
                });

                $scope.selectItem = function(item) {
                    var broadcastData = {
                        facetType: 'PICKLIST_ITEM',
                        facetData: {
                            picklistItem: item
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.newItem = function() {
                    $scope.selectItem({} );
                };

                $scope.editItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }
                    $scope.selectItem(item);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Picklist Item';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the picklist item <i>' + item.Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete picklist item results: ', results);
                            $scope.getPicklistItems($scope.objectId);
                            deleteModal.hide();
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Picklist item deleted.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('describeObject picklist item results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + 'picklistitems'] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + 'picklistitems'];
                        }
                        console.log('getFieldSets results: ', $scope.fieldSet);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getPicklistItems = function(picklistId) {
                    var inputMap = { 'picklistId' : picklistId };
                    remoteActions.invokeMethod('getPicklistItems', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getPicklistItems results: ', results);
                        $scope.items = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.init = function() {
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getFieldSetsByName($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getPicklistItems($scope.objectId);
                };
                $scope.init();
            }
        };
    }
]);

},{}],51:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocPriceListEntry', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                objectId: '=',
                parentPriceListId: '=',
                priceListEntryItem: '=',
                pricingElementObjectType: '=',
                parentItem: '=',
                pricingMode: '=',
                mode: '=',
                rootProductId: '=',
                promotionId: '=',
                promotionItem: '=',
                isAdj: '=',
                isOverride: '=',
                definedChargeTypes: '=',
                definedChargeTypesMap: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'PriceListEntry.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'PriceListEntry__c';
                $scope.tabs = [];
                $scope.editItem = {};
                $scope.editPV = {};
                $scope.editPV[$scope.nsp + 'ValueType__c'] = 'Pricing Element';
                $scope.pricingVariableList = [];
                $scope.showPVList = false;
                $scope.pricingElementList = [];
                $scope.showPEList = false;
                $scope.hasObjectTypes = false;
                $scope.objectTypes = [];
                $scope.objTypeSelect = {
                    isCreateable: true,
                    isUpdateable: true,
                    isRequired: false,
                    label: 'Object Type',
                    type: 'OTPICKLIST',
                };

                $scope.contextRuleAttrs = {
                    'contextRulesMode': 'modal',
                    'contextInfo': {
                        'customObject': {}
                    }
                };
                if ($scope.priceListEntryItem === undefined || $scope.priceListEntryItem === null) {
                    $scope.contextRuleAttrs.contextInfo.customObject = null;
                } else {
                    $scope.contextRuleAttrs.contextInfo.customObject = $scope.priceListEntryItem;
                }

                $scope.setActiveTab = function(activeIdx) {
                    angular.forEach($scope.tabs, function(tab, idx) {
                        tab.active = (activeIdx === idx);
                    });
                    $scope.activeIdx = activeIdx;
                };

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : $scope.nsp + 'PricingVariable__c' };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectFieldsPV = results;
                        console.log('describeObject PricingVariable__c results: ', $scope.objectFieldsPV);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                    var inputMap2 = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap2)).then(function(results) {
                        console.log('describeObject results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName' : $scope.nsp + 'PricingVariable__c' };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklistsPV = {};
                        for (var key in results) {
                        	if($scope.pricingMode === 'DISCOUNT' && key == $scope.nsp + 'SubType__c')
                        	{
                        		for(var t = 0 ; t < results[key].length ; t++)
                        		{
                        			if(results[key][t]["label"] == 'Fee')
                    				{
                        				results[key].splice(t,1);
                    				}
                        		}
                        	}
                            $scope.objectPicklistsPV[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName PricingVariable__c results:', $scope.objectPicklistsPV);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                    var inputMap2 = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap2)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.closeDetails = function() {
                    console.log('closeDetails scope', $scope);
                    if ($scope.mode != 'modal') {
                        $rootScope.$broadcast('hideItemDetails');
                    } else {
                        $scope.$parent.hideAction();
                    }
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editItem[key];
                        }
                    }

                    var inputMap = { 
                        'objectName' : $scope.nsp + $scope.OBJECT_NAME,
                        'inputMap' : itemToSave
                    };
                    remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('create pricelist entry results:', results);
                        $rootScope.$broadcast('refreshObjectPricingElements');
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        //TODO: show save success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editItem[key] === null ? undefined : $scope.editItem[key]);
                        }
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('save pricelist entry results:', results);
                        $rootScope.$broadcast('refreshObjectPricingElements');
                        $scope.item = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.item[key] = results[key] + tzOffset;
                            } else {
                                $scope.item[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        //TODO: show save success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };


                $scope.createPriceListEntryItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editItem[key];
                        }
                    }

                    var inputMap = { 
                        'objectName' : $scope.nsp + $scope.OBJECT_NAME,
                        'inputMap' : itemToSave
                    };
                    
                    if($scope.pricingMode === 'DISCOUNT')
                    {
                    	var objectIds = [];
	                    var objectId = itemToSave[$scope.nsp + "PricingElementId__c"];
	                    var fieldsToQuery = [];
	                    objectIds.push(objectId);
	                    fieldsToQuery.push( $scope.nsp + "PricingVariableId__r."+$scope.nsp+"AppliesToVariableId__r."+$scope.nsp+"ChargeType__c");
	                    var fieldNames = JSON.stringify(fieldsToQuery);
	                    $scope.getSelectedFieldValuesForObject(JSON.stringify(objectIds),fieldNames,inputMap);
                    }
                    else
                	{
                    	$scope.createObject(inputMap);
                	}
                  
                }
                
                $scope.createObject = function(inputMap)
                {
                	remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('create pricelist entry results:', results);
                        
                        $rootScope.$broadcast('refreshObjectPricingElements');
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        $scope.validateObject(results);
                        //TODO: show save success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                }
                
                $scope.getSelectedFieldValuesForObject = function(objectIds,fieldNames, inputMapForCreateObject) {
                    var inputMap = { 'objectIds' : objectIds,'fieldNames': fieldNames};
                    remoteActions.invokeMethod('getSelectedFieldValuesForObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log($scope.objectAPIName + ' getSelectedFieldValuesForObject results:', results);
                        if(results != undefined)
                        {
                        	for(var i = 0 ; i < results.length ;i++)
                        	{
		                        var chargeType = results[i][$scope.nsp + "PricingVariableId__r"][$scope.nsp + "AppliesToVariableId__r"][$scope.nsp + "ChargeType__c"];
		                        if($scope.definedChargeTypes.includes(chargeType))
		                    	{
		                        	cpqService.showNotification({
		                                type: 'error',
		                                title: 'Error',
		                                content: 'More than one recurring or one-time adjustment cannot be defined'
		                            });
		                        	$scope.closeDetails();
		                    	}
		                        else
	                        	{
		                        	$scope.createObject(inputMapForCreateObject);
	                        	}
                        	}
                        }
                        else
                        {
                        	$scope.createObject(inputMapForCreateObject);
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };
                
                $scope.getSelectedFieldValuesForObjectSave = function(objectIds,fieldNames, inputMapForCreateObject, priceListId) {
                    var inputMap = { 'objectIds' : objectIds,'fieldNames': fieldNames};
                    remoteActions.invokeMethod('getSelectedFieldValuesForObject', JSON.stringify(inputMap)).then(function(results) {
                        if(results != undefined)
                        {
                        	for(var i = 0 ; i < results.length ;i++)
                        	{
		                        var chargeType = results[i][$scope.nsp + "PricingVariableId__r"][$scope.nsp + "AppliesToVariableId__r"][$scope.nsp + "ChargeType__c"];
		                        $scope.definedChargeTypesMap[priceListId] = chargeType;
		                        var existingTypes = [];
		                        if($scope.definedChargeTypesMap)
	                        	{
		                        	var keys = Object.keys($scope.definedChargeTypesMap);
		                        	var flag = true;
		                        	keys.forEach(function(key)
	                        		{
		                        		if(existingTypes.includes($scope.definedChargeTypesMap[key]))
	                        			{
		                        			cpqService.showNotification({
				                                type: 'error',
				                                title: 'Error',
				                                content: 'More than one recurring or one-time adjustment cannot be defined'
				                            });
		                        			flag = false;
				                        	$scope.closeDetails();
				                        	
	                        			}
		                        		else
	                        			{
		                        			existingTypes.push($scope.definedChargeTypesMap[key]);
	                        			}
		                        		
	                        		});
		                        	
	                        	}
		                        if(flag)
	                        	{
		                        	$scope.updateObject(inputMapForCreateObject);
	                        	}
                        	}
                        }
                        else
                        {
                        	$scope.updateObject(inputMapForCreateObject);
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.savePriceListEntryItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editItem[key] === null ? undefined : $scope.editItem[key]);
                        }
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) }; 
                    if($scope.pricingMode === 'DISCOUNT')
                    {
                    	var objectIds = [];
	                    var objectId = itemToSave[$scope.nsp + "PricingElementId__c"];
	                    objectIds.push(objectId);
	                    var fieldsToQuery = [];
	                    fieldsToQuery.push( $scope.nsp + "PricingVariableId__r."+$scope.nsp+"AppliesToVariableId__r."+$scope.nsp+"ChargeType__c");
	                    var fieldNames = JSON.stringify(fieldsToQuery);
	                    $scope.getSelectedFieldValuesForObjectSave(JSON.stringify(objectIds),fieldNames,inputMap,itemToSave["Id"]);
                    }
                    else
                	{
                    	$scope.updateObject(inputMap);
                	}
                           
                }

                $scope.validateObject = function(object) {
                    inputMap = { 
                        'input' : object,
                        'methodName' : 'validatePLEObject',
                        'options' : null
                    };
                    remoteActions.invokeMethod('validateObject', JSON.stringify(inputMap)).then(function(results) {
                        if(results.warningMessages != undefined && results.warningMessages.length > 0)
                        {
                            collectiveWarningMessage = results.warningMessages.join();
                            cpqService.showNotification({
                                type: 'warning',
                                title: 'WARNING',
                                content: collectiveWarningMessage
                            });
                        }    

                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };
            
                
                $scope.updateObject = function(inputMap) {
                	remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) { 
                        console.log('save pricelist entry results:', results);
                        
                        $rootScope.$broadcast('refreshObjectPricingElements');
                        $scope.item = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.item[key] = results[key] + tzOffset;
                            } else {
                                $scope.item[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails(); 
                        $scope.validateObject(results);
                        //TODO: show save success message
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                }

                $scope.getObjectTypes = function(item) {
                    $scope.objectTypes = [];
                    $scope.selectObjectType = false;
                    var inputMap = { 'objectName' : item };
                    remoteActions.invokeMethod('getObjectClassTypesByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectTypes results: ', results);
                        for (var i = 0; i < results.length; i++) {
                            $scope.selectObjectType = true;
                            var res = {
                                label: results[i].Name,
                                value: results[i].Id
                            };
                            $scope.objectTypes.push(res);
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.setupViewAttrs = function(section) {
                    if ($scope.priceListEntryItem !== undefined) {
                        $scope.customViewData = {
                            'name': section.facetSectionObj[$scope.nsp + 'ViewUri__c'],
                            'attrs': {
                                'objectId': $scope.priceListEntryItem.Id,
                                'objName': 'PricingElement__c',
                                'contextCriteriaMode': 'rightPane',
                                'parentObject': $scope.priceListEntryItem
                            }
                        };
                    } else {
                        $scope.customViewData = {
                            'name': section.facetSectionObj[$scope.nsp + 'ViewUri__c'],
                            'attrs': {
                                'objName': 'PricingElement__c',
                                'contextCriteriaMode': 'rightPane',
                                'parentObject': $scope.priceListEntryItem
                            }
                        };
                    }
                };

                $scope.searchPriceVariables = function() {
                    delete $scope.selectedPV;
                    var inputMap = {};
                    for (var key in $scope.editPV) {
                        if ($scope.editPV[key]) {
                            inputMap[key] = $scope.editPV[key];
                        }
                    }
                    if (inputMap[$scope.nsp + 'ChargeType__c'] !== 'Recurring') {
                        delete inputMap[$scope.nsp + 'RecurringFrequency__c'];
                    }
                    var inputMapJSON = JSON.stringify(inputMap);

                    var inputMap = { 
                        'objectName' : $scope.nsp + 'PricingVariable__c',
                        'inputMap' : inputMapJSON
                     };
                    remoteActions.invokeMethod('searchObjectFields', JSON.stringify(inputMap)).then(function(results) {
                        $scope.pricingVariableList = results;
                        $scope.showPVList = true;
                        console.log('pricingVariableList results: ', $scope.pricingVariableList);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.searchPricingElements = function() {
                    delete $scope.selectedPE;

                    var pricelistId;
                    if ($scope.pricingMode === 'PRICELIST') {
                        pricelistId = $scope.objectId;
                    } else if ($scope.pricingMode === 'PROMOTION') {
                        pricelistId = $scope.editItem[$scope.nsp + 'PriceListId__c'];
                    } else if ($scope.pricingMode === 'PRODUCT') {
                        pricelistId = $scope.editItem[$scope.nsp + 'PriceListId__c'];
                    } else if ($scope.pricingMode === 'DISCOUNT') {
                        pricelistId = $scope.editItem[$scope.nsp + 'PriceListId__c'];
                    }

                    var inputMap = {
                        'PricingVariableId': $scope.selectedPV.Id,
                        'PriceListId': pricelistId
                    };
                    var inputs = { 
                        'input' : JSON.stringify(inputMap),
                        'options' : ''
                    };
                    remoteActions.invokeMethod('getAvailablePricingVariableElements', JSON.stringify(inputs)).then(function(results) {
                        $scope.pricingElementList = results;
                        $scope.showPEList = true;
                        console.log('getAvailablePricingElements results: ', $scope.pricingElementList);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.selectPricingVariable = function(pv) {
                    $scope.selectedPV = pv;
                    $scope.showPVList = false;
                    $scope.searchPricingElements();
                };

                $scope.selectPricingElement = function(pe) {
                    $scope.selectedPE = pe;
                    $scope.showPEList = false;
                    $scope.editItem[$scope.nsp + 'PricingElementId__c'] = pe.Id;
                };

                $scope.init = function() {
                    $scope.tabs = cpqService.getPriceListEntryTabs();
                    $scope.setActiveTab(0);
                    
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);

                    if ($scope.priceListEntryItem === null) {
                        // create new record
                        $scope.displayMode = 'create';
                        if ($scope.pricingMode === 'PRICELIST') {
                            $scope.editItem[$scope.nsp + 'PriceListId__c'] = $scope.objectId;

                            if ($scope.parentPriceListId != null) {
                                //If there is a parent price list, set base to parent
                                $scope.editItem[$scope.nsp + 'BasePriceListId__c'] = $scope.parentPriceListId; 
                            } else {
                                //If no parent price list, set base to main price list
                                $scope.editItem[$scope.nsp + 'BasePriceListId__c'] = $scope.objectId; 
                            }

                        } else if ($scope.pricingMode === 'PROMOTION') {
                            $scope.editItem[$scope.nsp + 'PromotionId__c'] = $scope.promotionId;
                            $scope.editItem[$scope.nsp + 'PromotionItemId__c'] = $scope.promotionItem.Id;
                            $scope.editItem[$scope.nsp + 'ProductId__c'] = $scope.objectId;
                        } else if ($scope.pricingMode === 'PRODUCT') {
                            $scope.editItem[$scope.nsp + 'ProductId__c'] = $scope.objectId;
                        } else if ($scope.pricingMode === 'DISCOUNT') {
                        	$scope.tabs[1].hidden = true;
                            $scope.editItem[$scope.nsp + 'PromotionId__c'] = $scope.promotionId;
                            if($scope.$parent != undefined && $scope.$parent.promotion != undefined)
                            {
                            	$scope.editItem[$scope.nsp + 'PriceListId__c'] = $scope.$parent.promotion.arao_feat_disc__PriceListId__c;
                            }
                        }
                        $scope.editPV[$scope.nsp + 'Type__c'] = 'Price';
                        if($scope.pricingElementObjectType.Name === 'Cost') {
                            $scope.editPV[$scope.nsp + 'Type__c'] = 'Cost';
                        }
                    } else {
                        // edit existing record
                        $scope.displayMode = 'edit';
                        for (var key in $scope.priceListEntryItem) {
                            if (key !== '$$hashKey') {
                                $scope.editItem[key] = $scope.priceListEntryItem[key];
                            }
                        }
                        if ($scope.pricingMode === 'DISCOUNT')
                        {
                        	$scope.tabs[1].hidden = true;
                        }
                        $scope.selectedPE = $scope.priceListEntryItem[$scope.nsp + 'PricingElementId__r'];
                        $scope.selectedPV = $scope.selectedPE[$scope.nsp + 'PricingVariableId__r'];
                        $scope.editPV[$scope.nsp + 'ChargeType__c'] = $scope.selectedPV[$scope.nsp + 'ChargeType__c'];
                        $scope.editPV[$scope.nsp + 'RecurringFrequency__c'] = $scope.selectedPV[$scope.nsp + 'RecurringFrequency__c'];
                        $scope.editPV[$scope.nsp + 'SubType__c'] = $scope.selectedPV[$scope.nsp + 'SubType__c'];
                        $scope.editPV[$scope.nsp + 'Type__c'] = $scope.selectedPV[$scope.nsp + 'Type__c'];
                    }

                    $scope.chargeTypePicklist = [];
                    if ($scope.isAdj) {
                        $scope.chargeTypePicklist.push({'label': 'Adjustment', value: 'Adjustment'});
                        $scope.editPV[$scope.nsp + 'ChargeType__c'] = 'Adjustment';
                        if (($scope.pricingMode !== 'PROMOTION' && $scope.pricingMode !== 'DISCOUNT') || ($scope.rootProductId !== $scope.objectId)) {
                            $scope.editItem[$scope.nsp + 'OfferId__c'] = $scope.rootProductId;
                        }
                        $scope.chargeTypePicklist.push({'label': 'Usage', value: 'Usage'});
                    } else if ($scope.pricingElementObjectType.Name === 'Charge') {
                        $scope.chargeTypePicklist.push({'label': 'Recurring', value: 'Recurring'});
                        $scope.chargeTypePicklist.push({'label': 'One-time', value: 'One-time'});
                        $scope.chargeTypePicklist.push({'label': 'Usage', value: 'Usage'});
                    } else if ($scope.pricingElementObjectType.Name === 'Usage') {
                        $scope.chargeTypePicklist.push({'label': 'Usage', value: 'Usage'});
                        $scope.editPV[$scope.nsp + 'ChargeType__c'] = 'Usage';
                    } else if ($scope.pricingElementObjectType.Name === 'Cost') {
                        $scope.chargeTypePicklist.push({'label': 'Recurring', value: 'Recurring'});
                        $scope.chargeTypePicklist.push({'label': 'One-time', value: 'One-time'});
                        $scope.chargeTypePicklist.push({'label': 'Usage', value: 'Usage'});
                    }

                    if ($scope.isOverride) {
                        if (($scope.pricingMode !== 'PROMOTION' && $scope.pricingMode !== 'DISCOUNT') || ($scope.rootProductId !== $scope.objectId)) {
                            $scope.editItem[$scope.nsp + 'OfferId__c'] = $scope.rootProductId;
                        }
                        $scope.editItem[$scope.nsp + 'IsOverride__c'] = true;
                    }
                };
                $scope.init();
            }
        };
    }
]);

},{}],52:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocPriceListHierarchy', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'PriceListHierarchy.tpl.html',
            controller: function($scope, $rootScope, $sldsModal, $compile) {
                $scope.nsp = fileNsPrefix();
                $scope.priceList = $scope.customViewAttrs.contextInfo.customObject;
                $scope.priceListId = $scope.priceList.Id;
                $scope.sequenceField = $scope.nsp + 'Sequence__c';
                $scope.priceListHierarchy = [];

                $scope.getPriceListHierarchy = function() {
                    var inputMap= { 'priceListId' : $scope.priceListId };
                    remoteActions.invokeMethod('getPriceListHierarchy', JSON.stringify(inputMap)).then(function(results) {
                        $scope.priceListHierarchy = results;
                        console.log('getPriceListHierarchy results: ', results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.launchTab = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }
                    var data = {
                        'doAction': 'viewRecord',
                        'doAPIName': $scope.nsp + 'PriceList__c',
                        'obj': item,
                        'closeCurrentTab': false
                    };
                    var broadcastAction = {
                        'eventName': 'launchConsoleTab',
                        'eventData': data
                    };
                    if (window.frameElement !== null) {
                        // create a iframe resize event binding with the parent
                        window.parent.bindIframeEvents('broadcast', broadcastAction);
                    }
                };

                $scope.init = function() {
                    $scope.getPriceListHierarchy();
                };
                $scope.init();
            }
        };
    }
]);

},{}],53:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocPricingElementInfoCard', ['remoteActions',
    function(remoteActions) {
        return {
            scope: {
                priceListEntry: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'PricingElementInfoCard.tpl.html',
            controller: function($scope, $rootScope) {
                $scope.nsp = fileNsPrefix();
                $scope.currencySymbol = currencySymbol;
                $scope.pricingElement = $scope.priceListEntry[$scope.nsp + 'PricingElementId__r'];
                $scope.pricingVariable = $scope.pricingElement[$scope.nsp + 'PricingVariableId__r'];
            }
        };
    }
]);

},{}],54:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocPricingPlanStep', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                item: '=',
                parentItem: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'PricingPlanStep.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'PricingPlanStep__c';
                $scope.editObject = {};
                $scope.facets = [];

                $scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = { 
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectLayoutByName ' + objectName + ' results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.buildObjectLayout = function(results) {
                    $scope.objFacets = results.facets;
                    $scope.objectLayoutId = results.objLayout.Id;
                    $scope.facets = [];
                    if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
                        angular.forEach($scope.objFacets, function(facet, idx) {
                            facet.hasSectionCustomView = false;
                            facet.active = (idx === 0);
                            angular.forEach(facet.sections, function(section) {
                                if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                                    section.hasCustomView = true;
                                    facet.hasSectionCustomView = true;
                                }
                            });
                            $scope.facets.push(facet);
                        });
                    }
                    console.log('FACETS for pricing plan step: ', $scope.facets);
                };

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('describeObject ' + objectName + ' results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName ' + objectName + ' results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editObject[key];
                        }
                    }

                    var inputMap = { 
                        'objectName' : $scope.nsp + $scope.OBJECT_NAME,
                        'inputMap' : itemToSave
                    };
                    remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('create pricing plan step results: ', results);
                        $rootScope.$broadcast('refreshPricingPlanSteps');
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Pricing plan step created!',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editObject[key] === null ? undefined : $scope.editObject[key]);
                        }
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('save pricing plan step results: ', results);
                        $rootScope.$broadcast('refreshPricingPlanSteps');
                        $scope.item = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.item[key] = results[key] + tzOffset;
                            } else {
                                $scope.item[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Pricing plan step saved!',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.init = function() {
                    $scope.getObjectLayoutByName($scope.OBJECT_NAME, '');
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);

                    if ($scope.item.Id === undefined) {
                        $scope.displayMode = 'create';
                        $scope.editObject[$scope.nsp + 'PricingPlanId__c'] = $scope.parentItem.Id;
                    } else {
                        $scope.displayMode = 'edit';
                        for (var key in $scope.item) {
                            if (key !== '$$hashKey') {
                                $scope.editObject[key] = $scope.item[key];
                            }
                        }
                    }
                };
                $scope.init();
            }
        };
    }
]);

},{}],55:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocPricingPlanSteps', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'PricingPlanSteps.tpl.html',
            controller: function($scope, $rootScope, $sldsModal) {
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'PricingPlanStep__c';
                $scope.contextObject = $scope.customViewAttrs.contextInfo.customObject;
                $scope.contextObjectAPIName = $scope.customViewAttrs.contextInfo.customObjectAPIName;

                $scope.$on('refreshPricingPlanSteps', function() {
                    $scope.getPricingPlanSteps($scope.objectId);
                });

                $scope.selectItem = function(item) {
                    var broadcastData = {
                        facetType: 'PRICING_PLAN_STEP',
                        facetData: {
                            pricingPlanStep: item
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.newItem = function() {
                    $scope.selectItem({} );
                };

                $scope.editItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }
                    $scope.selectItem(item);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Pricing Plan Step';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the pricing plan step <i>' + item.Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete pricing plan step results: ', results);
                            $scope.getPricingPlanSteps($scope.objectId);
                            deleteModal.hide();
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Pricing plan step deleted.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('describeObject pricing plan step results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + 'pricingplansteps'] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + 'pricingplansteps'];
                        }
                        console.log('getFieldSets results: ', $scope.fieldSet);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getPricingPlanSteps = function() {
                    var inputMap = {
                        'pricingPlanId' : $scope.contextObject.Id
                    };
                    var inputMapJSON = JSON.stringify(inputMap);
                    var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                    remoteActions.invokeMethod('getPricingPlanSteps', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('getPricingPlanSteps results: ', results.planSteps);
                        $scope.items = results.planSteps;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.init = function() {
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getFieldSetsByName($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getPricingPlanSteps();
                };
                $scope.init();
            }
        };
    }
]);

},{}],56:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocPricingVariableBinding', ['remoteActions', 'cpqService', 
    function(remoteActions, cpqService) {
        return {
            scope: {
                pricingVariable: '=',
				binding: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'PricingVariableBinding.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.objectName = $scope.nsp + 'PricingVariableBinding__c';
				$scope.editObject = {};
				$scope.attrMap = {};
                $scope.attrObjMap = {};
                $scope.attrAssgnObjMap = {};
                $scope.facets = [];

                $scope.describeObjectByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log(objectName + ' getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

				$scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = { 
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' getObjectLayoutByName results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

				$scope.buildObjectLayout = function(results) {
					$scope.objFacets = results.facets;
					$scope.objectLayoutId = results.objLayout.Id;
					$scope.facets = [];
					if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
						angular.forEach($scope.objFacets, function(facet, idx) {
							facet.hasSectionCustomView = false;
							facet.active = (idx === 0);
							angular.forEach(facet.sections, function(section) {
								if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
									section.hasCustomView = true;
									facet.hasSectionCustomView = true;
								}
							});
							$scope.facets.push(facet);
						});
					}
					console.log($scope.objectAPIName + ' FACETS:', $scope.facets);
				};

				$scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editObject[key];
                        }
                    }

                    var inputMap = { 
                        'objectName': $scope.objectName,
                        'inputMap': itemToSave
                    };
                    remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('createObject results:', results);
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
						$rootScope.$broadcast('refreshFacetContent');
                        cpqService.showNotification({
							type: 'success',
							content: 'Pricing variable binding created.',
							autohide: true
						});
						$scope.closeDetails();
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editObject[key] === null ? undefined : $scope.editObject[key]);
                        }
                    }

                    var inputMap = { 'so': JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('updateObject results: ', results);
                        $scope.binding = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.binding[key] = results[key] + tzOffset;
                            } else {
                                $scope.binding[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $rootScope.$broadcast('refreshFacetContent');
                        cpqService.showNotification({
							type: 'success',
							content: 'Pricing variable binding saved.',
							autohide: true
						});
						$scope.closeDetails();
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

				$scope.init = function() {
                    $scope.describeObjectByName($scope.objectName);
                    $scope.getObjectPicklistsByName($scope.objectName);
					$scope.getObjectLayoutByName($scope.objectName, '');

					if ($scope.binding.Id === undefined) {
                        $scope.displayMode = 'create';
                        $scope.editObject[$scope.nsp + 'PricingVariableId__c'] = $scope.pricingVariable.Id;
					} else {
						$scope.displayMode = 'edit';
                        for (var key in $scope.binding) {
                            if (key !== '$$hashKey') {
                                $scope.editObject[key] = $scope.binding[key];
                            }
                        }
					}
                };
                $scope.init();
			}
		};
	}
]);

},{}],57:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocPricingVariableBindings', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'PricingVariableBindings.tpl.html',
            controller: function($scope, $rootScope, $sldsModal) {
                $scope.contextObject = $scope.customViewAttrs.contextInfo.customObject;
                $scope.contextObjectAPIName = $scope.customViewAttrs.contextInfo.customObjectAPIName;
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'PricingVariableBinding__c';
                $scope.items = [];

				$scope.$on('refreshFacetContent', function() {
					$scope.getPricingVariableBindings();
				});

                $scope.describeObjectByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log(objectName + ' getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

				$scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + 'pricingvariablebindings'] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + 'pricingvariablebindings'];
                        }
                        console.log('getFieldSets results: ', $scope.fieldSet);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getPricingVariableBindings = function() {
                    var inputMap = {
                        'pricingVariableId': $scope.contextObject.Id
                    };
                    var inputMapJSON = JSON.stringify(inputMap);
                    var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                    remoteActions.invokeMethod('getPricingVariableBindings', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('getPricingVariableBindings results: ', results.bindings);
                        $scope.items = results.bindings;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.editItem = function(item) {
                    var broadcastData = {
                        facetType: 'PRICING_VARIABLE_BINDING',
                        facetData: {
                            'binding': item,
                            'pricingVariable': $scope.contextObject
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Pricing Variable Binding';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the binding <i>' + item.Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete Pricing Variable Binding';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete Pricing Variable Binding results: ', results);
                            $scope.getPricingVariableBindings();
                            deleteModal.hide();
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Pricing variable binding deleted.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.newItem = function() {
                    $scope.editItem({});
                };

                $scope.init = function() {
                    $scope.getFieldSetsByName($scope.nsp + $scope.OBJECT_NAME);
					$scope.describeObjectByName($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);
					$scope.getPricingVariableBindings();
                };
                $scope.init();
            }
        };
    }
]);

},{}],58:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocProdCardinality', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                rootProductId: '=',
                prodChildItem: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ProdCardinality.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'ProductChildItem__c';
                $scope.editItem = {};
                $scope.overrideMode = false;
                $scope.parentProductId = $scope.prodChildItem.productId;
                $scope.prodObj = $scope.prodChildItem.productSO;
                $scope.prodChildItemObj = $scope.prodChildItem.cardinalitySO;
                $scope.promotionItem = $scope.prodChildItem.promotionItemSO;

                $scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = {
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectLayoutByName product child item results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.buildObjectLayout = function(results) {
                    $scope.objFacets = results.facets;
                    $scope.objectLayoutId = results.objLayout.Id;
                    $scope.facets = [];

                    if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {

                        angular.forEach($scope.objFacets, function(facet, idx) {
                            facet.hasSectionCustomView = false;
                            facet.active = (idx === 0);
                            angular.forEach(facet.sections, function(section) {
                                if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                                    section.hasCustomView = true;
                                    facet.hasSectionCustomView = true;
                                }
                            });
                            $scope.facets.push(facet);
                        });

                    }
                    console.log('FACETS for product child item: ', $scope.facets);
                };

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('describeObject product cardinality results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editItem[key] === null ? undefined : $scope.editItem[key]);
                        }
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('save product cardinality results:', results);
                        $scope.ProdChildItem = {};
                        $scope.editItem = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.prodChildItemObj[key] = results[key] + tzOffset;
                                $scope.editItem[key] = results[key] + tzOffset;
                            } else {
                                $scope.prodChildItemObj[key] = results[key];
                                $scope.editItem[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }

                        $scope.closeDetails();
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Product child item saved.',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.getOverride = function() {
                    var prodChild = $scope.prodChildItemObj === undefined ? null : $scope.prodChildItemObj.Id;

                    var inputMap = {
                        'type': 'Product Definition',
                        'contextId': $scope.rootProductId,
                        'overriddenPCIId': prodChild,
                        'hierarchyPath' : $scope.prodChildItem.hierarchyPath
                    };
                    if ($scope.promotionItem !== undefined) {
                        var prodHierarchyPath = $scope.prodChildItem.hierarchyPath;
                        inputMap['promotionItemId'] = $scope.promotionItem.Id;
                        inputMap['promotionId'] = $scope.promotionItem[$scope.nsp+'PromotionId__c'];
                        var promoItemPath = $scope.promotionItem[$scope.nsp+'ProductHierarchyPath__c'];
                        if (promoItemPath && promoItemPath.length > 0) {
                            if (prodHierarchyPath.length > 0) {
                                prodHierarchyPath = promoItemPath + '<' + prodHierarchyPath;
                            } else {
                                prodHierarchyPath = promoItemPath;
                            }
                        }
                        inputMap['hierarchyPath'] = prodHierarchyPath;
                    }

                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('getOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        if (results !== null) {
                            var obj = JSON.parse(results);
                            console.log('get override: ', obj);
                            $scope.overrideObj = obj.SObject;
                            $scope.overrideDef = obj.OverrideDefinition__c;
                            $scope.hasOverride = true;
                            $scope.objDisplayMode = 'view';
                        } else {
                            $scope.objDisplayMode = 'edit';
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.createOverride = function() {
                    var itemToCreate = {};
                    for (var key in $scope.editItem) {
                        itemToCreate[key] = ($scope.editItem[key] === null ? undefined : $scope.editItem[key]);
                    }
                    itemToCreate[$scope.nsp + 'IsOverride__c'] = true;
                    delete itemToCreate.$$hashKey;
                    delete itemToCreate.Id;

                    var prodHierarchyPath = $scope.prodChildItem.hierarchyPath;
                    if ($scope.promotionItem !== undefined) {
                        var promoItemPath = $scope.promotionItem[$scope.nsp+'ProductHierarchyPath__c'];
                        if (promoItemPath && promoItemPath.length > 0) {
                            if (prodHierarchyPath.length > 0) {
                                prodHierarchyPath = promoItemPath + '<' + prodHierarchyPath;
                            } else {
                                prodHierarchyPath = promoItemPath;
                            }
                        }
                    }

                    var inputMap = {
                        'type': 'Product Definition',
                        'contextId': $scope.rootProductId,
                        'overriddenObjectId': $scope.prodChildItemObj === undefined ? null : $scope.prodChildItemObj.Id,
                        'overriddenPCIId': $scope.prodChildItemObj === undefined ? null : $scope.prodChildItemObj.Id,
                        'isExclude': false,
                        'hierarchyPath': prodHierarchyPath
                    };
                    if ($scope.promotionItem !== undefined) {
                        inputMap['promotionItemId'] = $scope.promotionItem.Id;
                        inputMap['promotionId'] = $scope.promotionItem[$scope.nsp+'PromotionId__c'];
                    }
                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('createOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        var obj = JSON.parse(results);
                        console.log('create override: ', obj);
                        $scope.overrideObj = obj.SObject;
                        $scope.overrideDef = obj.OverrideDefinition__c;
                        $scope.hasOverride = true;
                        $scope.objDisplayMode = 'view';
                        $rootScope.$broadcast('refreshStructureItems');

                        cpqService.showNotification({
                            type: 'success',
                            content: 'Product child item override created.',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.validateObjectAndSaveOverride = function(event) {
                console.log('validateObjectAndSaveOverride');
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Validating..';
                    }

                    // special cases for nulls
                    var key;
                    for (key in $scope.objectFields) {
                        var type = $scope.objectFields[key].type;
                        if (type === 'DATE' || type === 'DOUBLE' || type === 'INTEGER') {
                            if ($scope.overrideObj[key] === null || $scope.overrideObj[key] === '') {
                                $scope.overrideObj[key] = undefined;
                            }
                        }
                    }

                    var itemToSave = {};
                    for (key in $scope.overrideObj) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.overrideObj[key] === null ? undefined : $scope.overrideObj[key]);
                        }
                    }

                    var pciObject = {};
                    for (key in $scope.prodChildItemObj) {
                        if (key !== '$$hashKey') {
                            pciObject[key] = ($scope.prodChildItemObj[key] === null ? undefined : $scope.prodChildItemObj[key]);
                        }
                    }

                    var inputMap = { 'input'      : itemToSave,
                                     'methodName' : 'preValidateProdChildItemOverrideObject',
                                     'options'    : pciObject };
                    console.log(event);
                    remoteActions.invokeMethod('validateObject', JSON.stringify(inputMap)).then(function(results) {
                        if(results.warningMessages != undefined && results.warningMessages.length > 0)
                        {
                            collectiveWarningMessage = results.warningMessages.join();
                            cpqService.showNotification({
                                type: 'error',
                                title: 'ERROR',
                                content: collectiveWarningMessage
                            });
                            event.currentTarget.disabled = false;
                            event.currentTarget.innerText = originalText;
                        }
                        else
                        {
                            console.log(event);
                            event.currentTarget.innerText = originalText;
                            $scope.saveOverride(event);
                        }

                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                }

                $scope.saveOverride = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    // special cases for nulls
                    var key;
                    for (key in $scope.objectFields) {
                        var type = $scope.objectFields[key].type;
                        if (type === 'DATE' || type === 'DOUBLE' || type === 'INTEGER') {
                            if ($scope.overrideObj[key] === null || $scope.overrideObj[key] === '') {
                                $scope.overrideObj[key] = undefined;
                            }
                        }
                    }

                    var itemToSave = {};
                    for (key in $scope.overrideObj) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.overrideObj[key] === null ? undefined : $scope.overrideObj[key]);
                        }
                    }

                    var prodHierarchyPath = $scope.prodChildItem.hierarchyPath;
                    var inputMap = {
                        'type': 'Product Definition',
                        'sObject': JSON.stringify(itemToSave),
                        'hierarchyPath': $scope.prodChildItem.hierarchyPath
                    };
                    if ($scope.promotionItem !== undefined) {
                        var promoItemPath = $scope.promotionItem[$scope.nsp+'ProductHierarchyPath__c'];
                        if (promoItemPath && promoItemPath.length > 0) {
                            if (prodHierarchyPath.length > 0) {
                                prodHierarchyPath = promoItemPath + '<' + prodHierarchyPath;
                            } else {
                                prodHierarchyPath = promoItemPath;
                            }
                        }
                        inputMap['hierarchyPath'] = prodHierarchyPath;
                    }

                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('saveOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('save override results: ', results);
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $rootScope.$broadcast('refreshStructureItems');
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Product child item override saved.',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.deleteOverride = function() {
                    var inputMap = {
                        'type': 'Product Definition',
                        'overrideDefinitionId': $scope.overrideDef.Id,
                        'contextId': $scope.rootProductId
                    };
                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('deleteOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('delete override: ', results);
                        $scope.overrideObj = null;
                        $scope.overrideDef = null;
                        $scope.hasOverride = false;
                        $scope.objDisplayMode = 'edit';
                        $rootScope.$broadcast('refreshStructureItems');
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.init = function() {
                    $scope.overrideObj = null;
                    $scope.overrideDef = null;
                    $scope.hasOverride = false;

                    $scope.getObjectLayoutByName($scope.OBJECT_NAME, '');
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);

                    $scope.editItem = {};
                    if ($scope.mode === 'add') {
                        $scope.overrideMode = false;
                        $scope.objDisplayMode = 'create';
                        $scope.editItem[$scope.nsp + 'ParentProductId__c'] = $scope.parentProductId;
                    } else {
                        $scope.objDisplayMode = 'edit';
                        for (var key in $scope.prodChildItemObj) {
                            if (key !== '$$hashKey') {
                                $scope.editItem[key] = $scope.prodChildItemObj[key];
                            }
                        }
                        if ($scope.rootProductId !== undefined) {
                            $scope.getOverride();
                        }
                    }

                    $scope.customViewAttrs = {
                        'objectId': $scope.prodChildItemObj === undefined ? $scope.parentProductId : $scope.prodChildItemObj.Id,
                        'contextCriteria': $scope.contextCriteria,
                        'contextCriteriaMode': 'rightPane',
                        'parentObject': $scope.prodChildItemObj
                    };
                };
                $scope.init();
            }
        };
    }
]);

},{}],59:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocProdChildDetails', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                rootProductId: '=',
                prodChildItem: '=',
                pricingMode: '=',
                promotionId: '=',
                isAdj: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ProdChildDetails.tpl.html',
            controller: function($scope, $rootScope) {
                console.log('ProdChildDetails scope:', $scope);
                $scope.nsp = fileNsPrefix();
                $scope.tabs = [];

                $scope.setActiveTab = function(activeIdx) {
                    angular.forEach($scope.tabs, function(tab, idx) {
                        if (activeIdx === idx) {
                            tab.active = true;
                            tab.init = true;
                        } else {
                            tab.active = false;
                        }
                    });
                    $scope.activeIdx = activeIdx;
                    cpqService.setProdChildActiveTabIdx(activeIdx);
                };

                $scope.$watch('isInOverrideMode', function(newValue) {
                    cpqService.setOverrideMode(newValue);
                });

                $scope.init = function() {
                    var administerRootProduct = ($scope.promotionId !== undefined);
                    $scope.tabs = cpqService.getProductChildTabs($scope.prodChildItem.isRoot, $scope.prodChildItem.isLeaf, administerRootProduct);
                    $scope.activeIdx = cpqService.getProdChildActiveTabIdx();
                    $scope.tabs[$scope.activeIdx].init = true;
                    $scope.isInOverrideMode = cpqService.getOverrideMode();
                    $scope.customViewAttrs = {
                        objectId: $scope.prodChildItem.productId,
                        rootProductId: $scope.rootProductId,
                        mode: 'override'
                    };
                    $scope.customViewAttrsPricing = {
                        objectId: $scope.prodChildItem.productId,
                        rootProductId: $scope.rootProductId,
                        mode: 'override'
                    };
                };
                $scope.init();
            }
        };
    }
]);

},{}],60:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocProdChildItem', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                mode: '=',
                rootProductId: '=',
                prodChildItem: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ProdChildItem.tpl.html',
            controller: function($scope, $rootScope, $timeout, $window) {
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'ProductChildItem__c';
                $scope.editItem = {};
                $scope.overrideMode = false;
                $scope.parentProductId = $scope.prodChildItem.productId;
                $scope.prodObj = $scope.prodChildItem.productSO;
                $scope.prodChildItemObj = $scope.prodChildItem.pciSO;
                $scope.promotionItem = $scope.prodChildItem.promotionItemSO;
                $scope.labels = $window.labels;

                $scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = {
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectLayoutByName product child item results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.buildObjectLayout = function(results) {
                    $scope.objFacets = results.facets;
                    $scope.objectLayoutId = results.objLayout.Id;
                    $scope.facets = [];
                    if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
                        angular.forEach($scope.objFacets, function(facet, idx) {
                            facet.hasSectionCustomView = false;
                            facet.active = (idx === 0);
                            angular.forEach(facet.sections, function(section) {
                                if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
                                    section.hasCustomView = true;
                                    facet.hasSectionCustomView = true;
                                }
                            });
                            $scope.facets.push(facet);
                        });
                    }
                    console.log('FACETS for product child item: ', $scope.facets);
                };

                $scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.isLeafProduct = function(){
                    if($scope.prodChildItem.isLeaf){
                        return true;
                    }
                    else{
                        return false;
                    }
                }

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('describeObject product child item results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = $scope.labels.SavingLabel;
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editItem[key];
                        }
                    }

                    var inputMap = {
                        'objectName' : $scope.nsp + $scope.OBJECT_NAME,
                        'inputMap' : itemToSave
                    };
                    remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('create product child item results: ', results);
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $rootScope.$broadcast('refreshProductChildren', {'productId': results[$scope.nsp+'ParentProductId__c']});
                        $scope.closeDetails();
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Product child item created.',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = $scope.labels.SavingLabel;
                    }

                    var itemToSave = {};
                    for (var key in $scope.editItem) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editItem[key] === null ? undefined : $scope.editItem[key]);
                        }
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('save product child item results:', results);
                        $scope.ProdChildItem = {};
                        $scope.editItem = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.prodChildItemObj[key] = results[key] + tzOffset;
                                $scope.editItem[key] = results[key] + tzOffset;
                            } else {
                                $scope.prodChildItemObj[key] = results[key];
                                $scope.editItem[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $rootScope.$broadcast('refreshProductChildren', {'productId': results[$scope.nsp+'ParentProductId__c']});
                        $scope.closeDetails();
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Product child item saved.',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.getOverride = function() {
                    var prodChild = $scope.prodChildItemObj === undefined ? null : $scope.prodChildItemObj.Id;

                    var inputMap = {
                        'type': 'Product Definition',
                        'contextId': $scope.rootProductId,
                        'overriddenPCIId': prodChild,
                        'hierarchyPath' : $scope.prodChildItem.hierarchyPath
                    };
                    if ($scope.promotionItem !== undefined) {
                        inputMap['promotionItemId'] = $scope.promotionItem.Id;
                        inputMap['promotionId'] = $scope.promotionItem[$scope.nsp+'PromotionId__c'];
                        var promoItemPath = $scope.promotionItem[$scope.nsp+'ProductHierarchyPath__c'];
                        var prodHierarchyPath = $scope.prodChildItem.hierarchyPath;
                        if (promoItemPath && promoItemPath.length > 0) {
                        	if (prodHierarchyPath.length > 0) {
                        		prodHierarchyPath = promoItemPath + '<' + prodHierarchyPath;
                        	} else {
                        		prodHierarchyPath = promoItemPath;
                        	}
                        }
                        inputMap['hierarchyPath'] = prodHierarchyPath;
                    }
                    
                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('getOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        if (results !== null) {
                            var obj = JSON.parse(results);
                            console.log('get override: ', obj);
                            $scope.overrideObj = obj.SObject;
                            $scope.overrideDef = obj.OverrideDefinition__c;
                            $scope.hasOverride = true;
                            $scope.excludePCI = ($scope.overrideDef[$scope.nsp + 'IsExclude__c']);
                            $scope.objDisplayMode = 'view';
                        } else {
                            $scope.objDisplayMode = 'edit';
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.createOverride = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = $scope.labels.CreatingLabel;
                    }
                    var itemToCreate = {};
                    for (var key in $scope.editItem) {
                        itemToCreate[key] = ($scope.editItem[key] === null ? undefined : $scope.editItem[key]);
                    }
                    itemToCreate[$scope.nsp + 'IsOverride__c'] = true;
                    delete itemToCreate.$$hashKey;
                    delete itemToCreate.Id;

                    var prodHierarchyPath = $scope.prodChildItem.hierarchyPath;
                    if ($scope.promotionItem !== undefined) {
                        var promoItemPath = $scope.promotionItem[$scope.nsp+'ProductHierarchyPath__c'];
                        if (promoItemPath && promoItemPath.length > 0) {
                            if (prodHierarchyPath.length > 0) {
                                prodHierarchyPath = promoItemPath + '<' + prodHierarchyPath;
                            } else {
                                prodHierarchyPath = promoItemPath;
                            }
                        }
                    }

                    var inputMap = {
                        'type': 'Product Definition',
                        'contextId': $scope.rootProductId,
                        'overriddenObjectId': $scope.prodChildItemObj === undefined ? null : $scope.prodChildItemObj.Id,
                        'overriddenPCIId': $scope.prodChildItemObj === undefined ? null : $scope.prodChildItemObj.Id,
                        'isExclude': false,
                        'hierarchyPath': prodHierarchyPath
                    };
                    if ($scope.promotionItem !== undefined) {
                        inputMap['promotionItemId'] = $scope.promotionItem.Id;
                        inputMap['promotionId'] = $scope.promotionItem[$scope.nsp+'PromotionId__c'];
                    }
                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('createOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        var obj = JSON.parse(results);
                        console.log('create override:', obj);
                        $scope.overrideObj = obj.SObject;
                        $scope.overrideDef = obj.OverrideDefinition__c;
                        $scope.hasOverride = true;
                        $scope.excludePCI = false;
                        $scope.objDisplayMode = 'view';
                        
                        var pciIds = [];
                        pciIds.push($scope.prodChildItemObj.Id);
                        var prodHierPath = $scope.overrideDef[$scope.nsp+'ProductHierarchyPath__c'];
                        var pciIdsToProdHierarchyMap = {};
                        pciIdsToProdHierarchyMap[$scope.prodChildItemObj.Id] = prodHierPath;

                        $rootScope.$broadcast('refreshProductCardinality', {'mode': 'OVERRIDE_CARDINALITY', 'pciIds': pciIds, 'pciIdstoProdHierarchyMap': pciIdsToProdHierarchyMap});


                        cpqService.showNotification({
                            type: 'success',
                            content: 'Product child item override created.',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.validateObjectAndSaveOverride = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = $scope.labels.ValidatingLabel;
                    }

                    // special cases for nulls
                    var key;
                    for (key in $scope.objectFields) {
                        var type = $scope.objectFields[key].type;
                        if (type === 'DATE' || type === 'DOUBLE' || type === 'INTEGER') {
                            if ($scope.overrideObj[key] === null || $scope.overrideObj[key] === '') {
                                $scope.overrideObj[key] = undefined;
                            }
                        }
                    }

                    var itemToSave = {};
                    for (key in $scope.overrideObj) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.overrideObj[key] === null ? undefined : $scope.overrideObj[key]);
                        }
                    }

                    var pciObject = {};
                    for (key in $scope.prodChildItemObj) {
                        if (key !== '$$hashKey') {
                            pciObject[key] = ($scope.prodChildItemObj[key] === null ? undefined : $scope.prodChildItemObj[key]);
                        }
                    }

                    var inputMap = { 'input'      : itemToSave,
                                     'methodName' : 'preValidateProdChildItemOverrideObject',
                                     'options'    : pciObject };
                    console.log(event);
                    remoteActions.invokeMethod('validateObject', JSON.stringify(inputMap)).then(function(results) {
                        if(results.warningMessages != undefined && results.warningMessages.length > 0)
                        {
                            collectiveWarningMessage = results.warningMessages.join();
                            cpqService.showNotification({
                                type: 'error',
                                title: 'ERROR',
                                content: collectiveWarningMessage
                            });
                            event.currentTarget.disabled = false;
                            event.currentTarget.innerText = originalText;
                        }
                        else
                        {
                            console.log(event);
                            event.currentTarget.innerText = originalText;
                            $scope.saveOverride(event);
                        }

                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                }

                $scope.saveOverride = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = $scope.labels.SavingLabel;
                    }

                    // special cases for nulls
                    var key;
                    for (key in $scope.objectFields) {
                        var type = $scope.objectFields[key].type;
                        if (type === 'DATE' || type === 'DOUBLE' || type === 'INTEGER') {
                            if ($scope.overrideObj[key] === null || $scope.overrideObj[key] === '') {
                                $scope.overrideObj[key] = undefined;
                            }
                        }
                    }

                    var itemToSave = {};
                    for (key in $scope.overrideObj) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.overrideObj[key] === null ? undefined : $scope.overrideObj[key]);
                        }
                    }

                    var prodHierarchyPath = $scope.prodChildItem.hierarchyPath;
                    var inputMap = {
                        'type': 'Product Definition',
                        'sObject': JSON.stringify(itemToSave),
                        'hierarchyPath': $scope.prodChildItem.hierarchyPath
                    };
                    if ($scope.promotionItem !== undefined) {
                        var promoItemPath = $scope.promotionItem[$scope.nsp+'ProductHierarchyPath__c'];
                        if (promoItemPath && promoItemPath.length > 0) {
                            if (prodHierarchyPath.length > 0) {
                                prodHierarchyPath = promoItemPath + '<' + prodHierarchyPath;
                            } else {
                                prodHierarchyPath = promoItemPath;
                            }
                        }
                        inputMap['hierarchyPath'] = prodHierarchyPath;
                    }

                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('saveOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('save override results: ', results);
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        
                        var pciIds = [];
                        pciIds.push($scope.prodChildItemObj.Id);
                        var prodHierPath = $scope.prodChildItem.hierarchyPath;
                        var pciIdsToProdHierarchyMap = {};
                        pciIdsToProdHierarchyMap[$scope.prodChildItemObj.Id] = prodHierPath;
                        $rootScope.$broadcast('refreshProductCardinality', {'mode': 'OVERRIDE_CARDINALITY', 'pciIds': pciIds, 'pciIdstoProdHierarchyMap':pciIdsToProdHierarchyMap});
                        
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Product child item override saved.',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.deleteOverride = function(event) {
                    if (event) {
                        event.currentTarget.disabled = true;
                    }
                    var inputMap = {
                        'type': 'Product Definition',
                        'overrideDefinitionId': $scope.overrideDef.Id,
                        'contextId': $scope.rootProductId
                    };
                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('deleteOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('delete override: ', results);
                        var prodHierPath = $scope.overrideDef[$scope.nsp+'ProductHierarchyPath__c'];
                        $scope.overrideObj = null;
                        $scope.overrideDef = null;
                        $scope.hasOverride = false;
                        $scope.excludePCI = false;
                        $scope.objDisplayMode = 'edit';
                        
                        $rootScope.$broadcast('refreshProductCardinality', {'mode': 'OVERRIDE_CARDINALITY_DELETE', 'pciId': $scope.prodChildItemObj.Id, 'productHierarchyPath': prodHierPath});

                        cpqService.showNotification({
                            type: 'success',
                            content: 'Product child item override deleted.',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.excludeItem = function(event) {
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Excluding...';
                    }
                    var prodChildId = $scope.prodChildItemObj === undefined ? null : $scope.prodChildItemObj.Id;

                    var prodHierarchyPath = $scope.prodChildItem.hierarchyPath;
                    if ($scope.promotionItem !== undefined) {
                        var promoItemPath = $scope.promotionItem[$scope.nsp+'ProductHierarchyPath__c'];
                        if (promoItemPath && promoItemPath.length > 0) {
                            if (prodHierarchyPath.length > 0) {
                                prodHierarchyPath = promoItemPath + '<' + prodHierarchyPath;
                            } else {
                                prodHierarchyPath = promoItemPath;
                            }
                        }
                    }
                    
                    var inputMap = {
                        'type': 'Product Definition',
                        'contextId': $scope.rootProductId,
                        'overriddenObjectId': prodChildId,
                        'overriddenPCIId': prodChildId,
                        'isExclude': true,
                        'hierarchyPath': prodHierarchyPath
                    };
                    if ($scope.promotionItem !== undefined) {
                        inputMap['promotionItemId'] = $scope.promotionItem.Id;
                        inputMap['promotionId'] = $scope.promotionItem[$scope.nsp+'PromotionId__c'];
                    }
                    console.log('Input Map: ', inputMap);
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('createOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        var obj = JSON.parse(results);
                        console.log('create override: ', obj);
                        $scope.overrideDef = obj.OverrideDefinition__c;
                        $scope.hasOverride = true;
                        $scope.excludePCI = true;
                        $scope.objDisplayMode = 'view';
                        $rootScope.$broadcast('refreshStructureItems');
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Product child item excluded.',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.init = function() {
                    $scope.overrideObj = null;
                    $scope.overrideDef = null;
                    $scope.hasOverride = false;

                    $scope.getObjectLayoutByName($scope.OBJECT_NAME, '');
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);

                    $scope.editItem = {};
                    if ($scope.mode === 'add') {
                        $scope.overrideMode = false;
                        $scope.objDisplayMode = 'create';
                        $scope.editItem[$scope.nsp + 'ParentProductId__c'] = $scope.parentProductId;
                    } else {
                        $scope.objDisplayMode = 'edit';
                        for (var key in $scope.prodChildItemObj) {
                            if (key !== '$$hashKey') {
                                $scope.editItem[key] = $scope.prodChildItemObj[key];
                            }
                        }
                        if ($scope.rootProductId !== undefined) {
                            $scope.getOverride();
                        }
                    }

                    $scope.customViewAttrs = {
                        'objectId': $scope.prodChildItemObj === undefined ? $scope.parentProductId : $scope.prodChildItemObj.Id,
                        'contextCriteria': $scope.contextCriteria,
                        'contextCriteriaMode': 'rightPane',
                        'parentObject': $scope.prodChildItemObj
                    };
                };
                $scope.init();
            }
        };
    }
]);

},{}],61:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocProductAdjustments', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ProductAdjustments.tpl.html',
            controller: function($scope, $rootScope) {
                $scope.nsp = fileNsPrefix();
                $scope.promotion = $scope.customViewAttrs.contextInfo.customObject;
                $scope.promotionId = $scope.promotion.Id;
                $scope.pricingMode = $scope.customViewAttrs.contextInfo.pricingMode;
                $scope.OBJECT_NAME = 'PromotionItem__c';
                $scope.fieldSetName = 'promotionitem';
                $scope.promotionItemList = [];
                $scope.productList = [];
                $scope.selectedProductId = '';

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('vlocPromotionProducts - describeObject results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + $scope.fieldSetName] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + $scope.fieldSetName];
                        }
                        console.log('vlocPromotionProducts - getFieldSets results: ', $scope.fieldSet);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.$on('refreshPromoItems', function(event, data) {
                    $scope.getApplicableProducts();
                });

                $scope.getApplicableProducts = function() {
                    $scope.promotionItemList = [];
                    var rootProductIds = [];

                    var inputMap = {
                        'promotionId': $scope.promotionId,
                        'mode': 'ITEMS_ONLY'
                    };
                    remoteActions.invokeMethod('getPromotionItems', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getPromotionApplicableProducts results: ', results);
                        angular.forEach(results, function(item) {
                            var itemProductId = item[$scope.nsp + 'ProductId__c'];
                            rootProductIds.push(itemProductId);
                            $scope.promotionItemList.push(item);
                        });
                        $scope.getRootProducts(rootProductIds);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getRootProducts = function(rootProductIds) {
                    $scope.productList = [];
                    var inputMap = {
                        'productIds': rootProductIds,
                        'pageNumber': 1,
                        'pageSize': null
                    };
                    remoteActions.invokeMethod('getProductHierarchy', JSON.stringify(inputMap)).then(function(results) {
                        angular.forEach(results.productList, function(item, idx) {
                            var promoItem = $scope.promotionItemList[idx];
                            item.rootIndex = (idx + 1) + '.';
                            item.level = 1;
                            item.isRoot = true;
                            item.show = true;
                            item.showChildren = false;
                            item.fetchedChildren = true;
                            item.hierarchyPath = '';
                            item.isPromoItem = true;
                            item.promotionItemSO = promoItem;
                            item.rootProductId = (promoItem[$scope.nsp+'OfferId__c'] || item.productId);
                            item.uniqueId = item.promotionItemSO.Id + '_' + item.productId;
                            $scope.productList.push(item);
                            angular.forEach(item.children, function(child) {
                                if (child.pciSO && child.pciSO[$scope.nsp+'IsRootProductChildItem__c']) {
                                    item.cardinalitySO = child.pciSO;
                                } else {
                                    child.rootIndex = '';
                                    child.level = item.level + 1;
                                    child.isRoot = false;
                                    child.show = false;
                                    child.showChildren = false;
                                    child.fetchedChildren = false;
                                    child.isPromoItem = false;
                                    child.promotionItemSO = item.promotionItemSO;
                                    child.rootProductId = item.rootProductId;
                                    child.parentId = item.productId;
                                    child.hierarchyPath = child.productId;
                                    child.uniqueId = child.promotionItemSO.Id + '_' + child.productId;
                                    $scope.productList.push(child);
                                }
                            });
                            if (item.childrenInfo.currentPage < item.childrenInfo.totalPages) {
                                var loadMoreItem = {'show': false, 'loadMore': true, 'level': (item.level + 1), 'parentItem': item};
                                item.children.push(loadMoreItem);
                                $scope.productList.push(loadMoreItem);
                            }
                        });
                        console.log('getProductHierarchy ROOT: ', $scope.productList);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.toggleItem = function(parentItem, parentItemIdx, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    if (parentItem.showChildren) {
                        $scope.toggleItemVisibility(parentItem, false);
                    } else {
                        if (parentItem.fetchedChildren) {
                            // children already fetched, simply toggle visibility
                            $scope.toggleItemVisibility(parentItem, true);
                        } else {
                            // fetch children
                            $scope.getProductChildren(parentItem, parentItemIdx, 1);
                        }
                    }
                };

                $scope.toggleItemVisibility = function(parentItem, visible) {
                    parentItem.showChildren = visible;
                    angular.forEach(parentItem.children, function(item, idx) {
                        item.show = visible;
                        if (!visible && item.children) {
                            $scope.toggleItemVisibility(item, visible);
                        }
                    });
                };

                $scope.getProductChildren = function(parentItem, parentItemIdx, pageNumber) {
                    var inputMap = {
                        'productIds': [parentItem.productId],
                        'pageNumber': pageNumber,
                        'pageSize': null
                    };
                    remoteActions.invokeMethod('getProductHierarchy', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getProductHierarchy results: ', results);
                        if (pageNumber === 1) {
                            parentItem.children = [];
                            parentItemIdx++;
                        } else {
                            $scope.productList.splice(parentItemIdx, 1);
                            parentItem.children.pop();
                        }

                        if (results.productList && results.productList.length > 0) {
                            var cardinalityObjOffset = 0;
                            angular.forEach(results.productList[0].children, function(item, idx) {
                                if (item.pciSO && item.pciSO[$scope.nsp+'IsRootProductChildItem__c']) {
                                    parentItem.cardinalitySO = item.pciSO;
                                    cardinalityObjOffset++;
                                } else {
                                    item.rootIndex = '';
                                    item.level = parentItem.level + 1;
                                    item.isRoot = false;
                                    item.show = true;
                                    item.showChildren = false;
                                    item.fetchedChildren = false;
                                    item.isPromoItem = false;
                                    item.promotionItemSO = parentItem.promotionItemSO;
                                    item.rootProductId = parentItem.rootProductId;
                                    item.parentId = parentItem.productId;
                                    item.hierarchyPath = parentItem.hierarchyPath + '<' + item.productId;
                                    item.uniqueId = item.promotionItemSO.Id + '_' + item.productId;
                                    parentItem.children.push(item);
                                    $scope.productList.splice((parentItemIdx + idx - cardinalityObjOffset), 0, item);
                                }
                            });
                            parentItem.childrenInfo = results.productList[0].childrenInfo;
                            if (parentItem.childrenInfo.currentPage < parentItem.childrenInfo.totalPages) {
                                var loadMoreItem = {'show': true, 'loadMore': true, 'level': (parentItem.level + 1), 'parentItem': parentItem};
                                parentItem.children.push(loadMoreItem);
                                $scope.productList.splice((parentItemIdx + results.productList.length + 1), 0, loadMoreItem);
                            }
                        }
                        parentItem.showChildren = true;
                        parentItem.fetchedChildren = true;
                        console.log('getProductChildren: ', $scope.productList);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.selectItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    $scope.selectedProductId = item.promotionItemSO.Id + '_' + item.productId;
                    var broadcastData = {
                        facetType: 'PROD_CHILD_DETAILS',
                        facetData: {
                            promotionId: $scope.promotionId,
                            rootProductId: item.rootProductId,
                            prodChildItem: item,
                            pricingMode: $scope.pricingMode
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.$on('hideItemDetails', function() {
                    $scope.selectedProductId = '';
                });

                $scope.init = function() {
                    $scope.getApplicableProducts();
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getFieldSetsByName($scope.nsp + $scope.OBJECT_NAME);
                };
                $scope.init();
            }
        };
    }
]);

},{}],62:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocProductAttributes', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                rootProductId: '=',
                prodChildItem: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ProductAttributes.tpl.html',
            controller: function($scope, $rootScope, $sldsModal) {
                $scope.nsp = fileNsPrefix();
                $scope.OBJECT_NAME = 'Product2';
                $scope.productId = $scope.prodChildItem.productId;
                $scope.prodChildItemObj = $scope.prodChildItem.pciSO;
                $scope.promotionItem = $scope.prodChildItem.promotionItemSO;
                $scope.attrMap = {};
                $scope.attrOverrideMap = {};
                $scope.AttrObjMap = {};
                $scope.AttrAssgnObjMap = {};
                $scope.AttrPicklistMap = {};
                $scope.AttrLookupMap = {};
                $scope.AttrOverrideAssgnObjMap = {};
                $scope.AttrOverrideDefObjMap = {};
                $scope.AttrOverridePicklistMap = {};
                $scope.AttrOverrideLookupMap = {};
                $scope.tmpAttrAssgnObj = {};
                $scope.tmpPicklistItems = [];
                $scope.tmpLookupItems = [];

                $scope.$on('refreshItems', function() {
                    $scope.getAppliedAttributesFields(); //Is this doing anything?
                });

                $scope.$on('ATTR_ASSGN_METADATA_CHANGE', function(event, data) {
                    $scope.tmpAttrAssgnObj = data.attrAssgnObj;
                    $scope.tmpPicklistItems = data.picklistItems;
                    $scope.tmpLookupItems = data.lookupItems;
                });

                $scope.getObjectLayoutById = function(objectId, forSelf) {
                    var inputMap = {
                        'objectId' : objectId,
                        'isInherited' : forSelf
                    };
                    remoteActions.invokeMethod('getObjectLayoutById', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getObjectLayoutById product attributes: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.buildObjectLayout = function(results) {
                    $scope.sections = [];
                    if (results.facets && results.facets.length > 0) {
                        angular.forEach(results.facets, function(facet, idx) {
                            if (facet.sections && facet.sections.length > 0) {
                                angular.forEach(facet.sections, function(section) {
                                    if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Field Layout') {
                                        var seList = [];
                                        angular.forEach(section.sectionElements, function(sectionEl) {
                                            if (sectionEl[$scope.nsp + 'Type__c'] === 'Attribute') {
                                                $scope.getAttributeAssignmentByAttributeId(sectionEl[$scope.nsp + 'AttributeId__c']);
                                                sectionEl.role = 'sectionElement';
                                                seList.push(sectionEl);
                                            }
                                        });
                                        if (seList.length > 0) {
                                            var sectionObj = {'role': 'section', 'name': section.sectionObj.Name};
                                            sectionObj[$scope.nsp+'AttributeId__c'] = '';
                                            $scope.sections.push(sectionObj);
                                            $scope.sections.push.apply($scope.sections, seList);
                                        }
                                    }
                                });
                            }
                        });
                    }
                    console.log('SECTIONS for Product Attributes:', $scope.sections);
                };

                $scope.describeObjectById = function(objectId) {
                    var inputMap = { 'objectId' : objectId };
                    remoteActions.invokeMethod('describeObjectbyId', JSON.stringify(inputMap)).then(function(results) {
                        console.log('describeObjectById product attributes: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName product attributes:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getAttributeAssignmentByAttributeId = function(attributeId) {
                    var inputMap = {
                        'attributeId' : attributeId,
                        'objectId' : $scope.productId
                    };
                    remoteActions.invokeMethod('getAttributeAssignmentByAttributeId', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getAttributeAssignmentByAttributeId results: ', results);
                        $scope.AttrObjMap[attributeId] = results.attribute;
                        $scope.AttrAssgnObjMap[attributeId] = results.attributeAssignment;
                        $scope.AttrPicklistMap[attributeId] = results.picklistItems;
                        $scope.AttrLookupMap[attributeId] = results.lookupItems;

                        var item = {};
                        item.attrId = attributeId;
                        if (results.attributeAssignment) {
                            item.aaId = results.attributeAssignment.Id;
                        }
                        $scope.getOverride(item);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getOverride = function(item) {
                    var prodChild = $scope.prodChildItemObj === undefined ? null : $scope.prodChildItemObj.Id;

                    var inputMap = {
                        'type': 'Attribute',
                        'contextId': $scope.rootProductId,
                        'overriddenObjectId': item.aaId,
                        'overriddenPCIId': prodChild,
                        'hierarchyPath' : $scope.prodChildItem.hierarchyPath
                    };
                    if ($scope.promotionItem !== undefined) {
                    	var prodHierarchyPath = $scope.prodChildItem.hierarchyPath;
                        inputMap['promotionItemId'] = $scope.promotionItem.Id;
                        inputMap['promotionId'] = $scope.promotionItem[$scope.nsp+'PromotionId__c'];
                        var promoItemPath = $scope.promotionItem[$scope.nsp+'ProductHierarchyPath__c'];
                        if (promoItemPath && promoItemPath.length > 0) {
                            if (prodHierarchyPath.length > 0) {
                                prodHierarchyPath = promoItemPath + '<' + prodHierarchyPath;
                            } else {
                                prodHierarchyPath = promoItemPath;
                            }
                        }
                        inputMap['hierarchyPath'] = prodHierarchyPath;
                    }
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('getOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        if (results === null) {
                            $scope.AttrOverrideAssgnObjMap[item.attrId] = null;
                        } else {
                            var obj = JSON.parse(results);
                            console.log('Get Override:', obj);
                            $scope.AttrOverrideDefObjMap[item.attrId] = obj.OverrideDefinition__c;
                            $scope.AttrOverridePicklistMap[item.attrId] = (obj.PicklistItems || null);
                            $scope.AttrOverrideLookupMap[item.attrId] = (obj.LookupItems || null);
                            $scope.AttrOverrideAssgnObjMap[item.attrId] = angular.copy(obj.SObject);
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.showAttributeMetadata = function(attrId) {
                    var modalScope = $scope.$new();
                    modalScope.modalTitle = 'Attribute Metadata';
                    modalScope.mode = 'override';
                    modalScope.objectId = $scope.productId;
                    modalScope.attrId = attrId;
                    modalScope.overrideAttrAssgnObj = angular.copy($scope.AttrOverrideAssgnObjMap[attrId]);
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Save';

                    $scope.tmpAttrAssgnObj = modalScope.overrideAttrAssgnObj;
                    $scope.tmpPicklistItems = $scope.AttrOverridePicklistMap[attrId];
                    $scope.tmpLookupItems = $scope.AttrOverrideLookupMap[attrId];

                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Saving...';
                        }

                        $scope.AttrOverridePicklistMap[attrId] = angular.copy($scope.tmpPicklistItems);
                        $scope.AttrOverrideLookupMap[attrId] = angular.copy($scope.tmpLookupItems);
                        $scope.AttrOverrideAssgnObjMap[attrId] = angular.copy($scope.tmpAttrAssgnObj);
                        $scope.saveOverride(attrId, event);
                    };

                    $scope.metadataModal = $sldsModal({
                        templateUrl: 'AttributeMetadataModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.createOverride = function(attributeId) {
                    var prodHierarchyPath = $scope.prodChildItem.hierarchyPath;
                    if ($scope.promotionItem !== undefined) {
                        var promoItemPath = $scope.promotionItem[$scope.nsp+'ProductHierarchyPath__c'];
                        if (promoItemPath && promoItemPath.length > 0) {
                            if (prodHierarchyPath.length > 0) {
                                prodHierarchyPath = promoItemPath + '<' + prodHierarchyPath;
                            } else {
                                prodHierarchyPath = promoItemPath;
                            }
                        }
                    }

                    var inputMap = {
                        'type': 'Attribute',
                        'contextId': $scope.rootProductId,
                        'overriddenObjectId': $scope.AttrAssgnObjMap[attributeId].Id,
                        'overriddenPCIId':$scope.prodChildItemObj === undefined ? null : $scope.prodChildItemObj.Id,
                        'hierarchyPath': prodHierarchyPath
                    };
                    if ($scope.promotionItem !== undefined) {
                        inputMap['promotionItemId'] = $scope.promotionItem.Id;
                        inputMap['promotionId'] = $scope.promotionItem[$scope.nsp+'PromotionId__c'];
                    }
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('createOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        var obj = JSON.parse(results);
                        console.log('create override: ', obj);
                        $scope.AttrOverrideDefObjMap[attributeId] = obj.OverrideDefinition__c;
                        $scope.AttrOverridePicklistMap[attributeId] = (obj.PicklistItems || null);
                        $scope.AttrOverrideAssgnObjMap[attributeId] = angular.copy(obj.SObject);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.saveOverride = function(attributeId, event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                    }

                    var overrideObj = $scope.AttrOverrideAssgnObjMap[attributeId];
                    // special cases for nulls
                    var key;
                    for (key in $scope.objectFields) {
                        var type = $scope.objectFields[key].type;
                        if (type === 'DATE' || type === 'DOUBLE' || type === 'INTEGER') {
                            if (overrideObj[key] === null || overrideObj[key] === '') {
                                overrideObj[key] = undefined;
                            }
                        }
                    }

                    var itemToSave = {};
                    for (key in overrideObj) {
                        if (key !== '$$hashKey') {
                            //itemToSave[key] = (overrideObj[key] === null ? undefined : overrideObj[key]);
                            itemToSave[key] = overrideObj[key];
                        }
                    }
                    console.log('itemToSave: ', itemToSave);

                    var prodHierarchyPath = $scope.prodChildItem.hierarchyPath;
                    var inputMap = {
                        'type': 'Attribute',
                        'contextId': $scope.rootProductId,
                        'sObject': JSON.stringify(itemToSave),
                        'hierarchyPath': $scope.prodChildItem.hierarchyPath
                    };
                    
                    if ($scope.promotionItem !== undefined) {
                    	
                        var promoItemPath = $scope.promotionItem[$scope.nsp+'ProductHierarchyPath__c'];
                        if (promoItemPath && promoItemPath.length > 0) {
                            if (prodHierarchyPath.length > 0) {
                                prodHierarchyPath = promoItemPath + '<' + prodHierarchyPath;
                            } else {
                                prodHierarchyPath = promoItemPath;
                            }
                        }
                        inputMap['hierarchyPath'] = prodHierarchyPath;
                    }
                    
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('saveOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        var saveOverrideResults = JSON.parse(results);
                        console.log('Save Override results: ', saveOverrideResults);
                        if (event) {
                            event.currentTarget.disabled = false;
                        }
                        if ($scope.metadataModal) {
                            $scope.metadataModal.hide();
                        }
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Attribute saved!',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.deleteOverride = function(attributeId, event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                    }

                    var attrAssgnOverride = $scope.AttrOverrideAssgnObjMap[attributeId];
                    var attrAssgnOverrideDef = $scope.AttrOverrideDefObjMap[attributeId];
                    var inputMap = {
                        'type': 'Attribute',
                        'overridingObjectId': attrAssgnOverride.Id,
                        'overrideDefinitionId': attrAssgnOverrideDef.Id,
                        'contextId': $scope.rootProductId
                    };
                    var invokeInputMap = { 'inputMap' : JSON.stringify(inputMap) };
                    remoteActions.invokeMethod('deleteOverride', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('Delete Override results: ', results);
                        $scope.AttrOverrideAssgnObjMap[attributeId] = null;
                        delete $scope.AttrOverrideDefObjMap[attributeId];
                        delete $scope.AttrOverridePicklistMap[attributeId];
                        cpqService.showNotification({
                            type: 'success',
                            content: 'Attribute override deleted.',
                            autohide: true
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.init = function() {
                    $scope.getObjectLayoutById($scope.productId, true);
                    $scope.describeObjectById($scope.productId);
                    $scope.getObjectPicklistsByName($scope.OBJECT_NAME);

                    $scope.product = $scope.prodChildItemObj === undefined ? {} : $scope.prodChildItemObj[$scope.nsp + 'ChildProductId__r'];
                    $scope.editProduct = angular.copy($scope.product);
                };
                $scope.init();
            }
        };
    }
]);

},{}],63:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocProductPricing', ['remoteActions', 'cpqService', 
    function(remoteActions, cpqService) {
        return {
            scope: {
                productId: '=',
                mode: '=',
                parentOverrideMode: '=',
                parentProductId: '=',
                rootProductId: '=',
                prodObj: '=',
                prodChildItemObj: '=',
                pricingMode: '=',
                promotionId: '=',
                promotionItem: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ProductPricing.tpl.html',
            controller: function($scope, $rootScope, $sldsModal, $sldsPopover) {
                $scope.nsp = fileNsPrefix();
                $scope.tabs = [];
                $scope.pleResultsMap = {
                    'Charge': {},
                    'Cost': {},
                    'Usage': {},
                    'Adjustment': {},
                    'Override': {}
                };
                $scope.ChargeResults = $scope.pleResultsMap['Charge'];
                $scope.CostResults = $scope.pleResultsMap['Cost'];
                $scope.UsageResults = $scope.pleResultsMap['Usage'];
                $scope.AdjustmentResults = $scope.pleResultsMap['Adjustment'];
                $scope.OverrideResults = $scope.pleResultsMap['Override'];

                $scope.OBJECT_NAME = 'PriceListEntry__c';

                $scope.$on('refreshObjectPricingElements', function() {
                    $scope.getPriceListEntriesData();
                });

                $scope.getPriceListEntries = function(priceListEntryType, pageNum, maxPages) {
                    if (pageNum < 1) {
                        pageNum = 1;
                    }
                    if (maxPages && (maxPages !== 0) && (pageNum > maxPages)) {
                        pageNum = maxPages;
                    }

                    var productIds = [];
                    productIds.push($scope.productId);
                    var offerIds = [];
                    offerIds.push($scope.rootProductId);

                    var inputMap;
                    if (priceListEntryType === 'Charge' || priceListEntryType === 'Usage') {
                        inputMap = {
                            'priceListEntryType': priceListEntryType,
                            'pageNumber': pageNum,
                            'ProductIds': productIds
                        };
                    }
                    if (priceListEntryType === 'Adjustment' || priceListEntryType === 'Override') {
                        inputMap = {
                            'priceListEntryType': priceListEntryType,
                            'pageNumber': pageNum,
                            'ProductIds': productIds
                        };

                        if ($scope.rootProductId !== $scope.productId) {
                            inputMap['OfferIds'] = offerIds;
                        }
                        if ($scope.pricingMode === 'PROMOTION') {
                            var promotionIds = [];
                            promotionIds.push($scope.promotionId);
                            var promotionItemIds = [];
                            promotionItemIds.push($scope.promotionItem.Id);
                            
                            inputMap['PromotionIds'] = promotionIds;
                            inputMap['PromotionItemIds'] = promotionItemIds;
                        }
                    }
                    console.log('PRODUCT PRICING INPUT MAP for ' + priceListEntryType + ': ', inputMap);

                    var inputs = {
                        'input' : JSON.stringify(inputMap),
                        'options' : ''
                    };
                    
                    remoteActions.invokeMethod('getPagedPricingElements', JSON.stringify(inputs)).then(function(results) {
                        console.log('getPricingElements for ' + priceListEntryType + ' results: ', results);
                        results.currentPage = pageNum;
                        $scope.pleResultsMap[priceListEntryType] = results;
                        $scope.ChargeResults = $scope.pleResultsMap['Charge'];
                        $scope.UsageResults = $scope.pleResultsMap['Usage'];
                        $scope.AdjustmentResults = $scope.pleResultsMap['Adjustment'];
                        $scope.OverrideResults = $scope.pleResultsMap['Override'];
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.newDiscount = function(elemObjType) {
                    $scope.selectItem(null, elemObjType, true, false);
                };

                $scope.newOverride = function(elemObjType) {
                    $scope.selectItem(null, elemObjType, false, true);
                };

                $scope.selectItem = function(item, elemObjType, isAdj, isOverride) {
                    var broadcastData = {
                        facetType: 'PROD_PRICING_ELEMENT',
                        facetData: {
                            priceListEntryItem: item,
                            pricingMode: $scope.pricingMode,
                            pricingElementObjectType: elemObjType,
                            isAdj: isAdj,
                            isOverride: isOverride
                        }
                    };
                    if ($scope.contextCriteriaMode === 'leftPane') {
                        $rootScope.$broadcast('showItemDetails', broadcastData);
                    } else {
                        $scope.openEditModal(item, elemObjType, isAdj, isOverride);
                    }
                };

                $scope.openEditModal = function(item, elemObjType, isAdj, isOverride) {
                    var modalScope = $scope.$new();
                    modalScope.contextRuleTitle = 'Price List Entry';
                    modalScope.priceListEntryItem = item;
                    modalScope.pricingElementObjectType = elemObjType;
                    modalScope.parentObject = $scope.parentObject;
                    modalScope.objectId = $scope.productId;
                    modalScope.pricingMode = $scope.pricingMode;
                    modalScope.rootProductId = $scope.rootProductId;
                    modalScope.promotionId = $scope.promotionId;
                    modalScope.promotionItem = $scope.promotionItem;
                    modalScope.isAdj = isAdj;
                    modalScope.isOverride = isOverride;
                    modalScope.hideAction = function() {
                        editModal.hide();
                    };
                    var editModal = $sldsModal({
                        templateUrl: 'PricingElementModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.closeDetails = function() {
                    if ($scope.mode !== 'modal') {
                        $rootScope.$broadcast('hideItemDetails');
                    } else {
                        $scope.$parent.hideAction();
                    }
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Price List Entry';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the price list entry for <i>' + item[$scope.nsp + 'PricingElementId__r'].Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete price list entry results: ', results);
                            $rootScope.$broadcast('refreshObjectPricingElements');
                            deleteModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.showRuleSetInfo = function(ruleSet, event) {
                    if ($scope.ruleSetPopover) {
                        $scope.ruleSetPopover.destroy();
                    }
                    var popoverScope = $scope.$new();
                    popoverScope.ruleSet = ruleSet;
                    $scope.ruleSetPopover = $sldsPopover(j$(event.currentTarget), {
                        scope: popoverScope,
                        sldsEnabled: true,
                        show: true,
                        autoClose: true,
                        trigger: 'manual',
                        nubbinDirection: 'right',
                        container: '.via-slds',
                        template: '<div class="slds-popover slds-popover-ruleset slds-nubbin--right" role="dialog"><div class="slds-popover__body"><vloc-rule-set-info-card rule-set="ruleSet"></vloc-rule-set-info-card></vloc-context-rule-info-card></div></div>'
                    });
                };

                $scope.launchObjectTab = function(item, objAPIName, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var data = {
                        'doAction': 'viewRecord',
                        'doAPIName': objAPIName,
                        'obj': item,
                        'closeCurrentTab': false
                    };
                    var broadcastAction = {
                        'eventName': 'launchConsoleTab',
                        'eventData': data
                    };
                    if (window.frameElement !== null) {
                        // create a iframe resize event binding with the parent
                        window.parent.bindIframeEvents('broadcast', broadcastAction);
                    }
                };

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('Pricing Elements - describeObject results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.setActiveTab = function(activeIdx) {
                    angular.forEach($scope.tabs, function(tab, idx) {
                        if (activeIdx === idx) {
                            tab.active = true;
                            tab.init = true;
                        } else {
                            tab.active = false;
                        }
                    });
                    $scope.activeIdx = activeIdx;
                    cpqService.setObjectPricingTabIdx(activeIdx);
                };

                $scope.getObjectTypes = function() {
                    var inputMap = { 'objectName' : $scope.nsp + 'PricingElement__c' };
                    remoteActions.invokeMethod('getObjectClassTypesByName', JSON.stringify(inputMap)).then(function(results) {
                        angular.forEach(results, function(objType) {
                            if (objType.Name === 'Discount') {
                                $scope.DiscountOT = objType;
                            }
                            if (objType.Name === 'Charge') {
                                $scope.ChargeOT = objType;
                            }
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getPriceListEntriesData = function() {
                    $scope.getPriceListEntries('Charge', 1);
                    //$scope.getPriceListEntries('Usage', 1);
                    $scope.getPriceListEntries('Adjustment', 1);
                    $scope.getPriceListEntries('Override', 1);
                };

                $scope.init = function() {
                    $scope.tabs = cpqService.getObjectPricingTabs($scope.pricingMode);
                    $scope.activeIdx = cpqService.getObjectPricingTabIdx();
                    $scope.tabs[$scope.activeIdx].init = true;
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getObjectTypes();
                };
                $scope.init();
            }
        };
    }
]);

},{}],64:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocProductStructure', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'ProductStructure.tpl.html',
            controller: function($scope, $rootScope, $sldsModal, $compile) {
                $scope.nsp = fileNsPrefix();
                $scope.productId = $scope.customViewAttrs.contextInfo.customObject.Id;
                $scope.pricingMode = $scope.customViewAttrs.contextInfo.pricingMode;
                $scope.productList = [];
                $scope.selectedPCIId = '';
                $scope.showChildDetails = false;
                $scope.pciOverrideMap = {};
                $scope.overrideDefnMap = {};

                $scope.$on('refreshProductChildren', function(event, data) {
                    $scope.refreshProductChildren(data.productId);
                    $scope.selectedPCIId = '';
                });

                $scope.$on('refreshProductCardinality', function(event, data) {
                    if (data.mode === 'OVERRIDE_CARDINALITY') {
                        $scope.getOverride(data.pciIds, data.pciIdstoProdHierarchyMap);
                    }
                    if (data.mode === 'OVERRIDE_CARDINALITY_DELETE') {
                        delete $scope.pciOverrideMap[data.productHierarchyPath];
                        delete $scope.overrideDefnMap[data.productHierarchyPath];
                    }
                });

                $scope.getFieldSets = function() {
                    var inputMap = { 'objectName' : 'Product2' };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + 'productstructure'] === undefined) {
                            $scope.prodFieldSet = null;
                        } else {
                            $scope.prodFieldSet = results[$scope.nsp.toLowerCase() + 'productstructure'];
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                    var inputMap2 = { 'objectName' : $scope.nsp + 'ProductChildItem__c' };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap2)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + 'productstructure'] === undefined) {
                            $scope.prodChildFieldSet = null;
                        } else {
                            $scope.prodChildFieldSet = results[$scope.nsp.toLowerCase() + 'productstructure'];
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getRootProduct = function(rootProductId) {
                    $scope.productList = [];
                    var inputMap = {
                        'productIds': [rootProductId],
                        'pageNumber': 1,
                        'pageSize': null
                    };
                    remoteActions.invokeMethod('getProductHierarchy', JSON.stringify(inputMap)).then(function(results) {
                        angular.forEach(results.productList, function(item, idx) {
                            item.level = 1;
                            item.isRoot = true;
                            item.show = true;
                            item.showChildren = true;
                            item.fetchedChildren = true;
                            item.hierarchyPath = item.productId;
                            $scope.productList.push(item);
                            var pciIds = [];
                            angular.forEach(item.children, function(child) {
                                if (child.pciSO && child.pciSO[$scope.nsp+'IsRootProductChildItem__c']) {
                                    item.cardinalitySO = child.pciSO;
                                } else {
                                    child.level = item.level + 1;
                                    child.isRoot = false;
                                    child.parentId = item.productId;
                                    child.hierarchyPath = item.hierarchyPath + '<' + child.productId;
                                    child.cardinalitySO = child.pciSO;
                                    child.show = true;
                                    child.showChildren = false;
                                    child.fetchedChildren = false;
                                    $scope.productList.push(child);
                                }
                                pciIds.push(child.pciSO.Id);
                            });
                            if (item.childrenInfo.currentPage < item.childrenInfo.totalPages) {
                                var loadMoreItem = {'show': false, 'loadMore': true, 'level': (item.level + 1), 'parentItem': item};
                                item.children.push(loadMoreItem);
                                $scope.productList.push(loadMoreItem);
                            }
                            $scope.getOverride(pciIds);
                        });

                        //Displaying warning messages if any
                        if(results.warningMessages != undefined && results.warningMessages.length > 0)
                        {
                            collectiveWarningMessage = results.warningMessages.join();
                            cpqService.showNotification({
                                type: 'warning', 
                                title: 'WARNING',
                                content: collectiveWarningMessage 
                            });
                        }

                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.toggleItem = function(parentItem, parentItemIdx, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    if (parentItem.showChildren) {
                        $scope.toggleItemVisibility(parentItem, false);
                    } else {
                        if (parentItem.fetchedChildren) {
                            // children already fetched, simply toggle visibility
                            $scope.toggleItemVisibility(parentItem, true);
                        } else {
                            // fetch children
                            $scope.getProductChildren(parentItem, parentItemIdx, 1, false);
                        }
                    }
                };

                $scope.toggleItemVisibility = function(parentItem, visible) {
                    parentItem.showChildren = visible;
                    angular.forEach(parentItem.children, function(item, idx) {
                        item.show = visible;
                        if (!visible && item.children) {
                            $scope.toggleItemVisibility(item, visible);
                        }
                    });
                };

                $scope.getProductChildren = function(parentItem, parentItemIdx, pageNumber, refresh) {
                    var inputMap = {
                        'productIds': [parentItem.productId],
                        'pageNumber': pageNumber,
                        'pageSize': null
                    };
                    remoteActions.invokeMethod('getProductHierarchy', JSON.stringify(inputMap)).then(function(results) {
                        if (results.productList && results.productList.length > 0) {
                            if (refresh) {
                                parentItem.childrenInfo = results.productList[0].childrenInfo;
                                parentItem.isLeaf = (parentItem.childrenInfo.totalCount === 0);
                                parentItem.showChildren = (parentItem.childrenInfo.totalCount > 0);
                            }

                            if (pageNumber === 1) {
                                parentItem.children = [];
                                parentItemIdx++;
                            } else {
                                $scope.productList.splice(parentItemIdx, 1);
                                parentItem.children.pop();
                            }

                            var cardinalityObjOffset = 0;
                            var pciIds = [];
                            var pciIdstoProdHierarchyMap = {};
                            angular.forEach(results.productList[0].children, function(item, idx) {
                                if (item.pciSO && item.pciSO[$scope.nsp+'IsRootProductChildItem__c']) {
                                    cardinalityObjOffset++;
                                } else {
                                    item.level = parentItem.level + 1;
                                    item.isRoot = false;
                                    item.parentId = parentItem.productId;
                                    item.hierarchyPath = parentItem.hierarchyPath + '<' + item.productId;
                                    item.cardinalitySO = item.pciSO;
                                    item.show = true;
                                    item.showChildren = false;
                                    item.fetchedChildren = false;
                                    parentItem.children.push(item);
                                    $scope.productList.splice((parentItemIdx + idx - cardinalityObjOffset), 0, item);
                                    pciIds.push(item.pciSO.Id);
                                    pciIdstoProdHierarchyMap[item.pciSO.Id] = item.hierarchyPath;
                                }
                            });
                            parentItem.childrenInfo = results.productList[0].childrenInfo;
                            if (parentItem.childrenInfo.currentPage < parentItem.childrenInfo.totalPages) {
                                var loadMoreItem = {'show': true, 'loadMore': true, 'level': (parentItem.level + 1), 'parentItem': parentItem};
                                parentItem.children.push(loadMoreItem);
                                $scope.productList.splice((parentItemIdx + results.productList.length + 1), 0, loadMoreItem);
                            }
                            parentItem.showChildren = true;
                            parentItem.fetchedChildren = true;
                            $scope.getOverride(pciIds, pciIdstoProdHierarchyMap);

                            //Displaying warning messages if any
                            if(results.warningMessages != undefined && results.warningMessages.length > 0)
                            {
                                collectiveWarningMessage = results.warningMessages.join();
                                cpqService.showNotification({
                                    type: 'warning', 
                                    title: 'WARNING',
                                    content: collectiveWarningMessage 
                                });
                            }
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.refreshProductChildren = function(productId) {
                    var item, itemIdx;
                    for (var i = 0; i < $scope.productList.length; i++) {
                        item = $scope.productList[i];
                        if (item.productId === productId) {
                            itemIdx = i;
                            break;
                        }
                    }
                    if (itemIdx !== undefined) {
                        var count = 0;
                        for (var i = itemIdx + 1; i < $scope.productList.length; i++) {
                            var childProd = $scope.productList[i];
                            if (childProd.level > item.level) {
                                count++;
                            } else {
                                break;
                            }
                        }
                        $scope.productList.splice(itemIdx + 1, count);
                        $scope.getProductChildren(item, itemIdx, 1, true);
                    }
                };

                $scope.getOverride = function(pciIds, pciIdstoProdHierarchyMap) {
                    var inputMap = { 'type': 'Product Definition', 'offerId': $scope.productId, 'overriddenPCIIds': pciIds, 'pciIdstoProdHierarchyMap': pciIdstoProdHierarchyMap };
                    remoteActions.invokeMethod('getOverrideInfo', JSON.stringify(inputMap)).then(function(results) {
                        var resultsMap = JSON.parse(results);
                        console.log('getOverrideInfo results: ', resultsMap);
                        for (var key in resultsMap) {
                            var prodHierPath = resultsMap[key].OverrideDefinition__c[$scope.nsp+'ProductHierarchyPath__c'];
                            $scope.pciOverrideMap[prodHierPath] = resultsMap[key].SObject;
                            $scope.overrideDefnMap[prodHierPath] = resultsMap[key].OverrideDefinition__c;
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.addProdChildItem = function(item, itemIdx, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var broadcastData = {
                        facetType: 'PROD_CHILD_ITEM',
                        facetData: {
                            mode: 'add',
                            parentProductId: item.productId,
                            prodChildItem: item
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.deleteProdChildItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Product Child Item';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the product child item <i>' + item.productSO.Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var inputMap = { 'objectId' : item.pciSO.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            $scope.refreshProductChildren(item.parentId);
                            deleteModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.viewProductChildDetails = function(item, idx, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    if ((item.isRoot && item.isLeaf) || (item.loadMore)) {
                        return;
                    }

                    $scope.selectedPCIId = (item.pciSO ? item.pciSO.Id : item.productId) + '_' + idx;
                    var broadcastData = {
                        facetType: 'PROD_CHILD_DETAILS',
                        facetData: {
                            rootProductId: $scope.productId,
                            productId: item.productId,
                            prodChildItem: item,
                            pricingMode: $scope.pricingMode
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.closeChildDetails = function() {
                    $scope.showChildDetails = false;
                };

                $scope.convertToLocalDate = function(field) {
                    if(field != null)
                    {
                        var givenDate = new Date(field);
                        return givenDate.toLocaleDateString();
                    }
                };

                $scope.formatFieldValue = function(field) {
                    return (field === undefined ? '&nbsp;' : field);
                };

                $scope.launchTab = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var data = {
                        'doAction': 'viewRecord',
                        'doAPIName': 'Product2',
                        'obj': item,
                        'closeCurrentTab': false
                    };
                    var broadcastAction = {
                        'eventName': 'launchConsoleTab',
                        'eventData': data
                    };
                    if (window.frameElement !== null) {
                        // create a iframe resize event binding with the parent
                        window.parent.bindIframeEvents('broadcast', broadcastAction);
                    }
                };

                $scope.init = function() {
                    $scope.getFieldSets();
                    $scope.getRootProduct($scope.productId);
                };
                $scope.init();
            }
        };
    }
]);

},{}],65:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocPromotionProduct', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                promotionItem: '=',
                parentItem: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'PromotionProduct.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.items = [];
                $scope.OBJECT_NAME = 'PromotionItem__c';
                $scope.editObject = {};
                $scope.attrMap = {};
                $scope.attrObjMap = {};
                $scope.attrAssgnObjMap = {};
                $scope.facets = [];

                $scope.describeObjectByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log(objectName + ' getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };
                
                $scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = { 
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' getObjectLayoutByName results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

				$scope.buildObjectLayout = function(results) {
					$scope.objFacets = results.facets;
					$scope.objectLayoutId = results.objLayout.Id;
					$scope.facets = [];
					if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
						angular.forEach($scope.objFacets, function(facet, idx) {
							facet.hasSectionCustomView = false;
							facet.active = (idx === 0);
							angular.forEach(facet.sections, function(section) {
								if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
									section.hasCustomView = true;
									facet.hasSectionCustomView = true;
								}
							});
							$scope.facets.push(facet);
						});
					}
					console.log($scope.objectAPIName + ' FACETS:', $scope.facets);
				};

                $scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }
                    $scope.editObject[$scope.nsp + 'PromotionId__c'] = $scope.parentItem.Id;

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editObject[key];
                        }
                    }

                    var inputMap = {
                        'objectName' : $scope.nsp + $scope.OBJECT_NAME,
                        'inputMap' : itemToSave
                    };
                    remoteActions.invokeMethod('createPromotionItem', JSON.stringify(inputMap)).then(function(results) {
                        console.log('create promo item results: ', results);
                        $rootScope.$broadcast('refreshPromoItems', $scope.parentItem.Id);
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $scope.closeDetails();
                        cpqService.showNotification({
							type: 'success',
							content: 'Promotion item created.',
							autohide: true
						});
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editObject[key] === null ? undefined : $scope.editObject[key]);
                        }
                    }

                    var inputMap = { 'so' : JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updatePromotionItem', JSON.stringify(inputMap)).then(function(results) {
                        console.log('save promo item results: ', results);
                        $rootScope.$broadcast('refreshPromoItems', $scope.parentItem.Id);
                        $scope.item = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.item[key] = results[key] + tzOffset;
                            } else {
                                $scope.item[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }

                        $scope.closeDetails();
                        cpqService.showNotification({
							type: 'success',
							content: 'Promotion item saved.',
							autohide: true
						});
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.init = function() {
                    $scope.getObjectLayoutByName($scope.OBJECT_NAME, '');
                    $scope.describeObjectByName($scope.OBJECT_NAME);
                    $scope.getObjectPicklistsByName($scope.nsp + $scope.OBJECT_NAME);

                    if ($scope.promotionItem.Id === undefined) {
                        $scope.displayMode = 'create';
                    } else {
                        $scope.displayMode = 'edit';
                        for (var key in $scope.promotionItem) {
                            if (key !== '$$hashKey') {
                                $scope.editObject[key] = $scope.promotionItem[key];
                            }
                        }
                    }
                };
                $scope.init();
            }
        };
    }
]);

},{}],66:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocPromotionProducts', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'PromotionProducts.tpl.html',
            controller: function($scope, $rootScope, $sldsModal, $compile) {
                $scope.nsp = fileNsPrefix();
                $scope.promotion = $scope.customViewAttrs.contextInfo.customObject;
                $scope.promotionId = $scope.promotion.Id;
                $scope.OBJECT_NAME = 'PromotionItem__c';
                $scope.fieldSetName = 'promotionitem';
                $scope.items = [];

                $scope.describeObject = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('vlocPromotionProducts - describeObject results: ', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        if (results[$scope.nsp.toLowerCase() + $scope.fieldSetName] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[$scope.nsp.toLowerCase() + $scope.fieldSetName];
                        }
                        console.log('vlocPromotionProducts - getFieldSets results: ', $scope.fieldSet);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.$on('refreshPromoItems', function(event, data) {
                    $scope.getApplicableProducts();
                });

                $scope.getApplicableProducts = function() {
                    var inputMap = {
                        'promotionId' : $scope.promotionId,
                        'mode' : 'ITEMS_ONLY'
                    };
                    remoteActions.invokeMethod('getPromotionItems', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getPromotionApplicableProducts results: ', results);
                        $scope.items = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.selectItem = function(item) {
                    console.log('selectItem item: ', item);
                    var broadcastData = {
                        facetType: 'PROMOTION_PRODUCT',
                        facetData: {
                            promotionItem: item
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Promotion Item';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the Promotion Item <i>' + item.Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete Promotion Item';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }
                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log('delete Promotion Item results: ', results);
                            $rootScope.$broadcast('hideItemDetails');
                            $rootScope.$broadcast('refreshPromoItems', $scope.promotionId);
                            deleteModal.hide();
                            //TODO: show delete success message
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.newItem = function() {
                    $scope.selectItem({});
                };

                $scope.init = function() {
                    $scope.getApplicableProducts();
                    $scope.describeObject($scope.nsp + $scope.OBJECT_NAME);
                    $scope.getFieldSetsByName($scope.nsp + $scope.OBJECT_NAME);
                };
                $scope.init();
            }
        };
    }
]);

},{}],67:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocQualifyContextRules', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'QualifyContextRules.tpl.html',
            controller: function($scope, $rootScope, $sldsModal) {
                $scope.nsp = fileNsPrefix();
                $scope.contextObject = $scope.customViewAttrs.contextInfo.customObject;
                $scope.objectNameRule = $scope.nsp + 'Rule__c';
                $scope.objectNameRuleAssignment = $scope.nsp + 'RuleAssignment__c';
                $scope.objectFields = {
                    'ruleset': {},
                    'objectRuleset': {}
                };
                $scope.objectPicklists = {
                    'ruleset': {},
                    'objectRuleset': {}
                };
                $scope.qualificationRuleSets = [];
                $scope.penaltyRuleSets = [];
                $scope.evaluationRuleSets = [];
                
                $scope.describeObjectByName = function(objectName, key) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields[key] = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName, key) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' getObjectPicklistsByName results:', results);
                        for (var k in results) {
                            $scope.objectPicklists[key][k.toLowerCase()] = results[k];
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectRuleSets = function() {
                    var inputMap = {
                        'objectId': $scope.contextObject.Id
                    };
                    var inputMapJSON = JSON.stringify(inputMap);
                    var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                    remoteActions.invokeMethod('getObjectRuleSets', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('getObjectRuleSets:', results.ruleSets);
                        $scope.qualificationRuleSets = [];
                        $scope.penaltyRuleSets = [];
                        $scope.evaluationRuleSets = [];
                        angular.forEach(results.ruleSets, function(objectRuleSet) {
                            if (objectRuleSet[$scope.nsp+'RuleType__c'] === 'Qualification') {
                                $scope.qualificationRuleSets.push(objectRuleSet);
                            }
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFieldSetsByName = function(objectName) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getFieldSetsByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' getFieldSets results:', results);
                        var fsKey = $scope.nsp.toLowerCase() + 'newruleassignment';
                        if (results[fsKey] === undefined) {
                            $scope.fieldSet = null;
                        } else {
                            $scope.fieldSet = results[fsKey];
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.deleteItem = function(objectRuleSet, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Rule Set';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the rule set <i>' + objectRuleSet[$scope.nsp+'RuleId__r'].Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in objectRuleSet) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = objectRuleSet[key];
                            }
                        }

                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            $scope.getObjectRuleSets();
                            $rootScope.$broadcast('refreshObjectPricingElements');
                            deleteModal.hide();
                            
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Rule set deleted.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.addItem = function(event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.modalTitle = 'Add Rule Set';
                    modalScope.newObject = {};
                    modalScope.newObject[$scope.nsp+'ObjectId__c'] = $scope.contextObject.Id;
                    modalScope.objectFields = $scope.objectFields['objectRuleset'];
                    modalScope.objectPicklists = $scope.objectPicklists['objectRuleset'];
                    modalScope.fieldSet = $scope.fieldSet;
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Save';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Saving...';
                        }

                        var itemToSave = {};
                        for (var key in modalScope.newObject) {
                            if (key !== '$$hashKey') {
                                itemToSave[key] = modalScope.newObject[key];
                            }
                        }

                        var inputMap = {
                            'objectName' : $scope.objectNameRuleAssignment,
                            'inputMap' : itemToSave
                        };
                        remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                            console.log($scope.objectNameRuleAssignment + ' createObject results:', results);
                            $scope.getObjectRuleSets();
                            $rootScope.$broadcast('refreshObjectPricingElements');
                            newObjectRecordModal.hide();
                            
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Rule set added.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            if (event) {
                                event.currentTarget.innerText = 'Error!';
                                $timeout(function() {
                                    event.currentTarget.innerText = originalText;
                                    event.currentTarget.disabled = false;
                                }, 5000);
                            }
                        });
                    };

                    var newObjectRecordModal = $sldsModal({
                        templateUrl: 'NewObjectRecordModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.setActiveTab = function(activeIdx) {
                    angular.forEach($scope.tabs, function(tab, idx) {
                        if (activeIdx === idx) {
                            tab.active = true;
                            tab.init = true;
                        } else {
                            tab.active = false;
                        }
                    });
                    $scope.activeIdx = activeIdx;
                    cpqService.setRuleSetTabIdx(activeIdx);
                };

                $scope.init = function() {
                    $scope.tabs = cpqService.getRuleSetTabs();
                    $scope.activeIdx = cpqService.getRuleSetTabIdx();
                    
                    $scope.describeObjectByName($scope.objectNameRule, 'ruleset');
                    $scope.getObjectPicklistsByName($scope.objectNameRule, 'ruleset');
                    
                    if ($scope.contextObject !== null && $scope.contextObject !== undefined) {
                        $scope.getObjectRuleSets();
                    }
                    
                    $scope.describeObjectByName($scope.objectNameRuleAssignment, 'objectRuleset');
                    $scope.getObjectPicklistsByName($scope.objectNameRuleAssignment, 'objectRuleset');
                    $scope.getFieldSetsByName($scope.objectNameRuleAssignment);
                };
                $scope.init();
            }
        };
    }
]);

},{}],68:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocRuleCondition', ['remoteActions', 'cpqService', 
    function(remoteActions, cpqService) {
        return {
            scope: {
                rule: '=',
				ruleCondition: '=',
                contextDimensions: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'RuleCondition.tpl.html',
            controller: function($scope, $rootScope, $timeout, $sldsModal) {
                $scope.nsp = fileNsPrefix();
                $scope.condition = {};
                $scope.objectName = $scope.nsp + 'EntityFilterCondition__c';
                $scope.objectNameFunction = $scope.nsp + 'VlocityFunction__c';
                $scope.objectNameFunctionArgument = $scope.nsp + 'VlocityFunctionArgument__c';
                $scope.objectFields = {
                    'rulecondition': {},
                    'function': {},
                    'functionArgument': {}
                };
                $scope.objectPicklists = {
                    'rulecondition': {},
                    'function': {},
                    'functionArgument': {}
                };
                $scope.contextDimensionsMap = {};
                $scope.valueFieldInfo = {};
                $scope.valueFieldRequired = true;
                $scope.objectIdToNameMap = {};

                $scope.describeObjectByName = function(objectName, key) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields[key] = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName, key) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' getObjectPicklistsByName results:', results);
                        for (var k in results) {
                            $scope.objectPicklists[key][k.toLowerCase()] = results[k];
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.saveItem = function(condition, event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }
                    
                    var itemToSave = {};
                    for (var key in condition) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = (condition[key] === null ? undefined : condition[key]);
                        }
                    }

                    if (itemToSave[$scope.nsp + 'Value__c'] !== undefined) {
                        itemToSave[$scope.nsp + 'Value__c'] += '';
                    }

                    if (condition[$scope.nsp + 'ConditionType__c'] === 'Advanced') {
                        angular.forEach(itemToSave.efcArguments, function(arg) {
                            if (arg[$scope.nsp+'DomainType__c'] === 'Picklist') {
                                if (arg.picklistSelectionMode === 'Multiple') {
                                    var picklistValues = arg.selectedPicklistValue;
                                    if (angular.isArray(picklistValues)) {
                                        arg.selectedPicklistValue = picklistValues.join(';');
                                    }
                                    arg[$scope.nsp+'Value__c'] = arg.selectedPicklistValue;
                                } else {
                                    arg[$scope.nsp+'PicklistValueId__c'] = arg.selectedPicklistValue;
                                }
                            }
                            if (arg[$scope.nsp+'DomainType__c'] === 'Object Lookup') {
                                arg[$scope.nsp+'ObjectId__c'] = arg.selectedObjectId;
                            }
                            if (arg[$scope.nsp+'DomainType__c'] === 'Type in') {
                                arg[$scope.nsp+'Value__c'] = arg.TypeInValue + '';
                            }

                            delete arg.selectedPicklistValue;
                            delete arg.picklistItems;
                            delete arg.picklistSelectionMode;
                            delete arg.selectedObjectId;
                            delete arg.lookupFieldInfo;
                            delete arg.TypeInValue;
                            delete arg.fArg;
                            delete arg.idx;
                            delete arg.$$hashKey;
                        });
                        delete itemToSave.function;
                        delete itemToSave.efcArguments;

                        var inputMap = {
                            'mode': (condition.Id === undefined ? 'create' : 'update'),
                            'EntityFilterId': $scope.rule.Id,
                            'condition': itemToSave,
                            'Function': condition.function,
                            'ObjectIdToNameMap': JSON.stringify($scope.objectIdToNameMap),
                            'EFCArguments': JSON.stringify(condition.efcArguments),
                            'FunctionArgumentsMap': JSON.stringify($scope.fArgMap)
                        };
                        var inputMapJSON = JSON.stringify(inputMap);
                        var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                        remoteActions.invokeMethod('createUpdateFunctionCondition', JSON.stringify(invokeInputMap)).then(function(results) {
                            console.log('createUpdateFunctionCondition results:', results);
                            for (var k in results) {
                                condition[k] = results[k];
                            }
                            if (event) {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }
                            $rootScope.$broadcast('refreshFacetContent');
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Rule condition saved.',
                                autohide: true
                            });
                            $scope.closeDetails();
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            if (event) {
                                event.currentTarget.innerText = 'Error!';
                                $timeout(function() {
                                    event.currentTarget.innerText = originalText;
                                    event.currentTarget.disabled = false;
                                }, 5000);
                            }
                        });
                    } else {
                        var inputMap = {
                            'mode': (condition.Id === undefined ? 'create' : 'update'),
                            'condition': itemToSave
                        };
                        var inputMapJSON = JSON.stringify(inputMap);
                        var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                        remoteActions.invokeMethod('createUpdateSimpleCondition', JSON.stringify(invokeInputMap)).then(function(results) {
                            console.log('createUpdateSimpleCondition results:', results);
                            for (var k in results) {
                                condition[k] = results[k];
                            }
                            if (event) {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }
                            $rootScope.$broadcast('refreshFacetContent');
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Rule condition saved.',
                                autohide: true
                            });
                            $scope.closeDetails();
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            if (event) {
                                event.currentTarget.innerText = 'Error!';
                                $timeout(function() {
                                    event.currentTarget.innerText = originalText;
                                    event.currentTarget.disabled = false;
                                }, 5000);
                            }
                        });
                    }
                };

                $scope.getFunctionArguments = function(functionId, condition, isInit) {
                    var inputMap = {
                        'functionId': functionId,
                        'conditionId': condition.Id
                    };
                    var inputMapJSON = JSON.stringify(inputMap);
                    var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                    remoteActions.invokeMethod('getFunctionArguments', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('getFunctionArguments results:', results);
                        condition.function = results.Function;
                        condition.efcArguments = results.EFCArguments;
                        $scope.fArgMap = results.FunctionArgumentsMap;

                        angular.forEach(condition.efcArguments, function(arg, idx) {
                            var fArgId = arg[$scope.nsp+'FunctionArgumentId__c'];
                            arg.idx = idx;
                            var fArg = $scope.fArgMap[fArgId];
                            arg.fArg = fArg;

                            arg.TypeInValue = '';
                            if (arg[$scope.nsp+'DomainType__c'] === 'Type in') {
                                arg.TypeInValue = arg[$scope.nsp+'Value__c'];
                            }

                            if (fArg[$scope.nsp+'DomainType__c'] === 'Picklist') {
                                var picklistId = fArg[$scope.nsp+'VlocityPicklistId__c'];
                                if (picklistId === undefined) {
                                    cpqService.showNotification({
                                        type: 'error',
                                        title: 'Error',
                                        content: 'Function agument "' + arg.Name + '" is of type Picklist, but does not have a corresponding Vlocity Picklist.'
                                    });
                                } else {
                                    $scope.getPicklistItems(picklistId, arg);
                                }

                                arg.picklistSelectionMode = fArg[$scope.nsp+'PicklistSelectionMode__c'];

                                if (arg[$scope.nsp+'DomainType__c'] === 'Picklist') {
                                    if (arg.picklistSelectionMode == 'Single') {
                                        arg.selectedPicklistValue = arg[$scope.nsp+'PicklistValueId__c'];
                                    } else if (arg.picklistSelectionMode == 'Multiple') {
                                        arg.selectedPicklistValue = arg[$scope.nsp+'Value__c'];
                                    }
                                }
                            }
                            
                            if (fArg[$scope.nsp+'DomainType__c'] === 'Object Lookup') {
                                var objectAPIName = fArg[$scope.nsp+'Object__c'];
                                if (objectAPIName === undefined) {
                                    cpqService.showNotification({
                                        type: 'error',
                                        title: 'Error',
                                        content: 'Function argument "' + arg.Name + '" is of type Object Lookup, but does not have a corresponding Object.'
                                    });
                                } else {
                                    var referenceTo = objectAPIName;
                                    if (objectAPIName.endsWith('__c')) {
                                        referenceTo = $scope.nsp + objectAPIName;
                                    }
                                    arg.lookupFieldInfo = {
                                        isCreateable: true,
                                        isDefaultedOnCreate: false,
                                        isRequired: false,
                                        isUpdateable: true,
                                        label: objectAPIName,
                                        referenceTo: referenceTo,
                                        type: 'REFERENCE'
                                    };
                                }

                                if (arg[$scope.nsp+'DomainType__c'] === 'Object Lookup') {
                                    arg.selectedObjectId = arg[$scope.nsp+'ObjectId__c'];
                                }
                            }
                            
                            if (fArg[$scope.nsp+'DomainType__c'] === 'Type in' || arg[$scope.nsp+'DomainType__c'] === 'Type in') {
                                $scope.formatTypeInValue(arg);
                            }

                            if (arg.fArg[$scope.nsp+'Direction__c'] === 'Output') {
                                if (isInit) {
                                    $scope.condition[$scope.nsp+'Value__c'] = '';
                                }
                                $scope.setValueDataType(arg.fArg[$scope.nsp+'DataType__c']);
                            }
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getPicklistItems = function(picklistId, argument) {
                    var inputMap = { 'picklistId': picklistId };
                    remoteActions.invokeMethod('getPicklistItems', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getPicklistItems results: ', results);
                        argument.picklistItems = results;
                        angular.forEach(argument.picklistItems, function(item) {
                            $scope.objectIdToNameMap[item.Id] = item[$scope.nsp+'Value__c'];
                        });
                        if ((argument.selectedPicklistValue != undefined) && (argument[$scope.nsp+'DomainType__c'] === 'Picklist') && (argument.picklistSelectionMode === 'Multiple')) {
                            var selectedValues = argument.selectedPicklistValue.split(';');
                            angular.forEach(argument.picklistItems, function(item) {
                                item.selected = (selectedValues.indexOf(item.Id) !== -1);
                            });
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.setValueDataType = function(selectedDataType) {
                    var valueDataType = 'TEXT';
                    switch (selectedDataType) {
                        case 'Boolean':
                            valueDataType = 'BOOLEAN';
                            $scope.condition[$scope.nsp+'Value__c'] = ($scope.condition[$scope.nsp+'Value__c'] === 'true' || $scope.condition[$scope.nsp+'Value__c']);
                            break;
                        case 'Number':
                            valueDataType = 'DOUBLE';
                            $scope.condition[$scope.nsp+'Value__c'] = $scope.numericValue($scope.condition[$scope.nsp+'Value__c']);
                            break;
                        case 'Date':
                            valueDataType = 'DATE';
                            $scope.condition[$scope.nsp+'Value__c'] = $scope.numericValue($scope.condition[$scope.nsp+'Value__c']);
                            break;
                        case 'DateTime':
                            valueDataType = 'DATETIME';
                            $scope.condition[$scope.nsp+'Value__c'] = $scope.numericValue($scope.condition[$scope.nsp+'Value__c']);
                            break;
                        default:
                            valueDataType = 'TEXT';
                            break;
                    }
                    $scope.valueFieldInfo = {
                        isCreateable: true,
                        isDefaultedOnCreate: false,
                        isRequired: false,
                        isUpdateable: true,
                        type: valueDataType
                    };
                };

                $scope.formatTypeInValue = function(arg) {
                    $scope.TypeInFieldRequired = true;
                    switch(arg.fArg[$scope.nsp+'DataType__c']) {
                        case 'Boolean':
                            $scope.TypeInFieldRequired = false;
                            arg.TypeInValue = (arg.TypeInValue === 'true');
                            break;
                        case 'Number':
                            arg.TypeInValue = $scope.numericValue(arg.TypeInValue);
                            break;
                        case 'Date':
                            arg.TypeInValue = $scope.numericValue(arg.TypeInValue);
                            break;
                        case 'DateTime':
                            arg.TypeInValue = $scope.numericValue(arg.TypeInValue);
                            break;
                    }
                };

                $scope.numericValue = function(stringValue) {
                    var floatValue = parseFloat(stringValue);
                    if (!isNaN(floatValue) && isFinite(floatValue)) {
                        return floatValue;
                    } else {
                        return stringValue;
                    }
                };

				$scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                var initializing2 = true;
                $scope.$watch('condition.' + $scope.nsp + 'ContextDimensionId__c', function(newValue, oldValue) {
                    if (initializing2) {
                        $timeout(function() { initializing2 = false; });
                    } else {
                        if ((newValue !== oldValue) && (newValue !== '')) {
                            if ($scope.contextDimensionsMap[newValue] === undefined) {
                                $scope.getContextDimension(newValue);
                            } else {
                                if ($scope.contextDimensionsMap[newValue][$scope.nsp+'DomainType__c'] === undefined) {
                                    cpqService.showNotification({
                                        type: 'error',
                                        title: 'Error',
                                        content: 'The selected context dimension "' + $scope.contextDimensionsMap[newValue].Name + '" is missing a value for Domain Type.'
                                    });
                                } else {
                                    $scope.selectedDimension = $scope.contextDimensionsMap[newValue];
                                    if ($scope.condition[$scope.nsp+'ConditionType__c'] === 'Simple' && $scope.selectedDimension[$scope.nsp+'DomainType__c'] === 'Type in') {
                                        delete $scope.condition[$scope.nsp+'Value__c'];
                                        $scope.setValueDataType($scope.selectedDimension[$scope.nsp+'DataType__c']);
                                    }
                                }
                            }
                        }
                    }
                }, true);

                $scope.getContextDimension = function(dimensionId) {
                    var inputMap = { 'objectId': dimensionId };
                    remoteActions.invokeMethod('getObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getContextDimension results: ', results);
                        if (results[$scope.nsp+'DomainType__c'] === undefined) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: 'The selected context dimension "' + results.Name + '" is missing a value for Domain Type.'
                            });
                        } else {
                            $scope.selectedDimension = results;
                            if ($scope.condition[$scope.nsp+'ConditionType__c'] === 'Simple' && $scope.selectedDimension[$scope.nsp+'DomainType__c'] === 'Type in') {
                                delete $scope.condition[$scope.nsp+'Value__c'];
                                $scope.setValueDataType($scope.selectedDimension[$scope.nsp+'DataType__c']);
                            }
                        }
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.init = function() {
                    $scope.describeObjectByName($scope.objectName, 'rulecondition');
                    $scope.getObjectPicklistsByName($scope.objectName, 'rulecondition');
                    $scope.describeObjectByName($scope.objectNameFunction, 'function');
                    $scope.getObjectPicklistsByName($scope.objectNameFunction, 'function');
                    $scope.describeObjectByName($scope.objectNameFunctionArgument, 'functionArgument');
                    $scope.getObjectPicklistsByName($scope.objectNameFunctionArgument, 'functionArgument');

					for (var key in $scope.ruleCondition) {
                        if (key !== '$$hashKey') {
                            $scope.condition[key] = $scope.ruleCondition[key];
                        }
                    }

                    if ($scope.ruleCondition.Id === undefined) {
                        $scope.displayMode = 'create';
                    } else {
                        $scope.displayMode = 'edit';
                    }

                    if ($scope.ruleCondition[$scope.nsp+'ConditionType__c'] === 'Advanced') {
                        var functionId = $scope.ruleCondition[$scope.nsp+'VlocityFunctionId__c'];
                        if (functionId !== undefined) {
                            $scope.getFunctionArguments(functionId, $scope.condition, false);
                        }

                        var initializing = true;
                        $scope.$watch('condition.' + $scope.nsp + 'VlocityFunctionId__c', function(newValue, oldValue) {
                            if (initializing) {
                                $timeout(function() { initializing = false; });
                            } else {
                                if ((newValue !== oldValue) && (newValue !== '')) {
                                    $scope.getFunctionArguments(newValue, $scope.condition, true);
                                }
                            }
                        }, true);
                    }

                    angular.forEach($scope.contextDimensions, function(dimension) {
                        $scope.objectIdToNameMap[dimension.Id] = dimension.Name;
                        $scope.contextDimensionsMap[dimension.Id] = dimension;
                        if (dimension.Id === $scope.condition[$scope.nsp+'ContextDimensionId__c']) {
                            if (dimension[$scope.nsp+'DomainType__c'] === undefined) {
                                cpqService.showNotification({
                                    type: 'error',
                                    title: 'Error',
                                    content: 'The selected context dimension "' + dimension.Name + '" is missing a value for Domain Type.'
                                });
                            } else {
                                $scope.selectedDimension = dimension;
                                if ($scope.condition[$scope.nsp+'ConditionType__c'] === 'Simple' && $scope.selectedDimension[$scope.nsp+'DomainType__c'] === 'Type in') {
                                    $scope.setValueDataType($scope.selectedDimension[$scope.nsp+'DataType__c']);
                                }
                            }
                        }
                        if (dimension[$scope.nsp+'DomainType__c'] === 'Object Lookup') {
                            var objectAPIName = dimension[$scope.nsp+'Object__c'];
                            if (objectAPIName === undefined) {
                                cpqService.showNotification({
                                    type: 'error',
                                    title: 'Error',
                                    content: 'Context dimension "' + dimension.Name + '" is of type Object Lookup, but does not have a corresponding Object.'
                                });
                            } else {
                                var referenceTo = objectAPIName;
                                if (objectAPIName.endsWith('__c')) {
                                    referenceTo = $scope.nsp + objectAPIName;
                                }
                                dimension.lookupFieldInfo = {
                                    isCreateable: true,
                                    isDefaultedOnCreate: false,
                                    isRequired: true,
                                    isUpdateable: true,
                                    label: objectAPIName,
                                    referenceTo: referenceTo,
                                    type: 'REFERENCE'
                                };
                            }
                        }
                        if (dimension[$scope.nsp+'DomainType__c'] === 'Picklist') {
                            dimension.objPicklists = [];
                            angular.forEach(dimension.PicklistItems, function(item) {
                                dimension.objPicklists.push({'label': item[$scope.nsp+'Value__c'], 'value': item[$scope.nsp+'Value__c']});
                            });
                            dimension.picklistFieldInfo = {
                                isCreateable: true,
                                isDefaultedOnCreate: false,
                                isRequired: true,
                                isUpdateable: true,
                                type: (dimension[$scope.nsp+'PicklistSelectionMode__c'] === 'Multiple' ? 'MULTIPICKLIST' : 'PICKLIST')
                            };
                        }
                    });

                    $scope.operatorList = [
                        {label: '>', value: '>'},
                        {label: '>=', value: '>='},
                        {label: '<', value: '<'},
                        {label: '<=', value: '<='},
                        {label: '==', value: '=='},
                        {label: '!=', value: '!='},
                        {label: '<>', value: '<>'},
                        {label: 'LIKE', value: 'LIKE'},
                        {label: 'NOT LIKE', value: 'NOT LIKE'},
                        {label: 'INCLUDES', value: 'INCLUDES'},
                        {label: 'EXCLUDES', value: 'EXCLUDES'}
                    ];
                };
                $scope.init();
			}
		};
	}
]);

},{}],69:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocRuleConditions', ['remoteActions', 'cpqService', 
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'RuleConditions.tpl.html',
            controller: function($scope, $rootScope, $timeout, $sldsModal, $filter) {
                $scope.nsp = fileNsPrefix();
                $scope.contextObject = $scope.customViewAttrs.contextInfo.customObject;
                $scope.objectName = $scope.nsp + 'EntityFilterCondition__c';
                $scope.newConditionType = '';
                $scope.contextDimensionsMap = {};
                $scope.expressionDisplayMap = {};

                $scope.$on('refreshFacetContent', function() {
					$scope.getRuleConditions();
				});

                $scope.describeObjectByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log('getObjectPicklistsByName  results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getRuleConditions = function() {
                    remoteActions.invokeMethod('getContextDimensions', JSON.stringify({'input': '', 'options': ''})).then(function(result) {
                        console.log('getContextDimensions:', result.ContextDimensions);
                        $scope.contextDimensions = result.ContextDimensions;
                        angular.forEach($scope.contextDimensions, function(dimension) {
                            $scope.contextDimensionsMap[dimension.Name] = dimension;
                        });

                        var inputMap = {
                            'entityFilterId': $scope.contextObject.Id
                        };
                        var inputMapJSON = JSON.stringify(inputMap);
                        var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                        remoteActions.invokeMethod('getRuleConditions', JSON.stringify(invokeInputMap)).then(function(results) {
                            console.log('getRuleConditions:', results.ruleConditions);
                            $scope.ruleConditions = [];
                            angular.forEach(results.ruleConditions, function(cond) {
                                if (cond[$scope.nsp+'ConditionType__c'] === 'Simple') {
                                    var selectedDimension = $scope.contextDimensionsMap[cond[$scope.nsp + 'FieldName__c']];
                                    if (cond[$scope.nsp+'Value__c'] === undefined) {
                                        cond.displayValue = 'null';
                                    } else if (selectedDimension[$scope.nsp+'DataType__c'] === 'Date') {
                                        cond.displayValue = $filter('date')(cond[$scope.nsp+'Value__c'], 'shortDate');
                                    } else if (selectedDimension[$scope.nsp+'DataType__c'] === 'DateTime') {
                                        cond.displayValue = $filter('date')(cond[$scope.nsp+'Value__c'], 'short');
                                    } else {
                                        cond.displayValue = cond[$scope.nsp+'Value__c'];
                                    }
                                    $scope.expressionDisplayMap[cond.Id] = cond[$scope.nsp+'FieldName__c'] + ' ' + cond[$scope.nsp+'Operator__c'] + ' ' + cond.displayValue;
                                }
                                if (cond[$scope.nsp + 'ConditionType__c'] === 'Advanced') {
                                    $scope.getFunctionArguments(cond);
                                    $scope.expressionDisplayMap[cond.Id] = '';
                                }
                                $scope.ruleConditions.push(cond);
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                        });
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getFunctionArguments = function(cond) {
                    var inputMap = {
                        'functionId': cond[$scope.nsp+'VlocityFunctionId__c'],
                        'conditionId': cond.Id
                    };
                    var inputMapJSON = JSON.stringify(inputMap);
                    var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                    remoteActions.invokeMethod('getFunctionArguments', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('getFunctionArguments result:', results);
                        $scope.fArgMap = results.FunctionArgumentsMap;
                        angular.forEach(results.EFCArguments, function(arg) {
                            var fArgId = arg[$scope.nsp+'FunctionArgumentId__c'];
                            var fArg = $scope.fArgMap[fArgId];
                            if (fArg[$scope.nsp+'Direction__c'] === 'Output') {
                                if (cond[$scope.nsp+'Value__c'] === undefined) {
                                    cond.displayValue = 'null';
                                } else if (arg[$scope.nsp+'DataType__c'] === 'Date') {
                                    cond.displayValue = $filter('date')(cond[$scope.nsp+'Value__c'], 'shortDate');
                                } else if (arg[$scope.nsp+'DataType__c'] === 'DateTime') {
                                    cond.displayValue = $filter('date')(cond[$scope.nsp+'Value__c'], 'short');
                                } else {
                                    cond.displayValue = cond[$scope.nsp+'Value__c'];
                                }
                            }
                        });
                        $scope.expressionDisplayMap[cond.Id] = cond[$scope.nsp+'FieldName__c'] + ' ' + cond[$scope.nsp+'Operator__c'] + ' ' + cond.displayValue;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.selectItem = function(item) {
                    var broadcastData = {
                        facetType: 'RULE_CONDITION',
                        facetData: {
                            rule: $scope.contextObject,
                            ruleCondition: item,
                            contextDimensions: $scope.contextDimensions
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.newItem = function(type) {
                    var newCondition = {};
                    newCondition[$scope.nsp+'EntityFilterId__c'] = $scope.contextObject.Id;
                    newCondition[$scope.nsp+'ConditionType__c'] = type;
                    $scope.selectItem(newCondition);
                };

                $scope.deleteItem = function(condition, event) {
                    if (event) {
                        event.stopPropagation();
                    }
                    
                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Rule Condition';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the condition rule with the code <i>' + condition[$scope.nsp+'Code__c'] + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in condition) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = condition[key];
                            }
                        }

                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            $scope.getRuleConditions();
                            deleteModal.hide();
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Rule conditon deleted.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

                $scope.addCondition = function() {
                    if ($scope.newConditionType !== null) {
                        $scope.newItem($scope.newConditionType);
                        $scope.newConditionType = '';
                    }
                };

                $scope.init = function() {
                    $scope.describeObjectByName($scope.objectName);
                    $scope.getObjectPicklistsByName($scope.objectName);
                    $scope.getRuleConditions();
                };
                $scope.init();
			}
		};
	}
]);

},{}],70:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocRuleSetInfoCard', ['remoteActions',
    function(remoteActions) {
        return {
            scope: {
                ruleSet: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'RuleSetInfoCard.tpl.html',
            controller: function($scope, $rootScope) {
                $scope.nsp = fileNsPrefix();
            }
        };
    }
]);

},{}],71:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocRuleSetRule', ['remoteActions', 'cpqService', 
    function(remoteActions, cpqService) {
        return {
            scope: {
                ruleSet: '=',
				ruleSetRule: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'RuleSetRule.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();
                $scope.objectName = $scope.nsp + 'RuleFilter__c';
				$scope.editObject = {};
				$scope.attrMap = {};
                $scope.attrObjMap = {};
                $scope.attrAssgnObjMap = {};
                $scope.facets = [];

                $scope.describeObjectByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' describeObject results:', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log(objectName + ' getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

				$scope.getObjectLayoutByName = function(objectName, recordType) {
                    var inputMap = { 
                        'objectName' : objectName,
                        'recordType' : recordType
                    };
                    remoteActions.invokeMethod('getObjectLayoutByName', JSON.stringify(inputMap)).then(function(results) {
                        console.log(objectName + ' getObjectLayoutByName results: ', results);
                        $scope.buildObjectLayout(results);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

				$scope.buildObjectLayout = function(results) {
					$scope.objFacets = results.facets;
					$scope.objectLayoutId = results.objLayout.Id;
					$scope.facets = [];
					if (j$.isArray($scope.objFacets) && $scope.objFacets.length > 0) {
						angular.forEach($scope.objFacets, function(facet, idx) {
							facet.hasSectionCustomView = false;
							facet.active = (idx === 0);
							angular.forEach(facet.sections, function(section) {
								if (section.facetSectionObj[$scope.nsp + 'ViewType__c'] === 'Custom View') {
									section.hasCustomView = true;
									facet.hasSectionCustomView = true;
								}
							});
							$scope.facets.push(facet);
						});
					}
					console.log($scope.objectAPIName + ' FACETS:', $scope.facets);
				};

				$scope.closeDetails = function() {
                    $rootScope.$broadcast('hideItemDetails');
                };

                $scope.createItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = $scope.editObject[key];
                        }
                    }

                    var inputMap = { 
                        'objectName': $scope.objectName,
                        'inputMap': itemToSave
                    };
                    remoteActions.invokeMethod('createObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('createObject results:', results);
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
						$rootScope.$broadcast('refreshFacetContent');
                        cpqService.showNotification({
							type: 'success',
							content: 'Child rule created.',
							autohide: true
						});
						$scope.closeDetails();
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

                $scope.saveItem = function(event) {
                    var originalText;
                    if (event) {
                        originalText = event.currentTarget.innerText;
                        event.currentTarget.disabled = true;
                        event.currentTarget.innerText = 'Saving...';
                    }

                    var itemToSave = {};
                    for (var key in $scope.editObject) {
                        if (key !== '$$hashKey') {
                            itemToSave[key] = ($scope.editObject[key] === null ? undefined : $scope.editObject[key]);
                        }
                    }

                    var inputMap = { 'so': JSON.stringify(itemToSave) };
                    remoteActions.invokeMethod('updateObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log('updateObject results: ', results);
                        $scope.ruleSetRule = {};
                        for (var key in results) {
                            if ($scope.objectFields[key] && $scope.objectFields[key].type === 'DATE') {
                                var tzOffset = (window.userTimezoneOffset || window.parent.userTimezoneOffset);
                                $scope.ruleSetRule[key] = results[key] + tzOffset;
                            } else {
                                $scope.ruleSetRule[key] = results[key];
                            }
                        }
                        if (event) {
                            event.currentTarget.innerText = originalText;
                            event.currentTarget.disabled = false;
                        }
                        $rootScope.$broadcast('refreshFacetContent');
                        cpqService.showNotification({
							type: 'success',
							content: 'Child rule saved.',
							autohide: true
						});
						$scope.closeDetails();
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                        if (event) {
                            event.currentTarget.innerText = 'Error!';
                            $timeout(function() {
                                event.currentTarget.innerText = originalText;
                                event.currentTarget.disabled = false;
                            }, 5000);
                        }
                    });
                };

				$scope.init = function() {
                    $scope.describeObjectByName($scope.objectName);
                    $scope.getObjectPicklistsByName($scope.objectName);
					$scope.getObjectLayoutByName($scope.objectName, '');

					if ($scope.ruleSetRule.Id === undefined) {
                        $scope.displayMode = 'create';
                        $scope.editObject[$scope.nsp + 'RuleId__c'] = $scope.ruleSet.Id;
					} else {
						$scope.displayMode = 'edit';
                        for (var key in $scope.ruleSetRule) {
                            if (key !== '$$hashKey') {
                                $scope.editObject[key] = $scope.ruleSetRule[key];
                            }
                        }
					}
                };
                $scope.init();
			}
		};
	}
]);

},{}],72:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocRuleSetRules', ['remoteActions', 'cpqService', 
    function(remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'RuleSetRules.tpl.html',
            controller: function($scope, $rootScope, $timeout, $sldsModal, $sldsPopover) {
                $scope.nsp = fileNsPrefix();
                $scope.contextObject = $scope.customViewAttrs.contextInfo.customObject;
                $scope.objectName = $scope.nsp + 'RuleFilter__c';

                $scope.$on('refreshFacetContent', function() {
					$scope.getRuleSetRules();
				});

                $scope.describeObjectByName = function(objectName) {
                    var inputMap = { 'objectName' : objectName };
                    remoteActions.invokeMethod('describeObject', JSON.stringify(inputMap)).then(function(results) {
                        console.log($scope.objectName + ' describeObject results:', results);
                        $scope.objectFields = results;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getObjectPicklistsByName = function(objectName) {
                    var inputMap = { 'objectName': objectName };
                    remoteActions.invokeMethod('getObjectPicklistsByName', JSON.stringify(inputMap)).then(function(results) {
                        $scope.objectPicklists = {};
                        for (var key in results) {
                            $scope.objectPicklists[key.toLowerCase()] = results[key];
                        }
                        console.log($scope.objectName + ' getObjectPicklistsByName results:', $scope.objectPicklists);
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.getRuleSetRules = function() {
                    var inputMap = {
                        'ruleId': $scope.contextObject.Id
                    };
                    var inputMapJSON = JSON.stringify(inputMap);
                    var invokeInputMap = { 'input': inputMapJSON, 'options': '' };
                    remoteActions.invokeMethod('getChildrenRules', JSON.stringify(invokeInputMap)).then(function(results) {
                        console.log('getChildrenRules:', results.childrenRules);
                        $scope.childrenRules = [];
						angular.forEach(results.childrenRules, function(rule) {
							$scope.childrenRules.push(rule);
						});
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.newItem = function(event) {
                    $scope.editItem({}, event);
                };

				$scope.editItem = function(item, event) {
					if (event) {
                        event.stopPropagation();
                    }

                    var broadcastData = {
                        facetType: 'RULESET_RULE',
                        facetData: {
                            ruleSetRule: item,
							ruleSet: $scope.contextObject
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.deleteItem = function(item, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var modalScope = $scope.$new();
                    modalScope.confirmationTitle = 'Delete Child Rule';
                    modalScope.confirmationMsg = 'Are you sure you want to delete the child rule <i>' + item[$scope.nsp+'EntityFilterId__r'].Name + '</i>?';
                    modalScope.cancelActionLbl = 'Cancel';
                    modalScope.confirmActionLbl = 'Delete';
                    modalScope.confirmAction = function(event) {
                        var originalText;
                        if (event) {
                            originalText = event.currentTarget.innerText;
                            event.currentTarget.disabled = true;
                            event.currentTarget.innerText = 'Deleting...';
                        }

                        var itemToDelete = {};
                        for (var key in item) {
                            if (key !== '$$hashKey') {
                                itemToDelete[key] = item[key];
                            }
                        }

                        var inputMap = { 'objectId' : itemToDelete.Id };
                        remoteActions.invokeMethod('deleteObject', JSON.stringify(inputMap)).then(function(results) {
                            $scope.getRuleSetRules();
                            deleteModal.hide();
                            cpqService.showNotification({
                                type: 'success',
                                content: 'Child rule deleted.',
                                autohide: true
                            });
                        }, function(error) {
                            cpqService.showNotification({
                                type: 'error',
                                title: 'Error',
                                content: error.message
                            });
                            deleteModal.hide();
                        });
                    };

                    var deleteModal = $sldsModal({
                        templateUrl: 'ConfirmationModal.tpl.html',
                        backdrop: 'static',
                        scope: modalScope,
                        show: true
                    });
                };

				$scope.showRuleInfo = function(rule, event) {
                    if (event) {
                        event.stopPropagation();
                    }
                    if ($scope.ruleInfoPopover) {
                        $scope.ruleInfoPopover.destroy();
                    }
                    var popoverScope = $scope.$new();
                    popoverScope.entityFilter = rule;
                    $scope.ruleInfoPopover = $sldsPopover(j$(event.currentTarget), {
                        scope: popoverScope,
                        sldsEnabled: true,
                        show: true,
                        autoClose: true,
                        trigger: 'manual',
                        nubbinDirection: 'left',
                        container: '.via-slds',
                        template: '<div class="slds-popover slds-popover-entity-filter slds-nubbin--left" role="dialog"><div class="slds-popover__body"><vloc-entity-filter-info-card entity-filter="entityFilter"></vloc-entity-filter-info-card></div></div>'
                    });
                };

                $scope.showContextActionInfo = function(contextAction, event) {
                    if (event) {
                        event.stopPropagation();
                    }
                    if ($scope.contextActionPopover) {
                        $scope.contextActionPopover.destroy();
                    }
                    var popoverScope = $scope.$new();
                    popoverScope.contextAction = contextAction;
                    $scope.contextActionPopover = $sldsPopover(j$(event.currentTarget), {
                        scope: popoverScope,
                        sldsEnabled: true,
                        show: true,
                        autoClose: true,
                        trigger: 'manual',
                        nubbinDirection: 'left',
                        container: '.via-slds',
                        template: '<div class="slds-popover slds-popover-entity-filter slds-nubbin--left" role="dialog"><div class="slds-popover__body"><vloc-context-action-info-card context-action="contextAction"></vloc-context-action-info-card></div></div>'
                    });
                };

                $scope.launchObjectTab = function(item, objAPIName, event) {
                    if (event) {
                        event.stopPropagation();
                    }

                    var data = {
                        'doAction': 'viewRecord',
                        'doAPIName': objAPIName,
                        'obj': item,
                        'closeCurrentTab': false
                    };
                    var broadcastAction = {
                        'eventName': 'launchConsoleTab',
                        'eventData': data
                    };
                    if (window.frameElement !== null) {
                        // create a iframe resize event binding with the parent
                        window.parent.bindIframeEvents('broadcast', broadcastAction);
                    }
                };

                $scope.init = function() {
                    $scope.describeObjectByName($scope.objectName);
                    $scope.getObjectPicklistsByName($scope.objectName);
                    $scope.getRuleSetRules();
                };
                $scope.init();
			}
		};
	}
]);

},{}],73:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocSections', ['remoteActions', 'cpqService',
    function(remoteActions, cpqService) {
        return {
            scope: {
                facet: '=',
                parentObj: '=',
                fieldDisplayMode: '@',
				objectFields: '=',
				objectPicklists: '=',
				attrMap: '=',
				attrObjMap: '=',
				attrAssgnObjMap: '=',
                setupViewAttrs: '&',
				showAttributeMetadata: '&',
				formName: '=',
				recordType: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'VlocSections.tpl.html',
            controller: function($scope, $rootScope, $timeout) {
                $scope.nsp = fileNsPrefix();

                if ($scope.fieldDisplayMode === undefined || $scope.fieldDisplayMode === null) {
                    $scope.fieldDisplayMode = 'edit';
                }
            }
        };
    }
]);



},{}],74:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocStandalonePricingElements', ['remoteActions',
    function(remoteActions) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'StandalonePricingElements.tpl.html'
        };
    }
]);

},{}],75:[function(require,module,exports){
angular.module('epcadmin')
.directive('vlocVirObjClassAttrs', ['$rootScope', 'remoteActions', 'cpqService',
    function($rootScope, remoteActions, cpqService) {
        return {
            scope: {
                customViewAttrs: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'VirObjClassAttrs.tpl.html',
            controller: function($scope) {
                console.log('INIT: ', $scope.customViewAttrs);
                $scope.nsp = fileNsPrefix();
                $scope.objectId = $scope.customViewAttrs.objectId;
                $scope.objectName = $scope.customViewAttrs.objectApiName;
                $scope.attrList = [];
                $scope.fieldList = [];
                $scope.filter = {
                    ua: true,
                    ba: true,
                    uf: true,
                    bf: true
                };

                $scope.$on('refreshItems', function() {
                    $scope.getAttributeFieldBindingData();
                });

                $scope.getAttributeFieldBindingData = function() {
                    $scope.AttrObjMap = {};
                    $scope.AttrAssgnObjMap = {};
                    $scope.attributeMap = {};
                    $scope.fieldMap = {};
                    $scope.items = [];
                    $scope.allSelected = false;
                    $scope.selectedCount = 0;

                    var inputMap = { 
                        'objectId' : $scope.objectId,
                        'allObjectAttributes' : true
                    };
                    remoteActions.invokeMethod('getAttributeFieldBindingData', JSON.stringify(inputMap)).then(function(results) {
                        console.log('getAttributeFieldBindingData results: ', results);
                        $scope.bindings = results.AttributeBinding__c;
                        $scope.fields = results.Field;
                        $scope.parseAAWrapper(results.AAWrapper);
                        var attrList = [];
                        var fieldList = [];

                        var boundAttrMap = {};
                        var boundFieldMap = {};
                        angular.forEach($scope.bindings, function(binding) {
                            var attrId = binding[$scope.nsp + 'AttributeId__c'];
                            var attrObj = $scope.attributeMap[attrId];
                            var attrName = attrObj.Name;
                            var attrCode = attrObj.Code;
                            var attrDescription = attrObj.Description;
                            var fieldName = binding[$scope.nsp + 'FieldApiName__c'];
                            boundAttrMap[attrId] = {'Name': fieldName, 'Label': $scope.fields[fieldName].label};
                            boundFieldMap[fieldName] = {'Id': attrId, 'Name': attrName, 'Code': attrCode, 'Description': attrDescription};
                        });
                        angular.forEach($scope.attributes, function(attr) {
                            var item = {};
                            item.isSelected = false;
                            item.attrId = attr.Id;
                            item.attrName = attr.Name;
                            item.attrCode = attr.Code;
                            item.attrDescription = attr.Description;
                            if (boundAttrMap[attr.Id] === undefined) {
                                item.bound = false;
                                item.fieldName = '';
                                item.fieldLabel = '';
                            } else {
                                item.bound = true;
                                item.fieldName = boundAttrMap[attr.Id].Name;
                                item.fieldLabel = boundAttrMap[attr.Id].Label;
                            }
                            attrList.push(item);
                            $scope.items.push(item);
                        });
                        for (var fieldName in $scope.fields) {
                            var field = {'name': fieldName, 'label': $scope.fields[fieldName].label};
                            var item = {};
                            item.isSelected = false;
                            item.fieldName = fieldName;
                            item.fieldLabel = field.label;

                            if (boundFieldMap[fieldName] === undefined) {
                                item.bound = false;
                                item.attrId = '';
                                item.attrName = '';
                                item.attrCode = '';
                                item.attrDescription = '';
                                $scope.items.push(item);
                            } else {
                                item.bound = true;
                                item.attrId = boundFieldMap[fieldName].Id;
                                item.attrName = boundFieldMap[fieldName].Name;
                                item.attrCode = boundFieldMap[fieldName].Code;
                                item.attrDescription = boundFieldMap[fieldName].Description;
                            }

                            fieldList.push(item);
                        }
                        $scope.attrList = attrList;
                        $scope.fieldList = fieldList;
                    }, function(error) {
                        cpqService.showNotification({
                            type: 'error',
                            title: 'Error',
                            content: error.message
                        });
                    });
                };

                $scope.parseAAWrapper = function(aList) {
                    $scope.attributes = [];
                    angular.forEach(aList, function(aItem) {
                        var attr = {};
                        if (aItem.attributeAssignment) {
                            // use attribute assignment
                            attr.aaId = aItem.attributeAssignment.Id;
                            attr.Id = aItem.attributeAssignment[$scope.nsp + 'AttributeId__c'];
                            attr.Name = aItem.attributeAssignment[$scope.nsp + 'AttributeDisplayName__c'];
                            attr.Code = aItem.attributeAssignment[$scope.nsp + 'AttributeUniqueCode__c'];
                            attr.Description = aItem.attribute[$scope.nsp + 'Description__c'];
                            $scope.AttrAssgnObjMap[attr.Id] = aItem.attributeAssignment;
                        } else {
                            // use attribute
                            attr.Id = aItem.attribute.Id;
                            attr.Name = aItem.attribute.Name;
                            attr.Code = aItem.attribute[$scope.nsp + 'Code__c'];
                            attr.Description = aItem.attribute[$scope.nsp + 'Description__c'];
                            $scope.AttrAssgnObjMap[attr.Id] = null;
                        }
                        $scope.AttrObjMap[attr.Id] = aItem.attribute;
                        $scope.attributeMap[attr.Id] = attr;
                        $scope.attributes.push(attr);
                    });
                };

                $scope.showAttributeMetadata = function(attrId) {
                    var broadcastData = {
                        facetType: 'ATTR_METADATA',
                        facetData: {
                            objectId: $scope.objectId,
                            attrId: attrId
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.showFieldMetadata = function(objectName, fieldName) {
                    var objApiName = $scope.objectName;
                    var broadcastData = {
                        facetType: 'FIELD_METADATA',
                        facetData: {
                            objectName: objApiName,
                            fieldName: fieldName
                        }
                    };
                    $rootScope.$broadcast('showItemDetails', broadcastData);
                };

                $scope.init = function() {
                    $scope.getAttributeFieldBindingData();
                };
                $scope.init();
            }
        };
    }
]);

},{}],76:[function(require,module,exports){
angular.module('epcadmin')
.factory('cpqService', ['$rootScope', 
    function($rootScope) {
        var nsp = fileNsPrefix();

        var prodChildTabs = [
            {
                'title': 'Product Child',
                'active': false,
                'hidden': false
            },
            {
                'title': 'Product Cardinality',
                'active': false,
                'hidden': false
            },
            {
                'title': 'Product Attributes',
                'active': false,
                'hidden': false
            },
            {
                'title': 'Product Pricing',
                'active': false,
                'hidden': false
            }
        ];
        var prodChildActiveTabIdx = 0;

        var overrideMode = false;

        var priceListEntryTabs = [
            {
                'title': 'Price List Entry',
                'hidden': false,
                'active': true
            },
            {
                'title': 'Context Rules',
                'hidden': false,
                'active': false
            }
        ];
        var priceListEntryTabIdx = 0;

        var objectPricingTabs = [
            {
                'title': 'Charges',
                'active': true,
                'hidden': false
            },
            {
                'title': 'Costs',
                'active': false,
                'hidden': false
            },
            {
                'title': 'Usages',
                'active': false,
                'hidden': true
            },
            {
                'title': 'Adjustments',
                'active': false,
                'hidden': false
            },
            {
                'title': 'Overrides',
                'active': false,
                'hidden': false
            }
        ];
        var objectPricingTabIdx = 0;

        var pricingElementTabs = [
            {
                'title': 'Charges',
                'active': true,
                'hidden': false
            },
            {
                'title': 'Costs',
                'active': false,
                'hidden': false
            },
            {
                'title': 'Usages',
                'active': false,
                'hidden': true
            },
            {
                'title': 'Adjustments',
                'active': false,
                'hidden': false
            }
        ];
        var pricingElementTabIdx = 0;

        var ruleSetTabs = [
            {
                'title': 'Qualification',
                'active': true,
                'hidden': false
            },
            {
                'title': 'Penalty',
                'active': false,
                'hidden': false
            },
            {
                'title': 'Evaluation',
                'active': false,
                'hidden': false
            }
        ];

        var qualifyRuleSetTabs = [
            {
                'title': 'Qualification',
                'active': true,
                'hidden': false
            }
        ];

        var ruleSetTabIdx = 0;
        var qualifyRuleSetTabIdx = 0;

        return {
            getProductChildTabs: function(isRoot, isLeaf, administerRoot) {
                prodChildTabs[0].hidden = false;
                prodChildTabs[1].hidden = false;
                prodChildTabs[2].hidden = false;
                prodChildTabs[3].hidden = false;

                if (isRoot && isLeaf) {
                    prodChildTabs[0].hidden = true;
                    prodChildTabs[1].hidden = true;
                    if (prodChildActiveTabIdx === 0 || prodChildActiveTabIdx === 1) {
                        prodChildActiveTabIdx = 2;
                    }
                } else if (isRoot) {
                    prodChildTabs[0].hidden = true;
                    if (administerRoot) {
                        if (prodChildActiveTabIdx === 0) {
                            prodChildActiveTabIdx = 1;
                        }
                    } else {
                        prodChildTabs[2].hidden = true;
                        prodChildTabs[3].hidden = true;
                        prodChildActiveTabIdx = 1;
                    }
                    ///prodChildActiveTabIdx = 0;
                } else if (isLeaf) {
                    prodChildTabs[1].hidden = true;
                    if (prodChildActiveTabIdx === 1) {
                        prodChildActiveTabIdx = 0;
                    }
                }
                else {
                    prodChildTabs[1].hidden = true;
                    prodChildActiveTabIdx = 0;
                }

                angular.forEach(prodChildTabs, function(tab, idx) {
                    tab.active = (prodChildActiveTabIdx === idx);
                });
                return prodChildTabs;
            },
            getProdChildActiveTabIdx: function() {
                return prodChildActiveTabIdx;
            },
            setProdChildActiveTabIdx: function(value) {
                prodChildActiveTabIdx = value;
            },
            getOverrideMode: function() {
                return overrideMode;
            },
            setOverrideMode: function(value) {
                overrideMode = value;
            },
            getPriceListEntryTabs: function(isRoot) {
                return priceListEntryTabs;
            },
            getPriceListEntryTabIdx: function() {
                return priceListEntryTabIdx;
            },
            setPriceListEntryTabIdx: function(value) {
                priceListEntryTabIdx = value;
            },
            getObjectPricingTabs: function(pricingMode) {
                if (pricingMode === 'PRICELIST') {
                    objectPricingTabs[2].hidden = true;
                    objectPricingTabs[3].hidden = true;
                    objectPricingTabs[4].hidden = true;
                }
                if (pricingMode === 'DISCOUNT') {
                    objectPricingTabs[0].hidden = true;
                    objectPricingTabs[1].hidden = true;
                    objectPricingTabs[2].hidden = true;
                    objectPricingTabs[3].active = true;
                    objectPricingTabs[4].hidden = true;
                }
                return objectPricingTabs;
            },
            getObjectPricingTabIdx: function(pricingMode) {
            	if (pricingMode === 'DISCOUNT') {
            		// index for adjustments tab
            		return 3;
            	}
            	else
            	{
            		return objectPricingTabIdx;
            	}
            },
            setObjectPricingTabIdx: function(value) {
                objectPricingTabIdx = value;
            },
            getPricingElementTabs: function() {
                return pricingElementTabs;
            },
            getPricingElementTabIdx: function() {
                return pricingElementTabIdx;
            },
            setPricingElementTabIdx: function(value) {
                pricingElementTabIdx = value;
            },
            getRuleSetTabs: function() {
                return ruleSetTabs;
            },
            getRuleSetTabIdx: function() {
                return ruleSetTabIdx;
            },
            setRuleSetTabIdx: function(value) {
                ruleSetTabIdx = value;
            },
            getQualifyRuleSetTabIdx: function() {
                return qualifyRuleSetTabIdx;
            },
            setQualifyRuleSetTabIdx: function(value) {
                qualifyRuleSetTabIdx = value;
            },
            showNotification: function(message) {
                var broadcastAction = {
                    'eventName': 'showNotification',
                    'eventData': {
                        'message': message
                    }
                };
                if (window.frameElement !== null) {
                    // create a iframe resize event binding with the parent
                    window.parent.bindIframeEvents('broadcast', broadcastAction);
                }
            }
        };
    }
]);

},{}],77:[function(require,module,exports){
angular.module('epcadmin')
.factory('objectClassService', ['$rootScope',
    function($rootScope) {
        var nsp = fileNsPrefix();
        var ENTITYCLASS_FACETS = [
            {
                'active': true,
                'facetObj': {
                    'Id': 'fo1',
                    'Name': 'General Properties'
                },
                'hasSectionCustomView': false,
                'sections': [
                    {
                        'facetSectionObj': {},
                        'sectionElements': [
                            {
                                'Id': 'se1',
                                'Name': 'Object Name',
                                'FieldApiName__c': 'Name',
                                'Type__c': 'Field'
                            },
                            {
                                'Id': 'se2',
                                'Name': 'Object API Name',
                                'FieldApiName__c': nsp+'ObjectApiName__c',
                                'Type__c': 'Field'
                            }
                        ],
                        'sectionObj': {
                            'Name': 'General Properties'
                        }
                    },
                    {
                        'facetSectionObj': {},
                        'sectionElements': [
                            {
                                'Id': 'se4',
                                'Name': 'Active',
                                'FieldApiName__c': nsp+'IsActive__c',
                                'Type__c': 'Field'
                            },
                            {
                                'Id': 'se5',
                                'Name': 'Effective From',
                                'FieldApiName__c': nsp+'EffectiveFromDate__c',
                                'Type__c': 'Field'
                            },
                            {
                                'Id': 'se6',
                                'Name': 'Effective Until',
                                'FieldApiName__c': nsp+'EffectiveUntilDate__c',
                                'Type__c': 'Field'
                            }
                        ],
                        'sectionObj': {
                            'Name': 'Effectivity'
                        }
                    }
                ]
            },
            /*{
                'active': false,
                'facetObj': {
                    'Id': 'fo2',
                    'Name': 'Attribute-Field Bindings'
                },
                'hasSectionCustomView': true,
                'sections': [
                    {
                        'hasCustomView': true,
                        'facetSectionObj': {
                            'Name': 'Attribute-Field Bindings',
                            'ViewType__c': 'Custom View',
                            'ViewUri__c': 'AttributeFieldBindings'
                        },
                        'sectionElements': [],
                        'sectionObj': {
                            'Name': 'Attribute-Field Bindings'
                        }
                    }
                ]
            },*/
            {
                'active': false,
                'facetObj': {
                    'Id': 'fo3',
                    'Name': 'Attributes and Fields'
                },
                'hasSectionCustomView': true,
                'sections': [
                    {
                        'hasCustomView': true,
                        'facetSectionObj': {
                            'Name': 'Attributes and Fields',
                            'ViewType__c': 'Custom View',
                            'ViewUri__c': 'ObjectClassAttrsFields'
                        },
                        'sectionElements': [],
                        'sectionObj': {
                            'Name': 'Attributes and Fields'
                        }
                    }
                ]
            }
        ];

        var VIR_ENTITYCLASS_FACETS = [
            {
                'active': true,
                'facetObj': {
                    'Id': 'fo1',
                    'Name': 'General Properties'
                },
                'hasSectionCustomView': false,
                'sections': [
                    {
                        'facetSectionObj': {},
                        'sectionElements': [
                            {
                                'Id': 'se1',
                                'Name': 'Object Name',
                                'FieldApiName__c': 'Name',
                                'Type__c': 'Field'
                            }
                        ],
                        'sectionObj': {
                            'Name': 'General Properties'
                        }
                    },
                    {
                        'facetSectionObj': {},
                        'sectionElements': [
                            {
                                'Id': 'se4',
                                'Name': 'Active',
                                'FieldApiName__c': nsp+'IsActive__c',
                                'Type__c': 'Field'
                            },
                            {
                                'Id': 'se5',
                                'Name': 'Effective From',
                                'FieldApiName__c': nsp+'EffectiveFromDate__c',
                                'Type__c': 'Field'
                            },
                            {
                                'Id': 'se6',
                                'Name': 'Effective Until',
                                'FieldApiName__c': nsp+'EffectiveUntilDate__c',
                                'Type__c': 'Field'
                            }
                        ],
                        'sectionObj': {
                            'Name': 'Effectivity'
                        }
                    }
                ]
            },
            {
                'active': false,
                'facetObj': {
                    'Id': 'fo3',
                    'Name': 'Attributes'
                },
                'hasSectionCustomView': true,
                'sections': [
                    {
                        'hasCustomView': true,
                        'facetSectionObj': {
                            'Name': 'Attributes',
                            'ViewType__c': 'Custom View',
                            'ViewUri__c': 'VirObjClassAttrs'
                        },
                        'sectionElements': [],
                        'sectionObj': {
                            'Name': 'Attributes'
                        }
                    }
                ]
            }
        ];



        var LAYOUT_MANAGEMENT = {
                'active': false,
                'facetObj': {
                    'Id': 'fo4',
                    'Name': 'Layout Management'
                },
                'hasSectionCustomView': true,
                'sections': [
                    {
                        'hasCustomView': true,
                        'facetSectionObj': {
                            'Name': 'Layout Management',
                            'ViewType__c': 'Custom View',
                            'ViewUri__c': 'LayoutManagement'
                        },
                        'sectionElements': [],
                        'sectionObj': {
                            'Name': 'Layout Management'
                        }
                    }
                ]
            };

        var OBJECT_TYPES = {
                'active': false,
                'facetObj': {
                    'Id': 'fo5',
                    'Name': 'Object Types'
                },
                'hasSectionCustomView': true,
                'sections': [
                    {
                        'hasCustomView': true,
                        'facetSectionObj': {
                            'Name': 'Object Types',
                            'ViewType__c': 'Custom View',
                            // 'ViewUri__c': 'ObjectTypes'
                            'ViewUri__c': 'ObjectTypeStructure'
                        },
                        'sectionElements': [],
                        'sectionObj': {
                            'Name': 'Object Types'
                        }
                    }
                ]
            };

        var CONTEXT_RULES = {
                'active': false,
                'facetObj': {
                    'Id': 'fo6',
                    'Name': 'Context Rules'
                },
                'hasSectionCustomView': true,
                'sections': [
                    {
                        'hasCustomView': true,
                        'facetSectionObj': {
                            'Name': 'Context Rules',
                            'ViewType__c': 'Custom View',
                            'ViewUri__c': 'QualifyContextRules'
                        },
                        'sectionElements': [],
                        'sectionObj': {
                            'Name': 'Context Rules'
                        }
                    }
                ]
            };    


        return {
            getFacets: function() {
                var nsp = fileNsPrefix();
                var facets = [];
                var key;
                angular.forEach(ENTITYCLASS_FACETS, function(facet) {
                    angular.forEach(facet.sections, function(section) {
                        // sectionElements
                        angular.forEach(section.sectionElements, function(sectionElement) {
                            for (key in sectionElement) {
                                if (key.endsWith('__c')) {
                                    sectionElement[nsp + key] = sectionElement[key];
                                }
                            }
                        });

                        // sectionObj
                        for (key in section.facetSectionObj) {
                            if (key.endsWith('__c')) {
                                section.facetSectionObj[nsp + key] = section.facetSectionObj[key];
                            }
                        }
                    });
                    facets.push(facet);
                });
                return facets;
            },
            getFacetsByType: function(objType) {
                var nsp = fileNsPrefix();
                var facets = [];
                var key;
                var FINAL_ENTITYCLASS_FACETS = [];
                if(objType == 'virtual')
                {
                    VIR_ENTITYCLASS_FACETS.push(CONTEXT_RULES);
                    FINAL_ENTITYCLASS_FACETS = VIR_ENTITYCLASS_FACETS;
                }
                else
                {
                    ENTITYCLASS_FACETS.push(LAYOUT_MANAGEMENT);
                    ENTITYCLASS_FACETS.push(OBJECT_TYPES);
                    FINAL_ENTITYCLASS_FACETS = ENTITYCLASS_FACETS;
                }
                angular.forEach(FINAL_ENTITYCLASS_FACETS, function(facet) {
                    angular.forEach(facet.sections, function(section) {
                        // sectionElements
                        angular.forEach(section.sectionElements, function(sectionElement) {
                            for (key in sectionElement) {
                                if (key.endsWith('__c')) {
                                    sectionElement[nsp + key] = sectionElement[key];
                                }
                            }
                        });

                        // sectionObj
                        for (key in section.facetSectionObj) {
                            if (key.endsWith('__c')) {
                                section.facetSectionObj[nsp + key] = section.facetSectionObj[key];
                            }
                        }
                    });
                    facets.push(facet);
                });
                return facets;
            }

        };
    }
]);

},{}],78:[function(require,module,exports){
angular.module('epcadmin')
.factory('objectTypeService', ['$rootScope',
    function($rootScope) {
        var nsp = fileNsPrefix();
        var OBJECTTYPE_FACETS = [
            {
                'active': true,
                'facetObj': {
                    'Id': 'fo1',
                    'Name': 'General Properties'
                },
                'hasSectionCustomView': false,
                'sections': [
                    {
                        'facetSectionObj': {},
                        'sectionElements': [
                            {
                                'Id': 'se1',
                                'Name': 'Object Name',
                                'FieldApiName__c': 'Name',
                                'Type__c': 'Field'
                            },
                            {
                                'Id': 'se2',
                                'Name': 'Object API Name',
                                'FieldApiName__c': nsp+'ObjectApiName__c',
                                'Type__c': 'Field'
                            },
                            {
                                'Id': 'se4',
                                'Name': 'Parent Object Type',
                                'FieldApiName__c': nsp+'ParentObjectClassId__c',
                                'Type__c': 'Field'
                            }
                        ],
                        'sectionObj': {
                            'Name': 'General Properties'
                        }
                    },
                    {
                        'facetSectionObj': {},
                        'sectionElements': [
                            {
                                'Id': 'se4',
                                'Name': 'Active',
                                'FieldApiName__c': nsp+'IsActive__c',
                                'Type__c': 'Field'
                            },
                            {
                                'Id': 'se5',
                                'Name': 'Effective From',
                                'FieldApiName__c': nsp+'EffectiveFromDate__c',
                                'Type__c': 'Field'
                            },
                            {
                                'Id': 'se6',
                                'Name': 'Effective Until',
                                'FieldApiName__c': nsp+'EffectiveUntilDate__c',
                                'Type__c': 'Field'
                            }
                        ],
                        'sectionObj': {
                            'Name': 'Effectivity'
                        }
                    }
                ]
            },
            {
                'active': false,
                'facetObj': {
                    'Id': 'fo3',
                    'Name': 'Attributes and Fields'
                },
                'hasSectionCustomView': true,
                'sections': [
                    {
                        'hasCustomView': true,
                        'facetSectionObj': {
                            'Name': 'Attributes and Fields',
                            'ViewType__c': 'Custom View',
                            'ViewUri__c': 'VlocObjAttrsFields'
                        },
                        'sectionElements': [],
                        'sectionObj': {
                            'Name': 'Attributes and Fields'
                        }
                    }
                ]
            },
            {
                'active': false,
                'facetObj': {
                    'Id': 'fo4',
                    'Name': 'Layout Management'
                },
                'hasSectionCustomView': true,
                'sections': [
                    {
                        'hasCustomView': true,
                        'facetSectionObj': {
                            'Name': 'Layout Management',
                            'ViewType__c': 'Custom View',
                            'ViewUri__c': 'LayoutManagement'
                        },
                        'sectionElements': [],
                        'sectionObj': {
                            'Name': 'Layout Management'
                        }
                    }
                ]
            }
        ];

        return {
            getFacets: function() {
                var nsp = fileNsPrefix();
                var facets = [];
                var key;
                angular.forEach(OBJECTTYPE_FACETS, function(facet) {
                    angular.forEach(facet.sections, function(section) {
                        // sectionElements
                        angular.forEach(section.sectionElements, function(sectionElement) {
                            for (key in sectionElement) {
                                if (key.endsWith('__c')) {
                                    sectionElement[nsp + key] = sectionElement[key];
                                }
                            }
                        });

                        // sectionObj
                        for (key in section.facetSectionObj) {
                            if (key.endsWith('__c')) {
                                section.facetSectionObj[nsp + key] = section.facetSectionObj[key];
                            }
                        }
                    });
                    facets.push(facet);
                });
                return facets;
            }
        };
    }
]);

},{}],79:[function(require,module,exports){

},{}]},{},[1]);
})();
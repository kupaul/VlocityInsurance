/***************************
****************************
DO NOT EDIT THIS FILE DIRECTLY - IT IS AUTO-GENERATED!
Instead edit the JS files in the javascript directory:

****************************
****************************/

(function(){
  var fileNsPrefix = (function() {
    'use strict';
    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length - 1];
    var scriptName = lastScript.src;
    var parts = scriptName.split('/');
    var thisScript = parts[parts.length - 1];
    if (thisScript === "") {
      thisScript = parts[parts.length - 2];
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
};
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('productdetails', ['vlocity', 'mgcrea.ngStrap.alert', 'mgcrea.ngStrap.datepicker'])
.config(['remoteActionsProvider', function(remoteActionsProvider) {
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}])
.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

require('./modules/productdetails/controller/ProductDetailsController.js');
require('./modules/productdetails/directive/VlocImgCarousel.js');
require('./modules/productdetails/directive/VlocObjField.js');
require('./modules/productdetails/templates/templates.js');

},{"./modules/productdetails/controller/ProductDetailsController.js":2,"./modules/productdetails/directive/VlocImgCarousel.js":3,"./modules/productdetails/directive/VlocObjField.js":4,"./modules/productdetails/templates/templates.js":5}],2:[function(require,module,exports){
angular.module('productdetails')
.controller('ProductDetailsController', ['$scope', '$location', 'remoteActions', '$timeout', '$alert',
    function($scope, $location, remoteActions, $timeout, $alert) {
        $scope.nsp = fileNsPrefix();
        $scope.productId = $location.search().id;
        $scope.mode = $location.search().mode;
        $scope.product = {};
        $scope.newProduct = {
            'Name': ''
        };
        $scope.objectFields = null;
        $scope.objectPicklists = {};
        $scope.productAttachments = [];
        if ($scope.mode === undefined) {
            $scope.mode = 'view';
        }
        $scope.editMode = false;

        $scope.getObject = function(productId) {
            remoteActions.getObject(productId).then(function(results) {
                console.log('getObject results: ', results);
                $scope.product = results;
            });
        };

        $scope.describeObjectbyId = function(productId) {
            remoteActions.describeObjectbyId(productId).then(function(results) {
                console.log('describeObjectbyId results: ', results);
                $scope.objectFields = results;
            });
        };

        $scope.describeObject = function(objectName) {
            remoteActions.describeObject(objectName).then(function(results) {
                console.log('describeObject results: ', results);
                $scope.objectFields = results;
            });
        };

        $scope.getObjectPicklistsByName = function(objectName) {
            remoteActions.getObjectPicklistsByName(objectName).then(function(results) {
                $scope.objectPicklists = {};
                for (var key in results) {
                    if (key.endsWith('__c')) {
                        $scope.objectPicklists[$scope.nsp + key] = results[key];
                    } else {
                        $scope.objectPicklists[key] = results[key];
                    }
                }
                console.log('getObjectPicklistsByName results:', $scope.objectPicklists);
            });
        };

        $scope.getFieldSets = function(productId) {
            remoteActions.getFieldSets(productId).then(function(results) {
                console.log('getFieldSets results: ', results);
                if (results[$scope.nsp + 'productdetails'] === undefined) {
                    $scope.fieldSet = null;
                } else {
                    $scope.fieldSet = results[$scope.nsp + 'productdetails'];

                    $scope.fieldSetRows = [];
                    for (var i = 0; i < $scope.fieldSet.length; i += 2) {
                        $scope.fieldSetRows.push($scope.fieldSet.slice(i, i + 2));
                    }
                    console.log('$scope.fieldSetRows:', $scope.fieldSetRows);
                }
            });
        };

        $scope.getFieldSetsByName = function(objectName) {
            remoteActions.getFieldSetsByName(objectName).then(function(results) {
                console.log('getFieldSets results: ', results);
                if (results[$scope.nsp + 'newproduct'] === undefined) {
                    $scope.fieldSet = null;
                } else {
                    $scope.fieldSet = results[$scope.nsp + 'newproduct'];
                }
            });
        };

        $scope.getAttachments = function(productId) {
            remoteActions.getAttachments(productId).then(function(results) {
                $scope.productAttachments = results;
            });
        };

        $scope.updateProduct = function() {
            $scope.editProduct = {};
            for (var key in $scope.product) {
                $scope.editProduct[key] = $scope.product[key];
            }
            $scope.editMode = !$scope.editMode;
        };

        $scope.saveProduct = function(event) {
            var originalText;
            if (event) {
                originalText = event.currentTarget.innerText;
                event.currentTarget.disabled = true;
                event.currentTarget.innerText = 'Saving...';
            }

            //special cases for nulls
            for (var key in $scope.objectFields) {
                var type = $scope.objectFields[key].type;
                if (type == 'DATE' || type == 'DOUBLE' || type == 'INTEGER') {
                    if ($scope.editProduct[key]==null || $scope.editProduct[key]=='') {
                        $scope.editProduct[key] = undefined;
                    }
                }
            }

            remoteActions.updateObject($scope.editProduct).then(function(results) {
                console.log('save product results: ', results);
                $scope.product = results;
                if (event) {
                    event.currentTarget.innerText = originalText;
                    event.currentTarget.disabled = false;
                }
                $alert({title: '', content: 'Saved!', placement: 'top', type: 'success', duration: 3, show: true});
                $scope.editMode = !$scope.editMode;
            }, function(error) {
                $alert({title: 'Save Product Error: ', content: error.message, placement: 'top', type: 'danger', show: true});
                if (event) {
                    event.currentTarget.innerText = 'Error!';
                    $timeout(function() {
                        event.currentTarget.innerText = originalText;
                        event.currentTarget.disabled = false;
                    }, 5000);
                }
            });
        };

        $scope.cancelEdit = function() {
            $scope.editMode = !$scope.editMode;
        };

        $scope.createProduct = function(event) {
            var originalText;
            if (event) {
                originalText = event.currentTarget.innerText;
                event.currentTarget.disabled = true;
                event.currentTarget.innerText = 'Saving...';
            }
            remoteActions.createObject('Product2', $scope.newProduct).then(function(results) {
                console.log('create product results: ', results);
                var obj = results;
                if (event) {
                    event.currentTarget.innerText = 'Saved!';
                    // rename the active tab from 'New Product' to the name of the new product
                    updateActiveTab(obj.Name);
                    // go to the product admin page
                    var baseProdId = (obj[$scope.nsp + 'BaseProductId__c'] || '');
                    window.location.href = '/apex/ProductAdmin?id=' + obj.Id + '&name=' + obj.Name + '&baseProductId=' + baseProdId;
                }
            }, function(error) {
                $alert({title: 'Create Product Error: ', content: error.message, placement: 'top', type: 'danger', show: true});
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
            if ($scope.mode === 'view' || $scope.mode === 'override') {
                $scope.getObject($scope.productId);
                $scope.describeObjectbyId($scope.productId);
                $scope.getFieldSets($scope.productId);
            }

            if ($scope.mode === 'new') {
                $scope.describeObject('Product2');
                $scope.getFieldSetsByName('Product2');
            }
            $scope.getObjectPicklistsByName('Product2');
        };
        $scope.init();
    }
]);

},{}],3:[function(require,module,exports){
angular.module('productdetails')
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
                    if (att[$scope.nsp + 'IsDefaultImage__c']) {
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

},{}],4:[function(require,module,exports){
angular.module('productdetails')
.directive('vlocObjField', [function() {
    return {
        scope: {
            displayMode: '=',
            parentObj: '=',
            field: '=',
            fieldInfo: '=',
            objPicklists: '='
        },
        replace: true,
        restrict: 'E',
        templateUrl: 'ObjectField.tpl.html'
    };
}]);

},{}],5:[function(require,module,exports){
angular.module("productdetails").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("ImageCarousel.tpl.html",'<div class="vloc-img-carousel">\n\t<div class="carousel">\n\t\t<div class="carousel-inner">\n\t\t\t<img ng-src="{{currentImg[nsp+\'UrlLong__c\']}}" class="carousel-img" alt="{{currentImg.Name}}" />\n\t\t</div>\n\t\t<div class="carousel-nav prev" ng-if="attachments.length > 1" ng-click="switchImage(currentIdx-1)">\n\t\t\t<span class="glyphicon icon-v-left-caret"></span>\n\t\t</div>\n\t\t<div class="carousel-nav next" ng-if="attachments.length > 1" ng-click="switchImage(currentIdx+1)">\n\t\t\t<span class="glyphicon icon-v-right-caret"></span>\n\t\t</div>\n\t</div>\n\t<div class="img-nav">\n\t\t<ul class="thumbnails" ng-if="attachments.length > 1">\n\t\t\t<li ng-repeat="attachment in attachments" ng-class="{\'active\': ($index === currentIdx)}" ng-click="switchImage($index)">\n\t\t\t\t<img ng-src="{{attachment[nsp+\'UrlLong__c\']}}" class="thumb" alt="{{attachment.Name}}" />\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n</div>'),$templateCache.put("ObjectField.tpl.html",'<div class="vloc-obj-field">\n    <!-- VIEW FIELD -->\n    <span ng-if="displayMode === \'view\'" ng-switch="fieldInfo.type">\n        <span ng-switch-when="BOOLEAN">\n            <input type="checkbox" name="{{fieldInfo.label}}" id="{{fieldInfo.label}}" ng-model="parentObj[field.fieldPath]" disabled="disabled" />\n        </span>\n        <span ng-switch-when="DATE">\n            {{parentObj[field.fieldPath] | date:\'mediumDate\'}}\n        </span>\n        <span ng-switch-default="default">\n            {{parentObj[field.fieldPath]}}\n        </span>\n    </span>\n    <!-- EDIT FIELD -->\n    <span ng-if="displayMode === \'edit\'" ng-switch="fieldInfo.type">\n        <span ng-switch-when="BOOLEAN">\n            <input type="checkbox" name="{{fieldInfo.label}}" id="{{fieldInfo.label}}" ng-model="parentObj[field.fieldPath]" />\n        </span>\n        <span ng-switch-when="DATE">\n            <input type="text" class="form-control"\n                name="{{fieldInfo.label}}"\n                id="{{fieldInfo.label}}"\n                ng-model="parentObj[field.fieldPath]"\n                bs-datepicker="true"\n                data-date-type="number"\n                data-autoclose="true"\n                data-icon-left="glyphicon icon-v-left-caret"\n                data-icon-right="glyphicon icon-v-right-caret" />\n        </span>\n        <span ng-switch-when="PICKLIST">\n            <select name="{{fieldInfo.label}}" id="{{fieldInfo.label}}" ng-model="parentObj[field.fieldPath]" class="form-control">\n                <option ng-repeat="o in objPicklists" value="{{o.value}}" ng-selected="o.value === parentObj[field.fieldPath]">{{o.label}}</option>\n            </select>\n        </span>\n        <span ng-switch-when="TEXTAREA">\n            <textarea name="{{fieldInfo.label}}" id="{{fieldInfo.label}}" ng-model="parentObj[field.fieldPath]" class="form-control"></textarea>\n        </span>\n        <span ng-switch-default="default">\n            <input type="text" name="{{fieldInfo.label}}" id="{{fieldInfo.label}}" ng-model="parentObj[field.fieldPath]" ng-readonly="!field.isCreateable" class="form-control" />\n        </span>\n    </span>\n</div>')}]);
},{}]},{},[1]);

})();
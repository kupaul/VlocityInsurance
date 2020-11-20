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
angular.module('browseCatalog', ['vlocity', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'mgcrea.ngStrap.alert', 'mgcrea.ngStrap.popover', 'mgcrea.ngStrap.datepicker', 'mgcrea.ngStrap.timepicker'])
.config(['remoteActionsProvider', function(remoteActionsProvider) {
	remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'RootCatalogs.tpl.html',
		controller: 'RootCatalogController',
		controllerAs: 'rootCatalogCtrl'
	})
	.when('/:parentCatalogId/:catalogId', {
		templateUrl: 'Catalogs.tpl.html',
		controller: 'CatalogController',
		controllerAs: 'catalogCtrl'
	})
	.when('/:parentCatalogId/:catalogId/products', {
		templateUrl: 'Products.tpl.html',
		controller: 'ProductController',
		controllerAs: 'prodCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

require('./modules/browseCatalog/controller/BrowseCatalogController.js');
require('./modules/browseCatalog/controller/RootCatalogController.js');
require('./modules/browseCatalog/controller/CatalogController.js');
require('./modules/browseCatalog/controller/ProductController.js');
require('./modules/browseCatalog/directive/Catalog.js');
require('./modules/browseCatalog/directive/CatalogHierarchy.js');
require('./modules/browseCatalog/directive/Product.js');
require('./modules/browseCatalog/factory/BrowseCatalogService.js');
require('./modules/browseCatalog/templates/templates.js');
},{"./modules/browseCatalog/controller/BrowseCatalogController.js":2,"./modules/browseCatalog/controller/CatalogController.js":3,"./modules/browseCatalog/controller/ProductController.js":4,"./modules/browseCatalog/controller/RootCatalogController.js":5,"./modules/browseCatalog/directive/Catalog.js":6,"./modules/browseCatalog/directive/CatalogHierarchy.js":7,"./modules/browseCatalog/directive/Product.js":8,"./modules/browseCatalog/factory/BrowseCatalogService.js":9,"./modules/browseCatalog/templates/templates.js":10}],2:[function(require,module,exports){
angular.module('browseCatalog')
.controller('BrowseCatalogController', ['$scope', '$rootScope', 'catalogService', 'remoteActions',
	function ($scope, $rootScope, catalogService, remoteActions) {
		$scope.nsPrefix = nsPrefix;
		$scope.logoUrl = logoUrl;

		$scope.collapseContext = true;

		$scope.isLoading = false;
		$scope.$on('showLoadingScreen', function() {
			$scope.isLoading = true;
		});
		$scope.$on('hideLoadingScreen', function() {
			$scope.isLoading = false;
		});

		$scope.showIneligibleItems = false;
		$scope.$watch('showIneligibleItems', function(value) {
			$rootScope.$broadcast('toggleIneligibleItems', value);
			catalogService.setIneligibleItems(value);
		}, true);

		// cart items
		$scope.cartQty = 0;
		$scope.$on('updateCartQty', function() {
			$scope.updateCartQty();
		});
		$scope.updateCartQty = function() {
			var count = 0;
			angular.forEach(catalogService.getCartItems(), function(item) {
				if (item.indent === 0)
					count++;
			});
			$scope.cartQty = count;
		};
		$scope.gotoOrder = function() {
			if ($scope.cartQty > 0) {
				var orderId = catalogService.getOrderId();
				var orderURL = location.protocol + '//' + location.hostname + '/' + orderId;
				window.location.href = orderURL;
			}
		};
		$scope.updateCartQty();

		// get contexts
		remoteActions.getContextValues().then(function(results) {
			console.log('contextValues: ', results);
			$scope.contexts = [];
			var selectedContext = {};
			for (var key in results) {
				var idx = key.indexOf(' : ');
				var contextKey = key.substring(0, idx);
				var name = key.substring(idx + 3);
				var values = results[key];
				var selectedValue = (values.length === 0 ? null : values[0]);
				var context = {
					name: name,
					key: contextKey,
					selectedValue: selectedValue,
					values: values
				};
				$scope.contexts.push(context);
				selectedContext[contextKey] = selectedValue;
			}
			catalogService.setContexts($scope.contexts);
			catalogService.setSelectedContext(selectedContext);
			$rootScope.$broadcast('refreshRootCatalogs');
		});

		$scope.setContext = function(context, value) {
			context.selectedValue = value;

			var selectedContext = {};
			angular.forEach($scope.contexts, function(ctx) {
				selectedContext[ctx.key] = ctx.selectedValue;
			});
			catalogService.setSelectedContext(selectedContext);

			// refresh the catalog list
			if (catalogService.getRootCatalogId() === '')
				$rootScope.$broadcast('refreshRootCatalogs');
			else
				$rootScope.$broadcast('refreshCatalogs');
		};

		$scope.$on('refreshContexts', function(event) {
			$scope.contexts = catalogService.getContexts();
		});

		// filters
		$scope.filters = DFFilters;
		catalogService.setFilters(DFFilters);
		var selectedFilters = [];
		angular.forEach($scope.filters, function(filter) {
			if (filter.checked)
				selectedFilters.push(filter.name);
		});
		catalogService.setSelectedFilters(selectedFilters);

		$scope.setFilter = function() {
			var selectedFilters = [];
			angular.forEach($scope.filters, function(filter) {
				if (filter.checked)
					selectedFilters.push(filter.name);
			});
			catalogService.setSelectedFilters(selectedFilters);

			// refresh the catalog list
			if (catalogService.getRootCatalogId() === '')
				$rootScope.$broadcast('refreshRootCatalogs');
			else
				$rootScope.$broadcast('refreshCatalogs');
		};
	}
]);

},{}],3:[function(require,module,exports){
angular.module('browseCatalog')
.controller('CatalogController', ['$scope', '$rootScope', '$routeParams', 'remoteActions', 'catalogService', '$location', '$alert',
	function($scope, $rootScope, $routeParams, remoteActions, catalogService, $location, $alert) {
		$scope.nsPrefix = nsPrefix;
		$scope.parentCatalogId = $routeParams.parentCatalogId;
		$scope.catalogId = $routeParams.catalogId;
		$scope.rootCatalogId = catalogService.getRootCatalogId();
		if ($scope.rootCatalogId === '')
			$location.path('/');

		$scope.catalogs = [];
		$scope.catalogRows = [];
		$scope.catalogError = null;
		$scope.catalogAttachments = {};
		$scope.showIneligibleItems = catalogService.getIneligibleItems();
		$scope.ineligibleCatalogs = null;
		$scope.ineligibleCatalogList = [];
		$scope.ineligibleRows = [];

		$scope.$on('refreshCatalogs', function() {
			$scope.getChildCatalogs();
		});

		$scope.getChildCatalogs = function() {
			var context = catalogService.getSelectedContext();
			context.Time = Date.now();
			var contextString = JSON.stringify(context);
			console.log('context = ', contextString);
			var filters = catalogService.getSelectedFilters();
			console.log('filters = ', filters.join(', '));

			var catalog = {Id: $scope.catalogId};

			// get child catalogs
			remoteActions.getChildCatalogContext(catalog, filters, contextString).then(function(results) {
				console.log('childCatalogContext: ', results);
				$scope.catalogRows = [];
				$scope.catalogs = [];
				$scope.ineligibleCatalogs = null;

				if (results.length === 0) {
					$scope.catalogError = 'This catalog has no items given the current context. Please update the context and try again.';
				} else {
					$scope.catalogError = null;
					angular.forEach(results, function(catalog) {
						if (catalog !== null) {
							// get catalog attachments
							if ($scope.catalogAttachments[catalog.Id] === undefined) {
								remoteActions.getAttachments(catalog.Id).then(function(attachments) {
									$scope.catalogAttachments[catalog.Id] = attachments;
								});
							}

							catalog.objectUrl = location.protocol + '//' + location.hostname + '/' + catalog.Id;
							catalog.parentCatalogId = $scope.catalogId;
							$scope.catalogs.push(catalog);
						}
					});

					for (i = 0; i < $scope.catalogs.length; i += 3) {
						$scope.catalogRows.push($scope.catalogs.slice(i, i + 3));
					}
				}

				// get the ineligible items
				$scope.getIneligibleItems();
			});

			// create hierarchy and breadcrumbs
			remoteActions.getCatalogContext({Id: $scope.rootCatalogId}, filters, contextString).then(function(results) {
				catalogService.setSelectedCatalog($scope.parentCatalogId, $scope.catalogId);
				$scope.catalogHierarchy = catalogService.getCatalogHierarchy(results);
				console.log('hierarchy');
				console.log($scope.catalogHierarchy);
				$scope.catalogBreadcrumbs = catalogService.getBreadcrumbs($scope.parentCatalogId, $scope.catalogId);
			});
		};

		$scope.$on('toggleIneligibleItems', function(event, data) {
			$scope.showIneligibleItems = data;
			if ($scope.showIneligibleItems)
				$scope.getIneligibleItems();
		});

		$scope.getIneligibleItems = function() {
			if ($scope.ineligibleCatalogs === null) {
				var cat = {Id: $scope.catalogId};
				remoteActions.getChildCatalogs(cat).then(function(results) {
					console.log('catalog full: ', results);
					$scope.ineligibleCatalogList = [];
					angular.forEach(results, function(catalog) {
						// get catalog attachments
						if ($scope.catalogAttachments[catalog.Id] === undefined) {
							remoteActions.getAttachments(catalog.Id).then(function(attachments) {
								$scope.catalogAttachments[catalog.Id] = attachments;
							});
						}

						catalog.objectUrl = location.protocol + '//' + location.hostname + '/' + catalog.Id;
						catalog.parentCatalogId = $scope.catalogId;
						$scope.ineligibleCatalogList.push(catalog);
					});

					$scope.renderIneligibleItems();
				});
			} else {
				$scope.renderIneligibleItems();
			}
		};

		$scope.renderIneligibleItems = function() {
			$scope.ineligibleRows = [];
			if ($scope.showIneligibleItems) {
				var filteredIds = {};
				angular.forEach($scope.catalogs, function(c) {
					filteredIds[c.Id] = c;
				});
				$scope.ineligibleCatalogs = $scope.ineligibleCatalogList.filter(function(c) {
					return !(c.Id in filteredIds);
				});
				console.log('catalog inelig: ', $scope.ineligibleCatalogs);

				for (var i = 0; i < $scope.ineligibleCatalogs.length; i += 4) {
					$scope.ineligibleRows.push($scope.ineligibleCatalogs.slice(i, i + 4));
				}
			}
		};

		// fetch the list of child catalogs
		$scope.getChildCatalogs();
	}
]);

},{}],4:[function(require,module,exports){
angular.module('browseCatalog')
.controller('ProductController', ['$scope', '$routeParams', 'remoteActions', 'catalogService', '$location', '$http', '$alert', '$rootScope',
	function($scope, $routeParams, remoteActions, catalogService, $location, $http, $alert, $rootScope) {
		$scope.nsPrefix = nsPrefix;
		$scope.lblSearch = lblSearch;
		$scope.parentCatalogId = $routeParams.parentCatalogId;
		$scope.catalogId = $routeParams.catalogId;
		$scope.rootCatalogId = catalogService.getRootCatalogId();
		if ($scope.rootCatalogId === '')
			$location.path('/');

		$scope.productAttachments = {};
		$scope.products = {list:[], searchresults:[]};
		$scope.pricebookMap = {};
		$scope.productError = null;
		$scope.showIneligibleItems = catalogService.getIneligibleItems();
		$scope.ineligibleProducts = null;
		$scope.ineligibleProductList = [];
		$scope.ineligibleRows = [];

		$scope.idx = {
			attrval: {},
			attrname: {},
			attrtype: {},
			attrslider: {},
			attrdate: {}
		};

		$scope.searchfilter = {};
		$scope.filterValueText = {};
		$scope.filterValueSlider = {};
		$scope.filterValueDate = {};
		$scope.productsFilter = {
			hasResults: true,
			hasTextResults: true,
			hasSliderResults: true,
			hasDateResults: true
		};
		$scope.searchText = '';

		$scope.$on('refreshCatalogs', function() {
			$scope.getProducts();
		});

		$scope.getProducts = function() {
			var context = catalogService.getSelectedContext();
			context.Time = Date.now();
			var contextString = JSON.stringify(context);
			console.log('context = ', contextString);
			var filters = catalogService.getSelectedFilters();
			console.log('filters = ', filters.join(', '));

			var catalog = {Id: $scope.catalogId};

			// get products in catalog
			remoteActions.getProductsContext(catalog, filters, contextString).then(function(results) {
				console.log('products: ', results);
				if (results.length === 0) {
					$scope.productError = 'This catalog has no products given the current context. Please update the context and try again.';
					$scope.productRows = [];
				} else {
					$scope.productError = null;

					$scope.products = {list:[], searchresults:[]};
					var productList = [];
					angular.forEach(results, function(item) {
						item.objectUrl = location.protocol + '//' + location.hostname + '/' + item.Id;
						$scope.products.list.push(item);
						$scope.products.searchresults.push(item);
						productList.push({Id: item.Id});
						$scope.genIndexFromProd(item, true);

						// get product attachments
						if ($scope.productAttachments[item.Id] === undefined) {
							remoteActions.getAttachments(item.Id).then(function(attachments) {
								$scope.productAttachments[item.Id] = attachments;
							});
						}
					});

					// get product details
					remoteActions.getProductDetails(productList).then(function(results) {
						angular.forEach(results, function(item) {
							$scope.pricebookMap[item.Product2Id] = item;
						});
						catalogService.setPricebookMap($scope.pricebookMap);

						$scope.productRows = [];
						for (var i = 0; i < $scope.products.searchresults.length; i += 3) {
							$scope.productRows.push($scope.products.searchresults.slice(i, i + 3));
						}
					});

					// get the ineligible items
					$scope.getIneligibleItems(true);
				}
			});

			// create hierarchy and breadcrumbs
			remoteActions.getCatalogContext({Id: $scope.rootCatalogId}, filters, contextString).then(function(results) {
				catalogService.setSelectedCatalog($scope.parentCatalogId, $scope.catalogId);
				$scope.catalogHierarchy = catalogService.getCatalogHierarchy(results);
				console.log('hierarchy');
				console.log($scope.catalogHierarchy);
				$scope.catalogBreadcrumbs = catalogService.getBreadcrumbs($scope.parentCatalogId, $scope.catalogId);
			});

			// get an order id
			var orderId = catalogService.getOrderId();
			if (orderId === null) {
				forceTKClient.apexrest(
	                restUrl,
	                function(data, textStatus, jqXHR) {
	                    if (data.length > 0) {
	                    	var result = data[0].result;
	                    	if (result.length > 0) {
	                    		orderId = result[0].order;
	                    		console.log('ORDER ID: ' + orderId);
	                    		catalogService.setOrderId(orderId);
	                    	}
	                    }
	                },
	                function(jqXHR, textStatus, errorThrown) {
	                    console.error('REST Error for command "getAvailProducts" - ' + textStatus);
	                },
	                'POST',
	                JSON.stringify([{"command":"getAvailProducts"}]),
	                null,
	                false
	            );
			}
		};

		$scope.$on('toggleIneligibleItems', function(event, data) {
			$scope.showIneligibleItems = data;
			if ($scope.showIneligibleItems)
				$scope.getIneligibleItems();
		});

		$scope.getIneligibleItems = function() {
			if ($scope.ineligibleProducts === null) {
				var cat = {Id: $scope.catalogId};
				remoteActions.getProducts(cat).then(function(results) {
					console.log('product full: ', results);
					$scope.ineligibleProductList = [];
					var productList = [];
					angular.forEach(results, function(item) {
						// get catalog attachments
						if ($scope.productAttachments[item.Id] === undefined) {
							remoteActions.getAttachments(item.Id).then(function(attachments) {
								$scope.productAttachments[item.Id] = attachments;
							});
						}

						item.objectUrl = location.protocol + '//' + location.hostname + '/' + item.Id;
						$scope.ineligibleProductList.push(item);
						productList.push({Id: item.Id});
					});

					// get product details
					remoteActions.getProductDetails(productList).then(function(results) {
						angular.forEach(results, function(item) {
							$scope.pricebookMap[item.Product2Id] = item;
						});
						catalogService.setPricebookMap($scope.pricebookMap);

						$scope.renderIneligibleItems();
					});
				});
			} else {
				$scope.renderIneligibleItems();
			}
		};

		$scope.renderIneligibleItems = function() {
			$scope.ineligibleRows = [];
			if ($scope.showIneligibleItems) {
				var filteredIds = {};
				angular.forEach($scope.products.list, function(p) {
					filteredIds[p.Id] = p;
				});
				$scope.ineligibleProducts = $scope.ineligibleProductList.filter(function(p) {
					return !(p.Id in filteredIds);
				});
				console.log('product inelig: ', $scope.ineligibleProducts);

				for (var i = 0; i < $scope.ineligibleProducts.length; i += 3) {
					$scope.ineligibleRows.push($scope.ineligibleProducts.slice(i, i + 3));
				}
			}
		};

		// fetch the products
		$scope.getProducts();

		$scope.$watch('products', function(productList) {
			$scope.productRows = [];
			for (var i = 0; i < productList.searchresults.length; i += 3) {
				$scope.productRows.push(productList.searchresults.slice(i, i + 3));
			}
		}, true);

		/* parse the attributes */
		$scope.parseAttributes = function(attrs) {
			angular.forEach(attrs, function(attr) {
				attr.Name = attr.attributedisplayname__c;
				attr.Code = attr.attributeuniquecode__c;
				attr.Filterable = attr.attributefilterable__c;
				attr.SegmentValue = '';
				var tempSegmentList = [];

				if (attr.attributeRunTimeInfo && attr.attributeRunTimeInfo.dataType) {
					if (attr.attributeRunTimeInfo.dataType === 'Text' || attr.attributeRunTimeInfo.dataType === 'Number' || attr.attributeRunTimeInfo.dataType === 'Currency' || attr.attributeRunTimeInfo.dataType === 'Percent') {
						// TEXT, NUMBER, CURRENCY, PERCENT
						if (attr.attributeRunTimeInfo.value === undefined) {
							attr.attributeRunTimeInfo.value = attr.attributeRunTimeInfo.default;
						}
						attr.SegmentValue = attr.attributeRunTimeInfo.value;
					}
					if (attr.attributeRunTimeInfo.dataType === 'Date' || attr.attributeRunTimeInfo.dataType === 'Datetime') {
						// DATE, DATETIME
						if (attr.attributeRunTimeInfo.value === undefined) {
							attr.attributeRunTimeInfo.value = attr.attributeRunTimeInfo.default;
						}
						var dateFormat = (attr.attributeRunTimeInfo.dataType === 'Date' ? 'shortDate' : 'short');
						attr.SegmentValue = $filter('date')(attr.attributeRunTimeInfo.value, dateFormat);
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
						if (attr.attributeRunTimeInfo.selectedItem === undefined) {
							if (attr.attributeRunTimeInfo.default !== undefined && attr.attributeRunTimeInfo.default.length > 0)
								selectedId = attr.attributeRunTimeInfo.default[0].id;
						} else {
							selectedId = attr.attributeRunTimeInfo.selectedItem.id;
						}
						angular.forEach(attr.attributeRunTimeInfo.values, function(value) {
							if (value.id === selectedId) {
								attr.attributeRunTimeInfo.selectedItem = value;
								attr.SegmentValue = value.displayText;
							}
							tempSegmentList.push(value.displayText);
						});
						//attr.SegmentValue = tempSegmentList.join(',');
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

		// helper to index product by attribute to search/filter
		$scope.genIndexFromProd = function(p, bInit) {
			var jsonAttribute = p[nsPrefix+'JSONAttribute__c'];
			// get attribute json from Product
			if (jsonAttribute) {
				var alist = [];
				if (!p.isAttrParsed) {
					jsonAttribute = JSON.parse(jsonAttribute);
					p.isAttrParsed = true;
				}

				for (var cat in jsonAttribute) {
					var attrs = jsonAttribute[cat];
					// parse the attributes
					$scope.parseAttributes(attrs);
					alist = alist.concat(attrs);
				}

				angular.forEach(alist, function(i) {
					if (i.SegmentValue && i.Filterable) { // if an attribute has value & if an attribute is filterable
						var arr = i.SegmentValue.split(','); // split the attribute list

						var type = 'default';
						if (i.attributeRunTimeInfo.dataType === 'Text')
							type = 'text';
						if (i.attributeRunTimeInfo.dataType === 'Number' || i.attributeRunTimeInfo.dataType === 'Currency' || i.attributeRunTimeInfo.dataType === 'Percent')
							type = 'slider';
						if (i.attributeRunTimeInfo.dataType === 'Date' || i.attributeRunTimeInfo.dataType === 'Datetime')
							type = 'date';
						$scope.idx.attrtype[i.Name+'|'+i.Code] = type;

						// set up min/max values for slider
						var minVal = 0;
						var maxVal = 100;
						if (type === 'slider') {
							if ($scope.idx.attrslider[i.Name+'|'+i.Code] === undefined) {
								if (i.attributeRunTimeInfo.dataType === 'Percent') {
									$scope.idx.attrslider[i.Name+'|'+i.Code] = {min: 0, max: 100, type: i.attributeRunTimeInfo.dataType, active: false};
								} else if (i.attributeRunTimeInfo.dataType === 'Number' || i.attributeRunTimeInfo.dataType === 'Currency') {
									$scope.idx.attrslider[i.Name+'|'+i.Code] = {min: null, max: null, type: i.attributeRunTimeInfo.dataType, active: false};
								}
							}
						}

						// set up min/max values for date
						if (type === 'date') {
							if ($scope.idx.attrdate[i.Name+'|'+i.Code] === undefined) {
								$scope.idx.attrdate[i.Name+'|'+i.Code] = {min: null, max: null, from: null, to: null, type: i.attributeRunTimeInfo.dataType, active: false};
							}
						}

						angular.forEach(arr, function(a) {
							// for each attribute Name:Value combination, add the Product to the array
							if (!$scope.idx.attrval[i.Code+'|'+a])
								$scope.idx.attrval[i.Code+'|'+a] = [];

							$scope.idx.attrval[i.Code+'|'+a].push(p); // attrCode:val -> Product hash array

							if (bInit) {
								// if bInit, then the UI state of this attribute is defaulted to show:true,Select:false
								$scope.searchfilter[i.Code+'|'+a] = {show: true, state: false};
							}

							// attrName:Code -> Product hash array to differentiate attributes of same Name
							if (!$scope.idx.attrname[i.Name+'|'+i.Code])
								$scope.idx.attrname[i.Name+'|'+i.Code] = [];

							var keyfound = false;
							angular.forEach($scope.idx.attrname[i.Name+'|'+i.Code], function(v) {
								if (v === (i.Code+'|'+a))
									keyfound = true;
							});
							if (!keyfound) {
								$scope.idx.attrname[i.Name+'|'+i.Code].push(i.Code+'|'+a);
							}

							// set up min/max values for slider
							if (type === 'slider') {
								if (i.attributeRunTimeInfo.dataType === 'Number' || i.attributeRunTimeInfo.dataType === 'Currency') {
									var num = parseInt(a, 10);

									if ($scope.idx.attrslider[i.Name+'|'+i.Code].min === null) {
										$scope.idx.attrslider[i.Name+'|'+i.Code].min = num;
									} else if (num < $scope.idx.attrslider[i.Name+'|'+i.Code].min) {
										$scope.idx.attrslider[i.Name+'|'+i.Code].min = num;
									}

									if ($scope.idx.attrslider[i.Name+'|'+i.Code].max === null) {
										$scope.idx.attrslider[i.Name+'|'+i.Code].max = num;
									} else if (num > $scope.idx.attrslider[i.Name+'|'+i.Code].max) {
										$scope.idx.attrslider[i.Name+'|'+i.Code].max = num;
									}
								}
							}

							// set up min/max values for date
							if (type === 'date') {
								var aDate = new Date(a);

								if ($scope.idx.attrdate[i.Name+'|'+i.Code].min === null) {
									$scope.idx.attrdate[i.Name+'|'+i.Code].from = aDate;
									$scope.idx.attrdate[i.Name+'|'+i.Code].min = a;
								} else if (aDate < (new Date($scope.idx.attrdate[i.Name+'|'+i.Code].min))) {
									$scope.idx.attrdate[i.Name+'|'+i.Code].from = aDate;
									$scope.idx.attrdate[i.Name+'|'+i.Code].min = a;
								}

								if ($scope.idx.attrdate[i.Name+'|'+i.Code].max === null) {
									$scope.idx.attrdate[i.Name+'|'+i.Code].to = aDate;
									$scope.idx.attrdate[i.Name+'|'+i.Code].max = a;
								} else if (aDate > (new Date($scope.idx.attrdate[i.Name+'|'+i.Code].max))) {
									$scope.idx.attrdate[i.Name+'|'+i.Code].to = aDate;
									$scope.idx.attrdate[i.Name+'|'+i.Code].max = a;
								}
							}
						});
					}
				});

				if (bInit) {
					var key;

					// set up min/max values for slider
					for (key in $scope.idx.attrslider) {
						$scope.filterValueSlider[key] = {
							min: $scope.idx.attrslider[key].min,
							max: $scope.idx.attrslider[key].max
						};
					}

					// set up min/max values for date
					for (key in $scope.idx.attrdate) {
						if ($scope.idx.attrdate[key].type === 'Datetime') {
							$scope.idx.attrdate[key].min = $scope.idx.attrdate[key].min.split(' ')[0];
						}

						$scope.filterValueDate[key] = {
							from: $scope.idx.attrdate[key].from,
							to: $scope.idx.attrdate[key].to
						};
					}
				}
			}
		};

		$scope.searchFunc = function(item) {
			var strToMatch = item.Name;
			if (item.Product2 && item.Product2.Description)
				strToMatch += ' ' + item.Product2.Description;
			strToMatch = strToMatch.toLowerCase();
			var matchArr = strToMatch.match($scope.searchText.toLowerCase());
			if (matchArr && matchArr.length > 0) {
				$scope.genIndexFromProd(item, false);
				return true;
			}
			return false;
		};

		$scope.$watch('searchfilter', function(filterarr) {
			var temp = {}, parr;
			var dofilter = false;
			$scope.isProductsLoading = true;
			angular.forEach(filterarr, function(fv, k) {
				dofilter = dofilter || fv.state;
			});

			$scope.products.searchresults = [];
			if (!dofilter && $scope.productsFilter.hasResults) {
				angular.forEach($scope.products.list, function(i) {
					$scope.products.searchresults.push(i);
				});
				$scope.isProductsLoading = false;
				return;
			}
			angular.forEach(filterarr, function(fv, k) {
				// for each flag true, get all product s& add to searchresults
				if(fv.state) {
					parr = $scope.idx.attrval[k];
					angular.forEach(parr, function(p) {
						if (!temp[p.Product2Id]) {
							$scope.products.searchresults.push(p);
							temp[p.Product2Id] = true;
						}
					});
				}
			});

			$scope.isProductsLoading = false;
		}, true);

		$scope.$watch('searchText', function(newSearchVal) {
			/*$scope.idx.attrval = {};
			$scope.idx.attrname = {};
			$scope.idx.attrtype = {};
			$scope.idx.attrslider = {};
			$scope.idx.attrdate = {};*/

			var productList = [];
			angular.forEach($scope.products.list, function(item) {
				if($scope.searchFunc(item)) {
					productList.push(item);
				}
			});
			$scope.products.searchresults = productList;
		}, true);

		$scope.filterByAttrText = function(key, items) {
			var value = $scope.filterValueText[key].toLowerCase();
			var resultCount = 0;
			angular.forEach(items, function(item) {
				var itemVal = item.split('|')[1];
				var match = (itemVal.toLowerCase().indexOf(value) !== -1);
				if (match) {
					resultCount++;
				}
				$scope.searchfilter[item].state = (value === '' ? false : match);
			});
			$scope.productsFilter.hasTextResults = (value === '' ? true : (resultCount > 0));
		};

		$scope.$watch('productsFilter.hasTextResults', function(newValue) {
			$scope.productsFilter.hasResults = newValue && $scope.productsFilter.hasSliderResults && $scope.productsFilter.hasDateResults;
		});

		$scope.filterByAttrSlider = function(key, items, updateValues) {
			if ($scope.idx.attrslider[key].active) {
				var minVal = $scope.filterValueSlider[key].min;
				var maxVal = $scope.filterValueSlider[key].max;
				var resultCount = 0;
				angular.forEach(items, function(item) {
					var itemVal = parseInt(item.split('|')[1], 10);
					var match = (minVal <= itemVal && itemVal <= maxVal);
					if (match) {
						resultCount++;
					}
					$scope.searchfilter[item].state = match;
				});
				$scope.productsFilter.hasSliderResults = (resultCount > 0);

				if (updateValues) {
					$scope.$apply();
				}
			} else {
				angular.forEach(items, function(item) {
					$scope.searchfilter[item].state = false;
				});
				$scope.productsFilter.hasSliderResults = true;
			}
		};

		$scope.$watch('productsFilter.hasSliderResults', function(newValue) {
			$scope.productsFilter.hasResults = $scope.productsFilter.hasTextResults && newValue && $scope.productsFilter.hasDateResults;
		});

		$scope.filterByAttrDate = function(key, items) {
			if ($scope.idx.attrdate[key].active) {
				var minDate = new Date($scope.idx.attrdate[key].min);
				var maxDate = new Date($scope.idx.attrdate[key].max);

				if ($scope.filterValueDate[key].from === undefined)
					$scope.filterValueDate[key].from = $scope.idx.attrdate[key].from;
				var fromDate = $scope.filterValueDate[key].from;

				if ($scope.filterValueDate[key].to === undefined)
					$scope.filterValueDate[key].to = $scope.idx.attrdate[key].to;
				var toDate = $scope.filterValueDate[key].to;

				var resultCount = 0;
				angular.forEach(items, function(item) {
					var itemVal = item.split('|')[1];
					var itemDate = new Date(itemVal);
					var match = (fromDate <= itemDate && itemDate <= toDate);
					if (match) {
						resultCount++;
					}
					$scope.searchfilter[item].state = match;
				});
				$scope.productsFilter.hasDateResults = (resultCount > 0);
			} else {
				angular.forEach(items, function(item) {
					$scope.searchfilter[item].state = false;
				});
				$scope.productsFilter.hasDateResults = true;
			}
		};

		$scope.$watch('productsFilter.hasDateResults', function(newValue) {
			$scope.productsFilter.hasResults = $scope.productsFilter.hasTextResults && $scope.productsFilter.hasSliderResults && newValue;
		});

		$scope.isEmptyObject = function(obj) {
			return j$.isEmptyObject(obj);
		};
	}
]);

},{}],5:[function(require,module,exports){
angular.module('browseCatalog')
.controller('RootCatalogController', ['$scope', '$rootScope', 'remoteActions', '$location', 'catalogService',
	function ($scope, $rootScope, remoteActions, $location, catalogService) {
		$scope.nsPrefix = nsPrefix;
		$scope.rootCatalogs = [];
		$scope.catalogRows = [];
		$scope.catalogMap = {};
		$scope.rootCatalogAttachments = {};
		$scope.showIneligibleItems = catalogService.getIneligibleItems();
		$scope.ineligibleCatalogs = null;
		$scope.ineligibleCatalogList = [];
		$scope.ineligibleRows = [];

		$scope.$on('refreshRootCatalogs', function() {
			$scope.getRootCatalogs();
		});

		$scope.getRootCatalogs = function() {
			catalogService.setRootCatalogId('');

			var context = catalogService.getSelectedContext('catalog');
			context.Time = Date.now();
			var contextString = JSON.stringify(context);
			console.log('context = ', contextString);
			var filters = catalogService.getSelectedFilters();
			console.log('filters = ', filters.join(', '));

			remoteActions.getRootCatalogsContext(filters, contextString).then(function(catalogs) {
				console.log('rootCatalogs: ', catalogs);
				$scope.rootCatalogs = [];
				angular.forEach(catalogs, function(catalog) {
					// get catalog attachments
					if ($scope.rootCatalogAttachments[catalog.Id] === undefined) {
						remoteActions.getAttachments(catalog.Id).then(function(attachments) {
							$scope.rootCatalogAttachments[catalog.Id] = attachments;
						});
					}

					catalog.objectUrl = location.protocol + '//' + location.hostname + '/' + catalog.Id;
					catalog.parentCatalogId = catalog.Id;
					$scope.rootCatalogs.push(catalog);
				});

				$scope.catalogRows = [];
				for (var i = 0; i < $scope.rootCatalogs.length; i += 3) {
					$scope.catalogRows.push($scope.rootCatalogs.slice(i, i + 3));
				}

				// get the ineligible items
				$scope.getIneligibleItems();
			});
		};

		$scope.$on('toggleIneligibleItems', function(event, data) {
			$scope.showIneligibleItems = data;
			if ($scope.showIneligibleItems)
				$scope.getIneligibleItems();
		});

		$scope.getIneligibleItems = function() {
			if ($scope.ineligibleCatalogs === null) {
				remoteActions.getRootCatalogs().then(function(results) {
					console.log('root full: ', results);
					$scope.ineligibleCatalogList = [];
					angular.forEach(results, function(catalog) {
						// get catalog attachments
						if ($scope.rootCatalogAttachments[catalog.Id] === undefined) {
							remoteActions.getAttachments(catalog.Id).then(function(attachments) {
								$scope.rootCatalogAttachments[catalog.Id] = attachments;
							});
						}

						catalog.objectUrl = location.protocol + '//' + location.hostname + '/' + catalog.Id;
						catalog.parentCatalogId = catalog.Id;
						$scope.ineligibleCatalogList.push(catalog);

						// get catalog details
						remoteActions.getCatalog({Id: catalog.Id}).then(function(results) {
							console.log('rootCatalog details: ', results);
							var rootNode = {};
							var catalogMap = {};
							if (results.length > 1) {
								angular.forEach(results, function(c) {
									if (c.Id === catalog.Id) {
										rootNode = c;
									} else {
										c.isCollapsed = true;
									}
									catalogMap[c.Id] = c;
								});
							} else if (results.length === 1) {
								rootNode = results[0];
								catalogMap[rootNode.Id] = rootNode;
							}

							var masterCatalog = catalogService.getMasterCatalog(catalog.Id);
							if (masterCatalog === undefined) {
								catalogService.setMasterCatalog(catalog.Id, {catalogNode: rootNode, catalogMap: catalogMap});
							}
						});
					});

					$scope.renderIneligibleItems();
				});
			} else {
				$scope.renderIneligibleItems();
			}
		};

		$scope.renderIneligibleItems = function() {
			$scope.ineligibleRows = [];
			if ($scope.showIneligibleItems) {
				var filteredIds = {};
				angular.forEach($scope.rootCatalogs, function(c) {
					filteredIds[c.Id] = c;
				});
				$scope.ineligibleCatalogs = $scope.ineligibleCatalogList.filter(function(c) {
					return !(c.Id in filteredIds);
				});
				console.log('root inelig: ', $scope.ineligibleCatalogs);

				for (var i = 0; i < $scope.ineligibleCatalogs.length; i += 3) {
					$scope.ineligibleRows.push($scope.ineligibleCatalogs.slice(i, i + 3));
				}
			}
		};

		// fetch the list of root catalogs
		if (catalogService.getContexts() !== null)
			$scope.getRootCatalogs();
	}
]);

},{}],6:[function(require,module,exports){
angular.module('browseCatalog')
.directive('catalog', ['catalogService', '$location', '$alert',
	function(catalogService, $location, $alert) {
	    return {
	        scope: {
	        	catalog: '=node',
	        	root: '=',
	        	ineligible: '=',
	        	attachments: '='
	        },
	        replace: true,
	        restrict: 'E',
	        templateUrl: 'Catalog.tpl.html',
	        controller: function($scope) {
	        	$scope.nsPrefix = nsPrefix;

	        	$scope.browseCatalog = function(parentCatalogId, catalogId) {
	        		if (!$scope.ineligible) {
		        		var rootCatalogId;
		        		if ($scope.root) {
							rootCatalogId = catalogId;
							catalogService.setRootCatalogId(rootCatalogId); // set the root catalog id
		        		} else {
							rootCatalogId = catalogService.getRootCatalogId(); // get the root catalog id
		        		}

		        		var masterCatalog = catalogService.getMasterCatalog(rootCatalogId);
						var catalogNode = masterCatalog.catalogMap[catalogId];
						if (catalogNode === undefined || catalogNode[nsPrefix+'ParentCatalogRelationships__r']) {
							$location.path('/' + parentCatalogId + '/' + catalogId);
						} else if (catalogNode[nsPrefix+'CatalogProductRelationships__r']) {
							$location.path('/' + parentCatalogId + '/' + catalogId + '/products');
						} else {
							$alert({title: 'This catalog has no items given the current context. Please update the context and try again.', content: '', placement: 'top', type: 'warning', duration: 4, show: true});
						}
					}
	        	};
	        }
	    };
	}
]);
},{}],7:[function(require,module,exports){
angular.module('browseCatalog')
.directive('catalogHierarchy', ['catalogService', '$location',
	function(catalogService, $location) {
	    return {
	        scope: {
	        	node: '='
	        },
	        replace: true,
	        restrict: 'E',
	        templateUrl: 'CatalogHierarchy.tpl.html',
	        controller: function($scope) {
	        	$scope.browseCatalog = function(parentCatalogId, catalogId) {
	        		var rootCatalogId = catalogService.getRootCatalogId();
					var masterCatalog = catalogService.getMasterCatalog(rootCatalogId);
					var catalogNode = masterCatalog.catalogMap[catalogId];
					if (catalogNode === undefined || catalogNode[nsPrefix+'ParentCatalogRelationships__r']) {
						$location.path('/' + parentCatalogId + '/' + catalogId);
					} else {
						$location.path('/' + parentCatalogId + '/' + catalogId + '/products');
					}
	        	};
	        }
	    };
	}
]);
},{}],8:[function(require,module,exports){
angular.module('browseCatalog')
.directive('product', ['catalogService', '$location', '$alert', '$rootScope',
	function(catalogService, $location, $alert, $rootScope) {
	    return {
	        scope: {
	        	product: '=node',
	        	ineligible: '=',
	        	attachments: '='
	        },
	        replace: true,
	        restrict: 'E',
	        templateUrl: 'Product.tpl.html',
	        controller: function($scope) {
	        	$scope.nsPrefix = nsPrefix;
	        	$scope.lblAddToCart = lblAddToCart;
	        	$scope.pricebookMap = catalogService.getPricebookMap();

	        	$scope.addItemToCart = function(productId, productName) {
					// show the loading screen
					catalogService.showLoadingScreen(true);

					var orderId = catalogService.getOrderId();
					var pricebookEntryId = $scope.pricebookMap[productId].Id;
					console.log('REST CALL: ' + restUrl+'/'+orderId);
					console.log('[{"command":"addItemToOrder","priceBookEntryId":"'+pricebookEntryId+'"}]');
					forceTKClient.apexrest(
		                restUrl+'/'+orderId,
		                function(data, textStatus, jqXHR) {
		                    // hide the loading screen
							catalogService.showLoadingScreen(false);

							if (data.length > 0) {
		                    	var result = data[0].result;
		                    	if (result.length === 0) {
		                    		// show alert
		                    		$alert({title: 'There was an error while adding the item to the cart. Please try again later.', content: '', placement: 'top', type: 'warning', duration: 4, show: true});
		                    	}
		                    	if (result.length > 0) {
		                    		// show alert
		                    		$alert({title: productName+' has been added to the cart!', content: '', placement: 'top', type: 'info', duration: 4, show: true});

		                    		// update cart items
		                    		var cartItems = [];
		                    		angular.forEach(result, function(item) {
		                    			if (item.itemSObject !== undefined) {
		                    				cartItems.push(item);
		                    			}
		                    		});
		                    		catalogService.setCartItems(cartItems);
		                    		$rootScope.$broadcast('updateCartQty');
		                    	}
		                    }
		                },
		                function(jqXHR, textStatus, errorThrown) {
		                    console.error('REST Error for command "addItemToOrder" - ' + textStatus);
		                },
		                'POST',
		                JSON.stringify([{"command":"addItemToOrder","priceBookEntryId":pricebookEntryId+""}]),
		                null,
		                false
		            );
				};
	        }
	    };
	}
]);
},{}],9:[function(require,module,exports){
angular.module('browseCatalog').factory('catalogService', ['$rootScope',
	function($rootScope) {
		var contexts = null;
		var selectedContext = {};
		var filters = [];
		var selectedFilters = [];
		var masterCatalog = {};
		var rootCatalogId = '';
		var selectedCatalog = {};
		var catalogHierarchy = [];
		var breadcrumbsMap = {};
		var orderId = null;
		var cartItems = [];
		var showIneligibleItems = false;
		var pricebookMap = {};

		function createCatalogHierarchy(catalogs) {
			var rootCatalog = {};
			var catalogMap = {};
			angular.forEach(catalogs, function(c) {
				if (c.Id === rootCatalogId) {
					rootCatalog.Id = c.Id;
					rootCatalog.Name = c.Name;
					rootCatalog[nsPrefix+'ParentCatalogRelationships__r'] = c[nsPrefix+'ParentCatalogRelationships__r'];
				} else {
					catalogMap[c.Id] = c;
				}
			});

			rootCatalog.isRoot = true;
			rootCatalog.isExpanded = true;
			rootCatalog.level = 1;
			setCatalogChildren(catalogMap, rootCatalog, 2);
			catalogHierarchy[0] = rootCatalog;
		}

		function setCatalogChildren(catalogMap, parentCatalog, level) {
			var children = [];
			var childrenFound = false;
			angular.forEach(parentCatalog[nsPrefix+'ParentCatalogRelationships__r'], function(childNode) {
				var cat = {};
				var catalog = catalogMap[childNode[nsPrefix+'ChildCatalogId__r'].Id];
				if (catalog !== undefined) {
					cat.Id = catalog.Id;
					cat.parentCatalogId = parentCatalog.Id;
					cat.Name = catalog.Name;
					cat.level = level;
					cat[nsPrefix+'ParentCatalogRelationships__r'] = catalog[nsPrefix+'ParentCatalogRelationships__r'];

					var found = false;
					if (catalog.Id === selectedCatalog.catalogId && parentCatalog.Id === selectedCatalog.parentCatalogId) {
						found = true;
						childrenFound = true;
						parentCatalog.isExpanded = true;
					}

					var childFound = setCatalogChildren(catalogMap, cat, (level + 1));
					if (childFound) {
						found = true;
						childrenFound = true;
						parentCatalog.isExpanded = true;
					}
					cat.isExpanded = found;

					children.push(cat);
				}
			});
			parentCatalog.children = children;

			return childrenFound;
		}

		function createBreadcrumbs(parentCatalogId, catalogId) {
			var breadcrumbs = [];
			if (catalogHierarchy[0] !== undefined) {
				breadcrumbs.push({id: catalogHierarchy[0].Id, parentId: parentCatalogId, name: catalogHierarchy[0].Name});
				angular.forEach(catalogHierarchy[0].children, function(catalog) {
					if (catalog.isExpanded) {
						breadcrumbs.push({id: catalog.Id, parentId: catalog.parentCatalogId, name: catalog.Name});
						setBreadcumbs(catalog, breadcrumbs);
					}
				});
				breadcrumbsMap[parentCatalogId+':'+catalogId] = breadcrumbs;
			}
		}

		function setBreadcumbs(parentCatalog, breadcrumbs) {
			angular.forEach(parentCatalog.children, function(catalog) {
				if (catalog.isExpanded) {
					breadcrumbs.push({id: catalog.Id, parentId: parentCatalog.Id, name: catalog.Name});
					setBreadcumbs(catalog, breadcrumbs);
				}
			});
		}

		function setLoadingScreen(value) {
			if (value)
				$rootScope.$broadcast('showLoadingScreen');
			else
				$rootScope.$broadcast('hideLoadingScreen');
		}

		return {
			getContexts: function() {
				return contexts;
			},
			setContexts: function(value) {
				contexts = value;
			},
			getSelectedContext: function() {
				return selectedContext;
			},
			setSelectedContext: function(value) {
				selectedContext = value;
			},
			getFilters: function() {
				return filters;
			},
			setFilters: function(value) {
				filters = value;
			},
			getSelectedFilters: function() {
				return selectedFilters;
			},
			setSelectedFilters: function(value) {
				selectedFilters = value;
			},
			getMasterCatalog: function(key) {
				return masterCatalog[key];
			},
			setMasterCatalog: function(key, value) {
				masterCatalog[key] = value;
			},
			getRootCatalogId: function() {
				return rootCatalogId;
			},
			setRootCatalogId: function(value) {
				rootCatalogId = value;
			},
			setSelectedCatalog: function(parentCatalogId, catalogId) {
				selectedCatalog = {
					'parentCatalogId': parentCatalogId,
					'catalogId': catalogId
				};
			},
			getCatalogHierarchy: function(catalogs) {
				createCatalogHierarchy(catalogs);
				return catalogHierarchy;
			},
			getBreadcrumbs: function(parentCatalogId, catalogId) {
				if (breadcrumbsMap[parentCatalogId+':'+catalogId] === undefined)
					createBreadcrumbs(parentCatalogId, catalogId);
				return breadcrumbsMap[parentCatalogId+':'+catalogId];
			},
			getOrderId: function() {
				return orderId;
			},
			setOrderId: function(value) {
				orderId = value;
			},
			getCartItems: function() {
				return cartItems;
			},
			setCartItems: function(value) {
				cartItems = value;
			},
			showLoadingScreen: function(value) {
				setLoadingScreen(value);
			},
			getIneligibleItems: function() {
				return showIneligibleItems;
			},
			setIneligibleItems: function(value) {
				showIneligibleItems = value;
			},
			getPricebookMap: function() {
				return pricebookMap;
			},
			setPricebookMap: function(value) {
				pricebookMap = value;
			}
		};
	}
]);
},{}],10:[function(require,module,exports){
angular.module("browseCatalog").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("Header.tpl.html",'<div ng-controller="BrowseCatalogController">\n\t\x3c!-- Spinner --\x3e\n\t<div ng-show="isLoading" class="vlc-overlay">\n\t\t<span class="spinner"></span>\n\t</div>\n\t\x3c!-- Navigation Bar --\x3e\n\t<nav class="navbar navbar-inverse">\n\t\t<div class="container">\n\t\t\t<div class="navbar-header">\n\t\t\t\t<a class="navbar-brand" href="#/"><img ng-src="{{logoUrl}}" width="195" height="55" alt="" /></a>\n\t\t\t</div>\n\t\t\t<div class="collapse navbar-collapse">\n\t\t\t\t<ul class="nav navbar-nav">\n\t\t\t\t\t<li><a href="#/">Home</a></li>\n\t\t\t\t\t<li><a href="#/">Chatter</a></li>\n\t\t\t\t\t<li><a href="#/">Orders</a></li>\n\t\t\t\t\t<li><a href="#/">Support</a></li>\n\t\t\t\t\t<li><a href="#/">Cases</a></li>\n\t\t\t\t</ul>\n\t\t\t\t<p class="navbar-text navbar-right text-right">\n\t\t\t\t\t<a class="cart" href="" ng-click="gotoOrder()" target="_blank">\n\t\t\t\t\t\t<span class="icon icon-v-cart-line"></span><span class="badge">{{cartQty}}</span>\n\t\t\t\t\t</a><br/>\n\t\t\t\t\t<a class="ctx" href="" ng-click="collapseContext = !collapseContext">\n\t\t\t\t\t\t<span class="icon icon-v-setting"></span>\n\t\t\t\t\t\t<span ng-if="collapseContext" class="icon icon-v-down-arrow"></span>\n\t\t\t\t\t\t<span ng-if="!collapseContext" class="icon icon-v-up-arrow"></span>\n\t\t\t\t\t</a>\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</div>\n\t</nav>\n\t\x3c!-- Context Admin --\x3e\n\t<div collapse="collapseContext" class="context-container">\n\t\t<div class="container">\n\t\t\t<div class="context-row" ng-repeat="context in contexts">\n\t\t\t\t<div class="ctx-name">\n\t\t\t\t\t<h4>{{context.name}}:</h4>\n\t\t\t\t</div>\n\t\t\t\t<div class="ctx-values">\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li ng-repeat="value in context.values">\n\t\t\t\t\t\t\t<span ng-if="value !== context.selectedValue" ng-click="setContext(context, value)" class="unselected">{{value}}</span>\n\t\t\t\t\t\t\t<span ng-if="value === context.selectedValue" class="selected">{{value}}</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="context-row">\n\t\t\t\t<div class="ctx-name">\n\t\t\t\t\t<h4>Filters:</h4>\n\t\t\t\t</div>\n\t\t\t\t<div class="ctx-values">\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li ng-repeat="filter in filters">\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<input type="checkbox" ng-model="filter.checked" ng-change="setFilter()" />&nbsp;&nbsp;{{filter.label}}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<input type="checkbox" ng-model="showIneligibleItems" />&nbsp;&nbsp;Show ineligible items\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>'),$templateCache.put("CatalogHierarchy.tpl.html",'<div>\n\t<div class="cat-node">\n\t\t<div class="level-{{node.level}}"></div>\n\t\t<div class="cat-expand">\n\t\t\t<span ng-if="(node.isExpanded && node.children.length > 0)">\n\t\t\t\t<a ng-href="" ng-click="node.isExpanded = !node.isExpanded"><span class="glyphicon icon-v-down-arrow"></span></a>\n\t\t\t</span>\n\t\t\t<span ng-if="(!node.isExpanded && node.children.length > 0)">\n\t\t\t\t<a ng-href="" ng-click="node.isExpanded = !node.isExpanded"><span class="glyphicon icon-v-right-arrow"></span></a>\n\t\t\t</span>\n\t\t</div>\n\t\t<div class="cat-name"><a href="javascript:void(0)" ng-click="browseCatalog(node.parentCatalogId, node.Id)">{{node.Name}}</a></div>\n\t</div>\n\t<div collapse="(!node.isExpanded && node.children.length > 0)">\n\t\t<div ng-repeat="node in node.children" ng-include="\'CatalogHierarchy.tpl.html\'"></div>\n\t</div>\n</div>'),$templateCache.put("Product.tpl.html",'<div class="product">\n\t<div class="product-image">\n\t\t<carousel interval="-1">\n\t\t\t<slide ng-repeat="attachment in attachments[product.Id]" active="attachment[nsPrefix+\'IsDefaultImage__c\']">\n\t\t\t\t<img ng-src="{{attachment[nsPrefix+\'UrlLong__c\']}}" alt="{{attachment.Name}}" />\n\t\t\t</slide>\n\t\t</carousel>\n\t</div>\n\t<div class="product-name">{{product.Name}}</div>\n\t<div class="product-price">{{pricebookMap[product.Id].UnitPrice | currency:currencySymbol}}</div>\n\t<div class="product-desc">{{product.Description}}</div>\n\t<div class="product-actions clearfix">\n\t\t<div class="p-add" ng-if="!ineligible && product[nsPrefix+\'IsOrderable__c\']"><button type="button" class="btn btn-primary" ng-click="addItemToCart(product.Id, product.Name)">{{lblAddToCart}}</button></div>\n\t</div>\n\t<div class="product-moreinfo clearfix">\n\t\t<div class="pull-left">\n\t\t\t<span class="icon icon-v-star-line" ng-if="!product.liked" ng-click="product.liked = true"></span>\n\t\t\t<span class="icon icon-v-star" ng-if="product.liked" ng-click="product.liked = false"></span>\n\t\t\t<span data-placement="bottom" data-animation="am-flip-x" data-template-url="ProductAnalytics.tpl.html" bs-popover="popover">\n\t\t\t\t<span class="icon icon-v-graph"></span>\n\t\t\t</span>\n\t\t</div>\n\t\t<div class="pull-right">\n\t\t\t<a ng-href="{{product.objectUrl}}" target="_blank">More details</a>\n\t\t</div>\n\t</div>\n</div>'),$templateCache.put("Products.tpl.html",'<div class="catalog-hierarchy">\n\t<div class="catalog-nodes" ng-show="showNav">\n\t\t<catalog-hierarchy node="catalogHierarchy[0]"></catalog-hierarchy>\n\t</div>\n\t<div ng-class="{\'catalog-nav\': true, \'open\': showNav}" ng-click="showNav = !showNav">\n\t\t<span ng-class="{\'glyphicon\': true, \'icon-v-right-caret\': !showNav, \'icon-v-left-caret\': showNav}"></span>\n\t</div>\n</div>\n<div class="products-container">\n\t<div class="container">\n\t\t\x3c!-- BREADCRUMBS --\x3e\n\t\t<div class="breadcrumbs" ng-show="catalogBreadcrumbs.length > 0">\n\t\t\t<a href="#/">Home</a><span class="icon icon-v-right-caret"></span>\n\t\t\t<span ng-repeat="cat in catalogBreadcrumbs">\n\t\t\t\t<span ng-if="!$last"><a href="#/{{cat.parentId}}/{{cat.id}}">{{cat.name}}</a><span class="icon icon-v-right-caret"></span></span>\n\t\t\t\t<span ng-if="$last">{{cat.name}}</span>\n\t\t\t</span>\n\t\t</div>\n\t\t\x3c!-- PRODUCT ERROR --\x3e\n\t\t<div class="row" ng-if="productError != null">\n\t\t\t<div class="col-sm-12">\n\t\t\t\t<p class="error-context">{{productError}}</p>\n\t\t\t</div>\n\t\t</div>\n\t\t\x3c!-- PRODUCTS --\x3e\n\t\t<div class="row products-row">\n\t\t\t<div class="col-sm-2 filter-container">\n\t\t\t\t\x3c!-- Search box --\x3e\n\t\t\t\t<form class="form-search form-inline" ng-if="productError == null">\n\t\t\t\t\t<div class="input-append clearfix">\n\t\t\t\t\t\t<input type="text" class="form-control search-query" ng-model="searchText" id="search-query-input" placeholder="{{lblSearch}}" />\n\t\t\t\t\t\t<i class="icon icon-v-search"></i>\n\t\t\t\t\t</div>\n\t\t\t\t</form>\n\n\t\t\t\t\x3c!-- List of Attributes --\x3e\n\t\t\t\t<div class="filter-label" ng-show="!isEmptyObject(idx.attrname)">Filter</div>\n\t\t\t\t<div ng-repeat="(k,varr) in idx.attrname" ng-init="show && $index === 0" class="f-attr">\n\t\t\t\t\t\x3c!-- Attribute name --\x3e\n\t\t\t\t\t<div ng-click="show = !show" class="f-attr-name">\n\t\t\t\t\t\t<span ng-hide="show" class="f-attr-arrow"><span class="glyphicon icon-v-right-arrow"></span></span>\n\t\t\t\t\t\t<span ng-show="show" class="f-attr-arrow"><span class="glyphicon icon-v-down-arrow"></span></span>\n\t\t\t\t\t\t{{k.split(\'|\')[0]}}\n\t\t\t\t\t</div>\n\t\t\t\t\t\x3c!-- Attribute Values --\x3e\n\t\t\t\t\t<div collapse="!show">\n\t\t\t\t\t\t<div ng-if="idx.attrtype[k] === \'default\' || varr.length === 1">\n\t\t\t\t\t\t\t<div ng-repeat="va in varr" class="f-attr-value">\n\t\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t\t<input type="checkbox" ng-model="searchfilter[va].state" />&nbsp;\n\t\t\t\t\t\t\t\t\t{{va.split(\'|\')[1]}}\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div ng-if="idx.attrtype[k] === \'text\' && varr.length > 1">\n\t\t\t\t\t\t\t<div class="f-attr-value">\n\t\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t\t<input type="text" class="form-control input-sm" ng-model="filterValueText[k]" ng-change="filterByAttrText(k, varr)" />\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div ng-if="idx.attrtype[k] === \'slider\' && varr.length > 1">\n\t\t\t\t\t\t\t<div class="ngrs-range-slider-prefixed f-attr-value">\n\t\t\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t\t\t<input type="checkbox" ng-model="idx.attrslider[k].active" ng-change="filterByAttrSlider(k, varr, false)" />\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t<span ng-if="idx.attrslider[k].type === \'Currency\'">{{currencySymbol}}</span>\n\t\t\t\t\t\t\t\t<span ng-if="idx.attrslider[k].type === \'Percent\'">%</span>\n\t\t\t\t\t\t\t\t<span ng-if="idx.attrslider[k].type === \'Number\'"></span>\n\t\t\t\t\t\t\t\t<div range-slider="true" disabled="!idx.attrslider[k].active" min="idx.attrslider[k].min" max="idx.attrslider[k].max" model-min="filterValueSlider[k].min" model-max="filterValueSlider[k].max" on-handle-up="filterByAttrSlider(k, varr, true)"></div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div ng-if="idx.attrtype[k] === \'date\' && varr.length > 1">\n\t\t\t\t\t\t\t<div class="f-attr-value">\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<span class="f-attr-date-checkbox">&nbsp;</span>\n\t\t\t\t\t\t\t\t\t<span class="f-attr-date"><label for="date_from_{{k}}">From:</label></span>\n\t\t\t\t\t\t\t\t\t<span class="f-attr-date"><label for="date_to_{{k}}">To:</label></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<span class="f-attr-date-checkbox">\n\t\t\t\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t\t\t\t<input type="checkbox" ng-model="idx.attrdate[k].active" ng-change="filterByAttrDate(k, varr)" />\n\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<input \ttype="text" class="form-control input-sm f-attr-date"\n\t\t\t\t\t\t\t\t\t\t\tid="date_from_{{k}}"\n\t\t\t\t\t\t\t\t\t\t\tng-model="filterValueDate[k].from"\n\t\t\t\t\t\t\t\t\t\t\tng-change="filterByAttrDate(k, varr)"\n\t\t\t\t\t\t\t\t\t\t\tng-disabled="!idx.attrdate[k].active"\n\t\t\t\t\t\t\t\t\t\t\tbs-datepicker="true"\n\t\t\t\t\t\t\t\t\t\t\tdata-min-date="{{idx.attrdate[k].min}}"\n\t\t\t\t\t\t\t\t\t\t\tdata-max-date="{{filterValueDate[k].to}}"\n\t\t\t\t\t\t\t\t\t\t\tdata-autoclose="true"\n\t\t\t\t\t\t\t\t\t\t\tdata-icon-left="glyphicon icon-v-left-caret"\n\t\t\t\t\t\t\t\t\t\t\tdata-icon-right="glyphicon icon-v-right-caret" />\n\t\t\t\t\t\t\t\t\t<input \ttype="text" class="form-control input-sm f-attr-date"\n\t\t\t\t\t\t\t\t\t\t\tid="date_to_{{k}}"\n\t\t\t\t\t\t\t\t\t\t\tng-model="filterValueDate[k].to"\n\t\t\t\t\t\t\t\t\t\t\tng-change="filterByAttrDate(k, varr)"\n\t\t\t\t\t\t\t\t\t\t\tng-disabled="!idx.attrdate[k].active"\n\t\t\t\t\t\t\t\t\t\t\tbs-datepicker="true"\n\t\t\t\t\t\t\t\t\t\t\tdata-min-date="{{filterValueDate[k].from}}"\n\t\t\t\t\t\t\t\t\t\t\tdata-max-date="{{idx.attrdate[k].max}}"\n\t\t\t\t\t\t\t\t\t\t\tdata-autoclose="true"\n\t\t\t\t\t\t\t\t\t\t\tdata-icon-left="glyphicon icon-v-left-caret"\n\t\t\t\t\t\t\t\t\t\t\tdata-icon-right="glyphicon icon-v-right-caret" />\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div ng-if="idx.attrdate[k].type === \'Datetime\'" class="f-attr-time">\n\t\t\t\t\t\t\t\t\t<span class="f-attr-date-checkbox">&nbsp;</span>\n\t\t\t\t\t\t\t\t\t<input \ttype="text" class="form-control input-sm f-attr-date"\n\t\t\t\t\t\t\t\t\t\t\tng-model="filterValueDate[k].from"\n\t\t\t\t\t\t\t\t\t\t\tng-change="filterByAttrDate(k, varr)"\n\t\t\t\t\t\t\t\t\t\t\tng-disabled="!idx.attrdate[k].active"\n\t\t\t\t\t\t\t\t\t\t\tbs-timepicker="true"\n\t\t\t\t\t\t\t\t\t\t\tdata-autoclose="true" />\n\t\t\t\t\t\t\t\t\t<input \ttype="text" class="form-control input-sm f-attr-date"\n\t\t\t\t\t\t\t\t\t\t\tng-model="filterValueDate[k].to"\n\t\t\t\t\t\t\t\t\t\t\tng-change="filterByAttrDate(k, varr)"\n\t\t\t\t\t\t\t\t\t\t\tng-disabled="!idx.attrdate[k].active"\n\t\t\t\t\t\t\t\t\t\t\tbs-timepicker="true"\n\t\t\t\t\t\t\t\t\t\t\tdata-autoclose="true" />\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="col-sm-10">\n\t\t\t\t\x3c!-- ELIGIBLE PRODUCTS --\x3e\n\t\t\t\t<div class="row product-row" ng-repeat="productRow in productRows">\n\t\t\t\t\t<div ng-repeat="product in productRow" class="col-sm-4 product-card">\n\t\t\t\t\t\t<product node="product" ineligible="false" attachments="productAttachments"></product>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t\x3c!-- INELIGIBLE PRODUCTS --\x3e\n\t\t\t\t<h4 class="ineligible" ng-if="showIneligibleItems && (ineligibleRows.length > 0)">Ineligible Items</h4>\n\t\t\t\t<div class="row product-row" ng-if="showIneligibleItems" ng-repeat="ineligibleRow in ineligibleRows">\n\t\t\t\t\t<div ng-repeat="product in ineligibleRow" class="col-sm-4 product-card">\n\t\t\t\t\t\t<product node="product" ineligible="true" attachments="productAttachments"></product>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>'),$templateCache.put("Catalog.tpl.html",'<div ng-class="{\'catalog\': true, \'ineligible\': ineligible}">\n\t<div class="catalog-contents" ng-click="browseCatalog(catalog.parentCatalogId, catalog.Id)">\n\t\t<div class="catalog-name">{{catalog.Name}}</div>\n\t\t<div class="catalog-image">\n\t\t\t<carousel interval="-1">\n\t\t\t\t<slide ng-repeat="attachment in attachments[catalog.Id]" active="attachment[nsPrefix+\'IsDefaultImage__c\']">\n\t\t\t\t\t<img ng-src="{{attachment[nsPrefix+\'UrlLong__c\']}}" alt="{{attachment.Name}}" />\n\t\t\t\t</slide>\n\t\t\t</carousel>\n\t\t</div>\n\t</div>\n\t<div class="catalog-moreinfo clearfix">\n\t\t<div class="pull-left">\n\t\t\t<span class="icon icon-v-star-line" ng-if="!catalog.liked" ng-click="catalog.liked = true"></span>\n\t\t\t<span class="icon icon-v-star" ng-if="catalog.liked" ng-click="catalog.liked = false"></span>\n\t\t\t<span data-placement="bottom" data-animation="am-flip-x" data-template-url="ProductAnalytics.tpl.html" bs-popover="popover">\n\t\t\t\t<span class="icon icon-v-graph"></span>\n\t\t\t</span>\n\t\t</div>\n\t\t<div class="pull-right">\n\t\t\t<a ng-href="{{catalog.objectUrl}}" target="_blank">More details</a>\n\t\t</div>\n\t</div>\n</div>'),$templateCache.put("ProductAnalytics.tpl.html","<div class=\"popover\">\n\t<div class=\"arrow\"></div>\n\t<h3 class=\"popover-title\">Analytics</h3>\n\t<div class=\"popover-content\">\n\t\t<div class='analytics'>\n\t\t\t<div class='col1'>\n\t\t\t\t<div class='lbl'>Revenue YTD:</div>\n\t\t\t\t<div class='value'>$9,338,105.35</div>\n\t\t\t\t<div class='lbl'>Target:</div>\n\t\t\t\t<div class='value'>105%</div>\n\t\t\t\t<div class='lbl'>Active Promotions:</div>\n\t\t\t\t<div class='value'>72</div>\n\t\t\t</div>\n\t\t\t<div class='col2'>\n\t\t\t\t<div class='lbl'>YTD Chart</div>\n\t\t\t\t<div class='value'><img src=\"https://mbostock.github.io/protovis/ex/bar-chart.png?3.0\" alt=\"\" /></div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>"),$templateCache.put("RootCatalogs.tpl.html",'<div class="catalogs-container">\n\t<div class="container">\n\t\t\x3c!-- ELIGIBLE CATALOGS --\x3e\n\t\t<div class="row catalog-row" ng-repeat="catalogRow in catalogRows">\n\t\t\t<div class="col-sm-4 catalog-card" ng-repeat="catalog in catalogRow">\n\t\t\t\t<catalog node="catalog" root="true" ineligible="false" attachments="rootCatalogAttachments"></catalog>\n\t\t\t</div>\n\t\t</div>\n\t\t\x3c!-- INELIGIBLE CATALOGS --\x3e\n\t\t<h4 class="ineligible" ng-if="showIneligibleItems && (ineligibleRows.length > 0)">Ineligible Items</h4>\n\t\t<div class="row catalog-row" ng-if="showIneligibleItems" ng-repeat="ineligibleRow in ineligibleRows">\n\t\t\t<div class="col-sm-4 catalog-card" ng-repeat="catalog in ineligibleRow">\n\t\t\t\t<catalog node="catalog" root="true" ineligible="true" attachments="rootCatalogAttachments"></catalog>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>'),$templateCache.put("Catalogs.tpl.html",'<div class="catalog-hierarchy">\n\t<div class="catalog-nodes" ng-show="showNav">\n\t\t<catalog-hierarchy node="catalogHierarchy[0]"></catalog-hierarchy>\n\t</div>\n\t<div ng-class="{\'catalog-nav\': true, \'open\': showNav}" ng-click="showNav = !showNav">\n\t\t<span ng-class="{\'glyphicon\': true, \'icon-v-right-caret\': !showNav, \'icon-v-left-caret\': showNav}"></span>\n\t</div>\n</div>\n<div class="catalogs-container">\n\t<div class="container">\n\t\t\x3c!-- BREADCRUMBS --\x3e\n\t\t<div class="breadcrumbs" ng-show="catalogBreadcrumbs.length > 0">\n\t\t\t<a href="#/">Home</a><span class="icon icon-v-right-caret"></span>\n\t\t\t<span ng-repeat="cat in catalogBreadcrumbs">\n\t\t\t\t<span ng-if="!$last"><a href="#/{{cat.parentId}}/{{cat.id}}">{{cat.name}}</a><span class="icon icon-v-right-caret"></span></span>\n\t\t\t\t<span ng-if="$last">{{cat.name}}</span>\n\t\t\t</span>\n\t\t</div>\n\t\t\x3c!-- CATALOG ERROR --\x3e\n\t\t<div class="row" ng-if="catalogError != null">\n\t\t\t<div class="col-sm-12">\n\t\t\t\t<p class="error-context">{{catalogError}}</p>\n\t\t\t</div>\n\t\t</div>\n\t\t\x3c!-- ELIGIBLE CATALOGS --\x3e\n\t\t<div class="row catalog-row" ng-repeat="catalogRow in catalogRows">\n\t\t\t<div ng-repeat="catalog in catalogRow" class="col-sm-4 catalog-card">\n\t\t\t\t<catalog node="catalog" root="false" ineligible="false" attachments="catalogAttachments"></catalog>\n\t\t\t</div>\n\t\t</div>\n\t\t\x3c!-- INELIGIBLE CATALOGS --\x3e\n\t\t<h4 class="ineligible" ng-if="showIneligibleItems && (ineligibleRows.length > 0)">Ineligible Items</h4>\n\t\t<div class="row catalog-row" ng-if="showIneligibleItems" ng-repeat="ineligibleRow in ineligibleRows">\n\t\t\t<div ng-repeat="catalog in ineligibleRow" class="col-sm-4 catalog-card">\n\t\t\t\t<catalog node="catalog" root="false" ineligible="true" attachments="catalogAttachments"></catalog>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>')}]);

},{}]},{},[1]);
})();

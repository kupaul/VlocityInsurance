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
angular.module('insTransactionList', ['vlocity', 'forceng',
    'vlocity-omni-form'
    ]).config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    }]).config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }]).run(['$rootScope', 'remoteActions', function($rootScope, remoteActions) {
        'use strict';
        $rootScope.nsPrefix = fileNsPrefix();
        $rootScope.isLoaded = false;
        $rootScope.setLoaded = function(boolean) {
            $rootScope.isLoaded = boolean;
        };
        $rootScope.notification = {
            message: '',
            type: '',
            active: false
        };

        $rootScope.userInfo = {};
        $rootScope.translationKeys = ['Balance', 'InsAssetTransactionsPost', 'InsAssetTransactionsType', 'InsAssetTransactionsAmount', 'None',
            'InsAssetTransactionsDateRange', 'InsAssetTransactionType', 'Submit', 'InsButtonCancel', 'InsAssetSoldPolicy', 'InsTransactionAll',
            'InsCoverages', 'InsRelatedItems'];

        remoteActions.getUserProfile().then(
            function(userData) {
                $rootScope.userInfo = userData;
                $rootScope.userInfo.langFormat = userData.language.replace("_", "-");
                remoteActions.getCustomLabels($rootScope.translationKeys, $rootScope.userInfo.langFormat).then(
                    function(translatedLabels) {
                        $rootScope.transactionsCustomLabels = JSON.parse(translatedLabels).data;
                    }
                );
            }
        );

    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        'use strict';
        return function(sldsURL) {
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]).filter('formatCurrency', ['$rootScope', function($rootScope) {
        'use strict';
        return function(amount) {
            if(!$rootScope.currencyCode && $rootScope.userInfo) {
                $rootScope.currencyCode = $rootScope.userInfo.money || 'USD';
            }
            if(amount != null) {
                return amount.toLocaleString($rootScope.userInfo.anlocale, {style: 'currency', currency: $rootScope.currencyCode});
            }
        };
    }])

// Directives
require('./modules/insTransactionList/directive/InsTransactionList.js');

// Templates
require('./modules/insTransactionList/templates/templates.js');

},{"./modules/insTransactionList/directive/InsTransactionList.js":2,"./modules/insTransactionList/templates/templates.js":3}],2:[function(require,module,exports){
(function() {
    'use strict';
    angular.module('insTransactionList')
        .component('insTransactionList', {
            templateUrl: 'ins-transaction-list-template.tpl.html',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                records: '@?',
                objType: '@?'
            },
            controllerAs: 'vloc',
            controller: InsTransactionListController
        });

    InsTransactionListController.$inject = ['$scope', '$rootScope', '$q', '$window', '$timeout', 'remoteActions'];

    function InsTransactionListController($scope, $rootScope, $q, $window, $timeout, remoteActions) {
        let vloc = this,
            defaultConfig = {};

        vloc.$onInit = doInit;
        $rootScope.transactionsCustomLabels = {};
        $scope.transactionOutput = {};
        $scope.transactionInput = {};
        $scope.showOmniForm = false;
        let localizedTransactionTypes = {};
        $scope.filterObj = {
            filterDateRangeStart : '', 
            filterDateRangeEnd : '', 
            filterTransactionTypes : '', 
            filterCoverages : '', 
            filterRelatedItems : ''
        };

        $scope.$watchCollection('transactionOutput', function(newval, oldval) {
            // submit or cancel clicked
            if (newval.vlcOmniFormStatus === 'submitting' || newval.vlcOmniFormStatus === 'cancelling') {
                console.log('submitting', 'cancelling');
                $rootScope.isLoaded = false;
            }
            // remote action completed
            if (newval.vlcOmniFormStatus === 'submit' || newval.vlcOmniFormStatus === 'cancel') {
                console.log('submit', 'cancel');
                //if submit:
                delete $scope.omniInput;
                $rootScope.isLoaded = true;
                remoteActions.getAssetTransaction(vloc.id).then(function(data) {
                    $scope.result = [];
                    $scope.balance = 0;
                    let temp = {};
                    let tempCoverages = {};
                    let tempRelatedItems = {};

                    if (data) {
                        for (let key in data.assetTransactions) {
                            let tempDateFormatted = formatDate(data.assetTransactions[key][$rootScope.nsPrefix + 'postdate__c']);
                            data.assetTransactions[key][$rootScope.nsPrefix + 'postdate__c'] = tempDateFormatted;
                            $scope.result.push(data.assetTransactions[key]);
                            let transactionTypes = data.assetTransactions[key][$rootScope.nsPrefix + 'type__c'];
                            let coverage = data.assetTransactions[key][$rootScope.nsPrefix + 'coverage__c'];
                            let relatedItem = data.assetTransactions[key][$rootScope.nsPrefix + 'involvedpartyoritem__c'];
                            if (!temp[transactionTypes]) {
                                temp[transactionTypes] = {
                                    value : transactionTypes,
                                    label : transactionTypes
                                };
                            }
                            if (data.assetTransactions[key][$rootScope.nsPrefix + 'amount__c']) {
                                $scope.balance += data.assetTransactions[key][$rootScope.nsPrefix + 'amount__c'];
                            }
                            if (coverage) {
                                tempCoverages[coverage] = true;
                            }
                            if (relatedItem) {
                                tempRelatedItems[relatedItem] = true;
                            }

                        }
                    }
                    $scope.transactionTypes = [];
                    $scope.coverages = _.keys(tempCoverages);
                    $scope.relatedItems = _.keys(tempRelatedItems);
                    $scope.transactionTypes = _.values(temp);
                    let all = $rootScope.transactionsCustomLabels.InsTransactionAll || 'All';
                    $scope.coverages.push(all);
                    $scope.relatedItems.push(all);
                    const noneTranslation = {
                        value: 'None',
                        label: $rootScope.transactionsCustomLabels.None || 'None'
                    };
                    $scope.transactionTypes.push(noneTranslation);
                    $scope.unfilteredResults = $scope.result;
                    $timeout(function() {
                        const allTranslation = {
                            value: 'All',
                            label: $rootScope.transactionsCustomLabels.InsTransactionAll || 'All'
                        };
                        $scope.transactionTypes.push(allTranslation);
                    }, 1000);
                });
            }
        });


        const urlParam = function(name) {
            let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results === null) {
                return null;
            } else {
                return decodeURI(results[1]) || 0;
            }
        };

        /* 
        * Clear filter obj out, call filter with empty obj.
        */
        $scope.clearFilterResults = function(){
            $scope.filterObj = {
                filterDateRangeStart : '', 
                filterDateRangeEnd : '', 
                filterTransactionTypes : '', 
                filterCoverages : '', 
                filterRelatedItems : ''
            };
            $scope.filterResults();
        }

        /* 
        * Filter results using filterobj
        */
        $scope.filterResults = function() {
            $scope.result = [];
            console.log($scope.unfilteredResults);
            for (let i = 0; i < $scope.unfilteredResults.length; i++) {
                let returnObj = true;
                let date = new Date($scope.unfilteredResults[i][$rootScope.nsPrefix + 'postdate__c']);
                let type = $scope.unfilteredResults[i][$rootScope.nsPrefix + 'type__c'];
                let coverage = $scope.unfilteredResults[i][$rootScope.nsPrefix + 'coverage__c'];
                let relatedItem = $scope.unfilteredResults[i][$rootScope.nsPrefix + 'involvedpartyoritem__c'];
                let dateRangeStart = $scope.filterObj.filterDateRangeStart;
                let dateRangeEnd =  $scope.filterObj.filterDateRangeEnd;
                let transactionType = $scope.filterObj.filterTransactionTypes;
                let coverageType = $scope.filterObj.filterCoverages;
                let relatedItemType = $scope.filterObj.filterRelatedItems;
                console.log(date >= dateRangeStart);
                console.log(date <= dateRangeEnd);
                if (dateRangeStart) {
                    if (date >= dateRangeStart) {
                        returnObj = true;
                    } else {
                        returnObj = false;
                    }
                }
                if (dateRangeEnd && returnObj) {
                    if (date <= dateRangeEnd) {
                        returnObj = true;
                    } else {
                        returnObj = false;
                    }
                }
                if (transactionType && returnObj) {
                    if (transactionType.value === 'All' || transactionType.label === $rootScope.transactionsCustomLabels.InsTransactionAll) {
                        returnObj = true;
                    } else {
                        if (type === transactionType.label || type === transactionType.value || (!type && (transactionType.value === 'None' || transactionType.label === $rootScope.transactionsCustomLabels.None))) {
                            returnObj = true;
                        } else {
                            returnObj = false;
                        }
                    }
                }
                if (coverageType && returnObj) {
                    if (coverageType === 'All' || coverageType === $rootScope.transactionsCustomLabels.InsTransactionAll) {
                        returnObj = true;
                    } else {
                        returnObj = (coverage === coverageType || (!coverage && (coverageType === 'None' || coverageType === $rootScope.transactionsCustomLabels.None)));
                    }
                }
                if (relatedItemType && returnObj) {
                    if (relatedItemType === 'All' || relatedItemType === $rootScope.transactionsCustomLabels.InsTransactionAll) {
                        returnObj = true;
                    } else {
                        returnObj = (relatedItem === relatedItemType || (!relatedItem && (relatedItemType === 'None' || relatedItemType === $rootScope.transactionsCustomLabels.None)));
                    }
                }
                if (returnObj) {
                    $scope.result.push($scope.unfilteredResults[i]);
                }
            }
            $scope.balance = 0;
            if ($scope.result) {
                for (var i = 0; i < $scope.result.length; i++) {
                    if ($scope.result[i][$rootScope.nsPrefix + 'amount__c']) {
                        $scope.balance += $scope.result[i][$rootScope.nsPrefix + 'amount__c'];
                    }
                }
            }
        };

        function formatDate(date) {
            const userLocale = $rootScope.userInfo.anlocale;
            const d = new Date(date);
            let formattedDate;
            if (userLocale) {
                formattedDate = d.toLocaleDateString(userLocale, {timeZone: 'UTC'});
            } else {
                formattedDate = (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
            }
            return formattedDate;
        };

        $scope.cloneIpResult = function() {
            if (vloc.integrationProcedure) {
                var inputMap = {
                    type: $scope.transactionDropdown.value
                }
                var options = {};
                var output = {};
                console.log(inputMap);
                remoteActions.invokeIntegrationProcedureWithInput(vloc.integrationProcedure, inputMap, options).then(function(data) {
                    console.log('data', data);
                    $scope.IPResult = data.IPResult;
                    $scope.omniFormParams = {
                        extraInput: {
                            objectId: vloc.id
                        }
                    };
                    console.log("$scope.omniFormParams", $scope.omniFormParams);
                    $scope.omniInput = angular.copy($scope.IPResult.OmniInput);
                });
            }
        }

        function doInit() {
            if (!vloc.id) {
                vloc.id = urlParam('id');
                vloc.integrationProcedure = urlParam('integrationProcedure');
            }
            $scope.integrationProcedure = vloc.integrationProcedure;

            remoteActions.getTransactionTypes(vloc.id).then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    localizedTransactionTypes[data[i].value] = data[i];
                }
                $scope.ipTypes = data;
                $scope.transactionDropdown = $scope.ipTypes[0];
            });

            if (!vloc.records) {
                if (remoteActions) {
                    remoteActions.getAssetTransaction(vloc.id).then(function(data) {
                        $scope.result = [];
                        var temp = {};
                        $scope.balance = 0;
                        $scope.transactionTypes = [];
                        let tempCoverages = {};
                        let tempRelatedItems = {};
                        if (data) {
                            for (let key in data.assetTransactions) {
                                let tempDateFormatted = formatDate(data.assetTransactions[key][$rootScope.nsPrefix + 'postdate__c']);
                                data.assetTransactions[key][$rootScope.nsPrefix + 'postdate__c'] = tempDateFormatted;
                                $scope.result.push(data.assetTransactions[key]);
                                let transactionTypes = data.assetTransactions[key][$rootScope.nsPrefix + 'type__c'];
                                let coverage = data.assetTransactions[key][$rootScope.nsPrefix + 'coverage__c'];
                                let relatedItem = data.assetTransactions[key][$rootScope.nsPrefix + 'involvedpartyoritem__c'];
                                if (!temp[transactionTypes]) {
                                    temp[transactionTypes] = {
                                        value : transactionTypes,
                                        label : transactionTypes
                                    };
                                }
                                if (data.assetTransactions[key][$rootScope.nsPrefix + 'amount__c']) {
                                    $scope.balance += data.assetTransactions[key][$rootScope.nsPrefix + 'amount__c'];
                                }
                                if (coverage) {
                                    tempCoverages[coverage] = true;
                                }
                                if (relatedItem) {
                                    tempRelatedItems[relatedItem] = true;
                                }
                            }
                        }
                        $scope.coverages = _.keys(tempCoverages);
                        $scope.relatedItems = _.keys(tempRelatedItems);
                        $scope.transactionTypes = _.values(temp);
                        let all = $rootScope.transactionsCustomLabels.InsTransactionAll || 'All';
                        $scope.coverages.push(all);
                        $scope.relatedItems.push(all);
                        const noneTranslation = {
                            value: 'None',
                            label: $rootScope.transactionsCustomLabels.None || 'None'
                        };
                        $scope.transactionTypes.push(noneTranslation);
                        $scope.unfilteredResults = $scope.result;
                        $timeout(function() {
                            const allTranslation = {
                                value: 'All',
                                label: $rootScope.transactionsCustomLabels.InsTransactionAll || 'All'
                            };
                            $scope.transactionTypes.push(allTranslation);
                        }, 1000);
                    });


                    remoteActions.getTransactionTypes(vloc.id).then(function(data) {
                        for (let i = 0; i < data.length; i++) {
                            const key = data[i].value;
                            localizedTransactionTypes[key] = data[i];
                        }

                        $scope.ipTypes = data;
                        $scope.transactionDropdown = $scope.ipTypes[0];
                    });

                }
            }
        }
    }

})();

},{}],3:[function(require,module,exports){
angular.module("insTransactionList").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("ins-transaction-list-template.tpl.html",'<div class="vloc-transaction-container slds-m-right_medium">\n   <div class="vloc-ins-transactions-dropdown slds-p-vertical_small slds-p-right_small slds-size_1-of-1 slds-grid slds-wrap">\n       <div class="slds-size_1-of-2 slds-p-right_small" ng-if="integrationProcedure !== \'undefined\'">\n           <select ng-options="item as item.label for item in ipTypes" ng-model="transactionDropdown" class="vloc-transaction-options slds-select slds-m-right_xx-small" id="select-01" ng-change="changeDropdown($index)">\n           </select>\n       </div>\n       <div class="slds-size_1-of-2 slds-grid slds-wrap">\n           <div class="vloc-add-circle" ng-if="!omniInput && integrationProcedure !== \'undefined\'">\n               <slds-button-svg-icon sprite="\'utility\'" icon="\'add\'" size="\'medium\'" ng-click="showOmniForm = true; cloneIpResult()"></slds-button-svg-icon>\n           </div>\n           <div class="vloc-add-circle" ng-if="omniInput && integrationProcedure !== \'undefined\'">\n               <slds-button-svg-icon ng-click="$root.showOmniForm = false" sprite="\'utility\'" icon="\'close\'" size="\'medium\'"></slds-button-svg-icon>\n           </div>\n           <div class="slds-float_right slds-p-left_small vloc-filter" ng-class="{\'vloc-tab\' : $root.showFilter}">\n               <slds-button-svg-icon sprite="\'utility\'" extra-classes="vloc-icon-tab" ng-click="$root.showFilter = !$root.showFilter" icon="\'filterList\'" size="\'large\'" ng-click="filter"></slds-button-svg-icon>\n           </div>\n       </div>\n   </div>\n   <div ng-if="$root.showFilter" ng-hide="!$root.showFilter" class="vloc-filter-box slds-p-horizontal_small slds-p-bottom_small slds-size_1-of-1 slds-box slds-grid slds-wrap slds-m-horizontal_xx-small slds-m-bottom_small">\n       <div class="slds-size_1-of-1">\n           {{ ::$root.transactionsCustomLabels.InsAssetTransactionsDateRange }}\n       </div>\n       <div class="slds-size_1-of-2 slds-p-right_x-small">\n           <input class="slds-input slds-m-bottom_xx-small" slds-date-picker ng-model="filterObj.filterDateRangeStart">\n       </div>\n       <div class="slds-size_1-of-2">\n           <input class="slds-input slds-m-bottom_xx-small" slds-date-picker ng-model="filterObj.filterDateRangeEnd">\n       </div>\n       <div class="slds-size_1-of-2 slds-p-right_x-small">\n           <div class="slds-size_1-of-1">{{ ::$root.transactionsCustomLabels.InsAssetTransactionType }}</div>\n           <select ng-options="cat as cat.label for cat in transactionTypes" ng-model="filterObj.filterTransactionTypes" class="slds-select slds-m-right_xx-small" id="select-02">\n           </select>\n       </div>\n       <div class="slds-size_1-of-2" ng-if="coverages.length > 1">\n           <div class="slds-size_1-of-1">{{ ::$root.transactionsCustomLabels.InsCoverages }}</div>\n           <select ng-options="cov as cov for cov in coverages" ng-model="filterObj.filterCoverages" class="slds-select slds-m-right_xx-small" id="select-03">\n           </select>\n       </div>\n       <div class="slds-size_1-of-2 slds-p-right_x-small" ng-if="relatedItems.length > 1">\n           <div class="slds-size_1-of-1">{{ ::$root.transactionsCustomLabels.InsRelatedItems }}</div>\n           <select ng-options="cov as cov for cov in relatedItems" ng-model="filterObj.filterRelatedItems" class="slds-select slds-m-right_xx-small" id="select-04">\n           </select>\n       </div>\n       <div class="slds-size_1-of-1 slds-grid slds-p-top_small slds-is-relative">\n           <button class="slds-button slds-link" ng-click="$root.showFilter = false; clearFilterResults();">{{ ::$root.transactionsCustomLabels.InsButtonCancel }}</button>\n           <span class="vloc-filter-submit"><button class="slds-button slds-button_brand" ng-click="filterResults();">{{ ::$root.transactionsCustomLabels.Submit }}</button></span>\n       </div>\n   </div>\n   <div class="vlc-omni-form via-slds via-omni vlc-omni-form">\n       <vlc-omni-form omni-input="omniInput" submit-params="omniFormParams" mode="\'console\'" class="slds-grid slds-grid_vertical" id=\'{{omniInput.OmniDef.sOmniScriptId}}\' output="transactionOutput">\n       </vlc-omni-form>\n       <div ng-if="noActiveIP" class="slds-padding-top_small slds-text-align_center">\n           {{ ::$root.transactionsCustomLabels.InsAssetNoActiveIP }}\n       </div>\n   </div>\n   <div class="slds-grid slds-wrap slds-size_1-of-1 slds-border_bottom slds-p-vertical_x-small">\n       \x3c!--Date Column Only Require 1/6 of the row--\x3e\n       <div class="slds-size_1-of-5">\n           {{ ::$root.transactionsCustomLabels.InsAssetTransactionsPost }}\n       </div>\n       <div class="slds-size_2-of-5">\n           {{ ::$root.transactionsCustomLabels.InsAssetTransactionsType }}\n       </div>\n       <div class="slds-size_2-of-5">\n           {{ ::$root.transactionsCustomLabels.InsAssetTransactionsAmount }}\n       </div>\n   </div>\n   <div class="slds-p-vertical_x-small" ng-repeat="obj in result | filter: $root.searchWord" ng-init="$root.currencyCode = obj.currencyCode">\n       <div class="slds-grid slds-wrap slds-size_1-of-1">\n           \x3c!--Date Column Only Require 1/6 of the row--\x3e\n           <div class="slds-size_1-of-5 slds-p-right_small">\n               {{obj[$root.nsPrefix + \'postdate__c\']}}\n           </div>\n           <div class="slds-size_2-of-5 slds-p-right_small">\n               {{obj[$root.nsPrefix + \'type__c\']}}\n           </div>\n           <div class="slds-size_2-of-5">\n               {{obj[$root.nsPrefix + \'amount__c\'] | formatCurrency : $root.currencyCode}}\n           </div>\n       </div>\n   </div>\n</div>\n<style type="text/css">\n   .vloc-add-circle {\n       background-color: #005fb2;\n       border-radius: 1rem;\n       height: 1.5rem;\n       width: 1.5rem;\n       color: white;\n       margin-top: 0.3rem;\n       padding-left: .3rem;\n       padding-top: .05rem;\n   }\n\n   .vloc-add-circle:hover {\n       cursor: pointer;\n   }\n\n   .vloc-ins-transactions-dropdown {\n      min-height: 3rem;\n   }\n   .vloc-filter {\n       color: #005fb2;\n       right: 2rem;\n       position: absolute;\n       top: 1rem;\n       border-radius: 1rem;\n       height: 4rem;\n       padding-right: .75rem;\n       padding-top: .5rem;\n       top: .5rem;\n       outline: none;\n   }\n\n   .vloc-filter.vloc-tab {\n       background-color: #005fb2;\n       color: white;\n       z-index: 0;\n   }\n\n   .vloc-filter-box {\n       background-color: white;\n       z-index: 100;\n       position: relative;\n   }\n\n   .vloc-filter::active {\n       outline: none;\n   }\n\n   .vloc-check {\n       color: #04844b;\n       right: 2rem;\n       position: absolute;\n   }\n\n   .vloc-filter:hover {\n       cursor: pointer;\n   }\n\n   .vloc-icon-tab {\n       z-index: 100;\n   }\n\n   .vloc-hide-dropdown {\n       display: none;\n   }\n\n   .vloc-filter-submit {\n       position: absolute;\n       right: 1rem;\n   }\n</style>')}]);

},{}]},{},[1]);
})();

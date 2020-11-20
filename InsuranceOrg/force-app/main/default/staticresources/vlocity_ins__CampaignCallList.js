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
angular.module('campaignCallList',
    ['vlocity', 'CardFramework', 'sldsangular', 'viaDirectives', 'ngAnimate', 'forceng', 'tmh.dynamicLocale', 'cfp.hotkeys', 'mgcrea.ngStrap', 'ngSanitize'])
    .config(['remoteActionsProvider', function(remoteActionsProvider) {
        'use strict';
        remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    }]).config(function($locationProvider) {
        'use strict';
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });
    }).config(['$compileProvider', function($compileProvider) {
        'use strict';
        $compileProvider.debugInfoEnabled(false);

    }]).config(['$localizableProvider', function($localizableProvider) {
        'use strict';
        $localizableProvider.setLocalizedMap(window.i18n);
        $localizableProvider.setDebugMode(window.ns === '');

    }]).config(['$datepickerProvider', function($datepickerProvider) {
        'use strict';
        angular.extend($datepickerProvider.defaults, {
            templateUrl: 'SldsDatepicker.tpl.html',
            dateFormat: 'M/d/yyyy',
            modelDateFormat: 'yyyy-MM-dd',
            dateType: 'string',
            autoclose: true,
            onHide: function() {

            }
        });
    }]).config(['$timepickerProvider', function($timepickerProvider) {
        'use strict';
        angular.extend($timepickerProvider.defaults, {
            templateUrl: 'SldsTimepicker.tpl.html',
            timeFormat: 'h:mm:ss a',
            placement: 'bottom-right',
            length: 7,
            autoclose: true
        });
    }]).config(['$tooltipProvider', function($tooltipProvider) {
        'use strict';
        angular.extend($tooltipProvider.defaults, {
            templateUrl: 'SldsTooltip.tpl.html',
            placement: 'auto top-left'
        });
    }]).run(['$rootScope', 'force', function($rootScope, force) {
        'use strict';
        $rootScope.nsPrefix = fileNsPrefix();
        // Used in templates for slds assets
        $rootScope.staticResourceURL = vlocCPQ.staticResourceURL;
        $rootScope.notification = {
            message: '',
            type: '',
            active: false
        };
        $rootScope.rightColumn = {
            toggleRightClass: 'toggle-right-expanded',
            largeBPWidth: '6',
            toggleIcon: 'richtextindent'
        };
        $rootScope.campaignMember = {};
        $rootScope.campaignName = '';
        $rootScope.memberStatus = {};
        $rootScope.memberTabs = [];
        $rootScope.currentMemberId = '';
        $rootScope.urlMemberId = window.campaignMemberId;
        $rootScope.membersAggInfoByCampaign = undefined;
        $rootScope.campaignEmailTemplate = 'NOTLOAD';
        $rootScope.campaignEmail = {};
           

        $rootScope.log = function(string, obj, color, fontSize) {
            string = '%c' + string;
            color = color || 'orange';
            fontSize = fontSize || '14px';
            console.log(string, 'color: ' + color + '; font-size: ' + fontSize + ';', obj);
        };
        $rootScope.attachments = {};
        $rootScope.loginUserId = window.userId;
        if (!force.isAuthenticated() && window.sessionId && typeof Visualforce !== 'undefined') {
            force.init({
                accessToken: window.sessionId,
                useProxy: false
            });
        }
    }]).filter('sldsStaticResourceURL', ['$rootScope', function($rootScope) {
        'use strict';
        return function(sldsURL) {
            // staticResourceURL.slds = /resource/1459186855000/<namespace>__slds
            // sldsURL = /assets/icons/standard-sprite/svg/symbols.svg#opportunity
            return $rootScope.staticResourceURL.slds + sldsURL;
        };
    }]);

// Services
require('./modules/campaignCallList/services/DeviceDetection.js');
require('./modules/campaignCallList/services/CampaignAggInfo.js');

// Factories
require('./modules/campaignCallList/factory/NotificationHandler.js');
require('./modules/campaignCallList/factory/ResponsiveHelper.js');
require('./modules/campaignCallList/factory/CampaignService.js');

// Controllers
require('./modules/campaignCallList/controller/CampaignCallListController.js');
require('./modules/campaignCallList/controller/CampaignMemberController.js');
require('./modules/campaignCallList/controller/CampaignMemberStoriesController.js');
require('./modules/campaignCallList/controller/CampaignDetailsController.js');
require('./modules/campaignCallList/controller/CampaignAddMemberController.js');

// Directives
require('./modules/campaignCallList/directive/AutoFocus.js');
require('./modules/campaignCallList/directive/HideNotification.js');

// Templates
require('./modules/campaignCallList/templates/templates.js');

},{"./modules/campaignCallList/controller/CampaignAddMemberController.js":2,"./modules/campaignCallList/controller/CampaignCallListController.js":3,"./modules/campaignCallList/controller/CampaignDetailsController.js":4,"./modules/campaignCallList/controller/CampaignMemberController.js":5,"./modules/campaignCallList/controller/CampaignMemberStoriesController.js":6,"./modules/campaignCallList/directive/AutoFocus.js":7,"./modules/campaignCallList/directive/HideNotification.js":8,"./modules/campaignCallList/factory/CampaignService.js":9,"./modules/campaignCallList/factory/NotificationHandler.js":10,"./modules/campaignCallList/factory/ResponsiveHelper.js":11,"./modules/campaignCallList/services/CampaignAggInfo.js":12,"./modules/campaignCallList/services/DeviceDetection.js":13,"./modules/campaignCallList/templates/templates.js":14}],2:[function(require,module,exports){
angular.module('campaignCallList').controller('CampaignAddMemberController', function(
    $scope, $sce, remoteActions, $rootScope, CampaignService) {
    'use strict';
    $scope.importType = '';
    $scope.import_contacts = false;
    $scope.import_leads = false;
    $scope.selectedMembers = {
        'contactIds': [],
        'leadIds': []
    };
    $scope.importMembers = [];
    $scope.campaignMembers = [];
    if (window.campaignMembers !== undefined) {
        $scope.campaignMembers = JSON.parse(window.campaignMembers);
    }
    $scope.obj = {};
    $scope.filters = [];
    $scope.getRecordsAction = {};
    $scope.pageSize = 10;
    $scope.currentPage = 1;
    $scope.membersObj = {};
    $scope.getRecordsAction = {};
    $scope.show_filter = false;
    $scope.attributes = {};
    $scope.nextPageAction = {};
    $scope.prevPageAction = {};
    $scope.addCampaignMembersAction = {};
    $scope.select_all = false;
    $scope.campaignId = '';
    $scope.showBanner = false;
    $scope.showErrorBanner = false;
    $scope.memberType = '';
    $scope.show_company = false;
    $scope.bannerText = '';
    $scope.isLoading = true;

    //Set Filters & Categories on init
    $scope.setObj = function(obj, campaignId) {
        var categories = {};
        $scope.campaignId = campaignId;
        $scope.obj = obj;
        $scope.getRecordsAction = obj.result.actions.getRecordsAction;
        $scope.filters = obj.result.records[0].filters.records;
        categories = obj.result.records[0].categories.records;
        if (categories !== undefined) {
            categories = $scope.sortByKey(categories, 'displaySequence');
            for (var i = 0; i < categories.length; i++) {
                if (categories[i].uiControlType === '1-5 scale') {
                    for (var j = 0; j < categories[i].attributes.records.length; j++) {
                        categories[i].attributes.records[j].minvalue = 1;
                        categories[i].attributes.records[j].maxvalue = 5;
                    }
                }
            }
        }
        var message = {
            event: 'reload',
            message: [categories]
        };
        $rootScope.$broadcast('vlocity.layout.campaign-member-filter.events', message);
        $scope.isLoading = false;
    };

    //Sorts array of objects by key
    $scope.sortByKey = function(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };

    //Select / Unselect All Members
    $scope.selectAll = function(all) {
        $scope.select_all = all;
        for (var i = 0; i < $scope.importMembers.length; i++) {
            if (all) {
                $scope.selectMember($scope.importMembers[i]);
            }else {
                $scope.unselectMember($scope.importMembers[i]);
            }
        }
    };

    //Update Member
    $scope.updateMember = function(member) {
        if (member.isSelected) {
            $scope.unselectMember(member);
        }else {
            $scope.selectMember(member);
        }
    };

    //Unselect member from UI, remove from selectedmembers list
    $scope.unselectMember = function(member) {
        var index = $scope.importMembers.indexOf(member);
        var id = 'Id';
        if (member.PersonContactId) {
           id = 'PersonContactId';
        }
        var i = $scope.selectedMembers[$scope.memberType].indexOf(member[id].value);
        $scope.importMembers[index].isSelected = false;
        $scope.selectedMembers[$scope.memberType].splice(i, 1);
        $scope.select_all = false;
    };

    //Select member in UI, add to selectedmembers list
    $scope.selectMember = function(member) {
        var index = $scope.importMembers.indexOf(member);
        var id = 'Id';
        if (member.PersonContactId) {
           id = 'PersonContactId';
        }
        var i = $scope.selectedMembers[$scope.memberType].indexOf(member[id].value);
        $scope.importMembers[index].isSelected = true;
        if (i < 0) {
            $scope.selectedMembers[$scope.memberType].push($scope.importMembers[index][id].value);
        }
    };

    $scope.calcTotalSelected = function() {
        var count = 0;
        count += $scope.selectedMembers.leadIds.length;
        count += $scope.selectedMembers.contactIds.length;
        return count;
    };

    $scope.calcPageNo = function() {
        var str = 'No Records';
        if ($scope.totalRecords && $scope.importMembers.length !== 0) {
            if ($scope.importMembers.length === $scope.pageSize) {
                str = ((($scope.currentPage * $scope.pageSize) - $scope.pageSize) + 1) + ' - ' + ($scope.currentPage * $scope.pageSize) + ' of ' + $scope.totalRecords;
            } else {
                str = ((($scope.currentPage * $scope.pageSize) - $scope.pageSize) + 1) + ' - ' + ($scope.totalRecords) + ' of ' + $scope.totalRecords;
            }
        }
        return str;
    };

    $scope.addAll = function() {
        if (!$scope.nextPageAction && !$scope.prevPageAction) {
            var ids = [];
            var id = 'Id';
            $scope.addCampaignMembersAction.remote.remoteClass =  'CampaignAddMemberHandler';
            $scope.addCampaignMembersAction.remote.params.campaignId =  $scope.campaignId;
            $scope.addCampaignMembersAction.rest.restClass =  'CampaignAddMemberHandler';
            $scope.addCampaignMembersAction.rest.params.campaignId =  $scope.campaignId;
            for (var i = 0; i < $scope.importMembers.length; i++) {
                if ($scope.importMembers[i].PersonContactId) {
                    id = 'PersonContactId';
                }
                ids.push($scope.importMembers[i][id].value);
            }
            $scope.addCampaignMembersAction.remote.params[$scope.memberType] = ids;
            CampaignService.invokeAction($scope.addCampaignMembersAction).then(
            function(data) {
                console.log('success: ', data);
                $scope.showBanner = true;
                $scope.bannerText = 'All members belonging to ' + $scope.selectedfilter.name + ' have been added to your campaign';
            }, function(error) {
                $scope.showErrorBanner = true;
                $scope.bannerText = 'Failed to add members to campaign. ';
                console.error('error: ', error);
            });
        } else {
            $scope.addAllCampaignMembersAction.remote.remoteClass =  'CampaignAddMemberHandler';
            $scope.addAllCampaignMembersAction.remote.params.filterId = $scope.selectedfilter.id;
            $scope.addAllCampaignMembersAction.remote.params.parentObject = $scope.selectedfilter.parentObject;
            $scope.addAllCampaignMembersAction.remote.params.campaignId = $scope.campaignId;
            $scope.addAllCampaignMembersAction.rest.remoteClass =  'CampaignAddMemberHandler';
            $scope.addAllCampaignMembersAction.rest.params.filterId = $scope.selectedfilter.id;
            $scope.addAllCampaignMembersAction.rest.params.parentObject = $scope.selectedfilter.parentObject;
            $scope.addAllCampaignMembersAction.rest.params.campaignId = $scope.campaignId;
            if ($scope.selectedfilter.attributesId) {
                $scope.addAllCampaignMembersAction.remote.params.attributeString =  $scope.selectedfilter.attributesId;
                $scope.addAllCampaignMembersAction.rest.params.attributeString =  $scope.selectedfilter.attributesId;
            } else {
                $scope.addAllCampaignMembersAction.remote.params.attributeString =  '';
                $scope.addAllCampaignMembersAction.rest.params.attributeString =  '';
            }
            if ($scope.searchText) {
                $scope.addAllCampaignMembersAction.remote.params.searchText =  $scope.searchText;
                $scope.addAllCampaignMembersAction.rest.params.searchText =  $scope.searchText;
            } else {
                $scope.addAllCampaignMembersAction.remote.params.searchText =  '';
                $scope.addAllCampaignMembersAction.rest.params.searchText =  '';
            }

            CampaignService.invokeAction($scope.addAllCampaignMembersAction).then(
                function(data) {
                    $scope.showBanner = true;
                    $scope.bannerText = 'All members belonging to ' + $scope.selectedfilter.name + ' have been added to your campaign';
                    console.log('sucess', data);
                }, function(error) {
                    $scope.showErrorBanner = true;
                    $scope.bannerText = 'Failed to add members to campaign: ';
                    console.error('error: ', error);
                });
        }
    };

    //Get importedMembers list based on selectedfilter;
    //campaign-member-filter also calls with updated attributes
    $scope.query = function(selectedfilter) {
        $scope.isLoading = true;
        $scope.importMembers = {};
        selectedfilter = JSON.parse(selectedfilter);
        if (selectedfilter.parentObject === 'Lead') {
            $scope.memberType = 'leadIds';
        } else {
            $scope.memberType = 'contactIds';
        }
        $scope.selectedfilter = selectedfilter;
        $scope.getRecordsAction.remote.remoteClass =  'CampaignAddMemberHandler';
        $scope.getRecordsAction.remote.params.filterId =  selectedfilter.id;
        $scope.getRecordsAction.remote.params.parentObject =  selectedfilter.parentObject;
        $scope.getRecordsAction.remote.params.pageSize =  $scope.pageSize;
        $scope.getRecordsAction.remote.params.pageNumber =  $scope.currentPage;
        $scope.getRecordsAction.rest.remoteClass =  'CampaignAddMemberHandler';
        $scope.getRecordsAction.rest.params.filterId =  selectedfilter.id;
        $scope.getRecordsAction.rest.params.parentObject =  selectedfilter.parentObject;
        $scope.getRecordsAction.rest.params.pageSize =  $scope.pageSize;
        $scope.getRecordsAction.rest.params.pageNumber =  $scope.currentPage;
        if (selectedfilter.attributesId) {
            $scope.getRecordsAction.remote.params.attributeString =  selectedfilter.attributesId;
            $scope.getRecordsAction.rest.params.attributeString =  selectedfilter.attributesId;
        } else {
            $scope.getRecordsAction.remote.params.attributeString =  '';
            $scope.getRecordsAction.rest.params.attributeString =  '';
        }
        if ($scope.searchText) {
            $scope.getRecordsAction.remote.params.searchText =  $scope.searchText;
            $scope.getRecordsAction.rest.params.searchText =  $scope.searchText;
        } else {
            $scope.getRecordsAction.remote.params.searchText =  '';
            $scope.getRecordsAction.rest.params.searchText =  '';
        }
        if (!$scope.getRecordsAction.remote.params.lastRecordId) {
            $scope.getRecordsAction.remote.params.lastRecordId = '';
            $scope.getRecordsAction.rest.params.lastRecordId = '';
        }
        CampaignService.invokeAction($scope.getRecordsAction).then(
            function(data) {
                var id = 'Id';
                var selectedCount = 0;
                console.log('success: ', data);
                $scope.importMembers = data.result.records;
                $scope.totalRecords = data.result.totalSize;
                $scope.nextPageAction = data.result.actions.nextPageAction;
                $scope.prevPageAction = data.result.actions.prevPageAction;
                $scope.addCampaignMembersAction = data.result.actions.addCampaignMembersAction;
                $scope.addAllCampaignMembersAction = data.result.actions.addAllCampaignMembersAction;
                $scope.select_all = false;
                $scope.show_company = false;
                if(!$scope.addCampaignMembersAction && data.result.actions.addCampaignMembersAction){
                    $scope.addCampaignMembersAction = data.result.actions.addCampaignMembersAction;
                }
                for (var i = 0; i < $scope.importMembers.length; i++) {
                    if ($scope.importMembers[i].Company) {
                        $scope.show_company = true;
                    }
                    if ($scope.importMembers[i].PersonContactId) {
                        id = 'PersonContactId';
                    }
                    if ($scope.selectedMembers[$scope.memberType].indexOf($scope.importMembers[i][id].value.toString()) > -1) {
                       $scope.updateMember($scope.importMembers[i]);
                       selectedCount += 1;
                    }
                }
                if (selectedCount === $scope.importMembers.length) {
                    $scope.select_all = true;
                }
                $scope.isLoading = false;
            }, function(error) {
                console.error('error: ', error);
                $scope.importMembers = [];
                $scope.isLoading = false;
            });
    };

    //Show Advanced Filter
    $scope.showFilter = function() {
        if ($scope.show_filter) {
            $scope.show_filter = false;
        } else {
            $scope.show_filter = true;
        }
        var message = {'event': 'show_advancedfilter', 'message': $scope.show_filter};
        $rootScope.$broadcast('show_advancedfilter',$scope.show_filter);
    };


    $rootScope.$on('show_advancedfilter', function(event, data) {
        $scope.show_filter = data;
    });

    //Compile attribute string for filter, calls query
    $scope.invokeFilter = function(attr) {
        console.log('Attribute: ', attr);
        var str = '';
        var compositeStr = '';

        //On/Off & 3 States:
        if (attr.isSelected) {
            str += attr.id;
        }
        if (!attr.isSelected) {
            delete $scope.attributes[attr.id];
        }

        //Sliders:
        if (attr.minvalue && attr.minvalue) {
            if (attr.minvalue.toString() === '1' && attr.maxvalue.toString() === '5') {
                delete $scope.attributes[attr.id];
            } else {
                if (attr.minvalue) {
                    str += attr.id + ':' + attr.minvalue + '_';
                }
                if (attr.maxvalue) {
                    str += attr.maxvalue;

                }
            }
        }

        //Text value:
        if (attr.value) {
            str += attr.id + ':' + attr.value;
        } else {
            delete $scope.attributes[attr.id];
        }

        console.log('attr: ', str);
        if (str) {
            $scope.attributes[attr.id] = str;
        }
        for (var key in $scope.attributes) {
            compositeStr  += $scope.attributes[key] + ',';
        }
        $rootScope.$broadcast('update_selectedfilter', compositeStr);
    };

    $rootScope.$on('update_selectedfilter', function(event, data) {
        if ($scope.selectedfilter) {
            $scope.selectedfilter.attributesId = data;
            $scope.query(JSON.stringify($scope.selectedfilter));
        }
    });

    //Calls next page action and populates importedMembers
    $scope.nextPage = function() {
        $scope.nextPageAction.remote.remoteClass =  'CampaignAddMemberHandler';
        $scope.nextPageAction.remote.params.methodName = 'nextPageAction';
        $scope.nextPageAction.rest.restClass =  'CampaignAddMemberHandler';
        $scope.nextPageAction.rest.params.methodName = 'nextPageAction';
        CampaignService.invokeAction($scope.nextPageAction).then(
            function(data) {
                var id = 'Id';
                var selectedCount = 0;
                console.log('success: ', data);
                $scope.importMembers = data.result.records;
                $scope.nextPageAction = data.result.actions.nextPageAction;
                $scope.prevPageAction = data.result.actions.prevPageAction;
                $scope.addCampaignMembersAction = data.result.actions.addCampaignMembersAction;
                $scope.currentPage += 1;
                $scope.select_all = false;
                for (var i = 0; i < $scope.importMembers.length; i++) {
                    if ($scope.importMembers.PersonContactId) {
                        id = 'PersonContactId';
                    }
                    if ($scope.selectedMembers[$scope.memberType].indexOf($scope.importMembers[i][id].value.toString()) > -1) {
                       $scope.updateMember($scope.importMembers[i]);
                        selectedCount += 1;
                    }
                }
                if (selectedCount === $scope.importMembers.length) {
                    $scope.select_all = true;
                }
            }, function(error) {
                console.error('error: ', error);
            });
    };

    //Calls previous page action and populates importedMembers
    $scope.previousPage = function() {
        $scope.prevPageAction.remote.remoteClass =  'CampaignAddMemberHandler';
        $scope.prevPageAction.remote.params.methodName = 'prevPageAction';
        $scope.prevPageAction.rest.restClass =  'CampaignAddMemberHandler';
        $scope.prevPageAction.rest.params.methodName = 'prevPageAction';
        CampaignService.invokeAction($scope.prevPageAction).then(
            function(data) {
                var id = 'Id';
                var selectedCount = 0;
                console.log('success: ', data);
                $scope.importMembers = data.result.records;
                $scope.nextPageAction = data.result.actions.nextPageAction;
                $scope.prevPageAction = data.result.actions.prevPageAction;
                $scope.addCampaignMembersAction = data.result.actions.addCampaignMembersAction;
                $scope.currentPage -= 1;
                $scope.select_all = false;
                for (var i = 0; i < $scope.importMembers.length; i++) {
                    if ($scope.importMembers.PersonContactId) {
                        id = 'PersonContactId';
                    }
                    if ($scope.selectedMembers[$scope.memberType].indexOf($scope.importMembers[i][id].value.toString()) > -1) {
                       $scope.updateMember($scope.importMembers[i]);
                       selectedCount += 1;
                    }
                }
                if (selectedCount === $scope.importMembers.length) {
                    $scope.select_all = true;
                }
            }, function(error) {
                console.error('error: ', error);
            });

    };

    //Calls add member campaign action
    $scope.addSelected = function() {
        console.log($scope.selectedMembers);

        $scope.addCampaignMembersAction.remote.remoteClass =  'CampaignAddMemberHandler';
        $scope.addCampaignMembersAction.remote.params.campaignId =  $scope.campaignId;
        $scope.addCampaignMembersAction.remote.params.contactIds =  $scope.selectedMembers.contactIds;
        $scope.addCampaignMembersAction.remote.params.leadIds =  $scope.selectedMembers.leadIds;

        $scope.addCampaignMembersAction.rest.restClass =  'CampaignAddMemberHandler';
        $scope.addCampaignMembersAction.rest.params.campaignId =  $scope.campaignId;
        $scope.addCampaignMembersAction.rest.params.contactIds =  $scope.selectedMembers.contactIds;
        $scope.addCampaignMembersAction.rest.params.leadIds =  $scope.selectedMembers.leadIds;
        CampaignService.invokeAction($scope.addCampaignMembersAction).then(
            function(data) {
                console.log('success: ', data);
                $scope.selectedMembers.leadIds = [];
                $scope.selectedMembers.contactIds = [];
                $scope.showBanner = true;
                $scope.bannerText = 'Selected members have been successfully added to your campaign.';
            }, function(error) {
                $scope.showErrorBanner = true;
                $scope.bannerText = 'Failed to add members to campaign. ', +error.message;
                console.error('error: ', error);
            });
    };

});

},{}],3:[function(require,module,exports){
angular.module('campaignCallList').controller('CampaignCallListController', function(
    $scope, $rootScope, $timeout, CampaignService, NotificationHandler, DeviceDetection, ResponsiveHelper) {
    'use strict';
    // Event variables to $destroy:
    var onUpdateMemberStatus, onMemberDeleted;
    $scope.nameSpacePrefix = fileNsPrefix();
    $scope.isLoaded = false;
    $scope.obj = {};
    $scope.isTimeSensitive = false;
    $scope.isPastDue = false;
    // How many days to make a card timesensitive:
    $scope.timeFrame = 3;
    $scope.listMembers = {};
    $scope.objs = [];
    $scope.currentPage = 0;
    $scope.memberStatus = {};
    $scope.searchText = '';
    $scope.filter = {
        'sortBy': {
            'LastName': true,
            'Status': false,
            'TargetCallDate__c': false
        },
        'dateRange': {
            'TODAY': false,
            'THIS_WEEK': false,
            'THIS_MONTH': false
        },
        'status': {},
        'ownerVisibility': 'All'
    };

    $scope.ownerOptions = [
        {label: 'All Campaign Members', value: 'All', selected: 'All'},
        {label: 'My Campaign Members', value: 'My', selected: ''}];

    $scope.disableNextBtn = false;
    $scope.show_filter = false;
    $scope.emptyResults = false;
    $scope.notificationHandler = new NotificationHandler();
    $scope.responsiveHelper = new ResponsiveHelper($scope);
    $scope.isListLoading = false;
    $scope.filterLoading = false;
    $scope.hasResponded = [];
    // Device Detection
    $scope.deviceDetection = new DeviceDetection();
    $scope.browser = $scope.deviceDetection.detectBrowser();
    $scope.browserVersion = $scope.deviceDetection.getBrowserVersion();
    $scope.isMobile = $scope.deviceDetection.isMobile();
    $rootScope.log('isMobile: ', $scope.isMobile);
    $rootScope.log('Browser: ', $scope.browser);
    $rootScope.log('Browser Version: ', $scope.browserVersion);
    $scope.refreshDetail = true;
    $scope.reorderedMemberId = '';
    $scope.pageNoStr = '';
    $scope.locateUrlMember = false;

    $scope.hasRespondedFnc = function(status) {
        return ($scope.hasResponded.indexOf(status) !== -1);
    };

    $scope.constructEndPoint = function(action) {
        var endpoint = action.rest.link;
        var paramCount = 0;
        var key;
        if (action.rest.method === 'GET' && action.rest.params) {
            endpoint += '?';
            for (key in action.rest.params) {
                if (paramCount > 0) {
                    endpoint += '&';
                }
                endpoint += key + '=' + action.rest.params[key];
                paramCount ++;
            }
        }
        return endpoint;
    };

    $scope.search = function() {
        var getMemberListByCampaign = $scope.listMembers.actions.getSearchMemberList;
        getMemberListByCampaign.rest.link = getMemberListByCampaign.rest.link.split('?')[0];
        getMemberListByCampaign.remote.params.searchText = $scope.searchText;
        getMemberListByCampaign.rest.params.searchText = $scope.searchText;
        getMemberListByCampaign.rest.link = $scope.constructEndPoint(getMemberListByCampaign);
        $scope.isListLoading = true;
        CampaignService.invokeAction(getMemberListByCampaign).then(
            function(data) {
                if (data.result.records && data.result.records.length > 0) {
                    $scope.emptyResults = false;
                    $scope.currentPage = 0;
                    $scope.objs = [];
                    console.log('success: ', data);
                    $scope.setObj(data);
                }  else {
                    $scope.listMembers.records = '';
                    $scope.emptyResults = true;
                    delete $scope.listMembers.actions.nextMemberList;
                    delete $scope.listMembers.actions.prevMemberList;
                    console.log($scope.listMembers);
                }
                $scope.isListLoading = false;
            }, function(error) {
                $scope.notificationHandler.handleError(error);
                $scope.isListLoading = false;
            });
    };

    $scope.setSortBy = function(key) {
        var obj;
        for (obj in $scope.filter.sortBy) {
            $scope.filter.sortBy[obj] = false;
        }
        $scope.filter.sortBy[key] = true;
        console.log($scope.filter.sortBy);
    };

    $scope.setTargetDate = function(key) {
        var obj;
        for (obj in $scope.filter.dateRange) {
            $scope.filter.dateRange[obj] = false;
        }
        $scope.filter.dateRange[key] = true;
        console.log($scope.filter.dateRange);
    };

    // $scope.clearQuery = function(){
    //     var obj = '';
    //     for (obj in $scope.filter.status) {
    //         if ($scope.filter.status[obj]) {
    //             $scope.filter.status[obj] = false;
    //         }
    //     }
    //     for (obj in $scope.filter.dateRange) {
    //         if ($scope.filter.dateRange[obj] && obj !== 'ALL') {
    //             $scope.filter.dateRange[obj] = false;
    //         }
    //     }
    //     for (obj in $scope.filter.sortBy) {
    //         if ($scope.filter.sortBy[obj]) {
    //             $scope.filter.sortBy[obj] = false;
    //         }
    //     }
    // };

    $scope.query = function() {
        var q = '';
        var obj  = '';
        var sortFields = '';
        var updateListMembers;
        $scope.isListLoading = true;
        for (obj in $scope.filter.status) {
            if ($scope.filter.status[obj]) {
                q += 'Status:' + obj + ', ';
            }
        }
        for (obj in $scope.filter.dateRange) {
            if ($scope.filter.dateRange[obj] && obj !== 'ALL') {
                q += $scope.nameSpacePrefix + 'TargetCallDate__c:' + obj + ', ';
            }
        }

        if ($scope.filter.ownerVisibility === 'My') {
            q += 'OwnerId:' + $rootScope.loginUserId;
        }

        for (obj in $scope.filter.sortBy) {
            if ($scope.filter.sortBy[obj]) {
                if (obj.indexOf('__c') > -1) {
                    sortFields += $scope.nameSpacePrefix + obj;
                }else {
                    sortFields += obj;
                }
            }
        }

        updateListMembers = $scope.listMembers.actions.getSearchMemberList;
        updateListMembers.remote.params.filters = q;
        updateListMembers.remote.params.sortFields = sortFields;
        updateListMembers.rest.params.filters = q;
        updateListMembers.rest.params.sortFields = sortFields;
        updateListMembers.rest.link = $scope.constructEndPoint(updateListMembers);
        console.log(updateListMembers);

        console.log('query:',  updateListMembers.remote.params);
        CampaignService.invokeAction(updateListMembers).then(
            function(data) {
                console.log('success: ', data);
                $scope.reordered = false;
                if (data.result.records && data.result.records.length > 0) {
                    $scope.currentPage = 0;
                    $scope.reorder = false;
                    $scope.objs = [];
                    $scope.show_filter = false;
                    $scope.emptyResults = false;
                    $rootScope.log('refresh', $scope.refreshDetail);
                    if (typeof Visualforce !== 'undefined' && $scope.refreshDetail) {
                        if (data.result.records) {
                            $scope.campaignMemberDetail(data.result.records[0]);
                        }
                    }
                    $scope.setObj(data);
                    $scope.calcPageNo();
                } else {
                    $scope.emptyResults = true;
                    $scope.listMembers.records = '';
                    delete $scope.listMembers.actions.nextMemberList;
                    delete $scope.listMembers.actions.prevMemberList;
                    $scope.pageNoStr = '';
                    console.log($scope.listMembers);
                }
                $timeout(function() {
                    $scope.isListLoading = false;
                }, 500);
                console.log('EMPTY RESULTS:', $scope.emptyResults);
            }, function(error) {
                $scope.notificationHandler.handleError(error);
                $scope.isListLoading = false;
            });
    };

    $scope.setTimeFrame = function(objDate, i) {
        var day2min = 1440; // 1440 mins in a day
        var timeFrame = (day2min * $scope.timeFrame);
        var date = new Date(new Date().getTime());
        var tempObjDate = new Date(objDate);
        var diffMins = (tempObjDate - date) / 60000;
        if (diffMins <= timeFrame &&  $scope.listMembers.records[i].Status.value !== 'Responded') {
            $scope.listMembers.records[i].isTimeSensitive = true;
            if (diffMins < 0) {
                $scope.listMembers.records[i].isPastDue = true;
            }
        }
    };

    $scope.setObj = function(obj) {
        var i, objDate, inlist;
        if (!obj.result.records) {
            return;
        }
        $scope.obj = obj;
        $scope.listMembers = obj.result;
        $rootScope.campaignName = obj.result.records[0][$rootScope.nsPrefix + 'CampaignName__c'].value;
        $scope.objs[$scope.currentPage] = $scope.listMembers;
        if ($scope.listMembers.actions.nextMemberList) {
            $scope.disableNextBtn = false;
        }else {
            $scope.disableNextBtn = true;
        }
        inlist = false;
        if ($scope.listMembers) {
            for (i = 0; i < $scope.listMembers.records.length; i++) {
                objDate = $scope.listMembers.records[i][$scope.nameSpacePrefix + 'TargetCallDate__c'].value;
                if (objDate) {
                    $scope.setTimeFrame(objDate, i);
                    $scope.listMembers.records[i].formattedDate  =  new Date(objDate).toLocaleString().split(',')[0];
                    $scope.listMembers.records[i].datePickerDate = objDate;
                }
                if ($scope.listMembers.records[i].Id.value === $scope.reorderedMemberId) {
                    inlist = true;
                }
                if ($rootScope.urlMemberId && $scope.listMembers.records[i].Id.value === $rootScope.urlMemberId) {
                    $scope.locateUrlMember = true;
                    $scope.campaignMemberDetail($scope.listMembers.records[i]);
                }
            }
        }
        if (!$scope.pageSize && $scope.listMembers.actions.getSearchMemberList) {
            $scope.pageSize = Number($scope.listMembers.actions.getSearchMemberList.remote.params.pageSize);
            $scope.pageSize = Number($scope.listMembers.actions.getSearchMemberList.rest.params.pageSize);
        }

        $scope.totalRecords = $scope.listMembers.totalSize;
        if (!inlist && $scope.reorderedMemberId !== '' && !$scope.refreshDetail) {
            $scope.nextPage();
        } else {
            $scope.reorderedMemberId = '';
            $scope.calcPageNo();
        }

        //In case navigating back with campaignMember context didn't find in the current list
        if ($rootScope.urlMemberId && !$scope.locateUrlMember) {
            $scope.nextPage();
        }
        
    };

    $scope.callListInit = function(campaignId) {
        if (typeof Visualforce !== 'undefined') {
            if( !$rootScope.currentMemberId )
                $scope.campaignMemberDetail($scope.listMembers.records[0]);
        }
        $scope.campaignId = campaignId;
        CampaignService.getMemberStatus(campaignId, $scope).then(function(data) {
            var i;
            $rootScope.memberStatus = data;
            for (i = 0; i < data.result.records.length; i++) {
                if (data.result.records[i].Label) {
                    $scope.filter.status[data.result.records[i].Label.value] = false;
                }
                if (data.result.records[i].HasResponded.value) {
                    $scope.hasResponded.push(data.result.records[i].Label.value);
                }
            }
            console.log('get member status: ', $scope.filter);
        }, function(error) {
            $scope.notificationHandler.handleError(error);
        });
    };

    $scope.campaignMemberDetail = function(listMember) {
        var updateDatasource = {
            event: 'updateDatasource',
            message: {
                params: {
                    storyId: listMember.Id.value
                },
                appendFlag: false,
                updateSilently: false,
                bypassTemplateRefresh: false
            }
        };
        var setLoading = {
            event: 'setLoading',
            message: true
        };
        $rootScope.campaignMember = listMember;
        $timeout(function() {
            angular.element(document).find('.via-slds').removeClass('preload');
        }, 500);
        $rootScope.log('Not mobile, send events');
        $rootScope.$broadcast('campaign-member-data-object', listMember);
        if (listMember.Id.value !== $rootScope.currentMemberId) {
            $rootScope.currentMemberId = listMember.Id.value;
            $rootScope.$broadcast('vlocity.layout.campaign-member-stories.events', setLoading);
            // $rootScope.$broadcast('vlocity.layout.campaign-member-log-actions.events', updateDatasource);
            // also add null values for lastObjId and lastActivityDate when reset stories:
            updateDatasource.message.params.lastObjId = null;
            updateDatasource.message.params.lastActivityDate = null;
            $rootScope.$broadcast('vlocity.layout.campaign-member-stories.events', updateDatasource);
        }
    };

    $scope.nextPage = function() {
        var updateListMembers = {};
        $scope.disableNextBtn = true;
        $scope.isListLoading = true;
        if ($scope.objs[$scope.currentPage + 1]) {
            $scope.listMembers = $scope.objs[$scope.currentPage + 1];
            $scope.currentPage += 1;
            $scope.disableNextBtn = false;
            $scope.isListLoading = false;
        } else {
            updateListMembers = $scope.listMembers.actions.nextMemberList;
            updateListMembers.rest.link = $scope.constructEndPoint(updateListMembers);
            CampaignService.invokeAction(updateListMembers).then(
                function(data) {
                    console.log('success: ', data);
                    $scope.currentPage += 1;
                    $scope.setObj(data);
                    $scope.calcPageNo();
                    $scope.isListLoading = false;
                }, function(error) {
                    $scope.notificationHandler.handleError(error);
                    $scope.isListLoading = false;
                });
        }
    };

    $scope.previousPage = function() {
        if ($scope.currentPage !== 0) {
            $scope.currentPage -= 1;
            $scope.listMembers = $scope.objs[$scope.currentPage];
            if ($scope.listMembers.actions.nextMemberList) {
                $scope.disableNextBtn = false;
            }else {
                $scope.disableNextBtn = true;
            }
            $scope.calcPageNo();
        }
    };

    $scope.setFilterStatus = function(key, value) {
        $scope.filter.status[key] = value;
    };

    $scope.setOwnerVisibility = function(option) {
        var i;
        $scope.filter.ownerVisibility = option.selected;
        for (i = 0; i < $scope.ownerOptions.length; i++) {
            if ($scope.ownerOptions[i].value !== option.value && $scope.ownerOptions[i].selected !== '') {
                $scope.ownerOptions[i].selected = '';
            }
        }
    };

    $scope.refreshList = function() {
        var message = {
            event: 'reload'
        };
        $rootScope.$broadcast('vlocity.layout.campaign-member-list.events', message);
    };

    onMemberDeleted = $scope.$on('campaign-member-deleted', function(e, data) {
        var i;
        if ($scope.listMembers && $scope.listMembers.records) {
            for (i = 0; i < $scope.listMembers.records.length; i++) {
                if ($scope.listMembers.records[i].Id.value === data.campaignMemberId) {
                    if (i < $scope.listMembers.records.length - 1) {
                        $scope.campaignMemberDetail($scope.listMembers.records[i + 1]);
                    }else if (i ===  $scope.listMembers.records.length - 1 && i > 0) {
                        $scope.campaignMemberDetail($scope.listMembers.records[i - 1]);
                    }
                    $scope.listMembers.records.splice(i, 1);
                    break;
                }
            }
        }
    });
    $scope.$on('$destroy', onMemberDeleted);

    $scope.calcPageNo = function() {
        var str = 'No Records';
        $scope.pageSize = 10;
        if ($scope.totalRecords && !$scope.emptyResults) {
            if ($scope.listMembers.records.length === $scope.pageSize) {
                str = (((($scope.currentPage + 1) * $scope.pageSize) - $scope.pageSize) + 1) + ' - ' + (($scope.currentPage + 1) * $scope.pageSize) + ' of ' + $scope.totalRecords;
            } else {
                str = (((($scope.currentPage + 1) * $scope.pageSize) - $scope.pageSize) + 1) + ' - ' + ($scope.totalRecords) + ' of ' + $scope.totalRecords;
            }
        }
        $scope.pageNoStr = str;
    };

    $scope.navigateTo = function(member) {
        var id = '';
        if (member.LeadId.value !== null) {
            id = member.LeadId.value;
        }if (member.ContactId.value !== null) {
            id = member.ContactId.value;
        }
        if (id) {
            if ((typeof sforce !== 'undefined') && (sforce !== null)) {
                sforce.one.navigateToSObject(id, 'detail');
            } else {
                window.location.href = '/' + id;
            }
        }
    };

    onUpdateMemberStatus = $rootScope.$on('update-member-status', function(e, data) {
        var reordered = false;
        var activeStatus = [];
        var activeDateRange = [];
        var filterSet = false;
        var key, key2;
        if ($scope.listMembers.records !== undefined) {
            $scope.isListLoading = true;
            console.log('Data', data);
            $scope.refreshDetail = false;
            if ($scope.filter.status && $scope.listMembers.records) {
                for (key in $scope.filter.status) {
                    if ($scope.filter.status[key]) {
                        activeStatus.push(key);
                        filterSet = true;
                    }
                }
                if (filterSet && activeStatus.indexOf(data.Status.value) < 0) {
                    $scope.query();
                    reordered = true;
                }
            }
            if ($scope.filter.sortBy.Status && !reordered) {
                $scope.reorderedMemberId = data.Id.value;
                $scope.query();
                reordered = true;
            }
            if ($scope.filter.dateRange && $scope.listMembers.records && !reordered) {
                for (key2 in $scope.filter.dateRange) {
                    if ($scope.filter.dateRange[key] && key !== 'ALL') {
                        activeDateRange.push(key);
                        filterSet = true;
                    }
                }
                $rootScope.log('targetCallDate', data);
                if (filterSet && activeDateRange.indexOf(data[$scope.nameSpacePrefix + 'TargetCallDate__c']) < 0) {
                    $scope.query();
                    reordered = true;
                }
            }
            if ($scope.filter.sortBy.TargetCallDate__c && !reordered) {
                $scope.reorderedMemberId = data.Id.value;
                $scope.query();
                reordered = true;
            }
            $scope.isListLoading = false;
        }

    });
    $scope.$on('$destroy', onUpdateMemberStatus);
});

},{}],4:[function(require,module,exports){
angular.module('campaignCallList').controller('CampaignDetailsController', function(
    $scope, $rootScope, CampaignAggInfo, ResponsiveHelper, CampaignService, NotificationHandler) {
    'use strict';
    $scope.nameSpacePrefix = fileNsPrefix();
    $scope.isLoaded = false;
    $scope.campaignAggInfo = new CampaignAggInfo($scope);
    $scope.responsiveHelper = new ResponsiveHelper($scope);
    $scope.notificationHandler = new NotificationHandler();
    $scope.obj = {};
    $scope.selectedTemplate = {};
    $scope.emailTemplates = [];
    $scope.isCampaignOwner = false;
    $scope.campaignId = '';
    $scope.attachments = [];
    $scope.docTypes = ['ai', 'attachment', 'audio', 'box_notes', 'csv', 'eps', 'excel', 'exe', 'flash', 'gdoc', 'gdocs', 'gform', 'gpres', 'gsheet', 'html', 'image', 'keynote',
                        'link', 'mp4', 'overlay', 'pack', 'pages', 'pdf', 'ppt', 'psd', 'rtf', 'slide', 'stypi', 'txt', 'unknown', 'video', 'visio', 'webex', 'word', 'xml', 'zip'];

    $scope.setObj = function(obj, id) {
        $scope.obj = obj;
        $scope.campaignId = id;
        $rootScope.log('obj', $scope.obj);
        $scope.isLoaded = true;
        $rootScope.campaignEmailTemplate = obj[$scope.nameSpacePrefix + 'EmailTemplate__c'];
        $rootScope.campaignEmail.subject = obj[$scope.nameSpacePrefix + 'MassEmailSubject__c'];
        $rootScope.campaignEmail.content = obj[$scope.nameSpacePrefix + 'MassEmailContent__c'];
        if (obj.OwnerId === $rootScope.loginUserId) {
            $scope.isCampaignOwner = true;
        }
        $scope.campaignAggInfo.getMembersAggInfoByCampaign();
        $scope.getEmailTemplates();
        $scope.getAtt();
    };

    $scope.saveSelectedTemplate = function() {
        CampaignService.setCampaignEmailTemplate($scope.params.id, $scope.selectedTemplate.DeveloperName, $scope).then(function(data) {
            $rootScope.campaignEmailTemplate = $scope.selectedTemplate.DeveloperName;
            $rootScope.log('Campaign email template is set to: ', $rootScope.campaignEmailTemplate);
        }, function(error) {
            $scope.notificationHandler.handleError(error);
        });
    };

    $scope.getEmailTemplates = function() {
        CampaignService.getEmailTemplates($scope).then(function(data) {
                $rootScope.log('getEmailTemplates: ', data);
                $scope.emailTemplates = data.result.records;
                if ($scope.emailTemplates && $scope.emailTemplates.length > 0) {
                    for (let i = 0; i < $scope.emailTemplates.length; i++) {
                        if ($scope.emailTemplates[i].DeveloperName === $rootScope.campaignEmailTemplate) {
                            $scope.selectedTemplate = $scope.emailTemplates[i];
                            break;
                        }
                    }
                }
                $rootScope.log('emailTemplates: ', $scope.emailTemplates);
            }, function(error) {
                $scope.notificationHandler.handleError(error);
            });
    };

    $scope.getAtt = function() {
        CampaignService.getAttachments($scope.campaignId).then(function(data) {
            if(data.result.records){
                $scope.attachments = data.result.records;
                for(let i = 0; i < $scope.attachments.length; i++){
                    let type;
                    if($scope.attachments[i].ContentType) {
                        type = $scope.attachments[i].ContentType.split("/");
                        if($scope.docTypes.indexOf(type[1]) > -1){
                            $scope.attachments[i].icon = type[1];
                        } else if($scope.docTypes.indexOf(type[0]) > -1) {
                            $scope.attachments[i].icon = type[0];
                        } else {
                            $scope.attachments[i].icon = 'attachment';
                        }
                    } else {
                        $scope.attachments[i].icon = 'attachment';
                    }
                }
            }
        }, function(error) {
            console.log('error', error);
        });
    };

    $scope.navigateTo = function(id) {
        if (id) {
            if ((typeof sforce !== 'undefined') && (sforce !== null)) {
                sforce.one.navigateToSObject(id, 'related');
                console.log('navigateTOSObject');
            } else {
                console.log('/' + id);
                window.location.href = '/' + id;
            }
        }
    };

});

},{}],5:[function(require,module,exports){
angular.module('campaignCallList').controller('CampaignMemberController', function(
    $scope, $rootScope, $timeout, CampaignService, CampaignAggInfo, ResponsiveHelper,
    NotificationHandler, DeviceDetection, $sldsModal) {
    'use strict';
    // Event Variables to $destroy:
    var onMemberDataObj, updateCampaignMemberData, onShowLogActions;
    $scope.nameSpacePrefix = fileNsPrefix();
    $scope.isLoaded = false;
    $scope.obj = {};
    $scope.toggleTabsClass = '';
    $scope.sldsActivePane = -1;
    $scope.statusOpen = false;
    $scope.campaignAggInfo = new CampaignAggInfo($scope);
    $scope.responsiveHelper = new ResponsiveHelper($scope);
    $scope.notificationHandler = new NotificationHandler();
    $scope.logActionsModal = false;
    $scope.campaignMember = $rootScope.campaignMember;
    $scope.callBacks = [{
        label: 'Call Back: Tomorrow',
        action: 'oneDay'
    }, {
        label: 'Call Back: One Week',
        action: 'oneWeek'
    }, {
        label: 'Call Back: One Month',
        action: 'oneMonth'
    }];
    $scope.useEmailTemplate = false;
    $scope.hasAttachments = false;
    $scope.emailModel = {
        subject: '',
        message: ''
    };
    // Device Detection
    $scope.deviceDetection = new DeviceDetection();
    $scope.isMobile = $scope.deviceDetection.isMobile();
    if ($scope.isMobile) {
        $scope.importedScope = $scope;
    }

    updateCampaignMemberData = function() {
        if ($scope.isMobile) {
            if ($rootScope.campaignMember.datePickerDate) {
                $rootScope.campaignMember.datePickerDate = new Date($rootScope.campaignMember.datePickerDate);
            }
            $rootScope.campaignMember.objectTypeRoute = ($rootScope.campaignMember.ContactId.value !== null) ? 'contacts' : 'leads';
            $rootScope.campaignMember.objectType = ($rootScope.campaignMember.ContactId.value !== null) ? 'ContactId' : 'LeadId';
        }
        $scope.campaignMemberId = $rootScope.campaignMember.Id.value;
        $rootScope.log('New Campaign Member', $rootScope.campaignMember);
        $scope.cardLoaded = true;
        if ($rootScope.campaignMember.ContactId && !$rootScope.campaignMember.memberActions) {
            $rootScope.campaignMember.memberActions = [];
            if ($scope.isMobile) {
                $rootScope.campaignMember.memberMobileActions = [];
                $rootScope.campaignMember.memberMobileActions.push({
                    name: 'Call',
                    label: 'Call',
                    icon: 'call',
                    class: 'call-action',
                    type: 'tel:',
                    url: ''
                }, {
                    name: 'SMS',
                    label: 'SMS',
                    icon: 'sms',
                    class: 'sms-action',
                    type: 'sms:',
                    url: ''
                });
            }
            if ($rootScope.campaignMember.actions.sendEmail) {
                $rootScope.campaignMember.memberActions.push({
                    name: 'Email',
                    label: 'Email',
                    icon: 'email',
                    class: 'email-action',
                    url: ''
                });
            }
            $rootScope.campaignMember.memberActions.push({
                name: 'Script',
                label: 'Script',
                icon: 'edit_form',
                class: 'script-action',
                url: $rootScope.campaignMember[$scope.nameSpacePrefix + 'CampaignOmniScriptURL__c'].value
            });
            $rootScope.log('$scope.campaignMember.memberActions: ', $scope.campaignMember.memberActions);
        }
        $scope.campaignMember = $rootScope.campaignMember;
    };

    // Only works on Desktop since controllers are not all loaded at once on mobile
    onMemberDataObj = $scope.$on('campaign-member-data-object', function() {
        if (!$scope.isMobile) {
            updateCampaignMemberData();
        }
    });
    $scope.$on('$destroy', onMemberDataObj);

    // On Mobile, since $rootScope.campaignMember is changed on click of a list member
    if ($scope.isMobile && !angular.equals({}, $rootScope.campaignMember)) {
        updateCampaignMemberData();
    }

    $scope.createLogs = function(records) {
        var i, j, k, tab, field, coeff, now, rounded;
        $rootScope.log('records fed to createLogs: ', records);
        if (!$rootScope.memberTabs.length) {
            $rootScope.memberTabs = records;
            for (i = 0; i < $rootScope.memberTabs.length; i++) {
                tab = {
                    title: $rootScope.memberTabs[i].fields.storyObject.objName,
                    // template: 'member-tabs-new-' + $rootScope.memberTabs[i].fields.storyObject.objName.toLowerCase() + '.tpl.html',
                    template: 'member-tabs-form.tpl.html',
                    className: 'new-' + $rootScope.memberTabs[i].fields.storyObject.objName.toLowerCase()
                };
                // Add default now dates to date and datetime fields:
                for (j = 0; j < $rootScope.memberTabs[i].fields.storyObject.fieldList.length; j++) {
                    field = $rootScope.memberTabs[i].fields.storyObject.fieldList[j];
                    coeff = 1000 * 60 * 5;
                    now = new Date();
                    rounded = new Date(Math.round(now.getTime() / coeff) * coeff);
                    if ($rootScope.memberTabs[i].fields.storyObject.fieldNameTypeMap[field].indexOf('DATE') > -1) {
                        $rootScope.memberTabs[i].fields.storyObject.fieldValueMap[field] = new Date($scope.formatDatetime(rounded));
                    }
                }
                $rootScope.memberTabs[i].tabUI = tab;
            }
            $rootScope.log('memberTabs', $rootScope.memberTabs);
        } else {
            // In order not to reload the layout each time, we have to update storyId:
            for (k = 0; k < $rootScope.memberTabs.length; k++) {
                $rootScope.memberTabs[k].actions['save' + $rootScope.memberTabs[k].fields.storyObject.objName].remote.params.storyId = $scope.campaignMember.Id.value;
                $rootScope.memberTabs[k].actions['save' + $rootScope.memberTabs[k].fields.storyObject.objName].rest.params.storyId = $scope.campaignMember.Id.value;
            }
        }
    };

    // Method to show log actions overlay on mobile
    $scope.showLogActions = function() {
        $scope.logActionsModal = $sldsModal({
            templateUrl: 'modals/modal-member-log-actions.tpl.html',
            scope: $scope
        });
    };

    onShowLogActions = $rootScope.$on('via-campaign-show-log-actions', function() {
        $scope.logActionsModal = $sldsModal({
            templateUrl: 'modals/modal-member-log-actions.tpl.html',
            scope: $scope
        });
    });
    $scope.$on('$destroy', onShowLogActions);

    $scope.showTabPanes = function() {
        if ($scope.toggleTabsClass === 'via-toggle-tabs-collapsed' ||
            $scope.toggleTabsClass === '') {
            $scope.toggleTabsClass = 'via-toggle-tabs-expanded';
        }
    };

    $scope.hideTabPanes = function() {
        $rootScope.log('window width: ', $scope.responsiveHelper.getWindowWidth());
        $rootScope.log('30em: ', $scope.responsiveHelper.getPixelFromEm(30));
        if ($scope.responsiveHelper.bpSmall) {
            $scope.logActionsModal.hide();
            $scope.toggleTabsClass = 'via-toggle-tabs-collapsed';
            $rootScope.log('Hid log actions modal', $scope.logActionsModal);
        } else {
            $scope.toggleTabsClass = 'via-toggle-tabs-collapsed';
        }
        $timeout(function() {
            $scope.sldsActivePane = -1;
            $rootScope.log('sldsActivePane: ', $scope.sldsActivePane);
        }, 500);
    };

    // Button click function for log action tabs:
    $scope.createNewStory = function(tab) {
        var updateDatasource, i;
        var storyObject = tab.fields.storyObject;
        var actionObj = tab.actions['save' + storyObject.objType];
        actionObj.remote.remoteClass = 'StoryListHandler';
        actionObj.remote.params.attMap = storyObject.fieldValueMap;
        actionObj.rest.params.attMap = storyObject.fieldValueMap;
        actionObj.remote.params.storyId = $scope.campaignMember.Id.value;
        actionObj.rest.params.storyId = $scope.campaignMember.Id.value;
        actionObj.remote.params.fieldNameTypeMap = storyObject.fieldNameTypeMap;
        actionObj.rest.params.fieldNameTypeMap = storyObject.fieldNameTypeMap;
        actionObj.remote.params.objName = storyObject.objType;
        actionObj.rest.params.objName = storyObject.objType;
        $rootScope.log('storyObject.objType: ', storyObject.objType);
        $rootScope.log('actionObj: ', actionObj);
        CampaignService.invokeAction(actionObj).then(function(result) {
            $rootScope.log('Result for createNewStory: ', result);
            updateDatasource = {
                event: 'updateDatasource',
                message: {
                    params: {
                        storyId: $scope.campaignMember.Id.value,
                        lastActivityDate: '',
                        lastObjId: null
                    },
                    appendFlag: false,
                    updateSilently: false,
                    bypassTemplateRefresh: false
                }
            };
            $rootScope.$broadcast('vlocity.layout.campaign-member-stories.events', updateDatasource);
            $rootScope.log('Campaign Member: ', $scope.campaignMember);
            $scope.hideTabPanes();
            $timeout(function() {
                for (i = 0; i < storyObject.fieldList.length; i++) {
                    if (storyObject.fieldNameTypeMap[storyObject.fieldList[i]] === ('BOOLEAN')) {
                        storyObject.fieldValueMap[storyObject.fieldList[i]] = false;
                    } else if (storyObject.fieldNameTypeMap[storyObject.fieldList[i]].indexOf('DATE') < 0) {
                        storyObject.fieldValueMap[storyObject.fieldList[i]] = null;
                    }
                }
                $rootScope.notification.message = 'Successfully logged ' + storyObject.objType + ' for ' + $rootScope.campaignMember.Name.value;
                $rootScope.notification.type = 'success';
                $rootScope.notification.active = true;
            }, 500);
        }, function(error) {
            $scope.notificationHandler.handleError(error);
        });
    };

    $rootScope.log('$scope', $scope);
    $rootScope.log('$scope.campaignMember: ', $scope.campaignMember);

    $scope.setObj = function(obj) {
        $scope.obj = obj;
        $rootScope.log('obj', $scope.obj);
        $scope.isLoaded = true;
        $rootScope.log('CampaignMemberController:setObj:params.id: ', $scope.params.id);
        if (angular.equals({}, $rootScope.campaignEmail)) {
            CampaignService.getCampaignInfo($scope.params.id, $scope).then(function(data) {
                $rootScope.campaignEmail.subject = data.result.records[0][$scope.nameSpacePrefix + 'MassEmailSubject__c'];
                $rootScope.campaignEmail.content = data.result.records[0][$scope.nameSpacePrefix + 'MassEmailContent__c'];
                $scope.emailModel.subject = $rootScope.campaignEmail.subject;
                $scope.emailModel.message = $rootScope.campaignEmail.content;
            }, function(error) {
                $scope.notificationHandler.handleError(error);
            });
        } else {
            $scope.emailModel.subject = $rootScope.campaignEmail.subject;
            $scope.emailModel.message = $rootScope.campaignEmail.content;
        }

    };

    $scope.statusFilter = function(record) {
        if (record.Label.value !== $scope.campaignMember.Status.value) {
            return record;
        }
    };

    $scope.toggleStatusDropdown = function() {
        $scope.statusOpen = !$scope.statusOpen;
    };

    // Close status select picklist if user clicks outside of it somewhere
    $scope.$watch('statusOpen', function(newValue, oldValue) {
        if (newValue && !oldValue) {
            $('body').on('click', function(e) {
                e.stopPropagation();
                if (e.target.parentNode.className.indexOf('status-select') > -1) {
                    return;
                }
                $scope.statusOpen = false;
                // Unbind click event from whole document
                $(this).off('click');
            });
        }
    });

    $scope.updateMemberStatus = function(campaignMemberId, newStatus) {
        var currentDate = new Date();
        var updateMemberStatus = $scope.campaignMember.actions.updateMember;
        updateMemberStatus.remote.params.memberStatus = newStatus;
        updateMemberStatus.rest.params.memberStatus = newStatus;
        updateMemberStatus.remote.params.campaignId = $scope.campaignMember.CampaignId.value;
        updateMemberStatus.rest.params.campaignId = $scope.campaignMember.CampaignId.value;
        updateMemberStatus.remote.params.lastCallDate = $scope.formatDatetime(currentDate);
        updateMemberStatus.rest.params.lastCallDate = $scope.formatDatetime(currentDate);
        updateMemberStatus.remote.params.actionType = newStatus;
        updateMemberStatus.rest.params.actionType = newStatus;

        CampaignService.invokeAction(updateMemberStatus).then(function(data) {
            $rootScope.log('updated member status ', data);
            $scope.campaignMember.Status.value = newStatus;
            $scope.statusOpen = false;
            $rootScope.membersAggInfoByCampaign = data.result.records;
            $rootScope.membersAggInfoByCampaign.totalMembers = data.result.totalSize;
            $rootScope.$broadcast('update-member-status', $scope.campaignMember);
            var updateDatasource = {
                event: 'updateDatasource',
                message: {
                    params: {
                        storyId: $scope.campaignMember.Id.value,
                        lastActivityDate: '',
                        lastObjId: null
                    },
                    appendFlag: false,
                    updateSilently: false,
                    bypassTemplateRefresh: false
                }
            };
            $rootScope.$broadcast('vlocity.layout.campaign-member-stories.events', updateDatasource);
            $rootScope.notification.message = 'Member Status successfully updated to ' + newStatus;
            $rootScope.notification.type = 'success';
            $rootScope.notification.active = true;
        }, function(error) {
            $scope.notificationHandler.handleError(error);
        });
    };

    $scope.changeCallDate = function(callBackAction, exactDate, newStatus) {
        var date = new Date();
        var newDate, newDateStr;
        var updateTargetCallDate = $scope.campaignMember.actions.updateMember;
        var targetCallDate = $scope.formatCallDate($scope.campaignMember[$scope.nameSpacePrefix + 'TargetCallDate__c'].value);
        $rootScope.log('exactDate formatted: ', $scope.formatCallDate(exactDate));
        $rootScope.log('exactDate: ', exactDate);
        $rootScope.log('targetCallDate: ', targetCallDate);
        if (callBackAction === null && !exactDate || $scope.formatCallDate(exactDate) === targetCallDate) {
            return;
        }
        if (callBackAction === 'oneDay') {
            newDate = new Date(date.setDate(date.getDate() + 1));
            $scope.campaignMember.isTimeSensitive = true;
        } else if (callBackAction === 'oneWeek') {
            newDate = new Date(date.setDate(date.getDate() + 7));
            $scope.campaignMember.isTimeSensitive = false;
            $scope.campaignMember.isPastDue = false;
        } else if (callBackAction === 'oneMonth') {
            newDate = new Date(date.setMonth(date.getMonth() + 1));
            $scope.campaignMember.isTimeSensitive = false;
            $scope.campaignMember.isPastDue = false;
        } else if (exactDate) {
            newDate = exactDate;
            $scope.campaignMember.isTimeSensitive = false;
            $scope.campaignMember.isPastDue = false;
        }
        newDateStr = (newDate === null || newDate === undefined) ? '' : $scope.formatDatetime(newDate);
        updateTargetCallDate.remote.params.targetCallDate = newDateStr;
        updateTargetCallDate.rest.params.targetCallDate = newDateStr;
        if (callBackAction) {
            updateTargetCallDate.remote.params.lastCallDate = $scope.formatDatetime(new Date());
            updateTargetCallDate.rest.params.lastCallDate = $scope.formatDatetime(new Date());
            if (!newStatus) {
                newStatus = 'Call Attempted';
            }
            updateTargetCallDate.remote.params.actionType = newStatus;
            updateTargetCallDate.rest.params.actionType = newStatus;
        }

        CampaignService.invokeAction(updateTargetCallDate).then(
            function(data) {
                console.log('success: ', data);
                $scope.campaignMember[$rootScope.nsPrefix + 'TargetCallDate__c'].value = (newDate === null || newDate === undefined) ? '' : newDate.toString();
                $scope.campaignMember.formattedDate = (newDate === null || newDate === undefined) ? '' : newDate.toLocaleString().split(',')[0];
                $scope.campaignMember.datePickerDate = (newDate === null || newDate === undefined) ? '' : newDate;
                $scope.statusOpen = false;
                $rootScope.$broadcast('update-member-status', $scope.campaignMember);
                if (callBackAction) {
                    var updateDatasource = {
                        event: 'updateDatasource',
                        message: {
                            params: {
                                storyId: $scope.campaignMember.Id.value,
                                lastActivityDate: '',
                                lastObjId: null
                            },
                            appendFlag: false,
                            updateSilently: false,
                            bypassTemplateRefresh: false
                        }
                    };
                    $rootScope.$broadcast('vlocity.layout.campaign-member-stories.events', updateDatasource);
                }
                $rootScope.notification.message = $scope.campaignMember.Name.value + '\'s Target Call Date successfully updated to ' + $scope.campaignMember.formattedDate;
                $rootScope.notification.type = 'success';
                $rootScope.notification.active = true;
            },
            function(error) {
                $scope.notificationHandler.handleError(error);
            }
        );
    };

    $scope.logAttemptedCall = function() {
        var currentDate = new Date();
        var lastCallDate = $scope.formatDatetime(currentDate);
        var logAttemptedCall = $scope.campaignMember.actions.updateMember;
        logAttemptedCall.remote.params.lastCallDate = lastCallDate;
        logAttemptedCall.rest.params.lastCallDate = lastCallDate;
        logAttemptedCall.remote.params.actionType = 'Call Attempted';
        logAttemptedCall.rest.params.actionType = 'Call Attempted';
        CampaignService.invokeAction(logAttemptedCall).then(
        function(data) {
            console.log('success: ', data);
            var updateDatasource = {
                event: 'updateDatasource',
                message: {
                    params: {
                        storyId: $scope.campaignMember.Id.value,
                        lastActivityDate: '',
                        lastObjId: null
                    },
                    appendFlag: false,
                    updateSilently: false,
                    bypassTemplateRefresh: false
                }
            };
            $rootScope.$broadcast('vlocity.layout.campaign-member-stories.events', updateDatasource);
            $rootScope.notification.message = $scope.campaignMember.Name.value + '\'s last call date has been updated to ' + $scope.formatCallDate(currentDate);
            $rootScope.notification.type = 'success';
            $rootScope.notification.active = true;
        },
        function(error) {
            $scope.notificationHandler.handleError(error);
        });
    };

    $scope.formatDatetime = function(d) {
        return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
            ('0' + (d.getDate())).slice(-2) + ' ' + ('0' + (d.getHours())).slice(-2) + ':' +
            ('0' + (d.getMinutes())).slice(-2) + ':' + ('0' + (d.getSeconds())).slice(-2);
    };

    $scope.goToOmniscript = function(url) {
        var nsUrl = url;
        if (url.indexOf('%nsp%') > 0) {
            nsUrl = url.replace('%nsp%', $scope.nameSpacePrefix);
            $rootScope.log('action nsUrl: ', nsUrl);
        }
        $rootScope.log('id: ', $scope.obj);
        $rootScope.log('action url: ', url);
        if ((typeof sforce !== 'undefined') && (sforce !== null)) {
            sforce.one.navigateToURL(nsUrl);
        } else {
            $rootScope.$broadcast('via-mobile-go-to-omniscript', nsUrl);
        }
    };

    $scope.formatCallDate = function(date) {
        // var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var callDate = new Date(date);
        // var formattedCallDate = months[callDate.getMonth()] + ' ' + callDate.getDate() + ', ' + callDate.getFullYear();
        var formattedCallDate = (callDate.getMonth() + 1) + '/' + callDate.getDate() + '/' + callDate.getFullYear();
        return formattedCallDate;
    };

    // Remove member
    $scope.deleteMember = function() {
        var deleteMember = $scope.campaignMember.actions.deleteMember;
        var deleteMemberName = $scope.campaignMember.Name.value;
        CampaignService.invokeAction(deleteMember).then(
            function(data) {
                $scope.currentPage = 0;
                $scope.objs = {};
                $scope.campaignMember = {};
                $rootScope.log('success: ', data);
                $rootScope.$broadcast('campaign-member-deleted', data.result.records[0]);
                $rootScope.notification.message = deleteMemberName + ' successfully deleted from Campaign.';
                $rootScope.notification.type = 'success';
                $rootScope.notification.active = true;
            },
            function(error) {
                $scope.notificationHandler.handleError(error);
            });
    };
    $scope.openDeleteWarning = function() {
        $sldsModal({
            templateUrl: 'modals/modal-member-delete.tpl.html',
            scope: $scope
        });
    };

    $scope.useTemplateModal = function() {
        var error = {};
        if ($scope.campaignMember.Email.value) {
            $sldsModal({
                templateUrl: 'modals/modal-use-email-template.tpl.html',
                scope: $scope
            });
        } else {
            error.data.message = 'Can not send email as this campaignmember does not have a email address.';
            $scope.notificationHandler.handleError(error);
        }
    };

    $scope.getCampaignAttachments = function(emailModal) {
        if (angular.equals({}, $rootScope.attachments)) {
            $rootScope.log('campaignId: ', $scope.params.id);
            CampaignService.getAttachments($scope.params.id, $scope).then(function(result) {
                $rootScope.attachments = result;
                $rootScope.log('getCampaignAttachments: ', $rootScope.attachments);
                $scope.hasAttachments = true;
                emailModal();
                $scope.isLoaded = true;
                $rootScope.log('$scope', $scope);
            }, function(error) {
                $scope.notificationHandler.handleError(error);
            });
        }
    };

    $scope.openEmailModal = function() {
        var error = {};
        var emailModal = function() {
            if ($scope.campaignMember.Email.value) {
                $sldsModal({
                    templateUrl: 'modals/modal-member-email.tpl.html',
                    scope: $scope
                });
            } else {
                error.data.message = 'Can not send email as this campaignmember does not have a email address.';
                $scope.notificationHandler.handleError(error);
            }
        };
        if (!angular.equals({}, $rootScope.attachments)) {
            $scope.hasAttachments = true;
            emailModal();
        } else {
            $scope.getCampaignAttachments(emailModal);
        }
        $rootScope.$watch('attachments', function(newValue, oldValue) {
            $rootScope.log('oldValue: ', oldValue);
            $rootScope.log('newValue: ', newValue);
            if (!angular.equals(oldValue, newValue) && newValue.result && newValue.result.records && newValue.result.records.length) {
                emailModal();
            }
        });
    };

    $scope.updateAttachments = function(attRec) {
        var att;
        for (att in $rootScope.attachments.result.records) {
            if ($rootScope.attachments.result.records[att].Id === attRec.Id) {
                $rootScope.attachments.result.records[att].isSelected = attRec.isSelected;
                break;
            }
        }

    };

    $scope.resetAttachments = function() {
        var att;
        if ($rootScope.attachments.result !== undefined) {
            for (att in $rootScope.attachments.result.records) {
                $rootScope.attachments.result.records[att].isSelected = false;
            }
        }
    };

    $scope.sendEmail = function(subj, msg, useTemplate) {
        var sendEmail;
        var attachmentIds, i;
        $scope.campaignMember.actions.sendEmail.remote.params.campaignEmailTemplate = $rootScope.campaignEmailTemplate;
        $scope.campaignMember.actions.sendEmail.rest.params.campaignEmailTemplate = $rootScope.campaignEmailTemplate;
        sendEmail = $scope.campaignMember.actions.sendEmail;
        sendEmail.remote.params.useTemplate = useTemplate;
        sendEmail.rest.params.useTemplate = useTemplate;
        if (!useTemplate) {
            sendEmail.remote.params.subject = subj;
            sendEmail.rest.params.subject = subj;
            sendEmail.remote.params.message = msg;
            sendEmail.rest.params.message = msg;

            if ($rootScope.attachments && $rootScope.attachments.result.records) {
                attachmentIds = '';
                for (i = 0; i < $rootScope.attachments.result.records.length; i++) {
                    if ($rootScope.attachments.result.records[i].isSelected) {
                        if (attachmentIds !== '') {
                            attachmentIds += ',';
                        }
                        attachmentIds += $rootScope.attachments.result.records[i].Id;
                    }
                }
                sendEmail.remote.params.attachmentIds = attachmentIds;
                sendEmail.rest.params.attachmentIds = attachmentIds;
            }
        }

        CampaignService.invokeAction(sendEmail).then(
            function(data) {
                $scope.resetAttachments();
                $scope.currentPage = 0;
                var updateDatasource = {
                    event: 'updateDatasource',
                    message: {
                        params: {
                            storyId: $scope.campaignMember.Id.value,
                            lastActivityDate: '',
                            lastObjId: null
                        },
                        appendFlag: false,
                        updateSilently: false,
                        bypassTemplateRefresh: false
                    }
                };
                $rootScope.$broadcast('vlocity.layout.campaign-member-stories.events', updateDatasource);
                $rootScope.log('success: ', data);
                $rootScope.notification.message = 'Email successfully sent to ' + $scope.campaignMember.Name.value;
                $rootScope.notification.type = 'success';
                $rootScope.notification.active = true;
            },
            function(error) {
                $scope.notificationHandler.handleError(error);
                $scope.resetAttachments();
            });
    };

    $scope.invokeMemberActions = function(action) {
        if (action.name === 'Script') {
            $scope.goToOmniscript(action.url);
        } else if (action.name === 'Email') {
            if ($rootScope.campaignEmailTemplate !== 'NOTLOAD') {
                $scope.campaignMember[$scope.nameSpacePrefix + 'EmailTemplate__c'].value = $rootScope.campaignEmailTemplate;
            }

            if ($scope.campaignMember[$scope.nameSpacePrefix + 'EmailTemplate__c'].value) {
                $scope.useTemplateModal();
            } else {
                $scope.openEmailModal();
            }
        }
    };

    $scope.invokeMemberMobileActions = function(action) {
        console.log('Got into invokeMemberActions in mobile', action);
        if (action.name === 'Call' || action.name === 'SMS') {
            $scope.makeCallOrSms($scope.campaignMember.Phone.value, action.type);
        }
    };

    $scope.makeCallOrSms = function(phoneNumber, type) {
        var url;
        if (typeof phoneNumber === 'undefined' && !phoneNumber) {
            $rootScope.notification.message = 'There is no phone number for ' + $scope.campaignMember.Name.value;
            $rootScope.notification.type = 'error';
            $rootScope.notification.active = true;
        } else {
            url = type + phoneNumber.match(/(\d)/g).join('');
            window.open(url, '_system');
        }
    };

    $scope.navigateTo = function(member) {
        var id = '';
        if (member.LeadId.value !== null) {
            id = member.LeadId.value;
        }if (member.ContactId.value !== null) {
            id = member.ContactId.value;
        }
        if (id) {
            if ((typeof sforce !== 'undefined') && (sforce !== null)) {
                sforce.one.navigateToSObject(id, 'detail');
            } else {
                window.location.href = '/' + id;
            }
        }
    };

    $scope.$on('sldsModal.show', function() {
        angular.element('.slds-modal').addClass('slds-modal-shown');
    });

    $scope.viaModalHide = function(modal) {
        angular.element('.slds-modal').removeClass('slds-modal-shown');
        $timeout(function() {
            modal.$hide();
        }, 300);
    };
});

},{}],6:[function(require,module,exports){
angular.module('campaignCallList').controller('CampaignMemberStoriesController', function(
    $scope, $rootScope) {
    'use strict';
    // $rootScope.$on('campaign-member-id-sent', function(e, obj) {
    //     $scope.$parent.updateDatasource({storyId: obj.storyId}, false);
    // });
});

},{}],7:[function(require,module,exports){
angular.module('campaignCallList').directive('customAutofocus', function() {
    'use strict';
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
            if (scope.focusIndex !== null) {
                scope.$watch(function() {
                    if (scope.$eval(attrs.customAutofocus)) {
                        return scope.$eval(attrs.customAutofocus);
                    }
                }, function(newValue) {
                    if (newValue === true) {
                        element[0].focus();
                    }
                });
            }
        }
    };
});

},{}],8:[function(require,module,exports){
angular.module('campaignCallList').directive('hideNotification', function($rootScope, $timeout) {
    'use strict';
    return {
        restrict: 'A',
        link: function() {
            $rootScope.$watch('notification.message', function(newValue) {
                // Only fire on notification with message. Notifications without a message
                // will be when it closes
                if (newValue !== '') {
                    $timeout(function() {
                        // After 3 seconds, closes notification on mousedown of anywhere in the
                        // document except the notification itself (X closes though):
                        $('body').on('touchstart mousedown', function(e) {
                            e.preventDefault();
                            $rootScope.log('target: ', e);
                            if (e.target.parentNode && e.target.parentNode.className && e.target.parentNode.className.indexOf('slds-notify') > -1) {
                                return;
                            }
                            // Clear out notification
                            $timeout(function() {
                                $rootScope.notification.message = '';
                            }, 500);
                            $rootScope.notification.active = false;
                            // Have to apply rootScope
                            $rootScope.$apply();
                            // Unbind mousedown event from whole document
                            $(this).off('touchstart mousedown');
                        });
                    }, 2000);
                }
            });
        }
    };
});

},{}],9:[function(require,module,exports){
angular.module('campaignCallList')
.factory('CampaignService', ['$http', 'dataSourceService', 'dataService', '$q', function($http, dataSourceService, dataService, $q) {
    'use strict';
    var REMOTE_CLASS = 'CampaignListHandler';
    var DUAL_DATASOURCE_NAME = 'Dual';
    var insideOrg = false;
    var errorContainer = {};

    function getDualDataSourceObj(actionObj) {
        var datasource = {};
        var temp = '';
        var nsPrefix = fileNsPrefix().replace('__', '');

        if (actionObj.remote.remoteClass) {
            temp = REMOTE_CLASS;
            REMOTE_CLASS = actionObj.remote.remoteClass;
        }
        if (actionObj) {
            datasource.type = DUAL_DATASOURCE_NAME;
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.inputMap = actionObj.remote.params || {};
            datasource.value.remoteClass = REMOTE_CLASS;
            datasource.value.remoteMethod = actionObj.remote.params.methodName;
            datasource.value.endpoint = actionObj.rest.link;
            datasource.value.methodType = actionObj.rest.method;
            datasource.value.body = actionObj.rest.params;
        } else {
            console.log('Error encountered while trying to read the actionObject');
        }
        if (temp) {
            REMOTE_CLASS = temp;
        }
        return datasource;
    }

    return {
        getCampaignInfo: function(campaignId, scope) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('getting Campaign info');
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'CampaignListHandler';
            datasource.value.remoteMethod = 'getCampaignInfo';
            datasource.value.inputMap = {
                'campaignId': campaignId
            };
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.endpoint = '/services/apexrest/' + nsPrefix + '/v2/campaigns/' + campaignId;
            console.log('Datasource endpoint for getCampaignInfo: ', datasource.value.endpoint);
            datasource.value.apexRestResultVar = 'result.records';
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },

        getMembersAggInfoByCampaign: function(campaignId, scope) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('getting getMembersAggInfoByCampaign');
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'CampaignListHandler';
            datasource.value.remoteMethod = 'getCampaignInfo';
            datasource.value.inputMap = {
                'campaignId': campaignId,
                'include': 'memberStats'
            };
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.endpoint = '/services/apexrest/' + nsPrefix + '/v2/campaigns/' + campaignId + '?include=memberStats';
            console.log('Datasource endpoint for getCampaignMemberStats: ', datasource.value.endpoint);
            datasource.value.apexRestResultVar = 'result.records';
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },

        getMemberStatus: function(campaignId, scope) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('getting getMemberStatus');
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'CampaignListHandler';
            datasource.value.remoteMethod = 'getMemberStatusByCampaign';
            datasource.value.inputMap = {
                'campaignId': campaignId
            };
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.endpoint = '/services/apexrest/' + nsPrefix + '/v2/campaigns/' + campaignId + '/memberstatusvalues';
            datasource.value.apexRestResultVar = 'result.records';
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },

        getAttachments: function(campaignId, scope) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('getting attachments');
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'CampaignListHandler';
            datasource.value.remoteMethod = 'getCampaignAttachments';
            datasource.value.inputMap = {
                'campaignId': campaignId
            };
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.apexRestResultVar = 'result.records';
            datasource.value.endpoint = '/services/apexrest/' + nsPrefix + '/v2/campaigns/' + campaignId + '/attachments';
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },

        getEmailTemplates: function(scope) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var datasource = {};
            console.log('getting email templates');
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'CampaignListHandler';
            datasource.value.remoteMethod = 'getEmailTemplates';
            datasource.value.inputMap = {
            };
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.apexRestResultVar = 'result.records';
            datasource.value.endpoint = '/services/apexrest/' + nsPrefix + '/v1/emailtemplates';
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },

        setCampaignEmailTemplate: function(campaignId, template, scope) {
            var deferred = $q.defer();
            var nsPrefix = fileNsPrefix().replace('__', '');
            var nsEmailTemplate = fileNsPrefix() + 'EmailTemplate__c';
            var datasource = {};
            console.log('set campaign email templates');
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = 'CampaignListHandler';
            datasource.value.remoteMethod = 'updateCampaign';
            datasource.value.inputMap = {
                'campaignId': campaignId
            };
            datasource.value.inputMap[nsEmailTemplate] = template === undefined?'':template;
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'PUT';
            datasource.value.apexRestResultVar = 'result.records';
            datasource.value.endpoint = '/services/apexrest/' + nsPrefix + '/v2/campaigns/' + campaignId;
            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                }, function(error) {
                    console.error(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        },

        getAvailableProducts: function(orderId, forcetkClient) {
            var deferred = $q.defer();
            var payload = '[{"command":"getAvailProducts", "channel":"Mobile"}]';
            var method = 'POST';
            var endpoint;
            orderId = orderId ? orderId : '';
            endpoint = '/v1/CPQServices/' + orderId;
            console.log('getting getAvailableProducts');
            console.log(orderId);
            if (insideOrg) {

            } else { //outside
                dataService.getApexRest(endpoint,method,payload, forcetkClient).then(
                    function(data) {
                        console.log(data);
                        deferred.resolve(data.result);
                        // return records;

                    }, function(error) {
                        var errorMsg = '';
                        console.error(error);
                        try {
                            errorMsg = JSON.parse(error.responseText);
                            console.log(errorMsg[0]);
                            errorMsg = errorMsg[0].message;
                        }catch (e) {
                            errorMsg = error.status + ' - ' + error.statusText;
                        }

                        errorContainer.data = error;
                        errorContainer.message = errorMsg;
                        deferred.reject(errorContainer);
                    });
                return deferred.promise;
            }
        },
        /**
         * invokeAction : Use this method when the actions are straight forward based on actionObj.
         *
         * @param  {[object]} actionObj [Pass the action object]
         * @return {promise} [Result data]
         */
        invokeAction: function(actionObj) {
            var deferred = $q.defer();
            var datasource = getDualDataSourceObj(actionObj);

            dataSourceService.getData(datasource, null, null).then(
                function(data) {
                    deferred.resolve(data);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    };
}]);

},{}],10:[function(require,module,exports){
angular.module('campaignCallList')
.factory('NotificationHandler', function($rootScope) {
    'use strict';
    var NotificationHandler = function() {
        this.initialize = function() {

        };

        this.handleError = function(error) {
            $rootScope.log('error: ', error);
            $rootScope.notification.message = error.data.message || error.data.error;
            $rootScope.notification.type = 'error';
            $rootScope.notification.active = true;
        };

        this.initialize();
    };
    return (NotificationHandler);
});

},{}],11:[function(require,module,exports){
angular.module('campaignCallList')
.factory('ResponsiveHelper', function($rootScope) {
    'use strict';
    var ResponsiveHelper = function(scp) {
        this.windowWidth = window.innerWidth;

        this.getWindowWidth = function() {
            return window.innerWidth;
        };

        this.initialize = function() {
            $rootScope.log('Current Scope: ', scp);
            $rootScope.log('Window width: ', window.innerWidth);
        };

        this.getPixelFromEm = function(em) {
            var baseSize = 16; // px
            return em * baseSize;
        };

        if (this.getWindowWidth() < this.getPixelFromEm(64)) {
            $rootScope.rightColumn = {
                toggleRightClass: 'toggle-right-collapsed',
                largeBPWidth: '9',
                toggleIcon: 'richtextoutdent'
            };
        }

        this.toggleCollapseRightCol = function() {
            console.log('toggling');
            if ($rootScope.rightColumn.toggleRightClass === 'toggle-right-expanded') {
                $rootScope.rightColumn = {
                    toggleRightClass: 'toggle-right-collapsed',
                    largeBPWidth: '9',
                    toggleIcon: 'richtextoutdent'
                };
            } else {
                $rootScope.rightColumn = {
                    toggleRightClass: 'toggle-right-expanded',
                    largeBPWidth: '6',
                    toggleIcon: 'richtextindent'
                };
            }
        };

        // Breakpoint Checks
        this.bpXSmall = this.getWindowWidth() < this.getPixelFromEm(20);
        $rootScope.log('bpXSmall: ', this.bpXSmall);
        this.bpSmall = this.getWindowWidth() < this.getPixelFromEm(30);
        $rootScope.log('bpSmall: ', this.bpSmall);
        this.bpXMedium = this.getWindowWidth() < this.getPixelFromEm(43);
        $rootScope.log('bpXMedium: ', this.bpXMedium);
        this.bpMedium = this.getWindowWidth() < this.getPixelFromEm(48);
        $rootScope.log('bpMedium: ', this.bpMedium);
        this.bpLarge = this.getWindowWidth() < this.getPixelFromEm(64);
        $rootScope.log('bpLarge: ', this.bpLarge);

        this.initialize();
    };
    return (ResponsiveHelper);
});

},{}],12:[function(require,module,exports){
angular.module('campaignCallList').service('CampaignAggInfo', function($rootScope, CampaignService) {
    'use strict';
    var CampaignAggInfo = function(scp) {
        this.initialize = function() {
            // anything that immediately should fire upon instantiation
        };

        this.getMembersAggInfoByCampaign = function() {
            CampaignService.getMembersAggInfoByCampaign(scp.$parent.params.id, scp.$parent).then(function(data) {
                $rootScope.log('getMembersAggInfoByCampaign: ', data);
                $rootScope.membersAggInfoByCampaign = data.result.records[0].memberStats.records;
                $rootScope.membersAggInfoByCampaign.totalMembers = data.result.records[0].memberStats.totalSize;
                $rootScope.log('$rootScope.membersAggInfoByCampaign', $rootScope.membersAggInfoByCampaign);
            }, function(error) {
                $rootScope.log('error: ', error);
            });
        };

        this.getStatusProgessStyle = function(status) {
            var statusProgressStyle = {};
            statusProgressStyle.width = ((status.value / $rootScope.membersAggInfoByCampaign.totalMembers) * 100) + '%';
            return statusProgressStyle;
        };

        this.campaignAggInfogetStatusProgressPlacement = function(index) {
            var statusLength = $rootScope.membersAggInfoByCampaign.length;
            if (index < (statusLength - 1)) {
                $rootScope.membersAggInfoByCampaign[index].position = '-left';
            } else {
                $rootScope.membersAggInfoByCampaign[index].position = '-right';
            }
        };
    };
    return (CampaignAggInfo);
});

},{}],13:[function(require,module,exports){
angular.module('campaignCallList').service('DeviceDetection', ['$window', function($window) {
    'use strict';
    var DeviceDetection = function() {
        this.userAgent = $window.navigator.userAgent;
        this.browsers = {
            chrome: /chrome/i,
            safari: /safari/i,
            firefox: /firefox/i,
            msielte10: /msie/i,
            msiegt10: /rv:/i,
            edge: /edge/i
        };

        this.detectBrowser = function() {
            var key;
            var userAgent = this.userAgent;
            var browsers = this.browsers;
            for (key in browsers) {
                if (browsers[key].test(userAgent)) {
                    return key;
                }
            }
            return 'unknown';
        };

        this.getBrowserVersion = function() {
            var version, i;
            var browser = this.detectBrowser();
            var userAgent = this.userAgent;
            var versionSearch = [{
                browser: 'chrome',
                before: ' ',
                after: 'Chrome/'
            }, {
                browser: 'safari',
                before: ' ',
                after: 'Version/'
            }, {
                browser: 'firefox',
                before: '',
                after: 'Firefox/'
            }, {
                browser: 'msielte10',
                before: ';',
                after: 'MSIE '
            }, {
                browser: 'msiegt10',
                before: ')',
                after: 'rv:'
            }, {
                browser: 'edge',
                before: '',
                after: 'Edge/'
            }];

            for (i = 0; i < versionSearch.length; i++) {
                if (browser === versionSearch[i].browser) {
                    version = userAgent.split(versionSearch[i].after)[1];
                    if (versionSearch[i].before) {
                        version = parseFloat(version.substr(0, version.indexOf(versionSearch[i].before)));
                    }
                }
            }

            return version;
        };

        this.isMobile = function() {
            var check = false;
            (function(a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
                    check = true;
                }
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        };
    };
    return (DeviceDetection);
}]);

},{}],14:[function(require,module,exports){
angular.module("campaignCallList").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("dir-pagination-controls.tpl.html",'<ul class="pagination" ng-if="1 < pages.length">\n    <li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(1)">&laquo;</a>\n    </li>\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a>\n    </li>\n    <li ng-repeat="pageNumber in pages track by $index" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' }">\n        <a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a>\n    </li>\n\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a>\n    </li>\n    <li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.last)">&raquo;</a>\n    </li>\n</ul>\n\n\n'),$templateCache.put("member-tabs-form.tpl.html",'<div class="slds-form--stacked slds-clearfix member-tabs-{{tab.tabUI.className}}">\n    <div class="slds-form-element" ng-repeat="field in tab.fields.storyObject.fieldList">\n        <label ng-if="tab.fields.storyObject.fieldNameTypeMap[field] !== \'BOOLEAN\'" class="slds-form-element__label" for="{{tab.tabUI.className}}-{{field.toLowerCase()}}">{{tab.fields.storyObject.fieldNameLabelMap[field]}}</label>\n        <div class="slds-form-element__control">\n            <input ng-if="tab.fields.storyObject.fieldNameTypeMap[field] === \'STRING\' || tab.fields.storyObject.fieldNameTypeMap[field] === \'COMBOBOX\'" id="{{tab.tabUI.className}}-{{field.toLowerCase()}}" ng-model="tab.fields.storyObject.fieldValueMap[field]" class="slds-input" type="text" />\n            \x3c!-- <input ng-if="tab.fields.storyObject.fieldNameTypeMap[field] === \'STRING\' || tab.fields.storyObject.fieldNameTypeMap[field] === \'COMBOBOX\' || tab.fields.storyObject.fieldNameTypeMap[field].indexOf(\'DATE\') > -1" id="{{tab.tabUI.className}}-{{field.toLowerCase()}}" ng-model="tab.fields.storyObject.fieldValueMap[field]" class="slds-input" type="text" /> --\x3e\n            <input ng-if="tab.fields.storyObject.fieldNameTypeMap[field] === \'INTEGER\'" id="{{tab.tabUI.className}}-{{field.toLowerCase()}}" ng-model="tab.fields.storyObject.fieldValueMap[field]" class="slds-input" type="number" />\n            <div class="slds-grid slds-clearfix" ng-if="tab.fields.storyObject.fieldNameTypeMap[field] === \'DATETIME\' && !importedScope.isMobile">\n                <input id="{{tab.tabUI.className}}-{{field.toLowerCase()}}" ng-model="tab.fields.storyObject.fieldValueMap[field]" class="slds-input slds-float--left slds-size--1-of-2 slds-m-right--small" type="text" bs-datepicker="true" />\n                <input id="{{tab.tabUI.className}}-{{field.toLowerCase()}}--timepicker" ng-model="tab.fields.storyObject.fieldValueMap[field]" class="slds-input slds-float--left slds-size--1-of-2 slds-m-left--small" type="text" bs-timepicker="true" />\n            </div>\n            <div class="slds-grid slds-clearfix" ng-if="tab.fields.storyObject.fieldNameTypeMap[field] === \'DATETIME\' && importedScope.isMobile">\n                <input id="{{tab.tabUI.className}}-{{field.toLowerCase()}}" ng-model="tab.fields.storyObject.fieldValueMap[field]" class="slds-select via-mobile-datetime slds-float--left slds-size--1-of-2 slds-m-right--small" type="date" />\n                <input id="{{tab.tabUI.className}}-{{field.toLowerCase()}}--timepicker" ng-model="tab.fields.storyObject.fieldValueMap[field]" class="slds-select via-mobile-datetime slds-float--left slds-size--1-of-2 slds-m-left--small" type="time" />\n            </div>\n            <input ng-if="tab.fields.storyObject.fieldNameTypeMap[field] === \'DATE\' && !importedScope.isMobile" id="{{tab.tabUI.className}}-{{field.toLowerCase()}}" ng-model="tab.fields.storyObject.fieldValueMap[field]" class="slds-input" type="text" bs-datepicker="true" />\n            <input ng-if="tab.fields.storyObject.fieldNameTypeMap[field] === \'DATE\' && importedScope.isMobile" id="{{tab.tabUI.className}}-{{field.toLowerCase()}}" ng-model="tab.fields.storyObject.fieldValueMap[field]" class="slds-select via-mobile-datetime" type="date" />\n            <div ng-if="tab.fields.storyObject.fieldNameTypeMap[field] === \'PICKLIST\'" class="slds-select_container">\n                <select id="{{tab.tabUI.className}}-{{field.toLowerCase()}}" ng-model="tab.fields.storyObject.fieldValueMap[field]" class="slds-select" ng-options="picklist for picklist in tab.fields.storyObject.fieldPickValues[field]"></select>\n            </div>\n            <label ng-if="tab.fields.storyObject.fieldNameTypeMap[field] === \'BOOLEAN\'" class="slds-checkbox slds-m-top--medium">\n                <input type="checkbox" name="options" id="new-note-private" ng-model="tab.fields.storyObject.fieldValueMap[field]" />\n                <span class="slds-checkbox--faux"></span>\n                <span class="slds-form-element__label">{{tab.fields.storyObject.fieldNameLabelMap[field]}}</span>\n            </label>\n            <textarea ng-if="tab.fields.storyObject.fieldNameTypeMap[field] === \'TEXTAREA\'" id="{{tab.tabUI.className}}-{{field.toLowerCase()}}" ng-model="tab.fields.storyObject.fieldValueMap[field]" class="slds-textarea"></textarea>\n        </div>\n    </div>\n    <button class="slds-button slds-button--brand slds-float--right slds-m-top--medium" ng-click="importedScope.createNewStory(tab)">Save</button>\n    <button class="slds-button slds-button--neutral slds-float--right slds-m-top--medium slds-m-right--medium" ng-click="importedScope.hideTabPanes()">Cancel</button>\n</div>\n'),$templateCache.put("SldsTimepicker.tpl.html",'<div class="slds-dropdown slds-datepicker timepicker" style="min-width: 0px;width: auto">\n    <table height="100%">\n        <thead>\n            <tr class="text-center">\n                <th>\n                    <button tabindex="-1" type="button" class="slds-button slds-button--icon" ng-click="$arrowAction(-1, 0)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'chevronup\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Up</span>\n                    </button>\n                </th>\n                <th>&nbsp;</th>\n                <th>\n                    <button tabindex="-1" type="button" class="slds-button slds-button--icon" ng-click="$arrowAction(-1, 1)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'chevronup\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Up</span>\n                    </button>\n                </th>\n                <th>&nbsp;</th>\n                <th>\n                    <button ng-if="showSeconds" tabindex="-1" type="button" class="slds-button slds-button--icon" ng-click="$arrowAction(-1, 2)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'chevronup\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Up</span>\n                    </button>\n                </th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr ng-repeat="(i, row) in rows">\n                <td class="text-center" ng-class="{\'slds-is-selected\': row[0].selected}">\n                    <span class="slds-day" ng-class="{\'text-muted\': row[0].muted}" ng-bind="row[0].label" ng-click="$select(row[0].date, 0)" ng-disabled="row[0].disabled"></span>\n                </td>\n                <td><span ng-bind="i == midIndex ? timeSeparator : \' \'"></span></td>\n                <td class="text-center" ng-class="{\'slds-is-selected\': row[1].selected}">\n                    <span class="slds-day" ng-class="{\'text-muted\': row[1].muted}" ng-bind="row[1].label" ng-click="$select(row[1].date, 1)" ng-disabled="row[1].disabled"></span>\n                </td>\n                <td><span ng-bind="i == midIndex ? timeSeparator : \' \'"></span></td>\n                <td class="text-center" ng-class="{\'slds-is-selected\': row[2].selected}">\n                    <span class="slds-day" ng-class="{\'text-muted\': row[2].muted}" ng-bind="row[2].label" ng-click="$select(row[2].date, 2)" ng-disabled="row[2].disabled"></span>\n                </td>\n                <td ng-if="showAM">&nbsp;</td>\n                <td ng-if="showAM">\n                    <span class="slds-day" ng-show="i == midIndex - !isAM * 1" ng-click="$switchMeridian()" ng-disabled="el.disabled" ng-class="{\'slds-is-selected\': !!isAM}">AM</span>\n                    <span class="slds-day" ng-show="i == midIndex + 1 - !isAM * 1" ng-click="$switchMeridian()" ng-disabled="el.disabled" ng-class="{\'slds-is-selected\': !isAM}">PM</span>\n                </td>\n            </tr>\n        </tbody>\n        <tfoot>\n            <tr class="text-center">\n                <th>\n                    <button tabindex="-1" type="button" class="slds-button slds-button--icon" ng-click="$arrowAction(1, 0)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'chevrondown\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Down</span>\n                    </button>\n                </th>\n                <th>&nbsp;</th>\n                <th>\n                    <button tabindex="-1" type="button" class="slds-button slds-button--icon" ng-click="$arrowAction(1, 1)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'chevrondown\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Down</span>\n                    </button>\n                </th>\n                <th>&nbsp;</th>\n                <th>\n                    <button ng-if="showSeconds" tabindex="-1" type="button" class="slds-button slds-button--icon" ng-click="$arrowAction(1, 2)">\n                        <slds-button-svg-icon sprite="\'utility\'" icon="\'chevrondown\'"></slds-button-svg-icon>\n                        <span class="slds-assistive-text">Down</span>\n                    </button>\n                </th>\n            </tr>\n        </tfoot>\n    </table>\n</div>\n'),$templateCache.put("modals/modal-member-delete.tpl.html",'<div class="slds-modal slds-fade-in-open lds-modal--large">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button--icon-inverse slds-modal__close" ng-click="importedScope.viaModalHide(this)">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 class="slds-text-heading--small">Remove {{importedScope.campaignMember.Name.value}}</h2>\n        </div>\n        <div class="slds-modal__content">\n            <h2 class="slds-text-heading--small slds-p-around--x-large">Are you sure you\'d like to remove {{importedScope.campaignMember.Name.value}} from the campaign list?</h2>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="importedScope.viaModalHide(this)">Cancel</button>\n            <button type="button" class="slds-button slds-button--destructive" ng-click="deleteMember(); importedScope.viaModalHide(this)">Yes, Remove Member</button>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("modals/modal-use-email-template.tpl.html",'<div class="slds-modal slds-fade-in-open lds-modal--large">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button--icon-inverse slds-modal__close" ng-click="importedScope.viaModalHide(this)">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 class="slds-text-heading--small">Use Email Template?</h2>\n        </div>\n        <div class="slds-modal__content">\n            <div class="slds-form--stacked slds-m-around--x-large" id="use-template-container">\n                <div class="slds-form-element">\n                    <label class="slds-form-element__label slds-float--left" for="email-template-check">\n                        Use email template:</label>\n                    <div class="slds-form-element__control">\n                        <input id="email-template-check" class="slds-input" type="text" ng-model="campaignMember[nameSpacePrefix + \'EmailTemplate__c\'].value" custom-autofocus="true" ng-disabled="true"/>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="importedScope.viaModalHide(this)">Cancel</button>\n            <button type="button" class="slds-button slds-button--brand" ng-click="sendEmail(\'\', \'\', true); importedScope.viaModalHide(this)" >Yes</button>\n            <button type="button" class="slds-button slds-button--brand" ng-click="openEmailModal(); importedScope.viaModalHide(this)" >No</button>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("modals/modal-member-log-actions.tpl.html",'<div class="slds-modal slds-fade-in-open lds-modal--large">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button--icon-inverse slds-modal__close" ng-click="importedScope.viaModalHide(this)">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'" extra-classes="\'slds-button__icon--large\'"></slds-button-svg-icon>\n            </button>\n            <h2 class="slds-text-heading--small">Log Actions for {{importedScope.campaignMember.Name.value}}</h2>\n        </div>\n        <div class="slds-modal__content">\n            <div class="campaign-member-log-actions campaign-member-log-actions-mobile-modal slds-m-top--medium {{importedScope.toggleTabsClass}}">\n                <div class="member-log-actions-tabs" slds-tabs slds-active-pane="importedScope.sldsActivePane" template="SldsTabsScoped.tpl.html">\n                    <div ng-repeat="tab in $root.memberTabs" data-title="{{tab.tabUI.title}}" name="{{tab.tabUI.title}}" ng-include="tab.tabUI.template" slds-pane class="slds-clearfix"></div>\n                </div>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="importedScope.viaModalHide(this)">Close</button>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("modals/modal-member-email.tpl.html",'<div class="slds-modal slds-fade-in-open lds-modal--large">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-button--icon-inverse slds-modal__close" ng-click="importedScope.viaModalHide(this)">\n                <slds-button-svg-icon sprite="\'action\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">Close</span>\n            </button>\n            <h2 class="slds-text-heading--small">Send Email to {{importedScope.campaignMember.Name.value}}</h2>\n        </div>\n        <div class="slds-modal__content">\n            <div class="slds-form--stacked slds-m-around--x-large" id="email-container">\n                <div class="slds-form-element">\n                    <label class="slds-form-element__label slds-float--left" for="member-email-subject">\n                        <abbr class="slds-required" title="member-email-subject">*</abbr>Subject:</label>\n                    <div class="slds-form-element__control">\n                        <input id="member-email-subject" class="slds-input" type="text" placeholder="Enter Subject" ng-model="emailModel.subject" custom-autofocus="true" />\n                    </div>\n                </div>\n                <div class="slds-form-element" ng-class="{\'slds-has-error\' : messageError}">\n                    <label class="slds-form-element__label" for="member-email-message">\n                        <abbr class="slds-required" title="member-email-message">*</abbr>Message:</label>\n                    <div class="slds-form-element__control">\n                        <textarea id="member-email-message" class="slds-textarea" ng-model="emailModel.message" placeholder="Enter message"></textarea>\n                    </div>\n                </div>\n                 <fieldset class="slds-form-element is-required" ng-if="hasAttachments">\n                    <legend class="slds-form-element__legend slds-form-element__label">Select Attachments</legend>\n                    <div class="slds-form-element__control">\n                        <p class="slds-text-body--regular" ng-if="!$root.attachments.result.records">No attachments available on this Campaign.</p>\n                        <div ng-repeat="record in $root.attachments.result.records">\n                            <label class="slds-checkbox" for="attachment-{{$index}}">\n                                <input name="default" type="checkbox" ng-model="record.isSelected" id="attachment-{{$index}}" ng-change="updateAttachments(record)"/>\n                                <span class="slds-checkbox--faux"></span>\n                                <span class="slds-form-element__label">{{record.Name}}</span>\n                            </label>\n                        </div>\n                    </div>\n                </fieldset>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button--neutral" ng-click="importedScope.viaModalHide(this)">Cancel</button>\n            <button type="button" class="slds-button slds-button--brand" ng-click="sendEmail(emailModel.subject, emailModel.message, false); importedScope.viaModalHide(this)" ng-disabled="!emailModel.subject || !emailModel.message">Send</button>\n        </div>\n    </div>\n</div>\n'),$templateCache.put("SldsTooltip.tpl.html",'<div class="slds-popover slds-popover--tooltip slds-nubbin--bottom{{status.position}}" role="tooltip" ng-show="title">\n    <div class="slds-popover__body" ng-bind="title"></div>\n</div>\n'),$templateCache.put("notification-template.tpl.html",'<div class="slds-notify_container" hide-notification="true" ng-class="{\'show-notification\': $root.notification.active}">\n    <div class="slds-notify slds-notify--alert slds-theme--alert-texture" role="alert" ng-class="{\'slds-theme--success\': $root.notification.type === \'success\', \'slds-theme--error\': $root.notification.type === \'error\'}">\n        <button class="slds-button slds-button--icon-inverse slds-notify__close" ng-click="$root.notification.active = false">\n            <slds-button-svg-icon sprite="\'action\'" icon="\'close\'"></slds-button-svg-icon>\n            <span class="slds-assistive-text">Close</span>\n        </button>\n        <span class="slds-assistive-text">Info</span>\n        <h2 ng-bind-html="$root.notification.message"></h2>\n    </div>\n</div>\n'),$templateCache.put("SldsTabsScoped.tpl.html",'<div class="slds-tabs--scoped">\n    <ul class="slds-tabs--scoped__nav" role="tablist">\n        <li class="slds-tabs--scoped__item slds-text-heading--label" title="{{$pane.title}}" role="presentation" ng-repeat="$pane in $panes track by $index" ng-class="{\'slds-active\': $isActive($pane, $index)}" ng-click="!$pane.disabled && $setActive($pane.name || $index); importedScope.showTabPanes()">\n            <span class="slds-icon_container" title="description of icon when needed">\n                <slds-svg-icon no-hint="true" sprite="\'utility\'" size="\'large\'" icon="$pane.name.toLowerCase()" extra-classes="\'slds-icon-text-default\'"></slds-svg-icon>\n            </span>\n            <a class="slds-tabs--scoped__link" href="javascript:void(0);" role="tab" tabindex="$index" aria-selected="true" aria-controls="tab-scoped-{{$index}}" ng-bind-html="\'New \' + $pane.title" data-index="{{$index}}"></a>\n        </li>\n    </ul>\n    <div class="slds-tabs--scoped__content slds-show" role="tabpanel" aria-labelledby="tab-scoped-1__item" ng-transclude></div>\n</div>\n'),$templateCache.put("SldsDatepicker.tpl.html",'<div class="slds-datepicker slds-dropdown slds-dropdown--right" aria-hidden="false" ng-class="\'datepicker-mode-\' + $mode">\n    <div class="slds-datepicker__filter slds-grid">\n        <div class="slds-datepicker__filter--month slds-grid slds-grid--align-spread slds-grow">\n            <div class="slds-align-middle">\n                <button type="button" class="slds-button slds-button--icon-container" ng-click="$selectPane(-1)">\n                    <slds-button-svg-icon sprite="\'utility\'" icon="\'left\'" size="\'small\'"></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Previous Month</span>\n                </button>\n            </div>\n            <button type="button" class="slds-button slds-button--neutral slds-align-middle" ng-click="$toggleMode()" aria-live="assertive" aria-atomic="true"><span ng-bind="title"></span></button>\n            <div class="slds-align-middle">\n                <button type="button" class="slds-button slds-button--icon-container" ng-click="$selectPane(+1)">\n                    <slds-button-svg-icon sprite="\'utility\'" icon="\'right\'" size="\'small\'"></slds-button-svg-icon>\n                    <span class="slds-assistive-text">Next Month</span>\n                </button>\n            </div>\n        </div>\n    </div>\n    <table class="datepicker__month" role="grid" aria-labelledby="month">\n        <thead>\n            <tr id="weekdays" ng-if="showLabels" ng-bind-html="labels"></tr>\n        </thead>\n        <tbody>\n            <tr ng-repeat="(i, row) in rows">\n                <td ng-repeat="(j, el) in row" role="gridcell" aria-selected="{\'true\': el.selected, \'false\': !el.selected}" ng-class="{\'slds-is-today\': el.isToday && !el.selected, \'slds-is-selected\': el.selected}">\n                    <span class="slds-day" ng-class="{\'text-muted\': el.muted}" ng-bind="el.label" ng-click="$select(el.date)" ng-disabled="el.disabled"></span>\n                </td>\n            </tr>\n            <tr ng-if="$hasToday">\n                <td colspan="7" role="gridcell"><a href="javascript:void(0);" class="slds-show--inline-block slds-p-bottom--x-small" ng-click="$setToday()">Today</a></td>\n            </tr>\n        </tbody>\n    </table>\n</div>\n')}]);

},{}]},{},[1]);
})();

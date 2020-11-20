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
angular.module('campaignActions', ['vlocity',
    'ngSanitize'
]).config(['remoteActionsProvider', function(remoteActionsProvider) {
    'use strict';
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
}]);

// Controllers
require('./modules/campaignActions/controller/CampaignMassEmailController.js');

// Templates 
require('./modules/campaignActions/templates/templates.js');



},{"./modules/campaignActions/controller/CampaignMassEmailController.js":2,"./modules/campaignActions/templates/templates.js":3}],2:[function(require,module,exports){
angular.module('campaignActions').controller('CampaignMassEmailController', function(
    $scope, $sce, remoteActions) {
    'use strict';
    $scope.recipients = [];
    $scope.subject = '';
    $scope.message = '';
    $scope.lookup = true;
    $scope.campaignMembers = [];
    $scope.recipientError = false;
    $scope.messageError = false;
    $scope.nameSpacePrefix = '';
    $scope.contactList = [];
    $scope.emailSent = false;
    $scope.sentMessage = '';
    $scope.attachments = [];
    //This will hold the recipient Id and the type(Contact/Lead) of recipient
    $scope.recipientTypeMap = {};
    $scope.recipientEmailMap = {};
    if (window.campaignMembers !== undefined) {
        $scope.campaignMemberMap = JSON.parse(window.campaignMembers);
        $scope.campaignMembers = $scope.campaignMemberMap.combined;
        $scope.contactMembers = $scope.campaignMemberMap.contact;
        $scope.leadMembers = $scope.campaignMemberMap.lead;
    }
    if (window.nameSpacePrefix !== undefined) {
        $scope.nameSpacePrefix = window.nameSpacePrefix;
    }
    if (window.currentCampaign !== undefined) {
        $scope.currentCampaign = JSON.parse(window.currentCampaign);
        if ($scope.currentCampaign[$scope.nameSpacePrefix  + 'EmailTemplate__c'] === undefined) {
           $scope.useTemplate = false;
        } else {
           $scope.useTemplate = true;
        }
        console.log($scope.currentCampaign);
    }
    $scope.navigateTo = function(id) {
        if ((typeof sforce !== 'undefined') && (sforce !== null)) {
            sforce.one.navigateToSObject(id, 'detail');
        } else {
            window.location.href = '/' + id;
        }
    };

    //Compiles contact list
    $scope.getContactList = function() {
        for (var i = 0; i < $scope.campaignMembers.length; i++) {
            if ($scope.campaignMembers[i].Email !== undefined) {
                $scope.contactList.push($scope.campaignMembers[i]);
                $scope.recipientEmailMap[$scope.campaignMembers[i].Id] = $scope.campaignMembers[i].Email;
            }
        }
        $scope.contactList.sort((a,b) => (a.FirstName > b.FirstName) ? 1 : ((b.FirstName > a.FirstName) ? -1 : 0));
        //Iterate through the contact type memebers
        if ($scope.contactMembers) {
            for (var i = 0; i < $scope.contactMembers.length; i++) {
                $scope.recipientTypeMap[$scope.contactMembers[i].Id] = 'Contact';
            }
        }
        //Iterate through the Lead type memebers
        if ($scope.leadMembers) {
            for (var i = 0; i < $scope.leadMembers.length; i++) {
                $scope.recipientTypeMap[$scope.leadMembers[i].Id] = 'Lead';
            }
        }
    };
    $scope.getContactList();

    $scope.initEmail = function() {
        if ($scope.currentCampaign) {
            if ($scope.currentCampaign[$scope.nameSpacePrefix + 'MassEmailSubject__c']) {
                $scope.subject = $scope.currentCampaign[$scope.nameSpacePrefix + 'MassEmailSubject__c'];
            }
            if ($scope.currentCampaign[$scope.nameSpacePrefix + 'MassEmailContent__c']) {
                $scope.message = $scope.currentCampaign[$scope.nameSpacePrefix + 'MassEmailContent__c'];
            }
        }
    };
    $scope.initEmail();

    //Adds contact if it isn't in recipient list
    //Removes contact if already in recipient list
    $scope.addContact = function(index) {
        var id = $scope.contactList[index].Id;
        if ($scope.recipients.length === 0) {
            $scope.recipients.push(id);
            $scope.contactList[index].isRecipient = true;
        }else {
            var i = $scope.recipients.indexOf(id);
            if (i === -1) {
                $scope.recipients.push(id);
                $scope.contactList[index].isRecipient = true;
            }else {
                $scope.contactList[index].isRecipient = false;
                $scope.recipients.splice(i, 1);
            }
        }
        if ($scope.recipients === null || $scope.recipients === 'undefined') {
            $scope.recipients  = [];
        }
    };

    //Adds all contacts to recipient list
    $scope.addAllContacts = function() {
        for (var i = 0; i < $scope.contactList.length; i++) {
            if (!$scope.contactList[i].isRecipient) {
                $scope.addContact(i);
            }
        }
    };

    //Removes all contacts from recipient list
    $scope.removeAllContacts = function() {
        for (var i = 0; i < $scope.contactList.length; i++) {
            if ($scope.contactList[i].isRecipient) {
                $scope.addContact(i); 
            }
        }
        $scope.amountSelected();
    };

    //Compiles recipient, subject, and message fields
    $scope.sendEmail = function() {
        console.log('send email');
        if ($scope.message === '' && !$scope.useTemplate) {
            $scope.messageError = true;
        }else {
            $scope.messageError = false;
        }

        if (!$scope.messageError && !$scope.recipientError) {
            //Get separate recipients
            $scope.contactRecipients = [];
            $scope.leadRecipients = [];
            var emailRecipients = [];
            var emailIdMap = {};
            var attachmentIds = '';
            for (var i = 0; i < $scope.recipients.length; i++) {
                emailRecipients.push($scope.recipientEmailMap[$scope.recipients[i]]);
                var obj = {}; 
                if ($scope.recipientTypeMap[$scope.recipients[i]] === 'Contact') {
                    //$scope.recipientEmailMap
                    $scope.contactRecipients.push($scope.recipients[i]);
                    obj.recipientType = 'Contact';
                } else {
                    $scope.leadRecipients.push($scope.recipients[i]);
                    obj.recipientType = 'Lead';
                }
                obj.Id = $scope.recipients[i];
                emailIdMap[$scope.recipientEmailMap[$scope.recipients[i]]] = obj;
            }
            for (var i = 0; i < $scope.attachments.length; i++) {
                if ($scope.attachments[i].isSelected) {
                    attachmentIds += $scope.attachments[i].Id + ',';
                }
            }
            //send email!
            var emailMap = {
                'subject': $scope.subject,
                'message': $scope.message,
                'emailRecipients': emailRecipients, 
                'contactRecipients': $scope.contactRecipients,
                'leadRecipients': $scope.leadRecipients,
                'useTemplate': $scope.useTemplate,
                'campaignEmailTemplate': $scope.currentCampaign[$scope.nameSpacePrefix + 'EmailTemplate__c'],
                'campaignId': $scope.currentCampaign.Id,
                'emailIdMap': emailIdMap,
                'attachmentIds': attachmentIds
            };
            $scope.emailSent = true;
            console.log('This email will be sent:', emailMap);
            remoteActions.sendMassEmail(JSON.stringify(emailMap)).then(function(result) {
                console.log('Email call successful');
                $scope.sentMessage = 'Your Email Was Sent Successfully';
            }, function(error) {
                $scope.sentMessage = error.message;
            });
        }

    };

    //Counts how many contacts are selected from contactList
    $scope.amountSelected = function() {
        return $scope.recipients.length + '/' + $scope.contactList.length;
    };

    $scope.getAtt = function() {
        remoteActions.getAttachments($scope.currentCampaign.Id).then(function(result) {
            console.log('Attachments', result);
            $scope.attachments = result;
        }, function(error) {
            console.log('error', error);
        });
    };
    $scope.getAtt();

    $scope.updateAttachments = function(attachment) {
        console.log(attachment);
    };


});

},{}],3:[function(require,module,exports){
angular.module("campaignActions").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("dir-pagination-controls.tpl.html",'<ul class="pagination" ng-if="1 < pages.length">\n    <li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(1)">&laquo;</a>\n    </li>\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a>\n    </li>\n    <li ng-repeat="pageNumber in pages track by $index" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' }">\n        <a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a>\n    </li>\n\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a>\n    </li>\n    <li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.last)">&raquo;</a>\n    </li>\n</ul>\n')}]);

},{}]},{},[1]);
})();

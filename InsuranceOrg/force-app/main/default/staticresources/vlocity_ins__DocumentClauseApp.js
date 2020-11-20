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
var documentClauseApp = angular.module('documentClauseApp', ['vlocity', 'mgcrea.ngStrap',
    'ngSanitize', 'viaDirectives', 'ngAnimate', 'ngTagsInput', 'angularUtils.directives.dirPagination', 'ui.tinymce', 'sldsangular'
]).config(['remoteActionsProvider','$locationProvider', function(remoteActionsProvider, $locationProvider) {
    'use strict';
    remoteActionsProvider.setRemoteActions(window.remoteActions || {});
    $locationProvider.html5Mode(true);
}]);

// Services
require('./modules/documentClauseApp/services/BrowserDetection.js');

// Controllers
require('./modules/documentClauseApp/controller/DocumentClauseController.js');

// Directives
require('./modules/documentClauseApp/directive/HighlightTokens.js');
require('./modules/documentClauseApp/directive/VlcLoader.js');

// Templates
require('./modules/documentClauseApp/templates/templates.js');

},{"./modules/documentClauseApp/controller/DocumentClauseController.js":2,"./modules/documentClauseApp/directive/HighlightTokens.js":3,"./modules/documentClauseApp/directive/VlcLoader.js":4,"./modules/documentClauseApp/services/BrowserDetection.js":5,"./modules/documentClauseApp/templates/templates.js":6}],2:[function(require,module,exports){
//Controller for Data Raptor Mapping
angular.module('documentClauseApp').controller('documentClauseCtrl', function($scope, remoteActions, browserDetection, $filter, $q, $sldsModal, $timeout, $location) {
    'use strict';
    $scope.clauses = [];
    $scope.update = true;
    $scope.productsForClause = [];
    $scope.conditionalClauseProducts = [];
    $scope.nameSpacePrefix = window.nameSpacePrefix;
    $scope.initialCategoryOption = 'Select a Category';
    $scope.clauseCategories = [$scope.initialCategoryOption];
    $scope.clauseLanguages = [];
    $scope.productList = [];
    $scope.selectedProducts = [];
    $scope.selectedContractTypes = [];
    $scope.contractList = [];
    $scope.clauseData = {
        'clauseTokens': ''
    };
    $scope.typeOnClick = '';
    $scope.tempClauseData = {};
    $scope.finalClauseData = [];
    $scope.validationErrors = {};
    $scope.validationMessage = '';
    $scope.clauseScopeKeywords = {
        'editNew': 'New',
        'saveUpdate': 'Save'
    };
    $scope.productUrl = [];
    $scope.browser = browserDetection.detectBrowser();
    $scope.isSafari = ($scope.browser === 'safari') ? true : false;
    $scope.isInternetExplorer = ($scope.browser === 'msielte10' || $scope.browser === 'msiegt10') ? true : false;
    $scope.browserVersion = browserDetection.getBrowserVersion();
    console.log('Browser: ', $scope.browser);
    console.log('Browser Version: ', $scope.browserVersion);
    $scope.defaultContractType = '';

    if (window.modalLabels !== undefined) {
        $scope.modalLabels = window.modalLabels;
    }
    $scope.labels = {};
    var documentStylesheetRef = $('link[rel=stylesheet]').filter(function() {
        return /DocumentBaseCss/.test(this.getAttribute('href'));
    });
    this.$onInit = function() {
        var clauseId = getQueryString('clauseId');
        if(clauseId) {
            remoteActions.getClauseById(clauseId).then(function(result) {
                console.log('Clauses:', result);
                $scope.labels = result.labels;
                $scope.populateClauseDataHelper(result.clause);
                $timeout(function() {
                    angular.element(document).find('.vlocity').removeClass('preload');
                }, 500);
            });
        }else {
            $scope.createNewClauseHelper('Generic');
        }
    }
    /**
     * Get the value of a querystring
     * @param  {String} field The field to get the value of
     * @return {String}       The field value
     */
    var getQueryString = function (field) {
        var href = window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    $scope.goToClauseOverview = function() {
        location.href = location.origin + '/apex/DocClauseList';
    };
    $scope.tinymceOptions = {
        entity_encoding: "raw",
        body_class: 'vlocity',
        selector: 'textarea.tinymce-editor',  // change this value according to your HTML
        fixed_toolbar_container: '.tinymce-toolbar',
        advlist_number_styles: 'default,lower-alpha,upper-alpha,lower-roman,upper-roman',
        advlist_bullet_styles: 'default,circle,square',
        style_formats: [
            {title: 'Inline', items: [
              {title: 'Bold', icon: 'bold', format: 'bold'},
              {title: 'Italic', icon: 'italic', format: 'italic'},
              {title: 'Underline', icon: 'underline', format: 'underline'},
              {title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough'},
              {title: 'Superscript', icon: 'superscript', format: 'superscript'},
              {title: 'Subscript', icon: 'subscript', format: 'subscript'}
            ]},
            {title: 'Blocks', items: [
              {title: 'Paragraph', format: 'p'}
            ]},
            {title: 'Alignment', items: [
              {title: 'Left', icon: 'alignleft', format: 'alignleft'},
              {title: 'Center', icon: 'aligncenter', format: 'aligncenter'},
              {title: 'Right', icon: 'alignright', format: 'alignright'},
              {title: 'Justify', icon: 'alignjustify', format: 'alignjustify'}
            ]}
        ],
        height: 250,
        menubar: false,
        elementpath: false,
        plugins: [
          'code advlist autolink lists link image charmap preview hr anchor pagebreak',
          'searchreplace wordcount visualblocks visualchars code fullscreen',
          'insertdatetime media nonbreaking table contextmenu directionality',
          'template paste textcolor colorpicker textpattern'
        ],
        table_default_styles: {
            fontSize: '10pt',
            fontFamily: '\'Times New Roman\', times, serif',
            width: '100%'
        },
        paste_auto_cleanup_on_paste: true,
        init_instance_callback: function(editor) {
            if ($scope.clauseData.clauseArchived) {
                editor.getBody().setAttribute('contenteditable',false);
            }
            $(editor.getBody()).css({
                'font-family': '\'Times New Roman\', times, serif',
                'font-size': '10pt'
            });
            editor.on('ExecCommand',function(e) {
                var val, node, nodeParent, children, i, child;
                var cmd = e.command;
                if (cmd === 'FontSize' || cmd === 'FontName') {
                    val = e.value;
                    node = e.target.selection.getNode();
                    nodeParent = node.parentNode;
                    if (node.nodeName === 'SPAN' && nodeParent.nodeName === 'LI') {
                        children = $(node).children('li');
                        if (children) {
                            children.removeAttr('data-mce-style');
                            if (cmd === 'FontSize') {
                                children.css('font-size',val);
                                $(node.parentNode).css('font-size',val);
                            }
                            if (cmd === 'FontName') {
                                children.css('font-family',val);
                                $(node.parentNode).css('font-family',val);
                            }
                        }
                    } else if (node.nodeName === 'OL' || node.nodeName === 'UL') {
                        children = node.children;
                        for (i = 0; i < children.length; i++) {
                            child = $(children[i]);
                            child.removeAttr('data-mce-style');
                            if (cmd === 'FontSize') {
                                child.css('font-size',val);
                            }
                            if (cmd === 'FontName') {
                                child.css('font-family',val);
                            }
                        }
                    }
                }
            });
        },
        browser_spellcheck: true,
        toolbar1: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link searchreplace',
        toolbar2: 'preview | forecolor backcolor | code | table | fontselect fontsizeselect',
        content_css: documentStylesheetRef[0].getAttribute('href'),
        fontsize_formats: '6pt 7pt 8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 30pt 36pt'
    };

    $scope.getClauses = function() {
        remoteActions.getClauses().then(function(result) {
            console.log('Clauses:', result);
            $scope.labels = result.labels;
            $scope.clauses = result.clauses.concat(result.archived);
            $timeout(function() {
                angular.element(document).find('.vlocity').removeClass('preload');
            }, 500);
        });
    };
    $scope.getClauses();

    $scope.getDefaultContractType = function() {
        remoteActions.getDefaultContractType().then(function(result) {
            $scope.defaultContractType = result;
        });
    };
    $scope.getDefaultContractType();

    $scope.getContractTypeList = function() {
        remoteActions.getContractTypeList().then(function(result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].Name !== $scope.defaultContractType) {
                    var type = {'text': result[i].Name, 'id': result[i].Id};
                    $scope.contractList.push(type);
                }
            }
        });
    };
    $scope.getContractTypeList();

    $scope.switchToDefault = function() {
        $scope.clauseData.isDefault = true;
        $scope.clauseData.clauseContractTypes = $scope.defaultContractType;
        $scope.selectedContractTypes = [];
    };

    $scope.switchToCustom = function() {
        $scope.clauseData.isDefault = false;
        $scope.clauseData.clauseContractTypes = '';
        $scope.selectedContractTypes = [];
    };

    $scope.getCategories = function() {
        var i;
        remoteActions.getCategories().then(function(result) {
            for (i = 0; i < result.length; i++) {
                $scope.clauseCategories.push(result[i].Label);
            }
        });
    };
    $scope.getCategories();

    //get clause Languages
    $scope.getClauseLanguages = function() {
        remoteActions.getClauseLanguages().then(function(result) {
            $scope.clauseLanguages = result;
            //Adding 'None' option to the Language dropdown list.
            $scope.clauseLanguages.push({Label: "--None--",Value:"", isActive: true});
        });
    };
    $scope.getClauseLanguages();
    //Update the clauseLanguage on change.
    $scope.onSelectedLanguageChange = function(lang) {
      $scope.clauseData.clauseLanguage = lang.Value;
    }
    
    $scope.checkArchive = function() {
        $sldsModal({
            templateUrl: 'check-archive-clause.tpl.html',
            title: 'Warning',
            container: 'div.vlocity',
            placement: 'center',
            html: true,
            scope: $scope
        });
    }

    $scope.saveClause = function(update, archive, checkClauseShortName) {
        var validationMessage, i;
        $scope.archive = archive;
        $scope.clauseData.clauseName = $scope.clauseData.clauseName ? $scope.clauseData.clauseName.replace(/\s\s+/g, ' ') : $scope.clauseData.clauseName;
        $scope.clauseData.clauseContent = $scope.clauseData.clauseFormatted ?$scope.insertWrappers() : $scope.clauseData.nonFormattedContent;
        $scope.validateClause(update, checkClauseShortName);
        if ($scope.validationErrors.clauseValid) {
            $scope.getTokens($scope.clauseData.clauseContent);
            if ($scope.selectedContractTypes.length > 0) {
                $scope.getSelectedContractTypes();
            }
            if (!$scope.clauseData.clauseRestricted) {
                $scope.clauseData.clauseRestricted = false;
            }
            if($scope.clauseData.selectedLanguageObject) {
                $scope.clauseData.clauseLanguage = $scope.clauseData.selectedLanguageObject.Value;
            }
            
            $scope.finalClauseData.push(angular.copy($scope.clauseData));
            if($scope.clauseData.clauseShortName) {
                $scope.finalClauseData[0].clauseShortName = $scope.modalLabels.CLMClausePrefix + $scope.clauseData.clauseShortName;          
            }
            delete $scope.finalClauseData.selectedLanguageObject;
            delete $scope.finalClauseData.nonFormattedContent;

             if (update) {
                validationMessage = $scope.modalLabels.CLMClauseSavedSuccess;
                if (archive) {
                    validationMessage = $scope.modalLabels.CLMClauseSavedSuccess;
                    $scope.finalClauseData[0].clauseArchived = true;
                }
                $scope.vlcLoading = true;
                remoteActions.updateClause(JSON.stringify($scope.finalClauseData)).then(function() {
                    $scope.validationMessage = validationMessage;
                    console.log('Saving ', $scope.finalClauseData);
                    if (archive) {
                        //$scope.getClauses();
                        for (i = 0; i < $scope.clauses.length; i++) {
                            if ($scope.finalClauseData[0].clauseId === $scope.clauses[i].Id) {
                                $scope.clauses[i][$scope.nameSpacePrefix + ['IsArchived__c']] = true;
                            }
                        }
                    }
                    $scope.tempClauseData = angular.copy($scope.clauseData);
                    $scope.vlcLoading = false;
                    $scope.finalClauseData = [];
                });
            } else {
                $scope.vlcLoading = true;
                remoteActions.saveClause(JSON.stringify($scope.finalClauseData)).then(function(result) {
                    $scope.validationMessage = $scope.modalLabels.CLMClauseSavedSuccess;
                    $scope.clauseScopeKeywords.editNew = 'Editing';
                    $scope.clauseScopeKeywords.saveUpdate = 'Update';
                    $scope.clauseData.clauseId = result;
                    $scope.tempClauseData = angular.copy($scope.clauseData);
                    $location.search('clauseId', $scope.clauseData.clauseId).replace();
                    $scope.vlcLoading = false;
                    $scope.finalClauseData = [];
                });
            }
        }
    };

    // Helper method to add spans into sectionContent before it is saved to the db:
    $scope.insertWrappers = function() {
        if ($scope.clauseData.clauseContent) {
            $scope.clauseData.clauseContent = $scope.insertViawrappers($scope.clauseData.clauseContent);

            // Check sectionContent to see if the wrapper div exists with document styling:
            if ($scope.clauseData.clauseContent.indexOf('section-content-wrapper') < 0) {
                $scope.clauseData.clauseContent = '<div class="section-content-wrapper" style="font-size: 10pt;">' + $scope.clauseData.clauseContent + '</div>';
            }
        }
        return  $scope.clauseData.clauseContent;
     };

    //Help method to add viawrapper
    $scope.insertViawrappers = function(content) {
        var trimmedContent, htmlTagRegex, i, contentArray, charCode;
        if (content) {
            //Replace all occurrences of &nbsp; with ' ' except when immediately preceded by <p> and immediately followed by </p>
            trimmedContent = content.replace(/&nbsp;/g, ' ').replace(/<p>\s<\/p>/g, '<p>&nbsp;</p>');
            htmlTagRegex = /(<[^>]*>)/;
            contentArray = trimmedContent.split(htmlTagRegex);

            //wrap viawrapper around all text in content
            trimmedContent = '';
            for (i = 0; i < contentArray.length; i++) {
                charCode = contentArray[i].charCodeAt(0);
                if (contentArray[i] !== '' && contentArray[i].charAt(0) !== '<' &&
                    contentArray[i].slice(-1) !== '>' && charCode !== 10) {
                    contentArray[i] = '<viawrapper>' + contentArray[i] + '</viawrapper>';
                }
                if (i > 0) {
                    trimmedContent = trimmedContent + contentArray[i];
                }
            }
        }
        //console.log('after wrapping with viawrapper: ' + trimmedContent );
        return trimmedContent;
    };

    $scope.searchContractTypeList = function(query) {
        var contractTypeList = $scope.contractTypeListWrapper(query);
        return contractTypeList;
    };

    $scope.contractTypeListWrapper = function(query) {
        var deferred = $q.defer();
        var callbackfunction = function(result) {
            $scope.$apply(function() {
                var sresult = [];
                if (result) {
                    sresult = angular.fromJson(result);
                }
                deferred.resolve(sresult);
            });
        };
        $scope.searchContractListCallback(query,callbackfunction);
        return deferred.promise;
    };

    $scope.searchContractListCallback = function(query, callback) {
        var data;
        var filter = {};
        var contractList = $scope.contractList;
        query = query.trim();
        if (query !== '') {
            filter.text = query;
            data = $filter('filter')(contractList, filter);
            callback(data);
        }else {
            callback(contractList);
        }
    };

    $scope.addContractType = function($tag) {
        var i;
        var inArray = false;
        for (i = 0; i < $scope.selectedContractTypes.length; i++) {
            if ($scope.selectedContractTypes[i].id === $tag.id) {
                inArray = true;
            }
        }
        if (!inArray) {
            $scope.selectedContractTypes.push($tag);
        }
    };

    $scope.removeContractType = function($tag) {
        var i;
        for (i = 0; i < $scope.selectedContractTypes.length; i++) {
            if ($scope.selectedContractTypes[i].id === $tag.id) {
                $scope.selectedContractTypes.splice(i,1);
            }
        }
    };

    $scope.createNewClauseHelper = function(type) {
        $scope.validationErrors.clauseValid = true;
        $scope.validationErrors.clauseName = '';
        $scope.validationErrors.clauseCategory = '';
        $scope.validationErrors.clauseContent = '';
        $scope.validationErrors.shortNameValidationMessage = '';
        $scope.validationErrors.inValidShortName= false;
        $scope.validationMessage = '';

        // Reset Clause Data & finalClauseData objects
        $scope.clauseData = {
            'clauseTokens': ''
        };
        $scope.selectedProducts = [];
        $scope.finalClauseData = [];
        $scope.clauseScopeKeywords.editNew = 'New';
        $scope.clauseScopeKeywords.saveUpdate = 'Save';
        $scope.clauseData.clauseCategory = $scope.clauseCategories[0];
        $scope.clauseData.clauseType = type;
        $scope.clauseData.clauseContractTypes = $scope.defaultContractType;
        $scope.clauseData.isDefault = true;
        $scope.clauseData.clauseFormatted = false;
        $timeout(function() {
        //set userLocale as default Clause language.
        for (var j = 0; j < $scope.clauseLanguages.length; j++) {
            if( window.userLocale === $scope.clauseLanguages[j].Value) {
                $scope.clauseData.selectedLanguageObject = $scope.clauseLanguages[j];                   
            }
        }
        }, 500);

        $scope.selectedContractTypes = [];
    };

    $scope.getTokens = function(clauseContent) {
        var tokens, i, token;
        $scope.clauseData.clauseTokens = '';
        if (clauseContent) {
            tokens = clauseContent.match(/%%(.*?)%%|{{(.*?)}}/g);
            if (tokens !== null) {
                for (i = 0; i < tokens.length; i++) {
                    token = tokens[i];
                    $scope.clauseData.clauseTokens = $scope.clauseData.clauseTokens + ', ' + token;
                }
            }
            if ($scope.clauseData.clauseTokens) {
                $scope.clauseData.clauseTokens = $scope.clauseData.clauseTokens.substr(2);
            }
        }
    };

    $scope.getSelectedContractTypes = function() {
        var str = '';
        for (var i = 0; i < $scope.selectedContractTypes.length; i++) {
            str += $scope.selectedContractTypes[i].text + ';';
        }
        str = str.substring(0, str.length - 1);
        $scope.clauseData.clauseContractTypes = str;
    };
    $scope.throwWarningModal = function() {
        console.log('Is update ' + $scope.update);
        $sldsModal({
            templateUrl: 'check-save-clause.tpl.html',
            title: 'Warning',
            container: 'div.vlocity',
            placement: 'center',
            scope: $scope
        });
        return true;
    };

    $scope.checkDeleteClause = function() {
        $sldsModal({
            templateUrl: 'check-delete-clause.tpl.html',
            title: 'Delete Clause',
            container: 'div.vlocity',
            placement: 'center',
            html: true,
            scope: $scope
        });
    };

    $scope.deleteClause = function() {
        $scope.vlcLoading = true;
        remoteActions.deleteClause($scope.clauseData.clauseId).then(function(result) {
            if (result) {
                $scope.validationMessage = $scope.modalLabels.CLMClause + ' ' + $scope.modalLabels.CLMTemplateHasBeenDeleted;
                $scope.goToClauseOverview();
            } else {
                $sldsModal({
                    templateUrl: 'warning-active-clause.tpl.html',
                    title: 'Active Clause',
                    container: 'div.vlocity',
                    placement: 'center',
                    html: true,
                    scope: $scope
                });
            }
            $scope.vlcLoading = false;
        });
    };

    $scope.closeSuccessBanner = function() {
        $scope.validationMessage = '';
    };

    $scope.populateClauseDataHelper = function(clause) {
        if (clause.Id) {
            // Reset Validation errors on click of an existing clause:
            $scope.validationErrors.clauseValid = true;
            $scope.validationErrors.clauseName = '';
            $scope.validationErrors.clauseShortName = '';
            $scope.validationErrors.clauseCategory = '';
            $scope.validationErrors.clauseLanguage = '';
            $scope.validationErrors.clauseContent = '';
            $scope.validationErrors.shortNameValidationMessage ='';
            $scope.validationErrors.inValidShortName= false;
            $scope.validationMessage = '';

            // If clause is conditional, need to get list of products attached to it:
            if (clause[$scope.nameSpacePrefix + 'Type__c'] === 'Conditional') {
                $scope.getProductsForClause(JSON.stringify(clause.Id)); // Assigned to $scope.productsForClause
            }
            if (clause[$scope.nameSpacePrefix + 'IsArchived__c']) {
                $scope.clauseScopeKeywords.editNew = 'Archived';
            } else {
                $scope.clauseScopeKeywords.editNew = 'Editing';
            }
            $scope.clauseScopeKeywords.saveUpdate = 'Update';
            $scope.clauseData.clauseId = clause.Id;
            $scope.clauseData.clauseName = clause.Name;
            $scope.clauseData.clauseShortName = clause[$scope.nameSpacePrefix + 'ShortName__c'];
            $scope.clauseData.clauseType = clause[$scope.nameSpacePrefix + 'Type__c'];
            $scope.clauseData.clauseRestricted = clause[$scope.nameSpacePrefix + 'IsRestricted__c'];
            $scope.clauseData.clauseArchived = clause[$scope.nameSpacePrefix + 'IsArchived__c'];
            $scope.clauseData.clauseCategory = clause[$scope.nameSpacePrefix + 'Category__c'];
            $scope.clauseData.clauseLanguage = clause[$scope.nameSpacePrefix + 'LocaleCode__c'] || '';
            $scope.clauseData.clauseFormatted = clause[$scope.nameSpacePrefix + 'IsContentFormatted__c'] || false;
            $scope.clauseData.selectedLanguageObject = {};
            for (var j = 0; j < $scope.clauseLanguages.length; j++) {
                if($scope.clauseData.clauseLanguage === $scope.clauseLanguages[j].Value) {
                    $scope.clauseData.selectedLanguageObject = $scope.clauseLanguages[j];                   
                }
            }
            if($scope.clauseData.clauseShortName && $scope.clauseData.clauseShortName.startsWith($scope.modalLabels.CLMClausePrefix)){
                $scope.clauseData.clauseShortName = $scope.clauseData.clauseShortName.slice(3);
            }
            $scope.clauseData.clauseContent = clause[$scope.nameSpacePrefix + 'ClauseContent__c'];
            $scope.clauseData.clauseContractTypes = clause[$scope.nameSpacePrefix + 'ContractTypes__c'];
            $scope.clauseData.nonFormattedContent = !$scope.clauseData.clauseFormatted ? $scope.clauseData.clauseContent : '';
            if ($scope.clauseData.clauseContractTypes === undefined || $scope.clauseData.clauseContractTypes === $scope.defaultContractType) {
                $scope.clauseData.isDefault = true;
                $scope.clauseData.clauseContractTypes = $scope.defaultContractType;
            } else {
                $scope.clauseData.isDefault = false;
                $scope.selectedContractTypes = [];
                var selectedClauseTypes = $scope.clauseData.clauseContractTypes.split(';');
                for (var j = 0; j < $scope.contractList.length; j++) {
                    if (selectedClauseTypes.indexOf($scope.contractList[j].text) > -1) {
                        $scope.addContractType($scope.contractList[j]);
                    }
                }
            }
            $scope.tempClauseData = angular.copy($scope.clauseData);
            console.log($scope.clauseData);
        }
    };
    $scope.onIsFormatChange = function() {
        if($scope.clauseData.clauseFormatted) {
            $scope.clauseData.clauseContent = $scope.clauseData.nonFormattedContent;
        } else {
            $scope.clauseData.nonFormattedContent = tinyMCE.activeEditor.getContent({format : 'text'});
        }
        $sldsModal({
            templateUrl: 'change-clause-formatting.tpl.html',
            container: 'div.vlocity',
            placement: 'center',
            html: true,
            backdrop: 'static',
            scope: $scope
        });
    }
    $scope.cancelFormattingContentChanges = function() {
        $scope.clauseData.clauseFormatted =  !$scope.clauseData.clauseFormatted;
    }
    $scope.viewShortName = function() {
        $scope.shortNameClauseToken = '{{' + $scope.modalLabels.CLMClausePrefix + $scope.clauseData.clauseShortName + '}}';
        $sldsModal({
            templateUrl: 'view-clause-shortName-token.tpl.html',
            title: 'Clause Token',
            container: 'div.vlocity',
            placement: 'center',
            html: true,
            backdrop: 'static',
            scope: $scope
        });
    }
    $scope.copyToClipboard = function() {
        var tempInputElement = $('<input>');
        $('body').append(tempInputElement);
        tempInputElement.val($scope.shortNameClauseToken).select();
        document.execCommand('copy');
        tempInputElement.remove();
    }
    $scope.onShortNameChange = function() {
        $scope.clauseData.clauseShortName = $scope.clauseData.clauseShortName.toUpperCase();
        $scope.validationErrors.shortNameValidationMessage ='';
        $scope.validationErrors.inValidShortName= false;
        if(!$scope.clauseData.clauseShortName.match(/^[a-zA-Z0-9_]*$/)) {
            $scope.validationErrors.inValidShortName= true;
            $scope.validationErrors.shortNameValidationMessage = $scope.modalLabels.CLMClauseInvalidShortNameWarning;
        }
    }
    $scope.onShortNameCancel = function() {
        $scope.clauseData.clauseShortName = $scope.tempClauseData.clauseShortName;
    }
    $scope.validateClause = function(update, checkClauseShortName) {
        var i, j;
        $scope.validationErrors.clauseValid = true;
        $scope.validationErrors.clauseName = '';
        $scope.validationErrors.clauseShortName = '';
        $scope.validationErrors.clauseCategory = '';
        $scope.validationErrors.clauseLanguage = '';
        $scope.validationErrors.clauseContent = '';
        // Make sure name is unique
        if (update) {
            // Check Clause Name is unique except for currently saved name of this clause:
            if ($scope.tempClauseData.clauseName) {
                for (i = 0; i < $scope.clauses.length; i++) {
                    if ($scope.clauses[i].Name === $scope.clauseData.clauseName && $scope.clauses[i].Name !== $scope.tempClauseData.clauseName) {
                        $scope.validationErrors.clauseName = $scope.modalLabels.CLMClauseNameExists;
                        $scope.validationErrors.clauseValid = false;
                    }
                }
            }
            if(!checkClauseShortName && $scope.tempClauseData.clauseShortName 
                && $scope.tempClauseData.clauseShortName !== $scope.clauseData.clauseShortName){
                    $scope.validationErrors.clauseValid = false;
                    $sldsModal({
                        templateUrl: 'warning-shortName-clause.tpl.html',
                        title: 'shortName',
                        container: 'div.vlocity',
                        placement: 'center',
                        html: true,
                        backdrop: 'static',
                        scope: $scope
                    });
            } else {
                $scope.checkClauseShortName(true);
            }
        } else {
            // Check Clause Name is not empty, 80 chars or less, and unique:
            if ($scope.clauseData.clauseName) {
                for (j = 0; j < $scope.clauses.length; j++) {
                    if ($scope.clauses[j].Name === $scope.clauseData.clauseName) {
                        $scope.validationErrors.clauseName = $scope.modalLabels.CLMClauseNameExists;
                        $scope.validationErrors.clauseValid = false;
                    }
                }
            }
            // Check Clause ShortName is not empty, 24 chars or less, and unique:
            $scope.checkClauseShortName();
        }
        // Check Name
        if ($scope.clauseData.clauseName) {
            if ($scope.clauseData.clauseName.length > 80) {
                $scope.validationErrors.clauseName = $scope.modalLabels.CLMClauseCharMin +
                $scope.clauseData.clauseName.length + $scope.modalLabels.CLMClausePlsShorten;
                $scope.validationErrors.clauseValid = false;
            }
        }else {
            $scope.validationErrors.clauseName = $scope.modalLabels.CLMClauseNameEmptyMsg;
            $scope.validationErrors.clauseValid = false;
        }
        // Check clause ShortName
        if ($scope.clauseData.clauseShortName && $scope.clauseData.clauseShortName.length > 24) {
            $scope.validationErrors.clauseShortName = $scope.modalLabels.CLMClauseCharShortNameMin + ' '+
            $scope.clauseData.clauseShortName.length + $scope.modalLabels.CLMClausePlsShorten;
            $scope.validationErrors.clauseValid = false;
        }
        // Check Clause Category is selected:
        if ($scope.clauseData.clauseCategory === $scope.initialCategoryOption) {
            $scope.validationErrors.clauseCategory = $scope.modalLabels.CLMClauseSelectClauseCategory;
            $scope.validationErrors.clauseValid = false;
        }
        // Check Clause Content is not empty:
        if ($scope.clauseData.clauseContent) {
            if ($scope.clauseData.clauseContent.length > 32768) {
                $scope.validationErrors.clauseContent = $scope.modalLabels.CLMClauseContentCharMax +
                    $scope.clauseData.clauseContent.length + $scope.modalLabels.CLMClausePlsShorten;
                $scope.validationErrors.clauseValid = false;
            }
        } else {
            $scope.validationErrors.clauseContent = $scope.modalLabels.CLMClauseContentEmpty;
            $scope.validationErrors.clauseValid = false;
        }
    };

    //Check if clause ShortName is unique.
    $scope.checkClauseShortName = function(update) {
        //Check if clause ShortName is unique, except for currently saved shortName of this clause:
        if ($scope.clauseData.clauseShortName) {
            var allClauses = $scope.clauses;
            for (var i = 0; i < allClauses.length; i++) {
                var clauseShortName = allClauses[i][$scope.nameSpacePrefix + 'ShortName__c'];
                if(clauseShortName && clauseShortName.startsWith($scope.modalLabels.CLMClausePrefix)){
                    clauseShortName = clauseShortName.slice(3);
                }
                if (update ? (clauseShortName === $scope.clauseData.clauseShortName && clauseShortName !== $scope.tempClauseData.clauseShortName) 
                        : (clauseShortName === $scope.clauseData.clauseShortName)){
                    $scope.validationErrors.clauseShortName = $scope.modalLabels.CLMClauseShortNameExists;
                    $scope.validationErrors.clauseValid = false;
                }
            }
        }
    }   

});

},{}],3:[function(require,module,exports){
angular.module('documentClauseApp').directive('highlightTokens', function() {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element) {
            scope.$watch('clauseData.clauseContent', function() {
                $(element).data('highlighter').highlight();
            });
            $(element).highlightTextarea({
                words: ['%%(.+?)%%'],
                id: 'vlocToken',
                color: '#b3eafd'
            });
        }
    };
});

},{}],4:[function(require,module,exports){
angular.module('documentClauseApp').directive('vlcLoader', function() {
    return {
        restrict: 'E',
        templateNamespace: 'svg',
        replace: true,
        template:
        '<svg x="0px" y="0px" width="28" height="28" viewBox="0 0 48 48">'+
            '<g width="48" height="48">'+
                '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="0.75s" repeatCount="indefinite"/>'+
                '<path fill="#dedede" d="M24,45C12.4,45,3,35.6,3,24S12.4,3,24,3V0l0,0C10.7,0,0,10.7,0,24c0,13.3,10.7,24,24,24V45z"/>'+
                '<path fill="#05a6df" d="M24,3c11.6,0,21,9.4,21,21s-9.4,21-21,21v3l0,0c13.3,0,24-10.7,24-24C48,10.7,37.3,0,24,0V3z"/>'+
            '</g>'+
        '</svg>',
        scope: {
            stroke: '@'
        }                       
    };
});
},{}],5:[function(require,module,exports){
(function() {
    'use strict';
    window.angular.module('documentClauseApp').service('browserDetection', ['$window', function($window) {
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
                    if (version && versionSearch[i].before) {
                        version = parseFloat(version.substr(0, version.indexOf(versionSearch[i].before)));
                    }
                }
            }

            return version;
        };
    }]);
}());

},{}],6:[function(require,module,exports){
angular.module("documentClauseApp").run(["$templateCache",function($templateCache){"use strict";$templateCache.put("change-clause-formatting.tpl.html",'<div role="dialog" tabindex="-1" aria-labelledby="header43" class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-modal__close slds-button_icon-inverse">\n                <slds-button-svg-icon id="close-modal" sprite="\'utility\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">{{modalLabels.CLMClauseClose}}</span>\n            </button>\n            <h2 class="slds-text-heading_medium">Clause Format</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{modalLabels.CLMClauseFormatChangeWarning}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="cancelFormattingContentChanges(); $hide()">{{modalLabels.CLMClauseCancel}}</button>\n            <button type="button" class="slds-button slds-button_brand" ng-click="$hide();updateClauseContent();">OK</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n'),$templateCache.put("dir-pagination-controls.tpl.html",'<ul class="pagination" ng-if="1 < pages.length">\n    <li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(1)">&laquo;</a>\n    </li>\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }">\n        <a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a>\n    </li>\n    <li ng-repeat="pageNumber in pages track by $index" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' }">\n        <a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a>\n    </li>\n\n    <li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a>\n    </li>\n    <li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }">\n        <a href="" ng-click="setCurrent(pagination.last)">&raquo;</a>\n    </li>\n</ul>'),$templateCache.put("warning-shortName-clause.tpl.html",'<div role="dialog" tabindex="-1" aria-labelledby="header43" class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-modal__close slds-button_icon-inverse">\n                <slds-button-svg-icon id="close-modal" sprite="\'utility\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">{{modalLabels.CLMClauseClose}}</span>\n            </button>\n            <h2 class="slds-text-heading_medium">shortName</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>Change in shortName could impact templates that have content referring to the clause shortName </p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="$hide();saveClause(true,archive,true);">{{modalLabels.CLMClauseUpdate}}</button>\n            <button type="button" class="slds-button slds-button_destructive" ng-click="onShortNameCancel(); $hide()">{{modalLabels.CLMClauseCancel}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n'),$templateCache.put("check-delete-clause.tpl.html",'<div role="dialog" tabindex="-1" aria-labelledby="header43" class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-modal__close slds-button_icon-inverse" ng-click="$hide()">\n                <slds-button-svg-icon id="close-modal" sprite="\'utility\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">{{modalLabels.CLMClauseClose}}</span>\n            </button>\n            <h2 id="header43" class="slds-text-heading_medium">{{modalLabels.CLMClauseDeleteClause}}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{modalLabels.CLMClauseAreYouSureDelete}} {{clauseData.clauseName}}? {{modalLabels.CLMClauseActionNotUndone}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click=" $hide()">{{modalLabels.CLMClauseCancel}}</button>\n            <button type="button" class="slds-button slds-button_destructive" ng-click="deleteClause(); $hide()">{{modalLabels.CLMClauseDeleteClause}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n'),$templateCache.put("view-clause-shortName-token.tpl.html",'<div role="dialog" tabindex="-1" aria-labelledby="header43" class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-modal__close slds-button_icon-inverse" ng-click=" $hide()">\n                <slds-button-svg-icon id="close-modal" sprite="\'utility\'" icon="\'close\'" size="\'medium\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">{{modalLabels.CLMClauseClose}}</span>\n            </button>\n            <h4 class="slds-text-heading_medium">{{labels[nameSpacePrefix  + \'ShortName__c\']}}</h4>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n           <div> <p>  {{shortNameClauseToken}}  </p></div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="copyToClipboard(); $hide()">{{modalLabels.CLMCopyToClipboard}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n'),$templateCache.put("warning-active-clause.tpl.html",'<div role="dialog" tabindex="-1" aria-labelledby="header43" class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-modal__close slds-button_icon-inverse" ng-click=" $hide()">\n                <slds-button-svg-icon id="close-modal" sprite="\'utility\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">{{modalLabels.CLMClauseClose}}</span>\n            </button>\n            <h2 id="header43" class="slds-text-heading_medium">{{modalLabels.CLMClauseDeleteActiveClause}}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium slds-notify slds-notify_alert slds-theme_warning  slds-theme_alert-texture">\n             <label class="slds-form-element__label"><slds-svg-icon id="clause-page-header_icon" sprite="\'utility\'" icon="\'warning\'" size="\'small\'" extra-classes="\'slds-button__icon_left\'"></slds-svg-icon>{{modalLabels.CLMClauseDeleteActiveClause}}</label>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="$hide()">{{modalLabels.CLMClauseCancel}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n'),$templateCache.put("check-save-clause.tpl.html",'<div role="dialog" tabindex="-1" aria-labelledby="header43" class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-modal__close slds-button_icon-inverse">\n                <slds-button-svg-icon id="close-modal" sprite="\'utility\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">{{modalLabels.CLMClauseClose}}</span>\n            </button>\n            <h2 id="header43" class="slds-text-heading_medium">{{modalLabels.CLMClauseSave}}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{modalLabels.CLMClauseSaveChangesMsg}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button ng-if="update" type="button" class="slds-button slds-button_neutral" ng-click="$hide()">{{modalLabels.CLMClauseCancel}}</button>\n            <button ng-if="update" type="button" class="slds-button slds-button_destructive" ng-disabled="validationErrors.inValidShortName" ng-click="$hide();saveClause(true);">{{modalLabels.CLMClauseUpdate}}</button>\n            <button ng-if="!update"type="button" class="slds-button slds-button_neutral" ng-click="$hide()">{{modalLabels.CLMClauseCancel}}</button>\n            <button ng-if="!update" type="button" class="slds-button slds-button_destructive" ng-disabled="validationErrors.inValidShortName" ng-click="$hide();saveClause(false);">{{modalLabels.CLMClauseSave}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n'),$templateCache.put("check-archive-clause.tpl.html",'<div role="dialog" tabindex="-1" aria-labelledby="header43" class="slds-modal slds-fade-in-open">\n    <div class="slds-modal__container">\n        <div class="slds-modal__header">\n            <button class="slds-button slds-modal__close slds-button_icon-inverse" ng-click="$hide()">\n                <slds-button-svg-icon id="close-modal" sprite="\'utility\'" icon="\'close\'" size="\'large\'"></slds-button-svg-icon>\n                <span class="slds-assistive-text">{{modalLabels.CLMClauseClose}}</span>\n            </button>\n            <h2 id="header43" class="slds-text-heading_medium">{{modalLabels.CLMClauseArchiveClause}}</h2>\n        </div>\n        <div class="slds-modal__content slds-p-around_medium">\n            <div>\n                <p>{{modalLabels.CLMClauseArchiveClauseMsg}}</p>\n            </div>\n        </div>\n        <div class="slds-modal__footer">\n            <button type="button" class="slds-button slds-button_neutral" ng-click="$hide()">{{modalLabels.CLMClauseCancel}}</button>\n            <button type="button" class="slds-button slds-button_brand" ng-click="saveClause(true, true,false); $hide()">{{modalLabels.CLMClauseArchiveClause}}</button>\n        </div>\n    </div>\n</div>\n<div class="slds-backdrop slds-backdrop_open"></div>\n')}]);

},{}]},{},[1]);
})();

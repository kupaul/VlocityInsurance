/*************************************************************************
 *
 * VLOCITY, INC. CONFIDENTIAL
 * __________________
 *
 *  [2014] - [2017] Vlocity, Inc.
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Vlocity, Inc. and its suppliers,
 * if any. The intellectual and technical concepts contained
 * herein are proprietary to Vlocity, Inc. and its suppliers and may be
 * covered by U.S. and Foreign Patents, patents in process, and are
 * protected by trade secret or copyright law. Dissemination of this
 * information and reproduction, modification or reverse-engineering
 * of this material, is prohibited unless prior written permission
 * is obtained from Vlocity, Inc.
 */
    // Sample SFDC Connected App Consumer Key weird
    var SAMP_CONNECTED_APP_CONSUMER_KEY = '3MVG9szVa2RxsqBa5tQyU6.tKh61yiGXNhItGzvNJWh1oJh4fcI4pRlqlx1i2MLagkNovsmbaZfSE5mSZ6rCo';
    // Sample SFDC name space prefix
    var SAMP_SFDC_NAMESPACE = 'vlocity_ins';
    var remoteActionMap = {};
    remoteActionMap.GenericInvoke2 = '{!$RemoteAction.ChatBotDisplayController.GenericInvoke2}';

    window.sessionId = '{!$Api.Session_ID}';
    window.cbModuleList = 'default';
    window.VOmniForcengConAppId = SAMP_CONNECTED_APP_CONSUMER_KEY;
    window.VOmniServicesInject = [];

    var sfdcVars = {};
    sfdcVars.sNS = (window.parent.nsPrefix)?(window.parent.nsPrefix):(SAMP_SFDC_NAMESPACE);
    sfdcVars.botName = '';
    sfdcVars.noneDataControlTypeListV2 = 'default';
    sfdcVars.layout = 'lightning';
    sfdcVars.instanceHost = '..';
    sfdcVars.eleTypeToHTMLTemplateMap = {};

	// SFDC labels
    var customLabels = {"OmniRequired":"required",
                        "ChatBotNotAvailable":"The bot is down, please contact your administrator.",
                        "OmniLoading" : "Loading from the server..",
                        "RequestTooLarge":"Request Too Large",
                        "OmniNoSFDCConnection":"There is no Salesforce connection.",
                        "OmniMinLength":"Minimum length of",
                        "OmniMaxLength":"Maximum length of",
                        "OmniMinValue":"Minimum value",
                        "OmniMaxValue":"Maximum value",
                        "OmniMinInt":"Minimum Permitted Value: -9007199254740991",
                        "OmniMaxInt":"Maximum Permitted Value: 9007199254740991",
                        "OmniClear":"-- Clear --",
                        "OmniScriptSavingAttachmentsFailed":"Saving Attachments Failed",
                        "OmniUploadFailed":"Upload Failed",
                        "OmniMaxFileSize":"File Too Large",
                        "OmnisubmitLabel":"Submit",
                        "OmnicancelLabel":"Cancel",
                        "OmniDateMin":"Please select a date on or after",
                        "OmniDateMax":"Please select a date on or before",
                        "OmniDateDisabledDay": "This date has been disabled. ",
                        "OmniInvalidParseFormat":"The value does not match the expected format",
                        "OmniOK":"OK",
                        "OmniTimeMinMax": "Please select a time between",
                        "OmniStepValidationError": "Please fix all the fields with errors.",
                        "SldsDatetimeFormats":'{"AMPMS":["AM","PM"],"DAY":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"ERANAMES":["Before Christ","Anno Domini"],"ERAS":["BC","AD"],"FIRSTDAYOFWEEK":6,"MONTH":["January","February","March","April","May","June","July","August","September","October","November","December"],"SHORTDAY":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"SHORTMONTH":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"STANDALONEMONTH":["January","February","March","April","May","June","July","August","September","October","November","December"],"WEEKENDRANGE":[5,6],"fullDate":"EEEE, MMMM d, y","longDate":"MMMM d, y","medium":"MMM d, y h:mm:ss a","mediumDate":"MMM d, y","mediumTime":"h:mm:ss a","short":"M/d/yy h:mm a","shortDate":"M/d/yy","shortTime":"h:mm a"}'
                       };

    if(window.parent.omniMobile)
        window.parent.VlocOmniOut = window.parent.omniMobile;

    if (window.parent.VlocOmniOut && window.parent.VlocOmniOut.vlocityLabels) {
        Object.keys(window.parent.VlocOmniOut.vlocityLabels).forEach(function(key) {
            customLabels[key] = window.parent.VlocOmniOut.vlocityLabels[key];
        })
    }

    sessionStorage.setItem('vlocity.customLabels', JSON.stringify(customLabels));

    if(window.parent.VlocOmniOut && window.parent.VlocOmniOut.getChatBotIconUrl) {
        chatBotIconUrl = window.parent.VlocOmniOut.getChatBotIconUrl();
    }

    window.VOmniSetConnectedAppKey = function(key) {
    	window.VOmniForcengConAppId = key;
    }

    window.VOmniSetNameSpace = function(ns) {
    	sfdcVars.sNS = (window.parent.nsPrefix)?(window.parent.nsPrefix):(ns);
    }

    window.VOmniAddMoreCustomLabels = function(extraLabels) {
        for (var key in extraLabels) {
            if(extraLabels.hasOwnProperty(key)) {
            	customLabels[key] = extraLabels[key];
            }
        }
    }

    window.VOmniCustomServicesToInject = function(services)
    {
    	if(services && services.constructor === Array) {
    		window.VOmniServicesInject = services;
    	}
    }

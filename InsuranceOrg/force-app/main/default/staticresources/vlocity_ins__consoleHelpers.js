// Blank for now.
consoleHelper = (function () {
	var openSubTabList;
	var tabEvent = "ATabEventHasHappened";
	var SubTabMap = {};
	var tabInfoFreshness = null;
	var tabInfo;
	var objectInfoFreshness = null;
	var objectInfo;

	// FROM Persistent
	// I don't know if this is actually needed. 
	// sforce.connection.sessionId = '{!$Api.Session_ID}';
	
	var enclosingTabId;
	var delayTime = 200;
	// END Persistent

    var subTabMapcbFunc; // This is the callback for when mapping subtabs is done. This should probably be a list.
    var callsMade = 0; // This is the count of asych calls made when mapping subtabs.
    var currentlyRunning = false; // This is a simple lock to make sure that callsMade isn't modified until it is done.
    var queuedTabRequests = new Array();

    function tabOpenListener(result) {
        console.log(result.message);
    }

    function tabClosedListener(result) {
        console.log(result.message);
    }

    sforce.console.addEventListener(sforce.console.ConsoleEvent.OPEN_TAB, tabOpenListener);
    sforce.console.addEventListener(sforce.console.ConsoleEvent.CLOSE_TAB, tabClosedListener);

    // window.onload = function() {
    //     sforce.console.getEnclosingPrimaryTabId(getSubtabs);
    // };

    function restCall(restCall, cbSuc, cbFail) {
        if (restCall === undefined) {
            // TODO: Add logging.
            return; // Nothing to call. 
        }

        var tabsDone = new Promise(function (resolve, reject) { 
            $.ajax(restCall,
            {
                beforeSend: function(xhr) {
                    // Set the OAuth header from the session ID
                    xhr.setRequestHeader('Authorization', 'Bearer {!$Api.Session_ID}');
                },
                success: function(response) {
                    tabInfo = response;
                    resolve(response);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.status + ': ' + errorThrown);
                    reject(Error(errorThrown));
                }
            });
        });

        tabsDone.then(function(result) {
            // This is not currently used but it will be in the future. 
            tabInfoFreshness = Date.now();
            refreshTabIcons();
            if (cbSuc != null && cbSuc != undefined) {
                cbSuc(result);
            }
        }, function(err) {
            // Not sure what should be done but this should be filled out for 
            // troubleshooting and debugging purporses. 
            if (cbFail != null && cbFail != undefined) {
                cbFail(err);
            }
        });
    }
    
    function parseURL (url) {
        var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
        
        // Let the browser do the work
        parser.href = url;
        // Convert query string to object
        queries = parser.search.replace(/^\?/, '').split('&');
        for( i = 0; i < queries.length; i++ ) {
            split = queries[i].split('=');
            searchObject[split[0]] = split[1];
        }
        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            searchObject: searchObject,
            hash: parser.hash
        };
    }

    function getSubtabsHelper(subTabID) {
        callsMade++;
        //var thisObj = this;
        sforce.console.getPageInfo(subTabID, function (result) {
            callsMade--;
            var pageInfoJSON = $.parseJSON(result.pageInfo);

            var realObjID = parseURL(pageInfoJSON.url);
            realObjID = realObjID.pathname.split('/');
            realObjID = realObjID[realObjID.length-1];
            SubTabMap[realObjID] = subTabID;
            
            if (callsMade == 0) {
                currentlyRunning = false;
                subTabMapcbFunc(SubTabMap);                    
            }
        });
    }

    return {

        // These should really be abstracted. 
        /*======================================================================
            GET TAB CONFIG DATA 
         =====================================================================*/

        //TODO TEST THIS!
        loadTabData: function(cbSuc, cbFail) {
        	restCall('/services/data/v31.0/tabs', cbSuc, cbFail);
        },

        /*=====================================================================
            GET OBJECT DATA    
        =====================================================================*/
        // var objectDone = new Promise(function (resolve, reject) { 
        //     $.ajax('/services/data/v31.0/sobjects',
        //     {
        //         beforeSend: function(xhr) {
        //             // Set the OAuth header from the session ID
        //             xhr.setRequestHeader('Authorization', 'Bearer {!$Api.Session_ID}');
        //         },
        //         success: function(response) {
        //             objectInfo = response;
        //             resolve(response); 
        //         },
        //         error: function(jqXHR, textStatus, errorThrown) {
        //             console.log(jqXHR.status + ': ' + errorThrown);
        //             reject(Error(errorThrown));
        //         }
        //     });
        // });        

        // objectDone.then(function(results) {
        //     objectInfoFreshness = Date.now();
        //     refreshTabIcons();
        // }, function(err) {
        //     // Fill this out for ease of future debugging.
        // });

        /*=====================================================================
            OPEN SUBTABS AND MANAGE THEM    
        =====================================================================*/

        refreshTabIcons: function() {
            if (tabInfoFreshness === null | objectInfoFreshness == null) {
                return;
            }
        },

        // This needs to be called first to get all the subtabs.
        // I think that this was actually a first copy that didn't work.  
        getSubtabs2: function(result) {
            sforce.console.getSubtabIds(result.id, function(result1){
                this.openSubTabList2 = result1.ids;
                
                for (i = 0; i<openSubTabList.length; i++) {
                    sforce.console.getPageInfo(this.openSubTabList2[i], function(result2) {
                        var pageInfoJSON = $.parseJSON(result2.pageInfo);
                        SubTabMap[this.openSubTabList2] = pageInfoJSON['objectId'];
                    });
                }
            });
        },

        // This function just handles opening subtabs and is a wrapper for salesforce API.
        // ptID                 stObjID  focus           stName           stLoc      cbFunc                       stName1                                               
        // primaryTabId:String, url:URL, active:Boolean, tabLabel:String, id:String, (optional)callback:Function, (optional)name:String
        openSubTabManager: function(stObjID, stName, stLoc, focus, ptId, cbFunc, stName1) {
            
            if (stName == undefined) {
                stName = "New Subtab";
            }

            //stLoc should really be an index in the list 0 is first.             
            if (stLoc == undefined) {
                var stId = null;
            } else {
                stId = "scc-st-"+stLoc;
            }
            
            focus = focus || false;
            
            //if (cbFunc == undefined) var cbFunc = null;

            //if (stName1 == undefined) var stName1 = null;

            // Use closure to keep a reference of the object for the callback. TODO find a better way.
            var tmpObj = this;
            if (ptId == undefined) {
                sforce.console.getEnclosingPrimaryTabId(function (result) {
                    // Once the correct primary tab ID is obtained restart. 
                    tmpObj.openSubTabManager(stObjID, stName, stLoc, focus, result.id);
                });
                return;
            }

            // Code to be executed after SFDC code is ran. The callback is generated in here. ∏
            function handleSubtabOpen(result) {
                try {
                    this.cbFunc(result);
                } catch (err) {
                    console.log("Warning: openSubTabManager was passed undefined or some other error cbFunc");
                }

                if (result.success) {
                    stId = result.id;
                    sforce.console.refreshSubtabById(stId, focus, function (result) {
                    	console.log("refreshed success: " + result.success + ", " + stId);
                    }); // This doesnt appear to be working. 
                   sforce.console.setTabIcon(null, result.id);

                }  
            }

            function finallyCallOpen(result) {

                for (argParm in queuedTabRequests) {
                    // This should be reduced to a function call(no if).
                    argParm = queuedTabRequests[argParm];
                    if (result[argParm.stObjID] == null) {
                        sforce.console.openSubtab(argParm.ptId, argParm.stObjID, argParm.focus, 
                                                  argParm.stName, argParm.stId, 
                                                  argParm.handleSubtabOpen, argParm.stName1);
                    }
                    
                }
            }

            var tmpArgs = {
                stObjID:stObjID, 
                stName:stName, 
                stLoc:stLoc,
                focus:focus,
                ptId:ptId,
                cbFunc:cbFunc,
                stName1:stName1    
            };

            queuedTabRequests.push(tmpArgs);

            if (Object.keys(SubTabMap).length === 0) {
                if (!this.startMappingSubtabs(finallyCallOpen)) {
                    
                }
            } else {
                // This should determine if the SubTabMap is stale.
                finallyCallOpen(SubTabMap);

            }

        },
           
        /*==============================================================================
                          MAP OUT ALL SUBTABS AND OBJECTS
         =============================================================================*/        

        // This should probably be changed to use promises, but that can be the third iteration. 
        /**
         * This should be called to start mapping out subtabs. 
         * @return {Boolean} true if started false if already running.
         */
        startMappingSubtabs: function(cbFunc) {
            if (!currentlyRunning) {
                currentlyRunning = true;
                SubTabMap = {};

                subTabMapcbFunc = cbFunc;
                
                sforce.console.getEnclosingPrimaryTabId(function (result) {
                    var i = 0;
                    
                    sforce.console.getSubtabIds(result.id, function(result1){
                        openSubTabList = result1.ids;

                        for (i = 0; i<openSubTabList.length; i++) {
                            getSubtabsHelper(openSubTabList[i]);
                        }
                    });        
                });
            } else {
                return false;
            }
            return true;
        }
    };
})();

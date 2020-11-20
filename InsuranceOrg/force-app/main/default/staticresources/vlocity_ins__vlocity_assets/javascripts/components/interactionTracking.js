angular.module("vlocity")
.factory('interactionTracking', function(remoteActions, $rootScope, $log, $interval, configService, pageService, force) {
    var interactionsQueue = [];
    var interactionSubmitInterval = null;
    var interactionDataObj = {};

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    function sendInteractions() {
        $log.debug('interactionTracking in sendInteractions ',interactionsQueue);
        if(!interactionSubmitInterval) {
            interactionSubmitInterval =
                $interval(function () {
                var currentInteractions = interactionsQueue.length > 5 ? interactionsQueue.splice(0,5) : interactionsQueue.splice(0, interactionsQueue.length);
                $log.debug('interactionTracking in interactionSubmitInterval ',currentInteractions);
                if(typeof remoteActions != 'undefined' && remoteActions.trackVlocityInteraction && currentInteractions.length > 0){
                    try {
                        currentInteractions = angular.toJson(currentInteractions);
                        return remoteActions.trackVlocityInteraction(currentInteractions).then(
                            function(data) {
                                $log.debug('interactionTracking interactions logged successfully ',data);
                            },
                            function(error){
                                $log.debug('interactionTracking interactions error ',error);
                            }
                        );
                    } catch(e) {
                        $log.error('interactionTracking trackVlocityInteraction error ',e);
                    }

                } else if(currentInteractions.length > 0){ //if remoteActions is not there, in case of mobile
                    try {
                        currentInteractions = angular.toJson(currentInteractions);
                        var payload = {
                            sClassName: (fileNsPrefixDot() ? fileNsPrefixDot() : '') + 'CardCanvasController',
                            sMethodName: 'trackVlocityInteraction',
                            input: JSON.stringify({'trackingData' : currentInteractions}),
                            options: JSON.stringify({})
                        };
                        payload = JSON.stringify(payload);
                        force.request(
                            {
                                path: '/services/apexrest/'+fileNsPrefix().substring(0, fileNsPrefix().length - 2)+'/v1/invoke/',
                                method: 'POST',
                                data: payload
                            }).then(
                            function (result){
                                $log.debug('interactionTracking interactions logged successfully ',result);
                            },
                            function (error){
                                $log.debug('interactionTracking interactions error ',error);
                            });
                    } catch(e) {
                        $log.error('interactionTracking trackVlocityInteraction error ',e);
                    }
                } else {
                    $interval.cancel(interactionSubmitInterval);
                    $log.debug('interactionTracking Interaction loggin has not been enabled for this page');
                    interactionSubmitInterval = null;
                }
            }, 0);
        } else if(interactionSubmitInterval && interactionsQueue.length === 0) {
            $log.debug('interactionTracking cancelling interactionSubmitInterval');
            $interval.cancel(interactionSubmitInterval);
            interactionSubmitInterval = null;
        }
    }

    function addInteraction(interaction) {
        $rootScope.vlocity = $rootScope.vlocity || {};
        if(!$rootScope.vlocity.sessionToken) {
            $rootScope.vlocity.sessionToken = generateUUID();
        }
        interaction.VlocityInteractionToken = interaction.VlocityInteractionToken || $rootScope.vlocity.sessionToken;
        $log.debug('interactionTracking here I add interactions ',interaction);
        interactionsQueue.push(interaction);
        $log.debug('interactionTracking interactionsQueue ',interactionsQueue);
        enqueueInteractions();
    }

    function enqueueInteractions(interactions) {
        if(interactionsQueue.length > 0){
                sendInteractions();
        }
    }

    function track(interactionData) {
        setTimeout(function() {
                configService.isTrackingEnabled('CardFramework').then(function(enabled){
                        if (enabled) {
                            if (pageService.params.previewMode && $rootScope.vlocityCards.customSettings['Track.CardPreview'] !== undefined && !$rootScope.vlocityCards.customSettings['Track.CardPreview']) {
                                return; // if card preview tracking is disabled then return
                            }
                            addInteraction(interactionData);
                        }
                }, function(err) {
                    //error handling
                });
        }, 0);
    }

    function initInteraction(interactionData, isTimed, trackKey) {
        trackKey = trackKey ? trackKey : Date.now();
        if (isTimed) {
            interactionData.ElapsedTime = trackKey;
            interactionDataObj[trackKey] = interactionData;
        } else {
            interactionData.ElapsedTime = Date.now() - trackKey;
            track(interactionData);
        }
    }

    function doneInteraction(trackKey) {
        if (trackKey && interactionDataObj[trackKey]) {
            interactionDataObj[trackKey].ElapsedTime = Date.now() - interactionDataObj[trackKey].ElapsedTime;
            track(interactionDataObj[trackKey]);
            delete interactionDataObj[trackKey];
        }
    }

    return {
        getDefaultTrackingData : function() {
            $rootScope.vlocity = $rootScope.vlocity || {};
            if(!$rootScope.vlocity.sessionToken) {
                $rootScope.vlocity.sessionToken = generateUUID();
            }
            var defaultData = {
                'VlocityInteractionToken': $rootScope.vlocity.sessionToken,
                'Timestamp': Date.now()
            };
            return defaultData;
        },
        addInteraction: addInteraction,
        enqueueInteractions : enqueueInteractions,
        initInteraction: initInteraction,
        doneInteraction: doneInteraction
    };
});

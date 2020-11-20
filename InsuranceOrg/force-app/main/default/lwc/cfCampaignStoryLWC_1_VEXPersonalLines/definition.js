let definition = 
                {"GlobalKey__c":"CampaignStoryLWC/VEX Personal Lines/1/1586171308731","dataSource":{"type":null},"enableLwc":true,"filter":{"['objAPIName']":"Campaign"},"states":[{"blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"},{"field":"['onGoing']","logicalOperator":"&&","operator":"==","type":"custom","value":"true"}]},"definedActions":{"actions":[]},"disableAddCondition":false,"fields":[{"collapse":true,"editing":false,"fieldType":"standard","label":"Status","name":"['subtitle']","type":"string"},{"collapse":true,"editing":false,"fieldType":"standard","label":"Type","name":"['highlight']","type":"string"},{"collapse":true,"editing":false,"fieldType":"custom","label":"Responded","name":"['activityType']","type":"string"}],"filter":"$scope.data.status === 'active' && $scope.obj['onGoing'] == true","flyout":{"lwc":{"DeveloperName":"storyEditStateFlyout","Id":"0Rb3t000000LOsYCAI","MasterLabel":"storyEditStateFlyout","name":"storyEditStateFlyout"}},"lwc":{"MasterLabel":"storyOngoingStateInteraction","DeveloperName":"storyOngoingStateInteraction","Id":"0Rb3t000000LOnACAQ","name":"storyOngoingStateInteraction"},"name":"Campaign Ongoing","sObjectType":null,"templateUrl":"story-card","isSmartAction":false,"smartAction":{},"flyoutAttributes":[{"name":"parent","val":"$scope.obj"}]},{"blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"},{"field":"['onGoing']","logicalOperator":"&&","operator":"==","type":"custom","value":"false"}]},"definedActions":{"actions":[]},"disableAddCondition":false,"fields":[{"collapse":true,"editing":false,"fieldType":"standard","label":"Status","name":"['subtitle']","type":"string"},{"collapse":true,"editing":false,"fieldType":"standard","label":"Type","name":"['highlight']","type":"string"},{"collapse":true,"editing":false,"fieldType":"custom","label":"Responded","name":"['activityType']","type":"string"}],"filter":"$scope.data.status === 'active' && $scope.obj['onGoing'] == false","flyout":{"lwc":{"MasterLabel":"storyEditStateFlyout","DeveloperName":"storyEditStateFlyout","Id":"0Rb3t000000LOfoCAQ","name":"storyEditStateFlyout"}},"lwc":{"MasterLabel":"storyNormalStateInteraction","DeveloperName":"storyNormalStateInteraction","Id":"0Rb3t000000LOnBCAQ","name":"storyNormalStateInteraction"},"name":"Campaign","sObjectType":null,"templateUrl":"story-card","isSmartAction":false,"smartAction":{},"flyoutAttributes":[{"name":"parent","val":"$scope.obj"}]}],"title":"Campaigns"}; 
            export default definition
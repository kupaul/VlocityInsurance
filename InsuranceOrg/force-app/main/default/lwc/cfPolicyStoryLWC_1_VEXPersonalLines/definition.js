let definition = 
                {"GlobalKey__c":"PolicyStory LWC/VEX Personal Lines/1/1586172259826","dataSource":{"type":null},"enableLwc":true,"filter":{"['objAPIName']":"vlocity_ins__Policy__c"},"states":[{"blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"},{"field":"['onGoing']","logicalOperator":"&&","operator":"==","type":"custom","value":"true"}]},"definedActions":{"actions":[]},"disableAddCondition":false,"fields":[{"collapse":true,"editing":false,"fieldType":"standard","label":"Policy Status","name":"['subtitle']","type":"string"},{"collapse":true,"editing":false,"fieldType":"standard","label":"Policy Number","name":"['highlight']","type":"string"}],"filter":"$scope.data.status === 'active' && $scope.obj['onGoing'] == true","flyout":{"lwc":{"DeveloperName":"storyEditStateFlyout","Id":"0Rb3t000000LOsYCAI","MasterLabel":"storyEditStateFlyout","name":"storyEditStateFlyout"}},"lwc":{"MasterLabel":"storyOngoingStateInteraction","DeveloperName":"storyOngoingStateInteraction","Id":"0Rb3t000000LOnACAQ","name":"storyOngoingStateInteraction"},"name":"Policy Ongoing","sObjectType":"vlocity_ins__Policy__c","templateUrl":"story-card","isSmartAction":false,"smartAction":{},"flyoutAttributes":[{"name":"parent","val":"$scope.obj"}]},{"blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"},{"field":"['onGoing']","logicalOperator":"&&","operator":"==","type":"custom","value":"false"}]},"definedActions":{"actions":[]},"disableAddCondition":false,"fields":[{"collapse":true,"editing":false,"fieldType":"standard","label":"Policy Status","name":"['subtitle']","type":"string"},{"collapse":true,"editing":false,"fieldType":"standard","label":"Policy Number","name":"['highlight']","type":"string"}],"filter":"$scope.data.status === 'active' && $scope.obj['onGoing'] == false","flyout":{"lwc":{"MasterLabel":"storyEditStateFlyout","DeveloperName":"storyEditStateFlyout","Id":"0Rb3t000000LOfoCAQ","name":"storyEditStateFlyout"}},"lwc":{"MasterLabel":"storyNormalStateInteraction","DeveloperName":"storyNormalStateInteraction","Id":"0Rb3t000000LOnBCAQ","name":"storyNormalStateInteraction"},"name":"Policy","sObjectType":"vlocity_ins__Policy__c","templateUrl":"story-card","isSmartAction":false,"smartAction":{},"flyoutAttributes":[{"name":"parent","val":"$scope.obj"}]}],"title":"Policies"}; 
            export default definition
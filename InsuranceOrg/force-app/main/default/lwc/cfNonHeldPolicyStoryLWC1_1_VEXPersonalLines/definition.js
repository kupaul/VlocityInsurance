let definition = 
                {"GlobalKey__c":"Non Held Policy Story LWC1/VEX Personal Lines/1/1580287027682","dataSource":{"type":null},"enableLwc":true,"filter":{"['objAPIName']":"vlocity_ins__NonHeldPolicy__c"},"states":[{"blankStateCheck":false,"collapse":true,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"},{"field":"['onGoing']","logicalOperator":"&&","operator":"==","type":"custom","value":"true"}]},"definedActions":{"actions":[]},"disableAddCondition":false,"fields":[{"collapse":true,"editing":false,"fieldType":"standard","label":"Policy Type","name":"['highlight']","type":"string"},{"collapse":true,"editing":false,"fieldType":"standard","label":"LOB","name":"['subtitle']","type":"string"}],"filter":"$scope.data.status === 'active' && $scope.obj['onGoing'] == true","flyout":{"lwc":{"DeveloperName":"storyEditStateFlyout","Id":"0Rb3t000000LOsYCAI","MasterLabel":"storyEditStateFlyout","name":"storyEditStateFlyout"}},"lwc":{"DeveloperName":"storyOngoingState","Id":"0Rb3t000000LOsZCAY","MasterLabel":"storyOngoingState","name":"storyOngoingState"},"name":"Non Held Policy Ongoing","sObjectType":"vlocity_ins__NonHeldPolicy__c","templateUrl":"story-card","isSmartAction":false,"smartAction":{}},{"blankStateCheck":false,"collapse":true,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"},{"field":"['onGoing']","logicalOperator":"&&","operator":"==","type":"custom","value":"false"}]},"definedActions":{"actions":[]},"disableAddCondition":false,"fields":[{"collapse":true,"editing":false,"fieldType":"standard","label":"Policy Type","name":"['highlight']","type":"string"},{"collapse":true,"editing":false,"fieldType":"standard","label":"LOB","name":"['subtitle']","type":"string"}],"filter":"$scope.data.status === 'active' && $scope.obj['onGoing'] == false","flyout":{"lwc":""},"lwc":{"DeveloperName":"storyNormalState","Id":"0Rb3t000000LOsaCAI","MasterLabel":"storyNormalState","name":"storyNormalState"},"name":"Non Held Policy","sObjectType":"vlocity_ins__NonHeldPolicy__c","templateUrl":"story-card","isSmartAction":false,"smartAction":{}}],"title":"Non Held Policies"}; 
            export default definition
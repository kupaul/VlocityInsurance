let definition = 
                {"dataSource":{"type":null},"filter":{},"states":[{"actionCtxId":"['ClaimId']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"}]},"definedActions":{"actions":[{"type":"Vlocity Action","id":"np-claim-view-from-policy","displayName":"View Claim","iconName":"icon-v-view","collapse":true,"isCustomAction":false,"hasExtraParams":false}]},"fields":[{"name":"['LossDate']","label":"LossDate","displayLabel":"['LossDate']","type":"string","fieldType":"standard","group":"Custom Properties","collapse":true},{"name":"['LossType']","label":"Claim Type","displayLabel":"['LossType']","type":"string","fieldType":"standard","group":"Custom Properties","collapse":true,"editing":false},{"name":"['ClaimStatus']","label":"Claim Status","displayLabel":"['ClaimStatus']","type":"string","fieldType":"standard","group":"Custom Properties","collapse":true,"editing":false}],"name":"Claims","sObjectType":"vlocity_ins__InsuranceClaim__c","templateUrl":"np-list-nds","isSmartAction":false,"smartAction":{},"placeholderExpand":false,"lwc":{"MasterLabel":"npTable","DeveloperName":"npTable","Id":"0Rb3t000000LOiNCAA","name":"npTable"}},{"fields":[],"conditions":{"group":[{"field":"$scope.data.status","operator":"===","value":"'non-existent'","type":"system"}]},"definedActions":{"actions":[]},"isSmartAction":false,"smartAction":{},"blankCardState":true,"filter":"$scope.data.status === 'non-existent'","disableAddCondition":false,"name":"Open","lwc":{"MasterLabel":"npGlobalOpen","DeveloperName":"npGlobalOpen","Id":"0Rb3t000000LOidCAA","name":"npGlobalOpen"}}],"title":"Claims","enableLwc":true,"GlobalKey__c":"np-policy-claims-card-lwc/VEX Personal Lines/1/1579690107616"}; 
            export default definition
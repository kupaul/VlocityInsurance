let definition = 
                {"dataSource":{"type":null},"filter":{"['Status']":"Accepted"},"states":[{"blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"}]},"definedActions":{"actions":[{"type":"Vlocity Action","id":"View Quote","displayName":"View Record","iconName":"icon-v-document1-line","collapse":true,"isCustomAction":false,"hasExtraParams":false}]},"disableAddCondition":false,"fields":[{"collapse":true,"displayLabel":"['Account']['Name']","group":"Custom Properties","label":"Account Name","name":"['Account']['Name']","type":"string"},{"collapse":true,"displayLabel":"<<Custom Field>>","editing":false,"fieldType":"custom","label":"Name","name":"Name","type":"string"},{"collapse":true,"displayLabel":"['QuoteNumber']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Quote Number","name":"['QuoteNumber']","type":"string"},{"collapse":true,"displayLabel":"['TotalPrice']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Total","name":"['TotalPrice']","type":"currency"},{"name":"['EffectiveDate']","label":"Effective Date","displayLabel":"['EffectiveDate']","type":"date","fieldType":"standard","group":"Custom Properties","collapse":true,"editing":false}],"filter":"$scope.data.status === 'active'","flyout":{"layout":null},"name":"Accepted","sObjectType":"Quote","templateUrl":"ins-broker-quote-card-v2","isSmartAction":false,"smartAction":{},"lwc":{"MasterLabel":"npBrokerApplicationTabs","DeveloperName":"npBrokerApplicationTabs","Id":"0Rb3i000000bum1CAA","name":"npBrokerApplicationTabs"},"actionCtxId":"['Id']"},{"fields":[],"conditions":{"group":[{"field":"$scope.data.status","operator":"===","value":"'non-existent'","type":"system"}]},"definedActions":{"actions":[]},"isSmartAction":false,"smartAction":{},"name":"Accepted open","templateUrl":"card-open","blankCardState":true,"filter":"$scope.data.status === 'non-existent'","disableAddCondition":false,"lwc":{"MasterLabel":"npBrokerApplicationOpenState","DeveloperName":"npBrokerApplicationOpenState","Id":"0Rb3i000000bumBCAQ","name":"npBrokerApplicationOpenState"}}],"title":"Accepted","sessionVars":[{"name":"sprite","val":"standard"},{"name":"icon","val":"event"}],"enableLwc":true,"GlobalKey__c":"ins-broker-portal-quote-accepted-lwc/VEX Personal Lines/1/1579251124509"}; 
            export default definition
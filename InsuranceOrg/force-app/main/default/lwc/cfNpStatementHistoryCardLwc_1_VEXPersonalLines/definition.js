let definition = 
                {"dataSource":{"type":null},"filter":{},"states":[{"actionCtxId":"['Id']","collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"}]},"definedActions":{"actions":[{"collapse":true,"hasExtraParams":false,"id":"npViewStatemet","isCustomAction":false,"type":"Vlocity Action"}]},"fields":[{"collapse":true,"displayLabel":"['PolicyStatements']['StatementDate']","editing":false,"group":"Custom Properties","label":"Statement Date","name":"['PolicyStatements']['StatementDate']","type":"string"},{"collapse":true,"displayLabel":"['PolicyStatements']['DueDate']","editing":false,"group":"Custom Properties","label":"Due Date","name":"['PolicyStatements']['DueDate']","type":"string"},{"collapse":true,"displayLabel":"['PolicyStatements']['BalanceDue']","editing":false,"group":"Custom Properties","label":"Balance Due","name":"['PolicyStatements']['BalanceDue']","type":"string"}],"name":"statemet history","placeholderExpand":true,"sObjectType":"vlocity_ins__Statement__c","templateUrl":"np-list-statement-history-nds","isSmartAction":false,"smartAction":{},"lwc":{"MasterLabel":"npTable","DeveloperName":"npTable","Id":"0Rb3t000000LOiNCAA","name":"npTable"}},{"blankCardState":true,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'non-existent'"}]},"definedActions":{"actions":[]},"disableAddCondition":false,"fields":[],"filter":"$scope.data.status === 'non-existent'","name":"Open","placeholderExpand":true,"templateUrl":"np-open-state-global","isSmartAction":false,"smartAction":{},"lwc":{"MasterLabel":"npGlobalOpen","DeveloperName":"npGlobalOpen","Id":"0Rb3t000000LOidCAA","name":"npGlobalOpen"}}],"title":"statement history","enableLwc":true,"GlobalKey__c":"np-statement-history-card-lwc/VEX Personal Lines/1/1579691640647"}; 
            export default definition
let definition = 
                {"dataSource":{"type":null},"filter":{"['Type']":"Homeowners"},"icon":"custom1","sprite":"custom","states":[{"actionCtxId":"['Id']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"}]},"definedActions":{"actions":[{"collapse":true,"hasExtraParams":false,"id":"np-policy-view","isCustomAction":false,"type":"Vlocity Action"}]},"fields":[{"name":"['Name']","label":"Name","displayLabel":"['Name']","type":"string","fieldType":"standard","group":"Custom Properties","collapse":true},{"collapse":true,"displayLabel":"['PolicyNumber']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Policy number","name":"['PolicyNumber']","type":"string"},{"collapse":true,"displayLabel":"['Status']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Status","name":"['Status']","type":"string"},{"collapse":true,"displayLabel":"['Account']['Name']","editing":false,"group":"Custom Properties","label":"Policyholder","name":"['Account']['Name']","type":"string"},{"collapse":true,"displayLabel":"['EffectiveTerm']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Effective term","name":"['EffectiveTerm']","type":"string"}],"name":"Homeowners","placeholderExpand":true,"sObjectType":"Asset","templateUrl":"np-summary-nds","isSmartAction":false,"smartAction":{},"lwc":{"MasterLabel":"npSummary","DeveloperName":"npSummary","Id":"0Rb3t000000LOhfCAA","name":"npSummary"}}],"title":"Homeowners","enableLwc":true,"sessionVars":[{"name":"img","val":"/resource/vlocity_ins__newport/assets/images/VPL/home.svg"}],"GlobalKey__c":"np-policy-homeowners-lwc/VEX Personal Lines/1/1579531881301"}; 
            export default definition
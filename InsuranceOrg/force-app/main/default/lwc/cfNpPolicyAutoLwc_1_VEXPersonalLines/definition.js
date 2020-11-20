let definition = 
                {"dataSource":{"type":null},"filter":{"['Type']":"Auto"},"icon":"custom1","sprite":"custom","states":[{"actionCtxId":"['Id']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"}]},"definedActions":{"actions":[{"type":"Vlocity Action","id":"np-broker-policy-view","displayName":"View Policy","iconName":"icon-v-view","collapse":true,"isCustomAction":false,"hasExtraParams":false}]},"fields":[{"name":"['Name']","label":"Name","displayLabel":"['Name']","type":"string","fieldType":"standard","group":"Custom Properties","collapse":true},{"collapse":true,"displayLabel":"['PolicyNumber']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Policy Number","name":"['PolicyNumber']","type":"string"},{"collapse":true,"displayLabel":"['PolicyholderName']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Policyholder Name","name":"['PolicyholderName']","type":"string"},{"collapse":true,"displayLabel":"['Type']","fieldType":"standard","group":"Custom Properties","label":"Type","name":"['Type']","type":"string"},{"collapse":true,"displayLabel":"['Status']","fieldType":"standard","group":"Custom Properties","label":"Status","name":"['Status']","type":"string"},{"collapse":true,"displayLabel":"['AnnualPremium']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Annual Premium","name":"['AnnualPremium']","type":"currency"},{"collapse":true,"displayLabel":"['EffectiveDate']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Effective Date","name":"['EffectiveDate']","type":"string"}],"name":"Auto","placeholderExpand":true,"sObjectType":"Asset","templateUrl":"np-summary-nds","isSmartAction":false,"smartAction":{},"lwc":{"MasterLabel":"npSummary","DeveloperName":"npSummary","Id":"0Rb3t000000LOhfCAA","name":"npSummary"}}],"title":"Auto","enableLwc":true,"sessionVars":[{"name":"img","val":"/resource/vlocity_ins__newport/assets/images/VPL/auto.svg"}],"GlobalKey__c":"np-policy-auto-lwc/VEX Personal Lines/1/1579531973678"}; 
            export default definition
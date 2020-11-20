let definition = 
                {"dataSource":{"type":null},"filter":{"['Type']":"Watercraft"},"icon":"custom1","sprite":"custom","states":[{"actionCtxId":"['Id']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"}]},"definedActions":{"actions":[{"type":"Vlocity Action","id":"np-policy-view","displayName":"View Policy","iconName":"icon-v-view","collapse":true,"isCustomAction":false,"hasExtraParams":false}]},"fields":[{"name":"['Name']","label":"Name","displayLabel":"['Name']","type":"string","fieldType":"standard","group":"Custom Properties","collapse":true},{"collapse":true,"displayLabel":"['PolicyNumber']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Policy number","name":"['PolicyNumber']","type":"string"},{"collapse":true,"displayLabel":"['PolicyholderName']","fieldType":"standard","group":"Custom Properties","label":"PolicyholderName","name":"['PolicyholderName']","type":"string"},{"collapse":true,"displayLabel":"['Type']","fieldType":"standard","group":"Custom Properties","label":"Type","name":"['Type']","type":"string"},{"collapse":true,"displayLabel":"<<Custom Field>>","editing":false,"fieldType":"custom","label":"Product Name","name":"['Product']['Name']","type":"string"},{"collapse":true,"displayLabel":"['AnnualPremium']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Annual Premium","name":"['AnnualPremium']","type":"string"},{"collapse":true,"displayLabel":"['Term']","fieldType":"standard","group":"Custom Properties","label":"Term","name":"['Term']","type":"string"},{"collapse":true,"displayLabel":"['EffectiveDate']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Effective Date","name":"['EffectiveDate']","type":"string"}],"name":"Boat","placeholderExpand":true,"sObjectType":"Asset","templateUrl":"np-summary-nds","isSmartAction":false,"smartAction":{},"lwc":{"MasterLabel":"npSummary","DeveloperName":"npSummary","Id":"0Rb3t000000LOhfCAA","name":"npSummary"}}],"title":"Boatowners","enableLwc":true,"sessionVars":[{"name":"img","val":"/resource/vlocity_ins__newport/assets/images/VPL/sailboat.svg"}],"GlobalKey__c":"np-policy-boatowners-account-lwc/VEX Personal Lines/1/1590501713402"}; 
            export default definition
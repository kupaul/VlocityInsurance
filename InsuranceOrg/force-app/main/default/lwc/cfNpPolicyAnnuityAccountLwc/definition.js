let definition = 
                {"dataSource":{"type":null},"filter":{"['LineofBusiness']":"IndividualAnnuity"},"icon":"custom1","sprite":"custom","states":[{"actionCtxId":"['Id']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"}]},"definedActions":{"actions":[{"type":"Vlocity Action","id":"np-policy-view","displayName":"View Policy","iconName":"icon-v-view","collapse":true,"isCustomAction":false,"hasExtraParams":false}]},"fields":[{"name":"['Name']","label":"Name","displayLabel":"['Name']","type":"string","fieldType":"standard","group":"Custom Properties","collapse":true},{"collapse":true,"displayLabel":"['PolicyNumber']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Policy number","name":"['PolicyNumber']","type":"string"},{"collapse":true,"displayLabel":"['Status']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Status","name":"['Status']","type":"string"},{"collapse":true,"displayLabel":"['Account']['Name']","editing":false,"group":"Custom Properties","label":"Policyholder","name":"['Account']['Name']","type":"string"},{"collapse":true,"displayLabel":"['PrimaryProducerId']['Name']","editing":false,"group":"Custom Properties","label":"Producer name","name":"['PrimaryProducerId']['Name']","type":"string"},{"collapse":true,"displayLabel":"<<Custom Field>>","editing":false,"fieldType":"custom","label":"Cash Value","name":"['CashValue']","type":"currency"}],"name":"Individual Annuity","placeholderExpand":true,"sObjectType":"Asset","templateUrl":"np-summary-nds","isSmartAction":false,"smartAction":{},"lwc":{"MasterLabel":"npSummary","DeveloperName":"npSummary","Id":"0Rb3t000000LOhfCAA","name":"npSummary"}}],"title":"Individual Annuity","enableLwc":true,"sessionVars":[{"name":"img","val":"/resource/vlocity_ins__newport/assets/images/VPL/annuity.svg"}],"GlobalKey__c":"np-policy-annuity-account-lwc/VEX Personal Lines/1/1590501478240"}; 
            export default definition
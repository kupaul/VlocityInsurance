let definition = 
                {"dataSource":{"type":null},"filter":{"['Type']":"Disability"},"sessionVars":[{"name":"OpenIcon","val":"/resource/vlocity_ins__newport/assets/images/VPL/add.svg"},{"name":"OpenTitle","val":"Add Disability Policy"},{"name":"BTitle","val":"Disability"},{"name":"BIcon","val":"/resource/vlocity_ins__newport/assets/images/VPL/medical.svg"}],"states":[{"actionCtxId":"['Id']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"}]},"definedActions":{"actions":[{"type":"Vlocity Action","id":"view-asset-detail","displayName":"View","iconName":"icon-v-view","collapse":true,"isCustomAction":false,"hasExtraParams":false}]},"fields":[{"collapse":true,"displayLabel":"['AnnualPremium']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"","name":"['AnnualPremium']","type":"currency"},{"collapse":true,"displayLabel":"<<Custom Field>>","editing":false,"fieldType":"custom","label":"Mos Inc","name":"['MonthlyIncome__c']","type":"currency"}],"name":"Disability","placeholderExpand":true,"sObjectType":"Asset","templateUrl":"np-subnav-nds","isSmartAction":false,"smartAction":{},"lwc":{"MasterLabel":"subnav","DeveloperName":"subnav","Id":"0Rb3t000000LOsgCAO","name":"subnav"}},{"blankCardState":true,"blankStateCheck":true,"collapse":true,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'non-existent'"}]},"definedActions":{"actions":[]},"fields":[],"filter":"$scope.data.status === 'non-existent'","name":"open disability","placeholderExpand":true,"sObjectType":"Account","templateUrl":"np-subnav-open-nds","isSmartAction":false,"smartAction":{},"lwc":{"MasterLabel":"subnavOpen","DeveloperName":"subnavOpen","Id":"0Rb3t000000LOseCAO","name":"subnavOpen"}}],"title":"Disability","enableLwc":true,"GlobalKey__c":"np-subnav-disability-lwc/vlocityDev/1/1583749682768"}; 
            export default definition
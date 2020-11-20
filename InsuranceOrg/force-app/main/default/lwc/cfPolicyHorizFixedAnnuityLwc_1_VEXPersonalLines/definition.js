let definition = 
                {"dataSource":{"type":null},"filter":{"['vlocity_ins__Type__c']":"Fixed Annuity"},"icon":"custom16","sprite":"custom","states":[{"actionCtxId":"['Id']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"}]},"definedActions":{"actions":[{"collapse":true,"hasExtraParams":false,"id":"np-view-detail","isCustomAction":false,"type":"Vlocity Action"},{"collapse":true,"hasExtraParams":false,"id":"VPL-IntPolicyChangeBene","isCustomAction":false,"type":"Vlocity Action"}]},"fields":[{"collapse":true,"editing":false,"fieldType":"standard","label":"","name":"['Name']","type":"string"},{"collapse":true,"displayLabel":"['vlocity_ins__Type__c']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Type","name":"['vlocity_ins__Type__c']","type":"string"},{"collapse":true,"displayLabel":"['Account']['Name']","editing":false,"group":"Custom Properties","label":"Policy Owner","name":"['Account']['Name']","type":"string"},{"collapse":true,"displayLabel":"['vlocity_ins__PrimaryProducerId__r']['Name']","editing":false,"group":"Custom Properties","label":"Producer","name":"['vlocity_ins__PrimaryProducerId__r']['Name']","type":"string"},{"collapse":true,"editing":false,"fieldType":"standard","label":"Death Benefit","name":"['vlocity_ins__DeathBenefit__c']","type":"currency"},{"collapse":true,"displayLabel":"['vlocity_ins__TotalValue__c']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Total Value","name":"['vlocity_ins__TotalValue__c']","type":"currency"}],"flyout":{"layout":"VPL-PolicyAsset-InsuredItem-Flyout-15-1"},"name":"Fixed Annuity","sObjectType":"Asset","templateUrl":"card-horiz-noActions-slds","isSmartAction":false,"smartAction":{},"lwc":{"MasterLabel":"cardHorizActiveLwc","DeveloperName":"cardHorizActiveLwc","Id":"0Rb3t000000LOmtCAQ","name":"cardHorizActiveLwc"}},{"blankCardState":true,"blankStateCheck":true,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'non-existent'"}]},"definedActions":{"actions":[]},"fields":[],"filter":"$scope.data.status === 'non-existent'","name":"Fixed Annuity-open","sObjectType":"Account","templateUrl":"card-horiz-open-slds","isSmartAction":false,"smartAction":{},"lwc":{"MasterLabel":"cardHorizOpenLwc","DeveloperName":"cardHorizOpenLwc","Id":"0Rb3t000000LOmsCAQ","name":"cardHorizOpenLwc"}}],"title":"Fixed Annuity","enableLwc":true,"GlobalKey__c":"Policy-Horiz-FixedAnnuity-lwc/VEX Personal Lines/1/1585101313960"}; 
            export default definition
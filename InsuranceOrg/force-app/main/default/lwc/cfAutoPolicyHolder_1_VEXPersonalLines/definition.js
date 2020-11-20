let definition = 
                {"GlobalKey__c":"AutoPolicyHolder/VEX Personal Lines/1/1586270162853","dataSource":{"type":null},"enableLwc":true,"filter":{},"icon":"custom107","sessionVars":[{"name":"imageStyle","val":"height:30px"}],"sprite":"custom","states":[{"actionCtxId":"['InteractionTopicId']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"active"},{"field":"['Role']","operator":"==","value":"Policyholder","type":"custom","logicalOperator":"&&"},{"field":"['Type']","operator":"==","value":"Auto","type":"custom","logicalOperator":"&&"}]},"definedActions":{"actions":[{"type":"Vlocity Action","id":"InteractionTopicPolicy-ViewDetails","displayName":"View Details","iconName":"icon-v-view","collapse":true,"isCustomAction":false,"hasExtraParams":false},{"type":"Vlocity Action","id":"InteractionPolicy-PayPremium","displayName":"Pay Premium","iconName":"icon-v-payment-line","collapse":true,"isCustomAction":false,"hasExtraParams":false},{"id":"Modify Coverages","displayName":"Modify Coverages","type":"OmniScript","omniType":{"Name":"autoWC/ModifyCoverages/English","Type":"autoWC","SubType":"ModifyCoverages","Language":"English","Id":"a3F3t000001X9uaEAS","isLwc":true},"omniSubType":"","omniLang":"","isCustomAction":true,"collapse":true,"hasExtraParams":true,"layoutType":"lightning","openUrlIn":"New Tab / Window","isLwcOS":true,"conditions":{"group":[]},"extraParams":{"c__ContextId":"['AssetId']"},"vlocityIcon":"icon-v-view"},{"id":"Add Vehicle","displayName":"Add Vehicle","type":"OmniScript","omniType":{"Name":"autoWC/AddVehicles/English","Type":"autoWC","SubType":"AddVehicles","Language":"English","Id":"a3F3t000001X9uZEAC","isLwc":true},"omniSubType":"","omniLang":"","isCustomAction":true,"collapse":true,"hasExtraParams":true,"layoutType":"lightning","vlocityIcon":"icon-v-view","openUrlIn":"New Tab / Window","isLwcOS":true,"conditions":{"group":[]},"extraParams":{"c__ContextId":"['AssetId']"}},{"id":"Add Driver","displayName":"Add Driver","type":"OmniScript","omniType":{"Name":"autoWC/AddDrivers/English","Type":"autoWC","SubType":"AddDrivers","Language":"English","Id":"a3F3t000001X9udEAC","isLwc":true},"omniSubType":"","omniLang":"","isCustomAction":true,"collapse":true,"hasExtraParams":true,"layoutType":"lightning","openUrlIn":"New Tab / Window","isLwcOS":true,"conditions":{"group":[]},"filter":"","disableAddCondition":false,"extraParams":{"c__ContextId":"['AssetId']"},"vlocityIcon":"icon-v-view","vForcewithNsPrefix":"vlocity_ins__OmniScriptUniversalPage"},{"id":"Remove Vehicles","displayName":"Remove Vehicles","type":"OmniScript","omniType":{"Name":"autoWC/RemoveVehicles/English","Type":"autoWC","SubType":"RemoveVehicles","Language":"English","Id":"a3F3t000001X9ueEAC","isLwc":true},"omniSubType":"","omniLang":"","isCustomAction":true,"collapse":true,"hasExtraParams":true,"layoutType":"lightning","openUrlIn":"New Tab / Window","isLwcOS":true,"conditions":{"group":[]},"extraParams":{"c__ContextId":"['AssetId']"},"vlocityIcon":"icon-v-view","vForcewithNsPrefix":"vlocity_ins__OmniScriptUniversalPage"},{"type":"Vlocity Action","id":"VPL-INTPolicyClaimAuto-102-1","displayName":"File Claim","iconName":"icon-v-avatar-person-circle-line","collapse":true,"isCustomAction":false,"hasExtraParams":false,"conditions":{"group":[]},"extraParams":{}}]},"fields":[{"collapse":true,"displayLabel":"<<Custom Field>>","fieldType":"custom","label":"<<Custom Field>>","name":"['Type']","track":true,"type":"string","editing":false},{"collapse":true,"displayLabel":"['Policyholder']","fieldType":"standard","group":"Custom Properties","label":"Policyholder","name":"['Policyholder']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['SerialNumber']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Policy #","name":"['SerialNumber']","track":true,"type":"string"},{"name":"['Status']","label":"Status","displayLabel":"['Status']","type":"string","fieldType":"standard","group":"Custom Properties","collapse":true},{"collapse":true,"displayLabel":"['AnnualPremium']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Annual Premium","name":"['AnnualPremium']","track":true,"type":"currency"},{"collapse":true,"displayLabel":"['Term']","fieldType":"standard","group":"Custom Properties","label":"Term","name":"['Term']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['ExpirationDate']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Expiration Date","name":"['ExpirationDate']","track":true,"type":"date"}],"filter":"$scope.data.status === 'active' && $scope.obj['Role'] == 'Policyholder' && $scope.obj['Type'] == 'Auto'","flyout":{"layout":"VPL-Policy-InsuredItems-15-1"},"isSmartAction":false,"lwc":{"MasterLabel":"wideCardSmartInteraction","DeveloperName":"wideCardSmartInteraction","Id":"0Rb3t000000LOn8CAQ","name":"wideCardSmartInteraction"},"name":"Auto-Policyholder","sObjectType":"vlocity_ins__CustomerInteractionTopic__c","smartAction":{"inputMap":{"pageSize":"5","ContextId":"{{obj.AssetId}}"},"ipMethod":"Smartcard_Policy"},"templateUrl":"card-active-slds-VlocityTrack-IBO","disableAddCondition":false,"editMode":false}],"title":"Auto"}; 
            export default definition
let definition = 
                {"dataSource":{"type":null},"filter":{},"states":[{"actionCtxId":"['Id']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"}]},"definedActions":{"actions":[{"id":"Modify Coverages Auto","displayName":"Modify Coverages","type":"OmniScript","omniType":{"Name":"auto/ModifyCoverages/English","Type":"auto","SubType":"ModifyCoverages","Language":"English","Id":"a3F3t000001X9rzEA0","isLwc":true},"omniSubType":"","omniLang":"","isCustomAction":true,"collapse":true,"hasExtraParams":true,"layoutType":"newport","isLwcOS":true,"openUrlIn":"New Tab / Window","conditions":{"group":[{"field":"['Type']","operator":"==","value":"Auto","type":"custom"}]},"filter":"$scope.obj['Type'] == 'Auto'","disableAddCondition":false,"extraParams":{},"vForcewithNsPrefix":"vlocity_ins__OmniScriptUniversalPage","ContextId":"['Id']"},{"id":"Add Vehicles Auto","displayName":"Add Vehicles","type":"OmniScript","omniType":{"Name":"auto/AddVehicles/English","Type":"auto","SubType":"AddVehicles","Language":"English","Id":"a3F3t000001X9s5EA0","isLwc":true},"omniSubType":"","omniLang":"","isCustomAction":true,"collapse":true,"hasExtraParams":true,"layoutType":"newport","isLwcOS":true,"conditions":{"group":[{"field":"['Type']","operator":"==","value":"Auto","type":"custom"}]},"filter":"$scope.obj['Type'] == 'Auto'","disableAddCondition":false,"openUrlIn":"New Tab / Window","extraParams":{},"vForcewithNsPrefix":"vlocity_ins__OmniScriptUniversalPage","ContextId":"['Id']"},{"id":"Add Drivers Auto","displayName":"Add Drivers","type":"OmniScript","omniType":{"Name":"auto/AddDrivers/English","Type":"auto","SubType":"AddDrivers","Language":"English","Id":"a3F3t000001X9s4EAK","isLwc":true},"omniSubType":"","omniLang":"","isCustomAction":true,"collapse":true,"hasExtraParams":true,"layoutType":"newport","isLwcOS":true,"openUrlIn":"New Tab / Window","conditions":{"group":[{"field":"['Type']","operator":"==","value":"Auto","type":"custom"}]},"filter":"$scope.obj['Type'] == 'Auto'","disableAddCondition":false,"extraParams":{},"vForcewithNsPrefix":"vlocity_ins__OmniScriptUniversalPage","ContextId":"['Id']"},{"id":"Remove Drivers Auto","displayName":"Remove Drivers","type":"OmniScript","omniType":{"Name":"auto/RemoveDrivers/English","Type":"auto","SubType":"RemoveDrivers","Language":"English","Id":"a3F3t000001X9s6EAK","isLwc":true},"omniSubType":"","omniLang":"","isCustomAction":true,"collapse":true,"hasExtraParams":true,"layoutType":"newport","isLwcOS":true,"openUrlIn":"New Tab / Window","conditions":{"group":[{"field":"['Type']","operator":"==","value":"Auto","type":"custom"}]},"filter":"$scope.obj['Type'] == 'Auto'","disableAddCondition":false,"extraParams":{},"vForcewithNsPrefix":"vlocity_ins__OmniScriptUniversalPage","ContextId":"['Id']"},{"id":"Remove Vehicles Auto","displayName":"Remove Vehicles","type":"OmniScript","omniType":{"Name":"auto/RemoveVehicles/English","Type":"auto","SubType":"RemoveVehicles","Language":"English","Id":"a3F3t000001X9s7EAK","isLwc":true},"omniSubType":"","omniLang":"","isCustomAction":true,"collapse":true,"hasExtraParams":true,"layoutType":"newport","isLwcOS":true,"openUrlIn":"New Tab / Window","conditions":{"group":[{"field":"['Type']","operator":"==","value":"Auto","type":"custom"}]},"filter":"$scope.obj['Type'] == 'Auto'","disableAddCondition":false,"extraParams":{},"vForcewithNsPrefix":"vlocity_ins__OmniScriptUniversalPage","ContextId":"['Id']"},{"id":"Cancel Policy Auto","displayName":"Cancel Policy","type":"OmniScript","omniType":{"Name":"ins/PolicyCancellation/English","Type":"ins","SubType":"PolicyCancellation","Language":"English","Id":"a3F3t000001X9s1EAS","isLwc":true},"omniSubType":"","omniLang":"","isCustomAction":true,"collapse":false,"hasExtraParams":true,"layoutType":"newport","isLwcOS":true,"openUrlIn":"New Tab / Window","conditions":{"group":[{"field":"['Status']","operator":"!=","value":"Active","type":"custom"}]},"extraParams":{},"vForcewithNsPrefix":"vlocity_ins__OmniScriptUniversalPage","ContextId":"['Id']","filter":"$scope.obj['Status'] != 'Active'","disableAddCondition":false},{"id":"File Claim","displayName":"File Claim","type":"OmniScript","omniType":{"Name":"auto/FNOL/English","Type":"auto","SubType":"FNOL","Language":"English","Id":"a3F3t000001X9uYEA0","isLwc":false},"omniSubType":"","omniLang":"","isCustomAction":true,"collapse":true,"hasExtraParams":true,"openUrlIn":"New Tab / Window","vForcewithNsPrefix":"vlocity_ins__OmniScriptUniversalPage","layoutType":"newport","isLwcOS":false,"conditions":{"group":[{"field":"['Type']","operator":"==","value":"Auto","type":"custom"}]},"extraParams":{"c__ContextId":"['Id']"},"filter":"$scope.obj['Type'] == 'Auto'","disableAddCondition":false}]},"disableAddCondition":false,"fields":[{"name":"['Name']","label":"Name","displayLabel":"['Name']","type":"string","fieldType":"standard","group":"Custom Properties","collapse":true},{"collapse":true,"displayLabel":"['Type']","fieldType":"standard","group":"Custom Properties","label":"Type","name":"['Type']","type":"string"},{"collapse":true,"displayLabel":"['Account']['Policyholder']","editing":false,"group":"Custom Properties","label":"Policyholder","name":"['Account']['Policyholder']","type":"string"},{"collapse":true,"displayLabel":"['Status']","fieldType":"standard","group":"Custom Properties","label":"Status","name":"['Status']","type":"string"},{"name":"['TotalAmount']","label":"Annual premium","displayLabel":"['TotalAmount']","type":"currency","fieldType":"standard","group":"Custom Properties","collapse":true,"editing":false},{"collapse":true,"displayLabel":"['ExpirationDate']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Expiration date","name":"['ExpirationDate']","type":"date"},{"collapse":true,"displayLabel":"['PrimaryProducerId']['Name']","editing":false,"group":"Custom Properties","label":"Producer name","name":"['PrimaryProducerId']['Name']","type":"string"},{"collapse":true,"displayLabel":"['Carrier']['Name']","editing":false,"group":"Custom Properties","label":"Carrier name","name":"['Carrier']['Name']","type":"string"},{"collapse":true,"displayLabel":"['DaysToExpire']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Days to expire","name":"['DaysToExpire']","type":"string"}],"filter":"$scope.data.status === 'active'","name":"P&C-PersonalLines","placeholderExpand":true,"sObjectType":"Asset","templateUrl":"np-detail-plus-nds","isSmartAction":false,"smartAction":{},"lwc":{"MasterLabel":"npPolicyDetails","DeveloperName":"npPolicyDetails","Id":"0Rb3t000000LOirCAQ","name":"npPolicyDetails"}}],"title":"Policy Detail","enableLwc":true,"GlobalKey__c":"np-policy-detail-card-lwc/VEX Personal Lines/1/1579681972295"}; 
            export default definition
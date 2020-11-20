let definition = 
                {"GlobalKey__c":"Business Owners Policy/VEX Personal Lines/1/1588166846097","dataSource":{"type":null},"enableLwc":true,"filter":{},"icon":"custom107","sessionVars":[{"name":"imageStyle","val":"height:30px"}],"sprite":"custom","states":[{"actionCtxId":"['InteractionTopicId']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"},{"field":"['Role']","logicalOperator":"&&","operator":"==","type":"custom","value":"Policyholder"},{"field":"['Type']","operator":"==","value":"Business Owners","type":"custom","logicalOperator":"&&"},{"group":[{"field":"['Status']","operator":"!=","value":"Expired","type":"custom"},{"field":"['Status']","operator":"!=","value":"Lapsed","type":"custom","logicalOperator":"||"},{"field":"['Status']","operator":"!=","value":"Cancelled","type":"custom","logicalOperator":"||"}],"logicalOperator":"&&"}]},"definedActions":{"actions":[{"type":"Vlocity Action","id":"InteractionTopicPolicy-ViewDetails","displayName":"View Details","iconName":"icon-v-view","collapse":true,"isCustomAction":false,"hasExtraParams":false}]},"fields":[{"collapse":true,"displayLabel":"<<Custom Field>>","fieldType":"custom","label":"<<Custom Field>>","name":"['Type']","track":true,"type":"string","editing":false},{"collapse":true,"displayLabel":"['Policyholder']","fieldType":"standard","group":"Custom Properties","label":"Policyholder","name":"['Policyholder']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['SerialNumber']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Policy #","name":"['SerialNumber']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['AnnualPremium']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Annual Premium","name":"['AnnualPremium']","track":true,"type":"currency"},{"collapse":true,"displayLabel":"['Term']","fieldType":"standard","group":"Custom Properties","label":"Term","name":"['Term']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['ExpirationDate']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Expiration Date","name":"['ExpirationDate']","track":true,"type":"date"}],"filter":"$scope.data.status === 'active' && $scope.obj['Role'] == 'Policyholder' && $scope.obj['Type'] == 'Business Owners' && ($scope.obj['Status'] != 'Expired' || $scope.obj['Status'] != 'Lapsed' || $scope.obj['Status'] != 'Cancelled')","flyout":{"layout":"VPL-Policy-InsuredItems-15-1"},"isSmartAction":false,"lwc":{"DeveloperName":"wideCardSmart","Id":"0Rb3t000000LOsXCAM","MasterLabel":"wideCardSmart","name":"wideCardSmart"},"name":"BusinessOwnersPolicyholder","sObjectType":"vlocity_ins__CustomerInteractionTopic__c","smartAction":{"inputMap":{"pageSize":"5","ContextId":"{{obj.AssetId}}"},"ipMethod":"Smartcard_Policy"},"templateUrl":"card-active-slds-VlocityTrack-IBO","disableAddCondition":false},{"actionCtxId":"['InteractionTopicId']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"},{"field":"['Role']","logicalOperator":"&&","operator":"==","type":"custom","value":"Producer"},{"field":"['Type']","operator":"==","value":"Business Owners","type":"custom","logicalOperator":"&&"},{"group":[{"field":"['Status']","operator":"!=","value":"Lapsed","type":"custom"},{"field":"['Status']","operator":"!=","value":"Expired","type":"custom","logicalOperator":"||"},{"field":"['Status']","operator":"!=","value":"Cancelled","type":"custom","logicalOperator":"||"}],"logicalOperator":"&&"}]},"definedActions":{"actions":[{"type":"Vlocity Action","id":"InteractionTopicPolicy-ViewDetails","displayName":"View Details","iconName":"icon-v-view","collapse":true,"isCustomAction":false,"hasExtraParams":false}]},"fields":[{"collapse":true,"displayLabel":"['Name']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"","name":"['Name']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['Policyholder']","fieldType":"standard","group":"Custom Properties","label":"Policyholder","name":"['Policyholder']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['AnnualPremium']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Annual Premium","name":"['AnnualPremium']","track":true,"type":"currency"},{"collapse":true,"displayLabel":"['BillingMethod']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Billing Method","name":"['BillingMethod']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['MonthlyIncome']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Monthly Income","name":"['MonthlyIncome']","type":"currency"},{"collapse":true,"displayLabel":"['EliminationPeriod']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Elimination Period","name":"['EliminationPeriod']","type":"string"}],"filter":"$scope.data.status === 'active' && $scope.obj['Role'] == 'Producer' && $scope.obj['Type'] == 'Business Owners' && ($scope.obj['Status'] != 'Lapsed' || $scope.obj['Status'] != 'Expired' || $scope.obj['Status'] != 'Cancelled')","flyout":{"layout":"VPL-Policy-InsuredItems-15-1"},"isSmartAction":false,"lwc":{"DeveloperName":"wideCardSmart","Id":"0Rb3t000000LOsXCAM","MasterLabel":"wideCardSmart","name":"wideCardSmart"},"name":"AgentProducer","sObjectType":"vlocity_ins__CustomerInteractionTopic__c","smartAction":{},"templateUrl":"card-active-slds-VlocityTrack","disableAddCondition":false},{"actionCtxId":"['InteractionTopicId']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"},{"field":"['Type']","operator":"==","value":"Business Owners","type":"custom","logicalOperator":"&&"},{"group":[{"field":"['Status']","operator":"==","value":"Expired","type":"custom"},{"field":"['Status']","operator":"==","value":"Lapsed","type":"custom","logicalOperator":"||"},{"field":"['Status']","operator":"==","value":"Cancelled","type":"custom","logicalOperator":"||"}],"logicalOperator":"&&"}]},"definedActions":{"actions":[{"type":"Vlocity Action","id":"InteractionTopicPolicy-ViewDetails","displayName":"View Details","iconName":"icon-v-view","collapse":true,"isCustomAction":false,"hasExtraParams":false}]},"fields":[{"collapse":true,"displayLabel":"<<Custom Field>>","fieldType":"custom","label":"<<Custom Field>>","name":"['Type']","track":true,"type":"string","editing":false},{"collapse":true,"displayLabel":"['Policyholder']","fieldType":"standard","group":"Custom Properties","label":"Policyholder","name":"['Policyholder']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['SerialNumber']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Policy #","name":"['SerialNumber']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['Term']","fieldType":"standard","group":"Custom Properties","label":"Term","name":"['Term']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['ExpirationDate']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Expiration Date","name":"['ExpirationDate']","track":true,"type":"date"},{"name":"['Status']","label":"Status","displayLabel":"['Status']","type":"string","fieldType":"standard","group":"Custom Properties","collapse":true}],"filter":"$scope.data.status === 'active' && $scope.obj['Type'] == 'Business Owners' && ($scope.obj['Status'] == 'Expired' || $scope.obj['Status'] == 'Lapsed' || $scope.obj['Status'] == 'Cancelled')","flyout":{"layout":"VPL-Policy-InsuredItems-15-1"},"isSmartAction":false,"lwc":{"DeveloperName":"wideCardSmart","Id":"0Rb3t000000LOsXCAM","MasterLabel":"wideCardSmart","name":"wideCardSmart"},"name":"BusinessOwnersExpired","sObjectType":"vlocity_ins__CustomerInteractionTopic__c","smartAction":{"inputMap":{"pageSize":"5","ContextId":"{{obj.AssetId}}"},"ipMethod":"Smartcard_Policy"},"templateUrl":"card-active-slds-VlocityTrack-IBO","disableAddCondition":false},{"actionCtxId":"['InteractionTopicId']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"},{"field":"['Role']","logicalOperator":"&&","operator":"==","type":"custom","value":"Insured"},{"field":"['Type']","operator":"==","value":"Business Owners","type":"custom","logicalOperator":"&&"},{"group":[{"field":"['Status']","operator":"!=","value":"Expired","type":"custom"},{"field":"['Status']","operator":"!=","value":"Lapsed","type":"custom","logicalOperator":"||"},{"field":"['Status']","operator":"!=","value":"Cancelled","type":"custom","logicalOperator":"||"}],"logicalOperator":"&&"}]},"definedActions":{"actions":[{"type":"Vlocity Action","id":"InteractionTopicPolicy-ViewDetails","displayName":"View Details","iconName":"icon-v-view","collapse":true,"isCustomAction":false,"hasExtraParams":false}]},"fields":[{"collapse":true,"displayLabel":"<<Custom Field>>","fieldType":"custom","label":"<<Custom Field>>","name":"['Type']","track":true,"type":"string","editing":false},{"collapse":true,"displayLabel":"['Policyholder']","fieldType":"standard","group":"Custom Properties","label":"Policyholder","name":"['Policyholder']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['SerialNumber']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Policy #","name":"['SerialNumber']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['AnnualPremium']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Annual Premium","name":"['AnnualPremium']","track":true,"type":"currency"},{"collapse":true,"displayLabel":"['Term']","fieldType":"standard","group":"Custom Properties","label":"Term","name":"['Term']","track":true,"type":"string"},{"collapse":true,"displayLabel":"['ExpirationDate']","editing":false,"fieldType":"standard","group":"Custom Properties","label":"Expiration Date","name":"['ExpirationDate']","track":true,"type":"date"}],"filter":"$scope.data.status === 'active' && $scope.obj['Role'] == 'Insured' && $scope.obj['Type'] == 'Business Owners' && ($scope.obj['Status'] != 'Expired' || $scope.obj['Status'] != 'Lapsed' || $scope.obj['Status'] != 'Cancelled')","flyout":{"layout":"VPL-Policy-InsuredItems-15-1"},"isSmartAction":false,"lwc":{"DeveloperName":"wideCardSmart","Id":"0Rb3t000000LOsXCAM","MasterLabel":"wideCardSmart","name":"wideCardSmart"},"name":"BusinessOwnersInsured","sObjectType":"vlocity_ins__CustomerInteractionTopic__c","smartAction":{"inputMap":{"pageSize":"5","ContextId":"{{obj.AssetId}}"},"ipMethod":"Smartcard_Policy"},"templateUrl":"card-active-slds-VlocityTrack-IBO","disableAddCondition":false}],"title":"Business Owners Policy"}; 
            export default definition
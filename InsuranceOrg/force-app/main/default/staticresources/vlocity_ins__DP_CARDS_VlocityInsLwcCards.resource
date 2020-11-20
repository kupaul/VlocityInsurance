{
    "dataPackId": "",
    "dataPacks": [
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityCard__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__Datasource__c": "",
                        "%vlocity_namespace%__Definition__c": "{\"GlobalKey__c\":\"ins-asset-actions-card/Vlocity/1/1586475008863\",\"dataSource\":{\"type\":null},\"enableLwc\":true,\"filter\":{},\"states\":[{\"actionCtxId\":\"['Id']\",\"conditions\":{\"group\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}]},\"definedActions\":{\"actions\":[{\"collapse\":false,\"conditions\":{\"group\":[]},\"displayName\":\"Modify Policy\",\"eventName\":\"policy_action\",\"extraParams\":{\"recordId\":\"['Id']\"},\"hasExtraParams\":true,\"id\":\"PubSub Action\",\"isCustomAction\":true,\"message\":\"modifyPolicy\",\"type\":\"PubSub\",\"vlocityIcon\":\"utility:edit\"}]},\"fields\":[],\"isSmartAction\":false,\"lwc\":{\"DeveloperName\":\"actionGridState\",\"Id\":\"0Rb6F000000PHD7SAO\",\"MasterLabel\":\"actionGridState\",\"NamespacePrefix\":\"%vlocity_namespace%\",\"name\":\"actionGridState\"},\"name\":\"Active\",\"sObjectType\":\"Asset\",\"smartAction\":{}}],\"title\":\"Asset Actions\"}",
                        "%vlocity_namespace%__GlobalKey__c": "ins-asset-actions-card/Vlocity/1/1586475008863",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "ins-asset-actions-card",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/ins-asset-actions-card/%vlocity_namespace%__VlocityCard__c/ins-asset-actions-card"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/ins-asset-actions-card",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/ins-asset-actions-card",
            "VlocityDataPackName": "ins-asset-actions-card",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityCard"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityCard__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__Datasource__c": "",
                        "%vlocity_namespace%__Definition__c": "{\"GlobalKey__c\":\"ins-insurance-policy-actions-card/Vlocity/1/1586478266886\",\"dataSource\":{\"type\":null},\"enableLwc\":true,\"filter\":{},\"states\":[{\"actionCtxId\":\"['Id']\",\"conditions\":{\"group\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}]},\"definedActions\":{\"actions\":[{\"collapse\":false,\"conditions\":{\"group\":[]},\"displayName\":\"Modify Policy\",\"eventName\":\"policy_action\",\"extraParams\":{\"recordId\":\"['Id']\"},\"hasExtraParams\":true,\"id\":\"PubSub Action\",\"isCustomAction\":true,\"message\":\"modifyPolicy\",\"type\":\"PubSub\",\"vlocityIcon\":\"utility:edit\"}]},\"fields\":[],\"isSmartAction\":false,\"lwc\":{\"DeveloperName\":\"actionGridState\",\"Id\":\"0Rb6F000000PHD7SAO\",\"MasterLabel\":\"actionGridState\",\"NamespacePrefix\":\"%vlocity_namespace%\",\"name\":\"actionGridState\"},\"name\":\"Active\",\"sObjectType\":\"InsurancePolicy\",\"smartAction\":{}}],\"title\":\"InsurancePolicy Actions\"}",
                        "%vlocity_namespace%__GlobalKey__c": "ins-insurance-policy-actions-card/Vlocity/1/1586478266886",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "ins-insurance-policy-actions-card",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/ins-insurance-policy-actions-card/%vlocity_namespace%__VlocityCard__c/ins-insurance-policy-actions-card"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/ins-insurance-policy-actions-card",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/ins-insurance-policy-actions-card",
            "VlocityDataPackName": "ins-insurance-policy-actions-card",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityCard"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityCard__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__Datasource__c": "",
                        "%vlocity_namespace%__Definition__c": "{\"GlobalKey__c\":\"ins-quote-actions-card/Vlocity/1/1586467554234\",\"dataSource\":{\"type\":null},\"enableLwc\":true,\"filter\":{},\"states\":[{\"actionCtxId\":\"['Id']\",\"conditions\":{\"group\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}]},\"definedActions\":{\"actions\":[{\"collapse\":false,\"conditions\":{\"group\":[{\"field\":\"['Status']\",\"operator\":\"!=\",\"type\":\"custom\",\"value\":\"Issued\"}]},\"disableAddCondition\":false,\"displayName\":\"Issue Policy\",\"eventName\":\"policy_action\",\"extraParams\":{\"isFsc\":false,\"recordId\":\"['Id']\"},\"filter\":\"$scope.obj['Status'] != 'Issued'\",\"hasExtraParams\":true,\"id\":\"Issue Policy Action\",\"isCustomAction\":true,\"message\":\"issuePolicy\",\"type\":\"PubSub\",\"vlocityIcon\":\"utility:edit\"},{\"collapse\":false,\"conditions\":{\"group\":[{\"field\":\"['Status']\",\"operator\":\"!=\",\"type\":\"custom\",\"value\":\"Issued\"}]},\"disableAddCondition\":false,\"displayName\":\"Issue Insurance Policy\",\"eventName\":\"policy_action\",\"extraParams\":{\"isFsc\":true,\"recordId\":\"['Id']\"},\"filter\":\"$scope.obj['Status'] != 'Issued'\",\"hasExtraParams\":true,\"id\":\"Issue FSC Action\",\"isCustomAction\":true,\"message\":\"issuePolicy\",\"type\":\"PubSub\",\"vlocityIcon\":\"utility:edit\"}]},\"fields\":[],\"isSmartAction\":false,\"lwc\":{\"DeveloperName\":\"actionGridState\",\"Id\":\"0Rb6F000000PHD7SAO\",\"MasterLabel\":\"actionGridState\",\"NamespacePrefix\":\"%vlocity_namespace%\",\"name\":\"actionGridState\"},\"name\":\"Active\",\"sObjectType\":\"Quote\",\"smartAction\":{}}],\"title\":\"Quote Actions\"}",
                        "%vlocity_namespace%__GlobalKey__c": "ins-quote-actions-card/Vlocity/1/1586467554234",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "ins-quote-actions-card",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/ins-quote-actions-card/%vlocity_namespace%__VlocityCard__c/ins-quote-actions-card"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/ins-quote-actions-card",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/ins-quote-actions-card",
            "VlocityDataPackName": "ins-quote-actions-card",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityCard"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUILayout__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__Datasource__c": "{\"type\":\"Query\",\"value\":{\"query\":\"SELECT Id,Name,Status FROM Asset WHERE Id = '{{params.id}}'\"}}",
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[\"ins-asset-actions-card\"],\"GlobalKey__c\":\"ins-asset-actions/1/Vlocity/1586474888930\",\"componentName\":\"cfInsAssetActions\",\"dataSource\":{\"type\":\"Query\",\"value\":{\"jsonMap\":\"{\\\"params.id\\\":\\\"{{params.id}}\\\"}\"}},\"enableLwc\":true,\"lwc\":{\"DeveloperName\":\"cardCanvas1x\",\"Id\":\"0Rb6F000000bnvCSAQ\",\"MasterLabel\":\"cardCanvas1x\",\"NamespacePrefix\":\"%vlocity_namespace%\",\"name\":\"cardCanvas1x\"},\"previewType\":\"runTime\",\"repeatCards\":false,\"workspace\":[\"ins-asset-actions-card/Vlocity/1/1586475008863\"]}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "ins-asset-actions/1/Vlocity/1586474888930",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__RequiredPermission__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "ins-asset-actions",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/ins-asset-actions/%vlocity_namespace%__VlocityUILayout__c/ins-asset-actions"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/ins-asset-actions",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/ins-asset-actions",
            "VlocityDataPackName": "ins-asset-actions",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUILayout"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUILayout__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__Datasource__c": "{\"type\":\"Query\",\"value\":{\"query\":\"SELECT Id,Name,Status FROM InsurancePolicy WHERE Id = '{{params.id}}'\"}}",
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[\"ins-insurance-policy-actions-card\"],\"GlobalKey__c\":\"ins-insurance-policy-actions/1/Vlocity/1586478220160\",\"componentName\":\"cfInsInsurancePolicyActions\",\"dataSource\":{\"type\":\"Query\",\"value\":{\"jsonMap\":\"{\\\"params.id\\\":\\\"{{params.id}}\\\"}\"}},\"enableLwc\":true,\"lwc\":{\"DeveloperName\":\"cardCanvas1x\",\"Id\":\"0Rb6F000000bnvCSAQ\",\"MasterLabel\":\"cardCanvas1x\",\"NamespacePrefix\":\"%vlocity_namespace%\",\"name\":\"cardCanvas1x\"},\"previewType\":\"runTime\",\"repeatCards\":false,\"workspace\":[\"ins-insurance-policy-actions-card/Vlocity/1/1586478266886\"]}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "ins-insurance-policy-actions/1/Vlocity/1586478220160",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__RequiredPermission__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "ins-insurance-policy-actions",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/ins-insurance-policy-actions/%vlocity_namespace%__VlocityUILayout__c/ins-insurance-policy-actions"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/ins-insurance-policy-actions",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/ins-insurance-policy-actions",
            "VlocityDataPackName": "ins-insurance-policy-actions",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUILayout"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUILayout__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__Datasource__c": "{\"type\":\"Query\",\"value\":{\"query\":\"SELECT Id,Name,RecordTypeId,Status FROM Quote WHERE Id = '{{params.id}}'\"}}",
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[\"ins-quote-actions-card\"],\"GlobalKey__c\":\"ins-quote-actions/1/Vlocity/1586467432605\",\"componentName\":\"cfInsQuoteActions\",\"dataSource\":{\"type\":\"Query\",\"value\":{\"jsonMap\":\"{\\\"params.id\\\":\\\"{{params.id}}\\\"}\"}},\"enableLwc\":true,\"lwc\":{\"DeveloperName\":\"cardCanvas1x\",\"Id\":\"0Rb6F000000bnvCSAQ\",\"MasterLabel\":\"cardCanvas1x\",\"NamespacePrefix\":\"%vlocity_namespace%\",\"name\":\"cardCanvas1x\"},\"previewType\":\"runTime\",\"repeatCards\":false,\"workspace\":[\"ins-quote-actions-card/Vlocity/1/1586467554234\"]}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "ins-quote-actions/1/Vlocity/1586467432605",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__RequiredPermission__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "ins-quote-actions",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/ins-quote-actions/%vlocity_namespace%__VlocityUILayout__c/ins-quote-actions"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/ins-quote-actions",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/ins-quote-actions",
            "VlocityDataPackName": "ins-quote-actions",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUILayout"
        }
    ],
    "name": "InsLwcCards",
    "primaryDataPackKey": "VlocityDeploy",
    "processMultiple": true,
    "status": "Complete",
    "version": 1
}
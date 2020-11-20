{
    "dataPackId": "",
    "dataPacks": [
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityAction__c": [
                    {
                        "%vlocity_namespace%__ApplicableTypes__c": "Home;Opportunity",
                        "%vlocity_namespace%__ApplicableUserProfiles__c": "Vlocity Admin;Vlocity Health;System Administrator;Vlocity Demo Broker Portal User",
                        "%vlocity_namespace%__DisplayLabel__c": "Opportunity-PersonalMarketing",
                        "%vlocity_namespace%__DisplayOn__c": "Web Client",
                        "%vlocity_namespace%__DisplaySequence__c": 3,
                        "%vlocity_namespace%__Filter__c": "Account_Record_Type__c='Individual_Family'",
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsSeedAction__c": false,
                        "%vlocity_namespace%__LinkType__c": "OmniScript",
                        "%vlocity_namespace%__OpenUrlMode__c": "New Tab / Window",
                        "%vlocity_namespace%__Url__c": "/apex/%vlocity_namespace%__OmniScriptUniversalPage?id={0}#/OmniScriptType/Life/OmniScriptSubType/Personal Marketing/OmniScriptLang/English/ContextId/{0}/PrefillDataRaptorBundle//true",
                        "%vlocity_namespace%__VlocityIcon__c": "icon-v-avatar-person",
                        "Name": "Opportunity-PersonalMarketing",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityAction__c",
                        "VlocityRecordSourceKey": "VlocityAction/Opportunity-PersonalMarketing/%vlocity_namespace%__VlocityAction__c/Opportunity-PersonalMarketing"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityAction/Opportunity-PersonalMarketing",
                "VlocityDataPackType": "VlocityAction"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityAction/Opportunity-PersonalMarketing",
            "VlocityDataPackName": "Opportunity-PersonalMarketing",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityAction"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityAction__c": [
                    {
                        "%vlocity_namespace%__ApplicableTypes__c": "%vlocity_namespace%__Policy__c;InsuranceClaim__c",
                        "%vlocity_namespace%__ApplicableUserProfiles__c": "All",
                        "%vlocity_namespace%__DisplayLabel__c": "Log Dispute",
                        "%vlocity_namespace%__DisplayOn__c": "Web Client",
                        "%vlocity_namespace%__DisplaySequence__c": 5,
                        "%vlocity_namespace%__Filter__c": "RecordType.DeveloperName='Health_Plan'",
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsSeedAction__c": false,
                        "%vlocity_namespace%__LinkType__c": "Other",
                        "%vlocity_namespace%__OpenUrlMode__c": "New Tab / Window",
                        "%vlocity_namespace%__Url__c": "/{0}",
                        "%vlocity_namespace%__VlocityIcon__c": "icon-v-document1-line",
                        "Name": "Policy-Log Dispute",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityAction__c",
                        "VlocityRecordSourceKey": "VlocityAction/Policy-Log Dispute/%vlocity_namespace%__VlocityAction__c/Policy-Log Dispute"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityAction/Policy-Log Dispute",
                "VlocityDataPackType": "VlocityAction"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityAction/Policy-Log Dispute",
            "VlocityDataPackName": "Policy-Log Dispute",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityAction"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityAction__c": [
                    {
                        "%vlocity_namespace%__ApplicableTypes__c": "%vlocity_namespace%__Policy__c",
                        "%vlocity_namespace%__ApplicableUserProfiles__c": "All",
                        "%vlocity_namespace%__DisplayLabel__c": "Policy Details",
                        "%vlocity_namespace%__DisplayOn__c": "Web Client",
                        "%vlocity_namespace%__DisplaySequence__c": 1,
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsSeedAction__c": false,
                        "%vlocity_namespace%__LinkType__c": "Other",
                        "%vlocity_namespace%__OpenUrlMode__c": "New Tab / Window",
                        "%vlocity_namespace%__UrlParameters__c": "Id",
                        "%vlocity_namespace%__Url__c": "/{0}",
                        "%vlocity_namespace%__VlocityIcon__c": "icon-v-view",
                        "Name": "Policy-PolicyDetails",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityAction__c",
                        "VlocityRecordSourceKey": "VlocityAction/Policy-PolicyDetails/%vlocity_namespace%__VlocityAction__c/Policy-PolicyDetails"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityAction/Policy-PolicyDetails",
                "VlocityDataPackType": "VlocityAction"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityAction/Policy-PolicyDetails",
            "VlocityDataPackName": "Policy-PolicyDetails",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityAction"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityAction__c": [
                    {
                        "%vlocity_namespace%__ApplicableTypes__c": "Task",
                        "%vlocity_namespace%__ApplicableUserProfiles__c": "All",
                        "%vlocity_namespace%__DisplayLabel__c": "Edit Task",
                        "%vlocity_namespace%__DisplayOn__c": "All",
                        "%vlocity_namespace%__DisplaySequence__c": 1,
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsSeedAction__c": false,
                        "%vlocity_namespace%__LinkType__c": "OmniScript",
                        "%vlocity_namespace%__OpenUrlMode__c": "Current Window",
                        "%vlocity_namespace%__UrlParameters__c": "Id",
                        "%vlocity_namespace%__Url__c": "/apex/%vlocity_namespace%__OmniScriptUniversalPage?id={0}&OmniScriptType=Story&OmniScriptSubType=Task&OmniScriptLang=English&PrefillDataRaptorBundle=&scriptMode=vertical&layout=lightning",
                        "%vlocity_namespace%__VlocityIcon__c": "task",
                        "Name": "Story_updateTask",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityAction__c",
                        "VlocityRecordSourceKey": "VlocityAction/Story_updateTask/%vlocity_namespace%__VlocityAction__c/Story_updateTask"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityAction/Story_updateTask",
                "VlocityDataPackType": "VlocityAction"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityAction/Story_updateTask",
            "VlocityDataPackName": "Story_updateTask",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityAction"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityCard__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__Definition__c": "{\"dataSource\":{\"type\":\"Query\",\"value\":{\"query\":\"SELECT Name FROM AttributeCategory__c\"}},\"filter\":{},\"states\":[{\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"editing\":false,\"fieldType\":\"custom\",\"label\":\"Name\",\"name\":\"[Name]\",\"type\":\"string\"}],\"name\":\"Campaign Attribute Categories\",\"sObjectType\":null,\"templateUrl\":\"campaign-member-filter\"}],\"title\":\"Attribute Categories\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Attribute Categories/Vlocity/1/1512450338024",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Attribute Categories",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Attribute Categories/%vlocity_namespace%__VlocityCard__c/Campaign Attribute Categories"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Attribute Categories",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Attribute Categories",
            "VlocityDataPackName": "Campaign Attribute Categories",
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
                        "%vlocity_namespace%__Definition__c": "{\"filter\":{\"['objType']\":\"Campaign\"},\"states\":[{\"collapse\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Status\",\"name\":\"['subtitle']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Type\",\"name\":\"['highlight']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"custom\",\"label\":\"Responded\",\"name\":\"['activityType']\",\"type\":\"string\"}],\"name\":\"Campaign Policy Expiration\",\"sObjectType\":\"Case\",\"templateUrl\":\"campaign-member-story-card\"}],\"title\":\"Campaign\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Campaign Story/Vlocity/1/1512450338029",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Campaign Story",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Campaign Story/%vlocity_namespace%__VlocityCard__c/Campaign Campaign Story"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Campaign Story",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Campaign Story",
            "VlocityDataPackName": "Campaign Campaign Story",
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
                        "%vlocity_namespace%__Definition__c": "{\"filter\":{\"['objType']\":\"Case\"},\"states\":[{\"collapse\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Status\",\"name\":\"['subtitle']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Case Type\",\"name\":\"['highlight']\",\"type\":\"string\"}],\"name\":\"Campaign Policy Expiration\",\"sObjectType\":\"Case\",\"templateUrl\":\"campaign-member-story-card\"}],\"title\":\"Case\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Case Story/Vlocity/1/1512450338033",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Case Story",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Case Story/%vlocity_namespace%__VlocityCard__c/Campaign Case Story"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Case Story",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Case Story",
            "VlocityDataPackName": "Campaign Case Story",
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
                        "%vlocity_namespace%__Definition__c": "{\"filter\":{\"['objType']\":\"Claim\"},\"states\":[{\"collapse\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Claim Number\",\"name\":\"['subtitle']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Loss Type\",\"name\":\"['highlight']\",\"type\":\"string\"}],\"name\":\"Campaign Policy Expiration\",\"sObjectType\":\"Case\",\"templateUrl\":\"campaign-member-story-card\"}],\"title\":\"Claim\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Claim Story/Vlocity/1/1512450338037",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Claim Story",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Claim Story/%vlocity_namespace%__VlocityCard__c/Campaign Claim Story"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Claim Story",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Claim Story",
            "VlocityDataPackName": "Campaign Claim Story",
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
                        "%vlocity_namespace%__Definition__c": "{\"dataSource\":{\"contextVariables\":[],\"type\":null,\"value\":{\"query\":\"\"}},\"filter\":{},\"states\":[{\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Description\",\"name\":\"['Description']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"custom\",\"label\":\"Create By (footer)\",\"name\":\"['CreatedBy']['Name']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"custom\",\"label\":\"Created on (footer)\",\"name\":\"['CreatedDate']\",\"type\":\"date\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"custom\",\"label\":\"Last Modified on (footer)\",\"name\":\"['LastModifiedDate']\",\"type\":\"date\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Email Template\",\"name\":\"['%vlocity_namespace%__EmailTemplate__c']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"OwnerId\",\"name\":\"['OwnerId']\",\"type\":\"string\"}],\"name\":\"Campaign Detail\",\"sObjectType\":\"Campaign\",\"templateUrl\":\"campaign-detail\"}],\"title\":\"Campaign Detail\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Detail/Vlocity/1/1512450338041",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Detail",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Detail/%vlocity_namespace%__VlocityCard__c/Campaign Detail"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Detail",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Detail",
            "VlocityDataPackName": "Campaign Detail",
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
                        "%vlocity_namespace%__Definition__c": "{\"filter\":{\"['objType']\":\"Event\"},\"states\":[{\"collapse\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Location\",\"name\":\"['subtitle']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Type\",\"name\":\"['highlight']\",\"type\":\"string\"}],\"name\":\"Campaign Policy Expiration\",\"sObjectType\":\"Case\",\"templateUrl\":\"campaign-member-story-card\"}],\"title\":\"Event\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Event Story/Vlocity/1/1512450338046",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Event Story",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Event Story/%vlocity_namespace%__VlocityCard__c/Campaign Event Story"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Event Story",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Event Story",
            "VlocityDataPackName": "Campaign Event Story",
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
                        "%vlocity_namespace%__Definition__c": "{\"filter\":{\"['objType']\":\"Campaign Member Action Log\"},\"states\":[{\"collapse\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Attempted Call\",\"name\":\"['highlight']\",\"type\":\"string\"}],\"name\":\"Campaign Member Action Log\",\"sObjectType\":\"%vlocity_namespace%__CampaignMemberActionLog__c\",\"templateUrl\":\"campaign-member-story-card\"}],\"title\":\"Action Log\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Member Action Log Story/Vlocity/1/1512450338050",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Member Action Log Story",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Member Action Log Story/%vlocity_namespace%__VlocityCard__c/Campaign Member Action Log Story"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Member Action Log Story",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Member Action Log Story",
            "VlocityDataPackName": "Campaign Member Action Log Story",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityCard"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityCard__c": [
                    {
                        "%vlocity_namespace%__Definition__c": "{\"dataSource\":{\"type\":null,\"value\":{\"query\":\"\"}},\"filter\":{},\"states\":[{\"blankCardState\":true,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'non-existent'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[],\"filter\":\"$scope.data.status === 'non-existent'\",\"name\":\"Campaign Member Detail\",\"sObjectType\":\"CampaignMember\",\"templateUrl\":\"campaign-member-detail-blank\"}],\"title\":\"Campaign Member Detail\"}",
                        "Name": "Campaign Member Detail",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Member Detail/%vlocity_namespace%__VlocityCard__c/Campaign Member Detail"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Member Detail",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Member Detail",
            "VlocityDataPackName": "Campaign Member Detail",
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
                        "%vlocity_namespace%__Definition__c": "{\"dataSource\":{\"contextVariables\":[],\"type\":null,\"value\":{\"inputMap\":{},\"optionsMap\":{},\"query\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteNSPrefix\":\"%vlocity_namespace%\",\"resultVar\":\"\"}},\"filter\":{},\"states\":[{\"blankCardState\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[],\"filter\":\"$scope.data.status === 'active'\",\"name\":\"Campaign Member Detail Active\",\"sObjectType\":\"CampaignMember\",\"templateUrl\":\"campaign-member-detail\"}],\"title\":\"Campaign Member Detail Active\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Member Detail Active/Vlocity/1/1512450338058",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Member Detail Active",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Member Detail Active/%vlocity_namespace%__VlocityCard__c/Campaign Member Detail Active"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Member Detail Active",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Member Detail Active",
            "VlocityDataPackName": "Campaign Member Detail Active",
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
                        "%vlocity_namespace%__Definition__c": "{\"dataSource\":{\"type\":\"Query\",\"value\":{\"query\":\"Select Id, Name from CampaignMember\"}},\"filter\":{},\"states\":[{\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"fieldType\":\"standard\",\"label\":\"Name\",\"name\":\"['Name']\",\"type\":\"string\"},{\"collapse\":true,\"fieldType\":\"standard\",\"label\":\"Id\",\"name\":\"['Id']\",\"type\":\"string\"}],\"name\":\"Campaign Member Detail Card\",\"sObjectType\":\"CampaignMember\",\"templateUrl\":\"campaign-member-manager\"}],\"title\":\"Campaign Member Detail Card\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Member Detail Card/Vlocity/1/1512450338062",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Member Detail Card",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Member Detail Card/%vlocity_namespace%__VlocityCard__c/Campaign Member Detail Card"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Member Detail Card",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Member Detail Card",
            "VlocityDataPackName": "Campaign Member Detail Card",
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
                        "%vlocity_namespace%__Definition__c": "{\"dataSource\":{\"type\":null},\"filter\":{},\"states\":[{\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[],\"name\":\"Campaign Member Log Actions\",\"sObjectType\":\"CampaignMember\",\"templateUrl\":\"campaign-member-log-actions\"}],\"title\":\"Campaign Member Log Actions\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Member Log Actions2/Vlocity/1/1512450338066",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Member Log Actions2",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Member Log Actions2/%vlocity_namespace%__VlocityCard__c/Campaign Member Log Actions2"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Member Log Actions2",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Member Log Actions2",
            "VlocityDataPackName": "Campaign Member Log Actions2",
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
                        "%vlocity_namespace%__Definition__c": "{\"filter\":{\"['objType']\":\"Non Held Policy\"},\"states\":[{\"collapse\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Policy Type\",\"name\":\"['highlight']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"LOB\",\"name\":\"['subtitle']\",\"type\":\"string\"}],\"name\":\"Campaign Policy Expiration\",\"sObjectType\":\"%vlocity_namespace%__Policy__c\",\"templateUrl\":\"campaign-member-story-card\"}],\"title\":\"Non Held Policy\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Non Held Policy Story/Vlocity/1/1512450338070",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Non Held Policy Story",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Non Held Policy Story/%vlocity_namespace%__VlocityCard__c/Campaign Non Held Policy Story"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Non Held Policy Story",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Non Held Policy Story",
            "VlocityDataPackName": "Campaign Non Held Policy Story",
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
                        "%vlocity_namespace%__Definition__c": "{\"filter\":{\"['objType']\":\"Note\"},\"states\":[{\"collapse\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[],\"name\":\"Campaign Note\",\"sObjectType\":\"Note\",\"templateUrl\":\"campaign-member-story-card\"}],\"title\":\"Note\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Note Story/Vlocity/1/1512450338073",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Note Story",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Note Story/%vlocity_namespace%__VlocityCard__c/Campaign Note Story"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Note Story",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Note Story",
            "VlocityDataPackName": "Campaign Note Story",
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
                        "%vlocity_namespace%__Definition__c": "{\"filter\":{\"['objType']\":\"Opportunity\"},\"states\":[{\"collapse\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Stage\",\"name\":\"['subtitle']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Amount\",\"name\":\"['highlight']\",\"type\":\"string\"}],\"name\":\"Campaign Policy Expiration\",\"sObjectType\":\"Opportunity\",\"templateUrl\":\"campaign-member-story-card\"}],\"title\":\"Opportunity\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Opportunity Story/Vlocity/1/1512450338077",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Opportunity Story",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Opportunity Story/%vlocity_namespace%__VlocityCard__c/Campaign Opportunity Story"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Opportunity Story",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Opportunity Story",
            "VlocityDataPackName": "Campaign Opportunity Story",
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
                        "%vlocity_namespace%__Definition__c": "{\"filter\":{\"['objType']\":\"Policy\"},\"states\":[{\"collapse\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Policy Status\",\"name\":\"['subtitle']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Policy Number\",\"name\":\"['highlight']\",\"type\":\"string\"}],\"name\":\"Campaign Policy Expiration\",\"sObjectType\":\"%vlocity_namespace%__Policy__c\",\"templateUrl\":\"campaign-member-story-card\"}],\"title\":\"Policy\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Policy Story/Vlocity/1/1512450338081",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Policy Story",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Policy Story/%vlocity_namespace%__VlocityCard__c/Campaign Policy Story"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Policy Story",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Policy Story",
            "VlocityDataPackName": "Campaign Policy Story",
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
                        "%vlocity_namespace%__Definition__c": "{\"filter\":{\"['objType']\":\"Saved OmniScript\"},\"states\":[{\"collapse\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Status\",\"name\":\"['subtitle']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"OmniScript Type\",\"name\":\"['highlight']\",\"type\":\"string\"}],\"name\":\"Campaign Policy Expiration\",\"sObjectType\":\"Case\",\"templateUrl\":\"campaign-member-story-card\"}],\"title\":\"Saved OmniScript\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Saved OmniScript Story/Vlocity/1/1512450338085",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Saved OmniScript Story",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Saved OmniScript Story/%vlocity_namespace%__VlocityCard__c/Campaign Saved OmniScript Story"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Saved OmniScript Story",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Saved OmniScript Story",
            "VlocityDataPackName": "Campaign Saved OmniScript Story",
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
                        "%vlocity_namespace%__Definition__c": "{\"filter\":{\"['objType']\":\"Task\"},\"states\":[{\"actionCtxId\":\"['Id']\",\"collapse\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Priority\",\"name\":\"['subtitle']\",\"type\":\"string\"},{\"collapse\":true,\"editing\":false,\"fieldType\":\"standard\",\"label\":\"Status\",\"name\":\"['highlight']\",\"type\":\"string\"}],\"name\":\"Campaign Policy Expiration\",\"sObjectType\":\"Task\",\"templateUrl\":\"campaign-member-story-card\"}],\"title\":\"Task\"}",
                        "%vlocity_namespace%__GlobalKey__c": "Campaign Task Story/Vlocity/1/1512450338089",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Campaign Task Story",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/Campaign Task Story/%vlocity_namespace%__VlocityCard__c/Campaign Task Story"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/Campaign Task Story",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/Campaign Task Story",
            "VlocityDataPackName": "Campaign Task Story",
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
                        "%vlocity_namespace%__Definition__c": "{\"dataSource\":{\"contextVariables\":[],\"type\":null,\"value\":{\"inputMap\":{\"campaignId\":\"70136000000JwSF\"},\"query\":\"SELECT  Status, TargetCallDate__c, City, FirstName, LastName, Name, Type, MobilePhone, LeadOrContactId, HasResponded, Email, CompanyOrAccount, Title FROM CampaignMember WHERE CampaignId='{{params.id}}'\",\"remoteClass\":\"CampaignListHandler\",\"remoteMethod\":\"getMemberListByCampaign\",\"remoteNSPrefix\":\"%vlocity_namespace%\"}},\"filter\":{},\"states\":[{\"actionCtxId\":\"\",\"blankCardState\":false,\"collapse\":false,\"conditions\":[{\"field\":\"$scope.data.status\",\"operator\":\"===\",\"type\":\"system\",\"value\":\"'active'\"}],\"definedActions\":{\"actions\":[]},\"fields\":[],\"filter\":\"$scope.data.status === 'active'\",\"name\":\"All Campaign Members\",\"sObjectType\":\"CampaignMember\",\"templateUrl\":\"campaign-member-list\"}],\"title\":\"campaign-member-list\"}",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-member/Vlocity/1/1512450338093",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityCard__c",
                        "VlocityRecordSourceKey": "VlocityCard/campaign-member/%vlocity_namespace%__VlocityCard__c/campaign-member"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityCard/campaign-member",
                "VlocityDataPackType": "VlocityCard"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityCard/campaign-member",
            "VlocityDataPackName": "campaign-member",
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
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[],\"dataSource\":{\"type\":\"ApexRemote\",\"value\":{\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteNSPrefix\":\"%vlocity_namespace%\"}},\"templates\":{\"0\":{\"templateUrl\":\"campaign-add-member\"}}}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-add-member/1/Vlocity/1512450359017",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-add-member",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/campaign-add-member/%vlocity_namespace%__VlocityUILayout__c/campaign-add-member"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/campaign-add-member",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/campaign-add-member",
            "VlocityDataPackName": "campaign-add-member",
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
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[],\"dataSource\":{\"type\":\"ApexRemote\",\"value\":{\"remoteClass\":\"CampaignAddMemberHandler\",\"remoteMethod\":\"getCategoriesAndFilterList\",\"remoteNSPrefix\":\"%vlocity_namespace%\"}},\"templates\":{\"0\":{\"templateUrl\":\"campaign-add-member-list\"}}}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-add-member-list/1/Vlocity/1512450359020",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-add-member-list",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/campaign-add-member-list/%vlocity_namespace%__VlocityUILayout__c/campaign-add-member-list"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/campaign-add-member-list",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/campaign-add-member-list",
            "VlocityDataPackName": "campaign-add-member-list",
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
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[],\"templates\":{\"0\":{\"templateUrl\":\"campaign-base-grid\"}}}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-base-grid/1/Vlocity/1512450359024",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-base-grid",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/campaign-base-grid/%vlocity_namespace%__VlocityUILayout__c/campaign-base-grid"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/campaign-base-grid",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/campaign-base-grid",
            "VlocityDataPackName": "campaign-base-grid",
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
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[\"Campaign Detail\"],\"dataSource\":{\"contextVariables\":[{\"name\":\"params.id\",\"val\":\"701o0000000S1AH\"}],\"type\":\"Query\",\"value\":{\"query\":\"SELECT ActualCost,AmountAllOpportunities,AmountWonOpportunities,BudgetedCost,CampaignMemberRecordTypeId,CreatedById,CreatedDate,Description,EndDate,ExpectedResponse,ExpectedRevenue,Id,IsActive,Name,NumberOfContacts,NumberOfConvertedLeads,NumberOfLeads,NumberOfOpportunities,NumberOfResponses,NumberOfWonOpportunities,NumberSent,OwnerId,ParentId,RecordTypeId,StartDate,Status,Type, LastModifiedDate, CreatedBy.Name,%vlocity_namespace%__EmailTemplate__c,%vlocity_namespace%__MassEmailSubject__c, %vlocity_namespace%__MassEmailContent__c FROM Campaign WHERE Id = '{{params.id}}'\"}},\"templates\":{\"0\":{\"templateUrl\":\"campaign-column\"}}}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-detail/1/Vlocity/1512450359028",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-detail",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/campaign-detail/%vlocity_namespace%__VlocityUILayout__c/campaign-detail"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/campaign-detail",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/campaign-detail",
            "VlocityDataPackName": "campaign-detail",
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
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[\"Campaign Member Detail Active\"],\"dataSource\":{\"contextVariables\":[{\"name\":\"params.id\",\"val\":\"701o0000000S1AH\"}],\"type\":\"Dual\",\"value\":{\"endpoint\":\"/services/apexrest/%vlocity_namespace%/v2/campaigns/{{params.id}}/memberstatusvalues\",\"inputMap\":{\"campaignId\":\"{{params.id}}\"},\"methodType\":\"GET\",\"query\":\"SELECT Id From CampaignMember Where Id = '{{params.id}}'\",\"remoteClass\":\"CampaignListHandler\",\"remoteMethod\":\"getMemberStatusByCampaign\",\"remoteNSPrefix\":\"%vlocity_namespace%\",\"resultVar\":\"result\"}},\"sessionVars\":[],\"templates\":{\"0\":{\"templateUrl\":\"campaign-column\"}}}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-member-detail/1/Vlocity/1512450359031",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-detail",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/campaign-member-detail/%vlocity_namespace%__VlocityUILayout__c/campaign-member-detail"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/campaign-member-detail",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/campaign-member-detail",
            "VlocityDataPackName": "campaign-member-detail",
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
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[\"Campaign Attribute Categories\"],\"templates\":{\"0\":{\"templateUrl\":\"campaign-member-filter\"}}}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-member-filter/1/Vlocity/1512450359035",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-filter",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/campaign-member-filter/%vlocity_namespace%__VlocityUILayout__c/campaign-member-filter"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/campaign-member-filter",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/campaign-member-filter",
            "VlocityDataPackName": "campaign-member-filter",
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
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[\"campaign-member\"],\"dataSource\":{\"contextVariables\":[{\"name\":\"params.id\",\"val\":\"701o0000000S1AH\"}],\"type\":\"Dual\",\"value\":{\"endpoint\":\"/services/apexrest/%vlocity_namespace%/v2/campaigns/{{params.id}}/members?pageSize=10&sortFields=LastName\",\"inputMap\":{\"campaignId\":\"{{params.id}}\",\"pageSize\":\"10\",\"sortFields\":\"LastName\"},\"methodType\":\"GET\",\"query\":\"\",\"remoteClass\":\"CampaignListHandler\",\"remoteMethod\":\"getMemberListByCampaign\",\"remoteNSPrefix\":\"%vlocity_namespace%\"}},\"templates\":{\"0\":{\"templateUrl\":\"campaign-column\"}}}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-member-list/1/Vlocity/1512450359039",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-list",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/campaign-member-list/%vlocity_namespace%__VlocityUILayout__c/campaign-member-list"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/campaign-member-list",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/campaign-member-list",
            "VlocityDataPackName": "campaign-member-list",
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
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[\"Campaign Member Log Actions2\"],\"dataSource\":{\"contextVariables\":[{\"name\":\"$root.campaignMember.Id.value\",\"val\":\"00v41000000Ven3AAC\"}],\"type\":\"Dual\",\"value\":{\"apexRemoteResultVar\":\"result.records\",\"apexRestResultVar\":\"result.records\",\"endpoint\":\"/services/apexrest/%vlocity_namespace%/v1/storyquickactions/actionlist/{{$root.campaignMember.Id.value}}\",\"inputMap\":{\"storyId\":\"{{$root.campaignMember.Id.value}}\"},\"methodType\":\"GET\",\"remoteClass\":\"StoryListHandler\",\"remoteMethod\":\"getStoryObjects\",\"remoteNSPrefix\":\"%vlocity_namespace%\",\"resultVar\":\"result.records\"}},\"sessionVars\":[],\"templates\":{\"0\":{\"templateUrl\":\"campaign-column-middle\"}}}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-member-log-actions/1/Vlocity/1512450359043",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-log-actions",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/campaign-member-log-actions/%vlocity_namespace%__VlocityUILayout__c/campaign-member-log-actions"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/campaign-member-log-actions",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/campaign-member-log-actions",
            "VlocityDataPackName": "campaign-member-log-actions",
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
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[\"Campaign Member Detail Card\"],\"templates\":{\"0\":{\"templateUrl\":\"campaign-member-manager\"}}}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-member-manager/1/Vlocity/1512450359046",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-manager",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/campaign-member-manager/%vlocity_namespace%__VlocityUILayout__c/campaign-member-manager"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/campaign-member-manager",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/campaign-member-manager",
            "VlocityDataPackName": "campaign-member-manager",
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
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[\"Campaign Policy Story\",\"Campaign Non Held Policy Story\",\"Campaign Opportunity Story\",\"Campaign Case Story\",\"Campaign Event Story\",\"Campaign Saved OmniScript Story\",\"Campaign Task Story\",\"Campaign Campaign Story\",\"Campaign Claim Story\",\"Campaign Note Story\",\"Campaign Member Action Log Story\"],\"dataSource\":{\"contextVariables\":[{\"name\":\"$root.campaignMember.Id.value\",\"val\":\"00v41000000Ven3AAC\"}],\"type\":\"Dual\",\"value\":{\"apexRemoteResultVar\":\"Stories\",\"apexRestResultVar\":\"Stories\",\"endpoint\":\"/services/apexrest/%vlocity_namespace%/v1/story/{{$root.campaignMember.Id.value}}?pageSize=3\",\"inputMap\":{\"pageSize\":\"10\",\"storyId\":\"{{$root.campaignMember.Id.value}}\"},\"methodType\":\"GET\",\"remoteClass\":\"StoryListHandler\",\"remoteMethod\":\"getStories\",\"remoteNSPrefix\":\"%vlocity_namespace%\",\"resultVar\":\"Stories\"}},\"templates\":{\"0\":{\"templateUrl\":\"campaign-member-stories\"}}}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-member-stories/1/Vlocity/1512450359050",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-stories",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/campaign-member-stories/%vlocity_namespace%__VlocityUILayout__c/campaign-member-stories"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/campaign-member-stories",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/campaign-member-stories",
            "VlocityDataPackName": "campaign-member-stories",
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
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[],\"dataSource\":{\"contextVariables\":[{\"name\":\"params.id\",\"val\":\"70136000000JwSF\"}],\"type\":\"ApexRemote\",\"value\":{\"inputMap\":{\"campaignId\":\"{{params.id}}\"},\"remoteClass\":\"CampaignListHandler\",\"remoteMethod\":\"getMembersActionAggInfoByCampaign\",\"remoteNSPrefix\":\"%vlocity_namespace%\"}},\"templates\":{\"0\":{\"templateUrl\":\"campaign-results\"}}}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-results/1/Vlocity/1512450359056",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-results",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/campaign-results/%vlocity_namespace%__VlocityUILayout__c/campaign-results"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/campaign-results",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/campaign-results",
            "VlocityDataPackName": "campaign-results",
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
                        "%vlocity_namespace%__Definition__c": "{\"Cards\":[],\"dataSource\":{\"contextVariables\":[{\"name\":\"params.id\",\"val\":\"70136000000JwSFAA0\"}],\"type\":\"ApexRemote\",\"value\":{\"inputMap\":{\"campaignId\":\"{{params.id}}\"},\"remoteClass\":\"CampaignListHandler\",\"remoteMethod\":\"getMemberStatusByCampaign\",\"remoteNSPrefix\":\"%vlocity_namespace%\",\"resultVar\":\"\"}},\"templates\":{\"0\":{\"templateUrl\":\"campaign-status\"}}}",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__GlobalKey__c": "campaign-status/1/Vlocity/1512450359060",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Layout",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-status",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUILayout__c",
                        "VlocityRecordSourceKey": "VlocityUILayout/campaign-status/%vlocity_namespace%__VlocityUILayout__c/campaign-status"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUILayout/campaign-status",
                "VlocityDataPackType": "VlocityUILayout"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUILayout/campaign-status",
            "VlocityDataPackName": "campaign-status",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUILayout"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": ".via-slds .slds-table td {\n  padding: 0.2rem; }\n\n.via-slds .slds-icon.nav {\n  fill: #4F6A92; }\n",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-add-member/1/Vlocity/1512540858715",
                        "%vlocity_namespace%__HTML__c": "<div class=\"slds-grid slds-grid--vertical-stretch slds-wrap slds-grid--pull-padded  slds-m-horizontal--xxx-small\">\n    <vloc-layout layout-name=\"campaign-member-filter\" ctrl=\"CampaignAddMemberController\"></vloc-layout>\n    <div class=\"slds-col slds-size--5-of-8\">\n        <vloc-layout layout-name=\"campaign-add-member-list\" ctrl=\"CampaignAddMemberController\"></vloc-layout>\n    </div>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Sass__c": ".via-slds {\n    .slds-table td{\n        padding: 0.2rem;\n    }\n    \n     .slds-icon{\n        &.nav{\n           fill: #4F6A92;\n        }\n    }\n    \n}",
                        "%vlocity_namespace%__Type__c": "Containers",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-add-member",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-add-member/%vlocity_namespace%__VlocityUITemplate__c/campaign-add-member"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-add-member",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-add-member",
            "VlocityDataPackName": "campaign-add-member",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": ".via-slds .top-bar {\n  background: #f7f9fb; }\n\n.via-slds .slds-icon.filter {\n  fill: #4F6A92;\n  background: white;\n  border: 1px solid #d8dde6;\n  height: 2.4em;\n  padding: 0.3em; }\n\n.via-slds .slds-icon.nav {\n  fill: #4F6A92; }\n\n.via-slds .close-btn {\n  position: relative;\n  top: -.5rem;\n  color: white; }\n\n.via-slds .table-cell {\n  padding-top: .2rem !important;\n  padding-bottom: .2rem !important; }\n",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-add-member-list/1/Vlocity/1512540858733",
                        "%vlocity_namespace%__HTML__c": "<!--SEARCH / DROPDOWN-->\n <div class=\"slds-spinner_container\" ng-show=\"importedScope.isLoading\">\n    <div class=\"slds-spinner slds-spinner--medium\" aria-hidden=\"false\" role=\"alert\">\n        <div class=\"slds-spinner__dot-a\"></div>\n        <div class=\"slds-spinner__dot-b\"></div>\n    </div>\n</div> \n<ul class=\"top-bar slds-list--horizontal slds-p-vertical--xx-small\" ng-init=\"importedScope.setObj(records, params.id)\">\n    <div class=\"slds-notify_container\" ng-show=\"importedScope.showBanner\">\n        <div class=\"slds-notify slds-notify--alert slds-theme--success slds-theme--alert-texture slds-p-vertical--medium\" role=\"alert\">\n            <button class=\"slds-button slds-float--right close-btn\"  ng-click=\"importedScope.showBanner = false\">\n                <slds-button-svg-icon sprite=\"'utility'\" icon=\"'close'\"></slds-button-svg-icon>\n                <span class=\"slds-assistive-text\">Close</span>\n            </button>\n            <span class=\"slds-assistive-text\">Success</span>\n            <h2>{{importedScope.bannerText}}</h2>\n        </div>\n    </div>\n    <div class=\"slds-notify_container\" ng-show=\"importedScope.showErrorBanner\">\n        <div class=\"slds-notify slds-notify--alert slds-theme--error slds-theme--alert-texture slds-p-vertical--medium\" role=\"alert\">\n            <button class=\"slds-button slds-float--right close-btn\"  ng-click=\"importedScope.showErrorBanner = false\">\n                <slds-button-svg-icon sprite=\"'utility'\" icon=\"'close'\"></slds-button-svg-icon>\n                <span class=\"slds-assistive-text\">Close</span>\n            </button>\n            <h2>{{importedScope.bannerText}}</h2>\n        </div>\n    </div>\n    <div class=\"slds-m-left--x-small  slds-m-right--x-small\"  onmouseover=\"this.style.cursor='pointer'\">\n        <span class=\"slds-icon_container\" ng-click=\"importedScope.showFilter();\">\n            <slds-svg-icon sprite=\"'utility'\" icon=\"'filterList'\" extra-classes=\"'filter'\"></slds-svg-icon>\n        </span>\n    </div>\n    <div class=\"slds-form-element slds-size--1-of-2\">\n        <div class=\"slds-form-element__control\">\n            <div class=\"slds-select_container\">\n                <select id=\"select-01\" class=\"slds-select\" ng-change=\"importedScope.query(selected_filter)\" ng-model=\"selected_filter\">\n                    <option value=\"{{filter}}\" ng-repeat=\"filter in importedScope.filters\">{{filter.displayName}}</option>\n                </select>\n            </div>\n        </div>\n    </div>\n    <div class=\"slds-form-element slds-size--1-of-2 slds-m-horizontal--medium\">\n        <div class=\"slds-form-element__control slds-input-has-icon slds-input-has-icon--left\">\n            <slds-input-svg-icon sprite=\"'utility'\" icon=\"'search'\" extra-classes=\"'slds-icon-text-default'\"></slds-input-svg-icon>\n            <input id=\"text-input-01\" class=\"slds-input\" type=\"text\" placeholder=\"Search Results\" ng-model=\"importedScope.searchText\" ng-change=\"importedScope.query(selected_filter)\"/>\n        </div>\n    </div>\n</ul>\n\n<!--TABLE-->\n<table class=\"slds-table slds-no-row-hover slds-m-left--xxx-small\" role=\"listbox\">\n    <thead>\n        <tr class=\"slds-table--bordered\">\n            <th class=\"table-cell\">\n                <label class=\"slds-checkbox\">\n                <input type=\"checkbox\" id=\"checkbox-contacts\" ng-model=\"importedScope.select_all\" ng-change=\"importedScope.selectAll(importedScope.select_all)\"/>\n                <span class=\"slds-checkbox--faux\"></span>\n                </label>\n            </th>\n            <th scope=\"col\">Name</th>\n            <th scope=\"col\">Title</th>\n            <th scope=\"col\" ng-if=\"importedScope.show_company\">Company<span ng-if=\"importMembers\" class=\"slds-float--right\">({{selectedMembers.length}}/{{importMembers.length}})</span></th>\n        </tr>\n    </thead>\n    <tbody class=\"table-body\">\n        <tr class=\"slds-hint-parent\" ng-repeat=\"member in importedScope.importMembers\" ng-click=\"importedScope.updateMember(member)\" onmouseover=\"this.style.cursor='pointer'\" ng-class=\"{'slds-is-selected' : member.isSelected}\">\n            <th class=\"table-cell\">\n                <label class=\"slds-checkbox\">\n                    <input type=\"checkbox\" name=\"options\" id=\"checkbox-contacts\" ng-model=\"member.isSelected\"/>\n                    <span class=\"slds-checkbox--faux\"></span>\n                    </label>\n            </th>\n            <th scope=\"row\" class=\"slds-cell-wrap\">\n                <div class=\"slds-truncate\">\n                    <a ng-click=\"navigateTo(member.Id)\">{{member.Name.value}}</a></div>\n            </th>\n            <td class=\"slds-truncate slds-cell-wrap\">{{member.Title.value}}{{member.PersonTitle.value}}</td>\n            <td ng-if=\"member.Company.value || member.Account.Name\" class=\"slds-truncate slds-cell-wrap\">{{member.Company.value}} {{member.Account.Name}}</td>\n        </tr>\n    </tbody>\n</table>\n\n<!--EMPTY LIST WARNING-->\n<div ng-if=\"importedScope.importMembers.length == 0 || importedScope.importMembers === undefined\" class=\"slds-notify slds-notify--alert slds-theme--alert-texture\" role=\"alert\">\n    <button class=\"slds-button slds-button--icon-inverse slds-notify__close\">\n        <slds-button-svg-icon sprite=\"'utility'\" icon=\"'close'\" ></slds-button-svg-icon>\n    </button>\n    <h2>There Are No Members to Add To Campaign</h2>\n    <div class=\"slds-text-body--small\">Please Select A List form the Drop Down Above or Clear Filters</div>\n</div>\n\n<!--FOOTER-->\n<footer class=\"slds-shrink-none\">\n    <ul class=\"slds-list--horizontal slds-float--right\" ng-show=\"importedScope.calcPageNo() !== 'No Records'\">\n        <div class=\"slds-align-middle\">\n            <button class=\"slds-button nav-button\" ng-click=\"importedScope.previousPage()\" ng-disabled=\"!importedScope.prevPageAction\">\n                <span class=\"slds-icon_container\">\n                    <slds-svg-icon sprite=\"'utility'\" icon=\"'chevronleft'\" size=\"'small'\" extra-classes=\"'nav'\" ></slds-svg-icon>\n                </span>\n            </button>\n        </div>\n        <button class=\"slds-button nav-btn slds-align-middle\" disabled='true'>\n            {{importedScope.calcPageNo()}}\n        </button>\n        <div class=\"slds-align-middle\">\n            <button class=\"slds-button nav-btn\" ng-click=\"importedScope.nextPage()\" ng-disabled=\"!importedScope.nextPageAction\"> \n                <span class=\"slds-icon_container\">\n                    <slds-svg-icon sprite=\"'utility'\" icon=\"'chevronright'\" size=\"'small'\" extra-classes=\"'nav'\" ></slds-svg-icon>\n                </span>\n            </button>\n        </div>\n        <div class=\"slds-form-element slds-m-around--medium\">\n            <button class=\"slds-button slds-button--neutral\" ng-click=\"importedScope.addAll()\"> Add All </button>\n            <button class=\"slds-button slds-button--brand\" ng-click=\"importedScope.addSelected()\"> Add Selected <span ng-show=\"importedScope.calcTotalSelected() > 0\">({{importedScope.calcTotalSelected()}})</span></button>\n        </div>\n    </ul>\n</footer>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__SampleJson__c": "{\"data\":{\"actions\":[{\"displayName\":\"Like Action\",\"vlocityIcon\":\"icon-v-heart\"}],\"fields\":[{\"label\":\"Description\",\"name\":\"description\"},{\"label\":\"Cost\",\"name\":\"cost\",\"type\":\"currency\"}],\"title\":\"Card Title\"},\"obj\":{\"Id\":\"123456\",\"LastModifiedDate\":\"2016-07-28T19:58:13.256Z\",\"Name\":\"Object Name\",\"cost\":150,\"description\":\"Some description\"}}",
                        "%vlocity_namespace%__Sass__c": ".via-slds{\n    \n    .top-bar{\n        background: #f7f9fb;\n    }\n    \n    \n    .slds-icon{\n        &.filter{\n           fill: #4F6A92;\n           background: white;\n           border: 1px solid #d8dde6;\n           height: 2.4em;\n           padding: 0.3em;\n        }\n    }\n    \n     .slds-icon{\n        &.nav{\n           fill: #4F6A92;\n        }\n    }\n    \n    .close-btn{\n        position: relative;\n        top: -.5rem;\n        color: white;\n    }\n    \n    .table-cell{\n        padding-top: .2rem !important;\n        padding-bottom: .2rem !important;\n    }\n}",
                        "%vlocity_namespace%__Type__c": "Cards",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-add-member-list",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-add-member-list/%vlocity_namespace%__VlocityUITemplate__c/campaign-add-member-list"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-add-member-list",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-add-member-list",
            "VlocityDataPackName": "campaign-add-member-list",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": "/*** MIXINS ***/\n/*** MIXINS ***/\n.via-slds .slds-modal__container {\n  justify-content: normal; }\n\n.card-header {\n  display: none !important; }\n\n/*** STYLES ***/\n.campaign-base-grid {\n  background-color: white; }\n  .campaign-base-grid .campaign-container {\n    height: 100%;\n    width: 100%;\n    transition: width 500ms ease-in; }\n    .campaign-base-grid .campaign-container .slds-col {\n      overflow-y: auto;\n      height: 100%; }\n    .campaign-base-grid .campaign-container .campaign-member-container {\n      width: 100%;\n      height: 100%; }\n    .campaign-base-grid .campaign-container .campaign-member-list-container {\n      border-right: 1px solid #d8dde6;\n      background-color: #f4f6f9; }\n    .campaign-base-grid .campaign-container .campaign-member-detail {\n      transition: all 500ms ease-in;\n      padding-right: 0; }\n      .campaign-base-grid .campaign-container .campaign-member-detail .right-sidebar-overlay {\n        position: fixed;\n        z-index: 9999;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background-color: #7e8c99;\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0s linear 0.5s, opacity 0.5s ease-in; }\n      .campaign-base-grid .campaign-container .campaign-member-detail.toggle-right-collapsed {\n        padding-right: 3rem; }\n      .campaign-base-grid .campaign-container .campaign-member-detail.toggle-right-expanded {\n        padding-right: 0; }\n      .campaign-base-grid .campaign-container .campaign-member-detail .campaign-member-container {\n        border-right: none; }\n    .campaign-base-grid .campaign-container .campaign-details-right {\n      border-right: none;\n      transition: right 500ms ease-in;\n      right: 0; }\n      .campaign-base-grid .campaign-container .campaign-details-right.toggle-right-collapsed {\n        right: 3rem; }\n      .campaign-base-grid .campaign-container .campaign-details-right.toggle-right-expanded {\n        right: 0; }\n    @media (min-width: 30em) and (max-width: 64em) {\n      .campaign-base-grid .campaign-container .campaign-member-detail.toggle-right-expanded {\n        padding-right: 3rem; }\n        .campaign-base-grid .campaign-container .campaign-member-detail.toggle-right-expanded .right-sidebar-overlay {\n          opacity: 0.8;\n          visibility: visible;\n          transition: visibility 0s linear 0s, opacity 0.5s ease-in; }\n      .campaign-base-grid .campaign-container .campaign-member-detail.toggle-right-collapsed .right-sidebar-overlay {\n        opacity: 0;\n        visibility: hidden;\n        transition: visibility 0s linear 0.5s, opacity 0.5s ease-in; }\n      .campaign-base-grid .campaign-container .campaign-details-right {\n        position: absolute;\n        z-index: 9999;\n        width: 16rem; }\n        .campaign-base-grid .campaign-container .campaign-details-right.toggle-right-collapsed {\n          right: -13rem; } }\n    @media screen and (max-width: 48em) {\n      .campaign-base-grid .campaign-container .campaign-member-detail .campaign-member-container {\n        padding-right: 1rem;\n        padding-left: 1rem;\n        padding-top: 0.6rem;\n        padding-bottom: 1rem; } }\n",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-base-grid/1/Vlocity/1512540858750",
                        "%vlocity_namespace%__HTML__c": "<div class=\"campaign-base-grid\">\n    <!--LOADER: -->\n    <div class=\"slds-spinner_container\" ng-show=\"!memberListLoaded\">\n        <div class=\"slds-spinner--brand slds-spinner slds-spinner--medium\" aria-hidden=\"false\" role=\"alert\">\n            <div class=\"slds-spinner__dot-a\"></div>\n            <div class=\"slds-spinner__dot-b\"></div>\n        </div>\n    </div>\n    <div class=\"slds-notify_container\" hide-notification=\"true\" ng-class=\"{'show-notification': $root.notification.active}\">\n        <div class=\"slds-notify slds-notify--alert slds-theme--alert-texture\" role=\"alert\" ng-class=\"{'slds-theme--success': $root.notification.type === 'success', 'slds-theme--error': $root.notification.type === 'error'}\">\n            <button class=\"slds-button slds-button--icon-inverse slds-notify__close\" ng-click=\"$root.notification.active = false\">\n                <slds-button-svg-icon sprite=\"'utility'\" icon=\"'close'\" ></slds-button-svg-icon>\n                <span class=\"slds-assistive-text\">Close</span>\n            </button>\n            <span class=\"slds-assistive-text\">Info</span>\n            <h2 ng-bind-html=\"$root.notification.message\"></h2>\n        </div>\n    </div>\n    <div class=\"slds-grid slds-grid--frame slds-grid--vertical\">\n        <div class=\"slds-col slds-grid slds-wrap slds-small-nowrap campaign-container\" via-screen-height=\"viaScreenHeight\">\n            <div class=\"slds-is-relative slds-col slds-no-flex slds-grid slds-size--1-of-1 slds-small-size--3-of-8 slds-medium-size--3-of-8 slds-large-size--3-of-12 slds-grid--vertical campaign-member-list-container {{$root.rightColumn.toggleRightClass}}\" ng-class=\"{'slds-hide slds-large-show': importedScope.isConfigAttrsPanelEnabled}\">\n                <div class=\"campaign-member-container\">\n                    <vloc-layout layout-name=\"campaign-member-list\" ctrl=\"CampaignCallListController\" is-loaded=\"memberListLoaded\"></vloc-layout>\n                </div>\n            </div>\n            <div class=\"slds-is-relative slds-col slds-no-flex slds-grid slds-size--1-of-1 slds-small-size--5-of-8 slds-medium-size--5-of-8 slds-large-size--{{$root.rightColumn.largeBPWidth}}-of-12 slds-grid--vertical campaign-member-detail {{$root.rightColumn.toggleRightClass}}\">\n                <div class=\"campaign-member-container slds-p-horizontal--large slds-p-vertical--medium\">\n                    <vloc-layout layout-name=\"campaign-member-detail\" ctrl=\"CampaignMemberController\"></vloc-layout>\n                    <div ng-if=\"$root.campaignMember.Id.value\">\n                        <vloc-layout layout-name=\"campaign-member-log-actions\" ctrl=\"CampaignMemberController\"></vloc-layout>\n                        <vloc-layout layout-name=\"campaign-member-stories\" ctrl=\"CampaignMemberStoriesController\"></vloc-layout>\n                    </div>\n                </div>\n            </div>\n            <vloc-layout class=\"slds-is-relative slds-col slds-no-flex slds-grid slds-size--1-of-1 slds-small-size--3-of-8 slds-medium-size--2-of-8 slds-large-size--3-of-12 slds-grid--vertical campaign-details-right {{$root.rightColumn.toggleRightClass}}\" layout-name=\"campaign-detail\" ctrl=\"CampaignDetailsController\"></vloc-layout>\n        </div>\n    </div>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Sass__c": "/*** MIXINS ***/\n@import \"campaign-variables\";\n@import \"campaign-mixins\";\n\n.via-slds .slds-modal__container {\n    justify-content: normal;\n}\n\n.card-header {\n    display: none !important;\n}\n\n/*** STYLES ***/\n.campaign-base-grid {\n    background-color: white;\n    \n    .campaign-container {\n        height: 100%;\n        width: 100%;\n        transition: width 500ms ease-in;\n        \n        .slds-col {\n            overflow-y: auto;\n            height: 100%;\n        }\n        \n        .campaign-member-container {\n            width: 100%;\n            height: 100%;\n        }\n        \n        .campaign-member-list-container {\n            border-right: 1px solid $cards-border-gray;\n            background-color: $cards-gray;\n        }\n        \n        .campaign-member-detail {\n            transition: all 500ms ease-in;\n            padding-right: 0;\n\n            .right-sidebar-overlay {\n                position: fixed;\n                z-index: 9999;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                background-color: $modal-overlay;\n                opacity: 0;\n                visibility: hidden;\n                transition: visibility 0s linear 0.5s, opacity 0.5s ease-in;\n            }\n            \n            &.toggle-right-collapsed {\n                padding-right: 3rem;\n            }\n            \n            &.toggle-right-expanded {\n                padding-right: 0;\n            }\n            \n            .campaign-member-container {\n                border-right: none;\n            }\n        }\n        \n        .campaign-details-right {\n            border-right: none;\n            transition: right 500ms ease-in;\n            right: 0;\n            \n            &.toggle-right-collapsed {\n                right: 3rem;\n            }\n            \n            &.toggle-right-expanded {\n                right: 0;\n            }\n        }\n\n        @media (min-width: $bp-small) and (max-width: $bp-large) {\n            .campaign-member-detail {\n                &.toggle-right-expanded {\n                    padding-right: 3rem;\n\n                    .right-sidebar-overlay {\n                        opacity: 0.8;\n                        visibility: visible;\n                        transition: visibility 0s linear 0s, opacity 0.5s ease-in;\n                    }\n                }\n                &.toggle-right-collapsed {\n                    .right-sidebar-overlay {\n                        opacity: 0;\n                        visibility: hidden;\n                        transition: visibility 0s linear 0.5s, opacity 0.5s ease-in;\n                    }\n                }\n            }\n            .campaign-details-right {\n                position: absolute;\n                z-index: 9999;\n                width: 16rem;\n\n                &.toggle-right-collapsed {\n                    right: -13rem;\n                }\n            }\n        }\n\n        @media screen and (max-width: $bp-medium) {\n            .campaign-member-detail {\n                .campaign-member-container {\n                    padding-right: 1rem;\n                    padding-left: 1rem;\n                    padding-top: 0.6rem;\n                    padding-bottom: 1rem;\n                }\n            }\n        }\n    }\n}",
                        "%vlocity_namespace%__Type__c": "Containers",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-base-grid",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-base-grid/%vlocity_namespace%__VlocityUITemplate__c/campaign-base-grid"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-base-grid",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-base-grid",
            "VlocityDataPackName": "campaign-base-grid",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "All",
                        "%vlocity_namespace%__ExternalID__c": "campaign-column/1/Vlocity/1512540858753",
                        "%vlocity_namespace%__HTML__c": "<div>\n    <vloc-card ng-repeat=\"card in cards |orderBy:order|filter: searchFunc(card)\" ctrl=\"{{ctrl}}\" ng-model=\"card\" data=\"card\" records=\"records\" index=\"{{$index}}\" session-id=\"{{sessionId}}\" campaign-member-id=\"{{importedScope.campaignMemberId}}\"></vloc-card>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Containers",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-column",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-column/%vlocity_namespace%__VlocityUITemplate__c/campaign-column"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-column",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-column",
            "VlocityDataPackName": "campaign-column",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "All",
                        "%vlocity_namespace%__ExternalID__c": "campaign-column-middle/1/Vlocity/1512540858755",
                        "%vlocity_namespace%__HTML__c": "<vloc-card ctrl=\"{{ctrl}}\" ng-model=\"cards[0]\" data=\"cards[0]\" records=\"records\" index=\"{{$index}}\" session-id=\"{{sessionId}}\"></vloc-card>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "Containers",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-column-middle",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-column-middle/%vlocity_namespace%__VlocityUITemplate__c/campaign-column-middle"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-column-middle",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-column-middle",
            "VlocityDataPackName": "campaign-column-middle",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": "/*** MIXINS ***/\n.campaign-details-right {\n  height: 100%; }\n  .campaign-details-right ng-include[src=\"'campaign-column'\"] {\n    height: 100%;\n    display: block; }\n    .campaign-details-right ng-include[src=\"'campaign-column'\"] > div {\n      height: 100%; }\n      .campaign-details-right ng-include[src=\"'campaign-column'\"] > div > div {\n        height: 100%; }\n  .campaign-details-right ng-include[src=\"'campaign-detail'\"] {\n    height: 100%;\n    display: block; }\n\n.campaign-detail {\n  transition: padding 500ms ease-in;\n  position: relative;\n  height: 100%;\n  background-color: #f4f6f9;\n  padding: 3.75rem 1rem;\n  border-left: 1px solid #d8dde6;\n  z-index: 1000; }\n  .campaign-detail:before, .campaign-detail:after {\n    content: \" \";\n    display: table; }\n  .campaign-detail:after {\n    clear: both; }\n  .campaign-detail .content-box {\n    background-color: white; }\n    .campaign-detail .content-box:hover {\n      cursor: pointer; }\n  .campaign-detail .campaign-progress .campaign-progress-bar {\n    width: 100%;\n    height: 1rem;\n    position: relative; }\n    .campaign-detail .campaign-progress .campaign-progress-bar:before, .campaign-detail .campaign-progress .campaign-progress-bar:after {\n      content: \" \";\n      display: table; }\n    .campaign-detail .campaign-progress .campaign-progress-bar:after {\n      clear: both; }\n    .campaign-detail .campaign-progress .campaign-progress-bar .campaign-member-status {\n      background-color: #4A90E2;\n      display: inline-block;\n      float: left;\n      height: 100%; }\n      .campaign-detail .campaign-progress .campaign-progress-bar .campaign-member-status.campaign-member-status-0 {\n        background-color: #00396B; }\n      .campaign-detail .campaign-progress .campaign-progress-bar .campaign-member-status.campaign-member-status-1 {\n        background-color: #005FB2; }\n      .campaign-detail .campaign-progress .campaign-progress-bar .campaign-member-status.campaign-member-status-2 {\n        background-color: #0070D2; }\n      .campaign-detail .campaign-progress .campaign-progress-bar .campaign-member-status.campaign-member-status-3 {\n        background-color: #0C8EFF; }\n      .campaign-detail .campaign-progress .campaign-progress-bar .campaign-member-status + .slds-popover--tooltip {\n        width: 6rem;\n        text-align: center;\n        position: absolute;\n        top: -2.8rem !important; }\n        .campaign-detail .campaign-progress .campaign-progress-bar .campaign-member-status + .slds-popover--tooltip .slds-popover__body {\n          line-height: 1rem; }\n  .campaign-detail .campaign-detail-header {\n    height: 3rem;\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    background-color: #EEF1F6;\n    border-bottom: 1px solid #d8dde6; }\n    .campaign-detail .campaign-detail-header .slds-icon_container.column-header-icon {\n      position: absolute;\n      left: 0.5rem;\n      top: 50%;\n      transform: translateY(-50%);\n      z-index: 2;\n      cursor: pointer; }\n    .campaign-detail .campaign-detail-header .slds-text-heading--small {\n      line-height: 3rem;\n      padding-left: 3.1rem; }\n  .campaign-detail .toggle-panel {\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    width: 100%;\n    height: 3rem;\n    background-color: #EEF1F6;\n    border-top: 1px solid #d8dde6; }\n    .campaign-detail .toggle-panel .slds-icon_container {\n      position: absolute;\n      top: 50%;\n      transform: translateY(-50%);\n      left: 0.75rem;\n      z-index: 2;\n      cursor: pointer; }\n      .campaign-detail .toggle-panel .slds-icon_container .slds-icon {\n        fill: #4F6A92; }\n  .campaign-detail.toggle-right-collapsed {\n    padding-left: 3rem; }\n  @media screen and (max-width: 30em) {\n    .campaign-detail.toggle-right-collapsed {\n      padding: 1.5rem 1rem; }\n    .campaign-detail .campaign-detail-header, .campaign-detail .toggle-panel {\n      display: none; } }\n",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-detail/1/Vlocity/1512540858768",
                        "%vlocity_namespace%__HTML__c": "<div class=\"campaign-detail {{$root.rightColumn.toggleRightClass}}\" ng-init=\"importedScope.setObj(obj, params.id)\">\n    <div class=\"campaign-detail-header\">\n        <div class=\"slds-icon_container slds-icon-standard-campaign column-header-icon\" title=\"Campaign Details\" ng-click=\"importedScope.responsiveHelper.toggleCollapseRightCol()\">\n            <slds-svg-icon sprite=\"'standard'\" icon=\"'campaign'\" ></slds-svg-icon>\n            <span class=\"slds-assistive-text\">Campaign Details</span>\n        </div>\n        <span class=\"slds-text-heading--small\">Campaign Details</span>\n    </div>\n    <div class=\"campaign-detail-content\">\n        <div class=\"campaign-progress slds-m-bottom--medium\" ng-if=\"$root.membersAggInfoByCampaign\">\n            <div class=\"slds-text-heading--label\">Campaign Progress</div>\n            <div class=\"campaign-progress-bar slds-m-top--x-small\">\n                <span class=\"campaign-member-status campaign-member-status-{{status.label.toLowerCase()}} campaign-member-status-{{$index}}\" ng-repeat=\"status in $root.membersAggInfoByCampaign\" ng-style=\"importedScope.campaignAggInfo.getStatusProgessStyle(status)\" bs-tooltip=\"status.label\" ng-init=\"importedScope.campaignAggInfo.campaignAggInfogetStatusProgressPlacement($index)\"></span>\n            </div>\n        </div>\n        <div class=\"slds-form-element slds-m-bottom--medium\" ng-repeat=\"field in data.fields | limitTo:(data.actions.length  > 0 ? 11 : 12)\" ng-if=\"field.label.indexOf('footer') === -1 && field.label.indexOf('Owner') === -1\">\n            <label class=\"slds-text-heading--label\" ng-if=\"(obj | getter: field | picker: field.type) && (field.name.indexOf('EmailTemplate') === -1)\">{{field.label}}</label>\n            <div class=\"slds-text-body--regular\" ng-if=\"field.name.indexOf('EmailTemplate') === -1\">\n            {{obj | getter: field | picker: field.type}}</div>\n            <div ng-if=\"field.name.indexOf('EmailTemplate') > -1\">\n                <label class=\"slds-text-heading--label\">{{field.label}}</label>\n                <div class=\"slds-form-element__control\">\n                    <div class=\"slds-select_container\">\n                      <select id=\"select-email-template\" class=\"slds-select\" ng-model=\"importedScope.selectedTemplate\" ng-options=\"template as template.Name for template in importedScope.emailTemplates track by template.DeveloperName\" ng-change=\"importedScope.saveSelectedTemplate()\" ng-disabled=\"!importedScope.isCampaignOwner\">\n                      </select>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <label ng-if=\"importedScope.attachments.length > 0\" class=\"slds-text-heading--label\">Content</label>\n        <div class=\"slds-form-element slds-m-bottom--small slds-box slds-theme--shade slds-box--x-small content-box\" ng-repeat=\"attachment in importedScope.attachments\" ng-click=\"importedScope.navigateTo(attachment.Id)\">\n           <div class=\"slds-tile slds-media\">\n              <div class=\"slds-media__figure\">\n                <slds-svg-icon sprite=\"'doctype'\" icon=\"attachment.icon\" size=\"'small'\" ></slds-svg-icon>\n              </div>\n              <div class=\"slds-media__body slds-m-top--xx-small\">\n                <h3 class=\"slds-truncate\" title=\"attachment\">{{attachment.Name}}</h3>\n              </div>\n            </div>\n        </div>\n        <div class=\"slds-form-element slds-m-bottom--medium\">\n            <div class=\"slds-text-align--center\" ng-repeat=\"field in data.fields | limitTo:(data.actions.length  > 0 ? 11 : 12)\" ng-if=\"field.label.indexOf('footer') > -1\">\n                <span ng-if=\"field.name.indexOf('CreatedDate') > -1\" class=\"slds-text-heading--label-normal\">\n                 Created On {{obj | getter: field | picker: field.type}}\n                </span>\n                <span ng-if=\"field.name.indexOf('CreatedBy') > -1\" class=\"slds-text-heading--label-normal\">\n                    Created By {{obj | getter: field | picker: field.type}}\n                </span>\n                <span ng-if=\"field.name.indexOf('LastModified') > -1\" class=\" slds-text-heading--label-normal\">\n                    Last Modified On {{obj | getter: field | picker: field.type}}\n                </span>\n            </div>\n        </div>\n    </div>\n    <div class=\"toggle-panel\" ng-click=\"importedScope.responsiveHelper.toggleCollapseRightCol()\">\n        <div class=\"slds-icon_container\" title=\"Toggle Right Column\">\n          <slds-svg-icon sprite=\"'utility'\" icon=\"$root.rightColumn.toggleIcon\" size=\"'small'\" ></slds-svg-icon>\n          <span class=\"slds-assistive-text\">Toggle Right Column</span>\n        </div>\n    </div>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__SampleJson__c": "{\"data\":{\"actions\":[{\"displayName\":\"Like Action\",\"vlocityIcon\":\"icon-v-heart\"}],\"fields\":[{\"label\":\"Description\",\"name\":\"description\"},{\"label\":\"Cost\",\"name\":\"cost\",\"type\":\"currency\"}],\"title\":\"Card Title\"},\"obj\":{\"Id\":\"123456\",\"LastModifiedDate\":\"2016-07-14T21:53:46.139Z\",\"Name\":\"Object Name\",\"cost\":150,\"description\":\"Some description\"}}",
                        "%vlocity_namespace%__Sass__c": "@import \"campaign-variables\";\n@import \"campaign-mixins\";\n\n.campaign-details-right {\n    height: 100%;\n    \n    ng-include[src=\"'campaign-column'\"] {\n        height: 100%;\n        display: block;\n        \n        > div {\n            height: 100%;\n            \n            > div {\n                height: 100%;\n            }\n        }\n    }\n\n    ng-include[src=\"'campaign-detail'\"] {\n        height: 100%;\n        display: block;\n    }\n}\n\n.campaign-detail {\n    @include clearfix;\n    transition: padding 500ms ease-in;\n    position: relative;\n    height: 100%;\n    background-color: $cards-gray;\n    padding: 3.75rem 1rem;\n    border-left: 1px solid $cards-border-gray;\n    z-index: 1000;\n\n    .content-box{\n        background-color: white;\n        &:hover{\n            cursor:pointer;\n        }\n    }\n\n    .campaign-progress {\n        .campaign-progress-bar {\n            @include clearfix;\n            width: 100%;\n            height: 1rem;\n            position: relative;\n\n            .campaign-member-status {\n                background-color: $primary-alternative;\n                display: inline-block;\n                float: left;\n                height: 100%;\n\n                &.campaign-member-status-0 {\n                    background-color: $primary-dark;\n                }\n                &.campaign-member-status-1 {\n                    background-color: $primary-medium;\n                }\n                &.campaign-member-status-2 {\n                    background-color: $primary-light;\n                }\n                &.campaign-member-status-3 {\n                    background-color: $primary-lightest;\n                }\n\n                + .slds-popover--tooltip {\n                    width: 6rem;\n                    text-align: center;\n                    position: absolute;\n                    top: -2.8rem !important;\n\n                    .slds-popover__body {\n                        line-height: 1rem;\n                    }\n                }\n            }\n        }\n    }\n    \n    @include columnHeader('campaign-detail-header');\n    \n    .toggle-panel {\n        position: absolute;\n        bottom: 0;\n        left: 0;\n        width: 100%;\n        height: 3rem;\n        background-color: $neutral-lightest;\n        border-top: 1px solid $cards-border-gray;\n        \n        .slds-icon_container {\n            position: absolute;\n            top: 50%;\n            transform: translateY(-50%);\n            left: 0.75rem;\n            z-index: 2;\n            cursor: pointer;\n            \n            .slds-icon {\n                fill: $neutral-dark;\n            }\n        }\n    }\n    \n    &.toggle-right-collapsed {\n        padding-left: 3rem;\n    }\n\n    @media screen and (max-width: $bp-small) {\n        &.toggle-right-collapsed {\n            padding: 1.5rem 1rem;\n        }\n\n        .campaign-detail-header, .toggle-panel {\n            display: none;\n        }\n    }\n}",
                        "%vlocity_namespace%__Type__c": "Cards",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-detail",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-detail/%vlocity_namespace%__VlocityUITemplate__c/campaign-detail"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-detail",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-detail",
            "VlocityDataPackName": "campaign-detail",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": "/*** MIXINS ***/\n.campaign-member-detail-top .member-information {\n  width: 100%;\n  padding: 0 0 0.5rem 0;\n  min-height: 5.95rem; }\n  .campaign-member-detail-top .member-information:before, .campaign-member-detail-top .member-information:after {\n    content: \" \";\n    display: table; }\n  .campaign-member-detail-top .member-information:after {\n    clear: both; }\n  .campaign-member-detail-top .member-information .left {\n    width: calc(100% - 10rem);\n    flex: none; }\n    .campaign-member-detail-top .member-information .left h2 {\n      font-size: 1.35rem;\n      line-height: 1.4em;\n      color: #00396B; }\n      .campaign-member-detail-top .member-information .left h2 a {\n        font-family: \"Salesforce Sans\", Arial, sans-serif; }\n    .campaign-member-detail-top .member-information .left .line {\n      display: block;\n      line-height: 1.2em;\n      color: #4F6A92;\n      position: relative; }\n      .campaign-member-detail-top .member-information .left .line.title-employer {\n        font-size: 1rem; }\n      .campaign-member-detail-top .member-information .left .line.phone-email {\n        font-size: 0.75rem; }\n        .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info-container {\n          display: inline-block;\n          position: relative;\n          z-index: 30; }\n          .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info-container:before, .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info-container:after {\n            bottom: -1.2rem;\n            display: block;\n            background-color: #fff;\n            z-index: 1;\n            left: 50%;\n            opacity: 0;\n            visibility: hidden;\n            transition: all 100ms ease-in; }\n          .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info-container:before {\n            width: 1rem;\n            height: 1rem;\n            position: absolute;\n            transform: rotate(45deg) translateX(-50%);\n            content: ''; }\n          .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info-container:after {\n            box-shadow: -1px -1px 0 0 rgba(0, 0, 0, 0.16);\n            z-index: 1;\n            width: 1rem;\n            height: 1rem;\n            position: absolute;\n            transform: rotate(45deg) translateX(-50%);\n            content: ''; }\n          .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info-container.via-show-nubbin:before, .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info-container.via-show-nubbin:after {\n            opacity: 1;\n            visibility: visible; }\n        .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info {\n          position: absolute;\n          width: calc(100% + 10.75rem);\n          min-height: 5rem;\n          top: 2.25rem;\n          z-index: 25;\n          opacity: 0;\n          visibility: hidden;\n          transition: all 100ms ease-in; }\n          .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info.via-show-info {\n            opacity: 1;\n            visibility: visible; }\n          .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info .slds-popover.more-info {\n            width: 100%; }\n            .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info .slds-popover.more-info .slds-popover__body {\n              padding: 1rem 1.25rem; }\n          .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info .slds-col.no-overflow {\n            overflow-y: hidden; }\n  .campaign-member-detail-top .member-information .right {\n    position: relative;\n    width: 10rem; }\n    .campaign-member-detail-top .member-information .right .member-status-select {\n      width: 100%; }\n      .campaign-member-detail-top .member-information .right .member-status-select .slds-button, .campaign-member-detail-top .member-information .right .member-status-select .slds-dropdown {\n        text-align: left;\n        width: 100%; }\n      .campaign-member-detail-top .member-information .right .member-status-select .slds-dropdown {\n        width: auto; }\n\n.campaign-member-detail-top .member-actions {\n  padding: 0; }\n  .campaign-member-detail-top .member-actions:before, .campaign-member-detail-top .member-actions:after {\n    content: \" \";\n    display: table; }\n  .campaign-member-detail-top .member-actions:after {\n    clear: both; }\n  .campaign-member-detail-top .member-actions .target-call-date-wrapper {\n    float: left; }\n    .campaign-member-detail-top .member-actions .target-call-date-wrapper .slds-text-heading--label {\n      line-height: 1.3em; }\n    .campaign-member-detail-top .member-actions .target-call-date-wrapper .target-call-date {\n      color: #4A90E2;\n      font-size: 0.75rem;\n      border: none;\n      outline: none;\n      cursor: pointer;\n      font-family: \"Salesforce Sans\", Arial, sans-serif;\n      width: auto;\n      height: auto;\n      min-height: 1.25rem;\n      line-height: 1.4;\n      padding: 0;\n      background-color: transparent; }\n  .campaign-member-detail-top .member-actions .member-action {\n    margin-right: 0.5rem;\n    background-color: #50E3C2;\n    border-color: #50E3C2;\n    user-select: none;\n    padding-left: 0.75rem;\n    padding-right: 0.75rem; }\n    .campaign-member-detail-top .member-actions .member-action:hover, .campaign-member-detail-top .member-actions .member-action:active, .campaign-member-detail-top .member-actions .member-action:focus {\n      background-color: #24dcb3; }\n    .campaign-member-detail-top .member-actions .member-action .slds-button__icon {\n      width: 1.3rem;\n      height: 1.3rem;\n      position: relative;\n      top: -2px; }\n    .campaign-member-detail-top .member-actions .member-action.delete-action {\n      float: right;\n      margin-right: 0;\n      background-color: #c23934;\n      border-color: #c23934; }\n      .campaign-member-detail-top .member-actions .member-action.delete-action:hover, .campaign-member-detail-top .member-actions .member-action.delete-action:active, .campaign-member-detail-top .member-actions .member-action.delete-action:focus {\n        background-color: #9a2d29; }\n      .campaign-member-detail-top .member-actions .member-action.delete-action .slds-button__icon {\n        margin: 0; }\n\n@media screen and (max-width: 70em) {\n  .campaign-member-detail-top .member-information {\n    position: relative;\n    margin-bottom: 3.75rem;\n    padding: 0;\n    min-height: 0; }\n    .campaign-member-detail-top .member-information .left {\n      width: 100%;\n      padding-right: 0; }\n      .campaign-member-detail-top .member-information .left .line.title-employer {\n        margin-top: 0;\n        margin-bottom: 0; }\n      .campaign-member-detail-top .member-information .left .line.phone-email .member-more-info {\n        width: 100%; }\n    .campaign-member-detail-top .member-information .right {\n      position: absolute;\n      top: auto;\n      bottom: -3rem;\n      right: 0;\n      width: auto; }\n      .campaign-member-detail-top .member-information .right .member-status-select {\n        min-width: 7rem; }\n  .campaign-member-detail-top .member-actions {\n    position: relative;\n    padding-top: 0.5rem; }\n    .campaign-member-detail-top .member-actions .target-call-date-wrapper {\n      position: absolute;\n      top: -2.85rem;\n      left: 0;\n      margin-right: 1rem; } }\n\n@media screen and (max-width: 64em) {\n  .campaign-member-detail-top .member-information .left .line.phone-email {\n    display: none; } }\n\n@media screen and (max-width: 44em) {\n  .campaign-member-detail-top .member-actions {\n    margin-bottom: 0.5rem;\n    display: flex;\n    flex-direction: row;\n    justify-content: center; }\n    .campaign-member-detail-top .member-actions .member-action {\n      height: 1.5rem;\n      width: 3rem;\n      text-align: center;\n      padding: 0;\n      background-color: transparent;\n      border: none;\n      border-radius: 0;\n      border-right: 1px solid #d8dde6;\n      flex: 1 1 auto;\n      padding: 0 0.5rem;\n      margin: 0; }\n      .campaign-member-detail-top .member-actions .member-action .slds-button__icon {\n        transition: fill 50ms ease-in; }\n      .campaign-member-detail-top .member-actions .member-action.delete-action {\n        background-color: transparent;\n        border: none;\n        float: none; }\n        .campaign-member-detail-top .member-actions .member-action.delete-action:hover, .campaign-member-detail-top .member-actions .member-action.delete-action:active, .campaign-member-detail-top .member-actions .member-action.delete-action:focus {\n          background-color: transparent; }\n      .campaign-member-detail-top .member-actions .member-action:hover, .campaign-member-detail-top .member-actions .member-action:active, .campaign-member-detail-top .member-actions .member-action:focus {\n        background-color: transparent; }\n      .campaign-member-detail-top .member-actions .member-action:active .slds-button__icon {\n        fill: #4F6A92; }\n      .campaign-member-detail-top .member-actions .member-action:first-of-type {\n        padding-left: 0; }\n      .campaign-member-detail-top .member-actions .member-action:last-child {\n        border-right: none;\n        padding-right: 0; }\n      .campaign-member-detail-top .member-actions .member-action .slds-button__icon--left {\n        width: 1.5rem;\n        height: 1.5rem;\n        position: absolute;\n        top: 50%;\n        margin-right: 0;\n        transform: translateY(-50%) translateX(-50%);\n        left: 50%;\n        fill: #9faab5; }\n      .campaign-member-detail-top .member-actions .member-action .action-label {\n        display: none; } }\n\n@media screen and (max-width: 30em) {\n  .campaign-member-detail-top .member-actions .target-call-date-wrapper .target-call-date {\n    width: 100%;\n    line-height: 1.6; } }\n\n.platform-ios .campaign-member-detail-top .member-actions .target-call-date-wrapper .target-call-date:before, .platform-android .campaign-member-detail-top .member-actions .target-call-date-wrapper .target-call-date:before {\n  content: attr(placeholder); }\n\n.platform-ios .campaign-member-detail-top .member-actions .target-call-date-wrapper .target-call-date.date-picked:before, .platform-android .campaign-member-detail-top .member-actions .target-call-date-wrapper .target-call-date.date-picked:before {\n  content: ''; }\n",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-member-detail/1/Vlocity/1512540858771",
                        "%vlocity_namespace%__HTML__c": "<div class=\"right-sidebar-overlay\" ng-click=\"importedScope.responsiveHelper.toggleCollapseRightCol()\"></div>\n<div class=\"slds-grid slds-grid--vertical campaign-member-detail-top\" ng-init=\"importedScope.setObj(obj); showMoreInfo = false\" ng-class=\"{'slds-p-horizontal--small slds-p-top--small': importedScope.isMobile}\">\n    <!-- <pre>{{importedScope.campaignMember | json}}</pre> -->\n    <div class=\"slds-spinner_container\" ng-show=\"!importedScope.isLoaded\">\n        <div class=\"slds-spinner--brand slds-spinner slds-spinner--medium\" aria-hidden=\"false\" role=\"alert\">\n            <div class=\"slds-spinner__dot-a\"></div>\n            <div class=\"slds-spinner__dot-b\"></div>\n        </div>\n    </div>\n    <div class=\"member-information\">\n        <span class=\"slds-grid\">\n            <div class=\"left slds-col--padded slds-p-left--none\">\n                <h2 class=\"slds-m-bottom--xx-small\">\n                    <a ng-if=\"!importedScope.isMobile\" ng-click=\"importedScope.navigateTo(importedScope.campaignMember)\">{{importedScope.campaignMember.Name.value}}</a>\n                    <a ng-if=\"importedScope.isMobile\" href=\"#/app/{{importedScope.campaignMember.objectTypeRoute}}/{{importedScope.campaignMember[importedScope.campaignMember.objectType].value}}\">{{importedScope.campaignMember.Name.value}}</a>\n                </h2>\n                <span class=\"line title-employer slds-m-bottom--xx-small\">{{importedScope.campaignMember.Title.value}}<span ng-if=\"importedScope.campaignMember.Title.value\">,</span> {{importedScope.campaignMember.Company.value}}</span>\n                <div class=\"line phone-email slds-m-bottom--xx-small\">\n                    {{importedScope.campaignMember.Phone.value}}\n                    <span ng-if=\"importedScope.campaignMember.Phone.value\"> |</span> \n                    {{importedScope.campaignMember.Email.value}} \n                    <span ng-if=\"(importedScope.campaignMember.Phone.value || importedScope.campaignMember.Email.value) && data.fields.length > 0\"> | </span>\n                    <div class=\"member-more-info-container\" ng-class=\"{'via-show-nubbin': showMoreInfo}\" ng-show=\"importedScope.campaignMember && data.fields.length > 0\">\n                        <button class=\"slds-button slds-button--link\" ng-click=\"showMoreInfo === true ? showMoreInfo = false : showMoreInfo = true\" style=\"box-shadow:none\">\n                            <slds-button-svg-icon ng-if=\"!showMoreInfo\" sprite=\"'utility'\" icon=\"'info'\" extra-classes=\"'slds-m-bottom--xxx-small'\"></slds-button-svg-icon>\n                            <slds-button-svg-icon ng-if=\"showMoreInfo\" sprite=\"'utility'\" icon=\"'close'\" extra-classes=\"'slds-m-bottom--xxx-small'\"></slds-button-svg-icon>\n                            <span class=\"slds-p-left--xx-small\">More Info</span>\n                        </button>\n                    </div>\n                    <div class=\"member-more-info slds-p-bottom--small\" ng-class=\"{'via-show-info': showMoreInfo}\">\n                        <div class=\"slds-popover more-info\" role=\"dialog\">\n                            <div class=\"slds-popover__body  slds-grid \">\n                                 <div class=\"slds-col no-overflow\" ng-repeat=\"field in data.fields | limitTo:(data.actions.length  > 0 ? 11 : 12)\" ng-if=\"importedScope.campaignMember[field.name].value !== null && importedScope.campaignMember[field.name].value !== ''\">\n                                    <label class=\"slds-text-heading--label slds-m-top--none\">{{field.label}}</label>\n                                    <div class=\"slds-text-body--regular\">\n                                    {{importedScope.campaignMember[field.name].value}}</div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"right slds-col--padded slds-p-right--none\">\n                <div class=\"slds-dropdown-trigger slds-dropdown-trigger--click slds-is-open member-status-select\" aria-expanded=\"true\" ng-if=\"importedScope.campaignMember.CampaignId && importedScope.$parent.$root.memberStatus.result.records.length\">\n                    <button class=\"slds-button via-status-select-button slds-button--neutral slds-truncate\" ng-click=\"importedScope.toggleStatusDropdown()\">\n                        <slds-button-svg-icon size=\"type === 'button-group' ? null : 'small'\" sprite=\"'utility'\" icon=\"'down'\" extra-classes=\"'slds-button__icon--left'\"></slds-button-svg-icon>\n                        <span>{{importedScope.campaignMember.Status.value}}</span>\n                    </button>\n                    <div class=\"slds-dropdown slds-dropdown--right\" ng-if=\"importedScope.statusOpen\">\n                        <ul class=\"dropdown__list\" role=\"menu\">\n                            <li class=\"slds-dropdown__item\" ng-repeat=\"record in importedScope.$parent.$root.memberStatus.result.records | filter: importedScope.statusFilter\">\n                                <a role=\"menuitem\" ng-href=\"#\" ng-click=\"importedScope.updateMemberStatus(importedScope.campaignMember.Id.value, record.Label.value, isOpen)\" title=\"{{record.Label.value}}\">\n                                    <p class=\"slds-truncate\">{{record.Label.value}}</p>\n                                </a>\n                            </li>\n                            <li class=\"slds-dropdown__item slds-has-divider--top-space\">\n                                <a role=\"menuitem\" title=\"Call Attempted\" ng-click=\"importedScope.logAttemptedCall()\">\n                                    <p class=\"slds-truncate\">Call Attempted</p>\n                                </a>\n                            </li>\n                            <li class=\"slds-dropdown__item\" ng-class=\"{'slds-has-divider--top-space': $index === 0}\" ng-repeat=\"callBack in importedScope.callBacks\">\n                                <a role=\"menuitem\" title=\"{{callBack.label}}\" ng-click=\"importedScope.changeCallDate(callBack.action, null, callBack.label)\">\n                                    <p class=\"slds-truncate\">{{callBack.label}}</p>\n                                </a>\n                            </li>\n                            <li class=\"slds-dropdown__item slds-has-divider--top-space\">\n                                <a role=\"menuitem\" title=\"Remove From List\" ng-click=\"importedScope.openDeleteWarning()\">\n                                    <p class=\"slds-truncate\">Remove From List</p>\n                                </a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </span>\n    </div>\n    <div class=\"member-actions\">\n        <div class=\"target-call-date-wrapper slds-m-right--medium\">\n            <div class=\"slds-text-heading--label\">Target Call Date</div>\n            <input ng-if=\"!importedScope.isMobile\" class=\"slds-input target-call-date\" ng-model=\"importedScope.campaignMember.datePickerDate\" type=\"text\" bs-datepicker=\"true\"  ng-change=\"importedScope.changeCallDate(null, importedScope.campaignMember.datePickerDate)\" data-date-type=\"date\" placeholder=\"Pick Call Date\"/>\n            <input ng-if=\"importedScope.isMobile\" class=\"slds-input target-call-date via-mobile-datetime\" ng-model=\"importedScope.campaignMember.datePickerDate\" type=\"date\" ng-blur=\"importedScope.changeCallDate(null, importedScope.campaignMember.datePickerDate)\" placeholder=\"Pick Call Date\" ng-class=\"{'date-picked': importedScope.campaignMember.datePickerDate}\" />\n        </div>\n        <button class=\"slds-button slds-button--brand {{action.class}} member-action\" ng-repeat=\"action in importedScope.campaignMember.memberMobileActions\" ng-click=\"importedScope.invokeMemberMobileActions(action)\" ng-if=\"importedScope.isMobile\">\n            <slds-button-svg-icon sprite=\"'utility'\" icon=\"action.icon\" extra-classes=\"'slds-button__icon--left'\"></slds-button-svg-icon>\n            <span class=\"action-label\">{{action.label}}</span>\n        </button>\n        <button class=\"slds-button slds-button--brand {{action.class}} member-action\" ng-repeat=\"action in importedScope.campaignMember.memberActions\" ng-click=\"importedScope.invokeMemberActions(action)\">\n            <slds-button-svg-icon sprite=\"'utility'\" icon=\"action.icon\" extra-classes=\"'slds-button__icon--left'\"></slds-button-svg-icon>\n            <span class=\"action-label\">{{action.label}}</span>\n        </button>\n    </div>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Sass__c": "@import 'campaign-variables';\n@import 'campaign-mixins';\n$right-col-width: 10rem;\n$right-col-padding: 0.75rem;\n$right-col-total: $right-col-width + $right-col-padding;\n\n\n.campaign-member-detail-top {\n    .member-information {\n        @include clearfix;\n        width: 100%;\n        padding: 0 0 0.5rem 0;\n        min-height: 5.95rem;\n        \n        .left {\n            width: calc(100% - #{$right-col-width});\n            flex: none;\n\n            h2 {\n                font-size: 1.35rem;\n                line-height: 1.4em;\n                color: $primary-dark;\n\n                a {\n                    font-family: $slds-font;\n                }\n            }\n            .line  {\n                display: block;\n                line-height: 1.2em;\n                color: $neutral-dark;\n                position: relative;\n                \n                &.title-employer {\n                    font-size: 1rem;\n                }\n                \n                &.phone-email {\n                    font-size: 0.75rem;\n\n                    .member-more-info-container {\n                        display: inline-block;\n                        position: relative;\n                        z-index: 30;\n                            &:before, &:after {\n                                bottom: -1.2rem;\n                                display: block;\n                                background-color: #fff;\n                                z-index: 1;\n                                left: 50%;\n                                opacity: 0;\n                                visibility: hidden;\n                                transition: all 100ms ease-in;\n                            }\n\n                            &:before {\n                                width: 1rem;\n                                height: 1rem;\n                                position: absolute;\n                                transform: rotate(45deg) translateX(-50%);\n                                content: '';\n                            }\n\n                            &:after {\n                                box-shadow: -1px -1px 0 0 rgba(0,0,0,0.16);\n                                z-index: 1;\n                                width: 1rem;\n                                height: 1rem;\n                                position: absolute;\n                                transform: rotate(45deg) translateX(-50%);\n                                content: '';\n                            }\n\n                        &.via-show-nubbin {\n                            &:before, &:after {\n                                opacity: 1; \n                                visibility: visible;\n                            }\n                        }\n                    }\n                    \n                    .member-more-info {\n                        position: absolute;\n                        width: calc(100% + #{$right-col-total});\n                        min-height: 5rem;\n                        top: 2.25rem;\n                        z-index: 25;\n                        opacity: 0; \n                        visibility: hidden;\n                        transition: all 100ms ease-in;\n\n                        &.via-show-info {\n                            opacity: 1; \n                            visibility: visible;\n                        }\n\n                        .slds-popover.more-info {\n                            width: 100%;\n\n                            .slds-popover__body {\n                                padding: 1rem 1.25rem;\n                            }\n                        }\n\n                        \n                        .slds-col{\n                            &.no-overflow {\n                                overflow-y: hidden;\n                            }\n                        }\n                    }\n                }\n            }\n        }\n        \n        .right {\n            position: relative;\n            width: $right-col-width;\n            \n            .member-status-select {\n                width: 100%;\n\n                .slds-button, .slds-dropdown {\n                    text-align: left;\n                    width: 100%;\n                }\n                .slds-dropdown {\n                    width: auto;\n                }\n            }\n        }\n    }\n    \n    .member-actions {\n        @include clearfix;\n        padding: 0;\n        \n        .target-call-date-wrapper {\n            float: left;\n            \n            .slds-text-heading--label {\n                line-height: 1.3em;\n            }\n            .target-call-date {\n                color: $primary-alternative;\n                font-size: 0.75rem;\n                border: none;\n                outline: none;\n                cursor: pointer;\n                font-family: $slds-font;\n                width: auto;\n                height: auto;\n                min-height: 1.25rem;\n                line-height: 1.4;\n                padding: 0;\n                background-color: transparent;\n            }   \n        }\n        \n        .member-action {\n            margin-right: 0.5rem;\n            background-color: $secondary-aqua;\n            border-color: $secondary-aqua;\n            user-select: none;\n            padding-left: 0.75rem;\n            padding-right: 0.75rem;\n            \n            &:hover, &:active, &:focus {\n                background-color: darken($secondary-aqua, 10%);\n            }\n            \n            .slds-button__icon {\n                width: 1.3rem;\n                height: 1.3rem;\n                position: relative;\n                top: -2px;\n            }\n            \n            &.delete-action {\n                float: right;\n                margin-right: 0;\n                background-color: $notify-danger;\n                border-color: $notify-danger;\n                \n                &:hover, &:active, &:focus {\n                    background-color: darken($notify-danger, 10%);\n                }\n                \n                .slds-button__icon {\n                    margin: 0;\n                }\n            }\n        }\n    }\n\n    @media screen and (max-width: 70em) {\n        .member-information {\n            position: relative;\n            margin-bottom: 3.75rem;\n            padding: 0; \n            min-height: 0;\n\n            .left {\n                width: 100%;\n                padding-right: 0;\n\n                .line {\n                    &.title-employer {\n                        margin-top: 0;\n                        margin-bottom: 0;\n                    }\n\n                    &.phone-email {\n                        .member-more-info {\n                            width: 100%;\n                        }\n                    }\n                }\n            }\n\n            .right {\n                position: absolute;\n                top: auto;\n                bottom: -3rem;\n                right: 0;\n                width: auto;\n\n                .member-status-select {\n                    min-width: 7rem;\n                }\n            }\n        }\n        .member-actions {\n            position: relative;\n            padding-top: 0.5rem;\n\n            .target-call-date-wrapper {\n                position: absolute;\n                top: -2.85rem;\n                left: 0;\n                margin-right: 1rem;\n            }\n        }\n    }\n\n    @media screen and (max-width: $bp-large) {\n        .member-information {\n            .left {\n                .line {\n                    &.phone-email {\n                        display: none;\n                    }\n                }\n            }\n        }\n    }\n\n    @media screen and (max-width: $bp-xmedium) {\n        .member-actions {\n            margin-bottom: 0.5rem;\n            display: flex;\n            flex-direction: row;\n            justify-content: center;\n\n            .member-action {\n                height: 1.5rem;\n                width: 3rem;\n                text-align: center;\n                padding: 0;\n                background-color: transparent;\n                border: none;\n                border-radius: 0;\n                border-right: 1px solid $cards-border-gray;\n                flex: 1 1 auto;\n                padding: 0 0.5rem;\n                margin: 0;\n\n                .slds-button__icon {\n                    transition: fill 50ms ease-in;\n                }\n\n                &.delete-action {\n                    background-color: transparent;\n                    border: none;\n                    float: none;\n\n                    &:hover, &:active, &:focus {\n                        background-color: transparent;\n                    }\n                }\n\n                &:hover, &:active, &:focus {\n                    background-color: transparent;\n                }\n\n                &:active {\n                    .slds-button__icon {\n                        fill: $neutral-dark;\n                    }\n                }\n\n                &:first-of-type {\n                    padding-left: 0;\n                }\n\n                &:last-child {\n                    border-right: none;\n                    padding-right: 0;\n                }\n\n                .slds-button__icon--left {\n                    width: 1.5rem;\n                    height: 1.5rem;\n                    position: absolute;\n                    top: 50%;\n                    margin-right: 0;\n                    transform: translateY(-50%) translateX(-50%);\n                    left: 50%;\n                    fill: $mobile-icons-gray;\n                }\n\n                .action-label {\n                    display: none;\n                }\n            }\n        }\n    }\n\n    @media screen and (max-width: $bp-small) {\n        .member-actions {\n            .target-call-date-wrapper {\n                .target-call-date {\n                    width: 100%;\n                    line-height: 1.6;\n                }\n            }\n        }\n    }\n}\n.platform-ios, .platform-android {\n    .campaign-member-detail-top {\n        .member-actions {\n            .target-call-date-wrapper {\n                .target-call-date {\n                    &:before {\n                        content: attr(placeholder);\n                    }\n\n                    &.date-picked {\n                        &:before {\n                            content: '';\n                        }\n                    }\n                }\n            }\n        }\n    }\n}",
                        "%vlocity_namespace%__Type__c": "campaign-member-detail",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-detail",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-member-detail/%vlocity_namespace%__VlocityUITemplate__c/campaign-member-detail"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-member-detail",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-member-detail",
            "VlocityDataPackName": "campaign-member-detail",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-member-detail-blank/1/Vlocity/1512540858773",
                        "%vlocity_namespace%__HTML__c": "<div class=\"slds-grid slds-grid--vertical campaign-member-detail\">\n    <div class=\"slds-page-header__title slds-truncate slds-align-middle slds-p-top--small\">\n           Campaign Member Detail\n    </div>\n    <div class=\"slds-truncate slds-align-middle\">\n        Please click on a Campaign Member in the list to the left.\n    </div>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "campaign-member-detail",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-detail-blank",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-member-detail-blank/%vlocity_namespace%__VlocityUITemplate__c/campaign-member-detail-blank"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-member-detail-blank",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-member-detail-blank",
            "VlocityDataPackName": "campaign-member-detail-blank",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": ".slds-col.filter-container {\n  border-right: 1px solid #d8dde6;\n  min-height: 34rem;\n  width: 11rem;\n  max-width: 11rem; }\n\n.slds-col .max-range {\n  position: relative;\n  top: -.58rem; }\n\n.slds-icon.category {\n  fill: #4F6A92;\n  height: 1.2rem;\n  width: 1.2rem; }\n\n/*Chrome*/\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  input[type='range'] {\n    width: 80px;\n    -webkit-appearance: none; }\n    input[type='range'].max-range {\n      background-color: transparent; }\n    input[type='range'].min-range {\n      background-color: #d8dde6; }\n  input[type='range']::-webkit-slider-runnable-track {\n    height: 2px;\n    -webkit-appearance: none;\n    color: #0C8EFF; }\n  input[type='range']:focus {\n    outline: none; }\n  input[type='range']::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    border: .15rem solid #0C8EFF;\n    border-radius: 2rem;\n    background: #00396B;\n    margin-top: -.5rem;\n    overflow: hidden;\n    height: 1rem;\n    width: 1rem; }\n  input[type='range'].min-range::-webkit-slider-thumb {\n    height: 1.2rem;\n    width: 1.2rem; } }\n\n/** FF*/\ninput[type=\"range\"]::-moz-range-progress {\n  background-color: #43e5f7; }\n\ninput[type=\"range\"]::-moz-range-track {\n  background-color: #9a905d; }\n\n/* IE*/\ninput[type=\"range\"]::-ms-fill-lower {\n  background-color: #43e5f7; }\n\ninput[type=\"range\"]::-ms-fill-upper {\n  background-color: #9a905d; }\n",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-member-filter/1/Vlocity/1512540858775",
                        "%vlocity_namespace%__HTML__c": "<div class=\"slds-col slds-size--1-of-1 slds-p-right--x-small filter-container\" ng-show=\"importedScope.show_filter\">\n    <div class=\"slds-section__title slds-p-top--x-small slds-p-left--medium\">Filters </div>\n    <div ng-show=\"!records[0]\" class=\"slds-text-body--regular slds-m-top--medium  slds-p-left--medium\">\n        Please configure Vlocity Attributes to enable filters for campaign member list.\n    </div>\n    <ul class=\"slds-has-block-links--space slds-has-list-interactions\" onmouseover=\"this.style.cursor='pointer'\">\n    <li ng-repeat=\"category in records[0] track by $index\">\n              <label class=\"slds-form-element__label\" ng-click=\"show[$index] ? show[$index] = false : show[$index] = true\"><icon ng-class=\"show[$index] ? 'slds-icon icon-v-down-caret' : 'slds-icon icon-v-right-caret'\"></icon>\n              {{category.name}}</label>\n                  <ul class=\"slds-is-nested slds-list--vertical\" ng-show=\"show[$index]\">\n                    <li class=\"slds-item\" ng-repeat=\"attribute in category.attributes.records | orderBy : 'displaySequence'\">\n                        <div ng-if=\"category.uiControlType !== '1-5 scale' && category.uiControlType !== 'TextComment'\" >\n                          <label class=\"slds-checkbox\">\n                            <input type=\"checkbox\" name=\"attribute.name\" id=\"checkbox-contacts\" ng-model=\"attribute.isSelected\" ng-change=\"importedScope.invokeFilter(attribute)\"/>\n                            <span class=\"slds-checkbox--faux slds-m-horizontal--xx-small\"></span>\n                            <span class=\"slds-form-element__label\">{{attribute.name}}</span>\n                             </label>\n                         </div>\n                        <div ng-if=\"category.uiControlType == '1-5 scale'\" class=\"slds-clearfix\">\n                           <label class=\"slds-form-element__label slds-m-bottom--x-small slds-float--left\">{{attribute.name}}<span class=\"slds-float--right slds-p-left--x-small slds-text-body--xx-small\" ng-show=\"attribute.minvalue && attribute.maxvalue\" >({{attribute.minvalue}} - {{attribute.maxvalue}})</span></label>\n                            <input type=\"range\" class=\"input-range-filter slds-m-bottom--x-small min-range\" id=\"scale\" min=\"1\" max=\"{{attribute.maxvalue}}\" value=\"1\" step=\"1\" ng-model=\"attribute.minvalue\" ng-change=\"importedScope.invokeFilter(attribute)\"> \n                            <input  type=\"range\" class=\"input-range-filter slds-m-bottom--x-small max-range\" id=\"scale\" min=\"{{attribute.minvalue}}\" max=\"5\" value=\"5\" step=\"1\" ng-model=\"attribute.maxvalue\" ng-change=\"importedScope.invokeFilter(attribute)\"> \n                        </div>\n                         <div ng-if=\"category.uiControlType == 'TextComment'\">\n                           <label class=\"slds-form-element__label\">{{attribute.name}}</label>\n                            <div class=\"slds-form-element__control\">\n                            <input id=\"text-input-01\" class=\"slds-input\" type=\"text\" placeholder=\"{{attribute.value}}\" ng-model=\"attribute.value\" ng-change=\"importedScope.invokeFilter(attribute)\" />\n                           </div>\n                        </div>\n                  </li>\n                   \n                </ul>\n        </li>\n        <ul class=\"slds-is-nested slds-list--vertical\" ng-show=\"show_interests\">\n            <li class=\"slds-item\" ng-repeat=\"interest in interests track by $index\">\n              <label class=\"slds-checkbox\">\n                <input type=\"checkbox\" name=\"options\" id=\"checkbox-contacts\" ng-model=\"interest.isSelected\"/>\n                <span class=\"slds-checkbox--faux\"></span>\n                <span class=\"slds-form-element__label\">{{interest.name}}</span>\n              </label>\n          </li>\n        </ul>\n    </ul>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__SampleJson__c": "{\"data\":{\"actions\":[{\"displayName\":\"Like Action\",\"vlocityIcon\":\"icon-v-heart\"}],\"fields\":[{\"label\":\"Description\",\"name\":\"description\"},{\"label\":\"Cost\",\"name\":\"cost\",\"type\":\"currency\"}],\"title\":\"Card Title\"},\"obj\":{\"Id\":\"123456\",\"LastModifiedDate\":\"2016-07-28T19:37:07.013Z\",\"Name\":\"Object Name\",\"cost\":150,\"description\":\"Some description\"}}",
                        "%vlocity_namespace%__Sass__c": ".slds-col{\n    &.filter-container{\n        border-right: 1px solid #d8dde6;\n        min-height: 34rem;\n        width: 11rem;\n        max-width: 11rem;\n    }\n    .max-range{\n        position: relative;\n        top: -.58rem;\n    }\n   \n    \n}\n\n.slds-icon{\n        &.category{\n           fill: #4F6A92;\n           height: 1.2rem;\n           width: 1.2rem;\n        }\n    }\n\n/*Chrome*/\n@media screen and (-webkit-min-device-pixel-ratio:0) {\n    input[type='range'] {\n      //overflow: hidden;\n      width: 80px;\n      -webkit-appearance: none;\n      &.max-range{\n        background-color: transparent;\n      }\n      &.min-range{\n          background-color: #d8dde6;\n      }\n    }\n    \n    \n    input[type='range']::-webkit-slider-runnable-track {\n      height: 2px;\n      -webkit-appearance: none;\n      color: #0C8EFF;\n    }\n    \n    input[type='range']:focus {\n        outline:none;\n        \n    }\n    \n    input[type='range']::-webkit-slider-thumb {\n      -webkit-appearance: none;\n      border: .15rem solid #0C8EFF;\n      border-radius: 2rem;\n      background: #00396B;\n      margin-top: -.5rem;\n      overflow: hidden;\n      height: 1rem;\n      width: 1rem;\n    \n    }\n    input[type='range'].min-range::-webkit-slider-thumb {\n        height: 1.2rem;\n        width: 1.2rem;\n    }\n\n} \n\n/** FF*/\ninput[type=\"range\"]::-moz-range-progress {\n  background-color: #43e5f7; \n}\ninput[type=\"range\"]::-moz-range-track {  \n  background-color: #9a905d;\n}\n/* IE*/\ninput[type=\"range\"]::-ms-fill-lower {\n  background-color: #43e5f7; \n}\ninput[type=\"range\"]::-ms-fill-upper {  \n  background-color: #9a905d;\n}",
                        "%vlocity_namespace%__Type__c": "Cards",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-filter",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-member-filter/%vlocity_namespace%__VlocityUITemplate__c/campaign-member-filter"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-member-filter",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-member-filter",
            "VlocityDataPackName": "campaign-member-filter",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": "/*** VARIABLES ***/\n/*** MIXINS ***/\n/*** MIXINS ***/\n.campaign-member-list .campaign-member-list-header {\n  height: 3rem;\n  position: relative;\n  top: 0;\n  left: 0;\n  width: 100%;\n  background-color: #EEF1F6;\n  border-bottom: 1px solid #d8dde6; }\n  .campaign-member-list .campaign-member-list-header .slds-icon_container.column-header-icon {\n    position: absolute;\n    left: 0.5rem;\n    top: 50%;\n    transform: translateY(-50%);\n    z-index: 2;\n    cursor: pointer; }\n  .campaign-member-list .campaign-member-list-header .slds-text-heading--small {\n    line-height: 3rem;\n    padding-left: 3.1rem; }\n\n.campaign-member-list .campaign-member-list-header .right-side-icons {\n  width: 4rem;\n  position: absolute;\n  right: 0;\n  top: 0;\n  height: 100%; }\n  .campaign-member-list .campaign-member-list-header .right-side-icons:before, .campaign-member-list .campaign-member-list-header .right-side-icons:after {\n    content: \" \";\n    display: table; }\n  .campaign-member-list .campaign-member-list-header .right-side-icons:after {\n    clear: both; }\n  .campaign-member-list .campaign-member-list-header .right-side-icons .slds-icon_container {\n    float: left;\n    line-height: 2.7rem;\n    width: 2rem;\n    cursor: pointer; }\n    .campaign-member-list .campaign-member-list-header .right-side-icons .slds-icon_container svg {\n      fill: #A7B8D1;\n      transition: fill 100ms ease-in; }\n    .campaign-member-list .campaign-member-list-header .right-side-icons .slds-icon_container:hover svg {\n      fill: #4F6A92; }\n    .campaign-member-list .campaign-member-list-header .right-side-icons .slds-icon_container.filter-icon.active svg {\n      fill: #04844b; }\n\n.campaign-member-list .search-campaign-members {\n  background-color: #f4f6f9; }\n  .campaign-member-list .search-campaign-members .right-side-icons {\n    width: 4rem;\n    position: absolute;\n    right: 0;\n    top: 0;\n    height: 100%; }\n    .campaign-member-list .search-campaign-members .right-side-icons:before, .campaign-member-list .search-campaign-members .right-side-icons:after {\n      content: \" \";\n      display: table; }\n    .campaign-member-list .search-campaign-members .right-side-icons:after {\n      clear: both; }\n    .campaign-member-list .search-campaign-members .right-side-icons .slds-icon_container {\n      float: left;\n      line-height: 2.7rem;\n      width: 2rem;\n      cursor: pointer; }\n      .campaign-member-list .search-campaign-members .right-side-icons .slds-icon_container svg {\n        fill: #A7B8D1;\n        transition: fill 100ms ease-in; }\n      .campaign-member-list .search-campaign-members .right-side-icons .slds-icon_container:hover svg {\n        fill: #4F6A92; }\n      .campaign-member-list .search-campaign-members .right-side-icons .slds-icon_container.filter-icon.active svg {\n        fill: #04844b; }\n  .campaign-member-list .search-campaign-members .right-side-icons {\n    width: 2rem; }\n    .campaign-member-list .search-campaign-members .right-side-icons .slds-icon_container {\n      line-height: 3.5rem; }\n\n.campaign-member-list .filter-list-container {\n  background-color: #fff;\n  transition: max-height 350ms ease-in, visibility 0ms linear 350ms, border-top 0ms linear 350ms;\n  max-height: 0;\n  visibility: hidden;\n  overflow: hidden;\n  position: relative;\n  border-top: 1px solid #f4f6f9; }\n  .campaign-member-list .filter-list-container .filter-list-items .slds-button {\n    line-height: 1.2rem;\n    min-height: 2rem; }\n    .campaign-member-list .filter-list-container .filter-list-items .slds-button.filter-active {\n      background-color: #f4f6f9; }\n  .campaign-member-list .filter-list-container .filter-modal-footer {\n    border-radius: 0;\n    border-right: none;\n    border-left: none;\n    box-shadow: none;\n    background-color: #fff; }\n  .campaign-member-list .filter-list-container.active {\n    max-height: 50rem;\n    visibility: visible;\n    transition: max-height 350ms ease-in, visibility 0ms linear 0ms, border-top 0ms linear 0ms;\n    border-top: 1px solid #d8dde6; }\n\n.campaign-member-list .member-list-pagination {\n  text-align: center;\n  background-color: #fff; }\n  .campaign-member-list .member-list-pagination .slds-align-middle {\n    min-width: 25%; }\n  .campaign-member-list .member-list-pagination .slds-button svg {\n    fill: #A7B8D1;\n    position: relative;\n    top: -1px; }\n  .campaign-member-list .member-list-pagination .slds-button[disabled] svg {\n    fill: #CFD7E6; }\n\n.campaign-member-list .no-results {\n  color: white; }\n\n.campaign-member-list .list-container {\n  position: relative; }\n  .campaign-member-list .list-container .campaign-list-member {\n    cursor: pointer;\n    background-color: #fff;\n    transition: background-color 100ms ease-in;\n    height: 3.875rem;\n    position: relative; }\n    .campaign-member-list .list-container .campaign-list-member:after {\n      content: \"\";\n      display: block;\n      transition: background-color 100ms ease-in;\n      position: absolute;\n      z-index: 1;\n      top: -1px;\n      left: 0;\n      height: calc(100% + 2px);\n      width: 0.3rem;\n      background-color: transparent; }\n    .campaign-member-list .list-container .campaign-list-member section {\n      position: relative;\n      width: 100%;\n      height: 100%;\n      padding-right: 0.75rem;\n      overflow-y: hidden; }\n      .campaign-member-list .list-container .campaign-list-member section .mobile-click {\n        position: absolute;\n        z-index: 10;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        display: block; }\n      .campaign-member-list .list-container .campaign-list-member section .status-icon {\n        font-size: 1.125rem;\n        position: absolute;\n        right: 1rem;\n        top: 50%;\n        transform: translateY(-54%); }\n        .campaign-member-list .list-container .campaign-list-member section .status-icon.call-back {\n          font-size: 1.6rem; }\n        .campaign-member-list .list-container .campaign-list-member section .status-icon .slds-icon.status {\n          fill: #d8dde6;\n          width: 1em; }\n        .campaign-member-list .list-container .campaign-list-member section .status-icon .slds-icon.call-back {\n          width: 1.2em;\n          position: relative;\n          left: .2em; }\n          .campaign-member-list .list-container .campaign-list-member section .status-icon .slds-icon.call-back.time-sensitive {\n            fill: #ffb75d; }\n          .campaign-member-list .list-container .campaign-list-member section .status-icon .slds-icon.call-back.past-due {\n            fill: #c23934; }\n      .campaign-member-list .list-container .campaign-list-member section .list-member-info {\n        position: absolute;\n        top: 50%;\n        transform: translateY(-50%);\n        width: 75%; }\n        .campaign-member-list .list-container .campaign-list-member section .list-member-info .target-call-date {\n          display: inline-block;\n          margin-left: 0.5rem;\n          font-style: italic; }\n        .campaign-member-list .list-container .campaign-list-member section .list-member-info .slds-item {\n          line-height: 1.2rem; }\n          .campaign-member-list .list-container .campaign-list-member section .list-member-info .slds-item a {\n            color: #00396B; }\n        .campaign-member-list .list-container .campaign-list-member section .list-member-info ul .slds-item.member-meta-data {\n          color: #4F6A92; }\n    .campaign-member-list .list-container .campaign-list-member:hover, .campaign-member-list .list-container .campaign-list-member:active, .campaign-member-list .list-container .campaign-list-member:focus, .campaign-member-list .list-container .campaign-list-member.active {\n      background-color: #f7f9fb; }\n      .campaign-member-list .list-container .campaign-list-member:hover:after, .campaign-member-list .list-container .campaign-list-member:active:after, .campaign-member-list .list-container .campaign-list-member:focus:after, .campaign-member-list .list-container .campaign-list-member.active:after {\n        background-color: #d8dde6; }\n      .campaign-member-list .list-container .campaign-list-member:hover section .list-member-info .slds-item a, .campaign-member-list .list-container .campaign-list-member:active section .list-member-info .slds-item a, .campaign-member-list .list-container .campaign-list-member:focus section .list-member-info .slds-item a, .campaign-member-list .list-container .campaign-list-member.active section .list-member-info .slds-item a {\n        color: #005FB2; }\n    .campaign-member-list .list-container .campaign-list-member.active:after {\n      background-color: #005FB2; }\n\n.campaign-member-list .slds-text-body--small {\n  font-size: 10px; }\n\n.campaign-member-list .slds-has-dividers--left > .slds-item:after {\n  margin-left: .3em;\n  margin-right: .3em; }\n\n.campaign-member-list .slds-has-dividers--left {\n  padding-top: 1px; }\n\n.campaign-member-list .member-list-pagination-top {\n  border-top: 1px solid #d8dde6; }\n\n@media screen and (min-width: 30em) and (max-width: 48em) {\n  .campaign-member-list .filter-list-container .filter-list-items .slds-button-group {\n    display: block; }\n    .campaign-member-list .filter-list-container .filter-list-items .slds-button-group:before, .campaign-member-list .filter-list-container .filter-list-items .slds-button-group:after {\n      content: \" \";\n      display: table; }\n    .campaign-member-list .filter-list-container .filter-list-items .slds-button-group:after {\n      clear: both; }\n  .campaign-member-list .filter-list-container .filter-list-items .slds-button {\n    width: 50%;\n    float: left; }\n    .campaign-member-list .filter-list-container .filter-list-items .slds-button:first-child {\n      border-bottom-left-radius: 0; }\n    .campaign-member-list .filter-list-container .filter-list-items .slds-button:nth-child(odd) {\n      margin-left: 0; }\n      .campaign-member-list .filter-list-container .filter-list-items .slds-button:nth-child(odd):last-child {\n        border-top-right-radius: 0;\n        border-bottom-right-radius: 0;\n        border-bottom-left-radius: 0.25rem; }\n      .campaign-member-list .filter-list-container .filter-list-items .slds-button:nth-child(odd):nth-last-child(2) {\n        border-bottom-left-radius: 0.25rem; }\n    .campaign-member-list .filter-list-container .filter-list-items .slds-button:nth-child(even):last-child {\n      border-top-right-radius: 0; }\n    .campaign-member-list .filter-list-container .filter-list-items .slds-button:nth-child(2) {\n      border-top-right-radius: 0.25rem; }\n    .campaign-member-list .filter-list-container .filter-list-items .slds-button:nth-child(n+3) {\n      margin-top: -1px; } }\n\n@media screen and (min-width: 30em) and (max-width: 44em) {\n  .campaign-member-list .campaign-member-list-header .slds-text-heading--small span {\n    display: none; } }\n\n@media screen and (max-width: 30em) {\n  .campaign-member-list .search-campaign-members {\n    padding-right: 3rem; }\n    .campaign-member-list .search-campaign-members .slds-input {\n      line-height: 2rem; }\n  .campaign-member-list .member-list-pagination {\n    display: block;\n    padding: 0.25rem 0;\n    background-color: #f4f6f9;\n    width: 100%;\n    border-top: 1px solid #d8dde6; }\n    .campaign-member-list .member-list-pagination.member-list-pagination-bottom {\n      border-top: 0;\n      border-bottom: 1px solid #d8dde6; }\n  .campaign-member-list .list-container {\n    overflow-y: auto; }\n    .campaign-member-list .list-container .campaign-list-member section .list-member-info {\n      width: 80%; }\n      .campaign-member-list .list-container .campaign-list-member section .list-member-info .member-meta-data {\n        font-size: 0.7rem; } }\n\nli.vlc-list-card-row {\n  list-style: none;\n  display: block;\n  cursor: pointer; }\n  li.vlc-list-card-row section {\n    padding: 20px 0; }\n    li.vlc-list-card-row section:hover, li.vlc-list-card-row section:active, li.vlc-list-card-row section:focus, li.vlc-list-card-row section .selected {\n      transform: translateZ(0);\n      backface-visibility: hidden;\n      -moz-osx-font-smoothing: grayscale;\n      transition-duration: 0.4s;\n      transition-property: background-color; }\n      li.vlc-list-card-row section:hover .vlc-list-card div, li.vlc-list-card-row section:hover .vlc-list-card ul.actions > li > a > .icon, li.vlc-list-card-row section:active .vlc-list-card div, li.vlc-list-card-row section:active .vlc-list-card ul.actions > li > a > .icon, li.vlc-list-card-row section:focus .vlc-list-card div, li.vlc-list-card-row section:focus .vlc-list-card ul.actions > li > a > .icon, li.vlc-list-card-row section .selected .vlc-list-card div, li.vlc-list-card-row section .selected .vlc-list-card ul.actions > li > a > .icon {\n        color: white; }\n\n.vlc-list-card {\n  display: block; }\n  .vlc-list-card div {\n    text-transform: uppercase;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    background: blue;\n    padding-left: 10px; }\n    .vlc-list-card div .sub-data:first-child {\n      margin-left: 10px; }\n  .vlc-list-card ul.actions {\n    padding: 0;\n    margin: 0 4px;\n    list-style: none;\n    float: right; }\n    .vlc-list-card ul.actions > li {\n      float: left; }\n      .vlc-list-card ul.actions > li > a > .icon:before {\n        font-size: 18px; }\n",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "LATEST",
                        "%vlocity_namespace%__DisplayOn__c": "All",
                        "%vlocity_namespace%__ExternalID__c": "campaign-member-list/1/Vlocity/1512540858777",
                        "%vlocity_namespace%__HTML__c": "<!-- <div class=\"slds-spinner_container\" ng-show=\"!importedScope.isLoaded\">\n    <div class=\"slds-spinner slds-spinner--medium\" aria-hidden=\"false\" role=\"alert\">\n        <div class=\"slds-spinner__dot-a\"></div>\n        <div class=\"slds-spinner__dot-b\"></div>\n    </div>\n</div> -->\n<div ng-init=\"importedScope.setObj(obj); importedScope.callListInit(params.id)\" class=\"campaign-member-list slds-form-element slds-clearfix scroll\" ng-class=\"{'filter-active': importedScope.show_filter}\">\n    <div class=\"campaign-member-list-header\" ng-hide=\"importedScope.responsiveHelper.bpSmall\">\n        <div class=\"slds-icon_container slds-icon-standard-groups column-header-icon\" title=\"Member List\">\n            <slds-svg-icon sprite=\"'standard'\" icon=\"'groups'\" size=\"'medium'\"></slds-svg-icon>\n            <span class=\"slds-assistive-text\">Member List</span>\n        </div>\n        <span class=\"slds-text-heading--small\"><span>Member </span>List</span>\n        <div class=\"right-side-icons\">\n            <span class=\"slds-icon_container\" ng-click=\"importedScope.refreshList()\">\n                <slds-svg-icon sprite=\"'utility'\" icon=\"'refresh'\" size=\"'x-small'\"></slds-svg-icon>\n            </span>\n            <span class=\"slds-icon_container filter-icon\" ng-click=\"importedScope.show_filter = !importedScope.show_filter\" ng-class=\"{'active': importedScope.show_filter}\">\n                <slds-svg-icon sprite=\"'utility'\" icon=\"'filterList'\" size=\"'x-small'\"></slds-svg-icon>\n            </span>\n        </div>\n    </div>\n    <div class=\"search-campaign-members slds-form-element slds-lookup slds-p-around--small\" data-select=\"single\" data-scope=\"single\">\n        <div class=\"slds-form-element__control slds-input-has-icon slds-input-has-icon--left-right\">\n            <slds-input-svg-icon sprite=\"'utility'\" icon=\"'search'\" size=\"'small'\" extra-classes=\"'slds-input__icon--left slds-icon-text-default'\"></slds-input-svg-icon>\n            <input id=\"search-member-list\" class=\"slds-lookup__search-input slds-input\" type=\"text\" aria-autocomplete=\"list\" role=\"combobox\" aria-expanded=\"true\" aria-activedescendant=\"\" placeholder=\"Search Members by Name\" ng-model=\"importedScope.searchText\" ng-model-options='{ debounce: 250 }' ng-change=\"importedScope.search()\" />\n            <button class=\"slds-input__icon slds-input__icon--right slds-button slds-button--icon\" ng-if=\"importedScope.searchText.length\" ng-click=\"importedScope.searchText = ''; importedScope.search();\">\n                <slds-button-svg-icon sprite=\"'utility'\" icon=\"'clear'\" size=\"'medium'\"></slds-button-svg-icon>\n            </button>\n        </div>\n        <div class=\"right-side-icons\" ng-show=\"importedScope.responsiveHelper.bpSmall\">\n            <span class=\"slds-icon_container filter-icon\" ng-click=\"importedScope.show_filter = !importedScope.show_filter\" ng-class=\"{'active': importedScope.show_filter}\">\n                <slds-svg-icon sprite=\"'utility'\" icon=\"'filterList'\" size=\"'x-small'\"></slds-svg-icon>\n            </span>\n        </div>\n    </div>\n    <div class=\"filter-list-container\" ng-class=\"{'active': importedScope.show_filter}\">\n        <div class=\"campaign-spinner-container\" ng-show=\"importedScope.filterLoading\">\n            <div class=\"slds-spinner_container campaign-list-spinner\">\n                <div class=\"slds-spinner slds-spinner--medium\" aria-hidden=\"false\" role=\"alert\">\n                    <div class=\"slds-spinner__dot-a\"></div>\n                    <div class=\"slds-spinner__dot-b\"></div>\n                </div>\n            </div>\n        </div>\n        <div class=\"filter-list-items slds-p-horizontal--small slds-p-vertical--xx-small\">\n            <div class=\"form-element\">\n                <label class=\"slds-form-element__label\" for=\"textarea-input-01\">Sort By:</label>\n                <div class=\"slds-form-element__control\">\n                    <div class=\"slds-button-group\" role=\"group\">\n                        <button ng-click=\"importedScope.setSortBy('LastName')\" class=\"slds-button slds-button--neutral slds-truncate\" ng-class=\"{'filter-active': importedScope.filter.sortBy.LastName}\">Last Name</button>\n                        <button ng-click=\"importedScope.setSortBy('Status')\" class=\"slds-button slds-button--neutral slds-truncate\" ng-class=\"{'filter-active': importedScope.filter.sortBy.Status}\">Status</button>\n                        <button ng-click=\"importedScope.setSortBy('TargetCallDate__c')\" class=\"slds-button slds-button--neutral slds-button--last slds-truncate\" ng-class=\"{'filter-active': importedScope.filter.sortBy.TargetCallDate__c}\">Target Date</button>\n                    </div>\n                </div>\n            </div>\n            <div class=\"slds-form-element slds-m-top--small\">\n                <label class=\"slds-form-element__label\" for=\"textarea-input-01\">Target Date Range:</label>\n                <div class=\"slds-form-element__control\">\n                    <div class=\"slds-button-group\" role=\"group\">\n                        <button ng-click=\"importedScope.setTargetDate('TODAY')\" class=\"slds-button slds-button--neutral slds-p-horizontal--x-small slds-truncate\" ng-class=\"{'filter-active': importedScope.filter.dateRange.TODAY}\">Today</button>\n                        <button ng-click=\"importedScope.setTargetDate('THIS_WEEK')\" class=\"slds-button slds-button--neutral slds-p-horizontal--x-small slds-truncate\" ng-class=\"{'filter-active': importedScope.filter.dateRange.THIS_WEEK}\">This Week</button>\n                        <button ng-click=\"importedScope.setTargetDate('THIS_MONTH')\" class=\"slds-button slds-button--neutral slds-p-horizontal--x-small slds-truncate\" ng-class=\"{'filter-active': importedScope.filter.dateRange.THIS_MONTH}\">This Month</button>\n                        <button ng-click=\"importedScope.setTargetDate('ALL')\" class=\"slds-button slds-button--neutral slds-p-horizontal--x-small slds-truncate slds-button--last\" ng-class=\"{'filter-active': importedScope.filter.dateRange.ALL}\">All</button>\n                    </div>\n                </div>\n            </div>\n            <div class=\"slds-form-element slds-m-top--small slds-m-bottom--small\">\n                <label class=\"slds-form-element__label\" for=\"textarea-input-01\">Filter Statuses By:</label>\n                <div class=\"slds-form-element__control\" ng-repeat=\"(key, value) in importedScope.filter.status\">\n                    <label class=\"slds-checkbox\">\n                        <input type=\"checkbox\" name=\"options\" id=\"checkbox-01\" ng-model=\"value\" ng-click=\"importedScope.setFilterStatus(key, value)\" />\n                        <span class=\"slds-checkbox--faux\"></span>\n                        <span class=\"slds-form-element__label\">{{key}}\n                        </span>\n                    </label>\n                </div>\n            </div>\n            <div class=\"slds-form-element slds-m-top--small slds-m-bottom--small\">\n                <label class=\"slds-form-element__label\" for=\"textarea-input-01\">Filter By Owner:</label>\n                <fieldset class=\"slds-form-element\">\n                    <div class=\"slds-form-element__control\" ng-repeat=\"option in importedScope.ownerOptions\">\n                        <span class=\"slds-radio\">\n                            <label class=\"slds-radio__label\" for=\"radio-owner-{{$index}}\">\n                                <input type=\"radio\" id=\"radio-owner-{{$index}}\" name=\"options\" value=\"{{option.value}}\" ng-model=\"option.selected\" ng-change=\"importedScope.setOwnerVisibility(option)\"/>\n                                <span class=\"slds-radio--faux\"></span>\n                        <span class=\"slds-form-element__label\">{{option.label}}</span>\n                        </label>\n                        </span>\n                    </div>\n                </fieldset>\n            </div>\n        </div>\n        <div class=\"slds-modal__footer filter-modal-footer slds-clearfix slds-has-divider--top\">\n            <button ng-click=\"importedScope.show_filter = !importedScope.show_filter\" class=\"slds-button slds-button--neutral slds-float--left\">Cancel</button>\n            <button class=\"slds-button slds-button--neutral slds-button--brand slds-float--right\" ng-click=\"importedScope.refreshDetail = true; importedScope.query()\">Apply</button>\n        </div>\n    </div>\n    <div class=\"member-list-pagination member-list-pagination-top slds-clearfix\" ng-hide=\"importedScope.emptyResults || (importedScope.disableNextBtn && importedScope.currentPage === 0)\">\n        <button class=\"slds-button slds-button--link slds-m-right--medium\" ng-class=\"{'disabled' : importedScope.currentPage === 0}\" ng-click=\"importedScope.previousPage()\" ng-disabled=\"importedScope.currentPage === 0\">\n            <slds-svg-icon sprite=\"'utility'\" icon=\"'chevronleft'\" size=\"'x-small'\"></slds-svg-icon>\n        </button>\n        <span class=\"slds-align-middle slds-text-body--small\" disabled='true'>{{importedScope.pageNoStr}}</span>\n        <button class=\"slds-button slds-button--link slds-m-left--medium\" ng-class=\"{'disabled' : importedScope.disableNextBtn}\" ng-click=\"importedScope.nextPage()\" ng-disabled=\"importedScope.disableNextBtn || !importedScope.listMembers.actions.nextMemberList;\">\n            <slds-svg-icon sprite=\"'utility'\" icon=\"'chevronright'\" size=\"'x-small'\"></slds-svg-icon>\n        </button>\n    </div>\n    <div class=\"list-container\">\n        <div class=\"campaign-spinner-container\" ng-show=\"importedScope.isListLoading\">\n            <div class=\"slds-spinner_container campaign-list-spinner\">\n                <div class=\"slds-spinner slds-spinner--medium\" aria-hidden=\"false\" role=\"alert\">\n                    <div class=\"slds-spinner__dot-a\"></div>\n                    <div class=\"slds-spinner__dot-b\"></div>\n                </div>\n            </div>\n        </div>\n        <div ng-repeat=\"listMember in importedScope.listMembers.records\" class=\"campaign-list-member slds-has-divider--bottom\" ng-class=\"{'slds-has-divider--top': $index === 0, 'active': $root.currentMemberId === listMember.Id.value && !importedScope.isMobile}\">\n            <section data-card=\"card-{{cardIndex}}\" class=\"slds-p-horizontal--medium\" ng-click=\"importedScope.campaignMemberDetail(listMember)\" hotkey-layout-card>\n                <a href=\"javascript:void(0)\" class=\"mobile-click\" ng-data-url=\"{{'campaignMember/' + listMember.CampaignId.value + '/' + listMember.Id.value}}\" ng-if=\"importedScope.isMobile\" ng-click=\"importedScope.campaignMemberDetail(listMember)\"></a>\n                <div class=\"status-icon\" ng-class=\"{'call-back' : (listMember[importedScope.nameSpacePrefix + 'TargetCallDate__c'].value) && !importedScope.hasRespondedFnc(listMember.Status.value)}\">\n                    <span class=\"slds-icon_container\">\n                        <slds-svg-icon no-hint=\"true\" sprite=\"'utility'\" icon=\"'check'\" extra-classes=\"'status'\" ng-if=\"importedScope.hasRespondedFnc(listMember.Status.value)\"></slds-svg-icon>\n<!--                         <slds-svg-icon no-hint=\"true\" sprite=\"'custom'\" icon=\"'custom25'\" extra-classes=\"'status callback'\" ng-if=\"listMember.isTimeSensitive && !importedScope.hasRespondedFnc(listMember.Status.value) && !listMember.isPastDue\"></slds-svg-icon> -->\n                        <slds-svg-icon no-hint=\"true\" sprite=\"'custom'\" icon=\"'custom25'\" extra-classes=\"'status call-back'\" ng-class=\"{'past-due' : listMember.isPastDue && !importedScope.hasRespondedFnc(listMember.Status.value), 'time-sensitive': (listMember.isTimeSensitive && !importedScope.hasRespondedFnc(listMember.Status.value) && !listMember.isPastDue)}\" ng-show=\"(listMember[importedScope.nameSpacePrefix + 'TargetCallDate__c'].value) && !importedScope.hasRespondedFnc(listMember.Status.value)\" ></slds-svg-icon>\n                    </span>\n                </div>\n                <div class=\"list-member-info\">\n                    <ul class=\"slds-list--horizontal\">\n                        <li class=\"slds-item\">\n                            <a ng-click=\"importedScope.navigateTo(listMember)\">{{listMember.Name.value}}</a>\n                        </li>\n                        <li class=\"slds-item slds-p-left--xx-small\">\n                            <span class=\"slds-text-body--small page-header__info target-call-date\"> {{listMember.formattedDate}}</span>\n                        </li>\n                    </ul>\n                    <ul class=\"slds-list--horizontal member-meta-data slds-text-body--small\">\n                        <li ng-if=\"listMember.Title.value\" class=\"slds-item slds-truncate slds-p-right--xx-small\" title=\"{{listMember.Title.value}}\">{{listMember.Title.value}},\n                        </li>\n                        <li class=\"slds-item slds-truncate\" title=\"{{listMember.Company.value}}\">{{listMember.Company.value}}\n                        </li>\n                    </ul>\n                </div>\n                <div class=\"col-sm-{{12/(data.fields.length + (data.actions.length  > 0 ? 1 : 0))}}\" ng-if=\"data.actions.length > 0\">\n                    <ul class=\"actions\">\n                        <li ng-repeat=\"action in data.actions | limitTo: (data.limitActionLinksTo?data.limitActionLinksTo:5)\">\n                            <a href=\"#\" ng-click=\"performAction(action)\" hotkey-card-action>\n                                <i ng-if=\"!action.imageRef\" class=\"icon {{action.vlocityIcon}}\"></i>\n                                <span ng-if=\"action.imageRef\">\n                                    <img ng-src=\"{{action.imageRef}}\" alt=\"{{action.displayName}}\"/>\n                                </span>\n                            </a>\n                        </li>\n                    </ul>\n                </div>\n            </section>\n        </div>\n    </div>\n    <div ng-show=\"importedScope.emptyResults\" class=\"slds-notify slds-notify--alert slds-theme--warning slds-theme--alert-texture\" role=\"alert\">\n        <h2 class=\"no-results\">No Results</h2>\n    </div>\n    <div class=\"member-list-pagination member-list-pagination-bottom slds-clearfix slds-has-divider--bottom\" ng-hide=\"importedScope.emptyResults || (importedScope.disableNextBtn && importedScope.currentPage === 0)\">\n        <button class=\"slds-button slds-button--link slds-m-right--medium\" ng-class=\"{'disabled' : importedScope.currentPage === 0}\" ng-click=\"importedScope.previousPage()\" ng-disabled=\"importedScope.currentPage === 0\">\n            <slds-svg-icon sprite=\"'utility'\" icon=\"'chevronleft'\" size=\"'x-small'\"></slds-svg-icon>\n        </button>\n        <span class=\"slds-align-middle slds-text-body--small\" disabled='true'>{{importedScope.pageNoStr}}</span>\n        <button class=\"slds-button slds-button--link slds-m-left--medium\" ng-class=\"{'disabled' : importedScope.disableNextBtn}\" ng-click=\"importedScope.nextPage()\" ng-disabled=\"importedScope.disableNextBtn || !importedScope.listMembers.actions.nextMemberList;\">\n            <slds-svg-icon sprite=\"'utility'\" icon=\"'chevronright'\" size=\"'x-small'\"></slds-svg-icon>\n        </button>\n    </div>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__SampleJson__c": "{\"data\":{\"actions\":[{\"displayName\":\"Call\",\"openUrlIn\":\"New Tab / Window\",\"url\":\"https://www.vlocity.com\",\"vlocityIcon\":\"icon-v-phone-line\"},{\"displayName\":\"Email\",\"openUrlIn\":\"New Tab / Window\",\"url\":\"mailto:sales@vlocity.com\",\"vlocityIcon\":\"icon-v-email-line\"},{\"displayName\":\"Alert\",\"openUrlIn\":\"New Tab / Window\",\"url\":\"https://www.vlocity.com\",\"vlocityIcon\":\"icon-v-alert\"},{\"displayName\":\"Like Action\",\"openUrlIn\":\"New Tab / Window\",\"vlocityIcon\":\"icon-v-heart\"}],\"fields\":[{\"label\":\"CEO\",\"name\":\"title\"},{\"label\":\"Company\",\"name\":\"company\"},{\"label\":\"Description\",\"name\":\"description\"},{\"label\":\"ID\",\"name\":\"Id\"},{\"label\":\"Country\",\"name\":\"country\"},{\"label\":\"Cost\",\"name\":\"cost\",\"type\":\"currency\"}],\"title\":\"Sample Card Active Title Here\"},\"obj\":{\"Id\":\"123456\",\"LastModifiedDate\":\"2016-02-05T17:22:06.871Z\",\"Name\":\"Sample sObject Name\",\"company\":\"Vlocity, Inc.\",\"cost\":150,\"country\":\"USA\",\"description\":\"Some description\"}}",
                        "%vlocity_namespace%__Sass__c": "/*** VARIABLES ***/\n@import \"campaign-variables\";\n/*** MIXINS ***/\n@import \"campaign-mixins\";\n\n\n.campaign-member-list {\n    @include columnHeader('campaign-member-list-header', relative);\n\n    .campaign-member-list-header {\n        @include rightSideIcons;\n    }\n\n    .search-campaign-members {\n        background-color: $cards-gray;\n        @include rightSideIcons;\n\n        .right-side-icons {\n            width: 2rem;\n\n            .slds-icon_container {\n                line-height: 3.5rem;\n            }\n        }\n    }\n\n    .filter-list-container {\n        background-color: #fff;\n        transition: max-height 350ms ease-in,\n                    visibility 0ms linear 350ms,\n                    border-top 0ms linear 350ms;\n        max-height: 0;\n        visibility: hidden;\n        overflow: hidden;\n        position: relative;\n        border-top: 1px solid $cards-gray;\n\n        .filter-list-items {\n            .slds-button {\n                line-height: 1.2rem;\n                min-height: 2rem;\n\n                &.filter-active {\n                    background-color: $cards-gray;\n                }\n            }\n        }\n\n        .filter-modal-footer {\n            border-radius: 0;\n            border-right: none;\n            border-left: none;\n            box-shadow: none;\n            background-color: #fff;\n        }\n\n        &.active {\n            max-height: 50rem;\n            visibility: visible;\n            transition: max-height 350ms ease-in,\n                        visibility 0ms linear 0ms,\n                        border-top 0ms linear 0ms;\n            border-top: 1px solid $cards-border-gray;\n        }\n    }\n\n    .member-list-pagination {\n        text-align: center;\n        background-color: #fff;\n\n        .slds-align-middle {\n            min-width: 25%;\n        }\n\n        .slds-button {\n            svg {\n                fill: $neutral-medium;\n                position: relative;\n                top: -1px;\n            }\n\n            &[disabled] {\n                svg {\n                    fill: $neutral-light;\n                }\n            }\n        }\n    }\n\n    .no-results{\n        color: white;\n    }\n\n    .list-container {\n        position: relative;\n\n        .campaign-list-member {\n            cursor: pointer;\n            background-color: #fff;\n            transition: background-color 100ms ease-in;\n            height: 3.875rem;\n            position: relative;\n\n            &:after {\n                content: \"\";\n                display: block;\n                transition: background-color 100ms ease-in;\n                position: absolute;\n                z-index: 1;\n                top: -1px;\n                left: 0;\n                height: calc(100% + 2px);\n                width: 0.3rem;\n                background-color: transparent;\n            }\n\n            section {\n                position: relative;\n                width: 100%;\n                height: 100%;\n                padding-right: 0.75rem;\n                overflow-y: hidden;\n\n                .mobile-click {\n                    position: absolute;\n                    z-index: 10;\n                    top: 0;\n                    left: 0;\n                    width: 100%;\n                    height: 100%;\n                    display: block;\n                }\n\n                .status-icon {\n                    font-size: 1.125rem;\n                    position: absolute;\n                    right: 1rem;\n                    top: 50%;\n                    transform: translateY(-54%);\n                    \n                    &.call-back {\n                        font-size: 1.6rem;\n                    }\n\n                    .slds-icon {\n                        &.status {\n                            fill: $cards-border-gray;\n                            width: 1em;\n                        }\n\n                        &.call-back {\n                            width: 1.2em;\n                            position: relative;\n                            left: .2em;\n\n                            &.time-sensitive {\n                            fill: $notify-warning\n                            }\n\n                            &.past-due{\n                                fill: #c23934;\n                            }\n                        }\n                    }\n                }\n\n                .list-member-info {\n                    position: absolute;\n                    top: 50%;\n                    transform: translateY(-50%);\n                    width: 75%;\n\n                    .target-call-date {\n                        display: inline-block;\n                        margin-left: 0.5rem;\n                        font-style: italic;\n                    }\n\n                    .slds-item {\n                        line-height: 1.2rem;\n\n                        a {\n                            color: $primary-dark;\n                        }\n                    }\n\n                    ul {\n                        .slds-item.member-meta-data {\n                            color: $neutral-dark;\n                        }\n                    }\n                }\n            }\n\n            &:hover, &:active, &:focus, &.active {\n                background-color: $header-gray;\n\n                &:after {\n                    background-color: $cards-border-gray;\n                }\n\n                section {\n                    .list-member-info {\n                        .slds-item {\n                            a {\n                                color: $primary-medium;\n                            }\n                        }\n                    }\n                }\n            }\n\n            &.active {\n                &:after {\n                    background-color: $primary-medium;\n                }\n            }\n        }\n    }\n\n    .slds-text-body--small{\n        font-size: 10px;\n    }\n    \n    .slds-has-dividers--left>.slds-item:after {\n        margin-left: .3em;\n        margin-right: .3em;\n    }\n    \n    \n    .slds-has-dividers--left{\n        padding-top: 1px;\n    }\n\n    .member-list-pagination-top {\n        border-top: 1px solid $cards-border-gray;\n    }\n\n    &.filter-active {\n\n    }\n\n    @media screen and (min-width: $bp-small) and (max-width: $bp-medium) {\n        .filter-list-container {\n            .filter-list-items {\n                .slds-button-group {\n                    @include clearfix;\n                    display: block;\n                }\n\n                .slds-button {\n                    width: 50%;\n                    float: left;\n\n                    &:first-child {\n                        border-bottom-left-radius: 0;\n                    }\n\n                    &:nth-child(odd) {\n                        margin-left: 0;\n\n                        &:last-child {\n                            border-top-right-radius: 0;\n                            border-bottom-right-radius: 0;\n                            border-bottom-left-radius: 0.25rem;\n                        }\n\n                        &:nth-last-child(2) {\n                            border-bottom-left-radius: 0.25rem;\n                        }\n                    }\n\n                    &:nth-child(even) {\n                        &:last-child {\n                            border-top-right-radius: 0;\n                        }\n                    }\n\n                    &:nth-child(2) {\n                        border-top-right-radius: 0.25rem;\n                    }\n\n                    // All except first 2\n                    &:nth-child(n+3) {\n                        margin-top: -1px;\n                    }\n                }\n            }\n        }\n    }\n\n    @media screen and (min-width: $bp-small) and (max-width: $bp-xmedium) {\n        .campaign-member-list-header {\n            .slds-text-heading--small {\n                span {\n                    display: none;\n                }\n            }\n        }\n    }\n\n    @media screen and (max-width: $bp-small) {\n        .search-campaign-members {\n            padding-right: 3rem;\n\n            .slds-input {\n                line-height: 2rem;\n            }\n        }\n\n        .member-list-pagination {\n            display: block;\n            padding: 0.25rem 0;\n            background-color: $cards-gray;\n            width: 100%;\n            border-top: 1px solid $cards-border-gray;\n\n            &.member-list-pagination-bottom {\n                border-top: 0;\n                border-bottom: 1px solid $cards-border-gray;\n            }\n        }\n\n        .list-container {\n            overflow-y: auto;\n\n            .campaign-list-member {\n                section {\n                    .list-member-info {\n                        width: 80%;\n                        \n                        .member-meta-data {\n                            font-size: 0.7rem;\n                        }\n                    }\n                }\n            }\n        }\n    }\n}\n\nli.vlc-list-card-row {\n    list-style: none;\n    //border-bottom: 1px solid $mid-gray;\n\tdisplay: block;\n\tcursor: pointer;\n\n    section {\n        padding: 20px 0;\n        &:hover, &:active, &:focus, .selected {\n        \ttransform: translateZ(0);\n        \tbackface-visibility: hidden;\n        \t-moz-osx-font-smoothing: grayscale;\n        \ttransition-duration: 0.4s;\n        \ttransition-property: background-color;\n        \t//background: #0070d2;\n        \n            .vlc-list-card {\n        \t    div, ul.actions>li>a>.icon {\n        \t\t    color: white;\n        \t    }\n            }\n        }\n\n    }\n}\n\n.vlc-list-card {\n\tdisplay: block;\n\n\tdiv {\n\t\t//color: $light-blue;\n\t\ttext-transform: uppercase;\n\t\toverflow: hidden;\n\t\twhite-space: nowrap;\n\t\ttext-overflow: ellipsis;\n\t\tbackground: blue;\n\t\tpadding-left: 10px;\n\t\t\n\t\t.header{\n\n\t\t}\n\t\t.sub-data:first-child {\n            margin-left: 10px;\n\t\t}\n\t\t\n\t}\n\t\n\tul.actions {\n\t    padding: 0;\n\t    margin: 0 4px;\n\t    list-style: none;\n\t    float: right;\n\t    > li {\n\t        float: left;\n\t        > a>.icon:before {\n\t            font-size: 18px;\n\t        }\n\t    }\n\t}\n}",
                        "%vlocity_namespace%__Type__c": "Cards",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-list",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-member-list/%vlocity_namespace%__VlocityUITemplate__c/campaign-member-list"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-member-list",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-member-list",
            "VlocityDataPackName": "campaign-member-list",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": "/*** MIXINS ***/\n@media screen and (min-width: 30em) {\n  .campaign-member-log-actions {\n    transition: max-height .5s linear;\n    max-height: 2.7rem;\n    position: relative;\n    z-index: 5; }\n    .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped {\n      transition: max-height .5s linear;\n      max-height: 2.7rem; }\n    .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav {\n      position: relative;\n      border-radius: 0.25rem;\n      transition: all .5s linear;\n      background-color: #e4e8ee; }\n      .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav li.tabs-icon {\n        width: 2.5rem;\n        text-align: center; }\n        .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav li.tabs-icon .slds-icon_container {\n          line-height: 2.45rem; }\n          .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav li.tabs-icon .slds-icon_container .slds-icon {\n            fill: white;\n            position: relative;\n            top: -1px; }\n      .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item {\n        background-color: #f4f6f9;\n        margin-bottom: 0; }\n        .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item .slds-icon_container {\n          display: none; }\n        .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item .slds-tabs--scoped__link {\n          transition: all .15s linear;\n          border-left-color: #d8dde6;\n          border-right-color: #d8dde6; }\n        .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item:first-child {\n          border-top-left-radius: 0.25rem;\n          border-bottom-left-radius: 0.25rem; }\n        .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item.slds-active {\n          background-color: white; }\n          .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item.slds-active .slds-tabs--scoped__link {\n            height: calc(100% + 1px);\n            border-bottom: 1px solid white; }\n    .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__content {\n      position: relative;\n      transform: scaleY(0);\n      transform-origin: top;\n      transition: transform .4s linear;\n      transition-delay: .1s; }\n      .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__content:before {\n        position: absolute;\n        top: 0;\n        left: 0;\n        z-index: 1;\n        content: '';\n        display: block;\n        width: 100%;\n        height: 100%;\n        transition: opacity .5s linear;\n        opacity: 1;\n        visibility: visible;\n        background-color: white; }\n    .campaign-member-log-actions .member-log-actions-tabs .slds-form--stacked .slds-button--brand, .campaign-member-log-actions .member-log-actions-tabs .slds-form--stacked .slds-button--neutral {\n      min-width: 7rem; }\n    .campaign-member-log-actions.via-toggle-tabs-collapsed {\n      max-height: 2.7rem; }\n      .campaign-member-log-actions.via-toggle-tabs-collapsed .member-log-actions-tabs .slds-tabs--scoped {\n        max-height: 2.7rem; }\n      .campaign-member-log-actions.via-toggle-tabs-collapsed .member-log-actions-tabs .slds-tabs--scoped__content {\n        transform: scaleY(0); }\n        .campaign-member-log-actions.via-toggle-tabs-collapsed .member-log-actions-tabs .slds-tabs--scoped__content:before {\n          opacity: 1;\n          visibility: visible; }\n    .campaign-member-log-actions.via-toggle-tabs-expanded {\n      max-height: 35rem; }\n      .campaign-member-log-actions.via-toggle-tabs-expanded .member-log-actions-tabs .slds-tabs--scoped {\n        max-height: 35rem; }\n      .campaign-member-log-actions.via-toggle-tabs-expanded .member-log-actions-tabs .slds-tabs--scoped__nav {\n        border-bottom-left-radius: 0;\n        border-bottom-right-radius: 0; }\n        .campaign-member-log-actions.via-toggle-tabs-expanded .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item {\n          margin-bottom: -1px; }\n          .campaign-member-log-actions.via-toggle-tabs-expanded .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item:first-child {\n            border-bottom-left-radius: 0; }\n      .campaign-member-log-actions.via-toggle-tabs-expanded .member-log-actions-tabs .slds-tabs--scoped__content {\n        transform: scaleY(1); }\n        .campaign-member-log-actions.via-toggle-tabs-expanded .member-log-actions-tabs .slds-tabs--scoped__content:before {\n          opacity: 0;\n          visibility: hidden; }\n    .campaign-member-log-actions .slds-dropdown.slds-datepicker.timepicker .slds-button {\n      min-width: 2.5rem; }\n      .campaign-member-log-actions .slds-dropdown.slds-datepicker.timepicker .slds-button + .slds-button {\n        margin-left: 0; }\n    .campaign-member-log-actions .slds-dropdown.slds-datepicker.timepicker td .slds-day.slds-is-selected {\n      background: #005FB2;\n      color: #fff; } }\n\n@media screen and (max-width: 30em) {\n  .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav {\n    background-color: transparent;\n    border: none;\n    border-radius: 0;\n    display: block;\n    text-align: center;\n    width: 16.5rem;\n    margin: 0 auto; }\n    .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav:before, .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav:after {\n      content: \" \";\n      display: table; }\n    .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav:after {\n      clear: both; }\n    .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item {\n      float: left;\n      text-transform: none;\n      padding: 0.5rem;\n      border: 1px solid #d8dde6;\n      margin-right: 0.75rem;\n      margin-bottom: 0.75rem;\n      min-width: 5rem;\n      min-height: 5rem;\n      cursor: pointer;\n      letter-spacing: 0; }\n      .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item:hover, .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item:focus {\n        background-color: #f4f6f9; }\n      .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item:nth-child(3n+3) {\n        margin-right: 0; }\n      .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item .slds-icon_container {\n        width: 100%; }\n        .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item .slds-icon_container .slds-icon {\n          margin: 0 auto;\n          display: block; }\n      .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item .slds-tabs--scoped__link {\n        padding: 0;\n        border: none;\n        height: auto;\n        line-height: 1.2rem; }\n        .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item .slds-tabs--scoped__link:hover, .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__nav .slds-tabs--scoped__item .slds-tabs--scoped__link:focus {\n          border: none; }\n  .campaign-member-log-actions .member-log-actions-tabs .slds-tabs--scoped__content {\n    border: none;\n    border-radius: 0;\n    transition: none; }\n  .campaign-member-log-actions.via-toggle-tabs-collapsed .member-log-actions-tabs .slds-tabs--scoped__content {\n    display: none; }\n  .campaign-member-log-actions.via-toggle-tabs-expanded .member-log-actions-tabs .slds-tabs--scoped__nav {\n    display: none; } }\n",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-member-log-actions/1/Vlocity/1512540858779",
                        "%vlocity_namespace%__HTML__c": "<div ng-init=\"importedScope.createLogs(records)\">\n    <div class=\"campaign-member-log-actions slds-m-top--medium {{importedScope.toggleTabsClass}}\" ng-hide=\"importedScope.responsiveHelper.bpXMedium\">\n        <div class=\"member-log-actions-tabs\" slds-tabs slds-active-pane=\"importedScope.sldsActivePane\" template=\"SldsTabsScoped.tpl.html\">\n            <div ng-repeat=\"tab in $root.memberTabs\" data-title=\"{{tab.tabUI.title}}\" name=\"{{tab.tabUI.title}}\" data-icon=\"{{tab.tabUI.icon}}\" ng-include=\"tab.tabUI.template\" slds-pane class=\"slds-clearfix\"></div>\n        </div>\n    </div>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__SampleJson__c": "{\"data\":{\"actions\":[{\"displayName\":\"Like Action\",\"vlocityIcon\":\"icon-v-heart\"}],\"fields\":[{\"label\":\"Description\",\"name\":\"description\"},{\"label\":\"Cost\",\"name\":\"cost\",\"type\":\"currency\"}],\"title\":\"Card Title\"},\"obj\":{\"Id\":\"123456\",\"LastModifiedDate\":\"2016-08-15T18:05:08.464Z\",\"Name\":\"Object Name\",\"cost\":150,\"description\":\"Some description\"}}",
                        "%vlocity_namespace%__Sass__c": "@import 'campaign-variables';\n@import 'campaign-mixins';\n\n@media screen and (min-width: $bp-small) {\n    .campaign-member-log-actions {\n        transition: max-height .5s linear;\n        max-height: 2.7rem;\n        position: relative;\n        z-index: 5;\n\n        .member-log-actions-tabs {\n            .slds-tabs--scoped {\n                transition: max-height .5s linear;\n                max-height: 2.7rem;\n            }\n\n            .slds-tabs--scoped__nav {\n                position: relative;\n                border-radius: 0.25rem;\n                transition: all .5s linear;\n                background-color: lighten($cards-border-gray, 4%);\n\n                li.tabs-icon {\n                    width: 2.5rem;\n                    text-align: center;\n\n                    .slds-icon_container {\n                        line-height: 2.45rem;\n\n                        .slds-icon {\n                            fill: white;\n                            position: relative;\n                            top: -1px;\n                        }\n                    }\n                }\n\n                .slds-tabs--scoped__item {\n                    background-color: $cards-gray;\n                    margin-bottom: 0;\n\n                    .slds-icon_container {\n                        display: none;\n                    }\n\n                    .slds-tabs--scoped__link {\n                        transition: all .15s linear;\n                        border-left-color: $cards-border-gray;\n                        border-right-color: $cards-border-gray;\n                        // margin-bottom: -1px;\n                    }\n\n                    &:first-child {\n                        border-top-left-radius: 0.25rem;\n                        border-bottom-left-radius: 0.25rem;\n                    }\n\n                    &.slds-active {\n                        background-color: white;\n\n                        .slds-tabs--scoped__link {\n                            height: calc(100% + 1px);\n                            border-bottom: 1px solid white;\n                        }\n                    }\n                }\n            }\n            .slds-tabs--scoped__content {\n                position: relative;\n                transform: scaleY(0);\n                transform-origin: top;\n                transition: transform .4s linear;\n                transition-delay: .1s;\n                \n                &:before {\n                    position: absolute;\n                    top: 0;\n                    left: 0;\n                    z-index: 1;\n                    content: '';\n                    display: block;\n                    width: 100%;\n                    height: 100%;\n                    transition: opacity .5s linear;\n                    opacity: 1;\n                    visibility: visible;\n                    background-color: white;\n                }\n            }\n            .slds-form--stacked {\n                .slds-button--brand, .slds-button--neutral {\n                    min-width: 7rem;\n                }\n            }\n        }\n        &.via-toggle-tabs-collapsed {\n            max-height: 2.7rem;\n\n            .member-log-actions-tabs {\n                .slds-tabs--scoped {\n                    max-height: 2.7rem;\n                }\n\n                .slds-tabs--scoped__content {\n                    transform: scaleY(0);\n\n                    &:before {\n                        opacity: 1;\n                        visibility: visible;\n                    }\n                }\n            }\n        }\n\n        &.via-toggle-tabs-expanded {\n            max-height: 35rem;\n\n            .member-log-actions-tabs {\n                .slds-tabs--scoped {\n                    max-height: 35rem;\n                }\n\n                .slds-tabs--scoped__nav {\n                    border-bottom-left-radius: 0;\n                    border-bottom-right-radius: 0;\n\n                    .slds-tabs--scoped__item {\n                        margin-bottom: -1px;\n\n                        &:first-child {\n                            border-bottom-left-radius: 0;\n                        }\n                    }\n                }\n                .slds-tabs--scoped__content {\n                    transform: scaleY(1);\n\n                    &:before {\n                        opacity: 0;\n                        visibility: hidden;\n                    }\n                }\n            }\n        }\n\n        .slds-dropdown.slds-datepicker.timepicker {\n            .slds-button {\n                min-width: 2.5rem;\n\n                + .slds-button {\n                    margin-left: 0;\n                }\n            }\n            td {\n                .slds-day.slds-is-selected {\n                    background: $primary-medium;\n                    color: #fff;\n                }\n            }\n        }\n    }\n}\n\n@media screen and (max-width: $bp-small) {\n    .campaign-member-log-actions {\n        .member-log-actions-tabs {\n            .slds-tabs--scoped__nav {\n                @include clearfix;\n                background-color: transparent;\n                border: none;\n                border-radius: 0;\n                display: block;\n                text-align: center;\n                width: 16.5rem;\n                margin: 0 auto;\n\n                .slds-tabs--scoped__item {\n                    float: left;\n                    text-transform: none;\n                    padding: 0.5rem;\n                    border: 1px solid $cards-border-gray;\n                    margin-right: 0.75rem;\n                    margin-bottom: 0.75rem;\n                    min-width: 5rem;\n                    min-height: 5rem;\n                    cursor: pointer;\n                    letter-spacing: 0;\n\n                    &:hover, &:focus {\n                        background-color: $cards-gray;\n                    }\n\n                    &:nth-child(3n+3) {\n                        margin-right: 0;\n                    }\n\n                    .slds-icon_container {\n                        width: 100%;\n\n                        .slds-icon {\n                            margin: 0 auto;\n                            display: block;\n                        }\n                    }\n\n                    .slds-tabs--scoped__link {\n                        padding: 0;\n                        border: none;\n                        height: auto;\n                        line-height: 1.2rem;\n\n                        &:hover, &:focus {\n                            border: none;\n                        }\n                    }\n                }\n            }\n\n            .slds-tabs--scoped__content {\n                border: none;\n                border-radius: 0;\n                transition: none;\n            }\n        }\n\n        &.via-toggle-tabs-collapsed {\n            .member-log-actions-tabs {\n                .slds-tabs--scoped__content {\n                    display: none;\n                }\n            }\n        }\n\n        &.via-toggle-tabs-expanded {\n            .member-log-actions-tabs {\n                .slds-tabs--scoped__nav {\n                    display: none;\n                }\n            }\n        }\n    }\n}",
                        "%vlocity_namespace%__Type__c": "campaign-member-detail",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-log-actions",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-member-log-actions/%vlocity_namespace%__VlocityUITemplate__c/campaign-member-log-actions"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-member-log-actions",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-member-log-actions",
            "VlocityDataPackName": "campaign-member-log-actions",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-member-manager/1/Vlocity/1512540858781",
                        "%vlocity_namespace%__HTML__c": "<div class=\"slds-picklist--draggable slds-grid slds-align--absolute-center slds-m-top--x-small\">\n              <div class=\"slds-form-element\">\n                <span class=\"slds-form-element__label\" aria-label=\"select-1\">Add Campaign Members</span>\n                <i class=\"icon icon-v-filter\" ng-click=\"filter\"/>\n                <div class=\"slds-picklist picklist--multi\">\n                  <ul class=\"slds-picklist__options slds-picklist__options--multi\">\n                    <li draggable=\"true\" id=\"po-8-0\" class=\"slds-picklist__item\" aria-selected=\"false\" tabindex=\"0\" role=\"option\">\n                        {{obj}}\n                      <span class=\"slds-truncate\">Option One</span>\n                    </li>\n                  </ul>\n                </div>\n              </div>\n              <div class=\"slds-grid slds-grid--vertical\">\n                <button class=\"slds-button slds-button--icon-container\">\n                    <i class=\"icon icon-v-left-caret\"/>\n                  <span class=\"slds-assistive-text\">Arrow left</span>\n                </button>\n                <button class=\"slds-button slds-button--icon-container\">\n                    <i class=\"icon icon-v-right-caret\"/>\n                  <span class=\"slds-assistive-text\">Arrow right</span>\n                </button>\n              </div>\n              <div class=\"slds-form-element\">\n                <span class=\"slds-form-element__label\" aria-label=\"select-1\">Current Campaign Members</span>\n                <div class=\"slds-picklist picklist--multi\">\n                  <ul class=\"slds-picklist__options slds-picklist__options--multi\"></ul>\n                </div>\n              </div>\n              <div class=\"slds-grid slds-grid--vertical\">\n                <button class=\"slds-button slds-button--icon-container\">\n                    <i class=\"icon icon-v-up-caret\"/>\n                  <span class=\"slds-assistive-text\">Arrow up</span>\n                </button>\n                <button class=\"slds-button slds-button--icon-container\">\n                    <i class=\"icon-v-down-caret\"/>\n                  <span class=\"slds-assistive-text\">Arrow down</span>\n                </button>\n              </div>\n            </div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__SampleJson__c": "{\"data\":{\"actions\":[{\"displayName\":\"Like Action\",\"vlocityIcon\":\"icon-v-heart\"}],\"fields\":[{\"label\":\"Description\",\"name\":\"description\"},{\"label\":\"Cost\",\"name\":\"cost\",\"type\":\"currency\"}],\"title\":\"Card Title\"},\"obj\":{\"Id\":\"123456\",\"LastModifiedDate\":\"2016-07-18T21:00:42.346Z\",\"Name\":\"Object Name\",\"cost\":150,\"description\":\"Some description\"}}",
                        "%vlocity_namespace%__Type__c": "Cards",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-manager",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-member-manager/%vlocity_namespace%__VlocityUITemplate__c/campaign-member-manager"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-member-manager",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-member-manager",
            "VlocityDataPackName": "campaign-member-manager",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": "/*** MIXINS ***/\n.campaign-member-stories {\n  position: relative;\n  min-height: 15rem; }\n  .campaign-member-stories .via-slds-story-cards--header-title {\n    position: relative; }\n  .campaign-member-stories .via-slds-feed-item:last-child .slds-media--timeline:before {\n    display: none; }\n  @media screen and (max-width: 44em) {\n    .campaign-member-stories .via-slds-story-cards--header.slds-theme--shade {\n      border-top: 1px solid #d8dde6;\n      border-bottom: 1px solid #d8dde6;\n      background-color: #f4f6f9; }\n    .campaign-member-stories .via-slds-feed-item > .slds-media {\n      position: relative; }\n      .campaign-member-stories .via-slds-feed-item > .slds-media > .slds-media__body {\n        width: 100%; }\n        .campaign-member-stories .via-slds-feed-item > .slds-media > .slds-media__body > .slds-media > .slds-media__body > .slds-truncate {\n          max-width: 42%; }\n          .campaign-member-stories .via-slds-feed-item > .slds-media > .slds-media__body > .slds-media > .slds-media__body > .slds-truncate + .slds-truncate {\n            max-width: 100%; }\n      .campaign-member-stories .via-slds-feed-item > .slds-media > .slds-media__figure {\n        position: absolute;\n        top: 0;\n        right: 0; } }\n",
                        "%vlocity_namespace%__CustomJavascript__c": "vlocity.cardframework.registerModule\n    .controller('viaStoryCardCanvasController',\n                ['$scope', '$timeout', '$interval', '$filter', '$rootScope',\n                    function($scope, $timeout, $interval, $filter, $rootScope) {\n        var self = this;\n        this.isOpen = false;\n        this.search = null;\n        this.filters = {\n            'All': null\n        };\n        this.searchComplete = false;\n        var shouldDefer = false;\n        this.filteredCards = [];\n\n        this.isSelected = function(card) {\n            if (!card) {\n                return !this.search;\n            }\n            return this.search && this.search.title == card.title;\n        };\n\n        this.changeFilter = function(card) {\n            this.search = card;\n            this.title = !card ? 'Customer Story' : card.title;\n            this.isOpen = false;\n            $scope.filteredCards = $filter('orderBy')($filter('filter')($scope.cards, self.filterStories), '-obj.LastActivityDate');\n        };\n\n        this.filterStories = function(value, index, array) {\n            if (!self.search) {\n                return true;\n            }\n            return !!(value.obj && checkFilter(value.obj, self.search.filter));\n        };\n\n        function checkFilter(sObject, filterObject) {\n            var success = true;\n            if (sObject) {\n                if (Object.keys(sObject).length == 0) {\n                    success = false;\n                    return success;\n                }\n                for (var field in filterObject) {\n                    if (typeof sObject[field] === 'object') {\n                        success = checkFilter(sObject[field], filterObject[field]);\n                    } else {\n                        var objField = _.get(sObject, field);\n                        success = filterObject[field] == objField; //TODO: add other logical operators\n                    }\n                    if (!success) {\n                        return success;\n                    }\n                }\n            } else {\n                success = false;\n                return success;\n            }\n            return success;\n        };\n\n        $scope.$watch(function() {\n            return $scope.records ? $scope.records.length : 0;\n        }, function() {\n            if ($scope.records) {\n                self.searchComplete = false;\n                loadingSpinner.show();\n                $scope.cards.forEach(function(card) {\n                    self.filters[card.title] = card;\n                });\n                if (!hasUpdatedDataSource) {\n                    shouldDefer = true;\n                }\n            }\n        });\n\n        $scope.$watch(function() {\n            return $scope.cards ? $scope.cards.length : 0;\n        }, function(newLength) {\n            $scope.filteredCards = $filter('orderBy')($filter('filter')($scope.cards, self.filterStories), '-obj.LastActivityDate');\n        });\n\n        $scope.$on('reloadLayout', function(event, layoutName) {\n            if (layoutName && layoutName === $scope.layoutName) {\n                hasUpdatedDataSource = false;\n            }\n        });\n\n        $rootScope.$on('vlocity.layout.campaign-member-stories.events', function() {\n            loadingSpinner.show();\n        });\n\n        var loadingSpinner = $('.loading-row[data-name=\"' + $scope.layoutName +'\"]');\n        var intervalHolder = $interval(function() {\n            if (!$scope.records) {\n                return;\n            }\n            if (loadingSpinner.length == 0) {\n                loadingSpinner = $('.loading-row[data-name=\"' + $scope.layoutName +'\"]');\n            }\n            if (loadingSpinner.length > 0 && loadingSpinner.get(0).style.display != 'none') {\n                var boundingClientRect = loadingSpinner[0].getBoundingClientRect();\n                var elemTop = boundingClientRect.top;\n\n                var isVisible = (elemTop >= 0) && (elemTop <= window.innerHeight);\n                if (isVisible) {\n                    getRemainingItems($scope.records[$scope.records.length - 1]);\n                }\n            }\n        }, 500);\n        $scope.layoutName[$scope.layoutName] = intervalHolder;\n\n        $scope.$on(\"$destroy\", function() {\n            $interval.cancel(intervalHolder);\n        });\n\n        this.changeFilter(null);\n\n        var hasUpdatedDataSource = false,\n            currentRequestLastObj = null;\n        function getRemainingItems(lastObj) {\n            if (lastObj) {\n                if (currentRequestLastObj == lastObj.Id) {\n                    loadingSpinner.hide();\n                    return;\n                }\n                var originalEndpoint = $scope.data.dataSource.value.endpoint;\n                if (/lastObjId=[^&]+/.test($scope.data.dataSource.value.endpoint)) {\n                    $scope.data.dataSource.value.endpoint = $scope.data.dataSource.value.endpoint.replace(/lastObjId=[^&]+/, 'lastObjId={{lastObjId}}');\n                } else {\n                    $scope.data.dataSource.value.endpoint = $scope.data.dataSource.value.endpoint +\n                                                                (/\\?/.test($scope.data.dataSource.value.endpoint) ? '&' : '?') +\n                                                                        'lastObjId={{lastObjId}}&lastActivityDate={{lastActivityDate}}';\n                }\n                $scope.updateDatasource(\n                    {\n                        lastObjId: lastObj.Id,\n                        lastActivityDate: lastObj.longLastActivityDate\n                    },\n                    true,\n                    false,\n                    true\n                ).then(function(records) {\n                    if (!records[records.length -1] || records[records.length -1].Id === currentRequestLastObj) {\n                        // hide spinner since we didn't load anything new\n                        loadingSpinner.hide();\n                        self.searchComplete = true;\n                    }\n                });\n                $scope.data.dataSource.value.endpoint = originalEndpoint;\n                currentRequestLastObj = lastObj.Id;\n                hasUpdatedDataSource = true;\n            } else {\n                loadingSpinner.hide();\n                self.searchComplete = true;\n            }\n        };\n\n    }]);",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-member-stories/1/Vlocity/1512540858786",
                        "%vlocity_namespace%__HTML__c": "<div class=\"via-slds\" ng-controller=\"viaStoryCardCanvasController as storyCardController\">\n  <div class=\"via-slds-story-cards--canvas  slds-grid slds-grid--vertical slds-grid--vertical-stretch \">\n    <div class=\"slds-grid slds-p-around--small slds-wrap via-slds-story-cards--header\" vloc-sticky-top>\n      <div class=\"slds-p-right--x-small via-slds-story-cards--header-title\">\n        <div class=\"slds-text-heading--medium\">{{storyCardController.title}}</div>\n      </div>\n      <div class=\"slds-col--bump-left slds-p-left--x-small via-slds-story-cards--header-title\" ng-if=\"cards.length > 0\"\n          ng-init=\"storyCardController.isOpen = false\">\n          <div class=\"slds-dropdown-trigger slds-dropdown-trigger--click\" ng-class=\"{'slds-is-open': storyCardController.isOpen}\" aria-expanded=\"true\">\n            <button class=\"slds-button slds-button--icon-border-filled slds-button--icon-x-small\" aria-haspopup=\"true\" ng-click=\"storyCardController.isOpen = !storyCardController.isOpen\">\n              <slds-button-svg-icon size=\"'small'\" sprite=\"'utility'\" icon=\"'down'\"></slds-button-svg-icon>\n              <span class=\"slds-assistive-text\">Show More</span>\n            </button>\n            <div class=\"slds-dropdown slds-dropdown--right slds-dropdown--actions\">\n              <ul class=\"dropdown__list\" role=\"menu\">\n                <li class=\"slds-dropdown__item\" ng-class=\"{'slds-is-selected': storyCardController.isSelected(card)}\" ng-repeat=\"(title, card) in storyCardController.filters\">\n                  <a role=\"menuitem\"\n                      href=\"javascript:void(0)\"\n                      ng-click=\"storyCardController.changeFilter(card)\">\n                    <p class=\"slds-truncate\">\n                      <slds-svg-icon size=\"'x-small'\" extra-classes=\"'slds-icon--selected slds-m-right--x-small'\" sprite=\"'utility'\" icon=\"'check'\"></slds-svg-icon>\n                      {{title}}\n                    </p>\n                  </a>\n                </li>\n              </ul>\n            </div>\n          </div>\n      </div>\n    </div>\n    <ul class=\"slds-p-around--small slds-col\">\n      <li ng-repeat=\"card in filteredCards | orderBy:'-obj.LastActivityDate'\">\n        <vloc-card ng-model=\"card\" data=\"card\" records=\"records\" index=\"{{$index}}\" session-id=\"{{sessionId}}\"></vloc-card>\n      </li>\n      <li class=\"via-slds-story-cards--no-results slds-align--absolute-center slds-text-align--center slds-p-top--large\" ng-if=\"filteredCards.length == 0 && storyCardController.searchComplete\">\n            <div>\n                <slds-svg-icon sprite=\"'utility'\" icon=\"'info'\"\n                                size=\"'large'\"></slds-svg-icon>\n                <p class=\"slds-m-top--small slds-text-heading--medium\">No Results Found</p>\n            </div>\n        </li>\n    </ul>\n    <div style=\"position: relative; height: 30px; margin-bottom: 10px\" class=\"loading-row\" data-name=\"{{layoutName}}\">\n      <div class=\"slds-spinner_container\" style=\"z-index: 5\">\n        <div class=\"slds-spinner--brand slds-spinner slds-spinner--small\" aria-hidden=\"false\" role=\"alert\">\n            <div class=\"slds-spinner__dot-a\"></div>\n            <div class=\"slds-spinner__dot-b\"></div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Sass__c": "@import \"campaign-variables\";\n@import \"campaign-mixins\";\n\n.campaign-member-stories {\n    position: relative;\n    min-height: 15rem;\n\n    .via-slds-story-cards--header-title {\n            position: relative;\n    }\n\n    .via-slds-feed-item:last-child {\n        .slds-media--timeline:before {\n            display: none;\n        }\n    }\n\n    @media screen and (max-width: $bp-xmedium) {\n        .via-slds-story-cards--header.slds-theme--shade {\n            border-top: 1px solid $cards-border-gray;\n            border-bottom: 1px solid $cards-border-gray;\n            background-color: $cards-gray;\n        }\n        .via-slds-feed-item {\n            &> .slds-media {\n                position: relative;\n\n                &> .slds-media__body {\n                    width: 100%;\n\n                    &> .slds-media > .slds-media__body > .slds-truncate {\n                        max-width: 42%;\n\n                        &+ .slds-truncate {\n                            max-width: 100%;\n                        }\n                    }\n                }\n\n                &> .slds-media__figure {\n                    position: absolute;\n                    top: 0;\n                    right: 0;\n                }\n            }\n        }\n    }\n}",
                        "%vlocity_namespace%__Type__c": "campaign-member-detail",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-stories",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-member-stories/%vlocity_namespace%__VlocityUITemplate__c/campaign-member-stories"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-member-stories",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-member-stories",
            "VlocityDataPackName": "campaign-member-stories",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": ".via-slds .slds-timeline__media--custom-custom1:before {\n  background: #ff7b84; }\n\n.via-slds .slds-timeline__media--custom-custom2:before {\n  background: #cfd05c; }\n\n.via-slds .slds-timeline__media--custom-custom3:before {\n  background: #ecb46c; }\n\n.via-slds .slds-timeline__media--custom-custom4:before {\n  background: #e1d951; }\n\n.via-slds .slds-timeline__media--custom-custom5:before {\n  background: #9fdb66; }\n\n.via-slds .slds-timeline__media--custom-custom6:before {\n  background: #54c473; }\n\n.via-slds .slds-timeline__media--custom-custom7:before {\n  background: #6a89e5; }\n\n.via-slds .slds-timeline__media--custom-custom8:before {\n  background: #50ceb9; }\n\n.via-slds .slds-timeline__media--custom-custom9:before {\n  background: #6b9ee2; }\n\n.via-slds .slds-timeline__media--custom-custom10:before {\n  background: #6488e3; }\n\n.via-slds .slds-timeline__media--custom-custom11:before {\n  background: #8784ea; }\n\n.via-slds .slds-timeline__media--custom-custom12:before {\n  background: #dc71d1; }\n\n.via-slds .slds-timeline__media--custom-custom13:before {\n  background: #df6184; }\n\n.via-slds .slds-timeline__media--custom-custom14:before {\n  background: #3cc2b3; }\n\n.via-slds .slds-timeline__media--custom-custom15:before {\n  background: #f77e75; }\n\n.via-slds .slds-timeline__media--custom-custom16:before {\n  background: #e9af67; }\n\n.via-slds .slds-timeline__media--custom-custom17:before {\n  background: #acd360; }\n\n.via-slds .slds-timeline__media--custom-custom18:before {\n  background: #4dca76; }\n\n.via-slds .slds-timeline__media--custom-custom19:before {\n  background: #3abeb1; }\n\n.via-slds .slds-timeline__media--custom-custom20:before {\n  background: #48c7c8; }\n\n.via-slds .slds-timeline__media--custom-custom21:before {\n  background: #8a7aed; }\n\n.via-slds .slds-timeline__media--custom-custom22:before {\n  background: #8b85f9; }\n\n.via-slds .slds-timeline__media--custom-custom23:before {\n  background: #b070e6; }\n\n.via-slds .slds-timeline__media--custom-custom24:before {\n  background: #e56798; }\n\n.via-slds .slds-timeline__media--custom-custom25:before {\n  background: #e46fbe; }\n\n.via-slds .slds-timeline__media--custom-custom26:before {\n  background: #7698f0; }\n\n.via-slds .slds-timeline__media--custom-custom27:before {\n  background: #5ab0d2; }\n\n.via-slds .slds-timeline__media--custom-custom28:before {\n  background: #89c059; }\n\n.via-slds .slds-timeline__media--custom-custom29:before {\n  background: #bdd25f; }\n\n.via-slds .slds-timeline__media--custom-custom30:before {\n  background: #f59f71; }\n\n.via-slds .slds-timeline__media--custom-custom31:before {\n  background: #eb687f; }\n\n.via-slds .slds-timeline__media--custom-custom32:before {\n  background: #38c393; }\n\n.via-slds .slds-timeline__media--custom-custom33:before {\n  background: #97cf5d; }\n\n.via-slds .slds-timeline__media--custom-custom34:before {\n  background: #d58a6a; }\n\n.via-slds .slds-timeline__media--custom-custom35:before {\n  background: #e9637e; }\n\n.via-slds .slds-timeline__media--custom-custom36:before {\n  background: #d472d4; }\n\n.via-slds .slds-timeline__media--custom-custom37:before {\n  background: #8c89f2; }\n\n.via-slds .slds-timeline__media--custom-custom38:before {\n  background: #53b6d7; }\n\n.via-slds .slds-timeline__media--custom-custom39:before {\n  background: #4fbe75; }\n\n.via-slds .slds-timeline__media--custom-custom40:before {\n  background: #83c75e; }\n\n.via-slds .slds-timeline__media--custom-custom41:before {\n  background: #43b5b5; }\n\n.via-slds .slds-timeline__media--custom-custom42:before {\n  background: #cfd05b; }\n\n.via-slds .slds-timeline__media--custom-custom43:before {\n  background: #7f93f9; }\n\n.via-slds .slds-timeline__media--custom-custom44:before {\n  background: #c8ca58; }\n\n.via-slds .slds-timeline__media--custom-custom45:before {\n  background: #d95879; }\n\n.via-slds .slds-timeline__media--custom-custom46:before {\n  background: #67a5e7; }\n\n.via-slds .slds-timeline__media--custom-custom47:before {\n  background: #5fcc64; }\n\n.via-slds .slds-timeline__media--custom-custom48:before {\n  background: #ef697f; }\n\n.via-slds .slds-timeline__media--custom-custom49:before {\n  background: #e25c80; }\n\n.via-slds .slds-timeline__media--custom-custom50:before {\n  background: #49bcd3; }\n\n.via-slds .slds-timeline__media--custom-custom51:before {\n  background: #d8c760; }\n\n.via-slds .slds-timeline__media--custom-custom52:before {\n  background: #ee8e6f; }\n\n.via-slds .slds-timeline__media--custom-custom53:before {\n  background: #f36e83; }\n\n.via-slds .slds-timeline__media--custom-custom54:before {\n  background: #ea70b1; }\n\n.via-slds .slds-timeline__media--custom-custom55:before {\n  background: #d66ee0; }\n\n.via-slds .slds-timeline__media--custom-custom56:before {\n  background: #718deb; }\n\n.via-slds .slds-timeline__media--custom-custom57:before {\n  background: #5a9cdd; }\n\n.via-slds .slds-timeline__media--custom-custom58:before {\n  background: #34b59d; }\n\n.via-slds .slds-timeline__media--custom-custom59:before {\n  background: #e3d067; }\n\n.via-slds .slds-timeline__media--custom-custom60:before {\n  background: #bf5a88; }\n\n.via-slds .slds-timeline__media--custom-custom61:before {\n  background: #f57376; }\n\n.via-slds .slds-timeline__media--custom-custom62:before {\n  background: #6b92dc; }\n\n.via-slds .slds-timeline__media--custom-custom63:before {\n  background: #7ccf60; }\n\n.via-slds .slds-timeline__media--custom-custom64:before {\n  background: #618fd8; }\n\n.via-slds .slds-timeline__media--custom-custom65:before {\n  background: #f279ab; }\n\n.via-slds .slds-timeline__media--custom-custom66:before {\n  background: #d8be5f; }\n\n.via-slds .slds-timeline__media--custom-custom67:before {\n  background: #f87d76; }\n\n.via-slds .slds-timeline__media--custom-custom68:before {\n  background: #f26979; }\n\n.via-slds .slds-timeline__media--custom-custom69:before {\n  background: #ed6387; }\n\n.via-slds .slds-timeline__media--custom-custom70:before {\n  background: #e769b4; }\n\n.via-slds .slds-timeline__media--custom-custom71:before {\n  background: #e36ee3; }\n\n.via-slds .slds-timeline__media--custom-custom72:before {\n  background: #8d9bfb; }\n\n.via-slds .slds-timeline__media--custom-custom73:before {\n  background: #679ef0; }\n\n.via-slds .slds-timeline__media--custom-custom74:before {\n  background: #41c8a0; }\n\n.via-slds .slds-timeline__media--custom-custom75:before {\n  background: #cd9f65; }\n\n.via-slds .slds-timeline__media--custom-custom76:before {\n  background: #db6d7a; }\n\n.via-slds .slds-timeline__media--custom-custom77:before {\n  background: #b55d5b; }\n\n.via-slds .slds-timeline__media--custom-custom78:before {\n  background: #5a95dd; }\n\n.via-slds .slds-timeline__media--custom-custom79:before {\n  background: #8ed363; }\n\n.via-slds .slds-timeline__media--custom-custom80:before {\n  background: #659ad5; }\n\n.via-slds .slds-timeline__media--custom-custom81:before {\n  background: #da627f; }\n\n.via-slds .slds-timeline__media--custom-custom82:before {\n  background: #d15b97; }\n\n.via-slds .slds-timeline__media--custom-custom83:before {\n  background: #e7806f; }\n\n.via-slds .slds-timeline__media--custom-custom84:before {\n  background: #f6707b; }\n\n.via-slds .slds-timeline__media--custom-custom85:before {\n  background: #f26891; }\n\n.via-slds .slds-timeline__media--custom-custom86:before {\n  background: #e260ab; }\n\n.via-slds .slds-timeline__media--custom-custom87:before {\n  background: #d876e5; }\n\n.via-slds .slds-timeline__media--custom-custom88:before {\n  background: #996fe6; }\n\n.via-slds .slds-timeline__media--custom-custom89:before {\n  background: #3e99be; }\n\n.via-slds .slds-timeline__media--custom-custom90:before {\n  background: #22a48a; }\n\n.via-slds .slds-timeline__media--custom-custom91:before {\n  background: #bf7b66; }\n\n.via-slds .slds-timeline__media--custom-custom92:before {\n  background: #517e82; }\n\n.via-slds .slds-timeline__media--custom-custom93:before {\n  background: #904d4c; }\n\n.via-slds .slds-timeline__media--custom-custom94:before {\n  background: #439cba; }\n\n.via-slds .slds-timeline__media--custom-custom95:before {\n  background: #8bcf6a; }\n\n.via-slds .slds-timeline__media--custom-custom96:before {\n  background: #6d9de3; }\n\n.via-slds .slds-timeline__media--custom-custom97:before {\n  background: #dd6085; }\n\n.via-slds .slds-timeline__media--custom-custom98:before {\n  background: #e1be5c; }\n\n.via-slds .slds-timeline__media--custom-custom99:before {\n  background: #f0856e; }\n\n.via-slds .slds-timeline__media--custom-custom100:before {\n  background: #e15d76; }\n\n.via-slds .slds-timeline__media--standard-log-a-call:before {\n  background: #48c3cc; }\n\n.via-slds .slds-timeline__media--standard-document:before {\n  background: #baac93; }\n\n.via-slds .slds-timeline__media--standard-environment-hub:before {\n  background: #54698d; }\n\n.via-slds .slds-timeline__media--standard-flow:before {\n  background: #54698d; }\n\n.via-slds .slds-timeline__media--standard-sossession:before {\n  background: #54698d; }\n\n.via-slds .slds-timeline__media--standard-process:before {\n  background: #54698d; }\n\n.via-slds .slds-timeline__media--standard-news:before {\n  background: #7f8de1; }\n\n.via-slds .slds-timeline__media--standard-home:before {\n  background: #ef7ead; }\n\n.via-slds .slds-timeline__media--standard-account:before {\n  background: #7f8de1; }\n\n.via-slds .slds-timeline__media--standard-apps-admin:before {\n  background: #9895ee; }\n\n.via-slds .slds-timeline__media--standard-announcement:before {\n  background: #62b7ed; }\n\n.via-slds .slds-timeline__media--standard-person-account:before {\n  background: #7f8de1; }\n\n.via-slds .slds-timeline__media--standard-social:before {\n  background: #ea74a2; }\n\n.via-slds .slds-timeline__media--standard-campaign-members:before {\n  background: #f49756; }\n\n.via-slds .slds-timeline__media--standard-article:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-answer-public:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-answer-private:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-answer-best:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-avatar-loading:before {\n  background: #b8c3ce; }\n\n.via-slds .slds-timeline__media--standard-campaign:before {\n  background: #f49756; }\n\n.via-slds .slds-timeline__media--standard-calibration:before {\n  background: #47cfd2; }\n\n.via-slds .slds-timeline__media--standard-avatar:before {\n  background: #62b7ed; }\n\n.via-slds .slds-timeline__media--standard-approval:before {\n  background: #50cc7a; }\n\n.via-slds .slds-timeline__media--standard-apps:before {\n  background: #3c97dd; }\n\n.via-slds .slds-timeline__media--standard-user:before {\n  background: #34becd; }\n\n.via-slds .slds-timeline__media--standard-evernote:before {\n  background: #86c86f; }\n\n.via-slds .slds-timeline__media--standard-coaching:before {\n  background: #f67594; }\n\n.via-slds .slds-timeline__media--standard-connected-apps:before {\n  background: #9895ee; }\n\n.via-slds .slds-timeline__media--standard-drafts:before {\n  background: #6ca1e9; }\n\n.via-slds .slds-timeline__media--standard-email:before {\n  background: #95aec5; }\n\n.via-slds .slds-timeline__media--standard-email-iq:before {\n  background: #a094ed; }\n\n.via-slds .slds-timeline__media--standard-endorsement:before {\n  background: #8b9ae3; }\n\n.via-slds .slds-timeline__media--standard-event:before {\n  background: #eb7092; }\n\n.via-slds .slds-timeline__media--standard-dropbox:before {\n  background: #52aef9; }\n\n.via-slds .slds-timeline__media--standard-concur:before {\n  background: #4cc3c7; }\n\n.via-slds .slds-timeline__media--standard-email-chatter:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-case-transcript:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-case-email:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-case-log-a-call:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-case-comment:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-case-change-status:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-work-order:before {\n  background: #50e3c2; }\n\n.via-slds .slds-timeline__media--standard-work-order-item:before {\n  background: #33a8dc; }\n\n.via-slds .slds-timeline__media--standard-client:before {\n  background: #00d2be; }\n\n.via-slds .slds-timeline__media--standard-contract:before {\n  background: #6ec06e; }\n\n.via-slds .slds-timeline__media--standard-dashboard:before {\n  background: #ef6e64; }\n\n.via-slds .slds-timeline__media--standard-case:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-empty:before {\n  background: #8199af; }\n\n.via-slds .slds-timeline__media--standard-default:before {\n  background: #8199af; }\n\n.via-slds .slds-timeline__media--standard-custom:before {\n  background: #8199af; }\n\n.via-slds .slds-timeline__media--standard-canvas:before {\n  background: #8199af; }\n\n.via-slds .slds-timeline__media--standard-contact:before {\n  background: #a094ed; }\n\n.via-slds .slds-timeline__media--standard-portal:before {\n  background: #aec770; }\n\n.via-slds .slds-timeline__media--standard-product:before {\n  background: #b781d3; }\n\n.via-slds .slds-timeline__media--standard-pricebook:before {\n  background: #b781d3; }\n\n.via-slds .slds-timeline__media--standard-feed:before {\n  background: #62b7ed; }\n\n.via-slds .slds-timeline__media--standard-feedback:before {\n  background: #6da1ea; }\n\n.via-slds .slds-timeline__media--standard-file:before {\n  background: #baac93; }\n\n.via-slds .slds-timeline__media--standard-goals:before {\n  background: #56aadf; }\n\n.via-slds .slds-timeline__media--standard-groups:before {\n  background: #779ef2; }\n\n.via-slds .slds-timeline__media--standard-household:before {\n  background: #00afa0; }\n\n.via-slds .slds-timeline__media--standard-hierarchy:before {\n  background: #34becd; }\n\n.via-slds .slds-timeline__media--standard-insights:before {\n  background: #ec94ed; }\n\n.via-slds .slds-timeline__media--standard-investment-account:before {\n  background: #4bc076; }\n\n.via-slds .slds-timeline__media--standard-performance:before {\n  background: #f8b156; }\n\n.via-slds .slds-timeline__media--standard-link:before {\n  background: #7a9ae6; }\n\n.via-slds .slds-timeline__media--standard-metrics:before {\n  background: #56aadf; }\n\n.via-slds .slds-timeline__media--standard-note:before {\n  background: #e6d478; }\n\n.via-slds .slds-timeline__media--standard-lead:before {\n  background: #f88962; }\n\n.via-slds .slds-timeline__media--standard-opportunity:before {\n  background: #fcb95b; }\n\n.via-slds .slds-timeline__media--standard-call:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-call-history:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-orders:before {\n  background: #769ed9; }\n\n.via-slds .slds-timeline__media--standard-post:before {\n  background: #65cae4; }\n\n.via-slds .slds-timeline__media--standard-poll:before {\n  background: #699be1; }\n\n.via-slds .slds-timeline__media--standard-photo:before {\n  background: #d7d1d1; }\n\n.via-slds .slds-timeline__media--standard-people:before {\n  background: #34becd; }\n\n.via-slds .slds-timeline__media--standard-generic-loading:before {\n  background: #b8c3ce; }\n\n.via-slds .slds-timeline__media--standard-group-loading:before {\n  background: #b8c3ce; }\n\n.via-slds .slds-timeline__media--standard-recent:before {\n  background: #6ca1e9; }\n\n.via-slds .slds-timeline__media--standard-solution:before {\n  background: #8fc972; }\n\n.via-slds .slds-timeline__media--standard-record:before {\n  background: #7dc37d; }\n\n.via-slds .slds-timeline__media--standard-question-best:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-question-feed:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-related-list:before {\n  background: #59bcab; }\n\n.via-slds .slds-timeline__media--standard-skill-entity:before {\n  background: #8b9ae3; }\n\n.via-slds .slds-timeline__media--standard-scan-card:before {\n  background: #f39e58; }\n\n.via-slds .slds-timeline__media--standard-report:before {\n  background: #2ecbbe; }\n\n.via-slds .slds-timeline__media--standard-quotes:before {\n  background: #88c651; }\n\n.via-slds .slds-timeline__media--standard-task:before {\n  background: #4bc076; }\n\n.via-slds .slds-timeline__media--standard-task-2:before {\n  background: #4bc076; }\n\n.via-slds .slds-timeline__media--standard-team-member:before {\n  background: #f2cf5b; }\n\n.via-slds .slds-timeline__media--standard-thanks:before {\n  background: #e9696e; }\n\n.via-slds .slds-timeline__media--standard-reward:before {\n  background: #e9696e; }\n\n.via-slds .slds-timeline__media--standard-thanks-loading:before {\n  background: #b8c3ce; }\n\n.via-slds .slds-timeline__media--standard-today:before {\n  background: #ef7ead; }\n\n.via-slds .slds-timeline__media--standard-topic:before {\n  background: #56aadf; }\n\n.via-slds .slds-timeline__media--standard-unmatched:before {\n  background: #62b7ed; }\n\n.via-slds .slds-timeline__media--standard-marketing-actions:before {\n  background: #6bbd6e; }\n\n.via-slds .slds-timeline__media--standard-relationship:before {\n  background: #3c97dd; }\n\n.via-slds .slds-timeline__media--standard-folder:before {\n  background: #8b9ae3; }\n",
                        "%vlocity_namespace%__CustomJavascript__c": "vlocity.cardframework.registerModule\n    .controller('viaTaskController',\n                ['$scope','force', '$rootScope', '$filter', function($scope, force, $rootScope, $filter) {\n\n        $scope.updateTask = function(id, value, obj) {\n            obj.loading = true;\n            force.update('task', {Id: id, Status: value})\n                .then(\n                function(response) {\n                    delete obj.loading;\n                },\n                function(error) {\n                    alert('Task could not be updated due to server error');\n                    delete obj.loading;\n                }\n            );\n        };\n\n        $scope.openStory = function(obj) {\n            var toBeLaunchedUrl = obj.navigateLink || ('/' + obj.Id)\n            $scope.performAction({\n                type: 'Custom',\n                isCustomAction: true,\n                url: toBeLaunchedUrl\n            });\n        };\n\n    }]);",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-member-story-card/1/Vlocity/1512540858789",
                        "%vlocity_namespace%__HTML__c": "<span class=\"slds-assistive-text\">{{obj.objType}}</span>\n<div class=\"slds-media\"  ng-controller=\"viaTaskController\">\n  <div class=\"slds-media__body\" ng-init=\"cardIcon = $root.cardIconFactory(obj.objAPIName + ' ' + obj.title)\">\n    <div class=\"slds-media slds-media--timeline slds-timeline__media--{{cardIcon.sprite}}-{{cardIcon.icon}}\">\n      <div class=\"slds-media__figure slds-timeline__icon\">\n        <div class=\"slds-icon_container\">\n            <vloc-card-icon data=\"data\" obj=\"obj\" size=\"'small'\" ng-if=\"data.sprite && data.icon\"></vloc-card-icon>\n            <slds-svg-icon sprite=\"cardIcon.sprite\" icon=\"cardIcon.icon\" size=\"'small'\" extra-classes=\"'slds-icon-' + cardIcon.sprite + '-' + cardIcon.icon\" no-hint=\"true\"\n              ng-if=\"!data.sprite || !data.icon\"></slds-svg-icon>\n        </div>\n      </div>\n      <div class=\"slds-media__body\">\n        <div ng-class=\"{'slds-media': obj.objAPIName == 'Task'}\">\n          <div class=\"slds-media__figure\" ng-if=\"obj.objAPIName == 'Task'\">\n            <label class=\"slds-checkbox\">\n              <slds-svg-icon sprite=\"'utility'\" icon=\"'spinner'\" size=\"'x-small'\" ng-if=\"obj.loading\"></slds-svg-icon>\n              <input name=\"checkbox\" type=\"checkbox\" ng-model=\"obj.highlight\" ng-true-value=\"'Completed'\" ng-false-value=\"'Not Started'\" ng-change=\"updateTask(obj.Id, obj.highlight, obj)\" ng-if=\"!obj.loading\"  />\n              <span class=\"slds-checkbox--faux\" ng-if=\"!obj.loading\" ></span>\n              <span class=\"slds-form-element__label slds-assistive-text\" ng-if=\"!obj.loading\" >mark-complete</span>\n            </label>\n          </div>\n          <div ng-class=\"{'slds-media__body': obj.objAPIName == 'Task'}\">\n            <p class=\"slds-truncate\" title=\"{{obj.title}}\">\n                <a href=\"javascript:void(0);\" ng-click=\"performAction(data.actions[0])\" ng-if=\"data.actions.length > 0\">{{obj.title}}</a>\n                <a ng-click=\"openStory(obj)\" ng-if=\"!data.actions || data.actions.length == 0\">{{obj.title}}</a>\n            </p>\n            <p class=\"slds-truncate\" ng-repeat=\"detailField in obj.detailFieldList\" ng-if=\"obj.detailValueMap.TaskSubtype !== 'Email' && detailField.toLowerCase() !== 'isalldayevent'\">{{obj.detailValueMap[detailField]}}</p>\n            <ul class=\"slds-list--horizontal slds-wrap\">\n              <li class=\"slds-m-right--large\" ng-repeat=\"field in data.fields\" ng-show=\"key != 'attributes' && (obj[field.relationshipTypeField] || field.label) && (obj | getter: field)\">\n                <span class=\"tile__label slds-text-heading--label-normal\">{{obj[field.relationshipTypeField] || field.label}}:</span>\n                <span class=\"slds-text-body--small\" ng-if=\"field.relationshipType !== '_sobjects'\">\n                    <a ng-if=\"!(obj[field.relationshipTypeField] || field.relationshipType || obj[field.relationshipName].attributes.type)\" class=\"slds-text-link--reset\" href=\"javascript:void(0);\">{{obj | getter: field | picker: field.type}}</a>\n                    <a ng-if=\"(obj[field.relationshipTypeField] || field.relationshipType || obj[field.relationshipName].attributes.type)\" href=\"javascript:void(0);\" ng-data-url=\"/{{obj[field.relationshipId]}}\" ng-object-type=\"{{obj[field.relationshipTypeField] || field.relationshipType || obj[field.relationshipName].attributes.type}}\">{{obj | getter: field | picker: field.type}}</a>      \n                </span>\n                <span class=\"slds-text-body--small\"  ng-if=\"field.relationshipType == '_sobjects'\">\n                  <span ng-repeat=\"child in obj[field.name] \">\n                    <a href=\"javascript:void(0);\" ng-click=\"openStory(child)\">{{child.Name}}</a><span ng-if=\"!$last\">, </span>\n                  </span>\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"slds-media__figure slds-media__figure--reverse\">\n    <div class=\"slds-timeline__actions\">\n      <p class=\"slds-timeline__date\">{{obj.monthDayLastActivityDate}}</p>\n        <slds-dropdown content=\"data.actions\" ng-if=\"data.actions.length > 0\" icon-attribute=\"vlocityIcon\" label-attribute=\"displayName\" action-function=\"performAction(item)\" button-size=\"x-small\" icon-size=\"x-small\"></slds-dropdown>\n    </div>\n  </div>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__SampleJson__c": "{\"data\":{\"fields\":[{\"label\":\"Type\",\"name\":\"highlight\"},{\"label\":\"Status\",\"name\":\"subtitle\"}],\"title\":\"Card Title\",\"xactions\":[{\"displayName\":\"Like Action\",\"vlocityIcon\":\"icon-v-heart\"}]},\"obj\":{\"Id\":\"500o0000003VdCPAA0\",\"LastActivityDate\":\"2015-03-25T18:06:01.000Z\",\"activityType\":null,\"detailFieldList\":[],\"detailValueMap\":null,\"filterDummy\":\"All Case\",\"formatedLastActivityDate\":\"3/25/2015\",\"highlight\":\"Electrical\",\"imageRef\":\"/resource/1446060313000/%vlocity_namespace%__Case\",\"indicators\":{},\"localDate\":\"2015-03-25\",\"localTime\":\"11:06:01.000Z\",\"longLastActivityDate\":\"1427306761\",\"modified\":\"Last Modified By oui designer on 2015-03-25 18:06:01\",\"monthNameLastActivityDate\":\"March 25, 2015\",\"navigateLink\":null,\"objAPIName\":\"Case\",\"objType\":\"Case\",\"owner\":\"005o0000001mbv9AAA\",\"ownerValueMap\":{\"Owner\":\"oui designer\",\"Photo\":\"https://vloc-ouidesigner-dev-ed--c.na17.content.force.com/profilephoto/005/T\",\"Title\":null},\"parentId\":\"001o000000SLNuoAAH\",\"parentName\":\"United Oil & Gas Corp.\",\"strActivityDate\":\"3/25/2015 11:06 AM\",\"subtitle\":\"Closed\",\"summaryLabelMap\":{\"Subtitle\":\"Status\",\"Title\":\"Subject\",\"Title_Highlight\":\"Case Type\"},\"title\":\"Motor design hindering performance\"}}",
                        "%vlocity_namespace%__Sass__c": ".via-slds {\n    // .slds-media__figure {\n    //     z-index: 1;\n    // }\n    // .slds-media--timeline:before {\n    //     z-index: 0;\n    // }\n    .slds-timeline__media--custom-custom1:before {\n        background: rgb(255, 123, 132);\n    }\n    .slds-timeline__media--custom-custom2:before {\n        background: rgb(207, 208, 92);\n    }\n    .slds-timeline__media--custom-custom3:before {\n        background: rgb(236, 180, 108);\n    }\n    .slds-timeline__media--custom-custom4:before {\n        background: rgb(225, 217, 81);\n    }\n    .slds-timeline__media--custom-custom5:before {\n        background: rgb(159, 219, 102);\n    }\n    .slds-timeline__media--custom-custom6:before {\n        background: rgb(84, 196, 115);\n    }\n    .slds-timeline__media--custom-custom7:before {\n        background: rgb(106, 137, 229);\n    }\n    .slds-timeline__media--custom-custom8:before {\n        background: rgb(80, 206, 185);\n    }\n    .slds-timeline__media--custom-custom9:before {\n        background: rgb(107, 158, 226);\n    }\n    .slds-timeline__media--custom-custom10:before {\n        background: rgb(100, 136, 227);\n    }\n    .slds-timeline__media--custom-custom11:before {\n        background: rgb(135, 132, 234);\n    }\n    .slds-timeline__media--custom-custom12:before {\n        background: rgb(220, 113, 209);\n    }\n    .slds-timeline__media--custom-custom13:before {\n        background: rgb(223, 97, 132);\n    }\n    .slds-timeline__media--custom-custom14:before {\n        background: rgb(60, 194, 179);\n    }\n    .slds-timeline__media--custom-custom15:before {\n        background: rgb(247, 126, 117);\n    }\n    .slds-timeline__media--custom-custom16:before {\n        background: rgb(233, 175, 103);\n    }\n    .slds-timeline__media--custom-custom17:before {\n        background: rgb(172, 211, 96);\n    }\n    .slds-timeline__media--custom-custom18:before {\n        background: rgb(77, 202, 118);\n    }\n    .slds-timeline__media--custom-custom19:before {\n        background: rgb(58, 190, 177);\n    }\n    .slds-timeline__media--custom-custom20:before {\n        background: rgb(72, 199, 200);\n    }\n    .slds-timeline__media--custom-custom21:before {\n        background: rgb(138, 122, 237);\n    }\n    .slds-timeline__media--custom-custom22:before {\n        background: rgb(139, 133, 249);\n    }\n    .slds-timeline__media--custom-custom23:before {\n        background: rgb(176, 112, 230);\n    }\n    .slds-timeline__media--custom-custom24:before {\n        background: rgb(229, 103, 152);\n    }\n    .slds-timeline__media--custom-custom25:before {\n        background: rgb(228, 111, 190);\n    }\n    .slds-timeline__media--custom-custom26:before {\n        background: rgb(118, 152, 240);\n    }\n    .slds-timeline__media--custom-custom27:before {\n        background: rgb(90, 176, 210);\n    }\n    .slds-timeline__media--custom-custom28:before {\n        background: rgb(137, 192, 89);\n    }\n    .slds-timeline__media--custom-custom29:before {\n        background: rgb(189, 210, 95);\n    }\n    .slds-timeline__media--custom-custom30:before {\n        background: rgb(245, 159, 113);\n    }\n    .slds-timeline__media--custom-custom31:before {\n        background: rgb(235, 104, 127);\n    }\n    .slds-timeline__media--custom-custom32:before {\n        background: rgb(56, 195, 147);\n    }\n    .slds-timeline__media--custom-custom33:before {\n        background: rgb(151, 207, 93);\n    }\n    .slds-timeline__media--custom-custom34:before {\n        background: rgb(213, 138, 106);\n    }\n    .slds-timeline__media--custom-custom35:before {\n        background: rgb(233, 99, 126);\n    }\n    .slds-timeline__media--custom-custom36:before {\n        background: rgb(212, 114, 212);\n    }\n    .slds-timeline__media--custom-custom37:before {\n        background: rgb(140, 137, 242);\n    }\n    .slds-timeline__media--custom-custom38:before {\n        background: rgb(83, 182, 215);\n    }\n    .slds-timeline__media--custom-custom39:before {\n        background: rgb(79, 190, 117);\n    }\n    .slds-timeline__media--custom-custom40:before {\n        background: rgb(131, 199, 94);\n    }\n    .slds-timeline__media--custom-custom41:before {\n        background: rgb(67, 181, 181);\n    }\n    .slds-timeline__media--custom-custom42:before {\n        background: rgb(207, 208, 91);\n    }\n    .slds-timeline__media--custom-custom43:before {\n        background: rgb(127, 147, 249);\n    }\n    .slds-timeline__media--custom-custom44:before {\n        background: rgb(200, 202, 88);\n    }\n    .slds-timeline__media--custom-custom45:before {\n        background: rgb(217, 88, 121);\n    }\n    .slds-timeline__media--custom-custom46:before {\n        background: rgb(103, 165, 231);\n    }\n    .slds-timeline__media--custom-custom47:before {\n        background: rgb(95, 204, 100);\n    }\n    .slds-timeline__media--custom-custom48:before {\n        background: rgb(239, 105, 127);\n    }\n    .slds-timeline__media--custom-custom49:before {\n        background: rgb(226, 92, 128);\n    }\n    .slds-timeline__media--custom-custom50:before {\n        background: rgb(73, 188, 211);\n    }\n    .slds-timeline__media--custom-custom51:before {\n        background: rgb(216, 199, 96);\n    }\n    .slds-timeline__media--custom-custom52:before {\n        background: rgb(238, 142, 111);\n    }\n    .slds-timeline__media--custom-custom53:before {\n        background: rgb(243, 110, 131);\n    }\n    .slds-timeline__media--custom-custom54:before {\n        background: rgb(234, 112, 177);\n    }\n    .slds-timeline__media--custom-custom55:before {\n        background: rgb(214, 110, 224);\n    }\n    .slds-timeline__media--custom-custom56:before {\n        background: rgb(113, 141, 235);\n    }\n    .slds-timeline__media--custom-custom57:before {\n        background: rgb(90, 156, 221);\n    }\n    .slds-timeline__media--custom-custom58:before {\n        background: rgb(52, 181, 157);\n    }\n    .slds-timeline__media--custom-custom59:before {\n        background: rgb(227, 208, 103);\n    }\n    .slds-timeline__media--custom-custom60:before {\n        background: rgb(191, 90, 136);\n    }\n    .slds-timeline__media--custom-custom61:before {\n        background: rgb(245, 115, 118);\n    }\n    .slds-timeline__media--custom-custom62:before {\n        background: rgb(107, 146, 220);\n    }\n    .slds-timeline__media--custom-custom63:before {\n        background: rgb(124, 207, 96);\n    }\n    .slds-timeline__media--custom-custom64:before {\n        background: rgb(97, 143, 216);\n    }\n    .slds-timeline__media--custom-custom65:before {\n        background: rgb(242, 121, 171);\n    }\n    .slds-timeline__media--custom-custom66:before {\n        background: rgb(216, 190, 95);\n    }\n    .slds-timeline__media--custom-custom67:before {\n        background: rgb(248, 125, 118);\n    }\n    .slds-timeline__media--custom-custom68:before {\n        background: rgb(242, 105, 121);\n    }\n    .slds-timeline__media--custom-custom69:before {\n        background: rgb(237, 99, 135);\n    }\n    .slds-timeline__media--custom-custom70:before {\n        background: rgb(231, 105, 180);\n    }\n    .slds-timeline__media--custom-custom71:before {\n        background: rgb(227, 110, 227);\n    }\n    .slds-timeline__media--custom-custom72:before {\n        background: rgb(141, 155, 251);\n    }\n    .slds-timeline__media--custom-custom73:before {\n        background: rgb(103, 158, 240);\n    }\n    .slds-timeline__media--custom-custom74:before {\n        background: rgb(65, 200, 160);\n    }\n    .slds-timeline__media--custom-custom75:before {\n        background: rgb(205, 159, 101);\n    }\n    .slds-timeline__media--custom-custom76:before {\n        background: rgb(219, 109, 122);\n    }\n    .slds-timeline__media--custom-custom77:before {\n        background: rgb(181, 93, 91);\n    }\n    .slds-timeline__media--custom-custom78:before {\n        background: rgb(90, 149, 221);\n    }\n    .slds-timeline__media--custom-custom79:before {\n        background: rgb(142, 211, 99);\n    }\n    .slds-timeline__media--custom-custom80:before {\n        background: rgb(101, 154, 213);\n    }\n    .slds-timeline__media--custom-custom81:before {\n        background: rgb(218, 98, 127);\n    }\n    .slds-timeline__media--custom-custom82:before {\n        background: rgb(209, 91, 151);\n    }\n    .slds-timeline__media--custom-custom83:before {\n        background: rgb(231, 128, 111);\n    }\n    .slds-timeline__media--custom-custom84:before {\n        background: rgb(246, 112, 123);\n    }\n    .slds-timeline__media--custom-custom85:before {\n        background: rgb(242, 104, 145);\n    }\n    .slds-timeline__media--custom-custom86:before {\n        background: rgb(226, 96, 171);\n    }\n    .slds-timeline__media--custom-custom87:before {\n        background: rgb(216, 118, 229);\n    }\n    .slds-timeline__media--custom-custom88:before {\n        background: rgb(153, 111, 230);\n    }\n    .slds-timeline__media--custom-custom89:before {\n        background: rgb(62, 153, 190);\n    }\n    .slds-timeline__media--custom-custom90:before {\n        background: rgb(34, 164, 138);\n    }\n    .slds-timeline__media--custom-custom91:before {\n        background: rgb(191, 123, 102);\n    }\n    .slds-timeline__media--custom-custom92:before {\n        background: rgb(81, 126, 130);\n    }\n    .slds-timeline__media--custom-custom93:before {\n        background: rgb(144, 77, 76);\n    }\n    .slds-timeline__media--custom-custom94:before {\n        background: rgb(67, 156, 186);\n    }\n    .slds-timeline__media--custom-custom95:before {\n        background: rgb(139, 207, 106);\n    }\n    .slds-timeline__media--custom-custom96:before {\n        background: rgb(109, 157, 227);\n    }\n    .slds-timeline__media--custom-custom97:before {\n        background: rgb(221, 96, 133);\n    }\n    .slds-timeline__media--custom-custom98:before {\n        background: rgb(225, 190, 92);\n    }\n    .slds-timeline__media--custom-custom99:before {\n        background: rgb(240, 133, 110);\n    }\n    .slds-timeline__media--custom-custom100:before {\n        background: rgb(225, 93, 118);\n    }\n    .slds-timeline__media--standard-log-a-call:before {\n        background: rgb(72, 195, 204);\n    }\n    .slds-timeline__media--standard-document:before {\n        background: rgb(186, 172, 147);\n    }\n    .slds-timeline__media--standard-environment-hub:before {\n        background: rgb(84, 105, 141);\n    }\n    .slds-timeline__media--standard-flow:before {\n        background: rgb(84, 105, 141);\n    }\n    .slds-timeline__media--standard-sossession:before {\n        background: rgb(84, 105, 141);\n    }\n    .slds-timeline__media--standard-process:before {\n        background: rgb(84, 105, 141);\n    }\n    .slds-timeline__media--standard-news:before {\n        background: rgb(127, 141, 225);\n    }\n    .slds-timeline__media--standard-home:before {\n        background: rgb(239, 126, 173);\n    }\n    .slds-timeline__media--standard-account:before {\n        background: rgb(127, 141, 225);\n    }\n    .slds-timeline__media--standard-apps-admin:before {\n        background: rgb(152, 149, 238);\n    }\n    .slds-timeline__media--standard-announcement:before {\n        background: rgb(98, 183, 237);\n    }\n    .slds-timeline__media--standard-person-account:before {\n        background: rgb(127, 141, 225);\n    }\n    .slds-timeline__media--standard-social:before {\n        background: rgb(234, 116, 162);\n    }\n    .slds-timeline__media--standard-campaign-members:before {\n        background: rgb(244, 151, 86);\n    }\n    .slds-timeline__media--standard-article:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-answer-public:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-answer-private:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-answer-best:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-avatar-loading:before {\n        background: rgb(184, 195, 206);\n    }\n    .slds-timeline__media--standard-campaign:before {\n        background: rgb(244, 151, 86);\n    }\n    .slds-timeline__media--standard-calibration:before {\n        background: rgb(71, 207, 210);\n    }\n    .slds-timeline__media--standard-avatar:before {\n        background: rgb(98, 183, 237);\n    }\n    .slds-timeline__media--standard-approval:before {\n        background: rgb(80, 204, 122);\n    }\n    .slds-timeline__media--standard-apps:before {\n        background: rgb(60, 151, 221);\n    }\n    .slds-timeline__media--standard-user:before {\n        background: rgb(52, 190, 205);\n    }\n    .slds-timeline__media--standard-evernote:before {\n        background: rgb(134, 200, 111);\n    }\n    .slds-timeline__media--standard-coaching:before {\n        background: rgb(246, 117, 148);\n    }\n    .slds-timeline__media--standard-connected-apps:before {\n        background: rgb(152, 149, 238);\n    }\n    .slds-timeline__media--standard-drafts:before {\n        background: rgb(108, 161, 233);\n    }\n    .slds-timeline__media--standard-email:before {\n        background: rgb(149, 174, 197);\n    }\n    .slds-timeline__media--standard-email-iq:before {\n        background: rgb(160, 148, 237);\n    }\n    .slds-timeline__media--standard-endorsement:before {\n        background: rgb(139, 154, 227);\n    }\n    .slds-timeline__media--standard-event:before {\n        background: rgb(235, 112, 146);\n    }\n    .slds-timeline__media--standard-dropbox:before {\n        background: rgb(82, 174, 249);\n    }\n    .slds-timeline__media--standard-concur:before {\n        background: rgb(76, 195, 199);\n    }\n    .slds-timeline__media--standard-email-chatter:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-case-transcript:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-case-email:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-case-log-a-call:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-case-comment:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-case-change-status:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-work-order:before {\n        background: rgb(80, 227, 194);\n    }\n    .slds-timeline__media--standard-work-order-item:before {\n        background: rgb(51, 168, 220);\n    }\n    .slds-timeline__media--standard-client:before {\n        background: rgb(0, 210, 190);\n    }\n    .slds-timeline__media--standard-contract:before {\n        background: rgb(110, 192, 110);\n    }\n    .slds-timeline__media--standard-dashboard:before {\n        background: rgb(239, 110, 100);\n    }\n    .slds-timeline__media--standard-case:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-empty:before {\n        background: rgb(129, 153, 175);\n    }\n    .slds-timeline__media--standard-default:before {\n        background: rgb(129, 153, 175);\n    }\n    .slds-timeline__media--standard-custom:before {\n        background: rgb(129, 153, 175);\n    }\n    .slds-timeline__media--standard-canvas:before {\n        background: rgb(129, 153, 175);\n    }\n    .slds-timeline__media--standard-contact:before {\n        background: rgb(160, 148, 237);\n    }\n    .slds-timeline__media--standard-portal:before {\n        background: rgb(174, 199, 112);\n    }\n    .slds-timeline__media--standard-product:before {\n        background: rgb(183, 129, 211);\n    }\n    .slds-timeline__media--standard-pricebook:before {\n        background: rgb(183, 129, 211);\n    }\n    .slds-timeline__media--standard-feed:before {\n        background: rgb(98, 183, 237);\n    }\n    .slds-timeline__media--standard-feedback:before {\n        background: rgb(109, 161, 234);\n    }\n    .slds-timeline__media--standard-file:before {\n        background: rgb(186, 172, 147);\n    }\n    .slds-timeline__media--standard-goals:before {\n        background: rgb(86, 170, 223);\n    }\n    .slds-timeline__media--standard-groups:before {\n        background: rgb(119, 158, 242);\n    }\n    .slds-timeline__media--standard-household:before {\n        background: rgb(0, 175, 160);\n    }\n    .slds-timeline__media--standard-hierarchy:before {\n        background: rgb(52, 190, 205);\n    }\n    .slds-timeline__media--standard-insights:before {\n        background: rgb(236, 148, 237);\n    }\n    .slds-timeline__media--standard-investment-account:before {\n        background: rgb(75, 192, 118);\n    }\n    .slds-timeline__media--standard-performance:before {\n        background: rgb(248, 177, 86);\n    }\n    .slds-timeline__media--standard-link:before {\n        background: rgb(122, 154, 230);\n    }\n    .slds-timeline__media--standard-metrics:before {\n        background: rgb(86, 170, 223);\n    }\n    .slds-timeline__media--standard-note:before {\n        background: rgb(230, 212, 120);\n    }\n    .slds-timeline__media--standard-lead:before {\n        background: rgb(248, 137, 98);\n    }\n    .slds-timeline__media--standard-opportunity:before {\n        background: rgb(252, 185, 91);\n    }\n    .slds-timeline__media--standard-call:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-call-history:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-orders:before {\n        background: rgb(118, 158, 217);\n    }\n    .slds-timeline__media--standard-post:before {\n        background: rgb(101, 202, 228);\n    }\n    .slds-timeline__media--standard-poll:before {\n        background: rgb(105, 155, 225);\n    }\n    .slds-timeline__media--standard-photo:before {\n        background: rgb(215, 209, 209);\n    }\n    .slds-timeline__media--standard-people:before {\n        background: rgb(52, 190, 205);\n    }\n    .slds-timeline__media--standard-generic-loading:before {\n        background: rgb(184, 195, 206);\n    }\n    .slds-timeline__media--standard-group-loading:before {\n        background: rgb(184, 195, 206);\n    }\n    .slds-timeline__media--standard-recent:before {\n        background: rgb(108, 161, 233);\n    }\n    .slds-timeline__media--standard-solution:before {\n        background: rgb(143, 201, 114);\n    }\n    .slds-timeline__media--standard-record:before {\n        background: rgb(125, 195, 125);\n    }\n    .slds-timeline__media--standard-question-best:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-question-feed:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-related-list:before {\n        background: rgb(89, 188, 171);\n    }\n    .slds-timeline__media--standard-skill-entity:before {\n        background: rgb(139, 154, 227);\n    }\n    .slds-timeline__media--standard-scan-card:before {\n        background: rgb(243, 158, 88);\n    }\n    .slds-timeline__media--standard-report:before {\n        background: rgb(46, 203, 190);\n    }\n    .slds-timeline__media--standard-quotes:before {\n        background: rgb(136, 198, 81);\n    }\n    .slds-timeline__media--standard-task:before {\n        background: rgb(75, 192, 118);\n    }\n    .slds-timeline__media--standard-task-2:before {\n        background: rgb(75, 192, 118);\n    }\n    .slds-timeline__media--standard-team-member:before {\n        background: rgb(242, 207, 91);\n    }\n    .slds-timeline__media--standard-thanks:before {\n        background: rgb(233, 105, 110);\n    }\n    .slds-timeline__media--standard-reward:before {\n        background: rgb(233, 105, 110);\n    }\n    .slds-timeline__media--standard-thanks-loading:before {\n        background: rgb(184, 195, 206);\n    }\n    .slds-timeline__media--standard-today:before {\n        background: rgb(239, 126, 173);\n    }\n    .slds-timeline__media--standard-topic:before {\n        background: rgb(86, 170, 223);\n    }\n    .slds-timeline__media--standard-unmatched:before {\n        background: rgb(98, 183, 237);\n    }\n    .slds-timeline__media--standard-marketing-actions:before {\n        background: rgb(107, 189, 110);\n    }\n    .slds-timeline__media--standard-relationship:before {\n        background: rgb(60, 151, 221);\n    }\n    .slds-timeline__media--standard-folder:before {\n        background: rgb(139, 154, 227);\n    }\n}",
                        "%vlocity_namespace%__Type__c": "Cards",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-member-story-card",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-member-story-card/%vlocity_namespace%__VlocityUITemplate__c/campaign-member-story-card"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-member-story-card",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-member-story-card",
            "VlocityDataPackName": "campaign-member-story-card",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": "/*** MIXINS ***/\n",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "All",
                        "%vlocity_namespace%__ExternalID__c": "campaign-mixins/1/Vlocity/1512540858791",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Sass__c": "/*** MIXINS ***/\n@mixin clearfix {\n    &:before, &:after {\n        content: \" \"; // 1\n        display: table; // 2\n    }\n    &:after {\n        clear: both;\n    }\n}\n\n@mixin columnHeader($className, $position: absolute) {\n    .#{$className} {\n        height: 3rem;\n        position: $position;\n        top: 0;\n        left: 0;\n        width: 100%;\n        background-color: $neutral-lightest;\n        border-bottom: 1px solid $cards-border-gray;\n        \n        .slds-icon_container.column-header-icon {\n            position: absolute;\n            left: 0.5rem;\n            top: 50%;\n            transform: translateY(-50%);\n            z-index: 2;\n            cursor: pointer;\n        }\n        \n        .slds-text-heading--small {\n            line-height: 3rem;\n            padding-left: 3.1rem;\n        }\n    }\n}\n\n@mixin rightSideIcons {\n    .right-side-icons {\n        @include clearfix;\n        width: 4rem;\n        position: absolute;\n        right: 0;\n        top: 0;\n        height: 100%;\n\n        .slds-icon_container {\n            float: left;\n            line-height: 2.7rem;\n            width: 2rem;\n            cursor: pointer;\n\n            svg {\n                fill: $neutral-medium;\n                transition: fill 100ms ease-in;\n            }\n\n            &:hover {\n                svg {\n                    fill: $neutral-dark;\n                }\n            }\n\n            &.filter-icon {\n                &.active {\n                    svg {\n                        fill: #04844b;\n                    }\n                }\n            }\n        }\n    }\n}",
                        "%vlocity_namespace%__Type__c": "mixin",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-mixins",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-mixins/%vlocity_namespace%__VlocityUITemplate__c/campaign-mixins"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-mixins",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-mixins",
            "VlocityDataPackName": "campaign-mixins",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": ".tool-tip {\n  font-style: italic;\n  text-transform: none;\n  font-size: 10px; }\n",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-results/1/Vlocity/1512540858794",
                        "%vlocity_namespace%__HTML__c": "<div ng-init=\"importedScope.setData(records.result, params.id)\">\n     <div class=\"slds-container--medium slds-container--center\">\n        <div class=\"campaign-spinner-container\" ng-show=\"importedScope.isLoading\">\n          <div class=\"slds-spinner_container campaign-list-spinner\">\n              <div class=\"slds-spinner slds-spinner--medium\" aria-hidden=\"false\" role=\"alert\">\n                  <div class=\"slds-spinner__dot-a\"></div>\n                  <div class=\"slds-spinner__dot-b\"></div>\n              </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"slds-page-header slds-align--absolute-center slds-m-top--none slds-text-heading--label slds-p-around--xx-small slds-p-vertical--small\">\n        <div class=\"slds-form-element slds-m-horizontal--xx-small slds-size--1-of-3\" ng-class=\"{'slds-size--1-of-6' : importedScope.options.dateRange === 'Custom'}\">\n            <label>Group By:</label>\n            <select id=\"select-01\" class=\"slds-select slds-p-around--xx-small\" ng-change=\"importedScope.setRange()\" ng-model=\"importedScope.options.groupBy\">\n                    <option value=\"{{date}}\" ng-repeat=\"date in importedScope.groupBy\">{{date}}</option>\n            </select>\n        </div>\n        <div class=\"slds-form-element slds-size--1-of-3\" ng-class=\"{'slds-size--4-of-6' : importedScope.options.dateRange === 'Custom'}\">\n            <ul ng-class=\"{'slds-list--horizontal' : importedScope.options.dateRange === 'Custom'}\">\n                <li ng-class=\"{'slds-size--1-of-3 slds-item slds-p-right--xx-small' : importedScope.options.dateRange === 'Custom'}\">\n                    <label>Date Range:</label>\n                    <select id=\"select-02\" class=\"slds-select slds-p-around--xx-small\" ng-change=\"importedScope.setRange()\" ng-model=\"importedScope.options.dateRange\">\n                            <option value=\"{{dateRange}}\" ng-repeat=\"dateRange in importedScope.dateRange\">{{dateRange}}</option>\n                    </select>\n                </li>\n                <span ng-if=\"importedScope.options.dateRange === 'Custom'\" class=\"slds-list--horizontal slds-size--3-of-4\">\n                    <li class=\"slds-form-element slds-size--1-of-2 slds-item\">\n                        <label>Start Date:</label>\n                        <input class=\"slds-input\" type=\"date\" name=\"startDate\" ng-model=\"importedScope.customRange[0]\" ng-change=\"(importedScope.customRange[0] && importedScope.customRange[1]) && importedScope.setRange()\"></input>\n                    </li>\n                     <li class=\"slds-form-element slds-size--1-of-2 slds-item slds-p-left--xx-small\">\n                        <label>End Date:</label>\n                        <input class=\"slds-input\" type=\"date\" name=\"endDate\" ng-model=\"importedScope.customRange[1]\" ng-change=\"(importedScope.customRange[0] && importedScope.customRange[1]) && importedScope.setRange()\"></input>\n                    </li>\n                    <span ng-if=\"importedScope.customRange[0] && importedScope.customRange[1] && importedScope.invalidDateRange\">\n                        <div class=\"slds-popover slds-nubbin--top-right slds-theme--error\" role=\"alert\" aria-live=\"polite\" style=\"position:absolute;top:80px;left:12px;\">\n                          <div class=\"slds-popover__body slds-text-longform\">\n                            <p>Invalid Date Range</p>\n                          </div>\n                        </div>\n                    </span>\n                </span>\n            </ul>\n        </div>\n        <div class=\"slds-form-element slds-m-horizontal--xx-small slds-size--1-of-3\" ng-class=\"{'slds-size--1-of-6' : importedScope.options.dateRange === 'Custom'}\">\n            <label>Filter:</label><span class=\"slds-text-align--right slds-text-color--weak tool-tip\" ng-hide=\"importedScope.options.dateRange === 'Custom'\"> (Toggle keys in legend)</span>\n            <select id=\"select-02\" class=\"slds-select slds-p-around--xx-small\" ng-change=\"importedScope.filterData()\" ng-model=\"importedScope.options.filter\">\n                <option value=\"{{status}}\" ng-repeat=\"status in importedScope.status\">{{status}}</option>\n            </select>\n        </div>\n    </div>\n    <div class=\"canvas-container slds-m-around--small\">\n        <div ng-show=\"importedScope.noData\" class=\"slds-text-body--regular slds-m-top--medium slds-text-align--center\">\n            {{importedScope.error}}\n        </div>\n        <canvas id=\"barChart\" class=\"chart chart-bar\" chart-data=\"importedScope.data\" chart-labels=\"importedScope.labels\" chart-series=\"importedScope.series\" chart-options=\"importedScope.chartOptions\" chart-colors=\"importedScope.colors\">\n        </canvas>\n    </div>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__SampleJson__c": "{\"data\":{\"actions\":[{\"displayName\":\"Like Action\",\"vlocityIcon\":\"icon-v-heart\"}],\"fields\":[{\"label\":\"Description\",\"name\":\"description\"},{\"label\":\"Cost\",\"name\":\"cost\",\"type\":\"currency\"}],\"title\":\"Card Title\"},\"obj\":{\"Id\":\"123456\",\"LastModifiedDate\":\"2016-08-02T18:09:02.696Z\",\"Name\":\"Object Name\",\"cost\":150,\"description\":\"Some description\"}}",
                        "%vlocity_namespace%__Sass__c": ".tool-tip{\n    font-style: italic;\n    text-transform: none;\n    font-size: 10px;\n}",
                        "%vlocity_namespace%__Type__c": "Cards",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-results",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-results/%vlocity_namespace%__VlocityUITemplate__c/campaign-results"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-results",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-results",
            "VlocityDataPackName": "campaign-results",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": ".items-center {\n  left: 19%;\n  position: relative; }\n\n.slds-radio [type=radio]:checked + .slds-radio__label .slds-radio--faux:after {\n  width: .5rem;\n  height: .5rem;\n  content: '';\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate3d(-50%, -50%, 0);\n  border-radius: 50%;\n  background: #1589ee; }\n\n.heading {\n  background: #f7f9fb; }\n\n.close-btn {\n  position: relative;\n  top: -.5rem;\n  color: white;\n  right: .5rem; }\n",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-status/1/Vlocity/1512540858796",
                        "%vlocity_namespace%__HTML__c": "<div class=\"slds-container--medium slds-container--center\">\n    <div class=\"campaign-spinner-container\" ng-show=\"importedScope.isLoading\">\n      <div class=\"slds-spinner_container campaign-list-spinner\">\n          <div class=\"slds-spinner slds-spinner--medium\" aria-hidden=\"false\" role=\"alert\">\n              <div class=\"slds-spinner__dot-a\"></div>\n              <div class=\"slds-spinner__dot-b\"></div>\n          </div>\n      </div>\n  </div>\n  <div class=\"slds-notify_container\" ng-show=\"importedScope.showBanner\">\n        <div class=\"slds-notify slds-notify--alert slds-theme--success slds-theme--alert-texture slds-p-vertical--medium\" role=\"alert\">\n            <button class=\"slds-button slds-float--right\"  ng-click=\"importedScope.showBanner = false\">\n                <slds-button-svg-icon sprite=\"'utility'\" icon=\"'close'\" extra-classes=\"'close-btn'\"></slds-button-svg-icon>\n                <span class=\"slds-assistive-text\">Close</span>\n            </button>\n            <span class=\"slds-assistive-text\">Success</span>\n            <h2>{{importedScope.bannerText}}</h2>\n        </div>\n    </div>\n    <div class=\"slds-notify_container\" ng-show=\"importedScope.showErrorBanner\">\n        <div class=\"slds-notify slds-notify--alert slds-theme--error slds-theme--alert-texture slds-p-vertical--medium\" role=\"alert\">\n            <button class=\"slds-button slds-float--right\"  ng-click=\"importedScope.showErrorBanner = false\">\n                <slds-button-svg-icon sprite=\"'utility'\" icon=\"'close'\" extra-classes=\"'close-btn'\"></slds-button-svg-icon>\n                <span class=\"slds-assistive-text\">Close</span>\n            </button>\n            <h2>{{importedScope.bannerText}}</h2>\n        </div>\n  </div>\n  <table class=\"slds-table slds-table--bordered slds-table--cell-buffer\" ng-init=\"importedScope.setObj(records.result.records); importedScope.campaignId = params.id\">\n    <thead>\n      <tr class=\"slds-text-title--caps heading\">\n        <th scope=\"col\">\n          <div class=\"slds-form-element__label\" title=\"Member Status\">Member Status</div>\n        </th>\n        <th scope=\"col\">\n          <legend class=\"slds-form-element__legend slds-form-element__label\">\n              <abbr class=\"slds-required\" title=\"required\">*</abbr>Responded</legend>\n        </th>\n        <th scope=\"col\">\n          <legend class=\"slds-form-element__legend slds-form-element__label\">\n              <abbr class=\"slds-required\" title=\"required\">*</abbr>Default</legend>\n        </th>\n        <th scope=\"col\">\n        </th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr ng-repeat=\"status in importedScope.status track by $index\">\n        <th scope=\"row\" data-label=\"Member Status\">\n          <div class=\"slds-truncate\" title=\"{{status.statusLabel}}\">\n          <input id=\"text-input-01\" class=\"slds-input\" type=\"text\" ng-model=\"status.statusLabel\"/>\n          </div>\n        </th>\n        <td data-label=\"{{status.hasResponded}}\">\n          <div class=\"slds-truncate\" title=\"{{status.hasResponded}}\">\n             <label class=\"slds-checkbox items-center\">\n                  <input type=\"checkbox\" id=\"checkbox-contacts\" ng-model=\"status.hasResponded\"/>\n                  <span class=\"slds-checkbox--faux\"></span>\n              </label>\n          </div>\n        </td>\n        <td data-label=\"{{status.isDefault}}\">\n              <div class=\"slds-form-element__control\">\n                <span class=\"slds-radio items-center\">\n                    <input type=\"radio\" id=\"radio-{{$index}}\" name=\"options\" ng-checked=\"status.isDefault\" ng-model=\"status.isDefault\" ng-change=\"importedScope.updateDefault($index)\"/>\n                     <label class=\"slds-radio__label\"  for=\"radio-{{$index}}\">\n                      <span class=\"slds-radio--faux\"></span>\n                      <span class=\"slds-form-element__label\"></span>\n                    </label>\n                  </span>\n              </div>\n        </td>\n        <td data-label=\"delete\">\n          <button class=\"slds-button items-center\" ng-click=\"importedScope.removeElement($index)\">\n            <span class=\"slds-icon_container\" ng-click=\"importedScope.refreshList()\">\n                  <slds-svg-icon sprite=\"'utility'\" icon=\"'delete'\" size=\"'x-small'\" extra-classes=\"'slds-icon-text-default'\"></slds-svg-icon>\n              </span>\n            </button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n  <div class=\"slds-docked-form-footer slds-p-around--small\">\n    <button class=\"slds-button slds-m-left--small\" ng-click=\"importedScope.campaignMemberStatusObj('', '', false, false)\">Add More</button>\n    <button class=\"slds-button slds-button--brand slds-float--right slds-m-right--xx-small\" type=\"button\" ng-click=\"importedScope.saveStatus()\">Save</button> \n  </div>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__SampleJson__c": "{\"data\":{\"actions\":[{\"displayName\":\"Like Action\",\"vlocityIcon\":\"icon-v-heart\"}],\"fields\":[{\"label\":\"Description\",\"name\":\"description\"},{\"label\":\"Cost\",\"name\":\"cost\",\"type\":\"currency\"}],\"title\":\"Card Title\"},\"obj\":{\"Id\":\"123456\",\"LastModifiedDate\":\"2016-08-02T18:09:02.696Z\",\"Name\":\"Object Name\",\"cost\":150,\"description\":\"Some description\"}}",
                        "%vlocity_namespace%__Sass__c": ".items-center{\n    left: 19%;\n    position: relative;\n}\n.slds-radio [type=radio]:checked+.slds-radio__label .slds-radio--faux:after{\n    width: .5rem;\n    height: .5rem;\n    content: '';\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate3d(-50%,-50%,0);\n    border-radius: 50%;\n    background: #1589ee;\n}\n\n.heading{\n   background: #f7f9fb;\n}\n\n.close-btn{\n    position: relative;\n    top: -.5rem;\n    color: white;\n    right: .5rem;\n}",
                        "%vlocity_namespace%__Type__c": "Cards",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-status",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-status/%vlocity_namespace%__VlocityUITemplate__c/campaign-status"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-status",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-status",
            "VlocityDataPackName": "campaign-status",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": null,
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "campaign-variables/1/Vlocity/1512540858797",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Sass__c": "//*****  sass/variables/_campaign-variables.scss is a SYMLINK of\n//*****  datapack-expanded/CampaignBaseTemplates/VlocityUITemplate/campaign-variables/campaign-variables.scss\n//*****  This is intentional so that variables stay consistent between Cards & Global Campaign CSS\n\n//*** RESPONSIVE BREAKPOINTS ***//\n$bp-xsmall: 20em;\n$bp-small: 30em;\n$bp-xmedium: 44em;\n$bp-medium: 48em;\n$bp-large: 64em;\n\n//*** COLORS ***//\n// Grays\n$header-gray: #f7f9fb;\n$cards-gray: #f4f6f9;\n$cards-border-gray: #d8dde6;\n$mobile-icons-gray: #9faab5;\n\n// Notifications\n$notify-danger: #c23934;\n$notify-warning: #ffb75d;\n$notify-success: #04844b;\n$notify-default: #54698d;\n\n// Neutrals\n$neutral-lightest: #EEF1F6;\n$neutral-light: #CFD7E6;\n$neutral-medium: #A7B8D1;\n$neutral-dark: #4F6A92;\n\n// Modals\n$modal-overlay: #7e8c99;\n\n// Primary Colors\n$primary-alternative: #4A90E2;\n$primary-lightest: #0C8EFF;\n$primary-light: #0070D2;\n$primary-medium: #005FB2;\n$primary-dark: #00396B;\n\n// Secondary Colors\n$secondary-pink: #EF7EAD;\n$secondary-green: #4BC076;\n$secondary-aqua: #50E3C2;\n$secondary-purple: #7F8DE1;\n$secondary-orange: #F88962;\n\n// Other Colors\n$slds-red: #ef6e64;\n\n// Fonts\n$slds-font: \"Salesforce Sans\", Arial, sans-serif;",
                        "%vlocity_namespace%__Type__c": "mixin",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "campaign-variables",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/campaign-variables/%vlocity_namespace%__VlocityUITemplate__c/campaign-variables"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/campaign-variables",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/campaign-variables",
            "VlocityDataPackName": "campaign-variables",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        }
    ],
    "name": "CampaignBaseTemplates",
    "primaryDataPackKey": "VlocityDeploy",
    "processMultiple": true,
    "status": "Complete",
    "version": 1
}
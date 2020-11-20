{
    "dataPackId": "",
    "dataPacks": [
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "",
                        "%vlocity_namespace%__CustomJavaScript__c": "{\"cartId\":\"0Q01U000000cECA\"}",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__ElementTypeToHTMLTemplateList__c": "{\"ElementTypeToHTMLTemplateList\":[]}",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "SubmitDiscountsForApproval",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "IntegrationProcedure/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitDiscountsForApproval/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"actionMessage\":\"\",\"additionalInput\":{\"cartId\":\"%ContextId%\"},\"additionalOutput\":{},\"chainOnStep\":false,\"disOnTplt\":false,\"executionConditionalFormula\":\"\",\"failOnStepError\":true,\"failureConditionalFormula\":\"\",\"failureResponse\":{},\"label\":\"RemoteAction1\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"submitDiscountsForApproval\",\"remoteOptions\":{},\"responseJSONNode\":\"\",\"responseJSONPath\":\"messages|1\",\"returnOnlyAdditionalOutput\":false,\"returnOnlyFailureResponse\":false,\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"sendOnlyAdditionalInput\":false,\"show\":null,\"useFormulas\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "Submit Discounts for Approval",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "IntegrationProcedure/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__Element__c/Submit Discounts for Approval"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "SubmitDiscountsForApproval",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "IntegrationProcedure/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitDiscountsForApproval/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"actionMessage\":\"\",\"chainOnStep\":false,\"disOnTplt\":false,\"elementValueMap\":{\"message\":\"%Submit Discounts for Approval:message%\",\"submitSuccessful\":\"=IF (%Submit Discounts for Approval:severity% = 'INFO', 'True', 'False')\"},\"executionConditionalFormula\":\"\",\"failOnStepError\":true,\"failureConditionalFormula\":\"\",\"label\":\"SetValues1\",\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Set Values",
                                "Name": "isSubmitSuccessful",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "IntegrationProcedure/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__Element__c/isSubmitSuccessful"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "SubmitDiscountsForApproval",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "IntegrationProcedure/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitDiscountsForApproval/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"additionalOutput\":{\"isSubmitSuccessful\":\"%isSubmitSuccessful:submitSuccessful%\",\"responseMessage\":\"%isSubmitSuccessful:message%\"},\"disOnTplt\":false,\"executionConditionalFormula\":\"\",\"label\":\"ResponseAction1\",\"responseDefaultData\":{},\"responseFormat\":\"JSON\",\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"returnFullDataJSON\":false,\"returnOnlyAdditionalOutput\":false,\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"useFormulas\":true,\"vlcResponseHeaders\":{}}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Response Action",
                                "Name": "Return response",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "IntegrationProcedure/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__Element__c/Return response"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsProcedure__c": true,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "Procedure",
                        "%vlocity_namespace%__LastPreviewPage__c": "",
                        "%vlocity_namespace%__ProcedureKey__c": "CPQ_SubmitDiscountsForApproval",
                        "%vlocity_namespace%__PropertySet__c": "{\"chainableCpuLimit\":2000,\"chainableDMLRowsLimit\":null,\"chainableDMLStatementsLimit\":null,\"chainableHeapSizeLimit\":null,\"chainableQueriesLimit\":50,\"chainableQueryRowsLimit\":null,\"chainableSoslQueriesLimit\":null,\"columnsPropertyMap\":[],\"description\":\"\",\"includeAllActionsInResponse\":false,\"labelPlural\":\"\",\"labelSingular\":\"\",\"linkToExternalObject\":\"\",\"nameColumn\":\"\",\"relationshipFieldsMap\":[],\"rollbackOnError\":false,\"trackingCustomData\":{}}",
                        "%vlocity_namespace%__SubType__c": "SubmitDiscountsForApproval",
                        "%vlocity_namespace%__Type__c": "CPQ",
                        "%vlocity_namespace%__Version__c": 2,
                        "Name": "SubmitDiscountsForApproval",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "IntegrationProcedure/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitDiscountsForApproval/Procedure"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "IntegrationProcedure/CPQ_SubmitDiscountsForApproval",
                "VlocityDataPackType": "IntegrationProcedure"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "IntegrationProcedure/CPQ_SubmitDiscountsForApproval",
            "VlocityDataPackName": "CPQ_SubmitDiscountsForApproval",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "IntegrationProcedure"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__DisableMetadataCache__c": false,
                        "%vlocity_namespace%__ElementTypeToHTMLTemplateList__c": "{\"ElementTypeToHTMLTemplateList\":[]}",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Amend Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"enableActionMessage\":false,\"enableDefaultAbort\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"extraPayload\":{\"cartId\":\"%ContextId%\"},\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureGoBackLabel\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":\"OSPrevalidateStepLabel\",\"message\":{},\"postMessage\":null,\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"pubsub\":false,\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"preValidate\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"PreValidate\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":null,\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "PreValidate",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/PreValidate"
                            },
                            {
                                "%vlocity_namespace%__Active__c": false,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Amend Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"allowSaveForLater\":true,\"cancelLabel\":null,\"cancelMessage\":null,\"chartLabel\":null,\"completeLabel\":null,\"completeMessage\":null,\"conditionType\":\"Hide if False\",\"disOnTplt\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"instruction\":\"\",\"instructionKey\":null,\"knowledgeOptions\":{\"dataCategoryCriteria\":\"\",\"keyword\":\"\",\"language\":\"English\",\"publishStatus\":\"Online\",\"remoteTimeout\":30000,\"typeFilter\":\"\"},\"label\":\"OrderFulfilmentPaused\",\"nextLabel\":null,\"nextWidth\":3,\"previousLabel\":null,\"previousWidth\":3,\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{},\"remoteTimeout\":30000,\"saveLabel\":null,\"saveMessage\":null,\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"PreValidate:records|1:isPONR\"}]}},\"showPersistentComponent\":[false,false],\"validationRequired\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Step",
                                "Name": "PreValidateSuccess",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/PreValidateSuccess"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Amend Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"allowSaveForLater\":true,\"cancelLabel\":null,\"cancelMessage\":null,\"chartLabel\":null,\"completeLabel\":null,\"completeMessage\":null,\"conditionType\":\"Hide if False\",\"disOnTplt\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"instruction\":\"\",\"instructionKey\":null,\"knowledgeOptions\":{\"dataCategoryCriteria\":\"\",\"keyword\":\"\",\"language\":\"English\",\"publishStatus\":\"Online\",\"remoteTimeout\":30000,\"typeFilter\":\"\"},\"label\":\"UnableToPauseOrderFulfilment\",\"nextLabel\":null,\"nextWidth\":3,\"previousLabel\":null,\"previousWidth\":3,\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{},\"remoteTimeout\":30000,\"saveLabel\":null,\"saveMessage\":null,\"show\":{\"group\":{\"operator\":\"OR\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"PreValidate:records|1:isPONR\"},{\"condition\":\"=\",\"data\":\"ERROR\",\"field\":\"PreValidate:messages|1:severity\"}]}},\"showPersistentComponent\":[false,false],\"validationRequired\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Step",
                                "Name": "PreValidateFailure",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/PreValidateFailure"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Amend Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 4,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"enableActionMessage\":false,\"enableDefaultAbort\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"extraPayload\":{\"cartId\":\"%ContextId%\",\"intent\":\"amend\"},\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureGoBackLabel\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":\"\",\"message\":{},\"postMessage\":null,\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"pubsub\":false,\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"createSupplementalOrder\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"CreateSupplementalOrder\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"PreValidate:records|1:isPONR\"},{\"condition\":\"<>\",\"data\":\"ERROR\",\"field\":\"PreValidate:messages|1:severity\"}]}},\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":\"Submit\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "CreateSupplementalOrder",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/CreateSupplementalOrder"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Amend Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 5,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"Outcome\":\"\",\"consoleTabLabel\":null,\"controlWidth\":12,\"disOnTplt\":false,\"label\":\"\",\"message\":{\"\":\"\"},\"pubsub\":false,\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"PreValidate:records|1:isPONR\"},{\"condition\":\"<>\",\"data\":\"ERROR\",\"field\":\"PreValidate:messages|1:severity\"}]}},\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%CreateSupplementalOrder:records|1:supplementalOrderId%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":null,\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "CreateSupplementalOrderDone",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/CreateSupplementalOrderDone"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Amend Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 6,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"enableActionMessage\":false,\"enableDefaultAbort\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"extraPayload\":{\"cartId\":\"%ContextId%\",\"supplementalOrderType\":\"amend\"},\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureGoBackLabel\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":\"\",\"message\":{},\"postMessage\":null,\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"pubsub\":false,\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"createFollowOnOrder\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"CreateFollowOnOrder\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":{\"group\":{\"operator\":\"OR\",\"rules\":[{\"condition\":\"=\",\"data\":\"FollowOnYes\",\"field\":\"PreValidateFailure:FollowOnOrderConfirmation\"}]}},\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":\"Step\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "CreateFollowOnOrder",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/CreateFollowOnOrder"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Amend Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 7,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"Outcome\":\"\",\"consoleTabLabel\":null,\"controlWidth\":12,\"disOnTplt\":false,\"label\":\"\",\"message\":{\"\":\"\"},\"pubsub\":false,\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":{\"group\":{\"operator\":\"OR\",\"rules\":[{\"condition\":\"=\",\"data\":\"FollowOnYes\",\"field\":\"PreValidateFailure:FollowOnOrderConfirmation\"}]}},\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%CreateFollowOnOrder:records|1:followOnOrderId%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":null,\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "CreateFollowOnOrderDone",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/CreateFollowOnOrderDone"
                            },
                            {
                                "%vlocity_namespace%__Active__c": false,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Amend Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 8,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"enableDefaultAbort\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"extraPayload\":{\"cartId\":\"%ContextId%\"},\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureGoBackLabel\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":\"\",\"message\":{},\"postMessage\":null,\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"unfreezeOrder\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":{\"group\":{\"operator\":\"OR\",\"rules\":[{\"condition\":\"=\",\"data\":\"SupplementalNo\",\"field\":\"PreValidateSuccess:SupplementalOrderConfirmation\"}]}},\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":\"Step\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "UnfreezeCurrentOrder",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/UnfreezeCurrentOrder"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Amend Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 9,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"Outcome\":\"\",\"consoleTabLabel\":null,\"controlWidth\":12,\"disOnTplt\":false,\"label\":\"\",\"message\":{},\"pubsub\":false,\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":null,\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%ContextId%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":null,\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "RedirectToCurrentOrderCart",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/RedirectToCurrentOrderCart"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Amend Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "CPQ Amend Order",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "PreValidateFailure",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/PreValidateFailure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "PreValidateFailure",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"accessibleInFutureSteps\":false,\"conditionType\":\"Hide if False\",\"controlWidth\":12,\"controllingField\":{\"element\":\"\",\"source\":\"\",\"type\":\"\"},\"defaultValue\":null,\"disOnTplt\":false,\"enableCaption\":true,\"help\":false,\"helpText\":\"\",\"hide\":false,\"horizontalMode\":false,\"imageCountInRow\":3,\"label\":\"UserPromptCreateFollowOnOrder\",\"optionHeight\":100,\"optionSource\":{\"source\":\"\",\"type\":\"\"},\"optionWidth\":100,\"options\":[{\"autoAdv\":\"next\",\"name\":\"FollowOnYes\",\"value\":\"FollowOnYes\"},{\"autoAdv\":\"next\",\"name\":\"FollowOnNo\",\"value\":\"FollowOnNo\"}],\"readOnly\":false,\"repeat\":false,\"repeatClone\":false,\"repeatLimit\":null,\"required\":false,\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"PreValidate:records|1:isPONR\"}]}}}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Radio",
                                "Name": "FollowOnOrderConfirmation",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/FollowOnOrderConfirmation"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Amend Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "CPQ Amend Order",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "PreValidateSuccess",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/PreValidateSuccess",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "PreValidateSuccess",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"accessibleInFutureSteps\":false,\"conditionType\":\"Hide if False\",\"controlWidth\":12,\"controllingField\":{\"element\":\"\",\"source\":\"\",\"type\":\"\"},\"defaultValue\":null,\"disOnTplt\":false,\"enableCaption\":true,\"help\":false,\"helpText\":\"\",\"hide\":false,\"horizontalMode\":false,\"imageCountInRow\":3,\"label\":\"UserPromptCreateSupplementalOrder\",\"optionHeight\":100,\"optionSource\":{\"source\":\"\",\"type\":\"\"},\"optionWidth\":100,\"options\":[{\"autoAdv\":\"next\",\"name\":\"SupplementalYes\",\"value\":\"SupplementalYes\"},{\"autoAdv\":\"next\",\"name\":\"SupplementalNo\",\"value\":\"SupplementalNo\"}],\"readOnly\":false,\"repeat\":false,\"repeatClone\":false,\"repeatLimit\":null,\"required\":false,\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"PreValidate:records|1:isPONR\"}]}}}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Radio",
                                "Name": "SupplementalOrderConfirmation",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/SupplementalOrderConfirmation"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Amend Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "CPQ Amend Order",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "PreValidateFailure",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/PreValidateFailure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "PreValidateFailure",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"dataJSON\":false,\"disOnTplt\":false,\"label\":\"OrderFreezeErrorOccurred\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"ERROR\",\"field\":\"PreValidate:messages|1:severity\"},{\"condition\":\"=\",\"data\":\"false\",\"field\":\"PreValidate:records|1:isPONR\"}]}},\"text\":\"<p>%OrderFreezeErrorOccurred%</p>\\n<p>%PreValidate:messages|1:message%</p>\",\"textKey\":\"\"}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Text Block",
                                "Name": "DisplayErrors",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__Element__c/DisplayErrors"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsLwcEnabled__c": false,
                        "%vlocity_namespace%__IsProcedure__c": false,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "Multi-Language",
                        "%vlocity_namespace%__LastPreviewPage__c": "",
                        "%vlocity_namespace%__LwcId__c": "f7d123f0-d1b8-9544-7760-1f19f7a6bb32",
                        "%vlocity_namespace%__ProcedureKey__c": "",
                        "%vlocity_namespace%__ProcedureResponseCacheType__c": "",
                        "%vlocity_namespace%__PropertySet__c": "{\"allowCancel\":false,\"allowSaveForLater\":false,\"autoFocus\":false,\"autoSaveOnStepNext\":false,\"bLK\":false,\"cancelRedirectPageName\":\"OmniScriptCancelled\",\"cancelRedirectTemplateUrl\":\"vlcCancelled.html\",\"cancelSource\":\"%ContextId%\",\"cancelType\":\"SObject\",\"consoleTabIcon\":\"custom:custom18\",\"consoleTabLabel\":null,\"consoleTabTitle\":null,\"currencyCode\":\"\",\"disableUnloadWarn\":true,\"elementTypeToHTMLTemplateMapping\":{},\"enableKnowledge\":false,\"errorMessage\":{\"custom\":[]},\"hideStepChart\":false,\"knowledgeArticleTypeQueryFieldsMap\":{},\"lkObjName\":null,\"message\":{},\"persistentComponent\":[{\"id\":\"vlcCart\",\"itemsKey\":\"cartItems\",\"label\":null,\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\"},{\"id\":\"vlcKnowledge\",\"itemsKey\":\"knowledgeItems\",\"label\":null,\"modalConfigurationSetting\":{\"modalController\":\"\",\"modalHTMLTemplateId\":\"\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false}],\"pubsub\":false,\"rtpSeed\":false,\"saveContentEncoded\":false,\"saveExpireInDays\":null,\"saveForLaterRedirectPageName\":\"sflRedirect\",\"saveForLaterRedirectTemplateUrl\":\"vlcSaveForLaterAcknowledge.html\",\"saveNameTemplate\":null,\"saveObjectId\":\"%ContextId%\",\"saveURLPatterns\":{},\"seedDataJSON\":{},\"showInputWidth\":false,\"ssm\":false,\"timeTracking\":false,\"trackingCustomData\":{},\"visualforcePagesAvailableInPreview\":{},\"wpm\":false}",
                        "%vlocity_namespace%__RequiredPermission__c": "",
                        "%vlocity_namespace%__SubType__c": "AmendOrder",
                        "%vlocity_namespace%__Type__c": "CPQ",
                        "%vlocity_namespace%__Version__c": 2,
                        "Name": "CPQ Amend Order",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/CPQ_AmendOrder_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/AmendOrder/Multi-Language"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/CPQ_AmendOrder_Multi-Language",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/CPQ_AmendOrder_Multi-Language",
            "VlocityDataPackName": "CPQ_AmendOrder_Multi-Language",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "Submits the discounts for approval",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "ApproveDiscounts",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_ApproveDiscounts_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/ApproveDiscounts/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"extraPayload\":{},\"failureAbortLabel\":\"\",\"failureAbortMessage\":\"\",\"failureNextLabel\":\"\",\"inProgressMessage\":\"\",\"integrationProcedureKey\":\"CPQ_SubmitDiscountsForApproval\",\"label\":\"\",\"message\":{},\"postMessage\":\"\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":\"\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteOptions\":{\"chainable\":false,\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"useFuture\":false},\"remoteTimeout\":30000,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"useContinuation\":false,\"validationRequired\":null,\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Integration Procedure Action",
                                "Name": "CallSubmitDiscountsVIP",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_ApproveDiscounts_Multi-Language/%vlocity_namespace%__Element__c/CallSubmitDiscountsVIP"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "ApproveDiscounts",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_ApproveDiscounts_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/ApproveDiscounts/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"Outcome\":\"\",\"Type__c\":{\"label\":\"Done Action\",\"type\":\"action\"},\"allowSaveForLater\":true,\"autoFocus\":false,\"autoSaveOnStepNext\":false,\"bLK\":false,\"cancelRedirectPageName\":\"OmniScriptCancelled\",\"cancelRedirectTemplateUrl\":\"vlcCancelled.html\",\"cancelSource\":\"%ContextId%\",\"cancelType\":\"SObject\",\"consoleTabIcon\":\"custom:custom18\",\"consoleTabLabel\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"elementTypeToHTMLTemplateMapping\":{},\"enableKnowledge\":false,\"hideStepChart\":false,\"knowledgeArticleTypeQueryFieldsMap\":{},\"label\":null,\"message\":{},\"persistentComponent\":[{\"id\":\"vlcCart\",\"itemsKey\":\"cartItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\"},{\"id\":\"vlcKnowledge\",\"itemsKey\":\"knowledgeItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"\",\"modalHTMLTemplateId\":\"\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false}],\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"rtpSeed\":false,\"saveContentEncoded\":false,\"saveForLaterRedirectPageName\":\"sflRedirect\",\"saveForLaterRedirectTemplateUrl\":\"vlcSaveForLaterAcknowledge.html\",\"saveObjectId\":\"%ContextId%\",\"saveURLPatterns\":{},\"seedDataJSON\":{},\"show\":null,\"showInputWidth\":false,\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%ContextId%\",\"ssm\":false,\"timeTracking\":false,\"trackingCustomData\":{},\"type\":\"URL\",\"validationRequired\":null,\"visualforcePagesAvailableInPreview\":{},\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "Return to Hybrid CPQ",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_ApproveDiscounts_Multi-Language/%vlocity_namespace%__Element__c/Return to Hybrid CPQ"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsProcedure__c": false,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "Multi-Language",
                        "%vlocity_namespace%__LastPreviewPage__c": "",
                        "%vlocity_namespace%__ProcedureKey__c": "",
                        "%vlocity_namespace%__PropertySet__c": "{\"allowSaveForLater\":true,\"autoFocus\":false,\"autoSaveOnStepNext\":false,\"bLK\":false,\"cancelRedirectPageName\":\"OmniScriptCancelled\",\"cancelRedirectTemplateUrl\":\"vlcCancelled.html\",\"cancelSource\":\"%ContextId%\",\"cancelType\":\"SObject\",\"consoleTabIcon\":\"custom:custom18\",\"consoleTabLabel\":\"New\",\"consoleTabTitle\":null,\"currencyCode\":\"\",\"elementTypeToHTMLTemplateMapping\":{},\"enableKnowledge\":false,\"hideStepChart\":false,\"knowledgeArticleTypeQueryFieldsMap\":{},\"lkObjName\":null,\"message\":{},\"persistentComponent\":[{\"id\":\"vlcCart\",\"itemsKey\":\"cartItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\"},{\"id\":\"vlcKnowledge\",\"itemsKey\":\"knowledgeItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"\",\"modalHTMLTemplateId\":\"\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false}],\"rtpSeed\":false,\"saveContentEncoded\":false,\"saveExpireInDays\":null,\"saveForLaterRedirectPageName\":\"sflRedirect\",\"saveForLaterRedirectTemplateUrl\":\"vlcSaveForLaterAcknowledge.html\",\"saveNameTemplate\":null,\"saveObjectId\":\"%ContextId%\",\"saveURLPatterns\":{},\"seedDataJSON\":{},\"showInputWidth\":false,\"ssm\":false,\"timeTracking\":false,\"trackingCustomData\":{},\"visualforcePagesAvailableInPreview\":{},\"wpm\":false}",
                        "%vlocity_namespace%__SubType__c": "ApproveDiscounts",
                        "%vlocity_namespace%__Type__c": "CPQ",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "ApproveDiscounts",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/CPQ_ApproveDiscounts_Multi-Language/%vlocity_namespace%__OmniScript__c/CPQ/ApproveDiscounts/Multi-Language"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/CPQ_ApproveDiscounts_Multi-Language",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/CPQ_ApproveDiscounts_Multi-Language",
            "VlocityDataPackName": "CPQ_ApproveDiscounts_Multi-Language",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__DisableMetadataCache__c": false,
                        "%vlocity_namespace%__ElementTypeToHTMLTemplateList__c": "{\"ElementTypeToHTMLTemplateList\":[]}",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Cancel Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"enableActionMessage\":false,\"enableDefaultAbort\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"extraPayload\":{\"cartId\":\"%ContextId%\"},\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureGoBackLabel\":\"Go Back\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"Prevalidate API Call\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"pubsub\":false,\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"preValidate\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"PreValidate\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":\"Step\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "Prevalidate",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__Element__c/Prevalidate"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Cancel Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"allowSaveForLater\":true,\"cancelLabel\":\"Cancel\",\"cancelMessage\":\"Are you sure?\",\"chartLabel\":null,\"completeLabel\":\"Complete\",\"completeMessage\":\"Are you sure you want to complete the script?\",\"conditionType\":\"Hide if False\",\"disOnTplt\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"instruction\":\"\",\"instructionKey\":\"\",\"knowledgeOptions\":{\"dataCategoryCriteria\":\"\",\"keyword\":\"\",\"language\":\"English\",\"publishStatus\":\"Online\",\"remoteTimeout\":30000,\"typeFilter\":\"\"},\"label\":\"Prevalidate results\",\"nextLabel\":\"Next\",\"nextWidth\":3,\"previousLabel\":\"Previous\",\"previousWidth\":3,\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{},\"remoteTimeout\":30000,\"saveLabel\":\"Save for later\",\"saveMessage\":\"Are you sure you want to save it for later?\",\"show\":{\"group\":{\"operator\":\"OR\",\"rules\":[{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"PreValidate:records|1:isPONR\"},{\"condition\":\"<>\",\"data\":null,\"field\":\"PreValidate\"}]}},{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"ERROR\",\"field\":\"PreValidate:messages|1:severity\"}]}},{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"PreValidate:records|1:didAnyOrderItemReachPONR\"}]}}]}},\"showPersistentComponent\":[false,false],\"validationRequired\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Step",
                                "Name": "PrevalidateMessage",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__Element__c/PrevalidateMessage"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Cancel Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"enableActionMessage\":false,\"enableDefaultAbort\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"extraPayload\":{\"cartId\":\"%ContextId%\",\"intent\":\"Cancel\"},\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureGoBackLabel\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":null,\"message\":{},\"postMessage\":null,\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"pubsub\":false,\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"createSupplementalOrder\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"CreateSupplementalOrder\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"PreValidate:records|1:isPONR\"},{\"condition\":\"<>\",\"data\":\"ERROR\",\"field\":\"PreValidate:messages|1:severity\"}]}},\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":\"Step\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "CreateSupplementalOrder",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__Element__c/CreateSupplementalOrder"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Cancel Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 4,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"Outcome\":\"\",\"consoleTabLabel\":null,\"controlWidth\":12,\"disOnTplt\":false,\"label\":null,\"message\":{\"\":\"\"},\"pubsub\":false,\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"PreValidate:records|1:isPONR\"},{\"condition\":\"<>\",\"data\":\"ERROR\",\"field\":\"PreValidate:messages|1:severity\"}]}},\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%CreateSupplementalOrder:records|1:supplementalOrderId%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":null,\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "CreateSupplementalOrderDone",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__Element__c/CreateSupplementalOrderDone"
                            },
                            {
                                "%vlocity_namespace%__Active__c": false,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Cancel Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 5,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"enableActionMessage\":false,\"enableDefaultAbort\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"extraPayload\":{\"cartId\":\"%ContextId%\"},\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureGoBackLabel\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":\"Unfreeze order\",\"message\":{},\"postMessage\":null,\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"pubsub\":false,\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"unfreezeOrder\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"CreateSupplementalOrder\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":\"Step\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "UnfreezeOrder",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__Element__c/UnfreezeOrder"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Cancel Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 6,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"Outcome\":\"\",\"consoleTabLabel\":null,\"controlWidth\":12,\"disOnTplt\":false,\"label\":null,\"message\":{},\"pubsub\":false,\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":null,\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%ContextId%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":null,\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "RedirectToCurrentOrder",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__Element__c/RedirectToCurrentOrder"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Cancel Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "CPQ Cancel Order",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "PrevalidateMessage",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__Element__c/PrevalidateMessage",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "PrevalidateMessage",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"dataJSON\":true,\"disOnTplt\":false,\"label\":\"Unable to cancel the order\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"PreValidate:records|1:isPONR\"}]}},\"text\":\"<p>The order has reached Point of No Return. A&nbsp;Follow On order can be created by clicking on Amend button.</p>\",\"textKey\":\"\"}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Text Block",
                                "Name": "DisplayErrors",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__Element__c/DisplayErrors"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Cancel Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "CPQ Cancel Order",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "PrevalidateMessage",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__Element__c/PrevalidateMessage",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "PrevalidateMessage",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"dataJSON\":true,\"disOnTplt\":false,\"label\":\"Unable to cancel the order\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"PreValidate:records|1:isPONR\"},{\"condition\":\"=\",\"data\":\"true\",\"field\":\"PreValidate:records|1:didAnyOrderItemReachPONR\"},{\"condition\":\"<>\",\"data\":\"ERROR\",\"field\":\"PreValidate:messages|1:severity\"}]}},\"text\":\"<p>There are some products that have reached Point of No Return.&nbsp;We will create a cancel order that has other items cancelled.</p>\",\"textKey\":\"\"}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Text Block",
                                "Name": "NotAllOIIsBeforePONR",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__Element__c/NotAllOIIsBeforePONR"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Cancel Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "CPQ Cancel Order",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "PrevalidateMessage",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__Element__c/PrevalidateMessage",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "PrevalidateMessage",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"dataJSON\":true,\"disOnTplt\":false,\"label\":\"Unable to cancel the order\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"PreValidate:records|1:isPONR\"},{\"condition\":\"=\",\"data\":\"ERROR\",\"field\":\"PreValidate:messages|1:severity\"}]}},\"text\":\"<p>%PreValidate:messages|1:message%</p>\\n<p>%PreValidate:messages|2:message%</p>\\n<p>%PreValidate:messages|3:message%</p>\\n<p>%PreValidate:messages|4:message%</p>\\n<p>%PreValidate:messages|5:message%</p>\",\"textKey\":\"\"}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Text Block",
                                "Name": "DisplayAPIError",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__Element__c/DisplayAPIError"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsLwcEnabled__c": false,
                        "%vlocity_namespace%__IsProcedure__c": false,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "English",
                        "%vlocity_namespace%__LastPreviewPage__c": "",
                        "%vlocity_namespace%__LwcId__c": "58bd0cfd-04a1-0c3e-83d6-8dbb20b4c428",
                        "%vlocity_namespace%__ProcedureKey__c": "",
                        "%vlocity_namespace%__ProcedureResponseCacheType__c": "",
                        "%vlocity_namespace%__PropertySet__c": "{\"allowCancel\":false,\"allowSaveForLater\":false,\"autoFocus\":false,\"autoSaveOnStepNext\":false,\"bLK\":false,\"cancelRedirectPageName\":\"OmniScriptCancelled\",\"cancelRedirectTemplateUrl\":\"vlcCancelled.html\",\"cancelSource\":\"%ContextId%\",\"cancelType\":\"SObject\",\"consoleTabIcon\":\"custom:custom18\",\"consoleTabLabel\":null,\"consoleTabTitle\":null,\"currencyCode\":\"\",\"disableUnloadWarn\":true,\"elementTypeToHTMLTemplateMapping\":{},\"enableKnowledge\":false,\"errorMessage\":{\"custom\":[]},\"hideStepChart\":false,\"knowledgeArticleTypeQueryFieldsMap\":{},\"lkObjName\":null,\"message\":{},\"persistentComponent\":[{\"id\":\"vlcCart\",\"itemsKey\":\"cartItems\",\"label\":null,\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\"},{\"id\":\"vlcKnowledge\",\"itemsKey\":\"knowledgeItems\",\"label\":null,\"modalConfigurationSetting\":{\"modalController\":\"\",\"modalHTMLTemplateId\":\"\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false}],\"rtpSeed\":false,\"saveContentEncoded\":false,\"saveExpireInDays\":null,\"saveForLaterRedirectPageName\":\"sflRedirect\",\"saveForLaterRedirectTemplateUrl\":\"vlcSaveForLaterAcknowledge.html\",\"saveNameTemplate\":null,\"saveObjectId\":\"%ContextId%\",\"saveURLPatterns\":{},\"seedDataJSON\":{},\"showInputWidth\":false,\"ssm\":false,\"timeTracking\":false,\"trackingCustomData\":{},\"visualforcePagesAvailableInPreview\":{},\"wpm\":false}",
                        "%vlocity_namespace%__RequiredPermission__c": "",
                        "%vlocity_namespace%__SubType__c": "CancelOrder",
                        "%vlocity_namespace%__Type__c": "CPQ",
                        "%vlocity_namespace%__Version__c": 2,
                        "Name": "CPQ Cancel Order",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/CPQ_CancelOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CancelOrder/English"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/CPQ_CancelOrder_English",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/CPQ_CancelOrder_English",
            "VlocityDataPackName": "CPQ_CancelOrder_English",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "This OS calls CPQSubmit to create Order and Navigates to the Order Cart",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Create Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CreateOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CreateOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"extraPayload\":{},\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"Create Account Discounts\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"createAccountDiscounts\",\"remoteOptions\":{\"cartId\":\"%cartId%\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "Create Account Discounts",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CreateOrder_English/%vlocity_namespace%__Element__c/Create Account Discounts"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Create Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CreateOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CreateOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"extraPayload\":{},\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"Create Order\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"checkout\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "Create Order",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CreateOrder_English/%vlocity_namespace%__Element__c/Create Order"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Create Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CreateOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CreateOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"consoleTabLabel\":\"New\",\"controlWidth\":12,\"label\":\"Navigate to Order\",\"message\":{},\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":null,\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%records|1:id%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":\"Submit\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "Navigate to Order",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CreateOrder_English/%vlocity_namespace%__Element__c/Navigate to Order"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "English",
                        "%vlocity_namespace%__PropertySet__c": "{\"allowSaveForLater\":true,\"autoFocus\":false,\"autoSaveOnStepNext\":false,\"cancelRedirectPageName\":\"OmniScriptCancelled\",\"cancelRedirectTemplateUrl\":\"vlcCancelled.html\",\"cancelSource\":\"%ContextId%\",\"cancelType\":\"SObject\",\"consoleTabLabel\":\"New\",\"elementTypeToHTMLTemplateMapping\":{},\"enableKnowledge\":false,\"knowledgeArticleTypeQueryFieldsMap\":{},\"message\":{},\"persistentComponent\":[{\"id\":\"vlcCart\",\"itemsKey\":\"cartItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\"},{\"id\":\"vlcKnowledge\",\"itemsKey\":\"knowledgeItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"\",\"modalHTMLTemplateId\":\"\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false}],\"saveContentEncoded\":false,\"saveExpireInDays\":null,\"saveForLaterRedirectPageName\":\"sflRedirect\",\"saveForLaterRedirectTemplateUrl\":\"vlcSaveForLaterAcknowledge.html\",\"saveNameTemplate\":null,\"saveObjectId\":\"%ContextId%\",\"seedDataJSON\":{},\"ssm\":false,\"timeTracking\":true,\"trackingCustomData\":{},\"visualforcePagesAvailableInPreview\":{},\"wpm\":false}",
                        "%vlocity_namespace%__SubType__c": "CreateOrder",
                        "%vlocity_namespace%__Type__c": "CPQ",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "CPQ Create Order",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/CPQ_CreateOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/CreateOrder/English"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/CPQ_CreateOrder_English",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/CPQ_CreateOrder_English",
            "VlocityDataPackName": "CPQ_CreateOrder_English",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "This OS calls CPQSubmit to create Quote and Navigates to the Quote Cart",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Create Quote",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CreateQuote_English/%vlocity_namespace%__OmniScript__c/CPQ/CreateQuote/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"extraPayload\":{},\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"Create Account Discounts\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"createAccountDiscounts\",\"remoteOptions\":{\"cartId\":\"%cartId%\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "Create Account Discounts",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CreateQuote_English/%vlocity_namespace%__Element__c/Create Account Discounts"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Create Quote",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CreateQuote_English/%vlocity_namespace%__OmniScript__c/CPQ/CreateQuote/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"extraPayload\":{},\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"Create Quote\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"checkout\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "Create Quote",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CreateQuote_English/%vlocity_namespace%__Element__c/Create Quote"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Create Quote",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_CreateQuote_English/%vlocity_namespace%__OmniScript__c/CPQ/CreateQuote/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"consoleTabLabel\":\"New\",\"controlWidth\":12,\"label\":\"Navigate to Quote\",\"message\":{},\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":null,\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%records|1:id%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":\"Submit\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "Navigate to Quote",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_CreateQuote_English/%vlocity_namespace%__Element__c/Navigate to Quote"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "English",
                        "%vlocity_namespace%__PropertySet__c": "{\"allowSaveForLater\":true,\"autoFocus\":false,\"autoSaveOnStepNext\":false,\"cancelRedirectPageName\":\"OmniScriptCancelled\",\"cancelRedirectTemplateUrl\":\"vlcCancelled.html\",\"cancelSource\":\"%ContextId%\",\"cancelType\":\"SObject\",\"consoleTabLabel\":\"New\",\"elementTypeToHTMLTemplateMapping\":{},\"enableKnowledge\":false,\"knowledgeArticleTypeQueryFieldsMap\":{},\"message\":{},\"persistentComponent\":[{\"id\":\"vlcCart\",\"itemsKey\":\"cartItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\"},{\"id\":\"vlcKnowledge\",\"itemsKey\":\"knowledgeItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"\",\"modalHTMLTemplateId\":\"\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false}],\"saveContentEncoded\":false,\"saveExpireInDays\":null,\"saveForLaterRedirectPageName\":\"sflRedirect\",\"saveForLaterRedirectTemplateUrl\":\"vlcSaveForLaterAcknowledge.html\",\"saveNameTemplate\":null,\"saveObjectId\":\"%ContextId%\",\"seedDataJSON\":{},\"ssm\":false,\"timeTracking\":true,\"trackingCustomData\":{},\"visualforcePagesAvailableInPreview\":{},\"wpm\":false}",
                        "%vlocity_namespace%__SubType__c": "CreateQuote",
                        "%vlocity_namespace%__Type__c": "CPQ",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "CPQ Create Quote",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/CPQ_CreateQuote_English/%vlocity_namespace%__OmniScript__c/CPQ/CreateQuote/English"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/CPQ_CreateQuote_English",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/CPQ_CreateQuote_English",
            "VlocityDataPackName": "CPQ_CreateQuote_English",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "This Omniscript discards a supplemental order",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__ElementTypeToHTMLTemplateList__c": "{\"ElementTypeToHTMLTemplateList\":[]}",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "DiscardOrder",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_DiscardOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/DiscardOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"enableDefaultAbort\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"errorMessage:default\":\"\",\"extraPayload\":{\"cartId\":\"%ContextId%\"},\"failureAbortLabel\":\"\",\"failureAbortMessage\":\"\",\"failureGoBackLabel\":\"\",\"failureNextLabel\":\"\",\"inProgressMessage\":\"\",\"label\":null,\"message\":{},\"postMessage\":\"\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":\"\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CpqAppHandler\",\"remoteMethod\":\"discardOrder\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"DiscardOrder\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":\"Step\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "DiscardOrder",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_DiscardOrder_English/%vlocity_namespace%__Element__c/DiscardOrder"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "DiscardOrder",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_DiscardOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/DiscardOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"allowSaveForLater\":true,\"cancelLabel\":\"Cancel\",\"cancelMessage\":\"Are you sure?\",\"chartLabel\":null,\"completeLabel\":\"Complete\",\"completeMessage\":\"Are you sure you want to complete the script?\",\"conditionType\":\"Hide if False\",\"disOnTplt\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"instruction\":\"\",\"instructionKey\":\"\",\"knowledgeOptions\":{\"dataCategoryCriteria\":\"\",\"keyword\":\"\",\"language\":\"English\",\"publishStatus\":\"Online\",\"remoteTimeout\":30000,\"typeFilter\":\"\"},\"label\":\"Discard Order messages\",\"nextLabel\":\"Next\",\"nextWidth\":3,\"previousLabel\":\"Previous\",\"previousWidth\":3,\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{},\"remoteTimeout\":30000,\"saveLabel\":\"Save for later\",\"saveMessage\":\"Are you sure you want to save it for later?\",\"show\":null,\"showPersistentComponent\":[null,null],\"validationRequired\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Step",
                                "Name": "DiscardMessages",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_DiscardOrder_English/%vlocity_namespace%__Element__c/DiscardMessages"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "DiscardOrder",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_DiscardOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/DiscardOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"Outcome\":\"\",\"consoleTabLabel\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"errorMessage:default\":\"\",\"label\":null,\"message\":{},\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"INFO\",\"field\":\"DiscardOrder:messages|1:severity\"}]}},\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%DiscardOrder:records|1:SupersededOrderId%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":\"Submit\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "MoveToOriginalOrder",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_DiscardOrder_English/%vlocity_namespace%__Element__c/MoveToOriginalOrder"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "DiscardOrder",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_DiscardOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/DiscardOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 4,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"Outcome\":\"\",\"consoleTabLabel\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"errorMessage:default\":\"\",\"label\":null,\"message\":{},\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":null,\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%ContextId%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":\"Submit\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "MoveBackToSupplementalOrder",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_DiscardOrder_English/%vlocity_namespace%__Element__c/MoveBackToSupplementalOrder"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "DiscardOrder",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_DiscardOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/DiscardOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "DiscardOrder",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_DiscardOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/DiscardOrder/English",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "DiscardMessages",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "DiscardMessages",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"dataJSON\":false,\"disOnTplt\":false,\"label\":null,\"show\":null,\"text\":\"<p>%DiscardOrder:messages|1:message%</p>\\n<p>%DiscardOrder:messages|2:message%</p>\\n<p>%DiscardOrder:messages|3:message%</p>\\n<p>%DiscardOrder:messages|4:message%</p>\",\"textKey\":\"\"}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Text Block",
                                "Name": "DiscardOrderResult",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_DiscardOrder_English/%vlocity_namespace%__Element__c/DiscardOrderResult"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsProcedure__c": false,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "English",
                        "%vlocity_namespace%__LastPreviewPage__c": "",
                        "%vlocity_namespace%__ProcedureKey__c": "",
                        "%vlocity_namespace%__PropertySet__c": "{\"allowCancel\":false,\"allowSaveForLater\":false,\"autoFocus\":false,\"autoSaveOnStepNext\":false,\"bLK\":false,\"cancelRedirectPageName\":\"OmniScriptCancelled\",\"cancelRedirectTemplateUrl\":\"vlcCancelled.html\",\"cancelSource\":\"%ContextId%\",\"cancelType\":\"SObject\",\"consoleTabIcon\":\"custom:custom18\",\"consoleTabLabel\":\"New\",\"consoleTabTitle\":null,\"currencyCode\":\"\",\"disableUnloadWarn\":true,\"elementTypeToHTMLTemplateMapping\":{},\"enableKnowledge\":false,\"errorMessage\":{\"custom\":[]},\"hideStepChart\":false,\"knowledgeArticleTypeQueryFieldsMap\":{},\"lkObjName\":null,\"message\":{},\"persistentComponent\":[{\"id\":\"vlcCart\",\"itemsKey\":\"cartItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\"},{\"id\":\"vlcKnowledge\",\"itemsKey\":\"knowledgeItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"\",\"modalHTMLTemplateId\":\"\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false}],\"rtpSeed\":false,\"saveContentEncoded\":false,\"saveExpireInDays\":null,\"saveForLaterRedirectPageName\":\"sflRedirect\",\"saveForLaterRedirectTemplateUrl\":\"vlcSaveForLaterAcknowledge.html\",\"saveNameTemplate\":null,\"saveObjectId\":\"%ContextId%\",\"saveURLPatterns\":{},\"seedDataJSON\":{},\"showInputWidth\":false,\"ssm\":false,\"timeTracking\":false,\"trackingCustomData\":{},\"visualforcePagesAvailableInPreview\":{},\"wpm\":false}",
                        "%vlocity_namespace%__SubType__c": "DiscardOrder",
                        "%vlocity_namespace%__Type__c": "CPQ",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "DiscardOrder",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/CPQ_DiscardOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/DiscardOrder/English"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/CPQ_DiscardOrder_English",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/CPQ_DiscardOrder_English",
            "VlocityDataPackName": "CPQ_DiscardOrder_English",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "",
                        "%vlocity_namespace%__CustomJavaScript__c": "{\"cartId\":\"0Q01U000000cECA\"}",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__ElementTypeToHTMLTemplateList__c": "{\"ElementTypeToHTMLTemplateList\":[]}",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "SubmitDiscountsForApproval",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitDiscountsForApproval/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"actionMessage\":\"\",\"additionalInput\":{\"cartId\":\"%ContextId%\"},\"additionalOutput\":{},\"chainOnStep\":false,\"disOnTplt\":false,\"executionConditionalFormula\":\"\",\"failOnStepError\":true,\"failureConditionalFormula\":\"\",\"failureResponse\":{},\"label\":\"RemoteAction1\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"submitDiscountsForApproval\",\"remoteOptions\":{},\"responseJSONNode\":\"\",\"responseJSONPath\":\"messages|1\",\"returnOnlyAdditionalOutput\":false,\"returnOnlyFailureResponse\":false,\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"sendOnlyAdditionalInput\":false,\"show\":null,\"useFormulas\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "Submit Discounts for Approval",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__Element__c/Submit Discounts for Approval"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "SubmitDiscountsForApproval",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitDiscountsForApproval/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"actionMessage\":\"\",\"chainOnStep\":false,\"disOnTplt\":false,\"elementValueMap\":{\"message\":\"%Submit Discounts for Approval:message%\",\"submitSuccessful\":\"=IF (%Submit Discounts for Approval:severity% = 'INFO', 'True', 'False')\"},\"executionConditionalFormula\":\"\",\"failOnStepError\":true,\"failureConditionalFormula\":\"\",\"label\":\"SetValues1\",\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Set Values",
                                "Name": "isSubmitSuccessful",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__Element__c/isSubmitSuccessful"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "SubmitDiscountsForApproval",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitDiscountsForApproval/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"additionalOutput\":{\"isSubmitSuccessful\":\"%isSubmitSuccessful:submitSuccessful%\",\"responseMessage\":\"%isSubmitSuccessful:message%\"},\"disOnTplt\":false,\"executionConditionalFormula\":\"\",\"label\":\"ResponseAction1\",\"responseDefaultData\":{},\"responseFormat\":\"JSON\",\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"returnFullDataJSON\":false,\"returnOnlyAdditionalOutput\":false,\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"useFormulas\":true,\"vlcResponseHeaders\":{}}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Response Action",
                                "Name": "Return response",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__Element__c/Return response"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsProcedure__c": true,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "Procedure",
                        "%vlocity_namespace%__LastPreviewPage__c": "",
                        "%vlocity_namespace%__ProcedureKey__c": "CPQ_SubmitDiscountsForApproval",
                        "%vlocity_namespace%__PropertySet__c": "{\"chainableCpuLimit\":2000,\"chainableDMLRowsLimit\":null,\"chainableDMLStatementsLimit\":null,\"chainableHeapSizeLimit\":null,\"chainableQueriesLimit\":50,\"chainableQueryRowsLimit\":null,\"chainableSoslQueriesLimit\":null,\"columnsPropertyMap\":[],\"description\":\"\",\"includeAllActionsInResponse\":false,\"labelPlural\":\"\",\"labelSingular\":\"\",\"linkToExternalObject\":\"\",\"nameColumn\":\"\",\"relationshipFieldsMap\":[],\"rollbackOnError\":false,\"trackingCustomData\":{}}",
                        "%vlocity_namespace%__SubType__c": "SubmitDiscountsForApproval",
                        "%vlocity_namespace%__Type__c": "CPQ",
                        "%vlocity_namespace%__Version__c": 2,
                        "Name": "SubmitDiscountsForApproval",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitDiscountsForApproval_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitDiscountsForApproval/Procedure"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/CPQ_SubmitDiscountsForApproval_Procedure",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/CPQ_SubmitDiscountsForApproval_Procedure",
            "VlocityDataPackName": "CPQ_SubmitDiscountsForApproval_Procedure",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__DisableMetadataCache__c": false,
                        "%vlocity_namespace%__ElementTypeToHTMLTemplateList__c": "{\"ElementTypeToHTMLTemplateList\":[]}",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"enableDefaultAbort\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"extraPayload\":{\"cartId\":\"%cartId%\"},\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureGoBackLabel\":\"Go Back\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"Create Account Discounts\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"createAccountDiscounts\",\"remoteOptions\":{\"\":\"\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"createAccountDiscounts\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "Create Account Discounts",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/Create Account Discounts"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"enableActionMessage\":false,\"enableDefaultAbort\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"extraPayload\":{\"cartId\":\"%ContextId%\"},\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureGoBackLabel\":\"Go Back\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"canSubmitOrder\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"pubsub\":false,\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"SubmitOrderService\",\"remoteMethod\":\"canSubmitOrder\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"canSubmitOrder\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"INFO\",\"field\":\"createAccountDiscounts:messages|1:severity\"}]}},\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":\"Step\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "canSubmitOrder",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/canSubmitOrder"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 5,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"enableActionMessage\":false,\"enableDefaultAbort\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"extraPayload\":{\"ContextId\":\"%ContextId%\",\"cartId\":\"%ContextId%\",\"orderId\":\"%ContextId%\",\"skipCheckoutValidation\":true},\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureGoBackLabel\":\"Go Back\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"checkout\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"pubsub\":false,\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"checkout\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"checkout\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"canSubmitOrder:canSubmitOrder\"},{\"condition\":\"=\",\"data\":\"INFO\",\"field\":\"createAccountDiscounts:messages|1:severity\"}]}},\"showPersistentComponent\":[false,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"toastComplete\":true,\"validationRequired\":null,\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "checkout",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/checkout"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 6,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"allowSaveForLater\":true,\"cancelLabel\":\"Cancel\",\"cancelMessage\":\"Are you sure?\",\"chartLabel\":null,\"completeLabel\":\"Complete\",\"completeMessage\":\"Are you sure you want to complete the script?\",\"conditionType\":\"Hide if False\",\"disOnTplt\":false,\"errorMessage\":{\"custom\":[],\"default\":null},\"instruction\":\"\",\"instructionKey\":\"\",\"knowledgeOptions\":{\"dataCategoryCriteria\":\"\",\"keyword\":\"\",\"language\":\"English\",\"publishStatus\":\"Online\",\"remoteTimeout\":30000,\"typeFilter\":\"\"},\"label\":\"Order Submission Results\",\"nextLabel\":\"Next\",\"nextWidth\":3,\"previousLabel\":\"Previous\",\"previousWidth\":3,\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{},\"remoteTimeout\":30000,\"saveLabel\":\"Save for later\",\"saveMessage\":\"Are you sure you want to save it for later?\",\"show\":null,\"showPersistentComponent\":[false,false],\"validationRequired\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Step",
                                "Name": "ResultsGroup",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/ResultsGroup"
                            },
                            {
                                "%vlocity_namespace%__Active__c": false,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 7,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"Outcome\":\"\",\"consoleTabLabel\":\"New\",\"controlWidth\":12,\"disOnTplt\":false,\"label\":\"redirectToOrderDecomposition\",\"message\":{},\"pubsub\":false,\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"canSubmitOrder:canSubmitOrder\"},{\"condition\":\"=\",\"data\":\"false\",\"field\":\"canSubmitOrder:hasError\"},{\"condition\":\"=\",\"data\":\"INFO\",\"field\":\"createAccountDiscounts:messages|1:severity\"},{\"condition\":\"=\",\"data\":\"INFO\",\"field\":\"checkout:messages|1:severity\"}]}},\"source\":\"/apex/%vlocity_namespace%__XOMViewOrderDecomposition?id=%ContextId%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":\"Submit\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "Redirect to Order Decomposition page",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/Redirect to Order Decomposition page"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 8,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"Outcome\":\"\",\"consoleTabLabel\":\"New\",\"controlWidth\":12,\"disOnTplt\":false,\"label\":\"Navigate to Account\",\"message\":{},\"pubsub\":false,\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"canSubmitOrder:canSubmitOrder\"},{\"condition\":\"=\",\"data\":\"false\",\"field\":\"canSubmitOrder:hasError\"},{\"condition\":\"=\",\"data\":\"INFO\",\"field\":\"createAccountDiscounts:messages|1:severity\"},{\"condition\":\"=\",\"data\":\"INFO\",\"field\":\"checkout:messages|1:severity\"}]}},\"source\":\"%AccountId%\",\"ssm\":false,\"type\":\"SObject\",\"validationRequired\":null,\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "Navigate to Account",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/Navigate to Account"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 9,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"consoleTabLabel\":\"New\",\"controlWidth\":12,\"disOnTplt\":false,\"label\":\"Navigate to Order\",\"message\":{},\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":{\"group\":{\"operator\":\"OR\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"canSubmitOrder:canSubmitOrder\"},{\"condition\":\"=\",\"data\":\"true\",\"field\":\"canSubmitOrder:hasError\"},{\"condition\":\"<>\",\"data\":\"INFO\",\"field\":\"createAccountDiscounts:messages|1:severity\"},{\"condition\":\"<>\",\"data\":\"INFO\",\"field\":\"checkout\"}]}},\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%ContextId%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":\"Submit\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "Navigate to Order",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/Navigate to Order"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "Submit Order",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "ResultsGroup",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/ResultsGroup",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "ResultsGroup",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"label\":\"<p>%canSubmitOrder:message%</p>\",\"labelKey\":\"\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"canSubmitOrder:canSubmitOrder\"}]}}}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Headline",
                                "Name": "OrderQueuingResult",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/OrderQueuingResult"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 9,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "Submit Order",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "ResultsGroup",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/ResultsGroup",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "ResultsGroup",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"label\":\"<p>%checkout:messages|1:message%</p>\\n<p>%checkout:messages|2:message%</p>\\n<p>%checkout:messages|3:message%</p>\\n<p>%checkout:messages|4:message%</p>\\n<p>%checkout:messages|5:message%</p>\\n<p>%checkout:messages|6:message%</p>\\n<p>%checkout:messages|7:message%</p>\\n<p>%checkout:messages|8:message%</p>\\n<p>%checkout:messages|9:message%</p>\\n<p>%checkout:messages|10:message%</p>\\n<div id=\\\"gtx-trans\\\" style=\\\"position: absolute; left: -179px; top: -20px;\\\">&nbsp;</div>\",\"labelKey\":\"\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"canSubmitOrder:canSubmitOrder\"}]}}}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Headline",
                                "Name": "OrderSubmissionResults",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/OrderSubmissionResults"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"dataJSON\":false,\"disOnTplt\":false,\"label\":\"Create Account Discounts Failed\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"<>\",\"data\":\"INFO\",\"field\":\"createAccountDiscounts:messages|1:severity\"}]}},\"text\":\"\",\"textKey\":\"\"}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Text Block",
                                "Name": "createAccountDiscountsFailure",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/createAccountDiscountsFailure"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 4,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"dataJSON\":false,\"disOnTplt\":false,\"label\":\"Validation of order failed, Error occurred when attempting to check if the order can be submitted.\",\"show\":{\"group\":{\"operator\":\"OR\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"canSubmitOrder:canSubmitOrder\"},{\"condition\":\"=\",\"data\":\"true\",\"field\":\"canSubmitOrder:hasError\"}]}},\"text\":\"<p><span style=\\\"color: #ff0000;\\\">ERROR Message</span>:</p>\\n<p>%canSubmitOrder:messages|0:message%</p>\",\"textKey\":\"\"}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Text Block",
                                "Name": "canSubmitOrderFailure",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__Element__c/canSubmitOrderFailure"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsLwcEnabled__c": false,
                        "%vlocity_namespace%__IsProcedure__c": false,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "English",
                        "%vlocity_namespace%__LastPreviewPage__c": "",
                        "%vlocity_namespace%__ProcedureKey__c": "",
                        "%vlocity_namespace%__ProcedureResponseCacheType__c": "",
                        "%vlocity_namespace%__PropertySet__c": "{\"allowCancel\":false,\"allowSaveForLater\":false,\"autoFocus\":false,\"autoSaveOnStepNext\":false,\"bLK\":false,\"cancelRedirectPageName\":\"OmniScriptCancelled\",\"cancelRedirectTemplateUrl\":\"vlcCancelled.html\",\"cancelSource\":\"%ContextId%\",\"cancelType\":\"SObject\",\"consoleTabIcon\":\"custom:custom18\",\"consoleTabLabel\":\"New\",\"consoleTabTitle\":null,\"currencyCode\":\"\",\"disableUnloadWarn\":true,\"elementTypeToHTMLTemplateMapping\":{},\"enableKnowledge\":false,\"errorMessage\":{\"custom\":[]},\"hideStepChart\":false,\"knowledgeArticleTypeQueryFieldsMap\":{},\"lkObjName\":null,\"message\":{},\"persistentComponent\":[{\"id\":\"vlcCart\",\"itemsKey\":\"cartItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\"},{\"id\":\"vlcKnowledge\",\"itemsKey\":\"knowledgeItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"\",\"modalHTMLTemplateId\":\"\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false}],\"pubsub\":false,\"rtpSeed\":false,\"saveContentEncoded\":false,\"saveExpireInDays\":null,\"saveForLaterRedirectPageName\":\"sflRedirect\",\"saveForLaterRedirectTemplateUrl\":\"vlcSaveForLaterAcknowledge.html\",\"saveNameTemplate\":null,\"saveObjectId\":\"%ContextId%\",\"saveURLPatterns\":{},\"seedDataJSON\":{},\"showInputWidth\":false,\"ssm\":false,\"timeTracking\":false,\"trackingCustomData\":{},\"visualforcePagesAvailableInPreview\":{},\"wpm\":false}",
                        "%vlocity_namespace%__RequiredPermission__c": "",
                        "%vlocity_namespace%__SubType__c": "SubmitOrder",
                        "%vlocity_namespace%__Type__c": "CPQ",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Submit Order",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_English/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/English"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/CPQ_SubmitOrder_English",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/CPQ_SubmitOrder_English",
            "VlocityDataPackName": "CPQ_SubmitOrder_English",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "",
                        "%vlocity_namespace%__CustomJavaScript__c": "{\"ContextId\":\"801f2000000CfMV\",\"cartId\":\"801f2000000CfMV\"}",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__ElementTypeToHTMLTemplateList__c": "{\"ElementTypeToHTMLTemplateList\":[]}",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"actionMessage\":\"\",\"chainOnStep\":false,\"disOnTplt\":false,\"elementValueMap\":{\"createAssetsFlow\":\"CPQ\"},\"executionConditionalFormula\":\"\",\"failOnStepError\":true,\"failureConditionalFormula\":\"\",\"label\":\"SetValues1\",\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Set Values",
                                "Name": "CreateAssetsFlow-CPQ",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__Element__c/CreateAssetsFlow-CPQ"
                            },
                            {
                                "%vlocity_namespace%__Active__c": false,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"Type__c\":{\"label\":\"Set Values\",\"type\":\"action\"},\"actionMessage\":\"\",\"chainOnStep\":false,\"chainableCpuLimit\":2000,\"chainableQueriesLimit\":50,\"columnsPropertyMap\":[],\"disOnTplt\":false,\"elementValueMap\":{\"createAssetsFlow\":\"OM\"},\"executionConditionalFormula\":\"\",\"failOnStepError\":true,\"failureConditionalFormula\":\"\",\"includeAllActionsInResponse\":false,\"label\":\"SetValues3\",\"relationshipFieldsMap\":[],\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"rollbackOnError\":false,\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"trackingCustomData\":{}}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Set Values",
                                "Name": "CreateAssetsFlow-OM",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__Element__c/CreateAssetsFlow-OM"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"actionMessage\":\"\",\"chainOnStep\":false,\"disOnTplt\":false,\"elementValueMap\":{\"createAssetsFlow\":\"=IF(%CreateAssetsFlow-CPQ:createAssetsFlow% = 'CPQ', 'CPQ', IF(%CreateAssetsFlow-CPQ and OM:createAssetsFlow% = 'CPQ-OM','CPQ-OM',IF(%CreateAssetsFlow-OM:createAssetsFlow% = 'OM','OM','CPQ')))\"},\"executionConditionalFormula\":\"\",\"failOnStepError\":true,\"failureConditionalFormula\":\"\",\"label\":\"SetValues4\",\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Set Values",
                                "Name": "SetCreateAssetsValue",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__Element__c/SetCreateAssetsValue"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 4,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"additionalInput\":{\"cartId\":\"%ContextId%\"},\"additionalOutput\":{},\"chainOnStep\":false,\"disOnTplt\":false,\"executionConditionalFormula\":\"\",\"failOnStepError\":true,\"failureConditionalFormula\":\"\",\"failureResponse\":{},\"label\":\"RemoteAction1\",\"remoteClass\":\"SubmitOrderService\",\"remoteMethod\":\"canSubmitOrder\",\"remoteOptions\":{},\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"returnOnlyAdditionalOutput\":false,\"returnOnlyFailureResponse\":false,\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"sendOnlyAdditionalInput\":false,\"useFormulas\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "canSubmitOrder",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__Element__c/canSubmitOrder"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 5,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"additionalChainableResponse\":{},\"additionalInput\":{\"ContextId\":\"%ContextId%\",\"cartId\":\"%ContextId%\",\"orderId\":\"%ContextId%\"},\"additionalOutput\":{},\"chainOnStep\":false,\"disOnTplt\":false,\"executionConditionalFormula\":\"%canSubmitOrder:canSubmitOrder%=true AND %SetCreateAssetsValue:createAssetsFlow%='CPQ'\",\"failOnStepError\":true,\"failureConditionalFormula\":\"\",\"failureResponse\":{},\"label\":\"RemoteAction2\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"checkout\",\"remoteOptions\":{},\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"returnOnlyAdditionalOutput\":false,\"returnOnlyFailureResponse\":false,\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"sendOnlyAdditionalInput\":false,\"useFormulas\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "CheckoutWithCPQ",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__Element__c/CheckoutWithCPQ"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 6,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"additionalChainableResponse\":{},\"additionalInput\":{\"orderId\":\"%ContextId%\"},\"additionalOutput\":{},\"chainOnStep\":false,\"disOnTplt\":false,\"executionConditionalFormula\":\"%canSubmitOrder:canSubmitOrder%=true AND %SetCreateAssetsValue:createAssetsFlow%='OM'\",\"failOnStepError\":true,\"failureConditionalFormula\":\"\",\"failureResponse\":{},\"label\":\"RemoteAction3\",\"remoteClass\":\"XOMDecompositionController\",\"remoteMethod\":\"decompose\",\"remoteOptions\":{},\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"returnOnlyAdditionalOutput\":false,\"returnOnlyFailureResponse\":false,\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"sendOnlyAdditionalInput\":false,\"useFormulas\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "DecomposeAndSubmit",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__Element__c/DecomposeAndSubmit"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Submit Order",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/Procedure",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 7,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"additionalOutput\":{\"canSubmitOrder\":\"%canSubmitOrder:canSubmitOrder%\",\"canSubmitOrderMessage\":\"%canSubmitOrder:message%\",\"cpqCreateAssetsValue\":\"%SetCreateAssetsValue:createAssetsFlow%\",\"errorMessage\":\"%DecomposeAndSubmit:errorMessage%\",\"errorStatus\":\"%DecomposeAndSubmit:errorStatus%\",\"hasError\":\"%canSubmitOrder:hasError%\",\"message\":\"%CheckoutWithCPQ:messages|1%\"},\"disOnTplt\":false,\"executionConditionalFormula\":\"\",\"label\":\"ResponseAction1\",\"responseDefaultData\":{},\"responseFormat\":\"JSON\",\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"returnFullDataJSON\":false,\"returnOnlyAdditionalOutput\":false,\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"useFormulas\":true,\"vlcResponseHeaders\":{}}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Response Action",
                                "Name": "Set Response",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__Element__c/Set Response"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsProcedure__c": true,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "Procedure",
                        "%vlocity_namespace%__LastPreviewPage__c": "",
                        "%vlocity_namespace%__ProcedureKey__c": "CPQ_SubmitOrder",
                        "%vlocity_namespace%__PropertySet__c": "{\"additionalChainableResponse\":{},\"chainableCpuLimit\":2000,\"chainableDMLRowsLimit\":null,\"chainableDMLStatementsLimit\":null,\"chainableHeapSizeLimit\":null,\"chainableQueriesLimit\":50,\"chainableQueryRowsLimit\":null,\"chainableSoslQueriesLimit\":null,\"columnsPropertyMap\":[],\"description\":\"\",\"includeAllActionsInResponse\":false,\"labelPlural\":\"\",\"labelSingular\":\"\",\"linkToExternalObject\":\"\",\"nameColumn\":\"\",\"relationshipFieldsMap\":[],\"rollbackOnError\":false,\"trackingCustomData\":{}}",
                        "%vlocity_namespace%__SubType__c": "SubmitOrder",
                        "%vlocity_namespace%__Type__c": "CPQ",
                        "%vlocity_namespace%__Version__c": 2,
                        "Name": "Submit Order",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/CPQ_SubmitOrder_Procedure/%vlocity_namespace%__OmniScript__c/CPQ/SubmitOrder/Procedure"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/CPQ_SubmitOrder_Procedure",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/CPQ_SubmitOrder_Procedure",
            "VlocityDataPackName": "CPQ_SubmitOrder_Procedure",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "This OS calls CPQSubmit and Navigates to the Account View",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Submit",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_Submit_English/%vlocity_namespace%__OmniScript__c/CPQ/Submit/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 10,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"Create Assets\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"%vlocity_namespace%.CPQAppHandler\",\"remoteMethod\":\"checkout\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "Create Assets",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_Submit_English/%vlocity_namespace%__Element__c/Create Assets"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "CPQ Submit",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/CPQ_Submit_English/%vlocity_namespace%__OmniScript__c/CPQ/Submit/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 10,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"consoleTabLabel\":\"New\",\"controlWidth\":12,\"label\":\"Navigate to Account\",\"message\":{},\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":null,\"source\":\"%AccountId%\",\"ssm\":false,\"type\":\"SObject\",\"validationRequired\":\"Submit\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "Navigate to Account",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/CPQ_Submit_English/%vlocity_namespace%__Element__c/Navigate to Account"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "English",
                        "%vlocity_namespace%__PropertySet__c": "{\"allowSaveForLater\":true,\"autoFocus\":false,\"autoSaveOnStepNext\":false,\"cancelRedirectPageName\":\"OmniScriptCancelled\",\"cancelRedirectTemplateUrl\":\"vlcCancelled.html\",\"cancelSource\":\"%ContextId%\",\"cancelType\":\"SObject\",\"consoleTabLabel\":\"New\",\"elementTypeToHTMLTemplateMapping\":{},\"enableKnowledge\":false,\"knowledgeArticleTypeQueryFieldsMap\":{},\"message\":{},\"persistentComponent\":[{\"id\":\"vlcCart\",\"itemsKey\":\"cartItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\"},{\"id\":\"vlcKnowledge\",\"itemsKey\":\"knowledgeItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"\",\"modalHTMLTemplateId\":\"\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false}],\"saveContentEncoded\":false,\"saveExpireInDays\":null,\"saveForLaterRedirectPageName\":\"sflRedirect\",\"saveForLaterRedirectTemplateUrl\":\"vlcSaveForLaterAcknowledge.html\",\"saveNameTemplate\":null,\"saveObjectId\":\"%ContextId%\",\"seedDataJSON\":{},\"ssm\":false,\"timeTracking\":true,\"trackingCustomData\":{},\"visualforcePagesAvailableInPreview\":{},\"wpm\":false}",
                        "%vlocity_namespace%__SubType__c": "Submit",
                        "%vlocity_namespace%__Type__c": "CPQ",
                        "%vlocity_namespace%__Version__c": 10,
                        "Name": "CPQ Submit",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/CPQ_Submit_English/%vlocity_namespace%__OmniScript__c/CPQ/Submit/English"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/CPQ_Submit_English",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/CPQ_Submit_English",
            "VlocityDataPackName": "CPQ_Submit_English",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "This OmniScript is called in Change To Quote process.",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Change To Quote",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_ChangeToQuote_English/%vlocity_namespace%__OmniScript__c/MACD/ChangeToQuote/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"Change To Quote\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"OmniChangeToQuoteWrapper\",\"remoteMethod\":\"changeToQuote\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "Change To Quote",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_ChangeToQuote_English/%vlocity_namespace%__Element__c/Change To Quote"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "Change To Quote",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_ChangeToQuote_English/%vlocity_namespace%__OmniScript__c/MACD/ChangeToQuote/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"consoleTabLabel\":\"New\",\"controlWidth\":12,\"label\":\"Navigate to Quote\",\"message\":{},\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":null,\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%quoteId%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":\"Submit\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "Navigate to Quote",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_ChangeToQuote_English/%vlocity_namespace%__Element__c/Navigate to Quote"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "English",
                        "%vlocity_namespace%__PropertySet__c": "{\"allowSaveForLater\":true,\"autoFocus\":false,\"autoSaveOnStepNext\":false,\"cancelRedirectPageName\":\"OmniScriptCancelled\",\"cancelRedirectTemplateUrl\":\"vlcCancelled.html\",\"cancelSource\":\"%ContextId%\",\"cancelType\":\"SObject\",\"consoleTabLabel\":\"New\",\"elementTypeToHTMLTemplateMapping\":{},\"enableKnowledge\":false,\"knowledgeArticleTypeQueryFieldsMap\":{},\"message\":{},\"persistentComponent\":[{\"id\":\"vlcCart\",\"itemsKey\":\"cartItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\"},{\"id\":\"vlcKnowledge\",\"itemsKey\":\"knowledgeItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"\",\"modalHTMLTemplateId\":\"\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false}],\"saveContentEncoded\":false,\"saveExpireInDays\":null,\"saveForLaterRedirectPageName\":\"sflRedirect\",\"saveForLaterRedirectTemplateUrl\":\"vlcSaveForLaterAcknowledge.html\",\"saveNameTemplate\":null,\"saveObjectId\":\"%ContextId%\",\"saveURLPatterns\":{},\"seedDataJSON\":{},\"ssm\":false,\"timeTracking\":true,\"trackingCustomData\":{},\"visualforcePagesAvailableInPreview\":{},\"wpm\":false}",
                        "%vlocity_namespace%__SubType__c": "ChangeToQuote",
                        "%vlocity_namespace%__Type__c": "MACD",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "Change To Quote",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/MACD_ChangeToQuote_English/%vlocity_namespace%__OmniScript__c/MACD/ChangeToQuote/English"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/MACD_ChangeToQuote_English",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/MACD_ChangeToQuote_English",
            "VlocityDataPackName": "MACD_ChangeToQuote_English",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "This OmniScript is called in Change To Order Process",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"extraPayload\":{},\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"GetAccountId\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"OmniFDOWrapper\",\"remoteMethod\":\"getAccountId\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "GetAccountId",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/GetAccountId"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"controlWidth\":12,\"disOnTplt\":false,\"elementValueMap\":{\"RequestDateTime\":\"=NOW()\"},\"label\":\"Set DateTime\",\"message\":{},\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Set Values",
                                "Name": "Set DateTime",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/Set DateTime"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"cancelLabel\":\"Cancel\",\"cancelMessage\":\"Are you sure?\",\"completeLabel\":\"Complete\",\"completeMessage\":\"Are you sure you want to complete the script?\",\"conditionType\":\"Hide if False\",\"disOnTplt\":false,\"instruction\":\"\",\"knowledgeOptions\":{\"dataCategoryCriteria\":\"\",\"keyword\":\"\",\"language\":\"English\",\"publishStatus\":\"Online\",\"remoteTimeout\":30000,\"typeFilter\":\"\"},\"label\":\"Request DateTime\",\"nextLabel\":\"Next\",\"nextWidth\":3,\"previousLabel\":\"Previous\",\"previousWidth\":3,\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{},\"remoteTimeout\":30000,\"saveLabel\":\"Save for later\",\"saveMessage\":\"Are you sure you want to save it for later?\",\"show\":null,\"showPersistentComponent\":[false,false],\"validationRequired\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Step",
                                "Name": "Request DateTime",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/Request DateTime"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 4,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"extraPayload\":{},\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"CanCreate\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"OmniFDOWrapper\",\"remoteMethod\":\"canCreateFDO\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"Formula 1\"}]}},\"showPersistentComponent\":[false,false],\"ssm\":false,\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "CanCreate",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/CanCreate"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 5,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"cancelLabel\":\"Cancel\",\"cancelMessage\":\"Are you sure?\",\"completeLabel\":\"Complete\",\"completeMessage\":\"Are you sure you want to complete the script?\",\"conditionType\":\"Hide if False\",\"instruction\":\"\",\"knowledgeOptions\":{\"dataCategoryCriteria\":\"\",\"keyword\":\"\",\"language\":\"English\",\"publishStatus\":\"Online\",\"remoteTimeout\":30000,\"typeFilter\":\"\"},\"label\":\"Cannot Create Order\",\"nextLabel\":\"Next\",\"nextWidth\":3,\"previousLabel\":\"Previous\",\"previousWidth\":3,\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{},\"remoteTimeout\":30000,\"saveLabel\":\"Save for later\",\"saveMessage\":\"Are you sure you want to save it for later?\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"canCreateFDO\"},{\"condition\":\"=\",\"data\":\"true\",\"field\":\"Formula 1\"},{\"condition\":\"=\",\"data\":\"false\",\"field\":\"disconnectedAssets\"}]}},\"showPersistentComponent\":[false,false],\"validationRequired\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Step",
                                "Name": "FDO Failed",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/FDO Failed"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 6,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"cancelLabel\":\"Cancel\",\"cancelMessage\":\"Are you sure?\",\"completeLabel\":\"Complete\",\"completeMessage\":\"Are you sure you want to complete the script?\",\"conditionType\":\"Hide if False\",\"instruction\":\"\",\"knowledgeOptions\":{\"dataCategoryCriteria\":\"\",\"keyword\":\"\",\"language\":\"English\",\"publishStatus\":\"Online\",\"remoteTimeout\":30000,\"typeFilter\":\"\"},\"label\":\"Cannot Create Order\",\"nextLabel\":\"Next\",\"nextWidth\":3,\"previousLabel\":\"Previous\",\"previousWidth\":3,\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{},\"remoteTimeout\":30000,\"saveLabel\":\"Save for later\",\"saveMessage\":\"Are you sure you want to save it for later?\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"canCreateFDO\"},{\"condition\":\"=\",\"data\":\"true\",\"field\":\"Formula 1\"},{\"condition\":\"=\",\"data\":\"true\",\"field\":\"disconnectedAssets\"}]}},\"showPersistentComponent\":[false,false],\"validationRequired\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Step",
                                "Name": "FDO Failed Disconnected Assets",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/FDO Failed Disconnected Assets"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 7,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"extraPayload\":{},\"failureAbortLabel\":\"Abort\",\"failureAbortMessage\":\"Are you sure?\",\"failureNextLabel\":\"Continue\",\"inProgressMessage\":\"In Progress\",\"label\":\"CreateFDO\",\"message\":{},\"postMessage\":\"Done\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":\"Next\",\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":\"Previous\",\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"OmniFDOWrapper\",\"remoteMethod\":\"createFDO\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"canCreateFDO\"},{\"condition\":\"=\",\"data\":\"true\",\"field\":\"Formula 1\"}]}},\"showPersistentComponent\":[false,false],\"ssm\":false,\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "CreateFDO",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/CreateFDO"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 8,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"cancelLabel\":\"Cancel\",\"cancelMessage\":\"Are you sure?\",\"completeLabel\":\"Complete\",\"completeMessage\":\"Are you sure you want to complete the script?\",\"conditionType\":\"Hide if False\",\"consoleTabLabel\":\"New\",\"controlWidth\":12,\"knowledgeOptions\":{\"dataCategoryCriteria\":\"\",\"keyword\":\"\",\"language\":\"English\",\"publishStatus\":\"Online\",\"remoteTimeout\":30000},\"label\":\"Done\",\"message\":{},\"nextLabel\":\"Next\",\"nextWidth\":3,\"previousLabel\":\"Previous\",\"previousWidth\":3,\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"remoteOptions\":{},\"remoteTimeout\":30000,\"saveLabel\":\"Save for later\",\"saveMessage\":\"Are you sure you want to save it for later?\",\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"canCreateFDO\"},{\"condition\":\"=\",\"data\":\"true\",\"field\":\"Formula 1\"}]}},\"showPersistentComponent\":[false,false],\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%fdoId%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":\"Submit\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "Done Action 1",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/Done Action 1"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 9,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"consoleTabLabel\":\"New\",\"controlWidth\":12,\"label\":\"Done\",\"message\":{},\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":{\"group\":{\"operator\":\"OR\",\"rules\":[{\"condition\":\"=\",\"data\":\"false\",\"field\":\"canCreateFDO\"},{\"condition\":\"=\",\"data\":\"true\",\"field\":\"Formula 1\"}]}},\"source\":\"%accountId%\",\"ssm\":false,\"type\":\"SObject\",\"validationRequired\":\"Submit\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "Done Action 2",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/Done Action 2"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "FDO",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "Request DateTime",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/Request DateTime",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "Request DateTime",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"accessibleInFutureSteps\":false,\"conditionType\":\"Hide if False\",\"controlWidth\":12,\"dateFormat\":\"MM-dd-yyyy\",\"disOnTplt\":false,\"help\":true,\"helpText\":\"\",\"hide\":false,\"inputWidth\":12,\"label\":\"Please select a Request Date time\",\"readOnly\":false,\"repeat\":false,\"repeatClone\":false,\"repeatLimit\":null,\"required\":true,\"show\":null,\"showInputWidth\":false,\"timeFormat\":\"HH:mm\",\"timezone\":\"User\"}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Date/Time (Local)",
                                "Name": "RequestDateTime",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/RequestDateTime"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "FDO",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "FDO Failed",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/FDO Failed",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "FDO Failed",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"label\":\"<p>Can not create the Order as there is already an Order with Request Date greater than %RequestDateTime%.</p>\",\"show\":null}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Headline",
                                "Name": "CreateFDOFailed",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/CreateFDOFailed"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "FDO",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "Request DateTime",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/Request DateTime",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "Request DateTime",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"currencySymbol\":\"$\",\"dataType\":\"Boolean\",\"dateFormat\":\"MM-dd-yyyy\",\"disOnTplt\":false,\"expression\":\"OR(%RequestDateTime%=NULL,IF(DATE(YEAR(%RequestDateTime%),MONTH(%RequestDateTime%),DAYOFMONTH(%RequestDateTime%)) < TODAY() , false, IF(DATE(YEAR(%RequestDateTime%),MONTH(%RequestDateTime%),DAYOFMONTH(%RequestDateTime%)) = TODAY(), IF(HOUR(%RequestDateTime%) < HOUR(NOW()), false, IF(MINUTE(%RequestDateTime%) < MINUTE(NOW()),false,true),true),true)))\",\"hide\":true,\"hideGroupSep\":false,\"inputWidth\":12,\"label\":\"Formula 1\",\"mask\":null,\"show\":null,\"showInputWidth\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Formula",
                                "Name": "Formula 1",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/Formula 1"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "FDO",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "FDO Failed Disconnected Assets",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/FDO Failed Disconnected Assets",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "FDO Failed Disconnected Assets",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"label\":\"<p>Asset cannot be modified because a request has already been made to disconnect it.</p>\",\"show\":null}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Headline",
                                "Name": "CreateFDOFailedDisconnectedAssets",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/CreateFDOFailedDisconnectedAssets"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "FDO",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 2,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "FDO",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "Request DateTime",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/Request DateTime",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "Request DateTime",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"hideLabel\":true,\"label\":\"Messaging 1\",\"messages\":[{\"active\":true,\"text\":\"\",\"type\":\"Success\",\"value\":true},{\"active\":true,\"text\":\"Can not create the Future Dated Order as Request DateTime is less than now.\",\"type\":\"Requirement\",\"value\":false}],\"show\":null,\"validateExpression\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"Formula 1\"}]}}}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Validation",
                                "Name": "Messaging 1",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__Element__c/Messaging 1"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsProcedure__c": false,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "English",
                        "%vlocity_namespace%__ProcedureKey__c": "",
                        "%vlocity_namespace%__PropertySet__c": "{\"allowSaveForLater\":true,\"autoFocus\":false,\"autoSaveOnStepNext\":false,\"bLK\":false,\"cancelRedirectPageName\":\"OmniScriptCancelled\",\"cancelRedirectTemplateUrl\":\"vlcCancelled.html\",\"cancelSource\":\"%accountId%\",\"cancelType\":\"SObject\",\"consoleTabIcon\":\"custom:custom18\",\"consoleTabLabel\":\"New\",\"consoleTabTitle\":null,\"currencyCode\":\"\",\"elementTypeToHTMLTemplateMapping\":{},\"enableKnowledge\":false,\"hideStepChart\":false,\"knowledgeArticleTypeQueryFieldsMap\":{},\"lkObjName\":null,\"message\":{},\"persistentComponent\":[{\"id\":\"vlcCart\",\"itemsKey\":\"cartItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\"},{\"id\":\"vlcKnowledge\",\"itemsKey\":\"knowledgeItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"\",\"modalHTMLTemplateId\":\"\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false}],\"rtpSeed\":false,\"saveContentEncoded\":false,\"saveExpireInDays\":null,\"saveForLaterRedirectPageName\":\"sflRedirect\",\"saveForLaterRedirectTemplateUrl\":\"vlcSaveForLaterAcknowledge.html\",\"saveNameTemplate\":null,\"saveObjectId\":\"%ContextId%\",\"saveURLPatterns\":{},\"seedDataJSON\":{},\"showInputWidth\":false,\"ssm\":false,\"timeTracking\":true,\"trackingCustomData\":{},\"visualforcePagesAvailableInPreview\":{},\"wpm\":false}",
                        "%vlocity_namespace%__SubType__c": "FDO",
                        "%vlocity_namespace%__Type__c": "MACD",
                        "%vlocity_namespace%__Version__c": 2,
                        "Name": "FDO",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/MACD_FDO_English/%vlocity_namespace%__OmniScript__c/MACD/FDO/English"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/MACD_FDO_English",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/MACD_FDO_English",
            "VlocityDataPackName": "MACD_FDO_English",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__OmniScript__c": [
                    {
                        "%vlocity_namespace%__AdditionalInformation__c": "This OmniScript is called in Move Process",
                        "%vlocity_namespace%__DataRaptorBundleId__c": "",
                        "%vlocity_namespace%__Element__c": [
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"controlWidth\":12,\"extraPayload\":{},\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":null,\"message\":{},\"postMessage\":null,\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"OmniMoveAssetWrapper\",\"remoteMethod\":\"getAccountIds\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "SubstringIds",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SubstringIds"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 10,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"cancelLabel\":null,\"cancelMessage\":null,\"completeLabel\":null,\"completeMessage\":null,\"conditionType\":\"Hide if False\",\"instructionKey\":null,\"knowledgeOptions\":{\"dataCategoryCriteria\":\"\",\"keyword\":\"\",\"language\":\"English\",\"publishStatus\":\"Online\",\"remoteTimeout\":30000},\"label\":\"%vlocity_namespace%__MACDReview\",\"nextLabel\":null,\"nextWidth\":3,\"previousLabel\":null,\"previousWidth\":3,\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{},\"remoteTimeout\":30000,\"saveLabel\":null,\"saveMessage\":null,\"show\":null,\"showPersistentComponent\":[true,false],\"validationRequired\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Step",
                                "Name": "Review",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Review"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"controlWidth\":12,\"extraPayload\":{},\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":\"%vlocity_namespace%__MACDCreateMoveInOrder\",\"message\":{},\"postMessage\":null,\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"OmniMoveAssetWrapper\",\"remoteMethod\":\"createOrder\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "CreateMoveInOrder",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/CreateMoveInOrder"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"controlWidth\":12,\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":null,\"postMessage\":null,\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"OmniMoveAssetWrapper\",\"remoteMethod\":\"getAssets\",\"remoteOptions\":{\"JSON Node\":\"AllAssets\",\"ProvisioningStatusList\":\"Active\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"show\":null,\"showPersistentComponent\":[false,false],\"validationRequired\":\"None\"}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "RetrieveAllAssets",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/RetrieveAllAssets"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 4,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"controlWidth\":12,\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":null,\"postMessage\":null,\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"OmniMoveAssetWrapper\",\"remoteMethod\":\"checkAvailableAssets\",\"remoteOptions\":{\"Elem Name\":\"AllAssets\",\"JSON Node\":\"SelectAsset\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"show\":null,\"showPersistentComponent\":[false,false],\"validationRequired\":\"None\"}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "CheckAvailableAssets",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/CheckAvailableAssets"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 5,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"cancelLabel\":null,\"cancelMessage\":null,\"completeLabel\":null,\"completeMessage\":null,\"conditionType\":\"Hide if False\",\"instructionKey\":null,\"knowledgeOptions\":{\"dataCategoryCriteria\":\"\",\"keyword\":\"\",\"language\":\"English\",\"publishStatus\":\"Online\",\"remoteTimeout\":30000},\"label\":\"%vlocity_namespace%__MACDSelectAssetsToMove\",\"nextLabel\":null,\"nextWidth\":3,\"previousLabel\":null,\"previousWidth\":3,\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{},\"remoteTimeout\":30000,\"saveLabel\":null,\"saveMessage\":null,\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":null,\"field\":\"showAsset\"}]}},\"showPersistentComponent\":[false,false],\"validationRequired\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Step",
                                "Name": "SelectAssets",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SelectAssets"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 6,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"controlWidth\":12,\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":null,\"postMessage\":null,\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"OmniMoveAssetWrapper\",\"remoteMethod\":\"validateSelectedAsset\",\"remoteOptions\":{\"Elem Name\":\"AllAssets\",\"JSON Node\":\"FilteredAsset\",\"jsonPath\":\"SelectAssets:SelectAsset\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"show\":null,\"showPersistentComponent\":[false,false],\"ssm\":false,\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "ValidateSelectedAsset",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/ValidateSelectedAsset"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 7,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"cancelLabel\":null,\"cancelMessage\":null,\"completeLabel\":null,\"completeMessage\":null,\"conditionType\":\"Hide if False\",\"instructionKey\":null,\"knowledgeOptions\":{\"dataCategoryCriteria\":\"\",\"keyword\":\"\",\"language\":\"English\",\"publishStatus\":\"Online\",\"remoteTimeout\":30000},\"label\":\"%vlocity_namespace%__MACDSelectMoveInMoveOutDates\",\"nextLabel\":null,\"nextWidth\":3,\"previousLabel\":null,\"previousWidth\":3,\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{},\"remoteTimeout\":30000,\"saveLabel\":null,\"saveMessage\":null,\"show\":null,\"showPersistentComponent\":[false,false],\"validationRequired\":true}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Step",
                                "Name": "SelectInOutDate",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SelectInOutDate"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 8,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"controlWidth\":12,\"extraPayload\":{},\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":null,\"message\":{},\"postMessage\":null,\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"OmniMoveAssetWrapper\",\"remoteMethod\":\"moveAssets\",\"remoteOptions\":{\"JSON Node\":\"FilteredAsset\",\"jsonPath\":\"SelectAssets:SelectAsset\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"show\":null,\"showPersistentComponent\":[true,false],\"ssm\":false,\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "Submit",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Submit"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 0,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 9,
                                "%vlocity_namespace%__ParentElementId__c": "",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"extraPayload\":{},\"failureAbortLabel\":null,\"failureAbortMessage\":null,\"failureNextLabel\":null,\"inProgressMessage\":null,\"label\":null,\"message\":{},\"postMessage\":null,\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"redirectNextLabel\":null,\"redirectNextWidth\":3,\"redirectPageName\":\"\",\"redirectPreviousLabel\":null,\"redirectPreviousWidth\":3,\"redirectTemplateUrl\":\"vlcAcknowledge.html\",\"remoteClass\":\"OmniMoveAssetWrapper\",\"remoteMethod\":\"moveNewAssets\",\"remoteOptions\":{\"JSON Node\":\"FilteredAsset\",\"jsonPath\":\"SelectAssets:SelectAsset\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\",\"show\":null,\"showPersistentComponent\":[true,false],\"ssm\":false,\"svgIcon\":\"\",\"svgSprite\":\"\",\"validationRequired\":\"None\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Remote Action",
                                "Name": "SubmitNewAssets",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SubmitNewAssets"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "MACD Move",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "Review",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Review",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "Review",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"controlWidth\":12,\"label\":\"<p>Please review the Move Order.</p>\",\"labelKey\":\"%vlocity_namespace%__MACDReviewHeader\",\"show\":null}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Headline",
                                "Name": "ReviewHeader",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/ReviewHeader"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "MACD Move",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "SelectInOutDate",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SelectInOutDate",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "SelectInOutDate",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"accessibleInFutureSteps\":false,\"conditionType\":\"Hide if False\",\"controlWidth\":5,\"dateFormat\":\"MM-dd-yyyy\",\"dateType\":\"string\",\"disOnTplt\":false,\"help\":false,\"hide\":false,\"inputWidth\":12,\"label\":\"%vlocity_namespace%__MACDMoveOutDate\",\"modelDateFormat\":\"yyyy-MM-dd\",\"readOnly\":false,\"repeat\":false,\"repeatClone\":false,\"required\":true,\"show\":null,\"showInputWidth\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Date",
                                "Name": "MoveOutDate",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/MoveOutDate"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 1,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "MACD Move",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "SelectAssets",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SelectAssets",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "SelectAssets",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"SelectAssetToMove.html\",\"accessibleInFutureSteps\":false,\"dataJSON\":true,\"itemsKey\":\"recSet\",\"label\":null,\"maxCompareSize\":4,\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"modalController\":\"ModalInstanceCtrl\",\"modalHTMLTemplateId\":\"vlcModalContent.html\",\"modalSize\":\"\",\"remoteClass\":\"OmniMoveAssetWrapper\",\"remoteMethod\":\"moveAssets\",\"remoteOptions\":{\"Pricebook\":\"Standard\",\"jsonPath\":\"SelectAssets:SelectAsset\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"selectMode\":\"Multi\",\"show\":null}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Selectable Items",
                                "Name": "SelectAsset",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SelectAsset"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "MACD Move",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "Review",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Review",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "Review",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"MovedAssetReview.html\",\"accessibleInFutureSteps\":false,\"dataJSON\":false,\"itemsKey\":\"recSet\",\"label\":null,\"maxCompareSize\":4,\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"modalController\":\"ModalInstanceCtrl\",\"modalHTMLTemplateId\":\"vlcModalContent.html\",\"modalSize\":\"\",\"remoteOptions\":{\"jsonPath\":\"SelectAssets:SelectAsset\",\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"selectMode\":\"Single\",\"show\":null}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Selectable Items",
                                "Name": "Selectable Items 2",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Selectable Items 2"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "MACD Move",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "SelectInOutDate",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SelectInOutDate",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "SelectInOutDate",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"accessibleInFutureSteps\":false,\"conditionType\":\"Hide if False\",\"controlWidth\":5,\"dateFormat\":\"MM-dd-yyyy\",\"dateType\":\"string\",\"disOnTplt\":false,\"help\":false,\"hide\":false,\"inputWidth\":12,\"label\":\"%vlocity_namespace%__MACDMoveInDate\",\"modelDateFormat\":\"yyyy-MM-dd\",\"readOnly\":false,\"repeat\":false,\"repeatClone\":false,\"required\":true,\"show\":null,\"showInputWidth\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Date",
                                "Name": "MoveInDate",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/MoveInDate"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 2,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "MACD Move",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "SelectAssets",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SelectAssets",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "SelectAssets",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"controlWidth\":12,\"hideLabel\":true,\"label\":null,\"messages\":[{\"active\":true,\"text\":\"%vlocity_namespace%__ASSETAssetSelected\",\"type\":\"Success\",\"value\":true},{\"active\":true,\"text\":\"%vlocity_namespace%__ASSETNoAssetSelected\",\"type\":\"Requirement\",\"value\":false}],\"show\":null,\"validateExpression\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"Formula 2\"}]}}}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Validation",
                                "Name": "Messaging 1",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Messaging 1"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "MACD Move",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "Review",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Review",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "Review",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"controlWidth\":12,\"label\":\"<p>Click 'Done\\\" to Go to Order Detail Page.  </p>\",\"labelKey\":\"%vlocity_namespace%__MACDReviewHeader2\",\"show\":null}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Headline",
                                "Name": "Headline 2",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Headline 2"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "MACD Move",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "SelectAssets",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SelectAssets",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "SelectAssets",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"controlWidth\":12,\"currencySymbol\":\"$\",\"dataType\":\"Boolean\",\"dateFormat\":\"MM-dd-yyyy\",\"expression\":\"COUNT(%SelectAsset%) > 0\",\"hide\":true,\"hideGroupSep\":false,\"label\":null,\"show\":null}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Formula",
                                "Name": "Formula 2",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Formula 2"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 3,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "MACD Move",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "SelectInOutDate",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SelectInOutDate",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "SelectInOutDate",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"dataType\":\"Boolean\",\"dateFormat\":\"MM-dd-yyyy\",\"disOnTplt\":false,\"expression\":\"%MoveOutDate% <= %MoveInDate%\",\"hide\":true,\"hideGroupSep\":false,\"inputWidth\":12,\"label\":null,\"mask\":null,\"show\":null,\"showInputWidth\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Formula",
                                "Name": "DateTest",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/DateTest"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 4,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "MACD Move",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "SelectAssets",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SelectAssets",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "SelectAssets",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"controlWidth\":12,\"elementErrorMap\":{\"Formula 2\":false},\"label\":null,\"show\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"test\",\"field\":\"SelectAssets\"}]}},\"showPersistentComponent\":[false,false],\"validationRequired\":\"Step\"}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Set Errors",
                                "Name": "Set Errors 2",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Set Errors 2"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 4,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "MACD Move",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "Review",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Review",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "Review",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"consoleTabLabel\":null,\"controlWidth\":3,\"label\":\"%vlocity_namespace%__MACDDone\",\"message\":{},\"redirectPageName\":\"mobileDone\",\"redirectTemplateUrl\":\"vlcMobileConfirmation.html\",\"show\":null,\"source\":\"/apex/%vlocity_namespace%__HybridCPQ?id=%OrderId%\",\"ssm\":false,\"type\":\"URL\",\"validationRequired\":\"Submit\",\"wpm\":false}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Done Action",
                                "Name": "Done",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Done"
                            },
                            {
                                "%vlocity_namespace%__Active__c": true,
                                "%vlocity_namespace%__InternalNotes__c": "",
                                "%vlocity_namespace%__Level__c": 1,
                                "%vlocity_namespace%__OmniScriptId__c": {
                                    "Name": "MACD Move",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                },
                                "%vlocity_namespace%__OmniScriptVersion__c": 1,
                                "%vlocity_namespace%__Order__c": 4,
                                "%vlocity_namespace%__ParentElementId__c": {
                                    "%vlocity_namespace%__OmniScriptId__c": {
                                        "Name": "MACD Move",
                                        "VlocityDataPackType": "VlocityMatchingKeyObject",
                                        "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language",
                                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c"
                                    },
                                    "Name": "SelectInOutDate",
                                    "VlocityDataPackType": "VlocityMatchingKeyObject",
                                    "VlocityMatchingRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/SelectInOutDate",
                                    "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c"
                                },
                                "%vlocity_namespace%__ParentElementName__c": "SelectInOutDate",
                                "%vlocity_namespace%__ParentElementType__c": "Step",
                                "%vlocity_namespace%__PropertySet__c": "{\"HTMLTemplateId\":\"\",\"controlWidth\":12,\"disOnTplt\":false,\"hideLabel\":true,\"label\":null,\"messages\":[{\"active\":true,\"text\":\"\",\"type\":\"Success\",\"value\":true},{\"active\":true,\"text\":\"%vlocity_namespace%__MACDDateError\",\"type\":\"Requirement\",\"value\":false}],\"show\":null,\"validateExpression\":{\"group\":{\"operator\":\"AND\",\"rules\":[{\"condition\":\"=\",\"data\":\"true\",\"field\":\"DateTest\"}]}}}",
                                "%vlocity_namespace%__ReusableOmniScript__c": false,
                                "%vlocity_namespace%__SearchKey__c": "",
                                "%vlocity_namespace%__Type__c": "Validation",
                                "Name": "Move Date Error",
                                "VlocityDataPackIsIncluded": true,
                                "VlocityDataPackType": "SObject",
                                "VlocityRecordSObjectType": "%vlocity_namespace%__Element__c",
                                "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__Element__c/Move Date Error"
                            }
                        ],
                        "%vlocity_namespace%__IsActive__c": true,
                        "%vlocity_namespace%__IsProcedure__c": false,
                        "%vlocity_namespace%__IsReusable__c": false,
                        "%vlocity_namespace%__Language__c": "Multi-Language",
                        "%vlocity_namespace%__ProcedureKey__c": "",
                        "%vlocity_namespace%__PropertySet__c": "{\"allowSaveForLater\":false,\"autoFocus\":false,\"autoSaveOnStepNext\":false,\"cancelRedirectPageName\":\"OmniScriptCancelled\",\"cancelRedirectTemplateUrl\":\"vlcCancelled.html\",\"cancelSource\":\"%moveOutAccountId%\",\"cancelType\":\"SObject\",\"consoleTabIcon\":\"custom:custom18\",\"consoleTabLabel\":null,\"consoleTabTitle\":null,\"currencyCode\":\"\",\"elementTypeToHTMLTemplateMapping\":{},\"enableKnowledge\":false,\"hideStepChart\":false,\"knowledgeArticleTypeQueryFieldsMap\":{},\"message\":{},\"persistentComponent\":[{\"id\":\"vlcCart\",\"itemsKey\":\"cartItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"ModalProductCtrl\",\"modalHTMLTemplateId\":\"vlcProductConfig.html\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"OmniCPQServiceWrapper\",\"remoteMethod\":\"updateCart\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":true,\"responseJSONNode\":\"\",\"responseJSONPath\":\"\",\"sendJSONNode\":\"\",\"sendJSONPath\":\"\"},{\"id\":\"vlcKnowledge\",\"itemsKey\":\"knowledgeItems\",\"label\":\"\",\"modalConfigurationSetting\":{\"modalController\":\"\",\"modalHTMLTemplateId\":\"\",\"modalSize\":\"lg\"},\"postTransformBundle\":\"\",\"preTransformBundle\":\"\",\"remoteClass\":\"\",\"remoteMethod\":\"\",\"remoteOptions\":{\"postTransformBundle\":\"\",\"preTransformBundle\":\"\"},\"remoteTimeout\":30000,\"render\":false}],\"persistentComponent|0:label\":null,\"persistentComponent|1:label\":null,\"rtpSeed\":false,\"saveContentEncoded\":false,\"saveExpireInDays\":null,\"saveForLaterRedirectPageName\":\"sflRedirect\",\"saveForLaterRedirectTemplateUrl\":\"vlcSaveForLaterAcknowledge.html\",\"saveNameTemplate\":null,\"saveObjectId\":\"%ContextId%\",\"saveURLPatterns\":{},\"seedDataJSON\":{},\"showInputWidth\":false,\"ssm\":false,\"timeTracking\":true,\"trackingCustomData\":{},\"visualforcePagesAvailableInPreview\":{},\"wpm\":false}",
                        "%vlocity_namespace%__SubType__c": "Move",
                        "%vlocity_namespace%__Type__c": "MACD",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "MACD Move",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__OmniScript__c",
                        "VlocityRecordSourceKey": "OmniScript/MACD_Move_Multi-Language/%vlocity_namespace%__OmniScript__c/MACD/Move/Multi-Language"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "OmniScript/MACD_Move_Multi-Language",
                "VlocityDataPackType": "OmniScript"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "OmniScript/MACD_Move_Multi-Language",
            "VlocityDataPackName": "MACD_Move_Multi-Language",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "OmniScript"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CustomJavascript__c": "vlocity.cardframework.registerModule\n    .controller('decomposeValidateController',\n                 [\"$scope\",\"$rootScope\",\"$window\",\"$location\", function( $scope,$rootScope,$window,$location){\n            $scope.errMeg=\"\";\n            var x = document.getElementsByClassName(\"panel-group\");\n            x[0].style.display = 'none';\n            this.showValidateErrorMeg = function(erMessage,OrderId) {\n            alert(erMessage);  \n            var url = \"https://\" + $window.location.host + \"/apex/HybridCPQ?id=\"+OrderId;\n            $window.location.href = url;\n        };\n        \n}]);",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "xom-decompose-error/1/vlocity/1508924951122",
                        "%vlocity_namespace%__HTML__c": "<script type=\"text/ng-template\" id=\"xom-decompose-error\" >\n<div class=\"vlocity via-slds\" >\n<div ng-controller=\"decomposeValidateController as dv\">\n<div ng-init=\"dv.showValidateErrorMeg(bpTree.response.errorMessage,bpTree.response.ContextId);\">\n</div>\n</div>\n</div>\n</script>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__Type__c": "OmniScript",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "xom-decompose-error",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/xom-decompose-error/%vlocity_namespace%__VlocityUITemplate__c/xom-decompose-error"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/xom-decompose-error",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/xom-decompose-error",
            "VlocityDataPackName": "xom-decompose-error",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        }
    ],
    "name": "DP_CARDS_CPQOmniScript",
    "primaryDataPackKey": "VlocityDeploy",
    "processMultiple": true,
    "status": "Complete",
    "version": 1
}
let definition = 
                {"Cards":["np-customer-account-offer-lwc"],"customPreviewPages":[{"group":"Custom Pages","label":"newport_cards","page":"newport_cards"}],"dataSource":{"type":"IntegrationProcedures","value":{"bundle":"port_ReadAccountDetails_Card","inputMap":{"Id":"{{params.id}}"},"body":"[\n    {\n        \"virtualResourceId\": null,\n        \"virtualResourceData\": null,\n        \"viewLast\": null,\n        \"viewDecayRatio\": 1,\n        \"viewDecay\": 0,\n        \"targetObjectType\": \"VlocityAction\",\n        \"targetObjectKey\": \"acctQuote_TermLife\",\n        \"scaledRawScore\": 0,\n        \"resourceId\": \"a5o3t000001zp5rAA2\",\n        \"resource\": {\n            \"attributes\": {\n                \"type\": \"vlocity_ins__VqResource__c\",\n                \"url\": \"/services/data/v47.0/sobjects/vlocity_ins__VqResource__c/a5o3t000001zp5rAA2\"\n            },\n            \"Id\": \"a5o3t000001zp5rAA2\",\n            \"OwnerId\": \"0053t000007QARDAAY\",\n            \"IsDeleted\": false,\n            \"Name\": \"Affordable Term Life\",\n            \"CreatedDate\": \"2019-08-12T22:24:35.000+0000\",\n            \"CreatedById\": \"0053t000007QARDAAY\",\n            \"LastModifiedDate\": \"2019-08-12T22:24:35.000+0000\",\n            \"LastModifiedById\": \"0053t000007QARDAAY\",\n            \"SystemModstamp\": \"2019-08-12T22:24:35.000+0000\",\n            \"vlocity_ins__Description__c\": \"Term life insurance is the easiest way to financial coverage for your family.\",\n            \"vlocity_ins__EffectiveDate__c\": \"2016-10-01T04:00:00.000+0000\",\n            \"vlocity_ins__Headline__c\": \"Affordable Term Life\",\n            \"vlocity_ins__IsActive__c\": true,\n            \"vlocity_ins__SubTitle__c\": \"Protect your family in the event of your surprise demise with this low cost coverage.\",\n            \"vlocity_ins__TargetObjectKey__c\": \"acctQuote_TermLife\",\n            \"vlocity_ins__TargetObjectType__c\": \"VlocityAction\"\n        },\n        \"rejectLast\": null,\n        \"rejectDecayRatio\": 1,\n        \"rejectDecay\": 0,\n        \"rankings\": null,\n        \"interactionId\": null,\n        \"info\": {\n            \"attributes\": {\n                \"type\": \"vlocity_ins__VlocityAction__c\",\n                \"url\": \"/services/data/v47.0/sobjects/vlocity_ins__VlocityAction__c/a5N3t000000LKpJEA2\"\n            },\n            \"Id\": \"a5N3t000000LKpJEA2\",\n            \"Name\": \"acctQuote_TermLife\",\n            \"vlocity_ins__DisplayLabel__c\": \"Term Life\",\n            \"vlocity_ins__DisplaySequence__c\": 10,\n            \"vlocity_ins__VlocityIcon__c\": \"icon-v-client-line\",\n            \"vlocity_ins__Url__c\": \"/apex/vlocity_ins__InsuranceRulesOmniScriptUniversal?id={0}&OmniScriptType=Life&OmniScriptSubType=TermQuote&OmniScriptLang=English&scriptMode=vertical&layout=lightning&ContextId={0}\",\n            \"vlocity_ins__ApplicableUserProfiles__c\": \"All\",\n            \"vlocity_ins__OpenUrlMode__c\": \"New Tab / Window\",\n            \"vlocity_ins__UrlParameters__c\": \"Id\",\n            \"vlocity_ins__LinkType__c\": \"OmniScript\"\n        },\n        \"formattedAggregatedScore\": 0,\n        \"currentMachine\": \"npArticles\",\n        \"contextId\": \"\",\n        \"componentScores\": [],\n        \"attachment\": {\n            \"Family_house_small_2\": \"00P3t00001NXuWjEAM\"\n        },\n        \"aggregatedScore\": 0,\n        \"acceptLast\": null,\n        \"acceptDecayRatio\": 1,\n        \"acceptDecay\": 0\n    },\n    {\n        \"virtualResourceId\": null,\n        \"virtualResourceData\": null,\n        \"viewLast\": null,\n        \"viewDecayRatio\": 1,\n        \"viewDecay\": 0,\n        \"targetObjectType\": \"VlocityAction\",\n        \"targetObjectKey\": \"CRM_newEvent\",\n        \"scaledRawScore\": 0,\n        \"resourceId\": \"a5o3t000001zp5sAA2\",\n        \"resource\": {\n            \"attributes\": {\n                \"type\": \"vlocity_ins__VqResource__c\",\n                \"url\": \"/services/data/v47.0/sobjects/vlocity_ins__VqResource__c/a5o3t000001zp5sAA2\"\n            },\n            \"Id\": \"a5o3t000001zp5sAA2\",\n            \"OwnerId\": \"0053t000007QARDAAY\",\n            \"IsDeleted\": false,\n            \"Name\": \"Financial Planning\",\n            \"CreatedDate\": \"2019-08-12T22:24:36.000+0000\",\n            \"CreatedById\": \"0053t000007QARDAAY\",\n            \"LastModifiedDate\": \"2019-08-12T22:24:36.000+0000\",\n            \"LastModifiedById\": \"0053t000007QARDAAY\",\n            \"SystemModstamp\": \"2019-08-12T22:24:36.000+0000\",\n            \"vlocity_ins__Description__c\": \"Enjoy a complimentary session with an experienced adviser in your area. Your session will include a profile assessment and some recommendations for growing your assets, covering your expenses, and protecting your family at various stages through the years.\",\n            \"vlocity_ins__EffectiveDate__c\": \"2017-06-01T04:00:00.000+0000\",\n            \"vlocity_ins__Headline__c\": \"Life Advice When You're Starting Out\",\n            \"vlocity_ins__IsActive__c\": true,\n            \"vlocity_ins__SubTitle__c\": \"Take advantage of a free session with a financial advisor to learn about financial planning for every stage of your life.\",\n            \"vlocity_ins__TargetObjectKey__c\": \"CRM_newEvent\",\n            \"vlocity_ins__TargetObjectType__c\": \"VlocityAction\"\n        },\n        \"rejectLast\": null,\n        \"rejectDecayRatio\": 1,\n        \"rejectDecay\": 0,\n        \"rankings\": null,\n        \"interactionId\": null,\n        \"info\": {\n            \"attributes\": {\n                \"type\": \"vlocity_ins__VlocityAction__c\",\n                \"url\": \"/services/data/v47.0/sobjects/vlocity_ins__VlocityAction__c/a5N3t000000LKq7EA2\"\n            },\n            \"Id\": \"a5N3t000000LKq7EA2\",\n            \"Name\": \"CRM_newEvent\",\n            \"vlocity_ins__DisplayLabel__c\": \"New Event\",\n            \"vlocity_ins__DisplaySequence__c\": 2,\n            \"vlocity_ins__VlocityIcon__c\": \"action-new_event\",\n            \"vlocity_ins__Url__c\": \"/apex/vlocity_ins__OmniScriptUniversalPage?ContextId={0}&id={0}&OmniScriptType=CRM&OmniScriptSubType=Event&OmniScriptLang=English&PrefillDataRaptorBundle=&scriptMode=vertical&layout=lightning\",\n            \"vlocity_ins__ApplicableUserProfiles__c\": \"All\",\n            \"vlocity_ins__OpenUrlMode__c\": \"New Tab / Window\",\n            \"vlocity_ins__UrlParameters__c\": \"Id\",\n            \"vlocity_ins__LinkType__c\": \"OmniScript\"\n        },\n        \"formattedAggregatedScore\": 0,\n        \"currentMachine\": \"npArticles\",\n        \"contextId\": \"\",\n        \"componentScores\": [],\n        \"attachment\": {\n            \"financialplan\": \"00P3t00001NXuWkEA2\"\n        },\n        \"aggregatedScore\": 0,\n        \"acceptLast\": null,\n        \"acceptDecayRatio\": 1,\n        \"acceptDecay\": 0\n    },\n    {\n        \"virtualResourceId\": null,\n        \"virtualResourceData\": null,\n        \"viewLast\": null,\n        \"viewDecayRatio\": 1,\n        \"viewDecay\": 0,\n        \"targetObjectType\": \"VlocityAction\",\n        \"targetObjectKey\": \"Offer_Renters\",\n        \"scaledRawScore\": 0,\n        \"resourceId\": \"a5o3t000001zp5tAA2\",\n        \"resource\": {\n            \"attributes\": {\n                \"type\": \"vlocity_ins__VqResource__c\",\n                \"url\": \"/services/data/v47.0/sobjects/vlocity_ins__VqResource__c/a5o3t000001zp5tAA2\"\n            },\n            \"Id\": \"a5o3t000001zp5tAA2\",\n            \"OwnerId\": \"0053t000007QARDAAY\",\n            \"IsDeleted\": false,\n            \"Name\": \"Renters Insurance\",\n            \"CreatedDate\": \"2019-08-12T22:24:37.000+0000\",\n            \"CreatedById\": \"0053t000007QARDAAY\",\n            \"LastModifiedDate\": \"2019-08-12T22:24:37.000+0000\",\n            \"LastModifiedById\": \"0053t000007QARDAAY\",\n            \"SystemModstamp\": \"2019-08-12T22:24:37.000+0000\",\n            \"vlocity_ins__Description__c\": \"Renter's insurance is easy to apply for and affordable - with rates starting at $10 a month.  Get a quick quote today.\",\n            \"vlocity_ins__EffectiveDate__c\": \"2018-08-14T04:00:00.000+0000\",\n            \"vlocity_ins__Headline__c\": \"Insurance for Renters\",\n            \"vlocity_ins__IsActive__c\": true,\n            \"vlocity_ins__SubTitle__c\": \"Get peace of mind by protecting your home from fire, theft, or other unexpected damage.\",\n            \"vlocity_ins__TargetObjectKey__c\": \"Offer_Renters\",\n            \"vlocity_ins__TargetObjectType__c\": \"VlocityAction\"\n        },\n        \"rejectLast\": null,\n        \"rejectDecayRatio\": 1,\n        \"rejectDecay\": 0,\n        \"rankings\": null,\n        \"interactionId\": null,\n        \"info\": {\n            \"attributes\": {\n                \"type\": \"vlocity_ins__VlocityAction__c\",\n                \"url\": \"/services/data/v47.0/sobjects/vlocity_ins__VlocityAction__c/a5N3t000000LKqJEA2\"\n            },\n            \"Id\": \"a5N3t000000LKqJEA2\",\n            \"Name\": \"Offer_Renters\",\n            \"vlocity_ins__DisplayLabel__c\": \"New Apartment?  Protect your stuff.\",\n            \"vlocity_ins__DisplaySequence__c\": 1,\n            \"vlocity_ins__VlocityIcon__c\": \"icon-v-campaign\",\n            \"vlocity_ins__Url__c\": \"/apex/vlocity_ins__InsuranceRulesOmniScriptUniversal?id={0}&layout=newport#/OmniScriptType/Quote/OmniScriptSubType/RentersSimple/OmniScriptLang/English/ContextId/{0}/PrefillDataRaptorBundle//true\",\n            \"vlocity_ins__ApplicableUserProfiles__c\": \"All\",\n            \"vlocity_ins__OpenUrlMode__c\": \"New Tab / Window\",\n            \"vlocity_ins__UrlParameters__c\": \"Id\",\n            \"vlocity_ins__LinkType__c\": \"OmniScript\"\n        },\n        \"formattedAggregatedScore\": 0,\n        \"currentMachine\": \"npArticles\",\n        \"contextId\": \"\",\n        \"componentScores\": [],\n        \"attachment\": {\n            \"Apartments\": \"00P3t00001NXuWlEA2\"\n        },\n        \"aggregatedScore\": 0,\n        \"acceptLast\": null,\n        \"acceptDecayRatio\": 1,\n        \"acceptDecay\": 0\n    }\n]","optionsMap":{"vlcClass":"vlocity_ins.IntegrationProcedureService"},"ipMethod":"Intelligence_offers"},"contextVariables":[{"name":"params.id","val":"0013t00001aDob7AAV"}]},"previewType":"runTime","sessionVars":[{"name":"title","val":"Opportunities"}],"templates":{"0":{"templateUrl":"np-canvas"}},"workspace":["np-customer-account-offer-lwc/VEX Personal Lines/1/1579581179709"],"enableLwc":true,"repeatCards":false,"componentName":"cfNpCustomerAccountOffersLwc","lwc":{"MasterLabel":"npCanvas","DeveloperName":"npCanvas","Id":"0Rb3t000000LOhHCAA","name":"npCanvas"},"GlobalKey__c":"np-customer-account-offers-lwc/1/VEX Personal Lines/1579581163226","enableUserInfo":true,"xmlObject":{"apiVersion":46,"isExplicitImport":false,"isExposed":true,"masterLabel":"np-customer-account-offers-lwc","runtimeNamespace":"vlocity_ins","targetConfigs":"CiAgICAgICAgICAgICAgICAgICAgICA8dGFyZ2V0Q29uZmlnIHRhcmdldHM9ImxpZ2h0bmluZ19fQXBwUGFnZSI+CiAgICAgICAgICAgICAgICAgICAgICA8cHJvcGVydHkgbmFtZT0iZGVidWciIHR5cGU9IkJvb2xlYW4iICAvPgogICAgICAgICAgICAgICAgICAgICAgICA8cHJvcGVydHkgbmFtZT0icmVjb3JkSWQiIHR5cGU9IlN0cmluZyIgIC8+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFyZ2V0Q29uZmlnPgogICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgPHRhcmdldENvbmZpZyB0YXJnZXRzPSJsaWdodG5pbmdfX1JlY29yZFBhZ2UiPgogICAgICAgICAgICAgICAgICAgICAgPHByb3BlcnR5IG5hbWU9ImRlYnVnIiB0eXBlPSJCb29sZWFuIiAgLz4KICAgICAgICAgICAgICAgICAgICAgICAgPC90YXJnZXRDb25maWc+CiAgICAgICAgICAgICAgICAgICAg","targets":[{"name":"RecordPage","target":"lightning__RecordPage"},{"name":"AppPage","target":"lightning__AppPage"},{"name":"HomePage","target":"lightning__HomePage"},{"name":"CommunityPage","target":"lightningCommunity__Page"},{"name":"CommunityDefault","target":"lightningCommunity__Default"}],"targetConfig":[{"target":"lightning__AppPage","property":[{"name":"debug","value":{"type":"Boolean","name":"debug","selectedProp":"debug"}},{"name":"recordId","value":{"type":"String","name":"recordId","selectedProp":"recordId"}}],"objects":[]},{"target":"lightning__RecordPage","property":[{"name":"debug","value":{"type":"Boolean","name":"debug","selectedProp":"debug"}}],"objects":[]}]}}; 
            export default definition
let definition = 
                {"Cards":["ins-broker-portal-quote-draft","ins-broker-portal-quote-underwriting","ins-broker-portal-quote-submitted","ins-broker-portal-quote-approved","ins-broker-portal-quote-accepted-lwc"],"customPreviewPages":[{"group":"Custom Pages","label":"InsuranceBrokerOverview","namespacePrefix":"vlocity_ins","page":"InsuranceBrokerOverview"}],"dataSource":{"contextVariables":[{"name":"$root.vlocity.userContactId","val":"0033t0000363TCMAAZ"}],"type":"DataRaptor","value":{"bundle":"port_ReadBrokerQuotes_card","inputMap":{"Id":"{{$root.vlocity.userContactId}}"},"resultVar":"","body":"{\n    \"Quote\": {\n        \"Opportunity\": {\n            \"Id\": \"0063t00000uUMI1AAG\"\n        }\n    },\n    \"Opportunity\": {\n        \"Name\": \"INS Test Oppty\"\n    },\n    \"ProducerId\": \"0033t0000363TCMAAZ\",\n    \"TotalPrice\": 0,\n    \"Premium\": 0,\n    \"Subtotal\": 0,\n    \"Status\": \"Draft\",\n    \"QuoteNumber\": \"00000001\",\n    \"OwnerId\": \"0053t000007QARDAAY\",\n    \"OpportunityId\": \"0063t00000uUMI1AAG\",\n    \"Name\": \"INS Test Quote\",\n    \"LineItemCount\": 0,\n    \"Id\": \"0Q03t000001KgjWCA2\",\n    \"QuoteId\": \"0Q03t000001KgjWCA2\",\n    \"GrandTotal\": 0,\n    \"Discount\": 0,\n    \"AccountId\": \"0013t00001a7uq9AAY\",\n    \"Account\": {\n        \"Name\": \"Acme\"\n    },\n    \"AccountName\": \"Acme\",\n    \"LastModifiedDate\": \"2019-08-12T17:24:36.000Z\"\n}"}},"previewType":"runTime","templates":{"0":{"templateUrl":"ins-broker-overview-application-col"}},"workspace":["ins-broker-portal-quote-draft/VEX Personal Lines/1/1579234654584","ins-broker-portal-quote-underwriting/VEX Personal Lines/1/1579234619092","ins-broker-portal-quote-submitted/VEX Personal Lines/1/1579234673948","ins-broker-portal-quote-approved/VEX Personal Lines/1/1579234693383","ins-broker-portal-quote-accepted-lwc/VEX Personal Lines/1/1579251124509"],"enableLwc":true,"repeatCards":false,"lwc":{"MasterLabel":"npBrokerApplicationLayout","DeveloperName":"npBrokerApplicationLayout","Id":"0Rb3t000000LOgxCAA","name":"npBrokerApplicationLayout"},"componentName":"cfInsBrokerOverviewApplicationLwc","GlobalKey__c":"ins-broker-overview-application-lwc/1/VEX Personal Lines/1579234578183","enableUserInfo":true,"sessionVars":[{"name":"Title","val":"Applications"}],"xmlObject":{"apiVersion":46,"isExplicitImport":false,"isExposed":true,"masterLabel":"ins-broker-overview-application-lwc","runtimeNamespace":"vlocity_ins","targetConfigs":"CiAgICAgICAgICAgICAgICAgICAgICA8dGFyZ2V0Q29uZmlnIHRhcmdldHM9ImxpZ2h0bmluZ19fQXBwUGFnZSI+CiAgICAgICAgICAgICAgICAgICAgICA8cHJvcGVydHkgbmFtZT0iZGVidWciIHR5cGU9IkJvb2xlYW4iICAvPgogICAgICAgICAgICAgICAgICAgICAgICA8cHJvcGVydHkgbmFtZT0icmVjb3JkSWQiIHR5cGU9IlN0cmluZyIgIC8+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFyZ2V0Q29uZmlnPgogICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgPHRhcmdldENvbmZpZyB0YXJnZXRzPSJsaWdodG5pbmdfX1JlY29yZFBhZ2UiPgogICAgICAgICAgICAgICAgICAgICAgPHByb3BlcnR5IG5hbWU9ImRlYnVnIiB0eXBlPSJCb29sZWFuIiAgLz4KICAgICAgICAgICAgICAgICAgICAgICAgPC90YXJnZXRDb25maWc+CiAgICAgICAgICAgICAgICAgICAg","targets":[{"name":"RecordPage","target":"lightning__RecordPage"},{"name":"AppPage","target":"lightning__AppPage"},{"name":"HomePage","target":"lightning__HomePage"},{"name":"CommunityPage","target":"lightningCommunity__Page"},{"name":"CommunityDefault","target":"lightningCommunity__Default"}],"targetConfig":[{"target":"lightning__AppPage","property":[{"name":"debug","value":{"type":"Boolean","name":"debug","selectedProp":"debug"}},{"name":"recordId","value":{"type":"String","name":"recordId","selectedProp":"recordId"}}],"objects":[]},{"target":"lightning__RecordPage","property":[{"name":"debug","value":{"type":"Boolean","name":"debug","selectedProp":"debug"}}],"objects":[]}]}}; 
            export default definition
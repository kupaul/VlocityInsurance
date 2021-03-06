let definition = 
                {"Cards":["np-claim-lineitem-card-lwc"],"customPreviewPages":[{"group":"Custom Pages","label":"newport_cards","page":"newport_cards"}],"dataSource":{"contextVariables":[{"name":"params.id","val":"a2b3t000000S6EKAAE"}],"type":"DataRaptor","value":{"bundle":"port_ReadClaimLineItems_Card","inputMap":{"Id":"{{params.id}}"},"body":"[\n    {\n        \"Provider\": \"Stanford Hospital & Clinics\",\n        \"Status\": \"Open\",\n        \"AdjustedAmount\": \"$0.00\",\n        \"ClaimAmount\": \"$10,000.00\",\n        \"Description\": \"Test\",\n        \"Coverage\": \"Foreign Assistance\"\n    },\n    {\n        \"Provider\": \"Stanford Hospital & Clinics\",\n        \"ProviderId\": \"0013t00001a7uqFQAW\",\n        \"Status\": \"Approved\",\n        \"AdjustedAmount\": \"$10,00,000.00\",\n        \"ClaimAmount\": \"$10,00,000.00\",\n        \"Description\": \"Policy Coverage\",\n        \"Coverage\": \"PLENO\"\n    },\n    {\n        \"Provider\": \"Stanford Hospital & Clinics\",\n        \"Status\": \"Open\",\n        \"Description\": \"Medical Review\"\n    }\n]"}},"previewType":"runTime","sessionVars":[{"name":"title","val":"Line Items"}],"templates":{"0":{"templateUrl":"np-list-canvas-nds"}},"workspace":["np-claim-lineitem-card-lwc/VEX Personal Lines/1/1579596868708"],"enableLwc":true,"repeatCards":false,"lwc":{"MasterLabel":"npTableCanvas","DeveloperName":"npTableCanvas","Id":"0Rb3t000000LOiMCAA","name":"npTableCanvas"},"componentName":"cfNpClaimLineItemListLwc","GlobalKey__c":"np-claim-lineItem-list-lwc/1/VEX Personal Lines/1579596831664","enableUserInfo":true,"xmlObject":{"apiVersion":46,"isExplicitImport":false,"isExposed":true,"masterLabel":"np-claim-lineItem-list-lwc","runtimeNamespace":"vlocity_ins","targetConfigs":"CiAgICAgICAgICAgICAgICAgICAgICA8dGFyZ2V0Q29uZmlnIHRhcmdldHM9ImxpZ2h0bmluZ19fQXBwUGFnZSI+CiAgICAgICAgICAgICAgICAgICAgICA8cHJvcGVydHkgbmFtZT0iZGVidWciIHR5cGU9IkJvb2xlYW4iICAvPgogICAgICAgICAgICAgICAgICAgICAgICA8cHJvcGVydHkgbmFtZT0icmVjb3JkSWQiIHR5cGU9IlN0cmluZyIgIC8+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFyZ2V0Q29uZmlnPgogICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgPHRhcmdldENvbmZpZyB0YXJnZXRzPSJsaWdodG5pbmdfX1JlY29yZFBhZ2UiPgogICAgICAgICAgICAgICAgICAgICAgPHByb3BlcnR5IG5hbWU9ImRlYnVnIiB0eXBlPSJCb29sZWFuIiAgLz4KICAgICAgICAgICAgICAgICAgICAgICAgPC90YXJnZXRDb25maWc+CiAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICA8dGFyZ2V0Q29uZmlnIHRhcmdldHM9ImxpZ2h0bmluZ0NvbW11bml0eV9fRGVmYXVsdCI+CiAgICAgICAgICAgICAgICAgICAgICA8cHJvcGVydHkgbmFtZT0icmVjb3JkSWQiIHR5cGU9IlN0cmluZyIgIC8+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFyZ2V0Q29uZmlnPgogICAgICAgICAgICAgICAgICAgIA==","targets":[{"name":"RecordPage","target":"lightning__RecordPage"},{"name":"AppPage","target":"lightning__AppPage"},{"name":"HomePage","target":"lightning__HomePage"},{"name":"CommunityPage","target":"lightningCommunity__Page"},{"name":"CommunityDefault","target":"lightningCommunity__Default"}],"targetConfig":[{"target":"lightning__AppPage","property":[{"name":"debug","value":{"type":"Boolean","name":"debug","selectedProp":"debug"}},{"name":"recordId","value":{"type":"String","name":"recordId","selectedProp":"recordId"}}],"objects":[]},{"target":"lightning__RecordPage","property":[{"name":"debug","value":{"type":"Boolean","name":"debug","selectedProp":"debug"}}],"objects":[]},{"target":"lightningCommunity__Default","property":[{"name":"recordId","value":{"selectedProp":"name","type":"String","name":"recordId"}}],"objects":[]}]}}; 
            export default definition
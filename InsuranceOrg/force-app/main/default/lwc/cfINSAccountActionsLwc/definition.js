let definition = 
                {"Cards":["PersonAccountActionsLwc","Business Account"],"templates":{"0":{"templateUrl":"card-canvas-1x-simple-slds"}},"dataSource":{"type":"DataRaptor","value":{"body":"[\n    {\n        \"attributes\": {\n            \"type\": \"Account\",\n            \"url\": \"/services/data/v47.0/sobjects/Account/0013i00000BjUnCAAV\"\n        },\n        \"Id\": \"0013i00000BjUnCAAV\",\n        \"Name\": \"Ernie Newton\",\n        \"BillingAddress\": {\n            \"city\": \"San Francisco\",\n            \"country\": \"United States\",\n            \"geocodeAccuracy\": null,\n            \"latitude\": null,\n            \"longitude\": null,\n            \"postalCode\": \"94105\",\n            \"state\": \"CA\",\n            \"street\": \"50 Fremont Street\"\n        },\n        \"Phone\": \"(998) 778-9876\",\n        \"PhotoUrl\": \"/services/images/photo/0013i00000BjUnCAAV\",\n        \"RecordTypeId\": \"0123i000000gwOvAAI\",\n        \"RecordType\": {\n            \"attributes\": {\n                \"type\": \"RecordType\",\n                \"url\": \"/services/data/v47.0/sobjects/RecordType/0123i000000gwOvAAI\"\n            },\n            \"Name\": \"Person Account\",\n            \"Id\": \"0123i000000gwOvAAI\"\n        }\n    }\n]","jsonMap":"{\"params.id || params.Id\":\"{{params.id || params.Id}}\"}","bundle":"port_ReadAccountDetails_Card","inputMap":{"Id":"{{params.id}}"}},"contextVariables":[{"name":"params.id","val":"0013i00000HVg2pAAD"}]},"workspace":["PersonAccountActionsLwc/VEX Personal Lines/1/1580710804694","Business Account/VEX Personal Lines/1/1589301615567"],"previewType":"runTime","enableLwc":true,"repeatCards":false,"componentName":"cfINSAccountActionsLwc","GlobalKey__c":"INS-Account-Actions-lwc/1/VEX Personal Lines/1580710732233","lwc":{"MasterLabel":"cardCanvas1x","DeveloperName":"cardCanvas1x","Id":"0Rb3i000000bte8CAA","name":"cardCanvas1x","omniSupport":true},"enableUserInfo":true,"xmlObject":{"apiVersion":46,"isExplicitImport":false,"isExposed":true,"masterLabel":"INS-Account-Actions-lwc","runtimeNamespace":"vlocity_ins","targetConfigs":"CiAgICAgICAgICAgICAgICAgICAgICA8dGFyZ2V0Q29uZmlnIHRhcmdldHM9ImxpZ2h0bmluZ19fQXBwUGFnZSI+CiAgICAgICAgICAgICAgICAgICAgICA8cHJvcGVydHkgbmFtZT0iZGVidWciIHR5cGU9IkJvb2xlYW4iICAvPgogICAgICAgICAgICAgICAgICAgICAgICA8cHJvcGVydHkgbmFtZT0icmVjb3JkSWQiIHR5cGU9IlN0cmluZyIgIC8+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFyZ2V0Q29uZmlnPgogICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgPHRhcmdldENvbmZpZyB0YXJnZXRzPSJsaWdodG5pbmdfX1JlY29yZFBhZ2UiPgogICAgICAgICAgICAgICAgICAgICAgPHByb3BlcnR5IG5hbWU9ImRlYnVnIiB0eXBlPSJCb29sZWFuIiAgLz4KICAgICAgICAgICAgICAgICAgICAgICAgPC90YXJnZXRDb25maWc+CiAgICAgICAgICAgICAgICAgICAg","targets":[{"name":"RecordPage","target":"lightning__RecordPage"},{"name":"AppPage","target":"lightning__AppPage"},{"name":"HomePage","target":"lightning__HomePage"},{"name":"CommunityPage","target":"lightningCommunity__Page"},{"name":"CommunityDefault","target":"lightningCommunity__Default"}],"targetConfig":[{"target":"lightning__AppPage","property":[{"name":"debug","value":{"type":"Boolean","name":"debug","selectedProp":"debug"}},{"name":"recordId","value":{"type":"String","name":"recordId","selectedProp":"recordId"}}],"objects":[]},{"target":"lightning__RecordPage","property":[{"name":"debug","value":{"type":"Boolean","name":"debug","selectedProp":"debug"}}],"objects":[]}]}}; 
            export default definition
let definition = 
                {"GlobalKey__c":"vlocity-interaction-acuity-sidebar-offer-card-1x/VEX Personal Lines/1/1594191301463","dataSource":{"contextVariables":[{"name":"params.id","val":"a1Q3t000005zP0yEAC"}],"type":"ApexRemote","value":{"endpoint":"/services/apexrest/vlocity_ins/v1/acuity/offers?contextId={{params.id}}&pageSize=2","inputMap":{"interactionId":"{{params.id}}","offerEndPoint":"/services/apexrest/vlocity_ins/v1/acuity/consumerContactCenter"},"methodType":"GET","optionsMap":{"vlcClass":"vlocity_ins.GetInteractionAcuityOffer"},"remoteClass":"GetInteractionAcuityOffer","remoteMethod":"getInteractionOffers","remoteNSPrefix":"vlocity_ins","resultVar":"records"}},"enableLwc":true,"filter":{},"sessionVars":[{"name":"imageStyle","val":"height: 100px;"},{"name":"isSmartAction","val":"true"}],"states":[{"actionCtxId":"['contextId']","blankStateCheck":false,"collapse":false,"conditions":{"group":[{"field":"$scope.data.status","operator":"===","type":"system","value":"'active'"}]},"definedActions":{"actions":[]},"fields":[{"collapse":true,"label":"Name","name":"['resource']['Name']","type":"string"},{"collapse":true,"displayLabel":"['resource']['vlocity_ins__Description__c']","group":"Custom Properties","label":"resource Description","name":"['resource']['vlocity_ins__Description__c']","type":"string"}],"filter":"$scope.data.status === 'active'","isSmartAction":false,"lwc":{"MasterLabel":"cardMiniActiveInteraction1x","DeveloperName":"cardMiniActiveInteraction1x","Id":"0Rb3t000000LOsHCAY","name":"cardMiniActiveInteraction1x"},"name":"Offer","sObjectType":"Account","smartAction":{},"templateUrl":"vlocity-interaction-acuity-sidebar-offer-card"}],"title":"Vlocity Interaction Acuity Sidebar Offer Card"}; 
            export default definition
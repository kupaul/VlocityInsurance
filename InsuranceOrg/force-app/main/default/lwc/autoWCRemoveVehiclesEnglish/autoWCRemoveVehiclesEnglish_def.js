export const OMNIDEF = {"userTimeZone":-420,"userProfile":"System Administrator","userName":"vex_personal_lines@vlocity.com","userId":"0053t000007QARDAAY","userCurrencyCode":"USD","timeStamp":"2020-06-01T14:09:57.489Z","sOmniScriptId":"a3F3t000001X9s7EAK","sobjPL":{},"RPBundle":"","rMap":{},"response":null,"propSetMap":{"stepChartPlacement":"right","stylesheet":{"lightning":"","newport":""},"disableUnloadWarn":true,"errorMessage":{"custom":[]},"consoleTabIcon":"custom:custom18","consoleTabTitle":null,"rtpSeed":false,"showInputWidth":false,"currencyCode":"","autoFocus":false,"pubsub":false,"message":{},"ssm":false,"wpm":false,"consoleTabLabel":"New","cancelRedirectTemplateUrl":"vlcCancelled.html","cancelRedirectPageName":"OmniScriptCancelled","cancelSource":"%ContextId%","allowCancel":true,"cancelType":"SObject","visualforcePagesAvailableInPreview":{"Debugpage":"InsuranceRulesOmniScriptUniversal?layout=newport&debugLog=true"},"hideStepChart":false,"timeTracking":false,"knowledgeArticleTypeQueryFieldsMap":{},"lkObjName":null,"bLK":false,"enableKnowledge":false,"trackingCustomData":{},"seedDataJSON":{},"elementTypeToHTMLTemplateMapping":{"CoveragesDisplayTemplate":"ins-os-coverage-component","AttributesDisplayTemplate":"ins-os-attribute-component"},"autoSaveOnStepNext":false,"saveURLPatterns":{},"saveObjectId":"%ContextId%","saveContentEncoded":false,"saveForLaterRedirectTemplateUrl":"vlcSaveForLaterAcknowledge.html","saveForLaterRedirectPageName":"sflRedirect","saveExpireInDays":null,"saveNameTemplate":null,"allowSaveForLater":true,"persistentComponent":[{"modalConfigurationSetting":{"modalSize":"lg","modalController":"ModalProductCtrl","modalHTMLTemplateId":"vlcProductConfig.html"},"itemsKey":"cartItems","id":"vlcCart","responseJSONNode":"","responseJSONPath":"","sendJSONNode":"","sendJSONPath":"","postTransformBundle":"","preTransformBundle":"","remoteOptions":{"postTransformBundle":"","preTransformBundle":""},"remoteTimeout":30000,"remoteMethod":"","remoteClass":"","label":"","render":false},{"modalConfigurationSetting":{"modalSize":"lg","modalController":"","modalHTMLTemplateId":""},"itemsKey":"knowledgeItems","id":"vlcKnowledge","postTransformBundle":"","preTransformBundle":"","remoteOptions":{"postTransformBundle":"","preTransformBundle":""},"remoteTimeout":30000,"remoteMethod":"","remoteClass":"","label":"","render":false}]},"prefillJSON":"{}","lwcId":"a862abb7-b067-5ba1-5dc2-da736f700aa9","labelMap":{"CustomLWC1":"selectVehicles:CustomLWC1","effectiveDate":"selectVehicles:effectiveDate","viewPolicy":"confirmation:viewPolicy","priceDecBill":"confirmation:priceDecBill","priceReductionOneTime":"confirmation:priceReductionOneTime","txtModalPriceReduction":"configure:txtModalPriceReduction","txtPriceReduction":"configure:txtPriceReduction","absAmountOwed":"configure:absAmountOwed","modalPriceDifference":"configure:modalPriceDifference","absPriceDifference":"configure:absPriceDifference","newModalPrice":"configure:newModalPrice","newPrice":"configure:newPrice","isPreviousMode":"configure:isPreviousMode","previousBilldate":"configure:previousBilldate","feeDiff":"configure:feeDiff","taxDiff":"configure:taxDiff","priceDifference":"configure:priceDifference","timeFactor":"configure:timeFactor","EffectiveDate":"configure:EffectiveDate","confirmation":"confirmation","setPaymentValues":"setPaymentValues","updateNewPolicyStatus":"updateNewPolicyStatus","updatePolicyBillingValues":"updatePolicyBillingValues","CreatePolicyVersion":"CreatePolicyVersion","TransformToCreatePolicyVersion":"TransformToCreatePolicyVersion","configure":"configure","setDisplayValues":"setDisplayValues","removeInsuredItem":"removeInsuredItem","selectVehicles":"selectVehicles","transformForVehicleSelect":"transformForVehicleSelect","getVehicles":"getVehicles","SetPolicyId":"SetPolicyId"},"labelKeyMap":{},"errorMsg":"","error":"OK","dMap":{},"depSOPL":{},"depCusPL":{},"cusPL":{},"children":[{"type":"Set Values","propSetMap":{"validationRequired":"None","label":null,"pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":null,"showPersistentComponent":[false,false],"elementValueMap":{"Transaction":"add Vehicle","EffectiveDate":"=TODAY()","PolicyId":"=%ContextId%"},"controlWidth":12,"aggElements":{}},"offSet":0,"name":"SetPolicyId","level":0,"indexInParent":0,"bHasAttachment":false,"bEmbed":false,"bSetValues":true,"JSONPath":"SetPolicyId","lwcId":"lwc0"},{"type":"Remote Action","propSetMap":{"disOnTplt":false,"enableActionMessage":false,"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":"getInsuredItems","svgIcon":"","svgSprite":"","pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":null,"showPersistentComponent":[false,false],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","redirectPageName":"","validationRequired":"None","failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","extraPayload":{},"responseJSONNode":"","responseJSONPath":"","sendJSONNode":"","sendJSONPath":"","postTransformBundle":"","preTransformBundle":"","remoteTimeout":30000,"remoteOptions":{"productCode":"autoVehicle","assetId":"%ContextId%","preTransformBundle":"","postTransformBundle":""},"remoteMethod":"getInsuredItems","remoteClass":"InsPolicyService","controlWidth":12,"aggElements":{}},"offSet":0,"name":"getVehicles","level":0,"indexInParent":1,"bHasAttachment":false,"bEmbed":false,"bRemoteAction":true,"JSONPath":"getVehicles","lwcId":"lwc1"},{"type":"DataRaptor Transform Action","propSetMap":{"disOnTplt":false,"enableActionMessage":false,"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":"Transform For Driver Select","pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":null,"showPersistentComponent":[false,false],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","redirectPageName":"","validationRequired":"Submit","failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","responseJSONNode":"","responseJSONPath":"","sendJSONNode":"","sendJSONPath":"","remoteTimeout":30000,"bundle":"auto_TransfForVehicleSelect_removeVehiclesOS","controlWidth":12,"aggElements":{}},"offSet":0,"name":"transformForVehicleSelect","level":0,"indexInParent":2,"bHasAttachment":false,"bEmbed":false,"bDataRaptorTransformAction":true,"JSONPath":"transformForVehicleSelect","lwcId":"lwc2"},{"type":"Step","propSetMap":{"disOnTplt":false,"errorMessage":{"default":null,"custom":[]},"allowSaveForLater":true,"label":"Select the vehicle you want to remove.","chartLabel":"Select Vehicle","instructionKey":"","HTMLTemplateId":"","conditionType":"Hide if False","show":null,"knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"dataCategoryCriteria":"","keyword":"","publishStatus":"Online","language":"English"},"remoteOptions":{},"remoteTimeout":30000,"remoteMethod":"","remoteClass":"","showPersistentComponent":[false,false],"instruction":"","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","saveMessage":"Are you sure you want to save it for later?","saveLabel":"Save for later","cancelMessage":"Are you sure?","cancelLabel":"Cancel","nextWidth":3,"nextLabel":"Next","previousWidth":3,"previousLabel":"Previous","validationRequired":true,"uiElements":{"selectVehicles":"","effectiveDate":""},"aggElements":{"CustomLWC1":""}},"offSet":0,"name":"selectVehicles","level":0,"indexInParent":3,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Date","rootIndex":3,"response":null,"propSetMap":{"label":"Modification Effective Date","disOnTplt":false,"hide":false,"HTMLTemplateId":"","accessibleInFutureSteps":false,"conditionType":"Hide if False","show":null,"dateFormat":"MM-dd-yyyy","modelDateFormat":"yyyy-MM-dd","dateType":"string","help":false,"readOnly":false,"repeatClone":false,"repeat":false,"required":false,"inputWidth":12,"showInputWidth":false,"controlWidth":4},"name":"effectiveDate","level":1,"JSONPath":"selectVehicles:effectiveDate","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bDate":true,"lwcId":"lwc30-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":1,"eleArray":[{"type":"Custom Lightning Web Component","rootIndex":3,"response":null,"propSetMap":{"disOnTplt":false,"label":"CustomLWC1","customAttributes":[{"source":"%insuredVehicles%","name":"insured-item-record"}],"bStandalone":false,"lwcName":"selectableVehicles","hide":false,"conditionType":"Hide if False","show":null,"controlWidth":12},"name":"CustomLWC1","level":1,"JSONPath":"selectVehicles:CustomLWC1","indexInParent":1,"index":0,"children":[],"bHasAttachment":false,"bcustomlightningwebcomponent1":true,"lwcId":"lwc31-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"selectVehicles","lwcId":"lwc3"},{"type":"Remote Action","propSetMap":{"disOnTplt":false,"enableActionMessage":false,"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":"Remove Insured Item","svgIcon":"","svgSprite":"","pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":null,"showPersistentComponent":[false,false],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","redirectPageName":"","validationRequired":"None","failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","extraPayload":{},"responseJSONNode":"configureCoverages","responseJSONPath":"records","sendJSONNode":"","sendJSONPath":"","postTransformBundle":"","preTransformBundle":"","remoteTimeout":30000,"remoteOptions":{"effectiveDate":"%effectiveDate%","insuredItemId":"%selectVehicles:CustomLWC1:selectedInsuredId%","preTransformBundle":"","postTransformBundle":""},"remoteMethod":"removeInsuredItem","remoteClass":"InsPolicyService","controlWidth":12,"aggElements":{}},"offSet":0,"name":"removeInsuredItem","level":0,"indexInParent":4,"bHasAttachment":false,"bEmbed":false,"bRemoteAction":true,"JSONPath":"removeInsuredItem","lwcId":"lwc4"},{"type":"DataRaptor Extract Action","propSetMap":{"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":"Set Display Values","pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":null,"showPersistentComponent":[false,false],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","redirectPageName":"","validationRequired":"None","failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","responseJSONNode":"","responseJSONPath":"","remoteTimeout":30000,"dataRaptor Input Parameters":[{"element":"PolicyId","inputParam":"Id"}],"bundle":"auto_ReadPolicyDetails_modifyCoveragesOS","controlWidth":12,"aggElements":{}},"offSet":0,"name":"setDisplayValues","level":0,"indexInParent":5,"bHasAttachment":false,"bEmbed":false,"bDataRaptorExtractAction":true,"JSONPath":"setDisplayValues","lwcId":"lwc5"},{"type":"Step","propSetMap":{"errorMessage":{"default":null,"custom":[]},"allowSaveForLater":true,"label":"Your price changes","HTMLTemplateId":"","conditionType":"Hide if False","show":null,"knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"dataCategoryCriteria":"","keyword":"","publishStatus":"Online","language":"English"},"remoteOptions":{},"remoteTimeout":30000,"remoteMethod":"","remoteClass":"","showPersistentComponent":[false,false],"instruction":"","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","saveMessage":"Are you sure you want to save it for later?","saveLabel":"Save for later","cancelMessage":"Are you sure?","cancelLabel":"Cancel","nextWidth":5,"nextLabel":"Remove Vehicles","previousWidth":3,"previousLabel":"Previous","validationRequired":false,"uiElements":{"configure":""},"aggElements":{"EffectiveDate":"","timeFactor":"","priceDifference":"","taxDiff":"","feeDiff":"","previousBilldate":"","isPreviousMode":"","newPrice":"","newModalPrice":"","absPriceDifference":"","modalPriceDifference":"","absAmountOwed":""}},"offSet":0,"name":"configure","level":0,"indexInParent":6,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Formula","rootIndex":6,"response":null,"propSetMap":{"label":null,"disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":"Date","mask":null,"show":null,"hide":true,"expression":"%selectVehicles:effectiveDate%","inputWidth":12,"showInputWidth":false,"controlWidth":12},"name":"EffectiveDate","level":1,"JSONPath":"configure:EffectiveDate","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc60-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":1,"eleArray":[{"type":"Formula","rootIndex":6,"response":null,"propSetMap":{"currencySymbol":"$","label":null,"disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":"Number","mask":"","show":null,"hide":true,"expression":"ROUND((DATEDIFF(%EffectiveDate%,%endDate%))/(DATEDIFF(%startDate%,%endDate%)),3)","inputWidth":12,"showInputWidth":false,"controlWidth":3},"name":"timeFactor","level":1,"JSONPath":"configure:timeFactor","indexInParent":1,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc61-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":2,"eleArray":[{"type":"Formula","rootIndex":6,"response":null,"propSetMap":{"label":"priceDifference","disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":null,"mask":null,"show":null,"hide":true,"expression":"CURRENCY(ROUND((ROUND((%configureCoverages|1:Price%+%configureCoverages|1:vlocity_ins__TotalTaxAmount__c%+%configureCoverages|1:vlocity_ins__TotalFeeAmount__c%),2)-%originalPremium%),3))","inputWidth":12,"showInputWidth":false,"controlWidth":12},"name":"priceDifference","level":1,"JSONPath":"configure:priceDifference","indexInParent":2,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc62-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":3,"eleArray":[{"type":"Formula","rootIndex":6,"response":null,"propSetMap":{"label":null,"disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":null,"mask":null,"show":null,"hide":true,"expression":"ROUND(ABS(%configure:configureCoverages:records|1:vlocity_ins__TotalTaxAmount__c% - %TotalTax%),2)","inputWidth":12,"showInputWidth":false,"controlWidth":12},"name":"taxDiff","level":1,"JSONPath":"configure:taxDiff","indexInParent":3,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc63-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":4,"eleArray":[{"type":"Formula","rootIndex":6,"response":null,"propSetMap":{"label":null,"disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":null,"mask":null,"show":null,"hide":true,"expression":"ROUND(ABS(%configure:configureCoverages:records|1:vlocity_ins__TotalFeeAmount__c% - %TotalFee%),2)","inputWidth":12,"showInputWidth":false,"controlWidth":12},"name":"feeDiff","level":1,"JSONPath":"configure:feeDiff","indexInParent":4,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc64-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":5,"eleArray":[{"type":"Formula","rootIndex":6,"response":null,"propSetMap":{"label":"previousBilldate","disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":"Date","mask":null,"show":null,"hide":true,"expression":"MOMENT(%PolicyBillDate%).subtract(%numMonths%,'month')","inputWidth":12,"showInputWidth":false,"controlWidth":12},"name":"previousBilldate","level":1,"JSONPath":"configure:previousBilldate","indexInParent":5,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc65-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":6,"eleArray":[{"type":"Formula","rootIndex":6,"response":null,"propSetMap":{"label":"isPreviousMode","disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":"Number","mask":null,"show":null,"hide":true,"expression":"IF((DATEDIFF(%EffectiveDate%,%previousBilldate%)>0),1,0)","inputWidth":12,"showInputWidth":false,"controlWidth":12},"name":"isPreviousMode","level":1,"JSONPath":"configure:isPreviousMode","indexInParent":6,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc66-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":7,"eleArray":[{"type":"Formula","rootIndex":6,"response":null,"propSetMap":{"label":"NewPrice","disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":"Currency","mask":"$#,###.##","show":null,"hide":true,"expression":"CURRENCY(ROUND(%configureCoverages|1:Price%+%configureCoverages|1:vlocity_ins__TotalTaxAmount__c%+%configureCoverages|1:vlocity_ins__TotalFeeAmount__c%),3)","inputWidth":12,"showInputWidth":false,"controlWidth":12},"name":"newPrice","level":1,"JSONPath":"configure:newPrice","indexInParent":7,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc67-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":8,"eleArray":[{"type":"Formula","rootIndex":6,"response":null,"propSetMap":{"label":"NewPrice","disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":"Currency","mask":"$#,###.##","show":null,"hide":true,"expression":"CURRENCY(ROUND(%newPrice%/%Frequency%),3)","inputWidth":12,"showInputWidth":false,"controlWidth":12},"name":"newModalPrice","level":1,"JSONPath":"configure:newModalPrice","indexInParent":8,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc68-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":9,"eleArray":[{"type":"Formula","rootIndex":6,"response":null,"propSetMap":{"currencySymbol":"$","label":"absPriceDifference","disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":"Currency","mask":"$#,###.##","show":null,"hide":true,"expression":"ABS(%priceDifference%)","inputWidth":12,"showInputWidth":false,"controlWidth":3},"name":"absPriceDifference","level":1,"JSONPath":"configure:absPriceDifference","indexInParent":9,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc69-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":10,"eleArray":[{"type":"Formula","rootIndex":6,"response":null,"propSetMap":{"label":"Formula6","disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":"Currency","mask":"$#,###.##","show":null,"hide":true,"expression":"ROUND(ABS(%priceDifference%/%Frequency%),3)","inputWidth":12,"showInputWidth":false,"controlWidth":12},"name":"modalPriceDifference","level":1,"JSONPath":"configure:modalPriceDifference","indexInParent":10,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc610-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":11,"eleArray":[{"type":"Formula","rootIndex":6,"response":null,"propSetMap":{"currencySymbol":"$","label":null,"disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":"Currency","mask":"$#,###.##","show":null,"hide":true,"expression":"CURRENCY(ROUND((ABS(%priceDifference%)*%timeFactor%),2))","inputWidth":12,"showInputWidth":false,"controlWidth":3},"name":"absAmountOwed","level":1,"JSONPath":"configure:absAmountOwed","indexInParent":11,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc611-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":12,"eleArray":[{"type":"Text Block","rootIndex":6,"response":null,"propSetMap":{"disOnTplt":false,"label":null,"HTMLTemplateId":"","dataJSON":false,"show":{"group":{"rules":[{"field":"priceDifference","data":"0","condition":"<"},{"data":"One Time","field":"Mode","condition":"="}],"operator":"AND"}},"text":"<h3 style=\"text-align: center;\"><strong>Original Premium:</strong>&nbsp; $%originalPremium%</h3>\n<h3 style=\"text-align: center;\"><strong>New Premium:&nbsp;</strong>$%newPrice%</h3>\n<h3 style=\"text-align: center;\">Your&nbsp;annual premium&nbsp;would be reduced by %absPriceDifference%. &nbsp;</h3>\n<h3 style=\"text-align: center;\">&nbsp;</h3>","controlWidth":12},"name":"txtPriceReduction","level":1,"JSONPath":"configure:txtPriceReduction","indexInParent":12,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc612-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":13,"eleArray":[{"type":"Text Block","rootIndex":6,"response":null,"propSetMap":{"disOnTplt":false,"label":"TextBlock3","textKey":"","HTMLTemplateId":"","dataJSON":false,"show":{"group":{"rules":[{"field":"priceDifference","data":"0","condition":"<"},{"data":"One Time","field":"Mode","condition":"<>"}],"operator":"AND"}},"text":"<h3 style=\"text-align: center;\"><strong>Original Premium:</strong>&nbsp; $%originalPremium%</h3>\n<h3 style=\"text-align: center;\"><strong>New Premium:&nbsp;</strong>%newPrice%</h3>\n<h3 style=\"text-align: center;\">Your premium&nbsp;would be reduced by %modalPriceDifference% %Mode%</h3>\n<h3 style=\"text-align: center;\">&nbsp;</h3>","controlWidth":12},"name":"txtModalPriceReduction","level":1,"JSONPath":"configure:txtModalPriceReduction","indexInParent":13,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc613-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"configure","lwcId":"lwc6"},{"type":"DataRaptor Transform Action","propSetMap":{"disOnTplt":false,"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":null,"pubsub":false,"message":{},"ssm":false,"wpm":false,"show":null,"showPersistentComponent":[false,false],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","validationRequired":null,"failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","remoteTimeout":30000,"bundle":"auto_TranstoCreatePolicyVersion_removeEndorsementOS","controlWidth":12,"aggElements":{}},"offSet":0,"name":"TransformToCreatePolicyVersion","level":0,"indexInParent":7,"bHasAttachment":false,"bEmbed":false,"bDataRaptorTransformAction":true,"JSONPath":"TransformToCreatePolicyVersion","lwcId":"lwc7"},{"type":"Remote Action","propSetMap":{"useContinuation":false,"conditionType":"Hide if False","knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"dataCategoryCriteria":"","keyword":"","publishStatus":"Online","language":"English"},"completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","saveMessage":"Are you sure you want to save it for later?","saveLabel":"Save for later","cancelMessage":"Are you sure?","cancelLabel":"Cancel","nextWidth":3,"nextLabel":"Next","previousWidth":3,"previousLabel":"Previous","accessibleInFutureSteps":false,"modalConfigurationSetting":{"modalSize":"lg","modalController":"ModalProductCtrl","modalHTMLTemplateId":"vlcProductConfig.html"},"maxCompareSize":4,"modalController":"ModalInstanceCtrl","modalHTMLTemplateId":"vlcModalContent.html","dataJSON":false,"selectMode":"Single","itemsKey":"recSet","disOnTplt":false,"enableActionMessage":false,"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":"CreatePolicyVersion","svgIcon":"","svgSprite":"","pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":null,"showPersistentComponent":[false,false],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","redirectPageName":"","validationRequired":"None","failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","extraPayload":{},"responseJSONNode":"","responseJSONPath":"","sendJSONNode":"","sendJSONPath":"","postTransformBundle":"","preTransformBundle":"","remoteTimeout":30000,"remoteOptions":{"assetId":"%ContextId%","effectiveDate":"%configure:EffectiveDate%","includeRevenueSchedule":true,"createTransaction":true,"generatePolicyNumber":true,"inputKey":"policyJson","preTransformBundle":"","postTransformBundle":""},"remoteMethod":"createPolicyVersion","remoteClass":"InsPolicyService","controlWidth":12,"aggElements":{}},"offSet":0,"name":"CreatePolicyVersion","level":0,"indexInParent":8,"bHasAttachment":false,"bEmbed":false,"bRemoteAction":true,"JSONPath":"CreatePolicyVersion","lwcId":"lwc8"},{"type":"Integration Procedure Action","propSetMap":{"disOnTplt":false,"enableAbort":false,"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":"Update Policy Billing Values","svgIcon":"","svgSprite":"","pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":{"group":{"rules":[{"data":"One Time","field":"Mode","condition":"<>"}],"operator":"AND"}},"showPersistentComponent":[false,false],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","redirectPageName":"","validationRequired":"Step","failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","extraPayload":{},"responseJSONNode":"","responseJSONPath":"","sendJSONNode":"","sendJSONPath":"","postTransformBundle":"","preTransformBundle":"","remoteTimeout":30000,"remoteOptions":{"chainable":false,"useFuture":false,"postTransformBundle":"","preTransformBundle":""},"useContinuation":false,"integrationProcedureKey":"Auto_EndorsementBilling","controlWidth":12,"aggElements":{}},"offSet":0,"name":"updatePolicyBillingValues","level":0,"indexInParent":9,"bHasAttachment":false,"bEmbed":false,"bIntegrationProcedureAction":true,"JSONPath":"updatePolicyBillingValues","lwcId":"lwc9"},{"type":"DataRaptor Post Action","propSetMap":{"disOnTplt":false,"enableActionMessage":false,"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":"updateNewPolicyStatus","pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":null,"showPersistentComponent":[null,null],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","redirectPageName":"","validationRequired":"Submit","failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","sendJSONNode":"","sendJSONPath":"","postTransformBundle":"","remoteTimeout":30000,"bundle":"VPL-InForcePolicyVersion-104-1","controlWidth":12,"aggElements":{}},"offSet":0,"name":"updateNewPolicyStatus","level":0,"indexInParent":10,"bHasAttachment":false,"bEmbed":false,"bDataRaptorPostAction":true,"JSONPath":"updateNewPolicyStatus","lwcId":"lwc10"},{"type":"Set Values","propSetMap":{"validationRequired":"Step","disOnTplt":false,"label":"Set Payment Values","pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":{"group":{"rules":[{"field":"priceDifference","data":"0","condition":">"},{"data":"One Time","field":"Mode","condition":"="}],"operator":"AND"}},"showPersistentComponent":[false,false],"elementValueMap":{"TransactionAmount":"=%absAmountOwed% - %feeDiff% - %taxDiff%","trxTax":"=%taxDiff%","trxFee":"=%feeDiff%","trxEffectiveDate":"%selectVehicles:effectiveDate%","dueDate":"%configure:EffectiveDate%","PolicyNumber":"%policyNumber%","BalanceDueAmt":"%absAmountOwed%"},"controlWidth":12,"aggElements":{}},"offSet":0,"name":"setPaymentValues","level":0,"indexInParent":11,"bHasAttachment":false,"bEmbed":false,"bSetValues":true,"JSONPath":"setPaymentValues","lwcId":"lwc11"},{"type":"Step","propSetMap":{"disOnTplt":false,"message":{},"pubsub":false,"ssm":false,"wpm":false,"errorMessage":{"default":null,"custom":[]},"allowSaveForLater":true,"label":"Congratulations, your changes are complete!","chartLabel":"Confirmation","instructionKey":"","HTMLTemplateId":"","conditionType":"Hide if False","show":null,"knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"remoteOptions":{},"remoteTimeout":30000,"remoteMethod":"","remoteClass":"","showPersistentComponent":[false,false],"instruction":"","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","saveMessage":"Are you sure you want to save it for later?","saveLabel":"Save for later","cancelMessage":"Are you sure?","cancelLabel":"Cancel","nextWidth":3,"nextLabel":"Next","previousWidth":0,"previousLabel":"Previous","validationRequired":true,"uiElements":{"confirmation":""},"aggElements":{}},"offSet":0,"name":"confirmation","level":0,"indexInParent":12,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Text Block","rootIndex":12,"response":null,"propSetMap":{"disOnTplt":false,"label":null,"textKey":"","HTMLTemplateId":"","dataJSON":false,"show":{"group":{"rules":[{"field":"priceDifference","data":"0","condition":"<"},{"data":"One Time","field":"Mode","condition":"="}],"operator":"AND"}},"text":"<h3 style=\"text-align: center;\">Your policy changes will&nbsp;take effect on %EffectiveDate%.</h3>\n<h3 style=\"text-align: center;\">Your&nbsp;annual premium will be reduced by %absPriceDifference%. &nbsp;</h3>\n<h3 style=\"text-align: center;\">You will be credited with a refund of %absAmountOwed%.</h3>","controlWidth":12},"name":"priceReductionOneTime","level":1,"JSONPath":"confirmation:priceReductionOneTime","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc120-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":1,"eleArray":[{"type":"Text Block","rootIndex":12,"response":null,"propSetMap":{"disOnTplt":false,"label":null,"textKey":"","HTMLTemplateId":"","dataJSON":false,"show":{"group":{"rules":[{"field":"priceDifference","data":"0","condition":"<"},{"field":"Mode","data":"One Time","condition":"<>"}],"operator":"AND"}},"text":"<h3 style=\"text-align: center;\">Your policy changes will&nbsp;take effect on&nbsp;%EffectiveDate%.</h3>\n<h3 style=\"text-align: center;\">Your next bill will reflect&nbsp; a reduced charge of %NewAmount%.&nbsp;</h3>\n<h3 style=\"text-align: center;\">Your new Premium after that will be %NextAmountDue% %Mode%</h3>","controlWidth":12},"name":"priceDecBill","level":1,"JSONPath":"confirmation:priceDecBill","indexInParent":1,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc121-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":2,"eleArray":[{"type":"Navigate Action","rootIndex":12,"response":null,"propSetMap":{"targetName":"Asset","disOnTplt":false,"targetLWCLayoutOptions":["lightning","newport"],"targetLWCLayout":"lightning","replaceOptions":[{"value":false,"label":"No"},{"value":true,"label":"Yes"}],"replace":false,"iconPositionOptions":["left","right"],"iconPosition":"left","iconVariant":"","iconName":"","variantOptions":["brand","outline-brand","neutral","success","destructive","text-destructive","inverse","link"],"targetTypeOptions":["Component","Current Page","Knowledge Article","Named Page","Navigation Item","Object","Record","Record Relationship","Web Page","Vlocity OmniScript"],"targetId":"%policyId%","targetFilter":"Recent","recordActionOptions":["clone","edit","view"],"recordAction":"view","objectActionOptions":["home","list","new"],"objectAction":"home","label":"View Policy","message":{},"pubsub":false,"variant":"brand","HTMLTemplateId":"","show":null,"validationRequired":"none","targetType":"Record","controlWidth":12},"name":"viewPolicy","level":1,"JSONPath":"confirmation:viewPolicy","indexInParent":2,"index":0,"children":[],"bHasAttachment":false,"bNavigate":true,"lwcId":"lwc122-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"confirmation","lwcId":"lwc12"}],"bReusable":false,"bpVersion":2,"bpType":"autoWC","bpSubType":"RemoveVehicles","bpLang":"English","bHasAttachment":false,"lwcVarMap":{"insuredVehicles":null}};
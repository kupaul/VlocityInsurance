export const OMNIDEF = {"userTimeZone":-420,"userProfile":"System Administrator","userName":"kuntal.paul-25230353505@vlocityapps.com","userId":"0053t000007QARDAA4","userCurrencyCode":"USD","timeStamp":"2020-08-15T12:40:46.696Z","sOmniScriptId":"a3F3t000001X9s1EAC","sobjPL":{},"RPBundle":"","rMap":{},"response":null,"propSetMap":{"stepChartPlacement":"right","stylesheet":{"lightning":"","newport":""},"disableUnloadWarn":true,"errorMessage":{"custom":[]},"consoleTabIcon":"custom:custom18","consoleTabTitle":null,"rtpSeed":false,"showInputWidth":false,"currencyCode":"","autoFocus":false,"pubsub":false,"message":{},"ssm":false,"wpm":false,"consoleTabLabel":"New","cancelRedirectTemplateUrl":"vlcCancelled.html","cancelRedirectPageName":"OmniScriptCancelled","cancelSource":"%ContextId%","allowCancel":true,"cancelType":"SObject","visualforcePagesAvailableInPreview":{},"hideStepChart":false,"timeTracking":true,"knowledgeArticleTypeQueryFieldsMap":{},"lkObjName":null,"bLK":false,"enableKnowledge":false,"trackingCustomData":{},"seedDataJSON":{},"elementTypeToHTMLTemplateMapping":{},"autoSaveOnStepNext":false,"saveURLPatterns":{},"saveObjectId":"%ContextId%","saveContentEncoded":false,"saveForLaterRedirectTemplateUrl":"vlcSaveForLaterAcknowledge.html","saveForLaterRedirectPageName":"sflRedirect","saveExpireInDays":null,"saveNameTemplate":null,"allowSaveForLater":true,"persistentComponent":[{"sendJSONPath":"","sendJSONNode":"","responseJSONPath":"","responseJSONNode":"","render":false,"remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"","remoteClass":"","preTransformBundle":"","postTransformBundle":"","modalConfigurationSetting":{"modalSize":"lg","modalHTMLTemplateId":"vlcProductConfig.html","modalController":"ModalProductCtrl"},"label":"","itemsKey":"cartItems","id":"vlcCart"},{"render":false,"remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"","remoteClass":"","preTransformBundle":"","postTransformBundle":"","modalConfigurationSetting":{"modalSize":"lg","modalHTMLTemplateId":"","modalController":""},"label":"","itemsKey":"knowledgeItems","id":"vlcKnowledge"}]},"prefillJSON":"{}","lwcId":"6805acb5-a042-926d-82cb-28bc9db74d46","labelMap":{"cancellationDetailsHeadline":"confirmCancellation:cancellationDetailsHeadline","modPremCurrency":"confirmCancellation:modPremCurrency","refund":"confirmCancellation:refund","effectiveDateValidation":"cancelPolicy:effectiveDateValidation","originalPremium":"cancelPolicy:originalPremium","endDate":"cancelPolicy:endDate","startDate":"cancelPolicy:startDate","hdlPolicyDetails":"cancelPolicy:hdlPolicyDetails","spacingTextBlock":"cancelPolicy:spacingTextBlock","lineBreak1":"cancelPolicy:lineBreak1","effectiveDate":"cancelPolicy:effectiveDate","hldDateSpacer":"cancelPolicy:hldDateSpacer","viewPolicy":"viewPolicy","cancelPolicyService":"cancelPolicyService","confirmCancellation":"confirmCancellation","prepareToCancel":"prepareToCancel","cancelPolicy":"cancelPolicy","setEffectiveDate":"setEffectiveDate","setDisplayValues":"setDisplayValues","getPolicyDetails":"getPolicyDetails"},"labelKeyMap":{},"errorMsg":"","error":"OK","dMap":{},"depSOPL":{},"depCusPL":{},"cusPL":{},"children":[{"type":"Remote Action","propSetMap":{"disOnTplt":false,"enableActionMessage":false,"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":"RemoteAction3","svgIcon":"","svgSprite":"","pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":null,"showPersistentComponent":[false,false],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","redirectPageName":"","validationRequired":"None","failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","extraPayload":{},"responseJSONNode":"","responseJSONPath":"","sendJSONNode":"","sendJSONPath":"","postTransformBundle":"Ins_TransforPolicyDetails_CancelPolicyOS","preTransformBundle":"","remoteTimeout":30000,"remoteOptions":{"assetId":"%ContextId%","preTransformBundle":"","postTransformBundle":null},"remoteMethod":"getPolicyDetails","remoteClass":"InsPolicyService","controlWidth":12,"aggElements":{}},"offSet":0,"name":"getPolicyDetails","level":0,"indexInParent":0,"bHasAttachment":false,"bEmbed":false,"bRemoteAction":true,"JSONPath":"getPolicyDetails","lwcId":"lwc0"},{"type":"DataRaptor Transform Action","propSetMap":{"disOnTplt":false,"enableActionMessage":false,"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":null,"pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":null,"showPersistentComponent":[false,false],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","redirectPageName":"","validationRequired":"Submit","failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","responseJSONNode":"","responseJSONPath":"","sendJSONNode":"","sendJSONPath":"","remoteTimeout":30000,"bundle":"Ins_TransforPolicyDetails_CancelPolicyOS","controlWidth":12,"aggElements":{}},"offSet":0,"name":"setDisplayValues","level":0,"indexInParent":1,"bHasAttachment":false,"bEmbed":false,"bDataRaptorTransformAction":true,"JSONPath":"setDisplayValues","lwcId":"lwc1"},{"type":"Set Values","propSetMap":{"wpm":false,"validationRequired":"None","ssm":false,"showPersistentComponent":[false,false],"show":null,"message":{},"label":"setEffectiveDate","elementValueMap":{"effectiveDate":"=TODAY()"},"disOnTplt":false,"controlWidth":12,"aggElements":{}},"offSet":0,"name":"setEffectiveDate","level":0,"indexInParent":2,"bHasAttachment":false,"bEmbed":false,"bSetValues":true,"JSONPath":"setEffectiveDate","lwcId":"lwc2"},{"type":"Step","propSetMap":{"validationRequired":true,"showPersistentComponent":[false,false],"show":null,"saveMessage":"Are you sure you want to save it for later?","saveLabel":"Save for later","remoteTimeout":30000,"remoteOptions":{},"remoteMethod":"","remoteClass":"","previousWidth":3,"previousLabel":"Previous","nextWidth":6,"nextLabel":"Calculate and Display Refund","label":"When would you like the cancellation to take effect?","knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"instruction":"","errorMessage":{"default":null,"custom":[]},"conditionType":"Hide if False","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","chartLabel":"Details","cancelMessage":"Are you sure?","cancelLabel":"Cancel","allowSaveForLater":true,"HTMLTemplateId":"","uiElements":{"cancelPolicy":"","effectiveDate":"","startDate":"","endDate":"","originalPremium":""},"aggElements":{}},"offSet":0,"name":"cancelPolicy","level":0,"indexInParent":3,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Headline","rootIndex":3,"response":null,"propSetMap":{"show":null,"labelKey":"","label":null,"disOnTplt":false,"controlWidth":4,"HTMLTemplateId":""},"name":"hldDateSpacer","level":1,"JSONPath":"cancelPolicy:hldDateSpacer","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"lwcId":"lwc30-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":1,"eleArray":[{"type":"Date","rootIndex":3,"response":null,"propSetMap":{"showInputWidth":false,"show":null,"required":false,"repeatClone":false,"repeat":false,"readOnly":false,"modelDateFormat":"yyyy-MM-dd","label":"Cancellation Date","inputWidth":12,"hide":false,"helpText":"","help":false,"disOnTplt":false,"dateType":"string","dateFormat":"MM-dd-yyyy","controlWidth":4,"conditionType":"Hide if False","accessibleInFutureSteps":false,"HTMLTemplateId":""},"name":"effectiveDate","level":1,"JSONPath":"cancelPolicy:effectiveDate","indexInParent":1,"index":0,"children":[],"bHasAttachment":false,"bDate":true,"lwcId":"lwc31-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":2,"eleArray":[{"type":"Line Break","rootIndex":3,"response":null,"propSetMap":{"show":null,"padding":0,"label":"LineBreak1","disOnTplt":false,"HTMLTemplateId":""},"name":"lineBreak1","level":1,"JSONPath":"cancelPolicy:lineBreak1","indexInParent":2,"index":0,"children":[],"bHasAttachment":false,"bLineBreak":true,"lwcId":"lwc32-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":3,"eleArray":[{"type":"Text Block","rootIndex":3,"response":null,"propSetMap":{"textKey":"","text":"","show":null,"label":null,"disOnTplt":false,"dataJSON":false,"controlWidth":12,"HTMLTemplateId":""},"name":"spacingTextBlock","level":1,"JSONPath":"cancelPolicy:spacingTextBlock","indexInParent":3,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc33-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":4,"eleArray":[{"type":"Headline","rootIndex":3,"response":null,"propSetMap":{"show":null,"label":"<h3>Policy Details</h3>","disOnTplt":false,"controlWidth":12,"HTMLTemplateId":""},"name":"hdlPolicyDetails","level":1,"JSONPath":"cancelPolicy:hdlPolicyDetails","indexInParent":4,"index":0,"children":[],"bHasAttachment":false,"lwcId":"lwc34-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":5,"eleArray":[{"type":"Date","rootIndex":3,"response":null,"propSetMap":{"showInputWidth":false,"show":null,"required":false,"repeatClone":false,"repeat":false,"readOnly":true,"modelDateFormat":"yyyy-MM-dd","label":"Start Date","inputWidth":12,"hide":false,"helpText":"","help":false,"disOnTplt":false,"dateType":"string","dateFormat":"MM-dd-yyyy","controlWidth":4,"conditionType":"Hide if False","accessibleInFutureSteps":false,"HTMLTemplateId":""},"name":"startDate","level":1,"JSONPath":"cancelPolicy:startDate","indexInParent":5,"index":0,"children":[],"bHasAttachment":false,"bDate":true,"lwcId":"lwc35-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":6,"eleArray":[{"type":"Date","rootIndex":3,"response":null,"propSetMap":{"showInputWidth":false,"show":null,"required":false,"repeatClone":false,"repeat":false,"readOnly":true,"modelDateFormat":"yyyy-MM-dd","label":"End Date","inputWidth":12,"hide":false,"helpText":"","help":false,"disOnTplt":false,"dateType":"string","dateFormat":"MM-dd-yyyy","controlWidth":4,"conditionType":"Hide if False","accessibleInFutureSteps":false,"HTMLTemplateId":""},"name":"endDate","level":1,"JSONPath":"cancelPolicy:endDate","indexInParent":6,"index":0,"children":[],"bHasAttachment":false,"bDate":true,"lwcId":"lwc36-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":7,"eleArray":[{"type":"Currency","rootIndex":3,"response":null,"propSetMap":{"showInputWidth":false,"show":null,"required":false,"repeatClone":false,"repeat":false,"readOnly":true,"min":null,"max":null,"mask":2,"label":"Original Premium","inputWidth":12,"hideGroupSep":false,"hide":false,"helpText":"","help":false,"disOnTplt":false,"debounceValue":0,"currencySymbol":"$","controlWidth":4,"conditionType":"Hide if False","allowNegative":false,"accessibleInFutureSteps":false,"HTMLTemplateId":""},"name":"originalPremium","level":1,"JSONPath":"cancelPolicy:originalPremium","indexInParent":7,"index":0,"children":[],"bHasAttachment":false,"bCurrency":true,"lwcId":"lwc37-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":8,"eleArray":[{"type":"Validation","rootIndex":3,"response":null,"propSetMap":{"validateExpression":{"group":{"rules":[{"field":"effectiveDate","data":"endDate","condition":"<"}],"operator":"OR"}},"show":null,"messages":[{"value":true,"type":"Success","text":"","active":false},{"value":false,"type":"Requirement","text":"Any new end date must be prior to existing policy end date.","active":true}],"label":"Effective Date","hideLabel":true,"controlWidth":12,"HTMLTemplateId":""},"name":"effectiveDateValidation","level":1,"JSONPath":"cancelPolicy:effectiveDateValidation","indexInParent":8,"index":0,"children":[],"bHasAttachment":false,"bMessaging":true,"lwcId":"lwc38-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"cancelPolicy","lwcId":"lwc3"},{"type":"Remote Action","propSetMap":{"disOnTplt":false,"enableActionMessage":false,"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":"Prepare to cancel","pubsub":false,"message":{},"ssm":false,"wpm":false,"show":null,"showPersistentComponent":[false,false],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","validationRequired":"None","failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","extraPayload":{},"preTransformBundle":"","remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":"","effectiveDate":"%effectiveDate%","assetId":"%ContextId%"},"remoteMethod":"prepareToCancelPolicy","remoteClass":"InsPolicyService","controlWidth":12,"aggElements":{}},"offSet":0,"name":"prepareToCancel","level":0,"indexInParent":4,"bHasAttachment":false,"bEmbed":false,"bRemoteAction":true,"JSONPath":"prepareToCancel","lwcId":"lwc4"},{"type":"Step","propSetMap":{"validationRequired":true,"showPersistentComponent":[false,false],"show":null,"saveMessage":"Are you sure you want to save it for later?","saveLabel":"Save for later","remoteTimeout":30000,"remoteOptions":{},"remoteMethod":"","remoteClass":"","previousWidth":3,"previousLabel":"Previous","nextWidth":6,"nextLabel":"Approve and Proceed","label":"Please review & confirm your cancellation","knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"instruction":"","errorMessage":{"default":null,"custom":[]},"conditionType":"Hide if False","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","chartLabel":"Review","cancelMessage":"Are you sure?","cancelLabel":"Cancel","allowSaveForLater":true,"HTMLTemplateId":"","uiElements":{"confirmCancellation":""},"aggElements":{"refund":"","modPremCurrency":""}},"offSet":0,"name":"confirmCancellation","level":0,"indexInParent":5,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Formula","rootIndex":5,"response":null,"propSetMap":{"label":"refund","disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":"Currency","mask":null,"show":null,"hide":true,"expression":"%priceDiff%","inputWidth":12,"showInputWidth":false,"controlWidth":12},"name":"refund","level":1,"JSONPath":"confirmCancellation:refund","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc50-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":1,"eleArray":[{"type":"Formula","rootIndex":5,"response":null,"propSetMap":{"label":"Formula1","disOnTplt":false,"HTMLTemplateId":"","dateFormat":"MM-dd-yyyy","hideGroupSep":false,"dataType":"Currency","mask":null,"show":null,"hide":true,"expression":"CURRENCY(ROUND(%originalPremium%-%refund%,2))","inputWidth":12,"showInputWidth":false,"controlWidth":12},"name":"modPremCurrency","level":1,"JSONPath":"confirmCancellation:modPremCurrency","indexInParent":1,"index":0,"children":[],"bHasAttachment":false,"bFormula":true,"lwcId":"lwc51-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":2,"eleArray":[{"type":"Text Block","rootIndex":5,"response":null,"propSetMap":{"disOnTplt":false,"label":null,"textKey":"","HTMLTemplateId":"","dataJSON":false,"show":null,"text":"<table style=\"width: 405px; margin-left: auto; margin-right: auto;\">\n<tbody>\n<tr>\n<td style=\"width: 258.582px;\">\n<h3><strong>Cancellation Date:&nbsp;</strong></h3>\n</td>\n<td style=\"width: 146.418px; text-align: right;\">\n<h3>%effectiveDate%</h3>\n</td>\n</tr>\n<tr>\n<td style=\"width: 258.582px;\">\n<h3><strong>Original Period Premium:</strong></h3>\n</td>\n<td style=\"width: 146.418px; text-align: right;\">\n<h3>%originalPremium%</h3>\n</td>\n</tr>\n<tr>\n<td style=\"width: 258.582px;\">\n<h3><strong>Modified Period Premium:</strong></h3>\n</td>\n<td style=\"width: 146.418px; text-align: right;\">\n<h3>%modPremCurrency%</h3>\n</td>\n</tr>\n<tr>\n<td style=\"width: 258.582px;\">\n<h3><strong>Refund:</strong></h3>\n</td>\n<td style=\"width: 146.418px; text-align: right;\">\n<h3>%refund%</h3>\n</td>\n</tr>\n</tbody>\n</table>\n<p style=\"text-align: center;\"></p>\n<h5 style=\"text-align: center;\">&nbsp;</h5>\n<h5 style=\"text-align: center;\">Clicking Approve will execute this cancellation on the scheduled cancellation date.&nbsp;</h5>\n<h5 style=\"text-align: center;\">You will receive the refund only after the cancel date has passed.</h5>","controlWidth":12},"name":"cancellationDetailsHeadline","level":1,"JSONPath":"confirmCancellation:cancellationDetailsHeadline","indexInParent":2,"index":0,"children":[],"bHasAttachment":false,"bTextBlock":true,"lwcId":"lwc52-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"confirmCancellation","lwcId":"lwc5"},{"type":"Remote Action","propSetMap":{"disOnTplt":false,"enableActionMessage":false,"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":"Cancel Policy","svgIcon":"","svgSprite":"","pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":null,"showPersistentComponent":[false,false],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","redirectPageName":"","validationRequired":"None","failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","extraPayload":{},"responseJSONNode":"","responseJSONPath":"","sendJSONNode":"","sendJSONPath":"","postTransformBundle":"","preTransformBundle":"","remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":"","includeRevenueSchedule":true,"effectiveDate":"%effectiveDate%","createTransaction":true,"assetId":"%ContextId%"},"remoteMethod":"cancelPolicy","remoteClass":"InsPolicyService","controlWidth":12,"aggElements":{}},"offSet":0,"name":"cancelPolicyService","level":0,"indexInParent":6,"bHasAttachment":false,"bEmbed":false,"bRemoteAction":true,"JSONPath":"cancelPolicyService","lwcId":"lwc6"},{"type":"Navigate Action","propSetMap":{"targetName":"Asset","disOnTplt":false,"targetLWCLayoutOptions":["lightning","newport"],"targetLWCLayout":"lightning","replaceOptions":[{"value":false,"label":"No"},{"value":true,"label":"Yes"}],"replace":false,"iconPositionOptions":["left","right"],"iconPosition":"left","iconVariant":"","iconName":"","variantOptions":["brand","outline-brand","neutral","success","destructive","text-destructive","inverse","link"],"targetTypeOptions":["Component","Current Page","Knowledge Article","Named Page","Navigation Item","Object","Record","Record Relationship","Web Page","Vlocity OmniScript"],"targetId":"%ContextId%","targetFilter":"Recent","recordActionOptions":["clone","edit","view"],"recordAction":"view","objectActionOptions":["home","list","new"],"objectAction":"home","label":"View Policy","message":{},"pubsub":false,"variant":"neutral","HTMLTemplateId":"","show":null,"validationRequired":"none","targetType":"Record","controlWidth":12,"aggElements":{}},"offSet":0,"name":"viewPolicy","level":0,"indexInParent":7,"bHasAttachment":false,"bEmbed":false,"bNavigate":true,"JSONPath":"viewPolicy","lwcId":"lwc7"}],"bReusable":false,"bpVersion":1,"bpType":"ins","bpSubType":"PolicyCancellation","bpLang":"English","bHasAttachment":false,"lwcVarMap":{}};
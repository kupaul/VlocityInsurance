export const OMNIDEF = {"userTimeZone":-420,"userProfile":"System Administrator","userName":"kuntal.paul-25230353505@vlocityapps.com","userId":"0053t000007QARDAA4","userCurrencyCode":"USD","timeStamp":"2020-10-30T10:57:02.264Z","sOmniScriptId":"a3F3t000000qNyfEAE","sobjPL":{},"RPBundle":"","rMap":{},"response":null,"propSetMap":{"stepChartPlacement":"right","stylesheet":{"lightning":"","newport":""},"disableUnloadWarn":true,"errorMessage":{"custom":[]},"consoleTabIcon":"custom:custom18","consoleTabTitle":null,"rtpSeed":false,"showInputWidth":true,"currencyCode":"","autoFocus":false,"pubsub":false,"message":{},"ssm":false,"wpm":false,"consoleTabLabel":"New","cancelRedirectTemplateUrl":"vlcCancelled.html","cancelRedirectPageName":"OmniScriptCancelled","cancelSource":"%ContextId%","allowCancel":true,"cancelType":"SObject","visualforcePagesAvailableInPreview":{},"hideStepChart":false,"timeTracking":true,"knowledgeArticleTypeQueryFieldsMap":{},"lkObjName":null,"bLK":false,"enableKnowledge":false,"trackingCustomData":{},"seedDataJSON":{},"elementTypeToHTMLTemplateMapping":{},"autoSaveOnStepNext":false,"saveURLPatterns":{},"saveObjectId":"%ContextId%","saveContentEncoded":false,"saveForLaterRedirectTemplateUrl":"vlcSaveForLaterAcknowledge.html","saveForLaterRedirectPageName":"sflRedirect","saveExpireInDays":null,"saveNameTemplate":null,"allowSaveForLater":true,"persistentComponent":[{"sendJSONPath":"","sendJSONNode":"","responseJSONPath":"","responseJSONNode":"","render":false,"remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"","remoteClass":"","preTransformBundle":"","postTransformBundle":"","modalConfigurationSetting":{"modalSize":"lg","modalHTMLTemplateId":"vlcProductConfig.html","modalController":"ModalProductCtrl"},"label":"","itemsKey":"cartItems","id":"vlcCart"},{"render":false,"remoteTimeout":30000,"remoteOptions":{"preTransformBundle":"","postTransformBundle":""},"remoteMethod":"","remoteClass":"","preTransformBundle":"","postTransformBundle":"","modalConfigurationSetting":{"modalSize":"lg","modalHTMLTemplateId":"","modalController":""},"label":"","itemsKey":"knowledgeItems","id":"vlcKnowledge"}]},"prefillJSON":"{}","lwcId":"f5e22af6-56c9-c76f-c457-f9c557171964","labelMap":{"payMethod":"paymentDetails:payMethod","savePaymentMethod":"paymentDetails:savePaymentMethod","paymentDate":"paymentDetails:paymentDate","BalanceDueAmt":"paymentDetails:BalanceDueAmt","CreatePaymentMethod":"CreatePaymentMethod","paymentDetails":"paymentDetails","SetValues":"SetValues"},"labelKeyMap":{},"errorMsg":"","error":"OK","dMap":{"CABHAEDAAcc727d80b62142c9a83b83ef3f764e71":"0153t000003vdhYAAQ"},"depSOPL":{},"depCusPL":{},"cusPL":{},"children":[{"type":"Set Values","propSetMap":{"validationRequired":"None","showInputWidth":false,"required":false,"repeatClone":false,"repeat":false,"readOnly":false,"minLength":0,"maxLength":255,"inputWidth":12,"hide":false,"help":false,"debounceValue":0,"conditionType":"Hide if False","accessibleInFutureSteps":false,"label":null,"pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":null,"showPersistentComponent":[false,false],"elementValueMap":{"paymentDate":"=TODAY()","Checkout":"='yes'"},"controlWidth":12,"aggElements":{}},"offSet":0,"name":"SetValues","level":0,"indexInParent":0,"bHasAttachment":false,"bEmbed":false,"bSetValues":true,"JSONPath":"SetValues","lwcId":"lwc0"},{"type":"Step","propSetMap":{"documentNames":["CABHAEDAAcc727d80b62142c9a83b83ef3f764e71"],"errorMessage":{"default":null,"custom":[]},"allowSaveForLater":true,"label":"Enter payment details","chartLabel":"","instructionKey":"","HTMLTemplateId":"","conditionType":"Hide if False","show":null,"knowledgeOptions":{"typeFilter":"","remoteTimeout":30000,"publishStatus":"Online","language":"English","keyword":"","dataCategoryCriteria":""},"remoteOptions":{},"remoteTimeout":30000,"remoteMethod":"","remoteClass":"","showPersistentComponent":[true,false],"instruction":"<p><img src=\"../servlet/servlet.FileDownload?file=0153i000000M6Z0AAK&amp;&amp;docName=CABHAEDAAcc727d80b62142c9a83b83ef3f764e71\" alt=\"\" width=\"60\" height=\"60\" /></p>","completeMessage":"Are you sure you want to complete the script?","completeLabel":"Complete","saveMessage":"Are you sure you want to save it for later?","saveLabel":"Save for later","cancelMessage":"Are you sure?","cancelLabel":"Cancel","nextWidth":6,"nextLabel":"Proceed to Pay","previousWidth":3,"previousLabel":"Previous","validationRequired":true,"uiElements":{"paymentDetails":"","BalanceDueAmt":"","paymentDate":"","savePaymentMethod":"","payMethod":""},"aggElements":{}},"offSet":0,"name":"paymentDetails","level":0,"indexInParent":1,"bHasAttachment":false,"bEmbed":false,"response":null,"inheritShowProp":null,"children":[{"response":null,"level":1,"indexInParent":0,"eleArray":[{"type":"Currency","rootIndex":1,"response":null,"propSetMap":{"label":"Payment Amount","disOnTplt":false,"hide":false,"HTMLTemplateId":"","debounceValue":0,"accessibleInFutureSteps":false,"conditionType":"Hide if False","show":null,"hideGroupSep":false,"allowNegative":false,"max":null,"min":null,"mask":null,"helpText":"","help":false,"defaultValue":null,"readOnly":false,"repeatLimit":null,"repeatClone":false,"repeat":false,"required":false,"inputWidth":12,"showInputWidth":false,"controlWidth":4},"name":"BalanceDueAmt","level":1,"JSONPath":"paymentDetails:BalanceDueAmt","indexInParent":0,"index":0,"children":[],"bHasAttachment":false,"bCurrency":true,"lwcId":"lwc10-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":1,"eleArray":[{"type":"Date","rootIndex":1,"response":null,"propSetMap":{"label":"Payment Date","maxDate":"%quoteExpirationDate%","minDate":"%quoteEffectiveDate%","disOnTplt":false,"hide":false,"HTMLTemplateId":"","accessibleInFutureSteps":true,"conditionType":"Hide if False","show":null,"dateFormat":"MM-dd-yyyy","modelDateFormat":"yyyy-MM-dd","dateType":"date","helpText":"","help":false,"defaultValue":null,"readOnly":false,"repeatLimit":null,"repeatClone":false,"repeat":false,"required":false,"inputWidth":12,"showInputWidth":false,"controlWidth":4},"name":"paymentDate","level":1,"JSONPath":"paymentDetails:paymentDate","indexInParent":1,"index":0,"children":[],"bHasAttachment":false,"bDate":true,"lwcId":"lwc11-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":2,"eleArray":[{"type":"Checkbox","rootIndex":1,"response":null,"propSetMap":{"label":"Checkbox1","disOnTplt":false,"hide":false,"HTMLTemplateId":"","accessibleInFutureSteps":false,"conditionType":"Hide if False","show":null,"checkLabel":"Save this payment method?","helpText":"","help":false,"defaultValue":false,"readOnly":false,"repeatLimit":null,"repeatClone":false,"repeat":false,"controlWidth":12},"name":"savePaymentMethod","level":1,"JSONPath":"paymentDetails:savePaymentMethod","indexInParent":2,"index":0,"children":[],"bHasAttachment":false,"bCheckbox":true,"lwcId":"lwc12-0"}],"bHasAttachment":false},{"response":null,"level":1,"indexInParent":3,"eleArray":[{"type":"Radio","rootIndex":1,"response":null,"propSetMap":{"label":"Method of Payment","disOnTplt":false,"enableCaption":true,"imageCountInRow":3,"optionHeight":100,"optionWidth":100,"hide":false,"HTMLTemplateId":"","accessibleInFutureSteps":false,"conditionType":"Hide if False","show":null,"controllingField":{"type":"","source":"","element":""},"optionSource":{"type":"","source":""},"options":[{"autoAdv":"next","value":"Electronic Check","name":"Bank Account"},{"autoAdv":"next","value":"Credit Card","name":"Credit Card"}],"helpText":"","help":false,"defaultValue":null,"horizontalMode":"displayWide","readOnly":false,"repeatLimit":null,"repeatClone":false,"repeat":false,"required":true,"controlWidth":12},"name":"payMethod","level":1,"JSONPath":"paymentDetails:payMethod","indexInParent":3,"index":0,"children":[],"bHasAttachment":false,"bRadio":true,"lwcId":"lwc13-0"}],"bHasAttachment":false}],"bAccordionOpen":false,"bAccordionActive":false,"bStep":true,"isStep":true,"JSONPath":"paymentDetails","lwcId":"lwc1"},{"type":"DataRaptor Post Action","propSetMap":{"disOnTplt":false,"enableActionMessage":false,"enableDefaultAbort":false,"errorMessage":{"default":null,"custom":[]},"label":"postPaymentMethod","pubsub":false,"message":{},"ssm":false,"wpm":false,"HTMLTemplateId":"","show":{"group":{"rules":[{"data":"true","field":"savePaymentMethod","condition":"="}],"operator":"AND"}},"showPersistentComponent":[false,false],"redirectPreviousWidth":3,"redirectPreviousLabel":"Previous","redirectNextWidth":3,"redirectNextLabel":"Next","redirectTemplateUrl":"vlcAcknowledge.html","redirectPageName":"","validationRequired":null,"failureAbortMessage":"Are you sure?","failureGoBackLabel":"Go Back","failureAbortLabel":"Abort","failureNextLabel":"Continue","postMessage":"Done","inProgressMessage":"In Progress","sendJSONNode":"","sendJSONPath":"","postTransformBundle":"","remoteTimeout":30000,"bundle":"payment_PostPaymentMethod_OTPIssueOS","controlWidth":12,"aggElements":{}},"offSet":0,"name":"CreatePaymentMethod","level":0,"indexInParent":2,"bHasAttachment":false,"bEmbed":false,"bDataRaptorPostAction":true,"JSONPath":"CreatePaymentMethod","lwcId":"lwc2"}],"bReusable":true,"bpVersion":2,"bpType":"ins","bpSubType":"IssuePayment","bpLang":"English","bHasAttachment":false,"lwcVarMap":{}};
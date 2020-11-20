/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global virtual class BusinessProcessDisplayController extends vlocity_ins.BaseDisplayController {
    global String bpDef {
        get;
    }
    global String channel {
        get;
    }
    global List<Map<String,String>> cssFilesMapList {
        get;
    }
    global List<String> cssUrls {
        get;
    }
    global String decimalSep {
        get;
    }
    global Id documentIdForURL {
        get;
    }
    global Boolean isLanguageRTL {
        get;
        set;
    }
    global List<Map<String,String>> jsFilesMapList {
        get;
    }
    global String layout {
        get;
    }
    global Boolean omniIframeEmbedded {
        get;
    }
    global String oSCurrencyCode {
        get;
    }
    global String sApplicationId {
        get;
        set;
    }
    global String sCSSFileList {
        get;
        set;
    }
    global String sJSFileList {
        get;
        set;
    }
    global String sOmniScriptId {
        get;
        set;
    }
    global String sOmniScriptType {
        get;
        set;
    }
    global ApexPages.StandardController stdController {
        get;
        set;
    }
    global String strLayout {
        get;
        set;
    }
    global String thousandSep {
        get;
    }
    global String urlParams {
        get;
    }
    global BusinessProcessDisplayController() {

    }
    @RemoteAction
    global static String BuildJSON(String sId, Boolean bResume, Boolean bPreview) {
        return null;
    }
    @RemoteAction
    global static String BuildJSON2(String sType, String sSubType, String sLang) {
        return null;
    }
    @RemoteAction
    global static String BuildJSONV2(String sId, String scriptState, Boolean bPreview) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static String BuildJSONV3(String sId, String scriptState, Boolean bPreview, String multiLangCode) {
        return null;
    }
    @RemoteAction
    global static String BuildJSONWithPrefill(String sType, String sSubType, String sLang, String pfBundle, String drParams) {
        return null;
    }
    @RemoteAction
    global static String BuildJSONWithPrefillV2(String sType, String sSubType, String sLang, String pfBundle, String drParams, String multiLangCode) {
        return null;
    }
    @RemoteAction
    global static String CompleteScript(String sInstanceId) {
        return null;
    }
    @RemoteAction
    global static String ContentVersionAddLink(String contentVersionId, String parentId) {
        return null;
    }
    @RemoteAction
    global static String CreateOSAttachment(String input, String parentId, String fileName) {
        return null;
    }
    @RemoteAction
    global static String CreateOSContentVersion(String bodyData, String filename, String parentId) {
        return null;
    }
    @RemoteAction
    global static void DeleteOSAttachment(String attachmentId, Boolean deleteParent) {

    }
    @AuraEnabled
    @RemoteAction
    global static void DeleteOSContentDocument(String contentDocumentId) {

    }
    @RemoteAction
    global static String GenericInvoke(String sClassName, String sMethodName, String input, String options) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object GenericInvoke2(String sClassName, String sMethodName, String input, String options) {
        return null;
    }
    @AuraEnabled
    global static Object GenericInvoke2NoCont(String sClassName, String sMethodName, String input, String options) {
        return null;
    }
    @AuraEnabled
    global static Object GenericInvokeLwc(String sClassName, String sMethodName, Map<String,Object> input, Map<String,Object> options) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static String GetUserInfo() {
        return null;
    }
    @AuraEnabled
    global static Boolean IsActiveOmniscript(String id) {
        return null;
    }
    @AuraEnabled
    global static String LWCPrep(String config) {
        return null;
    }
    @AuraEnabled
    global static String LinkContentDocument(String omniscriptId, List<String> documentIds, List<String> parentIds) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static String SaveBP(String bpTree, String files) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Map<String,Object> VlocityTrack(List<Map<String,Object>> trackingData) {
        return null;
    }
    @RemoteAction
    global static String getCustomLabels(List<String> labelNames, String language) {
        return null;
    }
    @AuraEnabled
    global static Object vlcContinuationCallback(List<String> labels, Object state) {
        return null;
    }
global class BusinessProcessDisplayControllerOpen implements vlocity_ins.VlocityOpenInterface2 {
    global BusinessProcessDisplayControllerOpen() {

    }
}
}

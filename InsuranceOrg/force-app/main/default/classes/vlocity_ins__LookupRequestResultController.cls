/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class LookupRequestResultController {
    global String eventDrivenMode {
        get;
    }
    global Boolean isLanguageRTL {
        get;
        set;
    }
    global String nameSpacePrefix {
        get;
    }
    global Boolean showScratchPad {
        get;
    }
    global Boolean tabStyle {
        get;
    }
    global LookupRequestResultController() {

    }
    @AuraEnabled
    global static String getAuraLookupRequests(Map<String,Object> additionalData) {
        return null;
    }
    @AuraEnabled
    global static String getAuraNextLookupRequestsWithoutSearch(String strResult, String searchUniqueName) {
        return null;
    }
    @AuraEnabled
    global static String getAuraNextLookupRequests(List<String> contextIds, String searchUniqueName, Map<String,Object> additionalData) {
        return null;
    }
    @AuraEnabled
    global static String getAuraRoleBasedActions(String objectName, String recordId) {
        return null;
    }
    @AuraEnabled
    global static String getAuraSearchResultByIds(List<String> contextIds, String searchUniqueName, Map<String,Object> additionalData) {
        return null;
    }
    @AuraEnabled
    global static String getAuraStepActions(String unqiueRequestName, String stepName, Map<String,Object> searchValueMap, Map<String,Object> resultValueMap, Map<String,Object> additionalData, Map<String,Object> verificationResult, Boolean hasResult) {
        return null;
    }
    @AuraEnabled
    global static String getAuraVerificationPaneActions(String unqiueRequestName, Map<String,Object> searchValueMap, Map<String,Object> resultValueMap, Map<String,Object> additionalData, Map<String,Object> verificationResult) {
        return null;
    }
    @AuraEnabled
    global static String getAuraVerifyResultById(String contextId, String searchUniqueName, Map<String,Object> additionalData) {
        return null;
    }
    @AuraEnabled
    global static String getAuragetSearchResult(String strRequest, List<String> contextIds, String parentId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.LookupRequest> getLookupRequests(Map<String,Object> additionalData) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.Action> getLookupVerificationAction(String objectName, String recordId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.LookupResult> getNextLookupRequestsWithoutSearch(String strResult, String searchUniqueName) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.LookupResult> getNextLookupRequests(List<String> contextIds, String searchUniqueName, Map<String,Object> additionalData) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.Action> getRoleBasedActions(String objectName, String recordId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.LookupResult> getSearchResultById(String contextId, String searchUniqueName, Map<String,Object> additionalData) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getSearchResultByIds(List<String> contextIds, String searchUniqueName, Map<String,Object> additionalData) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getSearchResult(String strRequest, List<String> contextIds, String parentId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.Action> getStepActions(String unqiueRequestName, String stepName, Map<String,Object> searchValueMap, Map<String,Object> resultValueMap, Map<String,Object> additionalData, Map<String,Object> verificationResult, Boolean hasResult) {
        return null;
    }
    @RemoteAction
    global static Map<String,List<vlocity_ins.Action>> getVerificationPaneActions(String unqiueRequestName, Map<String,Object> searchValueMap, Map<String,Object> resultValueMap, Map<String,Object> additionalData, Map<String,Object> verificationResult) {
        return null;
    }
    @AuraEnabled
    global static String invokeAuraVOIMethod(String className, String methodName, String inputJson, String optionJson) {
        return null;
    }
    @RemoteAction
    global static Object invokeVOIMethod(String className, String methodName, String inputJson, String optionJson) {
        return null;
    }
}

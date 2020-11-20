/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class SimpleDecompositionController {
    global SimpleDecompositionController(ApexPages.StandardController stdController) {

    }
    webService static String decompose(Id orderId) {
        return null;
    }
    webService static String decomposeAndCreatePlan(Id orderId) {
        return null;
    }
    webService static String decomposeAndCreatePlanEx(Id orderId, Boolean isOmniScript) {
        return null;
    }
    webService static String decomposeAndCreatePlanV2(Id orderId, Boolean isOmniScript, Boolean checkCatalogSync) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Map<String,Object> decomposeOrder(Id orderId) {
        return null;
    }
    @RemoteAction
    global static String getCustomLabels(List<String> labelNames, String language) {
        return null;
    }
    @RemoteAction
    global static Id getManualQueueSfIdByGlobalKey(String globalKey) {
        return null;
    }
    @RemoteAction
    global static String getMappingDetails(List<Id> allSpecIds, Boolean offPlatformMode) {
        return null;
    }
    @RemoteAction
    global static String getOrderOrchestrationPlanReferenceId(Id orderId) {
        return null;
    }
    @RemoteAction
    global static Id getSfIdByGlobalKey(String globalKey) {
        return null;
    }
    @RemoteAction
    global static Id getSfIdByGlobalKeyAndObjectName(String globalKey, String objectName) {
        return null;
    }
    @RemoteAction
    global static Map<Id,Map<String,String>> getSourceOrderAssetInfo(Id orderId) {
        return null;
    }
    @RemoteAction
    global static Boolean isDraftOrder(Id orderId) {
        return null;
    }
    @RemoteAction
    global static Boolean isOffPlatform() {
        return null;
    }
    @RemoteAction
    global static Boolean isSfdcDecomposedOrder(Id orderId) {
        return null;
    }
    @RemoteAction
    global static String startOffPlatformOrchestrationPlan(Id orderId) {
        return null;
    }
    @RemoteAction
    global static Id startOrchestrationPlan(Id orderId) {
        return null;
    }
    @RemoteAction
    global static String thorInfo(Id orderId, String orderStr, Boolean offPlatformMode) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Map<String,Object> viewDecomposedOrder(Id orderId) {
        return null;
    }
    webService static String viewDecomposition(Id orderId) {
        return null;
    }
}

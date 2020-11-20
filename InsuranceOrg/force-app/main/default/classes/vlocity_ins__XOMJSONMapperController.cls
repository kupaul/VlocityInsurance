/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class XOMJSONMapperController {
    global static String destProdField {
        get;
        set;
    }
    global static Boolean isExpressionEnabled {
        get;
    }
    global static Boolean isOffPlatformMode {
        get;
    }
    global static Map<String,Object> outMap;
    global static String recordAttributeName {
        get;
        set;
    }
    global static Id recordId {
        get;
        set;
    }
    global static String sourceProdField {
        get;
        set;
    }
    global String uiServicesUrl {
        get;
        set;
    }
    @AuraEnabled
    @RemoteAction
    global static List<Object> getExistingRulesWithParams(Id recId, String paramMapStr) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static List<Object> getExistingRules(Id recId) {
        return null;
    }
    global static String getMappingJSONDataS() {
        return null;
    }
    global static String getPreLoadData() {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Map<String,Object> initializeWithoutCaching(Map<String,Object> inputJSon) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Map<String,Object> initialize(Map<String,Object> inputJSon) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.VlocityRemoteInterface invokeMethod(vlocity_ins.VlocityRemoteInterface controller) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static String persistMappingJSON(String mappingDetailsStr, Id recId) {
        return null;
    }
}

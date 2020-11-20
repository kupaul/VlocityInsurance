/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class XOMConditionsJSONMapperController {
    global static String associatedProd {
        get;
    }
    global static Boolean enableComplexConditions {
        get;
    }
    global static Boolean isExpressionEnabled {
        get;
    }
    global static Boolean isInsurance {
        get;
    }
    global static Boolean isOffPlatformMode {
        get;
    }
    global String recordAttributeName {
        get;
        set;
    }
    global Id recordId {
        get;
        set;
    }
    global String uiServicesUrl {
        get;
        set;
    }
    @AuraEnabled
    @RemoteAction
    global static Map<String,Object> getConditions(Id recId, String fieldToBeQueried) {
        return null;
    }
    @AuraEnabled
    global static String getControllerProperties() {
        return null;
    }
    @ReadOnly
    @RemoteAction
    global static Map<String,String> getSearchProducts(String prodNameFilter) {
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
    global static String preprocessCons(String sConditions) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static String saveCondition(String sConditions, Id recId, String fieldToBeUpdated) {
        return null;
    }
}

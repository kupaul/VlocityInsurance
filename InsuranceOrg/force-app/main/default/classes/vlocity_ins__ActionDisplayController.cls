/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class ActionDisplayController {
    global String actions {
        get;
    }
    global Id parentId {
        get;
    }
    global String sFilter {
        get;
        set;
    }
    global String sFilterContextId {
        get;
        set;
    }
    global String sFilterFieldName {
        get;
        set;
    }
    global String sLinkTypes {
        get;
        set;
    }
    global String sObjType {
        get;
        set;
    }
    global ApexPages.StandardController stdController {
        get;
        set;
    }
    global ActionDisplayController() {

    }
    @AuraEnabled
    global static String getConsoleCardsAction(String sObjType, String sFilterContextId) {
        return null;
    }
    @AuraEnabled
    global static String getObjectType(Id id) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object invokeRemoteMethod(String className, String methodName, String inputJson, String optionJson) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object invokeVOIMethod(String className, String methodName, String inputJson, String optionJson) {
        return null;
    }
}

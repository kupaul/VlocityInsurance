/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global virtual class VFPageControllerBase {
    global SObject currentRecord {
        get;
        set;
    }
    global Boolean isLanguageRTL {
        get;
        set;
    }
    global String namespace {
        get;
        set;
    }
    global String sNS {
        get;
        set;
    }
    global String sNSP {
        get;
        set;
    }
    global String sObjectType {
        get;
        set;
    }
    global String sObjectTypeLabel {
        get;
        set;
    }
    global String sParentObjectLabel {
        get;
        set;
    }
    global ApexPages.StandardController stdController;
    global VFPageControllerBase() {

    }
    global VFPageControllerBase(ApexPages.StandardController sController) {

    }
    global static Map<String,Object> getDescribeFieldResultAsJson(Schema.DescribeFieldResult describe) {
        return null;
    }
    global static Map<String,Map<String,Object>> getFieldDescribe(Schema.SObjectType soType) {
        return null;
    }
    global static List<String> getFieldSetMetadata(Schema.SObjectType soType) {
        return null;
    }
    global static List<String> getFieldSetMetadata(String name, Schema.SObjectType soType) {
        return null;
    }
    global ApexPages.StandardController getstdController() {
        return null;
    }
    global void setstdController(ApexPages.StandardController sController) {

    }
    @RemoteAction
    global static Boolean validateUniqueField(String objectType, String fieldName, Id thisId, Object value) {
        return null;
    }
    @RemoteAction
    global static List<String> vlocityFormulaParserFunctions() {
        return null;
    }
}

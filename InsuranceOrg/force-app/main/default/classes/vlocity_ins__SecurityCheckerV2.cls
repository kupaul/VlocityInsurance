/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class SecurityCheckerV2 {
    global static List<String> AccessExceptionMsgs;
    global static Boolean ignoreFLSChecks;
    global SecurityCheckerV2() {

    }
    global static Boolean bCanAccessClass(String apexClass) {
        return null;
    }
    global static Boolean bCanDelete(Schema.SObjectType objType) {
        return null;
    }
    global static Boolean bCanInsert(Schema.SObjectType objType, String fieldName) {
        return null;
    }
    global static Boolean bCanQuery(Schema.SObjectType objType, String fieldName) {
        return null;
    }
    global static Boolean bCanUpdate(Schema.SObjectType objType, String fieldName) {
        return null;
    }
    global static void canAccessClass(String apexClass) {

    }
    global static void canDelete(Schema.SObjectType objType) {

    }
    global static void canInsert(Schema.SObjectType objType) {

    }
    global static void canInsert(Schema.SObjectType objType, Schema.DescribeFieldResult fieldDescribe) {

    }
    global static void canInsert(Schema.SObjectType objType, String fieldName) {

    }
    global static void canInsert(Schema.SObjectType objType, List<String> fieldNames) {

    }
    global static Boolean canQuery(Schema.SObjectType objType, Schema.SObjectField obField) {
        return null;
    }
    global static void canQuery(Schema.SObjectType objType) {

    }
    global static void canQuery(Schema.SObjectType objType, Schema.DescribeFieldResult fieldDescribe) {

    }
    global static void canQuery(Schema.SObjectType objType, String fieldName) {

    }
    global static void canQuery(Schema.SObjectType obj, List<String> fieldNames) {

    }
    global static void canUpdate(Schema.SObjectType objType) {

    }
    global static void canUpdate(Schema.SObjectType objType, Schema.DescribeFieldResult fieldDescribe) {

    }
    global static void canUpdate(Schema.SObjectType objType, String fieldName) {

    }
    global static void canUpdate(Schema.SObjectType objType, List<String> fieldNames) {

    }
global class AccessException extends Exception {
}
global enum OPCODE {APEX_ACCESS, FLS_INSERT, FLS_READ, FLS_UPDATE, OB_DELETE, OB_INSERT, OB_READ, OB_UPDATE}
}

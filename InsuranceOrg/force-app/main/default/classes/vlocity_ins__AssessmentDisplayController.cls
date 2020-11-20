/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class AssessmentDisplayController {
    global String AssessmentTemplates {
        get;
    }
    global String assResp {
        get;
        set;
    }
    global Boolean bHideLink {
        get;
        set;
    }
    global Boolean bResume {
        get;
    }
    global Boolean bSecondaryObj {
        get;
        set;
    }
    global SObject currentRecord {
        get;
        set;
    }
    global String initialAssessmentInstance {
        get;
    }
    global String sAssessmentHistoryURL {
        get;
        set;
    }
    global String sHeaderField {
        get;
        set;
    }
    global String sNamespacePrefixList {
        get;
        set;
    }
    global String soType {
        get;
        set;
    }
    global String sParentObjectLabel {
        get;
        set;
    }
    global String sSecondareyObjectQueryWhereClause {
        get;
        set;
    }
    global String sSecondaryObject {
        get;
        set;
    }
    global String sSecondaryObjectNameField {
        get;
        set;
    }
    global String sSecondaryObjectQueryControllingFields {
        get;
        set;
    }
    global String stAssessmentHistoryURL {
        get;
        set;
    }
    global ApexPages.StandardController stdController {
        get;
        set;
    }
    global String sTypeField {
        get;
        set;
    }
    global AssessmentDisplayController() {

    }
    @RemoteAction
    global static String DeleteAssessment(String sAssessmentId) {
        return null;
    }
    @RemoteAction
    global static String GetAssessmentTmpl(String sATmplId, String sSecondaryObjId, Boolean bSecondObj, String sSecondObjectLabel) {
        return null;
    }
    @RemoteAction
    global static String UpsertAssessmentInstance(String sAssessmentInstance, String sSecondObjectId, String sSecondObjHeader, String aTmpls, Boolean bDone, Boolean bInsert) {
        return null;
    }
}

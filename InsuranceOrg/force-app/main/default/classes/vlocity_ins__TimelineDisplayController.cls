/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class TimelineDisplayController {
    global String acts {
        get;
    }
    global List<String> aFieldList {
        get;
        set;
    }
    global Boolean bHideHeader {
        get;
        set;
    }
    global SObject currentRecord {
        get;
        set;
    }
    global String header {
        get;
    }
    global String listURL {
        get;
        set;
    }
    global String sAttributeFields {
        get;
        set;
    }
    global String sHeaderAttributeList {
        get;
        set;
    }
    global String sHeaderTitleList {
        get;
        set;
    }
    global String sImageField {
        get;
        set;
    }
    global String sImageURL {
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
    global ApexPages.StandardController stdController {
        get;
        set;
    }
    global String sTitleFields {
        get;
        set;
    }
    global List<String> titleFieldList {
        get;
        set;
    }
    global TimelineDisplayController() {

    }
    @RemoteAction
    global static String GetActivities(String sId) {
        return null;
    }
    @RemoteAction
    global static String QueryHeader(String sId, List<String> titleFldList, List<String> attributeFldList, SObject currentRecord) {
        return null;
    }
    @RemoteAction
    global static String UpdateActivity(String sId, String sStatus, String sPriority, String sDescription, Boolean isTask, Long sDT, Long eDT) {
        return null;
    }
}

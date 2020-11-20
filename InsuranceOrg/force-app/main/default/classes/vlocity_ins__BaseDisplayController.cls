/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global virtual class BaseDisplayController {
    global String communitiesNetworkId {
        get;
    }
    global Id documentIdForURLBase {
        get;
    }
    global Boolean isInsidePckg {
        get;
        set;
    }
    global String sfdcOrgDomainUrl {
        get;
    }
    global String sJSONString {
        get;
        set;
    }
    global String sNamespacePrefixList {
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
    global String soType {
        get;
        set;
    }
    global String sParentObjectLabel {
        get;
        set;
    }
    global String sRecId {
        get;
        set;
    }
    global ApexPages.StandardController stdController {
        get;
        set;
    }
    global String sUserLanguage {
        get;
        set;
    }
    global BaseDisplayController() {

    }
    @RemoteAction
    global static String ContentVersionAddLinkBase(String contentVersionId, String parentId) {
        return null;
    }
    @RemoteAction
    global static String CreateOSContentVersionBase(String bodyData, String filename, String parentId) {
        return null;
    }
    @RemoteAction
    global static String Save(String sJSONString, Id sRowId, String field) {
        return null;
    }
}

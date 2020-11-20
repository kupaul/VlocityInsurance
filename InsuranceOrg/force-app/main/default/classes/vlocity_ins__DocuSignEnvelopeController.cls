/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class DocuSignEnvelopeController {
    global Id contractId {
        get;
    }
    global String namespacePrefix {
        get;
    }
    global String objType {
        get;
    }
    global Id parentId {
        get;
    }
    global SObject parentObj {
        get;
    }
    global String stateTransitionId {
        get;
    }
    global ApexPages.StandardController stdController {
        get;
        set;
    }
    global DocuSignEnvelopeController() {

    }
    @RemoteAction
    global static String getListContacts(Id objectId, String objectType) {
        return null;
    }
    @RemoteAction
    global static String getListDocuments(Id objectId) {
        return null;
    }
    @RemoteAction
    global static String getNotificationSetting(Id contractId) {
        return null;
    }
    @RemoteAction
    global static String getRecipientTypes() {
        return null;
    }
    @RemoteAction
    global static String getSignerRoles() {
        return null;
    }
    @RemoteAction
    global static String sendEnvelope(Id objectId, String envJson) {
        return null;
    }
    @RemoteAction
    global static String updateStateModel(Id objectId, Id stateTxnId) {
        return null;
    }
}

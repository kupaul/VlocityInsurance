/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class ObjectDocumentCreationController {
    global String contextId {
        get;
    }
    global String documentName {
        get;
    }
    global String nameSpacePrefix {
        get;
    }
    global Id parentId {
        get;
    }
    global String pdfPageReference {
        get;
    }
    global Id templateId {
        get;
    }
    global ObjectDocumentCreationController() {

    }
    @RemoteAction
    global static String createObjectDocument(String templateId, String contextId, String JSONStr) {
        return null;
    }
    @RemoteAction
    global static void deleteAttachment(Id attachmentId) {

    }
    @RemoteAction
    global static String downloadPdf(Id docId, String docName) {
        return null;
    }
    @RemoteAction
    global static Map<String,String> getDocTemplateResource(Id docTemplateId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.ObjectDocumentCreationController.ContractDocumentWrapper getObjVersionDocument(Id objDocId, String relsXml, String documentName) {
        return null;
    }
    @RemoteAction
    global static Id saveDocx(Id parentId, String documentName, String data) {
        return null;
    }
    @RemoteAction
    global static String savePdf(Id contextId, Id docId, String documentName) {
        return null;
    }
global class ContractDocumentWrapper {
    global Map<String,Object> contractData {
        get;
        set;
    }
    global String errorString {
        get;
        set;
    }
    global String genDocName {
        get;
        set;
    }
    global Map<String,Object> imageData {
        get;
        set;
    }
    global Integer serializedCount {
        get;
        set;
    }
    global String templateEncoded {
        get;
        set;
    }
    global ContractDocumentWrapper() {

    }
    global override String toString() {
        return null;
    }
}
}

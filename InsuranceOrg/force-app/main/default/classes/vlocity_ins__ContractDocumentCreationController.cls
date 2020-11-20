/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class ContractDocumentCreationController {
    global String pdfGenerationSource {
        get;
    }
    global String pdfViewer {
        get;
    }
    global ContractDocumentCreationController() {

    }
    @RemoteAction
    global static void checkIn(Id versionId) {

    }
    @RemoteAction
    global static Boolean checkInContentVersionForContractVersion(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static void checkinWithoutAttachment(String contractVersionId) {

    }
    @RemoteAction
    global static void createContractSections(Id templateId, Id versionId) {

    }
    @RemoteAction
    global static vlocity_ins.DocumentContentStructure createContractSectionsforVersion(Id templateId, Id versionId) {
        return null;
    }
    @RemoteAction
    global static Boolean deleteNotRequiredDocs(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static String downloadPdf(Id parId, String docName) {
        return null;
    }
    @RemoteAction
    global static String generatePdf(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__ContractVersion__c getActiveVersion(Id objId) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getAutoAttachTemplateDetails(Id templateId) {
        return null;
    }
    @RemoteAction
    global static String getBatchStatus(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static String getClientSidePdfLibraries() {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.DocumentContentStructure getContractSectionsForVersion(Id versionId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.ContractDocumentCreationController.ContractDocumentWrapper getContractVersionDocument(String contractVersionId, String relsXml) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.ContractDocumentCreationController.ContractDocumentWrapper getDocTemplateForContractType(Id contractVersionid) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getDocumentType(Id contextID) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.ContractDocumentCreationController.ContractDocumentWrapper getDocxTemplate() {
        return null;
    }
    @RemoteAction
    global static String getPDFIntegrationConfig() {
        return null;
    }
    @RemoteAction
    global static List<SObject> getTemplateList(Id versionId) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getTokenData(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static String getWMLData(Id contractVersionId, Integer startingIndex, Integer recordSize) {
        return null;
    }
    @RemoteAction
    global static Id invokeBatchJob(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> linkContentVersionToContractVersionNew(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static Id linkContentVersionToContractVersion(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> remoteGenerateDoc(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> remoteGeneratePdf(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static void removeContractSections(Id versionId) {

    }
    @RemoteAction
    global static Map<String,Object> removeContractSectionsByBatch(Id versionId, Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> resolveDocumentGenerationMethods(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static void saveContractSections(vlocity_ins.DocumentContentStructure docStructure) {

    }
    @RemoteAction
    global static void saveDocx(Id parentId, String data) {

    }
    @RemoteAction
    global static void saveNewDocumentSections(vlocity_ins.DocumentContentStructure docStructureJSON) {

    }
    @RemoteAction
    global static void savePdf(Id parId) {

    }
    @RemoteAction
    global static Boolean unlinkContentVersionFromContractVersion(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static void updateContractSections(Id templateId, Id versionId) {

    }
    @RemoteAction
    global static Map<String,Object> updateLinkContentVersionFromContractVersion(Map<String,Object> inputMap) {
        return null;
    }
global class ContractDocumentWrapper {
    global ContractDocumentWrapper() {

    }
}
}

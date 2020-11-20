/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class OmniScriptDesignerController {
    @RemoteAction
    global static System.PageReference ActivateVersion(String omniScriptId) {
        return null;
    }
    @RemoteAction
    global static String BuildJSONV3(String sId, String scriptState, Boolean bPreview, String multiLangCode) {
        return null;
    }
    @RemoteAction
    global static String BuildJSONWithPrefillV2(String sType, String sSubType, String sLang, String pfBundle, String drParams, String multiLangCode) {
        return null;
    }
    @RemoteAction
    global static System.PageReference CreateVersion(String omniScriptId) {
        return null;
    }
    @RemoteAction
    global static System.PageReference DeactivateVersion(String omniScriptId) {
        return null;
    }
    @RemoteAction
    global static List<Database.DeleteResult> DeleteElement(String elementId) {
        return null;
    }
    @RemoteAction
    global static System.PageReference DeleteOmniScript(String omniScriptId) {
        return null;
    }
    @RemoteAction
    global static void EnsureDocumentUploads() {

    }
    @AuraEnabled
    @RemoteAction
    global static List<Document> GetAllDocuments() {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static List<Map<String,String>> GetAllObjects() {
        return null;
    }
    @RemoteAction
    global static List<Document> GetDocuments() {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static List<vlocity_ins__Element__c> GetElements(String omniScriptId) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static List<Document> GetEmailDocuments() {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static List<EmailTemplate> GetEmailTemplates() {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> GetExternalObjects() {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Map<String,Map<String,Object>> GetFieldsForObject(String interfaceObjectName) {
        return null;
    }
    @RemoteAction
    global static List<String> GetMatrixHeaders(String matrixName) {
        return null;
    }
    @RemoteAction
    global static Set<String> GetMatrixNames() {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> GetObjectsWithExternalFields() {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__OmniScript__c GetOmniScript(String omniScriptId) {
        return null;
    }
    @RemoteAction
    global static Map<String,Set<String>> GetOmniScriptTypes(Boolean isProcedure) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__OmniScript__c> GetReusableOmniScripts() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityScheduledJob__c> GetScheduledJobs() {
        return null;
    }
    @AuraEnabled
    global static Map<String,List<String>> LoadAvailableScriptTypes() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__DRBundle__c> LoadDataRaptorBundles() {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static List<vlocity_ins__VlocityDocuSignTemplate__c> LoadDocuSignTemplates() {
        return null;
    }
    @RemoteAction
    global static List<System.SelectOption> LoadElementTypes() {
        return null;
    }
    @RemoteAction
    global static List<System.SelectOption> LoadIntegrationProcedureElementTypes() {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Map<String,String> LoadIntegrationProcedureKeys2() {
        return null;
    }
    @RemoteAction
    global static Map<String,String> LoadIntegrationProcedureKeys() {
        return null;
    }
    @RemoteAction
    global static List<System.SelectOption> LoadLanguages() {
        return null;
    }
    @RemoteAction
    global static String LoadPropertySetForElement(String elementType, Boolean isProcedure) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Map<String,List<String>> LoadScriptElementTypes() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> LoadVlocityUITemplates() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__OmniScript__c> QueryOmniScriptKeys(Boolean isProcedure, Boolean isReusable) {
        return null;
    }
    @RemoteAction
    global static Database.UpsertResult SaveElement(Map<Object,Object> elementJson) {
        return null;
    }
    @RemoteAction
    global static Database.UpsertResult SaveOmniScript(Map<Object,Object> omniScriptJson) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static String ViewFullDataJson(String omniScriptId) {
        return null;
    }
    @AuraEnabled
    global static Object createNewVersion(Id omniScriptId) {
        return null;
    }
    @RemoteAction
    global static String getCustomLabels(List<String> labelNames, String language) {
        return null;
    }
    @AuraEnabled
    global static Map<String,Object> getElementTypes() {
        return null;
    }
    @RemoteAction
    global static String getKnowledgeArticles(String keyword, String publishStatus, String langCode) {
        return null;
    }
    @RemoteAction
    global static Map<String,String> getLanguageCodeMap() {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static List<vlocity_ins__DRBundle__c> getMatchingDRBundles(String name, List<String> types) {
        return null;
    }
    @AuraEnabled
    global static Object getNonOmniScriptLwcs(String nextUrl) {
        return null;
    }
    @AuraEnabled
    global static List<vlocity_ins__OmniScript__c> getReusableOmniScriptsLwc() {
        return null;
    }
    @AuraEnabled
    global static Boolean isInsidePckg() {
        return null;
    }
    @RemoteAction
    global static Object testIntegrationProcedure(String procedureAPIName, String input, Map<String,Object> options) {
        return null;
    }
    @RemoteAction
    global static void updateScriptLastPreviewPage(Id omniId, String newLastPreviewPage) {

    }
    @AuraEnabled
    @RemoteAction
    global static List<Document> uploadDocument(String encBody, String name, String type) {
        return null;
    }
    @RemoteAction
    global static List<String> vlocityFormulaParserFunctions() {
        return null;
    }
}

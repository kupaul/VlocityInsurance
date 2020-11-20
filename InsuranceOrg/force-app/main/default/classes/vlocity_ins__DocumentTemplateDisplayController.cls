/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class DocumentTemplateDisplayController {
    global Boolean checkFontEmbeddingInDOCXTemplate {
        get;
    }
    global String nameSpacePrefix {
        get;
    }
    global String pdfGenerationSource {
        get;
    }
    global String userLanguageLocale {
        get;
    }
    global DocumentTemplateDisplayController() {

    }
    @RemoteAction
    global static List<vlocity_ins__DocumentTemplate__c> advanceSearch(String input) {
        return null;
    }
    global void checkFieldLevelSecurity() {

    }
    @RemoteAction
    global static Map<Id,Id> cloneAllSections(String sectionJSON) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> cloneDocumentTemplate(Id srcTemplateId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__EntityFilter__c createEntityFilter(String name, String applicableItemType, String nameSpacePrefix) {
        return null;
    }
    @RemoteAction
    global static Id createNewVersion(String templateJson) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> createNewVersionOfDocumentTemplate(Id srcTemplateId) {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> deactivateTemplate(String templateJSON) {
        return null;
    }
    @RemoteAction
    global static String deleteDocxFiles(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> deleteTemplateFromCloud(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__DocumentTemplateSection__c> deleteTemplateSection(String sectionJSON) {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> deleteTemplate(String templateJSON) {
        return null;
    }
    @RemoteAction
    global static String generateGUID() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__DocumentTemplate__c> getActiveTemplates() {
        return null;
    }
    @RemoteAction
    global static List<Object> getAllCloneableTemplates(Map<String,String> inputMap) {
        return null;
    }
    @RemoteAction
    global static List<Folder> getAllFolders() {
        return null;
    }
    @RemoteAction
    global static List<Document> getAllImages(String folderId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__DocumentTemplateSection__c> getAllTemplateSections() {
        return null;
    }
    @RemoteAction
    global static List<Object> getAllTemplates(String mappingType) {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getApplicableItemTypeValues() {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getApplicableTypeValues() {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getClauseContentForDocx(String clauseShortName) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__DocumentClause__c> getClauses() {
        return null;
    }
    @RemoteAction
    global static String getClientSidePdfLibraries() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__ContractType__c> getContractTypeList() {
        return null;
    }
    @RemoteAction
    global static Map<String,String> getDRBundleId(Id templateId) {
        return null;
    }
    @RemoteAction
    global static String getDefaultContractType() {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getDocumentGenerationMethods() {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getDocumentTemplateWorkspace() {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getDocumentTemplatesById(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__EntityFilter__c> getEntityFilters(List<String> inputList) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getFieldLabels() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__DocumentClause__c> getGenericClauses() {
        return null;
    }
    @RemoteAction
    global static String getGenericDocGenOSURL(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static String getPDFIntegrationConfig() {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getPdfGenerationMethods() {
        return null;
    }
    @RemoteAction
    global static List<Product2> getProducts() {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getSectionTypes(String templateType) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__DocumentTemplateSection__c> getSectionsForTemplate(String stringJSON) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__DocuSignAnchorTabSetting__c getSignatureTabs() {
        return null;
    }
    @RemoteAction
    global static Map<Id,Object> getTemplateConditions(List<Id> sectionIds) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getTemplateData(Id templateId) {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getTemplateLanguages() {
        return null;
    }
    @RemoteAction
    global static Map<Id,List<Product2>> getTemplateProducts(List<Id> sectionIds) {
        return null;
    }
    @RemoteAction
    global static Set<String> getTemplateTokens(Id templateId) {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getTemplateTypeValues() {
        return null;
    }
    @RemoteAction
    global static List<Object> getTemplate(Id templateId) {
        return null;
    }
    @RemoteAction
    global static Boolean getTrackChangeSetting() {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getTypeValues() {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getUsageValues() {
        return null;
    }
    @RemoteAction
    global static Map<Id,Integer> isEntityFilterEmpty(List<Id> entityFilters) {
        return null;
    }
    @RemoteAction
    global static Id linkContentVersionToTemplateElement(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static Map<Decimal,Id> saveAllSections(String sectionJSON) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> saveDocTemplate(String templateJSON) {
        return null;
    }
    @RemoteAction
    global static void saveDocxRelMetadata(Map<String,String> templateRelMetadataMap, Id templateId) {

    }
    @RemoteAction
    global static Id saveTemplateSection(String sectionJSON) {
        return null;
    }
    @RemoteAction
    global static Map<String,Id> saveTemplate(String templateJson) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> searchDocumentTemplates(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static Boolean setTemplateContentVersion(Id templateId, Id contentVersionId) {
        return null;
    }
    @RemoteAction
    global static Boolean validateCustomClass(String className) {
        return null;
    }
}

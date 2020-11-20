/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class DRDataPackRunnerController {
    global Boolean isLanguageRTL {
        get;
        set;
    }
    global String namespace {
        get;
        set;
    }
    global DRDataPackRunnerController() {

    }
    global DRDataPackRunnerController(Object existingController) {

    }
    @RemoteAction
    global static Map<String,Object> addDataPack(String data) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> combineDataPacks(String dataPackId, List<String> combineDataPacksList) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> deleteDataPack(String dataPackId) {
        return null;
    }
    @RemoteAction
    global static List<Database.DeleteResult> deleteLibraryOrgs(List<String> libraryOrgs) {
        return null;
    }
    @RemoteAction
    global static Database.DeleteResult deleteObject(Id uniqueDataId) {
        return null;
    }
    @RemoteAction
    global static List<Database.DeleteResult> deleteObjects(List<Id> uniqueDataIds) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUILayout__c> getActiveLayouts(List<String> layouts) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> getActiveTemplates(List<String> templates) {
        return null;
    }
    @RemoteAction
    global static String getAllDataPackData(String dataPackId) {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getAllDataPacksNoSummary() {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getAllDataPacks() {
        return null;
    }
    @RemoteAction
    global static List<StaticResource> getBaseDatapacks(String prefix) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityCard__c> getCardsByNames(List<String> cards) {
        return null;
    }
    @RemoteAction
    global static String getCustomLabels(List<String> labelNames, String language) {
        return null;
    }
    @RemoteAction
    global static String getDataPackDataChunks(String data) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getDataPack(String dataPackId) {
        return null;
    }
    @RemoteAction
    global static List<Object> getDataViaDynamicSoql(String soqlStmt) {
        return null;
    }
    @RemoteAction
    global static List<Object> getFieldsNamesForObject(String objectType) {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getInstalledTabDataPacks() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUILayout__c> getLayoutsByName(List<String> layouts) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getObjectDescription(String objectType) {
        return null;
    }
    @RemoteAction
    global static List<Object> getOrganizations() {
        return null;
    }
    @RemoteAction
    global static List<Map<String,Object>> getPublishedTabDataPacks() {
        return null;
    }
    @RemoteAction
    global static String getRemoteDataPackDataChunks(String data) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getRemoteDataPackData(String libraryOrg, String vlocityDataPackId) {
        return null;
    }
    @RemoteAction
    global static List<Object> getRemoteDataPacks(String libraryOrg) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getStoredPublicDataPackData(String uniqueDataId, String source) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> getTemplatesByName(List<String> templates) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> ignoreErrorForDataPacks(String processType, String dataPackId, List<String> dataPackKeys) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> publishDataPack(String dataPackId, Boolean unpublish) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> refreshDataPack(String dataPackId) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> runActivate(String data) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> runExport(String data) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> runImport(String data) {
        return null;
    }
    global static Map<String,Object> saveDataPack(String dataPackId) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> saveDataPack(String dataPackId, Map<String,Object> dataPackInfo) {
        return null;
    }
    global static List<Database.UpsertResult> saveLibraryOrgActive(Map<String,Boolean> libraryOrgActive) {
        return null;
    }
    @RemoteAction
    global static List<Database.UpsertResult> saveLibraryOrgs(List<Map<String,Object>> libraryOrgs) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> updateDataPackData(String dataPackId, String dataPackData) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> updateDataPackInfo(String dataPackId, Map<String,Object> dataPackInfo) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> updateDataPack(String dataPackId, Map<String,Object> dataPackInfo) {
        return null;
    }
}

/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class CardCanvasController implements vlocity_ins.VlocityOpenInterface2 {
    global String bodyClassesToAdd {
        get;
    }
    global String consoleActionList {
        get;
    }
    global List<Map<String,String>> cssFilesMapList {
        get;
    }
    global List<String> cssUrls {
        get;
    }
    global String currentInstanceUrlWithPath {
        get;
    }
    global System.PageReference homeUrl {
        get;
    }
    global Boolean isCommunity {
        get;
    }
    global Boolean isLanguageRTL {
        get;
        set;
    }
    global String language {
        get;
        set;
    }
    global String loggedUser {
        get;
    }
    global System.PageReference newUrl {
        get;
    }
    global String nsPrefix {
        get;
    }
    global String nsPrefixDotNotation {
        get;
    }
    global String records {
        get;
        set;
    }
    global String sfInstanceUrl {
        get;
    }
    global String theme {
        get;
        set;
    }
    global Boolean useClassicStylesByDefault {
        get;
        set;
    }
    global String vlocSldsVersion {
        get;
        set;
    }
    global String vlocTheme {
        get;
        set;
    }
    global Boolean vlocUseClassicStylesByDefault {
        get;
        set;
    }
    global CardCanvasController() {

    }
    global CardCanvasController(ApexPages.StandardController stdController) {

    }
    global CardCanvasController(Object stdController) {

    }
    global System.PageReference checkAuth() {
        return null;
    }
    global static Boolean checkPermission(String requiredPermission) {
        return null;
    }
    @RemoteAction
    global static Boolean clearAllCache(String orgCache, String sessionCache) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object createLWCBundle(String body) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object createLWCResources(String body, String bundleId) {
        return null;
    }
    @RemoteAction
    global static void deleteCard(vlocity_ins__VlocityCard__c card) {

    }
    @RemoteAction
    global static void deleteCardById(String cardId) {

    }
    @AuraEnabled
    @RemoteAction
    global static Object deleteComponent(String type, String id) {
        return null;
    }
    @RemoteAction
    global static void deleteLayout(vlocity_ins__VlocityUILayout__c layout) {

    }
    @RemoteAction
    global static void deleteLayoutById(String layoutId) {

    }
    @RemoteAction
    global static void deleteTemplate(vlocity_ins__VlocityUITemplate__c template) {

    }
    @RemoteAction
    global static Object doAsyncInvoke(String sClassName, String sMethodName, String input, String options, String stagingObjectId) {
        return null;
    }
    @RemoteAction
    global static Object doCheckClassType(String sClassName, String sNS) {
        return null;
    }
    @RemoteAction
    global static String doEncryptedDatasource(Id objId, String scope) {
        return null;
    }
    @RemoteAction
    global static Object doGenericInvoke(String sClassName, String sMethodName, String input, String options) {
        return null;
    }
    @RemoteAction
    global static String doNamedCredentialCallout(String inputJSON) {
        return null;
    }
    @RemoteAction
    global static String getAccountById(Id accountId) {
        return null;
    }
    @RemoteAction
    global static String getAccounts() {
        return null;
    }
    @RemoteAction
    global static String getActionDetails(String sObjType, String sFilterContextId, String displayOn, String linkType) {
        return null;
    }
    @RemoteAction
    global static String getActionDetailsByName(String sObjType, String sFilterContextId, String displayOn, String linkType, List<String> actionNames) {
        return null;
    }
    @RemoteAction
    global static String getActions(String sObjType, String sObjectJSON) {
        return null;
    }
    @RemoteAction
    global static String getActionsDetailFromId(String sObjType, String sFilterContextId, String displayOn, String linkType) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityAction__c> getActionsInfo() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityCard__c> getActiveCardsByNames(List<String> cardNames) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUILayout__c> getActiveLayouts(List<String> layouts) {
        return null;
    }
    @RemoteAction
    global static List<String> getActiveTemplateNames() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityAction__c> getAllActionsInfo() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityCard__c> getAllCardDefinitions() {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object getAllLWC(String name, String nextRecordsUrl) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object getAllLWCNames(String name, String nextRecordsUrl) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUILayout__c> getAllLayouts() {
        return null;
    }
    @RemoteAction
    global static List<Map<String,String>> getAllObjects() {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__VlocityCard__c getCardByName(String cardName) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityCard__c> getCardDefinitionsForIds(List<Id> Ids) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityCard__c> getCardsByGlobalKeys(List<String> keys) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityCard__c> getCardsByNames(List<String> cardNames) {
        return null;
    }
    @RemoteAction
    global static String getConsoleCardsAction(String sObjType, String sFilterContextId) {
        return null;
    }
    @RemoteAction
    global static String getCustomLabelValue(String labelName) {
        return null;
    }
    @RemoteAction
    global static String getCustomLabels(List<String> labelNames, String language) {
        return null;
    }
    @RemoteAction
    global static List<CustomPermission> getCustomPermissionsForUser() {
        return null;
    }
    @RemoteAction
    global static String getCustomSettings(String customSettingName) {
        return null;
    }
    @RemoteAction
    global static Object getDataViaDataRaptor(Map<String,Object> inputMap, String bundleName) {
        return null;
    }
    @RemoteAction
    global static String getDataViaDynamicSoql(String soqlStmt) {
        return null;
    }
    @RemoteAction
    global static String getDataViaDynamicSosl(String soslStmt) {
        return null;
    }
    @RemoteAction
    global static String getDatasourceQuery(String soqlStmt) {
        return null;
    }
    @RemoteAction
    global static Map<String,Map<String,Object>> getFieldsForObject(String interfaceObjectName) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object getLWCBundleByDevName(String developerName) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object getLWCBundles(String nextRecordsUrl) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object getLWCByBundleId(String bundleId) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object getLWCMetaDataByBundleId(String bundleId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__VlocityUILayout__c getLayoutById(String id) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUILayout__c> getLayoutByName(String layoutName) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUILayout__c> getLayout(String searchCriterionType, String searchParam) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUILayout__c> getLayoutsById(List<String> ids) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUILayout__c> getLayoutsByName(List<String> layouts) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUILayout__c> getLayoutsInfo() {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object getLwcBundle(String name) {
        return null;
    }
    @RemoteAction
    global static List<NamedCredential> getNamedCredentials() {
        return null;
    }
    global static List<vlocity_ins__VlocityUILayout__c> getPermittedLayouts(List<vlocity_ins__VlocityUILayout__c> layouts) {
        return null;
    }
    @RemoteAction
    global static String getSearchQuery(String soslStmt) {
        return null;
    }
    @RemoteAction
    global static String getStaticResourcesUrl() {
        return null;
    }
    @RemoteAction
    global static Map<String,List<SObject>> getStreamingChannel() {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__VlocityUITemplate__c getTemplate(String templateName) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__VlocityUITemplate__c getTemplateByName(String templateName) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> getTemplatesByNames(List<String> templateNames) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> getTemplatesInfo() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> getTemplates() {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.UserProfile getUserProfile() {
        return null;
    }
    @RemoteAction
    global static Boolean isAllTriggersOn() {
        return null;
    }
    @RemoteAction
    global static Boolean isCommunity() {
        return null;
    }
    @RemoteAction
    global static Boolean isInsidePckg() {
        return null;
    }
    @RemoteAction
    global static StreamingChannel postMessageToStreamingAPI(String name, String payload) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__VlocityCard__c saveCard(vlocity_ins__VlocityCard__c card) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__VlocityUILayout__c saveLayout(vlocity_ins__VlocityUILayout__c layout) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__VlocityUITemplate__c saveTemplate(vlocity_ins__VlocityUITemplate__c template) {
        return null;
    }
    @RemoteAction
    global static void setAllTriggers() {

    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUILayout__c> setLayoutStatus(List<String> ids, Boolean status) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> trackVlocityInteraction(String trackingData) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static Object updateLWCResources(String body) {
        return null;
    }
    @RemoteAction
    global static void updateTask(vlocity_ins.InteractionObj interactionObj, Id interactionId) {

    }
    global static Object vlcContinuationCallback(List<String> labels, Object state) {
        return null;
    }
}

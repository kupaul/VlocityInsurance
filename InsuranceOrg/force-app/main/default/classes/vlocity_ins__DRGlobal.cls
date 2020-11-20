/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
@RestResource(urlMapping='/DataRaptor')
global abstract class DRGlobal {
    global DRGlobal() {

    }
    global static void clearCacheForAllDataRaptor() {

    }
    global static void clearCacheForDataRaptor(String dataRaptorName) {

    }
    global static Boolean clearOrgCache(String cacheKey) {
        return null;
    }
    global static Boolean clearOrgCache(String dataRaptorName, Object inputData) {
        return null;
    }
    global static Boolean clearSessionCache(String cacheKey) {
        return null;
    }
    global static Boolean clearSessionCache(String dataRaptorName, Object inputData) {
        return null;
    }
    global static vlocity_ins.DRProcessResult doPost(String objectList, String bundleName, String filesMap) {
        return null;
    }
    global static vlocity_ins.DRProcessResult doPost(String objectList, String bundleName, String filesMap, Map<String,Object> options) {
        return null;
    }
    global static vlocity_ins.DRProcessResult processFromApex(List<Map<String,Object>> objectList, String bundleName) {
        return null;
    }
    global static vlocity_ins.DRProcessResult processFromApex(Map<String,Object> objectList, String bundleName) {
        return null;
    }
    @HttpPost
    global static vlocity_ins.DRProcessResult processObjectsJSON(String objectList, String bundleName) {
        return null;
    }
    global static vlocity_ins.DRProcessResult processObjects(List<SObject> objectList) {
        return null;
    }
    global static vlocity_ins.DRProcessResult processObjects(List<SObject> objectList, String bundleName) {
        return null;
    }
    global static vlocity_ins.DRProcessResult processObjects(List<SObject> objectList, String bundleName, Map<String,Object> additionalInfo) {
        return null;
    }
    global static vlocity_ins.DRProcessResult processObjects(List<SObject> objectList, String bundleName, Map<String,Object> additionalInfo, Map<String,Object> filesMap) {
        return null;
    }
    global static Map<String,Object> processPost(Map<String,Object> bodyData) {
        return null;
    }
    global static Map<String,Object> processPost(Map<String,Object> bodyData, Map<String,Object> options) {
        return null;
    }
    global static vlocity_ins.DRProcessResult processString(String input, String bundleName) {
        return null;
    }
    global static vlocity_ins.DRProcessResult process(List<Map<String,Object>> objectList, String bundleName) {
        return null;
    }
    global static vlocity_ins.DRProcessResult process(Map<String,Object> objectList, String bundleName) {
        return null;
    }
    global static void process(List<SObject> objectList) {

    }
    global static void process(List<SObject> objectList, String bundleName) {

    }
    global static void process(List<SObject> objectList, String bundleName, Map<String,Object> additionalInfo) {

    }
    global static void process(List<SObject> objectList, String bundleName, Map<String,Object> additionalInfo, Map<String,Object> filesMap) {

    }
    global static List<SObject> queryAllFields(List<SObject> toQuery) {
        return null;
    }
    global static void triggerHandler(List<SObject> objectList) {

    }
global class DROpenImplementation implements vlocity_ins.VlocityOpenInterface2 {
    global DROpenImplementation() {

    }
    global Object invokeMethod(String methodName, Map<String,Object> inputs, Map<String,Object> output, Map<String,Object> options) {
        return null;
    }
}
}

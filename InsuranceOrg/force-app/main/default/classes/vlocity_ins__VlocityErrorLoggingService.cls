/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
@RestResource(urlMapping='/v1/errorlog/*')
global class VlocityErrorLoggingService {
    global VlocityErrorLoggingService() {

    }
    @HttpGet
    global static void doGet() {

    }
    @HttpPost
    global static void doPost() {

    }
    global static void finishErrorLoggingSession(String errorLoggingKey) {

    }
    global static void logError(String errorLoggingData) {

    }
    @RemoteAction
    global static Map<String,Object> logErrorJsonList(String errorLoggingDataList) {
        return null;
    }
    global static Map<String,Object> logErrorStringData(String data) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> logError(List<Map<String,Object>> errorLoggingDataList) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> logError(List<Map<String,Object>> errorLoggingDataList, Boolean isCommit) {
        return null;
    }
    global static Map<String,Object> logError(String sourceType, String sourceName, Object data) {
        return null;
    }
    global static void logError(Map<String,Object> errorLoggingDataMap) {

    }
    global static String startErrorLogSession() {
        return null;
    }
}

/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
@RestResource(urlMapping='/v1/track/*')
global class VlocityTrackingService {
    global VlocityTrackingService() {

    }
    @RemoteAction
    global static Map<String,Object> closeInteraction(Map<String,Object> interactionInfo) {
        return null;
    }
    @HttpGet
    global static void doGet() {

    }
    @HttpPost
    global static void doPost() {

    }
    global static void finishTrackingSession(String trackingKey) {

    }
    @RemoteAction
    global static Map<String,Object> openInteraction(Map<String,Object> interactionInfo) {
        return null;
    }
    global static String startTrackingSession() {
        return null;
    }
    global static String startTrackingSession(Map<String,Object> options) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> trackJsonList(String trackingDataList) {
        return null;
    }
    global static Map<String,Object> trackStringData(String data) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> track(List<Map<String,Object>> trackingDataList) {
        return null;
    }
    global static Map<String,Object> track(String service, String event, Object data) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> updateInteraction(Map<String,Object> interactionInfo) {
        return null;
    }
}

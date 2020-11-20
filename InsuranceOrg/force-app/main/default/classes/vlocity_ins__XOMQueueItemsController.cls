/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class XOMQueueItemsController {
    global XOMQueueItemsController() {

    }
    global XOMQueueItemsController(ApexPages.StandardController stdController) {

    }
    @RemoteAction
    global static Map<String,Object> assignQueue(List<String> orchestrationItemIdList, String queueId) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> completeItems(List<String> orchestrationItemIdList) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__ManualQueue__c> getActiveQueue() {
        return null;
    }
    @RemoteAction
    global static List<User> getActiveUsers() {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getItemsV2(String manualQueueId, String userId, String sortBy, Map<String,String> additionalFilter, Map<String,List<String>> additionalFilterReferenced, Boolean deepCheck, String displayedFields, Integer offSet, Integer limitLength) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__OrchestrationItem__c> getSuggestedValues(String referenceName, String manualQueueId) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> pickUpItems(List<String> orchestrationItemIdList, String assignTo) {
        return null;
    }
    @RemoteAction
    global static String redirectURL(Id orchItemId) {
        return null;
    }
    @RemoteAction
    global static String redirectURL1(Id orchItemId, String url) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> retryItems(List<String> orchestrationItemIdList) {
        return null;
    }
}

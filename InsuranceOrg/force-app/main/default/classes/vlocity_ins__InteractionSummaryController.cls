/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class InteractionSummaryController implements vlocity_ins.VlocityOpenInterface2 {
    global String actionListString {
        get;
        set;
    }
    global Id interactionId {
        get;
        set;
    }
    global Boolean isLanguageRTL {
        get;
        set;
    }
    global static String namespacePrefix {
        get;
        set;
    }
    global InteractionSummaryController() {

    }
    global InteractionSummaryController(ApexPages.StandardController stdController) {

    }
    @AuraEnabled
    global static String getCustomerInteraction(String recordId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.InteractionObj getInteractionObject(Id interactionId) {
        return null;
    }
    @RemoteAction
    global static String getTrackingEntries(Id interactionId) {
        return null;
    }
    @RemoteAction
    global static void updateTask(vlocity_ins.InteractionObj interactionObj, Id interactionId) {

    }
}

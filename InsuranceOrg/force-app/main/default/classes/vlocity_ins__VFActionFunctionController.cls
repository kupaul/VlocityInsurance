/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class VFActionFunctionController {
    global String attachmentId {
        get;
        set;
    }
    global String fileName {
        get;
        set;
    }
    global String input {
        get;
        set;
    }
    global Boolean isQueueable {
        get;
        set;
    }
    global String optionJson {
        get;
        set;
    }
    global String parentId {
        get;
        set;
    }
    global String promiseId {
        get;
        set;
    }
    global String responseId {
        get;
        set;
    }
    global VFActionFunctionController() {

    }
    @RemoteAction
    global static String actionFunctionResult(String stagingObjectId, String className, String methodName, String options) {
        return null;
    }
    @RemoteAction
    webService static String invokeServiceRun(String className, String methodName, String input, String options) {
        return null;
    }
    global void runActionFunction() {

    }
    global void runAddAttachmentMethod() {

    }
global class ActionFunctionException extends Exception {
}
global class ActionFunctionPotentialGovernorLimitException extends Exception {
}
global class ActionFunctionQueueable implements Database.AllowsCallouts, System.Queueable {
    global ActionFunctionQueueable(String classN, String methodN, String sObjId, String optionsString) {

    }
    global void execute(System.QueueableContext context) {

    }
}
global class VFActionFunctionControllerOpen implements vlocity_ins.VlocityOpenInterface2 {
    global VFActionFunctionControllerOpen() {

    }
    global Object invokeMethod(String methodName, Map<String,Object> input, Map<String,Object> output, Map<String,Object> options) {
        return null;
    }
}
}

/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class CustomAction {
    global CustomAction() {

    }
    @InvocableMethod(label='Execute Custom Action')
    global static List<vlocity_ins.CustomAction.CustomActionResult> executeCustomAction(List<vlocity_ins.CustomAction.CustomActionRequest> requests) {
        return null;
    }
global class CustomActionException extends Exception {
}
global class CustomActionRequest {
    @InvocableVariable( required=false)
    global String className;
    @InvocableVariable( required=false)
    global String input;
    @InvocableVariable( required=false)
    global String options;
    global CustomActionRequest() {

    }
}
global class CustomActionResult {
    @InvocableVariable( required=false)
    global String error;
    @InvocableVariable( required=false)
    global Boolean hasErrors;
    @InvocableVariable( required=false)
    global String output;
    global CustomActionResult() {

    }
}
}

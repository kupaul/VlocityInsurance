/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class EligibilityMatrixAction {
    global EligibilityMatrixAction() {

    }
    @InvocableMethod(label='Calculate')
    global static List<vlocity_ins.EligibilityMatrixAction.EligibilityMatrixActionResult> calculate(List<vlocity_ins.EligibilityMatrixAction.EligibilityMatrixActionRequest> requests) {
        return null;
    }
global class EligibilityMatrixActionException extends Exception {
}
global class EligibilityMatrixActionRequest {
    @InvocableVariable( required=false)
    global String dataRaptorBundle;
    @InvocableVariable( required=false)
    global Boolean includeMissing;
    @InvocableVariable( required=false)
    global String matrixName;
    @InvocableVariable( required=false)
    global Boolean useDisplayText;
    global EligibilityMatrixActionRequest() {

    }
}
global class EligibilityMatrixActionResult {
    @InvocableVariable( required=false)
    global String error;
    @InvocableVariable( required=false)
    global Boolean hasErrors;
    global EligibilityMatrixActionResult() {

    }
}
}

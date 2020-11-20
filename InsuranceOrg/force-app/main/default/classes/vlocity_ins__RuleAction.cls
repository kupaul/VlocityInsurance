/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class RuleAction {
    global RuleAction() {

    }
    @InvocableMethod(label='Execute Rule')
    global static List<vlocity_ins.RuleAction.RuleActionResult> executeRules(List<vlocity_ins.RuleAction.RuleActionRequest> requests) {
        return null;
    }
global class RuleActionException extends Exception {
}
global class RuleActionRequest {
    @InvocableVariable( required=false)
    global Boolean doCommit;
    @InvocableVariable( required=false)
    global String ruleName;
    @InvocableVariable( required=false)
    global String ruleType;
    @InvocableVariable( required=false)
    global Boolean runAgainstChildList;
    @InvocableVariable( required=false)
    global Boolean runAgainstHeader;
    global RuleActionRequest() {

    }
}
global class RuleActionResult {
    @InvocableVariable( required=false)
    global String error;
    @InvocableVariable( required=false)
    global Boolean hasErrors;
    global RuleActionResult() {

    }
}
}

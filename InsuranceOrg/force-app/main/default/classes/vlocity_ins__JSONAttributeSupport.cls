/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class JSONAttributeSupport implements vlocity_ins.VlocityOpenInterface {
    global String errorMessage;
    global JSONAttributeSupport() {

    }
    global Boolean invokeMethod(String methodName, Map<String,Object> input, Map<String,Object> output, Map<String,Object> options) {
        return null;
    }
global enum ActionType {ASSIGN, CONSTRAIN_EXCLUDE, CONSTRAIN_INCLUDE, DISABLE, HIDE, REQUIRE}
global enum BooleanActionValue {NO, YES}
global class JSONAttributeActionRequest {
    global vlocity_ins.JSONAttributeSupport.ActionType actionType;
    global String attributeCode;
    global Object value;
    global JSONAttributeActionRequest(String attributeCode, vlocity_ins.JSONAttributeSupport.ActionType actionType, Object value) {

    }
}
global enum Status {FAILURE, SUCCESS}
}

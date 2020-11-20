/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class CpqFreezeOrderResult {
    global Id contextOrderId {
        get;
        set;
    }
    global vlocity_ins.CpqFreezeOrderResult.ErrorType errorType {
        get;
        set;
    }
    global Boolean isError {
        get;
        set;
    }
    global Boolean isPONR {
        get;
        set;
    }
    global String resultCode {
        get;
        set;
    }
    global Id supersededOrderId {
        get;
        set;
    }
    global String userMessage {
        get;
        set;
    }
    global CpqFreezeOrderResult() {

    }
    global CpqFreezeOrderResult(Boolean isError, String userMessage) {

    }
global enum ErrorType {BUSINESS, TECHNICAL}
}

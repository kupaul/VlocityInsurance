/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class CpqUnfreezeOrderResult {
    global Id contextOrderId {
        get;
        set;
    }
    global vlocity_ins.CpqUnfreezeOrderResult.ErrorType errorType {
        get;
        set;
    }
    global Boolean isError {
        get;
        set;
    }
    global String resultCode {
        get;
        set;
    }
    global String userMessage {
        get;
        set;
    }
    global CpqUnfreezeOrderResult() {

    }
global enum ErrorType {BUSINESS, TECHNICAL}
}

/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class SaverResults {
    global SaverResults(Object result) {

    }
    global SaverResults(List<Object> results, List<SObject> sobjects) {

    }
    global SaverResults(Object result, SObject obj) {

    }
    global void add(vlocity_ins.SaverResults sr) {

    }
    global void add(vlocity_ins.SaverResults.Result result) {

    }
    global void add(List<Object> results, List<SObject> sobjects) {

    }
    global List<vlocity_ins.SaverResults.Result> getFailures() {
        return null;
    }
global class Result {
    global String error {
        get;
        set;
    }
    global Id id {
        get;
        set;
    }
    global SObject record {
        get;
        set;
    }
    global Boolean success {
        get;
        set;
    }
    global Result(Database.DeleteResult dr, SObject sObj) {

    }
    global Result(Database.SaveResult sr, SObject sObj) {

    }
    global Result(Database.UpsertResult ur, SObject sObj) {

    }
}
}

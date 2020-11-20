/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global virtual class DefaultSystemInterface implements vlocity_ins.XOMOrchestrationInterfaces.IDeferredUpdater, vlocity_ins.XOMOrchestrationInterfaces.ISystemInterface {
    global DefaultSystemInterface() {

    }
    global virtual System.HttpRequest createHttpRequest(String url, String path, String requestPayload) {
        return null;
    }
    global virtual void endBatch(String url, String path) {

    }
    global virtual void executeItem(String url, String path, vlocity_ins__OrchestrationItem__c item) {

    }
    global virtual String generatePayload(vlocity_ins__OrchestrationItem__c item, vlocity_ins.XOMOrderDomainObject orderObj) {
        return null;
    }
    global virtual void processResponse(String url, String path, System.HttpResponse res) {

    }
    global virtual void processResponse(vlocity_ins__OrchestrationItem__c item, String url, String path, vlocity_ins.XOMOrderDomainObject orderObj, System.HttpResponse res) {

    }
    global virtual void startBatch(String url, String path) {

    }
global class DefaultInterfaceUnrecoverableException extends Exception {
}
}

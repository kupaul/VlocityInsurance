global with sharing class TestDebugDocUpload implements vlocity_ins.VlocityOpenInterface2 {

    
global Boolean invokeMethod(String methodName,
Map<String,Object> inputMap,
Map<String,Object> outputMap,
Map<String,Object> options) {
System.debug('methodName: ' + methodName);
System.debug('inputMap: ' + inputMap);
System.debug('options: ' + options);
    return true;
}
}
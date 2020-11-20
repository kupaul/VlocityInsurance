global class EncodeJSON implements vlocity_ins.VlocityOpenInterface2 {

  /**
     * Top level call by a Vlocity Remote Action
     *
     * @param inputMap  - The input provided to the Remote Action
     * @param outputMap - Any output to be provided back to the Remote Action
     * @param options   - Any options to aid in the execution of this class
     *
     * @returns true if the method completes successfully, false otherwise
     */ 
    global Boolean invokeMethod(String methodName, Map<String, Object> inputMap, Map<String, Object> outputMap, Map<String, Object> options) {

        if (methodName == 'Encode') outputMap.put ('data', encode(inputMap, outputMap));  
        return true;
    }


public string encode(Map<String, Object> inputMap, Map<String, Object> outputMap){


String input=JSON.serialize(inputMap);
String encodedString = EncodingUtil.base64Encode(Blob.valueOf(input));
return encodedString;
}
}
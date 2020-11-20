/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class ApplicationService {
    global static Map<String,String> LangCodeNameMap;
    global static Map<String,String> LangNameCodeMap;
    global ApplicationService() {

    }
    global static Map<String,Object> BuildBPDataJSONV2(String bpId, Map<String,Object> rootElements) {
        return null;
    }
    global static Map<String,Object> BuildBPDataJSON(String bpId, Map<String,String> rootElements) {
        return null;
    }
    global static String BuildJSON(String sId, Boolean bResume, Boolean bPreview) {
        return null;
    }
    global static String BuildJSON2(String sOSType, String sOSSubType, String sOSLang) {
        return null;
    }
    global static String BuildJSONV2(String sId, String scriptState, Boolean bPreview) {
        return null;
    }
    global static String BuildJSONV3(String sId, String scriptState, Boolean bPreview, String multiLangCode) {
        return null;
    }
    global static String BuildJSONWithPrefill(String sOSType, String sOSSubType, String sOSLang, String pfBundle, String drParams) {
        return null;
    }
    global static String BuildJSONWithPrefillV2(String sOSType, String sOSSubType, String sOSLang, String pfBundle, String drParams, String multiLangCode) {
        return null;
    }
    global static String CompleteScript(String sInstanceId) {
        return null;
    }
    global static String GenericInvoke(String sClassName, String sMethodName, String input, String options) {
        return null;
    }
    global static Object GenericInvoke2(String sClassName, String sMethodName, String input, String options) {
        return null;
    }
    global static Object GenericInvokeLwc(String sClassName, String sMethodName, Map<String,Object> inputMap, Map<String,Object> optionsMap) {
        return null;
    }
    global static Map<String,Map<String,String>> GetDependentOptions(String pObjName, String controllingFieldName, String dependentFieldName) {
        return null;
    }
    global static Map<String,String> GetDocuments(String query) {
        return null;
    }
    global static String GetUserInfo() {
        return null;
    }
    global static Boolean IsActiveOmniscript(String id) {
        return null;
    }
    global static String LoadTabs(String sType, String sTabs, Integer index) {
        return null;
    }
    global static String SaveforLater(String bpTree, String files) {
        return null;
    }
    global static String SubmitApp(String bpTree, String files) {
        return null;
    }
global class ApplicationException extends Exception {
}
global class Bitset {
    global Map<String,Integer> alphaNumCharCodes {
        get;
    }
    global Map<String,Integer> base64CharCodes {
        get;
    }
    global Bitset() {

    }
}
global class Element {
    global Boolean bAccordionActive;
    global Boolean bAccordionOpen;
    global Boolean bHasAttachment;
    global Boolean bHasNext;
    global Boolean bHasPrevious;
    global List<vlocity_ins.ApplicationService.ElementNode> children;
    global String id;
    global Integer index;
    global Integer indexInParent;
    global Integer level;
    global String name;
    global Integer order;
    global String parentElementId;
    global Map<String,Object> propSetMap;
    global Object response;
    global String type;
    global Element() {

    }
}
global class ElementNode {
    global Boolean bHasAttachment;
    global List<vlocity_ins.ApplicationService.Element> eleArray;
    global Integer indexInParent;
    global Integer level;
    global List<Object> resp;
    global Object response;
    global ElementNode() {

    }
}
global class Elements {
    global Boolean bHasAttachment;
    global String bpLang;
    global String bpSubType;
    global String bpType;
    global List<vlocity_ins.ApplicationService.Element> children;
    global String error;
    global Map<String,String> labelMap;
    global String prefillJSON;
    global Object response;
    global String RPBundle;
    global String sOmniScriptId;
    global String timeStamp;
    global String userId;
    global String userName;
    global Elements() {

    }
}
global class Tab {
    global Boolean active;
    global Boolean bLoaded;
    global List<vlocity_ins.ApplicationService.LangLink> langLinks;
    global String title;
    global String value;
    global Tab() {

    }
}
}

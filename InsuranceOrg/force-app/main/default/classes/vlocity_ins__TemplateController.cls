/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class TemplateController {
    global System.PageReference homeUrl {
        get;
    }
    global Boolean isLanguageRTL {
        get;
        set;
    }
    global String language {
        get;
        set;
    }
    global System.PageReference newUrl {
        get;
    }
    global String nsPrefix {
        get;
    }
    global String orgName {
        get;
    }
    @RemoteAction
    global static List<Database.DeleteResult> deleteTemplate(String id) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> getActiveTemplates(List<String> templates) {
        return null;
    }
    @RemoteAction
    global static String getBaseTemplates() {
        return null;
    }
    @RemoteAction
    global static String getCustomSettings(String customSettingName) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> getSassMixins() {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__VlocityUITemplate__c getTemplate(String id) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__VlocityUITemplate__c getTemplateByName(String name) {
        return null;
    }
    @RemoteAction
    global static List<System.SelectOption> getTemplateTypes() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> getTemplatesAllFields() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> getTemplatesByIds(List<String> templateIds) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> getTemplatesByName(List<String> templates) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> getTemplates() {
        return null;
    }
    @RemoteAction
    global static Boolean isInsidePckg() {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__VlocityUITemplate__c saveTemplate(vlocity_ins__VlocityUITemplate__c template) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__VlocityUITemplate__c saveTemplateBypass(vlocity_ins__VlocityUITemplate__c template) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__TemplateDesignerConfiguration__c saveTemplateDesignerConfiguration(vlocity_ins__TemplateDesignerConfiguration__c conf) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityUITemplate__c> setTemplateStatus(List<String> ids, Boolean status) {
        return null;
    }
}

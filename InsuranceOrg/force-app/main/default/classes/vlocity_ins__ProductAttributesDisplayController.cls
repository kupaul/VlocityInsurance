/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class ProductAttributesDisplayController {
    @RemoteAction
    global static String applyAttribute(Id prodId, String categoryCode, String attributeCode, String attMap) {
        return null;
    }
    @RemoteAction
    global static String applyTemplate(Id prodId, String templateName) {
        return null;
    }
    @RemoteAction
    global static String clearTemplate(Id prodId) {
        return null;
    }
    @RemoteAction
    global static String deleteAttribute(Id prodId, String categoryCode, String attributeCode, String attMap) {
        return null;
    }
    @RemoteAction
    global static String deleteCategory(Id prodId, String categoryCode, String attMap) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.ProductCategoryAttributeStatus> getAttributes(Id prodId, String categoryCode) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.ProductCategoryStatus> getCategories(Id prodId) {
        return null;
    }
    @RemoteAction
    global static Map<String,List<vlocity_ins.ProductCategoryAttributeStatus>> getCategoryAttributes(Id prodId, List<String> categoryCodeList) {
        return null;
    }
    @RemoteAction
    global static String getProductAttributes(Id prodId) {
        return null;
    }
    @RemoteAction
    global static String getProductConfigurations(Id prodId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.ProductTemplateStatus> getProductTemplates(Id ProductId) {
        return null;
    }
    @RemoteAction
    global static String saveAsATemplate(Id prodId, String templateName) {
        return null;
    }
    @RemoteAction
    global static void saveAsTemplate(Id prodId, String templateName) {

    }
    @RemoteAction
    global static void saveAttributes(String attMap) {

    }
    @RemoteAction
    global static void saveAttributesV2(String attMap, String callingVerticalValue) {

    }
    @RemoteAction
    global static String saveProductConfigurations(Id prodId, String parameters) {
        return null;
    }
}

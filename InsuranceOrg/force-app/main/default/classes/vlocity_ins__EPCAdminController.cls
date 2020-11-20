/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class EPCAdminController {
    global String currencyLocaleSymbol {
        get;
    }
    global Boolean enableBetaFeatures {
        get;
    }
    global static String nsp {
        get;
    }
    global String sfBaseUrl {
        get;
    }
    global Integer userTimezoneOffset {
        get;
    }
    global EPCAdminController() {

    }
    @RemoteAction
    global static List<vlocity_ins__ObjectFieldAttribute__c> applyFieldAttribute(Id objectId, List<String> fieldNames, List<Id> attributeIds) {
        return null;
    }
    @RemoteAction
    global static String assignPicklist(String attributeAssignmentId, String picklistId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__AttributeAssignment__c createAttributeAssignment(String attributeId, String objectId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__AttributeAssignment__c> createAttributeAssignments(List<String> attributeIds, String objectId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__AttributeBinding__c createAttributeFieldBinding(Id attributeId, String fieldName, Id objectId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__ObjectClass__c createObjectType(Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static SObject createObject(String objectName, Map<String,Object> inputMap) {
        return null;
    }
    @RemoteAction
    global static String createOverride(String inputMap) {
        return null;
    }
    @RemoteAction
    global static String createPicklistsAndEntries(String inputMap) {
        return null;
    }
    @RemoteAction
    global static SObject createProduct(String inputMap) {
        return null;
    }
    @RemoteAction
    global static String deleteAttributeAssignment(String attributeAssignmentId) {
        return null;
    }
    @RemoteAction
    global static List<String> deleteAttributeAssignments(List<String> attributeAssignmentIds) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__ObjectFacet__c deleteFacet(vlocity_ins__ObjectFacet__c objectFacet) {
        return null;
    }
    @RemoteAction
    global static void deleteObject(SObject so) {

    }
    @RemoteAction
    global static String deleteObjectType(Id objectTypeId) {
        return null;
    }
    @RemoteAction
    global static String deleteOverride(String inputMap) {
        return null;
    }
    @RemoteAction
    global static String deleteProduct(String productId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__ObjectSection__c deleteSection(vlocity_ins__ObjectSection__c section) {
        return null;
    }
    @RemoteAction
    global static Object describeField(String objectName, String fieldName) {
        return null;
    }
    @RemoteAction
    global static Map<String,Map<String,Object>> describeObjectFieldsById(Id objectId, List<String> fieldNames) {
        return null;
    }
    @RemoteAction
    global static Map<String,Map<String,Object>> describeObjectWithQuery(String objectName, String inputMap) {
        return null;
    }
    @RemoteAction
    global static Map<String,Map<String,Object>> describeObject(String objectName) {
        return null;
    }
    @RemoteAction
    global static Map<String,Map<String,Object>> describeObjectbyId(Id objectId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__Attribute__c> getAllAttributes(Id objectId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__AttributeCategory__c> getAllCategories() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__ObjectClass__c> getAllObjectClasses() {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getAllPicklistsAndEntries() {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__ObjectClass__c> getApplicableObjectClasses(Id attributeId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.EPCAdminAttributeService.AppliedFieldAttribute> getAppliedAttributesFields(Id objectId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__AttributeAssignment__c> getAssignedAttributes(String productId, String context) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__VlocityAttachment__c getAttachmentRec(Id objectId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__VlocityAttachment__c> getAttachments(Id objectId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.EPCAdminAttributeService.AAWrapper getAttributeAssignment(String attributeCode, Id objectId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.EPCAdminAttributeService.AAWrapper getAttributeAssignmentById(Id attributeId, Id objectId) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getAttributeFieldBindingData2(Id objectId, Boolean allObjectAttributes) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> getAttributeFieldBindingData(Id objectId) {
        return null;
    }
    global static Map<String,Object> getAttributeFieldBindingData(Id objectId, Boolean allObjectAttributes) {
        return null;
    }
    @RemoteAction
    global static List<SObject> getAvailablePricingElements(Id priceVariableId, String sortBy) {
        return null;
    }
    @RemoteAction
    global static List<SObject> getAvailablePricingVariableElements(String input, String options) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.EPCAdminAttributeService.SectionElementData> getAvailableSectionElements(String objectId) {
        return null;
    }
    @RemoteAction
    global static List<SObject> getContextCriteria(Id objectId) {
        return null;
    }
    @RemoteAction
    global static Map<String,List<vlocity_ins.EPCAdminUtils.FieldSetObject>> getFieldSetsByName(String objectName) {
        return null;
    }
    @RemoteAction
    global static Map<String,List<vlocity_ins.EPCAdminUtils.FieldSetObject>> getFieldSets(Id objectId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__Attribute__c> getGlobalAttributes() {
        return null;
    }
    @RemoteAction
    global static List<SObject> getGlobalPricingElements(Id objectTypeId, String sortBy) {
        return null;
    }
    @RemoteAction
    global static SObject getObject(Id objectId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__ObjectClass__c> getObjectClassTypesByName(String objectName) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__ObjectClass__c> getObjectClassTypes(Id objectClassId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.EPCAdminProductService.LayoutObject getObjectLayoutById(String objectId, Boolean isInherited) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.EPCAdminProductService.LayoutObject getObjectLayoutByName(String objectName, String recordType) {
        return null;
    }
    @RemoteAction
    global static Map<String,List<vlocity_ins.EPCAdminUtils.Option>> getObjectPicklistsByName(String objectName) {
        return null;
    }
    @RemoteAction
    global static Map<String,List<vlocity_ins.EPCAdminUtils.Option>> getObjectPicklists(Id objectId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.EPCAdminController.ObjectTypeItem> getObjectTypeStructure(Id objectClassId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__OfferPricingComponent__c> getOfferPricingComponentDefinitionByContext(String context) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__OfferPricingComponent__c> getOfferPricingComponentDefinition(Id productId) {
        return null;
    }
    @RemoteAction
    global static String getOverride(String inputMap) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__PicklistSelectionEntry__c> getPicklistItems(String picklistId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__PicklistValue__c> getPicklistValues(String picklistId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.PricingComponentAdminService.PriceListWrapper> getPriceBookPriceListHierarchies(Id priceBookId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.PricingComponentAdminService.PriceListWrapper> getPriceListHierarchy(Id priceListId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__PricingComponent__c> getPricingComponentDefinition(Id productId) {
        return null;
    }
    @RemoteAction
    global static List<SObject> getPricingElementDefinitionByContext(String context) {
        return null;
    }
    @RemoteAction
    global static List<Object> getPricingElementsByPriceList(Id priceListId, String sortBy) {
        return null;
    }
    @RemoteAction
    global static List<Object> getPricingElementsByProduct(Id productId, String sortBy) {
        return null;
    }
    @RemoteAction
    global static List<Object> getPricingElementsByPromotion(Id promotionId, String sortBy) {
        return null;
    }
    @RemoteAction
    global static List<Object> getPricingElements(String input, String options) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.EPCAdminProductService.ProdStructItem> getProdStructureItems(Id rootProductId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins.EPCAdminController.ProdVersionItem> getProductVersions(Id curProdId) {
        return null;
    }
    @RemoteAction
    global static List<SObject> getPromotionApplicableProducts(Id promotionId) {
        return null;
    }
    @RemoteAction
    global static List<SObject> getPromotionEligibleProducts(Id promotionId) {
        return null;
    }
    @RemoteAction
    global static List<SObject> getPromotionIncludedProducts(Id promotionId) {
        return null;
    }
    @RemoteAction
    global static List<Object> getPromotionItems(Id promotionId, String mode) {
        return null;
    }
    @RemoteAction
    global static List<SObject> getSearchResults(String inputMap) {
        return null;
    }
    @RemoteAction
    global static List<SObject> getStandalonePricingElements(Id priceListId, Id objectTypeId, String sortBy) {
        return null;
    }
    @RemoteAction
    global static Product2 publishProduct(Id productId) {
        return null;
    }
    @RemoteAction
    global static List<vlocity_ins__ObjectFieldAttribute__c> saveApplicableObjectClasses(Id attributeId, List<Id> newApplicableObjectClasses, List<Id> newNonApplicableObjectClasses) {
        return null;
    }
    @RemoteAction
    global static SObject saveAttributeAssignment(SObject so) {
        return null;
    }
    @RemoteAction
    global static String saveOverride(String inputMap) {
        return null;
    }
    @RemoteAction
    global static List<SObject> searchObjectFields(String objectName, String inputMap) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins__ObjectFieldAttribute__c unapplyFieldAttribute(Id objectId, String fieldName, String attributeId) {
        return null;
    }
    @RemoteAction
    global static Map<String,Object> updateAttachment(Id attId, String attachObject) {
        return null;
    }
    @RemoteAction
    global static SObject updateObject(SObject so) {
        return null;
    }
global class ObjectTypeItem {
    global Integer level;
    global vlocity_ins__ObjectClass__c objectType;
    global ObjectTypeItem() {

    }
}
global class ProdVersionItem {
}
}

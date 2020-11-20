/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class PricingComponentAdminService {
    global PricingComponentAdminService() {

    }
    global static List<vlocity_ins.PricingComponentAdminService.PriceListWrapper> getPriceBookPriceListHierarchies(Id priceBookId) {
        return null;
    }
    global static vlocity_ins.PricingComponentAdminService.PriceListWrapper getPriceListChildHierarchy(Id priceListId) {
        return null;
    }
    global static vlocity_ins.PricingComponentAdminService.PriceListWrapper getPriceListHierarchy(Id priceListId) {
        return null;
    }
    global static List<vlocity_ins.PricingComponentAdminService.PriceListWrapper> getPriceListHierarchy(List<Id> priceListIds) {
        return null;
    }
    global static List<SObject> getPromotionApplicableProducts(Id promotionId, Map<String,Object> contextMap) {
        return null;
    }
    global static List<SObject> getPromotionIncludedProducts(Id promotionId, Map<String,Object> contextMap) {
        return null;
    }
global class PriceListEntryWrapper {
    global SObject priceList;
    global List<vlocity_ins.PricingComponentAdminService.PriceVarEntry> priceVars;
    global SObject product;
    global PriceListEntryWrapper() {

    }
}
global class PriceListWrapper {
    global List<vlocity_ins.PricingComponentAdminService.PriceListWrapper> children;
    global SObject priceList;
    global PriceListWrapper(SObject obj) {

    }
}
global class PriceVarEntry {
    global List<SObject> adjustments;
    global List<SObject> charges;
    global List<SObject> overrides;
    global SObject priceVar;
    global List<SObject> usages;
    global PriceVarEntry() {

    }
}
}

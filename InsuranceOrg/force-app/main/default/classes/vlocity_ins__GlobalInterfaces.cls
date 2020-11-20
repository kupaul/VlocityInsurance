/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global abstract class GlobalInterfaces {
    global GlobalInterfaces() {

    }
global interface ABOAssetInterface {
    SObject createAsset(Map<String,Object> param0);
    Map<String,Object> getAssetList(Map<String,Object> param0);
}
global interface AddPricebookEntryInterface {
    PricebookEntry addPricebookEntry(Id param0, Id param1);
}
global interface AssetFilterInterface {
    String getFilterForAsset(String param0, Id param1);
}
global interface AssetsInterface {
    List<Asset> getAssetsForAccount(Id param0);
}
global interface BillingInterface {
    List<Asset> getLatestBillForAccount(Id param0);
}
global interface CalculateUnitPriceInterface {
    List<SObject> calcUnitPrice(List<SObject> param0, Id param1, Decimal param2);
}
global interface ChildItemSelectionInterface {
    Id getChildProduct(Id param0);
}
global interface CloneFieldListInterface {
    List<String> getFieldList(Schema.SObjectType param0);
}
global interface ConfigurePriceQuoteControllerInterface {
    vlocity_ins.ObjectCopier createCpq(Id param0, SObject param1, List<vlocity_ins.ItemWrapper> param2);
}
global interface DecomposeInterface {
    List<SObject> decomposeObject(SObject param0);
}
global interface DeltaOrderInterface {
    void handleDeltaOrder(Id param0);
}
global interface FieldMapperInterface {
    String getParameters();
    void invokeMethod();
    void setParameters(String param0);
}
global interface KeyUpdatableInterface {
    Boolean isKeyUpdatable();
}
global interface KeyUpgradableInterface {
    Boolean isKeyUpgradable();
}
global interface MultiSiteOrderUtilities {
    List<Order> addRelatedOrder(String param0, String param1, String param2);
    List<Account> getRelatedAccounts(String param0);
    List<Order> getRelatedOrders(String param0);
}
global interface NewProductVersionInterface {
    Product2 newProductVersion(Product2 param0, String param1, String param2, Date param3, Date param4, Boolean param5);
}
global interface ObjectCopierInterface {
    vlocity_ins.ObjectCopier copyObject(Id param0, String param1);
}
global interface OpptyScheduleInterface {
    List<SObject> createSchedule(Id param0);
}
global interface PremisesInterface {
    List<vlocity_ins__Premises__c> getPremises(Id param0);
}
global interface PricingInterface {
    void priceLineItems(SObject param0, List<SObject> param1);
}
global interface ProductAvailabilityInterface {
    List<PricebookEntry> getAvailableProducts(SObject param0, List<PricebookEntry> param1);
}
global interface ProductCompatibilityInterface {
    List<PricebookEntry> getCompatibleProducts(SObject param0, List<PricebookEntry> param1);
}
global interface ProductDefinitionInterface {
    void handleAction(vlocity_ins.ProductLineItemActionParam param0, Map<String,Object> param1);
}
global interface ProductEligibilityInterface {
    List<PricebookEntry> getEligibleProducts(SObject param0, List<PricebookEntry> param1);
}
global interface ProductLineItemActionInterface {
    void handleAction(vlocity_ins.ProductLineItemActionParam param0);
}
global interface ProductValidationInterface {
    void validateLineItems(List<vlocity_ins.ItemWrapper> param0);
}
global interface RESTCPQInterface {
    List<Map<String,String>> fillCommandStruct(System.RestRequest param0, List<Map<String,String>> param1);
    List<Map<String,Object>> fillOutReturn(List<Map<String,Object>> param0);
}
global interface RepricingInterface {
    void repriceLineItems(Map<String,Object> param0, Map<String,Object> param1);
}
global interface SubmitInterface {
    void submit(SObject param0);
}
global interface SyncQuoteToOpptyInterface {
    vlocity_ins.ObjectCopier createCpq(Id param0, SObject param1, List<vlocity_ins.ItemWrapper> param2);
}
}

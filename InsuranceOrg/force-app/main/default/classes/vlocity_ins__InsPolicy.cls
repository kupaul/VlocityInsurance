/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class InsPolicy {
    global String accountId;
    global Map<String,Object> additionalInfo;
    global Map<String,Object> attributeSelectedValues;
    global List<vlocity_ins.InsPolicy.InsCoverage> coverages;
    global Datetime createdDate;
    global String currencyCode;
    global String currencySymbol;
    global Datetime effectiveDate;
    global Datetime endDate;
    global String financialAccountId;
    global String Id;
    global List<vlocity_ins.InsPolicy.InsInsuredItem> insuredItems;
    global List<vlocity_ins.InsPolicy.InsInsuredParty> insuredParties;
    global Decimal monthlyPremium;
    global String name;
    global Datetime originalEffectiveDate;
    global Datetime originalEndDate;
    global String originalVersionId;
    global String parentClassCode;
    global String parentClassId;
    global String policyNumber;
    global String previousVersionId;
    global List<vlocity_ins.InsPolicy.InsPricingAdjustment> pricingAdjustments;
    global String productCode;
    global String productId;
    global List<vlocity_ins.InsPolicy.InsRevenue> revenueSchedule;
    global String sourceQuoteId;
    global String sourceQuoteType;
    global Decimal standardPremium;
    global String status;
    global String term;
    global Decimal totalAmount;
    global Decimal totalAmountForTerm;
    global Decimal totalFeeAmount;
    global Decimal totalFeeForTerm;
    global Decimal totalFeeForVersions;
    global Decimal totalPremiumForTerm;
    global Decimal totalPremiumForVersions;
    global Decimal totalSumInsured;
    global Decimal totalTaxAmount;
    global Decimal totalTaxFeeAmount;
    global Decimal totalTaxForTerm;
    global Decimal totalTaxForVersions;
    global List<vlocity_ins.InsPolicy.InsTransaction> transactions;
    global InsPolicy() {

    }
    global InsPolicy(Datetime policyStart, Datetime policyEnd, String account, String recordId, String policyTerm, String policyName, String prodId, Map<String,Object> attrValues, Map<String,Object> otherInfo) {

    }
    global void addCoverage(vlocity_ins.InsPolicy.InsCoverage coverage) {

    }
    global void addInsuredItem(vlocity_ins.InsPolicy.InsInsuredItem insuredItem) {

    }
    global void addInsuredParty(vlocity_ins.InsPolicy.InsInsuredParty insuredParty) {

    }
    global void addPricingAdjustment(vlocity_ins.InsPolicy.InsPricingAdjustment pricingAdjustment) {

    }
    global void addTransaction(vlocity_ins.InsPolicy.InsTransaction insTransaction) {

    }
    global vlocity_ins.InsPolicy.InsInsuredItem getInsuredItemById(String id) {
        return null;
    }
    global vlocity_ins.InsPolicy.InsInsuredItem getInsuredItemByInstanceKey(String instanceKey) {
        return null;
    }
    global vlocity_ins.InsPolicy.InsInsuredParty getInsuredPartyById(String id) {
        return null;
    }
    global vlocity_ins.InsPolicy.InsInsuredParty getInsuredPartyByInstanceKey(String instanceKey) {
        return null;
    }
    global vlocity_ins.InsPolicy.InsTransaction getTransactionById(String transactionId) {
        return null;
    }
    global List<vlocity_ins.InsPolicy.InsTransaction> getTransactionsByType(String id, String type) {
        return null;
    }
    global void setCoverages(List<vlocity_ins.InsPolicy.InsCoverage> rootCoverages) {

    }
    global void setInsuredItems(List<vlocity_ins.InsPolicy.InsInsuredItem> insuredItemList) {

    }
    global void setInsuredParties(List<vlocity_ins.InsPolicy.InsInsuredParty> insuredPartyList) {

    }
    global void setPremiums(Decimal standard, Decimal monthly, Decimal total) {

    }
    global void setVersionIds(String originalId, String previousId) {

    }
    global Map<String,Object> toMap() {
        return null;
    }
global class InsCoverage {
    global Map<String,Object> additionalInfo;
    global Map<String,Object> attributeSelectedValues;
    global String currencyCode;
    global String currencySymbol;
    global Datetime effectiveDate;
    global Datetime endDate;
    global Decimal feeAmount;
    global String Id;
    global String name;
    global Decimal premium;
    global List<vlocity_ins.InsPolicy.InsPricingAdjustment> pricingAdjustments;
    global String productChildItemId;
    global String productSpecCode;
    global String productSpecId;
    global Decimal proratedFeeAmount;
    global Decimal proratedPremium;
    global Decimal proratedTaxAmount;
    global Decimal taxAmount;
    global Decimal totalAmount;
    global Decimal totalProratedAmount;
    global Decimal totalTaxFeeAmount;
    global InsCoverage() {

    }
    global InsCoverage(String recordId, String coverageName, Decimal price, String prodId, Map<String,Object> attrValues, Map<String,Object> otherInfo) {

    }
    global void addPricingAdjustment(vlocity_ins.InsPolicy.InsPricingAdjustment pricingAdjustment) {

    }
}
global class InsInsuredItem {
    global Map<String,Object> additionalInfo;
    global Map<String,Object> attributeSelectedValues;
    global List<vlocity_ins.InsPolicy.InsInsuredItem> childInsuredItems;
    global List<vlocity_ins.InsPolicy.InsCoverage> coverages;
    global String currencyCode;
    global String currencySymbol;
    global Decimal feeAmount;
    global String Id;
    global String instanceKey;
    global List<vlocity_ins.InsPolicy.InsInsuredRel> insuredRels;
    global Datetime lastModifiedDate;
    global String name;
    global String parentProductId;
    global Decimal premium;
    global List<vlocity_ins.InsPolicy.InsPricingAdjustment> pricingAdjustments;
    global vlocity_ins.InsPolicy.InsInsuredParty primaryInsuredParty;
    global String productChildItemId;
    global String productSpecCode;
    global String productSpecId;
    global Decimal proratedFeeAmount;
    global Decimal proratedPremium;
    global Decimal proratedTaxAmount;
    global Decimal taxAmount;
    global Decimal totalAmount;
    global Decimal totalProratedAmount;
    global Decimal totalSumInsured;
    global Decimal totalTaxFeeAmount;
    global InsInsuredItem() {

    }
    global InsInsuredItem(String recordId, String insuredName, String insuredInstanceKey, Decimal price, String prodId, Map<String,Object> attrValues, Map<String,Object> otherInfo) {

    }
    global void addChildInsuredItem(vlocity_ins.InsPolicy.InsInsuredItem insuredItem) {

    }
    global void addCoverage(vlocity_ins.InsPolicy.InsCoverage insuredCoverage) {

    }
    global void addInsuredRel(vlocity_ins.InsPolicy.InsInsuredRel insuredRel) {

    }
    global void addPricingAdjustment(vlocity_ins.InsPolicy.InsPricingAdjustment pricingAdjustment) {

    }
    global void setChildItems(List<vlocity_ins.InsPolicy.InsInsuredItem> childItems) {

    }
    global void setCoverages(List<vlocity_ins.InsPolicy.InsCoverage> insuredCoverages) {

    }
    global void setInsuredRels(List<vlocity_ins.InsPolicy.InsInsuredRel> insuredRelList) {

    }
    global void setLastModifiedDate(Datetime modDate) {

    }
    global void setPrimaryParty(vlocity_ins.InsPolicy.InsInsuredParty primary) {

    }
}
global class InsInsuredParty {
    global Map<String,Object> additionalInfo;
    global Map<String,Object> attributeSelectedValues;
    global List<vlocity_ins.InsPolicy.InsCoverage> coverages;
    global String currencyCode;
    global String currencySymbol;
    global Decimal feeAmount;
    global String Id;
    global String instanceKey;
    global Datetime lastModifiedDate;
    global String name;
    global String parentProductId;
    global String partyId;
    global Decimal premium;
    global List<vlocity_ins.InsPolicy.InsPricingAdjustment> pricingAdjustments;
    global String productChildItemId;
    global String productSpecCode;
    global String productSpecId;
    global Decimal proratedFeeAmount;
    global Decimal proratedPremium;
    global Decimal proratedTaxAmount;
    global Decimal taxAmount;
    global Decimal totalAmount;
    global Decimal totalProratedAmount;
    global Decimal totalSumInsured;
    global Decimal totalTaxFeeAmount;
    global InsInsuredParty() {

    }
    global InsInsuredParty(String recordId, String insuredName, String insuredInstanceKey, Decimal price, String personId, String prodId, Map<String,Object> attrValues, Map<String,Object> otherInfo) {

    }
    global void addCoverage(vlocity_ins.InsPolicy.InsCoverage insuredCoverage) {

    }
    global void addPricingAdjustment(vlocity_ins.InsPolicy.InsPricingAdjustment pricingAdjustment) {

    }
    global void setCoverages(List<vlocity_ins.InsPolicy.InsCoverage> insuredCoverages) {

    }
    global void setLastModifiedDate(Datetime modDate) {

    }
}
global class InsInsuredRel {
    global Map<String,Object> additionalInfo;
    global Map<String,Object> attributeSelectedValues;
    global Map<String,Object> childAttributeSelectedValues;
    global String childId;
    global String childInstanceKey;
    global String childProductCode;
    global String childProductSpecId;
    global String parentId;
    global String parentInstanceKey;
    global InsInsuredRel() {

    }
    global InsInsuredRel(String parInsance, String childInstance, Map<String,Object> attrValues) {

    }
    global InsInsuredRel(String parInstance, String parKey, String childInstance, String childKey, Map<String,Object> attrValues, Map<String,Object> otherInfo) {

    }
    global void setChildAttributeSelectedValues(Map<String,Object> attrValues) {

    }
    global void setChildId(String cId) {

    }
    global void setChildProductCode(String prodCode) {

    }
    global void setParentId(String pId) {

    }
}
global class InsPricingAdjustment {
    global Map<String,Object> additionalInfo;
    global String adjustmentType;
    global Decimal amount;
    global String applicableItemType;
    global String Id;
    global Boolean isRefundable;
    global String priceListEntryId;
    global String priceListEntryName;
    global String transactionId;
    global InsPricingAdjustment() {

    }
}
global class InsRevenue implements System.Comparable {
    global Decimal amount;
    global String Id;
    global vlocity_ins.InsPolicy.InsTransaction insTransaction;
    global Date revenueDate;
    global Boolean toDelete;
    global Decimal totalEarnedRevenue;
    global Decimal totalUnearnedRevenue;
    global InsRevenue() {

    }
    global Integer compareTo(Object compareTo) {
        return null;
    }
}
global class InsTransaction {
    global Map<String,Object> additionalInfo;
    global Decimal amount;
    global Decimal feeAmount;
    global String Id;
    global String name;
    global Datetime postDate;
    global Decimal taxAmount;
    global Decimal totalAmount;
    global Datetime transactionDate;
    global String transactionNumber;
    global String type;
    global InsTransaction() {

    }
}
}

/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class ItemWrapper {
    global String actionValue {
        get;
    }
    global List<String> errors {
        get;
        set;
    }
    global Boolean hasChildren;
    global Integer ident;
    global Integer indent;
    global Boolean isConfigurable {
        get;
        set;
    }
    global Boolean isExpanded {
        get;
        set;
    }
    global Boolean isQualified {
        get;
        set;
    }
    global SObject itemSObject {
        get;
        set;
    }
    global String JSONAttribute {
        get;
        set;
    }
    global String JSONNode {
        get;
        set;
    }
    global String lineNumber {
        get;
        set;
    }
    global Decimal modifNum {
        get;
        set;
    }
    global String namespace;
    global Boolean orderActive {
        get;
        set;
    }
    global Id productId {
        get;
    }
    global String provisioningStatus {
        get;
    }
    global Object sFilter {
        get;
        set;
    }
    global String sQuery {
        get;
        set;
    }
    global String status;
    global ItemWrapper(Asset asset) {

    }
    global ItemWrapper(PricebookEntry pbEntry) {

    }
    global ItemWrapper(SObject itemSObject) {

    }
    global String getBillingAccountName() {
        return null;
    }
    global Boolean getHasErrors() {
        return null;
    }
    global Id getId() {
        return null;
    }
    global Integer getIndent() {
        return null;
    }
    global String getJSONErrors() {
        return null;
    }
    global Id getParentId() {
        return null;
    }
    global String getPremisesName() {
        return null;
    }
    global String getProductCode() {
        return null;
    }
    global String getProductName() {
        return null;
    }
    global Decimal getQuantity() {
        return null;
    }
    global String getServiceAccountName() {
        return null;
    }
    global String getStatus() {
        return null;
    }
    global Boolean gethasChildren() {
        return null;
    }
    global Boolean getisQualified() {
        return null;
    }
    global void setHasChildren(Boolean haschild) {

    }
    global void setIndent(Integer num) {

    }
    global void setStatus() {

    }
    global void setisQualified(Boolean isQual) {

    }
    global String toJSON() {
        return null;
    }
}

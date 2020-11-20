/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global virtual class VFCustomChildListController extends vlocity_ins.VFPageWithPaginatorControllerBase {
    global Boolean bCanAssocChild {
        get;
        set;
    }
    global Boolean bCanAssocNewChild {
        get;
        set;
    }
    global Boolean bCanRemoveChild {
        get;
        set;
    }
    global Boolean bHideLink {
        get;
        set;
    }
    global SObject currentRecord {
        get;
        set;
    }
    global Map<String,String> fieldLabelMap {
        get;
    }
    global List<String> fieldList {
        get;
    }
    global Integer pSize {
        get;
        set;
    }
    global String relSourceFldVal {
        get;
        set;
    }
    global String relTargetFldVal {
        get;
        set;
    }
    global String sAssocChildLabel {
        get;
        set;
    }
    global String sAssocChildPopUpPageUrl {
        get;
        set;
    }
    global String sAssocNewChildLabel {
        get;
        set;
    }
    global String sAssocNewChildPopUpPageUrl {
        get;
        set;
    }
    global String sChildObjectName {
        get;
        set;
    }
    global String sChildRelObjectName {
        get;
        set;
    }
    global String sControllingField {
        get;
        set;
    }
    global String sDrilldownField {
        get;
        set;
    }
    global String sFieldSetName {
        get;
        set;
    }
    global String sHyperlinkFields {
        get;
        set;
    }
    global String sHyperlinkURL {
        get;
        set;
    }
    global List<String> sHyperlinkURLValueList {
        get;
        set;
    }
    global String sNamespacePrefixList {
        get;
        set;
    }
    global String sParentObjectLabel {
        get;
        set;
    }
    global String sRemoveChildQuery {
        get;
        set;
    }
    global ApexPages.StandardController stdController {
        get;
        set;
    }
    global String sWhereClause {
        get;
        set;
    }
    global List<vlocity_ins.VFCustomChildListController.WrapSObject> wrapRecordList;
    global VFCustomChildListController() {

    }
    global virtual void BuildwrapRecordList() {

    }
    global virtual void deleteRelationship() {

    }
    global virtual Boolean getCanAssociate() {
        return null;
    }
    global virtual Boolean getCanAssociateNew() {
        return null;
    }
    global virtual Boolean getCanDelete() {
        return null;
    }
    global List<vlocity_ins.VFCustomChildListController.WrapSObject> getwrapRecordList() {
        return null;
    }
global class WrapSObject {
    global String hyperlinkURL {
        get;
    }
    global SObject so {
        get;
    }
    global WrapSObject() {

    }
}
}

/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global abstract class OrderDomainServiceImpl extends vlocity_ins.DomainServiceImpl implements vlocity_ins.OrderDomainService {
    global void addFulfilmentRequestDecompRelations(vlocity_ins.XOMOrderDomainObject sourceOrder, List<vlocity_ins.XOMOrderDomainObject> destFulfilmentRequests) {

    }
    global void addFulfilmentRequests(List<vlocity_ins.XOMOrderDomainObject> orderObjs) {

    }
    global void addObject(vlocity_ins.XOMOrderDomainObject orderObj, Boolean includeChildren) {

    }
    global override vlocity_ins.DomainObject createObject(Schema.SObjectType objType) {
        return null;
    }
    global void deleteObject(vlocity_ins.XOMOrderDomainObject orderObj, Boolean includeChildren) {

    }
    global virtual List<vlocity_ins.XOMOrderDomainObject> getFulfilmentRequests(Set<Id> orderObjIds, Boolean includeChildren) {
        return null;
    }
    global virtual vlocity_ins.XOMOrderDomainObject getObject(Id orderObjId, Boolean includeChildren) {
        return null;
    }
    global virtual vlocity_ins.XOMOrderDomainObject getObject(Id orderObjId, Boolean includeChildren, Set<Id> childIdSet) {
        return null;
    }
    global virtual vlocity_ins.XOMOrderDomainObject getObject(Id orderObjId, Boolean includeChildren, Set<Id> childIdSet, List<String> orderFields) {
        return null;
    }
    global virtual vlocity_ins.XOMOrderDomainObject getObject(Id orderObjId, Boolean includeChildren, Set<Id> childIdSet, List<String> orderFields, List<String> orderItemFields) {
        return null;
    }
    global virtual vlocity_ins.XOMOrderDomainObject getObject(Id orderObjId, Boolean includeChildren, Set<Id> childIdSet, List<String> orderFields, List<String> orderItemFields, Boolean isProductHierarchyLoadingEnabled) {
        return null;
    }
    global virtual List<vlocity_ins.XOMOrderDomainObject> getObjects(Set<Id> orderObjId, Boolean includeChildren) {
        return null;
    }
    global List<vlocity_ins.XOMOrderDomainObject> loadFulfilmentRequests(Id orderObjId) {
        return null;
    }
    global virtual List<vlocity_ins.XOMOrderDomainObject> loadFulfilmentRequests(Id orderObjId, Set<Id> childIdSet) {
        return null;
    }
    global void updateObject(vlocity_ins.XOMOrderDomainObject orderObj, Boolean includeChildren) {

    }
    global void updateOrderStatus(vlocity_ins.XOMOrderDomainObject orderObj, String status) {

    }
}

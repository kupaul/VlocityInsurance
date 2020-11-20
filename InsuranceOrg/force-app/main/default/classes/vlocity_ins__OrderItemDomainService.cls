/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global interface OrderItemDomainService extends vlocity_ins.DomainService {
    void addFulfilmentRequestLines(List<vlocity_ins.XOMOrderDomainObject> param0);
    void addInvToAssetDecompRelation(List<vlocity_ins.XOMOrderDomainObject> param0);
    void addObject(vlocity_ins.XOMOrderItemDomainObject param0, Boolean param1);
    void deleteObject(vlocity_ins.XOMOrderItemDomainObject param0, Boolean param1);
    List<vlocity_ins.XOMOrderItemDomainObject> getByOrderId(Id param0, Boolean param1);
    vlocity_ins.XOMOrderItemDomainObject getObject(Id param0, Boolean param1);
    List<vlocity_ins.XOMOrderItemDomainObject> getObjects(Set<Id> param0, Boolean param1);
    void updateFulfilmentRequestLineLinenumbers(List<vlocity_ins.XOMOrderDomainObject> param0);
    void updateInventoryIdInFulfilmentRequestLines(List<vlocity_ins.XOMOrderDomainObject> param0);
    void updateObject(vlocity_ins.XOMOrderItemDomainObject param0, Boolean param1);
}

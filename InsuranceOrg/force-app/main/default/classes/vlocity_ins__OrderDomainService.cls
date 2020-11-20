/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global interface OrderDomainService extends vlocity_ins.DomainService {
    void addFulfilmentRequestDecompRelations(vlocity_ins.XOMOrderDomainObject param0, List<vlocity_ins.XOMOrderDomainObject> param1);
    void addFulfilmentRequests(List<vlocity_ins.XOMOrderDomainObject> param0);
    void addObject(vlocity_ins.XOMOrderDomainObject param0, Boolean param1);
    void deleteObject(vlocity_ins.XOMOrderDomainObject param0, Boolean param1);
    vlocity_ins.XOMOrderDomainObject getObject(Id param0, Boolean param1);
    List<vlocity_ins.XOMOrderDomainObject> getObjects(Set<Id> param0, Boolean param1);
    List<vlocity_ins.XOMOrderDomainObject> loadFulfilmentRequests(Id param0);
    void updateObject(vlocity_ins.XOMOrderDomainObject param0, Boolean param1);
    void updateOrderStatus(vlocity_ins.XOMOrderDomainObject param0, String param1);
}

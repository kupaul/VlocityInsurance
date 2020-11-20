/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class VlocityOrderDomainObject {
    global String accountId {
        get;
        set;
    }
    global String accountName {
        get;
        set;
    }
    global Map<String,Object> fields {
        get;
        set;
    }
    global String firstVersionOrderId {
        get;
        set;
    }
    global String fulfilmentStatus {
        get;
        set;
    }
    global Boolean isActiveOrderVersion {
        get;
        set;
    }
    global List<vlocity_ins.VlocityPromoDomainObject> orderAppliedPromotions {
        get;
        set;
    }
    global Id orderId {
        get;
        set;
    }
    global List<vlocity_ins.VlocityOrderProductRelationshipObject> orderItemRelationships {
        get;
        set;
    }
    global List<vlocity_ins.VlocityOrderItemDomainObject> orderItems {
        get;
        set;
    }
    global List<vlocity_ins.VlocityPricingObject> orderPricings {
        get;
        set;
    }
    global String orderReferenceNumber {
        get;
        set;
    }
    global String orderStatus {
        get;
        set;
    }
    global String supersededOrderId {
        get;
        set;
    }
    global String supplementalAction {
        get;
        set;
    }
    global VlocityOrderDomainObject() {

    }
}

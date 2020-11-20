/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global interface ITrigger {
    void afterDelete(SObject param0);
    void afterInsert(SObject param0);
    void afterUpdate(SObject param0, SObject param1);
    void andFinally();
    void beforeDelete(SObject param0);
    void beforeInsert(SObject param0);
    void beforeUpdate(SObject param0, SObject param1);
    void bulkAfter();
    void bulkBefore();
}

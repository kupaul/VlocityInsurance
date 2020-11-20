/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class TelcoSOQLQuery {
    global String constantVal;
    global String inLVal;
    global Set<Id> inRVal;
    global vlocity_ins.TelcoSOQLQuery.QUERY_LOGICAL_OPERATOR logOpp;
    global vlocity_ins.TelcoSOQLQuery.QUERY_TYPE qType;
    global TelcoSOQLQuery(vlocity_ins.TelcoSOQLQuery.QUERY_TYPE qType, Object rVal, String lVal) {

    }
    global TelcoSOQLQuery(vlocity_ins.TelcoSOQLQuery.QUERY_TYPE qType, String val, vlocity_ins.TelcoSOQLQuery.QUERY_LOGICAL_OPERATOR logOpp) {

    }
    global TelcoSOQLQuery(vlocity_ins.TelcoSOQLQuery.QUERY_TYPE qType, Object rVal, String lVal, vlocity_ins.TelcoSOQLQuery.QUERY_LOGICAL_OPERATOR logOpp) {

    }
global enum QUERY_LOGICAL_OPERATOR {AND_OPP, OR_OPP}
global enum QUERY_TYPE {CONSTANT, EQUAL_TO_OP, IN_OP}
}

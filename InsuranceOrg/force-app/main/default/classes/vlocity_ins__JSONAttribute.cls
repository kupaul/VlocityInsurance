/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class JSONAttribute extends vlocity_ins.JSONRecord {
    global Boolean attributeConfigurable;
    global String attributeId;
    global Boolean autocomplete;
    global Boolean cloneable;
    global String code;
    global String customTemplate;
    global String dataType;
    global String description;
    global Boolean disabled;
    global Boolean filterable;
    global String formatMask;
    global Boolean hasRules;
    global Boolean hidden;
    global String inputType;
    global Boolean isConfigurable;
    global Boolean isNotTranslatable;
    global Boolean isRatingAttribute;
    global static String JSON_KEY_USER_VALUES;
    global String label;
    global Decimal max;
    global Integer maxlength;
    global Decimal min;
    global Integer minlength;
    global Boolean multiselect;
    global String pattern;
    global String placeholder;
    global Boolean readonly;
    global Boolean required;
    global List<vlocity_ins.JSONRule> rules;
    global Decimal step;
    global vlocity_ins.JSONAttribute.JSONUserValues userValues;
    global List<vlocity_ins.JSONAttribute.JSONValue> values;
    global Boolean hasUserValues() {
        return null;
    }
global class JSONCheckboxUserValues extends vlocity_ins.JSONAttribute.JSONUserValues {
    global List<Object> values;
    global override Boolean hasUserValues() {
        return null;
    }
}
global class JSONMultiUserValues extends vlocity_ins.JSONAttribute.JSONUserValues {
    global List<Object> values;
    global override Boolean hasUserValues() {
        return null;
    }
}
global class JSONSingleUserValue extends vlocity_ins.JSONAttribute.JSONUserValues {
    global Object value;
    global override Boolean hasUserValues() {
        return null;
    }
}
global virtual class JSONUserValues {
    global JSONUserValues() {

    }
    global virtual Boolean hasUserValues() {
        return null;
    }
}
global class JSONValue implements System.Comparable {
    global Boolean defaultSelected;
    global Object defaultValue;
    global Boolean disabled;
    global Integer displaySequence;
    global String id;
    global String label;
    global String name;
    global Boolean readonly;
    global List<vlocity_ins.JSONRule> rules;
    global Boolean selected;
    global Object value;
}
}

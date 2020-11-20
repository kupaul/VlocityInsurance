/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class SegmentElement {
    global String ActionCode {
        get;
        set;
    }
    global Datetime AddedDate {
        get;
        set;
    }
    global String AddedStory {
        get;
        set;
    }
    global Boolean Assigned {
        get;
        set;
    }
    global String CategoryCode {
        get;
        set;
    }
    global String CategoryName {
        get;
        set;
    }
    global List<vlocity_ins.SegmentElement> ChildSegmentElements {
        get;
        set;
    }
    global String Color {
        get;
        set;
    }
    global String CreatedByName {
        get;
        set;
    }
    global Decimal DispSequence {
        get;
        set;
    }
    global Boolean IsDynamic {
        get;
        set;
    }
    global Boolean LockedFlg {
        get;
        set;
    }
    global String Name {
        get;
        set;
    }
    global Datetime RemovedDate {
        get;
        set;
    }
    global Boolean RemovedFlag {
        get;
        set;
    }
    global String RemovedStory {
        get;
        set;
    }
    global String SegmentCode {
        get;
        set;
    }
    global String SegmentData {
        get;
        set;
    }
    global String SegmentValue {
        get;
        set;
    }
    global String UIType {
        get;
        set;
    }
    global SegmentElement(String name, String data, Datetime adate, String value, String segcode, String uiType, String catcode, String catname, Decimal dispsequence, Boolean lockedFlg, String addedStory, String removedStory, Datetime rDate, String createdByName) {

    }
    global SegmentElement(String name, String data, Datetime adate, String value, String segcode, String uiType, String catcode, String catname, Decimal dispsequence, Boolean lockedFlg, String addedStory, String removedStory, Datetime rDate, Boolean assigned, List<vlocity_ins.SegmentElement> childSegmentElements) {

    }
}

/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class OrchestrationPlanControllerExtension {
    global OrchestrationPlanControllerExtension() {

    }
    global OrchestrationPlanControllerExtension(ApexPages.StandardController controller) {

    }
    @RemoteAction
    global static vlocity_ins.OrchestrationPlanControllerExtension.OrchestrationItemView getOrchestrationItem(Id itemId) {
        return null;
    }
    @RemoteAction
    global static vlocity_ins.OrchestrationPlanControllerExtension.OrchestrationPlanView getOrchestrationPlan(Id planId) {
        return null;
    }
    @RemoteAction
    global static String getOrchestrationPlanId(String contextId) {
        return null;
    }
    @RemoteAction
    global static String getOrchestrationPlanName(String planId) {
        return null;
    }
global class CalendarInfo {
    global List<BusinessHours> businessHours;
    global List<Holiday> holidays;
    global CalendarInfo() {

    }
}
global class OrchestrationItemView {
    global Id additionalId;
    global String additionalName;
    global String customTaskExecutionUrl;
    global List<Id> deps;
    global String dueDate;
    global Id id;
    global String name;
    global Id orderId;
    global Map<String,Object> parameters;
    global Id planDefId;
    global String startDate;
    global String state;
    global String translatedState;
    global String type;
}
global class OrchestrationPlanView {
    global vlocity_ins.OrchestrationPlanControllerExtension.CalendarInfo calendarInfo;
    global List<vlocity_ins.OrchestrationPlanControllerExtension.OrchestrationItemView> items;
    global List<vlocity_ins.OrchestrationPlanControllerExtension.SwimlaneView> swimlanes;
    global String topicName;
}
global class SwimlaneView {
    global Id orderId;
    global String orderName;
    global Id planDefId;
    global String planDefName;
    global Integer showOrder;
    global String showOrderStr;
}
}

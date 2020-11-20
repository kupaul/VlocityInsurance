({
  doInit: function(component, event, helper) {
    helper.setColumns(component);
    helper.loadLogs(component);
  },
  loadMoreRecords: function(component, event, helper) {
    component.set("v.numRecords", component.get("v.numRecords") + 5);
    helper.loadLogs(component);
  },
  navigateToLog: function(component, event, helper) {
    helper.navigateToLog(component, event);
  }
});
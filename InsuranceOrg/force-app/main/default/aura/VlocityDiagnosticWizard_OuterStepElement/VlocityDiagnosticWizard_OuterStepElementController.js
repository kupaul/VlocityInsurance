/**
 * The VlocityDiagnosticWizard_OuterStepElement is the wrapper for the Group steps. Here we will display all the child elements from this group. 
 * */
({
  completeAction: function (component, event, helper) {
    var p = component.get("v.parent");
    p.completeAction();
  },
  preCheckStep: function (component, event, helper) {
    var p = component.get("v.parent");
    p.preCheckStep();
  },
  openInstructionModal: function (component, event, helper) {
    var p = component.get("v.parent");
    p.openInstructionModal();
  },
  openCheckResult: function (component, event, helper) {
    var p = component.get("v.parent");
    p.openCheckResult();
  },
  openNotesModal: function (component, event, helper) {
    var p = component.get("v.parent");
    p.openNotesModal();
  },
  toggleDisplayLogs: function (component, event, helper) {
    component.set("v.displayLogs", !component.get("v.displayLogs"));
  },
  toggleShowChildSteps: function (component, event, helper) {
    component.set("v.showChildSteps", !component.get("v.showChildSteps"));
  }
});
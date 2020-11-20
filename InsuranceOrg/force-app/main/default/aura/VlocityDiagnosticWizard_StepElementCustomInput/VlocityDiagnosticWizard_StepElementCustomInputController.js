({
  updateCustomInput: function(component, event, helper) {
    var gp = component.get("v.grandparent");
    gp.updateCustomInput();
  },
  toggleExpandCustomInput: function(component, event, helper) {
    component.set("v.expandCustomInput", !component.get("v.expandCustomInput"));
  }
});
({
  /**
   * Logic on component init (retrieves UpgradeStep records)
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  doInit: function(component, event, helper) {
    helper.getDiagnosticSteps(component);
  },
  /**
   * Logic to toggle the display of the advanced filters 
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  toggleShowFilters: function(component, event, helper) {
    helper.toggleShowFilters(component);
  },
  /**
   * Logic to toggle the display of all steps
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  toggleShowAllSteps: function(component, event, helper) {
    helper.toggleShowAllSteps(component);
  },
  /**
   * Logic to recreate all steps present in ...StepCreator classes the org
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  createNewSteps: function(component, event, helper) {
    helper.createNewSteps(component);
  },

  onModalEvent: function(component, event, helper) {
    var modalParams = event.getParams().modalParams;
    if (!modalParams) return;

    component.set("v.modalParams", modalParams);
    
    const modalTypes = {
      instruction: "v.showInstructionModal",
      notes: "v.showNotesModal"
    };

    if (modalTypes[modalParams.modalType])
      component.set(modalTypes[modalParams.modalType], true);

    event.stopPropagation();
  }
});
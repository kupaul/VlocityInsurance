({
  /**
   * Logic on init
   * @param {*} component
   * @param {*} event
   * @param {*} helper
   */

  doInit: function(component, event, helper) {
    helper.onInit(component);
    helper.setRecordTagsFromList(component);
  },

  /**
   * Verifies that the step is complete
   * @param {*} component
   * @param {*} event
   * @param {*} helper
   */
  preCheckStep: function(component, event, helper) {
    helper.preCheckStep(component);
  },

  /**
   * Logic that happens when the recordTagsList attribute is updated
   * @param {*} component
   * @param {*} event
   * @param {*} helper
   */
  onRecordTagsListChange: function(component, event, helper) {
    helper.setRecordTagsFromList(component);
  },

  /**
   * Completes given step action when the action button is pressed
   * @param {*} component
   * @param {*} event
   * @param {*} helper
   */
  completeAction: function(component, event, helper) {
    helper.completeAction(component);
  },

  /**
   * Logic that happens when the record is updated on the front-end
   * @param {*} component
   * @param {*} event
   * @param {*} helper
   */
  onRecordChange: function(component, event, helper) {
    helper.setRecordStatus(component);
    helper.notifyParentRecord(component);
  },

  /**
   * Logic when recordStatus is updated
   * @param {*} component
   * @param {*} event
   * @param {*} helper
   */
  onRecordStatusChange: function(component, event, helper) {
    helper.refreshDisplayStep(component);
    helper.refreshActionBtn(component);
  },

  /**
   * Logic when filters is updated
   * @param {*} component
   * @param {*} event
   * @param {*} helper
   */
  onFiltersChange: function(component, event, helper) {
    helper.refreshDisplayStep(component);
  },

  /**
   * Handles a captured update event called by a child component
   * @param {*} component
   * @param {*} event
   * @param {*} helper
   */
  onChildUpdateEvent: function(component, event, helper) {
    helper.onChildUpdateEvent(component, event);
  },

  /**
   * Logic to save inputted notes on the server
   * @param {*} component
   * @param {*} event
   * @param {*} helper
   */
  saveNotes: function(component, event, helper) {
    helper.saveNotes(component);
  },

  /**
   * Opens the CheckResultUrl field of the record in a new window
   * @param {*} component
   * @param {*} event
   * @param {*} helper
   */
  openCheckResult: function(component, event, helper) {
    helper.openCheckResult(component);
  },

  /**
   * Logic to open the instruction modal
   * @param {*} component
   * @param {*} event
   * @param {*} helper
   */
  openInstructionModal: function(component, event, helper) {
    helper.openModal(component, 'instruction');
  },

  /**
   * Logic to open the notes modal
   * @param {*} component
   * @param {*} event
   * @param {*} helper
   */
  openNotesModal: function(component, event, helper) {
    helper.openModal(component, 'notes');
  },

  /**
   * Logic when custom input field is updated
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  updateCustomInput: function(component, event, helper) {
    helper.updateCustomInput(component);
  }
});
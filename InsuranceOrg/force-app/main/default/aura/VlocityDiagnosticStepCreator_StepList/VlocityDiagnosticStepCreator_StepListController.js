({
  /**
   * Logic after scripts load (on init)
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  doInit: function (component, event, helper) {
    helper.loadSaveStateAndStepCreators(component);
    helper.loadTemplateNames(component);
  },

  /**
   * Logic when a generalEvent is captured
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  onEvent: function (component, event, helper) {
    var eventType = event.getParam("eventType"),
      eventValue = event.getParam("eventValue");

    switch (eventType) {
      case 'newStepEvent':
        helper.createNewStep(component, eventValue);
        break;
      case 'newPlanEvent':
        helper.selectStepCreator(component, true);
        break;
      case 'openPlanEvent':
        helper.selectStepCreator(component);
        break;
      case 'saveStaticResourceEvent':
        helper.saveStaticResource(component);
        break;
    };
  },

  /**
   * Logic performed when records attribute changes
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  onRecordsChange: function (component, event, helper) {
    helper.setStepElementIsExpanded(component);
    helper.updateSaveState(component);
  },

  /**
   * Displays JSON static resource file modal
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  showJSONModal: function (component, event, helper) {
    helper.showJSONModal(component);
    helper.updateSaveState(component);
  },

  /**
   * Deletes the given step from the event
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  destroyStep: function (component, event, helper) {
    helper.destroyStep(component, event);
  },

  /**
   * Copies the given step from the event
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  copyStep: function (component, event, helper) {
    helper.copyStep(component, event);
  },

  /**
   * Moves the selected step 1 position forward in the records List attribute
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  moveStepDown: function (component, event, helper) {
    helper.moveStepDown(component, event);
  },

  /**
   * Moves the selected step 1 position backward in the records List attribute
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  moveStepUp: function (component, event, helper) {
    helper.moveStepUp(component, event);
  },

  /**
   * Toggles the selected step's expandRecord value (using an event from a regular HTML Document object, not Aura:component)
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  toggleExpandRecordDoc: function (component, event, helper) {
      helper.toggleExpandRecord(component, event, false);
  },

  /**
   * Toggles the selected step's expandRecord value
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  toggleExpandRecord: function (component, event, helper) {
    helper.toggleExpandRecord(component, event, true);
  },

  togglePlanNameEditOpen: function (component, event, helper) {
    component.set("v.planNameEditOpen", !component.get("v.planNameEditOpen"));
  },

  /**
   * When the search bar is focused, display the plan dropdown
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  focusPlanSearchBar: function (component, event, helper) {
    helper.focusPlanSearchBar(component);
  },

  /**
   * When the search bar loses focus, hide the plan dropdown
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  blurPlanSearchBar: function (component, event, helper) {
    helper.blurPlanSearchBar(component);
    helper.updateSaveState(component);
  },

  /**
   * When enter key is pressed, open the plan in the search bar
   * @param {*} component 
   * @param {*} event 
   * @param {*} helper 
   */
  handleKeyUp: function (component, event, helper) {
    if (event.keyCode === 13) {
      helper.selectStepCreator(component);
    }
  },
});
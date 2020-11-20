({
	/**
	 * Sets attribute showModal to false (hides modal) on button press
	 * @param {*} component 
	 * @param {*} event 
	 * @param {*} helper 
	 */
	onCancelClick: function (component, event, helper) {
		component.set("v.showModal", false);
	},

	/**
	 * Copies attribute modalContent (from File Content textarea) to the clipboard on button presss
	 * @param {*} component 
	 * @param {*} event 
	 * @param {*} helper 
	 */
	onCopyClick: function (component, event, helper) {
		const modalContent = component.get("v.modalContent");
		VlocityDiagnosticWizard_Helpers.copyTextToClipboard(modalContent);
	},

	/**
	 * Fires event to parent VlocityDiagnosticStepCreator_StepList component to save the modal content as a static resource
	 * @param {*} component 
	 * @param {*} event 
	 * @param {*} helper 
	 */
	onSaveClick: function (component, event, helper) {
		var generalEvent = component.getEvent("generalEvent");
		generalEvent.setParams({
			eventType: "saveStaticResourceEvent"
		});
		generalEvent.fire();
	},

	/**
	 * Wipes the current error message to hide alert
	 * @param {*} component 
	 * @param {*} event 
	 * @param {*} helper 
	 */
	wipeErrorMessage: function (component, event, helper) {
		component.set("v.errorMessage", "");
	}
})
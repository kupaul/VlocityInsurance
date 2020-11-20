({
	handleCreateNewStep: function (component, event, helper) {
		const selectedMenuItemValue = event.getParam("value") || 'getNewBlankStep';
		var newStepEvent = component.getEvent("generalEvent");
		newStepEvent.setParams({
			eventType: "newStepEvent",
			eventValue: selectedMenuItemValue
		});
		newStepEvent.fire();
	},
})
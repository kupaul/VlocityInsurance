({
	setProgressBarValue: function (component, event, helper) {
		const completedRecords = component.get("v.completedRecords"),
			numRecords = component.get("v.numRecords");
		component.set("v.progressBarValue", Math.round(100 * completedRecords / numRecords));
	}
})
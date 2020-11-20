({
	/**
	 * Sets filteredPlans based on planName input value
	 * @param {*} component 
	 * @param {*} event 
	 * @param {*} helper 
	 */
	onPlanSearchChange: function (component, event, helper) {
		var planSearch = component.get("v.planSearch"),
			plans = component.get("v.plans"),
			filteredPlans = plans;

		if (planSearch) planSearch = planSearch.trim();

		if (planSearch) {
			filteredPlans = plans.filter(function (plan) {
				return plan.Name.toUpperCase().indexOf(planSearch.toUpperCase()) != -1;
			});
		}

		component.set("v.filteredPlans", filteredPlans);
	},

	/**
	 * Sets the planSearch attribute and opens the given plan when a list item is clicked
	 * @param {*} component 
	 * @param {*} event 
	 * @param {*} helper 
	 */
	selectPlan: function (component, event, helper) {
		var planSearch = event.currentTarget.dataset.value;
		component.set("v.planSearch", planSearch);
		var generalEvent = component.getEvent("generalEvent");
		generalEvent.setParams({eventType:"openPlanEvent"});
		generalEvent.fire();
	},

	/**
	 * Fires a "newPlanEvent" to open a new plan
	 * @param {*} component 
	 * @param {*} event 
	 * @param {*} helper 
	 */
	selectNewPlan: function (component, event, helper) {
		var generalEvent = component.getEvent("generalEvent");
		generalEvent.setParams({eventType:"newPlanEvent"});
		generalEvent.fire();
	}
})
({
		render: function(component, helper) {
			var result = this.superRender(),
			value = component.get("v.progressBarValue"),
			progressBarElement = result[0].querySelector("#progressBarElement"),
			progressBarStyle = "width:" + value + "%;";

			progressBarElement.setAttributeNS(null, "style", progressBarStyle);

			return result;
		},
		rerender: function(component, helper) {
			var value = component.get("v.progressBarValue"),
			progressBarElement = component.getElement().querySelector("#progressBarElement"),
			progressBarStyle = "width:" + value + "%;";

			this.superRerender();
			progressBarElement.setAttributeNS(null, "style", progressBarStyle);
		}
})
({
	onJSONTextAreaBlur : function(component, event, helper) {

		//Check if text area value parses into JSON
		const jsonString = event.getSource().get("v.value");
		var isJSON = true;
		if (jsonString) {
			try {
				var o = JSON.parse(jsonString);
				if (!o || typeof o !== "object") {
					isJSON = false;
					event.getSource().setCustomValidity("Value parses into type: " + typeof o + ", needs to parse into type object.");
					event.getSource().reportValidity();
				}
			} catch (err) {
				isJSON = false;
				event.getSource().setCustomValidity("Value does not parse into a JSON, please fix.");
				event.getSource().reportValidity();
			}
		}

		//reset validity if ok
		if (isJSON) {
			event.getSource().setCustomValidity("");
			event.getSource().reportValidity();
		}
	}
})
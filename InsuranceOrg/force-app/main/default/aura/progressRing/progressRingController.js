({
  updateView: function(component) {
    var recordStatus = component.get("v.recordStatus");
    var value = 0,
      iconName = "utility:dash",
      color = "",
      loading = recordStatus === "In Progress";

    switch (recordStatus) {
      case "Complete":
        value = 99.9;
        iconName = "utility:check";
        color = "slds-progress-ring_complete";
        break;
      case "Failed":
        value = 99.9;
        iconName = "utility:close";
        color = "slds-progress-ring_expired";
        break;
      case "Warning":
        value = 99.9;
        color = "slds-progress-ring_warning";
        break;
      case "Critical":
        value = 99.9;
        iconName = "utility:topic";
        color = "slds-progress-ring_expired";
    }

    var settings = {
      value: value,
      iconName: iconName,
      color: color,
      loading: loading,
      altText: recordStatus
    };
    component.set("v.progressRingSettings", settings);
    component.set("v.value", settings.value);
  }
});
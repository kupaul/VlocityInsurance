({
  toggleTagValue: function(component, event, helper) {
    var tag = event.getSource().get("v.value");
    var filtersList = component.get("v.filtersList");
    var tagsMap = new Map(filtersList);
    if (tagsMap.has(tag)) tagsMap.set(tag, !tagsMap.get(tag));
    filtersList = Array.from(tagsMap);
    component.set("v.filtersList", filtersList);
  },
  toggleShowAdvancedFilters: function(component, event, helper) {
    component.set(
      "v.showAdvancedFilters",
      !component.get("v.showAdvancedFilters")
    );
  }
});
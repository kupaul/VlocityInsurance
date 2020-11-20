({
  /**
   * Calls controller's Apex method to query UpgradeStep records, and sets the records attribute
   * @param {*} component
   */
  getDiagnosticSteps: function (component) {
    var wizardType = component.get("v.wizardType"),
      action = component.get("c.getDiagnosticSteps");

    action.setParams({payload: wizardType});

    action.setCallback(this, function (result) {
      var state = result.getState();
      if (state === "SUCCESS") {
        const records = result.getReturnValue().map(item => {
            if(item.UpgradeSteps__r){
                item.UpgradeSteps__r.forEach(step=>step.IsShown = true);
            }
            return item;
        });
            
        component.set("v.records", records);
        console.log(records.length + " records loaded.");
        this.getRecordTags(component);
      } else {
        console.warn('No records retrieved due to server-side action state: ' + state);
      }
    });
    $A.enqueueAction(action);
  },
  /**
   * Calls controller's Apex method to upsert all defined steps, then refreshes the lightning component
   * @param {*} component
   */
  createNewSteps: function (component) {
    var action = component.get("c.upsertAllPlans");
    action.setCallback(this, function (result) {
      var state = result.getState();
      if (state === "SUCCESS") {
        console.log("Step creation complete");

        try {
          $A.get("e.force:refreshView").fire();
        } catch (error) {
          console.error("Refresh Error:", error);

          component.set(
            "v.modalMessage",
            "Please refresh the page to view the updated steps."
          );
          component.set("v.showRefreshModal", true);
        }
      } else if (state === "ERROR") {
        var errors = result.getError();
        var message =
          errors && Array.isArray(errors) && errors.length > 0 ?
          "Step creation failed, please fix and then refresh this page to try again. Error: " +
          errors[0].message :
          "Step creation failed, please fix and then refresh this page to try again. Unknown error.";
        console.warn(message);
        component.set("v.modalMessage", message);
        component.set("v.showRefreshModal", true);
      } else {
        var message =
          "Step creation failed, please fix and then refresh this page to try again. Unknown error.";
        console.warn(message);
        component.set("v.modalMessage", message);
        component.set("v.showRefreshModal", true);
      }
    });
    $A.enqueueAction(action);
  },
  /**
   * builds list of available tags from records attribute
   * @param {*} component
   */
  getRecordTags: function (component) {
    let records = component.get("v.records");
    if (!records) return;

    // Create the tags list
    let recordTagsList = this.buildTags(records);

    component.set("v.recordTagsList", recordTagsList);
    this.buildFilters(component);
  },

  buildTags: function (records) {
    const ps = VlocityDiagnosticWizard_Helpers.cdStringToList;
    let recordTagsList = [];

    //get tags for each step
    for (let i = 0; i < records.length; i++) {
      let record = records[i];
      let recordTags = {
        id: record.Id,
        versionTags: ps(record.VersionIntroduced),
        featureTags: ps(record.Tags),
        priorityTags: ps(record.Priority),
        frequencyTags: ps(record.StepFrequency),
        typeTags: ps(record.Type),
        statusTags: ps(VlocityDiagnosticWizard_Helpers.getOverallStatus(record))
      };
      recordTagsList.push(recordTags);

      // If this has child elements, let's create those tags
      if(record.UpgradeSteps__r) {
        recordTagsList = recordTagsList.concat(this.buildTags(record.UpgradeSteps__r));
      }
    }

    return recordTagsList;
  },

  /**
   * Builds list of filters from record tags
   * @param {*} component
   */
  buildFilters: function (component) {
    var recordTagsList = component.get("v.recordTagsList");
    if (!recordTagsList) return;
    var versionTagsMap = new Map(),
      featureTagsMap = new Map(),
      frequencyTagsMap = new Map(),
      priorityTagsMap = new Map([
        ["Critical", false]
      ]),
      typeTagsMap = new Map(),
      statusTagsMap = new Map([
        ["Not Started", true],
        ["In Progress", true],
        ["Complete", false],
        ["Failed", true]
      ]),
      overrideTagsMap = new Map([
        ["showAllSteps", false]
      ]);

    const addTags = VlocityDiagnosticWizard_Helpers.addTagsToMap;

    for (var i = 0; i < recordTagsList.length; i++) {
      addTags(
        versionTagsMap,
        recordTagsList[i].versionTags
      );
      addTags(
        featureTagsMap,
        recordTagsList[i].featureTags
      );
      addTags(
        priorityTagsMap,
        recordTagsList[i].priorityTags
      );
      addTags(
        frequencyTagsMap,
        recordTagsList[i].frequencyTags
      );
      addTags(
        typeTagsMap,
        recordTagsList[i].typeTags.filter(type => type !== "Group")
      );
    }

    //Set Wizard Type
    var wizardType = component.get("v.wizardType");
    if (wizardType && frequencyTagsMap.has(wizardType)) {
      frequencyTagsMap.set(wizardType, true);
    }

    var filters = {
      versionTags: Array.from(versionTagsMap),
      featureTags: Array.from(featureTagsMap),
      frequencyTags: Array.from(frequencyTagsMap),
      priorityTags: Array.from(priorityTagsMap),
      typeTags: Array.from(typeTagsMap),
      statusTags: Array.from(statusTagsMap),
      overrideTags: Array.from(overrideTagsMap)
    };
    
    component.set("v.filters", filters);
  },
  /**
   * Toggles the showFilters Boolean aura attribute
   * @param {*} component
   */
  toggleShowFilters: function (component) {
    component.set("v.showFilters", !component.get("v.showFilters"));
  },

  /**
   * Logic to handle "Show All Steps" button press
   * @param {*} component
   */
  toggleShowAllSteps: function (component) {
    var filters = component.get("v.filters");
    filters.overrideTags[0][1] = !filters.overrideTags[0][1];
    if (filters.overrideTags[0][1]) {
      filters.statusTags = [
        ["Not Started", true],
        ["In Progress", true],
        ["Complete", true],
        ["Failed", true]
      ];
    } else {
      filters.statusTags = [
        ["Not Started", true],
        ["In Progress", true],
        ["Complete", false],
        ["Failed", true]
      ];
    }
    component.set("v.filters", filters);
  }
});
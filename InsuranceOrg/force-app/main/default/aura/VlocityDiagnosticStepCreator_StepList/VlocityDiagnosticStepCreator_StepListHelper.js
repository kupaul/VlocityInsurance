({
  /**
   * Retrieves template step menu items from VlocityDiagnosticWizard_StepTemplates static resource for the Create New Step ButtonIcon
   * @param {Aura.Component} component 
   */
  loadTemplateNames: function (component) {
    const templateMenuItems = VlocityDiagnosticWizard_StepTemplates.getTemplateMenuItems();
    component.set("v.templateMenuItems", templateMenuItems);
  },

  /**
   * Loads the Vlocity Step Creators save state, as well as the StepCreator JSON static resource values to edit
   * @param {Aura.Component} component 
   */
  loadSaveStateAndStepCreators: function (component) {
    const me = this,
      action = component.get("c.getSaveStateAndStepCreators");

    component.set("v.loading", true);

    action.setCallback(this, function (result) {

      var state = result.getState();

      if (state === "SUCCESS") {

        const output = result.getReturnValue();


        //set saveState attribute
        component.set("v.saveState", output.saveState);

        try {
          component.set("v.planSearch", JSON.parse(output.saveState.LogData).planName);
        } catch (e) {
          console.warn('Error parsing save state:' + e.message);
        }

        //set stepCreators attribute
        component.set("v.stepCreators", output.stepCreators);

        //set plans attribute
        var plans = [];
        output.stepCreators.forEach(function (stepCreator) {
          if (stepCreator && stepCreator.plan && stepCreator.plan.Name) plans.push(stepCreator.plan);
        });

        plans.sort(function (a, b) {
          return a.Name > b.Name;
        })

        component.set("v.plans", plans);

      } else {
        var errors = state === "ERROR" ? result.getError() : null;
        var message = errors && Array.isArray(errors) && errors.length > 0 ?
          "No Save State and JSON Static Resources retrieved due to error: " + errors[0].message :
          "No Save State and JSON Static Resources retrieved due to server-side action state: " + state;
        console.warn(message);

      }

      component.set("v.loading", false);

      //Select the initial step creator
      this.selectStepCreator(component, false);
    });

    $A.enqueueAction(action);
  },

  /**
   * Selects the plan specified in the planSearch attribute (the plan's name) or creates a new plan
   * @param {Aura.Component} component 
   * @param {Boolean} isNewPlan 
   */
  selectStepCreator: function (component, isNewPlan) {
    const stepCreators = component.get("v.stepCreators"),
      planSearch = component.get("v.planSearch");

    component.set("v.loading", true);

    var selectedStepCreator = stepCreators.find(function (stepCreator) {
      return stepCreator && stepCreator.plan && stepCreator.plan.Name === planSearch;
    });

    if (isNewPlan) {
      component.set("v.planOpen", true);
      component.set("v.records", []);
      component.set("v.planName", "");

    } else if (!isNewPlan && selectedStepCreator) {
      //prettify Options string
      selectedStepCreator.steps.forEach(function (record) {
        try {
          if (record.Options) record.Options = JSON.stringify(JSON.parse(record.Options), null, 4);

        } catch (e) {
          console.warn(e);
        }
      });

      component.set("v.planOpen", true);
      component.set("v.records", selectedStepCreator.steps);
      component.set("v.planName", planSearch);

    } else {
      component.set("v.planOpen", false);
      component.set("v.records", []);
      component.set("v.planName", "");
    }

    component.set("v.loading", false);
  },

  /**
   * Initializes blank fields for existing records that were queried
   * @param {Aura.Component} component
   */
  addFieldsToExistingRecords: function (component) {
    var records = component.get("v.records");

    for (var i = 0; i < records.length; i++) {
      var record = VlocityDiagnosticWizard_StepTemplates.getNewBlankStep();

      var keys = Object.keys(records[i]);

      for (var i2 = 0; i2 < keys.length; i2++) {
        var key = keys[i2];
        record[key] = ["string"].includes(typeof record[key]) ?
          String(records[i][key]) :
          records[i][key];
      }

      records[i] = record;
    }

    component.set("v.records", records);
  },

  /**
   * Adds new blank step to records attribute
   * @param {Aura.Component} component
   */
  createNewStep: function (component, getTemplateFunctionName) {
    var records = component.get("v.records");

    var newRecord = VlocityDiagnosticWizard_StepTemplates[getTemplateFunctionName]();

    newRecord.expandRecord = true;

    records.push(newRecord);
    component.set("v.records", records);
  },

  /**
   * Builds StepCreator JSON content and displays content modal
   * @param {Aura.Component} component 
   */
  showJSONModal: function (component) {
    var planName = component.get("v.planName"),
      planNamespace = component.get("v.planNamespace"),
      componentRecords = component.get("v.records");

    /* create deep copy of records 
     *  (lightning does not deep copy records with
     *  component.get, so modifying record.Options
     *  in this function did so in the component as well)
     */
    var records = componentRecords.map(function (record) {
      return Object.assign({}, record);
    });

    var errorMessage = "";

    const tree = {};
    records.forEach(function (record) {
      delete record.expandRecord;
      delete record.Id;
      delete record.UpgradePlanId;

      record.ExternalId = record.ExternalId || record.Name;
      record.UniqueId = record.UniqueId || record.Name;

      //check if JSON Options parses
      if (record.Options) {
        try {
          record.Options = JSON.parse(record.Options);
          if (!record.Options || typeof record.Options !== "object") {
            errorMessage = ("Options value of step '" + record.Name + "' parses into type: " + typeof record.Options + ", and needs to parse into type object.");
            console.warn(errorMessage);
            component.set("v.errorMessage", errorMessage);
          }
        } catch (err) {
          errorMessage = ("Options value of step '" + record.Name + "' does not parse into JSON, please fix.");
          console.warn(errorMessage);
          component.set("v.errorMessage", errorMessage);
        }
      }

      if (record.ParentStepUniqueId) {
        if (!tree[record.ParentStepUniqueId]) {
          tree[record.ParentStepUniqueId] = [];
        }
        tree[record.ParentStepUniqueId].push(record);
      } else {
        if (tree[record.UniqueId]) {
          tree[record.UniqueId].unshift(record);
        } else {
          tree[record.UniqueId] = [record];
        }
      }
    });

    var fileName = (planNamespace ? planNamespace + "__" : "") + "VlocityStepCreator_" + planName;
    fileName = fileName.split(/[ -]/g).join("");

    //create content object before stringifying it
    var contentObject = {
      type: "VlocityStepCreator",
      fileName: fileName,
      plan: {
        Name: planName,
        UniqueId: planName
      },
      steps: this.flatternTree(tree)
    }

    var jsonStr = JSON.stringify(contentObject, null, 4);

    component.set("v.modalContent", jsonStr);
    component.set("v.showContentModal", true);
  },

  /**
   * Transforms the records object into an array
   * @param {Array} tree 
   */
  flatternTree: function (tree) {
    let records = [];
    Object.keys(tree).forEach(key => {
        records = records.concat(tree[key]);
    });
    return records;
  },

  saveBodyNonAscii: function (component) {
    const modalContent = component.get("v.modalContent");
    var body = window.btoa(modalContent.replace(/[\u00A0-\u2666]/g, function(c) {
      return '&#' + c.charCodeAt(0) + ';';
    }))
    return body;
  },

  /**
   * Creates a Static Resource from the JSON modal content via the Tooling API
   * @param {Aura.Component} component 
   */
  saveStaticResource: function (component) {
    try {
      const me = this,
      planName = component.get("v.planName"),
      modalContent = component.get("v.modalContent");

      component.set("v.saveInProgress", true);

      const contentObject = JSON.parse(modalContent);

      var action = component.get("c.saveStaticResource");

      const actionParams = {
        Name: contentObject.fileName,
        ContentType: "application/json",
        Body: me.saveBodyNonAscii(component) //encode to base64
      };

      action.setParams({
        payload: JSON.stringify(actionParams)
      });

      action.setCallback(this, function (result) {
        var state = result.getState();
        component.set("v.saveInProgress", false);

        if (state === "SUCCESS") {
          var output = result.getReturnValue();

          try {
            var toolingResponse = output.toolingResponse && JSON.parse(output.toolingResponse);
            if (toolingResponse && toolingResponse[0] && toolingResponse[0].errorCode) {
              output.hasErrors = true;
              output.errorMessage = toolingResponse[0].errorCode;
            }
          } catch (e) { }

          if (output.hasErrors) {
            console.warn("No static resource saved due to server-side error:" + output.errorMessage);
          } else {
            console.log("Static Resource created.");
            component.set("v.showContentModal", false);
            me.loadSaveStateAndStepCreators(component);
          }

        } else {

          var errors = state === "ERROR" ? result.getError() : null;
          var message = errors && Array.isArray(errors) && errors.length > 0 ?
            "No static resource saved due to error: " + errors[0].message :
            "No static resource due to server-side action state: " + state;
          console.warn(message);

        }
      });

      $A.enqueueAction(action);
    } catch (e) {
      var errorMessage = 'Error with ASCII characters:' + e.message;
      console.error(errorMessage);
    }
  },

  /**
   * Deletes the record at the given index
   * @param {Aura.Component} component
   * @param {Aura.Event} event
   */
  destroyStep: function (component, event) {
    var records = component.get("v.records");
    var recordIndex = event.getSource().get("v.value");
    records.splice(recordIndex, 1);
    component.set("v.records", records);
  },

  /**
   * Copies the record at the given index
   * @param {Aura.Component} component
   * @param {Aura.Event} event
   */
  copyStep: function (component, event) {
    var records = component.get("v.records");
    var recordIndex = event.getSource().get("v.value");
    var newRecord = Object.assign({}, records[recordIndex]);
    records[recordIndex].expandRecord = false;
    records.splice(recordIndex + 1, 0, newRecord);
    component.set("v.records", records);
  },

  /**
   * Moves the record at the given index up 1 position
   * @param {Aura.Component} component
   * @param {Aura.Event} event
   */
  moveStepUp: function (component, event) {
    var records = component.get("v.records"),
      recordIndex = event.getSource().get("v.value");
    var record = records.splice(recordIndex, 1)[0];
    records.splice(recordIndex - 1, 0, record);
    component.set("v.records", records);
  },

  /**
   * Moves the record at the given index down 1 position
   * @param {Aura.Component} component
   * @param {Aura.Event} event
   */
  moveStepDown: function (component, event) {
    var records = component.get("v.records"),
      recordIndex = event.getSource().get("v.value");
    var record = records.splice(recordIndex, 1)[0];
    records.splice(recordIndex + 1, 0, record);
    component.set("v.records", records);
  },

  /**
   * Toggles whether a step is collapsed
   * @param {Aura.Component} component
   * @param {Aura.Event} event
   */
  toggleExpandRecord: function (component, event, isAura) {
    var records = component.get("v.records");

    var recordIndex = isAura ?
      event.getSource().get("v.value") :
      parseInt(event.target.getAttribute('data-record-index'));

    records[recordIndex].expandRecord = !records[recordIndex].expandRecord;
    component.set("v.records", records);
  },

  /**
   * Checks if any step element has been expanded
   * @param {Aura.Component} component 
   */
  setStepElementIsExpanded: function (component) {
    var records = component.get("v.records");
    var stepElementIsExpanded = records && records.some(function (record) {
      return record.expandRecord;
    });
    component.set("v.stepElementIsExpanded", stepElementIsExpanded);
  },

  /**
   * Displays plan names when search bar is focused
   * @param {Aura.Component} component 
   */
  focusPlanSearchBar: function (component) {
    component.set("v.showPlansDropdown", true);
  },

  /**
   * Hides plan names when search bar is blurred
   * @param {Aura.Component} component 
   */
  blurPlanSearchBar: function (component) {
    setTimeout($A.getCallback(function () {
      component.set("v.showPlansDropdown", false);
    }), 5);
  },

  /**
   * Saves the state of the VlocityDiagnosticStepCreator to its SaveState record
   * @param {Aura.Component} component 
   */
  updateSaveState: function (component) {
    const planName = component.get("v.planName") || "";

    var saveState = component.get("v.saveState"),
      action = component.get("c.updateSaveState");

    if (!saveState) return;

    var logData = {
      planName: planName
    };

    saveState.LogData = JSON.stringify(logData);

    const actionParams = {
      saveState: saveState
    };

    action.setParams({
      payload: JSON.stringify(actionParams)
    });

    action.setCallback(this, function (result) {
      var state = result.getState();
      if (state === "SUCCESS") { } else {

        var errors = state === "ERROR" ? result.getError() : null;
        var message = errors && Array.isArray(errors) && errors.length > 0 ?
          "Error updating Save State record due to error: " + errors[0].message :
          "Error updating Save State record due to server-side action state: " + state;
        console.warn(message);
      }
    });
    $A.enqueueAction(action);
  }
});
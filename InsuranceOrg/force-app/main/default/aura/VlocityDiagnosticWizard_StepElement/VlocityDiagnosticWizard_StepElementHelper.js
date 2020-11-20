({
  //Setup
  /**
   * Logic on init
   * @param {Aura.Component} component
   */
  onInit: function (component) {
    var record = component.get("v.record");
    component.set("v.initialRecordStatus", VlocityDiagnosticWizard_Helpers.getOverallStatus(record));
    component.set("v.actionBtnAttributes", {});
    this.setCustomInput(component);
    this.preCheckStep(component);
  },

  /**
   * Sets custom input to the record's custom input value on init
   * @param {Aura.Component} component 
   */
  setCustomInput: function (component) {
    var record = component.get("v.record");

    if (record && record.CustomInputLabel) {
      component.set("v.customInput", record.CustomInputValue || "");
    }

    if (record && record.CustomInputLabel2) {
      component.set("v.customInput2", record.CustomInputValue2 || "");
    }
  },

  //Invoke Action Functions
  /**
   * Check's that the step's results are complete on init
   * @param {Aura.Component} component
   * @param {Boolean} onInit
   */
  preCheckStep: function (component) {
    this.checkStepHandler(component, true);
  },

  /**
   * Check's that the step's results are complete after an action happens
   * @param {Aura.Component} component
   * @param {Boolean} onInit
   */
  postCheckStep: function (component) {
    this.checkStepHandler(component, false);
  },

  /**
   * Checks the completion status of the component's UpgradeStep record
   * @param {Aura.Component} component 
   * @param {Boolean} isPreCheck 
   */
  checkStepHandler: function (component, isPreCheck) {
    const me = this;
    var record = component.get("v.record");
    if (!record) return;

    var inputMethodKey = isPreCheck ?
      "PreCheckMethod" :
      "PostCheckMethod";

    record.LastCheckStatus = "In Progress";
    component.set("v.record", record);

    if (!record.LastExecutionStatus) {
      record.LastExecutionStatus = "Not Started";
    }

    if (record.Type === "Group") {
      me.checkGroupStep(component);
      return;
    }

    if (!record[inputMethodKey]) {
      record.LastCheckStatus = "No Check Method";
      component.set("v.record", record);
      //me.updateRecord(component);
      return;
    }
    //invoke checkAction
    me.invokeApexHandler(component, inputMethodKey);
  },

  /**
   * Wrapper to handle the 'Complete Step' button being pressed
   * @param {Aura.Component} component
   */
  completeAction: function (component) {
    const me = this;
    var record = component.get("v.record"),
      recordStatus = VlocityDiagnosticWizard_Helpers.getOverallStatus(record),
      displayStep = component.get("v.displayStep"),
      showInstructionModal = component.get("v.showInstructionModal"),
      inputMethodKey = "ExecutionMethod";

    if (
      !record ||
      !displayStep || ["In Progress", "Complete"].includes(recordStatus))
      return;

    if (record.Type === "Group") {
      me.completeChildSteps(component);
      return;

    } else if (!record.ExecutionMethod && !showInstructionModal) {
      me.openModal(component, "instruction");
      return;

    } else {
      me.invokeApexHandler(component, inputMethodKey);
    }

    record.LastExecutionStatus = "In Progress";
    component.set("v.record", record);
  },

  /**
   * Finds all child components with aura:id "stepElement", and then calls their completeAction function
   * @param {Aura.Component} component 
   */
  completeChildSteps: function (component) {
    const record = component.get("v.record"),
      isChild = component.get("v.isChild"),
      childRecords = component.get("v.childRecords");

    if (record.Type !== "Group" || isChild || !childRecords.length) return;

    //retrieve children
    const childElements = this.getComponentChildren(component);
    childElements.forEach(function (childComponent) {
      childComponent.completeAction();
    });
  },

  /**
   * Fires an event to open the given modalType for the element
   * @param {Aura.Component} component
   * @param {String} modalType
   */
  openModal: function (component, modalType) {
    component.set("v.notes", component.get("v.record").Description);

    var modalEvent = component.getEvent("modalEvent");

    var modalParams = {
      modalType: modalType,
      parent: component
    };

    modalEvent.setParams({
      modalParams: modalParams
    });

    modalEvent.fire();
  },

  /**
   * Calls the controller's Apex method to invoke the step's method
   * @param {Aura.Component} component
   * @param {Boolean} isCheck
   * @param {Boolean} setField
   */
  invokeApexHandler: function (component, inputMethodKey) {
    const me = this;
    var record = component.get("v.record"),
      actionName = "c.invokeAction",
      isCheck = inputMethodKey !== "ExecutionMethod",
      fieldToUpdate = isCheck ? "LastCheckStatus" : "LastExecutionStatus";

      //Initialize properties if they don't exist
      if (!record.Options) record.Options = "";
      if (!record.CustomInputValue) record.CustomInputValue = "";
      if (!record.CustomInputValue2) record.CustomInputValue2 = "";

      var recordOptions = record.Options ?
      JSON.parse(
        record.Options.replace(
          "__CUSTOMINPUT__",
          record.CustomInputValue
        ).replace(
            "__CUSTOMINPUT2__",
            record.CustomInputValue2
          )
      ) : {};

    if (record.CustomInputValue)
      recordOptions.customInput = record.CustomInputValue;

    if (record.CustomInputValue2)
      recordOptions.customInput2 = record.CustomInputValue2;

    //Set lastexecutionstatus
    isCheck
      ?
      (record.LastCheckDateTime = VlocityDiagnosticWizard_Helpers.getCurrentDateTime()) :
      (record.LastExecutionDateTime = VlocityDiagnosticWizard_Helpers.getCurrentDateTime());

    recordOptions.inputMethodKey = inputMethodKey;

    recordOptions.inputMethod = record[inputMethodKey] || "";

    //Protect callouts from being put into server side action batch
    var isBackgroundAction =
      recordOptions.isBackgroundAction ||
      recordOptions.hasOwnProperty("ToolingAPI");

    //Invoke Server Side action for step
    me.invokeApexPromise(
        component,
        actionName, {
          step: record,
          options: recordOptions
        },
        isBackgroundAction
      )

      //Call second action if applicable
      .then(
        $A.getCallback(function (output) {

          if (!output) return Promise.resolve(output);

          if (output.options)
            recordOptions = Object.assign(recordOptions, output.options);

          //start composite action if applicable
          if (recordOptions.jsAction && recordOptions.jsAction[inputMethodKey]) {

            //pass method to composite action handler so methods can call additional Apex commands
            const callApexMethod = function (params) {
              return me.invokeApexPromise(
                params.component,
                "c.invokeAction", {
                  step: params.record,
                  options: params.recordOptions
                }
              );
            };

            return me.callCompositeActionHandler({
              component,
              record,
              output,
              recordOptions,
              callApexMethod
            });
          }

          //add given batchjobid to record if applicable
          if (output.batchJobId) {
            record.RelatedBatchJobId = output.batchJobId; //Only for UI
            record.RelatedBatchJobId__c = output.batchJobId;
            component.set("v.record", record);
          }

          var waitTime = 0;

          if (recordOptions && recordOptions.DelayAfter) waitTime = recordOptions.DelayAfter[inputMethodKey] || 0;

          return waitTime ?
            new Promise(function (resolve, reject) {
              setTimeout(function () {
                resolve(output);
              }, waitTime);
            }) :
            Promise.resolve(output);
        })
      )

      //update record
      .then(
        $A.getCallback(function (output) {

          //check toolingResponse for errors, and report
          const toolingResponse = output.toolingResponse && JSON.parse(output.toolingResponse);

          if (toolingResponse && toolingResponse[0] && toolingResponse[0].errorCode) {
            output.hasErrors = true;
            output.consoleMessage = "Tooling API response error: " + toolingResponse[0].errorCode;
          }

          //add checkResultUrl to record if given in output
          if (output.checkResultUrl) {
            record.CheckResultUrl = output.checkResultUrl;
          }

          //output consoleMessage if applicable
          if (output.consoleMessage) console.warn(record.Name + ': ' + output.consoleMessage);

          //set record status
          record[fieldToUpdate] =
            output && output.hasErrors ? "Failed" : "Complete";

          //store results
          component.set("v.record", record);
          component.set("v.invokeOutput", output);
          me.updateRecord(component);

          if (!isCheck && (!output.hasErrors)) {
            me.postCheckStep(component);
          }
        })
      )

      //Catch server side error
      .catch(
        $A.getCallback(function (output) {

          component.set("v.invokeOutput", output);

          if (output.consoleMessage) console.error(record.Name + ': ' + output.consoleMessage);

          record[fieldToUpdate] = "Failed";
          component.set("v.record", record);
        })
      );
  },

  /**
   * Invokes a server side action, returning a Promise
   * @param {Aura.Component} component
   * @param {String} actionName
   * @param {Object} actionParams
   * @return {Promise}
   */
  invokeApexPromise: function (
    component,
    actionName,
    actionParams,
    isBackgroundAction
  ) {
    return new Promise(function (resolve, reject) {

      var action = component.get(actionName);

      action.setParams({payload:JSON.stringify(actionParams)});

      action.setCallback(this, function (response) {
        var state = response.getState();

        if (state === "SUCCESS") {
          var output = response.getReturnValue();
          resolve(output);

        } else if (state === "ERROR") {
          var errors = response.getError();
          var message =
            errors && Array.isArray(errors) && errors.length > 0 ?
            errors[0].message :
            "Unknown server side error.";

          var output = {
            hasErrors: true,
            //errorMessage: 'server side error.',
            consoleMessage: "Server Side Error: " + message
          };

          reject(output);
        } else {
          var output = {
            hasErrors: true,
            //errorMessage: 'callback error.',
            consoleMessage: "Callback Error: " + 'Problem occured invoking Apex with state: "' + state + '".'
          };

          reject(output);
        }
      });

      if (isBackgroundAction) action.setBackground();

      $A.enqueueAction(action);
    });
  },

  /**
   * Handles calling a second JS method defined in the record's options field, returning a Promise
   * @param {Object} params
   * @return {Promise}
   */
  callCompositeActionHandler: function (params) {
    const inputMethodKey = params.recordOptions.inputMethodKey,
      jsAction = params.recordOptions.jsAction,
      jsInputMethod = jsAction[inputMethodKey.replace("", "")],
      objectName = jsInputMethod.split(".")[0],
      functionName = jsInputMethod.split(".")[1];

    try {
      return window[String(objectName)][String(functionName)](params);
    } catch (error) {
      var output = {};
      output.hasErrors = true;

      output.errorMessage =
        error.toString() === "TypeError: this[String(...)] is not a function" ?
        "Function is not defined." :
        error.toString();

      return Promise.resolve(output);
    }
  },

  // Record Update Functions
  /**
   * Calls the controller's Apex method to upsert the given UpgradeStep record
   * @param {Aura.Component} component
   * @returns {Promise}
   */
  updateRecord: function (component) {
    return new Promise(function (resolve, reject) {

      const recordAttribute = component.get("v.record");
      
      var record = Object.assign({}, recordAttribute);

      delete record.UpgradePlanId__r;
      delete record.UpgradeSteps__r;
      delete record.Options;

      if (
        !record ||
        record.LastCheckStatus === "In Progress" ||
        record.LastExecutionStatus === "In Progress"
      ) {
        resolve({hasErrors:false});
      } else {
        
        var action = component.get("c.updateDiagnosticStep");

        const actionParams = {step: record};
        
        action.setParams({payload:JSON.stringify(actionParams)});

        action.setCallback(this, function (result) {
          const state = result.getState();
          var output = {};

          if(state === "SUCCESS") {

            output.hasErrors = false;

          } else {

            var errors = state === "ERROR" ? result.getError() : null;
            var message = errors && Array.isArray(errors) && errors.length > 0 ?
              "Record " + record.Name + " not updated due to server-side error: " + errors[0].message :
              "Record " + record.Name + " not updated due to server-side action state: " + state;

            console.warn(message);
            output.hasErrors = true;
            output.errorMessage = message;

          }

          resolve(output);

        });
        action.setBackground();
        $A.enqueueAction(action);
      }
    });
  },

  /**
   * Retrieves the record's tags from the master recordTagsList attribute or record attribute
   * @param {Aura.Component} component
   */
  setRecordTagsFromList: function (component) {
    const me = this,
      record = component.get("v.record"),
      recordTagsList = component.get("v.recordTagsList"),
      ps = VlocityDiagnosticWizard_Helpers.cdStringToList;

    var recordTags = recordTagsList.find(function (element) {
      return element.id === record.Id;
    });

    if (recordTags) {
      delete recordTags.id;
    } else {
      //set manually
      var recordTags = {
        versionTags: ps(record.VersionIntroduced),
        featureTags: ps(record.Tags),
        priorityTags: ps(record.Priority),
        frequencyTags: ps(record.StepFrequency),
        typeTags: ps(record.Type)
      };
    }

    component.set("v.recordTags", recordTags);

    //call refreshDisplayStep first time
    me.refreshDisplayStep(component);
  },

  /**
   * Sets the overall record status
   * @param {Aura.Component} component
   */
  setRecordStatus: function (component) {
    var record = component.get("v.record");
    component.set(
      "v.recordStatus",
      VlocityDiagnosticWizard_Helpers.getOverallStatus(record)
    );
  },

  /**
   * Fires an event to notify a parent step that the record has updated
   * @param {Aura.Component} component
   */
  notifyParentRecord: function (component) {
    var isChild = component.get("v.isChild");
    if (!isChild) return;
    var record = component.get("v.record"),
      recordStatus = component.get("v.recordStatus"),
      notifyEvent = component.getEvent("notifyParentEvent");

    notifyEvent.setParams({
        parentId: record.ParentStepId
      });

    notifyEvent.fire();
  },

  /**
   * Captures the notifyParentEvent called by a child element
   * @param {Aura.Component} component
   * @param {Aura.Event} event
   */
  onChildUpdateEvent: function (component, event) {
    const me = this;
    var record = component.get("v.record"),
      parentId = event.getParam("parentId");
    if (record.Id === parentId) {
      me.postCheckStep(component);
      event.stopPropagation();
    }
  },

  /**
   * Opens the given check result url of the record as a URL in a new window
   * @param {Aura.Component} component
   * @param {Object} linkParams
   */
  openCheckResult: function (component) {
    const record = component.get("v.record"),
      url = record.CheckResultUrl;
    window.open(url);
  },

  /**
   * Sets the record attribute's Description parameter to the notes attribute, then upserts the record
   * @param {Aura.Component} component
   */
  saveNotes: function (component) {
    const me = this;
    var record = component.get("v.record");
    record.Description = component.get("v.notes");
    component.set("v.record", record);
    me.updateRecord(component);
  },

  /**
   * Re-evaluates (using preCheckStep(component)) the record after the custom input is changed
   * @param {Aura.Component} component 
   */
  updateCustomInput: function (component) {
    const me = this;
    var record = component.get("v.record"),
        customInput = component.get("v.customInput"),
        customInput2 = component.get("v.customInput2");

    if (
      !record.CustomInputValue ||
      record.CustomInputValue !== customInput ||
      !record.CustomInputValue2 ||
      record.CustomInputValue2 !== customInput2
    ) {
      record.CustomInputValue = customInput;
      record.CustomInputValue2 = customInput2;

      //re-evaluate step
      record.LastExecutionStatus = "Not Started";

      me.updateRecord(component).then(
        $A.getCallback(function (result) {
          return me.preCheckStep(component);
        })
      );
    }
  },

  //Helper Functions
  /**
   * Sets attributes for step action button
   * @param {Aura.Component} component
   */
  refreshActionBtn: function (component) {
    const record = component.get("v.record"),
      recordStatus = component.get("v.recordStatus"),
      actionBtnAttributes = component.get("v.actionBtnAttributes");

    if (!recordStatus) recordStatus = "Complete";

    var recordType = (record.Type == "Manual" && record.ExecutionMethod) ? "Auto" : record.Type;
    actionBtnAttributes.label = {
      Manual: "Show Instruction",
      Group: "Complete All",
    } [recordType] || "Complete Step";

    actionBtnAttributes.modalLabel = {
      Manual: "Mark Complete",
      Group: "Complete All",
    } [recordType] || "Complete Step";

    actionBtnAttributes.disabled = recordStatus === "In Progress" || actionBtnAttributes.childAutoComplete;

    actionBtnAttributes.hidden = recordStatus === "Complete";

    component.set("v.actionBtnAttributes", actionBtnAttributes);
  },

  /**
   * Checks the status of a step's child elements, then sets the step's status appropriately
   * @param {Aura.Component} component
   */
  checkGroupStep: function (component) {
    const me = this;
    var record = component.get("v.record"),
      childRecords = component.get("v.childRecords"),
      actionBtnAttributes = component.get("v.actionBtnAttributes"),
      shownChildren = 0;

    if (childRecords && childRecords.length) {

      var completedChildren = 0,
        incompleteAutoChildren = 0

      var childStatuses = childRecords.map(function (step) {
        if(step.IsShown) {
            const status = VlocityDiagnosticWizard_Helpers.getOverallStatus(step);
            if (status === "Complete") {
                completedChildren++;
            } else if (step.ExecutionMethod) {
                incompleteAutoChildren++;
            }
            shownChildren++;
        }
        return status;
      });

      //set parent status
      var parentStatus = "Not Started";
      if (completedChildren === shownChildren) {
        parentStatus = "Complete";
      } else if (childStatuses.includes("In Progress")) {
        parentStatus = "In Progress";
      } else if (childStatuses.includes("Failed")) {
        parentStatus = "Failed";
      }
      record.LastCheckStatus = parentStatus;
      record.LastExecutionStatus = parentStatus;
      component.set("v.completedChildren", completedChildren);
      component.set("v.shownChildren", shownChildren);

      //set action button status
      actionBtnAttributes.childAutoComplete = !incompleteAutoChildren;
      component.set("v.actionBtnAttributes", actionBtnAttributes);

    } else {
      record.LastCheckStatus = 'Not Started';
    }

    component.set("v.record", record);
    me.updateRecord(component);
  },

  /**
   * Sets displayStep attribute, based on the chosen filters and record attributes
   * @param {Aura.Component} component
   */
  refreshDisplayStep: function (component) {
    const initialRecordStatus = component.get("v.initialRecordStatus"),
      recordStatus = component.get("v.recordStatus"),
      filters = component.get("v.filters"),
      isChild = component.get("v.isChild"),
      recordTags = component.get("v.recordTags"),
      me = this;

    if (
      !initialRecordStatus ||
      !recordStatus ||
      !filters ||
      !recordTags
    )
      return;

    recordTags.statusTags = [initialRecordStatus, recordStatus];

    var keys = Object.keys(recordTags);

    var showStep = true;

    for (var i = 0; showStep && i < keys.length; i++) {
      showStep = VlocityDiagnosticWizard_Helpers.showStepByTags(
        recordTags[keys[i]],
        filters[keys[i]]
      );
    }

    if(!isChild) {
        const shownChildren = component.get("v.shownChildren");
        showStep = showStep || shownChildren > 0;
    }

    component.set("v.displayStep", showStep);

    if (isChild) {
      me.refreshProgressItemStatus(component);
      component.set("v.record.IsShown", showStep);
      this.notifyParentRecord(component);
    }
  },

  /**
   * Sets the component's child progressItem CSS class for the slds-setup-assistant styling
   * @param {Aura.Component} component 
   */
  refreshProgressItemStatus: function (component) {
    var recordStatus = component.get("v.recordStatus"),
      isChild = component.get("v.isChild");

    var stepElement = component.find(isChild ? "innerStepElement" : "outerStepElement");

    if (!stepElement) return;

    var progressItem = stepElement.find("progressItemContainer");

    if (!progressItem) return;

    $A.util.removeClass(progressItem, "slds-is-completed");
    $A.util.removeClass(progressItem, "slds-has-error");
    $A.util.removeClass(progressItem, "slds-is-active");

    const states = {
      "Complete": "slds-is-completed",
      "Failed": "slds-has-error",
      "In Progress": "slds-is-active"
    };

    $A.util.addClass(progressItem, states[recordStatus]);
  },

  /**
   * Finds all the child elements of a group step
   * @param {Aura.Component} component 
   * @returns {Array} An array of child components
   */
  getComponentChildren: function (component) {
    //retrieve children
    const childElements = component.find("outerStepElement").find("stepElement");

    // If no elements found, this will return undefined.
    if (!childElements) return [];

    // According to docs, find() will return the component if only one result, but
    // will return an array if more than one result
    return typeof childElements.forEach === 'function' ? childElements : [childElements];
  }
});
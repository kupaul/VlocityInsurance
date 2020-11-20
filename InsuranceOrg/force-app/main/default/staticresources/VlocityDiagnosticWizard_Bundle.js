window.VlocityDiagnosticWizard_Helpers = {
  /**
   * Returns overall step status
   * @param {Object} record
   * @returns {String}
   */
  getOverallStatus: function (record) {
    if (!record) return "Not Started";

    if (
      record.LastCheckStatus === "In Progress" ||
      record.LastExecutionStatus === "In Progress"
    )
      return "In Progress";

    if (
      record.LastCheckStatus === "Complete" ||
      (record.LastCheckStatus === "No Check Method" &&
        record.LastExecutionStatus === "Complete")
    )
      return "Complete";

    if (
      (record.LastCheckStatus === "Failed" &&
        record.LastExecutionStatus !== "Not Started") ||
      (record.LastCheckStatus === "No Check Method" &&
        record.LastExecutionStatus === "Failed")
    )
      return "Failed";

    return "Not Started";
  },

  /**
   * Returns the current date in a Salesforce DateTime format
   * @returns {String}
   */
  getCurrentDateTime: function () {
    return (
      $A.localizationService.formatDateTimeUTC(
        new Date(),
        "yyyy-MM-ddTHH:mm:ss.SSS"
      ) + "Z"
    );
  },

  /**
   * Returns a converted comma delimited string into an array of strings
   * @param {String} str
   * @returns {Array}
   */
  cdStringToList: function (str) {
    var lst = [];
    if (str && typeof str === "string") {

      lst = str.split(",");
      for (var i = 0; i < lst.length; i++) {
        lst[i] = lst[i].trim();
      }
    }

    return lst;
  },

  /**
   * Takes values from an Array, sets Map with the values as keys to false
   * @param {Map} tagsMap
   * @param {Array} tagsList
   */
  addTagsToMap: function (tagsMap, tagsList) {
    for (var i = 0; i < tagsList.length; i++) {
      tagsMap.set(tagsList[i], false);
    }
  },

  /**
   * Compares tagsArray to filtersArray
   * @param {Array} tagsArray in form ['tag1','tag2','tag3',...]
   * @param {Array} filtersArray in form [['filter1':true],['filter2':false],...]
   */
  showStepByTags: function (tagsArray, filtersArray) {

    //checks that no filters have been applied (if there is no filter in filtersArray set to true)
    const noFiltersApplied = !filtersArray.some(function (pair) {
      return pair[1];
    });

    if (noFiltersApplied) return true;

    //create new map out of filtersArray
    const filtersMap = new Map(filtersArray);

    //Returns true if a key in filtersMap 
    return tagsArray.some(function (tag) {
      return filtersMap.get(tag);
    });
  },

  /**
   * Copies text to clipboard using event listener overrides
   * @param {String} text 
   */
  copyTextToClipboard: function (text) {

    if (typeof text !== "string") return;

    const copyText = function (e) {
      e.clipboardData.setData("text/plain", text);
      e.preventDefault();
    };

    document.addEventListener("copy", copyText);

    document.execCommand("copy");

    document.removeEventListener("copy", copyText);
  }
};
/**
 * Define a JS Object on the window like below to create a new JS composite action
 * In the UpgradeStep record's Options JSON value, include a property "jsAction" of JSON type
 * that includes the functions you want to run at the specific times
 * 
 * The functions you define MUST return promises
 * Example:
 * 
   "jsAction": {
        "PreCheckMethod": "preCheckTemplateMethod",
        "ExecutionMethod": "executionTemplateMethod",
        "PostCheckMethod": "postCheckTemplateMethod"
    }
 */

window.VlocityDiagnosticWizard_JSTemplateActions = {

    /**
     * a template JS function that is called after its UpgradeStep record's PreCheckMethod method is called
     * 
     * @param {Object} params contains all the parameters that are given to the method by the Upgrade Wizard
     * @returns {Promise}
     * It contains the following properties
     * 
     * component: 
     * The VlocityDiagnosticWizard_StepElement component passed to the helper function
     * 
     * record:
     * The UpgradeStep record in JSON
     * 
     * output:
     * The output JSON returned from the Apex Method (VlocityOpenInterface2 implementation) invoked by the step previously
     * 
     * recordOptions:
     * The current Options parameter of the record (this includes the added property "inputMethod", which is the previously called Apex Method name)
     * 
     * callApexMethod:
     * A function that invokes an Apex Method from a VlocityOpenInterface2 implementation. Uses logic from the VlocityDiagnosticWizard_StepElementHelper that calls this function.
     * 
     * Example of params:
          params = {
               component: {Aura.Component},
               record: {...},
               output: {...},
               recordOptions: {...},
               callApexMethod: {function}
           }
     */
    preCheckMethodTemplate: function (params) {

        //Example 1: Wrap everything in a promise
        return new Promise(function (resolve, reject) {
            try {
                var calloutOutput = {hasErrors: false};
                resolve(calloutOutput);
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * a template JS function that is called after its UpgradeStep record's ExecutionMethod method is called
     * 
     * @param {Object} params contains all the parameters that are given to the method by the Upgrade Wizard
     * @returns {Promise}
     */
    executionMethodTemplate: function (params) {

        //Example 2: Perform synchronous logic and return Promise.resolve or Promise.reject

        var isComplete = true;

        if (isComplete) {
            return Promise.resolve(params.output);
        } else {
            return Promise.reject(params.output);
        }
    },

    /**
     * a template JS function that is called after its UpgradeStep record's PostCheckMethod method is called
     * 
     * This is an example of how to call another Apex method using the UpgradeWizardLogic
     * 
     * @param {Object} params 
     * @returns {Promise}
     */
    postCheckMethodTemplate: function (params) {

        try {
            // Set the inputMethod in recordOptions, to be called in Apex.
            // The Apex Class must implement the VlocityOpenInterface2 and its invokeMethod method
            params.recordOptions.inputMethod = "ApexClassToCall.InvokeMethodName";

            //callApexMethod
            return params.callApexMethod(params);

        } catch (error) {
            console.error(error);

            const output = {
                hasErrors: true,
                errorMessage: "ToolingAPI.createSObject: " + error.toString()
            };

            return Promise.resolve(output);
        }
    }
};
window.VlocityDiagnosticWizard_StepTemplates = {
  /**
   * Returns Array of available step templates
   * @returns {Array}
   */
  getTemplateMenuItems: function () {
    const basicMenuItems = {
      label: 'Basic Steps',
      menuSubheader: true,
      menuItems: [{
          label: 'Blank',
          value: 'getNewBlankStep'
        },
        {
          label: 'Manual',
          value: 'getNewManualStep'
        },
        {
          label: 'Group',
          value: 'getNewGroupStep'
        }
      ]
    };

    const customSettingMenuItems = {
      label: 'Custom Setting Steps',
      menuSubheader: true,
      menuDivider: true,
      menuItems: [{
          label: 'Trigger Setup',
          value: 'getNewTriggerSetupStep'
        },
        {
          label: 'CPQ Configuration Setup',
          value: 'getNewCpqConfigurationSetupStep'
        },
        {
          label: 'CPQ Configuration Setup with Custom Input',
          value: 'getNewCpqConfigurationSetupCustomInputStep'
        }
      ]
    };

    const metadataMenuItems = {
      label: 'Metadata Steps',
      menuSubheader: true,
      menuDivider: true,
      menuItems: [{
          label: 'Remote Site Setting',
          value: 'getNewRemoteSiteSettingStep'
        },
        {
          label: 'OmniScript Picklist Values',
          value: 'getNewOmniScriptPicklistValuesStep'
        }
      ]
    };

    const otherMenuItems = {
      label: 'Other Steps',
      menuSubheader: true,
      menuDivider: true,
      menuItems: [{
        label: 'Run Vlocity CMT Batch Job',
        value: 'getNewCMTBatchJobStep'
      }]
    };

    return [basicMenuItems, customSettingMenuItems, metadataMenuItems, otherMenuItems];
  },
  /**
   * Returns empty UpgradeStep object
   * @returns {Object}
   */
  getNewBlankStep: function () {
    var record = {
      ExternalId: "",
      UniqueId: "",
      Name: "New Step",
      Priority: "None",
      Tags: "",
      VersionIntroduced: "",
      IsActive: true,
      Type: "",
      StepFrequency: "",
      Instruction: "",
      CustomInputLabel: "",
      CustomInputValue: "",
      Options: "",
      ArgumentList: "",
      StepCommand: "",
      CheckResultUrl: "",
      PrecursorStepUniqueId: "",
      ParentStepUniqueId: "",
      PreCheckMethod: "",
      PostCheckMethod: "",
      ExecutionMethod: "",
      //FOR StepCreator
      expandRecord: false
    };
    return record;
  },

  /**
   * Returns Manual UpgradeStep object
   * @returns {Object}
   */
  getNewManualStep: function () {
    var record = {
      ExternalId: "",
      UniqueId: "",
      Name: "New Manual Step",
      Priority: "None",
      Tags: "",
      VersionIntroduced: "",
      IsActive: true,
      Type: "Manual",
      StepFrequency: "",
      Instruction: "",
      CustomInputLabel: "",
      CustomInputValue: "",
      Options: "",
      ArgumentList: "",
      StepCommand: "Instruction URL (replace)",
      CheckResultUrl: "",
      PrecursorStepUniqueId: "",
      ParentStepUniqueId: "",
      PreCheckMethod: "",
      PostCheckMethod: "",
      ExecutionMethod: "",
      //FOR StepCreator
      expandRecord: false
    };
    return record;
  },

  /**
   * Returns Group UpgradeStep object
   * @returns {Object}
   */
  getNewGroupStep: function () {
    var record = {
      ExternalId: "",
      UniqueId: "",
      Name: "New Group Step",
      Priority: "None",
      Tags: "",
      VersionIntroduced: "",
      IsActive: true,
      Type: "Group",
      StepFrequency: "",
      Instruction: "",
      CustomInputLabel: "",
      CustomInputValue: "",
      Options: "",
      ArgumentList: "",
      StepCommand: "",
      CheckResultUrl: "",
      PrecursorStepUniqueId: "",
      ParentStepUniqueId: "",
      PreCheckMethod: "",
      PostCheckMethod: "",
      ExecutionMethod: "",
      //FOR StepCreator
      expandRecord: false
    };
    return record;
  },

  /**
   * Returns CPQ Configuration Setup Custom Setting UpgradeStep object
   * @returns {Object}
   */
  getNewCpqConfigurationSetupStep: function () {
    var record = {
      ExternalId: "",
      UniqueId: "",
      Name: "New CPQ Configuration Step",
      Priority: "None",
      Tags: "",
      VersionIntroduced: "",
      IsActive: true,
      Type: "Auto",
      StepFrequency: "",
      Instruction: "",
      CustomInputLabel: "",
      CustomInputValue: "",
      Options: "",
      ArgumentList: "",
      StepCommand: "",
      CheckResultUrl: "",
      PrecursorStepUniqueId: "",
      ParentStepUniqueId: "",
      PreCheckMethod: "VlocityDiagnosticWizardBaseMethods.checkSObject",
      PostCheckMethod: "VlocityDiagnosticWizardBaseMethods.checkSObject",
      ExecutionMethod: "VlocityDiagnosticWizardBaseMethods.setSObject",
      //FOR StepCreator
      expandRecord: false
    };

    const recordOptions = {
      SObject: {
        SObjectType: "vlocity_ins__CpqConfigurationSetup",
        Name: "REPLACE_ME",
        vlocity_ins__SetupValue: "REPLACE_ME"
      }
    };

    record.Options = JSON.stringify(recordOptions, null, 4);

    return record;
  },

  /**
   * Returns CPQ Configuration Setup Custom Setting with custom input UpgradeStep object
   * @returns {Object}
   */
  getNewCpqConfigurationSetupCustomInputStep: function () {
    var record = {
      ExternalId: "",
      UniqueId: "",
      Name: "New CPQ Configuration with Custom Input Step",
      Priority: "None",
      Tags: "",
      VersionIntroduced: "",
      IsActive: true,
      Type: "Auto",
      StepFrequency: "",
      Instruction: "",
      CustomInputLabel: "Custom Setting Record Label (replace)",
      CustomInputValue: "Custom Setting Record Value (replace)",
      Options: "",
      ArgumentList: "",
      StepCommand: "",
      CheckResultUrl: "",
      PrecursorStepUniqueId: "",
      ParentStepUniqueId: "",
      PreCheckMethod: "VlocityDiagnosticWizardBaseMethods.checkSObject",
      PostCheckMethod: "VlocityDiagnosticWizardBaseMethods.checkSObject",
      ExecutionMethod: "VlocityDiagnosticWizardBaseMethods.setSObject",
      //FOR StepCreator
      expandRecord: false
    };

    const recordOptions = {
      SObject: {
        SObjectType: "vlocity_ins__CpqConfigurationSetup",
        Name: "REPLACE_ME",
        vlocity_ins__SetupValue: "__CUSTOMINPUT__"
      }
    };

    record.Options = JSON.stringify(recordOptions, null, 4);

    return record;
  },

  /**
   * Returns Trigger Setup Custom Setting UpgradeStep object
   * @returns {Object}
   */
  getNewTriggerSetupStep: function () {
    var record = {
      ExternalId: "",
      UniqueId: "",
      Name: "New Trigger Setup Step",
      Priority: "None",
      Tags: "",
      VersionIntroduced: "",
      IsActive: true,
      Type: "Auto",
      StepFrequency: "",
      Instruction: "",
      CustomInputLabel: "",
      CustomInputValue: "",
      Options: "",
      ArgumentList: "",
      StepCommand: "",
      CheckResultUrl: "",
      PrecursorStepUniqueId: "",
      ParentStepUniqueId: "",
      PreCheckMethod: "VlocityDiagnosticWizardBaseMethods.checkSObject",
      PostCheckMethod: "VlocityDiagnosticWizardBaseMethods.checkSObject",
      ExecutionMethod: "VlocityDiagnosticWizardBaseMethods.setSObject",
      //FOR StepCreator
      expandRecord: false
    };

    const recordOptions = {
      SObject: {
        SObjectType: "vlocity_ins__TriggerSetup",
        Name: "REPLACE_ME",
        vlocity_ins__IsTriggerOn: true
      }
    };

    record.Options = JSON.stringify(recordOptions, null, 4);

    return record;
  },

  /**
   * Returns Remote Site Setting UpgradeStep object
   * @returns {Object}
   */
  getNewRemoteSiteSettingStep: function () {
    var record = {
      ExternalId: "",
      UniqueId: "",
      Name: "New Remote Site Setting Step",
      Priority: "None",
      Tags: "",
      VersionIntroduced: "",
      IsActive: true,
      Type: "Auto",
      StepFrequency: "",
      Instruction: "",
      CustomInputLabel: "",
      CustomInputValue: "",
      Options: "",
      ArgumentList: "",
      StepCommand: "",
      CheckResultUrl: "",
      PrecursorStepUniqueId: "",
      ParentStepUniqueId: "",
      PreCheckMethod: "VlocityDiagnosticWizardBaseMethods.toolingQuerySObject",
      PostCheckMethod: "VlocityDiagnosticWizardBaseMethods.toolingQuerySObject",
      ExecutionMethod: "VlocityDiagnosticWizardBaseMethods.PLACEHOLDER",
      //FOR StepCreator
      expandRecord: false
    };

    const recordOptions = {
      ToolingAPI: {
        SObjectType: "RemoteProxy",
        UniqueField: "SiteName",
        SiteName: "REPLACE_ME",
        objectPayload: {
          FullName: "REPLACE_ME",
          Metadata: {
            isActive: "true",
            url: "REPLACE_ME"
          }
        }
      },
      jsAction: {
        PreCheckMethod: "VlocityDiagnosticWizard_ToolingAPI.checkSObjectExists",
        PostCheckMethod: "VlocityDiagnosticWizard_ToolingAPI.checkSObjectExists",
        ExecutionMethod: "VlocityDiagnosticWizard_ToolingAPI.createSObject"
      }
    };

    record.Options = JSON.stringify(recordOptions, null, 4);

    return record;
  },

  /**
   * Returns a new OmniScript Picklist Values UpgradeStep object
   * @returns {Object}
   */
  getNewOmniScriptPicklistValuesStep: function () {
    var record = {
      ExternalId: "",
      UniqueId: "",
      Name: "New OmniScript Picklist Values Step",
      Priority: "None",
      Tags: "",
      VersionIntroduced: "",
      IsActive: true,
      Type: "Auto",
      StepFrequency: "",
      Instruction: "",
      CustomInputLabel: "",
      CustomInputValue: "",
      Options: "",
      ArgumentList: "",
      StepCommand: "",
      CheckResultUrl: "",
      PrecursorStepUniqueId: "",
      ParentStepUniqueId: "",
      PreCheckMethod: "VlocityDiagnosticWizardBaseMethods.toolingQueryCustomField",
      PostCheckMethod: "VlocityDiagnosticWizardBaseMethods.toolingQueryCustomField",
      ExecutionMethod: "VlocityDiagnosticWizardBaseMethods.toolingQueryCustomField",
      //FOR StepCreator
      expandRecord: false
    };

    const recordOptions = {
      ToolingAPI: {
        SObjectType: "CustomField",
        ObjectName: "vlocity_ins__Element__c",
        FieldName: "vlocity_ins__Type__c",
        fieldValues: ["REPLACE_ME", "REPLACE_ME_2", "..."]
      },
      jsAction: {
        PreCheckMethod: "VlocityDiagnosticWizard_ToolingAPI.checkPicklistFieldValues",
        PostCheckMethod: "VlocityDiagnosticWizard_ToolingAPI.checkPicklistFieldValues",
        ExecutionMethod: "VlocityDiagnosticWizard_ToolingAPI.addPicklistFieldValues"
      }
    };

    record.Options = JSON.stringify(recordOptions, null, 4);

    return record;
  },

  /**
   * Returns a new CMT Batch Job UpgradeStep object
   * @returns {Object}
   */
  getNewCMTBatchJobStep: function () {
    var record = {
      ExternalId: "",
      UniqueId: "",
      Name: "New CMT Batch Job Step",
      Priority: "None",
      Tags: "",
      VersionIntroduced: "",
      IsActive: true,
      Type: "Auto",
      StepFrequency: "",
      Instruction: "",
      CustomInputLabel: "",
      CustomInputValue: "",
      Options: "",
      ArgumentList: "",
      StepCommand: "",
      CheckResultUrl: "",
      PrecursorStepUniqueId: "",
      ParentStepUniqueId: "",
      PreCheckMethod: "VlocityDiagnosticWizardBaseMethods.checkBatchStatus",
      PostCheckMethod: "VlocityDiagnosticWizardBaseMethods.checkBatchStatus",
      ExecutionMethod: "VlocityDiagnosticWizardCMTMethods.invokeTelcoAdminConsoleMethod",
      //FOR StepCreator
      expandRecord: false
    };

    const recordOptions = {
      BatchJobsToMonitor: "REPLACE_ME",
      telcoAdminConsoleMethodName: "REPLACE_ME",
      DelayAfter: {
        ExecutionMethod: 20000
      }
    };

    record.Options = JSON.stringify(recordOptions, null, 4);

    return record;
  }

};
window.VlocityDiagnosticWizard_ToolingAPI = {
  /**
   * Compares given Picklist field values and field values retrieved via Tooling API on Apex
   * @param {Object} params
   * @returns {Promise}
   */
  checkPicklistFieldValues: function (params) {
    var output = {};

    try {

      if (params.output.isStandardField) {
          output.hasErrors = true;
          output.errorMessage = "Checking standard picklists is not supported. Please see documentation " + 
                                "on how to build this step and fix on Set-Up.";
          return Promise.resolve(output);
      }

      const givenValues = params.recordOptions.ToolingAPI.fieldValues.map(val => typeof val === 'string' ? val : val.value),
        toolingResponse = JSON.parse(params.output.toolingResponse),
        toolingSubResult = toolingResponse.compositeResponse.pop();

      const helperVal = VlocityDiagnosticWizard_ToolingAPI.picklistFieldValuesHelper({
        givenValues: givenValues,
        toolingResponse: toolingResponse,
        toolingSubResult: toolingSubResult,
        objectTableEnum: params.output.objectTableEnum
      });

      output = helperVal.output;

      if (output.hasErrors) Promise.resolve(output);

      const valuesNotIncluded = helperVal.valuesNotIncluded;

      output.hasErrors = !Array.isArray(valuesNotIncluded) || valuesNotIncluded.length > 0;

      if (output.hasErrors) {
        output.hasWarnings = true;
        output.errorMessage =
          "The following picklist values are missing: '" +
          valuesNotIncluded.join("', '") +
          "'.";
      }
    } catch (error) {
      console.error(error);
      output.hasErrors = true;
      output.consoleMessage =
        "ToolingAPI.checkPicklistFieldValues: " + error.toString();
    }

    return Promise.resolve(output);
  },

  /**
   * Sets given Picklist field values via Tooling API on Apex
   * @param {Object} params
   * @returns {Promise}
   */
  addPicklistFieldValues: function (params) {
    var output = {};

    try {

      if (params.output.isStandardField) {
          output.hasErrors = true;
          output.errorMessage = "Modifying standard picklists is not supported. Please see documentation " + 
                                "on how to build this step and fix on Set-Up.";
          return Promise.resolve(output);
      }

      if(params.output.errorMessage) {
        output.hasErrors = true;
        output.errorMessage = params.output.errorMessage;
        return Promise.resolve(output);
      }
      
      const givenValues = params.recordOptions.ToolingAPI.fieldValues.map(val => typeof val === 'string' ? val : val.value),
        toolingResponse = JSON.parse(params.output.toolingResponse),
        toolingSubResult = toolingResponse.compositeResponse.pop();

      const helperVal = VlocityDiagnosticWizard_ToolingAPI.picklistFieldValuesHelper({
        givenValues: givenValues,
        toolingResponse: toolingResponse,
        toolingSubResult: toolingSubResult,
        objectTableEnum: params.output.objectTableEnum
      });

      output = helperVal.output;

      if (output.hasErrors) Promise.resolve(output);

      var picklistValues = helperVal.picklistValues;
      const valuesNotIncluded = helperVal.valuesNotIncluded;

      valuesNotIncluded.forEach(function (fieldValue) {
        let elem = params.recordOptions.ToolingAPI.fieldValues.find(item => typeof item === 'string' ? fieldValue === item : fieldValue === item.value);
        if(typeof elem ==='string' ) {
            elem = {
                value: elem,
                label: elem
            }
        }

        picklistValues.push({
          color: null,
          default: false,
          description: null,
          isActive: null,
          label: elem.label,
          urls: null,
          valueName: elem.value
        });
      });

      params.recordOptions.ToolingAPI.SObjectType = "CustomField";
      params.recordOptions.ToolingAPI.objectId = toolingSubResult.body.Id;


      // We need to send all the properties that have value on the metadata
      const metadata = JSON.parse(JSON.stringify(toolingSubResult.body.Metadata, (key, value) => {
        return value === null ? undefined : value;
      }));

      // Assign the new picklist values
      metadata.valueSet.valueSetDefinition.value = picklistValues;

      // Create the payload
      params.recordOptions.ToolingAPI.objectPayload = {
        Metadata: metadata
      };

      params.recordOptions.inputMethodKey = "ExecutionMethod";
      params.recordOptions.inputMethod =
        "VlocityDiagnosticWizardBaseMethods.toolingUpdateSObject";

      return params.callApexMethod(params);
    } catch (error) {
      console.error(error);
      output.hasErrors = true;
      output.errorMessage =
        "ToolingAPI.addPicklistFieldValues: " + error.toString();
      return Promise.resolve(output);
    }
  },

  /**
   * Performs error handling logic for checkPicklistFieldValues
   * @param {*} params
   */
  picklistFieldValuesHelper: function (params) {
    var output = {};

    //Check if retrieve completed
    if (params.toolingSubResult.httpStatusCode !== 200) {
      output.hasErrors = true;
      output.errorMessage =
        "Custom Object or Custom Field does not exist. Please fix in Setup.";
      return {
        output: output
      };
    }

    //Build link for accessing field in Object manager
    try {
      const fieldId = params.toolingResponse.compositeResponse.pop().body
        .records[0].Id;

      const objectId = params.objectTableEnum ? params.objectTableEnum : params.toolingResponse.compositeResponse.pop().body.records[0].Id;

      output.checkResultUrl =
        "/lightning/setup/ObjectManager/" +
        objectId +
        "/FieldsAndRelationships/" +
        fieldId +
        "/view";
    } catch (err) {
      console.warn("Error retrieving Object Manager link: ", err);
    }

    //Retrieve field metadata
    const fieldMetadata = params.toolingSubResult.body.Metadata;

    //Check if picklist uses a global value set
    if (fieldMetadata.valueSet.valueSetName) {
      output.hasErrors = true;
      output.hasWarnings = true;
      output.errorMessage =
        "The picklist field " +
        fieldMetadata.label +
        " uses the global value set " +
        fieldMetadata.valueSet.valueSetName +
        ". Modify this in settings.";
      return Promise.resolve(output);
    }

    const picklistValues = fieldMetadata.valueSet.valueSetDefinition.value;

    const retrievedValuesMap = new Map(
      picklistValues.map(function (item) {
        return [item.valueName, item];
      })
    );

    var valuesNotIncluded = [];
    //Check that all given fields are in retrieved set
    params.givenValues.forEach(function (item) {
      if (!retrievedValuesMap.has(item)) valuesNotIncluded.push(item);
    });

    return {
      picklistValues: picklistValues,
      valuesNotIncluded: valuesNotIncluded,
      output: output
    };
  },

  /**
   * Checks that the given SObject exists via Tooling API on Apex
   * @param {Object} params
   * @returns {Promise}
   */
  checkSObjectExists: function (params) {
    var output = {};

    try {
      const toolingResponse = JSON.parse(params.output.toolingResponse),
        toolingQuery = toolingResponse.compositeResponse[0],
        toolingRetrieve = toolingResponse.compositeResponse[1];

      if (
        toolingQuery.body.totalSize === 0 ||
        toolingRetrieve.httpStatusCode !== 200
      ) {
        output.hasErrors = true;
        output.hasWarnings = true;

        const sObjType = params.recordOptions.ToolingAPI.SObjectType,
          uniqueField = params.recordOptions.ToolingAPI.UniqueField,
          uniqueValue = params.recordOptions.ToolingAPI[uniqueField];

        output.consoleMessage =
          "No record of SObject type '" +
          sObjType +
          "' exists with field " +
          uniqueField +
          "='" +
          uniqueValue +
          "'.";
      } else {
        output.hasErrors = false;
      }

      const toolingSubResult = toolingResponse.compositeResponse[1].body;
    } catch (error) {
      console.error(error);
      output.hasErrors = true;
      output.errorMessage =
        "ToolingAPI.checkSObjectExists: " + error.toString();
    }

    return Promise.resolve(output);
  },

  /**
   * Creates the given SObject payload with via Tooling API on Apex
   * @param {Object} params
   * @returns {Promise}
   */
  createSObject: function (params) {
    try {
      params.recordOptions.inputMethodKey = "ExecutionMethod";
      params.recordOptions.inputMethod =
        "VlocityDiagnosticWizardBaseMethods.toolingCreateSObject";

      return params.callApexMethod(params);
    } catch (error) {
      console.error(error);

      const output = {
        hasErrors: true,
        errorMessage: "ToolingAPI.createSObject: " + error.toString()
      };

      return Promise.resolve(output);
    }
  },

  /**
   * Prints given params to console
   * @param {Object} params
   * @returns {Promise}
   */
  printParams: function (params) {
    console.log(params);
    if (!params)
      params = {
        output: {
          hasErrors: true,
          errorMessage: "ToolingAPI.printParams did not receive parameters"
        }
      };
    return Promise.resolve(params);
  }
};
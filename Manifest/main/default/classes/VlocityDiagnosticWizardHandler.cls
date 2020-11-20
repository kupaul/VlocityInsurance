public class VlocityDiagnosticWizardHandler
{
    private static String plainNamespace = null;
    private static String namespacePrefix = null;
	public static VlocityDiagnosticWizardDescriber dc = new VlocityDiagnosticWizardDescriber();

	/**
	 * getDiagnosticSteps Performs SOQL query for UpgradeStep__c records with the Diagnostic Type (and nested related list of UpgradeStep__c)
	 * @param stepFrequency is the frequency of the UpgradeStep__c records to retrieve (in comma separated list)
	 * @return   return queried List<UpgradeStep__c> in Map form for lightning
	 */
	public static List<Map<String,Object> > getDiagnosticSteps(String stepFrequency)
	{
		if (!stepFrequency.trim().startsWith('\''))
		{
			stepFrequency = '\'' + stepFrequency.trim() + '\'';
		}

		String upgradeStepFields = 'Name, Id, ExternalId__c, UniqueId__c, RelatedBatchJobId__c,'
		                           + 'ArgumentList__c, Options__c,'
		                           + 'Description__c, Instruction__c, LastExecutionStatus__c,'
		                           + 'StepCommand__c, Priority__c, LastExecutionDateTime__c, LastCheckDateTime__c,'
		                           + 'StepExecutionOrder__c, StepFrequency__c, Tags__c, VersionIntroduced__c, Type__c,'
		                           + 'CheckResultUrl__c, LastCheckStatus__c, CustomInputLabel__c, CustomInputValue__c,'
		                           + 'CustomInputLabel2__c, CustomInputValue2__c, PreCheckMethod__c, PostCheckMethod__c,'
		                           + 'ExecutionMethod__c, ParentStepId__c, ParentStepUniqueId__c, ParentStepId__r.Name,'
		                           + 'PrecursorStepId__c, PrecursorStepUniqueId__c, PrecursorStepId__r.Name,'
		                           + 'UpgradePlanId__c, UpgradePlanId__r.Name';

		string orderBy = ' ORDER BY UpgradePlanId__r.Name, StepExecutionOrder__c NULLS LAST';

		string whereTypeEquals = ' WHERE StepFrequency__c IN (' + stepFrequency + ')';

		String upgradeStepQuery = 'SELECT ' + upgradeStepFields + ','
		                          + ' (SELECT ' + upgradeStepFields + ' FROM UpgradeSteps__r' + whereTypeEquals + orderBy + ')'
		                          + ' FROM UpgradeStep__c' + whereTypeEquals + ' AND ParentStepId__c=null AND ParentStepUniqueId__c=null'
		                          + orderBy;
		List<UpgradeStep__c> steps = Database.query(upgradeStepQuery);
		return dc.sObjectToMap_List(steps);
	}

	/**
	 * getActionSystemLogs returns the VlocitySystemLog records that track execution status related to an upgrade step
	 * @param  stepMap       stepMap is the given UpgradeStep__c record in Map form from lightning
	 * @param  numRecords    numRecords is the number of records to query
	 * @return               return List of VlocitySystemLog records of type 'UpgradeStepInvoked' in Map form for lightning
	 */
	public static List<Map<String,Object> > getActionSystemLogs(Map<String,Object> stepMap, Integer numRecords)
	{
		String systemLogFields = 'CreatedDate, LastModifiedDate, Name,'
		                         + 'vlocity_ins__ApexJobId__c, vlocity_ins__LogData__c,'
		                         + 'vlocity_ins__LogMessage__c, vlocity_ins__LogType__c,'
		                         +'vlocity_ins__ObjectName__c, vlocity_ins__ProcessName__c,'
		                         + 'vlocity_ins__ProcessStatus__c, vlocity_ins__Severity__c,'
		                         + 'vlocity_ins__TimeStamp__c, vlocity_ins__UserId__c';

		String systemLogQuery = 'SELECT ' + systemLogFields
		                        + ' FROM vlocity_ins__VlocitySystemLog__c'
		                        + ' WHERE vlocity_ins__ObjectName__c=\'' + (String)stepMap.get('ExternalId') + '\''
		                        + ' AND vlocity_ins__LogType__c=\'UpgradeStepInvoked\''
		                        + ' ORDER BY vlocity_ins__TimeStamp__c DESC NULLS LAST LIMIT ' + numRecords;

		List<vlocity_ins__VlocitySystemLog__c> logs = Database.query(systemLogQuery);
		return dc.sObjectToMap_List(logs);
	}

	/**
	 * updateDiagnosticStep updates the given UpgradeStep__c record and its corresponding VlocitySystemLog save state record
	 * @param  step UpgradeStep__c record to be updated in Map form from lightning
	 * @return      return output of action given as Map<String,Object> (to be interpreted as JSON)
	 */
	public static Map<String,Object> updateDiagnosticStep(Map<String,Object> stepMap)
	{
		Map<String,Object> output = new Map<String,Object>();
		output.put('hasErrors', false);

		//Remove fields that shouldn't be updated
		stepMap.remove('Options');

		//Create new UpgradeStep__c record
		UpgradeStep__c step = (UpgradeStep__c) dc.mapToSObject(stepMap, 'UpgradeStep__c');

		//Don't update if step in progress
		if ( stepMap.get('LastExecutionStatus') == 'In Progress' ||
		     stepMap.get('LastExecutionStatus') == 'In Progress')
		{
			return output;
		}

		try
		{
			update step;
			vlocity_ins__VlocitySystemLog__c log = getSaveStateLog(step);
			upsert log;
		}
		catch (Exception e)
		{
			throwAuraException('Error updating step: ', e);
		}

		return output;
	}

	/**
	 * getSaveStateLog returns a save state Vlocity System Log for the corresponding step
	 * @param  step step is the related UpgradeStep__c record
	 * @return      return the VlocitySystemLog__c save state record corresponding to the step
	 */
	@TestVisible
	private static vlocity_ins__VlocitySystemLog__c getSaveStateLog(UpgradeStep__c step)
	{
		system.debug('getSaveStateLog.step: ' + step);
		Map<String,Object> stepMap = dc.sObjectToMap(step);

		String logName = 'Upgrade_Step_Save_State_' + (String)stepMap.get('Id');

		Map<String, Object> logData = new Map<String,Object>();
		logData.put('record', dc.sObjectToMap(step, false));

		vlocity_ins__VlocitySystemLog__c log;

		String systemLogFields = 'Name';
		String systemLogQuery = 'SELECT ' + systemLogFields
		                        + ' FROM vlocity_ins__VlocitySystemLog__c'
		                        + ' WHERE vlocity_ins__ObjectName__c=\'' + (String) stepMap.get('ExternalId') + '\''
		                        + ' AND vlocity_ins__LogType__c=\'' + 'UpgradeStepSaveState' + '\'';

		try
		{
			List<vlocity_ins__VlocitySystemLog__c> logs = Database.query(systemLogQuery);
			log = logs[0];
		}
		catch (Exception e)
		{
			log = new vlocity_ins__VlocitySystemLog__c();
		}

		log.Name = logName;
		log.vlocity_ins__ObjectName__c = (String) stepMap.get('ExternalId');
		log.vlocity_ins__LogMessage__c = 'This record acts as a Save State for the corresponding Upgrade Step';
		log.vlocity_ins__LogData__c = (String) JSON.serialize(logData);
		log.vlocity_ins__LogType__c = 'UpgradeStepSaveState';
		log.vlocity_ins__TimeStamp__c = System.now();
		log.vlocity_ins__UserId__c = (String) UserInfo.getUserId();
		log.vlocity_ins__ProcessName__c = 'UpgradeStepSaveState';

		return log;
	}

	/**
	 * invokeAction is the server-side handler for executing an upgrade step,
	 *   checking that the given step's precursor step (if defined) is complete, and then
	 *   prepares the inputs for and calls invokeMethod(...), or creates a step log if the
	 *   step was of type "Manual" or "Group"
	 * @param  stepMap stepMap is the upgrade step to invoke in Map form from lightning
	 * @param  options options are the parameters passed to the VlocityOpenInterface2 method
	 * @return         return the output of invoking the step as a Map<String,Object>
	 */
	public static Map<String,Object> invokeAction(Map<String,Object> stepMap, Map<String,Object> options)
	{
		//Declarations
		UpgradeStep__c step = (UpgradeStep__c) dc.mapToSObject(stepMap, 'UpgradeStep__c');

		Map<String,Object> output = new Map<String,Object> {'hasErrors'=>false, 'errorMessage'=>''};
		String inputMethodKey,
		       inputMethod;

		if (options == null || options.isEmpty())
		{
			System.debug('No options specified.');
			output.put('hasErrors', true);
			return output;	
		}

		if (options != null)
		{
            String newNs = dc.ns == null ? '' : dc.ns;
			String optionsReplaceString = (JSON.serialize(options)).replace('$VlocityNS', newNs);
			options = (Map<String, Object>) JSON.deserializeUntyped(optionsReplaceString);
		}

		inputMethodKey = (String) options.get('inputMethodKey');
		inputMethod = (String) options.get('inputMethod');

		output.put('inputMethodKey', inputMethodKey);
		output.put('inputMethod', inputMethod);

		Map<String,Object> precursorStepStatus = getPrecursorStepStatus(step);

		if (inputMethodKey == 'ExecutionMethod' && !(Boolean)precursorStepStatus.get('isComplete'))
		{
			output.put('errorMessage', 'Please complete '
			           + precursorStepStatus.get('precursorStepName')
			           + ' before this step.');
			output.put('hasErrors', true);
			return output;
		}
		else if (!String.isBlank(inputMethod))
		{
			return invokeMethod(step, output, options);
		}
		else if (inputMethodKey == 'ExecutionMethod')
		{
			System.debug('Creating Step Log');
			output.put('logCreated', true);
			createStepLog(step, null, output, 'MarkedComplete');
		}

		System.debug('inputMethod was empty');
		return output;
	}

	/**
	 * invokeMethod invokes the corresponding VlocityOpenInterface2 implementation method/class given in the options
	 * @param  step    step UpgradeStep__c to be invoked
	 * @return         return output of action given as Map<String,Object> (to be interpreted as JSON)
	 */
	private static Map<String,Object> invokeMethod(UpgradeStep__c step, Map<String,Object> output, Map<String,Object> options)
	{
		Map<String,Object> inputs = new Map<String,Object>();
		inputs.put('record', step);

		String inputMethodKey = (String) options.get('inputMethodKey');
		String inputMethod = (String) options.get('inputMethod');

		if (String.isBlank(inputMethodKey))
		{
            output.put('hasErrors', true);
            output.put('errorMessage', 'Property "inputMethodKey" not given in options parameter.');
            return output;
		}

		if (String.isBlank(inputMethod))
		{
            output.put('hasErrors', true);
            output.put('errorMessage', 'Property "inputMethod" not given in options parameter.');
            return output;
		}

		try
		{
            // Split the input method in order to get the parts
            List<String> parts = inputMethod.split('\\.');

            // Validate the input method
            if(parts.size() < 2 || parts.size() > 3)
            {
                output.put('hasErrors', true);
                output.put('errorMessage', 'Invalid "inputMethod". Must be in the "namespace.class.method" or "class.method" format.');
                return output;
            }

            // Build the input method we are going to use
            String namespace = parts.size() == 3 ? parts[0] : '';
			String className = parts.size() == 3 ? parts[1] : parts[0];
			String methodName = parts.size() == 3 ? parts[2] : parts[1];
			output.put('NAMESPACE', namespace);
			output.put('CLASSNAME', className);
			output.put('METHODNAME', methodName);

			// Replaces namespace with the managed package's namespace
			if(namespace == '$VlocityNS') 
			{
				namespace = dc.ns != null ? dc.ns : '';
			}

            // Get the type of the class we will create
			Type classType = Type.forName(namespace, className);
			
            //OPEN INTERFACE
			if (classType.newInstance() instanceof vlocity_ins.VlocityOpenInterface2)
			{
				//invoke the method
				vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();
				Object result = classInstance.invokeMethod(methodName, inputs, output, options);
				//If calling an Auto task (not a check) create a new vlocity_ins__VlocitySystemLog__c
				if (inputMethodKey == 'ExecutionMethod')
				{
					createStepLog(step, result, output, 'ActionInvoked');
				}
				else if (inputMethodKey == 'PostCheckMethod')
				{
					createStepLog(step, result, output, 'ActionVerified');
				}
			}
		}
		catch (Exception e)
		{
            output.put('hasErrors', true);
            output.put('errorMessage', 'There was an error while trying to execute the step. Please verify your execution methods.');
            System.debug(LoggingLevel.ERROR, e);
		}
		return output;
	}

	/**
	 * createStepLog creates the vlocity_ins__VlocitySystemLog__c record corresponding to a step action
	 * @param  step   step is the UpgradeStep__c record that has been activated
	 * @param  result result is the returned value of the invoked method
	 * @param  output output is the output value of the invoked method
	 * @param  prefix prefix is the prefix of the log's name (like 'ActionInvoked')
	 */
	@TestVisible
	private static void createStepLog(UpgradeStep__c step, Object result, Map<String, Object> output, String prefix)
	{
        String namespace = VlocityDiagnosticWizardHandler.getNameSpacePrefix();
		Map<String,Object> stepMap = step.getPopulatedFieldsAsMap();
		Boolean hasErrors = output!=null && output.get('hasErrors')!=null && output.get('hasErrors')!=false;
		String logName = prefix+'_'+(String)stepMap.get(namespace + 'Type__c')+'_'+(String)stepMap.get('Id');
		String logMessage = 'Vlocity Diagnostic Wizard step: "'+(String)stepMap.get('Name')
		                    + '" of type: "'+(String)stepMap.get(namespace + 'Type__c')
		                    + '" executed with success status: "'
		                    + !hasErrors + '".';
		Map<String, Object> logData = new Map<String,Object>();
		logData.put('output', output);
		logData.put('result', result);
		logData.put('record', dc.sObjectToMap(step, false));

		vlocity_ins__VlocitySystemLog__c log = new vlocity_ins__VlocitySystemLog__c(
			Name=logName,
			vlocity_ins__ObjectName__c = (String)stepMap.get(namespace + 'ExternalId__c'),
			vlocity_ins__LogMessage__c = logMessage,
			vlocity_ins__LogData__c = (String)JSON.serialize(logData),
			vlocity_ins__LogType__c = 'UpgradeStepInvoked',
			vlocity_ins__TimeStamp__c = (Datetime)stepMap.get(namespace + 'LastExecutionDateTime__c'),
			vlocity_ins__UserId__c = (String)UserInfo.getUserId(),
			vlocity_ins__ProcessName__c = (String)stepMap.get(namespace + 'Method__c')
			);

		insert log;
	}

	/**
	 * isStepComplete returns whether the given step is complete
	 * @param  step is the UpgradeStep__c record to be checked
	 * @return      return Boolean whether step is complete
	 */
	public static Boolean isStepComplete(UpgradeStep__c step)
	{
		return step.LastCheckStatus__c == 'Complete' ||
		       (step.LastCheckStatus__c == 'No Check Method' &&
		        step.LastExecutionStatus__c == 'Complete');
	}

	/**
	 * isPrecursorStepComplete returns whether the steps precursor (defined in lookup field 'PrecursorStepId') is complete
	 * @param  step is the UpgradeStep__c record to be checked
	 * @return      return Boolean whether the queried precursor step is complete
	 */
	public static Map<String, Object> getPrecursorStepStatus(UpgradeStep__c step)
	{
		Map<String,Object> stepAsMap = dc.sObjectToMap(step);
		Map<String,Object> output = new Map<String,Object> {'precursorStepName'=>'', 'isComplete'=>true};

        // If this is a child step, let's check the parent 
		Map<String,Object> parentOutput = new Map<String,Object> {'precursorStepName'=>'', 'isComplete'=>true};
        if(stepAsMap.get('ParentStepId') != null)
        {
            // Get the parent step
            UpgradeStep__c parentStep = [SELECT Id, Name, Type__c, LastCheckStatus__c, LastExecutionStatus__c, 
                                        ParentStepId__c, PrecursorStepId__c 
                                        FROM UpgradeStep__c WHERE Id = :step.ParentStepId__c];
            parentOutput = getPrecursorStepStatus(parentStep);
        }

        // Check the precursor step
		if (stepAsMap.get('PrecursorStepId') != null)
		{
			List<UpgradeStep__c> precursorSteps = [SELECT Id, Name, Type__c, LastCheckStatus__c, LastExecutionStatus__c, 
                                                   PrecursorStepId__c FROM UpgradeStep__c WHERE Id=: step.PrecursorStepId__c];

			if (!precursorSteps.isEmpty())
			{
                // If the step is group, look for the precursor
                if(precursorSteps[0].Type__c == 'Group')
                {
                    // If the group element has no precursor, just return complete true.
                    // Otherwise, it will never be able to complete
                    if(precursorSteps[0].PrecursorStepId__c != null)
                    {
                        // Get the precursor step of the precursor group
                        output = getPrecursorStepStatus(precursorSteps[0]);
                    }
                }
                else
                {
                    // Set the name of the precursor step
                    output.put('precursorStepName', precursorSteps[0].Name);
                    output.put('isComplete', isStepComplete(precursorSteps[0]));
                }          
			}
		}

        // Create a list of steps that needs to be completed
        Boolean allComplete = output.get('isComplete') == true && parentOutput.get('isComplete') == true;
        List<Object> names = new List<Object> { output.get('precursorStepName') };
        if(parentOutput.get('isComplete') == false)
        {
            names.add(parentOutput.get('precursorStepName'));
        }

        output.put('isComplete', allComplete);
        output.put('precursorStepName', String.join(names, ' and '));

		return output;
	}

	/**
	 * getStepCreatorMaps returns list of Maps created from queried 'VlocityStepCreator_XXX' JSON static resources
	 * @return   return List<Map<String,Object>> containing the contents of the queried static resources, in a normalized format for lightning (no namespaces)
	 */
	public static List<Map<String,Object> > getStepCreatorMaps(){

		List<Map<String,Object> > stepCreatorMaps = new List<Map<String,Object> >();
		try
		{
			List<String> staticResourceContents = new List<String>();

			for (StaticResource sr : [SELECT Id, Name, Body FROM StaticResource WHERE Name LIKE '%VlocityStepCreator%'])
			{
				staticResourceContents.add(sr.Body.toString());
			}

			if (Test.isRunningTest())
			{
				staticResourceContents = VlocityDiagnosticWizardTestDataFactory.createStepCreatorData(5);
			}

			for (String src : staticResourceContents)
			{
				stepCreatorMaps.add(dc.normalizeJSON(src));
			}
		}
		catch (Exception e)
		{
			throwAuraException('', e);
		}

		return stepCreatorMaps;
	}

	/**
	 * upsertAllPlans queries all static resources containing "VlocityStepCreator", and upserts the created upgrade plans and steps
	 * @param  cleanAllSteps cleanAllStepsis the override to wipe, instead of restoring step status
	 * @return   return if upsert was successful as Map<String,Output>
	 */
	public static Map<String,Object> upsertAllPlans(Boolean cleanAllSteps)
	{
		Map<String,Object> output = new Map<String,Object> {'hasErrors' => true};

		List<UpgradePlan__c> allPlans = new List<UpgradePlan__c>();
		List<UpgradeStep__c> allSteps = new List<UpgradeStep__c>();

		try
		{
			//Delete existing steps before restoring them
			deleteAllSteps();

			//Retrieve step creator static resource contents
			List<Map<String,Object> > stepCreators = getStepCreatorMaps();

			for (Map<String,Object> stepCreator : stepCreators)
			{
				UpgradePlan__c plan = (UpgradePlan__c) dc.mapToSObject((Map<String,Object>) stepCreator.get('plan'), 'UpgradePlan__c');
				stepCreator.put('plan', plan);

				if (plan != null && !String.isBlank(plan.Name) && !String.isBlank(plan.UniqueId__c))
				{
					allPlans.add(plan);
				}
			}

			Database.upsert(allPlans, UpgradePlan__c.Fields.UniqueId__c, true);

			for (Map<String,Object> stepCreator : stepCreators)
			{
				List<UpgradeStep__c> steps = (List<UpgradeStep__c>) dc.mapToSObject_List((List<Object>) stepCreator.get('steps'), 'UpgradeStep__c');
				stepCreator.put('steps', steps);

				if (steps != null)
				{
					steps = prepareSteps((UpgradePlan__c) stepCreator.get('plan'), steps);
					allSteps.addAll(steps);
				}
			}

			//Wipe or restore step status
			if (cleanAllSteps)
			{
				allSteps = cleanSteps(allSteps);
			}
			else
			{
				allSteps = restoreSteps(allSteps);
			}

			Database.upsert(allSteps, UpgradeStep__c.Fields.UniqueId__c, true);
			//Second upsert links parent and precursor steps
			Database.upsert(allSteps, UpgradeStep__c.Fields.UniqueId__c, true);

			output.put('hasErrors', false);
		}
		catch (Exception e)
		{
			throwAuraException('', e);
		}

		return output;
	}

	/**
	 * prepareSteps prepares the list of given UpgradeStep__c records (adding their Execution Order number and Upgrade Plan Id lookup) and checks them for errors
	 * @param  plan  plan is the parent UpgradePlan__c record of steps
	 * @param  steps steps are the UpgradeStep__c records to be prepared
	 * @return       return the prepared steps
	 */
	@TestVisible
	private static List<UpgradeStep__c> prepareSteps(UpgradePlan__c plan, List<UpgradeStep__c> steps)
	{
		Integer stepsLen = steps.Size();
		for (Integer i = 0; i < stepsLen; i++)
		{
			UpgradeStep__c step = steps[i];

			step.StepExecutionOrder__c = i;
			step.UpgradePlanId__c = plan.Id;

			if (String.isBlank(step.Name))
			{
				throw new VlocityDiagnosticWizardDMLException('The Upgrade Step record at index ' + i +
				                                              ' in the Upgrade Plan "' + plan.Name + '" has no value in the Name field.');
			}
			else if (String.isBlank(step.ExternalId__c))
			{
				throw new VlocityDiagnosticWizardDMLException('The Upgrade Step record "' + step.Name + '" at index ' + i +
				                                              ' in the Upgrade Plan "' + plan.Name + '" has no value in the ExternalId__c field.');
			}
			else if (String.isBlank(step.UniqueId__c))
			{
				throw new VlocityDiagnosticWizardDMLException('The Upgrade Step record "' + step.Name + '" at index ' + i +
				                                              ' in the Upgrade Plan "' + plan.Name + '" has no value in the UniqueId__c field.');
			}
		}

		return steps;
	}

	/**
	 * restoreSteps takes in a list of UpgradeStep__c records and attempts to retrieve System Log Save States for them, then restores their status based on those logs
	 * @param  steps is the list of UpgradeStep__c records
	 * @return       return the list of steps ready to be upserted
	 */
	@TestVisible
	private static List<UpgradeStep__c> restoreSteps(List<UpgradeStep__c> steps)
	{
		List<String> stepExternalIds = new List<String>();
		List<vlocity_ins__VlocitySystemLog__c> logs;
		Map<String,vlocity_ins__VlocitySystemLog__c> logsMap = new Map<String,vlocity_ins__VlocitySystemLog__c>();

		//Get list of Step External Ids
		for (UpgradeStep__c step : steps)
		{
			stepExternalIds.add(step.ExternalId__c);
		}

		//Retrieve corresponding save state logs
		logs = [SELECT Name, vlocity_ins__ApexJobId__c, vlocity_ins__LogData__c,
		        vlocity_ins__LogMessage__c, vlocity_ins__LogType__c,
		        vlocity_ins__ObjectName__c, vlocity_ins__ProcessName__c,
		        vlocity_ins__ProcessStatus__c, vlocity_ins__Severity__c,
		        vlocity_ins__TimeStamp__c, vlocity_ins__UserId__c
		        FROM vlocity_ins__VlocitySystemLog__c
		        WHERE vlocity_ins__LogType__c=: 'UpgradeStepSaveState'
		                                       AND vlocity_ins__ObjectName__c IN: stepExternalIds];

		//Build logsMap
		for (vlocity_ins__VlocitySystemLog__c log : logs)
		{
			logsMap.put(log.vlocity_ins__ObjectName__c, log);
		}

		for (UpgradeStep__c step : steps)
		{
			//Choose which steps should be restored, and which should be reset
			Boolean restoreThisStep = step.StepFrequency__c == 'Upgrade' || step.StepFrequency__c == 'First Install' || step.StepFrequency__c == 'Upgrade / First Install';

			if (logsMap.containsKey(step.ExternalId__c) && restoreThisStep)
			{
				vlocity_ins__VlocitySystemLog__c log = logsMap.get(step.ExternalId__c);
				Map<String,Object> logData = (Map<String,Object>) JSON.deserializeUntyped(log.vlocity_ins__LogData__c);
				Map<String,Object> logStepMap = (Map<String,Object>) logData.get('record');

				step.LastExecutionStatus__c = logStepMap.containsKey('LastExecutionStatus__c')
				                              ? (String)logStepMap.get('LastExecutionStatus__c')
				                              : 'Not Started';

				step.Description__c = logStepMap.containsKey('Description__c')
				                      ? (String)logStepMap.get('Description__c')
				                      : 'Not Started';

				step.LastCheckStatus__c = logStepMap.containsKey('LastCheckStatus__c')
				                          ? (String)logStepMap.get('LastCheckStatus__c')
				                          : 'Not Started';

				step.LastExecutionDateTime__c = logStepMap.get('LastExecutionDateTime__c') != null
				                                ? (DateTime) JSON.deserialize(JSON.serialize(logStepMap.get('LastExecutionDateTime__c')), DateTime.class)
				                                : null;

				step.LastCheckDateTime__c = logStepMap.get('LastCheckDateTime__c') != null
				                            ? (DateTime) JSON.deserialize(JSON.serialize(logStepMap.get('LastCheckDateTime__c')), DateTime.class)
				                            : null;

				step.RelatedBatchJobId__c = (Id)logStepMap.get('RelatedBatchJobId__c');

					System.debug(
				        'Restored Upgrade Step: ' + step.Name + '\n' +
				        'Values:' + '\n' +
				        'LastExecutionStatus:' + step.LastExecutionStatus__c + '\n' +
				        'LastCheckStatus:' + step.LastCheckStatus__c + '\n' +
				        'LastExecutionDateTime:' + step.LastExecutionDateTime__c + '\n' +
				        'LastCheckDateTime:' + step.LastCheckDateTime__c + '\n' +
				        'Description:' + step.Description__c
				        );
			}
			else
			{
				step.LastExecutionStatus__c = 'Not Started';
				step.LastCheckStatus__c = 'Not Started';
				step.LastExecutionDateTime__c = null;
				step.LastCheckDateTime__c = null;
				step.Description__c = '';
			}
		}

		return steps;
	}

	/**
	 * cleanSteps wipes UpgradeStep__c records status
	 * @param  steps steps is the list of UpgradeStep__c records
	 * @return       return cleaned list of steps ready to be upserted
	 */
	private static List<UpgradeStep__c> cleanSteps(List<UpgradeStep__c> steps)
	{
		for (UpgradeStep__c step : steps)
		{
			step.LastExecutionStatus__c = 'Not Started';
			step.LastCheckStatus__c = 'Not Started';
			step.LastExecutionDateTime__c = null;
			step.LastCheckDateTime__c = null;
		}
		return steps;
	}

	/**
	 * deleteAll deletes all UpgradeStep__c and UpgradePlan__c records in the org
	 */
	public static void deleteAllSteps()
	{
		List<UpgradeStep__c> steps = [SELECT Id, Name FROM UpgradeStep__c];
		List<UpgradePlan__c> plans = [SELECT Id, Name FROM UpgradePlan__c];
		delete steps;
		delete plans;
	}

	/**
	 * getVFSessionId returns the current session Id from the VlocityDiagnosticWizard_ApexPage, which allows access to the Tooling API via lightning
	 * @return   return current session Id as String
	 */
	public static String getVFSessionId()
	{
		String apexPageContent = '{}';

		if (!Test.isRunningTest())
		{
			apexPageContent = Page.VlocityDiagnosticWizard_ApexPage.getContent().toString();
		}

		return (String) ((Map<String,Object>) JSON.deserializeUntyped(apexPageContent)).get('sessionId');
	}

	/**
	 * getBaseUrl returns the lightning friendly URL of the org
	 * @return   return URL as string
	 */
	public static string getBaseUrl(){
	  return dc.baseUrl;
	}

	/**
	 * throwAuraException is a utility method to throw an AuraHandledException (which is accessible through lightning).
	 *    The given message/error is also System.debugged in order to find the cause in the debug console if needed.
	 * @param  auraMessage auraMessage is the optional custom message to be thrown. 
	 * @param  e           e is the optional error 
	 */
	public static void throwAuraException(String auraMessage, Exception e)
	{
		if (String.isBlank(auraMessage))
		{
			auraMessage = '';
		}

		//Set initial message to be debugged
		String debugMessage = 'Throwing Aura Error with error message: ' + auraMessage + '\n';

		//throw bubbled System.AuraHandledExceptions instead of recasting them
		if (e.getTypeName() == 'System.AuraHandledException')
		{
			throw e;
		}
		else if (e != null)
		{
			//Add error message
			auraMessage += e.getMessage();
			debugMessage = 'Throwing Aura Error with error message: ' + auraMessage + '\n'
		             +'- Type: ' + e.getTypeName() + '\n'
		             + '- Message: ' + e.getMessage() + '\n'
		             + '- Cause: ' + e.getCause() + '\n'
		             + '- Stack Trace String: ' + e.getStackTraceString() + '\n'
		             + '- Line Number: ' + e.getLineNumber() + '\n';
		}

		//Debug message
		System.debug(debugMessage);

		throw Test.isRunningTest() ? e : new AuraHandledException(auraMessage);
	}

    public static String getNamespace()
    {
        if (plainNamespace == null)
        {
            String withDotNotation = VlocityDiagnosticWizardHandler.class.getName();

            if (withDotNotation.contains('.'))
            {
                plainNamespace = withDotNotation.substringBefore('.');
            }
            else
            {
                plainNamespace = '';
            }
        }
        return plainNamespace;
    }

    public static String getNameSpacePrefix()
    {
        if (namespacePrefix == null)
        {
            namespacePrefix = String.isNotBlank(getNamespace()) ? getNamespace() + '__' : '';
        }

        return namespacePrefix;
    }

	public class VlocityDiagnosticWizardDMLException extends Exception {}
}
public class VlocityDiagnosticStepCreatorHandler {

	private static VlocityDiagnosticWizardDescriber dc = new VlocityDiagnosticWizardDescriber();
	
	/**
	 * getSaveStateAndStepCreators returns a Map containing the SaveState VlocitySystemLog record for the specific user,
	 * as well as the queried VlocityStepCreator_ JSON static resources contents
	 * @return   return Map<String,Output> (in form {'saveState'=>{...}, 'stepCreators'=>[...] })
	 */
	public static Map<String,Object> getSaveStateAndStepCreators()
	{
		Map<String,Object> output = new Map<String,Object>();

		output.put('saveState', getSaveState());
		output.put('stepCreators', VlocityDiagnosticWizardController.getStepCreatorMaps());

		return output;
	}

	/**
	 * getSaveState returns the 'StepCreatorSaveState' VlocitySystemLog__c record corresponding to the current user
	 * @return   return given VlocitySystemLog__c record as a Map<String,Object>
	 */
	public static Map<String,Object> getSaveState()
	{
		try
		{
			Id userId = UserInfo.getUserId();

			List<vlocity_ins__VlocitySystemLog__c> logs = [SELECT Name, vlocity_ins__ApexJobId__c, vlocity_ins__LogData__c,
			                                               vlocity_ins__LogMessage__c, vlocity_ins__LogType__c,
			                                               vlocity_ins__ObjectName__c, vlocity_ins__ProcessName__c,
			                                               vlocity_ins__ProcessStatus__c, vlocity_ins__Severity__c,
			                                               vlocity_ins__TimeStamp__c, vlocity_ins__UserId__c
			                                               FROM vlocity_ins__VlocitySystemLog__c
			                                               WHERE vlocity_ins__LogType__c=: 'StepCreatorSaveState'
			                                                                              AND vlocity_ins__UserId__c=: userId];

			if ( logs.isEmpty() )
			{
				vlocity_ins__VlocitySystemLog__c saveState =  new vlocity_ins__VlocitySystemLog__c(
					Name='StepCreatorSaveState'+userId,
					vlocity_ins__LogData__c = '',
					vlocity_ins__LogType__c= 'StepCreatorSaveState',
					vlocity_ins__UserId__c= userId
					);
				insert saveState;
				return dc.sObjectToMap(saveState);
			}
			else
			{
				return dc.sObjectToMap(logs[0]);
			}
		}
		catch (Exception e)
		{
			VlocityDiagnosticWizardController.throwAuraException('Error retrieving save state:', e);
			return null;
		}
	}

	/**
	 * updateSaveState updates the given VlocitySystemLog__c record
	 * @param  saveStateMap saveStateMap is deserialized JSON to be converted back into a VlocitySystemLog__c record 
	 * @return              return output of action given as Map<String,Object> (to be interpreted as JSON)
	 */
	public static Map<String,Object> updateSaveState(Map<String,Object> saveStateMap)
	{
		vlocity_ins__VlocitySystemLog__c saveState = (vlocity_ins__VlocitySystemLog__c) dc.mapToSObject(saveStateMap, 'vlocity_ins__VlocitySystemLog__c');

		Map<String,Object> output = new Map<String,Object> {'hasErrors' => true};
		try
		{
			Id userId = UserInfo.getUserId();
			saveState.Name='StepCreatorSaveState' + userId;
			saveState.vlocity_ins__LogType__c= 'StepCreatorSaveState';
			saveState.vlocity_ins__UserId__c = userId;
			upsert saveState;
			output.put('hasErrors', false);
		}
		catch (Exception e)
		{
			VlocityDiagnosticWizardController.throwAuraException('Error updating save state:', e);
		}
		return output;
	}

	/**
	 * saveStaticResource uses the VlocityDiagnosticWizardBaseMethods Tooling API methods to
	 *         create or update a static resource with the given name and payload
	 * @param  payload  payload is the deserialized JSON object containing the static resource content and parameters
	 * @return          return output of action given as Map<String,Object> (to be interpreted as JSON)
	 */
	public static Map<String,Object> saveStaticResource(Map<String,Object> payload)
	{
		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object> {'hasErrors' => true};
		Map<String,Object> options = new Map<String,Object>();

		if (!payload.containsKey('Name'))
		{
			VlocityDiagnosticWizardController.throwAuraException('Payload does not contain "Name"/"fileName" property.', null);
		}

		try
		{
			String fileName = (String) payload.get('Name');
			
			List<StaticResource> staticResourceFiles = [SELECT Name, Id, Body FROM StaticResource WHERE Name=:fileName];

			options.put(
				'ToolingAPI',
				new Map<String,Object> {
				'SObjectType' => 'StaticResource',
				'objectPayload' => payload
			}
				);

			VlocityDiagnosticWizardBaseMethods helperClass = new VlocityDiagnosticWizardBaseMethods();

			if (!staticResourceFiles.isEmpty())
			{
				((Map<String,Object>) options.get('ToolingAPI')).put('objectId', staticResourceFiles[0].Id);

				helperClass.invokeMethod('toolingUpdateSObject',inputs, output, options);
			}
			else
			{
				helperClass.invokeMethod('toolingCreateSObject',inputs, output, options);
			}

			output.put('hasErrors', false);
		}
		catch (AuraException e)
		{
			VlocityDiagnosticWizardController.throwAuraException('Error updating save state:', e);
		}

		return output;
	}
}
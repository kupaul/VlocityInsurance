public class VlocityDiagnosticWizardController
{
	/**
	 * getDiagnosticSteps Performs SOQL query for UpgradeStep__c records (and nested related list of UpgradeStep__c records)
	 * @param payload  payload is the comma separated list of step frequencies to query for ('Upgrade', 'First Install', 'Diagnostic')
	 * @return         return queried List<UpgradeStep__c> in Map form
	 */
	@AuraEnabled
	public static List<Map<String,Object> > getDiagnosticSteps(String payload)
	{
		return VlocityDiagnosticWizardHandler.getDiagnosticSteps(payload);
	}

	/**
	 * getActionSystemLogs queries VlocitySystemLog__c records related to step
	 * @param  payload    payload is the stringified JSON containing the keys:
	 *                step       step is the selected UpgradeStep__c
	 *                numRecords numRecords is the number of records to return
	 * @return            return list of VlocitySystemLog__c records in Map form related to step
	 */
	@AuraEnabled
	public static List<Map<String,Object> > getActionSystemLogs(String payload)
	{
		Map<String,Object> payloadMap = (Map<String,Object>) JSON.deserializeUntyped(payload);
		Map<String,Object> step = (Map<String,Object>) payloadMap.get('step');
		Integer numRecords = (Integer) payloadMap.get('numRecords');

		return VlocityDiagnosticWizardHandler.getActionSystemLogs(step, numRecords);
	}

	/**
	 * getStepCreatorMaps returns list of Maps created from queried 'VlocityStepCreator_*' JSON static resources
	 * @return   return List<Map<String,Object>> of static resource contents
	 */
	@AuraEnabled
	public static List<Map<String,Object> > getStepCreatorMaps()
	{
		return VlocityDiagnosticWizardHandler.getStepCreatorMaps();
	}

	/**
	 * updateDiagnosticStep updates given UpgradeStep__c from VlocityDiagnosticWizard
	 * @param  payload  payload is the stringified JSON with the key step, which contains UpgradeStep__c record in map form to be updated
	 * @return      return output of action given as Map<String,Object> (to be interpreted as JSON)
	 */
	@AuraEnabled
	public static Map<String,Object> updateDiagnosticStep(String payload)
	{
		Map<String,Object> payloadMap = (Map<String,Object>) JSON.deserializeUntyped(payload);
		Map<String,Object> step = (Map<String,Object>) payloadMap.get('step');

		return VlocityDiagnosticWizardHandler.updateDiagnosticStep(step);
	}

	/**
	 * invokeAction executes the step's action, given in the options key under the payload
	 * @param  payload payload is the stringified JSON containing the keys:
	 *                   step       step is the selected UpgradeStep__c record in Map form
	 *                   options    options are the options used to pass to the VlocityOpenInterface2 method, 
	 *								and contain details regarding whether the action is a pre-validation, post-validation or execution action
	 * @return      return output of action given as Map<String,Object> (to be interpreted as JSON)
	 */
	@AuraEnabled
	public static Map<String,Object> invokeAction(String payload)
	{
		Map<String,Object> payloadMap = (Map<String,Object>) JSON.deserializeUntyped(payload);
		Map<String,Object> step = (Map<String,Object>) payloadMap.get('step');
		Map<String,Object> options = (Map<String,Object>) payloadMap.get('options');

		return VlocityDiagnosticWizardHandler.invokeAction(step, options);
	}

	/**
	 * upsertAllPlans queries all Static Resources ending in "StepCreator," checks if they are an valid StepCreator JSON files,
	 * and upserts the created upgrade plans and steps
	 * @return   return upsert result as map (nothing or error message)
	 */
	@AuraEnabled
	public static Map<String,Object> upsertAllPlans()
	{
		return VlocityDiagnosticWizardHandler.upsertAllPlans(false);
	}

	/**
	 * getVFSessionId returns the current session Id from a created VFPage (this gives more permissions than the standard lightning session Id)
	 * @return   return current session Id
	 */
	@AuraEnabled
	public static String getVFSessionId()
	{
		return VlocityDiagnosticWizardHandler.getVFSessionId();
	}

	/**
	 * getBaseUrl returns the lightning friendly URL of the org
	 * @return   return URL as string
	 */
	@AuraEnabled
	public static String getBaseUrl(){
		return VlocityDiagnosticWizardHandler.getBaseUrl();
	}

	/**
	 * throwAuraException throws an AuraHandledException regularily, but throws the inputted Exception if called through a test
	 * @param  auraMessage auraMessage description
	 * @param  e           e is the exception being thrown
	 */
	public static void throwAuraException(String auraMessage, Exception e)
	{
		VlocityDiagnosticWizardHandler.throwAuraException(auraMessage, e);
	}
}
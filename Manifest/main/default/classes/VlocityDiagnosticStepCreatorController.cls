public class VlocityDiagnosticStepCreatorController {

	/**
	 * updateSaveState updates the given VlocitySystemLog__c record
	 * @param  payload payload is a stringified JSON containing the key 'saveState', the save state of the Vlocity Diagnostic Step Creator to be saved as a VlocitySystemLog__c record
	 * @return         return output of action given as Map<String,Object> (to be interpreted as JSON)
	 */
	@AuraEnabled
	public static Map<String,Object> updateSaveState(String payload)
	{
		Map<String,Object> payloadMap = (Map<String,Object>) JSON.deserializeUntyped(payload);
		Map<String,Object> saveState = (Map<String,Object>) payloadMap.get('saveState');

		return VlocityDiagnosticStepCreatorHandler.updateSaveState(saveState);
	}

	/**
	 * getSaveStateAndStepCreators returns a Map containing the SaveState VlocitySystemLog record for the specific user,
	 * as well as the queried VlocityStepCreator_ JSON static resources contents
	 * @return   return Map<String,Output> (in form {'saveState'=>{...}, 'stepCreators'=>[...] })
	 */
	@AuraEnabled
	public static Map<String,Object> getSaveStateAndStepCreators()
	{
		return VlocityDiagnosticStepCreatorHandler.getSaveStateAndStepCreators();
	}

	/**
	 * saveStaticResource uses the VlocityDiagnosticWizardBaseMethods Tooling API methods to
	 *         create or update a static resource with the given name and payload
	 * @param  payload  payload is the JSON object containing the static resource content and parameters
	 * @return          return output of action given as Map<String,Object> (to be interpreted as JSON)
	 */
	@AuraEnabled
	public static Map<String,Object> saveStaticResource(String payload)
	{
		Map<String,Object> payloadMap = (Map<String,Object>) JSON.deserializeUntyped(payload);
		return VlocityDiagnosticStepCreatorHandler.saveStaticResource(payloadMap);
	}
}
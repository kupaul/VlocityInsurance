@isTest
private class VlocityDiagnosticStepCreatorTest {

	@isTest static void getSaveStateTest()
	{
		VlocityDiagnosticWizardDescriber dc = new VlocityDiagnosticWizardDescriber();
		dc.nsPrefix = 'vlocity_ins__';

		Map<String,Object> output = VlocityDiagnosticStepCreatorHandler.getSaveState();

		vlocity_ins__VlocitySystemLog__c saveState = (vlocity_ins__VlocitySystemLog__c) dc.mapToSObject(output, 'VlocitySystemLog__c');

		System.assertEquals(saveState.vlocity_ins__LogType__c, 'StepCreatorSaveState');
	}

	@isTest static void getSaveStateAndStepCreatorsTest()
	{
		VlocityDiagnosticWizardDescriber dc = new VlocityDiagnosticWizardDescriber();
		dc.nsPrefix = 'vlocity_ins__';

		Map<String,Object> output = VlocityDiagnosticStepCreatorController.getSaveStateAndStepCreators();

		vlocity_ins__VlocitySystemLog__c saveState = (vlocity_ins__VlocitySystemLog__c) dc.mapToSObject((Map<String,Object>)output.get('saveState'), 'vlocity_ins__VlocitySystemLog__c');

		System.assertEquals(saveState.vlocity_ins__LogType__c, 'StepCreatorSaveState');
	}

	@isTest static void updateSaveStateTest()
	{
		VlocityDiagnosticWizardDescriber dc = new VlocityDiagnosticWizardDescriber();
		dc.nsPrefix = 'vlocity_ins__';
		
		Id userId = UserInfo.getUserId();

		vlocity_ins__VlocitySystemLog__c saveState =  new vlocity_ins__VlocitySystemLog__c(
			Name='StepCreatorSaveState'+userId,
			vlocity_ins__LogData__c = VlocityDiagnosticWizardTestDataFactory.randomString(50),
			vlocity_ins__LogType__c= 'StepCreatorSaveState',
			vlocity_ins__UserId__c= userId
			);

		Map<String,Object> payload = new Map<String,Object>{'saveState' => dc.sObjectToMap(saveState)};
		VlocityDiagnosticStepCreatorController.updateSaveState(JSON.serialize(payload));

		Map<String,Object> output = VlocityDiagnosticStepCreatorController.getSaveStateAndStepCreators();

		vlocity_ins__VlocitySystemLog__c saveState2 = (vlocity_ins__VlocitySystemLog__c) dc.mapToSObject((Map<String,Object>)output.get('saveState'), 'vlocity_ins__VlocitySystemLog__c');

		System.assertEquals (saveState2.vlocity_ins__LogData__c, saveState.vlocity_ins__LogData__c);
	}

	@isTest static void saveStaticResourceTest_Fail()
	{
		//SETMOCK
		Test.setMock(HttpCalloutMock.class, new VlocityDiagnosticWizardTestHTTPCallout(
				     200,
				     'OK',
				     '{}'
				     ));

		//Attempt 1 - No fileName
		Boolean hasError = false;

		Test.startTest();
		try
		{
			Map<String,Object> output = VlocityDiagnosticStepCreatorController.saveStaticResource('{}');
		}
		catch (Exception e)
		{
			hasError = true;
		}
		Test.stopTest();

		System.assertEquals(hasError, true);
	}

	@isTest static void saveStaticResourceTest_Pass()
	{
		//SETMOCK
		Test.setMock(HttpCalloutMock.class, new VlocityDiagnosticWizardTestHTTPCallout(
				     200,
				     'OK',
				     '{}'
				     ));

		//Attempt 2 - Pass
		String fileName = 'VlocityStepCreator_Test_' + VlocityDiagnosticWizardTestDataFactory.randomString(10);
		Map<String,Object> payload2 = new Map<String,Object> {
			'Name' => fileName
		};

		Test.startTest();
		Map<String,Object> output2 = VlocityDiagnosticStepCreatorController.saveStaticResource(JSON.serialize(payload2));
		Test.stopTest();
		
		System.assertEquals (output2.get('hasErrors'), false);
	}
}
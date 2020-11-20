@isTest
private class VlocityDiagnosticWizardTest
{

	/**
	 * getDiagnosticStepsTest tests getDiagnosticSteps('...')
	 */
	@isTest static void getDiagnosticStepsTest()
	{
		VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(10, 'Auto');
		List<Map<String,Object> > steps = VlocityDiagnosticWizardController.getDiagnosticSteps('Diagnostic');
		System.assert (steps != null);
	}

	/**
	 * updateDiagnosticStepTest tests updateDiagnosticStep()
	 */
	@isTest static void updateDiagnosticStepTest()
	{
		VlocityDiagnosticWizardDescriber dc = new VlocityDiagnosticWizardDescriber();
		dc.nsPrefix = 'vlocity_ins__';

		List<UpgradeStep__c> steps = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(5, 'Auto');

		//Success
		Map<String,Object> payloadSuccess = new Map<String,Object>{'step' => dc.sObjectToMap(steps[0])};
		Map<String,Object> outputSuccess = VlocityDiagnosticWizardController.updateDiagnosticStep(JSON.serialize(payloadSuccess));
		System.assertEquals(outputSuccess.get('hasErrors'),false);

		//Error
		Boolean hasErrors = false;
		steps[1].Name = null;
		try
		{
			Map<String,Object> payloadError = new Map<String,Object>{'step' => dc.sObjectToMap(steps[1])};
			Map<String,Object> outputError = VlocityDiagnosticWizardController.updateDiagnosticStep(JSON.serialize(payloadError));
		}
		catch (System.DMLException e)
		{
			hasErrors = true;
		}
		System.assertEquals(hasErrors, true);
	}

	@isTest static void upsertAllPlansTest()
	{
		Map<String,Object> output = VlocityDiagnosticWizardController.upsertAllPlans();
		System.assertEquals(output.get('hasErrors'), false);
	}

	@isTest static void upsertAllPlansAllOptionsTest()
	{
		Map<String,Object> output = VlocityDiagnosticWizardHandler.upsertAllPlans(true);
		System.assertEquals(output.get('hasErrors'), false);

		Map<String,Object> output2 = VlocityDiagnosticWizardHandler.upsertAllPlans(false);
		System.assertEquals(output2.get('hasErrors'), false);
	}

	@isTest static void restoreStepsTest()
	{
		VlocityDiagnosticWizardDescriber dc = new VlocityDiagnosticWizardDescriber();
		dc.nsPrefix = 'vlocity_ins__';

		List<UpgradeStep__c> steps = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(10, 'Manual');
		UpgradeStep__c emptyStep = new UpgradeStep__c(
			Name='EmptyStep',
			ExternalId__c='EmptyStep',
			UniqueId__c='EmptyStep',
			UpgradePlanId__c=steps[0].UpgradePlanId__c
			);

		steps.add(emptyStep);

		Database.upsert(steps, UpgradeStep__c.Fields.UniqueId__c, true);

		//create populated step log
		steps[0].Description__c = 'This is a note';
		steps[0].LastExecutionDateTime__c = System.Now();
		steps[0].LastCheckDateTime__c = System.Now();

		Map<String,Object> payload0 = new Map<String,Object>{'step' => dc.sObjectToMap(steps[0])};
		VlocityDiagnosticWizardController.updateDiagnosticStep(JSON.serialize(payload0));

		//create empty step log
		vlocity_ins__VlocitySystemLog__c emptyLog = VlocityDiagnosticWizardHandler.getSaveStateLog(emptyStep);
		upsert emptyLog;

		//prepare steps for upsert by querying save state logs
		steps = VlocityDiagnosticWizardHandler.restoreSteps(steps);
	}

	@isTest static void prepareStepsTest_FailNoName()
	{
		UpgradePlan__c plan = VlocityDiagnosticWizardTestDataFactory.createUpgradePlan(true);
		List<UpgradeStep__c> steps = VlocityDiagnosticWizardTestDataFactory.createUpgradeSteps(2,'Manual',plan.Id,false,'','','');
		steps[1].Name = null;

		Boolean hasErrors = false;
		try
		{
			VlocityDiagnosticWizardHandler.prepareSteps(plan, steps);
		}
		catch (Exception e)
		{
			hasErrors = true;
		}
		System.assertEquals(hasErrors, true);
	}

	@isTest static void prepareStepsTest_FailNoEid()
	{
		UpgradePlan__c plan = VlocityDiagnosticWizardTestDataFactory.createUpgradePlan(true);
		List<UpgradeStep__c> steps = VlocityDiagnosticWizardTestDataFactory.createUpgradeSteps(2,'Manual',plan.Id,false,'','','');
		steps[1].ExternalId__c = null;

		Boolean hasErrors = false;
		try
		{
			VlocityDiagnosticWizardHandler.prepareSteps(plan, steps);
		}
		catch (Exception e)
		{
			hasErrors = true;
		}
		System.assertEquals(hasErrors, true);
	}

	@isTest static void prepareStepsTest_FailNoUid()
	{
		UpgradePlan__c plan = VlocityDiagnosticWizardTestDataFactory.createUpgradePlan(true);
		List<UpgradeStep__c> steps = VlocityDiagnosticWizardTestDataFactory.createUpgradeSteps(2,'Manual',plan.Id,false,'','','');
		steps[1].UniqueId__c = null;

		Boolean hasErrors = false;
		try
		{
			VlocityDiagnosticWizardHandler.prepareSteps(plan, steps);
		}
		catch (Exception e)
		{
			hasErrors = true;
		}
		System.assertEquals(hasErrors, true);
	}

	@isTest static void getActionSystemLogsTest()
	{
		VlocityDiagnosticWizardDescriber dc = new VlocityDiagnosticWizardDescriber();
		dc.nsPrefix = 'vlocity_ins__';

		UpgradeStep__c step = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(1, 'Manual')[0];

		Map<String,Object> payload = new Map<String,Object> {'step' => dc.sObjectToMap(step), 'numRecords' => 10};
		VlocityDiagnosticWizardController.getActionSystemLogs(JSON.serialize(payload));
	}

	@isTest static void UpgradeStepTriggerTest()
	{
		//No Name
		try
		{
			UpgradeStep__c step1 = new UpgradeStep__c();
			insert step1;
		}
		catch (System.DMLException e) {}

		//No External Id
		try
		{
			String rand = VlocityDiagnosticWizardTestDataFactory.randomString(10);
			UpgradeStep__c step = new UpgradeStep__c(Name='Test' + rand);
			insert step;
		}
		catch (System.DMLException e) {}

		//No Unique Id
		try
		{
			String rand = VlocityDiagnosticWizardTestDataFactory.randomString(10);
			UpgradeStep__c step = new UpgradeStep__c(
				Name='Test' + rand,
				ExternalId__c='Test' + rand
				);
			insert step;
		}
		catch (System.DMLException e) {}

		//No Upgrade Plan Id
		try
		{
			String rand = VlocityDiagnosticWizardTestDataFactory.randomString(10);
			UpgradeStep__c step = new UpgradeStep__c(
				Name='Name' + rand,
				ExternalId__c='ExternalId' + rand,
				UniqueId__c='Test' + rand
				);
			insert step;
		}
		catch (System.DMLException e) {}

		//replace PreCursorStepUniqueId__c
		try
		{
			List<UpgradeStep__c> steps1 = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(5, 'Auto');
			steps1[1].PreCursorStepUniqueId__c = steps1[0].UniqueId__c;

			upsert steps1;
		}
		catch (System.DMLException e) {}
	}

	@isTest static void getVFSessionIdTest()
	{
		VlocityDiagnosticWizardController.getVFSessionId();
	}

	@isTest static void getStepCreatorMaps()
	{
		List<Map<String,Object> > stepCreatorMaps = VlocityDiagnosticWizardController.getStepCreatorMaps();
	}

	@isTest static void invokeActionTest_BlankOptions()
	{
		List<UpgradeStep__c> steps = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(1, 'Auto');

		List<Map<String,Object> > stepMaps = VlocityDiagnosticWizardController.getDiagnosticSteps('Diagnostic');

		Map<String,Object> payload = new Map<String,Object>{'step' => stepMaps[0], 'options' => null};
		System.assertEquals(VlocityDiagnosticWizardController.invokeAction(JSON.serialize(payload)).get('hasErrors'), true);
	}

	@isTest static void invokeActionTest_PrecursorNotComplete()
	{
		UpgradePlan__c plan = VlocityDiagnosticWizardTestDataFactory.createUpgradePlan(true);

		List<UpgradeStep__c> steps = VlocityDiagnosticWizardTestDataFactory.createUpgradeSteps(2,'Manual',plan.Id,false,'','','');

		steps[1].PreCursorStepUniqueId__c = steps[0].UniqueId__c;
		steps[1].PrecursorStepId__c = steps[0].Id;

		Database.upsert(steps, UpgradeStep__c.Fields.UniqueId__c, true);
		Database.upsert(steps, UpgradeStep__c.Fields.UniqueId__c, true);

		Map<String,Object> options = (Map<String,Object>)JSON.deserializeUntyped('{"inputMethodKey":"ExecutionMethod"}');
		List<Map<String,Object> > stepMaps = VlocityDiagnosticWizardController.getDiagnosticSteps('Diagnostic');

		Map<String,Object> payload = new Map<String,Object>{'step' => stepMaps[1], 'options' => options};
		Map<String,Object> output = VlocityDiagnosticWizardController.invokeAction(JSON.serialize(payload));
	}

	@isTest static void invokeActionTest_NoInputMethod()
	{
		List<UpgradeStep__c> steps = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(5, 'Auto');

		// No inputMethod
		Map<String,Object> options = (Map<String,Object>)JSON.deserializeUntyped('{"key1":"val1"}');
		List<Map<String,Object> > stepMaps = VlocityDiagnosticWizardController.getDiagnosticSteps('Diagnostic');

		Map<String,Object> payload = new Map<String,Object>{'step' => stepMaps[2], 'options' => options};
		System.assertEquals(VlocityDiagnosticWizardController.invokeAction(JSON.serialize(payload)).get('hasErrors'), false);
	}

	@isTest static void invokeActionTest_ExecutionNoInputMethod()
	{
		List<UpgradeStep__c> steps = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(5, 'Auto');

		// No inputMethod
		Map<String,Object> options = (Map<String,Object>)JSON.deserializeUntyped('{"inputMethodKey":"ExecutionMethod"}');

		List<Map<String,Object> > stepMaps = VlocityDiagnosticWizardController.getDiagnosticSteps('Diagnostic');

		Map<String,Object> payload = new Map<String,Object>{'step' => stepMaps[2], 'options' => options};
		System.assertEquals(VlocityDiagnosticWizardController.invokeAction(JSON.serialize(payload)).get('hasErrors'), false);
	}

	@isTest static void invokeActionTest_InvokeMethod_Fail1()
	{
		List<UpgradeStep__c> steps = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(5, 'Auto');

		// No inputMethod
		String rand = VlocityDiagnosticWizardTestDataFactory.randomString(10);
		Map<String,Object> options = (Map<String,Object>)JSON.deserializeUntyped('{"inputMethodKey":"ExecutionMethod", "inputMethod":"TestClass' + rand + '.testMethod"}');
		List<Map<String,Object> > stepMaps = VlocityDiagnosticWizardController.getDiagnosticSteps('Diagnostic');

		Boolean hasErrors = false;
		try
		{
			Map<String,Object> payload = new Map<String,Object>{'step' => stepMaps[2], 'options' => options};
			Map<String,Object> output = VlocityDiagnosticWizardController.invokeAction(JSON.serialize(payload));
            hasErrors = (Boolean)output.get('hasErrors');
		}
		catch (Exception e)
		{
			hasErrors = true;
		}

		System.assertEquals(hasErrors, true);
	}

	@isTest static void invokeActionTest_InvokeMethod_Pass1()
	{
		List<UpgradeStep__c> steps = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(5, 'Auto');

		// No inputMethod
		String rand = VlocityDiagnosticWizardTestDataFactory.randomString(10);
		Map<String,Object> options = (Map<String,Object>)JSON.deserializeUntyped('{"inputMethodKey":"ExecutionMethod", "inputMethod":"VlocityDiagnosticWizardBaseMethods.PLACEHOLDER"}');
		List<Map<String,Object> > stepMaps = VlocityDiagnosticWizardController.getDiagnosticSteps('Diagnostic');

		Map<String,Object> payload = new Map<String,Object>{'step' => stepMaps[2], 'options' => options};
		System.assertEquals(VlocityDiagnosticWizardController.invokeAction(JSON.serialize(payload)).get('hasErrors'), false);
	}

	@isTest static void throwAuraExceptionTest()
	{
		String errorType = '';
		try
		{
			try
			{
				throw new AuraHandledException('testAuraException');
			}
			catch (Exception e)
			{
				VlocityDiagnosticWizardController.throwAuraException('', e);
			}
		}
		catch (Exception ae)
		{
			errorType = ae.getTypeName();
		}

		System.assertEquals(errorType, 'System.AuraHandledException');
	}
}
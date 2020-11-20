@isTest
private class VlocityDiagnosticWizardBaseMethodsTest
{
	private static vlocity_ins__TriggerSetup__c allTriggersInstance;

	static
	{
		allTriggersInstance = new vlocity_ins__TriggerSetup__c(name='AllTriggers', vlocity_ins__IsTriggerOn__c=false);
		upsert allTriggersInstance;
	}

	@isTest static void InvokeCheckBatchStatusTestFail_NoAsyncApexJob()
	{
		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = new Map<String,Object> {'BatchJobsToMonitor'=>'ThisIsNotAClass'};

		String methodName = 'checkBatchStatus';

		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');
		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		//Fail - No AsyncApexJob records to query
		UpgradeStep__c step = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(1, 'Manual')[0];
		step.LastExecutionDateTime__c = System.now();
		update step;
		inputs.put('record', step);

		Test.startTest();
		Object result2 = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),true);
	}

	@isTest static void InvokeCheckBatchStatusTestFail_WrongAsyncApexJob()
	{
		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = new Map<String,Object> {'BatchJobsToMonitor'=>'VlocityDiagnosticWizardTestBatchClass,ThisWillFail'};

		String methodName = 'checkBatchStatus';

		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');
		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		UpgradeStep__c step = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(1, 'Manual')[0];
		step.LastExecutionDateTime__c = System.now();
		update step;

		Test.startTest();
		//Execute corresponding batch job
		VlocityDiagnosticWizardTestBatchClass batchJob = new VlocityDiagnosticWizardTestBatchClass();
		Database.executeBatch(batchJob);
		Test.stopTest();

		//Fail - VlocityDiagnosticWizardTestBatchClass Was Found, but not ThisWillFail
		inputs.put('record', step);

		Object result3 = classInstance.invokeMethod(methodName, inputs, output, options);

		System.assertEquals(output.get('hasErrors'),true);
	}

	@isTest static void InvokeCheckBatchStatusTestPass()
	{
		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = new Map<String,Object> {'BatchJobsToMonitor'=>'VlocityDiagnosticWizardTestBatchClass'};

		String methodName = 'checkBatchStatus';

		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');
		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		UpgradeStep__c step = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(1, 'Manual')[0];
		step.LastExecutionDateTime__c = System.now();
		update step;

		Test.startTest();
		//Execute corresponding batch job
		VlocityDiagnosticWizardTestBatchClass batchJob = new VlocityDiagnosticWizardTestBatchClass();
		Database.executeBatch(batchJob);
		Test.stopTest();

		//Pass
		inputs.put('record', step);

		Object result3 = classInstance.invokeMethod(methodName, inputs, output, options);

	}

	@isTest static void checkAndSetSObjectTest()
	{
		//Fail - vlocity_ins__IsTriggerOn__c == false
		Map<String,Object> inputs1 = new Map<String,Object>();
		Map<String,Object> output1 = new Map<String,Object>();
		Map<String,Object> options1 = new Map<String,Object>
		{'SObject'=>
			    new Map<String,Object> {'SObjectType'=>'vlocity_ins__TriggerSetup__c',
			                            'Name'=>'AllTriggers',
			                            'vlocity_ins__IsTriggerOn__c'=>true}};
		String methodName1 = 'checkSObject';
		Type classType1 = Type.forName('VlocityDiagnosticWizardBaseMethods');
		vlocity_ins.VlocityOpenInterface2 classInstance1 = (vlocity_ins.VlocityOpenInterface2) classType1.newInstance();
		Object result1 = classInstance1.invokeMethod(methodName1, inputs1, output1, options1);
		System.assertEquals(output1.get('hasErrors'),true);


		//Pass - vlocity_ins__IsTriggerOn__c set to true
		Map<String,Object> inputs2 = new Map<String,Object>();
		Map<String,Object> output2 = new Map<String,Object>();
		Map<String,Object> options2 = new Map<String,Object>
		{'SObject'=>
			    new Map<String,Object> {'SObjectType'=>'vlocity_ins__TriggerSetup__c',
			                            'Name'=>'AllTriggers',
			                            'vlocity_ins__IsTriggerOn__c'=>true}};
		String methodName2 = 'setSObject';
		Type classType2 = Type.forName('VlocityDiagnosticWizardBaseMethods');
		vlocity_ins.VlocityOpenInterface2 classInstance2 = (vlocity_ins.VlocityOpenInterface2) classType2.newInstance();
		Object result2 = classInstance2.invokeMethod(methodName2, inputs2, output2, options2);
		System.assertEquals(output2.get('hasErrors'),false);


		//Pass - vlocity_ins__IsTriggerOn__c == true
		Map<String,Object> inputs3 = new Map<String,Object>();
		Map<String,Object> output3 = new Map<String,Object>();
		Map<String,Object> options3 = new Map<String,Object>
		{'SObject'=>
			    new Map<String,Object> {'SObjectType'=>'vlocity_ins__TriggerSetup__c',
			                            'Name'=>'AllTriggers',
			                            'vlocity_ins__IsTriggerOn__c'=>true}};
		String methodName3 = 'checkSObject';
		Type classType3 = Type.forName('VlocityDiagnosticWizardBaseMethods');
		vlocity_ins.VlocityOpenInterface2 classInstance3 = (vlocity_ins.VlocityOpenInterface2) classType3.newInstance();
		Object result3 = classInstance3.invokeMethod(methodName3, inputs3, output3, options3);
		System.assertEquals(output3.get('hasErrors'),false);
	}

	@isTest static void toolingQueryCustomFieldTestFail()
	{
		//SETMOCK
		Test.setMock(HttpCalloutMock.class, new VlocityDiagnosticWizardTestHTTPCallout(
				     200,
				     'OK',
				     '{}'
				     ));

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();

		Map<String,Object> options = new Map<String,Object> {
			'ToolingAPI' => new Map<String,Object> {
				'ObjectName' => 'TestObject'+VlocityDiagnosticWizardTestDataFactory.randomString(10),
				'FieldName' => 'TestField'+VlocityDiagnosticWizardTestDataFactory.randomString(10)
			}
		};

		String methodName = 'toolingQueryCustomField';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();
	}

	@isTest static void toolingQueryCustomFieldTestPass()
	{
		//SETMOCK
		Test.setMock(HttpCalloutMock.class, new VlocityDiagnosticWizardTestHTTPCallout(
				     200,
				     'OK',
				     '{}'
				     ));

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();

		Map<String,Object> options = new Map<String,Object> {
			'ToolingAPI' => new Map<String,Object> {
				'ObjectName' => 'UpgradeStep__c',
				'FieldName' => 'Type__c'
			}
		};

		String methodName = 'toolingQueryCustomField';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();
	}

	@isTest static void toolingUpdateSObjectTest()
	{
		//SETMOCK
		Test.setMock(HttpCalloutMock.class, new VlocityDiagnosticWizardTestHTTPCallout(
				     200,
				     'OK',
				     '{}'
				     ));

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();

		Map<String,Object> options = new Map<String,Object> {
			'ToolingAPI' => new Map<String,Object> {
				'SObjectType' => 'CustomField',
				'objectId' => VlocityDiagnosticWizardTestDataFactory.randomString(18),
				'objectPayload' => '{ "SampleProperty" : "' + VlocityDiagnosticWizardTestDataFactory.randomString(200) + '"}'
			}
		};

		String methodName = 'toolingUpdateSObject';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),false);
	}

	@isTest static void toolingCreateSObjectTest()
	{
		//SETMOCK
		Test.setMock(HttpCalloutMock.class, new VlocityDiagnosticWizardTestHTTPCallout(
				     200,
				     'OK',
				     '{}'
				     ));

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();

		Map<String,Object> options = new Map<String,Object> {
			'ToolingAPI' => new Map<String,Object> {
				'SObjectType' => 'RemoteProxy',
				'objectPayload' => '{ "SampleProperty" : "' + VlocityDiagnosticWizardTestDataFactory.randomString(200) + '"}'
			}
		};

		String methodName = 'toolingCreateSObject';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),false);
	}

	@isTest static void toolingQuerySObjectTest()
	{
		//SETMOCK
		Test.setMock(HttpCalloutMock.class, new VlocityDiagnosticWizardTestHTTPCallout(
				     200,
				     'OK',
				     '{}'
				     ));

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();

		Map<String,Object> options = new Map<String,Object> {
			'ToolingAPI' => new Map<String,Object> {
				'SObjectType' => 'RemoteProxy',
				'UniqueField' => 'SiteName',
				'SiteName' => 'value' + VlocityDiagnosticWizardTestDataFactory.randomString(10)
			}
		};

		String methodName = 'toolingQuerySObject';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),false);
	}

	@isTest static void invalidMethodCallTest()
	{
		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = new Map<String,Object>();

		String methodName = 'INVALIDMETHOD'+VlocityDiagnosticWizardTestDataFactory.randomString(10);
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),true);
	}

	@isTest static void placeholderMethodTest()
	{
		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = new Map<String,Object>();

		String methodName = 'PLACEHOLDER';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),false);
	}

	@isTest static void checkSObjectsExistTestFail_NoNumberInput()
	{
		String methodName = 'checkSObjectsExist';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = (Map<String,Object>) JSON.deserializeUntyped(
			'{"SObject":{"SObjectType":"UpgradeStep__c"},"SObjectQuery":{"Compare":">"}}'
			);

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),true);
	}

	@isTest static void checkSObjectsExistTestFail_WrongOptions()
	{
		String methodName = 'checkSObjectsExist';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = (Map<String,Object>) JSON.deserializeUntyped(
			'{"SObject":{"SObjectType":"UpgradeStep__c"},"SObjectQuery":{}}'
			);

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),true);
	}

	@isTest static void checkSObjectsExistTestFail_WrongOperator()
	{
		String methodName = 'checkSObjectsExist';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = (Map<String,Object>) JSON.deserializeUntyped(
			'{"SObject":{"SObjectType":"UpgradeStep__c"},"SObjectQuery":{"Compare":">>>2"}}'
			);

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),true);
	}

	@isTest static void checkSObjectsExistTestFail_GreaterThan()
	{
		String methodName = 'checkSObjectsExist';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = (Map<String,Object>) JSON.deserializeUntyped(
			'{"SObject":{"SObjectType":"UpgradeStep__c"},"SObjectQuery":{"Compare":">2"}}'
			);

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),true);
	}

	@isTest static void checkSObjectsExistTestFail_LessThan()
	{
		String methodName = 'checkSObjectsExist';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = (Map<String,Object>) JSON.deserializeUntyped(
			'{"SObject":{"SObjectType":"UpgradeStep__c"},"SObjectQuery":{"Compare":"<5"}}'
			);

		VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(10, 'Manual');

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),true);
	}

	@isTest static void checkSObjectsExistTestFail_Equals()
	{
		String methodName = 'checkSObjectsExist';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = (Map<String,Object>) JSON.deserializeUntyped(
			'{"SObject":{"SObjectType":"UpgradeStep__c"},"SObjectQuery":{"Compare":"==5"}}'
			);

		VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(10, 'Manual');

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),true);
	}

	@isTest static void checkSObjectsExistTestFail_NotEquals()
	{
		String methodName = 'checkSObjectsExist';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = (Map<String,Object>) JSON.deserializeUntyped(
			'{"SObject":{"SObjectType":"UpgradeStep__c"},"SObjectQuery":{"Compare":"!=10"}}'
			);

		VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(10, 'Manual');

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),true);
	}

	@isTest static void checkSObjectsExistTestPass()
	{
		String methodName = 'checkSObjectsExist';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = (Map<String,Object>) JSON.deserializeUntyped(
			'{"SObject":{"SObjectType":"UpgradeStep__c"},"SObjectQuery":{"Compare":">2"}}'
			);

		VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(10, 'Manual');

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),false);
	}

	@isTest static void deployDataPackTest()
	{
		String methodName = 'deployDataPack';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = (Map<String,Object>) JSON.deserializeUntyped(
			'{"DataPackName":"DP_CUSTOM_StoryObjectConfiguration"}'
			);

		vlocity_ins.CorePostInstallClass.runDev2ProdInserts();

        UpgradeStep__c step = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(1, 'Manual')[0];
        step.StepFrequency__c = 'First Install';
		step.LastExecutionDateTime__c = System.now();
		update step;
		inputs.put('record', step);

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),false);
        System.assertEquals(1, [ Select count() from vlocity_ins__VlocityDataPack__c ]);
	}

	@isTest static void checkDefaultContractTypeTest()
	{
		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = new Map<String,Object>();

		String methodName = 'checkDefaultContractType';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();


		System.assertEquals(output.get('hasErrors'),true);
	}

	@isTest static void createDefaultContractTypeTest()
	{
		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = new Map<String,Object>();

		String methodName = 'createDefaultContractType';
		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');

		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		Test.startTest();
		Object result = classInstance.invokeMethod(methodName, inputs, output, options);
		Test.stopTest();

		System.assertEquals(output.get('hasErrors'),false);
	}

	@isTest static void runBatchJobTest()
	{
        Id batchJobId = null;
		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = new Map<String,Object> {'JobName' => 'VlocityDiagnosticWizardTestBatchClass'};

		String methodName = 'runBatchJob';

		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');
		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		UpgradeStep__c step = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(1, 'Manual')[0];
        step.StepFrequency__c = 'First Install';
		step.LastExecutionDateTime__c = System.now();
		update step;
		inputs.put('record', step);

		Test.startTest();

        // Make sure we have a batch job
		Object result2 = classInstance.invokeMethod(methodName, inputs, output, options);
        batchJobId = (Id)output.get('batchJobId');
        step.RelatedBatchJobId__c = batchJobId;
		System.assertEquals(false, output.get('hasErrors'));
		System.assertNotEquals(null, batchJobId);

        // Run again, should get the same ID
		output = new Map<String,Object>();
		result2 = classInstance.invokeMethod(methodName, inputs, output, options);
		System.assertEquals(false, output.get('hasErrors'));
		System.assertEquals(batchJobId, (Id)output.get('batchJobId'));


		Test.stopTest();
	}

    @isTest static void runBatchJobInvalidNameTest()
	{
        Id batchJobId = null;
		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = new Map<String,Object> {'JobName' => 'vlocity_ins.DRDataPackServiceBatch'};

		String methodName = 'runBatchJob';

		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');
		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		//Fail - No AsyncApexJob records to query
		UpgradeStep__c step = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(1, 'Manual')[0];
		update step;
		inputs.put('record', step);

		Test.startTest();
		Object result2 = classInstance.invokeMethod(methodName, inputs, output, options);
		System.assertEquals(true, output.get('hasErrors'));
		Test.stopTest();
	}

	@isTest static void runApexJobTest()
	{
        Id batchJobId = null;
		Map<String,Object> inputs = new Map<String,Object>();
		Map<String,Object> output = new Map<String,Object>();
		Map<String,Object> options = new Map<String,Object> {'JobName' => 'VlocityDiagnosticWizardTestApexJob'};

		String methodName = 'runApexJob';

		Type classType = Type.forName('VlocityDiagnosticWizardBaseMethods');
		vlocity_ins.VlocityOpenInterface2 classInstance = (vlocity_ins.VlocityOpenInterface2) classType.newInstance();

		UpgradeStep__c step = VlocityDiagnosticWizardTestDataFactory.createUpgradePlanAndSteps(1, 'Manual')[0];
        step.StepFrequency__c = 'First Install';
		step.LastExecutionDateTime__c = System.now();
		update step;
		inputs.put('record', step);

		Test.startTest();

        // Make sure we have a batch job
		Object result2 = classInstance.invokeMethod(methodName, inputs, output, options);
        batchJobId = (Id)output.get('batchJobId');
        step.RelatedBatchJobId__c = batchJobId;
		System.assertEquals(false, output.get('hasErrors'));
		System.assertNotEquals(null, batchJobId);

        // Run again, should get the same ID
		output = new Map<String,Object>();
		result2 = classInstance.invokeMethod(methodName, inputs, output, options);
		System.assertEquals(false, output.get('hasErrors'));
		System.assertEquals(batchJobId, (Id)output.get('batchJobId'));


		Test.stopTest();
	}

}
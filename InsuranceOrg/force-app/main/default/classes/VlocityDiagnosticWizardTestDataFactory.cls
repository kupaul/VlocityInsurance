@isTest
public class VlocityDiagnosticWizardTestDataFactory
{
	private static VlocityDiagnosticWizardDescriber dc = new VlocityDiagnosticWizardDescriber();

	/**
	 * createUpgradeSteps creates list of UpgradeStep__c records for use in test methods
	 * @param  numSteps      numSteps is the number of steps to be created
	 * @param  stepType      stepType is the type of step to be created (Manual,Auto,Group)
	 * @param  performInsert performInsert defines whether steps should be inserted
	 * @return               return List<UpgradeStep__c> of created steps
	 */
	public static UpgradePlan__c createUpgradePlan(Boolean performInsert)
	{
		String planName = 'TestUpgradePlan'+randomString(10);
		UpgradePlan__c plan = new UpgradePlan__c(Name = planName,
		                                         UniqueId__c = planName);
		if (performInsert) insert plan;
		return plan;
	}

	public static List<UpgradeStep__c> createUpgradeSteps(Integer numSteps,
	                                                      String stepType,
	                                                      Id upgradePlanId,
	                                                      Boolean performInsert,
	                                                      String preCheckMethod,
	                                                      String postCheckMethod,
	                                                      String executionMethod)
	{
		List<UpgradeStep__c> steps = new List<UpgradeStep__c>();
		for (Integer i=0; i<numSteps; i++)
		{
			UpgradeStep__c step = new UpgradeStep__c();
			step.Name = 'TestUpgradeStep'+randomString(10) + i;
			step.ExternalId__c = step.Name;
			step.UniqueId__c = step.Name;
			step.UpgradePlanId__c = upgradePlanId;
			step.StepFrequency__c = 'Diagnostic';
			step.Type__c = stepType;
			step.LastCheckStatus__c = 'Not Started';
			step.LastExecutionStatus__c = 'Not Started';

			if (!String.isEmpty(preCheckMethod))
				step.PreCheckMethod__c = preCheckMethod + randomString(10);
			if (!String.isEmpty(postCheckMethod))
				step.PostCheckMethod__c = postCheckMethod + randomString(10);
			if (!String.isEmpty(executionMethod))
				step.ExecutionMethod__c = executionMethod + randomString(10);

			steps.add(step);
		}

		if (performInsert) insert steps;
		return steps;
	}

	public static List<UpgradeStep__c> createUpgradePlanAndSteps(Integer numSteps, String stepType)
	{
		UpgradePlan__c plan = createUpgradePlan(true);
		List<UpgradeStep__c> steps = createUpgradeSteps(numSteps,
		                                                stepType,
		                                                plan.Id,
		                                                true,
		                                                'TestClass'+randomString(10)+'.preCheckMethod',
		                                                'TestClass'+randomString(10)+'.postCheckMethod',
		                                                'TestClass'+randomString(10)+'.executionMethod');
		return steps;
	}

	/**
	 * randomString creates random string for use in test methods (to keep track of created records)
	 * @param  len len is the length of the string
	 * @return     return random String
	 */
	public static String randomString(Integer len)
	{
		final String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
		String randStr = '';
		while (randStr.length() < len)
		{
			Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
			randStr += chars.substring(idx, idx+1);
		}
		return randStr;
	}

	/**
	 * createStepCreatorData creates
	 * @param  numStaticResources numStaticResources is the number of strings to be created
	 * @return                    return List<String>
	 */
	public static List<String> createStepCreatorData(Integer numStaticResources)
	{
		List<String> stepCreatorContents = new List<String>();

		for (Integer i = 0; i < numStaticResources; i++)
		{

			UpgradePlan__c plan = createUpgradePlan(false);

			List<UpgradeStep__c> steps = new List<UpgradeStep__c>();

			// 0 - 20 steps
			Integer numSteps = Math.round(20 * Math.random());

			for (Integer i2 = 0; i2 < numSteps; i2++)
			{
				UpgradeStep__c step = new UpgradeStep__c();
				step.Name = 'TestUpgradeStep'+randomString(10) + i2;
				step.ExternalId__c = step.Name;
				step.UniqueId__c = step.Name;
				step.StepFrequency__c = 'Diagnostic';
				step.Type__c = 'Manual';
				step.LastCheckStatus__c = 'Not Started';
				step.LastExecutionStatus__c = 'Not Started';
				steps.add(step);
			}

			Map<String,Object> stepCreator = new Map<String,Object> {
				'type' => 'VlocityStepCreator',
				'fileName' => 'VlocityStepCreator_' + randomString(10),
				'plan' => dc.sObjectToMap(plan),
				'steps' => dc.sObjectToMap_List(steps)
			};

			stepCreatorContents.add(JSON.serialize(stepCreator));
		}

		return stepCreatorContents;
	}
}
trigger UpgradeStep on UpgradeStep__c (before insert, before update)
{
	//always
	for (UpgradeStep__c step : Trigger.New)
	{
		if (String.isBlank(step.Name))
		{
			step.Name.addError('Step Name field is null');
		}
		else if (String.isBlank(step.ExternalId__c))
		{
			step.ExternalId__c.addError('Step ExternalId__c field is null');
		}
		else if (String.isBlank(step.UniqueId__c))
		{
			step.UniqueId__c.addError('Step UniqueId__c field is null');
		}
		else if (step.UpgradePlanId__c == null)
		{
			step.UpgradePlanId__c.addError('Step "' + step.Name + '" field Parent Upgrade Plan is null');
		}
	}

	//on update
	if (Trigger.isUpdate && Trigger.isBefore)
	{
		Map<String,UpgradeStep__c> stepMap = new Map<String,UpgradeStep__c>();
		for (UpgradeStep__c step : Trigger.New)
		{
			stepMap.put(step.UniqueId__c, step);
		}

		for (UpgradeStep__c step : stepMap.values())
		{
			if (step.ParentStepUniqueId__c!=null)
			{
				UpgradeStep__c parentStep = stepMap.get(step.ParentStepUniqueId__c);
				if (parentStep!=null)
				{
					step.ParentStepId__c = parentStep.Id;
				}
			}
			if (step.PrecursorStepUniqueId__c!=null)
			{
				UpgradeStep__c PrecursorStep = stepMap.get(step.PrecursorStepUniqueId__c);
				if (PrecursorStep!=null)
				{
					step.PrecursorStepId__c = PrecursorStep.Id;
				}
			}
		}
	}
}
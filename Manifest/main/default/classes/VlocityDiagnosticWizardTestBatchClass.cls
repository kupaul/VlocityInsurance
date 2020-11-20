public with sharing class VlocityDiagnosticWizardTestBatchClass implements Database.Batchable<sObject>, Database.Stateful
{
	public Database.QueryLocator start(Database.BatchableContext bc)
	{
		return Database.getQueryLocator('SELECT Id, Name FROM UpgradeStep__c');
	}

	public void execute(Database.BatchableContext bc, List<sObject> scope)
	{
		System.debug(scope);
		List<UpgradeStep__c> steps = (List<UpgradeStep__c>) scope;
		for (UpgradeStep__c step : steps)
		{
			System.debug(step.Name);
		}

		update steps;
	}

	public void finish(Database.BatchableContext bc)
	{
		System.debug('Test Batch Done');
	}
}